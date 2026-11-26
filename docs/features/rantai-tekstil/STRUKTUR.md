# Rantai Tekstil — Struktur Fitur

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [GDD](../../STRUKTUR.md) · [PRD](PRD.md) · [TASK](TASK.md)

Satu fakta, satu rumah. Semua angka di bawah diambil langsung dari `js/03-data-items.js` (commit `9dcf6f0`). Tidak ada asumsi; diubah hanya jika kode berubah.

## Ringkasan

Rantai produksi tekstil: kapas dipanen → olah di Textiles Machine jadi Textiles → dicelup di Mixing Machine jadi DyeCan → dicampur jadi DyedTextiles → dijual di Toko Textile atau Kapal Bajak Laut. Pemain membangun Textiles Machine dan Mixing Machine setelah riset.

## Item yang terlibat

| Item | Price | Sumber | Keterangan |
|---|---|---|---|
| `Cotton` | 25 | panen kapas (lahan) | bahan baku rantai |
| `Textiles` | 35 | Textiles Machine | hasil olah kapas |
| `DyeCan` | 16 | Mixing Machine | bumbu pewarna |
| `DyedTextiles` | 16 | Textiles Machine | hasil akhir, dijual premium |
| `DyeFlower` | 6 | tanaman liar (hutan) | bahan baku pewarna |
| `Dye` | 8 | Mixing Machine | hasil olah DyeFlower |
| `TinCan` | 12 | Blacksmith (resep turunan) | bahan pembungkus DyeCan |

Item tanpa `price` (tidak bisa dijual): tidak ada dalam rantai ini — semua item di atas bisa dijual.

## Mesin

| Mesin | Research | Deskripsi |
|---|---|---|
| `textiles` (Textiles Machine) | $500 + 1 IronFrame + 4 Coil | Kapas jadi kain, kain + Dye Can jadi kain celup |
| `mixer` (Mixing Machine) | $300 | Dye Flower jadi Dye, lalu Dye + Tin Can jadi Dye Can |

Kedua mesin ada di `CATEGORIES` > `machines` di `js/03-data-items.js` baris 348, 353.

## Resep

Semua di `RECIPES.textiles` dan `RECIPES.mixer`, `js/03-data-items.js`:

**Textiles Machine** (`RECIPES.textiles`, baris 259-262):
- `textiles`: `Cotton: 50` → `Textiles: 5`, 7 detik
- `dyed`: `Textiles: 5 + DyeCan: 1` → `DyedTextiles: 5`, 10 detik

**Mixing Machine** (`RECIPES.mixer`, baris 287-290):
- `dye`: `DyeFlower: 5` → `Dye: 1`, 10 detik
- `dyecan`: `Dye: 1 + TinCan: 1` → `DyeCan: 1`, 10 detik

Semua mesin otomatis (`js/09-mesin.js`): jalan walau pemain di map lain, cap output 30, batas item aktif 150.

## Toko

**Toko Textile** (`SHOPS.textile`, baris 107):
- Jual dari pemain (sell): Cotton 25, Textiles 35, DyeCan 16, DyedTextiles 16
- Jual ke pemain (buy): Cotton 31, Textiles 50, DyeCan 24, DyedTextiles 24

**Kapal Bajak Laut** (`SHOPS.pirate`, baris 122): jual DyedTextiles 20 ke pemain (hanya jual, tidak beli).

Posisi toko di `SHOP_SPOTS` (baris 130-140): textile di town (16, 12).

## Alur data

`js/03-data-items.js` → `ITEMS` (definisi item + harga) → `RECIPES` (resep per mesin) → `MACHINES` (definisi mesin + research) → `CATEGORIES` (tampilan panel Bangun) → `SHOPS` (harga jual/beli) → `SHOP_SPOTS` (posisi toko). `js/09-mesin.js` mengeksekusi resep otomatis.

## Status

**Implemented.** Item, resep, mesin, toko, posisi toko sudah ada di kode commit `9dcf6f0`. Tidak ada kode baru yang perlu ditambahkan untuk fitur ini. Dokumen ini mencatat apa yang sudah ada; TASK.md mencakup verifikasi.

## Blokir

Tidak ada. Semua komponen rantai tekstil tersedia di kode.
