'use strict';
// ---------- Panel, menu bangun, HUD, input ----------
function openPanel(p) { S.panel = p; renderPanel(); el.panel.hidden = false; }
function closePanel() { S.panel = null; el.panel.hidden = true; }
function openMenu() { closePanel(); refreshMenu(); el.menu.hidden = false; }
function closeMenu() { el.menu.hidden = true; }
function setPlace(place) {
  S.place = place;
  if (place) {
    const txt = place.kind === 'tile' ? TILES[place.code].name : ITEMS[place.id].name;
    el.buildTxt.textContent = 'Taruh: ' + txt + ' — klik petak kosong';
    el.buildbar.hidden = false;
  } else el.buildbar.hidden = true;
  refreshHUD();
}
function exitBuild() { setPlace(null); closeMenu(); }
function renderBuildMenu() {
  let h = '';
  for (const e of BUILD_ENTRIES) h += '<button data-build="' + e.code + '" data-name="' + TILES[e.code].name + '"></button>';
  h += '<button data-build="cancel" data-name="Tutup">Tutup</button>';
  el.menu.innerHTML = h;
}
function refreshMenu() {
  const btns = el.menu.querySelectorAll ? el.menu.querySelectorAll('button[data-build]') : [];
  for (const b of btns) {
    const k = b.getAttribute('data-build');
    if (k === 'cancel') continue;
    const e = BUILD_ENTRIES.find(x => x.code === parseInt(k, 10));
    b.disabled = !hasCost(e.cost);
    b.textContent = b.getAttribute('data-name') + ' — ' + costText(e.cost);
  }
}
function qtyButtons(act, extra) {
  return '<button data-act="' + act + '" ' + extra + ' data-n="1">1</button>' +
    '<button data-act="' + act + '" ' + extra + ' data-n="10">10</button>' +
    '<button data-act="' + act + '" ' + extra + ' data-n="all">Semua</button>';
}
function sellListHtml() {
  let h = '<div class="crow"><b>Jual (dibayar besok pagi):</b></div>';
  let any = false;
  for (const id in S.inv) {
    if (id === 'turnip' || !ITEMS[id].sell) continue;
    any = true;
    h += '<div class="crow"><span>' + ITEMS[id].name + ' (' + S.inv[id] + ') — ' + sellPrice(id) + ' koin</span> ' + qtyButtons('sell', 'data-item="' + id + '"') + '</div>';
  }
  if (!any) h += '<p>Tas kosong.</p>';
  h += '<p>Terjual hari ini: ' + S.soldToday + '/' + DAILY_LIMIT + ' · Terbeli: ' + S.boughtToday + '/' + DAILY_LIMIT + '</p>';
  return h;
}
function renderPanel() {
  const p = S.panel;
  if (!p) return;
  let h = '';
  if (p.kind === 'merchant') {
    h += '<h3>Pedagang</h3><div class="crow"><b>Beli:</b></div>';
    for (const id of SHOP_BUY) h += '<div class="crow"><span>' + ITEMS[id].name + ' — ' + ITEMS[id].buy + ' koin</span> ' + qtyButtons('buy', 'data-item="' + id + '"') + '</div>';
    h += sellListHtml();
    h += '<h3>Pasar Lobak</h3>';
    if (dayInWeek(S.day) === 0) {
      if (!S.turnip || S.turnip.week !== weekOf(S.day)) genTurnipWeek(weekOf(S.day));
      h += '<p>Hari Minggu: beli lobak ' + S.turnip.buyPrice + ' koin. Punyamu: ' + countItem('turnip') + '</p>' + qtyButtons('buy-turnip', '');
    } else {
      h += '<p>Harga jual sekarang: ' + turnipPriceNow() + ' koin. Punyamu: ' + countItem('turnip') + '</p>' + qtyButtons('sell-turnip', '');
    }
    h += '<h3>Lahan</h3>';
    if (S.expansions < MAX_EXPAND) h += '<p>Perluasan ke-' + (S.expansions + 1) + ': +20 kolom, ' + EXPAND_COSTS[S.expansions] + ' koin.</p><button data-act="expand">Beli Lahan</button>';
    else h += '<p>Lahan sudah mentok.</p>';
  } else if (p.kind === 'quest') {
    h += '<h3>Pemberi Misi</h3>';
    S.missions.forEach((m, i) => {
      const have = Math.min(missionHave(m), m.need);
      h += '<div class="crow"><span>' + missionText(m) + ' (' + have + '/' + m.need + ') — ' + m.rewardCoins + ' koin + ' + m.rewardTask + ' tugas</span> <button data-act="claim" data-i="' + i + '"' + (m.claimed || have < m.need ? ' disabled' : '') + '>' + (m.claimed ? 'Sudah diambil' : 'Ambil Hadiah') + '</button></div>';
    });
    h += '<h3>Toko Hadiah</h3><p>Mata uang tugasmu: ' + S.taskCoins + '</p>';
    for (const g of GIFT_SHOP) h += '<div class="crow"><span>' + ITEMS[g.item].name + ' — ' + g.cost + ' tugas</span> <button data-act="gift" data-item="' + g.item + '"' + (S.taskCoins < g.cost ? ' disabled' : '') + '>Beli</button></div>';
  } else if (p.kind === 'skills') {
    h += '<h3>Skill</h3>';
    for (const k in SKILL_NAMES) {
      const sk = S.skills[k];
      h += '<p><b>' + SKILL_NAMES[k] + '</b> — tingkat ' + sk.level + ' · XP ' + sk.xp + '/' + (sk.level * 100) + '</p>';
      for (const tier of [5, 10]) {
        const slot = tier === 5 ? 'prof5' : 'prof10';
        if (sk[slot]) h += '<p>Profesi ' + tier + ': ' + PROFESSIONS[k][tier].find(x => x.id === sk[slot]).name + '</p>';
        else if (sk.level >= tier) {
          h += '<div class="crow"><b>Pilih profesi ' + tier + ':</b> ';
          for (const pr of PROFESSIONS[k][tier]) h += '<button data-act="prof" data-skill="' + k + '" data-tier="' + tier + '" data-id="' + pr.id + '">' + pr.name + ' (' + pr.desc + ')</button>';
          h += '</div>';
        }
      }
    }
  } else if (p.kind === 'book') {
    h += '<h3>Buku Resep</h3><div class="crow"><b>Splice:</b></div>';
    SPLICE_RECIPES.forEach((r, i) => {
      h += '<p>' + (S.knownSplice.includes(i) ? ITEMS[r.a].name + ' + ' + ITEMS[r.b].name + ' = ' + ITEMS[r.out].name : '??? + ??? = ???') + '</p>';
    });
    h += '<div class="crow"><b>Crafting:</b></div>';
    for (const r of CRAFT_RECIPES) h += '<p>' + r.name + ' — ' + costText(r.cost) + (hasCost(r.cost) ? ' ✓ bisa dibuat' : '') + '</p>';
  } else if (p.kind === 'inv') {
    h += '<h3>Tas</h3>';
    const ids = Object.keys(S.inv);
    if (!ids.length) h += '<p>Kosong. Pukul blok untuk mendapat benih dan bahan.</p>';
    for (const id of ids) {
      const usable = ITEMS[id].seed || ITEMS[id].tile || id === 'fertilizer';
      h += '<button data-act="inv-sel" data-item="' + id + '"' + (usable ? '' : ' disabled') + '>' + ITEMS[id].name + ' (' + S.inv[id] + ')</button> ';
    }
    h += '<p>Klik benih atau barang untuk memilihnya, lalu klik petak di world.</p>';
  } else if (p.kind === 'craft') {
    const stName = { workbench: 'Meja Kerja', furnace: 'Tungku', splice: 'Meja Splice' }[p.station];
    h += '<h3>' + stName + '</h3>';
    for (const r of CRAFT_RECIPES.filter(c => c.station === p.station)) {
      h += '<div class="crow"><span>' + r.name + ' — ' + costText(r.cost) + '</span> <button data-act="craft" data-id="' + r.id + '"' + (hasCost(r.cost) ? '' : ' disabled') + '>Buat</button></div>';
    }
    if (p.station === 'splice') {
      h += '<div class="crow"><b>Splice benih:</b></div>';
      SPLICE_RECIPES.forEach((r, i) => {
        if (!S.knownSplice.includes(i)) return;
        const need = r.a === r.b ? 2 : 1;
        const ok = countItem(r.a) >= need && countItem(r.b) >= need;
        h += '<div class="crow"><span>' + ITEMS[r.a].name + ' + ' + ITEMS[r.b].name + ' = ' + ITEMS[r.out].name + '</span> <button data-act="splice" data-i="' + i + '"' + (ok ? '' : ' disabled') + '>Splice</button></div>';
      });
    }
  } else if (p.kind === 'shipbin') {
    h += '<h3>Kotak Kirim</h3>' + sellListHtml();
  }
  h += '<button data-act="close">Tutup</button>';
  el.panel.innerHTML = h;
}
el.panel.addEventListener('click', e => {
  const b = e.target.closest ? e.target.closest('button') : null;
  if (!b || !S.panel) return;
  const actName = b.getAttribute('data-act');
  audio();
  if (actName === 'close') { closePanel(); return; }
  const rawN = b.getAttribute('data-n');
  const n = rawN === 'all' ? 999 : parseInt(rawN || '1', 10);
  if (actName === 'buy') { buyItem(b.getAttribute('data-item'), n); renderPanel(); }
  else if (actName === 'sell') { sellItem(b.getAttribute('data-item'), n); renderPanel(); }
  else if (actName === 'buy-turnip') { buyTurnips(n); renderPanel(); }
  else if (actName === 'sell-turnip') { sellTurnips(n); renderPanel(); }
  else if (actName === 'expand') { expandLand(); renderPanel(); }
  else if (actName === 'claim') { claimMission(parseInt(b.getAttribute('data-i'), 10)); renderPanel(); }
  else if (actName === 'gift') { buyGift(b.getAttribute('data-item')); renderPanel(); }
  else if (actName === 'prof') { chooseProfession(b.getAttribute('data-skill'), parseInt(b.getAttribute('data-tier'), 10), b.getAttribute('data-id')); renderPanel(); }
  else if (actName === 'craft') { craftItem(b.getAttribute('data-id')); renderPanel(); }
  else if (actName === 'splice') { const r = SPLICE_RECIPES[parseInt(b.getAttribute('data-i'), 10)]; spliceSeeds(r.a, r.b); renderPanel(); }
  else if (actName === 'inv-sel') {
    const id = b.getAttribute('data-item');
    if (ITEMS[id].seed) setPlace({ kind: 'seed', id });
    else if (ITEMS[id].tile) setPlace({ kind: 'item', id });
    else if (id === 'fertilizer') setPlace({ kind: 'use', id });
    closePanel();
  }
  refreshHUD();
});
el.menu.addEventListener('click', e => {
  const b = e.target.closest ? e.target.closest('button') : null;
  if (!b) return;
  audio();
  const k = b.getAttribute('data-build');
  if (k === 'cancel' || b.disabled) { closeMenu(); return; }
  const entry = BUILD_ENTRIES.find(x => x.code === parseInt(k, 10));
  setPlace({ kind: 'tile', code: entry.code, cost: entry.cost });
  closeMenu();
});
$('btnCancel').addEventListener('pointerdown', e => { e.preventDefault(); exitBuild(); });

