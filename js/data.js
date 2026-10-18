// ============================================================
// DATA E-PORTOFOLIO PPG
// Edit semua konten di bawah ini sesuai data pribadi Anda
// ============================================================

const PORTFOLIO_DATA = {
  // ===================== PROFIL =====================
  profile: {
    nama: "Muhammad Anis Fauzan",
    nim: "2590074950852",
    bidangStudi: "Teknik Otomotif",
    programStudi: "Program Studi Pendidikan Profesi Guru",
    universitas: "Universitas Negeri Makassar",
    tahunPPG: "2025 - 2026",
    asalInstitusi: "SMK Negeri 1 Makassar",
    email: "muhammadanis@email.com",
foto: "11.jpeg",
    deskripsi:
      "Saya adalah mahasiswa Program Studi Pendidikan Profesi Guru dalam jabatan dengan bidang studi Teknik Otomotif. Saya memiliki semangat untuk menjadi pendidik yang profesional, reflektif, dan inovatif yang mampu menciptakan pembelajaran bermakna dan berpihak pada murid.",
riwayatPendidikan: [
      { jenjang: "SD", nama: "UPT SD Negeri 4 Carawali", tahun: "2009 - 2015", logo: "10.jpg" },
      { jenjang: "SMP/MTs", nama: "MTs YMPI Rappang", tahun: "2015 - 2018", logo: "9.jpg" },
      { jenjang: "SMK/MA", nama: "UPT SMK Negeri 3 Sidrap", tahun: "2018 - 2021", logo: "8-logo.jpg" },
      { jenjang: "S1", nama: "Universitas Negeri Makassar", tahun: "2021 - 2025", logo: "7.jpg" }
    ],
    quote:
      "\"Guru adalah pelita yang menerangi jalan murid menuju masa depan. Mendidik bukan sekadar mengajar, melainkan menumbuhkan harapan, karakter, dan mimpi.\"",

    visiPendidikan:
      "Visi pribadi saya untuk pendidikan di Indonesia adalah mewujudkan pendidikan yang bermutu untuk setiap anak bangsa. ",

    visiCalonGuru:
      "Sebagai calon guru, saya bervisi menjadi pendidik yang tidak hanya mentransfer ilmu pengetahuan kepada murid, tetapi menjadi seorang pendidik profesional yang mampu mendidik, membimbing, melatih, dan menjadi teladan bagi muridnya. Guru merupakan ujung tombak pendidikan yang bertanggung jawab pada kualitas generasi penerus bangsa dan menjadi kunci penting keberhasilan pendidikan.",

    misi: [
      "Mengikuti program Pendidikan Profesi Guru (PPG) untuk memperoleh sertifikat pendidik sebagai bentuk pengakuan bahwa saya kompeten menjadi guru dan menyandang gelar “Guru Profesional”.",
      "Meningkatkan kompetensi pedagogik, profesional, kepribadian, dan sosial.",
      "Memanfaatkan teknologi secara kreatif dan tepat guna dalam proses pembelajaran.",
      "Menjunjung tinggi nilai-nilai luhur pancasila dan kode etik profesi guru.",
      "Menjadi pembelajar sepanjang hayat."
    ],

    pengalamanOrganisasi: [
      { organisasi: "LDF RM FT UNM", jabatan: "Anggota Departemen Piqpel", tahun: "2022 - 2023", deskripsi: "Terlibat aktif dalam kepanitiaan kegiatan sekolah dan pembinaan kedisiplinan siswa." },
      { organisasi: "LDF RM FT UNM", jabatan: "Ketua Umum", tahun: "2023 - 2024", deskripsi: "Mengikuti kegiatan kepramukaan, perkemahan, dan latihan keterampilan kepemimpinan serta kedisiplinan." },
      { organisasi: "LDF RM FT UNM", jabatan: "Ketua Koordinasi MSO/Dewan Pendamping Organisasi", tahun: "2024 - 2025", deskripsi: "Belajar pertolongan pertama, kepedulian sosial, dan terlibat dalam kegiatan sosial kemanusiaan." },
      { organisasi: "LDK FSI RI UNM", jabatan: "Anggota Departemen Ilmu Al-Qur'an", tahun: "2024 - 2025", deskripsi: "Mengembangkan keterampilan organisasi, kerja sama tim, dan kepemimpinan mahasiswa di lingkungan kampus." },
      { organisasi: "BPS UNM", jabatan: "Sekretaris BPS", tahun: "2024 - 2025", deskripsi: "Memimpin dan mengoordinasikan kegiatan kelas, menjembatani komunikasi antara murid dan guru." },
      { organisasi: "LDF RM FT UNM", jabatan: "Dewan Pendamping Organisasi/Majelis Syuro Organisasi (MSO)", tahun: "2025 – 2026", deskripsi: "Mengikuti pembinaan kerohanian dan turut mengelola kegiatan keagamaan di sekolah." },
      { organisasi: "LDK FSI RI UNM", jabatan: "Dewan Pendamping Organisasi/Majelis Syuro Organisasi (MSO)", tahun: "2025 – 2026", deskripsi: "Terlibat dalam kegiatan sosial kemasyarakatan, gotong royong, dan kepemudaan di lingkungan tempat tinggal." }
    ]
  },

  // ===================== PROGRESS =====================
  progress: [
    { label: "Semester 1", value: 100, icon: "book" },
    { label: "Semester 2", value: 100, icon: "book" },
    { label: "Refleksi", value: 90, icon: "reflect" },
    { label: "Karya Inovasi", value: 80, icon: "bulb" },
    { label: "Artefak", value: 90, icon: "folder" },
    { label: "Dokumentasi", value: 100, icon: "camera" }
  ],

  // ===================== FUNGSI REFLEKSI (helper) =====================
  _empty(value) {
    return value || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi vitae magna eu nisi porta condimentum eget ac risus.";
  }
};

// ============================================================
// REFLEKSI SEMESTER 1
// ============================================================

