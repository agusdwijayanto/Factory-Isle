// v49: Gunung Es + Tambang, 20x20 — map PALING UTARA rantai (rel terminus).
// Salju, sungai/danau beku di barat (nyambung ke sungai Lahan Ijo di selatan),
// tebing batu di utara, tambang bijih di timur, stasiun di (8,7) + kereta (9,7).
function buildIce() {
  const ice = makeGrid(MAP_W, MAP_H);
  for (let gy = 0; gy < MAP_H; gy++) for (let gx = 0; gx < MAP_W; gx++) ice[gy][gx].t = 'snow';
  // Hulu sungai beku memanjang ke selatan + danau es.
  terrain(ice, rng(2, MAP_H - 1).map((gy) => [1, gy]), 'ice');
  terrain(ice, [...rng(2, 3).flatMap((gx) => rng(4, 8).map((gy) => [gx, gy]))], 'ice');
  terrain(ice, [[2, 12], [3, 12]], 'clay'); // tepian liat
  // Tebing batu di utara (rintangan, bukan bijih).
  put(ice, [[0, 0], [2, 0], [4, 0], [6, 0], [10, 0], [12, 0], [14, 0], [16, 0], [18, 0], [3, 1], [15, 1]], 'mountain');
  put(ice, [[12, 3], [13, 4], [11, 5]], 'oreIron');
  put(ice, [[15, 6], [16, 7], [15, 8]], 'oreCopper');
  put(ice, [[12, 10], [13, 11], [12, 12]], 'oreTin');
  put(ice, [[16, 3], [16, 4]], 'goldOre');
  put(ice, [[17, 10], [18, 11], [16, 12], [17, 12]], 'stone');
  put(ice, [[3, 4], [4, 7], [3, 10], [5, 15], [3, 17], [15, 14], [14, 17], [16, 16], [4, 18]], 'treePine');
  // Rel terminus: datang dari selatan, berhenti di palang (9,6).
  terrain(ice, rng(7, MAP_H - 1).map((gy) => [9, gy]), 'railY');
  terrain(ice, [[9, 6]], 'railStop');
  ice[7][8].obj = 'station';
  ice[7][9].obj = 'train';
  put(ice, [[7, 7]], 'lantern');
  // Jalan: kolom 8 dari stasiun sampai tepi selatan (pintu ke Lahan Ijo).
  terrain(ice, rng(8, MAP_H - 1).map((gy) => [8, gy]), 'road');
  return ice;
}
