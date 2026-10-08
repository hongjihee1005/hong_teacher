/* 점 잇기 상자 규칙·인공지능. 상자 N×N개(점 (N+1)×(N+1)). 선 번호: 가로선 줄 r(0~N)·칸 c → r×N+c, 세로선 줄 r·칸 c(0~N) → (N+1)N + r(N+1)+c.
   차례마다 선 하나를 긋고, 상자의 네 변을 내가 완성하면 그 상자를 갖고 한 번 더 함. 선을 다 그으면 상자가 많은 쪽 승리.
   수 = 선 번호. makeDots()은 화면과 워커 둘 다에서 씀 */
function makeDots() {
  var G = {};
  function geo(N) {
    if (G[N]) return G[N];
    var H = (N + 1) * N, E = H + N * (N + 1), BE = [], EB = [];
    for (var i = 0; i < E; i++) EB.push([]);
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) { var b = r * N + c, es = [r * N + c, (r + 1) * N + c, H + r * (N + 1) + c, H + r * (N + 1) + c + 1]; BE.push(es); es.forEach(function (e) { EB[e].push(b) }) }
    return G[N] = { N: N, H: H, E: E, BE: BE, EB: EB };
  }
  function init(o) { var N = (o && o.n) || 3, g = geo(N), e = [], bx = []; for (var i = 0; i < g.E; i++) e.push(0); for (i = 0; i < N * N; i++) bx.push(0); return { N: N, e: e, bx: bx, turn: 1, k: 0, last: -1, again: false } }
  function cnt(st) { var c = [0, 0, 0]; st.bx.forEach(function (v) { c[v]++ }); return c }
  function over(st) { if (st.k < st.e.length) return null; var c = cnt(st); return { w: c[1] > c[2] ? 1 : c[2] > c[1] ? 2 : 0, why: '선을 다 그었어요. 상자 ' + c[1] + ' : ' + c[2] } }
  function moves(st) { if (over(st)) return []; var m = []; for (var i = 0; i < st.e.length; i++) if (!st.e[i]) m.push(i); return m }
  function sides(e, g, b) { var s = 0, es = g.BE[b]; for (var i = 0; i < 4; i++) if (e[es[i]]) s++; return s }
  function play(st, m) {
    var g = geo(st.N), e = st.e.slice(), bx = st.bx.slice(), got = 0; e[m] = st.turn;
    g.EB[m].forEach(function (b) { if (sides(e, g, b) === 4) { bx[b] = st.turn; got++ } });
    return { N: st.N, e: e, bx: bx, turn: got ? st.turn : 3 - st.turn, k: st.k + 1, last: m, again: got > 0 };
  }
  /* 인공지능 도구: 상자를 완성하는 선 · 세 번째 변을 만들지 않는 '안전한' 선 · 상대가 가져갈 상자 수(희생) */
  function gains(e, g, m) { var n = 0; g.EB[m].forEach(function (b) { if (sides(e, g, b) === 3) n++ }); return n }
  function safe(e, g, m) { var ok = true; g.EB[m].forEach(function (b) { if (sides(e, g, b) === 2) ok = false }); return ok }
  function giveAway(e0, g, m) {   // 이 선을 그으면 상대가 이어서 몇 상자를 가져가는가
    var e = e0.slice(); e[m] = 1; var n = 0, again = true;
    while (again) { again = false; for (var b = 0; b < g.BE.length; b++) if (sides(e, g, b) === 3) { g.BE[b].forEach(function (x) { if (!e[x]) e[x] = 1 }); n++; again = true } }
    return n;
  }
  var stop = 0, nodes = 0, memo = null;
  function solve(e, g, key, left) {   // 남은 상자에서 (지금 둘 사람 − 상대) 최대
    if (!left) return 0;
    if ((++nodes & 1023) === 0 && stop && Date.now() > stop) throw 'time';
    var hit = memo.get(key); if (hit !== undefined) return hit;
    var best = -1e9, ms = [];
    for (var m = 0; m < g.E; m++) if (!e[m]) ms.push(m);
    ms.sort(function (a, b) { return gains(e, g, b) - gains(e, g, a) });
    for (var i = 0; i < ms.length; i++) {
      var m2 = ms[i], got = gains(e, g, m2); e[m2] = 1;
      var v = got ? got + solve(e, g, key + Math.pow(2, m2), left - got) : -solve(e, g, key + Math.pow(2, m2), left);
      e[m2] = 0; if (v > best) best = v;
    }
    memo.set(key, best); return best;
  }
  /* 단계: 1 아무 선 · 2 상자는 꼭 가져감 · 3~4 상대에게 상자를 주지 않는 선 · 5~6 줄 수밖에 없으면 가장 적게 · 7~10 끝이 가까우면 끝까지 따져 보기 */
  var LV = [null, { take: .5 }, { take: 1 }, { take: 1, safe: .6 }, { take: 1, safe: 1 }, { take: 1, safe: 1, sac: 1 }, { take: 1, safe: 1, sac: 1 }, { take: 1, safe: 1, sac: 1, K: 12 }, { take: 1, safe: 1, sac: 1, K: 16, ms: 3000 }, { take: 1, safe: 1, sac: 1, K: 20, ms: 4000 }, { take: 1, safe: 1, sac: 1, K: 24, ms: 4500 }];
  function ai(st, level) {
    var C = LV[level], ms = moves(st), g = geo(st.N), e = st.e.map(function (x) { return x ? 1 : 0 }), r = function (a) { return a[(Math.random() * a.length) | 0] };
    if (!ms.length) return -1;
    if (C.K && ms.length <= C.K) {
      stop = C.ms ? Date.now() + C.ms : 0; nodes = 0; memo = new Map();
      try {
        var key = 0; for (var i = 0; i < g.E; i++) if (e[i]) key += Math.pow(2, i);
        var left = st.bx.filter(function (x) { return !x }).length, best = -1e9, bs = [];
        ms.forEach(function (m) { var got = gains(e, g, m); e[m] = 1; var v = got ? got + solve(e, g, key + Math.pow(2, m), left - got) : -solve(e, g, key + Math.pow(2, m), left); e[m] = 0; if (v > best) { best = v; bs = [m] } else if (v === best) bs.push(m) });
        stop = 0; memo = null; return r(bs);
      } catch (x) { if (x !== 'time') throw x; stop = 0; memo = null }
    }
    var tk = ms.filter(function (m) { return gains(e, g, m) > 0 });
    if (tk.length && Math.random() < C.take) return r(tk);
    if (C.safe) { var sf = ms.filter(function (m) { return safe(e, g, m) }); if (sf.length && Math.random() < C.safe) return r(sf) }
    if (C.sac) { var mn = 1e9, mb = []; ms.forEach(function (m) { var n = giveAway(e, g, m); if (n < mn) { mn = n; mb = [m] } else if (n === mn) mb.push(m) }); return r(mb) }
    return r(ms);
  }
  return { geo: geo, init: init, moves: moves, play: play, over: over, ai: ai, cnt: cnt, LV: LV };
}
