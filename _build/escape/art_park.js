/* 수학 방탈출 · 놀이공원 그림 (2026-11-27) — 이름 앞글자 pk. art.js의 ART.c·ART.shape·ART.thing·ART.esc를 씀. */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape;
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="middle" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  var K = ' stroke="#3A2C22" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#3A2C22" stroke-width="2" stroke-linejoin="round"';
  /* 줄무늬 차양: x, y, w, h, 색 두 가지, 칸 수 */
  function awning(x, y, w, h, a, b, n) {
    var o = '', sw = w / n;
    for (var i = 0; i < n; i++) o += P('M' + (x + i * sw) + ' ' + y + 'H' + (x + (i + 1) * sw) + 'V' + (y + h) + 'Q' + (x + (i + .5) * sw) + ' ' + (y + h * 1.45) + ' ' + (x + i * sw) + ' ' + (y + h) + 'Z', i % 2 ? b : a, K2);
    return o;
  }
  /* 글자 폭 어림(em): 한글 1, 그 밖 .6, 빈칸 .3 */
  function em(s) { var n = 0; String(s).split('').forEach(function (ch) { n += ch === ' ' ? .3 : /[가-힣]/.test(ch) ? 1 : .62 }); return n }
  /* 풍선 하나 */
  function balloon(x, y, r, f, sx, sy) { return '<path d="M' + x + ' ' + (y + r) + 'Q' + (x - 6) + ' ' + ((y + r + sy) / 2) + ' ' + sx + ' ' + sy + '" fill="none" stroke="#5A4A3A" stroke-width="1.5"/>' + '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r * .86 + '" ry="' + r + '" fill="' + f + '"' + K2 + '/>' + P('M' + (x - 4) + ' ' + (y + r) + 'h8l-4 6z', f, K2.replace('2"', '1.5"')) + '<ellipse cx="' + (x - r * .32) + '" cy="' + (y - r * .35) + '" rx="' + r * .16 + '" ry="' + r * .26 + '" fill="#fff" opacity=".55"/>' }

  /* 매표소: p.sign 간판, p.lines 창 위 안내, open이면 창 덧문이 올라감 */
  ART.A.pkBooth = function (w, h, p, open) {
    var o = R(w * .06, h * .3, w * .88, h * .7, c(p.c || '#F4D9A8'), K + ' rx="6"');
    o += awning(0, h * .14, w, h * .16, c(p.a || '빨강'), '#FFF6E8', 7);
    o += R(w * .2, 0, w * .6, h * .15, '#2E5E9E', K + ' rx="6"') + T(w / 2, h * .11, p.sign || '매표소', Math.min(h * .09, w * .09), '#fff');
    var wy = h * .42, wh = h * .3;
    o += R(w * .2, wy, w * .6, wh, open ? '#FFF3C4' : '#BFE3F5', K2 + ' rx="5"');
    if (open) o += R(w * .2, wy - 6, w * .6, 10, '#8A929C', K2 + ' rx="3"') + R(w * .38, wy + wh * .5, w * .24, wh * .32, '#fff', K2 + ' rx="3"') + R(w * .42, wy + wh * .6, w * .16, 4, '#E5534B');
    else { for (var i = 1; i < 6; i++) o += L(w * .2, wy + wh * i / 6, w * .8, wy + wh * i / 6, '#8A929C', 3); }
    o += R(w * .14, wy + wh, w * .72, h * .06, '#9A6A3F', K2);
    (p.lines || []).forEach(function (s, i, a) { o += T(w / 2, h * .86 + (i - (a.length - 1) / 2) * h * .07 + h * .02, s, Math.min(h * .055, w * .06)) });
    return o;
  };

  /* 풍선 수레: p.items = [{c, n}] */
  ART.A.pkBalloons = function (w, h, p) {
    var it = p.items || [], all = []; it.forEach(function (t) { for (var i = 0; i < t.n; i++) all.push(c(t.c)) });
    var o = '', n = all.length, cols = Math.ceil(n / 3), r = Math.min(w / (cols + 1) * .5, h * .085), hx = w * .5, hy = h * .66;
    all.forEach(function (f, i) {
      var row = Math.floor(i / cols), k = i % cols, cnt = Math.min(cols, n - row * cols);
      var x = w / 2 + (k - (cnt - 1) / 2) * r * 1.85 + (row % 2) * r * .3, y = r + 4 + row * r * 2.35;
      o += balloon(x, y, r, f, hx, hy);
    });
    o += R(w * .2, h * .66, w * .6, h * .2, '#F2C230', K + ' rx="6"') + R(w * .2, h * .66, w * .6, h * .06, '#E5534B', K2) + R(w * .44, h * .44, w * .12, h * .24, '#9A6A3F', K2);
    o += C(w * .3, h * .92, h * .065, '#3A3F48') + C(w * .7, h * .92, h * .065, '#3A3F48') + C(w * .3, h * .92, h * .025, '#C8CDD3') + C(w * .7, h * .92, h * .025, '#C8CDD3');
    return o;
  };

  /* 솜사탕 수레 */
  ART.A.pkCotton = function (w, h, p) {
    var o = awning(w * .05, 0, w * .9, h * .14, '#EE7DB0', '#FFF6E8', 6);
    o += R(w * .12, h * .2, w * .05, h * .4, '#8A929C') + R(w * .83, h * .2, w * .05, h * .4, '#8A929C');
    [[.3, .38, '#F7B5D2'], [.5, .32, '#BFD9F5'], [.7, .38, '#F7B5D2']].forEach(function (q) { o += R(w * q[0] - 2, h * q[1] + h * .1, 4, h * .14, '#E8D9B8') + '<ellipse cx="' + w * q[0] + '" cy="' + h * q[1] + '" rx="' + w * .09 + '" ry="' + h * .1 + '" fill="' + q[2] + '"' + K2 + '/>' });
    o += R(w * .06, h * .58, w * .88, h * .28, c(p.c || '#8FD3C1'), K + ' rx="8"') + T(w / 2, h * .76, p.label || '솜사탕', Math.min(h * .1, w * .11), '#2A4A42');
    o += C(w * .25, h * .92, h * .07, '#3A3F48') + C(w * .75, h * .92, h * .07, '#3A3F48');
    return o;
  };

  /* 회전목마: p.horses = [{c, n}] — 말을 왼쪽부터 한 줄로 */
  ART.A.pkCarousel = function (w, h, p) {
    var o = P('M' + w * .02 + ' ' + h * .24 + 'L' + w / 2 + ' 0L' + w * .98 + ' ' + h * .24 + 'Z', '#E5534B', K);
    o += awning(w * .02, h * .24, w * .96, h * .08, '#F2C230', '#FFF6E8', 10) + C(w / 2, 0, 7, '#F2C230', K2);
    o += R(w * .04, h * .86, w * .92, h * .1, '#C9A24B', K + ' rx="6"');
    var all = []; (p.horses || []).forEach(function (t) { for (var i = 0; i < t.n; i++) all.push(t.c) });
    var n = all.length, rows = n > 8 ? 2 : 1, per = Math.ceil(n / rows), sw = w * .88 / per, hs = Math.min(sw * .9, h * (rows > 1 ? .24 : .34));
    for (var q = 0; q < per; q++) o += L(w * .06 + sw * (q + .5), h * .32, w * .06 + sw * (q + .5), h * .86, '#C9A24B', 3);
    all.forEach(function (col, i) {
      var row = Math.floor(i / per), k = i % per, x = w * .06 + sw * (k + .5), base = rows > 1 ? (row ? h * .84 : h * .6) : h * .8;
      o += horse(x, base, hs, c(col));
    });
    return o;
  };
  function horse(x, by, s, f) {
    var b = 'M' + (x - s * .42) + ' ' + (by - s * .5) + 'Q' + x + ' ' + (by - s * .72) + ' ' + (x + s * .3) + ' ' + (by - s * .55) + 'L' + (x + s * .4) + ' ' + (by - s * .9) + 'L' + (x + s * .55) + ' ' + (by - s * .82) + 'L' + (x + s * .48) + ' ' + (by - s * .48) + 'Q' + (x + s * .3) + ' ' + (by - s * .25) + ' ' + (x - s * .1) + ' ' + (by - s * .28) + 'Q' + (x - s * .4) + ' ' + (by - s * .28) + ' ' + (x - s * .42) + ' ' + (by - s * .5) + 'Z';
    return L(x - s * .28, by - s * .3, x - s * .36, by - s * .02, '#3A2C22', 3) + L(x + s * .2, by - s * .3, x + s * .28, by - s * .02, '#3A2C22', 3) + P(b, f, K2) + C(x + s * .42, by - s * .78, s * .035, '#2A221C') + P('M' + (x - s * .42) + ' ' + (by - s * .5) + 'l-' + s * .14 + ' ' + s * .2, 'none', ' stroke="#3A2C22" stroke-width="3"');
  }

  /* 꼬마 기차: p.n 칸(기관차 빼고), p.c 칸 색 */
  ART.A.pkTrain = function (w, h, p, open) {
    var n = p.n || 4, cw = w / (n + 1.3), o = L(0, h * .93, w, h * .93, '#6E7580', 5);
    o += R(4, h * .38, cw * 1.2, h * .45, c(p.e || '빨강'), K + ' rx="6"') + R(cw * .55, h * .12, cw * .55, h * .3, c(p.e || '빨강'), K + ' rx="4"') + R(cw * .1, h * .2, cw * .22, h * .2, '#3A3F48', K2) + R(cw * .62, h * .18, cw * .4, h * .16, open ? '#FFF3C4' : '#BFE3F5', K2);
    o += C(cw * .1, h * .55, h * .07, open ? '#FFE27A' : '#E8E3D8', K2);
    for (var i = 0; i < n; i++) {
      var x = cw * 1.3 + i * cw, col = (p.cs || [])[i] || p.c || '파랑';
      o += R(x + 4, h * .45, cw - 8, h * .38, c(col), K + ' rx="5"') + R(x + cw * .2, h * .5, cw * .6, h * .12, '#fff', ' opacity=".55" rx="3"') + L(x, h * .7, x + 4, h * .7, '#3A2C22', 3);
      o += C(x + cw * .28, h * .86, h * .07, '#3A3F48') + C(x + cw * .72, h * .86, h * .07, '#3A3F48');
    }
    o += C(cw * .3, h * .86, h * .08, '#3A3F48') + C(cw * .9, h * .86, h * .08, '#3A3F48');
    return o;
  };

  /* 놀이 게임 가게: p.slots = 모양 또는 '?' */
  ART.A.pkGame = function (w, h, p, open) {
    var o = R(w * .04, h * .12, w * .92, h * .88, '#FFF6E8', K + ' rx="6"') + awning(0, 0, w, h * .16, c(p.a || '파랑'), '#FFF6E8', 8);
    o += T(w / 2, h * .3, p.sign || '모양 맞히기', Math.min(h * .1, w * .09), '#2E5E9E');
    var s = p.slots || [], n = Math.max(1, s.length), gw = w * .8 / n, bs = Math.min(gw * .84, h * .36);
    s.forEach(function (k, i) {
      var cx = w * .1 + gw * (i + .5), cy = h * .6;
      o += R(cx - bs / 2, cy - bs / 2, bs, bs, open ? '#E4F5E8' : '#fff', K2 + ' rx="6"');
      o += k === '?' ? T(cx, cy + bs * .2, '?', bs * .6, '#C8402F') : shape(k, cx, cy, bs * .36, c((p.sc || [])[i] || '#3A2C22'));
    });
    o += R(w * .04, h * .82, w * .92, h * .18, '#E5534B', K + ' rx="4"');
    return o;
  };

  /* 롤러코스터: 언덕 레일 + p.n 칸 열차, 칸마다 의자 p.seat 개 */
  ART.A.pkCoaster = function (w, h, p) {
    var o = '', d = 'M0 ' + h * .62 + 'C' + w * .18 + ' ' + h * .62 + ' ' + w * .2 + ' ' + h * .04 + ' ' + w * .34 + ' ' + h * .04 + 'S' + w * .5 + ' ' + h * .5 + ' ' + w * .62 + ' ' + h * .3 + 'S' + w * .8 + ' ' + h * .62 + ' ' + w + ' ' + h * .62;
    for (var x = w * .06; x < w; x += w * .07) o += L(x, h * .62, x, h * .64 + 2, '#B5654A', 3);
    [.24, .34, .44, .56, .66, .76].forEach(function (k) { o += L(w * k, h * .2 + Math.abs(k - .45) * h * .4, w * k, h * .64, '#C8743C', 4) });
    o += '<path d="' + d + '" fill="none" stroke="#7A4A2A" stroke-width="9"/><path d="' + d + '" fill="none" stroke="#E8A060" stroke-width="3"/>';
    var n = p.n || 4, seat = p.seat || 2, cw = w * .9 / n, y = h * .7;
    o += R(0, h * .66, w, h * .04, '#6E7580');
    for (var i = 0; i < n; i++) {
      var cx = w * .05 + i * cw, col = c((p.cs || [])[i] || p.c || '빨강');
      o += P('M' + (cx + 3) + ' ' + y + 'H' + (cx + cw - 3) + 'V' + (y + h * .18) + 'Q' + (cx + cw / 2) + ' ' + (y + h * .24) + ' ' + (cx + 3) + ' ' + (y + h * .18) + 'Z', col, K2);
      for (var j = 0; j < seat; j++) { var sw = (cw - 14) / seat; o += R(cx + 7 + j * sw + 1, y - h * .07, sw - 2, h * .08, '#3A3F48', K2.replace('2"', '1.5"') + ' rx="3"') }
      o += C(cx + cw * .28, y + h * .24, h * .035, '#3A3F48') + C(cx + cw * .72, y + h * .24, h * .035, '#3A3F48');
    }
    return o;
  };

  /* 줄에 걸린 깃발: p.items = [{c, label}] */
  ART.A.pkPennant = function (w, h, p) {
    var it = p.items || [], n = Math.max(1, it.length), gw = w / n, o = R(0, 0, w, h, c(p.bg || '#FFF6DC'), K + ' rx="6"');
    if (p.title) o += T(w / 2, h * .16, p.title, Math.min(h * .11, w * .06));
    var ty = p.title ? h * .26 : h * .1;
    o += '<path d="M6 ' + ty + 'Q' + w / 2 + ' ' + (ty + h * .08) + ' ' + (w - 6) + ' ' + ty + '" fill="none" stroke="#5A4A3A" stroke-width="2"/>';
    it.forEach(function (t, i) {
      var cx = gw * (i + .5), y0 = ty + h * .02;
      o += P('M' + (cx - gw * .32) + ' ' + y0 + 'H' + (cx + gw * .32) + 'L' + cx + ' ' + (y0 + h * .3) + 'Z', c(t.c), K2);
      o += R(cx - gw * .46, h * .66, gw * .92, h * .26, '#fff', K2 + ' rx="5"') + T(cx, h * .84, t.label, Math.min(h * .14, gw * .84 / Math.max(2.4, em(t.label))));
    });
    return o;
  };

  /* 범퍼카장: 울타리 안 p.cars 색 범퍼카들 */
  ART.A.pkArena = function (w, h, p) {
    var o = R(0, h * .18, w, h * .82, '#5D6675', K + ' rx="8"') + R(8, h * .18 + 8, w - 16, h * .82 - 16, '#7E8A99', ' rx="6"');
    for (var x = 12; x < w - 6; x += 22) o += L(x, h * .2, x + 10, h * .06, '#C8CDD3', 2);
    o += R(0, 0, w, h * .08, '#3A3F48', ' rx="3"') + R(0, h * .14, w, h * .06, '#F2C230', K2);
    var cs = p.cars || [], n = cs.length, per = Math.ceil(n / 2), gw = (w - 30) / per;
    cs.forEach(function (col, i) {
      var row = Math.floor(i / per), k = i % per, cx = 15 + gw * (k + .5) + (row ? gw * .25 : 0), cy = h * (row ? .78 : .46);
      if (cx > w - 20) cx = w - 20 - (cx - (w - 20));
      o += bumper(cx, cy, Math.min(gw * .8, h * .3), c(col), false);
    });
    return o;
  };
  function bumper(cx, cy, s, f, lit) {
    return L(cx + s * .18, cy - s * .2, cx + s * .18, cy - s * .95, '#3A3F48', 2.5) + C(cx + s * .18, cy - s * .95, s * .06, lit ? '#FFE27A' : '#C8CDD3') +
      '<ellipse cx="' + cx + '" cy="' + (cy + s * .12) + '" rx="' + s * .55 + '" ry="' + s * .22 + '" fill="#2A2A2A"/>' +
      P('M' + (cx - s * .48) + ' ' + (cy + s * .1) + 'Q' + (cx - s * .5) + ' ' + (cy - s * .3) + ' ' + (cx - s * .1) + ' ' + (cy - s * .3) + 'H' + (cx + s * .3) + 'Q' + (cx + s * .5) + ' ' + (cy - s * .3) + ' ' + (cx + s * .48) + ' ' + (cy + s * .1) + 'Z', f, K2) +
      R(cx - s * .28, cy - s * .2, s * .3, s * .14, '#3A3F48', ' rx="3"');
  }

  /* 큰 범퍼카 한 대(장치): p.c, open이면 불이 켜짐 */
  ART.A.pkBumper = function (w, h, p, open) {
    var s = Math.min(w * .95, h * .82), o = bumper(w / 2, h * .74, s, c(p.c || '빨강'), open);
    o += R(w / 2 - s * .2, h * .74 - s * .05, s * .4, s * .12, '#fff', K2.replace('2"', '1.5"') + ' rx="4"') + T(w / 2, h * .74 + s * .05, p.label || '1', s * .1);
    if (!open) o += R(w * .58, h * .3, w * .28, h * .2, '#3A3F48', K2 + ' rx="4"') + R(w * .62, h * .34, w * .2, h * .12, '#7A8290', ' rx="2"');
    else o += R(w * .58, h * .3, w * .28, h * .2, '#3A3F48', K2 + ' rx="4"') + R(w * .62, h * .34, w * .2, h * .12, '#7CF29B', ' rx="2"');
    return o;
  };

  /* 인형 뽑기 기계: 칸마다 모양 이름표와 p.den 칸 중 k칸이 찬 막대 */
  ART.A.pkClaw = function (w, h, p, open) {
    var o = R(0, 0, w, h, c(p.c || '#8A5BC9'), K + ' rx="10"') + R(w * .08, h * .06, w * .84, h * .1, '#FFF6E8', K2 + ' rx="5"') + T(w / 2, h * .135, p.sign || '인형 뽑기', h * .06, '#8A5BC9');
    o += R(w * .08, h * .2, w * .84, h * .52, open ? '#E8F4FA' : '#CFE7F3', K2 + ' rx="5"');
    o += L(w * .5, h * .2, w * .5, h * .3, '#6E7580', 3) + P('M' + w * .44 + ' ' + h * .3 + 'h' + w * .12 + 'l-' + w * .02 + ' ' + h * .05 + 'h-' + w * .08 + 'z', '#8A929C', K2.replace('2"', '1.5"'));
    var it = p.items || [], n = Math.max(1, it.length), den = p.den || 8, gw = w * .76 / n, top = h * .38, bh = h * .3;
    it.forEach(function (t, i) {
      var x = w * .12 + gw * i + gw * .15, bw = gw * .7, ch = bh / den;
      for (var j = 0; j < den; j++) o += R(x, top + bh - (j + 1) * ch, bw, ch, j < t.k ? c(t.c || '분홍') : '#fff', ' stroke="#5A4A3A" stroke-width="1.2"');
      o += R(x - gw * .05, h * .76, bw + gw * .1, h * .1, '#fff', K2 + ' rx="4"') + shape(t.s, x + bw / 2, h * .81, Math.min(gw * .2, h * .035), '#3A2C22');
    });
    if (!open && p.lock) o += R(w / 2 - 12, h * .89, 24, h * .08, '#F2C230', K2 + ' rx="4"');
    return o;
  };

  /* 관람차: p.cars = 곤돌라 색 목록(위에서 시계 방향), p.label 받침 글 */
  ART.A.pkWheel = function (w, h, p) {
    var cs = p.cars || [], n = Math.max(1, cs.length), r = Math.min(w * .42, (h * .86 - 30) / 2), cx = w / 2, cy = r + h * .04, o = '';
    o += P('M' + (cx - r * .6) + ' ' + h * .92 + 'L' + cx + ' ' + cy + 'L' + (cx + r * .6) + ' ' + h * .92, 'none', ' stroke="#6E7580" stroke-width="7"');
    o += C(cx, cy, r, 'none', ' stroke="#E5534B" stroke-width="5"') + C(cx, cy, r * .55, 'none', ' stroke="#F2C230" stroke-width="3"');
    for (var i = 0; i < n; i++) { var a = i * 2 * Math.PI / n; o += L(cx, cy, cx + Math.sin(a) * r, cy - Math.cos(a) * r, '#8A929C', 2) }
    for (var k = 0; k < n; k++) {
      var b = k * 2 * Math.PI / n, gx = cx + Math.sin(b) * r, gy = cy - Math.cos(b) * r, gs = Math.min(r * .26, 2 * Math.PI * r / n * .36);
      o += L(gx, gy, gx, gy + gs * .5, '#3A2C22', 2) + R(gx - gs * .55, gy + gs * .45, gs * 1.1, gs * .9, c(cs[k]), K2 + ' rx="' + gs * .2 + '"') + R(gx - gs * .38, gy + gs * .58, gs * .76, gs * .3, '#fff', ' opacity=".7" rx="2"');
    }
    o += C(cx, cy, r * .1, '#F2C230', K2);
    o += R(w * .08, h * .92, w * .84, h * .08, p.label ? '#2E5E9E' : '#7A5434', K2 + ' rx="4"');
    if (p.label) o += T(cx, h * .985, p.label, Math.min(h * .065, w * .07), '#fff');
    return o;
  };

  /* 퍼레이드 차: 깃발 꽂는 자리 p.slots(모양 또는 '?'), open이면 불빛 */
  ART.A.pkFloat = function (w, h, p, open) {
    var o = R(w * .04, h * .45, w * .92, h * .35, c(p.c || '#3B6FD6'), K + ' rx="14"') + P('M' + w * .12 + ' ' + h * .45 + 'Q' + w / 2 + ' ' + h * .1 + ' ' + w * .88 + ' ' + h * .45 + 'Z', c(p.c2 || '#EE7DB0'), K);
    var s = p.slots || [], n = Math.max(1, s.length), gw = w * .7 / n;
    s.forEach(function (k, i) {
      var cx = w * .15 + gw * (i + .5);
      o += L(cx, h * .5, cx, h * .2 - (i % 2) * h * .04, '#5A4030', 3);
      o += k === '?' ? R(cx, h * .2 - (i % 2) * h * .04, gw * .4, gw * .3, '#fff', K2) + T(cx + gw * .2, h * .2 - (i % 2) * h * .04 + gw * .25, '?', gw * .26, '#C8402F') : P('M' + cx + ' ' + (h * .2 - (i % 2) * h * .04) + 'h' + gw * .4 + 'l-' + gw * .1 + ' ' + gw * .15 + 'l' + gw * .1 + ' ' + gw * .15 + 'h-' + gw * .4 + 'z', c((p.fc || [])[i] || '노랑'), K2);
    });
    o += R(w * .2, h * .55, w * .6, h * .14, '#fff', K2 + ' rx="6"') + T(w / 2, h * .655, p.label || '퍼레이드', h * .09, '#3B6FD6');
    for (var j = 0; j < 7; j++) o += C(w * .1 + j * w * .133, h * .76, h * .025, open ? '#FFE27A' : '#C8CDD3');
    o += C(w * .2, h * .88, h * .08, '#3A3F48') + C(w * .8, h * .88, h * .08, '#3A3F48');
    return o;
  };

  /* 유령의 집 입구: 뾰족 지붕 집, 동전 넣는 곳, open이면 문이 열림 */
  ART.A.pkHaunt = function (w, h, p, open) {
    var o = P('M0 ' + h * .32 + 'L' + w / 2 + ' 0L' + w + ' ' + h * .32 + 'Z', '#4A3B5C', K) + R(w * .06, h * .3, w * .88, h * .7, '#6B5A7E', K);
    o += R(w * .12, h * .38, w * .2, h * .16, '#2A2140', K2) + R(w * .68, h * .38, w * .2, h * .16, '#2A2140', K2);
    o += C(w * .22, h * .46, h * .025, '#FFE27A') + C(w * .78, h * .46, h * .025, '#FFE27A');
    o += R(w * .26, h * .02 + h * .14, w * .48, h * .1, '#FFF6E8', K2 + ' rx="4"') + T(w / 2, h * .23, p.sign || '유령의 집', h * .065, '#4A3B5C');
    o += P('M' + w * .34 + ' ' + h + 'V' + h * .68 + 'Q' + w / 2 + ' ' + h * .52 + ' ' + w * .66 + ' ' + h * .68 + 'V' + h + 'Z', open ? '#120C1C' : '#3A2C22', K);
    if (open) o += P('M' + w * .34 + ' ' + h + 'V' + h * .68 + 'L' + w * .44 + ' ' + h * .66 + 'V' + h + 'Z', '#5A4030', K2);
    o += P('M' + w * .8 + ' ' + h * .62 + 'q' + w * .06 + ' -' + h * .1 + ' ' + w * .12 + ' 0v' + h * .14 + 'l-' + w * .03 + ' -' + h * .03 + 'l-' + w * .03 + ' ' + h * .03 + 'l-' + w * .03 + ' -' + h * .03 + 'l-' + w * .03 + ' ' + h * .03 + 'z', '#F4F1E8', K2) + C(w * .84, h * .63, h * .012, '#2A221C') + C(w * .88, h * .63, h * .012, '#2A221C');
    o += R(w * .08, h * .66, w * .16, h * .2, '#3A3F48', K2 + ' rx="4"') + R(w * .13, h * .7, w * .06, h * .02, '#F2C230');
    return o;
  };

  /* 놀이공원 정문(나가는 곳): 아치 간판 p.sign, 쇠창살 문, open이면 문이 양쪽으로 열림 */
  ART.A.pkGate = function (w, h, p, open) {
    var f = c(p.c || '빨강'), o = R(0, h * .12, w * .12, h * .88, f, K + ' rx="4"') + R(w * .88, h * .12, w * .12, h * .88, f, K + ' rx="4"');
    o += P('M0 ' + h * .2 + 'Q' + w / 2 + ' -' + h * .1 + ' ' + w + ' ' + h * .2 + 'V' + h * .3 + 'Q' + w / 2 + ' ' + h * .06 + ' 0 ' + h * .3 + 'Z', '#F2C230', K) + T(w / 2, h * .155, p.sign || '정문', Math.min(h * .085, w * .14));
    o += C(w * .06, h * .1, w * .05, '#F2C230', K2) + C(w * .94, h * .1, w * .05, '#F2C230', K2);
    if (open) {
      o += R(w * .12, h * .3, w * .76, h * .7, '#FFE9A8', ' opacity=".45"');
      for (var i = 0; i < 3; i++) { o += L(w * (.13 + i * .035), h * .32, w * (.13 + i * .035), h, '#5A6070', 4); o += L(w * (.87 - i * .035), h * .32, w * (.87 - i * .035), h, '#5A6070', 4) }
    } else {
      o += R(w * .12, h * .32, w * .76, h * .06, '#5A6070') + R(w * .12, h * .62, w * .76, h * .05, '#5A6070');
      for (var j = 0; j < 9; j++) o += L(w * (.15 + j * .0875), h * .32, w * (.15 + j * .0875), h, '#5A6070', 4);
      o += R(w * .44, h * .52, w * .12, h * .12, '#F2C230', K2 + ' rx="4"') + C(w / 2, h * .57, h * .015, '#3A2C22');
    }
    return o;
  };
})();
