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

// ---------- Pelukis atlas: g = konteks atlas, (cx, gy) = tengah & alas ----------
// Semua pelukis memakai skala 1 (sel 64px). Dipanggil Atlas.build.
// Belah ketupat tanah 2:1 (64x32), BUKAN 64x64: ubin setinggi sel penuh
// menumpuk seperti sisik dan tanah terlihat berbukit, bukan datar.
function P_ground(g, cx, gy, color, dots) {
  g.beginPath();
  g.moveTo(cx, gy - 16); g.lineTo(cx + 32, gy); g.lineTo(cx, gy + 16); g.lineTo(cx - 32, gy);
  g.closePath(); g.fillStyle = color; g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.22)'; g.lineWidth = 1; g.stroke();
  if (dots) { g.fillStyle = dots; g.beginPath(); g.arc(cx - 9, gy - 2, 1.6, 0, 6.29); g.fill(); g.beginPath(); g.arc(cx + 8, gy + 3, 1.4, 0, 6.29); g.fill(); }
}
function P_shadow(g, cx, gy, rx) {
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.beginPath(); g.ellipse(cx, gy + 3, rx, rx * 0.45, 0, 0, 6.29); g.fill();
}
function P_isoBox(g, cx, cy, w, hgt, cTop, cLeft, cRight) {
  const hw = w / 2, hh = w / 4, ty = cy - hgt;
  g.beginPath();
  g.moveTo(cx, ty - hh); g.lineTo(cx + hw, ty); g.lineTo(cx, ty + hh); g.lineTo(cx - hw, ty);
  g.closePath(); g.fillStyle = cTop; g.fill();
  g.beginPath();
  g.moveTo(cx - hw, ty); g.lineTo(cx, ty + hh); g.lineTo(cx, cy + hh); g.lineTo(cx - hw, cy);
  g.closePath(); g.fillStyle = cLeft; g.fill();
  g.beginPath();
  g.moveTo(cx, ty + hh); g.lineTo(cx + hw, ty); g.lineTo(cx + hw, cy); g.lineTo(cx, cy + hh);
  g.closePath(); g.fillStyle = cRight; g.fill();
}
// Pembantu ikon: bongkahan bijih dan batangan ingot, tengah di (cx, cy).
function P_oreIcon(g, cx, cy, fleck) {
  g.fillStyle = '#7d8894';
  g.beginPath();
  g.moveTo(cx - 13, cy + 9); g.lineTo(cx - 8, cy - 8); g.lineTo(cx + 4, cy - 12);
  g.lineTo(cx + 12, cy - 2); g.lineTo(cx + 13, cy + 9); g.closePath(); g.fill();
  g.fillStyle = '#5d6773';
  g.beginPath();
  g.moveTo(cx + 4, cy - 12); g.lineTo(cx + 12, cy - 2);
  g.lineTo(cx + 13, cy + 9); g.lineTo(cx + 3, cy + 9); g.closePath(); g.fill();
  g.fillStyle = fleck;
  [[-6, -3], [2, -7], [6, 1]].forEach(([dx, dy]) => g.fillRect(cx + dx, cy + dy, 4, 4));
}
function P_ingot(g, cx, cy, color, dark) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(cx - 14, cy + 8); g.lineTo(cx - 10, cy - 6); g.lineTo(cx + 10, cy - 6); g.lineTo(cx + 14, cy + 8);
  g.closePath(); g.fill();
  g.fillStyle = dark; g.fillRect(cx - 14, cy + 5, 28, 3);
  g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(cx - 10, cy - 6, 20, 3);
}
function P_furnace(g, cx, cy) {
  const grad = g.createRadialGradient(cx, cy, 0, cx, cy, 8);
  grad.addColorStop(0, '#ffd75e'); grad.addColorStop(1, '#ff7a2e');
  g.fillStyle = grad;
  g.beginPath(); g.arc(cx, cy, 5, Math.PI, 0); g.fill();
  g.fillRect(cx - 5, cy, 10, 6);
}

