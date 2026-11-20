// v49: Kota 20x20 (dulu 20x14) — 6 toko, Mayor, sungai utara + jembatan ke
// Lahan, rel kolom 9 tembus utara-selatan dengan stasiun di (10,7)+kereta (9,7).
// Sungai masuk dari jembatan utara, mengalir ke timur lalu turun kolom 18
// menuju Lahan Ijo Selatan (dua jalan kota menyeberanginya lewat jembatan).
// JANGKAR SIMPAN (12-simpan.js tidak diubah): grid[13][8] jalan,
// grid[7][1] lantern, grid[13][7] plotsign.
function buildTown() {
  const town = makeGrid(TOWN_W, TOWN_H);
  terrain(town, rng(0, TOWN_W - 1).map((gx) => [gx, 0]), 'water');
  terrain(town, [[8, 0]], 'bridge'); // jembatan jalan utama ke utara (Lahan)
  terrain(town, [[9, 0]], 'railY');  // rel menyeberang air
  // v49: sungai lanjut ke selatan lewat kolom 18 (timur kota).
  terrain(town, rng(1, TOWN_H - 1).map((gy) => [18, gy]), 'water');
  for (const s of SHOP_SPOTS.filter((s) => s.map === 'town')) town[s.gy][s.gx].obj = 'shop_' + s.id;
  town[S.mayor.gy][S.mayor.gx].obj = 'mayor';
  town[13][7].obj = 'plotsign'; // jangkar simpan; papan arah lahan
  // Rel tembus kolom 9 penuh; stasiun di timurnya (jalan kolom 8).
  railYAt(town, 9, 1, TOWN_H - 1);
  town[7][10].obj = 'station'; // (10,7)
  town[7][9].obj = 'train';    // (9,7), di atas rel
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
