'use strict';
/* Indotopia — versi kompleks. Canvas + JS polos, tanpa dependensi.
   Semua angka mengikuti PRD yang disetujui; jangan diubah diam-diam.
   "Makanan" di PRD = gandum: hasil panen dan drop monster masuk ke gandum,
   karena HUD versi kompleks tidak punya bahan "makanan" terpisah. */

// ---------- Konstanta ----------
const MW = 48, MH = 32, TILE = 32, VW = 960, VH = 640;
const DAY_LEN = 180, NIGHT_LEN = 90; // detik
const SAVE_KEY = 'indotopia-save-v1';
const TREE_HP = 3, TREE_YIELD = 3, TREE_RESPAWN = 60, TREE_GROW = 60;
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

// ---------- Aksi pemain ----------
function hitTree(t, power) {
  t.hp -= power || 1; t.shake = .35;
  burst(t.tx * TILE + 16, t.ty * TILE + 8, '#5cb84d', 6, 60);
  if (t.hp <= 0) {
    if (t.planted) S.planted.splice(S.planted.indexOf(t), 1);
    else t.respawn = TREE_RESPAWN;
    S.wood += TREE_YIELD;
    addFloat(t.tx * TILE + 16, t.ty * TILE, '+' + TREE_YIELD + ' kayu', '#ffd94d');
    sfx.harvest();
  } else sfx.chop();
}
function hitRock(r, power) {
  r.hp -= power || 1; r.shake = .35;
  burst(r.tx * TILE + 16, r.ty * TILE + 8, '#b8b8b8', 6, 60);
  if (r.hp <= 0) {
    r.respawn = ROCK_RESPAWN; S.stone += ROCK_YIELD;
    addFloat(r.tx * TILE + 16, r.ty * TILE, '+' + ROCK_YIELD + ' batu', '#e8e8e8');
    sfx.harvest();
  } else sfx.mine();
}
function harvestCrop(k) {
  const p = k.split(',').map(Number);
  delete S.crops[k]; S.wheat += CROP_YIELD;
  burst(p[0] * TILE + 16, p[1] * TILE + 16, '#8fce5a', 8, 60);
  addFloat(p[0] * TILE + 16, p[1] * TILE, '+' + CROP_YIELD + ' gandum', '#ffe27a');
  sfx.harvest();
}
function swordDmg() { return S.equip.sword > 0 ? SWORD_DMG[S.equip.sword - 1] : 10; }
function damageTaken(n) {
  // Armor dan perisai menumpuk secara perkalian, bukan penjumlahan.
  let d = n;
  if (S.equip.armor > 0) d *= 1 - ARMOR_PCT[S.equip.armor - 1] / 100;
  if (S.equip.shield > 0) d *= 1 - SHIELD_PCT / 100;
  return Math.max(1, Math.round(d));
}
function hitMonster(m, dmg) {
  // Pukulan pertama pemain di malam hari = aba-aba serang bareng warga.
  if (S.phase === 'night' && !S.dun) S.charge = true;
  m.hp -= dmg;
  const d = Math.hypot(m.x - S.px, m.y - S.py) || 1;
  m.x += (m.x - S.px) / d * 10; m.y += (m.y - S.py) / d * 10;
  S.shake = 6;
  burst(m.x, m.y, '#c9a7ff', 8, 80);
  addFloat(m.x, m.y - 20, '-' + dmg, '#fff');
  if (m.hp <= 0) {
    const list = S.dun ? S.dun.monsters : S.monsters;
    list.splice(list.indexOf(m), 1);
    dropLoot(m);
    burst(m.x, m.y, '#7a4a9e', 16, 100);
    sfx.die();
  } else sfx.hit();
}
function dropLoot(m) {
  const r = Math.random();
  let txt = '', color = '#9fe870';
  if (r < 0.5) {
    const ks = ['wood', 'stone', 'wheat'], k = ks[Math.floor(Math.random() * 3)];
    S[k] += 2; txt = '+2 ' + RES_NAME[k];
  } else if (r < 0.8) {
    const k = Math.random() < 0.5 ? 'iron' : 'coal';
    S[k] += 1; txt = '+1 ' + RES_NAME[k]; color = '#ffd94d';
  } else if (r < 0.95) {
    const n = 2 + Math.floor(Math.random() * 2), ks = ['wood', 'stone', 'wheat', 'iron', 'coal'];
    for (let i = 0; i < n; i++) S[ks[Math.floor(Math.random() * ks.length)]] += 1;
    txt = '+' + n + ' bahan'; color = '#ffd94d';
  } else {
    S.gold += 1; txt = '+1 gold!'; color = '#ffe27a';
  }
  addFloat(m.x, m.y - 20, txt, color);
}
function eatBread() {
  if (S.hp >= PLAYER_HP) { addFloat(S.px, S.py - 26, 'HP sudah penuh', '#ff8a8a'); return false; }
  if (S.bread < 1) { sfx.error(); addFloat(S.px, S.py - 26, 'Tidak ada roti', '#ff8a8a'); return false; }
  S.bread--; S.hp = Math.min(PLAYER_HP, S.hp + BREAD_HEAL);
  sfx.eat(); burst(S.px, S.py, '#ffd94d', 6, 50);
  addFloat(S.px, S.py - 26, '+' + BREAD_HEAL + ' HP', '#9fe870');
  return true;
}
function act() {
  if (S.buildMode) { tryPlace(); return; }
  if (S.dun) { actDungeon(); return; }
  const reach = S.equip.bow > 0 ? BOW_REACH : REACH;
  const dmg = S.equip.bow > 0 ? SWORD_DMG[S.equip.bow - 1] : swordDmg();
  let mBest = null, mD = reach;
  for (const m of S.monsters) { const d = Math.hypot(m.x - S.px, m.y - S.py); if (d < mD) { mD = d; mBest = m; } }
  if (mBest) { hitMonster(mBest, dmg); return; }
  let best = null, bd = REACH;
  const consider = (x, y, ref) => { const d = Math.hypot(x - S.px, y - S.py); if (d < bd) { bd = d; best = ref; } };
  for (const t of WORLD.trees) if (alive(t)) consider(t.tx * TILE + 16, t.ty * TILE + 16, { k: 'tree', e: t });
  for (const p of S.planted) if (grown(p)) consider(p.tx * TILE + 16, p.ty * TILE + 16, { k: 'tree', e: p });
  for (const r of WORLD.rocks) if (alive(r)) consider(r.tx * TILE + 16, r.ty * TILE + 16, { k: 'rock', e: r });
  for (const k in S.crops) if (S.crops[k].t >= CROP_TIME) { const p = k.split(',').map(Number); consider(p[0] * TILE + 16, p[1] * TILE + 16, { k: 'crop', key: k }); }
  if (best) {
    if (best.k === 'tree') hitTree(best.e, axePower());
    else if (best.k === 'rock') hitRock(best.e, pickPower());
    else harvestCrop(best.key);
    return;
  }
  const tx = Math.floor(S.px / TILE), ty = Math.floor(S.py / TILE);
  if (cropTile(tx, ty) && !S.crops[key(tx, ty)]) {
    if (S.wheat < CROP_COST) { sfx.error(); addFloat(S.px, S.py - 26, 'Butuh 1 gandum', '#ff8a8a'); return; }
    S.wheat -= CROP_COST;
    S.crops[key(tx, ty)] = { t: 0 };
    sfx.plant(); burst(S.px, S.py + 8, '#8fce5a', 6, 50);
  }
}

// ---------- Bangunan: taruh, naik tingkat, bongkar ----------
function ghostValid(gx, gy, kind) {
  const size = (kind === 'road' || kind === 'farm' || kind === 'tree' || kind === 'erase') ? 1 : 2;
  for (let y = gy; y < gy + size; y++) for (let x = gx; x < gx + size; x++) {
    if (x < 0 || y < 0 || x >= MW || y >= MH) return false;
    const g = WORLD.ground[y][x];
    if (kind === 'erase') {
      const t = S.tiles[key(x, y)];
      if (t !== 'road' && t !== 'farm') return false;
      continue;
    }
    if (g === 'w') return false;
    if (kind === 'mine') { if (g !== 'r') return false; }
    else if (kind === 'road' || kind === 'farm' || kind === 'tree') { if (g !== 'g') return false; }
    else if (g === 's') return false;
    if (inBalai(x, y) || isDoor(x, y)) return false;
    if (treeAt(x, y) || rockAt(x, y)) return false;
    if (buildingAt(x, y)) return false;
    if (S.tiles[key(x, y)]) return false;
    if (size === 2 && S.crops[key(x, y)]) return false;
  }
  return true;
}
function enterBuild(kind) {
  if (S.dun) return;
  S.buildMode = kind;
  closePanel(); closeMenu();
  S.ghost = {
    x: clamp(Math.floor(S.px / TILE) + S.face.x * 2, 0, MW - 2),
    y: clamp(Math.floor(S.py / TILE) + S.face.y * 2, 0, MH - 2),
  };
  refreshBuildbar();
  el.buildbar.hidden = false; el.btnBuild.classList.add('on');
}
function exitBuild() {
  S.buildMode = null;
  el.buildbar.hidden = true; el.btnBuild.classList.remove('on');
}
function refreshBuildbar() {
  const k = S.buildMode;
  let txt = '';
  if (BUILD[k]) txt = BUILD[k].name + ' — ' + costText(BUILD[k].cost);
  else if (k === 'road') txt = 'Jalan — gratis';
  else if (k === 'farm') txt = 'Lahan petani — gratis';
  else if (k === 'tree') txt = 'Tanam pohon — 1 kayu';
  else if (k === 'erase') txt = 'Hapus petak — gratis';
  el.buildTxt.textContent = txt + ' · ketuk AKSI untuk menaruh';
}
function tryPlace() {
  const kind = S.buildMode, gx = S.ghost.x, gy = S.ghost.y;
  const cx = gx * TILE + TILE, cy = gy * TILE + TILE;
  if (!ghostValid(gx, gy, kind)) { sfx.error(); addFloat(cx, cy - 20, 'Tidak bisa', '#ff8a8a'); return; }
  if (kind === 'road' || kind === 'farm') {
    S.tiles[key(gx, gy)] = kind;
    sfx.place(); burst(cx - 16, cy - 16, kind === 'road' ? '#b08a54' : '#8a5a33', 6, 50);
    return;
  }
  if (kind === 'erase') {
    delete S.tiles[key(gx, gy)];
    delete S.crops[key(gx, gy)];
    sfx.place(); burst(cx - 16, cy - 16, '#7cc24f', 6, 50);
    return;
  }
  if (kind === 'tree') {
    if (S.wood < 1) { sfx.error(); addFloat(cx, cy - 20, 'Butuh 1 kayu', '#ff8a8a'); return; }
    S.wood -= 1;
    S.planted.push({ tx: gx, ty: gy, hp: TREE_HP, respawn: 0, shake: 0, seed: Math.random(), planted: true, grow: TREE_GROW });
    sfx.plant(); burst(cx - 16, cy - 16, '#5cb84d', 6, 50);
    return;
  }
  const def = BUILD[kind];
  if (!def) return;
  if (S.th < def.th) { sfx.error(); addFloat(cx, cy - 20, 'Butuh townhall tingkat ' + def.th, '#ff8a8a'); return; }
  if (!hasCost(def.cost)) { sfx.error(); addFloat(cx, cy - 20, 'Butuh ' + costText(def.cost), '#ff8a8a'); return; }
  payCost(def.cost);
  S.buildings.push({ type: kind, x: gx, y: gy, level: 1, prog: 0, built: false, invested: Object.assign({}, def.cost) });
  sfx.place();
  burst(cx, cy, '#d9a066', 8, 60);
}
function buildingName(b) {
  if (b.type !== 'hut') return BUILD[b.type].name;
  return ['?', 'Gubuk', 'Rumah', 'Rumah Besar'][b.level];
}
function upgradeBuilding(b) {
  if (b.type !== 'hut' || b.level >= 3 || !b.built) return false;
  const cost = HUT_UP[b.level];
  if (!hasCost(cost)) { sfx.error(); return false; }
  payCost(cost);
  for (const k in cost) b.invested[k] = (b.invested[k] || 0) + cost[k];
  b.level++; b.built = false; b.prog = 0;
  sfx.place();
  return true;
}
function demolishBuilding(b) {
  // Kembali setengah dari semua bahan yang pernah ditanam di bangunan ini.
  const refund = {};
  for (const k in b.invested) refund[k] = Math.floor(b.invested[k] / 2);
  gainCost(refund);
  S.buildings.splice(S.buildings.indexOf(b), 1);
  burst(b.x * TILE + TILE, b.y * TILE + TILE, '#b08a54', 10, 70);
  sfx.place();
  if (b.type === 'hut') rehouseVillagers();
  return refund;
}
function houseCapacity() {
  let cap = 0;
  for (const b of S.buildings) if (b.type === 'hut' && b.built) cap += HUT_CAP[b.level];
  return cap;
}
function rehouseVillagers() {
  // Warga yang rumahnya dibongkar pindah ke rumah kosong; kalau tidak ada, pergi.
  for (const v of S.villagers) {
    if (v.home && S.buildings.includes(v.home) && v.home.built) continue;
    v.home = findFreeHouse();
    if (!v.home) {
      addFloat(v.x, v.y - 26, 'Pergi...', '#ff8a8a');
      S.villagers.splice(S.villagers.indexOf(v), 1);
    }
  }
}
function findFreeHouse() {
  for (const b of S.buildings) {
    if (b.type !== 'hut' || !b.built) continue;
    const used = S.villagers.filter(v => v.home === b).length;
    if (used < HUT_CAP[b.level]) return b;
  }
  return null;
}
function celebrateBuilding(b) {
  celebrate(b.x * TILE + TILE, b.y * TILE + TILE, buildingName(b) + ' selesai!');
  if (b.type === 'hut' && !S.flags.hut1) { S.flags.hut1 = true; showBanner('Gubuk pertama selesai!'); }
}

