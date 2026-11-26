// Tutorial dan teks resep.
// Pecahan 03-data.js (v16).
// Tutorial: satu sistem per langkah, bisa dilewati.
const TUT_INTRO = 'Mau belajar main dulu? Ikuti 8 langkah singkat, dari menebang pohon sampai membuat Motor.';
const TUTORIAL = [
  { text: 'Jalan ke utara dari kota (lewat Padang Rumput dan Hutan Kapas) sampai Hutan Rimbun, ketuk pohon.', done: () => (S.stats.harvested.Log || 0) >= 1 },
  { text: 'Kumpulkan 5 Log.', done: () => (S.stats.harvested.Log || 0) >= 5 },
  { text: 'Masuk ke lahanmu lewat petak putih di Padang Rumput (Lembah Hijau).', done: () => S.map === 'plot' || [...S.machines.values()].length > 0 },
  { text: 'Buka BANGUN, taruh Sawhorse di rumput kosong.', done: () => [...S.machines.values()].some((m) => m.id === 'sawhorse') },
  { text: 'Ketuk Sawhorse, pilih resep, masukkan Log.', done: () => (S.stats.crafted.Plank || 0) + (S.stats.crafted.Pillar || 0) >= 1 },
  { text: 'Keluar lewat gerbang bawah lahan ke Padang Rumput, jalan ke selatan sampai kota, ketuk Toko, jual hasilmu.', done: () => Object.keys(S.stats.sold).length >= 1 },
  { text: 'Riset Carpenter di menu Bangun ($50).', done: () => !!S.unlocked.carpenter },
  { text: 'Bebas: kembangkan pabrikmu. Target: buat 1 Motor.', done: () => (S.stats.crafted.Motor || 0) >= 1 },
];

function recipeText(r) {
  const ins = Object.entries(r.in).map(([id, n]) => n + ' ' + ITEMS[id].name).join(' + ');
  return ins + ' menjadi ' + r.n + ' ' + ITEMS[r.out].name + ' (' + r.secs + ' dtk)';
}
