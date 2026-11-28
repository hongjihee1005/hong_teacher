/* 수학 방탈출 · 식물원 온실 탈출 그림 (2026-11-28) — 이름 앞글자 gh. art.js의 ART.c·ART.shape·ART.arrow·ART.esc를 씀.
   수를 읽는 그림(막대그래프·화단 울타리 막대)은 p로 받은 값대로 그림. */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape, arrow = ART.arrow;
  /* B안(그림책 삽화, 2026-11-28): 검은 굵은 테두리가 있는 면 → 재질 그러데이션 + 같은 계열 테두리(자리·크기·개수는 그대로, 칠하는 방법만 바꿈) */
  var F = ART.fx, BMAT = { wood: /^#(7A5434|9A6A3F|8B5A2B|B98552|C99A5B|8A5A30|7A4A22|5A4030|9A6A3F|E8C08B|D9A86C)$/i, metal: /^#(8A929C|6E7580|5E6B78|7A8896|C8CDD3|4A5160|3A3F48|5A6070|5D6675|8A97A6)$/i, glass: /^#(BFE3F5|CFE7F3|E8F4FA|EAF4F8|EEF6FA)$/i, paper: /^#(FFFDF4|FFF8E2|F4F1E8|FFF6E8|FFF2A8|F6F3EC|E6E0D2|FFFFFF|FFF|F2E6C2|FFF3C4|E4F5E8|E3F2DC|FCE6C4|C9B08A)$/i, stone: /^#(7A6A58|6B5A48)$/i };
  function bkind(tag, f, attrs) {
    for (var k in BMAT) if (BMAT[k].test(f) && !(k === 'paper' && tag !== 'rect' && tag !== 'path' && tag !== 'polygon')) return k;
    if (/^#(2A2A2A|2A221C|1F2433|120C1C|2A1D18|1F2A1C|2A2140)$/i.test(f)) return 'paint';
    if (tag === 'circle') return 'ball';
    if (tag === 'ellipse') { var rx = +(/rx="([\d.]+)"/.exec(attrs) || [0, 1])[1], ry = +(/ry="([\d.]+)"/.exec(attrs) || [0, 1])[1]; return ry < rx * .55 ? 'cylv' : 'ball' }
    return 'paint';
  }
  function bq(s) {
    return s.replace(/<(rect|circle|ellipse|path|polygon)\b([^>]*?)fill="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"\s*stroke="(?:#3A2C22|#1F2433|#22301F)" stroke-width="([\d.]+)"(?: stroke-linejoin="round")?/g, function (m, tag, pre, f, wd) {
      var ew = { '3': 1.8, '2.5': 1.6, '2': 1.4, '1.5': 1.2, '1.2': 1 }[wd] || Math.max(1, wd * .6);
      return '<' + tag + pre + 'fill="' + F.mat(bkind(tag, f, pre), f) + '"' + F.edge(f, ew);
    });
  }
  function bdrop(w, h, rx) { return F.drop('<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + (rx || 6) + '" fill="#000"/>', 5, 7, .26) }
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o, anc) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#22301F') + '" text-anchor="' + (anc || 'middle') + '" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  var K = ' stroke="#22301F" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#22301F" stroke-width="2" stroke-linejoin="round"';
  function leaf(x, y, s, a, f) { return '<path d="M0 0Q' + s * .5 + ' -' + s * .35 + ' ' + s + ' 0Q' + s * .5 + ' ' + s * .35 + ' 0 0Z" fill="' + (f || '#3DA35D') + '"' + K2.replace('2"', '1.5"') + ' transform="translate(' + x + ' ' + y + ') rotate(' + a + ')"/>' }

  /* 온도계: 0~40 눈금(2마다 작은 눈금, 10마다 숫자), 빨간 기둥이 p.t, 위 화면에도 p.t */
  ART.A.ghThermo = function (w, h, p) {
    var o = bdrop(w, h, 12) + R(0, 0, w, h, '#FFFDF4', K + ' rx="12"'), top = h * .2, bot = h * .82, x = w * .36, u = (bot - top) / 40, t = p.t || 0;
    o += R(w * .12, 8, w * .76, h * .12, F.mat('screen', '#16281B'), ' rx="4"') + T(w / 2, 8 + h * .095, t + ' °C', Math.min(h * .075, w * .24), '#7CF29B') + F.glassHL(w * .12, 8, w * .76, h * .12, .1);
    o += R(x - 6, top - 6, 12, bot - top + 10, '#EEF6FA', K2 + ' rx="6"') + R(x - 3.5, bot - t * u, 7, t * u + 6, F.mat('cyl', '#E5534B')) + C(x, bot + 12, 12, '#E5534B', K2);
    for (var v = 0; v <= 40; v += 2) { var y = bot - v * u; o += L(x + 8, y, x + 8 + (v % 10 ? w * .12 : w * .2), y, '#22301F', v % 10 ? 1 : 1.8); if (v % 10 === 0) o += T(x + 12 + w * .2, y + 4, v, Math.min(12, w * .14), '#22301F', '', 'start') }
    return bq(o);
  };

  /* 막대그래프: p.data=[[이름, 값]], p.max, p.step(눈금 한 칸), p.lab(숫자를 쓰는 간격), p.title, p.unit */
  ART.A.ghChart = function (w, h, p) {
    var d = p.data || [], mx = p.max || 20, st = p.step || 2, lab = p.lab || 4, o = bdrop(w, h, 6) + R(0, 0, w, h, '#FFFDF4', K + ' rx="6"');
    var x0 = 40, y0 = h - 30, top = 44, u = (y0 - top) / mx, bw = (w - x0 - 16) / Math.max(1, d.length);
    o += T(w * .42, 26, p.title || '', 17, '#22301F');
    for (var v = 0; v <= mx; v += st) { var y = y0 - v * u; o += L(x0, y, w - 12, y, v ? '#D5DCCF' : '#22301F', v ? 1 : 2); if (v % lab === 0) o += T(x0 - 6, y + 4, v, 12, '#22301F', '', 'end') }
    o += L(x0, top - 6, x0, y0, '#22301F', 2) + T(x0 - 6, top - 12, '(' + (p.unit || '') + ')', 11, '#5A6B55', '', 'end');
    d.forEach(function (b, i) { var x = x0 + i * bw + bw * .22; o += R(x, y0 - b[1] * u, bw * .56, b[1] * u, '#4FA3D9', K2.replace('2"', '1.5"')) + T(x + bw * .28, y0 + 18, b[0], 14, '#22301F') });
    return bq(o);
  };

  /* 화분 받침대: p.pots=[{c, a, b}] — 화분 앞 꼬리표에 두 줄 글(알맞은 온도) */
  ART.A.ghPots = function (w, h, p) {
    var it = p.pots || [], n = Math.max(1, it.length), gw = w / n, o = F.ground(w / 2, h, w * .52, 9), fs = Math.min(gw * .17, h * .09);
    it.forEach(function (q, i) {
      var cx = gw * (i + .5), pw = gw * .56;
      o += leaf(cx, h * .3, h * .2, -120) + leaf(cx, h * .3, h * .2, -60) + leaf(cx, h * .32, h * .16, -160) + leaf(cx, h * .32, h * .16, -20) + L(cx, h * .1, cx, h * .32, '#2E7D5B', 3);
      o += P('M' + (cx - pw / 2) + ' ' + h * .32 + 'H' + (cx + pw / 2) + 'L' + (cx + pw * .38) + ' ' + h * .58 + 'H' + (cx - pw * .38) + 'Z', c(q.c), K2) + R(cx - pw * .55, h * .3, pw * 1.1, h * .05, c(q.c), K2 + ' rx="3"');
    });
    o += R(0, h * .58, w, h * .06, '#9A6A3F', K2 + ' rx="3"') + R(4, h * .64, w - 8, h * .36, '#B98552', K2 + ' rx="4"') + F.grain(4, h * .64, w - 8, h * .36, '#B98552', 4);
    it.forEach(function (q, i) { var x = gw * i + gw * .06; o += R(x, h * .67, gw * .88, h * .29, '#FFFDF4', K2.replace('2"', '1.2"') + ' rx="4"') + R(x, h * .67, gw * .88, 5, c(q.c), ' rx="2"') + T(x + gw * .44, h * .67 + h * .13, q.a, fs, '#22301F') + T(x + gw * .44, h * .67 + h * .245, q.b, fs, '#22301F') });
    return bq(o);
  };

  /* 자동 물 주기 장치: 위 관 + 분무 꼭지 + 색 단추 상자(p.colors). 열리면 물방울 */
  ART.A.ghWater = function (w, h, p, open) {
    var o = R(w * .14, 0, w * .1, h * .5, F.mat('cyl', '#8A929C'), F.edge('#8A929C', 1.4)) + R(0, 0, w, h * .07, F.mat('cylv', '#8A929C'), F.edge('#8A929C', 1.4)) + P('M' + w * .06 + ' ' + h * .5 + 'H' + w * .32 + 'L' + w * .27 + ' ' + h * .58 + 'H' + w * .11 + 'Z', '#6E7580', K2);
    if (open) for (var i = 0; i < 9; i++) { var dx = (i % 3 - 1) * w * .1, dy = Math.floor(i / 3) * h * .1; o += P('M' + (w * .19 + dx) + ' ' + (h * .62 + dy) + 'q-5 9 0 12q5 -3 0 -12Z', '#4FA3D9') }
    var bx = w * .4, by = h * .18, bw = w * .56, bh = h * .66, cols = p.colors || [], per = Math.ceil(cols.length / 2);
    o += F.drop('<rect x="' + bx + '" y="' + by + '" width="' + bw + '" height="' + bh + '" rx="8" fill="#000"/>', 5, 7, .26) + R(bx, by, bw, bh, '#4A5160', K + ' rx="8"') + R(bx + bw * .12, by + bh * .07, bw * .76, bh * .16, F.mat('screen', open ? '#1A3344' : '#16281B'), ' rx="3"') + F.glassHL(bx + bw * .12, by + bh * .07, bw * .76, bh * .16, .1) + T(bx + bw / 2, by + bh * .19, open ? '물 주는 중' : '물 주기', bh * .08, open ? '#7CF29B' : '#E5534B');
    cols.forEach(function (k, i) { var q = i % per, r = Math.floor(i / per); o += C(bx + bw * (q + .5) / per, by + bh * (.42 + r * .26), Math.min(bw / per * .3, bh * .1), c(k), K2) });
    o += L(bx + bw / 2, by + bh, bx + bw / 2, h, '#4A5160', 4);
    return bq(o);
  };

  /* 화단 울타리 규칙: p.ns=[1, 2, 3] — 화단(정사각형)을 한 줄로 붙이고 울타리 막대로 둘러쌈 */
  ART.A.ghBeds = function (w, h, p) {
    var ns = p.ns || [1, 2, 3], tot = ns.reduce(function (a, b) { return a + b }, 0) + (ns.length - 1) * .9, o = bdrop(w, h, 6) + R(0, 0, w, h, '#FFFDF4', K + ' rx="6"') + T(w / 2, 26, p.title || '화단 울타리', 17, '#22301F');
    var u = Math.min((w - 30) / tot, (h - 80) * .9), x = (w - tot * u) / 2, y = 44 + (h - 80 - u) / 2, g = u * .1;
    function stick(x1, y1, x2, y2) { return L(x1, y1, x2, y2, '#7A4A22', Math.max(5, u * .13), ' stroke-linecap="round"') }
    ns.forEach(function (n) {
      for (var k = 0; k < n; k++) { var sx = x + k * u; o += R(sx + g * 1.5, y + g * 1.5, u - g * 3, u - g * 3, '#CDE8C0') + C(sx + u / 2, y + u / 2, u * .12, '#EE7DB0') + C(sx + u / 2, y + u / 2, u * .05, '#F2C230') + stick(sx + g, y, sx + u - g, y) + stick(sx + g, y + u, sx + u - g, y + u) }
      for (var j = 0; j <= n; j++) o += stick(x + j * u, y + g, x + j * u, y + u - g);
      o += T(x + n * u / 2, y + u + 22, '화단 ' + n + '개', Math.min(15, u * .3), '#22301F');
      x += (n + .9) * u;
    });
    return bq(o);
  };

  /* 덩굴 길 표지판: 첫 화살표 p.first, 돌리는 각 p.turns */
  ART.A.ghVine = function (w, h, p) {
    var o = R(w * .46, h * .9, w * .08, h * .1, F.mat('cyl', '#7A5434')) + bdrop(w, h * .9, 8) + R(0, 0, w, h * .9, '#2E7D5B', K + ' rx="8"') + R(8, 8, w - 16, h * .9 - 16, '#FFFDF4', ' rx="5"');
    var fs = Math.min(h * .085, w * .07);
    o += T(w / 2, 8 + fs * 1.4, '덩굴 문 단추 차례', fs, '#2E7D5B');
    o += T(w * .34, 8 + fs * 3.1, '첫 화살표:', fs * .95, '#22301F') + R(w * .58, 8 + fs * 1.9, fs * 1.7, fs * 1.7, '#E3F2DC', K2 + ' rx="4"') + arrow(p.first || '↑', w * .58 + fs * .85, 8 + fs * 2.75, fs * .7, '#2E7D5B');
    o += T(w / 2, 8 + fs * 4.9, '그다음부터는 바로 앞 화살표를', fs * .82, '#22301F') + T(w / 2, 8 + fs * 6.1, '시계 방향으로 돌려요', fs * .82, '#22301F');
    var tr = p.turns || [], cw = (w - 30) / Math.max(1, tr.length);
    tr.forEach(function (a, i) { var x = 15 + i * cw; o += R(x + 3, 8 + fs * 7, cw - 6, fs * 2.2, '#FCE6C4', K2 + ' rx="5"') + T(x + cw / 2, 8 + fs * 7.95, '①②③④⑤⑥'[i], fs * .8, '#9A6A3F') + T(x + cw / 2, 8 + fs * 8.9, a + '°', fs * .95, '#22301F') });
    for (var i = 0; i < 6; i++) o += leaf(4 + i * w / 6, h * .9 - 4, 16, -30 - i * 25);
    return bq(o);
  };

  /* 덩굴 아치 문: 열리면 문살이 열리고 길이 보임 */
  ART.A.ghGate = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .56, 9) + P('M0 ' + h + 'V' + h * .35 + 'Q' + w / 2 + ' -' + h * .1 + ' ' + w + ' ' + h * .35 + 'V' + h + 'H' + (w - 16) + 'V' + h * .37 + 'Q' + w / 2 + ' ' + h * .04 + ' 16 ' + h * .37 + 'V' + h + 'Z', '#7A5434', K);
    o += P('M16 ' + h + 'V' + h * .37 + 'Q' + w / 2 + ' ' + h * .04 + ' ' + (w - 16) + ' ' + h * .37 + 'V' + h + 'Z', open ? '#1F2A1C' : '#CDE8C0', K2);
    if (!open) { for (var i = 1; i < 6; i++) o += L(16 + i * (w - 32) / 6, h * .25, 16 + i * (w - 32) / 6, h, '#4A5160', 4); o += L(16, h * .62, w - 16, h * .62, '#4A5160', 4) + R(w / 2 - 14, h * .55, 28, 24, '#F2C230', K2 + ' rx="4"') }
    else o += P('M' + w * .4 + ' ' + h + 'L' + w * .47 + ' ' + h * .5 + 'H' + w * .53 + 'L' + w * .6 + ' ' + h + 'Z', '#C9A27A', ' opacity=".6"');
    for (var j = 0; j < 9; j++) { var t = j / 8, ax = w / 2 + Math.cos(Math.PI * (1 - t)) * w * .46, ay = h * .38 - Math.sin(Math.PI * t) * h * .3; o += leaf(ax, ay, 18, j * 40) }
    o += leaf(6, h * .6, 18, -80) + leaf(w - 6, h * .7, 18, -100);
    return bq(o);
  };

  /* 전개도: p.cells=[[칸, 줄, 모양]], 접는 선은 점선 */
  ART.A.ghNet = function (w, h, p) {
    var cl = p.cells || [], mx = 0, my = 0; cl.forEach(function (q) { mx = Math.max(mx, q[0] + 1); my = Math.max(my, q[1] + 1) });
    var top = 40, cs = Math.min((w - 20) / mx, (h - top - 12) / my), ox = (w - cs * mx) / 2, oy = top + (h - top - 12 - cs * my) / 2, o = bdrop(w, h, 6) + R(0, 0, w, h, '#FFFDF4', K + ' rx="6"') + T(w / 2, 27, p.title || '전개도', 17, '#22301F');
    cl.forEach(function (q) { var x = ox + q[0] * cs, y = oy + q[1] * cs; o += R(x, y, cs, cs, '#E3F2DC', ' stroke="#22301F" stroke-width="2.5"') + shape(q[2], x + cs / 2, y + cs / 2, cs * .3, '#2E7D5B') });
    cl.forEach(function (a) { cl.forEach(function (b) { if (b[0] === a[0] + 1 && b[1] === a[1]) o += L(ox + b[0] * cs, oy + a[1] * cs + 3, ox + b[0] * cs, oy + (a[1] + 1) * cs - 3, '#FFFDF4', 3) + L(ox + b[0] * cs, oy + a[1] * cs, ox + b[0] * cs, oy + (a[1] + 1) * cs, '#22301F', 2, ' stroke-dasharray="5 4"'); if (b[1] === a[1] + 1 && b[0] === a[0]) o += L(ox + a[0] * cs + 3, oy + b[1] * cs, ox + (a[0] + 1) * cs - 3, oy + b[1] * cs, '#FFFDF4', 3) + L(ox + a[0] * cs, oy + b[1] * cs, ox + (a[0] + 1) * cs, oy + b[1] * cs, '#22301F', 2, ' stroke-dasharray="5 4"') }) });
    return bq(o);
  };

  /* 씨앗 유리병: 씨앗 점 + 꼬리표 p.lines */
  ART.A.ghJar = function (w, h, p) {
    var o = F.ground(w / 2, h - 1, w * .46, 7) + R(w * .3, 0, w * .4, h * .1, '#9A6A3F', K2 + ' rx="4"') + P('M' + w * .28 + ' ' + h * .1 + 'H' + w * .72 + 'Q' + w * .95 + ' ' + h * .2 + ' ' + w * .92 + ' ' + h * .5 + 'V' + h * .92 + 'Q' + w * .92 + ' ' + h + ' ' + w * .8 + ' ' + h + 'H' + w * .2 + 'Q' + w * .08 + ' ' + h + ' ' + w * .08 + ' ' + h * .92 + 'V' + h * .5 + 'Q' + w * .05 + ' ' + h * .2 + ' ' + w * .28 + ' ' + h * .1 + 'Z', '#EAF4F8', K);
    for (var i = 0; i < 60; i++) { var x = w * .16 + ((i * 37) % 68) / 68 * w * .68, y = h * .58 + ((i * 53) % 37) / 37 * h * .36; o += '<ellipse cx="' + x + '" cy="' + y + '" rx="3" ry="5" fill="#3A3A3A" transform="rotate(' + (i * 47 % 180) + ' ' + x + ' ' + y + ')"/>' }
    var L_ = p.lines || [], mx = Math.max.apply(null, L_.map(function (s) { return s.length }).concat([1])), fs = Math.min(h * .075, w * .66 / mx);
    o += R(w * .12, h * .2, w * .76, fs * 1.35 * L_.length + fs * .8, '#FFFDF4', K2 + ' rx="4"');
    L_.forEach(function (s, i) { o += T(w / 2, h * .2 + fs * .25 + fs * 1.35 * (i + 1), s, fs, '#22301F') });
    return bq(o);
  };

  /* 씨앗 상자(직육면체): p.a 앞 가로, p.b 옆 깊이, p.c 높이 — 글로 길이 표시. 열리면 뚜껑이 올라가고 안이 보임 */
  ART.A.ghSeedbox = function (w, h, p, open) {
    var x0 = 34, fw = w * .56, fh = h * .5, dx = w * .25, dy = h * .22, y0 = h * .4, f = '#D9A86C', o = F.ground(x0 + fw * .62, y0 + fh, fw * .72, 8);
    var topP = 'M' + x0 + ' ' + y0 + 'L' + (x0 + dx) + ' ' + (y0 - dy) + 'H' + (x0 + fw + dx) + 'L' + (x0 + fw) + ' ' + y0 + 'Z', side = 'M' + (x0 + fw) + ' ' + y0 + 'L' + (x0 + fw + dx) + ' ' + (y0 - dy) + 'V' + (y0 - dy + fh) + 'L' + (x0 + fw) + ' ' + (y0 + fh) + 'Z';
    if (open) o += P('M' + (x0 + dx) + ' ' + (y0 - dy) + 'H' + (x0 + fw + dx) + 'L' + (x0 + fw + dx + 6) + ' ' + (y0 - dy - h * .26) + 'H' + (x0 + dx + 6) + 'Z', '#E8C08B', K2);
    o += P(topP, open ? '#2A1D18' : '#E8C08B', K2) + P(side, '#B98552', K2) + R(x0, y0, fw, fh, f, K2);
    if (open) o += R(x0 + 8, y0 + 6, fw - 16, fh - 12, '#2A1D18', ' rx="3"');
    else { var cx = x0 + dx * .5 + fw / 2, cy = y0 - dy * .5, q = Math.min(fw, dy) * .32; o += R(cx - q, cy - q * .8, q * 2, q * 1.6, '#FFFDF4', K2 + ' rx="4"') + shape('○', cx - q * .45, cy, q * .32, '#2E7D5B') + shape('△', cx + q * .45, cy, q * .32, '#2E7D5B') + R(x0 + fw / 2 - 12, y0 + fh * .3, 24, 26, '#F2C230', K2 + ' rx="4"') + C(x0 + fw / 2, y0 + fh * .3 + 12, 4, '#22301F') }
    var fs = p.fs || 13;
    o += T(x0 + fw / 2, y0 + fh + fs + 3, p.a + ' cm', fs, '#22301F') + T(x0 - 4, y0 + fh / 2 + 4, p.c + ' cm', fs, '#22301F', '', 'end') + T(x0 + fw + dx / 2 + 6, y0 + fh - dy / 2 + fs + 2, p.b + ' cm', fs, '#22301F', '', 'start');
    return bq(o);
  };
})();
