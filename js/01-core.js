'use strict';
/* Indotopia Remake — salinan Growtopia single-player. Side-view, Canvas +
   JS polos, tanpa dependensi. Angka mengikuti riset Growtopia; angka yang
   riset tidak temukan ditandai tafsir dan didokumentasikan di docs/PRD.md. */

// ---------- Konstanta ----------
const TILE = 32, MW = 100, MH = 60, BEDROCK_ROWS = 6, VW = 960, VH = 640;
const GRAV = 1200, JUMP_V = 480, WALK = 160, FALL_MAX = 600;
const PUNCH_CD = 0.2, REACH = 3, SAVE_KEY = 'indotopia-remake-save-v1';
const TRADE_SLOTS = 4, STACK_MAX = 200, LEVEL_CAP = 125, ROLE_CAP = 10;
const T_EMPTY = 0, T_DIRT = 1, T_ROCK = 2, T_WOOD = 3, T_GRASS = 4, T_BRICK = 5,
  T_DOOR = 6, T_LAVA = 7, T_CAVE = 8, T_GOLDEN = 9, T_FIREPLACE = 10,
  T_CHANDELIER = 11, T_PEPPER = 12, T_BEDROCK = 13, T_SIGN = 14, T_GLASS = 15,
  T_VENDING = 16, T_WEATHER = 17, T_CHEST = 18, T_LOCK_S = 19, T_LOCK_B = 20,
  T_LOCK_H = 21, T_LOCK_W = 22;

// ---------- Katalog petak ----------
// hits = pukulan sampai pecah (Infinity = hanya lewat wrench). restore = detik
// sampai kerusakan pulih kalau tidak dipukul lagi (riset: 8 dtk umumnya, 1 dtk kaca).
const TILES = {
  1: { name: 'Dirt', hits: 2, solid: true, layer: 'fg', item: 'dirt', restore: 8 },
  2: { name: 'Rock', hits: 3, solid: true, layer: 'fg', item: 'rock', restore: 8 },
  3: { name: 'Wood Block', hits: 3, solid: true, layer: 'fg', item: 'wood', restore: 8 },
  4: { name: 'Grass', hits: 2, solid: true, layer: 'fg', item: 'grass', restore: 8 },
  5: { name: 'Brick', hits: 4, solid: true, layer: 'fg', item: 'brick', restore: 8 },
  6: { name: 'Door', hits: 2, solid: false, layer: 'fg', item: 'door', restore: 8, door: true },
  7: { name: 'Lava', hits: 2, solid: false, layer: 'fg', item: 'lava', restore: 8, hazard: true },
  8: { name: 'Cave Background', hits: 2, solid: false, layer: 'bg', item: 'cave', restore: 8 },
  9: { name: 'Golden Block', hits: 20, solid: true, layer: 'fg', item: 'golden', restore: 8 },
  10: { name: 'Fireplace', hits: 4, solid: true, layer: 'fg', item: 'fireplace', restore: 8 },
  11: { name: 'Chandelier', hits: 7, solid: false, layer: 'fg', item: 'chandelier', restore: 8 },
  12: { name: 'Pepper', hits: 4, solid: true, layer: 'fg', item: 'pepper', restore: 8 },
  13: { name: 'Bedrock', hits: Infinity, solid: true, layer: 'fg', item: null, restore: 8 },
  14: { name: 'Sign', hits: 2, solid: false, layer: 'fg', item: 'sign', restore: 8, sign: true },
  15: { name: 'Glass Pane', hits: 2, solid: false, layer: 'bg', item: 'glass', restore: 1 },
  16: { name: 'Vending Machine', hits: Infinity, solid: true, layer: 'fg', item: 'vending', restore: 8, vending: true },
  17: { name: 'Weather Machine', hits: Infinity, solid: false, layer: 'fg', item: 'weather', restore: 8, weather: true },
  18: { name: 'Chest', hits: 2, solid: true, layer: 'fg', item: 'chest', restore: 8, chest: true },
  19: { name: 'Small Lock', hits: Infinity, solid: true, layer: 'fg', item: 'lock-small', restore: 8, lock: 'small' },
  20: { name: 'Big Lock', hits: Infinity, solid: true, layer: 'fg', item: 'lock-big', restore: 8, lock: 'big' },
  21: { name: 'Huge Lock', hits: Infinity, solid: true, layer: 'fg', item: 'lock-huge', restore: 8, lock: 'huge' },
  22: { name: 'World Lock', hits: Infinity, solid: true, layer: 'fg', item: 'lock-world', restore: 8, lock: 'world' },
};
// Bentuk area lock = tafsir (riset hanya memberi jumlah petak): kotak memanjang
// ke kanan-bawah dari petak lock, dipotong batas world.
const LOCK_DEFS = {
  small: { name: 'Small Lock', price: 50, w: 5, h: 2, tiles: 10, code: T_LOCK_S, item: 'lock-small' },
  big: { name: 'Big Lock', price: 200, w: 8, h: 6, tiles: 48, code: T_LOCK_B, item: 'lock-big' },
  huge: { name: 'Huge Lock', price: 500, w: 20, h: 10, tiles: 200, code: T_LOCK_H, item: 'lock-huge' },
  world: { name: 'World Lock', price: 2000, w: MW, h: MH, tiles: MW * MH, code: T_LOCK_W, item: 'lock-world' },
};

