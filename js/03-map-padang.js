// v49: Padang Rumput, 20x20 — dua varian (utara & selatan kota).
// v56 (pulau 3x3): varian UTARA = Blok 3 + Blok 6 (tanpa sungai, tanpa
// rel — sungai dan rel tidak lewat sini); varian SELATAN = Blok 7 + Blok 8
// (sungai masuk dari utara lewat kolom 1, belok timur di baris 11 ke
// Pelabuhan; rel masuk dari utara kolom 9, belok timur di baris 6 ke
// Pelabuhan, samping jalan baris 5).
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
  // supaya tidak menutup sungai).
  terrain(g, north ? [[2, 4], [2, 11], [2, 17]] : [[17, 4], [17, 17]], 'sand');
  if (!north) {
    // Rel selatan: kolom 9 dari utara (lanjutan Kota), belok timur di
    // baris 6 menuju Pelabuhan (samping jalan baris 5).
    railYAt(g, 9, 0, 6);
    railXAt(g, 6, 9, 19);
  }
  roadAt(g, rng(0, MAP_H - 1).map((gy) => [8, gy]));
  if (north) {
    // Jalan barat: baris 10 ke Blok 2 (tengah), baris 14 ke Blok 5.
    roadAt(g, rng(0, 8).map((gx) => [gx, 10]));
    roadAt(g, rng(0, 8).map((gx) => [gx, 14]));
  } else {
    // Jalan timur ke Blok 9 (baris 5, samping rel baris 6); jalan utara
    // baris 0 ke Blok 5 (pintu kedua, di (14,0)).
    roadAt(g, rng(8, 19).map((gx) => [gx, 5]));
    roadAt(g, rng(8, 14).map((gx) => [gx, 0]));
  }
  put(g, [[3, 4], [4, 9], [15, 4], [16, 10], [3, 15], [14, 16], [6, 12], [17, 8]], 'tree');
  put(g, [[5, 3], [12, 4], [7, 9], [13, 13], [4, 17], [11, 17]], 'flowers');
  put(g, [[10, 7], [12, 14]], 'lantern');
  if (north) {
    g[5][10].obj = 'plotpad'; // v55: (10,5) = Blok 6 Lembah Hijau, 2 petak dari jalan
    g[5][11].obj = 'plotsign'; // v55: papan "PLOT" tepat di timur petak putih
  }
  return g;
}
function buildMeadowN() { return buildMeadow(true); }
function buildMeadowS() { return buildMeadow(false); }
