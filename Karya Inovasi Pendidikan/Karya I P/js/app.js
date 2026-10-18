/* ============================================================================
   APP - navigasi Beranda/Simulasi, toolbar, panel properti, latihan, lembar,
   tombol bawah, pintasan keyboard
   ============================================================================ */
'use strict';
window.DTS_APP = (function () {
  const G = DTS_GEOM;
  const S = () => DTS_STATE.s();
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ICON = { select: 'ic-select', pan: 'ic-pan', pencil: 'ic-pencil', eraser: 'ic-eraser', line: 'ic-line', circle: 'ic-circle', arc: 'ic-arc', dimension: 'ic-dim', text: 'ic-text', ruler: 'ic-ruler', tri45: 'ic-tri45', tri30: 'ic-tri30', compass: 'ic-compass', protractor: 'ic-protractor' };
  const icon = k => `<svg viewBox="0 0 48 48"><use href="#${ICON[k]}"/></svg>`;
  let lastResult = null;
  let simInit = false;

  /* ======================= INIT ======================= */
  function init() {
    DTS_STATE.load();
    try { renderHomeTools(); } catch (e) { console.error(e); }
    document.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', ev => { ev.preventDefault(); go(b.dataset.nav); }));
    window.addEventListener('hashchange', () => route());
    document.querySelectorAll('[data-mtab]').forEach(b => b.addEventListener('click', () => { materiTab = b.dataset.mtab; try { localStorage.setItem('dts_mtab', materiTab); } catch (e) { /* abaikan */ } renderMateri(); }));
    route();
  }
  function route() {
    const h = (location.hash || '#beranda').slice(1);
    if (h === 'alat') { show('beranda'); return; }
    show(h === 'simulasi' || h === 'materi' ? h : 'beranda');
  }
  function go(view) {
    if (('#' + view) !== location.hash) location.hash = view; else show(view);
  }
  function show(view) {
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.nav === view));
    $('view-beranda').classList.toggle('hidden', view !== 'beranda');
    $('view-simulasi').classList.toggle('hidden', view !== 'simulasi');
    $('view-materi').classList.toggle('hidden', view !== 'materi');
    if (view === 'materi') renderMateri();
    if (view === 'simulasi') {
      if (!simInit) initSim();
      requestAnimationFrame(() => { DTS_CANVAS.resize(); });
    } else if (location.hash === '#alat') {
      const a = $('alat'); if (a) a.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* ======================= MATERI ======================= */
  let materiTab = (function () { try { return localStorage.getItem('dts_mtab') || 'modul'; } catch (e) { return 'modul'; } })();
  function renderMateri() {
    if (materiTab !== 'ringkas') materiTab = 'modul';
    document.querySelectorAll('[data-mtab]').forEach(b => b.classList.toggle('active', b.dataset.mtab === materiTab));
    $('modul-root').classList.toggle('hidden', materiTab !== 'modul');
    $('materi-root').classList.toggle('hidden', materiTab !== 'ringkas');
    if (materiTab === 'modul') DTS_MODUL.render(); else DTS_MATERI.render();
  }

  /* ======================= BERANDA ======================= */
  function renderHomeTools() {
    if (!$('home-tools')) return;   // bagian kartu alat tidak dipakai di Beranda
    const keys = ['ruler', 'tri45', 'tri30', 'protractor', 'compass', 'pencil', 'eraser', 'line', 'circle', 'arc', 'dimension', 'text'];
    $('home-tools').innerHTML = keys.map(k => {
      const t = DTS_DATA.TOOLS[k];
      return `<button class="tcard" data-try="${k}">
        <span class="tc-top"><span class="ti">${icon(k)}</span><span><b>${t.name}</b><i class="tag">${t.group === 'inst' ? 'ALAT BANTU 3D' : 'ALAT GAMBAR'}</i></span></span>
        <ol>${t.how.map(h => `<li>${h}</li>`).join('')}</ol>
        <span class="tc-try">Coba sekarang →</span></button>`;
    }).join('');
    $('home-tools').querySelectorAll('[data-try]').forEach(b => b.addEventListener('click', () => {
      go('simulasi');
      const k = b.dataset.try;
      setTimeout(() => { if (DTS_DATA.TOOLS[k].group === 'inst') placeInstrument(k); else setTool(k); }, 60);
    }));
  }

  /* ======================= SIMULASI ======================= */
  function initSim() {
    simInit = true;
    DTS_CANVAS.init($('canvas'));
    const cv = $('canvas');
    cv.addEventListener('pointerdown', e => DTS_TOOLS.onDown(e));
    cv.addEventListener('pointermove', e => DTS_TOOLS.onMove(e));
    cv.addEventListener('pointerup', e => DTS_TOOLS.onUp(e));
    cv.addEventListener('pointercancel', e => DTS_TOOLS.onUp(e));
    cv.addEventListener('pointerleave', () => { if (!DTS_TOOLS.isBusy()) { DTS_CANVAS.setOverlay(null); DTS_CANVAS.setHover(null); } });
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      const r = cv.getBoundingClientRect();
      DTS_CANVAS.zoomBy(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    }, { passive: false });
    cv.addEventListener('contextmenu', e => e.preventDefault());

    document.querySelectorAll('#toolbar [data-tool]').forEach(b => b.addEventListener('click', () => setTool(b.dataset.tool)));
    document.querySelectorAll('#toolbar [data-inst]').forEach(b => b.addEventListener('click', () => placeInstrument(b.dataset.inst, true)));
    document.querySelectorAll('.p-tab').forEach(t => t.addEventListener('click', () => switchTab(t.dataset.ptab)));
    wireBottom();
    document.addEventListener('keydown', onKey);
    DTS_STATE.on('history', updateHistoryBtns);
    DTS_STATE.on('selection', () => renderProps());
    DTS_STATE.on('instActive', () => { renderProps(); renderToolbar(); });
    DTS_STATE.on('change', () => { renderToolbar(); });
    renderToolbar(); renderProps(); renderLatihan(); renderLembar(); updateHistoryBtns(); syncToggles(); renderBanner();
    setTimeout(() => DTS_CANVAS.fit(), 30);
    if (!(S().doc.info.nama || '').trim()) { switchTab('lembar'); setTimeout(() => toast('Isi dulu nama dan data kepala gambar di tab Lembar.', 'info'), 700); }
    if (!localStorage.getItem('dts_seen_v2')) {
      try { localStorage.setItem('dts_seen_v2', '1'); } catch (e) { /* abaikan */ }
      setTimeout(() => toast('Klik alat bantu (Mistar, Segitiga, Jangka…) di panel alat untuk meletakkannya di kertas.', 'info'), 500);
    }
  }

  function setTool(k) {
    DTS_TOOLS.cancel();
    S().tool = k;
    if (k !== 'select') DTS_STATE.setSelection(null);
    renderToolbar(); renderProps();
    const c = $('canvas'); if (c) c.style.cursor = k === 'pan' ? 'grab' : k === 'select' ? 'default' : 'crosshair';
    if (k === 'arc') hint('Busur: tekan di titik pusat, seret ke titik awal, lepas — lalu putar dan klik.', 4000);
    else if (k === 'dimension') hint('Ukuran: seret dari titik pertama ke titik kedua, lepas — lalu atur jarak dan klik.', 4000);
    else hint('');
  }

  function placeInstrument(kind, toggle) {
    const st = S();
    let inst = DTS_STATE.instrumentOf(kind);
    if (!st.doc.showInst) { st.doc.showInst = true; syncToggles(); }
    if (!inst) {
      const s = DTS_CANVAS.size();
      const c = DTS_CANVAS.toWorld(s.w / 2, s.h / 2);
      const off = { ruler: [0, -100], tri45: [-130, 25], tri30: [115, 0], protractor: [0, 45], compass: [-15, -15] }[kind] || [0, 0];
      DTS_STATE.pushHistory();
      inst = DTS_STATE.addInstrument(DTS_INST.create(kind, c.x + off[0], c.y + off[1]));
      DTS_TOOLS.used.add(kind);
      toast(DTS_DATA.TOOLS[kind].name + ' diletakkan. Seret badannya untuk memindah, bola hijau untuk memutar.', 'ok');
    } else if (toggle) {
      // tombol di panel alat: sudah ada di kertas -> klik lagi = singkirkan dari workspace
      DTS_TOOLS.cancel();
      DTS_STATE.pushHistory();
      DTS_STATE.removeInstrument(inst.id);
      DTS_STATE.changed();
      renderToolbar(); renderProps();
      toast(DTS_DATA.TOOLS[kind].name + ' disingkirkan dari kertas. Klik lagi untuk memunculkan.', 'info');
      return;
    } else {
      const a = st.doc.instruments; a.splice(a.indexOf(inst), 1); a.push(inst);
    }
    st.activeInst = inst.id;
    if (['eraser', 'pan', 'text'].includes(st.tool)) st.tool = 'select';
    DTS_STATE.changed();
    renderToolbar(); renderProps(); switchTab('props');
    if (window.innerWidth <= 1100) { /* biarkan panel tertutup di layar kecil */ }
  }

  function renderToolbar() {
    const st = S();
    document.querySelectorAll('#toolbar [data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === st.tool));
    document.querySelectorAll('#toolbar [data-inst]').forEach(b => {
      const inst = DTS_STATE.instrumentOf(b.dataset.inst);
      b.classList.toggle('active', !!inst && st.activeInst === inst.id);
      let dot = b.querySelector('.placed');
      if (inst && !dot) { dot = document.createElement('i'); dot.className = 'placed'; dot.title = 'Sudah di atas kertas'; b.appendChild(dot); }
      if (!inst && dot) dot.remove();
    });
  }

  /* ======================= PANEL PROPERTI ======================= */
  function seg(attr, items, cur) {
    return `<div class="seg">${items.map(i => `<button data-${attr}="${i[0]}" class="${String(cur) === String(i[0]) ? 'active' : ''}">${i[1]}</button>`).join('')}</div>`;
  }
  function lineCtrls(withStep, withCenter) {
    const p = S().props;
    return `
      <div class="ctrl"><label>Tebal garis</label>${seg('lw', DTS_DATA.LINE_WIDTHS.map(w => [w.id, `<i class="lw" style="width:16px;height:${Math.max(1, w.mm * 4)}px"></i>${w.label}`]), p.lineWidth)}</div>
      <div class="ctrl"><label>Jenis garis</label><select data-lt>${DTS_DATA.LINE_TYPES.map(t => `<option value="${t.id}" ${p.lineType === t.id ? 'selected' : ''}>${t.label}</option>`).join('')}</select></div>
      ${withStep ? `<div class="ctrl"><label>Snap sudut</label>${seg('step', [[0, 'Bebas'], [15, '15°'], [5, '5°'], [1, '1°']], p.angleStep)}</div>` : ''}
      ${withCenter ? `<div class="ctrl"><label>Garis sumbu otomatis</label>${seg('cl', [[1, 'Aktif'], [0, 'Tidak']], p.centerLines ? 1 : 0)}</div>` : ''}`;
  }

  function renderProps() {
    const box = $('ptab-props');
    if (!box) return;
    if (box.contains(document.activeElement) && document.activeElement.tagName === 'INPUT') return; // jangan ganggu saat mengetik
    const st = S(), p = st.props;
    let h = '';
    // --- alat bantu aktif ---
    const inst = DTS_STATE.getInstrument(st.activeInst);
    if (inst) h += instCard(inst);
    // --- objek terpilih ---
    const el = DTS_STATE.getElement(st.selection);
    if (el) h += elCard(el);
    // --- alat aktif ---
    const t = DTS_DATA.TOOLS[st.tool];
    let c = '';
    if (st.tool === 'line') c = lineCtrls(true, false);
    else if (st.tool === 'circle') c = lineCtrls(false, true);
    else if (st.tool === 'arc') c = lineCtrls(true, false);
    else if (st.tool === 'pencil') c = `<div class="ctrl"><label>Kekerasan pensil</label>${seg('pc', DTS_DATA.PENCILS.map(x => [x.id, `${x.label}<br><small style="font-weight:500">${x.desc}</small>`]), p.pencil)}</div>`;
    else if (st.tool === 'eraser') c = `<div class="ctrl"><label>Mode</label>${seg('em', [['partial', 'Sebagian'], ['object', 'Objek utuh']], p.eraserMode)}</div>
        <div class="ctrl"><label>Ukuran penghapus</label>${seg('es', [[2, '2 mm'], [4, '4 mm'], [8, '8 mm'], [14, '14 mm']], p.eraserSize)}</div>`;
    else if (st.tool === 'text') c = `<div class="ctrl"><label>Tinggi huruf</label>${seg('ts', [[3.5, '3,5'], [5, '5'], [7, '7'], [10, '10']], p.textSize)}</div>`;
    h += `<div class="card"><h4>${icon(st.tool)} ${t.name}</h4><p>${t.desc}</p><ol>${t.how.map(x => `<li>${x}</li>`).join('')}</ol>${c}</div>`;
    if (!inst) h += `<div class="card"><p class="muted">💡 Letakkan alat bantu 3D dari panel kiri. Saat memakai Pensil atau Garis, mulailah tepat di tepi alat bantu (tepi menyala oranye) agar garis mengikuti tepi tersebut.</p></div>`;
    box.innerHTML = h;
    bindProps(box);
  }

  function instCard(inst) {
    const t = DTS_DATA.TOOLS[inst.kind];
    let body = '';
    if (inst.kind === 'compass') {
      body = `
        <div class="ctrl"><label>Bukaan kaki (jari-jari)</label>
          <div class="row"><span class="big-val">R ${G.fmt(inst.r, 1)}</span><span class="muted">Ø ${G.fmt(inst.r * 2, 1)} mm</span></div>
          <input type="range" min="${DTS_INST.COMPASS_MIN_R}" max="${DTS_INST.COMPASS_MAX_R}" step="0.5" value="${inst.r}" data-cr>
          <div class="row" style="margin-top:6px"><input type="number" min="2" max="180" step="0.5" value="${inst.r}" data-crn><span class="muted" style="flex:0 0 auto">mm</span></div>
        </div>
        <div class="ctrl"><label>Gambar dengan jangka</label>
          <button class="btn btn-sm btn-block" data-cfull>◯ Putar penuh (lingkaran)</button>
          <div class="row" style="margin-top:8px"><input type="number" value="90" min="1" max="359" data-carc-deg><button class="btn btn-sm btn-ghost" data-carc style="flex:1.4">◜ Busur °</button></div>
          <p class="muted" style="margin-top:6px">Atau seret <b>kepala jangka</b> (pegangan di atas) memutar jarum untuk menggambar sendiri.</p>
        </div>
        ${lineCtrls(false, true)}`;
    } else {
      const presets = inst.kind === 'tri45' ? [0, 45, 90, 135, 180, 270] : inst.kind === 'tri30' ? [0, 30, 60, 90, 120, 150, 180, 270] : [0, 15, 30, 45, 60, 90, 180];
      const disp = Math.round(G.norm360(-(inst.rot || 0)));
      body = `
        <div class="ctrl"><label>Putaran (°)</label><div class="row"><input type="number" step="1" value="${disp}" data-irot><span class="muted" style="flex:0 0 auto">berlawanan jarum jam</span></div></div>
        <div class="ctrl"><label>Putar cepat</label>${seg('ipre', presets.map(a => [a, a + '°']), presets.includes(disp) ? disp : '')}</div>`;
    }
    return `<div class="card inst-card"><h4>${icon(inst.kind)} ${t.name}</h4><p>${t.desc}</p>${body}
      <div class="ctrl row">
        <button class="btn btn-sm ${inst.locked ? 'btn-green' : 'btn-ghost'}" data-ilock>${inst.locked ? '🔒 Terkunci' : '🔓 Kunci'}</button>
        <button class="btn btn-sm btn-ghost" data-icenter>Ke tengah</button>
        <button class="btn btn-sm btn-ghost" data-iremove>Simpan</button>
      </div></div>`;
  }

  function elCard(el) {
    let h = '';
    if (el.type === 'line') {
      h = `<div class="ctrl"><label>Panjang (mm)</label><input type="number" step="0.5" value="${+G.lineLen(el).toFixed(1)}" data-elen></div>
           <div class="ctrl"><label>Sudut (°)</label><input type="number" step="1" value="${+G.lineAng(el).toFixed(1)}" data-eang></div>`;
    } else if (el.type === 'circle' || el.type === 'arc') {
      h = `<div class="ctrl"><label>Jari-jari R (mm)</label><input type="number" step="0.5" min="0.5" value="${+el.r.toFixed(1)}" data-er></div>`;
      if (el.type === 'arc') h += `<p class="muted" style="margin-top:6px">Besar busur: ${G.fmt(Math.abs(el.sweep) * G.R2D, 0)}°</p>`;
    } else if (el.type === 'dim') h = `<p class="muted">Ukuran: ${G.fmt(G.dist(el.x1, el.y1, el.x2, el.y2), 1)} mm</p>`;
    else if (el.type === 'text') h = `<div class="ctrl"><label>Teks</label><input type="text" value="${esc(el.text)}" data-etext></div>`;
    else if (el.type === 'path') h = `<p class="muted">Goresan pensil bebas (${el.pts.length} titik).</p>`;
    const names = { line: 'Garis', circle: 'Lingkaran', arc: 'Busur', dim: 'Ukuran', text: 'Teks', path: 'Goresan pensil' };
    return `<div class="card" style="border-color:#93c5fd"><h4>Objek terpilih: ${names[el.type] || el.type}</h4>${h}
      <div class="ctrl"><button class="btn btn-sm btn-danger btn-block" data-edel>Hapus objek (Delete)</button></div></div>`;
  }

  function bindProps(box) {
    const st = S(), p = st.props;
    const on = (sel, ev, fn) => box.querySelectorAll(sel).forEach(b => b.addEventListener(ev, () => fn(b)));
    const save = () => { DTS_STATE.save(); renderProps(); };
    on('[data-lw]', 'click', b => { p.lineWidth = b.dataset.lw; save(); });
    on('[data-lt]', 'change', b => { p.lineType = b.value; save(); });
    on('[data-step]', 'click', b => { p.angleStep = +b.dataset.step; save(); });
    on('[data-cl]', 'click', b => { p.centerLines = b.dataset.cl === '1'; save(); });
    on('[data-pc]', 'click', b => { p.pencil = b.dataset.pc; save(); });
    on('[data-em]', 'click', b => { p.eraserMode = b.dataset.em; save(); });
    on('[data-es]', 'click', b => { p.eraserSize = +b.dataset.es; save(); });
    on('[data-ts]', 'click', b => { p.textSize = +b.dataset.ts; save(); });

    const inst = DTS_STATE.getInstrument(st.activeInst);
    if (inst) {
      on('[data-ilock]', 'click', () => { inst.locked = !inst.locked; DTS_STATE.changed(); renderProps(); toast(inst.locked ? 'Posisi dikunci.' : 'Kunci dibuka.', 'info'); });
      on('[data-icenter]', 'click', () => {
        DTS_STATE.pushHistory();
        const s = DTS_CANVAS.size(), c = DTS_CANVAS.toWorld(s.w / 2, s.h / 2);
        const fresh = DTS_INST.create(inst.kind, c.x, c.y);
        inst.x = fresh.x; inst.y = fresh.y; if (inst.kind !== 'compass') { const r = inst.rot; inst.rot = 0; DTS_INST.setRotation(inst, r); }
        DTS_STATE.changed();
      });
      on('[data-iremove]', 'click', () => { DTS_STATE.pushHistory(); DTS_STATE.removeInstrument(inst.id); DTS_STATE.changed(); renderToolbar(); renderProps(); toast(DTS_DATA.TOOLS[inst.kind].name + ' disimpan kembali ke kotak alat.', 'info'); });
      on('[data-irot]', 'change', b => { DTS_STATE.pushHistory(); DTS_INST.setRotation(inst, -(parseFloat(b.value) || 0)); DTS_STATE.changed(); b.blur(); renderProps(); });
      on('[data-ipre]', 'click', b => { DTS_STATE.pushHistory(); DTS_INST.setRotation(inst, -(+b.dataset.ipre)); DTS_STATE.changed(); renderProps(); });
      on('[data-cr]', 'input', b => { DTS_INST.setCompassRadius(inst, +b.value); DTS_CANVAS.schedule(); const v = box.querySelector('.big-val'); if (v) v.textContent = 'R ' + G.fmt(inst.r, 1); const n = box.querySelector('[data-crn]'); if (n) n.value = inst.r; });
      on('[data-cr]', 'change', () => { DTS_STATE.changed(); renderProps(); });
      on('[data-crn]', 'change', b => { DTS_INST.setCompassRadius(inst, parseFloat(b.value) || inst.r); DTS_STATE.changed(); b.blur(); renderProps(); });
      on('[data-cfull]', 'click', () => { DTS_TOOLS.compassDraw(360); toast('Lingkaran R ' + G.fmt(inst.r, 1) + ' dibuat dengan jangka.', 'ok'); });
      on('[data-carc]', 'click', () => {
        const d = Math.max(1, Math.min(359, parseFloat(box.querySelector('[data-carc-deg]').value) || 90));
        DTS_TOOLS.compassDraw(d); toast('Busur ' + d + '° dibuat dengan jangka.', 'ok');
      });
    }
    const el = DTS_STATE.getElement(st.selection);
    if (el) {
      on('[data-edel]', 'click', () => DTS_TOOLS.deleteSelection());
      on('[data-elen]', 'change', b => {
        const L = parseFloat(b.value); if (!(L > 0)) return;
        DTS_STATE.pushHistory();
        const a = G.lineAng(el) * G.D2R;
        el.x2 = el.x1 + Math.cos(a) * L; el.y2 = el.y1 - Math.sin(a) * L;
        DTS_STATE.changed(); b.blur(); renderProps();
      });
      on('[data-eang]', 'change', b => {
        const A = parseFloat(b.value); if (isNaN(A)) return;
        DTS_STATE.pushHistory();
        const L = G.lineLen(el), a = A * G.D2R;
        el.x2 = el.x1 + Math.cos(a) * L; el.y2 = el.y1 - Math.sin(a) * L;
        DTS_STATE.changed(); b.blur(); renderProps();
      });
      on('[data-er]', 'change', b => { const r = parseFloat(b.value); if (!(r > 0)) return; DTS_STATE.pushHistory(); el.r = r; DTS_STATE.changed(); b.blur(); renderProps(); });
      on('[data-etext]', 'change', b => { DTS_STATE.pushHistory(); el.text = b.value || el.text; DTS_STATE.changed(); b.blur(); });
    }
  }

  /* ======================= LATIHAN ======================= */
  function renderLatihan() {
    const box = $('ptab-latihan');
    const st = S();
    const cur = DTS_TASKS.current();
    const best = loadScores();
    let h = '';
    if (cur) {
      h += `<div class="card" style="border-color:#fcd34d;background:#fffbeb"><h4>📝 ${esc(cur.title)}</h4><p>${esc(cur.desc)}</p><p class="muted" style="margin-top:6px">Petunjuk: ${esc(cur.hint)}</p>
        <div class="ctrl row"><button class="btn btn-sm btn-green" data-check>Periksa &amp; Nilai</button><button class="btn btn-sm btn-ghost" data-exit>Keluar</button></div></div>`;
      if (lastResult && lastResult.id === cur.id) {
        const r = lastResult.res, gr = DTS_TASKS.grade(r.total);
        h += `<div class="card"><div class="score-big"><div class="n ${gr.c}">${r.total}</div><div class="g ${gr.c}">${gr.t}</div></div>
          ${r.items.map(i => `<div class="res-item"><i class="${i.ok ? 'good' : 'bad'}">${i.ok ? '✓' : '✕'}</i><span>${esc(i.want)}<small>Hasil: ${esc(i.got)} · skor ${i.score}</small></span></div>`).join('')}
          ${r.notes.map(n => `<div class="res-item"><i>ℹ</i><span>${esc(n)}</span></div>`).join('')}</div>`;
      }
    }
    h += `<div class="card"><h4>Daftar Latihan</h4><p>Pilih latihan — lembar akan dibersihkan, lalu gambar sesuai perintah dan tekan <b>Periksa &amp; Nilai</b>.</p></div>
      <div class="task-list">${DTS_DATA.TASKS.map((t, i) => `<button class="task-item ${st.task === t.id ? 'active' : ''}" data-task="${t.id}"><span class="no">${i + 1}</span><span>${esc(t.title)}</span>${best[t.id] != null ? `<span class="sc ${DTS_TASKS.grade(best[t.id]).c}">${best[t.id]}</span>` : ''}</button>`).join('')}</div>`;
    box.innerHTML = h;
    box.querySelectorAll('[data-task]').forEach(b => b.addEventListener('click', () => startTask(b.dataset.task)));
    const ck = box.querySelector('[data-check]'); if (ck) ck.addEventListener('click', checkTask);
    const ex = box.querySelector('[data-exit]'); if (ex) ex.addEventListener('click', exitTask);
  }
  function loadScores() { try { return JSON.parse(localStorage.getItem('dts_scores_v2') || '{}'); } catch (e) { return {}; } }
  function saveScore(id, v) { const s = loadScores(); s[id] = Math.max(v, s[id] || 0); try { localStorage.setItem('dts_scores_v2', JSON.stringify(s)); } catch (e) { /* abaikan */ } }

  function startTask(id) {
    const t = DTS_DATA.TASKS.find(x => x.id === id);
    if (!t) return;
    const st = S();
    if (st.doc.elements.length && !confirm('Mulai latihan "' + t.title + '"? Gambar di lembar akan dibersihkan (bisa dibatalkan dengan Undo).')) return;
    DTS_STATE.pushHistory();
    st.doc.elements = [];
    st.selection = null;
    st.task = id;
    st.doc.info.judul = t.title;
    lastResult = null;
    DTS_TOOLS.resetUsed();
    DTS_STATE.changed();
    renderLatihan(); renderBanner(); renderLembar();
    toast('Latihan dimulai: ' + t.title, 'info');
  }
  function checkTask() {
    const t = DTS_TASKS.current();
    if (!t) return;
    const res = DTS_TASKS.evaluate(t);
    lastResult = { id: t.id, res };
    saveScore(t.id, res.total);
    switchTab('latihan');
    renderLatihan();
    openPanel();
    toast('Nilai: ' + res.total + ' — ' + DTS_TASKS.grade(res.total).t, res.total >= 75 ? 'ok' : 'warn');
  }
  function exitTask() { S().task = null; lastResult = null; DTS_STATE.save(); renderLatihan(); renderBanner(); }
  function renderBanner() {
    const t = DTS_TASKS.current();
    $('task-banner').classList.toggle('hidden', !t);
    if (t) { $('tb-title').textContent = 'Latihan: ' + t.title; $('tb-desc').textContent = t.desc; }
  }

  /* ======================= LEMBAR ======================= */
  function renderLembar() {
    const box = $('ptab-lembar');
    const info = S().doc.info;
    const f = (k, l, ph) => `<div class="ctrl"><label>${l}</label><input type="text" data-info="${k}" value="${esc(info[k] || '')}" placeholder="${ph || ''}" maxlength="40"></div>`;
    box.innerHTML = `
      <div class="card"><h4>📄 Kertas A3 Landscape</h4><p>420 × 297 mm · garis tepi kiri 20 mm, lainnya 10 mm · kepala gambar (etiket) 180 × 25 mm di kanan bawah.</p></div>
      <div class="card ${info.nama ? '' : 'need'}" id="tb-card"><h4>✍️ Isi Kepala Gambar</h4>
        <p class="muted" style="margin-bottom:4px">Isian langsung tampil di etiket kertas. Klik etiket di kertas untuk membuka isian ini.</p>
        ${f('nama', 'Digambar (nama siswa)', 'mis. Andi Pratama')}
        <div class="row">${f('kelas', 'Kelas', 'mis. X TPM 1')}${f('no', 'No. gambar', '01')}</div>
        ${f('sekolah', 'Nama sekolah', 'mis. SMK Tiara LHT')}
        ${f('judul', 'Judul gambar', 'mis. Menggambar Garis')}
        <div class="row">${f('skala', 'Skala', '1 : 1')}${f('satuan', 'Satuan ukuran', 'mm')}</div>
        ${f('tanggal', 'Tanggal (kosong = hari ini)', new Date().toLocaleDateString('id-ID'))}
        ${f('diperiksa', 'Diperiksa (guru)', 'mis. Bpk. Arif')}
        ${f('disetujui', 'Disetujui', 'mis. Ka. Program')}
        ${f('keterangan', 'Keterangan (kosong = kelas)', '')}
      </div>
      <div class="card"><h4>Simpan &amp; Cetak</h4>
        <div class="ctrl"><button class="btn btn-sm btn-block" data-png>⬇ Unduh PNG</button></div>
        <div class="ctrl"><button class="btn btn-sm btn-ghost btn-block" data-print>🖨 Cetak / Simpan PDF</button></div>
        <div class="ctrl"><button class="btn btn-sm btn-ghost btn-block" data-putaway>Simpan semua alat bantu</button></div>
        <div class="ctrl"><button class="btn btn-sm btn-danger btn-block" data-clear>Bersihkan lembar</button></div>
      </div>`;
    box.querySelectorAll('[data-info]').forEach(i => i.addEventListener('input', () => {
      S().doc.info[i.dataset.info] = i.value; DTS_STATE.changed();
      if (i.dataset.info === 'nama') $('tb-card').classList.toggle('need', !i.value.trim());
    }));
    box.querySelector('[data-png]').addEventListener('click', exportPNG);
    box.querySelector('[data-print]').addEventListener('click', printSheet);
    box.querySelector('[data-putaway]').addEventListener('click', () => {
      if (!S().doc.instruments.length) return;
      DTS_STATE.pushHistory(); S().doc.instruments = []; S().activeInst = null; DTS_STATE.changed(); renderToolbar(); renderProps();
    });
    box.querySelector('[data-clear]').addEventListener('click', () => {
      if (!S().doc.elements.length) { toast('Lembar sudah bersih.'); return; }
      if (!confirm('Hapus semua gambar di lembar? (bisa dibatalkan dengan Undo)')) return;
      DTS_STATE.pushHistory(); S().doc.elements = []; S().selection = null; DTS_STATE.changed(); renderProps();
      toast('Lembar dibersihkan.', 'info');
    });
  }
  function fileName() { return 'gambar-teknik-' + (S().doc.info.judul || 'A3').replace(/[^\w\-]+/g, '_').slice(0, 30) + '.png'; }
  function exportPNG() {
    const cv = DTS_CANVAS.exportCanvas(5);
    cv.toBlob(b => {
      if (!b) { toast('Gagal membuat PNG.', 'warn'); return; }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = fileName();
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      toast('PNG A3 diunduh.', 'ok');
    }, 'image/png');
  }
  function printSheet() {
    const url = DTS_CANVAS.exportCanvas(6).toDataURL('image/png');
    const fr = document.createElement('iframe');
    fr.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
    document.body.appendChild(fr);
    const d = fr.contentWindow.document;
    d.open();
    d.write(`<!doctype html><html><head><title>Cetak A3</title><style>@page{size:A3 landscape;margin:0}html,body{margin:0}img{width:420mm;height:297mm;display:block}</style></head><body><img src="${url}"></body></html>`);
    d.close();
    const img = d.querySelector('img');
    const go = () => { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { toast('Cetak tidak tersedia — gunakan Unduh PNG.', 'warn'); } setTimeout(() => fr.remove(), 60000); };
    if (img.complete) setTimeout(go, 50); else img.onload = go;
  }

  function openLembar(focusKey) {
    switchTab('lembar'); openPanel();
    const i = document.querySelector(`#ptab-lembar [data-info="${focusKey || 'nama'}"]`);
    if (i) { i.focus(); i.select(); }
  }

  /* ======================= BOTTOM BAR ======================= */
  function wireBottom() {
    $('btn-undo').addEventListener('click', () => { DTS_TOOLS.cancel(); DTS_STATE.undo(); renderProps(); renderToolbar(); });
    $('btn-redo').addEventListener('click', () => { DTS_TOOLS.cancel(); DTS_STATE.redo(); renderProps(); renderToolbar(); });
    $('btn-zoomin').addEventListener('click', () => DTS_CANVAS.zoomBy(1.25));
    $('btn-zoomout').addEventListener('click', () => DTS_CANVAS.zoomBy(0.8));
    $('btn-fit').addEventListener('click', () => DTS_CANVAS.fit());
    const tg = (id, key, msg) => $(id).addEventListener('click', () => {
      S().doc[key] = !S().doc[key];
      syncToggles(); DTS_STATE.changed();
      toast(msg + (S().doc[key] ? ' aktif' : ' nonaktif'));
    });
    tg('btn-grid', 'grid', 'Grid'); tg('btn-snap', 'snap', 'Snap'); tg('btn-inst', 'showInst', 'Alat bantu');
    $('btn-panel').addEventListener('click', () => $('panel').classList.toggle('open'));
    $('btn-task-check').addEventListener('click', checkTask);
    $('btn-task-exit').addEventListener('click', exitTask);
  }
  function openPanel() { $('panel').classList.add('open'); }
  function syncToggles() {
    const d = S().doc;
    $('btn-grid').classList.toggle('on', !!d.grid);
    $('btn-snap').classList.toggle('on', !!d.snap);
    $('btn-inst').classList.toggle('on', !!d.showInst);
  }
  function updateHistoryBtns() { $('btn-undo').disabled = !DTS_STATE.canUndo(); $('btn-redo').disabled = !DTS_STATE.canRedo(); }
  function switchTab(tab) {
    document.querySelectorAll('.p-tab').forEach(t => t.classList.toggle('active', t.dataset.ptab === tab));
    document.querySelectorAll('.p-body').forEach(p => p.classList.toggle('active', p.id === 'ptab-' + tab));
    if (tab === 'latihan') renderLatihan();
    if (tab === 'props') renderProps();
  }

  /* ======================= KEYBOARD ======================= */
  function onKey(e) {
    if ($('view-simulasi').classList.contains('hidden')) return;
    const tg = e.target;
    if (tg && (tg.tagName === 'INPUT' || tg.tagName === 'SELECT' || tg.tagName === 'TEXTAREA')) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); DTS_TOOLS.cancel(); e.shiftKey ? DTS_STATE.redo() : DTS_STATE.undo(); renderProps(); renderToolbar(); return; }
    if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); DTS_TOOLS.cancel(); DTS_STATE.redo(); renderProps(); renderToolbar(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Delete' || e.key === 'Backspace') { if (DTS_TOOLS.deleteSelection()) e.preventDefault(); return; }
    if (e.key === 'Escape') { DTS_TOOLS.cancel(); DTS_STATE.setSelection(null); return; }
    const map = { v: 'select', h: 'pan', p: 'pencil', e: 'eraser', l: 'line', c: 'circle', a: 'arc', d: 'dimension', t: 'text' };
    if (map[k]) { setTool(map[k]); return; }
    if (k === '+' || k === '=') DTS_CANVAS.zoomBy(1.25);
    else if (k === '-') DTS_CANVAS.zoomBy(0.8);
    else if (k === '0') DTS_CANVAS.fit();
  }

  /* ======================= util UI ======================= */
  function toast(msg, type) {
    const root = $('toast-root');
    const t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    t.textContent = msg;
    root.appendChild(t);
    while (root.children.length > 2) root.firstChild.remove();
    setTimeout(() => { t.style.transition = 'opacity .3s'; t.style.opacity = '0'; setTimeout(() => t.remove(), 320); }, 3200);
  }
  let hintTimer = 0;
  function hint(msg, ms) {
    const h = $('hint'); if (!h) return;
    clearTimeout(hintTimer);
    if (!msg) { h.classList.add('hidden'); return; }
    h.textContent = msg; h.classList.remove('hidden');
    if (ms) hintTimer = setTimeout(() => h.classList.add('hidden'), ms);
  }
  let roRaf = 0, ro = null;
  function setReadout(x, y) {
    ro = [x, y];
    if (roRaf) return;
    roRaf = requestAnimationFrame(() => { roRaf = 0; const el = $('readout'); if (el) el.textContent = `X ${G.fmt(ro[0], 1)} · Y ${G.fmt(ro[1], 1)} mm`; });
  }
  function onDrawn() { renderProps(); }

  return { init, go, setTool, placeInstrument, renderProps, renderToolbar, toast, hint, setReadout, onDrawn, switchTab, startTask, openLembar };
})();

document.addEventListener('DOMContentLoaded', () => DTS_APP.init());
