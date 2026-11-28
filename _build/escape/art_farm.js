/* 수학 방탈출 · 농장 그림 (2026-11-28) — 그림 이름 앞글자 fm. 모두 직접 그린 SVG(이모지 없음).
   ART.A.이름(w, h, p, open) → 0,0~w,h 안에 그리는 SVG 조각. 개수를 세는 그림은 p의 수만큼 정확히 그림. */
(function () {
  var c = ART.c, esc = ART.esc;
  function n1(v) { return (+v).toFixed(1) }
  function R(x, y, w, h, f, o) { return '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(w) + '" height="' + n1(h) + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o) { return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + n1(size) + '" fill="' + (f || '#2A221C') + '" text-anchor="middle" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  var INK = '#3A2C22', STK = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"', S2 = ' stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"';
  function egg(cx, cy, r) { return '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy) + '" rx="' + n1(r * .8) + '" ry="' + n1(r) + '" fill="#FFF4DF"' + S2 + '/>' }

  /* 달걀 판: p.trays = 꽉 찬 판 수(한 판 = 2칸 × 5줄 = 10개), p.loose = 판 밖 그릇의 달걀 수 */
  ART.A.fmEggs = function (w, h, p) {
    var nt = p.trays || 0, nl = p.loose || 0, bowlW = w * .22, tw = (w - bowlW - 10) / Math.max(1, nt), o = '';
    for (var t = 0; t < nt; t++) {
      var x = t * tw + 4, y = h * .18, ww = tw - 8, hh = h * .7;
      o += R(x, y, ww, hh, '#C9B08A', STK + ' rx="6"');
      for (var r = 0; r < 5; r++) for (var q = 0; q < 2; q++) {
        var cx = x + ww * (q + .5) / 2, cy = y + hh * (r + .5) / 5, er = Math.min(ww / 2 * .34, hh / 5 * .42);
        o += '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(er * 1.15) + '" fill="#A88C64"/>' + egg(cx, cy - er * .1, er);
      }
    }
    var bx = w - bowlW, bw = bowlW - 2, by = h * .5, cols = 2, lr = Math.min(bw / 5, h * .13);
    for (var i = 0; i < nl; i++) { var row = Math.floor(i / cols), col = i % cols; o += egg(bx + bw / 2 + (col - .5) * lr * 2.1, by - lr * .6 - row * lr * 1.75, lr) }
    o += '<path d="M' + n1(bx) + ' ' + n1(by) + 'H' + n1(bx + bw) + 'Q' + n1(bx + bw * .9) + ' ' + n1(h * .95) + ' ' + n1(bx + bw / 2) + ' ' + n1(h * .95) + 'Q' + n1(bx + bw * .1) + ' ' + n1(h * .95) + ' ' + n1(bx) + ' ' + n1(by) + 'Z" fill="#3B6FD6"' + STK + '/>';
    return o;
  };

  function hen(x, y, s, f, comb) {
    return '<path d="M' + n1(x + s * .1) + ' ' + n1(y + s * .5) + 'L' + n1(x) + ' ' + n1(y + s * .2) + 'L' + n1(x + s * .25) + ' ' + n1(y + s * .35) + 'Z" fill="' + f + '"' + S2 + '/>' +
      '<ellipse cx="' + n1(x + s * .45) + '" cy="' + n1(y + s * .58) + '" rx="' + n1(s * .36) + '" ry="' + n1(s * .3) + '" fill="' + f + '"' + S2 + '/>' +
      '<circle cx="' + n1(x + s * .76) + '" cy="' + n1(y + s * .3) + '" r="' + n1(s * .17) + '" fill="' + f + '"' + S2 + '/>' +
      '<path d="M' + n1(x + s * .66) + ' ' + n1(y + s * .16) + 'q' + n1(s * .05) + ' -' + n1(s * .12) + ' ' + n1(s * .1) + ' 0q' + n1(s * .05) + ' -' + n1(s * .12) + ' ' + n1(s * .1) + ' 0z" fill="' + (comb || '#E5534B') + '"/>' +
      '<path d="M' + n1(x + s * .92) + ' ' + n1(y + s * .28) + 'l' + n1(s * .12) + ' ' + n1(s * .05) + 'l-' + n1(s * .12) + ' ' + n1(s * .05) + 'z" fill="#F2A030"/>' +
      '<circle cx="' + n1(x + s * .8) + '" cy="' + n1(y + s * .27) + '" r="' + n1(Math.max(1.5, s * .03)) + '" fill="' + INK + '"/>' +
      '<line x1="' + n1(x + s * .4) + '" y1="' + n1(y + s * .86) + '" x2="' + n1(x + s * .4) + '" y2="' + n1(y + s) + '" stroke="#F2A030" stroke-width="2.5"/><line x1="' + n1(x + s * .52) + '" y1="' + n1(y + s * .86) + '" x2="' + n1(x + s * .52) + '" y2="' + n1(y + s) + '" stroke="#F2A030" stroke-width="2.5"/>';
  }
  /* 닭 횃대: 위 횃대 흰 닭 p.white, 아래 횃대 갈색 닭 p.brown, 바닥 병아리 p.chick(왼쪽부터 — 오른쪽 아래 구석은 비워 둠) */
  ART.A.fmRoost = function (w, h, p) {
    var o = R(0, 0, w, h, '#F3DDB3', STK + ' rx="8"'), rows = [[p.white || 0, '#FFFFFF', h * .3], [p.brown || 0, '#B8743C', h * .62]];
    o += R(6, 6, 12, h - 12, '#8B5A2B') + R(w - 18, 6, 12, h - 12, '#8B5A2B');
    rows.forEach(function (r) {
      var n = r[0], gap = (w - 40) / Math.max(5, n), s = Math.min(gap * .98, h * .27), y = r[2];
      o += R(14, y, w - 28, 9, '#8B5A2B', S2 + ' rx="4"');
      for (var i = 0; i < n; i++) o += hen(22 + gap * i + (gap - s) / 2, y - s * .98, s, r[1]);
    });
    var nc = p.chick || 0, cg = (w - 40) / Math.max(8, nc), cs = Math.min(cg * .8, h * .18);
    for (var j = 0; j < nc; j++) o += hen(24 + cg * j + (cg - cs) / 2, h - cs - 10, cs, '#F7D046', '#F7D046');
    return o;
  };

  /* 젖소 머리 줄: p.cows = [{n, c}] — 목줄 색 c, 목줄에 매단 번호표 n */
  ART.A.fmCows = function (w, h, p) {
    var cows = p.cows || [], k = Math.max(1, cows.length), cw = w / k, o = R(0, h * .7, w, h * .3, '#8B5A2B', STK + ' rx="4"');
    for (var b = 1; b < k; b++) o += R(b * cw - 3, 0, 6, h, '#8B5A2B');
    cows.forEach(function (cw_, i) {
      var cx = cw * (i + .5), s = Math.min(cw * .8, h * .62), top = h * .04;
      o += '<path d="M' + n1(cx - s * .3) + ' ' + n1(top + s * .12) + 'q-' + n1(s * .12) + ' -' + n1(s * .14) + ' -' + n1(s * .06) + ' -' + n1(s * .14) + 'M' + n1(cx + s * .3) + ' ' + n1(top + s * .12) + 'q' + n1(s * .12) + ' -' + n1(s * .14) + ' ' + n1(s * .06) + ' -' + n1(s * .14) + '" fill="none" stroke="#E8DCC4" stroke-width="5" stroke-linecap="round"/>';
      o += '<ellipse cx="' + n1(cx - s * .42) + '" cy="' + n1(top + s * .3) + '" rx="' + n1(s * .16) + '" ry="' + n1(s * .08) + '" fill="#FFFFFF"' + S2 + '/><ellipse cx="' + n1(cx + s * .42) + '" cy="' + n1(top + s * .3) + '" rx="' + n1(s * .16) + '" ry="' + n1(s * .08) + '" fill="#FFFFFF"' + S2 + '/>';
      o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(top + s * .42) + '" rx="' + n1(s * .3) + '" ry="' + n1(s * .36) + '" fill="#FFFFFF"' + S2 + '/>';
      o += '<path d="M' + n1(cx - s * .28) + ' ' + n1(top + s * .3) + 'q' + n1(s * .12) + ' -' + n1(s * .1) + ' ' + n1(s * .18) + ' ' + n1(s * .08) + 'q-' + n1(s * .04) + ' ' + n1(s * .14) + ' -' + n1(s * .16) + ' ' + n1(s * .06) + 'z" fill="#2A2A2A"/>';
      o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(top + s * .66) + '" rx="' + n1(s * .22) + '" ry="' + n1(s * .13) + '" fill="#F2B5B8"' + S2 + '/><circle cx="' + n1(cx - s * .08) + '" cy="' + n1(top + s * .66) + '" r="' + n1(s * .03) + '" fill="' + INK + '"/><circle cx="' + n1(cx + s * .08) + '" cy="' + n1(top + s * .66) + '" r="' + n1(s * .03) + '" fill="' + INK + '"/>';
      o += '<circle cx="' + n1(cx - s * .11) + '" cy="' + n1(top + s * .38) + '" r="' + n1(s * .035) + '" fill="' + INK + '"/><circle cx="' + n1(cx + s * .11) + '" cy="' + n1(top + s * .38) + '" r="' + n1(s * .035) + '" fill="' + INK + '"/>';
      var cy = top + s * .84;
      o += R(cx - s * .3, cy, s * .6, s * .1, c(cw_.c), S2 + ' rx="4"');
      var tw = Math.min(cw * .62, s * .6), th = h * .2, ty = cy + s * .1 + 4;
      o += '<line x1="' + n1(cx) + '" y1="' + n1(cy + s * .1) + '" x2="' + n1(cx) + '" y2="' + n1(ty) + '" stroke="' + INK + '" stroke-width="2"/>';
      o += R(cx - tw / 2, ty, tw, th, '#FFF8E2', S2 + ' rx="5"') + T(cx, ty + th * .76, cw_.n, th * .72);
    });
    return o;
  };

  /* 사과 바구니: 위 줄들 빨간 사과 p.red, 아래 줄들 초록 사과 p.green (한 줄에 5개까지) */
  ART.A.fmApples = function (w, h, p) {
    var o = '', list = [];
    for (var i = 0; i < (p.red || 0); i++) list.push('#E5534B');
    var nr = list.length;
    for (var j = 0; j < (p.green || 0); j++) list.push('#7DBB42');
    var per = 5, rowsR = Math.ceil(nr / per), rowsG = Math.ceil((list.length - nr) / per), rows = rowsR + rowsG, ar = Math.min((w * .8) / per / 2.2, (h * .82) / rows / 2.2);
    o += R(0, h * .1, w, h * .9, '#C99A5B', STK + ' rx="14"') + R(8, h * .14, w - 16, h * .82, '#F6E7C8', ' rx="8"');
    var row = 0;
    [[0, nr], [nr, list.length]].forEach(function (seg) {
      for (var k = seg[0]; k < seg[1]; k++) {
        var idx = k - seg[0], rr = row + Math.floor(idx / per), cc = idx % per, cx = w * .1 + ar * 1.1 + cc * ar * 2.2, cy = h * .16 + ar * 1.15 + rr * ar * 2.2;
        o += '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(ar) + '" fill="' + list[k] + '"' + S2 + '/><path d="M' + n1(cx) + ' ' + n1(cy - ar * .8) + 'v-' + n1(ar * .45) + '" stroke="#6B4A2E" stroke-width="2.5"/><ellipse cx="' + n1(cx + ar * .3) + '" cy="' + n1(cy - ar * 1.05) + '" rx="' + n1(ar * .3) + '" ry="' + n1(ar * .14) + '" fill="#3DA35D"/>';
      }
      row += Math.ceil((seg[1] - seg[0]) / per);
    });
    return o;
  };

  /* 트랙터: 닫힘 = 서 있음, 열림 = 짐칸에 건초 더미를 싣고 불이 켜짐 */
  ART.A.fmTractor = function (w, h, p, open) {
    var f = c(p.c || '빨강'), o = '';
    o += R(w * .08, h * .38, w * .62, h * .28, f, STK + ' rx="8"') + R(w * .4, h * .06, w * .3, h * .36, f, STK + ' rx="6"') + R(w * .45, h * .12, w * .2, h * .18, '#BFE3F5', S2 + ' rx="3"');
    o += R(w * .14, h * .18, w * .06, h * .22, '#3A3F48', ' rx="3"');
    o += R(w * .7, h * .44, w * .28, h * .2, '#B98552', STK + ' rx="4"');
    if (open) for (var i = 0; i < 2; i++) o += R(w * (.72 + i * .13), h * .28, w * .11, h * .16, '#E8C766', S2 + ' rx="3"');
    o += '<circle cx="' + n1(w * .58) + '" cy="' + n1(h * .7) + '" r="' + n1(h * .28) + '" fill="#2A2A2A"' + STK + '/><circle cx="' + n1(w * .58) + '" cy="' + n1(h * .7) + '" r="' + n1(h * .13) + '" fill="#F2C230"/>';
    o += '<circle cx="' + n1(w * .18) + '" cy="' + n1(h * .8) + '" r="' + n1(h * .18) + '" fill="#2A2A2A"' + STK + '/><circle cx="' + n1(w * .18) + '" cy="' + n1(h * .8) + '" r="' + n1(h * .08) + '" fill="#F2C230"/>';
    o += '<circle cx="' + n1(w * .09) + '" cy="' + n1(h * .46) + '" r="' + n1(h * .05) + '" fill="' + (open ? '#FFE27A' : '#C8CDD3') + '"' + S2 + '/>';
    return o;
  };

  /* 건초 더미(꾸밈) */
  ART.A.fmHay = function (w, h) {
    var o = '';
    [[0, h * .45, w * .5], [w * .5, h * .45, w * .5], [w * .25, 0, w * .5]].forEach(function (b) {
      o += R(b[0] + 2, b[1] + 2, b[2] - 4, h * .53, '#E8C766', STK + ' rx="8"');
      for (var i = 1; i < 4; i++) o += '<line x1="' + n1(b[0] + 8) + '" y1="' + n1(b[1] + i * h * .13) + '" x2="' + n1(b[0] + b[2] - 8) + '" y2="' + n1(b[1] + i * h * .13) + '" stroke="#B9953A" stroke-width="2"/>';
      o += R(b[0] + b[2] * .3, b[1] + 2, 5, h * .53, '#9A6A3F');
    });
    return o;
  };
})();
