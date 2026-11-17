'use strict';
// ---------- Panel dialog biru, HUD, layar pilih world, input ----------
// Semua dialog mengikuti gaya Growtopia: panel biru tembus pandang, tombol
// chunky, teks putih. Satu div #panel dipakai bergantian per kind.
function openPanel(p) { S.panel = p; renderPanel(); el.panel.hidden = false; }
function closePanel() { S.panel = null; el.panel.hidden = true; }
function qtyButtons(act, extra) {
  return '<button data-act="' + act + '" ' + (extra || '') + ' data-n="1">1</button>' +
    '<button data-act="' + act + '" ' + (extra || '') + ' data-n="10">10</button>' +
    '<button data-act="' + act + '" ' + (extra || '') + ' data-n="all">Semua</button>';
}
function renderPanel() {
  const p = S.panel;
  if (!p) return;
  if (p.kind === 'inv') el.panel.classList.add('wide'); else el.panel.classList.remove('wide');
  let h = '<button class="close" data-act="close">X</button>';
  if (p.kind === 'inv') h += renderInv();
  else if (p.kind === 'store') h += renderStore();
  else if (p.kind === 'book') h += renderBook();
  else if (p.kind === 'profile') h += renderProfile();
  else if (p.kind === 'guild') h += renderGuild();
  else if (p.kind === 'trade') h += renderTrade();
  else if (p.kind === 'wrench') h += renderWrench(p);
  else if (p.kind === 'vending') h += renderVending(p);
  else if (p.kind === 'chest') h += renderChest();
  else if (p.kind === 'admin') h += renderAdmin();
  else if (p.kind === 'info') h += renderInfo(p);
  el.panel.innerHTML = h;
}
// Slot gaya Growtopia: kotak warna + jumlah + nama kecil + centang favorit.
function slotHtml(id, act, markSel) {
  const it = ITEMS[id];
  return '<div class="slot' + (markSel && S.sel === id ? ' sel' : '') + '" data-act="' + act + '" data-item="' + id + '">' +
    '<span class="sw" style="background:' + (it.color || '#888') + '"></span>' +
    '<span class="cnt">' + S.inv[id] + '</span>' +
    '<span class="nm">' + it.name + '</span>' +
    (S.favs[id] ? '<span class="favmark">✓</span>' : '') + '</div>';
}
function renderInv() {
  const q = (S.invSearch || '').toLowerCase();
  let h = '<h3>Tas</h3><input type="text" data-role="inv-search" placeholder="Enter Item Name" value="' + escapeHtml(S.invSearch || '') + '">';
  h += '<div class="invqty"><span>Jumlah:</span>' +
    '<button data-act="invqty" data-n="1"' + (S.invQty === 1 ? ' class="on"' : '') + '>1</button>' +
    '<button data-act="invqty" data-n="10"' + (S.invQty === 10 ? ' class="on"' : '') + '>10</button>' +
    '<button data-act="invqty" data-n="all"' + (S.invQty > 10 ? ' class="on"' : '') + '>Semua</button></div>';
  h += '<div class="invwrap"><div class="grid">';
  for (const id of invList()) {
    if (q && !ITEMS[id].name.toLowerCase().includes(q)) continue;
    h += slotHtml(id, 'select', true);
  }
  h += '</div><div class="invbtns">';
  const dis = S.sel ? '' : ' disabled';
  const sel = S.sel || '';
  h += '<button data-act="recycle" data-item="' + sel + '"' + dis + '>RECYCLE</button>';
  h += '<button data-act="store" data-item="' + sel + '"' + dis + '>STORE</button>';
  h += '<button data-act="drop" data-item="' + sel + '"' + dis + '>DROP</button>';
  h += '<button data-act="info" data-item="' + sel + '"' + dis + '>INFO</button>';
  h += '<button data-act="fav" data-item="' + sel + '"' + dis + '>' + (S.sel && S.favs[S.sel] ? 'UNFAV' : 'FAV') + '</button>';
  h += '</div></div>';
  if (S.sel) h += '<p>Terpilih: <b>' + ITEMS[S.sel].name + '</b> (' + countItem(S.sel) + ')</p>';
  else h += '<p>Ketuk item untuk memilih.</p>';
  h += '<div class="crow"><span>Lock: ' + countItem('lock-world') + ' WL · ' + countItem('diamond-lock') + ' DL · ' + countItem('bluegem-lock') + ' BGL</span>' +
    '<span><button data-act="combine">GABUNG LOCK</button> <button data-act="split">PECAH LOCK</button></span></div>';
  return h;
}
function renderStore() {
  let h = '<h3>Growtopia Store</h3><p>Gems: ' + S.gems + '</p>';
  for (const id of STORE_ITEMS) {
    h += '<div class="crow"><span>' + ITEMS[id].name + ' — ' + ITEMS[id].price + ' gems</span><span>' + qtyButtons('buy', 'data-item="' + id + '"') + '</span></div>';
  }
  return h;
}
function renderBook() {
  let h = '<h3>Buku Resep Splice</h3><p>Hanya resep yang sudah ditemukan yang tercatat di sini.</p>';
  if (!S.knownSplice.length) h += '<p>Belum ada resep ditemukan. Coba splice dua benih!</p>';
  for (const rk of S.knownSplice) {
    const r = SPLICE_RECIPES.find(x => (x.a + '+' + x.b) === rk);
    if (r) h += '<p>' + ITEMS[r.a].name + ' + ' + ITEMS[r.b].name + ' = ' + ITEMS[r.out].name + ' (Tier ' + r.tier + ')</p>';
  }
  return h;
}
function renderProfile() {
  let h = '<h3>Profil</h3><p>Nama: <b style="color:' + nameColor() + '">Pemain</b> · Level ' + S.level +
    ' · XP ' + S.xp + '/' + (S.level >= LEVEL_CAP ? '-' : xpNeed(S.level)) + '</p>';
  h += '<p>Pemilik world: ya (semua world di sini milikmu)</p><h3>Role</h3>';
  for (const k in ROLE_NAMES) {
    const r = S.roles[k];
    h += '<p><b>' + ROLE_NAMES[k] + '</b> — level ' + r.level + ' · XP ' + r.xp + '/' + (r.level >= ROLE_CAP ? '-' : roleNeed(r.level)) + '</p>';
  }
  h += '<p>Role lain (Surgeon, Fishing, Chef, Star Captain) dan quest masuk tahap kedua.</p>';
  return h;
}
function renderGuild() {
  if (!S.guild) {
    return '<h3>Guild</h3><p>Buat guild seharga 200.000 gems. Gems: ' + S.gems + '</p>' +
      '<input type="text" data-role="guild-name" placeholder="Nama guild" maxlength="24"> ' +
      '<button data-act="create-guild">BUAT GUILD</button>';
  }
  let h = '<h3>Guild: ' + escapeHtml(S.guild.name) + '</h3><p>' + escapeHtml(S.guild.statement) + '</p>';
  h += '<input type="text" data-role="guild-statement" placeholder="Pernyataan guild" maxlength="120" value="' + escapeHtml(S.guild.statement) + '"> ' +
    '<button data-act="save-statement">SIMPAN</button>';
  h += '<h3>Anggota (' + S.guild.members.length + '/10)</h3>';
  for (const m of S.guild.members) h += '<p>' + escapeHtml(m) + '</p>';
  return h;
}
function renderTrade() {
  const t = S.trade;
  if (!t) return '<h3>Trade</h3><p>Tidak ada trade aktif.</p>';
  let h = '<h3>Trade dengan ' + escapeHtml(t.npc) + '</h3>';
  h += '<p>Sisimu (maks 4 stack x 200):</p>';
  t.player.forEach((s, i) => {
    h += '<div class="crow"><span>' + ITEMS[s.id].name + ' x' + s.qty + '</span><button data-act="trade-remove" data-i="' + i + '">Hapus</button></div>';
  });
  if (!t.player.length) h += '<p>(kosong)</p>';
  h += '<p>Tambah dari tas:</p><div class="grid">';
  for (const id of invList()) h += slotHtml(id, 'trade-add', false);
  h += '</div>';
  h += '<p>Sisi ' + escapeHtml(t.npc) + ' (otomatis senilai):</p>';
  for (const s of t.npcSide) h += '<p>' + ITEMS[s.id].name + ' x' + s.qty + '</p>';
  if (!t.npcSide.length) h += '<p>(kosong)</p>';
  h += '<div class="crow"><span></span><span><button data-act="trade-accept"' + (t.playerOk ? ' disabled' : '') + '>TERIMA</button> ' +
    '<button data-act="trade-do"' + (t.playerOk && t.npcOk ? '' : ' disabled') + '>LAKUKAN TRADE</button> ' +
    '<button data-act="trade-cancel">BATAL</button></span></div>';
  return h;
}
function renderWrench(p) {
  const tr = treeAt(p.tx, p.ty);
  const fg = fgAt(p.tx, p.ty), bg = bgAt(p.tx, p.ty);
  const lk = lockAt(p.tx, p.ty);
  let h = '<h3>Info Petak (' + p.tx + ', ' + p.ty + ')</h3>';
  if (tr) h += '<p>' + treeLabel(tr) + '</p>';
  if (fg !== T_EMPTY) {
    const d = TILES[fg];
    h += '<p>Depan: <b>' + d.name + '</b> · Rarity ' + (ITEMS[d.item] ? ITEMS[d.item].rarity : '-') + ' · ' + (isFinite(d.hits) ? d.hits + ' pukulan' : 'tidak bisa dipukul') + '</p>';
    if (d.sign) {
      h += '<p>Teks: ' + escapeHtml(S.world.signs[key(p.tx, p.ty)] || '(kosong)') + '</p>' +
        '<input type="text" data-role="sign-text" placeholder="Tulis di papan..." maxlength="80" value="' + escapeHtml(S.world.signs[key(p.tx, p.ty)] || '') + '"> ' +
        '<button data-act="save-sign" data-x="' + p.tx + '" data-y="' + p.ty + '">SIMPAN TEKS</button>';
    }
    if (d.door) h += '<button data-act="remove-door" data-x="' + p.tx + '" data-y="' + p.ty + '">HANCURKAN PINTU</button>';
    if (d.weather) h += '<button data-act="toggle-weather">GANTI CUACA</button>';
    if (d.vending) h += '<button data-act="open-vending" data-x="' + p.tx + '" data-y="' + p.ty + '">KELOLA MESIN</button>';
    if (d.chest) h += '<button data-act="open-chest">BUKA PETI</button>';
    if (d.lock) h += '<button data-act="remove-lock" data-x="' + p.tx + '" data-y="' + p.ty + '">BONGKAR LOCK</button>';
  }
  if (bg !== T_EMPTY) h += '<p>Belakang: <b>' + TILES[bg].name + '</b></p>';
  if (fg === T_EMPTY && bg === T_EMPTY && !tr) h += '<p>Petak kosong.</p>';
  if (lk) h += '<p>Area lock: ' + LOCK_DEFS[lk.kind].name + ' · Pemilik: ' + escapeHtml(lk.owner) + '</p>';
  if (S.world.paint[key(p.tx, p.ty)]) h += '<p>Dicet warna.</p>';
  return h;
}
function renderVending(p) {
  const v = S.world.vending[key(p.tx, p.ty)];
  if (!v) return '<h3>Vending Machine</h3><p>Mesin tidak ditemukan.</p>';
  let h = '<h3>Vending Machine</h3><p>Hasil: ' + v.earned + ' WL ' + (v.earned > 0 ? '<button data-act="vend-withdraw" data-x="' + p.tx + '" data-y="' + p.ty + '">AMBIL</button>' : '') + '</p>';
  h += '<p>Isi: ' + (v.item ? ITEMS[v.item].name + ' x' + v.qty + ' @ ' + v.price + ' WL' : '(kosong)') + '</p>';
  if (v.item) h += '<button data-act="vend-take" data-x="' + p.tx + '" data-y="' + p.ty + '">AMBIL ISI</button> ';
  h += '<button data-act="vend-remove" data-x="' + p.tx + '" data-y="' + p.ty + '">HANCURKAN MESIN</button>';
  h += '<h3>Isi Mesin</h3><select data-role="vend-item">';
  for (const id of invList()) h += '<option value="' + id + '">' + ITEMS[id].name + ' (' + S.inv[id] + ')</option>';
  h += '</select> Jumlah <input type="number" data-role="vend-qty" value="10" min="1"> Harga (WL) <input type="number" data-role="vend-price" value="1" min="0"> ' +
    '<button data-act="vend-set" data-x="' + p.tx + '" data-y="' + p.ty + '">ISI</button>';
  return h;
}
function renderChest() {
  let h = '<h3>Peti World</h3>';
  const ids = Object.keys(S.world.chest);
  if (!ids.length) h += '<p>Peti kosong. Pakai STORE di tas untuk menyimpan ke sini.</p>';
  for (const id of ids) {
    h += '<div class="crow"><span>' + ITEMS[id].name + ' (' + S.world.chest[id] + ')</span><span>' + qtyButtons('chest-take', 'data-item="' + id + '"') + '</span></div>';
  }
  return h;
}
function renderInfo(p) {
  const it = ITEMS[p.item];
  return '<h3>' + it.name + '</h3><p>Rarity: ' + it.rarity + '</p><p>' + it.desc + '</p>' +
    (it.seed ? '<p>Waktu tumbuh: ' + fmtTime(growTimeMs(it.seedOf)) + '</p>' : '') +
    (it.price ? '<p>Harga Store: ' + it.price + ' gems</p>' : '<p>Tidak dijual di Store.</p>');
}
function refreshHUD() {
  el.hGemsN.textContent = S.gems;
  el.hName.textContent = 'Pemain';
  el.hName.style.color = nameColor();
  el.hLevel.textContent = S.level;
  el.hWorld.textContent = S.worldName;
  el.hHp.textContent = 'HP ' + Math.max(0, Math.ceil(S.hp));
  renderHotbar();
}
// Hotbar 4 slot: Kepalan, Kunci, lalu 2 item terakhir yang dipilih di tas.
function pushQuick(id) {
  S.quick = [id].concat(S.quick.filter(q => q !== id)).slice(0, 3);
}
function renderHotbar() {
  // Satu slot toggle kaya Growtopia: ketuk kepalan menjadi kunci, ketuk kunci menjadi kepalan.
  const toolSel = S.mode === 'wrench' || !S.sel;
  let h = '<div class="hslot' + (toolSel ? ' sel' : '') + '" data-hb="toggle"><span class="hbemo">' + (S.mode === 'fist' ? '👊' : '🔧') + '</span></div>';
  for (let i = 0; i < 3; i++) {
    const id = S.quick[i];
    if (id && ITEMS[id]) {
      h += '<div class="hslot' + (S.sel === id ? ' sel' : '') + '" data-hb="item" data-item="' + id + '">' +
        '<span class="sw" style="background:' + (ITEMS[id].color || '#888') + '"></span>' +
        '<span class="cnt">' + countItem(id) + '</span><span class="nm">' + ITEMS[id].name + '</span></div>';
    } else h += '<div class="hslot empty"></div>';
  }
  el.hotbar.innerHTML = h;
}

