/* 바둑 규칙·인공지능. makeBaduk()은 화면과 워커 둘 다에서 씀.
   판: (n+2)² 칸 Int8Array — 0 빈칸 · 1 흑 · 2 백 · 3 바깥. 자리 p = (y+1)*(n+2)+(x+1).
   상태 S = {n, b, ko, cap:[0,흑이 잡은 수,백이 잡은 수], turn, pass, moves, goal}  goal>0이면 따먹기 바둑(먼저 goal개 잡으면 승). */
function makeBaduk() {
  function init(n, goal) { var W = n + 2, b = new Int8Array(W * W); for (var i = 0; i < W * W; i++) { var x = i % W, y = (i / W) | 0; if (x === 0 || y === 0 || x === W - 1 || y === W - 1) b[i] = 3 } return { n: n, b: b, ko: -1, cap: [0, 0, 0], turn: 1, pass: 0, moves: 0, goal: goal || 0, last: -1 } }
  function clone(S) { return { n: S.n, b: new Int8Array(S.b), ko: S.ko, cap: S.cap.slice(), turn: S.turn, pass: S.pass, moves: S.moves, goal: S.goal, last: S.last } }
  var mark = new Int32Array(0), stamp = 0, stk = new Int32Array(0);
  function prep(len) { if (mark.length < len) { mark = new Int32Array(len); stk = new Int32Array(len) } }
  /* 무리와 활로 수(limit까지 세면 멈춤) */
  function libs(b, W, p, limit, out) {
    prep(b.length); stamp++; var c = b[p], sp = 0, L = 0; stk[sp++] = p; mark[p] = stamp; var nb = [1, -1, W, -W];
    if (out) out.length = 0;
    while (sp) { var q = stk[--sp]; if (out) out.push(q); for (var k = 0; k < 4; k++) { var r = q + nb[k]; if (mark[r] === stamp) continue; var v = b[r]; if (v === 0) { mark[r] = stamp; L++; if (limit && L >= limit && !out) return L } else if (v === c) { mark[r] = stamp; stk[sp++] = r } } }
    return L;
  }
  var tmp = [];
  /* 두기: 성공하면 true(S를 바꿈), 못 두면 false. p<0이면 통과 */
  function play(S, p) {
    var b = S.b, W = S.n + 2, me = S.turn, op = 3 - me;
    if (p < 0) { S.pass++; S.turn = op; S.ko = -1; S.moves++; S.last = -1; return true }
    if (b[p] !== 0 || p === S.ko) return false;
    b[p] = me; var nb = [1, -1, W, -W], got = 0, last = -1;
    for (var k = 0; k < 4; k++) { var r = p + nb[k]; if (b[r] === op && libs(b, W, r, 1) === 0) { libs(b, W, r, 0, tmp); for (var i = 0; i < tmp.length; i++) b[tmp[i]] = 0; got += tmp.length; last = tmp[0] } }
    if (!got && libs(b, W, p, 1) === 0) { b[p] = 0; return false }
    S.ko = -1;
    if (got === 1) { var own = 0, emp = 0; for (k = 0; k < 4; k++) { var v = b[p + nb[k]]; if (v === me) own++; if (v === 0) emp++ } if (!own && emp === 1) S.ko = last }
    S.cap[me] += got; S.pass = 0; S.turn = op; S.moves++; S.last = p; return true;
  }
  function legalAt(S, p) { var T = clone(S); return play(T, p) }
  function isEye(b, W, p, c) {
    var nb = [1, -1, W, -W]; for (var k = 0; k < 4; k++) { var v = b[p + nb[k]]; if (v !== c && v !== 3) return false }
    var dg = [W + 1, W - 1, -W + 1, -W - 1], bad = 0, edge = 0; for (k = 0; k < 4; k++) { var u = b[p + dg[k]]; if (u === 3) edge = 1; else if (u === 3 - c) bad++ }
    return edge ? bad === 0 : bad <= 1;
  }
  /* 집 세기(판 위의 돌 + 둘러싼 빈칸) — 결과는 [0, 흑, 백] */
  function area(b, W) {
    var sc = [0, 0, 0]; prep(b.length); stamp++;
    for (var p = 0; p < b.length; p++) {
      var v = b[p]; if (v === 1 || v === 2) { sc[v]++; continue } if (v !== 0 || mark[p] === stamp) continue;
      var sp = 0, cnt = 0, touch = 0; stk[sp++] = p; mark[p] = stamp;
      while (sp) { var q = stk[--sp]; cnt++; for (var k = 0, nb = [1, -1, W, -W]; k < 4; k++) { var r = q + nb[k], u = b[r]; if (u === 0 && mark[r] !== stamp) { mark[r] = stamp; stk[sp++] = r } else if (u === 1 || u === 2) touch |= u } }
      if (touch === 1 || touch === 2) sc[touch] += cnt;
    }
    return sc;
  }
  function empties(S) { var o = [], b = S.b; for (var p = 0; p < b.length; p++) if (b[p] === 0) o.push(p); return o }
  /* 활로가 하나뿐이면 그 자리, 아니면 -1 */
  function oneLib(b, W, p) { libs(b, W, p, 0, tmp); var nb = [1, -1, W, -W], f = -1; for (var i = 0; i < tmp.length; i++) for (var k = 0; k < 4; k++) { var r = tmp[i] + nb[k]; if (b[r] === 0) { if (f < 0) f = r; else if (f !== r) return -1 } } return f }
  /* 무작위 끝까지 두기 → 흑 기준 결과(+1 흑 승, -1 백 승, 0 비김). own이 있으면 마지막 판의 주인을 더함 */
  function playout(S, komi, own) {
    var W = S.n + 2, lim = S.n * S.n * 3, b = S.b, nb = [1, -1, W, -W], E = empties(S), caps = S.cap[1] + S.cap[2];
    while (S.moves < lim) {
      if (S.goal && (S.cap[1] >= S.goal || S.cap[2] >= S.goal)) break;
      var me = S.turn, done = false;
      if (S.last >= 0 && b[S.last] === 3 - me && Math.random() < .9) { var lb = oneLib(b, W, S.last); if (lb >= 0 && play(S, lb)) done = true }
      for (var n = E.length; n > 0 && !done; n--) {
        var i = (Math.random() * n) | 0, q = E[i]; E[i] = E[n - 1]; E[n - 1] = q;
        if (b[q] !== 0) continue;
        if (!S.goal && isEye(b, W, q, me)) continue;
        if (play(S, q)) done = true;
      }
      if (!done) { play(S, -1); if (S.pass >= 2) break; continue }
      var c2 = S.cap[1] + S.cap[2]; if (c2 !== caps) { caps = c2; E = empties(S) } else { var j = E.indexOf(S.last); if (j >= 0) { E[j] = E[E.length - 1]; E.pop() } }
    }
    if (S.goal) { var r = S.cap[1] >= S.goal ? 1 : S.cap[2] >= S.goal ? -1 : 0; if (r) return r }
    var sc = area(b, W);
    if (own) for (var p = 0; p < b.length; p++) { var v = b[p]; if (v === 1) own[p]++; else if (v === 2) own[p]--; else if (v === 0) { var o = 0; for (var k = 0; k < 4; k++) { var u = b[p + nb[k]]; if (u === 1) o |= 1; else if (u === 2) o |= 2 } if (o === 1) own[p]++; else if (o === 2) own[p]-- } }
    var d = sc[1] - sc[2] - komi; return d > 0 ? 1 : d < 0 ? -1 : 0;
  }
  function moves(S) { var b = S.b, W = S.n + 2, o = []; for (var p = 0; p < b.length; p++) if (b[p] === 0 && p !== S.ko && !(!S.goal && isEye(b, W, p, S.turn)) && legalAt(S, p)) o.push(p); return o }
  /* 몬테카를로 트리 탐색 */
  function mcts(S, iters, komi, ms) {
    var root = { m: -1, n: 0, w: 0, kids: null, un: moves(S), turn: S.turn }, t0 = Date.now();
    if (!root.un.length) return { p: -1, rate: 0 };
    for (var it = 0; it < iters; it++) {
      if (ms && (it & 63) === 0 && Date.now() - t0 > ms) break;
      var T = clone(S), node = root, path = [root];
      while (!node.un.length && node.kids && node.kids.length) {
        var best = null, bv = -1, lg = Math.log(node.n + 1);
        for (var i = 0; i < node.kids.length; i++) { var c = node.kids[i], v = c.w / (c.n + 1e-9) + 1.0 * Math.sqrt(lg / (c.n + 1e-9)); if (v > bv) { bv = v; best = c } }
        play(T, best.m); node = best; path.push(node);
      }
      if (node.un.length && !(T.goal && (T.cap[1] >= T.goal || T.cap[2] >= T.goal))) {
        var j = (Math.random() * node.un.length) | 0, m = node.un[j]; node.un[j] = node.un[node.un.length - 1]; node.un.pop();
        var mover = T.turn; play(T, m); var kid = { m: m, n: 0, w: 0, kids: null, un: null, turn: T.turn, mover: mover }; kid.un = (T.goal && (T.cap[1] >= T.goal || T.cap[2] >= T.goal)) ? [] : moves(T);
        (node.kids = node.kids || []).push(kid); node = kid; path.push(kid);
      }
      var r = playout(T, komi);   // +1 흑 승
      for (i = 0; i < path.length; i++) { var nd = path[i]; nd.n++; var mv = nd.mover || (3 - nd.turn); if ((r > 0 && mv === 1) || (r < 0 && mv === 2)) nd.w++; else if (r === 0) nd.w += .5 }
    }
    var kids = root.kids || [], bestK = null; kids.forEach(function (k) { if (!bestK || k.n > bestK.n) bestK = k });
    return bestK ? { p: bestK.m, rate: bestK.w / bestK.n, kids: kids.map(function (k) { return [k.m, k.n, k.w / k.n] }) } : { p: root.un[0], rate: .5 };
  }
  /* 주인 추정(죽은 돌·집): 무작위로 여러 번 끝까지 둬서 평균 */
  function owner(S, k) { var own = new Float32Array(S.b.length); for (var i = 0; i < k; i++) { var T = clone(S); T.goal = 0; playout(T, 0, own) } for (i = 0; i < own.length; i++) own[i] /= k; return own }
  function judge(S, own, dead, komi) {   // dead: 죽은 돌 자리 집합(Uint8Array)
    var b = S.b, W = S.n + 2, sc = [0, 0, 0], terr = new Int8Array(b.length);
    for (var p = 0; p < b.length; p++) { var v = b[p]; if (v === 3) continue; if ((v === 1 || v === 2) && !dead[p]) { sc[v]++; terr[p] = v; continue } var o = own[p]; var t = v && dead[p] ? 3 - v : o > .35 ? 1 : o < -.35 ? 2 : 0; if (t) { sc[t]++; terr[p] = t } }
    return { b: sc[1], w: sc[2], komi: komi, diff: sc[1] - sc[2] - komi, terr: terr };
  }
  function deadFrom(S, own) { var d = new Uint8Array(S.b.length); for (var p = 0; p < S.b.length; p++) { var v = S.b[p]; if (v === 1 && own[p] < -.4) d[p] = 1; if (v === 2 && own[p] > .4) d[p] = 1 } return d }
  return { init: init, clone: clone, play: play, legalAt: legalAt, mcts: mcts, owner: owner, judge: judge, deadFrom: deadFrom, libs: libs, area: area, isEye: isEye, moves: moves };
}
