'use strict';
/* Indotopia — versi kompleks. Canvas + JS polos, tanpa dependensi.
   Semua angka mengikuti PRD yang disetujui; jangan diubah diam-diam.
   "Makanan" di PRD = gandum: hasil panen dan drop monster masuk ke gandum,
   karena HUD versi kompleks tidak punya bahan "makanan" terpisah. */

// ---------- Konstanta ----------
const MW = 48, MH = 32, TILE = 32, VW = 960, VH = 640;
const DAY_LEN = 180, NIGHT_LEN = 90; // detik
const SAVE_KEY = 'indotopia-save-v1';
const TREE_HP = 3, TREE_YIELD = 3, TREE_RESPAWN = 60, TREE_GROW = 60, TREE_CAP = 80;
const ROCK_HP = 4, ROCK_YIELD = 2, ROCK_RESPAWN = 90;
const CROP_TIME = 30, CROP_YIELD = 2, CROP_COST = 1;
const HUT_COST = 20, HUT_TIME = 5;
const PLAYER_HP = 100, PLAYER_SPEED = 128; // 4 petak/detik
const MON_HP = 30, MON_ATK = 10, MON_SPEED = 48, MON_DMG = 15, REACH = 56;
const VILL_HP = 50, VILL_SPEED = 96, VILL_EAT = 3, BREAD_HEAL = 25;
const BALAI = { x: 22, y: 14, w: 3, h: 2 };
const SPAWN = { x: 24 * TILE + 16, y: 17 * TILE + 16 };
const DOOR = { x: 44, y: 5 }; // pintu dungeon di bukit
const TIERS = ['wooden', 'stone', 'iron', 'gold', 'diamond'];
const TIER_NAME = { wooden: 'Kayu', stone: 'Batu', iron: 'Besi', gold: 'Emas', diamond: 'Berlian' };
const SWORD_DMG = [15, 25, 40, 60, 100];
const ARMOR_PCT = [10, 20, 30, 40, 50];
const BOW_REACH = 4 * TILE, SHIELD_PCT = 20;
const CRAFT_COST = [
  { wood: 10 }, { wood: 10, stone: 10 }, { iron: 10, coal: 5 },
  { gold: 10, coal: 5 }, { diamond: 5, gold: 5 },
];
const BUILD = {
  hut: { name: 'Gubuk', cost: { wood: 20 }, time: 5, th: 1 },
  mine: { name: 'Tambang', cost: { wood: 30, stone: 10 }, time: 5, th: 1, hill: true },
  smith: { name: 'Toolsmith', cost: { wood: 40, stone: 20 }, time: 5, th: 2 },
  kitchen: { name: 'Dapur', cost: { wood: 30, stone: 10 }, time: 5, th: 1 },
  market: { name: 'Pasar', cost: { wood: 20 }, time: 5, th: 2 },
};
const HUT_UP = [null, { wood: 40, stone: 20 }, { wood: 80, stone: 40 }]; // ke tingkat 2 dan 3
const HUT_CAP = [0, 1, 2, 3];
const TH_UP = [null, null, { villagers: 5, wood: 100, stone: 50 }, { villagers: 10, wood: 200, stone: 100, iron: 20 }];
const JOB_COLOR = { wood: '#35b24a', mine: '#9a9a9a', farm: '#e8c53a', none: '#f27fb0' };
const JOB_NAME = { wood: 'Penebang', mine: 'Penambang', farm: 'Petani', none: 'Tanpa job' };
const RES_NAME = { wood: 'kayu', stone: 'batu', wheat: 'gandum', bread: 'roti', iron: 'iron', coal: 'coal', gold: 'gold', diamond: 'diamond' };

// ---------- Util ----------
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function key(x, y) { return x + ',' + y; }
function costText(c) { return Object.keys(c).map(k => c[k] + ' ' + RES_NAME[k]).join(' + '); }
function hasCost(c) { for (const k in c) if (S[k] < c[k]) return false; return true; }
function payCost(c) { for (const k in c) S[k] -= c[k]; }
function gainCost(c) { for (const k in c) S[k] += c[k]; }