const PAINTERS = {
  grass0: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#4e7d32'),
  grass1: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#557f36', '#ffd75e'),
  grass2: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#4a7a30'),
  grass3: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#5d8a3a', '#e8e0f0'),
  sand: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#c9a86a', 'rgba(120,90,40,0.5)'),
  clay: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#a5613f');
    g.fillStyle = '#8a4c2e';
    g.beginPath(); g.ellipse(ox + 25, oy + 32, 7, 3.5, 0, 0, 6.29); g.fill();
    g.beginPath(); g.ellipse(ox + 40, oy + 34, 5, 2.5, 0, 0, 6.29); g.fill();
  },
  water: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#2a6db0');
    g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(ox + 14, oy + 30); g.lineTo(ox + 26, oy + 36); g.stroke();
    g.beginPath(); g.moveTo(ox + 38, oy + 28); g.lineTo(ox + 50, oy + 34); g.stroke();
  },
  bridge: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#2a6db0');
    g.fillStyle = '#8a5a33';
    g.beginPath();
    g.moveTo(ox + 4, oy + 32); g.lineTo(ox + 32, oy + 18); g.lineTo(ox + 60, oy + 32); g.lineTo(ox + 32, oy + 46); g.closePath(); g.fill();
    g.fillStyle = '#a8763e';
    for (const dy of [-8, 0, 8]) {
      g.beginPath();
      g.moveTo(ox + 24, oy + 32 + dy); g.lineTo(ox + 32, oy + 28 + dy); g.lineTo(ox + 40, oy + 32 + dy); g.lineTo(ox + 32, oy + 36 + dy); g.closePath(); g.fill();
    }
  },
  platform: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#8d99a8');
    g.strokeStyle = '#ffd75e'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 4, oy + 32); g.lineTo(ox + 32, oy + 18); g.stroke();
    g.strokeStyle = '#5d6773'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(ox + 8, oy + 36); g.lineTo(ox + 56, oy + 36); g.stroke();
  },
  dock: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#2a6db0');
    g.fillStyle = '#7a5230';
    g.beginPath();
    g.moveTo(ox + 6, oy + 32); g.lineTo(ox + 32, oy + 19); g.lineTo(ox + 58, oy + 32); g.lineTo(ox + 32, oy + 45); g.closePath(); g.fill();
    g.strokeStyle = '#a8763e'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(ox + 18, oy + 32); g.lineTo(ox + 32, oy + 25); g.lineTo(ox + 46, oy + 32); g.lineTo(ox + 32, oy + 39); g.closePath(); g.stroke();
  },
  road: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#b89a68');
    g.fillStyle = 'rgba(120,90,40,0.5)';
    [[-10, -3], [2, -6], [9, 2], [-3, 5], [6, 6]].forEach(([dx, dy]) => g.fillRect(ox + 32 + dx, oy + 32 + dy, 3, 3));
  },
  // Rel searah sumbu-x: garis baja sejajar diagonal belah ketupat, sambung antar petak.
  railX: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#6e6a72');
    g.strokeStyle = '#d7dbe0'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 13, oy + 26); g.lineTo(ox + 44, oy + 41); g.stroke();
    g.beginPath(); g.moveTo(ox + 20, oy + 23); g.lineTo(ox + 51, oy + 38); g.stroke();
    g.strokeStyle = '#4a464e'; g.lineWidth = 3;
    [[26, 24, 22, 32], [34, 28, 30, 36], [42, 32, 38, 40]].forEach(([x1, y1, x2, y2]) => {
      g.beginPath(); g.moveTo(ox + x1, oy + y1); g.lineTo(ox + x2, oy + y2); g.stroke();
    });
  },
  railY: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#6e6a72');
    g.strokeStyle = '#d7dbe0'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 51, oy + 26); g.lineTo(ox + 20, oy + 41); g.stroke();
    g.beginPath(); g.moveTo(ox + 44, oy + 23); g.lineTo(ox + 13, oy + 38); g.stroke();
    g.strokeStyle = '#4a464e'; g.lineWidth = 3;
    [[38, 24, 42, 32], [30, 28, 34, 36], [22, 32, 26, 40]].forEach(([x1, y1, x2, y2]) => {
      g.beginPath(); g.moveTo(ox + x1, oy + y1); g.lineTo(ox + x2, oy + y2); g.stroke();
    });
  },
  // Ujung rel (terminus): rel seperti railY + palang merah di ujung atas.
  railStop: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#6e6a72');
    g.strokeStyle = '#d7dbe0'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 51, oy + 26); g.lineTo(ox + 20, oy + 41); g.stroke();
    g.beginPath(); g.moveTo(ox + 44, oy + 23); g.lineTo(ox + 13, oy + 38); g.stroke();
    g.strokeStyle = '#4a464e'; g.lineWidth = 3;
    [[38, 24, 42, 32], [30, 28, 34, 36], [22, 32, 26, 40]].forEach(([x1, y1, x2, y2]) => {
      g.beginPath(); g.moveTo(ox + x1, oy + y1); g.lineTo(ox + x2, oy + y2); g.stroke();
    });
    g.strokeStyle = '#c0392b'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(ox + 41, oy + 20); g.lineTo(ox + 54, oy + 27); g.stroke();
  },
  tree: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 13);
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 2.5, gy - 14, 5, 14);
    g.fillStyle = '#2f6b33'; g.beginPath(); g.arc(cx, gy - 30, 13, 0, 6.29); g.fill();
    g.fillStyle = '#357a38'; g.beginPath(); g.arc(cx - 8, gy - 22, 9, 0, 6.29); g.fill();
    g.fillStyle = '#2a5f2e'; g.beginPath(); g.arc(cx + 8, gy - 22, 9, 0, 6.29); g.fill();
    g.strokeStyle = 'rgba(255,215,94,0.55)'; g.lineWidth = 2;
    g.beginPath(); g.arc(cx, gy - 30, 12, Math.PI * 0.9, Math.PI * 1.5); g.stroke();
  },
  stump: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 8);
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 6, gy - 6, 12, 6);
    g.fillStyle = '#a8763e'; g.beginPath(); g.ellipse(cx, gy - 6, 6, 2.5, 0, 0, 6.29); g.fill();
  },
  oreIron: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#e07b39'),
  oreCopper: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#4fae9d'),
  oreTin: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#d8e2e8'),
  _ore: (g, ox, oy, color) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 14);
    g.fillStyle = '#7d8894';
    g.beginPath();
    g.moveTo(cx - 14, gy); g.lineTo(cx - 9, gy - 14); g.lineTo(cx + 3, gy - 18);
    g.lineTo(cx + 13, gy - 8); g.lineTo(cx + 14, gy); g.closePath(); g.fill();
    g.fillStyle = '#5d6773';
    g.beginPath();
    g.moveTo(cx + 3, gy - 18); g.lineTo(cx + 13, gy - 8);
    g.lineTo(cx + 14, gy); g.lineTo(cx + 2, gy); g.closePath(); g.fill();
    g.fillStyle = color;
    [[-7, -8], [2, -12], [7, -5]].forEach(([dx, dy]) => g.fillRect(cx + dx, gy + dy, 3.5, 3.5));
  },
  cotton: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 11);
    g.strokeStyle = '#3f7a34'; g.lineWidth = 1.6;
    [[-8, 0], [0, -3], [8, 0]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + dx, gy); g.lineTo(cx + dx, gy - 12 + dy); g.stroke();
    });
    g.fillStyle = '#f2ede0';
    [[-8, -13], [0, -16], [8, -13], [-4, -10], [4, -10]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 4, 0, 6.29); g.fill();
    });
  },
  lantern: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 6);
    g.fillStyle = '#3a2a1a'; g.fillRect(cx - 1.5, gy - 26, 3, 26);
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 4, gy - 33, 8, 8);
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 1.5; g.strokeRect(cx - 4, gy - 33, 8, 8);
  },
  flowers: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    g.strokeStyle = '#3f7a34'; g.lineWidth = 1.5;
    [[-9, -8], [0, -11], [9, -8]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + dx, gy); g.lineTo(cx + dx, gy + dy); g.stroke();
    });
    g.fillStyle = '#d97ba8';
    [[-9, -9], [0, -12], [9, -9]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 3, 0, 6.29); g.fill();
    });
  },
  sawhorse: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 14);
    g.strokeStyle = '#8a5a33'; g.lineWidth = 3; g.lineCap = 'round';
    [-10, 10].forEach((dx) => {
      g.beginPath(); g.moveTo(cx + dx - 5, gy); g.lineTo(cx + dx + 5, gy - 12); g.stroke();
      g.beginPath(); g.moveTo(cx + dx + 5, gy); g.lineTo(cx + dx - 5, gy - 12); g.stroke();
    });
    g.fillStyle = '#a8763e'; g.fillRect(cx - 17, gy - 15, 34, 4);
    g.fillStyle = '#7a5230'; g.fillRect(cx - 10, gy - 19, 20, 4);
    g.fillStyle = '#c9a86a'; g.beginPath(); g.arc(cx + 10, gy - 17, 2.5, 0, 6.29); g.fill();
  },
  carpenter: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    P_isoBox(g, cx, gy, 36, 11, '#a8763e', '#7a5230', '#5f3d22');
    g.fillStyle = '#c9a86a';
    g.fillRect(cx - 12, gy - 16, 14, 3); g.fillRect(cx - 9, gy - 19, 12, 3);
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx + 8, gy - 18); g.lineTo(cx + 13, gy - 12); g.stroke();
  },
  oven: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 17);
    P_isoBox(g, cx, gy, 40, 22, '#b06040', '#8a4630', '#6e3626');
    g.fillStyle = '#3a1c12';
    g.beginPath(); g.arc(cx, gy - 8, 7, Math.PI, 0); g.fill();
    g.fillRect(cx - 7, gy - 8, 14, 8);
    P_furnace(g, cx, gy - 6);
    P_isoBox(g, cx - 10, gy - 22, 10, 8, '#8a4630', '#6e3626', '#5a2c1e');
  },
  smelter: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 18);
    P_isoBox(g, cx, gy, 42, 26, '#96553c', '#74402c', '#5c3222');
    P_isoBox(g, cx + 11, gy - 26, 11, 26, '#7d8894', '#5d6773', '#49525c');
    g.fillStyle = '#3a1c12'; g.fillRect(cx - 7, gy - 12, 14, 12);
    const grad = g.createRadialGradient(cx, gy - 6, 0, cx, gy - 6, 8);
    grad.addColorStop(0, '#ffd75e'); grad.addColorStop(1, '#ff7a2e');
    g.fillStyle = grad; g.fillRect(cx - 5, gy - 10, 10, 10);
  },
  blacksmith: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    P_isoBox(g, cx, gy, 38, 13, '#6e6a72', '#54505a', '#43404a');
    g.fillStyle = '#2c2833';
    g.beginPath();
    g.moveTo(cx - 12, gy - 16); g.lineTo(cx - 4, gy - 16); g.lineTo(cx - 2, gy - 20);
    g.lineTo(cx + 8, gy - 20); g.lineTo(cx + 12, gy - 24); g.lineTo(cx + 4, gy - 24);
    g.lineTo(cx + 2, gy - 20); g.lineTo(cx - 6, gy - 20); g.closePath(); g.fill();
    g.fillStyle = '#8d99a8'; g.fillRect(cx - 3, gy - 16, 6, 3);
    const grad = g.createRadialGradient(cx + 10, gy - 8, 0, cx + 10, gy - 8, 7);
    grad.addColorStop(0, '#ffd75e'); grad.addColorStop(1, '#ff7a2e');
    g.fillStyle = grad; g.beginPath(); g.arc(cx + 10, gy - 8, 5, 0, 6.29); g.fill();
  },
  splitter: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 14);
    g.fillStyle = '#5f3d22';
    g.fillRect(cx - 13, gy - 24, 4, 24); g.fillRect(cx + 9, gy - 24, 4, 24);
    g.fillRect(cx - 13, gy - 27, 26, 4);
    g.fillStyle = '#8d99a8';
    g.beginPath();
    g.moveTo(cx - 4, gy - 23); g.lineTo(cx + 4, gy - 23); g.lineTo(cx, gy - 13);
    g.closePath(); g.fill();
    g.fillStyle = '#7a5230'; g.fillRect(cx - 12, gy - 6, 24, 6);
    g.fillStyle = '#c9a86a'; g.beginPath(); g.arc(cx + 12, gy - 3, 3, 0, 6.29); g.fill();
  },
  conveyor: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.beginPath();
    g.moveTo(cx, cy - 11); g.lineTo(cx + 23, cy); g.lineTo(cx, cy + 11); g.lineTo(cx - 23, cy);
    g.closePath(); g.fillStyle = '#26262e'; g.fill();
    g.strokeStyle = '#45454f'; g.lineWidth = 1.5; g.stroke();
  },
  conveyorTilt: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.beginPath();
    g.moveTo(cx, cy - 11); g.lineTo(cx + 23, cy - 6); g.lineTo(cx, cy + 5); g.lineTo(cx - 23, cy - 6);
    g.closePath(); g.fillStyle = '#2e2a24'; g.fill();
    g.strokeStyle = '#c98f2e'; g.lineWidth = 1.5; g.stroke();
  },
  wallWood: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 15);
    P_isoBox(g, cx, gy, 40, 20, '#a8763e', '#7a5230', '#5f3d22');
    g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx - 20, gy - 10); g.lineTo(cx, gy); g.lineTo(cx + 20, gy - 10); g.stroke();
  },
  wallIron: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 15);
    P_isoBox(g, cx, gy, 40, 20, '#8d99a8', '#5d6773', '#49525c');
    g.fillStyle = '#3a3f47';
    [[-10, -14], [0, -9], [10, -14]].forEach(([dx, dy]) => g.fillRect(cx + dx - 1, gy + dy, 2, 2));
  },
  box: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 14);
    P_isoBox(g, cx, gy, 32, 14, '#a8763e', '#7a5230', '#5f3d22');
    g.strokeStyle = '#3a2a1a'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx - 16, gy - 7); g.lineTo(cx, gy + 1); g.lineTo(cx + 16, gy - 7); g.stroke();
  },
  container: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    P_isoBox(g, cx, gy, 40, 18, '#5f8fa8', '#4f7a94', '#3c5e73');
    g.strokeStyle = 'rgba(255,255,255,0.3)'; g.lineWidth = 1;
    for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(cx + i * 10 - 5, gy - 16); g.lineTo(cx + i * 10 - 5, gy - 2); g.stroke(); }
  },
  rack: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 15);
    g.strokeStyle = '#54505a'; g.lineWidth = 3;
    [[-13, 0], [13, 0]].forEach(([dx]) => { g.beginPath(); g.moveTo(cx + dx, gy); g.lineTo(cx + dx, gy - 26); g.stroke(); });
    g.fillStyle = '#a8763e';
    g.fillRect(cx - 16, gy - 10, 32, 3); g.fillRect(cx - 16, gy - 20, 32, 3); g.fillRect(cx - 16, gy - 28, 32, 3);
    g.fillStyle = '#c9a86a'; g.fillRect(cx - 10, gy - 17, 7, 6);
    g.fillStyle = '#8d99a8'; g.fillRect(cx + 2, gy - 17, 7, 6);
  },
  crate: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_isoBox(g, cx, gy, 22, 12, '#c9a86a', '#a8763e', '#7a5230');
    g.strokeStyle = '#5f3d22'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(cx - 11, gy - 6); g.lineTo(cx, gy); g.lineTo(cx + 11, gy - 6); g.stroke();
  },
  axe: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    g.strokeStyle = '#7a5230'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 8, gy - 2); g.lineTo(cx + 8, gy - 34); g.stroke();
    g.fillStyle = '#8d99a8';
    g.beginPath();
    g.moveTo(cx + 8, gy - 34); g.lineTo(cx + 16, gy - 28); g.lineTo(cx + 12, gy - 20); g.lineTo(cx + 6, gy - 24);
    g.closePath(); g.fill();
  },
  pickaxe: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    g.strokeStyle = '#7a5230'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 6, gy - 2); g.lineTo(cx + 4, gy - 32); g.stroke();
    g.strokeStyle = '#8d99a8'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(cx - 8, gy - 26); g.quadraticCurveTo(cx + 4, gy - 36, cx + 16, gy - 26); g.stroke();
  },
  shovel: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    g.strokeStyle = '#7a5230'; g.lineWidth = 3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 6, gy - 2); g.lineTo(cx + 6, gy - 30); g.stroke();
    g.fillStyle = '#8d99a8';
    g.beginPath();
    g.moveTo(cx + 2, gy - 30); g.lineTo(cx + 12, gy - 30); g.lineTo(cx + 10, gy - 20); g.lineTo(cx + 4, gy - 20);
    g.closePath(); g.fill();
  },
  shop: (g, ox, oy) => {
    // Blok 2x2 sel: alas di bawah blok.
    const cx = ox + 64, gy = oy + 126;
    P_shadow(g, cx, gy, 34);
    P_isoBox(g, cx, gy, 84, 34, '#b06040', '#8a4630', '#6e3626');
    P_isoBox(g, cx, gy - 34, 70, 22, '#7a5230', '#5f3d22', '#4a2e18');
    g.fillStyle = '#e8b64c';
    g.beginPath();
    g.moveTo(cx - 42, gy - 34); g.lineTo(cx, gy - 56); g.lineTo(cx + 42, gy - 34);
    g.lineTo(cx + 42, gy - 28); g.lineTo(cx, gy - 50); g.lineTo(cx - 42, gy - 28);
    g.closePath(); g.fill();
    g.fillStyle = '#3a1c12'; g.fillRect(cx - 12, gy - 26, 24, 26);
    g.fillStyle = '#ffd75e'; g.fillRect(cx - 9, gy - 23, 18, 8);
    g.fillStyle = '#2a1f16'; g.fillRect(cx - 26, gy - 62, 52, 14);
    g.strokeStyle = '#ffd75e'; g.lineWidth = 1.5; g.strokeRect(cx - 26, gy - 62, 52, 14);
    g.fillStyle = '#ffd75e'; g.font = '800 10px system-ui, sans-serif';
    g.textAlign = 'center'; g.fillText('TOKO', cx, gy - 51);
  },
  mountain: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 18);
    g.fillStyle = '#7d8894';
    g.beginPath();
    g.moveTo(cx - 20, gy); g.lineTo(cx - 8, gy - 34); g.lineTo(cx + 2, gy - 44);
    g.lineTo(cx + 12, gy - 30); g.lineTo(cx + 20, gy); g.closePath(); g.fill();
    g.fillStyle = '#5d6773';
    g.beginPath();
    g.moveTo(cx + 2, gy - 44); g.lineTo(cx + 12, gy - 30); g.lineTo(cx + 20, gy);
    g.lineTo(cx + 2, gy); g.closePath(); g.fill();
    g.fillStyle = '#f2ede0'; // salju di puncak
    g.beginPath();
    g.moveTo(cx - 8, gy - 34); g.lineTo(cx + 2, gy - 44); g.lineTo(cx + 7, gy - 36);
    g.lineTo(cx + 2, gy - 33); g.lineTo(cx - 3, gy - 36); g.closePath(); g.fill();
  },
  station: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    P_isoBox(g, cx, gy, 40, 16, '#3a5a8a', '#2c4468', '#223452');
    g.fillStyle = '#2c4468'; g.fillRect(cx - 18, gy - 34, 36, 18);
    g.fillStyle = '#e8b64c'; // atap menara jam
    g.beginPath();
    g.moveTo(cx - 12, gy - 34); g.lineTo(cx, gy - 46); g.lineTo(cx + 12, gy - 34); g.closePath(); g.fill();
    g.fillStyle = '#f2ede0'; g.beginPath(); g.arc(cx, gy - 40, 4, 0, 6.29); g.fill();
    g.strokeStyle = '#2a1f16'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(cx, gy - 40); g.lineTo(cx, gy - 43); g.stroke();
    g.beginPath(); g.moveTo(cx, gy - 40); g.lineTo(cx + 2, gy - 39); g.stroke();
    g.fillStyle = '#3a1c12'; g.fillRect(cx - 5, gy - 14, 10, 14);
  },
  train: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    g.fillStyle = '#2c2833'; // badan lokomotif uap
    g.fillRect(cx - 18, gy - 26, 36, 18);
    g.fillStyle = '#43404a'; g.fillRect(cx + 8, gy - 36, 10, 10); // kabin
    g.fillStyle = '#2c2833'; g.fillRect(cx - 14, gy - 38, 5, 12); // cerobong
    g.fillStyle = '#8d99a8'; g.fillRect(cx - 15, gy - 40, 7, 3);
    g.fillStyle = '#c0392b'; g.fillRect(cx - 18, gy - 9, 36, 3); // garis merah
    g.fillStyle = '#43404a';
    [[-13, -2], [0, -2], [13, -2]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 4.5, 0, 6.29); g.fill();
    });
    g.fillStyle = 'rgba(255,255,255,0.5)'; // asap
    g.beginPath(); g.arc(cx - 11, gy - 46, 4, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx - 14, gy - 52, 5, 0, 6.29); g.fill();
  },
  player: (g, ox, oy, cell, v) => {
    // v: {dir 0..3, frame 0..2}. dir 0/1 depan, 2/3 belakang; 1/2 dicerminkan.
    const cx = ox + 32, gy = oy + 62;
    const flip = v.dir === 1 || v.dir === 2, back = v.dir >= 2;
    g.save();
    g.translate(cx, gy); if (flip) g.scale(-1, 1);
    const step = v.frame === 0 ? 0 : (v.frame === 1 ? 3 : -3);
    P_shadow(g, 0, 0, 9);
    g.fillStyle = '#3a3f47'; // kaki + sepatu
    g.fillRect(-6, -12 + Math.max(0, step), 5, 12 - Math.max(0, step));
    g.fillRect(1, -12 + Math.max(0, -step), 5, 12 - Math.max(0, -step));
    g.fillStyle = '#2c4a7a'; // celana
    g.fillRect(-6, -20, 12, 9);
    g.fillStyle = '#e07b39'; // baju
    g.fillRect(-7, -34, 14, 15);
    g.fillStyle = '#c96a2e'; g.fillRect(-7, -34, 14, 3);
    g.fillStyle = '#f0c8a0'; // tangan
    g.fillRect(-10, -32, 3, 10); g.fillRect(7, -32, 3, 10);
    g.fillStyle = back ? '#6a4a2a' : '#f0c8a0'; // kepala
    g.beginPath(); g.arc(0, -40, 7, 0, 6.29); g.fill();
    if (!back) { g.fillStyle = '#2a1a10'; g.fillRect(-3, -41, 2, 2); g.fillRect(2, -41, 2, 2); }
    g.fillStyle = '#e8c860'; // topi jerami
    g.beginPath(); g.ellipse(0, -45, 10, 3.5, 0, 0, 6.29); g.fill();
    g.fillRect(-5, -49, 10, 4);
    g.restore();
  },
  // ---------- Ikon item: tengah sel, wajib muat di dalam sel 64px ----------
  item_Log: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#7a5230';
    g.beginPath(); g.ellipse(cx - 13, cy + 2, 6, 9, 0, 0, 6.29); g.fill();
    g.fillStyle = '#a8763e'; g.fillRect(cx - 13, cy - 7, 26, 18);
    g.fillStyle = '#c9a86a';
    g.beginPath(); g.ellipse(cx + 13, cy + 2, 6, 9, 0, 0, 6.29); g.fill();
    g.strokeStyle = '#7a5230'; g.lineWidth = 1.5;
    g.beginPath(); g.ellipse(cx + 13, cy + 2, 3, 5, 0, 0, 6.29); g.stroke();
  },
  item_Pillar: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#8a5a33'; g.fillRect(cx - 7, cy - 18, 14, 36);
    g.fillStyle = '#a8763e'; g.fillRect(cx - 10, cy - 21, 20, 5); g.fillRect(cx - 10, cy + 16, 20, 5);
    g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(cx - 7, cy - 18, 4, 36);
  },
  item_Plank: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#c9a86a';
    g.fillRect(cx - 16, cy - 12, 32, 8); g.fillRect(cx - 16, cy - 2, 32, 8); g.fillRect(cx - 16, cy + 8, 32, 8);
    g.strokeStyle = '#a8763e'; g.lineWidth = 1.5;
    for (const dy of [-12, -2, 8]) g.strokeRect(cx - 16, cy + dy, 32, 8);
  },
  item_Firelog: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 36;
    g.fillStyle = '#7a5230';
    g.beginPath(); g.ellipse(cx - 12, cy + 2, 5, 8, 0, 0, 6.29); g.fill();
    g.fillStyle = '#a8763e'; g.fillRect(cx - 12, cy - 6, 24, 16);
    g.fillStyle = '#ff7a2e';
    g.beginPath();
    g.moveTo(cx + 2, cy - 8); g.quadraticCurveTo(cx + 12, cy - 18, cx + 8, cy - 26);
    g.quadraticCurveTo(cx + 16, cy - 16, cx + 12, cy - 6); g.closePath(); g.fill();
    g.fillStyle = '#ffd75e';
    g.beginPath();
    g.moveTo(cx + 5, cy - 9); g.quadraticCurveTo(cx + 10, cy - 15, cx + 8, cy - 20);
    g.quadraticCurveTo(cx + 12, cy - 14, cx + 10, cy - 8); g.closePath(); g.fill();
  },
  item_Brick: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#b06040';
    g.fillRect(cx - 16, cy + 2, 15, 10); g.fillRect(cx + 1, cy + 2, 15, 10); g.fillRect(cx - 8, cy - 10, 15, 10);
    g.strokeStyle = '#8a4630'; g.lineWidth = 1.5;
    g.strokeRect(cx - 16, cy + 2, 15, 10); g.strokeRect(cx + 1, cy + 2, 15, 10); g.strokeRect(cx - 8, cy - 10, 15, 10);
  },
  item_Glass: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = 'rgba(159,212,232,0.85)'; g.fillRect(cx - 13, cy - 16, 26, 32);
    g.strokeStyle = '#5f8fa8'; g.lineWidth = 2.5; g.strokeRect(cx - 13, cy - 16, 26, 32);
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx - 8, cy + 10); g.lineTo(cx + 2, cy - 12); g.stroke();
  },
  item_IronOre: (g, ox, oy) => P_oreIcon(g, ox + 32, oy + 32, '#e07b39'),
  item_CopperOre: (g, ox, oy) => P_oreIcon(g, ox + 32, oy + 32, '#4fae9d'),
  item_TinOre: (g, ox, oy) => P_oreIcon(g, ox + 32, oy + 32, '#d8e2e8'),
  item_Sand: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#e8d9a0';
    g.beginPath();
    g.moveTo(cx - 16, cy + 12); g.lineTo(cx, cy - 14); g.lineTo(cx + 16, cy + 12);
    g.closePath(); g.fill();
    g.fillStyle = '#c9a86a';
    g.beginPath(); g.arc(cx - 5, cy + 5, 2, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 6, cy + 8, 2, 0, 6.29); g.fill();
  },
  item_Clay: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#a5613f';
    g.beginPath(); g.ellipse(cx, cy + 6, 15, 9, 0, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx - 6, cy - 4, 7, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 6, cy - 2, 6, 0, 6.29); g.fill();
    g.fillStyle = '#8a4c2e';
    g.beginPath(); g.ellipse(cx, cy + 8, 10, 4, 0, 0, 6.29); g.fill();
  },
  item_Cotton: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#f2ede0';
    [[-9, 2], [0, -6], [9, 2], [-4, 8], [5, 8]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, cy + dy, 7, 0, 6.29); g.fill();
    });
    g.fillStyle = '#d8d2c2';
    g.beginPath(); g.arc(cx - 9, cy + 4, 3, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 8, cy + 5, 3, 0, 6.29); g.fill();
  },
  item_IronIngot: (g, ox, oy) => P_ingot(g, ox + 32, oy + 32, '#8d99a8', '#5d6773'),
  item_CopperIngot: (g, ox, oy) => P_ingot(g, ox + 32, oy + 32, '#e08a5a', '#b06a3e'),
  item_BronzeIngot: (g, ox, oy) => P_ingot(g, ox + 32, oy + 32, '#c98f2e', '#9a6a1e'),
  item_Coil: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.strokeStyle = '#d97b4f'; g.lineWidth = 3;
    for (const r of [13, 8, 3]) { g.beginPath(); g.arc(cx, cy, r, 0, 6.29); g.stroke(); }
  },
  item_Gear: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#c9a86a';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.save(); g.translate(cx, cy); g.rotate(a);
      g.fillRect(-3, -16, 6, 7);
      g.restore();
    }
    g.beginPath(); g.arc(cx, cy, 11, 0, 6.29); g.fill();
    g.fillStyle = '#241a12'; g.beginPath(); g.arc(cx, cy, 4.5, 0, 6.29); g.fill();
  },
  item_IronBeam: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#7d8894';
    g.fillRect(cx - 15, cy - 14, 30, 6); g.fillRect(cx - 4, cy - 14, 8, 28); g.fillRect(cx - 15, cy + 8, 30, 6);
    g.fillStyle = '#5d6773'; g.fillRect(cx - 15, cy + 11, 30, 3);
  },
  item_IronFrame: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.strokeStyle = '#6e7683'; g.lineWidth = 6; g.strokeRect(cx - 13, cy - 13, 26, 26);
    g.fillStyle = '#8d99a8';
    [[-13, -13], [13, -13], [-13, 13], [13, 13]].forEach(([dx, dy]) => g.fillRect(cx + dx - 3, cy + dy - 3, 6, 6));
  },
  item_Nails: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.strokeStyle = '#b8b0a0'; g.lineWidth = 2.5; g.lineCap = 'round';
    [[-10, -8, 0.5], [0, -12, 0], [10, -8, -0.5]].forEach(([dx, dy, tilt]) => {
      g.save(); g.translate(cx + dx, cy + dy); g.rotate(tilt);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 18); g.stroke();
      g.fillStyle = '#d8d2c2'; g.fillRect(-4, -3, 8, 4);
      g.restore();
    });
  },
  item_Motor: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#e8b64c'; g.fillRect(cx - 13, cy - 8, 20, 18);
    g.fillStyle = '#8d99a8'; g.fillRect(cx + 7, cy - 4, 8, 10);
    g.fillStyle = '#6e7683';
    for (let i = 0; i < 3; i++) g.fillRect(cx - 10 + i * 6, cy - 12, 3, 4);
    g.fillStyle = '#2c2833'; g.fillRect(cx - 9, cy - 1, 6, 6);
  },
  item_WoodFrame: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.strokeStyle = '#d9b06a'; g.lineWidth = 6; g.strokeRect(cx - 13, cy - 13, 26, 26);
    g.strokeStyle = '#a8763e'; g.lineWidth = 1.5; g.strokeRect(cx - 13, cy - 13, 26, 26);
  },
  item_Table: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#a8763e'; g.fillRect(cx - 16, cy - 6, 32, 6);
    g.fillStyle = '#7a5230'; g.fillRect(cx - 12, cy, 4, 14); g.fillRect(cx + 8, cy, 4, 14);
    g.fillStyle = '#c9a86a'; g.fillRect(cx - 16, cy - 6, 32, 2);
  },
  item_Bench: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#8a5a33'; g.fillRect(cx - 15, cy + 2, 30, 5);
    g.fillRect(cx - 11, cy + 7, 4, 9); g.fillRect(cx + 7, cy + 7, 4, 9);
    g.fillStyle = '#a8763e'; g.fillRect(cx - 15, cy + 2, 30, 2);
  },
  item_Window: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#9fd4e8'; g.fillRect(cx - 12, cy - 14, 24, 28);
    g.strokeStyle = '#7a5230'; g.lineWidth = 3; g.strokeRect(cx - 12, cy - 14, 24, 28);
    g.beginPath(); g.moveTo(cx, cy - 14); g.lineTo(cx, cy + 14); g.moveTo(cx - 12, cy); g.lineTo(cx + 12, cy); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx - 8, cy + 8); g.lineTo(cx - 2, cy - 8); g.stroke();
  },
  // ---------- Mayor, gerbang, kotak plot ----------
  mayor: (g, ox, oy) => {
    // Perempuan rambut pirang, gaun biru-putih (foto Mayor).
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 10);
    g.fillStyle = '#2c4a7a'; // gaun
    g.beginPath();
    g.moveTo(cx - 5, gy - 32); g.lineTo(cx + 5, gy - 32);
    g.lineTo(cx + 11, gy); g.lineTo(cx - 11, gy);
    g.closePath(); g.fill();
    g.fillStyle = '#e8e4f5'; // celemek putih
    g.beginPath();
    g.moveTo(cx - 3, gy - 30); g.lineTo(cx + 3, gy - 30);
    g.lineTo(cx + 6, gy - 2); g.lineTo(cx - 6, gy - 2);
    g.closePath(); g.fill();
    g.fillStyle = '#f0c8a0'; // tangan + kepala
    g.fillRect(cx - 9, gy - 30, 3, 9); g.fillRect(cx + 6, gy - 30, 3, 9);
    g.beginPath(); g.arc(cx, gy - 38, 7, 0, 6.29); g.fill();
    g.fillStyle = '#e8c860'; // rambut pirang
    g.beginPath(); g.arc(cx, gy - 41, 8, Math.PI, 0); g.fill();
    g.fillRect(cx - 8, gy - 41, 3, 10); g.fillRect(cx + 5, gy - 41, 3, 10);
    g.fillStyle = '#2a1a10'; g.fillRect(cx - 3, gy - 39, 2, 2); g.fillRect(cx + 2, gy - 39, 2, 2);
  },
  gate: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    g.fillStyle = '#5f3d22';
    g.fillRect(cx - 20, gy - 34, 5, 34); g.fillRect(cx + 15, gy - 34, 5, 34);
    g.fillStyle = '#7a5230'; g.fillRect(cx - 22, gy - 40, 44, 6);
    g.fillStyle = '#ffd75e';
    g.fillRect(cx - 19, gy - 33, 3, 3); g.fillRect(cx + 16, gy - 33, 3, 3);
    g.fillStyle = '#e8b64c'; g.fillRect(cx - 8, gy - 32, 16, 9);
    g.strokeStyle = '#5f3d22'; g.lineWidth = 1.5; g.strokeRect(cx - 8, gy - 32, 16, 9);
  },
  plotpad: (g, ox, oy) => {
    // Lempeng putih berbingkai kuning, rata dengan lantai (drawTile).
    const cx = ox + 32, cy = oy + 32;
    g.beginPath();
    g.moveTo(cx, cy - 15); g.lineTo(cx + 30, cy); g.lineTo(cx, cy + 15); g.lineTo(cx - 30, cy);
    g.closePath(); g.fillStyle = '#e8e4da'; g.fill();
    g.strokeStyle = '#e8b64c'; g.lineWidth = 2.5; g.stroke();
    g.fillStyle = '#c98f2e';
    [[0, -9], [17, 0], [0, 9], [-17, 0]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, cy + dy, 2, 0, 6.29); g.fill();
    });
  },
};
Object.assign(Atlas.painters, PAINTERS);