// ---------- Warga ----------
function axePower() { return S.equip.axe + 1; }
function pickPower() { return S.equip.pick + 1; }
function spawnVillager() {
  const home = findFreeHouse();
  if (!home) return null;
  const v = {
    x: BALAI.x * TILE + 40 + Math.random() * 20, y: (BALAI.y + 2) * TILE + 10,
    job: 'none', hp: VILL_HP, home, fed: true, dead: false,
    hitCd: 0, prodT: 0, prodN: 0, phase: Math.random() * 6, walk: 0,
    face: { x: 0, y: 1 }, moving: false,
  };
  S.villagers.push(v);
  return v;
}
function acceptVillager() {
  S.popup = false; el.popup.hidden = true;
  const v = spawnVillager();
  if (!v) { addFloat(S.px, S.py - 26, 'Tidak ada rumah kosong', '#ff8a8a'); return false; }
  sfx.join();
  celebrate(v.x, v.y, 'Warga baru bergabung!');
  return true;
}
function declineVillager() {
  S.popup = false; el.popup.hidden = true;
  addFloat(S.px, S.py - 26, 'Warga itu pergi', '#c9c9c9');
}
function setJob(v, job) {
  v.job = job; v.prodT = 0;
  addFloat(v.x, v.y - 26, JOB_NAME[job], JOB_COLOR[job]);
  sfx.place();
}
function feedVillager(v) {
  if (v.dead) return false;
  if (S.bread < 1) { addFloat(v.x, v.y - 26, 'Tidak ada roti', '#ff8a8a'); return false; }
  if (v.fed && v.hp >= VILL_HP) return false;
  S.bread--; v.fed = true; v.hp = Math.min(VILL_HP, v.hp + BREAD_HEAL);
  sfx.eat(); burst(v.x, v.y, '#ffd94d', 6, 50);
  addFloat(v.x, v.y - 26, '+' + BREAD_HEAL + ' HP', '#9fe870');
  return true;
}
function feedAllVillagers() {
  let n = 0;
  for (const v of S.villagers) {
    if (S.bread < 1) break;
    if (feedVillager(v)) n++;
  }
  if (n === 0) addFloat(S.px, S.py - 30, S.bread < 1 ? 'Tidak ada roti' : 'Semua warga sudah kenyang', '#ffe27a');
  return n;
}
function moveToward(v, tx, ty, dt) {
  const dx = tx - v.x, dy = ty - v.y, d = Math.hypot(dx, dy);
  if (d < 4) { v.moving = false; return true; }
  const step = Math.min(d, VILL_SPEED * dt);
  v.x += dx / d * step; v.y += dy / d * step;
  v.moving = true; v.walk += dt * 10;
  v.face = { x: Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : 0, y: Math.abs(dy) >= Math.abs(dx) ? Math.sign(dy) : 0 };
  return false;
}
function nearestTree(x, y, skip) {
  let best = null, bd = 1e9;
  const consider = e => { if (skip && skip(e)) return; const d = Math.hypot(e.tx * TILE + 16 - x, e.ty * TILE + 16 - y); if (d < bd) { bd = d; best = e; } };
  for (const t of WORLD.trees) if (alive(t)) consider(t);
  for (const p of S.planted) if (grown(p)) consider(p);
  return best;
}
function nearestRock(x, y, skip) {
  let best = null, bd = 1e9;
  for (const r of WORLD.rocks) if (alive(r)) {
    if (skip && skip(r)) continue;
    const d = Math.hypot(r.tx * TILE + 16 - x, r.ty * TILE + 16 - y);
    if (d < bd) { bd = d; best = r; }
  }
  return best;
}
// Target yang sedang dikerjakan warga lain tidak diambil: tiap warga mencari target lain.
function targetTaken(v, key) {
  for (const o of S.villagers) if (o !== v && o.target === key) return true;
  return false;
}
function villagerWork(v, dt) {
  if (v.job === 'wood') {
    const t = nearestTree(v.x, v.y, e => targetTaken(v, 't:' + e.tx + ',' + e.ty));
    v.target = t ? 't:' + t.tx + ',' + t.ty : null;
    if (!t) return;
    const cx = t.tx * TILE + 16, cy = t.ty * TILE + 16;
    if (Math.hypot(cx - v.x, cy - v.y) > 44) { moveToward(v, cx, cy, dt); return; }
    v.moving = false; v.hitCd -= dt;
    if (v.hitCd <= 0) { v.hitCd = 1; hitTree(t, axePower()); }
  } else if (v.job === 'mine') {
    const mine = S.buildings.find(b => b.type === 'mine' && b.built);
    if (mine) {
      v.target = null;
      const cx = mine.x * TILE + TILE, cy = mine.y * TILE + TILE;
      if (Math.hypot(cx - v.x, cy - v.y) > 52) { moveToward(v, cx, cy, dt); return; }
      v.moving = false; v.prodT += dt;
      if (v.prodT >= 10) {
        v.prodT = 0; v.prodN++;
        if (v.prodN % 5 === 0) {
          const k = Math.random() < 0.5 ? 'iron' : 'coal';
          S[k]++; addFloat(cx, cy - 20, '+1 ' + RES_NAME[k], '#ffd94d');
        } else {
          S.stone++; addFloat(cx, cy - 20, '+1 batu', '#e8e8e8');
        }
        burst(cx, cy, '#b8b8b8', 4, 40); sfx.mine();
      }
      return;
    }
    const r = nearestRock(v.x, v.y, e => targetTaken(v, 'r:' + e.tx + ',' + e.ty));
    v.target = r ? 'r:' + r.tx + ',' + r.ty : null;
    if (!r) return;
    const cx = r.tx * TILE + 16, cy = r.ty * TILE + 16;
    if (Math.hypot(cx - v.x, cy - v.y) > 44) { moveToward(v, cx, cy, dt); return; }
    v.moving = false; v.hitCd -= dt;
    if (v.hitCd <= 0) { v.hitCd = 1; hitRock(r, pickPower()); }
  } else if (v.job === 'farm') {
    let ripe = null, rd = 1e9, empty = null, ed = 1e9;
    for (const k in S.crops) {
      const p = k.split(',').map(Number);
      if (S.crops[k].t < CROP_TIME) continue;
      if (targetTaken(v, 'c:' + k)) continue;
      const d = Math.hypot(p[0] * TILE + 16 - v.x, p[1] * TILE + 16 - v.y);
      if (d < rd) { rd = d; ripe = k; }
    }
    if (ripe) {
      v.target = 'c:' + ripe;
      const p = ripe.split(',').map(Number);
      if (moveToward(v, p[0] * TILE + 16, p[1] * TILE + 16, dt)) harvestCrop(ripe);
      return;
    }
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      if (!cropTile(x, y) || S.crops[key(x, y)] || targetTaken(v, 'p:' + x + ',' + y)) continue;
      const d = Math.hypot(x * TILE + 16 - v.x, y * TILE + 16 - v.y);
      if (d < ed) { ed = d; empty = { x, y }; }
    }
    if (!empty || S.wheat < CROP_COST) { v.target = null; return; }
    v.target = 'p:' + empty.x + ',' + empty.y;
    if (moveToward(v, empty.x * TILE + 16, empty.y * TILE + 16, dt)) {
      S.wheat -= CROP_COST;
      S.crops[key(empty.x, empty.y)] = { t: 0 };
      sfx.plant(); burst(v.x, v.y + 8, '#8fce5a', 4, 40);
    }
  }
}
function villagerFight(v, dt) {
  let best = null, bd = 1e9;
  for (const m of S.monsters) { const d = Math.hypot(m.x - v.x, m.y - v.y); if (d < bd) { bd = d; best = m; } }
  if (!best) {
    moveToward(v, BALAI.x * TILE + 48, BALAI.y * TILE + 48, dt);
    return;
  }
  // Belum ada aba-aba: kumpul di townhall, lawan hanya kalau monster sudah di depan mata.
  if (!S.charge && bd > 48) {
    moveToward(v, BALAI.x * TILE + 48, BALAI.y * TILE + 48, dt);
    return;
  }
  if (bd > 44) { moveToward(v, best.x, best.y, dt); return; }
  v.moving = false; v.hitCd -= dt;
  if (v.hitCd <= 0) {
    v.hitCd = 1;
    best.hp -= swordDmg();
    burst(best.x, best.y, '#c9a7ff', 5, 60);
    addFloat(best.x, best.y - 20, '-' + swordDmg(), '#fff');
    if (best.hp <= 0) {
      S.monsters.splice(S.monsters.indexOf(best), 1);
      dropLoot(best);
      burst(best.x, best.y, '#7a4a9e', 14, 90);
      sfx.die();
    } else sfx.hit();
  }
}
function hurtVillager(v, n) {
  v.hp -= n;
  addFloat(v.x, v.y - 26, '-' + n, '#ff7a7a');
  burst(v.x, v.y, '#ff8a8a', 5, 60);
  if (v.hp <= 0) {
    v.dead = true; v.hp = 0;
    burst(v.x, v.y, '#f27fb0', 14, 80);
    addFloat(v.x, v.y - 26, 'Warga tumbang!', '#ff8a8a');
  }
}
function updateVillagers(dt) {
  for (const v of S.villagers) {
    if (v.dead) { v.target = null; continue; }
    v.phase += dt * 6;
    v.target = null;
    if (S.phase === 'night' && !S.dun) {
      // Warga lapar diam di rumah: tidak kerja, tidak bertarung.
      if (v.fed) villagerFight(v, dt);
      else moveToward(v, v.home ? v.home.x * TILE + TILE : v.x, v.home ? v.home.y * TILE + TILE : v.y, dt);
    } else if (S.phase === 'day' && v.fed && v.job !== 'none') {
      villagerWork(v, dt);
    } else if (v.home) {
      moveToward(v, v.home.x * TILE + TILE + 20, v.home.y * TILE + TILE + 20, dt);
    }
  }
  for (let i = 0; i < S.villagers.length; i++) for (let j = i + 1; j < S.villagers.length; j++) {
    const a = S.villagers[i], b = S.villagers[j];
    if (a.dead || b.dead) continue;
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d > 0 && d < 24) {
      const push = (24 - d) / 2;
      a.x -= dx / d * push; a.y -= dy / d * push;
      b.x += dx / d * push; b.y += dy / d * push;
    }
  }
}
function onDawn() {
  for (const v of S.villagers) {
    if (v.dead) {
      v.dead = false; v.hp = VILL_HP;
      if (v.home) { v.x = v.home.x * TILE + TILE; v.y = v.home.y * TILE + TILE; }
    }
    if (S.bread >= VILL_EAT) { S.bread -= VILL_EAT; v.fed = true; }
    else v.fed = false;
  }
  if (!S.popup && findFreeHouse()) {
    S.popup = true; el.popup.hidden = false;
    sfx.join();
  }
}

