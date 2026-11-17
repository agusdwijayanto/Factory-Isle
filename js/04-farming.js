'use strict';
// ---------- Farming: tanam, tumbuh waktu nyata, panen, gems ----------
// Pertumbuhan berbasis timestamp tanam: pohon tetap tumbuh walau world
// tidak dibuka, sesuai penilaian riset (offline progress = selisih jam dinding).
function treeGrown(tr) { return nowMs() - tr.plantedAt >= growTimeMs(tr.item); }
function treeStage(tr) {
  const f = clamp((nowMs() - tr.plantedAt) / growTimeMs(tr.item), 0, 1);
  return f >= 1 ? 3 : f >= 0.6 ? 2 : f >= 0.25 ? 1 : 0;
}
function canPlantAt(tx, ty) {
  if (tx < 0 || tx >= MW || ty < 0 || ty >= MH) return false;
  if (fgAt(tx, ty) !== T_EMPTY || treeAt(tx, ty)) return false;
  return solidAt(tx, ty + 1); // benih hanya di ruang kosong tepat di atas blok
}
function plantAt(tx, ty, seedId) {
  const item = ITEMS[seedId].seedOf;
  if (!canPlantAt(tx, ty)) return false;
  if (!removeItem(seedId, 1)) return false;
  S.world.trees[key(tx, ty)] = { item, plantedAt: nowMs(), seed1: seedId, seed2: null };
  addRoleXp('farmer', 1);
  sfx.plant();
  burst(tx * TILE + 16, ty * TILE + 16, '#7dff8a', 4, 40);
  return true;
}
function punchTree(tx, ty, tr) {
  if (treeGrown(tr)) harvestTree(tx, ty, tr);
  else {
    // Pohon belum matang yang dipukul hancur tanpa hasil (riset: panduan farm 2026).
    delete S.world.trees[key(tx, ty)];
    addChat('Pohon ' + ITEMS[tr.item].name + ' yang belum matang hancur.', 'sys');
    sfx.brk();
  }
}
function harvestTree(tx, ty, tr) {
  delete S.world.trees[key(tx, ty)];
  const fruits = 2 + Math.floor(Math.random() * 4); // 2-5 buah (tafsir; riset: sampai 8)
  gainItem(tr.item, fruits);
  let seeds = 0;
  for (let i = 0; i < fruits; i++) if (Math.random() < 0.2) seeds++; // tiap buah 1-dari-5 benih
  if (seeds > 0) gainItem('seed-' + tr.item, seeds);
  const g = ITEMS[tr.item].gems || [0, 0];
  const gems = g[0] + Math.floor(Math.random() * (g[1] - g[0] + 1));
  if (gems > 0) spawnGems(tx * TILE + 16, ty * TILE + 16, gems);
  gainXp(xpFor(ITEMS[tr.item].rarity));
  addRoleXp('farmer', 2);
  addChat('Panen ' + ITEMS[tr.item].name + ': +' + fruits + ' buah' + (seeds ? ', +' + seeds + ' benih' : '') + (gems ? ', +' + gems + ' gems' : '') + '.', 'sys');
  addFloat(tx * TILE + 16, ty * TILE, '+' + fruits + ' ' + ITEMS[tr.item].name, '#ffd75e');
  burst(tx * TILE + 16, ty * TILE + 16, '#fff', 10, 70); // asap putih saat panen (riset)
  sfx.harvest();
}
function spawnGems(x, y, total) {
  // Gems jatuh fisik lalu bergabung per denominasi (riset: 1/5/10/50/100).
  let left = total;
  const denoms = [100, 50, 10, 5, 1];
  for (const d of denoms) {
    while (left >= d) {
      S.gemDrops.push({ x: x + (Math.random() * 24 - 12), y: y - 8, vy: -60 - Math.random() * 40, value: d, life: 60 });
      left -= d;
    }
  }
}
function dropItem(id, qty, tx, ty) {
  S.drops.push({ id, qty, x: tx * TILE + 16, y: ty * TILE + 8, vy: -50 - Math.random() * 30, life: 120 });
}
function updateDrops(dt) {
  // Item dan gems jatuh lalu mengambang; diambil dengan berjalan melewatinya.
  for (const d of S.drops) {
    d.y += d.vy * dt; d.vy = Math.min(d.vy + 300 * dt, 120);
    const gy = (Math.floor(d.y / TILE) + 1) * TILE - 6;
    if (d.y > gy && solidAt(Math.floor(d.x / TILE), Math.floor(d.y / TILE) + 1)) { d.y = gy; d.vy = 0; }
    d.life -= dt;
    if (Math.abs(d.x - S.px) < 22 && Math.abs(d.y - S.py) < 26) {
      gainItem(d.id, d.qty);
      addFloat(d.x, d.y - 10, '+' + d.qty + ' ' + ITEMS[d.id].name, '#fff');
      sfx.click();
      d.life = 0;
    }
  }
  S.drops = S.drops.filter(d => d.life > 0);
  for (const g of S.gemDrops) {
    g.y += g.vy * dt; g.vy = Math.min(g.vy + 300 * dt, 120);
    const gy = (Math.floor(g.y / TILE) + 1) * TILE - 6;
    if (g.y > gy && solidAt(Math.floor(g.x / TILE), Math.floor(g.y / TILE) + 1)) { g.y = gy; g.vy = 0; }
    g.life -= dt;
    if (Math.abs(g.x - S.px) < 24 && Math.abs(g.y - S.py) < 28) {
      S.gems += g.value;
      addFloat(g.x, g.y - 10, '+' + g.value + ' gems', '#ffd75e');
      sfx.gem();
      g.life = 0;
    }
  }
  S.gemDrops = S.gemDrops.filter(g => g.life > 0);
}
function treeLabel(tr) {
  // Label gaya klip Growtopia: "Pepper Tree (Punch to harvest)".
  const left = growTimeMs(tr.item) - (nowMs() - tr.plantedAt);
  if (left <= 0) return ITEMS[tr.item].name + ' Tree (Pukul untuk panen)';
  return ITEMS[tr.item].name + ' Tree - ' + fmtTime(left) + ' lagi';
}
