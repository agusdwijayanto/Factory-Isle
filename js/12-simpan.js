// Simpan otomatis ke localStorage. Disimpan throttled: saveSoon menandai,
// loop utama menulis paling cepat tiap 5 detik.
let saveDirty = false;
let saveTimer = 0;
let saveBlocked = false; // reset: cegah pagehide menulis ulang simpan yang baru dihapus

function saveSoon() { saveDirty = true; }

function flatNodes(grid) {
  return grid.flat().map((t) => ({ t: t.t, obj: t.obj, hp: t.hp, regrowIn: t.regrowIn }));
}

function saveGame() {
  if (saveBlocked) return;
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
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    saveDirty = false;
  } catch (_) { /* penyimpanan penuh/diblokir: game tetap jalan */ }
}

function restoreNodes(saved, fallbackW, fallbackH) {
  const g = makeGrid(saved.w || fallbackW, saved.h || fallbackH);
  (saved.nodes || []).forEach((n, i) => {
    const w = saved.w || fallbackW;
    const t = g[Math.floor(i / w)][i % w];
    if (t) { t.t = n.t; t.obj = n.obj; t.hp = n.hp; t.regrowIn = n.regrowIn; }
  });
  return { w: saved.w || fallbackW, h: saved.h || fallbackH, grid: g };
}

function loadGame() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (_) { /* rusak: mulai baru */ }
  if (!data) return false;
  if (data.v !== 2) return false; // kunci v2 tidak pernah berisi simpan v1
  S.money = data.money;
  S.inv = data.inv || {};
  S.unlocked = data.unlocked || { sawhorse: true, splitter: true };
  S.expansion = data.expansion || 0;
  S.autoSeller = !!data.autoSeller;
  S.admin = !!data.admin; // simpan lama tanpa kunci admin = OFF
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
  const townStale = S.maps.town && (!S.maps.town.grid.flat().some((t) => t.t === 'road')
    || !SHOP_SPOTS.filter((s) => s.map === 'town').every((s) => S.maps.town.grid[s.gy][s.gx].obj === 'shop_' + s.id)
    || S.maps.town.grid[11][8].t !== 'road'
    || S.maps.town.grid[7][1].obj !== 'lantern');
  const forestStale = S.maps.forest && (S.maps.forest.grid[9][14].obj !== 'train' || S.maps.forest.grid[0][8].t !== 'bridge');
  const mountainStale = S.maps.mountain && S.maps.mountain.grid[5][1].t !== 'water';
  // Jalan keluar harus satu-satunya petak jalan, tepat di gerbang (8, h-1).
  // Simpan lama hasil ekspansi anchoring kiri-atas punya jalan ketinggalan
  // di (8,11) sementara gerbangnya sudah di bawahnya.
  const pg = S.maps.plot ? gatePos() : null;
  const plotStale = S.maps.plot && (S.maps.plot.grid[pg.gy][pg.gx].t !== 'road'
    || S.maps.plot.grid.flat().filter((t) => t.t === 'road').length !== 1);
  if (townStale || forestStale || mountainStale) {
    const sm = buildStaticMaps();
    for (const [name, m] of Object.entries(sm)) S.maps[name] = m;
  }
  if (plotStale) {
    // Lahan: petak keluar jadi jalan, sisanya rumput — di ukuran lahan
    // saat ini (ekspansi ikut terjaga), supaya jalan keluar tetap di
    // gerbang (8, h-1) = Agus (1,9).
    const m = S.maps.plot;
    const g = makeGrid(m.w, m.h);
    const gp = gatePos();
    roadAt(g, [[gp.gx, gp.gy]]);
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
  try { localStorage.removeItem(SAVE_KEY); } catch (_) { /* abaikan */ }
}
