import { geoEqualEarth } from 'd3-geo';

/** 与 WorldPartnersMap 中 ComposableMap 一致，供像素空间碰撞计算 */
export const PARTNERS_MAP_SIZE = { width: 1000, height: 520 };

/** 与 1000px 宽设计稿对应的基准 scale（ComposableMap 同步） */
export const PARTNERS_MAP_BASE_SCALE = 246;

export function createPartnersMapProjection(
  width = PARTNERS_MAP_SIZE.width,
  height = PARTNERS_MAP_SIZE.height,
) {
  const scale = PARTNERS_MAP_BASE_SCALE * (width / PARTNERS_MAP_SIZE.width);
  return geoEqualEarth()
    .translate([width / 2, height / 2])
    .center([12, 16])
    .scale(scale);
}

/** 标签外框（与组件内 foreignObject 一致，单位 px） */
export const LABEL_BOX = {
  hub: { w: 94, h: 39, y: -60 },
  node: { w: 77, h: 33, y: -53 },
};

/** 锚点处图钉占用区域（相对锚点；与 MapPin 13px + translate(-6,-13) 一致并略留边） */
export const PIN_LOCAL_BOX = { left: -14, top: -18, right: 8, bottom: 4 };

const COLLIDE_PAD = 2;

function rectInflate(r, pad) {
  return {
    left: r.left - pad,
    top: r.top - pad,
    right: r.right + pad,
    bottom: r.bottom + pad,
  };
}

function rectsOverlap(a, b) {
  return !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
}

function overlapDepth(a, b) {
  const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  if (ox <= 0 || oy <= 0) return null;
  return { ox, oy };
}

function labelRectScreen(projection, lng, lat, isHub, dx, dy) {
  const p = projection([Number(lng), Number(lat)]);
  if (!p) return null;
  const [px, py] = p;
  const d = isHub ? LABEL_BOX.hub : LABEL_BOX.node;
  const left = px + (-d.w / 2 + dx);
  const top = py + (d.y + dy);
  return rectInflate(
    { left, top, right: left + d.w, bottom: top + d.h },
    COLLIDE_PAD,
  );
}

function pinRectScreen(projection, lng, lat) {
  const p = projection([Number(lng), Number(lat)]);
  if (!p) return null;
  const [px, py] = p;
  const b = PIN_LOCAL_BOX;
  return rectInflate(
    {
      left: px + b.left,
      top: py + b.top,
      right: px + b.right,
      bottom: py + b.bottom,
    },
    COLLIDE_PAD,
  );
}

function pushTwoLabels(ra, rb, oa, ob) {
  const d = overlapDepth(ra, rb);
  if (!d) return;
  const h = d.ox < d.oy;
  const move = (h ? d.ox : d.oy) / 2 + 0.5;
  if (h) {
    const rax = (ra.left + ra.right) / 2;
    const rbx = (rb.left + rb.right) / 2;
    const sign = rax < rbx ? -1 : 1;
    oa.dx += move * sign;
    ob.dx -= move * sign;
  } else {
    const ray = (ra.top + ra.bottom) / 2;
    const rby = (rb.top + rb.bottom) / 2;
    const sign = ray < rby ? -1 : 1;
    oa.dy += move * sign;
    ob.dy -= move * sign;
  }
}

function pushLabelFromPin(labelRect, pinRect, o) {
  const d = overlapDepth(labelRect, pinRect);
  if (!d) return;
  const lcx = (labelRect.left + labelRect.right) / 2;
  const lcy = (labelRect.top + labelRect.bottom) / 2;
  const pcx = (pinRect.left + pinRect.right) / 2;
  const pcy = (pinRect.top + pinRect.bottom) / 2;
  if (d.ox < d.oy) {
    const sign = lcx < pcx ? -1 : 1;
    o.dx += (d.ox + 0.5) * sign;
  } else {
    const sign = lcy < pcy ? -1 : 1;
    o.dy += (d.oy + 0.5) * sign;
  }
}

/**
 * 在像素空间迭代分离标签与标签、标签与他人图钉，使尽量接近 baseOffsets。
 * @returns {Map<string, { dx: number, dy: number }>}
 */
