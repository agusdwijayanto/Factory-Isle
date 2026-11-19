// Mesin dan conveyor. Semua mesin mengolah sendiri kalau bahannya ada,
// termasuk Sawhorse: tetap jalan walau pemain sedang di kota.
// Tree Generator dan Harvester tidak punya resep (bukan crafting): siklus
// mereka di bawah, memakai m.progress sebagai pewaktu siklus.
const TREEGEN_SECS = 20;   // sekali tumbuh 1 pohon (dipilih sendiri)
const HARVESTER_SECS = 12; // sekali tebang 1 pohon jadi 3 Log (dipilih sendiri)
const HARVEST_LOGS = 3;    // hasil 1 pohon penuh, sama seperti ditebang pemain

function newMachine(id, dir) {
  return { id, dir, recipe: 0, input: {}, output: {}, progress: 0, stopped: false };
}

function updateMachines(dt) {
  for (const [k, m] of S.machines) {
    if (m.stopped) continue;
    const [gx, gy] = k.split(',').map(Number);
    if (m.id === 'treeGen' || m.id === 'harvester') { updateAutoMachine(m, gx, gy, dt); continue; }
    if (m.progress <= 0) {
      if (canStart(m)) { consumeInputs(m); m.progress = 0.001; }
      else continue;
    }
    const r = getRecipe(m);
    m.progress += dt / r.secs;
    if (m.progress >= 1) {
      m.progress = 0;
      finishCraft(m, gx, gy);
      SFX.play('craft');
    }
  }
}

// Siklus mesin tanpa resep: pewaktu jalan terus; gagal (tidak ada petak /
// tidak ada pohon) berarti coba lagi siklus berikut, bukan macet.
function updateAutoMachine(m, gx, gy, dt) {
  m.progress += dt / (m.id === 'treeGen' ? TREEGEN_SECS : HARVESTER_SECS);
  if (m.progress < 1) return;
  m.progress = 0;
  if (m.id === 'treeGen') growTree(gx, gy);
  else harvestNearestTree(m, gx, gy);
  SFX.play('craft');
}

// Tree Generator: tanam 1 pohon di petak rumput kosong pertama yang
// bersebelahan (urutan +x, +y, -x, -y). Petak pemain dan petak berisi
// bangunan dilewati; pohonnya node biasa (bisa ditebang pemain juga).
function growTree(gx, gy) {
  const plot = S.maps.plot;
  const grid = plot.grid;
  const pt = S.map === 'plot' ? playerTile() : null;
  for (const d of DIRS) {
    const nx = gx + d.dx, ny = gy + d.dy;
    if (nx < 0 || ny < 0 || nx >= plot.w || ny >= plot.h) continue;
    if (pt && nx === pt.gx && ny === pt.gy) continue;
    const t = grid[ny] && grid[ny][nx];
    if (!t || t.t !== 'grass' || t.obj) continue;
    const k = key(nx, ny);
    if (S.machines.has(k) || S.conveyors.has(k) || S.storages.has(k) || S.walls.has(k) || S.decor.has(k)) continue;
    t.obj = 'tree'; t.hp = NODES.tree.hp; t.regrowIn = 0;
    S.pulses.set(k, S.time);
    saveSoon();
    return true;
  }
  return false;
}

// Harvester: tebang pohon hidup terdekat di lahan (jarak Manhattan),
// cabut sampai akar supaya Tree Generator bisa menanam lagi di situ.
function harvestNearestTree(m, gx, gy) {
  const grid = S.maps.plot.grid;
  let best = null, bestD = Infinity;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const t = grid[y][x];
      if (t.obj !== 'tree' || t.hp <= 0) continue;
      const d = Math.abs(x - gx) + Math.abs(y - gy);
      if (d < bestD) { bestD = d; best = { x, y, t }; }
    }
  }
  if (!best) return false;
  best.t.obj = null; best.t.hp = 0; best.t.regrowIn = 0;
  m.output.Log = (m.output.Log || 0) + HARVEST_LOGS;
  S.stats.harvested.Log = (S.stats.harvested.Log || 0) + HARVEST_LOGS;
  addFloater(best.x, best.y, '+' + HARVEST_LOGS + ' Log', '#5eff8a', 'plot');
  S.pulses.set(key(best.x, best.y), S.time);
  saveSoon();
  return true;
}

function frontCell(gx, gy, dir) {
  return { gx: gx + DIRS[dir].dx, gy: gy + DIRS[dir].dy };
}
function updateConveyors(dt) {
  for (const [k, c] of S.conveyors) {
    const [gx, gy] = k.split(',').map(Number);
    c.t += dt / 0.7;
    if (c.t < 1) continue;
    c.t = 0;
    if (c.item) {
      const f = frontCell(gx, gy, c.dir);
      const fk = key(f.gx, f.gy);
      const nextConv = S.conveyors.get(fk);
      if (nextConv && !nextConv.item) { nextConv.item = c.item; c.item = null; continue; }
      const m = S.machines.get(fk);
      if (m && machineAccepts(m, c.item)) {
        m.input[c.item] = (m.input[c.item] || 0) + 1;
        c.item = null; continue;
      }
      const st = S.storages.get(fk);
      if (st && bufferTotal(st.items) < STORAGE_CAP[st.id]) {
        st.items[c.item] = (st.items[c.item] || 0) + 1;
        c.item = null; continue;
      }
    } else {
      // Tarik dari mesin di belakang, kiri, lalu kanan. Depan tidak:
      // depan itu arah keluar.
      const pullDirs = [(c.dir + 2) % 4, (c.dir + 3) % 4, (c.dir + 1) % 4];
      for (const d of pullDirs) {
        const m = S.machines.get(key(gx + DIRS[d].dx, gy + DIRS[d].dy));
        if (!m) continue;
        const outId = Object.keys(m.output).find((id) => m.output[id] > 0);
        if (!outId) continue;
        m.output[outId]--;
        if (m.output[outId] <= 0) delete m.output[outId];
        c.item = outId;
        break;
      }
    }
  }
}

// Eject: keluarkan isi buffer (selain yang sedang dibuat) ke tas karakter.
function ejectMachine(m) {
  for (const [id, n] of Object.entries(m.input)) invAdd(id, n);
  for (const [id, n] of Object.entries(m.output)) invAdd(id, n);
  m.input = {}; m.output = {};
}

// ADMIN: selesaikan semua crafting yang sedang berjalan saat ini juga.
function finishAllInstant() {
  for (const [k, m] of S.machines) {
    if (m.progress > 0) {
      const [gx, gy] = k.split(',').map(Number);
      m.progress = 0;
      // Mesin tanpa resep tidak bisa finishCraft (getRecipe null): jalankan
      // satu siklusnya langsung.
      if (m.id === 'treeGen') { growTree(gx, gy); continue; }
      if (m.id === 'harvester') { harvestNearestTree(m, gx, gy); continue; }
      finishCraft(m, gx, gy);
    }
  }
}
