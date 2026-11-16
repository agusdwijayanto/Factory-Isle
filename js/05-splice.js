'use strict';
// ---------- Splice: 2 benih menjadi benih baru, resep ditemukan dari bahan ----------
// Resep "ditemukan" saat pemain memegang kedua benih bahannya bersamaan.
function discoverRecipes() {
  SPLICE_RECIPES.forEach((r, i) => {
    if (S.knownSplice.includes(i)) return;
    const need = r.a === r.b ? 2 : 1;
    if (countItem(r.a) >= need && countItem(r.b) >= need) S.knownSplice.push(i);
  });
}
function findSpliceRecipe(a, b) {
  return SPLICE_RECIPES.find(r => (r.a === a && r.b === b) || (r.a === b && r.b === a)) || null;
}
function spliceSeeds(a, b) {
  if (!nearStation('splice')) { addFloat(S.px, S.py - 30, 'Butuh Meja Splice di dekatmu', '#ff8a8a'); sfx.error(); return false; }
  const r = findSpliceRecipe(a, b);
  if (!r) return false;
  const need = r.a === r.b ? 2 : 1;
  if (countItem(r.a) < need || countItem(r.b) < need) { sfx.error(); return false; }
  removeItem(r.a, need);
  if (r.a !== r.b) removeItem(r.b, 1);
  gainItem(r.out, 1);
  S.counters.spliced++;
  gainXP('farm', 15);
  sfx.splice(); burst(S.px, S.py - 10, '#c9a7ff', 12, 80);
  addFloat(S.px, S.py - 30, '+1 ' + ITEMS[r.out].name, '#c9a7ff');
  celebrate('splice', 'Splice pertama!');
  return true;
}
