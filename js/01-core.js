// State global. Satu-satunya sumber kebenaran. File ini tanpa DOM supaya
// logika murni bisa dites headless di node.
const TILE_W = 64, TILE_H = 32;
// Dimensi map AKTIF; berubah saat pindah map atau plot membesar.
let GRID_W = 16, GRID_H = 12;
const SAVE_KEY = 'indotopia-tycoon-save-v2';

const S = {
  money: 50,
  inv: {},           // itemId -> jumlah yang dipanggul karakter
  unlocked: { sawhorse: true, splitter: true },
  cam: { x: 0, y: 0, zoom: 1 },
  hover: null,       // {gx, gy} petak di bawah kursor
  selected: null,    // "gx,gy" petak yang panelnya terbuka
  placing: null,     // {kind:'machine'|'conveyor'|'storage'|'wall'|'decor', id, fromKey?}
  placeDir: 0,
  floaters: [],      // {gx, gy, text, color, born, map} map asal: hanya tampil di map itu
  pulses: new Map(), // "gx,gy" -> born, denyut saat diketuk
  beltT: 0,          // jam animasi conveyor
  time: 0,           // jam global detik
  map: 'town',     // map aktif: 'town' (kota), 'forest', 'mountain', 'harbor', 'plot'
  grid: [],          // grid map AKTIF: [gy][gx] -> {t, obj, hp, regrowIn}
  maps: {},          // nama map -> {w, h, grid}; grid non-aktif disimpan di sini
  expansion: 0,      // 0..4, tingkat ekspansi plot lewat Mayor
  autoSeller: false,
  autoSellerT: 0,
  // Bangunan hanya ada di plot; koleksi ini selalu milik plot walau pemain di kota.
  machines: new Map(),   // "gx,gy" -> {id, dir, recipe, input:{}, output:{}, progress, stopped}
  conveyors: new Map(),  // "gx,gy" -> {id, dir, item, t}
  storages: new Map(),   // "gx,gy" -> {id, items:{}}
  walls: new Map(),      // "gx,gy" -> {id}
  decor: new Map(),      // "gx,gy" -> {id}
  mayor: { gx: 5, gy: 1 },      // di map kota
  plotPad: { gx: 8, gy: 10 },   // di map kota: injak untuk masuk ke plot
  player: {
    fx: 8.5, fy: 6.5, dir: 1, frame: 0, walkT: 0,
    path: [],            // [{gx, gy}] petak tujuan berurutan
    onArrive: null,      // aksi saat sampai
    working: null,       // {kind, gx, gy, swingsLeft, swingT, node}
    tool: 'axe', swing: 0,
  },
  tut: 0, tutDone: false,
  stats: { harvested: {}, crafted: {}, sold: {} },
  settings: { sound: true },
  keys: {},
};

const key = (gx, gy) => gx + ',' + gy;
const inGrid = (gx, gy) => gx >= 0 && gy >= 0 && gx < GRID_W && gy < GRID_H;

// Label penggaris x/z Agus (1-based, nol di pojok kiri bawah map):
// x naik ke atas, z naik ke kanan bawah. Pakai GRID_H hidup supaya
// ikut besar map (lahan membesar tiap ekspansi).
function coordLabel(gx, gy) { return { x: GRID_H - gy, z: gx + 1 }; }

// Hash deterministik: variasi visual stabil tiap muat ulang, tanpa RNG.
function hash2(gx, gy) {
  let h = (gx * 374761393 + gy * 668265263) | 0;
  h = Math.imul(h ^ (h >> 13), 1274126177);
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function makeGrid(w, h) {
  const g = [];
  for (let gy = 0; gy < h; gy++) {
    const row = [];
    for (let gx = 0; gx < w; gx++) row.push({ t: 'grass', obj: null, hp: 0, regrowIn: 0 });
    g.push(row);
  }
  return g;
}

function newGrid() {
  S.grid = makeGrid(GRID_W, GRID_H);
}

// Gerbang keluar plot: tengah tepi bawah grid plot. Satu-satunya jalan
// keluar, supaya tidak sengaja keluar saat kerja di pinggir lahan.
function gatePos() {
  const m = S.maps.plot;
  return { gx: Math.floor(m.w / 2), gy: m.h - 1 };
}

function tileAt(gx, gy) { return inGrid(gx, gy) ? S.grid[gy][gx] : null; }

// Tukar grid aktif tanpa DOM: dipakai muat simpan dan pindah map.
function applyMap(name) {
  const m = S.maps[name];
  S.map = name;
  S.grid = m.grid;
  GRID_W = m.w; GRID_H = m.h;
}

// Pindah map: titik lahir tetap sesuai desain (masuk plot di depan
// gerbang, kembali ke kota di samping kotak plot), bukan posisi lama.
// spawn {fx, fy} opsional: pintu keluar dan kereta mengisi titik lahirnya.
function switchMap(name, spawn) {
  const p = S.player;
  p.path = []; p.onArrive = null; p.working = null;
  applyMap(name);
  const pos = spawn || defaultSpawn(name);
  p.fx = pos.fx; p.fy = pos.fy; p.dir = pos.dir === undefined ? 3 : pos.dir;
  if (typeof centerCamera === 'function' && typeof VW !== 'undefined') {
    centerCamera(VW, VH);
  }
  TOAST(name === 'plot' ? 'Masuk ke lahanmu.' : name === 'town' ? 'Kembali ke kota.' : 'Tiba di ' + MAP_NAMES[name] + '.');
  if (typeof UI !== 'undefined') UI.refreshHUD();
  saveSoon();
}

function defaultSpawn(name) {
  if (name === 'plot') {
    const g = gatePos();
    return { fx: g.gx + 0.5, fy: g.gy - 0.5, dir: 3 };
  }
  if (name === 'town') return { fx: S.plotPad.gx + 0.5, fy: S.plotPad.gy - 0.5, dir: 3 };
  return { fx: 8.5, fy: 6.5, dir: 3 };
}

// Perbesar grid plot, bangunan lama tetap di koordinatnya.
function expandPlotGrid(w, h) {
  const old = S.maps.plot;
  const g = makeGrid(w, h);
  for (let gy = 0; gy < Math.min(old.h, h); gy++)
    for (let gx = 0; gx < Math.min(old.w, w); gx++) g[gy][gx] = old.grid[gy][gx];
  S.maps.plot = { w, h, grid: g };
  if (S.map === 'plot') applyMap('plot');
}

// Kait umpan balik, diisi ulang oleh 13-ui.js di browser. Di node tetap no-op.
let SFX = { play() {} };
let TOAST = () => {};
let FLOATER_SINK = null; // diisi render agar addFloater bisa dipakai tes headless

function addFloater(gx, gy, text, color, map) {
  // map = map asal floater; default map aktif saat dibuat. Mesin selalu
  // di plot, jadi finishCraft mengisi 'plot' eksplisit: kalau tidak,
  // hasil mesin yang selesai saat pemain di kota akan ketempel 'town'
  // dan bocor lagi ke kota.
  S.floaters.push({ gx, gy, text, color, born: S.time, map: map || S.map });
  if (S.floaters.length > 24) S.floaters.shift();
}

function invAdd(id, n) {
  S.inv[id] = (S.inv[id] || 0) + n;
  if (S.inv[id] <= 0) delete S.inv[id];
}
function invCount(id) { return S.inv[id] || 0; }
function carriedTotal() {
  return Object.values(S.inv).reduce((a, b) => a + b, 0);
}
