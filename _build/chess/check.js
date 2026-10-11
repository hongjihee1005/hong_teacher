/* 체스 학습관 점검: node _build/chess/check.js
   ① 규칙 엔진 perft(처음 국면·캐슬링·앙파상·프로모션이 든 국면) ② 마당마다 차시 짜임 ③ 따라 하기·연습 문제를 여러 번 만들어
   정답이 있는지(고르기 정답이 보기에 있음, 누르기 정답 칸이 바른 이름, 놓기 칸이 비어 있고 말 상자와 맞음,
   별 모으기는 다음 한 수를 따라가면 가장 적은 횟수에 모두 모음, 대국은 인공지능끼리 두어 규칙대로 끝남) ④ 예시 그림의 말 옮기기 칸에 말이 있는지 */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const HERE = __dirname;
global.window = globalThis;
['rules.js', 'pieces.js'].forEach(f => vm.runInThisContext(fs.readFileSync(path.join(HERE, f), 'utf8'), { filename: f }));
const CH = globalThis.CH;
const errs = [];
function bad(where, msg) { errs.push(where + ': ' + msg); }

/* ① perft */
[[CH.START, [20, 400, 8902]],
 ['r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', [48, 2039]],
 ['8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', [14, 191, 2812]],
 ['r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1', [6, 264, 9467]],
 ['rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8', [44, 1486]]].forEach(([f, ns]) => {
  const p = CH.parse(f); ns.forEach((n, i) => { const r = CH.perft(p, i + 1); if (r !== n) bad('perft ' + f, 'depth ' + (i + 1) + ' ' + r + ' ≠ ' + n); });
});
if (CH.status(CH.parse('7k/6Q1/6K1/8/8/8/8/8 b - - 0 1')) !== 'mate') bad('status', '체크메이트를 못 알아봄');
if (CH.status(CH.parse('7k/8/6QK/8/8/8/8/8 b - - 0 1')) !== 'stale') bad('status', '스테일메이트를 못 알아봄');

