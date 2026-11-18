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

## Di luar tahap ini (sesuai PRD)

- Rantai tekstil + Bronze Cannon, quest/trust NPC, Fuel meter terpisah, irigasi, bangunan logika, multi-save

## Cara baca

- Tiap langkah dicentang sesudah dites. Versi live saat ini: v9.
