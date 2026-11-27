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
  placeSpot: null,  // {gx, gy} petak bayangan yang dipilih saat menaruh; centang baru taro
  placeDir: 0,
  floaters: [],      // {gx, gy, text, color, born, map} map asal: hanya tampil di map itu
  pulses: new Map(), // "gx,gy" -> born, denyut saat diketuk
  beltT: 0,          // jam animasi conveyor
  time: 0,           // jam global detik
  // v49: map aktif. Rantai utara->selatan: ice, meadow_n, forest, forest2,
  // plot, town, meadow_s, harbor.
  map: 'town',
  grid: [],          // grid map AKTIF: [gy][gx] -> {t, obj, hp, regrowIn, stage, growIn}
  maps: {},          // nama map -> {w, h, grid}; grid non-aktif disimpan di sini
  expansion: 0,      // 0..4, tingkat ekspansi plot lewat Mayor
  autoSeller: false,
  admin: false,      // Mode Admin: saklar on/off (duit/bahan infinite, riset terbuka, crafting instan)
  autoSellerT: 0,
  // Bangunan hanya ada di plot; koleksi ini selalu milik plot walau pemain di kota.
  machines: new Map(),   // "gx,gy" -> {id, dir, recipe, input:{}, output:{}, progress, stopped}
  conveyors: new Map(),  // "gx,gy" -> {id, dir, item, t}
  storages: new Map(),   // "gx,gy" -> {id, items:{}}
  walls: new Map(),      // "gx,gy" -> {id}
  decor: new Map(),      // "gx,gy" -> {id}
  mayor: { gx: 7, gy: 13 },     // v51: (x7,z8) di kota, di selatan salon (7,11)
  // v49: plotPad dihapus — lahan sekarang di UTARA kota, pintunya jembatan
  // (8,0) di kota; gerbang lahan sendiri ada di 08-gerak/07-pemain.
  player: {
    fx: 8.5, fy: 6.5, dir: 1, frame: 0, walkT: 0,
    path: [],            // [{gx, gy}] petak tujuan berurutan
    onArrive: null,      // aksi saat sampai
    working: null,       // {kind, gx, gy, swingsLeft, swingT, node}
    tool: 'axe', swing: 0,
  },
  tut: 0, tutDone: false, tutStarted: false,
  stats: { harvested: {}, crafted: {}, sold: {} },
  settings: { sound: true, ruler: true },
  keys: {},
  // v35: perkakas (tingkat 0-3; semua dasar gratis sejak awal, seperti
  // kapak; upgrade bronze $250, iron $1.000 ikut wiki untuk ketiganya).
  tools: { axe: 1, shovel: 1, pickaxe: 1 },
  badges: {},           // badgeId -> true
  wagon: null,          // {map, gx, gy, level, horses, items:{}, riding}
  saveSlot: 1,          // 1..4; 0 = tidak ada slot dimuat
};

const key = (gx, gy) => gx + ',' + gy;
const inGrid = (gx, gy) => gx >= 0 && gy >= 0 && gx < GRID_W && gy < GRID_H;

// Mode Admin hidup atau tidak. Satu-satunya gerbang: semua titik yang
// menghemat uang/bahan/waktu saat mode on memeriksa ini.
function adminOn() { return !!S.admin; }

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
    for (let gx = 0; gx < w; gx++) row.push({ t: 'grass', obj: null, hp: 0, regrowIn: 0, stage: 0, growIn: 0 });
    g.push(row);
  }
  return g;
}

function newGrid() {
  S.grid = makeGrid(GRID_W, GRID_H);
}

// Gerbang keluar plot: kolom 8 tepi bawah grid plot (Agus (1,9), sejajar
// pad kota) dan tepi atas (8,0) ke Hutan Dikit. Kolom TETAP 8 di semua
// ukuran lahan — tidak ikut melebar — supaya jalan keluar tidak bergeser
// saat ekspansi.
function gatePos() {
  const m = S.maps.plot;
  return { gx: 8, gy: m.h - 1 };
}

// v56: blok pulau 3x3 yang ditempati pemain saat ini (dari map + posisi
// di dalam map). Map yang memuat dua blok dibagi menurut koordinat:
// meadow_n: timur (gx>=10, petak Plot) atau selatan (gy>=12) = Blok 6,
// sisanya Blok 3; meadow_s: belah dua (gx<10 = Blok 7, sisanya Blok 8).
// Lahan (plot) = map samping, tanpa nomor blok.
function currentBlock() {
  const p = S.player;
  const gx = Math.floor(p.fx), gy = Math.floor(p.fy);
  switch (S.map) {
    case 'ice': return 1;
    case 'forest': return 2;
    case 'meadow_n': return 3; // v61: Blok 3 saja (Lembah Hijau pisah)
    case 'meadow_e': return 6; // v61: Lembah Hijau map sendiri
    case 'forest2': return 4;
    case 'town': return 5;
    case 'meadow_s': return gx < 10 ? 7 : 8;
    case 'harbor': return 9;
    case 'plot': return 0;
    default: return 0;
  }
}
function currentBlockName() {
  const b = currentBlock();
  if (b === 0) return S.map === 'plot' ? 'Lahan' : (MAP_NAMES[S.map] || 'Kota');
  return BLOCKS[b].name;
}

