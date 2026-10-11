/* 체스 학습관 2마당 · 말이 움직이는 법 (34차시) — window.MADANG
   차시 짜임은 learn.js 맨 위 설명. 연습 문제는 gen(R)이 할 때마다 새로 만듦(check.js가 여러 번 만들어 점검).
   새 문제 종류: 별 모으기(type 'move' — 말 하나로 별을 모두 모음, 가장 적은 횟수 par, 다음 한 수 next)
              폰 전쟁(type 'game' — 인공지능과 폰만으로 겨룸, T.game) */
(function () {
  'use strict';
  var CH = window.CH, PN = window.PIECES.NAME, jo = window.PIECES.jo, F = 'abcdefgh';
  var E = '8/8/8/8/8/8/8/8';
  var ALL = []; for (var i = 0; i < 64; i++) ALL.push(CH.name(i));
  function sqs(fn) { return ALL.filter(fn); }
  function light(s) { return ((8 - +s[1]) + F.indexOf(s[0])) % 2 === 0; }
  function rank(n) { return sqs(function (s) { return s[1] === String(n); }); }
  function file(c) { return sqs(function (s) { return s[0] === c; }); }
  function M(list, v) { var o = {}; list.forEach(function (s) { o[s] = v; }); return o; }
  function J() { var o = {}; [].forEach.call(arguments, function (m) { Object.keys(m || {}).forEach(function (k) { o[k] = (o[k] || []).concat(Array.isArray(m[k]) ? m[k] : [m[k]]); }); }); return o; }
  function L(s, t) { var o = {}; o[s] = { t: 'label', s: t, small: 1 }; return o; }
  function shift(s, df, dr) { var f = F.indexOf(s[0]) + df, r = +s[1] + dr; return f >= 0 && f < 8 && r >= 1 && r <= 8 ? F[f] + r : null; }
  function clickQ(q, ans, board, hint, extra) { return Object.assign({ type: 'click', q: q, ans: ans, board: board, hint: hint }, extra || {}); }
  function pickQ(q, opts, ans, board, hint, extra) { return Object.assign({ type: 'pick', q: q, opts: opts, ans: ans, board: board, hint: hint }, extra || {}); }
  function nm(c) { return PN[c.toUpperCase()]; }
  function pcAt(b, s) { return b[CH.idx(s)]; }
  function isEdge(s) { return s[0] === 'a' || s[0] === 'h' || s[1] === '1' || s[1] === '8'; }
  function corner(s) { return /^[ah][18]$/.test(s); }

  /* 판 만들기: B({d4:'R', d6:'P'}) */
  function B(o) { var b = CH.board(E); Object.keys(o).forEach(function (s) { b[CH.idx(s)] = o[s]; }); return b; }
  /* 칸 s의 말이 한 번에 갈 수 있는 칸(이름, 겹침 없이) */
  function tg(b, s) { var o = {}; CH.pieceMoves({ b: b, turn: 'w', cast: '', ep: -1 }, CH.idx(s)).forEach(function (m) { o[CH.name(m.to)] = 1; }); return Object.keys(o); }
  function only(c, s) { var o = {}; o[s] = c; return B(o); }
  var DIRS = { R: [[1, 0], [-1, 0], [0, 1], [0, -1]], B: [[1, 1], [1, -1], [-1, 1], [-1, -1]] }; DIRS.Q = DIRS.R.concat(DIRS.B);
  function ray(s, d) { var o = []; for (var k = 1; k < 8; k++) { var t = shift(s, d[0] * k, d[1] * k); if (!t) break; o.push(t); } return o; }
  function lines(s, t) { var o = []; DIRS[t].forEach(function (d) { o = o.concat(ray(s, d)); }); return o; }
  /* s0과 s 사이(같은 줄일 때)의 칸 */
  function between(s0, s) {
    var df = F.indexOf(s[0]) - F.indexOf(s0[0]), dr = +s[1] - +s0[1], n = Math.max(Math.abs(df), Math.abs(dr));
    if (!(df === 0 || dr === 0 || Math.abs(df) === Math.abs(dr))) return [];
    var o = []; for (var k = 1; k < n; k++) o.push(shift(s0, df / n * k, dr / n * k)); return o;
  }
  var SHAPE = { R: '룩은 가로줄이나 세로줄을 따라서만 가요.', B: '비숍은 대각선을 따라서만 가요.', Q: '퀸은 가로·세로·대각선 줄을 따라서만 가요.', K: '킹은 둘레의 칸으로 딱 한 칸만 가요.', N: '나이트는 L자 모양으로만 뛰어요.', P: '폰은 앞으로 가고, 잡을 때만 대각선 앞으로 한 칸 가요.' };
  /* 틀린 칸을 눌렀을 때 까닭: 같은 자리 · 내 편 말 · 길이 막힘 · 그렇게 못 감 */
  function whyFor(b, s0) {
    var c = pcAt(b, s0), n = nm(c);
    return function (s) {
      var t = pcAt(b, s);
      if (s === s0) return { text: '그 칸은 ' + jo(n, '이') + ' 지금 서 있는 칸이에요. 다른 칸을 찾아요.' };
      if (t !== '.' && CH.isW(t) === CH.isW(c)) return { text: '그 칸에는 ' + jo('내 편 ' + nm(t), '이') + ' 있어서 갈 수 없어요.', marks: M([s], 'bad') };
      if (t !== '.' && c.toUpperCase() === 'P') return { text: '폰은 앞에 있는 말을 잡을 수 없어요. 잡을 때는 대각선 앞으로 가요.', marks: M([s], 'bad') };
      if (tg(only(c, s0), s0).indexOf(s) >= 0) { var bt = between(s0, s).filter(function (x) { return pcAt(b, x) !== '.'; }); if (c.toUpperCase() === 'P' && !bt.length) bt = [shift(s0, 0, CH.isW(c) ? 1 : -1)];
        return { text: '그 칸으로 가는 길을 다른 말이 막고 있어요. ' + jo(n, '은') + ' 다른 말을 넘어갈 수 없어요.', marks: J(M([s], 'bad'), M(bt, 'ring')) }; }
      return { text: SHAPE[c.toUpperCase()], marks: M([s], 'bad') };
    };
  }
  /* 무작위 판: 움직일 말 c를 s0에 두고, 막는 말 blk개(내 편)를 놓음. near면 막는 말을 말의 길 위에 놓음 */
  var BLK = { R: ['P', 'P', 'N', 'B'], B: ['P', 'P', 'N', 'R'], Q: ['P', 'P', 'N'], K: ['P', 'P', 'N', 'B'], N: ['P', 'P', 'B', 'R'], P: ['P'] };
  function scene(R, c, o) {
    o = o || {}; var s0, b, n = 0;
    do {
      s0 = R.pick(sqs(o.at || function (s) { return c !== 'P' || (s[1] !== '1' && s[1] !== '8'); }));
      b = only(c, s0);
      var road = tg(b, s0);
      for (var k = 0; k < (o.blk || 0); k++) {
        var pool = (o.near !== false && road.length ? road : ALL).filter(function (s) { return pcAt(b, s) === '.'; }), pc = R.pick(BLK[c.toUpperCase()]);
        pool = pool.filter(function (s) { return !(pc === 'P' && (s[1] === '1' || s[1] === '8')); });
        if (pool.length) b[CH.idx(R.pick(pool))] = pc;
      }
    } while (++n < 200 && !tg(b, s0).length);
    return { b: b, s0: s0, t: tg(b, s0) };
  }
  /* 문제 틀: 한 칸 고르기 · 모두 찾기 · 갈 수 있나요 · 몇 칸 */
  function oneQ(R, c, o) {
    o = o || {}; var sc = scene(R, c, o), ans = o.filter ? sc.t.filter(function (s) { return o.filter(sc.s0, s); }) : sc.t;
    if (!ans.length) return oneQ(R, c, o);
    return clickQ(o.q || (jo(nm(c), '이') + ' 한 번에 갈 수 있는 칸을 하나 눌러요.'), ans, { pos: sc.b, marks: M([sc.s0], 'sel') }, o.hint || [SHAPE[c], { text: '갈 수 있는 칸 가운데 몇 곳이 반짝여요.', marks: M(R.shuffle(ans).slice(0, Math.min(3, ans.length)), 'hint') }], { why: whyFor(sc.b, sc.s0) });
  }
  function allQ(R, c, o) {
    o = o || {}; var sc = scene(R, c, o);
    return clickQ(o.q || (jo(nm(c), '이') + ' 한 번에 갈 수 있는 칸을 <b>모두</b> 눌러요.'), sc.t, { pos: sc.b, marks: M([sc.s0], 'sel') },
      [o.h1 || SHAPE[c], { text: '이 줄들을 따라가 봐요.', marks: M(c === 'N' || c === 'K' || c === 'P' ? sc.t : lines(sc.s0, c).filter(function (s) { return sc.t.indexOf(s) >= 0; }), 'soft') }], { all: true, kind: 'one', why: whyFor(sc.b, sc.s0) });
  }
  function canQ(R, c, o) {
    o = o || {}; var sc = scene(R, c, o), yes = R.int(2) === 1, near = c === 'N' ? sqs(function (s) { return Math.abs(F.indexOf(s[0]) - F.indexOf(sc.s0[0])) <= 2 && Math.abs(+s[1] - +sc.s0[1]) <= 2; }) : lines(sc.s0, 'Q');
    var noPool = near.filter(function (s) { return s !== sc.s0 && sc.t.indexOf(s) < 0 && pcAt(sc.b, s) === '.'; }), s;
    if (yes || !noPool.length) { s = R.pick(sc.t); yes = true; } else s = R.pick(noPool);
    return pickQ(jo(nm(c), '이') + ' 별이 있는 칸으로 <b>한 번에</b> 갈 수 있을까요?', ['갈 수 있어요', '갈 수 없어요'], yes ? '갈 수 있어요' : '갈 수 없어요', { pos: sc.b, marks: J(M([sc.s0], 'sel'), M([s], 'star')) },
      [SHAPE[c], { text: '별까지 가는 길을 따라가 봐요. 막는 말이 있나요?', marks: M(between(sc.s0, s), 'soft') }],
      { why: function () { return yes ? { text: '별 칸은 ' + jo(nm(c), '이') + ' 갈 수 있는 칸이에요.', marks: M(sc.t, 'dot') } : whyFor(sc.b, sc.s0)(s); } });
  }
  function countQ(R, c, o) {
    o = o || {}; var sc = scene(R, c, o), n = sc.t.length, pool = [];
    for (var k = Math.max(1, n - 4); k <= n + 4; k++) pool.push(k + '칸');
    return pickQ(jo(nm(c), '이') + ' 한 번에 갈 수 있는 칸은 모두 몇 칸인가요?', R.opts(n + '칸', pool), n + '칸', { pos: sc.b, marks: M([sc.s0], 'sel') },
      [o.h1 || '갈 수 있는 칸을 하나씩 손가락으로 짚으며 세어 봐요.', { text: '갈 수 있는 칸에 점을 찍었어요. 세어 봐요.', marks: M(sc.t, 'dot') }]);
  }

  /* ===== 별 모으기 ===== */
  /* 가장 적은 횟수 찾기: 상태(말 자리, 모은 별) 너비 우선 탐색. 잡을 수 있는 말(상대)에는 별이 있을 때만 들어감 */
  function solver(b0, mover, stars) {
    var pc = pcAt(b0, mover), base = b0.slice(); base[CH.idx(mover)] = '.';
    var full = (1 << stars.length) - 1;
    function bd(at, mask) { var b = base.slice(); stars.forEach(function (s, k) { if (mask & (1 << k)) b[CH.idx(s)] = '.'; }); b[CH.idx(at)] = pc; return b; }
    function step(at, mask) { var b = bd(at, mask); return tg(b, at).filter(function (t) { var x = pcAt(b, t); return x === '.' || stars.indexOf(t) >= 0; }); }
    function bfs(at, mask) {
      if (mask === full) return { d: 0, first: null };
      var seen = {}, q = [[at, mask, null]], d = 0; seen[at + mask] = 1;
      while (q.length) {
        d++; var nq = [];
        for (var a = 0; a < q.length; a++) {
          var st = q[a], nx = step(st[0], st[1]);
          for (var k = 0; k < nx.length; k++) {
            var t = nx[k], si = stars.indexOf(t), m = si >= 0 ? st[1] | (1 << si) : st[1], f = st[2] || t;
            if (m === full) return { d: d, first: f };
            if (!seen[t + m]) { seen[t + m] = 1; nq.push([t, m, f]); }
          }
        }
        q = nq; if (d > 40) break;
      }
      return { d: Infinity, first: null };
    }
    return {
      par: bfs(mover, 0).d,
      next: function (at, rem) { var m = 0; stars.forEach(function (s, k) { if (rem.indexOf(s) < 0) m |= 1 << k; }); return bfs(at, m).first; }
    };
  }
  /* 별 모으기 문제. o = {n 별 수, blk 막는 폰 수, min·max 가장 적은 횟수 범위, at 시작 칸 조건, foe 별 밑에 둘 상대 말(폰 잡기)} */
  function starQ(R, c, o) {
    o = o || {};
    for (var tries = 0; tries < 400; tries++) {
      var s0 = R.pick(sqs(o.at || function (s) { return c !== 'P' || (s[1] !== '1' && s[1] !== '8'); })), b = only(c, s0), k;
      for (k = 0; k < (o.blk || 0); k++) { var e = sqs(function (s) { return pcAt(b, s) === '.' && s[1] !== '1' && s[1] !== '8'; }); b[CH.idx(R.pick(e))] = 'P'; }
      var stars = [], free = sqs(o.starAt ? function (s) { return pcAt(b, s) === '.' && o.starAt(s, s0); } : function (s) { return pcAt(b, s) === '.'; });
      free = R.shuffle(free); for (k = 0; k < (o.n || 1) && k < free.length; k++) stars.push(free[k]);
      if (o.foe) stars.forEach(function (s, j) { if (j < o.foe) b[CH.idx(s)] = 'p'; });
      var sv = solver(b, s0, stars);
      if (sv.par === Infinity || sv.par < (o.min || 1) || sv.par > (o.max || 9)) continue;
      return { type: 'move', kind: 'deep', capture: !!o.foe, q: o.q || (jo(nm(c), '을') + ' 움직여서 별 ' + stars.length + '개를 모두 모아요. 가장 적게 <b>' + sv.par + '번</b>에 모을 수 있어요.'),
        board: { pos: b }, mover: s0, stars: stars, par: sv.par, next: sv.next,
        hint: [o.h1 || '별이 있는 칸에 <b>멈춰야</b> 별을 모아요. 지나가기만 하면 안 모여요.', o.h2 || '어느 별부터 모을지 차례를 먼저 정해요. 한 줄 위에 있는 별은 이어서 모으기 쉬워요.'] };
    }
    throw new Error('별 모으기 문제를 못 만듦 ' + c);
  }
  /* 고정 별 모으기(따라 하기) */
  function starFix(c, s0, stars, extra, q) {
    var b = only(c, s0); Object.keys(extra || {}).forEach(function (s) { b[CH.idx(s)] = extra[s]; });
    var sv = solver(b, s0, stars), cap = stars.some(function (s) { return pcAt(b, s) !== '.'; });
    return { type: 'move', kind: 'deep', capture: cap, q: q || (jo(nm(c), '을') + ' 움직여서 별을 모두 모아요. 가장 적게 <b>' + sv.par + '번</b>에 모을 수 있어요.'), board: { pos: b }, mover: s0, stars: stars, par: sv.par, next: sv.next,
      hint: ['별이 있는 칸에 멈춰야 별을 모아요.', '움직일 말을 볼 필요는 없어요. 바로 갈 칸을 누르면 말이 움직여요.'] };
  }
  /* 별 모으기 차시(룩·비숍·퀸·킹·나이트 같은 짜임) */
  var TNO = { R: '룩 ⑤', B: '비숍 ⑤', Q: '퀸 ④', K: '킹 ④', N: '나이트 ⑥' };
  function starLesson(c, id, intro, ex, fix, gen) {
    var sb = { pos: fix.board.pos, marks: J(M(fix.stars, 'star'), M([fix.mover], 'sel')) };
    return { id: id, title: TNO[c] + ' 별 모으기', kind: 'deep',
      screens: [
        { t: 'say', text: '<b>별 모으기 놀이</b>를 해요. ' + jo(nm(c), '을') + ' 움직여서 판 위의 별을 모두 모으면 이겨요.', board: sb },
        { t: 'say', text: '움직이는 법: 갈 칸을 바로 누르면 ' + jo(nm(c), '이') + ' 그 칸으로 가요. 갈 수 없는 칸을 누르면 갈 수 있는 칸에 초록 점이 보여요.', board: sb },
        { t: 'say', text: '별이 있는 칸에 <b>멈춰야</b> 별을 모아요. 별 위를 <b>지나가기만</b> 하면 안 모여요. 그리고 <b>가장 적은 횟수</b>로 모으도록 도전해요. 문제에 가장 적은 횟수가 적혀 있어요.', board: sb },
        { t: 'say', text: intro, board: sb },
        ex,
        { t: 'do', task: fix }
      ],
      practice: { n: 6, gen: gen },
      sum: '별 모으기는 <b>멈출 칸</b>과 <b>모을 차례</b>를 먼저 생각해요. ' + SHAPE[c] };
  }

  /* ===== 4단원 룩 ===== */
  var u4 = [
    { id: 'rook-row', title: '룩 ① 가로로 쭉', kind: 'easy',
      screens: [
        { t: 'say', text: '이제 말이 움직이는 법을 배워요. 첫 번째는 <b>룩</b>이에요. 룩은 성탑처럼 생겼고, <b>곧은 줄</b>을 따라 움직여요.', big: ['R', 'r'], board: { pos: B({ d4: 'R' }) } },
        { t: 'say', text: '룩은 <b>가로줄(랭크)</b>을 따라 <b>왼쪽이나 오른쪽</b>으로 갈 수 있어요. 점이 찍힌 칸이 룩이 갈 수 있는 칸이에요.', board: { pos: B({ d4: 'R' }), marks: J(M(['d4'], 'sel'), M(['a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'], 'dot')) } },
        { t: 'say', text: '한 칸만 가도 되고, 여러 칸을 <b>쭉</b> 가도 돼요. 판 끝까지도 한 번에 갈 수 있어요. 한 번 움직일 때 몇 칸을 갈지는 내가 정해요.', board: { pos: B({ d4: 'R' }), marks: M(['d4'], 'sel'), arrows: [['d4', 'e4'], ['d4', 'h4']] } },
        { t: 'say', text: '하지만 한 번 움직일 때는 <b>한 방향으로만</b> 가요. 오른쪽으로 가다가 중간에 꺾을 수는 없어요. 꺾고 싶으면 한 번 더 움직여야 해요.', board: { pos: B({ d4: 'R' }), marks: J(M(['d4'], 'sel'), M(['f6'], 'x')), arrows: [['d4', 'f4']] } }
      ].concat([
        { t: 'ex', text: 'd4의 룩이 가로줄을 따라 움직여요.', board: { pos: B({ d4: 'R' }) },
          frames: [{ marks: M(rank(4).filter(function (s) { return s !== 'd4'; }), 'dot'), cap: '4번 가로줄의 칸으로 갈 수 있어요.' }, { mv: ['d4', 'h4'], marks: { h4: 'hi' }, cap: '오른쪽 끝까지 한 번에!' }, { mv: ['h4', 'a4'], marks: { a4: 'hi' }, cap: '이번엔 왼쪽 끝까지 한 번에!' }, { mv: ['a4', 'b4'], marks: { b4: 'hi' }, cap: '한 칸만 가도 돼요.' }] },
        { t: 'ex', text: '룩이 있는 줄이 바뀌면 갈 수 있는 줄도 바뀌어요.', board: { pos: B({ b7: 'R' }) },
          frames: [{ marks: J(M(['b7'], 'sel'), M(rank(7).filter(function (s) { return s !== 'b7'; }), 'dot')), cap: 'b7의 룩은 7번 가로줄을 따라 가요.' }, { pos: B({ g2: 'R' }), marks: J(M(['g2'], 'sel'), M(rank(2).filter(function (s) { return s !== 'g2'; }), 'dot')), cap: 'g2의 룩은 2번 가로줄을 따라 가요.' }] },
        { t: 'do', task: clickQ('룩이 <b>가로로</b> 갈 수 있는 칸을 하나 눌러 보세요.', rank(5).filter(function (s) { return s !== 'c5'; }), { pos: B({ c5: 'R' }), marks: { c5: 'sel' } }, ['룩이 있는 가로줄을 따라 왼쪽이나 오른쪽이에요.', { text: '이 줄의 칸이에요.', marks: M(rank(5), 'soft') }], { why: function (s) { return { text: '그 칸은 룩과 같은 가로줄이 아니에요. 룩이 있는 5번 가로줄을 따라가요.', marks: M([s], 'bad') }; } }) },
        { t: 'do', task: starFix('R', 'b3', ['g3'], null, '룩을 움직여서 별을 모아요. 별 칸을 눌러 보세요.') }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(4);
        if (k === 0) return oneQ(R, 'R', { q: '룩이 <b>가로로</b> 갈 수 있는 칸을 하나 눌러요.', filter: function (a, s) { return a[1] === s[1]; } });
        if (k === 1) { var s0 = R.sq(), yes = R.int(2) === 1, t = yes ? R.pick(rank(+s0[1]).filter(function (s) { return s !== s0; })) : R.pick(sqs(function (s) { return s[1] !== s0[1] && s[0] !== s0[0]; }));
          return pickQ('룩이 별 칸으로 <b>한 번에</b> 갈 수 있을까요?', ['갈 수 있어요', '갈 수 없어요'], yes ? '갈 수 있어요' : '갈 수 없어요', { pos: only('R', s0), marks: J(M([s0], 'sel'), M([t], 'star')) }, ['룩과 별이 같은 가로줄에 있나요?', { text: '룩이 있는 가로줄이에요.', marks: M(rank(+s0[1]), 'soft') }]); }
        if (k === 2) { var s1 = R.sq(), r = rank(+s1[1]).filter(function (s) { return s !== s1; }), t1 = R.pick(r); return starQ(R, 'R', { at: function (s) { return s === s1; }, starAt: function (s) { return s === t1; }, q: '룩을 가로로 움직여서 별을 모아요.' }); }
        var s2 = R.sq(); return pickQ('이 룩이 <b>가로로</b> 갈 수 있는 칸은 모두 몇 칸인가요?', ['5칸', '6칸', '7칸', '8칸'], '7칸', { pos: only('R', s2), marks: J(M([s2], 'sel'), M(rank(+s2[1]), 'soft')) }, ['한 줄은 8칸이에요. 룩이 서 있는 칸은 빼요.']);
      } },
      sum: '<b>룩</b>은 가로줄을 따라 왼쪽·오른쪽으로 <b>원하는 만큼</b> 가요. 한 번에 한 방향으로만!' },

    { id: 'rook-col', title: '룩 ② 세로로 쭉', kind: 'easy',
      screens: [
        { t: 'say', text: '룩은 <b>세로줄(파일)</b>을 따라 <b>위나 아래</b>로도 갈 수 있어요. 가로로 갈 때와 똑같이 원하는 만큼 쭉 가요.', board: { pos: B({ d4: 'R' }), marks: J(M(['d4'], 'sel'), M(file('d').filter(function (s) { return s !== 'd4'; }), 'dot')) } },
        { t: 'say', text: '가로줄과 세로줄을 합치면 룩이 갈 수 있는 칸이 <b>십자(+) 모양</b>이 돼요.', board: { pos: B({ d4: 'R' }), marks: J(M(['d4'], 'sel'), M(lines('d4', 'R'), 'dot')) } },
        { t: 'say', text: '아무것도 막지 않으면 룩은 판 어디에 있든 <b>14칸</b>으로 갈 수 있어요. 가로로 7칸, 세로로 7칸이니까요.', board: { pos: B({ a1: 'R' }), marks: J(M(['a1'], 'sel'), M(lines('a1', 'R'), 'dot')) } },
        { t: 'say', text: '룩은 <b>비스듬히(대각선으로)</b>는 갈 수 없어요. 대각선 칸은 두 번 움직여야 갈 수 있어요.', board: { pos: B({ d4: 'R' }), marks: J(M(['d4'], 'sel'), M(['e5', 'c3', 'f6'], 'x')) } }
      ].concat([
        { t: 'ex', text: '룩이 세로로, 그리고 가로로 움직여요.', board: { pos: B({ e2: 'R' }) },
          frames: [{ marks: J(M(['e2'], 'sel'), M(lines('e2', 'R'), 'dot')), cap: '십자 모양으로 갈 수 있어요.' }, { mv: ['e2', 'e7'], marks: { e7: 'hi' }, cap: '위로 쭉 e7까지.' }, { mv: ['e7', 'b7'], marks: { b7: 'hi' }, cap: '이번엔 왼쪽으로 b7까지.' }, { mv: ['b7', 'b1'], marks: { b1: 'hi' }, cap: '아래로 b1까지. 줄을 바꿀 때마다 한 번씩 움직여요.' }] },
        { t: 'ex', text: '대각선 칸에 가려면 어떻게 할까요?', board: { pos: B({ c3: 'R' }) },
          frames: [{ marks: J(M(['c3'], 'sel'), M(['f6'], 'star')), cap: 'f6은 대각선 방향이라 한 번에 못 가요.' }, { mv: ['c3', 'c6'], marks: J(M(['c6'], 'hi'), M(['f6'], 'star')), cap: '먼저 위로 c6까지,' }, { mv: ['c6', 'f6'], marks: { f6: 'ok' }, cap: '그다음 오른쪽으로 f6! 두 번 만에 도착했어요.' }] },
        { t: 'do', task: clickQ('룩이 <b>세로로</b> 갈 수 있는 칸을 하나 눌러 보세요.', file('f').filter(function (s) { return s !== 'f3'; }), { pos: B({ f3: 'R' }), marks: { f3: 'sel' } }, ['룩이 있는 세로줄을 따라 위나 아래예요.', { text: '이 줄의 칸이에요.', marks: M(file('f'), 'soft') }], { why: function (s) { return { text: '그 칸은 룩과 같은 세로줄이 아니에요.', marks: M([s], 'bad') }; } }) },
        { t: 'do', task: starFix('R', 'b2', ['b7', 'g7']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(5);
        if (k === 0) return oneQ(R, 'R', { q: '룩이 <b>세로로</b> 갈 수 있는 칸을 하나 눌러요.', filter: function (a, s) { return a[0] === s[0]; } });
        if (k === 1) return oneQ(R, 'R');
        if (k === 2) return canQ(R, 'R');
        if (k === 3) return pickQ('아무것도 막지 않을 때, 룩은 몇 칸으로 갈 수 있나요?', ['7칸', '8칸', '14칸', '16칸'], '14칸', { pos: only('R', R.sq()) }, ['가로로 7칸, 세로로 7칸이에요.']);
        return starQ(R, 'R', { n: 2, min: 2, max: 3 });
      } },
      sum: '<b>룩</b>은 가로·세로로 원하는 만큼, <b>십자(+) 모양</b>으로 가요. 막는 것이 없으면 <b>14칸</b>. 대각선으로는 못 가요.' },

    { id: 'rook-block', title: '룩 ③ 길이 막히면', kind: 'one',
      screens: [
        { t: 'say', text: '룩이 가는 길에 <b>다른 말</b>이 있으면 어떻게 될까요? 룩은 다른 말을 <b>넘어갈 수 없어요.</b>', board: { pos: B({ b4: 'R', f4: 'P' }), marks: J(M(['b4'], 'sel'), M(['f4'], 'ring')) } },
        { t: 'say', text: '<b>내 편 말</b>이 막고 있으면 그 말 <b>바로 앞 칸까지만</b> 갈 수 있어요. 내 편 말이 있는 칸에는 들어갈 수 없어요.', board: { pos: B({ b4: 'R', f4: 'P' }), marks: J(M(['b4'], 'sel'), M(['c4', 'd4', 'e4', 'a4'], 'dot'), M(['g4', 'h4'], 'x')) } },
        { t: 'say', text: '한 방향이 막혀도 <b>다른 방향</b>은 그대로 갈 수 있어요. 방향마다 따로 살펴봐요.', board: { pos: B({ b4: 'R', f4: 'P' }), marks: J(M(['b4'], 'sel'), M(tg(B({ b4: 'R', f4: 'P' }), 'b4'), 'dot')) } },
        { t: 'say', text: '상대 말이 길을 막고 있으면 그 말을 <b>잡으며</b> 그 칸까지 갈 수 있어요. 잡기는 <b>3마당</b>에서 자세히 배워요. 이번 마당에서는 내 편 말만 길을 막아요.', board: { pos: B({ b4: 'R', f4: 'p' }), marks: J(M(['b4'], 'sel'), M(['f4'], 'ring')) } }
      ].concat([
        { t: 'ex', text: '룩이 내 편 폰에 막혔어요.', board: { pos: B({ d2: 'R', d6: 'P', f2: 'N' }) },
          frames: [{ marks: M(['d2'], 'sel'), cap: '위쪽에는 d6의 폰, 오른쪽에는 f2의 나이트가 있어요.' }, { marks: J(M(['d2'], 'sel'), M(['d3', 'd4', 'd5'], 'dot'), M(['d7', 'd8'], 'x')), cap: '위로는 d5까지만. 폰을 넘어 d7·d8로는 못 가요.' }, { marks: J(M(['d2'], 'sel'), M(['e2'], 'dot'), M(['g2', 'h2'], 'x')), cap: '오른쪽으로는 e2 한 칸뿐!' }, { marks: J(M(['d2'], 'sel'), M(tg(B({ d2: 'R', d6: 'P', f2: 'N' }), 'd2'), 'dot')), cap: '갈 수 있는 칸을 모두 모으면 이렇게 돼요.' }] },
        { t: 'ex', text: '막힌 길을 돌아서 가요.', board: { pos: B({ a1: 'R', a5: 'P' }) },
          frames: [{ marks: J(M(['a1'], 'sel'), M(['a8'], 'star')), cap: 'a8에 가고 싶은데 a5의 폰이 막고 있어요.' }, { mv: ['a1', 'b1'], marks: { b1: 'hi' }, cap: '옆 줄로 비켜서,' }, { mv: ['b1', 'b8'], marks: { b8: 'hi' }, cap: '위로 쭉 올라가고,' }, { mv: ['b8', 'a8'], marks: { a8: 'ok' }, cap: '왼쪽으로 한 칸. 세 번 만에 도착!' }] },
        { t: 'do', task: clickQ('폰에 막힌 룩이 <b>위로</b> 갈 수 있는 칸을 모두 눌러 보세요.', ['c3', 'c4', 'c5'], { pos: B({ c2: 'R', c6: 'P' }), marks: { c2: 'sel' } }, ['폰 바로 앞 칸까지만 갈 수 있어요.', { text: '이 칸들이에요.', marks: M(['c3', 'c4', 'c5'], 'soft') }], { all: true, why: whyFor(B({ c2: 'R', c6: 'P' }), 'c2') }) },
        { t: 'do', task: starFix('R', 'a1', ['h8'], { d1: 'P', a6: 'P' }) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(4);
        if (k === 0) return oneQ(R, 'R', { blk: 2 });
        if (k === 1) return canQ(R, 'R', { blk: 2 });
        if (k === 2) return pickQ('룩과 별 사이에 내 편 말이 있으면 룩이 별 칸으로 한 번에 갈 수 있을까요?', ['갈 수 있어요', '갈 수 없어요'], '갈 수 없어요', { pos: B({ b5: 'R', e5: 'N' }), marks: J(M(['b5'], 'sel'), M(['g5'], 'star'), M(['e5'], 'ring')) }, ['룩은 다른 말을 넘어갈 수 없어요.']);
        return starQ(R, 'R', { n: 1, blk: 3, min: 2, max: 3 });
      } },
      sum: '룩은 다른 말을 <b>넘어갈 수 없어요.</b> 내 편 말이 막으면 그 <b>바로 앞 칸까지만</b> 가요.' },

    { id: 'rook-all', title: '룩 ④ 갈 수 있는 칸 모두 찾기', kind: 'one',
      screens: [
        { t: 'say', text: '룩이 갈 수 있는 칸을 <b>빠짐없이</b> 찾는 방법을 배워요. 방향은 <b>위·아래·왼쪽·오른쪽</b> 네 가지예요.', board: { pos: B({ e4: 'R' }), marks: M(['e4'], 'sel'), arrows: [['e4', 'e8'], ['e4', 'e1'], ['e4', 'a4'], ['e4', 'h4']] } },
        { t: 'say', text: '한 방향씩 차례로 손가락을 쭉 밀어 봐요. 판 끝이나 <b>막는 말</b>을 만나면 멈추고, 다음 방향으로 가요.', board: { pos: B({ e4: 'R', e7: 'P', b4: 'B' }), marks: J(M(['e4'], 'sel'), M(['e7', 'b4'], 'ring')) } },
        { t: 'say', text: '네 방향을 다 살피면 끝! 하나씩 세면 모두 몇 칸인지도 알 수 있어요.', board: { pos: B({ e4: 'R', e7: 'P', b4: 'B' }), marks: J(M(['e4'], 'sel'), M(tg(B({ e4: 'R', e7: 'P', b4: 'B' }), 'e4'), 'dot')) } }
      ].concat([
        { t: 'ex', text: '네 방향을 하나씩 살펴요.', board: { pos: B({ e4: 'R', e7: 'P', b4: 'B' }) },
          frames: [{ marks: J(M(['e4'], 'sel'), M(['e5', 'e6'], 'dot')), cap: '① 위: e5, e6 (e7에 폰)' }, { marks: J(M(['e4'], 'sel'), M(['e5', 'e6', 'e3', 'e2', 'e1'], 'dot')), cap: '② 아래: e3, e2, e1 (판 끝)' }, { marks: J(M(['e4'], 'sel'), M(['e5', 'e6', 'e3', 'e2', 'e1', 'd4', 'c4'], 'dot')), cap: '③ 왼쪽: d4, c4 (b4에 비숍)' }, { marks: J(M(['e4'], 'sel'), M(tg(B({ e4: 'R', e7: 'P', b4: 'B' }), 'e4'), 'dot')), cap: '④ 오른쪽: f4, g4, h4 → 모두 10칸!' }] },
        { t: 'ex', text: '귀퉁이에 있는 룩은 두 방향만 살피면 돼요.', board: { pos: B({ h1: 'R', h5: 'P' }) },
          frames: [{ marks: M(['h1'], 'sel'), cap: 'h1 귀퉁이의 룩이에요.' }, { marks: J(M(['h1'], 'sel'), M(tg(B({ h1: 'R', h5: 'P' }), 'h1'), 'dot')), cap: '위로 3칸, 왼쪽으로 7칸 → 모두 10칸.' }] },
        { t: 'do', task: clickQ('룩이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', tg(B({ c3: 'R', c6: 'P', f3: 'N' }), 'c3'), { pos: B({ c3: 'R', c6: 'P', f3: 'N' }), marks: { c3: 'sel' } }, ['위·아래·왼쪽·오른쪽 네 방향을 하나씩 살펴요.', { text: '이 줄들을 따라가요.', marks: M(tg(B({ c3: 'R', c6: 'P', f3: 'N' }), 'c3'), 'soft') }], { all: true, why: whyFor(B({ c3: 'R', c6: 'P', f3: 'N' }), 'c3') }) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(3);
        if (k === 0) return countQ(R, 'R', { blk: R.int(3) + 1, h1: '네 방향을 차례로 살피며 세어 봐요.' });
        return allQ(R, 'R', { blk: R.int(3) + 1, h1: '위·아래·왼쪽·오른쪽 네 방향을 하나씩 살펴요. 막는 말 앞에서 멈춰요.' });
      } },
      sum: '갈 수 있는 칸은 <b>방향마다 차례로</b> 찾아요. 룩은 위·아래·왼쪽·오른쪽 네 방향, 막는 말 앞에서 멈춰요.' },

    starLesson('R', 'rook-stars', '이번 별은 룩이 갈 수 있는 곳에 있어요. 룩은 한 번에 쭉 갈 수 있으니까 <b>같은 줄의 별</b>을 이어서 모으면 횟수가 줄어요.',
      { t: 'ex', text: '별 세 개를 세 번 만에 모아요.', board: { pos: B({ a1: 'R' }) },
        frames: [{ marks: M(['a6', 'f6', 'f2'], 'star'), cap: 'a1의 룩, 별은 a6·f6·f2에 있어요.' }, { mv: ['a1', 'a6'], marks: M(['f6', 'f2'], 'star'), cap: '① 위로 a6. 별 하나!' }, { mv: ['a6', 'f6'], marks: M(['f2'], 'star'), cap: '② 오른쪽으로 f6. 별 둘!' }, { mv: ['f6', 'f2'], marks: { f2: 'ok' }, cap: '③ 아래로 f2. 세 번 만에 다 모았어요!' }] },
      starFix('R', 'a1', ['a6', 'f6', 'f2']),
      function (R) { return starQ(R, 'R', { n: R.int(2) + 2, blk: R.int(3), min: 2, max: 5 }); })
  ];

  /* ===== 5단원 비숍 ===== */
  var u5 = [
    { id: 'bishop-diag', title: '비숍 ① 대각선으로', kind: 'easy',
      screens: [
        { t: 'say', text: '두 번째 말은 <b>비숍</b>이에요. 비숍은 <b>대각선</b>(비스듬한 줄)을 따라 움직여요.', big: ['B', 'b'], board: { pos: B({ d4: 'B' }), marks: M(['d4'], 'sel') } },
        { t: 'say', text: '비숍이 갈 수 있는 방향은 <b>네 가지</b>예요: 오른쪽 위, 왼쪽 위, 오른쪽 아래, 왼쪽 아래. 모으면 <b>X 모양</b>이에요.', board: { pos: B({ d4: 'B' }), marks: J(M(['d4'], 'sel'), M(lines('d4', 'B'), 'dot')) } },
        { t: 'say', text: '룩처럼 비숍도 한 칸만 가도 되고, <b>원하는 만큼 쭉</b> 가도 돼요. 한 번 움직일 때는 한 방향으로만 가요.', board: { pos: B({ d4: 'B' }), marks: M(['d4'], 'sel'), arrows: [['d4', 'h8'], ['d4', 'c3']] } },
        { t: 'say', text: '비숍은 <b>가로나 세로</b>로는 갈 수 없어요. 바로 옆 칸이나 바로 위 칸도 못 가요!', board: { pos: B({ d4: 'B' }), marks: J(M(['d4'], 'sel'), M(['d5', 'e4', 'c4', 'd3'], 'x')) } }
      ].concat([
        { t: 'ex', text: '비숍이 대각선을 따라 움직여요.', board: { pos: B({ c1: 'B' }) },
          frames: [{ marks: J(M(['c1'], 'sel'), M(lines('c1', 'B'), 'dot')), cap: 'c1의 비숍은 두 대각선으로 갈 수 있어요.' }, { mv: ['c1', 'h6'], marks: { h6: 'hi' }, cap: '오른쪽 위로 쭉 h6까지!' }, { mv: ['h6', 'e3'], marks: { e3: 'hi' }, cap: '왼쪽 아래로 e3까지.' }, { mv: ['e3', 'a7'], marks: { a7: 'hi' }, cap: '왼쪽 위로 쭉 a7까지.' }] },
        { t: 'ex', text: '가운데에 있는 비숍과 가장자리에 있는 비숍을 견주어 봐요.', board: { pos: B({ d4: 'B' }) },
          frames: [{ marks: J(M(['d4'], 'sel'), M(lines('d4', 'B'), 'dot')), cap: '가운데 d4: 13칸으로 갈 수 있어요.' }, { pos: B({ a1: 'B' }), marks: J(M(['a1'], 'sel'), M(lines('a1', 'B'), 'dot')), cap: '귀퉁이 a1: 7칸뿐이에요. 비숍은 가운데에서 더 힘이 세요.' }] },
        { t: 'do', task: clickQ('비숍이 갈 수 있는 칸을 하나 눌러 보세요.', lines('e3', 'B'), { pos: B({ e3: 'B' }), marks: { e3: 'sel' } }, ['비스듬한 줄을 따라가요.', { text: '이 X 모양의 칸이에요.', marks: M(lines('e3', 'B'), 'soft') }], { why: whyFor(B({ e3: 'B' }), 'e3') }) },
        { t: 'do', task: starFix('B', 'b2', ['g7']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(4);
        if (k === 0) return oneQ(R, 'B');
        if (k === 1) return canQ(R, 'B');
        if (k === 2) return pickQ('비숍은 어느 방향으로 움직이나요?', R.shuffle(['대각선(X 모양)', '가로·세로(+ 모양)', 'L자 모양']), '대각선(X 모양)', { pos: B({ d4: 'B' }), marks: M(['d4'], 'sel') }, ['비스듬한 줄이에요.']);
        return starQ(R, 'B', { n: 1, min: 1, max: 2 });
      } },
      sum: '<b>비숍</b>은 <b>대각선</b>(X 모양)을 따라 원하는 만큼 가요. 가로·세로로는 못 가요.' },

    { id: 'bishop-block', title: '비숍 ② 길이 막히면', kind: 'one',
      screens: [
        { t: 'say', text: '비숍도 룩처럼 다른 말을 <b>넘어갈 수 없어요.</b> 대각선 위에 말이 있으면 그 앞에서 멈춰요.', board: { pos: B({ c1: 'B', f4: 'P' }), marks: J(M(['c1'], 'sel'), M(['f4'], 'ring')) } },
        { t: 'say', text: '내 편 말이 막으면 그 말 <b>바로 앞 칸까지만</b> 갈 수 있어요.', board: { pos: B({ c1: 'B', f4: 'P' }), marks: J(M(['c1'], 'sel'), M(['d2', 'e3'], 'dot'), M(['g5', 'h6'], 'x')) } },
        { t: 'say', text: '처음 배치에서 비숍이 바로 움직이지 못하는 까닭도 이것이에요. 앞의 폰들이 대각선 길을 막고 있거든요. 폰이 비켜 주면 비숍이 나올 수 있어요.', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', marks: J(M(['c1', 'f1'], 'sel'), M(['b2', 'd2', 'e2', 'g2'], 'ring')) } }
      ].concat([
        { t: 'ex', text: '폰이 비켜 주면 비숍의 길이 열려요.', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' },
          frames: [{ marks: J(M(['f1'], 'sel'), M(['e2', 'g2'], 'ring')), cap: 'f1의 비숍은 막혀 있어요.' }, { mv: ['e2', 'e4'], marks: { e4: 'hi' }, cap: 'e2의 폰이 앞으로 나가면,' }, { marks: J(M(['f1'], 'sel'), M(['e2', 'd3', 'c4', 'b5', 'a6'], 'dot')), cap: '비숍의 대각선 길이 열렸어요!' }, { mv: ['f1', 'c4'], marks: { c4: 'hi' }, cap: '비숍이 c4로 나왔어요.' }] },
        { t: 'ex', text: '여러 말이 막고 있을 때', board: { pos: B({ e5: 'B', c7: 'P', g3: 'N', g7: 'R' }) },
          frames: [{ marks: J(M(['e5'], 'sel'), M(['c7', 'g3', 'g7'], 'ring')), cap: '세 대각선에 내 편 말이 있어요.' }, { marks: J(M(['e5'], 'sel'), M(tg(B({ e5: 'B', c7: 'P', g3: 'N', g7: 'R' }), 'e5'), 'dot')), cap: '막는 말 앞까지, 막힘 없는 방향은 끝까지 → 모두 ' + tg(B({ e5: 'B', c7: 'P', g3: 'N', g7: 'R' }), 'e5').length + '칸.' }] },
        { t: 'do', task: clickQ('비숍이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', tg(B({ b2: 'B', e5: 'P', c1: 'N' }), 'b2'), { pos: B({ b2: 'B', e5: 'P', c1: 'N' }), marks: { b2: 'sel' } }, ['네 대각선을 하나씩 살펴요. 막는 말 앞에서 멈춰요.', { text: '이 칸들이에요.', marks: M(tg(B({ b2: 'B', e5: 'P', c1: 'N' }), 'b2'), 'soft') }], { all: true, why: whyFor(B({ b2: 'B', e5: 'P', c1: 'N' }), 'b2') }) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(3);
        if (k === 0) return oneQ(R, 'B', { blk: 2 });
        if (k === 1) return canQ(R, 'B', { blk: 2 });
        return starQ(R, 'B', { n: 1, blk: 3, min: 2, max: 3 });
      } },
      sum: '비숍도 다른 말을 <b>넘어갈 수 없어요.</b> 내 편 말이 막으면 그 바로 앞 칸까지만 가요.' },

    { id: 'bishop-color', title: '비숍 ③ 한 가지 색 칸만', kind: 'one',
      screens: [
        { t: 'say', text: '1마당에서 배운 것을 떠올려요. 대각선으로 이어진 칸은 <b>색이 모두 같아요.</b>', board: { pos: E, marks: M(['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'], 'row') } },
        { t: 'say', text: '그래서 비숍은 아무리 많이 움직여도 <b>처음 서 있던 색의 칸에만</b> 갈 수 있어요. 어두운 칸 비숍은 언제나 어두운 칸, 밝은 칸 비숍은 언제나 밝은 칸!', board: { pos: B({ c1: 'B', f1: 'B' }), marks: J(L('c1', '어두운'), L('f1', '밝은')) } },
        { t: 'say', text: '한 사람에게 비숍이 두 개 있어요. 하나는 밝은 칸, 하나는 어두운 칸을 맡아요. 둘이 힘을 합치면 판 전체를 다닐 수 있어요.', board: { pos: B({ c1: 'B', f1: 'B' }), marks: J(M(sqs(function (s) { return !light(s); }), 'soft')) } },
        { t: 'say', text: '그래서 비숍과 <b>색이 다른 칸</b>에 있는 별은 비숍이 절대로 모을 수 없어요.', board: { pos: B({ c1: 'B' }), marks: J(M(['c1'], 'sel'), M(['d1'], 'x')) } }
      ].concat([
        { t: 'ex', text: '비숍이 여러 번 움직여도 색이 그대로예요.', board: { pos: B({ c1: 'B' }) },
          frames: [{ marks: L('c1', '어두운'), cap: 'c1: 어두운 칸' }, { mv: ['c1', 'g5'], marks: L('g5', '어두운'), cap: 'g5: 어두운 칸' }, { mv: ['g5', 'e7'], marks: L('e7', '어두운'), cap: 'e7: 어두운 칸' }, { mv: ['e7', 'a3'], marks: L('a3', '어두운'), cap: 'a3: 또 어두운 칸! 비숍의 색은 바뀌지 않아요.' }] },
        { t: 'ex', text: '이 비숍이 갈 수 있는 칸은 모두 몇 칸일까요?(여러 번 움직여서)', board: { pos: B({ f1: 'B' }) },
          frames: [{ marks: M(['f1'], 'sel'), cap: 'f1은 밝은 칸이에요.' }, { marks: J(M(['f1'], 'sel'), M(sqs(light).filter(function (s) { return s !== 'f1'; }), 'dot')), cap: '여러 번 움직이면 밝은 칸 어디든 갈 수 있지만, 어두운 칸 32칸은 절대 못 가요.' }] },
        { t: 'do', task: pickQ('이 비숍이 여러 번 움직여서 별 칸에 갈 수 있을까요?', ['갈 수 있어요', '절대 갈 수 없어요'], '절대 갈 수 없어요', { pos: B({ c1: 'B' }), marks: J(M(['c1'], 'sel'), M(['e8'], 'star')) }, ['비숍이 있는 칸과 별 칸의 색을 견주어 봐요.', { text: '두 칸의 색이 같나요?', marks: M(['c1', 'e8'], 'ring') }]) },
        { t: 'do', task: clickQ('이 비숍이 <b>절대 갈 수 없는</b> 별을 눌러 보세요.', ['e4'], { pos: B({ c1: 'B' }), marks: J(M(['c1'], 'sel'), M(['h6', 'e4', 'a5'], 'star')) }, ['비숍은 처음 칸과 같은 색 칸에만 가요.', { text: '비숍은 어두운 칸에 있어요. 밝은 칸의 별은?', marks: M(['c1'], 'ring') }], { why: function (s) { return { text: '그 별은 비숍과 같은 색(어두운 칸)이라 언젠가 갈 수 있어요.', marks: M([s], 'bad') }; } }) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(3), s0 = R.sq(), t = R.pick(ALL.filter(function (s) { return s !== s0; })), same = light(s0) === light(t);
        if (k === 0) return pickQ('이 비숍이 <b>여러 번</b> 움직여서 별 칸에 갈 수 있을까요?', ['갈 수 있어요', '절대 갈 수 없어요'], same ? '갈 수 있어요' : '절대 갈 수 없어요', { pos: only('B', s0), marks: J(M([s0], 'sel'), M([t], 'star')) }, ['비숍 칸과 별 칸의 색을 견주어요.', { text: '두 칸의 색이 같나요?', marks: M([s0, t], 'ring') }]);
        if (k === 1) { var st = R.shuffle(ALL.filter(function (s) { return s !== s0 && light(s) !== light(s0); })).slice(0, 1).concat(R.shuffle(ALL.filter(function (s) { return s !== s0 && light(s) === light(s0); })).slice(0, 2));
          return clickQ('이 비숍이 <b>절대 갈 수 없는</b> 별을 눌러요.', [st[0]], { pos: only('B', s0), marks: J(M([s0], 'sel'), M(st, 'star')) }, ['비숍은 처음 칸과 같은 색 칸에만 가요.', { text: '비숍이 선 칸의 색을 봐요.', marks: M([s0], 'ring') }], { why: function (s) { return { text: '그 별은 비숍과 같은 색 칸이라 언젠가 갈 수 있어요.', marks: M([s], 'bad') }; } }); }
        return pickQ('비숍 칸이 ' + (light(s0) ? '밝은' : '어두운') + ' 칸이에요. 비숍이 여러 번 움직이면 어떤 칸에 갈 수 있을까요?', ['밝은 칸만', '어두운 칸만', '모든 칸'], light(s0) ? '밝은 칸만' : '어두운 칸만', { pos: only('B', s0), marks: M([s0], 'sel') }, ['대각선 칸은 색이 같아요.']);
      } },
      sum: '비숍은 언제나 <b>처음 칸과 같은 색 칸</b>에만 가요. 밝은 칸 비숍, 어두운 칸 비숍이 따로 있어요.' },

    { id: 'bishop-all', title: '비숍 ④ 갈 수 있는 칸 모두 찾기', kind: 'one',
      screens: [
        { t: 'say', text: '비숍이 갈 수 있는 칸을 모두 찾을 때도 <b>방향마다 차례로</b> 살펴요. 방향은 오른쪽 위·왼쪽 위·오른쪽 아래·왼쪽 아래 네 가지예요.', board: { pos: B({ d5: 'B' }), marks: M(['d5'], 'sel'), arrows: [['d5', 'g8'], ['d5', 'a8'], ['d5', 'h1'], ['d5', 'a2']] } },
        { t: 'say', text: '대각선은 길이가 서로 달라요. 판 끝에 닿으면 멈추고 다음 방향으로 가요. 빠뜨리기 쉬운 짧은 대각선을 꼭 살펴요!', board: { pos: B({ g2: 'B' }), marks: J(M(['g2'], 'sel'), M(['h1', 'h3', 'f1'], 'ring')) } }
      ].concat([
        { t: 'ex', text: '네 방향을 하나씩 살펴요.', board: { pos: B({ d5: 'B', f7: 'P', b3: 'N' }) },
          frames: [{ marks: J(M(['d5'], 'sel'), M(['e6'], 'dot')), cap: '① 오른쪽 위: e6 (f7에 폰)' }, { marks: J(M(['d5'], 'sel'), M(['e6', 'c6', 'b7', 'a8'], 'dot')), cap: '② 왼쪽 위: c6, b7, a8' }, { marks: J(M(['d5'], 'sel'), M(['e6', 'c6', 'b7', 'a8', 'e4', 'f3', 'g2', 'h1'], 'dot')), cap: '③ 오른쪽 아래: e4, f3, g2, h1' }, { marks: J(M(['d5'], 'sel'), M(tg(B({ d5: 'B', f7: 'P', b3: 'N' }), 'd5'), 'dot')), cap: '④ 왼쪽 아래: c4 (b3에 나이트) → 모두 9칸!' }] },
        { t: 'do', task: clickQ('비숍이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', tg(B({ f3: 'B', d5: 'P', h5: 'N' }), 'f3'), { pos: B({ f3: 'B', d5: 'P', h5: 'N' }), marks: { f3: 'sel' } }, ['네 대각선을 하나씩 살펴요.', { text: '이 칸들이에요.', marks: M(tg(B({ f3: 'B', d5: 'P', h5: 'N' }), 'f3'), 'soft') }], { all: true, why: whyFor(B({ f3: 'B', d5: 'P', h5: 'N' }), 'f3') }) }
      ]),
      practice: { n: 8, gen: function (R) {
        if (R.int(3) === 0) return countQ(R, 'B', { blk: R.int(3), h1: '네 대각선을 차례로 살피며 세어 봐요.' });
        return allQ(R, 'B', { blk: R.int(3) + 1, h1: '네 대각선을 하나씩 살펴요. 막는 말 앞에서 멈춰요.' });
      } },
      sum: '비숍이 갈 수 있는 칸은 <b>네 대각선</b>을 차례로 살피며 찾아요. 짧은 대각선을 빠뜨리지 않게!' },

    starLesson('B', 'bishop-stars', '비숍은 대각선으로만 가니까, 가로나 세로로 붙은 별은 <b>두 번</b> 움직여야 모을 수 있어요. 별은 모두 비숍과 같은 색 칸에 있어요.',
      { t: 'ex', text: '같은 세로줄의 별을 비숍으로 모아요.', board: { pos: B({ c1: 'B' }) },
        frames: [{ marks: M(['c5'], 'star'), cap: 'c1의 비숍, 별은 c5에 있어요. 한 번에는 못 가요.' }, { mv: ['c1', 'e3'], marks: M(['c5'], 'star'), cap: '① 오른쪽 위로 e3,' }, { mv: ['e3', 'c5'], marks: { c5: 'ok' }, cap: '② 왼쪽 위로 c5! 두 번 만에 모았어요.' }] },
      starFix('B', 'c1', ['c5', 'f8']),
      function (R) { return starQ(R, 'B', { n: R.int(2) + 2, blk: R.int(3), min: 2, max: 5, starAt: function (s, s0) { return light(s) === light(s0); } }); })
  ];

  /* ===== 6단원 퀸 ===== */
  var u6 = [
    { id: 'queen-lines', title: '퀸 ① 룩과 비숍을 합친 길', kind: 'easy',
      screens: [
        { t: 'say', text: '세 번째 말은 <b>퀸</b>이에요. 퀸은 체스에서 <b>가장 힘이 센</b> 말이에요.', big: ['Q', 'q'], board: { pos: B({ d4: 'Q' }), marks: M(['d4'], 'sel') } },
        { t: 'say', text: '퀸은 <b>룩처럼</b> 가로·세로로 갈 수 있어요.', board: { pos: B({ d4: 'Q' }), marks: J(M(['d4'], 'sel'), M(lines('d4', 'R'), 'dot')) } },
        { t: 'say', text: '그리고 <b>비숍처럼</b> 대각선으로도 갈 수 있어요.', board: { pos: B({ d4: 'Q' }), marks: J(M(['d4'], 'sel'), M(lines('d4', 'B'), 'dot')) } },
        { t: 'say', text: '합치면 <b>여덟 방향</b>! 별 모양(✳)으로 원하는 만큼 쭉 가요. 가운데에 있는 퀸은 무려 <b>27칸</b>으로 갈 수 있어요.', board: { pos: B({ d4: 'Q' }), marks: J(M(['d4'], 'sel'), M(lines('d4', 'Q'), 'dot')) } },
        { t: 'say', text: '하지만 퀸도 한 번에 <b>한 방향</b>으로만 가요. 줄을 벗어난 칸(나이트처럼 L자로 떨어진 칸)으로는 한 번에 못 가요.', board: { pos: B({ d4: 'Q' }), marks: J(M(['d4'], 'sel'), M(['e6', 'f5', 'c2', 'b5'], 'x')) } }
      ].concat([
        { t: 'ex', text: '퀸이 여러 방향으로 움직여요.', board: { pos: B({ d1: 'Q' }) },
          frames: [{ marks: J(M(['d1'], 'sel'), M(lines('d1', 'Q'), 'dot')), cap: 'd1의 퀸이 갈 수 있는 칸이에요.' }, { mv: ['d1', 'h5'], marks: { h5: 'hi' }, cap: '비숍처럼 대각선으로 h5!' }, { mv: ['h5', 'b5'], marks: { b5: 'hi' }, cap: '룩처럼 가로로 b5!' }, { mv: ['b5', 'b8'], marks: { b8: 'hi' }, cap: '세로로 b8!' }] },
        { t: 'ex', text: '룩·비숍·퀸이 같은 자리에서 갈 수 있는 칸을 견주어요.', board: { pos: B({ e4: 'R' }) },
          frames: [{ marks: J(M(['e4'], 'sel'), M(lines('e4', 'R'), 'dot')), cap: '룩: 14칸' }, { pos: B({ e4: 'B' }), marks: J(M(['e4'], 'sel'), M(lines('e4', 'B'), 'dot')), cap: '비숍: 13칸' }, { pos: B({ e4: 'Q' }), marks: J(M(['e4'], 'sel'), M(lines('e4', 'Q'), 'dot')), cap: '퀸: 14 + 13 = 27칸!' }] },
        { t: 'do', task: clickQ('퀸이 <b>대각선으로</b> 갈 수 있는 칸을 하나 눌러 보세요.', lines('c3', 'B'), { pos: B({ c3: 'Q' }), marks: { c3: 'sel' } }, ['비숍처럼 비스듬한 줄이에요.', { text: '이 칸들이에요.', marks: M(lines('c3', 'B'), 'soft') }], { why: function (s) { return lines('c3', 'R').indexOf(s) >= 0 ? { text: '퀸이 갈 수 있는 칸이지만, 그건 가로·세로 길이에요. 대각선 칸을 찾아요.', marks: M([s], 'bad') } : { text: SHAPE.Q, marks: M([s], 'bad') }; } }) },
        { t: 'do', task: starFix('Q', 'a1', ['h8', 'h1']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(5);
        if (k === 0) return oneQ(R, 'Q');
        if (k === 1) return canQ(R, 'Q');
        if (k === 2) return pickQ('퀸은 어떤 두 말의 움직임을 합친 것인가요?', R.shuffle(['룩과 비숍', '킹과 나이트', '룩과 나이트', '비숍과 폰']), '룩과 비숍', { pos: B({ d4: 'Q' }) }, ['가로·세로로 가는 말과 대각선으로 가는 말이에요.']);
        if (k === 3) return oneQ(R, 'Q', { q: '퀸이 <b>가로나 세로로</b> 갈 수 있는 칸을 하나 눌러요.', filter: function (a, s) { return a[0] === s[0] || a[1] === s[1]; } });
        return starQ(R, 'Q', { n: 2, min: 2, max: 2 });
      } },
      sum: '<b>퀸</b>은 룩 + 비숍! 가로·세로·대각선 <b>여덟 방향</b>으로 원하는 만큼 가요.' },

    { id: 'queen-block', title: '퀸 ② 길이 막히면', kind: 'one',
      screens: [
        { t: 'say', text: '퀸도 다른 말을 <b>넘어갈 수 없어요.</b> 여덟 방향 가운데 막힌 방향은 그 말 앞에서 멈춰요.', board: { pos: B({ d4: 'Q', d6: 'P', f2: 'N' }), marks: J(M(['d4'], 'sel'), M(['d6', 'f2'], 'ring')) } },
        { t: 'say', text: '막힌 방향만 짧아지고, 나머지 방향은 그대로 끝까지 갈 수 있어요.', board: { pos: B({ d4: 'Q', d6: 'P', f2: 'N' }), marks: J(M(['d4'], 'sel'), M(tg(B({ d4: 'Q', d6: 'P', f2: 'N' }), 'd4'), 'dot')) } },
        { t: 'say', text: '처음 배치에서 퀸은 사방이 내 편 말로 둘러싸여 있어서 한 칸도 못 움직여요. 폰이 길을 열어 주어야 나올 수 있어요.', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', marks: J(M(['d1'], 'sel'), M(['c1', 'e1', 'c2', 'd2', 'e2'], 'ring')) } }
      ].concat([
        { t: 'ex', text: '폰이 길을 열면 퀸이 나와요.', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' },
          frames: [{ marks: M(['d1'], 'sel'), cap: '퀸이 갇혀 있어요.' }, { mv: ['e2', 'e4'], marks: { e4: 'hi' }, cap: 'e2의 폰이 앞으로 가면,' }, { marks: J(M(['d1'], 'sel'), M(['e2', 'f3', 'g4', 'h5'], 'dot')), cap: '대각선 길이 열려요!' }, { mv: ['d1', 'h5'], marks: { h5: 'hi' }, cap: '퀸이 h5로 나왔어요.' }] },
        { t: 'do', task: clickQ('퀸이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', tg(B({ b2: 'Q', b5: 'P', e5: 'N', d2: 'B' }), 'b2'), { pos: B({ b2: 'Q', b5: 'P', e5: 'N', d2: 'B' }), marks: { b2: 'sel' } }, ['여덟 방향을 하나씩 살펴요. 막는 말 앞에서 멈춰요.', { text: '이 칸들이에요.', marks: M(tg(B({ b2: 'Q', b5: 'P', e5: 'N', d2: 'B' }), 'b2'), 'soft') }], { all: true, why: whyFor(B({ b2: 'Q', b5: 'P', e5: 'N', d2: 'B' }), 'b2') }) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(3);
        if (k === 0) return oneQ(R, 'Q', { blk: 3 });
        if (k === 1) return canQ(R, 'Q', { blk: 3 });
        return starQ(R, 'Q', { n: 1, blk: 4, min: 2, max: 3 });
      } },
      sum: '퀸도 다른 말을 넘어갈 수 없어요. <b>막힌 방향만</b> 짧아지고 나머지는 끝까지 가요.' },

    { id: 'queen-all', title: '퀸 ③ 갈 수 있는 칸 모두 찾기', kind: 'one',
      screens: [
        { t: 'say', text: '퀸은 방향이 <b>여덟 개</b>라서 빠뜨리기 쉬워요. 먼저 <b>룩 길</b>(위·아래·왼쪽·오른쪽), 다음에 <b>비숍 길</b>(네 대각선)을 살펴요.', board: { pos: B({ e5: 'Q' }), marks: M(['e5'], 'sel'), arrows: [['e5', 'e8'], ['e5', 'e1'], ['e5', 'a5'], ['e5', 'h5'], ['e5', 'h8'], ['e5', 'b8'], ['e5', 'h2'], ['e5', 'a1']] } },
        { t: 'say', text: '시계 방향으로 한 바퀴 돌며 살피는 방법도 좋아요: 위 → 오른쪽 위 → 오른쪽 → 오른쪽 아래 → 아래 → 왼쪽 아래 → 왼쪽 → 왼쪽 위.', board: { pos: B({ e5: 'Q' }), marks: J(M(['e5'], 'sel'), L('e6', '1'), L('f6', '2'), L('f5', '3'), L('f4', '4'), L('e4', '5'), L('d4', '6'), L('d5', '7'), L('d6', '8')) } }
      ].concat([
        { t: 'ex', text: '룩 길과 비숍 길을 차례로', board: { pos: B({ c4: 'Q', c7: 'P', f4: 'N', e6: 'B' }) },
          frames: [{ marks: J(M(['c4'], 'sel'), M(tg(B({ c4: 'Q', c7: 'P', f4: 'N', e6: 'B' }), 'c4').filter(function (s) { return s[0] === 'c' || s[1] === '4'; }), 'dot')), cap: '① 룩 길: 위·아래·왼쪽·오른쪽' }, { marks: J(M(['c4'], 'sel'), M(tg(B({ c4: 'Q', c7: 'P', f4: 'N', e6: 'B' }), 'c4'), 'dot')), cap: '② 비숍 길을 더하면 모두 ' + tg(B({ c4: 'Q', c7: 'P', f4: 'N', e6: 'B' }), 'c4').length + '칸!' }] },
        { t: 'do', task: clickQ('퀸이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', tg(B({ g6: 'Q', g3: 'P', d6: 'N', e8: 'B', f5: 'P' }), 'g6'), { pos: B({ g6: 'Q', g3: 'P', d6: 'N', e8: 'B', f5: 'P' }), marks: { g6: 'sel' } }, ['룩 길 네 방향, 비숍 길 네 방향을 차례로!', { text: '이 칸들이에요.', marks: M(tg(B({ g6: 'Q', g3: 'P', d6: 'N', e8: 'B', f5: 'P' }), 'g6'), 'soft') }], { all: true, why: whyFor(B({ g6: 'Q', g3: 'P', d6: 'N', e8: 'B', f5: 'P' }), 'g6') }) }
      ]),
      practice: { n: 8, gen: function (R) {
        if (R.int(3) === 0) return countQ(R, 'Q', { blk: R.int(3) + 2, h1: '룩 길과 비숍 길을 차례로 세어 봐요.' });
        return allQ(R, 'Q', { blk: R.int(3) + 2, h1: '룩 길 네 방향, 비숍 길 네 방향을 차례로 살펴요.' });
      } },
      sum: '퀸이 갈 수 있는 칸은 <b>룩 길 + 비숍 길</b>, 여덟 방향을 차례로 살펴 찾아요.' },

    starLesson('Q', 'queen-stars', '퀸은 여덟 방향으로 쭉 가니까 별을 아주 빨리 모을 수 있어요. 별 두 개가 한 줄에 있으면 이어서 모아요.',
      { t: 'ex', text: '퀸으로 별 세 개를 모아요.', board: { pos: B({ d1: 'Q' }) },
        frames: [{ marks: M(['h5', 'h8', 'a8'], 'star'), cap: '별은 h5·h8·a8에 있어요. 어느 별부터 모을까요?' }, { marks: M(['h5', 'h8', 'a8'], 'star'), arrows: [['d1', 'h5'], ['h5', 'h8'], ['h8', 'a8']], cap: '가까운 별부터 한 줄로 이어 보면: h5 → h8 → a8' }, { mv: ['d1', 'h5'], marks: M(['h8', 'a8'], 'star'), cap: '① 대각선으로 h5,' }, { mv: ['h5', 'h8'], marks: M(['a8'], 'star'), cap: '② 위로 h8,' }, { mv: ['h8', 'a8'], marks: { a8: 'ok' }, cap: '③ 왼쪽 끝까지 a8. 세 번 만에!' }] },
      starFix('Q', 'd1', ['d6', 'g6', 'b4']),
      function (R) { return starQ(R, 'Q', { n: R.int(2) + 3, blk: R.int(4), min: 3, max: 5 }); })
  ];

  /* ===== 7단원 킹 ===== */
  var ring8 = function (s) { var o = []; [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]].forEach(function (d) { var t = shift(s, d[0], d[1]); if (t) o.push(t); }); return o; };
  var u7 = [
    { id: 'king-one', title: '킹 ① 모든 방향으로 한 칸', kind: 'easy',
      screens: [
        { t: 'say', text: '네 번째 말은 <b>킹</b>이에요. 킹은 가장 <b>소중한</b> 말이에요. 킹을 잃으면 게임에서 져요(4마당에서 배워요).', big: ['K', 'k'], board: { pos: B({ e4: 'K' }), marks: M(['e4'], 'sel') } },
        { t: 'say', text: '킹은 퀸처럼 <b>여덟 방향</b>으로 갈 수 있어요. 하지만 <b>딱 한 칸만</b> 가요.', board: { pos: B({ e4: 'K' }), marks: J(M(['e4'], 'sel'), M(ring8('e4'), 'dot')) } },
        { t: 'say', text: '킹이 갈 수 있는 칸은 킹을 <b>빙 둘러싼 8칸</b>이에요. 킹을 가운데 두고 네모를 그리면 돼요.', board: { pos: B({ e4: 'K' }), marks: J(M(['e4'], 'sel'), M(ring8('e4'), 'row')) } },
        { t: 'say', text: '킹은 두 칸 이상 한 번에 갈 수 없어요. 천천히 한 걸음씩 걷는 임금님이라고 생각해요.', board: { pos: B({ e4: 'K' }), marks: J(M(['e4'], 'sel'), M(['e6', 'g4', 'c2'], 'x')) } }
      ].concat([
        { t: 'ex', text: '킹이 한 걸음씩 걸어요.', board: { pos: B({ d2: 'K' }) },
          frames: [{ marks: J(M(['d2'], 'sel'), M(ring8('d2'), 'dot')), cap: 'd2의 킹은 둘레 8칸으로 갈 수 있어요.' }, { mv: ['d2', 'e3'], marks: { e3: 'hi' }, cap: '대각선으로 한 칸,' }, { mv: ['e3', 'e4'], marks: { e4: 'hi' }, cap: '위로 한 칸,' }, { mv: ['e4', 'f5'], marks: { f5: 'hi' }, cap: '또 대각선으로 한 칸. 늘 한 칸씩!' }] },
        { t: 'ex', text: '멀리 있는 별까지 킹은 몇 번 걸어야 할까요?', board: { pos: B({ b2: 'K' }) },
          frames: [{ marks: M(['e5'], 'star'), cap: 'b2에서 e5까지' }, { mv: ['b2', 'c3'], marks: M(['e5'], 'star'), cap: '① 대각선으로 c3' }, { mv: ['c3', 'd4'], marks: M(['e5'], 'star'), cap: '② d4' }, { mv: ['d4', 'e5'], marks: { e5: 'ok' }, cap: '③ e5! 대각선을 이용하면 빨라요.' }] },
        { t: 'do', task: clickQ('킹이 갈 수 있는 칸을 하나 눌러 보세요.', ring8('f5'), { pos: B({ f5: 'K' }), marks: { f5: 'sel' } }, ['킹을 둘러싼 칸이에요.', { text: '이 8칸이에요.', marks: M(ring8('f5'), 'soft') }], { why: whyFor(B({ f5: 'K' }), 'f5') }) },
        { t: 'do', task: starFix('K', 'c3', ['e5']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(4);
        if (k === 0) return oneQ(R, 'K');
        if (k === 1) return canQ(R, 'K');
        if (k === 2) return pickQ('킹은 한 번에 몇 칸 갈 수 있나요?', ['1칸', '2칸', '원하는 만큼'], '1칸', { pos: B({ e4: 'K' }), marks: M(['e4'], 'sel') }, ['천천히 걷는 임금님이에요.']);
        return starQ(R, 'K', { n: 1, min: 2, max: 4 });
      } },
      sum: '<b>킹</b>은 여덟 방향 어느 쪽으로든 <b>딱 한 칸</b>만 가요. 둘레 8칸!' },

    { id: 'king-edge', title: '킹 ② 판 가장자리에서는', kind: 'easy',
      screens: [
        { t: 'say', text: '킹이 판 <b>가장자리</b>에 있으면 둘레의 칸 가운데 일부가 판 밖이에요. 판 밖으로는 갈 수 없지요.', board: { pos: B({ e1: 'K' }), marks: J(M(['e1'], 'sel'), M(ring8('e1'), 'dot')) } },
        { t: 'say', text: '가장자리(귀퉁이 말고)에 있는 킹은 <b>5칸</b>으로 갈 수 있어요.', board: { pos: B({ a5: 'K' }), marks: J(M(['a5'], 'sel'), M(ring8('a5'), 'dot')) } },
        { t: 'say', text: '<b>귀퉁이</b>에 있는 킹은 겨우 <b>3칸</b>! 가운데는 8칸, 가장자리는 5칸, 귀퉁이는 3칸이에요.', board: { pos: B({ h8: 'K' }), marks: J(M(['h8'], 'sel'), M(ring8('h8'), 'dot')) } },
        { t: 'say', text: '내 편 말이 둘레에 있으면 그 칸으로도 갈 수 없어요. 처음 배치에서 킹은 내 편 말에 둘러싸여 한 칸도 못 움직여요.', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', marks: J(M(['e1'], 'sel'), M(['d1', 'f1', 'd2', 'e2', 'f2'], 'ring')) } }
      ].concat([
        { t: 'ex', text: '킹이 가운데 → 가장자리 → 귀퉁이로 가면 갈 수 있는 칸이 줄어요.', board: { pos: B({ d4: 'K' }) },
          frames: [{ marks: J(M(['d4'], 'sel'), M(ring8('d4'), 'dot')), cap: '가운데: 8칸' }, { pos: B({ d1: 'K' }), marks: J(M(['d1'], 'sel'), M(ring8('d1'), 'dot')), cap: '가장자리: 5칸' }, { pos: B({ a1: 'K' }), marks: J(M(['a1'], 'sel'), M(ring8('a1'), 'dot')), cap: '귀퉁이: 3칸' }] },
        { t: 'do', task: clickQ('귀퉁이 킹이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', ring8('a8'), { pos: B({ a8: 'K' }), marks: { a8: 'sel' } }, ['킹 둘레에서 판 안에 있는 칸만!', { text: '이 칸들이에요.', marks: M(ring8('a8'), 'soft') }], { all: true, why: whyFor(B({ a8: 'K' }), 'a8') }) },
        { t: 'do', task: pickQ('가장자리 킹(귀퉁이 아님)이 갈 수 있는 칸은 몇 칸인가요?', ['3칸', '5칸', '8칸'], '5칸', { pos: B({ h4: 'K' }), marks: M(['h4'], 'sel') }, ['둘레 칸을 세어 봐요. 판 밖 칸은 빼요.', { text: '이 칸들이에요.', marks: M(ring8('h4'), 'dot') }]) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(3), s = R.pick(sqs(isEdge));
        if (k === 0) return pickQ('이 킹이 갈 수 있는 칸은 몇 칸인가요?', ['3칸', '5칸', '8칸'], ring8(s).length + '칸', { pos: only('K', s), marks: M([s], 'sel') }, ['가운데 8칸, 가장자리 5칸, 귀퉁이 3칸이에요.', { text: '갈 수 있는 칸에 점을 찍었어요.', marks: M(ring8(s), 'dot') }]);
        if (k === 1) return allQ(R, 'K', { at: isEdge, h1: '킹 둘레에서 판 안에 있는 칸만 찾아요.' });
        return allQ(R, 'K', { at: function (x) { return x[1] === '1' || x[1] === '2'; }, blk: 2, h1: '둘레 칸 가운데 내 편 말이 있는 칸은 빼요.' });
      } },
      sum: '킹이 갈 수 있는 칸: <b>가운데 8칸, 가장자리 5칸, 귀퉁이 3칸</b>. 내 편 말이 있는 칸은 못 가요.' },

    { id: 'king-all', title: '킹 ③ 갈 수 있는 칸 모두 찾기', kind: 'one',
      screens: [
        { t: 'say', text: '킹이 갈 수 있는 칸을 찾을 때는 킹 둘레의 <b>네모</b>를 한 바퀴 돌며 살펴요. 판 밖인 칸, 내 편 말이 있는 칸은 빼요.', board: { pos: B({ c2: 'K', b2: 'P', d3: 'N' }), marks: J(M(['c2'], 'sel'), M(ring8('c2'), 'soft')) } },
        { t: 'say', text: '알아 두기: 실제 게임에서는 킹이 <b>상대 말에게 공격받는 칸</b>으로도 갈 수 없어요. 이 규칙은 4마당 ‘체크’에서 배워요. 지금은 상대 말이 없는 판에서 연습해요.', board: { pos: B({ c2: 'K' }), marks: M(['c2'], 'sel') } }
      ].concat([
        { t: 'ex', text: '네모를 한 바퀴 돌며 살펴요.', board: { pos: B({ c2: 'K', b2: 'P', d3: 'N' }) },
          frames: [{ marks: J(M(['c2'], 'sel'), M(['b2', 'd3'], 'ring')), cap: 'b2의 폰, d3의 나이트는 내 편이에요.' }, { marks: J(M(['c2'], 'sel'), M(tg(B({ c2: 'K', b2: 'P', d3: 'N' }), 'c2'), 'dot'), M(['b2', 'd3'], 'x')), cap: '8칸에서 2칸을 빼면 6칸!' }] },
        { t: 'do', task: clickQ('킹이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', tg(B({ g1: 'K', f2: 'P', g2: 'P', h2: 'P' }), 'g1'), { pos: B({ g1: 'K', f2: 'P', g2: 'P', h2: 'P' }), marks: { g1: 'sel' } }, ['둘레 칸을 한 바퀴 돌며 살펴요.', { text: '이 칸들이에요.', marks: M(tg(B({ g1: 'K', f2: 'P', g2: 'P', h2: 'P' }), 'g1'), 'soft') }], { all: true, why: whyFor(B({ g1: 'K', f2: 'P', g2: 'P', h2: 'P' }), 'g1') }) }
      ]),
      practice: { n: 8, gen: function (R) {
        if (R.int(3) === 0) return countQ(R, 'K', { blk: R.int(3) + 1, h1: '둘레 네모를 한 바퀴 돌며 세어요.' });
        return allQ(R, 'K', { blk: R.int(3) + 1, h1: '둘레 네모를 한 바퀴 돌며 살펴요. 판 밖·내 편 말 칸은 빼요.' });
      } },
      sum: '킹이 갈 수 있는 칸은 <b>둘레 네모를 한 바퀴</b> 돌며 찾아요. 판 밖과 내 편 말 칸은 빼요.' },

    starLesson('K', 'king-stars', '킹은 한 칸씩 가니까 별을 모으려면 여러 번 걸어야 해요. <b>대각선 걸음</b>을 잘 쓰면 걸음 수가 줄어요.',
      { t: 'ex', text: '대각선 걸음으로 빨리 가요.', board: { pos: B({ a1: 'K' }) },
        frames: [{ marks: M(['d3', 'd5'], 'star'), cap: '별은 d3·d5에 있어요.' }, { mv: ['a1', 'b2'], marks: M(['d3', 'd5'], 'star'), cap: '① b2' }, { mv: ['b2', 'c2'], marks: M(['d3', 'd5'], 'star'), cap: '② c2 (c3로 갔다면? 그것도 3번이에요.)' }, { mv: ['c2', 'd3'], marks: M(['d5'], 'star'), cap: '③ d3, 별 하나!' }, { mv: ['d3', 'd4'], marks: M(['d5'], 'star'), cap: '④ d4' }, { mv: ['d4', 'd5'], marks: { d5: 'ok' }, cap: '⑤ d5. 다섯 걸음에 다 모았어요.' }] },
      starFix('K', 'a1', ['d3', 'd5']),
      function (R) { return starQ(R, 'K', { n: R.int(2) + 2, blk: R.int(3), min: 3, max: 7 }); })
  ];

  /* ===== 8단원 나이트 ===== */
  var JUMPS = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];
  function njumps(s) { var o = []; JUMPS.forEach(function (d) { var t = shift(s, d[0], d[1]); if (t) o.push(t); }); return o; }
  var u8 = [
    { id: 'knight-l', title: '나이트 ① L자로 뛰어요', kind: 'easy',
      screens: [
        { t: 'say', text: '다섯 번째 말은 <b>나이트</b>예요. 말 머리 모양이에요. 나이트는 다른 말과 아주 다르게 움직여요.', big: ['N', 'n'], board: { pos: B({ d4: 'N' }), marks: M(['d4'], 'sel') } },
        { t: 'say', text: '나이트는 <b>L자(ㄴ자) 모양</b>으로 뛰어요. 한 방향으로 <b>두 칸</b> 간 다음, 옆으로 <b>한 칸</b> 꺾어요.', board: { pos: B({ d4: 'N' }), marks: J(M(['d4'], 'sel'), M(['d5', 'd6'], 'soft'), M(['e6'], 'dot')), arrows: [['d4', 'd6'], ['d6', 'e6']] } },
        { t: 'say', text: '<b>두 칸 + 한 칸</b>이에요. 옆으로 두 칸 간 다음 위나 아래로 한 칸 꺾어도 돼요. 나이트는 꺾인 끝 칸에 <b>바로 내려앉아요.</b> 중간 칸에는 서지 않아요.', board: { pos: B({ d4: 'N' }), marks: J(M(['d4'], 'sel'), M(['e4', 'f4'], 'soft'), M(['f5'], 'dot')), arrows: [['d4', 'f4'], ['f4', 'f5']] } },
        { t: 'say', text: '외우는 말: <b>“하나, 둘, 꺾어!”</b> 나이트가 내려앉는 칸은 퀸이 한 번에 갈 수 없는 칸이에요. 줄에서 살짝 비껴 있어요.', board: { pos: B({ d4: 'N' }), marks: J(M(['d4'], 'sel'), M(njumps('d4'), 'dot')) } }
      ].concat([
        { t: 'ex', text: 'L자를 하나씩 그려 봐요.', board: { pos: B({ d4: 'N' }) },
          frames: [{ marks: M(['d4'], 'sel'), arrows: [['d4', 'd6'], ['d6', 'c6']], cap: '위로 둘, 왼쪽으로 꺾어 c6' }, { marks: M(['d4'], 'sel'), arrows: [['d4', 'd6'], ['d6', 'e6']], cap: '위로 둘, 오른쪽으로 꺾어 e6' }, { marks: M(['d4'], 'sel'), arrows: [['d4', 'f4'], ['f4', 'f5']], cap: '오른쪽으로 둘, 위로 꺾어 f5' }, { marks: M(['d4'], 'sel'), arrows: [['d4', 'f4'], ['f4', 'f3']], cap: '오른쪽으로 둘, 아래로 꺾어 f3' }, { marks: J(M(['d4'], 'sel'), M(njumps('d4'), 'dot')), cap: '이렇게 L자 끝을 모두 찾으면 8곳!' }] },
        { t: 'ex', text: '나이트가 뛰어다녀요.', board: { pos: B({ b1: 'N' }) },
          frames: [{ marks: J(M(['b1'], 'sel'), M(njumps('b1'), 'dot')), cap: 'b1의 나이트' }, { mv: ['b1', 'c3'], marks: { c3: 'hi' }, cap: '위로 둘, 오른쪽으로 하나 → c3' }, { mv: ['c3', 'e4'], marks: { e4: 'hi' }, cap: '오른쪽으로 둘, 위로 하나 → e4' }, { mv: ['e4', 'f6'], marks: { f6: 'hi' }, cap: '위로 둘, 오른쪽으로 하나 → f6' }] },
        { t: 'do', task: clickQ('나이트가 갈 수 있는 칸을 하나 눌러 보세요.', njumps('e4'), { pos: B({ e4: 'N' }), marks: { e4: 'sel' } }, ['“하나, 둘, 꺾어!” 두 칸 가고 한 칸 꺾어요.', { text: '반짝이는 칸 가운데 하나예요.', marks: M(njumps('e4').slice(0, 3), 'hint') }], { why: whyFor(B({ e4: 'N' }), 'e4') }) },
        { t: 'do', task: starFix('N', 'b1', ['c3']) },
        { t: 'do', task: starFix('N', 'g1', ['f3', 'g5']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(4);
        if (k === 0) return oneQ(R, 'N');
        if (k === 1) return canQ(R, 'N');
        if (k === 2) return pickQ('나이트는 어떤 모양으로 뛰나요?', R.shuffle(['L자(두 칸 + 한 칸)', '대각선', '가로·세로 쭉']), 'L자(두 칸 + 한 칸)', { pos: B({ d4: 'N' }), marks: M(['d4'], 'sel') }, ['“하나, 둘, 꺾어!”']);
        return starQ(R, 'N', { n: 1, min: 1, max: 2 });
      } },
      sum: '<b>나이트</b>는 <b>L자</b>로 뛰어요: 두 칸 가고 옆으로 한 칸 꺾어서 끝 칸에 내려앉아요. “하나, 둘, 꺾어!”' },

    { id: 'knight-8', title: '나이트 ② 갈 수 있는 곳은 최대 8곳', kind: 'one',
      screens: [
        { t: 'say', text: '판 가운데의 나이트는 <b>8곳</b>으로 뛸 수 있어요. 나이트를 가운데 두고 <b>동그라미</b>를 그리듯 놓여 있어요.', board: { pos: B({ e5: 'N' }), marks: J(M(['e5'], 'sel'), M(njumps('e5'), 'dot')) } },
        { t: 'say', text: '찾는 방법: 위로 둘(왼쪽·오른쪽 꺾기) → 오른쪽으로 둘(위·아래) → 아래로 둘(왼쪽·오른쪽) → 왼쪽으로 둘(위·아래). 네 방향 × 두 가지 = 8곳.', board: { pos: B({ e5: 'N' }), marks: J(M(['e5'], 'sel'), L('d7', '1'), L('f7', '2'), L('g6', '3'), L('g4', '4'), L('f3', '5'), L('d3', '6'), L('c4', '7'), L('c6', '8')) } },
        { t: 'say', text: '나이트가 가는 칸은 <b>바로 옆 칸도, 대각선 옆 칸도 아니에요.</b> 킹이 가는 둘레 8칸을 건너뛴 바깥 칸이에요.', board: { pos: B({ e5: 'N' }), marks: J(M(['e5'], 'sel'), M(ring8('e5'), 'x'), M(njumps('e5'), 'dot')) } }
      ].concat([
        { t: 'ex', text: '여덟 곳을 차례로 찾아요.', board: { pos: B({ d4: 'N' }) },
          frames: [['c6', 'e6'], ['f5', 'f3'], ['e2', 'c2'], ['b3', 'b5']].map(function (p, k, a) { var done = []; for (var j = 0; j <= k; j++) done = done.concat(a[j]); return { marks: J(M(['d4'], 'sel'), M(done, 'dot')), cap: ['위로 둘 → c6, e6', '오른쪽으로 둘 → f5, f3', '아래로 둘 → e2, c2', '왼쪽으로 둘 → b3, b5. 모두 8곳!'][k] }; }) },
        { t: 'do', task: clickQ('나이트가 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', njumps('d5'), { pos: B({ d5: 'N' }), marks: { d5: 'sel' } }, ['위·오른쪽·아래·왼쪽으로 두 칸씩 가서 꺾어 봐요.', { text: '이 칸들이에요.', marks: M(njumps('d5'), 'soft') }], { all: true, why: whyFor(B({ d5: 'N' }), 'd5') }) }
      ]),
      practice: { n: 8, gen: function (R) {
        if (R.int(3) === 0) return pickQ('판 가운데에 있는 나이트는 몇 곳으로 뛸 수 있나요?', ['4곳', '6곳', '8곳', '12곳'], '8곳', { pos: only('N', R.pick(['c3', 'd4', 'e5', 'f6', 'c6', 'f3', 'd5', 'e4'])) }, ['네 방향 × 두 가지예요.']);
        return allQ(R, 'N', { at: function (s) { return /[c-f][3-6]/.test(s); }, h1: '위·오른쪽·아래·왼쪽으로 두 칸 가서 양옆으로 꺾어요.' });
      } },
      sum: '판 가운데 나이트는 <b>8곳</b>으로 뛰어요. 네 방향으로 두 칸 가서 양옆으로 꺾어 찾아요.' },

    { id: 'knight-jump', title: '나이트 ③ 다른 말을 넘어가요', kind: 'one',
      screens: [
        { t: 'say', text: '나이트만 가진 특별한 힘! 나이트는 다른 말을 <b>뛰어넘을 수 있어요.</b> 길에 말이 있어도 상관없어요.', board: { pos: B({ b1: 'N', a2: 'P', b2: 'P', c2: 'P' }), marks: J(M(['b1'], 'sel'), M(['a3', 'c3'], 'dot')) } },
        { t: 'say', text: '나이트는 중간 칸을 지나가는 것이 아니라 <b>끝 칸에 바로 내려앉으니까</b>, 중간에 무엇이 있든 괜찮아요.', board: { pos: B({ d4: 'N', d5: 'P', e5: 'B', c5: 'R', e4: 'P', c4: 'P', d3: 'P', e3: 'P', c3: 'P' }), marks: J(M(['d4'], 'sel'), M(njumps('d4'), 'dot')) } },
        { t: 'say', text: '하지만 <b>내려앉을 칸</b>에 내 편 말이 있으면 갈 수 없어요. 꼭 확인할 곳은 끝 칸뿐이에요.', board: { pos: B({ d4: 'N', e6: 'P', b3: 'B' }), marks: J(M(['d4'], 'sel'), M(['e6', 'b3'], 'x'), M(tg(B({ d4: 'N', e6: 'P', b3: 'B' }), 'd4'), 'dot')) } },
        { t: 'say', text: '그래서 처음 배치에서 바로 움직일 수 있는 말은 <b>폰과 나이트</b>뿐이에요. 나이트는 폰 줄을 뛰어넘어 나와요.', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', marks: J(M(['b1', 'g1'], 'sel'), M(['a3', 'c3', 'f3', 'h3'], 'dot')) } }
      ].concat([
        { t: 'ex', text: '나이트가 폰 줄을 뛰어넘어요.', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' },
          frames: [{ marks: M(['g1'], 'sel'), cap: 'g1의 나이트 앞에 폰이 있어요.' }, { marks: J(M(['g1'], 'sel'), M(['f3', 'h3'], 'dot')), cap: '그래도 f3·h3으로 뛸 수 있어요!' }, { mv: ['g1', 'f3'], marks: { f3: 'hi' }, cap: '폰을 뛰어넘어 f3!' }, { mv: ['b1', 'c3'], marks: { c3: 'hi' }, cap: 'b1의 나이트도 c3으로!' }] },
        { t: 'do', task: clickQ('말들에 둘러싸인 나이트가 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', tg(B({ e4: 'N', e5: 'P', d5: 'P', f5: 'P', d4: 'B', f4: 'R', e3: 'P', d3: 'P', f3: 'P', g5: 'P' }), 'e4'), { pos: B({ e4: 'N', e5: 'P', d5: 'P', f5: 'P', d4: 'B', f4: 'R', e3: 'P', d3: 'P', f3: 'P', g5: 'P' }), marks: { e4: 'sel' } }, ['나이트는 뛰어넘어요. 끝 칸만 확인해요.', { text: '끝 칸에 말이 있는 곳은 빼요.', marks: M(['g5'], 'ring') }], { all: true, why: whyFor(B({ e4: 'N', e5: 'P', d5: 'P', f5: 'P', d4: 'B', f4: 'R', e3: 'P', d3: 'P', f3: 'P', g5: 'P' }), 'e4') }) },
        { t: 'do', task: pickQ('처음 배치에서 바로 움직일 수 있는 말은?', ['폰과 비숍', '룩과 나이트', '폰과 나이트', '퀸과 킹'], '폰과 나이트', { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' }, ['다른 말을 뛰어넘을 수 있는 말이 있어요.', '앞에 막는 것이 없는 말은?']) }
      ]),
      practice: { n: 8, gen: function (R) {
        if (R.int(3) === 0) return canQ(R, 'N', { blk: 4 });
        return allQ(R, 'N', { blk: R.int(4) + 3, at: function (s) { return /[b-g][2-7]/.test(s); }, h1: '나이트는 뛰어넘어요. 끝 칸에 내 편 말이 있는지만 확인해요.' });
      } },
      sum: '나이트는 다른 말을 <b>뛰어넘어요.</b> 내려앉을 <b>끝 칸</b>에 내 편 말만 없으면 돼요.' },

    { id: 'knight-edge', title: '나이트 ④ 가장자리에서는 줄어요', kind: 'one',
      screens: [
        { t: 'say', text: '나이트도 판 가장자리에 가면 갈 수 있는 곳이 줄어요. L자 끝이 판 밖으로 나가 버리거든요.', board: { pos: B({ a4: 'N' }), marks: J(M(['a4'], 'sel'), M(njumps('a4'), 'dot')) } },
        { t: 'say', text: '가운데 8곳, 가장자리 근처는 6곳이나 4곳, <b>귀퉁이는 겨우 2곳</b>이에요.', board: { pos: B({ a1: 'N' }), marks: J(M(['a1'], 'sel'), M(njumps('a1'), 'dot')) } },
        { t: 'say', text: '그래서 체스 선수들은 이렇게 말해요: <b>“가장자리의 나이트는 힘이 없다.”</b> 나이트는 가운데에 두는 것이 좋아요.', board: { pos: B({ h8: 'N', d5: 'N' }), marks: J(M(njumps('h8'), 'x'), M(njumps('d5'), 'dot')) } }
      ].concat([
        { t: 'ex', text: '나이트가 가장자리로 갈수록 뛸 곳이 줄어요.', board: { pos: B({ d4: 'N' }) },
          frames: [{ marks: J(M(['d4'], 'sel'), M(njumps('d4'), 'dot')), cap: 'd4: 8곳' }, { pos: B({ b4: 'N' }), marks: J(M(['b4'], 'sel'), M(njumps('b4'), 'dot')), cap: 'b4: 6곳' }, { pos: B({ a4: 'N' }), marks: J(M(['a4'], 'sel'), M(njumps('a4'), 'dot')), cap: 'a4: 4곳' }, { pos: B({ b1: 'N' }), marks: J(M(['b1'], 'sel'), M(njumps('b1'), 'dot')), cap: 'b1: 3곳' }, { pos: B({ a1: 'N' }), marks: J(M(['a1'], 'sel'), M(njumps('a1'), 'dot')), cap: 'a1: 2곳!' }] },
        { t: 'do', task: clickQ('귀퉁이 나이트가 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', njumps('h1'), { pos: B({ h1: 'N' }), marks: { h1: 'sel' } }, ['판 안쪽으로만 L자를 그려요.', { text: '이 칸들이에요.', marks: M(njumps('h1'), 'soft') }], { all: true, why: whyFor(B({ h1: 'N' }), 'h1') }) }
      ]),
      practice: { n: 8, gen: function (R) {
        var s = R.pick(sqs(function (x) { return /[abgh]/.test(x[0]) || /[1278]/.test(x[1]); })), n = njumps(s).length;
        if (R.int(2) === 0) return pickQ('이 나이트는 몇 곳으로 뛸 수 있나요?', R.opts(n + '곳', ['2곳', '3곳', '4곳', '6곳', '8곳']), n + '곳', { pos: only('N', s), marks: M([s], 'sel') }, ['판 안쪽으로 L자를 그려 세어요.', { text: '뛸 수 있는 곳에 점을 찍었어요.', marks: M(njumps(s), 'dot') }]);
        return allQ(R, 'N', { at: function (x) { return x === s; }, h1: '판 안쪽으로만 L자를 그려요.' });
      } },
      sum: '나이트는 가장자리로 갈수록 뛸 곳이 줄어요(가운데 8 → 귀퉁이 2). <b>나이트는 가운데로!</b>' },

    { id: 'knight-color', title: '나이트 ⑤ 칸 색이 바뀌어요', kind: 'one',
      screens: [
        { t: 'say', text: '나이트가 뛰면 <b>칸의 색이 언제나 바뀌어요.</b> 밝은 칸에서 뛰면 어두운 칸에, 어두운 칸에서 뛰면 밝은 칸에 내려앉아요.', board: { pos: B({ e4: 'N' }), marks: J(L('e4', '밝은'), M(njumps('e4'), 'dot')) } },
        { t: 'say', text: '비숍은 색이 절대 안 바뀌고, 나이트는 <b>뛸 때마다</b> 바뀌어요. 그래서 나이트는 두 번 뛰면 다시 처음과 같은 색이에요.', board: { pos: B({ e4: 'N' }), marks: J(L('e4', '밝'), L('f6', '어'), L('e8', '밝')) , arrows: [['e4', 'f6'], ['f6', 'e8']] } },
        { t: 'say', text: '이것으로 문제를 빨리 풀 수 있어요. 나이트와 <b>같은 색</b> 칸의 별은 한 번에는 절대 못 가요. 적어도 두 번 뛰어야 해요.', board: { pos: B({ e4: 'N' }), marks: J(M(['e4'], 'sel'), M(['e6'], 'star')) } }
      ].concat([
        { t: 'ex', text: '나이트가 뛸 때마다 색을 말해 봐요.', board: { pos: B({ b1: 'N' }) },
          frames: [{ marks: L('b1', '밝'), cap: 'b1: 밝은 칸' }, { mv: ['b1', 'c3'], marks: L('c3', '어'), cap: 'c3: 어두운 칸' }, { mv: ['c3', 'e4'], marks: L('e4', '밝'), cap: 'e4: 밝은 칸' }, { mv: ['e4', 'g5'], marks: L('g5', '어'), cap: 'g5: 어두운 칸. 번갈아 바뀌어요!' }] },
        { t: 'ex', text: '바로 옆 칸에 가려면 몇 번 뛰어야 할까요?', board: { pos: B({ d4: 'N' }) },
          frames: [{ marks: M(['e4'], 'star'), cap: 'd4 → e4. 바로 옆이지만 한 번에는 못 가요.' }, { mv: ['d4', 'f5'], marks: M(['e4'], 'star'), cap: '① f5' }, { mv: ['f5', 'd6'], marks: M(['e4'], 'star'), cap: '② d6' }, { mv: ['d6', 'e4'], marks: { e4: 'ok' }, cap: '③ e4! 바로 옆 칸은 세 번 뛰어야 해요.' }] },
        { t: 'do', task: pickQ('나이트가 한 번 뛰면 내려앉는 칸의 색은?', ['처음과 같은 색', '처음과 다른 색'], '처음과 다른 색', { pos: B({ c3: 'N' }), marks: J(M(['c3'], 'sel'), M(njumps('c3'), 'dot')) }, ['점이 찍힌 칸들의 색을 봐요.']) },
        { t: 'do', task: starFix('N', 'd4', ['e4']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(3), s0 = R.sq();
        if (k === 0) { var n = R.int(3) + 1; return pickQ('나이트가 ' + n + '번 뛰면 처음과 같은 색 칸일까요, 다른 색 칸일까요?', ['같은 색', '다른 색'], n % 2 ? '다른 색' : '같은 색', { pos: only('N', s0), marks: M([s0], 'sel') }, ['한 번 뛸 때마다 색이 바뀌어요.', '두 번 바뀌면 처음 색으로 돌아와요.']); }
        if (k === 1) { var st = R.shuffle(njumps(s0)).slice(0, 1).concat(R.shuffle(sqs(function (s) { return s !== s0 && light(s) === light(s0); })).slice(0, 2));
          return clickQ('나이트가 <b>한 번에</b> 갈 수 있는 별을 눌러요.', [st[0]], { pos: only('N', s0), marks: J(M([s0], 'sel'), M(st, 'star')) }, ['나이트와 같은 색 칸의 별은 한 번에 못 가요.', { text: '나이트 칸과 다른 색의 별을 봐요.', marks: M([s0], 'ring') }], { why: function (s) { return { text: '그 별은 나이트와 같은 색 칸이라 한 번에는 못 가요.', marks: M([s], 'bad') }; } }); }
        return starQ(R, 'N', { n: 1, min: 2, max: 3, starAt: function (s, a) { return light(s) === light(a); } });
      } },
      sum: '나이트는 뛸 때마다 <b>칸 색이 바뀌어요.</b> 같은 색 칸은 한 번에 못 가고, 짝수 번 뛰어야 해요.' },

    starLesson('N', 'knight-stars', '나이트 별 모으기는 머리를 많이 써야 해요. 별에서 <b>거꾸로</b> 생각해 보세요: “이 별에 내려앉으려면 어느 칸에서 뛰어야 할까?”',
      { t: 'ex', text: '멀리 있는 별에 나이트로 가요.', board: { pos: B({ a1: 'N' }) },
        frames: [{ marks: M(['d4'], 'star'), cap: 'a1에서 d4까지' }, { marks: J(M(['d4'], 'star'), M(njumps('d4'), 'ring')), cap: 'd4에 내려앉으려면 동그라미 칸 가운데 하나에서 뛰어야 해요.' }, { mv: ['a1', 'b3'], marks: J(M(['d4'], 'star'), M(['b3'], 'hi')), cap: '① b3: 동그라미 칸이에요!' }, { mv: ['b3', 'd4'], marks: { d4: 'ok' }, cap: '② d4! 두 번 만에 도착했어요.' }] },
      starFix('N', 'a1', ['d4', 'f5']),
      function (R) { return starQ(R, 'N', { n: R.int(2) + 1, blk: R.int(3), min: 2, max: 5 }); })
  ];

  /* ===== 9단원 폰 ===== */
  function pFwd(s, w) { return shift(s, 0, w ? 1 : -1); }
  /* 폰 전쟁: 폰만으로 겨룸. 끝 줄에 먼저 닿거나, 상대 폰을 모두 잡거나, 상대가 움직일 수 없으면 이김 */
  var PW = (function () {
    function moves(p) {
      var out = [], b = p.b, w = p.turn === 'w', me = w ? 'P' : 'p', foe = w ? 'p' : 'P', dr = w ? -1 : 1;
      for (var i = 0; i < 64; i++) {
        if (b[i] !== me) continue; var r = i >> 3, f = i & 7, one = i + dr * 8; if (one < 0 || one > 63) continue;
        if (b[one] === '.') { out.push({ from: i, to: one }); var two = one + dr * 8; if ((w ? r === 6 : r === 1) && b[two] === '.') out.push({ from: i, to: two }); }
        if (f > 0 && b[one - 1] === foe) out.push({ from: i, to: one - 1, cap: 1 });
        if (f < 7 && b[one + 1] === foe) out.push({ from: i, to: one + 1, cap: 1 });
      }
      return out;
    }
    function play(p, m) { var b = p.b.slice(); b[m.to] = b[m.from]; b[m.from] = '.'; return { b: b, turn: p.turn === 'w' ? 'b' : 'w' }; }
    function result(p) {
      var b = p.b, w = 0, k = 0, i;
      for (i = 0; i < 8; i++) if (b[i] === 'P') return 'w';
      for (i = 56; i < 64; i++) if (b[i] === 'p') return 'b';
      for (i = 0; i < 64; i++) { if (b[i] === 'P') w++; else if (b[i] === 'p') k++; }
      if (!k) return 'w'; if (!w) return 'b';
      if (!moves(p).length) return p.turn === 'w' ? 'b' : 'w';
      return '';
    }
    function evalW(b) {
      var s = 0;
      for (var i = 0; i < 64; i++) {
        var c = b[i]; if (c === '.') continue; var r = i >> 3, f = i & 7, w = c === 'P', adv = w ? 6 - r : r - 1, free = true;
        for (var rr = w ? r - 1 : r + 1; w ? rr >= 0 : rr < 8; rr += w ? -1 : 1) for (var ff = Math.max(0, f - 1); ff <= Math.min(7, f + 1); ff++) if (b[rr * 8 + ff] === (w ? 'p' : 'P')) free = false;
        var v = 100 + adv * adv * 4 + (free ? adv * 20 + 10 : 0);
        s += w ? v : -v;
      }
      return s;
    }
    function nega(p, d, a, bt, ply) {
      var r = result(p); if (r) return (r === p.turn ? 1 : -1) * (100000 - ply);
      if (!d) { var e = evalW(p.b); return p.turn === 'w' ? e : -e; }
      var ms = moves(p).sort(function (x, y) { return (y.cap || 0) - (x.cap || 0); }), best = -Infinity;
      for (var k = 0; k < ms.length; k++) { var v = -nega(play(p, ms[k]), d - 1, -bt, -a, ply + 1); if (v > best) best = v; if (v > a) a = v; if (a >= bt) break; }
      return best;
    }
    /* 단계 1: 한 수 앞 + 자주 실수, 2: 두 수 앞 + 가끔 실수, 3: 네 수 앞, 9(힌트): 여섯 수 앞 */
    function ai(p, lv) {
      var ms = moves(p); if (!ms.length) return null;
      var depth = { 1: 1, 2: 2, 3: 4 }[lv] || 6, err = { 1: .4, 2: .15 }[lv] || 0;
      for (var k = 0; k < ms.length; k++) if (result(play(p, ms[k])) === p.turn) return ms[k];
      if (Math.random() < err) return ms[Math.floor(Math.random() * ms.length)];
      var best = -Infinity, pick = [];
      ms.forEach(function (m) { var v = -nega(play(p, m), depth - 1, -Infinity, Infinity, 1); if (v > best + 1e-9) { best = v; pick = [m]; } else if (Math.abs(v - best) < 1e-9) pick.push(m); });
      return pick[Math.floor(Math.random() * pick.length)];
    }
    return { moves: moves, play: play, result: result, ai: ai };
  })();
  function warPos(n) { var fs = { 4: 'cdef', 6: 'bcdefg', 8: 'abcdefgh' }[n], o = {}; fs.split('').forEach(function (f) { o[f + '2'] = 'P'; o[f + '7'] = 'p'; }); return B(o); }
  function warTask(n, lv) {
    return { type: 'game', kind: 'deep', q: '🤖 폰 전쟁(폰 ' + n + '개씩, ' + lv + '단계)! 내 폰을 끝 줄(8번 가로줄)에 먼저 보내면 이겨요. 움직일 폰을 누르고, 갈 칸을 눌러요.',
      board: { pos: warPos(n) }, game: PW, level: lv, winText: '폰 전쟁에서 이겼어요! 🎉',
      loseTip: '상대 폰이 끝 줄에 닿으면 져요. 앞으로 오는 상대 폰을 대각선으로 잡을 수 있는지 살펴봐요.',
      hint: ['상대 폰이 내 폰 대각선 앞에 오면 잡을 수 있어요.', '상대 폰에게 잡히지 않는 길로 폰을 보내요. 상대 폰이 없는 줄이 좋아요.'] };
  }
  var u9 = [
    { id: 'pawn-step', title: '폰 ① 앞으로 한 칸', kind: 'easy',
      screens: [
        { t: 'say', text: '마지막 말은 <b>폰</b>이에요. 폰은 가장 작고 수가 많은 말이에요. 한 사람에게 8개씩 있어요.', big: ['P', 'p'], board: { pos: B({ e3: 'P' }), marks: M(['e3'], 'sel') } },
        { t: 'say', text: '폰은 <b>앞으로 한 칸</b>씩 가요. 바로 앞 칸이에요.', board: { pos: B({ e3: 'P' }), marks: J(M(['e3'], 'sel'), M(['e4'], 'dot')) } },
        { t: 'say', text: '‘앞’은 편마다 달라요. <b>백 폰</b>은 위쪽(8번 가로줄 쪽)으로, <b>흑 폰</b>은 아래쪽(1번 가로줄 쪽)으로 가요. 상대 쪽으로 나아가는 거예요.', board: { pos: B({ c3: 'P', f6: 'p' }), marks: J(M(['c4', 'f5'], 'dot')), arrows: [['c3', 'c4'], ['f6', 'f5']] } },
        { t: 'say', text: '폰은 <b>옆으로도 못 가요.</b> 오직 앞으로 똑바로! 세로줄을 따라 한 칸씩 나아가요.', board: { pos: B({ d4: 'P' }), marks: J(M(['d4'], 'sel'), M(['d5'], 'dot'), M(['c4', 'e4'], 'x')) } }
      ].concat([
        { t: 'ex', text: '백 폰과 흑 폰이 앞으로 나아가요.', board: { pos: B({ c3: 'P', f6: 'p' }) },
          frames: [{ mv: ['c3', 'c4'], marks: { c4: 'hi' }, cap: '백 폰: c3 → c4 (위로)' }, { mv: ['f6', 'f5'], marks: { f5: 'hi' }, cap: '흑 폰: f6 → f5 (아래로)' }, { mv: ['c4', 'c5'], marks: { c5: 'hi' }, cap: '백 폰: c4 → c5' }, { mv: ['f5', 'f4'], marks: { f4: 'hi' }, cap: '흑 폰: f5 → f4. 서로 상대 쪽으로 가요.' }] },
        { t: 'do', task: clickQ('백 폰이 갈 수 있는 칸을 눌러 보세요.', ['b5'], { pos: B({ b4: 'P' }), marks: { b4: 'sel' } }, ['백 폰은 위로 한 칸 가요.', { text: '이 칸이에요.', marks: { b5: 'hint' } }], { why: whyFor(B({ b4: 'P' }), 'b4') }) },
        { t: 'do', task: clickQ('<b>흑</b> 폰이 갈 수 있는 칸을 눌러 보세요.', ['g4'], { pos: B({ g5: 'p' }), marks: { g5: 'sel' } }, ['흑 폰은 아래로 가요.', { text: '이 칸이에요.', marks: { g4: 'hint' } }], { why: function (s) { return { text: '흑 폰은 아래쪽(1번 가로줄 쪽)으로 한 칸 가요.', marks: M([s], 'bad') }; } }) },
        { t: 'do', task: starFix('P', 'd3', ['d6']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var w = R.int(2) === 1, s = R.pick(sqs(function (x) { return /[3-6]/.test(x[1]); })), t = pFwd(s, w), c = w ? 'P' : 'p';
        if (R.int(3) === 0) return pickQ((w ? '백' : '흑') + ' 폰은 어느 쪽으로 가나요?', ['위쪽(8번 가로줄 쪽)', '아래쪽(1번 가로줄 쪽)', '옆쪽'], w ? '위쪽(8번 가로줄 쪽)' : '아래쪽(1번 가로줄 쪽)', { pos: only(c, s), marks: M([s], 'sel') }, ['폰은 상대 쪽으로 나아가요. 백은 아래에서 시작해요.']);
        return clickQ((w ? '백' : '<b>흑</b>') + ' 폰이 갈 수 있는 칸을 눌러요.', [t], { pos: only(c, s), marks: M([s], 'sel') }, [(w ? '백 폰은 위로' : '흑 폰은 아래로') + ' 한 칸 가요.', { text: '이 칸이에요.', marks: M([t], 'hint') }], { why: function (x) { return { text: (w ? '백 폰은 위쪽' : '흑 폰은 아래쪽') + '으로 바로 앞 한 칸만 가요.', marks: M([x], 'bad') }; } });
      } },
      sum: '<b>폰</b>은 <b>앞으로 한 칸</b>씩 가요. 백 폰은 위로, 흑 폰은 아래로. 옆으로는 못 가요.' },

    { id: 'pawn-back', title: '폰 ② 뒤로는 못 가요', kind: 'easy',
      screens: [
        { t: 'say', text: '폰은 다른 말과 달리 <b>뒤로 갈 수 없어요.</b> 한 번 앞으로 나가면 다시 돌아올 수 없어요.', board: { pos: B({ e4: 'P' }), marks: J(M(['e4'], 'sel'), M(['e3'], 'x'), M(['e5'], 'dot')) } },
        { t: 'say', text: '그래서 폰을 움직일 때는 <b>잘 생각해야</b> 해요. 앞으로 나간 폰이 뒤에 생긴 빈자리를 다시 막아 줄 수 없거든요.', board: { pos: B({ e4: 'P' }), marks: M(['e4'], 'sel'), arrows: [['e4', 'e5']] } },
        { t: 'say', text: '폰이 할 수 있는 것과 못 하는 것을 정리해요. 앞으로 ⭕, 옆으로 ❌, 뒤로 ❌, (잡을 때가 아니면) 대각선 ❌.', board: { pos: B({ d4: 'P' }), marks: J(M(['d4'], 'sel'), M(['d5'], 'ok'), M(['c4', 'e4', 'd3', 'c5', 'e5', 'c3', 'e3'], 'x')) } }
      ].concat([
        { t: 'ex', text: '다른 말과 견주어 봐요.', board: { pos: B({ d4: 'R' }) },
          frames: [{ mv: ['d4', 'd6'], marks: { d6: 'hi' }, cap: '룩은 위로 갔다가,' }, { mv: ['d6', 'd4'], marks: { d4: 'hi' }, cap: '다시 돌아올 수 있어요.' }, { pos: B({ d4: 'P' }), marks: M(['d4'], 'sel'), cap: '폰은?' }, { mv: ['d4', 'd5'], marks: J(M(['d5'], 'hi'), M(['d4'], 'x')), cap: '앞으로 가면 다시는 돌아올 수 없어요!' }] },
        { t: 'do', task: pickQ('폰이 e5에서 e4로 (아래로) 돌아갈 수 있을까요? (백 폰)', ['돌아갈 수 있어요', '돌아갈 수 없어요'], '돌아갈 수 없어요', { pos: B({ e5: 'P' }), marks: J(M(['e5'], 'sel'), M(['e4'], 'star')) }, ['폰은 앞으로만 가요.']) },
        { t: 'do', task: clickQ('폰이 갈 수 <b>없는</b> 칸 가운데 하나를 눌러 보세요(별 칸 중에서).', ['c3', 'b4', 'd4'], { pos: B({ c4: 'P' }), marks: J(M(['c4'], 'sel'), M(['c5', 'c3', 'b4', 'd4'], 'star')) }, ['폰은 앞으로 한 칸만 가요.', { text: '앞 칸은 갈 수 있는 칸이에요.', marks: M(['c5'], 'ring') }], { why: function () { return { text: 'c5는 폰 바로 앞 칸이라 갈 수 있어요.', marks: M(['c5'], 'ok') }; } }) }
      ]),
      practice: { n: 8, gen: function (R) {
        var w = R.int(2) === 1, c = w ? 'P' : 'p', s = R.pick(sqs(function (x) { return /[b-g][3-6]/.test(x); })), fwd = pFwd(s, w), others = ring8(s).filter(function (x) { return x !== fwd; }), pickS = R.shuffle(others).slice(0, 3).concat([fwd]);
        if (R.int(2) === 0) { var t = R.pick(pickS); return pickQ((w ? '백' : '흑') + ' 폰이 별 칸으로 갈 수 있을까요?', ['갈 수 있어요', '갈 수 없어요'], t === fwd ? '갈 수 있어요' : '갈 수 없어요', { pos: only(c, s), marks: J(M([s], 'sel'), M([t], 'star')) }, ['폰은 앞으로 한 칸만 가요.', (w ? '백 폰의 앞은 위쪽' : '흑 폰의 앞은 아래쪽') + '이에요.']); }
        return clickQ((w ? '백' : '흑') + ' 폰이 갈 수 있는 별을 눌러요.', [fwd], { pos: only(c, s), marks: J(M([s], 'sel'), M(R.shuffle(pickS), 'star')) }, ['폰은 앞으로 한 칸만 가요.', (w ? '백 폰의 앞은 위쪽' : '흑 폰의 앞은 아래쪽') + '이에요.'], { why: function (x) { return { text: '폰은 옆이나 뒤로 못 가요. ' + (w ? '위쪽' : '아래쪽') + ' 바로 앞 칸이에요.', marks: M([x], 'bad') }; } });
      } },
      sum: '폰은 <b>뒤로도, 옆으로도 못 가요.</b> 한 번 나가면 돌아올 수 없으니 잘 생각하고 움직여요.' },

    { id: 'pawn-two', title: '폰 ③ 처음엔 두 칸까지', kind: 'easy',
      screens: [
        { t: 'say', text: '폰이 <b>처음 자리</b>(백은 2번 가로줄, 흑은 7번 가로줄)에 있을 때는 특별히 <b>두 칸</b>까지 갈 수 있어요.', board: { pos: B({ e2: 'P' }), marks: J(M(['e2'], 'sel'), M(['e3', 'e4'], 'dot')) } },
        { t: 'say', text: '한 칸을 갈지 두 칸을 갈지는 내가 정해요. 두 칸을 갈 때는 한 번에 가요(두 번 움직이는 게 아니에요).', board: { pos: B({ e2: 'P' }), marks: M(['e2'], 'sel'), arrows: [['e2', 'e4']] } },
        { t: 'say', text: '한 번이라도 움직인 폰은 이제 처음 자리가 아니니까 <b>한 칸씩만</b> 가요.', board: { pos: B({ e3: 'P' }), marks: J(M(['e3'], 'sel'), M(['e4'], 'dot'), M(['e5'], 'x')) } },
        { t: 'say', text: '흑 폰도 똑같아요. 7번 가로줄에 있을 때는 아래로 한 칸이나 두 칸!', board: { pos: B({ d7: 'p' }), marks: J(M(['d7'], 'sel'), M(['d6', 'd5'], 'dot')) } }
      ].concat([
        { t: 'ex', text: '처음 자리의 폰과 움직인 폰', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' },
          frames: [{ mv: ['e2', 'e4'], marks: { e4: 'hi' }, cap: '백 e2 → e4: 처음이라 두 칸!' }, { mv: ['e7', 'e5'], marks: { e5: 'hi' }, cap: '흑 e7 → e5: 흑도 두 칸!' }, { mv: ['d2', 'd3'], marks: { d3: 'hi' }, cap: '백 d2 → d3: 한 칸만 가도 돼요.' }, { marks: J(M(['d3'], 'sel'), M(['d4'], 'dot'), M(['d5'], 'x')), cap: 'd3의 폰은 이제 한 칸씩만 가요.' }] },
        { t: 'do', task: clickQ('처음 자리의 폰이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', ['g3', 'g4'], { pos: B({ g2: 'P' }), marks: { g2: 'sel' } }, ['처음 자리에서는 두 칸까지!', { text: '이 칸들이에요.', marks: M(['g3', 'g4'], 'soft') }], { all: true, why: whyFor(B({ g2: 'P' }), 'g2') }) },
        { t: 'do', task: clickQ('<b>흑</b> 폰이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요.', ['b6', 'b5'], { pos: B({ b7: 'p' }), marks: { b7: 'sel' } }, ['흑 폰은 아래로, 처음 자리(7번 가로줄)라 두 칸까지.', { text: '이 칸들이에요.', marks: M(['b6', 'b5'], 'soft') }], { all: true, why: function (s) { return { text: '흑 폰은 아래로 한 칸이나 두 칸 가요.', marks: M([s], 'bad') }; } }) }
      ]),
      practice: { n: 8, gen: function (R) {
        var w = R.int(2) === 1, c = w ? 'P' : 'p', home = R.int(2) === 1, f = F[R.int(8)], s = f + (w ? (home ? 2 : R.int(4) + 3) : (home ? 7 : R.int(4) + 3)), b = only(c, s), ans = tg(b, s);
        if (R.int(3) === 0) return pickQ('이 ' + (w ? '백' : '흑') + ' 폰은 몇 칸까지 갈 수 있나요?', ['1칸', '2칸까지'], ans.length === 2 ? '2칸까지' : '1칸', { pos: b, marks: M([s], 'sel') }, ['처음 자리(백 2번, 흑 7번 가로줄)에 있나요?']);
        return clickQ((w ? '백' : '<b>흑</b>') + ' 폰이 갈 수 있는 칸을 <b>모두</b> 눌러요.', ans, { pos: b, marks: M([s], 'sel') }, ['처음 자리(백 2번, 흑 7번 가로줄)면 두 칸까지, 아니면 한 칸.', { text: '이 칸들이에요.', marks: M(ans, 'soft') }], { all: true, why: function (x) { return { text: ans.length === 2 ? '처음 자리의 폰은 앞으로 한 칸이나 두 칸 가요.' : '이 폰은 처음 자리가 아니라서 앞으로 한 칸만 가요.', marks: M([x], 'bad') }; } });
      } },
      sum: '폰이 <b>처음 자리</b>(백 2번, 흑 7번 가로줄)에 있으면 <b>두 칸까지</b> 갈 수 있어요. 그다음부터는 한 칸씩.' },

    { id: 'pawn-block', title: '폰 ④ 앞이 막히면', kind: 'one',
      screens: [
        { t: 'say', text: '폰 바로 앞 칸에 <b>어떤 말이든</b> 있으면 폰은 앞으로 갈 수 없어요. 내 편 말이든 <b>상대 말이든</b> 마찬가지예요.', board: { pos: B({ e4: 'P', e5: 'p' }), marks: J(M(['e4'], 'sel'), M(['e5'], 'ring')) } },
        { t: 'say', text: '다른 말들은 앞에 있는 상대 말을 잡을 수 있지만, <b>폰은 앞의 말을 잡을 수 없어요.</b> 폰끼리 마주 보면 둘 다 꼼짝 못 해요.', board: { pos: B({ d4: 'P', d5: 'p' }), marks: M(['d4', 'd5'], 'x') } },
        { t: 'say', text: '처음 자리에서 두 칸을 가려고 할 때도, 가는 길(한 칸 앞)이 막혀 있으면 두 칸도 못 가요. 폰은 다른 말을 넘을 수 없어요.', board: { pos: B({ c2: 'P', c3: 'N' }), marks: J(M(['c2'], 'sel'), M(['c3'], 'ring'), M(['c4'], 'x')) } },
        { t: 'say', text: '두 칸 앞만 막혀 있으면 한 칸은 갈 수 있어요.', board: { pos: B({ f2: 'P', f4: 'p' }), marks: J(M(['f2'], 'sel'), M(['f3'], 'dot'), M(['f4'], 'ring')) } }
      ].concat([
        { t: 'ex', text: '마주 본 폰들', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR' },
          frames: [{ mv: ['e2', 'e4'], marks: { e4: 'hi' }, cap: '백 e4' }, { mv: ['e7', 'e5'], marks: { e5: 'hi' }, cap: '흑 e5' }, { marks: M(['e4', 'e5'], 'x'), cap: '두 폰이 마주 봤어요. 이제 둘 다 앞으로 못 가요!' }] },
        { t: 'do', task: clickQ('앞으로 <b>갈 수 있는</b> 백 폰을 눌러 보세요.', ['c3'], { pos: B({ a3: 'P', a4: 'p', c3: 'P', e3: 'P', e4: 'N', g3: 'P', g4: 'p' }) }, ['폰 바로 앞 칸이 비어 있어야 해요.', { text: '앞 칸이 빈 폰은?', marks: M(['c4'], 'ring') }], { why: function (s) { return { text: '그 폰은 바로 앞 칸이 막혀 있어요. 폰은 앞의 말을 잡거나 넘을 수 없어요.', marks: J(M([s], 'bad'), M([pFwd(s, true)], 'ring')) }; } }) },
        { t: 'do', task: pickQ('이 폰은 몇 칸 갈 수 있나요?', ['0칸(못 가요)', '1칸', '2칸'], '0칸(못 가요)', { pos: B({ h2: 'P', h3: 'p' }), marks: M(['h2'], 'sel') }, ['바로 앞 칸을 봐요.']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(3);
        if (k === 0) { var files = R.shuffle('abcdefgh'.split('')).slice(0, 4), o = {}, ok = [];
          files.forEach(function (f, j) { var r = R.int(4) + 2, s = f + r; o[s] = 'P'; if (j === 0 || R.int(2)) o[f + (r + 1)] = R.pick(['p', 'P', 'n', 'N', 'b']); else ok.push(s); });
          var bd = B(o); ok = ok.filter(function (s) { return pcAt(bd, pFwd(s, true)) === '.'; });
          if (!ok.length) return this.gen(R);
          return clickQ('앞으로 <b>갈 수 있는</b> 백 폰을 모두 눌러요.', ok, { pos: bd }, ['폰 바로 앞 칸이 비어 있어야 해요.', '앞 칸에 말이 있으면 내 편이든 상대든 못 가요.'], { all: true, why: function (s) { var c = pcAt(bd, s); return c === 'P' ? { text: '그 폰은 바로 앞 칸이 막혀 있어요.', marks: J(M([s], 'bad'), M([pFwd(s, true)], 'ring')) } : { text: '백 폰(흰 폰)을 눌러요.', marks: M([s], 'bad') }; } }); }
        var f2 = F[R.int(8)], home = R.int(2) === 1, s2 = f2 + (home ? 2 : R.int(4) + 3), o2 = {}; o2[s2] = 'P';
        var blk = R.int(3); if (blk === 1) o2[f2 + (+s2[1] + 1)] = R.pick(['p', 'N', 'n']); else if (blk === 2 && home) o2[f2 + 4] = R.pick(['p', 'N']);
        var b2 = B(o2), n = tg(b2, s2).length;
        return pickQ('이 백 폰은 앞으로 몇 칸 갈 수 있나요?(가장 멀리)', ['0칸(못 가요)', '1칸', '2칸'], n === 0 ? '0칸(못 가요)' : n + '칸', { pos: b2, marks: M([s2], 'sel') }, ['바로 앞 칸이 비어 있나요?', '처음 자리(2번 가로줄)인가요? 두 칸 앞도 비었나요?']);
      } },
      sum: '폰 바로 앞에 <b>어떤 말이든</b> 있으면 폰은 못 가요. 폰은 앞의 말을 <b>잡지도, 넘지도</b> 못해요.' },

    { id: 'pawn-cap', title: '폰 ⑤ 대각선으로 잡아요', kind: 'one',
      screens: [
        { t: 'say', text: '폰이 상대 말을 <b>잡을 때</b>는 움직임이 달라져요. 폰은 <b>대각선 앞 한 칸</b>에 있는 상대 말을 잡아요.', board: { pos: B({ d4: 'P', e5: 'n' }), marks: J(M(['d4'], 'sel'), M(['e5'], 'ring')) } },
        { t: 'say', text: '‘잡는다’는 것은 상대 말이 있는 칸으로 가서 그 말을 판 밖으로 내보내는 거예요. 잡은 폰은 그 칸에 서요.', board: { pos: B({ e5: 'P' }), marks: M(['e5'], 'hi') } },
        { t: 'say', text: '폰은 <b>가는 길</b>(앞으로 똑바로)과 <b>잡는 길</b>(대각선 앞)이 달라요. 이것이 폰만의 특별한 점이에요.', board: { pos: B({ d4: 'P', c5: 'p', e5: 'b' }), marks: J(M(['d4'], 'sel'), M(['d5', 'c5', 'e5'], 'dot')) } },
        { t: 'say', text: '대각선 앞이 <b>비어 있거나</b> <b>내 편 말</b>이 있으면 대각선으로 갈 수 없어요. 상대 말이 있을 때만이에요. 그리고 대각선 <b>뒤</b>로는 절대 못 잡아요.', board: { pos: B({ d4: 'P', c5: 'N', c3: 'p' }), marks: J(M(['d4'], 'sel'), M(['c5', 'e5', 'c3'], 'x'), M(['d5'], 'dot')) } }
      ].concat([
        { t: 'ex', text: '폰이 상대 말을 잡아요.', board: { pos: B({ d4: 'P', e5: 'n', c6: 'p' }) },
          frames: [{ marks: J(M(['d4'], 'sel'), M(['e5'], 'ring')), cap: 'e5에 흑 나이트가 있어요.' }, { mv: ['d4', 'e5'], marks: { e5: 'hi' }, cap: '폰이 대각선으로 잡았어요!' }, { marks: J(M(['e5'], 'sel'), M(['e6'], 'dot')), cap: '이제 이 폰은 e파일에서 앞으로 가요. c6의 흑 폰은 너무 멀어서 못 잡아요.' }] },
        { t: 'ex', text: '흑 폰은 아래쪽 대각선으로 잡아요.', board: { pos: B({ f5: 'p', g4: 'R', e4: 'P' }) },
          frames: [{ marks: J(M(['f5'], 'sel'), M(['g4', 'e4'], 'ring')), cap: '흑 폰의 대각선 앞(아래)에 백 룩과 백 폰이 있어요.' }, { mv: ['f5', 'g4'], marks: { g4: 'hi' }, cap: '흑 폰이 룩을 잡았어요!' }] },
        { t: 'do', task: clickQ('폰이 갈 수 있는 칸을 <b>모두</b> 눌러 보세요(잡는 칸도).', ['d5', 'e5'], { pos: B({ d4: 'P', e5: 'r', c5: 'P' }), marks: { d4: 'sel' } }, ['앞으로 한 칸, 그리고 대각선 앞의 <b>상대</b> 말.', { text: '이 칸들이에요.', marks: M(['d5', 'e5'], 'soft') }], { all: true, why: whyFor(B({ d4: 'P', e5: 'r', c5: 'P' }), 'd4') }) },
        { t: 'do', task: starFix('P', 'c3', ['d4'], { d4: 'p' }, '폰으로 별 칸의 흑 폰을 잡아 보세요.') }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(3);
        var s = R.pick(sqs(function (x) { return /[a-h][3-6]/.test(x); })), o = {}; o[s] = 'P';
        [shift(s, -1, 1), shift(s, 1, 1), shift(s, 0, 1), shift(s, -1, -1), shift(s, 1, -1)].forEach(function (t) { if (t && R.int(2)) o[t] = R.pick(['p', 'n', 'b', 'r', 'P', 'N']); });
        var b = B(o), ans = tg(b, s);
        if (!ans.length) return this.gen(R);
        if (k === 0) return pickQ('폰은 상대 말을 어떻게 잡나요?', R.shuffle(['대각선 앞 한 칸', '바로 앞 한 칸', '바로 옆 한 칸']), '대각선 앞 한 칸', { pos: b, marks: M([s], 'sel') }, ['가는 길과 잡는 길이 달라요.']);
        return clickQ('폰이 갈 수 있는 칸을 <b>모두</b> 눌러요(잡는 칸도).', ans, { pos: b, marks: M([s], 'sel') }, ['앞 칸이 비었으면 앞으로, 대각선 앞에 <b>상대</b> 말이 있으면 잡기.', { text: '이 칸들을 살펴요.', marks: M([shift(s, -1, 1), shift(s, 1, 1), shift(s, 0, 1)].filter(Boolean), 'soft') }], { all: true, why: whyFor(b, s) });
      } },
      sum: '폰은 <b>앞으로 가고, 대각선 앞으로 잡아요.</b> 대각선 앞에 상대 말이 있을 때만 대각선으로 가요.' },

    { id: 'pawn-war', title: '폰 ⑥ 폰 전쟁', kind: 'deep',
      screens: [
        { t: 'say', text: '폰만 가지고 <b>인공지능과 겨루는 놀이</b>, <b>폰 전쟁</b>을 해요! 지금까지 배운 폰의 움직임을 모두 써요.', board: { pos: warPos(8) } },
        { t: 'say', text: '규칙 ① 나는 백(아래), 인공지능은 흑(위)이에요. 한 번씩 번갈아 폰 하나를 움직여요. 내가 먼저 해요.', board: { pos: warPos(8), marks: M(rank(2), 'soft') } },
        { t: 'say', text: '규칙 ② 폰은 배운 대로: 앞으로 한 칸(처음엔 두 칸까지), 잡을 때는 대각선 앞 한 칸.', board: { pos: B({ d4: 'P', e5: 'p' }), marks: J(M(['d4'], 'sel'), M(['d5', 'e5'], 'dot')) } },
        { t: 'say', text: '규칙 ③ <b>이기는 방법</b>: 내 폰 하나가 상대 쪽 끝 줄(8번 가로줄)에 닿거나, 상대 폰을 모두 잡거나, 상대가 움직일 폰이 하나도 없게 만들면 이겨요.', board: { pos: B({ c7: 'P' }), marks: M(rank(8), 'row'), arrows: [['c7', 'c8']] } },
        { t: 'say', text: '작전 하나: 상대 폰이 <b>없는 줄</b>로 폰을 보내면 막는 폰이 없어서 끝까지 갈 수 있어요. 작전 둘: 상대 폰이 내 폰의 대각선 앞에 오면 <b>잡을 기회</b>예요. 대신 내 폰도 상대 폰의 대각선 앞에 서면 잡혀요!', board: { pos: B({ d4: 'P', e5: 'p', g4: 'P' }), marks: J(M(['e5'], 'ring'), M(['g5', 'g6', 'g7', 'g8'], 'soft')) } }
      ].concat([
        { t: 'ex', text: '폰 전쟁의 한 장면을 봐요.', board: { pos: warPos(4) },
          frames: [{ mv: ['d2', 'd4'], marks: { d4: 'hi' }, cap: '백: d4 (두 칸)' }, { mv: ['e7', 'e5'], marks: { e5: 'hi' }, cap: '흑: e5 — 백 d4의 대각선 앞에 왔어요!' }, { mv: ['d4', 'e5'], marks: { e5: 'hi' }, cap: '백: d4가 e5를 잡아요.' }, { mv: ['d7', 'd6'], marks: { d6: 'hi' }, cap: '흑: d6 — 이번엔 흑 폰이 e5를 노려요.' }, { mv: ['e5', 'd6'], marks: { d6: 'hi' }, cap: '백: e5가 d6을 잡았어요! 백 폰이 7번 가로줄 바로 앞까지 왔어요.' }, { mv: ['c7', 'd6'], marks: { d6: 'bad' }, cap: '흑: c7이 d6을 다시 잡아요. 서로 잡고 잡히니 잘 살펴야 해요.' }] },
        { t: 'do', task: warTask(4, 1) }
      ]),
      practice: { n: 6, gen: function (R) {
        var k = R.int(3);
        if (k === 0) return warTask(R.pick([4, 6]), R.pick([1, 1, 2]));
        if (k === 1) { var s = R.pick(sqs(function (x) { return /[a-h][3-5]/.test(x); })), o = {}; o[s] = 'P';
          var foes = [shift(s, -1, 1), shift(s, 1, 1)].filter(Boolean); foes.forEach(function (t) { if (R.int(2)) o[t] = 'p'; }); if (R.int(2)) o[shift(s, 0, 1)] = 'p';
          var b = B(o), ans = tg(b, s); if (!ans.length) return this.gen(R);
          return clickQ('폰 전쟁 중이에요. 이 폰이 갈 수 있는 칸을 <b>모두</b> 눌러요.', ans, { pos: b, marks: M([s], 'sel') }, ['앞 칸이 비었으면 앞으로, 대각선 앞의 흑 폰은 잡을 수 있어요.', { text: '이 칸들을 살펴요.', marks: M([shift(s, -1, 1), shift(s, 1, 1), shift(s, 0, 1)].filter(Boolean), 'soft') }], { all: true, kind: 'one', why: whyFor(b, s) }); }
        /* 잡을 수 있는 폰 찾기 */
        for (var t = 0; t < 200; t++) {
          var b3 = CH.board(E), ws = R.shuffle(sqs(function (x) { return /[3-5]/.test(x[1]); })).slice(0, 4), bs;
          ws.forEach(function (x) { b3[CH.idx(x)] = 'P'; });
          bs = R.shuffle(sqs(function (x) { return /[4-7]/.test(x[1]) && pcAt(b3, x) === '.'; })).slice(0, 4); bs.forEach(function (x) { b3[CH.idx(x)] = 'p'; });
          var can = ws.filter(function (x) { return tg(b3, x).some(function (y) { return pcAt(b3, y) === 'p'; }); });
          if (!can.length || can.length > 2) continue;
          return clickQ('폰 전쟁 중이에요. 흑 폰을 <b>잡을 수 있는</b> 백 폰을 <b>모두</b> 눌러요.', can, { pos: b3 }, ['백 폰의 대각선 앞(위쪽 대각선) 칸에 흑 폰이 있나요?', { text: '잡을 수 있는 폰 하나가 반짝여요.', marks: M([can[0]], 'hint') }],
            { all: true, kind: 'one', why: function (x) { var c = pcAt(b3, x); return c === 'P' ? { text: '그 폰의 대각선 앞에는 흑 폰이 없어요. 폰은 앞의 말은 잡지 못해요.', marks: J(M([x], 'bad'), M([shift(x, -1, 1), shift(x, 1, 1)].filter(Boolean), 'ring')) } : { text: '백 폰(흰 폰)을 눌러요.', marks: M([x], 'bad') }; } });
        }
        return warTask(4, 1);
      } },
      sum: '<b>폰 전쟁</b>: 끝 줄에 먼저! 상대 폰이 없는 줄로 가고, 대각선 앞의 상대 폰은 잡고, 내 폰이 잡히지 않게 조심해요.' },

    { id: 'pawn-stars', title: '폰 ⑦ 별 모으기', kind: 'deep',
      screens: [
        { t: 'say', text: '폰으로 <b>별 모으기</b>를 해요. 폰은 앞으로만 가니까, 길을 잘못 고르면 별을 놓칠 수 있어요!', board: { pos: B({ d2: 'P', e5: 'p' }), marks: M(['d4', 'e5'], 'star') } },
        { t: 'say', text: '어떤 별은 흑 말 위에 있어요. 그 별은 폰이 <b>대각선으로 잡으면서</b> 모아요.', board: { pos: B({ d4: 'P', e5: 'p' }), marks: J(M(['d4'], 'sel'), M(['e5'], 'star')) } },
        { t: 'say', text: '별을 더는 모을 수 없게 되면 <b>🔄 처음부터</b> 단추를 눌러 다시 해요. 처음 자리의 폰은 두 칸까지 갈 수 있다는 것도 잊지 마요.', board: { pos: B({ d2: 'P' }), marks: J(M(['d2'], 'sel'), M(['d3', 'd4'], 'dot')) } }
      ].concat([
        { t: 'ex', text: '별 세 개를 모아요.', board: { pos: B({ c2: 'P', d4: 'p' }) },
          frames: [{ marks: M(['c3', 'd4', 'd6'], 'star'), cap: '별은 c3, d4(흑 폰 위), d6에 있어요.' }, { marks: J(M(['c3', 'd4', 'd6'], 'star'), M(['c4'], 'x')), cap: '처음이라 두 칸(c4)도 갈 수 있지만, 그러면 c3 별을 지나쳐서 다시는 못 모아요!' }, { mv: ['c2', 'c3'], marks: M(['d4', 'd6'], 'star'), cap: '① 한 칸만 가서 c3 별!' }, { mv: ['c3', 'd4'], marks: M(['d6'], 'star'), cap: '② 대각선으로 흑 폰을 잡으며 d4 별!' }, { mv: ['d4', 'd5'], marks: M(['d6'], 'star'), cap: '③ d5,' }, { mv: ['d5', 'd6'], marks: { d6: 'ok' }, cap: '④ d6 별! 네 번 만에 다 모았어요.' }] },
        { t: 'do', task: starFix('P', 'e2', ['e3', 'f4'], { f4: 'n' }) }
      ]),
      practice: { n: 6, gen: function (R) {
        for (var t = 0; t < 200; t++) {
          var f = F[R.int(6) + 1], s0 = f + 2, b = only('P', s0), path = [s0], cur = s0, stars = [], n = R.int(2) + 2;
          for (var k = 0; k < 5; k++) { var opts = [shift(cur, 0, 1)]; if (k === 0) opts.push(shift(cur, 0, 2)); [-1, 1].forEach(function (d) { var x = shift(cur, d, 1); if (x) opts.push(x); }); opts = opts.filter(function (x) { return x && +x[1] <= 7; }); if (!opts.length) break; var nx = R.pick(opts); path.push(nx); cur = nx; }
          path.slice(1).forEach(function (x) { if (stars.length < n && R.int(2) && stars.indexOf(x) < 0) stars.push(x); });
          if (stars.length < 2) continue;
          var bb = b.slice(); stars.forEach(function (x, j) { var prev = path[path.indexOf(x) - 1]; if (prev[0] !== x[0]) bb[CH.idx(x)] = R.pick(['p', 'n', 'b']); });
          for (var j = 1; j < path.length; j++) { if (path[j][0] === path[j - 1][0] && pcAt(bb, path[j]) !== '.') bb = null; if (!bb) break; }
          if (!bb) continue;
          var sv = solver(bb, s0, stars); if (sv.par === Infinity) continue;
          return { type: 'move', kind: 'deep', capture: true, q: '폰을 움직여서 별 ' + stars.length + '개를 모두 모아요. 흑 말 위의 별은 대각선으로 잡으며 모아요.', board: { pos: bb }, mover: s0, stars: stars, par: sv.par, next: sv.next,
            hint: ['폰은 앞으로 가고, 대각선 앞의 흑 말은 잡을 수 있어요.', '폰은 뒤로 못 가요. 어느 별을 먼저 모아야 다음 별에 갈 수 있을지 길을 미리 그려 봐요.'] };
        }
        return starFix('P', 'e2', ['e3', 'f4'], { f4: 'n' });
      } },
      sum: '폰 별 모으기는 <b>길을 미리 그려요.</b> 폰은 뒤로 못 가니까 차례가 중요해요. 처음엔 두 칸, 잡을 땐 대각선!' }
  ];

  /* ===== 10단원 움직임 복습 ===== */
  var KINDS = ['R', 'B', 'Q', 'K', 'N'];
  function reachers(b, star) { return sqs(function (s) { return pcAt(b, s) !== '.' && tg(b, s).indexOf(star) >= 0; }); }
  var u10 = [
    { id: 'who-reach', title: '복습 ① 이 칸에 갈 수 있는 말은?', kind: 'one',
      screens: [
        { t: 'say', text: '이제 모든 말의 움직임을 배웠어요! 판 위에 여러 말이 있을 때 <b>어느 말이 별 칸에 갈 수 있는지</b> 찾아봐요.', board: { pos: B({ b2: 'R', f1: 'B', g6: 'N', d7: 'K', e4: 'P' }), marks: M(['b6'], 'star') } },
        { t: 'say', text: '말마다 하나씩 따져요. 룩은 같은 가로줄·세로줄? 비숍은 같은 대각선? 퀸은 둘 중 하나? 킹은 바로 옆? 나이트는 L자? 폰은 바로 앞?', board: { pos: B({ b2: 'R', f1: 'B', g6: 'N', d7: 'K', e4: 'P' }), marks: M(['b6'], 'star') } },
        { t: 'say', text: '줄 위에 다른 말이 막고 있는지도 꼭 확인해요. 나이트만 막혀도 괜찮아요.', board: { pos: B({ b2: 'R', b4: 'P', f1: 'B', g6: 'N', d7: 'K', e4: 'P' }), marks: J(M(['b6'], 'star'), M(['b4'], 'ring')) } }
      ].concat([
        { t: 'ex', text: '하나씩 따져 봐요.', board: { pos: B({ b2: 'R', f1: 'B', g6: 'N', d7: 'K', e4: 'P' }) },
          frames: [{ marks: J(M(['b6'], 'star'), M(['b2'], 'ok')), arrows: [['b2', 'b6']], cap: '룩 b2: 같은 세로줄 → 갈 수 있어요.' }, { marks: J(M(['b6'], 'star'), M(['f1'], 'x')), cap: '비숍 f1: 대각선이 아니에요(f1은 밝은 칸, b6은 어두운 칸).' }, { marks: J(M(['b6'], 'star'), M(['g6'], 'x')), cap: '나이트 g6: 너무 멀어요.' }, { marks: J(M(['b6'], 'star'), M(['d7'], 'x')), cap: '킹 d7: 두 칸 떨어져서 못 가요.' }, { marks: J(M(['b6'], 'star'), M(['b2'], 'ok'), M(['e4'], 'x')), cap: '폰 e4: 앞으로 한 칸뿐 → 정답은 룩 하나!' }] },
        { t: 'do', task: clickQ('별 칸으로 <b>한 번에</b> 갈 수 있는 말을 <b>모두</b> 눌러 보세요.', reachers(B({ d1: 'Q', c3: 'N', a5: 'R', h2: 'B', h5: 'K' }), 'd5'), { pos: B({ d1: 'Q', c3: 'N', a5: 'R', h2: 'B', h5: 'K' }), marks: M(['d5'], 'star') }, ['말마다 하나씩 따져요.', { text: '별로 가는 줄을 그려 봐요.', marks: M(['d5'], 'ring') }], { all: true, why: function (s) { return { text: '그 말은 별 칸으로 한 번에 갈 수 없어요.', marks: M([s], 'bad') }; } }) }
      ]),
      practice: { n: 8, gen: function (R) {
        for (var t = 0; t < 300; t++) {
          var list = R.shuffle(KINDS).slice(0, 4).concat(R.int(2) ? ['P'] : []), b = R.scatter(list), star = R.pick(sqs(function (s) { return pcAt(b, s) === '.'; }));
          var who = reachers(b, star);
          if (!who.length || who.length > 3) continue;
          return clickQ('별 칸으로 <b>한 번에</b> 갈 수 있는 말을 <b>모두</b> 눌러요.', who, { pos: b, marks: M([star], 'star') }, ['말마다 하나씩: 줄이 맞나? 막혔나? 나이트는 L자, 킹은 한 칸, 폰은 앞으로.', { text: '갈 수 있는 말 하나가 반짝여요.', marks: M([who[0]], 'hint') }],
            { all: true, why: function (s) { var c = pcAt(b, s); return c === '.' ? { text: '말이 있는 칸을 눌러요.', marks: M([s], 'bad') } : { text: jo(nm(c), '은') + ' 별 칸으로 한 번에 갈 수 없어요. ' + SHAPE[c], marks: M([s], 'bad') }; } });
        }
      } },
      sum: '여러 말이 있을 때는 <b>말마다 하나씩</b> 따져요: 움직이는 모양이 맞나? 가는 길이 막혔나?' },

    { id: 'fastest', title: '복습 ② 가장 빠른 길', kind: 'deep',
      screens: [
        { t: 'say', text: '말마다 같은 칸에 가는 데 걸리는 횟수가 달라요. <b>가장 적은 횟수</b>로 가는 길을 찾아봐요.', board: { pos: B({ a1: 'R' }), marks: M(['h8'], 'star') } },
        { t: 'say', text: '룩은 어디든 <b>두 번</b>이면 가요(가로 한 번 + 세로 한 번). 퀸은 한 번이나 두 번. 비숍은 같은 색 칸이면 한 번이나 두 번.', board: { pos: B({ a1: 'R' }), marks: M(['h8'], 'star'), arrows: [['a1', 'a8'], ['a8', 'h8']] } },
        { t: 'say', text: '킹과 나이트는 여러 번 걸려요. 킹은 대각선을 잘 쓰고, 나이트는 별에서 <b>거꾸로</b> 생각하면 길이 보여요.', board: { pos: B({ a1: 'N' }), marks: M(['h8'], 'star') } }
      ].concat([
        { t: 'ex', text: '나이트가 a1에서 h8까지!', board: { pos: B({ a1: 'N' }) },
          frames: [{ marks: M(['h8'], 'star'), cap: '귀퉁이에서 반대쪽 귀퉁이까지는 몇 번일까요?' }, { mv: ['a1', 'b3'], marks: M(['h8'], 'star'), cap: '① b3' }, { mv: ['b3', 'c5'], marks: M(['h8'], 'star'), cap: '② c5' }, { mv: ['c5', 'd7'], marks: M(['h8'], 'star'), cap: '③ d7' }, { mv: ['d7', 'f6'], marks: M(['h8'], 'star'), cap: '④ f6' }, { mv: ['f6', 'h7'], marks: M(['h8'], 'star'), cap: '⑤ h7… 아직 아니에요!' }, { pos: B({ a1: 'N' }), marks: M(['h8'], 'star'), cap: '사실 a1 → h8은 나이트로 가장 적게 6번이에요. 직접 해 봐요!' }] },
        { t: 'do', task: starFix('N', 'a1', ['h8']) },
        { t: 'do', task: pickQ('룩이 별 칸까지 가장 적게 몇 번 만에 갈 수 있나요?', ['1번', '2번', '3번'], '2번', { pos: B({ b2: 'R' }), marks: J(M(['b2'], 'sel'), M(['g7'], 'star')) }, ['룩과 별이 같은 줄에 있나요?', '가로로 한 번, 세로로 한 번.']) }
      ]),
      practice: { n: 6, gen: function (R) {
        var c = R.pick(KINDS);
        if (R.int(3) === 0) { var q = starQ(R, c, { n: 1, blk: c === 'N' || c === 'K' ? 0 : R.int(3), min: 1, max: 4 }), pool = ['1번', '2번', '3번', '4번', '5번'];
          return pickQ(jo(nm(c), '이') + ' 별 칸까지 가장 적게 몇 번 만에 갈 수 있나요?', R.opts(q.par + '번', pool), q.par + '번', { pos: q.board.pos, marks: J(M([q.mover], 'sel'), M(q.stars, 'star')) }, [SHAPE[c], '직접 손가락으로 길을 따라가 보며 세어요.'], { kind: 'deep' }); }
        var T = starQ(R, c, { n: 1, blk: R.int(3), min: 2, max: 5 }); T.q = jo(nm(c), '을') + ' 움직여서 별까지 가장 빠르게 가요. 가장 적게 <b>' + T.par + '번</b>이에요.'; return T;
      } },
      sum: '같은 칸이라도 말마다 걸리는 횟수가 달라요. 룩은 어디든 <b>두 번</b>, 나이트는 <b>거꾸로</b> 생각하기!' },

    { id: 'guess', title: '복습 ③ 움직임 보고 말 맞히기', kind: 'one',
      screens: [
        { t: 'say', text: '판 위의 <b>점</b>은 숨은 말 하나가 갈 수 있는 칸이에요. 점 모양을 보고 어떤 말인지 맞혀 봐요.', board: { pos: E, marks: J(M(['d4'], 'ring'), M(lines('d4', 'R'), 'dot')) } },
        { t: 'say', text: '십자(+) 모양이면 룩, X 모양이면 비숍, 별(✳) 모양이면 퀸, 둘레 한 칸이면 킹, 동그랗게 떨어진 8곳이면 나이트, 앞 한두 칸이면 폰!', board: { pos: E, marks: J(M(['d4'], 'ring'), M(njumps('d4'), 'dot')) } }
      ].concat([
        { t: 'ex', text: '점 모양을 견주어 봐요.', board: { pos: E },
          frames: [{ marks: J(M(['e4'], 'ring'), M(lines('e4', 'R'), 'dot')), cap: '+ 모양 → 룩' }, { marks: J(M(['e4'], 'ring'), M(lines('e4', 'B'), 'dot')), cap: 'X 모양 → 비숍' }, { marks: J(M(['e4'], 'ring'), M(lines('e4', 'Q'), 'dot')), cap: '✳ 모양 → 퀸' }, { marks: J(M(['e4'], 'ring'), M(ring8('e4'), 'dot')), cap: '둘레 한 칸 → 킹' }, { marks: J(M(['e4'], 'ring'), M(njumps('e4'), 'dot')), cap: '떨어진 8곳 → 나이트' }] },
        { t: 'do', task: pickQ('동그라미 칸의 숨은 말은 무엇일까요?', ['룩', '비숍', '퀸', '킹', '나이트'], '비숍', { pos: E, marks: J(M(['c3'], 'ring'), M(lines('c3', 'B'), 'dot')) }, ['점이 어떤 모양으로 놓였나요?', 'X 모양이에요.']) }
      ]),
      practice: { n: 8, gen: function (R) {
        var c = R.pick(KINDS.concat(['P'])), s = R.pick(sqs(function (x) { return c !== 'P' || /[2-6]/.test(x[1]); })), d = tg(only(c, s), s);
        if (c === 'Q' && (corner(s) || isEdge(s))) s = R.pick(['c3', 'd4', 'e5', 'f3', 'c6']), d = tg(only(c, s), s);
        var names = ['룩', '비숍', '퀸', '킹', '나이트', '폰'];
        return pickQ('동그라미 칸의 숨은 말은 무엇일까요? (점: 갈 수 있는 칸)', names, nm(c), { pos: E, marks: J(M([s], 'ring'), M(d, 'dot')) }, ['+ 룩, X 비숍, ✳ 퀸, 둘레 한 칸 킹, L자 나이트, 앞 칸 폰', { text: '점들을 숨은 말과 이어 보세요.', marks: M(d, 'soft') }]);
      } },
      sum: '점 모양으로 말을 알아봐요: <b>+ 룩 · X 비숍 · ✳ 퀸 · 둘레 킹 · L자 나이트 · 앞 칸 폰</b>.' }
  ];

  window.MADANG = { id: 'm2', no: 2, title: '말이 움직이는 법', rank: '나이트', rankPc: 'N', examN: 15,
    units: [{ title: '룩', lessons: u4 }, { title: '비숍', lessons: u5 }, { title: '퀸', lessons: u6 }, { title: '킹', lessons: u7 }, { title: '나이트', lessons: u8 }, { title: '폰', lessons: u9 }, { title: '움직임 복습', lessons: u10 }] };
})();
