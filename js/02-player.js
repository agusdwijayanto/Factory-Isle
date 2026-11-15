'use strict';
// ---------- Aksi pemain ----------
function hitTree(t, power) {
  t.hp -= power || 1; t.shake = .35;
  burst(t.tx * TILE + 16, t.ty * TILE + 8, '#5cb84d', 6, 60);
  if (t.hp <= 0) {
    if (t.planted) S.planted.splice(S.planted.indexOf(t), 1);
    else t.respawn = TREE_RESPAWN;
    S.wood += TREE_YIELD;
    addFloat(t.tx * TILE + 16, t.ty * TILE, '+' + TREE_YIELD + ' kayu', '#ffd94d');
    sfx.harvest();
  } else sfx.chop();
}
function hitRock(r, power) {
  r.hp -= power || 1; r.shake = .35;
  burst(r.tx * TILE + 16, r.ty * TILE + 8, '#b8b8b8', 6, 60);
  if (r.hp <= 0) {
    r.respawn = ROCK_RESPAWN; S.stone += ROCK_YIELD;
    addFloat(r.tx * TILE + 16, r.ty * TILE, '+' + ROCK_YIELD + ' batu', '#e8e8e8');
    sfx.harvest();
  } else sfx.mine();
}
function harvestCrop(k) {
  const p = k.split(',').map(Number);
  delete S.crops[k]; S.wheat += CROP_YIELD;
  burst(p[0] * TILE + 16, p[1] * TILE + 16, '#8fce5a', 8, 60);
  addFloat(p[0] * TILE + 16, p[1] * TILE, '+' + CROP_YIELD + ' gandum', '#ffe27a');
  sfx.harvest();
}
function swordDmg() { return S.equip.sword > 0 ? SWORD_DMG[S.equip.sword - 1] : 10; }
function damageTaken(n) {
  // Armor dan perisai menumpuk secara perkalian, bukan penjumlahan.
  let d = n;
  if (S.equip.armor > 0) d *= 1 - ARMOR_PCT[S.equip.armor - 1] / 100;
  if (S.equip.shield > 0) d *= 1 - SHIELD_PCT / 100;
  return Math.max(1, Math.round(d));
}
function hitMonster(m, dmg) {
  // Pukulan pertama pemain di malam hari = aba-aba serang bareng warga.
  if (S.phase === 'night' && !S.dun) S.charge = true;
  m.hp -= dmg;
  const d = Math.hypot(m.x - S.px, m.y - S.py) || 1;
  m.x += (m.x - S.px) / d * 10; m.y += (m.y - S.py) / d * 10;
  S.shake = 6;
  burst(m.x, m.y, '#c9a7ff', 8, 80);
  addFloat(m.x, m.y - 20, '-' + dmg, '#fff');
  if (m.hp <= 0) {
    const list = S.dun ? S.dun.monsters : S.monsters;
    list.splice(list.indexOf(m), 1);
    dropLoot(m);
    burst(m.x, m.y, '#7a4a9e', 16, 100);
    sfx.die();
  } else sfx.hit();
}
function dropLoot(m) {
  const r = Math.random();
  let txt = '', color = '#9fe870';
  if (r < 0.5) {
    const ks = ['wood', 'stone', 'wheat'], k = ks[Math.floor(Math.random() * 3)];
    S[k] += 2; txt = '+2 ' + RES_NAME[k];
  } else if (r < 0.8) {
    const k = Math.random() < 0.5 ? 'iron' : 'coal';
    S[k] += 1; txt = '+1 ' + RES_NAME[k]; color = '#ffd94d';
  } else if (r < 0.95) {
    const n = 2 + Math.floor(Math.random() * 2), ks = ['wood', 'stone', 'wheat', 'iron', 'coal'];
    for (let i = 0; i < n; i++) S[ks[Math.floor(Math.random() * ks.length)]] += 1;
    txt = '+' + n + ' bahan'; color = '#ffd94d';
  } else {
    S.gold += 1; txt = '+1 gold!'; color = '#ffe27a';
  }
  addFloat(m.x, m.y - 20, txt, color);
}
function eatBread() {
  if (S.hp >= PLAYER_HP) { addFloat(S.px, S.py - 26, 'HP sudah penuh', '#ff8a8a'); return false; }
  if (S.bread < 1) { sfx.error(); addFloat(S.px, S.py - 26, 'Tidak ada roti', '#ff8a8a'); return false; }
  S.bread--; S.hp = Math.min(PLAYER_HP, S.hp + BREAD_HEAL);
  sfx.eat(); burst(S.px, S.py, '#ffd94d', 6, 50);
  addFloat(S.px, S.py - 26, '+' + BREAD_HEAL + ' HP', '#9fe870');
  return true;
}
function act() {
  if (S.buildMode) { tryPlace(); return; }
  if (S.dun) { actDungeon(); return; }
  const reach = S.equip.bow > 0 ? BOW_REACH : REACH;
  const dmg = S.equip.bow > 0 ? SWORD_DMG[S.equip.bow - 1] : swordDmg();
  let mBest = null, mD = reach;
  for (const m of S.monsters) { const d = Math.hypot(m.x - S.px, m.y - S.py); if (d < mD) { mD = d; mBest = m; } }
  if (mBest) { hitMonster(mBest, dmg); return; }
  let best = null, bd = REACH;
  const consider = (x, y, ref) => { const d = Math.hypot(x - S.px, y - S.py); if (d < bd) { bd = d; best = ref; } };
  for (const t of WORLD.trees) if (alive(t)) consider(t.tx * TILE + 16, t.ty * TILE + 16, { k: 'tree', e: t });
  for (const p of S.planted) if (grown(p)) consider(p.tx * TILE + 16, p.ty * TILE + 16, { k: 'tree', e: p });
  for (const r of WORLD.rocks) if (alive(r)) consider(r.tx * TILE + 16, r.ty * TILE + 16, { k: 'rock', e: r });
  for (const k in S.crops) if (S.crops[k].t >= CROP_TIME) { const p = k.split(',').map(Number); consider(p[0] * TILE + 16, p[1] * TILE + 16, { k: 'crop', key: k }); }
  if (best) {
    if (best.k === 'tree') hitTree(best.e, axePower());
    else if (best.k === 'rock') hitRock(best.e, pickPower());
    else harvestCrop(best.key);
    return;
  }
  const tx = Math.floor(S.px / TILE), ty = Math.floor(S.py / TILE);
  if (cropTile(tx, ty) && !S.crops[key(tx, ty)]) {
    if (S.wheat < CROP_COST) { sfx.error(); addFloat(S.px, S.py - 26, 'Butuh 1 gandum', '#ff8a8a'); return; }
    S.wheat -= CROP_COST;
    S.crops[key(tx, ty)] = { t: 0 };
    sfx.plant(); burst(S.px, S.py + 8, '#8fce5a', 6, 50);
  }
}