// ---------- Townhall ----------
function upgradeTownhall() {
  if (S.th >= 3) return false;
  const req = TH_UP[S.th + 1];
  if (S.villagers.length < req.villagers) { sfx.error(); return false; }
  const cost = {};
  for (const k in req) if (k !== 'villagers') cost[k] = req[k];
  if (!hasCost(cost)) { sfx.error(); return false; }
  payCost(cost);
  S.th++;
  celebrate(BALAI.x * TILE + 48, BALAI.y * TILE + 24, 'Townhall tingkat ' + S.th + '!');
  showBanner('Townhall naik ke tingkat ' + S.th + '!');
  return true;
}

// ---------- Toolsmith, Dapur, Pasar ----------
function craftItem(kind, tier) {
  if (tier >= 3 && S.th < 3) { sfx.error(); return false; } // gold/diamond butuh townhall 3
  if (kind === 'shield') {
    if (S.equip.shield > 0) { sfx.error(); return false; }
    const cost = { wood: 10, stone: 10 };
    if (!hasCost(cost)) { sfx.error(); return false; }
    payCost(cost); S.equip.shield = 1;
  } else {
    if (tier < S.equip[kind]) { sfx.error(); return false; }
    const cost = CRAFT_COST[tier];
    if (!hasCost(cost)) { sfx.error(); return false; }
    payCost(cost); S.equip[kind] = tier + 1;
  }
  sfx.craft();
  const names = { sword: 'Pedang', bow: 'Bow', shield: 'Perisai', armor: 'Armor', axe: 'Kapak', pick: 'Beliung' };
  addFloat(S.px, S.py - 30, names[kind] + ' ' + (kind === 'shield' ? '' : TIER_NAME[TIERS[tier]]), '#ffe27a');
  if (!S.flags.craft1) { S.flags.craft1 = true; showBanner('Senjata pertama dibuat!'); }
  return true;
}
function cookBread(n) {
  n = Math.min(n || 1, S.wheat);
  if (n < 1) { sfx.error(); return false; }
  S.wheat -= n;
  for (let i = 0; i < n; i++) S.cookQ.push({ t: 5 });
  sfx.place();
  return true;
}
function tradeMarket(give, get, n) {
  n = Math.min(n || 1, Math.floor(S[give] / 2));
  if (give === get || n < 1) { sfx.error(); return false; }
  S[give] -= 2 * n; S[get] += n;
  sfx.coin();
  addFloat(S.px, S.py - 30, (2 * n) + ' ' + RES_NAME[give] + ' → ' + n + ' ' + RES_NAME[get], '#ffe27a');
  return true;
}

// ---------- Monster dan malam ----------
function spawnWave() {
  const n = 2 + S.day; // malam pertama 3, tiap malam tambah 1
  for (let i = 0; i < n; i++) {
    const side = Math.floor(Math.random() * 4);
    let tx, ty;
    if (side === 0) { tx = 1 + Math.floor(Math.random() * (MW - 2)); ty = 1; }
    else if (side === 1) { tx = 1 + Math.floor(Math.random() * (MW - 2)); ty = MH - 2; }
    else if (side === 2) { tx = 1; ty = 1 + Math.floor(Math.random() * (MH - 2)); }
    else { tx = MW - 2; ty = 1 + Math.floor(Math.random() * (MH - 2)); }
    S.monsters.push({ x: tx * TILE + 16, y: ty * TILE + 16, hp: MON_HP, maxHp: MON_HP, atk: MON_ATK, atkCd: 0, phase: Math.random() * 6, color: '#7a4a9e' });
  }
  sfx.night();
  addFloat(S.px, S.py - 30, 'Malam tiba — ' + n + ' monster datang!', '#c9a7ff');
}
function hurtPlayer(n) {
  S.hp -= n; S.hurtT = .3; S.shake = 8; sfx.hurt();
  addFloat(S.px, S.py - 26, '-' + n, '#ff7a7a');
  if (S.hp <= 0) {
    S.hp = PLAYER_HP;
    if (S.dun) { exitDungeon(); }
    S.px = SPAWN.x; S.py = SPAWN.y;
    for (const m of S.monsters) {
      const dx = m.x - S.px, dy = m.y - S.py, d = Math.hypot(dx, dy) || 1;
      m.x = clamp(S.px + dx / d * 260, 16, MW * TILE - 16);
      m.y = clamp(S.py + dy / d * 260, 16, MH * TILE - 16);
      m.atkCd = 1;
    }
    addFloat(S.px, S.py - 30, 'Kamu bangun lagi', '#ffe27a');
  }
}
function updateMonsters(dt) {
  const list = S.dun ? S.dun.monsters : S.monsters;
  for (const m of list) {
    let tx = S.px, ty = S.py, target = null;
    if (!S.dun) {
      let bd = Math.hypot(S.px - m.x, S.py - m.y);
      for (const v of S.villagers) {
        if (v.dead) continue;
        const d = Math.hypot(v.x - m.x, v.y - m.y);
        if (d < bd) { bd = d; tx = v.x; ty = v.y; target = v; }
      }
    }
    const dx = tx - m.x, dy = ty - m.y, d = Math.hypot(dx, dy) || 1;
    m.x += dx / d * MON_SPEED * dt; m.y += dy / d * MON_SPEED * dt;
    m.phase += dt * 6; m.atkCd -= dt;
    if (d < 36 && m.atkCd <= 0) {
      m.atkCd = 1;
      if (target) hurtVillager(target, damageTaken(m.atk));
      else hurtPlayer(damageTaken(m.atk));
    }
  }
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i], b = list[j];
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d > 0 && d < 26) {
      const push = (26 - d) / 2;
      a.x -= dx / d * push; a.y -= dy / d * push;
      b.x += dx / d * push; b.y += dy / d * push;
    }
  }
}
function darkness() {
  if (S.dun) return .3;
  if (S.phase === 'day') { const rem = DAY_LEN - S.t; return rem < 5 ? .45 * (1 - rem / 5) : 0; }
  const into = S.t - DAY_LEN, rem = NIGHT_LEN - into;
  if (into < 5) return .45 * into / 5;
  if (rem < 5) return .45 * rem / 5;
  return .45;
}

