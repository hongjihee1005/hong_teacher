/* 체스 학습관 정식 대국 인공지능 — window.CAI (4마당부터)
   알파-베타 탐색 + 잡기만 더 읽기(quiescence) + 말 값·자리 점수. 한쪽에 킹만 남으면 '몰아붙이기' 점수(외로운 킹을 가장자리로, 두 킹을 가깝게).
   CAI.best(p, 깊이, {err, nodes}) → CH.legal(p)의 수 하나. CAI.game(단계, {goal, lim}) → learn.js의 대국(type 'game')용 T.game */
(function (G) {
  'use strict';
  var CH = G.CH;
  var V = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 0 };
  /* 자리 점수(백 기준, 칸 번호 0 = a8) */
  var PST = {
    P: [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
    N: [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50],
    B: [-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10, -10, -10, -10, -10, -20],
    R: [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0],
    Q: [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20],
    K: [-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20]
  };
  var MATE = 100000;
  function cdist(i) { var r = i >> 3, f = i & 7; return Math.max(3 - r, r - 4) + Math.max(3 - f, f - 4); } /* 가운데에서 먼 정도 0~6 */
  function kdist(a, b) { return Math.max(Math.abs((a >> 3) - (b >> 3)), Math.abs((a & 7) - (b & 7))); }
  /* 외로운 킹이 갈 수 있는 둘레 칸 수(by 편이 공격하지 않는 빈칸) */
  function room(b, k, by) { var n = 0, r = k >> 3, f = k & 7; for (var dr = -1; dr <= 1; dr++) for (var df = -1; df <= 1; df++) { if (!dr && !df) continue; var rr = r + dr, ff = f + df; if (rr < 0 || rr > 7 || ff < 0 || ff > 7) continue; var i = rr * 8 + ff; if ((b[i] === '.' || CH.isW(b[i]) === (by === 'w')) && !CH.attacked(b, i, by)) n++; } return n; }
  function roomBonus(b, k, by) { var n = room(b, k, by); return n ? (8 - n) * 25 : -300; } /* 갈 칸이 없으면 스테일메이트 위험 */
  function evalW(b) {
    var s = 0, wm = 0, bm = 0, wk = -1, bk = -1, kw = 0, kb = 0;
    for (var i = 0; i < 64; i++) {
      var c = b[i]; if (c === '.') continue; var t = c.toUpperCase(), w = c === t;
      if (t === 'K') { if (w) wk = i; else bk = i; }
      var v = V[t] + (t === 'K' ? 0 : PST[t][w ? i : (7 - (i >> 3)) * 8 + (i & 7)]); if (t === 'K') { if (w) kw = PST.K[i]; else kb = PST.K[(7 - (i >> 3)) * 8 + (i & 7)]; }
      if (w) { s += v; wm += V[t]; } else { s -= v; bm += V[t]; }
    }
    if (bm && wm) s += kw - kb; /* 킹 자리 점수(뒤쪽에 숨기)는 양쪽에 말이 있을 때만 */
    /* 몰아붙이기: 한쪽에 킹만 남고 다른 쪽에 말이 있으면 */
    if (bm === 0 && wm > 0 && bk >= 0 && wk >= 0) s += cdist(bk) * 40 + (14 - 2 * kdist(wk, bk)) * 12 + roomBonus(b, bk, 'w');
    if (wm === 0 && bm > 0 && bk >= 0 && wk >= 0) s -= cdist(wk) * 40 + (14 - 2 * kdist(wk, bk)) * 12 + roomBonus(b, wk, 'b');
    return s;
  }
  function order(ms) {
    return ms.sort(function (a, b) {
      var x = (a.cap !== '.' ? 10 * V[a.cap.toUpperCase()] - V[a.pc.toUpperCase()] / 10 : 0) + (a.promo ? 800 : 0);
      var y = (b.cap !== '.' ? 10 * V[b.cap.toUpperCase()] - V[b.pc.toUpperCase()] / 10 : 0) + (b.promo ? 800 : 0);
      return y - x;
    });
  }
  function search(p, opt) {
    var nodes = 0, LIM = opt.nodes || 60000;
    function qs(q, a, bt, d) {
      nodes++; var st = evalW(q.b) * (q.turn === 'w' ? 1 : -1);
      if (st >= bt) return st; if (st > a) a = st; if (d > 6 || nodes > LIM * 2) return st;
      var ms = order(CH.legal(q).filter(function (m) { return m.cap !== '.' || m.promo; }));
      for (var k = 0; k < ms.length; k++) { var s = -qs(CH.make(q, ms[k]), -bt, -a, d + 1); if (s >= bt) return s; if (s > a) a = s; }
      return a;
    }
    function ab(q, d, a, bt, ply) {
      nodes++;
      var ms = CH.legal(q);
      if (!ms.length) return CH.inCheck(q) ? -MATE + ply : 0;
      if (q.half >= 100 || CH.insufficient(q.b)) return 0;
      if (d <= 0 || nodes > LIM) return qs(q, a, bt, 0);
      order(ms); var best = -Infinity;
      for (var k = 0; k < ms.length; k++) { var s = -ab(CH.make(q, ms[k]), d - 1, -bt, -a, ply + 1); if (s > best) best = s; if (s > a) a = s; if (a >= bt) break; }
      return best;
    }
    return { ab: ab };
  }
  /* 가장 좋은 수(같은 점수면 아무거나). err: 그 확률로 2~3번째 수(바로 지거나 메이트를 놓치는 실수는 하지 않음) */
  function best(p, depth, o) {
    o = o || {}; var ms = order(CH.legal(p)); if (!ms.length) return null;
    var S = search(p, o), sc = ms.map(function (m) { return { m: m, s: -S.ab(CH.make(p, m), depth - 1, -Infinity, Infinity, 1) }; });
    sc.sort(function (a, b) { return b.s - a.s; });
    if (o.err && Math.random() < o.err && sc.length > 1 && sc[0].s < MATE / 2) {
      var ok = sc.filter(function (x, i) { return i > 0 && i < 4 && x.s > -MATE / 2 && x.s > sc[0].s - (o.slack || 400); });
      if (ok.length) return ok[Math.floor(Math.random() * ok.length)].m;
    }
    var tie = Math.abs(sc[0].s) > MATE / 2 ? 0 : (o.tie || 5); /* 메이트 점수면 가장 빠른 메이트만(동점 범위에 늦은 메이트가 섞여 메이트를 미루던 문제) */
    var top = sc.filter(function (x) { return x.s >= sc[0].s - tie; });
    return top[Math.floor(Math.random() * top.length)].m;
  }
  /* 대국. goal 'win'(보통 대국: 체크메이트하면 승리) · 'mate'(메이트 연습: lim 번 안에 메이트, 스테일메이트·말 잃음은 실패)
     단계: 1 한 수 앞 + 자주 실수 · 2 두 수 앞 + 가끔 실수 · 3 세 수 앞 · 4 세 수 앞(더 넓게) · 5~7 네 수 앞 · 8·9 다섯 수 앞 · 10 여섯 수 앞(읽는 양에 한도) · 99(힌트) 세 수 앞 */
  var LV = { 1: { d: 1, err: .45, slack: 600 }, 2: { d: 2, err: .15, slack: 250 }, 3: { d: 3, err: 0 }, 4: { d: 3, err: 0, nodes: 70000 }, 5: { d: 4, err: 0, nodes: 60000 }, 6: { d: 4, err: 0, nodes: 110000 }, 7: { d: 4, err: 0, nodes: 180000 }, 8: { d: 5, err: 0, nodes: 200000 }, 9: { d: 5, err: 0, nodes: 320000 }, 10: { d: 6, err: 0, nodes: 450000 }, 99: { d: 3, err: 0 } };
  function game(lv, o) {
    o = o || {};
    function moves(p) { return CH.legal(p).filter(function (m) { return !m.promo || /q/i.test(m.promo); }); }
    function key(p) { return CH.placement(p.b) + p.turn + p.cast + p.ep; }
    function play(p, m) { var q = CH.make(p, m); q.n = (p.n || 0) + 1; q.hist = (p.hist || [key(p)]).concat([key(q)]); return q; }
    function result(p) {
      var st = CH.status(p);
      if (st === 'mate') return p.turn === 'w' ? 'b' : 'w';
      if (st) return 'd';
      if (p.hist) { var k = key(p), c = 0; p.hist.forEach(function (x) { if (x === k) c++; }); if (c >= 3) return 'd'; } /* 같은 국면 세 번 = 비김 */
      if (o.goal === 'mate') {
        var wm = 0; p.b.forEach(function (c) { if (c !== '.' && c !== 'K' && CH.isW(c)) wm++; });
        if (wm < (o.need || 1)) return 'b';
        if ((p.n || 0) >= o.lim * 2) return 'b';
      }
      if (o.lim && o.goal !== 'mate' && (p.n || 0) >= o.lim * 2) { var d = 0; p.b.forEach(function (c) { if (c !== '.') d += (CH.isW(c) ? 1 : -1) * V[c.toUpperCase()]; }); return o.lead && d >= o.lead * 100 ? 'w' : o.lead && d <= -o.lead * 100 ? 'b' : 'd'; }
      return '';
    }
    function ai(p, l) { var L = LV[l] || LV[3], few = p.b.filter(function (c) { return c !== '.'; }).length <= 5; return best(p, l === 99 && few ? 4 : L.d, { err: L.err, slack: L.slack, nodes: o.nodes || L.nodes || (few ? 120000 : 40000) }); }
    function info(p) {
      var st = CH.inCheck(p) && !CH.status(p) ? (p.turn === 'w' ? '내 킹이 체크예요! ' : '체크! ') : '';
      var d = 0; p.b.forEach(function (c) { if (c !== '.') d += (CH.isW(c) ? 1 : -1) * V[c.toUpperCase()] / 100; });
      return st + (o.lim ? '남은 수 ' + Math.max(0, o.lim - Math.floor((p.n || 0) / 2)) + '번' : (Math.floor((p.n || 0) / 2) + 1) + '번째 수') + (o.lead ? ' · 말 값 ' + (d > 0 ? '+' : '') + Math.round(d) : '');
    }
    return { moves: moves, play: play, result: result, ai: ai, info: info, chess: true, spec: { lv: lv, o: o } }; /* spec: 웹 워커에서 같은 대국을 다시 만들 때 */
  }
  /* 모든 수의 점수(두는 쪽 입장, 큰 것부터) — 문제 은행 만들기용 */
  function scores(p, depth, o) { o = o || {}; var S = search(p, o); return order(CH.legal(p)).map(function (m) { return { m: m, s: -S.ab(CH.make(p, m), depth - 1, -Infinity, Infinity, 1) }; }).sort(function (a, b) { return b.s - a.s; }); }
  G.CAI = { best: best, game: game, evalW: evalW, scores: scores, MATE: MATE };
})(window);
