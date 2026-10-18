/* ============================================================================
   MATERI - halaman modul materi: daftar modul, isi, ilustrasi SVG,
   tanda "sudah dibaca", dan tombol praktik ke Simulasi
   ============================================================================ */
'use strict';
window.DTS_MATERI = (function () {
  const KEY = 'dts_materi_read_v1';
  const M = () => window.DTS_MATERI_DATA || [];
  let cur = 0;

  function readSet() { try { return new Set(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch (e) { return new Set(); } }
  function markRead(id) { const s = readSet(); s.add(id); try { localStorage.setItem(KEY, JSON.stringify([...s])); } catch (e) { /* abaikan */ } }

  /* ======================= render halaman ======================= */
  function render(index) {
    const list = M();
    if (!list.length) return;
    if (index != null) cur = Math.max(0, Math.min(list.length - 1, index));
    const m = list[cur];
    markRead(m.id);
    const read = readSet();
    const pct = Math.round(read.size / list.length * 100);

    const nav = list.map((x, i) => `
      <button class="mt-item ${i === cur ? 'active' : ''}" data-i="${i}">
        <span class="mt-no ${read.has(x.id) ? 'done' : ''}">${read.has(x.id) ? '✓' : i + 1}</span>
        <span>${x.title}</span>
      </button>`).join('');

    const body = m.body.map(sect => {
      let h = '';
      if (sect.h) h += `<h3>${sect.h}</h3>`;
      if (sect.p) h += `<p>${sect.p}</p>`;
      if (sect.ul) h += `<ul>${sect.ul.map(x => `<li>${x}</li>`).join('')}</ul>`;
      if (sect.ol) h += `<ol>${sect.ol.map(x => `<li>${x}</li>`).join('')}</ol>`;
      if (sect.table) h += `<div class="mt-table"><table><thead><tr>${sect.table.head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${sect.table.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      return h;
    }).join('');

    const prev = cur > 0 ? `<button class="btn btn-ghost" data-go="${cur - 1}">← ${list[cur - 1].title}</button>` : '<span></span>';
    const next = cur < list.length - 1 ? `<button class="btn" data-go="${cur + 1}">${list[cur + 1].title} →</button>` : '<span></span>';

    document.getElementById('materi-root').innerHTML = `
      <aside class="mt-side">
        <div class="mt-prog">
          <b>Progres membaca</b>
          <div class="mt-bar"><i style="width:${pct}%"></i></div>
          <span>${read.size} dari ${list.length} modul · ${pct}%</span>
        </div>
        <select class="mt-select" aria-label="Pilih modul">${list.map((x, i) => `<option value="${i}" ${i === cur ? 'selected' : ''}>Modul ${i + 1} · ${x.title}</option>`).join('')}</select>
        <nav class="mt-list">${nav}</nav>
      </aside>
      <article class="mt-content">
        <div class="mt-head">
          <span class="mt-badge">Modul ${cur + 1} dari ${list.length}</span>
          <h2><span class="mt-ico">${m.icon}</span>${m.title}</h2>
        </div>
        ${m.ill ? `<figure class="mt-ill">${illustration(m.ill)}</figure>` : ''}
        <div class="mt-body">${body}</div>
        <div class="mt-practice">
          <div><b>Siap praktik?</b><span>Terapkan materi ini langsung di meja gambar Simulasi.</span></div>
          <button class="btn btn-green" data-practice>${m.practice ? m.practice.label : 'Buka Simulasi'} →</button>
        </div>
        <div class="mt-pager">${prev}${next}</div>
      </article>`;

    const root = document.getElementById('materi-root');
    root.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => go(+b.dataset.i)));
    root.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
    root.querySelector('.mt-select').addEventListener('change', e => go(+e.target.value));
    root.querySelector('[data-practice]').addEventListener('click', () => practice(m.practice || {}));
  }
  function go(i) {
    render(i);
    const v = document.getElementById('view-materi');
    if (v) v.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function practice(p) {
    DTS_APP.go('simulasi');
    setTimeout(() => {
      if (p.tool) DTS_APP.setTool(p.tool);
      if (p.inst) DTS_APP.placeInstrument(p.inst);
      if (p.task) { DTS_APP.switchTab('latihan'); DTS_APP.startTask(p.task); }
      if (p.tab) DTS_APP.switchTab(p.tab);
    }, 80);
  }

  /* ======================= ilustrasi SVG ======================= */
  const W = 560;
  const svg = (h, inner) => `<svg viewBox="0 0 ${W} ${h}" role="img" xmlns="http://www.w3.org/2000/svg" font-family="Segoe UI, Arial, sans-serif">${inner}</svg>`;
  const txt = (x, y, t, o) => `<text x="${x}" y="${y}" font-size="${(o && o.s) || 12}" fill="${(o && o.c) || '#475569'}" ${o && o.a ? `text-anchor="${o.a}"` : ''} ${o && o.w ? `font-weight="${o.w}"` : ''}>${t}</text>`;
  const ln = (x1, y1, x2, y2, o) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${(o && o.c) || '#111827'}" stroke-width="${(o && o.w) || 2}" ${o && o.d ? `stroke-dasharray="${o.d}"` : ''} stroke-linecap="${(o && o.cap) || 'round'}"/>`;
  const arrow = (x, y, dir, c) => {
    const s = dir === 'l' ? `${x},${y} ${x + 9},${y - 3.5} ${x + 9},${y + 3.5}` : dir === 'r' ? `${x},${y} ${x - 9},${y - 3.5} ${x - 9},${y + 3.5}` : dir === 'u' ? `${x},${y} ${x - 3.5},${y + 9} ${x + 3.5},${y + 9}` : `${x},${y} ${x - 3.5},${y - 9} ${x + 3.5},${y - 9}`;
    return `<polygon points="${s}" fill="${c || '#1d4ed8'}"/>`;
  };

  function illustration(key) {
    switch (key) {
      case 'compare': return svg(190, `
        ${txt(130, 22, 'Gambar seni — bebas, ekspresif', { a: 'middle', w: 700, c: '#be185d' })}
        <path d="M60 150 C 70 110, 80 95, 130 70 C 170 92, 190 110, 200 150 Z" fill="#fce7f3" stroke="#be185d" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M100 150 C 104 130, 120 124, 128 150" fill="none" stroke="#be185d" stroke-width="2"/>
        <circle cx="210" cy="60" r="16" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
        <path d="M30 160 C 90 150, 160 168, 240 156" fill="none" stroke="#16a34a" stroke-width="2.5"/>
        ${ln(280, 20, 280, 175, { c: '#cbd5e1', w: 1.5 })}
        ${txt(425, 22, 'Gambar teknik — baku & terukur', { a: 'middle', w: 700, c: '#1d4ed8' })}
        <rect x="350" y="60" width="140" height="80" fill="none" stroke="#111827" stroke-width="3"/>
        <circle cx="420" cy="100" r="18" fill="none" stroke="#111827" stroke-width="3"/>
        ${ln(392, 100, 448, 100, { w: 1, d: '12 3 2 3' })}${ln(420, 72, 420, 128, { w: 1, d: '12 3 2 3' })}
        ${ln(350, 160, 490, 160, { c: '#1d4ed8', w: 1.2 })}${arrow(350, 160, 'l')}${arrow(490, 160, 'r')}
        ${ln(350, 144, 350, 166, { c: '#1d4ed8', w: 1 })}${ln(490, 144, 490, 166, { c: '#1d4ed8', w: 1 })}
        ${txt(420, 155, '140', { a: 'middle', c: '#1d4ed8', s: 12, w: 600 })}
        ${ln(510, 60, 510, 140, { c: '#1d4ed8', w: 1.2 })}${arrow(510, 60, 'u')}${arrow(510, 140, 'd')}
        ${txt(522, 104, '80', { c: '#1d4ed8', s: 12, w: 600 })}
        ${txt(438, 84, 'Ø36', { c: '#1d4ed8', s: 11, w: 600 })}`);

      case 'paper': {
        // ukuran kertas seri A (skala 1:6)
        const sizes = [['A0', 1189, 841], ['A1', 841, 594], ['A2', 594, 420], ['A3', 420, 297], ['A4', 297, 210]];
        const k = 0.17, x0 = 20, y0 = 20;
        const cols = ['#e2e8f0', '#cbd5e1', '#bfdbfe', '#2563eb', '#93c5fd'];
        let out = '';
        sizes.forEach((s, i) => {
          const w = s[1] * k, h = s[2] * k;
          out += `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="${i === 3 ? 'rgba(37,99,235,.18)' : 'rgba(255,255,255,.6)'}" stroke="${i === 3 ? '#1d4ed8' : '#64748b'}" stroke-width="${i === 3 ? 2.5 : 1.2}"/>`;
          out += txt(x0 + w - 6, y0 + h - 7, s[0], { a: 'end', w: 800, c: i === 3 ? '#1d4ed8' : '#475569', s: i === 3 ? 13 : 12 });
        });
        out += txt(250, 40, 'Seri kertas ISO 216', { w: 700, c: '#0f172a', s: 13 });
        out += txt(250, 62, 'Setiap ukuran = setengah ukuran sebelumnya.');
        out += txt(250, 84, 'A3 = 420 × 297 mm (landscape) dipakai', { c: '#1d4ed8', w: 600 });
        out += txt(250, 102, 'di simulator.', { c: '#1d4ed8', w: 600 });
        out += `<rect x="252" y="118" width="126" height="89" fill="#fffefa" stroke="#64748b"/><rect x="258" y="121" width="117" height="83" fill="none" stroke="#111827" stroke-width="1.6"/><rect x="321" y="194" width="54" height="10" fill="none" stroke="#111827" stroke-width="1"/>`;
        out += txt(390, 140, '← garis tepi kiri 20 mm');
        out += txt(390, 160, '   tepi lain 10 mm');
        out += txt(390, 200, '← kepala gambar');
        return svg(230, out);
      }

      case 'tools': {
        const items = [['ic-ruler', 'Mistar'], ['ic-tri45', 'Segitiga 45°'], ['ic-tri30', 'Segitiga 30/60°'], ['ic-protractor', 'Busur derajat'], ['ic-compass', 'Jangka'], ['ic-pencil', 'Pensil'], ['ic-eraser', 'Penghapus']];
        const step = W / items.length;
        return svg(130, items.map((it, i) => `<use href="#${it[0]}" x="${i * step + step / 2 - 32}" y="10" width="64" height="64"/>${txt(i * step + step / 2, 104, it[1], { a: 'middle', s: 12, w: 600, c: '#334155' })}`).join(''));
      }

      case 'lineTypes': {
        const rows = [
          ['Kontinu tebal — garis gambar', {}, 3],
          ['Kontinu tipis — garis ukur/bantu', {}, 1.2],
          ['Gores — garis tersembunyi', { d: '10 5' }, 2],
          ['Strip-titik — garis sumbu', { d: '22 4 3 4', c: '#1d4ed8' }, 1.2],
          ['Strip-titik ganda — benda bergerak', { d: '22 4 3 4 3 4', c: '#16a34a' }, 1.2],
          ['Bebas — garis potong putus', null, 1.2]
        ];
        let out = '';
        rows.forEach((r, i) => {
          const y = 24 + i * 28;
          out += txt(8, y + 4, r[0]);
          if (r[1]) out += ln(270, y, 545, y, Object.assign({ w: r[2], cap: 'butt' }, r[1]));
          else out += `<path d="M270 ${y} q 15 -9 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 35 0" fill="none" stroke="#111827" stroke-width="1.2"/>`;
        });
        return svg(180, out);
      }

      case 'lineWidths': {
        const rows = [['2H · tipis ±0,25 mm', 1.2, '#64748b'], ['HB · sedang ±0,5 mm', 2.6, '#334155'], ['2B · tebal ±0,7 mm', 4.4, '#0f172a']];
        let out = '';
        rows.forEach((r, i) => {
          const y = 34 + i * 42;
          out += `<use href="#ic-pencil" x="6" y="${y - 20}" width="36" height="36"/>`;
          out += txt(48, y + 5, r[0], { w: 600, c: '#334155' });
          out += ln(240, y, 545, y, { w: r[1], c: r[2] });
        });
        return svg(150, out);
      }

      case 'angles': return svg(205, `
        <g transform="translate(20 20)">
          <path d="M0 150 L150 150 L0 0 Z" fill="rgba(56,189,248,.35)" stroke="#0369a1" stroke-width="2" stroke-linejoin="round"/>
          <path d="M120 150 A30 30 0 0 0 128.8 128.8" fill="none" stroke="#dc2626" stroke-width="2"/>
          ${txt(98, 142, '45°', { c: '#dc2626', w: 700 })}
          <path d="M0 22 A22 22 0 0 0 15.6 15.6" fill="none" stroke="#dc2626" stroke-width="2"/>
          ${txt(6, 44, '45°', { c: '#dc2626', w: 700 })}
          <rect x="0" y="136" width="14" height="14" fill="none" stroke="#dc2626" stroke-width="1.6"/>
          ${txt(75, 172, 'Segitiga 45°–45°–90°', { a: 'middle', w: 700, c: '#0369a1' })}
        </g>
        <g transform="translate(230 20)">
          <path d="M0 150 L190 150 L0 40.3 Z" fill="rgba(251,146,60,.35)" stroke="#c2410c" stroke-width="2" stroke-linejoin="round"/>
          <path d="M155 150 A35 35 0 0 0 160.3 132.5" fill="none" stroke="#dc2626" stroke-width="2"/>
          ${txt(130, 142, '30°', { c: '#dc2626', w: 700 })}
          <path d="M0 64.3 A24 24 0 0 0 20.8 52.3" fill="none" stroke="#dc2626" stroke-width="2"/>
          ${txt(6, 86, '60°', { c: '#dc2626', w: 700 })}
          <rect x="0" y="136" width="14" height="14" fill="none" stroke="#dc2626" stroke-width="1.6"/>
          ${txt(95, 172, 'Segitiga 30°–60°–90°', { a: 'middle', w: 700, c: '#c2410c' })}
        </g>
        <g transform="translate(460 30)">
          ${txt(40, 0, 'Arah sudut', { a: 'middle', w: 700, c: '#0f172a' })}
          ${ln(0, 120, 90, 120, { w: 2 })}${ln(10, 120, 10, 30, { w: 1, c: '#94a3b8', d: '4 3' })}
          ${ln(10, 120, 70, 60, { w: 2, c: '#1d4ed8' })}
          <path d="M40 120 A30 30 0 0 0 31.2 98.8" fill="none" stroke="#1d4ed8" stroke-width="1.6"/>
          ${txt(45, 145, '0° ke kanan,', { s: 11, a: 'middle' })}${txt(45, 160, 'berlawanan', { s: 11, a: 'middle' })}${txt(45, 175, 'jarum jam', { s: 11, a: 'middle' })}
        </g>`);

      case 'scale': return svg(170, `
        ${txt(10, 22, 'Skala 1 : 2 → ukuran gambar setengah ukuran benda', { w: 700, c: '#0f172a' })}
        <rect x="30" y="60" width="100" height="50" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2.5"/>
        ${txt(80, 135, 'Gambar: 50 mm', { a: 'middle', c: '#1d4ed8', w: 600 })}
        ${txt(80, 152, '(1 : 2)', { a: 'middle', c: '#1d4ed8' })}
        ${ln(160, 85, 230, 85, { c: '#94a3b8', w: 2, d: '6 4' })}${arrow(240, 85, 'r', '#94a3b8')}
        <rect x="260" y="40" width="200" height="100" fill="#dcfce7" stroke="#16a34a" stroke-width="2.5"/>
        ${txt(360, 160, 'Benda nyata: 100 mm', { a: 'middle', c: '#16a34a', w: 600 })}
        ${txt(475, 70, 'Angka ukuran', { s: 11 })}${txt(475, 86, 'tetap ditulis', { s: 11 })}${txt(475, 102, 'ukuran nyata!', { s: 11, w: 700, c: '#b91c1c' })}`);

      case 'dimension': return svg(200, `
        <rect x="120" y="70" width="240" height="90" fill="none" stroke="#111827" stroke-width="3"/>
        ${ln(120, 64, 120, 28, { w: 1 })}${ln(360, 64, 360, 28, { w: 1 })}
        ${ln(120, 38, 360, 38, { c: '#1d4ed8', w: 1.2 })}${arrow(120, 38, 'l')}${arrow(360, 38, 'r')}
        ${txt(240, 32, '120', { a: 'middle', c: '#1d4ed8', w: 700, s: 13 })}
        ${ln(366, 70, 412, 70, { w: 1 })}${ln(366, 160, 412, 160, { w: 1 })}
        ${ln(402, 70, 402, 160, { c: '#1d4ed8', w: 1.2 })}${arrow(402, 70, 'u')}${arrow(402, 160, 'd')}
        <text x="0" y="0" font-size="13" font-weight="700" fill="#1d4ed8" transform="translate(396 122) rotate(-90)" text-anchor="middle">45</text>
        ${txt(430, 30, 'garis bantu', { s: 11 })}${ln(428, 34, 364, 50, { w: .8, c: '#94a3b8' })}
        ${txt(430, 112, 'garis ukur', { s: 11 })}${txt(430, 127, '+ anak panah', { s: 11 })}
        ${txt(10, 112, 'angka di atas', { s: 11 })}${txt(10, 127, 'garis ukur,', { s: 11 })}${txt(10, 142, 'satuan mm', { s: 11 })}
        ${txt(10, 157, 'tidak ditulis', { s: 11 })}`);

      case 'geo': {
        const cx = 140, cy = 100, r = 70;
        let hex = '', ticks = '';
        for (let i = 0; i < 6; i++) {
          const a = i * Math.PI / 3;
          hex += `${(cx + r * Math.cos(a)).toFixed(1)},${(cy - r * Math.sin(a)).toFixed(1)} `;
          const px = cx + r * Math.cos(a), py = cy - r * Math.sin(a);
          ticks += `<path d="M${(px + 14 * Math.cos(a + 2.3)).toFixed(1)} ${(py - 14 * Math.sin(a + 2.3)).toFixed(1)} A70 70 0 0 0 ${(px + 14 * Math.cos(a - 2.3)).toFixed(1)} ${(py - 14 * Math.sin(a - 2.3)).toFixed(1)}" fill="none" stroke="#16a34a" stroke-width="1.4"/>`;
        }
        return svg(200, `
          <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#94a3b8" stroke-width="1.2"/>
          ${ln(cx - r - 10, cy, cx + r + 10, cy, { w: 1, d: '12 3 2 3', c: '#1d4ed8' })}${ln(cx, cy - r - 10, cx, cy + r + 10, { w: 1, d: '12 3 2 3', c: '#1d4ed8' })}
          ${ticks}
          <polygon points="${hex}" fill="none" stroke="#111827" stroke-width="3" stroke-linejoin="round"/>
          ${txt(250, 40, 'Segi enam beraturan dalam lingkaran', { w: 700, c: '#0f172a', s: 13 })}
          ${txt(250, 66, '1. Buat lingkaran R (garis tipis) + garis sumbu.')}
          ${txt(250, 88, '2. Dengan bukaan jangka = R, tandai 6 titik', { c: '#16a34a' })}
          ${txt(250, 106, '    pada keliling (busur hijau).', { c: '#16a34a' })}
          ${txt(250, 128, '3. Hubungkan titik-titik dengan garis tebal.')}
          ${txt(250, 150, '4. Panjang sisi = R. Hapus garis bantu bila perlu.')}`);
      }
    }
    return '';
  }

  return { render, go };
})();
