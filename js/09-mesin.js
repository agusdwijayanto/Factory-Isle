// Mesin dan conveyor. Semua mesin mengolah sendiri kalau bahannya ada,
// termasuk Sawhorse: tetap jalan walau pemain sedang di kota.
function newMachine(id, dir) {
  return { id, dir, recipe: 0, input: {}, output: {}, progress: 0, stopped: false };
}

function updateMachines(dt) {
  for (const [k, m] of S.machines) {
    if (m.stopped) continue;
    const [gx, gy] = k.split(',').map(Number);
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
      finishCraft(m, gx, gy);
    }
  }
}
