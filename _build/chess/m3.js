/* 체스 학습관 3마당 · 잡기와 지키기 (29차시) — window.MADANG
   차시 짜임은 learn.js 맨 위 설명. 연습 문제는 gen(R)이 할 때마다 새로 만듦(check.js가 여러 번 만들어 점검).
   새 문제 종류: 한 수 두기(type 'play' — 내 말 하나를 움직임, 좋은 수 T.good),
              작은 대결(type 'game' — 킹 없이 말 몇 개로 인공지능과 겨룸, 정한 수가 지나면 남은 말 값으로 승부)
   킹과 체크는 4마당에서 배우므로 판에는 킹을 두지 않음(킹으로 잡기 차시만 백 킹 하나). */
(function () {
  'use strict';
  var CH = window.CH, PN = window.PIECES.NAME, jo = window.PIECES.jo, F = 'abcdefgh';
  var E = '8/8/8/8/8/8/8/8';
  var ALL = []; for (var i = 0; i < 64; i++) ALL.push(CH.name(i));
  function sqs(fn) { return ALL.filter(fn); }
  function M(list, v) { var o = {}; list.forEach(function (s) { o[s] = v; }); return o; }
  function J() { var o = {}; [].forEach.call(arguments, function (m) { Object.keys(m || {}).forEach(function (k) { o[k] = (o[k] || []).concat(Array.isArray(m[k]) ? m[k] : [m[k]]); }); }); return o; }
  function L(s, t) { var o = {}; o[s] = { t: 'label', s: t, small: 1 }; return o; }
  function shift(s, df, dr) { var f = F.indexOf(s[0]) + df, r = +s[1] + dr; return f >= 0 && f < 8 && r >= 1 && r <= 8 ? F[f] + r : null; }
  function clickQ(q, ans, board, hint, extra) { return Object.assign({ type: 'click', q: q, ans: ans, board: board, hint: hint }, extra || {}); }
  function pickQ(q, opts, ans, board, hint, extra) { return Object.assign({ type: 'pick', q: q, opts: opts, ans: ans, board: board, hint: hint }, extra || {}); }
  function playQ(q, board, good, hint, extra) { return Object.assign({ type: 'play', q: q, board: board, good: good, hint: hint }, extra || {}); }
  function nm(c) { return PN[c.toUpperCase()]; }
  function side(c) { return CH.isW(c) ? '백' : '흑'; }
  function full(c) { return side(c) + ' ' + nm(c); }
  function pcAt(b, s) { return b[CH.idx(s)]; }
  function isW(b, s) { var c = pcAt(b, s); return c !== '.' && CH.isW(c); }
  function isB(b, s) { var c = pcAt(b, s); return c !== '.' && !CH.isW(c); }
  function B(o) { var b = CH.board(E); Object.keys(o).forEach(function (s) { b[CH.idx(s)] = o[s]; }); return b; }
  function tg(b, s) { var o = {}; CH.pieceMoves({ b: b, turn: 'w', cast: '', ep: -1 }, CH.idx(s)).forEach(function (m) { o[CH.name(m.to)] = 1; }); return Object.keys(o); }
  function only(c, s) { var o = {}; o[s] = c; return B(o); }
  /* 칸 s를 side('w'|'b') 편 말 가운데 무엇이 공격하는지(지키는지) */
  function att(b, s, sd) { return CH.attackers(b, CH.idx(s), sd).map(CH.name); }
  function between(s0, s) {
    var df = F.indexOf(s[0]) - F.indexOf(s0[0]), dr = +s[1] - +s0[1], n = Math.max(Math.abs(df), Math.abs(dr));
    if (!(df === 0 || dr === 0 || Math.abs(df) === Math.abs(dr))) return [];
    var o = []; for (var k = 1; k < n; k++) o.push(shift(s0, df / n * k, dr / n * k)); return o;
  }
  var VAL = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };
  function v(c) { return VAL[c.toUpperCase()]; }
  function mv(b, f, t) { var n = b.slice(), c = n[CH.idx(f)]; n[CH.idx(t)] = c === 'P' && t[1] === '8' ? 'Q' : c === 'p' && t[1] === '1' ? 'q' : c; n[CH.idx(f)] = '.'; return n; }
  function caps(b, s) { var me = CH.isW(pcAt(b, s)); return tg(b, s).filter(function (t) { var c = pcAt(b, t); return c !== '.' && CH.isW(c) !== me; }); }
  function pieces(b, w) { return sqs(function (s) { return w ? isW(b, s) : isB(b, s); }); }
  function sum(b, w) { return pieces(b, w).reduce(function (a, s) { return a + v(pcAt(b, s)); }, 0); }
  /* 잡기 이득: 내가 t를 잡고, 상대가 다시 잡을 수 있으면 내 말을 잃음 */
  function gain(b, f, t) { var c = pcAt(b, f), n = mv(b, f, t); return v(pcAt(b, t)) - (att(n, t, CH.isW(c) ? 'b' : 'w').length ? v(c) : 0); }
  /* 흑 차례에 백이 잃을 수 있는 가장 큰 값과 그 잡기 */
  function threat(b) {
    var best = { v: 0, f: null, t: null };
    pieces(b, false).forEach(function (f) { caps(b, f).forEach(function (t) { var g = gain(b, f, t); if (g > best.v) best = { v: g, f: f, t: t }; }); });
    return best;
  }
  function allMoves(b) { var o = []; pieces(b, true).forEach(function (f) { tg(b, f).forEach(function (t) { o.push([f, t]); }); }); return o; }
  /* 무작위 판: list의 말을 빈칸에 놓음(폰은 1·8번 가로줄 말고), avoid 칸은 비움 */
  function put(R, b, list, ok) {
    list.forEach(function (c) { var e = sqs(function (s) { return pcAt(b, s) === '.' && !(/p/i.test(c) && (s[1] === '1' || s[1] === '8')) && (!ok || ok(s, c)); }); if (e.length) b[CH.idx(R.pick(e))] = c; });
    return b;
  }
  var SHAPE = { R: '룩은 가로·세로 줄을 따라 가요.', B: '비숍은 대각선을 따라 가요.', Q: '퀸은 가로·세로·대각선 줄을 따라 가요.', K: '킹은 둘레의 한 칸만 가요.', N: '나이트는 L자로 뛰어요.', P: '폰은 대각선 앞 한 칸에 있는 말만 잡아요.' };
  var BLACKS = ['p', 'n', 'b', 'r', 'q'], WHITES = ['P', 'N', 'B', 'R', 'Q'];
  function vtxt(c) { return nm(c) + '(' + v(c) + '점)'; }

  /* ===== 문제 틀 ===== */
  /* 이 말이 잡을 수 있는 흑 말 모두 */
  function capWhy(b, s0) {
    var c = pcAt(b, s0);
    return function (s) {
      var t = pcAt(b, s);
      if (s === s0) return { text: '그 칸은 잡는 ' + jo(nm(c), '이') + ' 서 있는 칸이에요.' };
      if (t === '.') return { text: '말이 없는 빈칸이에요. 흑 말이 있는 칸을 눌러요.', marks: M([s], 'bad') };
      if (CH.isW(t)) return { text: '그 말은 <b>내 편</b>(백) ' + jo(nm(t), '이에요') + '. 내 편 말은 잡을 수 없어요.', marks: M([s], 'bad') };
      var bt = between(s0, s).filter(function (x) { return pcAt(b, x) !== '.'; });
      if (c.toUpperCase() !== 'N' && c.toUpperCase() !== 'P' && c.toUpperCase() !== 'K' && tg(only(c, s0), s0).indexOf(s) >= 0 && bt.length) return { text: '가는 길을 다른 말이 막고 있어서 잡을 수 없어요. 줄 위에서 <b>처음 만나는 말</b>만 잡을 수 있어요.', marks: J(M([s], 'bad'), M(bt, 'ring')) };
      return { text: jo(nm(c), '은') + ' 그 흑 ' + jo(nm(t), '을') + ' 잡을 수 없어요. ' + SHAPE[c.toUpperCase()], marks: M([s], 'bad') };
    };
  }
  function capQ(R, c, o) {
    o = o || {};
    for (var tries = 0; tries < 500; tries++) {
      var s0 = R.pick(sqs(o.at || function (s) { return c !== 'P' || /[2-6]/.test(s[1]); })), b = only(c, s0), road = tg(b, s0);
      var nb = R.int(3) + (o.nb || 3), list = [];
      for (var k = 0; k < nb; k++) list.push(R.pick(o.foes || BLACKS));
      put(R, b, list, function (s) { return R.int(3) ? road.indexOf(s) >= 0 || c === 'P' : true; });
      put(R, b, Array.apply(null, Array(R.int((o.blk === undefined ? 2 : o.blk) + 1))).map(function () { return R.pick(['P', 'N', 'B']); }));
      var ans = caps(b, s0);
      if (!ans.length || ans.length > (o.max || 3)) continue;
      if (o.safe && ans.some(function (t) { return att(b, t, 'b').length; })) continue;
      return { b: b, s0: s0, ans: ans };
    }
    throw new Error('잡기 판을 못 만듦 ' + c);
  }
  function capAllQ(R, c, o) {
    var sc = capQ(R, c, o);
    return clickQ(jo(full(c), '이') + ' 잡을 수 있는 흑 말을 <b>모두</b> 눌러요.', sc.ans, { pos: sc.b, marks: M([sc.s0], 'sel') },
      [SHAPE[c], { text: jo(nm(c), '이') + ' 갈 수 있는 칸을 따라가다 흑 말을 만나면 잡을 수 있어요.', marks: M(tg(sc.b, sc.s0), 'soft') }], { all: true, kind: 'one', why: capWhy(sc.b, sc.s0) });
  }
  function capPlayQ(R, c, o) {
    var sc = capQ(R, c, o), t = R.pick(sc.ans), x = pcAt(sc.b, t);
    return playQ(jo(full(c), '으로') + ' 흑 ' + jo(nm(x), '을') + ' 잡아요. 내 말을 누르고, 잡을 말을 눌러요.', { pos: sc.b, marks: J(M([sc.s0], 'ring'), M([t], 'hi')) }, [[sc.s0, t]],
      ['잡을 때는 흑 말이 있는 칸으로 가요.', { text: '이 두 칸이에요.', marks: M([sc.s0, t], 'soft') }],
      { kind: 'one', why: function (f, s) { return f !== sc.s0 ? { text: '이번에는 ' + jo(full(c), '으로') + ' 잡아요.', marks: M([sc.s0], 'ring') } : { text: s === t ? '' : '노란 칸의 흑 ' + jo(nm(x), '을') + ' 잡아요.', marks: J(M([s], 'bad'), M([t], 'ring')) }; } });
  }
  /* 공격·지킴 판: 백 nw개, 흑 nb개 */
  function adBoard(R, nw, nb, wl, bl) {
    var b = CH.board(E), k, l = [];
    for (k = 0; k < nw; k++) l.push(R.pick(wl || WHITES)); put(R, b, l);
    l = []; for (k = 0; k < nb; k++) l.push(R.pick(bl || BLACKS)); put(R, b, l);
    return b;
  }
  /* 위험한 말 구하기 판: 백 W가 흑 A에게 공격받고 있음(그것 말고 위험한 백 말은 없음). kind: run 피하기 · guard 지키기 · block 막기 · take 잡기 · any */
  function saveScene(R, kind) {
    for (var tries = 0; tries < 1500; tries++) {
      var b = CH.board(E), W = R.pick(kind === 'guard' ? ['N', 'B', 'R'] : ['N', 'B', 'R', 'Q']), ws = R.pick(sqs(function (s) { return /[b-g][2-7]/.test(s); }));
      b[CH.idx(ws)] = W;
      var A = R.pick(kind === 'block' ? ['b', 'r', 'q'] : kind === 'guard' ? ['r', 'q', 'b', 'n'] : ['p', 'n', 'b', 'r', 'q']);
      var aPool = sqs(function (s) { if (pcAt(b, s) !== '.' || (A === 'p' && /[18]/.test(s[1]))) return false; var t = b.slice(); t[CH.idx(s)] = A; return CH.attacks(t, CH.idx(s)).indexOf(CH.idx(ws)) >= 0 && (kind !== 'block' || between(s, ws).length >= 2); });
      if (!aPool.length) continue;
      var as = R.pick(aPool); b[CH.idx(as)] = A;
      var wl = [], bl = [], k;
      for (k = 0; k < R.int(2) + 2; k++) wl.push(R.pick(['P', 'P', 'N', 'B', 'R'])); put(R, b, wl, function (s) { return between(as, ws).indexOf(s) < 0; });
      for (k = 0; k < R.int(2) + 1; k++) bl.push(R.pick(['p', 'n', 'b', 'r'])); put(R, b, bl, function (s) { return between(as, ws).indexOf(s) < 0; });
      var th = threat(b);
      if (th.v <= 0 || th.t !== ws) continue;
      var bad = false; pieces(b, false).forEach(function (f) { caps(b, f).forEach(function (t) { if (t !== ws && gain(b, f, t) > 0) bad = true; }); }); if (bad) continue;
      var moves = allMoves(b), okAll = moves.filter(function (m) { return threat(mv(b, m[0], m[1])).v <= 0; });
      var fit = function (m) {
        if (kind === 'run') return m[0] === ws;
        if (kind === 'guard') { var n = mv(b, m[0], m[1]); return m[0] !== ws && m[1] !== as && att(n, ws, 'w').length > att(b, ws, 'w').length; }
        if (kind === 'block') return m[0] !== ws && between(as, ws).indexOf(m[1]) >= 0;
        if (kind === 'take') return m[1] === as;
        return true;
      };
      var good = okAll.filter(fit), fitAll = moves.filter(fit);
      if (!good.length || good.length === moves.length || (kind !== 'any' && fitAll.length === good.length && kind !== 'take' && kind !== 'block' && kind !== 'guard')) continue;
      if (kind === 'any' && good.length > moves.length / 2) continue;
      return { b: b, W: ws, A: as, good: good, fit: fit };
    }
    throw new Error('구하기 판을 못 만듦 ' + kind);
  }
  var HOW = { run: '피해서(위험한 말을 안전한 칸으로 옮겨서)', guard: '다른 말로 지켜서', block: '사이를 막아서', take: '공격하는 말을 잡아서', any: '가장 좋은 방법으로' };
  function saveQ(R, kind) {
    var sc = saveScene(R, kind), w = pcAt(sc.b, sc.W), a = pcAt(sc.b, sc.A);
    return playQ('흑 ' + jo(nm(a), '이') + ' 백 ' + jo(nm(w), '을') + ' 공격하고 있어요! ' + HOW[kind] + ' 백 ' + jo(nm(w), '을') + ' 구해요.', { pos: sc.b, marks: J(M([sc.W], 'ring'), M([sc.A], 'bad')) }, sc.good,
      [{ run: '백 ' + jo(nm(w), '이') + ' 갈 수 있는 칸 가운데, 흑 말이 잡을 수 없는 칸을 찾아요.', guard: '다른 백 말을 움직여서 백 ' + jo(nm(w), '이') + ' 있는 칸을 공격하게(지키게) 해요.', block: '흑 ' + jo(nm(a), '과') + ' 백 ' + nm(w) + ' 사이의 빈칸에 다른 백 말을 놓아요.', take: '흑 ' + jo(nm(a), '을') + ' 잡을 수 있는 백 말이 있나요?', any: '피하기 · 지키기 · 막기 · 잡기 가운데 되는 방법을 찾아요.' }[kind],
        { text: kind === 'block' ? '이 칸들 가운데 하나예요.' : '움직이면 좋은 말이 반짝여요.', marks: kind === 'block' ? M(between(sc.A, sc.W), 'soft') : M([sc.good[0][0]], 'hint') }],
      { kind: 'deep', why: function (f, t) {
        if (!sc.fit([f, t])) return { text: '이번에는 ' + HOW[kind] + ' 구해요.', marks: M([sc.W], 'ring') };
        var n = mv(sc.b, f, t), th = threat(n);
        return th.f ? { text: '그렇게 하면 흑 ' + jo(nm(pcAt(n, th.f)), '이') + ' 백 ' + jo(nm(pcAt(n, th.t)), '을') + ' 잡아서 손해를 봐요.', marks: J(M([th.f], 'bad'), M([th.t], 'ring')) } : { text: '더 좋은 수가 있어요.' };
      } });
  }

  /* ===== 작은 대결: 킹 없이 말 몇 개로. lim 번(양쪽 합)이 지나거나 둘 곳이 없으면 남은 말 값으로 승부 ===== */
  function mini(lim) {
    function moves(p) {
      var out = []; for (var i = 0; i < 64; i++) { var c = p.b[i]; if (c === '.' || CH.isW(c) !== (p.turn === 'w') || /k/i.test(c)) continue;
        CH.pieceMoves({ b: p.b, turn: p.turn, cast: '', ep: -1 }, i).forEach(function (m) { if (!m.promo || /q/i.test(m.promo)) out.push({ from: m.from, to: m.to, cap: m.cap !== '.' ? 1 : 0, promo: m.promo }); }); }
      return out;
    }
    function play(p, m) { var b = p.b.slice(); b[m.to] = m.promo || b[m.from]; b[m.from] = '.'; return { b: b, turn: p.turn === 'w' ? 'b' : 'w', n: (p.n || 0) + 1 }; }
    function val(b, w) { var s = 0; b.forEach(function (c) { if (c !== '.' && CH.isW(c) === w) s += VAL[c.toUpperCase()]; }); return s; }
    function result(p) {
      var w = val(p.b, true), k = val(p.b, false);
      if (!k) return 'w'; if (!w) return 'b';
      if ((p.n || 0) >= lim || !moves(p).length) return w > k ? 'w' : k > w ? 'b' : 'd';
      return '';
    }
    function nega(p, d, a, bt) {
      var r = result(p); if (r) return r === 'd' ? 0 : (r === p.turn ? 1 : -1) * (1000 + d);
      var e = val(p.b, p.turn === 'w') - val(p.b, p.turn !== 'w'); if (!d) return e;
      var ms = moves(p).sort(function (x, y) { return y.cap - x.cap; }), best = -Infinity;
      for (var k = 0; k < ms.length; k++) { var s = -nega(play(p, ms[k]), d - 1, -bt, -a); if (s > best) best = s; if (s > a) a = s; if (a >= bt) break; }
      return best;
    }
    function ai(p, lv) {
      var ms = moves(p); if (!ms.length) return null;
      var depth = { 1: 1, 2: 2, 3: 3 }[lv] || 3, err = { 1: .4, 2: .12 }[lv] || 0;
      if (Math.random() < err) { var safe = ms.filter(function (m) { return m.cap; }); return Math.random() < .5 && safe.length ? safe[Math.floor(Math.random() * safe.length)] : ms[Math.floor(Math.random() * ms.length)]; }
      var best = -Infinity, pick = [];
      ms.forEach(function (m) { var s = -nega(play(p, m), depth - 1, -Infinity, Infinity); if (s > best) { best = s; pick = [m]; } else if (s === best) pick.push(m); });
      return pick[Math.floor(Math.random() * pick.length)];
    }
    function info(p) { return '남은 차례 ' + Math.max(0, Math.ceil((lim - (p.n || 0)) / 2)) + '번 · 말 값 나 ' + val(p.b, true) + ' : ' + val(p.b, false) + ' 상대'; }
    return { moves: moves, play: play, result: result, ai: ai, info: info };
  }
  var GAMES = {
    rook: { pos: '3r4/2ppp3/8/8/8/8/2PPP3/3R4', name: '룩과 폰 3개' },
    minor: { pos: '1n3b2/2pppp2/8/8/8/8/2PPPP2/1N3B2', name: '나이트·비숍과 폰 4개' },
    queen: { pos: 'r2q4/ppp5/8/8/8/8/PPP5/R2Q4', name: '퀸·룩과 폰 3개' }
  };
  function miniTask(key, lv, lim) {
    var g = GAMES[key]; lim = lim || 30;
    return { type: 'game', kind: 'deep', unit: '말', q: '🤖 작은 대결(' + g.name + ', ' + lv + '단계)! 서로 ' + (lim / 2) + '번씩 두고, 남은 말 값이 더 크면 이겨요. 상대 말을 모두 잡아도 이겨요.',
      board: { pos: g.pos }, game: mini(lim), level: lv, winText: '작은 대결에서 이겼어요! 🎉',
      loseTip: '공짜로 잡을 수 있는 말을 찾고, 내 말이 공짜로 잡히지 않게 살펴요.',
      hint: ['상대 말 가운데 지켜 주는 말이 없는 것을 찾아요.', '내 말을 움직이기 전에, 그 칸을 흑 말이 공격하는지 확인해요.'] };
  }

  /* ===== 11단원 잡기 ===== */
  function capLesson(c, id, title, says, ex, dos, gen, sumText) {
    return { id: id, title: title, kind: 'one', screens: says.concat(ex, dos), practice: { n: 8, gen: gen }, sum: sumText };
  }
  var u11 = [
    { id: 'cap-what', title: '잡기란?', kind: 'easy',
      screens: [
        { t: 'say', text: '3마당에서는 <b>잡기</b>를 배워요. 내 말이 움직여서 <b>상대 말이 있는 칸</b>에 들어가면 그 말을 <b>잡아요.</b>', board: { pos: B({ c3: 'R', c6: 'n' }), marks: J(M(['c3'], 'sel'), M(['c6'], 'ring')), arrows: [['c3', 'c6']] } },
        { t: 'say', text: '잡힌 말은 <b>판 밖으로</b> 나가서 다시는 돌아오지 못해요. 잡은 내 말은 그 칸에 서요.', board: { pos: B({ c6: 'R' }), marks: M(['c6'], 'hi') } },
        { t: 'say', text: '모든 말은 <b>움직이는 길 그대로</b> 잡아요. 룩은 룩 길로, 비숍은 비숍 길로. (폰만 달라요. 폰은 대각선 앞으로 잡아요.)', board: { pos: B({ d4: 'B', g7: 'p', b6: 'n' }), marks: J(M(['d4'], 'sel'), M(['g7', 'b6'], 'ring')) } },
        { t: 'say', text: '한 번에 <b>한 말만</b> 잡을 수 있어요. 그리고 잡기는 <b>하고 싶을 때만</b> 해요. 잡을 수 있어도 꼭 잡지 않아도 돼요.', board: { pos: B({ d4: 'Q', d7: 'r', g4: 'n' }), marks: J(M(['d4'], 'sel'), M(['d7', 'g4'], 'ring')) } },
        { t: 'say', text: '잡기를 이용해서 상대 말을 줄이면 게임에서 아주 유리해져요. 하지만 내 말도 잡힐 수 있으니 조심해야 해요. 그것을 이번 마당에서 차근차근 배워요.', board: { pos: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/2N2N2/PPPP1PPP/R1BQKB1R' } }
      ],
      practice: null },
  ];
  u11[0].screens = u11[0].screens.concat([
    { t: 'ex', text: '룩이 흑 나이트를 잡아요.', board: { pos: B({ c3: 'R', c6: 'n' }) },
      frames: [{ marks: J(M(['c3'], 'sel'), M(['c4', 'c5', 'c6'], 'dot')), cap: '룩은 세로로 c6까지 갈 수 있어요. 거기에 흑 나이트!' }, { mv: ['c3', 'c6'], marks: M(['c6'], 'hi'), cap: '룩이 c6으로 가며 나이트를 잡았어요. 나이트는 판 밖으로!' }] },
    { t: 'ex', text: '흑도 똑같이 잡아요.', board: { pos: B({ f6: 'b', c3: 'N' }) },
      frames: [{ marks: J(M(['f6'], 'sel'), M(['c3'], 'ring')), cap: '흑 비숍의 대각선 위에 백 나이트가 있어요.' }, { mv: ['f6', 'c3'], marks: M(['c3'], 'bad'), cap: '흑 비숍이 백 나이트를 잡았어요. 내 말도 잡힐 수 있어요!' }] },
    { t: 'do', task: playQ('룩으로 흑 나이트를 잡아 보세요. 룩을 누르고, 나이트를 눌러요.', { pos: B({ b2: 'R', b7: 'n' }), marks: M(['b7'], 'hi') }, [['b2', 'b7']], ['룩을 먼저 누르면 갈 수 있는 칸에 점이 나와요.', { text: '나이트가 있는 칸을 눌러요.', marks: M(['b7'], 'hint') }], { kind: 'easy' }) },
    { t: 'do', task: pickQ('잡힌 말은 어떻게 되나요?', ['판 밖으로 나가요', '옆 칸으로 밀려나요', '처음 자리로 돌아가요'], '판 밖으로 나가요', { pos: B({ b7: 'R' }) }, ['잡힌 말은 다시 돌아오지 못해요.']) }
  ]);
  u11[0].sum = '상대 말이 있는 칸으로 가면 그 말을 <b>잡아요.</b> 잡힌 말은 판 밖으로! 잡기는 하고 싶을 때만 해요.';
  u11[0].practice = { n: 8, gen: function (R) {
    var k = R.int(4);
    if (k === 0) return pickQ('잡기에 대해 맞는 말은?', R.shuffle(['상대 말이 있는 칸으로 가면 잡아요', '상대 말을 뛰어넘으면 잡아요', '상대 말 옆에 서면 잡아요']), '상대 말이 있는 칸으로 가면 잡아요', { pos: B({ d4: 'R', d7: 'n' }) }, ['룩이 나이트를 잡는 장면을 떠올려요.']);
    if (k === 1) return pickQ('잡을 수 있는 말이 있으면 꼭 잡아야 하나요?', ['꼭 잡아야 해요', '잡고 싶을 때만 잡아요'], '잡고 싶을 때만 잡아요', { pos: B({ d4: 'Q', d7: 'r' }) }, ['잡기는 내가 고르는 거예요.']);
    return capPlayQ(R, R.pick(['R', 'B', 'Q', 'N']), { blk: 0, max: 1 });
  } };
  u11 = u11.concat([
    capLesson('R', 'cap-rook', '룩으로 잡기',
      [{ t: 'say', text: '룩은 가로·세로 길을 따라가다 <b>처음 만나는 흑 말</b>을 잡을 수 있어요.', board: { pos: B({ d4: 'R', d7: 'n', g4: 'b' }), marks: J(M(['d4'], 'sel'), M(['d7', 'g4'], 'ring')) } },
       { t: 'say', text: '흑 말 <b>뒤에 있는</b> 말은 잡을 수 없어요. 앞의 말이 길을 막고 있거든요. 내 편 말이 막아도 마찬가지예요.', board: { pos: B({ d4: 'R', d6: 'p', d8: 'q', b4: 'P', a4: 'n' }), marks: J(M(['d4'], 'sel'), M(['d6'], 'ring'), M(['d8', 'a4'], 'x')) } }],
      [{ t: 'ex', text: '네 방향을 살피며 잡을 수 있는 말을 찾아요.', board: { pos: B({ e4: 'R', e7: 'n', e8: 'q', b4: 'p', e2: 'P', h4: 'b' }) },
         frames: [{ marks: M(['e4'], 'sel'), cap: '룩 둘레를 살펴요.' }, { marks: J(M(['e4'], 'sel'), M(['e7'], 'ring'), M(['e8'], 'x')), cap: '위: e7의 나이트(그 뒤 퀸은 못 잡아요)' }, { marks: J(M(['e4'], 'sel'), M(['e7', 'b4', 'h4'], 'ring')), cap: '왼쪽 b4 폰, 오른쪽 h4 비숍도! 아래는 내 폰이라 못 잡아요.' }, { mv: ['e4', 'h4'], marks: M(['h4'], 'hi'), cap: '비숍을 잡았어요.' }] }],
      [{ t: 'do', task: clickQ('룩이 잡을 수 있는 흑 말을 <b>모두</b> 눌러 보세요.', caps(B({ c3: 'R', c7: 'b', c8: 'r', f3: 'n', a3: 'P', c1: 'b' }), 'c3'), { pos: B({ c3: 'R', c7: 'b', c8: 'r', f3: 'n', a3: 'P', c1: 'b' }), marks: M(['c3'], 'sel') }, ['네 방향으로 가다 처음 만나는 흑 말을 찾아요.', { text: '이 줄들이에요.', marks: M(tg(B({ c3: 'R', c7: 'b', c8: 'r', f3: 'n', a3: 'P', c1: 'b' }), 'c3'), 'soft') }], { all: true, why: capWhy(B({ c3: 'R', c7: 'b', c8: 'r', f3: 'n', a3: 'P', c1: 'b' }), 'c3') }) }],
      function (R) { return R.int(2) ? capAllQ(R, 'R') : capPlayQ(R, 'R'); },
      '룩은 가로·세로로 가다 <b>처음 만나는 흑 말</b>을 잡아요. 그 뒤의 말은 못 잡아요.'),
    capLesson('B', 'cap-bishop', '비숍으로 잡기',
      [{ t: 'say', text: '비숍은 대각선 길을 따라가다 처음 만나는 흑 말을 잡아요.', board: { pos: B({ c1: 'B', f4: 'n', a3: 'p' }), marks: J(M(['c1'], 'sel'), M(['f4', 'a3'], 'ring')) } },
       { t: 'say', text: '비숍은 한 가지 색 칸만 다니니까, <b>다른 색 칸</b>에 있는 말은 절대 잡지 못해요.', board: { pos: B({ c1: 'B', c4: 'q' }), marks: J(M(['c1'], 'sel'), M(['c4'], 'x')) } }],
      [{ t: 'ex', text: '비숍이 잡을 수 있는 말', board: { pos: B({ d4: 'B', f6: 'r', g7: 'q', b2: 'n', a7: 'p', e4: 'p' }) },
         frames: [{ marks: J(M(['d4'], 'sel'), M(['f6', 'b2', 'a7'], 'ring'), M(['g7', 'e4'], 'x')), cap: 'f6 룩, b2 나이트, a7 폰을 잡을 수 있어요. g7 퀸은 룩 뒤, e4 폰은 대각선이 아니에요.' }, { mv: ['d4', 'f6'], marks: M(['f6'], 'hi'), cap: '가장 값진 룩을 잡았어요.' }] }],
      [{ t: 'do', task: clickQ('비숍이 잡을 수 있는 흑 말을 <b>모두</b> 눌러 보세요.', caps(B({ e3: 'B', b6: 'r', g5: 'n', h6: 'q', e6: 'p', c1: 'n' }), 'e3'), { pos: B({ e3: 'B', b6: 'r', g5: 'n', h6: 'q', e6: 'p', c1: 'n' }), marks: M(['e3'], 'sel') }, ['네 대각선을 따라가요.', { text: '이 칸들이에요.', marks: M(tg(B({ e3: 'B', b6: 'r', g5: 'n', h6: 'q', e6: 'p', c1: 'n' }), 'e3'), 'soft') }], { all: true, why: capWhy(B({ e3: 'B', b6: 'r', g5: 'n', h6: 'q', e6: 'p', c1: 'n' }), 'e3') }) }],
      function (R) { return R.int(2) ? capAllQ(R, 'B') : capPlayQ(R, 'B'); },
      '비숍은 대각선으로 가다 처음 만나는 흑 말을 잡아요. 다른 색 칸의 말은 못 잡아요.'),
    capLesson('Q', 'cap-queen', '퀸으로 잡기',
      [{ t: 'say', text: '퀸은 여덟 방향 어디로든 가다 처음 만나는 흑 말을 잡아요. 그래서 잡을 수 있는 말이 아주 많아요.', board: { pos: B({ d4: 'Q', d8: 'r', g7: 'b', a4: 'n', b2: 'p' }), marks: J(M(['d4'], 'sel'), M(['d8', 'g7', 'a4', 'b2'], 'ring')) } },
       { t: 'say', text: '하지만 퀸은 가장 값진 말이라 함부로 잡으러 갔다가 잡히면 큰일이에요. 이것은 ‘지켜진 말’에서 배워요.', board: { pos: B({ d4: 'Q' }), marks: M(['d4'], 'sel') } }],
      [{ t: 'ex', text: '퀸이 여러 방향으로 잡을 수 있어요.', board: { pos: B({ e5: 'Q', e8: 'r', b8: 'n', h2: 'b', a5: 'p', e2: 'P' }) },
         frames: [{ marks: J(M(['e5'], 'sel'), M(caps(B({ e5: 'Q', e8: 'r', b8: 'n', h2: 'b', a5: 'p', e2: 'P' }), 'e5'), 'ring')), cap: '룩 길과 비숍 길 모두 살펴요.' }, { mv: ['e5', 'e8'], marks: M(['e8'], 'hi'), cap: '룩을 잡았어요.' }] }],
      [{ t: 'do', task: clickQ('퀸이 잡을 수 있는 흑 말을 <b>모두</b> 눌러 보세요.', caps(B({ c4: 'Q', c8: 'b', f7: 'n', g4: 'r', a2: 'p', a6: 'q', c2: 'P' }), 'c4'), { pos: B({ c4: 'Q', c8: 'b', f7: 'n', g4: 'r', a2: 'p', a6: 'q', c2: 'P' }), marks: M(['c4'], 'sel') }, ['여덟 방향을 차례로 살펴요.', { text: '이 칸들이에요.', marks: M(tg(B({ c4: 'Q', c8: 'b', f7: 'n', g4: 'r', a2: 'p', a6: 'q', c2: 'P' }), 'c4'), 'soft') }], { all: true, why: capWhy(B({ c4: 'Q', c8: 'b', f7: 'n', g4: 'r', a2: 'p', a6: 'q', c2: 'P' }), 'c4') }) }],
      function (R) { return R.int(2) ? capAllQ(R, 'Q', { max: 4 }) : capPlayQ(R, 'Q'); },
      '퀸은 여덟 방향으로 가다 처음 만나는 흑 말을 잡아요.'),
    capLesson('N', 'cap-knight', '나이트로 잡기',
      [{ t: 'say', text: '나이트는 <b>L자로 뛰어 내려앉는 칸</b>에 흑 말이 있으면 잡아요.', board: { pos: B({ d4: 'N', e6: 'r', c2: 'p' }), marks: J(M(['d4'], 'sel'), M(['e6', 'c2'], 'ring')) } },
       { t: 'say', text: '나이트는 뛰어넘으니까 <b>사이에 말이 있어도</b> 잡을 수 있어요. 바로 옆에 있는 말은 못 잡아요!', board: { pos: B({ d4: 'N', d5: 'p', e5: 'p', f5: 'q', e4: 'b' }), marks: J(M(['d4'], 'sel'), M(['f5'], 'ring'), M(['d5', 'e5', 'e4'], 'x')) } }],
      [{ t: 'ex', text: '나이트는 막혀도 잡아요.', board: { pos: B({ g1: 'N', f2: 'P', g2: 'P', h2: 'P', f3: 'b', h3: 'p' }) },
         frames: [{ marks: J(M(['g1'], 'sel'), M(['f3', 'h3'], 'ring')), cap: '폰들이 있어도 나이트는 f3·h3으로 뛰어요.' }, { mv: ['g1', 'f3'], marks: M(['f3'], 'hi'), cap: '폰을 뛰어넘어 비숍을 잡았어요!' }] }],
      [{ t: 'do', task: clickQ('나이트가 잡을 수 있는 흑 말을 <b>모두</b> 눌러 보세요.', caps(B({ e4: 'N', f6: 'q', d6: 'b', e5: 'r', c3: 'p', g5: 'P', d4: 'n' }), 'e4'), { pos: B({ e4: 'N', f6: 'q', d6: 'b', e5: 'r', c3: 'p', g5: 'P', d4: 'n' }), marks: M(['e4'], 'sel') }, ['L자 끝 칸에 있는 흑 말만이에요.', { text: 'L자 끝 칸들이에요.', marks: M(tg(B({ e4: 'N' }), 'e4'), 'soft') }], { all: true, why: capWhy(B({ e4: 'N', f6: 'q', d6: 'b', e5: 'r', c3: 'p', g5: 'P', d4: 'n' }), 'e4') }) }],
      function (R) { return R.int(2) ? capAllQ(R, 'N', { blk: 3 }) : capPlayQ(R, 'N'); },
      '나이트는 <b>L자 끝 칸</b>의 흑 말을 잡아요. 사이에 말이 있어도 괜찮아요.'),
    capLesson('P', 'cap-pawn', '폰으로 잡기',
      [{ t: 'say', text: '2마당에서 배운 것을 다시 봐요. 폰은 <b>대각선 앞 한 칸</b>에 있는 흑 말을 잡아요. 바로 앞의 말은 못 잡아요.', board: { pos: B({ d4: 'P', c5: 'n', e5: 'b', d5: 'r' }), marks: J(M(['d4'], 'sel'), M(['c5', 'e5'], 'ring'), M(['d5'], 'x')) } },
       { t: 'say', text: '폰은 가장 값이 작은 말이지만, 폰으로 퀸이나 룩을 잡으면 아주 큰 이득이에요. 폰의 대각선 앞은 상대에게 무서운 자리예요.', board: { pos: B({ e4: 'P', d5: 'q' }), marks: J(M(['e4'], 'sel'), M(['d5'], 'ring')) } }],
      [{ t: 'ex', text: '폰이 둘 중 하나를 골라 잡아요.', board: { pos: B({ e4: 'P', d5: 'p', f5: 'r' }) },
         frames: [{ marks: J(M(['e4'], 'sel'), M(['d5', 'f5'], 'ring')), cap: '대각선 앞에 폰과 룩이 있어요.' }, { mv: ['e4', 'f5'], marks: M(['f5'], 'hi'), cap: '더 값진 룩을 잡았어요!' }] }],
      [{ t: 'do', task: clickQ('백 폰들이 잡을 수 있는 흑 말을 <b>모두</b> 눌러 보세요.', ['c5', 'e4', 'g4'], { pos: B({ b4: 'P', d4: 'P', c5: 'n', d5: 'p', f3: 'P', g4: 'b', e4: 'r' }) }, ['백 폰마다 대각선 앞(위쪽) 두 칸을 봐요.', { text: '이 칸들을 살펴요.', marks: M(['a5', 'c5', 'e5', 'e4', 'g4'], 'soft') }], { all: true, why: function (s) { return { text: '그 칸의 말은 어느 백 폰의 대각선 앞에도 없어요.', marks: M([s], 'bad') }; } }) }],
      function (R) { return R.int(2) ? capAllQ(R, 'P', { nb: 2, blk: 0 }) : capPlayQ(R, 'P', { nb: 2, blk: 0 }); },
      '폰은 <b>대각선 앞 한 칸</b>의 흑 말을 잡아요. 앞의 말은 못 잡아요.'),
    capLesson('K', 'cap-king', '킹으로 잡기',
      [{ t: 'say', text: '킹도 잡을 수 있어요. 킹은 둘레 한 칸에 있는 흑 말을 잡아요.', board: { pos: B({ e4: 'K', d5: 'p', f3: 'n' }), marks: J(M(['e4'], 'sel'), M(['d5', 'f3'], 'ring')) } },
       { t: 'say', text: '⚠️ 그런데 킹은 <b>다른 흑 말이 지켜 주는 말</b>은 잡을 수 없어요. 잡으면 킹이 공격받는 칸에 서게 되거든요. 이 규칙은 4마당 ‘체크’에서 자세히 배워요. 이번에는 지켜 주는 말이 없는 판으로 연습해요.', board: { pos: B({ e4: 'K', d5: 'p', c6: 'p' }), marks: J(M(['e4'], 'sel'), M(['d5'], 'x'), M(['c6'], 'ring')) } }],
      [{ t: 'ex', text: '킹이 한 칸 옆의 말을 잡아요.', board: { pos: B({ g2: 'K', h3: 'p', f1: 'n' }) },
         frames: [{ marks: J(M(['g2'], 'sel'), M(['h3', 'f1'], 'ring')), cap: '둘레에 흑 폰과 나이트가 있어요.' }, { mv: ['g2', 'f1'], marks: M(['f1'], 'hi'), cap: '나이트를 잡았어요.' }] }],
      [{ t: 'do', task: clickQ('킹이 잡을 수 있는 흑 말을 <b>모두</b> 눌러 보세요.', ['d3', 'e5'], { pos: B({ e4: 'K', d3: 'b', e5: 'n', g7: 'r', e2: 'p' }), marks: M(['e4'], 'sel') }, ['킹 둘레 한 칸만 봐요.', { text: '킹 둘레예요.', marks: M(tg(B({ e4: 'K' }), 'e4'), 'soft') }], { all: true, why: capWhy(B({ e4: 'K', d3: 'b', e5: 'n', g7: 'r', e2: 'p' }), 'e4') }) }],
      function (R) { var T = R.int(2) ? capAllQ(R, 'K', { safe: true, nb: 2, foes: ['p', 'n', 'b', 'r'] }) : capPlayQ(R, 'K', { safe: true, nb: 2, foes: ['p', 'n', 'b', 'r'] }); return T; },
      '킹은 둘레 한 칸의 흑 말을 잡아요. (지켜진 말은 못 잡아요 — 4마당에서)'),
    { id: 'cap-own', title: '내 편 말은 못 잡아요', kind: 'easy',
      screens: [
        { t: 'say', text: '체스에서는 <b>상대 말만</b> 잡을 수 있어요. 내 편 말이 있는 칸으로는 갈 수도, 잡을 수도 없어요.', board: { pos: B({ d4: 'R', d7: 'N', g4: 'n' }), marks: J(M(['d4'], 'sel'), M(['d7'], 'x'), M(['g4'], 'ring')) } },
        { t: 'say', text: '백은 흑 말만, 흑은 백 말만 잡아요. 색을 잘 보세요!', board: { pos: B({ c3: 'B', f6: 'B', e5: 'n' }), marks: J(M(['c3'], 'sel'), M(['f6'], 'x')) } },
        { t: 'say', text: '내 편 말은 길을 막는 벽이에요. 내 편 말 뒤에 있는 흑 말도 못 잡아요.', board: { pos: B({ a1: 'R', a4: 'P', a7: 'q' }), marks: J(M(['a1'], 'sel'), M(['a4'], 'ring'), M(['a7'], 'x')) } },
        { t: 'ex', text: '잡을 수 있는 말과 없는 말', board: { pos: B({ d4: 'Q', d6: 'P', d8: 'r', f6: 'n', b6: 'B', g4: 'N', a4: 'p' }) },
          frames: [{ marks: J(M(['d4'], 'sel'), M(['d6', 'b6', 'g4'], 'x')), cap: '백 말(d6 폰, b6 비숍, g4 나이트)은 못 잡아요.' }, { marks: J(M(['d4'], 'sel'), M(['d8'], 'x')), cap: 'd8 룩은 내 폰 뒤라 못 잡아요.' }, { marks: J(M(['d4'], 'sel'), M(['f6', 'a4'], 'ok')), cap: 'f6 나이트와 a4 폰은 잡을 수 있어요!' }] },
        { t: 'do', task: pickQ('백 룩이 d7의 백 나이트를 잡을 수 있나요?', ['잡을 수 있어요', '잡을 수 없어요'], '잡을 수 없어요', { pos: B({ d4: 'R', d7: 'N' }), marks: J(M(['d4'], 'sel'), M(['d7'], 'ring')) }, ['두 말의 색을 봐요.']) },
        { t: 'do', task: clickQ('퀸이 잡을 수 있는 말을 <b>모두</b> 눌러 보세요.', caps(B({ d4: 'Q', d6: 'P', d8: 'r', f6: 'n', b6: 'B', g4: 'N', a4: 'p' }), 'd4'), { pos: B({ d4: 'Q', d6: 'P', d8: 'r', f6: 'n', b6: 'B', g4: 'N', a4: 'p' }), marks: M(['d4'], 'sel') }, ['흑 말(검은 말)만 잡을 수 있어요.', { text: '이 줄들이에요.', marks: M(tg(B({ d4: 'Q', d6: 'P', d8: 'r', f6: 'n', b6: 'B', g4: 'N', a4: 'p' }), 'd4'), 'soft') }], { all: true, why: capWhy(B({ d4: 'Q', d6: 'P', d8: 'r', f6: 'n', b6: 'B', g4: 'N', a4: 'p' }), 'd4') }) }
      ],
      practice: { n: 8, gen: function (R) {
        var c = R.pick(['R', 'B', 'Q', 'N']);
        if (R.int(3) === 0) { var sc = capQ(R, c, { blk: 3 }), own = pieces(sc.b, true).filter(function (s) { return s !== sc.s0; }), s = R.pick(own.length ? own.concat(sc.ans) : sc.ans), ok = isB(sc.b, s);
          return pickQ(jo(full(c), '이') + ' 동그라미 칸의 말을 잡을 수 있나요?', ['잡을 수 있어요', '잡을 수 없어요'], ok ? '잡을 수 있어요' : '잡을 수 없어요', { pos: sc.b, marks: J(M([sc.s0], 'sel'), M([s], 'ring')) }, ['말의 색을 보고, 갈 수 있는 칸인지도 봐요.']); }
        return capAllQ(R, c, { blk: 3 });
      } },
      sum: '내 편 말은 <b>잡을 수 없어요.</b> 내 편 말은 길을 막는 벽이에요.' }
  ]);

  /* ===== 12단원 공격과 지킴 ===== */
  function underQ(R) {
    for (var t = 0; t < 400; t++) {
      var b = adBoard(R, R.int(2) + 3, R.int(2) + 2), w = pieces(b, true), ans = w.filter(function (s) { return att(b, s, 'b').length; });
      if (!ans.length || ans.length > 2 || ans.length === w.length) continue;
      return clickQ('흑 말에게 <b>공격받고 있는</b> 백 말을 <b>모두</b> 눌러요.', ans, { pos: b }, ['흑 말마다 잡을 수 있는 칸을 따라가 봐요. 그 칸에 백 말이 있나요?', { text: '공격받는 말 하나가 반짝여요.', marks: M([ans[0]], 'hint') }],
        { all: true, kind: 'one', why: function (s) { return isW(b, s) ? { text: '그 백 말은 지금 어떤 흑 말도 잡을 수 없는 자리에 있어요.', marks: M([s], 'bad') } : { text: '백 말(흰 말) 가운데에서 찾아요.', marks: M([s], 'bad') }; } });
    }
  }
  function byQ(R) {
    for (var t = 0; t < 400; t++) {
      var b = adBoard(R, R.int(2) + 2, R.int(2) + 3), w = pieces(b, true).filter(function (s) { var a = att(b, s, 'b').length; return a >= 1 && a <= 3; });
      if (!w.length) continue;
      var s0 = R.pick(w), ans = att(b, s0, 'b');
      if (ans.length === pieces(b, false).length && R.int(2)) continue;
      return clickQ('동그라미 친 백 ' + jo(nm(pcAt(b, s0)), '을') + ' <b>공격하는</b> 흑 말을 <b>모두</b> 눌러요.', ans, { pos: b, marks: M([s0], 'ring') }, ['흑 말마다 동그라미 칸으로 갈 수 있는지 따져요.', { text: '공격하는 말 하나가 반짝여요.', marks: M([ans[0]], 'hint') }],
        { all: true, kind: 'one', why: function (s) { var c = pcAt(b, s); return c !== '.' && !CH.isW(c) ? { text: '그 흑 ' + jo(nm(c), '은') + ' 동그라미 칸으로 갈 수 없어요. ' + SHAPE[c.toUpperCase()], marks: M([s], 'bad') } : { text: '흑 말(검은 말) 가운데에서 찾아요.', marks: M([s], 'bad') }; } });
    }
  }
  function defQ(R) {
    for (var t = 0; t < 400; t++) {
      var b = adBoard(R, R.int(2) + 3, R.int(2) + 1), w = pieces(b, true).filter(function (s) { var a = att(b, s, 'w').length; return a >= 1 && a <= 2; });
      if (!w.length) continue;
      var s0 = R.pick(w), ans = att(b, s0, 'w');
      return clickQ('동그라미 친 백 ' + jo(nm(pcAt(b, s0)), '을') + ' <b>지켜 주는</b> 백 말을 <b>모두</b> 눌러요.', ans, { pos: b, marks: M([s0], 'ring') }, ['동그라미 말이 잡히면 그 칸으로 가서 다시 잡을 수 있는 백 말이 지켜 주는 말이에요.', { text: '지켜 주는 말 하나가 반짝여요.', marks: M([ans[0]], 'hint') }],
        { all: true, kind: 'one', why: function (s) { var c = pcAt(b, s); return c !== '.' && CH.isW(c) ? { text: s === s0 ? '동그라미 말 말고, 그 말을 지켜 주는 다른 백 말을 찾아요.' : '그 백 ' + jo(nm(c), '은') + ' 동그라미 칸으로 갈 수 없어서 지켜 주지 못해요.', marks: M([s], 'bad') } : { text: '지켜 주는 말은 내 편(백) 말이에요.', marks: M([s], 'bad') }; } });
    }
  }
  function aloneQ(R) {
    for (var t = 0; t < 400; t++) {
      var b = adBoard(R, R.int(2) + 4, 1), w = pieces(b, true), ans = w.filter(function (s) { return !att(b, s, 'w').length; });
      if (!ans.length || ans.length > 2 || ans.length === w.length) continue;
      return clickQ('지켜 주는 말이 <b>없는</b>(혼자 있는) 백 말을 <b>모두</b> 눌러요.', ans, { pos: b }, ['백 말마다, 다른 백 말이 그 칸으로 갈 수 있는지 따져요.', { text: '혼자 있는 말 하나가 반짝여요.', marks: M([ans[0]], 'hint') }],
        { all: true, kind: 'one', why: function (s) { return isW(b, s) ? { text: '그 백 말은 다른 백 말이 지켜 주고 있어요.', marks: J(M([s], 'bad'), M(att(b, s, 'w'), 'ring')) } : { text: '백 말 가운데에서 찾아요.', marks: M([s], 'bad') }; } });
    }
  }
  function freeQ(R) {
    for (var t = 0; t < 600; t++) {
      var b = adBoard(R, R.int(2) + 2, R.int(2) + 3, ['N', 'B', 'R', 'Q'], ['p', 'n', 'b', 'r', 'q']), good = [], badCap = [];
      allMoves(b).forEach(function (m) { if (isB(b, m[1])) { if (!att(mv(b, m[0], m[1]), m[1], 'b').length) good.push(m); else badCap.push(m); } });
      if (!good.length || good.length > 2 || !badCap.length) continue;
      return playQ('<b>공짜로</b>(다시 잡히지 않게) 잡을 수 있는 흑 말을 잡아요.', { pos: b }, good,
        ['흑 말마다 지켜 주는 흑 말이 있는지 살펴요.', { text: '공짜인 흑 말이 반짝여요.', marks: M([good[0][1]], 'hint') }],
        { kind: 'one', why: function (f, s) { if (!isB(b, s)) return { text: '이번에는 흑 말을 잡아요.' }; var d = att(mv(b, f, s), s, 'b'); if (!d.length) return { text: '더 좋은 잡기가 있어요.', marks: M([s], 'bad') }; return { text: '그 흑 ' + jo(nm(pcAt(b, s)), '은') + ' 지켜지고 있어요. 잡으면 흑 ' + jo(nm(pcAt(b, d[0])), '이') + ' 내 ' + jo(nm(pcAt(b, f)), '을') + ' 다시 잡아요.', marks: J(M([s], 'bad'), M(d, 'ring')) }; } });
    }
  }
  function careQ(R) {
    for (var t = 0; t < 600; t++) {
      var b = adBoard(R, 1, R.int(2) + 2, ['N', 'B', 'R', 'Q']), f = pieces(b, true)[0], cs = caps(b, f);
      if (!cs.length) continue;
      var s = R.pick(cs), d = att(mv(b, f, s), s, 'b').length, a = pcAt(b, f), x = pcAt(b, s);
      if (d && v(a) <= v(x)) continue;
      return pickQ('백 ' + jo(nm(a), '으로') + ' 동그라미 친 흑 ' + jo(nm(x), '을') + ' 잡아도 될까요?', ['잡아도 돼요', '잡으면 안 돼요'], d ? '잡으면 안 돼요' : '잡아도 돼요', { pos: b, marks: J(M([f], 'sel'), M([s], 'ring')) },
        ['그 흑 말을 지켜 주는 흑 말이 있나요?', '지켜진 말을 잡으면 내 말이 다시 잡혀요. 내 말이 더 값지면 손해예요.'], { kind: 'one' });
    }
  }
  var u12 = [
    { id: 'atk-under', title: '공격받는 말', kind: 'one',
      screens: [
        { t: 'say', text: '상대 말이 <b>다음 차례에 잡을 수 있는</b> 자리에 내 말이 있으면, 내 말이 <b>공격받고 있다</b>고 해요.', board: { pos: B({ d4: 'N', d8: 'r' }), marks: J(M(['d4'], 'ring'), M(['d8'], 'bad')), arrows: [['d8', 'd4']] } },
        { t: 'say', text: '공격받는 말을 그대로 두면 상대가 잡아 갈 수 있어요. 그래서 상대가 한 수를 두면 늘 <b>“내 말 가운데 공격받는 것이 있나?”</b> 살펴봐야 해요.', board: { pos: B({ d4: 'N', d8: 'r', b2: 'B', g7: 'n' }), marks: M(['d4'], 'ring') } },
        { t: 'say', text: '찾는 방법: 흑 말을 하나씩 보며 <b>그 말이 잡을 수 있는 칸</b>을 따라가요. 그 칸에 백 말이 있으면 공격받는 말이에요.', board: { pos: B({ d4: 'N', d8: 'r', b2: 'B', g7: 'n' }), marks: J(M(['d8', 'g7'], 'sel'), M(tg(B({ d4: 'N', d8: 'r', b2: 'B', g7: 'n' }), 'd8').concat(tg(B({ d4: 'N', d8: 'r', b2: 'B', g7: 'n' }), 'g7')), 'soft')) } },
        { t: 'ex', text: '흑 말을 하나씩 살펴요.', board: { pos: B({ c3: 'B', f4: 'R', e6: 'n', h6: 'b', a1: 'N' }) },
          frames: [{ marks: J(M(['e6'], 'sel'), M(tg(B({ c3: 'B', f4: 'R', e6: 'n', h6: 'b', a1: 'N' }), 'e6'), 'soft'), M(['f4'], 'bad')), cap: '흑 나이트 e6 → f4의 백 룩을 공격해요!' }, { marks: J(M(['h6'], 'sel'), M(tg(B({ c3: 'B', f4: 'R', e6: 'n', h6: 'b', a1: 'N' }), 'h6'), 'soft'), M(['f4'], 'bad')), cap: '흑 비숍 h6 → f4의 룩을 또 공격해요.' }, { marks: M(['f4'], 'bad'), cap: '공격받는 백 말은 f4의 룩이에요. c3 비숍과 a1 나이트는 안전해요.' }] },
        { t: 'do', task: clickQ('흑 말에게 공격받고 있는 백 말을 <b>모두</b> 눌러 보세요.', ['c4', 'g2', 'e1'].filter(function (s) { return att(B({ c4: 'B', g2: 'N', e1: 'R', c7: 'r', e3: 'p', h4: 'b' }), s, 'b').length; }), { pos: B({ c4: 'B', g2: 'N', e1: 'R', c7: 'r', e3: 'p', h4: 'b' }) }, ['흑 말이 잡을 수 있는 칸을 따라가요.', { text: '이 백 말들을 살펴요.', marks: M(['c4', 'g2', 'e1'], 'soft') }], { all: true, why: function (s) { return { text: '그 말은 공격받고 있지 않아요.', marks: M([s], 'bad') }; } }) }
      ],
      practice: { n: 8, gen: function (R) { return underQ(R); } },
      sum: '상대가 다음 차례에 잡을 수 있는 내 말은 <b>공격받는 말</b>이에요. 상대가 둘 때마다 꼭 살펴요.' },
    { id: 'atk-by', title: '공격하는 말', kind: 'one',
      screens: [
        { t: 'say', text: '내 말이 공격받고 있으면 <b>누가</b> 공격하는지 알아야 해요. 공격하는 말을 알아야 구할 방법도 찾을 수 있어요.', board: { pos: B({ e4: 'R', e8: 'q', c2: 'n' }), marks: J(M(['e4'], 'ring'), M(['e8', 'c2'], 'bad')) } },
        { t: 'say', text: '거꾸로 생각하는 방법: 공격받는 칸에서 <b>룩 길·비숍 길·나이트 자리·폰 자리</b>를 살펴, 거기 있는 흑 말이 그 길로 움직이는 말인지 확인해요.', board: { pos: B({ e4: 'R', e8: 'q', c2: 'n' }), marks: J(M(['e4'], 'ring'), M(['e5', 'e6', 'e7', 'e8'], 'soft'), M(['c2'], 'soft')) } },
        { t: 'ex', text: '공격하는 말을 찾아요.', board: { pos: B({ d5: 'B', b7: 'q', d8: 'r', f6: 'n', e7: 'b' }) },
          frames: [{ marks: M(['d5'], 'ring'), cap: 'd5의 백 비숍을 공격하는 흑 말은?' }, { marks: J(M(['d5'], 'ring'), M(['b7'], 'bad')), arrows: [['b7', 'd5']], cap: 'b7 퀸: 대각선으로 공격!' }, { marks: J(M(['d5'], 'ring'), M(['b7', 'd8'], 'bad')), arrows: [['d8', 'd5']], cap: 'd8 룩: 세로로 공격!' }, { marks: J(M(['d5'], 'ring'), M(['b7', 'd8', 'f6'], 'bad'), M(['e7'], 'x')), cap: 'f6 나이트도! e7 비숍은 대각선이 아니라서 아니에요.' }] },
        { t: 'do', task: clickQ('동그라미 친 백 룩을 공격하는 흑 말을 <b>모두</b> 눌러 보세요.', att(B({ d4: 'R', d7: 'r', b6: 'n', f6: 'b', g4: 'q', a4: 'P' }), 'd4', 'b'), { pos: B({ d4: 'R', d7: 'r', b6: 'n', f6: 'b', g4: 'q', a4: 'P' }), marks: M(['d4'], 'ring') }, ['흑 말마다 d4로 갈 수 있는지 따져요.', { text: '이 말들을 살펴요.', marks: M(['d7', 'b6', 'f6', 'g4'], 'soft') }], { all: true, why: function (s) { return { text: '그 말은 d4로 갈 수 없어요.', marks: M([s], 'bad') }; } }) }
      ],
      practice: { n: 8, gen: function (R) { return byQ(R); } },
      sum: '공격하는 말을 찾을 때는 공격받는 칸에서 <b>거꾸로</b> 룩 길·비숍 길·나이트 자리·폰 자리를 살펴요.' },
    { id: 'atk-multi', title: '여러 말이 공격할 때', kind: 'one',
      screens: [
        { t: 'say', text: '한 말을 <b>여러 말이 함께</b> 공격할 수도 있어요. 그러면 더 위험해요.', board: { pos: B({ e5: 'N', e8: 'r', c7: 'b', g6: 'n' }), marks: J(M(['e5'], 'ring'), M(['e8', 'c7'], 'bad')) } },
        { t: 'say', text: '거꾸로, 내 말 여러 개가 상대 말 하나를 함께 공격할 수도 있어요. 공격하는 말의 수를 세는 연습을 해요.', board: { pos: B({ d5: 'n', d1: 'R', b3: 'B', f4: 'P' }), marks: J(M(['d5'], 'ring'), M(['d1', 'b3'], 'ok')) } },
        { t: 'ex', text: '공격하는 말을 세어요.', board: { pos: B({ f5: 'B', f8: 'r', d7: 'n', h7: 'b', c2: 'q' }) },
          frames: [{ marks: M(['f5'], 'ring'), cap: 'f5의 백 비숍을 몇 개의 흑 말이 공격할까요?' }, { marks: J(M(['f5'], 'ring'), M(att(B({ f5: 'B', f8: 'r', d7: 'n', h7: 'b', c2: 'q' }), 'f5', 'b'), 'bad')), cap: '모두 ' + att(B({ f5: 'B', f8: 'r', d7: 'n', h7: 'b', c2: 'q' }), 'f5', 'b').length + '개예요!' }] },
        { t: 'do', task: pickQ('동그라미 친 백 나이트를 공격하는 흑 말은 몇 개인가요?', ['1개', '2개', '3개', '4개'], att(B({ e4: 'N', e8: 'r', b7: 'b', c5: 'p', g3: 'n', h4: 'q' }), 'e4', 'b').length + '개', { pos: B({ e4: 'N', e8: 'r', b7: 'b', c5: 'p', g3: 'n', h4: 'q' }), marks: M(['e4'], 'ring') }, ['흑 말을 하나씩 따져요.', { text: '이 말들을 살펴요.', marks: M(['e8', 'b7', 'c5', 'g3', 'h4'], 'soft') }]) }
      ],
      practice: { n: 8, gen: function (R) {
        if (R.int(2)) return byQ(R);
        for (var t = 0; t < 400; t++) { var b = adBoard(R, R.int(2) + 1, R.int(3) + 3), w = pieces(b, true).filter(function (s) { return att(b, s, 'b').length >= 1; }); if (!w.length) continue;
          var s0 = R.pick(w), n = att(b, s0, 'b').length;
          return pickQ('동그라미 친 백 ' + jo(nm(pcAt(b, s0)), '을') + ' 공격하는 흑 말은 몇 개인가요?', R.opts(n + '개', ['1개', '2개', '3개', '4개', '5개']), n + '개', { pos: b, marks: M([s0], 'ring') }, ['흑 말을 하나씩 따져요.', { text: '공격하는 말 하나가 반짝여요.', marks: M([att(b, s0, 'b')[0]], 'hint') }]); }
      } },
      sum: '한 말을 <b>여러 말이 함께</b> 공격할 수 있어요. 공격하는 말을 빠짐없이 세어요.' },
    { id: 'def-who', title: '지켜 주는 말', kind: 'one',
      screens: [
        { t: 'say', text: '내 말 A가 있는 칸을 <b>내 편 말 B도 갈 수 있으면</b>, B가 A를 <b>지켜 준다</b>고 해요.', board: { pos: B({ d4: 'N', d1: 'R' }), marks: J(M(['d4'], 'ring'), M(['d1'], 'ok')), arrows: [['d1', 'd4']] } },
        { t: 'say', text: '왜 ‘지킨다’고 할까요? 상대가 A를 잡으면, B가 그 칸으로 가서 <b>잡은 말을 다시 잡을 수 있기</b> 때문이에요.', board: { pos: B({ d4: 'N', d1: 'R', d8: 'r' }), marks: J(M(['d4'], 'ring'), M(['d8'], 'bad'), M(['d1'], 'ok')) } },
        { t: 'ex', text: '지켜진 나이트를 흑 룩이 잡으면…', board: { pos: B({ d4: 'N', d1: 'R', d8: 'r' }) },
          frames: [{ marks: J(M(['d4'], 'ring'), M(['d1'], 'ok')), cap: 'd4 나이트는 d1 룩이 지켜 줘요.' }, { mv: ['d8', 'd4'], marks: M(['d4'], 'bad'), cap: '흑 룩이 나이트를 잡았어요.' }, { mv: ['d1', 'd4'], marks: M(['d4'], 'ok'), cap: '백 룩이 흑 룩을 다시 잡아요! 나이트(3점)를 주고 룩(5점)을 얻었어요.' }] },
        { t: 'ex', text: '폰은 대각선 앞으로 지켜요.', board: { pos: B({ d4: 'P', c3: 'P', e3: 'P' }) },
          frames: [{ marks: J(M(['d4'], 'ring'), M(['c3', 'e3'], 'ok')), cap: 'c3·e3의 폰이 대각선 앞의 d4 폰을 지켜요. 폰 사슬이라고 해요.' }] },
        { t: 'do', task: clickQ('동그라미 친 백 비숍을 지켜 주는 백 말을 <b>모두</b> 눌러 보세요.', att(B({ e4: 'B', e1: 'R', d3: 'P', g5: 'N', b4: 'Q', h1: 'B' }), 'e4', 'w'), { pos: B({ e4: 'B', e1: 'R', d3: 'P', g5: 'N', b4: 'Q', h1: 'B' }), marks: M(['e4'], 'ring') }, ['백 말마다 e4로 갈 수 있는지 따져요.', { text: '이 말들을 살펴요.', marks: M(['e1', 'd3', 'g5', 'b4', 'h1'], 'soft') }], { all: true, why: function (s) { return { text: '그 말은 e4로 갈 수 없어서 지켜 주지 못해요.', marks: M([s], 'bad') }; } }) }
      ],
      practice: { n: 8, gen: function (R) { return defQ(R); } },
      sum: '내 말이 있는 칸으로 내 편 말이 갈 수 있으면 <b>지켜 주는</b> 거예요. 잡히면 다시 잡을 수 있어요.' },
    { id: 'def-or-not', title: '지켜진 말과 혼자 있는 말', kind: 'one',
      screens: [
        { t: 'say', text: '지켜 주는 말이 없는 말을 <b>혼자 있는 말</b>(지켜지지 않은 말)이라고 해요. 혼자 있는 말은 공격받으면 그냥 잃어요.', board: { pos: B({ b2: 'N', g6: 'B', g1: 'R' }), marks: J(M(['b2'], 'bad'), M(['g6'], 'ok'), M(['g1'], 'soft')) } },
        { t: 'say', text: '좋은 습관: 내 말들이 서로 <b>지켜 주게</b> 놓아요. 혼자 있는 말이 많으면 상대가 노리기 쉬워요.', board: { pos: 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R', marks: M(['e4'], 'ring') } },
        { t: 'ex', text: '혼자 있는 말 찾기', board: { pos: B({ c3: 'N', d2: 'P', e4: 'B', h5: 'R', a6: 'Q' }) },
          frames: [{ marks: M(pieces(B({ c3: 'N', d2: 'P', e4: 'B', h5: 'R', a6: 'Q' }), true).filter(function (s) { return att(B({ c3: 'N', d2: 'P', e4: 'B', h5: 'R', a6: 'Q' }), s, 'w').length; }), 'ok'), cap: '초록: 지켜진 말' }, { marks: M(pieces(B({ c3: 'N', d2: 'P', e4: 'B', h5: 'R', a6: 'Q' }), true).filter(function (s) { return !att(B({ c3: 'N', d2: 'P', e4: 'B', h5: 'R', a6: 'Q' }), s, 'w').length; }), 'bad'), cap: '빨강: 혼자 있는 말' }] },
        { t: 'do', task: function (R) { return aloneQ(R); } }
      ],
      practice: { n: 8, gen: function (R) {
        if (R.int(3)) return aloneQ(R);
        for (var t = 0; t < 300; t++) { var b = adBoard(R, R.int(2) + 3, 0), w = pieces(b, true), s0 = R.pick(w), d = att(b, s0, 'w').length;
          return pickQ('동그라미 친 백 ' + jo(nm(pcAt(b, s0)), '은') + ' 지켜지고 있나요?', ['지켜지고 있어요', '혼자 있어요'], d ? '지켜지고 있어요' : '혼자 있어요', { pos: b, marks: M([s0], 'ring') }, ['다른 백 말이 그 칸으로 갈 수 있나요?']); }
      } },
      sum: '지켜 주는 말이 없는 말은 <b>혼자 있는 말</b>이에요. 내 말들이 서로 지켜 주게 놓아요.' },
    { id: 'free-take', title: '공짜 말 잡기', kind: 'one',
      screens: [
        { t: 'say', text: '<b>혼자 있는 흑 말</b>을 잡으면 흑이 다시 잡을 수 없어요. 이런 잡기를 <b>공짜로 잡는다</b>고 해요.', board: { pos: B({ c3: 'B', f6: 'n', e1: 'R', e6: 'b', d7: 'p' }), marks: J(M(['f6'], 'ok'), M(['e6'], 'bad')) } },
        { t: 'say', text: '잡기 전에 꼭 물어요: <b>“이 흑 말을 지켜 주는 흑 말이 있나?”</b> 없으면 공짜! 있으면 내 말도 잡혀요.', board: { pos: B({ c3: 'B', f6: 'n', e1: 'R', e6: 'b', d7: 'p' }), marks: J(M(['e6'], 'ring'), M(['d7'], 'bad')) } },
        { t: 'ex', text: '공짜인 말과 아닌 말', board: { pos: B({ c3: 'B', f6: 'n', e1: 'R', e6: 'b', d7: 'p' }) },
          frames: [{ marks: J(M(['f6', 'e6'], 'ring')), cap: '백 비숍은 f6 나이트를, 백 룩은 e6 비숍을 잡을 수 있어요.' }, { marks: J(M(['e6'], 'bad'), M(['d7'], 'ring')), cap: 'e6 비숍은 d7 폰이 지켜요. 잡으면 룩을 잃어요.' }, { mv: ['c3', 'f6'], marks: M(['f6'], 'ok'), cap: 'f6 나이트는 혼자! 공짜로 잡았어요.' }] },
        { t: 'do', task: function (R) { return freeQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return freeQ(R); } },
      sum: '혼자 있는 흑 말은 <b>공짜</b>로 잡을 수 있어요. 잡기 전에 “지켜 주는 말이 있나?” 물어봐요.' },
    { id: 'def-careful', title: '지켜진 말은 조심', kind: 'one',
      screens: [
        { t: 'say', text: '지켜진 흑 말을 잡으면, 흑이 <b>내 말을 다시 잡아요.</b> 그러면 서로 말을 하나씩 잃어요.', board: { pos: B({ d1: 'Q', d6: 'p', e7: 'p' }), marks: J(M(['d6'], 'ring'), M(['e7'], 'bad')) } },
        { t: 'say', text: '특히 <b>값진 말로 값싼 말을 잡을 때</b> 조심해요. 퀸으로 지켜진 폰을 잡으면, 폰 하나 얻고 퀸을 잃어요!', board: { pos: B({ d1: 'Q', d6: 'p', e7: 'p' }), marks: J(M(['d1'], 'sel'), M(['d6'], 'x')) } },
        { t: 'ex', text: '퀸이 지켜진 폰을 잡으면', board: { pos: B({ d1: 'Q', d6: 'p', e7: 'p' }) },
          frames: [{ mv: ['d1', 'd6'], marks: M(['d6'], 'hi'), cap: '백 퀸이 폰을 잡았어요.' }, { mv: ['e7', 'd6'], marks: M(['d6'], 'bad'), cap: '흑 폰이 퀸을 다시 잡아요. 폰(1점)을 얻고 퀸(9점)을 잃었어요!' }] },
        { t: 'do', task: pickQ('백 룩으로 동그라미 친 흑 나이트를 잡아도 될까요?', ['잡아도 돼요', '잡으면 안 돼요'], '잡으면 안 돼요', { pos: B({ c2: 'R', c6: 'n', b7: 'p' }), marks: J(M(['c2'], 'sel'), M(['c6'], 'ring')) }, ['흑 나이트를 지켜 주는 흑 말이 있나요?', { text: '이 폰을 봐요.', marks: M(['b7'], 'ring') }]) }
      ],
      practice: { n: 8, gen: function (R) { return R.int(3) ? careQ(R) : freeQ(R); } },
      sum: '지켜진 말을 잡으면 내 말도 잡혀요. <b>값진 말로 지켜진 값싼 말을 잡지 마요.</b>' }
  ];

  /* ===== 13단원 말의 값 ===== */
  var VNAME = ['폰', '나이트', '비숍', '룩', '퀸'], VC = { 폰: 'P', 나이트: 'N', 비숍: 'B', 룩: 'R', 퀸: 'Q' };
  function tradeScene(R, want) {
    for (var t = 0; t < 800; t++) {
      var b = CH.board(E), A = R.pick(WHITES), T = R.pick(BLACKS.slice(0, 5)), D = R.int(4) ? R.pick(BLACKS) : null;
      var as = R.pick(sqs(function (s) { return A !== 'P' || /[2-6]/.test(s[1]); })); b[CH.idx(as)] = A;
      var tp = tg(b, as).filter(function (s) { return T !== 'p' || /[2-7]/.test(s[1]); }); if (!tp.length) continue;
      var ts = R.pick(tp); b[CH.idx(ts)] = T;
      if (D) put(R, b, [D]);
      var d = att(mv(b, as, ts), ts, 'b').length; if (!D && d) continue;
      if (att(b, as, 'b').length) continue;
      var g = v(T) - (d ? v(A) : 0), k = g > 0 ? 'good' : g < 0 ? 'bad' : 'even';
      if (want && k !== want && R.int(3)) continue;
      return { b: b, A: as, T: ts, d: d, g: g, k: k };
    }
  }
  var TRANS = { good: '이득이에요', bad: '손해예요', even: '같아요' };
  function tradeQ(R, want) {
    var sc = tradeScene(R, want), a = pcAt(sc.b, sc.A), x = pcAt(sc.b, sc.T);
    return pickQ('백 ' + jo(nm(a), '으로') + ' 흑 ' + jo(nm(x), '을') + ' 잡아요. 흑이 다시 잡을 수 있으면 잡아요. 이 잡기는 백에게 어떤가요?', ['이득이에요', '같아요', '손해예요'], TRANS[sc.k], { pos: sc.b, marks: J(M([sc.A], 'sel'), M([sc.T], 'ring')), arrows: [[sc.A, sc.T]] },
      ['얻는 값: 흑 ' + vtxt(x) + '. 흑 ' + jo(nm(x), '을') + ' 지켜 주는 흑 말이 있나요?', sc.d ? '흑이 다시 잡으면 백 ' + nm(a) + '(' + v(a) + '점)을(를) 잃어요. ' + v(x) + ' − ' + v(a) + ' = ' + sc.g : '지켜 주는 말이 없으니 잃는 것은 없어요. +' + v(x)], { kind: 'one' });
  }
  function bestCapQ(R) {
    for (var t = 0; t < 600; t++) {
      var b = adBoard(R, R.int(2) + 2, R.int(2) + 3, WHITES, BLACKS), cs = allMoves(b).filter(function (m) { return isB(b, m[1]); });
      if (cs.length < 2) continue;
      var gs = cs.map(function (m) { return gain(b, m[0], m[1]); }), mx = Math.max.apply(null, gs);
      if (mx <= 0) continue;
      var good = cs.filter(function (m, k) { return gs[k] === mx; });
      if (good.length > 2 || gs.filter(function (g) { return g < mx; }).length < 1) continue;
      return playQ('가장 <b>이득인</b> 잡기를 해요. (얻는 값 − 다시 잡혀서 잃는 값이 가장 큰 것)', { pos: b }, good,
        ['잡을 수 있는 흑 말마다 값을 보고, 지켜지고 있는지 살펴요.', { text: '가장 이득인 잡기의 흑 말이 반짝여요.', marks: M([good[0][1]], 'hint') }],
        { kind: 'deep', why: function (f, s) { if (!isB(b, s)) return { text: '이번에는 흑 말을 잡아요.' }; var g = gain(b, f, s); return { text: '그 잡기는 ' + (g >= 0 ? '+' : '') + g + '점이에요. 더 이득인 잡기(+' + mx + '점)가 있어요.', marks: M([s], 'bad') }; } });
    }
  }
  var u13 = [
    { id: 'val-intro', title: '말의 값', kind: 'easy',
      screens: [
        { t: 'say', text: '말마다 힘이 달라요. 체스에서는 말의 힘을 <b>점수(값)</b>로 나타내요. 잡고 잡힐 때 무엇이 이득인지 알 수 있어요.', big: ['P', 'N', 'B', 'R', 'Q'], board: { pos: B({ a2: 'P', c2: 'N', e2: 'B', g2: 'R', d4: 'Q' }) } },
        { t: 'say', text: '<b>폰 1점 · 나이트 3점 · 비숍 3점 · 룩 5점 · 퀸 9점.</b>', board: { pos: B({ a2: 'P', c2: 'N', e2: 'B', g2: 'R', d4: 'Q' }), marks: J(L('a2', '1'), L('c2', '3'), L('e2', '3'), L('g2', '5'), L('d4', '9')) } },
        { t: 'say', text: '<b>킹</b>은 점수가 없어요. 킹을 잃으면 게임이 끝나니까 값을 매길 수 없을 만큼 소중해요.', big: ['K', 'k'], board: { pos: B({ e1: 'K' }) } },
        { t: 'say', text: '외우는 방법: 폰을 1로, 나이트·비숍은 폰 셋(3), 룩은 다섯(5), 퀸은 아홉(9). 나이트와 비숍은 값이 같아요!', board: { pos: B({ c2: 'N', e2: 'B' }), marks: J(L('c2', '3'), L('e2', '3')) } },
        { t: 'ex', text: '값을 차례로 봐요.', board: { pos: E },
          frames: [{ pos: B({ d4: 'P' }), marks: L('d4', '1점'), cap: '폰 1점' }, { pos: B({ d4: 'N' }), marks: L('d4', '3점'), cap: '나이트 3점' }, { pos: B({ d4: 'B' }), marks: L('d4', '3점'), cap: '비숍 3점' }, { pos: B({ d4: 'R' }), marks: L('d4', '5점'), cap: '룩 5점' }, { pos: B({ d4: 'Q' }), marks: L('d4', '9점'), cap: '퀸 9점' }] },
        { t: 'do', task: pickQ('룩의 값은 몇 점인가요?', ['1점', '3점', '5점', '9점'], '5점', { pos: B({ d4: 'R' }) }, ['폰 1, 나이트·비숍 3, 룩 ?, 퀸 9']) },
        { t: 'do', task: pickQ('값이 같은 두 말은?', ['나이트와 비숍', '룩과 퀸', '폰과 나이트'], '나이트와 비숍', { pos: B({ c4: 'N', f4: 'B' }) }, ['둘 다 3점이에요.']) }
      ],
      practice: { n: 8, gen: function (R) {
        var k = R.int(3), n = R.pick(VNAME), c = VC[n];
        if (k === 0) return pickQ(jo(n, '의') + ' 값은 몇 점인가요?', ['1점', '3점', '5점', '9점'], v(c) + '점', { pos: only(c, 'd4') }, ['폰 1, 나이트·비숍 3, 룩 5, 퀸 9']);
        if (k === 1) { var op = v(c) === 3 ? ['폰', n, '룩', '퀸'] : ['폰', R.pick(['나이트', '비숍']), '룩', '퀸']; return pickQ(v(c) + '점인 말은?', op, n, { pos: E }, ['폰 1, 나이트·비숍 3, 룩 5, 퀸 9']); }
        return pickQ('값이 매겨지지 않을 만큼 소중한 말은?', R.shuffle(['킹', '퀸', '룩']), '킹', { pos: B({ e1: 'K' }) }, ['잃으면 게임이 끝나는 말이에요.']);
      } },
      sum: '<b>폰 1 · 나이트 3 · 비숍 3 · 룩 5 · 퀸 9</b>. 킹은 값을 매길 수 없어요.' },
    { id: 'val-compare', title: '값 비교하기', kind: 'one',
      screens: [
        { t: 'say', text: '말의 값을 <b>더하면</b> 누가 더 많은 힘을 가졌는지 알 수 있어요. 예: 룩 5 + 폰 1 = 6.', board: { pos: B({ c3: 'R', e3: 'P' }), marks: J(L('c3', '5'), L('e3', '1')) } },
        { t: 'say', text: '나이트 하나(3)와 폰 셋(1+1+1=3)은 값이 같아요. 룩 하나(5)는 나이트(3)보다 2점 더 값져요.', board: { pos: B({ b3: 'N', d3: 'P', e3: 'P', f3: 'P' }), marks: J(L('b3', '3'), L('d3', '1'), L('e3', '1'), L('f3', '1')) } },
        { t: 'ex', text: '백과 흑의 값을 견주어요.', board: { pos: B({ a2: 'R', b2: 'P', c2: 'P', f7: 'b', g7: 'n', h7: 'p' }) },
          frames: [{ marks: J(L('a2', '5'), L('b2', '1'), L('c2', '1')), cap: '백: 5 + 1 + 1 = 7' }, { marks: J(L('f7', '3'), L('g7', '3'), L('h7', '1')), cap: '흑: 3 + 3 + 1 = 7. 같아요!' }] },
        { t: 'do', task: pickQ('어느 쪽 값이 더 큰가요? 백: 룩 / 흑: 나이트+폰', ['백이 더 커요', '흑이 더 커요', '같아요'], '백이 더 커요', { pos: B({ d2: 'R', d7: 'n', e7: 'p' }) }, ['룩 5, 나이트 3 + 폰 1 = 4']) }
      ],
      practice: { n: 8, gen: function (R) {
        var b = adBoard(R, R.int(3) + 1, R.int(3) + 1, WHITES, BLACKS), w = sum(b, true), k = sum(b, false);
        if (R.int(2)) return pickQ('백 말 값을 모두 더하면 몇 점인가요?', R.opts(w + '점', [w - 2, w - 1, w + 1, w + 2, w + 3].filter(function (x) { return x > 0; }).map(function (x) { return x + '점'; })), w + '점', { pos: b }, ['폰 1, 나이트·비숍 3, 룩 5, 퀸 9', { text: '값을 적어 두었어요.', marks: J.apply(null, pieces(b, true).map(function (s) { return L(s, String(v(pcAt(b, s)))); })) }]);
        return pickQ('백과 흑, 말 값을 더하면 어느 쪽이 더 큰가요?', ['백이 더 커요', '흑이 더 커요', '같아요'], w > k ? '백이 더 커요' : k > w ? '흑이 더 커요' : '같아요', { pos: b }, ['양쪽 값을 따로 더해요.', { text: '값을 적어 두었어요.', marks: J.apply(null, pieces(b, true).concat(pieces(b, false)).map(function (s) { return L(s, String(v(pcAt(b, s)))); })) }]);
      } },
      sum: '말 값을 <b>더해서</b> 견주어요. 값이 큰 쪽이 더 유리해요.' },
    { id: 'trade-good', title: '이득인 교환', kind: 'one',
      screens: [
        { t: 'say', text: '내가 상대 말을 잡고, 상대가 내 말을 다시 잡는 것을 <b>교환</b>이라고 해요. 얻은 값과 잃은 값을 견주어요.', board: { pos: B({ e4: 'P', d5: 'n', c6: 'p' }), marks: J(M(['e4'], 'sel'), M(['d5'], 'ring'), M(['c6'], 'bad')) } },
        { t: 'say', text: '<b>얻은 값 − 잃은 값</b>이 0보다 크면 이득이에요. 폰(1)으로 지켜진 나이트(3)를 잡으면 3 − 1 = <b>+2</b>, 이득!', board: { pos: B({ e4: 'P', d5: 'n', c6: 'p' }), marks: J(L('e4', '1'), L('d5', '3')) } },
        { t: 'say', text: '지켜 주는 말이 없으면(혼자 있는 말) 잃는 것이 없으니 얻은 값 그대로 이득이에요.', board: { pos: B({ c1: 'B', g5: 'r' }), marks: J(M(['c1'], 'sel'), M(['g5'], 'ok')) } },
        { t: 'ex', text: '값싼 말로 값진 말을 잡아요.', board: { pos: B({ e4: 'P', d5: 'n', c6: 'p' }) },
          frames: [{ mv: ['e4', 'd5'], marks: M(['d5'], 'hi'), cap: '백 폰이 나이트를 잡아요. +3' }, { mv: ['c6', 'd5'], marks: M(['d5'], 'bad'), cap: '흑 폰이 다시 잡아요. −1' }, { marks: {}, cap: '3 − 1 = +2. 백이 이득이에요!' }] },
        { t: 'do', task: function (R) { return bestCapQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { return R.int(2) ? tradeQ(R, 'good') : bestCapQ(R); } },
      sum: '<b>얻은 값 − 잃은 값</b>이 0보다 크면 이득인 교환이에요. 값싼 말로 값진 말을 잡으면 이득!' },
    { id: 'trade-bad', title: '손해인 교환', kind: 'one',
      screens: [
        { t: 'say', text: '얻은 값보다 잃은 값이 크면 <b>손해</b>예요. 룩(5)으로 지켜진 나이트(3)를 잡으면 3 − 5 = <b>−2</b>.', board: { pos: B({ d1: 'R', d5: 'n', e6: 'p' }), marks: J(L('d1', '5'), L('d5', '3'), M(['e6'], 'bad')) } },
        { t: 'say', text: '손해인 교환은 하지 않아요. 잡기 전에 셈을 해 봐요: “내 말이 더 비싼데, 다시 잡히나?”', board: { pos: B({ d1: 'R', d5: 'n', e6: 'p' }), marks: M(['d5'], 'x') } },
        { t: 'ex', text: '손해인 교환', board: { pos: B({ d1: 'R', d5: 'n', e6: 'p' }) },
          frames: [{ mv: ['d1', 'd5'], marks: M(['d5'], 'hi'), cap: '룩이 나이트를 잡아요. +3' }, { mv: ['e6', 'd5'], marks: M(['d5'], 'bad'), cap: '폰이 룩을 잡아요. −5' }, { marks: {}, cap: '3 − 5 = −2. 손해예요!' }] },
        { t: 'do', task: pickQ('백 퀸으로 흑 룩을 잡아요. 흑 폰이 룩을 지켜요. 이 교환은?', ['이득이에요', '같아요', '손해예요'], '손해예요', { pos: B({ d1: 'Q', d6: 'r', c7: 'p' }), marks: J(M(['d1'], 'sel'), M(['d6'], 'ring')) }, ['얻는 값: 룩 5. 잃는 값: 퀸 9.', '5 − 9 = ?']) }
      ],
      practice: { n: 8, gen: function (R) { return tradeQ(R, R.int(2) ? 'bad' : null); } },
      sum: '<b>얻은 값 − 잃은 값</b>이 0보다 작으면 손해예요. 비싼 말로 지켜진 싼 말을 잡지 마요.' },
    { id: 'trade-even', title: '같은 값 교환', kind: 'one',
      screens: [
        { t: 'say', text: '얻은 값과 잃은 값이 같으면 <b>같은 값 교환</b>이에요. 나이트로 지켜진 비숍을 잡으면 3 − 3 = 0.', board: { pos: B({ c3: 'N', d5: 'b', e6: 'p' }), marks: J(L('c3', '3'), L('d5', '3')) } },
        { t: 'say', text: '같은 값 교환은 손해도 이득도 아니에요. 내가 이미 앞서 있을 때 말을 줄이면 좋고, 뒤처져 있을 때는 피하는 것이 좋아요.', board: { pos: B({ c3: 'N', d5: 'b' }) } },
        { t: 'ex', text: '같은 값 교환', board: { pos: B({ c3: 'N', d5: 'b', e6: 'p' }) },
          frames: [{ mv: ['c3', 'd5'], marks: M(['d5'], 'hi'), cap: '나이트가 비숍을 잡아요. +3' }, { mv: ['e6', 'd5'], marks: M(['d5'], 'bad'), cap: '폰이 나이트를 잡아요. −3' }, { marks: {}, cap: '3 − 3 = 0. 같은 값이에요.' }] },
        { t: 'do', task: pickQ('백 룩으로 흑 룩을 잡아요. 흑 퀸이 그 룩을 지켜요. 이 교환은?', ['이득이에요', '같아요', '손해예요'], '같아요', { pos: B({ a1: 'R', a6: 'r', c8: 'q' }), marks: J(M(['a1'], 'sel'), M(['a6'], 'ring')) }, ['얻는 값: 룩 5. 잃는 값: 룩 5.']) }
      ],
      practice: { n: 8, gen: function (R) { return tradeQ(R, R.pick(['even', 'even', null])); } },
      sum: '얻은 값과 잃은 값이 같으면 <b>같은 값 교환</b>(0)이에요.' }
  ];

  /* ===== 14단원 위험한 말 구하기 ===== */
  function saveLesson(id, title, kind, says, ex, sumText) {
    return { id: id, title: title, kind: 'deep', screens: says.concat([ex, { t: 'do', task: function (R) { return saveQ(R, kind); } }]), practice: { n: 6, gen: function (R) { return saveQ(R, kind); } }, sum: sumText };
  }
  var u14 = [
    saveLesson('save-run', '구하기 ① 피하기', 'run',
      [{ t: 'say', text: '내 말이 공격받고 있으면 구해야 해요. 구하는 방법은 네 가지예요: <b>피하기 · 지키기 · 사이를 막기 · 공격하는 말 잡기.</b>', board: { pos: B({ d4: 'N', d8: 'r' }), marks: J(M(['d4'], 'ring'), M(['d8'], 'bad')) } },
       { t: 'say', text: '첫 번째, <b>피하기</b>: 공격받는 말을 <b>안전한 칸</b>으로 옮겨요. 안전한 칸 = 흑 말이 잡을 수 없는 칸(또는 지켜진 칸)이에요.', board: { pos: B({ d4: 'N', d8: 'r' }), marks: J(M(['d4'], 'ring'), M(['c2', 'e2', 'b3', 'f3', 'b5', 'f5', 'c6', 'e6'], 'dot')) } },
       { t: 'say', text: '⚠️ 피한 칸이 또 다른 흑 말에게 공격받는 칸이면 소용없어요. 옮기기 전에 꼭 살펴요.', board: { pos: B({ d4: 'N', d8: 'r', h3: 'b' }), marks: J(M(['d4'], 'ring'), M(['g4'], 'soft'), M(['f5', 'e6'], 'x')) } }],
      { t: 'ex', text: '안전한 칸으로 피해요.', board: { pos: B({ e4: 'B', e8: 'r', b6: 'n' }) },
        frames: [{ marks: J(M(['e4'], 'ring'), M(['e8'], 'bad')), cap: '흑 룩이 백 비숍을 공격해요.' }, { marks: J(M(['e4'], 'ring'), M(['d5', 'c4'], 'x')), cap: 'd5·c4는 흑 나이트가 잡을 수 있는 칸이에요.' }, { mv: ['e4', 'f3'], marks: M(['f3'], 'ok'), cap: 'f3으로 피했어요. 아무도 못 잡아요!' }] },
      '<b>피하기</b>: 공격받는 말을 흑 말이 잡을 수 없는 안전한 칸으로 옮겨요.'),
    saveLesson('save-guard', '구하기 ② 지키기', 'guard',
      [{ t: 'say', text: '두 번째, <b>지키기</b>: 다른 내 말을 움직여 공격받는 말을 <b>지켜 줘요.</b> 그러면 상대가 잡아도 다시 잡을 수 있어요.', board: { pos: B({ d4: 'R', d8: 'q', a1: 'R' }), marks: J(M(['d4'], 'ring'), M(['d8'], 'bad')) } },
       { t: 'say', text: '⚠️ 지키기는 <b>공격하는 말이 더 값지거나 같을 때</b> 통해요. 퀸(9)이 지켜진 룩(5)을 잡으면 퀸을 잃으니 못 잡아요. 하지만 폰이 공격할 때는 지켜도 소용없어요(폰 1을 주고 룩 5를 얻으니까).', board: { pos: B({ d4: 'R', d8: 'q', a1: 'R' }), marks: J(L('d4', '5'), L('d8', '9')) } }],
      { t: 'ex', text: '룩으로 룩을 지켜요.', board: { pos: B({ d4: 'R', d8: 'q', a1: 'R' }) },
        frames: [{ marks: J(M(['d4'], 'ring'), M(['d8'], 'bad')), cap: '흑 퀸이 백 룩을 공격해요.' }, { mv: ['a1', 'a4'], marks: J(M(['a4'], 'ok'), M(['d4'], 'ring')), cap: '다른 룩이 a4로 가서 d4 룩을 지켜요.' }, { marks: M(['d4'], 'ok'), cap: '이제 퀸이 잡으면 a4 룩이 퀸을 잡아요. 흑은 못 잡아요!' }] },
      '<b>지키기</b>: 다른 말로 공격받는 말을 지켜요. 공격하는 말이 더 값질 때 통해요.'),
    saveLesson('save-block', '구하기 ③ 사이를 막기', 'block',
      [{ t: 'say', text: '세 번째, <b>사이를 막기</b>: 룩·비숍·퀸처럼 멀리서 공격하는 말과 내 말 <b>사이</b>에 다른 말을 놓아 길을 막아요.', board: { pos: B({ d2: 'N', d8: 'r', b3: 'B' }), marks: J(M(['d2'], 'ring'), M(['d8'], 'bad'), M(['d3', 'd4', 'd5', 'd6', 'd7'], 'soft')) } },
       { t: 'say', text: '막는 말이 잡히면 안 되니까, <b>값싼 말</b>로 막거나 <b>지켜진 칸</b>에서 막아요. 나이트나 폰처럼 붙어서 공격하는 말은 막을 수 없어요.', board: { pos: B({ d2: 'N', d8: 'r', b3: 'B', e4: 'P' }), marks: J(M(['d5'], 'ok'), M(['e4'], 'ring')), arrows: [['b3', 'd5']] } }],
      { t: 'ex', text: '사이를 막아요.', board: { pos: B({ c1: 'Q', h6: 'b', e2: 'P', g2: 'P' }) },
        frames: [{ marks: J(M(['c1'], 'ring'), M(['h6'], 'bad'), M(['d2', 'e3', 'f4', 'g5'], 'soft')), cap: '흑 비숍이 대각선으로 백 퀸을 공격해요.' }, { mv: ['e2', 'e3'], marks: J(M(['e3'], 'ok')), cap: '폰이 e3으로 가서 길을 막아요.' }, { marks: M(['c1'], 'ok'), cap: '이제 비숍은 퀸에게 닿지 못해요.' }] },
      '<b>사이를 막기</b>: 멀리서 공격하는 말과 내 말 사이에 다른 말을 놓아요. 막는 말도 안전해야 해요.'),
    saveLesson('save-take', '구하기 ④ 공격하는 말 잡기', 'take',
      [{ t: 'say', text: '네 번째, <b>공격하는 말 잡기</b>: 공격하는 흑 말을 아예 잡아 버려요! 가장 시원한 방법이에요.', board: { pos: B({ d4: 'N', f6: 'b', h4: 'R' }), marks: J(M(['d4'], 'ring'), M(['f6'], 'bad')) } },
       { t: 'say', text: '잡을 때도 셈을 해요. 공격하는 말이 지켜지고 있으면, 그 말보다 값싼 말로 잡아야 이득이에요.', board: { pos: B({ d4: 'N', f6: 'b', h4: 'R', g7: 'p' }), marks: J(M(['f6'], 'ring'), M(['g7'], 'bad')) } }],
      { t: 'ex', text: '공격하는 말을 잡아요.', board: { pos: B({ d4: 'N', f6: 'b', h6: 'R' }) },
        frames: [{ marks: J(M(['d4'], 'ring'), M(['f6'], 'bad')), cap: '흑 비숍이 백 나이트를 공격해요.' }, { mv: ['h6', 'f6'], marks: M(['f6'], 'ok'), cap: '백 룩이 비숍을 잡았어요. 위험이 사라졌어요!' }] },
      '<b>공격하는 말 잡기</b>: 공격하는 흑 말을 잡아요. 지켜진 말이면 더 값싼 말로 잡아요.'),
    saveLesson('save-choose', '구하기 ⑤ 방법 고르기', 'any',
      [{ t: 'say', text: '이제 네 가지 방법 가운데 <b>되는 방법</b>을 골라요. 차례대로 생각하면 쉬워요.', board: { pos: B({ d4: 'R', d8: 'q' }), marks: J(M(['d4'], 'ring'), M(['d8'], 'bad')) } },
       { t: 'say', text: '생각하는 차례: ① 공격하는 말을 <b>잡을 수 있나?</b> ② 안전한 칸으로 <b>피할 수 있나?</b> ③ <b>막을 수 있나?</b> ④ <b>지킬 수 있나?</b> 한 수 두고 나서 다른 말이 공짜로 잡히지 않는지도 살펴요.', board: { pos: B({ d4: 'R', d8: 'q' }) } }],
      { t: 'ex', text: '방법을 차례로 따져요.', board: { pos: B({ e4: 'N', e7: 'r', c5: 'P', g6: 'p' }) },
        frames: [{ marks: J(M(['e4'], 'ring'), M(['e7'], 'bad')), cap: '흑 룩이 백 나이트를 공격해요.' }, { marks: J(M(['e7'], 'ring')), cap: '① 룩을 잡을 수 있는 백 말? 없어요.' }, { marks: J(M(['e4'], 'ring'), M(['f6', 'f2', 'd2', 'g3', 'c3', 'g5', 'd6'], 'dot')), cap: '② 피하기: 나이트가 갈 수 있는 칸을 봐요.' }, { mv: ['e4', 'd6'], marks: M(['d6'], 'ok'), cap: 'd6으로 피하면 흑 말이 잡을 수 없고, c5 폰이 지켜 주기까지 해요!' }] },
      '공격받으면 <b>잡기 → 피하기 → 막기 → 지키기</b> 차례로 되는 방법을 찾아요.'),
    { id: 'save-review', title: '구하기 ⑥ 복습', kind: 'deep',
      screens: [
        { t: 'say', text: '네 가지 방법을 정리해요. 공격받는 말이 있으면 당황하지 말고 차례로 따져요.', board: { pos: B({ d4: 'N', d8: 'r' }), marks: J(M(['d4'], 'ring'), M(['d8'], 'bad')) } },
        { t: 'ex', text: '네 가지 방법', board: { pos: B({ d4: 'N', d8: 'r', b4: 'B', f1: 'R' }) },
          frames: [{ marks: J(M(['d4'], 'ring'), M(['d8'], 'bad')), cap: '흑 룩이 백 나이트를 공격해요.' }, { marks: J(M(['d4'], 'ring'), M(['f5', 'b5', 'e6', 'c6', 'e2', 'c2', 'b3', 'f3'], 'dot')), cap: '피하기: 안전한 칸으로' }, { marks: J(M(['f1', 'd1'], 'soft')), arrows: [['f1', 'd1']], cap: '지키기: 룩을 d1로' }, { marks: M(['d5', 'd6', 'd7'], 'soft'), arrows: [['b4', 'd6']], cap: '막기: 사이(d5·d6·d7)에 다른 말을 놓아요. 비숍이 d6으로 갈 수 있어요.' }, { marks: M(['d8'], 'ring'), cap: '잡기: 룩을 잡을 수 있는 말이 있다면 가장 좋아요.' }] },
        { t: 'do', task: pickQ('공격하는 말과 내 말 사이에 다른 말을 놓는 방법은?', ['피하기', '지키기', '사이를 막기', '공격하는 말 잡기'], '사이를 막기', { pos: B({ d2: 'N', d8: 'r' }), marks: M(['d3', 'd4', 'd5', 'd6', 'd7'], 'soft') }, ['길을 막아요.']) },
        { t: 'do', task: function (R) { return saveQ(R, 'any'); } }
      ],
      practice: { n: 6, gen: function (R) {
        if (R.int(4) === 0) { var k = R.pick(['피하기', '지키기', '사이를 막기', '공격하는 말 잡기']), D = { 피하기: '공격받는 말을 안전한 칸으로 옮겨요.', 지키기: '다른 말을 움직여 공격받는 말을 지켜 줘요.', '사이를 막기': '공격하는 말과 내 말 사이에 다른 말을 놓아요.', '공격하는 말 잡기': '공격하는 흑 말을 잡아요.' };
          return pickQ('“' + D[k] + '” 이 방법의 이름은?', ['피하기', '지키기', '사이를 막기', '공격하는 말 잡기'], k, { pos: E }, ['네 가지 방법: 피하기 · 지키기 · 막기 · 잡기']); }
        return saveQ(R, R.pick(['any', 'run', 'take', 'block', 'guard']));
      } },
      sum: '위험한 말 구하기: <b>피하기 · 지키기 · 사이를 막기 · 공격하는 말 잡기.</b> 한 수 둔 뒤 다른 말이 공짜로 잡히지 않는지도 살펴요.' }
  ];

  /* ===== 15단원 작은 대결 ===== */
  var u15 = [
    { id: 'mini-1', title: '작은 대결 ① 룩과 폰', kind: 'deep',
      screens: [
        { t: 'say', text: '배운 것을 써서 <b>인공지능과 작은 대결</b>을 해요. 킹 없이 말 몇 개로만 겨뤄요.', board: { pos: GAMES.rook.pos } },
        { t: 'say', text: '규칙: 나는 백, 내가 먼저 둬요. 말은 배운 대로 움직이고 잡아요. 서로 <b>15번씩</b> 두면 끝! 그때 <b>남은 말 값</b>이 더 큰 쪽이 이겨요. 상대 말을 모두 잡아도 이겨요. (폰이 끝 줄에 닿으면 퀸으로 바뀌어요 — 4마당에서 배워요.)', board: { pos: GAMES.rook.pos, marks: J(L('d1', '5'), L('c2', '1'), L('d2', '1'), L('e2', '1')) } },
        { t: 'say', text: '작전: ① 공짜로 잡을 수 있는 흑 말을 찾아요. ② 내 말이 공짜로 잡히지 않게 해요. ③ 공격받으면 구해요. 화면 아래에 남은 차례와 말 값이 나와요.', board: { pos: GAMES.rook.pos } },
        { t: 'ex', text: '이런 장면이 나와요.', board: { pos: GAMES.rook.pos },
          frames: [{ mv: ['d2', 'd4'], cap: '백: 폰 d4' }, { mv: ['e7', 'e5'], cap: '흑: 폰 e5 — 내 폰의 대각선 앞!' }, { mv: ['d4', 'e5'], marks: M(['e5'], 'hi'), cap: '백: 공짜 폰을 잡아요. 말 값 8 : 7' }] },
        { t: 'do', task: miniTask('rook', 1) }
      ],
      practice: { n: 6, gen: function (R) { return R.int(2) ? miniTask('rook', R.pick([1, 2])) : R.int(2) ? freeQ(R) : saveQ(R, 'any'); } },
      sum: '작은 대결: <b>공짜 말은 잡고, 내 말은 지키기!</b>' },
    { id: 'mini-2', title: '작은 대결 ② 여러 말로', kind: 'deep',
      screens: [
        { t: 'say', text: '이번에는 말을 더 많이 가지고 겨뤄요. 나이트·비숍, 그리고 퀸·룩으로도 해 봐요.', board: { pos: GAMES.minor.pos } },
        { t: 'say', text: '말이 많을수록 살필 것도 많아요. 상대가 한 수 둘 때마다 <b>“무엇을 공격하지?”</b> 묻고, 내 차례에는 <b>“공짜로 잡을 것이 있나?”</b> 물어요.', board: { pos: GAMES.queen.pos } },
        { t: 'ex', text: '나이트로 공짜 폰을 노려요.', board: { pos: GAMES.minor.pos },
          frames: [{ mv: ['b1', 'c3'], cap: '백: 나이트 c3' }, { mv: ['d7', 'd5'], cap: '흑: 폰 d5' }, { marks: J(M(['c3'], 'sel'), M(['d5'], 'ring')), cap: 'd5 폰을 지켜 주는 흑 말이 있나요? 없어요(c6·e6에서 지켜 줄 폰이 없어요).' }, { mv: ['c3', 'd5'], marks: M(['d5'], 'hi'), cap: '나이트가 공짜 폰을 잡아요.' }] },
        { t: 'do', task: miniTask('minor', 1) },
        { t: 'do', task: miniTask('queen', 1) }
      ],
      practice: { n: 6, gen: function (R) { return R.int(2) ? miniTask(R.pick(['minor', 'queen']), R.pick([1, 2])) : R.int(2) ? bestCapQ(R) : saveQ(R, 'any'); } },
      sum: '말이 많을수록 <b>상대의 공격</b>과 <b>공짜 말</b>을 늘 살펴요.' },
    { id: 'cap-sum', title: '3마당 정리', kind: 'one',
      screens: [
        { t: 'say', text: '3마당에서 배운 것을 정리해요. ① <b>잡기</b>: 상대 말이 있는 칸으로 가요(폰은 대각선). ② <b>공격과 지킴</b>: 다음에 잡을 수 있으면 공격, 다시 잡을 수 있으면 지킴.', board: { pos: B({ d4: 'N', d1: 'R', d8: 'r' }), marks: J(M(['d8'], 'bad'), M(['d1'], 'ok'), M(['d4'], 'ring')) } },
        { t: 'say', text: '③ <b>말의 값</b>: 폰 1 · 나이트 3 · 비숍 3 · 룩 5 · 퀸 9. 교환은 얻은 값 − 잃은 값. ④ <b>구하기</b>: 피하기 · 지키기 · 막기 · 잡기.', big: ['P', 'N', 'B', 'R', 'Q'], board: { pos: E } },
        { t: 'ex', text: '한 장면에 모두 들어 있어요.', board: { pos: B({ e4: 'N', e8: 'r', c3: 'P', g5: 'b', h4: 'R' }) },
          frames: [{ marks: J(M(['e4'], 'ring'), M(['e8'], 'bad')), cap: '흑 룩이 백 나이트를 공격해요(c3 폰은 나이트를 못 지켜요).' }, { marks: J(M(['g5'], 'bad'), M(['h4'], 'ring')), cap: 'g5 흑 비숍은 h4 백 룩도 공격해요. 그런데 이 비숍은 혼자 있어요(지켜 주는 말이 없어요).' }, { mv: ['e4', 'g5'], marks: M(['g5'], 'ok'), cap: '나이트로 비숍을 잡으면 나이트는 피하고, 룩은 구하고, 비숍은 공짜로!' }] },
        { t: 'do', task: function (R) { return freeQ(R); } }
      ],
      practice: { n: 8, gen: function (R) { var k = R.int(5); return k === 0 ? underQ(R) : k === 1 ? defQ(R) : k === 2 ? tradeQ(R) : k === 3 ? freeQ(R) : saveQ(R, 'any'); } },
      sum: '<b>잡기 · 공격과 지킴 · 말의 값 · 위험한 말 구하기</b>를 배웠어요. 4마당에서는 체크와 체크메이트를 배워요!' }
  ];

  window.MADANG = { id: 'm3', no: 3, title: '잡기와 지키기', rank: '비숍', rankPc: 'B', examN: 15,
    units: [{ title: '잡기', lessons: u11 }, { title: '공격과 지킴', lessons: u12 }, { title: '말의 값', lessons: u13 }, { title: '위험한 말 구하기', lessons: u14 }, { title: '작은 대결', lessons: u15 }] };
})();
