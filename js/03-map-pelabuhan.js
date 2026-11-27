// v49: Gurun + Pelabuhan, 20x20 — ujung TIMUR-SELATAN pulau 3x3 (Blok 9).
// Desa gurun di timur laut (pasir), pantai + dermaga di selatan (laut),
// pulau palem di teluk tenggara (dicapai dengan berenang), stasiun +
// kereta di ujung timur rel baris 9.
// v59 (angka kunci Agus (x,z) Blok 9): jalan x=15 (baris 5, z 1-10, barat
// ke Blok 8); rel x=11 (baris 9, z 1-10); kereta di ujung timur rel
// (lokomotif (11,9) menghadap timur, gerbong di timurnya (11,10)); stasiun
// di utara gerbong (12,10). Toko Pelabuhan pindah ke (4,7) supaya tidak
// menabrak rel baris 9. Sungai masuk dari barat di baris 11 (lanjutan Padang
// Rumput Selatan), turun kolom 18 ke teluk.
function buildHarbor() {
  const harbor = makeGrid(MAP_W, MAP_H);
  // Gurun + desa: pasir di timur laut.
  terrain(harbor, [...rng(9, 17).flatMap((gx) => rng(1, 5).map((gy) => [gx, gy]))], 'sand');
  // Pantai di selatan.
  terrain(harbor, [...rng(0, 12).flatMap((gx) => rng(12, 17).map((gy) => [gx, gy]))], 'sand');
  // Jalan: baris 5 dari pintu barat (Blok 8) ke tengah map.
  terrain(harbor, rng(0, 9).map((gx) => [gx, 5]), 'road');
  // Rel terminus: mendatar baris 9 (barat ke Blok 8).
  railXAt(harbor, 9, 0, 9);
  harbor[8][9].obj = 'station'; // (9,8), utara gerbong
  harbor[9][8].obj = 'train'; // (8,9), lokomotif menghadap timur
  harbor[9][9].obj = 'trainCar'; // (9,9), gerbong di timur lokomotif
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
