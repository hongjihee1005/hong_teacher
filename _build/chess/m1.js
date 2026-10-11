/* 체스 학습관 1마당 · 체스판과 체스말 (23차시) — window.MADANG
   차시 짜임은 learn.js 맨 위 설명. 연습 문제는 gen(R)이 할 때마다 새로 만듦(check.js가 여러 번 만들어 점검). */
(function () {
  'use strict';
  var CH = window.CH, PN = window.PIECES.NAME, jo = window.PIECES.jo, F = 'abcdefgh';
  var E = '8/8/8/8/8/8/8/8', S0 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  var ALL = []; for (var i = 0; i < 64; i++) ALL.push(CH.name(i));
  function sqs(fn) { return ALL.filter(fn); }
  function light(s) { return ((8 - +s[1]) + F.indexOf(s[0])) % 2 === 0; }
  function rank(n) { return sqs(function (s) { return s[1] === String(n); }); }
  function file(c) { return sqs(function (s) { return s[0] === c; }); }
  function M(list, v) { var o = {}; list.forEach(function (s) { o[s] = v; }); return o; }
  function J() { var o = {}; [].forEach.call(arguments, function (m) { Object.keys(m || {}).forEach(function (k) { o[k] = (o[k] || []).concat(Array.isArray(m[k]) ? m[k] : [m[k]]); }); }); return o; }
  function L(s, t) { var o = {}; o[s] = { t: 'label', s: t, small: 1 }; return o; }
  function shift(s, df, dr) { var f = F.indexOf(s[0]) + df, r = +s[1] + dr; return f >= 0 && f < 8 && r >= 1 && r <= 8 ? F[f] + r : null; }
  function diag(s) { var o = []; [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (d) { for (var k = 1; k < 8; k++) { var t = shift(s, d[0] * k, d[1] * k); if (!t) break; o.push(t); } }); return o; }
  function colorName(s) { return light(s) ? '밝은 칸' : '어두운 칸'; }
  function pcAt(b, s) { return b[CH.idx(s)]; }
  function where(b, c) { return ALL.filter(function (s) { return pcAt(b, s) === c; }); }
  var RD = { a: '에이', b: '비', c: '씨', d: '디', e: '이', f: '에프', g: '지', h: '에이치' };
  var KO = ['일', '이', '삼', '사', '오', '육', '칠', '팔'];
  function readSq(s) { return s + '(' + RD[s[0]] + ' ' + KO[+s[1] - 1] + ')'; }
  function sideName(c) { return CH.isW(c) ? '백' : '흑'; }
  function pName(c) { return sideName(c) + ' ' + PN[c.toUpperCase()]; }
  var CORNERS = ['a1', 'h1', 'a8', 'h8'];
  var NOCO = { coords: false };

  /* 칸 하나를 고르는 문제 — 틀리면 그 칸의 이름(좌표를 배운 뒤)이나 색을 알려 줌 */
  function clickQ(q, ans, board, hint, extra) {
    return Object.assign({ type: 'click', q: q, ans: ans, board: board, hint: hint }, extra || {});
  }
  function pickQ(q, opts, ans, board, hint, extra) { return Object.assign({ type: 'pick', q: q, opts: opts, ans: ans, board: board, hint: hint }, extra || {}); }
  function nameWhy(target) { return function (s) { return { text: '그 칸은 <b>' + s + '</b>' + jo(s, '이에요').slice(s.length) + '. ' + jo(target, '을') + ' 찾아요.', marks: J(M([s], 'bad'), L(s, s)) }; }; }

  /* ===== 1단원 체스판 ===== */
  var u1 = [
    { id: 'board64', title: '체스판은 64칸', kind: 'easy',
      screens: [
        { t: 'say', text: '체스는 두 사람이 마주 앉아서 하는 놀이예요. 체스를 하는 네모난 판을 <b>체스판</b>이라고 해요.', board: { pos: E, coords: false } },
        { t: 'say', text: '체스판에는 작은 네모가 많이 있어요. 작은 네모 하나를 <b>칸</b>이라고 불러요. 노란색으로 칠한 것이 칸 하나예요.', board: { pos: E, coords: false, marks: { e4: 'hi' } } },
        { t: 'say', text: '옆으로 늘어선 칸을 세어 봐요. 하나, 둘, 셋 … 옆으로 한 줄에 <b>8칸</b>이 있어요.', board: { pos: E, coords: false, marks: J(M(rank(1), 'row'), L('a1', '1'), L('b1', '2'), L('c1', '3'), L('d1', '4'), L('e1', '5'), L('f1', '6'), L('g1', '7'), L('h1', '8')) } },
        { t: 'say', text: '위아래로 세어도 똑같이 <b>8칸</b>이에요.', board: { pos: E, coords: false, marks: J(M(file('a'), 'row'), L('a1', '1'), L('a2', '2'), L('a3', '3'), L('a4', '4'), L('a5', '5'), L('a6', '6'), L('a7', '7'), L('a8', '8')) } },
        { t: 'say', text: '8칸짜리 줄이 8줄 있어요. 그래서 체스판의 칸은 모두 <b>64칸</b>이에요. (8을 여덟 번 더하면 64예요.)', board: { pos: E, coords: false } }
      ].concat([
        { t: 'ex', text: '한 줄씩 칠하면서 칸이 몇 개인지 세어 봐요.', board: { pos: E, coords: false },
          frames: [1, 2, 3, 4, 5, 6, 7, 8].map(function (r) { var l = []; for (var k = 1; k <= r; k++) l = l.concat(rank(k)); return { marks: M(l, 'row'), cap: r + '줄 → ' + (8 * r) + '칸' + (r === 8 ? '! 모두 64칸이에요.' : '') }; }) },
        { t: 'ex', text: '체스판에는 귀퉁이(모서리) 칸이 네 개 있어요. 하나씩 별을 붙여 볼게요.', board: { pos: E, coords: false },
          frames: [{ marks: M(['a1'], 'star'), cap: '왼쪽 아래 귀퉁이' }, { marks: M(['a1', 'h1'], 'star'), cap: '오른쪽 아래 귀퉁이' }, { marks: M(['a1', 'h1', 'h8'], 'star'), cap: '오른쪽 위 귀퉁이' }, { marks: M(CORNERS, 'star'), cap: '왼쪽 위 귀퉁이. 귀퉁이는 모두 4칸이에요.' }] },
        { t: 'ex', text: '칸은 크기가 모두 같아요. 체스말은 한 칸에 <b>하나씩만</b> 들어가요.', board: { pos: E, coords: false },
          frames: [{ pos: '8/8/8/8/3P4/8/8/8', marks: { d4: 'hi' }, cap: '말이 칸 하나에 들어갔어요.' }, { pos: '8/8/8/8/3PN3/8/8/8', marks: { d4: 'hi', e4: 'hi' }, cap: '다른 말은 다른 칸에 들어가요.' }, { pos: '8/8/8/8/3PN3/8/8/8', marks: { d4: 'ok', e4: 'ok' }, cap: '한 칸에 말 두 개가 함께 들어가는 일은 없어요.' }] },
        { t: 'do', task: clickQ('체스판의 칸 하나를 아무거나 눌러 보세요.', ALL, { pos: E, coords: false }, ['판 위의 작은 네모 하나를 손가락으로 톡 눌러요.']) },
        { t: 'do', task: clickQ('귀퉁이 칸 하나를 눌러 보세요.', CORNERS, { pos: E, coords: false }, ['귀퉁이는 판의 네 모서리에 있어요.', { text: '반짝이는 네 칸 가운데 하나예요.', marks: M(CORNERS, 'hint') }], { why: function (s) { return { text: '그 칸은 귀퉁이가 아니에요. 판의 모서리 끝에 있는 칸을 찾아요.', marks: M([s], 'bad') }; } }) },
        { t: 'do', task: clickQ('별이 있는 칸 바로 오른쪽 칸을 눌러 보세요.', ['e4'], { pos: E, coords: false, marks: { d4: 'star' } }, ['별에서 오른쪽으로 한 칸 가요.', { text: '별 옆에 붙어 있는 칸이에요.', marks: { e4: 'hint' } }]) }
      ]),
      practice: { n: 8, gen: function (R) {
        var k = R.int(6);
        if (k === 0) return pickQ('옆으로 한 줄에는 칸이 몇 개 있나요?', ['6칸', '7칸', '8칸', '10칸'], '8칸', { pos: E, coords: false, marks: M(rank(R.int(8) + 1), 'row') }, ['칠한 줄의 칸을 하나씩 세어 봐요.']);
        if (k === 1) return pickQ('체스판의 칸은 모두 몇 개인가요?', R.shuffle(['36칸', '49칸', '64칸', '100칸']), '64칸', { pos: E, coords: false }, ['8칸짜리 줄이 8줄 있어요.', '8, 16, 24, 32, 40, 48, 56, … 그다음은?']);
        if (k === 2) { var n = R.int(6) + 2, r = R.int(8) + 1, st = R.int(9 - n), l = []; for (var j = 0; j < n; j++) l.push(F[st + j] + r);
          return pickQ('색칠한 칸은 모두 몇 칸인가요?', R.opts(n + '칸', ['2칸', '3칸', '4칸', '5칸', '6칸', '7칸', '8칸']), n + '칸', { pos: E, coords: false, marks: M(l, 'row') }, ['칠한 칸을 하나씩 손가락으로 짚으며 세어 봐요.']); }
        if (k === 3) return clickQ('귀퉁이 칸을 하나 눌러요.', CORNERS, { pos: E, coords: false }, ['판의 네 모서리를 봐요.', { text: '반짝이는 칸 가운데 하나예요.', marks: M(CORNERS, 'hint') }], { why: function (s) { return { text: '판의 모서리 끝 칸이 귀퉁이예요.', marks: M([s], 'bad') }; } });
        var dir = R.pick([[1, 0, '오른쪽'], [-1, 0, '왼쪽'], [0, 1, '위'], [0, -1, '아래']]), s0, t;
        do { s0 = R.sq(); t = shift(s0, dir[0], dir[1]); } while (!t);
        return clickQ('별이 있는 칸 바로 ' + dir[2] + ' 칸을 눌러요.', [t], { pos: E, coords: false, marks: M([s0], 'star') }, ['별에서 ' + dir[2] + '으로 한 칸만 가요.', { text: '별에 붙어 있는 칸이에요.', marks: M([t], 'hint') }],
          { why: function (s) { return { text: '별 바로 ' + dir[2] + '에 붙어 있는 칸이에요.', marks: M([s], 'bad') }; } });
      } },
      sum: '체스판은 옆으로 8칸, 위아래로 8칸, 모두 <b>64칸</b>이에요. 귀퉁이 칸은 4개예요.' },

    { id: 'colors', title: '밝은 칸과 어두운 칸', kind: 'easy',
      screens: [
        { t: 'say', text: '체스판의 칸은 두 가지 색이에요. 연한 색 칸은 <b>밝은 칸</b>, 진한 색 칸은 <b>어두운 칸</b>이라고 해요.', board: { pos: E, coords: false, marks: { d4: { t: 'label', s: '어두운', small: 1 }, e4: { t: 'label', s: '밝은', small: 1 } } } },
        { t: 'say', text: '밝은 칸과 어두운 칸은 <b>번갈아</b> 놓여 있어요. 그래서 바로 옆 칸은 언제나 색이 달라요.', board: { pos: E, coords: false, marks: J({ e4: 'star' }, M(['d4', 'f4'], 'ring')) } },
        { t: 'say', text: '위아래로 붙은 칸도 마찬가지예요. 별 칸이 밝은 칸이면, 바로 위 칸과 아래 칸은 어두운 칸이에요.', board: { pos: E, coords: false, marks: J({ e4: 'star' }, M(['e5', 'e3'], 'ring')) } },
        { t: 'say', text: '밝은 칸은 <b>32칸</b>, 어두운 칸도 <b>32칸</b>이에요. 두 색의 칸 수가 똑같아요.', board: { pos: E, coords: false } },
        { t: 'ex', text: '한 줄을 따라가며 색을 말해 볼게요.', board: { pos: E, coords: false },
          frames: rank(4).map(function (s, k) { var l = rank(4).slice(0, k + 1), m = {}; l.forEach(function (x) { m[x] = { t: 'label', s: light(x) ? '밝' : '어', small: 1 }; }); return { marks: m, cap: k === 7 ? '밝은 칸, 어두운 칸이 번갈아 나와요.' : '' }; }) },
        { t: 'ex', text: '밝은 칸만 모아 보고, 어두운 칸만 모아 봐요.', board: { pos: E, coords: false },
          frames: [{ marks: M(sqs(light), 'ok'), cap: '밝은 칸 32칸' }, { marks: M(sqs(function (s) { return !light(s); }), 'hi'), cap: '어두운 칸 32칸' }] },
        { t: 'ex', text: '별 칸에서 비스듬히(대각선으로) 가면 색이 같아요. 이것은 나중에 비숍을 배울 때 다시 나와요.', board: { pos: E, coords: false },
          frames: [{ marks: { c3: 'star' }, cap: '별 칸은 어두운 칸이에요.' }, { marks: J({ c3: 'star' }, M(['d4', 'e5', 'f6'], 'ring')), cap: '비스듬히 가도 모두 어두운 칸이에요.' }] },
        { t: 'do', task: clickQ('어두운 칸을 하나 눌러 보세요.', sqs(function (s) { return !light(s); }), { pos: E, coords: false }, ['진한 색 칸을 찾아요.']) },
        { t: 'do', task: clickQ('별 칸 바로 옆에 있는 밝은 칸을 하나 눌러 보세요.', ['c4', 'e4', 'd5', 'd3'], { pos: E, coords: false, marks: { d4: 'star' } }, ['별 칸은 어두운 칸이에요. 바로 옆 칸은 색이 달라요.', { text: '반짝이는 칸 가운데 하나예요.', marks: M(['c4', 'e4', 'd5', 'd3'], 'hint') }]) }
      ],
      practice: { n: 8, gen: function (R) {
        var k = R.int(5), s = R.sq();
        if (k === 0) return clickQ('어두운 칸을 하나 눌러요.', sqs(function (x) { return !light(x); }), { pos: E, coords: false }, ['진한 색 칸이에요.'], { why: function () { return { text: '그 칸은 밝은 칸이에요. 진한 색 칸을 눌러요.' }; } });
        if (k === 1) return clickQ('밝은 칸을 하나 눌러요.', sqs(light), { pos: E, coords: false }, ['연한 색 칸이에요.'], { why: function () { return { text: '그 칸은 어두운 칸이에요. 연한 색 칸을 눌러요.' }; } });
        if (k === 2) return pickQ('별이 있는 칸은 무슨 색 칸인가요?', ['밝은 칸', '어두운 칸'], colorName(s), { pos: E, coords: false, marks: M([s], 'star') }, ['별 아래 칸의 색을 잘 봐요.']);
        if (k === 3) { var d = R.pick([[1, 0, '오른쪽'], [-1, 0, '왼쪽'], [0, 1, '위'], [0, -1, '아래']]), t; while (!(t = shift(s, d[0], d[1]))) s = R.sq();
          return pickQ('별 칸 바로 ' + d[2] + ' 칸은 무슨 색 칸일까요?', ['밝은 칸', '어두운 칸'], colorName(t), { pos: E, coords: false, marks: M([s], 'star') }, ['바로 옆 칸은 언제나 색이 달라요.', { text: '별 칸의 색과 반대예요.', marks: M([t], 'ring') }]); }
        var same = sqs(function (x) { return x !== s && light(x) === light(s); });
        return clickQ('별 칸과 <b>같은 색</b> 칸을 하나 눌러요(별 칸 말고).', same, { pos: E, coords: false, marks: M([s], 'star') }, ['별 칸이 ' + colorName(s) + '이에요.', '비스듬히 이웃한 칸은 색이 같아요.'],
          { why: function (x) { return x === s ? { text: '별 칸 말고 다른 칸을 눌러요.' } : { text: '그 칸은 ' + colorName(x) + '이에요. 별 칸은 ' + colorName(s) + '이에요.', marks: M([x], 'bad') }; } });
      } },
      sum: '체스판에는 <b>밝은 칸 32칸</b>과 <b>어두운 칸 32칸</b>이 번갈아 있어요. 바로 옆 칸은 언제나 색이 달라요.' },

    { id: 'orient', title: '판 바르게 놓기', kind: 'easy',
      screens: [
        { t: 'say', text: '체스를 시작하기 전에 판을 <b>바르게</b> 놓아야 해요. 판을 잘못 놓으면 말을 놓는 자리가 모두 틀려져요.', board: { pos: E, coords: false } },
        { t: 'say', text: '약속: 내 쪽에서 볼 때 <b>오른쪽 아래 귀퉁이 칸이 밝은 칸</b>이 되게 놓아요.', board: { pos: E, coords: false, marks: { h1: 'star' } } },
        { t: 'say', text: '외우는 말: <b>“오른쪽은 밝게!”</b> 건너편에 앉은 친구에게도 자기 오른쪽 아래가 밝은 칸이에요.', board: { pos: E, coords: false, marks: M(['h1', 'a8'], 'star') } },
        { t: 'say', text: '이 판은 오른쪽 아래가 <b>어두운 칸</b>이에요. 잘못 놓았어요! 이럴 때는 판을 한 번(옆으로 4분의 1바퀴) 돌려요.', board: { pos: E, coords: false, swap: true, marks: { h1: 'x' } } },
        { t: 'ex', text: '잘못 놓은 판과 바르게 놓은 판을 견주어 봐요.', board: { pos: E, coords: false },
          frames: [{ swap: true, marks: { h1: 'x' }, cap: '오른쪽 아래가 어두운 칸 → 잘못 놓았어요.' }, { swap: false, marks: { h1: 'star' }, cap: '판을 돌리면 오른쪽 아래가 밝은 칸 → 바르게 놓았어요!' }] },
        { t: 'ex', text: '이번에는 건너편 친구 자리에서 판을 본 모습이에요.', board: { pos: E, coords: false, flip: true },
          frames: [{ marks: { a8: 'star' }, cap: '친구에게도 오른쪽 아래 칸이 밝은 칸이에요.' }, { marks: M(['a8', 'h1'], 'star'), cap: '두 사람 모두 “오른쪽은 밝게!”' }] },
        { t: 'ex', text: '판을 놓는 차례를 정리해요.', board: { pos: E, coords: false, swap: true },
          frames: [{ swap: true, marks: { h1: 'ring' }, cap: '① 내 오른쪽 아래 칸을 봐요.' }, { swap: true, marks: { h1: 'x' }, cap: '② 어두운 칸이면 판을 돌려요.' }, { swap: false, marks: { h1: 'star' }, cap: '③ 밝은 칸이 되면 준비 끝!' }] },
        { t: 'do', task: clickQ('내 쪽에서 볼 때 오른쪽 아래 귀퉁이 칸을 눌러 보세요.', ['h1'], { pos: E, coords: false }, ['판 아래쪽, 오른쪽 끝이에요.', { text: '반짝이는 칸이에요.', marks: { h1: 'hint' } }]) },
        { t: 'do', task: pickQ('이 판은 바르게 놓였나요?', ['바르게 놓였어요', '돌려서 놓아야 해요'], '돌려서 놓아야 해요', { pos: E, coords: false, swap: true }, ['오른쪽 아래 귀퉁이 칸의 색을 봐요.', { text: '이 칸이 밝은 칸이어야 해요.', marks: { h1: 'ring' } }]) }
      ],
      practice: { n: 8, gen: function (R) {
        var k = R.int(4), sw = R.int(2) === 1, fl = R.int(3) === 0;
        if (k === 0 || k === 3) return pickQ(fl ? '건너편 친구 자리에서 본 판이에요. 바르게 놓였나요?' : '이 판은 바르게 놓였나요?', ['바르게 놓였어요', '돌려서 놓아야 해요'], sw ? '돌려서 놓아야 해요' : '바르게 놓였어요', { pos: E, coords: false, swap: sw, flip: fl }, ['오른쪽 아래 귀퉁이 칸의 색을 봐요.', '“오른쪽은 밝게!”']);
        if (k === 1) return clickQ(fl ? '건너편 친구 자리에서 본 판이에요. 이 판에서 오른쪽 아래 귀퉁이 칸을 눌러요.' : '오른쪽 아래 귀퉁이 칸을 눌러요.', [fl ? 'a8' : 'h1'], { pos: E, coords: false, flip: fl }, ['판 아래쪽, 오른쪽 끝이에요.'], { why: function (s) { return { text: '판 아래쪽의 오른쪽 끝 칸을 눌러요.', marks: M([s], 'bad') }; } });
        return pickQ('판을 놓을 때, 내 오른쪽 아래 귀퉁이는 어떤 칸이어야 하나요?', ['밝은 칸', '어두운 칸'], '밝은 칸', { pos: E, coords: false }, ['외우는 말 “오른쪽은 ○○!”']);
      } },
      sum: '판은 <b>내 오른쪽 아래 귀퉁이가 밝은 칸</b>이 되게 놓아요. “오른쪽은 밝게!”' },

    { id: 'ranks', title: '가로줄(랭크)', kind: 'easy',
      screens: [
        { t: 'say', text: '옆으로 늘어선 칸들의 줄을 <b>가로줄</b>이라고 해요. 영어로 <b>랭크</b>(rank)라고 불러요.', board: { pos: E, marks: M(rank(3), 'row') } },
        { t: 'say', text: '가로줄은 모두 8줄이에요. 판 왼쪽에 <b>1부터 8까지</b> 번호가 있어요. 백(내 쪽, 아래)이 <b>1</b>, 건너편(위)이 <b>8</b>이에요.', board: { pos: E, marks: J(M(rank(1), 'row'), M(rank(8), 'hi')) } },
        { t: 'say', text: '같은 가로줄에 있는 칸은 모두 같은 번호를 가져요. 이 줄의 칸은 모두 <b>5번 가로줄</b>에 있어요.', board: { pos: E, marks: M(rank(5), 'row') } },
        { t: 'ex', text: '1번 가로줄부터 8번 가로줄까지 차례로 칠해 볼게요.', board: { pos: E },
          frames: [1, 2, 3, 4, 5, 6, 7, 8].map(function (r) { return { marks: M(rank(r), 'row'), cap: r + '번 가로줄' }; }) },
        { t: 'ex', text: '4번 가로줄을 찾는 방법: 왼쪽에서 숫자 <b>4</b>를 찾고, 오른쪽으로 쭉 가요.', board: { pos: E },
          frames: [{ marks: { a4: 'ring' }, cap: '왼쪽 숫자 4를 찾아요.' }, { marks: M(rank(4), 'row'), arrows: [['a4', 'h4']], cap: '오른쪽으로 쭉 → 이 줄이 4번 가로줄이에요.' }] },
        { t: 'ex', text: '별이 있는 칸은 몇 번 가로줄일까요? 별에서 왼쪽으로 쭉 가서 숫자를 읽어요.', board: { pos: E },
          frames: [{ marks: { f6: 'star' }, cap: '별이 여기 있어요.' }, { marks: J({ f6: 'star' }, M(rank(6), 'row')), arrows: [['f6', 'a6']], cap: '왼쪽으로 쭉 → 6번 가로줄!' }, { marks: { c2: 'star' }, cap: '이번엔 여기.' }, { marks: J({ c2: 'star' }, M(rank(2), 'row')), arrows: [['c2', 'a2']], cap: '2번 가로줄!' }] },
        { t: 'do', task: clickQ('5번 가로줄에 있는 칸을 아무거나 하나 눌러 보세요.', rank(5), { pos: E }, ['판 왼쪽에서 숫자 5를 찾아요.', { text: '숫자 5에서 오른쪽으로 쭉 가는 줄이에요.', marks: M(rank(5), 'hint') }], { why: function (s) { return { text: '그 칸은 <b>' + s[1] + '번</b> 가로줄이에요.', marks: J(M(rank(+s[1]), 'bad')) }; } }) },
        { t: 'do', task: pickQ('별이 있는 칸은 몇 번 가로줄인가요?', ['3번', '5번', '7번', '8번'], '7번', { pos: E, marks: { d7: 'star' } }, ['별에서 왼쪽으로 쭉 가요.', { text: '이 줄 왼쪽 끝의 숫자를 읽어요.', marks: M(rank(7), 'row') }]) }
      ],
      practice: { n: 9, gen: function (R) {
        var k = R.int(4), r = R.int(8) + 1, s = R.sq();
        if (k === 0) return clickQ(r + '번 가로줄에 있는 칸을 하나 눌러요.', rank(r), { pos: E }, ['판 왼쪽에서 숫자 ' + jo(r, '을') + ' 찾아요.', { text: '그 숫자에서 오른쪽으로 가는 줄이에요.', marks: M(rank(r), 'hint') }], { why: function (x) { return { text: '그 칸은 <b>' + x[1] + '번</b> 가로줄이에요.', marks: M(rank(+x[1]), 'bad') }; } });
        if (k === 1) return pickQ('별이 있는 칸은 몇 번 가로줄인가요?', R.opts(s[1] + '번', ['1번', '2번', '3번', '4번', '5번', '6번', '7번', '8번']), s[1] + '번', { pos: E, marks: M([s], 'star') }, ['별에서 왼쪽으로 쭉 가요.', { text: '이 줄 끝의 숫자를 읽어요.', marks: M(rank(+s[1]), 'row') }]);
        if (k === 2) return pickQ('색칠한 줄은 몇 번 가로줄인가요?', R.opts(r + '번', ['1번', '2번', '3번', '4번', '5번', '6번', '7번', '8번']), r + '번', { pos: E, marks: M(rank(r), 'row') }, ['칠한 줄의 왼쪽 끝 숫자를 봐요.']);
        return pickQ(R.pick(['백(내 쪽, 아래)에 가장 가까운 가로줄은 몇 번인가요?', '건너편(위)에 가장 가까운 가로줄은 몇 번인가요?']).replace(/^(.)/, '$1'), ['1번', '4번', '8번'], null, { pos: E }, ['아래가 1번, 위가 8번이에요.']);
      } },
      sum: '옆으로 늘어선 줄은 <b>가로줄(랭크)</b>이에요. 아래(백 쪽)부터 <b>1~8번</b>이고, 번호는 판 왼쪽에 있어요.' },

    { id: 'files', title: '세로줄(파일)', kind: 'easy',
      screens: [
        { t: 'say', text: '위아래로 늘어선 칸들의 줄을 <b>세로줄</b>이라고 해요. 영어로 <b>파일</b>(file)이라고 불러요.', board: { pos: E, marks: M(file('c'), 'row') } },
        { t: 'say', text: '세로줄도 8줄이에요. 판 아래에 알파벳 <b>a b c d e f g h</b>가 있어요. 왼쪽 끝이 <b>a</b>, 오른쪽 끝이 <b>h</b>예요.', board: { pos: E, marks: J(M(file('a'), 'row'), M(file('h'), 'hi')) } },
        { t: 'say', text: '알파벳 읽는 법: a 에이 · b 비 · c 씨 · d 디 · e 이 · f 에프 · g 지 · h 에이치. 영어를 몰라도 괜찮아요. 판 아래 글자를 보고 같은 모양을 찾으면 돼요.', board: { pos: E } },
        { t: 'ex', text: 'a 세로줄부터 h 세로줄까지 차례로 칠해 볼게요.', board: { pos: E },
          frames: F.split('').map(function (c) { return { marks: M(file(c), 'row'), cap: c + ' 세로줄 (' + RD[c] + ')' }; }) },
        { t: 'ex', text: '별이 있는 칸은 어느 세로줄일까요? 별에서 아래로 쭉 내려가 글자를 읽어요.', board: { pos: E },
          frames: [{ marks: { d6: 'star' }, cap: '별이 여기 있어요.' }, { marks: J({ d6: 'star' }, M(file('d'), 'row')), arrows: [['d6', 'd1']], cap: '아래로 쭉 → d 세로줄!' }, { marks: { g3: 'star' }, cap: '이번엔 여기.' }, { marks: J({ g3: 'star' }, M(file('g'), 'row')), arrows: [['g3', 'g1']], cap: 'g 세로줄!' }] },
        { t: 'ex', text: '가로줄과 세로줄을 견주어 봐요.', board: { pos: E },
          frames: [{ marks: M(rank(4), 'row'), cap: '옆으로 → 가로줄(숫자 이름)' }, { marks: M(file('e'), 'row'), cap: '위아래로 ↕ 세로줄(글자 이름)' }] },
        { t: 'do', task: clickQ('e 세로줄에 있는 칸을 하나 눌러 보세요.', file('e'), { pos: E }, ['판 아래에서 글자 e를 찾아요.', { text: 'e에서 위로 쭉 가는 줄이에요.', marks: M(file('e'), 'hint') }], { why: function (s) { return { text: '그 칸은 <b>' + s[0] + '</b> 세로줄이에요.', marks: M(file(s[0]), 'bad') }; } }) },
        { t: 'do', task: pickQ('별이 있는 칸은 어느 세로줄인가요?', ['a', 'b', 'f', 'h'], 'b', { pos: E, marks: { b5: 'star' } }, ['별에서 아래로 쭉 내려가요.', { text: '이 줄 아래의 글자를 읽어요.', marks: M(file('b'), 'row') }]) }
      ],
      practice: { n: 9, gen: function (R) {
        var k = R.int(3), c = F[R.int(8)], s = R.sq();
        if (k === 0) return clickQ(c + ' 세로줄에 있는 칸을 하나 눌러요.', file(c), { pos: E }, ['판 아래에서 글자 ' + jo(c, '을') + ' 찾아요.', { text: '그 글자에서 위로 가는 줄이에요.', marks: M(file(c), 'hint') }], { why: function (x) { return { text: '그 칸은 <b>' + x[0] + '</b> 세로줄이에요.', marks: M(file(x[0]), 'bad') }; } });
        if (k === 1) return pickQ('별이 있는 칸은 어느 세로줄인가요?', R.opts(s[0], F.split('')), s[0], { pos: E, marks: M([s], 'star') }, ['별에서 아래로 쭉 내려가요.', { text: '이 줄 아래의 글자를 읽어요.', marks: M(file(s[0]), 'row') }]);
        return pickQ('색칠한 줄은 어느 세로줄인가요?', R.opts(c, F.split('')), c, { pos: E, marks: M(file(c), 'row') }, ['칠한 줄 아래의 글자를 봐요.']);
      } },
      sum: '위아래로 늘어선 줄은 <b>세로줄(파일)</b>이에요. 왼쪽부터 <b>a b c d e f g h</b>이고, 글자는 판 아래에 있어요.' },

    { id: 'names', title: '칸 이름', kind: 'easy',
      screens: [
        { t: 'say', text: '체스판의 64칸에는 모두 <b>이름</b>이 있어요. 세로줄 글자와 가로줄 숫자를 합쳐서 불러요.', board: { pos: E } },
        { t: 'say', text: 'e 세로줄과 4번 가로줄이 만나는 칸은 <b>e4</b>예요. 두 줄이 만나는 곳을 찾으면 돼요.', board: { pos: E, marks: J(M(file('e'), 'row'), M(rank(4), 'row'), { e4: ['star'] }) } },
        { t: 'say', text: '쓸 때는 <b>글자 먼저, 숫자 나중</b>이에요. ‘4e’라고 쓰지 않고 ‘e4’라고 써요. 읽을 때는 “이 사”라고 읽어요.', board: { pos: E, marks: J({ e4: 'star' }, L('e4', 'e4')) } },
        { t: 'say', text: '네 귀퉁이의 이름을 알아 두면 편해요. 왼쪽 아래 <b>a1</b>, 오른쪽 아래 <b>h1</b>, 왼쪽 위 <b>a8</b>, 오른쪽 위 <b>h8</b>.', board: { pos: E, marks: J(L('a1', 'a1'), L('h1', 'h1'), L('a8', 'a8'), L('h8', 'h8')) } },
        { t: 'ex', text: 'd5 칸을 함께 찾아봐요.', board: { pos: E },
          frames: [{ marks: M(file('d'), 'row'), cap: '① 아래에서 글자 d를 찾아 세로줄을 봐요.' }, { marks: J(M(file('d'), 'row'), M(rank(5), 'row')), cap: '② 왼쪽에서 숫자 5를 찾아 가로줄을 봐요.' }, { marks: J({ d5: 'star' }, L('d5', 'd5')), cap: '③ 두 줄이 만나는 칸이 d5예요!' }] },
        { t: 'ex', text: 'b7 칸을 찾아봐요.', board: { pos: E },
          frames: [{ marks: M(file('b'), 'row'), cap: '글자 b의 세로줄' }, { marks: J(M(file('b'), 'row'), M(rank(7), 'row')), cap: '숫자 7의 가로줄' }, { marks: J({ b7: 'star' }, L('b7', 'b7')), cap: '만나는 칸 b7!' }] },
        { t: 'ex', text: '거꾸로, 별이 있는 칸의 이름을 읽어 봐요.', board: { pos: E },
          frames: [{ marks: { g3: 'star' }, cap: '별이 있는 칸' }, { marks: { g3: 'star' }, arrows: [['g3', 'g1']], cap: '아래로 → 글자 g' }, { marks: { g3: 'star' }, arrows: [['g3', 'a3']], cap: '왼쪽으로 → 숫자 3' }, { marks: J({ g3: 'star' }, L('g3', 'g3')), cap: '그래서 이 칸은 g3이에요.' }] },
        { t: 'do', task: clickQ('<b>e4</b> 칸을 눌러 보세요.', ['e4'], { pos: E }, ['글자 e의 세로줄과 숫자 4의 가로줄이 만나는 곳이에요.', { text: '두 줄이 만나는 곳을 봐요.', marks: J(M(file('e'), 'row'), M(rank(4), 'row')) }], { why: nameWhy('e4') }) },
        { t: 'do', task: pickQ('별이 있는 칸의 이름은 무엇인가요?', ['c6', 'f3', 'c3', '6c'], 'c6', { pos: E, marks: { c6: 'star' } }, ['아래로 내려가 글자를, 왼쪽으로 가서 숫자를 읽어요.', '글자를 먼저 써요.']) }
      ],
      practice: { n: 10, gen: function (R) {
        var s = R.sq();
        if (R.int(2)) return clickQ('<b>' + s + '</b> 칸을 눌러요.', [s], { pos: E }, ['글자 ' + s[0] + '의 세로줄과 숫자 ' + s[1] + '의 가로줄이 만나는 곳이에요.', { text: '두 줄이 만나는 곳을 봐요.', marks: J(M(file(s[0]), 'row'), M(rank(+s[1]), 'row')) }], { why: nameWhy(s) });
        var c = s[0], r = s[1], cand = [c + (9 - r), F[7 - F.indexOf(c)] + r, r + c, F[(F.indexOf(c) + 1) % 8] + r, c + (r % 8 + 1)].filter(function (x) { return x !== s; });
        return pickQ('별이 있는 칸의 이름은 무엇인가요?', R.opts(s, cand), s, { pos: E, marks: M([s], 'star') }, ['아래로 내려가 글자를, 왼쪽으로 가서 숫자를 읽어요.', { text: '두 줄을 칠해 볼게요.', marks: J(M(file(c), 'row'), M(rank(+r), 'row')) }]);
      } },
      sum: '칸 이름은 <b>세로줄 글자 + 가로줄 숫자</b>예요(예: e4). 글자를 먼저 써요.' },

    { id: 'namegame', title: '칸 이름 찾기 놀이', kind: 'one',
      screens: [
        { t: 'say', text: '이번에는 판 옆의 글자와 숫자를 <b>숨기고</b> 칸을 찾아봐요. 체스를 잘하는 사람은 글자가 없어도 칸 이름을 알아요.', board: { pos: E, coords: false } },
        { t: 'say', text: '방법 하나: 귀퉁이부터 기억해요. 내 쪽 왼쪽 아래가 <b>a1</b>, 오른쪽 아래가 <b>h1</b>, 건너편 왼쪽이 <b>a8</b>, 오른쪽이 <b>h8</b>.', board: { pos: E, coords: false, marks: J(L('a1', 'a1'), L('h1', 'h1'), L('a8', 'a8'), L('h8', 'h8')) } },
        { t: 'say', text: '방법 둘: 세어서 찾아요. 글자는 a b c d e f g h 차례로 <b>왼쪽부터</b>, 숫자는 <b>아래부터</b> 세요.', board: { pos: E, coords: false } },
        { t: 'say', text: '방법 셋: 가운데 네 칸을 기억해요. <b>d4 · e4 · d5 · e5</b> — 체스에서 아주 중요한 칸들이에요.', board: { pos: E, coords: false, marks: J(L('d4', 'd4'), L('e4', 'e4'), L('d5', 'd5'), L('e5', 'e5'), M(['d4', 'e4', 'd5', 'e5'], 'hi')) } },
        { t: 'ex', text: 'f3을 세어서 찾아봐요.', board: { pos: E, coords: false },
          frames: F.slice(0, 6).split('').map(function (c, k) { return { marks: J(M(F.slice(0, k + 1).split('').map(function (x) { return x + '1'; }), 'row'), L(c + '1', c)), cap: k === 5 ? '왼쪽부터 a b c d e f → 여섯째 세로줄' : '' }; })
            .concat([{ marks: J(M(['f1', 'f2', 'f3'], 'row'), L('f1', '1'), L('f2', '2'), L('f3', '3')), cap: '아래부터 1 2 3 → 셋째 가로줄' }, { marks: J({ f3: 'star' }, L('f3', 'f3')), cap: '여기가 f3!' }]) },
        { t: 'ex', text: 'h8 귀퉁이에서 거꾸로 세어 c7을 찾아봐요.', board: { pos: E, coords: false },
          frames: [{ marks: L('h8', 'h8'), cap: '오른쪽 위는 h8' }, { marks: J(M(['h7', 'g7', 'f7', 'e7', 'd7', 'c7'], 'row'), L('h7', 'h7')), cap: '한 칸 내려와 h7, 왼쪽으로 g f e d c' }, { marks: J({ c7: 'star' }, L('c7', 'c7')), cap: 'c7!' }] },
        { t: 'do', task: clickQ('글자 없이 <b>a1</b> 칸을 눌러 보세요.', ['a1'], { pos: E, coords: false }, ['내 쪽(아래) 왼쪽 귀퉁이예요.']) },
        { t: 'do', task: clickQ('글자 없이 <b>d4</b> 칸을 눌러 보세요.', ['d4'], { pos: E, coords: false }, ['가운데 네 칸 가운데 하나예요. d는 넷째 세로줄, 4는 넷째 가로줄.', { text: '가운데 네 칸이에요.', marks: M(['d4', 'e4', 'd5', 'e5'], 'ring') }], { why: nameWhy('d4') }) }
      ],
      practice: { n: 10, gen: function (R) {
        var s = R.sq(), fi = F.indexOf(s[0]) + 1;
        if (R.int(3)) return clickQ('글자 없이 <b>' + s + '</b> 칸을 눌러요.', [s], { pos: E, coords: false }, ['왼쪽부터 ' + fi + '번째 세로줄, 아래부터 ' + s[1] + '번째 가로줄이에요.', { text: '두 줄을 칠해 볼게요.', marks: J(M(file(s[0]), 'row'), M(rank(+s[1]), 'row')) }], { why: nameWhy(s) });
        return pickQ('글자 없이 읽어요. 별이 있는 칸의 이름은?', R.opts(s, [F[(fi) % 8] + s[1], s[0] + (s[1] % 8 + 1), F[(fi + 6) % 8] + s[1], s[0] + ((+s[1] + 6) % 8 + 1)]), s, { pos: E, coords: false, marks: M([s], 'star') }, ['왼쪽부터, 아래부터 세어 봐요.', { text: '글자와 숫자를 잠깐 보여 줄게요.', marks: J(L(s[0] + '1', s[0]), L('a' + s[1], s[1])) }]);
      } },
      sum: '글자가 없어도 <b>귀퉁이(a1·h1·a8·h8)</b>나 <b>가운데 네 칸(d4·e4·d5·e5)</b>에서 세면 칸을 찾을 수 있어요.' },

    { id: 'diag', title: '대각선', kind: 'easy',
      screens: [
        { t: 'say', text: '비스듬히 이어진 칸들의 줄을 <b>대각선</b>이라고 해요. a1에서 h8까지 비스듬히 이어진 줄이 대각선이에요.', board: { pos: E, marks: M(['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'], 'row') } },
        { t: 'say', text: '대각선 위의 칸은 <b>모두 같은 색</b>이에요. 이 대각선은 모두 어두운 칸이에요.', board: { pos: E, marks: M(['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'], 'ring') } },
        { t: 'say', text: '한 칸에서는 네 방향(↗ ↖ ↘ ↙)으로 대각선이 뻗어 나가요.', board: { pos: E, marks: { e4: 'star' }, arrows: [['e4', 'h7'], ['e4', 'b7'], ['e4', 'h1'], ['e4', 'b1']] } },
        { t: 'say', text: '대각선은 길이가 달라요. 가장 긴 대각선은 8칸(a1–h8, h1–a8)이고, 귀퉁이 가까이에는 2칸짜리 짧은 대각선도 있어요.', board: { pos: E, marks: J(M(['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'], 'row'), M(['a7', 'b8'], 'hi')) } },
        { t: 'ex', text: '가장 긴 대각선 두 개를 봐요.', board: { pos: E },
          frames: [{ marks: M(['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'], 'row'), cap: 'a1에서 h8까지 (어두운 칸 8칸)' }, { marks: M(['h1', 'g2', 'f3', 'e4', 'd5', 'c6', 'b7', 'a8'], 'hi'), cap: 'h1에서 a8까지 (밝은 칸 8칸)' }] },
        { t: 'ex', text: '별 칸에서 뻗는 대각선을 하나씩 칠해 볼게요.', board: { pos: E },
          frames: [[1, 1, '↗'], [-1, 1, '↖'], [1, -1, '↘'], [-1, -1, '↙']].map(function (d, k, arr) { var l = []; arr.slice(0, k + 1).forEach(function (dd) { for (var j = 1; j < 8; j++) { var t = shift('d3', dd[0] * j, dd[1] * j); if (!t) break; l.push(t); } }); return { marks: J({ d3: 'star' }, M(l, 'row')), cap: d[2] + ' 방향' }; }) },
        { t: 'ex', text: '가로줄·세로줄·대각선을 견주어 봐요.', board: { pos: E },
          frames: [{ marks: M(rank(5), 'row'), cap: '옆으로 → 가로줄' }, { marks: M(file('c'), 'row'), cap: '위아래로 → 세로줄' }, { marks: M(diag('c1').filter(function (s) { return +s[1] > 1; }).concat(['c1']), 'row'), cap: '비스듬히 → 대각선' }] },
        { t: 'do', task: clickQ('별 칸과 <b>대각선</b>으로 이어진 칸을 하나 눌러 보세요.', diag('e4'), { pos: E, marks: { e4: 'star' } }, ['별에서 비스듬히(↗↖↘↙) 가는 칸이에요.', { text: '반짝이는 칸들이 대각선이에요.', marks: M(diag('e4'), 'hint') }], { why: function (s) { return { text: '그 칸은 별과 대각선으로 이어져 있지 않아요. 비스듬히 가야 해요.', marks: M([s], 'bad') }; } }) },
        { t: 'do', task: pickQ('색칠한 줄은 무엇인가요?', ['가로줄', '세로줄', '대각선'], '대각선', { pos: E, marks: M(['c1', 'd2', 'e3', 'f4', 'g5', 'h6'], 'row') }, ['칠한 칸들이 어느 쪽으로 이어졌는지 봐요.']) }
      ],
      practice: { n: 9, gen: function (R) {
        var k = R.int(3), s = R.sq();
        if (k === 0) { var d = diag(s); return clickQ('별 칸과 대각선으로 이어진 칸을 하나 눌러요.', d, { pos: E, marks: M([s], 'star') }, ['별에서 비스듬히 가요.', { text: '반짝이는 칸들이 대각선이에요.', marks: M(d, 'hint') }], { why: function (x) { return { text: '그 칸은 별과 ' + (x[0] === s[0] ? '세로줄' : x[1] === s[1] ? '가로줄' : '이어지지 않은 칸') + '이에요. 비스듬히 가야 해요.', marks: M([x], 'bad') }; } }); }
        if (k === 1) { var t = R.int(3), l = t === 0 ? rank(+s[1]) : t === 1 ? file(s[0]) : [s].concat(diag(s).filter(function (x) { return (F.indexOf(x[0]) - F.indexOf(s[0])) * (+x[1] - +s[1]) > 0; }));
          if (l.length < 2) { l = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8']; t = 2; }
          var a = ['가로줄', '세로줄', '대각선'][t]; return pickQ('색칠한 줄은 무엇인가요?', ['가로줄', '세로줄', '대각선'], a, { pos: E, marks: M(l, 'row') }, ['옆으로? 위아래로? 비스듬히?']); }
        return pickQ('별 칸과 같은 대각선 위에 있는 칸은 무슨 색일까요?', ['밝은 칸', '어두운 칸'], colorName(s), { pos: E, marks: M([s], 'star') }, ['대각선 위의 칸은 모두 같은 색이에요.']);
      } },
      sum: '비스듬히 이어진 줄이 <b>대각선</b>이에요. 대각선 위의 칸은 <b>모두 같은 색</b>이에요.' }
  ];

  /* ===== 2단원 체스말 만나기 ===== */
  var KINDS = ['K', 'Q', 'R', 'B', 'N', 'P'];
  function scatterAll(R, n, must) { var l = (must || []).slice(); while (l.length < n) l.push(R.pick(KINDS.concat(KINDS.map(function (c) { return c.toLowerCase(); })))); return R.scatter(l); }
  function findPieceQ(R, c, n) {
    var b = scatterAll(R, n || 6, [c, R.pick([c, c.toLowerCase() === c ? c.toUpperCase() : c.toLowerCase()])]), ans = where(b, c);
    return clickQ('판에서 <b>' + pName(c) + '</b>' + jo(pName(c), '을').slice(pName(c).length) + ' 모두 찾아 눌러요.', ans, { pos: b }, [PN[c.toUpperCase()] + '의 모양을 떠올려요. ' + (CH.isW(c) ? '밝은 색' : '어두운 색') + ' 말이에요.', { text: '반짝이는 말 가운데에서 찾아요.', marks: M(ans, 'ring') }],
      { all: true, why: function (s) { var p = pcAt(b, s); return { text: p === '.' ? '빈칸이에요.' : '그 말은 <b>' + pName(p) + '</b>' + jo(pName(p), '이에요').slice(pName(p).length) + '.', marks: M([s], 'bad') }; } });
  }
  function nameQ(R, kinds) {
    var t = R.pick(kinds), c = R.int(2) ? t : t.toLowerCase(), b = scatterAll(R, 5, [c]), s = where(b, c)[0];
    return pickQ('별이 붙은 말의 이름은 무엇인가요?', R.opts(PN[t], kinds.map(function (x) { return PN[x]; }), Math.min(4, kinds.length)), PN[t], { pos: b, marks: M([s], 'ring') }, ['동그라미 안의 말 모양을 자세히 봐요.'], { why: function (o) { return { text: '‘' + o + '’' + jo(o, '이').slice(o.length) + ' 아니에요. ' + HOW[t] }; } });
  }
  var HOW = { K: '킹은 머리 위에 십자가가 있어요.', Q: '퀸은 뾰족뾰족한 왕관을 썼어요.', R: '룩은 위가 울퉁불퉁한 성(탑) 모양이에요.', B: '비숍은 비스듬한 홈이 있는 길쭉한 모자를 썼어요.', N: '나이트는 말(동물) 머리 모양이에요.', P: '폰은 머리가 동그란 가장 작은 말이에요.' };
  function isItQ(R, t, kinds) {
    var yes = R.int(2) === 1, o = yes ? t : R.pick(kinds.filter(function (x) { return x !== t; })), c = R.int(2) ? o : o.toLowerCase(), b = scatterAll(R, 4, [c]), s = where(b, c)[0];
    return pickQ('동그라미 안의 말은 <b>' + PN[t] + '</b>일까요?', ['네, ' + jo(PN[t], '이에요'), '아니요'], yes ? '네, ' + jo(PN[t], '이에요') : '아니요', { pos: b, marks: M([s], 'ring') }, [HOW[t]]);
  }
  function pieceLesson(o) {
    var t = o.t, w = t, bk = t.toLowerCase(), home = o.home, learned = KINDS.slice(0, KINDS.indexOf(t) + 1);
    return { id: o.id, title: PN[t], kind: 'easy',
      screens: [
        { t: 'say', big: [w, bk], text: o.look, board: null },
        { t: 'say', big: [w], text: o.role, board: null },
        { t: 'say', text: o.count, board: { pos: S0, marks: M(home, 'hi') } },
        { t: 'ex', text: '처음 놓인 판에서 ' + jo(PN[t], '을') + ' 찾아봐요.', board: { pos: S0 },
          frames: [{ marks: M(where(CH.board(S0), w), 'ring'), cap: '백 ' + PN[t] + ': ' + where(CH.board(S0), w).join(', ') }, { marks: M(where(CH.board(S0), bk), 'ring'), cap: '흑 ' + PN[t] + ': ' + where(CH.board(S0), bk).join(', ') }] },
        { t: 'ex', text: o.cmpText, board: { pos: o.cmpPos, marks: o.cmpMarks || {} }, frames: o.cmpFrames },
        { t: 'ex', text: '말이 여기저기 흩어져 있어도 모양을 보면 찾을 수 있어요.', board: { pos: o.mixPos },
          frames: [{ marks: {}, cap: '여러 말이 섞여 있어요.' }, { marks: M(where(CH.board(o.mixPos), w).concat(where(CH.board(o.mixPos), bk)), 'ring'), cap: jo(PN[t], '은') + ' 여기!' }] },
        { t: 'do', task: clickQ('백 ' + jo(PN[t], '을') + ' 하나 눌러 보세요.', where(CH.board(S0), w), { pos: S0 }, [HOW[t], { text: '반짝이는 칸을 봐요.', marks: M(where(CH.board(S0), w), 'hint') }], { why: function (s) { var p = pcAt(CH.board(S0), s); return { text: p === '.' ? '빈칸이에요.' : '그 말은 ' + jo(pName(p), '이에요') + '.', marks: M([s], 'bad') }; } }) },
        { t: 'do', task: function (R) { return findPieceQ(R, bk, 6); } }
      ],
      practice: { n: 8, gen: function (R) {
        var k = R.int(4);
        if (k === 0) return findPieceQ(R, R.int(2) ? w : bk, 7);
        if (k === 1 && learned.length > 1) return nameQ(R, learned);
        if (k === 2) return isItQ(R, t, KINDS);
        return pickQ('한 편에 ' + jo(PN[t], '은') + ' 처음에 몇 개 있나요?', ['1개', '2개', '8개'], o.n + '개', { pos: S0, marks: M(where(CH.board(S0), w), 'ring') }, ['백 쪽 동그라미를 세어 봐요.']);
      } },
      sum: o.sum };
  }
  var u2 = [
    { id: 'sides', title: '백과 흑', kind: 'easy',
      screens: [
        { t: 'say', text: '체스는 두 편이 겨뤄요. 밝은 색 말의 편을 <b>백</b>(하양), 어두운 색 말의 편을 <b>흑</b>(검정)이라고 해요.', board: { pos: S0, coords: true } },
        { t: 'say', text: '처음에 <b>백</b>은 1번·2번 가로줄에, <b>흑</b>은 7번·8번 가로줄에 서요. 두 편이 마주 보고 있어요.', board: { pos: S0, marks: J(M(rank(1).concat(rank(2)), 'ok'), M(rank(7).concat(rank(8)), 'hi')) } },
        { t: 'say', text: '체스는 언제나 <b>백이 먼저</b> 둬요. 그다음 흑, 다시 백 … 한 번씩 <b>번갈아</b> 말을 움직여요. 한 번에 말 하나만 움직여요.', board: { pos: S0 } },
        { t: 'say', text: '움직이지 않고 건너뛸 수는 없어요. 내 차례가 오면 꼭 한 번 말을 움직여야 해요.', board: { pos: S0 } },
        { t: 'ex', text: '처음 세 번을 보여 줄게요.', board: { pos: S0 },
          frames: [{ mv: ['e2', 'e4'], marks: { e4: 'hi' }, cap: '① 백이 먼저 한 번' }, { mv: ['e7', 'e5'], marks: { e5: 'hi' }, cap: '② 그다음 흑이 한 번' }, { mv: ['g1', 'f3'], marks: { f3: 'hi' }, cap: '③ 다시 백이 한 번 … 이렇게 번갈아요.' }] },
        { t: 'ex', text: '백 말과 흑 말을 나누어 봐요.', board: { pos: S0 },
          frames: [{ marks: M(rank(1).concat(rank(2)), 'ring'), cap: '백 말 16개 (밝은 색)' }, { marks: M(rank(7).concat(rank(8)), 'ring'), cap: '흑 말 16개 (어두운 색)' }] },
        { t: 'do', task: clickQ('백 말을 아무거나 하나 눌러 보세요.', rank(1).concat(rank(2)), { pos: S0 }, ['밝은 색 말이에요. 판 아래쪽에 있어요.']) },
        { t: 'do', task: pickQ('체스는 누가 먼저 두나요?', ['백', '흑', '아무나'], '백', { pos: S0 }, ['밝은 색 편이에요.']) }
      ],
      practice: { n: 8, gen: function (R) {
        var k = R.int(4);
        if (k === 0) { var b = scatterAll(R, 8, ['K', 'k']), wantW = R.int(2) === 1, ans = ALL.filter(function (s) { var p = pcAt(b, s); return p !== '.' && CH.isW(p) === wantW; });
          return clickQ((wantW ? '백' : '흑') + ' 말을 하나 눌러요.', ans, { pos: b }, [(wantW ? '밝은' : '어두운') + ' 색 말이에요.'], { why: function (s) { var p = pcAt(b, s); return { text: p === '.' ? '빈칸이에요.' : '그 말은 ' + sideName(p) + ' 말이에요.', marks: M([s], 'bad') }; } }); }
        if (k === 1) { var b2 = scatterAll(R, 6), s2 = R.pick(ALL.filter(function (s) { return pcAt(b2, s) !== '.'; })); return pickQ('동그라미 안의 말은 어느 편인가요?', ['백', '흑'], sideName(pcAt(b2, s2)), { pos: b2, marks: M([s2], 'ring') }, ['밝은 색은 백, 어두운 색은 흑이에요.']); }
        if (k === 2) return pickQ('체스는 누가 먼저 두나요?', ['백', '흑', '아무나'], '백', { pos: S0 }, ['밝은 색 편이에요.']);
        var wq = R.int(2) === 1; return pickQ('처음에 ' + (wq ? '백' : '흑') + ' 말은 몇 번 가로줄에 서나요?', ['1번·2번', '3번·4번', '7번·8번'], wq ? '1번·2번' : '7번·8번', { pos: S0 }, ['백은 아래(내 쪽), 흑은 위예요.']);
      } },
      sum: '밝은 색 편은 <b>백</b>, 어두운 색 편은 <b>흑</b>이에요. <b>백이 먼저</b> 두고, 한 번씩 번갈아 말 하나를 움직여요.' },
    pieceLesson({ id: 'king', t: 'K', home: ['e1', 'e8'], n: 1,
      look: '이 말은 <b>킹</b>(king, 왕)이에요. 머리 위에 <b>십자가</b>가 있고, 체스말 가운데 가장 키가 커요.',
      role: '킹은 체스에서 <b>가장 중요한 말</b>이에요. 킹이 잡히게 되면(<b>체크메이트</b>) 게임에서 져요. 그래서 체스는 내 킹을 지키고 상대 킹을 노리는 놀이예요.',
      count: '킹은 한 편에 <b>1개</b>씩이에요. 처음 자리는 백 킹 <b>e1</b>, 흑 킹 <b>e8</b>이에요.',
      cmpText: '킹과 퀸은 생김새가 비슷해서 헷갈리기 쉬워요. 머리를 봐요.', cmpPos: '8/8/8/8/3KQ3/8/8/8',
      cmpFrames: [{ marks: { d4: 'ring' }, cap: '킹: 머리 위에 십자가 ✚' }, { marks: { e4: 'ring' }, cap: '퀸: 뾰족뾰족한 왕관 👑' }],
      mixPos: '8/2n5/5k2/1P6/4K3/6b1/2R5/8',
      sum: '<b>킹</b>은 십자가가 있는 가장 중요한 말이에요. 한 편에 1개, 처음 자리는 e1(백)·e8(흑)이에요.' }),
    pieceLesson({ id: 'queen', t: 'Q', home: ['d1', 'd8'], n: 1,
      look: '이 말은 <b>퀸</b>(queen, 여왕)이에요. <b>뾰족뾰족한 왕관</b>을 썼고, 왕관 끝에 작은 구슬이 달려 있어요.',
      role: '퀸은 체스에서 <b>가장 힘센 말</b>이에요. 여러 방향으로 멀리 갈 수 있어서 아주 쓸모가 많아요. (움직이는 법은 2마당에서 배워요.)',
      count: '퀸은 한 편에 <b>1개</b>씩이에요. 처음 자리는 백 퀸 <b>d1</b>, 흑 퀸 <b>d8</b>이에요. 킹 바로 옆이에요.',
      cmpText: '퀸과 킹을 다시 견주어 봐요.', cmpPos: '8/8/8/8/3QK3/8/8/8',
      cmpFrames: [{ marks: { d4: 'ring' }, cap: '퀸: 뾰족한 왕관과 구슬' }, { marks: { e4: 'ring' }, cap: '킹: 둥근 머리 위 십자가' }],
      mixPos: '8/1q6/5p2/2N5/6Q1/1b6/4K3/8',
      sum: '<b>퀸</b>은 뾰족한 왕관을 쓴 가장 힘센 말이에요. 한 편에 1개, 처음 자리는 d1(백)·d8(흑)이에요.' }),
    pieceLesson({ id: 'rook', t: 'R', home: ['a1', 'h1', 'a8', 'h8'], n: 2,
      look: '이 말은 <b>룩</b>(rook)이에요. 옛날 <b>성(탑)</b>처럼 생겼고, 위쪽이 울퉁불퉁해요.',
      role: '룩은 퀸 다음으로 힘센 말이에요. 곧게 쭉쭉 나아가는 말이에요. (움직이는 법은 2마당에서 배워요.)',
      count: '룩은 한 편에 <b>2개</b>씩이에요. 처음에는 판의 <b>네 귀퉁이</b>(a1, h1, a8, h8)에 있어요.',
      cmpText: '룩과 다른 말을 견주어 봐요.', cmpPos: '8/8/8/8/2R1P3/8/8/8',
      cmpFrames: [{ marks: { c4: 'ring' }, cap: '룩: 울퉁불퉁한 성벽 모양 머리' }, { marks: { e4: 'ring' }, cap: '폰: 동그란 머리' }],
      mixPos: '8/6r1/2k5/8/3B4/1R6/5N2/8',
      sum: '<b>룩</b>은 성(탑) 모양 말이에요. 한 편에 2개, 처음에는 네 귀퉁이에 있어요.' }),
    pieceLesson({ id: 'bishop', t: 'B', home: ['c1', 'f1', 'c8', 'f8'], n: 2,
      look: '이 말은 <b>비숍</b>(bishop)이에요. 길쭉한 <b>모자</b>를 썼는데, 모자에 <b>비스듬한 홈</b>이 파여 있고 꼭대기에 작은 공이 있어요.',
      role: '비숍은 비스듬히(대각선으로) 다니는 말이에요. 앞에서 배운 대각선이 비숍의 길이에요. (움직이는 법은 2마당에서 배워요.)',
      count: '비숍은 한 편에 <b>2개</b>씩이에요. 처음 자리는 백 <b>c1·f1</b>, 흑 <b>c8·f8</b>이에요.',
      cmpText: '비숍과 폰은 헷갈리기 쉬워요. 머리를 봐요.', cmpPos: '8/8/8/8/2B1P3/8/8/8',
      cmpFrames: [{ marks: { c4: 'ring' }, cap: '비숍: 길쭉한 모자 + 비스듬한 홈' }, { marks: { e4: 'ring' }, cap: '폰: 동그란 머리, 더 작아요' }],
      mixPos: '8/1b6/4n3/2P5/5B2/8/2K5/8',
      sum: '<b>비숍</b>은 홈이 파인 모자를 쓴 말이에요. 한 편에 2개, 처음 자리는 c1·f1(백), c8·f8(흑)이에요.' }),
    pieceLesson({ id: 'knight', t: 'N', home: ['b1', 'g1', 'b8', 'g8'], n: 2,
      look: '이 말은 <b>나이트</b>(knight, 기사)예요. <b>말(동물) 머리</b> 모양이라 찾기 쉬워요.',
      role: '나이트는 다른 말을 <b>뛰어넘을 수 있는</b> 특별한 말이에요. (움직이는 법은 2마당에서 배워요.)',
      count: '나이트는 한 편에 <b>2개</b>씩이에요. 처음 자리는 룩 바로 옆, 백 <b>b1·g1</b>, 흑 <b>b8·g8</b>이에요.',
      cmpText: '나이트는 말 머리가 옆을 보고 있어요.', cmpPos: '8/8/8/8/2N2n2/8/8/8',
      cmpFrames: [{ marks: { c4: 'ring' }, cap: '백 나이트' }, { marks: { f4: 'ring' }, cap: '흑 나이트 — 색만 다르고 모양은 같아요.' }],
      mixPos: '8/5n2/2r5/8/1N4b1/3P4/6K1/8',
      sum: '<b>나이트</b>는 말 머리 모양이에요. 한 편에 2개, 처음 자리는 b1·g1(백), b8·g8(흑)이에요.' }),
    pieceLesson({ id: 'pawn', t: 'P', home: rank(2).concat(rank(7)), n: 8,
      look: '이 말은 <b>폰</b>(pawn, 병사)이에요. 머리가 <b>동그란 공</b> 모양이고, 체스말 가운데 가장 작아요.',
      role: '폰은 가장 작지만, 판 끝까지 가면 다른 말로 바뀔 수 있는 놀라운 말이에요. (4마당에서 배워요.)',
      count: '폰은 한 편에 <b>8개</b>로 가장 많아요. 처음에 백 폰은 <b>2번 가로줄</b>, 흑 폰은 <b>7번 가로줄</b>에 한 줄로 서요.',
      cmpText: '폰과 비숍을 다시 견주어 봐요.', cmpPos: '8/8/8/8/2P1B3/8/8/8',
      cmpFrames: [{ marks: { c4: 'ring' }, cap: '폰: 작고 동그란 머리' }, { marks: { e4: 'ring' }, cap: '비숍: 크고 홈이 파인 모자' }],
      mixPos: '8/2p3p1/5k2/1N6/3P4/6R1/1P6/8',
      sum: '<b>폰</b>은 머리가 동그란 가장 작은 말이에요. 한 편에 8개, 처음엔 2번(백)·7번(흑) 가로줄에 서요.' }),
    { id: 'count', title: '말은 모두 몇 개', kind: 'easy',
      screens: [
        { t: 'say', text: '한 편의 말을 모두 세어 봐요. 폰 8 + 룩 2 + 나이트 2 + 비숍 2 + 퀸 1 + 킹 1 = <b>16개</b>예요.', board: { pos: S0, marks: M(rank(1).concat(rank(2)), 'ring') } },
        { t: 'say', text: '백 16개, 흑 16개. 두 편을 합하면 <b>32개</b>예요.', board: { pos: S0 } },
        { t: 'say', text: '두 편의 말은 개수도 모양도 똑같아요. 색만 달라요. 그래서 공평한 놀이예요.', board: { pos: S0 } },
        { t: 'ex', text: '백 말을 종류별로 세어 봐요.', board: { pos: S0 },
          frames: [['P', '폰 8개'], ['R', '룩 2개'], ['N', '나이트 2개'], ['B', '비숍 2개'], ['Q', '퀸 1개'], ['K', '킹 1개']].map(function (x) { return { marks: M(where(CH.board(S0), x[0]), 'ring'), cap: x[1] }; }).concat([{ marks: M(rank(1).concat(rank(2)), 'ok'), cap: '모두 16개!' }]) },
        { t: 'ex', text: '말이 흩어져 있을 때도 세어 볼 수 있어요.', board: { pos: '8/2n2n2/8/1P4P1/3N4/8/5P2/8' },
          frames: [{ marks: M(['c7', 'f7'], 'ring'), cap: '흑 나이트 2개' }, { marks: M(['b5', 'g5', 'f2'], 'ring'), cap: '백 폰 3개' }, { marks: M(['d4'], 'ring'), cap: '백 나이트 1개' }] },
        { t: 'do', task: pickQ('한 편의 말은 모두 몇 개인가요?', ['8개', '16개', '32개'], '16개', { pos: S0, marks: M(rank(1).concat(rank(2)), 'ring') }, ['백 말만 세어요. 두 줄에 8개씩이에요.']) },
        { t: 'do', task: pickQ('두 편의 말을 합하면 모두 몇 개인가요?', ['16개', '24개', '32개'], '32개', { pos: S0 }, ['16개 + 16개']) }
      ],
      practice: { n: 8, gen: function (R) {
        var k = R.int(3), t = R.pick(KINDS), c = R.int(2) ? t : t.toLowerCase();
        if (k === 0) { var n = ({ P: 8, R: 2, N: 2, B: 2, Q: 1, K: 1 })[t]; return pickQ('처음에 ' + jo(pName(c), '은') + ' 몇 개인가요?', R.opts(n + '개', ['1개', '2개', '4개', '8개']), n + '개', { pos: S0 }, [HOW[t] + ' 판에서 세어 봐요.', { text: '반짝이는 말을 세어요.', marks: M(where(CH.board(S0), c), 'ring') }]); }
        if (k === 1) { var cnt = R.int(4) + 1, l = []; for (var j = 0; j < cnt; j++) l.push(c); for (j = 0; j < 4; j++) l.push(R.pick(KINDS.concat(KINDS.map(function (x) { return x.toLowerCase(); })).filter(function (x) { return x !== c; }))); var b = R.scatter(l);
          return pickQ('판 위에 <b>' + pName(c) + '</b>' + jo(pName(c), '은').slice(pName(c).length) + ' 몇 개 있나요?', R.opts(cnt + '개', ['1개', '2개', '3개', '4개', '5개']), cnt + '개', { pos: b }, [HOW[t] + ' ' + sideName(c) + ' 말만 세요.', { text: '반짝이는 말을 세어요.', marks: M(where(b, c), 'ring') }]); }
        return pickQ(R.pick(['한 편의 말은 모두 몇 개인가요?', '두 편의 말을 합하면 몇 개인가요?']), ['8개', '16개', '32개'], null, { pos: S0 }, ['한 편은 두 줄에 8개씩이에요.']);
      } },
      sum: '한 편의 말은 <b>16개</b>(폰 8, 룩 2, 나이트 2, 비숍 2, 퀸 1, 킹 1), 두 편을 합하면 <b>32개</b>예요.' },
    { id: 'review-names', title: '복습: 말 이름 맞히기', kind: 'easy',
      screens: [
        { t: 'say', text: '지금까지 여섯 가지 말을 배웠어요. 모양과 이름을 한 번 더 정리해요.', big: ['K', 'Q', 'R', 'B', 'N', 'P'], board: null },
        { t: 'ex', text: '하나씩 이름을 불러 볼게요.', board: { pos: '8/8/8/8/8/8/KQRBNP2/8' },
          frames: KINDS.map(function (t, k) { var s = F[k] + '2', m = {}; m[s] = 'ring'; return { marks: J(m, L(F[k] + '3', PN[t])), cap: PN[t] + ' — ' + HOW[t] }; }) },
        { t: 'do', task: function (R) { return nameQ(R, KINDS); } }
      ],
      practice: { n: 12, gen: function (R) { return R.int(3) ? nameQ(R, KINDS) : findPieceQ(R, R.pick(KINDS.concat(KINDS.map(function (x) { return x.toLowerCase(); }))), 8); } },
      sum: '<b>킹</b> 십자가 · <b>퀸</b> 뾰족한 왕관 · <b>룩</b> 성 · <b>비숍</b> 홈 파인 모자 · <b>나이트</b> 말 머리 · <b>폰</b> 동그란 머리' }
  ];
  /* ganswer null → 질문 글에서 정함 */
  u1[3].practice.gen = (function (g) { return function (R) { var T = g(R); if (T.ans === null) T.ans = /건너편/.test(T.q) ? '8번' : '1번'; return T; }; })(u1[3].practice.gen);
  u2[7].practice.gen = (function (g) { return function (R) { var T = g(R); if (T.ans === null) T.ans = /합하면/.test(T.q) ? '32개' : '16개'; return T; }; })(u2[7].practice.gen);

  /* ===== 3단원 처음 배치 ===== */
  var B0 = CH.board(S0);
  function startWith(keep) { return B0.map(function (c) { return keep.indexOf(c.toUpperCase()) >= 0 ? c : '.'; }); }
  function placeQ(q, have, need, hint, extra) {
    var tray = []; Object.keys(need).forEach(function (s) { tray.push(need[s]); });
    return Object.assign({ type: 'place', q: q, board: { pos: have }, tray: tray, need: need, hint: hint,
      after: null, why: function (s, c) { var ok = Object.keys(need).filter(function (x) { return need[x] === c; }); return { text: pName(c) + '의 자리가 아니에요. 그 칸은 ' + jo(s, '이에요') + '.', marks: M([s], 'bad') }; } }, extra || {});
  }
  function needOf(kinds, side) { var o = {}; ALL.forEach(function (s) { var c = pcAt(B0, s); if (c !== '.' && kinds.indexOf(c.toUpperCase()) >= 0 && (side === undefined || CH.isW(c) === side)) o[s] = c; }); return o; }
  function setupLesson(o) {
    var before = o.before, keep = before.concat([]);
    return { id: o.id, title: o.title, kind: 'easy',
      screens: o.say.map(function (x) { return { t: 'say', text: x[0], board: { pos: startWith(x[1] || before.concat([o.t])), marks: x[2] || {} } }; }).concat([
        { t: 'ex', text: o.exText, board: { pos: startWith(before) },
          frames: o.frames },
        { t: 'do', task: placeQ('백 ' + jo(o.name, '을') + ' 처음 자리에 놓아 보세요. 아래에서 말을 고르고 칸을 눌러요.', startWith(before), needOf([o.t], true), [o.hint, { text: '반짝이는 칸이에요.', marks: M(Object.keys(needOf([o.t], true)), 'hint') }]) },
        { t: 'do', task: placeQ('이번엔 흑 ' + jo(o.name, '을') + ' 놓아 보세요.', startWith(before.concat([])).map(function (c, i) { return needOf([o.t], true)[CH.name(i)] || c; }), needOf([o.t], false), [o.hint.replace('1번', '8번'), { text: '반짝이는 칸이에요.', marks: M(Object.keys(needOf([o.t], false)), 'hint') }]) }
      ]),
      practice: { n: 6, gen: function (R) {
        var k = R.int(3);
        if (k === 0) { var sd = R.int(2) === 1, nd = needOf([o.t], sd), have = startWith(before).map(function (c, i) { return needOf([o.t], !sd)[CH.name(i)] || c; });
          return placeQ((sd ? '백' : '흑') + ' ' + jo(o.name, '을') + ' 처음 자리에 놓아요.', have, nd, [o.hint, { text: '반짝이는 칸이에요.', marks: M(Object.keys(nd), 'hint') }]); }
        if (k === 1) { var sd2 = R.int(2) === 1, ans = Object.keys(needOf([o.t], sd2)).sort().join('과 ');
          return pickQ((sd2 ? '백' : '흑') + ' ' + o.name + '의 처음 자리는 어디인가요?', R.opts(ans, o.wrongs.map(function (w) { return sd2 ? w : w.replace(/1/g, '8'); })), ans, { pos: startWith(before) }, [o.hint]); }
        return o.extraQ ? o.extraQ(R) : pickQ(jo(o.name, '은') + ' 한 편에 몇 개인가요?', ['1개', '2개', '8개'], Object.keys(needOf([o.t], true)).length + '개', { pos: S0 }, ['처음 판에서 세어 봐요.']);
      } },
      sum: o.sum };
  }
  var u3 = [
    setupLesson({ id: 'setup-rook', title: '처음 자리 ① 룩', t: 'R', name: '룩', before: [],
      say: [['이제 말을 처음 자리에 놓는 법을 배워요. 판을 바르게 놓고(오른쪽은 밝게!), 백은 내 쪽(1·2번 가로줄)에 놓아요.', []],
        ['<b>룩</b>은 판의 <b>네 귀퉁이</b>에 놓아요. 백 룩은 <b>a1·h1</b>, 흑 룩은 <b>a8·h8</b>이에요. 룩은 성처럼 판의 끝을 지켜요.', ['R'], M(CORNERS, 'ring')]],
      exText: '룩 네 개가 귀퉁이에 놓이는 모습을 봐요.',
      frames: [{ pos: 'r7/8/8/8/8/8/8/8', cap: 'a8에 흑 룩' }, { pos: 'r6r/8/8/8/8/8/8/8', cap: 'h8에 흑 룩' }, { pos: 'r6r/8/8/8/8/8/8/R7', cap: 'a1에 백 룩' }, { pos: 'r6r/8/8/8/8/8/8/R6R', cap: 'h1에 백 룩. 네 귀퉁이 모두 룩!' }],
      hint: '룩은 1번 가로줄의 양쪽 끝(귀퉁이)에 서요.', wrongs: ['b1과 g1', 'c1과 f1', 'd1과 e1'],
      sum: '<b>룩</b>은 네 귀퉁이에 놓아요: 백 a1·h1, 흑 a8·h8.' }),
    setupLesson({ id: 'setup-knight', title: '처음 자리 ② 나이트', t: 'N', name: '나이트', before: ['R'],
      say: [['룩을 놓았으면 그다음은 <b>나이트</b>예요. 나이트는 <b>룩 바로 옆</b>, 안쪽으로 한 칸이에요.', ['R']],
        ['백 나이트는 <b>b1·g1</b>, 흑 나이트는 <b>b8·g8</b>이에요. 성(룩) 옆을 말 탄 기사(나이트)가 지켜요.', ['R', 'N'], M(['b1', 'g1', 'b8', 'g8'], 'ring')]],
      exText: '나이트가 룩 옆에 놓이는 모습을 봐요.',
      frames: [{ pos: 'r6r/8/8/8/8/8/8/RN5R', marks: { b1: 'hi' }, cap: 'a1 룩 옆 b1에 백 나이트' }, { pos: 'r6r/8/8/8/8/8/8/RN4NR', marks: { g1: 'hi' }, cap: 'h1 룩 옆 g1에 백 나이트' }, { pos: 'rn4nr/8/8/8/8/8/8/RN4NR', marks: M(['b8', 'g8'], 'hi'), cap: '흑도 똑같이 b8·g8' }],
      hint: '나이트는 1번 가로줄에서 룩 바로 옆 칸이에요.', wrongs: ['a1과 h1', 'c1과 f1', 'd1과 e1'],
      sum: '<b>나이트</b>는 룩 바로 옆: 백 b1·g1, 흑 b8·g8.' }),
    setupLesson({ id: 'setup-bishop', title: '처음 자리 ③ 비숍', t: 'B', name: '비숍', before: ['R', 'N'],
      say: [['그다음은 <b>비숍</b>이에요. 비숍은 <b>나이트 바로 옆</b>, 또 안쪽으로 한 칸이에요.', ['R', 'N']],
        ['백 비숍은 <b>c1·f1</b>, 흑 비숍은 <b>c8·f8</b>이에요. 바깥부터 <b>룩 – 나이트 – 비숍</b> 차례예요.', ['R', 'N', 'B'], M(['c1', 'f1', 'c8', 'f8'], 'ring')],
        ['재미있는 점: 백 비숍 두 개 가운데 하나는 밝은 칸(f1), 하나는 어두운 칸(c1)에 서요.', ['R', 'N', 'B'], M(['c1', 'f1'], 'ring')]],
      exText: '비숍이 나이트 옆에 놓이는 모습을 봐요.',
      frames: [{ pos: 'rn4nr/8/8/8/8/8/8/RNB3NR', marks: { c1: 'hi' }, cap: 'c1에 백 비숍' }, { pos: 'rn4nr/8/8/8/8/8/8/RNB2BNR', marks: { f1: 'hi' }, cap: 'f1에 백 비숍' }, { pos: 'rnb2bnr/8/8/8/8/8/8/RNB2BNR', marks: M(['c8', 'f8'], 'hi'), cap: '흑도 c8·f8. 룩–나이트–비숍!' }],
      hint: '비숍은 1번 가로줄에서 나이트 바로 옆(안쪽) 칸이에요.', wrongs: ['a1과 h1', 'b1과 g1', 'd1과 e1'],
      extraQ: function (R) { return pickQ('바깥(귀퉁이)부터 안쪽으로, 말이 놓이는 차례로 알맞은 것은?', R.shuffle(['룩 – 나이트 – 비숍', '나이트 – 룩 – 비숍', '비숍 – 나이트 – 룩']), '룩 – 나이트 – 비숍', { pos: startWith(['R', 'N', 'B']) }, ['귀퉁이에는 성(룩)이 서요.']); },
      sum: '<b>비숍</b>은 나이트 바로 옆: 백 c1·f1, 흑 c8·f8. 바깥부터 룩–나이트–비숍!' }),
    { id: 'setup-qk', title: '처음 자리 ④ 퀸과 킹', kind: 'easy',
      screens: [
        { t: 'say', text: '이제 가운데에 빈칸이 두 개 남았어요(d1·e1). 여기에 <b>퀸</b>과 <b>킹</b>이 서요.', board: { pos: startWith(['R', 'N', 'B']), marks: M(['d1', 'e1', 'd8', 'e8'], 'ring') } },
        { t: 'say', text: '약속: <b>퀸은 자기 색 칸에</b> 서요. 백 퀸은 밝은 칸 <b>d1</b>, 흑 퀸은 어두운 칸 <b>d8</b>이에요.', board: { pos: startWith(['R', 'N', 'B', 'Q']), marks: M(['d1', 'd8'], 'ring') } },
        { t: 'say', text: '킹은 남은 칸에 서요. 백 킹 <b>e1</b>, 흑 킹 <b>e8</b>. 두 퀸이 같은 세로줄(d)에서, 두 킹이 같은 세로줄(e)에서 마주 봐요.', board: { pos: startWith(['R', 'N', 'B', 'Q', 'K']), marks: M(['e1', 'e8'], 'ring') } },
        { t: 'say', text: '외우는 말: <b>“퀸은 자기 색을 좋아해요.”</b> 하얀 퀸 → 하얀(밝은) 칸, 까만 퀸 → 까만(어두운) 칸.', board: { pos: startWith(['R', 'N', 'B', 'Q', 'K']), marks: M(['d1', 'd8'], 'hi') } },
        { t: 'ex', text: '퀸과 킹이 놓이는 모습을 봐요.', board: { pos: startWith(['R', 'N', 'B']) },
          frames: [{ pos: 'rnb2bnr/8/8/8/8/8/8/RNBQ1BNR', marks: { d1: 'hi' }, cap: '백 퀸 → 밝은 칸 d1' }, { pos: 'rnbq1bnr/8/8/8/8/8/8/RNBQ1BNR', marks: { d8: 'hi' }, cap: '흑 퀸 → 어두운 칸 d8' }, { pos: 'rnbq1bnr/8/8/8/8/8/8/RNBQKBNR', marks: { e1: 'hi' }, cap: '백 킹 → e1' }, { pos: 'rnbqkbnr/8/8/8/8/8/8/RNBQKBNR', marks: { e8: 'hi' }, cap: '흑 킹 → e8' }] },
        { t: 'ex', text: '퀸과 킹 자리를 바꿔 놓는 실수를 많이 해요. 잘못된 모습을 봐요.', board: { pos: 'rnbqkbnr/8/8/8/8/8/8/RNBKQBNR' },
          frames: [{ marks: M(['d1', 'e1'], 'bad'), cap: '✗ 백 퀸이 어두운 칸(e1)에 있어요.' }, { pos: 'rnbqkbnr/8/8/8/8/8/8/RNBQKBNR', marks: M(['d1', 'e1'], 'ok'), cap: '✓ 백 퀸은 밝은 칸 d1!' }] },
        { t: 'do', task: placeQ('백 퀸과 백 킹을 놓아 보세요.', startWith(['R', 'N', 'B']), { d1: 'Q', e1: 'K' }, ['퀸은 자기 색 칸에! 백 퀸은 밝은 칸이에요.', { text: '반짝이는 칸이에요.', marks: M(['d1', 'e1'], 'hint') }]) },
        { t: 'do', task: placeQ('흑 퀸과 흑 킹을 놓아 보세요.', startWith(['R', 'N', 'B']).map(function (c, i) { return ({ 59: 'Q', 60: 'K' })[i] || c; }), { d8: 'q', e8: 'k' }, ['흑 퀸은 어두운 칸이에요.', { text: '반짝이는 칸이에요.', marks: M(['d8', 'e8'], 'hint') }]) }
      ],
      practice: { n: 8, gen: function (R) {
        var k = R.int(4), sd = R.int(2) === 1;
        if (k === 0) return placeQ((sd ? '백' : '흑') + ' 퀸과 킹을 놓아요.', startWith(['R', 'N', 'B']), sd ? { d1: 'Q', e1: 'K' } : { d8: 'q', e8: 'k' }, ['퀸은 자기 색 칸에!', { text: '반짝이는 칸이에요.', marks: M(sd ? ['d1', 'e1'] : ['d8', 'e8'], 'hint') }]);
        if (k === 1) return pickQ((sd ? '백' : '흑') + ' 퀸의 처음 자리는?', R.shuffle(sd ? ['d1', 'e1', 'd8'] : ['d8', 'e8', 'd1']), sd ? 'd1' : 'd8', { pos: startWith(['R', 'N', 'B']) }, ['퀸은 자기 색 칸에 서요. ' + (sd ? '백 퀸은 밝은 칸' : '흑 퀸은 어두운 칸') + '이에요.']);
        if (k === 2) return pickQ((sd ? '백' : '흑') + ' 퀸은 어떤 색 칸에 서나요?', ['밝은 칸', '어두운 칸'], sd ? '밝은 칸' : '어두운 칸', { pos: S0 }, ['“퀸은 자기 색을 좋아해요.”']);
        var ok = R.int(2) === 1, b = CH.board(S0); if (!ok) { var r = sd ? 7 : 0; var t = b[r * 8 + 3]; b[r * 8 + 3] = b[r * 8 + 4]; b[r * 8 + 4] = t; }
        return pickQ('퀸과 킹이 바르게 놓였나요?', ['바르게 놓였어요', '퀸과 킹이 바뀌었어요'], ok ? '바르게 놓였어요' : '퀸과 킹이 바뀌었어요', { pos: b, marks: M(['d1', 'e1', 'd8', 'e8'], 'ring') }, ['백 퀸은 밝은 칸, 흑 퀸은 어두운 칸에 있어야 해요.']);
      } },
      sum: '<b>퀸은 자기 색 칸에</b>(백 d1, 흑 d8), <b>킹</b>은 그 옆(백 e1, 흑 e8)에 서요.' },
    { id: 'setup-pawn', title: '처음 자리 ⑤ 폰', kind: 'easy',
      screens: [
        { t: 'say', text: '마지막으로 <b>폰</b>을 놓아요. 폰은 다른 말들 <b>바로 앞줄</b>에 한 줄로 서요.', board: { pos: startWith(['R', 'N', 'B', 'Q', 'K']), marks: M(rank(2).concat(rank(7)), 'ring') } },
        { t: 'say', text: '백 폰은 <b>2번 가로줄</b>(a2~h2) 8칸, 흑 폰은 <b>7번 가로줄</b>(a7~h7) 8칸을 꽉 채워요.', board: { pos: S0, marks: M(rank(2).concat(rank(7)), 'hi') } },
        { t: 'say', text: '폰은 다른 말들을 앞에서 지켜 주는 벽 같아요. 폰 뒤에 킹·퀸·룩·비숍·나이트가 있어요.', board: { pos: S0 } },
        { t: 'ex', text: '폰이 한 줄로 서는 모습을 봐요.', board: { pos: startWith(['R', 'N', 'B', 'Q', 'K']) },
          frames: [{ pos: 'rnbqkbnr/8/8/8/8/8/PPPPPPPP/RNBQKBNR', marks: M(rank(2), 'hi'), cap: '백 폰 8개 → 2번 가로줄' }, { pos: S0, marks: M(rank(7), 'hi'), cap: '흑 폰 8개 → 7번 가로줄. 처음 배치 완성!' }] },
        { t: 'do', task: placeQ('빠진 백 폰을 놓아 보세요.', CH.board('rnbqkbnr/pppppppp/8/8/8/8/PP1PP1PP/RNBQKBNR'), { c2: 'P', f2: 'P' }, ['백 폰은 2번 가로줄이에요.', { text: '반짝이는 칸이에요.', marks: M(['c2', 'f2'], 'hint') }]) },
        { t: 'do', task: placeQ('빠진 흑 폰을 놓아 보세요.', CH.board('rnbqkbnr/p1ppp1pp/8/8/8/8/PPPPPPPP/RNBQKBNR'), { b7: 'p', f7: 'p' }, ['흑 폰은 7번 가로줄이에요.', { text: '반짝이는 칸이에요.', marks: M(['b7', 'f7'], 'hint') }]) }
      ],
      practice: { n: 6, gen: function (R) {
        var k = R.int(3), sd = R.int(2) === 1;
        if (k < 2) { var row = sd ? rank(2) : rank(7), miss = R.shuffle(row).slice(0, R.int(3) + 2), b = CH.board(S0), nd = {}; miss.forEach(function (s) { nd[s] = pcAt(b, s); b[CH.idx(s)] = '.'; });
          return placeQ('빠진 ' + (sd ? '백' : '흑') + ' 폰을 놓아요.', b, nd, [(sd ? '백 폰은 2번' : '흑 폰은 7번') + ' 가로줄이에요.', { text: '반짝이는 칸이에요.', marks: M(miss, 'hint') }]); }
        return pickQ((sd ? '백' : '흑') + ' 폰은 처음에 몇 번 가로줄에 서나요?', ['1번', '2번', '7번', '8번'], sd ? '2번' : '7번', { pos: S0 }, ['폰은 다른 말들 바로 앞줄이에요.']);
      } },
      sum: '<b>폰</b>은 다른 말들 바로 앞줄: 백 2번 가로줄, 흑 7번 가로줄을 꽉 채워요.' },
    { id: 'setup-all', title: '처음 배치 완성하기', kind: 'one',
      screens: [
        { t: 'say', text: '처음 배치를 모두 정리해요. 판을 바르게(오른쪽은 밝게!) 놓고, 1번 가로줄에 <b>룩 – 나이트 – 비숍 – 퀸 – 킹 – 비숍 – 나이트 – 룩</b>.', board: { pos: S0, marks: M(rank(1), 'ring') } },
        { t: 'say', text: '2번 가로줄에는 폰 8개. 흑도 똑같이 7·8번 가로줄에 놓아요. <b>퀸은 자기 색 칸!</b>', board: { pos: S0 } },
        { t: 'say', text: '처음 배치를 확인하는 세 가지 질문: ① 오른쪽 아래가 밝은 칸인가? ② 귀퉁이에 룩이 있는가? ③ 퀸이 자기 색 칸에 있는가?', board: { pos: S0, marks: J({ h1: 'star' }, M(CORNERS, 'ring'), M(['d1', 'd8'], 'hi')) } },
        { t: 'ex', text: '빈 판에서 처음 배치를 차례로 놓아 볼게요.', board: { pos: E },
          frames: [{ pos: startWith(['R']), cap: '① 룩: 네 귀퉁이' }, { pos: startWith(['R', 'N']), cap: '② 나이트: 룩 옆' }, { pos: startWith(['R', 'N', 'B']), cap: '③ 비숍: 나이트 옆' }, { pos: startWith(['R', 'N', 'B', 'Q']), cap: '④ 퀸: 자기 색 칸' }, { pos: startWith(['R', 'N', 'B', 'Q', 'K']), cap: '⑤ 킹: 남은 칸' }, { pos: S0, cap: '⑥ 폰: 앞줄. 완성!' }] },
        { t: 'ex', text: '틀린 곳 찾기: 무엇이 잘못되었을까요?', board: { pos: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RBNQKBNR' },
          frames: [{ marks: {}, cap: '잘 보세요…' }, { marks: M(['b1', 'c1'], 'bad'), cap: '나이트와 비숍 자리가 바뀌었어요!' }, { pos: S0, marks: M(['b1', 'c1'], 'ok'), cap: '바르게: 룩–나이트–비숍' }] },
        { t: 'do', task: placeQ('백 1번 가로줄을 모두 놓아 보세요.', CH.board('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/8'), needOf(['R', 'N', 'B', 'Q', 'K'], true), ['바깥부터 룩–나이트–비숍, 가운데는 퀸(자기 색)과 킹.', { text: '고른 말이 들어갈 칸이 반짝여요.', marks: {} }]) }
      ],
      practice: { n: 8, gen: function (R) {
        var k = R.int(3);
        if (k === 0) { var miss = R.shuffle(ALL.filter(function (s) { return pcAt(B0, s) !== '.' && !/p/i.test(pcAt(B0, s)); })).slice(0, 3), b = B0.slice(), nd = {}; miss.forEach(function (s) { nd[s] = pcAt(B0, s); b[CH.idx(s)] = '.'; });
          return placeQ('빠진 말을 처음 자리에 놓아요.', b, nd, ['바깥부터 룩–나이트–비숍–퀸–킹–비숍–나이트–룩', { text: '빈칸을 봐요.', marks: M(miss, 'ring') }]); }
        var pairs = [['b1', 'c1'], ['f1', 'g1'], ['d1', 'e1'], ['a1', 'b1'], ['b8', 'c8'], ['d8', 'e8'], ['f8', 'g8'], ['g1', 'h1'], ['c8', 'b8']], pr = R.pick(pairs), b2 = B0.slice(), i1 = CH.idx(pr[0]), i2 = CH.idx(pr[1]), t = b2[i1]; b2[i1] = b2[i2]; b2[i2] = t;
        if (k === 1) return clickQ('처음 배치에서 자리가 바뀐 말 두 개를 찾아 눌러요.', pr, { pos: b2 }, ['1번·8번 가로줄을 바깥부터 차례로 읽어 봐요: 룩–나이트–비숍–퀸–킹…', { text: '이 줄을 잘 봐요.', marks: M(rank(+pr[0][1]), 'row') }], { all: true, why: function (s) { return { text: '그 말은 바른 자리에 있어요.', marks: M([s], 'bad') }; } });
        var ok = R.int(2) === 1; return pickQ('이 처음 배치는 바른가요?', ['바르게 놓였어요', '틀린 곳이 있어요'], ok ? '바르게 놓였어요' : '틀린 곳이 있어요', { pos: ok ? B0 : b2 }, ['세 가지 질문: 오른쪽 아래 밝은 칸? 귀퉁이에 룩? 퀸은 자기 색?', '1번·8번 가로줄을 바깥부터 차례로 읽어 봐요.']);
      } },
      sum: '1번 가로줄: <b>룩–나이트–비숍–퀸–킹–비숍–나이트–룩</b>, 2번 가로줄: 폰 8개. 흑도 똑같이! 퀸은 자기 색 칸.' }
  ];
  /* setup-all 따라 하기: 고른 말이 들어갈 칸을 힌트로 보여 줌(learn.js의 answerMarks) */

  window.MADANG = { id: 'm1', no: 1, title: '체스판과 체스말', rank: '폰', rankPc: 'P', examN: 15,
    units: [{ title: '체스판', lessons: u1 }, { title: '체스말 만나기', lessons: u2 }, { title: '처음 배치', lessons: u3 }] };
})();
