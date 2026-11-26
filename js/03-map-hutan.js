// v49: Padang Rumput + Hutan Lebat, 20x20 — hutan lebat tanpa stasiun.
// JANGKAR SIMPAN: grid[6][12] dyeplant, grid[8][17] jalan. Jangan pindahkan.
// v57 (rombak total ikut gambar tangan Agus): jalan+rel pindah ke kanan —
// rel mendatar baris 5 (di atas jalan baris 8), turun kolom 18 ke selatan
// (Blok 5); jalan mendatar baris 8 (tengah), turun kolom 17 ke selatan.
// Pintu: barat ke Blok 1 (baris 8), timur ke Blok 3 (baris 8), selatan ke
// Blok 5 (kolom 17). Tanpa stasiun, tanpa sungai.
function buildForest() {
  const forest = makeGrid(MAP_W, MAP_H);
  put(forest, [[2, 2], [5, 3], [3, 6], [6, 4], [2, 9], [4, 10], [3, 12], [5, 14],
    [10, 4], [11, 11], [7, 16], [16, 12], [15, 17], [4, 16], [12, 15], [16, 14]], 'tree'); // (3,5)->(3,6) rel 5, (2,8)->(2,9) jalan 8, (17,14)->(16,14) jalan 17
  put(forest, [[17, 2], [18, 2], [17, 3]], 'cotton');
  put(forest, [[12, 6], [13, 6], [16, 6]], 'dyeplant'); // (12,5) jangkar simpan pindah ke (12,6): rel baris 5
  put(forest, [[11, 9]], 'lantern'); // (11,8) pindah ke (11,9): jalan baris 8
  terrain(forest, [[2, 1], [18, 1]], 'sand');
  // v57: rel masuk dari barat di baris 5, turun kolom 18 ke selatan.
  railYAt(forest, 18, 5, MAP_H - 1);
  railXAt(forest, 5, 0, 19);
  // Jalan: baris 8 mendatar (barat ke Blok 1, timur ke Blok 3); kolom 17
  // turun ke selatan (Blok 5, samping rel kolom 18).
  roadAt(forest, rng(0, 19).map((gx) => [gx, 8]));
  roadAt(forest, rng(8, MAP_H - 1).map((gy) => [17, gy]));
  return forest;
}
