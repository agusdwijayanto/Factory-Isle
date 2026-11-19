// Ikon barang untuk tas dan panel. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
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
  // v29: ikon barang baru (kain, kaleng cat, roda, cetakan, laras, meriam,
  // tempat tidur, piano). Tengah di (cx, cy), muat di dalam sel 64.
  item_Textiles: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#f2ede0';
    g.fillRect(cx - 15, cy - 10, 30, 8); g.fillRect(cx - 15, cy, 30, 8); g.fillRect(cx - 15, cy + 10, 30, 8);
    g.strokeStyle = '#d8d2c2'; g.lineWidth = 1.5;
    for (const dy of [-10, 0, 10]) g.strokeRect(cx - 15, cy + dy, 30, 8);
  },
  item_DyedTextiles: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#e07b9d';
    g.fillRect(cx - 15, cy - 10, 30, 8); g.fillRect(cx - 15, cy, 30, 8); g.fillRect(cx - 15, cy + 10, 30, 8);
    g.strokeStyle = '#b85a78'; g.lineWidth = 1.5;
    for (const dy of [-10, 0, 10]) g.strokeRect(cx - 15, cy + dy, 30, 8);
    g.fillStyle = '#f2ede0'; g.fillRect(cx - 15, cy - 10, 30, 2);
  },
  item_DyeCan: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#8d99a8'; g.fillRect(cx - 11, cy - 14, 22, 30);
    g.fillStyle = '#5d6773'; g.fillRect(cx - 11, cy - 14, 22, 5);
    g.fillStyle = '#4fae9d'; g.fillRect(cx - 8, cy - 11, 16, 6);
    g.fillStyle = '#4fae9d';
    g.beginPath(); g.arc(cx + 4, cy + 14, 3, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx - 5, cy + 17, 2, 0, 6.29); g.fill();
    g.strokeStyle = '#c9a86a'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx + 8, cy - 14); g.lineTo(cx + 8, cy + 2); g.stroke();
  },
  item_Wheel: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#3a3f47';
    g.beginPath(); g.arc(cx, cy, 15, 0, 6.29); g.fill();
    g.fillStyle = '#8d99a8';
    g.beginPath(); g.arc(cx, cy, 10, 0, 6.29); g.fill();
    g.strokeStyle = '#3a3f47'; g.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * 10, cy + Math.sin(a) * 10); g.stroke();
    }
    g.fillStyle = '#5d6773'; g.beginPath(); g.arc(cx, cy, 3.5, 0, 6.29); g.fill();
  },
  item_CannonMold: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#e8d9a0';
    g.beginPath();
    g.moveTo(cx - 15, cy + 12); g.lineTo(cx - 10, cy - 12);
    g.lineTo(cx + 10, cy - 12); g.lineTo(cx + 15, cy + 12); g.closePath(); g.fill();
    g.fillStyle = '#3a3f47';
    g.beginPath(); g.ellipse(cx, cy + 2, 7, 4, 0, 0, 6.29); g.fill();
    g.fillRect(cx - 2, cy - 12, 4, 12);
    g.strokeStyle = '#c9a86a'; g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(cx - 15, cy + 12); g.lineTo(cx + 15, cy + 12); g.stroke();
  },
  item_CannonBarrel: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#3a3f47'; g.fillRect(cx - 16, cy - 6, 32, 12);
    g.fillStyle = '#5d6773'; g.fillRect(cx - 16, cy - 6, 32, 3);
    g.fillStyle = '#2c2833';
    g.fillRect(cx - 16, cy - 8, 5, 16); g.fillRect(cx - 2, cy - 8, 4, 16); g.fillRect(cx + 11, cy - 8, 5, 16);
    g.fillStyle = '#c98f2e'; g.fillRect(cx - 16, cy - 6, 3, 12);
  },
  item_BronzeCannon: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#c98f2e';
    g.beginPath(); g.ellipse(cx, cy - 6, 15, 5, -0.3, 0, 6.29); g.fill();
    g.fillStyle = '#9a6a1e'; g.fillRect(cx - 14, cy - 4, 28, 4);
    g.fillStyle = '#3a3f47';
    g.beginPath(); g.arc(cx - 9, cy + 8, 5, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 9, cy + 8, 5, 0, 6.29); g.fill();
    g.fillStyle = '#5f3d22'; g.fillRect(cx - 12, cy + 2, 24, 4);
  },
  item_Bed: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#7a5230'; g.fillRect(cx - 15, cy - 4, 30, 12);
    g.fillStyle = '#f2ede0'; g.fillRect(cx - 15, cy - 8, 30, 8);
    g.fillStyle = '#e07b9d'; g.fillRect(cx - 15, cy - 2, 30, 4);
    g.fillStyle = '#a8763e'; g.fillRect(cx - 15, cy - 14, 4, 10); g.fillRect(cx + 11, cy - 14, 4, 10);
    g.fillStyle = '#f2ede0'; g.fillRect(cx - 13, cy - 13, 10, 5);
  },
  item_Piano: (g, ox, oy) => {
    const cx = ox + 32, cy = oy + 32;
    g.fillStyle = '#2c2833';
    g.fillRect(cx - 15, cy - 10, 30, 8); g.fillRect(cx - 15, cy - 2, 22, 10);
    g.fillStyle = '#f2ede0'; g.fillRect(cx - 15, cy + 8, 22, 5);
    g.fillStyle = '#2c2833';
    for (let i = 0; i < 5; i++) g.fillRect(cx - 13 + i * 4, cy + 8, 2, 5);
    g.fillRect(cx - 12, cy + 13, 3, 5); g.fillRect(cx + 9, cy + 13, 3, 5);
  },
});
