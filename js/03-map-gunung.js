// Gunung 16x12: pegunungan, bijih, hulu sungai, rel terminus.
// Pecahan 03-data.js (v16).
function buildMountain() {
  const mountain = makeGrid(MAP_W, MAP_H);
  put(mountain, [[0, 0], [2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0], [1, 1], [15, 1]], 'mountain');
  terrain(mountain, [[1, 2], [1, 3], [1, 4]], 'water'); // hulu sungai
  terrain(mountain, [[2, 3], [2, 4]], 'clay');
  put(mountain, [[10, 2], [12, 3], [11, 4], [13, 2], [10, 5]], 'oreIron');
  put(mountain, [[12, 6], [13, 7], [11, 7]], 'oreCopper');
  put(mountain, [[9, 8], [10, 9], [12, 9]], 'oreTin');
  put(mountain, [[9, 6]], 'lantern');
  // Peron mengapit rel: rel dari bawah berhenti di peron (terminus),
  // tidak tembus ke atas — tidak ada map di utara gunung. Kereta di (7,9).
  terrain(mountain, [[6, 8], [8, 8]], 'platform');
  mountain[9][7].obj = 'train';
  railYAt(mountain, 7, 8, 11);
  mountain[8][7].t = 'railStop'; // palang penahan di ujung rel paling atas
  roadAt(mountain, [
    ...rng(4, 12).map((gx) => [gx, 10]),
    ...rng(5, 7).map((gy) => [6, gy]),
    [6, 9], [6, 10],
  ]);
  return mountain;
}
