'use strict';
// ---------- Progresi: XP, level, role ----------
// Kurva XP per level tidak ditemukan di riset; tafsir: butuh level*100 XP
// untuk naik. Cap 125 dan nama biru di 125 mengikuti riset.
const ROLE_NAMES = { farmer: 'Farmer', builder: 'Builder' };
function xpNeed(level) { return level * 100; }
function gainXp(n) {
  if (S.level >= LEVEL_CAP) return;
  S.xp += n;
  while (S.level < LEVEL_CAP && S.xp >= xpNeed(S.level)) {
    S.xp -= xpNeed(S.level);
    S.level++;
    addChat('Pemain sekarang level ' + S.level + '!', 'sys');
    banner('Naik level! Sekarang level ' + S.level);
    sfx.levelup();
    if (S.level === LEVEL_CAP) { S.xp = 0; addChat('Level 125 (MAX)! Namamu menjadi biru.', 'sys'); }
  }
  refreshHUD();
}
function roleNeed(level) { return level * 100; }
function addRoleXp(role, n) {
  const r = S.roles[role];
  if (r.level >= ROLE_CAP) return;
  r.xp += n;
  while (r.level < ROLE_CAP && r.xp >= roleNeed(r.level)) {
    r.xp -= roleNeed(r.level);
    r.level++;
    addChat(ROLE_NAMES[role] + ' naik ke level ' + r.level + '!', 'sys');
    banner(ROLE_NAMES[role] + ' level ' + r.level + '!');
  }
}
function nameColor() { return S.level >= LEVEL_CAP ? '#6ab8ff' : '#7dff8a'; }
