// Pelabuhan 16x12: laut, pantai pasir, dermaga. Pecahan 03-data.js (v16).
function buildHarbor() {
  const harbor = makeGrid(MAP_W, MAP_H);
  terrain(harbor, Array.from({ length: 16 }, (_, x) => [x, 10]), 'water');
  terrain(harbor, Array.from({ length: 16 }, (_, x) => [x, 11]), 'water');
  terrain(harbor, [[14, 8], [15, 8], [14, 9], [15, 9]], 'water');
  terrain(harbor, [[7, 10], [8, 10]], 'dock'); // dermaga menjorok ke laut
  for (const s of SHOP_SPOTS.filter((s) => s.map === 'harbor')) harbor[s.gy][s.gx].obj = 'shop_' + s.id;
  platform(harbor, 7, 7);
  railXAt(harbor, 7, 0, 8); // rel barat sampai peron
  terrain(harbor, rng(0, 9).map((gy) => [15, gy]), 'water'); // laut di sisi kanan
  roadAt(harbor, [...rng(0, 5).map((gx) => [gx, 6]), [7, 8], [7, 9]]);
  put(harbor, [[9, 5]], 'lantern');
  terrain(harbor, [[2, 9], [4, 9], [6, 9], [10, 9], [12, 9], [13, 9]], 'sand');
  return harbor;
}
