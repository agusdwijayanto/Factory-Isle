'use strict';
// ---------- NPC dan misi harian: 1 kumpul, 1 tanam, 1 splice, tiap fajar ----------
function nearNPC() {
  const p = playerTile();
  for (const n of S.npcs) {
    if (Math.max(Math.abs(n.tx - p.tx), Math.abs(n.ty - p.ty)) <= 2) return n;
  }
  return null;
}
function genMissions() {
  const week = weekOf(S.day);
  const seasonCrop = [['strawberry'], ['melon'], ['pumpkin', 'grape'], []][seasonOf(S.day)];
  const pool = ['wheat', 'wood', 'stone'].concat(seasonCrop);
  const item = pool[Math.floor(Math.random() * pool.length)];
  const n1 = Math.min(20, 5 + week * 2);
  const n2 = Math.min(10, 3 + week);
  const n3 = Math.min(3, 1 + Math.floor(week / 2));
  S.missions = [
    { kind: 'kumpul', item, need: n1, rewardCoins: 10 * n1, rewardTask: 1 + Math.floor(n1 / 5), claimed: false },
    { kind: 'tanam', need: n2, rewardCoins: 10 * n2, rewardTask: 1 + Math.floor(n2 / 5), claimed: false },
    { kind: 'splice', need: n3, rewardCoins: 30 * n3, rewardTask: 2 * n3, claimed: false },
  ];
}
function missionHave(m) {
  if (m.kind === 'kumpul') return S.counters.gained[m.item] || 0;
  if (m.kind === 'tanam') return S.counters.planted;
  return S.counters.spliced;
}
function missionText(m) {
  if (m.kind === 'kumpul') return 'Kumpulkan ' + m.need + ' ' + ITEMS[m.item].name;
  if (m.kind === 'tanam') return 'Tanam ' + m.need + ' benih';
  return 'Splice ' + m.need + ' kali';
}
function claimMission(i) {
  const m = S.missions[i];
  if (!m || m.claimed || missionHave(m) < m.need) return false;
  m.claimed = true;
  S.coins += m.rewardCoins;
  S.taskCoins += m.rewardTask;
  sfx.coin();
  addFloat(S.px, S.py - 30, '+' + m.rewardCoins + ' koin, +' + m.rewardTask + ' tugas', '#ffd94d');
  celebrate('mission', 'Misi pertama selesai!');
  return true;
}
