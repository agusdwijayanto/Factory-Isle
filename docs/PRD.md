# PRD — Indotopia Remake

## 1. Tujuan
Salinan Growtopia single-player di browser yang bisa dimainkan dan dites Agus
dari panel admin, sepersis mungkin dengan aslinya sebelum dimodifikasi
menjadi versi kita.

## 2. Pengguna
Agus sendiri, main di HP dan PC, mengetes fitur lewat panel admin.

## 3. World
- Grid 100x60, TILE 32, 6 baris bedrock di bawah, 54 baris terpakai.
- Masuk dengan mengetik nama; nama baru berarti world baru. Nama 1-24 karakter
  huruf/angka; nama terlarang (SETH, HAMUMU, ADMIN, GOD, SATAN, HITLER,
  SYSTEM, MODERATOR) ditolak.
- Generasi: permukaan bervariasi, ~24 lapis tanah, lalu campuran batu/tanah,
  kantong lava di lapis 7-10 dari bawah, latar gua di bawah permukaan,
  Main Door acak di permukaan dengan bedrock di bawahnya.
- Tiap world tersimpan sendiri. Nama world pertama default: AWAL.

## 4. Gerak
Menyamping, lompat + gravitasi, tanpa fall damage. Jalan 5 petak/detik
(160 px/detik), lompat 3 petak (gravitasi 1200 px/s2, kecepatan lompat
480 px/s). Kamera ikut pemain, tidak keluar batas world. Zoom roda mouse
0,5x-2x, tersimpan.

## 5. Pukul dan blok
- Pukul tiap 0,2 detik, jangkauan 3 petak (Chebyshev dari petak pemain),
  retakan bertahap + bunyi per pukulan. Kerusakan pulih sesudah jeda
  (8 detik umumnya, 1 detik Glass Pane).
- Blok foreground di atas background. Menghancurkan blok menjatuhkan 1 blok;
  blok spliceable berpeluang 1 dari 5 menjatuhkan benihnya.
- Pintu dipukul = teleport ke pintu lain terdekat; hapus pintu lewat wrench.
- Lava: 20 damage + knockback + api 3 detik per sentuhan (kebal 1 detik);
  HP habis = bangun di Main Door HP penuh. HP regen 5/detik sesudah 5 detik tenang.
- Cat: butuh Paintbrush; cat yang dipilih menentukan warna; Varnish menghapus.
- Weather machine dipukul = cuaca berputar (cerah, hujan, malam, salju), visual saja.
- Lock dan vending machine tidak bisa dipukul pecah; hanya lewat wrench.

### Tabel blok
| Blok | Rarity | Pukulan | Layer | Harga Store (gems) |
|---|---|---|---|---|
| Dirt | 1 | 2 | depan | 2 |
| Rock | 1 | 3 | depan | 2 |
| Lava | 1 | 2 | depan | 4 |
| Cave Background | 1 | 2 | belakang | 2 |
| Door | 2 | 2 | depan | 8 |
| Grass | 2 | 2 | depan | 4 |
| Wood Block | 2 | 3 | depan | 4 |
| Sign | 2 | 2 | depan | 8 |
| Glass Pane | 2 | 2 | belakang | 8 |
| Brick | 3 | 4 | depan | 8 |
| Fireplace | 5 | 4 | depan | 20 |
| Golden Block | 40 | 20 | depan | 100 |
| Pepper | 47 | 4 | depan | 100 |
| Chandelier | 87 | 7 | depan | 500 |
| Bedrock | - | tidak bisa | depan | - |
| Vending Machine | - | wrench | depan | 8000 |
| Weather Machine | - | wrench | depan | 1000 |
| Chest | - | 2 | depan | 50 |

### Harga benih (gems)
Dirt 5, Rock 5, Lava 8, Cave 5, Wood 10, Grass 10, Door 10, Sign 10,
Glass 10, Brick 25, Fireplace 50, Pepper 200, Golden 500, Chandelier 2000.

