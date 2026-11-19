// Lahan: rumput kosong siap dibangun; hanya petak keluar yang jalan.
// Pecahan 03-data.js (v16).
function buildPlot() {
  const plot = makeGrid(PLOT_BASE_W, PLOT_BASE_H);
  roadAt(plot, [[8, 11]]); // petak keluar di tepi bawah; sisanya rumput, bisa dibangun
  return plot;
}
