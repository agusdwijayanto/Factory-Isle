// Bantuan bangun map + rakitan map statis.
// v49: dunia jadi SATU RANTAI 8 map dari utara ke selatan. Tiap map KOTAK
// 20x20 = 400 blok (lahan tetap 16x12 lalu membesar sampai 24x16).
//   ice -> meadow_n -> forest -> forest2 -> plot -> town -> meadow_s -> harbor
// Konvensi: gy=0 tepi UTARA, gy=19 tepi SELATAN. Jalan utama kolom x=8,
// rel kolom x=9 di SEMUA map. Sungai mengalir utara->selatan: kolom 1 di
// ice/meadow_n/forest/forest2/plot, masuk kota lewat jembatan utara lalu
// turun kolom 18 di town/meadow_s/harbor sampai laut. Pintu antar map di
// (8,0)/(8,19) kecuali stasiun-rel terminus di ujung rantai.
const MAP_W = 20, MAP_H = 20;
// Bantuan bangun map, dipakai buildMap dan migrasi simpan lama (12-simpan.js).
const rng = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const put = (g, list, obj) => list.forEach(([gx, gy]) => {
  g[gy][gx].obj = obj;
  if (NODES[obj]) g[gy][gx].hp = NODES[obj].hp;
});
const terrain = (g, list, t) => list.forEach(([gx, gy]) => { g[gy][gx].t = t; });
// Jalan hanya di rumput kosong: jangan tutup resource, toko, atau rel.
const roadAt = (g, list) => list.forEach(([gx, gy]) => {
  const t = g[gy][gx];
  if (t.t === 'grass' && !t.obj) t.t = 'road';
});
const railXAt = (g, gy, x0, x1) => { for (let x = x0; x <= x1; x++) if (g[gy][x].t === 'grass') g[gy][x].t = 'railX'; };
const railYAt = (g, gx, y0, y1) => { for (let y = y0; y <= y1; y++) if (g[y][gx].t === 'grass') g[y][gx].t = 'railY'; };
// v49: peron dihapus total — naik kereta dari bangunan stasiun (07-pemain.js).


// Map statis (7 map zona); lahan dibangun terpisah (03-map-lahan.js).
// Tiap zona dibangun fungsinya sendiri (03-map-*.js); dipanggil di sini
// saat buildMap/loadGame berjalan, sesudah semua script dimuat.
function buildStaticMaps() {
  return {
    ice: { w: MAP_W, h: MAP_H, grid: buildIce() },
    meadow_n: { w: MAP_W, h: MAP_H, grid: buildMeadowN() },
    forest: { w: MAP_W, h: MAP_H, grid: buildForest() },
    forest2: { w: MAP_W, h: MAP_H, grid: buildForest2() },
    meadow_s: { w: MAP_W, h: MAP_H, grid: buildMeadowS() },
    harbor: { w: MAP_W, h: MAP_H, grid: buildHarbor() },
    town: { w: TOWN_W, h: TOWN_H, grid: buildTown() },
  };
}

function buildMap() {
  S.machines.clear(); S.conveyors.clear(); S.storages.clear();
  S.walls.clear(); S.decor.clear();
  S.expansion = 0; S.autoSeller = false; S.autoSellerT = 0;
  const sm = buildStaticMaps();
  const plot = buildPlot();
  S.maps = { ...sm, plot: { w: PLOT_BASE_W, h: PLOT_BASE_H, grid: plot } };
  applyMap('town');
}
