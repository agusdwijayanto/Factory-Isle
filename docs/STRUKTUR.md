# STRUKTUR — Factory Isle

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [ROADMAP](../ROADMAP.md) · [PRD](PRD.md) · [TASK](TASK.md)

Dokumen ini mencatat struktur game dan kode secara utuh, satu fakta di satu tempat. Semua detail diambil dari `ROADMAP.md`, `index.html`, dan berkas `js/` di repo (commit `9dcf6f0`, live `?v=52`). Tidak ada asumsi di luar repo; diubah hanya jika kode berubah.

## Ringkasan game

Game tycoon pabrik single-player di browser, tampilan isometrik 2.5D ala TheoTown, terinspirasi Factory Town Tycoon (Roblox). Bahasa Indonesia. Pemain memulai dengan modal $50 + kapak, lalu panen, olah rantai mesin, jual, beli mesin/resep. Prinsip ATM (Amati, Tiru, Modifikasi) — tidak jiplak mentah-mentah.

## Struktur kode (48 skrip)

Dimuat oleh `index.html` dalam urutan ini. Setiap baris: berkas → peran.

| Berkas | Peran |
|---|---|
| `js/01-core.js` | Inisialisasi game, loop utama, state global |
| `js/02-iso.js` | Proyeksi isometrik, konversi koordinat |
| `js/03-data-items.js` | Daftar item, resep, harga, lokasi toko |
| `js/03-data-tutorial.js` | Teks tutorial dan bantuan |
| `js/03-data-maps.js` | `MAP_NAMES`, `MAP_EXITS`, konfigurasi map |
| `js/03-map-kota.js` | Definisi map Kota (Mayor, 6 toko, stasiun) |
| `js/03-map-padang.js` | Definisi map Padang Rumput |
| `js/03-map-hutan.js` | Definisi map Hutan Lebat |
| `js/03-map-hutan2.js` | Definisi map Hutan Kapas |
| `js/03-map-gunung-es.js` | Definisi map Gunung Es & Tambang |
| `js/03-map-pelabuhan.js` | Definisi map Teluk Pasir |
| `js/03-map-lahan.js` | Definisi map Lahanmu (pemain) |
| `js/04-atlas.js` | Pemuat sprite atlas (`?v=52`) |
| `js/05-render-core.js` | Renderisasi inti |
| `js/05-paint-helpers.js` | Helper pemetaan sprite |
| `js/05-paint-tanah.js` | Sprite tanah / jalan |
| `js/05-paint-node.js` | Sprite node (tiga, bijih, wagon, tenda) |
| `js/05-paint-mesin.js` | Sprite mesin |
| `js/05-paint-alat.js` | Sprite alat |
| `js/05-paint-tempat.js` | Sprite bangunan toko / stasiun / kereta |
| `js/05-paint-pemain.js` | Sprite pemain |
| `js/05-paint-item.js` | Sprite item |
| `js/05-paint-v36.js` | Sprite legacy v36 |
| `js/05-render-overlay.js` | Overlay render |
| `js/05-render.js` | Penggabungan render |
| `js/06-input.js` | Input sentuh + PC (WASD, panah, R, Esc) |
| `js/07-pemain.js` | State pemain, posisi, tas, interaksi |
| `js/08-gerak.js` | Gerakan, BFS, trigger petak (plotpad, gerbang, jembatan) |
| `js/09-mesin.js` | Logika mesin, proses otomatis |
| `js/10-resep.js` | Resep crafting |
| `js/11-ekonomi.js` | Uang, harga jual/beli, toko |
| `js/12-simpan.js` | Simpan otomatis, migrasi simpan lama, `plotStale`/`townStale`/`forestStale` |
| `js/13-ui-core.js` | Inti panel UI |
| `js/13-ui-build.js` | Panel Bangun |
| `js/13-ui-inspect.js` | Panel Periksa |
| `js/13-ui-storage.js` | Panel Penyimpanan |
| `js/13-ui-shop.js` | Panel Toko |
| `js/13-ui-train.js` | Panel Kereta |
| `js/13-ui-tas.js` | Panel Tas |
| `js/13-ui-mayor.js` | Panel Mayor / Lahan |
| `js/13-ui-plot.js` | Panel Plot / Save & Wagon |
| `js/13-ui-badge.js` | Panel Badge |
| `js/13-ui-book.js` | Panel Book / Riwayat Versi |
| `js/13-ui-tick.js` | Tick UI |
| `js/13-ui.js` | Penggabungan UI (`?v=53`) |
| `js/14-main.js` | Titik masuk permainan (`?v=53`) |
| `js/15-sound.js` | SFX Howler.js (click, craft, sell, walk) (`?v=54`) |
| `js/15-tutorial.js` | Sistem tutorial + localStorage (`?v=54`) |

## Asset dan versi

- Sprite atlas: `?v=52` (`js/04-atlas.js`, `index.html`) — uji luber 147/147 sprite, nol luber.
- `style.css`: `?v=53`; `js/13-ui.js`: `?v=53`; `js/14-main.js`: `?v=53`; `js/15-sound.js`, `js/15-tutorial.js`: `?v=54`.
- Bedanya versi aset vs versi file sengaja: file yang diubah v53/v54 tidak ikut bump atlas karena hanya `trainCar` yang baru butuh invalidasi cache (`?v=52`).

