// Node panen dan hiasan alam: pohon, tunggul, bijih, kapas, lentera,
// bunga. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
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
});