// ---------- Dungeon ----------
const DUN_W = 26, DUN_H = 18;
const DUN_MON = [null, { hp: 50, atk: 15 }, { hp: 100, atk: 25 }, { hp: 200, atk: 40 }];
const DUN_COLOR = [null, '#7a4a9e', '#9e4a5e', '#b03030'];
function genDungeon(floor) {
  const ground = [];
  for (let y = 0; y < DUN_H; y++) ground.push(new Array(DUN_W).fill('f'));
  for (let x = 0; x < DUN_W; x++) { ground[0][x] = 'w'; ground[DUN_H - 1][x] = 'w'; }
  for (let y = 0; y < DUN_H; y++) { ground[y][0] = 'w'; ground[y][DUN_W - 1] = 'w'; }
  const pillars = [[6, 5], [19, 5], [6, 12], [19, 12]];
  for (const p of pillars) for (let y = p[1]; y < p[1] + 2; y++) for (let x = p[0]; x < p[0] + 2; x++) ground[y][x] = 'w';
  const exit = { x: 13, y: 15 }, stairs = floor < 3 ? { x: 13, y: 2 } : null;
  const chest = { x: 3, y: 3, opened: false };
  const monsters = [];
  const n = 3 + floor * 2;
  let guard = 0;
  while (monsters.length < n && guard++ < 500) {
    const x = 2 + Math.floor(Math.random() * (DUN_W - 4)), y = 2 + Math.floor(Math.random() * (DUN_H - 4));
    if (ground[y][x] !== 'f') continue;
    if (Math.hypot(x - exit.x, y - exit.y) < 5) continue;
    monsters.push({
      x: x * TILE + 16, y: y * TILE + 16,
      hp: DUN_MON[floor].hp, maxHp: DUN_MON[floor].hp, atk: DUN_MON[floor].atk,
      atkCd: 0, phase: Math.random() * 6, color: DUN_COLOR[floor],
    });
  }
  return { floor, ground, monsters, chests: [chest], stairs, exit, exitArmed: false, stairMsgT: 0 };
}
function enterDungeon() {
  if (S.equip.sword < 1) {
    sfx.error();
    addFloat(S.px, S.py - 30, 'Butuh senjata dulu', '#ff8a8a');
    return false;
  }
  S.returnPos = { x: S.px, y: S.py };
  S.dun = genDungeon(1);
  S.px = S.dun.exit.x * TILE + 16; S.py = S.dun.exit.y * TILE + 16;
  S.cam.x = DUN_W * TILE / 2; S.cam.y = DUN_H * TILE / 2;
  closePanel();
  showBanner('Dungeon lantai 1');
  sfx.night();
  return true;
}
function exitDungeon() {
  S.dun = null;
  if (S.returnPos) { S.px = S.returnPos.x; S.py = S.returnPos.y; }
  S.cam.x = S.px; S.cam.y = S.py;
}
function dunSolid(tx, ty, d) {
  if (tx < 0 || ty < 0 || tx >= DUN_W || ty >= DUN_H) return true;
  if (d.ground[ty][tx] === 'w') return true;
  for (const c of d.chests) if (!c.opened && c.x === tx && c.y === ty) return true;
  return false;
}
function moveAxisDun(dx, dy) {
  const d = S.dun, r = 10;
  const solidAt = (x, y) => {
    const x0 = Math.floor((x - r) / TILE), x1 = Math.floor((x + r) / TILE);
    const y0 = Math.floor((y - r) / TILE), y1 = Math.floor((y + r) / TILE);
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (dunSolid(tx, ty, d)) return true;
    return false;
  };
  if (!solidAt(S.px + dx, S.py)) S.px += dx;
  if (!solidAt(S.px, S.py + dy)) S.py += dy;
}
function lootChest(c) {
  const f = S.dun.floor;
  c.opened = true;
  const gains = [];
  const add = (k, n) => { S[k] += n; gains.push('+' + n + ' ' + RES_NAME[k]); };
  if (f === 1) {
    const ks = ['wood', 'stone', 'wheat', 'iron', 'coal'];
    for (let i = 0; i < 3; i++) add(ks[Math.floor(Math.random() * ks.length)], 2);
    if (Math.random() < 0.25) add('gold', 1);
  } else if (f === 2) {
    add('iron', 3); add('coal', 3); add('gold', 1 + Math.floor(Math.random() * 2));
  } else {
    add('diamond', 1 + Math.floor(Math.random() * 2)); add('gold', 2 + Math.floor(Math.random() * 2));
  }
  burst(c.x * TILE + 16, c.y * TILE + 16, '#ffd94d', 14, 80);
  addFloat(c.x * TILE + 16, c.y * TILE, gains.join('  '), '#ffe27a');
  sfx.coin();
}
function actDungeon() {
  const d = S.dun;
  const reach = S.equip.bow > 0 ? BOW_REACH : REACH;
  const dmg = S.equip.bow > 0 ? SWORD_DMG[S.equip.bow - 1] : swordDmg();
  let mBest = null, mD = reach;
  for (const m of d.monsters) { const dd = Math.hypot(m.x - S.px, m.y - S.py); if (dd < mD) { mD = dd; mBest = m; } }
  if (mBest) { hitMonster(mBest, dmg); return; }
  for (const c of d.chests) {
    if (c.opened) continue;
    if (Math.hypot(c.x * TILE + 16 - S.px, c.y * TILE + 16 - S.py) < REACH + 10) { lootChest(c); return; }
  }
}
function updateDungeon(dt) {
  const d = S.dun;
  if (d.stairMsgT > 0) d.stairMsgT -= dt;
  const ex = d.exit.x * TILE + 16, ey = d.exit.y * TILE + 16;
  if (!d.exitArmed && Math.hypot(ex - S.px, ey - S.py) > 60) d.exitArmed = true;
  if (d.exitArmed && Math.hypot(ex - S.px, ey - S.py) < 24) { exitDungeon(); addFloat(S.px, S.py - 30, 'Kembali ke desa', '#ffe27a'); return; }
  if (d.stairs) {
    const sx = d.stairs.x * TILE + 16, sy = d.stairs.y * TILE + 16;
    if (Math.hypot(sx - S.px, sy - S.py) < 24) {
      const need = d.floor + 1; // lantai 2 butuh stone, lantai 3 butuh iron
      if (S.equip.sword >= need) {
        S.dun = genDungeon(d.floor + 1);
        S.px = S.dun.exit.x * TILE + 16; S.py = S.dun.exit.y * TILE + 16;
        showBanner('Dungeon lantai ' + S.dun.floor);
        sfx.night();
      } else if (d.stairMsgT <= 0) {
        d.stairMsgT = 2;
        sfx.error();
        addFloat(S.px, S.py - 30, 'Butuh pedang ' + TIER_NAME[TIERS[need - 1]], '#ff8a8a');
      }
    }
  }
}

// ---------- Panel dan menu ----------
function openPanel(p) { S.panel = p; renderPanel(); el.panel.hidden = false; }
function closePanel() { S.panel = null; el.panel.hidden = true; }
function openMenu() { closePanel(); refreshMenu(); el.menu.hidden = false; }
function closeMenu() { el.menu.hidden = true; }
function refreshMenu() {
  const btns = el.menu.querySelectorAll ? el.menu.querySelectorAll('button[data-build]') : [];
  for (const b of btns) {
    const k = b.getAttribute('data-build');
    const def = BUILD[k];
    const locked = def && S.th < def.th;
    b.disabled = !!locked;
    let txt = b.getAttribute('data-name');
    if (def) txt += ' — ' + costText(def.cost);
    else if (k === 'tree') txt += ' — 1 kayu';
    else txt += ' — gratis';
    if (locked) txt += ' [butuh TH ' + def.th + ']';
    b.textContent = txt;
  }
}
function renderPanel() {
  const p = S.panel;
  if (!p) return;
  let h = '';
  if (p.kind === 'townhall') {
    h += '<h3>Townhall — tingkat ' + S.th + '</h3>';
    h += '<p>Warga: ' + S.villagers.length + ' · Kapasitas rumah: ' + houseCapacity() + '</p>';
    if (S.th < 3) {
      const req = TH_UP[S.th + 1];
      h += '<p>Naik ke tingkat ' + (S.th + 1) + ' butuh: ' + req.villagers + ' warga, ' + costText({ wood: req.wood, stone: req.stone, iron: req.iron }) + '</p>';
      h += '<button data-act="th-up">Naik Tingkat</button>';
    } else h += '<p>Tingkat tertinggi.</p>';
    h += '<button data-act="feed-all">Beri Roti Semua Warga (1 roti per warga)</button>';
    h += '<p>Tingkat 2 membuka Toolsmith dan Pasar. Tingkat 3 membuka kerajinan gold dan diamond.</p>';
  } else if (p.kind === 'building') {
    const b = p.ref;
    h += '<h3>' + buildingName(b) + (b.type === 'hut' ? ' — tingkat ' + b.level : '') + '</h3>';
    if (!b.built) h += '<p>Sedang dibangun...</p>';
    if (b.type === 'hut' && b.built) {
      const used = S.villagers.filter(v => v.home === b).length;
      h += '<p>Menampung ' + used + '/' + HUT_CAP[b.level] + ' warga.</p>';
      if (b.level < 3) h += '<button data-act="upgrade">Naik Tingkat — ' + costText(HUT_UP[b.level]) + '</button>';
    }
    if (b.type === 'smith' && b.built) {
      h += '<p>Senjata, armor, dan alat untukmu dan warga.</p>';
      const kinds = [['sword', 'Pedang'], ['bow', 'Bow'], ['armor', 'Armor'], ['axe', 'Kapak'], ['pick', 'Beliung']];
      for (const kd of kinds) {
        h += '<div class="crow"><b>' + kd[1] + ':</b> ';
        for (let t = 0; t < 5; t++) {
          const owned = S.equip[kd[0]] > t;
          const locked = t >= 3 && S.th < 3;
          h += '<button data-act="craft" data-kind="' + kd[0] + '" data-tier="' + t + '"' + (owned || locked ? ' disabled' : '') + '>' + TIER_NAME[TIERS[t]] + ' (' + costText(CRAFT_COST[t]) + ')' + (owned ? ' ✓' : locked ? ' [TH3]' : '') + '</button>';
        }
        h += '</div>';
      }
      h += '<div class="crow"><b>Perisai:</b> <button data-act="craft" data-kind="shield" data-tier="0"' + (S.equip.shield > 0 ? ' disabled' : '') + '>Buat (10 kayu + 10 batu, -20% damage)' + (S.equip.shield > 0 ? ' ✓' : '') + '</button></div>';
    }
    if (b.type === 'kitchen' && b.built) {
      h += '<p>Roti: ' + S.bread + ' · Gandum: ' + S.wheat + ' · Antrean: ' + S.cookQ.length + ' (5 detik per roti)</p>';
      h += '<button data-act="cook" data-n="1">Buat 1 Roti — 1 gandum</button>';
      h += '<button data-act="cook" data-n="10">Buat 10 Roti — 10 gandum</button>';
      h += '<button data-act="cook" data-n="all">Buat Semua Gandum Jadi Roti</button>';
    }
    if (b.type === 'market' && b.built) {
      p.sel = p.sel || { give: 'wood', get: 'stone' };
      h += '<p>Tukar 2 bahan menjadi 1 bahan lain.</p>';
      h += '<div class="crow"><b>Beri:</b> ';
      for (const k in RES_NAME) h += '<button data-act="sel-give" data-res="' + k + '"' + (p.sel.give === k ? ' class="on"' : '') + '>' + RES_NAME[k] + ' (' + S[k] + ')</button>';
      h += '</div><div class="crow"><b>Terima:</b> ';
      for (const k in RES_NAME) h += '<button data-act="sel-get" data-res="' + k + '"' + (p.sel.get === k ? ' class="on"' : '') + '>' + RES_NAME[k] + '</button>';
      h += '</div><button data-act="trade" data-n="1">Tukar 2 ' + RES_NAME[p.sel.give] + ' → 1 ' + RES_NAME[p.sel.get] + '</button>';
      h += '<button data-act="trade" data-n="10">Tukar 10x — 20 ' + RES_NAME[p.sel.give] + ' → 10 ' + RES_NAME[p.sel.get] + '</button>';
      h += '<button data-act="trade" data-n="all">Tukar Semua ' + RES_NAME[p.sel.give] + ' → ' + RES_NAME[p.sel.get] + '</button>';
    }
    if (b.type === 'mine' && b.built) h += '<p>Penambang di sini menghasilkan 1 batu per 10 detik, 1 dari 5 hasil adalah iron atau coal.</p>';
    h += '<button data-act="demolish">Bongkar (kembali setengah bahan)</button>';
  } else if (p.kind === 'villager') {
    const v = p.ref;
    h += '<h3>Warga — ' + JOB_NAME[v.job] + '</h3>';
    h += '<p>HP ' + v.hp + '/' + VILL_HP + ' · ' + (v.fed ? 'Kenyang' : 'Lapar — berhenti kerja') + (v.dead ? ' · Tumbang, bangun besok pagi' : '') + '</p>';
    h += '<div class="crow"><b>Job:</b> ';
    for (const j of ['wood', 'mine', 'farm', 'none']) h += '<button data-act="job" data-job="' + j + '"' + (v.job === j ? ' class="on"' : '') + '>' + JOB_NAME[j] + '</button>';
    h += '</div>';
    h += '<button data-act="feed">Beri Roti (kenyang + 25 HP, 1 roti)</button>';
  }
  h += '<button data-act="close">Tutup</button>';
  el.panel.innerHTML = h;
}
el.panel.addEventListener('click', e => {
  const b = e.target.closest ? e.target.closest('button') : null;
  if (!b || !S.panel) return;
  const actName = b.getAttribute('data-act');
  audio();
  if (actName === 'close') { closePanel(); return; }
  if (actName === 'th-up') { if (upgradeTownhall()) renderPanel(); return; }
  if (actName === 'feed-all') { if (feedAllVillagers()) renderPanel(); return; }
  if (S.panel.kind === 'building') {
    const bd = S.panel.ref;
    if (actName === 'upgrade') { if (upgradeBuilding(bd)) renderPanel(); }
    else if (actName === 'demolish') { demolishBuilding(bd); closePanel(); }
    else if (actName === 'craft') { if (craftItem(b.getAttribute('data-kind'), parseInt(b.getAttribute('data-tier'), 10))) renderPanel(); }
    else if (actName === 'cook') { const raw = b.getAttribute('data-n'); if (cookBread(raw === 'all' ? S.wheat : parseInt(raw, 10))) renderPanel(); }
    else if (actName === 'sel-give') { S.panel.sel.give = b.getAttribute('data-res'); renderPanel(); }
    else if (actName === 'sel-get') { S.panel.sel.get = b.getAttribute('data-res'); renderPanel(); }
    else if (actName === 'trade') { const raw = b.getAttribute('data-n'); const n = raw === 'all' ? Math.floor(S[S.panel.sel.give] / 2) : parseInt(raw, 10); if (tradeMarket(S.panel.sel.give, S.panel.sel.get, n)) renderPanel(); }
  } else if (S.panel.kind === 'villager') {
    const v = S.panel.ref;
    if (actName === 'job') { setJob(v, b.getAttribute('data-job')); renderPanel(); }
    else if (actName === 'feed') { if (feedVillager(v)) renderPanel(); }
  }
});
el.menu.addEventListener('click', e => {
  const b = e.target.closest ? e.target.closest('button') : null;
  if (!b) return;
  audio();
  const k = b.getAttribute('data-build');
  if (k === 'cancel') { closeMenu(); return; }
  if (b.disabled) return;
  enterBuild(k);
});
$('btnAccept').addEventListener('click', () => { audio(); acceptVillager(); });
$('btnDecline').addEventListener('click', () => { audio(); declineVillager(); });
$('btnEat').addEventListener('click', () => { audio(); eatBread(); });

