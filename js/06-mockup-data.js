// Data demo. Peta ditaruh eksplisit supaya mockup selalu tampil sama.
const MACHINES = {
  sawhorse: { name: 'Sawhorse', desc: 'Potong manual dengan kapak. Item pemula dari tutorial.', recipe: 'Log menjadi Pillar', color: '#a8763e' },
  carpenter: { name: 'Carpenter', desc: 'Crafting otomatis produk kayu dan furnitur.', recipe: 'Wood Frame dari 4 Plank + 4 Nails', color: '#c9a86a' },
  oven: { name: 'Oven', desc: 'Tungku awal untuk bata dan kaca.', recipe: '3 Firelog + 2 Clay menjadi 10 Brick', color: '#b06040' },
  smelter: { name: 'Smelter', desc: 'Peleburan semua ingot dengan bahan bakar Firelog.', recipe: '3 Firelog + 2 Iron Ore menjadi Iron Ingot', color: '#96553c' },
  blacksmith: { name: 'Blacksmith', desc: 'Crafting otomatis komponen logam.', recipe: 'Iron Ingot menjadi Iron Beam', color: '#8d99a8' },
  splitter: { name: 'Log Splitter', desc: 'Membelah log menjadi bahan bakar peleburan.', recipe: '1 Log menjadi 6 Firelog', color: '#7a5230' },
};

const CATEGORIES = [
  { id: 'conveyors', name: 'Conveyors', items: [
    { id: 'conveyor', name: 'Conveyor', sub: '$100', color: '#e8b64c' },
    { id: 'conveyor-tilt', name: 'Inclined Conveyor', sub: 'Naik dan turun', color: '#c98f2e' },
  ] },
  { id: 'machines', name: 'Machines', items: [
    { id: 'sawhorse', name: 'Sawhorse', sub: 'Gratis', color: '#a8763e', machine: true },
    { id: 'carpenter', name: 'Carpenter', sub: 'Research $50', color: '#c9a86a', machine: true },
    { id: 'oven', name: 'Oven', sub: 'Research $100', color: '#b06040', machine: true },
    { id: 'smelter', name: 'Smelter', sub: '$500 + 30 Brick', color: '#96553c', machine: true },
    { id: 'blacksmith', name: 'Blacksmith', sub: 'Research $1.000', color: '#8d99a8', machine: true },
    { id: 'splitter', name: 'Log Splitter', sub: 'Bahan bakar', color: '#7a5230', machine: true },
  ] },
  { id: 'storages', name: 'Storages', items: [
    { id: 'wooden-box', name: 'Wooden Box', sub: 'Simpan item', color: '#8a5a33' },
    { id: 'container', name: 'Container', sub: 'Simpan besar', color: '#4f7a94' },
    { id: 'storage-rack', name: 'Storage Rack', sub: '500 slot', color: '#6e6a72' },
  ] },
  { id: 'decorations', name: 'Decorations', items: [
    { id: 'lantern', name: 'Lantern', sub: 'Cahaya hangat', color: '#ffd75e' },
    { id: 'statue', name: 'Statue', sub: '+Housing', color: '#b8b0a0' },
    { id: 'flowers', name: 'Flowers', sub: 'Hiasan', color: '#d97ba8' },
  ] },
  { id: 'structures', name: 'Structures', items: [
    { id: 'wood-wall', name: 'Wood Wall', sub: '$10', color: '#7a5230' },
    { id: 'iron-wall', name: 'Iron Wall', sub: 'Kuat', color: '#5d6773' },
  ] },
];

// Teks melayang saat petak dipanen. Kunci cocok dengan obj atau terrain.
const HARVEST = {
  tree: { text: '+1 Log', color: '#ffd75e' },
  oreIron: { text: '+1 Iron Ore', color: '#ffb08a' },
  oreCopper: { text: '+1 Copper Ore', color: '#7ad9c8' },
  sand: { text: '+1 Sand', color: '#f0d9a0' },
  clay: { text: '+1 Clay', color: '#e08a6a' },
  cotton: { text: '+1 Cotton', color: '#ffffff' },
};

function buildDemoMap() {
  newGrid();
  const put = (list, obj) => list.forEach(([gx, gy]) => { S.grid[gy][gx].obj = obj; });
  const terrain = (list, t) => list.forEach(([gx, gy]) => { S.grid[gy][gx].t = t; });

  put([[1, 1], [2, 1], [1, 3], [2, 4], [3, 2], [1, 5], [3, 5], [2, 2], [0, 2], [3, 1]], 'tree');
  put([[13, 2], [14, 3], [13, 4], [14, 1], [12, 2]], 'oreIron');
  put([[14, 5], [13, 6], [14, 7]], 'oreCopper');
  put([[10, 1], [11, 1], [11, 2], [12, 1], [10, 2]], 'cotton');
  put([[3, 3], [9, 6], [13, 7]], 'lantern');
  terrain([[12, 8], [13, 8], [13, 9], [14, 9], [12, 9], [14, 8]], 'sand');
  terrain([[1, 8], [2, 8], [2, 9], [3, 9], [1, 9], [0, 8]], 'clay');

  // Lini demo: 5 mesin sebaris, conveyor di antaranya, splitter di bawah.
  const line = [['sawhorse', 4, 4], ['carpenter', 6, 4], ['oven', 8, 4], ['smelter', 10, 4], ['blacksmith', 12, 4]];
  line.forEach(([id, gx, gy]) => S.machines.set(key(gx, gy), { id, dir: 0 }));
  S.machines.set(key(4, 6), { id: 'splitter', dir: 1 });
  [[5, 4], [7, 4], [9, 4], [11, 4]].forEach(([gx, gy]) => S.conveyors.set(key(gx, gy), { dir: 0 }));
  S.conveyors.set(key(5, 6), { dir: 0 });
}
