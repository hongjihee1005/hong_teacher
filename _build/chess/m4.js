/* 체스 학습관 4마당 · 체크와 체크메이트, 특수 규칙 (40차시) — window.MADANG
   차시 짜임은 learn.js 맨 위 설명. 이번 마당부터 문제는 정식 국면(T.state = FEN: 차례·캐슬링·앙파상)으로 만들고,
   둘 수 있는 수는 규칙 엔진(CH.legal)이 정함(내 킹이 공격받는 수는 둘 수 없음). 대국·메이트 연습은 ai.js(CAI). */
(function () {
  'use strict';
  var CH = window.CH, PN = window.PIECES.NAME, jo = window.PIECES.jo, AI = window.CAI, F = 'abcdefgh';
  var E = '8/8/8/8/8/8/8/8', S0 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  var ALL = []; for (var i = 0; i < 64; i++) ALL.push(CH.name(i));
  function sqs(fn) { return ALL.filter(fn); }
  function M(list, v) { var o = {}; list.forEach(function (s) { o[s] = v; }); return o; }
  function J() { var o = {}; [].forEach.call(arguments, function (m) { Object.keys(m || {}).forEach(function (k) { o[k] = (o[k] || []).concat(Array.isArray(m[k]) ? m[k] : [m[k]]); }); }); return o; }
  function L(s, t) { var o = {}; o[s] = { t: 'label', s: t, small: 1 }; return o; }
  function shift(s, df, dr) { var f = F.indexOf(s[0]) + df, r = +s[1] + dr; return f >= 0 && f < 8 && r >= 1 && r <= 8 ? F[f] + r : null; }
  function pcAt(b, s) { return b[CH.idx(s)]; }
  function nm(c) { return PN[c.toUpperCase()]; }
  function B(o) { var b = CH.board(E); Object.keys(o).forEach(function (s) { b[CH.idx(s)] = o[s]; }); return b; }
  function P(b, turn, cast, ep) { return { b: b, turn: turn || 'w', cast: cast || '', ep: ep === undefined ? -1 : ep, half: 0, full: 1 }; }
  function FEN(b, turn, cast, ep) { return CH.fen(P(b, turn, cast, ep)); }
  function kd(a, b) { var x = CH.idx(a), y = CH.idx(b); return Math.max(Math.abs((x >> 3) - (y >> 3)), Math.abs((x & 7) - (y & 7))); }
  function ring8(s) { var o = []; [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]].forEach(function (d) { var t = shift(s, d[0], d[1]); if (t) o.push(t); }); return o; }
  function between(s0, s) {
    var df = F.indexOf(s[0]) - F.indexOf(s0[0]), dr = +s[1] - +s0[1], n = Math.max(Math.abs(df), Math.abs(dr));
    if (!(df === 0 || dr === 0 || Math.abs(df) === Math.abs(dr))) return [];
    var o = []; for (var k = 1; k < n; k++) o.push(shift(s0, df / n * k, dr / n * k)); return o;
  }
  function kingOf(b, c) { return CH.name(b.indexOf(c)); }
  function att(b, s, sd) { return CH.attackers(b, CH.idx(s), sd).map(CH.name); }
  function mvName(m) { return [CH.name(m.from), CH.name(m.to)].concat(m.promo ? [m.promo.toUpperCase()] : []); }
  function after(p, m) { return CH.make(p, m); }
  function isMate(p, m) { return CH.status(after(p, m)) === 'mate'; }
  function givesCheck(p, m) { return CH.inCheck(after(p, m)); }
  function clickQ(q, ans, board, hint, extra) { return Object.assign({ type: 'click', q: q, ans: ans, board: board, hint: hint }, extra || {}); }
  function pickQ(q, opts, ans, board, hint, extra) { return Object.assign({ type: 'pick', q: q, opts: opts, ans: ans, board: board, hint: hint }, extra || {}); }
  function playQ(q, fen, good, hint, extra) { return Object.assign({ type: 'play', q: q, state: fen, board: Object.assign({}, (extra || {}).board || {}), good: good, hint: hint }, extra || {}); }
  /* 좋은 수 목록(프로모션은 바꿀 말까지) — 같은 칸으로 가는 프로모션 수가 여럿이면 g[2]로 구분 */
  function goods(ms) { var o = [], seen = {}; ms.forEach(function (m) { var g = mvName(m), k = g.join('-'); if (!seen[k]) { seen[k] = 1; o.push(g); } }); return o; }
  /* 무작위 국면: spec = {wk, bk(칸 조건), w:[백 말], b:[흑 말], near(백 말을 흑 킹 가까이 n칸), turn} */
  function scene(R, spec) {
    for (var t = 0; t < 400; t++) {
      var b = CH.board(E), bk = R.pick(sqs(spec.bk || function () { return true; }));
      b[CH.idx(bk)] = 'k';
      var wkp = sqs(function (s) { return kd(s, bk) >= 2 && (!spec.wk || spec.wk(s, bk)); }); if (!wkp.length) continue;
      var wk = R.pick(wkp); b[CH.idx(wk)] = 'K';
      var okp = true;
      (spec.w || []).concat(spec.b || []).forEach(function (c) {
        var pool = sqs(function (s) { return pcAt(b, s) === '.' && !(/p/i.test(c) && /[18]/.test(s[1])) && (!spec.near || !CH.isW(c) || kd(s, bk) <= spec.near) && (!spec.bnear || CH.isW(c) || kd(s, bk) <= spec.bnear); });
        if (!pool.length) { okp = false; return; } b[CH.idx(R.pick(pool))] = c;
      });
      if (!okp) continue;
      var turn = spec.turn || 'w', p = P(b, turn);
      if (CH.inCheck(P(b, turn === 'w' ? 'b' : 'w'))) continue; /* 차례가 아닌 쪽이 체크면 있을 수 없는 국면 */
      if (spec.check !== undefined && CH.inCheck(p) !== spec.check) continue;
      if (!CH.legal(p).length) continue;
      return p;
    }
    return null;
  }
  var SHAPE = { R: '룩은 가로·세로로', B: '비숍은 대각선으로', Q: '퀸은 가로·세로·대각선으로', N: '나이트는 L자로', P: '폰은 대각선 앞으로', K: '킹은 한 칸' };

  /* ===== 16단원 체크 ===== */
  function isCheckQ(R) {
    for (var t = 0; t < 200; t++) {
      var p = scene(R, { bk: function (s) { return /[c-f][4-7]/.test(s); }, w: [R.pick(['Q', 'R', 'B', 'N']), R.pick(['R', 'B', 'N', 'P'])], b: [R.pick(['p', 'n'])], turn: 'b', near: 4 });
      if (!p) continue; var c = CH.inCheck(p); if (R.int(2) !== +c) continue;
      var bk = kingOf(p.b, 'k');
      return pickQ('흑 킹이 <b>체크</b>를 받고 있나요?', ['체크예요', '체크가 아니에요'], c ? '체크예요' : '체크가 아니에요', { pos: p.b, marks: M([bk], 'ring') },
        ['백 말 가운데 흑 킹이 있는 칸으로 갈 수 있는 말이 있나요?', { text: c ? '이 말을 봐요.' : '백 말이 갈 수 있는 길을 따라가 봐요.', marks: c ? M(att(p.b, bk, 'w'), 'hint') : {} }], { kind: 'one' });
    }
  }
  function giveQ(R) {
    for (var t = 0; t < 300; t++) {
      var p = scene(R, { bk: function (s) { return /[b-g][5-8]/.test(s); }, w: [R.pick(['Q', 'R', 'B', 'N']), R.pick(['R', 'B', 'N'])], b: [R.pick(['p', 'n', 'b'])], near: 5 });
      if (!p) continue; var ms = CH.legal(p), ch = ms.filter(function (m) { return givesCheck(p, m); });
      if (!ch.length || ch.length > 4) continue;
      var bk = kingOf(p.b, 'k');
      return playQ('흑 킹에게 <b>체크</b>를 주는 수를 두어요.', CH.fen(p), goods(ch), ['흑 킹이 있는 칸을 다음에 잡을 수 있게 말을 옮겨요.', { text: '체크를 줄 수 있는 말이 반짝여요.', marks: M([CH.name(ch[0].from)], 'hint') }],
        { kind: 'one', board: { marks: M([bk], 'ring') }, why: function (f, s) { return { text: '그 수는 체크가 아니에요. 옮긴 뒤에 흑 킹 칸으로 갈 수 있는 백 말이 없어요.', marks: J(M([s], 'bad'), M([bk], 'ring')) }; } });
    }
  }
  function whoQ(R) {
    for (var t = 0; t < 300; t++) {
      var p = scene(R, { bk: function (s) { return /[b-g][3-7]/.test(s); }, w: [R.pick(['Q', 'R', 'B']), R.pick(['N', 'B', 'R']), 'P'], b: [R.pick(['p', 'n'])], turn: 'b', check: true, near: 4 });
      if (!p) continue; var bk = kingOf(p.b, 'k'), a = att(p.b, bk, 'w');
      return clickQ('흑 킹에게 체크를 주고 있는 백 말을 <b>모두</b> 눌러요.', a, { pos: p.b, marks: M([bk], 'ring') }, ['흑 킹 칸에서 거꾸로 룩 길·비숍 길·나이트 자리·폰 자리를 살펴요.', { text: '체크한 말 하나가 반짝여요.', marks: M([a[0]], 'hint') }],
        { all: true, kind: 'one', why: function (s) { var c = pcAt(p.b, s); return c !== '.' && CH.isW(c) ? { text: '그 백 ' + jo(nm(c), '은') + ' 흑 킹 칸으로 갈 수 없어요.', marks: M([s], 'bad') } : { text: '체크를 준 말은 백 말이에요.', marks: M([s], 'bad') }; } });
    }
  }
  function kingMovesQ(R, withBK) {
    for (var t = 0; t < 300; t++) {
      var p = scene(R, { bk: function (s) { return true; }, wk: function (s, bk) { return withBK ? kd(s, bk) === 2 : /[b-g][2-7]/.test(s); }, w: [], b: withBK ? [] : [R.pick(['r', 'b', 'q', 'n']), R.pick(['n', 'b', 'p'])] });
      if (!p) continue; var wk = kingOf(p.b, 'K'), ms = CH.legalFrom(p, CH.idx(wk)).map(function (m) { return CH.name(m.to); });
      var all = ring8(wk).filter(function (s) { return pcAt(p.b, s) === '.' || !CH.isW(pcAt(p.b, s)); });
      if (!ms.length || ms.length === all.length) continue;
      return clickQ('백 킹이 <b>갈 수 있는</b> 칸을 <b>모두</b> 눌러요. (흑 말이 공격하는 칸은 갈 수 없어요)', ms, { pos: p.b, marks: M([wk], 'sel') },
        [withBK ? '킹끼리는 붙을 수 없어요. 흑 킹 둘레 칸에는 못 가요.' : '흑 말마다 공격하는 칸을 살펴요. 그 칸은 빼요.', { text: '갈 수 있는 칸 하나가 반짝여요.', marks: M([ms[0]], 'hint') }],
        { all: true, kind: 'one', why: function (s) { var b2 = p.b.slice(); b2[CH.idx(wk)] = '.'; var a = att(b2, s, 'b'); return a.length ? { text: '그 칸은 흑 ' + jo(nm(pcAt(p.b, a[0])), '이') + ' 공격하는 칸이라 킹이 갈 수 없어요.', marks: J(M([s], 'bad'), M(a, 'ring')) } : { text: '킹은 둘레 한 칸만 가요.', marks: M([s], 'bad') }; } });
    }
  }
  function pinQ(R) {
    for (var t = 0; t < 400; t++) {
      var b = CH.board(E), wk = R.pick(sqs(function (s) { return /[b-g][1-3]/.test(s); })), d = R.pick([[0, 1], [1, 1], [-1, 1], [1, 0], [-1, 0]]), k = R.int(2) + 1;
      b[CH.idx(wk)] = 'K'; var ps = shift(wk, d[0] * k, d[1] * k), ss = shift(wk, d[0] * (k + 2 + R.int(2)), d[1] * (k + 2 + R.int(2)));
      if (!ps || !ss || between(wk, ss).indexOf(ps) < 0) continue;
      var slider = d[0] && d[1] ? R.pick(['b', 'q']) : R.pick(['r', 'q']), pc = R.pick(['N', 'B', 'R', 'Q']);
      b[CH.idx(ps)] = pc; b[CH.idx(ss)] = slider; if (between(wk, ss).some(function (x) { return x !== ps && pcAt(b, x) !== '.'; })) continue;
      var bks = sqs(function (s) { return pcAt(b, s) === '.' && kd(s, wk) >= 3 && /[5-8]/.test(s[1]); }); b[CH.idx(R.pick(bks))] = 'k';
      var p = P(b, 'w'); if (CH.inCheck(P(b, 'b')) || CH.inCheck(p)) continue;
      var pseudo = CH.pieceMoves(p, CH.idx(ps)).map(function (m) { return CH.name(m.to); }), legal = CH.legalFrom(p, CH.idx(ps)).map(function (m) { return CH.name(m.to); });
      var no = pseudo.filter(function (s) { return legal.indexOf(s) < 0; }); if (!no.length) continue;
      var yes = R.int(2) && legal.length, st = yes ? R.pick(legal) : R.pick(no);
      return pickQ('동그라미 친 백 ' + jo(nm(pc), '이') + ' 별 칸으로 가도 될까요?', ['갈 수 있어요', '갈 수 없어요'], yes ? '갈 수 있어요' : '갈 수 없어요', { pos: b, marks: J(M([ps], 'ring'), M([st], 'star')) },
        ['그 말이 비키면 백 킹이 흑 말에게 공격받나요?', { text: '이 흑 말과 백 킹 사이를 봐요.', marks: M([ss, wk], 'ring') }], { kind: 'one' });
    }
  }
  var u16 = [
    { id: 'chk-what', title: '체크란?', kind: 'easy',
      screens: [
        { t: 'say', text: '4마당에서는 체스에서 가장 중요한 규칙을 배워요. 킹이 상대 말에게 <b>공격받고 있는 것</b>을 <b>체크</b>라고 해요.', board: { pos: B({ e8: 'k', e1: 'R', a1: 'K' }), marks: J(M(['e8'], 'bad'), M(['e1'], 'ring')), arrows: [['e1', 'e8']] } },
        { t: 'say', text: '킹은 잡힐 수 없는 말이에요. 그래서 체크를 받으면 <b>바로 다음 수에 반드시</b> 체크에서 벗어나야 해요. 다른 수는 둘 수 없어요.', board: { pos: B({ e8: 'k', e1: 'R', a1: 'K' }), marks: M(['e8'], 'bad') } },
        { t: 'say', text: '체크를 준 사람은 “체크!”라고 말해 주기도 해요(꼭 말하지 않아도 돼요). 상대가 체크인지 아닌지는 늘 스스로 살펴야 해요.', board: { pos: B({ e8: 'k', b5: 'B', a1: 'K' }), marks: M(['e8'], 'bad'), arrows: [['b5', 'e8']] } },
        { t: 'say', text: '체크를 주는 말은 무엇이든 될 수 있어요. 룩·비숍·퀸·나이트·폰 모두요. (킹은 상대 킹에게 다가갈 수 없어서 체크를 못 줘요.)', board: { pos: B({ e8: 'k', f6: 'N', a1: 'K' }), marks: M(['e8'], 'bad'), arrows: [['f6', 'e8']] } },
        { t: 'ex', text: '여러 가지 체크', board: { pos: B({ e8: 'k', a1: 'K', e1: 'R' }) },
          frames: [{ marks: M(['e8'], 'bad'), cap: '룩의 체크' }, { pos: B({ e8: 'k', a1: 'K', b5: 'B' }), marks: M(['e8'], 'bad'), cap: '비숍의 체크' }, { pos: B({ e8: 'k', a1: 'K', d6: 'N' }), marks: M(['e8'], 'bad'), cap: '나이트의 체크' }, { pos: B({ e8: 'k', a1: 'K', d7: 'P' }), marks: M(['e8'], 'bad'), cap: '폰의 체크(대각선 앞)' }, { pos: B({ e8: 'k', a1: 'K', e2: 'R', e5: 'p' }), marks: M(['e8'], 'ok'), cap: '사이에 말이 있으면 체크가 아니에요.' }] },
        { t: 'do', task: pickQ('흑 킹이 체크를 받고 있나요?', ['체크예요', '체크가 아니에요'], '체크예요', { pos: B({ d8: 'k', h4: 'B', a1: 'K' }), marks: M(['d8'], 'ring') }, ['비숍의 대각선을 따라가 봐요.']) },
        { t: 'do', task: pickQ('흑 킹이 체크를 받고 있나요?', ['체크예요', '체크가 아니에요'], '체크가 아니에요', { pos: B({ d8: 'k', d1: 'R', d5: 'n', a1: 'K' }), marks: M(['d8'], 'ring') }, ['룩과 킹 사이에 말이 있나요?']) }
      ],
      practice: { n: 8, gen: function (R) { return R.int(4) ? isCheckQ(R) : pickQ('체크를 받으면 어떻게 해야 하나요?', R.shuffle(['바로 체크에서 벗어나야 해요', '다른 수를 두어도 돼요', '한 번 쉬어요']), '바로 체크에서 벗어나야 해요', { pos: B({ e8: 'k', e1: 'R', a1: 'K' }), marks: M(['e8'], 'bad') }, ['킹은 잡힐 수 없는 말이에요.']); } },
      sum: '킹이 공격받는 것이 <b>체크</b>예요. 체크를 받으면 <b>바로</b> 벗어나야 해요.' },
    { id: 'chk-give', title: '체크 주는 수', kind: 'one',
      screens: [
        { t: 'say', text: '이번에는 내가 상대 킹에게 체크를 줘 봐요. 내 말을 옮겨서, 옮긴 뒤에 <b>그 말이 상대 킹 칸으로 갈 수 있게</b> 하면 체크예요.', board: { pos: B({ e8: 'k', a1: 'R', h1: 'K' }), marks: M(['e8'], 'ring'), arrows: [['a1', 'a8']] } },
        { t: 'say', text: '체크는 상대를 바쁘게 만들어요. 하지만 체크만 준다고 좋은 것은 아니에요. 체크한 말이 잡히면 손해예요!', board: { pos: B({ e8: 'k', d1: 'Q', h1: 'K' }), marks: J(M(['d7'], 'x')) } },
        { t: 'ex', text: '체크를 주는 수를 찾아요.', board: { pos: B({ g8: 'k', a1: 'R', c1: 'B', h1: 'K' }) },
          frames: [{ marks: M(['g8'], 'ring'), cap: '흑 킹 g8에게 체크를 주려면?' }, { mv: ['a1', 'a8'], marks: J(M(['g8'], 'bad'), M(['a8'], 'hi')), cap: '룩 a8: 8번 가로줄로 체크!' }, { pos: B({ g8: 'k', a1: 'R', c1: 'B', h1: 'K' }), mv: ['c1', 'h6'], marks: M(['h6'], 'hi'), cap: '비숍 h6은? h6에서 g7, f8… g8은 대각선이 아니라 체크가 아니에요.' }] },
        { t: 'do', task: function (R) { return giveQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return giveQ(R); } },
      sum: '내 말을 옮겨 <b>상대 킹 칸을 공격하면</b> 체크예요.' },
    { id: 'chk-who', title: '어느 말이 체크했나', kind: 'one',
      screens: [
        { t: 'say', text: '체크를 받으면 먼저 <b>어느 말이</b> 체크했는지 찾아야 벗어날 방법을 알 수 있어요.', board: { pos: B({ e1: 'K', e8: 'r', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['e8'], 'ring')) } },
        { t: 'say', text: '킹 칸에서 거꾸로 살펴요: 가로·세로(룩·퀸), 대각선(비숍·퀸·폰), L자 자리(나이트). 가끔 <b>두 말이 한꺼번에</b> 체크하기도 해요. 이것을 <b>더블 체크</b>라고 해요.', board: { pos: B({ e1: 'K', e8: 'r', d3: 'n', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['e8', 'd3'], 'ring')) } },
        { t: 'ex', text: '체크한 말 찾기', board: { pos: B({ d4: 'k', d1: 'R', g7: 'B', b6: 'N', a1: 'K' }) },
          frames: [{ marks: M(['d4'], 'bad'), cap: '흑 킹 d4가 체크예요. 누가 했을까요?' }, { marks: J(M(['d4'], 'bad'), M(['d1'], 'ring')), arrows: [['d1', 'd4']], cap: 'd1 룩이 세로로!' }, { marks: J(M(['d4'], 'bad'), M(['d1', 'g7'], 'ring')), arrows: [['g7', 'd4']], cap: 'g7 비숍도 대각선으로! 더블 체크예요.' }, { marks: J(M(['d4'], 'bad'), M(['d1', 'g7'], 'ring'), M(['b6'], 'x')), cap: 'b6 나이트는 d4로 갈 수 없어요(c4·d5·d7…).' }] },
        { t: 'do', task: function (R) { return whoQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return whoQ(R); } },
      sum: '체크를 받으면 킹 칸에서 거꾸로 살펴 <b>체크한 말</b>을 찾아요. 두 말이면 더블 체크!' },
    { id: 'chk-kingsafe', title: '킹은 공격받는 칸으로 못 가요', kind: 'one',
      screens: [
        { t: 'say', text: '킹은 <b>상대 말이 공격하는 칸</b>으로 갈 수 없어요. 스스로 체크 속으로 들어가는 것이니까요.', board: { pos: B({ e4: 'K', a5: 'r', h8: 'k' }), marks: J(M(['e4'], 'sel'), M(['d5', 'e5', 'f5'], 'x'), M(['d4', 'f4', 'd3', 'e3', 'f3'], 'dot')) } },
        { t: 'say', text: '그래서 킹이 움직일 때는 둘레 칸마다 <b>“여기를 공격하는 상대 말이 있나?”</b> 따져요. 상대 폰은 대각선 앞(아래쪽)을 공격한다는 것도 기억해요.', board: { pos: B({ e4: 'K', f6: 'p', h8: 'k' }), marks: J(M(['e4'], 'sel'), M(['e5', 'g5'], 'x')) } },
        { t: 'say', text: '3마당에서 “킹은 지켜진 말을 못 잡아요”라고 했지요? 지켜진 말을 잡으면 킹이 공격받는 칸에 서게 되니까 그래요.', board: { pos: B({ e4: 'K', e5: 'p', f6: 'p', h8: 'k' }), marks: J(M(['e4'], 'sel'), M(['e5'], 'x'), M(['f6'], 'ring')) } },
        { t: 'ex', text: '킹이 갈 수 있는 칸', board: { pos: B({ d4: 'K', h5: 'r', b6: 'n', h8: 'k' }) },
          frames: [{ marks: M(['d4'], 'sel'), cap: '백 킹 d4. 흑 룩 h5, 흑 나이트 b6' }, { marks: J(M(['d4'], 'sel'), M(['c5', 'd5', 'e5'], 'x')), cap: '룩이 5번 가로줄을 공격해요.' }, { marks: J(M(['d4'], 'sel'), M(['c5', 'd5', 'e5', 'c4'], 'x')), cap: '나이트가 c4(그리고 d5)를 공격해요.' }, { marks: J(M(['d4'], 'sel'), M(['c3', 'd3', 'e3', 'e4'], 'dot')), cap: '남은 칸: c3, d3, e3, e4' }] },
        { t: 'do', task: function (R) { return kingMovesQ(R, false); } }
      ],
      practice: { n: 8, gen: function (R) { return kingMovesQ(R, false); } },
      sum: '킹은 <b>상대 말이 공격하는 칸</b>으로 갈 수 없어요.' },
    { id: 'chk-kings', title: '킹끼리는 붙을 수 없어요', kind: 'one',
      screens: [
        { t: 'say', text: '두 킹은 <b>바로 옆에 붙을 수 없어요.</b> 킹도 둘레 한 칸을 공격하니까, 붙으면 서로 체크 속에 들어가게 돼요.', board: { pos: B({ e4: 'K', e6: 'k' }), marks: J(M(['d5', 'e5', 'f5'], 'x')) } },
        { t: 'say', text: '그래서 두 킹 사이에는 언제나 <b>한 칸 이상</b> 빈칸이 있어요. 킹끼리 마주 보고 한 칸 사이를 두고 선 모습을 <b>오포지션</b>이라고 해요(6마당 엔드게임에서 다시 나와요).', board: { pos: B({ e4: 'K', e6: 'k' }), marks: M(['e5'], 'ring') } },
        { t: 'ex', text: '킹이 다가갈 수 있는 곳', board: { pos: B({ d4: 'K', f5: 'k' }) },
          frames: [{ marks: J(M(['d4'], 'sel'), M(ring8('f5'), 'soft')), cap: '흑 킹 둘레 칸(연한 칸)에는 백 킹이 못 가요.' }, { marks: J(M(['d4'], 'sel'), M(['e4', 'e5'], 'x'), M(['c3', 'c4', 'c5', 'd3', 'd5', 'e3'], 'dot')), cap: '그래서 e4·e5는 안 돼요. e3은 흑 킹과 두 칸 떨어져서 괜찮아요.' }] },
        { t: 'do', task: function (R) { return kingMovesQ(R, true); } }
      ],
      practice: { n: 8, gen: function (R) { return R.int(4) ? kingMovesQ(R, true) : pickQ('두 킹이 바로 옆 칸에 붙어 설 수 있나요?', ['붙을 수 있어요', '붙을 수 없어요'], '붙을 수 없어요', { pos: B({ d4: 'K', e5: 'k' }), marks: M(['d4', 'e5'], 'x') }, ['킹도 둘레 한 칸을 공격해요.']); } },
      sum: '두 킹은 <b>붙을 수 없어요.</b> 사이에 언제나 한 칸 이상!' },
    { id: 'chk-pin', title: '내 킹을 위험하게 하는 수는 못 둬요', kind: 'one',
      screens: [
        { t: 'say', text: '킹 말고 다른 말을 움직일 때도 조심해요. 그 말이 비키면 <b>내 킹이 공격받게</b> 된다면, 그 수는 둘 수 없어요.', board: { pos: B({ e1: 'K', e4: 'N', e8: 'r', h8: 'k' }), marks: J(M(['e4'], 'ring'), M(['e8'], 'bad')), arrows: [['e8', 'e1']] } },
        { t: 'say', text: '이렇게 킹 앞을 막느라 움직이지 못하는 말을 <b>핀(pin)</b>에 걸렸다고 해요. 핀은 5마당 전술에서 자세히 배워요.', board: { pos: B({ e1: 'K', e4: 'N', e8: 'r', h8: 'k' }), marks: M(['e4'], 'x') } },
        { t: 'say', text: '핀에 걸린 말도 <b>같은 줄을 따라서는</b> 움직일 수 있어요. 비켜나지만 않으면 킹이 여전히 가려지니까요. (룩·퀸은 세로줄을 따라, 비숍·퀸은 대각선을 따라)', board: { pos: B({ e1: 'K', e4: 'R', e8: 'r', h8: 'k' }), marks: J(M(['e4'], 'sel'), M(['e2', 'e3', 'e5', 'e6', 'e7', 'e8'], 'dot'), M(['d4', 'f4'], 'x')) } },
        { t: 'ex', text: '움직일 수 없는 나이트', board: { pos: B({ e1: 'K', e4: 'N', e8: 'r', h8: 'k' }) },
          frames: [{ marks: J(M(['e4'], 'ring')), cap: '나이트가 e4에서 흑 룩을 막고 있어요.' }, { mv: ['e4', 'f6'], marks: J(M(['e1'], 'bad')), arrows: [['e8', 'e1']], cap: '나이트가 비키면 백 킹이 체크! 그래서 이 수는 둘 수 없어요.' }] },
        { t: 'do', task: function (R) { return pinQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return pinQ(R); } },
      sum: '비키면 내 킹이 공격받는 말은 <b>움직일 수 없어요</b>(핀). 같은 줄을 따라서는 갈 수 있어요.' }
  ];

  /* ===== 17단원 체크 벗어나기 ===== */
  function escScene(R, kind) {
    for (var t = 0; t < 600; t++) {
      var spec = { bk: function (s) { return /[5-8]/.test(s[1]); }, wk: function (s) { return /[b-g][1-4]/.test(s); }, w: [R.pick(['R', 'B', 'N', 'Q']), R.pick(['P', 'N', 'B', 'R'])], b: [kind === 'block' ? R.pick(['r', 'b', 'q']) : R.pick(['r', 'b', 'q', 'n']), R.pick(['p', 'n', 'b'])], check: true };
      if (kind === 'double') spec.b = [R.pick(['r', 'b', 'q']), R.pick(['n', 'b', 'r']), 'p'];
      var p = scene(R, spec); if (!p) continue;
      var wk = kingOf(p.b, 'K'), ch = att(p.b, wk, 'b');
      if (kind === 'double' ? ch.length !== 2 : ch.length !== 1) continue;
      var ms = CH.legal(p), kingM = ms.filter(function (m) { return CH.name(m.from) === wk; }), take = ms.filter(function (m) { return CH.name(m.to) === ch[0] && CH.name(m.from) !== wk; }),
        block = ms.filter(function (m) { return CH.name(m.from) !== wk && between(ch[0], wk).indexOf(CH.name(m.to)) >= 0; });
      var good = { run: kingM, take: take.concat(kingM.filter(function (m) { return CH.name(m.to) === ch[0]; })), block: block, double: kingM, any: null }[kind];
      if (kind === 'any') {
        if (ms.length < 3) continue;
        var sc = ms.map(function (m) { return -AI.evalW(after(p, m).b) * -1; }); /* 백 입장 점수 */
        var deep = ms.map(function (m) { var q = after(p, m), r = AI.best(q, 1, { nodes: 3000 }); return r ? AI.evalW(after(q, r).b) : AI.evalW(q.b); });
        var mx = Math.max.apply(null, deep); good = ms.filter(function (m, k) { return deep[k] >= mx - 60; });
        if (good.length === ms.length) continue;
      }
      if (!good.length) continue;
      if (kind !== 'any' && kind !== 'double' && good.length === ms.length) continue;
      return { p: p, wk: wk, ch: ch, good: goods(good), all: ms };
    }
  }
  var ESC = { run: '킹을 <b>피해서</b>', block: '사이를 <b>막아서</b>', take: '체크한 말을 <b>잡아서</b>', any: '<b>가장 좋은 방법으로</b>', double: '' };
  function escQ(R, kind) {
    var sc = escScene(R, kind);
    var q = kind === 'double' ? '<b>더블 체크</b>예요! 체크에서 벗어나요.' : '백 킹이 체크예요! ' + ESC[kind] + ' 체크에서 벗어나요.';
    return playQ(q, CH.fen(sc.p), sc.good,
      [{ run: '킹이 갈 수 있는 칸 가운데, 흑 말이 공격하지 않는 칸을 찾아요.', block: '체크한 흑 말과 백 킹 사이 빈칸에 백 말을 놓아요.', take: '체크한 흑 말을 잡을 수 있는 백 말을 찾아요.', any: '피하기·막기·잡기 가운데, 말을 잃지 않는 방법을 골라요.', double: '두 말이 한꺼번에 체크하면 막거나 잡아도 다른 하나가 남아요. 킹이 피해야 해요.' }[kind],
        { text: '움직이면 좋은 말이 반짝여요.', marks: M([sc.good[0][0]], 'hint') }],
      { kind: kind === 'any' || kind === 'double' ? 'deep' : 'one', board: { marks: J(M([sc.wk], 'bad'), M(sc.ch, 'ring')) },
        why: function (f, s) {
          if (kind === 'any') { return { text: '그 수도 체크에서는 벗어나지만, 그 뒤에 말을 잃거나 손해를 봐요. 더 좋은 방법이 있어요.', marks: M([s], 'bad') }; }
          return { text: '이번에는 ' + (ESC[kind] || '킹을 피해서').replace(/<\/?b>/g, '') + ' 벗어나 봐요.', marks: J(M([s], 'bad'), M(sc.ch, 'ring')) };
        } });
  }
  var u17 = [
    { id: 'esc-run', title: '체크 벗어나기 ① 피하기', kind: 'one',
      screens: [
        { t: 'say', text: '체크에서 벗어나는 방법은 <b>세 가지</b>예요: <b>피하기 · 막기 · 잡기.</b> (3마당의 ‘위험한 말 구하기’와 비슷하지만, 킹은 지키기로는 구할 수 없어요.)', board: { pos: B({ e1: 'K', e8: 'r', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['e8'], 'ring')) } },
        { t: 'say', text: '첫 번째, <b>피하기</b>: 킹을 공격받지 않는 칸으로 옮겨요. 같은 줄 위로 피하면 여전히 체크라는 것을 조심해요!', board: { pos: B({ e1: 'K', e8: 'r', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['d1', 'f1', 'd2', 'f2'], 'dot'), M(['e2'], 'x')) } },
        { t: 'ex', text: '피하기', board: { pos: B({ e1: 'K', e8: 'r', a2: 'r', h8: 'k' }) },
          frames: [{ marks: J(M(['e1'], 'bad'), M(['e8'], 'ring')), cap: '흑 룩 e8이 체크!' }, { marks: J(M(['e2', 'd2', 'f2'], 'x'), M(['d1', 'f1'], 'dot')), cap: 'e2는 같은 줄, d2·f2는 a2 룩이 공격해요.' }, { mv: ['e1', 'f1'], marks: M(['f1'], 'ok'), cap: 'f1로 피했어요!' }] },
        { t: 'do', task: function (R) { return escQ(R, 'run'); } }
      ],
      practice: { n: 8, gen: function (R) { return escQ(R, 'run'); } },
      sum: '<b>피하기</b>: 킹을 공격받지 않는 칸으로 옮겨요. 같은 줄 위로 피하면 안 돼요.' },
    { id: 'esc-block', title: '체크 벗어나기 ② 막기', kind: 'one',
      screens: [
        { t: 'say', text: '두 번째, <b>막기</b>: 체크한 말과 내 킹 <b>사이</b>에 내 말을 놓아요. 룩·비숍·퀸처럼 멀리서 하는 체크만 막을 수 있어요.', board: { pos: B({ e1: 'K', e8: 'r', c3: 'N', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['e2', 'e3', 'e4', 'e5', 'e6', 'e7'], 'soft')) } },
        { t: 'say', text: '나이트나 폰의 체크, 그리고 바로 옆에서 하는 체크는 사이가 없어서 막을 수 없어요.', board: { pos: B({ e1: 'K', d3: 'n', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['d3'], 'ring')) } },
        { t: 'ex', text: '막기', board: { pos: B({ e1: 'K', e8: 'r', c3: 'N', h8: 'k', d1: 'B', f1: 'B', d2: 'P', f2: 'P' }) },
          frames: [{ marks: J(M(['e1'], 'bad')), cap: '킹이 피할 곳이 없어요!' }, { mv: ['c3', 'e4'], marks: M(['e4'], 'ok'), cap: '나이트가 e4로 가서 막았어요.' }] },
        { t: 'do', task: function (R) { return escQ(R, 'block'); } }
      ],
      practice: { n: 8, gen: function (R) { return escQ(R, 'block'); } },
      sum: '<b>막기</b>: 체크한 말과 킹 사이에 내 말을 놓아요. 나이트·폰의 체크는 못 막아요.' },
    { id: 'esc-take', title: '체크 벗어나기 ③ 잡기', kind: 'one',
      screens: [
        { t: 'say', text: '세 번째, <b>잡기</b>: 체크한 말을 잡아 버려요. 킹이 직접 잡을 수도 있어요(그 말이 지켜지고 있지 않을 때만).', board: { pos: B({ e1: 'K', e2: 'q', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['e2'], 'ring')) } },
        { t: 'ex', text: '체크한 말 잡기', board: { pos: B({ e1: 'K', b4: 'b', a3: 'P', h8: 'k' }) },
          frames: [{ marks: J(M(['e1'], 'bad'), M(['b4'], 'ring')), cap: '흑 비숍 b4가 체크!' }, { mv: ['a3', 'b4'], marks: M(['b4'], 'ok'), cap: '폰이 비숍을 잡았어요. 체크도 사라졌어요!' }] },
        { t: 'do', task: function (R) { return escQ(R, 'take'); } }
      ],
      practice: { n: 8, gen: function (R) { return escQ(R, 'take'); } },
      sum: '<b>잡기</b>: 체크한 말을 잡아요. 킹이 잡을 때는 그 말이 지켜지지 않아야 해요.' },
    { id: 'esc-any', title: '체크 벗어나기 ④ 방법 고르기', kind: 'deep',
      screens: [
        { t: 'say', text: '세 가지 방법 가운데 <b>가장 좋은 것</b>을 골라요. 보통은 ① 잡을 수 있으면 잡고 ② 막을 수 있으면 값싼 말로 막고 ③ 안전한 칸으로 피해요.', board: { pos: B({ e1: 'K', e8: 'r', h8: 'k' }), marks: M(['e1'], 'bad') } },
        { t: 'say', text: '벗어난 뒤에 <b>내 말이 공짜로 잡히지 않는지</b>도 살펴요. 퀸으로 막았다가 퀸을 잃으면 큰 손해예요.', board: { pos: B({ e1: 'K', e8: 'r', d1: 'Q', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['e2'], 'x')) } },
        { t: 'ex', text: '좋은 방법 고르기', board: { pos: B({ g1: 'K', g8: 'r', f2: 'P', h2: 'P', d5: 'B', a8: 'k' }) },
          frames: [{ marks: J(M(['g1'], 'bad'), M(['g8'], 'ring')), cap: '흑 룩 g8이 체크!' }, { marks: J(M(['f1', 'h1'], 'dot')), cap: '피하기: f1·h1' }, { mv: ['d5', 'g8'], marks: M(['g8'], 'ok'), cap: '그런데 비숍으로 룩을 잡을 수 있어요! 가장 좋은 방법이에요.' }] },
        { t: 'do', task: function (R) { return escQ(R, 'any'); } }
      ],
      practice: { n: 8, gen: function (R) { return escQ(R, R.pick(['any', 'any', 'run', 'block', 'take'])); } },
      sum: '체크를 받으면 <b>잡기 → 막기 → 피하기</b> 가운데 손해 없는 방법을 골라요.' },
    { id: 'esc-double', title: '더블 체크는 피하기만', kind: 'deep',
      screens: [
        { t: 'say', text: '두 말이 한꺼번에 체크하는 <b>더블 체크</b>에서는 막거나 잡아도 <b>다른 말의 체크가 남아요.</b> 그래서 킹이 <b>피하는 수밖에</b> 없어요.', board: { pos: B({ e1: 'K', e8: 'r', d3: 'n', h8: 'k' }), marks: J(M(['e1'], 'bad'), M(['e8', 'd3'], 'ring')) } },
        { t: 'ex', text: '더블 체크', board: { pos: B({ e1: 'K', e8: 'r', d3: 'n', h8: 'k', a3: 'R' }) },
          frames: [{ marks: J(M(['e1'], 'bad'), M(['e8', 'd3'], 'ring')), cap: '룩과 나이트가 한꺼번에 체크!' }, { mv: ['a3', 'd3'], marks: J(M(['d3'], 'hi'), M(['e1'], 'bad')), cap: '나이트를 잡아도 룩의 체크가 남아요. 이 수는 둘 수 없어요.' }, { pos: B({ e1: 'K', e8: 'r', d3: 'n', h8: 'k', a3: 'R' }), mv: ['e1', 'd1'], marks: M(['d1'], 'ok'), cap: '킹이 피해야 해요(d1). f2는 나이트가 공격하는 칸이라 안 돼요.' }] },
        { t: 'do', task: function (R) { return escQ(R, 'double'); } }
      ],
      practice: { n: 6, gen: function (R) { return R.int(3) ? escQ(R, 'double') : pickQ('더블 체크일 때 쓸 수 있는 방법은?', ['피하기', '막기', '잡기'], '피하기', { pos: B({ e1: 'K', e8: 'r', d3: 'n', h8: 'k' }), marks: M(['e1'], 'bad') }, ['막거나 잡아도 한 말의 체크가 남아요.']); } },
      sum: '<b>더블 체크</b>는 막거나 잡아도 소용없어요. <b>킹이 피해야</b> 해요.' }
  ];

  /* ===== 18단원 체크메이트 ===== */
  /* 1수 메이트 국면: o = {w:[백 말], b:[흑 말], bk 조건, near, mover(메이트하는 말 종류), max} */
  function mateScene(R, o) {
    for (var t = 0; t < 4000; t++) {
      var p = scene(R, { bk: o.bk || function (s) { return /[18]/.test(s[1]) || /[ah]/.test(s[0]); }, wk: o.wk || function (s, bk) { return kd(s, bk) <= 3; }, w: o.w, b: o.b || [], near: o.near || 4, bnear: o.bnear || 2 });
      if (!p) continue;
      var ms = CH.legal(p), mates = ms.filter(function (m) { return isMate(p, m); });
      if (!mates.length || mates.length > (o.max || 2)) continue;
      if (o.mover && mates.some(function (m) { return m.pc !== o.mover; })) continue;
      if (o.promo && mates.some(function (m) { return !m.promo; })) continue;
      return { p: p, good: goods(mates), mates: mates };
    }
    return null;
  }
  var MATESET = {
    Q: { w: ['Q'], mover: 'Q' }, R: { w: ['R', 'R'], b: ['p', 'p'], mover: 'R' }, BN: { w: ['B', 'N'], b: ['p'], bk: function (s) { return /^[ah][18]$/.test(s) || /^[bg][18]$/.test(s); } },
    P: { w: ['P', 'B'], b: ['p', 'p'], mover: 'P' }, MIX: { w: ['Q', 'R', 'N'], b: ['p', 'n'] }
  };
  function mateQ(R, key) {
    var o = Object.assign({}, MATESET[key]), sc = mateScene(R, o);
    if (!sc) { o.max = 3; sc = mateScene(R, o); }
    var bk = kingOf(sc.p.b, 'k'), mover = sc.mates[0].pc;
    return playQ('한 수로 <b>체크메이트</b>를 해요!' + (key !== 'MIX' && key !== 'BN' ? ' (' + nm(mover) + '로)' : ''), CH.fen(sc.p), sc.good,
      ['흑 킹이 피할 칸을 모두 막으면서 체크를 주는 수를 찾아요.', { text: '메이트하는 말이 반짝여요.', marks: M([sc.good[0][0]], 'hint') }],
      { kind: 'deep', board: { marks: M([bk], 'ring') }, why: function (f, s, pr) {
        var p = sc.p, m = CH.legal(p).filter(function (x) { return CH.name(x.from) === f && CH.name(x.to) === s && (!pr || x.promo === pr); })[0]; if (!m) return { text: '더 좋은 수가 있어요.' };
        var q = after(p, m);
        if (!CH.inCheck(q)) return CH.status(q) === 'stale' ? { text: '앗, 그 수는 <b>스테일메이트</b>(비김)예요! 체크를 주면서 막아요.', marks: M([s], 'bad') } : { text: '그 수는 체크가 아니에요. 메이트는 체크로 시작해요.', marks: M([s], 'bad') };
        var esc = CH.legal(q).slice(0, 3).map(function (x) { return CH.name(x.to); });
        return { text: '체크지만 흑이 벗어날 수 있어요(초록 칸).', marks: J(M([s], 'bad'), M(esc, 'ok')) };
      } });
  }
  function mateKindQ(R) {
    for (var t = 0; t < 50; t++) {
      var sc = mateScene(R, MATESET[R.pick(['Q', 'R', 'MIX'])]); if (!sc) continue;
      var p = sc.p, k = R.int(3), ms = CH.legal(p), m;
      if (k === 0) m = sc.mates[0];
      else if (k === 1) { var c = ms.filter(function (x) { return givesCheck(p, x) && !isMate(p, x); }); if (!c.length) continue; m = R.pick(c); }
      else { var qn = ms.filter(function (x) { return !givesCheck(p, x) && CH.status(after(p, x)) === ''; }); if (!qn.length) continue; m = R.pick(qn); }
      var q = after(p, m), bk = kingOf(q.b, 'k');
      var ans = ['체크메이트예요', '체크지만 벗어날 수 있어요', '체크가 아니에요'][k];
      return pickQ('흑 차례예요. 흑 킹은 어떤 상태인가요?', ['체크메이트예요', '체크지만 벗어날 수 있어요', '체크가 아니에요'], ans, { pos: q.b, marks: M([bk], 'ring') },
        ['먼저 체크인지 보고, 체크면 피하기·막기·잡기가 되는지 따져요.', { text: '흑 킹 둘레를 살펴요.', marks: M(ring8(bk), 'soft') }], { kind: 'one' });
    }
  }
  function mateLesson(id, title, key, says, ex, sumText) {
    return { id: id, title: title, kind: 'deep', screens: says.concat([ex, { t: 'do', task: function (R) { return mateQ(R, key); } }]), practice: { n: 8, gen: function (R) { return mateQ(R, key); } }, sum: sumText };
  }
  var u18 = [
    { id: 'mate-what', title: '체크메이트란?', kind: 'one',
      screens: [
        { t: 'say', text: '체크를 받았는데 <b>피할 수도, 막을 수도, 잡을 수도 없으면</b> 그것이 <b>체크메이트</b>예요. 줄여서 <b>메이트</b>라고도 해요.', board: { pos: B({ h8: 'k', g7: 'p', h7: 'p', a8: 'R', a1: 'K' }), marks: J(M(['h8'], 'bad')), arrows: [['a8', 'h8']] } },
        { t: 'say', text: '체크메이트가 되면 <b>게임이 끝나요.</b> 메이트를 한 사람이 이겨요. 체스의 목표는 상대 킹을 체크메이트하는 거예요!', board: { pos: B({ h8: 'k', g7: 'p', h7: 'p', a8: 'R', a1: 'K' }), marks: M(['h8'], 'bad') } },
        { t: 'say', text: '킹을 실제로 잡지는 않아요. 메이트가 되는 순간 끝나요.', board: { pos: B({ h8: 'k', g7: 'p', h7: 'p', a8: 'R', a1: 'K' }), marks: M(['h8'], 'bad') } },
        { t: 'ex', text: '이 장면은 왜 메이트일까요?', board: { pos: B({ h8: 'k', g7: 'p', h7: 'p', a8: 'R', a1: 'K' }) },
          frames: [{ marks: M(['h8'], 'bad'), cap: '룩 a8이 체크!' }, { marks: J(M(['h8'], 'bad'), M(['g8'], 'x'), M(['g7', 'h7'], 'ring')), cap: '피하기: g8은 룩이 공격, g7·h7은 내 폰이 막아요. ✗' }, { marks: J(M(['b8', 'c8', 'd8', 'e8', 'f8', 'g8'], 'soft')), cap: '막기: 사이에 놓을 흑 말이 없어요. ✗' }, { marks: M(['a8'], 'ring'), cap: '잡기: 룩을 잡을 흑 말이 없어요. ✗ → 체크메이트!' }] },
        { t: 'do', task: pickQ('흑 킹은 체크메이트인가요?', ['체크메이트예요', '체크지만 벗어날 수 있어요'], '체크지만 벗어날 수 있어요', { pos: B({ h8: 'k', g7: 'p', a8: 'R', a1: 'K' }), marks: M(['h8'], 'ring') }, ['킹이 피할 칸이 있나요?', { text: '이 칸을 봐요.', marks: M(['h7'], 'hint') }]) }
      ],
      practice: { n: 8, gen: function (R) { return mateKindQ(R); } },
      sum: '체크인데 <b>피하기·막기·잡기가 모두 안 되면</b> 체크메이트! 메이트하면 이겨요.' },
    { id: 'mate-or-not', title: '메이트일까 아닐까', kind: 'one',
      screens: [
        { t: 'say', text: '메이트인지 알아보려면 차례대로 따져요. ① 체크인가? ② 킹이 피할 칸이 있나? ③ 막을 수 있나? ④ 체크한 말을 잡을 수 있나?', board: { pos: B({ e8: 'k', e1: 'R', a1: 'K' }), marks: M(['e8'], 'bad') } },
        { t: 'say', text: '하나라도 되면 메이트가 아니에요. 넷 다 안 될 때만 메이트!', board: { pos: B({ e8: 'k', e1: 'R', a1: 'K' }), marks: J(M(['e8'], 'bad'), M(['d7', 'd8', 'f7', 'f8'], 'ok')) } },
        { t: 'ex', text: '메이트가 아닌 까닭 찾기', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h7: 'p', e8: 'R', a1: 'K', c6: 'b' }) },
          frames: [{ marks: M(['g8'], 'bad'), cap: '룩 e8 체크! 킹은 피할 곳이 없어요.' }, { marks: J(M(['c6'], 'ring'), M(['e8'], 'ring')), cap: '그런데 흑 비숍 c6이 대각선(d7–e8)으로 룩을 잡을 수 있어요.' }, { mv: ['c6', 'e8'], marks: M(['e8'], 'ok'), cap: '잡았어요. 메이트가 아니었어요!' }] },
        { t: 'do', task: function (R) { return mateKindQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return mateKindQ(R); } },
      sum: '메이트인지 볼 때는 <b>체크 → 피하기 → 막기 → 잡기</b>를 차례로 따져요.' },
    mateLesson('m1-queen', '1수 메이트 ① 퀸', 'Q',
      [{ t: 'say', text: '이제 한 수로 메이트하는 연습을 해요. 먼저 가장 힘센 <b>퀸</b>으로! 퀸은 킹의 도움을 받아 킹 바로 앞에서 메이트하는 경우가 많아요.', board: { pos: B({ e8: 'k', e6: 'K', a7: 'Q' }), marks: M(['e8'], 'ring') } },
       { t: 'say', text: '킹이 퀸을 지켜 주면 흑 킹이 퀸을 잡을 수 없어요. 이것을 <b>키스 메이트</b>라고도 해요.', board: { pos: B({ e8: 'k', e6: 'K', e7: 'Q' }), marks: J(M(['e8'], 'bad'), M(['e6'], 'ring')) } }],
      { t: 'ex', text: '퀸 메이트', board: { pos: B({ e8: 'k', e6: 'K', a7: 'Q' }) },
        frames: [{ marks: M(['e8'], 'ring'), cap: '흑 킹 e8, 백 킹 e6' }, { mv: ['a7', 'd7'], marks: J(M(['e8'], 'ring'), M(['f8'], 'ok')), cap: '퀸 d7 체크? 흑 킹이 f8로 피할 수 있어요. 메이트가 아니에요.' }, { pos: B({ e8: 'k', e6: 'K', a7: 'Q' }), mv: ['a7', 'e7'], marks: J(M(['e8'], 'bad'), M(['e7'], 'hi')), cap: '퀸 e7! 백 킹이 퀸을 지켜요.' }, { marks: J(M(['e8'], 'bad'), M(['d8', 'f8', 'd7', 'f7'], 'x')), cap: '피할 칸이 모두 막혔어요. 체크메이트!' }] },
      '퀸 메이트는 <b>킹이 퀸을 지켜 줄 때</b> 흔히 나와요.'),
    mateLesson('m1-rook', '1수 메이트 ② 룩', 'R',
      [{ t: 'say', text: '<b>룩</b>은 끝 줄에서 메이트를 잘해요. 킹이 자기 폰들에 막혀 끝 줄에 갇혀 있으면, 룩이 그 줄로 와서 메이트! 이것을 <b>백랭크 메이트</b>라고 해요.', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h7: 'p', a1: 'R', h1: 'K' }), marks: M(['g8'], 'ring'), arrows: [['a1', 'a8']] } }],
      { t: 'ex', text: '룩 메이트', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h7: 'p', a1: 'R', h1: 'K' }) },
        frames: [{ marks: J(M(['g8'], 'ring'), M(['f7', 'g7', 'h7'], 'soft')), cap: '흑 킹 앞이 자기 폰으로 막혀 있어요.' }, { mv: ['a1', 'a8'], marks: J(M(['g8'], 'bad'), M(['a8'], 'hi')), cap: '룩 a8! 백랭크 메이트!' }] },
      '<b>룩</b>은 끝 줄에 갇힌 킹을 메이트하기 좋아요(백랭크 메이트).'),
    mateLesson('m1-minor', '1수 메이트 ③ 비숍과 나이트', 'BN',
      [{ t: 'say', text: '비숍과 나이트도 힘을 합치면 메이트할 수 있어요. 귀퉁이에 몰린 킹은 특히 위험해요.', board: { pos: '5K1k/7p/4B2N/8/8/8/8/8', marks: M(['h8'], 'ring') } }],
      { t: 'ex', text: '비숍과 나이트의 메이트', board: { pos: '5K1k/7p/4B2N/8/8/8/8/8' },
        frames: [{ marks: M(['h8'], 'ring'), cap: '흑 킹 h8은 자기 폰 h7에 막혀 있어요. 백 킹 f8이 g8·g7을 막아요.' }, { mv: ['h6', 'f7'], marks: J(M(['h8'], 'bad'), M(['f7'], 'hi')), cap: '나이트 f7 체크! 비숍이 나이트를 지켜요(e6–f7). 체크메이트!' }] },
      '비숍과 나이트는 <b>서로 다른 칸을 맡아</b> 킹의 도망길을 막아요.'),
    mateLesson('m1-pawn', '1수 메이트 ④ 폰', 'P',
      [{ t: 'say', text: '가장 작은 <b>폰</b>도 메이트할 수 있어요! 킹이 다른 말에 둘러싸여 있을 때, 폰의 대각선 체크가 마지막 한 방이 돼요.', board: { pos: '6kr/7p/4KP1B/8/8/8/8/8', marks: M(['g8'], 'ring') } }],
      { t: 'ex', text: '폰 메이트', board: { pos: '6kr/7p/4KP1B/8/8/8/8/8' },
        frames: [{ marks: M(['g8'], 'ring'), cap: '흑 킹 g8 옆은 자기 룩과 폰이 막고, 비숍 h6이 g7·f8을 막아요.' }, { mv: ['f6', 'f7'], marks: J(M(['g8'], 'bad'), M(['f7'], 'hi')), cap: '폰 f7 체크! 폰은 백 킹이 지켜요. 체크메이트!' }] },
      '<b>폰</b>도 대각선 체크로 메이트할 수 있어요.'),
    mateLesson('m1-mix', '1수 메이트 ⑤ 섞어서', 'MIX',
      [{ t: 'say', text: '이제 여러 말이 있는 판에서 메이트를 찾아요. <b>체크를 주는 모든 수</b>를 하나씩 따져 보는 것이 비결이에요. 체크 → 피할 곳 → 막기 → 잡기!', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h7: 'p', a1: 'R', d1: 'Q', h1: 'K' }), marks: M(['g8'], 'ring') } }],
      { t: 'ex', text: '체크를 하나씩 따져요.', board: { pos: B({ g8: 'k', f7: 'p', g7: 'p', h7: 'p', a1: 'R', d1: 'Q', h1: 'K', c8: 'r' }) },
        frames: [{ marks: M(['g8'], 'ring'), cap: '흑 룩 c8이 끝 줄을 지키고 있어요.' }, { marks: M(['d8', 'a8'], 'soft'), cap: '퀸 d8? 룩이 잡아요. 룩 a8? 룩이 잡아요.' }, { marks: M(['d8'], 'ok'), cap: '그래서 이 판은 한 수 메이트가 없어요. 이럴 때는 다른 계획이 필요해요(5마당 전술!).' }] },
      '여러 말이 있으면 <b>체크하는 수를 모두</b> 따져 메이트를 찾아요.')
  ];
  /* ===== 19단원 스테일메이트 ===== */
  function staleFromWhite(R, want) {
    for (var t = 0; t < 400; t++) {
      var w = R.pick([['Q'], ['Q'], ['R'], ['P']]), p = scene(R, { bk: function (s) { return /^[abgh][1278]$/.test(s); }, wk: function (s, bk) { return kd(s, bk) <= 3; }, w: w, near: 3 });
      if (!p) continue;
      var res = CH.legal(p).map(function (m) { var q = after(p, m), st = CH.status(q); return { m: m, q: q, k: st === 'mate' ? 'mate' : st === 'stale' ? 'stale' : CH.inCheck(q) ? 'check' : 'none' }; });
      var hit = res.filter(function (x) { return x.k === want; }); if (!hit.length) continue;
      return { p: p, res: res, hit: hit };
    }
  }
  var KIND3 = { mate: '체크메이트(백이 이김)', stale: '스테일메이트(비김)', none: '둘 다 아니에요(게임 계속)', check: '둘 다 아니에요(게임 계속)' };
  function staleKindQ(R) {
    var want = R.pick(['stale', 'stale', 'mate', 'none']), sc = staleFromWhite(R, want), x = R.pick(sc.hit), bk = kingOf(x.q.b, 'k');
    return pickQ('흑 차례예요. 이 판은 어떤 상태인가요?', ['체크메이트(백이 이김)', '스테일메이트(비김)', '둘 다 아니에요(게임 계속)'], KIND3[want], { pos: x.q.b, marks: M([bk], 'ring') },
      ['흑 킹이 체크인가요? 흑이 둘 수 있는 수가 하나라도 있나요?', { text: '흑 킹 둘레를 살펴요.', marks: M(ring8(bk), 'soft') }], { kind: 'one' });
  }
  function staleAvoidQ(R) {
    for (var t = 0; t < 400; t++) {
      var sc = staleFromWhite(R, 'stale'); if (!sc) continue;
      var good = sc.res.filter(function (x) { if (x.k === 'stale') return false; if (x.k === 'mate') return true; return !CH.legal(x.q).some(function (m) { return m.cap !== '.'; }); });
      if (!good.length || good.length > sc.res.length - 1) continue;
      var st = sc.hit.map(function (x) { return CH.name(x.m.to); });
      return playQ('백 차례예요. <b>스테일메이트가 되지 않게</b>, 말을 잃지 않는 수를 두어요.', CH.fen(sc.p), goods(good.map(function (x) { return x.m; })),
        ['흑 킹이 둘 수 있는 수를 하나는 남겨 두어야 해요(체크가 아니라면).', '내 말이 흑 킹 바로 옆에서 지켜지지 않으면 잡혀요.'],
        { kind: 'deep', why: function (f, s) { var q = CH.legal(sc.p).filter(function (m) { return CH.name(m.from) === f && CH.name(m.to) === s; })[0], q2 = q && after(sc.p, q);
          if (q2 && CH.status(q2) === 'stale') return { text: '앗, <b>스테일메이트</b>예요! 흑 킹이 체크도 아닌데 갈 곳이 하나도 없어요. 비기게 돼요.', marks: J(M([s], 'bad'), M(ring8(kingOf(q2.b, 'k')), 'soft')) };
          return { text: '그렇게 두면 흑 킹이 내 말을 잡을 수 있어요.', marks: M([s], 'bad') }; } });
    }
  }
  var u19 = [
    { id: 'stale-what', title: '스테일메이트란?', kind: 'one',
      screens: [
        { t: 'say', text: '자기 차례인데 <b>체크는 아니지만 둘 수 있는 수가 하나도 없는</b> 상태를 <b>스테일메이트</b>라고 해요.', board: { pos: B({ h8: 'k', f7: 'Q', g6: 'K' }), marks: J(M(['h8'], 'ring'), M(['g8', 'g7', 'h7'], 'x')) } },
        { t: 'say', text: '스테일메이트가 되면 게임은 <b>비김(무승부)</b>으로 끝나요. 이기고 있던 쪽은 다 이긴 게임을 놓치는 거예요!', board: { pos: B({ h8: 'k', f7: 'Q', g6: 'K' }) } },
        { t: 'say', text: '체크메이트와 다른 점: 메이트는 <b>체크이면서</b> 벗어날 수 없는 것, 스테일메이트는 <b>체크가 아닌데</b> 둘 수가 없는 것.', board: { pos: B({ h8: 'k', g7: 'Q', g6: 'K' }), marks: M(['h8'], 'bad') } },
        { t: 'ex', text: '메이트와 스테일메이트', board: { pos: B({ h8: 'k', g6: 'K', d7: 'Q' }) },
          frames: [{ mv: ['d7', 'f7'], marks: J(M(['h8'], 'ring'), M(['g8', 'g7', 'h7'], 'x')), cap: '퀸 f7: 체크가 아닌데 흑 킹이 갈 곳이 없어요. 스테일메이트(비김)!' }, { pos: B({ h8: 'k', g6: 'K', d7: 'Q' }), mv: ['d7', 'g7'], marks: M(['h8'], 'bad'), cap: '퀸 g7: 체크이고 갈 곳도 없어요. 체크메이트(백이 이김)!' }] },
        { t: 'do', task: pickQ('흑 차례예요. 이 판은?', ['체크메이트(백이 이김)', '스테일메이트(비김)', '둘 다 아니에요(게임 계속)'], '스테일메이트(비김)', { pos: B({ a8: 'k', c7: 'Q', c1: 'K' }), marks: M(['a8'], 'ring') }, ['흑 킹이 체크인가요?', '흑 킹이 갈 수 있는 칸이 있나요?']) }
      ],
      practice: { n: 8, gen: function (R) { return staleKindQ(R); } },
      sum: '<b>스테일메이트</b>: 체크가 아닌데 둘 수가 없으면 <b>비김</b>이에요.' },
    { id: 'stale-find', title: '스테일메이트 찾기', kind: 'one',
      screens: [
        { t: 'say', text: '스테일메이트는 <b>상대에게 말이 거의 없을 때</b> 잘 생겨요. 킹만 남은 상대를 몰아붙이다가 실수로 갈 곳을 모두 막아 버리는 거예요.', board: { pos: B({ a1: 'k', c2: 'Q', e3: 'K' }), marks: J(M(['a1'], 'ring'), M(['a2', 'b1', 'b2'], 'x')) } },
        { t: 'say', text: '판을 보면 늘 물어요: <b>“상대가 둘 수 있는 수가 남아 있나?”</b>', board: { pos: B({ a1: 'k', c2: 'Q', e3: 'K' }) } },
        { t: 'ex', text: '흔한 스테일메이트 모양', board: { pos: B({ h1: 'k', f2: 'Q', e5: 'K' }) },
          frames: [{ marks: J(M(['h1'], 'ring'), M(['g1', 'g2', 'h2'], 'x')), cap: '귀퉁이 킹 + 퀸이 한 칸 떨어진 대각선' }, { pos: B({ a8: 'k', b6: 'Q', e4: 'K' }), marks: J(M(['a8'], 'ring'), M(['a7', 'b7', 'b8'], 'x')), cap: '반대쪽 귀퉁이도 똑같아요.' }, { pos: B({ h8: 'k', h7: 'P', g6: 'K' }), marks: J(M(['h8'], 'ring'), M(['g8', 'g7'], 'x')), cap: '폰과 킹으로도 생겨요.' }] },
        { t: 'do', task: function (R) { return staleKindQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return staleKindQ(R); } },
      sum: '상대 말이 적을 때 <b>“상대가 둘 수 있는 수가 남아 있나?”</b> 늘 물어요.' },
    { id: 'stale-avoid', title: '스테일메이트 피하기', kind: 'deep',
      screens: [
        { t: 'say', text: '이기고 있을 때는 스테일메이트를 <b>꼭 피해야</b> 해요. 상대 킹에게 <b>숨 쉴 칸</b>을 하나 남겨 두거나, 체크를 주면서 몰아요.', board: { pos: B({ h8: 'k', g6: 'K', d7: 'Q' }), marks: M(['h8'], 'ring') } },
        { t: 'ex', text: '숨 쉴 칸 남기기', board: { pos: B({ h8: 'k', f6: 'K', d7: 'Q' }) },
          frames: [{ marks: M(['f7'], 'x'), cap: '퀸 f7은? g8·g7·h7이 모두 막혀 스테일메이트!' }, { mv: ['d7', 'e7'], marks: J(M(['e7'], 'ok'), M(['g8'], 'dot')), cap: '퀸 e7: 흑 킹은 g8로 갈 수 있어요. 게임은 계속!' }, { mv: ['h8', 'g8'], cap: '흑 킹 g8' }, { mv: ['e7', 'g7'], marks: M(['g8'], 'bad'), cap: '퀸 g7 메이트! (백 킹 f6이 지켜요)' }] },
        { t: 'do', task: function (R) { return staleAvoidQ(R); } }
      ],
      practice: { n: 6, gen: function (R) { return staleAvoidQ(R); } },
      sum: '이기고 있을 때는 상대 킹에게 <b>숨 쉴 칸</b>을 남기거나 <b>체크</b>로 몰아요.' }
  ];

  /* ===== 20단원 캐슬링 ===== */
  /* fail: '' 할 수 있음 · moved 킹/룩이 움직였었음 · between 사이에 말 · check 체크 · through 지나가는 칸 공격 · into 도착 칸 공격 */
  function castleScene(R, sd, fail) {
    for (var t = 0; t < 600; t++) {
      var b = CH.board(E), K = sd === 'K';
      b[CH.idx('e1')] = 'K'; b[CH.idx(K ? 'h1' : 'a1')] = 'R';
      ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'].forEach(function (s) { if (R.int(3)) b[CH.idx(s)] = 'P'; });
      var bk = R.pick(sqs(function (s) { return /[6-8]/.test(s[1]); })); b[CH.idx(bk)] = 'k';
      var path = K ? ['f1', 'g1'] : ['d1', 'c1', 'b1'];
      if (fail === 'between') b[CH.idx(R.pick(path))] = R.pick(['N', 'B', 'Q']);
      var target = { check: 'e1', through: K ? 'f1' : 'd1', into: K ? 'g1' : 'c1' }[fail];
      if (target) {
        var cands = sqs(function (s) { return pcAt(b, s) === '.' && /[3-8]/.test(s[1]); }), placed = false;
        for (var k = 0; k < 60 && !placed; k++) { var s = R.pick(cands), pc = R.pick(['r', 'b', 'q', 'n']), b2 = b.slice(); b2[CH.idx(s)] = pc; if (att(b2, target, 'b').length && (fail === 'check' || !att(b2, 'e1', 'b').length) && (fail !== 'through' || !att(b2, K ? 'g1' : 'c1', 'b').length)) { b = b2; placed = true; } }
        if (!placed) continue;
      } else if (R.int(2)) { var e = sqs(function (s) { return pcAt(b, s) === '.' && /[4-7]/.test(s[1]); }), b3 = b.slice(); b3[CH.idx(R.pick(e))] = R.pick(['n', 'b', 'p']); b = b3; }
      var cast = fail === 'moved' ? '' : sd, p = P(b, 'w', cast);
      if (CH.inCheck(P(b, 'b'))) continue;
      var can = CH.legalFrom(p, CH.idx('e1')).some(function (m) { return m.flag === 'castle'; });
      if (can !== !fail) continue;
      return { p: p, sd: sd };
    }
  }
  var WHYC = { '': '할 수 있어요', moved: '킹이나 룩이 전에 움직였어요', between: '킹과 룩 사이에 말이 있어요', check: '킹이 체크를 받고 있어요', through: '킹이 지나가는 칸이 공격받아요', into: '킹이 도착할 칸이 공격받아요' };
  function castleAskQ(R, fails) {
    var f = R.pick(fails), sd = R.pick(['K', 'Q']), sc = castleScene(R, sd, f), story = f === 'moved' ? (R.int(2) ? ' (백 킹은 앞에서 한 번 움직였다가 e1로 돌아왔어요.)' : ' (이 룩은 앞에서 한 번 움직였다가 제자리로 돌아왔어요.)') : ' (킹과 룩은 아직 한 번도 움직이지 않았어요.)';
    var opts = ['할 수 있어요', '킹이나 룩이 전에 움직였어요', '킹과 룩 사이에 말이 있어요', '킹이 체크를 받고 있어요', '킹이 지나가는 칸이 공격받아요', '킹이 도착할 칸이 공격받아요'];
    return pickQ('백이 <b>' + (sd === 'K' ? '킹 쪽' : '퀸 쪽') + ' 캐슬링</b>을 할 수 있나요? 못 한다면 까닭은?' + story, opts, WHYC[f], { pos: sc.p.b, marks: M(['e1', sd === 'K' ? 'h1' : 'a1'], 'ring') },
      ['캐슬링 조건 다섯 가지를 차례로 따져요: 처음 움직임? 사이가 비었나? 체크인가? 지나가는 칸? 도착할 칸?', { text: '킹이 지나가는 칸들이에요.', marks: M(sd === 'K' ? ['f1', 'g1'] : ['d1', 'c1'], 'soft') }], { kind: 'one' });
  }
  function castleDoQ(R, sd) {
    var sc = castleScene(R, sd, '');
    return playQ('<b>' + (sd === 'K' ? '킹 쪽' : '퀸 쪽') + ' 캐슬링</b>을 해요. 킹을 누르고, 킹이 갈 칸(' + (sd === 'K' ? 'g1' : 'c1') + ')을 눌러요. 룩은 저절로 넘어와요.', CH.fen(sc.p), [['e1', sd === 'K' ? 'g1' : 'c1']],
      ['캐슬링은 킹을 두 칸 옮기는 수예요.', { text: '이 두 칸이에요.', marks: M(['e1', sd === 'K' ? 'g1' : 'c1'], 'hint') }], { kind: 'easy', board: { marks: M(['e1'], 'ring') }, why: function () { return { text: '이번에는 캐슬링을 해요. 킹을 ' + (sd === 'K' ? 'g1' : 'c1') + '로 두 칸 옮겨요.' }; } });
  }
  var u20 = [
    { id: 'castle-k', title: '캐슬링 ① 킹 쪽', kind: 'easy',
      screens: [
        { t: 'say', text: '<b>캐슬링</b>은 킹과 룩이 <b>한꺼번에</b> 움직이는 특별한 수예요. 킹을 안전한 구석으로 보내고, 룩을 가운데로 꺼내요.', board: { pos: B({ e1: 'K', h1: 'R', f2: 'P', g2: 'P', h2: 'P', e8: 'k' }), marks: M(['e1', 'h1'], 'ring') } },
        { t: 'say', text: '<b>킹 쪽 캐슬링</b>: 킹이 룩 쪽으로 <b>두 칸</b>(e1 → g1), 룩은 킹을 <b>넘어서</b> 킹 바로 옆(h1 → f1)으로 와요. 한 번에 두는 한 수예요.', board: { pos: B({ e1: 'K', h1: 'R', f2: 'P', g2: 'P', h2: 'P', e8: 'k' }), arrows: [['e1', 'g1'], ['h1', 'f1']] } },
        { t: 'say', text: '화면에서는 <b>킹을 두 칸</b> 옮기면 룩이 저절로 넘어와요. 실제 판에서도 <b>킹을 먼저</b> 옮기고 룩을 옮겨요. 기보로는 <b>O-O</b>라고 써요.', board: { pos: B({ g1: 'K', f1: 'R', f2: 'P', g2: 'P', h2: 'P', e8: 'k' }), marks: M(['g1', 'f1'], 'ok') } },
        { t: 'ex', text: '킹 쪽 캐슬링', board: { pos: B({ e1: 'K', h1: 'R', f2: 'P', g2: 'P', h2: 'P', e8: 'k' }) },
          frames: [{ marks: M(['f1', 'g1'], 'soft'), cap: 'f1·g1이 비어 있어요.' }, { mv: ['e1', 'g1'], marks: M(['g1'], 'hi'), cap: '킹이 두 칸 g1로,' }, { mv: ['h1', 'f1'], marks: M(['f1'], 'hi'), cap: '룩이 킹을 넘어 f1로. 캐슬링 끝!' }] },
        { t: 'do', task: function (R) { return castleDoQ(R, 'K'); } }
      ],
      practice: { n: 6, gen: function (R) { return castleDoQ(R, 'K'); } },
      sum: '<b>킹 쪽 캐슬링</b>(O-O): 킹 e1 → g1, 룩 h1 → f1. 킹을 두 칸 옮겨요.' },
    { id: 'castle-q', title: '캐슬링 ② 퀸 쪽', kind: 'easy',
      screens: [
        { t: 'say', text: '<b>퀸 쪽 캐슬링</b>: 킹이 a1 룩 쪽으로 <b>두 칸</b>(e1 → c1), 룩은 킹을 넘어 d1로 와요. 기보로는 <b>O-O-O</b>.', board: { pos: B({ e1: 'K', a1: 'R', a2: 'P', b2: 'P', c2: 'P', e8: 'k' }), arrows: [['e1', 'c1'], ['a1', 'd1']] } },
        { t: 'say', text: '퀸 쪽은 룩까지 거리가 멀어서 <b>b1·c1·d1 세 칸</b>이 모두 비어 있어야 해요. 킹은 여전히 두 칸만 가요.', board: { pos: B({ e1: 'K', a1: 'R', e8: 'k' }), marks: M(['b1', 'c1', 'd1'], 'soft') } },
        { t: 'ex', text: '퀸 쪽 캐슬링', board: { pos: B({ e1: 'K', a1: 'R', a2: 'P', b2: 'P', c2: 'P', e8: 'k' }) },
          frames: [{ mv: ['e1', 'c1'], marks: M(['c1'], 'hi'), cap: '킹이 두 칸 c1로,' }, { mv: ['a1', 'd1'], marks: M(['d1'], 'hi'), cap: '룩이 d1로. 퀸 쪽 캐슬링 끝!' }] },
        { t: 'do', task: function (R) { return castleDoQ(R, 'Q'); } }
      ],
      practice: { n: 6, gen: function (R) { return castleDoQ(R, R.pick(['Q', 'Q', 'K'])); } },
      sum: '<b>퀸 쪽 캐슬링</b>(O-O-O): 킹 e1 → c1, 룩 a1 → d1. b1·c1·d1이 비어야 해요.' },
    { id: 'castle-moved', title: '캐슬링 ③ 킹이나 룩이 움직였으면', kind: 'one',
      screens: [
        { t: 'say', text: '캐슬링은 <b>킹과 그 룩이 한 번도 움직이지 않았을 때만</b> 할 수 있어요. 한 번 움직였다가 제자리로 돌아와도 안 돼요!', board: { pos: B({ e1: 'K', h1: 'R', a1: 'R', e8: 'k' }), marks: M(['e1', 'h1', 'a1'], 'ring') } },
        { t: 'say', text: '킹이 움직였으면 양쪽 캐슬링이 모두 안 되고, h1 룩만 움직였으면 킹 쪽만 안 돼요(퀸 쪽은 돼요).', board: { pos: B({ e1: 'K', h1: 'R', a1: 'R', e8: 'k' }), marks: J(M(['h1'], 'x'), M(['a1'], 'ok')) } },
        { t: 'ex', text: '움직였다가 돌아온 킹', board: { pos: B({ e1: 'K', h1: 'R', e8: 'k' }) },
          frames: [{ mv: ['e1', 'e2'], marks: M(['e2'], 'hi'), cap: '킹이 e2로 갔다가,' }, { mv: ['e2', 'e1'], marks: M(['e1'], 'hi'), cap: '다시 e1로 돌아왔어요.' }, { marks: J(M(['e1'], 'x')), cap: '자리는 같지만 이제 캐슬링은 할 수 없어요.' }] },
        { t: 'do', task: function (R) { return castleAskQ(R, ['', 'moved']); } }
      ],
      practice: { n: 8, gen: function (R) { return castleAskQ(R, ['', 'moved']); } },
      sum: '킹이나 그 룩이 <b>한 번이라도 움직였으면</b> 캐슬링을 할 수 없어요.' },
    { id: 'castle-between', title: '캐슬링 ④ 사이에 말이 있으면', kind: 'one',
      screens: [
        { t: 'say', text: '킹과 룩 <b>사이의 칸이 모두 비어 있어야</b> 캐슬링을 할 수 있어요. 내 말이든 상대 말이든 하나라도 있으면 안 돼요.', board: { pos: B({ e1: 'K', h1: 'R', g1: 'N', e8: 'k' }), marks: J(M(['g1'], 'x')) } },
        { t: 'say', text: '처음 배치에서는 사이에 말이 꽉 차 있어서, 나이트와 비숍(퀸 쪽은 퀸까지)을 먼저 꺼내야 캐슬링할 수 있어요.', board: { pos: S0, marks: M(['f1', 'g1', 'b1', 'c1', 'd1'], 'soft') } },
        { t: 'ex', text: '길을 비워요', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' },
          frames: [{ mv: ['g1', 'f3'], marks: M(['f3'], 'hi'), cap: '나이트를 꺼내고,' }, { mv: ['e2', 'e4'], cap: '폰 e4로 비숍 길을 열고,' }, { mv: ['f1', 'c4'], marks: M(['c4'], 'hi'), cap: '비숍을 꺼내면,' }, { marks: M(['f1', 'g1'], 'ok'), cap: 'f1·g1이 비었어요. 이제 캐슬링 준비 끝!' }] },
        { t: 'do', task: function (R) { return castleAskQ(R, ['', 'between']); } }
      ],
      practice: { n: 8, gen: function (R) { return castleAskQ(R, ['', 'between', 'moved']); } },
      sum: '킹과 룩 <b>사이 칸이 모두 비어야</b> 캐슬링할 수 있어요.' },
    { id: 'castle-check', title: '캐슬링 ⑤ 체크일 때', kind: 'one',
      screens: [
        { t: 'say', text: '킹이 <b>체크를 받고 있을 때</b>는 캐슬링으로 피할 수 없어요. 다른 방법으로 체크에서 벗어나야 해요.', board: { pos: B({ e1: 'K', h1: 'R', e8: 'r', a8: 'k' }), marks: J(M(['e1'], 'bad'), M(['g1'], 'x')) } },
        { t: 'say', text: '체크에서 벗어난 뒤에, 킹과 룩이 움직이지 않았다면 나중에 캐슬링할 수 있어요.', board: { pos: B({ e1: 'K', h1: 'R', e8: 'r', a8: 'k', e2: 'B' }), marks: M(['e2'], 'ok') } },
        { t: 'ex', text: '막고 나서 캐슬링', board: { pos: B({ e1: 'K', h1: 'R', b4: 'b', c1: 'B', a8: 'k' }) },
          frames: [{ marks: J(M(['e1'], 'bad'), M(['b4'], 'ring')), cap: '흑 비숍 b4가 체크! 지금은 캐슬링 안 돼요.' }, { mv: ['c1', 'd2'], marks: M(['d2'], 'hi'), cap: '비숍 d2로 막았어요.' }, { mv: ['a8', 'b8'], cap: '흑이 한 수 두고,' }, { mv: ['e1', 'g1'], cap: '이제 캐슬링!' }, { mv: ['h1', 'f1'], marks: M(['g1', 'f1'], 'ok'), cap: '킹 쪽 캐슬링 완성.' }] },
        { t: 'do', task: function (R) { return castleAskQ(R, ['', 'check']); } }
      ],
      practice: { n: 8, gen: function (R) { return castleAskQ(R, ['', 'check', 'between']); } },
      sum: '<b>체크일 때는</b> 캐슬링을 할 수 없어요.' },
    { id: 'castle-through', title: '캐슬링 ⑥ 지나가는 칸이 공격받으면', kind: 'one',
      screens: [
        { t: 'say', text: '킹이 <b>지나가는 칸</b>(킹 쪽 f1, 퀸 쪽 d1)이나 <b>도착하는 칸</b>(g1, c1)이 상대 말에게 공격받으면 캐슬링할 수 없어요.', board: { pos: B({ e1: 'K', h1: 'R', c4: 'b', a8: 'k' }), marks: J(M(['f1'], 'bad'), M(['c4'], 'ring')) } },
        { t: 'say', text: '룩이 지나가는 칸은 상관없어요! 퀸 쪽 캐슬링에서 b1이 공격받아도 킹은 b1을 지나가지 않으니 캐슬링할 수 있어요.', board: { pos: B({ e1: 'K', a1: 'R', b8: 'r', h8: 'k' }), marks: J(M(['b1'], 'ring'), M(['c1', 'd1'], 'ok')) } },
        { t: 'ex', text: '지나가는 칸', board: { pos: B({ e1: 'K', h1: 'R', a1: 'R', c4: 'b', h8: 'k' }) },
          frames: [{ marks: J(M(['f1'], 'bad'), M(['c4'], 'ring')), cap: '흑 비숍이 f1을 공격해요 → 킹 쪽 캐슬링 ✗' }, { marks: J(M(['c1', 'd1'], 'ok')), cap: '퀸 쪽은 d1·c1이 안전해요 → 퀸 쪽 캐슬링 ⭕' }, { mv: ['e1', 'c1'], cap: '킹 c1,' }, { mv: ['a1', 'd1'], marks: M(['c1', 'd1'], 'ok'), cap: '룩 d1. 퀸 쪽 캐슬링!' }] },
        { t: 'do', task: function (R) { return castleAskQ(R, ['', 'through', 'into']); } }
      ],
      practice: { n: 8, gen: function (R) { return castleAskQ(R, ['', 'through', 'into', 'check', 'between', 'moved']); } },
      sum: '킹이 <b>지나가거나 도착할 칸</b>이 공격받으면 캐슬링할 수 없어요. 룩이 지나가는 칸은 괜찮아요.' }
  ];

  /* ===== 21단원 프로모션 ===== */
  function promoScene(R, need) {
    for (var t = 0; t < 2000; t++) {
      var p = scene(R, { bk: need === 'under' ? function (s) { return /[78]/.test(s[1]) || /[ah]/.test(s[0]); } : function () { return true; }, wk: need === 'under' ? function (s, bk) { return kd(s, bk) <= 2; } : null, w: ['P'], b: need === 'queen' && R.int(2) ? [R.pick(['n', 'b', 'r'])] : [], near: need === 'under' ? 2 : 0, turn: 'w' });
      if (!p) continue;
      var ps = sqs(function (s) { return pcAt(p.b, s) === 'P'; })[0]; if (!ps || ps[1] !== '7') { var b = p.b.slice(); b[CH.idx(ps)] = '.'; var e = sqs(function (s) { return s[1] === '7' && b[CH.idx(s)] === '.' && pcAt(b, shift(s, 0, 1)) === '.'; }); if (!e.length) continue; ps = R.pick(e); b[CH.idx(ps)] = 'P'; p = P(b, 'w'); if (CH.inCheck(P(b, 'b')) || CH.inCheck(p)) continue; }
      var pr = CH.legal(p).filter(function (m) { return m.promo; }); if (!pr.length) continue;
      if (need === 'queen') { var q = pr.filter(function (m) { return m.promo === 'Q' && CH.status(after(p, m)) !== 'stale' && !CH.legal(after(p, m)).some(function (x) { return CH.name(x.to) === CH.name(m.to); }); }); if (!q.length) continue; return { p: p, good: goods(q) }; }
      if (need === 'under') {
        var qs = pr.filter(function (m) { return m.promo === 'Q'; }); if (!qs.length || !qs.every(function (m) { return CH.status(after(p, m)) === 'stale'; })) continue;
        var g = pr.filter(function (m) { var q2 = after(p, m); return m.promo !== 'Q' && CH.status(q2) !== 'stale' && !CH.legal(q2).some(function (x) { return CH.name(x.to) === CH.name(m.to); }); });
        if (!g.length) continue; return { p: p, good: goods(g) };
      }
    }
  }
  function promoQ(R, need) {
    var sc = promoScene(R, need);
    if (need === 'queen') return playQ('폰을 끝 줄로 보내 <b>퀸</b>으로 바꿔요. 바꿀 말을 고르는 상자가 나오면 퀸을 골라요.', CH.fen(sc.p), sc.good.map(function (g) { return g.slice(0, 2).concat(['Q']); }), ['8번 가로줄에 닿으면 프로모션이에요.', { text: '이 폰이에요.', marks: M([sc.good[0][0]], 'hint') }],
      { kind: 'easy', why: function (f, s, pr) { return pr && pr !== 'Q' ? { text: '이번에는 가장 힘센 <b>퀸</b>으로 바꿔요.' } : { text: '폰을 끝 줄로 보내요.', marks: M([sc.good[0][0]], 'ring') }; } });
    return playQ('폰을 프로모션해요. 그런데 <b>퀸으로 바꾸면 스테일메이트</b>(비김)가 돼요! 다른 말을 골라요.', CH.fen(sc.p), sc.good, ['퀸 대신 룩이나 다른 말로 바꾸면 흑 킹에게 갈 칸이 남을 수 있어요.', '바꾼 말이 흑 킹에게 잡히지 않는지도 봐요.'],
      { kind: 'deep', why: function (f, s, pr) { return pr === 'Q' || pr === 'q' ? { text: '퀸으로 바꾸면 흑 킹이 갈 곳이 없는데 체크도 아니라서 <b>스테일메이트</b>예요.' } : { text: '그 말로 바꾸면 흑 킹에게 잡히거나 비기게 돼요.', marks: M([s], 'bad') }; } });
  }
  var u21 = [
    { id: 'promo-queen', title: '프로모션 ① 퀸으로', kind: 'easy',
      screens: [
        { t: 'say', text: '폰이 상대 쪽 <b>끝 줄</b>(백은 8번, 흑은 1번 가로줄)에 닿으면 <b>다른 말로 바뀌어요.</b> 이것을 <b>프로모션</b>(승진)이라고 해요.', board: { pos: B({ d7: 'P', h1: 'K', a8: 'k' }), marks: M(['d8'], 'star'), arrows: [['d7', 'd8']] } },
        { t: 'say', text: '폰은 <b>퀸·룩·비숍·나이트</b> 가운데 하나로 바뀌어요(킹이나 폰은 안 돼요). 대부분은 가장 힘센 <b>퀸</b>을 골라요.', big: ['Q', 'R', 'B', 'N'], board: { pos: B({ d8: 'Q', h1: 'K', a8: 'k' }), marks: M(['d8'], 'hi') } },
        { t: 'say', text: '판에 퀸이 이미 있어도 퀸을 또 만들 수 있어요. 잡으면서 끝 줄에 닿아도(대각선) 프로모션이에요.', board: { pos: B({ d1: 'Q', e7: 'P', f8: 'r', h1: 'K', a8: 'k' }), arrows: [['e7', 'f8']] } },
        { t: 'ex', text: '프로모션', board: { pos: B({ c6: 'P', h1: 'K', h8: 'k' }) },
          frames: [{ mv: ['c6', 'c7'], marks: M(['c7'], 'hi'), cap: '폰이 c7,' }, { mv: ['h8', 'g8'], cap: '흑 킹이 오지만 너무 멀어요.' }, { pos: B({ c8: 'Q', h1: 'K', g8: 'k' }), marks: M(['c8'], 'ok'), cap: '폰 c8 → 퀸으로! 폰 1점이 퀸 9점이 됐어요.' }] },
        { t: 'do', task: function (R) { return promoQ(R, 'queen'); } }
      ],
      practice: { n: 6, gen: function (R) { return R.int(3) ? promoQ(R, 'queen') : pickQ('폰이 끝 줄에 닿으면 바뀔 수 <b>없는</b> 말은?', R.shuffle(['킹', '퀸', '룩', '나이트']), '킹', { pos: B({ d8: 'Q', h1: 'K', a8: 'k' }) }, ['퀸·룩·비숍·나이트로만 바뀌어요.']); } },
      sum: '<b>프로모션</b>: 폰이 끝 줄에 닿으면 퀸·룩·비숍·나이트로 바뀌어요. 보통은 <b>퀸</b>!' },
    { id: 'promo-other', title: '프로모션 ② 다른 말로', kind: 'deep',
      screens: [
        { t: 'say', text: '가끔은 퀸이 아닌 말로 바꾸는 것이 더 좋아요. 이것을 <b>언더프로모션</b>이라고 해요.', board: { pos: B({ g7: 'P', h1: 'K', a8: 'k' }) } },
        { t: 'say', text: '까닭 ① 퀸으로 바꾸면 <b>스테일메이트</b>가 되는 경우 → 룩으로! ② 나이트로 바꾸면 바로 <b>체크</b>를 주며 큰 이득을 보는 경우.', board: { pos: '8/5P1k/5K2/8/8/8/8/8', marks: J(M(['h7'], 'ring')) } },
        { t: 'ex', text: '퀸이면 스테일메이트', board: { pos: '8/5P1k/5K2/8/8/8/8/8' },
          frames: [{ marks: M(['h7'], 'ring'), cap: '흑 킹 h7, 백 킹 f6, 백 폰 f7' }, { pos: '5Q2/7k/5K2/8/8/8/8/8', marks: J(M(['h7'], 'ring'), M(['g8', 'h8', 'g7', 'g6', 'h6'], 'x')), cap: '퀸 f8? 흑 킹은 g8·h8·g7·g6·h6 모두 못 가는데 체크도 아니에요. 스테일메이트(비김)!' }, { pos: '5R2/7k/5K2/8/8/8/8/8', marks: J(M(['h6'], 'ok'), M(['g8', 'h8', 'g7', 'g6'], 'x')), cap: '룩 f8! 흑 킹은 h6으로 갈 수 있어요. 게임이 계속되고, 백은 킹과 룩으로 메이트할 수 있어요.' }] },
        { t: 'do', task: function (R) { return promoQ(R, 'under'); } }
      ],
      practice: { n: 6, gen: function (R) { return promoQ(R, 'under'); } },
      sum: '퀸으로 바꾸면 스테일메이트일 때는 <b>룩이나 다른 말</b>로 바꿔요(언더프로모션).' },
    { id: 'promo-win', title: '프로모션 ③ 프로모션으로 이기기', kind: 'deep',
      screens: [
        { t: 'say', text: '폰이 끝 줄 가까이 가면 상대는 막으려고 애써요. 프로모션하는 바로 그 수로 <b>체크메이트</b>가 되기도 해요!', board: { pos: B({ e7: 'P', g6: 'K', g8: 'k', a2: 'r' }), marks: M(['e8'], 'star') } },
        { t: 'ex', text: '프로모션 메이트', board: { pos: B({ e7: 'P', g6: 'K', g8: 'k', a2: 'r' }) },
          frames: [{ marks: M(['g8'], 'ring'), cap: '흑 킹 g8, 백 킹 g6이 f7·g7·h7을 막아요.' }, { pos: B({ e8: 'Q', g6: 'K', g8: 'k', a2: 'r' }), marks: J(M(['g8'], 'bad'), M(['e8'], 'hi')), cap: '폰 e8 → 퀸, 체크메이트!' }] },
        { t: 'do', task: function (R) { var sc = mateScene(R, { w: ['P'], b: [R.pick(['p', 'n'])], promo: true, bk: function (s) { return s[1] === '8'; }, wk: function (s, bk) { return kd(s, bk) === 2; }, near: 3 }) || mateScene(R, { w: ['P', 'R'], promo: true, bk: function (s) { return s[1] === '8'; }, near: 3 }); return playQ('프로모션으로 <b>체크메이트</b>를 해요!', CH.fen(sc.p), sc.good, ['폰을 끝 줄로 보내 무엇으로 바꾸면 메이트일까요?', { text: '이 폰이에요.', marks: M([sc.good[0][0]], 'hint') }], { kind: 'deep' }); } }
      ],
      practice: { n: 6, gen: function (R) {
        var sc = mateScene(R, { w: ['P'], b: [R.pick(['p', 'n', 'b'])], promo: true, bk: function (s) { return s[1] === '8'; }, wk: function (s, bk) { return kd(s, bk) === 2; }, near: 3 }) || mateScene(R, { w: ['P', 'R'], promo: true, bk: function (s) { return s[1] === '8'; }, near: 3 });
        return sc ? playQ('프로모션으로 <b>체크메이트</b>를 해요!', CH.fen(sc.p), sc.good, ['폰을 끝 줄로 보내 무엇으로 바꾸면 메이트일까요?', { text: '이 폰이에요.', marks: M([sc.good[0][0]], 'hint') }], { kind: 'deep' }) : promoQ(R, 'queen');
      } },
      sum: '프로모션하는 수가 그대로 <b>메이트</b>가 되기도 해요. 무엇으로 바꿀지 잘 골라요.' }
  ];

  /* ===== 22단원 앙파상 ===== */
  function epScene(R, now) {
    for (var t = 0; t < 400; t++) {
      var f = R.int(8), df = R.pick([-1, 1]); if (f + df < 0 || f + df > 7) continue;
      var b = CH.board(E), wp = F[f] + 5, bp = F[f + df] + 5; b[CH.idx(wp)] = 'P'; b[CH.idx(bp)] = 'p';
      var bk = R.pick(sqs(function (s) { return /[78]/.test(s[1]) && b[CH.idx(s)] === '.' && F.indexOf(s[0]) !== f + df; })); b[CH.idx(bk)] = 'k';
      var wk = R.pick(sqs(function (s) { return /[12]/.test(s[1]); })); b[CH.idx(wk)] = 'K';
      if (R.int(2)) { var e = sqs(function (s) { return b[CH.idx(s)] === '.' && /[2-4]/.test(s[1]); }); b[CH.idx(R.pick(e))] = 'P'; }
      var ep = now ? CH.idx(F[f + df] + 6) : -1, p = P(b, 'w', '', ep);
      if (CH.inCheck(P(b, 'b')) || CH.inCheck(p)) continue;
      var epm = CH.legal(p).filter(function (m) { return m.flag === 'ep'; }); if (now && !epm.length) continue;
      return { p: p, wp: wp, bp: bp, from: F[f + df] + 7, ep: F[f + df] + 6, good: goods(epm) };
    }
  }
  function epPlayQ(R) {
    var sc = epScene(R, true);
    return playQ('흑 폰이 방금 ' + sc.from + '에서 ' + sc.bp + '로 <b>두 칸</b> 왔어요. <b>앙파상</b>으로 잡아요!', CH.fen(sc.p), sc.good, ['내 폰이 흑 폰 바로 옆에 있어요. 흑 폰이 한 칸만 왔다면 섰을 칸으로 대각선 이동해요.', { text: '이 칸으로 가요.', marks: M([sc.ep], 'hint') }],
      { kind: 'one', board: { marks: M([sc.bp], 'ring'), arrows: [[sc.from, sc.bp]] }, why: function () { return { text: '이번에는 앙파상으로 ' + sc.bp + '의 흑 폰을 잡아요. 내 폰을 ' + sc.ep + '로 옮겨요.', marks: M([sc.ep], 'ring') }; } });
  }
  function epAskQ(R) {
    var now = R.int(2) === 1, sc = epScene(R, now), story = now ? '흑 폰이 <b>방금</b> ' + sc.from + '에서 ' + sc.bp + '로 두 칸 왔어요.' : '흑 폰은 <b>몇 수 전에</b> ' + sc.from + '에서 ' + sc.bp + '로 두 칸 왔고, 그 뒤 다른 말들이 움직였어요.';
    return pickQ(story + ' 지금 ' + sc.wp + '의 백 폰이 앙파상으로 잡을 수 있나요?', ['잡을 수 있어요', '잡을 수 없어요'], now ? '잡을 수 있어요' : '잡을 수 없어요', { pos: sc.p.b, marks: M([sc.bp, sc.wp], 'ring') }, ['앙파상은 두 칸 온 <b>바로 다음 수</b>에만 할 수 있어요.'], { kind: 'one' });
  }
  var u22 = [
    { id: 'ep-when', title: '앙파상 ① 되는 때', kind: 'one',
      screens: [
        { t: 'say', text: '<b>앙파상</b>(en passant, ‘지나가는 길에’)은 폰만 하는 특별한 잡기예요.', board: { pos: B({ e5: 'P', d7: 'p', a1: 'K', h8: 'k' }), marks: M(['e5', 'd7'], 'ring') } },
        { t: 'say', text: '내 폰이 <b>5번 가로줄</b>에 있고, 상대 폰이 처음 자리에서 <b>두 칸</b> 와서 내 폰 <b>바로 옆</b>에 서면, 그 폰이 <b>한 칸만 왔을 때처럼</b> 대각선으로 잡을 수 있어요.', board: { pos: B({ e5: 'P', d5: 'p', a1: 'K', h8: 'k' }), marks: J(M(['d5'], 'ring'), M(['d6'], 'dot')), arrows: [['d7', 'd5']] } },
        { t: 'say', text: '잡을 때 내 폰은 <b>d6</b>(상대 폰이 지나간 칸)으로 가고, d5의 폰은 판에서 나가요. 내 폰이 잡힌 폰의 칸으로 가지 않는 유일한 잡기예요!', board: { pos: B({ d6: 'P', a1: 'K', h8: 'k' }), marks: J(M(['d6'], 'ok'), M(['d5'], 'x')) } },
        { t: 'ex', text: '앙파상', board: { pos: B({ e5: 'P', d7: 'p', a1: 'K', h8: 'k' }) },
          frames: [{ mv: ['d7', 'd5'], marks: M(['d5'], 'hi'), cap: '흑 폰이 두 칸 d5로 와서 백 폰 옆에 섰어요.' }, { marks: J(M(['d6'], 'dot'), M(['d5'], 'ring')), cap: '백 폰은 d6으로 가며 d5 폰을 잡을 수 있어요.' }, { pos: B({ d6: 'P', a1: 'K', h8: 'k' }), marks: M(['d6'], 'ok'), cap: '앙파상! d5의 흑 폰이 사라졌어요.' }] },
        { t: 'do', task: function (R) { return epPlayQ(R); } }
      ],
      practice: { n: 6, gen: function (R) { return epPlayQ(R); } },
      sum: '상대 폰이 두 칸 와서 내 폰(5번 가로줄) 옆에 서면, 지나간 칸으로 대각선 이동하며 잡아요(<b>앙파상</b>).' },
    { id: 'ep-now', title: '앙파상 ② 바로 다음 수에만', kind: 'one',
      screens: [
        { t: 'say', text: '앙파상은 상대 폰이 두 칸 온 <b>바로 다음 수</b>에만 할 수 있어요. 다른 수를 한 번 두고 나면 기회가 사라져요.', board: { pos: B({ e5: 'P', d5: 'p', a1: 'K', h8: 'k' }), marks: M(['d5'], 'ring') } },
        { t: 'say', text: '앙파상은 꼭 해야 하는 것이 아니에요. 하고 싶을 때만 해요(다른 잡기처럼).', board: { pos: B({ e5: 'P', d5: 'p', a1: 'K', h8: 'k' }) } },
        { t: 'ex', text: '기회가 사라져요', board: { pos: B({ e5: 'P', d7: 'p', a1: 'K', h8: 'k', a2: 'P' }) },
          frames: [{ mv: ['d7', 'd5'], cap: '흑 폰 두 칸!' }, { mv: ['a2', 'a3'], cap: '백이 다른 수(a3)를 두었어요.' }, { mv: ['h8', 'g8'], cap: '흑이 한 수 두고,' }, { marks: J(M(['d6'], 'x')), cap: '이제는 앙파상을 할 수 없어요.' }] },
        { t: 'do', task: function (R) { return epAskQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return epAskQ(R); } },
      sum: '앙파상은 두 칸 온 <b>바로 다음 수</b>에만! 기회는 한 번뿐이에요.' },
    { id: 'ep-practice', title: '앙파상 ③ 연습', kind: 'one',
      screens: [
        { t: 'say', text: '앙파상 조건을 정리해요. ① 내 폰이 5번 가로줄(흑은 4번)에 ② 상대 폰이 두 칸 와서 바로 옆에 ③ 바로 다음 수에.', board: { pos: B({ c5: 'P', b5: 'p', a1: 'K', h8: 'k' }), marks: J(M(['b6'], 'dot'), M(['b5'], 'ring')) } },
        { t: 'ex', text: '흑도 앙파상을 할 수 있어요.', board: { pos: B({ d4: 'p', e2: 'P', a1: 'K', h8: 'k' }) },
          frames: [{ mv: ['e2', 'e4'], marks: M(['e4'], 'hi'), cap: '백 폰이 두 칸 e4로' }, { pos: B({ e3: 'p', a1: 'K', h8: 'k' }), marks: M(['e3'], 'ok'), cap: '흑 폰 d4가 e3으로 가며 앙파상!' }] },
        { t: 'do', task: function (R) { return epPlayQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return R.int(2) ? epPlayQ(R) : epAskQ(R); } },
      sum: '앙파상: <b>5번 줄 폰 · 두 칸 온 옆 폰 · 바로 다음 수</b>.' }
  ];

  /* ===== 23단원 기본 메이트(인공지능이 막는 흑 킹을 정한 수 안에 메이트) ===== */
  function mateGame(R, w, lim, bkp) {
    for (var t = 0; t < 300; t++) {
      var p = scene(R, { bk: bkp || function (s) { return /[c-f][3-6]/.test(s); }, wk: function (s, bk) { return kd(s, bk) >= 3; }, w: w, near: 8 });
      if (!p) continue;
      if (CH.legal(p).some(function (m) { return isMate(p, m); })) continue;
      var bad = false; CH.legal(P(p.b, 'b')).forEach(function (m) { if (m.cap !== '.') bad = true; }); if (bad) continue; /* 흑 킹이 처음부터 잡을 말이 없게 */
      return { type: 'game', kind: 'deep', unit: '말', state: CH.fen(p), game: AI.game(3, { goal: 'mate', lim: lim, need: w.length }), level: 3,
        q: '🤖 흑 킹을 <b>' + lim + '수 안에</b> 체크메이트해요! 인공지능이 열심히 도망가요. 말을 잃거나 스테일메이트가 되면 다시 해요.',
        winText: '체크메이트! 해냈어요! 🎉', loseTip: '흑 킹을 가장자리로 몰고, 스테일메이트를 조심하고, 내 말이 잡히지 않게 해요.',
        hint: ['흑 킹이 갈 수 있는 칸을 줄이는 수를 찾아요.', '킹도 함께 다가가야 해요(룩 두 개·퀸과 룩은 빼고).'] };
    }
  }
  function mateGameLesson(id, title, w, lim, says, ex, sumText, bkp) {
    return { id: id, title: title, kind: 'deep', screens: says.concat([ex, { t: 'do', task: function (R) { return mateGame(R, w, lim, bkp); } }]),
      practice: { n: 6, gen: function (R) { return R.int(3) ? mateQ(R, w.indexOf('Q') >= 0 ? 'Q' : 'MIX') : mateGame(R, w, lim, bkp); } }, sum: sumText };
  }
  var u23 = [
    mateGameLesson('mate-ladder', '기본 메이트 ① 룩 두 개 사다리', ['R', 'R'], 15,
      [{ t: 'say', text: '킹만 남은 상대를 메이트하는 방법을 배워요. 먼저 <b>룩 두 개</b>로 하는 <b>사다리 메이트</b>!', board: { pos: B({ d5: 'k', a1: 'R', b2: 'R', h1: 'K' }) } },
       { t: 'say', text: '룩 하나가 한 줄을 막고, 다른 룩이 다음 줄에서 체크! 그러면 킹은 한 줄 뒤로 물러나요. 룩이 번갈아 한 줄씩 올라가며 끝 줄까지 밀어붙여요. 사다리를 오르는 것 같지요?', board: { pos: B({ d5: 'k', a4: 'R', b5: 'R', h1: 'K' }), marks: J(M(['d5'], 'bad'), M(F.split('').map(function (f) { return f + 4; }), 'soft')) } },
       { t: 'say', text: '⚠️ 흑 킹이 룩에게 다가오면 룩을 <b>멀리 반대쪽 끝</b>으로 옮겨요(잡히지 않게). 그다음 다시 사다리!', board: { pos: B({ c5: 'k', a4: 'R', b5: 'R', h1: 'K' }), marks: M(['b5'], 'ring'), arrows: [['b5', 'h5']] } }],
      { t: 'ex', text: '사다리 메이트', board: { pos: B({ d4: 'k', a3: 'R', b1: 'R', h1: 'K' }) },
        frames: [{ marks: M(F.split('').map(function (f) { return f + 3; }), 'soft'), cap: '룩 a3이 3번 줄을 막아요.' }, { mv: ['b1', 'b4'], marks: M(['d4'], 'bad'), cap: '룩 b4 체크!' }, { mv: ['d4', 'd5'], cap: '킹은 5번 줄로' }, { mv: ['a3', 'a5'], marks: M(['d5'], 'bad'), cap: '룩 a5 체크!' }, { mv: ['d5', 'd6'], cap: '6번 줄로' }, { mv: ['b4', 'b6'], marks: M(['d6'], 'bad'), cap: '룩 b6 체크!' }, { mv: ['d6', 'd7'], cap: '7번 줄로' }, { mv: ['a5', 'a7'], marks: M(['d7'], 'bad'), cap: '룩 a7 체크!' }, { mv: ['d7', 'd8'], cap: '끝 줄로' }, { mv: ['b6', 'b8'], marks: M(['d8'], 'bad'), cap: '룩 b8 체크메이트!' }] },
      '<b>사다리 메이트</b>: 룩 하나가 줄을 막고, 다른 룩이 다음 줄에서 체크. 번갈아 올라가요.'),
    mateGameLesson('mate-qr', '기본 메이트 ② 퀸과 룩', ['Q', 'R'], 12,
      [{ t: 'say', text: '<b>퀸과 룩</b>으로도 사다리 메이트를 할 수 있어요. 퀸이 더 힘이 세서 더 빨라요.', board: { pos: B({ e5: 'k', a1: 'Q', b2: 'R', h1: 'K' }) } },
       { t: 'say', text: '방법은 같아요: 한 말이 줄을 막고, 다른 말이 다음 줄에서 체크. 흑 킹이 다가오면 멀리 피해요.', board: { pos: B({ e5: 'k', a4: 'Q', b5: 'R', h1: 'K' }), marks: M(['e5'], 'bad') } }],
      { t: 'ex', text: '퀸과 룩 사다리', board: { pos: B({ e6: 'k', a5: 'Q', h1: 'K', b1: 'R' }) },
        frames: [{ mv: ['b1', 'b6'], marks: M(['e6'], 'bad'), cap: '룩 b6 체크!' }, { mv: ['e6', 'e7'], cap: '킹 7번 줄로' }, { mv: ['a5', 'a7'], marks: M(['e7'], 'bad'), cap: '퀸 a7 체크!' }, { mv: ['e7', 'e8'], cap: '끝 줄로' }, { mv: ['b6', 'b8'], marks: M(['e8'], 'bad'), cap: '룩 b8 메이트!' }] },
      '퀸과 룩도 <b>사다리</b>로 메이트해요.'),
    mateGameLesson('mate-kq1', '기본 메이트 ③ 킹과 퀸 ①', ['Q'], 20,
      [{ t: 'say', text: '이제 퀸 하나와 <b>킹</b>으로 메이트해요. 퀸 혼자는 메이트를 못 해서 <b>킹이 도와야</b> 해요.', board: { pos: B({ e7: 'k', d1: 'Q', e1: 'K' }) } },
       { t: 'say', text: '1단계: 퀸으로 흑 킹을 <b>상자</b>에 가둬요. 퀸을 나이트 뛰기 거리(L자)에 두면 킹이 갈 수 있는 곳이 확 줄어요.', board: { pos: B({ e7: 'k', d5: 'Q', e1: 'K' }), marks: J(M(['e7'], 'ring'), M(['d6', 'e6', 'f6', 'd7', 'd8'], 'x')) } },
       { t: 'say', text: '2단계: 흑 킹이 끝 줄에 가면 내 킹을 데려와요. 3단계: 킹이 퀸을 지켜 주며 퀸이 킹 바로 앞에서 메이트! ⚠️ 흑 킹이 갈 곳이 하나도 없게 만들면 스테일메이트예요.', board: { pos: B({ e8: 'k', e6: 'K', e7: 'Q' }), marks: M(['e8'], 'bad') } }],
      { t: 'ex', text: '킹과 퀸 메이트', board: { pos: B({ g8: 'k', a7: 'Q', e5: 'K' }) },
        frames: [{ marks: J(M(['g8'], 'ring'), M(['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'], 'soft')), cap: '퀸 a7이 7번 줄을 막아 흑 킹을 끝 줄에 가뒀어요.' }, { mv: ['e5', 'f6'], marks: M(['f6'], 'hi'), cap: '① 백 킹이 다가가요(f6). 이제 g7을 지켜 줄 수 있어요.' }, { mv: ['g8', 'h8'], cap: '흑 킹 h8' }, { marks: J(M(['f7'], 'x')), cap: '⚠️ 여기서 퀸 f7을 두면 흑 킹이 갈 곳이 없는데 체크가 아니라서 스테일메이트!' }, { mv: ['a7', 'g7'], marks: J(M(['h8'], 'bad'), M(['g7'], 'hi')), cap: '② 퀸 g7! 백 킹이 지켜 주는 체크메이트!' }] },
      '킹과 퀸 메이트: <b>퀸으로 가두고 → 킹을 데려오고 → 킹이 지키는 퀸으로 메이트.</b>', function (s) { return /[a-h][6-8]/.test(s) || /[ah]/.test(s[0]); }),
    mateGameLesson('mate-kq2', '기본 메이트 ④ 킹과 퀸 ②', ['Q'], 30,
      [{ t: 'say', text: '이번에는 흑 킹이 판 가운데에서 시작해요. 상자를 점점 작게 만들며 가장자리로 몰아요.', board: { pos: B({ d5: 'k', a1: 'Q', h1: 'K' }) } },
       { t: 'say', text: '비결: 퀸이 흑 킹과 <b>나이트 뛰기 거리</b>를 유지하며 따라가요. 흑 킹이 움직이면 퀸도 같은 방향으로. 상자가 작아지면 킹을 데려와요.', board: { pos: B({ d5: 'k', c3: 'Q', h1: 'K' }), marks: J(M(['d5'], 'ring'), M(['c3'], 'sel')) } }],
      { t: 'ex', text: '상자 줄이기', board: { pos: B({ d5: 'k', c3: 'Q', h1: 'K' }) },
        frames: [{ mv: ['d5', 'e4'], cap: '흑 킹 e4' }, { mv: ['c3', 'd2'], marks: M(['d2'], 'hi'), cap: '퀸도 따라 d2(나이트 거리)' }, { mv: ['e4', 'f3'], cap: '흑 킹 f3' }, { mv: ['d2', 'e1'], marks: M(['e1'], 'hi'), cap: '퀸 e1… 상자가 점점 작아져요.' }] },
      '퀸은 흑 킹과 <b>나이트 뛰기 거리</b>로 따라가며 상자를 줄여요.'),
    mateGameLesson('mate-kr', '기본 메이트 ⑤ 킹과 룩', ['R'], 40,
      [{ t: 'say', text: '<b>킹과 룩</b>으로 하는 메이트는 조금 더 오래 걸려요. 룩이 줄을 막고, 킹이 흑 킹과 <b>마주 보기</b>(오포지션)를 할 때 룩이 체크!', board: { pos: B({ e8: 'k', e6: 'K', a1: 'R' }), marks: M(['e8'], 'ring'), arrows: [['a1', 'a8']] } },
       { t: 'say', text: '흑 킹이 마주 보기를 피하면, 룩으로 한 칸 ‘기다리는 수’를 두어 다시 마주 보게 만들어요. 룩이 흑 킹에게 잡히지 않게 늘 멀리 두어요.', board: { pos: B({ e8: 'k', e6: 'K', a7: 'R' }), marks: M(['f8', 'd8'], 'soft') } }],
      { t: 'ex', text: '마주 보기와 룩 체크', board: { pos: B({ d8: 'k', d6: 'K', h2: 'R' }) },
        frames: [{ marks: J(M(['d8', 'd6'], 'ring')), cap: '두 킹이 마주 봤어요(오포지션).' }, { mv: ['h2', 'h8'], marks: M(['d8'], 'bad'), cap: '룩 h8 체크메이트! 백 킹이 c7·d7·e7을 막아요.' }] },
      '킹과 룩: 룩이 줄을 막고, 킹끼리 <b>마주 볼 때</b> 룩이 끝 줄에서 체크!', function (s) { return /[b-g][5-7]/.test(s); })
  ];

  /* ===== 24단원 첫 정식 대국 ===== */
  function firstGame(lv) {
    return { type: 'game', kind: 'deep', unit: '말', state: CH.START, game: AI.game(lv, { goal: 'win', lim: 40, lead: 3 }), level: lv,
      q: '🤖 인공지능(' + lv + '단계)과 <b>정식 대국</b>! 나는 백, 먼저 둬요. 체크메이트하면 이겨요. 40수까지 끝나지 않으면 말 값이 3점 이상 앞서야 이겨요.',
      winText: '대국에서 이겼어요! 🎉', loseTip: '말을 공짜로 주지 않았나요? 상대가 둔 수가 무엇을 노리는지 늘 살펴요.',
      hint: ['가운데 폰을 내고, 나이트와 비숍을 꺼내고, 캐슬링해요.', '공짜로 잡을 수 있는 말이 있나요? 내 말이 공격받고 있지는 않나요?'] };
  }
  var RULEQ = [
    ['체크를 받으면?', ['바로 벗어나야 해요', '다른 수를 두어도 돼요'], '바로 벗어나야 해요'],
    ['체크인데 벗어날 수 없으면?', ['체크메이트(짐)', '스테일메이트(비김)'], '체크메이트(짐)'],
    ['체크가 아닌데 둘 수가 없으면?', ['스테일메이트(비김)', '체크메이트(짐)'], '스테일메이트(비김)'],
    ['킹 쪽 캐슬링에서 킹은 어디로 가나요?', ['g1', 'f1', 'h1'], 'g1'],
    ['폰이 끝 줄에 닿으면?', ['퀸·룩·비숍·나이트로 바뀌어요', '킹으로 바뀌어요', '그대로 있어요'], '퀸·룩·비숍·나이트로 바뀌어요'],
    ['앙파상은 언제 할 수 있나요?', ['상대 폰이 두 칸 온 바로 다음 수', '아무 때나'], '상대 폰이 두 칸 온 바로 다음 수'],
    ['체스에서 먼저 두는 쪽은?', ['백', '흑'], '백'],
    ['킹끼리 바로 옆에 설 수 있나요?', ['없어요', '있어요'], '없어요']
  ];
  var u24 = [
    { id: 'game-rules', title: '정식 대국 규칙 정리', kind: 'one',
      screens: [
        { t: 'say', text: '이제 처음부터 끝까지 정식 대국을 할 수 있어요! 규칙을 정리해요. ① <b>백이 먼저</b>, 한 수씩 번갈아 둬요. ② 목표는 상대 킹을 <b>체크메이트</b>하는 것.', board: { pos: S0 } },
        { t: 'say', text: '③ 체크를 받으면 바로 벗어나요. ④ 내 킹이 공격받게 되는 수는 둘 수 없어요. ⑤ 특수 규칙: <b>캐슬링 · 프로모션 · 앙파상</b>.', board: { pos: S0 } },
        { t: 'say', text: '⑥ 비기는 경우: 스테일메이트, 양쪽 모두 메이트할 말이 없을 때 등(6마당에서 자세히). ⑦ 첫 수 팁: 가운데 폰 → 나이트·비숍 꺼내기 → 캐슬링!', board: { pos: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R' } },
        { t: 'ex', text: '대국의 처음 몇 수', board: { pos: S0 },
          frames: [{ mv: ['e2', 'e4'], cap: '1. e4 (가운데 폰)' }, { mv: ['e7', 'e5'], cap: '…e5' }, { mv: ['g1', 'f3'], cap: '2. 나이트 f3 (e5 폰을 공격)' }, { mv: ['b8', 'c6'], cap: '…나이트 c6 (지키기)' }, { mv: ['f1', 'c4'], cap: '3. 비숍 c4' }, { mv: ['g8', 'f6'], cap: '…나이트 f6' }, { mv: ['e1', 'g1'], cap: '4. 캐슬링!' }, { mv: ['h1', 'f1'], marks: M(['g1', 'f1'], 'ok'), cap: '킹이 안전해졌어요.' }] },
        { t: 'do', task: pickQ('정식 대국의 목표는?', ['상대 킹을 체크메이트하기', '상대 말을 모두 잡기', '폰을 끝 줄에 보내기'], '상대 킹을 체크메이트하기', { pos: S0 }, ['킹은 잡히지 않아요. 그 대신…']) }
      ],
      practice: { n: 8, gen: function (R) { var r = R.pick(RULEQ); return pickQ(r[0], R.shuffle(r[1]), r[2], { pos: S0 }, ['4마당에서 배운 규칙을 떠올려요.']); } },
      sum: '정식 대국: <b>백 먼저 · 체크메이트하면 승리 · 체크는 바로 벗어나기 · 캐슬링·프로모션·앙파상</b>.' },
    { id: 'game-first', title: '인공지능과 첫 대국', kind: 'deep',
      screens: [
        { t: 'say', text: '드디어 인공지능과 <b>정식 대국</b>이에요! 1단계 인공지능은 실수를 자주 해요. 차근차근 배운 것을 써 봐요.', board: { pos: S0 } },
        { t: 'say', text: '대국 중 습관: 상대가 두면 <b>“무엇을 노리지?”</b>, 내 차례에는 <b>“공짜로 잡을 것? 체크? 메이트?”</b> 그리고 내 말이 공짜로 잡히지 않는지 확인!', board: { pos: S0 } },
        { t: 'say', text: '40수까지 메이트하지 못하면, 그때 말 값이 <b>3점 이상</b> 앞서 있어야 이겨요. 💡 힌트를 누르면 인공지능이 좋은 수를 알려 줘요.', board: { pos: S0 } },
        { t: 'ex', text: '이런 메이트를 노려 봐요(스칼라스 메이트).', board: { pos: S0 },
          frames: [{ mv: ['e2', 'e4'], cap: '1. e4' }, { mv: ['e7', 'e5'], cap: '…e5' }, { mv: ['f1', 'c4'], cap: '2. 비숍 c4' }, { mv: ['b8', 'c6'], cap: '…나이트 c6' }, { mv: ['d1', 'h5'], cap: '3. 퀸 h5' }, { mv: ['g8', 'f6'], marks: M(['f7'], 'ring'), cap: '…나이트 f6? (실수)' }, { mv: ['h5', 'f7'], marks: M(['e8'], 'bad'), cap: '4. 퀸 f7 체크메이트! (상대가 이것을 할 수도 있으니 조심!)' }] },
        { t: 'do', task: firstGame(1) }
      ],
      practice: { n: 6, gen: function (R) { return R.int(2) ? firstGame(R.pick([1, 2])) : mateQ(R, R.pick(['Q', 'R', 'MIX'])); } },
      sum: '정식 대국에서는 <b>상대의 노림수를 살피고</b>, 공짜 말·체크·메이트를 찾아요. 축하해요, 이제 체스를 둘 수 있어요!' }
  ];

  window.MADANG = { id: 'm4', no: 4, title: '체크와 체크메이트, 특수 규칙', rank: '룩', rankPc: 'R', examN: 15,
    units: [{ title: '체크', lessons: u16 }, { title: '체크 벗어나기', lessons: u17 }, { title: '체크메이트', lessons: u18 }, { title: '스테일메이트', lessons: u19 }, { title: '캐슬링', lessons: u20 },
      { title: '프로모션', lessons: u21 }, { title: '앙파상', lessons: u22 }, { title: '기본 메이트', lessons: u23 }, { title: '첫 정식 대국', lessons: u24 }] };
})();
