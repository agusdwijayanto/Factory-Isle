// State global. Satu-satunya sumber kebenaran. File ini tanpa DOM supaya
// logika murni bisa dites headless di node.
const TILE_W = 64, TILE_H = 32;
const GRID_W = 16, GRID_H = 12;
const SAVE_KEY = 'indotopia-tycoon-save-v1';

const S = {
  money: 50,
  inv: {},           // itemId -> jumlah yang dipanggul karakter
  unlocked: { sawhorse: true, splitter: true },
  cam: { x: 0, y: 0, zoom: 1 },
  hover: null,       // {gx, gy} petak di bawah kursor
  selected: null,    // "gx,gy" petak yang panelnya terbuka
  placing: null,     // {kind:'machine'|'conveyor'|'storage'|'wall'|'decor', id, fromKey?}
  placeDir: 0,
  floaters: [],      // {gx, gy, text, color, born}
  pulses: new Map(), // "gx,gy" -> born, denyut saat diketuk
  beltT: 0,          // jam animasi conveyor
  time: 0,           // jam global detik
  grid: [],          // [gy][gx] -> {t, obj, hp, regrowIn}
  machines: new Map(),   // "gx,gy" -> {id, dir, recipe, input:{}, output:{}, progress, stopped}
  conveyors: new Map(),  // "gx,gy" -> {id, dir, item, t}
  storages: new Map(),   // "gx,gy" -> {id, items:{}}
  walls: new Map(),      // "gx,gy" -> {id}
  decor: new Map(),      // "gx,gy" -> {id}
  shop: { gx: 8, gy: 0 },
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

// Hash deterministik: variasi visual stabil tiap muat ulang, tanpa RNG.
function hash2(gx, gy) {
  let h = (gx * 374761393 + gy * 668265263) | 0;
  h = Math.imul(h ^ (h >> 13), 1274126177);
  return ((h ^ (h >> 16)) >>> 0) / 4294967295;
}

function newGrid() {
  S.grid = [];
  for (let gy = 0; gy < GRID_H; gy++) {
    const row = [];
    for (let gx = 0; gx < GRID_W; gx++) row.push({ t: 'grass', obj: null, hp: 0, regrowIn: 0 });
    S.grid.push(row);
  }
}

function tileAt(gx, gy) { return inGrid(gx, gy) ? S.grid[gy][gx] : null; }

// Kait umpan balik, diisi ulang oleh 13-ui.js di browser. Di node tetap no-op.
let SFX = { play() {} };
let TOAST = () => {};
let FLOATER_SINK = null; // diisi render agar addFloater bisa dipakai tes headless

function addFloater(gx, gy, text, color) {
  S.floaters.push({ gx, gy, text, color, born: S.time });
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
