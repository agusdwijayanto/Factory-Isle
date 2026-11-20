// v49: Padang Rumput + Hutan Lebat, 20x20 — hutan lebat + stasiun kereta.
// JANGKAR SIMPAN: grid[0][8] jembatan, grid[7][9] kereta (v50), grid[5][12]
// dyeplant. Jangan pindahkan.
// v50: rel diluruskan (tanpa belokan); stasiun di (8,7), kereta di (9,7) di
// rel lurus. Pintu utara ke Padang Rumput, pintu selatan ke Hutan Kapas.
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
  // v50: rel LURUS kolom 9 utara-selatan (belokan + rel cabang ke (14,9)
  // dihapus); stasiun di sisi barat rel, kereta di atas rel.
  railYAt(forest, 9, 0, MAP_H - 1);
  forest[7][8].obj = 'station'; // (8,7)
  forest[7][9].obj = 'train';   // (9,7) jangkar simpan v50
  // Jalan: kolom 8 utara-selatan. Stasiun (8,7) duduk di tengah kolom itu,
  // jadi petaknya bukan jalan lagi — pemain memutar lewat rumput di
  // (7,7)/(7,8) atau (8,6)->(7,6). Cabang jalan baris 7 ke stasiun lama
  // (x 10..17) dibuang karena stasiunnya sudah di jalan utama.
  roadAt(forest, rng(0, MAP_H - 1).map((gy) => [8, gy]));
  return forest;
}
