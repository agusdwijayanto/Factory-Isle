# Bronze Cannon — Task

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [STRUKTUR](STRUKTUR.md) · [PRD](PRD.md)

Fitur ini **sudah terimplementasi** di kode commit `9dcf6f0`. Task ini adalah verifikasi bahwa implementasi kode cocok dengan spesifikasi di STRUKTUR.md/PRD.md. Tidak ada kode baru yang ditulis.

## T-005.1 — Verifikasi item Bronze Cannon di ITEMS

Instruksi: Baca `js/03-data-items.js` bagian `ITEMS`. Konfirmasi:
- BronzeCannon price 1500, color '#c98f2e'
- CannonMold, CannonBarrel, Wheel price null (tidak bisa dijual)
Kriteria lolos: Semua item ada dengan nilai yang cocok STRUKTUR.md.
Dependensi: —

## T-005.2 — Verifikasi mesin Construction Crafter di MACHINES

Instruksi: Baca `js/03-data-items.js` bagian `MACHINES.crafter`. Konfirmasi:
- `crafter`: Construction Crafter, research $2000, desc "Membuat roda, cetakan meriam, dan Bronze Cannon"
Kriteria lolos: Mesin ada dengan deskripsi dan research yang cocok.
Dependensi: T-005.1

## T-005.3 — Verifikasi resep meriam di RECIPES.crafter

Instruksi: Baca `js/03-data-items.js` bagian `RECIPES.crafter`. Konfirmasi 4 resep:
- wheel: Coil 1 + WoodFrame 1 + Gear 2 + Log 2 → Wheel 1, 20s
- mold: Sand 5 + IronFrame 1 → CannonMold 1, 30s
- barrel: BronzeIngot 5 + CannonMold 2 → CannonBarrel 1, 90s
- cannon: CannonBarrel 1 + Wheel 4 + WoodFrame 1 → BronzeCannon 1, 120s
Kriteria lolos: Empat resep ada dengan in/out/n/secs yang cocok.
Dependensi: T-005.1

## T-005.4 — Verifikasi resep BronzeIngot di RECIPES.smelter

Instruksi: Baca `js/03-data-items.js` bagian `RECIPES.smelter`. Konfirmasi resep bronze: Firelog 2 + CopperOre 4 + TinOre 1 → BronzeIngot 1, 20s.
Kriteria lolos: Resep bronze ada; BronzeIngot tersedia sebagai bahan CannonBarrel.
Dependensi: T-005.1

## T-005.5 — Verifikasi komponen tidak bisa dijual (price null)

Instruksi: Konfirmasi Wheel, CannonMold, CannonBarrel, Coil, Gear memiliki `price: null` di `ITEMS`. Tidak ada toko di `SHOPS` yang membeli atau menjual komponen ini.
Kriteria lolos: Semua komponen price null; tidak ada entri SHOPS untuk komponen ini. Mencegah arbitrase.
Dependensi: T-005.1

## T-005.6 — Verifikasi panel Bangun di CATEGORIES

Instruksi: Baca `js/03-data-items.js` bagian `CATEGORIES` > `machines`. Konfirmasi Construction Crafter terdaftar dengan nama, sub (Research $2.000), dan warna.
Kriteria lolos: Mesin muncul di panel Bangun kategori Machines.
Dependensi: T-005.2

## T-005.7 — Verifikasi mesin jalan otomatis (headless)

Instruksi: Jalankan headless test. Konfirmasi Construction Crafter bisa start saat input cukup (termasuk resep multi-tahap wheel→mold→barrel→cannon), output tidak melebihi cap 30, nol error konsol.
Kriteria lolos: Headless test lolos 100%, nol error konsol, mesin crafter tercatat dalam `S.machines`.
Dependensi: T-005.3

## Catatan

Semua task ini verifikasi-only. Implementasi sudah ada di kode; tidak ada file yang diubah. Setelah Tuanku menyetujui, T-005.1..T-005.7 dianggap selesai (verifikasi dilakukan).
