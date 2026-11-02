/* 체스 학습관 6마당 · 경기 운영 (27차시) — window.MADANG
   기보·오프닝·중반·엔드게임·비기는 규칙·대국 예절, 인공지능 7~10단계. 오프닝 줄기는 기보(SAN)로 적고 check.js가 끝까지 두어 확인함. */
(function () {
  'use strict';
  var CH = window.CH, PN = window.PIECES.NAME, jo = window.PIECES.jo, AI = window.CAI, F = 'abcdefgh';
  var E = '8/8/8/8/8/8/8/8', S0 = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
  var ALL = []; for (var i = 0; i < 64; i++) ALL.push(CH.name(i));
  function sqs(fn) { return ALL.filter(fn); }
  function M(list, v) { var o = {}; list.forEach(function (s) { o[s] = v; }); return o; }
  function J() { var o = {}; [].forEach.call(arguments, function (m) { Object.keys(m || {}).forEach(function (k) { o[k] = (o[k] || []).concat(Array.isArray(m[k]) ? m[k] : [m[k]]); }); }); return o; }
  function L(s, t) { var o = {}; o[s] = { t: 'label', s: t, small: 1 }; return o; }
  function B(o) { var b = CH.board(E); Object.keys(o).forEach(function (s) { b[CH.idx(s)] = o[s]; }); return b; }
  function P(b, turn, cast) { return { b: b, turn: turn || 'w', cast: cast || '', ep: -1, half: 0, full: 1 }; }
  function pcAt(b, s) { return b[CH.idx(s)]; }
  function kd(a, b) { var x = CH.idx(a), y = CH.idx(b); return Math.max(Math.abs((x >> 3) - (y >> 3)), Math.abs((x & 7) - (y & 7))); }
  function pickQ(q, opts, ans, board, hint, extra) { return Object.assign({ type: 'pick', q: q, opts: opts, ans: ans, board: board, hint: hint }, extra || {}); }
  function clickQ(q, ans, board, hint, extra) { return Object.assign({ type: 'click', q: q, ans: ans, board: board, hint: hint }, extra || {}); }
  function playQ(q, fen, good, hint, extra) { return Object.assign({ type: 'play', q: q, state: fen, board: Object.assign({}, (extra || {}).board || {}), good: good, hint: hint }, extra || {}); }
  function mvName(m) { return [CH.name(m.from), CH.name(m.to)].concat(m.promo ? [m.promo.toUpperCase()] : []); }
  function goods(ms) { var o = [], seen = {}; ms.forEach(function (m) { var g = mvName(m), k = g.join('-'); if (!seen[k]) { seen[k] = 1; o.push(g); } }); return o; }
  function strip(s) { return s.replace(/[+#]/g, ''); }
  function bySan(p, san) { return CH.legal(p).filter(function (m) { return strip(CH.san(p, m)) === strip(san); })[0]; }
  function after(sans) { var p = CH.parse(); (sans ? sans.split(' ') : []).forEach(function (s) { var m = bySan(p, s); if (!m) throw new Error('기보가 맞지 않음 ' + s + ' in ' + sans); p = CH.make(p, m); }); return p; }
  function att(b, s, sd) { return CH.attackers(b, CH.idx(s), sd).map(CH.name); }
  function safe(p, m) { var q = CH.make(p, m), t = CH.name(m.to); return att(q.b, t, 'b').length <= att(q.b, t, 'w').length && !CH.legal(q).some(function (x) { return x.to === m.to && '.PNBRQ'.indexOf(m.pc.toUpperCase()) > '.PNBRQ'.indexOf(x.pc.toUpperCase()); }); }

  /* ===== 27단원 기보 ===== */
  function randPos(R, n) { /* 처음 배치에서 아무 수나 n수쯤 둔 국면(백 차례, 끝나지 않은 국면) */
    for (var t = 0; t < 50; t++) {
      var p = CH.parse(), ok = true;
      for (var k = 0; k < n + (n % 2); k++) { var ms = CH.legal(p).filter(function (m) { return m.pc.toUpperCase() !== 'K'; }); if (!ms.length) { ok = false; break; } p = CH.make(p, R.pick(ms)); if (CH.status(p)) { ok = false; break; } }
      if (ok && p.turn === 'w') return p;
    }
    return CH.parse();
  }
  function readQ(R) {
    for (var t = 0; t < 50; t++) {
      var p = randPos(R, 4 + R.int(14)), ms = CH.legal(p); if (ms.length < 4) continue;
      var pref = ms.filter(function (m) { return m.cap !== '.' || m.flag === 'castle' || m.pc !== 'P'; }), m = R.pick(pref.length && R.int(3) ? pref : ms), san = CH.san(p, m);
      var others = []; ms.forEach(function (x) { var s = CH.san(p, x); if (s !== san && others.indexOf(s) < 0) others.push(s); });
      if (others.length < 3) continue;
      return pickQ('화살표의 수를 <b>기보</b>로 쓰면 어떻게 될까요?', R.opts(san, others), san, { pos: p.b, arrows: [[CH.name(m.from), CH.name(m.to)]], marks: M([CH.name(m.from)], 'ring') },
        ['말 글자(K Q R B N, 폰은 없음) + 도착 칸이에요. 잡으면 x, 체크면 +.', { text: '움직이는 말과 도착 칸을 봐요.', marks: M([CH.name(m.from), CH.name(m.to)], 'hint') }], { kind: 'one' });
    }
  }
  function writeQ(R) {
    for (var t = 0; t < 50; t++) {
      var p = randPos(R, 2 + R.int(12)), ms = CH.legal(p).filter(function (m) { return m.pc !== 'P' || m.cap !== '.' || R.int(2); }); if (!ms.length) continue;
      var m = R.pick(ms), san = CH.san(p, m), same = CH.legal(p).filter(function (x) { return CH.san(p, x) === san; });
      return playQ('기보 <b>' + san + '</b>를 판에 두어요.', CH.fen(p), goods(same), ['첫 글자가 말(K 킹, Q 퀸, R 룩, B 비숍, N 나이트, 없으면 폰), 뒤의 칸이 도착 칸이에요.', { text: '도착 칸이에요.', marks: M([CH.name(m.to)], 'hint') }],
        { kind: 'one', why: function (f, s) { return { text: '그 수의 기보는 다른 글이에요. <b>' + san + '</b>: ' + jo(/^[KQRBN]/.test(san) ? PN[san[0]] : '폰', '이') + ' ' + jo(CH.name(m.to), '으로') + ' 가는 수예요.', marks: M([s], 'bad') }; } });
    }
  }
  /* 오프닝 줄기(백과 흑의 수 차례대로) */
  var LINES = [
    { name: '이탈리안 게임', s: 'e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4', note: '비숍이 c4에서 흑의 약한 f7을 노려요.' },
    { name: '스페인 게임(루이 로페스)', s: 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O', note: '비숍이 e5 폰을 지키는 c6 나이트를 압박해요.' },
    { name: '스코치 게임', s: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4 Nf6 Nc3', note: '일찍 d4로 가운데를 열어요.' },
    { name: '퀸스 갬빗', s: 'd4 d5 c4 e6 Nc3 Nf6 Bg5 Be7 e3', note: 'c4 폰을 내주는 척하며 가운데를 차지해요.' },
    { name: '런던 시스템', s: 'd4 d5 Bf4 Nf6 e3 e6 Nf3 c5 c3', note: '비숍을 f4로 먼저 꺼내는 튼튼한 짜임이에요.' },
    { name: '시실리안 디펜스(백으로)', s: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3', note: '흑이 c5로 맞서는, 세계에서 가장 많이 두는 오프닝 가운데 하나예요.' }
  ];
  function lineTask(L, intro) {
    var sans = L.s.split(' '), nW = Math.ceil(sans.length / 2);
    function ply(p) { return (p.full - 1) * 2 + (p.turn === 'b' ? 1 : 0); }
    var p0 = CH.parse();
    return { type: 'line', kind: 'one', state: CH.START, moves: nW, good: [mvName(bySan(p0, sans[0]))],
      q: (intro || '') + '<b>' + L.name + '</b>를 기보대로 두어요. 흑은 저절로 둬요. 첫 수: <b>' + sans[0] + '</b>',
      reply: function (p) { return bySan(p, sans[ply(p)]); }, goodAt: function (p) { return [mvName(bySan(p, sans[ply(p)]))]; },
      stepQ: function (p) { return '다음 기보: <b>' + sans[ply(p)] + '</b>'; }, ok: L.name + ' 완성! ' + L.note,
      hint: ['기보의 첫 글자가 말, 뒤가 도착 칸이에요(폰은 칸만).', '도착 칸에 갈 수 있는 그 말을 찾아요.'],
      why: function (f, s) { return { text: '기보와 다른 수예요. 기보를 다시 읽어 봐요.', marks: M([s], 'bad') }; } };
  }
  var u27 = [
    { id: 'nota-read', title: '기보 읽기', kind: 'one',
      screens: [
        { t: 'say', text: '<b>기보</b>는 대국에서 둔 수를 글로 적은 것이에요. 기보가 있으면 대국을 다시 두어 볼 수 있어요. 1마당에서 배운 <b>칸 이름</b>을 써요.', board: { pos: S0 } },
        { t: 'say', text: '적는 법: <b>말 글자 + 도착 칸</b>. K 킹, Q 퀸, R 룩, B 비숍, N 나이트(K와 겹쳐서 N). <b>폰은 글자 없이 칸만</b> 적어요. 예: <b>Nf3</b> 나이트가 f3으로, <b>e4</b> 폰이 e4로.', board: { pos: after('e4 e5 Nf3').b, marks: M(['f3', 'e4'], 'hi') } },
        { t: 'say', text: '기호: 잡으면 <b>x</b>(Bxc6), 체크면 <b>+</b>, 메이트면 <b>#</b>, 킹 쪽 캐슬링 <b>O-O</b>, 퀸 쪽 캐슬링 <b>O-O-O</b>, 프로모션 <b>e8=Q</b>. 폰이 잡을 때는 출발 줄 글자를 붙여요(exd5).', board: { pos: S0 } },
        { t: 'say', text: '같은 칸으로 갈 수 있는 같은 말이 둘이면 출발 줄이나 가로줄 번호를 붙여요: <b>Nbd2</b>(b줄 나이트가 d2로), <b>R1e2</b>.', board: { pos: B({ b1: 'N', f3: 'N', e1: 'K', e8: 'k' }), marks: M(['d2'], 'star'), arrows: [['b1', 'd2']] } },
        { t: 'ex', text: '기보로 대국 읽기', board: { pos: S0 },
          frames: [{ mv: ['e2', 'e4'], cap: '1. e4' }, { mv: ['e7', 'e5'], cap: '1… e5' }, { mv: ['g1', 'f3'], cap: '2. Nf3' }, { mv: ['b8', 'c6'], cap: '2… Nc6' }, { mv: ['f1', 'b5'], cap: '3. Bb5' }, { mv: ['a7', 'a6'], cap: '3… a6' }, { mv: ['b5', 'c6'], marks: M(['c6'], 'hi'), cap: '4. Bxc6 (잡기 x)' }] },
        { t: 'do', task: function (R) { return readQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return readQ(R); } },
      sum: '기보 = <b>말 글자 + 도착 칸</b>(폰은 칸만). x 잡기, + 체크, # 메이트, O-O 캐슬링.' },
    { id: 'nota-write', title: '기보 쓰기', kind: 'one',
      screens: [
        { t: 'say', text: '이번에는 거꾸로, 기보를 보고 <b>판에 두어</b> 봐요. 첫 글자로 어떤 말인지, 뒤의 칸으로 어디로 가는지 알아내요.', board: { pos: S0 } },
        { t: 'say', text: '수 번호: 백과 흑이 한 번씩 두면 한 수예요. <b>1. e4 e5</b> = 1수째 백 e4, 흑 e5. 대국 기록지에는 번호, 백의 수, 흑의 수를 한 줄에 적어요.', board: { pos: after('e4 e5').b } },
        { t: 'ex', text: '기보대로', board: { pos: S0 },
          frames: [{ mv: ['d2', 'd4'], cap: 'd4: 폰을 d4로' }, { mv: ['g8', 'f6'], cap: 'Nf6: 흑 나이트를 f6으로' }, { mv: ['c2', 'c4'], cap: 'c4' }, { mv: ['e7', 'e6'], cap: 'e6' }, { mv: ['b1', 'c3'], cap: 'Nc3' }, { mv: ['f8', 'b4'], cap: 'Bb4' }] },
        { t: 'do', task: function (R) { return writeQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return writeQ(R); } },
      sum: '기보를 읽고 <b>그 말을 그 칸으로</b> 두어요. 백·흑 한 번씩이 한 수예요.' },
    { id: 'nota-follow', title: '기보대로 두어 보기', kind: 'one',
      screens: [
        { t: 'say', text: '기보를 따라 유명한 오프닝을 두어 봐요. 내가 백을 두면 흑은 기보대로 저절로 둬요.', board: { pos: S0 } },
        { t: 'ex', text: '이탈리안 게임', board: { pos: S0 }, frames: 'e4 e5 Nf3 Nc6 Bc4'.split(' ').map(function (s, k, a) { var p = after(a.slice(0, k).join(' ')), m = bySan(p, s); return { mv: [CH.name(m.from), CH.name(m.to)], cap: (k % 2 ? '' : (k / 2 + 1) + '. ') + s }; }) },
        { t: 'do', task: lineTask(LINES[0]) }
      ],
      practice: { n: 6, gen: function (R) { return lineTask(R.pick(LINES)); } },
      sum: '기보를 따라 두면 <b>이름난 대국과 오프닝</b>을 그대로 익힐 수 있어요.' }
  ];

  /* ===== 28단원 오프닝 ===== */
  var OPEN_POS = ['', 'Nf3 Nf6', 'c4 e5', 'Nf3 d5', 'g3 e5', 'Nc3 Nf6', 'b3 e5', 'c4 c5'];
  function centerQ(R) {
    for (var t = 0; t < 30; t++) {
      var sq = R.pick(OPEN_POS), p = after(sq), ms = CH.legal(p).filter(function (m) { return m.pc === 'P' && /^(d4|e4)$/.test(CH.name(m.to)) && safe(p, m); });
      if (!ms.length) continue;
      return playQ('오프닝 첫 원칙: <b>가운데</b>를 차지해요! 폰으로 가운데(d4·e4)를 차지하는 수를 두어요.' + (sq ? ' (지금까지: ' + sq + ')' : ''), CH.fen(p), goods(ms), ['가운데 네 칸 d4·e4·d5·e5가 가장 중요해요.', { text: '이 칸들이에요.', marks: M(['d4', 'e4'], 'hint') }],
        { kind: 'easy', board: { marks: M(['d4', 'e4', 'd5', 'e5'], 'soft') }, why: function (f, s) { return { text: '그 수도 둘 수 있지만, 지금은 폰으로 가운데(d4·e4)를 차지해요.', marks: M([s], 'bad') }; } });
    }
  }
  var DEV_POS = ['e4 e5', 'd4 d5', 'e4 c5', 'd4 Nf6', 'e4 e6', 'c4 e5', 'e4 e5 Nf3 Nc6', 'd4 d5 c4 e6', 'e4 d5 exd5 Qxd5'];
  function devQ(R) {
    for (var t = 0; t < 30; t++) {
      var sq = R.pick(DEV_POS), p = after(sq), ms = CH.legal(p).filter(function (m) { var f = CH.name(m.from), to = CH.name(m.to); return /[NB]/.test(m.pc) && f[1] === '1' && !/^[ah]/.test(to) && m.cap === '.' && safe(p, m); });
      if (!ms.length) continue;
      return playQ('<b>말 꺼내기</b>: 나이트나 비숍을 처음 자리에서 꺼내요(가운데 쪽으로, 잡히지 않게). (지금까지: ' + sq + ')', CH.fen(p), goods(ms), ['1번 가로줄에 있는 나이트·비숍을 앞으로 꺼내요.', '나이트는 가장자리(a·h줄)보다 가운데 쪽(c3·f3)이 좋아요.'],
        { kind: 'one', why: function (f, s) { var c = pcAt(CH.parse(CH.fen(p)).b, f); return /[NB]/.test(c) ? { text: '그 칸은 잡히거나 가장자리라 좋지 않아요.', marks: M([s], 'bad') } : { text: '이번에는 나이트나 비숍을 꺼내요.', marks: M([s], 'bad') }; } });
    }
  }
  var CASTLE_POS = ['e4 e5 Nf3 Nc6 Bc4 Bc5', 'e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6', 'd4 d5 Bf4 Nf6 e3 e6 Nf3 c5 Bd3 Nc6', 'e4 c5 Nf3 d6 Bb5+ Bd7 Bxd7+ Qxd7', 'e4 e5 Nf3 Nf6 Bc4 Nc6', 'd4 Nf6 Nf3 g6 g3 Bg7 Bg2 O-O'];
  function castleQ(R) {
    var sq = R.pick(CASTLE_POS), p = after(sq), ms = CH.legal(p).filter(function (m) { return m.flag === 'castle'; });
    return playQ('<b>캐슬링</b>으로 킹을 안전하게! (지금까지: ' + sq + ')', CH.fen(p), goods(ms), ['킹을 g1으로 두 칸 옮겨요.', { text: '이 칸이에요.', marks: M(['g1'], 'hint') }], { kind: 'easy', why: function () { return { text: '이번에는 캐슬링을 해요. 킹을 g1로!' }; } });
  }
  var SCHOLAR = ['e4 e5 Bc4 Bc5 Nc3 Qh4', 'e4 e5 Nf3 Bc5 Nc3 Qf6', 'd3 e5 Nd2 Bc5 Ngf3 Qf6'];
  function scholarQ(R) {
    for (var t = 0; t < 20; t++) {
      var sq = R.pick(SCHOLAR), p = after(sq), ms = CH.legal(p), good = ms.filter(function (m) { var q = CH.make(p, m); return !CH.legal(q).some(function (x) { return CH.status(CH.make(q, x)) === 'mate'; }); });
      if (!good.length || good.length === ms.length) continue;
      return playQ('흑이 <b>f2</b>를 노리며 메이트를 준비해요(스칼라스 메이트)! 막는 수를 두어요. (지금까지: ' + sq + ')', CH.fen(p), goods(good), ['흑 퀸과 비숍이 함께 노리는 칸은 어디인가요?', { text: '이 칸을 지켜요.', marks: M(['f2'], 'hint') }],
        { kind: 'deep', board: { marks: M(['f2'], 'ring') }, why: function (f, s) { return { text: '그렇게 두면 흑 퀸이 f2를 잡으며 체크메이트예요!', marks: J(M([s], 'bad'), M(['f2'], 'ring')) }; } });
    }
  }
  var OPQ = [
    ['오프닝에서 가장 먼저 할 일은?', ['가운데 차지하기', '퀸 꺼내기', '룩 옮기기'], '가운데 차지하기'],
    ['오프닝에서 같은 말을 여러 번 움직이면?', ['다른 말을 꺼낼 시간이 줄어요', '더 좋아요'], '다른 말을 꺼낼 시간이 줄어요'],
    ['퀸을 너무 일찍 꺼내면?', ['상대 말에게 쫓겨 시간을 잃어요', '빨리 이겨요'], '상대 말에게 쫓겨 시간을 잃어요'],
    ['킹을 안전하게 하는 방법은?', ['캐슬링', '킹을 가운데로', '퀸 옆에 두기'], '캐슬링'],
    ['나이트를 꺼낼 때 좋은 칸은?', ['f3·c3(가운데 쪽)', 'h3·a3(가장자리)'], 'f3·c3(가운데 쪽)']
  ];
  function opPick(R, filter) { var q = R.pick(filter ? OPQ.filter(function (x, i) { return filter.indexOf(i) >= 0; }) : OPQ); return pickQ(q[0], R.shuffle(q[1]), q[2], { pos: S0 }, ['오프닝 원칙: 가운데 → 말 꺼내기 → 캐슬링. 퀸은 천천히, 같은 말은 한 번씩.']); }
  var u28 = [
    { id: 'op-center', title: '오프닝 ① 가운데를 차지해요', kind: 'easy',
      screens: [
        { t: 'say', text: '<b>오프닝</b>은 대국의 처음 부분이에요. 오프닝에는 세 가지 큰 원칙이 있어요: ① <b>가운데</b> 차지하기 ② <b>말 꺼내기</b> ③ <b>캐슬링</b>.', board: { pos: S0 } },
        { t: 'say', text: '가운데 네 칸(d4·e4·d5·e5)은 판에서 가장 중요한 곳이에요. 가운데에 있는 말은 여러 방향으로 힘을 쓸 수 있어요. 그래서 첫 수로 <b>e4</b>나 <b>d4</b>를 많이 둬요.', board: { pos: S0, marks: M(['d4', 'e4', 'd5', 'e5'], 'hi') } },
        { t: 'ex', text: '가운데 다툼', board: { pos: S0 }, frames: [{ mv: ['e2', 'e4'], cap: '1. e4: 가운데 차지!' }, { mv: ['e7', 'e5'], cap: '흑도 e5로 맞서요.' }, { mv: ['d2', 'd4'], cap: 'd4로 하나 더!' }] },
        { t: 'do', task: function (R) { return centerQ(R); } }
      ],
      practice: { n: 6, gen: function (R) { return R.int(3) ? centerQ(R) : opPick(R, [0]); } },
      sum: '오프닝 첫 원칙: 폰으로 <b>가운데(d4·e4·d5·e5)</b>를 차지해요.' },
    { id: 'op-develop', title: '오프닝 ② 말을 꺼내요', kind: 'one',
      screens: [
        { t: 'say', text: '두 번째 원칙: <b>나이트와 비숍</b>을 빨리 꺼내요(전개). 처음 자리에 갇힌 말은 싸움에 끼지 못해요.', board: { pos: after('e4 e5').b, marks: M(['b1', 'g1', 'c1', 'f1'], 'ring') } },
        { t: 'say', text: '보통 <b>나이트를 비숍보다 먼저</b> 꺼내요. 나이트는 가장자리보다 가운데 쪽(c3·f3)이 좋아요: “가장자리의 나이트는 힘이 없다!”', board: { pos: after('e4 e5 Nf3 Nc6').b, marks: M(['f3'], 'ok') } },
        { t: 'ex', text: '말 꺼내기', board: { pos: after('e4 e5').b }, frames: [{ mv: ['g1', 'f3'], cap: 'Nf3' }, { mv: ['b8', 'c6'], cap: '…Nc6' }, { mv: ['f1', 'c4'], cap: 'Bc4' }, { mv: ['g8', 'f6'], cap: '…Nf6' }, { mv: ['b1', 'c3'], cap: 'Nc3: 네 개의 말이 모두 나왔어요.' }] },
        { t: 'do', task: function (R) { return devQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return R.int(4) ? devQ(R) : opPick(R, [4]); } },
      sum: '<b>나이트·비숍</b>을 가운데 쪽으로 빨리 꺼내요.' },
    { id: 'op-castle', title: '오프닝 ③ 캐슬링', kind: 'easy',
      screens: [
        { t: 'say', text: '세 번째 원칙: 말을 꺼냈으면 <b>캐슬링</b>으로 킹을 구석으로 보내요. 가운데에 남은 킹은 위험해요.', board: { pos: after('e4 e5 Nf3 Nc6 Bc4 Bc5').b, marks: M(['e1'], 'ring') } },
        { t: 'ex', text: '캐슬링까지', board: { pos: after('e4 e5 Nf3 Nc6 Bc4 Bc5').b }, frames: [{ mv: ['e1', 'g1'], cap: 'O-O' }, { mv: ['h1', 'f1'], marks: M(['g1', 'f1'], 'ok'), cap: '킹은 안전, 룩은 가운데로!' }] },
        { t: 'do', task: function (R) { return castleQ(R); } }
      ],
      practice: { n: 6, gen: function (R) { return R.int(3) ? castleQ(R) : opPick(R, [3]); } },
      sum: '말을 꺼냈으면 <b>캐슬링</b>으로 킹을 안전하게!' },
    { id: 'op-queen', title: '오프닝 ④ 퀸은 천천히', kind: 'one',
      screens: [
        { t: 'say', text: '퀸은 가장 힘센 말이지만 <b>너무 일찍 꺼내면</b> 상대 말들이 퀸을 쫓아다니며 공격해요. 상대는 말을 꺼내고, 나는 퀸을 피하느라 시간을 잃어요.', board: { pos: after('e4 e5 Qh5').b, marks: M(['h5'], 'ring') } },
        { t: 'ex', text: '쫓기는 퀸', board: { pos: after('e4 e5').b }, frames: [{ mv: ['d1', 'h5'], cap: '2. Qh5?' }, { mv: ['b8', 'c6'], cap: '…Nc6 (말을 꺼내며 e5를 지켜요)' }, { mv: ['f1', 'c4'], cap: '3. Bc4' }, { mv: ['g7', 'g6'], marks: M(['h5'], 'bad'), cap: '…g6! 퀸이 공격받아요.' }, { mv: ['h5', 'f3'], cap: '4. Qf3 (또 퀸을 움직여요)' }, { mv: ['g8', 'f6'], marks: M(['f3'], 'ring'), cap: '…Nf6. 흑은 말이 다 나왔는데 백은 퀸만 바빠요.' }] },
        { t: 'do', task: pickQ('2. Qh5처럼 퀸을 일찍 꺼내면 어떻게 될까요?', ['상대 말에게 쫓겨 시간을 잃어요', '빨리 이겨요'], '상대 말에게 쫓겨 시간을 잃어요', { pos: after('e4 e5 Qh5').b }, ['흑이 말을 꺼내며 퀸을 공격할 수 있어요.']) }
      ],
      practice: { n: 6, gen: function (R) { return opPick(R, [2, 0, 3]); } },
      sum: '<b>퀸은 천천히!</b> 먼저 나이트·비숍을 꺼내요.' },
    { id: 'op-twice', title: '오프닝 ⑤ 같은 말 두 번은 그만', kind: 'one',
      screens: [
        { t: 'say', text: '오프닝에서는 <b>같은 말을 여러 번</b> 움직이지 않아요(꼭 필요할 때만). 한 수 한 수가 소중해서, 그 시간에 다른 말을 꺼내야 해요.', board: { pos: after('e4 e5 Nf3 Nc6').b } },
        { t: 'ex', text: '시간을 잃는 나이트', board: { pos: after('e4 e5').b }, frames: [{ mv: ['g1', 'f3'], cap: 'Nf3' }, { mv: ['b8', 'c6'], cap: '…Nc6' }, { mv: ['f3', 'g5'], cap: 'Ng5?' }, { mv: ['g8', 'f6'], cap: '…Nf6' }, { mv: ['g5', 'f3'], marks: M(['f3'], 'ring'), cap: 'Nf3? 제자리로… 흑은 말이 둘, 백은 하나뿐이에요.' }] },
        { t: 'do', task: pickQ('오프닝에서 같은 말을 여러 번 움직이면?', ['다른 말을 꺼낼 시간이 줄어요', '더 좋아요'], '다른 말을 꺼낼 시간이 줄어요', { pos: S0 }, ['한 수에 한 말만 움직일 수 있어요.']) }
      ],
      practice: { n: 6, gen: function (R) { return R.int(2) ? opPick(R, [1]) : devQ(R); } },
      sum: '오프닝에서는 <b>말마다 한 번씩</b> 꺼내요.' },
    { id: 'op-scholar', title: '오프닝 ⑥ 스칼라스 메이트 막기', kind: 'deep',
      screens: [
        { t: 'say', text: '4마당에서 본 <b>스칼라스 메이트</b>: 퀸과 비숍이 함께 <b>f7</b>(백은 f2)을 노려 4수 만에 메이트하는 작전이에요. f7·f2는 킹만 지키는 약한 칸이에요.', board: { pos: after('e4 e5 Bc4 Nc6 Qh5').b, marks: M(['f7'], 'ring') } },
        { t: 'say', text: '막는 방법: 노리는 칸을 <b>한 번 더 지키거나</b>(Qe7·Qf6·g6), 공격하는 퀸을 <b>쫓아내거나</b>(나이트로), 길을 막아요. 무엇보다 <b>상대가 무엇을 노리는지</b> 늘 살펴요.', board: { pos: after('e4 e5 Bc4 Nc6 Qh5 g6').b, marks: M(['g6'], 'ok') } },
        { t: 'ex', text: '흑이 막는 장면', board: { pos: after('e4 e5 Bc4 Nc6 Qh5').b }, frames: [{ marks: J(M(['f7'], 'ring'), M(['h5', 'c4'], 'bad')), cap: '백 퀸 h5와 비숍 c4가 f7을 노려요.' }, { mv: ['g7', 'g6'], marks: M(['g6'], 'ok'), cap: '…g6! 퀸을 쫓아내요.' }, { mv: ['h5', 'f3'], cap: 'Qf3 (또 f7을 노려요)' }, { mv: ['g8', 'f6'], marks: M(['f6'], 'ok'), cap: '…Nf6! 길을 막았어요.' }] },
        { t: 'do', task: function (R) { return scholarQ(R); } }
      ],
      practice: { n: 6, gen: function (R) { return scholarQ(R); } },
      sum: 'f7·f2를 노리는 <b>스칼라스 메이트</b>는 지키기·쫓아내기·막기로 막아요.' },
    { id: 'op-famous', title: '오프닝 ⑦ 이름난 오프닝 맛보기', kind: 'one',
      screens: [
        { t: 'say', text: '많은 사람이 두어 온 오프닝에는 <b>이름</b>이 있어요. 이탈리안 게임, 스페인 게임, 퀸스 갬빗, 런던 시스템, 시실리안 디펜스… 모두 원칙(가운데·말 꺼내기·캐슬링)을 지켜요.', board: { pos: after('e4 e5 Nf3 Nc6 Bb5').b } },
        { t: 'ex', text: '퀸스 갬빗', board: { pos: S0 }, frames: 'd4 d5 c4 e6 Nc3 Nf6'.split(' ').map(function (s, k, a) { var p = after(a.slice(0, k).join(' ')), m = bySan(p, s); return { mv: [CH.name(m.from), CH.name(m.to)], cap: (k % 2 ? '…' : (k / 2 + 1) + '. ') + s }; }) },
        { t: 'do', task: lineTask(LINES[1]) }
      ],
      practice: { n: 6, gen: function (R) { return lineTask(R.pick(LINES)); } },
      sum: '이름난 오프닝도 <b>가운데·말 꺼내기·캐슬링</b> 원칙을 따라요.' }
  ];

  /* ===== 29단원 중반 ===== */
  function fileScene(R) {
    for (var t = 0; t < 200; t++) {
      var b = CH.board(E); b[CH.idx('g1')] = 'K'; b[CH.idx('g8')] = 'k';
      ['f', 'g', 'h'].forEach(function (f) { b[CH.idx(f + '2')] = 'P'; b[CH.idx(f + '7')] = 'p'; });
      var open = R.pick(['c', 'd', 'e']);
      ['a', 'b', 'c', 'd', 'e'].forEach(function (f) { if (f === open) return; var w = R.int(3); if (w !== 2) b[CH.idx(f + (2 + R.int(3)))] = 'P'; if (w !== 1) b[CH.idx(f + (5 + R.int(2)))] = 'p'; });
      var rf = R.pick(['a', 'f']); if (rf === 'f') b[CH.idx('f2')] = 'P'; b[CH.idx(rf + '1')] = 'R'; if (rf === 'a' && open > 'a') { var blocked = false; 'abcde'.split('').forEach(function (f) { if (f > 'a' && f <= open && pcAt(b, f + '1') !== '.') blocked = true; }); if (blocked) continue; }
      b[CH.idx(R.pick(['a', 'f']) + '8')] = 'r'; if (R.int(2)) { var e = sqs(function (s) { return pcAt(b, s) === '.' && /[3-6]/.test(s[1]); }); b[CH.idx(R.pick(e))] = R.pick(['N', 'B']); b[CH.idx(R.pick(e))] = R.pick(['n', 'b']); }
      var p = P(b); if (CH.inCheck(P(b, 'b')) || CH.inCheck(p)) continue;
      var good = CH.legal(p).filter(function (m) { return m.pc === 'R' && CH.name(m.to)[0] === open && safe(p, m); });
      if (!good.length) continue;
      return { p: p, open: open, good: good };
    }
  }
  function fileQ(R) {
    var sc = fileScene(R);
    return playQ('<b>열린 줄</b>(폰이 하나도 없는 세로줄)을 찾아 룩을 올려요.', CH.fen(sc.p), goods(sc.good), ['세로줄마다 폰이 있는지 살펴요.', { text: '이 줄이에요.', marks: M([sc.open + '1', sc.open + '4', sc.open + '8'], 'hint') }],
      { kind: 'one', why: function (f, s) { return { text: '그 수는 열린 줄이 아니에요. 폰이 하나도 없는 세로줄을 찾아요.', marks: M([s], 'bad') }; } });
  }
  function weakQ(R) {
    for (var t = 0; t < 300; t++) {
      var p = randPos(R, 10 + R.int(16)), ms = CH.legal(p).filter(function (m) { var tgt = CH.name(m.to); return m.cap !== '.' && m.cap !== 'k' && !att(CH.make(p, m).b, tgt, 'b').length; });
      if (!ms.length || ms.length > 3 || CH.inCheck(p)) continue;
      return playQ('<b>약한 말</b>(지켜 주는 말이 없는 흑 말)을 찾아 잡아요.', CH.fen(p), goods(ms), ['흑 말마다 지켜 주는 흑 말이 있는지 살펴요.', { text: '약한 흑 말이 반짝여요.', marks: M([CH.name(ms[0].to)], 'hint') }],
        { kind: 'one', why: function (f, s) { return { text: '그 수는 약한 말을 잡는 수가 아니에요(지켜진 말이거나 잡는 수가 아니에요).', marks: M([s], 'bad') }; } });
    }
  }
  var PLANQ = [
    ['오프닝이 끝나면(말을 꺼내고 캐슬링하면) 무엇을 생각할까요?', ['계획: 어디를 공격할지', '아무 수나'], '계획: 어디를 공격할지'],
    ['룩은 어디에 두면 좋을까요?', ['열린 줄', '폰 뒤에 갇힌 곳'], '열린 줄'],
    ['상대의 약한 말이란?', ['지켜 주는 말이 없는 말', '값이 작은 말'], '지켜 주는 말이 없는 말'],
    ['한 수 두기 전에 꼭 물어볼 것은?', ['상대가 무엇을 노리지?', '어느 말이 예쁘지?'], '상대가 무엇을 노리지?'],
    ['말이 앞서 있을 때 좋은 방법은?', ['같은 값 교환으로 말을 줄여요', '말을 아껴 두어요'], '같은 값 교환으로 말을 줄여요']
  ];
  function planPick(R) { var q = R.pick(PLANQ); return pickQ(q[0], R.shuffle(q[1]), q[2], { pos: after('e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6').b }, ['중반 원칙: 계획 세우기 · 열린 줄에 룩 · 약한 말 노리기 · 상대의 노림수 살피기.']); }
  var u29 = [
    { id: 'mid-file', title: '중반 ① 열린 줄에 룩', kind: 'one',
      screens: [
        { t: 'say', text: '오프닝이 끝나면 <b>중반</b>이에요. 룩은 <b>열린 줄</b>(폰이 하나도 없는 세로줄)에서 힘이 세요. 앞이 탁 트여서 상대 진영 깊이까지 들어갈 수 있거든요.', board: { pos: B({ g1: 'K', g8: 'k', a1: 'R', f2: 'P', g2: 'P', h2: 'P', f7: 'p', g7: 'p', h7: 'p', a2: 'P', b3: 'P', a7: 'p', b6: 'p', e4: 'P', e5: 'p' }), marks: M(['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8'], 'soft') } },
        { t: 'ex', text: '룩을 열린 줄로', board: { pos: B({ g1: 'K', g8: 'k', a1: 'R', f2: 'P', g2: 'P', h2: 'P', f7: 'p', g7: 'p', h7: 'p', a2: 'P', b3: 'P', a7: 'p', b6: 'p', e4: 'P', e5: 'p' }) }, frames: [{ mv: ['a1', 'd1'], marks: M(['d1'], 'hi'), cap: '룩 d1: 열린 d줄 차지!' }, { mv: ['g8', 'f8'], cap: '…' }, { mv: ['d1', 'd7'], marks: M(['d7'], 'ok'), cap: '룩 d7: 상대 7번 줄까지 들어갔어요(7번 줄의 룩은 아주 강해요).' }] },
        { t: 'do', task: function (R) { return fileQ(R); } }
      ],
      practice: { n: 6, gen: function (R) { return fileQ(R); } },
      sum: '룩은 <b>열린 줄</b>로! 들어가서 7번 가로줄까지 노려요.' },
    { id: 'mid-weak', title: '중반 ② 약한 말 노리기', kind: 'one',
      screens: [
        { t: 'say', text: '중반에는 상대의 <b>약한 곳</b>을 찾아요: 지켜 주는 말이 없는 말, 핀에 걸린 말, 킹 둘레의 빈틈. 약한 곳을 여러 말로 함께 노리면 이겨요.', board: { pos: after('e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6').b } },
        { t: 'ex', text: '약한 말 잡기', board: { pos: B({ g1: 'K', g8: 'k', d1: 'R', d6: 'b', f7: 'p', g7: 'p', h7: 'p', f2: 'P', g2: 'P', h2: 'P' }) }, frames: [{ marks: M(['d6'], 'ring'), cap: 'd6의 흑 비숍을 지켜 주는 흑 말이 없어요.' }, { mv: ['d1', 'd6'], marks: M(['d6'], 'ok'), cap: '룩이 공짜로 잡아요!' }] },
        { t: 'do', task: function (R) { return weakQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return weakQ(R); } },
      sum: '<b>약한 말</b>(혼자 있는 말·핀 걸린 말)을 찾아 노려요.' },
    { id: 'mid-plan', title: '중반 ③ 계획 세우기', kind: 'one',
      screens: [
        { t: 'say', text: '한 수씩 그냥 두지 말고 <b>계획</b>을 세워요: ① 상대가 무엇을 노리는지 ② 내 약한 곳은 없는지 ③ 상대의 약한 곳은 어디인지 ④ 내 가장 나쁜 말을 어떻게 좋게 할지.', board: { pos: after('e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6').b } },
        { t: 'say', text: '말이 앞서 있으면 <b>같은 값 교환</b>으로 말을 줄여요. 남은 말이 적을수록 앞선 쪽이 이기기 쉬워요. 뒤처져 있으면 교환을 피하고 기회를 노려요.', board: { pos: B({ g1: 'K', g8: 'k', d1: 'R', e1: 'R', d8: 'r' }) } },
        { t: 'ex', text: '계획 세우는 차례', board: { pos: after('e4 e5 Nf3 Nc6 Bc4 Bc5 O-O Nf6').b }, frames: [{ marks: M(['f2', 'f7'], 'ring'), cap: '① 상대가 노리는 곳? (흑 비숍이 f2를 노려요)' }, { marks: M(['e4'], 'ring'), cap: '② 내 약한 곳? (e4 폰을 흑 나이트가 노려요)' }, { marks: M(['f7', 'e5'], 'ring'), cap: '③ 상대 약한 곳? (f7, e5)' }, { marks: M(['b1', 'c1'], 'ring'), cap: '④ 아직 안 나온 말을 꺼내요.' }] },
        { t: 'do', task: function (R) { return planPick(R); } }
      ],
      practice: { n: 6, gen: function (R) { return planPick(R); } },
      sum: '중반 계획: <b>상대의 노림수 → 내 약점 → 상대 약점 → 나쁜 말 살리기.</b>' }
  ];

  /* ===== 30단원 엔드게임 ===== */
  function cen(s) { return Math.min(kd(s, 'd4'), kd(s, 'e4'), kd(s, 'd5'), kd(s, 'e5')); }
  function kingQ(R) {
    for (var t = 0; t < 200; t++) {
      var b = CH.board(E), wk = R.pick(sqs(function (s) { return /[12]/.test(s[1]) || /[ah]/.test(s[0]); })); b[CH.idx(wk)] = 'K';
      var bk = R.pick(sqs(function (s) { return kd(s, wk) > 3 && /[6-8]/.test(s[1]); })); b[CH.idx(bk)] = 'k';
      for (var k = 0; k < 2 + R.int(3); k++) { var e = sqs(function (s) { return pcAt(b, s) === '.' && /[2-7]/.test(s[1]); }); b[CH.idx(R.pick(e))] = R.pick(['P', 'p']); }
      var p = P(b); if (CH.inCheck(P(b, 'b')) || CH.inCheck(p)) continue;
      var good = CH.legal(p).filter(function (m) { return m.pc === 'K' && cen(CH.name(m.to)) < cen(wk); }); if (!good.length) continue;
      return playQ('엔드게임에서는 <b>킹도 싸워요!</b> 킹을 가운데 쪽으로 한 걸음 옮겨요.', CH.fen(p), goods(good), ['말이 적으면 킹이 위험하지 않아요. 가운데로 나와 폰을 도와요.', { text: '가운데 네 칸이에요.', marks: M(['d4', 'e4', 'd5', 'e5'], 'hint') }],
        { kind: 'easy', board: { marks: M([wk], 'ring') }, why: function (f, s) { return { text: '가운데(d4·e4·d5·e5)에 더 가까워지는 킹 수를 두어요.', marks: M([s], 'bad') }; } });
    }
  }
  function squareQ(R) {
    for (var t = 0; t < 300; t++) {
      var f = F[R.int(8)], r = 2 + R.int(5), ps = f + r, b = CH.board(E); b[CH.idx(ps)] = 'P';
      var r2 = r === 2 ? 4 : r + 1, n = 8 - r2, promo = f + 8, fi = F.indexOf(f); /* 백이 폰을 한 번 민 뒤(처음 자리면 두 칸) 남은 칸 수 n */
      var bk = R.pick(sqs(function (s) { return pcAt(b, s) === '.' && Math.abs(F.indexOf(s[0]) - fi) >= 2 && +s[1] >= r; })); if (!bk) continue; b[CH.idx(bk)] = 'k';
      var wk = R.pick(sqs(function (s) { return pcAt(b, s) === '.' && kd(s, bk) > 4 && kd(s, ps) > 3 && /[1-3]/.test(s[1]); })); if (!wk) continue; b[CH.idx(wk)] = 'K';
      if (CH.inCheck(P(b, 'b'))) continue;
      var catchIt = kd(bk, promo) <= n + 1; /* 흑 차례: 흑 킹이 정사각형 안이거나 한 걸음에 들어갈 수 있으면 따라잡음(폰이 끝 줄에 닿을 때 바로 옆이면 잡음) */
      var sq = sqs(function (s) { return Math.abs(F.indexOf(s[0]) - fi) <= n && +s[1] >= r2 && (F.indexOf(s[0]) - fi) * (F.indexOf(bk[0]) - fi) >= 0; });
      return pickQ('백 차례예요. 백이 폰을 계속 밀면, 흑 킹이 폰을 <b>따라잡을</b> 수 있을까요? (백 킹은 너무 멀어요)', ['따라잡아요', '따라잡지 못해요(퀸이 돼요)'], catchIt ? '따라잡아요' : '따라잡지 못해요(퀸이 돼요)', { pos: b, marks: M([ps, promo], 'ring') },
        ['정사각형 규칙: 폰이 한 번 나아간 뒤(처음 자리면 두 칸), 폰에서 끝 줄까지를 한 변으로 하는 정사각형을 그려요. 흑 차례에 흑 킹이 그 안에 있거나 한 걸음에 들어갈 수 있으면 따라잡아요.', { text: '폰이 나아간 뒤의 정사각형이에요(흑 킹 쪽).', marks: M(sq, 'soft') }], { kind: 'one' });
    }
  }
  function oppQ(R) {
    for (var t = 0; t < 300; t++) {
      var b = CH.board(E), bk = R.pick(sqs(function (s) { return /[c-f][5-7]/.test(s); })); b[CH.idx(bk)] = 'k';
      var wk = R.pick(sqs(function (s) { return kd(s, bk) === 3 && /[2-5]/.test(s[1]); })); if (!wk) continue; b[CH.idx(wk)] = 'K';
      var pf = R.pick(sqs(function (s) { return pcAt(b, s) === '.' && /[2-3]/.test(s[1]) && kd(s, wk) <= 2; })); if (pf) b[CH.idx(pf)] = 'P';
      var p = P(b); if (CH.inCheck(P(b, 'b')) || CH.inCheck(p)) continue;
      var good = CH.legal(p).filter(function (m) { if (m.pc !== 'K') return false; var x = CH.name(m.to); return (x[0] === bk[0] && Math.abs(+x[1] - +bk[1]) === 2) || (x[1] === bk[1] && Math.abs(F.indexOf(x[0]) - F.indexOf(bk[0])) === 2); });
      if (!good.length) continue;
      return playQ('백 킹을 옮겨 흑 킹과 <b>오포지션</b>(한 칸 사이를 두고 마주 보기)을 만들어요.', CH.fen(p), goods(good), ['같은 세로줄(또는 가로줄)에서 두 킹 사이에 딱 한 칸!', { text: '이 칸이에요.', marks: M([CH.name(good[0].to)], 'hint') }],
        { kind: 'one', why: function (f, s) { return { text: '두 킹이 같은 줄에서 한 칸 사이를 두고 마주 봐야 해요.', marks: M([s], 'bad') }; } });
    }
  }
  function passedQ(R) {
    for (var t = 0; t < 300; t++) {
      var b = CH.board(E); b[CH.idx('g1')] = 'K'; b[CH.idx('g8')] = 'k';
      for (var k = 0; k < 4; k++) { var e = sqs(function (s) { return pcAt(b, s) === '.' && /[2-5]/.test(s[1]); }); b[CH.idx(R.pick(e))] = 'P'; }
      for (k = 0; k < 3 + R.int(2); k++) { e = sqs(function (s) { return pcAt(b, s) === '.' && /[4-7]/.test(s[1]); }); b[CH.idx(R.pick(e))] = 'p'; }
      var wp = sqs(function (s) { return pcAt(b, s) === 'P'; });
      var ans = wp.filter(function (s) { var f = F.indexOf(s[0]); return !sqs(function (x) { return pcAt(b, x) === 'p' && Math.abs(F.indexOf(x[0]) - f) <= 1 && +x[1] > +s[1]; }).length; });
      if (!ans.length || ans.length > 2 || CH.inCheck(P(b, 'b')) || CH.inCheck(P(b))) continue;
      return clickQ('<b>패스트 폰</b>(앞과 양옆 줄에 막을 흑 폰이 없는 백 폰)을 <b>모두</b> 눌러요.', ans, { pos: b }, ['백 폰마다 앞쪽, 같은 줄과 양옆 줄에 흑 폰이 있는지 살펴요.', { text: '이 폰을 살펴요.', marks: M([ans[0]], 'hint') }],
        { all: true, kind: 'one', why: function (s) { return pcAt(b, s) === 'P' ? { text: '그 폰 앞(같은 줄이나 옆 줄)에 흑 폰이 있어요.', marks: M([s], 'bad') } : { text: '백 폰을 눌러요.', marks: M([s], 'bad') }; } });
    }
  }
  var RQ = [
    ['룩은 패스트 폰의 어디에 두면 좋을까요?', ['폰 뒤에', '폰 앞에'], '폰 뒤에'],
    ['룩 엔드게임에서 룩은?', ['적극적으로 움직이는 것이 좋아요', '구석에 숨기는 것이 좋아요'], '적극적으로 움직이는 것이 좋아요'],
    ['엔드게임에서 킹은?', ['가운데로 나와 싸워요', '구석에 숨어요'], '가운데로 나와 싸워요']
  ];
  var u30 = [
    { id: 'end-king', title: '엔드게임 ① 킹도 싸워요', kind: 'easy',
      screens: [
        { t: 'say', text: '말이 많이 줄어든 마지막 부분을 <b>엔드게임</b>이라고 해요. 이때는 킹을 공격할 말이 적어서 <b>킹도 싸우는 말</b>이 돼요(킹의 값은 폰 4개쯤!).', board: { pos: B({ e1: 'K', e8: 'k', c4: 'P', f5: 'p' }), marks: M(['e1'], 'ring') } },
        { t: 'ex', text: '킹이 가운데로', board: { pos: B({ e1: 'K', e8: 'k', c4: 'P', f5: 'p', g2: 'P' }) }, frames: [{ mv: ['e1', 'e2'], cap: 'Ke2' }, { mv: ['e8', 'e7'], cap: '…Ke7' }, { mv: ['e2', 'e3'], cap: 'Ke3' }, { mv: ['e7', 'e6'], cap: '…Ke6' }, { mv: ['e3', 'f4'], marks: M(['f4'], 'ok'), cap: 'Kf4: 흑 폰 f5를 노려요!' }] },
        { t: 'do', task: function (R) { return kingQ(R); } }
      ],
      practice: { n: 6, gen: function (R) { return kingQ(R); } },
      sum: '엔드게임에서는 <b>킹을 가운데로</b> 꺼내 싸워요.' },
    { id: 'end-square', title: '엔드게임 ② 정사각형 규칙', kind: 'one',
      screens: [
        { t: 'say', text: '폰 혼자 끝 줄로 달릴 때, 상대 킹이 따라잡을 수 있을까요? 셈하지 않고 아는 방법이 <b>정사각형 규칙</b>이에요.', board: { pos: B({ c4: 'P', g6: 'k', a1: 'K' }) } },
        { t: 'say', text: '폰에서 끝 줄까지를 한 변으로 하는 <b>정사각형</b>을 그려요. 흑 차례일 때 흑 킹이 그 안에 있거나 들어갈 수 있으면 따라잡고, 밖이면 폰이 퀸이 돼요. (처음 자리의 폰은 두 칸 갈 수 있으니 한 칸 앞에서 세요.)', board: { pos: B({ c4: 'P', g6: 'k', a1: 'K' }), marks: M(['c4', 'c5', 'c6', 'c7', 'c8', 'd4', 'd5', 'd6', 'd7', 'd8', 'e4', 'e5', 'e6', 'e7', 'e8', 'f4', 'f5', 'f6', 'f7', 'f8', 'g4', 'g5', 'g6', 'g7', 'g8'], 'soft') } },
        { t: 'ex', text: '정사각형 안의 킹', board: { pos: B({ c4: 'P', g6: 'k', a1: 'K' }) }, frames: [{ mv: ['c4', 'c5'], cap: '백 폰 c5 → 정사각형 c5~f8' }, { mv: ['g6', 'f6'], cap: '흑 킹이 정사각형 안으로!' }, { mv: ['c5', 'c6'], cap: 'c6' }, { mv: ['f6', 'e7'], cap: 'Ke7' }, { mv: ['c6', 'c7'], cap: 'c7' }, { mv: ['e7', 'd7'], cap: 'Kd7' }, { pos: B({ c8: 'Q', d7: 'k', a1: 'K' }), marks: M(['c8'], 'hi'), cap: 'c8=Q' }, { mv: ['d7', 'c8'], marks: M(['c8'], 'ok'), cap: '…Kxc8. 따라잡았어요!' }] },
        { t: 'do', task: function (R) { return squareQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return squareQ(R); } },
      sum: '<b>정사각형 규칙</b>: 상대 킹이 폰의 정사각형 안에 있으면 따라잡아요.' },
    { id: 'end-opp', title: '엔드게임 ③ 오포지션', kind: 'one',
      screens: [
        { t: 'say', text: '두 킹이 같은 줄에서 <b>한 칸 사이</b>를 두고 마주 보는 것을 <b>오포지션</b>이라고 해요. 오포지션을 잡은 쪽(상대가 둘 차례로 만든 쪽)이 유리해요. 상대 킹이 비켜야 하거든요.', board: { pos: B({ e4: 'K', e6: 'k', e3: 'P' }), marks: M(['e5'], 'ring') } },
        { t: 'ex', text: '오포지션으로 길 열기', board: { pos: B({ e4: 'K', e6: 'k', e3: 'P' }) }, frames: [{ marks: M(['e4', 'e6'], 'ring'), cap: '흑 차례에 오포지션: 흑 킹이 비켜야 해요.' }, { mv: ['e6', 'd6'], cap: '…Kd6' }, { mv: ['e4', 'f5'], marks: M(['f5'], 'ok'), cap: 'Kf5! 백 킹이 앞으로 나가 폰의 길을 열어요.' }] },
        { t: 'do', task: function (R) { return oppQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return oppQ(R); } },
      sum: '<b>오포지션</b>: 한 칸 사이로 마주 본 두 킹. 상대가 둘 차례면 상대 킹이 비켜야 해요.' },
    { id: 'end-passed', title: '엔드게임 ④ 패스트 폰', kind: 'one',
      screens: [
        { t: 'say', text: '앞과 양옆 줄에 막거나 잡을 상대 폰이 없는 폰을 <b>패스트 폰</b>(통과한 폰)이라고 해요. 엔드게임에서 패스트 폰은 퀸이 될 수 있어 아주 값져요.', board: { pos: B({ g1: 'K', g8: 'k', d5: 'P', a2: 'P', b7: 'p', e6: 'p' }), marks: J(M(['a2'], 'ok'), M(['d5'], 'x')) } },
        { t: 'say', text: '외우는 말: <b>“패스트 폰은 밀어라!”</b> 상대는 패스트 폰을 막느라 말 하나를 써야 해요.', board: { pos: B({ g1: 'K', g8: 'k', a5: 'P' }), arrows: [['a5', 'a8']] } },
        { t: 'ex', text: '패스트 폰 찾기', board: { pos: B({ g1: 'K', g8: 'k', a4: 'P', d4: 'P', e3: 'P', d6: 'p', f6: 'p' }) }, frames: [{ marks: M(['a4'], 'ok'), cap: 'a4: 앞과 옆(b줄)에 흑 폰이 없어요 → 패스트 폰!' }, { marks: M(['d4'], 'bad'), cap: 'd4: 바로 앞 d6에 흑 폰 → 아니에요.' }, { marks: M(['e3'], 'bad'), cap: 'e3: 옆 줄 d6·f6의 흑 폰이 지나가는 칸을 지켜요 → 아니에요.' }] },
        { t: 'do', task: function (R) { return passedQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return passedQ(R); } },
      sum: '<b>패스트 폰</b>: 앞을 막을 상대 폰이 없는 폰. “패스트 폰은 밀어라!”' },
    { id: 'end-rook', title: '엔드게임 ⑤ 룩 엔드게임 맛보기', kind: 'one',
      screens: [
        { t: 'say', text: '대국에서 가장 자주 나오는 엔드게임이 <b>룩 엔드게임</b>이에요. 원칙 두 가지: ① 룩은 <b>패스트 폰 뒤</b>에 두어요(내 폰이든 상대 폰이든). ② 룩은 <b>적극적으로</b> 움직여요.', board: { pos: B({ g1: 'K', g8: 'k', a5: 'P', a1: 'R', b8: 'r' }), marks: M(['a1'], 'ok'), arrows: [['a1', 'a4']] } },
        { t: 'say', text: '룩이 폰 뒤에 있으면 폰이 나아갈수록 룩의 길이 더 넓어져요. 폰 앞에 있으면 거꾸로 길이 좁아져요.', board: { pos: B({ g1: 'K', g8: 'k', a6: 'P', a1: 'R', h8: 'r' }), marks: M(['a2', 'a3', 'a4', 'a5'], 'soft') } },
        { t: 'ex', text: '폰 뒤의 룩', board: { pos: B({ g1: 'K', g8: 'k', a5: 'P', a1: 'R', h8: 'r' }) }, frames: [{ mv: ['a5', 'a6'], cap: 'a6' }, { mv: ['h8', 'a8'], cap: '…Ra8 (흑 룩이 폰 앞을 막아요)' }, { mv: ['a6', 'a7'], marks: M(['a2', 'a3', 'a4', 'a5', 'a6'], 'soft'), cap: 'a7: 폰이 나아갈수록 백 룩의 길이 넓어져요.' }] },
        { t: 'do', task: pickQ('백 룩은 백 패스트 폰(a5)의 어디에 두면 좋을까요?', ['폰 뒤에(a1 쪽)', '폰 앞에(a8 쪽)'], '폰 뒤에(a1 쪽)', { pos: B({ g1: 'K', g8: 'k', a5: 'P', d1: 'R', b8: 'r' }) }, ['폰이 나아갈수록 룩의 길이 넓어지는 쪽은?']) }
      ],
      practice: { n: 6, gen: function (R) { var q = R.pick(RQ); return pickQ(q[0], R.shuffle(q[1]), q[2], { pos: B({ g1: 'K', g8: 'k', a5: 'P', a1: 'R', b8: 'r' }) }, ['엔드게임 원칙: 킹은 가운데로, 룩은 폰 뒤에, 패스트 폰은 밀어라.']); } },
      sum: '룩 엔드게임: <b>룩은 패스트 폰 뒤에, 적극적으로.</b>' }
  ];

  /* ===== 31단원 비기는 규칙 ===== */
  var MATS = [
    [{ e1: 'K', e8: 'k' }, true, '킹 대 킹'], [{ e1: 'K', e8: 'k', c3: 'B' }, true, '킹+비숍 대 킹'], [{ e1: 'K', e8: 'k', c3: 'N' }, true, '킹+나이트 대 킹'],
    [{ e1: 'K', e8: 'k', c1: 'B', f8: 'b' }, true, '킹+비숍 대 킹+비숍(같은 색 칸)'], [{ e1: 'K', e8: 'k', a1: 'R' }, false, '킹+룩 대 킹'], [{ e1: 'K', e8: 'k', d2: 'P' }, false, '킹+폰 대 킹'],
    [{ e1: 'K', e8: 'k', d1: 'Q' }, false, '킹+퀸 대 킹'], [{ e1: 'K', e8: 'k', b1: 'N', g1: 'N' }, false, '킹+나이트 둘 대 킹'], [{ e1: 'K', e8: 'k', c1: 'B', c8: 'b' }, false, '킹+비숍 대 킹+비숍(다른 색 칸)'], [{ e1: 'K', e8: 'k', c1: 'B', f1: 'B' }, false, '킹+비숍 둘 대 킹']
  ];
  var DRQ = [
    ['같은 국면이 세 번 나오면?', ['비김을 요구할 수 있어요', '먼저 둔 쪽이 이겨요'], '비김을 요구할 수 있어요'],
    ['50수 규칙이란?', ['양쪽이 50수 동안 잡기도 폰 움직임도 없으면 비김', '50수가 되면 무조건 끝'], '양쪽이 50수 동안 잡기도 폰 움직임도 없으면 비김'],
    ['스테일메이트는?', ['비김', '스테일메이트를 만든 쪽의 승리'], '비김'],
    ['두 사람이 서로 비기자고 하면?', ['합의로 비김이 돼요', '할 수 없어요'], '합의로 비김이 돼요'],
    ['킹+룩 대 킹은 비김인가요?', ['아니요, 룩으로 메이트할 수 있어요', '네, 비김이에요'], '아니요, 룩으로 메이트할 수 있어요']
  ];
  function matQ(R) { var x = R.pick(MATS), b = B(x[0]), auto = CH.insufficient(b); return pickQ('이 판(' + x[2] + ')은 <b>메이트할 말이 모자라</b> 바로 비김인가요?', ['네, 비김이에요', '아니요, 계속 둬요'], auto ? '네, 비김이에요' : '아니요, 계속 둬요', { pos: b }, ['킹+비숍 하나, 킹+나이트 하나로는 메이트할 수 없어요.', '룩·퀸·폰이 있으면 메이트(또는 프로모션)할 수 있어요.'], { kind: 'one' }); }
  function drQ(R, idx) { var q = R.pick(idx ? DRQ.filter(function (x, i) { return idx.indexOf(i) >= 0; }) : DRQ); return pickQ(q[0], R.shuffle(q[1]), q[2], { pos: E }, ['비기는 경우: 스테일메이트 · 3회 반복 · 50수 · 말 부족 · 합의.']); }
  var u31 = [
    { id: 'draw-rep', title: '비김 ① 3회 반복', kind: 'one',
      screens: [
        { t: 'say', text: '체스에는 <b>비기는(무승부)</b> 경우가 여럿 있어요. 첫째, <b>같은 국면이 세 번</b> 나오면 비김을 요구할 수 있어요(3회 반복). 같은 쪽 차례·같은 말 배치여야 해요.', board: { pos: B({ g1: 'K', h8: 'k', d1: 'Q', a7: 'r' }) } },
        { t: 'ex', text: '끝없는 체크(퍼페추얼 체크)', board: { pos: B({ g1: 'K', h8: 'k', e5: 'Q', f7: 'p', g7: 'p' }) }, frames: [{ mv: ['e5', 'e8'], cap: 'Qe8+' }, { mv: ['h8', 'h7'], cap: '…Kh7' }, { mv: ['e8', 'h5'], cap: 'Qh5+' }, { mv: ['h7', 'g8'], cap: '…Kg8' }, { mv: ['h5', 'e8'], cap: 'Qe8+ … 같은 국면이 되풀이돼요 → 비김' }] },
        { t: 'do', task: pickQ('같은 국면이 세 번 나오면?', ['비김을 요구할 수 있어요', '먼저 둔 쪽이 이겨요'], '비김을 요구할 수 있어요', { pos: E }, ['3회 반복 규칙이에요.']) }
      ],
      practice: { n: 6, gen: function (R) { return drQ(R, [0, 2, 3]); } },
      sum: '<b>3회 반복</b>: 같은 국면이 세 번이면 비김을 요구할 수 있어요.' },
    { id: 'draw-50', title: '비김 ② 50수 규칙', kind: 'one',
      screens: [
        { t: 'say', text: '<b>50수 규칙</b>: 양쪽이 <b>50수 동안</b>(백·흑 50번씩) 한 번도 <b>잡지 않고 폰도 움직이지 않으면</b> 비김을 요구할 수 있어요. 이길 방법을 모른 채 끝없이 두는 것을 막아요.', board: { pos: B({ e1: 'K', e8: 'k', a1: 'R', h8: 'r' }) } },
        { t: 'ex', text: '세는 법', board: { pos: B({ e1: 'K', e8: 'k', a1: 'R', h8: 'r' }) }, frames: [{ mv: ['a1', 'a5'], cap: '룩만 움직여요: 1수…' }, { mv: ['h8', 'h5'], cap: '…' }, { mv: ['a5', 'a1'], cap: '잡기도 폰 움직임도 없이 50수가 지나면 비김을 요구할 수 있어요. 잡거나 폰을 움직이면 다시 0부터!' }] },
        { t: 'do', task: pickQ('50수 규칙이란?', ['양쪽이 50수 동안 잡기도 폰 움직임도 없으면 비김', '50수가 되면 무조건 끝'], '양쪽이 50수 동안 잡기도 폰 움직임도 없으면 비김', { pos: E }, ['잡기나 폰 움직임이 있으면 다시 0부터 세요.']) }
      ],
      practice: { n: 6, gen: function (R) { return drQ(R, [1, 0, 4]); } },
      sum: '<b>50수 규칙</b>: 50수 동안 잡기·폰 움직임이 없으면 비김.' },
    { id: 'draw-mat', title: '비김 ③ 말이 모자랄 때', kind: 'one',
      screens: [
        { t: 'say', text: '양쪽 모두 <b>메이트할 수 있는 말이 없으면</b> 바로 비김이에요. 킹 대 킹, 킹+비숍 대 킹, 킹+나이트 대 킹이 그래요.', board: { pos: B({ e1: 'K', e8: 'k', c3: 'B' }) } },
        { t: 'say', text: '룩·퀸·폰이 하나라도 있으면 메이트할 수 있으니(폰은 퀸이 될 수 있어요) 계속 둬요.', board: { pos: B({ e1: 'K', e8: 'k', d2: 'P' }), marks: M(['d2'], 'ok') } },
        { t: 'ex', text: '메이트할 수 없는 말', board: { pos: B({ e1: 'K', e8: 'k' }) }, frames: [{ cap: '킹 대 킹: 비김' }, { pos: B({ e1: 'K', e8: 'k', c3: 'B' }), cap: '킹+비숍 대 킹: 비김' }, { pos: B({ e1: 'K', e8: 'k', c3: 'N' }), cap: '킹+나이트 대 킹: 비김' }, { pos: B({ e1: 'K', e8: 'k', a1: 'R' }), cap: '킹+룩 대 킹: 메이트할 수 있어요(계속)' }] },
        { t: 'do', task: function (R) { return matQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return matQ(R); } },
      sum: '<b>말 부족</b>: 킹+비숍, 킹+나이트로는 메이트할 수 없어서 비김이에요.' },
    { id: 'draw-agree', title: '비김 ④ 합의와 정리', kind: 'one',
      screens: [
        { t: 'say', text: '두 사람이 서로 원하면 <b>합의로 비김</b>을 할 수 있어요(대회에서는 규칙이 따로 있기도 해요). 비기는 경우 정리: <b>스테일메이트 · 3회 반복 · 50수 · 말 부족 · 합의.</b>', board: { pos: E } },
        { t: 'ex', text: '비기는 다섯 가지', board: { pos: B({ h8: 'k', f7: 'Q', g6: 'K' }) }, frames: [{ cap: '① 스테일메이트' }, { pos: B({ g1: 'K', h8: 'k', e8: 'Q', f7: 'p', g7: 'p' }), cap: '② 3회 반복(끝없는 체크)' }, { pos: B({ e1: 'K', e8: 'k', a1: 'R', h8: 'r' }), cap: '③ 50수 규칙' }, { pos: B({ e1: 'K', e8: 'k', c3: 'N' }), cap: '④ 말 부족' }, { pos: S0, cap: '⑤ 합의' }] },
        { t: 'do', task: function (R) { return drQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return R.int(3) ? drQ(R) : matQ(R); } },
      sum: '비김: <b>스테일메이트 · 3회 반복 · 50수 · 말 부족 · 합의.</b>' }
  ];

  /* ===== 32단원 대국 예절과 실전 ===== */
  var MANQ = [
    ['대국을 시작할 때와 끝날 때 하는 것은?', ['악수하며 인사해요', '말없이 시작해요'], '악수하며 인사해요'],
    ['상대가 생각하는 동안에는?', ['조용히 기다려요', '말을 걸어요'], '조용히 기다려요'],
    ['졌을 때는?', ['“잘 두었어” 하고 인사해요', '말을 던져요'], '“잘 두었어” 하고 인사해요'],
    ['이겼을 때는?', ['상대를 존중하며 인사해요', '크게 자랑해요'], '상대를 존중하며 인사해요']
  ];
  var TOUQ = [
    ['내 말을 일부러 만지면?', ['그 말을 움직여야 해요', '다른 말을 움직여도 돼요'], '그 말을 움직여야 해요'],
    ['상대 말을 일부러 만지면?', ['잡을 수 있으면 그 말을 잡아야 해요', '상관없어요'], '잡을 수 있으면 그 말을 잡아야 해요'],
    ['말을 바로 놓고 싶을 때는?', ['먼저 “제가 고쳐 놓을게요”라고 말해요', '그냥 만져요'], '먼저 “제가 고쳐 놓을게요”라고 말해요'],
    ['말을 칸에 놓고 손을 떼면?', ['그 수는 끝이에요(되돌릴 수 없어요)', '다시 옮겨도 돼요'], '그 수는 끝이에요(되돌릴 수 없어요)']
  ];
  var CLQ = [
    ['체스 시계는 언제 누르나요?', ['내 수를 다 둔 뒤 같은 손으로', '상대가 둘 때'], '내 수를 다 둔 뒤 같은 손으로'],
    ['내 시간이 다 떨어지면?', ['보통 지게 돼요', '아무 일도 없어요'], '보통 지게 돼요'],
    ['시계를 누르는 손은?', ['말을 옮긴 손', '아무 손이나 두 번'], '말을 옮긴 손']
  ];
  function setQ(R, set, hint) { var q = R.pick(set); return pickQ(q[0], R.shuffle(q[1]), q[2], { pos: S0 }, [hint]); }
  function highGame(lv) {
    return { type: 'game', kind: 'deep', unit: '말', state: CH.START, game: AI.game(lv, { goal: 'win', lim: 60, lead: 3 }), level: lv,
      q: '🤖 인공지능(' + lv + '단계)과 정식 대국! 배운 모든 것을 써 봐요. 60수까지 끝나지 않으면 말 값이 3점 이상 앞서야 이겨요. 인공지능이 생각하는 데 몇 초 걸릴 수 있어요.',
      winText: '강한 인공지능을 이겼어요! 🎉', loseTip: '오프닝 원칙을 지키고, 상대의 전술을 살피고, 엔드게임에서는 킹을 써요.',
      hint: ['가운데 → 말 꺼내기 → 캐슬링, 그리고 상대의 노림수 살피기!', '전술(포크·핀·스큐어)을 노릴 수 있나요?'] };
  }
  var ALLQ = [].concat(OPQ, PLANQ, DRQ, MANQ, TOUQ, CLQ);
  var u32 = [
    { id: 'manner', title: '대국 예절', kind: 'easy',
      screens: [
        { t: 'say', text: '체스는 <b>신사의 놀이</b>라고 불려요. 대국 전후에 <b>악수하며 인사</b>하고, 상대가 생각할 때는 조용히 기다려요.', board: { pos: S0 } },
        { t: 'say', text: '이기든 지든 <b>상대를 존중</b>해요. 진 대국은 다음에 더 잘 두는 공부가 돼요. 대국이 끝난 뒤 함께 돌아보면 둘 다 실력이 늘어요.', board: { pos: S0 } },
        { t: 'ex', text: '대국의 처음과 끝', board: { pos: S0 }, frames: [{ cap: '① 악수하며 “잘 부탁해.”' }, { mv: ['e2', 'e4'], cap: '② 차례로, 조용히 둬요.' }, { cap: '③ 끝나면 악수하며 “잘 두었어, 고마워.”' }] },
        { t: 'do', task: function (R) { return setQ(R, MANQ, '상대를 존중하는 마음을 떠올려요.'); } }
      ],
      practice: { n: 6, gen: function (R) { return setQ(R, MANQ, '상대를 존중하는 마음을 떠올려요.'); } },
      sum: '<b>인사 · 조용히 · 존중</b>: 체스는 신사의 놀이예요.' },
    { id: 'touch', title: '터치 무브', kind: 'easy',
      screens: [
        { t: 'say', text: '실제 판에서는 <b>터치 무브</b> 규칙이 있어요: 내 말을 일부러 만지면 <b>그 말을 움직여야</b> 하고, 상대 말을 만지면 (잡을 수 있으면) <b>그 말을 잡아야</b> 해요.', board: { pos: S0 } },
        { t: 'say', text: '말이 칸에서 삐뚤어져 고쳐 놓고 싶으면 먼저 <b>“제가 고쳐 놓을게요”</b>(영어로 “I adjust”)라고 말해요. 말을 놓고 손을 떼면 그 수는 끝이에요.', board: { pos: S0 } },
        { t: 'ex', text: '터치 무브', board: { pos: S0 }, frames: [{ marks: M(['g1'], 'ring'), cap: '나이트를 만졌어요 → 나이트를 움직여야 해요.' }, { mv: ['g1', 'f3'], cap: 'Nf3. 손을 떼면 끝!' }] },
        { t: 'do', task: function (R) { return setQ(R, TOUQ, '만지면 움직이기, 놓으면 끝!'); } }
      ],
      practice: { n: 6, gen: function (R) { return setQ(R, TOUQ, '만지면 움직이기, 놓으면 끝!'); } },
      sum: '<b>터치 무브</b>: 만진 말은 움직이고, 놓은 수는 되돌리지 않아요.' },
    { id: 'clock', title: '체스 시계', kind: 'easy',
      screens: [
        { t: 'say', text: '대회에서는 <b>체스 시계</b>를 써요. 시계에는 두 사람의 시간이 따로 있어요. 내 수를 다 두면 <b>말을 옮긴 손으로</b> 시계를 눌러 상대 시간이 흐르게 해요.', board: { pos: S0 } },
        { t: 'say', text: '내 시간이 먼저 다 떨어지면 보통 져요. 그래서 시간을 아껴 쓰는 것도 실력이에요.', board: { pos: S0 } },
        { t: 'ex', text: '시계 누르기', board: { pos: S0 }, frames: [{ mv: ['e2', 'e4'], cap: '① 오른손으로 e4를 두고,' }, { cap: '② 같은 오른손으로 시계를 눌러요. 이제 상대 시간이 흘러요.' }] },
        { t: 'do', task: function (R) { return setQ(R, CLQ, '시계는 내 수를 다 둔 뒤 같은 손으로 눌러요.'); } }
      ],
      practice: { n: 6, gen: function (R) { return setQ(R, CLQ, '시계는 내 수를 다 둔 뒤 같은 손으로 눌러요.'); } },
      sum: '<b>체스 시계</b>: 둔 뒤 같은 손으로 눌러요. 시간도 실력!' },
    { id: 'ai-high', title: '인공지능과 대국 7~10단계', kind: 'deep',
      screens: [
        { t: 'say', text: '마지막 도전! <b>7~10단계</b> 인공지능과 대국해요. 생각하는 데 몇 초 걸려요. 1마당부터 배운 모든 것을 써 봐요.', board: { pos: S0 } },
        { t: 'ex', text: '강한 상대와 두는 법', board: { pos: S0 }, frames: [{ mv: ['e2', 'e4'], cap: '원칙대로 시작해요.' }, { mv: ['c7', 'c5'], cap: '상대의 수마다 “무엇을 노리지?”' }, { mv: ['g1', 'f3'], cap: '말을 꺼내고, 캐슬링하고, 전술을 찾아요.' }] },
        { t: 'do', task: highGame(7) }
      ],
      practice: { n: 6, gen: function (R) { return highGame(R.pick([7, 8, 9, 10])); } },
      sum: '강한 상대와 둘수록 실력이 늘어요. 진 대국은 돌아보며 배워요.' },
    { id: 'final', title: '졸업 준비: 모두 정리', kind: 'one',
      screens: [
        { t: 'say', text: '1마당부터 6마당까지 정말 많이 배웠어요! 체스판과 말, 움직임, 잡기와 지키기, 체크와 메이트, 전술, 경기 운영. 이제 6마당 확인 시험을 보고 <b>킹 등급</b>에 도전해요.', board: { pos: S0 } },
        { t: 'ex', text: '여섯 마당을 돌아봐요', board: { pos: S0 }, frames: [{ cap: '1마당 체스판과 체스말' }, { mv: ['g1', 'f3'], cap: '2마당 말이 움직이는 법' }, { cap: '3마당 잡기와 지키기 · 4마당 체크와 체크메이트' }, { cap: '5마당 전술 · 6마당 경기 운영' }] },
        { t: 'do', task: function (R) { var q = R.pick(ALLQ); return pickQ(q[0], R.shuffle(q[1]), q[2], { pos: S0 }, ['6마당에서 배운 것을 떠올려요.']); } }
      ],
      practice: { n: 8, gen: function (R) { var k = R.int(4); if (k === 0) return readQ(R); if (k === 1) return matQ(R); var q = R.pick(ALLQ); return pickQ(q[0], R.shuffle(q[1]), q[2], { pos: S0 }, ['6마당에서 배운 것을 떠올려요.']); } },
      sum: '축하해요! 이제 <b>체스를 혼자서 둘 수 있는</b> 사람이 되었어요.' }
  ];

  window.MADANG = { id: 'm6', no: 6, title: '경기 운영', rank: '킹', rankPc: 'K', examN: 15,
    units: [{ title: '기보', lessons: u27 }, { title: '오프닝', lessons: u28 }, { title: '중반', lessons: u29 }, { title: '엔드게임', lessons: u30 }, { title: '비기는 규칙', lessons: u31 }, { title: '대국 예절과 실전', lessons: u32 }] };
})();
