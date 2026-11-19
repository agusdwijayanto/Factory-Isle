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

- Rantai tekstil + Bronze Cannon, quest/trust NPC, Fuel meter terpisah, irigasi, bangunan logika, multi-save

## Cara baca

- Tiap langkah dicentang sesudah dites. Versi live saat ini: v25.
