/* 수학 방탈출 · 빵집 탈출 그림 (2026-11-28) — 이름 앞글자 bk. art.js의 ART.c·ART.shape·ART.esc를 씀.
   개수를 세는 그림(단팥빵·크루아상·밀가루 포대)은 p로 받은 수만큼 꼭 그 수대로, 겹치지 않는 칸에 하나씩 그림. */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape, F = ART.fx, E2 = function (k, w) { return F.edge(k, w || 1.8) };
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o, anc) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="' + (anc || 'middle') + '" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  var K = ' stroke="#3A2C22" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#3A2C22" stroke-width="2" stroke-linejoin="round"';

  /* 단팥빵(동그란 갈색 빵, 가운데 검은 깨) */
  function bun(cx, cy, r) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + r + '" ry="' + r * .8 + '" fill="' + F.rad([[0, '#E9B170'], [.65, '#C98A45'], [1, '#93582A']], .45, .35, .65) + '"' + E2('#C98A45', 1.3) + '/>' + '<ellipse cx="' + (cx - r * .25) + '" cy="' + (cy - r * .3) + '" rx="' + r * .35 + '" ry="' + r * .18 + '" fill="#F6D29A" opacity=".75"/>' + C(cx, cy, r * .14, '#3A2C22') }
  /* 크루아상(초승달 모양) */
  function croi(cx, cy, r) {
    return P('M' + (cx - r) + ' ' + (cy + r * .35) + 'Q' + cx + ' ' + (cy - r * 1.5) + ' ' + (cx + r) + ' ' + (cy + r * .35) + 'Q' + cx + ' ' + (cy - r * .2) + ' ' + (cx - r) + ' ' + (cy + r * .35) + 'Z', F.lin([[0, '#F4C77A'], [.6, '#E3A34E'], [1, '#B8732C']], 0, 0, .3, 1), E2('#E3A34E', 1.3))
      + L(cx - r * .4, cy - r * .42, cx - r * .3, cy + r * .1, '#A8692A', 1.4) + L(cx + r * .4, cy - r * .42, cx + r * .3, cy + r * .1, '#A8692A', 1.4) + L(cx, cy - r * .55, cx, cy - r * .02, '#A8692A', 1.4);
  }
  /* 빵 진열대: 위 칸 단팥빵 p.a개, 아래 칸 크루아상 p.b개, 한 줄에 p.per개 */
  ART.A.bkDisplay = function (w, h, p) {
    var per = p.per || 12, ra = Math.ceil((p.a || 0) / per), rb = Math.ceil((p.b || 0) / per), head = h * .13, base = h * .08;
    var o = F.ground(w / 2, h, w * .52, 8) + R(0, 0, w, h, F.mat('wood', '#A8713F'), E2('#A8713F') + ' rx="8"') + F.grain(2, 2, 8, h - 4, '#A8713F', 1, true) + F.grain(w - 10, 2, 8, h - 4, '#A8713F', 1, true) + R(w * .2, 6, w * .6, head - 10, F.mat('paper', '#FFF6E2'), E2('#D9C49A', 1.2) + ' rx="6"') + T(w / 2, head * .72, '빵 진열대', head * .5, '#7A4A22');
    var top = head, gap = 10, avail = h - head - base - gap * 2, rh = avail / Math.max(1, ra + rb), cw = (w - 24) / per, r = Math.min(rh * .42, cw * .44);
    function sec(n, rows, y0, f) {
      var s = R(10, y0, w - 20, rows * rh + 4, F.lin([[0, '#D2E6F0'], [.3, '#EEF7FB'], [1, '#FFFFFF']]), E2('#9EC0D0', 1.4) + ' rx="4"');
      for (var i = 0; i < n; i++) { var q = i % per, k = Math.floor(i / per); s += f(12 + (q + .5) * cw, y0 + 4 + (k + .55) * rh, r) }
      return s + R(10, y0 + rows * rh + 2, w - 20, 5, F.mat('wood', '#7A4A22')) + R(14, y0 + 3, (w - 28) * .3, 3, '#fff', ' opacity=".55" rx="1.5"');
    }
    o += sec(p.a || 0, ra, top, bun) + sec(p.b || 0, rb, top + ra * rh + gap + 4, croi);
    o += R(0, h - base, w, base, F.mat('wood', '#7A4A22'), E2('#7A4A22', 1.4) + ' rx="4"') + F.shade(w - 12, 0, 12, h, 6, .2);
    return o;
  };

  /* 금전 등록기: 화면 p.screen, 열리면 돈 서랍이 나옴 */
  ART.A.bkRegister = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .52, 8) + R(w * .1, h * .12, w * .8, h * .22, F.mat('metal', '#3A3F48'), E2('#3A3F48') + ' rx="6"') + R(w * .16, h * .16, w * .68, h * .14, F.mat('screen', '#0E1A12'), ' rx="3"') + F.glassHL(w * .16, h * .16, w * .68, h * .14, .08) + T(w / 2, h * .27, open ? (p.done || 'OK') : (p.screen || '????'), h * .1, '#7CF29B');
    o += P('M' + w * .05 + ' ' + h * .72 + 'L' + w * .14 + ' ' + h * .36 + 'H' + w * .86 + 'L' + w * .95 + ' ' + h * .72 + 'Z', F.mat('paint', '#E05A4E'), E2('#E05A4E'));
    for (var r = 0; r < 3; r++) for (var q = 0; q < 4; q++) o += R(w * (.24 + q * .14) - r * w * .02, h * (.42 + r * .09), w * .1, h * .06, F.mat('plastic', '#FFF6E2'), E2('#B9A27A', 1.1) + ' rx="2"');
    o += F.box(0, h * .72, w, h * .28, '#B5443A', 'paint', 4, 1.8) + F.shade(w * .8, h * .72, w * .2, h * .28, 4, .2);
    o += open ? R(w * .1, h * .8, w * .8, h * .2, F.lin([[0, '#C9B48A'], [.35, '#FFF6E2']]), E2('#C9B48A', 1.4)) + R(w * .14, h * .84, w * .14, h * .1, F.mat('paper', '#7BB86F'), E2('#7BB86F', 1)) + R(w * .32, h * .84, w * .14, h * .1, F.mat('paper', '#7BB86F'), E2('#7BB86F', 1)) + C(w * .62, h * .9, h * .04, F.mat('gold'), E2('#C9A24B', 1)) + C(w * .74, h * .9, h * .04, F.mat('gold'), E2('#C9A24B', 1))
      : R(w * .3, h * .8, w * .4, h * .1, F.lin([[0, '#6A2620'], [1, '#A8443A']]), ' rx="3"') + C(w / 2, h * .85, h * .025, F.ball('#F2C230'));
    return o;
  };

  /* 수가 적힌 길 지도: p.grid[줄][칸](빈칸은 null), p.start=[칸, 줄], p.goal=[칸, 줄], p.sl·p.gl 이름 */
  ART.A.bkMap = function (w, h, p) {
    var g = p.grid || [[]], n = g.length, m = g[0].length, top = p.title ? 30 : 8, cs = Math.min((w - 16) / m, (h - top - 8) / n), ox = (w - cs * m) / 2, oy = top + (h - top - 8 - cs * n) / 2;
    var o = F.drop(R(0, 0, w, h, '#000', ' rx="6"'), 4, 6, .22) + R(0, 0, w, h, F.mat('paper', '#F7EBC9'), E2('#C9AE76') + ' rx="6"');
    if (p.title) o += T(w / 2, 22, p.title, 17, '#7A4A22');
    for (var r = 0; r < n; r++) for (var q = 0; q < m; q++) {
      var x = ox + q * cs, y = oy + r * cs, isS = p.start[0] === q && p.start[1] === r, isG = p.goal[0] === q && p.goal[1] === r;
      o += R(x, y, cs, cs, isS ? '#D6E6FA' : isG ? '#D9F0DD' : '#FFF8E2', ' stroke="#B99A5E" stroke-width="1.5"') + (isS || isG ? R(x + 2, y + 2, cs - 4, cs * .25, '#fff', ' opacity=".45" rx="2"') : '');
      if (isS) o += T(x + cs / 2, y + cs * .62, p.sl || '출발', cs * .26, '#3B6FD6');
      else if (isG) o += T(x + cs / 2, y + cs * .62, p.gl || '도착', cs * .26, '#2E7D5B');
      else if (g[r][q] != null) o += T(x + cs / 2, y + cs * .64, g[r][q], cs * .36, '#3A2C22');
    }
    return o;
  };

  /* 오븐: 열리면 문이 내려가고 안이 밝음. p.t = 타이머 화면 글 */
  ART.A.bkOven = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .54, 8) + R(0, 0, w, h, F.mat('metal', '#8A929C'), E2('#8A929C') + ' rx="10"') + F.shade(w * .82, 0, w * .18, h, 10, .18) + R(8, 8, w - 16, h * .18, F.lin([[0, '#4A5058'], [1, '#6E7680']]), ' rx="5"');
    o += R(w * .5, 14, w * .42, h * .12, F.mat('screen', '#0E1A12'), ' rx="3"') + F.glassHL(w * .5, 14, w * .42, h * .12, .1) + T(w * .71, 14 + h * .1, open ? '띵!' : (p.t || '--:--'), h * .08, '#F2C230');
    for (var i = 0; i < 2; i++) o += C(w * (.14 + i * .16), 8 + h * .09, h * .05, F.ball('#E8E3D8'), E2('#9AA2AC', 1.3)) + L(w * (.14 + i * .16), 8 + h * .09, w * (.14 + i * .16), 8 + h * .05, '#3A2C22', 2);
    var dy = h * .3, dh = h * .58;
    if (open) {
      o += R(14, dy, w - 28, dh, F.lin([[0, '#1A120E'], [1, '#3A2A20']]), ' rx="6"') + R(20, dy + 6, w - 40, dh - 12, F.rad([[0, '#FFB45A', .65], [1, '#F08A24', .2]], .5, .6, .7), ' rx="4"') + L(24, dy + dh * .55, w - 24, dy + dh * .55, '#C8CDD3', 3);
      o += P('M14 ' + (dy + dh) + 'L-' + w * .06 + ' ' + (h + 8) + 'H' + (w + w * .06) + 'L' + (w - 14) + ' ' + (dy + dh) + 'Z', F.mat('metal', '#6E7580'), E2('#6E7580'));
    } else {
      o += R(14, dy, w - 28, dh, F.mat('metal', '#6E7580'), E2('#6E7580') + ' rx="6"') + R(w * .2, dy + dh * .22, w * .6, dh * .5, F.rad([[0, '#5A3A24'], [1, '#1A120E']], .5, .6, .7), E2('#4A4F58', 1.6) + ' rx="6"') + R(w * .24, dy + dh * .27, w * .2, dh * .1, '#fff', ' opacity=".18" rx="3"') + F.glassHL(w * .2, dy + dh * .22, w * .6, dh * .5, .1);
      o += R(w * .2, dy + 8, w * .6, 8, F.mat('cylv', '#C8CDD3'), E2('#9AA2AC', 1.2) + ' rx="4"');
    }
    o += R(10, h - 10, 18, 10, F.mat('cylv', '#3A3F48')) + R(w - 28, h - 10, 18, 10, F.mat('cylv', '#3A3F48'));
    return o;
  };

  /* 반죽기: 톱니바퀴가 빠진 자리(점선) — 열리면 톱니가 끼워지고 반죽이 돔 */
  ART.A.bkMixer = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .44, 7) + R(w * .1, h * .86, w * .8, h * .14, F.mat('paint', '#E05A4E'), E2('#E05A4E') + ' rx="6"') + R(w * .62, h * .2, w * .22, h * .68, F.mat('cyl', '#E05A4E'), E2('#E05A4E') + ' rx="8"');
    o += P('M' + w * .18 + ' ' + h * .1 + 'H' + w * .84 + 'Q' + w * .92 + ' ' + h * .1 + ' ' + w * .92 + ' ' + h * .22 + 'V' + h * .3 + 'H' + w * .18 + 'Q' + w * .1 + ' ' + h * .3 + ' ' + w * .1 + ' ' + h * .2 + 'Z', F.mat('paint', '#E05A4E'), E2('#E05A4E')) + F.gloss(w * .2, h * .11, w * .6, h * .07, 6, .4);
    o += L(w * .35, h * .3, w * .35, h * .48, '#6E7580', 4);
    o += P('M' + w * .12 + ' ' + h * .5 + 'H' + w * .58 + 'L' + w * .52 + ' ' + h * .84 + 'H' + w * .18 + 'Z', F.mat('cyl', '#D9DEE3'), E2('#9AA2AC'));
    o += P('M' + w * .16 + ' ' + h * .55 + 'Q' + w * .35 + ' ' + h * (open ? .42 : .5) + ' ' + w * .54 + ' ' + h * .55 + 'Z', F.lin([[0, '#FFF6E2'], [1, '#E8D2A6']]), E2('#D9C08A', 1.4));
    var gx = w * .73, gy = h * .42, gr = Math.min(w, h) * .1;
    if (open) { var d = ''; for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, rr = i % 2 ? gr * .7 : gr; d += (i ? 'L' : 'M') + (gx + rr * Math.cos(a)).toFixed(1) + ' ' + (gy + rr * Math.sin(a)).toFixed(1) } o += P(d + 'Z', F.mat('metal', '#8A929C'), E2('#8A929C', 1.4)) + C(gx, gy, gr * .3, F.ball('#E8ECF0')) + T(w * .35, h * .97, '돌아가요!', h * .07, '#fff') }
    else o += C(gx, gy, gr, F.lin([[0, '#E8E3D8'], [1, '#FFFFFF']]), ' stroke="#7A2A22" stroke-width="2" stroke-dasharray="4 3"') + T(gx, gy + gr * .35, '?', gr, '#C8402F');
    return o;
  };

  /* 쿠키 틀 판: p.shapes 차례로 틀(테두리만) */
  ART.A.bkTray = function (w, h, p) {
    var s = p.shapes || [], n = s.length, o = F.ground(w / 2, h, w * .52, 7) + R(0, 0, w, h, F.mat('metal', '#D9A86C'), E2('#D9A86C') + ' rx="10"') + R(8, 8, w - 16, h - 16, F.lin([[0, '#C99A5E'], [.2, '#E8C08B'], [1, '#F2D2A4']]), ' rx="7"'), gw = (w - 16) / Math.max(1, n), r = Math.min(gw * .36, h * .3);
    s.forEach(function (k, i) {
      var cx = 8 + gw * (i + .5), cy = h * .46;
      o += '<g fill="none">' + shape(k, cx, cy, r, 'none').replace('fill="none"', 'fill="#FFF6E2" stroke="#9AA2AC" stroke-width="' + Math.max(3, r * .16) + '" stroke-linejoin="round"') + '</g>';
      o += T(cx, h - 12, i + 1, Math.min(16, h * .13), '#7A4A22');
    });
    return o;
  };

  /* 사다리꼴 쟁반 도면: p.top·p.bot·p.ht(cm) — 점선이 높이 */
  ART.A.bkPlan = function (w, h, p) {
    var o = F.drop(R(0, 0, w, h, '#000', ' rx="4"'), 4, 6, .22) + R(0, 0, w, h, F.mat('paper', '#FFFDF4'), E2('#D9CFB4', 1.6) + ' rx="4"') + C(w / 2, 8, 5, F.ball('#C8402F'), E2('#C8402F', 1)) + T(w / 2, 30, p.title || '케이크 쟁반', 18, '#7A4A22');
    var mx = Math.max(p.top, p.bot), sc = (w - 70) / mx, bw = p.bot * sc, tw = p.top * sc, hh = Math.min(h - 104, p.ht * sc), x0 = (w - bw) / 2, y1 = 64, y2 = y1 + hh, tx = x0 + (bw - tw) / 2;
    o += P('M' + tx + ' ' + y1 + 'H' + (tx + tw) + 'L' + (x0 + bw) + ' ' + y2 + 'H' + x0 + 'Z', F.mat('paint', '#F2D2A0'), E2('#C99A5E', 2));
    o += L(tx + tw * .5, y1, tx + tw * .5, y2, '#C8402F', 2.5, ' stroke-dasharray="6 4"') + R(tx + tw * .5, y2 - 10, 10, 10, 'none', ' stroke="#C8402F" stroke-width="2"');
    o += T(tx + tw / 2, y1 - 4 + (p.fs ? 0 : 0), p.top + ' cm', 15, '#3A2C22') + T(x0 + bw / 2, y2 + 20, p.bot + ' cm', 15, '#3A2C22') + T(tx + tw * .5 + 8, (y1 + y2) / 2 + 5, p.ht + ' cm', 14, '#C8402F', '', 'start');
    return o;
  };

  /* 밀가루 포대 p.n개(한 줄에 p.per개) + 아래 안내판 p.label */
  ART.A.bkSacks = function (w, h, p) {
    var n = p.n || 0, per = p.per || 8, rows = Math.ceil(n / per), lab = h * .2, cw = (w - 10) / per, rh = (h - lab - 6) / Math.max(1, rows), o = F.ground(w / 2, h - lab - 2, w * .5, 6);
    for (var i = 0; i < n; i++) {
      var q = i % per, k = rows - 1 - Math.floor(i / per), x = 5 + q * cw + cw * .08, y = 4 + k * rh, sw = cw * .84, sh = rh * .92;
      o += P('M' + (x + sw * .15) + ' ' + (y + sh * .12) + 'Q' + (x + sw / 2) + ' ' + (y - sh * .04) + ' ' + (x + sw * .85) + ' ' + (y + sh * .12) + 'L' + (x + sw) + ' ' + (y + sh * .85) + 'Q' + (x + sw / 2) + ' ' + (y + sh * 1.02) + ' ' + x + ' ' + (y + sh * .85) + 'Z', F.lin([[0, '#FFFDF6'], [.6, '#F4EEDC'], [1, '#DCCFAE']], 0, 0, .5, 1), E2('#BFAE88', 1.4));
      o += R(x + sw * .25, y + sh * .42, sw * .5, sh * .22, '#3B6FD6', ' rx="2" opacity=".75"');
    }
    o += F.box(w * .1, h - lab, w * .8, lab - 2, '#2E7D5B', 'paint', 6, 1.4) + T(w / 2, h - lab * .3, p.label || '', Math.min(lab * .5, 22), '#fff');
    return o;
  };

  /* 높은 선반: 맨 위 칸에 상자(열리면 상자가 내려와 열림) */
  ART.A.bkHigh = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .56, 8) + R(0, 0, w, h, F.mat('wood', '#9A6A3F'), E2('#9A6A3F') + ' rx="4"') + F.grain(1, 4, 7, h - 8, '#9A6A3F', 1, true) + F.grain(w - 8, 4, 7, h - 8, '#9A6A3F', 1, true), rh = (h - 14) / 4;
    for (var i = 0; i < 4; i++) { var y = 7 + i * rh; o += R(8, y, w - 16, rh - 8, F.lin([[0, '#2A1A0E', .55], [1, '#5A3E26', .25]]), '') + R(4, y + rh - 8, w - 8, 8, F.mat('wood', '#6B4A2E')) }
    if (!open) o += F.box(w * .25, 7 + rh * .25, w * .5, rh * .65 - 8, '#D99A4E', 'paper', 3, 1.4) + T(w / 2, 7 + rh * .72, '?', rh * .4, '#7A4A22');
    else o += R(w * .25, 7 + rh * .45, w * .5, rh * .45 - 8, '#2A1D18', ' opacity=".25" rx="3"');
    o += F.box(w * .15, 7 + rh * 2.3, w * .3, rh * .55, '#E8E3D8', 'plastic', 4, 1.3) + F.box(w * .55, 7 + rh * 2.3, w * .3, rh * .55, '#E8E3D8', 'plastic', 4, 1.3);
    o += F.box(w * .2, 7 + rh * 3.3, w * .6, rh * .55, '#C98A45', 'paint', 6, 1.4);
    if (open) o += R(w * .3, h * .02 - 0, w * .4, 4, '#F2C230');
    return o;
  };
})();
