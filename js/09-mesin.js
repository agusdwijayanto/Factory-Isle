// Mesin dan conveyor. Mesin mengolah sendiri kalau bahannya ada;
// sawhorse hanya jalan bila karakter berdiri di sampingnya (potong manual).
function newMachine(id, dir) {
  return { id, dir, recipe: 0, input: {}, output: {}, progress: 0, stopped: false };
}

function adjacentToPlayer(gx, gy) {
  const p = playerTile();
  return Math.abs(p.gx - gx) + Math.abs(p.gy - gy) === 1;
}

function updateMachines(dt) {
  for (const [k, m] of S.machines) {
    if (m.stopped) continue;
    const [gx, gy] = k.split(',').map(Number);
    if (m.progress <= 0) {
      if (canStart(m)) { consumeInputs(m); m.progress = 0.001; }
      else continue;
    }
    // Sawhorse: karakter harus di samping DI PLOT; di kota ia berhenti.
    if (m.id === 'sawhorse' && (S.map !== 'plot' || !adjacentToPlayer(gx, gy))) continue;
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
function behindCell(gx, gy, dir) {
  const back = (dir + 2) % 4;
  return { gx: gx + DIRS[back].dx, gy: gy + DIRS[back].dy };
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
      const b = behindCell(gx, gy, c.dir);
      const m = S.machines.get(key(b.gx, b.gy));
      if (m) {
        const outId = Object.keys(m.output).find((id) => m.output[id] > 0);
        if (outId) {
          m.output[outId]--;
          if (m.output[outId] <= 0) delete m.output[outId];
          c.item = outId;
        }
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