/* ②③④ 마당 */
const R = {
  int: n => Math.floor(Math.random() * n), pick: a => a[Math.floor(Math.random() * a.length)],
  shuffle: a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  sq: () => CH.name(Math.floor(Math.random() * 64)),
  scatter(list) { const b = CH.board('8/8/8/8/8/8/8/8'), used = {}; list.forEach(c => { let i, n = 0; do { i = R.int(64); n++; } while ((used[i] || (/p/i.test(c) && (i < 8 || i > 55))) && n < 500); used[i] = 1; b[i] = c; }); return b; },
  opts(ans, pool, n) { const o = [ans]; R.shuffle(pool).forEach(x => { if (o.length < (n || 4) && o.indexOf(x) < 0) o.push(x); }); return R.shuffle(o); }
};
const SQ = /^[a-h][1-8]$/;
function board(b) { return b === undefined || b === null ? null : typeof b === 'string' ? CH.board(b.split(' ')[0]) : b; }
function checkMarks(where, m) { Object.keys(m || {}).forEach(k => { if (!SQ.test(k)) bad(where, '표시 칸 이름이 이상함 ' + k); }); }
function checkTask(where, T) {
  if (!T || !/^(click|pick|place|move|game)$/.test(T.type)) return bad(where, '문제 종류가 없음');
  if (!T.q) bad(where, '질문 글이 없음');
  const b = board(T.board && T.board.pos);
  if (b && b.length !== 64) bad(where, '판 칸 수가 64가 아님');
  checkMarks(where, T.board && T.board.marks);
  if (T.type === 'click') {
    const a = Array.isArray(T.ans) ? T.ans : [T.ans];
    if (!a.length) bad(where, '정답 칸이 없음 ' + T.q);
    a.forEach(s => { if (!SQ.test(s)) bad(where, '정답 칸 이름이 이상함 ' + s); });
    if (new Set(a).size !== a.length) bad(where, '정답 칸이 겹침');
  } else if (T.type === 'pick') {
    if (!Array.isArray(T.opts) || T.opts.length < 2) bad(where, '보기가 모자람');
    else { if (new Set(T.opts).size !== T.opts.length) bad(where, '보기가 겹침 ' + T.opts.join('/')); if (T.opts.indexOf(T.ans) < 0) bad(where, '정답이 보기에 없음: ' + T.ans + ' / ' + T.opts.join(',') + ' — ' + T.q); }
  } else if (T.type === 'move') { /* 별 모으기: next를 따라가면 정확히 par번에 별을 모두 모으는지 */
    if (!b || b[CH.idx(T.mover)] === '.' || !CH.isW(b[CH.idx(T.mover)])) return bad(where, '움직일 말이 없음 ' + T.mover);
    if (!T.stars || !T.stars.length) return bad(where, '별이 없음');
    T.stars.forEach(s => { if (!SQ.test(s) || s === T.mover) bad(where, '별 칸이 이상함 ' + s); });
    if (!(T.par >= 1 && T.par < 30)) return bad(where, '가장 적은 횟수가 이상함 ' + T.par);
    let pos = b.slice(), at = T.mover, rem = T.stars.slice(), n = 0;
    while (rem.length && n < 40) {
      const nx = T.next(at, rem);
      const ok = nx && CH.pieceMoves({ b: pos, turn: 'w', cast: '', ep: -1 }, CH.idx(at)).some(m => CH.name(m.to) === nx && (T.capture || pos[m.to] === '.'));
      if (!ok) return bad(where, '다음 한 수가 규칙에 맞지 않음 ' + at + '→' + nx);
      pos[CH.idx(nx)] = pos[CH.idx(at)]; pos[CH.idx(at)] = '.'; at = nx; n++;
      const k = rem.indexOf(nx); if (k >= 0) rem.splice(k, 1);
    }
    if (n !== T.par) bad(where, '다음 한 수를 따라가면 ' + n + '번, 가장 적은 횟수 ' + T.par);
  } else if (T.type === 'game') { /* 대국: 인공지능끼리 끝까지 두어 규칙에 맞게 끝나는지 */
    const G = T.game; if (!G || !G.moves || !G.play || !G.result || !G.ai) return bad(where, '대국 함수가 없음');
    let p = { b: b.slice(), turn: 'w' }, n = 0;
    while (!G.result(p) && n < 200) { const m = G.ai(p, n % 2 ? (T.level || 1) : 1); if (!m || !G.moves(p).some(x => x.from === m.from && x.to === m.to)) return bad(where, '인공지능 수가 규칙에 맞지 않음'); p = G.play(p, m); n++; }
    if (!G.result(p)) bad(where, '대국이 끝나지 않음');
  } else {
    const need = T.need || {}, ks = Object.keys(need);
    if (!ks.length) bad(where, '놓을 말이 없음');
    if (!b) bad(where, '놓기 판이 없음');
    ks.forEach(s => { if (!SQ.test(s)) bad(where, '놓을 칸 이름이 이상함 ' + s); else if (b && b[CH.idx(s)] !== '.') bad(where, '놓을 칸이 비어 있지 않음 ' + s); });
    const t = (T.tray || []).slice().sort().join(''), w = ks.map(s => need[s]).sort().join('');
    if (t !== w) bad(where, '말 상자와 놓을 말이 다름 ' + t + ' / ' + w);
  }
}
let nLes = 0, nTask = 0;
fs.readdirSync(HERE).filter(f => /^m\d\.js$/.test(f)).sort().forEach(f => {
  delete globalThis.MADANG;
  vm.runInThisContext(fs.readFileSync(path.join(HERE, f), 'utf8'), { filename: f });
  const MD = globalThis.MADANG, ids = new Set();
  if (!MD || !MD.units) return bad(f, 'MADANG이 없음');
  MD.units.forEach((u, ui) => u.lessons.forEach((l, li) => {
    nLes++;
    const where = f + ' ' + (ui + 1) + '-' + (li + 1) + ' ' + l.id;
    if (!l.id || ids.has(l.id)) bad(where, 'id가 없거나 겹침'); ids.add(l.id);
    if (!l.title || !l.sum) bad(where, '제목·마무리 글이 없음');
    if (!/^(easy|one|deep)$/.test(l.kind || '')) bad(where, '문제 종류(kind)가 없음');
    const has = t => l.screens.some(s => s.t === t);
    if (!has('say')) bad(where, '설명 화면이 없음');
    if (!has('ex')) bad(where, '예시 화면이 없음');
    if (!has('do')) bad(where, '따라 하기가 없음');
    l.screens.forEach((s, si) => {
      const w2 = where + ' 화면' + (si + 1);
      if ((s.t === 'say' || s.t === 'ex') && !s.text) bad(w2, '글이 없음');
      if (s.board) checkMarks(w2, s.board.marks);
      if (s.t === 'ex') {
        if (!s.frames || !s.frames.length) bad(w2, '예시 장면이 없음');
        let pos = board(s.board && s.board.pos) || CH.board('8/8/8/8/8/8/8/8');
        (s.frames || []).forEach((fr, k) => {
          checkMarks(w2 + ' 장면' + (k + 1), fr.marks);
          if (fr.pos) pos = board(fr.pos);
          if (fr.mv) { const a = CH.idx(fr.mv[0]), b = CH.idx(fr.mv[1]); if (pos[a] === '.') bad(w2, '장면' + (k + 1) + ' 옮길 말이 없음 ' + fr.mv[0]); pos = pos.slice(); pos[b] = pos[a]; pos[a] = '.'; }
        });
      }
      if (s.t === 'do') for (let k = 0; k < (typeof s.task === 'function' ? 50 : 1); k++) { nTask++; checkTask(w2, typeof s.task === 'function' ? s.task(R) : s.task); }
    });
    if (!l.practice || !(l.practice.n >= 6)) bad(where, '연습 문제 수가 모자람');
    else for (let k = 0, gm = 0; k < 400; k++) { nTask++; try { const T = l.practice.gen(R); if (T && T.type === 'game' && ++gm > 6) continue; checkTask(where + ' 연습', T); } catch (e) { bad(where + ' 연습', '만들다 오류 ' + e.message); break; } }
  }));
});
const uniq = [...new Set(errs)];
if (uniq.length) { console.log(uniq.slice(0, 40).join('\n')); console.log('체스 학습관 점검 실패: ' + uniq.length + '가지'); process.exit(1); }
console.log('체스 학습관 점검 통과: perft, 차시 ' + nLes + '개, 문제 ' + nTask + '개');
