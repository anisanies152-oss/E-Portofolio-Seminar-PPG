// ============================================================
// E-PORTOFOLIO PPG - MAIN APP (Page-Based Navigation)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {

  // ===================== PAGE NAVIGATION =====================
  const pageContainer = document.getElementById('page-container');
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-link, [data-page]');
  const navbarToggle = document.getElementById('navbarToggle');
  const navbarMenu = document.getElementById('navbarMenu');

  // Animasi transisi antar halaman
  function navigateTo(pageName) {
    // Tutup menu mobile jika terbuka
    navbarToggle.classList.remove('open');
    navbarMenu.classList.remove('open');

    const targetPage = document.getElementById('page-' + pageName);
    if (!targetPage) return;

    // Fade out halaman aktif
    pages.forEach(p => p.classList.remove('active'));

    // Fade in halaman target
    targetPage.classList.add('active');

    // Update active nav link
    navLinks.forEach(link => {
      if (link.dataset.page) {
        link.classList.toggle('active', link.dataset.page === pageName);
      }
    });

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger fade-in animation untuk elemen halaman target
    setTimeout(() => {
      triggerPageAnimations(targetPage);
    }, 100);

    // Update URL hash
    history.replaceState(null, '', '#' + pageName);
  }

  // Trigger fade-in animations within a page
  function triggerPageAnimations(page) {
    const fades = page.querySelectorAll('.fade-in:not(.visible)');
    fades.forEach(el => fadeObserver.observe(el));

    // Animate progress fills
    animateProgress(page);
  }

  // Navigation click handlers
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = link.dataset.page;
      if (target) {
        e.preventDefault();
        navigateTo(target);
      }
    });
  });

  // Hamburger menu
  navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('open');
    navbarMenu.classList.toggle('open');
  });

  // Initial page from hash
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById('page-' + initialHash)) {
    navigateTo(initialHash);
  }

  // ===================== BACK TO TOP =====================
  const backTopBtn = document.getElementById('backTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backTopBtn.classList.add('show');
    } else {
      backTopBtn.classList.remove('show');
    }
  });

  backTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===================== FADE-IN OBSERVER =====================
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // ===================== PROGRESS ANIMATION =====================
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('[data-value]');
        if (fill) {
          setTimeout(() => {
            fill.style.width = fill.dataset.value + '%';
          }, 200);
        }
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  function animateProgress(page) {
    page.querySelectorAll('.progress-item, .competency-item, .progress-track').forEach(el => {
      progressObserver.observe(el);
    });
  }

  // ===================== RENDER HELPERS =====================
  function renderInitials(name) {
    if (!name) return '?';
    return name.split(' ')
      .filter(w => w.length > 0)
      .slice(0, 2)
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d)) return dateStr;
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  // ===================== PROFIL =====================
  function renderProfile() {
    const p = PORTFOLIO_DATA.profile;

    // Hero
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    set('heroName', p.nama);
    set('heroField', p.bidangStudi);
    set('heroUniv', p.universitas);
    set('heroTahun', 'PPG ' + p.tahunPPG);

    const heroQuote = document.getElementById('heroQuote');
    if (heroQuote && p.quote) heroQuote.textContent = p.quote;

    const heroAvatar = document.getElementById('heroAvatar');
    if (heroAvatar) {
      heroAvatar.innerHTML = p.foto
        ? '<img src="' + p.foto + '" alt="' + p.nama + '">'
        : renderInitials(p.nama);
    }

    // Profile detail
    set('pfNama', p.nama);
    set('pfNamaDiri', p.nama);
    set('pfNIM', p.nim);
    set('pfLPTK', p.universitas);
    set('pfBidang', p.bidangStudi);
    set('pfProdi', p.programStudi);
    set('pfUniv', p.universitas);
    set('pfTahun', p.tahunPPG);
    set('pfAsal', p.asalInstitusi);
    set('pfEmail', p.email);
    set('pfDeskripsi', p.deskripsi);
    set('footerName', p.nama);
    set('footerUniv', p.universitas);

    // Riwayat Pendidikan
    const eduContainer = document.getElementById('riwayatPendidikan');
    if (eduContainer && p.riwayatPendidikan && p.riwayatPendidikan.length) {
      const eduIcons = { SD: '🏫', SMP: '🏫', SMK: '🔧', D3: '🎓', S1: '🎓', S2: '🎓', S3: '🎓' };
      const eduPlaceholderText = { SD: 'SD', SMP: 'SMP', SMK: 'SMK', D3: 'D3', S1: 'S1', S2: 'S2', S3: 'S3' };
      eduContainer.innerHTML = p.riwayatPendidikan.map((r, i) => `
        <div class="education-card fade-in">
          <div class="education-logo">
            ${
              r.logo
                ? `<img src="${r.logo}" alt="Logo ${r.jenjang}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">`
                : ''
            }
            <span class="education-placeholder" ${r.logo ? 'style="display:none;"' : ''}>
              <em class="education-placeholder-text">${eduPlaceholderText[r.jenjang] || r.jenjang}</em>
              <small class="education-placeholder-note">Logo</small>
            </span>
          </div>
          <div class="education-body">
            <span class="education-level">${r.jenjang}</span>
            <h3 class="education-name">${r.nama}</h3>
            <span class="education-year">${r.tahun}</span>
          </div>
        </div>
      `).join('');
    }

    // Pengalaman Organisasi
    const orgContainer = document.getElementById('orgList');
    if (orgContainer && p.pengalamanOrganisasi && p.pengalamanOrganisasi.length) {
      orgContainer.innerHTML = `
        <div class="org-table-wrap fade-in">
          <table class="org-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Organisasi</th>
                <th>Jabatan</th>
                <th>Tahun</th>
              </tr>
            </thead>
            <tbody>
              ${p.pengalamanOrganisasi.map((o, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${o.organisasi}</td>
                  <td>${o.jabatan}</td>
                  <td>${o.tahun}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    const pfAvatar = document.getElementById('pfAvatar');
    if (pfAvatar) {
      pfAvatar.innerHTML = p.foto
        ? '<img src="' + p.foto + '" alt="' + p.nama + '">'
        : renderInitials(p.nama);
    }

    set('visiPendidikan', p.visiPendidikan);
    set('visiGuru', p.visiCalonGuru);

    const misiList = document.getElementById('misiList');
    if (misiList && p.misi) {
      misiList.innerHTML = p.misi.map((m, i) => `
        <div class="misi-card fade-in">
          <div class="misi-number">${i + 1}</div>
          <p>${m}</p>
        </div>
      `).join('');
    }
  }

  // ===================== PROGRESS DASHBOARD (BERANDA) =====================
  function renderProgress() {
    const container = document.getElementById('progressList');
    if (!container) return;

    const icons = {
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      reflect: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>',
      bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
      folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
      camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>'
    };

    container.innerHTML = PORTFOLIO_DATA.progress.map((item, idx) => `
      <div class="progress-item fade-in">
        <div class="progress-header">
          <span class="progress-label">${icons[item.icon] || icons.book} ${item.label}</span>
          <span class="progress-value">${item.value}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" data-value="${item.value}"></div>
        </div>
      </div>
    `).join('');
  }

  // ===================== TIMELINE PPG (BERANDA) =====================
  function renderTimeline() {
    const container = document.getElementById('timelineContainer');
    if (!container) return;

    const icons = {
      flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
      book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
      school: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/></svg>',
      briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z"/></svg>',
      presentation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h20"/><rect x="3" y="7" width="18" height="10" rx="1"/><path d="M12 17v5"/><path d="M8 22l4-5 4 5"/></svg>',
      graduate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/><path d="M22 10v6"/></svg>'
    };

    container.innerHTML = TIMELINE_PPG.map((item, idx) => `
      <div class="timeline-item fade-in fade-in-delay-${idx % 3}">
        <div class="timeline-card">
          <h4><span class="icon">${icons[item.ikon] || icons.flag}</span> ${item.judul}</h4>
          <p>${item.deskripsi}</p>
        </div>
      </div>
    `).join('');
  }

  // ===================== REFLEKSI CARDS =====================
  function renderRefleksiCards(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const icons = {
      philosophy: '🏛️', user: '👤', layer: '📚', lightbulb: '💡', brain: '🧠',
      school: '🏫', heart: '💖', chart: '📊', leadership: '👑', rocket: '🚀', briefcase: '💼'
    };

    container.innerHTML = data.map((item, idx) => `
      <div class="card fade-in fade-in-delay-${idx % 3}">
        <div class="card-header">
          <div class="card-icon">${icons[item.icon] || '📘'}</div>
          <h3>${item.judul}</h3>
        </div>
        <div class="card-body">
          <p>${item.singkat}</p>
        </div>
        <div class="card-footer">
          <button class="btn btn-outline-dark btn-sm view-refleksi" data-id="${item.id}" data-semester="${item.kategori.includes('1') ? '1' : '2'}" style="width:100%;">
            Buka Refleksi
          </button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.view-refleksi').forEach(btn => {
      btn.addEventListener('click', function () {
        const id = this.dataset.id;
        const semester = this.dataset.semester;
        const dataArr = semester === '1' ? REFLEKSI_SEMESTER_1 : REFLEKSI_SEMESTER_2;
        const item = dataArr.find(r => r.id === id);
        if (item) openRefleksiModal(item, semester);
      });
    });
  }

  // ===================== REFLEKSI MODAL =====================
  function openRefleksiModal(item, semester) {
    const modal = document.getElementById('refleksiModal');
    const modalBody = document.getElementById('refleksiModalBody');

    const questions = item.pertanyaan.map((q, i) => `
      <div class="qa-card">
        <div class="qa-question"><span class="q-icon">${i + 1}</span> ${q.judul}</div>
        <div class="qa-answer">${q.jawaban}</div>
      </div>
    `).join('');

    modalBody.innerHTML = `
      <h2>${item.judul}</h2>
      <div class="meta">Semester ${semester} • ${item.kategori}</div>
      <p class="modal-intro" style="background:var(--bg-light);padding:16px;border-radius:var(--radius-sm);margin-bottom:20px;">${item.singkat}</p>
      <div class="qa-grid" style="max-width:none;">${questions}</div>
    `;

    openModal(modal);
  }

  function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ===================== KARYA =====================
  let karyaKategoriFilter = 'Semua';

  function renderKarya() {
    const container = document.getElementById('karyaGrid');
    if (!container) return;

    const filtered = KARYA_INOVASI.filter(k => k.kategori === 'Media Pembelajaran');

    container.innerHTML = filtered.map((k, idx) => `
      <div class="karya-card fade-in fade-in-delay-${idx % 3}">
        <div class="karya-thumb">
          ${k.thumbnail ? `<img src="${k.thumbnail}" alt="${k.judul}">` : '💡'}
          <span class="karya-category">${k.kategori}</span>
        </div>
        <div class="karya-body">
          <h3>${k.judul}</h3>
          <p>${k.deskripsi}</p>
          <button class="btn btn-primary btn-sm view-karya" data-id="${k.id}" style="justify-content:center;">Lihat Detail Karya</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.view-karya').forEach(btn => {
      btn.addEventListener('click', function () {
        const karya = KARYA_INOVASI.find(k => k.id === this.dataset.id);
        if (karya) openKaryaModal(karya);
      });
    });
  }

  function openKaryaModal(k) {
    const modal = document.getElementById('refleksiModal');
    const modalBody = document.getElementById('refleksiModalBody');

    const sections = k.ringkas ? [] : [
      { t: 'Latar Belakang', v: k.latarBelakang },
      { t: 'Masalah yang Diselesaikan', v: k.masalah },
      { t: 'Tujuan', v: k.tujuan },
      { t: 'Proses Pembuatan', v: k.proses },
      { t: 'Inovasi yang Ditawarkan', v: k.inovasi },
      { t: 'Dampak / Manfaat', v: k.dampak },
      { t: 'Hasil', v: k.hasil },
      { t: 'Refleksi', v: k.refleksi }
    ];

    const content = sections.map(s => `
      <div class="qa-card">
        <div class="qa-question"><span class="q-icon">✦</span> ${s.t}</div>
        <div class="qa-answer">${s.v}</div>
      </div>
    `).join('');

    modalBody.innerHTML = `
      <h2>${k.judul}</h2>
      <div class="meta">${k.kategori}</div>
      <p class="modal-intro" style="background:var(--bg-light);padding:16px;border-radius:var(--radius-sm);margin-bottom:20px;">${k.deskripsi}</p>
      ${content ? `<div class="qa-grid" style="max-width:none;">${content}</div>` : ''}
      <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;">
        <a href="${k.link}" class="btn btn-primary" style="text-decoration:none;" target="_blank">🔗 Lihat Link Karya</a>
        ${k.ringkas ? '' : `<button class="btn btn-outline-dark" onclick="event.stopPropagation();showToast('Karya siap diunduh')">⬇️ Unduh File Pendukung</button>`}
      </div>
    `;

    openModal(modal);
  }

  // ===================== ARTEFAK =====================
  let artefakSearch = '';
  let artefakSemester = 'Semua';
  let artefakKategori = 'Semua';
  let artefakMataKuliah = 'Semua';

  function getUniqueArtefakCategories() {
    return [...new Set(ARTEFAK.map(a => a.kategori))];
  }

  function getUniqueArtefakMataKuliah() {
    return [...new Set(ARTEFAK.map(a => a.mataKuliah))];
  }

  function populateArtefakFilters() {
    const catSelect = document.getElementById('artefakKategori');
    const mkSelect = document.getElementById('artefakMataKuliah');

    if (catSelect) {
      catSelect.innerHTML = '<option>Semua Kategori</option>' + getUniqueArtefakCategories()
        .map(c => '<option>' + c + '</option>').join('');
    }
    if (mkSelect) {
      mkSelect.innerHTML = '<option>Semua Mata Kuliah</option>' + getUniqueArtefakMataKuliah()
        .map(c => '<option>' + c + '</option>').join('');
    }
  }

  function renderArtefak() {
    const container = document.getElementById('artefakGrid');
    if (!container) return;

    let filtered = ARTEFAK;

    if (artefakSearch) {
      const s = artefakSearch.toLowerCase();
      filtered = filtered.filter(a =>
        a.nama.toLowerCase().includes(s) ||
        a.deskripsi.toLowerCase().includes(s) ||
        a.mataKuliah.toLowerCase().includes(s)
      );
    }
    if (artefakSemester !== 'Semua') {
      filtered = filtered.filter(a => String(a.semester) === artefakSemester);
    }
    if (artefakKategori !== 'Semua' && artefakKategori !== 'Semua Kategori') {
      filtered = filtered.filter(a => a.kategori === artefakKategori);
    }
    if (artefakMataKuliah !== 'Semua' && artefakMataKuliah !== 'Semua Mata Kuliah') {
      filtered = filtered.filter(a => a.mataKuliah === artefakMataKuliah);
    }

    if (filtered.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-mid);grid-column:1/-1;padding:40px;">Tidak ada artefak yang ditemukan.</p>';
      return;
    }

    container.innerHTML = filtered.map((a, idx) => `
      <div class="artefak-card fade-in fade-in-delay-${idx % 3}">
        <div class="artefak-thumb">
          ${a.thumbnail ? `<img src="${a.thumbnail}" alt="${a.nama}">` : '📄'}
        </div>
        <div class="artefak-body">
          <h3>${a.nama}</h3>
          <div class="artefak-meta">
            <div class="artefak-meta-item">📚 ${a.mataKuliah}</div>
            <div class="artefak-meta-item">📅 Semester ${a.semester} • ${formatDate(a.tanggal)}</div>
            <div class="artefak-meta-item">🏷️ ${a.kategori}</div>
          </div>
          <p>${a.deskripsi}</p>
          <div class="artefak-actions">
            <button class="btn-sm btn-view view-artefak" data-id="${a.id}">Lihat</button>
            <button class="btn-sm btn-download" onclick="showToast('File siap diunduh')">⬇️ Unduh</button>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.view-artefak').forEach(btn => {
      btn.addEventListener('click', function () {
        const art = ARTEFAK.find(a => a.id === this.dataset.id);
        if (art) openArtefakModal(art);
      });
    });
  }

  function openArtefakModal(a) {
    const modal = document.getElementById('refleksiModal');
    const modalBody = document.getElementById('refleksiModalBody');

    modalBody.innerHTML = `
      <h2>${a.nama}</h2>
      <div class="meta">${a.kategori} • Semester ${a.semester}</div>
      <div class="qa-card" style="margin-bottom:16px;">
        <div class="qa-question"><span class="q-icon">📋</span> Mata Kuliah</div>
        <div class="qa-answer">${a.mataKuliah}</div>
      </div>
      <div class="qa-card" style="margin-bottom:16px;">
        <div class="qa-question"><span class="q-icon">📅</span> Tanggal</div>
        <div class="qa-answer">${formatDate(a.tanggal)}</div>
      </div>
      <div class="qa-card">
        <div class="qa-question"><span class="q-icon">📝</span> Deskripsi</div>
        <div class="qa-answer">${a.deskripsi}</div>
      </div>
      <div style="margin-top:24px;display:flex;gap:12px;">
        <button class="btn btn-primary" style="flex:1;" onclick="event.stopPropagation();showToast('File siap diunduh')">⬇️ Unduh File</button>
      </div>
    `;

    openModal(modal);
  }

  // ===================== DOKUMENTASI =====================
  let docKategori = 'Semua';
  let docSemester = 'Semua';

  function getUniqueDocCategories() {
    return [...new Set(DOKUMENTASI.map(d => d.kategori))];
  }

  function populateDocFilters() {
    const catSelect = document.getElementById('docKategori');
    if (catSelect) {
      catSelect.innerHTML = '<option>Semua Kategori</option>' + getUniqueDocCategories()
        .map(c => '<option>' + c + '</option>').join('');
    }
  }

  function docEmoji(kategori) {
    const map = { 'Perkuliahan': '📚', 'PPL': '🏫', 'Kegiatan PPG': '🎓', 'Projek': '🗂️' };
    return map[kategori] || '📷';
  }

  function parseTanggalID(str) {
    const bulan = { Januari: 0, Februari: 1, Maret: 2, April: 3, Mei: 4, Juni: 5, Juli: 6, Agustus: 7, September: 8, Oktober: 9, November: 10, Desember: 11 };
    const m = String(str).trim().split(/\s+/);
    const t = parseInt(m[0], 10);
    const b = bulan[m[1]] !== undefined ? bulan[m[1]] : 0;
    const y = parseInt(m[2], 10) || 0;
    return new Date(y, b, t);
  }

  function renderDokumentasi() {
    const container = document.getElementById('dokumentasiGrid');
    if (!container) return;

    let filtered = DOKUMENTASI;

    if (docKategori !== 'Semua' && docKategori !== 'Semua Kategori') {
      filtered = filtered.filter(d => d.kategori === docKategori);
    }
    if (docSemester !== 'Semua') {
      filtered = filtered.filter(d => String(d.semester) === docSemester);
    }

    filtered = [...filtered].sort((a, b) => parseTanggalID(a.tanggal) - parseTanggalID(b.tanggal));

    container.innerHTML = filtered.map((d) => {
      return `
        <div class="masonry-item doc-item" data-id="${d.id}">
          <div class="masonry-img">
            ${d.foto ? `<img src="${d.foto}" alt="${d.judul}">` : docEmoji(d.kategori)}
          </div>
          <div class="masonry-caption">
            <h4>${d.judul}</h4>
            <div class="meta">📅 ${formatDate(d.tanggal)}</div>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.doc-item').forEach(el => {
      el.addEventListener('click', function () {
        const doc = DOKUMENTASI.find(d => d.id === this.dataset.id);
        if (doc) openLightbox(doc);
      });
    });
  }

  // ===================== LIGHTBOX =====================
  function openLightbox(doc) {
    const lightbox = document.getElementById('lightbox');
    const imgEl = document.getElementById('lightboxImg');
    const capTitle = document.getElementById('lightboxTitle');
    const capDesc = document.getElementById('lightboxDesc');

    if (doc.foto) {
      imgEl.style.display = '';
      imgEl.src = doc.foto;
    } else {
      imgEl.style.display = 'none';
    }

    capTitle.textContent = doc.judul;
    capDesc.textContent = doc.tanggal;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // ===================== KOMPETENSI =====================
  function renderKompetensi() {
    const container = document.getElementById('kompetensiGrid');
    if (!container) return;

    container.innerHTML = REFLEKSI_PERJALANAN.kompetensi.map((k, idx) => `
      <div class="competency-item fade-in fade-in-delay-${idx % 3}">
        <div class="competency-header">
          <span class="competency-name">${k.nama}</span>
          <span class="competency-num">${k.nilai}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" data-value="${k.nilai}" style="width:0%;"></div>
        </div>
      </div>
    `).join('');
  }

  // ===================== TANTANGAN =====================
  function renderTantangan() {
    const container = document.getElementById('tantanganGrid');
    if (!container) return;

    container.innerHTML = REFLEKSI_PERJALANAN.tantanganSolusi.map((t, idx) => `
      <div class="challenge-item fade-in fade-in-delay-${idx % 3}">
        <div class="challenge-box tantangan">
          <div class="challenge-label t">⚠️ Tantangan</div>
          <p>${t.tantangan}</p>
        </div>
        <div class="challenge-box solusi">
          <div class="challenge-label s">✅ Solusi</div>
          <p>${t.solusi}</p>
        </div>
      </div>
    `).join('');
  }

  // ===================== REFLEKSI PERJALANAN =====================
  function renderPerjalanan() {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    set('perjPengalaman', REFLEKSI_PERJALANAN.pengalamanBermakna);
    set('perjPerubahan', REFLEKSI_PERJALANAN.perubahanPemahaman);
    set('perjKomitmen', REFLEKSI_PERJALANAN.komitmen);

    const rencanaEl = document.getElementById('perjRencana');
    if (rencanaEl) {
      rencanaEl.innerHTML = '<p>' + REFLEKSI_PERJALANAN.rencanaPengembangan + '</p>' +
        '<ol class="rencana-list">' +
        REFLEKSI_PERJALANAN.rencanaTindakLanjut.map(item => '<li>' + item + '</li>').join('') +
        '</ol>';
    }
  }

  // ===================== EVENT HANDLERS =====================
  // Filter karya
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      karyaKategoriFilter = this.dataset.filter;
      renderKarya();
    });
  });

  // Filter artefak
  const artefakSearchInput = document.getElementById('artefakSearch');
  if (artefakSearchInput) {
    artefakSearchInput.addEventListener('input', function () {
      artefakSearch = this.value;
      renderArtefak();
    });
  }

  ['artefakSemester', 'artefakKategori', 'artefakMataKuliah'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', function () {
        if (id === 'artefakSemester') artefakSemester = this.value;
        if (id === 'artefakKategori') artefakKategori = this.value;
        if (id === 'artefakMataKuliah') artefakMataKuliah = this.value;
        renderArtefak();
      });
    }
  });

  // Filter dokumentasi
  const docCatEl = document.getElementById('docKategori');
  const docSemEl = document.getElementById('docSemester');
  if (docCatEl) {
    docCatEl.addEventListener('change', function () {
      docKategori = this.value;
      renderDokumentasi();
    });
  }
  if (docSemEl) {
    docSemEl.addEventListener('change', function () {
      docSemester = this.value;
      renderDokumentasi();
    });
  }

  // Global search
  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      const results = document.getElementById('searchResults');
      if (!q) {
        results.innerHTML = '';
        results.style.display = 'none';
        return;
      }

      let output = '';

      const mkMatches = [...REFLEKSI_SEMESTER_1, ...REFLEKSI_SEMESTER_2]
        .filter(r => r.judul.toLowerCase().includes(q))
        .map(r => '<li>📖 <strong>' + r.judul + '</strong> (Refleksi S' + (r.kategori.includes('1') ? '1' : '2') + ')</li>');

      const karyaMatches = KARYA_INOVASI
        .filter(k => k.judul.toLowerCase().includes(q) || k.kategori.toLowerCase().includes(q))
        .map(k => '<li>💡 <strong>' + k.judul + '</strong> (Karya – ' + k.kategori + ')</li>');

      const artefakMatches = ARTEFAK
        .filter(a => a.nama.toLowerCase().includes(q) || a.mataKuliah.toLowerCase().includes(q))
        .map(a => '<li>📄 <strong>' + a.nama + '</strong> (Artefak)</li>');

      const docMatches = DOKUMENTASI
        .filter(d => d.judul.toLowerCase().includes(q) || d.deskripsi.toLowerCase().includes(q))
        .map(d => '<li>📷 <strong>' + d.judul + '</strong> (Dokumentasi)</li>');

      const all = [...mkMatches, ...karyaMatches, ...artefakMatches, ...docMatches];

      output = all.length > 0
        ? all.slice(0, 10).join('')
        : '<li>Hasil tidak ditemukan untuk "' + q + '"</li>';

      results.innerHTML = output;
      results.style.display = 'block';
    });

    globalSearch.addEventListener('blur', () => {
      setTimeout(() => {
        const results = document.getElementById('searchResults');
        if (results) results.style.display = 'none';
      }, 150);
    });
  }

  // ===================== MODAL & LIGHTBOX CLOSE =====================
  document.querySelectorAll('.modal-close, .lightbox-close').forEach(btn => {
    btn.addEventListener('click', function () {
      const parent = this.closest('.modal-overlay, .lightbox');
      if (parent) closeModal(parent);
    });
  });

  document.querySelectorAll('.modal-overlay, .lightbox').forEach(ov => {
    ov.addEventListener('click', function (e) {
      if (e.target === ov) closeModal(ov);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active, .lightbox.active').forEach(el => closeModal(el));
    }
  });

  // ===================== UPLOAD ZONES =====================
  document.querySelectorAll('.upload-zone').forEach(zone => {
    zone.addEventListener('click', () => {
      const input = zone.querySelector('input[type=file]');
      if (input) input.click();
    });
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });
    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        showToast('📁 ' + e.dataTransfer.files.length + ' file siap diunggah');
      }
    });
    const input = zone.querySelector('input[type=file]');
    if (input) {
      input.addEventListener('change', () => {
        if (input.files.length > 0) {
          showToast('📁 ' + input.files.length + ' file siap diunggah');
        }
      });
    }
  });

  // Edit profile (demo)
  const editProfileBtn = document.getElementById('editProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      showToast('✏️ Fitur edit profil tersedia pada versi berbayar');
    });
  }

  // ===================== TOAST =====================
  window.showToast = function (message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  // ===================== SCREENSAVER BACKGROUND BERANDA =====================
  // Foto screensaver diambil dari file di root proyek: 1.jpg, 2.jpeg,
  // 3.jpeg, 4.jpeg, 5.jpeg, 6.jpeg. Tampil bergantian otomatis di belakang
  // judul halaman beranda.
  const SCREENSAVER_PHOTOS = [
    '1.jpg',
    '2.jpeg',
    '3.jpeg',
    '4.jpeg',
    '5.jpeg',
    '6.jpeg'
  ];

  let ssIndex = 0;
  let ssTimer = null;

  function renderScreensaver() {
    const background = document.getElementById('ssBackground');
    if (!background) return;

    background.innerHTML = SCREENSAVER_PHOTOS.map((src, i) => `
      <div class="ss-bg-layer ${i === 0 ? 'active' : ''}" data-index="${i}" style="background-image:url('${src}');"></div>
    `).join('');

    startScreensaver();
  }

  function goToSlide(index) {
    const total = SCREENSAVER_PHOTOS.length;
    ssIndex = (index + total) % total;

    const background = document.getElementById('ssBackground');
    if (!background) return;
    background.querySelectorAll('.ss-bg-layer').forEach(layer => {
      layer.classList.toggle('active', parseInt(layer.dataset.index, 10) === ssIndex);
    });
  }

  function startScreensaver() {
    const background = document.getElementById('ssBackground');
    if (!background) return;
    stopScreensaver();
    ssTimer = setInterval(() => {
      ssIndex = (ssIndex + 1) % SCREENSAVER_PHOTOS.length;
      background.querySelectorAll('.ss-bg-layer').forEach(layer => {
        layer.classList.toggle('active', parseInt(layer.dataset.index, 10) === ssIndex);
      });
    }, 4000);
  }

  function stopScreensaver() {
    if (ssTimer) {
      clearInterval(ssTimer);
      ssTimer = null;
    }
  }

  // ===================== INIT =====================
  renderScreensaver();
  renderProfile();
  renderProgress();
  renderTimeline();
  renderRefleksiCards('refleksiS1', REFLEKSI_SEMESTER_1);
  renderRefleksiCards('refleksiS2', REFLEKSI_SEMESTER_2);
  renderKarya();
  populateArtefakFilters();
  renderArtefak();
  populateDocFilters();
  renderDokumentasi();
  renderKompetensi();
  renderTantangan();
  renderPerjalanan();

  // Trigger animations for initial page
  const activePage = document.querySelector('.page.active');
  if (activePage) {
    setTimeout(() => {
      triggerPageAnimations(activePage);
    }, 100);
  }

  // Hash change support (browser back/forward)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById('page-' + hash)) {
      navigateTo(hash);
    }
  });

});