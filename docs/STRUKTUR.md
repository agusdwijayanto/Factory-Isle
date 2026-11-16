# STRUKTUR — Indotopia (game kaya Growtopia versi kita)

Disetujui Agus 2026-11-16. Game ini menggantikan game desa di repo Indotopia.

1. **Konsep:** game 2D petak kaya Growtopia versi kita, single-player, di browser. Kamu punya 1 world pribadi: pukul blok, tanam, panen, splice, bangun, jual ke NPC.
2. **Teknologi:** Canvas dan JS polos, tanpa build step, tanpa server, simpan otomatis di browser. Grafik prosedural dulu, bisa diganti aset gambar nanti.
3. **World:** grid petak 2D. Ukuran awal kecil, diperluas dengan beli lahan sebelah, harga menanjak tiap beli.
4. **Loop inti:** pukul blok dapat benih, tanam, tunggu tumbuh, panen, splice 2 benih menjadi benih baru, bangun atau jual hasilnya.
5. **Ekonomi:** koin melekat di player, harga NPC tetap, hasil jualan masuk kotak kirim dan dibayar besok pagi, batas jual dan beli harian. Mata uang kedua hanya dari tugas dan misi, tidak bisa dibeli.
6. **Farming:** tanaman dan pohon punya waktu tumbuh, harus disiram tiap hari supaya tumbuh, dan musim berganti mengubah tanaman apa yang bisa tumbuh.
7. **Splice dan breeding:** splice 2 benih menjadi benih baru, bunga dikawin silang dengan aturan genetik sederhana, semua resep tercatat di buku resep.
8. **Crafting:** berdiri dekat stasiun kerja untuk membuat barang, buku resep menunjukkan semua resep dari bahan yang kamu punya.
9. **Skill dan profesi:** skill naik dari aktivitas (menebang, menanam, menambang), lalu pilih profesi yang membuka peluang dan bonus.
10. **NPC dan misi:** NPC memberi misi harian, hadiahnya mata uang tugas. Toko NPC tempat jual beli harga tetap.
11. **Pasar lobak:** sistem terpisah. Beli lobak di hari tertentu, jual sepanjang minggu dengan harga berubah, lobak busuk kalau tidak terjual. Tidak menyentuh toko utama.
12. **Rasa main:** standar game desa, bunyi, partikel, angka melayang, getar layar, perayaan saat pencapaian pertama.
13. **Di luar lingkup:** multiplayer, trade antar player, lock, rarity, chat, guild, dungeon dan boss, musik latar.
14. **Kriteria lolos:** semua sistem bekerja, 15 menit main tanpa crash, penilaian akhir oleh Agus.

Sudut pandang diputuskan Agus 2026-11-16: MENYAMPING (lompat + gravitasi kaya Growtopia).
