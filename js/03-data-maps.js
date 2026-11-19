// Bantuan bangun map + rakitan map statis.
// Pecahan 03-data.js (v16).
// Peta awal ditaruh eksplisit supaya selalu sama. Lima map, tiap zona
// map sendiri. Kota: 5 toko, Mayor, jalan masuk lahan, sungai di utara dengan
// jembatan ke gunung, clay di tepian. Hutan: pohon Oak dan ladang kapas.
// Gunung: pegunungan, bijih, hulu sungai. Pelabuhan: laut, pantai pasir,
// dermaga. Plot: rumput kosong siap dibangun.
const MAP_W = 16, MAP_H = 12;
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
// Peron di samping rel (baris py-1); kereta di atas rel (baris py).
const platform = (g, px, py) => {
  terrain(g, [[px - 1, py - 1], [px, py - 1], [px + 1, py - 1]], 'platform');
  g[py][px].obj = 'train';
};


// Map statis (kota, hutan, gunung, pelabuhan); lahan dibangun terpisah.
// Tiap zona dibangun fungsinya sendiri (03-map-*.js); dipanggil di sini
// saat buildMap/loadGame berjalan, sesudah semua script dimuat.
function buildStaticMaps() {
  return {
    town: { w: TOWN_W, h: TOWN_H, grid: buildTown() },
    forest: { w: MAP_W, h: MAP_H, grid: buildForest() },
    mountain: { w: MAP_W, h: MAP_H, grid: buildMountain() },
    harbor: { w: MAP_W, h: MAP_H, grid: buildHarbor() },
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
