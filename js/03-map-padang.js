// v49: Padang Rumput, 20x20 — dua varian (utara & selatan kota).
// v59 (angka kunci Agus (x,z)): varian UTARA = Blok 3 + Blok 6 (tanpa
// sungai, tanpa rel); jalan x=11 (baris 9, z 1-5); Plot di (11,11) = Blok 6
// (bukan Blok 3), di rumput timur ujung jalan. Variasi SELATAN = Blok 7 +
// Blok 8 (sungai masuk dari utara lewat kolom 1, belok timur di baris 11
// ke Pelabuhan; rel masuk dari utara kolom 18 turun sampai baris 9, belok
// timur ke Pelabuhan); jalan x=15 (baris 5, z 1-20) + jalan z=15 (x 15-20,
// turun ke baris 5); jembatan di (1,5) tempat jalan menyeberang sungai
// kolom 1.
// v60: jalan utara persis (11,1-5) — perpanjangan v59 sampai z=10 dihapus
// (angka Agus z=5); rel selatan tegak (11-20,19) nyambung ke rel Kota,
// jembatan (18,11) dihapus karena rel tidak lagi menyeberang sungai.
// v51: varian UTARA membawa petak putih plot di (10,9) — diinjak langsung
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
  terrain(g, north ? [[2, 4], [2, 11], [2, 17]] : [[17, 4], [17, 18]], 'sand');
  if (!north) {
    // Rel selatan: kolom 18 (x 11-20) turun dari utara (rel Kota), belok
    // timur di baris 9 (x=11) menuju Pelabuhan. Rel dulu, jalan kemudian.
    railYAt(g, 18, 0, 9);
    railXAt(g, 9, 18, 19);
  }
  if (north) {
    // Jalan: baris 9 (x=11, z 1-5) ke Blok 2 (barat); Plot (10,9) di Blok 6
    // di rumput timur ujung jalan, bukan di ujung jalan.
    roadAt(g, rng(0, 4).map((gx) => [gx, 9]));
  } else {
    // Jalan: baris 5 mendatar (barat ke Blok 7, timur ke Blok 9), kolom 14
    // turun dari utara (Blok 4/Blok 5) ke baris 5.
    roadAt(g, rng(0, 19).map((gx) => [gx, 5]));
    roadAt(g, rng(0, 5).map((gy) => [14, gy]));
    terrain(g, [[1, 5]], 'bridge'); // jalan baris 5 menyeberang sungai kolom 1
  }
  put(g, [[3, 4], [4, 8], [15, 4], [16, 10], [3, 15], [14, 16], [6, 12], [17, 8]], 'tree'); // (4,9)->(4,8): jalan baris 9 (utara)
  if (north) {
    put(g, [[5, 3], [12, 4], [7, 8], [13, 13], [4, 17], [11, 17]], 'flowers'); // (7,9)->(7,8): jalan baris 9
    put(g, [[11, 7], [12, 15]], 'lantern'); // (10,7)->(11,7) jalan 10, (12,14)->(12,15) cabang 14
  } else {
    put(g, [[6, 3], [12, 4], [7, 9], [14, 13], [4, 17], [11, 18]], 'flowers'); // (5,3)->(6,3) jalan 5, (13,13)->(14,13) jalan 13, (11,17)->(11,18) jalan 17
    put(g, [[10, 7], [12, 14]], 'lantern');
  }
  if (north) {
    g[9][10].obj = 'plotpad'; // v59: (10,9) = Blok 6 Lembah Hijau, di ujung jalan baris 9
    g[9][11].obj = 'plotsign'; // v59: papan "PLOT" tepat di timur petak putih
  }
  return g;
}
function buildMeadowN() { return buildMeadow(true); }
function buildMeadowS() { return buildMeadow(false); }
