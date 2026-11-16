'use strict';
/* Indotopia — game kaya Growtopia versi kita. Side-view, single-player,
   Canvas + JS polos, tanpa dependensi. Semua angka mengikuti PRD yang
   disetujui; angka yang PRD tidak rinci didokumentasikan di docs/PRD.md. */

// ---------- Konstanta ----------
const TILE = 32, MW0 = 60, MH = 40, SKY_ROWS = 10, VW = 960, VH = 640;
const GRAV = 1200, JUMP_V = 480, WALK = 160, FALL_MAX = 600;
const DAY_LEN = 180, NIGHT_LEN = 90, SEASON_LEN = 28;
const SAVE_KEY = 'indotopia-gt-save-v1';
const DAILY_LIMIT = 20, BREED_CHANCE = 0.25;
const EXPAND_COSTS = [500, 1000, 2000, 4000, 8000], EXPAND_COLS = 20, MAX_EXPAND = 5;
const SEASONS = ['Semi', 'Panas', 'Gugur', 'Dingin'];
const T_EMPTY = 0, T_DIRT = 1, T_STONE = 2, T_WOOD = 3, T_FENCE = 4, T_TORCH = 5,
  T_BRICK = 6, T_PLANKS = 7, T_WORKBENCH = 8, T_FURNACE = 9, T_SPLICE = 10,
  T_SHIPBIN = 11, T_CHEST = 12, T_LANTERN = 13;

// ---------- Katalog petak ----------
const TILES = {
  1: { name: 'Tanah', hp: 2, solid: true, seed: 'seed-wheat', drop: 'dirt' },
  2: { name: 'Batu', hp: 4, solid: true, seed: 'seed-flower', drop: 'stone' },
  3: { name: 'Kayu', hp: 3, solid: true, seed: 'seed-tree', drop: 'wood' },
  4: { name: 'Pagar', hp: 1, solid: true, cost: { wood: 2 } },
  5: { name: 'Obor', hp: 1, solid: false, cost: { wood: 1 } },
  6: { name: 'Bata', hp: 4, solid: true, cost: { stone: 2 } },
  7: { name: 'Papan', hp: 2, solid: true, cost: { wood: 1 } },
  8: { name: 'Meja Kerja', hp: 5, solid: true, cost: { wood: 10 }, station: 'workbench' },
  9: { name: 'Tungku', hp: 5, solid: true, cost: { stone: 20 }, station: 'furnace' },
  10: { name: 'Meja Splice', hp: 5, solid: true, cost: { wood: 30, stone: 10 }, station: 'splice' },
  11: { name: 'Kotak Kirim', hp: 5, solid: true, cost: { wood: 10 }, shipbin: true },
  12: { name: 'Peti', hp: 2, solid: true, cost: { wood: 8 } },
  13: { name: 'Lampion', hp: 1, solid: false, cost: { wood: 1, 'flower-sun': 1 } },
};
// Entri menu bangun: petak yang ditaruh dengan biaya bahan langsung.
const BUILD_ENTRIES = [
  { code: T_DIRT, cost: { dirt: 1 } }, { code: T_WOOD, cost: { wood: 1 } },
  { code: T_STONE, cost: { stone: 1 } }, { code: T_FENCE, cost: { wood: 2 } },
  { code: T_TORCH, cost: { wood: 1 } }, { code: T_BRICK, cost: { stone: 2 } },
  { code: T_PLANKS, cost: { wood: 1 } }, { code: T_WORKBENCH, cost: { wood: 10 } },
  { code: T_FURNACE, cost: { stone: 20 } }, { code: T_SPLICE, cost: { wood: 30, stone: 10 } },
  { code: T_SHIPBIN, cost: { wood: 10 } },
];