const REFLEKSI_SEMESTER_1 = [
  {
    id: "filosofi",
    judul: "Filosofi Pendidikan dan Pendidikan Nilai",
    icon: "philosophy",
    kategori: "Semester 1",
    singkat:
      "Mempelajari landasan filosofis pendidikan, hakikat manusia, dan nilai-nilai yang menjadi fondasi menjadi seorang pendidik.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Mata kuliah ini menawarkan berbagai macam materi perkuliahan mulai dari Pokok-pokok Pikiran Ki Hajar Dewantara, Pancasila sebagai Landasan Filosofi Pendidikan Nasional, Peran Guru dalam Pendidikan Nilai, hingga Kode Etik untuk Profesi Guru. Mata kuliah ini membuka wawasan saya bahwa pendidiikan itu “menuntun” segala kodrat yang ada pada anak-anak agar dapat memperoleh keselamatan dan kebahagiaan yang setinggi-tingginya. Seorang pendidik harus mampu menuntun tumbuh atau hidupnya kodrat yang dimiliki oleh murid. Selain itu pendidikan juga bukan hanya sekedar transfer pengetahuan tetapi juga sebagai usaha transfer nilai-nilai kepada murid. Menginternalisasikan pendidikan nilai harus berlandaskan kepada nilai-nilai luhur pancasila. Nilai-nilai tersebut menjadi landasan dalam membentuk karakter, cerdas, beriman, berakhlak mulia, dan bertanggung jawab. Sebagai calon guru penting untuk memahami pendidikan nilai agar nantinya bisa menanamkan, mengembangkan, dan menginternalisasikan nilai-nilai moral pada murid. Mata kuliah ini juga memberikan wawasan kepada saya mengenai kode etik profesi guru. Sebagai calon guru penting untuk memahami kode etik profesi guru sebagai rambu-rambu agar mampu menjalankan profesinya secara profesional dan sesuai dengan standar moral."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Materi berbeda dari praktik yang saya lakukan selama ini adalah saya cenderung memandang bahwa pembelajaran sebagai proses penyampaian materi agar murid dapat memahami kompetensi yang diajarkan. Setelah mempelajari mata kuliah ini saya menyadari bahwa pembelajaran tidak hanya berorientasi pada pengetahuan saja, melainkakn juga perlu memperhatikan potensi dan membentuk karakter murid dengan mengintegrasikan nilai-nilai luhur pancasila dalam pembelajaran."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep utama dan penting yang telah saya pelajari adalah pendidikan adalah proses “menuntun” murid sesuai kodratnya; kodrat alam dan kodrat zaman; guru harus berperan sebagai fasilitator, membimbing, dan mendidik; guru harus menanamkan, mengembangkan, dan menginternalisasikan pendidikan nilai dalam pembelajaran."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Setelah mempelajari mata kuliah ini, saya ingin mengubah cara saya dalam melaksanakan pembelajaran. Saya ingin menerapkan pembelajaran yang berpusat pada murid, berkesadaran, bermakna, dan menggembirakan. Selain itu, saya juga berkomitmen menjadi guru yang tidak hanya mengajarkan teori, tetapi juga sebagai teladan bagi murid."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah:<ol><li>Mengenal pokok-pokok pikiran Ki Hajar Dewantara.</li><li>Pancasila sebagai landasan filosofi pendidikan nasional.</li><li>Peran guru dalam pendidikan nilai.</li><li>Kode etik untuk profesi guru.</li></ol>"
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih artefak tersebut karena materi di dalamnya memberikan pemahaman yang penting bagi saya sebagai calon guru. Keempat artefak tersebut membantu saya memahami bagaimana seharusnya seorang guru menjalankan perannya, mulai dari memahami pemikiran Ki Hajar Dewantara, menjadikan Pancasila sebagai landasan pendidikan, menanamkan nilai kepada murid, hingga menjalankan profesi sesuai dengan kode etik guru."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian yang mendukung hasil refleksi saya adalah pemahaman tentang pendidikan sebagai proses menuntun kodrat murid, Pancasila sebagai landasan filosofi pendidikan nasional, pentingnya peran guru dalam menanamkan dan menginternalisasikan nilai-nilai luhur Pancasila, serta kode etik sebagai pedoman guru dalam menjalankan profesinya."
      }
    ]
  },
  {
    id: "pemahaman-peserta",
    judul: "Pemahaman Peserta Didik dan Pembelajarannya",
    icon: "user",
    kategori: "Semester 1",
    singkat:
      "Memahami karakteristik, kebutuhan, dan keberagaman peserta didik beserta implikasinya dalam pembelajaran.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Sebelum merancang pembelajaran, melaksanakan pembelajaran, dan menilai pembelajaran, ada satu pertanyaan mendasar yang harus dijawab oleh guru: siapakah murid yang kita hadapi dan bagaimana cara terbaik untuk melayani kebutuhan murid? Memahami perkembangan murid bukanlah sekedar teori saja, melainkan sebuah keharusan profesional yang menjadi landasan dalam pengambilan keputusan pedagogis. Mata kuliah ini membuka wawasan saya bahwa setiap murid mempunyai latar belakang, kemampuan, minat dan gaya belajar yang berbeda. Sebagai calon guru penting untuk memahami perbedaan tersebut agar dapat merancang pengalaman belajar yang bermakna, efektif, dan sesuai dengan perkembangan yang mereka lalui."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini adalah pemahaman bahwa pembelajaran perlu diawali dengan mengenali karakteristik dan kebutuhan murid. Selama ini saya cenderung menggunakan pendekatan pembelajaran yang sama kepada seluruh murid dengan anggapan bahwa mereka memiliki kemampuan dan kebutuhan belajar yang relatif sama. Setelah mempelajari mata kuliah ini, saya menyadari bahwa perbedaan individu perlu menjadi pertimbangan dalam menentukan tujuan, metode, media, maupun asesmen pembelajaran."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep yang saya pelajari adalah murid merupakan individu yang mempunyai karakteristik yang berbeda-beda, baik dari segi kognitif, sosial-emosioanl, moral, dan fisik sehingga pendekatan yang dilakukan oleh guru pun juga harus berbeda."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Perubahan yang ingin saya lakukan adalah melakukan observasi pada awal pembelajaran untuk mengenali karakteristik, gaya belajar, kemampuan, dan kebutuhan murid. Hasil observasi tersebut menjadi dasar dalam merancang pengalaman belajar dan mengelola kelas yang mampu mengakomodasi seluruh kebutuhan murid."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah:<ol><li>Memahami peserta didik.</li><li>Berbagai karakteristik peserta didik.</li></ol>"
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih kedua artefak tersebut karena memberikan pemahaman yang lebih mendalam kepada saya mengenai pentingnya mengenal peserta didik sebelum melaksanakan pembelajaran. Pemahaman ini menjadi dasar bagi saya sebagai calon guru untuk menentukan strategi, metode, aktivitas, dan asesmen yang sesuai dengan kondisi murid sehingga pembelajaran dapat berlangsung secara efektif dan mampu mengakomodasi perbedaan yang ada."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian yang mendukung hasil refleksi saya adalah pembahasan mengenai berbagai karekteristik murid, seperti perbedaan fisik, intelektual, perilaku, pencapaian, serta emosional."
      }
    ]
  },
  {
    id: "pembelajaran-mendalam-1",
    judul: "Pembelajaran Mendalam dan Asesmen Dasar",
    icon: "layer",
    kategori: "Semester 1",
    singkat:
      "Menelaah konsep pembelajaran mendalam sebagai pendekatan pembelajaran yang bermakna, berkesadaran, dan menggembirakan.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Mata kuliah ini sangat berkaitan dengan peran saya sebagai calon guru SMK karena memberikan pemahaman bahwa pembelajaran tidak hanya berfokus pada penyampaian materi, tetapi harus memberikan pengalaman belajar yang bermakna, berkesadaran, dan menggembirakan. Saya memahami bahwa guru perlu merancang pembelajaran yang kontekstual dan autentik sesuai dengan kebutuhan murid serta dunia kerja. Selain itu, pembelajaran dan asesmen merupakan satu kesatuan yang harus dirancang secara selaras agar dapat membantu murid mencapai kompetensi yang dituju."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Materi yang berbeda dari praktik yang saya lakukan selama ini adalah pemahaman bahwa asesmen bukan hanya digunakan untuk memberikan nilai setelah pembelajaran selesai. Selama ini saya lebih cenderung menggunakan asesmen untuk mengetahui hasil belajar murid. Setelah mempelajari materi ini, saya memahami bahwa asesmen juga perlu dilakukan pada awal dan selama proses pembelajaran untuk mengetahui kesiapan, perkembangan, hambatan, dan kebutuhan belajar murid. Hasil asesmen tersebut dapat digunakan sebagai umpan balik untuk memperbaiki proses pembelajaran dan menyesuaikan pembelajaran dengan kebutuhan murid."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep utama yang saya pelajari adalah pembelajaran mendalam yang menekankan prinsip bermakna, berkesadaran, dan menggembirakan, serta pengalaman belajar melalui tahapan memahami, mengaplikasikan, dan merefleksikan. Saya juga mempelajari pentingnya constructive alignment, yaitu adanya keterkaitan antara tujuan pembelajaran, kegiatan pembelajaran, dan asesmen. Selain itu, saya memahami bahwa asesmen terdiri atas asesmen formatif dan sumatif serta dapat berfungsi sebagai assessment as learning, assessment for learning, dan assessment of learning."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Setelah mempelajari mata kuliah ini, saya ingin mengubah cara saya dalam merancang dan melaksanakan pembelajaran. Saya ingin memastikan bahwa tujuan pembelajaran, aktivitas, dan asesmen saling berkaitan dan benar-benar mengarah pada kompetensi yang harus dicapai murid. Saya juga ingin melakukan asesmen awal untuk mengetahui kesiapan murid, menggunakan asesmen formatif selama proses pembelajaran, serta memberikan umpan balik dan tindak lanjut bagi murid yang mengalami kesulitan."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah:<ol><li>Pembelajaran yang autentik dan kontekstual</li><li>Komponen perencanaan dan instrumen asesmen awal</li></ol>"
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih artefak tersebut karena menunjukkan proses belajar saya dalam memahami dan menerapkan konsep pembelajaran mendalam dan asesmen. Artefak tersebut membantu saya memahami bagaimana merancang pembelajaran yang kontekstual dengan dunia kerja, serta menyusun perencanaan pembelajaran dan asesmen yang sesuai dengan kebutuhan murid."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian yang mendukung hasil refleksi saya adalah bagian yang membahas prinsip pembelajaran mendalam bermakna, berkesadaran, dan menggembirakan, pengalaman belajar memahami, mengaplikasikan, dan merefleksikan, serta keterpaduan antara tujuan pembelajaran, kegiatan pembelajaran, dan asesmen."
      },
    ]
  },
  {
    id: "design-thinking",
    judul: "Design Thinking",
    icon: "lightbulb",
    kategori: "Semester 1",
    singkat:
      "Belajar memecahkan masalah pendidikan secara kolaboratif melalui pendekatan design thinking yang berpusat pada pengguna.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Materi Design Thinking memiliki keterkaitan yang erat dengan peran saya sebagai calon guru karena mengajarkan saya untuk melihat permasalahan pembelajaran dari sudut pandang murid. Saya memahami bahwa dalam merancang pembelajaran, guru perlu terlebih dahulu memahami kebutuhan, pengalaman, dan karakteristik murid sebelum menentukan solusi. Pendekatan ini membantu saya menjadi guru yang lebih peka terhadap permasalahan pembelajaran dan mampu menciptakan solusi yang inovatif serta sesuai dengan kebutuhan murid. Design Thinking juga mendorong guru untuk menggabungkan empati, kreativitas, kolaborasi, dan pemecahan masalah dalam merancang pembelajaran."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Materi yang berbeda dari praktik yang saya lakukan selama ini adalah cara memandang dan menyelesaikan suatu permasalahan. Sebelumnya, saya cenderung langsung mencari solusi berdasarkan masalah yang terlihat. Setelah mempelajari Design Thinking, saya memahami bahwa solusi sebaiknya diawali dengan memahami pengguna melalui proses empati, kemudian merumuskan permasalahan secara spesifik, mengembangkan berbagai ide, membuat prototipe, dan melakukan uji coba. Saya juga memahami bahwa solusi tidak selalu harus langsung berhasil karena kegagalan dan kesalahan dapat menjadi kesempatan untuk belajar dan memperbaiki solusi melalui proses iterasi."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep utama yang saya pelajari adalah Design Thinking merupakan pendekatan pemecahan masalah dan inovasi yang berpusat pada manusia. Saya mempelajari lima tahapan Five Stage Design Process, yaitu Empathize, Define, Ideate, Prototype, dan Test/Evaluate. Saya juga memahami pentingnya empati dalam mengenali kebutuhan pengguna, kreativitas dalam menghasilkan berbagai ide, kolaborasi dalam mengembangkan solusi, serta iterasi untuk melakukan perbaikan secara berkelanjutan."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Setelah mempelajari materi Design Thinking, saya ingin mengubah cara saya dalam menghadapi permasalahan pembelajaran. Saya ingin lebih dahulu memahami kebutuhan dan pengalaman murid sebelum menentukan solusi. Saya juga ingin membiasakan diri untuk menghasilkan beberapa alternatif solusi, kemudian menerima umpan balik untuk melakukan perbaikan."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah “Mengenal Design Thinking”."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih artefak “Mengenal Design Thinking” karena artefak tersebut memberikan pemahaman dasar mengenai Design Thinking sebagai pendekatan pemecahan masalah yang berpusat pada manusia. Melalui artefak ini, saya memahami pentingnya melihat permasalahan dari sudut pandang pengguna, mengembangkan ide secara kreatif, serta melakukan uji coba dan perbaikan terhadap solusi yang dibuat." 
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian yang mendukung hasil refleksi saya adalah penjelasan mengenai karakteristik Design Thinking yang berorientasi pada manusia dan menekankan empati, kreativitas, kolaborasi, serta proses iteratif. Selain itu, tahapan Empathize, Define, Ideate, Prototype, dan Test/Evaluate membantu saya memahami langkah-langkah dalam mengenali kebutuhan, merumuskan masalah, mengembangkan solusi, membuat prototipe, dan mengujinya."
      }
    ]
  },
  {
    id: "growth-mindset",
    judul: "Growth Mindset",
    icon: "brain",
    kategori: "Semester 1",
    singkat:
      "Menumbuhkan pola pikir berkembang dalam diri calon guru untuk menghadapi tantangan dan terus belajar.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Mata kuliah ini membuka wawasan saya bahwa dalam diri seseorang terdapat dua pola pikir yaitu fixed mindset dan growth mindset. Sebagai calon guru penting untuk memahami konsep growth mindset, yaitu keyakinan bahwa kemampuan dan kecerdasan seseorang dapat ditingkatkan dengan usaha, kerja keras, dan belajar. Pola pikir seorang guru dapat mempengaruhi pola pikir dan performa murid. Saya juga perlu memiliki growth mindset agar tidak mudah menyerah ketika menghadapi murid yang kesulitan memahami materi."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Materi perkuliahan, kita diajarkan untuk bergeser dari fixed mindset ke growth mindset dan intervensi yang diberikan kepada murid. Praktik yang saya lakukan selama ini, saya hanya berfokus pada penyampain materi kepada murid tanpa memberikan intervensi yang dapat menumbuhkan growth mindset."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Setiap otak manusia bersifat plastisitas. Semakin sering kita belajar maka semakin kuat pemahaman kita terhadap apa yang kita pelajari. Ini berarti setiap orang mempunyai kemampuan untuk mengembangkan dan menguatkan kemampuan otaknya dengan banyak belajar dan latihan."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Setelah saya mendapatkan materi perkuliahan ini, saya ingin menumbuhkan dan mengembangkan growth mindset dalam diri saya. Saya ingin membiasakan diri untuk tidak mudah menyerah ketika menghadapi kesulitan, tetapi menjadikan kesalahan dan tantangan sebagai bagian dari proses untuk belajar dan berkembang. Sebagai calon guru, saya juga ingin menerapkan pola pikir bertumbuh dalam menghadapi berbagai karakteristik dan kemampuan murid, sehingga saya dapat memberikan dukungan dan intervensi yang mendorong mereka untuk percaya bahwa kemampuan mereka dapat terus berkembang."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah:<ol><li>Membentuk Cara Pandang Baru - Pentingnya Memahami Pola Pikir Bertumbuh</li><li>Cara Kerja Otak pada Pola Pikir Bertumbuh</li><li>Menumbuhkan dan Mengembangkan Pola Pikir Bertumbuh</li><li>Pola Pikir Bertumbuh dalam Konteks Pembelajaran</li></ol>."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih artefak tersebut karena ketiganya memberikan pemahaman kepada saya tentang pentingnya pola pikir bertumbuh dalam proses belajar dan peran guru dalam menumbuhkannya pada murid. Melalui artefak tersebut, saya memahami bahwa kemampuan dan kecerdasan dapat dikembangkan melalui usaha, ketekunan, pengalaman, dan kemauan untuk belajar dari kesalahan. Pemahaman ini penting bagi saya sebagai calon guru agar tidak mudah memberikan label terhadap kemampuan murid dan selalu memberikan kesempatan kepada mereka untuk berkembang."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian yang mendukung hasil refleksi saya adalah pembahasan mengenai perbedaan Pola Pikir Tetap (Fixed Mindset) dan Pola Pikir Bertumbuh (Growth Mindset), serta cara guru menumbuhkan pola pikir bertumbuh melalui pujian proses, pemberian umpan balik, afirmasi, dan menjadikan kesalahan sebagai bagian dari proses belajar."
      }
    ]
  },
  {
    id: "ppl-terbimbing",
    judul: "Praktik Pengalaman Lapangan Terbimbing",
    icon: "school",
    kategori: "Semester 1",
    singkat:
      "Pengalaman pertama praktik mengajar di sekolah dengan bimbingan guru pamong dan dosen pembimbing.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Praktik Pengalaman Lapangan (PPL) Terbimbing menjadi sarana bagi saya untuk mengembangkan kompetensi guru profesional. PPL Terbimbing memberikan pengalaman nyata untuk menerapkan pemahaman dan keterampilan yang dipelajari selama perkuliahan ke dalam proses pembelajaran. Melalui kegiatan ini saya melakukan observasi, menyusun media ajar, melaksanakan, dan mengevaluasi pembelajaran di bawah pengawasan guru pamong."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini adalah pengalaman dalam menerapkan perencanaan pembelajaran dengan kondisi nyata di kelas."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep utama yang telah saya pelajari adalah sebelum memulai pembelajaran kita harus melakukan observasi untuk mengenali lingkungan sekolah dan karakteristik murid, merancang pembelajaran, dan melakukan refleksi terhadap pembelajaran yang telah dilaksanakan."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Setelah mengikuti PPL Terbimbing, saya ingin lebih matang dalam mempersiapkan pembelajaran dan tidak hanya berfokus pada penyampaian materi. Saya ingin lebih memperhatikan kondisi dan karakteristik murid, memberikan bimbingan kepada murid yang mengalami kesulitan, serta menggunakan metode dan media yang dapat membuat pembelajaran lebih menarik. Saya juga ingin menjadikan evaluasi dan refleksi sebagai bagian penting dalam memperbaiki pembelajaran yang saya lakukan."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah:<ol><li>Lembar kerja hasil orientasi</li><li>Lembar kerja hasil observasi</li><li>Lembar kerja refleksi pembelajaran</li></ol>."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih ketiga artefak tersebut karena dapat menggambarkan proses pengalaman saya selama mengikuti PPL Terbimbing, mulai dari mengenal dan memahami lingkungan sekolah, mengamati proses pembelajaran, hingga melakukan refleksi terhadap pembelajaran yang telah dilaksanakan."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian yang mendukung hasil refleksi saya adalah hasil orientasi yang memberikan gambaran mengenai kondisi dan lingkungan sekolah, hasil observasi yang membantu saya memahami proses pembelajaran dan kondisi murid di kelas, serta lembar refleksi pembelajaran yang membantu saya mengidentifikasi pengalaman, kendala, dan hal-hal yang perlu diperbaiki dalam pelaksanaan pembelajaran. Ketiga bagian tersebut menjadi bahan bagi saya untuk mengevaluasi diri dan meningkatkan kemampuan saya sebagai calon guru."
      }
    ]
  }
];

