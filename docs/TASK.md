# Task Indotopia — versi kompleks (disetujui)

Berurutan, dibangun di atas kode versi tes, tiap task lolos sebelum lanjut.

## Task 1 — Fondasi versi kompleks

- Bahan baru masuk penghitung: gandum, roti, iron, coal, gold, diamond.
  Model bangunan naik tingkat dan simpanan naik versi.
- Lolos: game versi tes tetap jalan utuh, bahan baru tampil di HUD,
  simpanan lama tidak merusak game.

## Task 2 — Warga: datang, terima, job, kerja (butuh Task 1)

- Warga datang 1 per hari kalau ada rumah kosong, pemberitahuan terima atau
  tolak, panel job, warga bekerja sendiri, makan 3 roti per hari, berhenti
  kerja kalau roti habis.
- Lolos: warga datang, bekerja, hasil masuk penghitung, makan, dan berhenti
  saat roti habis.

## Task 3 — Rumah naik tingkat dan panel CRUD (butuh Task 1)

- Gubuk menjadi rumah menjadi rumah besar, biaya dan tampungan sesuai PRD,
  bongkar kembali setengah bahan, panel info waktu diklik.
- Lolos: naik tingkat, bongkar, dan panel bekerja sesuai PRD.

## Task 4 — Petak bebas dan tanam pohon (butuh Task 1)

- Jalan gratis, lahan petani 1x1 gratis, tanam pohon biaya 1 kayu, tanam di
  lahan biaya 1 makanan menjadi panen 2 makanan.
- Lolos: semua petak bisa dibuat dan dihapus bebas, ekonomi tanam sesuai PRD.

## Task 5 — Townhall naik tingkat dan kunci bangunan (butuh Task 2 dan 3)

- Syarat tingkat 2 dan 3 sesuai PRD, Toolsmith, Dapur, dan Pasar terkunci
  sampai tingkat 2, kerajinan gold dan diamond terkunci sampai tingkat 3.
- Lolos: syarat diperiksa benar, kunci membuka tepat waktu.

## Task 6 — Tambang, Dapur, Pasar (butuh Task 5)

- Tambang di bukit dengan penambang menghasilkan batu, iron, dan coal.
  Dapur mengubah gandum menjadi roti. Pasar menukar bahan.
- Lolos: produksi, pengolahan, dan tukar bahan bekerja sesuai PRD.

## Task 7 — Toolsmith: senjata, armor, upgrade alat (butuh Task 5 dan 6)

- Kerajinan 5 tingkat untuk pedang, bow, perisai, armor, kapak, dan beliung,
  dengan biaya dan angka sesuai PRD.
- Lolos: semua kerajinan bisa dibuat, angka damage dan armor benar.

## Task 8 — Malam: warga melawan, drop acak, roti menyembuhkan (butuh Task 2 dan 7)

- Warga ikut melawan gelombang malam, monster menjatuhkan bahan acak sesuai
  tabel PRD, makan roti memulihkan HP.
- Lolos: warga bertarung, drop keluar, roti menyembuhkan.

## Task 9 — Dungeon (butuh Task 7 dan 8)

- Pintu di bukit, syarat senjata, 3 lantai dengan monster makin kuat, peti
  item acak, jalan keluar kapan saja.
- Lolos: syarat diperiksa, 3 lantai bisa dimasuki dan ditinggalkan, peti
  memberi item.

## Task 10 — Rasa main dan HUD (butuh semua task sistem)

- Bunyi, partikel, dan angka melayang untuk semua aksi baru, perayaan untuk
  warga pertama, senjata pertama, dan townhall naik tingkat.
- Lolos: tiap aksi baru terasa, HUD selalu benar.

## Task 11 — Tes loop penuh (butuh semua task di atas)

- Siklus penuh: terima warga, beri job, panen otomatis, makan roti, naik
  tingkat, buat senjata, lawan gelombang malam, masuk dungeon dan keluar,
  15 menit di HP dan laptop.
- Lolos: tanpa crash, tanpa error konsol, semua kriteria PRD terpenuhi.

## Task 12 — Push dan link live (butuh Task 11)

- Push ke repo Indotopia (menggantikan game tycoon sebagai commit baru di atas
  riwayat yang ada, tanpa force-push), GitHub Pages aktif, kirim link live.
- Lolos: link live terbuka dan bisa dimainkan, game.js live sama persis
  dengan lokal.
