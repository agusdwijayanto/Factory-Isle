// v49: Gurun + Pelabuhan, 20x20 — ujung TIMUR-SELATAN pulau 3x3 (Blok 9).
// Desa gurun di timur laut (pasir), pantai + dermaga di selatan (laut),
// pulau palem di teluk tenggara (dicapai dengan berenang), stasiun di
// (8,6) + kereta (9,6), rel masuk dari barat (Blok 8) di baris 6.
// v56: rel tidak lagi masuk dari utara — rel datang dari barat di baris 6
// (samping jalan pantai baris 5), kereta di ujungnya. Sungai masuk dari
// barat di baris 11 (lanjutan Padang Rumput Selatan), turun kolom 18 ke teluk.
function buildHarbor() {
  const harbor = makeGrid(MAP_W, MAP_H);
  // Gurun + desa: pasir di timur laut.
  terrain(harbor, [...rng(9, 17).flatMap((gx) => rng(1, 5).map((gy) => [gx, gy]))], 'sand');
  // Pantai di selatan.
  terrain(harbor, [...rng(0, 12).flatMap((gx) => rng(12, 17).map((gy) => [gx, gy]))], 'sand');
  // Jalan: kolom 8 dari pintu utara + jalan pantai baris 5.
  terrain(harbor, rng(0, 5).map((gy) => [8, gy]), 'road');
  terrain(harbor, rng(0, 17).map((gx) => [gx, 5]), 'road');
  // Rel terminus: masuk dari barat di baris 6 (samping jalan pantai),
  // kereta di ujungnya; palang di selatan kereta.
  railXAt(harbor, 6, 0, 9);
  terrain(harbor, [[9, 7]], 'railStop');
  harbor[6][8].obj = 'station';
  harbor[6][9].obj = 'train';
  harbor[7][9].obj = 'trainCar'; // v52: gerbong 1 petak ke selatan (di palang rel)
  for (const s of SHOP_SPOTS.filter((s) => s.map === 'harbor')) harbor[s.gy][s.gx].obj = 'shop_' + s.id;
  // Laut: tepi selatan + jalur timur + teluk tenggara.
  terrain(harbor, [...rng(0, MAP_W - 1).flatMap((gx) => [[gx, 18], [gx, 19]])], 'water');
  terrain(harbor, rng(0, 17).map((gy) => [MAP_W - 1, gy]), 'water');
  terrain(harbor, [...rng(13, 19).flatMap((gx) => rng(15, 17).map((gy) => [gx, gy]))], 'water');
  // v56: sungai dari Padang Rumput Selatan masuk dari barat di baris 11,
  // turun kolom 18 ke teluk.
  terrain(harbor, rng(0, 18).map((gx) => [gx, 11]), 'water');
  terrain(harbor, rng(0, 14).map((gy) => [18, gy]), 'water');
  // Dermaga menjorok ke laut.
  terrain(harbor, [[7, 17], [8, 17], [7, 18], [8, 18]], 'dock');
  // Pulau palem di teluk: 3 petak rumput, 2 palem, 1 petak mendarat (15,17).
  terrain(harbor, [[15, 16], [16, 16], [15, 17]], 'grass');
  put(harbor, [[15, 16], [16, 16]], 'palm');
  put(harbor, [[10, 8]], 'lantern');
  return harbor;
}
