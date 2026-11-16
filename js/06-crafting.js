'use strict';
// ---------- Crafting: hanya dalam jarak 2 petak dari stasiun ----------
function nearStation(station) {
  const p = playerTile();
  for (let y = p.ty - 2; y <= p.ty + 2; y++) for (let x = p.tx - 2; x <= p.tx + 2; x++) {
    const code = tileAt(x, y);
    if (code !== T_EMPTY && TILES[code] && TILES[code].station === station) return true;
  }
  return false;
}
function craftItem(recipeId) {
  const r = CRAFT_RECIPES.find(c => c.id === recipeId);
  if (!r) return false;
  if (!nearStation(r.station)) { addFloat(S.px, S.py - 30, 'Butuh stasiun di dekatmu', '#ff8a8a'); sfx.error(); return false; }
  if (!hasCost(r.cost)) { sfx.error(); return false; }
  payCost(r.cost);
  gainItem(r.out.item, r.out.qty);
  sfx.splice(); burst(S.px, S.py - 10, '#8fd0ff', 10, 70);
  addFloat(S.px, S.py - 30, '+1 ' + r.name, '#8fd0ff');
  celebrate('craft', 'Crafting pertama!');
  return true;
}