// ---------- Katalog item ----------
// sell = harga tetap toko membeli; buy = harga tetap toko menjual (kalau ada).
const ITEMS = {
  dirt: { name: 'Tanah', sell: 2 }, wood: { name: 'Kayu', sell: 8 }, stone: { name: 'Batu', sell: 6 },
  wheat: { name: 'Gandum', sell: 10 }, pumpkin: { name: 'Labu', sell: 30 }, apple: { name: 'Apel', sell: 25 },
  strawberry: { name: 'Stroberi', sell: 20 }, melon: { name: 'Melon', sell: 40 }, grape: { name: 'Anggur', sell: 35 },
  'flower-red': { name: 'Bunga Merah', sell: 15 }, 'flower-yellow': { name: 'Bunga Kuning', sell: 15 },
  'flower-white': { name: 'Bunga Putih', sell: 15 }, 'flower-orange': { name: 'Bunga Oranye', sell: 30 },
  'flower-pink': { name: 'Bunga Pink', sell: 30 }, 'flower-purple': { name: 'Bunga Ungu', sell: 30 },
  'flower-rainbow': { name: 'Bunga Pelangi', sell: 100 }, 'flower-sun': { name: 'Bunga Matahari', sell: 20 },
  'flower-sakura': { name: 'Sakura', sell: 30 }, 'gold-fruit': { name: 'Buah Emas', sell: 150 },
  bread: { name: 'Roti', sell: 25 }, pie: { name: 'Kue Labu', sell: 50 }, juice: { name: 'Jus Apel', sell: 30 },
  jam: { name: 'Selai Stroberi', sell: 30 }, bouquet: { name: 'Buket Bunga', sell: 80 },
  fertilizer: { name: 'Pupuk', sell: 15, buy: 15 },
  'seed-wheat': { name: 'Benih Gandum', sell: 3, buy: 5, seed: true },
  'seed-tree': { name: 'Benih Pohon', sell: 4, buy: 8, seed: true },
  'seed-flower': { name: 'Benih Bunga', sell: 3, buy: 6, seed: true },
  'seed-pumpkin': { name: 'Benih Labu', sell: 10, seed: true },
  'seed-apple': { name: 'Benih Apel', sell: 12, seed: true },
  'seed-pine': { name: 'Benih Pinus', sell: 12, seed: true },
  'seed-sun': { name: 'Benih Bunga Matahari', sell: 10, seed: true },
  'seed-strawberry': { name: 'Benih Stroberi', sell: 10, seed: true },
  'seed-sakura': { name: 'Benih Sakura', sell: 15, seed: true },
  'seed-melon': { name: 'Benih Melon', sell: 20, seed: true },
  'seed-grape': { name: 'Benih Anggur', sell: 18, seed: true },
  'seed-rainbow': { name: 'Benih Pelangi', sell: 50, seed: true },
  'seed-gold': { name: 'Benih Emas', sell: 75, seed: true },
  'seed-fred': { name: 'Benih Bunga Merah', sell: 8, seed: true },
  'seed-fyellow': { name: 'Benih Bunga Kuning', sell: 8, seed: true },
  'seed-fwhite': { name: 'Benih Bunga Putih', sell: 8, seed: true },
  'seed-forange': { name: 'Benih Bunga Oranye', sell: 15, seed: true },
  'seed-fpink': { name: 'Benih Bunga Pink', sell: 15, seed: true },
  'seed-fpurple': { name: 'Benih Bunga Ungu', sell: 15, seed: true },
  turnip: { name: 'Lobak', sell: 0 },
  chest: { name: 'Peti', sell: 20, tile: T_CHEST }, lantern: { name: 'Lampion', sell: 15, tile: T_LANTERN },
};
const FLOWER_ITEMS = ['flower-red', 'flower-yellow', 'flower-white', 'flower-orange', 'flower-pink', 'flower-purple', 'flower-rainbow', 'flower-sun', 'flower-sakura'];
const SHOP_BUY = ['seed-wheat', 'seed-tree', 'seed-flower', 'fertilizer'];
const GIFT_SHOP = [
  { item: 'seed-rainbow', cost: 10 }, { item: 'seed-gold', cost: 15 },
  { item: 'seed-fpurple', cost: 6 }, { item: 'bouquet', cost: 8 },
];

