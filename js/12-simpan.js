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
    const data = {
      v: 2, money: S.money, inv: S.inv, unlocked: S.unlocked,
      map: S.map, expansion: S.expansion, autoSeller: S.autoSeller,
      machines: [...S.machines], conveyors: [...S.conveyors],
      storages: [...S.storages], walls: [...S.walls], decor: [...S.decor],
      player: { fx: S.player.fx, fy: S.player.fy, dir: S.player.dir },
      town: { w: S.maps.town.w, h: S.maps.town.h, nodes: flatNodes(S.maps.town.grid) },
      plot: { w: S.maps.plot.w, h: S.maps.plot.h, nodes: flatNodes(S.maps.plot.grid) },
      tut: S.tut, tutDone: S.tutDone, stats: S.stats, settings: S.settings,
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
  if (data.v === 1) return migrateV1(data);
  if (data.v !== 2) return false;
  S.money = data.money;
  S.inv = data.inv || {};
  S.unlocked = data.unlocked || { sawhorse: true, splitter: true };
  S.expansion = data.expansion || 0;
  S.autoSeller = !!data.autoSeller;
  S.machines = new Map(data.machines || []);
  S.conveyors = new Map(data.conveyors || []);
  S.storages = new Map(data.storages || []);
  S.walls = new Map(data.walls || []);
  S.decor = new Map(data.decor || []);
  if (data.town) S.maps.town = restoreNodes(data.town, TOWN_W, TOWN_H);
  if (data.plot) S.maps.plot = restoreNodes(data.plot, PLOT_BASE_W, PLOT_BASE_H);
  applyMap(data.map === 'plot' ? 'plot' : 'town');
  if (data.player) {
    S.player.fx = data.player.fx; S.player.fy = data.player.fy; S.player.dir = data.player.dir;
  }
  S.tut = data.tut || 0; S.tutDone = !!data.tutDone;
  S.stats = data.stats || { harvested: {}, crafted: {}, sold: {} };
  S.settings = data.settings || { sound: true };
  return true;
}

// Migrasi simpan v1 (satu grid campuran): bangunan pemain pindah ke plot,
// sumber daya muncul segar di kota, pemain mulai di kota. Kunci simpan sama.
function migrateV1(data) {
  S.money = data.money;
  S.inv = data.inv || {};
  S.unlocked = data.unlocked || { sawhorse: true, splitter: true };
  S.machines = new Map(data.machines || []);
  S.conveyors = new Map(data.conveyors || []);
  S.storages = new Map(data.storages || []);
  S.walls = new Map(data.walls || []);
  S.decor = new Map(data.decor || []);
  S.expansion = 0; S.autoSeller = false;
  applyMap('town');
  S.player.fx = 8.5; S.player.fy = 6.5; S.player.dir = 1;
  S.tut = data.tut || 0; S.tutDone = !!data.tutDone;
  S.stats = data.stats || { harvested: {}, crafted: {}, sold: {} };
  S.settings = data.settings || { sound: true };
  saveSoon();
  return true;
}

function resetSave() {
  saveBlocked = true;
  try { localStorage.removeItem(SAVE_KEY); } catch (_) { /* abaikan */ }
}
