'use strict';
// ---------- Panel dan menu ----------
function openPanel(p) { S.panel = p; renderPanel(); el.panel.hidden = false; }
function closePanel() { S.panel = null; el.panel.hidden = true; }
function openVillagerList() { openPanel({ kind: 'villagers' }); }
function cycleSpeed() {
  S.speed = S.speed >= 4 ? 1 : S.speed * 2;
  $('btnSpeed').textContent = S.speed + 'x';
}
function openMenu() { closePanel(); refreshMenu(); el.menu.hidden = false; }
function closeMenu() { el.menu.hidden = true; }
function refreshMenu() {
  const btns = el.menu.querySelectorAll ? el.menu.querySelectorAll('button[data-build]') : [];
  for (const b of btns) {
    const k = b.getAttribute('data-build');
    const def = BUILD[k];
    const locked = def && S.th < def.th;
    b.disabled = !!locked;
    let txt = b.getAttribute('data-name');
    if (def) txt += ' — ' + costText(def.cost);
    else if (k === 'tree') txt += ' — 1 kayu';
    else txt += ' — gratis';
    if (locked) txt += ' [butuh TH ' + def.th + ']';
    b.textContent = txt;
  }
}
function renderPanel() {
  const p = S.panel;
  if (!p) return;
  let h = '';
  if (p.kind === 'townhall') {
    h += '<h3>Townhall — tingkat ' + S.th + '</h3>';
    h += '<p>Warga: ' + S.villagers.length + ' · Kapasitas rumah: ' + houseCapacity() + '</p>';
    if (S.th < 3) {
      const req = TH_UP[S.th + 1];
      h += '<p>Naik ke tingkat ' + (S.th + 1) + ' butuh: ' + req.villagers + ' warga, ' + costText({ wood: req.wood, stone: req.stone, iron: req.iron }) + '</p>';
      h += '<button data-act="th-up">Naik Tingkat</button>';
    } else h += '<p>Tingkat tertinggi.</p>';
    h += '<button data-act="feed-all">Beri Roti Semua Warga (1 roti per warga)</button>';
    h += '<p>Tingkat 2 membuka Toolsmith dan Pasar. Tingkat 3 membuka kerajinan gold dan diamond.</p>';
  } else if (p.kind === 'building') {
    const b = p.ref;
    h += '<h3>' + buildingName(b) + (b.type === 'hut' ? ' — tingkat ' + b.level : '') + '</h3>';
    if (!b.built) h += '<p>Sedang dibangun...</p>';
    if (b.type === 'hut' && b.built) {
      const used = S.villagers.filter(v => v.home === b).length;
      h += '<p>Menampung ' + used + '/' + HUT_CAP[b.level] + ' warga.</p>';
      if (b.level < 3) h += '<button data-act="upgrade">Naik Tingkat — ' + costText(HUT_UP[b.level]) + '</button>';
    }
    if (b.type === 'smith' && b.built) {
      h += '<p>Senjata, armor, dan alat untukmu dan warga.</p>';
      const kinds = [['sword', 'Pedang'], ['bow', 'Bow'], ['armor', 'Armor'], ['axe', 'Kapak'], ['pick', 'Beliung']];
      for (const kd of kinds) {
        h += '<div class="crow"><b>' + kd[1] + ':</b> ';
        for (let t = 0; t < 5; t++) {
          const owned = S.equip[kd[0]] > t;
          const locked = t >= 3 && S.th < 3;
          h += '<button data-act="craft" data-kind="' + kd[0] + '" data-tier="' + t + '"' + (owned || locked ? ' disabled' : '') + '>' + TIER_NAME[TIERS[t]] + ' (' + costText(CRAFT_COST[t]) + ')' + (owned ? ' ✓' : locked ? ' [TH3]' : '') + '</button>';
        }
        h += '</div>';
      }
      h += '<div class="crow"><b>Perisai:</b> <button data-act="craft" data-kind="shield" data-tier="0"' + (S.equip.shield > 0 ? ' disabled' : '') + '>Buat (10 kayu + 10 batu, -20% damage)' + (S.equip.shield > 0 ? ' ✓' : '') + '</button></div>';
    }
    if (b.type === 'kitchen' && b.built) {
      h += '<p>Roti: ' + S.bread + ' · Gandum: ' + S.wheat + ' · Antrean: ' + S.cookQ.length + ' (5 detik per roti)</p>';
      h += '<button data-act="cook" data-n="1">Buat 1 Roti — 1 gandum</button>';
      h += '<button data-act="cook" data-n="10">Buat 10 Roti — 10 gandum</button>';
      h += '<button data-act="cook" data-n="all">Buat Semua Gandum Jadi Roti</button>';
    }
    if (b.type === 'market' && b.built) {
      p.sel = p.sel || { give: 'wood', get: 'stone' };
      h += '<p>Tukar 2 bahan menjadi 1 bahan lain.</p>';
      h += '<div class="crow"><b>Beri:</b> ';
      for (const k in RES_NAME) h += '<button data-act="sel-give" data-res="' + k + '"' + (p.sel.give === k ? ' class="on"' : '') + '>' + RES_NAME[k] + ' (' + S[k] + ')</button>';
      h += '</div><div class="crow"><b>Terima:</b> ';
      for (const k in RES_NAME) h += '<button data-act="sel-get" data-res="' + k + '"' + (p.sel.get === k ? ' class="on"' : '') + '>' + RES_NAME[k] + '</button>';
      h += '</div><button data-act="trade" data-n="1">Tukar 2 ' + RES_NAME[p.sel.give] + ' → 1 ' + RES_NAME[p.sel.get] + '</button>';
      h += '<button data-act="trade" data-n="10">Tukar 10x — 20 ' + RES_NAME[p.sel.give] + ' → 10 ' + RES_NAME[p.sel.get] + '</button>';
      h += '<button data-act="trade" data-n="all">Tukar Semua ' + RES_NAME[p.sel.give] + ' → ' + RES_NAME[p.sel.get] + '</button>';
    }
    if (b.type === 'mine' && b.built) h += '<p>Penambang di sini menghasilkan 1 batu per 10 detik, 1 dari 5 hasil adalah iron atau coal.</p>';
    h += '<button data-act="demolish">Bongkar (kembali setengah bahan)</button>';
  } else if (p.kind === 'villager') {
    const v = p.ref;
    h += '<h3>Warga — ' + JOB_NAME[v.job] + '</h3>';
    h += '<p>HP ' + v.hp + '/' + VILL_HP + ' · ' + (v.fed ? 'Kenyang' : 'Lapar — berhenti kerja') + (v.dead ? ' · Tumbang, bangun besok pagi' : '') + '</p>';
    h += '<div class="crow"><b>Job:</b> ';
    for (const j of ['wood', 'mine', 'farm', 'none']) h += '<button data-act="job" data-job="' + j + '"' + (v.job === j ? ' class="on"' : '') + '>' + JOB_NAME[j] + '</button>';
    h += '</div>';
    h += '<button data-act="feed">Beri Roti (kenyang + 25 HP, 1 roti)</button>';
  } else if (p.kind === 'villagers') {
    h += '<h3>Daftar Warga</h3>';
    for (const j of ['wood', 'mine', 'farm']) {
      const n = S.villagers.filter(v => v.job === j).length;
      h += '<div class="crow"><b>' + JOB_NAME[j] + ':</b> <button data-act="job-minus" data-job="' + j + '">-</button><input data-job-count="' + j + '" type="number" min="0" value="' + n + '"><button data-act="job-plus" data-job="' + j + '">+</button></div>';
    }
    h += '<p>Tanpa job: ' + S.villagers.filter(v => v.job === 'none').length + '</p>';
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
  if (actName === 'th-up') { if (upgradeTownhall()) renderPanel(); return; }
  if (actName === 'feed-all') { if (feedAllVillagers()) renderPanel(); return; }
  if (S.panel.kind === 'building') {
    const bd = S.panel.ref;
    if (actName === 'upgrade') { if (upgradeBuilding(bd)) renderPanel(); }
    else if (actName === 'demolish') { demolishBuilding(bd); closePanel(); }
    else if (actName === 'craft') { if (craftItem(b.getAttribute('data-kind'), parseInt(b.getAttribute('data-tier'), 10))) renderPanel(); }
    else if (actName === 'cook') { const raw = b.getAttribute('data-n'); if (cookBread(raw === 'all' ? S.wheat : parseInt(raw, 10))) renderPanel(); }
    else if (actName === 'sel-give') { S.panel.sel.give = b.getAttribute('data-res'); renderPanel(); }
    else if (actName === 'sel-get') { S.panel.sel.get = b.getAttribute('data-res'); renderPanel(); }
    else if (actName === 'trade') { const raw = b.getAttribute('data-n'); const n = raw === 'all' ? Math.floor(S[S.panel.sel.give] / 2) : parseInt(raw, 10); if (tradeMarket(S.panel.sel.give, S.panel.sel.get, n)) renderPanel(); }
  } else if (S.panel.kind === 'villager') {
    const v = S.panel.ref;
    if (actName === 'job') { setJob(v, b.getAttribute('data-job')); renderPanel(); }
    else if (actName === 'feed') { if (feedVillager(v)) renderPanel(); }
  } else if (S.panel.kind === 'villagers') {
    const j = b.getAttribute('data-job');
    const cur = S.villagers.filter(v => v.job === j).length;
    if (actName === 'job-plus') { setJobCount(j, cur + 1); renderPanel(); }
    else if (actName === 'job-minus') { setJobCount(j, cur - 1); renderPanel(); }
  }
});
el.panel.addEventListener('change', e => {
  const inp = e.target.closest ? e.target.closest('input[data-job-count]') : null;
  if (!inp || !S.panel || S.panel.kind !== 'villagers') return;
  setJobCount(inp.getAttribute('data-job-count'), parseInt(inp.value, 10));
  renderPanel();
});
el.menu.addEventListener('click', e => {
  const b = e.target.closest ? e.target.closest('button') : null;
  if (!b) return;
  audio();
  const k = b.getAttribute('data-build');
  if (k === 'cancel') { closeMenu(); return; }
  if (b.disabled) return;
  enterBuild(k);
});
$('btnAccept').addEventListener('click', () => { audio(); acceptVillager(); });
$('btnDecline').addEventListener('click', () => { audio(); declineVillager(); });
$('btnEat').addEventListener('click', () => { audio(); eatBread(); });
$('btnVillagers').addEventListener('click', () => { audio(); openVillagerList(); });
$('btnSpeed').addEventListener('click', () => { audio(); cycleSpeed(); });