## 6. Farming
- Benih ditanam di ruang kosong tepat di atas blok padat.
- Waktu tumbuh t = r^3 + 30r detik WAKTU NYATA (r = rarity), berbasis
  timestamp tanam: Dirt 31 dtk, Pepper 105.233 dtk, Chandelier 661.113 dtk.
- Panen memberi 2-5 buah + benih (tiap buah 20% benih bonus) + gems.
- Rentang gems panen: rarity 1: 0-1, 2: 0-2, 3: 0-3, 5: 0-5, 40: 0-16,
  47 (Pepper): 0-12, 87 (Chandelier): 0-22.
- Gems jatuh fisik, bergabung per denominasi (kuning 1, biru 5, merah 10,
  hijau 50, ungu 100), diambil dengan berjalan melewatinya.
- Pohon belum matang yang dipukul hancur tanpa hasil.
- Pohon menempati petak tapi tidak solid. Label pohon tampil dalam 4 petak.

## 7. Splice
Benih kedua ditanam di atas bibit benih pertama; pohon hasil mulai tumbuh
dari nol dengan waktu tumbuh item hasil. Pasangan gagal: benih kedua kembali
utuh. Benih ketiga ditolak. Buku hanya mencatat resep yang sudah ditemukan.

### Tabel resep (10)
| Benih 1 | Benih 2 | Hasil | Tier | Sumber |
|---|---|---|---|---|
| Dirt | Cave | Door | 1 | riset |
| Dirt | Rock | Grass | 1 | riset |
| Dirt | Lava | Wood Block | 1 | riset |
| Rock | Lava | Glass Pane | 1 | riset |
| Rock | Cave | Sign | 1 | riset |
| Grass | Rock | Brick | 2 | tafsir |
| Wood | Lava | Fireplace | 2 | tafsir |
| Wood | Brick | Pepper | 2 | tafsir |
| Brick | Fireplace | Golden Block | 3 | tafsir |
| Golden Block | Fireplace | Chandelier | 3 | riset |

## 8. Ekonomi
- Gems TIDAK bisa ditrade, tanpa kecuali.
- Store menjual item dengan harga tetap pakai gems (lihat tabel).
- Lock: Small 50 gems/10 petak (5x2), Big 200/48 (8x6), Huge 500/200 (20x10),
  World Lock 2.000/seluruh world. Bentuk area = kotak ke kanan-bawah dari
  petak lock. World Lock tidak bisa ditaruh kalau world sudah punya lock.
  Decay lock MATI. Bongkar lock sendiri mengembalikan lock-nya.
- Lock = uang: 100 WL = 1 DL, 100 DL = 1 BGL, lewat tombol gabung/pecah di tas.

## 9. Trading
- Lewat wrench ke NPC pedagang keliling (satu per world, nama + stok berputar
  tiap hari).
- Jendela trade maks 4 stack x 200, kedua pihak konfirmasi, bunyi kasir.
- Sisi NPC terisi otomatis dari stoknya sampai senilai sisi pemain;
  NPC setuju otomatis karena sisinya sudah senilai. Barang berpindah saat
  trade dieksekusi, bukan saat dimasukkan.
- Nilai tukar = harga Store; DL = 100x harga WL, BGL = 10.000x harga WL.

## 10. Vending machine
Beli 8.000 gems, ditaruh di world mana saja, diisi barang + harga dalam WL.
NPC pengunjung membeli 1-3 barang berkala kalau harga tidak melebihi nilai
item (max(1, floor(harga Store/200)) WL). Hasil dalam WL diambil pemilik
lewat wrench. Mesin harus dikosongkan dulu sebelum dihancurkan.

## 11. Progresi
- XP = 1 + floor(rarity/5) per panen. Butuh level x 100 XP untuk naik level.
  Cap level 125, nama biru di 125, nama hijau sebagai pemilik world.