export function resolveLabelCollisionOffsets({ hub, nodes, baseOffsets, projection }) {
  const items = [
    {
      id: hub.id,
      lng: hub.lng,
      lat: hub.lat,
      isHub: true,
    },
    ...nodes.map((n) => ({
      id: n.id,
      lng: n.lng,
      lat: n.lat,
      isHub: false,
    })),
  ];

  const offsets = new Map();
  for (const it of items) {
    const b = baseOffsets.get(it.id) || { dx: 0, dy: 0 };
    offsets.set(it.id, { dx: b.dx, dy: b.dy });
  }

  const maxIter = 72;
  for (let iter = 0; iter < maxIter; iter += 1) {
    let changed = false;
    for (const it of items) {
      const o = offsets.get(it.id);
      const li = labelRectScreen(projection, it.lng, it.lat, it.isHub, o.dx, o.dy);
      const pi = pinRectScreen(projection, it.lng, it.lat);
      if (li && pi && rectsOverlap(li, pi)) {
        pushLabelFromPin(li, pi, o);
        changed = true;
      }
    }
    for (let i = 0; i < items.length; i += 1) {
      for (let j = i + 1; j < items.length; j += 1) {
        const ai = items[i];
        const aj = items[j];
        const oi = offsets.get(ai.id);
        const oj = offsets.get(aj.id);
        const li = labelRectScreen(projection, ai.lng, ai.lat, ai.isHub, oi.dx, oi.dy);
        const lj = labelRectScreen(projection, aj.lng, aj.lat, aj.isHub, oj.dx, oj.dy);
        const pi = pinRectScreen(projection, ai.lng, ai.lat);
        const pj = pinRectScreen(projection, aj.lng, aj.lat);
        if (!li || !lj || !pi || !pj) continue;

        if (rectsOverlap(li, lj)) {
          pushTwoLabels(li, lj, oi, oj);
          changed = true;
        }
        if (rectsOverlap(li, pj)) {
          pushLabelFromPin(li, pj, oi);
          changed = true;
        }
        if (rectsOverlap(lj, pi)) {
          pushLabelFromPin(lj, pi, oj);
          changed = true;
        }
      }
    }
    if (!changed) break;
  }

  return offsets;
}

/**
 * 枢纽周边密集节点：标签在像素上扇形排开，减少重叠。可选 JSON 字段 labelDx / labelDy 覆盖。
 * @returns {Map<string, { dx: number, dy: number }>}
 */
export function buildLabelOffsetMap(hub, nodes, options = {}) {
  const clusterDeg = options.clusterDeg ?? 5.8;
  const hLat = Number(hub.lat);
  const hLng = Number(hub.lng);
  const dist = (p) => Math.hypot(Number(p.lat) - hLat, Number(p.lng) - hLng);

  const offsets = new Map();

  const nearby = nodes
    .filter((n) => n.id !== hub.id && dist(n) < clusterDeg)
    .sort(
      (a, b) =>
        Math.atan2(Number(a.lat) - hLat, Number(a.lng) - hLng) -
        Math.atan2(Number(b.lat) - hLat, Number(b.lng) - hLng),
    );

  const crowded = nearby.length >= 2;
  offsets.set(hub.id, {
    dx: crowded && nearby.length >= 5 ? -72 : 0,
    dy: crowded ? -22 : 0,
  });

  nearby.forEach((n, i) => {
    const total = Math.max(nearby.length, 1);
    const angle = (2 * Math.PI * i) / total - Math.PI / 2;
    const ring = Math.floor(i / 9);
    const r = 84 + ring * 46;
    offsets.set(n.id, {
      dx: Math.cos(angle) * r,
      dy: Math.sin(angle) * r - 6,
    });
  });

  for (const n of nodes) {
    if (!offsets.has(n.id)) {
      offsets.set(n.id, { dx: 0, dy: 0 });
    }
  }

  for (const n of nodes) {
    if (n.labelDx == null && n.labelDy == null) continue;
    const cur = offsets.get(n.id) || { dx: 0, dy: 0 };
    offsets.set(n.id, {
      dx: n.labelDx != null ? Number(n.labelDx) : cur.dx,
      dy: n.labelDy != null ? Number(n.labelDy) : cur.dy,
    });
  }
  if (hub.labelDx != null || hub.labelDy != null) {
    const cur = offsets.get(hub.id) || { dx: 0, dy: 0 };
    offsets.set(hub.id, {
      dx: hub.labelDx != null ? Number(hub.labelDx) : cur.dx,
      dy: hub.labelDy != null ? Number(hub.labelDy) : cur.dy,
    });
  }

  return offsets;
}

/**
 * 等距圆柱投影（与常见世界平面图一致）：经纬度 → SVG viewBox 内坐标
 * @param {number} lat 纬度 -90..90
 * @param {number} lng 经度 -180..180
 * @param {{ w: number, h: number }} viewBox
 * @returns {{ x: number, y: number }}
 */
export function latLngToXY(lat, lng, viewBox = { w: 1000, h: 520 }) {
  const { w, h } = viewBox;
  const x = ((Number(lng) + 180) / 360) * w;
  const y = ((90 - Number(lat)) / 180) * h;
  return { x, y };
}

/**
 * 投影平面上的二次贝塞尔：弦的中点沿法线外凸（示意弧线，非大圆）。
 * @param {number} bendFactor 外凸强度，相对弦长
 * @param {number} maxBendPx 外凸上限（px），避免过长弦弯得过大
 */
export function quadBezierBetween(x1, y1, x2, y2, bendFactor = 0.22, maxBendPx = 72) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const bend = Math.min(len * bendFactor, maxBendPx);
  const cx = mx + nx * bend;
  const cy = my + ny * bend;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

/** 从多语言对象取当前语言文案 */
export function pickLocalized(obj, lang) {
  if (typeof obj === 'string') return obj;
  if (!obj || typeof obj !== 'object') return '';
  const key = lang.startsWith('ja') ? 'ja' : lang.startsWith('en') ? 'en' : 'zh';
  return obj[key] || obj.zh || obj.en || obj.ja || '';
}
