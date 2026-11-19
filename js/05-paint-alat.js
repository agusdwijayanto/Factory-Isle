// Perkakas: kapak, pickaxe, sekop. Pecahan 05-render.js (v16).
Object.assign(PAINTERS, {
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
});
