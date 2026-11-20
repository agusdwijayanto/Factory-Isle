// Kota 20x14 (v36, dulu 16x12): 6 toko, Mayor, jalan masuk lahan, sungai
// di utara dengan jembatan ke gunung, clay di tepian. Pecahan 03-data.js (v16).
function buildTown() {
  const town = makeGrid(TOWN_W, TOWN_H);
  terrain(town, Array.from({ length: TOWN_W }, (_, x) => [x, 0]), 'water');
  town[0][8].t = 'bridge'; // jembatan: satu-satunya jalan ke utara
  for (const s of SHOP_SPOTS.filter((s) => s.map === 'town')) town[s.gy][s.gx].obj = 'shop_' + s.id;
  town[S.mayor.gy][S.mayor.gx].obj = 'mayor';
  town[13][7].obj = 'plotsign'; // v36: tanda kuning menu plot, di samping pad lahan (8,13)
  // v48: peron diganti bangunan stasiun. Panel naik kereta dibuka dari stasiun.
  town[8][7].obj = 'station';
  town[9][7].obj = 'train'; // kereta tetap di (7,9), di atas rel
  railXAt(town, 9, 0, TOWN_W - 1); // rel kiri-kanan penuh di baris peron
  // jalan: kolom tengah (8) utara-selatan sampai jalan masuk lahan (8,13),
  // baris tengah (6) dan baris toko (2) dari tepi ke tepi
  roadAt(town, [
    ...rng(1, 13).map((gy) => [8, gy]), // kolom selatan sampai pad lahan; (8,9) tetap rel, (8,8) jalan
    ...rng(0, TOWN_W - 1).map((gx) => [gx, 6]),
    ...rng(1, TOWN_W - 1).map((gx) => [gx, 2]),
  ]);
  put(town, [[1, 7], [7, 5], [14, 7]], 'lantern');
  // v48: prop kota kecil di tepi jalan
  put(town, [[3, 5]], 'lamppost');
  put(town, [[5, 7]], 'planter');
  put(town, [[9, 7]], 'bench');
  put(town, [[9, 5]], 'mailbox');
  put(town, [[1, 4]], 'campTipi');
  put(town, [[2, 4]], 'campfire');
  terrain(town, [[6, 1], [7, 1], [9, 1], [10, 1]], 'clay');
  return town;
}
