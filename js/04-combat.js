'use strict';
// ---------- Monster dan malam ----------
function spawnWave() {
  const n = 1 + 2 * S.day; // malam pertama 3, tiap malam tambah 2, tanpa batas
  for (let i = 0; i < n; i++) {
    const side = Math.floor(Math.random() * 4);
    let tx, ty;
    if (side === 0) { tx = 1 + Math.floor(Math.random() * (MW - 2)); ty = 1; }
    else if (side === 1) { tx = 1 + Math.floor(Math.random() * (MW - 2)); ty = MH - 2; }
    else if (side === 2) { tx = 1; ty = 1 + Math.floor(Math.random() * (MH - 2)); }
    else { tx = MW - 2; ty = 1 + Math.floor(Math.random() * (MH - 2)); }
    S.monsters.push({ x: tx * TILE + 16, y: ty * TILE + 16, hp: MON_HP, maxHp: MON_HP, atk: MON_ATK, atkCd: 0, phase: Math.random() * 6, color: '#7a4a9e' });
  }
  sfx.night();
  addFloat(S.px, S.py - 30, 'Malam tiba — ' + n + ' monster datang!', '#c9a7ff');
}
function hurtPlayer(n) {
  S.hp -= n; S.hurtT = .3; S.shake = 8; sfx.hurt();
  addFloat(S.px, S.py - 26, '-' + n, '#ff7a7a');
  if (S.hp <= 0) {
    S.hp = PLAYER_HP;
    if (S.dun) { exitDungeon(); }
    S.px = SPAWN.x; S.py = SPAWN.y;
    for (const m of S.monsters) {
      const dx = m.x - S.px, dy = m.y - S.py, d = Math.hypot(dx, dy) || 1;
      m.x = clamp(S.px + dx / d * 260, 16, MW * TILE - 16);
      m.y = clamp(S.py + dy / d * 260, 16, MH * TILE - 16);
      m.atkCd = 1;
    }
    addFloat(S.px, S.py - 30, 'Kamu bangun lagi', '#ffe27a');
  }
}
function updateMonsters(dt) {
  const list = S.dun ? S.dun.monsters : S.monsters;
  for (const m of list) {
    let tx = S.px, ty = S.py, target = null;
    if (!S.dun) {
      let bd = Math.hypot(S.px - m.x, S.py - m.y);
      for (const v of S.villagers) {
        if (v.dead) continue;
        const d = Math.hypot(v.x - m.x, v.y - m.y);
        if (d < bd) { bd = d; tx = v.x; ty = v.y; target = v; }
      }
    }
    const dx = tx - m.x, dy = ty - m.y, d = Math.hypot(dx, dy) || 1;
    m.x += dx / d * MON_SPEED * dt; m.y += dy / d * MON_SPEED * dt;
    m.phase += dt * 6; m.atkCd -= dt;
    if (d < 36 && m.atkCd <= 0) {
      m.atkCd = 1;
      if (target) hurtVillager(target, damageTaken(m.atk));
      else hurtPlayer(damageTaken(m.atk));
    }
  }
  for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) {
    const a = list[i], b = list[j];
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d > 0 && d < 26) {
      const push = (26 - d) / 2;
      a.x -= dx / d * push; a.y -= dy / d * push;
      b.x += dx / d * push; b.y += dy / d * push;
    }
  }
}
function darkness() {
  if (S.dun) return .3;
  if (S.phase === 'day') { const rem = DAY_LEN - S.t; return rem < 5 ? .45 * (1 - rem / 5) : 0; }
  const into = S.t - DAY_LEN, rem = NIGHT_LEN - into;
  if (into < 5) return .45 * into / 5;
  if (rem < 5) return .45 * rem / 5;
  return .45;
}

