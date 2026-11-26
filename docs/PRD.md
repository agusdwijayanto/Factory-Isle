# PRD — Indotopia Tycoon Pabrik Isometrik

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [STRUKTUR](STRUKTUR.md) · [TASK](TASK.md) · [ROADMAP](../ROADMAP.md)

Satu fakat, satu rumah: aturan dan angka spesifik satu feature tinggal di design-nya; PRD hanya ringkasan + link. Tidak menyalin angka tunable dari kode.

## 1. Tujuan produk

Game tycoon pabrik single-player di browser: pemain membangun rantai produksi, mengelola lahan, dan menjual hasil di toko di dunia isometrik 8 map. Sesi bebas, simpan otomatis.

## 2. Audiens

Pemain casual, browser HP sentuh + PC, bahasa Indonesia. Tampilan disesuaikan untuk layar sentuh HP dan PC (game asli enak di laptop).

## 3. Platform dan input

Platform: browser (HTML5 canvas), tidak ada framework. Input: sentuh (target 36-48px) dan PC (WASD atau panah berjalan, R memutar arah saat menaruh, Esc menutup panel). HUD minimal: burger + nama map + uang, tanpa tombol HUD baru.

## 4. Sesi dan simpan

Sesi: free play. Simpan otomatis. 4 slot save: slot 1 default, slot 2/3/4 dibayar $25.000/$50.000/$100.000; biaya ekspansi naik per save. Simpan lama dimigrasikan aman saat versi naik (data tidak pernah hilang).

## 5. Engine

Vanilla JS + HTML5 canvas. 40 skrip dimuat `index.html` (lihat `STRUKTUR.md`). Sound Howler.js. Font Nunito via Google Fonts.

## 6. Ruang lingkup

MVP sudah live (v52, commit `9dcf6f0`). Backlog belum dikerjakan (6 item, lihat `TASK.md`). Tidak ada deadline yang ditetapkan.

## 7. Referensi dan prinsip

Referensi: Factory Town Tycoon (Roblox), TheoTown (isometrik 2.5D). Prinsip ATM (Amati, Tiru, Modifikasi) — tidak jiplak mentah-mentah.

## 8. Pilar desain

1. **Simpan otomatis + migrasi aman.** Setiap versi naik membawa data lama; uang, tas, mesin, ekspansi, perkakas, badge, tutorial tetap. Verifikasi dengan simpan buatan v48–v51.
2. **Dunia satu rantai, navigasi jelas.** 8 map satu rantai utara-selatan; rel kolom 9, sungai kolom 1, jalan utama kolom 8 tembus semua map.
3. **UI minimal.** HUD hanya burger + nama map + uang. Semua fitur lewat panel, tidak ada tombol HUD baru.
4. **Mesin jalan otomatis.** Semua mesin berjalan walau pemain di map lain; tidak tergantung keberadaan pemain.

## 9. Core loop

`Panen → Olah mesin → Jual → Beli mesin/resep → Perbesar lahan → Kembali ke panen.`

## 10. Feature index

| Fitur | Status | Ringkasan |
|---|---|---|
| Loop panen-olah-jual | implemented | MVP live v52 |
| Karakter 4 arah + jalan memutar rintangan | implemented | MVP live v52 |
| Perkakas (kapak/sekop/pickaxe + upgrade Bronze/Iron) | implemented | MVP live v52 |
| Mesin (Sawhorse, Splitter, Carpenter, Oven, Smelter, Blacksmith, Research) | implemented | MVP live v52 |
| Conveyor searah + miring, storage | implemented | MVP live v52 |
| Simpan otomatis + migrasi | implemented | Dites simpan v48–v51 |
| Tutorial + panel ADMIN + menu burger | implemented | MVP live v52 |
| 8 map rantai utara-selatan | implemented | v49 |
| Lahan pemain 16x12 → 24x16 | implemented | v49 |
| Stasiun 4 map + kereta | implemented | v49–v51 (gerbong 2 petak v52) |
| Mayor + ekspansi plot + Auto Seller | implemented | v7 |
| UI/UX ATM sentuh | implemented | v7 |
| Ikon item prosedural (25) | implemented | v7 |
| Sprite masuk sel atlas (147/147 nol luber) | implemented | v52 |
| Kereta 2 petak tanpa tulisan sprite | implemented | v52 |
| Kapal bajak laut di air (10,18) | implemented | v52 |
| Papan PLOT + petak putih Padang Rumput | implemented | v52 |
| Bangunan beli wagon di kota | implemented | v52 |
| Pemuat atlas `?v=52` | implemented | v52 |
| Rantai tekstil + Bronze Cannon | ide | backlog, belum ada spesifikasi |
| Quest / trust NPC | ide | backlog, belum ada spesifikasi |
| Fuel meter terpisah | ide | backlog, belum ada spesifikasi |
| Irigasi | ide | backlog, belum ada spesifikasi |
| Bangunan logika | ide | backlog, belum ada spesifikasi |
| Multi-save | ide | slot 2/3/4 ada di help, verifikasi kode belum |

## 11. Kebutuhan non-fungsi

- Headless test 100% lolos (v52: 313/313).
- Nol error konsol, nol overflow.
- Setiap perubahan aset naik `?v` di pemuat manifest agar cache lama tidak menyimpan sprite lama.
- Uji luber seluruh atlas: semua sprite muat di selnya.

## 12. Keputusan

| ID | Tanggal | Keputusan | Alternatif dipertimbangkan | Alasan | Mempengaruhi |
|---|---|---|---|---|---|
| D-001 | 2026-11-26 | Rel di kolom x=9 di semua map | rel cabang / belokan | Navigasi tembus semua map, stasiun sejajar | Semua `js/03-map-*.js` |
| D-002 | 2026-11-26 | Stasiun Hutan Lebat di sisi timur rel (10,7) | tengah jalan kolom 8 | Jalan kolom 8 tidak bolong | `js/03-map-hutan.js` |
| D-003 | 2026-11-26 | Bangunan beli wagon pindah ke kota (3,3) | lahan (5,h-2) | Lahan bersih dari objek tetap | `js/03-map-lahan.js`, `js/03-map-kota.js` |
| D-004 | 2026-11-26 | Kereta 2 petak, nol tulisan di sprite | tulisan "TRADING CO." / "130" | Item minta sprite tanpa aksara | `js/05-paint-tempat.js`, `js/04-atlas.js` |
| D-005 | 2026-11-26 | Cek wagonShop di `townStale`, cek terbalik di `plotStale` | cek `plotStale` apa adanya | Hindari lahan dibangun ulang setiap load | `js/12-simpan.js` |
| D-006 | 2026-11-26 | Harga jual ikut harga PAPAN | harga asli 175.000 | Keputusan turunan Agus; harga asli terlalu jauh dari ekonomi | Ekspansi plot, Auto Seller |

## 13. Pertanyaan terbuka

- `[ASSUMPTION]` `unrar` untuk 40 PNG sisa `Factory_Tycon.rar` (Blacksmith) — belum tersedia sistem, alternatif belum ditentukan.
- `[ASSUMPTION]` Live `https://agusdwijayanto.github.io/Indotopia/?v=52` belum terkonfirmasi (HTTP 404 saat dicek). Versi live saat ini dianggap `9dcf6f0` lokal.
- `[ASSUMPTION]` Detail 6 backlog v52 belum ada di repo; spesifikasi harus ditulis sebelum kode.
