'use strict';
// ---------- Simpan dan muat ----------
function save() {
  try {
    const inDun = !!S.dun;
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      v: 1,
      px: inDun && S.returnPos ? S.returnPos.x : S.px,
      py: inDun && S.returnPos ? S.returnPos.y : S.py,
      hp: S.hp,
      wood: S.wood, stone: S.stone, wheat: S.wheat, bread: S.bread,
      iron: S.iron, coal: S.coal, gold: S.gold, diamond: S.diamond,
      day: S.day, t: S.t, phase: S.phase, th: S.th, equip: S.equip, flags: S.flags,
      trees: WORLD.trees.map(t => ({ hp: t.hp, respawn: t.respawn })),
      rocks: WORLD.rocks.map(r => ({ hp: r.hp, respawn: r.respawn })),
      crops: S.crops, tiles: S.tiles,
      planted: S.planted.map(p => ({ tx: p.tx, ty: p.ty, hp: p.hp, grow: p.grow })),
      buildings: S.buildings,
      villagers: S.villagers.map(v => ({
        x: v.x, y: v.y, job: v.job, hp: v.hp, fed: v.fed, dead: v.dead,
        home: v.home ? S.buildings.indexOf(v.home) : -1,
      })),
    }));
  } catch (e) { /* penyimpanan boleh gagal, game tetap jalan */ }
}
function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (!d || d.v !== 1) return; // simpanan versi lain diabaikan, mulai baru
    S.px = d.px; S.py = d.py; S.hp = d.hp;
    S.wood = d.wood; S.stone = d.stone; S.wheat = d.wheat; S.bread = d.bread;
    S.iron = d.iron; S.coal = d.coal; S.gold = d.gold; S.diamond = d.diamond;
    S.day = d.day; S.t = d.t; S.phase = d.phase; S.th = d.th || 1;
    S.equip = Object.assign(S.equip, d.equip || {});
    S.flags = d.flags || {};
    (d.trees || []).forEach((sv, i) => { if (WORLD.trees[i]) { WORLD.trees[i].hp = sv.hp; WORLD.trees[i].respawn = sv.respawn; } });
    (d.rocks || []).forEach((sv, i) => { if (WORLD.rocks[i]) { WORLD.rocks[i].hp = sv.hp; WORLD.rocks[i].respawn = sv.respawn; } });
    S.crops = d.crops || {}; S.tiles = d.tiles || {};
    S.planted = (d.planted || []).map(p => ({ tx: p.tx, ty: p.ty, hp: p.hp, respawn: 0, shake: 0, seed: Math.random(), planted: true, grow: p.grow }));
    S.buildings = d.buildings || [];
    S.villagers = (d.villagers || []).map(sv => ({
      x: sv.x, y: sv.y, job: sv.job, hp: sv.hp, fed: sv.fed, dead: sv.dead,
      home: sv.home >= 0 ? S.buildings[sv.home] || null : null,
      hitCd: 0, prodT: 0, prodN: 0, phase: Math.random() * 6, walk: 0,
      face: { x: 0, y: 1 }, moving: false,
    }));
    S.cam.x = S.px; S.cam.y = S.py;
  } catch (e) { /* simpanan rusak diabaikan, mulai baru */ }
}
window.addEventListener('pagehide', save);
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

// ---------- Param URL untuk keperluan tes/screenshot ----------
function applyScene() {
  const q = {};
  const s = (typeof location !== 'undefined' ? location.search : '').replace(/^\?/, '');
  if (s) for (const p of s.split('&')) { const kv = p.split('='); if (kv[0]) q[kv[0]] = decodeURIComponent(kv[1] || ''); }
  if (q.freeze) S.frozen = true;
  for (const k of ['wood', 'stone', 'wheat', 'bread', 'iron', 'coal', 'gold', 'diamond']) if (q[k] !== undefined) S[k] = parseInt(q[k], 10) || 0;
  if (q.th) S.th = clamp(parseInt(q.th, 10) || 1, 1, 3);
  if (q.scene === 'night') {
    S.phase = 'night'; S.t = DAY_LEN + 5;
    spawnWave();
  } else if (q.scene === 'build') {
    S.wood = 30;
    S.ghostLock = { x: 26, y: 14 };
    enterBuild('hut');
  } else if (q.scene === 'villagers') {
    S.wood = 100; S.stone = 100; S.wheat = 50; S.bread = 30;
    const h1 = { type: 'hut', x: 26, y: 14, level: 1, prog: 5, built: true, invested: { wood: 20 } };
    const h2 = { type: 'hut', x: 29, y: 14, level: 2, prog: 5, built: true, invested: { wood: 60, stone: 20 } };
    S.buildings.push(h1, h2);
    for (const job of ['wood', 'mine', 'farm']) {
      const v = spawnVillager();
      if (v) { v.job = job; v.x = 24 * TILE + Math.random() * 60; v.y = 17 * TILE + Math.random() * 40; }
    }
  } else if (q.scene === 'dungeon') {
    S.equip.sword = 1;
    enterDungeon();
  } else if (q.scene === 'panel') {
    S.wood = 100; S.stone = 100;
    const h = { type: 'hut', x: 26, y: 14, level: 2, prog: 5, built: true, invested: { wood: 60, stone: 20 } };
    S.buildings.push(h);
    openPanel({ kind: 'building', ref: h });
  }
}

// ---------- Loop ----------
let lastT = 0;
function frame(ts) {
  const dt = Math.min(0.05, (ts - lastT) / 1000 || 0.016);
  lastT = ts;
  update(dt);
  render();
  requestAnimationFrame(frame);
}
load();
applyScene();
refreshHUD();
if (typeof requestAnimationFrame === 'function') requestAnimationFrame(frame);

// ---------- Kait tes headless ----------
window.__DM = {
  S, WORLD, BUILD, TIERS, update, render, act, enterBuild, exitBuild, tryPlace, ghostValid,
  spawnWave, save, load, keys, input, joy, TILE, MW, MH, DAY_LEN, NIGHT_LEN,
  acceptVillager, declineVillager, spawnVillager, setJob, feedVillager, feedAllVillagers,
  upgradeBuilding, demolishBuilding, upgradeTownhall, craftItem, cookBread, tradeMarket,
  eatBread, enterDungeon, exitDungeon, openPanel, closePanel, openMenu, closeMenu, openVillagerList, cycleSpeed,
  hitTree, hitRock, harvestCrop, dropLoot, onDawn, houseCapacity, findFreeHouse,
  reset() { initState(S); closePanel(); closeMenu(); el.popup.hidden = true; refreshHUD(); },
  teleport(x, y) { S.px = x; S.py = y; S.cam.x = x; S.cam.y = y; },
  setClock(day, t, phase) { S.day = day; S.t = t; S.phase = phase; },
  give(res) { for (const k in res) S[k] += res[k]; },
};
