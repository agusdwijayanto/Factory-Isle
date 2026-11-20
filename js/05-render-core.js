// Kanvas + langit (bintang, kunang-kunang) + fitCanvas.
// Pecahan 05-render.js (v16).
// Gambar: semua sprite dilukis prosedural ke atlas saat boot (Atlas.build),
// render hanya mem-blit dari atlas mengikuti manifest. Overlay dinamis
// (cahaya, asap, belt, sorot, angka melayang) tetap digambar langsung.
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
let VW = 0, VH = 0, DPR = 1;

// v48: langit siang cozy — mint terang, awan blob datar. Tidak ada bintang.
const CLOUDS = [
  { x: 0.12, y: 0.15, s: 1.0 }, { x: 0.33, y: 0.07, s: 0.7 },
  { x: 0.60, y: 0.13, s: 1.15 }, { x: 0.84, y: 0.21, s: 0.8 },
  { x: 0.46, y: 0.30, s: 0.55 }, { x: 0.92, y: 0.06, s: 0.6 },
];
const FLIES = [];
for (let i = 0; i < 12; i++) {
  FLIES.push({ gx: 1 + hash2(i, 3) * (GRID_W - 2), gy: 1 + hash2(i, 5) * (GRID_H - 2), p: hash2(i, 11) * 6.28, s: 0.5 + hash2(i, 17) * 0.7 });
}

function fitCanvas() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  VW = window.innerWidth; VH = window.innerHeight;
  cv.width = Math.round(VW * DPR); cv.height = Math.round(VH * DPR);
  cv.style.width = VW + 'px'; cv.style.height = VH + 'px';
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

