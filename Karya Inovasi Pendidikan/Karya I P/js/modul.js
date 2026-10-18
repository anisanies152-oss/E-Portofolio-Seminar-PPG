/* ============================================================================
   MODUL - pembaca Modul Gambar Teknik (halaman 9–70) di dalam aplikasi:
   daftar isi, navigasi halaman, zoom, pencarian teks, progres baca,
   dan tautan praktik ke Simulasi.
   ============================================================================ */
'use strict';
window.DTS_MODUL = (function () {
  const D = () => window.DTS_MODUL_DATA;
  const KEY_PAGE = 'dts_modul_page', KEY_SEEN = 'dts_modul_seen';
  let page = null, zoom = 1, built = false, searchTimer = 0;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const src = p => `assets/modul/hal-${String(p).padStart(3, '0')}.webp`;

  function seen() { try { return new Set(JSON.parse(localStorage.getItem(KEY_SEEN) || '[]')); } catch (e) { return new Set(); } }
  function save(p) {
    try {
      localStorage.setItem(KEY_PAGE, String(p));
      const s = seen(); s.add(p); localStorage.setItem(KEY_SEEN, JSON.stringify([...s]));
    } catch (e) { /* abaikan */ }
  }
  function flatToc() {
    const out = [];
    for (const g of D().toc) {
      out.push({ t: g.t, p: g.p, lvl: 0 });
      for (const it of (g.items || [])) out.push({ t: it[0], p: it[1], lvl: it[2] || 1, kb: g.kb });
    }
    return out;
  }
  function sectionOf(p) {
    let best = null;
    for (const it of flatToc()) if (it.p <= p) best = it;
    return best;
  }

  /* ======================= kerangka ======================= */
  function build() {
    const d = D();
    const root = document.getElementById('modul-root');
    const tocHtml = d.toc.map((g, gi) => `
      <div class="md-group ${g.items ? '' : 'single'}">
        <button class="md-g-head" data-p="${g.p}" ${g.items ? `data-toggle="${gi}"` : ''}>
          ${g.kb ? `<span class="md-kb kb${g.kb}">KB ${g.kb}</span>` : '<span class="md-kb">BAB</span>'}
          <span>${esc(g.t.replace(/^Kegiatan Belajar \d · /, ''))}</span>
          ${g.items ? '<i class="md-caret">▾</i>' : ''}
        </button>
        ${g.items ? `<div class="md-items" id="md-items-${gi}">${g.items.map(it => `<button class="md-item lvl${it[2] || 1}" data-p="${it[1]}"><span>${esc(it[0])}</span><em>${it[1]}</em></button>`).join('')}</div>` : ''}
      </div>`).join('');
    root.innerHTML = `
      <aside class="md-side">
        <div class="md-search">
          <input type="search" placeholder="Cari di modul… (mis. jangka, skala)" aria-label="Cari di modul">
          <div class="md-results hidden"></div>
        </div>
        <div class="md-prog"><div class="mt-bar"><i></i></div><span></span></div>
        <nav class="md-toc">${tocHtml}</nav>
        <p class="md-src">Sumber: ${esc(d.src)}</p>
      </aside>
      <section class="md-main">
        <div class="md-bar">
          <button class="bb-btn wide" data-nav-p="-1" title="Halaman sebelumnya (←)">◀ <span class="hide-sm">Sebelumnya</span></button>
          <label class="md-pageno">Hal <input type="number" min="${d.first}" max="${d.last}"> <span>/ ${d.first}–${d.last}</span></label>
          <button class="bb-btn wide" data-nav-p="1" title="Halaman berikutnya (→)"><span class="hide-sm">Berikutnya</span> ▶</button>
          <span class="md-sec"></span>
          <span class="md-zoom">
            <button class="bb-btn" data-z="-1" title="Perkecil">−</button>
            <button class="bb-btn wide" data-z="0" title="Pas lebar">Pas</button>
            <button class="bb-btn" data-z="1" title="Perbesar">+</button>
          </span>
        </div>
        <div class="md-practice hidden"></div>
        <div class="md-stage"><img class="md-page" alt="Halaman modul"></div>
        <div class="md-bottom">
          <button class="btn btn-ghost btn-sm" data-nav-p="-1">◀ Sebelumnya</button>
          <span class="md-count"></span>
          <button class="btn btn-sm" data-nav-p="1">Berikutnya ▶</button>
        </div>
      </section>`;

    root.querySelectorAll('[data-p]').forEach(b => b.addEventListener('click', e => {
      if (b.dataset.toggle != null && e.target.closest('.md-caret')) { toggleGroup(b.dataset.toggle); return; }
      go(+b.dataset.p);
      if (b.dataset.toggle != null) openGroup(b.dataset.toggle);
    }));
    root.querySelectorAll('[data-nav-p]').forEach(b => b.addEventListener('click', () => go(page + (+b.dataset.navP), true)));
    const inp = root.querySelector('.md-pageno input');
    inp.addEventListener('change', () => go(parseInt(inp.value, 10) || page));
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { go(parseInt(inp.value, 10) || page); inp.blur(); } });
    root.querySelectorAll('[data-z]').forEach(b => b.addEventListener('click', () => {
      const z = +b.dataset.z;
      zoom = z === 0 ? 1 : Math.max(0.6, Math.min(2.5, zoom + z * 0.25));
      applyZoom();
    }));
    const sIn = root.querySelector('.md-search input');
    sIn.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(() => search(sIn.value), 180); });
    sIn.addEventListener('keydown', e => { if (e.key === 'Escape') { sIn.value = ''; search(''); } });

    // geser (swipe) di layar sentuh
    const stage = root.querySelector('.md-stage');
    let sw = null;
    stage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') sw = { x: e.clientX, y: e.clientY }; });
    stage.addEventListener('pointerup', e => {
      if (!sw || zoom > 1.01) { sw = null; return; }
      const dx = e.clientX - sw.x, dy = e.clientY - sw.y; sw = null;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) go(page + (dx < 0 ? 1 : -1), true);
    });
    document.addEventListener('keydown', onKey);
    built = true;
  }

  function toggleGroup(gi) { const el = document.getElementById('md-items-' + gi); if (el) el.parentElement.classList.toggle('closed'); }
  function openGroup(gi) { const el = document.getElementById('md-items-' + gi); if (el) el.parentElement.classList.remove('closed'); }

  /* ======================= tampilkan halaman ======================= */
  function render() {
    if (!built) build();
    if (page == null) {
      const saved = parseInt(localStorage.getItem(KEY_PAGE) || '', 10);
      page = saved >= D().first && saved <= D().last ? saved : D().first;
    }
    show();
  }
  function go(p, keepScroll) {
    const d = D();
    p = Math.max(d.first, Math.min(d.last, p | 0));
    if (p === page && built) { show(); return; }
    page = p;
    show();
    const st = document.querySelector('.md-stage');
    if (st) st.scrollTop = 0;
    if (!keepScroll || window.innerWidth <= 860) {
      const v = document.getElementById('view-materi');
      const main = document.querySelector('.md-main');
      if (v && main && window.innerWidth <= 860) v.scrollTo({ top: main.offsetTop - 8, behavior: 'smooth' });
    }
  }
  function show() {
    const d = D(), root = document.getElementById('modul-root');
    if (!root) return;
    save(page);
    const img = root.querySelector('.md-page');
    img.classList.add('loading');
    img.onload = () => img.classList.remove('loading');
    img.src = src(page);
    img.alt = 'Modul Gambar Teknik halaman ' + page;
    [page - 1, page + 1].forEach(p => { if (p >= d.first && p <= d.last) { const i = new Image(); i.src = src(p); } });
    root.querySelector('.md-pageno input').value = page;
    root.querySelectorAll('[data-nav-p="-1"]').forEach(b => b.disabled = page <= d.first);
    root.querySelectorAll('[data-nav-p="1"]').forEach(b => b.disabled = page >= d.last);
    const sec = sectionOf(page);
    root.querySelector('.md-sec').textContent = sec ? sec.t : '';
    root.querySelector('.md-count').textContent = `Halaman ${page} · ${page - d.first + 1} dari ${d.last - d.first + 1}`;
    // sorot daftar isi
    let act = null;
    root.querySelectorAll('.md-item, .md-g-head').forEach(b => { b.classList.remove('active'); if (+b.dataset.p <= page) act = b; });
    if (act) {
      act.classList.add('active');
      const grp = act.closest('.md-group'); if (grp) grp.classList.remove('closed');
      const toc = root.querySelector('.md-toc');
      if (toc && toc.scrollHeight > toc.clientHeight) {
        const r = act.getBoundingClientRect(), tr = toc.getBoundingClientRect();
        if (r.top < tr.top || r.bottom > tr.bottom) toc.scrollTop += r.top - tr.top - tr.height / 3;
      }
    }
    // progres
    const s = seen(), total = d.last - d.first + 1;
    const pct = Math.round(s.size / total * 100);
    root.querySelector('.md-prog i').style.width = pct + '%';
    root.querySelector('.md-prog span').textContent = `Sudah dibuka ${s.size} dari ${total} halaman · ${pct}%`;
    // tautan praktik
    const pr = (d.practice || []).find(x => page >= x.from && page <= x.to);
    const box = root.querySelector('.md-practice');
    if (pr) {
      box.innerHTML = `<span>✏️ Materi di halaman ini bisa dipraktikkan.</span><button class="btn btn-green btn-sm">${esc(pr.label)} →</button>`;
      box.classList.remove('hidden');
      box.querySelector('button').onclick = () => practice(pr);
    } else box.classList.add('hidden');
    applyZoom();
  }
  function applyZoom() {
    const img = document.querySelector('.md-page');
    if (img) img.style.width = (zoom * 100) + '%';
    const st = document.querySelector('.md-stage');
    if (st) st.classList.toggle('zoomed', zoom > 1.01);
  }
  function practice(pr) {
    DTS_APP.go('simulasi');
    setTimeout(() => {
      if (pr.tool) DTS_APP.setTool(pr.tool);
      if (pr.inst) DTS_APP.placeInstrument(pr.inst);
      if (pr.task) { DTS_APP.switchTab('latihan'); DTS_APP.startTask(pr.task); }
      if (pr.tab) DTS_APP.switchTab(pr.tab);
    }, 80);
  }

  /* ======================= pencarian ======================= */
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function search(q) {
    const box = document.querySelector('.md-results');
    q = q.trim();
    if (q.length < 2) { box.classList.add('hidden'); box.innerHTML = ''; return; }
    const nq = norm(q), res = [];
    const T = D().text;
    for (const k of Object.keys(T)) {
      const t = T[k], nt = norm(t);
      let i = nt.indexOf(nq), n = 0, first = i;
      while (i >= 0) { n++; i = nt.indexOf(nq, i + nq.length); }
      if (n) res.push({ p: +k, n, first, t });
    }
    res.sort((a, b) => a.p - b.p);
    if (!res.length) { box.innerHTML = `<p class="md-none">Tidak ditemukan “${esc(q)}”.</p>`; box.classList.remove('hidden'); return; }
    const total = res.reduce((s, r) => s + r.n, 0);
    box.innerHTML = `<p class="md-rcount">${total} hasil di ${res.length} halaman</p>` + res.slice(0, 40).map(r => {
      const a = Math.max(0, r.first - 40), b = Math.min(r.t.length, r.first + q.length + 60);
      const snip = (a > 0 ? '…' : '') + esc(r.t.slice(a, r.first)) + '<mark>' + esc(r.t.slice(r.first, r.first + q.length)) + '</mark>' + esc(r.t.slice(r.first + q.length, b)) + (b < r.t.length ? '…' : '');
      return `<button class="md-res" data-rp="${r.p}"><b>Hal ${r.p}</b><span>${snip}</span></button>`;
    }).join('');
    box.classList.remove('hidden');
    box.querySelectorAll('[data-rp]').forEach(b => b.addEventListener('click', () => {
      go(+b.dataset.rp);
      box.querySelectorAll('.md-res').forEach(x => x.classList.toggle('active', x === b));
    }));
  }

  function onKey(e) {
    const v = document.getElementById('view-materi');
    if (!v || v.classList.contains('hidden')) return;
    const root = document.getElementById('modul-root');
    if (!root || root.classList.contains('hidden')) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { go(page + 1, true); e.preventDefault(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { go(page - 1, true); e.preventDefault(); }
  }

  return { render, go, current: () => page };
})();
