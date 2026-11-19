// Semua data game. Angka Research, harga jual, resep, dan waktu crafting
// mengikuti PRD; yang tidak disebut PRD mengikuti laporan riset wiki
// (Fandom lama / NamuWiki) dan ditandai asalnya di komentar.

// Item: id -> {name, color, price}. price null = tidak bisa dijual (PRD:
// Coil dan Gear hanya komponen). Harga jual = harga PAPAN jual dari
// screenshot Roblox Agus (keputusan Agus 22:25, bukan harga panel yang
// kemungkinan sudah dikali 2 gamepass). Yang tidak teramati di papan
// ditandai "turunan" dan nilainya dipertahankan dari versi lama.
const ITEMS = {
  Log:       { name: 'Log',        color: '#a8763e', price: 7 },   // papan
  Pillar:    { name: 'Pillar',     color: '#8a5a33', price: 12 },  // papan
  Plank:     { name: 'Plank',      color: '#c9a86a', price: 6 },   // papan
  Firelog:   { name: 'Firelog',    color: '#e07b39', price: 11 },  // papan
  Brick:     { name: 'Brick',      color: '#b06040', price: 30 },  // turunan
  Glass:     { name: 'Glass',      color: '#9fd4e8', price: 15 },  // turunan
  IronOre:   { name: 'Iron Ore',   color: '#e07b39', price: 8 },   // turunan
  CopperOre: { name: 'Copper Ore', color: '#4fae9d', price: 6 },   // turunan
  TinOre:    { name: 'Tin Ore',    color: '#b8c4cc', price: 10 },  // turunan
  Sand:      { name: 'Sand',       color: '#e8d9a0', price: 4 },   // turunan
  Clay:      { name: 'Clay',       color: '#a5613f', price: 5 },   // turunan
  Cotton:    { name: 'Cotton',     color: '#f2ede0', price: 25 },  // papan
  IronIngot:   { name: 'Iron Ingot',   color: '#8d99a8', price: 24 }, // papan
  CopperIngot: { name: 'Copper Ingot', color: '#e08a5a', price: 18 }, // turunan
  BronzeIngot: { name: 'Bronze Ingot', color: '#c98f2e', price: 50 }, // turunan
  Coil:      { name: 'Coil',       color: '#d97b4f', price: null },
  Gear:      { name: 'Gear',       color: '#c9a86a', price: null },
  IronBeam:  { name: 'Iron Beam',  color: '#7d8894', price: 92 },  // papan
  IronFrame: { name: 'Iron Frame', color: '#6e7683', price: 82 },  // turunan
  Nails:     { name: 'Nails',      color: '#b8b0a0', price: 25 },  // turunan
  Motor:     { name: 'Motor',      color: '#e8b64c', price: 225 }, // PRD: 200-250, turunan
  WoodFrame: { name: 'Wood Frame', color: '#d9b06a', price: 47 },  // papan
  Table:     { name: 'Table',      color: '#a8763e', price: 73 },  // papan (wood table)
  Bench:     { name: 'Bench',      color: '#8a5a33', price: 70 },  // papan (wood bench)
  Window:    { name: 'Window',     color: '#9fd4e8', price: 84 },  // papan
};

// Nama map untuk HUD.
const MAP_NAMES = { town: 'Kota', plot: 'Lahan', forest: 'Hutan', mountain: 'Gunung', harbor: 'Pelabuhan' };

// Toko v2. sell = harga toko membeli dari pemain; buy = harga toko menjual
// ke pemain. Harga ikut riset wiki 4.2; yang tidak ada di riset memakai
// harga papan (ITEMS.price). Exchange membeli semua barang lain dengan
// harga papan supaya loop jual v1 tetap utuh. Pelabuhan: harga premium =
// yang terbesar antara harga riset gurun/kapal dan harga papan x1,2.
const HARBOR_RESEARCH = { WoodFrame: 32, Log: 8, Firelog: 12 };
function harborSellTable() {
  const t = {};
  for (const [id, it] of Object.entries(ITEMS)) {
    if (it.price === null || it.price === undefined) continue;
    t[id] = Math.max(HARBOR_RESEARCH[id] || 0, Math.ceil(it.price * 1.2));
  }
  return t;
}
const SHOPS = {
  carpenter:  { name: 'Carpenter',  sell: { Log: 7, Pillar: 12, Plank: 6, WoodFrame: 28 }, buy: {} },
  blacksmith: { name: 'Blacksmith', sell: { Firelog: 6, IronIngot: 24 }, buy: { Nails: 25 } },
  toolshop:   { name: 'Tool Shop',  sell: { IronBeam: 72 }, buy: {} },
  textile:    { name: 'Textile',    sell: { Cotton: 25 }, buy: { Cotton: 25 } },
  exchange:   { name: 'Exchange',   sell: 'ALL', buy: { Log: 12, Pillar: 20, Plank: 10, Brick: 30, WoodFrame: 48, IronFrame: 83, IronBeam: 125, Coil: 38 } },
  harbor:     { name: 'Pelabuhan',  sell: harborSellTable(), buy: {} },
};
// Posisi toko: obj di grid = 'shop_' + id.
const SHOP_SPOTS = [
  { map: 'town', gx: 2, gy: 1, id: 'carpenter' },
  { map: 'town', gx: 11, gy: 3, id: 'blacksmith' }, // bukan di (8,1): petak itu jalan menuju jembatan
  { map: 'town', gx: 11, gy: 1, id: 'toolshop' },
  { map: 'town', gx: 14, gy: 1, id: 'textile' },
  { map: 'town', gx: 14, gy: 3, id: 'exchange' },
  { map: 'harbor', gx: 8, gy: 3, id: 'harbor' },
];

