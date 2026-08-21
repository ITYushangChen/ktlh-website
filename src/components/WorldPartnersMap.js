import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  useMapContext,
} from 'react-simple-maps';
import worldAtlas from 'world-atlas/countries-110m.json';
import { feature } from 'topojson-client';
import {
  pickLocalized,
  quadBezierBetween,
  PARTNERS_MAP_SIZE,
  PARTNERS_MAP_BASE_SCALE,
  LABEL_BOX,
  buildLabelOffsetMap,
  resolveLabelCollisionOffsets,
  collectPartnerCountryNames,
  createPartnersMapProjection,
  resolveHighlightLabelOffsets,
  HIGHLIGHT_LABEL_BOX,
} from '../utils/partnersMapGeo';

const DEFAULT_DATA = {
  hub: {
    id: 'qingdao_hub',
    lat: 36.15,
    lng: 120.05,
    title: { zh: '开拓隆海', en: 'Kaituo Longhai', ja: '開拓隆海' },
    subtitle: { zh: '青岛胶州', en: 'Jiaozhou, Qingdao', ja: '青島膠州' },
    image: '',
  },
  nodes: [],
};

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return coarse;
}

function lineStyle(edgeFromId, highlightedSet) {
  if (!highlightedSet || highlightedSet.size === 0) {
    return { opacity: 0.72, width: 1.35 };
  }
  if (highlightedSet.has(edgeFromId)) {
    return { opacity: 1, width: 2.85 };
  }
  return { opacity: 0.34, width: 1.15 };
}

/** 二次贝塞尔外凸系数 */
const LINK_BEND_FACTOR = 0.2;
const LINK_MAX_BEND_PX = 68;

const LINE_SPRING = { type: 'spring', stiffness: 380, damping: 22, mass: 0.65 };
const LINE_DRAW_EASE = [0.16, 1, 0.3, 1];

