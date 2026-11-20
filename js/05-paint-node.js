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

  // ---- v35: wagon; v51 digambar ulang ikut game asli (WagonLvMax):
  // dua lembu berkuk di depan, peti papan dengan tonggak, kanvas putih
  // setengah tabung, roda kayu besar-belakang/kecil-depan, alas biru navy.
  wagon: (g, ox, oy) => {
    const cx = ox + 32, gy = oy + 60;
    P_shadow(g, cx, gy, 19);
    // ---- lembu (dua, krem-putih, tanduk pucat, berkuk) ----
    const ox1 = (bx, by, s) => {
      g.fillStyle = '#F5F0E6';
      g.beginPath(); g.ellipse(bx, by, 9 * s, 6 * s, 0, 0, 6.29); g.fill();
      g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
      g.fillStyle = '#DED2BD';
      g.beginPath(); g.ellipse(bx, by + 2.5 * s, 8 * s, 3 * s, 0, 0, 6.29); g.fill();
      // kepala menunduk di depan (+x)
      g.fillStyle = '#F5F0E6';
      g.beginPath(); g.ellipse(bx + 8 * s, by + 3 * s, 4.4 * s, 3.6 * s, 0.5, 0, 6.29); g.fill();
      g.strokeStyle = P_OL; g.stroke();
      // tanduk
      g.strokeStyle = '#D8C9A8'; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(bx + 9 * s, by + 1 * s); g.lineTo(bx + 12 * s, by - 1.5 * s); g.stroke();
      // kaki
      g.strokeStyle = '#E8E0D0'; g.lineWidth = 2;
      [[-5, 0], [-1, 0], [4, 0], [7, 0]].forEach(([dx]) => {
        g.beginPath(); g.moveTo(bx + dx * s, by + 4 * s); g.lineTo(bx + dx * s, by + 11 * s); g.stroke();
      });
      g.fillStyle = '#5A5048';
      [[-5], [-1], [4], [7]].forEach(([dx]) => g.fillRect(bx + dx * s - 1, by + 11 * s, 2.6 * s, 1.6));
      // ekor
      g.strokeStyle = '#DED2BD'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(bx - 9 * s, by - 1 * s); g.lineTo(bx - 12 * s, by + 4 * s); g.stroke();
    };
    ox1(cx + 19, gy - 21, 0.92); // lembu jauh (belakang-atas)
    ox1(cx + 12, gy - 13, 1.0);  // lembu dekat
    // kuk kayu melintang di pundak kedua lembu
    g.fillStyle = '#C2A077';
    g.beginPath(); g.moveTo(cx + 9, gy - 24); g.lineTo(cx + 26, gy - 29); g.lineTo(cx + 26, gy - 25); g.lineTo(cx + 9, gy - 20); g.closePath(); g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    // ---- peti wagon (papan kayu + tonggak) ----
    P_box(g, cx - 9, gy - 2, 26, 12, '#9B6B45', { top: P_shade('#9B6B45', 1.14) });
    g.fillStyle = P_shade('#6E4A2E', 0.95);
    g.fillRect(cx - 22, gy - 12, 26, 4);               // sisi papan bawah
    g.fillStyle = P_shade('#6E4A2E', 0.8);
    for (let i = 0; i < 4; i++) g.fillRect(cx - 21 + i * 7, gy - 12, 1, 6); // garis papan
    g.fillStyle = '#B8895C'; g.fillRect(cx - 22, gy - 15, 26, 2); // rel atas terang
    g.fillStyle = '#5E3F27';
    for (let i = 0; i < 5; i++) g.fillRect(cx - 21 + i * 6, gy - 21, 2, 6); // tonggak
    // alas biru navy di lantai peti (sisi depan, tanpa kanvas)
    g.fillStyle = '#2A3A5C';
    g.beginPath(); g.moveTo(cx - 12, gy - 17); g.lineTo(cx - 1, gy - 23); g.lineTo(cx + 1, gy - 19); g.lineTo(cx - 10, gy - 13); g.closePath(); g.fill();
    // ---- kanvas putih setengah tabung ----
    const ccx = cx - 10, ccy = gy - 26;
    g.beginPath(); g.ellipse(ccx, ccy, 15, 14, 0, Math.PI, 0); g.closePath();
    g.fillStyle = '#ECECEA'; g.fill();
    g.strokeStyle = P_OL; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#CFCFCC'; // sisi belakang lebih gelap
    g.beginPath(); g.ellipse(ccx - 5, ccy - 1, 9, 12, 0, Math.PI, 0); g.fill();
    g.strokeStyle = 'rgba(150,150,145,0.45)'; g.lineWidth = 1; // garis lipatan kain
    for (const dx of [-9, -4, 2, 7]) {
      g.beginPath(); g.moveTo(ccx + dx, ccy - 12); g.lineTo(ccx + dx, ccy + 0.5); g.stroke();
    }
    g.fillStyle = '#DEDCD6'; g.fillRect(ccx - 15, ccy - 1, 30, 3); // ujung kain bergelombang
    // ---- roda kayu (belakang besar, depan kecil) ----
    const roda = (rx, ry, r) => {
      g.fillStyle = '#7A5A3F';
      g.beginPath(); g.arc(rx, ry, r, 0, 6.29); g.fill();
      g.strokeStyle = '#4A3826'; g.lineWidth = 1; g.stroke();
      g.strokeStyle = '#5E4029'; g.lineWidth = 1;
      for (let a = 0; a < 6; a++) {
        g.beginPath(); g.moveTo(rx, ry);
        g.lineTo(rx + Math.cos(a * 1.047) * r * 0.9, ry + Math.sin(a * 1.047) * r * 0.9);
        g.stroke();
      }
      g.fillStyle = '#4E3620';
      g.beginPath(); g.arc(rx, ry, r * 0.3, 0, 6.29); g.fill();
    };
    roda(cx - 20, gy - 1, 5.6); roda(cx - 12, gy - 1, 5.6); // belakang
    roda(cx + 1, gy - 1, 4.4);                              // depan dekat
    roda(cx + 5, gy - 4, 4.0);                              // depan jauh
    // batang penarik ke kuk
    g.strokeStyle = '#8A6242'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(cx + 3, gy - 6); g.lineTo(cx + 11, gy - 17); g.stroke();
    // ---- indikator muatan (ikut v44) ----
    g.fillStyle = '#F8F8F8';
    g.fillRect(cx - 25, gy - 47, 30, 11);
    g.strokeStyle = 'rgba(90,68,50,0.45)'; g.lineWidth = 1; g.strokeRect(cx - 25, gy - 47, 30, 11);
    g.fillStyle = '#3A3A3A'; g.font = '700 7px system-ui, sans-serif'; g.textAlign = 'center';
    g.fillText('0 / 15', cx - 10, gy - 39.5);
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
// v49: papan "COMING SOON" di jalan buntu kota (petak diblokir).
Object.assign(PAINTERS, {
  signClosed: (g, ox, oy, c) => {
    const cx = ox + 32, gy = oy + 56;
    // bayangan
    g.fillStyle = 'rgba(122,102,80,0.20)';
    g.beginPath(); g.ellipse(cx, gy + 1, 13, 5, 0, 0, 6.29); g.fill();
    // dua tiang
    g.fillStyle = '#B58A5E';
    g.fillRect(cx - 10, gy - 26, 4, 26);
    g.fillRect(cx + 6, gy - 26, 4, 26);
    g.fillStyle = '#9A7048';
    g.fillRect(cx - 10, gy - 26, 1.5, 26);
    g.fillRect(cx + 6, gy - 26, 1.5, 26);
    // papan
    g.fillStyle = '#8A5A34'; g.fillRect(cx - 16, gy - 40, 32, 17);
    g.fillStyle = '#F1E0C0'; g.fillRect(cx - 14, gy - 38, 28, 13);
    g.strokeStyle = 'rgba(122,86,62,0.55)'; g.lineWidth = 1;
    g.strokeRect(cx - 14.5, gy - 38.5, 29, 14);
    // teks dua baris, auto-shrink
    g.fillStyle = '#7A5638'; g.textAlign = 'center'; g.textBaseline = 'middle';
    let f = 6;
    g.font = '700 ' + f + 'px system-ui, sans-serif';
    while (g.measureText('COMING').width > 24 && f > 4) { f -= 0.5; g.font = '700 ' + f + 'px system-ui, sans-serif'; }
    g.fillText('COMING', cx, gy - 34);
    g.fillText('SOON', cx, gy - 27);
    g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  },
});
