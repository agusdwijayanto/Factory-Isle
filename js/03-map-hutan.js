// Hutan 16x12: pohon Oak dan ladang kapas. Pecahan 03-data.js (v16).
function buildForest() {
  const forest = makeGrid(MAP_W, MAP_H);
  put(forest, [[2, 2], [5, 2], [3, 4], [6, 3], [2, 6], [4, 7], [3, 9], [5, 10], [10, 4], [11, 8]], 'tree');
  put(forest, [[11, 2], [12, 2], [13, 2], [11, 3], [12, 3]], 'cotton');
  // v36: tanaman pewarna liar (rantai Dye Can) + papan jual di samping peron.
  put(forest, [[12, 5], [13, 5], [14, 5]], 'dyeplant');
  forest[8][13].obj = 'sign';
  put(forest, [[10, 7]], 'lantern');
  // v35: pasir di tepian sungai utara (digali pakai sekop).
  terrain(forest, [[1, 1], [15, 1]], 'sand');
  // Sungai di tepi utara: air dulu, baru jembatan dan rel menimpa air.
  terrain(forest, rng(1, 15).map((gx) => [gx, 0]), 'water');
  terrain(forest, [[8, 0]], 'bridge'); // jembatan ke gunung, satu-satunya jalan menyeberang
  terrain(forest, [[9, 0]], 'railY'); // rel utara tetap nyambung di atas air
  railXAt(forest, 9, 9, 15);
  railYAt(forest, 9, 0, 9); // rel L: timur ke utara
  terrain(forest, [[9, 9]], 'railBend'); // tikungan L di pertemuan rel
  terrain(forest, [[14, 8]], 'platform'); // peron baru 1 kotak (x=4,z=15)
  forest[9][14].obj = 'train'; // kereta di rel depan peron (x=3,z=15)
  roadAt(forest, [
    ...rng(0, 6).map((gy) => [8, gy]),
    ...rng(8, 15).map((gx) => [gx, 6]),
    [14, 7], // jalan di belakang peron baru (x=5,z=15)
  ]);
  return forest;
}
