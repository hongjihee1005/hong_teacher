/* 곱셈 사목 규칙·인공지능. 6×6 판에 1~9 두 수의 곱 36가지(작은 수부터), 아래 1~9 줄에 집게 ㄱ·ㄴ.
   차례마다 집게 하나를 옮기고, 두 집게가 가리키는 수의 곱 칸을 내 색으로 칠함(이미 칠한 칸이 되는 수는 못 둠). 네 칸을 한 줄로 이으면 승리.
   맨 처음 사람은 집게 ㄱ만 놓음(칠하지 않음). 수 = 집게(0 ㄱ, 1 ㄴ) × 10 + 옮길 수(1~9), -1 = 넘기기. makeProduct()은 화면과 워커 둘 다에서 씀 */
function makeProduct() {
  var P = [], IDX = {}, N = 6, WIN = [], DIR = [[1, 0], [0, 1], [1, 1], [1, -1]], seen = {};
  for (var a = 1; a <= 9; a++) for (var b = a; b <= 9; b++) if (!seen[a * b]) { seen[a * b] = 1; P.push(a * b) }
  P.sort(function (x, y) { return x - y }); P.forEach(function (v, i) { IDX[v] = i });
  for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) for (var d = 0; d < 4; d++) {
    var ex = x + 3 * DIR[d][0], ey = y + 3 * DIR[d][1];
    if (ex >= 0 && ex < N && ey >= 0 && ey < N) WIN.push([0, 1, 2, 3].map(function (k) { return (y + k * DIR[d][1]) * N + x + k * DIR[d][0] }));
  }
  var BY = []; for (var i = 0; i < 36; i++) BY.push([]); WIN.forEach(function (w, k) { w.forEach(function (p) { BY[p].push(k) }) });
  function init() { var b = []; for (var i = 0; i < 36; i++) b.push(0); return { b: b, c: [0, 0], turn: 1, n: 0, last: -1, pass: 0 } }
  function four(b, p) { var v = b[p]; for (var i = 0; i < BY[p].length; i++) { var w = WIN[BY[p][i]]; if (b[w[0]] === v && b[w[1]] === v && b[w[2]] === v && b[w[3]] === v) return w } return null }
  function over(st) {
    if (st.last >= 0) { var w = four(st.b, st.last); if (w) return { w: st.b[st.last], why: '네 칸을 한 줄로 이었어요.', line: w } }
    if (st.pass >= 2) return { w: 0, why: '둘 다 칠할 수 있는 칸이 없어요.' };
    for (var i = 0; i < 36; i++) if (!st.b[i]) return null;
    return { w: 0, why: '판이 꽉 찼어요.' };
  }
  function gen(b, c) {
    var o = [], v;
    if (!c[0]) { for (v = 1; v <= 9; v++) o.push(v); return o }
    if (!c[1]) { for (v = 1; v <= 9; v++) if (!b[IDX[c[0] * v]]) o.push(10 + v); return o }
    for (var w = 0; w < 2; w++) for (v = 1; v <= 9; v++) if (v !== c[w] && !b[IDX[c[1 - w] * v]]) o.push(w * 10 + v);
    return o;
  }
  function moves(st) { if (over(st)) return []; return gen(st.b, st.c) }
  function cellOf(c, m) { var w = (m / 10) | 0, v = m % 10, o = w ? c[0] : c[1]; return o ? IDX[o * v] : -1 }
  function play(st, m) {
    if (m < 0) return { b: st.b.slice(), c: st.c.slice(), turn: 3 - st.turn, n: st.n + 1, last: -1, pass: st.pass + 1 };
    var c = st.c.slice(), b = st.b.slice(), w = (m / 10) | 0; c[w] = m % 10; var last = -1;
    if (c[0] && c[1]) { last = IDX[c[0] * c[1]]; b[last] = st.turn }
    return { b: b, c: c, turn: 3 - st.turn, n: st.n + 1, last: last, pass: 0 };
  }
  function evalB(b, me) {
    var s = 0, op = 3 - me;
    for (var i = 0; i < WIN.length; i++) {
      var w = WIN[i], m = 0, o = 0;
      for (var k = 0; k < 4; k++) { var v = b[w[k]]; if (v === me) m++; else if (v === op) o++ }
      if (m && o) continue;
      if (m === 3) s += 6; else if (m === 2) s += 2; else if (m === 1) s += .3;
      if (o === 3) s -= 6; else if (o === 2) s -= 2; else if (o === 1) s -= .3;
    }
    return s;
  }
  var stop = 0, nodes = 0, BIG = 1e6;
  function nega(b, c, me, depth, a, bt, ply, passed) {
    if ((++nodes & 1023) === 0 && stop && Date.now() > stop) throw 'time';
    if (depth === 0) return evalB(b, me);
    var ms = gen(b, c);
    if (!ms.length) return passed ? 0 : -nega(b, c, 3 - me, depth - 1, -bt, -a, ply + 1, true);
    for (var i = 0; i < ms.length; i++) { var p = cellOf(c, ms[i]); if (p >= 0) { b[p] = me; var f = four(b, p); b[p] = 0; if (f) return BIG - ply } }
    for (i = 0; i < ms.length; i++) {
      var m = ms[i], w = (m / 10) | 0, old = c[w]; p = cellOf(c, m); c[w] = m % 10; if (p >= 0) b[p] = me;
      var v = -nega(b, c, 3 - me, depth - 1, -bt, -a, ply + 1, false);
      c[w] = old; if (p >= 0) b[p] = 0;
      if (v > a) { a = v; if (a >= bt) break }
    }
    return a;
  }
  function rootScores(st, depth) {
    var b = st.b.slice(), c = st.c.slice(), me = st.turn;
    return gen(b, c).map(function (m) {
      var w = (m / 10) | 0, old = c[w], p = cellOf(c, m), v; c[w] = m % 10; if (p >= 0) b[p] = me;
      if (p >= 0 && four(b, p)) v = BIG; else v = -nega(b, c, 3 - me, depth - 1, -BIG - 1, BIG + 1, 1, false);
      c[w] = old; if (p >= 0) b[p] = 0; return { c: m, v: v };
    });
  }
  /* 단계: 1 아무 데나 · 2 이기는 칸만 봄 · 3~10 상대가 이기는 칸을 막고, 몇 수 앞까지 읽기(높은 단계는 시간 안에서) */
  var LV = [null, { d: 0 }, { d: 1, noise: 5, err: .3 }, { d: 2, noise: 4, err: .25 }, { d: 2, noise: 1, err: .12 }, { d: 3, err: .1 }, { d: 4, err: .06 }, { d: 5, ms: 3000, err: .04 }, { d: 6, ms: 3500, err: .02 }, { d: 7, ms: 4000, err: .01 }, { d: 9, ms: 4500 }];
  function pick(L, noise, err) {
    var S = L.map(function (o) { return { c: o.c, v: o.v + (noise ? Math.random() * noise : 0), w: o.v } }).sort(function (a, b) { return b.v - a.v });
    if (err && S.length > 1 && S[0].w < BIG - 50 && Math.random() < err) { var k = Math.min(3, S.length) - 1; return S[1 + ((Math.random() * k) | 0)].c }   // 가끔 2~3번째 수
    var bs = S.filter(function (o) { return Math.abs(o.v - S[0].v) < 1e-9 }); return bs[(Math.random() * bs.length) | 0].c;
  }

  function ai(st, level) {
    var C = LV[level], ms = moves(st);
    if (!ms.length) return -1;
    if (!C.d) { var w = rootScores(st, 1).filter(function (o) { return o.v >= BIG }); if (w.length && Math.random() < .5) return w[0].c; return ms[(Math.random() * ms.length) | 0] }
    stop = C.ms ? Date.now() + C.ms : 0; nodes = 0; var best = null;
    try { for (var d = C.ms ? 1 : C.d; d <= C.d; d++) { best = rootScores(st, d); if (best.some(function (o) { return o.v >= BIG - 50 })) break } } catch (e) { if (e !== 'time') throw e }
    stop = 0; if (!best) best = rootScores(st, 1);
    return pick(best, C.noise, C.err);
  }
  return { P: P, IDX: IDX, init: init, moves: moves, play: play, over: over, ai: ai, cellOf: cellOf, LV: LV };
}
