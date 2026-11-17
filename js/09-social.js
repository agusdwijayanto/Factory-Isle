'use strict';
// ---------- Sosial versi solo: chat, broadcast sistem, guild, WOTD ----------
// Semua pengganti multiplayer di sini adalah tafsir (riset: sistem-sistem
// ini secara fundamental butuh server). Bentuknya dibuat semirip mungkin
// dengan umpan balik Growtopia: pesan chat + banner, bukan popup modal.
function addChat(text, cls) {
  S.chatLog.push({ text, cls: cls || '', t: nowMs() });
  if (S.chatLog.length > 40) S.chatLog.shift();
  renderChat();
}
function stamp(t) {
  const d = new Date(t);
  const p = n => (n < 10 ? '0' : '') + n;
  return '[' + p(d.getHours()) + ':' + p(d.getMinutes()) + ']';
}
function renderChat() {
  el.chatlog.innerHTML = S.chatLog.map(m => '<div class="' + m.cls + '">' + stamp(m.t != null ? m.t : nowMs()) + ' ' + escapeHtml(m.text) + '</div>').join('');
}
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function sendChat(raw) {
  const text = (raw || '').trim();
  if (!text) return;
  if (text[0] === '/') { runCommand(text); return; }
  addChat('[W] Pemain: ' + text, '');
  S.bubble = { text, life: 4 };
}
function runCommand(text) {
  const parts = text.slice(1).split(' ');
  const cmd = parts[0].toLowerCase();
  const rest = parts.slice(1).join(' ');
  if (cmd === 'msg') {
    if (!rest) { addChat('Pakai: /msg <pesan>', 'sys'); return; }
    addChat('[MSG] >> Pemain: ' + rest, 'msg');
  } else if (cmd === 'sb') {
    if (S.gems < 40) { addChat('Super Broadcast butuh 40 gems.', 'sys'); sfx.error(); return; }
    if (!rest) { addChat('Pakai: /sb <pesan>', 'sys'); return; }
    S.gems -= 40;
    addChat('[SB] Pemain: ' + rest, 'sb');
    sfx.beep();
  } else if (cmd === 'bc') {
    if (S.gems < 20) { addChat('Broadcast butuh 20 gems.', 'sys'); sfx.error(); return; }
    if (!rest) { addChat('Pakai: /bc <pesan>', 'sys'); return; }
    S.gems -= 20;
    addChat('[BC] Pemain: ' + rest, 'bc');
    sfx.beep();
  } else if (cmd === 'roles') {
    openPanel({ kind: 'profile' });
  } else if (cmd === 'trade') {
    addChat('Trade: ganti ke mode Kunci, lalu ketuk pedagang keliling.', 'sys');
  } else {
    addChat('Perintah tidak dikenal: /' + cmd, 'sys');
  }
  refreshHUD();
}
function broadcastTick(dt) {
  S.broadcastT -= dt;
  if (S.broadcastT > 0) return;
  S.broadcastT = 300; // pesan sistem tiap 5 menit (tafsir)
  const msg = BROADCASTS[S.broadcastIdx % BROADCASTS.length];
  S.broadcastIdx++;
  addChat('[BC] ' + msg, 'bc');
  sfx.beep();
}

// ---------- Guild ----------
function createGuild(name) {
  if (S.guild) return false;
  name = (name || '').trim().slice(0, 24);
  if (!name) return false;
  if (S.gems < 200000) { addChat('Membuat guild butuh 200.000 gems.', 'sys'); sfx.error(); return false; }
  S.gems -= 200000;
  S.guild = { name, statement: 'Guild baru di Indotopia.', members: ['Pemain'], createdAt: nowMs() };
  addChat('Guild "' + name + '" dibuat!', 'sys');
  banner('Guild "' + name + '" dibuat!');
  return true;
}
function guildTick(dt) {
  if (!S.guild || S.guild.members.length >= 10) return;
  S.guildT -= dt;
  if (S.guildT > 0) return;
  S.guildT = 600; // anggota NPC bergabung tiap 10 menit (tafsir), mentok 10
  const pool = GUILD_POOL.filter(n => !S.guild.members.includes(n));
  if (!pool.length) return;
  const n = pool[Math.floor(Math.random() * pool.length)];
  S.guild.members.push(n);
  addChat(n + ' bergabung dengan guild ' + S.guild.name + '.', 'sys');
}
function setGuildStatement(text) {
  if (!S.guild) return;
  S.guild.statement = String(text || '').slice(0, 120);
}

// ---------- World of the Day ----------
// Pilihan deterministik dari tanggal + daftar world milik pemain (tafsir).
function pickWOTD() {
  const names = Object.keys(S.worlds).sort();
  if (!names.length) return null;
  const dayStr = new Date(nowMs()).toISOString().slice(0, 10);
  return names[hashStr(dayStr) % names.length];
}
function enterWOTDCheck() {
  const wotd = pickWOTD();
  if (S.worldName !== wotd) return;
  const dayStr = new Date(nowMs()).toISOString().slice(0, 10);
  if (S.wotdClaimed[dayStr]) return;
  S.wotdClaimed[dayStr] = true;
  gainItem('wotd-trophy', 1);
  addChat('[S] World ini adalah World of the Day! Kamu menerima WOTD Trophy + 10 Growtoken (simulasi).', 'sys');
  banner('World of the Day! Trofi diterima.');
}

// ---------- Gerak pedagang keliling ----------
function updateTrader(dt) {
  const npc = S.npc;
  if (!npc) return;
  npc.moveT -= dt;
  if (npc.moveT > 0) return;
  npc.moveT = 1.5 + Math.random() * 2;
  const nx = npc.tx + npc.dir;
  if (nx < 2 || nx >= MW - 2 || solidAt(nx, npc.ty) || !solidAt(nx, npc.ty + 1)) {
    npc.dir *= -1;
    return;
  }
  npc.tx = nx;
}