// ---------- Katalog item ----------
// rarity: angka riset (1, 2, 47, 87) atau tafsir (3, 5, 40) — lihat PRD.md.
// price: harga Store tetap (gems). gems: rentang gems panen (tafsir kecuali Pepper/Chandelier).
const ITEMS = {
  dirt: { name: 'Dirt', rarity: 1, price: 2, tile: T_DIRT, gems: [0, 1], desc: 'Blok tanah dasar. Tumbuh 31 detik.' },
  rock: { name: 'Rock', rarity: 1, price: 2, tile: T_ROCK, gems: [0, 1], desc: 'Blok batu dasar.' },
  wood: { name: 'Wood Block', rarity: 2, price: 4, tile: T_WOOD, gems: [0, 2], desc: 'Blok kayu.' },
  grass: { name: 'Grass', rarity: 2, price: 4, tile: T_GRASS, gems: [0, 2], desc: 'Blok rumput.' },
  brick: { name: 'Brick', rarity: 3, price: 8, tile: T_BRICK, gems: [0, 3], desc: 'Blok bata.' },
  door: { name: 'Door', rarity: 2, price: 8, tile: T_DOOR, gems: [0, 2], desc: 'Pukul untuk teleport ke pintu lain.' },
  lava: { name: 'Lava', rarity: 1, price: 4, tile: T_LAVA, gems: [0, 1], desc: 'Panas! Menyakiti yang menyentuhnya.' },
  cave: { name: 'Cave Background', rarity: 1, price: 2, tile: T_CAVE, gems: [0, 1], desc: 'Latar gua gelap.' },
  golden: { name: 'Golden Block', rarity: 40, price: 100, tile: T_GOLDEN, gems: [0, 16], desc: 'Blok emas berkilau.' },
  fireplace: { name: 'Fireplace', rarity: 5, price: 20, tile: T_FIREPLACE, gems: [0, 5], desc: 'Perapian hangat.' },
  chandelier: { name: 'Chandelier', rarity: 87, price: 500, tile: T_CHANDELIER, gems: [0, 22], desc: 'Lampu gantung megah. Tumbuh 7 hari lebih.' },
  pepper: { name: 'Pepper', rarity: 47, price: 100, tile: T_PEPPER, gems: [0, 12], desc: 'Cabai farmable. Tumbuh 1 hari lebih.' },
  sign: { name: 'Sign', rarity: 2, price: 8, tile: T_SIGN, gems: [0, 2], desc: 'Papan tulis. Wrench untuk mengedit teks.' },
  glass: { name: 'Glass Pane', rarity: 2, price: 8, tile: T_GLASS, gems: [0, 2], desc: 'Kaca latar tembus pandang.' },
  vending: { name: 'Vending Machine', rarity: 0, price: 8000, tile: T_VENDING, desc: 'Mesin jual. Isi barang, pasang harga WL.' },
  weather: { name: 'Weather Machine', rarity: 0, price: 1000, tile: T_WEATHER, desc: 'Pukul untuk mengganti cuaca world.' },
  chest: { name: 'Chest', rarity: 0, price: 50, tile: T_CHEST, desc: 'Peti penyimpanan world.' },
  'lock-small': { name: 'Small Lock', rarity: 0, price: 50, tile: T_LOCK_S, lock: 'small', desc: 'Mengunci 10 petak.' },
  'lock-big': { name: 'Big Lock', rarity: 0, price: 200, tile: T_LOCK_B, lock: 'big', desc: 'Mengunci 48 petak.' },
  'lock-huge': { name: 'Huge Lock', rarity: 0, price: 500, tile: T_LOCK_H, lock: 'huge', desc: 'Mengunci 200 petak.' },
  'lock-world': { name: 'World Lock', rarity: 0, price: 2000, tile: T_LOCK_W, lock: 'world', desc: 'Mengunci seluruh world. Mata uang player.' },
  'diamond-lock': { name: 'Diamond Lock', rarity: 0, price: 0, desc: 'Senilai 100 World Lock.' },
  'bluegem-lock': { name: 'Blue Gem Lock', rarity: 0, price: 0, desc: 'Senilai 100 Diamond Lock.' },
  brush: { name: 'Paintbrush', rarity: 0, price: 100, desc: 'Kuas. Harus dimiliki untuk mengecat blok.' },
  'paint-red': { name: 'Paint Bucket - Red', rarity: 0, price: 30, paint: '#e74c3c', desc: 'Cat merah untuk blok.' },
  'paint-yellow': { name: 'Paint Bucket - Yellow', rarity: 0, price: 30, paint: '#f1c40f', desc: 'Cat kuning untuk blok.' },
  'paint-green': { name: 'Paint Bucket - Green', rarity: 0, price: 30, paint: '#27ae60', desc: 'Cat hijau untuk blok.' },
  'paint-aqua': { name: 'Paint Bucket - Aqua', rarity: 0, price: 30, paint: '#1abc9c', desc: 'Cat aqua untuk blok.' },
  'paint-blue': { name: 'Paint Bucket - Blue', rarity: 0, price: 30, paint: '#2980b9', desc: 'Cat biru untuk blok.' },
  'paint-purple': { name: 'Paint Bucket - Purple', rarity: 0, price: 30, paint: '#8e44ad', desc: 'Cat ungu untuk blok.' },
  'paint-charcoal': { name: 'Paint Bucket - Charcoal', rarity: 0, price: 30, paint: '#2c3e50', desc: 'Cat arang untuk blok.' },
  varnish: { name: 'Varnish', rarity: 0, price: 30, paint: null, desc: 'Menghapus cat dari blok.' },
  'wotd-trophy': { name: 'WOTD Trophy', rarity: 0, price: 0, desc: 'Trofi World of the Day.' },
};
const SEED_ITEMS = ['dirt', 'rock', 'wood', 'grass', 'brick', 'door', 'lava', 'cave', 'golden', 'fireplace', 'chandelier', 'pepper', 'sign', 'glass'];
for (const id of SEED_ITEMS) {
  ITEMS['seed-' + id] = {
    name: ITEMS[id].name + ' Seed', rarity: ITEMS[id].rarity,
    price: { dirt: 5, rock: 5, lava: 8, cave: 5, wood: 10, grass: 10, door: 10, sign: 10, glass: 10, brick: 25, fireplace: 50, pepper: 200, golden: 500, chandelier: 2000 }[id],
    seed: true, seedOf: id, desc: 'Benih ' + ITEMS[id].name + '. Tanam di atas blok.',
  };
}
const STORE_ITEMS = Object.keys(ITEMS).filter(id => ITEMS[id].price > 0);