// ---------- HUD ----------
function refreshHUD() {
  el.hCoins.textContent = S.coins;
  el.hTask.textContent = S.taskCoins;
  el.hDay.textContent = 'Hari ' + S.day + ' · ' + SEASONS[seasonOf(S.day)];
  el.hPhase.textContent = S.phase === 'day' ? 'Siang' : 'Malam';
  const len = S.phase === 'day' ? DAY_LEN : NIGHT_LEN;
  el.hCyc.style.width = clamp(S.t / len * 100, 0, 100) + '%';
  el.hSel.textContent = S.place ? (S.place.kind === 'tile' ? TILES[S.place.code].name : ITEMS[S.place.id].name) : '-';
}

// ---------- Input ----------
const keys = {};
const touch = { left: false, right: false };
function pollMove() {
  let m = 0;
  if (keys['a'] || keys['arrowleft'] || touch.left) m -= 1;
  if (keys['d'] || keys['arrowright'] || touch.right) m += 1;
  return m;
}
function interact() {
  const n = nearNPC();
  if (n) { openPanel({ kind: n.id === 'merchant' ? 'merchant' : 'quest' }); return; }
  const p = playerTile();
  for (let y = p.ty - 2; y <= p.ty + 2; y++) for (let x = p.tx - 2; x <= p.tx + 2; x++) {
    const code = tileAt(x, y);
    if (code !== T_EMPTY && TILES[code] && TILES[code].station) { openPanel({ kind: 'craft', station: TILES[code].station }); return; }
    if (code === T_SHIPBIN) { openPanel({ kind: 'shipbin' }); return; }
  }
  actForward();
}
window.addEventListener('keydown', e => {
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
  audio();
  if (e.key === ' ' || e.key.toLowerCase() === 'w') { doJump(); if (e.key === ' ') actForward(); }
  if (e.key.toLowerCase() === 'e' && !e.repeat) interact();
  if (e.key.toLowerCase() === 'b' && !e.repeat) {
    if (S.place) exitBuild();
    else if (!el.menu.hidden) closeMenu();
    else openMenu();
  }
  if ((e.key.toLowerCase() === 'i' || e.key === 'Tab') && !e.repeat) openPanel({ kind: 'inv' });
  if (e.key.toLowerCase() === 'p' && !e.repeat) openPanel({ kind: 'skills' });
  if (e.key.toLowerCase() === 'o' && !e.repeat) openPanel({ kind: 'book' });
  if (e.key === 'Escape') { closePanel(); exitBuild(); }
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
function canvasTile(e) {
  const r = canvas.getBoundingClientRect();
  const wx = (e.clientX - r.left) * (VW / r.width) / S.zoom + S.cam.x;
  const wy = (e.clientY - r.top) * (VH / r.height) / S.zoom + S.cam.y;
  return { tx: Math.floor(wx / TILE), ty: Math.floor(wy / TILE), wx, wy };
}
canvas.addEventListener('click', e => {
  audio();
  const t = canvasTile(e);
  for (const n of S.npcs) {
    const nx = n.tx * TILE + 16, ny = n.ty * TILE + 16;
    if (Math.abs(t.wx - nx) < 24 && Math.abs(t.wy - ny) < 32) {
      openPanel({ kind: n.id === 'merchant' ? 'merchant' : 'quest' });
      return;
    }
  }
  if (S.place && S.place.kind === 'use') {
    const p = plantAt(t.tx, t.ty);
    if (p) fertilizePlant(p);
    return;
  }
  if (S.place) { placeTile(t.tx, t.ty); refreshHUD(); return; }
  actTile(t.tx, t.ty);
  refreshHUD();
});
function holdBtn(id, on, off) {
  const b = $(id);
  b.addEventListener('pointerdown', e => { e.preventDefault(); audio(); on(); });
  const end = e => { e.preventDefault(); if (off) off(); };
  b.addEventListener('pointerup', end);
  b.addEventListener('pointercancel', end);
  b.addEventListener('pointerleave', end);
}
holdBtn('btnLeft', () => { touch.left = true; }, () => { touch.left = false; });
holdBtn('btnRight', () => { touch.right = true; }, () => { touch.right = false; });
holdBtn('btnJump', () => doJump());
holdBtn('btnAct', () => { actForward(); refreshHUD(); });
holdBtn('btnBuild', () => {
  if (S.place) exitBuild();
  else if (!el.menu.hidden) closeMenu();
  else openMenu();
});
$('btnInv').addEventListener('click', () => { audio(); openPanel({ kind: 'inv' }); });
$('btnSkill').addEventListener('click', () => { audio(); openPanel({ kind: 'skills' }); });
$('btnBook').addEventListener('click', () => { audio(); openPanel({ kind: 'book' }); });
renderBuildMenu();
