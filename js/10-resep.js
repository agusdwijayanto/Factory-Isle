// Logika resep murni: tanpa DOM, bisa dites headless.
const OUTPUT_CAP = 30;

// Mesin tanpa resep (Tree Generator / Harvester) tidak punya RECIPES:
// kembalikan null, jangan crash. Semua pemanggil sudah tahan null.
function getRecipe(m) { const rs = RECIPES[m.id]; return rs ? rs[m.recipe] || null : null; }

function bufferTotal(buf) {
  return Object.values(buf).reduce((a, b) => a + b, 0);
}

function inputsOk(m) {
  const r = getRecipe(m);
  if (!r) return false;
  if (adminOn()) return true; // bahan baku infinite: mesin selalu punya bahan
  return Object.entries(r.in).every(([id, n]) => (m.input[id] || 0) >= n);
}

// Boleh mulai kalau output masih ada ruang apa pun. Syarat lama (ruang
// satu batch penuh) membuat mesin diam permanen walau output belum penuh
// (mis. 25/30 dengan batch 6): itulah "mesin mati sesudah refresh" yang
// dilaporkan Agus — diamnya sudah terjadi sebelum refresh, eject yang
// mengosongkan output-lah yang menghidupkannya lagi. Batch boleh
// mendorong output sedikit melewati cap; conveyor/ambil hasil yang
// mengosongkannya.
function outputRoom(m) {
  const r = getRecipe(m);
  return r && bufferTotal(m.output) < OUTPUT_CAP;
}

function canStart(m) {
  return !m.stopped && inputsOk(m) && outputRoom(m);
}

function consumeInputs(m) {
  if (adminOn()) return; // bahan baku infinite: crafting tidak mengurangi apa-apa
  const r = getRecipe(m);
  for (const [id, n] of Object.entries(r.in)) {
    m.input[id] -= n;
    if (m.input[id] <= 0) delete m.input[id];
  }
}

function finishCraft(m, gx, gy) {
  const r = getRecipe(m);
  m.output[r.out] = (m.output[r.out] || 0) + r.n;
  S.stats.crafted[r.out] = (S.stats.crafted[r.out] || 0) + r.n;
  if (gx !== undefined) {
    addFloater(gx, gy, '+' + r.n + ' ' + ITEMS[r.out].name, '#5eff8a', 'plot');
    S.pulses.set(key(gx, gy), S.time);
  }
  saveSoon();
}

// Mesin hanya menerima material resep yang sedang dipilih (aturan wiki).
// Tanpa batas jumlah: buffer input tidak dibatasi, supaya bahan dari
// conveyor maupun dari tas tidak pernah tertahan di pintu masuk.
function machineAccepts(m, itemId) {
  const r = getRecipe(m);
  return !!r && (itemId in r.in);
}

function recipeLabel(m) {
  const r = getRecipe(m);
  return r ? recipeText(r) : 'Tidak ada resep';
}