// ---------- Resep splice (10, pasangan tetap, urutan bebas) ----------
// 3 wajib dari riset: Dirt+Cave=Door, Dirt+Rock=Grass, Golden+Fireplace=Chandelier.
// Dirt+Lava=Wood, Rock+Lava=Glass, Rock+Cave=Sign juga dari riset; 4 sisanya tafsir.
const SPLICE_RECIPES = [
  { a: 'seed-dirt', b: 'seed-cave', out: 'seed-door', tier: 1 },
  { a: 'seed-dirt', b: 'seed-rock', out: 'seed-grass', tier: 1 },
  { a: 'seed-dirt', b: 'seed-lava', out: 'seed-wood', tier: 1 },
  { a: 'seed-rock', b: 'seed-lava', out: 'seed-glass', tier: 1 },
  { a: 'seed-rock', b: 'seed-cave', out: 'seed-sign', tier: 1 },
  { a: 'seed-grass', b: 'seed-rock', out: 'seed-brick', tier: 2 },
  { a: 'seed-wood', b: 'seed-lava', out: 'seed-fireplace', tier: 2 },
  { a: 'seed-wood', b: 'seed-brick', out: 'seed-pepper', tier: 2 },
  { a: 'seed-brick', b: 'seed-fireplace', out: 'seed-golden', tier: 3 },
  { a: 'seed-golden', b: 'seed-fireplace', out: 'seed-chandelier', tier: 3 },
];
function findSpliceRecipe(a, b) {
  return SPLICE_RECIPES.find(r => (r.a === a && r.b === b) || (r.a === b && r.b === a)) || null;
}

