'use strict';
// ---------- Warga ----------
function axePower() { return S.equip.axe + 1; }
function pickPower() { return S.equip.pick + 1; }
function spawnVillager() {
  const home = findFreeHouse();
  if (!home) return null;
  const v = {
    x: BALAI.x * TILE + 40 + Math.random() * 20, y: (BALAI.y + 2) * TILE + 10,
    job: 'none', hp: VILL_HP, home, fed: true, dead: false,
    hitCd: 0, prodT: 0, prodN: 0, phase: Math.random() * 6, walk: 0,
    face: { x: 0, y: 1 }, moving: false,
  };
  S.villagers.push(v);
  return v;
}
function acceptVillager() {
  S.popup = false; el.popup.hidden = true;
  const v = spawnVillager();
  if (!v) { addFloat(S.px, S.py - 26, 'Tidak ada rumah kosong', '#ff8a8a'); return false; }
  sfx.join();
  celebrate(v.x, v.y, 'Warga baru bergabung!');
  return true;
}
function declineVillager() {
  S.popup = false; el.popup.hidden = true;
  addFloat(S.px, S.py - 26, 'Warga itu pergi', '#c9c9c9');
}
function setJob(v, job) {
  v.job = job; v.prodT = 0;
  addFloat(v.x, v.y - 26, JOB_NAME[job], JOB_COLOR[job]);
  sfx.place();
}
function feedVillager(v) {
  if (v.dead) return false;
  if (S.bread < 1) { addFloat(v.x, v.y - 26, 'Tidak ada roti', '#ff8a8a'); return false; }
  if (v.fed && v.hp >= VILL_HP) return false;
  S.bread--; v.fed = true; v.hp = Math.min(VILL_HP, v.hp + BREAD_HEAL);
  sfx.eat(); burst(v.x, v.y, '#ffd94d', 6, 50);
  addFloat(v.x, v.y - 26, '+' + BREAD_HEAL + ' HP', '#9fe870');
  return true;
}
function feedAllVillagers() {
  let n = 0;
  for (const v of S.villagers) {
    if (S.bread < 1) break;
    if (feedVillager(v)) n++;
  }
  if (n === 0) addFloat(S.px, S.py - 30, S.bread < 1 ? 'Tidak ada roti' : 'Semua warga sudah kenyang', '#ffe27a');
  return n;
}
function moveToward(v, tx, ty, dt) {
  const dx = tx - v.x, dy = ty - v.y, d = Math.hypot(dx, dy);
  if (d < 4) { v.moving = false; return true; }
  const step = Math.min(d, VILL_SPEED * dt);
  v.x += dx / d * step; v.y += dy / d * step;
  v.moving = true; v.walk += dt * 10;
  v.face = { x: Math.abs(dx) > Math.abs(dy) ? Math.sign(dx) : 0, y: Math.abs(dy) >= Math.abs(dx) ? Math.sign(dy) : 0 };
  return false;
}
function nearestTree(x, y, skip) {
  let best = null, bd = 1e9;
  const consider = e => { if (skip && skip(e)) return; const d = Math.hypot(e.tx * TILE + 16 - x, e.ty * TILE + 16 - y); if (d < bd) { bd = d; best = e; } };
  for (const t of WORLD.trees) if (alive(t)) consider(t);
  for (const p of S.planted) if (grown(p)) consider(p);
  return best;
}
function nearestRock(x, y, skip) {
  let best = null, bd = 1e9;
  for (const r of WORLD.rocks) if (alive(r)) {
    if (skip && skip(r)) continue;
    const d = Math.hypot(r.tx * TILE + 16 - x, r.ty * TILE + 16 - y);
    if (d < bd) { bd = d; best = r; }
  }
  return best;
}
// Target yang sedang dikerjakan warga lain tidak diambil: tiap warga mencari target lain.
function targetTaken(v, key) {
  for (const o of S.villagers) if (o !== v && o.target === key) return true;
  return false;
}
function villagerWork(v, dt) {
  if (v.job === 'wood') {
    const t = nearestTree(v.x, v.y, e => targetTaken(v, 't:' + e.tx + ',' + e.ty));
    v.target = t ? 't:' + t.tx + ',' + t.ty : null;
    if (!t) return;
    const cx = t.tx * TILE + 16, cy = t.ty * TILE + 16;
    if (Math.hypot(cx - v.x, cy - v.y) > 44) { moveToward(v, cx, cy, dt); return; }
    v.moving = false; v.hitCd -= dt;
    if (v.hitCd <= 0) { v.hitCd = 1; hitTree(t, axePower()); }
  } else if (v.job === 'mine') {
    const mine = S.buildings.find(b => b.type === 'mine' && b.built);
    if (mine) {
      v.target = null;
      const cx = mine.x * TILE + TILE, cy = mine.y * TILE + TILE;
      if (Math.hypot(cx - v.x, cy - v.y) > 52) { moveToward(v, cx, cy, dt); return; }
      v.moving = false; v.prodT += dt;
      if (v.prodT >= 10) {
        v.prodT = 0; v.prodN++;
        if (v.prodN % 5 === 0) {
          const k = Math.random() < 0.5 ? 'iron' : 'coal';
          S[k]++; addFloat(cx, cy - 20, '+1 ' + RES_NAME[k], '#ffd94d');
        } else {
          S.stone++; addFloat(cx, cy - 20, '+1 batu', '#e8e8e8');
        }
        burst(cx, cy, '#b8b8b8', 4, 40); sfx.mine();
      }
      return;
    }
    const r = nearestRock(v.x, v.y, e => targetTaken(v, 'r:' + e.tx + ',' + e.ty));
    v.target = r ? 'r:' + r.tx + ',' + r.ty : null;
    if (!r) return;
    const cx = r.tx * TILE + 16, cy = r.ty * TILE + 16;
    if (Math.hypot(cx - v.x, cy - v.y) > 44) { moveToward(v, cx, cy, dt); return; }
    v.moving = false; v.hitCd -= dt;
    if (v.hitCd <= 0) { v.hitCd = 1; hitRock(r, pickPower()); }
  } else if (v.job === 'farm') {
    let ripe = null, rd = 1e9, empty = null, ed = 1e9;
    for (const k in S.crops) {
      const p = k.split(',').map(Number);
      if (S.crops[k].t < CROP_TIME) continue;
      if (targetTaken(v, 'c:' + k)) continue;
      const d = Math.hypot(p[0] * TILE + 16 - v.x, p[1] * TILE + 16 - v.y);
      if (d < rd) { rd = d; ripe = k; }
    }
    if (ripe) {
      v.target = 'c:' + ripe;
      const p = ripe.split(',').map(Number);
      if (moveToward(v, p[0] * TILE + 16, p[1] * TILE + 16, dt)) harvestCrop(ripe);
      return;
    }
    for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
      if (!cropTile(x, y) || S.crops[key(x, y)] || targetTaken(v, 'p:' + x + ',' + y)) continue;
      const d = Math.hypot(x * TILE + 16 - v.x, y * TILE + 16 - v.y);
      if (d < ed) { ed = d; empty = { x, y }; }
    }
    if (!empty || S.wheat < CROP_COST) { v.target = null; return; }
    v.target = 'p:' + empty.x + ',' + empty.y;
    if (moveToward(v, empty.x * TILE + 16, empty.y * TILE + 16, dt)) {
      S.wheat -= CROP_COST;
      S.crops[key(empty.x, empty.y)] = { t: 0 };
      sfx.plant(); burst(v.x, v.y + 8, '#8fce5a', 4, 40);
    }
  }
}
function villagerFight(v, dt) {
  let best = null, bd = 1e9;
  for (const m of S.monsters) { const d = Math.hypot(m.x - v.x, m.y - v.y); if (d < bd) { bd = d; best = m; } }
  if (!best) {
    moveToward(v, BALAI.x * TILE + 48, BALAI.y * TILE + 48, dt);
    return;
  }
  // Belum ada aba-aba: kumpul di townhall, lawan hanya kalau monster sudah di depan mata.
  if (!S.charge && bd > 48) {
    moveToward(v, BALAI.x * TILE + 48, BALAI.y * TILE + 48, dt);
    return;
  }
  if (bd > 44) { moveToward(v, best.x, best.y, dt); return; }
  v.moving = false; v.hitCd -= dt;
  if (v.hitCd <= 0) {
    v.hitCd = 1;
    best.hp -= swordDmg();
    burst(best.x, best.y, '#c9a7ff', 5, 60);
    addFloat(best.x, best.y - 20, '-' + swordDmg(), '#fff');
    if (best.hp <= 0) {
      S.monsters.splice(S.monsters.indexOf(best), 1);
      dropLoot(best);
      burst(best.x, best.y, '#7a4a9e', 14, 90);
      sfx.die();
    } else sfx.hit();
  }
}
function hurtVillager(v, n) {
  v.hp -= n;
  addFloat(v.x, v.y - 26, '-' + n, '#ff7a7a');
  burst(v.x, v.y, '#ff8a8a', 5, 60);
  if (v.hp <= 0) {
    v.dead = true; v.hp = 0;
    burst(v.x, v.y, '#f27fb0', 14, 80);
    addFloat(v.x, v.y - 26, 'Warga tumbang!', '#ff8a8a');
  }
}
function updateVillagers(dt) {
  for (const v of S.villagers) {
    if (v.dead) { v.target = null; continue; }
    v.phase += dt * 6;
    v.target = null;
    if (S.phase === 'night' && !S.dun) {
      // Warga lapar diam di rumah: tidak kerja, tidak bertarung.
      if (v.fed) villagerFight(v, dt);
      else moveToward(v, v.home ? v.home.x * TILE + TILE : v.x, v.home ? v.home.y * TILE + TILE : v.y, dt);
    } else if (S.phase === 'day' && v.fed && v.job !== 'none') {
      villagerWork(v, dt);
    } else if (v.home) {
      moveToward(v, v.home.x * TILE + TILE + 20, v.home.y * TILE + TILE + 20, dt);
    }
  }
  for (let i = 0; i < S.villagers.length; i++) for (let j = i + 1; j < S.villagers.length; j++) {
    const a = S.villagers[i], b = S.villagers[j];
    if (a.dead || b.dead) continue;
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d > 0 && d < 24) {
      const push = (24 - d) / 2;
      a.x -= dx / d * push; a.y -= dy / d * push;
      b.x += dx / d * push; b.y += dy / d * push;
    }
  }
}
function onDawn() {
  for (const v of S.villagers) {
    if (v.dead) {
      v.dead = false; v.hp = VILL_HP;
      if (v.home) { v.x = v.home.x * TILE + TILE; v.y = v.home.y * TILE + TILE; }
    }
    if (S.bread >= VILL_EAT) { S.bread -= VILL_EAT; v.fed = true; }
    else v.fed = false;
  }
  if (!S.popup && findFreeHouse()) {
    S.popup = true; el.popup.hidden = false;
    sfx.join();
  }
}

