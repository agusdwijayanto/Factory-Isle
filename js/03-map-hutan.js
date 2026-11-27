// v49: Padang Rumput + Hutan Lebat, 20x20 — hutan lebat tanpa stasiun.
// JANGKAR SIMPAN: grid[6][12] dyeplant (tetap). grid[8][17] jalan v57/v58 —
// v59 tidak ada jalan di situ, dipakai stale check untuk deteksi simpan lama.
// v59 (angka kunci Agus (x,z) Blok 2): rel mendatar x=3 (baris 17, z 1-19);
// jalan x=6 (baris 14, z 1-16) + jalan z=16 (x 1-11) + jalan x=11 (baris 9,
// z 16-20). Rel dulu, jalan kemudian — di persilangan (15,17) rel yang
// terus, jalan putus 1 petak (tetap bisa dilewati, rel bisa diinjak).
// Pintu: barat ke Blok 1 (baris 14), timur ke Blok 3 (baris 9), selatan ke
// Blok 5 (kolom 15, lahir geser 1 petak ke jalan kolom 14 kota).
function buildForest() {
  const forest = makeGrid(MAP_W, MAP_H);
  put(forest, [[2, 2], [5, 3], [3, 6], [6, 4], [2, 9], [4, 10], [3, 12], [5, 13],
    [10, 4], [11, 11], [7, 16], [16, 12], [16, 16], [4, 16], [12, 15], [16, 14]], 'tree'); // (5,14)->(5,13) jalan 14, (15,17)->(16,16) jalan 15 + rel 17
  put(forest, [[17, 2], [18, 2], [17, 3]], 'cotton');
  put(forest, [[12, 6], [13, 6], [16, 6]], 'dyeplant'); // (12,5) jangkar simpan pindah ke (12,6): rel baris 5
  put(forest, [[11, 9]], 'lantern'); // (11,8) pindah ke (11,9): jalan baris 8
  terrain(forest, [[2, 1], [18, 1]], 'sand');
  // v59: rel masuk dari barat di baris 17 (x=3), lurus ke timur.
  railXAt(forest, 17, 0, 18);
  // Jalan: baris 14 mendatar (barat ke Blok 1); kolom 15 turun ke selatan
  // (Blok 5, memotong rel baris 17); baris 9 mendatar (timur ke Blok 3).
  roadAt(forest, rng(0, 15).map((gx) => [gx, 14]));
  roadAt(forest, rng(9, 19).map((gy) => [15, gy]));
  roadAt(forest, rng(15, 19).map((gx) => [gx, 9]));
  return forest;
}
