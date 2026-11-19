// Mesin, conveyor, storage, dinding, peti. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
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
  // v29: mesin baru. Konvensi sama: alas di oy+62, muat di dalam sel 64.
  elecSaw: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 15);
    g.fillStyle = '#5f3d22';
    g.fillRect(cx - 14, gy - 16, 4, 16); g.fillRect(cx + 10, gy - 16, 4, 16);
    g.fillStyle = '#a8763e'; g.fillRect(cx - 17, gy - 19, 34, 4);
    g.fillStyle = '#c9a86a';
    g.beginPath(); g.arc(cx, gy - 28, 11, 0, 6.29); g.fill();
    g.strokeStyle = '#8d99a8'; g.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.beginPath(); g.moveTo(cx + Math.cos(a) * 11, gy - 28 + Math.sin(a) * 11);
      g.lineTo(cx + Math.cos(a) * 14, gy - 28 + Math.sin(a) * 14); g.stroke();
    }
    g.fillStyle = '#5d6773'; g.beginPath(); g.arc(cx, gy - 28, 4, 0, 6.29); g.fill();
    g.fillStyle = '#e8b64c'; g.fillRect(cx + 8, gy - 24, 8, 8);
  },
  advSaw: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    P_isoBox(g, cx, gy, 38, 12, '#8a5a33', '#5f3d22', '#4a2f1a');
    g.fillStyle = '#e8b64c';
    g.beginPath(); g.arc(cx, gy - 26, 13, 0, 6.29); g.fill();
    g.strokeStyle = '#8d99a8'; g.lineWidth = 2;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      g.beginPath(); g.moveTo(cx + Math.cos(a) * 13, gy - 26 + Math.sin(a) * 13);
      g.lineTo(cx + Math.cos(a) * 16, gy - 26 + Math.sin(a) * 16); g.stroke();
    }
    g.fillStyle = '#3a3f47'; g.beginPath(); g.arc(cx, gy - 26, 5, 0, 6.29); g.fill();
    g.fillStyle = '#ffd75e'; g.beginPath(); g.arc(cx, gy - 26, 2, 0, 6.29); g.fill();
  },
  textiles: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    g.fillStyle = '#5f3d22';
    g.fillRect(cx - 16, gy - 30, 4, 30); g.fillRect(cx + 12, gy - 30, 4, 30);
    g.fillRect(cx - 16, gy - 32, 32, 4);
    g.strokeStyle = '#f2ede0'; g.lineWidth = 1.5;
    for (let i = -2; i <= 2; i++) {
      g.beginPath(); g.moveTo(cx + i * 6, gy - 28); g.lineTo(cx + i * 6, gy - 8); g.stroke();
    }
    g.fillStyle = '#e07b9d'; g.fillRect(cx - 12, gy - 14, 24, 7);
    g.fillStyle = '#f2ede0'; g.fillRect(cx - 12, gy - 14, 24, 2);
  },
  drill: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    g.strokeStyle = '#5d6773'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(cx - 14, gy); g.lineTo(cx - 4, gy - 34); g.stroke();
    g.beginPath(); g.moveTo(cx + 14, gy); g.lineTo(cx + 4, gy - 34); g.stroke();
    g.beginPath(); g.moveTo(cx - 14, gy); g.lineTo(cx + 14, gy); g.stroke();
    g.beginPath(); g.moveTo(cx - 9, gy - 17); g.lineTo(cx + 9, gy - 17); g.stroke();
    g.strokeStyle = '#8d99a8'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx, gy - 34); g.lineTo(cx, gy - 8); g.stroke();
    g.fillStyle = '#e07b39';
    g.beginPath(); g.moveTo(cx - 3, gy - 8); g.lineTo(cx + 3, gy - 8); g.lineTo(cx, gy - 2); g.closePath(); g.fill();
    P_isoBox(g, cx, gy, 20, 8, '#8d99a8', '#5d6773', '#49525c');
  },
  harvester: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 16);
    P_isoBox(g, cx, gy, 36, 14, '#4fae6b', '#357a38', '#2a5f2e');
    g.fillStyle = '#2c2833'; g.fillRect(cx - 14, gy - 24, 12, 8);
    g.fillStyle = '#c9a86a';
    g.beginPath(); g.arc(cx + 10, gy - 12, 8, 0, 6.29); g.fill();
    g.strokeStyle = '#8d99a8'; g.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      g.beginPath(); g.moveTo(cx + 10 + Math.cos(a) * 8, gy - 12 + Math.sin(a) * 8);
      g.lineTo(cx + 10 + Math.cos(a) * 11, gy - 12 + Math.sin(a) * 11); g.stroke();
    }
    g.fillStyle = '#3a3f47'; g.beginPath(); g.arc(cx + 10, gy - 12, 3, 0, 6.29); g.fill();
  },
  treeGen: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 14);
    P_isoBox(g, cx, gy, 30, 10, '#a8763e', '#7a5230', '#5f3d22');
    g.strokeStyle = '#357a38'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx, gy - 10); g.lineTo(cx, gy - 26); g.stroke();
    g.fillStyle = '#4fae6b';
    g.beginPath(); g.arc(cx - 5, gy - 26, 5, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 5, gy - 28, 5, 0, 6.29); g.fill();
    g.fillStyle = '#ffd75e'; g.beginPath(); g.arc(cx, gy - 30, 2, 0, 6.29); g.fill();
  },
  crafter: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 62;
    P_shadow(g, cx, gy, 17);
    P_isoBox(g, cx, gy, 40, 12, '#8d99a8', '#5d6773', '#49525c');
    g.fillStyle = '#3a3f47';
    g.beginPath();
    g.moveTo(cx - 12, gy - 18); g.lineTo(cx + 10, gy - 18);
    g.lineTo(cx + 6, gy - 12); g.lineTo(cx - 8, gy - 12); g.closePath(); g.fill();
    g.fillStyle = '#c98f2e'; g.fillRect(cx - 3, gy - 24, 14, 5);
    g.strokeStyle = '#e8b64c'; g.lineWidth = 2;
    g.beginPath(); g.arc(cx + 10, gy - 26, 6, 0, 6.29); g.stroke();
  },
});
