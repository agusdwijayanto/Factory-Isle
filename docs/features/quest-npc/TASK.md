# TASK — Quest / Trust NPC

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [STRUKTUR](STRUKTUR.md) · [PRD](PRD.md) · [TASK game](../../TASK.md)

Tugas dikerjakan berurutan sesuai dependensi. Yang belum punya jawaban dari Agus ditandai `[ASSUMPTION]` dan **tidak boleh dikerjakan** sebelum pertanyaan di PRD.md no. 1–6 dijawab.

## Prasyarat (jawab dulu sebelum QT-001)

Semua pertanyaan terbuka di PRD.md harus dijawab Agus:
- Daftar quest Mayor (judul, goal, reward trust)
- Trust threshold + apa yang dibuka
- NPC lain di v1 atau tidak
- File baru atau tidak

---

## QT-001 — Tambah state `S.quests` dan `S.trust`

Instruksi: Di `js/01-core.js`, tambahkan `quests: {}` dan `trust: {}` ke object `S`. Pastikan `newGame()` atau inisialisasi awal mengisi default `{}`.
Kriteria lolos: `S.quests` dan `S.trust` ada di `window.GAME` saat game boot; headless test membaca keduanya tanpa error; simpan baru menyimpan field ini.
Dependensi: Prasyarat terpenuhi.

## QT-002 — Tambah data QUESTS dan TRUST_UNLOCKS

Instruksi: Di `js/03-data-items.js`, tambahkan array `QUESTS` (isi dari jawaban Agus) dan object `TRUST_UNLOCKS` (threshold → unlock). Format ikut STRUKTUR.md bagian "Data quest".
Kriteria lolos: `QUESTS` dan `TRUST_UNLOCKS` dapat dibaca headless; tiap quest punya `id`, `npcId`, `title`, `desc`, `goal`, `reward`, `requires`; nol error konsol.
Dependensi: QT-001, jawaban Agus soal daftar quest dan threshold.

## QT-003 — Simpan/muat quests dan trust

Instruksi: Di `js/12-simpan.js`, tambahkan `quests` dan `trust` ke `saveGame()` dan `loadGame()`. Simpan lama tanpa field ini dimuat sebagai `{}` (tidak crash).
Kriteria lolos: Simpan baru mengandung key `quests` + `trust`; simpan lama (tanpa key itu) dimuat tanpa error; `S.quests` dan `S.trust` berisi data yang benar setelah `loadGame()`; headless test muat simpan lama dan simpan baru.
Dependensi: QT-001.

## QT-004 — updateQuestProgress()

Instruksi: Buat fungsi `updateQuestProgress()` yang membaca `S.stats` (sudah ada: `harvested`, `crafted`, `sold`) dan memperbarui `S.quests[id].progress` untuk tiap quest aktif. Panggil di loop game di `js/14-main.js` (setelah `updateMachines`). Goal `deliver` `[ASSUMPTION]` — implementasi setelah jawaban Agus.
Kriteria lolos: Fungsi dapat dites headless tanpa DOM; quest harvest/craft/sell ter-update saat `S.stats` berisi data; nol error konsol; tes: quest `harvest Log count=10` terpenuhi saat `S.stats.harvested.Log >= 10`.
Dependensi: QT-002.

## QT-005 — claimQuest() dan unlock

Instruksi: Buat fungsi `claimQuest(questId)` yang: set `S.quests[id].status = 'done'`, naikkan `S.trust[npcId]` sesuai `reward.trust`, periksa `TRUST_UNLOCKS` dan buka resep/toko jika threshold tercapai, panggil `saveSoon()`. Buat juga `questDone(id)` = helper boolean untuk UI.
Kriteria lolos: Headless test: claim quest → trust naik → unlock terpicu jika threshold terpenuhi; claim ulang quest yang sudah `done` tidak mengubah trust; `saveSoon()` dipanggil; nol error konsol.
Dependensi: QT-003, QT-004.

## QT-006 — UI: renderQuests() di panel Mayor

Instruksi: Di `js/13-ui-mayor.js`, tambahkan `renderQuests()` yang dipanggil di awal `renderMayor()` (sebelum bagian ekspansi lahan). Tampilkan: judul quest, deskripsi, progress `[saat ini] / [target]`, tombol **Klaim** (hanya jika goal selesai dan status `active`). Tombol Klaim memanggil `claimQuest(id)` lalu `renderMayor()`. `[ASSUMPTION]` Tampilan trust (angka/bar) ikut jawaban Agus no. 6.
Kriteria lolos: Panel Mayor menampilkan bagian Quest di atas ekspansi; progress terbaca; tombol Klaim hanya muncul saat goal terpenuhi; Klaim mengubah tampilan quest jadi selesai; bagian ekspansi lahan tidak berubah; nol error konsol.
Dependensi: QT-005.

## QT-007 — Headless test suite

Instruksi: Tambahkan tes ke file headless yang sudah ada. Tes minimal:
- `S.quests` dan `S.trust` ada setelah boot
- `updateQuestProgress()` menandai goal terpenuhi saat `S.stats` mencukupi
- `claimQuest()` menaikkan trust dan tidak double-claim
- `TRUST_UNLOCKS` dipicu pada threshold yang benar
- Simpan lama tanpa `quests`/`trust` dimuat tanpa crash
Kriteria lolos: Semua tes baru lolos; total headless tidak turun dari angka sebelumnya; nol error konsol.
Dependensi: QT-006.

## QT-008 — Migrasi simpan lama

Instruksi: Pastikan `js/12-simpan.js` menangani simpan v52 (tanpa `quests`/`trust`) dengan default bersih — tidak ada quest aktif, trust semua 0. Tidak perlu cek staleness baru karena default `{}` sudah benar.
Kriteria lolos: Simpan buatan v52 (uang 1000, tanpa field quest/trust) dimuat → `S.quests === {}` dan `S.trust === {}`; tes headless muat simpan lama lolos; nol error konsol.
Dependensi: QT-003.
