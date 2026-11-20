// Ubin tanah: rumput, pasir, clay, air, jembatan, peron, dermaga,
// jalan, rel. v48: palet cozy — hijau cerah, tanah hangat, tanpa garis hitam.
Object.assign(PAINTERS, {
  grass0: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#A6D96A'),
  grass1: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#B4DF7C', '#FFFFFF'),
  grass2: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#9BCF62'),
  grass3: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#C4E88C', '#F3C9B8'),
  sand: (g, ox, oy, c) => P_ground(g, ox + 32, oy + 32, '#E7CFA0', 'rgba(160,120,70,0.35)'),
  clay: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#C98A6A');
    g.fillStyle = '#B07257';
    g.beginPath(); g.ellipse(ox + 25, oy + 32, 7, 3.5, 0, 0, 6.29); g.fill();
    g.beginPath(); g.ellipse(ox + 40, oy + 34, 5, 2.5, 0, 0, 6.29); g.fill();
  },
  water: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#55B8E2');
    g.fillStyle = 'rgba(55,150,198,0.45)';
    g.beginPath(); g.ellipse(ox + 32, oy + 32, 16, 7, 0, 0, 6.29); g.fill();
    g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(ox + 14, oy + 30); g.lineTo(ox + 26, oy + 36); g.stroke();
    g.beginPath(); g.moveTo(ox + 38, oy + 28); g.lineTo(ox + 50, oy + 34); g.stroke();
  },
  bridge: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#55B8E2');
    g.fillStyle = '#C79A6B';
    g.beginPath();
    g.moveTo(ox + 4, oy + 32); g.lineTo(ox + 32, oy + 18); g.lineTo(ox + 60, oy + 32); g.lineTo(ox + 32, oy + 46); g.closePath(); g.fill();
    g.fillStyle = '#B57A4E';
    for (const dy of [-8, 0, 8]) {
      g.beginPath();
      g.moveTo(ox + 24, oy + 32 + dy); g.lineTo(ox + 32, oy + 28 + dy); g.lineTo(ox + 40, oy + 32 + dy); g.lineTo(ox + 32, oy + 36 + dy); g.closePath(); g.fill();
    }
  },
  // Peron cuma dekorasi: batu terang polos, tanpa aksen.
  platform: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#C9C6C0');
  },
  dock: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#55B8E2');
    g.fillStyle = '#B57A4E';
    g.beginPath();
    g.moveTo(ox + 6, oy + 32); g.lineTo(ox + 32, oy + 19); g.lineTo(ox + 58, oy + 32); g.lineTo(ox + 32, oy + 45); g.closePath(); g.fill();
    g.strokeStyle = '#C79A6B'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(ox + 18, oy + 32); g.lineTo(ox + 32, oy + 25); g.lineTo(ox + 46, oy + 32); g.lineTo(ox + 32, oy + 39); g.closePath(); g.stroke();
  },
  // Jalan tanah: dasar hangat, dua alur roda, kerikil. Tanpa pagar/sumur:
  // dulu tiap petak jalan punya sumur sendiri — itu salah.
  road: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#DEBB86');
    g.strokeStyle = 'rgba(194,154,99,0.85)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 18, oy + 25); g.lineTo(ox + 46, oy + 39); g.stroke();
    g.beginPath(); g.moveTo(ox + 18, oy + 31); g.lineTo(ox + 46, oy + 45); g.stroke();
    g.fillStyle = 'rgba(194,154,99,0.6)';
    [[-10, -3], [2, -6], [9, 2], [-3, 5], [6, 6]].forEach(([dx, dy]) => g.fillRect(ox + 32 + dx, oy + 32 + dy, 2.5, 2.5));
  },
  // Rel searah sumbu-x: garis baja sejajar diagonal belah ketupat, sambung antar petak.
  railX: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#C9C6C0');
    g.strokeStyle = '#B9AE93'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 13, oy + 26); g.lineTo(ox + 44, oy + 41); g.stroke();
    g.beginPath(); g.moveTo(ox + 20, oy + 23); g.lineTo(ox + 51, oy + 38); g.stroke();
    g.strokeStyle = '#8B7355'; g.lineWidth = 3;
    [[26, 24, 22, 32], [34, 28, 30, 36], [42, 32, 38, 40]].forEach(([x1, y1, x2, y2]) => {
      g.beginPath(); g.moveTo(ox + x1, oy + y1); g.lineTo(ox + x2, oy + y2); g.stroke();
    });
  },
  railY: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#C9C6C0');
    g.strokeStyle = '#B9AE93'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 51, oy + 26); g.lineTo(ox + 20, oy + 41); g.stroke();
    g.beginPath(); g.moveTo(ox + 44, oy + 23); g.lineTo(ox + 13, oy + 38); g.stroke();
    g.strokeStyle = '#8B7355'; g.lineWidth = 3;
    [[38, 24, 42, 32], [30, 28, 34, 36], [22, 32, 26, 40]].forEach(([x1, y1, x2, y2]) => {
      g.beginPath(); g.moveTo(ox + x1, oy + y1); g.lineTo(ox + x2, oy + y2); g.stroke();
    });
  },
  // Tikungan L: kaki timur (arah railX) bertemu kaki utara (arah railY).
  railBend: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#C9C6C0');
    g.strokeStyle = '#B9AE93'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 32, oy + 35); g.lineTo(ox + 44, oy + 41); g.stroke();
    g.beginPath(); g.moveTo(ox + 32, oy + 29); g.lineTo(ox + 51, oy + 38); g.stroke();
    g.beginPath(); g.moveTo(ox + 32, oy + 35); g.lineTo(ox + 51, oy + 26); g.stroke();
    g.beginPath(); g.moveTo(ox + 32, oy + 29); g.lineTo(ox + 44, oy + 23); g.stroke();
    g.strokeStyle = '#8B7355'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(ox + 42, oy + 32); g.lineTo(ox + 38, oy + 40); g.stroke();
    g.beginPath(); g.moveTo(ox + 38, oy + 24); g.lineTo(ox + 42, oy + 32); g.stroke();
  },
  // Ujung rel (terminus): rel seperti railY + palang merah di ujung atas.
  railStop: (g, ox, oy, c) => {
    P_ground(g, ox + 32, oy + 32, '#C9C6C0');
    g.strokeStyle = '#B9AE93'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(ox + 51, oy + 26); g.lineTo(ox + 20, oy + 41); g.stroke();
    g.beginPath(); g.moveTo(ox + 44, oy + 23); g.lineTo(ox + 13, oy + 38); g.stroke();
    g.strokeStyle = '#8B7355'; g.lineWidth = 3;
    [[38, 24, 42, 32], [30, 28, 34, 36], [22, 32, 26, 40]].forEach(([x1, y1, x2, y2]) => {
      g.beginPath(); g.moveTo(ox + x1, oy + y1); g.lineTo(ox + x2, oy + y2); g.stroke();
    });
    g.strokeStyle = '#D2503F'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(ox + 41, oy + 20); g.lineTo(ox + 54, oy + 27); g.stroke();
  },
});