// ---------- Layar pilih world ----------
function showWorldSel() {
  S.worldSelOpen = true;
  closePanel();
  const wotd = pickWOTD();
  el.wsWotd.textContent = wotd ? ('World of the Day: ' + wotd) : '';
  el.wsList.innerHTML = Object.keys(S.worlds).sort().map(n =>
    '<button data-world="' + escapeHtml(n) + '">' + escapeHtml(n) + '</button>').join('');
  el.worldsel.hidden = false;
}
function hideWorldSel() { S.worldSelOpen = false; el.worldsel.hidden = true; }
function enterWorld(name) {
  name = (name || '').trim().toUpperCase();
  if (!validWorldName(name)) {
    addChat('Nama world tidak valid (1-24 huruf/angka, tanpa nama terlarang).', 'sys');
    sfx.error();
    return false;
  }
  save();
  if (!S.worlds[name]) {
    S.worlds[name] = genWorld(name);
    addChat('World baru "' + name + '" dibuat!', 'sys');
  }
  S.world = S.worlds[name];
  S.worldName = name;
  S.px = S.world.spawn.tx * TILE + 16; S.py = S.world.spawn.ty * TILE + 4;
  S.vx = 0; S.vy = 0; S.tileHp = {}; S.tileHit = {};
  S.drops = []; S.gemDrops = [];
  spawnTrader();
  hideWorldSel();
  enterWOTDCheck();
  refreshHUD();
  save();
  return true;
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
function toggleMode() {
  S.mode = S.mode === 'fist' ? 'wrench' : 'fist';
  sfx.click();
  refreshHUD();
}
function canvasTile(cx, cy) {
  const r = canvas.getBoundingClientRect();
  const sx = (cx - r.left) * (VW / r.width), sy = (cy - r.top) * (VH / r.height);
  return { tx: Math.floor((S.cam.x + sx / S.zoom) / TILE), ty: Math.floor((S.cam.y + sy / S.zoom) / TILE) };
}
function actTile(tx, ty) {
  if (S.worldSelOpen) return;
  if (S.mode === 'wrench') { wrenchAct(tx, ty); return; }
  if (S.sel && (ITEMS[S.sel].seed || ITEMS[S.sel].tile || ITEMS[S.sel].paint !== undefined)) {
    if (!placeTile(tx, ty)) punchTile(tx, ty);
  } else punchTile(tx, ty);
  refreshHUD();
}
function wrenchAct(tx, ty) {
  const npc = S.npc;
  if (npc && Math.abs(tx - npc.tx) <= 1 && Math.abs(ty - npc.ty) <= 1) { openNpcPanel(); return; }
  const p = playerTile();
  if (tx === p.tx && (ty === p.ty || ty === p.ty + 1)) { openPanel({ kind: 'profile' }); return; }
  openPanel({ kind: 'wrench', tx, ty });
}
function openNpcPanel() {
  // Panel NPC: profil + tombol trade (wrench ke pemain lain di Growtopia).
  S.panel = { kind: 'npc' };
  el.panel.classList.remove('wide');
  el.panel.innerHTML = '<button class="close" data-act="close">X</button><h3>' + escapeHtml(S.npc.name) + '</h3>' +
    '<p>Pedagang keliling. Stoknya berputar tiap hari.</p>' +
    '<button data-act="open-trade">TRADE</button> <button data-act="npc-stock">LIHAT STOK</button><div id="npcStock"></div>';
  el.panel.hidden = false;
}
function bindInput() {
  document.addEventListener('keydown', e => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT') {
      if (e.key === 'Enter' && e.target === el.chatInput) { sendChat(el.chatInput.value); el.chatInput.value = ''; el.chatInput.blur(); }
      if (e.key === 'Enter' && e.target === el.wsName) enterWorld(el.wsName.value);
      return;
    }
    keys[e.key.toLowerCase()] = true;
    if (e.key === ' ' || e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') { doJump(); e.preventDefault(); }
    if (e.key === 'Enter') { el.chatInput.focus(); e.preventDefault(); }
    if (e.key === 'Escape') closePanel();
    if (e.key === 'q' || e.key === 'Q') toggleMode();
    if (e.key === 'i' || e.key === 'I') openPanel({ kind: 'inv' });
    if (e.key === 'b' || e.key === 'B') openPanel({ kind: 'book' });
    if (e.key === 'p' || e.key === 'P') openPanel({ kind: 'profile' });
    if (e.key === 'g' || e.key === 'G') openPanel({ kind: 'guild' });
  });
  document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  canvas.addEventListener('mousedown', e => {
    audio();
    const t = canvasTile(e.clientX, e.clientY);
    actTile(t.tx, t.ty);
  });
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    setZoom(S.zoom + (e.deltaY < 0 ? 0.1 : -0.1));
  }, { passive: false });
  canvas.addEventListener('touchstart', e => {
    audio();
    const t = e.changedTouches[0];
    const tl = canvasTile(t.clientX, t.clientY);
    actTile(tl.tx, tl.ty);
    e.preventDefault();
  }, { passive: false });
  const hold = (id, prop) => {
    const b = $(id);
    b.addEventListener('pointerdown', e => { e.preventDefault(); audio(); touch[prop] = true; });
    b.addEventListener('pointerup', () => { touch[prop] = false; });
    b.addEventListener('pointerleave', () => { touch[prop] = false; });
  };
  hold('btnLeft', 'left');
  hold('btnRight', 'right');
  $('btnJump').addEventListener('pointerdown', e => { e.preventDefault(); audio(); doJump(); });
  $('btnPunch').addEventListener('pointerdown', e => { e.preventDefault(); audio(); actForward(); refreshHUD(); });
  el.hotbar.addEventListener('click', e => {
    const s = e.target.closest ? e.target.closest('[data-hb]') : null;
    if (!s) return;
    audio();
    const k = s.getAttribute('data-hb');
    if (k === 'toggle') { S.mode = S.mode === 'fist' ? 'wrench' : 'fist'; }
    else if (k === 'item') { S.sel = s.getAttribute('data-item'); S.mode = 'fist'; }
    sfx.click(); refreshHUD();
  });
  $('hGems').addEventListener('click', () => openPanel({ kind: 'store' }));
  $('btnInv').addEventListener('click', () => openPanel({ kind: 'inv' }));
  $('btnStore').addEventListener('click', () => openPanel({ kind: 'store' }));
  $('btnBook').addEventListener('click', () => openPanel({ kind: 'book' }));
  $('btnProfile').addEventListener('click', () => openPanel({ kind: 'profile' }));
  $('btnGuild').addEventListener('click', () => openPanel({ kind: 'guild' }));
  $('btnAdmin').addEventListener('click', () => openPanel({ kind: 'admin' }));
  $('btnWorlds').addEventListener('click', () => { save(); showWorldSel(); });
  $('wsGo').addEventListener('click', () => enterWorld(el.wsName.value));
  $('wsHome').addEventListener('click', () => enterWorld('AWAL'));
  el.wsList.addEventListener('click', e => {
    const b = e.target.closest ? e.target.closest('[data-world]') : null;
    if (b) enterWorld(b.getAttribute('data-world'));
  });
  el.panel.addEventListener('click', onPanelClick);
  el.panel.addEventListener('input', e => {
    if (e.target.getAttribute && e.target.getAttribute('data-role') === 'inv-search') {
      S.invSearch = e.target.value;
      renderPanel();
      const inp = el.panel.querySelector('[data-role="inv-search"]');
      if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
    }
  });
}
function panelInput(role) {
  const inp = el.panel.querySelector ? el.panel.querySelector('[data-role="' + role + '"]') : null;
  return inp ? inp.value : '';
}
function onPanelClick(e) {
  const b = e.target.closest ? e.target.closest('[data-act]') : null;
  if (!b) return;
  const act = b.getAttribute('data-act');
  const n = b.getAttribute('data-n');
  // Tanpa data-n, jumlah mengikuti pilihan Jumlah di panel tas.
  const qty = n ? (n === 'all' ? 999999 : parseInt(n, 10)) : (S.invQty || 1);
  const item = b.getAttribute('data-item');
  audio();
  if (act === 'close') { closePanel(); return; }
  if (act === 'invqty') { S.invQty = n === 'all' ? 999999 : parseInt(n, 10); renderPanel(); return; }
  if (act === 'select') { S.sel = item; pushQuick(item); sfx.click(); renderPanel(); refreshHUD(); return; }
  if (act === 'buy') { buyItem(item, qty); renderPanel(); refreshHUD(); return; }
  if (act === 'recycle') { recycleItem(item, qty); renderPanel(); refreshHUD(); return; }
  if (act === 'store') { storeItem(item, qty); renderPanel(); refreshHUD(); return; }
  if (act === 'drop') { dropSelected(item, qty); renderPanel(); refreshHUD(); return; }
  if (act === 'info') { openPanel({ kind: 'info', item }); return; }
  if (act === 'fav') { toggleFav(item); renderPanel(); return; }
  if (act === 'combine') { combineLocks(); renderPanel(); refreshHUD(); return; }
  if (act === 'split') { splitLocks(); renderPanel(); refreshHUD(); return; }
  if (act === 'chest-take') { takeFromChest(item, qty); renderPanel(); refreshHUD(); return; }
  if (act === 'create-guild') { if (createGuild(panelInput('guild-name'))) renderPanel(); refreshHUD(); return; }
  if (act === 'save-statement') { setGuildStatement(panelInput('guild-statement')); renderPanel(); return; }
  if (act === 'open-trade') { openTrade(); openPanel({ kind: 'trade' }); return; }
  if (act === 'npc-stock') {
    const d = $('npcStock');
    if (d) d.innerHTML = '<p>Stok hari ini:</p>' + traderStock().map(s => '<p>' + ITEMS[s.id].name + ' x' + s.qty + '</p>').join('');
    return;
  }
  if (act === 'trade-add') { tradeAdd(item, 10); renderPanel(); return; }
  if (act === 'trade-remove') { tradeRemove(parseInt(b.getAttribute('data-i'), 10)); renderPanel(); return; }
  if (act === 'trade-accept') { tradeAccept(); renderPanel(); return; }
  if (act === 'trade-do') { if (tradeDo()) closePanel(); refreshHUD(); return; }
  if (act === 'trade-cancel') { tradeCancel(); closePanel(); return; }
  if (act === 'save-sign') {
    S.world.signs[key(parseInt(b.getAttribute('data-x'), 10), parseInt(b.getAttribute('data-y'), 10))] = panelInput('sign-text');
    addChat('Teks papan disimpan.', 'sys'); renderPanel(); return;
  }
  if (act === 'remove-door') {
    const x = parseInt(b.getAttribute('data-x'), 10), y = parseInt(b.getAttribute('data-y'), 10);
    S.world.fg[y][x] = T_EMPTY; gainItem('door', 1); closePanel(); return;
  }
  if (act === 'toggle-weather') { toggleWeather(); renderPanel(); return; }
  if (act === 'open-vending') { openPanel({ kind: 'vending', tx: parseInt(b.getAttribute('data-x'), 10), ty: parseInt(b.getAttribute('data-y'), 10) }); return; }
  if (act === 'open-chest') { openPanel({ kind: 'chest' }); return; }
  if (act === 'remove-lock') { removeLockAt(parseInt(b.getAttribute('data-x'), 10), parseInt(b.getAttribute('data-y'), 10)); closePanel(); refreshHUD(); return; }
  if (act === 'vend-set') {
    vendSet(parseInt(b.getAttribute('data-x'), 10), parseInt(b.getAttribute('data-y'), 10),
      panelInput('vend-item'), parseInt(panelInput('vend-qty'), 10) || 0, parseInt(panelInput('vend-price'), 10) || 0);
    renderPanel(); refreshHUD(); return;
  }
  if (act === 'vend-take') { vendTakeStock(parseInt(b.getAttribute('data-x'), 10), parseInt(b.getAttribute('data-y'), 10)); renderPanel(); refreshHUD(); return; }
  if (act === 'vend-withdraw') { vendWithdraw(parseInt(b.getAttribute('data-x'), 10), parseInt(b.getAttribute('data-y'), 10)); renderPanel(); refreshHUD(); return; }
  if (act === 'vend-remove') { if (vendRemove(parseInt(b.getAttribute('data-x'), 10), parseInt(b.getAttribute('data-y'), 10))) closePanel(); refreshHUD(); return; }
  if (act && act.indexOf('admin-') === 0) { onAdminClick(act, b); return; }
}
