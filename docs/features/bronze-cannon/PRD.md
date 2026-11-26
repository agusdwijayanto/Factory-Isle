# Bronze Cannon — PRD

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [STRUKTUR](STRUKTUR.md) · [TASK](TASK.md) · [GDD](../../STRUKTUR.md)

## 1. Tujuan produk

Pemain dapat memproduksi Bronze Cannon (harga jual $1.500) melalui Construction Crafter dengan rantai empat tahap (Wheel → CannonMold → CannonBarrel → BronzeCannon). Menjadi produk akhir bernilai tinggi untuk dijual, melengkapi rantai logam yang sudah ada (Coil, Gear, Motor, IronBeam).

## 2. Audiens

Pemain casual tycoon, browser HP sentuh + PC, bahasa Indonesia.

## 3. Platform dan input

Browser (HTML5 canvas, vanilla JS). Input sentuh (target 36-48px) dan PC. Tidak ada tombol HUD baru.

## 4. Sesi dan simpan

Free play, simpan otomatis. Bronze Cannon tidak menambahkan slot save baru. Simpan lama dimigrasikan aman.

## 5. Engine

Vanilla JS + HTML5 canvas. Construction Crafter mengikuti pola mesin lain (`js/09-mesin.js`).

## 6. Ruang lingkup

**In-scope (sudah diimplementasi):**
- Item: BronzeCannon, CannonBarrel, CannonMold, Wheel (+ BronzeIngot, Coil, Gear, WoodFrame, IronFrame, Sand, Log sebagai bahan)
- Mesin: Construction Crafter (research $2000)
- Resep: wheel, mold, barrel, cannon (4 resep)
- Panel Bangun: Construction Crafter masuk kategori Machines

**Out-of-scope:** meriam sebagai placeable building / bangunan di grid, meriam sebagai senjata, upgrade meriam.

**Tidak ada di scope ini (backlog lain):** quest/NPC, fuel meter, irigasi, multi-save.

## 7. Referensi dan prinsip

Referensi: Factory Town Tycoon (Roblox). Prinsip ATM. Harga jual ikut harga PAPAN (keputusan Agus). `price: 1500` ditetapkan riset 4.2, tetap item jual termahal setelah Motor 225 (komentar baris 40-48).

## 8. Pilar desain

1. **Setiap komponen terdefinisi dengan angka yang dapat diuji.** Input, output, waktu, research ada di satu tempat.
2. **Tidak ada arbitrase.** Komponen tanpa `price` tidak bisa dijual, mencegah lubang arbitrase (pola Coil/Gear).
3. **Mesin jalan otomatis.** Tanpa dependensi keberadaan pemain.

## 9. Core loop

`Panen/papan/log → Crafter (Wheel) → Crafter (CannonMold) → Smelter (BronzeIngot) → Crafter (CannonBarrel) → Crafter (BronzeCannon) → Jual $1.500.`

## 10. Feature index (fitur ini saja)

| Fitur | Status | Lokasi kode |
|---|---|---|
| Item Bronze Cannon + komponen | implemented | `js/03-data-items.js` ITEMS |
| Mesin Construction Crafter | implemented | `js/03-data-items.js` MACHINES.crafter |
| Resep meriam (4 resep) | implemented | `js/03-data-items.js` RECIPES.crafter |
| Panel Bangun (1 mesin) | implemented | `js/03-data-items.js` CATEGORIES |
| Headless test nol error | to verify | `TASK.md` |

## 11. Kebutuhan non-fungsi

- Headless test 100% lolos, nol error konsol.
- Setiap resep dapat dimulai dengan input yang cukup.
- Output tidak melebihi cap 30 per batch.
- Komponen (Wheel, CannonMold, CannonBarrel) tidak bisa dijual (price null).

## 12. Keputusan

| ID | Tanggal | Keputusan | Alternatif | Alasan |
|---|---|---|---|---|
| BC-001 | 2026-11-26 | BronzeCannon price 1500, item jual bukan building | jadikan building | Komentar kode: "Cannon 1.500 = riset 4.2, tetap item jual termahal"; tidak ada di BUILD_COST, tidak bisa ditempatkan |
| BC-002 | 2026-11-26 | Komponen (Wheel, CannonMold, CannonBarrel) price null | beri harga | Pola sama Coil/Gear (tidak bisa dijual, mencegah arbitrase) |
| BC-003 | 2026-11-26 | Tidak ada toko yang jual/beli BronzeCannon | tambah ke toko | Hanya dijual ke Exchange dengan harga papan; tidak ada toko spesifik meriam |

## 13. Pertanyaan terbuka

- `[ASSUMPTION]` Apakah BronzeCannon harus bisa dijual ke toko spesifik (bukan hanya Exchange harga papan)? Belum ada di kode, ditandai asumsi.
- Tidak ada asumsi lain; semua angka diambil dari kode.
