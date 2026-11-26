# STRUKTUR — Quest / Trust NPC

**Versi:** 0.1 · **Diperbarui:** 2026-11-26 · [PRD](PRD.md) · [TASK](TASK.md) · [PRD game](../../PRD.md)

Dokumen ini mencatat struktur fitur Quest / Trust NPC: data, state, UI, dan alur simpan. Sumber: kode v52 (`js/01-core.js`, `js/13-ui-mayor.js`, `js/03-map-kota.js`). Tidak ada asumsi di luar repo; yang belum ada di kode ditandai `[ASSUMPTION]`.

## Ringkasan fitur

Pemain berinteraksi dengan NPC (mulai dari Mayor yang sudah ada) untuk menerima quest sederhana. Menyelesaikan quest menaikkan trust NPC tersebut. Trust membuka resep atau toko baru yang tidak bisa dibuka lewat Research biasa.

## NPC yang sudah ada di v52

| NPC | Map | Posisi grid | Panel sekarang |
|---|---|---|---|
| Mayor | Kota | `(7,13)` = x7,z8 | Ekspansi lahan + Auto Seller (`js/13-ui-mayor.js`) |

NPC lain `[ASSUMPTION]` — belum ada di kode, harus ditentukan sebelum implementasi.

## State baru di `S` (js/01-core.js)

```js
S.quests = {};   // questId -> { status: 'active'|'done', progress: {} }
S.trust  = {};   // npcId -> angka trust (integer, mulai 0)
```

Disimpan di save (kunci `indotopia-tycoon-save-v2`, field baru `quests` + `trust`). Simpan lama tanpa field ini dibaca sebagai `{}` (default 0 / belum ada quest).

## Data quest (js/03-data-items.js atau file baru)

Satu quest = satu object:

```
{
  id:        string,          // unik, contoh 'mayor_q1'
  npcId:     string,          // 'mayor' | [ASSUMPTION: NPC lain]
  title:     string,          // teks judul di panel
  desc:      string,          // instruksi ke pemain
  goal:      { kind, ... },   // lihat bagian Goal di bawah
  reward:    { trust, ... },  // trust naik + opsional hadiah lain
  requires:  string[],        // questId yang harus selesai duluan
}
```

### Jenis goal yang terdefinisi

| kind | Parameter | Contoh |
|---|---|---|
| `harvest` | `item`, `count` | tebang 10 Log |
| `craft` | `item`, `count` | buat 5 Plank |
| `sell` | `item`, `count` | jual 3 IronIngot |
| `deliver` | `item`, `count`, `npcId` | antar 1 barang ke NPC tertentu |

`[ASSUMPTION]` Jenis goal lain (bangun mesin tertentu, capai map tertentu) belum ditentukan.

### Trust threshold → unlock

```
trust[npcId] >= threshold  →  buka resep / toko / fitur
```

`[ASSUMPTION]` Angka threshold, resep apa yang terbuka, dan urutan quest belum ditentukan — harus diisi sebelum implementasi.

## Panel UI

Panel Mayor yang sudah ada ditambah tab atau bagian baru **"Quest"** di atas bagian ekspansi lahan. Tidak ada panel baru, tidak ada tombol HUD baru (ikut pilar desain game).

Tampilan per quest di panel:
- Judul quest
- Deskripsi singkat
- Progress: `[progress saat ini] / [target]`
- Tombol **Klaim** (hanya muncul jika goal terpenuhi, status masih `active`)

`[ASSUMPTION]` Apakah NPC lain punya panel sendiri atau berbagi panel Mayor — belum ditentukan.

## Alur data

```
Pemain ketuk Mayor
  → openMayor() (js/13-ui-mayor.js)
    → renderQuests()   ← baru, di atas renderMayor()
    → renderMayor()    ← sudah ada (ekspansi + Auto Seller)

Tiap tick (js/14-main.js):
  → updateQuestProgress()   ← baru, cek S.stats vs goal aktif

Klaim quest (klik tombol Klaim):
  → claimQuest(questId)
    → S.quests[id].status = 'done'
    → S.trust[npcId] += reward.trust
    → unlock resep/toko jika trust >= threshold
    → saveSoon()
```

## File yang terpengaruh

| File | Perubahan |
|---|---|
| `js/01-core.js` | Tambah `S.quests`, `S.trust` ke state awal |
| `js/03-data-items.js` | Tambah array `QUESTS`, tabel `TRUST_UNLOCKS` |
| `js/09-mesin.js` atau `js/07-pemain.js` | Hook ke `S.stats` sudah ada; pastikan `updateQuestProgress` bisa baca |
| `js/12-simpan.js` | Simpan/muat `quests` + `trust`; simpan lama default `{}` |
| `js/13-ui-mayor.js` | Tambah `renderQuests()`, tombol Klaim |
| `js/14-main.js` | Panggil `updateQuestProgress(dt)` di loop |

File baru `js/16-quest.js` opsional jika logika quest cukup besar — `[ASSUMPTION]` tergantung keputusan Agus soal pemisahan file.
