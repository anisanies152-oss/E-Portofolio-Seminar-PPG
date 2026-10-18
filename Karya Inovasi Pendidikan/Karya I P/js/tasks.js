/* ============================================================================
   TASKS - latihan menggambar & penilaian otomatis (ukuran dan sudut)
   ============================================================================ */
'use strict';
window.DTS_TASKS = (function () {
  const G = DTS_GEOM;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function current() {
    const id = DTS_STATE.s().task;
    return DTS_DATA.TASKS.find(t => t.id === id) || null;
  }

  function evaluate(task) {
    const els = DTS_STATE.s().doc.elements;
    const lines = els.filter(e => e.type === 'line' && e.src !== 'center');
    const circles = els.filter(e => e.type === 'circle');
    const arcs = els.filter(e => e.type === 'arc');
    const usedL = new Set(), usedC = new Set(), usedA = new Set();
    const items = [];

    for (const ex of task.expected) {
      if (ex.kind === 'line') {
        let best = null;
        for (const l of lines) {
          if (usedL.has(l.id)) continue;
          const len = G.lineLen(l), ang = G.lineAng(l);
          const dL = Math.abs(len - ex.len), dA = G.lineAngDiff(ang, ex.ang);
          const cost = dL / ex.len * 100 + dA * 2;
          if (!best || cost < best.cost) best = { l, len, ang, dL, dA, cost };
        }
        const want = `Garis ${ex.len} mm, ${ex.ang}°`;
        if (!best || best.cost > 60) { items.push({ want, ok: false, score: 0, got: 'tidak ditemukan' }); continue; }
        usedL.add(best.l.id);
        const sL = clamp(100 - best.dL / ex.len * 100 * 4, 0, 100);
        const sA = clamp(100 - best.dA * 8, 0, 100);
        const score = Math.round((sL + sA) / 2);
        items.push({ want, ok: score >= 80, score, got: `${G.fmt(best.len, 1)} mm, ${G.fmt(G.norm360(best.ang) % 180, 0)}°` });
      } else if (ex.kind === 'circle') {
        let best = null;
        for (const c of circles) { if (usedC.has(c.id)) continue; const d = Math.abs(c.r - ex.r); if (!best || d < best.d) best = { c, d }; }
        const want = `Lingkaran R${ex.r} (Ø${ex.r * 2})`;
        if (!best) { items.push({ want, ok: false, score: 0, got: 'tidak ditemukan' }); continue; }
        usedC.add(best.c.id);
        const score = Math.round(clamp(100 - best.d / ex.r * 100 * 4, 0, 100));
        items.push({ want, ok: score >= 80, score, got: `R${G.fmt(best.c.r, 1)}` });
      } else if (ex.kind === 'arc') {
        let best = null;
        for (const a of arcs) {
          if (usedA.has(a.id)) continue;
          const sw = Math.abs(a.sweep) * G.R2D;
          const cost = Math.abs(a.r - ex.r) / ex.r * 100 + Math.abs(sw - ex.sweep);
          if (!best || cost < best.cost) best = { a, sw, cost };
        }
        const want = `Busur R${ex.r}, ${ex.sweep}°`;
        if (!best) { items.push({ want, ok: false, score: 0, got: 'tidak ditemukan' }); continue; }
        usedA.add(best.a.id);
        const sR = clamp(100 - Math.abs(best.a.r - ex.r) / ex.r * 100 * 4, 0, 100);
        const sS = clamp(100 - Math.abs(best.sw - ex.sweep) * 3, 0, 100);
        const score = Math.round((sR + sS) / 2);
        items.push({ want, ok: score >= 80, score, got: `R${G.fmt(best.a.r, 1)}, ${G.fmt(best.sw, 0)}°` });
      }
    }
    let total = items.length ? Math.round(items.reduce((s, i) => s + i.score, 0) / items.length) : 0;
    // kerapian: goresan bebas yang tertinggal
    const loose = els.filter(e => e.type === 'path').length;
    const notes = [];
    if (loose) { total = Math.max(0, total - Math.min(10, loose * 2)); notes.push(`${loose} goresan bebas tertinggal (−${Math.min(10, loose * 2)}). Hapus dengan Penghapus agar rapi.`); }
    const used = DTS_TOOLS.used;
    const instUsed = ['ruler', 'tri45', 'tri30', 'protractor', 'compass'].filter(k => used.has(k)).map(k => DTS_DATA.TOOLS[k].name);
    if (instUsed.length) notes.push('Alat bantu dipakai: ' + instUsed.join(', ') + '. Bagus!');
    else notes.push('Coba gunakan alat bantu (mistar/segitiga/busur derajat/jangka) seperti saat menggambar manual.');
    return { total, items, notes };
  }

  function grade(v) {
    if (v >= 90) return { t: 'Sangat Baik', c: 'good' };
    if (v >= 75) return { t: 'Baik', c: 'good' };
    if (v >= 60) return { t: 'Cukup', c: 'mid' };
    return { t: 'Perlu Latihan Lagi', c: 'bad' };
  }

  return { current, evaluate, grade };
})();