function tileAt(gx, gy) { return inGrid(gx, gy) ? S.grid[gy][gx] : null; }

// Tukar grid aktif tanpa DOM: dipakai muat simpan dan pindah map.
function applyMap(name) {
  const m = S.maps[name];
  S.map = name;
  S.grid = m.grid;
  GRID_W = m.w; GRID_H = m.h;
}

// ---- v35: housing, wagon ----
// Pemakaian housing: tiap bangunan menambah angka; patung tidak memakai.
function housingUsed() {
  let n = S.machines.size * HOUSING_COST.machine
    + S.conveyors.size * HOUSING_COST.conveyor
    + S.storages.size * HOUSING_COST.storage
    + S.walls.size * HOUSING_COST.wall;
  for (const d of S.decor.values()) if (!STATUES[d.id]) n += HOUSING_COST.decor;
  return n;
}
// Batas housing: dasar 600 + bonus patung yang sudah ditaruh.
function housingMax() {
  let m = HOUSING_BASE;
  for (const d of S.decor.values()) if (STATUES[d.id]) m += STATUES[d.id].bonus;
  return m;
}
// Biaya housing satu item bangun (dipakai canPlace + confirmPlace).
function housingCostOf(placing) {
  if (!placing) return 0;
  if (placing.kind === 'statue') return HOUSING_COST.statue;
  return HOUSING_COST[placing.kind] || 0;
}
// Kapasitas peti wagon; wagon belum dibeli = 0.
function wagonCap() {
  return S.wagon ? WAGON_LEVELS[S.wagon.level - 1].cap : 0;
}
function wagonItemsTotal() {
  return S.wagon ? bufferTotal(S.wagon.items) : 0;
}
// Pengali kecepatan saat naik wagon (kuda 0/1/2). Jalan kaki = 1x.
function wagonSpeedMult() {
  return S.wagon ? WAGON_SPEED_MULT[S.wagon.horses] : 1;
}
function isRiding() { return !!(S.wagon && S.wagon.riding); }

// Pindah map: titik lahir tetap sesuai desain (masuk plot di depan
// jalan keluar, kembali ke kota di samping jalan masuk), bukan posisi lama.
// spawn {fx, fy} opsional: pintu keluar dan kereta mengisi titik lahirnya.
function switchMap(name, spawn) {
  const p = S.player;
  p.path = []; p.onArrive = null; p.working = null;
  applyMap(name);
  const pos = spawn || defaultSpawn(name);
  p.fx = pos.fx; p.fy = pos.fy; p.dir = pos.dir === undefined ? 3 : pos.dir;
  // Naik wagon ikut pindah map: wagon muncul di samping pemain di map baru.
  if (isRiding()) {
    S.wagon.map = name;
    S.wagon.gx = Math.floor(p.fx); S.wagon.gy = Math.floor(p.fy);
  }
  if (typeof centerCamera === 'function' && typeof VW !== 'undefined') {
    centerCamera(VW, VH);
  }
  TOAST(name === 'plot' ? 'Masuk ke lahanmu.' : name === 'town' ? 'Kembali ke kota.' : 'Tiba di ' + currentBlockName() + '.');
  if (typeof UI !== 'undefined') UI.refreshHUD();
  saveSoon();
}

function defaultSpawn(name) {
  if (name === 'plot') {
    const g = gatePos();
    return { fx: g.gx + 0.5, fy: g.gy - 0.5, dir: 3 };
  }
  // v49: masuk kota dari lahan/enam map lain lewat gerbang utara (jembatan),
  // jadi lahir satu petak di selatan jembatan.
  if (name === 'town') return { fx: 8.5, fy: 1.5, dir: 1 };
  return { fx: 8.5, fy: 6.5, dir: 3 };
}

// Perbesar grid plot: tepi bawah dan tepi kiri TETAP, supaya jalan keluar
// (Agus (1,9), petak (8, h-1)) tidak bergeser dan tidak ada jalan yang
// ketinggalan di tengah lahan. Kolom baru tumbuh ke kanan (z membesar),
// baris baru tumbuh ke atas (x membesar). Isi grid lama ikut turun
// bersama jangkar bawahnya; mesin (koordinat mutlak di S.machines) tetap
// di petaknya, tanah di bawahnya tetap rumput karena jalan cuma satu
// petak dan tidak bisa dibangun di atasnya.
function expandPlotGrid(w, h) {
  const old = S.maps.plot;
  const g = makeGrid(w, h);
  const dy = h - old.h; // jangkar bawah: baris lama turun sejauh selisih tinggi
  for (let gy = 0; gy < old.h; gy++)
    for (let gx = 0; gx < old.w; gx++) g[gy + dy][gx] = old.grid[gy][gx];
  stampPlotColumns(g); // v49: baris baru di atas ikut dapat sungai/jalan/rel
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