// Pintu keluar antar map: injak petak (gx,gy) pindah ke map `to`, lahir di
// petak (sx,sy) map tujuan. Mekanisme TP yang sama seperti kotak plot dan
// gerbang v12.
const MAP_EXITS = {
  town: [
    { gx: 8, gy: 0, to: 'mountain', sx: 12, sy: 10 }, // jembatan ke gunung
    { gx: 0, gy: 6, to: 'forest', sx: 14, sy: 6 },
    { gx: 15, gy: 6, to: 'harbor', sx: 1, sy: 6 },
  ],
  forest: [
    { gx: 8, gy: 0, to: 'mountain', sx: 4, sy: 10 },
    { gx: 15, gy: 6, to: 'town', sx: 1, sy: 6 },
  ],
  mountain: [
    { gx: 4, gy: 11, to: 'forest', sx: 8, sy: 1 },
    { gx: 12, gy: 11, to: 'town', sx: 8, sy: 2 },
  ],
  harbor: [
    { gx: 0, gy: 6, to: 'town', sx: 14, sy: 6 },
  ],
};
// Peron kereta tiap map: [gx, gy] petak tengah peron, titik lahir naik kereta.
const TRAIN_SPAWN = { town: [7, 8], forest: [7, 8], mountain: [6, 8], harbor: [7, 6] };

// Dua map. Kota tetap 16x12; plot mulai 16x12 lalu membesar tiap ekspansi
// (ukuran dasar sama dengan grid v1 supaya simpan lama termigrasi utuh).
const TOWN_W = 16, TOWN_H = 12;
const PLOT_BASE_W = 16, PLOT_BASE_H = 12;
// Rantai ekspansi Mayor: struktur dan harga ikut game asli.
const EXPANSIONS = [
  { name: 'Size',   cost: 200,  w: 18, h: 13 },
  { name: 'Size+',  cost: 400,  w: 20, h: 14 },
  { name: 'Size++', cost: 800,  w: 22, h: 15 },
  { name: 'Size+++', cost: 2000, w: 24, h: 16 },
];
// Harga asli Auto Seller 175.000 terlalu jauh dari ekonomi harga papan;
// 5.000 = keputusan turunan (target akhir yang terjangkau sesudah pabrik jalan).
const AUTO_SELLER_COST = 5000;
const AUTO_SELLER_EVERY = 5; // detik antar penjualan otomatis

