'use strict';
// ---------- Simpan dan muat ----------
function save() {
  try {
    const d = {
      v: 1, coins: S.coins, taskCoins: S.taskCoins, inv: S.inv, tiles: S.tiles,
      plants: S.plants, mw: S.mw, tileHp: S.tileHp, placed: S.placed,
      px: S.px, py: S.py, day: S.day, t: S.t, phase: S.phase, skills: S.skills,
      shipQ: S.shipQ, soldToday: S.soldToday, boughtToday: S.boughtToday,
      counters: S.counters, missions: S.missions, knownSplice: S.knownSplice,
      turnip: S.turnip, expansions: S.expansions, flags: S.flags, zoom: S.zoom,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(d));
  } catch (e) { /* penyimpanan penuh/diblokir: game tetap jalan */ }
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!d || d.v !== 1 || !Array.isArray(d.tiles)) return false;
    S.coins = d.coins; S.taskCoins = d.taskCoins; S.inv = d.inv; S.tiles = d.tiles;
    S.plants = d.plants; S.mw = d.mw; S.tileHp = d.tileHp || {}; S.placed = d.placed || {};
    S.px = d.px; S.py = d.py; S.day = d.day; S.t = d.t; S.phase = d.phase;
    S.skills = d.skills; S.shipQ = d.shipQ; S.soldToday = d.soldToday; S.boughtToday = d.boughtToday;
    S.counters = d.counters; S.missions = d.missions; S.knownSplice = d.knownSplice;
    S.turnip = d.turnip; S.expansions = d.expansions; S.flags = d.flags || {};
    S.zoom = clamp(d.zoom || 1, 0.5, 2);
    S.vx = 0; S.vy = 0;
    return true;
  } catch (e) { return false; }
}
window.addEventListener('pagehide', save);

// ---------- Param URL untuk keperluan tes/screenshot ----------
function applyParams() {
  const q = {};
  const s = (typeof location !== 'undefined' ? location.search || '' : '').replace(/^\?/, '');
  for (const pair of s.split('&')) {
    if (!pair) continue;
    const kv = pair.split('=');
    q[kv[0]] = kv[1] || '';
  }
  if (q.scene === 'merchant') openPanel({ kind: 'merchant' });
  if (q.scene === 'quest') openPanel({ kind: 'quest' });
  if (q.scene === 'skills') openPanel({ kind: 'skills' });
  if (q.freeze === '1') S.frozen = true;
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

// ---------- Boot ----------
if (!load()) { genMissions(); genTurnipWeek(0); }
applyParams();
refreshHUD();
if (typeof requestAnimationFrame === 'function') requestAnimationFrame(frame);

// ---------- Kait tes headless ----------
window.__DM = {
  S, TILE, MW0, MH, DAY_LEN, NIGHT_LEN, SEASON_LEN, SAVE_KEY, TILES, ITEMS, PLANTS,
  SPLICE_RECIPES, CRAFT_RECIPES, PROFESSIONS, GIFT_SHOP, SHOP_BUY, EXPAND_COSTS,
  update, render, doJump, updatePlayer, updateCamera, setZoom, pollMove, tileAt, solidAt, playerTile,
  punchTile, breakTile, placeTile, actTile, actForward, inReach, effHp,
  plantAt, grown, plantSeed, waterPlant, harvestPlant, inSeason, tryBreed, breedResult, fertilizePlant,
  spliceSeeds, findSpliceRecipe, discoverRecipes, craftItem, nearStation,
  buyItem, sellItem, sellPrice, buyGift, onDawnEconomy,
  genTurnipWeek, turnipPriceNow, buyTurnips, sellTurnips, rotTurnips, expandLand,
  gainXP, chooseProfession, hasProf, genMissions, claimMission, missionHave, nearNPC,
  openPanel, closePanel, openMenu, closeMenu, setPlace, interact, refreshHUD,
  save, load, onDawn, genColumns, surfAt, seasonOf, dayInWeek, weekOf, keys, touch,
  reset() { initState(S); genMissions(); genTurnipWeek(0); closePanel(); closeMenu(); setPlace(null); S.ghost = null; refreshHUD(); },
  teleport(x, y) { S.px = x; S.py = y; S.cam.x = x; S.cam.y = y; S.vx = 0; S.vy = 0; },
  setClock(day, t, phase) { S.day = day; S.t = t; S.phase = phase; },
  give(res) { for (const k in res) gainItem(k, res[k]); },
};
