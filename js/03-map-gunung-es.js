// v49: Gunung Es + Tambang, 20x20 — map PALING BARAT-LAUT pulau 3x3
// (Blok 1). Salju, sungai/danau beku di barat, tebing batu di utara,
// tambang bijih di timur, stasiun + kereta di rel atas.
// v57 (rombak total ikut gambar tangan Agus): jalan+rel pindah ke pola
// gambar — rel mendatar di baris 5 (di atas jalan baris 8), jalan mendatar
// baris 8 (tengah, bukan bawah), jalan kolom 5 turun ke selatan (pintu ke
// Hutan Kapas). Kereta mendatar: lokomotif (10,5) menghadap timur, gerbong
// di baratnya (9,5); stasiun di selatan lokomotif (10,6).
function buildIce() {
  const ice = makeGrid(MAP_W, MAP_H);
  for (let gy = 0; gy < MAP_H; gy++) for (let gx = 0; gx < MAP_W; gx++) ice[gy][gx].t = 'snow';
  // Hulu sungai beku memanjang ke selatan + danau es.
  terrain(ice, rng(2, MAP_H - 1).map((gy) => [1, gy]), 'ice');
  terrain(ice, [...rng(2, 3).flatMap((gx) => rng(4, 8).map((gy) => [gx, gy]))], 'ice');
  terrain(ice, [[2, 12], [3, 12]], 'clay'); // tepian liat
  // Tebing batu di utara (rintangan, bukan bijih).
  put(ice, [[0, 0], [2, 0], [4, 0], [6, 0], [10, 0], [12, 0], [14, 0], [16, 0], [18, 0], [3, 1], [15, 1]], 'mountain');
  put(ice, [[12, 3], [13, 4], [11, 4]], 'oreIron'); // (11,5) pindah ke (11,4): rel baris 5
  put(ice, [[15, 6], [16, 7], [15, 9]], 'oreCopper'); // (15,8) pindah ke (15,9): jalan baris 8
  put(ice, [[12, 10], [13, 11], [12, 12]], 'oreTin');
  put(ice, [[16, 3], [16, 4]], 'goldOre');
  put(ice, [[17, 10], [18, 11], [16, 12], [17, 12]], 'stone');
  put(ice, [[3, 4], [4, 7], [3, 10], [6, 15], [3, 17], [15, 14], [14, 16], [16, 16], [4, 18]], 'treePine'); // (5,15) pindah ke (6,15): jalan kolom 5
  // Rel mendatar baris 5 (timur ke Blok 2, di atas jalan baris 8).
  terrain(ice, rng(0, 19).map((gx) => [gx, 5]), 'railX');
  terrain(ice, [[11, 5]], 'railStop'); // palang di timur lokomotif
  ice[6][10].obj = 'station'; // (10,6), selatan lokomotif
  ice[5][10].obj = 'train'; // (10,5), lokomotif menghadap timur
  ice[5][9].obj = 'trainCar'; // (9,5), gerbong di barat lokomotif
  put(ice, [[7, 7]], 'lantern');
  // Jalan: baris 8 mendatar (tengah, timur ke Blok 2), kolom 5 turun ke
  // selatan (pintu ke Hutan Kapas). Jalan menimpa sungai beku/danau es.
  terrain(ice, rng(0, 19).map((gx) => [gx, 8]), 'road');
  terrain(ice, rng(8, MAP_H - 1).map((gy) => [5, gy]), 'road');
  return ice;
}