// ============================================================
// REFLEKSI SEMESTER 2
// ============================================================

const REFLEKSI_SEMESTER_2 = [
  {
    id: "pse",
    judul: "Pembelajaran Sosial dan Emosional",
    icon: "heart",
    kategori: "Semester 2",
    singkat:
      "Mata kuliah ini bertujuan untuk memfasilitasi para mahasiswa dalam Program Profesi Guru (PPG) memahami pentingnya pembelajaran sosial emosional di lingkungan sekolah. Pada mata kuliah ini para calon guru akan belajar untuk memahami sampai mempraktikkan bagaimana membangun relasi yang baik dengan semua pihak, terutama dengan murid. Dengan mata kuliah ini calon guru dipersiapkan untuk dapat memotivasi, berkesadaran, memberikan pembelajaran bermakna dan pengalaman holistik sesuai pembelajaran mendalam.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Pembelajaran sosial emosional membuka wawasan saya tentang belajar dan mengenali emosi dengan menerapkan komponen pembelajaran sosial berdasarkan kerangka Collaborative for Academic, Social and Emotional Learning (CASEL). Sebagai calon guru, materi ini penting untuk dipahami agar bisa diimplementasikan dalam praktik mengajar agar mewujudkan pembelajaran yang menyenangkan."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini adalah saya selalu meluapkan amarah saya kepada siswa yang sulit diatur ketika pembelajaran untuk memberikan “shock terapy”."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep utama dan penting yang telah saya pelajari sebagai calon guru adalah komponen pembelajaran sosial emosional yaitu kesadaran diri; manajemen diri; kesadaran sosial; pengambilan keputusan yang bertanggung jawab; dan keterampilan sosial."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini adalah mengimplementasikan komponen pembelajaran sosial emosional ke dalam proses pembelajaran agar murid mampu mengenal dan mengelola emosinya sehingga guru dapat mengajar dengan baik."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah modul Komponen Pembelajaran Sosial Emosional (PSE) berdasarkan Kerangka CASEL."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Artefak tersebut saya pilih karena memberikan pemahaman bahwa pentingnya mengembangkan kemampuan sosial dan emosional murid dalam proses pembelajaran."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian dari artefak yang mendukung hasil refleksi saya adalah kerangka pembelajaran sosial emosional dari CASEL."
      }
    ]
  },
  {
    id: "pembelajaran-lanjut",
    judul: "Pembelajaran Mendalam dan Asesmen Lanjut",
    icon: "chart",
    kategori: "Semester 2",
    singkat:
      "Mata kuliah ini merupakan lanjutan dari PMA SMK Dasar yang bertujuan membekali peserta dengan pengetahuan dan keterampilan untuk merancang, melaksanakan, dan mengevaluasi proses pembelajaran serta asesmen yang berpihak pada murid menggunakan pendekatan pembelajaran mendalam (deep learning). Mahasiswa juga akan menganalisis karakteristik murid melalui asesmen awal, menyusun rancangan pembelajaran adaptif, dan menerapkan pendekatan lain seperti Teaching at the Right Level (TaRL) dan Culturally Responsive Teaching (CRT). Mata kuliah ini menekankan pentingnya refleksi kritis dan tindak lanjut terhadap praktik pembelajaran dan asesmen yang mengimplementasi Pembelajaran Mendalam. Mahasiswa akan belajar memaknai data asesmen sebagai dasar pengambilan keputusan yang berkeadilan dan transformatif. Sebagai bagian integral dari penguatan kompetensi, mahasiswa akan mengaplikasikan pendekatan-pendekatan ini dalam kegiatan pembelajaran mikro dan pada mata kuliah Praktik Pengalaman Lapangan (PPL) Mandiri, serta melakukan refleksi sistematis terhadap proses dan hasil pembelajaran yang mereka laksanakan di kelas nyata.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Pembelajaran mendalam dan Asesmen Lanjut memberikan pemahaman kepada saya sebagai calon guru bahwa setiap murid yang ada di dalam kelas mempunyai latar belakang, pengalaman, dan kemampuan yang berbeda. Keragaman ini menjadi tantangan karena harus mampu mengenal berbagai karakteristik murid. Sebelum memulai pembelajaran alangkah baiknya melakukan asesmen awal untuk melakukan pemetaan awal guna mengetahui keberagaman dan mengidentifikasi kebutuhan belajar murid. Hasil asesmen tersebut dijadikan sebagai landasan dalam merancang pembelajaran inklusif dan mendalam."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Praktik yang saya lakukan selama ini adalah saya langsung mengajar tanpa malakukan asesmen awal. Akibatnya ada murid yang tertinnggal dan tidak terjangkau."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep utama yang saya pelajari adalah perbedaan asesmen awal, formatif, dan sumatif serta tujuan pelaksanaan asesmen awal."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Perubahan yang ingin saya lakukan adalah berlatih dalam menyusun dan melaksanakan awal."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah Asesmen Awal Pembelajaran Mendalam."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Artefak tersebut saya pilih karena membantu saya dalam memahami perbedaan asesmen awal, formatif, dan sumatif. Selain itu modul ini juga dilengkapi dengan studi kasus yang menggambarkan proses pembelajaran tanpa asesmen awal."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian artefak yang mendukung hasil refleksi saya adalah Topik 1: Asesmen Awal Pembelajaran Mendalam."
      }
    ]
  },
  {
    id: "projek-kepemimpinan",
    judul: "Projek Kepemimpinan",
    icon: "leadership",
    kategori: "Semester 2",
    singkat:
      "Mata kuliah Projek Kepemimpinan ini adalah mata kuliah berbasis projek yang dirancang untuk mengembangkan kemampuan kepemimpinan mahasiswa calon guru, melalui pengalaman langsung dalam merancang, mengelola, dan mengeksekusi sebuah inisiatif menjadi solusi nyata. Dalam prosesnya, mahasiswa tidak hanya belajar teori kepemimpinan, tetapi juga melatih keterampilan kolaborasi, komunikasi, dan pemecahan masalah dalam konteks dunia nyata.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Mata kuliah Projek Kepemimpinan membantu mengembangkan kemampuan kepemimpinan saya sebagai calon guru, melalui pengalaman langsung dalam merancang, mengelola, dan mengeksekusi sebuah inisiatif menjadi solusi nyata. Dalam prosesnya, mata kuliah ini melatih keterampilan kolaboratif, komunikasi, dan kemampuan menyelesaikan masalah dalam konteks dunia nyata."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Melalui Projek Kepemimpinan, saya belajar bahwa sebuah proyek tidak hanya membutuhkan kemampuan teknis, tetapi juga kemampuan bekerja sama, berkomunikasi, mengatur waktu, mengambil keputusan, dan menyelesaikan masalah bersama."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep utama yang saya pelajari dalam Projek Kepemimpinan adalah kepemimpinan, kerja sama tim, komunikasi, tanggung jawab, manajemen proyek, pemecahan masalah, kreativitas, dan inovasi. Saya memahami bahwa seorang calon guru tidak hanya harus memiliki kemampuan mengajar, tetapi juga perlu memiliki kemampuan memimpin, bekerja sama, dan mengelola suatu kegiatan atau proyek."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Perubahan yang ingin saya lakukan adalah meningkatkan kemampuan kolaborasi, komunikasi, dan berinisiatif dalam melaksanakan tanggung jawab yang diberikan."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah Y-Chart Why–How–What dan rancangan projek alat pencacah sampah berbasis IoT."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Artefak tersebut saya pilih karena menggambarkan proses pemikiran dan perencanaan projek yang saya lakukan bersama tim, mulai dari alasan memilih projek ini, bagaimana cara mewujudkan, hingga hasil yang diinginkan."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian artefak yang mendukung hasil refleksi saya adalah bagian Why, How, dan What yang menjelaskan tujuan projek, proses yang akan dilakukan, serta hasil yang ingin dihasilkan, yaitu alat pencacah sampah berbasis IoT yang memanfaatkan motor listrik dan panel surya serta diarahkan untuk menghasilkan olahan sampah yang memiliki nilai tambah."
      }
    ]
  },
  {
    id: "edupreneurship",
    judul: "Edupreneurship",
    icon: "rocket",
    kategori: "Semester 2",
    singkat:
      "Mata kuliah ini membekali calon guru dengan pengetahuan dan keterampilan untuk merancang kurikulum mata pelajaran menggunakan kerangka Understanding by Design (UbD). Peserta akan mempelajari cara mendesain hasil belajar, penilaian, dan pengalaman belajar yang efektif. Tujuannya adalah agar calon guru mampu secara kolaboratif merancang, menilai, dan mengartikulasikan rasional dari sebuah desain kurikulum yang relevan dengan kebutuhan murid dan satuan pendidikan.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Mata kuliah ini mengajarkan saya bahwa seorang guru juga bisa berjiwa wirausaha dengan tetap mengedepankan nilai-nilai Pendidikan. Guru dapat Menanamkan mentalitas pantang menyerah, berani mengambil risiko terukur, peka terhadap peluang, pandai mengelola sumber daya, dan berorientasi pada solusi."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Melalui matakuliah edupreneurship, pandangan saya mengalami pergeseran yang cukup mendasar. Selama ini, saya terbiasa memandang praktik pembelajaran hanya berfokus pada penyampaian materi kurikuler di dalam kelas  atau sekadar latihan praktik dasar bagi murid. Namun, materi perkuliahan ini membuka wawasan saya bahwa ruang praktik dapat dikembangkan menjadi sebuah ekosistem pembelajaran yang produktif dan bernilai wirausaha (edupreneurship)."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Edupreneurship mengajarkan saya untuk memiliki sikap mandiri, berani mengambil inisiatif, mampu melihat peluang, serta menghasilkan ide atau produk yang dapat memberikan nilai dan manfaat dalam bidang pendidikan."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Berani mengembangkan ide dan peluang dalam pendidikan, misalnya membuat media pembelajaran, kegiatan, atau produk edukatif yang dapat memberikan manfaat bagi murid. Selain itu saya akan Menjadi guru yang lebih kreatif dan inovatif dalam merancang pembelajaran, sehingga kegiatan belajar tidak monoton dan lebih menarik."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan sebagai bukti pendukung hasil refleksi adalah LK Identifikasi Kasus Edupreneurship dalam Profesi Guru. Melalui LK ini, saya belajar mengidentifikasi permasalahan dan kebutuhan di bidang pendidikan, kemudian melihat peluang usaha atau inovasi yang dapat dikembangkan untuk memberikan manfaat bagi peserta didik. Kegiatan ini membantu saya memahami bahwa seorang guru tidak hanya berperan sebagai pengajar, tetapi juga dapat menjadi edupreneur yang kreatif, inovatif, mampu melihat peluang, dan menciptakan solusi dalam dunia pendidikan."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih artefak LK Identifikasi Kasus Edupreneurship dalam Profesi Guru karena LK tersebut paling menggambarkan pengalaman belajar saya dalam memahami dan menerapkan konsep edupreneurship. Melalui LK ini, saya tidak hanya mempelajari teori, tetapi juga belajar mengidentifikasi masalah, melihat peluang, serta merancang ide usaha atau inovasi yang dapat diterapkan dalam bidang pendidikan. Artefak ini menjadi bukti bahwa saya mulai mengembangkan pola pikir kreatif, inovatif, dan solutif sebagai calon guru."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian artefak yang mendukung hasil refleksi saya adalah bagian identifikasi masalah dan peluang usaha serta perancangan ide edupreneurship. Bagian tersebut menunjukkan bahwa saya belajar melihat permasalahan dalam dunia pendidikan sebagai peluang untuk menciptakan solusi yang kreatif dan bermanfaat."
      }
    ]
  },
  {
    id: "ppl-mandiri",
    judul: "Praktik Pengalaman Lapangan Mandiri",
    icon: "briefcase",
    kategori: "Semester 2",
    singkat:
      "Mata kuliah PPL Mandiri  dirancang untuk menguatkan keterampilan profesional calon guru dalam merancang dan melaksanakan perangkat pembelajaran dan asesmen menggunakan PM secara mandiri di lingkungan sekolah. Mahasiswa akan fokus pada pengembangan strategi pembelajaran yang kontekstual, berpihak pada peserta didik, dan sesuai dengan kebutuhan nyata di kelas.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Sebagai calon guru, PPL Mandiri sangat penting karena menjadi sarana dan kesempatan dalam meningkatkan keterampilan profesional calon guru dalam merancang dan melaksankan pembelajaran."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Materi perkuliahan yang berbeda dari praktik yang saya lakukan adalah pengembangan kompetensi sosial. Selama melaksanakan PPL Mandiri, saya menyadari bahwa sebagai calon saya tidak hanya perlu memiliki kemampuan mengajar, tetapi juga perlu membangun relasi dan kerja sama yang baik dengan guru lain."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Pentingnya menguasai 4 kompetensi guru profesional yaitu kompetensi pedagogik, profesional, kepribadian, dan sosial."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Perubahan yang ingin saya lakukan selama PPL Mandiri adalah mengembangkan 4 kompetensi guru profesional terkhusus kompetensi sosial."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti dukung adalah modul ajar, refleksi pembelajaran, dan dokumentasi kegiatan PPL Mandiri."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih artefak tersebut karena dapat menunjukkan proses saya dalam merencanakan dan melaksanakan pembelajaran selama PPL Mandiri."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian yang mendukung hasil refleksi saya adalah proses perencanaan pembelajaran, pelaksanaan pembelajaran, serta masukan dan hasil diskusi dengan guru lain."
      }
    ]
  },
  {
    id: "seminar-ppg",
    judul: "Seminar PPG",
    icon: "presentation",
    kategori: "Semester 2",
    singkat:
      "Mata kuliah Seminar PPG ini membekali mahasiswa PPG melakukan refleksi berbasis data dan menerapkan komunikasi efektif dalam menyampaikan pemikiran/argumen atau karya inovasi. Sifat mata kuliah ini adalah praktis yang memberikan pengalaman belajar berupa mengidentifikasi diri, merefleksi pengalaman belajar selama mengikuti Program PPG, menyusun karya inovasi pendidikan, dan kegiatan seminar. Penilaian dalam mata kuliah ini meliputi: portofolio digital, partisipasi, dan seminar.",
    pertanyaan: [
      {
        judul: "Apa keterkaitan materi perkuliahan dengan peran saya sebagai calon guru?",
        jawaban:
          "Seminar PPG adalah mata kuliah yang memfasilitasi calon guru dalam meningkatkan kemampuan melakukan refleksi secara logis dan sistematis terhadap pengalaman belajar. Kemampuan refleksi tersebut memungkinkan calon guru untuk terus belajar dan berkembang, sehingga dapat memberikan pendidikan yang berkualitas dan siap menghadapi tantangan dunia pendidikan."
      },
      {
        judul: "Apa saja materi perkuliahan yang berbeda dari praktik yang saya lakukan selama ini?",
        jawaban:
          "Selama ini, saya cenderung langsung melanjutkan kegiatan berikutnya tanpa melakukan refleksi terhadap apa yang telah saya lakukan. Melalui mata kuliah Seminar PPG, saya memahami bahwa refleksi penting dilakukan untuk mengetahui kekurangan dan kelebihan dari pengalaman yang telah saya lalui."
      },
      {
        judul: "Apa saja konsep utama dan penting yang telah saya pelajari sebagai calon guru?",
        jawaban:
          "Konsep utama dan penting yang saya pelajari sebagai calon guru adalah pentingnya melakukan refleksi terhadap setiap pengalaman yang telah dilakukan. Saya memahami bahwa refleksi bukan hanya mengingat kembali kegiatan, tetapi juga menganalisis kelebihan, kekurangan, kendala, serta masukan yang diperoleh untuk menentukan perbaikan."
      },
      {
        judul: "Apa saja perubahan yang ingin saya lakukan setelah mendapatkan materi perkuliahan ini?",
        jawaban:
          "Perubahan yang ingin saya lakukan adalah membiasakan diri agar melakukan refleksi setelah melaksanakan kegiatan. Dengan begitu, saya bisa mengindentifikasi kekurangan, menerima masukan dan menjadikannya sebagai dasar untuk melakukan perbaikan."
      },
      {
        judul: "Mana saja artefak pembelajaran yang dapat saya jadikan bukti dukung hasil refleksi pengalaman belajar ini?",
        jawaban:
          "Artefak pembelajaran yang dapat saya jadikan bukti refleksi adalah website E-Portofolio."
      },
      {
        judul: "Mengapa artefak tersebut yang saya pilih?",
        jawaban:
          "Saya memilih artefak tersebut karena di dalamnya terdapat kumpulan hasil refleksi, identifikasi diri, karya inovasi pendidikan, dan dokumentasi."
      },
      {
        judul: "Bagian mana dari artefak ini yang mendukung hasil refleksi saya?",
        jawaban:
          "Bagian yang mendukung hasil refleksi saya adalah menu refleksi yang terdapat dalam website E-Portofolio."
      }
    ]
  }
];

