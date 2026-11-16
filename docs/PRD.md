# PRD — Indotopia (game kaya Growtopia versi kita)

Disetujui Agus 2026-11-16. Angka-angka di bagian "PRD yang disetujui" MENGIKAT dan tidak boleh diubah diam-diam. Bagian "Keputusan interpretasi" berisi hal yang PRD tidak rinci, diputuskan saat pembangunan dan didokumentasikan di sini.

## PRD yang disetujui

**Dunia**
- Grid 60 lebar x 40 tinggi, petak 32 px. 10 baris atas langit, sisanya tanah dan batu. Kamera mengikuti pemain.
- Perluasan: beli lahan +20 kolom ke kanan, biaya 500, 1000, 2000, 4000, 8000 koin, mentok 5 perluasan.

**Gerak menyamping**
- Jalan 5 petak/detik, lompat setinggi 3 petak, ada gravitasi, jatuh tanpa damage.
- Kontrol: A/D atau panah jalan, W atau spasi lompat, klik atau spasi pukul, E interaksi, B menu bangun. Jangkauan pukul 1 petak ke segala arah. Kontrol sentuh wajib ada (tombol kiri/kanan/lompat/aksi).

**Blok dan pukul**
- Tanah 2 pukulan, kayu 3 pukulan, batu 4 pukulan. Tiap blok hancur menjatuhkan 1 benih + 1 blok bahan. Menaruh blok dari inventory, bongkar kembali bahannya.

**Farming**
- Tanam benih di petak tanah kosong. Waktu tumbuh waktu nyata: gandum 60 detik, pohon 120 detik. Tanaman yang tidak disiram tidak tumbuh tapi tidak mati. Siram dengan tombol aksi di samping tanaman. Musim 28 hari game, 4 musim setahun. Tiap musim hanya tanaman tertentu yang tumbuh; tanaman luar musim berhenti tumbuh. Panen 2 hasil per tanaman.

**Splice dan breeding**
- Splice 2 benih di meja splice menjadi 1 benih baru, tabel resep tetap, 8 resep awal. Bunga bersebelahan bisa menghasilkan bunga baru dengan warna dari aturan genetik sederhana, peluang 25% per hari game per pasangan. Buku resep mencatat semua resep yang ditemukan.

**Crafting**
- Stasiun meja kerja 10 kayu, tungku, meja splice. Crafting hanya saat berdiri dekat stasiun. 10 resep awal. Buku resep menunjukkan resep dari bahan yang dimiliki.

**Ekonomi**
- Koin melekat di player. Toko NPC harga tetap. Hasil jualan masuk kotak kirim dan dibayar besok pagi. Batas jual dan beli 20 item per hari. Mata uang tugas hanya dari misi, dipakai di toko hadiah.

**Pasar lobak (TERPISAH dari toko utama)**
- Beli hari Minggu harga 90 sampai 110, jual Senin sampai Sabtu harga berubah 2 kali sehari, mentok 660, 4 pola harga, lobak busuk tiap Minggu. Minggu lobak = 7 hari game.

**Skill dan profesi**
- 3 skill (Bertani, Menebang, Menambang). 10 tingkat, profesi di tingkat 5 dan 10. XP dari aktivitas, butuh tingkat dikali 100 XP per tingkat. 2 pilihan profesi per skill.

**NPC dan misi**
- 2 NPC awal (pedagang dan pemberi misi). 3 misi harian (kumpul, tanam, splice), hadiah mata uang tugas dan koin.

**Hari**
- 1 hari game = siang 3 menit + malam 1,5 menit. Tidak ada monster malam di versi ini.

**Rasa main**
- Bunyi WebAudio, partikel, angka melayang, getar layar, perayaan pencapaian pertama. HUD: koin, mata uang tugas, hari, musim, jam.

**Di luar lingkup:** multiplayer, trade antar player, lock, rarity, chat, guild, dungeon dan boss, musik latar.

**Kunci simpan:** indotopia-gt-save-v1 (baru, bukan kunci game desa).

## Keputusan interpretasi (PRD tidak merinci, diputuskan saat pembangunan)

**Kontrol dan aksi**
- Spasi = lompat SEKALIGUS memukul ke arah hadap (PRD menyebut spasi untuk lompat dan untuk pukul). W = lompat saja. Klik = pukul petak yang diklik saja. Tombol sentuh LOMPAT dan AKSI terpisah; AKSI = pukul ke arah hadap.
- Klik pada petak: tanaman matang dipanen, tanaman belum disiram disiram, blok dipukul, dalam urutan itu sesuai isi petak yang diklik. Klik pada NPC membuka panel NPC. E = interaksi dengan yang terdekat (NPC, stasiun, kotak kirim, tanaman).
- Tombol tambahan: I = tas (inventory), P = skill, O = buku resep. Petak yang bisa ditaruh blok jangkauannya 2 petak (pukul tetap 1 petak), supaya membangun ke atas masih nyaman.
- Tanaman disiram bertahan sampai fajar berikutnya, lalu harus disiram lagi. Menanam di luar musim boleh, tapi tanaman tidak tumbuh sampai musimnya tiba.

