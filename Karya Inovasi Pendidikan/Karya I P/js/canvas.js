/* ============================================================================
   CANVAS - render kertas A3 landscape, grid, elemen gambar, alat bantu 3D,
   panduan sementara, zoom/geser, dan ekspor PNG.
   ============================================================================ */
'use strict';
window.DTS_CANVAS = (function () {
  const G = DTS_GEOM;
  let canvas, ctx, dpr = 1;
  let overlay = null;        // fungsi gambar panduan sementara (diset oleh tools)
  let hover = null;          // info hover untuk instrumen

  function init(cv) {
    canvas = cv;
    ctx = cv.getContext('2d');
    new ResizeObserver(() => { const first = canvas.width <= 1; resize(); if (first) fit(); }).observe(cv.parentElement);
    resize();
    DTS_STATE.on('change', schedule);
    DTS_STATE.on('selection', schedule);
  }
  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    canvas.style.width = r.width + 'px';
    canvas.style.height = r.height + 'px';
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    render();
  }
  let raf = 0;
  function schedule() { if (!raf) raf = requestAnimationFrame(() => { raf = 0; render(); }); }

  const view = () => DTS_STATE.s().view;
  function size() { return { w: canvas.width / dpr, h: canvas.height / dpr }; }
  function toWorld(sx, sy) { const v = view(); return { x: (sx - v.ox) / v.scale, y: (sy - v.oy) / v.scale }; }

  function fit() {
    const s = size(), v = view();
    if (s.w < 10 || s.h < 10) return;
    v.scale = Math.min((s.w - 40) / G.SHEET.w, (s.h - 40) / G.SHEET.h);
    v.ox = (s.w - G.SHEET.w * v.scale) / 2;
    v.oy = (s.h - G.SHEET.h * v.scale) / 2;
    zoomLabel(); schedule();
  }
  function zoomBy(f, cx, cy) {
    const v = view(), s = size();
    if (cx == null) { cx = s.w / 2; cy = s.h / 2; }
    const ns = Math.max(0.3, Math.min(40, v.scale * f));
    const k = ns / v.scale;
    v.ox = cx - (cx - v.ox) * k; v.oy = cy - (cy - v.oy) * k; v.scale = ns;
    zoomLabel(); schedule();
  }
  function panBy(dx, dy) { view().ox += dx; view().oy += dy; schedule(); }
  function zoomLabel() {
    const el = document.getElementById('zoom-label');
    // 100% = ukuran nyata kira-kira (96 dpi -> 3,78 px/mm)
    if (el) el.textContent = Math.round(view().scale / 3.78 * 100) + '%';
  }

  /* ======================= gambar elemen ======================= */
  /** k = px per mm pada ctx (untuk lebar minimum) */
  function drawElement(c, el, k, opt) {
    c.save();
    c.lineCap = 'round'; c.lineJoin = 'round';
    const col = (opt && opt.color) || el.color || '#111827';
    c.strokeStyle = col; c.fillStyle = col;
    c.lineWidth = Math.max(el.w || 0.5, 0.9 / k);
    if (el.dash) { c.setLineDash(el.dash); c.lineCap = 'butt'; }
    if (el.type === 'line') {
      c.beginPath(); c.moveTo(el.x1, el.y1); c.lineTo(el.x2, el.y2); c.stroke();
    } else if (el.type === 'path') {
      c.beginPath();
      const p = el.pts;
      c.moveTo(p[0][0], p[0][1]);
      if (p.length === 1) c.lineTo(p[0][0] + 0.01, p[0][1]);
      for (let i = 1; i < p.length - 1; i++) {
        const mx = (p[i][0] + p[i + 1][0]) / 2, my = (p[i][1] + p[i + 1][1]) / 2;
        c.quadraticCurveTo(p[i][0], p[i][1], mx, my);
      }
      if (p.length > 1) c.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
      c.stroke();
    } else if (el.type === 'circle') {
      c.beginPath(); c.arc(el.cx, el.cy, el.r, 0, G.TAU); c.stroke();
    } else if (el.type === 'arc') {
      c.beginPath(); c.arc(el.cx, el.cy, el.r, el.start, el.start + el.sweep, el.sweep < 0); c.stroke();
    } else if (el.type === 'dim') {
      drawDim(c, el, k, col);
    } else if (el.type === 'text') {
      c.font = `${el.size}px "Segoe UI", Arial, sans-serif`;
      c.textBaseline = 'alphabetic';
      c.fillText(el.text, el.x, el.y);
    }
    c.restore();
  }
  function drawDim(c, el, k, col) {
    const d = G.dimGeom(el);
    const thin = Math.max(0.25, 0.8 / k);
    c.lineWidth = thin;
    c.setLineDash([]);
    const sgn = (el.off || 0) >= 0 ? 1 : -1;
    // garis bantu (menonjol 2 mm melewati garis ukur, celah 1 mm dari benda)
    const ext = (p, q) => {
      c.beginPath();
      c.moveTo(p.x + d.nx * sgn * 1, p.y + d.ny * sgn * 1);
      c.lineTo(q.x + d.nx * sgn * 2, q.y + d.ny * sgn * 2);
      c.stroke();
    };
    if (Math.abs(el.off || 0) > 1.2) { ext({ x: el.x1, y: el.y1 }, d.a); ext({ x: el.x2, y: el.y2 }, d.b); }
    c.beginPath(); c.moveTo(d.a.x, d.a.y); c.lineTo(d.b.x, d.b.y); c.stroke();
    const arrow = (p, ux, uy) => {
      const L = 3, W = 0.9;
      c.beginPath();
      c.moveTo(p.x, p.y);
      c.lineTo(p.x + ux * L + uy * W, p.y + uy * L - ux * W);
      c.lineTo(p.x + ux * L - uy * W, p.y + uy * L + ux * W);
      c.closePath(); c.fill();
    };
    arrow(d.a, d.ux, d.uy); arrow(d.b, -d.ux, -d.uy);
    // angka ukuran (dibaca dari bawah / kanan)
    let ang = Math.atan2(d.uy, d.ux);
    if (ang > Math.PI / 2 + 1e-6 || ang <= -Math.PI / 2 + 1e-6) ang += Math.PI;
    const txt = el.label || G.fmt(d.L, 1);
    c.save();
    c.translate(d.mid.x, d.mid.y);
    c.rotate(ang);
    c.font = '3.5px "Segoe UI", Arial, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'bottom';
    c.fillText(txt, 0, -0.8);
    c.restore();
  }

  /* ======================= kertas ======================= */
  function drawSheet(c, k, forExport) {
    const S = G.SHEET, M = G.MARGIN, TB = G.TB;
    const st = DTS_STATE.s();
    c.save();
    if (!forExport) {
      // bayangan kertas di meja gambar
      c.save();
      c.fillStyle = 'rgba(15,23,42,.35)';
      if ('filter' in c) c.filter = `blur(${Math.max(2, 10)}px)`;
      c.fillRect(2, 4, S.w, S.h);
      c.restore();
    }
    c.fillStyle = '#fffefa';
    c.fillRect(0, 0, S.w, S.h);
    if (!forExport && st.doc.grid) drawGrid(c, k);
    c.strokeStyle = '#111827';
    c.lineWidth = Math.max(0.7, 1 / k);
    const fx = M.l, fy = M.t, fw = S.w - M.l - M.r, fh = S.h - M.t - M.b;
    c.strokeRect(fx, fy, fw, fh);
    // kepala gambar (title block) kanan bawah
    const tx = S.w - M.r - TB.w, ty = S.h - M.b - TB.h;
    c.lineWidth = Math.max(0.5, 0.9 / k);
    c.fillStyle = '#fffefa';
    c.fillRect(tx, ty, TB.w, TB.h);
    c.strokeRect(tx, ty, TB.w, TB.h);
    c.lineWidth = Math.max(0.25, 0.7 / k);
    // tata letak etiket (mm): baris atas 15, baris bawah 10
    const H1 = 15;
    c.beginPath();
    c.moveTo(tx, ty + H1); c.lineTo(tx + TB.w, ty + H1);
    [30, 70, 134].forEach(x => { c.moveTo(tx + x, ty); c.lineTo(tx + x, ty + H1); });
    [50, 134, 164].forEach(x => { c.moveTo(tx + x, ty + H1); c.lineTo(tx + x, ty + TB.h); });
    c.stroke();
    // garis pemisah baris Skala/Satuan/Tanggal dan Digambar/Diperiksa/Disetujui
    c.save();
    c.lineWidth = Math.max(0.18, 0.55 / k);
    c.beginPath();
    [5, 10].forEach(y => { c.moveTo(tx + 30, ty + y); c.lineTo(tx + 134, ty + y); });
    c.stroke();
    c.restore();
    // simbol proyeksi Eropa (kerucut terpancung + lingkaran)
    const sx = tx + 15, sy = ty + H1 / 2;
    c.beginPath();
    c.moveTo(sx - 11, sy - 2.2); c.lineTo(sx - 1, sy - 4.2); c.lineTo(sx - 1, sy + 4.2); c.lineTo(sx - 11, sy + 2.2); c.closePath();
    c.moveTo(sx + 9.2, sy); c.arc(sx + 5, sy, 4.2, 0, G.TAU);
    c.moveTo(sx + 7.2, sy); c.arc(sx + 5, sy, 2.2, 0, G.TAU);
    c.stroke();
    c.save(); c.lineWidth = Math.max(0.18, 0.5 / k); c.setLineDash([2.5, 0.8, 0.5, 0.8]);
    c.beginPath(); c.moveTo(sx - 13, sy); c.lineTo(sx + 11, sy); c.moveTo(sx + 5, sy - 6); c.lineTo(sx + 5, sy + 6); c.stroke();
    c.restore();

    const info = st.doc.info || {};
    const dash = v => (v == null || String(v).trim() === '') ? '' : String(v).trim();
    c.textBaseline = 'middle';
    // tulis teks dan kecilkan otomatis bila tidak muat
    const put = (t, x, y, maxW, size, weight, align) => {
      t = String(t);
      let sz = size;
      c.font = `${weight || 600} ${sz}px "Segoe UI", Arial, sans-serif`;
      while (sz > 1.6 && c.measureText(t).width > maxW) { sz -= 0.2; c.font = `${weight || 600} ${sz}px "Segoe UI", Arial, sans-serif`; }
      c.textAlign = align || 'left';
      c.fillStyle = '#111827';
      c.fillText(t, x, y);
    };
    const tanggal = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    // kolom 2: skala / satuan / tanggal
    put('Skala : ' + (dash(info.skala) || '1 : 1'), tx + 31.5, ty + 2.6, 37, 2.7);
    put('Satuan Ukuran : ' + (dash(info.satuan) || 'mm'), tx + 31.5, ty + 7.5, 37, 2.7);
    put('Tanggal : ' + (dash(info.tanggal) || tanggal), tx + 31.5, ty + 12.5, 37, 2.7);
    // kolom 3: digambar / diperiksa / disetujui
    put('Digambar : ' + dash(info.nama), tx + 71.5, ty + 2.6, 61, 2.7);
    put('Diperiksa : ' + dash(info.diperiksa), tx + 71.5, ty + 7.5, 61, 2.7);
    put('Disetujui : ' + dash(info.disetujui), tx + 71.5, ty + 12.5, 61, 2.7);
    // kolom 4: keterangan
    put('Keterangan :', tx + 135.5, ty + 2.7, 43, 2.7);
    const ket = dash(info.keterangan) || (dash(info.kelas) ? 'Kelas ' + dash(info.kelas) : '');
    if (ket) put(ket, tx + 135.5, ty + 8.5, 43, 3);
    // baris bawah
    const yb = ty + H1 + (TB.h - H1) / 2;
    put(dash(info.sekolah) || 'SMK', tx + 25, yb, 47, 3.8, 800, 'center');
    put((dash(info.judul) || 'LATIHAN MENGGAMBAR').toUpperCase(), tx + 92, yb, 81, 4.2, 800, 'center');
    put('No.' + (dash(info.no) || '01'), tx + 149, yb, 28, 3.6, 800, 'center');
    put('A3', tx + 172, yb, 14, 3.8, 800, 'center');
    c.textAlign = 'left';
    c.restore();
  }
  function drawGrid(c, k) {
    const S = G.SHEET;
    c.save();
    c.lineWidth = 1 / k;
    if (k > 3) {
      c.strokeStyle = 'rgba(59,130,246,.10)';
      c.beginPath();
      for (let x = 5; x < S.w; x += 5) { c.moveTo(x, 0); c.lineTo(x, S.h); }
      for (let y = 5; y < S.h; y += 5) { c.moveTo(0, y); c.lineTo(S.w, y); }
      c.stroke();
    }
    c.strokeStyle = 'rgba(59,130,246,.22)';
    c.beginPath();
    for (let x = 10; x < S.w; x += 10) { if (x % 50) continue; c.moveTo(x, 0); c.lineTo(x, S.h); }
    for (let y = 10; y < S.h; y += 10) { if (y % 50) continue; c.moveTo(0, y); c.lineTo(S.w, y); }
    c.stroke();
    c.strokeStyle = 'rgba(59,130,246,.14)';
    c.beginPath();
    for (let x = 10; x < S.w; x += 10) { if (!(x % 50)) continue; c.moveTo(x, 0); c.lineTo(x, S.h); }
    for (let y = 10; y < S.h; y += 10) { if (!(y % 50)) continue; c.moveTo(0, y); c.lineTo(S.w, y); }
    c.stroke();
    c.restore();
  }

  /* ======================= render utama ======================= */
  function render() {
    if (!ctx) return;
    const st = DTS_STATE.s(), v = st.view;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // meja gambar
    const bg = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bg.addColorStop(0, '#9fb1c4'); bg.addColorStop(1, '#7f93a8');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(dpr * v.scale, 0, 0, dpr * v.scale, dpr * v.ox, dpr * v.oy);
    const k = v.scale;
    drawSheet(ctx, k, false);
    for (const el of st.doc.elements) drawElement(ctx, el, k);
    // seleksi
    const sel = DTS_STATE.getElement(st.selection);
    if (sel) drawSelection(sel, k);
    // alat bantu 3D (di atas gambar, seperti benda nyata di atas kertas)
    if (st.doc.showInst) {
      for (const inst of st.doc.instruments) {
        DTS_INST.draw(ctx, inst, {
          scale: k,
          active: st.activeInst === inst.id,
          lifted: !!(hover && hover.dragging === inst.id),
          hoverKnob: !!(hover && hover.inst === inst.id && hover.part === 'rot'),
          hoverHead: !!(hover && hover.inst === inst.id && hover.part === 'head')
        });
      }
    }
    if (overlay) { ctx.save(); try { overlay(ctx, k); } catch (e) { console.error(e); } ctx.restore(); }
  }

  function selectionHandles(el) {
    if (el.type === 'line' || el.type === 'dim') return [{ x: el.x1, y: el.y1, h: 'p1' }, { x: el.x2, y: el.y2, h: 'p2' }];
    if (el.type === 'circle') return [{ x: el.cx, y: el.cy, h: 'c' }, { x: el.cx + el.r, y: el.cy, h: 'r' }];
    if (el.type === 'arc') { const m = el.start + el.sweep / 2; return [{ x: el.cx, y: el.cy, h: 'c' }, { x: el.cx + Math.cos(m) * el.r, y: el.cy + Math.sin(m) * el.r, h: 'r' }]; }
    return [];
  }
  function drawSelection(el, k) {
    const b = G.bbox(el), pad = 2;
    ctx.save();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.2 / k;
    ctx.setLineDash([5 / k, 4 / k]);
    ctx.strokeRect(b.x0 - pad, b.y0 - pad, b.x1 - b.x0 + pad * 2, b.y1 - b.y0 + pad * 2);
    ctx.setLineDash([]);
    drawElement(ctx, el, k, { color: 'rgba(37,99,235,.55)' });
    const hs = 4.5 / k;
    for (const h of selectionHandles(el)) {
      ctx.fillStyle = '#fff'; ctx.strokeStyle = '#2563eb'; ctx.lineWidth = 1.5 / k;
      ctx.beginPath(); ctx.rect(h.x - hs, h.y - hs, hs * 2, hs * 2); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  /* ======================= ekspor ======================= */
  function exportCanvas(pxPerMm) {
    pxPerMm = pxPerMm || 4;
    const S = G.SHEET;
    const cv = document.createElement('canvas');
    cv.width = Math.round(S.w * pxPerMm); cv.height = Math.round(S.h * pxPerMm);
    const c = cv.getContext('2d');
    c.scale(pxPerMm, pxPerMm);
    drawSheet(c, pxPerMm, true);
    for (const el of DTS_STATE.s().doc.elements) drawElement(c, el, pxPerMm);
    return cv;
  }

  return {
    init, resize, render, schedule, fit, zoomBy, panBy, toWorld, size, view,
    drawElement, selectionHandles, exportCanvas,
    setOverlay(fn) { overlay = fn; schedule(); },
    setHover(h) { hover = h; schedule(); },
    getHover() { return hover; }
  };
})();
