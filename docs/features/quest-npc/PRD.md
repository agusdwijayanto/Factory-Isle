# PRD — Quest / Trust NPC

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [STRUKTUR](STRUKTUR.md) · [TASK](TASK.md) · [PRD game](../../PRD.md)

## 1. Tujuan

Tambahkan lapisan naratif ringan ke game: pemain bisa menerima quest dari NPC, menyelesaikannya, dan mendapat reward berupa kenaikan trust. Trust yang cukup membuka resep atau toko yang tidak bisa dibeli lewat Research biasa — memberi tujuan jangka menengah selain menumpuk uang.

## 2. Ruang lingkup v1

**Masuk:**
- Quest dari Mayor (NPC yang sudah ada di kota)
- Jenis goal: `harvest`, `craft`, `sell`, `deliver`
- Trust Mayor membuka `[ASSUMPTION]` resep/toko yang belum ditentukan
- UI: bagian Quest di panel Mayor yang sudah ada
- Simpan/muat quest + trust di save otomatis

**Tidak masuk v1:**
- NPC baru selain Mayor `[ASSUMPTION]`
- Quest berantai panjang (> 3 langkah)
- Hukuman trust turun
- Animasi atau cutscene
- Quest yang harus selesai dalam batas waktu

## 3. Alur pemain

```
Pemain ketuk Mayor
  → Panel Mayor terbuka
  → Bagian Quest tampil di atas bagian Ekspansi
    → Daftar quest aktif + progress
    → Tombol Klaim jika goal selesai
  → Klaim → trust naik → unlock tampil (toast)
```

## 4. Pilar desain (ikut game)

- **UI minimal:** tidak ada tombol HUD baru; quest lewat panel Mayor yang sudah ada.
- **Simpan aman:** simpan lama tanpa data quest dibaca sebagai kondisi awal bersih.
- **Tidak ada asumsi angka:** angka trust, threshold unlock, dan daftar quest diisi Agus sebelum kode ditulis.

## 5. Kebutuhan non-fungsi

- Headless test: `updateQuestProgress()` dapat dites tanpa DOM.
- Nol error konsol.
- Simpan lama (tanpa field `quests`/`trust`) tidak crash — default `{}`.

## 6. Keputusan

| ID | Keputusan | Alasan |
|---|---|---|
| QD-001 | Quest ditampilkan di panel Mayor yang sudah ada, bukan panel baru | Ikut pilar UI minimal; tidak ada tombol HUD baru |
| QD-002 | Progress quest baca dari `S.stats` yang sudah ada | `S.stats` sudah diisi oleh harvest/craft/sell di kode v52; tidak perlu counter baru |
| QD-003 | Trust disimpan sebagai integer di `S.trust[npcId]` | Sederhana, mudah dites headless, tidak perlu struktur kompleks |

## 7. Pertanyaan terbuka (harus dijawab Agus sebelum kode)

1. `[ASSUMPTION]` **Daftar quest Mayor:** judul, deskripsi, goal (item + jumlah), reward trust per quest. Berapa quest Mayor di v1?
2. `[ASSUMPTION]` **Trust threshold:** pada trust berapa Mayor membuka sesuatu? Apa yang dibuka (resep spesifik? toko baru?)?
3. `[ASSUMPTION]` **NPC lain:** apakah ada NPC selain Mayor di v1, atau Mayor saja dulu?
4. `[ASSUMPTION]` **Deliver goal:** kalau ada quest "antar barang ke NPC", NPC tujuannya siapa dan petaknya di mana?
5. `[ASSUMPTION]` **File baru:** tambah `js/16-quest.js` terpisah, atau logika quest masuk ke file yang sudah ada?
6. `[ASSUMPTION]` **Gambar trust di UI:** cukup angka (`Trust: 3`), atau ada ikon/bar progress trust di panel?
