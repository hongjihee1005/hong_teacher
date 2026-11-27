/* 수학 방탈출 · 학교 밤 탐험 그림 (2026-11-27) — 이름 앞글자 sc. art.js의 ART.c·ART.shape·ART.esc를 씀.
   개수를 세는 그림(별·모양·공·우유·별자리)은 p로 받은 수만큼 꼭 그 수대로 그림(겹치지 않는 칸에 하나씩). */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape;
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o, anc) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="' + (anc || 'middle') + '" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  var K = ' stroke="#2A2233" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#2A2233" stroke-width="2" stroke-linejoin="round"';
  function gcd(a, b) { return b ? gcd(b, a % b) : a }
  /* n개를 cells칸 안에 골고루 섞어 놓을 자리 번호(서로 다름) */
  function spread(n, cells) { var m = 7; while (gcd(m, cells) !== 1) m++; var out = []; for (var i = 0; i < n; i++) out.push((i * m + 3) % cells); return out }

  /* 밤 창문: 달 + 별 p.n개 */
  ART.A.scWin = function (w, h, p) {
    var o = R(0, 0, w, h, '#E9E4D6', K + ' rx="4"') + R(8, 8, w - 16, h - 16, '#16224A'), pw = (w - 16) / 2, ph = (h - 16) / 2, n = p.n || 0;
    var mx = 8 + pw / 6, my = 8 + ph / 4, mr = Math.min(pw / 6, ph / 4) * .8;
    o += C(mx, my, mr, '#FFE9A0') + C(mx + mr * .45, my - mr * .25, mr * .85, '#16224A');
    var cells = [], k, q;
    for (k = 0; k < 6; k++) for (q = 0; q < 4; q++) { if (q === 0 && k === 0) continue; cells.push([q, k % 3, Math.floor(k / 3)]) }
    var rr = Math.min(pw / 3, ph / 2) * .26;
    for (var i = 0; i < n && i < cells.length; i++) {
      var cl = cells[i], px = cl[0] % 2, py = Math.floor(cl[0] / 2), jx = ((i * 37) % 7 - 3) * rr * .2, jy = ((i * 53) % 7 - 3) * rr * .2;
      o += shape('☆', 8 + px * pw + (cl[1] + .5) * pw / 3 + jx, 8 + py * ph + (cl[2] + .5) * ph / 2 + jy, rr, '#FFE27A');
    }
    o += L(w / 2, 8, w / 2, h - 8, '#E9E4D6', 6) + L(8, h / 2, w - 8, h / 2, '#E9E4D6', 6);
    return o;
  };

  /* 시간표: p.days 요일, p.rows 교시마다 과목, p.title, p.foot(아래 빈 줄 높이 — 쪽지 자리) */
  var SUBJ = { 국어: '#FBD9D3', 수학: '#FCE6C4', 음악: '#D8EFD5', 미술: '#E6DDF4', 체육: '#D6E9F7', 과학: '#DFF1EA', 사회: '#F6E8C9' };
  ART.A.scTimetable = function (w, h, p) {
    var D = p.days || [], RW = p.rows || [], top = p.title ? h * .15 : 8, foot = p.foot || 8, nc = D.length + 1, nr = RW.length + 1;
    var o = R(0, 0, w, h, '#FFFDF4', K + ' rx="6"'), cw = (w - 12) / nc, ch = (h - top - foot) / nr, fs = Math.min(ch * .5, cw * .3);
    if (p.title) o += T(w / 2, top * .72, p.title, top * .55, '#2A2233');
    for (var r = 0; r < nr; r++) for (var q = 0; q < nc; q++) {
      var x = 6 + q * cw, y = top + r * ch, s = r === 0 ? (q ? D[q - 1] : '') : (q ? RW[r - 1][q - 1] : r + '교시'), f = r === 0 ? '#DCE6F5' : q === 0 ? '#EEEAE0' : (SUBJ[s] || '#fff');
      o += R(x, y, cw, ch, f, ' stroke="#8C8577" stroke-width="1.2"') + (s ? T(x + cw / 2, y + ch * .66, s, q === 0 && r ? fs * .78 : fs, '#2A2233') : '');
    }
    if (p.footText) o += T(12, h - foot * .35, p.footText, Math.min(foot * .45, 16), '#6A6355', '', 'start');
    return o;
  };

  /* 출석부·명단: p.title, p.rows=[[이름, 'O'|'X'|'']] */
  ART.A.scAttend = function (w, h, p) {
    var rows = p.rows || [], o = R(0, 0, w, h, '#9A6A3F', K + ' rx="8"') + R(8, 18, w - 16, h - 26, '#FFFDF4', ' rx="3"') + R(w * .3, 2, w * .4, 22, '#B8BEC6', K2 + ' rx="5"');
    var top = 30 + (p.title ? 26 : 0), lh = Math.min(30, (h - top - 14) / Math.max(1, rows.length)), fs = Math.min(lh * .62, 18);
    if (p.title) o += T(w / 2, 46, p.title, Math.min(17, w / (p.title.length + 2)), '#2A2233');
    rows.forEach(function (rw, i) {
      var y = top + i * lh;
      o += L(14, y + lh, w - 14, y + lh, '#C9D3E0', 1.2) + T(20, y + lh * .72, rw[0], fs, '#2A2233', '', 'start');
      var mx = w - 28, my = y + lh * .5, mr = lh * .3;
      if (rw[1] === 'O') o += C(mx, my, mr, 'none', ' stroke="#D23B2E" stroke-width="3"');
      else if (rw[1] === 'X') o += L(mx - mr, my - mr, mx + mr, my + mr, '#3B5BB0', 3) + L(mx + mr, my - mr, mx - mr, my + mr, '#3B5BB0', 3);
    });
    return o;
  };

  /* 게시판: 핀으로 꽂은 모양 종이 p.items=[{k, c, n}] — 섞어 붙임 */
  ART.A.scArtboard = function (w, h, p) {
    var all = []; (p.items || []).forEach(function (it) { for (var i = 0; i < it.n; i++) all.push(it) });
    var o = R(0, 0, w, h, '#7A5434', K + ' rx="6"') + R(9, 9, w - 18, h - 18, '#C89B62'), top = p.title ? 34 : 12;
    if (p.title) o += R(w * .25, 12, w * .5, 22, '#FFFDF4', ' rx="4"') + T(w / 2, 29, p.title, 15, '#2A2233');
    var cols = Math.ceil(Math.sqrt(all.length * (w - 24) / (h - top - 12))), rows = Math.ceil(all.length / cols);
    while (cols * rows < all.length + 2) cols++;
    var cw = (w - 24) / cols, ch = (h - top - 12) / rows, rr = Math.min(cw, ch) * .36, pos = spread(all.length, cols * rows);
    all.forEach(function (it, i) {
      var cx = 12 + (pos[i] % cols + .5) * cw, cy = top + (Math.floor(pos[i] / cols) + .5) * ch;
      o += R(cx - rr * 1.15, cy - rr * 1.15, rr * 2.3, rr * 2.3, '#FFFDF4', ' rx="3"') + shape(it.k, cx, cy + rr * .05, rr * .85, c(it.c)) + C(cx, cy - rr * 1.05, 2.6, '#D23B2E');
    });
    return o;
  };

  /* 사물함: p.cols × p.rows, 번호 1부터, p.lockAt 번째 칸에 자물쇠(열리면 그 칸 문이 열림) */
  ART.A.scLocker = function (w, h, p, open) {
    var cols = p.cols || 4, rows = p.rows || 3, cw = (w - 12) / cols, ch = (h - 12) / rows, o = R(0, 0, w, h, '#5E7A9A', K + ' rx="4"');
    for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++) {
      var n = r * cols + q + 1, x = 6 + q * cw, y = 6 + r * ch, isL = n === p.lockAt;
      if (isL && open) { o += R(x + 2, y + 2, cw - 4, ch - 4, '#1A1F2B') + P('M' + (x + 2) + ' ' + (y + 2) + 'L' + (x - cw * .25) + ' ' + (y + 8) + 'V' + (y + ch - 8) + 'L' + (x + 2) + ' ' + (y + ch - 2) + 'Z', '#8FB0D0', K2); continue }
      o += R(x + 2, y + 2, cw - 4, ch - 4, isL ? '#E9C46A' : '#8FB0D0', K2 + ' rx="3"') + R(x + cw * .3, y + ch * .14, cw * .4, ch * .1, '#2A2233', ' opacity=".35" rx="2"') + R(x + cw * .3, y + ch * .3, cw * .4, ch * .25, '#FFFDF4', ' rx="3"') + T(x + cw / 2, y + ch * .49, n, Math.min(ch * .2, cw * .3), '#2A2233');
      if (isL) o += R(x + cw / 2 - 8, y + ch * .74, 16, 14, '#F2C230', K2 + ' rx="3"') + '<path d="M' + (x + cw / 2 - 5) + ' ' + (y + ch * .74) + 'v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#6E7580" stroke-width="2.5"/>';
    }
    return o;
  };

  /* 실로폰 막대 길이 재기: p.bars=[{c, len(cm)}] 왼쪽 맞춤 + 아래 cm 자 */
  ART.A.scXylo = function (w, h, p) {
    var bars = p.bars || [], mx = p.max || 18, o = R(0, 0, w, h, '#8A5A2B', K + ' rx="6"') + R(8, 8, w - 16, h - 16, '#FFF8E6'), x0 = 22, u = (w - 44) / mx;
    var rulerH = Math.max(26, h * .17), bh = (h - 24 - rulerH) / Math.max(1, bars.length);
    for (var i = 0; i <= mx; i++) o += L(x0 + i * u, 14, x0 + i * u, h - rulerH - 8, '#E2D6B8', 1);
    bars.forEach(function (b, i) { var y = 14 + i * bh + bh * .18; o += R(x0, y, b.len * u, bh * .64, c(b.c), K2 + ' rx="3"') + C(x0 + u * .6, y + bh * .32, Math.min(3, bh * .1), '#fff', ' opacity=".8"') + C(x0 + b.len * u - u * .6, y + bh * .32, Math.min(3, bh * .1), '#fff', ' opacity=".8"') });
    var ry = h - rulerH - 6;
    o += R(x0 - 8, ry, mx * u + 16, rulerH - 4, '#F6E7A8', K2 + ' rx="2"');
    for (var j = 0; j <= mx; j++) o += L(x0 + j * u, ry, x0 + j * u, ry + (j % 5 === 0 ? rulerH * .45 : rulerH * .28), '#2A2233', 1.5) + (j % (u < 14 ? 2 : 1) === 0 ? T(x0 + j * u, ry + rulerH * .86, j, Math.min(rulerH * .34, u * .8), '#2A2233') : '');
    o += T(w - 14, ry - 4, 'cm', 12, '#6A6355', '', 'end');
    return o;
  };

  /* 피아노(열리면 뚜껑이 올라가고 음표가 나옴) */
  ART.A.scPiano = function (w, h, p, open) {
    var o = R(0, h * .08, w, h * .72, '#3B2A24', K + ' rx="6"') + R(w * .03, h * .8, w * .06, h * .2, '#2A1D18') + R(w * .91, h * .8, w * .06, h * .2, '#2A1D18');
    o += open ? P('M0 ' + h * .08 + 'L' + w * .08 + ' -' + h * .06 + 'H' + w * .92 + 'L' + w + ' ' + h * .08 + 'Z', '#4E3830', K) : R(-4, h * .04, w + 8, h * .08, '#4E3830', K + ' rx="4"');
    o += R(w * .3, h * .16, w * .4, h * .2, '#FFFDF4', K2 + ' rx="3"');
    for (var s = 0; s < 4; s++) o += L(w * .33, h * (.2 + s * .04), w * .67, h * (.2 + s * .04), '#8C8577', 1);
    var ky = h * .48, kh = h * .24, nk = 14, kw = (w - 16) / nk;
    o += R(6, ky - 4, w - 12, kh + 8, '#2A1D18');
    for (var i = 0; i < nk; i++) o += R(8 + i * kw, ky, kw - 1.5, kh, '#FFFDF4', ' rx="2"');
    for (var j = 0; j < nk - 1; j++) if ([0, 1, 3, 4, 5].indexOf(j % 7) >= 0) o += R(8 + (j + 1) * kw - kw * .3, ky, kw * .6, kh * .6, '#1A1210');
    if (open) [[.15, -.02], [.78, .0], [.5, -.1]].forEach(function (n) { o += C(w * n[0], h * n[1] + 10, 7, '#FFE27A') + L(w * n[0] + 6, h * n[1] + 10, w * n[0] + 6, h * n[1] - 14, '#FFE27A', 3) });
    return o;
  };
  /* 작은 북 */
  ART.A.scDrum = function (w, h) {
    return '<ellipse cx="' + w / 2 + '" cy="' + h * .3 + '" rx="' + w * .45 + '" ry="' + h * .14 + '" fill="#F4EEDC"' + K + '/>' + P('M' + w * .05 + ' ' + h * .3 + 'V' + h * .8 + 'Q' + w / 2 + ' ' + h + ' ' + w * .95 + ' ' + h * .8 + 'V' + h * .3 + 'Q' + w / 2 + ' ' + h * .5 + ' ' + w * .05 + ' ' + h * .3 + 'Z', '#C8402F', K)
      + P('M' + w * .1 + ' ' + h * .45 + 'L' + w * .3 + ' ' + h * .82 + 'L' + w * .5 + ' ' + h * .5 + 'L' + w * .7 + ' ' + h * .82 + 'L' + w * .9 + ' ' + h * .45, 'none', ' stroke="#F2C230" stroke-width="3"')
      + L(w * .2, h * .02, w * .45, h * .25, '#8A5A2B', 5, ' stroke-linecap="round"') + L(w * .85, h * .02, w * .6, h * .25, '#8A5A2B', 5, ' stroke-linecap="round"');
  };

  /* 키 재는 기계: p.lo~p.hi cm 눈금(1 cm마다, 5마다 조금 길게, 10마다 숫자), 머리 막대가 p.v */
  ART.A.scHeight = function (w, h, p) {
    var lo = p.lo || 100, hi = p.hi || 150, x0 = w * .22, top = 14, bot = h * .86, u = (bot - top) / (hi - lo), o = R(w * .1, h * .88, w * .8, h * .12, '#8A929C', K + ' rx="4"') + R(x0 - 8, top - 8, w * .62, bot - top + 16, '#F4F1E8', K + ' rx="3"');
    for (var v = lo; v <= hi; v++) { var y = bot - (v - lo) * u, len = v % 10 === 0 ? w * .2 : v % 5 === 0 ? w * .13 : w * .07; o += L(x0, y, x0 + len, y, '#2A2233', v % 5 === 0 ? 1.8 : 1); if (v % 10 === 0) o += T(x0 + w * .23, y + 5, v, Math.min(14, w * .16), '#2A2233', '', 'start') }
    var hy = bot - (p.v - lo) * u;
    o += R(x0 - 2, hy - 3, w * .7, 6, '#D23B2E', ' rx="2"') + P('M' + (x0 - 2) + ' ' + hy + 'l-9 -6v12z', '#D23B2E');
    return o;
  };
  /* 보건실 침대 */
  ART.A.scBed = function (w, h) {
    return R(0, h * .1, w * .07, h * .9, '#C8CDD3', K + ' rx="4"') + R(w * .93, h * .35, w * .07, h * .65, '#C8CDD3', K + ' rx="4"') + R(w * .05, h * .45, w * .9, h * .2, '#FFFDF4', K + ' rx="6"')
      + R(w * .38, h * .4, w * .56, h * .27, '#8FC1E3', K + ' rx="8"') + '<ellipse cx="' + w * .2 + '" cy="' + h * .43 + '" rx="' + w * .11 + '" ry="' + h * .09 + '" fill="#fff"' + K2 + '/>'
      + R(w * .1, h * .65, w * .05, h * .3, '#8A929C') + R(w * .85, h * .65, w * .05, h * .3, '#8A929C') + C(w * .125, h * .96, h * .04, '#3A3F48') + C(w * .875, h * .96, h * .04, '#3A3F48');
  };
  /* 약병: 병마다 p.items=[{c, num, den}] — 칸을 den개로 나누고 num칸만큼 약을 채움 */
  ART.A.scMedB = function (w, h, p) {
    var it = p.items || [], bw = w / Math.max(1, it.length), o = R(0, h * .88, w, h * .12, '#8A929C', ' rx="3"');
    it.forEach(function (b, i) {
      var x = i * bw + bw * .18, bwid = bw * .64, y0 = h * .2, bh = h * .52, uh = bh / b.den;
      o += R(x + bwid * .3, h * .05, bwid * .4, h * .15, '#E8E3D8', K2) + R(x, y0, bwid, bh, '#EEF6FA', K2 + ' rx="6"') + R(x + 2, y0 + bh - uh * b.num, bwid - 4, uh * b.num - 2, c(b.c), ' rx="4"');
      for (var k = 1; k < b.den; k++) o += L(x + bwid * .6, y0 + k * uh, x + bwid, y0 + k * uh, '#2A2233', 1.2);
      o += R(x - 2, h * .74, bwid + 4, h * .13, '#FFFDF4', K2 + ' rx="3"') + T(x + bwid / 2, h * .84, b.num + '/' + b.den, Math.min(h * .1, bwid * .34), '#2A2233');
    });
    return o;
  };
  /* 우유 상자(위에서 본 모습): p.rows × p.cols 갑 */
  ART.A.scMilk = function (w, h, p) {
    var rows = p.rows || 4, cols = p.cols || 6, o = R(0, 0, w, h, '#3B6FD6', K + ' rx="8"') + R(8, 8, w - 16, h - 16, '#28508F', ' rx="4"'), cw = (w - 20) / cols, ch = (h - 20) / rows;
    for (var r = 0; r < rows; r++) for (var q = 0; q < cols; q++) {
      var x = 10 + q * cw, y = 10 + r * ch;
      o += R(x + 3, y + 3, cw - 6, ch - 6, '#FFFDF4', K2 + ' rx="2"') + P('M' + (x + 3) + ' ' + (y + ch / 2) + 'L' + (x + cw / 2) + ' ' + (y + 5) + 'L' + (x + cw - 3) + ' ' + (y + ch / 2), 'none', ' stroke="#7DB5E8" stroke-width="2.5"') + R(x + cw * .3, y + ch * .6, cw * .4, ch * .16, '#7DB5E8', ' rx="2"');
    }
    return o;
  };
  /* 방송 조정기: p.knobs=[{a 각도, s 모양}] — 손잡이마다 반원 눈금(10°마다, 30°마다 숫자), 오른쪽 밑선에서 잰 각 */
  ART.A.scMixer = function (w, h, p) {
    var ks = p.knobs || [], cols = p.cols || ks.length, nr = Math.ceil(ks.length / cols), kw = (w - 20) / Math.max(1, cols), th = Math.min(h * .16, 34), rh = (h - th - 10) / nr;
    var o = R(0, th * .75, w, h - th * .75, '#3A3F48', K + ' rx="10"') + R(w * .3, 0, w * .4, th, '#2A2E35', K2 + ' rx="5"') + T(w / 2, th * .7, p.title || '방송 조정기', th * .5, '#7CF29B');
    ks.forEach(function (k, i) {
      var row = Math.floor(i / cols), inRow = Math.min(cols, ks.length - row * cols), cx = w / 2 + (i % cols - (inRow - 1) / 2) * kw, top = th + 6 + row * rh, r = Math.min(kw * .44, rh * .5), cy = top + (rh - r * 1.75) / 2 + r, sy = cy + r * .42 + 4;
      o += P('M' + (cx - r) + ' ' + cy + 'A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy + 'Z', '#F4F1E8', K2);
      for (var d = 0; d <= 180; d += 10) { var a = d * Math.PI / 180, l = d % 30 === 0 ? .2 : .1; o += L(cx + Math.cos(a) * r, cy - Math.sin(a) * r, cx + Math.cos(a) * r * (1 - l), cy - Math.sin(a) * r * (1 - l), '#2A2233', d % 30 === 0 ? 1.6 : 1); if (d % 30 === 0 && d % 180) o += T(cx + Math.cos(a) * r * .64, cy - Math.sin(a) * r * .64 + r * .07, d, r * .17, '#4A4358') }
      var ka = k.a * Math.PI / 180;
      o += L(cx, cy, cx + r * .92, cy, '#3B6FD6', 3) + L(cx, cy, cx + Math.cos(ka) * r * .92, cy - Math.sin(ka) * r * .92, '#D23B2E', 3.5, ' stroke-linecap="round"') + C(cx, cy, r * .08, '#2A2233');
      o += C(cx, sy, r * .24, '#F4F1E8') + shape(k.s, cx, sy, r * .16, '#2A2233');
    });
    return o;
  };
  /* 방송 마이크와 '방송 중' 불(열리면 빨간 불) */
  ART.A.scMic = function (w, h, p, open) {
    return R(w * .1, 0, w * .8, h * .16, open ? '#D23B2E' : '#4A4358', K + ' rx="8"') + T(w / 2, h * .11, '방송 중', h * .08, open ? '#fff' : '#9A93A8')
      + R(w * .2, h * .86, w * .6, h * .14, '#3A3F48', K + ' rx="6"') + R(w * .46, h * .45, w * .08, h * .42, '#6E7580') + P('M' + w * .5 + ' ' + h * .46 + 'Q' + w * .2 + ' ' + h * .42 + ' ' + w * .3 + ' ' + h * .3, 'none', ' stroke="#6E7580" stroke-width="5"')
      + R(w * .3, h * .22, w * .4, h * .26, '#8A929C', K + ' rx="' + w * .2 + '"') + L(w * .34, h * .3, w * .66, h * .3, '#3A3F48', 2) + L(w * .33, h * .36, w * .67, h * .36, '#3A3F48', 2) + L(w * .34, h * .42, w * .66, h * .42, '#3A3F48', 2);
  };

  /* 열쇠함(유리문 안 열쇠 고리 번호표) */
  ART.A.scKeybox = function (w, h, p, open) {
    var o = R(0, 0, w, h, '#6B4A2E', K + ' rx="6"') + R(10, 10, w - 20, h - 20, '#2A1D18'), tags = p.tags || [], cols = 3, cw = (w - 30) / cols, ch = (h - 80) / Math.ceil(tags.length / cols);
    tags.forEach(function (t, i) { var x = 15 + (i % cols) * cw + cw / 2, y = 22 + Math.floor(i / cols) * ch, fs = Math.min(ch * .24, cw * .86 / (String(t).length + .4)); o += C(x, y, 3, '#C9A24B') + L(x, y, x, y + ch * .3, '#C9A24B', 2) + R(x - cw * .45, y + ch * .3, cw * .9, ch * .38, '#FFFDF4', ' rx="3"') + T(x, y + ch * .3 + ch * .19 + fs * .36, t, fs, '#2A2233') });
    if (open) return o + P('M10 10L-' + w * .3 + ' 24V' + (h - 24) + 'L10 ' + (h - 10) + 'Z', '#BFE3F5', K + ' opacity=".7"');
    return o + R(10, 10, w - 20, h - 20, '#BFE3F5', ' opacity=".25"') + R(w / 2 - 30, h - 58, 60, 40, '#3A3F48', K2 + ' rx="4"') + R(w / 2 - 24, h - 53, 48, 10, '#7CF29B') + [0, 1, 2, 3].map(function (i) { return R(w / 2 - 22 + i * 11, h - 38, 8, 6, '#ccc') + R(w / 2 - 22 + i * 11, h - 29, 8, 6, '#ccc') }).join('');
  };
  /* 공 수레: p.items=[{k:'basket'|'volley', n}] 섞어 담음 */
  function ball(k, cx, cy, r) {
    if (k === 'basket') return C(cx, cy, r, '#E8792B', K2) + L(cx - r, cy, cx + r, cy, '#2A2233', 1.4) + L(cx, cy - r, cx, cy + r, '#2A2233', 1.4) + P('M' + (cx - r * .7) + ' ' + (cy - r * .7) + 'Q' + (cx - r * .2) + ' ' + cy + ' ' + (cx - r * .7) + ' ' + (cy + r * .7), 'none', ' stroke="#2A2233" stroke-width="1.4"');
    return C(cx, cy, r, '#FFFDF4', K2) + P('M' + (cx - r) + ' ' + cy + 'Q' + cx + ' ' + (cy - r * .5) + ' ' + (cx + r) + ' ' + cy, 'none', ' stroke="#3B6FD6" stroke-width="' + r * .35 + '"') + P('M' + (cx - r * .5) + ' ' + (cy + r * .8) + 'Q' + cx + ' ' + (cy + r * .2) + ' ' + (cx + r * .5) + ' ' + (cy + r * .8), 'none', ' stroke="#F2C230" stroke-width="' + r * .3 + '"');
  }
  ART.A.scBallCart = function (w, h, p) {
    var all = []; (p.items || []).forEach(function (it) { for (var i = 0; i < it.n; i++) all.push(it.k) });
    var bx = 8, by = h * .08, bw = w - 16, bh = h * .74, o = R(bx, by, bw, bh, '#8A929C', K + ' rx="6"') + R(bx + 6, by + 6, bw - 12, bh - 12, '#4A5160');
    var cols = Math.ceil(Math.sqrt(all.length * (bw - 12) / (bh - 12))), rows = Math.ceil(all.length / cols); while (cols * rows < all.length) cols++;
    var cw = (bw - 12) / cols, ch = (bh - 12) / rows, r = Math.min(cw, ch) * .44, pos = spread(all.length, cols * rows);
    all.forEach(function (k, i) { o += ball(k, bx + 6 + (pos[i] % cols + .5) * cw, by + 6 + (Math.floor(pos[i] / cols) + .5) * ch, r) });
    for (var g = 1; g < 5; g++) o += L(bx + g * bw / 5, by, bx + g * bw / 5, by + 8, '#6E7580', 2);
    o += R(bx + 10, by + bh, 8, h * .12, '#6E7580') + R(bx + bw - 18, by + bh, 8, h * .12, '#6E7580') + C(bx + 14, h * .95, h * .045, '#2A2233') + C(bx + bw - 14, h * .95, h * .045, '#2A2233');
    return o;
  };
  /* 도면: p.kind 'rect'(p.W × p.H, p.a·p.b 글) 또는 'circle'(p.r 글), p.title */
  ART.A.scPlan = function (w, h, p) {
    var o = R(0, 0, w, h, '#E8F0FA', K + ' rx="4"'), top = p.title ? 32 : 12, fs = Math.min(16, w / 14);
    for (var gx = 10; gx < w; gx += 16) o += L(gx, 4, gx, h - 4, '#C8D8EE', 1);
    for (var gy = 10; gy < h; gy += 16) o += L(4, gy, w - 4, gy, '#C8D8EE', 1);
    if (p.title) o += T(w / 2, 24, p.title, Math.min(17, w / (p.title.length + 1)), '#1E2F5A');
    if (p.kind === 'circle') {
      var cx = w / 2, cy = top + (h - top) / 2 - 4, r = Math.min(w * .3, (h - top) * .38);
      o += C(cx, cy, r, '#FFFDF4', ' stroke="#1E2F5A" stroke-width="3"') + C(cx, cy, 3.5, '#1E2F5A') + L(cx, cy, cx + r, cy, '#D23B2E', 3) + T(cx + r / 2, cy - 7, p.r, fs, '#D23B2E');
      return o;
    }
    var mw = w - 70, mh = h - top - 46, sc = Math.min(mw / p.W, mh / p.H), rw = p.W * sc, rh = p.H * sc, x = 40 + (mw - rw) / 2, y = top + 10;
    o += R(x, y, rw, rh, '#F3D9A8', ' stroke="#1E2F5A" stroke-width="3"') + L(x + rw / 2, y, x + rw / 2, y + rh, '#fff', 2) + C(x + rw / 2, y + rh / 2, rh * .16, 'none', ' stroke="#fff" stroke-width="2"');
    o += L(x, y + rh + 14, x + rw, y + rh + 14, '#1E2F5A', 1.5) + T(x + rw / 2, y + rh + 32, p.a, fs, '#1E2F5A');
    o += L(x - 12, y, x - 12, y + rh, '#1E2F5A', 1.5) + '<text x="' + (x - 18) + '" y="' + (y + rh / 2) + '" font-size="' + fs + '" fill="#1E2F5A" text-anchor="middle" font-weight="700" transform="rotate(-90 ' + (x - 18) + ' ' + (y + rh / 2) + ')">' + esc(p.b) + '</text>';
    return o;
  };
  /* 응원 깃발 줄: p.flags=[{c, t}] */
  ART.A.scFlags = function (w, h, p) {
    var fl = p.flags || [], fw = (w - 20) / Math.max(1, fl.length), o = P('M4 10Q' + w / 2 + ' 34 ' + (w - 4) + ' 10', 'none', ' stroke="#E8E3D8" stroke-width="3"');
    fl.forEach(function (f, i) {
      var x = 10 + i * fw + fw * .1, ww = fw * .8, y = 14 + Math.sin((i + .5) / fl.length * Math.PI) * 16;
      o += P('M' + x + ' ' + y + 'H' + (x + ww) + 'V' + (y + h * .7) + 'L' + (x + ww / 2) + ' ' + (y + h * .55) + 'L' + x + ' ' + (y + h * .7) + 'Z', c(f.c), K2) + R(x + ww * .14, y + h * .12, ww * .72, h * .28, '#FFFDF4', ' rx="4"') + T(x + ww / 2, y + h * .33, f.t, Math.min(h * .2, ww * .3), '#2A2233');
    });
    return o;
  };
  /* 천체 망원경(열리면 렌즈가 빛남) */
  ART.A.scTelescope = function (w, h, p, open) {
    var o = L(w * .5, h * .55, w * .18, h, '#6E7580', 6) + L(w * .5, h * .55, w * .82, h, '#6E7580', 6) + L(w * .5, h * .55, w * .5, h, '#6E7580', 6) + R(w * .44, h * .5, w * .12, h * .1, '#3A3F48', K2 + ' rx="3"');
    o += '<g transform="rotate(-32 ' + w * .5 + ' ' + h * .5 + ')">' + R(w * .04, h * .42, w * .84, h * .15, '#E8E3D8', K + ' rx="8"') + R(w * .8, h * .39, w * .14, h * .21, '#3B4A8A', K + ' rx="5"') + R(w * .0, h * .45, w * .08, h * .09, '#3A3F48', K2 + ' rx="3"') + (open ? C(w * .94, h * .495, h * .07, '#FFE27A', ' opacity=".95"') : '') + '</g>';
    return o;
  };
  /* 별자리 지도: p.groups=[{s 모양 이름표, n 별 수}] 칸마다 별을 n개 찍고 선으로 이음 */
  ART.A.scStarmap = function (w, h, p) {
    var gs = p.groups || [], cols = Math.min(3, gs.length), rows = Math.ceil(gs.length / cols), o = R(0, 0, w, h, '#0E1638', K + ' rx="6"'), top = p.title ? 28 : 6;
    if (p.title) o += T(w / 2, 21, p.title, 15, '#E8E3D8');
    var gw = (w - 12) / cols, gh = (h - top - 6) / rows;
    gs.forEach(function (g, i) {
      var gx = 6 + (i % cols) * gw, gy = top + Math.floor(i / cols) * gh, sc = 4, sr = 4, pos;
      while (sc * sr < g.n * 1.7) { if (sc <= sr) sc++; else sr++ }
      pos = spread(g.n, sc * sr);
      var pts = pos.map(function (q, j) { return [gx + 26 + (q % sc + .5) * (gw - 34) / sc + ((j * 31) % 5 - 2) * 1.2, gy + 8 + (Math.floor(q / sc) + .5) * (gh - 14) / sr + ((j * 17) % 5 - 2) * 1.2] });
      var mx = 0, my = 0; pts.forEach(function (q) { mx += q[0] / pts.length; my += q[1] / pts.length }); pts.sort(function (a, b) { return Math.atan2(a[1] - my, a[0] - mx) - Math.atan2(b[1] - my, b[0] - mx) });
      o += R(gx + 2, gy + 2, gw - 4, gh - 4, 'none', ' stroke="#3A4A7A" stroke-width="1" stroke-dasharray="4 3" rx="4"');
      o += '<polyline points="' + pts.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1) }).join(' ') + '" fill="none" stroke="#6F86C9" stroke-width="1.4"/>';
      var rr = Math.min((gw - 34) / sc, (gh - 14) / sr) * .3;
      pts.forEach(function (q) { o += shape('☆', q[0], q[1], rr, '#FFE27A') });
      o += C(gx + 15, gy + 15, 11, '#E8E3D8') + shape(g.s, gx + 15, gy + 15.5, 7, '#0E1638');
    });
    return o;
  };
})();
