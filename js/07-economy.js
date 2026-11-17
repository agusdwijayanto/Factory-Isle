'use strict';
// ---------- Ekonomi: Store, trade NPC, vending machine ----------
// Gems TIDAK bisa ditrade (riset, tanpa kecuali): jendela trade menolak gems
// dan trade hanya menukar item.
function buyItem(id, qty) {
  const price = ITEMS[id].price || 0;
  if (price <= 0) return false;
  qty = Math.min(qty, Math.floor(S.gems / price));
  if (qty <= 0) { addChat('Gems tidak cukup.', 'sys'); sfx.error(); return false; }
  S.gems -= price * qty;
  gainItem(id, qty);
  addChat('Beli ' + qty + ' ' + ITEMS[id].name + ' seharga ' + (price * qty) + ' gems.', 'sys');
  sfx.cash();
  return true;
}
function itemValue(id) {
  // Nilai tukar NPC = harga Store (tafsir). Lock dinilai dari harga Store-nya juga.
  if (id === 'diamond-lock') return 100 * ITEMS['lock-world'].price;
  if (id === 'bluegem-lock') return 10000 * ITEMS['lock-world'].price;
  return ITEMS[id].price || 0;
}
function wlValue(id) {
  // Nilai dalam WL untuk keputusan beli NPC vending (tafsir).
  return Math.max(1, Math.floor(itemValue(id) / 200));
}
function traderStock() {
  // Stok NPC berputar deterministik per hari + world (tafsir).
  const pool = ['dirt', 'rock', 'wood', 'grass', 'brick', 'door', 'seed-dirt', 'seed-rock', 'seed-wood', 'seed-grass', 'sign', 'glass', 'chest', 'paint-red', 'paint-blue', 'fireplace'];
  const rng = mulberry(S.npc.stockSeed);
  const stock = [];
  const used = {};
  while (stock.length < 6) {
    const id = pool[Math.floor(rng() * pool.length)];
    if (used[id]) continue;
    used[id] = true;
    stock.push({ id, qty: 5 + Math.floor(rng() * 20) });
  }
  return stock;
}
function mulberry(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function openTrade() {
  S.trade = { npc: S.npc.name, stock: traderStock(), player: [], npcSide: [], playerOk: false, npcOk: false };
  sfx.cash();
  addChat('TRADE ALERT: ' + S.npc.name + ' ingin trade denganmu.', 'sys');
}
function tradePlayerValue() {
  return S.trade.player.reduce((n, s) => n + itemValue(s.id) * s.qty, 0);
}
function tradeAdd(id, qty) {
  if (!S.trade || S.trade.playerOk) return false;
  qty = Math.min(qty, STACK_MAX, countItem(id));
  if (qty <= 0) return false;
  if (S.trade.player.length >= TRADE_SLOTS && !S.trade.player.some(s => s.id === id)) {
    addChat('Jendela trade hanya muat 4 stack.', 'sys'); sfx.error(); return false;
  }
  const slot = S.trade.player.find(s => s.id === id);
  if (slot) slot.qty = Math.min(STACK_MAX, slot.qty + qty);
  else S.trade.player.push({ id, qty });
  refreshNpcSide();
  return true;
}
function tradeRemove(i) {
  if (!S.trade || S.trade.playerOk) return;
  S.trade.player.splice(i, 1);
  refreshNpcSide();
}
function refreshNpcSide() {
  // Sisi NPC terisi otomatis dari stoknya sampai senilai sisi pemain (tafsir):
  // NPC hanya menukar senilai, tidak memberi cuma-cuma.
  const t = S.trade;
  t.npcSide = [];
  let budget = tradePlayerValue();
  for (const st of t.stock) {
    if (budget <= 0) break;
    const v = itemValue(st.id);
    if (v <= 0) continue;
    const n = Math.min(st.qty, STACK_MAX, Math.floor(budget / v));
    if (n > 0) { t.npcSide.push({ id: st.id, qty: n }); budget -= n * v; }
  }
  t.npcOk = false;
}
function tradeAccept() {
  if (!S.trade) return false;
  if (S.trade.player.length === 0 || S.trade.npcSide.length === 0) {
    addChat('Kedua sisi harus terisi sebelum trade.', 'sys'); sfx.error(); return false;
  }
  S.trade.playerOk = true;
  S.trade.npcOk = true; // NPC setuju karena sisinya sudah senilai (tafsir)
  return true;
}
function tradeDo() {
  const t = S.trade;
  if (!t || !t.playerOk || !t.npcOk) return false;
  for (const s of t.player) if (countItem(s.id) < s.qty) return false; // validasi dulu, jangan setengah jalan
  for (const s of t.player) removeItem(s.id, s.qty);
  for (const s of t.npcSide) gainItem(s.id, s.qty);
  addChat('Trade dengan ' + t.npc + ' selesai!', 'sys');
  sfx.cash();
  S.trade = null;
  return true;
}
function tradeCancel() { S.trade = null; }

// ---------- Vending machine ----------
// Riset: harga dalam WL, harus dikosongkan sebelum dihancurkan. Pembeli NPC
// dan ambang harganya adalah tafsir solo.
function vendSet(tx, ty, id, qty, price) {
  const v = S.world.vending[key(tx, ty)];
  if (!v) return false;
  qty = Math.min(qty, countItem(id));
  if (qty <= 0 || price < 0) return false;
  if (v.item && v.item !== id) { addChat('Mesin sudah berisi barang lain. Ambil dulu isinya.', 'sys'); return false; }
  removeItem(id, qty);
  v.item = id; v.qty += qty; v.price = price;
  return true;
}
function vendTakeStock(tx, ty) {
  const v = S.world.vending[key(tx, ty)];
  if (!v || !v.item) return false;
  gainItem(v.item, v.qty);
  v.item = null; v.qty = 0;
  return true;
}
function vendWithdraw(tx, ty) {
  const v = S.world.vending[key(tx, ty)];
  if (!v || v.earned <= 0) return false;
  gainItem('lock-world', v.earned);
  addChat('Mengambil ' + v.earned + ' WL dari mesin.', 'sys');
  v.earned = 0;
  sfx.cash();
  return true;
}
function vendRemove(tx, ty) {
  const v = S.world.vending[key(tx, ty)];
  if (!v) return false;
  if ((v.qty > 0) || v.earned > 0) { addChat('Kosongkan mesin dulu sebelum menghancurkannya!', 'sys'); sfx.error(); return false; }
  delete S.world.vending[key(tx, ty)];
  S.world.fg[ty][tx] = T_EMPTY;
  gainItem('vending', 1);
  return true;
}
function vendTick() {
  // Pengunjung NPC membeli berkala kalau harga tidak melebihi nilai item (tafsir).
  for (const k in S.world.vending) {
    const v = S.world.vending[k];
    if (!v.item || v.qty <= 0 || v.price <= 0) continue;
    if (v.price > wlValue(v.item)) continue;
    if (Math.random() < 0.5) {
      const soldName = ITEMS[v.item].name;
      const n = Math.min(v.qty, 1 + Math.floor(Math.random() * 3));
      v.qty -= n;
      v.earned += v.price * n;
      if (v.qty <= 0) v.item = null;
      const parts = k.split(',');
      addFloat(parts[0] * TILE + 16, parts[1] * TILE, 'Terjual ' + n + '!', '#ffd75e');
      addChat('Vending Machine menjual ' + n + ' ' + soldName + ' (+' + (v.price * n) + ' WL).', 'sys');
    }
  }
}
