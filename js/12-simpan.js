// Simpan otomatis ke localStorage. Disimpan throttled: saveSoon menandai,
// loop utama menulis paling cepat tiap 5 detik.
let saveDirty = false;
let saveTimer = 0;
let saveBlocked = false; // reset: cegah pagehide menulis ulang simpan yang baru dihapus

// v35: 4 slot save (wiki Plots). Slot 1 memakai kunci lama supaya simpan
// v2 langsung menjadi slot 1; slot 2-4 kunci turunan. Meta menyimpan slot
// terakhir yang dimuat (0 = tidak ada slot dimuat).
const SLOT_KEYS = [null, SAVE_KEY, SAVE_KEY + '-s2', SAVE_KEY + '-s3', SAVE_KEY + '-s4'];
const SLOT_META_KEY = SAVE_KEY + '-slot';
// v36: slot mana yang sudah dibuka (dibayar) — disimpan terpisah dari data
// slot, supaya slot yang dihapus (reset) tetap dihitung terbuka.
const SLOT_UNLOCK_KEY = SAVE_KEY + '-unlocked';
function slotKey(slot) { return SLOT_KEYS[slot] || SAVE_KEY; }
function currentSlotFromMeta() {
  try {
    const n = parseInt(localStorage.getItem(SLOT_META_KEY) || '1', 10);
    return n >= 0 && n <= 4 ? n : 1;
  } catch (_) { return 1; }
}
// Isi mentah satu slot (null kalau kosong). Dipakai menu plot tanpa memuat.
function readSlotData(slot) {
  try { return JSON.parse(localStorage.getItem(slotKey(slot)) || 'null'); } catch (_) { return null; }
}
function slotInfo(slot) {
  const d = readSlotData(slot);
  if (!d || d.v !== 2) return null;
  return { money: d.money, expansion: d.expansion || 0, w: (d.maps && d.maps.plot && d.maps.plot.w) || PLOT_BASE_W, h: (d.maps && d.maps.plot && d.maps.plot.h) || PLOT_BASE_H };
}

function saveSoon() { saveDirty = true; }

function flatNodes(grid) {
  return grid.flat().map((t) => ({ t: t.t, obj: t.obj, hp: t.hp, regrowIn: t.regrowIn, stage: t.stage || 0, growIn: t.growIn || 0 }));
}

function saveGame() {
  if (saveBlocked) return;
  if (!S.saveSlot) return; // v35: tidak ada slot dimuat (habis lepas save) = tidak menulis
  try {
    const maps = {};
    for (const [name, m] of Object.entries(S.maps)) maps[name] = { w: m.w, h: m.h, nodes: flatNodes(m.grid) };
    const data = {
      v: 2, money: S.money, inv: S.inv, unlocked: S.unlocked,
      map: S.map, expansion: S.expansion, autoSeller: S.autoSeller, admin: S.admin,
      machines: [...S.machines], conveyors: [...S.conveyors],
      storages: [...S.storages], walls: [...S.walls], decor: [...S.decor],
      player: { fx: S.player.fx, fy: S.player.fy, dir: S.player.dir },
      maps,
      tut: S.tut, tutDone: S.tutDone, tutStarted: S.tutStarted, stats: S.stats, settings: S.settings,
      tools: S.tools, badges: S.badges, wagon: S.wagon, saveSlot: S.saveSlot,
    };
    localStorage.setItem(slotKey(S.saveSlot), JSON.stringify(data));
    try { localStorage.setItem(SLOT_META_KEY, String(S.saveSlot)); } catch (_) { /* abaikan */ }
    saveDirty = false;
  } catch (_) { /* penyimpanan penuh/diblokir: game tetap jalan */ }
}

function restoreNodes(saved, fallbackW, fallbackH) {
  const g = makeGrid(saved.w || fallbackW, saved.h || fallbackH);
  (saved.nodes || []).forEach((n, i) => {
    const w = saved.w || fallbackW;
    const t = g[Math.floor(i / w)][i % w];
    if (t) { t.t = n.t; t.obj = n.obj; t.hp = n.hp; t.regrowIn = n.regrowIn; t.stage = n.stage || 0; t.growIn = n.growIn || 0; }
  });
  return { w: saved.w || fallbackW, h: saved.h || fallbackH, grid: g };
}

