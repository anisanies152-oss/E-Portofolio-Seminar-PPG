/* ============================================================================
   DATA STATIS - info alat, jenis & tebal garis, daftar latihan
   ============================================================================ */
'use strict';
window.DTS_DATA = (function () {

  /* ---------- Ketebalan garis (mm) ---------- */
  const LINE_WIDTHS = [
    { id: 'thin', mm: 0.25, label: 'Tipis 0,25' },
    { id: 'med', mm: 0.5, label: 'Sedang 0,5' },
    { id: 'thick', mm: 0.7, label: 'Tebal 0,7' }
  ];

  /* ---------- Jenis garis (pola putus dalam mm) ---------- */
  const LINE_TYPES = [
    { id: 'solid', label: 'Kontinu (garis gambar)', dash: null },
    { id: 'hidden', label: 'Gores (garis tersembunyi)', dash: [4, 2] },
    { id: 'center', label: 'Strip-titik (garis sumbu)', dash: [12, 2.5, 1.5, 2.5] },
    { id: 'phantom', label: 'Strip-titik ganda', dash: [12, 2, 1.5, 2, 1.5, 2] }
  ];

  /* ---------- Kekerasan pensil ---------- */
  const PENCILS = [
    { id: 'H', mm: 0.25, label: '2H', desc: 'tipis, garis bantu', color: '#64748b' },
    { id: 'HB', mm: 0.5, label: 'HB', desc: 'sedang', color: '#334155' },
    { id: 'B', mm: 0.7, label: '2B', desc: 'tebal, garis objek', color: '#0f172a' }
  ];

  /* ---------- Informasi alat ---------- */
  const TOOLS = {
    select: { name: 'Pilih', group: 'edit', desc: 'Memilih, memindahkan, dan mengubah ukuran objek.',
      how: ['Klik objek untuk memilih.', 'Seret objek untuk memindahkan.', 'Seret titik biru untuk mengubah ukuran.', 'Tekan Delete untuk menghapus objek terpilih.'] },
    pan: { name: 'Geser Lembar', group: 'edit', desc: 'Menggeser tampilan kertas (tangan).',
      how: ['Seret di mana saja untuk menggeser tampilan.', 'Gulir mouse untuk memperbesar/memperkecil.'] },
    pencil: { name: 'Pensil', group: 'draw', desc: 'Goresan tangan bebas. Bila dimulai di tepi mistar/segitiga, goresan otomatis lurus mengikuti tepi.',
      how: ['Pilih kekerasan pensil (2H / HB / 2B).', 'Tekan dan seret di kertas.', 'Mulai goresan tepat di tepi alat bantu untuk garis lurus.'] },
    eraser: { name: 'Penghapus', group: 'draw', desc: 'Menghapus sebagian goresan atau satu objek utuh.',
      how: ['Pilih mode: Sebagian atau Objek utuh.', 'Atur ukuran penghapus.', 'Seret melewati garis yang akan dihapus.'] },
    line: { name: 'Garis', group: 'draw', desc: 'Garis lurus presisi; panjang & sudut tampil langsung.',
      how: ['Tekan di titik awal, seret, lalu lepas.', 'Atur snap sudut (15° / 5° / 1°).', 'Mulai di tepi alat bantu agar garis mengikuti tepi.', 'Mulai di titik pusat busur derajat untuk sudut terukur.'] },
    circle: { name: 'Lingkaran', group: 'draw', desc: 'Lingkaran dari titik pusat dan jari-jari.',
      how: ['Tekan di titik pusat.', 'Seret untuk menentukan jari-jari (R).', 'Lepas untuk menyelesaikan.'] },
    arc: { name: 'Busur', group: 'draw', desc: 'Lingkaran sebagian dengan jari-jari dan besar sudut terukur.',
      how: ['Tekan di titik pusat, seret ke titik awal busur, lepas.', 'Gerakkan mouse mengitari pusat untuk menentukan besar sudut.', 'Klik untuk menyelesaikan (Esc untuk batal).'] },
    dimension: { name: 'Ukuran', group: 'draw', desc: 'Garis ukur dengan panah dan angka ukuran otomatis.',
      how: ['Tekan di titik ukur pertama, seret ke titik kedua, lepas.', 'Gerakkan mouse untuk menentukan jarak garis ukur.', 'Klik untuk menempatkan.'] },
    text: { name: 'Teks', group: 'draw', desc: 'Menulis keterangan/huruf pada gambar.',
      how: ['Klik di kertas.', 'Ketik teks lalu tekan Enter.'] },
    ruler: { name: 'Mistar 30 cm', group: 'inst', desc: 'Penggaris lurus berskala mm untuk mengukur dan menarik garis lurus.',
      how: ['Klik tombol untuk meletakkan mistar (klik lagi untuk menyingkirkan).', 'Seret badan mistar untuk memindah, bola hijau untuk memutar.', 'Gunakan Pensil/Garis di sepanjang tepinya.'] },
    tri45: { name: 'Segitiga 45°', group: 'inst', desc: 'Penggaris segitiga 45°-45°-90° untuk garis tegak, mendatar, dan 45°.',
      how: ['Klik tombol untuk meletakkan (klik lagi untuk menyingkirkan).', 'Putar dengan bola hijau (berhenti tiap 15°).', 'Gambar di sepanjang sisi segitiga.'] },
    tri30: { name: 'Segitiga 30°/60°', group: 'inst', desc: 'Penggaris segitiga 30°-60°-90° untuk garis 30°, 60°, dan 90°.',
      how: ['Klik tombol untuk meletakkan (klik lagi untuk menyingkirkan).', 'Putar dengan bola hijau.', 'Gambar di sepanjang sisi segitiga.'] },
    compass: { name: 'Jangka', group: 'inst', desc: 'Jangka 3D: tancapkan jarum, buka kaki, lalu putar untuk menggambar lingkaran/busur.',
      how: ['Klik tombol untuk meletakkan jangka (klik lagi untuk menyingkirkan).', 'Seret jarum (merah) untuk memindah titik pusat.', 'Seret ujung pensil untuk membuka/menutup kaki (R).', 'Seret kepala jangka berputar untuk menggambar busur/lingkaran.'] },
    protractor: { name: 'Busur Derajat', group: 'inst', desc: 'Mengukur dan membuat sudut 0°–180°.',
      how: ['Klik tombol untuk meletakkan (klik lagi untuk menyingkirkan).', 'Pusat busur = titik sudut.', 'Dengan alat Garis, mulai tepat di titik pusat — sudut dibaca dari garis dasar busur.'] }
  };

  /* ---------- Latihan (dinilai otomatis) ---------- */
  // expected: line {len, ang (0-180, arah bebas)}, circle {r}, arc {r, sweep}
  const TASKS = [
    { id: 't1', title: 'Garis Mendatar 80 mm', desc: 'Buat satu garis mendatar (0°) sepanjang 80 mm.', hint: 'Gunakan alat Garis atau Pensil di tepi Mistar.',
      expected: [{ kind: 'line', len: 80, ang: 0 }] },
    { id: 't2', title: 'Garis Tegak 80 mm', desc: 'Buat satu garis tegak (90°) sepanjang 80 mm.', hint: 'Letakkan Segitiga 45° lalu gambar di sisi tegaknya.',
      expected: [{ kind: 'line', len: 80, ang: 90 }] },
    { id: 't3', title: 'Garis Miring 45°', desc: 'Buat garis 60 mm dengan sudut 45°.', hint: 'Gambar di sisi miring Segitiga 45°.',
      expected: [{ kind: 'line', len: 60, ang: 45 }] },
    { id: 't4', title: 'Garis 60°', desc: 'Buat garis 70 mm dengan sudut 60°.', hint: 'Gunakan Segitiga 30°/60°.',
      expected: [{ kind: 'line', len: 70, ang: 60 }] },
    { id: 't5', title: 'Sudut 75° dengan Busur Derajat', desc: 'Buat garis 70 mm dengan sudut 75°.', hint: 'Letakkan Busur Derajat, mulai garis tepat di titik pusatnya.',
      expected: [{ kind: 'line', len: 70, ang: 75 }] },
    { id: 't6', title: 'Lingkaran R30 dengan Jangka', desc: 'Buat lingkaran berjari-jari 30 mm (Ø60).', hint: 'Buka kaki Jangka ke R 30, lalu putar kepala jangka satu putaran penuh.',
      expected: [{ kind: 'circle', r: 30 }] },
    { id: 't7', title: 'Busur 90° R25', desc: 'Buat busur berjari-jari 25 mm dengan besar sudut 90°.', hint: 'Gunakan alat Busur atau Jangka (putar seperempat putaran).',
      expected: [{ kind: 'arc', r: 25, sweep: 90 }] },
    { id: 't8', title: 'Persegi Panjang 80 × 50', desc: 'Buat persegi panjang 80 mm × 50 mm.', hint: 'Aktifkan Snap agar sudut-sudut tersambung.',
      expected: [{ kind: 'line', len: 80, ang: 0 }, { kind: 'line', len: 80, ang: 0 }, { kind: 'line', len: 50, ang: 90 }, { kind: 'line', len: 50, ang: 90 }] },
    { id: 't9', title: 'Segitiga Sama Sisi 60', desc: 'Buat segitiga sama sisi dengan panjang sisi 60 mm.', hint: 'Satu sisi mendatar, dua sisi lain 60° dan 120°.',
      expected: [{ kind: 'line', len: 60, ang: 0 }, { kind: 'line', len: 60, ang: 60 }, { kind: 'line', len: 60, ang: 120 }] },
    { id: 't10', title: 'Segi Enam Beraturan Sisi 40', desc: 'Buat segi enam beraturan dengan sisi 40 mm (boleh dengan lingkaran bantu R40).', hint: 'Lingkaran R40 dibagi enam dengan jangka berjari-jari 40.',
      expected: [{ kind: 'line', len: 40, ang: 0 }, { kind: 'line', len: 40, ang: 0 }, { kind: 'line', len: 40, ang: 60 }, { kind: 'line', len: 40, ang: 60 }, { kind: 'line', len: 40, ang: 120 }, { kind: 'line', len: 40, ang: 120 }] }
  ];

  return { LINE_WIDTHS, LINE_TYPES, PENCILS, TOOLS, TASKS };
})();
