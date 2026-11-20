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
  // v35: panen butuh perkakas yang benar; tanpa perkakas, tidak mulai.
  const lvl = S.tools[node.tool] || 0;
  if (lvl <= 0) {
    TOAST('Beli ' + TOOLS[node.tool].name + ' dulu di Tool Shop.');
    return;
  }
  const p = S.player;
  p.tool = node.tool;
  faceTile(gx, gy);
  p.working = {
    kind: 'harvest', gx, gy, nodeKey,
    swingsLeft: swingsFor(node, lvl), swingT: 0,
  };
}

// v36: gali tunggul dengan sekop — tunggul hilang, jadi benih. Tanaman
// muda (growIn > 0) tidak bisa digali, tunggu dewasa dulu.
function digStump(gx, gy) {
  const t = tileAt(gx, gy);
  if (!t.obj || !DIGGABLE[t.obj] || t.hp > 0 || t.growIn > 0) return;
  if ((S.tools.shovel || 0) <= 0) {
    TOAST('Beli Sekop dulu di Tool Shop.');
    return;
  }
  const seed = STUMP_SEED[t.obj];
  t.obj = null; t.hp = 0; t.regrowIn = 0; t.stage = 0; t.growIn = 0;
  if (seed) {
    invAdd(seed, 1);
    addFloater(gx, gy, '+1 ' + ITEMS[seed].name, ITEMS[seed].color);
  }
  SFX.play('chop');
  saveSoon();
}

// v36: tanam benih di rumput lahan — pohon tumbuh bertahap (stage/growIn).
function plantSeed(gx, gy, seedId) {
  const t = tileAt(gx, gy);
  const sp = SEED_PLANTS[seedId];
  if (!sp || !t || t.t !== 'grass' || t.obj) return false;
  if (invCount(seedId) <= 0) return false;
  invAdd(seedId, -1);
  t.obj = sp.obj; t.hp = 0; t.stage = 0; t.growIn = sp.secs; t.regrowIn = 0;
  addFloater(gx, gy, 'Ditanam: ' + ITEMS[seedId].name, '#4fae6b');
  SFX.play('place');
  saveSoon();
  return true;
}

// v36: skala gambar tanaman muda (0.45..1) dari tahap tumbuhnya.
function growthScale(t) {
  const g = PLANT_GROWTH[t.obj];
  if (!g || t.growIn <= 0) return 1;
  return 0.45 + 0.55 * Math.min(1, (t.stage + 1) / g.stages);
}

// Naik/turun wagon: ketuk wagon menaikkan kalau belum naik, menurunkan
// kalau sedang naik. Wagon parkir di petak saat turun.
function toggleWagon() {
  if (!S.wagon) return;
  S.wagon.riding = !S.wagon.riding;
  if (S.wagon.riding) {
    const cur = playerTile();
    S.wagon.map = S.map; S.wagon.gx = cur.gx; S.wagon.gy = cur.gy;
    TOAST('Naik wagon — jalan lebih cepat.');
  } else {
    TOAST('Turun dari wagon.');
  }
  saveSoon();
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
  // v36: berenang — wagon tidak bisa masuk air, pemain turun otomatis
  // (wagon tinggal di petak darat terakhir).
  if (isRiding()) {
    const cur = playerTile();
    if (inGrid(cur.gx, cur.gy) && S.grid[cur.gy][cur.gx].t === 'water') {
      S.wagon.riding = false;
      UI.toast('Turun dari wagon untuk berenang.');
    }
  }
  // v35: naik wagon, wagon ikut petak pemain tiap tick (di awal supaya
  // tetap ikut walau cabang jalan di bawah return duluan).
  if (isRiding()) {
    const cur = playerTile();
    S.wagon.map = S.map; S.wagon.gx = cur.gx; S.wagon.gy = cur.gy;
  }

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
    // v35: naik wagon = jalan lebih cepat (lv2; jalan kaki lv1, kereta lv3 instan).
    // v36: berenang setengah kecepatan (air = petak tempat pemain berdiri).
    const cur = playerTile();
    const onWater = inGrid(cur.gx, cur.gy) && S.grid[cur.gy][cur.gx].t === 'water';
    const speed = isRiding() ? WALK_SPEED * wagonSpeedMult() : (onWater ? WALK_SPEED * 0.5 : WALK_SPEED);
    const step = speed * dt;
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
  // v49: lahan ada di UTARA kota. Jembatan kota (8,0) membawa ke lahan;
  // gerbang lahan (petak bawah, tinggi ikut ekspansi) membawa balik ke kota.
  // Titik lahir memakai defaultSpawn supaya ikut ukuran lahan terkini.
  if (S.map === 'town' && cur.gx === 8 && cur.gy === 0) {
    switchMap('plot');
    return true;
  }
  // v50: petak putih di rumput kota (7,13) — diinjak langsung masuk lahan.
  if (S.map === 'town' && cur.gx === 7 && cur.gy === 13) {
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
        // v36: tanaman dari benih tumbuh bertahap; dewasa = hp penuh.
        if (t.growIn > 0 && t.obj && PLANT_GROWTH[t.obj]) {
          t.growIn -= dt;
          if (t.growIn <= 0) {
            const g = PLANT_GROWTH[t.obj];
            t.stage++;
            if (t.stage >= g.stages) {
              t.hp = NODES[t.obj].hp;
              t.growIn = 0;
            } else {
              t.growIn = g.secs;
            }
          }
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

  // v35: ketuk wagon = naik/turun (di map mana pun wagon berada).
  if (S.wagon && S.wagon.map === S.map && S.wagon.gx === gx && S.wagon.gy === gy) {
    goTo(gx, gy, () => toggleWagon());
    return;
  }
  // v50: petak putih plot (7,13) di rumput kota — cukup diklik, diinjak
  // langsung pindah ke lahan (checkMapTrigger). Tanda plot lama dihapus;
  // menu plot tetap bisa dibuka dari menu burger.

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
  // v48: panel naik kereta dibuka dari STASIUN (peron dihapus, kereta tetap
  // jalan dan bisa diklik cuma untuk mendekat).
  if (t.obj === 'station') {
    goTo(gx, gy, () => UI.openTrain());
    return;
  }
  if (t.obj && NODES[t.obj] && t.hp > 0) {
    goTo(gx, gy, () => startHarvest(gx, gy));
    return;
  }
  // v36: tunggul (hp 0, bukan tanaman muda) digali sekop jadi benih.
  if (t.obj && DIGGABLE[t.obj] && t.hp <= 0 && t.growIn <= 0) {
    goTo(gx, gy, () => digStump(gx, gy));
    return;
  }
  if (!t.obj && NODES[t.t]) {
    goTo(gx, gy, () => startHarvest(gx, gy));
    return;
  }
  goTo(gx, gy, null);
}
