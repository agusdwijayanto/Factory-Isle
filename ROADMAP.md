# Roadmap — Indotopia Tycoon Pabrik Isometrik

Game tycoon pabrik single-player di browser, terinspirasi Factory Town Tycoon (Roblox).
Tampilan isometrik 2.5D ala TheoTown. Karakter berjalan, panen, memanggul, jual ke toko.

Prinsip: ATM (Amati, Tiru, Modifikasi). Jangan jiplak mentah-mentah.
Game asli enaknya dimainkan di laptop; tampilan disesuaikan untuk browser HP sentuh + PC.
Desain mengikat ada di docs/STRUKTUR.md, docs/PRD.md, docs/TASK.md.

Live: https://agusdwijayanto.github.io/Indotopia/

## Sudah live — v6 (18 Nov 2026)

- [x] Loop penuh: modal 50 + kapak, panen, olah rantai mesin, jual, beli mesin/resep
- [x] Karakter 4 arah, jalan memutar rintangan, perkakas, memanggul
- [x] Mesin Sawhorse, Splitter, Carpenter, Oven, Smelter, Blacksmith + Research
- [x] Conveyor searah + miring, storage, toko jual 1/10/Semua
- [x] Simpan otomatis, tutorial, panel ADMIN, menu burger 4 tombol
- [x] Tanah datar, conveyor menapak lantai, node habis menghilang sampai tumbuh lagi

## Sudah live — v7 (18 Nov 2026)

- [x] Langkah 1: Bug refresh — repro mengonfirmasi akar masalah: output mesin penuh (cap 30) membuat canStart gagal permanen; refresh bukan penyebab, diamnya sudah terjadi sebelumnya. Perbaikan: soft cap (mesin boleh mulai bila ada ruang apa pun) + status mesin selalu terlihat di panel. Tes regresi ditambahkan.
- [x] Langkah 2: Ikon item di dalam panel mesin, tas, toko, dan storage (ikon + nama + angka), ikut game asli, tampilan disesuaikan (ATM). 25 ikon prosedural di atlas.
- [x] Langkah 3: Dua map — Map 1 kota (toko, Mayor, kotak plot, sumber daya), Map 2 plot (pabrik); masuk lewat kotak plot, keluar HANYA lewat gerbang; mesin tetap jalan di kedua map; nama map di HUD; simpan lama dimigrasikan (v1 ke v2, kunci simpan sama).
- [x] Langkah 4: NPC Mayor (perempuan pirang, gaun biru-putih) + rantai ekspansi plot (Size 200, Size+ 400, Size++ 800, Size+++ 2000; angka asli) + Auto Seller $5.000 (keputusan turunan; harga asli 175.000 terlalu jauh dari ekonomi harga papan). Tiap ekspansi membesarkan grid plot. Harga jual ikut harga PAPAN (keputusan Agus).
- [x] Langkah 5: Siap sprite Gemini — manifest diperluas (61 sprite: ikon item, Mayor, gerbang, kotak plot) + docs/PROMPT_GEMINI.md berisi draf prompt 6 batch. Generate BELUM dilakukan (butuh browser + alur Gemini).
- [x] Langkah 6: UI/UX ATM untuk sentuh — HUD tetap minimal (burger + nama map + uang), target sentuh 36-48px, panel kebaca, status mesin terlihat. Tanpa tombol HUD baru.

Tes: headless 71/71, Playwright 79/79 (HP 390x844 + desktop 1280x800), nol error konsol, nol overflow. Versi aset: ?v=7.

## Sudah live — v8 (19 Nov 2026)

- [x] Perbaikan deposit bahan: bahan masuk sebagian (berapa pun, bahkan 1), mesin diam sampai 1 ronde lengkap terkumpul; toast dan status panel menyebut bahan apa yang kurang. Berlaku untuk semua mesin (satu fungsi deposit).

## Sudah live — v9 (19 Nov 2026)

- [x] Conveyor menarik dari mesin di belakang, kiri, dan kanan (prioritas belakang dulu). Depan tetap arah keluar.

## Sudah live — v10 (19 Nov 2026)

- [x] Deposit masuk semua: batas input dihapus, sekali tekan semua bahan resep di tas masuk, mesin jalan kalau 1 ronde lengkap. Pesan "Input mesin penuh" hilang.

## Sudah live — v11 (19 Nov 2026)

- [x] Inclined Conveyor dihapus dari menu bangun, tinggal Conveyor saja. Yang sudah terpasang tetap jalan.

## Sudah live — v12 (19 Nov 2026)