function loadGame() {
  // v35: muat slot terakhir (meta); kosong = mulai baru di slot itu.
  const slot = currentSlotFromMeta();
  S.saveSlot = slot;
  let data = readSlotData(slot);
  if (!data) return false;
  if (data.v !== 2) return false; // kunci v2 tidak pernah berisi simpan v1
  S.money = data.money;
  S.inv = data.inv || {};
  S.unlocked = data.unlocked || { sawhorse: true, splitter: true };
  S.expansion = data.expansion || 0;
  S.autoSeller = !!data.autoSeller;
  S.admin = !!data.admin; // simpan lama tanpa kunci admin = OFF
  S.tools = Object.assign({ axe: 1, shovel: 1, pickaxe: 1 }, data.tools || {});
  S.badges = data.badges || {};
  // Simpan lama: badge diberikan untuk resep yang sudah terbuka.
  for (const [mid, bid] of Object.entries(RESEARCH_BADGE)) if (S.unlocked[mid]) S.badges[bid] = true;
  S.wagon = data.wagon || null;
  S.machines = new Map(data.machines || []);
  S.conveyors = new Map(data.conveyors || []);
  S.storages = new Map(data.storages || []);
  S.walls = new Map(data.walls || []);
  S.decor = new Map(data.decor || []);
  if (data.town) S.maps.town = restoreNodes(data.town, TOWN_W, TOWN_H);
  if (data.plot) S.maps.plot = restoreNodes(data.plot, PLOT_BASE_W, PLOT_BASE_H);
  if (data.maps) {
    for (const [name, saved] of Object.entries(data.maps)) {
      if (S.maps[name]) S.maps[name] = restoreNodes(saved, S.maps[name].w, S.maps[name].h);
    }
  }
  // Simpan v2 lama (sebelum jalan/rel v14, sebelum toko disebar v18,
  // sebelum peron hutan pindah v19, sebelum air/jembatan/jalan v23,
  // sebelum pad/peron kota pindah v25, sebelum gerbang/pad jadi jalan v28):
  // bangun ulang map statis supaya jalan, rel, posisi toko, posisi
  // peron/kereta hutan, air/jembatan/jalan, dan posisi pad/peron kota
  // yang baru muncul; progres pemain (uang, tas, mesin, lahan) tetap.
  // Lahan dibangun ulang terpisah (bukan bagian buildStaticMaps) dan
  // hanya kalau petak keluarnya masih lama, supaya simpan yang sudah
  // baru tidak dibangun ulang tiap muat.
  const townStale = S.maps.town && (S.maps.town.w !== TOWN_W || S.maps.town.h !== TOWN_H
    || !S.maps.town.grid.flat().some((t) => t.t === 'road')
    || !SHOP_SPOTS.filter((s) => s.map === 'town').every((s) => S.maps.town.grid[s.gy][s.gx].obj === 'shop_' + s.id)
    || S.maps.town.grid[13][8].t !== 'road'
    || S.maps.town.grid[7][1].obj !== 'lantern'
    // v51: Mayor di (7,13) — simpan v50 punya petak putih di situ, jadi ke sini ikut bangun ulang.
    || S.maps.town.grid[13][7].obj !== 'mayor'
    || S.maps.town.grid[4][5].obj !== 'wagonShop'); // v54: wagonShop 2×2 pindah ke (5,4)
  const meadowNStale = S.maps.meadow_n && (S.maps.meadow_n.grid[5][4].obj !== 'plotpad'
    || S.maps.meadow_n.grid[5][5].obj !== 'plotsign'); // v51 petak putih, v52 papan PLOT
  const forestStale = S.maps.forest && (S.maps.forest.grid[7][9].obj !== 'train'
    || S.maps.forest.grid[7][10].obj !== 'station' // v51: stasiun di timur rel
    || S.maps.forest.grid[0][8].t !== 'bridge' || S.maps.forest.grid[5][12].obj !== 'dyeplant');
  const harborStale = S.maps.harbor && !SHOP_SPOTS.filter((s) => s.map === 'harbor').every((s) => S.maps.harbor.grid[s.gy][s.gx].obj === 'shop_' + s.id);
  // v52: tiap map berstasiun harus punya lokomotif + gerbong (2 petak).
  const keretaStale = ['ice', 'forest', 'town', 'harbor'].some((n) => {
    const m = S.maps[n];
    if (!m) return false;
    const flat = m.grid.flat();
    return flat.filter((t) => t.obj === 'train').length !== 1 || flat.filter((t) => t.obj === 'trainCar').length !== 1;
  });
  // v49: lahan harus punya dua gerbang jalan (8,0) dan (8, h-1) plus kolom
  // sungai/jalan/rel; lahan lama (satu jalan di gerbang bawah) dibangun ulang
  // di ukuran yang sekarang, mesin dan ekspansinya tetap.
  const pg = S.maps.plot ? gatePos() : null;
  const plotStale = S.maps.plot && (S.maps.plot.grid[pg.gy][pg.gx].t !== 'road'
    || S.maps.plot.grid[0][8].t !== 'road'
    || S.maps.plot.grid[Math.floor(S.maps.plot.h / 2)][1].t !== 'water'
    || S.maps.plot.grid[Math.floor(S.maps.plot.h / 2)][9].t !== 'railY'
    // v52: simpan v51 punya bangunan beli wagon di lahan (5, h-2) — sekarang
    // bangunannya di kota, jadi lahan yang masih menyimpannya dibangun ulang
    // sekali. Cek ini SENGAJA "masih ada" (bukan "harus ada"), karena setelah
    // v52 lahan tidak lagi memuat bangunan itu — kalau dibalik, lahan akan
    // dibangun ulang tiap kali dimuat.
    || S.maps.plot.grid[S.maps.plot.h - 2][5].obj === 'wagonShop');
  if (townStale || meadowNStale || forestStale || harborStale || keretaStale) {
    const sm = buildStaticMaps();
    for (const [name, m] of Object.entries(sm)) S.maps[name] = m;
  }
  if (plotStale) {
    // Lahan: dua gerbang jalan + kolom sungai/rel, sisanya rumput — di
    // ukuran lahan saat ini (ekspansi ikut terjaga), supaya jalan keluar
    // tetap di gerbang (8, h-1) = Agus (1,9).
    const m = S.maps.plot;
    const g = makeGrid(m.w, m.h);
    stampPlotColumns(g);
    S.maps.plot = { w: m.w, h: m.h, grid: g };
  }
  applyMap(S.maps[data.map] ? data.map : 'town');
  if (data.player) {
    S.player.fx = data.player.fx; S.player.fy = data.player.fy; S.player.dir = data.player.dir;
  }
  S.tut = data.tut || 0; S.tutDone = !!data.tutDone;
  // Simpan lama tanpa kunci tutStarted: yang sudah di tengah tutorial
  // dianggap sudah mulai (ajakan tidak nongol lagi).
  S.tutStarted = !!data.tutStarted || S.tut > 0;
  S.stats = data.stats || { harvested: {}, crafted: {}, sold: {} };
  S.settings = Object.assign({ sound: true, ruler: true }, data.settings || {}); // simpan lama tanpa kunci ruler = ON
  return true;
}

