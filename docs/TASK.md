# TASK — Indotopia Tycoon Pabrik Isometrik

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [STRUKTUR](STRUKTUR.md) · [PRD](PRD.md) · [ROADMAP](../ROADMAP.md)

Setiap tugas: judul, instruksi tanpa asumsi, kriteria lolos (cek statement yang dapat diamati), dependensi. Tugas dikerjakan berurutan sesuai dependensi. Tugas tanpa spesifikasi di repo ditandai `[ASSUMPTION]` — detail harus diisi sebelum kode.

## Tugas sekarang (dokumen)

### T-001 — Buat docs/STRUKTUR.md
Instruksi: Dokumentasi struktur game dan kode: 40 skrip `js/` dengan peran, versi aset, 8 map rantai, 13 panel UI, alur simpan + migrasi, fitur aktif v52, blokir `unrar`, backlog 6 item. Sumber: `ROADMAP.md`, `index.html`, berkas `js/`.
Kriteria lolos: Berkas ada; mencakup tabel 40 skrip, 8 map, 13 panel, versi aset `?v=52`, dan blokir `unrar`; tidak ada asumsi di luar repo.
Dependensi: —

### T-002 — Buat docs/PRD.md
Instruksi: Dokumen kebutuhan produk: tujuan, audiens, platform/input, sesi/simpan, engine, ruang lingkup, referensi/prinsip, pilar desain, core loop, feature index, kebutuhan non-fungsi, keputusan (D-001..D-006), pertanyaan terbuka `[ASSUMPTION]`. Sumber: `ROADMAP.md`, `index.html`, kode.
Kriteria lolos: Berkas ada; semua bagian di atas terisi; tabel keputusan lengkap alasan per baris; feature index mencakup 22 baris (16 implemented + 6 ide).
Dependensi: T-001 (STRUKTUR sebagai rujukan struktur).

### T-003 — Buat docs/TASK.md (berkas ini)
Instruksi: Daftar tugas terkecil, berurutan sesuai dependensi, masing-masing judul + instruksi tanpa asumsi + kriteria lolos. Tugas tanpa spesifikasi di repo ditandai `[ASSUMPTION]`.
Kriteria lolos: Berkas ada; T-001..T-003 selesai; T-004..T-010 mencakup 6 backlog v52 dari `ROADMAP.md` baris 403; setiap tugas punya kriteria lolos yang dapat diamati.
Dependensi: —

## Tugas backlog v52 (dari ROADMAP baris 403)

### T-004 — Rantai tekstil
Instruksi: `[ASSUMPTION]` Spesifikasi belum ada di repo. Menambahkan rantai produksi tekstil (bahan baku → kain → produk akhir) dengan mesin dan resep baru.
Kriteria lolos: Spesifikasi ditulis dan disetujui; mesin tekstil terdefinisi di `js/03-data-items.js` / `js/10-resep.js`; headless test nol error konsol.
Dependensi: T-003, spesifikasi rantai tekstil.

### T-005 — Bronze Cannon
Instruksi: `[ASSUMPTION]` Spesifikasi belum ada di repo. Menambahkan bangunan Bronze Cannon sebagai bangunan logika/produksi.
Kriteria lolos: Spesifikasi ditulis dan disetujui; Bronze Cannon terdefinisi; headless test nol error konsol.
Dependensi: T-003, spesifikasi Bronze Cannon.

### T-006 — Quest / trust NPC
Instruksi: `[ASSUMPTION]` Spesifikasi belum ada di repo. Menambahkan sistem quest dan NPC trust (reputasi) yang membuka resep/toko.
Kriteria lolos: Spesifikasi ditulis dan disetujui; mekanisme quest/trust terdefinisi; headless test nol error konsol.
Dependensi: T-003, spesifikasi quest/trust.

### T-007 — Fuel meter terpisah
Instruksi: `[ASSUMPTION]` Spesifikasi belum ada di repo. Menambahkan meter bahan bakar terpisah (bukan bagian tas/uang) untuk kendaraan.
Kriteria lolos: Spesifikasi ditulis dan disetujui; fuel meter terdefinisi dan terpisah dari UI tas; headless test nol error konsol.
Dependensi: T-003, spesifikasi fuel meter.

### T-008 — Irigasi
Instruksi: `[ASSUMPTION]` Spesifikasi belum ada di repo. Menambahkan sistem irigasi lahan (air untuk tanaman).
Kriteria lolos: Spesifikasi ditulis dan disetujui; irigasi terdefinisi di map lahan; headless test nol error konsol.
Dependensi: T-003, spesifikasi irigasi.

### T-009 — Bangunan logika
Instruksi: `[ASSUMPTION]` Spesifikasi belum ada di repo. Menambahkan kategori bangunan logika (pengaruh game tanpa visual produksi).
Kriteria lolos: Spesifikasi ditulis dan disetujui; bangunan logika terdefinisi; headless test nol error konsol.
Dependensi: T-003, spesifikasi bangunan logika.

### T-010 — Multi-save
Instruksi: Verifikasi dan lengkapi multi-save slot 2/3/4 yang disebut help (`$25.000/$50.000/$100.000`, biaya ekspansi naik per save). Cek kode `js/12-simpan.js` dan panel Plot apakah sudah terimplementasi atau hanya dokumentasi help.
Kriteria lolos: Diketahui status multi-save (terimplementasi / belum); jika belum, spesifikasi ditulis dan slot 2/3/4 berfungsi (muat / lepas / reset); headless test nol error konsol.
Dependensi: T-003, `js/12-simpan.js`, panel Plot `js/13-ui-plot.js`.

## Catatan

- T-004..T-009 belum ada detail di `ROADMAP.md` (hanya disebut baris 403 tanpa spesifikasi). Jangan menebak angka, harga, atau resep. Isi spesifikasi terlebih dahulu, baru kode.
- Semua kriteria lolos harus dapat divalidasi lewat headless test atau inspeksi berkas kode, bukan hanya pernyataan niat.
- Setelah Tuanku menyetujui ketiga dokumen ini, T-001..T-003 dianggap selesai dan lanjut ke T-004.