// ---------- Input ----------
const input = { mx: 0, my: 0 };
const keys = {};
const joy = { active: false, x: 0, y: 0 };
function pollKeys() {
  let x = 0, y = 0;
  if (keys['a'] || keys['arrowleft']) x -= 1;
  if (keys['d'] || keys['arrowright']) x += 1;
  if (keys['w'] || keys['arrowup']) y -= 1;
  if (keys['s'] || keys['arrowdown']) y += 1;
  input.mx = x; input.my = y;
}
window.addEventListener('keydown', e => {
  if (e.target && e.target.tagName === 'INPUT') return;
  if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
  if (e.key === ' ' && !e.repeat) act();
  if (e.key.toLowerCase() === 'b' && !e.repeat) {
    if (S.buildMode) exitBuild();
    else if (!el.menu.hidden) closeMenu();
    else if (!S.dun) openMenu();
  }
  if (e.key.toLowerCase() === 'e' && !e.repeat) eatBread();
  if (e.key.toLowerCase() === 'v' && !e.repeat) openVillagerList();
  if (e.key === 'Escape') { closePanel(); closeMenu(); exitBuild(); }
  audio();
});
window.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

function canvasTile(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  const cx = (clientX - r.left) * (VW / r.width), cy = (clientY - r.top) * (VH / r.height);
  return { tx: Math.floor((cx - VW / 2 + S.cam.x) / TILE), ty: Math.floor((cy - VH / 2 + S.cam.y) / TILE) };
}
function canvasPoint(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  const cx = (clientX - r.left) * (VW / r.width), cy = (clientY - r.top) * (VH / r.height);
  return { x: cx - VW / 2 + S.cam.x, y: cy - VH / 2 + S.cam.y };
}
let suppressClickUntil = 0;
canvas.addEventListener('mousemove', e => {
  const t = canvasTile(e.clientX, e.clientY);
  if (S.buildMode && !S.ghostLock) S.ghost = { x: clamp(t.tx, 0, MW - 2), y: clamp(t.ty, 0, MH - 2) };
});
canvas.addEventListener('click', () => {
  if (Date.now() < suppressClickUntil) return; // sentuhan sudah ditangani touchstart
  audio();
  if (S.buildMode) { tryPlace(); return; }
  if (S.dun) { act(); return; }
  const pt = canvasPoint(lastClick.x, lastClick.y);
  const t = { tx: Math.floor(pt.x / TILE), ty: Math.floor(pt.y / TILE) };
  for (const v of S.villagers) {
    if (v.dead) continue;
    if (Math.hypot(v.x - pt.x, v.y - pt.y) < 26) { openPanel({ kind: 'villager', ref: v }); return; }
  }
  const b = buildingAt(t.tx, t.ty);
  if (b) { openPanel({ kind: 'building', ref: b }); return; }
  if (inBalai(t.tx, t.ty)) { openPanel({ kind: 'townhall' }); return; }
  if (isDoor(t.tx, t.ty)) { enterDungeon(); return; }
  closePanel();
  act();
});
let lastClick = { x: 0, y: 0 };
canvas.addEventListener('pointerdown', e => { lastClick = { x: e.clientX, y: e.clientY }; });
canvas.addEventListener('touchstart', e => {
  audio();
  if (S.buildMode && !S.ghostLock) {
    const t = canvasTile(e.touches[0].clientX, e.touches[0].clientY);
    S.ghost = { x: clamp(t.tx, 0, MW - 2), y: clamp(t.ty, 0, MH - 2) };
    suppressClickUntil = Date.now() + 500;
    e.preventDefault();
  }
}, { passive: false });

