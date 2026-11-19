// Data game: barang, toko, resep, mesin, node panen.
// Pecahan 03-data.js (v16); angka dan harga tidak diubah.
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
  // v29: rantai tekstil + meriam. Harga jual ikut riset 4.2 (toko Textile
  // beli / kapal bajak laut); Wheel/Mold/Barrel komponen saja (price null,
  // seperti Coil/Gear). Cannon 1.500 = riset 4.2 ("Cannon s.d. 1.500"),
  // tetap item jual termahal (berikutnya Motor 225).
  Textiles:     { name: 'Textiles',      color: '#f2ede0', price: 35 },  // riset 4.2
  DyedTextiles: { name: 'Dyed Textiles', color: '#e07b9d', price: 16 },  // v30: papan 16 (bukan 55 harga kapal bajak laut di riset) supaya beli 24 di toko Textile tidak bisa dijual untung di Exchange/pelabuhan
  DyeCan:       { name: 'Dye Can',       color: '#4fae9d', price: 16 },  // riset 4.2
  Wheel:        { name: 'Wheel',         color: '#8d99a8', price: null },
  CannonMold:   { name: 'Cannon Casting Mold', color: '#e8d9a0', price: null },
  CannonBarrel: { name: 'Cannon Barrel', color: '#3a3f47', price: null },
  BronzeCannon: { name: 'Bronze Cannon', color: '#c98f2e', price: 1500 }, // riset 4.2
  Bed:          { name: 'Bed',           color: '#a8763e', price: 109 }, // riset 4.2 (kapal bajak laut)
  Piano:        { name: 'Piano',         color: '#2c2833', price: 360 }, // riset 4.2 (kapal 360; NamuWiki 350-400)
  // v35: komponen Toko Perkakas (wiki Tools Shop): dijual toko ke pemain
  // 192/141, harga papan di bawahnya supaya tidak ada arbitrase (aturan v30).
  Engine:       { name: 'Engine',        color: '#7d8894', price: 150 }, // turunan, di bawah harga toko 192
  DrillHead:    { name: 'Drill Head',    color: '#c98f2e', price: 110 }, // turunan, di bawah harga toko 141
  // v36: rantai emas (GoldOre dari Gunung, olah di Smelter) — harga Ingot
  // $120 / Plate $300 TURUNAN (NamuWiki dicek 2026-11-19, tidak ada harga
  // emas); Stone untuk Drill Head + Grinding Wheel; rantai pewarna;
  // Rack/Barrel/RackAdv bahan Storage Rack Advanced (price null seperti
  // Coil/Gear, tidak bisa dijual — tidak bisa dijadiin lubang arbitrase).
  GoldOre:      { name: 'Gold Ore',   color: '#ffd75e', price: 40 },  // turunan
  GoldIngot:    { name: 'Gold Ingot', color: '#ffd75e', price: 120 }, // turunan
  GoldPlate:    { name: 'Gold Plate', color: '#ffd75e', price: 300 }, // turunan
  Stone:        { name: 'Stone',      color: '#9aa3ad', price: 5 },   // turunan
  DyeFlower:    { name: 'Dye Flower', color: '#e07b9d', price: 6 },   // turunan
  Dye:          { name: 'Dye',        color: '#4fae9d', price: 8 },   // turunan
  TinCan:       { name: 'Tin Can',    color: '#b8c4cc', price: 12 },  // turunan
  GrindingWheel:{ name: 'Grinding Wheel', color: '#9aa3ad', price: null },
  Rack:         { name: 'Storage Rack',    color: '#8d99a8', price: null },
  Barrel:       { name: 'Storage Barrel',  color: '#7a5230', price: null },
  RackAdv:      { name: 'Storage Rack Advanced', color: '#6e6a72', price: null },
  SeedOak:      { name: 'Seed Oak',        color: '#4fae6b', price: 2 },  // turunan
  SeedPine:     { name: 'Seed Pine',       color: '#2e6b3e', price: 2 },  // turunan
  SeedPalm:     { name: 'Seed Palm',       color: '#e8b64c', price: 2 },  // turunan
  SeedCotton:   { name: 'Seed Cotton',     color: '#f2ede0', price: 2 },  // turunan
  SeedDye:      { name: 'Seed Dye Flower', color: '#e07b9d', price: 2 },  // turunan
};

// Nama map untuk HUD.
const MAP_NAMES = { town: 'Kota', plot: 'Lahan', forest: 'Hutan', mountain: 'Gunung', harbor: 'Pelabuhan' };

