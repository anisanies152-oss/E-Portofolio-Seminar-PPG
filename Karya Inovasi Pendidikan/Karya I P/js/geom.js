/* ============================================================================
   GEOM - satuan dunia = milimeter, sumbu y ke bawah (sama seperti kanvas).
   Sudut "tampilan" = derajat berlawanan jarum jam dari arah kanan (konvensi
   gambar teknik). Sudut "kanvas" = radian searah jarum jam (konvensi Canvas).
   ============================================================================ */
'use strict';
window.DTS_GEOM = (function () {
  const SHEET = { w: 420, h: 297 };            // A3 LANDSCAPE
  const MARGIN = { l: 20, t: 10, r: 10, b: 10 }; // garis tepi (kiri 20 mm untuk jilid)
  const TB = { w: 180, h: 25 };                 // kepala gambar
  const TAU = Math.PI * 2;
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;

  const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
  const norm360 = d => ((d % 360) + 360) % 360;
  const normRad = a => ((a % TAU) + TAU) % TAU;
  /** sudut tampilan (derajat, CCW, y ke atas) dari vektor kanvas */
  const dispAngle = (dx, dy) => norm360(Math.atan2(-dy, dx) * R2D);
  /** selisih sudut tak berarah (0..90) untuk garis */
  function lineAngDiff(a, b) {
    let d = Math.abs(norm360(a) % 180 - norm360(b) % 180);
    if (d > 90) d = 180 - d;
    return d;
  }
  function angDiff(a, b) { let d = Math.abs(norm360(a) - norm360(b)); return d > 180 ? 360 - d : d; }
  /** selisih sudut bertanda (rad) dalam rentang -PI..PI */
  function radDelta(a, b) { let d = b - a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; }

  function closestOnSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy;
    let t = L2 > 1e-12 ? ((px - x1) * dx + (py - y1) * dy) / L2 : 0;
    t = Math.max(0, Math.min(1, t));
    const x = x1 + t * dx, y = y1 + t * dy;
    return { x, y, t, d: dist(px, py, x, y) };
  }
  /** proyeksi ke garis tak hingga melalui (x1,y1)-(x2,y2) */
  function projectOnLine(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1e-12;
    const t = ((px - x1) * dx + (py - y1) * dy) / L2;
    return { x: x1 + t * dx, y: y1 + t * dy, t };
  }
  function rot(px, py, deg) {
    const r = deg * D2R, c = Math.cos(r), s = Math.sin(r);
    return { x: px * c - py * s, y: px * s + py * c };
  }
  function pointInPoly(px, py, pts) {
    let inside = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const a = pts[i], b = pts[j];
      if (((a.y > py) !== (b.y > py)) && (px < (b.x - a.x) * (py - a.y) / (b.y - a.y) + a.x)) inside = !inside;
    }
    return inside;
  }
  /** apakah sudut kanvas a (rad) berada dalam busur start..start+sweep */
  function angleInArc(a, start, sweep) {
    if (Math.abs(sweep) >= TAU - 1e-6) return true;
    if (sweep >= 0) return normRad(a - start) <= sweep + 1e-9;
    return normRad(start - a) <= -sweep + 1e-9;
  }

  /* ---------- format angka (koma desimal) ---------- */
  function fmt(v, dec) {
    dec = dec == null ? 1 : dec;
    const s = (Math.round(v * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec);
    return s.replace('.', ',').replace(/,0+$/, '');
  }

  /* ---------- geometri elemen ---------- */
  function lineLen(el) { return dist(el.x1, el.y1, el.x2, el.y2); }
  function lineAng(el) { return dispAngle(el.x2 - el.x1, el.y2 - el.y1); }

  function bbox(el) {
    if (el.type === 'line' || el.type === 'dim') return { x0: Math.min(el.x1, el.x2), y0: Math.min(el.y1, el.y2), x1: Math.max(el.x1, el.x2), y1: Math.max(el.y1, el.y2) };
    if (el.type === 'circle' || el.type === 'arc') return { x0: el.cx - el.r, y0: el.cy - el.r, x1: el.cx + el.r, y1: el.cy + el.r };
    if (el.type === 'path') {
      let b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
      for (const p of el.pts) { b.x0 = Math.min(b.x0, p[0]); b.y0 = Math.min(b.y0, p[1]); b.x1 = Math.max(b.x1, p[0]); b.y1 = Math.max(b.y1, p[1]); }
      return b;
    }
    if (el.type === 'text') { const w = (el.text || '').length * el.size * 0.58; return { x0: el.x, y0: el.y - el.size, x1: el.x + w, y1: el.y + el.size * 0.25 }; }
    return { x0: 0, y0: 0, x1: 0, y1: 0 };
  }

  /** jarak titik ke elemen (mm) */
  function distToEl(el, x, y) {
    if (el.type === 'line') return closestOnSegment(x, y, el.x1, el.y1, el.x2, el.y2).d;
    if (el.type === 'circle') return Math.abs(dist(x, y, el.cx, el.cy) - el.r);
    if (el.type === 'arc') {
      const a = Math.atan2(y - el.cy, x - el.cx);
      if (angleInArc(a, el.start, el.sweep)) return Math.abs(dist(x, y, el.cx, el.cy) - el.r);
      const e = arcEnds(el);
      return Math.min(dist(x, y, e[0].x, e[0].y), dist(x, y, e[1].x, e[1].y));
    }
    if (el.type === 'path') {
      let best = Infinity;
      for (let i = 0; i < el.pts.length - 1; i++) best = Math.min(best, closestOnSegment(x, y, el.pts[i][0], el.pts[i][1], el.pts[i + 1][0], el.pts[i + 1][1]).d);
      if (el.pts.length === 1) best = dist(x, y, el.pts[0][0], el.pts[0][1]);
      return best;
    }
    if (el.type === 'dim') {
      const d = dimGeom(el);
      return Math.min(closestOnSegment(x, y, d.a.x, d.a.y, d.b.x, d.b.y).d, dist(x, y, d.mid.x, d.mid.y));
    }
    if (el.type === 'text') { const b = bbox(el); return (x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1) ? 0 : Infinity; }
    return Infinity;
  }
  function arcEnds(el) {
    return [
      { x: el.cx + Math.cos(el.start) * el.r, y: el.cy + Math.sin(el.start) * el.r },
      { x: el.cx + Math.cos(el.start + el.sweep) * el.r, y: el.cy + Math.sin(el.start + el.sweep) * el.r }
    ];
  }
  /** geometri garis ukur: titik a,b (pada garis ukur), arah normal */
  function dimGeom(el) {
    const L = dist(el.x1, el.y1, el.x2, el.y2) || 1e-9;
    const ux = (el.x2 - el.x1) / L, uy = (el.y2 - el.y1) / L;
    const nx = uy, ny = -ux; // normal (kiri)
    const off = el.off || 0;
    const a = { x: el.x1 + nx * off, y: el.y1 + ny * off };
    const b = { x: el.x2 + nx * off, y: el.y2 + ny * off };
    return { a, b, ux, uy, nx, ny, L, mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } };
  }
  /** titik-titik penting untuk object-snap */
  function keyPoints(el) {
    if (el.type === 'line') return [{ x: el.x1, y: el.y1 }, { x: el.x2, y: el.y2 }, { x: (el.x1 + el.x2) / 2, y: (el.y1 + el.y2) / 2, mid: true }];
    if (el.type === 'circle') return [{ x: el.cx, y: el.cy, c: true }, { x: el.cx + el.r, y: el.cy }, { x: el.cx - el.r, y: el.cy }, { x: el.cx, y: el.cy - el.r }, { x: el.cx, y: el.cy + el.r }];
    if (el.type === 'arc') { const e = arcEnds(el); return [{ x: el.cx, y: el.cy, c: true }, e[0], e[1]]; }
    if (el.type === 'path' && el.pts.length) return [{ x: el.pts[0][0], y: el.pts[0][1] }, { x: el.pts[el.pts.length - 1][0], y: el.pts[el.pts.length - 1][1] }];
    return [];
  }

  return {
    SHEET, MARGIN, TB, TAU, D2R, R2D,
    dist, norm360, normRad, dispAngle, lineAngDiff, angDiff, radDelta,
    closestOnSegment, projectOnLine, rot, pointInPoly, angleInArc, fmt,
    lineLen, lineAng, bbox, distToEl, arcEnds, dimGeom, keyPoints
  };
})();