// ---------- Suara: disintesis WebAudio, tanpa file ----------
let ac = null;
function audio() {
  if (ac) return ac;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ac = new AC();
  } catch (e) { return null; }
  return ac;
}
function tone(f, dur, type, vol, slide) {
  const c = audio(); if (!c) return;
  if (c.state === 'suspended') c.resume();
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || 'sine';
  o.frequency.setValueAtTime(f, c.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, c.currentTime + dur);
  g.gain.setValueAtTime(vol || 0.12, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
  o.connect(g); g.connect(c.destination);
  o.start(); o.stop(c.currentTime + dur);
}
const sfx = {
  chop() { tone(170, .09, 'square', .12, 90); },
  mine() { tone(820, .05, 'square', .09); tone(240, .07, 'triangle', .1); },
  plant() { tone(420, .12, 'sine', .1, 640); },
  harvest() { tone(520, .09, 'sine', .11); setTimeout(() => tone(780, .12, 'sine', .11), 70); },
  hit() { tone(150, .09, 'sawtooth', .13, 70); },
  die() { tone(400, .16, 'sawtooth', .11, 90); },
  hurt() { tone(95, .16, 'sawtooth', .14, 60); },
  place() { tone(220, .08, 'triangle', .13); },
  done() { [523, 659, 784].forEach((f, i) => setTimeout(() => tone(f, .14, 'sine', .12), i * 90)); },
  error() { tone(150, .13, 'square', .1, 110); },
  night() { tone(220, .4, 'sine', .09, 110); },
  dawn() { tone(392, .2, 'sine', .1, 587); },
  craft() { tone(660, .08, 'square', .1); setTimeout(() => tone(880, .1, 'square', .1), 80); },
  coin() { tone(990, .07, 'sine', .11); setTimeout(() => tone(1320, .09, 'sine', .11), 60); },
  eat() { tone(300, .08, 'triangle', .12, 200); },
  join() { [440, 554, 659].forEach((f, i) => setTimeout(() => tone(f, .12, 'sine', .12), i * 80)); },
};

// ---------- Dunia: tata letak tetap, sebaran acak berbibit ----------
function genWorld() {
  const ground = [];
  for (let y = 0; y < MH; y++) ground.push(new Array(MW).fill('g'));
  const rect = (x0, y0, x1, y1, t) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) ground[y][x] = t; };
  rect(20, 13, 27, 18, 'd'); // area desa
  rect(15, 16, 19, 16, 'd'); rect(28, 16, 32, 16, 'd'); // jalan
  rect(20, 20, 25, 22, 's'); // sawah
  rect(32, 3, 46, 28, 'r'); // bukit tambang
  rect(38, 24, 41, 27, 'w'); // kolam
  const rnd = mulberry32(20261115);
  const shade = [];
  for (let y = 0; y < MH; y++) { shade.push([]); for (let x = 0; x < MW; x++) shade[y].push(rnd()); }
  const trees = [], rocks = [];
  const far = (list, x, y, d) => list.every(e => Math.max(Math.abs(e.tx - x), Math.abs(e.ty - y)) >= d);
  let guard = 0;
  while (trees.length < 55 && guard++ < 3000) {
    const x = 2 + Math.floor(rnd() * 13), y = 3 + Math.floor(rnd() * 26);
    if (ground[y][x] !== 'g' || !far(trees, x, y, 2)) continue;
    trees.push({ tx: x, ty: y, hp: TREE_HP, respawn: 0, shake: 0, seed: rnd() });
  }
  guard = 0;
  while (rocks.length < 26 && guard++ < 3000) {
    const x = 33 + Math.floor(rnd() * 13), y = 4 + Math.floor(rnd() * 23);
    if (ground[y][x] !== 'r' || !far(rocks, x, y, 2)) continue;
    if (x === DOOR.x && y === DOOR.y) continue; // pintu dungeon harus kosong
    rocks.push({ tx: x, ty: y, hp: ROCK_HP, respawn: 0, shake: 0, seed: rnd() });
  }
  return { ground, shade, trees, rocks };
}
const WORLD = genWorld();

// ---------- State ----------
const S = {};
function initState(s) {
  s.px = SPAWN.x; s.py = SPAWN.y; s.hp = PLAYER_HP;
  s.face = { x: 0, y: 1 }; s.walk = 0; s.moving = false;
  // Gandum awal 5: tanpa benih, rantai tanam tidak bisa mulai sama sekali.
  s.wood = 0; s.stone = 0; s.wheat = 5; s.bread = 0;
  s.iron = 0; s.coal = 0; s.gold = 0; s.diamond = 0;
  s.day = 1; s.t = 0; s.phase = 'day'; s.rtime = 0; s.charge = false;
  s.monsters = []; s.parts = []; s.floats = [];
  s.buildings = []; s.crops = {}; s.tiles = {}; s.planted = [];
  s.villagers = []; s.popup = false; s.cookQ = [];
  s.th = 1; s.equip = { sword: 0, bow: 0, shield: 0, armor: 0, axe: 0, pick: 0 };
  s.buildMode = null; s.ghost = { x: 26, y: 14 }; s.ghostLock = null;
  s.panel = null; s.dun = null; s.returnPos = null;
  s.shake = 0; s.hurtT = 0; s.saveT = 0;
  s.flags = {};
  s.cam = { x: s.px, y: s.py };
  s.frozen = false;
  for (const t of WORLD.trees) { t.hp = TREE_HP; t.respawn = 0; t.shake = 0; }
  for (const r of WORLD.rocks) { r.hp = ROCK_HP; r.respawn = 0; r.shake = 0; }
}
initState(S);