// Toko v2. sell = harga toko membeli dari pemain; buy = harga toko menjual
// ke pemain. Harga ikut riset wiki 4.2; yang tidak ada di riset memakai
// harga papan (ITEMS.price). Exchange membeli semua barang lain dengan
// harga papan supaya loop jual v1 tetap utuh. Pelabuhan: harga premium =
// yang terbesar antara harga riset gurun/kapal dan harga papan x1,2.
// v30: harga toko menjual ke pemain (buy) selalu di atas harga tertinggi
// toko membeli (sell, termasuk premi pelabuhan) supaya tidak ada arbitrase
// beli di satu tempat lalu jual untung di tempat lain tanpa produksi.
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
  blacksmith: { name: 'Blacksmith', sell: { Firelog: 6, IronIngot: 24 }, buy: { Nails: 31, GrindingWheel: 50 } }, // v30: 31 di atas premi pelabuhan 30; v36: Grinding Wheel 50 (NamuWiki, tanpa resep — resep turunan di bawah)
  toolshop:   { name: 'Tool Shop',  sell: { IronBeam: 72 }, buy: { IronBeam: 150, Engine: 192, DrillHead: 141 } }, // v35: jual Iron Beam/Engine/Drill Head (wiki Tools Shop: 103/192/141); Iron Beam 150 di atas beli Exchange 125 supaya tidak ada arbitrase (aturan v30)
  textile:    { name: 'Textile',    sell: { Cotton: 25, Textiles: 35, DyeCan: 16, DyedTextiles: 16 }, buy: { Cotton: 31, Textiles: 50, DyeCan: 24, DyedTextiles: 24 } }, // v30: beli Dyed 55->16 (tutup arbitrase); Cotton 25->31 di atas premi pelabuhan 30
  exchange:   { name: 'Exchange',   sell: 'ALL', buy: { Log: 12, Pillar: 20, Plank: 10, Brick: 37, WoodFrame: 58, IronFrame: 100, IronBeam: 125, Coil: 38, Rack: 150, Barrel: 40 } }, // v30: Brick 37, WoodFrame 58, IronFrame 100, di atas premi pelabuhan (36/57/99); v36: jual Rack/Barrel bahan Storage Rack Advanced
  harbor:     { name: 'Pelabuhan',  sell: harborSellTable(), buy: {} },
  // v36: toko SUPPLY di sebelah rel kota — toko uang biasa seperti toko
  // lain (keputusan Agus): jual/beli bahan dasar harga papan. Harga beli
  // (toko menjual ke pemain) di atas harga jual tertinggi tiap barang
  // (aturan v30: tidak boleh ada arbitrase).
  supply:     { name: 'SUPPLY',     sell: { Log: 7, Plank: 6, Pillar: 12, Firelog: 11, Brick: 30, Sand: 4, Clay: 5, IronOre: 8, CopperOre: 6, TinOre: 10, Cotton: 25 }, buy: { Log: 12, Plank: 10, Pillar: 20, Firelog: 15, Brick: 37, Sand: 6, Clay: 8, IronOre: 12, CopperOre: 10, TinOre: 14, Cotton: 32 } },
  // v36: desa gurun + kapal bajak laut di Pelabuhan — lokasi jual premium
  // (hanya jual, tidak beli), harga ikut NamuWiki (dicek 2026-11-19).
  // PERINGATAN: Dyed 60 di kapal > beli Textile 24 = LUBANG ARBITRASE
  // (beli 24, jual 60, untung 36 tanpa produksi). Sengaja tidak diubah:
  // harga Textile 24 sudah ada (jangan ubah harga lama, perintah Agus).
  // Perbaikan: naikkan beli Dyed di Textile jadi 65, atau batasi stok.
  desert:     { name: 'Desert Village', sell: { WoodFrame: 32, Log: 8, Firelog: 12, Wheel: 293 }, buy: {} },
  pirate:     { name: 'Kapal Bajak Laut', sell: { DyedTextiles: 20, Bed: 109, Engine: 185, Piano: 360 }, buy: {} }, // v37: Dyed 60->20 tutup arbitrase (premium pelabuhan: papan 16 x 1,2 = 19,2 dibulatkan 20)
};
// Posisi toko: obj di grid = 'shop_' + id. Toko kota disebar di sepanjang
// jalan toko (y=2): x = 1, 4, 7, 11, 14. x=8 tetap kosong (jalan ke
// jembatan), tidak ada toko di rel/peron atau di pintu keluar.
const SHOP_SPOTS = [
  { map: 'town', gx: 1, gy: 1, id: 'carpenter' },
  { map: 'town', gx: 4, gy: 3, id: 'blacksmith' },
  { map: 'town', gx: 7, gy: 3, id: 'exchange' },
  { map: 'town', gx: 11, gy: 1, id: 'toolshop' },
  { map: 'town', gx: 14, gy: 1, id: 'textile' },
  { map: 'town', gx: 17, gy: 7, id: 'supply' }, // v36: SUPPLY di sebelah rel
  { map: 'harbor', gx: 8, gy: 3, id: 'harbor' },
  { map: 'harbor', gx: 12, gy: 2, id: 'desert' }, // v36: desa gurun
  { map: 'harbor', gx: 15, gy: 2, id: 'pirate' }, // v36: kapal bajak laut
];

