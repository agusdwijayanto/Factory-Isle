# TASK — Indotopia Remake

15 langkah, sesuai urutan dependensi. Semua selesai dan dites
(headless 135 cek + Playwright 17 cek, 0 error konsol).

1. Rangka + world: grid 100x60, bedrock, world bernama, masuk dengan mengetik
   nama, simpan dan muat localStorage. Lolos: world baru dari nama, tutup lalu
   buka lagi, isinya utuh.
2. Gerak + fisika + kamera: jalan, lompat, gravitasi, kamera ikut pemain,
   zoom roda mouse. Lolos: jalan 5 petak per detik, lompat 3 petak, kamera
   tidak keluar batas world.
3. Kontrol HP + PC: tombol sentuh kiri/kanan/lompat, keyboard, klik mouse,
   dock Fist/Wrench. Lolos: semua input jalan di kedua mode, ganti mode
   mengubah aksi ketuk.
4. Pukul + blok: cadence 0,2 detik, retakan, jangkauan 3, foreground di atas
   background, drop benih plus bahan, tabel item. Lolos: blok pecah sesuai
   jumlah pukulan, drop masuk tas.
5. Farming + pohon: tanam di atas blok, rumus tumbuh, panen buah plus benih
   plus gems, gems fisik bergabung. Lolos: pohon tumbuh sesuai rumus, gems
   bergabung per denominasi.
6. Splice + buku resep: benih di atas bibit, 10 resep awal, buku mencatat
   temuan. Lolos: 10 resep menghasilkan benih benar, buku hanya menampilkan
   yang ditemukan.
7. Tas + UI dasar: grid scroll, jumlah, cari, RECYCLE/STORE/DROP/INFO/FAV,
   dialog biru, HUD gems. Lolos: semua tombol tas bekerja.
8. Store + lock + ekonomi: Store harga tetap, beli lock, gabung dan pecah
   WL/DL/BGL, lock menandai area. Lolos: 100 WL menjadi 1 DL, lock mengunci
   areanya.
9. Trading + NPC: jendela trade 4 stack x 200, konfirmasi dua pihak, NPC
   keliling stok berputar. Lolos: trade jalan hanya sesudah kedua pihak
   konfirmasi, gems tidak bisa masuk jendela.
10. Vending machine: beli, taruh, isi, harga WL, NPC membeli berkala. Lolos:
    NPC membeli, stok berkurang, hasil masuk.
11. Progresi: XP, cap level 125, role Farmer dan Builder sampai 10, nama biru.
    Lolos: XP sesuai rumus, role naik dari aksi yang benar.
12. Sosial solo: guild, WOTD, broadcast sistem, chat plus perintah. Lolos:
    guild terbentuk, WOTD berganti harian, chat menampilkan umpan balik.
13. Panel admin: beri gems, beri item, beri lock, atur level dan XP, buka
    semua resep, tumbuh seketika, teleport, kosongkan world, reset save.
    Lolos: tiap tombol mengubah state dengan benar.
14. Suara + rasa: SFX pukul, gems, tanam, splice, kasir, teks melayang.
    Lolos: SFX berbunyi di aksi yang benar, 0 error konsol.
15. Tes + deploy: tes headless dan Playwright, push ke repo Indotopia,
    verifikasi live md5, nomor versi aset naik. Lolos: semua tes lolos,
    live sama dengan lokal. (Push dan verifikasi live oleh Muse; subagent
    pembangun tidak push.)

Urutan: 1 lalu 2 lalu 3 lalu 4, 5 dan 6 sesudah 4, 7 sesudah 4, 8 sesudah 7,
9 dan 10 sesudah 8, 11 sesudah 5, 12 sesudah 7, 13 sesudah 5/7/8/11,
14 sesudah 4/5, 15 terakhir.