// ---------- Nama NPC, guild, broadcast (tafsir) ----------
const TRADER_NAMES = ['Bimo', 'Sari', 'Agus', 'Rina', 'Dedi', 'Maya', 'Joko', 'Tuti', 'Eko', 'Lina'];
const GUILD_POOL = ['Kiki', 'Farhan', 'Nadia', 'Rudi', 'Sinta', 'Bagas', 'Wulan', 'Hendra', 'Dewi', 'Fajar'];
const BROADCASTS = [
  'Selamat datang di Indotopia! Pukul blok, tanam benih, panen gems.',
  'Tips: splice dua benih di bibit yang sama untuk menemukan item baru.',
  'World Lock adalah mata uang player: 100 WL menjadi 1 DL.',
  'Kunci Inggris membuka dialog semua hal yang bisa diedit.',
  'Pohon rarity tinggi tumbuh lama tapi memberi lebih banyak gems.',
];
const WEATHERS = ['cerah', 'hujan', 'malam', 'salju'];
const BLOCKED_WORLD_NAMES = ['SETH', 'HAMUMU', 'ADMIN', 'GOD', 'SATAN', 'HITLER', 'SYSTEM', 'MODERATOR'];

// ---------- Util ----------
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function key(x, y) { return x + ',' + y; }
function hash2(x, y) { let h = (x * 374761393 + y * 668265263) | 0; h = (h ^ (h >> 13)) | 0; return ((h * 1274126177) | 0) >>> 0; }
function hashStr(s) { let h = 0; for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) | 0; return h >>> 0; }
function nowMs() { return S.nowOverride != null ? S.nowOverride : Date.now(); }
function growTimeMs(itemId) { const r = ITEMS[itemId].rarity; return (r * r * r + 30 * r) * 1000; }
function xpFor(rarity) { return 1 + Math.floor(rarity / 5); }
function fmtTime(ms) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  if (d > 0) return d + 'h ' + h + 'j ' + m + 'm';
  if (h > 0) return h + 'j ' + m + 'm ' + ss + 'd';
  if (m > 0) return m + 'm ' + ss + 'd';
  return ss + 'd';
}
function validWorldName(n) { return /^[A-Za-z0-9]{1,24}$/.test(n) && !BLOCKED_WORLD_NAMES.includes(n.toUpperCase()); }

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
  try {
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'square'; o.frequency.value = freq;
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, AC.currentTime + dur);
    g.gain.value = gain || 0.06;
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.connect(g); g.connect(AC.destination);
    o.start(); o.stop(AC.currentTime + dur);
  } catch (e) { /* abaikan */ }
}
const sfx = {
  jump() { blip(300, 0.12, 'square', 0.05, 520); },
  punch() { blip(140, 0.06, 'square', 0.07, 90); },
  punchMiss() { blip(220, 0.05, 'sine', 0.04, 160); },
  brk() { blip(90, 0.15, 'sawtooth', 0.08, 50); },
  place() { blip(220, 0.08, 'square', 0.06, 180); },
  plant() { blip(520, 0.1, 'sine', 0.06, 700); },
  harvest() { blip(660, 0.09, 'sine', 0.07, 990); },
  gem() { blip(880, 0.08, 'sine', 0.07); setTimeout(() => blip(1320, 0.12, 'sine', 0.07), 70); },
  splice() { blip(440, 0.1, 'triangle', 0.07, 880); setTimeout(() => blip(880, 0.14, 'triangle', 0.07, 1320), 90); },
  cash() { blip(1200, 0.07, 'square', 0.07); setTimeout(() => blip(1600, 0.07, 'square', 0.07), 80); setTimeout(() => blip(2000, 0.12, 'square', 0.07), 160); },
  levelup() { blip(523, 0.1, 'sine', 0.07); setTimeout(() => blip(659, 0.1, 'sine', 0.07), 90); setTimeout(() => blip(784, 0.16, 'sine', 0.07), 180); },
  error() { blip(160, 0.15, 'sawtooth', 0.06, 110); },
  click() { blip(500, 0.05, 'square', 0.04); },
  beep() { blip(990, 0.09, 'sine', 0.06); },
  lava() { blip(180, 0.2, 'sawtooth', 0.07, 60); },
  door() { blip(700, 0.08, 'sine', 0.06, 1100); },
};