// Resep per mesin. in/out jumlah item, secs waktu crafting (Fandom lama).
// Sawhorse: 1 kayu = 3 plank (NamuWiki, Advanced Saw); Pillar 2 turunan.
const RECIPES = {
  sawhorse: [
    { id: 'plank',  out: 'Plank',  n: 3, in: { Log: 1 }, secs: 6 },
    { id: 'pillar', out: 'Pillar', n: 2, in: { Log: 1 }, secs: 6 },
  ],
  splitter: [
    { id: 'firelog', out: 'Firelog', n: 6, in: { Log: 1 }, secs: 7 },
  ],
  carpenter: [
    { id: 'woodframe', out: 'WoodFrame', n: 1, in: { Plank: 4, Nails: 4 }, secs: 20 },
    { id: 'table', out: 'Table', n: 1, in: { WoodFrame: 1, Pillar: 1 }, secs: 25 },
    { id: 'bench', out: 'Bench', n: 1, in: { WoodFrame: 1, Pillar: 1 }, secs: 20 },
    { id: 'window', out: 'Window', n: 1, in: { WoodFrame: 1, Glass: 1 }, secs: 25 },
  ],
  oven: [
    { id: 'brick', out: 'Brick', n: 10, in: { Firelog: 3, Clay: 2 }, secs: 15 },
    { id: 'glass', out: 'Glass', n: 1, in: { Firelog: 3, Sand: 2 }, secs: 15 },
  ],
  smelter: [
    { id: 'iron',   out: 'IronIngot',   n: 1, in: { Firelog: 3, IronOre: 2 }, secs: 35 },
    { id: 'copper', out: 'CopperIngot', n: 1, in: { Firelog: 2, CopperOre: 1 }, secs: 15 },
    { id: 'bronze', out: 'BronzeIngot', n: 1, in: { Firelog: 2, CopperOre: 4, TinOre: 1 }, secs: 20 },
    { id: 'glass',  out: 'Glass', n: 1, in: { Firelog: 2, Sand: 2 }, secs: 15 },
    { id: 'brick',  out: 'Brick', n: 10, in: { Firelog: 2, Clay: 2 }, secs: 15 },
  ],
  blacksmith: [
    { id: 'coil',  out: 'Coil',  n: 1, in: { CopperIngot: 1 }, secs: 20 },
    { id: 'beam',  out: 'IronBeam',  n: 1, in: { IronIngot: 1 }, secs: 20 },
    { id: 'frame', out: 'IronFrame', n: 1, in: { IronIngot: 2 }, secs: 30 },
    { id: 'gear',  out: 'Gear',  n: 1, in: { BronzeIngot: 1 }, secs: 25 },
    { id: 'nails', out: 'Nails', n: 10, in: { IronIngot: 1 }, secs: 20 }, // 10: NamuWiki
    { id: 'motor', out: 'Motor', n: 1, in: { Coil: 1, IronFrame: 1, Gear: 1 }, secs: 50 },
  ],
};

const MACHINES = {
  sawhorse:   { name: 'Sawhorse',     desc: 'Potong kayu jadi Plank dan Pillar, jalan otomatis seperti mesin lain.', color: '#a8763e', research: null },
  splitter:   { name: 'Log Splitter', desc: 'Membelah log menjadi bahan bakar peleburan.', color: '#7a5230', research: null },
  carpenter:  { name: 'Carpenter',    desc: 'Crafting otomatis produk kayu dan furnitur.', color: '#c9a86a', research: { money: 50 } },
  oven:       { name: 'Oven',         desc: 'Tungku awal untuk bata dan kaca.', color: '#b06040', research: { money: 100 } },
  smelter:    { name: 'Smelter',      desc: 'Peleburan semua ingot dengan bahan bakar Firelog.', color: '#96553c', research: { money: 500, items: { Brick: 30 } } },
  blacksmith: { name: 'Blacksmith',   desc: 'Crafting otomatis komponen logam.', color: '#8d99a8', research: { money: 1000 } },
};

// Biaya taruh bangunan. Mesin gratis sesudah riset; conveyor $100 (NamuWiki).
// Sisanya keputusan game, ditulis di sini supaya satu tempat.
const BUILD_COST = {
  conveyor: 100, conveyorTilt: 100,
  box: 20, container: 60, rack: 150,
  wallWood: 10, wallIron: 30, lantern: 15, flowers: 5,
};
const STORAGE_CAP = { box: 50, container: 200, rack: 500 };

const CATEGORIES = [
  { id: 'conveyors', name: 'Conveyors', items: [
    { id: 'conveyor', kind: 'conveyor', name: 'Conveyor', sub: '$100', color: '#e8b64c' },
  ] },
  { id: 'machines', name: 'Machines', items: [
    { id: 'sawhorse', kind: 'machine', name: 'Sawhorse', sub: 'Gratis', color: '#a8763e' },
    { id: 'splitter', kind: 'machine', name: 'Log Splitter', sub: 'Gratis', color: '#7a5230' },
    { id: 'carpenter', kind: 'machine', name: 'Carpenter', sub: 'Research $50', color: '#c9a86a' },
    { id: 'oven', kind: 'machine', name: 'Oven', sub: 'Research $100', color: '#b06040' },
    { id: 'smelter', kind: 'machine', name: 'Smelter', sub: '$500 + 30 Brick', color: '#96553c' },
    { id: 'blacksmith', kind: 'machine', name: 'Blacksmith', sub: 'Research $1.000', color: '#8d99a8' },
  ] },
  { id: 'storages', name: 'Storages', items: [
    { id: 'box', kind: 'storage', name: 'Wooden Box', sub: '$20, 50 slot', color: '#8a5a33' },
    { id: 'container', kind: 'storage', name: 'Container', sub: '$60, 200 slot', color: '#4f7a94' },
    { id: 'rack', kind: 'storage', name: 'Storage Rack', sub: '$150, 500 slot', color: '#6e6a72' },
  ] },
  { id: 'decorations', name: 'Decorations', items: [
    { id: 'lantern', kind: 'decor', name: 'Lantern', sub: '$15', color: '#ffd75e' },
    { id: 'flowers', kind: 'decor', name: 'Flowers', sub: '$5', color: '#d97ba8' },
  ] },
  { id: 'structures', name: 'Structures', items: [
    { id: 'wallWood', kind: 'wall', name: 'Wood Wall', sub: '$10', color: '#7a5230' },
    { id: 'wallIron', kind: 'wall', name: 'Iron Wall', sub: '$30', color: '#5d6773' },
  ] },
];

