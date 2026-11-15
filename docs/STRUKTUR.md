# STRUKTUR Indotopia — versi kompleks (disetujui)

## 1. Konsep inti

- Game 2D web single-player: kamu bola slime biru, ketua desa monster,
  membangun desa dari dusun kecil menjadi kota.
- Inti mainnya: bangun kerjaan, atur warga, bertarung tiap malam, masuk dungeon.

## 2. Platform dan teknologi

- Browser, HTML5 Canvas + JS polos tanpa build step, live GitHub Pages,
  simpanan otomatis di browser, HP dan laptop.

## 3. Dunia

- Peta 48x32 petak: hutan, bukit tambang, area desa di tengah, pintu dungeon di bukit.
- Siklus siang dan malam, layar menggelap waktu malam.

## 4. Warga

- Semua warga bola slime, dibedakan warna dan ikon alat: penebang hijau,
  penambang abu-abu, petani kuning, tanpa job merah muda, pemain tetap biru.
- Warga datang kalau ada rumah kosong, diterima atau ditolak, tanpa nama
  dan tanpa keahlian bawaan.
- Warga diberi job yang bisa diganti kapan saja, bekerja sendiri, dan ikut
  melawan tiap malam.
- Tiap warga makan 3 roti per hari, roti habis berarti berhenti kerja, tidak mati.

## 5. Bangunan (6)

- Townhall: bangunan awal, naik tingkat dengan syarat jumlah warga dan bahan.
- Rumah: gubuk menjadi rumah menjadi rumah besar, menampung 1, 2, lalu 3 warga.
- Tambang: di bukit, penambang menghasilkan batu, kadang iron dan coal.
- Toolsmith: membuat senjata, armor, dan upgrade alat.
- Dapur: mengubah gandum menjadi roti, nanti membuka bahan makanan lain.
- Pasar: menukar bahan berlebih dengan bahan yang kurang.
- Semua bangunan CRUD: naik tingkat, dibongkar kembali setengah bahan,
  dilihat infonya lewat panel.

## 6. Petak bebas

- Jalan coklat gratis, dibuat dan dihapus bebas.
- Lahan petani 1x1 gratis, ditaruh bebas seperti jalan.
- Tanam pohon biaya 1 kayu, tanam di lahan biaya 1 makanan.

## 7. Senjata dan armor

- Rantai tingkat: wooden, stone, iron, gold, diamond yang langka.
- Senjata: pedang, bow, perisai. Armor mengurangi damage.
- Berlaku untuk pemain dan warga.

## 8. Malam dan monster

- Tiap malam gelombang monster datang, monster kalah menjatuhkan bahan acak.
- Pemain petarung utama, warga membantu. Kalah berarti bangun lagi di desa
  tanpa hukuman.
- Tanpa tembok, tanpa menara, tanpa barak: tidak ada pertahanan otomatis.

## 9. Dungeon

- Pintu di bukit, syarat masuk harus punya senjata dulu.
- Monster lebih kuat, drop lebih bagus, item acak, termasuk bahan langka
  untuk tingkat diamond.

## 10. Bahan

Kayu, batu, gandum, roti, iron, coal, gold, diamond — dari tambang,
dungeon, dan drop monster.

## 11. Rasa main

Prioritas utama: bunyi, partikel, angka melayang, getar layar, perayaan.

## 12. Aturan tetap

- Tidak ada bola hitam dan tidak ada bola putih.
- Roti memulihkan HP, untuk warga dan pemain.

## 13. Di luar versi kompleks

Mode online, musik latar, dekorasi, hewan, musim.

## 14. Kriteria lolos

Semua sistem bekerja, 15 menit main tanpa crash, dan Agus yang menilai
seru atau tidak.
