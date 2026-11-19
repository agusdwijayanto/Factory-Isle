// Pelabuhan 16x12: laut, pantai pasir, dermaga. Pecahan 03-data.js (v16).
// v36: desa gurun di timur (pasir gx 10-14, gy 0-4) + stasiun + kapal
// bajak laut; pulau palem di tenggara (dicapai dengan berenang).
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
  // v36: desa gurun (pasir).
  terrain(harbor, [...rng(10, 14).flatMap((gx) => rng(0, 4).map((gy) => [gx, gy]))], 'sand');
  // v36: pulau palem — 3 petak rumput di laut tenggara, 2 palem, 1 petak
  // kosong untuk mendarat (14,11); air berkurang 42 jadi 39.
  terrain(harbor, [[14, 10], [15, 10], [14, 11]], 'grass');
  put(harbor, [[14, 10], [15, 10]], 'palm');
  roadAt(harbor, [...rng(0, 10).map((gx) => [gx, 6]), [7, 8], [7, 9]]);
  put(harbor, [[9, 5]], 'lantern');
  terrain(harbor, [[2, 9], [4, 9], [6, 9], [10, 9], [12, 9], [13, 9]], 'sand');
  return harbor;
}