// Perkakas: node apa ditebang dengan apa, berapa ayunan, hasil per ayunan.
const TOOLS = {
  axe: { name: 'Kapak', sprite: 'axe' },
  pickaxe: { name: 'Pickaxe', sprite: 'pickaxe' },
  shovel: { name: 'Sekop', sprite: 'shovel' },
};
const NODES = {
  tree:      { tool: 'axe',     swings: 3, item: 'Log',       regrow: 45, hp: 3 },
  oreIron:   { tool: 'pickaxe', swings: 3, item: 'IronOre',   regrow: 60, hp: 3 },
  oreCopper: { tool: 'pickaxe', swings: 3, item: 'CopperOre', regrow: 60, hp: 3 },
  oreTin:    { tool: 'pickaxe', swings: 3, item: 'TinOre',    regrow: 60, hp: 3 },
  cotton:    { tool: 'axe',     swings: 2, item: 'Cotton',    regrow: 45, hp: 2 },
  sand:      { tool: 'shovel',  swings: 1, item: 'Sand',      regrow: 0,  hp: 0 },
  clay:      { tool: 'shovel',  swings: 1, item: 'Clay',      regrow: 0,  hp: 0 },
};
const HARVEST_TEXT = { // teks melayang panen, kunci = obj atau terrain
  tree: '+1 Log', oreIron: '+1 Iron Ore', oreCopper: '+1 Copper Ore',
  oreTin: '+1 Tin Ore', sand: '+1 Sand', clay: '+1 Clay', cotton: '+1 Cotton',
};