// Pintu keluar antar map: injak petak (gx,gy) pindah ke map `to`, lahir di
// petak (sx,sy) map tujuan. Mekanisme TP yang sama seperti jalan
// masuk/keluar lahan v12.
const MAP_EXITS = {
  town: [
    { gx: 8, gy: 0, to: 'mountain', sx: 14, sy: 10 }, // jembatan ke gunung, lahir di jalan selatan (x=2, z=15), satu petak di barat pintu ke kota
    { gx: 0, gy: 6, to: 'forest', sx: 14, sy: 6 },
    { gx: 19, gy: 6, to: 'harbor', sx: 1, sy: 6 }, // v36: tepi timur baru kota 20x14
  ],
  forest: [
    { gx: 8, gy: 0, to: 'mountain', sx: 6, sy: 10 }, // lahir di jalan selatan gunung (x=2, z=7)
    { gx: 15, gy: 6, to: 'town', sx: 1, sy: 6 },
  ],
  mountain: [
    { gx: 6, gy: 11, to: 'forest', sx: 8, sy: 1 }, // pintu ke hutan di selatan spawn (6,10) (x=1, z=7)
    { gx: 15, gy: 10, to: 'town', sx: 8, sy: 1 }, // ujung timur jalan selatan (x=2, z=16), lahir di bawah jembatan (x=11, z=9)
  ],
  harbor: [
    { gx: 0, gy: 6, to: 'town', sx: 18, sy: 6 }, // v36: satu petak di barat pintu timur kota (19,6)
  ],
};
// Peron kereta tiap map: [gx, gy] petak tengah peron, titik lahir naik kereta.
const TRAIN_SPAWN = { town: [7, 8], forest: [14, 8], mountain: [6, 8], harbor: [7, 6] };

// v36: Kota membesar 20x14 (stasiun + Conductor + SUPPLY di timur).
// Plot mulai 16x12 lalu membesar tiap ekspansi (ukuran dasar sama dengan
// grid v1 supaya simpan lama termigrasi utuh).
const TOWN_W = 20, TOWN_H = 14;
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
    // v29: bahannya kini sudah ada semua (Textiles dari Textiles Machine).
    { id: 'bed', out: 'Bed', n: 1, in: { Textiles: 2, Pillar: 2, WoodFrame: 2, Nails: 2, Plank: 4 }, secs: 60 },
    { id: 'piano', out: 'Piano', n: 1, in: { IronFrame: 1, Bench: 1, Coil: 4, Table: 1 }, secs: 60 },
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
    // v36: rantai emas (keputusan Agus, tanpa mesin baru) — harga jual turunan.
    { id: 'goldingot', out: 'GoldIngot', n: 1, in: { Firelog: 3, GoldOre: 2 }, secs: 35 },
    { id: 'goldplate', out: 'GoldPlate', n: 1, in: { GoldIngot: 2 }, secs: 20 },
  ],
  blacksmith: [
    { id: 'coil',  out: 'Coil',  n: 1, in: { CopperIngot: 1 }, secs: 20 },
    { id: 'beam',  out: 'IronBeam',  n: 1, in: { IronIngot: 1 }, secs: 20 },
    { id: 'frame', out: 'IronFrame', n: 1, in: { IronIngot: 2 }, secs: 30 },
    { id: 'gear',  out: 'Gear',  n: 1, in: { BronzeIngot: 1 }, secs: 25 },
    { id: 'nails', out: 'Nails', n: 10, in: { IronIngot: 1 }, secs: 20 }, // 10: NamuWiki
    { id: 'motor', out: 'Motor', n: 1, in: { Coil: 1, IronFrame: 1, Gear: 1 }, secs: 50 },
    // v36: Grinding Wheel dibeli Blacksmith $50 (NamuWiki, tanpa resep) —
    // resep TURUNAN: 1 Iron Ingot + 1 Stone. Tin Can dari TinOre (rantai
    // pewarna). Drill Head: 5 Stone + Iron Beam, 50 dtk (riset wiki).
    { id: 'grindwheel', out: 'GrindingWheel', n: 1, in: { IronIngot: 1, Stone: 1 }, secs: 15 },
    { id: 'tincan', out: 'TinCan', n: 1, in: { TinOre: 1 }, secs: 10 },
    { id: 'drillhead', out: 'DrillHead', n: 1, in: { Stone: 5, IronBeam: 1 }, secs: 50 },
  ],
  // v29: mesin baru. Electric Saw = resep Sawhorse 2x lebih cepat (3 dtk).
  // Advanced Saw: 2 Log jadi 7 Plank 10 dtk (riset); Pillar 4 turunan simetris.
  elecSaw: [
    { id: 'plank',  out: 'Plank',  n: 3, in: { Log: 1 }, secs: 3 },
    { id: 'pillar', out: 'Pillar', n: 2, in: { Log: 1 }, secs: 3 },
  ],
  advSaw: [
    { id: 'plank',  out: 'Plank',  n: 7, in: { Log: 2 }, secs: 10 },
    { id: 'pillar', out: 'Pillar', n: 4, in: { Log: 2 }, secs: 10 },
  ],
  textiles: [
    { id: 'textiles', out: 'Textiles', n: 5, in: { Cotton: 50 }, secs: 7 },
    { id: 'dyed', out: 'DyedTextiles', n: 5, in: { Textiles: 5, DyeCan: 1 }, secs: 10 },
  ],
  // Mining Drill: disederhanakan dari riset (tanpa Drill Head dan tanpa
  // Steam Engine, keduanya belum ada) — angka pertama riset (Drill Head)
  // dibuang, Firelog dipertahankan; waktu ikut riset.
  drill: [
    { id: 'iron',   out: 'IronOre',   n: 1, in: { Firelog: 3 }, secs: 30 },
    { id: 'copper', out: 'CopperOre', n: 1, in: { Firelog: 2 }, secs: 20 },
    { id: 'tin',    out: 'TinOre',    n: 1, in: { Firelog: 2 }, secs: 20 },
    { id: 'clay',   out: 'Clay',      n: 1, in: { Firelog: 2 }, secs: 10 },
    { id: 'sand',   out: 'Sand',      n: 1, in: { Firelog: 1 }, secs: 10 },
  ],
  // Construction Crafter: rantai meriam ikut riset 3.3; waktu dipilih
  // sendiri (riset diam) — Barrel dan Cannon paling lama.
  crafter: [
    { id: 'wheel',  out: 'Wheel',        n: 1, in: { Coil: 1, WoodFrame: 1, Gear: 2, Log: 2 }, secs: 20 },
    { id: 'mold',   out: 'CannonMold',   n: 1, in: { Sand: 5, IronFrame: 1 }, secs: 30 },
    { id: 'barrel', out: 'CannonBarrel', n: 1, in: { BronzeIngot: 5, CannonMold: 2 }, secs: 90 },
    { id: 'cannon', out: 'BronzeCannon', n: 1, in: { CannonBarrel: 1, Wheel: 4, WoodFrame: 1 }, secs: 120 },
    // v36: Storage Rack Advanced — 1 Engine + 1 Rack + 4 Barrel, 120 dtk,
    // 5 housing (wiki Storage Rack Advanced). Rack/Barrel di sini ITEM
    // (bukan bangunan): dibeli di Exchange, tidak bisa dijual.
    { id: 'rackadv', out: 'RackAdv', n: 1, in: { Engine: 1, Rack: 1, Barrel: 4 }, secs: 120 },
  ],
  // v36: Mixing Machine — rantai pewarna: Dye Flower (dari benih) jadi Dye,
  // lalu Dye + Tin Can jadi Dye Can. Riset $300 (turunan).
  mixer: [
    { id: 'dye',    out: 'Dye',    n: 1, in: { DyeFlower: 5 }, secs: 10 },
    { id: 'dyecan', out: 'DyeCan', n: 1, in: { Dye: 1, TinCan: 1 }, secs: 10 },
  ],
  // Tree Generator dan Harvester tidak punya resep: perilakunya di
  // 09-mesin.js (tanam/tebang otomatis), bukan crafting.
};

