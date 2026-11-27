// v49: Kota 20x20 (dulu 20x14) — 6 toko, Mayor, rel + stasiun.
// v59 (angka kunci Agus (x,z) Blok 5): jalan x=11 (baris 9, z 1-20) +
// jalan z=15 (x 1-20); rel z=19 (x 1-20, kolom 18) tetap; stasiun di timur
// gerbong (20,10); lokomotif (19,9) + gerbong (19,10) di atas rel. Sungai
// tetap tidak lewat kota. JANGKAR SIMPAN: grid[9][10] jalan (v59),
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
  // Rel tembus kolom 18 penuh (samping jalan kolom 14); stasiun di timur
  // gerbong (tepi kanan map, sesuai gambar: stasiun di batas Blok 5-6).
  railYAt(town, 18, 0, TOWN_H - 1);
  town[10][19].obj = 'station'; // (19,10)
  town[11][18].obj = 'train'; // (18,11), lokomotif di atas rel
  town[10][18].obj = 'trainCar'; // (18,10), gerbong 1 petak ke utara (v59)
  // Jalan: baris 9 mendatar (barat ke Blok 4, timur ke Blok 6), kolom 14
  // utara-selatan (pintu utara ke Blok 2, pintu selatan ke Blok 8). Rel
  // dulu, jalan kemudian — di persilangan (18,9) rel yang terus.
  roadAt(town, [
    ...rng(0, TOWN_W - 1).map((gx) => [gx, 9]),
    ...rng(0, TOWN_H - 1).map((gy) => [14, gy]),
  ]);
  put(town, [[1, 7], [15, 7], [15, 11]], 'lantern'); // (1,7) jangkar simpan; (14,7)->(15,7) jalan 14, (14,11)->(15,11) jalan 14
  put(town, [[3, 5]], 'lamppost');
  put(town, [[5, 7]], 'planter');
  put(town, [[12, 5]], 'bench');
  put(town, [[13, 5]], 'mailbox');
  put(town, [[1, 4]], 'campTipi');
  put(town, [[2, 4]], 'campfire');
  terrain(town, [[4, 1], [6, 1], [12, 1], [13, 1]], 'clay');
  return town;
}
