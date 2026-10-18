/* ============================================================================
   INSTRUMENTS - alat bantu gambar 3D: mistar, segitiga 45°, segitiga 30°/60°,
   busur derajat, dan jangka. Geometri dalam mm (koordinat dunia), dirender
   dengan bayangan, ketebalan, kilau, dan skala agar tampak seperti alat nyata.
   ============================================================================ */
'use strict';
window.DTS_INST = (function () {
  const G = DTS_GEOM;

  const RULER = { L: 310, H: 32, zero: 5 };
  const T45 = 130;                         // panjang kaki segitiga 45°
  const T30 = { L: 150, H: 150 * Math.tan(Math.PI / 6) };
  const PROT_R = 75;
  const LEG = 115;                          // panjang kaki jangka (mm)
  const COMPASS_MAX_R = 180, COMPASS_MIN_R = 2;

  const STYLE = {
    ruler: { tint: [226, 232, 240], edge: '#64748b', wall: 'rgba(100,116,139,.55)', ink: '#1e293b' },
    tri45: { tint: [56, 189, 248], edge: '#0369a1', wall: 'rgba(3,105,161,.45)', ink: '#0c4a6e' },
    tri30: { tint: [251, 146, 60], edge: '#c2410c', wall: 'rgba(194,65,12,.45)', ink: '#7c2d12' },
    protractor: { tint: [52, 211, 153], edge: '#047857', wall: 'rgba(4,120,87,.45)', ink: '#064e3b' }
  };

  /* ======================= pembuatan ======================= */
  function create(kind, x, y) {
    const base = { kind, x, y, rot: 0, locked: false };
    if (kind === 'ruler') { base.x = x - RULER.L / 2; base.y = y - RULER.H / 2; }
    if (kind === 'tri45') { base.x = x - T45 / 3; base.y = y + T45 / 3; }
    if (kind === 'tri30') { base.x = x - T30.L / 3; base.y = y + T30.H / 3; }
    if (kind === 'protractor') { base.y = y + PROT_R / 2; }
    if (kind === 'compass') { base.r = 30; base.ang = 0; delete base.rot; }
    return base;
  }

  /* ======================= transformasi ======================= */
  function toWorld(inst, lx, ly) {
    const p = G.rot(lx, ly, inst.rot || 0);
    return { x: inst.x + p.x, y: inst.y + p.y };
  }
  function toLocal(inst, wx, wy) {
    return G.rot(wx - inst.x, wy - inst.y, -(inst.rot || 0));
  }

  /* ---------- bentuk lokal ---------- */
  function localVerts(kind) {
    if (kind === 'ruler') return [[0, 0], [RULER.L, 0], [RULER.L, RULER.H], [0, RULER.H]];
    if (kind === 'tri45') return [[0, 0], [T45, 0], [0, -T45]];
    if (kind === 'tri30') return [[0, 0], [T30.L, 0], [0, -T30.H]];
    return [];
  }
  function incenter(v) {
    const [A, B, C] = v;
    const a = Math.hypot(B[0] - C[0], B[1] - C[1]), b = Math.hypot(A[0] - C[0], A[1] - C[1]), c = Math.hypot(A[0] - B[0], A[1] - B[1]);
    const p = a + b + c;
    const x = (a * A[0] + b * B[0] + c * C[0]) / p, y = (a * A[1] + b * B[1] + c * C[1]) / p;
    const area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
    return { x, y, r: area / (p / 2) };
  }
  function holeVerts(kind) {
    if (kind !== 'tri45' && kind !== 'tri30') return null;
    const v = localVerts(kind), I = incenter(v);
    const k = Math.max(0.2, (I.r - 20) / I.r);
    return v.map(p => [I.x + (p[0] - I.x) * k, I.y + (p[1] - I.y) * k]);
  }
  /** titik pusat putar (lokal) */
  function pivotLocal(inst) {
    if (inst.kind === 'ruler') return { x: RULER.L / 2, y: RULER.H / 2 };
    if (inst.kind === 'tri45' || inst.kind === 'tri30') { const I = incenter(localVerts(inst.kind)); return { x: I.x, y: I.y }; }
    return { x: 0, y: 0 };
  }
  /** posisi bola putar (lokal) */
  function knobLocal(inst) {
    if (inst.kind === 'ruler') return { x: RULER.L - 16, y: RULER.H / 2 };
    if (inst.kind === 'tri45') return { x: T45 - 34, y: -11 };
    if (inst.kind === 'tri30') return { x: T30.L - 40, y: -9 };
    if (inst.kind === 'protractor') return { x: 0, y: -PROT_R - 9 };
    return { x: 0, y: 0 };
  }
  function knobPos(inst) { const k = knobLocal(inst); return toWorld(inst, k.x, k.y); }
  function pivotPos(inst) { const k = pivotLocal(inst); return toWorld(inst, k.x, k.y); }

  /** putar instrumen terhadap pivot-nya */
  function setRotation(inst, deg) {
    const pv = pivotPos(inst);
    inst.rot = G.norm360(deg);
    const pl = pivotLocal(inst);
    const p = G.rot(pl.x, pl.y, inst.rot);
    inst.x = pv.x - p.x; inst.y = pv.y - p.y;
  }

  /* ======================= tepi untuk panduan ======================= */
  function edges(inst) {
    const out = [];
    if (inst.kind === 'ruler' || inst.kind === 'tri45' || inst.kind === 'tri30') {
      const v = localVerts(inst.kind).map(p => toWorld(inst, p[0], p[1]));
      const n = v.length;
      for (let i = 0; i < n; i++) {
        if (inst.kind === 'ruler' && (i === 1 || i === 3)) continue; // ujung pendek mistar
        out.push({ x1: v[i].x, y1: v[i].y, x2: v[(i + 1) % n].x, y2: v[(i + 1) % n].y, inst });
      }
    } else if (inst.kind === 'protractor') {
      const a = toWorld(inst, -PROT_R, 0), b = toWorld(inst, PROT_R, 0);
      out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, inst });
    }
    return out;
  }
  function allEdges() {
    const st = DTS_STATE.s();
    if (!st.doc.showInst) return [];
    const out = [];
    for (const i of st.doc.instruments) out.push(...edges(i));
    return out;
  }
  /** tepi terdekat dalam ambang (mm) */
  function nearestEdge(x, y, thr) {
    let best = null;
    for (const e of allEdges()) {
      const c = G.closestOnSegment(x, y, e.x1, e.y1, e.x2, e.y2);
      if (c.d <= thr && (!best || c.d < best.d)) best = { d: c.d, x: c.x, y: c.y, edge: e };
    }
    return best;
  }
  function protractorCenterNear(x, y, thr) {
    const st = DTS_STATE.s();
    if (!st.doc.showInst) return null;
    for (const i of st.doc.instruments) if (i.kind === 'protractor' && G.dist(x, y, i.x, i.y) <= thr) return i;
    return null;
  }

  /* ======================= jangka ======================= */
  function compassPencil(c) { return { x: c.x + Math.cos(c.ang) * c.r, y: c.y + Math.sin(c.ang) * c.r }; }
  function compassHeight(c) { const h2 = LEG * LEG - (c.r / 2) * (c.r / 2); return Math.sqrt(Math.max(h2, 4)); }
  const PROJ = 0.42;    // proyeksi tinggi -> layar (sudut pandang miring)
  function compassHinge(c) {
    const p = compassPencil(c);
    return { x: (c.x + p.x) / 2, y: (c.y + p.y) / 2 - compassHeight(c) * PROJ };
  }
  function compassHead(c) { const h = compassHinge(c); return { x: h.x, y: h.y - 17 }; }
  function setCompassRadius(c, r) { c.r = Math.max(COMPASS_MIN_R, Math.min(COMPASS_MAX_R, r)); }

  /* ======================= hit test ======================= */
  function hit(inst, x, y, scale) {
    const px = 1 / scale;
    if (inst.kind === 'compass') {
      const p = compassPencil(inst), h = compassHinge(inst), hd = compassHead(inst);
      const tipThr = Math.max(3.5, 12 * px);
      if (G.dist(x, y, p.x, p.y) < tipThr) return { part: 'pencil' };
      if (G.dist(x, y, inst.x, inst.y) < tipThr) return { part: 'needle' };
      if (G.closestOnSegment(x, y, h.x, h.y + 2, hd.x, hd.y - 3).d < Math.max(4.5, 10 * px)) return { part: 'head' };
      if (G.dist(x, y, h.x, h.y) < Math.max(6, 12 * px)) return { part: 'head' };
      const legThr = Math.max(2.5, 8 * px);
      if (G.closestOnSegment(x, y, inst.x, inst.y, h.x, h.y).d < legThr) return { part: 'body' };
      if (G.closestOnSegment(x, y, p.x, p.y, h.x, h.y).d < legThr) return { part: 'body' };
      return null;
    }
    const k = knobPos(inst);
    if (!inst.locked && G.dist(x, y, k.x, k.y) < Math.max(5, 13 * px)) return { part: 'rot' };
    const L = toLocal(inst, x, y);
    if (inst.kind === 'protractor') {
      const d = Math.hypot(L.x, L.y);
      if (L.y <= 0.5 && d <= PROT_R) return { part: 'body' };
      return null;
    }
    const v = localVerts(inst.kind).map(p => ({ x: p[0], y: p[1] }));
    if (G.pointInPoly(L.x, L.y, v)) return { part: 'body' };
    return null;
  }

  /* ======================= RENDER 3D ======================= */
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  /** pelat akrilik 3D: bayangan + dinding tebal + badan transparan + kilau + tepi bevel */
  function drawPlate(ctx, trace, bb, sty, o) {
    const px = 1 / o.scale;
    // 1) bayangan jatuh di kertas
    ctx.save();
    const off = (o.lifted ? 7 : 2.6);
    ctx.translate(off, off * 1.25);
    ctx.fillStyle = o.lifted ? 'rgba(15,23,42,.20)' : 'rgba(15,23,42,.24)';
    if ('filter' in ctx) ctx.filter = `blur(${Math.max(1.5, (o.lifted ? 3.2 : 1.6) * o.scale)}px)`;
    ctx.beginPath(); trace(ctx); ctx.fill('evenodd');
    ctx.restore();
    // 2) dinding / ketebalan pelat (sisi kanan-bawah)
    ctx.save();
    ctx.translate(0.75, 0.95);
    ctx.fillStyle = sty.wall;
    ctx.beginPath(); trace(ctx); ctx.fill('evenodd');
    ctx.restore();
    // 3) badan transparan bergradasi
    ctx.save();
    const g = ctx.createLinearGradient(bb.x0, bb.y0, bb.x1, bb.y1);
    g.addColorStop(0, rgba(sty.tint, 0.30));
    g.addColorStop(0.5, rgba(sty.tint, 0.42));
    g.addColorStop(1, rgba(sty.tint, 0.55));
    ctx.fillStyle = g;
    ctx.beginPath(); trace(ctx); ctx.fill('evenodd');
    // 4) kilau (specular) diagonal
    ctx.clip('evenodd');
    const w = Math.max(bb.x1 - bb.x0, bb.y1 - bb.y0);
    const sg = ctx.createLinearGradient(bb.x0, bb.y0, bb.x0 + w, bb.y0 + w);
    sg.addColorStop(0.18, 'rgba(255,255,255,0)');
    sg.addColorStop(0.28, 'rgba(255,255,255,.38)');
    sg.addColorStop(0.36, 'rgba(255,255,255,0)');
    sg.addColorStop(0.62, 'rgba(255,255,255,0)');
    sg.addColorStop(0.67, 'rgba(255,255,255,.18)');
    sg.addColorStop(0.72, 'rgba(255,255,255,0)');
    ctx.fillStyle = sg;
    ctx.fillRect(bb.x0 - 5, bb.y0 - 5, (bb.x1 - bb.x0) + 10, (bb.y1 - bb.y0) + 10);
    ctx.restore();
    // 5) tepi bevel: garis gelap + sorot putih di kiri-atas
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.strokeStyle = sty.edge;
    ctx.lineWidth = Math.max(0.3, 1 * px);
    ctx.beginPath(); trace(ctx); ctx.stroke();
    ctx.translate(-0.35, -0.35);
    ctx.strokeStyle = 'rgba(255,255,255,.85)';
    ctx.lineWidth = Math.max(0.25, 0.9 * px);
    ctx.beginPath(); trace(ctx); ctx.stroke();
    ctx.restore();
    if (o.active) {
      ctx.save();
      ctx.strokeStyle = 'rgba(37,99,235,.9)';
      ctx.lineWidth = 2 * px;
      ctx.setLineDash([6 * px, 4 * px]);
      ctx.beginPath(); trace(ctx); ctx.stroke();
      ctx.restore();
    }
  }

  function bboxOfPts(pts) {
    const b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    for (const p of pts) { b.x0 = Math.min(b.x0, p.x); b.y0 = Math.min(b.y0, p.y); b.x1 = Math.max(b.x1, p.x); b.y1 = Math.max(b.y1, p.y); }
    return b;
  }

  function draw(ctx, inst, o) {
    ctx.save();
    if (inst.kind === 'compass') drawCompass(ctx, inst, o);
    else if (inst.kind === 'protractor') drawProtractor(ctx, inst, o);
    else drawPolyInst(ctx, inst, o);
    ctx.restore();
  }

  /* ---------- mistar & segitiga ---------- */
  function drawPolyInst(ctx, inst, o) {
    const sty = STYLE[inst.kind];
    const v = localVerts(inst.kind).map(p => toWorld(inst, p[0], p[1]));
    const hv = holeVerts(inst.kind);
    const h = hv ? hv.map(p => toWorld(inst, p[0], p[1])) : null;
    const trace = c => {
      c.moveTo(v[0].x, v[0].y); for (let i = 1; i < v.length; i++) c.lineTo(v[i].x, v[i].y); c.closePath();
      if (h) { c.moveTo(h[0].x, h[0].y); for (let i = 1; i < h.length; i++) c.lineTo(h[i].x, h[i].y); c.closePath(); }
    };
    drawPlate(ctx, trace, bboxOfPts(v), sty, o);

    // skala & tulisan dalam koordinat lokal
    ctx.save();
    ctx.translate(inst.x, inst.y);
    ctx.rotate((inst.rot || 0) * G.D2R);
    ctx.strokeStyle = sty.ink; ctx.fillStyle = sty.ink;
    const thin = Math.max(0.12, 0.6 / o.scale);
    if (inst.kind === 'ruler') {
      for (let mm = 0; mm <= 300; mm++) {
        const x = RULER.zero + mm;
        const len = mm % 10 === 0 ? 7 : mm % 5 === 0 ? 4.8 : 3;
        ctx.lineWidth = mm % 10 === 0 ? thin * 1.6 : thin;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, len); ctx.stroke();
      }
      ctx.font = '600 3.6px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      for (let cm = 0; cm <= 30; cm++) ctx.fillText(String(cm), RULER.zero + cm * 10, 8);
      ctx.font = '600 3px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('cm', RULER.zero + 1.5, 8.4);
      ctx.globalAlpha = 0.55;
      ctx.font = 'italic 700 4.2px "Segoe UI", Arial, sans-serif';
      ctx.fillText('MISTAR 30 cm · SMK', RULER.zero + 112, 21);
      ctx.globalAlpha = 1;
      // garis skala bawah (tiap cm)
      for (let cm = 0; cm <= 30; cm++) {
        const x = RULER.zero + cm * 10;
        ctx.lineWidth = thin;
        ctx.beginPath(); ctx.moveTo(x, RULER.H); ctx.lineTo(x, RULER.H - 3); ctx.stroke();
      }
    } else {
      const L = inst.kind === 'tri45' ? T45 : T30.L;
      const H = inst.kind === 'tri45' ? T45 : T30.H;
      // skala sepanjang kaki mendatar & tegak
      for (let mm = 2; mm <= L - 18; mm++) {
        const len = mm % 10 === 0 ? 5.5 : mm % 5 === 0 ? 3.8 : 2.2;
        ctx.lineWidth = mm % 10 === 0 ? thin * 1.5 : thin;
        ctx.beginPath(); ctx.moveTo(mm, 0); ctx.lineTo(mm, -len); ctx.stroke();
      }
      for (let mm = 2; mm <= H - 18; mm++) {
        const len = mm % 10 === 0 ? 5.5 : mm % 5 === 0 ? 3.8 : 2.2;
        ctx.lineWidth = mm % 10 === 0 ? thin * 1.5 : thin;
        ctx.beginPath(); ctx.moveTo(0, -mm); ctx.lineTo(len, -mm); ctx.stroke();
      }
      ctx.font = '600 3.2px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
      for (let cm = 1; cm * 10 <= L - 18; cm++) ctx.fillText(String(cm), cm * 10, -6.2);
      ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
      for (let cm = 1; cm * 10 <= H - 18; cm++) ctx.fillText(String(cm), 6.6, -cm * 10);
      // label sudut
      ctx.font = '700 6px "Segoe UI", Arial, sans-serif';
      ctx.globalAlpha = 0.8;
      if (inst.kind === 'tri45') {
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillText('45°', L - 12, -2.5);
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('45°', 2.5, -H + 14);
      } else {
        ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
        ctx.fillText('30°', L - 18, -2.5);
        ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('60°', 2.5, -H + 10);
      }
      ctx.font = '700 4.5px "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
      ctx.fillText('90°', 8, -9);
      // tanda siku
      ctx.lineWidth = thin * 1.4;
      ctx.strokeRect(0, -6, 6, 6);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    drawKnobOrLock(ctx, inst, o);
  }

  /* ---------- busur derajat ---------- */
  function drawProtractor(ctx, inst, o) {
    const sty = STYLE.protractor;
    const R = PROT_R, rIn = R - 30;
    const rotR = (inst.rot || 0) * G.D2R;
    const trace = c => {
      c.moveTo(inst.x + Math.cos(rotR) * R, inst.y + Math.sin(rotR) * R);
      c.arc(inst.x, inst.y, R, rotR, rotR - Math.PI, true);
      c.closePath();
      // lubang tengah (setengah lingkaran kecil terangkat 7 mm)
      const hc = toWorld(inst, 0, -7);
      c.moveTo(hc.x + Math.cos(rotR) * rIn, hc.y + Math.sin(rotR) * rIn);
      c.arc(hc.x, hc.y, rIn, rotR, rotR - Math.PI, true);
      c.closePath();
    };
    const bb = { x0: inst.x - R, y0: inst.y - R, x1: inst.x + R, y1: inst.y + R };
    drawPlate(ctx, trace, bb, sty, o);

    ctx.save();
    ctx.translate(inst.x, inst.y);
    ctx.rotate(rotR);
    ctx.strokeStyle = sty.ink; ctx.fillStyle = sty.ink;
    const thin = Math.max(0.12, 0.6 / o.scale);
    for (let d = 0; d <= 180; d++) {
      const a = -d * G.D2R;   // 0° di kanan, naik berlawanan jarum jam
      const len = d % 10 === 0 ? 6 : d % 5 === 0 ? 4.2 : 2.4;
      ctx.lineWidth = d % 10 === 0 ? thin * 1.6 : thin;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * R, Math.sin(a) * R);
      ctx.lineTo(Math.cos(a) * (R - len), Math.sin(a) * (R - len));
      ctx.stroke();
    }
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let d = 0; d <= 180; d += 10) {
      const a = -d * G.D2R;
      ctx.save();
      ctx.font = '600 3.1px "Segoe UI", Arial, sans-serif';
      ctx.translate(Math.cos(a) * (R - 9), Math.sin(a) * (R - 9));
      ctx.rotate(a + Math.PI / 2);
      ctx.fillText(String(d), 0, 0);
      ctx.restore();
      ctx.save();
      ctx.font = '500 2.6px "Segoe UI", Arial, sans-serif';
      ctx.globalAlpha = 0.75;
      ctx.translate(Math.cos(a) * (R - 13.5), Math.sin(a) * (R - 13.5));
      ctx.rotate(a + Math.PI / 2);
      ctx.fillText(String(180 - d), 0, 0);
      ctx.restore();
    }
    // garis dasar & tanda pusat
    ctx.lineWidth = thin * 1.4;
    ctx.beginPath(); ctx.moveTo(-R + 2, 0); ctx.lineTo(R - 2, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -6); ctx.stroke();
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = thin * 1.6;
    ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, G.TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.moveTo(0, -3); ctx.lineTo(0, 1); ctx.stroke();
    ctx.restore();
    drawKnobOrLock(ctx, inst, o);
  }

  /* ---------- bola putar 3D / gembok ---------- */
  function drawKnobOrLock(ctx, inst, o) {
    const px = 1 / o.scale;
    if (inst.locked) {
      const p = pivotPos(inst);
      const s = Math.max(3, 9 * px);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = '#f59e0b'; ctx.strokeStyle = '#78350f'; ctx.lineWidth = s * 0.12;
      ctx.beginPath(); ctx.arc(0, -s * 0.35, s * 0.42, Math.PI, 0); ctx.stroke();
      ctx.beginPath(); ctx.rect(-s * 0.6, -s * 0.35, s * 1.2, s * 0.95); ctx.fill(); ctx.stroke();
      ctx.restore();
      return;
    }
    const k = knobPos(inst);
    const r = Math.max(3.4, 9 * px);
    ctx.save();
    ctx.fillStyle = 'rgba(15,23,42,.28)';
    if ('filter' in ctx) ctx.filter = `blur(${Math.max(1, r * o.scale * 0.25)}px)`;
    ctx.beginPath(); ctx.arc(k.x + r * 0.3, k.y + r * 0.4, r, 0, G.TAU); ctx.fill();
    ctx.restore();
    ctx.save();
    const g = ctx.createRadialGradient(k.x - r * 0.35, k.y - r * 0.4, r * 0.1, k.x, k.y, r);
    g.addColorStop(0, o.hoverKnob ? '#a7f3d0' : '#6ee7b7');
    g.addColorStop(0.55, '#10b981');
    g.addColorStop(1, '#065f46');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(k.x, k.y, r, 0, G.TAU); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.95)';
    ctx.lineWidth = r * 0.16;
    ctx.beginPath(); ctx.arc(k.x, k.y, r * 0.52, -2.4, 1.5); ctx.stroke();
    // kepala panah
    const ax = k.x + Math.cos(1.5) * r * 0.52, ay = k.y + Math.sin(1.5) * r * 0.52;
    ctx.fillStyle = 'rgba(255,255,255,.95)';
    ctx.beginPath(); ctx.moveTo(ax - r * 0.32, ay - r * 0.05); ctx.lineTo(ax + r * 0.12, ay + r * 0.3); ctx.lineTo(ax + r * 0.1, ay - r * 0.3); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  /* ---------- jangka 3D ---------- */
  function legQuad(ctx, a, b, wA, wB, stops) {
    // a = ujung bawah (di kertas), b = atas (engsel)
    const L = G.dist(a.x, a.y, b.x, b.y) || 1;
    const nx = -(b.y - a.y) / L, ny = (b.x - a.x) / L;
    ctx.beginPath();
    ctx.moveTo(a.x + nx * wA / 2, a.y + ny * wA / 2);
    ctx.lineTo(b.x + nx * wB / 2, b.y + ny * wB / 2);
    ctx.lineTo(b.x - nx * wB / 2, b.y - ny * wB / 2);
    ctx.lineTo(a.x - nx * wA / 2, a.y - ny * wA / 2);
    ctx.closePath();
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, w = Math.max(wA, wB) / 2;
    const g = ctx.createLinearGradient(mx + nx * w, my + ny * w, mx - nx * w, my - ny * w);
    stops.forEach(s => g.addColorStop(s[0], s[1]));
    ctx.fillStyle = g;
    ctx.fill();
  }
  const METAL = [[0, '#475569'], [0.35, '#f8fafc'], [0.55, '#cbd5e1'], [1, '#334155']];
  const DARKMETAL = [[0, '#1e293b'], [0.4, '#94a3b8'], [0.6, '#64748b'], [1, '#0f172a']];
  const PENCILC = [[0, '#a16207'], [0.4, '#fde047'], [0.6, '#facc15'], [1, '#854d0e']];

  function lerp(a, b, t) { return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }; }

  function drawCompass(ctx, c, o) {
    const N = { x: c.x, y: c.y };
    const P = compassPencil(c);
    const Hn = compassHinge(c);
    const Hd = compassHead(c);
    const hgt = compassHeight(c);
    const px = 1 / o.scale;
    const lift = o.lifted ? 1.25 : 1;

    // ---- bayangan (cahaya dari kiri-atas) ----
    ctx.save();
    const shadowOf = (pt, z) => ({ x: pt.x + z * 0.32 * lift, y: pt.y + z * 0.22 * lift });
    const M = { x: (N.x + P.x) / 2, y: (N.y + P.y) / 2 };
    const sH = shadowOf(M, hgt), sHd = shadowOf(M, hgt + 40);
    ctx.strokeStyle = 'rgba(15,23,42,.22)';
    ctx.lineCap = 'round';
    if ('filter' in ctx) ctx.filter = `blur(${Math.max(1.2, 1.2 * o.scale)}px)`;
    ctx.lineWidth = 3.4;
    ctx.beginPath(); ctx.moveTo(N.x, N.y); ctx.lineTo(sH.x, sH.y); ctx.lineTo(P.x, P.y); ctx.stroke();
    ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(sH.x, sH.y); ctx.lineTo(sHd.x, sHd.y); ctx.stroke();
    ctx.restore();

    // ---- lingkaran bantu bukaan (tipis putus) ----
    if (o.active || o.lifted) {
      ctx.save();
      ctx.strokeStyle = 'rgba(37,99,235,.35)';
      ctx.lineWidth = px;
      ctx.setLineDash([4 * px, 4 * px]);
      ctx.beginPath(); ctx.arc(N.x, N.y, c.r, 0, G.TAU); ctx.stroke();
      ctx.restore();
    }

    // ---- kaki jarum ----
    const nStart = lerp(N, Hn, 0.10);     // jarum 10% bawah
    legQuad(ctx, nStart, Hn, 2.2, 5, METAL);
    ctx.save();
    ctx.strokeStyle = '#334155'; ctx.lineWidth = 0.7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(N.x, N.y); ctx.lineTo(nStart.x, nStart.y); ctx.stroke();
    ctx.restore();
    // ring penjepit jarum
    const nClamp = lerp(N, Hn, 0.16);
    ctx.save();
    ctx.fillStyle = '#1e293b';
    ctx.beginPath(); ctx.arc(nClamp.x, nClamp.y, 1.7, 0, G.TAU); ctx.fill();
    ctx.restore();

    // ---- kaki pensil ----
    const pLead = lerp(P, Hn, 0.07), pWood = lerp(P, Hn, 0.25);
    legQuad(ctx, pWood, Hn, 3.2, 5, METAL);
    legQuad(ctx, pLead, pWood, 2.8, 3.4, PENCILC);   // batang pensil kuning
    ctx.save();                                        // ujung grafit
    const Lp = G.dist(P.x, P.y, pLead.x, pLead.y) || 1;
    const nx = -(pLead.y - P.y) / Lp, ny = (pLead.x - P.x) / Lp;
    ctx.fillStyle = '#e7c9a0';
    ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(pLead.x + nx * 1.4, pLead.y + ny * 1.4); ctx.lineTo(pLead.x - nx * 1.4, pLead.y - ny * 1.4); ctx.closePath(); ctx.fill();
    const tipMid = lerp(P, pLead, 0.45);
    ctx.fillStyle = '#27272a';
    ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(tipMid.x + nx * 0.65, tipMid.y + ny * 0.65); ctx.lineTo(tipMid.x - nx * 0.65, tipMid.y - ny * 0.65); ctx.closePath(); ctx.fill();
    ctx.restore();
    // penjepit pensil
    const pc = lerp(P, Hn, 0.27);
    ctx.save();
    ctx.fillStyle = '#334155';
    ctx.beginPath(); ctx.arc(pc.x, pc.y, 2.1, 0, G.TAU); ctx.fill();
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath(); ctx.arc(pc.x - 0.4, pc.y - 0.4, 0.9, 0, G.TAU); ctx.fill();
    ctx.restore();

    // ---- engsel (cakram logam) ----
    ctx.save();
    const hg = ctx.createRadialGradient(Hn.x - 1.6, Hn.y - 1.8, 0.4, Hn.x, Hn.y, 5.2);
    hg.addColorStop(0, '#ffffff'); hg.addColorStop(0.45, '#cbd5e1'); hg.addColorStop(1, '#334155');
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.arc(Hn.x, Hn.y, 5.2, 0, G.TAU); ctx.fill();
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 0.35; ctx.stroke();
    ctx.fillStyle = '#475569';
    ctx.beginPath(); ctx.arc(Hn.x, Hn.y, 1.3, 0, G.TAU); ctx.fill();
    ctx.restore();

    // ---- kepala / pegangan (silinder bergerigi) ----
    ctx.save();
    const hw = 4.2;
    const hgd = ctx.createLinearGradient(Hd.x - hw / 2, 0, Hd.x + hw / 2, 0);
    DARKMETAL.forEach(s => hgd.addColorStop(s[0], s[1]));
    ctx.fillStyle = hgd;
    ctx.beginPath();
    ctx.rect(Hd.x - hw / 2, Hd.y, hw, Hn.y - 4.2 - Hd.y);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = 0.25;
    for (let yy = Hd.y + 1.5; yy < Hn.y - 5; yy += 1.4) { ctx.beginPath(); ctx.moveTo(Hd.x - hw / 2, yy); ctx.lineTo(Hd.x + hw / 2, yy); ctx.stroke(); }
    // tutup atas (elips)
    const cap = ctx.createRadialGradient(Hd.x - 0.8, Hd.y - 0.5, 0.2, Hd.x, Hd.y, hw / 2);
    cap.addColorStop(0, o.hoverHead ? '#bfdbfe' : '#e2e8f0'); cap.addColorStop(1, '#475569');
    ctx.fillStyle = cap;
    ctx.beginPath(); ctx.ellipse(Hd.x, Hd.y, hw / 2, hw / 4.5, 0, 0, G.TAU); ctx.fill();
    ctx.restore();

    // ---- jarum (titik merah) ----
    ctx.save();
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(N.x, N.y, Math.max(0.6, 2.2 * px), 0, G.TAU); ctx.fill();
    ctx.restore();

    // ---- label R ----
    ctx.save();
    const fs = Math.max(3.2, 11 * px);
    ctx.font = `700 ${fs}px "Segoe UI", Arial, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    const label = 'R ' + G.fmt(c.r, 1);
    const tx = Hd.x, ty = Hd.y - fs * 0.5;
    const tw = ctx.measureText(label).width + fs * 0.8;
    ctx.fillStyle = 'rgba(30,64,175,.92)';
    roundRect(ctx, tx - tw / 2, ty - fs * 1.15, tw, fs * 1.3, fs * 0.35); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(label, tx, ty);
    ctx.restore();

    if (c.locked) {
      ctx.save();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(N.x, N.y, Math.max(1.4, 4 * px), 0, G.TAU); ctx.fill();
      ctx.restore();
    }
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  return {
    RULER, T45, T30, PROT_R, LEG, COMPASS_MAX_R, COMPASS_MIN_R,
    create, toWorld, toLocal, edges, allEdges, nearestEdge, protractorCenterNear,
    knobPos, pivotPos, setRotation, hit, draw,
    compassPencil, compassHinge, compassHead, setCompassRadius
  };
})();
