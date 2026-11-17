'use strict';
// ---------- Pukul, hancur, taruh, pintu, lava, cat, cuaca, lock ----------
function treeAt(tx, ty) { return S.world.trees[key(tx, ty)] || null; }
function lockArea(lk) {
  const d = LOCK_DEFS[lk.kind];
  if (lk.kind === 'world') return { x0: 0, y0: 0, x1: MW - 1, y1: MH - 1 };
  return {
    x0: lk.tx, y0: lk.ty,
    x1: Math.min(MW - 1, lk.tx + d.w - 1), y1: Math.min(MH - 1, lk.ty + d.h - 1),
  };
}
function lockAt(tx, ty) {
  for (const lk of S.world.locks) {
    const a = lockArea(lk);
    if (tx >= a.x0 && tx <= a.x1 && ty >= a.y0 && ty <= a.y1) return lk;
  }
  return null;
}
function punchTile(tx, ty) {
  if (!inReach(tx, ty)) return false;
  const t = S.rtime || 0;
  if (t - S.lastPunch < PUNCH_CD) return false; // irama Growtopia: 0,2 detik
  S.lastPunch = t;
  S.punchFx = { tx, ty, life: 0.15 };
  const tr = treeAt(tx, ty);
  if (tr) { punchTree(tx, ty, tr); return true; }
  const fg = fgAt(tx, ty), def = TILES[fg];
  if (fg !== T_EMPTY && def) {
    if (def.door) { teleportDoor(tx, ty); return true; }
    if (def.weather) { toggleWeather(); return true; }
    if (def.lock) { addChat('Lock hanya bisa dibongkar lewat wrench.', 'sys'); sfx.error(); return true; }
    if (def.vending) { addChat('Kosongkan mesin dulu lewat wrench sebelum menghancurkannya.', 'sys'); sfx.error(); return true; }
    damageTile(tx, ty, 'fg');
    return true;
  }
  const bg = bgAt(tx, ty);
  if (bg !== T_EMPTY) { damageTile(tx, ty, 'bg'); return true; }
  sfx.punchMiss();
  return true;
}
function damageTile(tx, ty, layer) {
  const code = layer === 'fg' ? fgAt(tx, ty) : bgAt(tx, ty);
  const def = TILES[code];
  if (!def || !isFinite(def.hits)) return;
  const k = key(tx, ty) + layer;
  // Kerusakan pulih kalau jeda terlalu lama (riset: restore per item).
  if ((S.rtime || 0) - (S.tileHit[k] || -99) > def.restore) S.tileHp[k] = 0;
  S.tileHit[k] = S.rtime || 0;
  S.tileHp[k] = (S.tileHp[k] || 0) + 1;
  sfx.punch();
  burst(tx * TILE + 16, ty * TILE + 16, '#c9a06a', 3, 50);
  if (S.tileHp[k] >= def.hits) { delete S.tileHp[k]; breakTile(tx, ty, layer); }
}
function breakTile(tx, ty, layer) {
  const code = layer === 'fg' ? fgAt(tx, ty) : bgAt(tx, ty);
  const def = TILES[code];
  if (!def || !def.item) return;
  if (layer === 'fg') S.world.fg[ty][tx] = T_EMPTY; else S.world.bg[ty][tx] = T_EMPTY;
  delete S.world.paint[key(tx, ty)];
  if (def.sign) delete S.world.signs[key(tx, ty)];
  if (def.chest) {
    for (const id in S.world.chest) dropItem(id, S.world.chest[id], tx, ty);
    S.world.chest = {};
  }
  dropItem(def.item, 1, tx, ty);
  // Blok spliceable: peluang 1 dari 5 menjatuhkan benihnya (riset).
  if (SEED_ITEMS.includes(def.item) && Math.random() < 0.2) dropItem('seed-' + def.item, 1, tx, ty);
  addRoleXp('builder', 1);
  sfx.brk();
  burst(tx * TILE + 16, ty * TILE + 16, '#fff', 8, 80);
}
function placeTile(tx, ty) {
  const id = S.sel;
  if (!id || !inReach(tx, ty)) return false;
  if (ITEMS[id].seed) return tryPlantOrSplice(tx, ty, id);
  if (ITEMS[id].paint !== undefined) return paintTile(tx, ty, id);
  const def = ITEMS[id];
  if (!def.tile) return false;
  const tdef = TILES[def.tile];
  const layer = tdef.layer;
  if (layer === 'fg') {
    if (fgAt(tx, ty) !== T_EMPTY || treeAt(tx, ty)) return false;
  } else if (bgAt(tx, ty) !== T_EMPTY) return false;
  if (def.lock) {
    if (def.lock === 'world' && S.world.locks.length > 0) {
      addChat('World Lock tidak bisa ditaruh kalau world sudah punya lock.', 'sys'); sfx.error(); return false;
    }
    if (S.world.locks.some(l => l.kind === 'world')) {
      addChat('World sudah dikunci World Lock.', 'sys'); sfx.error(); return false;
    }
  }
  if (!removeItem(id, 1)) return false;
  if (layer === 'fg') S.world.fg[ty][tx] = def.tile; else S.world.bg[ty][tx] = def.tile;
  if (def.lock) S.world.locks.push({ tx, ty, kind: def.lock, owner: 'Pemain' });
  if (tdef.vending) S.world.vending[key(tx, ty)] = { item: null, qty: 0, price: 0, earned: 0 };
  addRoleXp('builder', 1);
  sfx.place();
  return true;
}
function paintTile(tx, ty, id) {
  if (!countItem('brush')) { addChat('Butuh Paintbrush untuk mengecat.', 'sys'); sfx.error(); return false; }
  if (fgAt(tx, ty) === T_EMPTY && bgAt(tx, ty) === T_EMPTY) return false;
  if (!removeItem(id, 1)) return false;
  const k = key(tx, ty);
  if (ITEMS[id].paint) S.world.paint[k] = ITEMS[id].paint;
  else delete S.world.paint[k];
  sfx.place();
  return true;
}
function teleportDoor(tx, ty) {
  let best = null, bd = Infinity;
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
    if (S.world.fg[y][x] === T_DOOR && !(x === tx && y === ty)) {
      const d = Math.abs(x - tx) + Math.abs(y - ty);
      if (d < bd) { bd = d; best = { x, y }; }
    }
  }
  if (!best) { addChat('Tidak ada pintu lain di world ini.', 'sys'); return; }
  S.px = best.x * TILE + 16; S.py = best.y * TILE + 4; S.vx = 0; S.vy = 0;
  sfx.door();
  burst(best.x * TILE + 16, best.y * TILE + 16, '#fff', 10, 60);
}
function toggleWeather() {
  const i = WEATHERS.indexOf(S.world.weather);
  S.world.weather = WEATHERS[(i + 1) % WEATHERS.length];
  addChat('Cuaca world menjadi: ' + S.world.weather + '.', 'sys');
  sfx.click();
}
function removeLockAt(tx, ty) {
  const i = S.world.locks.findIndex(l => l.tx === tx && l.ty === ty);
  if (i < 0) return false;
  const lk = S.world.locks[i];
  S.world.locks.splice(i, 1);
  S.world.fg[ty][tx] = T_EMPTY;
  gainItem(LOCK_DEFS[lk.kind].item, 1); // lock kembali ke tas (riset: perma-item)
  addChat(LOCK_DEFS[lk.kind].name + ' dibongkar dan kembali ke tas.', 'sys');
  return true;
}
function hurtPlayer(dmg, fromX) {
  if ((S.rtime || 0) - S.hurtT < 1) return; // kebal sesaat sesudah kena
  S.hurtT = S.rtime || 0;
  S.hp -= dmg;
  S.fireT = 3;
  const dir = S.px < fromX ? -1 : 1;
  S.px = clamp(S.px + dir * 24, PW / 2, MW * TILE - PW / 2); // knockback langsung: vx ditimpa tiap frame oleh updatePlayer
  S.vy = -200;
  sfx.lava();
  burst(S.px, S.py, '#ff6b35', 10, 90);
  if (S.hp <= 0) {
    S.hp = 100; S.fireT = 0;
    S.px = S.world.spawn.tx * TILE + 16; S.py = S.world.spawn.ty * TILE + 4;
    S.vx = 0; S.vy = 0;
    addChat('Kamu kalah oleh lava dan bangun di Main Door.', 'sys');
    banner('Kamu kalah! Bangun di Main Door.');
  }
}
function actForward() {
  // Tombol PUKUL: pukul petak berisi pertama di depan (depan, depan-bawah, bawah).
  const p = playerTile();
  const cands = [
    { tx: p.tx + S.face, ty: p.ty }, { tx: p.tx + S.face, ty: p.ty + 1 }, { tx: p.tx, ty: p.ty + 1 },
  ];
  for (const c of cands) {
    if (treeAt(c.tx, c.ty) || fgAt(c.tx, c.ty) !== T_EMPTY || bgAt(c.tx, c.ty) !== T_EMPTY) return punchTile(c.tx, c.ty);
  }
  return punchTile(cands[0].tx, cands[0].ty);
}
