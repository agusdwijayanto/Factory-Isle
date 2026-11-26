// v49: Padang Rumput, 20x20 — dua varian (utara & selatan kota).
// v57 (rombak total ikut gambar tangan Agus): varian UTARA = Blok 3 + Blok 6
// (tanpa sungai, tanpa rel); jalan mendatar baris 8 (barat ke Blok 2) dan
// baris 10 (barat ke Blok 5), kolom 10 turun ke selatan (ujungnya petak
// putih Plot), cabang baris 14 ke timur. Variasi SELATAN = Blok 7 + Blok 8
// (sungai masuk dari utara lewat kolom 1, belok timur di baris 11 ke
// Pelabuhan; rel masuk dari utara kolom 18, belok timur di baris 6 ke
// Pelabuhan); jalan kolom 5 (dari Blok 4) dan kolom 13 (dari Blok 5) turun
// ke jalan bawah baris 17 (timur ke Blok 9); jembatan di (5,11) dan (13,11)
// tempat jalan menyeberang sungai baris 11.
// v51: varian UTARA membawa petak putih plot di (10,5) — diinjak langsung
// pindah ke lahan.
function buildMeadow(north) {
  const g = makeGrid(MAP_W, MAP_H);
  if (!north) {
    // Sungai selatan: kolom 1 dari utara (lanjutan Hutan Kapas), belok
    // timur di baris 11 menuju Pelabuhan.
    terrain(g, rng(0, 11).map((gy) => [1, gy]), 'water');
    terrain(g, rng(1, 19).map((gx) => [gx, 11]), 'water');
  }
  // Pasir tepi: utara kolom 2, selatan kolom 17 (tanpa baris 11 di selatan
  // supaya tidak menutup sungai; (17,17) pindah ke (17,18): jalan baris 17).
  terrain(g, north ? [[2, 4], [2, 11], [2, 17]] : [[17, 4], [17, 18]], 'sand');
  if (!north) {
    // Rel selatan: kolom 18 dari utara (lanjutan Kota), belok timur di
    // baris 6 menuju Pelabuhan.
    railYAt(g, 18, 0, 6);
    railXAt(g, 6, 18, 19);
  }
  if (north) {
    // Jalan: baris 8 ke Blok 2, baris 10 ke Blok 5, kolom 10 turun ke
    // selatan (ujungnya Plot di (10,5)), cabang baris 14 ke timur.
    roadAt(g, rng(0, 10).map((gx) => [gx, 8]));
    roadAt(g, rng(0, 10).map((gx) => [gx, 10]));
    roadAt(g, rng(6, 14).map((gy) => [10, gy]));
    roadAt(g, rng(10, 14).map((gx) => [gx, 14]));
  } else {
    // Jalan: kolom 5 (dari Blok 4) dan kolom 13 (dari Blok 5) turun ke
    // jalan bawah baris 17 (timur ke Blok 9).
    roadAt(g, rng(0, 17).map((gy) => [5, gy]));
    roadAt(g, rng(0, 17).map((gy) => [13, gy]));
    roadAt(g, rng(5, 19).map((gx) => [gx, 17]));
    terrain(g, [[5, 11], [13, 11]], 'bridge'); // jalan menyeberang sungai baris 11
  }
  put(g, [[3, 4], [4, 9], [15, 4], [16, 10], [3, 15], [14, 16], [6, 12], [17, 8]], 'tree');
  if (north) {
    put(g, [[5, 3], [12, 4], [7, 9], [13, 13], [4, 17], [11, 17]], 'flowers');
    put(g, [[11, 7], [12, 15]], 'lantern'); // (10,7)->(11,7) jalan 10, (12,14)->(12,15) cabang 14
  } else {
    put(g, [[6, 3], [12, 4], [7, 9], [14, 13], [4, 17], [11, 18]], 'flowers'); // (5,3)->(6,3) jalan 5, (13,13)->(14,13) jalan 13, (11,17)->(11,18) jalan 17
    put(g, [[10, 7], [12, 14]], 'lantern');
  }
  if (north) {
    g[5][10].obj = 'plotpad'; // v55: (10,5) = Blok 6 Lembah Hijau, di ujung jalan kolom 10
    g[5][11].obj = 'plotsign'; // v55: papan "PLOT" tepat di timur petak putih
  }
  return g;
}
function buildMeadowN() { return buildMeadow(true); }
function buildMeadowS() { return buildMeadow(false); }