// ============================================================
// REFLEKSI PERJALANAN PPG
// ============================================================

const REFLEKSI_PERJALANAN = {
  pengalamanBermakna:
    "Setelah mengikuti rangkaian Program Pendidikan Profesi Guru (PPG), saya menyadari bahwa pendidikan di Indonesia perlu terus dikembangkan agar mampu menjawab tantangan zaman dan memenuhi kebutuhan belajar murid yang beragam. Pendidikan tidak hanya berfokus pada pencapaian nilai akademik, tetapi juga pada pembentukan karakter, pengembangan keterampilan, penanaman nilai-nilai Pancasila, serta penguatan kemampuan berpikir kritis, kreatif, komunikasi, dan kolaboratif.",
  perubahanPemahaman:
    "Untuk menjadi guru yang profesional, saya akan terus meningkatkan kompetensi pedagogik, profesional, sosial, dan kepribadian. Saya menyadari bahwa menjadi guru merupakan proses belajar sepanjang hayat yang membutuhkan komitmen, kedisiplinan, keterbukaan terhadap perubahan, serta kemauan untuk terus memperbaiki diri.",
  rencanaPengembangan:
    "Sebagai bentuk komitmen setelah mengikuti program PPG, terdapat tiga hal penting yang akan saya lakukan ketika memulai karier sebagai guru.",
  rencanaTindakLanjut: [
    "Meningkatkan kompetensi guru profesional.",
    "Menjadi guru teladan.",
    "Menjadi pembelajar sepanjang hayat."
  ],
  kompetensi: [
    { nama: "Kompetensi Pedagogik", nilai: 90 },
    { nama: "Kompetensi Profesional", nilai: 85 },
    { nama: "Kompetensi Sosial", nilai: 88 },
    { nama: "Kompetensi Kepribadian", nilai: 92 },
    { nama: "Literasi Digital", nilai: 87 },
    { nama: "Kemampuan Reflektif", nilai: 90 },
    { nama: "Kemampuan Berkolaborasi", nilai: 89 },
    { nama: "Kemampuan Berinovasi", nilai: 86 }
  ],
  tantanganSolusi: [
    {
      tantangan: "Kesulitan mengelola kelas dengan banyak murid dan beragam karakter.",
      solusi: "Mempelajari dan menerapkan teknik pengelolaan kelas yang efektif, membangun kesepakatan kelas, dan memberikan perhatian individual."
    },
    {
      tantangan: "Keterbatasan waktu untuk menerapkan semua konsep yang dipelajari.",
      solusi: "Memprioritaskan pendekatan yang paling berdampak dan mengintegrasikan konsep-konsep pembelajaran secara efisien."
    },
    {
      tantangan: "Kesulitan menyesuaikan pembelajaran dengan kondisi murid yang beragam.",
      solusi: "Menerapkan pembelajaran berdiferensiasi dan menggunakan asesmen diagnostik untuk memetakan kebutuhan murid."
    },
    {
      tantangan: "Tekanan dari tuntutan kurikulum dan capaian akademik.",
      solusi: "Menyelaraskan pembelajaran bermakna dengan tuntutan kurikulum melalui perencanaan yang matang dan inovasi pembelajaran."
    },
    {
      tantangan: "Kurangnya kepercayaan diri saat pertama kali mengajar.",
      solusi: "Belajar melalui refleksi, menerima umpan balik positif, dan terus berlatih hingga menemukan gaya mengajar yang autentik."
    }
  ],
  komitmen:
    "Sebagai calon guru profesional, saya berkomitmen untuk: (1) Selalu belajar dan berkembang sepanjang hayat demi masa depan murid; (2) Menciptakan pembelajaran yang berpihak pada murid, inklusif, dan bermakna; (3) Menjadi teladan dalam sikap, karakter, dan integritas; (4) Berkolaborasi dengan semua pemangku kepentingan pendidikan; dan (5) Terus berinovasi menggunakan teknologi untuk meningkatkan kualitas pembelajaran."
};

