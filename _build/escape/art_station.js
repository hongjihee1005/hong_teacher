/* 수학 방탈출 · 기차역 그림 (2026-11-28) — 이름 앞글자 st. art.js의 ART.c·ART.shape·ART.esc를 씀.
   개수를 세는 그림(손님 칸·바퀴)은 p로 받은 수만큼 꼭 그 수대로 그림. */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape;
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o, anc) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="' + (anc || 'middle') + '" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  var K = ' stroke="#2A2233" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#2A2233" stroke-width="2" stroke-linejoin="round"';

  /* 출발 안내판: p.rows=[[열차, 출발, 가는 곳, 승강장]] */
  ART.A.stDepart = function (w, h, p) {
    var rows = p.rows || [], head = ['열차', '출발', '가는 곳', '승강장'], cw = [.28, .22, .3, .2], o = R(0, 0, w, h, '#2B2F36', K + ' rx="8"') + R(8, 8, w - 16, h - 16, '#14181E', ' rx="4"');
    var top = 10, rh = (h - 20) / (rows.length + 1.4), fs = Math.min(rh * .5, (w - 20) / 22);
    o += R(10, top, w - 20, rh * 1.2, '#3B6FD6', ' rx="3"');
    var x = 10; head.forEach(function (s, i) { o += T(x + (w - 20) * cw[i] / 2, top + rh * .82, s, fs * .9, '#fff'); x += (w - 20) * cw[i] });
    rows.forEach(function (r, j) {
      var y = top + rh * (1.4 + j); x = 10;
      o += L(14, y + rh, w - 14, y + rh, '#3A3F48', 1.5);
      r.forEach(function (s, i) { o += T(x + (w - 20) * cw[i] / 2, y + rh * .7, s, fs, i === 0 ? '#7CF29B' : '#FFC94A'); x += (w - 20) * cw[i] });
    });
    return o;
  };

  /* 청소 진행표: p.items=[{c, den}] — 똑같이 den칸으로 나눈 막대에서 1칸만 칠함 */
  ART.A.stFrac = function (w, h, p) {
    var it = p.items || [], top = p.title ? h * .2 : 10, o = R(0, 0, w, h, '#FFFDF4', K + ' rx="6"') + C(12, 12, 5, '#C8402F');
    if (p.title) o += T(w / 2, top * .72, p.title, Math.min(top * .5, 22), '#2A2233');
    var bh = (h - top - 10) / Math.max(1, it.length), bx = 14, bw = w - 28;
    it.forEach(function (b, i) {
      var y = top + i * bh + bh * .18, hh = bh * .64, cw = bw / b.den;
      for (var k = 0; k < b.den; k++) o += R(bx + k * cw, y, cw, hh, k === 0 ? c(b.c) : '#fff', ' stroke="#2A2233" stroke-width="2"');
    });
    return o;
  };

  /* 옛 기차 바퀴 전시: p.n개를 나란히 붙여 놓음, 첫 바퀴에 반지름 p.r cm 표시 */
  ART.A.stWheels = function (w, h, p) {
    var n = p.n || 4, top = h * .2, d = Math.min((w - 20) / n, h * .55), r = d / 2, x0 = (w - d * n) / 2, cy = top + r + 2, by = cy + r - 2, o = '';
    o += R(4, by, w - 8, h - by, '#8A6A4A', K + ' rx="4"') + R(w * .25, by + (h - by) * .25, w * .5, (h - by) * .5, '#FFFDF4', ' rx="3"') + T(w / 2, by + (h - by) * .62, '옛 기차 바퀴', Math.min(15, (h - by) * .36), '#2A2233');
    for (var i = 0; i < n; i++) {
      var cx = x0 + r + i * d;
      o += C(cx, cy, r - 1, '#4A4F58', K) + C(cx, cy, r * .78, '#6E7580', K2);
      for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; o += L(cx, cy, cx + Math.cos(a) * r * .74, cy + Math.sin(a) * r * .74, '#3A3F48', 3) }
      o += C(cx, cy, r * .14, '#C9A24B', K2);
    }
    var cx0 = x0 + r, fs = Math.min(top * .62, 18);
    o += L(cx0, cy, cx0 + r - 2, cy, '#E5534B', 4) + C(cx0, cy, 4, '#E5534B') + L(cx0 + r * .5, cy - 2, cx0 + r * .5, top * .9, '#E5534B', 2);
    var lx = Math.max(4 + fs * 3.4, cx0 + r * .5);
    o += R(lx - fs * 3.4, 2, fs * 6.8, top * .86, '#FFFDF4', ' rx="4" stroke="#E5534B" stroke-width="2"') + T(lx, top * .62, '반지름 ' + p.r + ' cm', fs, '#C8402F');
    return o;
  };

  /* 대기 의자 */
  ART.A.stBench = function (w, h) {
    var o = R(w * .04, h * .1, w * .92, h * .32, '#3B6FD6', K + ' rx="8"') + R(0, h * .48, w, h * .18, '#4F82E0', K + ' rx="6"');
    for (var i = 1; i < 4; i++) o += L(w * .04 + w * .92 * i / 4, h * .12, w * .04 + w * .92 * i / 4, h * .4, '#2A4E9E', 3);
    o += R(w * .1, h * .66, 14, h * .34, '#5A5F68') + R(w * .9 - 14, h * .66, 14, h * .34, '#5A5F68') + R(w * .48, h * .66, 14, h * .34, '#5A5F68');
    return o;
  };

  /* 승차권 발매기 */
  ART.A.stKiosk = function (w, h, p, open) {
    var o = R(0, 0, w, h, '#D8DEE6', K + ' rx="10"') + R(w * .12, h * .06, w * .76, h * .07, '#3B6FD6', ' rx="3"') + T(w / 2, h * .115, '승차권', Math.min(w * .14, h * .05), '#fff');
    o += R(w * .12, h * .17, w * .76, h * .28, open ? '#1E5A3A' : '#14181E', K2 + ' rx="4"') + T(w / 2, h * .33, open ? '발매 완료' : (p.screen || '- -'), Math.min(w * .13, h * .05), open ? '#7CF29B' : '#FFC94A');
    for (var r = 0; r < 4; r++) for (var q = 0; q < 3; q++) o += R(w * .2 + q * w * .22, h * .5 + r * h * .07, w * .16, h * .05, '#fff', K2 + ' rx="3"');
    o += R(w * .2, h * .82, w * .6, h * .06, '#3A3F48', ' rx="3"');
    if (open) o += R(w * .3, h * .78, w * .4, h * .1, '#FFE27A', K2 + ' rx="2"');
    return o;
  };

  /* 개찰구 */
  ART.A.stGate = function (w, h, p, open) {
    var o = R(0, h * .3, w * .28, h * .7, '#9AA3AE', K + ' rx="8"') + R(w * .72, h * .3, w * .28, h * .7, '#9AA3AE', K + ' rx="8"');
    o += R(w * .05, h * .36, w * .18, h * .08, open ? '#7CF29B' : '#E5534B', ' rx="3"') + R(w * .77, h * .36, w * .18, h * .08, open ? '#7CF29B' : '#E5534B', ' rx="3"');
    o += R(w * .07, h * .52, w * .14, h * .05, '#2A2233', ' rx="2"');
    o += open ? R(w * .26, h * .1, 10, h * .3, '#C8CDD3', K2) + R(w * .64, h * .1, 10, h * .3, '#C8CDD3', K2) : R(w * .28, h * .5, w * .22, 10, '#C8CDD3', K2) + R(w * .5, h * .5, w * .22, 10, '#C8CDD3', K2);
    o += R(w * .2, 0, w * .6, h * .16, '#2E7D5B', ' rx="5"') + T(w / 2, h * .11, '승강장', Math.min(h * .09, w * .12), '#fff');
    return o;
  };

  /* 열차: 기관차 + 손님 칸 p.cars개(창문 2개씩) */
  ART.A.stTrain = function (w, h, p) {
    var n = p.cars || 6, u = w / (1.35 + n * 1.02), o = R(0, h * .86, w, h * .06, '#6E5A48') + L(0, h * .9, w, h * .9, '#4A3A2E', 3);
    var lx = 0, lw = u * 1.3, bh = h * .62, by = h * .2;
    o += P('M' + (lx + lw * .25) + ' ' + by + 'H' + (lx + lw) + 'V' + (by + bh) + 'H' + lx + 'V' + (by + bh * .4) + 'Q' + lx + ' ' + by + ' ' + (lx + lw * .25) + ' ' + by + 'Z', '#C8402F', K);
    o += R(lx + lw * .45, by + bh * .12, lw * .42, bh * .3, '#CFE7F3', K2 + ' rx="4"') + R(lx + lw * .2, by - bh * .18, lw * .16, bh * .2, '#3A3F48', K2) + C(lx + lw * .12, by + bh * .55, bh * .08, '#FFE27A', K2);
    o += C(lx + lw * .3, by + bh + h * .02, h * .06, '#3A3F48') + C(lx + lw * .75, by + bh + h * .02, h * .06, '#3A3F48');
    for (var i = 0; i < n; i++) {
      var x = lw + u * .02 + i * u * 1.02, cw = u * .98;
      o += R(x - u * .04, by + bh * .55, u * .06, bh * .1, '#3A3F48');
      o += R(x, by + bh * .1, cw, bh * .9, '#3B6FD6', K + ' rx="6"') + R(x, by + bh * .72, cw, bh * .08, '#F2C230');
      o += R(x + cw * .12, by + bh * .24, cw * .32, bh * .34, '#CFE7F3', K2 + ' rx="3"') + R(x + cw * .56, by + bh * .24, cw * .32, bh * .34, '#CFE7F3', K2 + ' rx="3"');
      o += C(x + cw * .25, by + bh + h * .02, h * .05, '#3A3F48') + C(x + cw * .75, by + bh + h * .02, h * .05, '#3A3F48');
    }
    return o;
  };

  /* 선로 전환기(손잡이) */
  ART.A.stLever = function (w, h, p, open) {
    var o = R(w * .1, h * .7, w * .8, h * .3, '#6E7580', K + ' rx="6"') + R(w * .15, h * .02, w * .7, h * .16, '#F2C230', K2 + ' rx="5"') + T(w / 2, h * .12, '선로 전환기', Math.min(h * .07, w * .1), '#2A2233');
    var px = w / 2, py = h * .74, a = open ? 30 : -30, rad = a * Math.PI / 180, len = h * .48;
    o += '<line x1="' + px + '" y1="' + py + '" x2="' + (px + Math.sin(rad) * len) + '" y2="' + (py - Math.cos(rad) * len) + '" stroke="#3A3F48" stroke-width="' + w * .08 + '" stroke-linecap="round"/>' + C(px + Math.sin(rad) * len, py - Math.cos(rad) * len, w * .08, '#E5534B', K2) + C(px, py, w * .1, '#8A929C', K2);
    o += R(w * .2, h * .84, w * .6, h * .08, '#14181E', ' rx="3"') + T(w / 2, h * .9, open ? '바뀜' : '대기 중', Math.min(h * .06, w * .09), open ? '#7CF29B' : '#FFC94A');
    return o;
  };

  /* 노선도: p.st=[역 이름], p.d=[사이 거리 글] */
  ART.A.stRoute = function (w, h, p) {
    var st = p.st || [], d = p.d || [], o = R(0, 0, w, h, '#FFFDF4', K + ' rx="6"'), n = st.length, x0 = w * .1, x1 = w * .9, y = h * .56;
    if (p.title) o += T(w / 2, h * .17, p.title, Math.min(h * .12, 22), '#2A2233');
    o += L(x0, y, x1, y, '#2E7D5B', 10);
    var fs = Math.min(h * .1, (x1 - x0) / Math.max(1, n - 1) / 6.2);
    st.forEach(function (s, i) { var x = x0 + (x1 - x0) * i / Math.max(1, n - 1); o += C(x, y, 11, '#fff', K) + T(x, y + h * .22, s, fs * 1.05, '#2A2233') });
    d.forEach(function (s, i) { var x = x0 + (x1 - x0) * (i + .5) / Math.max(1, n - 1); o += R(x - fs * 3.2, y - h * .2 - fs * .9, fs * 6.4, fs * 1.3, '#FFF2C6', ' rx="4"') + T(x, y - h * .2, s, fs * .95, '#C8402F') });
    return o;
  };

  /* 모양 단추 판: p.btns=[{s, t}] (모양 + 계산식) */
  ART.A.stPanel = function (w, h, p, open) {
    var b = p.btns || [], o = R(0, 0, w, h, '#4A5160', K + ' rx="10"'), bw = (w - 20) / Math.max(1, b.length);
    o += R(10, 8, w - 20, h * .16, '#14181E', ' rx="4"') + T(w / 2, 8 + h * .115, open ? '출발 준비 완료' : '모양 단추를 차례로', Math.min(h * .09, w * .05), open ? '#7CF29B' : '#FFC94A');
    b.forEach(function (it, i) {
      var cx = 10 + bw * (i + .5), cy = h * .46, r = Math.min(bw * .3, h * .17);
      o += C(cx, cy, r * 1.25, '#E8E3D8', K2) + shape(it.s, cx, cy, r * .8, '#2A2233');
      o += R(cx - bw * .44, h * .7, bw * .88, h * .2, '#FFFDF4', ' rx="4"') + T(cx, h * .84, it.t, Math.min(h * .12, bw * .2), '#2A2233');
    });
    if (open) o += R(w * .35, h * .93, w * .3, h * .06, '#7CF29B', ' rx="3"');
    return o;
  };

  /* 출발 장치(기관실 앞 계기판) */
  ART.A.stThrottle = function (w, h, p, open) {
    var o = R(0, h * .35, w, h * .65, '#5A5F68', K + ' rx="8"') + R(w * .05, h * .4, w * .9, h * .12, '#3A3F48', ' rx="4"');
    [.22, .5, .78].forEach(function (f, i) { o += C(w * f, h * .2, Math.min(w * .1, h * .15), '#FFFDF4', K2) + L(w * f, h * .2, w * f + Math.cos(-.9 - i * .7) * w * .08, h * .2 + Math.sin(-.9 - i * .7) * w * .08, '#C8402F', 3) });
    o += R(w * .2, h * .58, w * .6, h * .14, '#14181E', K2 + ' rx="4"') + T(w / 2, h * .68, open ? '출발!' : '- - - -', Math.min(h * .09, w * .1), open ? '#7CF29B' : '#FFC94A');
    o += R(w * .42, h * .78, w * .16, h * .16, '#2A2233', ' rx="4"');
    if (open) o += '<line x1="' + w / 2 + '" y1="' + h * .86 + '" x2="' + w * .7 + '" y2="' + h * .55 + '" stroke="#C9A24B" stroke-width="10" stroke-linecap="round"/>';
    return o;
  };
})();
