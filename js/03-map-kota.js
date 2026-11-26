// v49: Kota 20x20 (dulu 20x14) — 6 toko, Mayor, rel + stasiun.
// v57 (rombak total ikut gambar tangan Agus): koridor utama pindah ke
// kanan — jalan kolom 17 utara-selatan (pintu utara ke Blok 2, pintu selatan
// ke Blok 8), rel kolom 18 di sampingnya, stasiun di timur lokomotif (19,7);
// jalan mendatar baris 10 (tengah, barat ke Blok 4, timur ke Blok 6);
// jalan kolom 13 turun dari baris 10 ke selatan (pintu kedua ke Blok 8).
// Sungai tetap tidak lewat kota. JANGKAR SIMPAN: grid[10][17] jalan,
// grid[7][1] lantern, grid[13][7] mayor.
function buildTown() {
  const town = makeGrid(TOWN_W, TOWN_H);
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
  // Rel tembus kolom 18 penuh (samping jalan kolom 17); stasiun di timur
  // lokomotif (tepi kanan map, sesuai gambar: stasiun di batas Blok 5-6).
  railYAt(town, 18, 0, TOWN_H - 1);
  town[7][19].obj = 'station'; // (19,7)
  town[7][18].obj = 'train'; // (18,7), di atas rel
  town[8][18].obj = 'trainCar'; // (18,8), gerbong 1 petak ke selatan (v52)
  // Jalan: kolom 17 utara-selatan, baris 10 mendatar (tengah), kolom 13
  // dari baris 10 ke selatan (pintu kedua).
  roadAt(town, [
    ...rng(0, TOWN_H - 1).map((gy) => [17, gy]),
    ...rng(10, TOWN_H - 1).map((gy) => [13, gy]),
    ...rng(0, TOWN_W - 1).map((gx) => [gx, 10]),
  ]);
  put(town, [[1, 7], [14, 7], [14, 11]], 'lantern'); // (1,7) jangkar simpan; (14,10) pindah ke (14,11): jalan baris 10
  put(town, [[3, 5]], 'lamppost');
  put(town, [[5, 7]], 'planter');
  put(town, [[12, 5]], 'bench');
  put(town, [[13, 5]], 'mailbox');
  put(town, [[1, 4]], 'campTipi');
  put(town, [[2, 4]], 'campfire');
  terrain(town, [[4, 1], [6, 1], [12, 1], [13, 1]], 'clay');
  return town;
}
