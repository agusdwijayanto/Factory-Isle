# TASK — Indotopia (game kaya Growtopia versi kita)

Disetujui Agus 2026-11-16, perintah "gasss" 2026-11-16.

1. **Fondasi:** canvas side-view, grid world 60x40, jenis petak langit/tanah/batu/kayu, kamera mengikuti pemain, simpan otomatis. Lolos: world tampil, kamera jalan, simpan dan muat jalan.
2. **Gerak dan fisika:** jalan, lompat, gravitasi, tabrakan petak, jatuh tanpa damage. Lolos: pemain berdiri di tanah tanpa tembus, lompat 3 petak.
3. **Pukul dan taruh blok:** jangkauan 1 petak, HP blok, drop benih dan bahan, taruh dari inventory, bongkar kembali bahan. Lolos: 3 jenis blok sesuai jumlah pukulannya, drop dan bongkar benar.
4. **Farming:** tanam, tumbuh waktu nyata, siram, panen, musim 28 hari dengan tanaman per musim. Lolos: siklus tanam-siram-panen jalan, tanaman luar musim berhenti tumbuh.
5. **Splice, breeding, buku resep:** meja splice dengan 8 resep, breeding bunga genetik, buku resep mencatat temuan. Lolos: splice dan breeding menghasilkan yang baru, buku resep terisi.
6. **Crafting:** stasiun meja kerja, tungku, meja splice, crafting hanya dekat stasiun, 10 resep. Lolos: crafting jauh dari stasiun ditolak, semua resep bisa dibuat.
7. **Ekonomi:** koin, toko NPC harga tetap, kotak kirim dibayar besok pagi, batas harian, mata uang tugas dan toko hadiah. Lolos: jual beli benar, pembayaran besok benar, batas menolak kelebihan.
8. **Pasar lobak:** beli Minggu, harga berubah 2 kali sehari, 4 pola, busuk tiap Minggu, terpisah dari toko utama. Lolos: siklus seminggu penuh benar, lobak busuk tepat waktu.
9. **Skill dan profesi:** 3 skill, XP dari aktivitas, 10 tingkat, profesi di tingkat 5 dan 10. Lolos: XP naik, profesi bisa dipilih dan memberi bonus.
10. **NPC dan misi:** 2 NPC, 3 misi harian, hadiah mata uang tugas dan koin. Lolos: misi selesai memberi hadiah, misi baru tiap hari.
11. **Perluasan lahan:** beli +20 kolom, harga menanjak, mentok 5 perluasan. Lolos: world melebar, harga benar, perluasan ke-6 ditolak.
12. **Rasa main dan HUD:** bunyi, partikel, angka melayang, getar layar, HUD koin/hari/musim/jam, kontrol sentuh. Lolos: semua efek jalan, game bisa dimainkan dari HP.
13. **Tes loop penuh:** simulasi headless dan browser sungguhan, siklus penuh, 15 menit tanpa crash. Lolos: semua cek hijau, 0 error konsol.
14. **Push dan link live:** ganti isi repo Indotopia dengan commit baru di atas riwayat yang ada, tanpa force-push, game desa tetap tersimpan di riwayat git. Lolos: link live membuka game baru, file live sama persis dengan lokal. (Dilakukan Muse, bukan bagian pembangunan ini.)
