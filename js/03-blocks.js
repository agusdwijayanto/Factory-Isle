'use strict';
// ---------- Blok: pukul, hancur, taruh, bongkar ----------
// Profesi memangkas HP blok (tidak di bawah 1): 1 pukulan lebih sedikit = HP -1.
function effHp(code) {
  let hp = TILES[code].hp;
  if (code === T_WOOD) {
    if (hasProf('wood', 'sharp-axe')) hp -= 1;
    if (hasProf('wood', 'master-lumber')) hp -= 2;
  }
  if (code === T_STONE) {
    if (hasProf('mine', 'strong-pick')) hp -= 1;
    if (hasProf('mine', 'master-miner')) hp -= 2;
  }
  return Math.max(1, hp);
}
function inReach(tx, ty, range) {
  const p = playerTile();
  return Math.max(Math.abs(tx - p.tx), Math.abs(ty - p.ty)) <= range;
}
function punchTile(tx, ty) {
  const code = tileAt(tx, ty);
  if (code === T_EMPTY || !TILES[code]) return false;
  // Jeda antar pukulan: tanpa ini, menahan tombol menghancurkan blok seketika.
  if (S.rtime - (S.lastPunch || 0) < 0.22) return false;
  S.lastPunch = S.rtime;
  const k = key(tx, ty);
  const hp = (S.tileHp[k] !== undefined ? S.tileHp[k] : effHp(code)) - 1;
  S.tileHit[k] = S.rtime;
  if (hp <= 0) { breakTile(tx, ty, code); return true; }
  S.tileHp[k] = hp;
  sfx.punch();
  burst(tx * TILE + 16, ty * TILE + 16, '#c9a06a', 4, 50);
  return true;
}
function breakTile(tx, ty, code) {
  const k = key(tx, ty);
  const def = TILES[code];
  S.tiles[ty][tx] = T_EMPTY;
  delete S.tileHp[k]; delete S.tileHit[k];
  const wasPlaced = !!S.placed[k];
  delete S.placed[k];
  if (wasPlaced && def.cost) {
    // Bongkar petak buatan pemain: seluruh bahan kembali.
    for (const m in def.cost) gainItem(m, def.cost[m]);
    addFloat(tx * TILE + 16, ty * TILE, 'Bongkar', '#ffd94d');
  } else {
    gainItem(def.seed, 1);
    let dropN = 1;
    if (code === T_STONE && hasProf('mine', 'stone-hunter')) dropN += 1;
    gainItem(def.drop, dropN);
    let seedN = 1;
    if (code === T_WOOD && hasProf('wood', 'planter')) seedN += 1;
    if (seedN > 1) gainItem(def.seed, seedN - 1);
    addFloat(tx * TILE + 16, ty * TILE, '+1 ' + ITEMS[def.seed].name + ' +' + dropN + ' ' + ITEMS[def.drop].name, '#ffd94d');
    // XP hanya dari blok alami, supaya tidak bisa farming dengan taruh-bongkar.
    if (code === T_WOOD) gainXP('wood', 8);
    if (code === T_STONE) gainXP('mine', 8);
  }
  sfx.brk(); S.shake = 0.25;
  burst(tx * TILE + 16, ty * TILE + 16, '#b08d5a', 10, 90);
}
// Aksi pada satu petak: tanaman dulu (panen/siram), lalu blok (pukul).
function actTile(tx, ty) {
  const p = plantAt(tx, ty);
  if (p) {
    if (grown(p)) { harvestPlant(p); return true; }
    if (!p.watered) { waterPlant(p); return true; }
    return false;
  }
  return punchTile(tx, ty);
}
// Aksi ke arah hadap: petak tengah, bawah, lalu atas — yang pertama bisa diaksi.
function actForward() {
  const p = playerTile();
  const fx = p.tx + S.face;
  const order = [[fx, p.ty], [fx, p.ty + 1], [fx, p.ty - 1], [p.tx, p.ty + 1]];
  for (const t of order) if (actTile(t[0], t[1])) return true;
  return false;
}
function placeTile(tx, ty) {
  const place = S.place;
  if (!place) return false;
  if (tx < 0 || tx >= S.mw || ty < 0 || ty >= MH) return false;
  if (!inReach(tx, ty, 2)) { addFloat(S.px, S.py - 30, 'Terlalu jauh', '#ff8a8a'); return false; }
  if (tileAt(tx, ty) !== T_EMPTY || plantAt(tx, ty)) return false;
  if (place.kind === 'seed') return plantSeed(tx, ty, place.id);
  if (place.kind === 'item') {
    if (countItem(place.id) < 1) return false;
    const code = ITEMS[place.id].tile;
    if (TILES[code].solid && tileOverlapsPlayer(tx, ty)) return false;
    removeItem(place.id, 1);
    S.tiles[ty][tx] = code; S.placed[key(tx, ty)] = true;
    sfx.place(); burst(tx * TILE + 16, ty * TILE + 16, '#8fd0ff', 6, 50);
    return true;
  }
  // kind 'tile': biaya bahan langsung.
  const def = TILES[place.code];
  if (!hasCost(place.cost)) { sfx.error(); addFloat(S.px, S.py - 30, 'Butuh ' + costText(place.cost), '#ff8a8a'); return false; }
  if (def.solid && tileOverlapsPlayer(tx, ty)) return false;
  payCost(place.cost);
  S.tiles[ty][tx] = place.code; S.placed[key(tx, ty)] = true;
  sfx.place(); burst(tx * TILE + 16, ty * TILE + 16, '#8fd0ff', 6, 50);
  return true;
}
function tileOverlapsPlayer(tx, ty) {
  const rx = tx * TILE, ry = ty * TILE;
  return S.px + PW / 2 > rx && S.px - PW / 2 < rx + TILE && S.py + PH / 2 > ry && S.py - PH / 2 < ry + TILE;
}
