// Hutan 16x12: pohon Oak dan ladang kapas. Pecahan 03-data.js (v16).
function buildForest() {
  const forest = makeGrid(MAP_W, MAP_H);
  put(forest, [[2, 2], [5, 2], [3, 4], [6, 3], [2, 6], [4, 7], [3, 9], [5, 10], [10, 4], [11, 8]], 'tree');
  put(forest, [[11, 2], [12, 2], [13, 2], [11, 3], [12, 3]], 'cotton');
  put(forest, [[10, 7]], 'lantern');
  platform(forest, 7, 9);
  railXAt(forest, 9, 7, 15);
  railYAt(forest, 9, 0, 9); // rel L: timur ke utara
  roadAt(forest, [
    ...rng(0, 6).map((gy) => [8, gy]),
    ...rng(8, 15).map((gx) => [gx, 6]),
    [7, 6], [7, 7],
  ]);
  return forest;
}