function HubQuadBezierLinks({ hubLng, hubLat, nodes, highlightedNodeIds }) {
  const { projection } = useMapContext();
  const pHub = projection([Number(hubLng), Number(hubLat)]);
  const list = nodes.filter((n) => n.connectToHub !== false);

  return (
    <g>
      <g filter="url(#worldPartnerArcShadow)">
        {list.map((node) => {
          const pTo = projection([Number(node.lng), Number(node.lat)]);
          if (!pHub || !pTo) return null;
          const d = quadBezierBetween(
            pHub[0],
            pHub[1],
            pTo[0],
            pTo[1],
            LINK_BEND_FACTOR,
            LINK_MAX_BEND_PX,
          );
          const hasSel = highlightedNodeIds && highlightedNodeIds.size > 0;
          const isActive = hasSel && highlightedNodeIds.has(node.id);
          const isDim = hasSel && !highlightedNodeIds.has(node.id);
          const { opacity, width } = lineStyle(node.id, highlightedNodeIds);
          if (isActive) return null;

          return (
            <path
              key={`link-${node.id}`}
              d={d}
              fill="none"
              stroke={HUB_BRAND}
              strokeWidth={width}
              strokeLinecap="round"
              opacity={isDim ? 0.28 : opacity}
              pointerEvents="none"
              style={{
                transition:
                  'stroke-width 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          );
        })}
      </g>
    </g>
  );
}

/** 高亮连线单独一层，需在标记之后插入才能压在最上；见 WorldPartnersMap 内渲染顺序 */
function HubActiveLinksOnly({ hubLng, hubLat, nodes, highlightedNodeIds }) {
  const { projection } = useMapContext();
  const pHub = projection([Number(hubLng), Number(hubLat)]);
  const list = nodes.filter((n) => n.connectToHub !== false);

  return (
    <g className="pointer-events-none" style={{ isolation: 'isolate' }}>
      {list.map((node) => {
        const pTo = projection([Number(node.lng), Number(node.lat)]);
        if (!pHub || !pTo) return null;
        const d = quadBezierBetween(
          pHub[0],
          pHub[1],
          pTo[0],
          pTo[1],
          LINK_BEND_FACTOR,
          LINK_MAX_BEND_PX,
        );
        const hasSel = highlightedNodeIds && highlightedNodeIds.size > 0;
        const isActive = hasSel && highlightedNodeIds.has(node.id);
        if (!isActive) return null;

        return (
          <motion.path
            key={`link-active-${node.id}`}
            d={d}
            fill="none"
            stroke="url(#partnerLineActive)"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#partnerLineGlow)"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0.75 }}
            animate={{
              pathLength: 1,
              opacity: 1,
              strokeWidth: 4.1,
            }}
            transition={{
              pathLength: { duration: 1.0, ease: LINE_DRAW_EASE },
              strokeWidth: { ...LINE_SPRING, delay: 0.04 },
              opacity: { duration: 0.2 },
            }}
          />
        );
      })}
    </g>
  );
}

function HubRevealLinks({ hubLng, hubLat, nodes, newestId, drawDuration = 1.4, staticMap = false }) {
  const { projection } = useMapContext();
  const pHub = projection([Number(hubLng), Number(hubLat)]);
  if (!pHub) return null;

  return (
    <g className="pointer-events-none">
      {nodes.map((node) => {
        const pTo = projection([Number(node.lng), Number(node.lat)]);
        if (!pTo) return null;
        const d = quadBezierBetween(
          pHub[0],
          pHub[1],
          pTo[0],
          pTo[1],
          LINK_BEND_FACTOR,
          LINK_MAX_BEND_PX,
        );
        const isNew = node.id === newestId;
        if (staticMap) {
          return (
            <path
              key={`link-reveal-${node.id}`}
              d={d}
              fill="none"
              stroke={HUB_BRAND}
              strokeWidth={2.4}
              strokeLinecap="round"
              filter="url(#worldPartnerArcShadow)"
              opacity={1}
            />
          );
        }
        return (
          <motion.path
            key={`link-reveal-${node.id}`}
            d={d}
            fill="none"
            stroke={HUB_BRAND}
            strokeWidth={2.4}
            strokeLinecap="round"
            filter="url(#worldPartnerArcShadow)"
            initial={isNew ? { pathLength: 0, opacity: 0.35 } : false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: { duration: isNew ? drawDuration : 0.4, ease: LINE_DRAW_EASE },
              opacity: { duration: isNew ? 0.8 : 0.2 },
            }}
          />
        );
      })}
    </g>
  );
}

/** 连线出现时同步显示的地名标签（与最开始的紧凑标签样式一致） */
function RevealLocationLabel({ point, lang, isHub = false, offset = { dx: 0, dy: 0 }, staticMap = false }) {
  const { projection } = useMapContext();
  const p = projection([Number(point.lng), Number(point.lat)]);
  if (!p) return null;
  const [px, py] = p;
  const box = isHub ? LABEL_BOX.hub : LABEL_BOX.node;
  const title = pickLocalized(point.title, lang);
  const place = pickLocalized(point.subtitle, lang);

  if (staticMap) {
    return (
      <g
        transform={`translate(${px + offset.dx}, ${py + offset.dy})`}
        className="pointer-events-none"
      >
        <foreignObject
          x={-box.w / 2}
          y={box.y}
          width={box.w}
          height={box.h}
          style={{ overflow: 'visible' }}
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="rounded border border-[#086c7b]/30 bg-white/95 px-1.5 py-1 text-center shadow-sm"
          >
            <div className="text-[10px] font-semibold leading-tight text-[#123a63] truncate">
              {title}
            </div>
            <div className="text-[9px] leading-tight text-gray-600 truncate">{place}</div>
          </div>
        </foreignObject>
      </g>
    );
  }

  return (
    <motion.g
      transform={`translate(${px + offset.dx}, ${py + offset.dy})`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pointer-events-none"
    >
      <foreignObject
        x={-box.w / 2}
        y={box.y}
        width={box.w}
        height={box.h}
        style={{ overflow: 'visible' }}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="rounded border border-[#086c7b]/30 bg-white/95 px-1.5 py-1 text-center shadow-sm"
        >
          <div className="text-[10px] font-semibold leading-tight text-[#123a63] truncate">
            {title}
          </div>
          <div className="text-[9px] leading-tight text-gray-600 truncate">{place}</div>
        </div>
      </foreignObject>
    </motion.g>
  );
}

/** 品牌主色：连线 */
const HUB_BRAND = '#086c7b';

/** 战略合作伙伴所在国家：浅蓝单色（略深） */
const PARTNER_COUNTRY_FILL = '#c2e0eb';
const PARTNER_COUNTRY_STROKE = '#7ab5c6';
const PARTNER_COUNTRY_FILL_ACTIVE = '#6aadc0';
const PARTNER_COUNTRY_STROKE_ACTIVE = '#086c7b';

/** 图钉 */
const PIN_FILL = '#5aadc0';
const PIN_FILL_ACTIVE = '#086c7b';
/** 开拓隆海枢纽图钉：红色 */
const HUB_PIN_FILL = '#dc2626';
const HUB_PIN_FILL_ACTIVE = '#b91c1c';
const DEFAULT_COUNTRY_FILL = '#e4e4e7';
const DEFAULT_COUNTRY_STROKE = '#d4d4d8';

function geographyCountryStyle(countryName, partnerCountries, activeCountries) {
  const isPartner = partnerCountries.has(countryName);
  const isActive = activeCountries.has(countryName);

  if (isPartner && isActive) {
    return {
      fill: PARTNER_COUNTRY_FILL_ACTIVE,
      stroke: PARTNER_COUNTRY_STROKE_ACTIVE,
      strokeWidth: 0.7,
      outline: 'none',
    };
  }
  if (isPartner) {
    return {
      fill: PARTNER_COUNTRY_FILL,
      stroke: PARTNER_COUNTRY_STROKE,
      strokeWidth: 0.45,
      outline: 'none',
    };
  }
  return {
    fill: DEFAULT_COUNTRY_FILL,
    stroke: DEFAULT_COUNTRY_STROKE,
    strokeWidth: 0.35,
    outline: 'none',
  };
}

/** 优先 JSON 的 address 多语言，否则用 subtitle（地区/说明） */
function addressLineFromPoint(point, lang) {
  if (point.address && typeof point.address === 'object') {
    return pickLocalized(point.address, lang);
  }
  return pickLocalized(point.subtitle, lang);
}

/** 仅用图钉；高亮时显示标题 + 地址说明 */
function MapPinOnly({
  point,
  isHub,
  highlighted,
  coarsePointer,
  lang,
  onHighlightChange,
  connectNodeIds,
  labelOffset = { dx: 0, dy: 0 },
}) {
  const id = point.id;
  const title = pickLocalized(point.title, lang);
  const subtitle = pickLocalized(point.subtitle, lang);
  const addressLine = addressLineFromPoint(point, lang);
  const lng = Number(point.lng);
  const lat = Number(point.lat);

  const onEnter = useCallback(() => {
    if (!coarsePointer) {
      if (isHub && connectNodeIds) {
        onHighlightChange(new Set(connectNodeIds));
      } else {
        onHighlightChange(new Set([id]));
      }
    }
  }, [coarsePointer, isHub, id, connectNodeIds, onHighlightChange]);

  const onLeave = useCallback(() => {
    if (!coarsePointer) onHighlightChange(null);
  }, [coarsePointer, onHighlightChange]);

  const pinFill = isHub
    ? highlighted
      ? HUB_PIN_FILL_ACTIVE
      : HUB_PIN_FILL
    : highlighted
      ? PIN_FILL_ACTIVE
      : PIN_FILL;

  const pinSize = isHub ? 34 : 26;
  const pinTx = -pinSize / 2;
  const pinTy = -pinSize;
  const pinStrokeW = isHub ? 2.55 : 2.25;
  /** 仅图钉附近小圆触发悬停，避免大矩形与邻近标记重复触发 */
  const hitR = coarsePointer ? pinSize * 0.58 : pinSize * 0.5;
  const hitCy = -pinSize * 0.48;

  const onMarkerClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!coarsePointer) return;
      if (isHub && connectNodeIds) {
        onHighlightChange((prev) => {
          const all =
            connectNodeIds.length > 0 &&
            prev &&
            connectNodeIds.every((nid) => prev.has(nid)) &&
            prev.size === connectNodeIds.length;
          return all ? null : new Set(connectNodeIds);
        });
      } else {
        onHighlightChange((prev) => (prev?.has(id) && prev.size === 1 ? null : new Set([id])));
      }
    },
    [coarsePointer, isHub, id, connectNodeIds, onHighlightChange],
  );

  const onMarkerLeaveGroup = useCallback(
    (e) => {
      const rt = e.relatedTarget;
      if (rt instanceof Node && e.currentTarget.contains(rt)) return;
      onLeave();
    },
    [onLeave],
  );

  return (
    <Marker coordinates={[lng, lat]}>
      <g
        tabIndex={0}
        role="button"
        aria-label={`${title}. ${addressLine || subtitle}`}
        aria-pressed={highlighted}
        onMouseLeave={onMarkerLeaveGroup}
        onFocus={() => {
          if (isHub && connectNodeIds) onHighlightChange(new Set(connectNodeIds));
          else onHighlightChange(new Set([id]));
        }}
        onBlur={(e) => {
          if (
            !e.relatedTarget ||
            !e.currentTarget.ownerSVGElement?.contains(e.relatedTarget)
          ) {
            onHighlightChange(null);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onMarkerClick(e);
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <g style={{ pointerEvents: 'none' }}>
          <motion.g
            initial={false}
            animate={{ scale: highlighted ? 1.22 : 1 }}
            transition={{ type: 'spring', stiffness: 460, damping: 22 }}
            style={{ transformOrigin: `0px ${pinTy}px` }}
          >
            <g transform={`translate(${pinTx}, ${pinTy})`}>
              <MapPin
                size={pinSize}
                strokeWidth={pinStrokeW}
                stroke="#ffffff"
                fill={pinFill}
                className="pointer-events-none drop-shadow-md"
                aria-hidden
              />
            </g>
          </motion.g>
        </g>
        {highlighted && !isHub ? (
          <motion.g
            initial={false}
            animate={{ x: labelOffset.dx, y: labelOffset.dy }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <foreignObject
              x={-HIGHLIGHT_LABEL_BOX.w / 2}
              y={HIGHLIGHT_LABEL_BOX.y}
              width={HIGHLIGHT_LABEL_BOX.w}
              height={HIGHLIGHT_LABEL_BOX.h}
              style={{ overflow: 'visible', pointerEvents: 'auto' }}
            >
              <div
                xmlns="http://www.w3.org/1999/xhtml"
                className="rounded-none border border-gray-200 bg-white px-2.5 py-1.5 text-center shadow-lg"
                onMouseEnter={onEnter}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkerClick(e);
                }}
              >
                <div className="text-[13px] font-semibold leading-tight text-gray-900">{title}</div>
                {addressLine ? (
                  <div className="mt-0.5 text-[11px] leading-snug text-gray-600">{addressLine}</div>
                ) : null}
              </div>
            </foreignObject>
          </motion.g>
        ) : null}
        <circle
          cx={0}
          cy={hitCy}
          r={hitR}
          fill="transparent"
          stroke="none"
          pointerEvents="all"
          style={{ cursor: 'pointer' }}
          onMouseEnter={onEnter}
          onClick={onMarkerClick}
        />
      </g>
    </Marker>
  );
}

function brandGroupKey(node) {
  const t = node.title;
  if (t && typeof t === 'object') return t.zh || t.en || t.ja || node.id;
  return node.id;
}

export default function WorldPartnersMap({ progress = 0, onConnectNodesChange, staticMap = false }) {
  const { i18n, t } = useTranslation();
  const lang = i18n.language || 'en';
  const [data, setData] = useState(DEFAULT_DATA);
  const [userHighlightedNodeIds, setUserHighlightedNodeIds] = useState(null);
  const coarsePointer = useCoarsePointer();
  const containerRef = useRef(null);
  const countryFeatures = useMemo(
    () => feature(worldAtlas, worldAtlas.objects.countries).features,
    [],
  );
  const [dims, setDims] = useState({
    width: PARTNERS_MAP_SIZE.width,
    height: PARTNERS_MAP_SIZE.height,
  });

  useEffect(() => {
    fetch(`/content/partners-map.json?t=${Date.now()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.hub && Array.isArray(json.nodes)) {
          setData({
            hub: { ...DEFAULT_DATA.hub, ...json.hub },
            nodes: json.nodes,
            highlightCountries: json.highlightCountries || [],
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    onConnectNodesChange?.(data.nodes.filter((n) => n.connectToHub !== false).length);
  }, [data, onConnectNodesChange]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setUserHighlightedNodeIds(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const measure = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width >= 64 && height >= 64) {
        setDims({ width: Math.round(width), height: Math.round(height) });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const hubLng = Number(data.hub.lng);
  const hubLat = Number(data.hub.lat);

  /** 连接总部枢纽的节点列表 */
  const connectNodes = useMemo(
    () => data.nodes.filter((n) => n.connectToHub !== false),
    [data.nodes],
  );

  // 随滚动进度，每步显示一条连线（从 0 开始，最后一步全部显示）
  const scrollRevealedIds = useMemo(() => {
    const n = connectNodes.length;
    const count = Math.max(0, Math.min(n, Math.floor(progress * n + 1e-6)));
    return new Set(connectNodes.slice(0, count).map((node) => node.id));
  }, [connectNodes, progress]);

  const revealedNodes = useMemo(
    () => connectNodes.filter((node) => scrollRevealedIds.has(node.id)),
    [connectNodes, scrollRevealedIds],
  );
  const newestRevealedId =
    revealedNodes.length > 0 ? revealedNodes[revealedNodes.length - 1].id : null;

  // 国家高亮用于按顺序显示，用户悬停/点击时则以交互为准
  const highlightForCountries = userHighlightedNodeIds ?? scrollRevealedIds;

  const projectionScale =
    PARTNERS_MAP_BASE_SCALE * (dims.width / PARTNERS_MAP_SIZE.width);

  const brandGroups = useMemo(() => {
    const map = new Map();
    for (const node of data.nodes) {
      if (node.connectToHub === false) continue;
      const key = brandGroupKey(node);
      const label = pickLocalized(node.title, lang);
      if (!map.has(key)) {
        map.set(key, { key, label, nodeIds: [] });
      }
      map.get(key).nodeIds.push(node.id);
    }
    const list = Array.from(map.values());
    list.sort((a, b) => a.label.localeCompare(b.label, lang.startsWith('ja') ? 'ja' : 'zh-Hans-CN'));
    return list;
  }, [data.nodes, lang]);

  const connectNodeIds = useMemo(
    () => data.nodes.filter((n) => n.connectToHub !== false).map((n) => n.id),
    [data.nodes],
  );

  const partnerCountryNames = useMemo(
    () =>
      collectPartnerCountryNames(
        data.nodes,
        countryFeatures,
        data.highlightCountries || [],
      ),
    [data.nodes, countryFeatures, data.highlightCountries],
  );

  const activePartnerCountryNames = useMemo(() => {
    if (!highlightForCountries || highlightForCountries.size === 0) return new Set();
    const activeNodes = data.nodes.filter(
      (n) => n.connectToHub !== false && highlightForCountries.has(n.id),
    );
    return collectPartnerCountryNames(activeNodes, countryFeatures);
  }, [data.nodes, countryFeatures, highlightForCountries]);

  const hubAllHighlighted =
    connectNodeIds.length > 0 &&
    userHighlightedNodeIds != null &&
    connectNodeIds.every((id) => userHighlightedNodeIds.has(id)) &&
    userHighlightedNodeIds.size === connectNodeIds.length;

  const lowNodes = useMemo(
    () =>
      data.nodes.filter(
        (n) =>
          n.connectToHub !== false &&
          !(userHighlightedNodeIds && userHighlightedNodeIds.has(n.id)),
      ),
    [data.nodes, userHighlightedNodeIds],
  );

  const hiNodes = useMemo(
    () =>
      data.nodes.filter(
        (n) =>
          n.connectToHub !== false &&
          userHighlightedNodeIds &&
          userHighlightedNodeIds.has(n.id),
      ),
    [data.nodes, userHighlightedNodeIds],
  );

  const highlightLabelOffsets = useMemo(() => {
    if (!hiNodes.length) return new Map();
    const projection = createPartnersMapProjection(dims.width, dims.height);
    return resolveHighlightLabelOffsets(hiNodes, projection);
  }, [hiNodes, dims.width, dims.height]);

  // 滚动揭示阶段：为已显示连线的节点生成紧凑地名标签（复用最开始的标签排布逻辑）
  const revealLabelOffsets = useMemo(() => {
    if (userHighlightedNodeIds != null) return new Map();
    if (revealedNodes.length === 0 && data.hub.id) return new Map();
    const projection = createPartnersMapProjection(dims.width, dims.height);
    const base = buildLabelOffsetMap(data.hub, revealedNodes);
    return resolveLabelCollisionOffsets({
      hub: data.hub,
      nodes: revealedNodes,
      baseOffsets: base,
      projection,
    });
  }, [data.hub, revealedNodes, dims.width, dims.height, userHighlightedNodeIds]);

  const isGroupActive = useCallback(
    (group) =>
      userHighlightedNodeIds &&
      group.nodeIds.length === userHighlightedNodeIds.size &&
      group.nodeIds.every((id) => userHighlightedNodeIds.has(id)),
    [userHighlightedNodeIds],
  );

  const onBrandEnter = useCallback(
    (group) => {
      if (!coarsePointer) setUserHighlightedNodeIds(new Set(group.nodeIds));
    },
    [coarsePointer],
  );

  const onBrandClick = useCallback(
    (e, group) => {
      if (!coarsePointer) return;
      e.stopPropagation();
      setUserHighlightedNodeIds((prev) => {
        if (
          prev &&
          group.nodeIds.length === prev.size &&
          group.nodeIds.every((id) => prev.has(id))
        ) {
          return null;
        }
        return new Set(group.nodeIds);
      });
    },
    [coarsePointer],
  );

  const setHighlightFromMarker = useCallback((next) => {
    setUserHighlightedNodeIds(next);
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full min-h-0 bg-transparent relative">
      <motion.div
        className="relative h-full w-full overflow-hidden bg-transparent"
        initial={staticMap ? false : { opacity: 0, y: 12 }}
        whileInView={staticMap ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{
            scale: projectionScale,
            center: [12, 16],
          }}
          width={dims.width}
          height={dims.height}
          className="h-full w-full block select-none bg-transparent [&_.rsm-svg]:h-full [&_.rsm-svg]:w-full [&_.rsm-svg]:max-h-none [&_.rsm-svg]:overflow-visible [&_.rsm-svg]:bg-transparent"
          onClick={() => setUserHighlightedNodeIds(null)}
        >
          <defs>
            <linearGradient id="partnerLineActive" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity={1} />
              <stop offset="45%" stopColor="#086c7b" stopOpacity={1} />
              <stop offset="100%" stopColor="#0f766e" stopOpacity={1} />
            </linearGradient>
            <filter
              id="partnerLineGlow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
                result="soft"
              />
              <feMerge>
                <feMergeNode in="soft" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="worldPartnerArcShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="0.65"
                floodColor="#086c7b"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          <Geographies geography={worldAtlas}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName = geo.properties?.name;
                const geoStyle = geographyCountryStyle(
                  countryName,
                  partnerCountryNames,
                  activePartnerCountryNames,
                );
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    className="pointer-events-none"
                    style={{
                      default: geoStyle,
                      hover: geoStyle,
                      pressed: geoStyle,
                    }}
                  />
                );
              })
            }
          </Geographies>

          {userHighlightedNodeIds == null ? (
            <HubRevealLinks
              hubLng={hubLng}
              hubLat={hubLat}
              nodes={revealedNodes}
              newestId={newestRevealedId}
              staticMap={staticMap}
            />
          ) : (
            <>
              <HubQuadBezierLinks
                hubLng={hubLng}
                hubLat={hubLat}
                nodes={data.nodes}
                highlightedNodeIds={userHighlightedNodeIds}
              />
              <HubActiveLinksOnly
                hubLng={hubLng}
                hubLat={hubLat}
                nodes={data.nodes}
                highlightedNodeIds={userHighlightedNodeIds}
              />
            </>
          )}

          {lowNodes.map((node) => (
            <MapPinOnly
              key={node.id}
              point={node}
              isHub={false}
              highlighted={false}
              coarsePointer={coarsePointer}
              lang={lang}
              onHighlightChange={setHighlightFromMarker}
            />
          ))}

          {!hubAllHighlighted ? (
            <MapPinOnly
              key={`${data.hub.id}-base`}
              point={data.hub}
              isHub
              highlighted={false}
              coarsePointer={coarsePointer}
              lang={lang}
              onHighlightChange={setHighlightFromMarker}
              connectNodeIds={connectNodeIds}
            />
          ) : null}

          {[...hiNodes]
            .sort((a, b) => {
              const da = highlightLabelOffsets.get(a.id)?.dy ?? 0;
              const db = highlightLabelOffsets.get(b.id)?.dy ?? 0;
              return da - db;
            })
            .map((node) => (
            <MapPinOnly
              key={node.id}
              point={node}
              isHub={false}
              highlighted
              coarsePointer={coarsePointer}
              lang={lang}
              onHighlightChange={setHighlightFromMarker}
              labelOffset={highlightLabelOffsets.get(node.id) || { dx: 0, dy: 0 }}
            />
          ))}

          {hubAllHighlighted ? (
            <MapPinOnly
              key={`${data.hub.id}-top`}
              point={data.hub}
              isHub
              highlighted
              coarsePointer={coarsePointer}
              lang={lang}
              onHighlightChange={setHighlightFromMarker}
              connectNodeIds={connectNodeIds}
            />
          ) : null}

          {userHighlightedNodeIds == null && !staticMap && (
            <g className="pointer-events-none">
              <RevealLocationLabel
                point={data.hub}
                isHub
                lang={lang}
                offset={revealLabelOffsets.get(data.hub.id) || { dx: 0, dy: 0 }}
                staticMap={staticMap}
              />
              {revealedNodes.map((node) => (
                <RevealLocationLabel
                  key={`reveal-label-${node.id}`}
                  point={node}
                  lang={lang}
                  offset={revealLabelOffsets.get(node.id) || { dx: 0, dy: 0 }}
                  staticMap={staticMap}
                />
              ))}
            </g>
          )}
        </ComposableMap>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-4 px-3 sm:px-4"
          aria-hidden={false}
        >
          <div
            className="pointer-events-auto flex w-full max-w-[min(96%,920px)] flex-nowrap items-center gap-2 overflow-x-auto overflow-y-hidden overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:thin] [scrollbar-color:rgba(8,108,123,0.35)_transparent] snap-x snap-mandatory sm:flex-wrap sm:justify-center sm:overflow-x-visible sm:overflow-y-visible sm:snap-none [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#086c7b]/30"
            onMouseLeave={() => {
              if (!coarsePointer) setUserHighlightedNodeIds(null);
            }}
          >
            {brandGroups.map((group) => {
              const active = isGroupActive(group);
              return (
                <motion.button
                  key={group.key}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                  className={`shrink-0 snap-start rounded-none border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#086c7b] focus-visible:ring-offset-2 ${
                    active
                      ? 'border-[#086c7b] bg-[#086c7b] text-white shadow-sm ring-1 ring-inset ring-white/15'
                      : 'border-[#086c7b]/30 bg-white/60 text-gray-800 hover:border-[#086c7b]/50 hover:bg-teal-50/95'
                  }`}
                  onMouseEnter={() => onBrandEnter(group)}
                  onFocus={() => onBrandEnter(group)}
                  onBlur={(e) => {
                    if (
                      e.relatedTarget &&
                      e.currentTarget.parentElement?.contains(e.relatedTarget)
                    ) {
                      return;
                    }
                    if (!coarsePointer) setUserHighlightedNodeIds(null);
                  }}
                  onClick={(e) => onBrandClick(e, group)}
                >
                  <span className="inline-block max-w-[10rem] truncate sm:max-w-none">{group.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
      <p className="sr-only" aria-live="polite">
        {t('about.partners.mapAria', { defaultValue: '全球战略合作伙伴分布图' })}
      </p>
    </div>
  );
}
