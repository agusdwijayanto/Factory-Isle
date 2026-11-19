// Ubin tanah: rumput, pasir, clay, air, jembatan, peron, dermaga,
// jalan, rel. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
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
  // Peron cuma dekorasi: abu-abu polos, tanpa aksen.
  platform: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#8d99a8');
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
  // Tikungan L: kaki timur (arah railX) bertemu kaki utara (arah railY).
  railBend: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#6e6a72');
    g.strokeStyle = '#d7dbe0'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 32, oy + 35); g.lineTo(ox + 44, oy + 41); g.stroke();
    g.beginPath(); g.moveTo(ox + 32, oy + 29); g.lineTo(ox + 51, oy + 38); g.stroke();
    g.beginPath(); g.moveTo(ox + 32, oy + 35); g.lineTo(ox + 51, oy + 26); g.stroke();
    g.beginPath(); g.moveTo(ox + 32, oy + 29); g.lineTo(ox + 44, oy + 23); g.stroke();
    g.strokeStyle = '#4a464e'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(ox + 42, oy + 32); g.lineTo(ox + 38, oy + 40); g.stroke();
    g.beginPath(); g.moveTo(ox + 38, oy + 24); g.lineTo(ox + 42, oy + 32); g.stroke();
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
});
