'use strict';
// ---------- Skill dan profesi: XP dari aktivitas, profesi di tingkat 5 dan 10 ----------
function hasProf(skill, id) {
  const sk = S.skills[skill];
  return sk.prof5 === id || sk.prof10 === id;
}
function gainXP(skill, amt) {
  const sk = S.skills[skill];
  if (sk.level >= 10 && sk.xp >= 1000) return; // mentok: tidak ada tingkat 11
  sk.xp += amt;
  while (sk.level < 10 && sk.xp >= sk.level * 100) {
    sk.xp -= sk.level * 100;
    sk.level++;
    sfx.levelup();
    addFloat(S.px, S.py - 30, SKILL_NAMES[skill] + ' tingkat ' + sk.level + '!', '#8fd0ff');
    if (sk.level === 5 || sk.level === 10) banner('Pilih profesi ' + SKILL_NAMES[skill] + ' di panel Skill (P)');
  }
}
function chooseProfession(skill, tier, id) {
  const sk = S.skills[skill];
  const slot = tier === 5 ? 'prof5' : 'prof10';
  if (sk.level < tier || sk[slot]) return false;
  if (!PROFESSIONS[skill][tier].some(p => p.id === id)) return false;
  sk[slot] = id;
  sfx.levelup();
  celebrate('prof', 'Profesi pertama dipilih!');
  return true;
}