- Role Farmer (tanam +1, panen +2) dan Builder (taruh +1, hancur +1),
  masing-masing sampai level 10, butuh level x 100 poin role.
- Empat role lain + quest TIDAK masuk v1.

## 12. Sosial versi solo
- Guild: buat seharga 200.000 gems; anggota NPC bergabung tiap 10 menit,
  mentok 10; panel daftar anggota + pernyataan bisa diedit.
- WOTD: satu world pilihan harian deterministik dari tanggal + world milik
  pemain; tampil di layar pilih world; masuk world WOTD memberi WOTD Trophy
  sekali sehari.
- Broadcast hanya dari sistem (pesan berkala tiap 5 menit + event).
- Chat kiri bawah: umpan balik aksi + perintah /msg (gratis), /sb (40 gems),
  /bc (20 gems). Ditampilkan bergaya, tanpa pengiriman nyata.

## 13. UI
- Gems kiri atas (ketuk = Store); nama, level, nama world, HP.
- HP: tombol gerak kiri bawah, lompat + pukul kanan bawah.
- Tas: grid bisa scroll + jumlah + kolom cari + RECYCLE/STORE/DROP/INFO/FAV.
  RECYCLE mengembalikan 1/10 harga Store. STORE menyimpan ke peti world.
  DROP menjatuhkan. INFO dialog info. FAV menandai favorit (tampil dulu).
- Dialog panel BIRU tembus pandang. Dock Fist/Wrench.
- Tanpa day/night cycle.

## 14. Panel admin
Tombol ADMIN di HUD, berlabel alat tes: beri gems, beri item, beri lock,
atur level, beri XP, buka semua resep, tumbuhkan semua pohon, teleport antar
world, kosongkan world, reset save. Tiap aksi tercatat di chat.

## 15. Suara
SFX pukul, ambil gems, tanam, splice, kasir saat trade, lewat WebAudio
(oscillator, tanpa file audio). Tanpa musik latar. Teks melayang saat dapat
item. Tanpa screen shake, tanpa floating damage.

## 16. Simpan
localStorage kunci `indotopia-remake-save-v1`. Profil (gems, level, XP, role),
tas, semua world (grid, pohon + timestamp, lock, cat, papan, peti, vending,
cuaca), resep ditemukan, zoom, guild, klaim WOTD. Simpan otomatis tiap
10 detik + saat pindah world + saat halaman ditutup.

## 17. Kriteria sukses
Semua sistem di atas bisa dimainkan ujung ke ujung dari browser; tes headless
dan Playwright lolos tanpa error konsol; live terverifikasi md5 sama dengan
lokal; nomor versi aset naik tiap deploy.

## 18. Di luar lingkup
Multiplayer nyata, server, uang asli dan paket gems, RMT, quest, empat role
lain, peringkat guild.

## Keputusan interpretasi
Semua yang riset tidak temukan atau yang butuh penyesuaian solo:
1. Bentuk area lock = kotak ke kanan-bawah dari petak lock (riset hanya
   memberi jumlah petak).
2. Rarity Brick 3, Fireplace 5, Golden 40 = tafsir (riset memastikan 1, 2,
   47, 87).
3. Pukulan Golden Block 20 mengikuti riset (tabel farmable); pita 7 di
   draf awal spesifikasi dikoreksi saat verifikasi.
4. Rentang gems panen tafsir kecuali Pepper 0-12 dan Chandelier 0-22 (riset).
5. Buah panen 2-5 (riset: sampai 8 untuk farmable); tiap buah 20% benih bonus.
6. Pecah blok TIDAK menjatuhkan gems (spesifikasi hanya menyebut gems dari panen).
7. Empat resep splice tafsir (lihat tabel resep).
8. Pintu teleport ke pintu lain terdekat; hapus pintu lewat wrench.
9. Lava 20 damage/sentuhan, kebal 1 detik, api 3 detik, regen 5/detik
   sesudah 5 detik tenang (riset: mati sesudah 5 sentuhan cepat).