## Peta dan dunia

Satu rantai 8 map dari utara ke selatan. Tiap map kotak 20x20 (400 petak). Rel di kolom x=9 di semua map. Sungai di kolom 1, mengalir utara ke selatan, muara di teluk Teluk Pasir. Jalan utama kolom x=8 tembus semua map.

| Urutan | Map | Khasiat |
|---|---|---|
| 1 | Gunung Es & Tambang | Terminus utara, palang (9,6), bijih Iron/Copper/Tin/Gold + batu di salju |
| 2 | Padang Rumput | — |
| 3 | Hutan Lebat | Pohon Oak + kapas, stasiun (pindah ke sisi timur rel 10,7 di v51) |
| 4 | Hutan Kapas | Pohon kapas |
| 5 | Lahanmu | Lahan pemain, 16x12 → besar 24x16 lewat Mayor, gerbang atas/bawah |
| 6 | Kota | Mayor, 6 toko, stasiun (10,7), jalan baris 6 buntu ujung |
| 7 | Padang Rumput Selatan | — |
| 8 | Teluk Pasir | Terminus selatan, palang (9,7), desa gurun, kapal bajak laut air (10,18), stasiun (8,6) |

Lahan dicapai dari Kota lewat jembatan utara (8,0) ATAU petak putih di Padang Rumput (4,5) + papan PLOT (5,5). Keluar lewat gerbang bawah (8,h-1) ke Kota atau atas (8,0) ke Hutan Kapas.

## Panel UI (13 panel)

HUD (burger, nama map, uang) + burger menu (Plot, Badge, Book, Pengaturan, Bantuan, Admin, Tutup) + Build, Inspect, Storage, Shop ("Toko — Jual / Beli"), Train ("Kereta 130"), Mayor ("Lahan"), Plot ("Save & Wagon"), Badge, Book ("Riwayat Versi"), Tas, Settings, Help, Admin, Tutorial.

Target sentuh 36-48px. HUD tetap minimal, tanpa tombol HUD baru.

## Alur data dan simpan

Simpan otomatis. Simpan lama (v2/v48) dimigrasikan di ukuran baru di `js/12-simpan.js`: uang, tas, mesin, ekspansi, perkakas, badge, tutorial tetap. Migrasi verifikasi:
- v48 (uang 4242, 20x14, map `mountain`) → lolos.
- v49 (wagonShop di lahan) → lolos.
- v50 (kereta hutan 14,9 + toko lama) → lolos.
- v51 (Mayor/salon/toko/petak putih/stasiun/wagonShop terpasang, uang-tas-mesin-ekspansi tetap) → lolos.
- v51 → v52 (wagonShop pindah ke kota, salinan di lahan hilang, 4 gerbong muncul) → lolos.

Cek staleness: `townStale` (bangun wagon di tempat baru), `plotStale` (masih ada wagonShop di lahan → bangun ulang sekali), `forestStale` (jangkar simpan kereta hutan pindah).

## Fitur aktif v52

- [x] Loop penuh: modal $50 + kapak, panen, olah mesin, jual, beli mesin/resep
- [x] Karakter 4 arah, jalan memutar rintangan, perkakas, memanggul
- [x] Mesin Sawhorse, Splitter, Carpenter, Oven, Smelter, Blacksmith + Research
- [x] Conveyor searah + miring, storage (Barrel 100, Rack Advanced 1.000, Crane), toko jual 1/10/Semua
- [x] Simpan otomatis, tutorial, panel ADMIN, menu burger 4 tombol
- [x] Tanah datar, conveyor menapak lantai, node habis
- [x] Ikon item 25 prosedural di atlas
- [x] 2 map awal → 8 map rantai
- [x] NPC Mayor + ekspansi plot (Size 200/400/800/2000), Auto Seller $5.000
- [x] 147 sprite manifest
- [x] UI/UX ATM sentuh, target 36-48px, tanpa tombol HUD baru
- [x] Sprite masuk sel atlas (147/147 nol luber)
- [x] Kereta 2 petak (lokomotif + gerbong), nol tulisan di sprite
- [x] Kapal bajak laut di petak air (10,18)
- [x] Papan PLOT + petak putih di Padang Rumput
- [x] Bangunan beli wagon di kota (3,3)
- [x] Pemuat atlas `?v=52`

## Blokir dan belum selesai

**Blokir teknis:** BLACKSMITH + menu crafting butuh `unrar` untuk ekstrak sisa 40 PNG dari `Factory_Tycon.rar` (40/80 sukses; `rarfile` Python intermittent, `unrar` sistem tidak tersedia). Dilaporkan saja, tidak diubah.

**Backlog v52 (belum ada centang):** rantai tekstil + Bronze Cannon, quest/trust NPC, fuel meter terpisah, irigasi, bangunan logika, multi-save. Detail spesifikasi belum ada di repo — ditandai `[ASSUMPTION]` di `TASK.md`.

## Tes referensi

Headless 313/313 (v49–v52), nol error konsol. Browser: uji luber sprite, migrasi simpan, panel kereta, gerbang, ekspansi — lolos.
