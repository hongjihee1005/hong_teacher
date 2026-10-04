/* 미로 생성기 — 같은 학년·번호면 언제나 같은 미로. 화면 400×400.
   모든 미로는 '칸(셀) 그래프'로 만듭니다: 칸 모양(다각형·부채꼴), 이웃, 벽.
   벽 미로: 벽을 허문 통로로만 이동 / 조건 미로: 벽 없이 조건에 맞는 칸만(set) 또는 정해진 순서대로(seq) 이동 */
var MZ = (function () {
  var PI = Math.PI;
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } }
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)) }
  function pick(r, a) { return a[Math.floor(r() * a.length)] }
  function shuf(r, a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }
  function f(n) { return Math.round(n * 10) / 10 }

  /* ── 모양 틀(마스크): u,v ∈ [-1,1] ── */
  function inPoly(u, v, P) { var c = false; for (var i = 0, j = P.length - 1; i < P.length; j = i++) { if ((P[i][1] > v) !== (P[j][1] > v) && u < (P[j][0] - P[i][0]) * (v - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c } return c }
  var STAR = []; for (var k = 0; k < 10; k++) { var a = -PI / 2 + k * PI / 5, rr = k % 2 ? .42 : 1; STAR.push([rr * Math.cos(a), rr * Math.sin(a) + .08]) }
  var MASKS = {
    circle: ['동그라미', function (u, v) { return u * u + v * v <= .97 }],
    heart: ['하트', function (u, v) { var x = u * 1.15, y = -v * 1.15 + .25; return Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y <= 0 }],
    star: ['별', function (u, v) { return inPoly(u, v, STAR) }],
    diamond: ['다이아몬드', function (u, v) { return Math.abs(u) + Math.abs(v) <= 1.02 }],
    cross: ['십자', function (u, v) { return (Math.abs(u) < .38 || Math.abs(v) < .38) && Math.abs(u) <= 1 && Math.abs(v) <= 1 }],
    house: ['집', function (u, v) { return (v > -.15 && Math.abs(u) < .8) || (v <= -.15 && v > -1 && Math.abs(u) < (v + 1) * 1.15) }],
    tree: ['나무', function (u, v) { return (v < .55 && Math.abs(u) < (v + 1) * .62) || (v >= .55 && Math.abs(u) < .2) }],
    fish: ['물고기', function (u, v) { return ((u + .2) * (u + .2) / .55 + v * v / .38 <= 1) || (u > .45 && Math.abs(v) < (u - .45) * 1.3 && u < 1) }],
    ring: ['도넛', function (u, v) { var d = u * u + v * v; return d <= .97 && d >= .14 }],
    moon: ['초승달', function (u, v) { return u * u + v * v <= .95 && ((u - .42) * (u - .42) + (v + .1) * (v + .1)) >= .55 }],
    hexagon: ['육각형', function (u, v) { return Math.abs(v) <= .87 && Math.abs(u) * .87 + Math.abs(v) * .5 <= .87 }],
    apple: ['사과', function (u, v) { return (u * u / .85 + (v - .12) * (v - .12) / .75 <= 1) || (Math.abs(u - .12) < .08 && v < -.5 && v > -.95) }],
    rocket: ['로켓', function (u, v) { return (Math.abs(u) < .32 && v > -.45 && v < .7) || (v <= -.45 && v > -1 && Math.abs(u) < (v + 1) * .58) || (v > .25 && v < .85 && Math.abs(u) < .32 + (v - .25) * 1.1) }],
    butterfly: ['나비', function (u, v) { var a = Math.abs(u); return ((a - .5) * (a - .5) / .2 + (v + .25) * (v + .25) / .3 <= 1) || ((a - .4) * (a - .4) / .12 + (v - .45) * (v - .45) / .18 <= 1) || (a < .1 && Math.abs(v) < .8) }],
  };

  /* ── 칸 나누기(타일) ── */
  function tile(kind, n, mask) {
    var cells = [], M = 14, W = 400 - 2 * M;
    if (kind === 'sq') {
      var s = W / n;
      for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) { var x = M + c * s, y = M + r * s; cells.push([[x, y], [x + s, y], [x + s, y + s], [x, y + s]]) }
    } else if (kind === 'hex') {   // 위가 평평한 육각형, 세로줄 엇갈림
      var sh = W / (1.5 * n + .5), hh = Math.sqrt(3) * sh, rows = Math.floor(W / hh - .5);
      for (var cc = 0; cc < n; cc++) for (var rr = 0; rr < rows; rr++) {
        var cx = M + sh + cc * 1.5 * sh, cy = M + hh / 2 + rr * hh + (cc % 2 ? hh / 2 : 0), p = [];
        for (var k = 0; k < 6; k++) p.push([cx + sh * Math.cos(k * PI / 3), cy + sh * Math.sin(k * PI / 3)]);
        cells.push(p);
      }
    } else if (kind === 'tri') {
      var ts = W / ((n + 1) / 2), th = ts * Math.sqrt(3) / 2, trows = Math.floor(W / th);
      for (var tr = 0; tr < trows; tr++) for (var tc = 0; tc < n; tc++) {
        var x0 = M + (tc - 1) * ts / 2, y0 = M + tr * th, up = (tc + tr) % 2 === 0;
        if (x0 < M - 1e-6 || x0 + ts > 400 - M + 1e-6) continue;
        cells.push(up ? [[x0 + ts / 2, y0], [x0 + ts, y0 + th], [x0, y0 + th]] : [[x0, y0], [x0 + ts, y0], [x0 + ts / 2, y0 + th]]);
      }
    }
    var ctr = function (p) { var x = 0, y = 0; p.forEach(function (q) { x += q[0]; y += q[1] }); return [x / p.length, y / p.length] };
    var out = cells.map(function (p) { return { p: p, c: ctr(p) } });
    if (mask) { var mf = MASKS[mask][1]; out = out.filter(function (o) { return mf((o.c[0] - 200) / (W / 2), (o.c[1] - 200) / (W / 2)) }) }
    return graphFromPolys(out);
  }
  function key(p) { return Math.round(p[0] * 4) + ',' + Math.round(p[1] * 4) }
  function graphFromPolys(cells) {
    var em = {}, walls = [];
    cells.forEach(function (o, i) {
      o.w = [];
      for (var k = 0; k < o.p.length; k++) {
        var a = o.p[k], b = o.p[(k + 1) % o.p.length], kk = [key(a), key(b)].sort().join('|');
        if (em[kk] === undefined) { em[kk] = walls.length; walls.push({ a: i, b: -1, g: 'M' + f(a[0]) + ' ' + f(a[1]) + 'L' + f(b[0]) + ' ' + f(b[1]) }) }
        else walls[em[kk]].b = i;
        o.w.push(em[kk]);
      }
      o.d = 'M' + o.p.map(function (q) { return f(q[0]) + ' ' + f(q[1]) }).join('L') + 'Z';
    });
    return keepBig({ cells: cells, walls: walls });
  }
  /* 원형 미로: rings개 고리, 가운데 원 칸 */
  function circle(rings) {
    var R = 186, w = R / (rings + 1), cells = [{ c: [200, 200], d: circ(200, 200, w), w: [] }], walls = [], ring = [[0]], ns = [1];
    function pol(r, a) { return [200 + r * Math.cos(a), 200 + r * Math.sin(a)] }
    function arc(r, a0, a1) { var p = pol(r, a0), q = pol(r, a1); return 'M' + f(p[0]) + ' ' + f(p[1]) + 'A' + f(r) + ' ' + f(r) + ' 0 0 1 ' + f(q[0]) + ' ' + f(q[1]) }
    for (var i = 1; i <= rings; i++) {
      var r0 = w * i, r1 = w * (i + 1), prev = ns[i - 1], n = i === 1 ? 6 : prev;
      if (i > 1 && 2 * PI * r0 / prev > w * 1.9) n = prev * 2;
      ns.push(n); ring.push([]);
      for (var j = 0; j < n; j++) {
        var a0 = -PI / 2 + j * 2 * PI / n, a1 = a0 + 2 * PI / n, p0 = pol(r1, a0), p1 = pol(r1, a1), p2 = pol(r0, a1), p3 = pol(r0, a0), id = cells.length;
        cells.push({ c: pol((r0 + r1) / 2, (a0 + a1) / 2), d: 'M' + f(p0[0]) + ' ' + f(p0[1]) + 'A' + f(r1) + ' ' + f(r1) + ' 0 0 1 ' + f(p1[0]) + ' ' + f(p1[1]) + 'L' + f(p2[0]) + ' ' + f(p2[1]) + 'A' + f(r0) + ' ' + f(r0) + ' 0 0 0 ' + f(p3[0]) + ' ' + f(p3[1]) + 'Z', w: [], ring: i, a0: a0, a1: a1, r1: r1 });
        ring[i].push(id);
      }
      for (j = 0; j < n; j++) {   // 옆 칸과의 벽
        var A = ring[i][j], Bc = ring[i][(j + 1) % n], ang = -PI / 2 + (j + 1) * 2 * PI / n, q0 = pol(r0, ang), q1 = pol(r1, ang);
        walls.push({ a: A, b: Bc, g: 'M' + f(q0[0]) + ' ' + f(q0[1]) + 'L' + f(q1[0]) + ' ' + f(q1[1]) }); cells[A].w.push(walls.length - 1); cells[Bc].w.push(walls.length - 1);
        var inner = i === 1 ? 0 : ring[i - 1][Math.floor(j * prev / n)], aa = -PI / 2 + j * 2 * PI / n;
        walls.push({ a: ring[i][j], b: inner, g: arc(r0, aa, aa + 2 * PI / n) }); cells[ring[i][j]].w.push(walls.length - 1); cells[inner].w.push(walls.length - 1);
      }
    }
    ring[rings].forEach(function (id) { var o = cells[id]; walls.push({ a: id, b: -1, g: arc(o.r1, o.a0, o.a1) }); o.w.push(walls.length - 1) });
    return { cells: cells, walls: walls, circ: 1 };
  }
  function circ(cx, cy, r) { return 'M' + f(cx - r) + ' ' + f(cy) + 'a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(2 * r) + ' 0a' + f(r) + ' ' + f(r) + ' 0 1 0 ' + f(-2 * r) + ' 0Z' }
  function nb(G, i) { return G.cells[i].w.map(function (k) { var w = G.walls[k]; return w.b < 0 ? -1 : (w.a === i ? w.b : w.a) }).filter(function (x) { return x >= 0 }) }
  function keepBig(G) {   // 가장 큰 연결 덩어리만 남김
    var n = G.cells.length, comp = new Array(n).fill(-1), best = -1, bs = 0;
    for (var s = 0; s < n; s++) if (comp[s] < 0) { var q = [s], cnt = 0; comp[s] = s; while (q.length) { var x = q.pop(); cnt++; nb(G, x).forEach(function (y) { if (comp[y] < 0) { comp[y] = s; q.push(y) } }) } if (cnt > bs) { bs = cnt; best = s } }
    var map = {}, cells = []; G.cells.forEach(function (o, i) { if (comp[i] === best) { map[i] = cells.length; cells.push(o) } });
    var walls = [], wm = {};
    G.walls.forEach(function (w, k) {
      var a = map[w.a], b = w.b >= 0 ? map[w.b] : undefined;
      if (a === undefined && b === undefined) return;
      if (a === undefined) { a = b; b = undefined }
      wm[k] = walls.length; walls.push({ a: a, b: b === undefined ? -1 : b, g: w.g });
    });
    cells.forEach(function (o) { o.w = o.w.filter(function (k) { return wm[k] !== undefined }).map(function (k) { return wm[k] }) });
    return { cells: cells, walls: walls, circ: G.circ };
  }
  function bfs(G, s, ok) {
    var d = new Array(G.cells.length).fill(-1), pr = d.slice(), q = [s]; d[s] = 0;
    for (var h = 0; h < q.length; h++) { var x = q[h]; G.cells[x].w.forEach(function (k) { var w = G.walls[k]; if (w.b < 0) return; var y = w.a === x ? w.b : w.a; if (d[y] < 0 && ok(k, x, y)) { d[y] = d[x] + 1; pr[y] = x; q.push(y) } }) }
    return { d: d, pr: pr };
  }
  function route(pr, g) { var p = []; for (var x = g; x >= 0; x = pr[x]) p.unshift(x); return p }

  /* ── 벽 미로 ── */
  function carve(G, r, style) {   // style 0: 긴 굽은 길(DFS), 1: 갈래 많음(prim 비슷)
    var n = G.cells.length, seen = new Array(n).fill(false), open = {}, st = [ri(r, 0, n - 1)]; seen[st[0]] = true;
    while (st.length) {
      var idx = style && r() < style ? Math.floor(r() * st.length) : st.length - 1, x = st[idx];
      var cand = shuf(r, G.cells[x].w.filter(function (k) { var w = G.walls[k]; if (w.b < 0) return false; var y = w.a === x ? w.b : w.a; return !seen[y] }));
      if (!cand.length) { st.splice(idx, 1); continue }
      var k = cand[0], w = G.walls[k], y = w.a === x ? w.b : w.a; open[k] = 1; seen[y] = true; st.push(y);
    }
    return open;
  }
  function wallMaze(spec, r) {
    var G = spec.geo === 'circ' ? circle(spec.n) : tile(spec.geo, spec.n, spec.mask), open = carve(G, r, spec.style || 0), s, g, ow = [];
    var border = function (i) { return G.cells[i].w.filter(function (k) { return G.walls[k].b < 0 }) };
    if (G.circ) s = 0;
    else { var bc = G.cells.map(function (o, i) { return i }).filter(function (i) { return border(i).length }); s = bc.reduce(function (m, i) { var c = G.cells[i].c, cm = G.cells[m].c; return c[1] * 1.3 + c[0] < cm[1] * 1.3 + cm[0] ? i : m }, bc[0]) }
    var B = bfs(G, s, function (k) { return open[k] });
    var far = -1; G.cells.forEach(function (o, i) { if (border(i).length && i !== s && (far < 0 || B.d[i] > B.d[far])) far = i }); g = far;
    if (!G.circ) ow.push(outer(G, s, border(s))); ow.push(outer(G, g, border(g)));
    return { G: G, open: open, s: s, g: g, sol: route(B.pr, g), gate: ow, kind: 'wall' };
  }
  function outer(G, i, ks) { var c = G.cells[i].c; return ks.reduce(function (m, k) { return dist(G, k, c) > dist(G, m, c) ? k : m }, ks[0]) }
  function dist(G, k, c) { var m = G.walls[k].g.match(/-?[\d.]+/g).map(Number), x = (m[0] + m[m.length - 2]) / 2, y = (m[1] + m[m.length - 1]) / 2; return Math.hypot(x - 200, y - 200) }

  /* ── 조건 미로 ── */
  function grow(G, r, s, g, minLen, strict) {
    var n = G.cells.length, adj = G.cells.map(function (o, i) { return nb(G, i) }), on = new Array(n).fill(false), path = [s], budget = 40000; on[s] = true;
    function ok(y, x) { if (on[y]) return false; if (!strict) return true; return adj[y].every(function (z) { return z === x || !on[z] || z === g && false }) }
    function go(x) {
      if (--budget < 0) return false;
      if (x === g) return path.length >= minLen;
      var c = shuf(r, adj[x].filter(function (y) { return ok(y, x) }));
      c.sort(function (a, b) { return (a === g ? 1 : 0) - (b === g ? 1 : 0) });   // 도착점은 되도록 나중에
      for (var i = 0; i < c.length; i++) { var y = c[i]; on[y] = true; path.push(y); if (go(y)) return true; path.pop(); on[y] = false; if (budget < 0) return false }
      return false;
    }
    return go(s) ? path : null;
  }
  function ruleMaze(spec, r) {
    var G = tile(spec.geo, spec.n, spec.mask), n = G.cells.length, C = G.cells, s = 0, g = 0;
    C.forEach(function (o, i) { if (o.c[0] + o.c[1] < C[s].c[0] + C[s].c[1]) s = i; if (o.c[0] + o.c[1] > C[g].c[0] + C[g].c[1]) g = i });
    var path = null, want = Math.round(n * (spec.fill || .42));
    for (var t = 0; t < 30 && !path; t++) path = grow(G, r, s, g, Math.max(4, want - t * 2), true);
    for (t = 0; t < 10 && !path; t++) path = grow(G, r, s, g, 2, false);
    var R = RULES[spec.rule], adj = C.map(function (o, i) { return nb(G, i) }), on = {}, lab = new Array(n), okc = new Array(n).fill(false);
    path.forEach(function (x, i) { on[x] = i });
    if (R.t === 'seq') {
      var seq = R.seq(r, path.length); path.forEach(function (x, i) { lab[x] = seq[i]; okc[x] = true });
      C.forEach(function (o, i) {
        if (on[i] !== undefined) return;
        var bad = {}; adj[i].forEach(function (z) { if (on[z] !== undefined && on[z] + 1 < path.length) bad[seq[on[z] + 1]] = 1 });
        var l, tries = 0; do { l = R.other(r, seq) } while (bad[l] && ++tries < 60); lab[i] = bad[l] ? R.filler : l;
      });
      return { G: G, s: s, g: g, sol: path, lab: lab, seq: seq, kind: 'seq', rule: spec.rule };
    }
    path.forEach(function (x) { lab[x] = R.yes(r); okc[x] = true });
    var deco = {};
    if (spec.branch) {   // 조건에 맞는 막다른 갈래(헷갈리게)
      var tries = 0, made = 0, goal = Math.round(path.length * spec.branch);
      while (made < goal && tries++ < 400) {
        var from = path[ri(r, 1, path.length - 2)], cur = from, len = ri(r, 1, 3), br = [];
        for (var q = 0; q < len; q++) {
          var cs = adj[cur].filter(function (y) { return on[y] === undefined && !deco[y] && br.indexOf(y) < 0 && adj[y].every(function (z) { return z === cur || (on[z] === undefined && !deco[z] && br.indexOf(z) < 0) }) });
          if (!cs.length) break; cur = pick(r, cs); br.push(cur);
        }
        br.forEach(function (y) { deco[y] = 1; lab[y] = R.yes(r); okc[y] = true }); made += br.length;
      }
    }
    C.forEach(function (o, i) {
      if (on[i] !== undefined || deco[i]) return;
      var touch = adj[i].some(function (z) { return on[z] !== undefined || deco[z] });
      if (!touch && r() < .22) { lab[i] = R.yes(r); okc[i] = true } else lab[i] = R.no(r);
    });
    return { G: G, s: s, g: g, sol: path, lab: lab, ok: okc, kind: 'set', rule: spec.rule };
  }

  /* ── 조건(규칙) 모음 ── */
  function nums(a, b, cond) { var o = []; for (var i = a; i <= b; i++) if (cond(i)) o.push(i); return o }
  function setR(name, yesA, noA) { return { t: 'set', name: name, yes: function (r) { return String(pick(r, yesA)) }, no: function (r) { return String(pick(r, noA)) } } }
  function setF(name, yes, no) { return { t: 'set', name: name, yes: yes, no: no } }
  function seqR(name, gen, pool, filler) { return { t: 'seq', name: name, seq: gen, other: function (r) { return String(pick(r, pool)) }, filler: filler || '★' } }
  function count(a, step) { return function (r, L) { var o = []; for (var i = 0; i < L; i++) o.push(String(Math.round((a + i * step) * 100) / 100)); return o } }
  function cyc(list) { return function (r, L) { var o = []; for (var i = 0; i < L; i++) o.push(list[i % list.length]); return o } }
  function expr(name, target, mk) {   // 식의 값이 target인 칸만
    return setF(name, function (r) { return mk(r, target) }, function (r) { var t; do { t = target + pick(r, [-3, -2, -1, 1, 2, 3, 4]) } while (t < 1); return mk(r, t) });
  }
  var add = function (r, t) { var a = ri(r, Math.max(0, t - 9 > 0 ? t - 9 : 0), Math.min(t, 9)); return a + '+' + (t - a) };
  var add2 = function (r, t) { var a = ri(r, 1, t - 1); return a + '+' + (t - a) };
  var sub = function (r, t) { var b = ri(r, 1, 9 + Math.floor(t / 2)); return (t + b) + '-' + b };
  var mul = function (r, t) { var ds = nums(1, 9, function (d) { return t % d === 0 && t / d <= 9 }); if (!ds.length) return t + '×1'; var d = pick(r, ds); return d + '×' + (t / d) };
  var dvd = function (r, t) { var b = ri(r, 2, 9); return (t * b) + '÷' + b };
  var mix = function (r, t) { var a = ri(r, 2, 4), b = ri(r, 2, 3), c = t - a * b; if (c > 0) return a + '×' + b + '+' + c; return (a * b) + '-' + (a * b - t) };
  var FRUIT = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍑', '🍒', '🍉', '🍐', '🥝', '🍍', '🍋'], ANIMAL = ['🐶', '🐱', '🐰', '🐻', '🐼', '🦁', '🐯', '🐸', '🐵', '🐷', '🐮', '🦊'],
    VEH = ['🚗', '🚌', '🚲', '🚂', '✈️', '🚀', '🚢', '🚁', '🚓', '🚒'], VEG = ['🥕', '🥦', '🌽', '🥔', '🍆', '🥬', '🧅', '🫑', '🍅'], SEA = ['🐟', '🐙', '🦀', '🐬', '🐳', '🦈', '🐢', '🦑', '🐠'],
    BUG = ['🐝', '🦋', '🐞', '🐜', '🦗', '🐛'], THING = ['⚽', '📚', '✏️', '🎈', '⏰', '🧸', '🎁', '👟', '🔑', '☂️'];
  var GANADA = '가나다라마바사아자차카타파하'.split(''), ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  function frac(r, okf) { for (var t = 0; t < 99; t++) { var d = ri(r, 2, 12), n = ri(r, 1, d - 1); if (okf(n, d)) return n + '/' + d } return '1/2' }
  function gcd(a, b) { return b ? gcd(b, a % b) : a }
  function isP(n) { if (n < 2) return false; for (var i = 2; i * i <= n; i++) if (n % i === 0) return false; return true }
  var RULES = {
    even20: setR('짝수만 따라가요', nums(2, 20, function (x) { return x % 2 === 0 }), nums(1, 19, function (x) { return x % 2 })),
    odd20: setR('홀수만 따라가요', nums(1, 19, function (x) { return x % 2 }), nums(2, 20, function (x) { return x % 2 === 0 })),
    even50: setR('짝수만 따라가요', nums(10, 98, function (x) { return x % 2 === 0 }), nums(11, 99, function (x) { return x % 2 })),
    odd50: setR('홀수만 따라가요', nums(11, 99, function (x) { return x % 2 }), nums(10, 98, function (x) { return x % 2 === 0 })),
    fruit: setR('과일만 따라가요', FRUIT, ANIMAL.concat(VEH, THING)), animal: setR('동물만 따라가요', ANIMAL, FRUIT.concat(VEH, THING)),
    vehicle: setR('탈것만 따라가요', VEH, FRUIT.concat(ANIMAL, THING)), veg: setR('채소만 따라가요', VEG, FRUIT.concat(ANIMAL, THING)),
    sea: setR('바다 동물만 따라가요', SEA, ANIMAL.concat(BUG, FRUIT)), bug: setR('곤충만 따라가요', BUG, ANIMAL.concat(SEA, FRUIT)),
    count1: seqR('1부터 순서대로 따라가요 (1→2→3…)', count(1, 1), nums(1, 40, function () { return 1 })),
    ganada: seqR('가나다 순서대로 따라가요 (가→나→다…)', cyc(GANADA), GANADA),
    pat2: seqR('🍎→🍌 반복 규칙대로 따라가요', cyc(['🍎', '🍌']), ['🍎', '🍌', '🍇'], '🍇'),
    pat3: seqR('🐶→🐱→🐰 반복 규칙대로 따라가요', cyc(['🐶', '🐱', '🐰']), ['🐶', '🐱', '🐰', '🐻'], '🐻'),
    pat4: seqR('🔴→🟡→🔵→🟢 반복 규칙대로 따라가요', cyc(['🔴', '🟡', '🔵', '🟢']), ['🔴', '🟡', '🔵', '🟢', '🟣'], '🟣'),
    sum10: expr('더해서 10이 되는 칸만 따라가요', 10, add),
    sum5: expr('더해서 5가 되는 칸만 따라가요', 5, add),
    sum15: expr('더해서 15가 되는 칸만 따라가요', 15, add2),
    sub5: expr('빼서 5가 되는 칸만 따라가요', 5, sub),
    down30: seqR('30부터 1씩 작아지는 순서로 (30→29→28…)', count(30, -1), nums(1, 40, function () { return 1 })),
    skip2: seqR('2씩 뛰어 세며 따라가요 (2→4→6…)', count(2, 2), nums(1, 80, function () { return 1 })),
    skip5: seqR('5씩 뛰어 세며 따라가요 (5→10→15…)', count(5, 5), nums(1, 30, function (x) { return 1 }).map(function (x) { return x * 5 - (x % 3 ? 2 : 0) })),
    skip10: seqR('10씩 뛰어 세며 따라가요 (10→20→30…)', count(10, 10), nums(1, 60, function () { return 1 }).map(function (x) { return x * 5 })),
    skip100: seqR('100씩 뛰어 세며 따라가요 (100→200→…)', count(100, 100), nums(1, 60, function () { return 1 }).map(function (x) { return x * 50 })),
    t2: seqR('2단 순서대로 따라가요 (2→4→6…)', count(2, 2), nums(1, 60, function () { return 1 })),
    t3: seqR('3단 순서대로 따라가요 (3→6→9…)', count(3, 3), nums(1, 90, function () { return 1 })),
    t4: seqR('4단 순서대로 따라가요 (4→8→12…)', count(4, 4), nums(1, 120, function () { return 1 })),
    t5: seqR('5단 순서대로 따라가요 (5→10→15…)', count(5, 5), nums(1, 150, function () { return 1 })),
    t6: seqR('6씩 커지는 순서로 (6→12→18…)', count(6, 6), nums(1, 200, function () { return 1 })),
    t7: seqR('7씩 커지는 순서로 (7→14→21…)', count(7, 7), nums(1, 230, function () { return 1 })),
    t8: seqR('8씩 커지는 순서로 (8→16→24…)', count(8, 8), nums(1, 260, function () { return 1 })),
    t9: seqR('9씩 커지는 순서로 (9→18→27…)', count(9, 9), nums(1, 300, function () { return 1 })),
    t12: seqR('12씩 커지는 순서로 (12→24→36…)', count(12, 12), nums(1, 400, function () { return 1 })),
    mul12: expr('곱해서 12가 되는 칸만 따라가요', 12, mul), mul24: expr('곱해서 24가 되는 칸만 따라가요', 24, mul), mul36: expr('곱해서 36이 되는 칸만 따라가요', 36, mul),
    div4: expr('나누어서 4가 되는 칸만 따라가요', 4, dvd), div6: expr('나누어서 6이 되는 칸만 따라가요', 6, dvd), div7: expr('나누어서 7이 되는 칸만 따라가요', 7, dvd),
    sum100: expr('더해서 100이 되는 칸만 따라가요', 100, function (r, t) { var a = ri(r, 11, t - 11); return a + '+' + (t - a) }),
    sub20: expr('빼서 20이 되는 칸만 따라가요', 20, sub),
    k3set: setR('3단 곱셈구구의 값만 따라가요', nums(3, 27, function (x) { return x % 3 === 0 }), nums(1, 28, function (x) { return x % 3 })),
    abc: seqR('알파벳 순서대로 따라가요 (A→B→C…)', cyc(ABC), ABC),
    th1000: seqR('1000씩 뛰어 세며 따라가요 (1000→2000→…)', count(1000, 1000), nums(1, 40, function () { return 1 }).map(function (x) { return x * 500 })),
    man10000: seqR('10000씩 뛰어 세며 따라가요', count(10000, 10000), nums(1, 40, function () { return 1 }).map(function (x) { return x * 5000 })),
    dec01: seqR('0.1씩 커지는 순서로 (0.1→0.2→…)', count(.1, .1), nums(1, 40, function () { return 1 }).map(function (x) { return String(Math.round(x * 5) / 100) })),
    m3: setR('3의 배수만 따라가요', nums(3, 99, function (x) { return x % 3 === 0 }), nums(2, 98, function (x) { return x % 3 })),
    m4: setR('4의 배수만 따라가요', nums(4, 100, function (x) { return x % 4 === 0 }), nums(2, 99, function (x) { return x % 4 })),
    fsum1: expr('더해서 1이 되는 분수만 따라가요', 1, function (r, t) { var d = ri(r, 3, 9), a = ri(r, 1, d - 1); var b = t === 1 ? d - a : Math.max(1, d - a + (t > 1 ? 1 : -1)); if (b < 1) b = 1; return a + '/' + d + '+' + b + '/' + d }),
    dsum1: expr('더해서 1이 되는 소수만 따라가요', 1, function (r, t) { var a = ri(r, 1, 9); var b = t === 1 ? 10 - a : 10 - a + pick(r, [-2, -1, 1, 2]); if (b < 1) b = 11 - a; return '0.' + a + '+' + (b >= 10 ? (b / 10).toFixed(1) : '0.' + b) }),
    down7: seqR('100에서 7씩 작아지는 순서로 (100→93→86…)', count(100, -7), nums(1, 100, function () { return 1 })),
    d24: setR('24의 약수만 따라가요', [1, 2, 3, 4, 6, 8, 12, 24], [5, 7, 9, 10, 11, 13, 14, 15, 16, 18, 20, 21, 22]),
    d36: setR('36의 약수만 따라가요', [1, 2, 3, 4, 6, 9, 12, 18, 36], [5, 7, 8, 10, 11, 14, 15, 16, 20, 24, 27, 30]),
    mul6: setR('6의 배수만 따라가요', nums(6, 96, function (x) { return x % 6 === 0 }), nums(4, 98, function (x) { return x % 6 && x % 2 === 0 || x % 3 === 0 && x % 6 })),
    mul7: setR('7의 배수만 따라가요', nums(7, 98, function (x) { return x % 7 === 0 }), nums(5, 99, function (x) { return x % 7 })),
    cm23: setR('2와 3의 공배수만 따라가요', nums(6, 96, function (x) { return x % 6 === 0 }), nums(2, 98, function (x) { return (x % 2 === 0 || x % 3 === 0) && x % 6 })),
    cm46: setR('4와 6의 공배수만 따라가요', nums(12, 120, function (x) { return x % 12 === 0 }), nums(4, 118, function (x) { return (x % 4 === 0 || x % 6 === 0) && x % 12 })),
    half: setF('1/2과 크기가 같은 분수만 따라가요', function (r) { var k = ri(r, 2, 9); return k + '/' + (2 * k) }, function (r) { return frac(r, function (n, d) { return 2 * n !== d }) }),
    third2: setF('2/3과 크기가 같은 분수만 따라가요', function (r) { var k = ri(r, 2, 8); return (2 * k) + '/' + (3 * k) }, function (r) { return frac(r, function (n, d) { return 3 * n !== 2 * d }) }),
    third1: setF('약분하면 1/3이 되는 분수만 따라가요', function (r) { var k = ri(r, 2, 9); return k + '/' + (3 * k) }, function (r) { return frac(r, function (n, d) { return 3 * n !== d }) }),
    mix10: expr('계산한 값이 10인 칸만 따라가요', 10, mix), mix12: expr('계산한 값이 12인 칸만 따라가요', 12, mix),
    dbl: seqR('두 배씩 커지는 순서로 (1→2→4→8…)', function (r, L) { var o = []; for (var i = 0; i < L; i++) o.push(String(Math.pow(2, i % 16))); return o }, nums(1, 40, function () { return 1 }).map(function (x) { return x * 3 })),
    q25: seqR('0.25씩 커지는 순서로 (0.25→0.5→0.75…)', count(.25, .25), nums(1, 40, function () { return 1 }).map(function (x) { return String(Math.round(x * 0.2 * 100) / 100) })),
    cd1218: setR('12와 18의 공약수만 따라가요', [1, 2, 3, 6], [4, 5, 7, 8, 9, 12, 18, 10, 24, 36]),
    prime: setF('소수(1과 자기 자신만으로 나누어지는 수)만 따라가요', function (r) { var p; do { p = ri(r, 2, 97) } while (!isP(p)); return String(p) }, function (r) { var p; do { p = ri(r, 4, 99) } while (isP(p)); return String(p) }),
    sq: setF('제곱수(같은 수를 두 번 곱한 수)만 따라가요', function (r) { var k = ri(r, 1, 12); return String(k * k) }, function (r) { var p; do { p = ri(r, 2, 140) } while (Math.sqrt(p) % 1 === 0); return String(p) }),
    r23: setF('2:3과 같은 비만 따라가요', function (r) { var k = ri(r, 2, 9); return (2 * k) + ':' + (3 * k) }, function (r) { var a, b; do { a = ri(r, 2, 18); b = ri(r, 2, 27) } while (3 * a === 2 * b); return a + ':' + b }),
    r34: setF('3:4와 같은 비만 따라가요', function (r) { var k = ri(r, 2, 9); return (3 * k) + ':' + (4 * k) }, function (r) { var a, b; do { a = ri(r, 2, 27); b = ri(r, 2, 36) } while (4 * a === 3 * b); return a + ':' + b }),
    p50: setR('50%와 크기가 같은 것만 따라가요', ['1/2', '0.5', '50%', '2/4', '5/10', '3/6', '10/20', '0.50'], ['1/3', '0.4', '40%', '2/5', '0.25', '60%', '3/4', '0.05', '5%', '2/3']),
    p25: setR('25%와 크기가 같은 것만 따라가요', ['1/4', '0.25', '25%', '2/8', '5/20', '3/12', '25/100'], ['1/5', '0.2', '20%', '2/4', '0.4', '52%', '1/3', '0.025', '2.5%']),
    fdiv2: expr('나눈 값이 2인 분수 나눗셈만 따라가요', 2, function (r, t) { var d = ri(r, 3, 9), c = ri(r, 1, 3); var a = t * c; if (a >= 3 * d) a = c + 1; return a + '/' + d + '÷' + c + '/' + d }),
    ddiv3: expr('나눈 값이 3인 소수 나눗셈만 따라가요', 3, function (r, t) { var b = ri(r, 2, 9) / 10; return (Math.round(b * t * 10) / 10) + '÷' + b }),
    tri3: seqR('세 배씩 커지는 순서로 (1→3→9→27…)', function (r, L) { var o = []; for (var i = 0; i < L; i++) o.push(String(Math.pow(3, i % 10))); return o }, nums(1, 60, function () { return 1 }).map(function (x) { return x * 2 })),
    fib: seqR('앞의 두 수를 더하는 순서로 (1→1→2→3→5→8…)', function (r, L) { var o = [], a = 1, b = 1; for (var i = 0; i < L; i++) { o.push(String(a)); var c = a + b; a = b; b = c; if (a > 10000) { a = 1; b = 1 } } return o }, nums(1, 40, function () { return 1 }).map(function (x) { return x * 3 + 1 })),
    sqseq: seqR('제곱수 순서로 (1→4→9→16…)', function (r, L) { var o = []; for (var i = 0; i < L; i++) o.push(String((i % 30 + 1) * (i % 30 + 1))); return o }, nums(2, 99, function (x) { return Math.sqrt(x) % 1 })),
  };

  /* ── 학년별 90개 ── */
  var THEME = [['🐰', '🥕'], ['🐝', '🌼'], ['🐶', '🦴'], ['🐱', '🐟'], ['🐿️', '🌰'], ['🐼', '🎋'], ['🚀', '🌍'], ['🐧', '🧊'], ['🐸', '🪷'], ['🐻', '🍯'], ['🐭', '🧀'], ['🐵', '🍌'], ['🦋', '🌸'], ['🐢', '🏝️'], ['🧒', '🏫'], ['🐞', '🍀']];
  var SHAPES = ['heart', 'circle', 'star', 'diamond', 'house', 'fish', 'tree', 'apple', 'cross', 'moon', 'hexagon', 'ring', 'rocket', 'butterfly'];
  var GR = {   // 학년 설정
    1: { sq: [4, 7], msq: 9, tri: 0, circ: [3, 3], hex: 0, rg: [4, 5], rules: ['even20', 'odd20', 'fruit', 'animal', 'count1', 'pat2', 'pat3', 'vehicle', 'ganada', 'pat4'], hard: ['sum10', 'count1', 'fruit', 'pat3', 'even20'], hsq: [7, 8] },
    2: { sq: [6, 10], msq: 12, tri: 9, circ: [3, 4], hex: 0, rg: [5, 6], rules: ['even50', 'odd50', 'skip5', 'skip10', 'down30', 'sum15', 'sub5', 'veg', 'sea', 'pat4'], hard: ['t2', 't5', 'mul12', 'skip100', 'sum10'], hsq: [10, 12] },
    3: { sq: [9, 13], msq: 15, tri: 13, circ: [4, 5], hex: 7, rg: [6, 7], rules: ['t3', 't4', 'sum100', 'sub20', 'mul24', 'div4', 'k3set', 'skip100', 'abc', 'bug'], hard: ['t7', 't8', 'div6', 'mul36', 'th1000'], hsq: [13, 15] },
    4: { sq: [12, 16], msq: 18, tri: 17, circ: [5, 7], hex: 9, rg: [7, 8], rules: ['t6', 't7', 't8', 't9', 'man10000', 'dec01', 'm4', 'fsum1', 'div7', 'th1000'], hard: ['m3', 'fsum1', 'dsum1', 't12', 'down7'], hsq: [16, 19] },
    5: { sq: [16, 20], msq: 22, tri: 21, circ: [7, 9], hex: 12, rg: [8, 9], rules: ['d24', 'd36', 'mul6', 'mul7', 'cm23', 'half', 'third2', 'mix10', 'dbl', 'q25'], hard: ['cm46', 'cd1218', 'third1', 'mix12', 'half'], hsq: [20, 23] },
    6: { sq: [20, 26], msq: 26, tri: 25, circ: [9, 12], hex: 15, rg: [9, 10], rules: ['prime', 'sq', 'r23', 'p50', 'p25', 'fdiv2', 'ddiv3', 'tri3', 'fib', 'sqseq'], hard: ['prime', 'r34', 'p50', 'sqseq', 'sq'], hsq: [25, 30] },
  };
  function specs(g) {
    var C = GR[g], S = [], r = rng(g * 7919), lerp = function (a, b, t) { return Math.round(a + (b - a) * t) };
    // 쉬움·보통·도전 30개씩. 단계마다 벽 미로 15 + 조건 미로 15를 번갈아 놓고, 단계가 오를수록 크고 어렵게.
    var W = [[], [], []], R = [[], [], []], i;
    var midSq = lerp(C.sq[0], C.sq[1], .5), smallMask = Math.max(8, C.msq - (g > 1 ? 3 : 1));
    for (i = 0; i < 10; i++) W[0].push({ geo: 'sq', n: lerp(C.sq[0], midSq, i / 9) });
    for (i = 0; i < 5; i++) W[0].push({ geo: 'sq', n: smallMask, mask: SHAPES[(i + g * 3) % SHAPES.length] });
    for (i = 0; i < 4; i++) W[1].push({ geo: 'sq', n: lerp(midSq + 1, C.sq[1], i / 3) });
    for (i = 0; i < 6; i++) W[1].push({ geo: 'sq', n: C.msq, mask: SHAPES[(i + 5 + g * 3) % SHAPES.length] });
    for (i = 0; i < 5; i++) {
      var opt = [{ geo: 'circ', n: lerp(C.circ[0], C.circ[1], i / 4) }];
      if (C.tri) opt.push({ geo: 'tri', n: C.tri }); if (C.hex) opt.push({ geo: 'hex', n: C.hex });
      if (g === 1) opt.push({ geo: 'sq', n: 9, mask: SHAPES[(i + 11) % SHAPES.length] });
      W[1].push(opt[i % opt.length]);
    }
    for (i = 0; i < 15; i++) {
      var t = i % 5, h;
      if (t === 0) h = { geo: 'sq', n: lerp(C.hsq[0], C.hsq[1], i / 14) };
      else if (t === 1) h = { geo: 'circ', n: C.circ[1] + 1 + (g > 3 ? 1 : 0) };
      else if (t === 2) h = { geo: g >= 3 ? 'hex' : 'sq', n: g >= 3 ? C.hex + 2 : C.msq + 2, mask: SHAPES[(i + g) % SHAPES.length] };
      else if (t === 3) h = { geo: g >= 2 ? 'tri' : 'sq', n: g >= 2 ? C.tri + 4 : C.msq + 2, mask: SHAPES[(i * 3 + g) % SHAPES.length] };
      else h = { geo: 'sq', n: C.msq + 4, mask: SHAPES[(i * 5 + g) % SHAPES.length] };
      W[2].push(h);
    }
    W.forEach(function (L, b) { L.forEach(function (x, k) { x.k = 'wall'; x.style = (k + b) % 3 === 2 ? .35 + b * .1 : 0 }) });
    for (i = 0; i < 15; i++) R[0].push({ k: 'rule', rule: C.rules[i % 10], geo: 'sq', n: C.rg[0], fill: .38 });
    for (i = 0; i < 15; i++) R[1].push({ k: 'rule', rule: C.rules[(i + 5) % 10], geo: 'sq', n: C.rg[1], fill: .45 });
    for (i = 0; i < 15; i++) R[2].push({ k: 'rule', rule: C.hard[i % 5], geo: g >= 4 && i % 3 === 2 ? 'hex' : 'sq', n: g >= 4 && i % 3 === 2 ? C.rg[1] - 1 : C.rg[1] + 1, fill: .45, branch: .5 });
    for (var b2 = 0; b2 < 3; b2++) for (i = 0; i < 15; i++) { S.push(W[b2][i]); S.push(R[b2][i]) }
    S.forEach(function (x, k) { x.seed = g * 1000 + k + 1; x.th = THEME[(k * 5 + g) % THEME.length]; x.lv = k < 30 ? '쉬움' : k < 60 ? '보통' : '도전' });
    return S;
  }
  var GEO = { sq: '네모', tri: '세모 칸', hex: '벌집', circ: '원형' };
  function title(s) {
    if (s.k === 'rule') return RULES[s.rule].name;
    if (s.geo === 'circ') return '원형 미로 (가운데에서 밖으로)';
    if (s.mask) return MASKS[s.mask][0] + ' 모양 ' + (s.geo === 'sq' ? '' : GEO[s.geo] + ' ') + '미로';
    return GEO[s.geo] + ' 미로' + (s.geo === 'sq' ? ' ' + s.n + '×' + s.n : '');
  }
  function make(s) { var r = rng(s.seed); var m = s.k === 'rule' ? ruleMaze(s, r) : wallMaze(s, r); m.spec = s; return m }
  /* 이동 가능? (벽 미로: 열린 벽 / 조건 미로: 이웃) */
  function link(m, x, y) {
    var ks = m.G.cells[x].w; for (var i = 0; i < ks.length; i++) { var w = m.G.walls[ks[i]]; if (w.b >= 0 && ((w.a === x && w.b === y) || (w.b === x && w.a === y))) return m.kind === 'wall' ? !!m.open[ks[i]] : true }
    return false;
  }
  function neighbors(m, x) { return nb(m.G, x) }
  /* 풀 수 있는지 점검(규칙대로 BFS) */
  function check(m) {
    if (m.kind === 'wall') { var B = bfs(m.G, m.s, function (k) { return m.open[k] }); return B.d[m.g] > 0 }
    if (m.kind === 'set') { var B2 = bfs(m.G, m.s, function (k, x, y) { return m.ok[y] }); return m.ok[m.s] && B2.d[m.g] > 0 }
    // seq: 상태 = (칸, 몇 번째)
    var seen = {}, q = [[m.s, 0]]; if (m.lab[m.s] !== m.seq[0]) return false;
    while (q.length) { var p = q.shift(); if (p[0] === m.g && p[1] === m.seq.length - 1) return true; nb(m.G, p[0]).forEach(function (y) { var t = p[1] + 1; if (t < m.seq.length && m.lab[y] === m.seq[t] && !seen[y + ',' + t]) { seen[y + ',' + t] = 1; q.push([y, t]) } }) }
    return false;
  }

  /* 그리기: 칸(누를 자리) + 벽/칸 테두리 + 글자 + 출발·도착 + 길 그리는 층 */
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function svg(m, o) {
    o = o || {}; var C = m.G.cells, cs = Math.sqrt(368 * 368 * (m.G.circ ? .78 : 1) / C.length), sw = Math.max(1.6, Math.min(5, cs / 8)), s = '';
    s += '<rect x="0" y="0" width="400" height="400" fill="#fff"/>';
    C.forEach(function (c, i) {
      var fill = m.kind === 'wall' ? (i === m.s ? '#E3F4DE' : i === m.g ? '#FDE2E4' : 'rgba(255,255,255,0)') : (i === m.s ? '#CDEFC4' : i === m.g ? '#FFD3D8' : '#FFFDF8');
      s += '<path class="mz-c" data-c="' + i + '" d="' + c.d + '" fill="' + fill + '"' + (m.kind === 'wall' ? '' : ' stroke="#D9CBB8" stroke-width="1.2"') + '/>';
    });
    s += '<g class="mz-sol" pointer-events="none" ' + (o.sol ? '' : 'style="display:none"') + '><polyline points="' + m.sol.map(function (i) { return f(C[i].c[0]) + ',' + f(C[i].c[1]) }).join(' ') + '" fill="none" stroke="#F2A93B" stroke-width="' + f(Math.max(3, cs * .28)) + '" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/></g>';
    s += '<g class="mz-trail" pointer-events="none"></g>';
    if (m.kind === 'wall') {
      var d = ''; m.G.walls.forEach(function (w, k) { if (!m.open[k] && m.gate.indexOf(k) < 0) d += w.g });
      s += '<path d="' + d + '" fill="none" stroke="#2A221C" stroke-width="' + f(sw) + '" stroke-linecap="round"/>';
      var es = f(Math.min(cs * .72, 44));
      [[m.s, m.spec.th[0]], [m.g, m.spec.th[1]]].forEach(function (p) { var c = C[p[0]].c; s += '<text x="' + f(c[0]) + '" y="' + f(c[1]) + '" font-size="' + es + '" text-anchor="middle" dominant-baseline="central" pointer-events="none">' + p[1] + '</text>' });
    } else {
      C.forEach(function (c, i) {
        var t = m.lab[i], emo = /[\u2600-\u27BF\uD83C-\uDBFF]/.test(t), L = emo ? 1.6 : String(t).length, fs = Math.min(cs * (emo ? .5 : .42), cs * 1.45 / Math.max(L, 1) * (emo ? 1 : 1.2));
        s += '<text x="' + f(c.c[0]) + '" y="' + f(c.c[1]) + '" font-size="' + f(fs) + '" text-anchor="middle" dominant-baseline="central" font-weight="700" fill="#2A221C" pointer-events="none">' + esc(t) + '</text>';
      });
    }
    return '<svg class="mz-svg" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
  }
  return { svg: svg, specs: specs, make: make, title: title, link: link, neighbors: neighbors, check: check, RULES: RULES, MASKS: MASKS };
})();
if (typeof module !== 'undefined') module.exports = MZ;
