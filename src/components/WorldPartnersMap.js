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
import {
  pickLocalized,
  quadBezierBetween,
  PARTNERS_MAP_SIZE,
  PARTNERS_MAP_BASE_SCALE,
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
              stroke="#2563eb"
              strokeWidth={width}
              strokeLinecap="round"
              opacity={isDim ? 0.28 : opacity}
              style={{
                transition:
                  'stroke-width 0.35s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          );
        })}
      </g>
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
                pathLength: { duration: 0.62, ease: LINE_DRAW_EASE },
                strokeWidth: { ...LINE_SPRING, delay: 0.04 },
                opacity: { duration: 0.2 },
              }}
            />
          );
        })}
      </g>
    </g>
  );
}

/** 品牌主色：枢纽图钉与站点视觉统一（与合作伙伴红钉同形异色） */
const HUB_BRAND = '#086c7b';
const HUB_BRAND_ACTIVE = '#0f766e';
const HUB_PULSE_RING = '#14b8a6';

/** 仅用图钉，无文字标签 */
function MapPinOnly({
  point,
  isHub,
  highlighted,
  coarsePointer,
  lang,
  onHighlightChange,
  connectNodeIds,
}) {
  const id = point.id;
  const title = pickLocalized(point.title, lang);
  const subtitle = pickLocalized(point.subtitle, lang);
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
      ? HUB_BRAND_ACTIVE
      : HUB_BRAND
    : highlighted
      ? '#1d4ed8'
      : '#e11d48';

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

  return (
    <Marker coordinates={[lng, lat]}>
      <g
        tabIndex={0}
        role="button"
        aria-label={`${title}. ${subtitle}`}
        aria-pressed={highlighted}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onMarkerClick}
        onFocus={() => {
          if (isHub && connectNodeIds) onHighlightChange(new Set(connectNodeIds));
          else onHighlightChange(new Set([id]));
        }}
        onBlur={(e) => {
          if (!e.currentTarget.ownerSVGElement?.contains(e.relatedTarget)) {
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
        <rect x="-56" y="-72" width="112" height="88" fill="transparent" />

        <motion.g
          initial={false}
          animate={{ scale: highlighted ? 1.22 : 1 }}
          transition={{ type: 'spring', stiffness: 460, damping: 22 }}
          style={{ transformOrigin: '0px -28px' }}
        >
          {highlighted ? (
            <motion.circle
              cx={0}
              cy={-24}
              r={18}
              fill="none"
              stroke={isHub ? HUB_PULSE_RING : '#3b82f6'}
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: [0.45, 0.75, 0.45],
                scale: [1, 1.45, 1],
              }}
              transition={{
                duration: 1.85,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ) : null}
          <g transform="translate(-12, -26)">
            <MapPin
              size={26}
              strokeWidth={2.25}
              stroke="#ffffff"
              fill={pinFill}
              className="drop-shadow-md"
              aria-hidden
            />
          </g>
        </motion.g>
      </g>
    </Marker>
  );
}

function brandGroupKey(node) {
  const t = node.title;
  if (t && typeof t === 'object') return t.zh || t.en || t.ja || node.id;
  return node.id;
}

export default function WorldPartnersMap() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language || 'zh';
  const [data, setData] = useState(DEFAULT_DATA);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState(null);
  const coarsePointer = useCoarsePointer();
  const containerRef = useRef(null);
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
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setHighlightedNodeIds(null);
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

  const isGroupActive = useCallback(
    (group) =>
      highlightedNodeIds &&
      group.nodeIds.length === highlightedNodeIds.size &&
      group.nodeIds.every((id) => highlightedNodeIds.has(id)),
    [highlightedNodeIds],
  );

  const onBrandEnter = useCallback(
    (group) => {
      if (!coarsePointer) setHighlightedNodeIds(new Set(group.nodeIds));
    },
    [coarsePointer],
  );

  const onBrandClick = useCallback(
    (e, group) => {
      if (!coarsePointer) return;
      e.stopPropagation();
      setHighlightedNodeIds((prev) => {
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
    setHighlightedNodeIds(next);
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full min-h-0 bg-transparent relative">
      <motion.div
        className="relative h-full w-full overflow-hidden bg-transparent"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
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
          onClick={() => setHighlightedNodeIds(null)}
        >
          <defs>
            <linearGradient id="partnerLineActive" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
              <stop offset="45%" stopColor="#2563eb" stopOpacity={1} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
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
                floodColor="#1e40af"
                floodOpacity="0.14"
              />
            </filter>
          </defs>

          <Geographies geography={worldAtlas}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  className="pointer-events-none"
                  style={{
                    default: {
                      fill: '#e4e4e7',
                      stroke: '#d4d4d8',
                      strokeWidth: 0.35,
                      outline: 'none',
                    },
                    hover: {
                      fill: '#e4e4e7',
                      stroke: '#d4d4d8',
                      outline: 'none',
                    },
                    pressed: {
                      fill: '#e4e4e7',
                      outline: 'none',
                    },
                  }}
                />
              ))
            }
          </Geographies>

          <HubQuadBezierLinks
            hubLng={hubLng}
            hubLat={hubLat}
            nodes={data.nodes}
            highlightedNodeIds={highlightedNodeIds}
          />

          {data.nodes.map((node) => (
            <MapPinOnly
              key={node.id}
              point={node}
              isHub={false}
              highlighted={Boolean(highlightedNodeIds?.has(node.id))}
              coarsePointer={coarsePointer}
              lang={lang}
              onHighlightChange={setHighlightFromMarker}
            />
          ))}

          <MapPinOnly
            point={data.hub}
            isHub
            highlighted={
              connectNodeIds.length > 0 &&
              highlightedNodeIds != null &&
              connectNodeIds.every((id) => highlightedNodeIds.has(id)) &&
              highlightedNodeIds.size === connectNodeIds.length
            }
            coarsePointer={coarsePointer}
            lang={lang}
            onHighlightChange={setHighlightFromMarker}
            connectNodeIds={connectNodeIds}
          />
        </ComposableMap>

        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-3 px-2"
          aria-hidden={false}
        >
          <div
            className="pointer-events-auto flex max-w-[min(96%,920px)] flex-wrap items-center justify-center gap-2"
            onMouseLeave={() => {
              if (!coarsePointer) setHighlightedNodeIds(null);
            }}
          >
            {brandGroups.map((group) => {
              const active = isGroupActive(group);
              return (
                <button
                  key={group.key}
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 ${
                    active
                      ? 'border-[#2563eb] bg-[#2563eb] text-white'
                      : 'border-gray-200 bg-white/95 text-gray-800 hover:border-[#2563eb]/60 hover:bg-blue-50/90'
                  }`}
                  onMouseEnter={() => onBrandEnter(group)}
                  onFocus={() => onBrandEnter(group)}
                  onBlur={(e) => {
                    if (e.currentTarget.parentElement?.contains(e.relatedTarget)) return;
                    if (!coarsePointer) setHighlightedNodeIds(null);
                  }}
                  onClick={(e) => onBrandClick(e, group)}
                >
                  {group.label}
                </button>
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