10. Empat cuaca berputar, visual saja.
11. Cat butuh Paintbrush; warna dari cat yang dipilih; Varnish menghapus.
12. Tas tanpa batas stack; batas 200/stack hanya di jendela trade.
13. Gabung/pecah lock lewat tombol di tas (riset: double-tap 100 WL, BGL via
    Sales-Man — disederhanakan).
14. Decay lock mati (tidak bermakna solo).
15. Mekanik trade NPC: sisi NPC otomatis senilai, NPC auto-setuju, barang
    berpindah saat eksekusi.
16. Nilai tukar NPC = harga Store.
17. Vending boleh di world mana saja (riset: hanya world-locked); ambang beli
    NPC dan intervalnya tafsir.
18. Kurva level dan role: level x 100 (riset tidak menemukan kurva).
19. Poin role: Farmer tanam +1/panen +2, Builder taruh +1/hancur +1.
20. Guild: anggota NPC tiap 10 menit, mentok 10 (riset tidak menemukan cap).
21. WOTD deterministik dari tanggal; trofi sekali sehari; "10 Growtoken"
    hanya teks simulasi.
22. Broadcast sistem tiap 5 menit; /bc 20 gems (tafsir; /sb 40 gems dari riset).
23. Nama pemain tetap "Pemain".
24. Pohon mentah dipukul hancur tanpa hasil (riset: satu sumber panduan).
25. Pohon splice mulai tumbuh dari nol.
26. Benih gagal splice kembali utuh; benih ketiga ditolak (riset).
27. Angka jalan/lompat/gravitasi dari spesifikasi (riset tidak menemukan angka).
28. Jangkauan pukul 3 petak Chebyshev (konflik riset 3-inklusif vs
    2-eksklusif; spesifikasi: 3).
29. Harga lock versi wiki (konflik tangkapan toko Nov 2026 yang lebih tinggi).
30. XP versi floor (konflik prose round-up di halaman Leveling).
31. Cap level 125 (ada penampakan 126, belum terverifikasi).
32. Pohon tidak solid; label pohon dalam 4 petak.
33. STORE di tas = simpan ke peti world (spesifikasi; riset: STORE membuka Store).
34. Tanpa jeda konfirmasi di jendela trade (riset tidak menemukan safeguard itu).
35. Pedagang keliling: satu per world, nama + stok berputar per hari.
36. Generasi: 24 lapis tanah lalu campuran batu/tanah; kantong lava lapis 7-10
    dari bawah (riset menyebut ~30 lapis total).
37. Gems jatuh hilang sesudah 60 detik, item jatuh sesudah 120 detik.
38. Simpan otomatis tiap 10 detik + pindah world + tutup halaman.
39. Musik latar tidak ada; SFX disintesis (nama file SFX riset hanya
    menginspirasi fungsinya).
40. Hotbar: SATU slot toggle kepalan/kunci (ketuk kepalan menjadi kunci dan
    sebaliknya), emoji 👊/🔧, plus 3 quick slot. Koreksi Agus 17 Nov 19:46
    dari wiki Fist; dua slot terpisah adalah kesalahan tafsir screenshot.
41. Pemicu tas (DICATAT 17 Nov 19:56, BELUM dibangun, menunggu gas Agus):
    tab kecil pas di tengah atas dock. Di-tap membuka/menutup tas, ditarik
    ke atas membuka, ditarik ke bawah menutup. Tab tetap biru tanpa emoji,
    panah kecil menghadap atas saat tertutup dan bawah saat terbuka.
    Tombol tulisan TAS di HUD dihapus; tombol I tetap membuka tas. Emoji
    hanya untuk kepalan/kunci, tidak untuk semua elemen (teguran Agus).