// ---------- Katalog tanaman (kunci = id benih) ----------
const PLANTS = {
  'seed-wheat': { name: 'Gandum', grow: 60, seasons: [0, 1], yield: 'wheat' },
  'seed-tree': { name: 'Pohon', grow: 120, seasons: [0, 1, 2], yield: 'wood', tree: true },
  'seed-flower': { name: 'Bunga Liar', grow: 90, seasons: [0, 1], yield: 'flower-?', wild: true },
  'seed-pumpkin': { name: 'Labu', grow: 90, seasons: [2], yield: 'pumpkin' },
  'seed-apple': { name: 'Apel', grow: 150, seasons: [0, 1, 2], yield: 'apple', tree: true },
  'seed-pine': { name: 'Pinus', grow: 180, seasons: [0, 1, 2, 3], yield: 'wood', tree: true },
  'seed-sun': { name: 'Bunga Matahari', grow: 90, seasons: [1], yield: 'flower-sun' },
  'seed-strawberry': { name: 'Stroberi', grow: 90, seasons: [0], yield: 'strawberry' },
  'seed-sakura': { name: 'Sakura', grow: 150, seasons: [0], yield: 'flower-sakura', tree: true },
  'seed-melon': { name: 'Melon', grow: 120, seasons: [1], yield: 'melon' },
  'seed-grape': { name: 'Anggur', grow: 120, seasons: [2], yield: 'grape' },
  'seed-rainbow': { name: 'Bunga Pelangi', grow: 150, seasons: [0, 1], yield: 'flower-rainbow' },
  'seed-gold': { name: 'Tanaman Emas', grow: 180, seasons: [1, 2], yield: 'gold-fruit' },
  'seed-fred': { name: 'Bunga Merah', grow: 90, seasons: [0, 1], yield: 'flower-red', color: 'red' },
  'seed-fyellow': { name: 'Bunga Kuning', grow: 90, seasons: [0, 1], yield: 'flower-yellow', color: 'yellow' },
  'seed-fwhite': { name: 'Bunga Putih', grow: 90, seasons: [0, 1], yield: 'flower-white', color: 'white' },
  'seed-forange': { name: 'Bunga Oranye', grow: 90, seasons: [0, 1], yield: 'flower-orange', color: 'orange' },
  'seed-fpink': { name: 'Bunga Pink', grow: 90, seasons: [0, 1], yield: 'flower-pink', color: 'pink' },
  'seed-fpurple': { name: 'Bunga Ungu', grow: 90, seasons: [0, 1], yield: 'flower-purple', color: 'purple' },
};
const FLOWER_COLORS = { red: '#e74c3c', yellow: '#f1c40f', white: '#ecf0f1', orange: '#e67e22', pink: '#fd79a8', purple: '#9b59b6' };

// ---------- Resep splice (8, urutan bebas) ----------
const SPLICE_RECIPES = [
  { a: 'seed-wheat', b: 'seed-wheat', out: 'seed-pumpkin' },
  { a: 'seed-wheat', b: 'seed-tree', out: 'seed-apple' },
  { a: 'seed-tree', b: 'seed-tree', out: 'seed-pine' },
  { a: 'seed-flower', b: 'seed-flower', out: 'seed-sun' },
  { a: 'seed-wheat', b: 'seed-flower', out: 'seed-strawberry' },
  { a: 'seed-tree', b: 'seed-flower', out: 'seed-sakura' },
  { a: 'seed-pumpkin', b: 'seed-apple', out: 'seed-melon' },
  { a: 'seed-strawberry', b: 'seed-sun', out: 'seed-grape' },
];

