// Logika resep murni: tanpa DOM, bisa dites headless.
const INPUT_CAP = 30, OUTPUT_CAP = 30;

function getRecipe(m) { return RECIPES[m.id][m.recipe] || null; }

function bufferTotal(buf) {
  return Object.values(buf).reduce((a, b) => a + b, 0);
}

function inputsOk(m) {
  const r = getRecipe(m);
  if (!r) return false;
  return Object.entries(r.in).every(([id, n]) => (m.input[id] || 0) >= n);
}

function outputRoom(m) {
  const r = getRecipe(m);
  return r && bufferTotal(m.output) + r.n <= OUTPUT_CAP;
}

function canStart(m) {
  return !m.stopped && inputsOk(m) && outputRoom(m);
}

function consumeInputs(m) {
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
    addFloater(gx, gy, '+' + r.n + ' ' + ITEMS[r.out].name, '#5eff8a');
    S.pulses.set(key(gx, gy), S.time);
  }
  saveSoon();
}

// Mesin hanya menerima material resep yang sedang dipilih (aturan wiki).
function machineAccepts(m, itemId) {
  const r = getRecipe(m);
  if (!r || !(itemId in r.in)) return false;
  return bufferTotal(m.input) < INPUT_CAP;
}

function recipeLabel(m) {
  const r = getRecipe(m);
  return r ? recipeText(r) : 'Tidak ada resep';
}