const MACHINES = {
  sawhorse:   { name: 'Sawhorse',     desc: 'Potong kayu jadi Plank dan Pillar, jalan otomatis seperti mesin lain.', color: '#a8763e', research: null },
  splitter:   { name: 'Log Splitter', desc: 'Membelah log menjadi bahan bakar peleburan.', color: '#7a5230', research: null },
  carpenter:  { name: 'Carpenter',    desc: 'Crafting otomatis produk kayu dan furnitur.', color: '#c9a86a', research: { money: 50 } },
  oven:       { name: 'Oven',         desc: 'Tungku awal untuk bata dan kaca.', color: '#b06040', research: { money: 100 } },
  smelter:    { name: 'Smelter',      desc: 'Peleburan semua ingot dengan bahan bakar Firelog.', color: '#96553c', research: { money: 500, items: { Brick: 30 } } },
  blacksmith: { name: 'Blacksmith',   desc: 'Crafting otomatis komponen logam.', color: '#8d99a8', research: { money: 1000 } },
  // v29: biaya riset mengikuti laporan wiki; yang tidak bisa dipanggul
  // sebagai material (Advanced Saw di biaya Textiles Machine) diadaptasi
  // jadi uang (lihat ROADMAP v29).
  elecSaw:   { name: 'Electric Saw',   desc: 'Gergaji otomatis: Log jadi Plank dan Pillar 2x lebih cepat.', color: '#d8c25a', research: { money: 0, items: { Nails: 4 } } },
  advSaw:    { name: 'Advanced Saw',   desc: 'Gergaji lanjutan: 2 Log jadi 7 Plank.', color: '#e8b64c', research: { money: 500, items: { Motor: 1, IronFrame: 1 } } },
  textiles:  { name: 'Textiles Machine', desc: 'Kapas jadi kain, kain + Dye Can jadi kain celup.', color: '#f2ede0', research: { money: 500, items: { IronFrame: 1, Coil: 4 } } },
  drill:     { name: 'Mining Drill',   desc: 'Menggali bijih otomatis dengan bahan bakar Firelog.', color: '#7d8894', research: { money: 500, items: { IronBeam: 2, Brick: 50, IronFrame: 1 } } },
  harvester: { name: 'Harvester',      desc: 'Menebang pohon di lahan otomatis jadi Log.', color: '#4fae6b', research: { money: 1000, items: { Motor: 2 } } },
  treeGen:   { name: 'Tree Generator', desc: 'Menumbuhkan pohon di petak rumput sebelah.', color: '#2f6b33', research: { money: 500, items: { WoodFrame: 4 } } },
  crafter:   { name: 'Construction Crafter', desc: 'Membuat roda, cetakan meriam, dan Bronze Cannon.', color: '#8d99a8', research: { money: 2000 } },
  // v36: Mixing Machine (rantai pewarna, riset $300 turunan), Ore Generator
  // ($5.000, hasilkan bijih otomatis seperti Tree Generator hasilkan pohon),
  // Storage Crane (ambil barang dari storage sebelah, riset $300 turunan).
  mixer:     { name: 'Mixing Machine', desc: 'Dye Flower jadi Dye, lalu Dye + Tin Can jadi Dye Can.', color: '#4fae9d', research: { money: 300 } },
  oreGen:    { name: 'Ore Generator', desc: 'Menghasilkan bijih otomatis (Iron/Copper/Tin bergiliran) ke output.', color: '#8d99a8', research: { money: 5000 } },
  crane:     { name: 'Storage Crane', desc: 'Mengambil 1 barang dari storage di sebelah ke output.', color: '#e8b64c', research: { money: 300 } },
};

