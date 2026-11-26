// v49: Gurun + Pelabuhan, 20x20 — ujung TIMUR-SELATAN pulau 3x3 (Blok 9).
// Desa gurun di timur laut (pasir), pantai + dermaga di selatan (laut),
// pulau palem di teluk tenggara (dicapai dengan berenang), stasiun +
// kereta di ujung timur rel baris 6.
// v57 (rombak total ikut gambar tangan Agus): rel mendatar baris 6 penuh
// (barat ke Blok 8 sampai tepi timur); kereta di ujung timur (lokomotif
// (17,6) menghadap timur, gerbong di baratnya (16,6)); stasiun di utara
// lokomotif (17,5, tepi kanan atas sesuai gambar). Jalan pantai pindah ke
// baris 12 (barat ke Blok 8, dari jalan bawah Blok 7-8); toko Pelabuhan
// pindah ke (4,9) supaya tidak menabrak sungai baris 11. Sungai masuk dari
// barat di baris 11 (lanjutan Padang Rumput Selatan), turun kolom 18 ke teluk.
function buildHarbor() {
  const harbor = makeGrid(MAP_W, MAP_H);
  // Gurun + desa: pasir di timur laut.
  terrain(harbor, [...rng(9, 17).flatMap((gx) => rng(1, 5).map((gy) => [gx, gy]))], 'sand');
  // Pantai di selatan.
  terrain(harbor, [...rng(0, 12).flatMap((gx) => rng(12, 17).map((gy) => [gx, gy]))], 'sand');
  // Jalan: baris 12 dari pintu barat (Blok 8) ke tengah map.
  terrain(harbor, rng(0, 10).map((gx) => [gx, 12]), 'road');
  // Rel terminus: mendatar baris 6 penuh (barat ke Blok 8 sampai tepi
  // timur); palang di timur lokomotif, di atas sungai kolom 18.
  railXAt(harbor, 6, 0, 19);
  terrain(harbor, [[18, 6]], 'railStop'); // palang di timur lokomotif, di atas sungai kolom 18
  harbor[5][17].obj = 'station'; // (17,5), utara lokomotif
  harbor[6][17].obj = 'train'; // (17,6), lokomotif menghadap timur
  harbor[6][16].obj = 'trainCar'; // (16,6), gerbong di barat lokomotif
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
