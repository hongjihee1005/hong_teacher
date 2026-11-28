/* 수학 방탈출 · 공항 그림 (2026-11-28) — 이름 앞글자 ap. art.js의 ART.c·ART.shape·ART.esc를 씀.
   개수를 세는 그림(기내식 상자)·그래프·각은 p로 받은 값 그대로 그림. */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape, F = ART.fx, E2 = function (k, w) { return F.edge(k, w || 1.8) };
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function emw(s) { var n = 0; String(s).split('').forEach(function (ch) { n += ch === ' ' ? .3 : /[가-힣]/.test(ch) ? 1.08 : .6 }); return n }
  function T(x, y, s, size, f, o, anc) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="' + (anc || 'middle') + '" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  var K = ' stroke="#2A2233" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#2A2233" stroke-width="2" stroke-linejoin="round"';
  function plane(cx, cy, s, f) { return '<g transform="translate(' + cx + ' ' + cy + ') scale(' + s / 40 + ')"><path d="M-36 0Q-36 -5 -30 -5H24L36 -16H42L34 -3Q40 0 34 3L42 16H36L24 5H-30Q-36 5 -36 0Z" fill="' + f + '"/><path d="M-6 -4L8 -26H16L10 -4ZM-6 4L8 26H16L10 4Z" fill="' + f + '"/></g>' }

  /* 출발 안내 전광판: p.rows=[[편명, 가는 곳, 출발, 도착, 탑승구]] */
  ART.A.apFids = function (w, h, p) {
    var rows = p.rows || [], head = ['편명', '가는 곳', '출발', '도착', '탑승구'], cw = [.22, .22, .18, .18, .2], o = F.drop(R(0, 0, w, h, '#000', ' rx="8"'), 4, 7, .25) + R(0, 0, w, h, F.mat('metal', '#2B2F36'), E2('#4A5058') + ' rx="8"') + R(8, 8, w - 16, h - 16, F.mat('screen', '#101820'), ' rx="4"');
    var rh = (h - 20) / (rows.length + 1.4), fs = Math.min(rh * .48, (w - 20) / 24), x = 10;
    o += R(10, 10, w - 20, rh * 1.2, F.mat('plastic', '#F2C230'), ' rx="3"');
    head.forEach(function (s, i) { o += T(x + (w - 20) * cw[i] / 2, 10 + rh * .82, s, fs * .9, '#2A2233'); x += (w - 20) * cw[i] });
    rows.forEach(function (r, j) {
      var y = 10 + rh * (1.4 + j); x = 10;
      o += L(14, y + rh, w - 14, y + rh, '#3A3F48', 1.5);
      r.forEach(function (s, i) { o += T(x + (w - 20) * cw[i] / 2, y + rh * .7, s, fs, i === 0 ? '#7CD6F2' : '#FFE9A0'); x += (w - 20) * cw[i] });
    });
    return o + F.glassHL(8, 8, w - 16, h - 16, .06);
  };

  /* 항공사 광고판: p.items=[{c, nm, n}] 손님 수(글) */
  ART.A.apAds = function (w, h, p) {
    var it = p.items || [], top = p.title ? h * .2 : 10, o = F.drop(R(0, 0, w, h, '#000', ' rx="6"'), 4, 7, .22) + R(0, 0, w, h, F.lin([[0, '#FFFFFF'], [1, '#F1ECDC']]), E2('#C9C2B0', 1.6) + ' rx="6"'), rh = (h - top - 8) / Math.max(1, it.length);
    if (p.title) o += T(w / 2, top * .7, p.title, Math.min(top * .48, 20, (w - 20) / emw(p.title)), '#2A2233');
    var fs = Math.min(rh * .42, w / 15);
    it.forEach(function (a, i) {
      var y = top + i * rh;
      o += R(10, y + rh * .1, w - 20, rh * .8, F.lin([[0, '#FAF8F2'], [1, '#ECE7DA']]), ' rx="5"') + R(10, y + rh * .1, rh * 1.1, rh * .8, F.mat('paint', c(a.c)), E2(c(a.c), 1.2) + ' rx="5"') + plane(10 + rh * .55, y + rh * .5, rh * .32, '#fff');
      o += T(16 + rh * 1.1, y + rh * .63, a.nm, fs * .9, '#2A2233', '', 'start') + T(w - 16, y + rh * .63, a.n + '명', fs, '#C8402F', '', 'end');
    });
    return o;
  };

  /* 수하물 저울 두 대: p.bags=['14.85', '9.67'] (kg) */
  ART.A.apScale = function (w, h, p) {
    var b = p.bags || [], n = Math.max(1, b.length), bw = w / n, o = '', col = ['#E5534B', '#3B6FD6', '#3DA35D'];
    b.forEach(function (v, i) {
      var x = i * bw + bw * .08, sw = bw * .84;
      o += F.ground(x + sw / 2, h, sw * .5, 6) + R(x, h * .78, sw, h * .14, F.mat('metal', '#8A929C'), E2('#8A929C') + ' rx="4"') + R(x + sw * .35, h * .92, sw * .3, h * .08, F.mat('cyl', '#6E7580'));
      o += F.ground(x + sw / 2, h * .78, sw * .38, 4) + R(x + sw * .15, h * .3, sw * .7, h * .48, F.mat('plastic', col[i % 3]), E2(col[i % 3]) + ' rx="10"') + P('M' + (x + sw * .38) + ' ' + h * .3 + 'V' + h * .2 + 'H' + (x + sw * .62) + 'V' + h * .3, 'none', ' stroke="#3A3F48" stroke-width="5" stroke-linejoin="round"');
      o += L(x + sw * .3, h * .36, x + sw * .3, h * .72, '#000', 3, ' opacity=".2"') + L(x + sw * .7, h * .36, x + sw * .7, h * .72, '#000', 3, ' opacity=".2"');
      o += R(x + sw * .1, h * .01, sw * .8, h * .16, F.mat('screen', '#14181E'), E2('#4A5058', 1.4) + ' rx="4"') + T(x + sw / 2, h * .13, v + ' kg', Math.min(h * .11, sw * .17), '#7CF29B');
    });
    return o;
  };

  /* 탑승 수속 카운터 */
  ART.A.apCounter = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .54, 8) + F.box(0, h * .4, w, h * .6, '#E8E3D8', 'paint', 6, 1.8) + F.shade(w * .8, h * .4, w * .2, h * .6, 6, .18) + F.box(-6, h * .34, w + 12, h * .08, '#3B6FD6', 'plastic', 4, 1.6);
    o += R(w * .55, h * .02, w * .36, h * .3, F.mat('metal', '#3A3F48'), E2('#3A3F48', 1.4) + ' rx="5"') + R(w * .58, h * .05, w * .3, h * .22, F.mat('screen', open ? '#1E5A3A' : '#14181E'), ' rx="3"') + F.glassHL(w * .58, h * .05, w * .3, h * .22, .1) + T(w * .73, h * .2, open ? '수속 완료' : '무게 확인', Math.min(h * .08, w * .06), open ? '#7CF29B' : '#FFC94A');
    o += R(w * .1, h * .55, w * .8, h * .14, F.mat('paint', '#3B6FD6'), ' rx="4"') + T(w / 2, h * .65, '탑승 수속', Math.min(h * .1, w * .08), '#fff');
    if (open) o += R(w * .12, h * .14, w * .32, h * .18, F.mat('paper', '#FFE27A'), E2('#D9B84A', 1.3) + ' rx="3"') + L(w * .16, h * .21, w * .4, h * .21, '#8A6A2A', 2) + L(w * .16, h * .26, w * .34, h * .26, '#8A6A2A', 2);
    return o;
  };

  /* 대기 의자 줄 */
  ART.A.apChairs = function (w, h) {
    var o = F.ground(w / 2, h, w * .52, 7) + R(0, h * .62, w, h * .1, F.mat('metal', '#8A929C'), E2('#8A929C', 1.4) + ' rx="3"'), n = 4, cw = w / n;
    for (var i = 0; i < n; i++) o += R(i * cw + 6, h * .08, cw - 12, h * .5, F.mat('cloth', '#5B7FB8'), E2('#5B7FB8') + ' rx="10"') + F.gloss(i * cw + 8, h * .08 + 2, cw - 16, h * .1, 8, .3) + R(i * cw + 4, h * .48, cw - 8, h * .16, F.mat('cloth', '#6C90C9'), E2('#6C90C9', 1.5) + ' rx="6"');
    o += R(w * .08, h * .72, 12, h * .28, F.mat('cyl', '#6E7580')) + R(w * .92 - 12, h * .72, 12, h * .28, F.mat('cyl', '#6E7580'));
    return o;
  };

  /* 보안 검색대(문 모양 탐지기 + 짐 벨트) */
  ART.A.apSecurity = function (w, h, p, open) {
    var o = F.ground(w / 2, h * .87, w * .5, 7) + R(w * .05, h * .75, w * .9, h * .12, F.mat('metal', '#4A5160'), E2('#4A5160') + ' rx="6"') + R(w * .08, h * .77, w * .84, 3, '#fff', ' opacity=".25" rx="1.5"');
    o += R(w * .2, h * .05, w * .6, h * .78, 'none', ' stroke="#9AA3AE" stroke-width="' + w * .09 + '"') + R(w * .2 - w * .045, h * .05 - w * .045, w * .6 + w * .09, h * .78 + w * .09, 'none', ' stroke="#DCE1E6" stroke-opacity=".6" stroke-width="' + w * .025 + '"') + R(w * .2, h * .05, w * .6, h * .78, 'none', E2('#9AA3AE', 1.6));
    o += R(w * .3, h * .1, w * .4, h * .1, F.mat('plastic', open ? '#7CF29B' : '#E5534B'), ' rx="4"') + T(w / 2, h * .175, open ? '통과' : '멈춤', Math.min(h * .07, w * .1), '#2A2233');
    o += R(w * .25, -h * .02 - 26, w * .5, 28, F.mat('paint', '#2E7D5B'), E2('#2E7D5B', 1.3) + ' rx="5"') + T(w / 2, -h * .02 - 6, '보안 검색', 17, '#fff');
    o += R(w * .7, h * .38, w * .16, h * .14, F.mat('metal', '#3A3F48'), E2('#3A3F48', 1.3) + ' rx="3"') + R(w * .73, h * .42, w * .1, h * .05, F.mat('plastic', '#F2C230'));
    return o;
  };

  /* 막대그래프: p.labels, p.vals, p.max, p.step(눈금 한 칸), p.lab(수 적는 간격), p.title, p.unit */
  function graph(w, h, p, line) {
    var lb = p.labels || [], v = p.vals || [], mx = p.max || 100, st = p.step || 10, lab = p.lab || st * 2;
    var o = F.drop(R(0, 0, w, h, '#000', ' rx="6"'), 4, 7, .22) + R(0, 0, w, h, F.lin([[0, '#FFFFFF'], [1, '#F3EEDF']]), E2('#C9C2B0', 1.6) + ' rx="6"'), top = p.title ? h * .16 : 12, gx = w * .16, gw = w - gx - 14, gy = top + (p.unit ? 20 : 10), gh = h - gy - h * .14;
    if (p.title) o += T(w / 2, top * .75, p.title, Math.min(top * .5, 20, (w - 20) / emw(p.title)), '#2A2233');
    for (var k = 0; k <= mx; k += st) {
      var y = gy + gh - gh * k / mx, big = k % lab === 0;
      o += L(gx, y, gx + gw, y, big ? '#9AA3AE' : '#D9DEE4', big ? 1.6 : 1);
      if (big) o += T(gx - 6, y + 5, k, Math.min(14, h * .06), '#2A2233', '', 'end');
    }
    o += L(gx, gy, gx, gy + gh, '#2A2233', 2) + L(gx, gy + gh, gx + gw, gy + gh, '#2A2233', 2);
    if (p.unit) o += T(gx + gw, gy - 6, '(단위: ' + p.unit + ')', Math.min(12, h * .05), '#6A6355', '', 'end');
    var n = lb.length, cw = gw / Math.max(1, n), pts = [];
    lb.forEach(function (s, i) {
      var cx = gx + cw * (i + .5), y = gy + gh - gh * v[i] / mx;
      o += T(cx, gy + gh + h * .09, s, Math.min(15, cw * .32, h * .065), '#2A2233');
      if (line) pts.push(cx + ' ' + y); else o += R(cx - cw * .28, y, cw * .56, gy + gh - y, F.mat('cyl', '#6CC3EA'), E2('#6CC3EA', 1.4));
    });
    if (line) { o += '<path d="M' + pts.join('L') + '" fill="none" stroke="#C8402F" stroke-width="3"/>'; pts.forEach(function (q) { var a = q.split(' '); o += C(a[0], a[1], 5, '#C8402F', ' stroke="#fff" stroke-width="2"') }) }
    return o;
  }
  ART.A.apBars = function (w, h, p) { return graph(w, h, p, false) };

  /* 탑승구 안내 데스크 */
  ART.A.apDesk = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .54, 8) + F.box(0, h * .35, w, h * .65, '#D9C7A8', 'wood', 8, 1.8) + F.shade(w * .8, h * .35, w * .2, h * .65, 8, .18) + R(-4, h * .3, w + 8, h * .08, F.mat('wood', '#8A6A4A'), E2('#8A6A4A', 1.5) + ' rx="3"');
    o += R(w * .1, h * .02, w * .44, h * .26, F.mat('metal', '#3A3F48'), E2('#3A3F48', 1.4) + ' rx="4"') + R(w * .13, h * .05, w * .38, h * .18, F.mat('screen', open ? '#1E5A3A' : '#14181E')) + F.glassHL(w * .13, h * .05, w * .38, h * .18, .1) + T(w * .32, h * .17, open ? '탑승 시작' : '줄 수 확인', Math.min(h * .08, w * .065), open ? '#7CF29B' : '#FFC94A');
    o += R(w * .62, h * .1, w * .3, h * .2, F.mat('plastic', '#F2C230'), E2('#F2C230', 1.4) + ' rx="4"') + T(w * .77, h * .23, '안내', Math.min(h * .09, w * .08), '#2A2233');
    o += R(w * .15, h * .5, w * .7, h * .16, '#fff', ' rx="4" opacity=".75"') + T(w / 2, h * .61, '탑승구 안내', Math.min(h * .1, w * .08), '#2A2233');
    return o;
  };

  /* 기내식 수레: p.rows × p.cols 상자, 위에 p.label */
  ART.A.apCart = function (w, h, p, open) {
    var rows = p.rows || 3, cols = p.cols || 4, o = F.ground(w / 2, h, w * .5, 7) + R(0, h * .16, w, h * .72, F.mat('metal', '#B8BEC6'), E2('#8A929C') + ' rx="8"'), cw = (w - 20) / cols, ch = (h * .72 - 20) / rows;
    o += R(w * .08, 0, w * .84, h * .14, F.mat('paper', '#FFFDF4'), E2('#C9C2B0', 1.4) + ' rx="4"') + T(w / 2, h * .1, p.label || '', Math.min(h * .075, w / ((p.label || ' ').length * .95)), '#2A2233');
    for (var r = 0; r < rows; r++) {
      o += L(6, h * .16 + 10 + (r + 1) * ch, w - 6, h * .16 + 10 + (r + 1) * ch, '#5E6670', 3);
      for (var q = 0; q < cols; q++) { var x = 10 + q * cw, y = h * .16 + 10 + r * ch; o += R(x + cw * .1, y + ch * .18, cw * .8, ch * .78, F.mat('paper', '#F2A65A'), E2('#F2A65A', 1.3) + ' rx="3"') + R(x + cw * .3, y + ch * .4, cw * .4, ch * .2, '#fff', ' opacity=".8" rx="2"') }
    }
    o += C(w * .18, h * .94, h * .06, F.ball('#3A3F48')) + C(w * .82, h * .94, h * .06, F.ball('#3A3F48'));
    return o;
  };

  /* 각 그림: 안쪽 각 a(모르는 각은 null) — 변 방향을 돌려 가며 닫힌 도형을 만듦 */
  function poly(ang) {
    var n = ang.length, sum = 0, i;
    for (i = 0; i < n; i++) if (ang[i] != null) sum += ang[i];
    var real = ang.map(function (a) { return a == null ? 180 * (n - 2) - sum : a });
    var dirs = [0]; for (i = 1; i < n; i++) dirs.push(dirs[i - 1] + 180 - real[i]);
    var u = dirs.map(function (d) { return [Math.cos(d * Math.PI / 180), Math.sin(d * Math.PI / 180)] }), len = u.map(function () { return 1 });
    var bx = 0, by = 0; for (i = 1; i < n - 1; i++) { bx -= u[i][0]; by -= u[i][1] }
    var a0 = u[0], an = u[n - 1], det = a0[0] * an[1] - a0[1] * an[0];
    len[0] = (bx * an[1] - by * an[0]) / det; len[n - 1] = (a0[0] * by - a0[1] * bx) / det;
    var pts = [[0, 0]]; for (i = 0; i < n - 1; i++) pts.push([pts[i][0] + u[i][0] * len[i], pts[i][1] - u[i][1] * len[i]]);
    return { pts: pts, real: real };
  }
  function angFig(ang, x, y, w, h, fs) {
    var g = poly(ang), pts = g.pts, xs = pts.map(function (q) { return q[0] }), ys = pts.map(function (q) { return q[1] });
    var mnx = Math.min.apply(0, xs), mxx = Math.max.apply(0, xs), mny = Math.min.apply(0, ys), mxy = Math.max.apply(0, ys), s = Math.min((w - fs * 1.2) / (mxx - mnx), (h - fs * 1.2) / (mxy - mny));
    var P2 = pts.map(function (q) { return [x + fs * .6 + (q[0] - mnx) * s + ((w - fs * 1.2) - (mxx - mnx) * s) / 2, y + fs * .6 + (q[1] - mny) * s + ((h - fs * 1.2) - (mxy - mny) * s) / 2] });
    var o = '<path d="M' + P2.map(function (q) { return q[0].toFixed(1) + ' ' + q[1].toFixed(1) }).join('L') + 'Z" fill="' + F.mat('paper', '#FFF8E2') + '" stroke="#5A4A3A" stroke-width="2.5" stroke-linejoin="round"/>';
    var cx = 0, cy = 0; P2.forEach(function (q) { cx += q[0]; cy += q[1] }); cx /= P2.length; cy /= P2.length;
    P2.forEach(function (q, i) {
      var dx = cx - q[0], dy = cy - q[1], d = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(d * .6, fs * 2.6);
      o += T(q[0] + dx / d * k, q[1] + dy / d * k + fs * .35, ang[i] == null ? '?' : ang[i] + '°', fs, ang[i] == null ? '#C8402F' : '#2A2233');
    });
    return o;
  }
  /* 관제 콘솔: p.btns=[{s, ang}] 모양 단추마다 도형 그림 */
  ART.A.apConsole = function (w, h, p, open) {
    var b = p.btns || [], o = F.ground(w / 2, h, w * .52, 8) + R(0, 0, w, h, F.mat('metal', '#3A4250'), E2('#5A6478') + ' rx="10"'), bw = (w - 16) / Math.max(1, b.length);
    o += R(8, 6, w - 16, h * .12, F.mat('screen', '#101820'), ' rx="4"') + T(w / 2, 6 + h * .09, open ? '관제 화면 켜짐' : '모르는 각 확인', Math.min(h * .075, w * .04), open ? '#7CF29B' : '#FFC94A');
    b.forEach(function (it, i) {
      var x = 8 + bw * i, fh = h * .62, fs = Math.min(bw * .105, fh * .1);
      o += R(x + 4, h * .17, bw - 8, fh, F.lin([[0, '#FFFFFF'], [1, '#F1ECDC']]), ' rx="6"') + angFig(it.ang, x + 6, h * .17 + 2, bw - 12, fh - 4, fs);
      o += C(x + bw / 2, h * .9, Math.min(bw * .2, h * .08), F.ball('#E8E3D8'), E2('#9AA2AC', 1.4)) + shape(it.s, x + bw / 2, h * .9, Math.min(bw * .12, h * .05), '#2A2233');
    });
    return o;
  };

  /* 레이더 화면(꾸밈) */
  ART.A.apRadar = function (w, h) {
    var r = Math.min(w, h) / 2 - 8, cx = w / 2, cy = h / 2, o = R(0, 0, w, h, F.mat('metal', '#2B2F36'), E2('#4A5058') + ' rx="8"') + C(cx, cy, r, F.rad([[0, '#1A4A30'], [1, '#081A10']]), ' stroke="#3DA35D" stroke-width="2"');
    o += C(cx, cy, r * .66, 'none', ' stroke="#3DA35D" stroke-width="1.5"') + C(cx, cy, r * .33, 'none', ' stroke="#3DA35D" stroke-width="1.5"') + L(cx - r, cy, cx + r, cy, '#3DA35D', 1.5) + L(cx, cy - r, cx, cy + r, '#3DA35D', 1.5);
    o += P('M' + cx + ' ' + cy + 'L' + (cx + r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 0 0 ' + (cx + r * .71) + ' ' + (cy - r * .71) + 'Z', '#7CF29B', ' opacity=".35"');
    o += C(cx + r * .4, cy - r * .3, 4, '#7CF29B') + C(cx - r * .5, cy + r * .2, 4, '#7CF29B') + C(cx + r * .1, cy + r * .6, 4, '#7CF29B');
    return o + F.glassHL(cx - r * .8, cy - r * .8, r * 1.6, r * 1.6, .07);
  };

  /* 관제 무전기(방향 단추) */
  ART.A.apRadio = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .52, 7) + F.box(0, h * .3, w, h * .7, '#5A5F68', 'metal', 10, 1.8) + R(w * .08, h * .36, w * .5, h * .3, F.mat('screen', open ? '#1E5A3A' : '#14181E'), E2('#3A3F48', 1.4) + ' rx="4"') + F.glassHL(w * .08, h * .36, w * .5, h * .3, .1);
    o += T(w * .33, h * .55, open ? '이륙 허가' : '길 안내', Math.min(h * .08, w * .08), open ? '#7CF29B' : '#FFC94A');
    var ax = w * .8, ay = h * .55, s = Math.min(w, h) * .07;
    o += ['↑', '→', '↓', '←'].map(function (d, i) { var dx = [0, 1, 0, -1][i], dy = [-1, 0, 1, 0][i]; return R(ax + dx * s * 1.9 - s * .9, ay + dy * s * 1.9 - s * .9, s * 1.8, s * 1.8, F.mat('plastic', '#E8E3D8'), E2('#9AA2AC', 1.4) + ' rx="4"') + ART.arrow(d, ax + dx * s * 1.9, ay + dy * s * 1.9, s * .7) }).join('');
    o += P('M' + w * .2 + ' ' + h * .28 + 'Q' + w * .35 + ' ' + (-h * .02) + ' ' + w * .5 + ' ' + h * .28, 'none', ' stroke="#2E3238" stroke-width="8" stroke-linecap="round"') + R(w * .14, h * .2, w * .1, h * .14, F.mat('plastic', '#3A3F48'), ' rx="5"') + R(w * .46, h * .2, w * .1, h * .14, F.mat('plastic', '#3A3F48'), ' rx="5"');
    o += R(w * .1, h * .76, w * .8, h * .14, F.pat('stripe', '#3A3F48', 60), ' rx="4"') + C(w * .2, h * .83, h * .04, F.ball(open ? '#7CF29B' : '#E5534B'));
    return o;
  };
})();