// ---------- Input ----------
const input = { mx: 0, my: 0 };
const keys = {};
const joy = { active: false, x: 0, y: 0 };
function pollKeys() {
  let x = 0, y = 0;
  if (keys['a'] || keys['arrowleft']) x -= 1;
  if (keys['d'] || keys['arrowright']) x += 1;
  if (keys['w'] || keys['arrowup']) y -= 1;
  if (keys['s'] || keys['arrowdown']) y += 1;
  input.mx = x; input.my = y;
}
window.addEventListener('keydown', e => {
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && !e.repeat) act();
  if (e.key.toLowerCase() === 'b' && !e.repeat) {
    if (S.buildMode) exitBuild();
    else if (!el.menu.hidden) closeMenu();
    else if (!S.dun) openMenu();
  }
  if (e.key.toLowerCase() === 'e' && !e.repeat) eatBread();
  if (e.key === 'Escape') { closePanel(); closeMenu(); exitBuild(); }
  audio();
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

function canvasTile(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  const cx = (clientX - r.left) * (VW / r.width), cy = (clientY - r.top) * (VH / r.height);
  return { tx: Math.floor((cx - VW / 2 + S.cam.x) / TILE), ty: Math.floor((cy - VH / 2 + S.cam.y) / TILE) };
}
function canvasPoint(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  const cx = (clientX - r.left) * (VW / r.width), cy = (clientY - r.top) * (VH / r.height);
  return { x: cx - VW / 2 + S.cam.x, y: cy - VH / 2 + S.cam.y };
}
let suppressClickUntil = 0;
canvas.addEventListener('mousemove', e => {
  const t = canvasTile(e.clientX, e.clientY);
  if (S.buildMode && !S.ghostLock) S.ghost = { x: clamp(t.tx, 0, MW - 2), y: clamp(t.ty, 0, MH - 2) };
});
canvas.addEventListener('click', () => {
  if (Date.now() < suppressClickUntil) return; // sentuhan sudah ditangani touchstart
  audio();
  if (S.buildMode) { tryPlace(); return; }
  if (S.dun) { act(); return; }
  const pt = canvasPoint(lastClick.x, lastClick.y);
  const t = { tx: Math.floor(pt.x / TILE), ty: Math.floor(pt.y / TILE) };
  for (const v of S.villagers) {
    if (v.dead) continue;
    if (Math.hypot(v.x - pt.x, v.y - pt.y) < 26) { openPanel({ kind: 'villager', ref: v }); return; }
  }
  const b = buildingAt(t.tx, t.ty);
  if (b) { openPanel({ kind: 'building', ref: b }); return; }
  if (inBalai(t.tx, t.ty)) { openPanel({ kind: 'townhall' }); return; }
  if (isDoor(t.tx, t.ty)) { enterDungeon(); return; }
  closePanel();
  act();
});
let lastClick = { x: 0, y: 0 };
canvas.addEventListener('pointerdown', e => { lastClick = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('touchstart', e => {
  audio();
  if (S.buildMode && !S.ghostLock) {
    const t = canvasTile(e.touches[0].clientX, e.touches[0].clientY);
    S.ghost = { x: clamp(t.tx, 0, MW - 2), y: clamp(t.ty, 0, MH - 2) };
    suppressClickUntil = Date.now() + 500;
    e.preventDefault();
  }
}, { passive: false });

const joyEl = $('joy'), stickEl = $('stick');
let joyId = null;
function joyMove(e) {
  const r = joyEl.getBoundingClientRect();
  let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
  const d = Math.hypot(dx, dy), max = r.width / 2;
  if (d > max) { dx = dx / d * max; dy = dy / d * max; }
  joy.x = dx / max; joy.y = dy / max;
  stickEl.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
}
joyEl.addEventListener('pointerdown', e => {
  joy.active = true; joyId = e.pointerId;
  joyEl.setPointerCapture(e.pointerId); joyMove(e); audio(); e.preventDefault();
});
joyEl.addEventListener('pointermove', e => { if (joy.active && e.pointerId === joyId) joyMove(e); });
const joyEnd = e => {
  if (e.pointerId !== joyId) return;
  joy.active = false; joy.x = 0; joy.y = 0;
  stickEl.style.transform = 'translate(0,0)';
};
joyEl.addEventListener('pointerup', joyEnd);
joyEl.addEventListener('pointercancel', joyEnd);

$('btnAct').addEventListener('pointerdown', e => { e.preventDefault(); audio(); act(); });
$('btnBuild').addEventListener('pointerdown', e => {
  e.preventDefault(); audio();
  if (S.buildMode) exitBuild();
  else if (!el.menu.hidden) closeMenu();
  else if (!S.dun) openMenu();
});
$('btnCancel').addEventListener('pointerdown', e => { e.preventDefault(); exitBuild(); });

// ---------- Update ----------
function update(dt) {
  S.rtime += dt;
  if (!S.frozen) {
    S.t += dt;
    if (S.phase === 'day' && S.t >= DAY_LEN) { S.phase = 'night'; S.charge = false; spawnWave(); }
    else if (S.phase === 'night' && S.t >= DAY_LEN + NIGHT_LEN) {
      S.t = 0; S.day++; S.phase = 'day';
      for (const m of S.monsters) burst(m.x, m.y, '#b9a7e6', 8, 60);
      S.monsters = []; sfx.dawn();
      addFloat(S.px, S.py - 30, 'Pagi tiba — hari ' + S.day, '#ffe27a');
      onDawn();
    }
  }
  pollKeys();
  let mx = input.mx, my = input.my;
  if (joy.active) { mx = joy.x; my = joy.y; }
  const len = Math.hypot(mx, my);
  S.moving = len > 0.15;
  if (S.moving) {
    mx /= len; my /= len;
    S.face = {
      x: Math.abs(mx) > Math.abs(my) ? Math.sign(mx) : 0,
      y: Math.abs(my) >= Math.abs(mx) ? Math.sign(my) : 0,
    };
    S.walk += dt * 10;
    moveAxis(mx * PLAYER_SPEED * dt, my * PLAYER_SPEED * dt);
  }
  for (const t of WORLD.trees) {
    if (t.shake > 0) t.shake -= dt;
    if (t.respawn > 0) { t.respawn -= dt; if (t.respawn <= 0) { t.hp = TREE_HP; burst(t.tx * TILE + 16, t.ty * TILE + 16, '#7ec850', 5, 40); } }
  }
  for (const r of WORLD.rocks) {
    if (r.shake > 0) r.shake -= dt;
    if (r.respawn > 0) { r.respawn -= dt; if (r.respawn <= 0) { r.hp = ROCK_HP; burst(r.tx * TILE + 16, r.ty * TILE + 16, '#b8b8b8', 5, 40); } }
  }
  for (const p of S.planted) {
    if (p.shake > 0) p.shake -= dt;
    if (p.grow > 0) { p.grow -= dt; if (p.grow <= 0) { p.hp = TREE_HP; burst(p.tx * TILE + 16, p.ty * TILE + 16, '#7ec850', 6, 40); } }
  }
  for (const k in S.crops) { const c = S.crops[k]; if (c.t < CROP_TIME) c.t += dt; }
  for (const b of S.buildings) if (!b.built) {
    b.prog += dt;
    if (b.prog >= BUILD[b.type].time) { b.built = true; celebrateBuilding(b); }
  }
  if (S.cookQ.length > 0) {
    S.cookQ[0].t -= dt;
    if (S.cookQ[0].t <= 0) {
      S.cookQ.shift(); S.bread++;
      const k = S.buildings.find(b => b.type === 'kitchen' && b.built);
      const cx = k ? k.x * TILE + TILE : S.px, cy = k ? k.y * TILE + TILE : S.py;
      addFloat(cx, cy - 20, '+1 roti', '#ffd94d');
      burst(cx, cy, '#ffd94d', 5, 40);
      sfx.harvest();
    }
  }
  updateVillagers(dt);
  updateMonsters(dt);
  if (S.dun) updateDungeon(dt);
  for (let i = S.parts.length - 1; i >= 0; i--) {
    const p = S.parts[i]; p.life -= dt;
    if (p.life <= 0) { S.parts.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 160 * dt;
  }
  for (let i = S.floats.length - 1; i >= 0; i--) {
    const f = S.floats[i]; f.life -= dt; f.y -= 26 * dt;
    if (f.life <= 0) S.floats.splice(i, 1);
  }
  if (S.shake > 0) S.shake = Math.max(0, S.shake - 30 * dt);
  if (S.hurtT > 0) S.hurtT -= dt;
  let tx, ty;
  if (S.dun) { tx = DUN_W * TILE / 2; ty = DUN_H * TILE / 2; }
  else { tx = clamp(S.px, VW / 2, MW * TILE - VW / 2); ty = clamp(S.py, VH / 2, MH * TILE - VH / 2); }
  S.cam.x += (tx - S.cam.x) * Math.min(1, dt * 5);
  S.cam.y += (ty - S.cam.y) * Math.min(1, dt * 5);
  S.saveT += dt;
  if (S.saveT >= 5) { S.saveT = 0; save(); }
  refreshHUD();
}

// ---------- Gambar: semua prosedural, tanpa aset luar ----------
function circle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}
function drawGround() {
  const x0 = Math.max(0, Math.floor((S.cam.x - VW / 2) / TILE)), x1 = Math.min(MW - 1, Math.ceil((S.cam.x + VW / 2) / TILE));
  const y0 = Math.max(0, Math.floor((S.cam.y - VH / 2) / TILE)), y1 = Math.min(MH - 1, Math.ceil((S.cam.y + VH / 2) / TILE));
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const g = WORLD.ground[y][x], sh = WORLD.shade[y][x], px = x * TILE, py = y * TILE;
    if (g === 'g') {
      ctx.fillStyle = (x + y) % 2 ? '#7cc24f' : '#75b948';
      ctx.fillRect(px, py, TILE, TILE);
      if (sh > 0.72) { ctx.fillStyle = '#69a844'; ctx.fillRect(px + 6 + sh * 12, py + 8 + sh * 10, 3, 3); }
    } else if (g === 'd') {
      ctx.fillStyle = '#b08a54'; ctx.fillRect(px, py, TILE, TILE);
      if (sh > 0.6) { ctx.fillStyle = '#9c7643'; ctx.fillRect(px + 4 + sh * 14, py + 6 + sh * 12, 4, 3); }
    } else if (g === 's') {
      ctx.fillStyle = '#8a5a33'; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#754c2b';
      ctx.fillRect(px + 3, py + 8, TILE - 6, 2); ctx.fillRect(px + 3, py + 20, TILE - 6, 2);
    } else if (g === 'r') {
      ctx.fillStyle = '#9c917d'; ctx.fillRect(px, py, TILE, TILE);
      if (sh > 0.6) { ctx.fillStyle = '#8a7f6b'; ctx.fillRect(px + 5 + sh * 12, py + 7 + sh * 10, 4, 4); }
    } else if (g === 'w') {
      ctx.fillStyle = '#4aa3df'; ctx.fillRect(px, py, TILE, TILE);
      ctx.strokeStyle = 'rgba(255,255,255,.4)'; ctx.lineWidth = 1;
      const off = Math.sin(S.rtime * 2 + x) * 3;
      ctx.beginPath(); ctx.moveTo(px + 5, py + 12 + off); ctx.lineTo(px + 18, py + 12 + off); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px + 14, py + 22 - off); ctx.lineTo(px + 27, py + 22 - off); ctx.stroke();
    }
    const tl = S.tiles[key(x, y)];
    if (tl === 'road') {
      ctx.fillStyle = '#b08a54'; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#9c7643'; ctx.fillRect(px + 6, py + 14, 8, 3); ctx.fillRect(px + 18, py + 20, 8, 3);
    } else if (tl === 'farm') {
      ctx.fillStyle = '#8a5a33'; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#754c2b';
      ctx.fillRect(px + 3, py + 8, TILE - 6, 2); ctx.fillRect(px + 3, py + 20, TILE - 6, 2);
    }
  }
}
function drawCrops() {
  for (const k in S.crops) {
    const p = k.split(',').map(Number), c = S.crops[k];
    const cx = p[0] * TILE + 16, cy = p[1] * TILE + 16;
    ctx.strokeStyle = '#4e8f2f'; ctx.lineWidth = 2;
    if (c.t < 10) {
      for (const dx of [-6, 0, 6]) { ctx.beginPath(); ctx.moveTo(cx + dx, cy + 6); ctx.lineTo(cx + dx, cy); ctx.stroke(); }
    } else if (c.t < CROP_TIME) {
      for (const dx of [-7, 0, 7]) { ctx.beginPath(); ctx.moveTo(cx + dx, cy + 8); ctx.lineTo(cx + dx, cy - 6); ctx.stroke(); }
    } else {
      circle(cx - 7, cy + 2, 6, '#5cb84d'); circle(cx + 7, cy + 2, 6, '#5cb84d'); circle(cx, cy - 4, 7, '#6cc957');
      circle(cx - 7, cy, 2, '#ffd94d'); circle(cx + 7, cy, 2, '#ffd94d'); circle(cx, cy - 6, 2, '#ffd94d');
    }
  }
}
function drawBalai() {
  const px = BALAI.x * TILE, py = BALAI.y * TILE;
  ctx.fillStyle = '#8a6a3e'; ctx.fillRect(px - 4, py + 44, BALAI.w * TILE + 8, 10);
  ctx.fillStyle = '#b07a45'; ctx.fillRect(px + 4, py + 16, BALAI.w * TILE - 8, 32);
  ctx.fillStyle = '#c8552e';
  ctx.beginPath();
  ctx.moveTo(px - 4, py + 18); ctx.lineTo(px + BALAI.w * TILE / 2, py - 10); ctx.lineTo(px + BALAI.w * TILE + 4, py + 18);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#5d3d1e'; ctx.fillRect(px + BALAI.w * TILE / 2 - 6, py + 28, 12, 20);
  ctx.strokeStyle = '#5d3d1e'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(px + BALAI.w * TILE - 6, py - 8); ctx.lineTo(px + BALAI.w * TILE - 6, py - 24); ctx.stroke();
  ctx.fillStyle = '#e74c3c';
  const wave = Math.sin(S.rtime * 4) * 2;
  ctx.beginPath();
  ctx.moveTo(px + BALAI.w * TILE - 6, py - 24); ctx.lineTo(px + BALAI.w * TILE + 8, py - 21 + wave); ctx.lineTo(px + BALAI.w * TILE - 6, py - 18);
  ctx.closePath(); ctx.fill();
  for (let i = 0; i < S.th; i++) circle(px + 14 + i * 12, py + 8, 4, '#ffd94d');
}
function drawDoor() {
  const px = DOOR.x * TILE, py = DOOR.y * TILE;
  ctx.fillStyle = '#6e6258'; ctx.fillRect(px - 2, py - 2, TILE + 4, TILE + 4);
  ctx.fillStyle = '#241d33';
  ctx.beginPath(); ctx.arc(px + 16, py + 22, 11, Math.PI, 0); ctx.fill();
  ctx.fillRect(px + 5, py + 22, 22, 10);
  ctx.fillStyle = '#8a6a3e'; ctx.fillRect(px + 2, py + 20, 4, 12); ctx.fillRect(px + 26, py + 20, 4, 12);
  ctx.fillStyle = '#ffd94d';
  const fl = 2 + Math.sin(S.rtime * 5) * 1;
  circle(px + 4, py + 14, fl, '#ff9d2e'); circle(px + 28, py + 14, fl, '#ff9d2e');
}
function drawBuilding(b) {
  const px = b.x * TILE, py = b.y * TILE;
  if (!b.built) {
    ctx.fillStyle = 'rgba(176,122,69,.45)'; ctx.fillRect(px + 6, py + 18, 52, 40);
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3;
    ctx.strokeRect(px + 6, py + 18, 52, 40);
    ctx.beginPath(); ctx.moveTo(px + 6, py + 58); ctx.lineTo(px + 32, py + 6); ctx.lineTo(px + 58, py + 58); ctx.stroke();
    const w = 52 * clamp(b.prog / BUILD[b.type].time, 0, 1);
    ctx.fillStyle = '#444'; ctx.fillRect(px + 6, py - 6, 52, 6);
    ctx.fillStyle = '#ffd94d'; ctx.fillRect(px + 6, py - 6, w, 6);
    return;
  }
  if (b.type === 'hut') {
    const h = b.level === 1 ? 0 : b.level === 2 ? 6 : 12;
    ctx.fillStyle = '#b07a45'; ctx.fillRect(px + 6, py + 20 - h, 52, 38 + h);
    ctx.fillStyle = b.level >= 3 ? '#8e44ad' : '#c8552e';
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 22 - h); ctx.lineTo(px + 32, py - 2 - h); ctx.lineTo(px + 62, py + 22 - h);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5d3d1e'; ctx.fillRect(px + 26, py + 36, 12, 22);
    ctx.fillStyle = '#ffe27a'; ctx.fillRect(px + 12, py + 28, 8, 8); ctx.fillRect(px + 44, py + 28, 8, 8);
    if (b.level >= 2) { ctx.fillStyle = '#ffe27a'; ctx.fillRect(px + 26, py + 8 - h, 12, 8); }
    return;
  }
  if (b.type === 'mine') {
    ctx.fillStyle = '#8d8d8d';
    ctx.beginPath();
    ctx.moveTo(px + 4, py + 60); ctx.lineTo(px + 14, py + 14); ctx.lineTo(px + 32, py + 2); ctx.lineTo(px + 50, py + 14); ctx.lineTo(px + 60, py + 60);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#241d33';
    ctx.beginPath(); ctx.arc(px + 32, py + 44, 11, Math.PI, 0); ctx.fill();
    ctx.fillRect(px + 21, py + 44, 22, 16);
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px + 18, py + 60); ctx.lineTo(px + 18, py + 34); ctx.moveTo(px + 46, py + 60); ctx.lineTo(px + 46, py + 34); ctx.stroke();
    return;
  }
  if (b.type === 'smith') {
    ctx.fillStyle = '#8d8578'; ctx.fillRect(px + 6, py + 20, 52, 38);
    ctx.fillStyle = '#6e675c'; ctx.fillRect(px + 6, py + 20, 52, 8);
    ctx.fillStyle = '#5d564c'; ctx.fillRect(px + 44, py + 2, 10, 20);
    ctx.fillStyle = '#ff9d2e';
    const fl = 3 + Math.sin(S.rtime * 6) * 1.5;
    circle(px + 49, py + 2, fl, '#ff9d2e');
    ctx.fillStyle = '#3d3d3d'; ctx.fillRect(px + 12, py + 44, 18, 8);
    ctx.fillStyle = '#c9c9c9'; ctx.fillRect(px + 12, py + 42, 18, 4);
    return;
  }
  if (b.type === 'kitchen') {
    ctx.fillStyle = '#c9a06a'; ctx.fillRect(px + 6, py + 20, 52, 38);
    ctx.fillStyle = '#a8502e';
    ctx.beginPath();
    ctx.moveTo(px + 2, py + 22); ctx.lineTo(px + 32, py - 2); ctx.lineTo(px + 62, py + 22);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5d564c'; ctx.fillRect(px + 44, py + 2, 10, 18);
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    circle(px + 49, py - 4 - Math.sin(S.rtime * 2) * 2, 4, 'rgba(255,255,255,.45)');
    ctx.fillStyle = '#e8c53a';
    ctx.beginPath(); ctx.ellipse(px + 32, py + 38, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
    return;
  }
  if (b.type === 'market') {
    ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px + 8, py + 58); ctx.lineTo(px + 8, py + 18); ctx.moveTo(px + 56, py + 58); ctx.lineTo(px + 56, py + 18); ctx.stroke();
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? '#e74c3c' : '#fff8e7';
      ctx.fillRect(px + 6 + i * 11, py + 10, 11, 10);
    }
    ctx.fillStyle = '#b07a45'; ctx.fillRect(px + 8, py + 40, 48, 16);
    circle(px + 20, py + 34, 5, '#e74c3c'); circle(px + 32, py + 34, 5, '#e8c53a'); circle(px + 44, py + 34, 5, '#5cb84d');
  }
}
function drawTree(t) {
  const cx = t.tx * TILE + 16, cy = t.ty * TILE + 16;
  const dx = t.shake > 0 ? Math.sin(S.rtime * 40) * 3 * t.shake : 0;
  ctx.fillStyle = '#7a5230'; ctx.fillRect(cx - 3 + dx, cy - 2, 6, 14);
  circle(cx - 8 + dx, cy - 2, 9, '#3f8f3a');
  circle(cx + 8 + dx, cy - 2, 9, '#3f8f3a');
  circle(cx + dx, cy - 10, 13, t.seed > 0.5 ? '#4da344' : '#5cb84d');
}
function drawSapling(p) {
  const cx = p.tx * TILE + 16, cy = p.ty * TILE + 16;
  ctx.strokeStyle = '#4e8f2f'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy + 8); ctx.lineTo(cx, cy - 4); ctx.stroke();
  circle(cx - 4, cy - 4, 4, '#5cb84d'); circle(cx + 4, cy - 4, 4, '#5cb84d');
}
function drawRock(r) {
  const cx = r.tx * TILE + 16, cy = r.ty * TILE + 16;
  const dx = r.shake > 0 ? Math.sin(S.rtime * 40) * 2 * r.shake : 0;
  circle(cx - 6 + dx, cy + 4, 8, '#8d8d8d');
  circle(cx + 5 + dx, cy + 2, 10, '#a8a8a8');
  circle(cx + 2 + dx, cy - 2, 3, '#d5d5d5');
}
function drawSlime(x, y, color, face, sq, scale) {
  const s = scale || 1;
  ctx.fillStyle = 'rgba(0,0,0,.2)';
  ctx.beginPath(); ctx.ellipse(x, y + 10 * s, 11 * s, 4 * s, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.ellipse(x, y, 13 * s * (1 + sq), 11 * s * (1 - sq), 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.ellipse(x - 4 * s, y - 4 * s, 4 * s, 3 * s, -0.4, 0, Math.PI * 2); ctx.fill();
  const ex = face.x * 2 * s, ey = face.y * 2 * s;
  for (const sd of [-1, 1]) {
    circle(x + sd * 5 * s, y - 2 * s, 3.4 * s, '#fff');
    circle(x + sd * 5 * s + ex, y - 2 * s + ey, 1.8 * s, '#1c2333');
  }
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(x, y + 3 * s, 3 * s, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
}
function drawToolIcon(x, y, job) {
  ctx.strokeStyle = '#7a5230'; ctx.lineWidth = 2;
  if (job === 'wood') {
    ctx.beginPath(); ctx.moveTo(x - 4, y + 5); ctx.lineTo(x + 4, y - 5); ctx.stroke();
    ctx.fillStyle = '#c9c9c9';
    ctx.beginPath(); ctx.moveTo(x + 4, y - 5); ctx.lineTo(x + 9, y - 1); ctx.lineTo(x + 4, y + 1); ctx.closePath(); ctx.fill();
  } else if (job === 'mine') {
    ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x, y - 5); ctx.stroke();
    ctx.strokeStyle = '#c9c9c9'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - 6, y - 2); ctx.quadraticCurveTo(x, y - 8, x + 6, y - 2); ctx.stroke();
  } else if (job === 'farm') {
    ctx.strokeStyle = '#e8c53a'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y + 5); ctx.lineTo(x, y - 6); ctx.stroke();
    circle(x - 3, y - 3, 2, '#ffd94d'); circle(x + 3, y - 3, 2, '#ffd94d'); circle(x, y - 6, 2, '#ffd94d');
  }
}
function drawPlayer() {
  const sq = S.moving ? Math.sin(S.walk) * 0.13 : Math.sin(S.rtime * 2) * 0.03;
  drawSlime(S.px, S.py, '#45a5f5', S.face, sq, 1);
}
function drawVillager(v) {
  if (v.dead) return;
  const sq = v.moving ? Math.sin(v.walk) * 0.13 : Math.sin(S.rtime * 2 + v.phase) * 0.03;
  drawSlime(v.x, v.y, JOB_COLOR[v.job], v.face, sq, 0.9);
  if (v.job !== 'none') drawToolIcon(v.x, v.y - 20, v.job);
  if (!v.fed) {
    ctx.font = 'bold 14px system-ui, sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = '#ff5a5a';
    ctx.fillText('!', v.x + 14, v.y - 16);
  }
  if (v.hp < VILL_HP) {
    ctx.fillStyle = '#444'; ctx.fillRect(v.x - 12, v.y - 18, 24, 4);
    ctx.fillStyle = '#4caf50'; ctx.fillRect(v.x - 12, v.y - 18, 24 * clamp(v.hp / VILL_HP, 0, 1), 4);
  }
}
function drawMonster(m) {
  const bob = Math.sin(m.phase) * 2;
  ctx.fillStyle = 'rgba(0,0,0,.2)';
  ctx.beginPath(); ctx.ellipse(m.x, m.y + 10, 11, 4, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = m.color || '#7a4a9e';
  ctx.beginPath(); ctx.ellipse(m.x, m.y + bob, 13, 11, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e8d9f5';
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(m.x + s * 9, m.y - 6 + bob); ctx.lineTo(m.x + s * 13, m.y - 13 + bob); ctx.lineTo(m.x + s * 5, m.y - 9 + bob);
    ctx.closePath(); ctx.fill();
  }
  for (const s of [-1, 1]) {
    circle(m.x + s * 5, m.y - 2 + bob, 3.2, '#fff');
    circle(m.x + s * 5, m.y - 2 + bob, 1.8, '#d21f1f');
  }
  ctx.strokeStyle = '#3d2352'; ctx.lineWidth = 2;
  for (const s of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(m.x + s * 8, m.y - 8 + bob); ctx.lineTo(m.x + s * 2, m.y - 5 + bob);
    ctx.stroke();
  }
  ctx.fillStyle = '#444'; ctx.fillRect(m.x - 12, m.y - 18 + bob, 24, 4);
  ctx.fillStyle = '#e74c3c'; ctx.fillRect(m.x - 12, m.y - 18 + bob, 24 * clamp(m.hp / (m.maxHp || MON_HP), 0, 1), 4);
}
function drawDungeon() {
  const d = S.dun;
  for (let y = 0; y < DUN_H; y++) for (let x = 0; x < DUN_W; x++) {
    const px = x * TILE, py = y * TILE;
    if (d.ground[y][x] === 'w') {
      ctx.fillStyle = '#3a3348'; ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = '#4a4260'; ctx.fillRect(px, py, TILE, 4);
    } else {
      ctx.fillStyle = (x + y) % 2 ? '#6b6259' : '#655c52';
      ctx.fillRect(px, py, TILE, TILE);
    }
  }
  for (const tx of [4, 21]) for (const ty of [4, 13]) {
    const fl = 3 + Math.sin(S.rtime * 5 + tx) * 1.5;
    circle(tx * TILE + 16, ty * TILE + 8, fl + 2, 'rgba(255,157,46,.35)');
    circle(tx * TILE + 16, ty * TILE + 8, fl, '#ff9d2e');
  }
  const ex = d.exit.x * TILE + 16, ey = d.exit.y * TILE + 16;
  ctx.fillStyle = '#2e8f5b';
  ctx.beginPath(); ctx.arc(ex, ey, 12, Math.PI, 0); ctx.fill();
  ctx.fillRect(ex - 12, ey, 24, 12);
  ctx.fillStyle = '#9fe870';
  ctx.beginPath(); ctx.arc(ex, ey, 7, Math.PI, 0); ctx.fill();
  ctx.fillRect(ex - 7, ey, 14, 12);
  if (d.stairs) {
    const sx = d.stairs.x * TILE, sy = d.stairs.y * TILE;
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i % 2 ? '#8d8578' : '#7a7368';
      ctx.fillRect(sx + 4, sy + 4 + i * 8, 24, 8);
    }
  }
  for (const c of d.chests) {
    const px = c.x * TILE, py = c.y * TILE;
    ctx.fillStyle = c.opened ? '#6e5636' : '#8a6a3e';
    ctx.fillRect(px + 5, py + 12, 22, 14);
    ctx.fillStyle = c.opened ? '#5d4a2e' : '#a87f4e';
    ctx.fillRect(px + 5, py + 8, 22, 6);
    ctx.fillStyle = '#ffd94d'; ctx.fillRect(px + 14, py + 12, 4, 6);
  }
}
function render() {
  ctx.clearRect(0, 0, VW, VH);
  const sx = (Math.random() * 2 - 1) * S.shake, sy = (Math.random() * 2 - 1) * S.shake;
  ctx.save();
  ctx.translate(Math.round(VW / 2 - S.cam.x + sx), Math.round(VH / 2 - S.cam.y + sy));
  if (S.dun) {
    drawDungeon();
    const dyn = [];
    for (const m of S.dun.monsters) dyn.push({ y: m.y, f: () => drawMonster(m) });
    dyn.push({ y: S.py, f: drawPlayer });
    dyn.sort((a, b) => a.y - b.y);
    for (const dd of dyn) dd.f();
  } else {
    drawGround();
    drawCrops();
    drawBalai();
    drawDoor();
    for (const b of S.buildings) drawBuilding(b);
    const dyn = [];
    for (const t of WORLD.trees) if (alive(t)) dyn.push({ y: t.ty * TILE + 16, f: () => drawTree(t) });
    for (const p of S.planted) dyn.push({ y: p.ty * TILE + 16, f: grown(p) ? () => drawTree(p) : () => drawSapling(p) });
    for (const r of WORLD.rocks) if (alive(r)) dyn.push({ y: r.ty * TILE + 16, f: () => drawRock(r) });
    for (const m of S.monsters) dyn.push({ y: m.y, f: () => drawMonster(m) });
    for (const v of S.villagers) dyn.push({ y: v.y, f: () => drawVillager(v) });
    dyn.push({ y: S.py, f: drawPlayer });
    dyn.sort((a, b) => a.y - b.y);
    for (const dd of dyn) dd.f();
  }
  for (const p of S.parts) {
    ctx.globalAlpha = clamp(p.life / p.max, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
  const dark = darkness();
  if (dark > 0) { ctx.fillStyle = 'rgba(8,10,38,' + dark + ')'; ctx.fillRect(0, 0, VW, VH); }
  ctx.save();
  ctx.translate(Math.round(VW / 2 - S.cam.x + sx), Math.round(VH / 2 - S.cam.y + sy));
  ctx.font = 'bold 13px system-ui, sans-serif'; ctx.textAlign = 'center';
  for (const f of S.floats) {
    ctx.globalAlpha = clamp(f.life / 1.1, 0, 1);
    ctx.fillStyle = f.color;
    ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 3;
    ctx.strokeText(f.txt, f.x, f.y);
    ctx.fillText(f.txt, f.x, f.y);
  }
  ctx.globalAlpha = 1;
  if (S.buildMode && !S.dun) {
    const size = (S.buildMode === 'road' || S.buildMode === 'farm' || S.buildMode === 'tree' || S.buildMode === 'erase') ? 1 : 2;
    const ok = ghostValid(S.ghost.x, S.ghost.y, S.buildMode);
    const px = S.ghost.x * TILE, py = S.ghost.y * TILE;
    ctx.fillStyle = ok ? 'rgba(80,220,90,.35)' : 'rgba(230,60,60,.35)';
    ctx.fillRect(px, py, TILE * size, TILE * size);
    ctx.strokeStyle = ok ? '#50dc5a' : '#e63c3c'; ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(px, py, TILE * size, TILE * size);
    ctx.setLineDash([]);
  }
  ctx.restore();
  if (S.hurtT > 0) {
    ctx.strokeStyle = 'rgba(231,76,60,' + clamp(S.hurtT * 2, 0, .8) + ')';
    ctx.lineWidth = 10;
    ctx.strokeRect(5, 5, VW - 10, VH - 10);
  }
}

// ---------- HUD ----------
const hudCache = {};
function setTxt(elm, k, val) { if (hudCache[k] !== val) { hudCache[k] = val; elm.textContent = val; } }
function refreshHUD() {
  setTxt(el.wood, 'w', S.wood);
  setTxt(el.stone, 's', S.stone);
  setTxt(el.wheat, 'wh', S.wheat);
  setTxt(el.bread, 'br', S.bread);
  setTxt(el.iron, 'ir', S.iron);
  setTxt(el.coal, 'co', S.coal);
  setTxt(el.gold, 'go', S.gold);
  setTxt(el.diamond, 'di', S.diamond);
  setTxt(el.vill, 'vi', S.villagers.length + '/' + houseCapacity() + ' · TH ' + S.th);
  setTxt(el.hpTxt, 'hp', S.hp + '/' + PLAYER_HP);
  el.hp.style.width = clamp(S.hp, 0, 100) + '%';
  setTxt(el.day, 'd', 'Hari ' + S.day);
  setTxt(el.phase, 'p', S.dun ? 'Dungeon L' + S.dun.floor : S.phase === 'day' ? 'Siang' : 'Malam');
  const prog = S.phase === 'day' ? S.t / DAY_LEN : (S.t - DAY_LEN) / NIGHT_LEN;
  el.cyc.style.width = Math.round(clamp(prog, 0, 1) * 100) + '%';
}

// ---------- Simpan dan muat ----------
function save() {
  try {
    const inDun = !!S.dun;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      v: 1,
      px: inDun && S.returnPos ? S.returnPos.x : S.px,
      py: inDun && S.returnPos ? S.returnPos.y : S.py,
      hp: S.hp,
      wood: S.wood, stone: S.stone, wheat: S.wheat, bread: S.bread,
      iron: S.iron, coal: S.coal, gold: S.gold, diamond: S.diamond,
      day: S.day, t: S.t, phase: S.phase, th: S.th, equip: S.equip, flags: S.flags,
      trees: WORLD.trees.map(t => ({ hp: t.hp, respawn: t.respawn })),
      rocks: WORLD.rocks.map(r => ({ hp: r.hp, respawn: r.respawn })),
      crops: S.crops, tiles: S.tiles,
      planted: S.planted.map(p => ({ tx: p.tx, ty: p.ty, hp: p.hp, grow: p.grow })),
      buildings: S.buildings,
      villagers: S.villagers.map(v => ({
        x: v.x, y: v.y, job: v.job, hp: v.hp, fed: v.fed, dead: v.dead,
        home: v.home ? S.buildings.indexOf(v.home) : -1,
      })),
    }));
  } catch (e) { /* penyimpanan boleh gagal, game tetap jalan */ }
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (!d || d.v !== 1) return; // simpanan versi lain diabaikan, mulai baru
    S.px = d.px; S.py = d.py; S.hp = d.hp;
    S.wood = d.wood; S.stone = d.stone; S.wheat = d.wheat; S.bread = d.bread;
    S.iron = d.iron; S.coal = d.coal; S.gold = d.gold; S.diamond = d.diamond;
    S.day = d.day; S.t = d.t; S.phase = d.phase; S.th = d.th || 1;
    S.equip = Object.assign(S.equip, d.equip || {});
    S.flags = d.flags || {};
    (d.trees || []).forEach((sv, i) => { if (WORLD.trees[i]) { WORLD.trees[i].hp = sv.hp; WORLD.trees[i].respawn = sv.respawn; } });
    (d.rocks || []).forEach((sv, i) => { if (WORLD.rocks[i]) { WORLD.rocks[i].hp = sv.hp; WORLD.rocks[i].respawn = sv.respawn; } });
    S.crops = d.crops || {}; S.tiles = d.tiles || {};
    S.planted = (d.planted || []).map(p => ({ tx: p.tx, ty: p.ty, hp: p.hp, respawn: 0, shake: 0, seed: Math.random(), planted: true, grow: p.grow }));
    S.buildings = d.buildings || [];
    S.villagers = (d.villagers || []).map(sv => ({
      x: sv.x, y: sv.y, job: sv.job, hp: sv.hp, fed: sv.fed, dead: sv.dead,
      home: sv.home >= 0 ? S.buildings[sv.home] || null : null,
      hitCd: 0, prodT: 0, prodN: 0, phase: Math.random() * 6, walk: 0,
      face: { x: 0, y: 1 }, moving: false,
    }));
    S.cam.x = S.px; S.cam.y = S.py;
  } catch (e) { /* simpanan rusak diabaikan, mulai baru */ }
}
window.addEventListener('pagehide', save);
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

