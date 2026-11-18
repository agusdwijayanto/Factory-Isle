// Uang, jual beli, research. Tanpa DOM: kembalikan hasil, UI yang bicara.
function fmt(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function sellPrice(id) {
  const it = ITEMS[id];
  return it ? it.price : null;
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
  let s = '$' + fmt(r.money);
  if (r.items) s += ' + ' + Object.entries(r.items).map(([i, n]) => n + ' ' + ITEMS[i].name).join(', ');
  return s;
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