// ---------- DOM ----------
const $ = id => document.getElementById(id);
const canvas = $('game'), ctx = canvas.getContext('2d');
const el = {
  wood: $('hWood'), stone: $('hStone'), wheat: $('hWheat'), bread: $('hBread'),
  iron: $('hIron'), coal: $('hCoal'), gold: $('hGold'), diamond: $('hDiamond'),
  vill: $('hVill'),
  hp: $('hHpFill'), hpTxt: $('hHp'), day: $('hDay'), phase: $('hPhase'), cyc: $('hCyc'),
  banner: $('banner'), buildbar: $('buildbar'), buildTxt: $('buildTxt'),
  btnBuild: $('btnBuild'), menu: $('menu'), panel: $('panel'), popup: $('popup'),
};

// ---------- Efek: partikel dan angka melayang ----------
function burst(x, y, color, n, spd) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, v = spd * (0.4 + Math.random() * 0.8);
    S.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, life: .5 + Math.random() * .3, max: .8, color, size: 2 + Math.random() * 3 });
  }
}
function addFloat(x, y, txt, color) { S.floats.push({ x, y, txt, color: color || '#fff', life: 1.1 }); }
let bannerTimer = 0;
function showBanner(txt) {
  el.banner.textContent = txt; el.banner.classList.add('show');
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => el.banner.classList.remove('show'), 2200);
}
function celebrate(x, y, txt) {
  const colors = ['#ffd94d', '#ff8a8a', '#8fce5a', '#6ab8ff', '#c9a7ff'];
  for (let i = 0; i < 36; i++) {
    const a = Math.random() * Math.PI * 2, v = 60 + Math.random() * 120;
    S.parts.push({ x, y: y - 10, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 80, life: .8 + Math.random() * .5, max: 1.3, color: colors[i % colors.length], size: 3 + Math.random() * 3 });
  }
  sfx.done();
  if (txt) addFloat(x, y - 30, txt, '#ffe27a');
}

// ---------- Tabrakan dan target ----------
function alive(e) { return e.respawn <= 0; }
function grown(p) { return p.grow <= 0; }
function treeAt(tx, ty) {
  for (const t of WORLD.trees) if (alive(t) && t.tx === tx && t.ty === ty) return t;
  for (const p of S.planted) if (grown(p) && p.tx === tx && p.ty === ty) return p;
  return null;
}
function rockAt(tx, ty) { for (const r of WORLD.rocks) if (alive(r) && r.tx === tx && r.ty === ty) return r; return null; }
function buildingAt(tx, ty) {
  for (const b of S.buildings) if (tx >= b.x && tx < b.x + 2 && ty >= b.y && ty < b.y + 2) return b;
  return null;
}
function inBalai(tx, ty) { return tx >= BALAI.x && tx < BALAI.x + BALAI.w && ty >= BALAI.y && ty < BALAI.y + BALAI.h; }
function isDoor(tx, ty) { return tx === DOOR.x && ty === DOOR.y; }
function tileSolid(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return true;
  if (WORLD.ground[ty][tx] === 'w') return true;
  if (inBalai(tx, ty) || isDoor(tx, ty)) return true;
  if (treeAt(tx, ty) || rockAt(tx, ty)) return true;
  if (buildingAt(tx, ty)) return true;
  return false;
}
function hitsSolid(x, y) {
  const r = 10;
  const x0 = Math.floor((x - r) / TILE), x1 = Math.floor((x + r) / TILE);
  const y0 = Math.floor((y - r) / TILE), y1 = Math.floor((y + r) / TILE);
  for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (tileSolid(tx, ty)) return true;
  return false;
}
function moveAxis(dx, dy) {
  if (S.dun) { moveAxisDun(dx, dy); return; }
  if (!hitsSolid(S.px + dx, S.py)) S.px += dx;
  if (!hitsSolid(S.px, S.py + dy)) S.py += dy;
}
function cropTile(tx, ty) {
  if (tx < 0 || ty < 0 || tx >= MW || ty >= MH) return false;
  return WORLD.ground[ty][tx] === 's' || S.tiles[key(tx, ty)] === 'farm';
}
// Tingkat alat menaikkan power: power = tingkat + 1, pohon/batu tumbang lebih cepat.

