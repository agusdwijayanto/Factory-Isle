// Node panen dan hiasan alam: pohon, tunggul, bijih, kapas, lentera,
// bunga, wagon, patung, badge, tanda plot, camp + prop kota (v48).
Object.assign(PAINTERS, {
  tree: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 15);
    g.fillStyle = P_shade('#9A7048', 0.95); g.fillRect(cx - 3, gy - 15, 6, 15);
    g.strokeStyle = P_OL; g.lineWidth = 1; g.strokeRect(cx - 3, gy - 15, 6, 15);
    g.fillStyle = P_shade('#7CC46E', 0.98); g.beginPath(); g.arc(cx, gy - 31, 14, 0, 6.29); g.fill();
    g.fillStyle = P_shade('#7CC46E', 0.86); g.beginPath(); g.arc(cx - 9, gy - 22, 9.5, 0, 6.29); g.fill();
    g.fillStyle = P_shade('#7CC46E', 0.70); g.beginPath(); g.arc(cx + 9, gy - 22, 9.5, 0, 6.29); g.fill();
    g.fillStyle = P_shade('#7CC46E', 1.14); g.beginPath(); g.arc(cx - 5, gy - 36, 7, 0, 6.29); g.fill();
    g.strokeStyle = 'rgba(104,86,62,0.35)'; g.lineWidth = 1;
    g.beginPath(); g.arc(cx, gy - 31, 14, 0, 6.29); g.stroke();
  },
  stump: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 8);
    g.fillStyle = P_shade('#9A7048', 0.9); g.fillRect(cx - 6, gy - 7, 12, 7);
    g.fillStyle = P_shade('#D9B27A', 1.0);
    g.beginPath(); g.ellipse(cx, gy - 7, 6, 2.8, 0, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1;
    g.beginPath(); g.ellipse(cx, gy - 7, 6, 2.8, 0, 0, 6.29); g.stroke();
  },
  oreIron: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#E07B39'),
  oreCopper: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#4FAE9D'),
  oreTin: (g, ox, oy) => PAINTERS._ore(g, ox, oy, '#D8E2E8'),
  _ore: (g, ox, oy, color) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 14);
    g.fillStyle = P_shade('#A9AFB3', 0.98);
    g.beginPath();
    g.moveTo(cx - 14, gy); g.lineTo(cx - 9, gy - 14); g.lineTo(cx + 3, gy - 18);
    g.lineTo(cx + 13, gy - 8); g.lineTo(cx + 14, gy); g.closePath(); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = P_shade('#A9AFB3', 0.78);
    g.beginPath();
    g.moveTo(cx + 3, gy - 18); g.lineTo(cx + 13, gy - 8);
    g.lineTo(cx + 14, gy); g.lineTo(cx + 2, gy); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = color;
    [[-7, -8], [2, -12], [7, -5]].forEach(([dx, dy]) => g.fillRect(cx + dx, gy + dy, 3.5, 3.5));
  },
  cotton: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 11);
    g.strokeStyle = P_shade('#6FAE5E', 0.95); g.lineWidth = 1.6;
    [[-8, 0], [0, -3], [8, 0]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + dx, gy); g.lineTo(cx + dx, gy - 12 + dy); g.stroke();
    });
    g.fillStyle = '#FBF7EC';
    [[-8, -13], [0, -16], [8, -13], [-4, -10], [4, -10]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 4, 0, 6.29); g.fill();
    });
  },
  lantern: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 6);
    g.fillStyle = P_shade('#6B4A32', 0.85); g.fillRect(cx - 1.5, gy - 26, 3, 26);
    g.fillStyle = '#FFE89B'; g.fillRect(cx - 4, gy - 33, 8, 8);
    g.strokeStyle = P_shade('#6B4A32', 0.8); g.lineWidth = 1.5; g.strokeRect(cx - 4, gy - 33, 8, 8);
  },
  flowers: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    g.strokeStyle = P_shade('#6FAE5E', 0.95); g.lineWidth = 1.5;
    [[-9, -8], [0, -11], [9, -8]].forEach(([dx, dy]) => {
      g.beginPath(); g.moveTo(cx + dx, gy); g.lineTo(cx + dx, gy + dy); g.stroke();
    });
    g.fillStyle = '#E88BB0';
    [[-9, -9], [0, -12], [9, -9]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 3, 0, 6.29); g.fill();
    });
    g.fillStyle = '#FFF3C4';
    [[-9, -9], [0, -12], [9, -9]].forEach(([dx, dy]) => {
      g.beginPath(); g.arc(cx + dx, gy + dy, 1.2, 0, 6.29); g.fill();
    });
  },

  // ---- v35: wagon ----
  wagon: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 18);
    // kuda
    g.fillStyle = P_shade('#B07E52', 0.98);
    g.beginPath(); g.ellipse(cx + 13, gy - 17, 9.5, 6.5, 0, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = P_shade('#B07E52', 1.02);
    g.beginPath(); g.arc(cx + 21, gy - 25, 4.8, 0, 6.29); g.fill(); g.stroke();
    g.fillStyle = P_shade('#8A6242', 0.95); g.fillRect(cx + 19, gy - 31, 4.5, 6.5);
    g.strokeStyle = P_shade('#8A6242', 0.9); g.lineWidth = 2;
    [[9, 0], [15, 0], [11, -2], [17, -2]].forEach(([dx]) => {
      g.beginPath(); g.moveTo(cx + dx, gy - 12); g.lineTo(cx + dx, gy); g.stroke();
    });
    // kanvas conestoga
    g.fillStyle = '#FBF7EC';
    g.beginPath(); g.ellipse(cx - 8, gy - 27, 14.5, 10.5, 0, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1.2; g.stroke();
    g.strokeStyle = P_shade('#F0B94E', 1.0); g.lineWidth = 1.4;
    g.beginPath(); g.ellipse(cx - 8, gy - 25, 12.5, 6.5, 0, 0, 6.29); g.stroke();
    // peti + roda
    P_box(g, cx - 10, gy - 14, 26, 10, '#C79A6B');
    g.fillStyle = P_shade('#3A4148', 1.15);
    g.beginPath(); g.arc(cx - 17, gy - 1, 4.4, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx - 4, gy - 1, 4.4, 0, 6.29); g.fill();
    g.strokeStyle = P_shade('#9A7048', 0.85); g.lineWidth = 1.5;
    g.beginPath(); g.moveTo(cx + 5, gy - 16); g.lineTo(cx + 8, gy - 13); g.stroke();
    // muatan
    g.fillStyle = '#FDF6E7'; g.fillRect(cx - 16, gy - 30, 16, 6);
    g.strokeStyle = P_OL; g.lineWidth = 1; g.strokeRect(cx - 16, gy - 30, 16, 6);
    g.fillStyle = '#5A4432'; g.font = '700 6px system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText('0 / 15', cx - 8, gy - 25.5);
  },

  // ---- v48: prop kota kecil (tidak memblokir jalan) ----
  planter: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 8);
    P_box(g, cx, gy, 16, 8, '#C79A6B');
    g.fillStyle = P_shade('#7CC46E', 1.0);
    g.beginPath(); g.arc(cx - 3, gy - 12, 4.5, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 3, gy - 13, 4, 0, 6.29); g.fill();
    g.fillStyle = '#E88BB0';
    g.beginPath(); g.arc(cx - 3, gy - 14, 1.8, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 4, gy - 15, 1.6, 0, 6.29); g.fill();
  },
  lamppost: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 6);
    g.fillStyle = P_shade('#6B4A32', 0.8); g.fillRect(cx - 1.5, gy - 28, 3, 28);
    P_box(g, cx, gy - 27, 10, 4, '#6B4A32');
    g.fillStyle = '#FFE89B'; g.fillRect(cx - 3.5, gy - 38, 7, 7);
    g.strokeStyle = P_shade('#6B4A32', 0.8); g.lineWidth = 1.2; g.strokeRect(cx - 3.5, gy - 38, 7, 7);
    g.fillStyle = 'rgba(255,232,155,0.28)';
    g.beginPath(); g.arc(cx, gy - 34, 10, 0, 6.29); g.fill();
  },
  bench: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 9);
    P_box(g, cx, gy - 4, 20, 3, '#C79A6B');
    g.fillStyle = P_shade('#B57A4E', 0.85);
    g.fillRect(cx - 8, gy - 12, 2.5, 8); g.fillRect(cx + 5.5, gy - 12, 2.5, 8);
    g.fillStyle = P_shade('#C79A6B', 1.05); g.fillRect(cx - 9, gy - 14, 18, 3);
  },
  mailbox: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 6);
    g.fillStyle = P_shade('#6B4A32', 0.85); g.fillRect(cx - 1.5, gy - 16, 3, 16);
    g.fillStyle = P_shade('#8FB3C9', 0.95);
    g.fillRect(cx - 6, gy - 24, 12, 10);
    g.beginPath(); g.arc(cx, gy - 24, 6, Math.PI, 0); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.strokeRect(cx - 6, gy - 24, 12, 10);
    g.fillStyle = '#F0B94E'; g.fillRect(cx + 7, gy - 22, 2, 6);
  },

  // ---- Patung ----
  _statueBase: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 12);
    P_box(g, cx, gy, 22, 8, '#C9C6C0');
  },
  statueLion: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 60;
    g.fillStyle = P_shade('#D9A85E', 0.98);
    g.beginPath(); g.ellipse(cx, gy - 20, 9, 6, 0, 0, 6.29); g.fill();
    g.beginPath(); g.arc(cx + 8, gy - 26, 5, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = P_shade('#B57A4E', 0.95); g.fillRect(cx - 8, gy - 16, 16, 6);
  },
  statueMiner: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 60;
    g.fillStyle = P_shade('#B9C0C6', 0.95); g.fillRect(cx - 4, gy - 32, 8, 22);
    g.beginPath(); g.arc(cx, gy - 36, 5, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.strokeStyle = P_shade('#9A7048', 0.95); g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx + 4, gy - 28); g.lineTo(cx + 12, gy - 36); g.stroke();
    g.fillStyle = '#F0B94E'; g.fillRect(cx - 2, gy - 42, 4, 3);
  },
  statueLumber: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 60;
    g.fillStyle = P_shade('#7CC46E', 0.85); g.fillRect(cx - 4, gy - 32, 8, 22);
    g.beginPath(); g.arc(cx, gy - 36, 5, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.strokeStyle = P_shade('#9A7048', 0.95); g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx - 4, gy - 28); g.lineTo(cx - 12, gy - 38); g.stroke();
    g.fillStyle = '#B9C0C6';
    g.beginPath(); g.moveTo(cx - 12, gy - 38); g.lineTo(cx - 6, gy - 34); g.lineTo(cx - 10, gy - 30); g.closePath(); g.fill();
  },
  statueSmith: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 60;
    g.fillStyle = P_shade('#9AA7A0', 0.9); g.fillRect(cx - 4, gy - 32, 8, 22);
    g.beginPath(); g.arc(cx, gy - 36, 5, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.strokeStyle = P_shade('#9A7048', 0.95); g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx + 4, gy - 28); g.lineTo(cx + 12, gy - 40); g.stroke();
    g.fillStyle = '#5E666F'; g.fillRect(cx + 10, gy - 42, 6, 4);
  },
  statueLiberty: (g, ox, oy) => {
    PAINTERS._statueBase(g, ox, oy);
    const cx = ox + 32, gy = oy + 60;
    g.fillStyle = P_shade('#7FB3A8', 0.98); g.fillRect(cx - 4, gy - 34, 8, 24);
    g.beginPath(); g.arc(cx, gy - 38, 5, 0, 6.29); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.strokeStyle = P_shade('#7FB3A8', 0.95); g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx + 4, gy - 30); g.lineTo(cx + 12, gy - 42); g.stroke();
    g.fillStyle = '#F0B94E';
    g.beginPath(); g.arc(cx + 12, gy - 44, 3, 0, 6.29); g.fill();
  },
  badge: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    g.fillStyle = '#F0B94E';
    g.beginPath(); g.arc(cx, gy - 24, 11, 0, 6.29); g.fill();
    g.strokeStyle = P_shade('#B57A4E', 0.95); g.lineWidth = 2;
    g.beginPath(); g.arc(cx, gy - 24, 11, 0, 6.29); g.stroke();
    g.beginPath(); g.arc(cx, gy - 24, 6, 0, 6.29); g.stroke();
    g.fillStyle = P_shade('#B57A4E', 0.95);
    g.beginPath(); g.moveTo(cx, gy - 30); g.lineTo(cx + 2, gy - 26); g.lineTo(cx + 6, gy - 26);
    g.lineTo(cx + 3, gy - 23); g.lineTo(cx + 4, gy - 19); g.lineTo(cx, gy - 21);
    g.lineTo(cx - 4, gy - 19); g.lineTo(cx - 3, gy - 23); g.lineTo(cx - 6, gy - 26);
    g.lineTo(cx - 2, gy - 26); g.closePath(); g.fill();
    g.strokeStyle = P_shade('#C4664C', 1.0); g.lineWidth = 3;
    g.beginPath(); g.moveTo(cx - 5, gy - 14); g.lineTo(cx - 8, gy - 4); g.stroke();
    g.beginPath(); g.moveTo(cx + 5, gy - 14); g.lineTo(cx + 8, gy - 4); g.stroke();
  },
  plotsign: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 8);
    g.fillStyle = P_shade('#9A7048', 0.9); g.fillRect(cx - 2, gy - 30, 4, 30);
    g.fillStyle = '#FDF6E7'; g.fillRect(cx - 14, gy - 42, 28, 16);
    g.strokeStyle = P_shade('#9A7048', 0.85); g.lineWidth = 1.5; g.strokeRect(cx - 14, gy - 42, 28, 16);
    g.fillStyle = '#5A4432'; g.font = '700 8px system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText('PLOT', cx, gy - 31);
  },

  // ---- Camp ----
  campTipi: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 13);
    // kanvas krem + aksen hangat, garis jahit
    g.beginPath(); g.moveTo(cx, gy - 28); g.lineTo(cx - 14, gy - 2); g.lineTo(cx + 14, gy - 2); g.closePath();
    g.fillStyle = '#FBF3E2'; g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.beginPath(); g.moveTo(cx, gy - 28); g.lineTo(cx - 14, gy - 2); g.lineTo(cx - 2, gy - 2); g.closePath();
    g.fillStyle = P_shade('#FBF3E2', 0.88); g.fill(); g.stroke();
    // jahit & tiang
    g.strokeStyle = 'rgba(176,114,56,0.5)'; g.lineWidth = 0.8;
    g.beginPath(); g.moveTo(cx - 4, gy - 20); g.lineTo(cx - 10, gy - 4); g.stroke();
    g.beginPath(); g.moveTo(cx + 4, gy - 20); g.lineTo(cx + 10, gy - 4); g.stroke();
    g.fillStyle = '#8A6242'; g.fillRect(cx - 1.2, gy - 34, 2.4, 8);
    g.fillStyle = '#F0B94E'; g.fillRect(cx - 2, gy - 35, 4, 3);
    // pintu gelap
    g.fillStyle = P_shade('#6B4A32', 0.75);
    g.beginPath(); g.moveTo(cx, gy - 12); g.lineTo(cx - 5, gy - 2); g.lineTo(cx + 5, gy - 2); g.closePath(); g.fill();
  },
  campfire: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    // cahaya hangat lembut
    g.fillStyle = 'rgba(255,196,96,0.20)';
    g.beginPath(); g.ellipse(cx, gy - 6, 18, 8, 0, 0, 6.29); g.fill();
    P_shadow(g, cx, gy, 7);
    // batu dudukan
    g.fillStyle = '#B9C0C6';
    for (const [dx, dy] of [[-9, -1], [-3, -5], [6, -3], [10, 1]]) {
      g.beginPath(); g.arc(cx + dx, gy + dy, 2.6, 0, 6.29); g.fill();
    }
    g.strokeStyle = P_OL; g.lineWidth = 1;
    for (const [dx, dy] of [[-9, -1], [-3, -5], [6, -3], [10, 1]]) {
      g.beginPath(); g.arc(cx + dx, gy + dy, 2.6, 0, 6.29); g.stroke();
    }
    // kayu
    g.strokeStyle = P_shade('#9A7048', 0.9); g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx - 5, gy - 2); g.lineTo(cx + 5, gy - 7); g.stroke();
    g.beginPath(); g.moveTo(cx + 5, gy - 2); g.lineTo(cx - 5, gy - 7); g.stroke();
    // api
    g.fillStyle = '#F08A3C';
    g.beginPath(); g.moveTo(cx, gy - 17); g.lineTo(cx - 5, gy - 7); g.lineTo(cx + 5, gy - 7); g.closePath(); g.fill();
    g.fillStyle = '#FFD75E';
    g.beginPath(); g.moveTo(cx, gy - 14); g.lineTo(cx - 3, gy - 7); g.lineTo(cx + 3, gy - 7); g.closePath(); g.fill();
  },
});