// ---------- Overlay dinamis ----------
const GLOWS = { oven: [0, -4, 52, 0.55], smelter: [0, -6, 60, 0.6], blacksmith: [10, -8, 40, 0.5], lantern: [0, -29, 46, 0.5] };
const BELT_AXIS = [[1, 0.5], [-1, 0.5], [-1, -0.5], [1, -0.5]]; // arah grid 0..3

function diamondPath(x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x, y - h / 2); ctx.lineTo(x + w / 2, y);
  ctx.lineTo(x, y + h / 2); ctx.lineTo(x - w / 2, y);
  ctx.closePath();
}
function glow(x, y, r, alpha) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(255,150,60,0.55)');
  g.addColorStop(1, 'rgba(255,140,50,0)');
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  ctx.globalAlpha = 1;
}

function paintBeltFlow(x, y, z, dir) {
  const [ax, ay] = BELT_AXIS[dir];
  const len = Math.hypot(ax, ay), ux = ax / len, uy = ay / len;
  ctx.save();
  diamondPath(x, y, TILE_W * 0.72 * z, TILE_H * 0.72 * z); ctx.clip();
  ctx.fillStyle = '#e8b64c';
  const spacing = 16 * z, off = (S.beltT * 18 * z) % spacing;
  for (let k = -2; k <= 2; k++) {
    const cx = x + ux * (k * spacing + off), cy = y + uy * (k * spacing + off);
    ctx.beginPath();
    ctx.moveTo(cx + ux * 5 * z, cy + uy * 5 * z);
    ctx.lineTo(cx - uy * 5 * z, cy + ux * 5 * z);
    ctx.lineTo(cx + uy * 5 * z, cy - ux * 5 * z);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

function paintDirArrow(x, y, z, dir) {
  const [ax, ay] = BELT_AXIS[dir];
  const len = Math.hypot(ax, ay), ux = ax / len, uy = ay / len;
  const ex = x + ux * 26 * z, ey = y + uy * 26 * z;
  ctx.fillStyle = 'rgba(255,215,94,0.85)';
  ctx.beginPath();
  ctx.moveTo(ex + ux * 5 * z, ey + uy * 5 * z);
  ctx.lineTo(ex - uy * 4 * z, ey + ux * 4 * z);
  ctx.lineTo(ex + uy * 4 * z, ey - ux * 4 * z);
  ctx.closePath(); ctx.fill();
}

function paintPlayer() {
  const p = S.player, z = S.cam.zoom;
  const { x, y } = isoPoint(p.fx, p.fy, S.cam);
  const bob = p.path.length ? Math.abs(Math.sin(p.walkT * 10)) * 2 * z : 0;
  const gy = y + 6 * z - bob;
  Atlas.draw(ctx, 'player', x, gy, z, p.frame, p.dir);
  // Perkakas di tangan kanan, berayun saat bekerja.
  const tool = TOOLS[p.tool].sprite;
  const sw = p.swing > 0 ? Math.sin(p.swing * 9) * 0.7 : 0;
  ctx.save();
  ctx.translate(x + 9 * z, gy - 30 * z);
  ctx.rotate(-0.5 + sw);
  Atlas.draw(ctx, tool, 0, 10 * z, z * 0.8);
  ctx.restore();
  // Bawaan dipanggul di bahu kiri.
  if (carriedTotal() > 0) Atlas.draw(ctx, 'crate', x - 11 * z, gy - 34 * z, z * 0.55);
}

function paintMiniBar(x, y, z, frac) {
  const w = 34 * z, h = 5 * z;
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x - w / 2, y, w, h);
  ctx.fillStyle = '#5eff8a';
  ctx.fillRect(x - w / 2, y, w * Math.min(1, Math.max(0, frac)), h);
}

function render() {
  const z = S.cam.zoom;
  const bg = ctx.createLinearGradient(0, 0, 0, VH);
  bg.addColorStop(0, '#0b0912'); bg.addColorStop(1, '#16102a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, VW, VH);
  for (const st of STARS) {
    ctx.globalAlpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(S.time * 2 + st.p));
    ctx.fillStyle = '#e8e4f5';
    ctx.beginPath(); ctx.arc(st.x * VW, st.y * VH, st.r, 0, 6.29); ctx.fill();
  }
  ctx.globalAlpha = 1;

  const glows = [];
  const onPlot = S.map === 'plot';
  const gate = onPlot ? gatePos() : null;
  const playerS = Math.floor(S.player.fx + S.player.fy);
  let playerDrawn = false;
  for (let s = 0; s <= GRID_W + GRID_H - 2; s++) {
    for (let gx = 0; gx < GRID_W; gx++) {
      const gy = s - gx;
      if (gy < 0 || gy >= GRID_H) continue;
      const t = S.grid[gy][gx];
      const { x, y } = tileCenter(gx, gy, S.cam);
      if (x < -90 || x > VW + 90 || y < -90 || y > VH + 90) continue;
      const ground = t.t === 'sand' ? 'sand' : t.t === 'clay' ? 'clay'
        : t.t === 'water' ? 'water' : t.t === 'bridge' ? 'bridge'
        : t.t === 'platform' ? 'platform' : t.t === 'dock' ? 'dock'
        : t.t === 'road' ? 'road' : t.t === 'railX' ? 'railX'
        : t.t === 'railY' ? 'railY' : t.t === 'railStop' ? 'railStop'
        : 'grass' + Math.floor(hash2(gx, gy) * 4);
      Atlas.drawTile(ctx, ground, x, y, z);

      const conv = onPlot ? S.conveyors.get(key(gx, gy)) : null;
      if (conv) {
        // Belt itu rata dengan lantai: pakai drawTile (jangkar tengah petak).
        // draw() berjangkar alas sel, mengangkat belah ketupat belt 26px
        // ke atas sehingga item dan panah alir terlihat ngambang di rumput.
        Atlas.drawTile(ctx, conv.id, x, y, z);
        paintBeltFlow(x, y, z, conv.dir);
        if (conv.item) {
          const [ax, ay] = BELT_AXIS[conv.dir];
          const len = Math.hypot(ax, ay);
          const ix = x + (ax / len) * (conv.t - 0.5) * 22 * z;
          const iy = y + (ay / len) * (conv.t - 0.5) * 22 * z - 4 * z;
          ctx.fillStyle = ITEMS[conv.item].color;
          ctx.fillRect(ix - 4 * z, iy - 4 * z, 8 * z, 8 * z);
          ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.strokeRect(ix - 4 * z, iy - 4 * z, 8 * z, 8 * z);
        }
      }

      const pulse = S.pulses.get(key(gx, gy));
      let scale = 1;
      if (pulse !== undefined) {
        const p = (S.time - pulse) / 0.3;
        if (p < 1) scale = 1 + 0.12 * Math.sin(p * Math.PI);
        else S.pulses.delete(key(gx, gy));
      }
      ctx.save();
      if (scale !== 1) { ctx.translate(x, y); ctx.scale(scale, scale); ctx.translate(-x, -y); }
      if (t.obj && !t.obj.startsWith('shop')) {
        // Node habis (hp 0) hilang sampai tumbuh lagi; pohon menyisakan tunggul.
        const dead = NODES[t.obj] && t.hp <= 0;
        if (!dead || t.obj === 'tree') {
          const sprite = t.obj === 'tree' && dead ? 'stump' : t.obj;
          if (sprite === 'plotpad') {
            Atlas.drawTile(ctx, 'plotpad', x, y, z);
          } else {
            Atlas.draw(ctx, sprite, x, y + 6 * z, z);
            if (t.obj === 'mayor') {
              ctx.font = '700 ' + Math.max(11, Math.round(12 * z)) + 'px system-ui, sans-serif';
              ctx.textAlign = 'center';
              ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
              ctx.strokeText('Mayor', x, y - 56 * z);
              ctx.fillStyle = '#ffd75e'; ctx.fillText('Mayor', x, y - 56 * z);
            }
            if (t.obj === 'station') {
              ctx.font = '700 ' + Math.max(11, Math.round(12 * z)) + 'px system-ui, sans-serif';
              ctx.textAlign = 'center';
              ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
              ctx.strokeText('Stasiun', x, y - 56 * z);
              ctx.fillStyle = '#ffd75e'; ctx.fillText('Stasiun', x, y - 56 * z);
            }
          }
          if (GLOWS[t.obj]) { const [dx, dy, r, a] = GLOWS[t.obj]; glows.push({ x: x + dx * z, y: y + dy * z, r: r * z, a }); }
        }
      }
      if (t.obj && t.obj.startsWith('shop')) {
        Atlas.draw(ctx, 'shop', x, y + 6 * z, z);
        const label = SHOPS[t.obj.slice(5)] ? SHOPS[t.obj.slice(5)].name : '';
        ctx.font = '700 ' + Math.max(11, Math.round(12 * z)) + 'px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.strokeText(label, x, y - 56 * z);
        ctx.fillStyle = '#ffd75e'; ctx.fillText(label, x, y - 56 * z);
      }
      if (gate && gx === gate.gx && gy === gate.gy) Atlas.draw(ctx, 'gate', x, y + 6 * z, z);
      const m = onPlot ? S.machines.get(key(gx, gy)) : null;
      if (m) {
        Atlas.draw(ctx, m.id, x, y + 6 * z, z);
        paintDirArrow(x, y, z, m.dir);
        if (GLOWS[m.id]) { const [dx, dy, r, a] = GLOWS[m.id]; glows.push({ x: x + dx * z, y: y + dy * z, r: r * z, a }); }
        if (m.id === 'smelter') {
          for (let i = 0; i < 3; i++) {
            const rise = (S.time * 9 + i * 14) % 42;
            ctx.globalAlpha = 0.35 * (1 - rise / 42);
            ctx.fillStyle = '#9aa3ad';
            ctx.beginPath(); ctx.arc(x + 11 * z + rise * 0.3 * z, y - 54 * z - rise * z, (4 + rise * 0.14) * z, 0, 6.29); ctx.fill();
            ctx.globalAlpha = 1;
          }
        }
        if (m.progress > 0 && !m.stopped) paintMiniBar(x, y - 52 * z, z, m.progress);
      }
      const st = onPlot ? S.storages.get(key(gx, gy)) : null;
      if (st) Atlas.draw(ctx, st.id, x, y + 6 * z, z);
      const w = onPlot ? S.walls.get(key(gx, gy)) : null;
      if (w) Atlas.draw(ctx, w.id, x, y + 6 * z, z);
      const d = onPlot ? S.decor.get(key(gx, gy)) : null;
      if (d) {
        Atlas.draw(ctx, d.id, x, y + 6 * z, z);
        if (GLOWS[d.id]) { const [dx, dy, r, a] = GLOWS[d.id]; glows.push({ x: x + dx * z, y: y + dy * z, r: r * z, a }); }
      }
      ctx.restore();
    }
    if (!playerDrawn && s >= playerS) { paintPlayer(); playerDrawn = true; }
  }
  if (!playerDrawn) paintPlayer();

  ctx.globalCompositeOperation = 'lighter';
  for (const g of glows) glow(g.x, g.y, g.r, g.a);
  ctx.globalCompositeOperation = 'source-over';

  for (const f of FLIES) {
    const bx = tileCenter(f.gx, f.gy, S.cam);
    const fx = bx.x + Math.sin(S.time * f.s + f.p) * 22 * z;
    const fy = bx.y - 14 * z + Math.cos(S.time * f.s * 0.8 + f.p) * 10 * z;
    ctx.globalAlpha = 0.35 + 0.55 * (0.5 + 0.5 * Math.sin(S.time * 2.2 + f.p * 3));
    ctx.fillStyle = '#ffe89a';
    ctx.beginPath(); ctx.arc(fx, fy, 1.8 * z, 0, 6.29); ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (S.hover && inGrid(S.hover.gx, S.hover.gy)) {
    const { x, y } = tileCenter(S.hover.gx, S.hover.gy, S.cam);
    diamondPath(x, y, TILE_W * z, TILE_H * z);
    ctx.fillStyle = 'rgba(255,215,94,0.12)'; ctx.fill();
    ctx.strokeStyle = '#ffd75e'; ctx.lineWidth = 2; ctx.stroke();
  }
  if (S.selected) {
    const [gx, gy] = S.selected.split(',').map(Number);
    const { x, y } = tileCenter(gx, gy, S.cam);
    diamondPath(x, y, TILE_W * z, TILE_H * z);
    ctx.strokeStyle = '#7fb8ff'; ctx.lineWidth = 2.5; ctx.stroke();
  }

  if (S.placing && S.hover && inGrid(S.hover.gx, S.hover.gy)) {
    const { x, y } = tileCenter(S.hover.gx, S.hover.gy, S.cam);
    const ok = canPlace(S.hover.gx, S.hover.gy, S.placing);
    diamondPath(x, y, TILE_W * z, TILE_H * z);
    ctx.fillStyle = ok ? 'rgba(94,255,138,0.25)' : 'rgba(255,80,80,0.25)'; ctx.fill();
    ctx.strokeStyle = ok ? '#5eff8a' : '#ff5050'; ctx.lineWidth = 2; ctx.stroke();
    if (ok) {
      if (S.placing.kind === 'conveyor') Atlas.drawTile(ctx, S.placing.id, x, y, z, 0.55);
      else Atlas.draw(ctx, S.placing.id, x, y + 6 * z, z, 0, 0, 0.55);
      if (S.placing.kind === 'machine' || S.placing.kind === 'conveyor') paintDirArrow(x, y, z, S.placeDir);
    }
  }

  const vg = ctx.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * 0.35, VW / 2, VH / 2, Math.max(VW, VH) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,3,10,0.45)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, VW, VH);

  ctx.textAlign = 'center';
  ctx.font = '700 ' + Math.max(13, Math.round(14 * z)) + 'px system-ui, sans-serif';
  for (const f of S.floaters) {
    if (f.map && f.map !== S.map) continue;
    const p = (S.time - f.born) / 0.9;
    if (p >= 1) continue;
    const { x, y } = tileCenter(f.gx, f.gy, S.cam);
    const fy = y - 26 * z - p * 36;
    ctx.globalAlpha = 1 - p;
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    ctx.strokeText(f.text, x, fy);
    ctx.fillStyle = f.color; ctx.fillText(f.text, x, fy);
  }
  ctx.globalAlpha = 1;
}

// Aturan taruh: hanya di plot, rumput kosong; gerbang tidak boleh ditutup.
function canPlace(gx, gy, placing) {
  if (S.map !== 'plot') return false;
  const t = tileAt(gx, gy);
  if (!t || t.obj) return false;
  const g = gatePos();
  if (gx === g.gx && gy === g.gy) return false;
  const k = key(gx, gy);
  if (S.machines.has(k) || S.storages.has(k) || S.walls.has(k) || S.decor.has(k) || S.conveyors.has(k)) return false;
  if (placing && placing.kind === 'conveyor') return t.t === 'grass';
  return t.t === 'grass';
}
