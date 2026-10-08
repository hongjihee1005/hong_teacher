/* 사목(네 개 이어 떨어뜨리기) 규칙·인공지능. 7칸 × 6줄, 칸 번호 = 줄(0 맨 위) × 7 + 칸. 0 빈칸 · 1 빨강(먼저) · 2 노랑.
   makeC4()은 화면과 워커(Worker) 둘 다에서 씀. 수 = 칸 번호(0~6) */
function makeC4() {
  var W = 7, H = 6, ORD = [3, 2, 4, 1, 5, 0, 6], DIR = [[1, 0], [0, 1], [1, 1], [1, -1]], WIN = [];
  for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) for (var d = 0; d < 4; d++) {
    var ex = x + 3 * DIR[d][0], ey = y + 3 * DIR[d][1];
    if (ex >= 0 && ex < W && ey >= 0 && ey < H) WIN.push([0, 1, 2, 3].map(function (k) { return (y + k * DIR[d][1]) * W + x + k * DIR[d][0] }));
  }
  function init() { var b = []; for (var i = 0; i < W * H; i++) b.push(0); return { b: b, turn: 1, n: 0, last: -1 } }
  function drop(b, c) { for (var r = H - 1; r >= 0; r--) if (!b[r * W + c]) return r * W + c; return -1 }
  function four(b, p) {
    var v = b[p], x = p % W, y = (p / W) | 0;
    for (var d = 0; d < 4; d++) {
      var L = [p];
      for (var s = -1; s <= 1; s += 2) for (var k = 1; k < 4; k++) { var xx = x + s * k * DIR[d][0], yy = y + s * k * DIR[d][1]; if (xx < 0 || yy < 0 || xx >= W || yy >= H || b[yy * W + xx] !== v) break; L.push(yy * W + xx) }
      if (L.length >= 4) return L;
    }
    return null;
  }
  function over(st) {
    if (st.last >= 0) { var L = four(st.b, st.last); if (L) return { w: st.b[st.last], why: '네 개가 한 줄로 이어졌어요.', line: L } }
    if (st.n >= W * H) return { w: 0, why: '판이 꽉 찼어요.' };
    return null;
  }
  function moves(st) { if (over(st)) return []; return ORD.filter(function (c) { return !st.b[c] }) }
  function play(st, c) { var b = st.b.slice(), p = drop(b, c); b[p] = st.turn; return { b: b, turn: 3 - st.turn, n: st.n + 1, last: p } }
  /* 점수: 네 칸 묶음마다 내 돌·상대 돌 수 + 가운데 칸 */
  function evalB(b, me) {
    var s = 0, op = 3 - me;
    for (var r = 0; r < H; r++) { var v = b[r * W + 3]; if (v === me) s += 3; else if (v === op) s -= 3 }
    for (var i = 0; i < WIN.length; i++) {
      var w = WIN[i], m = 0, o = 0;
      for (var k = 0; k < 4; k++) { var v2 = b[w[k]]; if (v2 === me) m++; else if (v2 === op) o++ }
      if (m && o) continue;
      if (m === 3) s += 5; else if (m === 2) s += 2;
      if (o === 3) s -= 5; else if (o === 2) s -= 2;
    }
    return s;
  }
  var stop = 0, nodes = 0, BIG = 1e6;
  function nega(b, h, me, depth, a, bt, ply, n) {
    if ((++nodes & 1023) === 0 && stop && Date.now() > stop) throw 'time';
    if (n >= W * H) return 0;
    if (depth === 0) return evalB(b, me);
    for (var i = 0; i < 7; i++) { var c = ORD[i]; if (h[c] >= 0) { var p = h[c] * W + c; b[p] = me; var f = four(b, p); b[p] = 0; if (f) return BIG - ply } }
    for (i = 0; i < 7; i++) {
      c = ORD[i]; if (h[c] < 0) continue;
      p = h[c] * W + c; b[p] = me; h[c]--;
      var v = -nega(b, h, 3 - me, depth - 1, -bt, -a, ply + 1, n + 1);
      b[p] = 0; h[c]++;
      if (v > a) { a = v; if (a >= bt) break }
    }
    return a;
  }
  function heights(b) { var h = []; for (var c = 0; c < W; c++) { var p = drop(b, c); h.push(p < 0 ? -1 : (p / W) | 0) } return h }
  function rootScores(st, depth) {
    var b = st.b.slice(), h = heights(b), me = st.turn, out = [];
    moves(st).forEach(function (c) {
      var p = h[c] * W + c; b[p] = me; var v;
      if (four(b, p)) v = BIG; else { h[c]--; v = -nega(b, h, 3 - me, depth - 1, -BIG - 1, BIG + 1, 1, st.n + 1); h[c]++ }
      b[p] = 0; out.push({ c: c, v: v });
    });
    return out;
  }
  /* 단계: 1 거의 아무 데나 · 2 이기는 수만 봄 · 3 상대의 이기는 수도 막음 · 4~10 더 멀리 읽기(10은 시간 안에서 최대한) */
  var LV = [null, { d: 0 }, { d: 1, noise: 6, err: .3 }, { d: 2, noise: 4, err: .3 }, { d: 4, err: .3 }, { d: 4, err: .12 }, { d: 6, err: .12 }, { d: 6, err: .04 }, { d: 8, err: .02 }, { d: 10, ms: 2500, err: .01 }, { d: 16, ms: 3500 }];
  function pick(L, noise, err) {
    var S = L.map(function (o) { return { c: o.c, v: o.v + (noise ? Math.random() * noise : 0), w: o.v } }).sort(function (a, b) { return b.v - a.v });
    if (err && S.length > 1 && S[0].w < BIG - 50 && Math.random() < err) { var k = Math.min(3, S.length) - 1; return S[1 + ((Math.random() * k) | 0)].c }   // 가끔 2~3번째 수
    var bs = S.filter(function (o) { return Math.abs(o.v - S[0].v) < 1e-9 }); return bs[(Math.random() * bs.length) | 0].c;
  }

  function ai(st, level) {
    var C = LV[level], ms = moves(st);
    if (!ms.length) return -1;
    if (!C.d) {   // 1단계: 이기는 수는 절반만, 막는 수는 세 번에 한 번
      var w = rootScores(st, 1).filter(function (o) { return o.v >= BIG });
      if (w.length && Math.random() < .5) return w[0].c;
      if (Math.random() < .33) { var bl = rootScores({ b: st.b, turn: 3 - st.turn, n: st.n }, 1).filter(function (o) { return o.v >= BIG }); if (bl.length) return bl[0].c }
      return ms[(Math.random() * ms.length) | 0];
    }
    stop = C.ms ? Date.now() + C.ms : 0; nodes = 0;
    var best = null;
    try { for (var d = C.ms ? 1 : C.d; d <= C.d; d++) { best = rootScores(st, d); if (best.some(function (o) { return o.v >= BIG - 50 })) break } } catch (e) { if (e !== 'time') throw e }
    stop = 0;
    if (!best) best = rootScores(st, 1);
    return pick(best, C.noise, C.err);
  }
  return { W: W, H: H, init: init, moves: moves, play: play, over: over, ai: ai, drop: drop, LV: LV };
}
