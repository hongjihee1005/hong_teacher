/* 수학 방탈출 · 해적선·보물섬 주제 그림 (2026-11-27). ART.A.pr이름(w, h, p, open) → 0,0~w,h 안의 SVG 조각. 이모지 없이 직접 그린 도형. */
(function () {
  var A = ART.A, c = ART.c, esc = ART.esc;
  var K = ' stroke="#3A2C22" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#3A2C22" stroke-width="2" stroke-linejoin="round"', K1 = ' stroke="#3A2C22" stroke-width="1.5"';
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="middle" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function Ci(cx, cy, r, f, o) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (o || '') + '/>' }

  /* 돛대: 기둥 + 망루 + 접힌 돛, 오른쪽에 신호 깃발(p.flags=[{c, label}])을 위에서 아래로 */
  A.prMast = function (w, h, p) {
    var px = w * .2, o = R(px - 7, 14, 14, h - 14, '#8A5A2B', K2) + R(px - w * .17, h * .2, w * .34 + 4, 10, '#8A5A2B', K2);
    o += P('M' + (px - w * .16) + ' ' + (h * .2 + 10) + 'Q' + px + ' ' + (h * .2 + 46) + ' ' + (px + w * .18) + ' ' + (h * .2 + 10) + 'Z', '#F6F0DC', K2);
    o += R(px - 26, 4, 52, 22, '#B98552', K2 + ' rx="4"') + P('M' + px + ' 4V-8', 'none', ' stroke="#3A2C22" stroke-width="2"') + P('M' + px + ' -8h18l-5 6l5 6h-18z', c('빨강'), K1);
    var F = p.flags || [], fh = Math.min(46, (h * .78 - 20) / Math.max(1, F.length) - 8), fw = w - px - 22, y0 = h * .12;
    o += P('M' + (px + 7) + ' ' + y0 + 'V' + (y0 + F.length * (fh + 8)), 'none', ' stroke="#6B4A2E" stroke-width="2" stroke-dasharray="4 3"');
    F.forEach(function (f, i) {
      var y = y0 + 4 + i * (fh + 8);
      o += P('M' + (px + 10) + ' ' + (y + fh / 2) + 'H' + (px + 16), 'none', ' stroke="#6B4A2E" stroke-width="2"') + R(px + 16, y, fw, fh, c(f.c), K2 + ' rx="3"');
      if (f.label) o += R(px + 22, y + fh * .16, fw - 12, fh * .68, '#fff', ' rx="4" opacity=".92"') + T(px + 16 + fw / 2, y + fh * .66, f.label, Math.min(fh * .5, 20));
    });
    o += R(px - 30, h - 16, 60, 16, '#6B4A2E', ' rx="3"');
    return o;
  };
  /* 나무통 더미: p.rows줄 × p.cols개 (아래 줄부터 쌓음) */
  A.prBarrels = function (w, h, p) {
    var rows = p.rows || 2, cols = p.cols || 3, bw = w / cols, bh = h / rows, o = '';
    for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++) {
      var x = q * bw + 3, y = h - (r + 1) * bh + 2, ww = bw - 6, hh = bh - 4;
      o += R(x, y, ww, hh, c(p.c || '#B5793F'), K2 + ' rx="' + Math.min(ww, hh) * .3 + '"') + R(x, y + hh * .2, ww, hh * .1, '#5A4030') + R(x, y + hh * .7, ww, hh * .1, '#5A4030') + R(x + ww * .2, y + hh * .35, ww * .1, hh * .28, '#fff', ' opacity=".25" rx="2"');
    }
    return o;
  };
  /* 밧줄: 양쪽 말뚝에 걸린 밧줄, 매듭 p.n개 */
  A.prRope = function (w, h, p) {
    var n = p.n || 3, y = h * .45, o = R(0, h * .15, 16, h * .8, '#6B4A2E', K2 + ' rx="3"') + R(w - 16, h * .15, 16, h * .8, '#6B4A2E', K2 + ' rx="3"');
    o += P('M14 ' + (h * .25) + 'Q' + (w / 2) + ' ' + (h * .75) + ' ' + (w - 14) + ' ' + (h * .25), 'none', ' stroke="#C9A26A" stroke-width="9" stroke-linecap="round"') + P('M14 ' + (h * .25) + 'Q' + (w / 2) + ' ' + (h * .75) + ' ' + (w - 14) + ' ' + (h * .25), 'none', ' stroke="#8A6A3A" stroke-width="2" stroke-dasharray="6 5"');
    for (var i = 0; i < n; i++) { var t = (i + 1) / (n + 1), x = (1 - t) * (1 - t) * 14 + 2 * (1 - t) * t * (w / 2) + t * t * (w - 14), yy = (1 - t) * (1 - t) * (h * .25) + 2 * (1 - t) * t * (h * .75) + t * t * (h * .25); o += Ci(x, yy, 11, '#B98552', K2) + P('M' + (x - 5) + ' ' + (yy - 4) + 'L' + (x + 5) + ' ' + (yy + 4), 'none', ' stroke="#5A4030" stroke-width="2"') }
    return o;
  };
  /* 앵무새: 횃대 위, p.say 말풍선(위쪽) */
  A.prParrot = function (w, h, p) {
    var by = p.say ? h * .42 : h * .1, bh = h - by, cx = w * .5, o = '';
    if (p.say) o += R(4, 2, w - 8, h * .3, '#fff', K2 + ' rx="10"') + P('M' + (cx - 8) + ' ' + (h * .3 + 2) + 'l6 12l8 -12z', '#fff', K2) + R(cx - 12, h * .3 - 2, 26, 4, '#fff') + T(w / 2, h * .2, p.say, Math.min(h * .12, (w - 16) / Math.max(4, String(p.say).length) * 1.5));
    o += R(w * .1, by + bh * .82, w * .8, 9, '#8A5A2B', ' rx="4"');
    o += P('M' + (cx - bh * .06) + ' ' + (by + bh * .8) + 'L' + (cx - bh * .2) + ' ' + (by + bh * .99) + 'L' + (cx + bh * .02) + ' ' + (by + bh * .8) + 'Z', c(p.tail || '파랑'), K2);
    o += '<ellipse cx="' + cx + '" cy="' + (by + bh * .55) + '" rx="' + bh * .18 + '" ry="' + bh * .28 + '" fill="' + c(p.c || '초록') + '"' + K2 + '/>';
    o += Ci(cx + bh * .02, by + bh * .22, bh * .16, c(p.c || '초록'), K2) + Ci(cx + bh * .07, by + bh * .19, bh * .04, '#fff') + Ci(cx + bh * .08, by + bh * .19, bh * .02, '#2A221C');
    o += P('M' + (cx + bh * .15) + ' ' + (by + bh * .2) + 'q' + bh * .14 + ' ' + bh * .02 + ' ' + bh * .04 + ' ' + bh * .14 + 'z', '#F2C230', K1);
    o += '<ellipse cx="' + (cx - bh * .05) + '" cy="' + (by + bh * .55) + '" rx="' + bh * .1 + '" ry="' + bh * .2 + '" fill="' + c(p.wing || '빨강') + '"' + K1 + '/>';
    return o;
  };
  /* 보물 상자: 닫히면 둥근 뚜껑·자물쇠, 열리면 뚜껑이 뒤로 젖혀지고 금화가 보임. 몸통 앞면 왼쪽 아래(0.08w~, 0.62h~)는 비워 둠(숨은 서랍 자리) */
  A.prChest = function (w, h, p, open) {
    var f = c(p.c || '#9A5B2E'), o = '';
    if (open) {
      o += P('M0 ' + h * .42 + 'L' + w * .06 + ' ' + h * .02 + 'H' + w * .94 + 'L' + w + ' ' + h * .42 + 'Z', f, K) + R(w * .1, h * .1, w * .8, h * .26, '#2A221C', ' opacity=".35" rx="6"');
      for (var i = 0; i < 9; i++) o += Ci(w * (.14 + i * .09), h * .34 + (i % 2) * 5, Math.min(w, h) * .05, '#F2C230', K1);
    } else o += P('M0 ' + h * .42 + 'Q' + w / 2 + ' ' + (-h * .02) + ' ' + w + ' ' + h * .42 + 'Z', f, K) + R(w * .22, h * .06, w * .07, h * .36, '#C9A24B') + R(w * .71, h * .06, w * .07, h * .36, '#C9A24B');
    o += R(0, h * .42, w, h * .58, f, K + ' rx="5"') + R(w * .22, h * .42, w * .07, h * .58, '#C9A24B') + R(w * .71, h * .42, w * .07, h * .58, '#C9A24B') + R(0, h * .42, w, h * .07, '#C9A24B', K2);
    if (!open && p.lock !== false) o += R(w / 2 - 15, h * .36, 30, 34, '#F2C230', K2 + ' rx="5"') + Ci(w / 2, h * .36 + 14, 5, '#3A2C22') + R(w / 2 - 2, h * .36 + 16, 4, 10, '#3A2C22');
    if (p.label) o += R(w * .34, h * .62, w * .32, h * .22, '#FFF6DC', ' rx="4"') + T(w / 2, h * .62 + h * .16, p.label, Math.min(h * .16, 22));
    return o;
  };
  /* 망원경(세 발 받침대 위) */
  A.prScope = function (w, h, p, open) {
    var o = P('M' + w * .5 + ' ' + h * .45 + 'L' + w * .2 + ' ' + h + 'M' + w * .5 + ' ' + h * .45 + 'L' + w * .8 + ' ' + h + 'M' + w * .5 + ' ' + h * .45 + 'V' + h, 'none', ' stroke="#5A4030" stroke-width="6" stroke-linecap="round"');
    if (p.empty && !open) return o + R(w * .42, h * .38, w * .16, h * .1, '#5A4030', K2 + ' rx="3"');
    o += '<g transform="rotate(-18 ' + w * .5 + ' ' + h * .4 + ')">' + R(w * .08, h * .32, w * .5, h * .16, '#C9A24B', K2 + ' rx="6"') + R(w * .5, h * .34, w * .3, h * .12, '#8A6A3A', K2 + ' rx="5"') + R(w * .78, h * .355, w * .14, h * .09, '#5A4030', K2 + ' rx="3"') + Ci(w * .1, h * .4, h * .075, open ? '#BFE3F5' : '#6E7580', K2) + '</g>';
    return o;
  };
  /* 배의 키(조타륜) */
  A.prWheel = function (w, h, p, open) {
    var r = Math.min(w, h * .8) / 2 - 12, cx = w / 2, cy = r + 12, o = R(cx - w * .12, cy + r * .6, w * .24, h - cy - r * .6, '#8A5A2B', K2 + ' rx="4"'), rot = open ? 22 : 0, g = '';
    for (var i = 0; i < 8; i++) { var a = (i * 45 + rot) * Math.PI / 180, x1 = cx + Math.cos(a) * (r + 10), y1 = cy + Math.sin(a) * (r + 10); g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x1 + '" y2="' + y1 + '" stroke="#6B4A2E" stroke-width="7" stroke-linecap="round"/>' + Ci(x1, y1, 7, '#9A6A3F', K1) }
    o += g + Ci(cx, cy, r, 'none', ' stroke="#9A6A3F" stroke-width="10"') + Ci(cx, cy, r, 'none', ' stroke="#3A2C22" stroke-width="1.5"') + Ci(cx, cy, r * .22, '#C9A24B', K2);
    return o;
  };
  /* 야자나무: 코코넛 p.n개 */
  A.prPalm = function (w, h, p) {
    var tx = w * .5, o = P('M' + (tx - 10) + ' ' + h + 'Q' + (tx - 22) + ' ' + h * .55 + ' ' + (tx - 4) + ' ' + h * .3 + 'L' + (tx + 10) + ' ' + h * .3 + 'Q' + (tx - 6) + ' ' + h * .55 + ' ' + (tx + 10) + ' ' + h + 'Z', '#A97A4A', K2);
    for (var j = 0; j < 6; j++) o += '<line x1="' + (tx - 16 + j * 1) + '" y1="' + (h * (.4 + j * .1)) + '" x2="' + (tx + 6) + '" y2="' + (h * (.39 + j * .1)) + '" stroke="#6B4A2E" stroke-width="2"/>';
    [[-1, .05], [1, .05], [-1, .2], [1, .2]].forEach(function (L) { var ex = tx + L[0] * w * .48, ey = h * (.3 + L[1]) + (L[0] ? h * .06 : -h * .02); o += P('M' + tx + ' ' + h * .28 + 'Q' + (tx + L[0] * w * .2) + ' ' + (h * .1 + L[1] * h) + ' ' + ex + ' ' + ey + 'Q' + (tx + L[0] * w * .25) + ' ' + (h * .28 + L[1] * h) + ' ' + tx + ' ' + h * .3 + 'Z', '#3DA35D', K2) });
    var n = p.n || 3, rr = Math.min(11, w * .07), top = Math.ceil(n / 2), sp = rr * 2.5;
    for (var i = 0; i < n; i++) { var row = i < top ? 0 : 1, k = row ? i - top : i, cnt = row ? n - top : top; o += Ci(tx + (k - (cnt - 1) / 2) * sp, h * .33 + row * sp * .9, rr, '#7A4E2A', K2) + Ci(tx + (k - (cnt - 1) / 2) * sp - rr * .3, h * .33 + row * sp * .9 - rr * .3, rr * .22, '#fff', ' opacity=".35"') }
    return o;
  };
  /* 모래 위 유리병 편지 */
  A.prBottle = function (w, h) {
    return '<ellipse cx="' + w / 2 + '" cy="' + h * .82 + '" rx="' + w * .48 + '" ry="' + h * .14 + '" fill="#E3C98E"/>' + '<g transform="rotate(-12 ' + w / 2 + ' ' + h / 2 + ')">' + R(w * .12, h * .3, w * .6, h * .42, '#9ED8C8', K2 + ' rx="' + h * .2 + '" opacity=".9"') + R(w * .72, h * .4, w * .16, h * .22, '#9ED8C8', K2 + ' rx="3"') + R(w * .86, h * .39, w * .06, h * .24, '#9A6A3F', K2 + ' rx="2"') + R(w * .22, h * .38, w * .42, h * .26, '#FFF6DC', K1 + ' rx="6"') + R(w * .22, h * .42, w * .42, 3, '#C8402F') + '</g>';
  };
  /* 나침반 상자: 뚜껑에 방위 무늬 */
  A.prCompass = function (w, h, p, open) {
    var cx = w / 2, cy = h * .42, r = Math.min(w, h) * .32, o = R(0, h * .12, w, h * .82, '#9A6A3F', K + ' rx="8"') + Ci(cx, cy, r + 6, '#C9A24B', K2) + Ci(cx, cy, r, '#FFF6DC', K2);
    o += P('M' + cx + ' ' + (cy - r * .85) + 'L' + (cx + r * .16) + ' ' + cy + 'L' + cx + ' ' + (cy + r * .85) + 'L' + (cx - r * .16) + ' ' + cy + 'Z', '#3A2C22') + P('M' + cx + ' ' + (cy - r * .85) + 'L' + (cx + r * .16) + ' ' + cy + 'H' + (cx - r * .16) + 'Z', '#C8402F');
    o += T(cx, cy - r - 12, '북', 16, '#fff') + T(cx + r + 18, cy + 6, '동', 15, '#fff') + T(cx - r - 18, cy + 6, '서', 15, '#fff');
    o += open ? R(w * .3, h * .8, w * .4, 10, '#2A221C', ' opacity=".5"') : R(w / 2 - 12, h * .78, 24, 18, '#F2C230', K1 + ' rx="3"');
    return o;
  };
  /* 동굴 입구: 바위 더미와 어두운 입구, 열리면(불을 비추면) 안이 밝아짐 */
  A.prCave = function (w, h, p, open) {
    var o = P('M0 ' + h + 'L' + w * .04 + ' ' + h * .45 + 'Q' + w * .2 + ' ' + h * .02 + ' ' + w * .5 + ' 0Q' + w * .82 + ' ' + h * .02 + ' ' + w * .96 + ' ' + h * .42 + 'L' + w + ' ' + h + 'Z', '#8C8478', K);
    o += P('M' + w * .1 + ' ' + h * .5 + 'l' + w * .1 + ' -' + h * .08 + 'M' + w * .78 + ' ' + h * .3 + 'l' + w * .08 + ' ' + h * .1, 'none', ' stroke="#5E574D" stroke-width="3"');
    o += P('M' + w * .25 + ' ' + h + 'V' + h * .55 + 'Q' + w * .5 + ' ' + h * .15 + ' ' + w * .75 + ' ' + h * .55 + 'V' + h + 'Z', open ? '#F7D774' : '#1F1A16', K2);
    if (open) o += Ci(w * .5, h * .7, h * .1, '#FFF2B8', ' opacity=".8"');
    if (p.sign) o += R(w * .3, h * .08, w * .4, 28, '#6B4A2E', ' rx="4"') + T(w / 2, h * .08 + 21, p.sign, 17, '#fff');
    return o;
  };
  /* 줄에 매달린 등불 p.n개 */
  A.prLanterns = function (w, h, p) {
    var n = p.n || 4, o = P('M0 10Q' + w / 2 + ' ' + h * .22 + ' ' + w + ' 10', 'none', ' stroke="#5A4030" stroke-width="3"'), gap = w / n;
    for (var i = 0; i < n; i++) { var x = gap * (i + .5), t = (i + .5) / n, y = (1 - t) * (1 - t) * 10 + 2 * (1 - t) * t * h * .22 + t * t * 10, lw = Math.min(gap * .62, 34), lh = lw * 1.4; o += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + 12) + '" stroke="#5A4030" stroke-width="2"/>' + R(x - lw / 2, y + 12, lw, lh, '#FFD86B', K2 + ' rx="' + lw * .3 + '"') + R(x - lw / 2 - 2, y + 10, lw + 4, 6, '#5A4030', ' rx="2"') + R(x - lw / 2 - 2, y + 10 + lh, lw + 4, 6, '#5A4030', ' rx="2"') + Ci(x, y + 12 + lh / 2, lw * .18, '#FFF5CC') }
    return o;
  };
  /* 보석 박힌 돌 벽(색 자물쇠): p.colors */
  A.prGemwall = function (w, h, p, open) {
    var o = R(0, 0, w, h, '#7E776C', K + ' rx="14"') + R(10, 10, w - 20, h - 20, '#948C80', ' rx="10"'), cols = p.colors || ['빨강', '노랑', '초록', '파랑'];
    cols.forEach(function (k, i) { var x = w * (i + .5) / cols.length, y = h * .4, s = Math.min(22, w / cols.length * .32); o += Ci(x, y, s + 6, '#5E574D') + P('M' + x + ' ' + (y - s) + 'L' + (x + s) + ' ' + y + 'L' + x + ' ' + (y + s) + 'L' + (x - s) + ' ' + y + 'Z', c(k), K1) });
    o += open ? R(w * .25, h * .66, w * .5, h * .2, '#1F1A16', ' rx="6"') : R(w * .25, h * .66, w * .5, h * .2, '#6E675C', K2 + ' rx="6"');
    if (p.label) o += T(w / 2, h * .66 + h * .14, p.label, Math.min(16, h * .12), '#fff');
    return o;
  };
  /* 모래밭의 X 표시: 열리면 파낸 구덩이 */
  A.prXspot = function (w, h, p, open) {
    var o = '<ellipse cx="' + w / 2 + '" cy="' + h / 2 + '" rx="' + w / 2 + '" ry="' + h / 2 + '" fill="#D8BD82"' + K2 + '/>';
    if (open) return o + '<ellipse cx="' + w / 2 + '" cy="' + h / 2 + '" rx="' + w * .3 + '" ry="' + h * .28 + '" fill="#5A4030"/>' + Ci(w / 2, h / 2, h * .08, '#F2C230', K1);
    return o + P('M' + w * .35 + ' ' + h * .25 + 'L' + w * .65 + ' ' + h * .75 + 'M' + w * .65 + ' ' + h * .25 + 'L' + w * .35 + ' ' + h * .75, 'none', ' stroke="#C8402F" stroke-width="9" stroke-linecap="round"');
  };
  /* 항구 기중기: 닫히면 갈고리가 비어 있고 짐은 바닥, 열리면 짐을 들어 올림 */
  A.prCrane = function (w, h, p, open) {
    var o = R(w * .1, h * .08, 18, h * .92, '#C8402F', K2) + R(w * .1, h * .08, w * .8, 16, '#C8402F', K2) + P('M' + (w * .1 + 18) + ' ' + (h * .08 + 16) + 'L' + w * .4 + ' ' + (h * .08 + 16), 'none', ' stroke="#3A2C22" stroke-width="2"') + R(0, h - 14, w * .3, 14, '#5A4030', ' rx="3"');
    for (var i = 0; i < 6; i++) o += '<line x1="' + (w * .1) + '" y1="' + (h * .14 + i * h * .14) + '" x2="' + (w * .1 + 18) + '" y2="' + (h * .2 + i * h * .14) + '" stroke="#3A2C22" stroke-width="2"/>';
    var hx = w * .75, cy = open ? h * .32 : h * .72, ly = open ? h * .3 : h - 4;
    o += '<line x1="' + hx + '" y1="' + (h * .08 + 16) + '" x2="' + hx + '" y2="' + (open ? h * .3 : h * .5) + '" stroke="#3A2C22" stroke-width="3"/>' + P('M' + hx + ' ' + (open ? h * .3 : h * .5) + 'v10q0 10 -9 10', 'none', ' stroke="#3A2C22" stroke-width="4" stroke-linecap="round"');
    var bw = w * .32, bh = h * .26, bx = hx - bw / 2, by = open ? h * .32 + 14 : h - bh;
    o += R(bx, by, bw, bh, '#B98552', K2) + P('M' + bx + ' ' + by + 'L' + (bx + bw) + ' ' + (by + bh) + 'M' + (bx + bw) + ' ' + by + 'L' + bx + ' ' + (by + bh), 'none', ' stroke="#6B4A2E" stroke-width="3"');
    if (open) o += R(bx - 6, h - 16, bw + 12, 16, '#1F1A16', ' rx="3" opacity=".6"');
    return o;
  };
  /* 나무 짐 상자: p.lock, p.label */
  A.prCrate = function (w, h, p, open) {
    var f = c(p.c || '#B98552'), o = R(0, h * .15, w, h * .85, f, K + ' rx="4"') + P('M6 ' + (h * .2) + 'L' + (w - 6) + ' ' + (h - 6) + 'M' + (w - 6) + ' ' + (h * .2) + 'L6 ' + (h - 6), 'none', ' stroke="#6B4A2E" stroke-width="5" opacity=".7"');
    o += open ? P('M0 ' + h * .15 + 'L' + w * .1 + ' 0H' + w * 1.02 + 'L' + w * .92 + ' ' + h * .15 + 'Z', f, K2 + ' opacity=".85"') + R(6, h * .15, w - 12, h * .1, '#2A221C', ' opacity=".45"') : R(-4, h * .08, w + 8, h * .14, f, K2 + ' rx="3"');
    if (p.label) o += R(w * .18, h * .42, w * .64, h * .26, '#FFF6DC', ' rx="4"') + T(w / 2, h * .42 + h * .19, p.label, Math.min(h * .18, 22));
    if (!open && p.lock) o += R(w / 2 - 12, h * .74, 24, 24, '#F2C230', K2 + ' rx="4"') + Ci(w / 2, h * .74 + 10, 4, '#3A2C22');
    return o;
  };
  /* 등대 렌즈: 지름 표시(p.d 글), 열리면 빛 */
  A.prLens = function (w, h, p, open) {
    var r = Math.min(w, h * .82) / 2 - 8, cx = w / 2, cy = r + 8, o = R(cx - w * .25, cy + r * .7, w * .5, h - cy - r * .7, '#6E7580', K2 + ' rx="4"');
    if (open) o += P('M' + cx + ' ' + cy + 'L0 ' + (cy - r * .5) + 'V' + (cy + r * .5) + 'Z M' + cx + ' ' + cy + 'L' + w + ' ' + (cy - r * .5) + 'V' + (cy + r * .5) + 'Z', '#FFE27A', ' opacity=".55"');
    o += Ci(cx, cy, r, open ? '#FFF2B8' : '#CFE7F3', K) + Ci(cx, cy, r * .72, 'none', ' stroke="#8AA3B5" stroke-width="3"') + Ci(cx, cy, r * .44, 'none', ' stroke="#8AA3B5" stroke-width="3"');
    if (p.d) o += P('M' + (cx - r) + ' ' + cy + 'H' + (cx + r), 'none', ' stroke="#C8402F" stroke-width="3" stroke-dasharray="7 4"') + Ci(cx - r, cy, 5, '#C8402F') + Ci(cx + r, cy, 5, '#C8402F') + R(cx - 62, cy - 34, 124, 26, '#fff', ' rx="5" opacity=".92"') + T(cx, cy - 15, p.d, 18, '#C8402F');
    return o;
  };
  /* 신호판: 위에 수 카드(p.nums), 아래에 모양 칸 */
  A.prSignal = function (w, h, p, open) {
    var N = p.nums || [], n = Math.max(1, N.length), o = R(0, 0, w, h, '#2E4A6B', K + ' rx="10"') + (p.title ? T(w / 2, 26, p.title, 18, '#fff') : '');
    N.forEach(function (v, i) { var x = 12 + (w - 24) * i / n, cw = (w - 24) / n - 10; o += R(x + 5, h * .26, cw, h * .3, '#FFF6DC', K2 + ' rx="6"') + T(x + 5 + cw / 2, h * .26 + h * .21, v, Math.min(h * .2, 30)) + R(x + 5, h * .64, cw, h * .26, open ? '#FFD86B' : '#47658A', K2 + ' rx="6"') });
    return o;
  };
  /* 직육면체 그림(겨냥도): p.a 가로·p.b 세로(깊이)·p.c 높이 글 */
  A.prCuboid = function (w, h, p) {
    var dx = w * .16, dy = h * .18, x0 = w * .1, y0 = h * .34, fw = w * .46, fh = h * .46, o = R(0, 0, w, h, '#FFF6DC', K2 + ' rx="6"');
    o += P('M' + x0 + ' ' + y0 + 'L' + (x0 + dx) + ' ' + (y0 - dy) + 'H' + (x0 + dx + fw) + 'L' + (x0 + fw) + ' ' + y0 + 'Z', '#E8C99A', K2) + P('M' + (x0 + fw) + ' ' + y0 + 'L' + (x0 + fw + dx) + ' ' + (y0 - dy) + 'V' + (y0 - dy + fh) + 'L' + (x0 + fw) + ' ' + (y0 + fh) + 'Z', '#C9A06A', K2) + R(x0, y0, fw, fh, '#DDB57E', K2);
    o += P('M' + x0 + ' ' + (y0 + fh) + 'L' + (x0 + dx) + ' ' + (y0 + fh - dy) + 'H' + (x0 + dx + fw) + 'M' + (x0 + dx) + ' ' + (y0 + fh - dy) + 'V' + (y0 - dy), 'none', ' stroke="#3A2C22" stroke-width="1.5" stroke-dasharray="5 4"');
    if (p.a) o += T(x0 + fw / 2, y0 + fh + 22, p.a, 17, '#C8402F');
    if (p.c) o += T(x0 + fw + dx + 30, y0 - dy / 2 + fh / 2 + 6, p.c, 17, '#C8402F');
    if (p.b) o += T(x0 + fw + dx + 6, y0 - dy + 4, p.b, 17, '#3B6FD6').replace('text-anchor="middle"', 'text-anchor="start"');
    if (p.t) o += T(w * .3, 22, p.t, 17);
    return o;
  };
  /* 천장 들보에 걸린 열쇠 꾸러미: 열리면 빈 고리 */
  A.prBeam = function (w, h, p, open) {
    var o = R(0, 0, w, h * .22, '#6B4A2E', K + ' rx="3"') + '<line x1="' + w / 2 + '" y1="' + h * .22 + '" x2="' + w / 2 + '" y2="' + h * .5 + '" stroke="#3A2C22" stroke-width="3"/>' + Ci(w / 2, h * .58, h * .09, 'none', ' stroke="#8A929C" stroke-width="5"');
    if (!open) [-1, 0, 1].forEach(function (k) { var x = w / 2 + k * 16; o += '<line x1="' + x + '" y1="' + h * .64 + '" x2="' + (x + k * 6) + '" y2="' + h * .9 + '" stroke="#C9A24B" stroke-width="6" stroke-linecap="round"/>' + R(x + k * 6 - 6, h * .86, 12, 6, '#C9A24B') });
    return o;
  };
})();
