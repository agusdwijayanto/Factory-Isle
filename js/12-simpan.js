// Simpan otomatis ke localStorage. Disimpan throttled: saveSoon menandai,
// loop utama menulis paling cepat tiap 5 detik.
let saveDirty = false;
let saveTimer = 0;
let saveBlocked = false; // reset: cegah pagehide menulis ulang simpan yang baru dihapus

function saveSoon() { saveDirty = true; }

function saveGame() {
  if (saveBlocked) return;
  try {
    const data = {
      v: 1, money: S.money, inv: S.inv, unlocked: S.unlocked,
      machines: [...S.machines], conveyors: [...S.conveyors],
      storages: [...S.storages], walls: [...S.walls], decor: [...S.decor],
      player: { fx: S.player.fx, fy: S.player.fy, dir: S.player.dir },
      nodes: S.grid.flat().map((t) => ({ t: t.t, obj: t.obj, hp: t.hp, regrowIn: t.regrowIn })),
      tut: S.tut, tutDone: S.tutDone, stats: S.stats, settings: S.settings,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    saveDirty = false;
  } catch (_) { /* penyimpanan penuh/diblokir: game tetap jalan */ }
}

function loadGame() {
  let data = null;
  try { data = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch (_) { /* rusak: mulai baru */ }
  if (!data || data.v !== 1) return false;
  S.money = data.money;
  S.inv = data.inv || {};
  S.unlocked = data.unlocked || { sawhorse: true, splitter: true };
  S.machines = new Map(data.machines || []);
  S.conveyors = new Map(data.conveyors || []);
  S.storages = new Map(data.storages || []);
  S.walls = new Map(data.walls || []);
  S.decor = new Map(data.decor || []);
  if (data.player) {
    S.player.fx = data.player.fx; S.player.fy = data.player.fy; S.player.dir = data.player.dir;
  }
  if (data.nodes) {
    data.nodes.forEach((n, i) => {
      const t = S.grid[Math.floor(i / GRID_W)][i % GRID_W];
      t.t = n.t; t.obj = n.obj; t.hp = n.hp; t.regrowIn = n.regrowIn;
    });
  }
  S.tut = data.tut || 0; S.tutDone = !!data.tutDone;
  S.stats = data.stats || { harvested: {}, crafted: {}, sold: {} };
  S.settings = data.settings || { sound: true };
  return true;
}

function resetSave() {
  saveBlocked = true;
  try { localStorage.removeItem(SAVE_KEY); } catch (_) { /* abaikan */ }
}
