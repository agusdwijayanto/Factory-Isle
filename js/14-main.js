'use strict';
// ---------- Simpan dan muat ----------
function save() {
  try {
    const d = {
      v: 1, gems: S.gems, inv: S.inv, favs: S.favs, sel: S.sel, mode: S.mode,
      level: S.level, xp: S.xp, roles: S.roles, knownSplice: S.knownSplice,
      flags: S.flags, worlds: S.worlds, worldName: S.worldName,
      px: S.px, py: S.py, hp: S.hp, zoom: S.zoom,
      guild: S.guild, wotdClaimed: S.wotdClaimed,
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(d));
  } catch (e) { /* penyimpanan penuh/diblokir: game tetap jalan */ }
}
function load() {
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!d || d.v !== 1 || !d.worlds || !d.worlds[d.worldName]) return false;
    S.gems = d.gems; S.inv = d.inv; S.favs = d.favs || {}; S.sel = d.sel || null; S.mode = d.mode || 'fist';
    S.level = d.level; S.xp = d.xp; S.roles = d.roles; S.knownSplice = d.knownSplice || [];
    S.flags = d.flags || {}; S.worlds = d.worlds; S.worldName = d.worldName;
    S.world = S.worlds[S.worldName];
    S.px = d.px; S.py = d.py; S.hp = d.hp != null ? d.hp : 100;
    S.zoom = clamp(d.zoom || 1, 0.5, 2);
    S.guild = d.guild || null; S.wotdClaimed = d.wotdClaimed || {};
    S.vx = 0; S.vy = 0;
    spawnTrader();
    return true;
  } catch (e) { return false; }
}
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('pagehide', save);

// ---------- Param URL untuk keperluan tes/screenshot ----------
function applyParams() {
  const q = {};
  const s = (typeof location !== 'undefined' ? location.search || '' : '').replace(/^\?/, '');
  for (const pair of s.split('&')) {
    if (!pair) continue;
    const kv = pair.split('=');
    q[kv[0]] = kv[1] || '';
  }
  if (q.autostart === '1') enterWorld(q.world || 'AWAL');
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
load();
bindInput();
applyParams();
fitCanvas();
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('resize', fitCanvas);
if (S.worldSelOpen) showWorldSel();
refreshHUD();
renderChat();
if (typeof requestAnimationFrame === 'function') requestAnimationFrame(frame);

// ---------- Kait tes headless ----------
window.__GT = {
  S, TILE, MW, MH, SAVE_KEY, TILES, ITEMS, LOCK_DEFS, SPLICE_RECIPES, STORE_ITEMS,
  WEATHERS, PUNCH_CD, REACH, LEVEL_CAP, ROLE_CAP, STACK_MAX, TRADE_SLOTS,
  T_EMPTY, T_DIRT, T_ROCK, T_WOOD, T_GRASS, T_BRICK, T_DOOR, T_LAVA, T_CAVE,
  T_GOLDEN, T_FIREPLACE, T_CHANDELIER, T_PEPPER, T_BEDROCK, T_SIGN, T_GLASS,
  T_VENDING, T_WEATHER, T_CHEST, T_LOCK_S, T_LOCK_B, T_LOCK_H, T_LOCK_W,
  update, render, doJump, updatePlayer, updateCamera, setZoom, pollMove,
  fgAt, bgAt, solidAt, playerTile, inReach, surfAt, genWorld, validWorldName,
  punchTile, breakTile, placeTile, damageTile, actTile, actForward, wrenchAct,
  treeAt, lockArea, lockAt, removeLockAt, teleportDoor, toggleWeather, hurtPlayer,
  treeGrown, treeStage, canPlantAt, plantAt, punchTree, harvestTree, spawnGems,
  dropItem, updateDrops, treeLabel, growTimeMs, xpFor, fmtTime,
  spliceAt, tryPlantOrSplice, findSpliceRecipe,
  recycleItem, storeItem, takeFromChest, dropSelected, toggleFav, combineLocks, splitLocks, invList,
  buyItem, itemValue, wlValue, traderStock, openTrade, tradeAdd, tradeRemove,
  refreshNpcSide, tradeAccept, tradeDo, tradeCancel, tradePlayerValue,
  vendSet, vendTakeStock, vendWithdraw, vendRemove, vendTick,
  gainXp, addRoleXp, xpNeed, roleNeed, nameColor,
  addChat, renderChat, sendChat, runCommand, broadcastTick, createGuild, guildTick,
  setGuildStatement, pickWOTD, enterWOTDCheck, updateTrader, spawnTrader,
  openPanel, closePanel, renderPanel, refreshHUD, showWorldSel, hideWorldSel, enterWorld,
  toggleMode, canvasTile, keys, touch,
  adminGiveGems, adminGiveItem, adminSetLevel, adminGiveXp, adminUnlockRecipes,
  adminGrowAll, adminClearWorld, adminReset, onAdminClick,
  save, load, nowMs,
  reset() { initState(S); closePanel(); hideWorldSel(); refreshHUD(); renderChat(); },
  teleport(x, y) { S.px = x; S.py = y; S.cam.x = x; S.cam.y = y; S.vx = 0; S.vy = 0; },
  give(res) { for (const k in res) gainItem(k, res[k]); },
  giveGems(n) { S.gems += n; },
  setNow(ms) { S.nowOverride = ms; },
  clearNow() { S.nowOverride = null; },
  paintTile,
};