// ---------- Resep crafting (10) ----------
const CRAFT_RECIPES = [
  { id: 'fertilizer', station: 'workbench', name: 'Pupuk', cost: { wheat: 2 }, out: { item: 'fertilizer', qty: 1 } },
  { id: 'bouquet', station: 'workbench', name: 'Buket Bunga', cost: { flowerAny: 3 }, out: { item: 'bouquet', qty: 1 } },
  { id: 'chest', station: 'workbench', name: 'Peti', cost: { wood: 8 }, out: { item: 'chest', qty: 1 } },
  { id: 'lantern', station: 'workbench', name: 'Lampion', cost: { wood: 1, 'flower-sun': 1 }, out: { item: 'lantern', qty: 1 } },
  { id: 'bread', station: 'furnace', name: 'Roti', cost: { wheat: 2 }, out: { item: 'bread', qty: 1 } },
  { id: 'pie', station: 'furnace', name: 'Kue Labu', cost: { pumpkin: 1, wheat: 1 }, out: { item: 'pie', qty: 1 } },
  { id: 'juice', station: 'furnace', name: 'Jus Apel', cost: { apple: 2 }, out: { item: 'juice', qty: 1 } },
  { id: 'jam', station: 'furnace', name: 'Selai Stroberi', cost: { strawberry: 2 }, out: { item: 'jam', qty: 1 } },
  { id: 'seed-rainbow', station: 'splice', name: 'Benih Pelangi', cost: { 'seed-forange': 1, 'seed-fpink': 1 }, out: { item: 'seed-rainbow', qty: 1 } },
  { id: 'seed-gold', station: 'splice', name: 'Benih Emas', cost: { 'seed-melon': 1, 'seed-grape': 1 }, out: { item: 'seed-gold', qty: 1 } },
];

// ---------- Skill dan profesi ----------
const SKILL_NAMES = { farm: 'Bertani', wood: 'Menebang', mine: 'Menambang' };
const PROFESSIONS = {
  farm: {
    5: [{ id: 'double-harvest', name: 'Panen Ganda', desc: '25% panen +1 hasil' }, { id: 'green-thumb', name: 'Tangan Hijau', desc: 'Tumbuh 25% lebih cepat' }],
    10: [{ id: 'master-farmer', name: 'Master Tani', desc: 'Harga jual hasil tani +50%' }, { id: 'season-keeper', name: 'Penjaga Musim', desc: 'Tanaman tumbuh di semua musim' }],
  },
  wood: {
    5: [{ id: 'sharp-axe', name: 'Kapak Tajam', desc: 'Blok kayu 1 pukulan lebih sedikit' }, { id: 'planter', name: 'Penanam', desc: '+1 benih dari blok kayu' }],
    10: [{ id: 'master-lumber', name: 'Penebang Ulung', desc: 'Blok kayu total 2 pukulan lebih sedikit' }, { id: 'dear-wood', name: 'Kayu Berharga', desc: 'Harga jual kayu +50%' }],
  },
  mine: {
    5: [{ id: 'strong-pick', name: 'Beliung Kuat', desc: 'Blok batu 1 pukulan lebih sedikit' }, { id: 'stone-hunter', name: 'Pemburu Batu', desc: '+1 blok batu' }],
    10: [{ id: 'master-miner', name: 'Penambang Ulung', desc: 'Blok batu total 2 pukulan lebih sedikit' }, { id: 'dear-stone', name: 'Batu Berharga', desc: 'Harga jual batu +50%' }],
  },
};

// ---------- Util ----------
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function key(x, y) { return x + ',' + y; }
function hash2(x, y) { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >> 13)) | 0; return ((h * 1274126177) | 0) >>> 0; }
function seasonOf(day) { return Math.floor((day - 1) / SEASON_LEN) % 4; }
function dayInWeek(day) { return (day - 1) % 7; } // 0 = Minggu
function weekOf(day) { return Math.floor((day - 1) / 7); }

