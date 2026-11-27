// v49: Gunung Es + Tambang, 20x20 — map PALING BARAT-LAUT pulau 3x3
// (Blok 1). Salju, sungai/danau beku di barat, tebing batu di utara,
// tambang bijih di timur, stasiun + kereta di rel bawah.
// v58 (angka kunci Agus (x,z) Blok 1): jalan x=6 (z 6-20) + jalan z=6
// (x 1-6); rel x=3 (z 7-20) di selatan jalan; stasiun (2,7), lokomotif
// (3,8) menghadap timur, gerbong di baratnya (3,7).
// v59: palang merah railStop (3,9) diganti rel biasa (perintah Agus
// 2026-11-27) — Blok 1 tidak ada railStop lagi.
function buildIce() {
  const ice = makeGrid(MAP_W, MAP_H);
  for (let gy = 0; gy < MAP_H; gy++) for (let gx = 0; gx < MAP_W; gx++) ice[gy][gx].t = 'snow';
  // Hulu sungai beku memanjang ke selatan + danau es.
  terrain(ice, rng(2, MAP_H - 1).map((gy) => [1, gy]), 'ice');
  terrain(ice, [...rng(2, 3).flatMap((gx) => rng(4, 8).map((gy) => [gx, gy]))], 'ice');
  terrain(ice, [[2, 12], [3, 12]], 'clay'); // tepian liat
  // Tebing batu di utara (rintangan, bukan bijih).
  put(ice, [[0, 0], [2, 0], [4, 0], [6, 0], [10, 0], [12, 0], [14, 0], [16, 0], [18, 0], [3, 1], [15, 1]], 'mountain');
  put(ice, [[12, 3], [13, 4], [11, 4]], 'oreIron');
  put(ice, [[15, 6], [16, 7], [15, 9]], 'oreCopper');
  put(ice, [[12, 10], [13, 11], [12, 12]], 'oreTin');
  put(ice, [[16, 3], [16, 4]], 'goldOre');
  put(ice, [[17, 10], [18, 11], [16, 12], [17, 12]], 'stone');
  put(ice, [[3, 4], [4, 7], [3, 10], [6, 15], [3, 17], [15, 13], [14, 16], [16, 16], [4, 18]], 'treePine'); // (15,14) pindah ke (15,13): jalan x=6
  // Rel mendatar x=3 (baris 17), z 7-20, di selatan jalan x=6.
  terrain(ice, rng(6, 19).map((gx) => [gx, 17]), 'railX');
  ice[18][6].obj = 'station'; // (2,7), selatan gerbong
  ice[17][7].obj = 'train'; // (3,8), lokomotif menghadap timur
  ice[17][6].obj = 'trainCar'; // (3,7), gerbong di barat lokomotif
  put(ice, [[7, 7]], 'lantern');
  // Jalan: x=6 mendatar (baris 14, z 6-20, timur ke Blok 2), z=6 turun ke
  // selatan (pintu ke Hutan Kapas).
  terrain(ice, rng(5, 19).map((gx) => [gx, 14]), 'road');
  terrain(ice, rng(14, MAP_H - 1).map((gy) => [5, gy]), 'road');
  return ice;
}
