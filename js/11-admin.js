'use strict';
// ---------- Panel admin: alat tes, jelas berlabel, tiap aksi tercatat di chat ----------
function adminLog(text) { addChat('[ADMIN] ' + text, 'sys'); }
function renderAdmin() {
  let h = '<h3>ADMIN — Alat Tes</h3><p>Panel ini hanya untuk mengetes fitur tanpa main dari nol.</p>';
  h += '<div class="crow"><span>Beri gems</span><span><input type="number" data-role="admin-gems" value="10000" min="0"> <button data-act="admin-gems">BERI</button></span></div>';
  h += '<div class="crow"><span>Beri item</span><span><select data-role="admin-item">';
  for (const id in ITEMS) h += '<option value="' + id + '">' + ITEMS[id].name + '</option>';
  h += '</select> <input type="number" data-role="admin-qty" value="10" min="1"> <button data-act="admin-item">BERI</button></span></div>';
  h += '<div class="crow"><span>Beri lock</span><span><select data-role="admin-lock">' +
    '<option value="lock-small">Small Lock</option><option value="lock-big">Big Lock</option>' +
    '<option value="lock-huge">Huge Lock</option><option value="lock-world">World Lock</option>' +
    '<option value="diamond-lock">Diamond Lock</option><option value="bluegem-lock">Blue Gem Lock</option></select> ' +
    '<input type="number" data-role="admin-lock-qty" value="1" min="1"> <button data-act="admin-lock">BERI</button></span></div>';
  h += '<div class="crow"><span>Atur level</span><span><input type="number" data-role="admin-level" value="10" min="1" max="125"> <button data-act="admin-level">ATUR</button></span></div>';
  h += '<div class="crow"><span>Atur XP</span><span><input type="number" data-role="admin-xp" value="500" min="0"> <button data-act="admin-xp">BERI XP</button></span></div>';
  h += '<div class="crow"><span>Resep splice</span><span><button data-act="admin-recipes">BUKA SEMUA RESEP</button></span></div>';
  h += '<div class="crow"><span>Pohon</span><span><button data-act="admin-grow">TUMBUHKAN SEMUA SEKETIKA</button></span></div>';
  h += '<div class="crow"><span>Teleport</span><span><select data-role="admin-world">';
  for (const n of Object.keys(S.worlds).sort()) h += '<option value="' + escapeHtml(n) + '">' + escapeHtml(n) + '</option>';
  h += '</select> <button data-act="admin-teleport">TELEPORT</button></span></div>';
  h += '<div class="crow"><span>World saat ini</span><span><button data-act="admin-clear">KOSONGKAN WORLD</button></span></div>';
  h += '<div class="crow"><span>Save</span><span><button data-act="admin-reset">RESET SAVE</button></span></div>';
  return h;
}
function adminGiveGems(n) { S.gems += n; adminLog('+' + n + ' gems.'); refreshHUD(); }
function adminGiveItem(id, qty) { gainItem(id, qty); adminLog('+' + qty + ' ' + ITEMS[id].name + '.'); refreshHUD(); }
function adminSetLevel(n) {
  S.level = clamp(n, 1, LEVEL_CAP);
  if (S.level >= LEVEL_CAP) S.xp = 0;
  adminLog('Level diatur ke ' + S.level + '.'); refreshHUD();
}
function adminGiveXp(n) { gainXp(n); adminLog('+' + n + ' XP.'); }
function adminUnlockRecipes() {
  for (const r of SPLICE_RECIPES) {
    const rk = r.a + '+' + r.b;
    if (!S.knownSplice.includes(rk)) S.knownSplice.push(rk);
  }
  adminLog('Semua resep dibuka.');
}
function adminGrowAll() {
  for (const k in S.world.trees) S.world.trees[k].plantedAt = nowMs() - growTimeMs(S.world.trees[k].item) - 1;
  adminLog('Semua pohon di world ini ditumbuhkan seketika.');
}
function adminClearWorld() {
  const name = S.worldName;
  S.worlds[name] = genWorld(name);
  S.world = S.worlds[name];
  S.px = S.world.spawn.tx * TILE + 16; S.py = S.world.spawn.ty * TILE + 4;
  S.vx = 0; S.vy = 0; S.tileHp = {}; S.tileHit = {};
  S.drops = []; S.gemDrops = [];
  spawnTrader();
  adminLog('World ' + name + ' dikosongkan dan dibuat ulang.');
  refreshHUD();
}
function adminReset() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* abaikan */ }
  initState(S);
  closePanel();
  showWorldSel();
  refreshHUD();
  renderChat();
}
function onAdminClick(act, b) {
  if (act === 'admin-gems') adminGiveGems(parseInt(panelInput('admin-gems'), 10) || 0);
  else if (act === 'admin-item') adminGiveItem(panelInput('admin-item'), parseInt(panelInput('admin-qty'), 10) || 1);
  else if (act === 'admin-lock') adminGiveItem(panelInput('admin-lock'), parseInt(panelInput('admin-lock-qty'), 10) || 1);
  else if (act === 'admin-level') adminSetLevel(parseInt(panelInput('admin-level'), 10) || 1);
  else if (act === 'admin-xp') adminGiveXp(parseInt(panelInput('admin-xp'), 10) || 0);
  else if (act === 'admin-recipes') adminUnlockRecipes();
  else if (act === 'admin-grow') adminGrowAll();
  else if (act === 'admin-teleport') { closePanel(); enterWorld(panelInput('admin-world')); }
  else if (act === 'admin-clear') adminClearWorld();
  else if (act === 'admin-reset') { adminReset(); return; }
  if (S.panel && S.panel.kind === 'admin') renderPanel();
  refreshHUD();
}
