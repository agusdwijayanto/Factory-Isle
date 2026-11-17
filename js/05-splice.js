'use strict';
// ---------- Splice: benih kedua di atas bibit, tabel pasangan tetap ----------
// Tidak ada stasiun splice dan tidak ada bocoran resep (riset): penemuan
// lewat mencoba pasangan, hasil yang sudah ditemukan tercatat di buku.
function spliceAt(tx, ty, seedId) {
  const tr = treeAt(tx, ty);
  if (!tr) return false;
  if (tr.seed2) {
    addChat('Terlalu berbahaya mencoba mencampur tiga benih.', 'sys');
    return false; // benih tidak terpakai
  }
  const recipe = findSpliceRecipe(tr.seed1, seedId);
  if (!recipe) {
    addChat('Hmm, sepertinya ' + ITEMS[tr.seed1].name + ' dan ' + ITEMS[seedId].name + ' tidak bisa displice.', 'sys');
    return false; // benih kedua kembali utuh (riset: panduan lama)
  }
  if (!removeItem(seedId, 1)) return false;
  tr.seed2 = seedId;
  tr.item = ITEMS[recipe.out].seedOf;
  tr.plantedAt = nowMs(); // pohon hasil mulai tumbuh dari nol
  const rk = recipe.a + '+' + recipe.b;
  if (!S.knownSplice.includes(rk)) S.knownSplice.push(rk);
  addChat(ITEMS[tr.seed1].name + ' dan ' + ITEMS[seedId].name + ' telah displice menjadi ' + ITEMS[tr.item].name + ' Tree!', 'sys');
  banner('Splice berhasil: ' + ITEMS[tr.item].name + ' Tree!');
  sfx.splice();
  burst(tx * TILE + 16, ty * TILE + 16, '#c9a6ff', 12, 80);
  return true;
}
function tryPlantOrSplice(tx, ty, seedId) {
  // Satu aksi tanam: bibit yang sudah ada berarti splice, petak kosong berarti tanam.
  if (treeAt(tx, ty)) return spliceAt(tx, ty, seedId);
  return plantAt(tx, ty, seedId);
}
