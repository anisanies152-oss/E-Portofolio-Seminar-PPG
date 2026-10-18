/* ============================================================================
   TOOLS - interaksi pointer: pilih, geser, pensil, penghapus, garis,
   lingkaran, busur, ukuran, teks, serta manipulasi alat bantu 3D
   (geser, putar, buka kaki jangka, putar jangka untuk menggambar).
   ============================================================================ */
'use strict';
window.DTS_TOOLS = (function () {
  const G = DTS_GEOM;
  const S = () => DTS_STATE.s();
  const CV = DTS_CANVAS;
  const INST = DTS_INST;

  let g = null;                 // gesture aktif
  const used = new Set();       // alat yang dipakai (untuk penilaian latihan)
  const pointers = new Map();   // untuk cubit-zoom (layar sentuh)
  let pinch = null;

  const DRAW_TOOLS = ['pencil', 'line', 'circle', 'arc', 'dimension'];
  const thrMm = (px) => (px || 9) / S().view.scale;

  /* ======================= gaya garis ======================= */
  function lineStyle() {
    const p = S().props;
    const w = DTS_DATA.LINE_WIDTHS.find(x => x.id === p.lineWidth) || DTS_DATA.LINE_WIDTHS[2];
    const t = DTS_DATA.LINE_TYPES.find(x => x.id === p.lineType) || DTS_DATA.LINE_TYPES[0];
    return { w: w.mm, dash: t.dash ? t.dash.slice() : null, ltype: t.id, color: '#111827' };
  }
  function pencilStyle() {
    const p = DTS_DATA.PENCILS.find(x => x.id === S().props.pencil) || DTS_DATA.PENCILS[1];
    return { w: p.mm, dash: null, ltype: 'pencil', color: p.color };
  }

  /* ======================= snap ======================= */
  function snapPoint(x, y, o) {
    o = o || {};
    const st = S(), thr = thrMm(10);
    if (o.prot !== false) {
      const pi = INST.protractorCenterNear(x, y, thr);
      if (pi) return { x: pi.x, y: pi.y, kind: 'prot', inst: pi };
    }
    // titik penting objek (ujung, pusat, tengah)
    let best = null;
    for (const el of st.doc.elements) {
      if (o.exclude && o.exclude === el.id) continue;
      for (const kp of G.keyPoints(el)) {
        const d = G.dist(x, y, kp.x, kp.y);
        if (d < thr && (!best || d < best.d)) best = { x: kp.x, y: kp.y, d, kind: 'obj', mid: kp.mid, c: kp.c };
      }
    }
    if (best) return best;
    if (o.edges !== false) {
      const e = INST.nearestEdge(x, y, thr);
      if (e) return { x: e.x, y: e.y, kind: 'edge', edge: e.edge };
    }
    if (st.doc.snap && o.grid !== false) return { x: Math.round(x / 5) * 5, y: Math.round(y / 5) * 5, kind: 'grid' };
    return { x, y, kind: null };
  }
  const roundLen = (L) => S().doc.snap ? Math.round(L) : Math.round(L * 2) / 2;

  /* ======================= pointer util ======================= */
  function evPos(e) {
    const r = document.getElementById('canvas').getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;
    const w = CV.toWorld(sx, sy);
    return { sx, sy, x: w.x, y: w.y };
  }
  function instHit(x, y) {
    const st = S();
    if (!st.doc.showInst) return null;
    for (let i = st.doc.instruments.length - 1; i >= 0; i--) {
      const inst = st.doc.instruments[i];
      const h = INST.hit(inst, x, y, st.view.scale);
      if (h) return { inst, part: h.part };
    }
    return null;
  }
  function elementHit(x, y) {
    const els = S().doc.elements, thr = thrMm(7);
    let best = null;
    for (let i = els.length - 1; i >= 0; i--) {
      const d = G.distToEl(els[i], x, y);
      if (d < thr && (!best || d < best.d - 0.01)) best = { el: els[i], d };
    }
    return best ? best.el : null;
  }
  function bringToFront(inst) {
    const a = S().doc.instruments, i = a.indexOf(inst);
    if (i >= 0 && i !== a.length - 1) { a.splice(i, 1); a.push(inst); }
  }
  function activateInst(inst) {
    S().activeInst = inst ? inst.id : null;
    if (inst) bringToFront(inst);
    DTS_STATE.emit('instActive');
  }
  function lazyHistory() { if (g && !g.hist) { DTS_STATE.pushHistory(); g.hist = true; } }

  /* ======================= POINTER DOWN ======================= */
  function onDown(e) {
    const cv = document.getElementById('canvas');
    try { cv.setPointerCapture(e.pointerId); } catch (_) { /* abaikan */ }
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {           // cubit dua jari = zoom/geser
      const [a, b] = [...pointers.values()];
      pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
      g = null; CV.setOverlay(null);
      return;
    }
    const p = evPos(e), st = S(), tool = st.tool;

    // klik kanan / tengah = geser lembar
    if (e.button === 1 || e.button === 2) { g = { kind: 'pan', sx: e.clientX, sy: e.clientY }; return; }
    if (e.button !== 0) return;

    // fase kedua (busur & ukuran) diselesaikan dengan klik
    if (g && g.kind === 'arc' && g.phase === 2) { finishArc(); return; }
    if (g && g.kind === 'dim' && g.phase === 2) { finishDim(); return; }
    if (g && g.kind === 'text') return;

    if (tool === 'pan') { g = { kind: 'pan', sx: e.clientX, sy: e.clientY }; return; }

    if (tool === 'eraser') {
      DTS_STATE.pushHistory();
      g = { kind: 'erase', lx: p.x, ly: p.y, n: 0 };
      g.n += eraseAt(p.x, p.y);
      CV.schedule();
      return;
    }

    if (tool === 'text') { e.preventDefault(); startText(p); return; }

    // ---- alat bantu 3D ----
    const ih = instHit(p.x, p.y);
    if (ih) {
      const inst = ih.inst;
      const nearEdge = DRAW_TOOLS.includes(tool) && inst.kind !== 'compass' && ih.part === 'body' && INST.nearestEdge(p.x, p.y, thrMm(10));
      if (!nearEdge) {
        activateInst(inst);
        if (inst.kind === 'compass') {
          if (ih.part === 'head') {
            const a = Math.atan2(p.y - inst.y, p.x - inst.x);
            g = { kind: 'compassDraw', inst, a0: inst.ang, lastA: a, sweep: 0 };
            used.add('compass');
            CV.setHover({ inst: inst.id, part: 'head', dragging: inst.id });
          } else if (inst.locked) {
            DTS_APP.toast('Jangka terkunci. Buka kunci di panel Properti.', 'warn');
          } else if (ih.part === 'pencil') {
            g = { kind: 'compassOpen', inst };
            CV.setHover({ inst: inst.id, part: 'pencil', dragging: inst.id });
          } else {
            g = { kind: 'instMove', inst, sx: p.x, sy: p.y, bx: inst.x, by: inst.y, snapNeedle: true };
            CV.setHover({ inst: inst.id, part: 'body', dragging: inst.id });
          }
        } else if (ih.part === 'rot') {
          const pv = INST.pivotPos(inst);
          g = { kind: 'instRot', inst, a0: Math.atan2(p.y - pv.y, p.x - pv.x) * G.R2D, r0: inst.rot || 0 };
          CV.setHover({ inst: inst.id, part: 'rot', dragging: inst.id });
        } else if (inst.locked) {
          if (tool === 'select') DTS_APP.toast(DTS_DATA.TOOLS[inst.kind].name + ' terkunci.', 'warn');
          else startDrawing(tool, p);   // alat terkunci: menggambar di atasnya
          return;
        } else {
          g = { kind: 'instMove', inst, sx: p.x, sy: p.y, bx: inst.x, by: inst.y };
          CV.setHover({ inst: inst.id, part: 'body', dragging: inst.id });
        }
        DTS_APP.renderProps();
        CV.schedule();
        return;
      }
    }

    if (tool === 'select') {
      const sel = DTS_STATE.getElement(st.selection);
      if (sel) {
        for (const h of CV.selectionHandles(sel)) {
          if (G.dist(p.x, p.y, h.x, h.y) < thrMm(9)) { g = { kind: 'handle', el: sel, h: h.h }; return; }
        }
      }
      const el = elementHit(p.x, p.y);
      if (el) {
        if (st.activeInst) activateInst(null);
        DTS_STATE.setSelection(el.id);
        g = { kind: 'moveEl', el, lx: p.x, ly: p.y };
      } else {
        DTS_STATE.setSelection(null);
        if (st.activeInst) { activateInst(null); DTS_APP.renderProps(); }
        g = { kind: 'pan', sx: e.clientX, sy: e.clientY, ox: e.clientX, oy: e.clientY, wx: p.x, wy: p.y, tbClick: true };
      }
      CV.schedule();
      return;
    }

    startDrawing(tool, p);
  }

  function startDrawing(tool, p) {
    const st = S();
    if (st.selection) DTS_STATE.setSelection(null);
    if (tool === 'pencil') {
      const e = INST.nearestEdge(p.x, p.y, thrMm(10));
      if (e) { g = { kind: 'pencilEdge', edge: e.edge, x0: e.x, y0: e.y, x1: e.x, y1: e.y }; used.add(e.edge.inst.kind); }
      else g = { kind: 'pencil', pts: [[p.x, p.y]] };
    } else if (tool === 'line') {
      const s = snapPoint(p.x, p.y);
      g = { kind: 'line', x0: s.x, y0: s.y, x1: s.x, y1: s.y, edge: s.kind === 'edge' ? s.edge : null, prot: s.kind === 'prot' ? s.inst : null };
      if (g.edge) used.add(g.edge.inst.kind);
      if (g.prot) used.add('protractor');
    } else if (tool === 'circle') {
      const s = snapPoint(p.x, p.y);
      g = { kind: 'circle', cx: s.x, cy: s.y, r: 0 };
    } else if (tool === 'arc') {
      const s = snapPoint(p.x, p.y);
      g = { kind: 'arc', phase: 1, cx: s.x, cy: s.y, r: 0, start: 0, sweep: 0 };
    } else if (tool === 'dimension') {
      const s = snapPoint(p.x, p.y, { edges: false });
      g = { kind: 'dim', phase: 1, x1: s.x, y1: s.y, x2: s.x, y2: s.y, off: 0 };
    }
    updateOverlay(p);
  }

  /* ======================= POINTER MOVE ======================= */
  function onMove(e) {
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch && pointers.size >= 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
      const r = document.getElementById('canvas').getBoundingClientRect();
      CV.panBy(cx - pinch.cx, cy - pinch.cy);
      if (pinch.d > 10) CV.zoomBy(d / pinch.d, cx - r.left, cy - r.top);
      pinch = { d, cx, cy };
      return;
    }
    const p = evPos(e), st = S();
    DTS_APP.setReadout(p.x, p.y);
    if (!g) { hoverFeedback(p); return; }

    switch (g.kind) {
      case 'pan':
        CV.panBy(e.clientX - g.sx, e.clientY - g.sy); g.sx = e.clientX; g.sy = e.clientY; return;
      case 'instMove': {
        lazyHistory();
        let nx = g.bx + (p.x - g.sx), ny = g.by + (p.y - g.sy);
        if (g.snapNeedle) { const s = snapPoint(nx, ny, { edges: false, prot: true }); if (s.kind === 'obj' || s.kind === 'prot') { nx = s.x; ny = s.y; } }
        g.inst.x = nx; g.inst.y = ny;
        CV.schedule(); return;
      }
      case 'instRot': {
        lazyHistory();
        const pv = INST.pivotPos(g.inst);
        const a = Math.atan2(p.y - pv.y, p.x - pv.x) * G.R2D;
        let r = g.r0 + (a - g.a0);
        r = Math.round(r);
        const m = Math.round(r / 15) * 15;
        if (Math.abs(r - m) <= 2.5 && !e.shiftKey) r = m;
        INST.setRotation(g.inst, r);
        CV.setOverlay((c, k) => label(c, k, p.x, p.y, 'Putar ' + G.fmt(G.norm360(-g.inst.rot), 0) + '°', '#047857'));
        return;
      }
      case 'compassOpen': {
        lazyHistory();
        const c = g.inst;
        let r = G.dist(c.x, c.y, p.x, p.y);
        r = roundLen(r);
        INST.setCompassRadius(c, r);
        c.ang = Math.atan2(p.y - c.y, p.x - c.x);
        DTS_APP.renderProps();
        CV.setOverlay((cx, k) => label(cx, k, p.x, p.y, 'R ' + G.fmt(c.r, 1) + ' mm', '#1d4ed8'));
        return;
      }
      case 'compassDraw': {
        const c = g.inst;
        const a = Math.atan2(p.y - c.y, p.x - c.x);
        let d = G.radDelta(g.lastA, a);
        g.lastA = a;
        if (Math.abs(g.sweep + d) > G.TAU) d = Math.sign(d) * (G.TAU - Math.abs(g.sweep));
        g.sweep += d;
        c.ang = g.a0 + g.sweep;
        const sty = lineStyle();
        CV.setOverlay((cx, k) => {
          cx.strokeStyle = '#111827';
          cx.lineWidth = Math.max(sty.w, 0.9 / k);
          if (sty.dash) cx.setLineDash(sty.dash);
          cx.beginPath();
          if (Math.abs(g.sweep) >= G.TAU - 0.02) cx.arc(c.x, c.y, c.r, 0, G.TAU);
          else cx.arc(c.x, c.y, c.r, g.a0, g.a0 + g.sweep, g.sweep < 0);
          cx.stroke();
          cx.setLineDash([]);
          const pp = INST.compassHead(c);
          label(cx, k, pp.x + 6, pp.y - 6, G.fmt(Math.abs(g.sweep) * G.R2D, 0) + '°', '#1d4ed8');
        });
        return;
      }
      case 'moveEl': {
        lazyHistory();
        translateEl(g.el, p.x - g.lx, p.y - g.ly);
        g.lx = p.x; g.ly = p.y;
        CV.schedule(); return;
      }
      case 'handle': {
        lazyHistory();
        const el = g.el;
        const s = snapPoint(p.x, p.y, { exclude: el.id });
        if (g.h === 'p1') { el.x1 = s.x; el.y1 = s.y; }
        else if (g.h === 'p2') { el.x2 = s.x; el.y2 = s.y; }
        else if (g.h === 'c') { el.cx = s.x; el.cy = s.y; }
        else if (g.h === 'r') el.r = Math.max(0.5, roundLen(G.dist(el.cx, el.cy, p.x, p.y)));
        DTS_APP.renderProps();
        CV.schedule(); return;
      }
      case 'erase': {
        const steps = Math.max(1, Math.ceil(G.dist(g.lx, g.ly, p.x, p.y) / 0.8));
        for (let i = 1; i <= steps; i++) g.n += eraseAt(g.lx + (p.x - g.lx) * i / steps, g.ly + (p.y - g.ly) * i / steps);
        g.lx = p.x; g.ly = p.y;
        eraserOverlay(p);
        return;
      }
      case 'pencil': {
        const last = g.pts[g.pts.length - 1];
        if (G.dist(last[0], last[1], p.x, p.y) > 0.35) g.pts.push([p.x, p.y]);
        break;
      }
      case 'pencilEdge': {
        const e2 = g.edge;
        const pr = G.projectOnLine(p.x, p.y, e2.x1, e2.y1, e2.x2, e2.y2);
        const L = G.dist(g.x0, g.y0, pr.x, pr.y);
        const Lr = roundLen(L);
        const ux = (pr.x - g.x0) / (L || 1), uy = (pr.y - g.y0) / (L || 1);
        g.x1 = g.x0 + ux * Lr; g.y1 = g.y0 + uy * Lr;
        break;
      }
      case 'line': lineMove(p); break;
      case 'circle': {
        const s = snapPoint(p.x, p.y, { edges: false, grid: false, prot: false });
        g.r = s.kind === 'obj' ? G.dist(g.cx, g.cy, s.x, s.y) : roundLen(G.dist(g.cx, g.cy, p.x, p.y));
        break;
      }
      case 'arc': {
        if (g.phase === 1) {
          g.r = roundLen(G.dist(g.cx, g.cy, p.x, p.y));
          g.start = Math.atan2(p.y - g.cy, p.x - g.cx);
          const step = st.props.angleStep;
          if (step) { const dd = -Math.round(-g.start * G.R2D / step) * step; g.start = dd * G.D2R; }
          g.lastA = g.start;
        } else {
          const a = Math.atan2(p.y - g.cy, p.x - g.cx);
          let d = G.radDelta(g.lastA, a);
          g.lastA = a;
          g.raw = (g.raw || 0) + d;
          g.raw = Math.max(-G.TAU, Math.min(G.TAU, g.raw));
          const step = st.props.angleStep || 1;
          g.sweep = Math.round(g.raw * G.R2D / step) * step * G.D2R;
        }
        break;
      }
      case 'dim': {
        if (g.phase === 1) {
          const s = snapPoint(p.x, p.y, { edges: false });
          g.x2 = s.x; g.y2 = s.y;
          // kunci mendatar / tegak bila hampir
          const a = G.dispAngle(g.x2 - g.x1, g.y2 - g.y1) % 90;
          if (s.kind !== 'obj' && (a < 3 || a > 87)) {
            if (Math.abs(g.x2 - g.x1) > Math.abs(g.y2 - g.y1)) g.y2 = g.y1; else g.x2 = g.x1;
          }
        } else {
          const d = G.dimGeom(g);
          g.off = Math.round(((p.x - g.x1) * d.nx + (p.y - g.y1) * d.ny) * 2) / 2;
        }
        break;
      }
    }
    updateOverlay(p);
  }

  function lineMove(p) {
    const st = S();
    if (g.edge) {
      const e = g.edge;
      const pr = G.projectOnLine(p.x, p.y, e.x1, e.y1, e.x2, e.y2);
      const L = G.dist(g.x0, g.y0, pr.x, pr.y);
      const Lr = roundLen(L), ux = (pr.x - g.x0) / (L || 1), uy = (pr.y - g.y0) / (L || 1);
      g.x1 = g.x0 + ux * Lr; g.y1 = g.y0 + uy * Lr;
      g.info = null;
      return;
    }
    if (g.prot) {
      const base = G.norm360(-(g.prot.rot || 0));
      const a = G.dispAngle(p.x - g.x0, p.y - g.y0);
      const step = st.props.angleStep || 1;
      let rel = G.norm360(a - base);
      rel = Math.round(rel / step) * step;
      const L = roundLen(G.dist(g.x0, g.y0, p.x, p.y));
      const ang = (base + rel) * G.D2R;
      g.x1 = g.x0 + Math.cos(ang) * L; g.y1 = g.y0 - Math.sin(ang) * L;
      g.info = '∠ ' + G.fmt(rel > 180 ? rel - 360 : rel, 0) + '° (busur derajat)';
      return;
    }
    const s = snapPoint(p.x, p.y, { prot: false });
    if (s.kind === 'obj' || s.kind === 'edge') { g.x1 = s.x; g.y1 = s.y; g.info = null; return; }
    const step = st.props.angleStep;
    if (step) {
      let a = G.dispAngle(p.x - g.x0, p.y - g.y0);
      a = Math.round(a / step) * step;
      const L = roundLen(G.dist(g.x0, g.y0, p.x, p.y));
      g.x1 = g.x0 + Math.cos(a * G.D2R) * L; g.y1 = g.y0 - Math.sin(a * G.D2R) * L;
    } else { g.x1 = s.x; g.y1 = s.y; }
    g.info = null;
  }

  /* ======================= POINTER UP ======================= */
  function onUp(e) {
    pointers.delete(e.pointerId);
    if (pinch) { if (pointers.size < 2) pinch = null; return; }
    if (!g) return;
    const st = S();
    const k = g.kind;
    if (k === 'arc' && g.phase === 1) {
      if (g.r >= 1) { g.phase = 2; g.raw = 0; g.sweep = 0; DTS_APP.hint('Gerakkan mouse mengitari pusat untuk menentukan besar busur, lalu klik.'); }
      else { g = null; CV.setOverlay(null); }
      return;
    }
    if (k === 'dim' && g.phase === 1) {
      if (G.dist(g.x1, g.y1, g.x2, g.y2) >= 1) { g.phase = 2; g.off = 10; DTS_APP.hint('Gerakkan mouse untuk menentukan jarak garis ukur, lalu klik.'); updateOverlay(evPos(e)); }
      else { g = null; CV.setOverlay(null); }
      return;
    }
    if (k === 'arc' || k === 'dim' || k === 'text') return;
    if (k === 'pan' && g.tbClick && Math.hypot(e.clientX - g.ox, e.clientY - g.oy) < 4) {
      const S2 = G.SHEET, M = G.MARGIN, TB = G.TB;
      const tx = S2.w - M.r - TB.w, ty = S2.h - M.b - TB.h;
      if (g.wx >= tx && g.wx <= tx + TB.w && g.wy >= ty && g.wy <= ty + TB.h) {
        const lx = g.wx - tx, ly = g.wy - ty;
        let key = 'nama';
        if (ly > 15) key = lx < 50 ? 'sekolah' : lx < 134 ? 'judul' : 'no';
        else if (lx >= 30 && lx < 70) key = ly < 5 ? 'skala' : ly < 10 ? 'satuan' : 'tanggal';
        else if (lx >= 70 && lx < 134) key = ly < 5 ? 'nama' : ly < 10 ? 'diperiksa' : 'disetujui';
        else if (lx >= 134) key = 'keterangan';
        g = null;
        DTS_APP.openLembar(key);
        return;
      }
    }

    if (k === 'pencil') commitPencil();
    else if (k === 'pencilEdge') { if (G.dist(g.x0, g.y0, g.x1, g.y1) >= 0.5) commit(Object.assign({ type: 'line', x1: g.x0, y1: g.y0, x2: g.x1, y2: g.y1, src: 'pencil', guide: g.edge.inst.kind }, pencilStyle())); }
    else if (k === 'line') { if (G.dist(g.x0, g.y0, g.x1, g.y1) >= 0.5) commit(Object.assign({ type: 'line', x1: g.x0, y1: g.y0, x2: g.x1, y2: g.y1, src: 'line', guide: g.edge ? g.edge.inst.kind : g.prot ? 'protractor' : null }, lineStyle())); }
    else if (k === 'circle') { if (g.r >= 0.5) commitCircle(g.cx, g.cy, g.r, 'circle'); }
    else if (k === 'compassDraw') {
      const c = g.inst;
      if (Math.abs(g.sweep) >= G.TAU - 0.02) commitCircle(c.x, c.y, c.r, 'compass');
      else if (Math.abs(g.sweep) > 0.02) commit(Object.assign({ type: 'arc', cx: c.x, cy: c.y, r: c.r, start: g.a0, sweep: g.sweep, src: 'compass' }, lineStyle()));
      st.activeInst = c.id;
    } else if (k === 'erase') {
      if (!g.n) DTS_STATE.dropHistory();
      DTS_STATE.changed();
    } else if (k === 'instMove' || k === 'instRot' || k === 'compassOpen' || k === 'moveEl' || k === 'handle') {
      if (g.hist) DTS_STATE.changed();
    }
    g = null;
    CV.setHover(null);
    CV.setOverlay(null);
    DTS_APP.renderProps();
    CV.schedule();
  }

  /* ======================= commit ======================= */
  function commit(el) {
    DTS_STATE.pushHistory();
    DTS_STATE.addElement(el);
    if (el.src) used.add(el.src);
    DTS_STATE.changed();
    DTS_APP.onDrawn();
  }
  function commitCircle(cx, cy, r, src) {
    DTS_STATE.pushHistory();
    DTS_STATE.addElement(Object.assign({ type: 'circle', cx, cy, r, src }, lineStyle()));
    if (S().props.centerLines) {
      const o = r + 3, cs = { w: 0.25, dash: [12, 2.5, 1.5, 2.5], ltype: 'center', color: '#111827', src: 'center' };
      DTS_STATE.addElement(Object.assign({ type: 'line', x1: cx - o, y1: cy, x2: cx + o, y2: cy }, cs));
      DTS_STATE.addElement(Object.assign({ type: 'line', x1: cx, y1: cy - o, x2: cx, y2: cy + o }, cs));
    }
    used.add(src);
    DTS_STATE.changed();
    DTS_APP.onDrawn();
  }
  function commitPencil() {
    let pts = g.pts;
    if (pts.length === 1) pts = [pts[0], [pts[0][0] + 0.05, pts[0][1]]];
    // sederhanakan titik berdekatan
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) { const l = out[out.length - 1]; if (G.dist(l[0], l[1], pts[i][0], pts[i][1]) >= 0.5 || i === pts.length - 1) out.push(pts[i]); }
    commit(Object.assign({ type: 'path', pts: out, src: 'pencil' }, pencilStyle()));
  }
  function finishArc() {
    if (Math.abs(g.sweep) >= G.TAU - 1e-3) commitCircle(g.cx, g.cy, g.r, 'arc');
    else if (Math.abs(g.sweep) > 0.005) commit(Object.assign({ type: 'arc', cx: g.cx, cy: g.cy, r: g.r, start: g.start, sweep: g.sweep, src: 'arc' }, lineStyle()));
    g = null; CV.setOverlay(null); DTS_APP.hint('');
  }
  function finishDim() {
    commit({ type: 'dim', x1: g.x1, y1: g.y1, x2: g.x2, y2: g.y2, off: g.off, w: 0.25, color: '#111827', src: 'dimension' });
    g = null; CV.setOverlay(null); DTS_APP.hint('');
  }

  /* ======================= teks ======================= */
  function startText(p) {
    const box = document.getElementById('text-input');
    const inp = box.querySelector('input');
    g = { kind: 'text', x: p.x, y: p.y };
    box.style.left = p.sx + 'px';
    box.style.top = (p.sy - 18) + 'px';
    box.classList.remove('hidden');
    inp.value = '';
    inp.focus();
    const done = (ok) => {
      inp.onkeydown = null; inp.onblur = null;
      inp.blur();
      box.classList.add('hidden');
      const txt = inp.value.trim();
      const pos = g && g.kind === 'text' ? g : null;
      g = null;
      if (ok && txt && pos) commit({ type: 'text', x: pos.x, y: pos.y, text: txt, size: S().props.textSize || 5, color: '#111827', src: 'text' });
    };
    inp.onkeydown = (ev) => { if (ev.key === 'Enter') done(true); else if (ev.key === 'Escape') done(false); ev.stopPropagation(); };
    inp.onblur = () => done(true);
  }

  /* ======================= penghapus ======================= */
  function eraseAt(x, y) {
    const st = S(), R = Math.max(0.5, (st.props.eraserSize || 3) / 2);
    const els = st.doc.elements;
    let n = 0;
    const out = [];
    for (const el of els) {
      if (G.distToEl(el, x, y) > R) { out.push(el); continue; }
      if (st.props.eraserMode === 'object' || el.type === 'dim' || el.type === 'text') { n++; continue; }
      n++;
      if (el.type === 'line') {
        const L = G.lineLen(el);
        if (L < 0.01) continue;
        const pr = G.projectOnLine(x, y, el.x1, el.y1, el.x2, el.y2);
        const d = G.dist(x, y, pr.x, pr.y);
        const h = Math.sqrt(Math.max(0, R * R - d * d)) / L;
        const t1 = pr.t - h, t2 = pr.t + h;
        const piece = (a, b) => Object.assign({}, el, { id: undefined, x1: el.x1 + (el.x2 - el.x1) * a, y1: el.y1 + (el.y2 - el.y1) * a, x2: el.x1 + (el.x2 - el.x1) * b, y2: el.y1 + (el.y2 - el.y1) * b });
        if (t1 * L > 0.2) out.push(piece(0, Math.min(1, t1)));
        if ((1 - t2) * L > 0.2) out.push(piece(Math.max(0, t2), 1));
      } else if (el.type === 'path') {
        let run = [];
        const flush = () => { if (run.length >= 2) out.push(Object.assign({}, el, { id: undefined, pts: run })); run = []; };
        for (const pt of el.pts) { if (G.dist(x, y, pt[0], pt[1]) <= R) flush(); else run.push(pt); }
        flush();
      } else if (el.type === 'circle' || el.type === 'arc') {
        let start = el.type === 'circle' ? 0 : el.start, sweep = el.type === 'circle' ? G.TAU : el.sweep;
        if (sweep < 0) { start += sweep; sweep = -sweep; }
        const a = Math.atan2(y - el.cy, x - el.cx);
        const half = Math.min(Math.PI, R / Math.max(el.r, 0.01));
        const base = { type: 'arc', cx: el.cx, cy: el.cy, r: el.r, w: el.w, dash: el.dash, ltype: el.ltype, color: el.color, src: el.src };
        if (el.type === 'circle') {
          if (G.TAU - 2 * half > 0.03) out.push(Object.assign({}, base, { start: a + half, sweep: G.TAU - 2 * half }));
        } else {
          const rel = G.normRad(a - start);
          if (rel > sweep + half) { out.push(el); n--; continue; }
          if (rel - half > 0.03) out.push(Object.assign({}, base, { start, sweep: rel - half }));
          if (sweep - rel - half > 0.03) out.push(Object.assign({}, base, { start: start + rel + half, sweep: sweep - rel - half }));
        }
      }
    }
    if (n) {
      for (const el of out) if (!el.id) { DTS_STATE.addElement(el); }
      // addElement menambahkan ke akhir; susun ulang sesuai `out`
      const ids = new Set(out.map(e => e.id));
      st.doc.elements = st.doc.elements.filter(e => ids.has(e.id));
      if (st.selection && !ids.has(st.selection)) st.selection = null;
      used.add('eraser');
    }
    return n;
  }

  /* ======================= pindah elemen ======================= */
  function translateEl(el, dx, dy) {
    if (el.type === 'line' || el.type === 'dim') { el.x1 += dx; el.y1 += dy; el.x2 += dx; el.y2 += dy; }
    else if (el.type === 'circle' || el.type === 'arc') { el.cx += dx; el.cy += dy; }
    else if (el.type === 'path') el.pts = el.pts.map(p => [p[0] + dx, p[1] + dy]);
    else if (el.type === 'text') { el.x += dx; el.y += dy; }
  }

  /* ======================= overlay (pratinjau) ======================= */
  function label(c, k, x, y, text, color) {
    c.save();
    c.setLineDash([]);
    const fs = 12 / k;
    c.font = `600 ${fs}px "Segoe UI", Arial, sans-serif`;
    const w = c.measureText(text).width + fs * 0.9;
    const bx = x + 10 / k, by = y - 26 / k;
    c.fillStyle = 'rgba(255,255,255,.95)';
    c.strokeStyle = color || '#1d4ed8';
    c.lineWidth = 1 / k;
    c.beginPath(); c.rect(bx, by, w, fs * 1.5); c.fill(); c.stroke();
    c.fillStyle = color || '#1d4ed8';
    c.textBaseline = 'middle';
    c.fillText(text, bx + fs * 0.45, by + fs * 0.78);
    c.restore();
  }
  function marker(c, k, x, y, kind) {
    if (!kind) return;
    const s = 5 / k;
    c.save();
    c.lineWidth = 1.5 / k;
    c.strokeStyle = kind === 'edge' ? '#f59e0b' : kind === 'grid' ? '#94a3b8' : '#16a34a';
    if (kind === 'obj' || kind === 'prot') { c.beginPath(); c.rect(x - s, y - s, s * 2, s * 2); c.stroke(); }
    else { c.beginPath(); c.moveTo(x - s, y); c.lineTo(x + s, y); c.moveTo(x, y - s); c.lineTo(x, y + s); c.stroke(); }
    c.restore();
  }
  function edgeGlow(c, k, e) {
    c.save();
    c.strokeStyle = 'rgba(245,158,11,.85)';
    c.lineWidth = 3 / k;
    c.beginPath(); c.moveTo(e.x1, e.y1); c.lineTo(e.x2, e.y2); c.stroke();
    c.restore();
  }

  function updateOverlay(p) {
    if (!g) { CV.setOverlay(null); return; }
    const sty = g.kind === 'pencil' || g.kind === 'pencilEdge' ? pencilStyle() : lineStyle();
    CV.setOverlay((c, k) => {
      c.strokeStyle = sty.color;
      c.lineWidth = Math.max(sty.w, 0.9 / k);
      c.lineCap = 'round';
      if (g.kind === 'pencil') {
        c.beginPath(); g.pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
      } else if (g.kind === 'pencilEdge' || g.kind === 'line') {
        if (g.kind === 'line' && g.edge) edgeGlow(c, k, g.edge);
        if (g.kind === 'pencilEdge') edgeGlow(c, k, g.edge);
        if (g.kind === 'line' && sty.dash) c.setLineDash(sty.dash);
        c.beginPath(); c.moveTo(g.x0, g.y0); c.lineTo(g.x1, g.y1); c.stroke();
        c.setLineDash([]);
        if (g.kind === 'line' && g.prot) {
          c.strokeStyle = 'rgba(220,38,38,.6)'; c.lineWidth = 1 / k;
          const rr = (g.prot.rot || 0) * G.D2R;
          c.beginPath(); c.moveTo(g.x0, g.y0); c.lineTo(g.x0 + Math.cos(rr) * 25, g.y0 + Math.sin(rr) * 25); c.stroke();
        }
        const L = G.dist(g.x0, g.y0, g.x1, g.y1), A = G.dispAngle(g.x1 - g.x0, g.y1 - g.y0);
        marker(c, k, g.x1, g.y1, 'obj');
        label(c, k, g.x1, g.y1, G.fmt(L, 1) + ' mm · ' + G.fmt(A, 0) + '°' + (g.info ? '  ' + g.info : ''), g.prot ? '#b91c1c' : '#1d4ed8');
      } else if (g.kind === 'circle') {
        if (sty.dash) c.setLineDash(sty.dash);
        c.beginPath(); c.arc(g.cx, g.cy, g.r, 0, G.TAU); c.stroke();
        c.setLineDash([]);
        c.strokeStyle = 'rgba(37,99,235,.7)'; c.lineWidth = 1 / k;
        c.beginPath(); c.moveTo(g.cx, g.cy); c.lineTo(p.x, p.y); c.stroke();
        marker(c, k, g.cx, g.cy, 'obj');
        label(c, k, p.x, p.y, 'R ' + G.fmt(g.r, 1) + ' · Ø ' + G.fmt(g.r * 2, 1), '#1d4ed8');
      } else if (g.kind === 'arc') {
        marker(c, k, g.cx, g.cy, 'obj');
        if (g.phase === 1) {
          c.strokeStyle = 'rgba(100,116,139,.6)'; c.lineWidth = 1 / k; c.setLineDash([4 / k, 4 / k]);
          c.beginPath(); c.arc(g.cx, g.cy, g.r, 0, G.TAU); c.stroke(); c.setLineDash([]);
          c.beginPath(); c.moveTo(g.cx, g.cy); c.lineTo(g.cx + Math.cos(g.start) * g.r, g.cy + Math.sin(g.start) * g.r); c.stroke();
          label(c, k, p.x, p.y, 'R ' + G.fmt(g.r, 1), '#1d4ed8');
        } else {
          if (sty.dash) c.setLineDash(sty.dash);
          c.beginPath(); c.arc(g.cx, g.cy, g.r, g.start, g.start + g.sweep, g.sweep < 0); c.stroke();
          c.setLineDash([]);
          label(c, k, p.x, p.y, 'Busur ' + G.fmt(Math.abs(g.sweep) * G.R2D, 0) + '° · R ' + G.fmt(g.r, 1), '#1d4ed8');
        }
      } else if (g.kind === 'dim') {
        DTS_CANVAS.drawElement(c, { type: 'dim', x1: g.x1, y1: g.y1, x2: g.x2, y2: g.y2, off: g.off, w: 0.25, color: '#1d4ed8' }, k);
        marker(c, k, g.x2, g.y2, 'obj');
      }
    });
  }

  function eraserOverlay(p) {
    const R = Math.max(0.5, (S().props.eraserSize || 3) / 2);
    CV.setOverlay((c, k) => {
      c.fillStyle = 'rgba(244,114,182,.18)'; c.strokeStyle = '#db2777'; c.lineWidth = 1.2 / k;
      c.beginPath(); c.arc(p.x, p.y, R, 0, G.TAU); c.fill(); c.stroke();
    });
  }

  /* ======================= hover ======================= */
  function hoverFeedback(p) {
    const st = S(), tool = st.tool;
    const cv = document.getElementById('canvas');
    if (tool === 'pan') { cv.style.cursor = 'grab'; CV.setOverlay(null); return; }
    if (tool === 'eraser') { cv.style.cursor = 'none'; eraserOverlay(p); return; }
    const ih = tool === 'text' ? null : instHit(p.x, p.y);
    const edge = DRAW_TOOLS.includes(tool) ? INST.nearestEdge(p.x, p.y, thrMm(10)) : null;
    let cursor = tool === 'select' ? 'default' : 'crosshair';
    const prevHover = CV.getHover();
    let hov = null;
    if (ih && !(edge && ih.inst.kind !== 'compass' && ih.part === 'body')) {
      hov = { inst: ih.inst.id, part: ih.part };
      cursor = ih.part === 'rot' ? 'alias' : ih.part === 'pencil' ? 'ew-resize' : ih.part === 'head' ? 'grab' : 'move';
      if (ih.inst.locked && ih.part !== 'head') cursor = tool === 'select' ? 'not-allowed' : cursor;
    } else if (tool === 'select' && elementHit(p.x, p.y)) cursor = 'move';
    cv.style.cursor = cursor;
    if (JSON.stringify(prevHover) !== JSON.stringify(hov)) CV.setHover(hov);
    if (DRAW_TOOLS.includes(tool) && !hov) {
      const s = tool === 'pencil' ? (edge ? { x: edge.x, y: edge.y, kind: 'edge' } : null) : snapPoint(p.x, p.y);
      CV.setOverlay((c, k) => {
        if (edge) edgeGlow(c, k, edge.edge);
        if (s && s.kind) marker(c, k, s.x, s.y, s.kind);
      });
    } else CV.setOverlay(null);
  }

  /* ======================= aksi publik ======================= */
  function cancel() {
    if (g && g.kind === 'text') return;
    g = null; CV.setOverlay(null); CV.setHover(null); DTS_APP.hint('');
  }
  function deleteSelection() {
    const st = S();
    if (st.selection) {
      DTS_STATE.pushHistory();
      DTS_STATE.removeElement(st.selection);
      DTS_STATE.setSelection(null);
      DTS_STATE.changed();
      return true;
    }
    return false;
  }
  /** jangka: lingkaran penuh / busur dari panel */
  function compassDraw(sweepDeg) {
    const c = DTS_STATE.instrumentOf('compass');
    if (!c) return false;
    used.add('compass');
    if (sweepDeg >= 360) commitCircle(c.x, c.y, c.r, 'compass');
    else commit(Object.assign({ type: 'arc', cx: c.x, cy: c.y, r: c.r, start: c.ang, sweep: -sweepDeg * G.D2R, src: 'compass' }, lineStyle()));
    c.ang -= sweepDeg * G.D2R;
    DTS_STATE.changed();
    return true;
  }
  function isBusy() { return !!g; }

  return {
    onDown, onMove, onUp, cancel, deleteSelection, compassDraw, eraseAt,
    used, resetUsed() { used.clear(); }, isBusy, snapPoint, lineStyle
  };
})();
