'use strict';
// ---------- Ekonomi: toko harga tetap, kotak kirim, toko hadiah, lobak ----------
const CROP_ITEMS = ['wheat', 'pumpkin', 'apple', 'strawberry', 'melon', 'grape', 'gold-fruit'].concat(FLOWER_ITEMS);
function sellPrice(item) {
  let p = ITEMS[item].sell || 0;
  if (CROP_ITEMS.includes(item) && hasProf('farm', 'master-farmer')) p = Math.floor(p * 1.5);
  if (item === 'wood' && hasProf('wood', 'dear-wood')) p = Math.floor(p * 1.5);
  if (item === 'stone' && hasProf('mine', 'dear-stone')) p = Math.floor(p * 1.5);
  return p;
}
function buyItem(itemId, qty) {
  const def = ITEMS[itemId];
  if (!def || !def.buy) return 0;
  qty = Math.min(qty, DAILY_LIMIT - S.boughtToday, Math.floor(S.coins / def.buy));
  if (qty <= 0) { sfx.error(); return 0; }
  S.coins -= def.buy * qty;
  gainItem(itemId, qty);
  S.boughtToday += qty;
  sfx.coin(); addFloat(S.px, S.py - 30, 'Beli ' + qty + ' ' + def.name, '#ffd94d');
  return qty;
}
// Menjual selalu lewat kotak kirim: dibayar fajar berikutnya.
function sellItem(itemId, qty) {
  if (itemId === 'turnip') return 0; // lobak hanya lewat pasar lobak
  const def = ITEMS[itemId];
  if (!def || !def.sell) return 0;
  qty = Math.min(qty, DAILY_LIMIT - S.soldToday, countItem(itemId));
  if (qty <= 0) { sfx.error(); return 0; }
  removeItem(itemId, qty);
  S.shipQ.push({ item: itemId, qty, price: sellPrice(itemId) });
  S.soldToday += qty;
  sfx.click(); addFloat(S.px, S.py - 30, qty + ' ' + def.name + ' ke kotak kirim', '#ffd94d');
  celebrate('sell', 'Penjualan pertama!');
  return qty;
}
function onDawnEconomy() {
  let total = 0;
  for (const s of S.shipQ) total += s.qty * s.price;
  S.shipQ = [];
  if (total > 0) {
    S.coins += total;
    addFloat(S.px, S.py - 30, 'Kotak kirim: +' + total + ' koin', '#ffd94d');
    sfx.coin();
  }
  S.soldToday = 0; S.boughtToday = 0;
  S.counters = { gained: {}, planted: 0, spliced: 0 };
}
function buyGift(itemId) {
  const g = GIFT_SHOP.find(x => x.item === itemId);
  if (!g || S.taskCoins < g.cost) { sfx.error(); return false; }
  S.taskCoins -= g.cost;
  gainItem(itemId, 1);
  sfx.coin();
  return true;
}

// ---------- Pasar lobak: terpisah dari toko utama, dibayar langsung ----------
function genPatternPrices(pattern) {
  const prices = [];
  if (pattern === 0) { // fluktuasi: jalan acak 40-180
    let p = 80 + Math.random() * 40;
    for (let i = 0; i < 12; i++) { p = clamp(p + (Math.random() * 50 - 25), 40, 180); prices.push(Math.round(p)); }
  } else { // dasar menurun untuk 3 pola lainnya
    let p = 100 + Math.random() * 10;
    for (let i = 0; i < 12; i++) { prices.push(Math.round(p)); p = Math.max(30, p * 0.88); }
    if (pattern === 2) { // lonjakan kecil: satu slot 150-250
      prices[4 + Math.floor(Math.random() * 6)] = 150 + Math.floor(Math.random() * 101);
    } else if (pattern === 3) { // lonjakan besar: slot 6-8 melonjak 300-660
      prices[6] = 300 + Math.floor(Math.random() * 200);
      prices[7] = Math.min(660, 400 + Math.floor(Math.random() * 261));
      prices[8] = 300 + Math.floor(Math.random() * 200);
    }
  }
  return prices;
}
function genTurnipWeek(week) {
  S.turnip = {
    week,
    buyPrice: 90 + Math.floor(Math.random() * 21),
    pattern: Math.floor(Math.random() * 4),
    prices: null,
  };
  S.turnip.prices = genPatternPrices(S.turnip.pattern);
}
function turnipPriceNow() {
  if (!S.turnip || S.turnip.week !== weekOf(S.day)) genTurnipWeek(weekOf(S.day));
  const dow = dayInWeek(S.day);
  if (dow === 0) return null; // Minggu: hanya beli
  const afternoon = S.phase === 'night' || S.t >= DAY_LEN / 2;
  return S.turnip.prices[(dow - 1) * 2 + (afternoon ? 1 : 0)];
}
function buyTurnips(qty) {
  if (dayInWeek(S.day) !== 0) return 0;
  if (!S.turnip || S.turnip.week !== weekOf(S.day)) genTurnipWeek(weekOf(S.day));
  qty = Math.min(qty, DAILY_LIMIT - S.boughtToday, Math.floor(S.coins / S.turnip.buyPrice));
  if (qty <= 0) { sfx.error(); return 0; }
  S.coins -= S.turnip.buyPrice * qty;
  gainItem('turnip', qty);
  S.boughtToday += qty;
  sfx.coin();
  return qty;
}
function sellTurnips(qty) {
  const price = turnipPriceNow();
  if (price === null) return 0;
  qty = Math.min(qty, DAILY_LIMIT - S.soldToday, countItem('turnip'));
  if (qty <= 0) { sfx.error(); return 0; }
  removeItem('turnip', qty);
  S.coins += price * qty;
  S.soldToday += qty;
  sfx.coin(); addFloat(S.px, S.py - 30, '+' + (price * qty) + ' koin', '#ffd94d');
  return qty;
}
function rotTurnips() {
  const n = countItem('turnip');
  if (n > 0) {
    removeItem('turnip', n);
    addFloat(S.px, S.py - 30, n + ' lobak busuk!', '#ff8a8a');
  }
}

// ---------- Perluasan lahan ----------
function expandLand() {
  if (S.expansions >= MAX_EXPAND) return false;
  const cost = EXPAND_COSTS[S.expansions];
  if (S.coins < cost) { sfx.error(); return false; }
  S.coins -= cost;
  genColumns(S.tiles, S.mw, S.mw + EXPAND_COLS);
  S.mw += EXPAND_COLS;
  S.expansions++;
  sfx.levelup(); banner('Lahan baru! World selebar ' + S.mw + ' petak.');
  celebrate('expand', 'Perluasan pertama!');
  return true;
}