// ============================================================
// KARYA INOVASI PENDIDIKAN
// ============================================================

const KARYA_INOVASI = [
  {
    id: "karya-1",
    judul: "Modul Matematika Kontekstual Berbasis Problematika Nyata",
    kategori: "Modul Ajar",
    thumbnail: "",
    deskripsi:
      "Modul ajar matematika yang menghubungkan konsep-konsep abstrak dengan permasalahan kontekstual yang dihadapi murid dalam kehidupan sehari-hari.",
    latarBelakang:
      "Banyak murid kesulitan memahami matematika karena materi disajikan terlalu abstrak dan terlepas dari konteks kehidupan nyata mereka.",
    masalah: "Rendahnya pemahaman konsep matematika dan motivasi belajar murid akibat pembelajaran yang terlalu abstrak dan tidak kontekstual.",
    tujuan: "Meningkatkan pemahaman konsep matematika dan motivasi belajar murid melalui pembelajaran yang kontekstual dan relevan dengan kehidupan nyata.",
    proses:
      "Dimulai dengan asesmen kebutuhan, analisis kurikulum, pengembangan konten kontekstual, pembuatan media visual, uji coba pada kelompok kecil, hingga revisi final.",
    inovasi:
      "Mengintegrasikan permasalahan nyata dari lingkungan sekitar murid ke dalam setiap topik matematika, dilengkapi media visual interaktif dan video pembelajaran.",
    dampak:
      "Pemahaman konsep murid meningkat 25% dan motivasi belajar lebih tinggi. Murid lebih aktif bertanya dan mendiskusikan materi.",
    hasil:
      "Modul ajar lengkap untuk 3 bab dengan studi kasus nyata, video pembelajaran, dan lembar kerja murid yang terintegrasi.",
    refleksi:
      "Saya belajar bahwa konteks yang dekat dengan kehidupan murid adalah kunci untuk membuat matematika menjadi bermakna dan menyenangkan.",
    dokumentasi: "",
    link: "#",
    file: ""
  },
  {
    id: "karya-2",
    judul: "Game Edukasi 'Matematika Petualang'",
    kategori: "Media Digital",
    thumbnail: "",
    deskripsi:
      "Game edukasi digital berbasis petualangan untuk memperkuat pemahaman konsep aljabar murid kelas VIII dengan cara yang menyenangkan.",
    latarBelakang:
      "Murid cepat bosan dengan latihan soal konvensional. Diperlukan media yang menyenangkan namun tetap efektif untuk pembelajaran.",
    masalah: "Rendahnya minat murid dalam mengerjakan latihan soal matematika sehingga penguasaan konsep menjadi lemah.",
    tujuan: "Meningkatkan minat dan penguasaan konsep aljabar murid melalui media pembelajaran yang interaktif dan menyenangkan.",
    proses:
      "Mendesain konsep game, membuat alur cerita, mengembangkan soal terintegrasi, menguji game pada murid, dan melakukan perbaikan berdasarkan umpan balik.",
    inovasi:
      "Game dengan sistem level, reward, dan feedback instan yang membuat murid belajar sambil bermain tanpa merasa tertekan.",
    dampak:
      "Minat belajar murid meningkat signifikan dan murid lebih antusias mengerjakan latihan soal dalam bentuk game.",
    hasil:
      "Aplikasi game edukasi yang dapat diakses melalui perangkat Android dan web.",
    refleksi:
      "Teknologi dapat menjadi jembatan luar biasa antara kesenangan dan pembelajaran jika dirancang dengan baik dan berpihak pada murid.",
    dokumentasi: "",
    link: "#",
    file: ""
  },
  {
    id: "karya-3",
    judul: "LKPD Berbasis Discovery Learning",
    kategori: "LKPD",
    thumbnail: "",
    deskripsi:
      "Lembar Kerja Peserta Didik (LKPD) yang dirancang dengan pendekatan discovery learning untuk mengembangkan keterampilan berpikir kritis murid.",
    latarBelakang:
      "LKPD konvensional hanya berisi soal-soal latihan tanpa membimbing murid untuk menemukan konsep secara mandiri.",
    masalah: "Murid cenderung pasif dalam pembelajaran karena LKPD tidak mendorong mereka untuk berpikir dan menemukan konsep sendiri.",
    tujuan: "Mengembangkan keterampilan berpikir kritis dan kemandirian belajar murid melalui LKPD berbasis discovery learning.",
    proses:
      "Merancang alur penemuan konsep, menentukan pertanyaan probing, membuat aktivitas bertahap, dan menguji efektivitas LKPD di kelas.",
    inovasi:
      "LKPD dengan alur penemuan konsep yang terstruktur namun memberikan kebebasan berpikir kepada murid.",
    dampak:
      "Murid lebih aktif dalam pembelajaran dan mampu menjelaskan konsep dengan bahasa mereka sendiri.",
    hasil:
      "Seri LKPD discovery learning untuk 5 topik matematika yang siap digunakan di kelas.",
    refleksi:
      "Memberikan struktur namun tetap memberikan ruang eksplorasi adalah keseimbangan yang baik dalam merancang LKPD.",
    dokumentasi: "",
    link: "#",
    file: ""
  },
{
    id: "karya-4",
    judul: "Simulator Gambar Teknik",
    kategori: "Media Pembelajaran",
    thumbnail: "12.jpeg",
    ringkas: true,
    deskripsi:
      "Media pembelajaran interaktif yang dirancang untuk membantu murid memahami dan mempraktikkan dasar-dasar gambar teknik secara digital.",
    latarBelakang:
      "Murid memiliki kecepatan dan gaya belajar yang berbeda. Video pembelajaran memungkinkan murid belajar sesuai ritme mereka.",
    masalah: "Keterbatasan waktu tatap muka membuat murid yang lambat memahami materi tertinggal.",
    tujuan: "Menyediakan media pembelajaran yang dapat diakses murid kapan pun untuk menyesuaikan kecepatan belajar masing-masing.",
    proses:
      "Merancang storyboard, merekam video pembelajaran, melakukan editing, dan mengunggah ke platform yang dapat diakses murid.",
    inovasi:
      "Video pembelajaran dengan animasi visual yang menarik dan penjelasan bertahap yang mudah diikuti murid.",
    dampak:
      "Murid dapat mengulang materi sesuka hati dan mengalami peningkatan pemahaman.",
    hasil:
      "Seri video pembelajaran untuk topik matematika yang diunggah di YouTube dan Google Classroom.",
    refleksi:
      "Media digital yang tepat dapat memperluas akses murid terhadap pembelajaran berkualitas tanpa terbatas waktu dan tempat.",
    dokumentasi: "",
    link: "Karya%20Inovasi%20Pendidikan/Karya%20I%20P/index.html",
    file: ""
  },
  {
    id: "karya-5",
    judul: "Program Bimbingan Numerasi 'Pintar Berhitung'",
    kategori: "Projek",
    thumbnail: "",
    deskripsi:
      "Program intervensi numerasi bagi murid yang membutuhkan penguatan dasar berhitung melalui kegiatan yang menyenangkan dan terukur.",
    latarBelakang:
      "Terdapat sejumlah murid yang mengalami kesulitan dasar berhitung dan membutuhkan pendampingan khusus di luar jam pelajaran.",
    masalah: "Kesenjangan kemampuan numerasi antar murid yang memerlukan intervensi khusus agar tidak semakin melebar.",
    tujuan: "Memberikan penguatan kemampuan numerasi dasar kepada murid melalui program pendampingan yang terstruktur dan menyenangkan.",
    proses:
      "Melakukan asesmen diagnostik, menyusun kelompok belajar, merancang kegiatan interaktif, melaksanakan sesi pendampingan, dan mengevaluasi perkembangan.",
    inovasi:
      "Program pendampingan dengan pendekatan gamifikasi dan tutor sebaya yang melibatkan murid hebat sebagai asisten.",
    dampak:
      "Kemampuan numerasi murid meningkat dan mereka menjadi lebih percaya diri dalam mengerjakan soal matematika.",
    hasil:
      "Laporan program, data perkembangan murid, dan dokumentasi kegiatan pendampingan.",
    refleksi:
      "Perhatian khusus kepada murid yang tertinggal adalah wujud nyata pembelajaran yang berpihak pada semua murid.",
    dokumentasi: "",
    link: "#",
    file: ""
  },
  {
    id: "karya-6",
    judul: "Platform Asesmen Digital Interaktif",
    kategori: "Teknologi Pendidikan",
    thumbnail: "",
    deskripsi:
      "Platform digital untuk melaksanakan asesmen formatif secara interaktif dengan umpan balik instan untuk murid dan guru.",
    latarBelakang:
      "Asesmen konvensional memakan waktu dan tidak memberikan umpan balik yang cepat kepada murid.",
    masalah: "Sulitnya melakukan asesmen formatif berkelanjutan dengan media konvensional karena keterbatasan waktu.",
    tujuan: "Mempermudah pelaksanaan asesmen formatif yang berkala dan memberikan umpan balik instan kepada murid.",
    proses:
      "Memilih platform yang sesuai, merancang bank soal, menguji coba, dan mengintegrasikan dengan pembelajaran harian.",
    inovasi:
      "Penggunaan teknologi untuk membuat asesmen menjadi bagian alami dari pembelajaran, bukan kegiatan terpisah.",
    dampak:
      "Guru dan murid mendapatkan data perkembangan belajar secara real-time untuk melakukan perbaikan bersama.",
    hasil:
      "Bank soal digital dan prosedur penggunaan platform asesmen di kelas.",
    refleksi:
      "Data dan teknologi dapat membantu guru mengambil keputusan pembelajaran yang lebih tepat dan berbasis bukti.",
    dokumentasi: "",
    link: "#",
    file: ""
  }
];

