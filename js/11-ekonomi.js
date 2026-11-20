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
  // Mode Admin: duit infinite — beli berapa pun tanpa potong uang.
  const n = adminOn() ? qty : Math.max(0, Math.min(qty, Math.floor(S.money / price)));
  if (n <= 0) return 0;
  if (!adminOn()) S.money -= price * n;
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
  if (adminOn()) return true; // bahan + duit infinite
  if (!r) return true;
  if (S.money < r.money) return false;
  if (r.items && !Object.entries(r.items).every(([i, n]) => invCount(i) >= n)) return false;
  return true;
}

function doResearch(id) {
  if (!canResearch(id)) return false;
  const r = MACHINES[id].research;
  if (r && !adminOn()) {
    S.money -= r.money;
    if (r.items) for (const [i, n] of Object.entries(r.items)) invAdd(i, -n);
  }
  S.unlocked[id] = true;
  awardBadge(RESEARCH_BADGE[id] || id); // v35: badge diberikan saat resep dibuka (crafter -> badge Cannon)
  saveSoon();
  return true;
}

// ---- v35: badge, perkakas, wagon ----
// Badge hanya penanda pencapaian; tidak membuka apa-apa.
function awardBadge(id) {
  if (BADGES[id] && !S.badges[id]) {
    S.badges[id] = true;
    TOAST('Badge didapat: ' + BADGES[id].name + '!');
    saveSoon();
  }
}

// Beli/upgrade perkakas di Tool Shop. Tingkat 0->1 (dasar), 1->2 (bronze),
// 2->3 (iron), 3->4 (steel, hanya kapak — NamuWiki $2.500). Kapak dasar
// sudah dimiliki sejak awal (tingkat 1).
function toolNextCost(toolId) {
  const lvl = S.tools[toolId] || 0;
  const max = toolId === 'axe' ? 4 : 3;
  if (lvl >= max) return null;
  return TOOL_UPGRADE_COST[lvl];
}
function buyTool(toolId) {
  const cost = toolNextCost(toolId);
  if (cost === null) return false;
  if (!adminOn() && S.money < cost) return false;
  if (!adminOn()) S.money -= cost;
  S.tools[toolId] = (S.tools[toolId] || 0) + 1;
  saveSoon();
  return true;
}

// Beli wagon $100: muncul di lahan, satu petak di depan gerbang.
function buyWagon() {
  if (S.wagon) return false;
  if (!adminOn() && S.money < WAGON_BUY_COST) return false;
  if (!adminOn()) S.money -= WAGON_BUY_COST;
  const spot = wagonSpawnSpot();
  S.wagon = { map: 'plot', gx: spot.gx, gy: spot.gy, level: 1, horses: 0, items: {}, riding: false };
  saveSoon();
  return true;
}
// Petak lahir wagon: sisi barat jalan di depan gerbang lahan (7, h-2) —
// tepat di samping bangunan beli wagon (5, h-2) — atau rumput kosong terdekat.
// v51: (8,10) lama sudah jadi petak jalan sejak kolom 8 jadi jalan utama.
function wagonSpawnSpot() {
  const grid = S.maps.plot.grid, h = S.maps.plot.h;
  for (const p of [{ gx: 7, gy: h - 2 }, { gx: 6, gy: h - 2 }, { gx: 8, gy: h - 2 }]) {
    const t = grid[p.gy] && grid[p.gy][p.gx];
    if (t && t.t === 'grass' && !t.obj && !S.machines.has(key(p.gx, p.gy))) return p;
  }
  for (let gy = 0; gy < S.maps.plot.h; gy++)
    for (let gx = 0; gx < S.maps.plot.w; gx++) {
      const t = grid[gy][gx];
      if (t.t === 'grass' && !t.obj && !S.machines.has(key(gx, gy))) return { gx, gy };
    }
  return { gx: 7, gy: h - 2 };
}
// Naik tingkat wagon (kapasitas naik). Kembalikan false kalau sudah maks.
function upgradeWagon() {
  if (!S.wagon || S.wagon.level >= WAGON_LEVELS.length) return false;
  const cost = WAGON_LEVELS[S.wagon.level].cost;
  if (!adminOn() && S.money < cost) return false;
  if (!adminOn()) S.money -= cost;
  S.wagon.level++;
  saveSoon();
  return true;
}
// Beli kuda (kecepatan wagon naik): 0->1 kuda $100, 1->2 kuda $500.
function buyHorse() {
  if (!S.wagon || S.wagon.horses >= 2) return false;
  const cost = WAGON_HORSE_COST[S.wagon.horses];
  if (!adminOn() && S.money < cost) return false;
  if (!adminOn()) S.money -= cost;
  S.wagon.horses++;
  saveSoon();
  return true;
}
// Respawn wagon $5: pindah ke petak lahir di lahan (dipakai kalau wagon
// parkir jauh atau nyangkut di ujung map).
function respawnWagon() {
  if (!S.wagon) return false;
  if (!adminOn() && S.money < WAGON_RESPAWN_COST) return false;
  if (!adminOn()) S.money -= WAGON_RESPAWN_COST;
  const spot = wagonSpawnSpot();
  S.wagon.map = 'plot'; S.wagon.gx = spot.gx; S.wagon.gy = spot.gy; S.wagon.riding = false;
  saveSoon();
  return true;
}
// Muat barang tas ke peti wagon (dibatasi kapasitas), dan sebaliknya.
function wagonLoad(id, n) {
  if (!S.wagon) return 0;
  const take = Math.min(n, invCount(id), wagonCap() - wagonItemsTotal());
  if (take <= 0) return 0;
  invAdd(id, -take);
  S.wagon.items[id] = (S.wagon.items[id] || 0) + take;
  saveSoon();
  return take;
}
function wagonUnload(id, n) {
  if (!S.wagon) return 0;
  const take = Math.min(n, S.wagon.items[id] || 0);
  if (take <= 0) return 0;
  S.wagon.items[id] -= take;
  if (S.wagon.items[id] <= 0) delete S.wagon.items[id];
  invAdd(id, take);
  saveSoon();
  return take;
}

