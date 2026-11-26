// v49: Kota 20x20 (dulu 20x14) — 6 toko, Mayor, rel kolom 9 tembus
// utara-selatan dengan stasiun di (10,7)+kereta (9,7).
// v56 (pulau 3x3): sungai DIHAPUS dari kota — sungai pulau lewat barat
// (1 ke 4 ke 7) dan selatan (8 ke 9), tidak lewat Blok 5. Air tepi utara,
// sungai kolom 18, dan jembatannya keluar; papan "COMING SOON" timur/barat
// dicabut karena jalan baris 6 sekarang tembus ke Blok 4 (barat) dan Blok 6
// (timur). JANGKAR SIMPAN: grid[13][8] jalan, grid[7][1] lantern, grid[13][7] mayor.
function buildTown() {
  const town = makeGrid(TOWN_W, TOWN_H);
  terrain(town, [[9, 0]], 'railY');  // rel menyeberang tepi utara
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
  // v54: wagonShop 2×2 — pindah dari (3,3) ke (5,4) karena 3 tetangga utara
  // (3,3) menabrak jalan baris gy=2; blokir 3 petak iso-belakang seperti toko.
  town[4][5].obj = 'wagonShop'; // (5,4) = x16,z6
  town[3][5].blocked = true; // (5,3)
  town[4][4].blocked = true; // (4,4)
  town[3][4].blocked = true; // (4,3)
  // Rel tembus kolom 9 penuh; stasiun di timurnya (jalan kolom 8).
  railYAt(town, 9, 1, TOWN_H - 1);
  town[7][10].obj = 'station'; // (10,7)
  town[7][9].obj = 'train';    // (9,7), di atas rel
  town[8][9].obj = 'trainCar'; // (9,8), gerbong 1 petak ke selatan (v52)
  // Jalan: kolom 8 utara-selatan, baris 6 (jalan utama timur-barat),
  // baris 2 (jalan toko).
  roadAt(town, [
    ...rng(0, TOWN_H - 1).map((gy) => [8, gy]),
    ...rng(0, TOWN_W - 1).map((gx) => [gx, 6]),
    ...rng(1, TOWN_W - 1).map((gx) => [gx, 2]),
  ]);
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