**Fisika**
- Gravitasi 1200 px/detik^2, kecepatan lompat 480 px/detik (puncak lompatan = 3 petak persis). Kecepatan jalan 160 px/detik (5 petak/detik). Kecepatan jatuh mentok 600 px/detik.

**Dunia dan blok**
- Permukaan tanah berundak 10-12 baris dari atas (angka awal). Di bawah permukaan: tanah sampai baris 24, lalu campuran tanah dan batu, makin dalam makin banyak batu.
- Blok tanah yang hancur menjatuhkan 1 benih gandum + 1 tanah. Blok kayu menjatuhkan 1 benih pohon + 1 kayu. Blok batu menjatuhkan 1 benih bunga + 1 batu.
- Petak yang ditaruh pemain dicatat; membongkarnya mengembalikan SELURUH biaya bahannya (PRD tidak menyebut setengah). Blok alami yang hancur mengikuti aturan benih + bahan di atas.
- Biaya taruh: tanah 1 tanah, kayu 1 kayu, batu 1 batu, pagar 2 kayu, obor 1 kayu, bata 2 batu, papan 1 kayu, meja kerja 10 kayu, tungku 20 batu, meja splice 30 kayu + 10 batu, kotak kirim 10 kayu.
- HP petak hias/stasiun (PRD hanya mengatur tanah/kayu/batu): pagar 1, obor 1, bata 4, papan 2, meja kerja 5, tungku 5, meja splice 5, kotak kirim 5, peti 2, lampion 1.
- Saat dunia dibuat, 1 meja kerja dan 1 kotak kirim sudah terpasang dekat titik spawn supaya loop bisa mulai. Inventaris awal kosong, koin awal 0.

**Daftar tanaman per musim (musim: 0=Semi, 1=Panas, 2=Gugur, 3=Dingin)**
- Gandum: 60 dtk, Semi+Panas, panen 2 gandum.
- Pohon: 120 dtk, Semi+Panas+Gugur, panen 2 kayu.
- Bunga liar (benih bunga): 90 dtk, Semi+Panas, panen 2 bunga warna dasar acak (warna diundi saat tanam).
- Labu: 90 dtk, Gugur, panen 2 labu.
- Apel: 150 dtk, Semi+Panas+Gugur, panen 2 apel.
- Pinus: 180 dtk, semua musim, panen 2 kayu.
- Bunga matahari: 90 dtk, Panas, panen 2 bunga matahari.
- Stroberi: 90 dtk, Semi, panen 2 stroberi.
- Sakura: 150 dtk, Semi, panen 2 sakura.
- Melon: 120 dtk, Panas, panen 2 melon.
- Anggur: 120 dtk, Gugur, panen 2 anggur.
- Bunga pelangi: 150 dtk, Semi+Panas, panen 2 bunga pelangi.
- Tanaman emas: 180 dtk, Panas+Gugur, panen 2 buah emas.
- Bunga warna (merah/kuning/putih/oranye/pink/ungu): 90 dtk, Semi+Panas, panen 2 bunga warna itu.
- Musim Dingin: hanya pinus yang tumbuh; tanaman lain berhenti tumbuh (tidak mati).

**Tabel 8 resep splice (urutan benih bebas)**
1. Benih gandum + benih gandum = benih labu.
2. Benih gandum + benih pohon = benih apel.
3. Benih pohon + benih pohon = benih pinus.
4. Benih bunga + benih bunga = benih bunga matahari.
5. Benih gandum + benih bunga = benih stroberi.
6. Benih pohon + benih bunga = benih sakura.
7. Benih labu + benih apel = benih melon.
8. Benih stroberi + benih bunga matahari = benih anggur.
- Resep splice "ditemukan" saat pemain memegang kedua benih bahannya bersamaan; buku resep hanya menampilkan resep yang ditemukan. Splice hanya bisa di dekat meja splice.

**Tabel warna genetik bunga (pasangan bunga matang bersebelahan, peluang 25% tiap fajar)**
- Merah+merah=merah, kuning+kuning=kuning, putih+putih=putih.
- Merah+kuning=oranye, merah+putih=pink, kuning+putih=ungu.
- Pasangan dengan warna campuran: warna campuran menang (mis. merah+oranye=oranye, kuning+pink=pink, putih+ungu=ungu).
- Oranye+pink=ungu, oranye+ungu=ungu, pink+ungu=ungu, campuran+campuran sama=warna itu.
- Bunga baru tumbuh di petak kosong bersebelahan dengan pasangan (kiri pasangan didahulukan, lalu kanan). Bunga matahari, sakura, dan bunga pelangi tidak ikut breeding. Pasangan dihitung sekali per fajar, kiri ke kanan.

**Daftar 10 resep crafting**
- Meja kerja: pupuk (2 gandum), buket bunga (3 bunga warna apa saja), peti (8 kayu), lampion (1 kayu + 1 bunga matahari).
- Tungku: roti (2 gandum), kue labu (1 labu + 1 gandum), jus apel (2 apel), selai stroberi (2 stroberi).
- Meja splice: benih pelangi (1 benih bunga oranye + 1 benih bunga pink), benih emas (1 benih melon + 1 benih anggur).
- Crafting hanya dalam jarak 2 petak dari stasiun. Pupuk dipakai pada tanaman: langsung menambah 30 detik pertumbuhan.