// ---- Mayor: ekspansi plot berurutan, lalu Auto Seller ----
// v36: biaya ekspansi naik per save (wiki Plots) — pengali SLOT_EXP_MULT
// terhadap harga dasar; slot 1 total $1.700, slot 2 $3.400, slot 3 $8.500,
// slot 4 $17.000.
function expCost(slot, idx) {
  return Math.round(EXPANSIONS[idx].cost * (SLOT_EXP_MULT[slot] || 1));
}

function nextExpansion() {
  return S.expansion < EXPANSIONS.length ? EXPANSIONS[S.expansion] : null;
}

function buyExpansion() {
  const e = nextExpansion();
  if (!e) return false;
  const cost = expCost(S.saveSlot, S.expansion);
  if (!adminOn() && S.money < cost) return false;
  if (!adminOn()) S.money -= cost;
  S.expansion++;
  expandPlotGrid(e.w, e.h);
  saveSoon();
  return true;
}

function canBuyAutoSeller() {
  return !S.autoSeller && S.expansion >= EXPANSIONS.length && (adminOn() || S.money >= AUTO_SELLER_COST);
}

function buyAutoSeller() {
  if (!canBuyAutoSeller()) return false;
  if (!adminOn()) S.money -= AUTO_SELLER_COST;
  S.autoSeller = true;
  saveSoon();
  return true;
}

// Mode Admin: saklar on/off. ON: buka semua mesin + lahan maks.
// Duit/bahan infinite dan crafting instan ditegakkan di titik pakainya
// (buyItem/doResearch/confirmPlace/consumeInputs/updateMachines),
// bukan di sini, supaya tiap titik tetap terbaca sendiri.
// OFF: aturan normal kembali; yang sudah didapat saat on TETAP
// (uang di angka aslinya, mesin tetap terbuka, lahan tetap maks).
function setAdminMode(on) {
  S.admin = !!on;
  if (S.admin) {
    Object.keys(MACHINES).forEach((id) => { S.unlocked[id] = true; });
    Object.keys(BADGES).forEach((id) => { S.badges[id] = true; }); // v35: semua badge ikut terbuka
    applyMaxExpansion();
    TOAST('Mode Admin ON: duit, bahan, dan riset infinite');
  } else {
    TOAST('Mode Admin OFF: aturan normal kembali');
  }
  saveSoon();
}

// Ekspansi lahan sampai maks tanpa bayar (dipakai Mode Admin ON).
function applyMaxExpansion() {
  let e;
  while ((e = nextExpansion())) {
    S.expansion++;
    expandPlotGrid(e.w, e.h);
  }
  saveSoon();
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
