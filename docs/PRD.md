# PRD Indotopia — versi kompleks (disetujui)

Angka yang ditandai "angka awal" adalah angka awal untuk dites, bukan angka
final, dan boleh diubah sesudah dicoba. Angka lainnya wajib persis.

## Tujuan

- Game desa slime yang lengkap: membangun, mengatur warga, bertarung,
  dan masuk dungeon, dalam satu putaran main yang utuh.
- Keputusan lanjut ke konten berikutnya diambil sesudah Agus mencoba versi ini.

## Pengguna

- Agus sendiri sebagai pemain, main di HP dan laptop.

## Ruang lingkup

### Dasar (dari versi tes, tetap berlaku)

- Peta 48x32 petak, TILE 32, siang 3 menit, malam 1,5 menit, layar menggelap waktu malam.
- Karakter bola biru, gerak 4 arah, kecepatan 4 petak per detik, HP 100, animasi jalan.
- Tebang 3 pukulan menjadi 3 kayu, pohon tumbuh lagi 60 detik.
- Tambang 4 pukulan menjadi 2 batu, muncul lagi 90 detik.
- Tanam tumbuh 30 detik, panen 2 makanan.
- Kalah berarti bangun lagi di balai desa dengan HP penuh, tanpa hukuman.
- Rasa main: bunyi, partikel, angka melayang, getar layar, perayaan.

### Warga

- Warga datang 1 per hari kalau ada rumah kosong (angka awal), diterima atau
  ditolak lewat pemberitahuan, tanpa nama dan tanpa keahlian.
- Job penebang, penambang, petani, bisa diganti kapan saja lewat panel warga.
- Warga bekerja sendiri dengan angka yang sama seperti pemain, 1 pukulan per
  detik (angka awal), hasil masuk penghitung. Target yang sedang dikerjakan
  warga lain tidak diambil: tiap warga mencari pohon, batu, atau petak lain
  dan berpencar.
- Tiap warga makan 3 roti per hari, roti habis berarti berhenti kerja, tidak mati.
  Tombol Beri Roti di panel warga membuat warga kenyang seketika (1 roti).
  Panel townhall punya tombol Beri Roti Semua Warga (1 roti per warga
  yang lapar atau luka).
- Warga ikut melawan tiap malam, HP 50 (angka awal), kalah berarti bangun lagi
  keesokan pagi di rumahnya. Malam tiba warga kumpul dulu di townhall dan
  menunggu; mereka maju serang bareng begitu pemain memukul monster duluan.

### Rumah dan bangunan

- Gubuk 2x2 petak, biaya 20 kayu, selesai 5 detik, menampung 1 warga.
- Naik tingkat menjadi rumah biaya 40 kayu dan 20 batu (angka awal), menampung
  2 warga. Menjadi rumah besar biaya 80 kayu dan 40 batu (angka awal),
  menampung 3 warga.
- Bongkar bangunan mengembalikan setengah bahan. Panel info waktu bangunan
  diklik: nama, tingkat, tombol naik tingkat dan bongkar.
- Townhall tingkat 1 sejak awal. Tingkat 2 butuh 5 warga dan 100 kayu dan
  50 batu, membuka Toolsmith dan Pasar. Dapur bisa dibangun sejak awal
  (townhall tingkat 1) supaya rantai roti jalan sebelum tingkat 2.
  Tingkat 3 butuh 10 warga dan
  200 kayu dan 100 batu dan 20 iron (angka awal), membuka kerajinan gold dan diamond.
- Tambang 2x2 petak di bukit, biaya 30 kayu dan 10 batu (angka awal),
  penambang di sana menghasilkan 1 batu per 10 detik, 1 dari 5 hasil adalah
  iron atau coal acak (angka awal).
- Toolsmith biaya 40 kayu dan 20 batu (angka awal). Dapur biaya 30 kayu dan
  10 batu (angka awal), mengubah 1 gandum menjadi 1 roti dalam 5 detik
  (angka awal), tombol borongan 1, 10, dan semua gandum. Pasar biaya 20 kayu (angka awal), tukar 2 bahan menjadi
  1 bahan lain (angka awal), tombol borongan 1x, 10x, dan semua.

### Petak bebas

- Jalan coklat gratis, dibuat dan dihapus bebas. Lahan petani 1x1 gratis,
  ditaruh bebas satu per satu seperti jalan.
- Tanam pohon biaya 1 kayu, tumbuh 60 detik, panen 3 kayu.
- Tanam di lahan biaya 1 makanan, panen 2 makanan.

### Senjata, armor, dan alat

- Rantai tingkat: wooden, stone, iron, gold, diamond yang langka.
- Kerusakan pedang (angka awal): tangan kosong 10, wooden 15, stone 25,
  iron 40, gold 60, diamond 100. Bow menyerang dari 4 petak (angka awal),
  perisai mengurangi damage 20% (angka awal).
- Armor mengurangi damage (angka awal): wooden 10%, stone 20%, iron 30%,
  gold 40%, diamond 50%.
- Biaya kerajinan mengikuti bahan tingkatnya (angka awal): wooden dari kayu,
  stone dari kayu dan batu, iron dari iron dan coal, gold dari gold,
  diamond dari diamond.
- Gold didapat dari peti dungeon dan drop monster langka, diamond hanya dari
  lantai dungeon terdalam (angka awal).
- Kapak dan beliung naik tingkat di Toolsmith dengan rantai yang sama,
  mengurangi pukulan yang dibutuhkan (angka awal).

### Malam dan monster

- Tiap malam gelombang monster datang, malam pertama 3, tiap malam berikutnya
  tambah 2, tanpa batas. Monster HP 30, serangan 10.
- Monster kalah menjatuhkan bahan acak: 50% kayu/batu/makanan, 30% iron atau
  coal, 15% 2 sampai 3 bahan, 5% bahan langka (angka awal).
- Roti memulihkan 25 HP (angka awal), untuk pemain dan warga.

### Dungeon

- Pintu di bukit, syarat masuk harus punya senjata dulu, 3 lantai (angka awal).
- Lantai 1 butuh senjata wooden, monster HP 50 serangan 15. Lantai 2 butuh
  senjata stone, monster HP 100 serangan 25. Lantai 3 butuh senjata iron,
  monster HP 200 serangan 40 (angka awal).
- Tiap lantai ada peti berisi item acak, dan jalan keluar kembali ke desa
  kapan saja.

## Di luar lingkup

Mode online, musik latar, dekorasi, hewan, musim, tembok, menara, barak.

## Kriteria sukses dan tes

- Semua sistem di atas bekerja, 15 menit main tanpa crash di HP dan laptop,
  tanpa error konsol.
- Siklus penuh teruji: terima warga, beri job, panen otomatis masuk, makan
  roti, naik tingkat rumah, buat senjata, lawan gelombang malam, masuk
  dungeon dan keluar lagi.
- Penilaian akhir: Agus yang menentukan seru atau tidak, dan bagian mana
  yang tidak enak.
