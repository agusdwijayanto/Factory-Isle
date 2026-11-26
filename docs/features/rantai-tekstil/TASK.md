# Rantai Tekstil — Task

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [STRUKTUR](STRUKTUR.md) · [PRD](PRD.md)

Fitur ini **sudah terimplementasi** di kode commit `9dcf6f0`. Task ini adalah verifikasi bahwa implementasi kode cocok dengan spesifikasi di STRUKTUR.md/PRD.md. Tidak ada kode baru yang ditulis.

## T-004.1 — Verifikasi item tekstil di ITEMS

Instruksi: Baca `js/03-data-items.js` bagian `ITEMS`. Konfirmasi 7 item tekstil ada dengan `name`, `color`, `price` yang benar:
- Cotton 25, Textiles 35, DyeCan 16, DyedTextiles 16, DyeFlower 6, Dye 8, TinCan 12
Kriteria lolos: Semua 7 item ada di `ITEMS` dengan nilai yang cocok STRUKTUR.md. Tidak ada item yang ditambahkan atau diubah.
Dependensi: —

## T-004.2 — Verifikasi mesin tekstil di MACHINES

Instruksi: Baca `js/03-data-items.js` bagian `MACHINES`. Konfirmasi:
- `textiles`: Textiles Machine, research $500 + 1 IronFrame + 4 Coil
- `mixer`: Mixing Machine, research $300
Kriteria lolos: Kedua mesin ada dengan deskripsi dan research yang cocok.
Dependensi: T-004.1

## T-004.3 — Verifikasi resep tekstil di RECIPES

Instruksi: Baca `js/03-data-items.js` bagian `RECIPES.textiles` dan `RECIPES.mixer`. Konfirmasi 4 resep:
- textiles: Cotton 50 → Textiles 5, 7s
- dyed: Textiles 5 + DyeCan 1 → DyedTextiles 5, 10s
- dye: DyeFlower 5 → Dye 1, 10s
- dyecan: Dye 1 + TinCan 1 → DyeCan 1, 10s
Kriteria lolos: Empat resep ada dengan in/out/n/secs yang cocok.
Dependensi: T-004.1

## T-004.4 — Verifikasi toko tekstil di SHOPS

Instruksi: Baca `js/03-data-items.js` bagian `SHOPS.textile` dan `SHOPS.pirate`. Konfirmasi:
- textile sell: Cotton 25, Textiles 35, DyeCan 16, DyedTextiles 16
- textile buy: Cotton 31, Textiles 50, DyeCan 24, DyedTextiles 24
- pirate sell: DyedTextiles 20
Kriteria lolos: Tabel harga cocok; tidak ada arbitrase (buy > sell per barang per toko).
Dependensi: T-004.1

## T-004.5 — Verifikasi posisi toko di SHOP_SPOTS

Instruksi: Baca `js/03-data-items.js` bagian `SHOP_SPOTS`. Konfirmasi textile di town (16, 12), minimal 3 petak dari toko lain, tidak di kolom rel 8/9, baris 2/6, kolom sungai 18.
Kriteria lolos: Posisi textile tercatat dan memenuhi aturan jarak.
Dependensi: T-004.4

## T-004.6 — Verifikasi panel Bangun di CATEGORIES

Instruksi: Baca `js/03-data-items.js` bagian `CATEGORIES` > `machines`. Konfirmasi Textiles Machine dan Mixing Machine terdaftar dengan nama, sub (research cost), dan warna.
Kriteria lolos: Kedua mesin muncul di panel Bangun kategori Machines.
Dependensi: T-004.2

## T-004.7 — Verifikasi mesin jalan otomatis (headless)

Instruksi: Jalankan headless test (`node ~/workspace/indotopia-cek-v49.js` atau setara). Konfirmasi mesin textiles/mixer bisa start saat input cukup, output tidak melebihi cap 30, nol error konsol.
Kriteria lolos: Headless test lolos 100%, nol error konsol, mesin tekstil tercatat dalam `S.machines`.
Dependensi: T-004.3

## Catatan

Semua task ini verifikasi-only. Implementasi sudah ada di kode; tidak ada file yang diubah. Setelah Tuanku menyetujui, T-004.1..T-004.7 dianggap selesai (verifikasi dilakukan) dan lanjut ke T-005 (Bronze Cannon).
