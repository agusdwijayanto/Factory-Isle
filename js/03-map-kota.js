// Kota 16x12: 5 toko, Mayor, kotak plot, sungai di utara dengan
// jembatan ke gunung, clay di tepian. Pecahan 03-data.js (v16).
function buildTown() {
  const town = makeGrid(TOWN_W, TOWN_H);
  terrain(town, Array.from({ length: 16 }, (_, x) => [x, 0]), 'water');
  town[0][8].t = 'bridge'; // jembatan: satu-satunya jalan ke utara
  for (const s of SHOP_SPOTS.filter((s) => s.map === 'town')) town[s.gy][s.gx].obj = 'shop_' + s.id;
  town[S.mayor.gy][S.mayor.gx].obj = 'mayor';
  town[S.plotPad.gy][S.plotPad.gx].obj = 'plotpad';
  platform(town, 7, 9);
  railXAt(town, 9, 0, 15); // rel kiri-kanan penuh di baris peron
  // jalan: tulang utara-selatan, barat-timur, depan toko
  roadAt(town, [
    ...rng(1, 7).map((gy) => [8, gy]),
    ...rng(0, 8).map((gx) => [gx, 6]),
    ...rng(8, 15).map((gx) => [gx, 6]),
    ...rng(1, 14).map((gx) => [gx, 2]),
  ]);
  put(town, [[3, 3], [9, 6], [12, 8]], 'lantern');
  terrain(town, [[6, 1], [7, 1], [9, 1], [10, 1]], 'clay');
  return town;
}
