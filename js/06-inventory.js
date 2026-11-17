'use strict';
// ---------- Tas: RECYCLE, STORE, DROP, INFO, FAV, gabung/pecah lock ----------
// Tas menyimpan jumlah per jenis (tafsir: tanpa batas stack di tas; batas
// 200 per stack hanya berlaku di jendela trade, sesuai riset).
function recycleItem(id, qty) {
  qty = Math.min(qty, countItem(id));
  if (qty <= 0) return 0;
  removeItem(id, qty);
  // Recycle mengembalikan 1/10 harga Store (riset); item tanpa harga = 0.
  const back = Math.floor((ITEMS[id].price || 0) / 10) * qty;
  if (back > 0) S.gems += back;
  addChat('Recycle ' + qty + ' ' + ITEMS[id].name + (back ? ' (+' + back + ' gems)' : '') + '.', 'sys');
  return back;
}
function storeItem(id, qty) {
  qty = Math.min(qty, countItem(id));
  if (qty <= 0) return false;
  removeItem(id, qty);
  S.world.chest[id] = (S.world.chest[id] || 0) + qty;
  addChat(qty + ' ' + ITEMS[id].name + ' disimpan ke peti world.', 'sys');
  return true;
}
function takeFromChest(id, qty) {
  qty = Math.min(qty, S.world.chest[id] || 0);
  if (qty <= 0) return false;
  S.world.chest[id] -= qty;
  if (S.world.chest[id] <= 0) delete S.world.chest[id];
  gainItem(id, qty);
  return true;
}
function dropSelected(id, qty) {
  qty = Math.min(qty, countItem(id));
  if (qty <= 0) return false;
  removeItem(id, qty);
  const p = playerTile();
  dropItem(id, qty, p.tx, p.ty);
  addChat(qty + ' ' + ITEMS[id].name + ' dijatuhkan.', 'sys');
  return true;
}
function toggleFav(id) {
  if (S.favs[id]) delete S.favs[id];
  else S.favs[id] = true;
}
function combineLocks() {
  // 100 WL menjadi 1 DL, 100 DL menjadi 1 BGL (riset: konversi mekanis persis).
  let made = 0;
  while (countItem('lock-world') >= 100) { removeItem('lock-world', 100); gainItem('diamond-lock', 1); made++; }
  while (countItem('diamond-lock') >= 100) { removeItem('diamond-lock', 100); gainItem('bluegem-lock', 1); made++; }
  if (made > 0) { addChat('Lock digabung: +' + made + ' lock denominasi atas.', 'sys'); sfx.cash(); }
  return made;
}
function splitLocks() {
  let made = 0;
  while (countItem('bluegem-lock') >= 1) { removeItem('bluegem-lock', 1); gainItem('diamond-lock', 100); made++; }
  while (countItem('diamond-lock') >= 1) { removeItem('diamond-lock', 1); gainItem('lock-world', 100); made++; }
  if (made > 0) addChat('Lock dipecah kembali.', 'sys');
  return made;
}
function invList() {
  // Favorit dulu, lalu sisanya, sesuai urutan katalog.
  const ids = Object.keys(S.inv);
  ids.sort((a, b) => {
    const fa = S.favs[a] ? 0 : 1, fb = S.favs[b] ? 0 : 1;
    if (fa !== fb) return fa - fb;
    return Object.keys(ITEMS).indexOf(a) - Object.keys(ITEMS).indexOf(b);
  });
  return ids;
}