// Biaya taruh bangunan. Mesin gratis sesudah riset; conveyor $100 (NamuWiki).
// Sisanya keputusan game, ditulis di sini supaya satu tempat.
// v36: Sorter $150 (turunan), Storage Barrel $40 (turunan); rackAdv $0
// karena ditempatkan dari item RackAdv di tas (dibuat di Crafter), bukan
// dibeli dengan uang.
const BUILD_COST = {
  conveyor: 100, conveyorTilt: 100, sorter: 150,
  box: 20, container: 60, rack: 150, barrel: 40, rackAdv: 0,
  wallWood: 10, wallIron: 30, lantern: 15, flowers: 5,
  statueLion: 500, statueMiner: 1000, statueLumber: 1000, statueSmith: 2000, statueLiberty: 5000,
};
const STORAGE_CAP = { box: 50, container: 200, rack: 500, barrel: 100, rackAdv: 1000 };

const CATEGORIES = [
  { id: 'conveyors', name: 'Conveyors', items: [
    { id: 'conveyor', kind: 'conveyor', name: 'Conveyor', sub: '$100', color: '#e8b64c' },
    { id: 'conveyorTilt', kind: 'conveyor', name: 'Inclined Conveyor', sub: '$100', color: '#e8b64c' },
    { id: 'sorter', kind: 'conveyor', name: 'Sorter', sub: '$150', color: '#9a6a9a' },
  ] },
  { id: 'machines', name: 'Machines', items: [
    { id: 'sawhorse', kind: 'machine', name: 'Sawhorse', sub: 'Gratis', color: '#a8763e' },
    { id: 'splitter', kind: 'machine', name: 'Log Splitter', sub: 'Gratis', color: '#7a5230' },
    { id: 'carpenter', kind: 'machine', name: 'Carpenter', sub: 'Research $50', color: '#c9a86a' },
    { id: 'oven', kind: 'machine', name: 'Oven', sub: 'Research $100', color: '#b06040' },
    { id: 'smelter', kind: 'machine', name: 'Smelter', sub: '$500 + 30 Brick', color: '#96553c' },
    { id: 'blacksmith', kind: 'machine', name: 'Blacksmith', sub: 'Research $1.000', color: '#8d99a8' },
    { id: 'elecSaw', kind: 'machine', name: 'Electric Saw', sub: 'Research 4 Nails', color: '#d8c25a' },
    { id: 'advSaw', kind: 'machine', name: 'Advanced Saw', sub: 'Research $500 + Motor + Iron Frame', color: '#e8b64c' },
    { id: 'textiles', kind: 'machine', name: 'Textiles Machine', sub: 'Research $500 + Iron Frame + 4 Coil', color: '#f2ede0' },
    { id: 'drill', kind: 'machine', name: 'Mining Drill', sub: 'Research $500 + 2 Beam, 50 Brick, 1 Frame', color: '#7d8894' },
    { id: 'harvester', kind: 'machine', name: 'Harvester', sub: 'Research $1.000 + 2 Motor', color: '#4fae6b' },
    { id: 'treeGen', kind: 'machine', name: 'Tree Generator', sub: 'Research $500 + 4 Wood Frame', color: '#2f6b33' },
    { id: 'crafter', kind: 'machine', name: 'Construction Crafter', sub: 'Research $2.000', color: '#8d99a8' },
    { id: 'mixer', kind: 'machine', name: 'Mixing Machine', sub: 'Research $300', color: '#4fae9d' },
    { id: 'oreGen', kind: 'machine', name: 'Ore Generator', sub: 'Research $5.000', color: '#8d99a8' },
    { id: 'crane', kind: 'machine', name: 'Storage Crane', sub: 'Research $300', color: '#e8b64c' },
  ] },
  { id: 'storages', name: 'Storages', items: [
    { id: 'box', kind: 'storage', name: 'Wooden Box', sub: '$20, 50 slot', color: '#8a5a33' },
    { id: 'container', kind: 'storage', name: 'Container', sub: '$60, 200 slot', color: '#4f7a94' },
    { id: 'rack', kind: 'storage', name: 'Storage Rack', sub: '$150, 500 slot', color: '#6e6a72' },
    { id: 'barrel', kind: 'storage', name: 'Storage Barrel', sub: '$40, 100 slot', color: '#7a5230' },
    { id: 'rackAdv', kind: 'storage', name: 'Storage Rack Advanced', sub: 'Crafter: Engine + Rack + 4 Barrel, 1.000 slot', color: '#6e6a72' },
  ] },
  { id: 'decorations', name: 'Decorations', items: [
    { id: 'lantern', kind: 'decor', name: 'Lantern', sub: '$15', color: '#ffd75e' },
    { id: 'flowers', kind: 'decor', name: 'Flowers', sub: '$5', color: '#d97ba8' },
  ] },
  { id: 'structures', name: 'Structures', items: [
    { id: 'wallWood', kind: 'wall', name: 'Wood Wall', sub: '$10', color: '#7a5230' },
    { id: 'wallIron', kind: 'wall', name: 'Iron Wall', sub: '$30', color: '#5d6773' },
  ] },
  { id: 'statues', name: 'Statues', items: [
    { id: 'statueLion', kind: 'statue', name: 'Lion', sub: '+50 Housing, $500', color: '#c98f2e' },
    { id: 'statueMiner', kind: 'statue', name: 'Miner', sub: '+100 Housing, $1.000', color: '#8d99a8' },
    { id: 'statueLumber', kind: 'statue', name: 'Lumberjack', sub: '+100 Housing, $1.000', color: '#2f6b33' },
    { id: 'statueSmith', kind: 'statue', name: 'Blacksmiths', sub: '+150 Housing, $2.000', color: '#6e7683' },
    { id: 'statueLiberty', kind: 'statue', name: 'Liberty', sub: '+200 Housing, $5.000', color: '#4fae9d' },
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
  // v36: batu + Gold Ore di Gunung; Oak/Pine/Palm/Dye dari benih (lihat
  // SEED_PLANTS) — jenis pohon yang sama, hasil Log (kecuali Dye Flower).
  stone:     { tool: 'pickaxe', swings: 3, item: 'Stone',     regrow: 60, hp: 3 },
  goldOre:   { tool: 'pickaxe', swings: 3, item: 'GoldOre',   regrow: 60, hp: 3 },
  treeOak:   { tool: 'axe',     swings: 3, item: 'Log',       regrow: 45, hp: 3 },
  treePine:  { tool: 'axe',     swings: 3, item: 'Log',       regrow: 45, hp: 3 },
  palm:      { tool: 'axe',     swings: 3, item: 'Log',       regrow: 45, hp: 3 },
  dyeplant:  { tool: 'axe',     swings: 2, item: 'DyeFlower', regrow: 45, hp: 2 },
};
const HARVEST_TEXT = { // teks melayang panen, kunci = obj atau terrain
  tree: '+1 Log', oreIron: '+1 Iron Ore', oreCopper: '+1 Copper Ore',
  oreTin: '+1 Tin Ore', sand: '+1 Sand', clay: '+1 Clay', cotton: '+1 Cotton',
  stone: '+1 Stone', goldOre: '+1 Gold Ore', treeOak: '+1 Log',
  treePine: '+1 Log', palm: '+1 Log', dyeplant: '+1 Dye Flower',
};

// ---- v36: benih + tumbuh bertahap ----
// Benih didapat dari menggali tunggul dengan sekop (lihat digStump di
// 07-pemain.js). Tanam di rumput lahan: pohon tumbuh bertahap, tiap tahap
// `secs` detik; stage 0..stages-1 muda (tidak bisa ditebang), stage =
// stages dewasa (hp penuh). Tanaman pewarna untuk rantai Dye Can.
const SEED_PLANTS = {
  SeedOak:    { obj: 'treeOak',  stages: 4, secs: 15 },
  SeedPine:   { obj: 'treePine', stages: 4, secs: 15 },
  SeedPalm:   { obj: 'palm',     stages: 3, secs: 15 },
  SeedCotton: { obj: 'cotton',   stages: 2, secs: 10 },
  SeedDye:    { obj: 'dyeplant', stages: 2, secs: 10 },
};
const PLANT_GROWTH = {
  treeOak: { stages: 4, secs: 15 }, treePine: { stages: 4, secs: 15 },
  palm:    { stages: 3, secs: 15 }, cotton:   { stages: 2, secs: 10 },
  dyeplant:{ stages: 2, secs: 10 },
};
// Tunggul yang bisa digali sekop (tunggul hilang, jadi benih).
const DIGGABLE = { tree: 1, treeOak: 1, treePine: 1, palm: 1, cotton: 1, dyeplant: 1 };
// Benih dari tunggul apa (pohon biasa selalu Oak supaya deterministik).
const STUMP_SEED = { tree: 'SeedOak', treeOak: 'SeedOak', treePine: 'SeedPine', palm: 'SeedPalm', cotton: 'SeedCotton', dyeplant: 'SeedDye' };

// ---- v35: perkakas, wagon, patung + housing, badge ----
// Perkakas: tingkat 0 = belum punya, 1 = dasar, 2 = bronze, 3 = iron.
// Harga ikut wiki (bronze $250, iron $1.000); dasar sekop/pickaxe $100
// turunan (kapak dasar gratis sejak awal). Naik tingkat mengurangi ayunan.
// v36: kapak Steel $2.500 tingkat 4 (NamuWiki) — hanya kapak yang bisa
// sampai Steel, sekop/pickaxe maks Iron (tingkat 3).
const TOOL_LEVEL_NAMES = ['Belum punya', 'Dasar', 'Bronze', 'Iron', 'Steel'];
const TOOL_UPGRADE_COST = { 0: 100, 1: 250, 2: 1000, 3: 2500 }; // biaya 0->1, 1->2, 2->3, 3->4
// Ayunan panen = ayunan node dikurangi bonus tingkat (minimal 1).
function swingsFor(node, toolLevel) {
  return Math.max(1, node.swings - Math.max(0, toolLevel - 1));
}

// Wagon: tingkat kapasitas (biaya turunan) + kuda (kecepatan, ikut wiki:
// speed+ $100, 2 kuda speed++ $500). Kecepatan jalan kaki lv1 = 1x,
// wagon lv2 = pengali di bawah, kereta lv3 = perjalanan instan.
const WAGON_BUY_COST = 100;
const WAGON_RESPAWN_COST = 5;
const WAGON_LEVELS = [
  { cap: 5, cost: 100 },
  { cap: 10, cost: 500 },
  { cap: 20, cost: 1500 },
  { cap: 40, cost: 4000 },
];
const WAGON_HORSE_COST = { 0: 100, 1: 500 }; // 0->1 kuda, 1->2 kuda
const WAGON_SPEED_MULT = [1.6, 2.0, 2.5]; // kuda 0, 1, 2

// Housing: batas dasar 600 (wiki Plots), tiap bangunan menambah pemakaian;
// patung menambah batas. Angka pemakaian turunan (mesin paling berat).
const HOUSING_BASE = 600;
const HOUSING_COST = { machine: 10, conveyor: 2, storage: 5, wall: 1, decor: 1, statue: 0 };
const STATUES = {
  statueLion:    { name: 'Lion',       bonus: 50,  cost: 500 },
  statueMiner:   { name: 'Miner',      bonus: 100, cost: 1000 },
  statueLumber:  { name: 'Lumberjack', bonus: 100, cost: 1000 },
  statueSmith:   { name: 'Blacksmiths', bonus: 150, cost: 2000 },
  statueLiberty: { name: 'Liberty',    bonus: 200, cost: 5000 },
};

// Badge: diberikan saat resep dibuka (research). Research tetap jadi cara
// membuka; badge hanya penanda pencapaian (bukan kunci baru).
const BADGES = {
  carpenter:  { name: 'Carpenter',  desc: 'Membuka resep Carpenter' },
  blacksmith: { name: 'Blacksmith', desc: 'Membuka resep Blacksmith' },
  harvester:  { name: 'Harvester',  desc: 'Membuka resep Harvester' },
  drill:      { name: 'Mining Drill', desc: 'Membuka resep Mining Drill' },
  cannon:     { name: 'Bronze Cannon', desc: 'Membuka resep Bronze Cannon' }, // v36
};
// Mesin apa memberi badge apa (crafter memberi badge Cannon, bukan 'crafter').
const RESEARCH_BADGE = { carpenter: 'carpenter', blacksmith: 'blacksmith', harvester: 'harvester', drill: 'drill', crafter: 'cannon' };

// ---- v36: batas item aktif, biaya slot, ekspansi per save, warna conveyor ----
// Batas item aktif global (wiki: mesin berhenti kalau barang di dunia
// sudah 150, tidak termasuk yang di dalam chest). Yang dihitung: output
// mesin + barang di conveyor (bukan storage, bukan peti wagon, bukan tas).
const ACTIVE_ITEM_LIMIT = 150;
// Buka save slot 2/3/4 bayar (wiki Plots): slot dengan data dihitung sudah
// terbuka; biaya dipotong saat membuka slot kosong yang masih terkunci.
const SLOT_UNLOCK_COST = { 2: 25000, 3: 50000, 4: 100000 };
// Biaya ekspansi per save (wiki Plots): pengali terhadap harga dasar
// (200/400/800/2000) — total per save $1.700/$3.400/$8.500/$17.000.
const SLOT_EXP_MULT = { 1: 0.5, 2: 1, 3: 2.5, 4: 5 };
// Warna conveyor (visual saja, tersimpan di entri conveyor). Emas = default.
const CONVEYOR_COLORS = { purple: '#9a6a9a', red: '#c0392b', green: '#4fae6b', orange: '#e07b39', blue: '#4f7ab8' };
const CONVEYOR_COLOR_NAMES = { gold: 'Emas', purple: 'Ungu', red: 'Merah', green: 'Hijau', orange: 'Oranye', blue: 'Biru' };
const CONVEYOR_COLOR_HEX = { gold: '#e8b64c', purple: '#9a6a9a', red: '#c0392b', green: '#4fae6b', orange: '#e07b39', blue: '#4f7ab8' };

// Riwayat versi untuk tombol Book di dalam game (ringkasan ROADMAP.md).
const CHANGELOG = [
  ['v36', 'Stasiun + Conductor di kota (20x14), toko SUPPLY, desa gurun + kapal bajak laut di pelabuhan, rantai emas, benih + palem + renang, Sorter, Storage Barrel/Crane/Rack Advanced, Ore Generator, Drill Head, rantai pewarna, kapak Steel, Grinding Wheel, kereta jadi toko, conveyor berwarna, batas item 150, biaya slot + ekspansi per save.'],
  ['v37', 'Kapal bajak laut: Dyed Textiles 60 jadi 20 (tutup lubang arbitrase v36 — beli $24 di Textile, jual $60 di kapal = untung $36; harga baru ikut rumus premium pelabuhan papan 16 x 1,2 = 19,2 dibulatkan ke atas 20).'],
  ['v38', 'Panel kereta cuma dibuka dari klik kereta (lokomotifnya); hapus NPC Conductor, papan jual di 4 map, dan stasiun biru kota. Bagian jual di dalam panel kereta tetap ada.'],
  ['v35', 'Wagon (jalan lv1, wagon lv2, kereta lv3), perkakas, patung + Housing, badge, 4 slot save.'],
  ['v34', 'Pintu keluar lahan tetap di Agus (1,9) di semua ukuran; tombol melayang X/PUTAR/centang di dekat petak hantu.'],
  ['v33', 'Conveyor tidak lagi macet: backpressure frontAccepts; conveyor macet bisa dihapus (+$100).'],
  ['v32', 'Bar tutorial dihapus; panel tutorial di tengah layar dengan tombol Lewati/Lanjut.'],
  ['v31', 'Mode Admin jadi saklar on/off di panel Admin (duit infinite, semua terbuka, crafting instan, lahan maks).'],
  ['v30', 'Arbitrase ditutup (harga Textile/Exchange/Blacksmith disesuaikan); audit ulang 0 lubang.'],
  ['v29', '6 mesin baru (Electric Saw, Advanced Saw, Textiles Machine, Mining Drill, Harvester, Construction Crafter) + Tree Generator; ikon menu bangun jadi sprite asli; Bronze Cannon $1.500.'],
  ['v28', 'Label (1,9) pindah ke petak jalan masuk; pintu keluar lahan bisa dipijak; migrasi simpan lama.'],
  ['v27', 'Alur bangun di lahan jadi bayangan + X/PUTAR/centang; conveyor tetap berantai.'],
  ['v26', 'Penggaris koordinat Agus x/z di petak pinggir, saklar Koordinat di Pengaturan (default ON).'],
  ['v25', 'Peron baru + rel pindah, toko tersebar, rel nyambung antar map, naik kereta cukup klik kereta.'],
  ['v24', '5 map zona (Gunung, Hutan, Kota, Pelabuhan, Lahan); sungai + jembatan; kereta 130; 5 toko.'],
  ['v23', 'Kereta 130 di semua map; pintu keluar antar map; rel lurus + belokan.'],
  ['v22', 'Auto Seller; ekspansi Mayor 4 tingkat; toko Exchange; harga papan.'],
  ['v21', 'Mayor + panel ekspansi; rel kereta pertama di kota.'],
  ['v20', 'Mode Admin; simpan 4 slot; migrasi simpan lama.'],
  ['v19', 'Belokan rel; sprite rel diperbaiki (petak (9,9) sempat jadi rumput).'],
  ['v18', 'Tutorial 8 langkah; panel bantuan; suara SFX.'],
  ['v17', 'Atlas sprite diperluas; sel kosong dicek sebelum tambah sprite.'],
  ['v16', 'Data dipecah jadi 03-data-*.js; resep Smelter/Blacksmith lengkap.'],
  ['v15', 'Migrasi simpan lama; peta statis dibangun ulang kalau kedaluwarsa.'],
  ['v14', 'Conveyor + storage; rantai mesin lengkap (Sawhorse sampai Blacksmith).'],
  ['v13', '5 map zona pertama; pindah map lewat ujung map.'],
  ['v12', 'Sawhorse otomatis; floater hasil mesin; tombol BANGUN hilang di kota.'],
  ['v11', 'Conveyor miring dihapus dari menu bangun (sprite tetap ada).'],
  ['v10', 'Peta pulau; laut di sekeliling; dermaga pelabuhan.'],
  ['v9', 'Toko Textile; rantai kain; Dye Can.'],
  ['v8', 'Toko Tool Shop; perkakas dasar; upgrade Bronze/Iron.'],
  ['v7', 'Mayor + ekspansi; ikon panel; perbaikan bug refresh.'],
  ['v6', 'Toko Carpenter/Blacksmith/Exchange; harga papan; simpan lokal.'],
];

