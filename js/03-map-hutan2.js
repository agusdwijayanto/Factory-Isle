// v49: Lahan Ijo + Hutan Dikit, 20x20 — hutan jarang antara Hutan Rimbun
// dan lahan bangun. Sungai mengalir utara-selatan lewat kolom 1 (lanjutan
// Hutan Rimbun) sampai lahan.
// v55: Forestry Station pindah ke sini dari Hutan Lebat (Blok 2 Kebun
// Kapas). Stasiun di timur rel (10,7), kereta di (9,7), gerbong (9,8).
// Pintu utara ke Hutan Rimbun, pintu selatan ke Padang Rumput.
function buildForest2() {
  const g = makeGrid(MAP_W, MAP_H);
  // Sungai kolom 1 + tepi pasir.
  terrain(g, rng(0, MAP_H - 1).map((gy) => [1, gy]), 'water');
  terrain(g, [[2, 5]], 'sand');
  railYAt(g, 9, 0, MAP_H - 1);
  roadAt(g, rng(0, MAP_H - 1).map((gy) => [8, gy]));
  put(g, [[3, 3], [4, 9], [15, 4], [6, 14], [16, 16], [11, 7], [17, 11]], 'tree');
  put(g, [[16, 3], [17, 3], [12, 10]], 'cotton');
  put(g, [[13, 6], [14, 12]], 'dyeplant');
  put(g, [[7, 9], [4, 17], [15, 13]], 'flowers');
  put(g, [[10, 12]], 'lantern');
  g[7][10].obj = 'station'; // (10,7) timur rel
  g[7][9].obj = 'train';    // (9,7)
  g[8][9].obj = 'trainCar'; // (9,8) gerbong 1 petak ke selatan
  return g;
}
