/* 5마당 전술 문제 은행 만들기: node _build/chess/gen_m5.js [초] → _build/chess/m5_data.js
   무작위 국면에서 ① 전술 모양(포크·핀·스큐어·디스커버드 …)에 맞는 백의 수를 먼저 고르고(빠름)
   ② 인공지능(ai.js) 3수 앞 읽기로 그 수가 말을 2.5점 넘게 얻고 다른 수보다 뚜렷이 좋은지 확인해 담습니다.
   2수 메이트는 모든 흑 대답에 메이트가 있는지 끝까지 따져 확인합니다. 씨앗이 같으면 언제나 같은 은행(seed 고정). */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
global.window = globalThis;
['rules.js', 'pieces.js', 'ai.js'].forEach(f => vm.runInThisContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), { filename: f }));
const CH = globalThis.CH, AI = globalThis.CAI;
const MODE = /^(lines|mates)$/.test(process.argv[2]) ? process.argv[2] : 'make', SECS = +(process.argv[2] || 60) || 60, WANT = 36;
if (MODE === 'lines') { addLines(); process.exit(0); }
if (MODE === 'mates') { setTimeout(fillMates, 0); }
/* 은행 문제마다 이어지는 수를 미리 계산: 정답 → 흑의 가장 좋은 대답(reply) → 백의 좋은 다음 수(good2). 메이트 문제는 good2 = 메이트하는 수 */
function addLines() {
  const f = path.join(__dirname, 'm5_data.js'); vm.runInThisContext(fs.readFileSync(f, 'utf8'));
  const bank = globalThis.M5DATA, nm = m => [CH.name(m.from), CH.name(m.to)].concat(m.promo ? [m.promo.toUpperCase()] : []);
  let n = 0;
  Object.keys(bank).forEach(k => bank[k].forEach(it => {
    const p = CH.parse(it.fen), g = it.good[0], m = CH.legal(p).find(x => CH.name(x.from) === g[0] && CH.name(x.to) === g[1] && (!g[2] || (x.promo || '').toUpperCase() === g[2]));
    const q = CH.make(p, m); if (CH.status(q)) { delete it.reply; delete it.good2; return; }
    const r = AI.best(q, k === 'mate2' ? 2 : 3, { nodes: 40000 }); const q2 = CH.make(q, r);
    let g2;
    if (k === 'mate2') g2 = CH.legal(q2).filter(x => CH.status(CH.make(q2, x)) === 'mate').map(nm);
    else { const sc = AI.scores(q2, 2, { nodes: 12000 }); g2 = sc.filter(x => x.s >= sc[0].s - 80).slice(0, 3).map(x => nm(x.m)); if (sc[0].s - AI.evalW(p.b) < 150) g2 = []; }
    if (g2.length) { it.reply = nm(r); it.good2 = g2; n++; } else { delete it.reply; delete it.good2; }
  }));
  fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/window\.M5DATA = .*;\n$/s, 'window.M5DATA = ' + JSON.stringify(bank) + ';\n'));
  console.log('이어지는 수 ' + n + '개 계산');
}
let seed = 20261011; function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
const ri = n => Math.floor(rnd() * n), pick = a => a[ri(a.length)];
const V = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 100 };
const kd = (a, b) => Math.max(Math.abs((a >> 3) - (b >> 3)), Math.abs((a & 7) - (b & 7)));
const isB = c => c !== '.' && !CH.isW(c), isWp = c => c !== '.' && CH.isW(c);
function randPos() {
  for (;;) {
    const b = CH.board('8/8/8/8/8/8/8/8'), put = (c, ok) => { const e = []; for (let i = 0; i < 64; i++) if (b[i] === '.' && ok(i)) e.push(i); if (!e.length) return -1; const i = pick(e); b[i] = c; return i; };
    const wk = put('K', i => i >= 48 && rnd() < .7 ? true : i >= 40), bk = put('k', i => i < 16 && kd(i, wk) > 2);
    const pieces = ['Q', 'R', 'R', 'B', 'B', 'N', 'N'];
    const nw = 2 + ri(4), nb = 2 + ri(4);
    for (let k = 0; k < nw; k++) put(pick(pieces), i => true);
    for (let k = 0; k < nb; k++) put(pick(pieces).toLowerCase(), i => true);
    for (let k = 0; k < 2 + ri(4); k++) put('P', i => i >= 16 && i < 56 && (i >> 3) >= 4);
    for (let k = 0; k < 2 + ri(4); k++) put('p', i => i >= 8 && i < 48 && (i >> 3) <= 3);
    const p = { b, turn: 'w', cast: '', ep: -1, half: 0, full: 1 };
    if (CH.inCheck(Object.assign({}, p, { turn: 'b' })) || CH.inCheck(p)) continue;
    return p;
  }
}
const att = (b, i, sd) => CH.attackers(b, i, sd);
const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
function ray(b, from, d) { const out = []; let r = (from >> 3) + d[0], f = (from & 7) + d[1]; while (r >= 0 && r < 8 && f >= 0 && f < 8) { const i = r * 8 + f; if (b[i] !== '.') out.push(i); if (out.length === 2) break; r += d[0]; f += d[1]; } return out; }
function slides(c, d) { const t = c.toUpperCase(); return t === 'Q' || (t === 'R' && (d[0] === 0 || d[1] === 0)) || (t === 'B' && d[0] && d[1]); }
/* 전술 모양 알아보기: p에서 백의 수 m → 그 모양 이름들 */
function motifs(p, m) {
  const q = CH.make(p, m), b = q.b, to = m.to, pc = m.pc, out = [];
  const tg = CH.attacks(b, to).filter(i => isB(b[i]));
  const valuable = i => b[i] === 'k' || V[b[i].toUpperCase()] > V[pc] || !att(b, i, 'b').length;
  const vt = tg.filter(i => valuable(i) && V[b[i].toUpperCase()] >= 3);
  if (vt.length >= 2) { out.push('dbl'); if (pc === 'N') out.push('nfork'); if (pc === 'P') out.push('pfork'); if (pc === 'Q') out.push('qfork'); }
  DIRS.forEach(d => {
    if (!slides(pc, d)) return; const r = ray(b, to, d); if (r.length < 2 || !isB(b[r[0]]) || !isB(b[r[1]])) return;
    const x = b[r[0]], y = b[r[1]];
    if (x !== 'k' && y === 'k') out.push('pinabs');
    if (x !== 'k' && y !== 'k' && V[y.toUpperCase()] > V[x.toUpperCase()] && V[y.toUpperCase()] >= 5) out.push('pinrel');
    if ((x === 'k' || x === 'q') && y !== 'k' && V[y.toUpperCase()] >= 3 && V[y.toUpperCase()] < V[x.toUpperCase()]) out.push('skewer');
  });
  const chk = att(b, b.indexOf('k'), 'w');
  if (chk.length >= 2) out.push('dblchk');
  /* 디스커버드: 움직인 말이 비켜서 다른 백 말의 줄이 열림 */
  for (let s = 0; s < 64; s++) {
    if (!isWp(b[s]) || s === to || !/[QRB]/.test(b[s])) continue;
    const before = CH.attacks(p.b, s), after = CH.attacks(b, s);
    after.forEach(i => { if (before.indexOf(i) < 0 && isB(b[i]) && (b[i] === 'k' || V[b[i].toUpperCase()] >= 5)) { out.push(b[i] === 'k' ? 'dischk' : 'disatk'); } });
  }
  if (m.cap !== '.') {
    /* 지키는 말 없애기: 잡은 흑 말이 지키던 다른 흑 말이 이제 지켜지지 않음 */
    for (let y = 0; y < 64; y++) { if (!isB(p.b[y]) || y === to || p.b[y] === 'k' || V[p.b[y].toUpperCase()] < 3) continue; const d0 = att(p.b, y, 'b'); if (d0.indexOf(to) >= 0 && att(p.b, y, 'w').length && !att(b, y, 'b').length) { out.push('remdef'); break; } }
    /* 과부하: 잡은 칸을 지키는 흑 말 D가 다른 흑 말 Y의 유일한 지킴이 */
    att(b, to, 'b').forEach(dd => { for (let y = 0; y < 64; y++) { if (!isB(b[y]) || y === dd || b[y] === 'k' || V[b[y].toUpperCase()] < 3) continue; const ds = att(b, y, 'b'); if (ds.length === 1 && ds[0] === dd && att(b, y, 'w').length) { out.push('overload'); return; } } });
  }
  /* 유인(희생): 옮긴 말이 바로 잡힐 수 있는 칸에 감(값싼 말이 아니면) */
  if (att(b, to, 'b').length && V[pc] >= 3 && (m.cap === '.' || V[m.cap.toUpperCase()] < V[pc])) out.push('decoy');
  return [...new Set(out)];
}
/* 검증: 그 수가 가장 좋고(다른 수보다 1.5점 넘게), 지금보다 2.5점 넘게 얻음. 좋은 수(0.6점 안)는 모두 정답 */
function verify(p, key) {
  const sc = AI.scores(p, 2, { nodes: 6000 }), base = AI.evalW(p.b);
  if (!sc.length) return null;
  const best = sc[0]; if (best.m.from !== key.from || best.m.to !== key.to) return null;
  if (best.s > AI.MATE / 2) return null; /* 메이트 문제는 따로 */
  if (best.s - base < 250) return null;
  const good = sc.filter(x => x.s >= best.s - 60); if (good.length > 2) return null;
  const next = sc.find(x => x.s < best.s - 60); if (next && next.s > best.s - 150) return null;
  return good.map(x => [CH.name(x.m.from), CH.name(x.m.to)].concat(x.m.promo ? [x.m.promo.toUpperCase()] : []));
}
/* 2수 메이트(1수 메이트는 없음): 첫 수마다 흑의 모든 대답에 메이트가 있는지 */
function mateIn1(q) { return CH.legal(q).filter(m => CH.status(CH.make(q, m)) === 'mate'); }
function mate2(p) {
  if (mateIn1(p).length) return null;
  const good = [];
  for (const m of CH.legal(p)) {
    const q = CH.make(p, m); if (CH.status(q)) continue;
    const rs = CH.legal(q); let all = true;
    for (const r of rs) { if (!mateIn1(CH.make(q, r)).length) { all = false; break; } }
    if (all) good.push([CH.name(m.from), CH.name(m.to)].concat(m.promo ? [m.promo.toUpperCase()] : []));
    if (good.length > 2) return null;
  }
  return good.length ? good : null;
}
function mate2Pos(kind) {
  /* 흑 킹을 끝 줄·귀퉁이 근처에, 백 말을 가까이 */
  for (;;) {
    const b = CH.board('8/8/8/8/8/8/8/8'), put = (c, ok) => { const e = []; for (let i = 0; i < 64; i++) if (b[i] === '.' && ok(i)) e.push(i); if (!e.length) return -1; const i = pick(e); b[i] = c; return i; };
    const bk = put('k', i => i < 8 || (i & 7) === 0 || (i & 7) === 7);
    put('K', i => kd(i, bk) >= 2 && kd(i, bk) <= 4);
    const set = kind === 'smother' ? ['N', 'Q'] : pick([['Q', 'R'], ['R', 'R'], ['Q', 'N'], ['R', 'B'], ['Q', 'B'], ['R', 'N', 'B']]);
    set.forEach(c => put(c, i => kd(i, bk) <= 4));
    for (let k = 0; k < (kind === 'smother' ? 3 : 1 + ri(3)); k++) put(pick(['p', 'p', 'r', 'n', 'b']), i => kd(i, bk) <= (kind === 'smother' ? 1 : 2) && !(i < 8 && false) && i >= 0 && !((i < 8 || i >= 56) && false));
    if (b.some((c, i) => /p/i.test(c) && (i < 8 || i >= 56))) continue;
    const p = { b, turn: 'w', cast: '', ep: -1, half: 0, full: 1 };
    if (CH.inCheck(Object.assign({}, p, { turn: 'b' })) || CH.inCheck(p)) continue;
    return p;
  }
}
function backRankPos() {
  for (;;) {
    const b = CH.board('8/8/8/8/8/8/8/8'), f = 5 + ri(3); b[f] = 'k';
    [f - 1, f, f + 1].forEach(x => { if (x >= 0 && x < 8 && rnd() < .85) b[8 + x] = 'p'; });
    const put = (c, ok) => { const e = []; for (let i = 0; i < 64; i++) if (b[i] === '.' && ok(i)) e.push(i); if (!e.length) return; b[pick(e)] = c; };
    put('K', i => i >= 48); put(pick(['R', 'Q']), i => i >= 16); if (rnd() < .6) put(pick(['R', 'B', 'N']), i => i >= 16);
    if (rnd() < .7) put(pick(['r', 'n', 'b', 'q']), i => i < 40 && i > 0); if (rnd() < .5) put('p', i => i >= 16 && i < 48);
    const p = { b, turn: 'w', cast: '', ep: -1, half: 0, full: 1 };
    if (CH.inCheck(Object.assign({}, p, { turn: 'b' })) || CH.inCheck(p)) continue;
    return p;
  }
}
/* ===== 전술 모양을 일부러 만들기 ===== */
const FILES = 'abcdefgh';
const sq = (f, r) => (f < 0 || f > 7 || r < 0 || r > 7) ? -1 : (7 - r) * 8 + f; /* f 0~7, r 0~7(1번 줄 = 0) */
const fr = i => [i & 7, 7 - (i >> 3)];
const NJ = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
function blank() { return CH.board('8/8/8/8/8/8/8/8'); }
function empties(b, ok) { const e = []; for (let i = 0; i < 64; i++) if (b[i] === '.' && (!ok || ok(i))) e.push(i); return e; }
function putR(b, c, ok) { const e = empties(b, i => !(/p/i.test(c) && (i < 8 || i >= 56)) && (!ok || ok(i))); if (!e.length) return -1; const i = pick(e); b[i] = c; return i; }
function fill(b, nw, nb) { for (let k = 0; k < nw; k++) putR(b, pick(['P', 'P', 'P', 'N', 'B', 'R'])); for (let k = 0; k < nb; k++) putR(b, pick(['p', 'p', 'p', 'n', 'b', 'r'])); }
function posOK(b) {
  if (b.indexOf('K') < 0 || b.indexOf('k') < 0 || kd(b.indexOf('K'), b.indexOf('k')) < 2) return null;
  const p = { b, turn: 'w', cast: '', ep: -1, half: 0, full: 1 };
  if (CH.inCheck(Object.assign({}, p, { turn: 'b' })) || CH.inCheck(p)) return null;
  return p;
}
function line(i, d, n) { const [f, r] = fr(i); return sq(f + d[0] * n, r + d[1] * n); }
const D8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
/* 어느 칸 to로 갈 수 있는 출발 칸(백 말 c가 빈 판에서) */
function fromFor(b, c, to) { const out = []; for (let i = 0; i < 64; i++) { if (b[i] !== '.' || i === to) continue; const t = b.slice(); t[i] = c; if (CH.pieceMoves({ b: t, turn: 'w', cast: '', ep: -1 }, i).some(m => m.to === to)) out.push(i); } return out; }
const BUILD = {
  nfork() { const b = blank(), x = ri(64), [f, r] = fr(x); const tg = NJ.map(d => sq(f + d[0], r + d[1])).filter(i => i >= 0); if (tg.length < 3) return null;
    const a = pick(tg); let c = pick(tg); if (c === a) return null; b[a] = 'k'; b[c] = pick(['q', 'r']); const st = fromFor(b, 'N', x); if (!st.length) return null; b[pick(st)] = 'N'; putR(b, 'K', i => kd(i, a) > 2); fill(b, 2, 2); return [b, x]; },
  pfork() { const b = blank(), f = 1 + ri(6), r = 2 + ri(3), x = sq(f, r + 1); b[sq(f, r)] = 'P'; if (b[x] !== '.') return null; const l = sq(f - 1, r + 2), rr = sq(f + 1, r + 2);
    b[l] = pick(['n', 'b', 'r', 'q']); b[rr] = pick(['n', 'b', 'r', 'q', 'k']); if (b.indexOf('k') < 0) putR(b, 'k', i => i < 24); putR(b, 'K', i => i >= 48); fill(b, 1, 2); return [b, x]; },
  qfork() { const b = blank(), x = ri(64); const ds = D8.slice().sort(() => rnd() - .5); const a = line(x, ds[0], 1 + ri(3)), c = line(x, ds[1], 1 + ri(3)); if (a < 0 || c < 0) return null;
    b[a] = 'k'; b[c] = pick(['r', 'b', 'n']); const st = fromFor(b, 'Q', x); if (!st.length) return null; b[pick(st)] = 'Q'; putR(b, 'K', i => kd(i, a) > 2); fill(b, 2, 2); return [b, x]; },
  dbl() { const b = blank(), pc = pick(['R', 'B']), x = ri(64); const ds = D8.filter(d => pc === 'R' ? !(d[0] && d[1]) : (d[0] && d[1])).sort(() => rnd() - .5); const a = line(x, ds[0], 1 + ri(3)), c = line(x, ds[1], 1 + ri(3)); if (a < 0 || c < 0) return null;
    b[a] = pick(['n', 'b', 'r', 'k']); b[c] = pick(['n', 'b', 'q']); if (pc === 'R' && /r/.test(b[a])) return null; const st = fromFor(b, pc, x); if (!st.length) return null; b[pick(st)] = pc; if (b.indexOf('k') < 0) putR(b, 'k'); putR(b, 'K', i => kd(i, b.indexOf('k')) > 2); fill(b, 2, 2); return [b, x]; },
  pinabs() { const b = blank(), k = ri(64), d = pick(D8.filter(d => d[0] && d[1])), xp = line(k, d, 1 + ri(2)), s = line(xp, d, 1 + ri(3)); if (xp < 0 || s < 0) return null;
    b[k] = 'k'; b[xp] = pick(['r', 'q', 'n']); const st = fromFor(b, 'B', s); if (!st.length) return null; b[pick(st)] = 'B'; putR(b, 'K', i => kd(i, k) > 2); fill(b, 2, 2); return [b, s]; },
  pinrel() { const b = blank(), k = ri(64), d = pick(D8), sl = d[0] && d[1] ? 'B' : 'R', xp = line(k, d, 1 + ri(2)), s = line(xp, d, 1 + ri(3)); if (xp < 0 || s < 0) return null;
    b[k] = 'q'; b[xp] = pick(['n', 'b', 'r']); if (sl === 'R' && b[xp] === 'r') return null; if (sl === 'B' && b[xp] === 'b') return null; const st = fromFor(b, sl, s); if (!st.length) return null; b[pick(st)] = sl; putR(b, 'k', i => i < 24); putR(b, 'K', i => i >= 40); fill(b, 2, 2); return [b, s]; },
  skewer() { const b = blank(), k = ri(64), d = pick(D8), sl = pick(d[0] && d[1] ? ['B', 'Q'] : ['R', 'Q']), y = line(k, d, -1 - ri(2)), s = line(k, d, 1 + ri(3)); if (y < 0 || s < 0) return null;
    b[k] = 'k'; b[y] = sl === 'Q' ? 'r' : pick(['q', 'r']); if (sl === 'R' && b[y] === 'r') return null; const st = fromFor(b, sl, s); if (!st.length) return null; b[pick(st)] = sl; putR(b, 'K', i => kd(i, k) > 2); fill(b, 1, 2); return [b, s]; },
  dischk() { const b = blank(), k = ri(64), d = pick(D8), sl = d[0] && d[1] ? 'B' : 'R', xp = line(k, d, 2 + ri(2)), s = line(xp, d, 1 + ri(2)); if (xp < 0 || s < 0) return null;
    b[k] = 'k'; b[s] = sl; b[xp] = pick(['N', 'B', 'R'].filter(c => c !== sl)); putR(b, pick(['q', 'r']), i => kd(i, k) <= 4); putR(b, 'K', i => kd(i, k) > 2); fill(b, 1, 2); return [b, null, xp]; },
  disatk() { const b = blank(), k = ri(64), d = pick(D8), sl = d[0] && d[1] ? 'B' : 'R', xp = line(k, d, 2 + ri(2)), s = line(xp, d, 1 + ri(2)); if (xp < 0 || s < 0) return null;
    b[k] = 'q'; b[s] = sl; b[xp] = pick(['N', 'B', 'R'].filter(c => c !== sl)); putR(b, 'k', i => kd(i, k) >= 2); putR(b, 'K', i => i >= 40); fill(b, 1, 2); return [b, null, xp]; },
  remdef() { const b = blank(), y = ri(64), dirs = D8.filter(d => !(d[0] && d[1])); const at = line(y, pick(dirs), 2 + ri(3)); if (at < 0) return null; b[y] = pick(['b', 'n']); b[at] = 'R';
    const [yf, yr] = fr(y), dsq = NJ.map(d => sq(yf + d[0], yr + d[1])).filter(i => i >= 0 && b[i] === '.'); if (!dsq.length) return null; const dd = pick(dsq); b[dd] = 'n';
    const st = []; for (let i = 0; i < 64; i++) { if (b[i] !== '.') continue; const t = b.slice(); t[i] = 'B'; if (CH.attacks(t, i).indexOf(dd) >= 0) st.push(i); } if (!st.length) return null; b[pick(st)] = 'B';
    putR(b, 'k', i => i < 24); putR(b, 'K', i => i >= 40); fill(b, 1, 1); return [b, null]; },
  overload() { const b = blank(), dd = ri(64); const y1 = line(dd, pick(D8), 1 + ri(2)), y2 = line(dd, pick(D8), 1 + ri(2)); if (y1 < 0 || y2 < 0 || y1 === y2) return null;
    b[dd] = pick(['q', 'r', 'b', 'n']); b[y1] = pick(['r', 'b', 'n']); b[y2] = pick(['r', 'b', 'n']); putR(b, pick(['R', 'Q', 'B'])); putR(b, pick(['R', 'B', 'N'])); putR(b, 'k', i => i < 24); putR(b, 'K', i => i >= 40); fill(b, 1, 1); return [b, null]; },
  dblchk() { return BUILD.dischk(); },
  decoy() { const b = blank(); b[sq(4 + ri(3), 7)] = 'k'; const k = b.indexOf('k'); b[line(k, [0, -1], 1)] = 'p'; putR(b, pick(['q', 'r']), i => i < 24); putR(b, 'Q', i => kd(i, k) <= 4); putR(b, pick(['N', 'R', 'B'])); putR(b, 'K', i => i >= 48); fill(b, 2, 2); return [b, null]; }
};
function fillM(secs) { const tm = Date.now();
/* 백랭크·스머더드는 1수 또는 2수 메이트 */
while ((Date.now() - tm) / 1000 < secs / 3 && bank.backrank.length < WANT) {
  const p = backRankPos(), m1 = mateIn1(p); if (m1.length < 1 || m1.length > 2) continue;
  if (!m1.every(m => /[RQ]/.test(m.pc) && (m.to >> 3) === 0)) continue;
  const fen = CH.fen(p); if (seen.has(fen)) continue; seen.add(fen);
  bank.backrank.push({ fen, good: m1.map(m => [CH.name(m.from), CH.name(m.to)]) });
}
while ((Date.now() - tm) / 1000 < secs * 2 / 3 && bank.smother.length < WANT) {
  const p = mate2Pos('smother'), m1 = mateIn1(p); if (m1.length !== 1 || m1[0].pc !== 'N') continue;
  const q = CH.make(p, m1[0]), k = q.b.indexOf('k'), r = k >> 3, f = k & 7; let full = true;
  for (let dr = -1; dr <= 1; dr++) for (let df = -1; df <= 1; df++) { if (!dr && !df) continue; const rr = r + dr, ff = f + df; if (rr < 0 || rr > 7 || ff < 0 || ff > 7) continue; if (!isB(q.b[rr * 8 + ff])) full = false; }
  if (!full) continue;
  const fen = CH.fen(p); if (seen.has(fen)) continue; seen.add(fen);
  bank.smother.push({ fen, good: [[CH.name(m1[0].from), CH.name(m1[0].to)]] });
}
while ((Date.now() - tm) / 1000 < secs && bank.mate2.length < WANT) {
  const p = mate2Pos('m2'), g = mate2(p); if (!g) continue;
  const fen = CH.fen(p); if (seen.has(fen)) continue; seen.add(fen);
  bank.mate2.push({ fen, good: g });
}
}
function fillMates() { const f = path.join(__dirname, 'm5_data.js'); vm.runInThisContext(fs.readFileSync(f, 'utf8')); Object.assign(bank, globalThis.M5DATA); Object.keys(bank).forEach(k => bank[k].forEach(it => seen.add(it.fen))); fillM(+(process.argv[3] || 300)); fs.writeFileSync(f, '/* 5마당 전술 문제 은행 — gen_m5.js가 만듦(직접 고치지 마세요). 모양: ' + Object.keys(bank).join(' ') + ' */\nwindow.M5DATA = ' + JSON.stringify(bank) + ';\n'); console.log(Object.keys(bank).map(k => k + ' ' + bank[k].length).join(' · ')); }
const KINDS = ['nfork', 'pfork', 'qfork', 'dbl', 'pinabs', 'pinrel', 'skewer', 'dischk', 'disatk', 'dblchk', 'remdef', 'overload', 'decoy'];
const DEPTH = { pinabs: 3, pinrel: 3, remdef: 3, overload: 3, decoy: 3 };
const bank = {}; KINDS.concat(['backrank', 'smother', 'mate2']).forEach(k => bank[k] = []);
const seen = new Set(), t0 = Date.now();
let n = 0;
function verify2(p, kind) {
  const sc = AI.scores(p, DEPTH[kind] || 2, { nodes: 12000 }), base = AI.evalW(p.b);
  if (!sc.length) return null; const best = sc[0];
  if (best.s > AI.MATE / 2 || best.s - base < 250) return null;
  const good = sc.filter(x => x.s >= best.s - 60); if (good.length > 2) return null;
  const next = sc.find(x => x.s < best.s - 60); if (next && next.s > best.s - 150) return null;
  if (!good.every(x => motifs(p, x.m).indexOf(kind) >= 0)) return null; /* 정답 수가 모두 그 모양이어야 */
  /* 정답이 그냥 공짜 말 잡기가 아니게(지키기 없애기·과부하는 잡기로 시작) */
  if (kind !== 'remdef' && kind !== 'overload' && best.m.cap !== '.' && !att(CH.make(p, best.m).b, best.m.to, 'b').length) return null;
  return good.map(x => [CH.name(x.m.from), CH.name(x.m.to)].concat(x.m.promo ? [x.m.promo.toUpperCase()] : []));
}
if (MODE === 'make') { /* 모자란 모양을 돌아가며 3초씩 */
while ((Date.now() - t0) / 1000 < SECS * 0.8 && KINDS.some(k => bank[k].length < WANT)) for (const kind of KINDS) {
  if (bank[kind].length >= WANT) continue; const tk = Date.now();
  while ((Date.now() - tk) / 1000 < 3 && bank[kind].length < WANT) {
    const r = BUILD[kind](); n++; if (!r) continue; const p = posOK(r[0]); if (!p) continue;
    const g = verify2(p, kind); if (!g) continue;
    const fen = CH.fen(p); if (seen.has(fen)) continue; seen.add(fen);
    bank[kind].push({ fen, good: g });
  }
}
}
if (MODE === 'make') {
fillM(SECS * 0.15);
const out = path.join(__dirname, 'm5_data.js');
fs.writeFileSync(out, '/* 5마당 전술 문제 은행 — gen_m5.js가 만듦(직접 고치지 마세요). 모양: ' + Object.keys(bank).join(' ') + ' */\nwindow.M5DATA = ' + JSON.stringify(bank) + ';\n');
console.log('국면 ' + n + '개 살펴봄 · ' + Object.keys(bank).map(k => k + ' ' + bank[k].length).join(' · '));
}