- [x] Sawhorse jadi otomatis seperti mesin lain: tetap jalan walau karakter jauh dan walau pemain di kota. Teks lama soal berdiri di sampingnya dihapus (deskripsi, tutorial, panel, bantuan).
- [x] Floater hasil mesin (+1/+3/+6) hanya tampil di lahan: floater menyimpan map asal, render melewati floater dari map lain. Hasil mesin yang selesai saat pemain di kota tetap ketempel plot.
- [x] Tombol BANGUN disembunyikan di kota, hanya tampil di lahan. Menu bangun yang terbuka ikut tertutup saat kembali ke kota.

Tes: headless 74/74, Playwright 82/82, nol error konsol. Versi aset: ?v=12.

## Sudah live — v13 (19 Nov 2026)

- [x] 5 map zona (Kota, Hutan, Gunung, Pelabuhan, Lahan), pindah lewat ujung map seperti kotak plot dan gerbang v12. Pegunungan di utara; Hutan barat, Kota tengah, Pelabuhan timur; Lahan kantong terpisah lewat kotak plot.
- [x] Sungai jadi fitur di dalam map (bukan map): di tepi utara kota, lewat jembatan ke gunung; hulu di gunung; clay di tepian sungai, pasir di pantai pelabuhan, bijih di gunung, pohon Oak dan kapas di hutan.
- [x] Kereta 130 Trading Co. sebagai angkutan cepat Gunung-Hutan-Kota-Pelabuhan: peron + lokomotif di tiap map, ketuk peron/kereta, pilih tujuan, sampai. Jalan kaki tetap bisa.
- [x] Kota v2: 5 toko terpisah (Carpenter, Blacksmith, Tool Shop, Textile, Exchange), tiap toko beli dan jual barang beda dengan harga sendiri (ikut riset wiki 4.2). Pelabuhan bayar premium (harga papan x1,2 atau harga riset, yang lebih besar).
- [x] Simpan v2 kunci baru indotopia-tycoon-save-v2 (save v1 tidak terbawa, simpan v1 di kunci v2 ditolak). Semua map tersimpan, termasuk keadaan simpul hutan/gunung.
- [x] Perbaikan saat tes: Blacksmith dipindah dari (8,1) ke (11,3) karena menutup satu-satunya jalan ke jembatan — jembatan jadi tidak bisa dicapai. Probe BFS membuktikan semua pintu keluar dan toko bisa dicapai.
- [x] Perilaku v12 tetap: Sawhorse otomatis dan jalan di kota, floater hasil mesin hanya di lahan, BANGUN hanya di lahan, rantai resep dan harga v1 sama.

Tes: headless 113/113, Playwright 99/99, nol error konsol. Versi aset: ?v=13.

## Sudah live — v14 (19 Nov 2026)

- [x] Ubin jalan di tiap map mengikuti rute denah: Kota (tulang utara-selatan, barat-timur, depan toko), Hutan (timur ke utara), Gunung (selatan ke tengah), Pelabuhan (barat ke dermaga), Lahan (jalan pendek gerbang ke tengah). Jalan hanya penanda visual, tetap bisa dilewati, tidak menutup resource/toko/petak bangun (mesin tidak bisa dibangun di atas jalan).
- [x] Rel kereta nyambung antar map: Kota kiri-kanan penuh di baris peron, Hutan bentuk L (timur ke utara), Gunung penuh atas-bawah, Pelabuhan barat sampai peron. Rel hanya visual di atas tanah, tetap bisa dilewati.
- [x] Kereta berdiri DI ATAS rel, bukan di samping: peron pindah ke baris samping rel, kereta di baris rel tiap map. Ketuk peron/kereta tetap membuka panel kereta; titik naik (TRAIN_SPAWN) ikut pindah ke petak peron.
- [x] Pelabuhan: laut di sepanjang sisi kanan map (atas sampai bawah), tetap tidak bisa dilewati; dermaga dan jalan ke dermaga tidak ketutup air.
- [x] Bangunan stasiun dihapus dari semua map; peron dan kereta tetap.
- [x] Simpan v2 lama dimigrasikan: map statis dibangun ulang saat dimuat kalau belum ada jalan (uang, tas, mesin, lahan tetap); keputusan ini supaya Agus yang sudah punya simpan v2 langsung melihat jalan dan rel.
- [x] Keputusan turunan: rel Gunung di x=7 (bukan tepat di pintu (8,0)) karena peron mengapit rel — rel keluar 1 petak di kiri pintu, dan jalan utara Hutan pun sejajar 1 petak di kiri relnya. Rel Gunung keluar bebas di (7,0) karena puncak gunung hanya di x genap.

Tes: headless 126/126, Playwright 103/103, nol error konsol. Versi aset: ?v=14.

## Di luar tahap ini (sesuai PRD)

- Rantai tekstil + Bronze Cannon, quest/trust NPC, Fuel meter terpisah, irigasi, bangunan logika, multi-save

## Cara baca

- Tiap langkah dicentang sesudah dites. Versi live saat ini: v14.
