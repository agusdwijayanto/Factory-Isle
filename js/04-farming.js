'use strict';
// ---------- Farming: tanam, siram, tumbuh, panen, musim, breeding ----------
function plantAt(tx, ty) { return S.plants.find(p => p.tx === tx && p.ty === ty) || null; }
function grown(p) { return p.growth >= PLANTS[p.seed].grow; }
// Label tanaman dekat: nama di atas, timer di bawah nama. Timer berhenti kalau kering/luar musim.
function plantLabel(p) {
  const def = PLANTS[p.seed];
  if (p.growth >= def.grow) return { name: def.name, status: 'SIAP' };
  const sisa = Math.ceil((def.grow - p.growth) / growthMult());
  if (!inSeason(p.seed)) return { name: def.name, status: 'Luar musim' };
  if (!p.watered) return { name: def.name, status: 'Kering · ' + sisa + ' dtk' };
  return { name: def.name, status: sisa + ' dtk' };
}
function plantColor(p) { return p.color || PLANTS[p.seed].color || null; }
function inSeason(seed) {
  if (hasProf('farm', 'season-keeper')) return true;
  return PLANTS[seed].seasons.includes(seasonOf(S.day));
}
function plantSeed(tx, ty, seedId) {
  if (countItem(seedId) < 1) return false;
  if (tileAt(tx, ty) !== T_EMPTY || plantAt(tx, ty)) return false;
  if (!solidAt(tx, ty + 1)) { addFloat(tx * TILE + 16, ty * TILE, 'Butuh tanah di bawah', '#ff8a8a'); return false; }
  removeItem(seedId, 1);
  const p = { tx, ty, seed: seedId, growth: 0, watered: false };
  if (PLANTS[seedId].wild) p.color = ['red', 'yellow', 'white'][Math.floor(Math.random() * 3)];
  S.plants.push(p);
  S.counters.planted++;
  gainXP('farm', 5);
  sfx.plant(); burst(tx * TILE + 16, ty * TILE + 24, '#5cb84d', 6, 50);
  celebrate('plant', 'Tanaman pertama ditanam!');
  return true;
}
function waterPlant(p) {
  p.watered = true;
  sfx.water(); burst(p.tx * TILE + 16, p.ty * TILE + 16, '#6db9ff', 8, 60);
}
function harvestPlant(p) {
  const def = PLANTS[p.seed];
  let qty = 2;
  if (hasProf('farm', 'double-harvest') && Math.random() < 0.25) qty += 1;
  const item = def.wild ? 'flower-' + p.color : def.yield;
  S.plants.splice(S.plants.indexOf(p), 1);
  gainItem(item, qty);
  gainXP('farm', 10);
  sfx.harvest(); burst(p.tx * TILE + 16, p.ty * TILE + 16, '#ffd94d', 8, 70);
  addFloat(p.tx * TILE + 16, p.ty * TILE, '+' + qty + ' ' + ITEMS[item].name, '#ffd94d');
  celebrate('harvest', 'Panen pertama!');
}
function growthMult() { return hasProf('farm', 'green-thumb') ? 1.25 : 1; }
function updatePlants(dt) {
  for (const p of S.plants) {
    if (!grown(p) && p.watered && inSeason(p.seed)) p.growth += dt * growthMult();
  }
}
function fertilizePlant(p) {
  if (!p || grown(p) || countItem('fertilizer') < 1) return false;
  removeItem('fertilizer', 1);
  p.growth = Math.min(PLANTS[p.seed].grow, p.growth + 30);
  sfx.plant(); burst(p.tx * TILE + 16, p.ty * TILE + 16, '#b06a3b', 8, 60);
  addFloat(p.tx * TILE + 16, p.ty * TILE, '+30 detik tumbuh', '#ffd94d');
  return true;
}
// --- Breeding bunga: pasangan matang bersebelahan, tiap fajar, peluang 25% ---
const MIXED_COLORS = ['orange', 'pink', 'purple'];
function breedResult(a, b) {
  if (a === b) return a;
  const am = MIXED_COLORS.includes(a), bm = MIXED_COLORS.includes(b);
  if (am && bm) return 'purple';
  if (am) return a;
  if (bm) return b;
  const s = [a, b].sort().join('+');
  if (s === 'red+yellow') return 'orange';
  if (s === 'red+white') return 'pink';
  return 'purple'; // white+yellow
}
const COLOR_SEED = { red: 'seed-fred', yellow: 'seed-fyellow', white: 'seed-fwhite', orange: 'seed-forange', pink: 'seed-fpink', purple: 'seed-fpurple' };
function breedSpot(tx, ty) {
  // Petak kosong bersebelahan yang bisa ditanami: kiri pasangan dulu, lalu kanan.
  for (const x of [tx - 1, tx + 2]) {
    if (x < 0 || x >= S.mw) continue;
    if (tileAt(x, ty) === T_EMPTY && !plantAt(x, ty) && solidAt(x, ty + 1)) return x;
  }
  return null;
}
function tryBreed() {
  const sorted = S.plants.slice().sort((a, b) => a.tx - b.tx || a.ty - b.ty);
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i];
    if (!grown(a) || !plantColor(a)) continue;
    const b = sorted.find(q => q.ty === a.ty && q.tx === a.tx + 1 && grown(q) && plantColor(q));
    if (!b) continue;
    if (Math.random() >= BREED_CHANCE) continue;
    const x = breedSpot(a.tx, a.ty);
    if (x === null) continue;
    const color = breedResult(plantColor(a), plantColor(b));
    S.plants.push({ tx: x, ty: a.ty, seed: COLOR_SEED[color], growth: 0, watered: false, color });
    addFloat(x * TILE + 16, a.ty * TILE, 'Bunga ' + color + ' baru!', FLOWER_COLORS[color]);
  }
}
function onDawnPlants() {
  for (const p of S.plants) p.watered = false; // siraman hanya bertahan sehari
  tryBreed();
}