function resetSave() {
  saveBlocked = true;
  try {
    localStorage.removeItem(slotKey(S.saveSlot));
    localStorage.removeItem(SLOT_META_KEY);
  } catch (_) { /* abaikan */ }
}

// ---- v35: operasi slot save ----
// Keadaan baru yang bersih (dipakai slot kosong + lepas save).
function resetLiveState() {
  S.money = 50; S.inv = {}; S.unlocked = { sawhorse: true, splitter: true };
  S.expansion = 0; S.autoSeller = false; S.autoSellerT = 0; S.admin = false;
  S.tools = { axe: 1, shovel: 1, pickaxe: 1 }; S.badges = {}; S.wagon = null;
  S.tut = 0; S.tutDone = false; S.tutStarted = false;
  S.stats = { harvested: {}, crafted: {}, sold: {} };
  S.player.fx = 8.5; S.player.fy = 6.5; S.player.dir = 3;
  S.player.path = []; S.player.onArrive = null; S.player.working = null;
}
// Muat slot n: simpan slot sekarang dulu, lalu muat target (kosong = baru).
// Kembalikan 'loaded' / 'fresh' / 'locked' (uang tidak cukup buka slot).
// v36: buka slot 2/3/4 bayar (SLOT_UNLOCK_COST, wiki Plots); slot dengan
// data dihitung sudah terbuka; biaya dipotong dari uang slot sekarang.
function slotUnlocked(n) {
  if (n <= 1) return true;
  if (readSlotData(n)) return true;
  try {
    const u = JSON.parse(localStorage.getItem(SLOT_UNLOCK_KEY) || '{}');
    return !!u[n];
  } catch (_) { return false; }
}
function buySlot(n) {
  if (n <= 1 || slotUnlocked(n)) return true;
  const cost = SLOT_UNLOCK_COST[n];
  if (!adminOn() && S.money < cost) return false;
  if (!adminOn()) S.money -= cost;
  try {
    const u = JSON.parse(localStorage.getItem(SLOT_UNLOCK_KEY) || '{}');
    u[n] = true;
    localStorage.setItem(SLOT_UNLOCK_KEY, JSON.stringify(u));
  } catch (_) { /* abaikan */ }
  saveSoon();
  return true;
}
function loadSlot(n) {
  if (n < 1 || n > 4) return null;
  if (n > 1 && !slotUnlocked(n) && !buySlot(n)) return 'locked';
  if (S.saveSlot) saveGame();
  const data = readSlotData(n);
  S.saveSlot = n;
  if (!data || data.v !== 2) {
    resetLiveState();
    buildMap();
    saveGame();
    return 'fresh';
  }
  // Muat dari JSON slot target: pakai jalur loadGame yang sama.
  try { localStorage.setItem(SLOT_META_KEY, String(n)); } catch (_) { /* abaikan */ }
  buildMap();
  loadGame();
  return 'loaded';
}
// Lepas save: simpan slot sekarang, lalu kosongkan keadaan (tidak ada slot
// dimuat); simpan tersimpan tetap ada dan bisa dimuat lagi dari menu plot.
function unloadSlot() {
  if (!S.saveSlot) return false;
  saveGame();
  resetLiveState();
  buildMap();
  S.saveSlot = 0;
  try { localStorage.setItem(SLOT_META_KEY, '0'); } catch (_) { /* abaikan */ }
  saveDirty = false;
  return true;
}
// Reset sebagian isi slot: 'items' (tas + buffer mesin + conveyor),
// 'buildings' (semua bangunan), atau 'upgrades' (ekspansi kembali 0).
// Slot yang sedang dimuat diubah langsung; slot lain diubah di JSON-nya.
function resetSlotPart(slot, part) {
  if (slot < 1 || slot > 4) return false;
  if (slot === S.saveSlot) {
    if (part === 'items') {
      S.inv = {};
      for (const m of S.machines.values()) { m.input = {}; m.output = {}; }
      for (const c of S.conveyors.values()) c.item = null;
    } else if (part === 'buildings') {
      S.machines.clear(); S.conveyors.clear(); S.storages.clear(); S.walls.clear(); S.decor.clear();
    } else if (part === 'upgrades') {
      S.expansion = 0;
      const g = buildPlot();
      S.maps.plot = { w: PLOT_BASE_W, h: PLOT_BASE_H, grid: g };
      // Bangunan di luar lahan dasar ikut terhapus (tidak muat lagi).
      for (const k of [...S.machines.keys()]) { const [gx, gy] = k.split(',').map(Number); if (gx >= PLOT_BASE_W || gy >= PLOT_BASE_H) S.machines.delete(k); }
      for (const k of [...S.conveyors.keys()]) { const [gx, gy] = k.split(',').map(Number); if (gx >= PLOT_BASE_W || gy >= PLOT_BASE_H) S.conveyors.delete(k); }
      for (const k of [...S.storages.keys()]) { const [gx, gy] = k.split(',').map(Number); if (gx >= PLOT_BASE_W || gy >= PLOT_BASE_H) S.storages.delete(k); }
      for (const k of [...S.walls.keys()]) { const [gx, gy] = k.split(',').map(Number); if (gx >= PLOT_BASE_W || gy >= PLOT_BASE_H) S.walls.delete(k); }
      for (const k of [...S.decor.keys()]) { const [gx, gy] = k.split(',').map(Number); if (gx >= PLOT_BASE_W || gy >= PLOT_BASE_H) S.decor.delete(k); }
      if (S.map === 'plot') applyMap('plot');
    } else return false;
    saveGame();
    return true;
  }
  const data = readSlotData(slot);
  if (!data || data.v !== 2) return false;
  if (part === 'items') {
    data.inv = {};
    (data.machines || []).forEach(([, m]) => { m.input = {}; m.output = {}; });
    (data.conveyors || []).forEach(([, c]) => { c.item = null; });
  } else if (part === 'buildings') {
    data.machines = []; data.conveyors = []; data.storages = []; data.walls = []; data.decor = [];
  } else if (part === 'upgrades') {
    data.expansion = 0;
    const g = buildPlot();
    data.maps.plot = { w: PLOT_BASE_W, h: PLOT_BASE_H, nodes: flatNodes(g) };
    const keep = ([k]) => { const [gx, gy] = k.split(',').map(Number); return gx < PLOT_BASE_W && gy < PLOT_BASE_H; };
    data.machines = (data.machines || []).filter(keep);
    data.conveyors = (data.conveyors || []).filter(keep);
    data.storages = (data.storages || []).filter(keep);
    data.walls = (data.walls || []).filter(keep);
    data.decor = (data.decor || []).filter(keep);
  } else return false;
  try { localStorage.setItem(slotKey(slot), JSON.stringify(data)); } catch (_) { return false; }
  return true;
}
