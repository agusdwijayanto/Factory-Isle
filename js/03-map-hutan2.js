// v49: Lahan Ijo + Hutan Dikit, 20x20 — hutan jarang antara Hutan Rimbun
// dan lahan bangun. Sungai mengalir utara-selatan lewat kolom 1 (lanjutan
// Gunung Es) sampai Padang Rumput Selatan.
// v59 (angka kunci Agus (x,z) Blok 4): jalan z=6 (x 11-20, utara, pintu ke
// Blok 1) + jalan x=11 (baris 9, z 6-20, timur ke Blok 5) + jalan z=15
// (x 1-11, selatan, pintu ke Blok 7). Sungai kolom 1 tidak lagi diseberangi
// jalan — jembatan (1,10) dihapus. Tanpa rel, tanpa stasiun.
function buildForest2() {
  const g = makeGrid(MAP_W, MAP_H);
  // Sungai kolom 1 + tepi pasir.
  terrain(g, rng(0, MAP_H - 1).map((gy) => [1, gy]), 'water');
  terrain(g, [[2, 5]], 'sand');
  roadAt(g, rng(0, 9).map((gy) => [5, gy]));
  roadAt(g, rng(5, 19).map((gx) => [gx, 9]));
  roadAt(g, rng(9, 19).map((gy) => [14, gy]));
  put(g, [[3, 3], [4, 9], [15, 4], [6, 14], [16, 16], [11, 7], [17, 11]], 'tree');
  put(g, [[16, 3], [17, 3], [12, 11]], 'cotton'); // (12,10) pindah ke (12,11): jalan baris 10
  put(g, [[13, 6], [13, 12]], 'dyeplant'); // (14,12)->(13,12): jalan z=15
  put(g, [[7, 8], [4, 17], [15, 13]], 'flowers'); // (7,9)->(7,8): jalan baris 9
  put(g, [[10, 12]], 'lantern');
  return g;
}
