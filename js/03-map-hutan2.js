// v49: Lahan Ijo + Hutan Dikit, 20x20 — hutan jarang antara Hutan Rimbun
// dan lahan bangun. Sungai mengalir utara-selatan lewat kolom 1 (lanjutan
// Gunung Es) sampai Padang Rumput Selatan.
// v57 (rombak total ikut gambar tangan Agus): jalan pindah — mendatar
// baris 10 (tengah, timur ke Blok 5), kolom 5 utara-selatan (pintu utara ke
// Blok 1, pintu selatan ke Blok 7). Jembatan di (1,10) tempat jalan
// menyeberang sungai kolom 1. Tanpa rel, tanpa stasiun.
function buildForest2() {
  const g = makeGrid(MAP_W, MAP_H);
  // Sungai kolom 1 + tepi pasir.
  terrain(g, rng(0, MAP_H - 1).map((gy) => [1, gy]), 'water');
  terrain(g, [[2, 5]], 'sand');
  roadAt(g, rng(0, MAP_H - 1).map((gy) => [5, gy]));
  roadAt(g, rng(0, 19).map((gx) => [gx, 10]));
  terrain(g, [[1, 10]], 'bridge'); // jalan baris 10 menyeberang sungai
  put(g, [[3, 3], [4, 9], [15, 4], [6, 14], [16, 16], [11, 7], [17, 11]], 'tree');
  put(g, [[16, 3], [17, 3], [12, 11]], 'cotton'); // (12,10) pindah ke (12,11): jalan baris 10
  put(g, [[13, 6], [14, 12]], 'dyeplant');
  put(g, [[7, 9], [4, 17], [15, 13]], 'flowers');
  put(g, [[10, 12]], 'lantern');
  return g;
}