// ---------- Suara: disintesis WebAudio, tanpa file ----------
let AC = null;
function audio() {
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
  } catch (e) { /* tanpa audio, game tetap jalan */ }
}
function blip(freq, dur, type, gain, slide) {
  if (!AC) return;
  const o = AC.createOscillator(), g = AC.createGain();
  o.type = type || 'square'; o.frequency.value = freq;
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, AC.currentTime + dur);
  g.gain.value = gain || 0.06;
  g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
  o.connect(g); g.connect(AC.destination);
  o.start(); o.stop(AC.currentTime + dur);
}
const sfx = {
  jump() { blip(300, 0.12, 'square', 0.05, 520); },
  punch() { blip(140, 0.06, 'square', 0.07, 90); },
  brk() { blip(90, 0.15, 'sawtooth', 0.08, 50); },
  place() { blip(220, 0.08, 'square', 0.06, 180); },
  plant() { blip(520, 0.1, 'sine', 0.06, 700); },
  water() { blip(700, 0.15, 'sine', 0.05, 400); },
  harvest() { blip(660, 0.09, 'sine', 0.07, 990); },
  coin() { blip(880, 0.08, 'sine', 0.07); setTimeout(() => blip(1320, 0.12, 'sine', 0.07), 70); },
  splice() { blip(440, 0.1, 'triangle', 0.07, 880); setTimeout(() => blip(880, 0.14, 'triangle', 0.07, 1320), 90); },
  levelup() { blip(523, 0.1, 'sine', 0.07); setTimeout(() => blip(659, 0.1, 'sine', 0.07), 90); setTimeout(() => blip(784, 0.16, 'sine', 0.07), 180); },
  error() { blip(160, 0.15, 'sawtooth', 0.06, 110); },
  click() { blip(500, 0.05, 'square', 0.04); },
  dawn() { blip(392, 0.15, 'sine', 0.06); setTimeout(() => blip(523, 0.2, 'sine', 0.06), 130); },
  night() { blip(220, 0.25, 'sine', 0.05, 160); },
};

// ---------- Dunia: permukaan berundak halus, deterministik per kolom ----------
function surfAt(x) { return 10 + Math.round(1 + Math.sin(x * 0.32) * 1); }
function genColumns(tiles, x0, x1) {
  for (let x = x0; x < x1; x++) {
    const s = surfAt(x);
    for (let y = 0; y < MH; y++) {
      if (y < s) tiles[y][x] = T_EMPTY;
      else if (y <= 24) tiles[y][x] = T_DIRT;
      else tiles[y][x] = (hash2(x, y) % 4 === 0) ? T_DIRT : T_STONE;
    }
  }
}
function nearSpecial(x, list) { return list.some(c => Math.abs(x - c) <= 2); }
function genWorld(w) {
  const tiles = [];
  for (let y = 0; y < MH; y++) tiles.push(new Array(w).fill(T_EMPTY));
  genColumns(tiles, 0, w);
  const plants = [];
  const special = [24, 27, 30, 33, 36]; // NPC, stasiun awal, spawn
  for (let x = 2; x < w - 2; x++) {
    if (nearSpecial(x, special)) continue;
    const s = surfAt(x);
    if (hash2(x, 7) % 7 === 0) { // pohon: batang 3 petak kayu
      for (let i = 1; i <= 3; i++) tiles[s - i][x] = T_WOOD;
    } else if (hash2(x, 11) % 9 === 0) { // batu permukaan
      tiles[s - 1][x] = T_STONE;
    } else if (hash2(x, 13) % 5 === 0) { // bunga liar
      plants.push({ tx: x, ty: s - 1, seed: 'seed-flower', growth: 0, watered: false, color: ['red', 'yellow', 'white'][hash2(x, 17) % 3] });
    }
  }
  // Meja kerja dan kotak kirim awal, supaya loop bisa mulai.
  tiles[surfAt(27) - 1][27] = T_WORKBENCH;
  tiles[surfAt(33) - 1][33] = T_SHIPBIN;
  return { tiles, plants };
}

