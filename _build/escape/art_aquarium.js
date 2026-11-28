/* 수학 방탈출 · 아쿠아리움 그림 (2026-11-28) — 그림 이름 앞글자 aq. 모두 직접 그린 SVG(이모지 없음).
   ART.A.이름(w, h, p, open) → 0,0~w,h 안에 그리는 SVG 조각. 개수를 세는 그림은 p의 수만큼 정확히 그림. */
(function () {
  var c = ART.c, esc = ART.esc;
  function n1(v) { return (+v).toFixed(1) }
  function R(x, y, w, h, f, o) { return '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(w) + '" height="' + n1(h) + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o) { return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + n1(size) + '" fill="' + (f || '#2A221C') + '" text-anchor="middle" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  var INK = '#3A2C22', STK = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"', S2 = ' stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"';
  function weed(x, y, hh, f) { return '<path d="M' + n1(x) + ' ' + n1(y) + 'q-10 -' + n1(hh * .25) + ' 0 -' + n1(hh * .5) + 't0 -' + n1(hh * .5) + '" fill="none" stroke="' + (f || '#3DA35D') + '" stroke-width="6" stroke-linecap="round"/>' }
  function fish(cx, cy, s, f, left) {
    var d = left ? -1 : 1;
    return '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy) + '" rx="' + n1(s * .4) + '" ry="' + n1(s * .24) + '" fill="' + f + '"' + S2 + '/>' +
      '<path d="M' + n1(cx - d * s * .36) + ' ' + n1(cy) + 'l' + n1(-d * s * .26) + ' -' + n1(s * .2) + 'v' + n1(s * .4) + 'z" fill="' + f + '"' + S2 + '/>' +
      '<circle cx="' + n1(cx + d * s * .2) + '" cy="' + n1(cy - s * .05) + '" r="' + n1(Math.max(1.6, s * .05)) + '" fill="' + INK + '"/>' +
      '<line x1="' + n1(cx) + '" y1="' + n1(cy - s * .2) + '" x2="' + n1(cx) + '" y2="' + n1(cy + s * .2) + '" stroke="#E07B39" stroke-width="' + n1(Math.max(2, s * .07)) + '"/>';
  }
  function turtle(cx, cy, s) {
    return '<ellipse cx="' + n1(cx + s * .48) + '" cy="' + n1(cy) + '" rx="' + n1(s * .14) + '" ry="' + n1(s * .1) + '" fill="#7DBB42"' + S2 + '/>' +
      '<ellipse cx="' + n1(cx - s * .2) + '" cy="' + n1(cy + s * .2) + '" rx="' + n1(s * .14) + '" ry="' + n1(s * .07) + '" fill="#7DBB42"' + S2 + '/><ellipse cx="' + n1(cx + s * .22) + '" cy="' + n1(cy + s * .2) + '" rx="' + n1(s * .14) + '" ry="' + n1(s * .07) + '" fill="#7DBB42"' + S2 + '/>' +
      '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy) + '" rx="' + n1(s * .38) + '" ry="' + n1(s * .24) + '" fill="#5E8C3A"' + S2 + '/><path d="M' + n1(cx - s * .2) + ' ' + n1(cy) + 'h' + n1(s * .4) + 'M' + n1(cx) + ' ' + n1(cy - s * .2) + 'v' + n1(s * .4) + '" stroke="#3F6A28" stroke-width="2"/>';
  }

  /* 큰 수조: 노란 물고기가 p.per마리씩 묶음 p.groups개(묶음마다 둥근 물방울 테두리), 바닥에 거북 p.turtle마리(세지 않음) */
  ART.A.aqTank = function (w, h, p) {
    var o = R(0, 0, w, h, '#8A929C', STK + ' rx="26"') + R(10, 10, w - 20, h - 20, '#2F8FC4', ' rx="20"') + R(10, 10, w - 20, (h - 20) * .45, '#5BB3DE', ' rx="20" opacity=".55"');
    o += R(10, h * .82, w - 20, h * .18 - 10, '#E8D3A0', ' rx="8"');
    for (var k = 0; k < 7; k++) o += weed(30 + k * (w - 60) / 6, h * .86, h * (.25 + (k % 3) * .06), k % 2 ? '#2E8B57' : '#3DA35D');
    var G = p.groups || 0, per = p.per || 4, cols = Math.ceil(G / 2), cw = (w - 40) / Math.max(1, cols), rh = h * .32;
    for (var g = 0; g < G; g++) {
      var row = g < cols ? 0 : 1, col = row ? g - cols : g, nInRow = row ? G - cols : cols, x0 = 20 + (w - 40 - nInRow * cw) / 2 + col * cw, cx = x0 + cw / 2, cy = 24 + rh * (row + .5) + row * 10, rr = Math.min(cw * .44, rh * .48);
      o += '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(rr) + '" fill="#FFFFFF" fill-opacity=".12" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="5 4"/>';
      var fs = rr * .78;
      for (var f = 0; f < per; f++) { var fx = cx + (f % 2 ? .45 : -.45) * rr, fy = cy + (f < 2 ? -.4 : .4) * rr; o += fish(fx, fy, fs, '#F2C230', f % 2 === 1) }
    }
    for (var t = 0; t < (p.turtle || 0); t++) o += turtle(w * (.2 + t * .3), h * .78, h * .2);
    for (var b = 0; b < 8; b++) o += '<circle cx="' + n1(w * .9 - (b % 3) * 8) + '" cy="' + n1(h * .75 - b * h * .08) + '" r="' + (2 + b % 3) + '" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>';
    return o;
  };

  /* 해마와 자: 세로 자 0~p.max cm(아래가 0), 해마 꼬리 끝이 p.from, 머리 꼭대기가 p.to 눈금 */
  ART.A.aqRuler = function (w, h, p) {
    var M = p.max || 20, y0 = h - 22, y1 = 18, u = (y0 - y1) / M, Y = function (v) { return y0 - v * u }, rx = w * .6, rw = w * .3, o = '';
    o += R(0, 0, w, h, '#D9F1F7', STK + ' rx="10"');
    o += R(rx, y1 - 8, rw, y0 - y1 + 16, '#FFF4C8', S2 + ' rx="3"');
    for (var i = 0; i <= M; i++) {
      var yy = Y(i);
      o += '<line x1="' + n1(rx) + '" y1="' + n1(yy) + '" x2="' + n1(rx + rw * (i % 5 ? .3 : .5)) + '" y2="' + n1(yy) + '" stroke="' + INK + '" stroke-width="1.6"/>';
      o += T(rx + rw * .76, yy + 4, i, Math.min(11, u * .8));
    }
    o += T(rx + rw / 2, h - 5, 'cm', 11);
    var yb = Y(p.from || 0), yt = Y(p.to || 10), L = yb - yt, cx = w * .36, f = '#F08A24';
    var hy = yt + L * .1, hr = L * .1;
    o += '<path d="M' + n1(cx) + ' ' + n1(yt + L * .16) + 'C' + n1(cx + L * .2) + ' ' + n1(yt + L * .25) + ' ' + n1(cx + L * .22) + ' ' + n1(yt + L * .55) + ' ' + n1(cx + L * .06) + ' ' + n1(yt + L * .7) + 'C' + n1(cx - L * .02) + ' ' + n1(yt + L * .78) + ' ' + n1(cx - L * .02) + ' ' + n1(yb - L * .04) + ' ' + n1(cx + L * .06) + ' ' + n1(yb) + 'C' + n1(cx + L * .14) + ' ' + n1(yb + 1) + ' ' + n1(cx + L * .14) + ' ' + n1(yb - L * .1) + ' ' + n1(cx + L * .07) + ' ' + n1(yb - L * .08) + 'C' + n1(cx + L * .06) + ' ' + n1(yb - L * .12) + ' ' + n1(cx - L * .1) + ' ' + n1(yt + L * .72) + ' ' + n1(cx - L * .06) + ' ' + n1(yt + L * .5) + 'C' + n1(cx - L * .03) + ' ' + n1(yt + L * .35) + ' ' + n1(cx - L * .1) + ' ' + n1(yt + L * .25) + ' ' + n1(cx) + ' ' + n1(yt + L * .16) + 'Z" fill="' + f + '"' + S2 + '/>';
    o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(hy) + '" rx="' + n1(hr * .9) + '" ry="' + n1(hr) + '" fill="' + f + '"' + S2 + '/>';
    o += R(cx - hr * .8 - L * .08, hy - hr * .18, L * .1, hr * .36, f, S2 + ' rx="3"');
    o += '<circle cx="' + n1(cx - hr * .2) + '" cy="' + n1(hy - hr * .15) + '" r="' + n1(Math.max(2, hr * .15)) + '" fill="' + INK + '"/>';
    o += '<path d="M' + n1(cx + hr * .5) + ' ' + n1(hy + hr * .2) + 'l' + n1(L * .1) + ' ' + n1(L * .04) + 'l-' + n1(L * .07) + ' ' + n1(L * .06) + 'z" fill="#F2C230"' + S2.replace('2"', '1.2"') + '/>';
    [yt, yb].forEach(function (yy) { o += '<line x1="' + n1(cx - L * .12) + '" y1="' + n1(yy) + '" x2="' + n1(rx) + '" y2="' + n1(yy) + '" stroke="#C8402F" stroke-width="2" stroke-dasharray="5 4"/>' });
    return o;
  };

  /* 먹이 자판기: 닫힘 = 동전 구멍과 먹이 통, 열림 = 먹이가 관을 따라 떨어지고 초록 불 */
  ART.A.aqFeeder = function (w, h, p, open) {
    var o = R(w * .1, h * .3, w * .8, h * .7, '#E07B39', STK + ' rx="10"');
    o += '<path d="M' + n1(w * .15) + ' ' + n1(h * .3) + 'L' + n1(w * .05) + ' 4H' + n1(w * .95) + 'L' + n1(w * .85) + ' ' + n1(h * .3) + 'Z" fill="#CFE7F3"' + STK + '/>';
    for (var i = 0; i < 14; i++) o += '<circle cx="' + n1(w * (.16 + (i * 37 % 68) / 100)) + '" cy="' + n1(h * (.08 + (i * 13 % 18) / 100)) + '" r="4" fill="#9A6A3F"/>';
    o += R(w * .25, h * .42, w * .5, h * .16, '#3A3F48', ' rx="5"') + T(w / 2, h * .54, open ? '냠냠!' : '동전', h * .08, open ? '#7CF29B' : '#F2C230');
    o += R(w * .44, h * .64, w * .12, h * .04, '#2A2A2A', ' rx="2"');
    o += R(w * .3, h * .78, w * .4, h * .14, '#3A3F48', ' rx="6"');
    if (open) for (var j = 0; j < 5; j++) o += '<circle cx="' + n1(w * (.38 + (j % 3) * .12)) + '" cy="' + n1(h * (.82 + (j % 2) * .05)) + '" r="4" fill="#C98E52"/>';
    o += '<circle cx="' + n1(w * .8) + '" cy="' + n1(h * .38) + '" r="7" fill="' + (open ? '#7CF29B' : '#E5534B') + '"' + S2 + '/>';
    return o;
  };

  /* 해파리 수조: p.items = [{c, n}] — 색이 섞이게 늘어놓음(같은 설정이면 언제나 같은 자리) */
  ART.A.aqJelly = function (w, h, p) {
    var list = [];
    (p.items || []).forEach(function (it) { for (var i = 0; i < (it.n || 0); i++) list.push(it.c) });
    var N = list.length;
    // (q*7)%N 차례로 꺼내 색을 섞음(겹치면 비어 있는 가장 앞 자리) — 같은 설정이면 언제나 같은 자리
    var used = {}, mix = [];
    for (var q = 0; q < N; q++) { var idx = (q * 7) % N; if (used[idx]) { idx = 0; while (used[idx]) idx++ } used[idx] = 1; mix.push(list[idx]) }
    var o = R(0, 0, w, h, '#5A6B85', STK + ' rx="16"') + R(10, 10, w - 20, h - 20, '#14284A', ' rx="10"');
    var cols = Math.ceil(Math.sqrt(N * (w / h))), rows = Math.ceil(N / cols), cw = (w - 30) / cols, ch = (h - 30) / rows, s = Math.min(cw, ch) * .8;
    mix.forEach(function (col, i) {
      var cx = 15 + cw * (i % cols + .5) + ((Math.floor(i / cols) % 2) ? cw * .12 : -cw * .12), cy = 15 + ch * (Math.floor(i / cols) + .38), f = c(col);
      o += '<path d="M' + n1(cx - s * .38) + ' ' + n1(cy + s * .05) + 'Q' + n1(cx - s * .38) + ' ' + n1(cy - s * .42) + ' ' + n1(cx) + ' ' + n1(cy - s * .42) + 'Q' + n1(cx + s * .38) + ' ' + n1(cy - s * .42) + ' ' + n1(cx + s * .38) + ' ' + n1(cy + s * .05) + 'Z" fill="' + f + '" stroke="#EAF2FF" stroke-width="2"/>';
      for (var t = 0; t < 4; t++) { var tx = cx - s * .27 + t * s * .18; o += '<path d="M' + n1(tx) + ' ' + n1(cy + s * .05) + 'q' + n1(s * .06) + ' ' + n1(s * .12) + ' 0 ' + n1(s * .22) + 't0 ' + n1(s * .22) + '" fill="none" stroke="' + f + '" stroke-width="2.5" stroke-linecap="round"/>' }
    });
    return o;
  };

  /* 문어 수조: 문어 p.n마리(다리 8개씩 또렷하게). 오른쪽 아래 구석은 비워 둠 */
  ART.A.aqOcto = function (w, h, p) {
    var n = p.n || 3, o = R(0, 0, w, h, '#5A6B85', STK + ' rx="14"') + R(8, 8, w - 16, h - 16, '#1E4A73', ' rx="10"'), aw = (w * .78) / n;
    o += R(8, h * .86, w - 16, h * .14 - 8, '#C9B48A', ' rx="6"');
    for (var i = 0; i < n; i++) {
      var cx = 8 + aw * (i + .5), hy = h * (.26 + (i % 2) * .08), hr = Math.min(aw * .26, h * .15), f = ['#E5534B', '#EE7DB0', '#F08A24'][i % 3];
      for (var l = 0; l < 8; l++) {
        var ex = cx + (l - 3.5) * aw * .125, ey = hy + hr + h * .34 + (l % 2) * h * .06;
        o += '<path d="M' + n1(cx + (l - 3.5) * hr * .24) + ' ' + n1(hy + hr * .6) + 'Q' + n1((cx + ex) / 2 + 0) + ' ' + n1((hy + ey) / 2) + ' ' + n1(ex) + ' ' + n1(ey) + '" fill="none" stroke="' + INK + '" stroke-width="6" stroke-linecap="round"/>';
        o += '<path d="M' + n1(cx + (l - 3.5) * hr * .24) + ' ' + n1(hy + hr * .6) + 'Q' + n1((cx + ex) / 2 + 0) + ' ' + n1((hy + ey) / 2) + ' ' + n1(ex) + ' ' + n1(ey) + '" fill="none" stroke="' + f + '" stroke-width="3.4" stroke-linecap="round"/>';
      }
      o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(hy) + '" rx="' + n1(hr) + '" ry="' + n1(hr * 1.15) + '" fill="' + f + '"' + S2 + '/>';
      o += '<circle cx="' + n1(cx - hr * .35) + '" cy="' + n1(hy + hr * .2) + '" r="' + n1(hr * .16) + '" fill="#fff"/><circle cx="' + n1(cx + hr * .35) + '" cy="' + n1(hy + hr * .2) + '" r="' + n1(hr * .16) + '" fill="#fff"/>';
      o += '<circle cx="' + n1(cx - hr * .35) + '" cy="' + n1(hy + hr * .22) + '" r="' + n1(hr * .08) + '" fill="' + INK + '"/><circle cx="' + n1(cx + hr * .35) + '" cy="' + n1(hy + hr * .22) + '" r="' + n1(hr * .08) + '" fill="' + INK + '"/>';
    }
    return o;
  };

  /* 수 모형 판: 백 모형 p.h개 · 십 모형 p.t개 · 일 모형 p.o개, 아래에 이름 */
  ART.A.aqBlocks = function (w, h, p) {
    var nh = p.h || 0, nt = p.t || 0, no = p.o || 0, o = R(0, 0, w, h, '#FFFDF4', STK + ' rx="8"');
    var top = 12, lab = 22, s = Math.min(h - top - lab - 8, (w - 40) / (nh * 1.08 + nt * .15 + .35)), u = s / 10, x = 14, k, q;
    var BLK = '#7FC4E8', S1 = ' stroke="#2E5E9E" stroke-width="1"';
    var hx0 = x;
    for (k = 0; k < nh; k++) { o += R(x, top, s, s, BLK, ' stroke="#2E5E9E" stroke-width="2"'); for (q = 1; q < 10; q++) o += '<line x1="' + n1(x + q * u) + '" y1="' + top + '" x2="' + n1(x + q * u) + '" y2="' + n1(top + s) + '" stroke="#2E5E9E" stroke-width=".8"/><line x1="' + n1(x) + '" y1="' + n1(top + q * u) + '" x2="' + n1(x + s) + '" y2="' + n1(top + q * u) + '" stroke="#2E5E9E" stroke-width=".8"/>'; x += s * 1.08 }
    var hx1 = x, tx0 = x + 4;
    x = tx0;
    for (k = 0; k < nt; k++) { o += R(x, top, u, s, '#9AD08A', ' stroke="#3F7A26" stroke-width="1.6"'); for (q = 1; q < 10; q++) o += '<line x1="' + n1(x) + '" y1="' + n1(top + q * u) + '" x2="' + n1(x + u) + '" y2="' + n1(top + q * u) + '" stroke="#3F7A26" stroke-width=".8"/>'; x += u * 1.5 }
    var tx1 = x, ox0 = x + 6;
    for (k = 0; k < no; k++) o += R(ox0 + (k % 2) * u * 1.5, top + s - u - Math.floor(k / 2) * u * 1.5, u, u, '#F7A8C8', ' stroke="#B23A6E" stroke-width="1.4"');
    var ly = top + s + lab - 4, fs = Math.min(14, lab * .7);
    o += T((hx0 + hx1) / 2, ly, '백 모형', fs) + T((tx0 + tx1) / 2, ly, '십 모형', fs) + T(Math.min(ox0 + u * 1.25, w - fs * 2.2), ly, '일 모형', fs);
    return o;
  };
})();
