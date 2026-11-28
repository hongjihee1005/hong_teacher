/* 수학 방탈출 · 서커스 그림 (2026-11-28) — 이름 앞글자 cr. art.js의 ART.c·ART.shape·ART.esc를 씀.
   개수를 세는 그림(깃발·별·전구)과 각도·그래프·눈금은 p로 받은 값 그대로 그림. */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape;
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o, anc) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="' + (anc || 'middle') + '" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  var K = ' stroke="#2A2233" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#2A2233" stroke-width="2" stroke-linejoin="round"';
  var FC = ['#E5534B', '#F2C230', '#3B6FD6', '#3DA35D'];

  /* 깃발 줄: p.n개 세모 깃발, 깃발마다 별 p.s개 */
  ART.A.crFlags = function (w, h, p) {
    var n = p.n || 8, s = p.s || 3, fw = w / n, o = P('M0 ' + h * .08 + 'Q' + w / 2 + ' ' + h * .3 + ' ' + w + ' ' + h * .08, 'none', ' stroke="#5A4030" stroke-width="3"');
    for (var i = 0; i < n; i++) {
      var x = i * fw, t = (i + .5) / n, top = h * .08 + (h * .22) * 4 * t * (1 - t) * .5 + 2;
      o += P('M' + (x + fw * .08) + ' ' + top + 'H' + (x + fw * .92) + 'L' + (x + fw / 2) + ' ' + (h - 2) + 'Z', FC[i % 4], K2);
      var rr = Math.min(fw * .12, (h - top) * .1);
      for (var k = 0; k < s; k++) {
        var sx = s === 1 ? x + fw / 2 : x + fw * (.3 + .4 * k / (s - 1)), sy = top + (h - top) * (k === 1 && s === 3 ? .5 : .24);
        if (s === 3 && k === 1) sx = x + fw / 2;
        o += shape('☆', sx, sy, rr, '#fff');
      }
    }
    return o;
  };

  /* 인간 대포 + 각도기: 대포가 오른쪽 바닥선에서 p.a도 기울어짐(눈금 5°, 숫자 10°마다) */
  ART.A.crCannon = function (w, h, p) {
    var px = w * .5, py = h * .78, R0 = Math.min(w * .46, h * .72), o = '';
    o += P('M' + (px - R0) + ' ' + py + 'A' + R0 + ' ' + R0 + ' 0 0 1 ' + (px + R0) + ' ' + py + 'Z', '#FFFDF4', ' stroke="#2A2233" stroke-width="2" opacity=".93"');
    for (var d = 0; d <= 180; d += 5) {
      var r1 = R0 * (d % 10 ? .93 : .88), q = d * Math.PI / 180;
      o += L(px + Math.cos(q) * R0, py - Math.sin(q) * R0, px + Math.cos(q) * r1, py - Math.sin(q) * r1, '#2A2233', d % 10 ? 1 : 1.8);
      if (d % 10 === 0) o += T(px + Math.cos(q) * R0 * .78, py - Math.sin(q) * R0 * .78 + R0 * .03, d, R0 * .065, '#3A3F48');
    }
    o += L(px - R0, py, px + R0, py, '#3B6FD6', 3);
    var bl = R0 * .58, bw = R0 * .17, q0 = (p.a || 45) * Math.PI / 180;
    o += L(px, py, px + Math.cos(q0) * R0 * .97, py - Math.sin(q0) * R0 * .97, '#C8402F', 2.5, ' stroke-dasharray="6 4"');
    o += '<g transform="translate(' + px + ' ' + py + ') rotate(' + (-p.a || -45) + ')">' + R(0, -bw / 2, bl, bw, '#C8402F', K + ' rx="' + bw * .3 + '"') + R(bl - bw * .3, -bw * .62, bw * .4, bw * 1.24, '#8A2A20', K2 + ' rx="4"') + R(bl * .3, -bw / 2, bw * .25, bw, '#F2C230') + '</g>';
    o += C(px, py, R0 * .12, '#5A4030', K) + C(px, py, R0 * .04, '#F2C230');
    o += C(px - R0 * .18, h * .9, h * .08, '#5A4030', K2) + C(px + R0 * .18, h * .9, h * .08, '#5A4030', K2);
    return o;
  };

  /* 광대 물통 4개: p.items=[{c, t}] 통 앞에 계산식 */
  function fr(cx, cy, a, b, fs, f) { return T(cx, cy - fs * .25, a, fs, f) + L(cx - fs * .42, cy, cx + fs * .42, cy, f, Math.max(1.5, fs * .09)) + T(cx, cy + fs * .95, b, fs, f) }
  ART.A.crBuckets = function (w, h, p) {
    var it = p.items || [], n = Math.max(1, it.length), bw = w / n, o = '';
    it.forEach(function (b, i) {
      var x = i * bw + bw * .1, ww = bw * .8, fs = Math.min(h * .15, ww * .29), cy = h * .5, cx = x + ww / 2;
      o += P('M' + x + ' ' + h * .18 + 'H' + (x + ww) + 'L' + (x + ww * .88) + ' ' + h * .96 + 'H' + (x + ww * .12) + 'Z', c(b.c), K);
      o += P('M' + (x + ww * .1) + ' ' + h * .18 + 'Q' + (x + ww / 2) + ' ' + (-h * .06) + ' ' + (x + ww * .9) + ' ' + h * .18, 'none', ' stroke="#6E7580" stroke-width="3"');
      o += R(x + ww * .04, h * .3, ww * .92, h * .5, '#FFFDF4', ' rx="5"');
      o += fr(cx - ww * .28, cy, b.a, b.d, fs, '#2A2233') + T(cx, cy + fs * .36, b.op, fs, '#C8402F') + fr(cx + ww * .28, cy, b.b, b.d, fs, '#2A2233');
      o += T(cx, h * .76, 'L', Math.min(h * .08, ww * .14), '#6A6355');
    });
    return o;
  };

  /* 큰 북 */
  ART.A.crDrum = function (w, h) {
    var o = '<ellipse cx="' + w / 2 + '" cy="' + h * .25 + '" rx="' + w * .46 + '" ry="' + h * .14 + '" fill="#FFFDF4"' + K + '/>';
    o += P('M' + w * .04 + ' ' + h * .25 + 'V' + h * .82 + 'A' + w * .46 + ' ' + h * .14 + ' 0 0 0 ' + w * .96 + ' ' + h * .82 + 'V' + h * .25 + 'A' + w * .46 + ' ' + h * .14 + ' 0 0 1 ' + w * .04 + ' ' + h * .25 + 'Z', '#C8402F', K);
    for (var i = 0; i < 6; i++) { var x = w * .04 + w * .92 * i / 5; o += L(x, h * .3 + (i % 5 ? h * .1 : 0), w * .04 + w * .92 * (i + .5) / 5, h * .8, '#F2C230', 3) }
    o += L(w * .7, h * .02, w * .45, h * .22, '#8A6A4A', 6, ' stroke-linecap="round"') + C(w * .72, h * .02, 7, '#FFFDF4', K2);
    return o;
  };

  /* 소품 트렁크(색 단추 4개) */
  ART.A.crTrunk = function (w, h, p, open) {
    var o = R(0, h * .35, w, h * .65, '#7A4A8A', K + ' rx="8"') + R(w * .1, h * .35, w * .06, h * .65, '#C9A24B') + R(w * .84, h * .35, w * .06, h * .65, '#C9A24B');
    o += open ? P('M0 ' + h * .35 + 'L' + w * .05 + ' 0H' + w * .95 + 'L' + w + ' ' + h * .35 + 'Z', '#8E5AA0', K) + R(6, h * .35, w - 12, h * .08, '#2A221C', ' opacity=".5"')
      : R(-4, h * .2, w + 8, h * .2, '#8E5AA0', K + ' rx="6"');
    if (!open) (p.colors || []).forEach(function (k, i, a) { o += C(w * .25 + i * w * .5 / Math.max(1, a.length - 1), h * .3, Math.min(w * .05, 9), c(k), K2) });
    if (!open) o += R(w * .38, h * .5, w * .24, h * .24, '#F2C230', K2 + ' rx="4"') + shape('☆', w / 2, h * .62, h * .08, '#C8402F');
    return o;
  };

  /* 외바퀴 자전거 */
  ART.A.crBike = function (w, h, p, open) {
    var r = Math.min(w * .4, h * .26), cx = w / 2, cy = h - r - 4, o = '';
    o += C(cx, cy, r, 'none', ' stroke="#2A2233" stroke-width="7"') + C(cx, cy, r * .14, '#F2C230', K2);
    for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; o += L(cx, cy, cx + Math.cos(a) * r * .92, cy + Math.sin(a) * r * .92, '#6E7580', 2) }
    o += L(cx, cy, cx, h * .16, '#C8402F', 7) + R(cx - w * .26, h * .08, w * .52, h * .09, '#2A2233', ' rx="8"');
    o += L(cx - r * .45, cy - r * .2, cx + r * .45, cy + r * .2, '#3A3F48', 4) + R(cx - r * .62, cy - r * .3, r * .3, r * .14, '#3A3F48', ' rx="2"') + R(cx + r * .32, cy + r * .16, r * .3, r * .14, '#3A3F48', ' rx="2"');
    if (open) o += T(cx, h * .05, '출발!', Math.min(h * .08, w * .2), '#2E7D5B');
    return o;
  };

  /* 꺾은선그래프: p.labels, p.vals, p.max, p.step, p.lab, p.title, p.unit */
  ART.A.crChart = function (w, h, p) {
    var lb = p.labels || [], v = p.vals || [], mx = p.max || 100, st = p.step || 10, lab = p.lab || st * 2;
    var o = R(0, 0, w, h, '#FFFDF4', K + ' rx="6"'), top = p.title ? h * .16 : 12, gx = w * .17, gw = w - gx - 16, gy = top + 12, gh = h - gy - h * .14;
    if (p.title) o += T(w / 2, top * .75, p.title, Math.min(top * .5, 20), '#2A2233');
    for (var k = 0; k <= mx; k += st) {
      var y = gy + gh - gh * k / mx, big = k % lab === 0;
      o += L(gx, y, gx + gw, y, big ? '#9AA3AE' : '#D9DEE4', big ? 1.6 : 1);
      if (big) o += T(gx - 6, y + 5, k, Math.min(14, h * .055), '#2A2233', '', 'end');
    }
    var n = lb.length, cw = gw / Math.max(1, n), pts = [];
    lb.forEach(function (s, i) { var cx = gx + cw * (i + .5); o += L(cx, gy, cx, gy + gh, '#ECEFF2', 1) + T(cx, gy + gh + h * .09, s, Math.min(15, cw * .4, h * .065), '#2A2233'); pts.push([cx, gy + gh - gh * v[i] / mx]) });
    o += L(gx, gy, gx, gy + gh, '#2A2233', 2) + L(gx, gy + gh, gx + gw, gy + gh, '#2A2233', 2);
    if (p.unit) o += T(gx + gw, gy - 3, '(단위: ' + p.unit + ')', Math.min(12, h * .05), '#6A6355', '', 'end');
    o += '<path d="M' + pts.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1) }).join('L') + '" fill="none" stroke="#C8402F" stroke-width="3"/>';
    pts.forEach(function (q) { o += C(q[0], q[1], 5, '#C8402F', ' stroke="#fff" stroke-width="2"') });
    return o;
  };

  /* 분장 거울: 위쪽에 전구 p.pat(모양 차례, 아래 번호) */
  ART.A.crMirror = function (w, h, p) {
    var pat = p.pat || [], n = pat.length, o = R(0, 0, w, h, '#C9A24B', K + ' rx="10"') + R(w * .06, h * .3, w * .88, h * .62, '#CFE7F3', K2 + ' rx="6"');
    o += P('M' + w * .15 + ' ' + h * .8 + 'L' + w * .35 + ' ' + h * .42 + 'M' + w * .25 + ' ' + h * .85 + 'L' + w * .42 + ' ' + h * .55, 'none', ' stroke="#fff" stroke-width="5" opacity=".7"');
    var bw = (w - 16) / Math.max(1, n), rr = Math.min(bw * .36, h * .07);
    pat.forEach(function (s, i) { var cx = 8 + bw * (i + .5); o += C(cx, h * .11, rr * 1.35, '#FFF2B0', K2) + shape(s, cx, h * .11, rr, '#C8402F') + T(cx, h * .25, i + 1, Math.min(bw * .45, h * .07), '#2A2233') });
    return o;
  };

  /* 분장 상자(서랍 달린 화장대 상자) */
  ART.A.crMakeup = function (w, h, p, open) {
    var o = R(0, h * .25, w, h * .75, '#E07DA8', K + ' rx="8"') + R(w * .06, h * .32, w * .88, h * .28, open ? '#2A221C' : '#F4A9C8', K2 + ' rx="4"') + R(w * .06, h * .66, w * .88, h * .28, '#F4A9C8', K2 + ' rx="4"');
    o += C(w / 2, h * .8, 6, '#F2C230', K2);
    o += open ? R(w * .1, h * .02, w * .8, h * .24, '#F4A9C8', K + ' rx="6"') : R(w * .42, h * .4, w * .16, h * .14, '#F2C230', K2 + ' rx="3"');
    [.2, .4, .6, .8].forEach(function (f, i) { o += C(w * f, h * .2, Math.min(w * .05, h * .07), ['#E5534B', '#FFFDF4', '#3B6FD6', '#F2C230'][i], K2) });
    return o;
  };

  /* 의상 옷장 */
  ART.A.crWardrobe = function (w, h, p, open) {
    var o = R(0, 0, w, h, '#8A5A2B', K + ' rx="6"');
    if (open) {
      o += R(8, 8, w - 16, h - 16, '#2A221C') + L(12, h * .16, w - 12, h * .16, '#C8CDD3', 4);
      ['#E5534B', '#F2C230', '#3B6FD6', '#3DA35D'].forEach(function (f, i) { var x = 18 + i * (w - 36) / 4; o += P('M' + (x + 6) + ' ' + h * .2 + 'h' + ((w - 36) / 4 - 12) + 'l6 ' + h * .5 + 'h-' + ((w - 36) / 4) + 'z', f, K2) });
      return o + P('M8 8L-' + w * .2 + ' 20V' + (h - 20) + 'L8 ' + (h - 8) + 'Z', '#A06A35', K);
    }
    o += L(w / 2, 6, w / 2, h - 6, '#2A221C', 3) + R(10, 10, w / 2 - 16, h - 20, '#A06A35', ' rx="4"') + R(w / 2 + 6, 10, w / 2 - 16, h - 20, '#A06A35', ' rx="4"');
    o += C(w / 2 - 12, h / 2, 6, '#F2C230', K2) + C(w / 2 + 12, h / 2, 6, '#F2C230', K2) + R(w * .3, h * .08, w * .4, h * .1, '#FFFDF4', ' rx="4"') + T(w / 2, h * .155, '의상', Math.min(h * .08, w * .14), '#2A2233');
    return o;
  };

  /* 코끼리 물통: 들이 p.cap L, 물 p.v mL, 눈금 p.tick mL마다(숫자는 1 L마다) */
  ART.A.crTank = function (w, h, p) {
    var cap = p.cap || 10, v = p.v || 0, tick = p.tick || 500, x = w * .2, tw = w * .5, ty = h * .08, th = h * .86, o = '';
    o += R(x, ty, tw, th, '#EAF2F7', K + ' rx="8"') + R(x + 3, ty + th - th * v / (cap * 1000), tw - 6, th * v / (cap * 1000) - 3, '#6CC3EA', ' rx="4"');
    for (var m = 0; m <= cap * 1000; m += tick) {
      var y = ty + th - th * m / (cap * 1000), big = m % 1000 === 0;
      o += L(x + tw, y, x + tw - (big ? tw * .3 : tw * .16), y, '#2A2233', big ? 2.4 : 1.4);
      if (big) o += T(x + tw + 6, y + 5, (m / 1000) + ' L', Math.min(w * .1, th / cap * .5), '#2A2233', '', 'start');
    }
    o += R(x - 6, ty - 8, tw + 12, 12, '#6E7580', ' rx="4"');
    return o;
  };

  /* 동물 마차 뒷문 + 물 펌프 */
  ART.A.crGate = function (w, h, p, open) {
    var o = R(0, 0, w * .7, h, '#9A6A3F', K + ' rx="6"');
    for (var i = 1; i < 5; i++) o += L(w * .7 * i / 5, 6, w * .7 * i / 5, h - 6, '#6E4A2A', 3);
    o += open ? R(8, 8, w * .7 - 16, h - 16, '#FFE9A8', ' opacity=".85"') + P('M8 8L-' + w * .15 + ' 24V' + (h - 24) + 'L8 ' + (h - 8) + 'Z', '#B98552', K) : R(w * .55, h * .45, w * .08, h * .1, '#F2C230', K2 + ' rx="3"');
    o += R(w * .74, h * .3, w * .24, h * .5, '#6E7580', K + ' rx="6"') + R(w * .77, h * .34, w * .18, h * .12, '#14181E', ' rx="3"') + T(w * .86, h * .43, open ? 'OK' : 'mL', Math.min(h * .07, w * .07), open ? '#7CF29B' : '#FFC94A');
    o += C(w * .86, h * .62, Math.min(w * .07, h * .07), open ? '#8A929C' : '#2A2233', K2);
    o += R(w * .8, h * .8, w * .12, h * .2, '#6E7580');
    o += R(w * .08, -24, w * .54, 28, '#2E7D5B', ' rx="6"') + T(w * .35, -4, '뒷문', 18, '#fff');
    if (!open) {
      var ex = w * .05, ey = h * .42, es = Math.min(w * .6, h * .58);
      o += '<ellipse cx="' + (ex + es * .5) + '" cy="' + (ey + es * .5) + '" rx="' + es * .4 + '" ry="' + es * .3 + '" fill="#9AA0A8"' + K + '/>';
      [.22, .38, .62, .78].forEach(function (f) { o += R(ex + es * f - es * .06, ey + es * .66, es * .12, es * .3, '#9AA0A8', K2 + ' rx="4"') });
      o += C(ex + es * .88, ey + es * .3, es * .2, '#9AA0A8', K) + '<ellipse cx="' + (ex + es * .8) + '" cy="' + (ey + es * .3) + '" rx="' + es * .1 + '" ry="' + es * .15 + '" fill="#B8BEC6"' + K2 + '/>';
      o += P('M' + (ex + es * 1.02) + ' ' + (ey + es * .38) + 'Q' + (ex + es * 1.12) + ' ' + (ey + es * .7) + ' ' + (ex + es * 1.0) + ' ' + (ey + es * .86), 'none', ' stroke="#2A2233" stroke-width="' + es * .09 + '" stroke-linecap="round"') + P('M' + (ex + es * 1.02) + ' ' + (ey + es * .38) + 'Q' + (ex + es * 1.12) + ' ' + (ey + es * .7) + ' ' + (ex + es * 1.0) + ' ' + (ey + es * .86), 'none', ' stroke="#9AA0A8" stroke-width="' + es * .06 + '" stroke-linecap="round"') + C(ex + es * .94, ey + es * .24, es * .025, '#2A2233');
    }
    return o;
  };

  /* 물개(꾸밈) */
  ART.A.crSeal = function (w, h) {
    var o = R(w * .05, h * .78, w * .9, h * .2, '#3B6FD6', K + ' rx="10"');
    o += P('M' + w * .2 + ' ' + h * .8 + 'Q' + w * .15 + ' ' + h * .35 + ' ' + w * .45 + ' ' + h * .3 + 'Q' + w * .7 + ' ' + h * .3 + ' ' + w * .75 + ' ' + h * .8 + 'Z', '#5A5F68', K);
    o += C(w * .47, h * .25, h * .14, '#5A5F68', K) + C(w * .42, h * .22, 3, '#fff') + C(w * .53, h * .22, 3, '#fff') + C(w * .47, h * .3, 4, '#2A2233');
    o += P('M' + w * .25 + ' ' + h * .62 + 'L' + w * .1 + ' ' + h * .72 + 'L' + w * .3 + ' ' + h * .72 + 'Z', '#5A5F68', K2) + C(w * .47, h * .07, h * .06, '#E5534B', K2);
    return o;
  };
})();
