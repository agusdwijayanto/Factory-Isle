# Bronze Cannon — Struktur Fitur

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [GDD](../../STRUKTUR.md) · [PRD](PRD.md) · [TASK](TASK.md)

Satu fakta, satu rumah. Semua angka diambil langsung dari `js/03-data-items.js` (commit `9dcf6f0`). Tidak ada asumsi; diubah hanya jika kode berubah.

## Ringkasan

Bronze Cannon adalah item craftable (bukan bangunan placeable) yang dibuat di Construction Crafter melalui rantai: Wheel → CannonMold → CannonBarrel → BronzeCannon. Dijual seharga $1.500 (item jual termahal setelah Motor $225). Digunakan sebagai produk akhir rantai meriam, tidak diletakkan sebagai bangunan di grid.

## Item yang terlibat

| Item | Price | Sumber | Keterangan |
|---|---|---|---|
| `Wheel` | null | Construction Crafter | komponen, tidak bisa dijual |
| `CannonMold` | null | Construction Crafter | komponen, tidak bisa dijual |
| `CannonBarrel` | null | Construction Crafter | komponen, tidak bisa dijual |
| `BronzeCannon` | 1500 | Construction Crafter | produk akhir, dijual |
| `BronzeIngot` | 50 | Smelter | bahan baku CannonBarrel |
| `Coil` | null | Blacksmith | komponen Wheel (tidak bisa dijual) |
| `Gear` | null | Blacksmith | komponen Wheel (tidak bisa dijual) |
| `WoodFrame` | 47 | Carpenter | bahan Wheel + CannonBarrel |
| `IronFrame` | 82 | Blacksmith | bahan CannonMold |
| `Sand` | 4 | panen pasir (sekop) | bahan CannonMold |
| `Log` | 7 | pohon | bahan Wheel |

Item tanpa `price` (Wheel, CannonMold, CannonBarrel, Coil, Gear) = tidak bisa dijual, hanya komponen crafting. Pola sama dengan Coil/Gear yang sudah ada.

## Mesin

| Mesin | Research | Deskripsi |
|---|---|---|
| `crafter` (Construction Crafter) | $2000 | Membuat roda, cetakan meriam, dan Bronze Cannon |

Ada di `CATEGORIES` > `machines` baris 352.

## Resep

Semua di `RECIPES.crafter`, `js/03-data-items.js` baris 275-284:
- `wheel`: `Coil: 1 + WoodFrame: 1 + Gear: 2 + Log: 2` → `Wheel: 1`, 20 detik
- `mold`: `Sand: 5 + IronFrame: 1` → `CannonMold: 1`, 30 detik
- `barrel`: `BronzeIngot: 5 + CannonMold: 2` → `CannonBarrel: 1`, 90 detik
- `cannon`: `CannonBarrel: 1 + Wheel: 4 + WoodFrame: 1` → `BronzeCannon: 1`, 120 detik

Bahan tambahan (dari mesin lain):
- `BronzeIngot`: `Firelog: 2 + CopperOre: 4 + TinOre: 1` → `BronzeIngot: 1`, 20 detik [Smelter, baris 228]

Semua mesin otomatis (`js/09-mesin.js`): cap output 30, batas item aktif 150.

## Toko

BronzeCannon **tidak ada di SHOPS** — tidak dibeli/dijual oleh toko apa pun. Harga `price: 1500` di ITEMS adalah harga jual ke Exchange (harga papan) jika pemain menjualnya, atau sebagai referensi nilai item. Tidak ada toko yang menjual BronzeCannon ke pemain.

## Alur data

`ITEMS` → `RECIPES.crafter` → `MACHINES.crafter` → `CATEGORIES` (panel Bangun) → `js/09-mesin.js` eksekusi. BronzeIngot berasal dari Smelter (`RECIPES.smelter` bronze).

## Status

**Implemented.** Item, resep, mesin sudah ada di kode commit `9dcf6f0`. Tidak ada kode baru yang perlu ditambahkan.

## Blokir

Tidak ada. Semua komponen tersedia di kode.
