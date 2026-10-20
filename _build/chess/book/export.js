/* 체스 교재용 자료 뽑기: node _build/chess/book/export.js m1 > 출력.json
   학습관 마당 자료(m1.js …)를 읽어 차시마다 설명·예시·문제를 JSON으로 내보냅니다.
   연습 문제는 차시마다 정해진 씨앗으로 만들어(같은 자료면 언제나 같은 문제) 교재에 고정합니다. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const CHESS = path.join(__dirname, '..');
global.window = globalThis;
['rules.js', 'pieces.js', 'ai.js'].forEach(f => vm.runInThisContext(fs.readFileSync(path.join(CHESS, f), 'utf8'), { filename: f }));
const CH = globalThis.CH, PN = globalThis.PIECES.NAME;
const MID = process.argv[2] || 'm1', N_PR = +(process.argv[3] || 5), N_RV = +(process.argv[4] || 0);
if (fs.existsSync(path.join(CHESS, MID + '_data.js'))) vm.runInThisContext(fs.readFileSync(path.join(CHESS, MID + '_data.js'), 'utf8'), { filename: MID + '_data.js' });

/* 씨앗 있는 무작위(mulberry32) — learn.js의 R과 같은 꼴 */
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function makeR(rand) {
  const R = {
    int: n => Math.floor(rand() * n), pick: a => a[Math.floor(rand() * a.length)],
    shuffle: a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
    sq: () => CH.name(Math.floor(rand() * 64)),
    scatter(list) { const b = CH.board('8/8/8/8/8/8/8/8'), used = {}; list.forEach(c => { let i, n = 0; do { i = R.int(64); n++; } while ((used[i] || (/p/i.test(c) && (i < 8 || i > 55))) && n < 500); used[i] = 1; b[i] = c; }); return b; },
    opts(ans, pool, n) { const o = [ans]; R.shuffle(pool).forEach(x => { if (o.length < (n || 4) && o.indexOf(x) < 0) o.push(x); }); return R.shuffle(o); }
  };
  return R;
}
const plain = t => String(t || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
function board(b) {
  if (!b) return null;
  const pos = b.pos === undefined ? '8/8/8/8/8/8/8/8' : typeof b.pos === 'string' ? b.pos.split(' ')[0] : CH.placement(b.pos);
  return { pos, marks: b.marks || {}, arrows: b.arrows || [], coords: b.coords !== false, swap: !!b.swap, flip: !!b.flip };
}
/* 한 수를 글로: 말 이름 + 출발 → 도착(잡기·프로모션), 정식 국면이면 기보(SAN)도 */
function mvInfo(p, g) {
  const fr = CH.idx(g[0]), to = CH.idx(g[1]), pc = p.b[fr], cap = p.b[to];
  let san = null;
  if (p.turn !== undefined && p.cast !== undefined) {
    const m = CH.legal(p).filter(x => x.from === fr && x.to === to && (!g[2] || !x.promo || x.promo.toUpperCase() === String(g[2]).toUpperCase()))[0];
    if (m) san = CH.san(p, m);
  }
  const promo = g[2] || (pc === 'P' && to < 8 ? 'Q' : pc === 'p' && to > 55 ? 'q' : '');
  return { from: g[0], to: g[1], promo: promo ? String(promo).toUpperCase() : '', pc, cap: cap !== '.' ? cap : '', san,
    ko: PN[pc.toUpperCase()] + ' ' + g[0] + ' → ' + g[1] + (cap !== '.' ? ' (' + PN[cap.toUpperCase()] + ' 잡기)' : '') + (promo ? ' (' + PN[String(promo).toUpperCase()] + (String(promo).toUpperCase() === 'N' ? '로' : '으로') + ' 프로모션)' : '') };
}
function legalOf(p, g) { const fr = CH.idx(g[0]), to = CH.idx(g[1]); return CH.legal(p).filter(x => x.from === fr && x.to === to && (!g[2] || !x.promo || x.promo.toUpperCase() === String(g[2]).toUpperCase()))[0]; }
function task(T) {
  if (!T) return null;
  const B = Object.assign({}, T.board || {});
  if (T.state && B.pos === undefined) B.pos = T.state.split(' ')[0];
  if (T.type === 'move') { B.marks = Object.assign({}, B.marks || {}); T.stars.forEach(s => { B.marks[s] = 'star'; }); }
  const o = { type: T.type, q: plain(T.q), board: T.type === 'game' && !T.board && !T.state ? null : board(B), all: !!T.all, kind: T.kind || '' };
  o.turn = T.state ? T.state.split(' ')[1] : 'w';
  if (T.type === 'move') {
    o.mover = T.mover; o.stars = T.stars.slice(); o.par = T.par || 0; o.path = [T.mover];
    let at = T.mover, st = T.stars.slice();
    for (let k = 0; k < 40 && st.length && T.next; k++) { const nx = T.next(at, st); if (!nx) break; at = nx; o.path.push(nx); st = st.filter(x => x !== nx); }
    if (st.length) o.path = null;
  }
  if (T.type === 'play') {
    const p = T.state ? CH.parse(T.state) : { b: typeof B.pos === 'string' ? CH.board(B.pos.split(' ')[0]) : B.pos.slice(), turn: 'w' };
    o.good = T.good.map(g => mvInfo(p, g));
  }
  if (T.type === 'line') {
    let p = CH.parse(T.state), good = T.good; const seq = [];
    o.alts = good.map(g => mvInfo(p, g));
    for (let k = 0; k < T.moves; k++) {
      if (!good || !good.length) break;
      const g = good[0], m = legalOf(p, g); if (!m) break;
      seq.push(Object.assign(mvInfo(p, g), { side: 'w' })); p = CH.make(p, m);
      if (CH.status(p) || k === T.moves - 1) break;
      const r = T.reply(p); if (!r) break;
      seq.push({ side: 'b', san: CH.san(p, r), ko: PN[p.b[r.from].toUpperCase()] + ' ' + CH.name(r.from) + ' → ' + CH.name(r.to) + (p.b[r.to] !== '.' ? ' (' + PN[p.b[r.to].toUpperCase()] + ' 잡기)' : ''), from: CH.name(r.from), to: CH.name(r.to) });
      p = CH.make(p, r); good = T.goodAt(p);
    }
    o.seq = seq; o.moves = T.moves; o.mate = !!T.mate;
    o.stepQ = typeof T.stepQ === 'string' ? plain(T.stepQ) : '';
  }
  if (T.type === 'game') o.level = T.level || 0;
  if (T.type === 'click') o.ans = [].concat(T.ans);
  if (T.type === 'pick') { o.opts = T.opts.slice(); o.ans = T.ans; }
  if (T.type === 'place') { o.need = Object.assign({}, T.need); o.tray = T.tray.slice(); }
  o.hint = (T.hint || []).map(h => plain(typeof h === 'string' ? h : h.text));
  o.ok = plain(T.ok);
  return o;
}
delete globalThis.MADANG;
vm.runInThisContext(fs.readFileSync(path.join(CHESS, MID + '.js'), 'utf8'), { filename: MID + '.js' });
const MD = globalThis.MADANG, out = { id: MD.id, no: MD.no, title: MD.title, rank: MD.rank, units: [] };
let no = 0;
MD.units.forEach((u, ui) => {
  const U = { title: u.title, lessons: [] };
  u.lessons.forEach(l => {
    no++;
    const L = { no, id: l.id, title: l.title, kind: l.kind, sum: plain(l.sum), say: [], ex: [], do: [], pr: [] };
    const R0 = makeR(rng(no * 7919 + 17));
    l.screens.forEach(s => {
      if (s.t === 'say') L.say.push({ text: plain(s.text), board: board(s.board), big: s.big || null });
      else if (s.t === 'ex') L.ex.push({ text: plain(s.text), board: board(s.board), frames: s.frames.map(f => Object.assign({}, f, { cap: plain(f.cap) })) });
      else if (s.t === 'do') L.do.push(task(typeof s.task === 'function' ? s.task(R0) : s.task));
    });
    /* 연습: 서로 다른 문제 N_PR개(질문+정답이 겹치지 않게) */
    const R = makeR(rng(no * 104729 + 3)), seen = new Set(L.do.filter(Boolean).map(t => t.q.replace(/ 보세요\.$/, '요.') + '|' + t.type)); /* 따라 하기와 같은 문제는 빼기 */
    for (let k = 0; k < 400 && L.pr.length < N_PR; k++) {
      const t = task(l.practice.gen(R)), key = t.q + '|' + JSON.stringify(MID === 'm1' ? (t.ans || t.need) : (t.ans || t.need || t.good || t.seq || t.stars)) + '|' + (t.board && t.board.pos);
      const qkey = t.q + '|' + t.type;
      if (seen.has(key) || (MID === 'm1' && (seen.has(t.q + '|' + t.type) || L.pr.filter(x => x.q + '|' + x.type === qkey).length >= 2))) continue;
      seen.add(key); L.pr.push(t);
    }
    /* 단원 마무리·확인 평가용 문제(다른 씨앗, 교재의 다른 문제와 겹치지 않게) */
    L.rv = [];
    const R2 = makeR(rng(no * 15485863 + 101));
    for (let k = 0; k < 400 && L.rv.length < N_RV; k++) {
      const t = task(l.practice.gen(R2)), key = t.q + '|' + JSON.stringify(t.ans || t.need || t.good || t.seq || t.stars) + '|' + (t.board && t.board.pos);
      if (seen.has(key)) continue;
      seen.add(key); L.rv.push(t);
    }
    U.lessons.push(L);
  });
  out.units.push(U);
});
/* 예시 장면: 말 옮기기를 따라가 장면마다의 판을 계산해 둠 */
out.units.forEach(U => U.lessons.forEach(L => L.ex.forEach(e => {
  let pos = CH.board(e.board ? e.board.pos : '8/8/8/8/8/8/8/8');
  e.frames = e.frames.map(f => {
    if (f.pos) pos = CH.board(typeof f.pos === 'string' ? f.pos : CH.placement(f.pos));
    if (f.mv) { pos = pos.slice(); const a = CH.idx(f.mv[0]), b = CH.idx(f.mv[1]); pos[b] = pos[a]; pos[a] = '.'; }
    return { cap: f.cap, board: Object.assign({}, e.board, { pos: CH.placement(pos), marks: f.marks || {}, arrows: f.arrows || [], swap: f.swap !== undefined ? !!f.swap : e.board.swap, flip: f.flip !== undefined ? !!f.flip : e.board.flip, coords: f.coords !== undefined ? f.coords !== false : e.board.coords }) };
  });
})));
out.pieceNames = PN;
process.stdout.write(JSON.stringify(out));
