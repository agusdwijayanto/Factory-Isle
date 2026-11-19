// Karakter: jalan mengikuti jalur, bekerja di tempat, memanen dengan
// perkakas yang benar. Kecepatan 3,2 petak per detik.
const WALK_SPEED = 3.2;
const SWING_TIME = 0.55;

function playerTile() {
  return { gx: Math.floor(S.player.fx), gy: Math.floor(S.player.fy) };
}

function goTo(gx, gy, onArrive) {
  const p = S.player;
  p.working = null;
  const from = playerTile();
  p.path = findPath(from.gx, from.gy, gx, gy);
  p.onArrive = onArrive || null;
  if (!p.path.length && p.onArrive) {
    const cb = p.onArrive; p.onArrive = null; cb();
  }
}

function cancelWork() {
  const p = S.player;
  if (p.working) p.working = null;
  p.path = [];
  p.onArrive = null;
}

function faceTile(gx, gy) {
  S.player.dir = dirToward(S.player.fx, S.player.fy, gx + 0.5, gy + 0.5);
}

function startHarvest(gx, gy) {
  const t = tileAt(gx, gy);
  const nodeKey = t.obj || t.t;
  const node = NODES[nodeKey];
  if (!node) return;
  const p = S.player;
  p.tool = node.tool;
  faceTile(gx, gy);
  p.working = {
    kind: 'harvest', gx, gy, nodeKey,
    swingsLeft: node.swings, swingT: 0,
  };
}

function harvestTick(w) {
  const node = NODES[w.nodeKey];
  const t = tileAt(w.gx, w.gy);
  invAdd(node.item, 1);
  S.stats.harvested[node.item] = (S.stats.harvested[node.item] || 0) + 1;
  S.pulses.set(key(w.gx, w.gy), S.time);
  addFloater(w.gx, w.gy, HARVEST_TEXT[w.nodeKey], ITEMS[node.item].color);
  SFX.play('chop');
  if (t.obj && node.hp > 0) {
    t.hp--;
    if (t.hp <= 0) t.regrowIn = node.regrow;
  }
  saveSoon();
}

function updatePlayer(dt) {
  const p = S.player;
  if (p.swing > 0) p.swing -= dt;

  // Bekerja: ayunan berkala sampai selesai.
  if (p.working) {
    p.working.swingT += dt;
    if (p.working.swingT >= SWING_TIME) {
      p.working.swingT = 0;
      p.swing = 0.4;
      harvestTick(p.working);
      p.working.swingsLeft--;
      if (p.working.swingsLeft <= 0) p.working = null;
    }
    return;
  }

  // Tombol arah menimpa jalur ketuk.
  const hd = typeof heldDir === 'function' ? heldDir() : -1;
  if (hd >= 0 && !p.path.length) {
    const cur = playerTile();
    const nx = cur.gx + DIRS[hd].dx, ny = cur.gy + DIRS[hd].dy;
    if (!blockedForWalk(nx, ny)) {
      p.path = [{ gx: nx, gy: ny }];
      p.onArrive = null;
    } else {
      p.dir = hd;
    }
  }

  if (p.path.length) {
    const next = p.path[0];
    const tx = next.gx + 0.5, ty = next.gy + 0.5;
    const dx = tx - p.fx, dy = ty - p.fy;
    const dist = Math.hypot(dx, dy);
    const step = WALK_SPEED * dt;
    p.dir = dirToward(p.fx, p.fy, tx, ty);
    p.walkT += dt;
    p.frame = Math.floor(p.walkT * 6) % 3;
    if (dist <= step) {
      p.fx = tx; p.fy = ty;
      p.path.shift();
      // Injak jalan masuk/keluar lahan: pindah map saat itu juga, jalur batal.
      if (checkMapTrigger()) return;
      if (!p.path.length) {
        p.frame = 0;
        if (p.onArrive) { const cb = p.onArrive; p.onArrive = null; cb(); }
      }
    } else {
      p.fx += (dx / dist) * step;
      p.fy += (dy / dist) * step;
    }
    return;
  }

  // Diam di samping sawhorse yang berjalan: ikut menebas (visual).
  p.frame = 0;
  if (S.map !== 'plot') return;
  const cur = playerTile();
  for (const d of DIRS) {
    const m = S.machines.get(key(cur.gx + d.dx, cur.gy + d.dy));
    if (m && m.id === 'sawhorse' && m.progress > 0 && !m.stopped) {
      p.dir = dirToward(p.fx, p.fy, cur.gx + d.dx + 0.5, cur.gy + d.dy + 0.5);
      p.tool = 'axe';
      if (p.swing <= 0) p.swing = 0.4;
      break;
    }
  }
}

