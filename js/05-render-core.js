// Kanvas + langit (bintang, kunang-kunang) + fitCanvas.
// Pecahan 05-render.js (v16).
// Gambar: semua sprite dilukis prosedural ke atlas saat boot (Atlas.build),
// render hanya mem-blit dari atlas mengikuti manifest. Overlay dinamis
// (cahaya, asap, belt, sorot, angka melayang) tetap digambar langsung.
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
let VW = 0, VH = 0, DPR = 1;

const STARS = [];
for (let i = 0; i < 70; i++) {
  STARS.push({ x: hash2(i, 7), y: hash2(i, 13) * 0.55, r: 0.6 + hash2(i, 29) * 1.3, p: hash2(i, 41) * 6.28 });
}
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