// ---------- Dungeon ----------
const DUN_W = 26, DUN_H = 18;
const DUN_MON = [null, { hp: 50, atk: 15 }, { hp: 100, atk: 25 }, { hp: 200, atk: 40 }];
const DUN_COLOR = [null, '#7a4a9e', '#9e4a5e', '#b03030'];
function genDungeon(floor) {
  const ground = [];
  for (let y = 0; y < DUN_H; y++) ground.push(new Array(DUN_W).fill('f'));
  for (let x = 0; x < DUN_W; x++) { ground[0][x] = 'w'; ground[DUN_H - 1][x] = 'w'; }
  for (let y = 0; y < DUN_H; y++) { ground[y][0] = 'w'; ground[y][DUN_W - 1] = 'w'; }
  const pillars = [[6, 5], [19, 5], [6, 12], [19, 12]];
  for (const p of pillars) for (let y = p[1]; y < p[1] + 2; y++) for (let x = p[0]; x < p[0] + 2; x++) ground[y][x] = 'w';
  const exit = { x: 13, y: 15 }, stairs = floor < 3 ? { x: 13, y: 2 } : null;
  const chest = { x: 3, y: 3, opened: false };
  const monsters = [];
  const n = 3 + floor * 2;
  let guard = 0;
  while (monsters.length < n && guard++ < 500) {
    const x = 2 + Math.floor(Math.random() * (DUN_W - 4)), y = 2 + Math.floor(Math.random() * (DUN_H - 4));
    if (ground[y][x] !== 'f') continue;
    if (Math.hypot(x - exit.x, y - exit.y) < 5) continue;
    monsters.push({
      x: x * TILE + 16, y: y * TILE + 16,
      hp: DUN_MON[floor].hp, maxHp: DUN_MON[floor].hp, atk: DUN_MON[floor].atk,
      atkCd: 0, phase: Math.random() * 6, color: DUN_COLOR[floor],
    });
  }
  return { floor, ground, monsters, chests: [chest], stairs, exit, exitArmed: false, stairMsgT: 0 };
}
function enterDungeon() {
  if (S.equip.sword < 1) {
    sfx.error();
    addFloat(S.px, S.py - 30, 'Butuh senjata dulu', '#ff8a8a');
    return false;
  }
  S.returnPos = { x: S.px, y: S.py };
  S.dun = genDungeon(1);
  S.px = S.dun.exit.x * TILE + 16; S.py = S.dun.exit.y * TILE + 16;
  S.cam.x = DUN_W * TILE / 2; S.cam.y = DUN_H * TILE / 2;
  closePanel();
  showBanner('Dungeon lantai 1');
  sfx.night();
  return true;
}
function exitDungeon() {
  S.dun = null;
  if (S.returnPos) { S.px = S.returnPos.x; S.py = S.returnPos.y; }
  S.cam.x = S.px; S.cam.y = S.py;
}
function dunSolid(tx, ty, d) {
  if (tx < 0 || ty < 0 || tx >= DUN_W || ty >= DUN_H) return true;
  if (d.ground[ty][tx] === 'w') return true;
  for (const c of d.chests) if (!c.opened && c.x === tx && c.y === ty) return true;
  return false;
}
function moveAxisDun(dx, dy) {
  const d = S.dun, r = 10;
  const solidAt = (x, y) => {
    const x0 = Math.floor((x - r) / TILE), x1 = Math.floor((x + r) / TILE);
    const y0 = Math.floor((y - r) / TILE), y1 = Math.floor((y + r) / TILE);
    for (let ty = y0; ty <= y1; ty++) for (let tx = x0; tx <= x1; tx++) if (dunSolid(tx, ty, d)) return true;
    return false;
  };
  if (!solidAt(S.px + dx, S.py)) S.px += dx;
  if (!solidAt(S.px, S.py + dy)) S.py += dy;
}
function lootChest(c) {
  const f = S.dun.floor;
  c.opened = true;
  const gains = [];
  const add = (k, n) => { S[k] += n; gains.push('+' + n + ' ' + RES_NAME[k]); };
  if (f === 1) {
    const ks = ['wood', 'stone', 'wheat', 'iron', 'coal'];
    for (let i = 0; i < 3; i++) add(ks[Math.floor(Math.random() * ks.length)], 2);
    if (Math.random() < 0.25) add('gold', 1);
  } else if (f === 2) {
    add('iron', 3); add('coal', 3); add('gold', 1 + Math.floor(Math.random() * 2));
  } else {
    add('diamond', 1 + Math.floor(Math.random() * 2)); add('gold', 2 + Math.floor(Math.random() * 2));
  }
  burst(c.x * TILE + 16, c.y * TILE + 16, '#ffd94d', 14, 80);
  addFloat(c.x * TILE + 16, c.y * TILE, gains.join('  '), '#ffe27a');
  sfx.coin();
}
function actDungeon() {
  const d = S.dun;
  const reach = S.equip.bow > 0 ? BOW_REACH : REACH;
  const dmg = S.equip.bow > 0 ? SWORD_DMG[S.equip.bow - 1] : swordDmg();
  let mBest = null, mD = reach;
  for (const m of d.monsters) { const dd = Math.hypot(m.x - S.px, m.y - S.py); if (dd < mD) { mD = dd; mBest = m; } }
  if (mBest) { hitMonster(mBest, dmg); return; }
  for (const c of d.chests) {
    if (c.opened) continue;
    if (Math.hypot(c.x * TILE + 16 - S.px, c.y * TILE + 16 - S.py) < REACH + 10) { lootChest(c); return; }
  }
}
function updateDungeon(dt) {
  const d = S.dun;
  if (d.stairMsgT > 0) d.stairMsgT -= dt;
  const ex = d.exit.x * TILE + 16, ey = d.exit.y * TILE + 16;
  if (!d.exitArmed && Math.hypot(ex - S.px, ey - S.py) > 60) d.exitArmed = true;
  if (d.exitArmed && Math.hypot(ex - S.px, ey - S.py) < 24) { exitDungeon(); addFloat(S.px, S.py - 30, 'Kembali ke desa', '#ffe27a'); return; }
  if (d.stairs) {
    const sx = d.stairs.x * TILE + 16, sy = d.stairs.y * TILE + 16;
    if (Math.hypot(sx - S.px, sy - S.py) < 24) {
      const need = d.floor + 1; // lantai 2 butuh stone, lantai 3 butuh iron
      if (S.equip.sword >= need) {
        S.dun = genDungeon(d.floor + 1);
        S.px = S.dun.exit.x * TILE + 16; S.py = S.dun.exit.y * TILE + 16;
        showBanner('Dungeon lantai ' + S.dun.floor);
        sfx.night();
      } else if (d.stairMsgT <= 0) {
        d.stairMsgT = 2;
        sfx.error();
        addFloat(S.px, S.py - 30, 'Butuh pedang ' + TIER_NAME[TIERS[need - 1]], '#ff8a8a');
      }
    }
  }
}