// ---------- Generasi world ----------
// Riset: ~30 lapis tanah/latar gua/batu/lava, 6 lapis bedrock, lava di lapis
// 7-10 dari bawah, Main Door acak di permukaan dengan bedrock di bawahnya.
function surfAt(x) { return 14 + Math.round(Math.sin(x * 0.25) * 1 + (hash2(x, 3) % 3) - 1); }
function genWorld(name) {
  const fg = [], bg = [];
  for (let y = 0; y < MH; y++) { fg.push(new Array(MW).fill(T_EMPTY)); bg.push(new Array(MW).fill(T_EMPTY)); }
  for (let x = 0; x < MW; x++) {
    const s = surfAt(x);
    for (let y = s; y < MH; y++) {
      if (y >= MH - BEDROCK_ROWS) { fg[y][x] = T_BEDROCK; bg[y][x] = T_CAVE; }
      else if (y >= MH - 13 && y <= MH - 10 && hash2(x, y) % 6 === 0) { fg[y][x] = T_LAVA; bg[y][x] = T_CAVE; }
      else if (y < s + 24) { fg[y][x] = T_DIRT; bg[y][x] = T_CAVE; }
      else { fg[y][x] = (hash2(x, y) % 3 === 0) ? T_DIRT : T_ROCK; bg[y][x] = T_CAVE; }
    }
  }
  const doorX = 10 + (hashStr(name) % 80);
  const ds = surfAt(doorX);
  fg[ds - 1][doorX] = T_DOOR;
  fg[ds][doorX] = T_BEDROCK;
  return {
    name, fg, bg, trees: {}, locks: [], paint: {}, signs: {}, chest: {},
    vending: {}, weather: 'cerah', spawn: { tx: doorX, ty: ds - 1 }, createdAt: nowMs(),
  };
}

// ---------- State ----------
const S = {};
function initState(s) {
  s.worlds = {};
  s.world = genWorld('AWAL');
  s.worlds.AWAL = s.world;
  s.worldName = 'AWAL';
  s.px = (s.world.spawn.tx * TILE) + 16; s.py = s.world.spawn.ty * TILE + 4;
  s.vx = 0; s.vy = 0; s.face = 1; s.onGround = false; s.walk = 0;
  s.hp = 100; s.fireT = 0; s.hurtT = -9; s.healT = 0;
  s.cam = { x: 0, y: 0 }; s.zoom = 1;
  s.gems = 0; s.inv = { dirt: 10, 'seed-dirt': 10, 'seed-rock': 10 };
  s.favs = {}; s.sel = null; s.mode = 'fist';
  s.level = 1; s.xp = 0;
  s.roles = { farmer: { xp: 0, level: 1 }, builder: { xp: 0, level: 1 } };
  s.knownSplice = []; s.flags = {};
  s.tileHp = {}; s.tileHit = {};
  s.drops = []; s.gemDrops = [];
  s.parts = []; s.floats = []; s.chatLog = []; s.bubble = null;
  s.npc = null; s.trade = null; s.panel = null; s.selItem = null;
  s.guild = null; s.wotdClaimed = {}; s.lastPunch = -9; s.saveT = 0; s.rtime = 0;
  s.broadcastT = 120; s.broadcastIdx = 0; s.vendT = 40; s.guildT = 600;
  s.frozen = false; s.nowOverride = null; s.worldSelOpen = true;
  s.punchFx = null;
  spawnTrader();
}
function countItem(id) { return S.inv[id] || 0; }
function gainItem(id, qty) {
  S.inv[id] = (S.inv[id] || 0) + qty;
  if (S.inv[id] <= 0) delete S.inv[id];
}
function removeItem(id, qty) {
  if ((S.inv[id] || 0) < qty) return false;
  S.inv[id] -= qty;
  if (S.inv[id] <= 0) delete S.inv[id];
  return true;
}
function spawnTrader() {
  // Pedagang keliling: satu per world, berjalan di permukaan dekat spawn.
  const dayNum = Math.floor(nowMs() / 86400000);
  const name = TRADER_NAMES[(hashStr(S.worldName) + dayNum) % TRADER_NAMES.length];
  const tx = clamp(S.world.spawn.tx + 6, 2, MW - 3);
  S.npc = { name, tx, ty: surfAt(tx) - 1, dir: 1, moveT: 0, stockSeed: hashStr(S.worldName + ':' + dayNum) };
}
initState(S);

// ---------- DOM ----------
function $(id) { return document.getElementById(id); }
const canvas = $('game');
const ctx = canvas.getContext('2d');
const el = {
  panel: $('panel'), banner: $('banner'), chatlog: $('chatlog'), chatInput: $('chatInput'),
  hGemsN: $('hGemsN'), hName: $('hName'), hLevel: $('hLevel'), hWorld: $('hWorld'), hHp: $('hHp'),
  modeDock: $('modeDock'), hotSlot: $('hotSlot'),
  worldsel: $('worldsel'), wsName: $('wsName'), wsList: $('wsList'), wsWotd: $('wsWotd'),
};

// ---------- Efek: partikel dan teks melayang ----------
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