// ============================================================
// ARTEFAK PEMBELAJARAN
// ============================================================

const ARTEFAK = [
  { id: "a1", nama: "Modul Ajar - Aljabar Kontekstual", kategori: "Modul Ajar", mataKuliah: "Pembelajaran Mendalam dan Asesmen Dasar", semester: 1, tanggal: "2025-09-15", deskripsi: "Modul ajar lengkap dengan pendekatan kontekstual untuk materi aljabar kelas VIII.", file: "", thumbnail: "" },
  { id: "a2", nama: "LKPD Discovery Learning - Trigonometri", kategori: "LKPD", mataKuliah: "Pembelajaran Mendalam dan Asesmen Lanjut", semester: 2, tanggal: "2026-02-10", deskripsi: "Lembar kerja murid dengan pendekatan penemuan untuk materi trigonometri.", file: "", thumbnail: "" },
  { id: "a3", nama: "RPP Berdiferensiasi - Statistika", kategori: "Media Pembelajaran", mataKuliah: "PPL Terbimbing", semester: 1, tanggal: "2025-10-20", deskripsi: "Rencana pelaksanaan pembelajaran berdiferensiasi untuk materi statistika.", file: "", thumbnail: "" },
  { id: "a4", nama: "Presentasi Design Thinking", kategori: "Presentasi", mataKuliah: "Design Thinking", semester: 1, tanggal: "2025-11-05", deskripsi: "Slide presentasi proses design thinking dalam memecahkan masalah pembelajaran.", file: "", thumbnail: "" },
  { id: "a5", nama: "Jurnal Refleksi Minggu 1-8", kategori: "Jurnal Refleksi", mataKuliah: "PPL Mandiri", semester: 2, tanggal: "2026-03-01", deskripsi: "Kumpulan refleksi mingguan selama praktik mengajar mandiri.", file: "", thumbnail: "" },
  { id: "a6", nama: "Asesmen Formatif - Geometri", kategori: "Asesmen", mataKuliah: "Pembelajaran Mendalam dan Asesmen Lanjut", semester: 2, tanggal: "2026-02-25", deskripsi: "Instrumen asesmen formatif dengan rubrik penilaian untuk materi geometri.", file: "", thumbnail: "" },
  { id: "a7", nama: "Video Penjelasan Konsep Pecahan", kategori: "Media Pembelajaran", mataKuliah: "PPL Terbimbing", semester: 1, tanggal: "2025-10-12", deskripsi: "Video pembelajaran penjelasan konsep pecahan dengan animasi visual.", file: "", thumbnail: "" },
  { id: "a8", nama: "Bahan Ajar - Fungsi dan Relasi", kategori: "Bahan Ajar", mataKuliah: "Pembelajaran Mendalam dan Asesmen Dasar", semester: 1, tanggal: "2025-09-28", deskripsi: "Bahan ajar materi fungsi dan relasi yang disusun secara sistematis.", file: "", thumbnail: "" },
  { id: "a9", nama: "Sertifikat Seminar Nasional Pendidikan", kategori: "Sertifikat", mataKuliah: "Kegiatan PPG", semester: 2, tanggal: "2026-03-20", deskripsi: "Sertifikat sebagai peserta seminar nasional tentang inovasi pembelajaran.", file: "", thumbnail: "" },
  { id: "a10", nama: "Projek Kepemimpinan - Laporan", kategori: "Projek", mataKuliah: "Projek Kepemimpinan", semester: 2, tanggal: "2026-01-30", deskripsi: "Laporan lengkap projek kepemimpinan media pembelajaran digital.", file: "", thumbnail: "" },
  { id: "a11", nama: "Hasil Observasi Kelas", kategori: "Lembar Kerja", mataKuliah: "PPL Terbimbing", semester: 1, tanggal: "2025-09-20", deskripsi: "Lembar observasi pembelajaran yang dilakukan guru pamong.", file: "", thumbnail: "" },
  { id: "a12", nama: "Lembar Kerja Design Thinking", kategori: "Lembar Kerja", mataKuliah: "Design Thinking", semester: 1, tanggal: "2025-11-12", deskripsi: "Lembar kerja proses empathize hingga test pada design thinking.", file: "", thumbnail: "" }
];

