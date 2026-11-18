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

## Tahap berikutnya — menunggu gas Agus

- [ ] Langkah 1: Tes repro bug refresh (skenario output mesin penuh) — menunggu izin Agus
- [ ] Langkah 2: Ikon item di dalam panel mesin, ikut game asli, tampilan disesuaikan (ATM)
- [ ] Langkah 3: Dua map — Map 1 kota (toko, NPC, bahan), Map 2 plot (pabrik); masuk lewat kotak plot, keluar lewat gerbang; mesin tetap jalan di kedua map
- [ ] Langkah 4: NPC Mayor + rantai ekspansi plot (struktur asli: Size, Size+, Size++, Size+++, Auto Seller; angka disesuaikan)
- [ ] Langkah 5: Sprite Gemini (alur: draf prompt, Gemini merapikan, generate, patokan gaya referensi #5, susun ikut assets/atlas-manifest.json)
- [ ] Langkah 6: Penyesuaian UI/UX ATM untuk sentuh (target sentuh, panel, HUD)

## Di luar tahap ini (sesuai PRD)

- Rantai tekstil + Bronze Cannon, quest/trust NPC, Fuel, irigasi, bangunan logika, multi-save

## Cara baca

- Tiap langkah dicentang sesudah dites dan live. Versi live saat ini: v6.
