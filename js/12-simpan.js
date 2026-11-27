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
    || S.maps.town.grid[9][10].t !== 'road' // v59: jangkar jalan pindah ke baris 9 (x=11)
    || S.maps.town.grid[7][1].obj !== 'lantern'
    // v51: Mayor di (7,13) — simpan v50 punya petak putih di situ, jadi ke sini ikut bangun ulang.
    || S.maps.town.grid[13][7].obj !== 'mayor'
    || S.maps.town.grid[4][5].obj !== 'wagonShop' // v54: wagonShop 2×2 pindah ke (5,4)
    // v56: sungai keluar dari kota (jembatan utara, sungai kolom 18, dan
    // papan COMING SOON dihapus) — simpan lama yang masih punya dibangun ulang.
    || S.maps.town.grid[0][8].t === 'bridge'
    || S.maps.town.grid[1][18].t === 'water'
    || S.maps.town.grid[6][0].obj === 'signClosed'
    // v57: koridor pindah ke kanan (jalan kolom 17, rel kolom 18, stasiun
    // (19,7)) — simpan lama yang masih punya koridor kolom 8/9 dibangun ulang.
    // v59: jalan+stasiun+kereta pindah (jalan baris 9 + kolom 14, stasiun
    // (19,10)) — simpan v58 yang masih punya lokomotif (18,7) dibangun ulang.
    || S.maps.town.grid[7][9].obj === 'train'
    || S.maps.town.grid[7][18].obj === 'train'
    || S.maps.town.grid[0][8].t === 'road'
    || S.maps.town.grid[0][9].t === 'railY'
    || S.maps.town.grid[10][14].obj === 'lantern');
  const meadowNStale = S.maps.meadow_n && (S.maps.meadow_n.grid[9][10].obj !== 'plotpad'
    || S.maps.meadow_n.grid[9][11].obj !== 'plotsign' // v59: petak putih pindah ke Blok 6 (10,9)
    // v56: sungai dan rel keluar dari Padang Rumput (Blok 3+6).
    || S.maps.meadow_n.grid[0][9].t === 'railY'
    || S.maps.meadow_n.grid[0][1].t === 'water'
    // v57: jalan pindah (baris 8/10 + kolom 10, cabang 14) — simpan lama
    // yang masih punya jalan kolom 8 / cabang barat baris 14 dibangun ulang.
    // v59: jalan cuma baris 9 — simpan v58 yang masih punya jalan baris 8/10 dibangun ulang.
    || S.maps.meadow_n.grid[0][8].t === 'road'
    || S.maps.meadow_n.grid[14][0].t === 'road'
    || S.maps.meadow_n.grid[8][0].t === 'road'
    || S.maps.meadow_n.grid[10][0].t === 'road'
    // v60: jalan utara persis (11,1-5) — simpan v59 yang masih punya jalan
    // baris 9 sampai z=10 (perpanjangan v59) dibangun ulang.
    || S.maps.meadow_n.grid[9][7].t === 'road'
    || S.maps.meadow_n.grid[7][10].obj === 'lantern');
  // v55: stasiun kereta pindah dari Hutan Lebat ke Hutan Kapas (Forestry).
  // Hutan Lebat baru TIDAK punya stasiun/kereta; simpan lama yang masih
  // menyimpannya dibangun ulang sekali (cek "masih ada", bukan "harus ada").
  const forestStale = S.maps.forest && (S.maps.forest.grid[7][9].obj === 'train'
    || S.maps.forest.grid[7][10].obj === 'station'
    // v57: jangkar jalan pindah ke kolom 17 (kanan) + dyeplant pindah ke
    // (12,6) (rel baris 5); simpan lama yang masih punya jalan kolom 8 /
    // dyeplant (12,5) dibangun ulang.
    // v59: jangkar jalan pindah ke baris 14 (x=6); rel kembali ke baris 17
    // (x=3) — penanda rel baris 17 lama DIHAPUS supaya tidak membangun ulang
    // simpan v59 tiap muat. Simpan v58 yang masih punya jalan baris 8 /
    // rel baris 5 dibangun ulang.
    || S.maps.forest.grid[14][10].t !== 'road'
    || S.maps.forest.grid[6][12].obj !== 'dyeplant'
    || S.maps.forest.grid[1][1].t === 'water'
    || S.maps.forest.grid[0][9].t === 'railY'
    || S.maps.forest.grid[0][8].t === 'road'
    || S.maps.forest.grid[8][10].t === 'road'
    || S.maps.forest.grid[5][10].t === 'railX'
    || S.maps.forest.grid[5][12].obj === 'dyeplant');
  // v56: Hutan Kapas kehilangan stasiun/kereta/rel — simpan lama yang masih
  // punya dibangun ulang sekali (cek "masih ada").
  const forest2Stale = S.maps.forest2 && (S.maps.forest2.grid[7][9].obj === 'train'
    || S.maps.forest2.grid[7][10].obj === 'station'
    || S.maps.forest2.grid[0][9].t === 'railY'
    // v57: jalan pindah ke baris 10 + kolom 5 — simpan lama yang masih
    // punya jalan kolom 8 / baris 5 dibangun ulang.
    // v59: jalan pindah (baris 9 + kolom 5 utara + kolom 14 selatan) —
    // simpan v58 yang masih punya jalan baris 10 dibangun ulang.
    || S.maps.forest2.grid[0][8].t === 'road'
    || S.maps.forest2.grid[5][10].t === 'road'
    || S.maps.forest2.grid[10][10].t === 'road');
  // v56: sungai Padang Rumput Selatan pindah (kolom 18 -> kolom 1 + baris 11).
  const meadowSStale = S.maps.meadow_s && (S.maps.meadow_s.grid[0][18].t === 'water'
    || S.maps.meadow_s.grid[11][1].t !== 'water'
    // v57: jalan pindah (kolom 5/13 + baris 17, rel kolom 18) — simpan lama
    // yang masih punya jalan kolom 8 / rel kolom 9 dibangun ulang.
    // v59: jalan pindah ke baris 5 + kolom 14, rel ke kolom 18 selatan +
    // baris 9 — penanda jalan baris 5 lama DIHAPUS (baris 5 jadi jalan lagi
    // di v59) supaya tidak membangun ulang simpan v59 tiap muat. Simpan v58
    // yang masih punya jalan baris 17 dibangun ulang.
    || S.maps.meadow_s.grid[0][8].t === 'road'
    || S.maps.meadow_s.grid[0][9].t === 'railY'
    || S.maps.meadow_s.grid[17][10].t === 'road'
    // v60: rel selatan tegak (11-20,19) — simpan v59 yang masih punya rel
    // kolom 18 di selatan (baris 10-19) / jembatan (18,11) dibangun ulang.
    || S.maps.meadow_s.grid[15][18].t === 'railY'
    || S.maps.meadow_s.grid[11][18].t === 'bridge');
  const harborStale = S.maps.harbor && (!SHOP_SPOTS.filter((s) => s.map === 'harbor').every((s) => S.maps.harbor.grid[s.gy][s.gx].obj === 'shop_' + s.id)
    // v56: rel masuk dari barat (baris 6), bukan dari utara; sungai masuk dari barat (baris 11).
    || S.maps.harbor.grid[0][9].t === 'railY'
    || S.maps.harbor.grid[11][0].t !== 'water'
    // v57: rel mendatar baris 6 penuh + kereta di ujung timur — simpan lama
    // yang masih punya lokomotif (9,6) / jalan kolom 8 dibangun ulang.
    // v59: jalan+rel+kereta pindah (jalan baris 5, rel baris 9, lokomotif
    // (8,9)) — simpan v58 yang masih punya lokomotif (17,6) dibangun ulang.
    || S.maps.harbor.grid[6][9].obj === 'train'
    || S.maps.harbor.grid[6][17].obj === 'train'
    || S.maps.harbor.grid[0][8].t === 'road');
  // v57: Gunung Es rombak total (rel mendatar baris 5, jalan baris 8 +
  // kolom 5) — simpan lama yang masih punya lokomotif (9,7) / jalan baris
  // 18 dibangun ulang sekali (cek "masih ada").
  // v58: Blok 1 ikut angka kunci Agus (x,z) — simpan v57 yang masih punya
  // lokomotif (10,5) / jalan baris 8 dibangun ulang.
  // v59: railStop (3,9) diganti rel biasa — simpan v58 yang masih punya
  // railStop dibangun ulang.
  const iceStale = S.maps.ice && (S.maps.ice.grid[7][9].obj === 'train'
    || S.maps.ice.grid[18][10].t === 'road'
    || S.maps.ice.grid[5][10].obj === 'train'
    || S.maps.ice.grid[8][10].t === 'road'
    || S.maps.ice.grid[17][8].t === 'railStop');
  // v52: tiap map berstasiun harus punya lokomotif + gerbong (2 petak).
  // v56: stasiun cuma di ice, town, harbor (forest2 keluar).
  const keretaStale = ['ice', 'town', 'harbor'].some((n) => {
    const m = S.maps[n];
    if (!m) return false;
    const flat = m.grid.flat();
    return flat.filter((t) => t.obj === 'train').length !== 1 || flat.filter((t) => t.obj === 'trainCar').length !== 1;
  });
  // v56: lahan jadi rumput semua — simpan lama yang masih punya kolom
  // sungai/jalan/rel dibangun ulang sekali (cek "masih ada", bukan "harus
  // ada", supaya lahan baru tidak dibangun ulang tiap muat). Mesin dan
  // ekspansi tetap (mesin tersimpan terpisah di S.machines, bukan di grid).
  const pg = S.maps.plot ? gatePos() : null;
  const plotStale = S.maps.plot && (S.maps.plot.grid[pg.gy][pg.gx].t === 'road'
    || S.maps.plot.grid[0][8].t === 'road'
    || S.maps.plot.grid[Math.floor(S.maps.plot.h / 2)][1].t === 'water'
    || S.maps.plot.grid[Math.floor(S.maps.plot.h / 2)][9].t === 'railY'
    // v52: simpan v51 punya bangunan beli wagon di lahan (5, h-2) — sekarang
    // bangunannya di kota, jadi lahan yang masih menyimpannya dibangun ulang
    // sekali. Cek ini SENGAJA "masih ada" (bukan "harus ada"), karena setelah
    // v52 lahan tidak lagi memuat bangunan itu — kalau dibalik, lahan akan
    // dibangun ulang tiap kali dimuat.
    || S.maps.plot.grid[S.maps.plot.h - 2][5].obj === 'wagonShop');
  if (townStale || meadowNStale || forestStale || forest2Stale || meadowSStale || harborStale || iceStale || keretaStale) {
    const sm = buildStaticMaps();
    for (const [name, m] of Object.entries(sm)) S.maps[name] = m;
  }
  if (plotStale) {
    // Lahan: rumput semua di ukuran lahan saat ini (ekspansi ikut terjaga),
    // gerbang keluar tetap di (8, h-1) = Agus (1,9) dan (8,0) — keduanya
    // gerbang koordinat, bukan terrain.
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
