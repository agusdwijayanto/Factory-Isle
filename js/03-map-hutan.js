// v49: Padang Rumput + Hutan Lebat, 20x20 — hutan lebat tanpa stasiun.
// JANGKAR SIMPAN: grid[0][8] jalan, grid[5][12] dyeplant. Jangan pindahkan.
// v56: sungai utara-selatan (kolom 1) dan air tepi utara DIHAPUS — sungai
// pulau tidak lagi lewat Blok 2 (rute sungai: 1 ke 4 ke 7 ke 8 ke 9).
// Rel belok: masuk dari barat (Blok 1) di baris 17, turun kolom 9 ke
// selatan (Blok 5). Pintu: barat ke Blok 1, timur ke Blok 3, selatan ke Blok 5.
// v55: stasiun kereta PINDAH ke Hutan Kapas. v56: stasiun Forestry DIHAPUS
// — stasiun cuma di Blok 1, 5, 9; Hutan Lebat tanpa stasiun.
function buildForest() {
  const forest = makeGrid(MAP_W, MAP_H);
  put(forest, [[2, 2], [5, 3], [3, 5], [6, 4], [2, 8], [4, 10], [3, 12], [5, 14],
    [10, 4], [11, 11], [7, 16], [16, 12], [15, 17], [4, 16], [12, 15], [17, 14]], 'tree');
  put(forest, [[17, 2], [18, 2], [17, 3]], 'cotton');
  put(forest, [[12, 5], [13, 5], [16, 5]], 'dyeplant'); // (12,5) jangkar simpan
  put(forest, [[11, 8]], 'lantern');
  terrain(forest, [[2, 1], [18, 1]], 'sand');
  // v56: rel masuk dari barat di baris 17 (samping jalan baris 18), turun
  // kolom 9 ke selatan. Rel utara (ke tepi pulau) dihapus.
  railYAt(forest, 9, 17, MAP_H - 1);
  railXAt(forest, 17, 0, 9);
  // Jalan: kolom 8 utara-selatan tembus; baris 18 ke barat (Blok 1),
  // baris 10 ke timur (Blok 3, tengah).
  roadAt(forest, rng(0, MAP_H - 1).map((gy) => [8, gy]));
  roadAt(forest, rng(0, 8).map((gx) => [gx, 18]));
  roadAt(forest, rng(8, 19).map((gx) => [gx, 10]));
  return forest;
}
