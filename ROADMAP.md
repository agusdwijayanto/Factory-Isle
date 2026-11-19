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

## Sudah live — v15 (19 Nov 2026)

- [x] Rel Gunung jadi terminus: rel hanya dari ujung bawah map naik sampai baris peron (y=8 sampai 11), lalu berhenti di peron. Rel di atas peron (y=0 sampai 7) dihapus — tidak ada map di utara gunung, jadi rel tidak tembus ke mana-mana.
- [x] Palang penahan (buffer stop) merah di ujung rel paling atas (7,8), sprite prosedural baru `railStop` (sel atlas baris 7 kolom 0, tanpa ubah ukuran atlas). Rel kota, hutan, dan pelabuhan tidak diubah.
- [x] Migrasi simpan v2 lama ikut membangun ulang rel terminus + palang penahan (tes migrasi diperluas).
- [x] TRAIN_SPAWN gunung tetap [6,8]; kereta tetap di atas rel di (7,9).

Tes: headless 126/126, Playwright 103/103, nol error konsol. Versi aset: ?v=15.

## Sudah live — v16 (19 Nov 2026)

- [x] Pecah kode supaya maintenance gampang, tanpa ubah perilaku game sama sekali: angka, harga, resep, map, jalan, rel, toko, simpan v2, dan perilaku v12-v15 tetap persis. Tanpa module/import, tanpa bundler, tanpa build step — tetap `<script>` biasa berurutan, global dan nama fungsi sama, hanya pindah kode ke file lain.
- [x] `03-data.js` (346 baris) dipecah jadi 8 file: `03-data-items.js` (216 baris: barang, toko, resep, mesin, node), `03-data-tutorial.js` (18 baris: tutorial + teks resep), `03-data-maps.js` (50 baris: bantuan bangun map + rakitan `buildStaticMaps`/`buildMap`), dan tiap zona map sendiri — `03-map-kota.js` (22), `03-map-hutan.js` (16), `03-map-gunung.js` (24), `03-map-pelabuhan.js` (16), `03-map-lahan.js` (7). File `03-data.js` lama dihapus.
- [x] `05-render.js` (951 baris) dipecah jadi 11 file: `05-render-core.js` (26: kanvas + langit), `05-paint-helpers.js` (61: pembantu pelukis + wadah `PAINTERS`), pelukis per yang digambar — `05-paint-tanah.js` (86), `05-paint-node.js` (67), `05-paint-mesin.js` (129), `05-paint-alat.js` (28), `05-paint-tempat.js` (115), `05-paint-pemain.js` (30), `05-paint-item.js` (161) — lalu `05-render-overlay.js` (77: cahaya, belt, panah, karakter) dan `05-render.js` (204: loop render + aturan taruh).
- [x] `13-ui.js` (698 baris) dipecah jadi 10 file: `13-ui-core.js` (112: pembantu DOM, suara, panel dasar), panel per file — `13-ui-build.js` (68), `13-ui-inspect.js` (145: panel periksa + ambil/masuk bahan), `13-ui-storage.js` (45), `13-ui-shop.js` (82), `13-ui-train.js` (29), `13-ui-tas.js` (21), `13-ui-mayor.js` (49), `13-ui-tick.js` (36) — dan `13-ui.js` (83: kait tombol statis).
- [x] Urutan muat dijaga: `index.html` memuat 40 script `?v=16` berurutan; daftar file tes headless ikut diperbarui. Total 14 file js jadi 38 file, file terbesar sekarang 216 baris (`03-data-items.js`).

Tes: headless 126/126, Playwright 103/103, nol error konsol. Versi aset: ?v=16.

## Sudah live — v17 (19 Nov 2026)

- [x] Perbaikan bug visual "gendong papan": karakter yang menghadap arah 1 diam (frame 0) ketumpuk belah ketupat rel abu-abu + palang merah di kepala, kelihatan seperti menggendong papan besar. Akar masalah: `railStop` di manifest atlas duduk di sel (0,7) — sel yang sama dengan sprite player frame 0 arah 1 — dan pelukisnya menimpa sel itu sesudah pelukis player (urutan `Object.entries` di `Atlas.build`). Bukan pelukis yang merembes, bukan urutan gambar.
- [x] Perbaikan: `railStop` pindah ke sel kosong (3,7) di `assets/atlas-manifest.json` dan salinan darurat `MANIFEST_EMBEDDED` di `js/04-atlas.js` (dua baris). Sprite player sekarang bersih di semua arah dan frame; palang penahan gunung tetap di tempatnya.
- [x] Tes regresi: tes headless sekarang memeriksa tidak ada dua sprite berbagi satu sel atlas, di file manifest maupun salinan darurat, plus `railStop` di luar blok sprite player.

Tes: headless 129/129, Playwright 103/103, nol error konsol. Versi aset: ?v=17.

## Sudah live — v18 (19 Nov 2026)

- [x] Naik kereta cukup klik kereta saja, berlaku di semua map (kota, hutan, gunung, pelabuhan). Klik peron tidak lagi membuka panel kereta — peron cuma dekorasi, warnanya abu-abu polos saja (pelukis peron disederhanakan jadi satu belah ketupat abu-abu, garis aksen kuning dan garis gelap dihapus). Cek `station` yang sudah mati sejak v14 ikut dihapus dari ketuk dan halangan jalan.
- [x] Toko kota disebar di sepanjang jalan toko (y=2): Carpenter (1,1), Blacksmith (4,3), Exchange (7,3), Tool Shop (11,1), Textile (14,1) — jarak min 3 petak, tidak menutup jalan ke jembatan (x=8), pintu keluar (y=6), atau rel (y=9). Jalan depan toko diperpanjang ke x=1. Harga dan isi tiap toko tidak berubah.
- [x] Simpan v17 ikut termigrasi: simpan lama yang tokonya masih numpuk dibangun ulang map statisnya supaya toko pindah ke posisi baru; uang, tas, mesin, dan lahan tetap.
- [x] Tes regresi: ketuk peron tidak membuka panel kereta dan ketuk kereta membuka panel, di keempat map (headless; Playwright di hutan dan kota); jarak antar toko kota min 3 petak; migrasi toko lama.

Tes: headless 140/140, Playwright 105/105, nol error konsol. Versi aset: ?v=18.

## Sudah live — v19 (19 Nov 2026)

- [x] Pindah peron/kereta hutan ke kanan bawah (koordinat x/z Agus, konversi gx=z-1, gy=12-x): peron baru 1 kotak di (14,8) (x=4,z=15), jalan baru 1 kotak di (14,7) tepat di belakang peron (x=5,z=15), kereta pindah ke rel (14,9) tepat di depan peron (x=3,z=15). Titik lahir penumpang naik kereta (TRAIN_SPAWN hutan) ikut pindah ke (14,8) supaya turun di peron baru.
- [x] Belokan rel di tikungan L hutan (9,9) (x=3,z=10): terrain baru `railBend` + pelukis sudut yang menyambungkan kaki timur (arah railX) dengan kaki utara (arah railY), sel atlas kosong (4,7). Rel mendatar dan rel tegak sekarang kelihatan belok, bukan dua potong lurus yang ketemu.
- [x] Peron lama (6,8),(7,8),(8,8), rel depan lama (7,9),(8,9), dan jalan lama (7,6),(7,7) dihapus (kembali jadi rumput). Rel hutan sekarang: railX x=10-15 di baris 9, railY y=0-8 di kolom x=9. Map lain (kota, gunung, pelabuhan, lahan) tidak disentuh; peron baru tetap abu-abu polos, klik peron tetap tidak membuka panel (aturan v18).
- [x] Simpan v18 ikut termigrasi: simpan lama yang kereta hutannya masih di posisi lama dibangun ulang map statisnya; uang, tas, mesin, dan lahan tetap.
- [x] Tes regresi: posisi baru peron/kereta/jalan/belokan hutan + peron/rel/jalan lama sudah tidak ada, ketuk peron/kereta hutan di posisi baru, migrasi simpan lama, dan railBend di luar blok sprite player.