**Daftar harga tetap toko (koin)**
- Jual (toko membeli darimu): gandum 10, kayu 8, batu 6, tanah 2, labu 30, apel 25, bunga matahari 20, stroberi 20, sakura 30, melon 40, anggur 35, bunga merah/kuning/putih 15, bunga oranye/pink/ungu 30, bunga pelangi 100, buah emas 150, roti 25, kue labu 50, jus apel 30, selai stroberi 30, buket bunga 80, pupuk 15, benih gandum 3, benih pohon 4, benih bunga 3, benih labu 10, benih apel 12, benih pinus 12, benih bunga matahari 10, benih stroberi 10, benih sakura 15, benih melon 20, benih anggur 18, benih pelangi 50, benih emas 75, benih bunga merah/kuning/putih 8, benih bunga oranye/pink/ungu 15.
- Beli (toko menjual padamu): benih gandum 5, benih pohon 8, benih bunga 6, pupuk 15.
- Batas harian: 20 item terjual DAN 20 item terbeli per hari (penghitung terpisah). Menjual selalu lewat kotak kirim (dibayar fajar berikutnya), dari panel pedagang maupun dari objek kotak kirim.
- Toko hadiah (mata uang tugas): benih pelangi 10, benih emas 15, benih bunga ungu 6, buket bunga 8.

**4 pola harga lobak (harga beli Minggu 90-110 acak; harga jual Senin-Sabtu, 2 harga per hari: pagi dan sore; sore mulai tengah hari)**
- Fluktuasi: jalan acak naik-turun 40-180.
- Menurun: mulai 100-110, tiap slot dikali 0,88, mentok bawah 30.
- Lonjakan kecil: dasar menurun, satu slot acak 150-250.
- Lonjakan besar: dasar menurun, slot 6-8 melonjak 300-660 (puncak di slot 7), lalu menurun.
- Hari Minggu hanya bisa beli, Senin-Sabtu hanya bisa jual. Lobak yang masih dipegang saat fajar Minggu menjadi busuk dan dihapus. Jual/beli lobak memakai batas harian yang sama dengan toko. Hasil jual lobak dibayar LANGSUNG (bukan lewat kotak kirim), karena pasar lobak terpisah dari toko utama.

**Skill dan profesi**
- XP: menanam +5, panen +10, splice +15 (Bertani); menghancurkan blok kayu +8 (Menebang); menghancurkan blok batu +8 (Menambang). Naik tingkat saat XP mencapai tingkat x 100, lalu XP sisa dibawa.
- Profesi tingkat 5, pilih 1 dari 2: Bertani: Panen Ganda (25% panen +1 hasil) atau Tangan Hijau (tumbuh 25% lebih cepat). Menebang: Kapak Tajam (blok kayu butuh 1 pukulan lebih sedikit) atau Penanam (+1 benih dari blok kayu). Menambang: Beliung Kuat (blok batu butuh 1 pukulan lebih sedikit) atau Pemburu Batu (+1 blok batu).
- Profesi tingkat 10, pilih 1 dari 2: Bertani: Master Tani (harga jual hasil tani +50%) atau Penjaga Musim (tanaman tumbuh di semua musim). Menebang: Penebang Ulung (blok kayu butuh total 2 pukulan lebih sedikit) atau Kayu Berharga (harga jual kayu +50%). Menambang: Penambang Ulung (blok batu butuh total 2 pukulan lebih sedikit) atau Batu Berharga (harga jual batu +50%).
- Pengurangan pukulan tidak boleh membuat HP blok di bawah 1. Pilihan profesi yang belum diambil bisa diambil kapan saja lewat panel skill.

**Templat misi (3 per hari: 1 kumpul, 1 tanam, 1 splice; dibuat tiap fajar)**
- Kumpul: kumpulkan N item (gandum/kayu/batu, atau hasil musim yang sedang berjalan), N = 5 + 2 per minggu permainan, mentok 20. Hadiah: 10 koin per item + 1 mata uang tugas per 5 item.
- Tanam: tanam N benih apa saja, N = 3 + 1 per minggu permainan, mentok 10. Hadiah: 10 koin per benih + 1 mata uang tugas per 5 benih.
- Splice: lakukan N splice, N = 1 + 1 per 2 minggu permainan, mentok 3. Hadiah: 30 koin per splice + 2 mata uang tugas per splice.
- Progres kumpul dihitung dari item yang DIDAPAT hari itu (panen/pukul), bukan isi tas. Hadiah diambil di NPC pemberi misi; misi tidak selesai hangus saat fajar berikutnya.

**NPC**
- Pedagang: panel toko (beli, jual, lobak). Pemberi misi: panel misi + toko hadiah. Posisi: pedagang di kiri titik spawn, pemberi misi di kanan titik spawn, keduanya berdiri di permukaan. Interaksi dalam jarak 2 petak.