// ---------- Param URL untuk keperluan tes/screenshot ----------
function applyScene() {
  const q = {};
  const s = (typeof location !== 'undefined' ? location.search : '').replace(/^\?/, '');
  if (s) for (const p of s.split('&')) { const kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); }
  if (q.freeze) S.frozen = true;
  for (const k of ['wood', 'stone', 'wheat', 'bread', 'iron', 'coal', 'gold', 'diamond']) if (q[k] !== undefined) S[k] = parseInt(q[k], 10) || 0;
  if (q.th) S.th = clamp(parseInt(q.th, 10) || 1, 1, 3);
  if (q.scene === 'night') {
    S.phase = 'night'; S.t = DAY_LEN + 5;
    spawnWave();
  } else if (q.scene === 'build') {
    S.wood = 30;
    S.ghostLock = { x: 26, y: 14 };
    enterBuild('hut');
  } else if (q.scene === 'villagers') {
    S.wood = 100; S.stone = 100; S.wheat = 50; S.bread = 30;
    const h1 = { type: 'hut', x: 26, y: 14, level: 1, prog: 5, built: true, invested: { wood: 20 } };
    const h2 = { type: 'hut', x: 29, y: 14, level: 2, prog: 5, built: true, invested: { wood: 60, stone: 20 } };
    S.buildings.push(h1, h2);
    for (const job of ['wood', 'mine', 'farm']) {
      const v = spawnVillager();
      if (v) { v.job = job; v.x = 24 * TILE + Math.random() * 60; v.y = 17 * TILE + Math.random() * 40; }
    }
  } else if (q.scene === 'dungeon') {
    S.equip.sword = 1;
    enterDungeon();
  } else if (q.scene === 'panel') {
    S.wood = 100; S.stone = 100;
    const h = { type: 'hut', x: 26, y: 14, level: 2, prog: 5, built: true, invested: { wood: 60, stone: 20 } };
    S.buildings.push(h);
    openPanel({ kind: 'building', ref: h });
  }
}

