// v49: Padang Rumput, 20x20 — dua varian di rantai (utara & selatan kota).
// Isi sama (rumput, pohon jarang, bunga, sungai di tepi, rel tembus kolom 9,
// jalan utama kolom 8); yang beda cuma sisi sungai: utara di barat (x=1),
// selatan di timur (x=18) supaya air tetap mengalir ke hilir menuju laut.
// v51: varian UTARA membawa petak putih plot di (4,5) = x15,z5 — diinjak
// langsung pindah ke lahan (pengganti petak putih kota).
function buildMeadow(north) {
  const g = makeGrid(MAP_W, MAP_H);
  const riverX = north ? 1 : MAP_W - 2;
  terrain(g, rng(0, MAP_H - 1).map((gy) => [riverX, gy]), 'water');
  const sandX = north ? 2 : MAP_W - 3;
  terrain(g, [[sandX, 4], [sandX, 11], [sandX, 17]], 'sand');
  railYAt(g, 9, 0, MAP_H - 1);
  roadAt(g, rng(0, MAP_H - 1).map((gy) => [8, gy]));
  put(g, [[3, 4], [4, 9], [15, 5], [16, 11], [3, 15], [14, 16], [6, 12], [17, 8]], 'tree');
  put(g, [[5, 3], [12, 4], [7, 9], [13, 13], [4, 17], [11, 17]], 'flowers');
  put(g, [[10, 6], [12, 14]], 'lantern');
  if (north) g[5][4].obj = 'plotpad'; // (4,5) rumput kosong, 3 petak dari sungai, 4 dari jalan, 5 dari rel
  return g;
}
function buildMeadowN() { return buildMeadow(true); }
function buildMeadowS() { return buildMeadow(false); }
