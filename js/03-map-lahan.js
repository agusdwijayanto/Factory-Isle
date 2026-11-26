// Lahan bangun: rumput kosong siap dibangun.
// v56: lahan jadi rumput SEMUA — sungai kolom 1, jalan kolom 8, dan rel
// kolom 9 (konvensi v49, waktu lahan masih di rantai utara-selatan)
// DIHAPUS. Lahan sekarang map samping di luar rantai; gerbang utara (8,0)
// dan gerbang selatan (8, h-1) tetap jalan keluar (koordinat, bukan
// terrain — lihat checkMapTrigger dan canPlace yang melarang bangun di
// kedua gerbang itu). Titik (8,0) tidak boleh dibangun (lihat canPlace).
// v52: bangunan beli wagon KELUAR dari lahan (pindah ke kota) — jadi tidak
// ada lagi objek tetap di lahan.
function stampPlotColumns(g) {
  // v56: tidak ada kolom lagi — lahan rumput semua.
}
function buildPlot() {
  const plot = makeGrid(PLOT_BASE_W, PLOT_BASE_H);
  stampPlotColumns(plot);
  return plot;
}