Tes: headless 145/145, Playwright 105/105, nol error konsol. Versi aset: ?v=19.

## Sudah live — v20 (19 Nov 2026)

- [x] Penggaris koordinat x/z global: angka tampil di luar belah ketupat map, di margin gelap — x di sisi kiri (naik ke atas, 1-12), z di sisi bawah (ke kanan, 1-16). Rumus label Agus (1-based, nol di kiri bawah): x = GRID_H - gy, z = gx + 1. Berlaku di semua map (kota, hutan, gunung, pelabuhan, lahan); ikut zoom kamera dan ukuran map aktif (GRID_W/GRID_H hidup, jadi ikut lahan yang membesar tiap ekspansi). Selalu tampil, kecil dan abu-abu (#9aa3ad) dengan garis tepi gelap tipis, tidak menutupi petak, HUD, atau tombol.
- [x] Implementasi: helper murni `coordLabel(gx, gy)` di `js/01-core.js`, pelukis `paintRuler()` di `js/05-render-overlay.js` (duduk di luar titik kiri petak (0,gy) untuk x dan di bawah titik bawah petak (gx,GRID_H-1) untuk z, petak di luar layar dilewati), dipanggil di akhir `render()` di `js/05-render.js` sesudah vignette dan floater supaya tetap kebaca.
- [x] Catatan: di HP portrait zoom bawaan (lebar/760) belah ketupat sedikit lebih lebar dari layar — petak dan label di ujung kiri (x=1,2 dan z=1,2) ikut terpotong seperti petaknya sendiri, dan muncul saat kamera digeser ke kanan; di desktop semua angka muat. Ini perilaku zoom bawaan yang sudah ada, bukan dari penggaris.
- [x] Tes regresi: rumus label di beberapa petak termasuk (0,11)=x1 z1, (15,0)=x12 z16, dan ikut besar map (headless); `paintRuler` + `coordLabel` ada di halaman (Playwright).

Tes: headless 151/151, Playwright 107/107, nol error konsol. Versi aset: ?v=20.

## Sudah live — v21 (19 Nov 2026)

- [x] Belokan rel hutan akhirnya tampil: akar masalahnya di `js/05-render.js` — pemetaan tanah ke sprite (rantai ternary) tidak memuat `railBend`, jadi petak belokan (9,9) jatuh ke default rumput walau sprite atlasnya ada. Perbaikan: rantai ternary diekstrak jadi fungsi `groundSprite(t, gx, gy)` dan `railBend` ditambahkan ke pemetaannya. Piksel tengah petak belokan terbaca #6e6a72 (abu-abu rel), bukan hijau rumput; rel hutan sekarang nyambung tanpa putus.
- [x] Angka "1" cukup satu di pojok kiri bawah: label z penggaris mulai dari 2 (lewati z=1), label x tetap 1-12 — angka 1 di pojok sudah diwakili label x. Tes headless memastikan angka "1" hanya tergambar sekali dari 27 label (x 1-12 + z 2-16).
- [x] Saklar koordinat di Pengaturan: tombol "Koordinat: Hidup/Mati" di panel Pengaturan, default ON, tersimpan di save (`S.settings.ruler`; simpan lama tanpa kunci ini default ON). `paintRuler()` tidak menggambar apa-apa saat OFF.
- [x] Tes regresi baru: headless memeriksa setiap terrain yang dipakai di semua map punya sprite sendiri (bukan jatuh ke rumput diam-diam) dan sprite-nya ada di manifest; Playwright memeriksa piksel belokan (abu-abu, bukan rumput) dan saklar koordinat hidup-mati.

Tes: headless 159/159, Playwright 110/110, nol error konsol. Versi aset: ?v=21.

## Sudah live — v22 (19 Nov 2026)

- [x] Angka penggaris koordinat pindah ke DALAM petak pinggir (perintah Agus: bukan di garis/sumbu di luar map, tapi di bloknya): `paintRuler()` di `js/05-render-overlay.js` sekarang menggambar angka tepat di tengah petak (0,gy) untuk x 1-12 dan (gx,GRID_H-1) untuk z 2-16; angka 1 tetap sekali di pojok. Gaya sama (abu-abu #9aa3ad, tebal, tepi gelap tipis), ikut zoom dan ukuran map aktif, hormat saklar Koordinat di Pengaturan (OFF = tidak ada angka).
- [x] Tes regresi baru: headless memeriksa posisi label persis sama dengan tengah petak (1 di (0,11), 16 di (15,11), 12 di (0,0)); Playwright memeriksa piksel label abu-abu ada di tengah petak dan tidak ada di posisi luar map yang lama (HP + desktop).

Tes: headless 162/162, Playwright 110/110, nol error konsol. Versi aset: ?v=22.

## Sudah live — v23 (19 Nov 2026)

- [x] Perbaikan map Gunung (perintah Agus, koordinat x/z): air hulu sungai memanjang ke selatan jadi 10 petak (x=1-10, z=2; `js/03-map-gunung.js`); jalan baru x=1, z=7 (6,11) dan x=2, z=14-16 (13,10),(14,10),(15,10); jalan lama x=2, z=5-6 (4,10),(5,10) dihapus jadi rumput. Titik lahir dari hutan (4,10) kini rumput, tetap bisa dilewati.
- [x] Perbaikan map Hutan (perintah Agus, koordinat x/z): air di tepi utara penuh 15 petak (x=12, z=2-16); jembatan di (8,0) menimpa air — satu-satunya jalan ke gunung, bisa dilewati; rel di (9,0) menimpa air — ujung utara kolom rel hutan tetap nyambung (`js/03-map-hutan.js`). Urutan air dulu, baru jembatan dan rel.
- [x] Migrasi simpan lama (`js/12-simpan.js`): simpan v2 lama ikut dibangun ulang kalau air gunung di (1,5) belum ada atau jembatan hutan di (8,0) belum ada; progres pemain tetap.
- [x] Tes regresi baru: headless memeriksa petak-petak baru, jalan yang bisa dilewati (air menghalangi, jembatan tidak), BFS ke jembatan, pindah map lewat jembatan, dan migrasi v23; Playwright memeriksa data + piksel (air biru, jembatan coklat, rel abu-abu, jalan coklat muda, rumput hijau).

Tes: headless 173/173, Playwright 110/110, nol error konsol. Versi aset: ?v=23.

## Sudah live — v24 (19 Nov 2026)

- [x] Bug spawn Hutan -> Gunung (laporan Agus): pemain lahir di (2,5) x/z, seharusnya (2,7). Akar masalah: titik lahir tetap di `MAP_EXITS` (`js/03-data-items.js`) masih (4,10) — petak yang sejak v23 jadi rumput. Perbaikan: spawn pindah ke (6,10) = Agus (2,7), di atas jalan selatan gunung.
- [x] Pintu Gunung -> Hutan dipindah (perintah Agus): dari (4,11) ke (6,11) = Agus (1,7), tepat di selatan petak lahir (6,10). Lahir di Hutan tetap (8,1) = Agus (11,9).
- [x] Pintu Gunung -> Kota dipindah (perintah Agus): dari (12,11) ke (15,10) = Agus (2,16), ujung timur baris jalan gy=10 (bukan (15,11)). Lahir di Kota pindah dari (8,2) ke (8,1) = Agus (11,9), di jalan bawah jembatan. Spawn Kota -> Gunung (12,10) tidak diubah.
- [x] Tes regresi baru: headless dan Playwright menegaskan posisi lahir Hutan -> Gunung (6,10) di atas jalan + label penggarisnya (2,7), pintu (6,11) -> Hutan lahir (8,1), pintu (15,10) -> Kota lahir (8,1), dan pintu lama (4,11) dan (12,11) sudah mati. Dua cek lama yang mengunci spawn (4,10) sebagai benar diperbaiki — itu sebabnya bug ini lolos.

Tes: headless 180/180, Playwright 115/115, nol error konsol. Versi aset: ?v=24.

## Sudah live — v25 (19 Nov 2026)

- [x] Perubahan map Kota (perintah Agus, koordinat x/z): pad Lahan pindah dari (8,10) ke (8,11) = Agus (1,9) (`S.plotPad` di `js/01-core.js` — pemicu pindah, titik lahir kembali ke kota, dan penempatan pad ikut pindah); jalan baru x=2-4, z=9 (8,10),(8,9),(8,8) dengan rel x=3, z=9 (8,9) menimpa jalan — hasil akhir (8,10) jalan, (8,9) rel, (8,8) jalan; peron pindah dari (6,8)-(8,8) ke (5,8)-(7,8) = Agus (4, 6-8) (`js/03-map-kota.js`). Kereta tetap di (7,9) di atas rel, panel kereta tetap terbuka saat diklik.
- [x] Migrasi simpan lama (`js/12-simpan.js`): simpan v2 lama ikut dibangun ulang kalau pad di (8,11) belum ada; progres pemain tetap.
- [x] Tes regresi baru: headless memeriksa pad baru (8,11) = Agus (1,9), jalan/rel/peron baru, kereta tetap di (7,9), ketuk peron baru tidak membuka panel kereta, ketuk kereta tetap membuka, injak pad baru pindah ke Lahan, pad lama sudah mati, dan migrasi v25; Playwright memeriksa data + piksel (pad putih, jalan coklat muda, rel abu-abu, peron abu-abu biru) dan jalan ke pad baru. Dua cek lama yang mengunci pad (8,10) sebagai benar diperbaiki — itu sebabnya perubahan ini butuh penyesuaian tes.

Tes: headless 190/190, Playwright 115/115, nol error konsol. Versi aset: ?v=25.

## Sudah live — v26 (19 Nov 2026)

- [x] Spawn Kota -> Gunung pindah (perintah Agus): dari (12,10) ke (15,10) = Agus (2,16), ujung timur jalan selatan gunung (`MAP_EXITS` di `js/03-data-items.js`, entri jembatan kota (8,0)). Jembatan kota (8,0) tidak diubah.
- [x] Tidak memantul balik: petak lahir baru (15,10) sama dengan pintu Gunung -> Kota (v24), tapi `checkMapTrigger()` hanya dipanggil saat tiba di petak baru lewat jalur jalan (`js/07-pemain.js`), bukan saat lahir atau diam — pemain yang lahir di (15,10) tetap di Gunung; melangkah keluar lalu kembali menginjak (15,10) tetap pindah ke Kota lahir (8,1) = Agus (11,9).
- [x] Tes regresi baru: headless dan Playwright menegaskan lahir Kota -> Gunung di (15,10) di atas jalan + label penggarisnya (2,16), diam di atas pintu tidak memantul balik, melangkah ke (14,10) tetap di Gunung, dan kembali injak (15,10) pindah ke Kota. Cek lama yang mengunci spawn (12,10) sebagai benar diperbaiki.

Tes: headless 194/194, Playwright 116/116, nol error konsol. Versi aset: ?v=26.

## Sudah live — v27 (19 Nov 2026)

- [x] Alur bangun baru di lahan (perintah Agus): ketuk petak cuma menempelkan bayangan, belum taro. Tiga tombol tampil selama mode menaruh: X (batal, merah), PUTAR (arah, sudah ada), centang ✓ (baru taro di petak bayangan, hijau). Ketuk petak lain memindahkan bayangan; centang tanpa petak dipilih tidak berbuat apa-apa; centang di petak yang tidak bisa ditaruh tetap ditolak dengan pesan yang sama; Esc tetap batal. Bayangan digambar di petak yang dipilih (bukan cuma hover) supaya kelihatan di HP. Sesudah taro mesin/storage mode selesai; conveyor tetap berantai (bayangan kosong lagi sesudah centang). Pindah mesin dari panel inspect ikut alur baru yang sama. (`S.placeSpot` di `js/01-core.js`; `handleTap`/`confirmPlace` di `js/06-input.js`; bayangan di `js/05-render.js`; tombol di `index.html` + `style.css` + `js/13-ui.js`; `pickBuildItem`/`cancelPlacing` di `js/13-ui-build.js`; alur Pindah di `js/13-ui-inspect.js`.)
- [x] Spawn Kota -> Gunung pindah lagi (tambahan Agus, dilipat ke v27): dari (15,10) ke (14,10) = Agus (2,15), satu petak di barat pintu Gunung -> Kota, masih di atas jalan (`MAP_EXITS` di `js/03-data-items.js`, entri jembatan kota (8,0)). Jembatan kota (8,0) tidak diubah; diam di (14,10) tetap di Gunung, injak pintu (15,10) tetap pindah ke Kota lahir (8,1).
- [x] Tes regresi baru: headless dan Playwright menegaskan ketuk petak cuma bayangan, centang menaruh, X/Escape batal tanpa menaruh, PUTAR memutar arah, ketuk petak lain memindah bayangan, centang di gerbang ditolak, conveyor tetap berantai, pindah mesin ikut alur baru, dan spawn baru (14,10) = Agus (2,15). Cek lama yang mengunci ketuk-langsung-taro dan spawn (15,10) diperbaiki.

Tes: headless 205/205, Playwright 127/127, nol error konsol. Versi aset: ?v=27.

## Sudah live — v28 (19 Nov 2026)

- [x] Lahan (perintah Agus): gerbang jadi jalan, sisa jalan jadi grass. Petak keluar (8,11) = Agus (1,9) kini jalan polos tanpa gambar gerbang; jalan pendek lama (8,7)-(8,10) = Agus (x=2-5, z=9) kini rumput dan bisa dibangun — lahan tinggal 1 petak jalan. Pemicu keluar di (8,11), titik lahir di lahan (8,10), dan `gatePos()` tidak berubah; penjaga `canPlace` untuk petak gerbang tetap dipertahankan (ekspansi memindah gerbang ke petak rumput, jadi penjaga itu masih perlu). (`js/03-map-lahan.js`, gambar gerbang dihapus dari `js/05-render.js`; pelukis + sel atlas gerbang dibiarkan seperti stasiun v18.)
- [x] Kota (perintah Agus): kotak plot jadi jalan. Petak (8,11) = Agus (1,9) kini jalan, kolom jalan gx=8 nyambung sampai tepi bawah; kotak putih (obj `plotpad`) dihapus. `S.plotPad` tetap di (8,11) sebagai posisi pemicu masuk lahan dan patokan lahir kembali; hanya rupanya yang berubah. (`js/03-map-kota.js`.)
- [x] Lampu kota pindah (tambahan Agus, dilipat ke v28): (9,4)->(5,2), (6,10)->(7,8), (4,13)->(5,15) = game (3,3)->(1,7), (9,6)->(7,5), (12,8)->(14,7). Jumlah tetap 3; petak tujuan rumput kosong (dicek dari kode); (9,6) kembali jalan polos. (`js/03-map-kota.js`.)
- [x] Teks ikut diperbarui (gerbang/kotak putih sudah tidak ada): 2 langkah tutorial (`js/03-data-tutorial.js`), teks Bantuan (`index.html`), 2 toast bangun (`js/06-input.js`, `js/13-ui-build.js`).
- [x] Migrasi simpan lama (`js/12-simpan.js`): cek usang kota kini `grid[11][8].t !== 'road'` (bukan `obj !== 'plotpad'`, supaya tidak bangun ulang tiap muat) + cek lampu baru (1,7); cek usang lahan baru (`plotStale`) membangun ulang grid lahan di ukuran saat ini (ekspansi terjaga) dengan jalan hanya di petak keluar — plot tidak ikut `buildStaticMaps()`, jadi dibangun ulang terpisah. Simpan baru v28 tidak dibangun ulang (dicek: petak jalan lain yang diubah tetap berubah sesudah muat). Progres pemain tetap.
- [x] Tes regresi baru: headless memeriksa lahan 1 jalan + bekas jalan rumput dan bisa dibangun (Sawhorse terpasang di (8,9)), jalan keluar tetap tidak bisa ditaruh, pergi-pulang tetap jalan, lampu baru + lampu lama hilang, migrasi v28 + simpan baru tidak dibangun ulang; Playwright memeriksa data + jalan nyata dan lampu baru. Cek visual memeriksa piksel: (8,11) bukan rumput, (8,9) rumput; screenshot lahan/kota/lampu dilihat langsung. Cek lama yang mengunci jalan pendek, gambar gerbang, dan obj plotpad diperbaiki.

Tes: headless 220/220, Playwright 129/129, nol error konsol. Versi aset: ?v=28.

## Sudah live — v29 (19 Nov 2026)

- [x] 7 mesin baru di kategori Machines (perintah Agus "Semuanya", riset 3.2/3.3): Electric Saw (Research 4 Nails, resep Sawhorse 2x cepat: 1 Log jadi 3 Plank / 2 Pillar dalam 3 dtk), Advanced Saw (Research $500 + Motor + Iron Frame, 2 Log jadi 7 Plank / 4 Pillar dalam 10 dtk), Textiles Machine (Research $500 + Iron Frame + 4 Coil — biaya riset asli 1 Advanced Saw tidak bisa dipakai karena mesin tidak bisa dipanggul sebagai material; 50 Cotton jadi 5 Textiles 7 dtk, 5 Textiles + 1 Dye Can jadi 5 Dyed Textiles 10 dtk), Mining Drill (Research $500 + 2 Iron Beam + 50 Brick + 1 Iron Frame — Steam Engine dibuang; resep disederhanakan tanpa Drill Head: Firelog jadi Iron Ore 30 dtk, Copper Ore 20 dtk, Tin Ore 20 dtk, Clay 10 dtk, Sand 10 dtk), Harvester (Research $1.000 + 2 Motor, tebang otomatis), Tree Generator (Research $500 + 4 Wood Frame, menumbuhkan pohon), Construction Crafter (Research $2.000; Wheel 20 dtk, Cannon Mold 30 dtk, Cannon Barrel 90 dtk, Bronze Cannon 120 dtk — waktu crafter dipilih sendiri, riset diam). Item baru: Textiles, Dyed Textiles, Dye Can, Wheel, Cannon Casting Mold, Cannon Barrel, Bronze Cannon. (`js/03-data-items.js`.)
- [x] Harga jual Bronze Cannon $1.500 (bukan saran $5.000 — riset 4.2 memberi 1.500 per unit, tetap termahal sesudah Motor 225; pelabuhan ikut jadi $1.800). Bed $109, Piano $360 (riset 4.2). Toko Textile: jual ke pemain Textiles 50, Dye Can 24, Dyed Textiles 24; beli dari pemain Textiles 35, Dye Can 16, Dyed Textiles 55; Cotton tetap 25/25. Perhatian: data riset membuat Dyed Textiles bisa dibeli 24 lalu dijual 55 di toko yang sama (arbitrase, uang tak terbatas) — diterapkan apa adanya ikut riset, belum diperbaiki. Carpenter tambah resep Bed (2 Textiles + 2 Pillar + 2 Wood Frame + 2 Nails + 4 Plank, 60 dtk) dan Piano (1 Iron Frame + 1 Bench + 4 Coil + 1 Table, 60 dtk). (`js/03-data-items.js`, `js/11-ekonomi.js`.)
- [x] Perilaku Tree Generator + Harvester (dipilih sendiri, perintah tidak mengatur): Tree Generator tiap 20 dtk menumbuhkan 1 pohon di petak rumput kosong pertama yang bersebelahan (urutan +x, +y, -x, -y), melewati petak pemain dan petak berisi bangunan; pohonnya node biasa (hp 3, bisa ditebang pemain juga). Harvester tiap 12 dtk menebang pohon hidup terdekat di lahan (jarak Manhattan berapa pun), mencabut sampai akar supaya Tree Generator bisa menanam lagi di situ, +3 Log ke output (sama seperti pemain menebang 1 pohon penuh). Keduanya hormat Stop, progress bar menunjukkan siklusnya. (`js/09-mesin.js`.)
- [x] Ikon menu bangun = gambar sprite asli (perintah Agus: gambar di menu sama dengan yang tertempel): kotak warna (`span.sw`) diganti `Atlas.iconCanvas(item.id)` untuk SEMUA item menu bangun (mesin, conveyor, storage, decor, wall), jatuh ke kotak warna kalau Atlas belum siap atau sel tidak ada. Tiap mesin baru punya sel atlas + pelukis prosedural sendiri (16 sel baru, total sprite 89, tanpa tabrakan — dicek headless). (`js/13-ui-build.js`, `js/04-atlas.js`, `js/05-paint-mesin.js`, `js/05-paint-item.js`, `assets/atlas-manifest.json`.)
- [x] Perbaikan ikut v29: `researchCostText` tidak lagi menulis "$0"/"$NaN" untuk riset tanpa uang (Electric Saw: "4 Nails"); panel inspect mesin tanpa resep tidak crash (teks otomatis, tanpa tombol resep/bahan); `getRecipe` null-safe (pageerror "reading '0'" saat ETA tick menghitung mesin tanpa resep — akar masalah ditemukan dari Playwright, diperbaiki di `js/10-resep.js` + ETA dilewati di `js/13-ui-tick.js`); ADMIN selesaikan instan tahan mesin tanpa resep. (`js/11-ekonomi.js`, `js/13-ui-inspect.js`, `js/10-resep.js`, `js/13-ui-tick.js`, `js/09-mesin.js`.)
- [x] Tes regresi baru: headless memeriksa data/resep/riset/harga/toko/rantai tekstil/drill/crafter/Bed/Piano, Tree Generator menumbuhkan pohon, Harvester menebang jadi 3 Log, Stop diam, ADMIN instan tidak crash, simpan memuat mesin baru, manifest JSON = embedded + tanpa tabrakan sel; Playwright memeriksa tiap ikon menu bangun sama pikselnya dengan sel atlasnya (imageSmoothingEnabled=false, sama seperti iconCanvas), riset + taruh Electric Saw lewat UI, olah 1 Log jadi 3 Plank, textiles/drill/crafter/treeGen/harvester jalan di browser, panel Tree Generator teks otomatis. Screenshot dilihat langsung: menu Machines berikon sprite, Electric Saw terpasang bergambar gergaji yang sama.
- [x] Dokumen ikut: daftar mesin di `docs/PRD.md` dan `docs/TASK.md` diperbarui (lokal saja, docs tidak ikut deploy).

Tes: headless 259/259, Playwright 145/145, nol error konsol. Versi aset: ?v=29.

## Sudah live — v30 (19 Nov 2026)

- [x] Tutup arbitrase Dyed Textiles (perintah Agus, ikut saran Muse): toko Textile membeli Dyed Textiles dari pemain 55 jadi 16; harga jual toko ke pemain (24) tidak berubah. (`js/03-data-items.js`.)
- [x] Audit arbitrase seluruh tabel harga (semua toko + Exchange harga papan + premi pelabuhan): ditemukan 5 lubang lain, semuanya dari premi pelabuhan (harga papan x1,2) yang membayar lebih dari harga beli termurah — Brick beli 30 jual pelabuhan 36 (+6), WoodFrame beli 48 jual 57 (+9), IronFrame beli 83 jual 99 (+16), Nails beli 25 jual 30 (+5), Cotton beli 25 jual 30 (+5). Ditutup dengan menaikkan harga toko menjual ke pemain di atas premi pelabuhan: Exchange Brick 30 jadi 37, WoodFrame 48 jadi 58, IronFrame 83 jadi 100; Blacksmith Nails 25 jadi 31; Textile Cotton 25 jadi 31. Harga papan (ITEMS.price) tidak diubah kecuali Dyed Textiles.
- [x] Harga papan Dyed Textiles 55 jadi 16 (supaya lubang tertutup tuntas: Exchange dan pelabuhan ikut jadi 16 dan 20, keduanya di bawah harga beli toko 24). Angka 55 di riset adalah harga kapal bajak laut, bukan harga papan kota. Produksi tetap menguntungkan: 5 Dyed Textiles hasil crafting (1 Dye Can beli 24) dijual di pelabuhan 100. (`js/03-data-items.js`.)
- [x] Tes regresi baru: audit headless memeriksa tiap barang yang bisa dibeli — harga jual termahal (semua toko + Exchange + pelabuhan) harus di bawah harga beli termurah; simulasi putaran penuh beli 1 Dyed Textiles (24) lalu jual di textile/Exchange/pelabuhan semuanya rugi (92/92/96); cek lama v29 yang mengunci harga 55 diperbarui. Cek lama beli Cotton di textile disesuaikan (62 jadi 2 Cotton).

Tes: headless 265/265, Playwright 145/145, nol error konsol. Versi aset: ?v=30.

## Sudah live — v31 (19 Nov 2026)

- [x] Mode Admin jadi saklar on/off (perintah Agus, disetujui "betulll"): tombol "Mode Admin: OFF/ON" di bagian atas panel Admin, keadaan tersimpan di save (tetap on sesudah reload). Lima tombol Admin lama tetap ada dan tetap jalan. (`index.html`, `style.css`, `js/13-ui.js`, `js/12-simpan.js`.)
- [x] Saat Mode Admin ON: duit infinite (belanja/riset/bangun/ekspansi tidak mengurangi uang, S.money tidak diubah, HUD menampilkan ∞); semua bangun terbuka (semua mesin + resep tanpa riset); bahan baku infinite (crafting tidak mengurangi buffer input mesin, deposit menyalin bahan tanpa mengurangi tas); crafting instan (crafting baru langsung selesai di tick yang sama); ekspansi lahan langsung maks (24x16). Mesin tanpa resep tidak berubah perilakunya. (`js/01-core.js`, `js/11-ekonomi.js`, `js/10-resep.js`, `js/09-mesin.js`, `js/06-input.js`, `js/13-ui-inspect.js`, `js/13-ui-shop.js`, `js/13-ui-mayor.js`, `js/13-ui-core.js`.)
- [x] Saat Mode Admin OFF: aturan normal kembali (uang, material, dan waktu crafting berkurang lagi). Yang sudah didapat saat on TETAP: uang di angka aslinya, mesin yang terbuka tetap terbuka, ekspansi lahan tetap di maks (tidak dikecilkan lagi).
- [x] Tes regresi baru: headless memeriksa saklar default OFF, ON membuka semua mesin + lahan maks, beli/riset/bangun tanpa uang, crafting instan tanpa mengurangi bahan (Log yang sama mengolah dua kali), crafting jalan walau input kosong, OFF aturan normal kembali, yang didapat saat on tetap, simpan memuat mode admin ON; Playwright memeriksa saklar lewat UI, HUD ∞, deposit menyalin bahan (tas tetap 5 Log), OFF kembali normal, dan mode tersimpan sesudah reload (ON tetap ON, OFF tetap OFF).

Tes: headless 280/280, Playwright 152/152, nol error konsol. Versi aset: ?v=31.

## Sudah live — v32 (19 Nov 2026)

- [x] Tutorial pindah dari bar kiri bawah ke panel kecil di tengah layar (perintah Agus, disetujui "betulll"): bar #target + tombol Lewati dihapus (div, handler, CSS, tulisan tick). Panel #tut-panel muncul pas awal main kalau tutorial belum selesai: teks ajakan + tombol Lewati dan Lanjut. Lewati = tutorial mati total (tutDone), panel hilang, tidak muncul lagi. Lanjut = tutorial jalan, 8 langkah TETAP SAMA (isi/syarat tidak diubah), tiap langkah tampil di panel, tombol Lewati tetap ada buat skip sisanya. Kalau tutDone, panel tidak muncul sama sekali. (`index.html`, `style.css`, `js/01-core.js`, `js/03-data-tutorial.js`, `js/12-simpan.js`, `js/13-ui-core.js`, `js/13-ui-tick.js`, `js/13-ui.js`.)
- [x] Panel tembus ketuk kecuali tombolnya (pointer-events none, tombol auto), supaya tidak menutupi petak dan tombol penting saat main. Tombol dibuat kecil dan di tengah (min-width 110px, bukan selebar panel) supaya ketukan petak di balik panel tidak nyasar ke Lewati — ketukan nyasar sempat mematikan tutorial di tengah tes Playwright sebelum perbaikan ini.
- [x] Keadaan baru S.tutStarted (sudah menjawab ajakan atau belum), tersimpan di save; simpan lama yang sudah di tengah tutorial dianggap sudah mulai (ajakan tidak nongol lagi).
- [x] ETA crafting tetap tampil di panel selama tutorial jalan; sesudah tutorial selesai tidak ada lagi tampilan ETA (bar target yang dulu menampilkannya sudah dihapus).
- [x] Tes regresi baru: headless memeriksa panel ajakan di save baru, Lanjut menampilkan langkah 1, tombol Lanjut hilang sesudah mulai, langkah maju ke 2 saat syarat terpenuhi, Lewati menyembunyikan panel, simpan memuat tutStarted + tut; Playwright memeriksa panel tengah + kecil di save baru, Lanjut, langkah maju, Lewati, panel tidak muncul sesudah reload kalau tutDone, plus screenshot panel ajakan dan langkah 1.

Tes: headless 287/287, Playwright 165/165, nol error konsol. Versi aset: ?v=32.

## Sudah live — v33 (19 Nov 2026)

- [x] Conveyor tidak nyangkut lagi (bug laporan Agus, drill dua arah: Firelog tidak bisa masuk, IronOre tidak bisa keluar): updateConveyors() dulu menarik barang apa saja dari output mesin tanpa mengecek depannya — sekali nyangkut (contoh Log di depan drill, IronOre di depan rumput kosong) conveyor tidak pernah narik lagi dan rantai mati. Sekarang cabang tarik hanya mengambil barang yang bisa diantar ke depan (conveyor kosong, mesin yang menerima, atau storage yang muat); kalau depan buntu, barang dibiarkan di output mesin sampai depan kosong (backpressure, bukan deadlock). Drill, resep, dan harga tidak diubah. (`js/09-mesin.js`.)
- [x] Conveyor yang sudah macet di save lama bisa dihapus: ketuk conveyor membuka panel periksa dengan tombol Hapus (+$100 refund) — sudah ada sejak dulu, diverifikasi lewat tes Playwright (ketuk -> panel Conveyor -> Hapus -> conveyor hilang, uang +$100). Agus hapus conveyor macetnya sendiri dari game.
- [x] Tes regresi baru: headless memeriksa conveyor tidak menarik Log kalau depannya drill, tetap menarik Firelog, rantai penuh TreeGen > Harvester > Conveyor > Splitter > Conveyor > Drill tetap jalan (Firelog 110 masuk drill, 5 Iron Ore keluar), conveyor menunggu saat depan penuh lalu narik sesudah kosong, IronOre tidak ditarik kalau depannya buntu, IronOre mengalir ke storage sesudah storage ditaruh di depan; Playwright memeriksa yang sama di browser plus ketuk conveyor -> panel -> Hapus + refund.

Tes: headless 296/296, Playwright 169/169, nol error konsol. Versi aset: ?v=33.

## Sudah live — v34 (19 Nov 2026)

- [x] Jalan keluar lahan tetap di Agus (1,9) di semua ukuran (perintah Agus, GAS): ekspansi dulu menempel grid lama di pojok kiri atas sehingga gerbang (floor(w/2)) geser z 9 ke 13 dan jalan lama ketinggalan di tengah lahan. Sekarang gatePos() tetap (8, h-1) di semua ukuran; expandPlotGrid menyalin grid lama dengan tepi bawah dan tepi kiri tetap (offset gy = selisih tinggi) sehingga jalan lama mendarat di gerbang baru, kolom baru tumbuh ke kanan (z membesar), baris baru ke atas (x membesar). Migrasi simpan lama di loadGame: lahan dianggap basi kalau jalan tidak tepat satu petak di gerbang, lalu dibangun ulang di ukuran ekspansinya (ekspansi tetap terjaga). (`js/01-core.js`, `js/12-simpan.js`.)
- [x] Tombol X / putar / centang melayang di dekat bayangan (referensi gambar 2 yang disetujui Agus): tiga tombol bulat (X merah, ↻ emas, ✓ hijau) pindah dari bar bawah ke klaster `#place-btns` yang posisinya mengikuti petak bayangan tiap frame (kanan bayangan, pindah ke kiri kalau mentok tepi; ikut hover kalau belum ada bayangan; tengah bawah kalau tidak ada juga; dijepit ke dalam layar supaya tidak keluar di HP). Id dan handler sama (btn-place-cancel, btn-rotate, btn-place-ok); teks hint ikut diperbarui. (`index.html`, `style.css`, `js/13-ui-tick.js`, `js/13-ui-build.js`, `js/13-ui-inspect.js`.)
- [x] Tes regresi baru: headless memeriksa gerbang Agus (1,9) + satu jalan di gerbang + jalan lama jadi rumput di semua ukuran 18x13, 20x14, 22x15, 24x16, migrasi simpan lama (jalan ketinggalan di (8,11) pindah ke gerbang (8,12)), dan posisi tombol (kanan bayangan, pindah kiri saat mentok, tengah bawah tanpa bayangan, diam saat tidak menaruh); Playwright memeriksa ekspansi maks + gerbang di browser, tombol bulat + melayang, putar/centang/X lewat klik nyata, plus screenshot lahan 24x16 dan klaster tombol. Satu tes lama diperbaiki: ketuk jalan keluar HP sesudah ekspansi 18x13 pindah dari (9,12) ke (8,12) karena gerbang lama (9,12) sudah tidak berlaku.

Tes: headless 313/313, Playwright 177/177, nol error konsol. Versi aset: ?v=34.

## Sudah live — v35 (19 Nov 2026)

- [x] Wagon = transportasi (referensi gambar 1 yang disetujui Agus, kecepatan jalan kaki lv1, wagon lv2, kereta lv3): beli $100 di menu Plot, muncul di depan lahan (8,10); ketuk wagon untuk naik (jalan lebih cepat, wagon ikut petak pemain), ketuk lagi untuk turun. Naik tingkat wagon lv2 $500 / lv3 $1.500 / lv4 $4.000 (peti 5/10/20/40, kecepatan naik), kuda speed+ $100 lalu speed++ $500 (pengali 1,6/2,0/2,5), respawn $5. Peti wagon di panel Tas (Muat/Ambil). Tampilan ikut gambar referensi: kuda cokelat + gerobak kayu berisi peti. (`js/01-core.js`, `js/03-data-items.js`, `js/05-paint-node.js`, `js/07-pemain.js`, `js/11-ekonomi.js`, `js/13-ui-tas.js`, `js/13-ui-plot.js`.)
- [x] Perkakas: kapak, sekop, pickaxe — ketiganya dasar gratis sejak awal (pola kapak ikut ketiganya, tanpa daya tahan); upgrade Bronze $250 lalu Iron $1.000 di Tool Shop (Trading Post, kota seberang Blacksmith), upgrade bikin panen lebih cepat (ayunan berkurang). Panen butuh perkakas yang tepat: pohon pakai kapak, bijih pakai pickaxe, pasir/tanah liat pakai sekop; tanpa perkakas, panen tidak mulai + toast "Beli X dulu di Tool Shop". Tool Shop juga jual/beli Iron Beam, Engine ($192), Drill Head ($141) ikut wiki. (`js/03-data-items.js`, `js/07-pemain.js`, `js/11-ekonomi.js`, `js/13-ui-shop.js`.)
- [x] Node sumber daya di dunia: tumpukan pasir di tepi sungai Hutan (1,1)/(15,1) dan Pelabuhan, bijih besi (9,3) + tembaga (12,8) tambahan di Gunung; hasil masuk tas. (`js/03-map-hutan.js`, `js/03-map-gunung.js`.)
- [x] Patung + Housing: batas Housing default 600, tiap bangunan menambah housing (mesin 10, conveyor 2, storage 5, dinding/dekor 1, patung 0) dan angkanya tampil di menu Bangun; 5 patung di kategori Statues (Lion +50/$500, Miner +100/$1.000, Lumberjack +100/$1.000, Blacksmiths +150/$2.000, Liberty +200/$5.000), tiap patung hanya bisa ditaruh sekali; kalau housing penuh, bangunan baru ditolak + toast. Mode Admin melewati batas. (`js/01-core.js`, `js/03-data-items.js`, `js/05-render.js`, `js/13-ui-build.js`, `js/13-ui-inspect.js`.)
- [x] Badge: diberikan saat membuka resep — Carpenter, Blacksmith, Harvester, Mining Drill (Mode Admin memberi keempatnya); daftar badge di panel Badge (burger menu) dengan status Didapat/Belum. Research tetap jadi cara membuka resep; badge hanya penanda pencapaian. (`js/11-ekonomi.js`, `js/13-ui-badge.js`.)
- [x] 4 save: menu Plot (tanda kuning di depan lahan + tombol Plot di burger) — 4 slot save, tiap slot punya 4 tingkat ukuran ikut sistem Mayor; Muat (slot sekarang disimpan dulu), Lepas (simpan lalu kosong, autosave berhenti), Reset per slot (Barang / Bangunan / Upgrade lahan, bisa untuk slot lain tanpa memuatnya), respawn wagon $5. Simpan lama (indotopia-tycoon-save-v2) menjadi slot 1 otomatis, lengkap dengan badge dari resep yang sudah dibuka. (`js/12-simpan.js`, `js/13-ui-plot.js`, `js/03-map-kota.js`.)
- [x] Tes regresi baru: headless memeriksa perkakas (default, biaya, ayunan, beli/upgrade, gerbang panen), wagon (beli, naik tingkat, kuda, naik/turun, ikut pemain, lebih cepat, peti, respawn), housing (biaya, patung, penuh menolak, Admin lewat), badge (riset + Admin), slot (simpan/muat/lepas/reset per bagian/migrasi), plotsign; Playwright memeriksa menu Plot, beli + naik/turun wagon, Tool Shop, patung Lion, panel Badge, pindah slot, plus screenshot wagon dan patung. Dua tes lama disesuaikan (burger 4 jadi 6 tombol, kategori bangun 5 jadi 6) dan satu tabrakan petak tes diperbaiki (storage box v33 di (12,5)).

Tes: headless 354/354, Playwright 192/192, nol error konsol. Versi aset: ?v=35.

## Sudah live — v36 (19 Nov 2026)

- [x] Badge Cannon (badge ke-5): diberikan saat resep Construction Crafter dibuka (riset $2.000); simpan lama yang sudah buka Crafter ikut dapat badge saat migrasi. Tampil di panel Badge (burger menu). (`js/11-ekonomi.js`, `js/12-simpan.js`, `js/13-ui-badge.js`.)
- [x] Conductor + stasiun, Kota dibesarkan 16x12 jadi 20x14: sistem map kini dukung ukuran per-map; jalan masuk lahan pindah ke (8,13) = Agus (1,9), tanda plot ke (7,13), pintu timur ke (19,6), jalan dan rel memanjang ke tepi baru; penggaris, kamera, spawn kereta, dan posisi toko ikut ukuran baru; simpan lama dimigrasikan (kota statis dibangun ulang di ukuran baru, progres tetap). Stasiun kayu biru + menara jam di (17,8) dekat rel, NPC Conductor di peron (16,8), papan jual di peron (5,8); ketuk Conductor atau papan jual membuka panel kereta. (`js/01-core.js`, `js/03-data-items.js`, `js/03-map-kota.js`, `js/05-paint-v36.js`, `js/07-pemain.js`, `js/12-simpan.js`.)
- [x] Toko SUPPLY di (17,7) sebelah rel: toko uang biasa seperti toko lain, jual/beli bahan dasar harga papan (jual Log 7/Plank 6/Pillar 12/Firelog 11/Brick 30/Sand 4/Clay 5/IronOre 8/CopperOre 6/TinOre 10/Cotton 25; beli di atas harga jual tertinggi per aturan v30). Isi toko ini turunan — isi asli game Roblox belum terverifikasi. (`js/03-data-items.js`, `js/03-map-kota.js`.)
- [x] Desa gurun + kapal bajak laut di Pelabuhan (muat di 16x12, Pelabuhan tidak dibesarkan): area gurun gx 10–14 gy 0–4, toko Desert Village di (12,2) jual premium (WoodFrame 32, Log 8, Firelog 12, Wheel 293), stasiun desa di (13,1), kapal bajak laut di (15,2) jual premium (Dyed Textiles 60, Bed 109, Engine 185, Piano 360). Keduanya panel toko terpisah yang didatangi pemain. Harga ikut NamuWiki. (`js/03-data-items.js`, `js/03-map-pelabuhan.js`, `js/05-render.js`.)
- [x] Rantai emas (tanpa mesin baru): node Gold Ore di Gunung (8,2),(10,3),(13,5) ditambang pickaxe; Smelter: 3 Firelog + 2 Gold Ore jadi Gold Ingot (35 dtk), 2 Gold Ingot jadi Gold Plate (20 dtk). Harga turunan (NamuWiki tidak mencantumkan harga emas): Ore $40, Ingot $120, Plate $300. (`js/03-data-items.js`, `js/03-map-gunung.js`.)
- [x] Sorter: conveyor yang hanya melewatkan 1 jenis barang (pilih lewat panel periksa: Semua/Log/Plank/Firelog/bijih/pasir/tanah liat/kapas/Iron Ingot/Brick/WoodFrame); conveyor di depan yang filter-nya tidak cocok menolak barang (backpressure). Inclined Conveyor: varian visual tanjakan (fungsi sama, map datar). (`js/03-data-items.js`, `js/06-input.js`, `js/09-mesin.js`, `js/13-ui-inspect.js`.)
- [x] Storage baru: Storage Barrel 100 slot ($40), Storage Crane (mesin, riset $300 — ambil 1 barang per 5 dtk dari storage di sebelah ke output), Storage Rack Advanced 1.000 slot (dibuat di Construction Crafter: 1 Engine + 1 Rack + 4 Barrel, 120 dtk, 5 housing; Rack/Barrel di sini ITEM yang dibeli di Exchange $150/$40, tidak bisa dijual — bangunan tidak bisa jadi bahan). (`js/03-data-items.js`, `js/06-input.js`, `js/09-mesin.js`, `js/13-ui-build.js`.)
- [x] Benih + palem + renang: 5 benih (Oak, Pine, Palm, Cotton, Dye Flower — $2) didapat dari gali tunggul pohon/kapas/tanaman pewarna mati pakai sekop; tanam lewat tombol Tanam di panel Tas lalu ketuk petak rumput di lahan; tumbuh bertahap (Oak/Pine 4 tahap x 15 dtk, Palm 3 x 15 dtk, Cotton/Dye 2 x 10 dtk), tanaman muda tidak bisa dipanen. Pulau palem di Pelabuhan (14,10),(15,10) + petak mendarat (14,11), dicapai dengan BERENANG (petak air bisa dilewati pemain, gerak setengah kecepatan; wagon otomatis turun saat masuk air). Tanaman pewarna liar di Hutan (12,5),(13,5),(14,5). (`js/03-data-items.js`, `js/03-map-hutan.js`, `js/03-map-pelabuhan.js`, `js/07-pemain.js`, `js/08-gerak.js`, `js/12-simpan.js`, `js/13-ui-tas.js`.)
- [x] Batas + biaya: batas item aktif global 150 (output mesin + barang di conveyor; bukan storage, peti wagon, atau tas — mesin berhenti kalau sudah 150, Admin bebas); buka save slot 2/3/4 bayar $25.000/$50.000/$100.000 (dipotong dari slot yang sedang dimuat saat membuka slot kosong yang terkunci; slot berisi data dihitung sudah terbuka); biaya ekspansi naik per save (pengali slot 1/2/3/4 = 0,5/1/2,5/5 — total $1.700/$3.400/$8.500/$17.000). (`js/03-data-items.js`, `js/10-resep.js`, `js/11-ekonomi.js`, `js/12-simpan.js`, `js/13-ui-mayor.js`, `js/13-ui-plot.js`, `js/13-ui-tas.js`.)
- [x] Ore Generator (mesin, riset $5.000): hasilkan 1 bijih otomatis per 20 dtk, bergiliran Iron/Copper/Tin ke output. Resep Drill Head di Blacksmith (5 Stone + 1 Iron Beam, 50 dtk); node Stone baru di Gunung (13,4),(14,3) ditambang pickaxe, harga Stone $5 (turunan). Rantai pewarna: Dye Flower (dari benih) jadi Dye di Mixing Machine (mesin baru, riset $300, 10 dtk), lalu Dye + Tin Can jadi Dye Can (10 dtk); Tin Can dari TinOre di Blacksmith (10 dtk). Kapak Steel $2.500 (tingkat 4, hanya kapak; sekop/pickaxe maks Iron tingkat 3; kapak Steel 1 ayunan pohon). Grinding Wheel: Blacksmith beli $50 (NamuWiki, tanpa resep) — resep turunan 1 Iron Ingot + 1 Stone (15 dtk). (`js/03-data-items.js`, `js/03-map-gunung.js`, `js/09-mesin.js`.)
- [x] Kereta jadi toko keliling: papan jual di peron tiap map (kota (5,8), hutan (13,8), gunung (8,8), pelabuhan (6,6)); panel kereta kini ada bagian jual (harga papan, tombol 1/10/Semua). Pohon Oak/Pine: jenis pohon dengan tahap tumbuh, terikat sistem benih. Tombol Book di burger menu: panel changelog riwayat versi dari ROADMAP. Conveyor berwarna: pilih warna jalur (Emas default, Ungu/Merah/Hijau/Oranye/Biru) lewat panel periksa conveyor, visual saja, tersimpan di entri conveyor. (`js/03-data-items.js`, `js/03-map-hutan.js`, `js/03-map-gunung.js`, `js/03-map-pelabuhan.js`, `js/13-ui-book.js`, `js/13-ui-train.js`, `js/13-ui-inspect.js`, `js/05-render.js`, `js/05-render-overlay.js`.)
- [x] Perbaikan yang membuat suite lolos (bukan perbaikan gameplay umum): BFS (findPath) tidak lagi melewati petak keluar map saat jalan ke target lain — node Gold/Stone v36 di Gunung menutup rute langsung ke bijih (10,2) sehingga BFS memutar lewat pintu (15,10) dan pemain malah pindah map; pintu tetap bisa dituju sebagai target. (`js/08-gerak.js`.)
- [x] Tes regresi baru: headless memeriksa badge Cannon (+ migrasi), Conductor + papan jual, harga SUPPLY/desert/pirate, rantai emas, Stone + Drill Head + Grinding Wheel + Tin Can, rantai pewarna, Ore Generator + Crane, kapasitas storage + resep Rack Advanced, filter Sorter + frontAccepts, warna conveyor, gali tunggul + tanam + tumbuh bertahap, pulau palem + renang, batas item 150 (+ Admin lewat), biaya slot + ekspansi per save, kapak Steel, jual ke kereta, BFS tidak lewat pintu; Playwright memeriksa panel Book, Conductor + jual ke kereta, desa gurun + kapal bajak laut, renang, tanam benih, Sorter + filter + warna, plus screenshot stasiun dan desa gurun. Tes lama disesuaikan (kota 20x14, jalan masuk (8,13), burger 7 tombol, Machines 16, atlas 128 sprite, ekspansi slot 1 $100, slot 2 $25.000).
- [x] LUBANG ARBITRASE DITUTUP (v37, keputusan Agus "Kapal jadi $20"): Dyed Textiles kapal bajak laut 60 jadi 20 (ikut rumus premium pelabuhan: papan 16 x 1,2 = 19,2 dibulatkan ke atas 20). Beli termurah $24 (Textile) kini di atas harga jual kapal $20 — tidak ada untung. Audit 0 lubang.

Tes: headless 407/407, Playwright 204/204, nol error konsol. Versi aset: ?v=36.

## Sudah live — v37 (19 Nov 2026)

- [x] Kapal bajak laut: Dyed Textiles 60 jadi 20 (tutup lubang arbitrase v36; keputusan Agus). Audit arbitrase 0 lubang. (`js/03-data-items.js`.)

Tes: headless 407/407, Playwright 204/204, nol error konsol. Versi aset: ?v=37.

## Sudah live — v38 (19 Nov 2026)

- [x] Panel kereta cuma dibuka dari klik kereta (lokomotifnya).
- [x] Hapus: NPC Conductor di peron kota, papan jual di 4 map (kota, hutan, gunung, pelabuhan), bangunan stasiun biru di kota. Bagian jual di dalam panel kereta tetap ada. (`js/03-map-kota.js`, `js/03-map-hutan.js`, `js/03-map-gunung.js`, `js/03-map-pelabuhan.js`, `js/07-pemain.js`, `js/12-simpan.js`, `index.html`.)

Tes: headless 407/407, Playwright 204/204, nol error konsol. Versi aset: ?v=38.

## Sudah live — v39 (19 Nov 2026)

- [x] Hapus objek stasiun di Pelabuhan (13,1) dan cek harborStale (`js/03-map-pelabuhan.js`, `js/12-simpan.js`, `index.html`.)

Tes: headless 408/408, Playwright 204/204, nol error konsol. Versi aset: ?v=39.

- Rantai tekstil + Bronze Cannon, quest/trust NPC, Fuel meter terpisah, irigasi, bangunan logika, multi-save

## Cara baca

- Tiap langkah dicentang sesudah dites. Versi live saat ini: v39.
