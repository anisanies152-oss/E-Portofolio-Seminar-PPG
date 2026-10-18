/* ============================================================================
   MATERI - 11 modul materi menggambar teknik
   ============================================================================ */
'use strict';
window.DTS_MATERI_DATA = [
 {
  "id": "m1",
  "icon": "📐",
  "title": "Pengertian Menggambar Teknik",
  "ill": "compare",
  "body": [
   {
    "h": "Apa itu menggambar teknik?",
    "p": "Menggambar teknik adalah proses membuat gambar yang komunikatif dan objektif untuk menyampaikan ide rancangan (berupa bentuk, ukuran, dan material) agar dapat dipahami serta diproduksi oleh orang lain tanpa salah tafsir. Berbeda dengan gambar seni, gambar teknik mengikuti aturan baku (standar) sehingga bersifat universal, tidak bergantung pada pendapat pribadi."
   },
   {
    "h": "Perbedaan gambar seni vs gambar teknik",
    "table": {
     "head": [
      "Aspek",
      "Gambar Seni",
      "Gambar Teknik"
     ],
     "rows": [
      [
       "Tujuan",
       "Ekspresi & keindahan",
       "Komunikasi teknis"
      ],
      [
       "Kaidah",
       "Bebas",
       "Baku / berstandar"
      ],
      [
       "Ukuran",
       "Tidak mutlak",
       "Presisi & terukur"
      ],
      [
       "Pembaca",
       "Umum",
       "Teknisi / engineer"
      ]
     ]
    }
   },
   {
    "h": "Kenapa penting bagi siswa SMK?",
    "p": "Gambar teknik adalah \"bahasa industri\". Semua bidang teknik (mesin, bangunan, listrik, otomotif, sipil) berkomunikasi dengan gambar teknik. Keterampilan ini menjadi fondasi kompetensi kerja di dunia industri."
   }
  ],
  "practice": {
   "label": "Coba gambar di Simulasi"
  }
 },
 {
  "id": "m2",
  "icon": "⚙️",
  "title": "Fungsi Gambar Teknik",
  "ill": null,
  "body": [
   {
    "h": "Tiga fungsi utama",
    "ul": [
     "Bahasa teknik (bahasa gambar): menyampaikan informasi rancangan antar perancang, pembuat, dan pengguna.",
     "Media dokumentasi: menyimpan rencana, modifikasi, dan standar produk untuk masa mendatang.",
     "Media pemikiran/ide: membantu perancang mengembangkan gagasan dan menganalisis bentuk, ukuran, serta konstruksi."
    ]
   },
   {
    "h": "Siapa pembacanya?",
    "p": "Gambar teknik dibaca oleh perencana (designer), pelaksana (drafter/welder/machinist), dan pihak yang memeriksa (quality control). Satu lembar gambar yang kurang jelas dapat menyebabkan produk cacat, boros material, dan membahayakan keselamatan."
   }
  ],
  "practice": {
   "label": "Buka Simulasi"
  }
 },
 {
  "id": "m3",
  "icon": "🗂️",
  "title": "Standar Gambar Teknik",
  "ill": "paper",
  "body": [
   {
    "h": "Mengapa perlu standar?",
    "p": "Agar satu gambar dapat dibaca seragam di seluruh dunia. Standar mengatur ukuran kertas, skala, jenis dan tebal garis, tata letak kepala gambar (title block), penulisan ukuran, serta simbol-simbol."
   },
   {
    "h": "Standar yang umum digunakan",
    "ul": [
     "ISO (International Organization for Standardization) — paling banyak dipakai.",
     "JIS (Jepang), ASME/Y14.5 (Amerika), DIN (Jerman).",
     "Batas garis tepi dan kolom judul diatur standar nasional/internasional."
    ]
   },
   {
    "h": "Ukuran kertas (ISO 216)",
    "table": {
     "head": [
      "Tipe",
      "Ukuran (mm)"
     ],
     "rows": [
      [
       "A0",
       "841 × 1189"
      ],
      [
       "A1",
       "594 × 841"
      ],
      [
       "A2",
       "420 × 594"
      ],
      [
       "A3",
       "297 × 420 (dipakai simulator)"
      ],
      [
       "A4",
       "210 × 297"
      ]
     ]
    }
   },
   {
    "h": "Skala (ISO 5455)",
    "table": {
     "head": [
      "Skala",
      "Makna"
     ],
     "rows": [
      [
       "1:1",
       "Ukuran gambar sama dengan benda nyata"
      ],
      [
       "1:2",
       "1 mm di gambar = 2 mm benda"
      ],
      [
       "2:1",
       "2 mm di gambar = 1 mm benda"
      ],
      [
       "1:5, 1:10, 1:20",
       "Pembesaran / pengecilan umum"
      ]
     ]
    }
   }
  ],
  "practice": {
   "label": "Isi kepala gambar",
   "tab": "lembar"
  }
 },
 {
  "id": "m4",
  "icon": "✏️",
  "title": "Alat Gambar",
  "ill": "tools",
  "body": [
   {
    "h": "Peralatan pokok",
    "p": "Meja gambar dengan kepala-T atau papan gambar, mistar segi empat (T-square), dua mistar segitiga (45° dan 30/60°), jangka, busur derajat, pensil (2H–H untuk garis tipis, HB untuk garis sedang, B-2B untuk garis tebal), penghapus, mal (sablon) huruf & lingkaran, dan kertas gambar."
   },
   {
    "h": "Pensil berdasarkan kegunaan",
    "ul": [
     "4H–2H : garis konstruksi tipis, ringan, mudah dihapus.",
     "HB : tebal garis sedang, sisi tersembunyi.",
     "B–2B : garis objek tebal dan jelas.",
     "Rautan pensil harus menghasilkan ujung runcing (lancip)."
    ]
   },
   {
    "h": "Perawatan alat",
    "ul": [
     "Jaga mata pena jangka selalu tajam.",
     "Simpan alat dalam kotak, jauh dari kelembapan.",
     "Bersihkan meja dari serutan sebelum menggambar."
    ]
   }
  ],
  "practice": {
   "label": "Coba Mistar 3D",
   "inst": "ruler"
  }
 },
 {
  "id": "m5",
  "icon": "〰️",
  "title": "Jenis Garis",
  "ill": "lineTypes",
  "body": [
   {
    "h": "Jenis garis dan penggunaannya",
    "table": {
     "head": [
      "Jenis Garis",
      "Bentuk",
      "Kegunaan"
     ],
     "rows": [
      [
       "Garis tebal kontinu",
       "────────",
       "Garis tampak (objek)"
      ],
      [
       "Garis tipis kontinu",
       "────────",
       "Garis konstruksi, ukur, bantu"
      ],
      [
       "Garis gores (dashed)",
       "– – – –",
       "Bagian yang tersembunyi"
      ],
      [
       "Garis strip-titik",
       "—·—·—",
       "Garis sumbu / garis tengah"
      ],
      [
       "Garis strip-titik ganda",
       "—··—··—",
       "Benda yang dipindahkan / bagian sebelum dibentuk"
      ],
      [
       "Garis bebas",
       "~~~~",
       "Potongan putus"
      ]
     ]
    }
   },
   {
    "h": "Aturan penting",
    "ul": [
     "Tebal garis disesuaikan kelompok: garis tebal ≈ 0,5–0,7 mm; garis tipis ≈ 0,25 mm.",
     "Garis sumbu menonjol sedikit di luar kontur lingkaran.",
     "Jarak antar garis gores dibuat seragam.",
     "Garis gambar boleh bersinggungan, tetapi tidak boleh saling menimpa tanpa arti."
    ]
   }
  ],
  "practice": {
   "label": "Coba alat Garis",
   "tool": "line"
  }
 },
 {
  "id": "m6",
  "icon": "📏",
  "title": "Ketebalan Garis & Pensil",
  "ill": "lineWidths",
  "body": [
   {
    "h": "Rasio tebal garis",
    "p": "Perbandingan tebal antara garis tebal dan garis tipis harus lebih besar dari 1:2. Standar memilih dua ketebalan saja per gambar: tebal (0,5–0,7 mm) dan tipis (0,25–0,35 mm) untuk menjaga kejelasan saat direproduksi."
   },
   {
    "h": "Pemilihan pensil",
    "table": {
     "head": [
      "Fungsi",
      "Pensil",
      "Tebal ideal"
     ],
     "rows": [
      [
       "Garis konstruksi/bantu",
       "2H – H",
       "± 0,25 mm"
      ],
      [
       "Sisi tersembunyi",
       "HB",
       "± 0,5 mm"
      ],
      [
       "Kontur objek",
       "B – 2B",
       "± 0,7 mm"
      ]
     ]
    }
   }
  ],
  "practice": {
   "label": "Coba Pensil 2H/HB/2B",
   "tool": "pencil"
  }
 },
 {
  "id": "m7",
  "icon": "📐",
  "title": "Sudut & Segitiga",
  "ill": "angles",
  "body": [
   {
    "h": "Macam sudut",
    "table": {
     "head": [
      "Nama",
      "Besar",
      "Ilustrasi"
     ],
     "rows": [
      [
       "Sudut siku",
       "90°",
       "huruf L"
      ],
      [
       "Sudut lancip",
       "< 90°",
       "runcing"
      ],
      [
       "Sudut tumpul",
       "> 90°",
       "melebar"
      ],
      [
       "Sudut lurus",
       "180°",
       "garis lurus"
      ]
     ]
    }
   },
   {
    "h": "Segitiga penggaris",
    "ul": [
     "Segitiga 45°–45°–90° : membuat 45°, 90°, dan kombinasi 135°, 225°.",
     "Segitiga 30°–60°–90° : membuat 30°, 60°, 90° serta kelipatannya.",
     "Dua segitiga digabung dapat membuat garis sejajar dan tegak lurus yang akurat (menggeser segitiga tanpa memutar).",
     "Garis paralel dibuat dengan menahan satu segitiga lalu menggeser segitiga lainnya."
    ]
   },
   {
    "h": "Mengukur sudut",
    "p": "Sudut diukur berlawanan arah jarum jam dari garis dasar horizontal (0° ke kanan). Simulator menampilkan indikator sudut secara real-time."
   }
  ],
  "practice": {
   "label": "Latihan Garis 45°",
   "task": "t3"
  }
 },
 {
  "id": "m8",
  "icon": "🔍",
  "title": "Skala",
  "ill": "scale",
  "body": [
   {
    "h": "Pengertian skala",
    "p": "Skala adalah perbandingan antara ukuran pada gambar dengan ukuran sesungguhnya dari benda. Skala ditulis pada kepala gambar (contoh: SKALA 1:1, 1:2, 2:1)."
   },
   {
    "h": "Rumus",
    "p": "Skala = Ukuran Gambar ÷ Ukuran Nyata."
   },
   {
    "h": "Contoh penggunaan",
    "ul": [
     "1:1 → gambar seukuran benda (benda kecil seperti mur, pin).",
     "1:2 → gambar setengah ukuran benda.",
     "2:1 → gambar dua kali ukuran benda (bagian yang sangat kecil)."
    ]
   }
  ],
  "practice": {
   "label": "Buka Simulasi"
  }
 },
 {
  "id": "m9",
  "icon": "📏",
  "title": "Ukuran / Dimensi",
  "ill": "dimension",
  "body": [
   {
    "h": "Aturan pemberian ukuran",
    "ul": [
     "Semua ukuran menggunakan satuan mm (tanpa menulis \"mm\").",
     "Gunakan garis bantu (extension line) yang menonjol ±2 mm dari ujung objek.",
     "Garis ukur diberi panah di kedua ujung dan angka ukuran di tengah.",
     "Angka ukuran boleh ditulis di atas garis atau di sela-sela garis ukur.",
     "Tidak boleh menuliskan ukuran duplikat yang bertentangan.",
     "Ukuran diletakkan di luar bentuk benda bila memungkinkan (lebih bersih)."
    ]
   },
   {
    "h": "Simbol penting",
    "ul": [
     "Ø : diameter (dipakai sebelum angka, mis. Ø60)",
     "R : radius/jejari (mis. R30)",
     "Angka dalam kotak (mis. 50 dalam bingkai) untuk ukuran dasar/teoritis."
    ]
   }
  ],
  "practice": {
   "label": "Coba alat Ukuran",
   "tool": "dimension"
  }
 },
 {
  "id": "m10",
  "icon": "📐",
  "title": "Konstruksi Geometris",
  "ill": "geo",
  "body": [
   {
    "h": "Apa itu konstruksi geometris?",
    "p": "Teknik membangun bentuk geometri (sejajar, tegak lurus, membagi garis dan sudut, segi banyak beraturan, busur) hanya dengan pensil, penggaris, dan jangka — tanpa kalkulasi."
   },
   {
    "h": "Contoh konstruksi dasar",
    "ol": [
     "Garis tegak lurus di tengah ruas (garis bagi) dengan busur jangka dari kedua ujung.",
     "Membagi garis menjadi n bagian sama dengan garis bantu berskala.",
     "Segi enam beraturan: lingkaran dibagi 6 busur dengan bukaan jangka = radius.",
     "Segi empat/bujur sangkar dari lingkaran berdiameter tertentu.",
     "Membulatkan sudut (fillet) dengan busur berpusat di titik bagi sudut."
    ]
   }
  ],
  "practice": {
   "label": "Latihan Segi Enam",
   "task": "t10"
  }
 },
 {
  "id": "m11",
  "icon": "🛡️",
  "title": "Etika & Keselamatan Kerja",
  "ill": null,
  "body": [
   {
    "h": "Etika menggambar",
    "ul": [
     "Kerjakan gambar dari garis tipis ke garis tebal (garis tebal terakhir).",
     "Bersihkan gambar dari goresan konstruksi yang tidak terpakai.",
     "Tulis kepala gambar (nama, kelas, judul, no. gambar, skala, tanggal) dengan lengkap.",
     "Jangan menjiplak hasil orang lain; setiap gambar adalah karya sendiri.",
     "Hargai presisi: ukuran kecil yang meleset dapat merusak produk."
    ]
   },
   {
    "h": "Keselamatan kerja di ruang gambar / bengkel",
    "ul": [
     "Jangan mengarahkan pena jangka ke wajah orang.",
     "Gunakan alat sesuai fungsinya; jangan memakai mistar untuk memotong atau memukul.",
     "Jaga serutan dan sampah kertas agar tidak mengganggu pekerjaan orang lain.",
     "Elektronik: matikan HP saat praktik (hindari distraksi yang mengurangi ketelitian).",
     "Jika menggambar di komputer, lakukan jeda dan atur pencahayaan mata."
    ]
   }
  ],
  "practice": {
   "label": "Buka Simulasi"
  }
 }
];
