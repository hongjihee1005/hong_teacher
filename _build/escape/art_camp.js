/* 수학 방탈출 · 숲속 캠핑장 그림 (2026-11-28) — 그림 이름 앞글자 cp. 모두 직접 그린 SVG(이모지 없음).
   ART.A.이름(w, h, p, open) → 0,0~w,h 안에 그리는 SVG 조각. 개수를 세는 그림은 p의 수만큼 정확히 그림. */
(function () {
  var c = ART.c, esc = ART.esc;
  function R(x, y, w, h, f, o) { return '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(w) + '" height="' + n1(h) + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o) { return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + n1(size) + '" fill="' + (f || '#2A221C') + '" text-anchor="middle" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function n1(v) { return (+v).toFixed(1) }
  var INK = '#3A2C22', STK = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"', S2 = ' stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"';

  /* 솔방울(큰 것은 진한 갈색, 작은 것은 작고 옅은 갈색) */
  function cone(cx, cy, s, big) {
    var rx = s * (big ? .3 : .2), ry = s * (big ? .44 : .3), f = big ? '#7A4A22' : '#B07A45', o = '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy) + '" rx="' + n1(rx) + '" ry="' + n1(ry) + '" fill="' + f + '"' + S2 + '/>';
    for (var i = 0; i < 3; i++) { var yy = cy - ry * .5 + i * ry * .45; o += '<path d="M' + n1(cx - rx * .75) + ' ' + n1(yy) + 'L' + n1(cx) + ' ' + n1(yy + ry * .25) + 'L' + n1(cx + rx * .75) + ' ' + n1(yy) + '" fill="none" stroke="#F3D7A8" stroke-width="1.6"/>' }
    return o;
  }
  function acorn(cx, cy, s) {
    return '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy + s * .06) + '" rx="' + n1(s * .18) + '" ry="' + n1(s * .22) + '" fill="#D49A55"' + S2 + '/>' +
      '<path d="M' + n1(cx - s * .22) + ' ' + n1(cy - s * .04) + 'Q' + n1(cx) + ' ' + n1(cy - s * .34) + ' ' + n1(cx + s * .22) + ' ' + n1(cy - s * .04) + 'Z" fill="#6B4A2E"' + S2 + '/>' +
      '<line x1="' + n1(cx) + '" y1="' + n1(cy - s * .2) + '" x2="' + n1(cx + s * .05) + '" y2="' + n1(cy - s * .34) + '" stroke="' + INK + '" stroke-width="2.5" stroke-linecap="round"/>';
  }
  /* 솔방울 바구니: 한 줄에 한 가지씩 — p.big 큰 솔방울, p.small 작은 솔방울, p.acorn 도토리 */
  ART.A.cpBasket = function (w, h, p) {
    var o = R(0, h * .08, w, h * .92, '#C99A5B', STK + ' rx="16"') + R(10, h * .12, w - 20, h * .84, '#F5E6C8', ' rx="10"');
    for (var k = 1; k < 6; k++) o += '<line x1="' + n1(k * w / 6) + '" y1="' + n1(h * .9) + '" x2="' + n1(k * w / 6) + '" y2="' + h + '" stroke="#8A6234" stroke-width="2"/>';
    o += '<path d="M' + n1(w * .25) + ' ' + n1(h * .1) + 'Q' + n1(w / 2) + ' -' + n1(h * .12) + ' ' + n1(w * .75) + ' ' + n1(h * .1) + '" fill="none" stroke="#8A6234" stroke-width="6"/>';
    var rows = [['b', p.big || 0], ['s', p.small || 0], ['a', p.acorn || 0]], rh = (h * .78) / 3;
    rows.forEach(function (r, i) {
      var n = r[1], cy = h * .16 + rh * (i + .5), gap = (w - 30) / Math.max(7, n), s = Math.min(rh * .95, gap * 1.3);
      for (var j = 0; j < n; j++) { var cx = 15 + gap * (j + .5); o += r[0] === 'a' ? acorn(cx, cy, s) : cone(cx, cy, s, r[0] === 'b') }
    });
    return o;
  };

  /* 텐트: 닫힘 = 지퍼 닫힌 입구, 열림 = 손전등 빛이 비친 안쪽 */
  ART.A.cpTent = function (w, h, p, open) {
    var f = c(p.c || '#E07B39'), o = '<path d="M' + n1(w * .02) + ' ' + h + 'L' + n1(w / 2) + ' ' + n1(h * .06) + 'L' + n1(w * .98) + ' ' + h + 'Z" fill="' + f + '"' + STK + '/>';
    o += '<line x1="' + n1(w / 2) + '" y1="' + n1(h * .06) + '" x2="' + n1(w / 2) + '" y2="-6" stroke="' + INK + '" stroke-width="4"/><path d="M' + n1(w / 2) + ' -6l26 8l-26 8z" fill="#F2C230"' + S2 + '/>';
    if (open) {
      o += '<path d="M' + n1(w * .26) + ' ' + h + 'L' + n1(w / 2) + ' ' + n1(h * .3) + 'L' + n1(w * .74) + ' ' + h + 'Z" fill="#3A2C22"/>';
      o += '<path d="M' + n1(w / 2) + ' ' + n1(h * .45) + 'L' + n1(w * .36) + ' ' + h + 'H' + n1(w * .64) + 'Z" fill="#FFE27A" opacity=".55"/>';
      o += '<path d="M' + n1(w / 2) + ' ' + n1(h * .3) + 'L' + n1(w * .2) + ' ' + h + 'L' + n1(w * .3) + ' ' + h + 'Z" fill="' + f + '"' + S2 + ' opacity=".95"/>';
      o += R(w * .43, h * .78, w * .14, h * .12, '#5A8F4E', S2 + ' rx="4"');
    } else {
      o += '<line x1="' + n1(w / 2) + '" y1="' + n1(h * .3) + '" x2="' + n1(w / 2) + '" y2="' + h + '" stroke="' + INK + '" stroke-width="3"/>';
      for (var i = 0; i < 8; i++) { var yy = h * .34 + i * h * .08; o += '<line x1="' + n1(w / 2 - 5) + '" y1="' + n1(yy) + '" x2="' + n1(w / 2 + 5) + '" y2="' + n1(yy) + '" stroke="#F3E3C8" stroke-width="2"/>' }
      o += '<circle cx="' + n1(w / 2) + '" cy="' + n1(h * .62) + '" r="6" fill="#F2C230"' + S2 + '/>';
    }
    return o;
  };

  /* 모닥불 + 마시멜로 접시: 접시 위 줄에 흰 마시멜로 p.white개, 아래 줄에 분홍 마시멜로 p.pink개 */
  ART.A.cpFire = function (w, h, p) {
    var fx = w * .26, fy = h * .82, o = '';
    o += '<ellipse cx="' + n1(fx) + '" cy="' + n1(fy + 8) + '" rx="' + n1(w * .24) + '" ry="' + n1(h * .07) + '" fill="#8A929C"' + S2 + '/>';
    o += '<line x1="' + n1(fx - w * .18) + '" y1="' + n1(fy) + '" x2="' + n1(fx + w * .18) + '" y2="' + n1(fy - h * .12) + '" stroke="#7A4A22" stroke-width="14" stroke-linecap="round"/>';
    o += '<line x1="' + n1(fx + w * .18) + '" y1="' + n1(fy) + '" x2="' + n1(fx - w * .18) + '" y2="' + n1(fy - h * .12) + '" stroke="#8B5A2B" stroke-width="14" stroke-linecap="round"/>';
    o += '<path d="M' + n1(fx) + ' ' + n1(h * .12) + 'C' + n1(fx + w * .2) + ' ' + n1(h * .42) + ' ' + n1(fx + w * .16) + ' ' + n1(fy - h * .1) + ' ' + n1(fx) + ' ' + n1(fy - h * .06) + 'C' + n1(fx - w * .16) + ' ' + n1(fy - h * .1) + ' ' + n1(fx - w * .2) + ' ' + n1(h * .45) + ' ' + n1(fx) + ' ' + n1(h * .12) + 'Z" fill="#F08A24"' + S2 + '/>';
    o += '<path d="M' + n1(fx) + ' ' + n1(h * .38) + 'C' + n1(fx + w * .1) + ' ' + n1(h * .55) + ' ' + n1(fx + w * .08) + ' ' + n1(fy - h * .1) + ' ' + n1(fx) + ' ' + n1(fy - h * .08) + 'C' + n1(fx - w * .08) + ' ' + n1(fy - h * .1) + ' ' + n1(fx - w * .1) + ' ' + n1(h * .56) + ' ' + n1(fx) + ' ' + n1(h * .38) + 'Z" fill="#F2C230"/>';
    // 접시
    var px = w * .54, pw = w * .44, py = h * .3, ph = h * .62;
    o += '<ellipse cx="' + n1(px + pw / 2) + '" cy="' + n1(py + ph / 2) + '" rx="' + n1(pw / 2) + '" ry="' + n1(ph / 2) + '" fill="#F6F3EC"' + STK + '/>';
    o += '<ellipse cx="' + n1(px + pw / 2) + '" cy="' + n1(py + ph / 2) + '" rx="' + n1(pw * .4) + '" ry="' + n1(ph * .38) + '" fill="none" stroke="#D9D4CA" stroke-width="2"/>';
    [['#FFFFFF', p.white || 0, py + ph * .34], ['#F7A8C8', p.pink || 0, py + ph * .66]].forEach(function (r) {
      var n = r[1], gap = pw * .78 / Math.max(5, n), s = Math.min(gap * .82, ph * .26);
      for (var i = 0; i < n; i++) { var cx = px + pw * .11 + gap * (i + .5); o += R(cx - s / 2, r[2] - s * .45, s, s * .9, r[0], S2 + ' rx="' + n1(s * .3) + '"') }
    });
    return o;
  };

  /* 깃발 줄: p.shapes = 깃발마다 모양('?'는 지워진 칸), p.sc = 모양 색 */
  ART.A.cpFlags = function (w, h, p) {
    var sh = p.shapes || [], n = Math.max(1, sh.length), gap = (w - 20) / n, o = '';
    o += R(0, 0, 10, h, '#8B5A2B', ' rx="3"') + R(w - 10, 0, 10, h, '#8B5A2B', ' rx="3"');
    o += '<path d="M8 12Q' + n1(w / 2) + ' 34 ' + n1(w - 8) + ' 12" fill="none" stroke="' + INK + '" stroke-width="2.5"/>';
    var BG = ['#FFF6DC', '#E4F2DA', '#DDEFF7'];
    sh.forEach(function (k, i) {
      var x = 10 + gap * i, t = i / (n - 1 || 1), y = 12 + 22 * 4 * t * (1 - t) * .9, fw = gap * .86, fh = Math.min(h - y - 4, fw * 1.25);
      o += '<path d="M' + n1(x + gap * .07) + ' ' + n1(y) + 'H' + n1(x + gap * .07 + fw) + 'L' + n1(x + gap * .07 + fw / 2) + ' ' + n1(y + fh) + 'Z" fill="' + BG[i % 3] + '"' + S2 + '/>';
      var cx = x + gap * .07 + fw / 2, cy = y + fh * .34, r = Math.min(fw * .24, fh * .2);
      o += k === '?' ? T(cx, cy + r * .7, '?', r * 2.2, '#C8402F') : ART.shape(k, cx, cy, r, p.sc ? c(p.sc[i]) : INK);
    });
    return o;
  };

  /* 낚싯대 걸이: p.rods = [{c, L}] — 왼쪽 기둥에서 같은 곳부터 시작, L칸 길이(단위는 보이지 않음). 오른쪽 아래 구석은 비워 둠 */
  ART.A.cpRods = function (w, h, p) {
    var rods = p.rods || [], n = Math.max(1, rods.length), unit = (w - 80) / 10, o = R(0, 0, w, h, '#EAF4E2', STK + ' rx="8"');
    o += R(14, 10, 16, h - 20, '#8B5A2B', S2 + ' rx="3"');
    rods.forEach(function (r, i) {
      var y = 28 + i * (h - 50) / n, L = r.L * unit, f = c(r.c);
      o += R(30, y - 9, 22, 18, '#3A3F48', ' rx="5"');
      o += '<line x1="52" y1="' + n1(y) + '" x2="' + n1(52 + L) + '" y2="' + n1(y) + '" stroke="' + INK + '" stroke-width="11" stroke-linecap="round"/>';
      o += '<line x1="52" y1="' + n1(y) + '" x2="' + n1(52 + L) + '" y2="' + n1(y) + '" stroke="' + f + '" stroke-width="7" stroke-linecap="round"/>';
      o += '<circle cx="' + n1(52 + L) + '" cy="' + n1(y) + '" r="4" fill="#C8CDD3"' + S2.replace('2"', '1.2"') + '/>';
    });
    return o;
  };

  /* 개울 징검다리: 물줄기 위 돌 다섯, 가운데 세 돌에 모양 자리(닫힘 '?', 열림 p.ans 모양) */
  ART.A.cpStones = function (w, h, p, open) {
    var o = R(0, h * .25, w, h * .5, '#6CC3EA', STK + ' rx="18"');
    for (var k = 0; k < 6; k++) o += '<path d="M' + n1(20 + k * w / 6) + ' ' + n1(h * .36 + (k % 2) * h * .2) + 'q14 -8 28 0t28 0" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/>';
    var ans = p.ans || [];
    for (var i = 0; i < 5; i++) {
      var cx = w * (.1 + i * .2), cy = h * (.5 + (i % 2 ? .1 : -.1)), rx = w * .085, ry = h * .14;
      o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy) + '" rx="' + n1(rx) + '" ry="' + n1(ry) + '" fill="#A9A49A"' + STK + '/>';
      if (i >= 1 && i <= 3) o += open && ans[i - 1] ? ART.shape(ans[i - 1], cx, cy, ry * .55, '#3A2C22') : T(cx, cy + ry * .4, '?', ry * 1.1, '#C8402F');
    }
    o += R(0, h * .03, w * .3, h * .16, '#8B5A2B', S2 + ' rx="5"') + T(w * .15, h * .15, '개울가', h * .1, '#fff');
    o += R(w * .7, h * .81, w * .3, h * .16, '#8B5A2B', S2 + ' rx="5"') + T(w * .85, h * .93, '오두막', h * .1, '#fff');
    return o;
  };

  /* 개울 웅덩이: 닫힘 = 물속에 반짝이는 열쇠, 열림 = 열쇠를 건져 내 빈 바닥 */
  ART.A.cpPool = function (w, h, p, open) {
    var o = '<ellipse cx="' + n1(w / 2) + '" cy="' + n1(h * .58) + '" rx="' + n1(w * .48) + '" ry="' + n1(h * .4) + '" fill="#4FA3C9"' + STK + '/>';
    o += '<ellipse cx="' + n1(w / 2) + '" cy="' + n1(h * .62) + '" rx="' + n1(w * .36) + '" ry="' + n1(h * .26) + '" fill="#3B87AC"/>';
    for (var i = 0; i < 4; i++) o += '<circle cx="' + n1(w * (.12 + i * .06)) + '" cy="' + n1(h * (.8 - (i % 2) * .06)) + '" r="' + n1(h * .05) + '" fill="#9A938A"' + S2.replace('2"', '1.5"') + '/>';
    for (var j = 0; j < 5; j++) o += '<line x1="' + n1(w * (.82 + j * .03)) + '" y1="' + n1(h * .5) + '" x2="' + n1(w * (.8 + j * .035)) + '" y2="' + n1(h * (.02 + (j % 2) * .1)) + '" stroke="#3F7A26" stroke-width="4" stroke-linecap="round"/>';
    if (!open) {
      var kx = w * .52, ky = h * .66;
      o += '<g opacity=".9"><circle cx="' + n1(kx - 18) + '" cy="' + n1(ky) + '" r="9" fill="none" stroke="#E2B53E" stroke-width="5"/><path d="M' + n1(kx - 9) + ' ' + n1(ky) + 'H' + n1(kx + 20) + 'M' + n1(kx + 14) + ' ' + n1(ky) + 'v7M' + n1(kx + 20) + ' ' + n1(ky) + 'v5" stroke="#E2B53E" stroke-width="5" stroke-linecap="round"/></g>';
      o += '<path d="M' + n1(kx + 26) + ' ' + n1(ky - 22) + 'l4 -10l4 10l10 4l-10 4l-4 10l-4 -10l-10 -4z" fill="#FFF6C8"/>';
    }
    o += '<path d="M' + n1(w * .25) + ' ' + n1(h * .45) + 'q20 -8 40 0M' + n1(w * .55) + ' ' + n1(h * .4) + 'q20 -8 40 0" fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"/>';
    return o;
  };

  /* 장작 더미: p.rows = 아래 줄부터 장작 수 [5, 4, 3] */
  ART.A.cpWood = function (w, h, p) {
    var rows = p.rows || [5, 4, 3], base = rows[0], r = Math.min((w - 20) / base / 2, (h - 10) / rows.length / 1.85), o = '';
    rows.forEach(function (n, i) {
      var cy = h - 6 - r - i * r * 1.75, x0 = w / 2 - (n - 1) * r;
      for (var j = 0; j < n; j++) { var cx = x0 + j * r * 2; o += '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(r - 1) + '" fill="#C98E52"' + STK + '/><circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(r * .55) + '" fill="none" stroke="#8B5A2B" stroke-width="2"/><circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(r * .2) + '" fill="#8B5A2B"/>' }
    });
    return o;
  };

  /* 숲 나무(꾸밈) */
  ART.A.cpTree = function (w, h) {
    return R(w * .42, h * .65, w * .16, h * .35, '#7A4A22', S2) + '<path d="M' + n1(w / 2) + ' 0L' + n1(w * .92) + ' ' + n1(h * .45) + 'H' + n1(w * .08) + 'Z M' + n1(w / 2) + ' ' + n1(h * .2) + 'L' + n1(w) + ' ' + n1(h * .7) + 'H0Z" fill="#3F7A26"' + S2 + '/>';
  };
})();