// ---------- Townhall ----------
function upgradeTownhall() {
  if (S.th >= 3) return false;
  const req = TH_UP[S.th + 1];
  if (S.villagers.length < req.villagers) { sfx.error(); return false; }
  const cost = {};
  for (const k in req) if (k !== 'villagers') cost[k] = req[k];
  if (!hasCost(cost)) { sfx.error(); return false; }
  payCost(cost);
  S.th++;
  celebrate(BALAI.x * TILE + 48, BALAI.y * TILE + 24, 'Townhall tingkat ' + S.th + '!');
  showBanner('Townhall naik ke tingkat ' + S.th + '!');
  return true;
}

// ---------- Toolsmith, Dapur, Pasar ----------
function craftItem(kind, tier) {
  if (tier >= 3 && S.th < 3) { sfx.error(); return false; } // gold/diamond butuh townhall 3
  if (kind === 'shield') {
    if (S.equip.shield > 0) { sfx.error(); return false; }
    const cost = { wood: 10, stone: 10 };
    if (!hasCost(cost)) { sfx.error(); return false; }
    payCost(cost); S.equip.shield = 1;
  } else {
    if (tier < S.equip[kind]) { sfx.error(); return false; }
    const cost = CRAFT_COST[tier];
    if (!hasCost(cost)) { sfx.error(); return false; }
    payCost(cost); S.equip[kind] = tier + 1;
  }
  sfx.craft();
  const names = { sword: 'Pedang', bow: 'Bow', shield: 'Perisai', armor: 'Armor', axe: 'Kapak', pick: 'Beliung' };
  addFloat(S.px, S.py - 30, names[kind] + ' ' + (kind === 'shield' ? '' : TIER_NAME[TIERS[tier]]), '#ffe27a');
  if (!S.flags.craft1) { S.flags.craft1 = true; showBanner('Senjata pertama dibuat!'); }
  return true;
}
function cookBread(n) {
  n = Math.min(n || 1, S.wheat);
  if (n < 1) { sfx.error(); return false; }
  S.wheat -= n;
  for (let i = 0; i < n; i++) S.cookQ.push({ t: 5 });
  sfx.place();
  return true;
}
function tradeMarket(give, get, n) {
  n = Math.min(n || 1, Math.floor(S[give] / 2));
  if (give === get || n < 1) { sfx.error(); return false; }
  S[give] -= 2 * n; S[get] += n;
  sfx.coin();
  addFloat(S.px, S.py - 30, (2 * n) + ' ' + RES_NAME[give] + ' → ' + n + ' ' + RES_NAME[get], '#ffe27a');
  return true;
}

