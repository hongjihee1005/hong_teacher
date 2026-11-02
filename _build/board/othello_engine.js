/* 오셀로(리버시) 규칙·인공지능. 8×8, 칸 번호 = 줄 × 8 + 칸. 0 빈칸 · 1 흑(먼저) · 2 백.
   makeOthello()은 화면과 워커(Worker) 둘 다에서 씀. 수 = 칸 번호, -1 = 넘기기(둘 곳이 없을 때) */
function makeOthello() {
  var D8 = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
  var WT = [100, -20, 10, 5, 5, 10, -20, 100, -20, -50, -2, -2, -2, -2, -50, -20, 10, -2, 1, 1, 1, 1, -2, 10, 5, -2, 1, 0, 0, 1, -2, 5,
            5, -2, 1, 0, 0, 1, -2, 5, 10, -2, 1, 1, 1, 1, -2, 10, -20, -50, -2, -2, -2, -2, -50, -20, 100, -20, 10, 5, 5, 10, -20, 100];
  var ORDER = []; for (var i = 0; i < 64; i++) ORDER.push(i); ORDER.sort(function (a, b) { return WT[b] - WT[a] });
  function init() { var b = []; for (var i = 0; i < 64; i++) b.push(0); b[27] = 2; b[36] = 2; b[28] = 1; b[35] = 1; return { b: b, turn: 1, last: -1, pass: 0, n: 0 } }
  function flips(b, p, me) {
    if (b[p]) return []; var op = 3 - me, x = p & 7, y = p >> 3, out = [];
    for (var d = 0; d < 8; d++) {
      var dx = D8[d][0], dy = D8[d][1], xx = x + dx, yy = y + dy, k = 0;
      while (xx >= 0 && yy >= 0 && xx < 8 && yy < 8 && b[yy * 8 + xx] === op) { xx += dx; yy += dy; k++ }
      if (k && xx >= 0 && yy >= 0 && xx < 8 && yy < 8 && b[yy * 8 + xx] === me) for (var j = 1; j <= k; j++) out.push((y + j * dy) * 8 + x + j * dx);
    }
    return out;
  }
  function canPlay(b, p, me) {
    if (b[p]) return false; var op = 3 - me, x = p & 7, y = p >> 3;
    for (var d = 0; d < 8; d++) {
      var dx = D8[d][0], dy = D8[d][1], xx = x + dx, yy = y + dy, k = 0;
      while (xx >= 0 && yy >= 0 && xx < 8 && yy < 8 && b[yy * 8 + xx] === op) { xx += dx; yy += dy; k++ }
      if (k && xx >= 0 && yy >= 0 && xx < 8 && yy < 8 && b[yy * 8 + xx] === me) return true;
    }
    return false;
  }
  function legal(b, me) { var o = []; for (var i = 0; i < 64; i++) { var p = ORDER[i]; if (canPlay(b, p, me)) o.push(p) } return o }
  function count(b) { var c = [0, 0, 0]; for (var i = 0; i < 64; i++) c[b[i]]++; return c }
  function over(st) {
    if (legal(st.b, 1).length || legal(st.b, 2).length) return null;
    var c = count(st.b); return { w: c[1] > c[2] ? 1 : c[2] > c[1] ? 2 : 0, why: '더 둘 곳이 없어요. 흑 ' + c[1] + ' · 백 ' + c[2] };
  }
  function moves(st) { return legal(st.b, st.turn) }
  function play(st, p) {
    var b = st.b.slice();
    if (p < 0) return { b: b, turn: 3 - st.turn, last: -1, pass: st.pass + 1, n: st.n, fl: [] };
    var f = flips(b, p, st.turn); b[p] = st.turn; for (var i = 0; i < f.length; i++) b[f[i]] = st.turn;
    return { b: b, turn: 3 - st.turn, last: p, pass: 0, n: st.n + 1, fl: f };
  }
  /* 점수: 자리 값(모서리 큼, 모서리 옆 위험 — 모서리를 차지하면 옆도 괜찮음) + 둘 수 있는 곳 수 */
  var CORN = [[0, [1, 8, 9]], [7, [6, 15, 14]], [56, [57, 48, 49]], [63, [62, 55, 54]]];
  function evalB(b, me, myMob) {
    var op = 3 - me, s = 0;
    for (var i = 0; i < 64; i++) { var v = b[i]; if (v === me) s += WT[i]; else if (v === op) s -= WT[i] }
    for (var k = 0; k < 4; k++) if (b[CORN[k][0]]) CORN[k][1].forEach(function (q) { var v = b[q]; if (v === me) s -= WT[q]; else if (v === op) s += WT[q] });
    return s + 6 * (myMob - legal(b, op).length);
  }
  function final(b, me) { var c = count(b), d = c[me] - c[3 - me]; return d * 1000 + (d > 0 ? 50000 : d < 0 ? -50000 : 0) }
  var stop = 0, nodes = 0;
  function nega(b, me, depth, a, bt, passed, exact) {
    if ((++nodes & 1023) === 0 && stop && Date.now() > stop) throw 'time';
    var ms = legal(b, me);
    if (!ms.length) { if (passed) return final(b, me); return -nega(b, 3 - me, depth, -bt, -a, true, exact) }
    if (depth <= 0 && !exact) return evalB(b, me, ms.length);
    for (var i = 0; i < ms.length; i++) {
      var p = ms[i], f = flips(b, p, me); b[p] = me; for (var j = 0; j < f.length; j++) b[f[j]] = me;
      var v = -nega(b, 3 - me, depth - 1, -bt, -a, false, exact);
      b[p] = 0; for (j = 0; j < f.length; j++) b[f[j]] = 3 - me;
      if (v > a) { a = v; if (a >= bt) break }
    }
    return a;
  }
  function rootScores(st, depth, exact) {
    var b = st.b.slice(), me = st.turn;
    return legal(b, me).map(function (p) {
      var f = flips(b, p, me); b[p] = me; f.forEach(function (q) { b[q] = me });
      var v = -nega(b, 3 - me, depth - 1, -1e9, 1e9, false, exact);
      b[p] = 0; f.forEach(function (q) { b[q] = 3 - me }); return { c: p, v: v };
    });
  }
  /* 단계: 1 아무 데나(가끔 많이 뒤집기) · 2 가장 많이 뒤집기 · 3~10 자리 값을 보며 더 멀리 읽기, 끝이 가까우면 끝까지 정확히 */
  var LV = [null, { rnd: 1 }, { d: 1, noise: 120 }, { d: 1, noise: 30 }, { d: 2, noise: 10, err: .15 }, { d: 3, ex: 6, err: .12 }, { d: 4, ex: 8, err: .08 }, { d: 6, ex: 12, ms: 3000, err: .05 }, { d: 7, ex: 14, ms: 3500, err: .03 }, { d: 8, ex: 16, ms: 4000, err: .01 }, { d: 10, ex: 18, ms: 4500 }];
  function pick(L, noise, err) {
    var S = L.map(function (o) { return { c: o.c, v: o.v + (noise ? Math.random() * noise : 0), w: o.v } }).sort(function (a, b) { return b.v - a.v });
    if (err && S.length > 1 && S[0].w < 40000 && Math.random() < err) { var k = Math.min(3, S.length) - 1; return S[1 + ((Math.random() * k) | 0)].c }   // 가끔 2~3번째 수
    var bs = S.filter(function (o) { return Math.abs(o.v - S[0].v) < 1e-9 }); return bs[(Math.random() * bs.length) | 0].c;
  }

  function ai(st, level) {
    var C = LV[level], ms = moves(st);
    if (!ms.length) return -1;
    if (C.rnd != null || C.greedy) {
      if (C.rnd && Math.random() < C.rnd) return ms[(Math.random() * ms.length) | 0];
      return pick(ms.map(function (p) { return { c: p, v: flips(st.b, p, st.turn).length } }), 0);
    }
    var empt = count(st.b)[0], best = null;
    stop = C.ms ? Date.now() + C.ms : 0; nodes = 0;
    try {
      for (var d = C.ms ? 1 : C.d; d <= C.d; d++) best = rootScores(st, d, false);
      if (C.ex && empt <= C.ex) best = rootScores(st, 99, true);
    } catch (e) { if (e !== 'time') throw e }
    stop = 0;
    if (!best) best = rootScores(st, 1, false);
    return pick(best, C.noise, C.err);
  }
  return { init: init, moves: moves, play: play, over: over, ai: ai, count: count, flips: flips, LV: LV };
}