// ============================================================
// DOKUMENTASI
// ============================================================

const DOKUMENTASI = [
  { id: "d1", judul: "Orientasi Akademik", kategori: "Perkuliahan", semester: 1, tanggal: "29 Januari 2026", lokasi: "Kampus Universitas", deskripsi: "Diskusi kelompok tentang filosofi pendidikan Ki Hajar Dewantara.", foto: "Dokumentasi 1.jpeg", video: "" },
  { id: "d10", judul: "Filosofi Pendidikan dan Pendidikan", kategori: "Kegiatan PPG", semester: 2, tanggal: "13 Maret 2026", lokasi: "Ruang Bimbingan Kampus", deskripsi: "Sesi bimbingan penyusunan karya inovasi bersama dosen pembimbing.", foto: "Dokumentasi 2.jpeg", video: "" },
  { id: "d8", judul: "Pemahaman Peserta Didik", kategori: "Kegiatan PPG", semester: 2, tanggal: "06 April 2026", lokasi: "Aula Utama Universitas", deskripsi: "Menghadiri seminar nasional tentang masa depan pendidikan Indonesia.", foto: "Dokumentasi 3.jpeg", video: "" },
  { id: "d2", judul: "Diklat Kepramukaan", kategori: "Perkuliahan", semester: 1, tanggal: "14 April 2026", lokasi: "Ruang Seminar", deskripsi: "Presentasi hasil prototype media pembelajaran berbasis design thinking.", foto: "Dokumentasi 4.jpeg", video: "" },
  { id: "d9", judul: "Design Thinking", kategori: "PPL", semester: 2, tanggal: "25 Mei 2026", lokasi: "SMA Negeri 1 Kota Harapan", deskripsi: "Praktik mengajar mandiri dengan tanggung jawab penuh di kelas.", foto: "Dokumentasi 5.jpeg", video: "" },
  { id: "d6", judul: "Pemahaman Peserta Didik", kategori: "PPL", semester: 2, tanggal: "25 Mei 2026", lokasi: "Ruang Guru SMA Negeri 1", deskripsi: "Sesi refleksi dan evaluasi praktik mengajar dengan guru pamong.", foto: "Dokumentasi 6.jpeg", video: "" },
  { id: "d4", judul: "Filosofi Pendidikan dan Pendidikan Nilai", kategori: "PPL", semester: 1, tanggal: "05 Juni 2026", lokasi: "SMA Negeri 1 Kota Harapan", deskripsi: "Observasi pembelajaran matematika kelas X bersama guru pamong.", foto: "Dokumentasi 7.jpeg", video: "" },
  { id: "d5", judul: "Growth Mindset", kategori: "PPL", semester: 1, tanggal: "06 Juni 2026", lokasi: "SMA Negeri 1 Kota Harapan", deskripsi: "Praktik mengajar materi aljabar menggunakan media pembelajaran interaktif.", foto: "Dokumentasi 8.jpeg", video: "" },
  { id: "d7", judul: "Design Thinking", kategori: "Kegiatan PPG", semester: 2, tanggal: "11 Juni 2026", lokasi: "Kampus Universitas", deskripsi: "Diskusi kelompok intensif penyusunan projek kepemimpinan.", foto: "Dokumentasi 9.jpeg", video: "" },
  { id: "d3", judul: "Diklat Wawasan Kebhinekaan", kategori: "Perkuliahan", semester: 2, tanggal: "25 Juni 2026", lokasi: "Laboratorium Komputer", deskripsi: "Pelatihan pembuatan media pembelajaran digital interaktif.", foto: "Dokumentasi 10.jpeg", video: "" },
  { id: "d11", judul: "Monev Praktik Pengalaman Lapangan", kategori: "Kegiatan PPG", semester: 2, tanggal: "10 September 2026", lokasi: "Aula Utama Universitas", deskripsi: "Momen perayaan kelulusan program PPG Prajabatan.", foto: "Dokumentasi 11.jpeg", video: "" }
];

