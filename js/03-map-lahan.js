// Lahan bangun: rumput kosong siap dibangun. v49: lahan jadi map ke-5 di
// rantai (antara Hutan Dikit di utara dan Kota di selatan).
// Gerbang SELATAN (8, h-1) = jalan ke Kota (petaknya tetap satu-satunya
// jalan, jadi cek 12-simpan.js tetap sah), gerbang UTARA (8,0) = rumput
// biasa ke Hutan Dikit. Titik (8,0) tidak boleh dibangun (lihat canPlace).
// v49: lahan ikut konvensi dunia — sungai kolom 1, jalan utama kolom 8, rel
// kolom 9 — supaya nyambung dengan map atas (Hutan Dikit) dan bawah (Kota).
// Kolom itu di-stamp ulang tiap ekspansi (01-core.js expandPlotGrid) karena
// baris/kolom baru lahir kosong.
function stampPlotColumns(g) {
  for (const row of g) {
    if (row[1]) row[1].t = 'water';
    if (row[8]) row[8].t = 'road';
    if (row[9]) row[9].t = 'railY';
  }
}
function buildPlot() {
  const plot = makeGrid(PLOT_BASE_W, PLOT_BASE_H);
  stampPlotColumns(plot);
  return plot;
}
