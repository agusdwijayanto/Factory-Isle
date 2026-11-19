// Lahan: rumput kosong siap dibangun, jalan pendek gerbang ke tengah.
// Pecahan 03-data.js (v16).
function buildPlot() {
  const plot = makeGrid(PLOT_BASE_W, PLOT_BASE_H);
  roadAt(plot, [[8, 7], [8, 8], [8, 9], [8, 10]]); // jalan pendek gerbang ke tengah
  return plot;
}