// ============================================================
// TIMELINE PPG
// ============================================================

const TIMELINE_PPG = [
  { judul: "Awal PPG", deskripsi: "Orientasi dan pembekalan program PPG, pengenalan kurikulum dan aturan, serta pembentukan komunitas belajar.", ikon: "flag" },
  { judul: "Semester 1", deskripsi: "Pembelajaran mata kuliah fundamental: Filosofi Pendidikan, Pemahaman Peserta Didik, dan Pembelajaran Mendalam.", ikon: "book" },
  { judul: "PPL Terbimbing", deskripsi: "Praktik mengajar pertama di sekolah dengan bimbingan guru pamong dan dosen pembimbing.", ikon: "school" },
  { judul: "Semester 2", deskripsi: "Pembelajaran lanjutan: PSE, Asesmen Lanjut, Projek Kepemimpinan, dan Edupreneurship.", ikon: "book" },
  { judul: "PPL Mandiri", deskripsi: "Praktik mengajar mandiri dengan tanggung jawab penuh atas proses pembelajaran di kelas.", ikon: "briefcase" },
  { judul: "Karya Inovasi", deskripsi: "Pengembangan karya inovasi pendidikan yang memberikan solusi atas permasalahan pembelajaran nyata.", ikon: "bulb" },
  { judul: "Seminar PPG", deskripsi: "Penyajian dan presentasi karya inovasi dalam forum seminar untuk diuji dan mendapatkan masukan.", ikon: "presentation" },
  { judul: "Guru Profesional", deskripsi: "Menyelesaikan PPG dan siap menjadi guru profesional yang reflektif, inovatif, dan berpihak pada murid.", ikon: "graduate" }
];
