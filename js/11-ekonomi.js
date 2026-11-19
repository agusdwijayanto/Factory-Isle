// Uang, jual beli, research. Tanpa DOM: kembalikan hasil, UI yang bicara.
function fmt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function sellPrice(id) {
  const it = ITEMS[id];
  return it ? it.price : null;
}

// Harga toko membeli dari pemain. Exchange ('ALL') memakai harga papan
// untuk semua barang yang bisa dijual.
function shopSellPrice(shopId, id) {
  const shop = SHOPS[shopId];
  if (!shop) return null;
  if (shop.sell === 'ALL') return sellPrice(id);
  const p = shop.sell[id];
  return p === undefined ? null : p;
}

// Jual qty item ke satu toko. Kembalikan uang yang didapat (0 kalau gagal).
function sellItemAt(shopId, id, qty) {
  const price = shopSellPrice(shopId, id);
  if (price === null || price === undefined) return 0;
  const have = invCount(id);
  const n = Math.min(qty, have);
  if (n <= 0) return 0;
  invAdd(id, -n);
  const gain = price * n;
  S.money += gain;
  S.stats.sold[id] = (S.stats.sold[id] || 0) + n;
  saveSoon();
  return gain;
}

// Beli qty item dari satu toko. Kembalikan jumlah yang terbeli (0 kalau gagal).
function buyItem(shopId, id, qty) {
  const shop = SHOPS[shopId];
  const price = shop && shop.buy ? shop.buy[id] : undefined;
  if (price === undefined) return 0;
  const n = Math.max(0, Math.min(qty, Math.floor(S.money / price)));
  if (n <= 0) return 0;
  S.money -= price * n;
  invAdd(id, n);
  saveSoon();
  return n;
}

// Jual qty item. Kembalikan uang yang didapat (0 kalau gagal).
function sellItem(id, qty) {
  const price = sellPrice(id);
  if (price === null || price === undefined) return 0;
  const have = invCount(id);
  const n = Math.min(qty, have);
  if (n <= 0) return 0;
  invAdd(id, -n);
  const gain = price * n;
  S.money += gain;
  S.stats.sold[id] = (S.stats.sold[id] || 0) + n;
  saveSoon();
  return gain;
}

function researchCostText(id) {
  const r = MACHINES[id].research;
  if (!r) return 'Gratis';
  // Bagian uang dilewati kalau 0 (mis. Electric Saw yang cuma butuh Nails).
  const parts = [];
  if (r.money) parts.push('$' + fmt(r.money));
  if (r.items) parts.push(Object.entries(r.items).map(([i, n]) => n + ' ' + ITEMS[i].name).join(', '));
  return parts.join(' + ') || 'Gratis';
}

function canResearch(id) {
  if (S.unlocked[id]) return false;
  const r = MACHINES[id].research;
  if (!r) return true;
  if (S.money < r.money) return false;
  if (r.items && !Object.entries(r.items).every(([i, n]) => invCount(i) >= n)) return false;
  return true;
}

function doResearch(id) {
  if (!canResearch(id)) return false;
  const r = MACHINES[id].research;
  if (r) {
    S.money -= r.money;
    if (r.items) for (const [i, n] of Object.entries(r.items)) invAdd(i, -n);
  }
  S.unlocked[id] = true;
  saveSoon();
  return true;
}

// ---- Mayor: ekspansi plot berurutan, lalu Auto Seller ----
function nextExpansion() {
  return S.expansion < EXPANSIONS.length ? EXPANSIONS[S.expansion] : null;
}

function buyExpansion() {
  const e = nextExpansion();
  if (!e || S.money < e.cost) return false;
  S.money -= e.cost;
  S.expansion++;
  expandPlotGrid(e.w, e.h);
  saveSoon();
  return true;
}

function canBuyAutoSeller() {
  return !S.autoSeller && S.expansion >= EXPANSIONS.length && S.money >= AUTO_SELLER_COST;
}

function buyAutoSeller() {
  if (!canBuyAutoSeller()) return false;
  S.money -= AUTO_SELLER_COST;
  S.autoSeller = true;
  saveSoon();
  return true;
}

// Auto Seller: tiap beberapa detik menjual isi output mesin dan storage
// plot dengan harga papan. Tas karakter tidak disentuh.
function autoSellerTick(dt) {
  if (!S.autoSeller) return;
  S.autoSellerT += dt;
  if (S.autoSellerT < AUTO_SELLER_EVERY) return;
  S.autoSellerT = 0;
  let gain = 0, count = 0;
  const drain = (buf) => {
    for (const [id, n] of Object.entries(buf)) {
      const price = sellPrice(id);
      if (price === null || price === undefined) continue;
      gain += price * n; count += n;
      S.stats.sold[id] = (S.stats.sold[id] || 0) + n;
      delete buf[id];
    }
  };
  for (const m of S.machines.values()) drain(m.output);
  for (const st of S.storages.values()) drain(st.items);
  if (gain > 0) {
    S.money += gain;
    const p = playerTile();
    addFloater(p.gx, p.gy, 'Auto Seller +$' + fmt(gain), '#ffd75e');
    SFX.play('coin');
    saveSoon();
  }
  return count;
}