// ---------- Bangunan: taruh, naik tingkat, bongkar ----------
function ghostValid(gx, gy, kind) {
  const size = (kind === 'road' || kind === 'farm' || kind === 'tree' || kind === 'erase') ? 1 : 2;
  for (let y = gy; y < gy + size; y++) for (let x = gx; x < gx + size; x++) {
    if (x < 0 || y < 0 || x >= MW || y >= MH) return false;
    const g = WORLD.ground[y][x];
    if (kind === 'erase') {
      const t = S.tiles[key(x, y)];
      if (t !== 'road' && t !== 'farm') return false;
      continue;
    }
    if (g === 'w') return false;
    if (kind === 'mine') { if (g !== 'r') return false; }
    else if (kind === 'road' || kind === 'farm' || kind === 'tree') { if (g !== 'g') return false; }
    else if (g === 's') return false;
    if (inBalai(x, y) || isDoor(x, y)) return false;
    if (treeAt(x, y) || rockAt(x, y)) return false;
    if (buildingAt(x, y)) return false;
    if (S.tiles[key(x, y)]) return false;
    if (size === 2 && S.crops[key(x, y)]) return false;
  }
  return true;
}
function enterBuild(kind) {
  if (S.dun) return;
  S.buildMode = kind;
  closePanel(); closeMenu();
  S.ghost = {
    x: clamp(Math.floor(S.px / TILE) + S.face.x * 2, 0, MW - 2),
    y: clamp(Math.floor(S.py / TILE) + S.face.y * 2, 0, MH - 2),
  };
  refreshBuildbar();
  el.buildbar.hidden = false; el.btnBuild.classList.add('on');
}
function exitBuild() {
  S.buildMode = null;
  el.buildbar.hidden = true; el.btnBuild.classList.remove('on');
}
function refreshBuildbar() {
  const k = S.buildMode;
  let txt = '';
  if (BUILD[k]) txt = BUILD[k].name + ' — ' + costText(BUILD[k].cost);
  else if (k === 'road') txt = 'Jalan — gratis';
  else if (k === 'farm') txt = 'Lahan petani — gratis';
  else if (k === 'tree') txt = 'Tanam pohon — 1 kayu';
  else if (k === 'erase') txt = 'Hapus petak — gratis';
  el.buildTxt.textContent = txt + ' · ketuk AKSI untuk menaruh';
}
function tryPlace() {
  const kind = S.buildMode, gx = S.ghost.x, gy = S.ghost.y;
  const cx = gx * TILE + TILE, cy = gy * TILE + TILE;
  if (!ghostValid(gx, gy, kind)) { sfx.error(); addFloat(cx, cy - 20, 'Tidak bisa', '#ff8a8a'); return; }
  if (kind === 'road' || kind === 'farm') {
    S.tiles[key(gx, gy)] = kind;
    sfx.place(); burst(cx - 16, cy - 16, kind === 'road' ? '#b08a54' : '#8a5a33', 6, 50);
    return;
  }
  if (kind === 'erase') {
    delete S.tiles[key(gx, gy)];
    delete S.crops[key(gx, gy)];
    sfx.place(); burst(cx - 16, cy - 16, '#7cc24f', 6, 50);
    return;
  }
  if (kind === 'tree') {
    if (S.wood < 1) { sfx.error(); addFloat(cx, cy - 20, 'Butuh 1 kayu', '#ff8a8a'); return; }
    S.wood -= 1;
    S.planted.push({ tx: gx, ty: gy, hp: TREE_HP, respawn: 0, shake: 0, seed: Math.random(), planted: true, grow: TREE_GROW });
    sfx.plant(); burst(cx - 16, cy - 16, '#5cb84d', 6, 50);
    return;
  }
  const def = BUILD[kind];
  if (!def) return;
  if (S.th < def.th) { sfx.error(); addFloat(cx, cy - 20, 'Butuh townhall tingkat ' + def.th, '#ff8a8a'); return; }
  if (!hasCost(def.cost)) { sfx.error(); addFloat(cx, cy - 20, 'Butuh ' + costText(def.cost), '#ff8a8a'); return; }
  payCost(def.cost);
  S.buildings.push({ type: kind, x: gx, y: gy, level: 1, prog: 0, built: false, invested: Object.assign({}, def.cost) });
  sfx.place();
  burst(cx, cy, '#d9a066', 8, 60);
}
function buildingName(b) {
  if (b.type !== 'hut') return BUILD[b.type].name;
  return ['?', 'Gubuk', 'Rumah', 'Rumah Besar'][b.level];
}
function upgradeBuilding(b) {
  if (b.type !== 'hut' || b.level >= 3 || !b.built) return false;
  const cost = HUT_UP[b.level];
  if (!hasCost(cost)) { sfx.error(); return false; }
  payCost(cost);
  for (const k in cost) b.invested[k] = (b.invested[k] || 0) + cost[k];
  b.level++; b.built = false; b.prog = 0;
  sfx.place();
  return true;
}
function demolishBuilding(b) {
  // Kembali setengah dari semua bahan yang pernah ditanam di bangunan ini.
  const refund = {};
  for (const k in b.invested) refund[k] = Math.floor(b.invested[k] / 2);
  gainCost(refund);
  S.buildings.splice(S.buildings.indexOf(b), 1);
  burst(b.x * TILE + TILE, b.y * TILE + TILE, '#b08a54', 10, 70);
  sfx.place();
  if (b.type === 'hut') rehouseVillagers();
  return refund;
}
function houseCapacity() {
  let cap = 0;
  for (const b of S.buildings) if (b.type === 'hut' && b.built) cap += HUT_CAP[b.level];
  return cap;
}
function rehouseVillagers() {
  // Warga yang rumahnya dibongkar pindah ke rumah kosong; kalau tidak ada, pergi.
  for (const v of S.villagers) {
    if (v.home && S.buildings.includes(v.home) && v.home.built) continue;
    v.home = findFreeHouse();
    if (!v.home) {
      addFloat(v.x, v.y - 26, 'Pergi...', '#ff8a8a');
      S.villagers.splice(S.villagers.indexOf(v), 1);
    }
  }
}
function findFreeHouse() {
  for (const b of S.buildings) {
    if (b.type !== 'hut' || !b.built) continue;
    const used = S.villagers.filter(v => v.home === b).length;
    if (used < HUT_CAP[b.level]) return b;
  }
  return null;
}
function celebrateBuilding(b) {
  celebrate(b.x * TILE + TILE, b.y * TILE + TILE, buildingName(b) + ' selesai!');
  if (b.type === 'hut' && !S.flags.hut1) { S.flags.hut1 = true; showBanner('Gubuk pertama selesai!'); }
}