// ---------- Loop ----------
let lastT = 0;
function frame(ts) {
  const dt = Math.min(0.05, (ts - lastT) / 1000 || 0.016);
  lastT = ts;
  update(dt);
  render();
  requestAnimationFrame(frame);
}
load();
applyScene();
refreshHUD();
if (typeof requestAnimationFrame === 'function') requestAnimationFrame(frame);

// ---------- Kait tes headless ----------
window.__DM = {
  S, WORLD, BUILD, TIERS, update, render, act, enterBuild, exitBuild, tryPlace, ghostValid,
  spawnWave, save, load, keys, input, joy, TILE, MW, MH, DAY_LEN, NIGHT_LEN,
  acceptVillager, declineVillager, spawnVillager, setJob, feedVillager, feedAllVillagers,
  upgradeBuilding, demolishBuilding, upgradeTownhall, craftItem, cookBread, tradeMarket,
  eatBread, enterDungeon, exitDungeon, openPanel, closePanel, openMenu, closeMenu,
  hitTree, hitRock, harvestCrop, dropLoot, onDawn, houseCapacity, findFreeHouse,
  reset() { initState(S); closePanel(); closeMenu(); el.popup.hidden = true; refreshHUD(); },
  teleport(x, y) { S.px = x; S.py = y; S.cam.x = x; S.cam.y = y; },
  setClock(day, t, phase) { S.day = day; S.t = t; S.phase = phase; },
  give(res) { for (const k in res) S[k] += res[k]; },
};