// Injak pemicu pindah map: jalan masuk di kota, jalan keluar di plot, dan pintu
// keluar di ujung tiap map zona.
function checkMapTrigger() {
  const cur = playerTile();
  if (S.map === 'town' && cur.gx === S.plotPad.gx && cur.gy === S.plotPad.gy) {
    switchMap('plot');
    return true;
  }
  if (S.map === 'plot') {
    const g = gatePos();
    if (cur.gx === g.gx && cur.gy === g.gy) {
      switchMap('town');
      return true;
    }
  }
  for (const e of MAP_EXITS[S.map] || []) {
    if (cur.gx === e.gx && cur.gy === e.gy) {
      switchMap(e.to, { fx: e.sx + 0.5, fy: e.sy + 0.5 });
      return true;
    }
  }
  return false;
}

// Tumbuh kembali simpul yang habis dipanen, di semua map (simulasi jalan
// terus walau pemain sedang di map lain).
function updateRegrow(dt) {
  for (const name of Object.keys(S.maps)) {
    const m = S.maps[name];
    if (!m) continue;
    for (let gy = 0; gy < m.h; gy++) {
      for (let gx = 0; gx < m.w; gx++) {
        const t = m.grid[gy][gx];
        if (t.regrowIn > 0) {
          t.regrowIn -= dt;
          if (t.regrowIn <= 0 && t.obj && NODES[t.obj]) t.hp = NODES[t.obj].hp;
        }
      }
    }
  }
}

// Keputusan ketuk: jalan, panen, atau buka panel sesudah sampai.
// Bangunan hanya di plot; toko, Mayor, peron kereta, dan sumber daya ada di
// mapnya masing-masing.
function interactAt(gx, gy) {
  const t = tileAt(gx, gy);
  const k = key(gx, gy);

  if (S.map === 'plot') {
    if (S.machines.has(k)) {
      goTo(gx, gy, () => UI.openInspect(gx, gy));
      return;
    }
    if (S.storages.has(k)) {
      goTo(gx, gy, () => UI.openStorage(gx, gy));
      return;
    }
    if (S.conveyors.has(k) || S.walls.has(k) || S.decor.has(k)) {
      UI.openInspect(gx, gy);
      return;
    }
    goTo(gx, gy, null);
    return;
  }

  if (t.obj && t.obj.startsWith('shop')) {
    const id = t.obj.slice(5);
    goTo(gx, gy, () => UI.openShop(id));
    return;
  }
  if (S.map === 'town' && gx === S.mayor.gx && gy === S.mayor.gy) {
    goTo(gx, gy, () => UI.openMayor());
    return;
  }
  // Naik kereta hanya dari kereta; peron cuma dekorasi, tidak bisa diklik.
  if (t.obj === 'train') {
    goTo(gx, gy, () => UI.openTrain());
    return;
  }
  if (t.obj && NODES[t.obj] && t.hp > 0) {
    goTo(gx, gy, () => startHarvest(gx, gy));
    return;
  }
  if (!t.obj && NODES[t.t]) {
    goTo(gx, gy, () => startHarvest(gx, gy));
    return;
  }
  goTo(gx, gy, null);
}
