/* 수학 방탈출 · 빵집 탈출 그림 (2026-11-28) — 이름 앞글자 bk. art.js의 ART.c·ART.shape·ART.esc를 씀.
   개수를 세는 그림(단팥빵·크루아상·밀가루 포대)은 p로 받은 수만큼 꼭 그 수대로, 겹치지 않는 칸에 하나씩 그림. */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape;
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o, anc) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="' + (anc || 'middle') + '" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  var K = ' stroke="#3A2C22" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#3A2C22" stroke-width="2" stroke-linejoin="round"';

  /* 단팥빵(동그란 갈색 빵, 가운데 검은 깨) */
  function bun(cx, cy, r) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + r + '" ry="' + r * .8 + '" fill="#C98A45"' + K2.replace('2"', '1.5"') + '/>' + '<ellipse cx="' + (cx - r * .25) + '" cy="' + (cy - r * .3) + '" rx="' + r * .35 + '" ry="' + r * .18 + '" fill="#E7B36F"/>' + C(cx, cy, r * .14, '#3A2C22') }
  /* 크루아상(초승달 모양) */
  function croi(cx, cy, r) {
    return P('M' + (cx - r) + ' ' + (cy + r * .35) + 'Q' + cx + ' ' + (cy - r * 1.5) + ' ' + (cx + r) + ' ' + (cy + r * .35) + 'Q' + cx + ' ' + (cy - r * .2) + ' ' + (cx - r) + ' ' + (cy + r * .35) + 'Z', '#E3A34E', K2.replace('2"', '1.5"'))
      + L(cx - r * .4, cy - r * .42, cx - r * .3, cy + r * .1, '#A8692A', 1.4) + L(cx + r * .4, cy - r * .42, cx + r * .3, cy + r * .1, '#A8692A', 1.4) + L(cx, cy - r * .55, cx, cy - r * .02, '#A8692A', 1.4);
  }
  /* 빵 진열대: 위 칸 단팥빵 p.a개, 아래 칸 크루아상 p.b개, 한 줄에 p.per개 */
  ART.A.bkDisplay = function (w, h, p) {
    var per = p.per || 12, ra = Math.ceil((p.a || 0) / per), rb = Math.ceil((p.b || 0) / per), head = h * .13, base = h * .08;
    var o = R(0, 0, w, h, '#A8713F', K + ' rx="8"') + R(w * .2, 6, w * .6, head - 10, '#FFF6E2', ' rx="6"') + T(w / 2, head * .72, '빵 진열대', head * .5, '#7A4A22');
    var top = head, gap = 10, avail = h - head - base - gap * 2, rh = avail / Math.max(1, ra + rb), cw = (w - 24) / per, r = Math.min(rh * .42, cw * .44);
    function sec(n, rows, y0, f) {
      var s = R(10, y0, w - 20, rows * rh + 4, '#E8F4FA', K2 + ' rx="4"');
      for (var i = 0; i < n; i++) { var q = i % per, k = Math.floor(i / per); s += f(12 + (q + .5) * cw, y0 + 4 + (k + .55) * rh, r) }
      return s + R(10, y0 + rows * rh + 2, w - 20, 5, '#7A4A22');
    }
    o += sec(p.a || 0, ra, top, bun) + sec(p.b || 0, rb, top + ra * rh + gap + 4, croi);
    o += R(0, h - base, w, base, '#7A4A22', ' rx="4"');
    return o;
  };

  /* 금전 등록기: 화면 p.screen, 열리면 돈 서랍이 나옴 */
  ART.A.bkRegister = function (w, h, p, open) {
    var o = R(w * .1, h * .12, w * .8, h * .22, '#3A3F48', K + ' rx="6"') + R(w * .16, h * .16, w * .68, h * .14, '#0E1A12', ' rx="3"') + T(w / 2, h * .27, open ? (p.done || 'OK') : (p.screen || '????'), h * .1, '#7CF29B');
    o += P('M' + w * .05 + ' ' + h * .72 + 'L' + w * .14 + ' ' + h * .36 + 'H' + w * .86 + 'L' + w * .95 + ' ' + h * .72 + 'Z', '#E05A4E', K);
    for (var r = 0; r < 3; r++) for (var q = 0; q < 4; q++) o += R(w * (.24 + q * .14) - r * w * .02, h * (.42 + r * .09), w * .1, h * .06, '#FFF6E2', K2.replace('2"', '1.2"') + ' rx="2"');
    o += R(0, h * .72, w, h * .28, '#B5443A', K + ' rx="4"');
    o += open ? R(w * .1, h * .8, w * .8, h * .2, '#FFF6E2', K2) + R(w * .14, h * .84, w * .14, h * .1, '#7BB86F') + R(w * .32, h * .84, w * .14, h * .1, '#7BB86F') + C(w * .62, h * .9, h * .04, '#C9A24B') + C(w * .74, h * .9, h * .04, '#C9A24B')
      : R(w * .3, h * .8, w * .4, h * .1, '#8E352D', ' rx="3"') + C(w / 2, h * .85, h * .025, '#F2C230');
    return o;
  };

  /* 수가 적힌 길 지도: p.grid[줄][칸](빈칸은 null), p.start=[칸, 줄], p.goal=[칸, 줄], p.sl·p.gl 이름 */
  ART.A.bkMap = function (w, h, p) {
    var g = p.grid || [[]], n = g.length, m = g[0].length, top = p.title ? 30 : 8, cs = Math.min((w - 16) / m, (h - top - 8) / n), ox = (w - cs * m) / 2, oy = top + (h - top - 8 - cs * n) / 2;
    var o = R(0, 0, w, h, '#F7EBC9', K + ' rx="6"');
    if (p.title) o += T(w / 2, 22, p.title, 17, '#7A4A22');
    for (var r = 0; r < n; r++) for (var q = 0; q < m; q++) {
      var x = ox + q * cs, y = oy + r * cs, isS = p.start[0] === q && p.start[1] === r, isG = p.goal[0] === q && p.goal[1] === r;
      o += R(x, y, cs, cs, isS ? '#D6E6FA' : isG ? '#D9F0DD' : '#FFF8E2', ' stroke="#B99A5E" stroke-width="1.5"');
      if (isS) o += T(x + cs / 2, y + cs * .62, p.sl || '출발', cs * .26, '#3B6FD6');
      else if (isG) o += T(x + cs / 2, y + cs * .62, p.gl || '도착', cs * .26, '#2E7D5B');
      else if (g[r][q] != null) o += T(x + cs / 2, y + cs * .64, g[r][q], cs * .36, '#3A2C22');
    }
    return o;
  };

  /* 오븐: 열리면 문이 내려가고 안이 밝음. p.t = 타이머 화면 글 */
  ART.A.bkOven = function (w, h, p, open) {
    var o = R(0, 0, w, h, '#8A929C', K + ' rx="10"') + R(8, 8, w - 16, h * .18, '#5E6670', ' rx="5"');
    o += R(w * .5, 14, w * .42, h * .12, '#0E1A12', ' rx="3"') + T(w * .71, 14 + h * .1, open ? '띵!' : (p.t || '--:--'), h * .08, '#F2C230');
    for (var i = 0; i < 2; i++) o += C(w * (.14 + i * .16), 8 + h * .09, h * .05, '#E8E3D8', K2) + L(w * (.14 + i * .16), 8 + h * .09, w * (.14 + i * .16), 8 + h * .05, '#3A2C22', 2);
    var dy = h * .3, dh = h * .58;
    if (open) {
      o += R(14, dy, w - 28, dh, '#2A1D18', ' rx="6"') + R(20, dy + 6, w - 40, dh - 12, '#F08A24', ' opacity=".35" rx="4"') + L(24, dy + dh * .55, w - 24, dy + dh * .55, '#C8CDD3', 3);
      o += P('M14 ' + (dy + dh) + 'L-' + w * .06 + ' ' + (h + 8) + 'H' + (w + w * .06) + 'L' + (w - 14) + ' ' + (dy + dh) + 'Z', '#6E7580', K);
    } else {
      o += R(14, dy, w - 28, dh, '#6E7580', K + ' rx="6"') + R(w * .2, dy + dh * .22, w * .6, dh * .5, '#2A1D18', K2 + ' rx="6"') + R(w * .24, dy + dh * .27, w * .2, dh * .1, '#fff', ' opacity=".18" rx="3"');
      o += R(w * .2, dy + 8, w * .6, 8, '#C8CDD3', K2.replace('2"', '1.5"') + ' rx="4"');
    }
    o += R(10, h - 10, 18, 10, '#3A3F48') + R(w - 28, h - 10, 18, 10, '#3A3F48');
    return o;
  };

  /* 반죽기: 톱니바퀴가 빠진 자리(점선) — 열리면 톱니가 끼워지고 반죽이 돔 */
  ART.A.bkMixer = function (w, h, p, open) {
    var o = R(w * .1, h * .86, w * .8, h * .14, '#E05A4E', K + ' rx="6"') + R(w * .62, h * .2, w * .22, h * .68, '#E05A4E', K + ' rx="8"');
    o += P('M' + w * .18 + ' ' + h * .1 + 'H' + w * .84 + 'Q' + w * .92 + ' ' + h * .1 + ' ' + w * .92 + ' ' + h * .22 + 'V' + h * .3 + 'H' + w * .18 + 'Q' + w * .1 + ' ' + h * .3 + ' ' + w * .1 + ' ' + h * .2 + 'Z', '#E05A4E', K);
    o += L(w * .35, h * .3, w * .35, h * .48, '#8A929C', 4);
    o += P('M' + w * .12 + ' ' + h * .5 + 'H' + w * .58 + 'L' + w * .52 + ' ' + h * .84 + 'H' + w * .18 + 'Z', '#D9DEE3', K);
    o += P('M' + w * .16 + ' ' + h * .55 + 'Q' + w * .35 + ' ' + h * (open ? .42 : .5) + ' ' + w * .54 + ' ' + h * .55 + 'Z', '#F6E7C8', K2);
    var gx = w * .73, gy = h * .42, gr = Math.min(w, h) * .1;
    if (open) { var d = ''; for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, rr = i % 2 ? gr * .7 : gr; d += (i ? 'L' : 'M') + (gx + rr * Math.cos(a)).toFixed(1) + ' ' + (gy + rr * Math.sin(a)).toFixed(1) } o += P(d + 'Z', '#8A929C', K2) + C(gx, gy, gr * .3, '#fff') + T(w * .35, h * .97, '돌아가요!', h * .07, '#fff') }
    else o += C(gx, gy, gr, '#fff', ' stroke="#3A2C22" stroke-width="2" stroke-dasharray="4 3"') + T(gx, gy + gr * .35, '?', gr, '#C8402F');
    return o;
  };

  /* 쿠키 틀 판: p.shapes 차례로 틀(테두리만) */
  ART.A.bkTray = function (w, h, p) {
    var s = p.shapes || [], n = s.length, o = R(0, 0, w, h, '#D9A86C', K + ' rx="10"') + R(8, 8, w - 16, h - 16, '#E8C08B', ' rx="7"'), gw = (w - 16) / Math.max(1, n), r = Math.min(gw * .36, h * .3);
    s.forEach(function (k, i) {
      var cx = 8 + gw * (i + .5), cy = h * .46;
      o += '<g fill="none">' + shape(k, cx, cy, r, 'none').replace('fill="none"', 'fill="#FFF6E2" stroke="#8A929C" stroke-width="' + Math.max(3, r * .16) + '" stroke-linejoin="round"') + '</g>';
      o += T(cx, h - 12, i + 1, Math.min(16, h * .13), '#7A4A22');
    });
    return o;
  };

  /* 사다리꼴 쟁반 도면: p.top·p.bot·p.ht(cm) — 점선이 높이 */
  ART.A.bkPlan = function (w, h, p) {
    var o = R(0, 0, w, h, '#FFFDF4', K + ' rx="4"') + C(w / 2, 8, 5, '#C8402F') + T(w / 2, 30, p.title || '케이크 쟁반', 18, '#7A4A22');
    var mx = Math.max(p.top, p.bot), sc = (w - 70) / mx, bw = p.bot * sc, tw = p.top * sc, hh = Math.min(h - 104, p.ht * sc), x0 = (w - bw) / 2, y1 = 64, y2 = y1 + hh, tx = x0 + (bw - tw) / 2;
    o += P('M' + tx + ' ' + y1 + 'H' + (tx + tw) + 'L' + (x0 + bw) + ' ' + y2 + 'H' + x0 + 'Z', '#F2D2A0', K);
    o += L(tx + tw * .5, y1, tx + tw * .5, y2, '#C8402F', 2.5, ' stroke-dasharray="6 4"') + R(tx + tw * .5, y2 - 10, 10, 10, 'none', ' stroke="#C8402F" stroke-width="2"');
    o += T(tx + tw / 2, y1 - 4 + (p.fs ? 0 : 0), p.top + ' cm', 15, '#3A2C22') + T(x0 + bw / 2, y2 + 20, p.bot + ' cm', 15, '#3A2C22') + T(tx + tw * .5 + 8, (y1 + y2) / 2 + 5, p.ht + ' cm', 14, '#C8402F', '', 'start');
    return o;
  };

  /* 밀가루 포대 p.n개(한 줄에 p.per개) + 아래 안내판 p.label */
  ART.A.bkSacks = function (w, h, p) {
    var n = p.n || 0, per = p.per || 8, rows = Math.ceil(n / per), lab = h * .2, cw = (w - 10) / per, rh = (h - lab - 6) / Math.max(1, rows), o = '';
    for (var i = 0; i < n; i++) {
      var q = i % per, k = rows - 1 - Math.floor(i / per), x = 5 + q * cw + cw * .08, y = 4 + k * rh, sw = cw * .84, sh = rh * .92;
      o += P('M' + (x + sw * .15) + ' ' + (y + sh * .12) + 'Q' + (x + sw / 2) + ' ' + (y - sh * .04) + ' ' + (x + sw * .85) + ' ' + (y + sh * .12) + 'L' + (x + sw) + ' ' + (y + sh * .85) + 'Q' + (x + sw / 2) + ' ' + (y + sh * 1.02) + ' ' + x + ' ' + (y + sh * .85) + 'Z', '#F4EEDC', K2);
      o += R(x + sw * .25, y + sh * .42, sw * .5, sh * .22, '#3B6FD6', ' rx="2" opacity=".75"');
    }
    o += R(w * .1, h - lab, w * .8, lab - 2, '#2E7D5B', K2 + ' rx="6"') + T(w / 2, h - lab * .3, p.label || '', Math.min(lab * .5, 22), '#fff');
    return o;
  };

  /* 높은 선반: 맨 위 칸에 상자(열리면 상자가 내려와 열림) */
  ART.A.bkHigh = function (w, h, p, open) {
    var o = R(0, 0, w, h, '#9A6A3F', K + ' rx="4"'), rh = (h - 14) / 4;
    for (var i = 0; i < 4; i++) { var y = 7 + i * rh; o += R(8, y, w - 16, rh - 8, '#5A3E26', ' opacity=".35"') + R(4, y + rh - 8, w - 8, 8, '#6B4A2E') }
    if (!open) o += R(w * .25, 7 + rh * .25, w * .5, rh * .65 - 8, '#D99A4E', K2 + ' rx="3"') + T(w / 2, 7 + rh * .72, '?', rh * .4, '#7A4A22');
    else o += R(w * .25, 7 + rh * .45, w * .5, rh * .45 - 8, '#2A1D18', ' opacity=".25" rx="3"');
    o += R(w * .15, 7 + rh * 2.3, w * .3, rh * .55, '#E8E3D8', K2 + ' rx="4"') + R(w * .55, 7 + rh * 2.3, w * .3, rh * .55, '#E8E3D8', K2 + ' rx="4"');
    o += R(w * .2, 7 + rh * 3.3, w * .6, rh * .55, '#C98A45', K2 + ' rx="6"');
    if (open) o += R(w * .3, h * .02 - 0, w * .4, 4, '#F2C230');
    return o;
  };
})();
