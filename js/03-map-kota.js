// v49: Kota 20x20 (dulu 20x14) — 6 toko, Mayor, sungai utara + jembatan ke
// Lahan, rel kolom 9 tembus utara-selatan dengan stasiun di (10,7)+kereta (9,7).
// Sungai masuk dari jembatan utara, mengalir ke timur lalu turun kolom 18
// menuju Padang Rumput Selatan (dua jalan kota menyeberanginya lewat jembatan).
// v50: toko disebar lewat SHOP_SPOTS (empat arah). v51: Mayor pindah ke
// (7,13) = x7,z8 dengan salon (7,11) tepat di utaranya; petak putih plot
// pindah ke Padang Rumput, jadi kota tidak punya petak putih lagi.
// JANGKAR SIMPAN: grid[13][8] jalan, grid[7][1] lantern, grid[13][7] mayor.
function buildTown() {
  const town = makeGrid(TOWN_W, TOWN_H);
  terrain(town, rng(0, TOWN_W - 1).map((gx) => [gx, 0]), 'water');
  terrain(town, [[8, 0]], 'bridge'); // jembatan jalan utama ke utara (Lahan)
  terrain(town, [[9, 0]], 'railY');  // rel menyeberang air
  // v49: sungai lanjut ke selatan lewat kolom 18 (timur kota).
  terrain(town, rng(1, TOWN_H - 1).map((gy) => [18, gy]), 'water');
  for (const s of SHOP_SPOTS.filter((s) => s.map === 'town')) {
    town[s.gy][s.gx].obj = 'shop_' + s.id;
    // sprite toko 2×2 sel menutupi 3 petak iso-belakang; blokir supaya pemain tidak bisa jalan menembus bangunan
    if (s.gy - 1 >= 0 && s.gx - 1 >= 0) {
      town[s.gy - 1][s.gx].blocked = true;
      town[s.gy][s.gx - 1].blocked = true;
      town[s.gy - 1][s.gx - 1].blocked = true;
    }
  }
  town[S.mayor.gy][S.mayor.gx].obj = 'mayor'; // v51: (7,13)
  town[3][3].obj = 'wagonShop'; // v52: bangunan beli wagon pindah ke kota (x17,z4)
  // Rel tembus kolom 9 penuh; stasiun di timurnya (jalan kolom 8).
  railYAt(town, 9, 1, TOWN_H - 1);
  town[7][10].obj = 'station'; // (10,7)
  town[7][9].obj = 'train';    // (9,7), di atas rel
  town[8][9].obj = 'trainCar'; // (9,8), gerbong 1 petak ke selatan (v52)
  // Jalan: kolom 8 utara-selatan, baris 6 (jalan utama timur-barat),
  // baris 2 (jalan toko).
  roadAt(town, [
    ...rng(1, TOWN_H - 1).map((gy) => [8, gy]),
    ...rng(0, TOWN_W - 1).map((gx) => [gx, 6]),
    ...rng(1, TOWN_W - 1).map((gx) => [gx, 2]),
  ]);
  // v49: jalan timur & barat buntu — papan "COMING SOON" (petak diblokir).
  town[6][0].obj = 'signClosed';
  town[6][TOWN_W - 1].obj = 'signClosed';
  // v49: dua jalan kota menyeberangi sungai kolom 18 lewat jembatan.
  terrain(town, [[18, 2], [18, 6]], 'bridge');
  put(town, [[1, 7], [14, 7], [14, 10]], 'lantern'); // (1,7) jangkar simpan
  put(town, [[3, 5]], 'lamppost');
  put(town, [[5, 7]], 'planter');
  put(town, [[12, 5]], 'bench');
  put(town, [[13, 5]], 'mailbox');
  put(town, [[1, 4]], 'campTipi');
  put(town, [[2, 4]], 'campfire');
  terrain(town, [[4, 1], [6, 1], [12, 1], [13, 1]], 'clay');
  return town;
}
