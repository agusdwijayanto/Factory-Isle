// v49: Lahan Ijo + Hutan Rimbun, 20x20 — hutan lebat + stasiun kereta hutan.
// JANGKAR SIMPAN (12-simpan.js tidak diubah): grid[0][8] jembatan,
// grid[9][14] kereta, grid[5][12] dyeplant. Jangan pindahkan.
// Stasiun hutan tetap di (14,8), kereta tetap di (14,9) — pintu utara ke
// Lahan Ijo, pintu selatan ke Hutan Dikit.
function buildForest() {
  const forest = makeGrid(MAP_W, MAP_H);
  put(forest, [[2, 2], [5, 3], [3, 5], [6, 4], [2, 8], [4, 10], [3, 12], [5, 14],
    [10, 4], [11, 11], [7, 16], [16, 12], [15, 17], [4, 17], [12, 15], [17, 14]], 'tree');
  put(forest, [[17, 2], [18, 2], [17, 3]], 'cotton');
  put(forest, [[12, 5], [13, 5], [16, 5]], 'dyeplant'); // (12,5) jangkar simpan
  put(forest, [[11, 8]], 'lantern');
  terrain(forest, [[2, 1], [18, 1]], 'sand');
  // Sungai tepi utara: air dulu, baru jembatan + rel menimpa air.
  terrain(forest, rng(0, MAP_W - 1).map((gx) => [gx, 0]), 'water');
  terrain(forest, [[8, 0]], 'bridge'); // jembatan jalan utama (jangkar simpan)
  terrain(forest, [[9, 0]], 'railY');  // rel menyeberang air
  // v49: sungai mengalir utara-selatan lewat kolom 1 (nyambung dari Lahan Ijo
  // di utara ke Hutan Dikit di selatan), jadi air tepi utara tidak buntu.
  terrain(forest, rng(1, MAP_H - 1).map((gy) => [1, gy]), 'water');
  // Rel: kolom 9 dari utara, tikung ke timur di baris 9 menuju stasiun hutan,
  // lalu kolom 9 lanjut tembus ke selatan.
  railYAt(forest, 9, 0, 9);
  railXAt(forest, 9, 10, MAP_W - 1);
  terrain(forest, [[9, 9]], 'railBend');
  railYAt(forest, 9, 10, MAP_H - 1);
  forest[8][14].obj = 'station';  // (14,8)
  forest[9][14].obj = 'train';    // (14,9) jangkar simpan
  // Jalan: kolom 8 utara-selatan + cabang baris 7 ke stasiun + pintu selatan.
  roadAt(forest, [
    ...rng(0, MAP_H - 1).map((gy) => [8, gy]),
    ...rng(10, 17).map((gx) => [gx, 7]),
  ]);
  return forest;
}
