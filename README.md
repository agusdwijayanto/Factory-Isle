# Indotopia — Desa Monster (versi kompleks)

Game 2D web single-player: kamu bola slime biru, ketua desa monster.
Bangun kerjaan, atur warga, bertarung tiap malam, masuk dungeon.

Main di: https://agusdwijayanto.github.io/Indotopia/

## Cara main

- **Laptop:** WASD/panah jalan, spasi/klik aksi, B menu bangun, E makan roti.
  Klik bangunan atau warga untuk membuka panelnya.
- **HP:** joystick jalan, tombol AKSI untuk pukul/ambil, tombol BANGUN untuk menu.

## Inti game

- Tebang, tambang, tanam, panen. Tanam pohon dan petak lahan sendiri.
- Warga datang kalau ada rumah kosong. Terima atau tolak, beri job
  (penebang, penambang, petani), job bisa diganti kapan saja.
- Warga makan 3 roti per hari. Roti dibuat di Dapur dari gandum.
- 6 bangunan: Townhall, Rumah, Tambang, Toolsmith, Dapur, Pasar.
- Senjata, armor, dan alat naik tingkat: kayu, batu, besi, emas, berlian.
- Tiap malam monster menyerang desa dan menjatuhkan bahan acak.
- Dungeon 3 lantai di bukit: syarat masuk harus punya senjata dulu.
  Diamond hanya ada di lantai terdalam.

## Teknologi

HTML5 Canvas + JavaScript polos, tanpa build step, tanpa dependensi,
tanpa aset luar. Grafik prosedural, suara WebAudio sintetis.
Simpanan otomatis di browser (localStorage).

## Dokumen desain

- `docs/STRUKTUR.md` — struktur yang disetujui
- `docs/PRD.md` — PRD yang disetujui
- `docs/TASK.md` — daftar task dan kriteria lolos
