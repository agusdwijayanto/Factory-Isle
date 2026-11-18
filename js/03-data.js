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
  sawhorse:   { name: 'Sawhorse',     desc: 'Potong manual dengan kapak. Berjalan hanya bila karakter di sampingnya.', color: '#a8763e', research: null },
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
    { id: 'conveyorTilt', kind: 'conveyor', name: 'Inclined Conveyor', sub: '$100', color: '#c98f2e' },
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

// Peta awal ditaruh eksplisit supaya selalu sama. Kota: toko, Mayor,
// kotak plot, dan semua sumber daya. Plot: rumput kosong siap dibangun.
function buildMap() {
  S.machines.clear(); S.conveyors.clear(); S.storages.clear();
  S.walls.clear(); S.decor.clear();
  S.expansion = 0; S.autoSeller = false; S.autoSellerT = 0;

  const town = makeGrid(TOWN_W, TOWN_H);
  const put = (list, obj) => list.forEach(([gx, gy]) => {
    town[gy][gx].obj = obj;
    if (NODES[obj]) town[gy][gx].hp = NODES[obj].hp;
  });
  const terrain = (list, t) => list.forEach(([gx, gy]) => { town[gy][gx].t = t; });

  put([[1, 1], [2, 1], [1, 3], [2, 4], [3, 2], [1, 5], [3, 5], [2, 2], [0, 2], [3, 1]], 'tree');
  put([[13, 2], [14, 3], [13, 4], [14, 1], [12, 2]], 'oreIron');
  put([[14, 5], [13, 6], [14, 7]], 'oreCopper');
  put([[11, 8], [12, 10], [14, 10]], 'oreTin');
  put([[10, 1], [11, 1], [11, 2], [12, 1], [10, 2]], 'cotton');
  put([[3, 3], [9, 6], [13, 7]], 'lantern');
  terrain([[12, 8], [13, 8], [13, 9], [14, 9], [12, 9], [14, 8]], 'sand');
  terrain([[1, 8], [2, 8], [2, 9], [3, 9], [1, 9], [0, 8]], 'clay');
  town[S.shop.gy][S.shop.gx].obj = 'shop';
  town[S.mayor.gy][S.mayor.gx].obj = 'mayor';
  town[S.plotPad.gy][S.plotPad.gx].obj = 'plotpad';

  S.maps = {
    town: { w: TOWN_W, h: TOWN_H, grid: town },
    plot: { w: PLOT_BASE_W, h: PLOT_BASE_H, grid: makeGrid(PLOT_BASE_W, PLOT_BASE_H) },
  };
  applyMap('town');
}

// Tutorial: satu sistem per langkah, bisa dilewati.
const TUTORIAL = [
  { text: 'Ketuk pohon. Karakter akan berjalan dan menebang.', done: () => (S.stats.harvested.Log || 0) >= 1 },
  { text: 'Kumpulkan 5 Log.', done: () => (S.stats.harvested.Log || 0) >= 5 },
  { text: 'Jalan ke kotak plot putih untuk masuk ke lahanmu.', done: () => S.map === 'plot' || [...S.machines.values()].length > 0 },
  { text: 'Buka BANGUN, taruh Sawhorse di rumput kosong.', done: () => [...S.machines.values()].some((m) => m.id === 'sawhorse') },
  { text: 'Ketuk Sawhorse, pilih resep, masukkan Log, berdiri di sampingnya.', done: () => (S.stats.crafted.Plank || 0) + (S.stats.crafted.Pillar || 0) >= 1 },
  { text: 'Keluar lewat gerbang, ketuk Toko, jual hasilmu.', done: () => Object.keys(S.stats.sold).length >= 1 },
  { text: 'Riset Carpenter di menu Bangun ($50).', done: () => !!S.unlocked.carpenter },
  { text: 'Bebas: kembangkan pabrikmu. Target: buat 1 Motor.', done: () => (S.stats.crafted.Motor || 0) >= 1 },
];

function recipeText(r) {
  const ins = Object.entries(r.in).map(([id, n]) => n + ' ' + ITEMS[id].name).join(' + ');
  return ins + ' menjadi ' + r.n + ' ' + ITEMS[r.out].name + ' (' + r.secs + ' dtk)';
}
