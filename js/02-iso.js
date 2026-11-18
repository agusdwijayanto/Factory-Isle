// Matematika proyeksi isometrik 2:1. Murni, tanpa DOM, supaya bisa dites headless.
function isoPoint(fx, fy, cam) {
  return {
    x: (fx - fy) * (TILE_W / 2) * cam.zoom + cam.x,
    y: (fx + fy) * (TILE_H / 2) * cam.zoom + cam.y,
  };
}

// Pusat alas petak (gx, gy) di layar.
function tileCenter(gx, gy, cam) { return isoPoint(gx + 0.5, gy + 0.5, cam); }

// Invers isoPoint, lalu dibulatkan ke bawah menjadi indeks petak.
function screenToGrid(sx, sy, cam) {
  const px = (sx - cam.x) / cam.zoom, py = (sy - cam.y) / cam.zoom;
  const sum = py / (TILE_H / 2), dif = px / (TILE_W / 2);
  return { gx: Math.floor((sum + dif) / 2), gy: Math.floor((sum - dif) / 2) };
}

function centerCamera(w, h) {
  const c = isoPoint(GRID_W / 2, GRID_H / 2, { x: 0, y: 0, zoom: S.cam.zoom });
  S.cam.x = w / 2 - c.x;
  S.cam.y = h / 2 - c.y - 40 * S.cam.zoom;
}

function clampZoom(z) { return Math.min(2.5, Math.max(0.5, z)); }
