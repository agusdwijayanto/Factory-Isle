# STRUKTUR — Indotopia Remake

Salinan Growtopia single-player di browser, sepersis mungkin dengan aslinya.
Modifikasi menjadi versi kita dilakukan sesudah Agus main versi ini.

## 1. Tujuan
Game sandbox 2D menyamping: pukul blok, tanam benih, tunggu tumbuh, panen,
splice, trade, bangun world — semuanya solo di browser.

## 2. Teknologi
HTML5 Canvas + JS polos, tanpa build step, tanpa dependensi eksternal.
Grafik prosedural, SFX WebAudio. Kode dipecah banyak file kecil di `js/`.

## 3. Kontrol
- Dock Fist/Wrench di-tap (HP) atau diklik (PC) untuk ganti mode. Tombol Q juga mengganti mode.
- HP: tombol sentuh kiri, kanan, lompat, pukul.
- PC: WASD/panah gerak, W/atas/Spasi lompat, klik mouse pukul/taruh, roda mouse zoom.
- Mode Fist: ketuk blok = pukul, ketuk petak kosong dengan item terpilih = taruh/tanam.
- Mode Wrench: ketuk blok = dialog blok, ketuk NPC = profil + trade, ketuk diri = profil.

## 4. World
Grid 100x60, TILE 32, 6 baris bedrock di bawah, 54 baris terpakai.
Masuk dengan mengetik nama; nama baru berarti world baru. Nama 1-24 huruf/angka.
Banyak world, tiap world tersimpan sendiri. Main Door acak di permukaan.

## 5. Blok dan pukul
Pukul tiap 0,2 detik, jangkauan 3 petak, retakan bertahap + bunyi.
Foreground di atas background. Pintu dipukul = teleport. Lava = knockback + api.
Cat + kuas mengubah warna blok. Weather machine dipukul = ganti cuaca.

## 6. Farming
Semua tumbuh di pohon. Benih ditanam di atas blok. Waktu tumbuh rumus rarity
t = r^3 + 30r detik waktu nyata, berbasis timestamp. Panen memberi buah + benih + gems.
Gems jatuh fisik dan bergabung per denominasi 1/5/10/50/100.

## 7. Splice
Benih kedua ditanam di atas bibit benih pertama. Tabel pasangan tetap, 10 resep.
Tidak ada bocoran resep; hasil yang sudah ditemukan tercatat di buku.

## 8. Ekonomi
Gems tidak bisa ditrade. Store harga tetap pakai gems. Lock dibeli di Store
dan menjadi uang: 100 WL = 1 DL, 100 DL = 1 BGL. Decay lock mati.

## 9. Trading
Lewat wrench ke NPC pedagang keliling. Jendela trade maks 4 stack x 200,
kedua pihak konfirmasi, bunyi kasir saat deal.

## 10. Vending machine
Beli 8.000 gems, ditaruh di world, diisi barang + harga WL. NPC membeli berkala.

## 11. Progresi
XP = 1 + floor(rarity/5) per panen. Cap level 125, nama biru di 125.
Role Farmer dan Builder sampai level 10.

## 12. Sosial versi solo
Guild (200.000 gems, anggota NPC), WOTD (pilihan harian + trofi),
broadcast hanya dari sistem, chat + perintah /msg, /sb, /bc.

## 13. UI
Gems kiri atas; tas grid bisa scroll + cari + RECYCLE/STORE/DROP/INFO/FAV;
dialog panel biru tembus pandang; dock Fist/Wrench; warna nama hijau pemilik,
biru level 125. Tanpa day/night cycle.

## 14. Panel admin
Tombol ADMIN di HUD: beri gems/item/lock, atur level/XP, buka semua resep,
tumbuhkan semua pohon, teleport, kosongkan world, reset save. Jelas berlabel
alat tes; tiap aksi tercatat di chat.

## 15. Suara dan rasa
SFX pukul, ambil gems, tanam, splice, kasir. Retakan, gems melayang,
teks melayang saat dapat item. Tanpa screen shake, tanpa floating damage.

## 16. Simpan
localStorage kunci `indotopia-remake-save-v1`. Profil, tas, semua world,
resep ditemukan, zoom. Simpan berkala + saat pindah world.

## 17. Di luar lingkup
Multiplayer nyata, server, uang asli/paket gems, RMT, quest, empat role lain,
peringkat guild.