const joyEl = $('joy'), stickEl = $('stick');
let joyId = null;
function joyMove(e) {
  const r = joyEl.getBoundingClientRect();
  let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
  const d = Math.hypot(dx, dy), max = r.width / 2;
  if (d > max) { dx = dx / d * max; dy = dy / d * max; }
  joy.x = dx / max; joy.y = dy / max;
  stickEl.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
}
joyEl.addEventListener('pointerdown', e => {
  joy.active = true; joyId = e.pointerId;
  joyEl.setPointerCapture(e.pointerId); joyMove(e); audio(); e.preventDefault();
});
joyEl.addEventListener('pointermove', e => { if (joy.active && e.pointerId === joyId) joyMove(e); });
const joyEnd = e => {
  if (e.pointerId !== joyId) return;
  joy.active = false; joy.x = 0; joy.y = 0;
  stickEl.style.transform = 'translate(0,0)';
};
joyEl.addEventListener('pointerup', joyEnd);
joyEl.addEventListener('pointercancel', joyEnd);

$('btnAct').addEventListener('pointerdown', e => { e.preventDefault(); audio(); act(); });
$('btnBuild').addEventListener('pointerdown', e => {
  e.preventDefault(); audio();
  if (S.buildMode) exitBuild();
  else if (!el.menu.hidden) closeMenu();
  else if (!S.dun) openMenu();
});
$('btnCancel').addEventListener('pointerdown', e => { e.preventDefault(); exitBuild(); });