// Peta awal ditaruh eksplisit supaya selalu sama. Lima map, tiap zona
// map sendiri. Kota: 5 toko, Mayor, kotak plot, sungai di utara dengan
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
function buildStaticMaps() {

  // ---- Kota 16x12 ----
  const town = makeGrid(TOWN_W, TOWN_H);
  terrain(town, Array.from({ length: 16 }, (_, x) => [x, 0]), 'water');
  town[0][8].t = 'bridge'; // jembatan: satu-satunya jalan ke utara
  for (const s of SHOP_SPOTS.filter((s) => s.map === 'town')) town[s.gy][s.gx].obj = 'shop_' + s.id;
  town[S.mayor.gy][S.mayor.gx].obj = 'mayor';
  town[S.plotPad.gy][S.plotPad.gx].obj = 'plotpad';
  platform(town, 7, 9);
  railXAt(town, 9, 0, 15); // rel kiri-kanan penuh di baris peron
  // jalan: tulang utara-selatan, barat-timur, depan toko
  roadAt(town, [
    ...rng(1, 7).map((gy) => [8, gy]),
    ...rng(0, 8).map((gx) => [gx, 6]),
    ...rng(8, 15).map((gx) => [gx, 6]),
    ...rng(2, 14).map((gx) => [gx, 2]),
  ]);
  put(town, [[3, 3], [9, 6], [12, 8]], 'lantern');
  terrain(town, [[6, 1], [7, 1], [9, 1], [10, 1]], 'clay');

  // ---- Hutan 16x12 ----
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

  // ---- Gunung 16x12 ----
  const mountain = makeGrid(MAP_W, MAP_H);
  put(mountain, [[0, 0], [2, 0], [4, 0], [6, 0], [8, 0], [10, 0], [12, 0], [14, 0], [1, 1], [15, 1]], 'mountain');
  terrain(mountain, [[1, 2], [1, 3], [1, 4]], 'water'); // hulu sungai
  terrain(mountain, [[2, 3], [2, 4]], 'clay');
  put(mountain, [[10, 2], [12, 3], [11, 4], [13, 2], [10, 5]], 'oreIron');
  put(mountain, [[12, 6], [13, 7], [11, 7]], 'oreCopper');
  put(mountain, [[9, 8], [10, 9], [12, 9]], 'oreTin');
  put(mountain, [[9, 6]], 'lantern');
  // Peron mengapit rel: rel penuh atas-bawah di x=7, kereta di (7,9).
  terrain(mountain, [[6, 8], [8, 8]], 'platform');
  mountain[9][7].obj = 'train';
  railYAt(mountain, 7, 0, 11);
  roadAt(mountain, [
    ...rng(4, 12).map((gx) => [gx, 10]),
    ...rng(5, 7).map((gy) => [6, gy]),
    [6, 9], [6, 10],
  ]);

  // ---- Pelabuhan 16x12 ----
  const harbor = makeGrid(MAP_W, MAP_H);
  terrain(harbor, Array.from({ length: 16 }, (_, x) => [x, 10]), 'water');
  terrain(harbor, Array.from({ length: 16 }, (_, x) => [x, 11]), 'water');
  terrain(harbor, [[14, 8], [15, 8], [14, 9], [15, 9]], 'water');
  terrain(harbor, [[7, 10], [8, 10]], 'dock'); // dermaga menjorok ke laut
  for (const s of SHOP_SPOTS.filter((s) => s.map === 'harbor')) harbor[s.gy][s.gx].obj = 'shop_' + s.id;
  platform(harbor, 7, 7);
  railXAt(harbor, 7, 0, 8); // rel barat sampai peron
  terrain(harbor, rng(0, 9).map((gy) => [15, gy]), 'water'); // laut di sisi kanan
  roadAt(harbor, [...rng(0, 5).map((gx) => [gx, 6]), [7, 8], [7, 9]]);
  put(harbor, [[9, 5]], 'lantern');
  terrain(harbor, [[2, 9], [4, 9], [6, 9], [10, 9], [12, 9], [13, 9]], 'sand');

  return {
    town: { w: TOWN_W, h: TOWN_H, grid: town },
    forest: { w: MAP_W, h: MAP_H, grid: forest },
    mountain: { w: MAP_W, h: MAP_H, grid: mountain },
    harbor: { w: MAP_W, h: MAP_H, grid: harbor },
  };
}

function buildMap() {
  S.machines.clear(); S.conveyors.clear(); S.storages.clear();
  S.walls.clear(); S.decor.clear();
  S.expansion = 0; S.autoSeller = false; S.autoSellerT = 0;
  const sm = buildStaticMaps();
  const plot = makeGrid(PLOT_BASE_W, PLOT_BASE_H);
  roadAt(plot, [[8, 7], [8, 8], [8, 9], [8, 10]]); // jalan pendek gerbang ke tengah
  S.maps = { ...sm, plot: { w: PLOT_BASE_W, h: PLOT_BASE_H, grid: plot } };
  applyMap('town');
}

// Tutorial: satu sistem per langkah, bisa dilewati.
const TUTORIAL = [
  { text: 'Jalan ke ujung barat kota untuk masuk ke Hutan, ketuk pohon.', done: () => (S.stats.harvested.Log || 0) >= 1 },
  { text: 'Kumpulkan 5 Log.', done: () => (S.stats.harvested.Log || 0) >= 5 },
  { text: 'Jalan ke kotak plot putih untuk masuk ke lahanmu.', done: () => S.map === 'plot' || [...S.machines.values()].length > 0 },
  { text: 'Buka BANGUN, taruh Sawhorse di rumput kosong.', done: () => [...S.machines.values()].some((m) => m.id === 'sawhorse') },
  { text: 'Ketuk Sawhorse, pilih resep, masukkan Log.', done: () => (S.stats.crafted.Plank || 0) + (S.stats.crafted.Pillar || 0) >= 1 },
  { text: 'Keluar lewat gerbang, ketuk Toko, jual hasilmu.', done: () => Object.keys(S.stats.sold).length >= 1 },
  { text: 'Riset Carpenter di menu Bangun ($50).', done: () => !!S.unlocked.carpenter },
  { text: 'Bebas: kembangkan pabrikmu. Target: buat 1 Motor.', done: () => (S.stats.crafted.Motor || 0) >= 1 },
];

function recipeText(r) {
  const ins = Object.entries(r.in).map(([id, n]) => n + ' ' + ITEMS[id].name).join(' + ');
  return ins + ' menjadi ' + r.n + ' ' + ITEMS[r.out].name + ' (' + r.secs + ' dtk)';
}