// ---------- State ----------
const S = {};
function initState(s) {
  const w = genWorld(MW0);
  s.tiles = w.tiles; s.plants = w.plants; s.mw = MW0;
  s.tileHp = {}; s.tileHit = {}; s.placed = {};
  s.placed[key(27, surfAt(27) - 1)] = true; s.placed[key(33, surfAt(33) - 1)] = true;
  s.px = 30 * TILE + 16; s.py = surfAt(30) * TILE - 14; s.vx = 0; s.vy = 0; // 14 = setengah tinggi badan
  s.face = 1; s.onGround = false; s.walk = 0;
  s.cam = { x: 0, y: 0 };
  s.zoom = 1;
  s.coins = 0; s.taskCoins = 0; s.inv = {};
  s.day = 1; s.t = 0; s.phase = 'day'; s.rtime = 0;
  s.skills = {
    farm: { xp: 0, level: 1, prof5: null, prof10: null },
    wood: { xp: 0, level: 1, prof5: null, prof10: null },
    mine: { xp: 0, level: 1, prof5: null, prof10: null },
  };
  s.shipQ = []; s.soldToday = 0; s.boughtToday = 0;
  s.counters = { gained: {}, planted: 0, spliced: 0 };
  s.missions = []; s.knownSplice = [];
  s.turnip = null; s.expansions = 0;
  s.npcs = [
    { id: 'merchant', name: 'Pedagang', tx: 24, ty: surfAt(24) - 1 },
    { id: 'quest', name: 'Pemberi Misi', tx: 36, ty: surfAt(36) - 1 },
  ];
  s.place = null; s.panel = null; s.selStation = null;
  s.parts = []; s.floats = []; s.shake = 0; s.saveT = 0; s.frozen = false;
  s.flags = {};
}
initState(S);
function countItem(id) { return S.inv[id] || 0; }
function gainItem(id, qty) {
  S.inv[id] = (S.inv[id] || 0) + qty;
  S.counters.gained[id] = (S.counters.gained[id] || 0) + qty;
  discoverRecipes();
}
function removeItem(id, qty) {
  if ((S.inv[id] || 0) < qty) return false;
  S.inv[id] -= qty;
  if (S.inv[id] <= 0) delete S.inv[id];
  return true;
}
function hasCost(cost) {
  for (const k in cost) {
    if (k === 'flowerAny') {
      let n = 0;
      for (const f of FLOWER_ITEMS) n += countItem(f);
      if (n < cost[k]) return false;
    } else if (countItem(k) < cost[k]) return false;
  }
  return true;
}
function payCost(cost) {
  for (const k in cost) {
    if (k === 'flowerAny') {
      let need = cost[k];
      for (const f of FLOWER_ITEMS) {
        const take = Math.min(countItem(f), need);
        if (take > 0) removeItem(f, take);
        need -= take;
        if (need <= 0) break;
      }
    } else removeItem(k, cost[k]);
  }
}
function costText(cost) {
  return Object.keys(cost).map(k => cost[k] + ' ' + (k === 'flowerAny' ? 'bunga' : ITEMS[k].name)).join(' + ');
}

// ---------- DOM ----------
function $(id) { return document.getElementById(id); }
const canvas = $('game');
const ctx = canvas.getContext('2d');
const el = {
  panel: $('panel'), menu: $('menu'), banner: $('banner'),
  buildbar: $('buildbar'), buildTxt: $('buildTxt'),
  hCoins: $('hCoins'), hTask: $('hTask'), hDay: $('hDay'), hPhase: $('hPhase'),
  hCyc: $('hCyc'), hSel: $('hSel'),
};

// ---------- Efek: partikel dan angka melayang ----------
function burst(x, y, color, n, spd) {
  for (let i = 0; i < (n || 8); i++) {
    const a = Math.random() * Math.PI * 2, v = (spd || 70) * (0.4 + Math.random());
    S.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 30, life: 0.5 + Math.random() * 0.3, color });
  }
}
function addFloat(x, y, txt, color) { S.floats.push({ x, y, txt, color: color || '#fff', life: 1.1 }); }
let bannerT = null;
function banner(txt) {
  el.banner.textContent = txt; el.banner.classList.add('show');
  if (bannerT) clearTimeout(bannerT);
  bannerT = setTimeout(() => el.banner.classList.remove('show'), 2200);
}
function celebrate(flag, txt) {
  if (S.flags[flag]) return;
  S.flags[flag] = true;
  banner(txt); sfx.levelup();
}
