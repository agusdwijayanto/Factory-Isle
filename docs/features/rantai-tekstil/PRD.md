# Rantai Tekstil — PRD

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [STRUKTUR](STRUKTUR.md) · [TASK](TASK.md) · [GDD](../../STRUKTUR.md)

## 1. Tujuan produk

Pemain dapat memproduksi tekstil (kapas → kain → kain celup) dan menjualnya dengan margin lewat Toko Textile atau Kapal Bajak Laut. Melengkapi rantai produksi yang sudah ada (kayu, logam, batu) dengan rantai hasil hutan/pertanian.

## 2. Audiens

Pemain casual tycoon, browser HP sentuh + PC, bahasa Indonesia.

## 3. Platform dan input

Browser (HTML5 canvas, vanilla JS). Input sentuh (target 36-48px) dan PC. Tidak ada tombol HUD baru; mesin masuk ke panel Bangun yang sudah ada.

## 4. Sesi dan simpan

Free play, simpan otomatis. Rantai tekstil tidak menambahkan slot save baru. Simpan lama dimigrasikan aman (lihat `STRUKTUR.md` induk).

## 5. Engine

Vanilla JS + HTML5 canvas. 40 skrip di `index.html`. Mesin tekstil mengikuti pola mesin lain (`js/09-mesin.js`, `js/10-resep.js`).

## 6. Ruang lingkup

**In-scope (sudah diimplementasi):**
- Item: Cotton, Textiles, DyeCan, DyedTextiles, DyeFlower, Dye, TinCan
- Mesin: Textiles Machine, Mixing Machine (dengan research)
- Resep: 4 resep (textiles, dyed, dye, dyecan)
- Toko: Toko Textile (jual/beli), Kapal Bajak Laut (jual DyedTextiles)
- Panel Bangun: Textiles Machine, Mixing Machine masuk kategori Machines

**Out-of-scope:** bangunan tekstil sebagai placeable building, mesin cuci/pengering tambahan, dekorasi tekstil.

**Tidak ada di scope ini (backlog lain):** quest/NPC, fuel meter, irigasi, multi-save.

## 7. Referensi dan prinsip

Referensi: Factory Town Tycoon (Roblox). Prinsip ATM (Amati, Tiru, Modifikasi) — tidak jiplak mentah-mentah. Harga jual ikut harga PAPAN (keputusan Agus), tidak ada arbitrase beli di satu tempat jual untung di tempat lain tanpa produksi (aturan v30).

## 8. Pilar desain

1. **Setiap resep terdefinisi dengan angka yang dapat diuji.** Input, output, waktu, dan research ada di satu tempat (`RECIPES`, `MACHINES`).
2. **Tidak ada arbitrase.** Harga toko jual ke pemain (buy) selalu di atas harga tertinggi toko membeli (sell) per barang.
3. **Mesin jalan otomatis.** Tanpa dependensi keberadaan pemain di map.

## 9. Core loop

`Panen kapas → Textiles Machine → Textiles → Mixing Machine (DyeCan) → Textiles Machine → DyedTextiles → Jual di Toko Textile / Kapal Bajak Laut.`

## 10. Feature index (fitur ini saja)

| Fitur | Status | Lokasi kode |
|---|---|---|
| Item tekstil (7 item) | implemented | `js/03-data-items.js` ITEMS |
| Mesin Textiles Machine | implemented | `js/03-data-items.js` MACHINES.textiles |
| Mesin Mixing Machine | implemented | `js/03-data-items.js` MACHINES.mixer |
| Resep tekstil (4 resep) | implemented | `js/03-data-items.js` RECIPES.textiles, RECIPES.mixer |
| Toko Textile (jual/beli) | implemented | `js/03-data-items.js` SHOPS.textile |
| Kapal Bajak Laut (jual DyedTextiles) | implemented | `js/03-data-items.js` SHOPS.pirate |
| Panel Bangun (2 mesin) | implemented | `js/03-data-items.js` CATEGORIES |
| Headless test nol error | to verify | `TASK.md` |

## 11. Kebutuhan non-fungsi

- Headless test 100% lolos, nol error konsol.
- Setiap resep dapat dimulai (`canStart`) dengan input yang cukup.
- Output tidak melebihi cap 30 per batch.

## 12. Keputusan

| ID | Tanggal | Keputusan | Alternatif | Alasan |
|---|---|---|---|---|
| DT-001 | 2026-11-26 | Harga DyedTextiles di Kapal 20 (dulu 60) | biarkan 60 | Tutup lubang arbitrase (beli 24 di Textile, jual 60 di Kapal), komentar baris 117-120 |
| DT-002 | 2026-11-26 | Textile shop beli DyedTextiles 24, jual 16 | beda arah | sell = shop beli dari pemain; buy = shop jual ke pemain (aturan v30) |
| DT-003 | 2026-11-26 | Semua item tekstil bisa dijual (price tidak null) | beberapa null | Tidak ada komponen "hanya untuk craft" dalam rantai ini; semua punya harga jual |

## 13. Pertanyaan terbuka

- `[ASSUMPTION]` Apakah BronzeCannon (item terpisah, price 1500) dianggap bagian dari rantai tekstil atau fitur tersendiri? Di TASK.md dipisah jadi T-005 sendiri.
- Tidak ada asumsi lain; semua angka diambil dari kode.
