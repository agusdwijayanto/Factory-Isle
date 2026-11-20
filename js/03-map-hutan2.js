// v49: Lahan Ijo + Hutan Dikit, 20x20 — hutan jarang antara Hutan Rimbun
// dan lahan bangun. Tanpa stasiun; rel cuma menembus (kolom 9). Sungai
// mengalir utara-selatan lewat kolom 1 (lanjutan Hutan Rimbun) sampai lahan.
// Pintu utara ke Hutan Rimbun, pintu selatan ke Lahan.
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
  return g;
}
