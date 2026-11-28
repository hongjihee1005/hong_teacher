/* 수학 방탈출 그림 묶음 (2026-11-26): ART[이름](w, h, p, open) → 0,0~w,h 안에 그리는 SVG 조각.
   방 그림(장면)과 크게 보기 창에서 같은 함수를 씀. 이모지 대신 모두 직접 그린 도형(공통 덮개가 이모지를 바꾸지 않게). */
var ART = (function () {
  var COL = { 빨강: '#E5534B', 주황: '#F08A24', 노랑: '#F2C230', 초록: '#3DA35D', 파랑: '#3B6FD6', 보라: '#8A5BC9', 분홍: '#EE7DB0', 갈색: '#9A6A3F', 하양: '#F6F3EC', 검정: '#2A2A2A', 하늘: '#6CC3EA', 회색: '#9AA0A8' };
  function c(n) { return COL[n] || n || '#9A6A3F' }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x] }) }
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="middle" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function emw(s) { var n = 0; String(s).split('').forEach(function (ch) { n += ch === ' ' ? .3 : /[가-힣]/.test(ch) ? 1.08 : .6 }); return n }
  function fitw(L, w) { return Math.min.apply(null, (L || []).map(function (s) { return (w - 20) / Math.max(1, emw(s)) }).concat([99])) }   /* 글줄이 폭 안에 들어가는 가장 큰 글자 */
  var STK = ' stroke="#3A2C22" stroke-width="3" stroke-linejoin="round"';
  /* 작은 모양: ○ △ □ ☆ ◇ 하트 */
  function shape(k, cx, cy, r, f) {
    f = f || '#3A2C22';
    if (k === '○') return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"/>';
    if (k === '△') return '<path d="M' + cx + ' ' + (cy - r) + 'L' + (cx + r * .95) + ' ' + (cy + r * .75) + 'H' + (cx - r * .95) + 'Z" fill="' + f + '"/>';
    if (k === '□') return R(cx - r * .82, cy - r * .82, r * 1.64, r * 1.64, f);
    if (k === '◇') return '<path d="M' + cx + ' ' + (cy - r) + 'L' + (cx + r) + ' ' + cy + 'L' + cx + ' ' + (cy + r) + 'L' + (cx - r) + ' ' + cy + 'Z" fill="' + f + '"/>';
    if (k === '♡') return '<path d="M' + cx + ' ' + (cy + r * .8) + 'C' + (cx - r * 1.4) + ' ' + (cy - r * .1) + ' ' + (cx - r * .6) + ' ' + (cy - r * 1.1) + ' ' + cx + ' ' + (cy - r * .35) + 'C' + (cx + r * .6) + ' ' + (cy - r * 1.1) + ' ' + (cx + r * 1.4) + ' ' + (cy - r * .1) + ' ' + cx + ' ' + (cy + r * .8) + 'Z" fill="' + f + '"/>';
    var d = ''; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) } return '<path d="' + d + 'Z" fill="' + f + '"/>';
  }
  function arrow(dir, cx, cy, r, f) { var a = { '↑': 0, '→': 90, '↓': 180, '←': 270 }[dir] || 0; return '<g transform="translate(' + cx + ' ' + cy + ') rotate(' + a + ')"><path d="M0 ' + (-r) + 'L' + (r * .8) + ' 0H' + (r * .32) + 'V' + r + 'H' + (-r * .32) + 'V0H' + (-r * .8) + 'Z" fill="' + (f || '#3A2C22') + '"/></g>' }
  /* 작은 물건(선반·탁자 위에 놓는 것): 높이 s 안에 그림 */
  function thing(k, x, y, s, col) {
    var f = c(col);
    if (k === 'block') return R(x, y + s * .25, s * .8, s * .75, f, STK.replace('3"', '2"')) + R(x + s * .15, y + s * .1, s * .5, s * .17, f, STK.replace('3"', '2"'));
    if (k === 'book') return R(x, y, s * .32, s, f, STK.replace('3"', '2"')) + R(x + s * .06, y + s * .2, s * .2, s * .08, '#fff', ' opacity=".7"');
    if (k === 'ball') return '<circle cx="' + (x + s * .45) + '" cy="' + (y + s * .55) + '" r="' + s * .42 + '" fill="' + f + '"' + STK.replace('3"', '2"') + '/><path d="M' + (x + s * .1) + ' ' + (y + s * .5) + 'Q' + (x + s * .45) + ' ' + (y + s * .75) + ' ' + (x + s * .82) + ' ' + (y + s * .45) + '" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>';
    if (k === 'jar') return R(x + s * .05, y + s * .2, s * .7, s * .8, f, STK.replace('3"', '2"') + ' rx="' + s * .12 + '"') + R(x + s * .12, y + s * .05, s * .56, s * .18, '#8C8C8C', STK.replace('3"', '2"') + ' rx="4"') + R(x + s * .18, y + s * .38, s * .14, s * .4, '#fff', ' opacity=".45" rx="4"');
    if (k === 'bear') return '<circle cx="' + (x + s * .4) + '" cy="' + (y + s * .66) + '" r="' + s * .3 + '" fill="' + f + '"' + STK.replace('3"', '2"') + '/><circle cx="' + (x + s * .4) + '" cy="' + (y + s * .3) + '" r="' + s * .24 + '" fill="' + f + '"' + STK.replace('3"', '2"') + '/><circle cx="' + (x + s * .2) + '" cy="' + (y + s * .1) + '" r="' + s * .09 + '" fill="' + f + '"' + STK.replace('3"', '2"') + '/><circle cx="' + (x + s * .6) + '" cy="' + (y + s * .1) + '" r="' + s * .09 + '" fill="' + f + '"' + STK.replace('3"', '2"') + '/><circle cx="' + (x + s * .33) + '" cy="' + (y + s * .27) + '" r="2.4" fill="#2A221C"/><circle cx="' + (x + s * .47) + '" cy="' + (y + s * .27) + '" r="2.4" fill="#2A221C"/>';
    if (k === 'flask') return '<path d="M' + (x + s * .3) + ' ' + y + 'h' + s * .2 + 'v' + s * .35 + 'l' + s * .3 + ' ' + s * .55 + 'q0 ' + s * .1 + ' -' + s * .1 + ' ' + s * .1 + 'h-' + s * .6 + 'q-' + s * .1 + ' 0 -' + s * .1 + ' -' + s * .1 + 'l' + s * .3 + ' -' + s * .55 + 'z" fill="#EAF2F7"' + STK.replace('3"', '2"') + '/><path d="M' + (x + s * .12) + ' ' + (y + s * .75) + 'h' + s * .56 + 'l' + s * .09 + ' ' + s * .16 + 'q0 ' + s * .05 + ' -.05 ' + s * .05 + 'h-' + s * .7 + 'q-.05 0 -.05 -' + s * .05 + 'z" fill="' + f + '"/>';
    if (k === 'candy') return '<circle cx="' + (x + s * .45) + '" cy="' + (y + s * .5) + '" r="' + s * .26 + '" fill="' + f + '"' + STK.replace('3"', '2"') + '/><path d="M' + (x + s * .2) + ' ' + (y + s * .5) + 'l-' + s * .18 + ' -' + s * .14 + 'v' + s * .28 + 'z M' + (x + s * .7) + ' ' + (y + s * .5) + 'l' + s * .18 + ' -' + s * .14 + 'v' + s * .28 + 'z" fill="' + f + '"' + STK.replace('3"', '2"') + '/>';
    if (k === 'star') return shape('☆', x + s * .45, y + s * .5, s * .45, f);
    if (k === 'shell') return '<path d="M' + (x + s * .45) + ' ' + (y + s) + 'L' + x + ' ' + (y + s * .35) + 'Q' + (x + s * .45) + ' ' + (y - s * .2) + ' ' + (x + s * .9) + ' ' + (y + s * .35) + 'Z" fill="' + f + '"' + STK.replace('3"', '2"') + '/>';
    if (k === 'gem') return '<path d="M' + (x + s * .1) + ' ' + (y + s * .35) + 'L' + (x + s * .3) + ' ' + (y + s * .1) + 'H' + (x + s * .65) + 'L' + (x + s * .85) + ' ' + (y + s * .35) + 'L' + (x + s * .47) + ' ' + (y + s * .95) + 'Z" fill="' + f + '"' + STK.replace('3"', '2"') + '/>';
    if (k === 'fish') return '<ellipse cx="' + (x + s * .4) + '" cy="' + (y + s * .5) + '" rx="' + s * .32 + '" ry="' + s * .2 + '" fill="' + f + '"' + STK.replace('3"', '2"') + '/><path d="M' + (x + s * .7) + ' ' + (y + s * .5) + 'l' + s * .22 + ' -' + s * .17 + 'v' + s * .34 + 'z" fill="' + f + '"' + STK.replace('3"', '2"') + '/><circle cx="' + (x + s * .25) + '" cy="' + (y + s * .45) + '" r="2.5" fill="#2A221C"/>';
    return shape(k, x + s * .45, y + s * .5, s * .42, f);
  }
  /* 물건을 줄지어 놓기: items = [{k, c, n}] → 왼쪽부터 */
  function row(items, x, y, w, s) { var o = '', cx = x, step = s * .95; (items || []).forEach(function (it) { for (var i = 0; i < (it.n || 1); i++) { if (cx + s * .8 > x + w) return; o += thing(it.k, cx, y, s, it.c); cx += it.k === 'book' ? s * .36 : step } }); return o }

  var A = {};
  A.door = function (w, h, p, open) {
    var f = c(p.c || '갈색'), o = R(0, 0, w, h, '#5A4030', ' rx="8"') + R(10, 10, w - 20, h - 10, open ? '#1F1A16' : f, STK + ' rx="6"');
    if (open) return o + '<path d="M10 10L' + (w * .55) + ' 30V' + (h - 10) + 'L10 ' + h + 'Z" fill="' + f + '"' + STK + '/>' + '<rect x="' + w * .2 + '" y="' + h * .3 + '" width="' + w * .6 + '" height="' + h * .4 + '" fill="#FFE9A8" opacity=".25"/>';
    o += R(24, 26, w - 48, h * .36, '#000', ' opacity=".1" rx="4"') + R(24, h * .48, w - 48, h * .42, '#000', ' opacity=".1" rx="4"');
    o += '<circle cx="' + (w - 30) + '" cy="' + (h * .55) + '" r="8" fill="#F2C230"' + STK.replace('3"', '2"') + '/>';
    if (p.sign) { var sw = Math.max(w * .76, Math.min(w + 20, emw(p.sign) * 18 + 16)); o += R((w - sw) / 2, -18, sw, 30, '#2E7D5B', ' rx="6"') + T(w / 2, 3, p.sign, Math.min(18, (sw - 12) / emw(p.sign)), '#fff') }   /* 긴 이름표는 판을 넓히고 그래도 길면 글자를 줄임 */
    if (p.keypad) o += R(w + 8, h * .4, 34, 52, '#3A3F48', ' rx="5"') + R(w + 13, h * .4 + 6, 24, 12, '#7CF29B') + [0, 1, 2].map(function (i) { return R(w + 13 + i * 8, h * .4 + 24, 6, 6, '#ccc') + R(w + 13 + i * 8, h * .4 + 34, 6, 6, '#ccc') }).join('');
    return o;
  };
  A.clock = function (w, h, p) {
    var r = Math.min(w, h) / 2 - 4, cx = w / 2, cy = h / 2, o = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c(p.c || '#FFF8E8') + '"' + STK + '/>';
    for (var i = 1; i <= 12; i++) { var a = i * Math.PI / 6; o += T(cx + Math.sin(a) * r * .78, cy - Math.cos(a) * r * .78 + r * .09, i, r * .22) }
    var hh = (p.h % 12 + (p.m || 0) / 60) * Math.PI / 6, mm = (p.m || 0) * Math.PI / 30;
    o += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.sin(hh) * r * .45) + '" y2="' + (cy - Math.cos(hh) * r * .45) + '" stroke="#2A221C" stroke-width="' + r * .09 + '" stroke-linecap="round"/>';
    o += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.sin(mm) * r * .7) + '" y2="' + (cy - Math.cos(mm) * r * .7) + '" stroke="#C8402F" stroke-width="' + r * .05 + '" stroke-linecap="round"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r * .06 + '" fill="#2A221C"/>';
    return o;
  };
  A.shelf = function (w, h, p) {
    var rows = p.rows || [], n = Math.max(1, rows.length), rh = (h - 14) / n, o = R(0, 0, w, h, c(p.c || '#B98552'), STK + ' rx="4"');
    for (var i = 0; i < n; i++) { var y = 7 + i * rh; o += R(8, y, w - 16, rh - 8, '#7A5434', ' opacity=".35"') + R(4, y + rh - 8, w - 8, 8, '#6B4A2E') + row(rows[i], 14, y + rh * .18, w - 24, Math.min(rh * .72, 46)) }
    return o;
  };
  A.table = function (w, h, p) { return R(0, h * .25, w, h * .12, c(p.c || '#B98552'), STK + ' rx="4"') + R(w * .08, h * .37, 12, h * .63, '#7A5434') + R(w * .92 - 12, h * .37, 12, h * .63, '#7A5434') + row(p.items, w * .06, 0, w * .88, h * .25) };
  A.box = function (w, h, p, open) {
    var f = c(p.c || '#D99A4E'), o = R(0, h * .25, w, h * .75, f, STK + ' rx="6"');
    o += open ? '<path d="M0 ' + h * .25 + 'L-' + w * .08 + ' 0H' + w * .92 + 'L' + w + ' ' + h * .25 + 'Z" fill="' + f + '"' + STK + ' opacity=".85"/>' + R(6, h * .25, w - 12, h * .12, '#2A221C', ' opacity=".45"') : R(-4, h * .15, w + 8, h * .16, f, STK + ' rx="5"') + (p.lock ? R(w / 2 - 12, h * .3, 24, 28, '#F2C230', STK.replace('3"', '2"') + ' rx="4"') + '<circle cx="' + w / 2 + '" cy="' + (h * .3 + 12) + '" r="4" fill="#3A2C22"/>' : '');
    if (p.label) o += R(w * .15, h * .5, w * .7, h * .3, '#fff', ' rx="5" opacity=".9"') + T(w / 2, h * .5 + h * .2, p.label, Math.min(28, h * .2, (w * .7 - 12) / Math.max(1, emw(p.label))));
    return o;
  };
  A.chest = function (w, h, p, open) { var f = c(p.c || '#A0522D'); return (open ? '<path d="M0 ' + h * .4 + 'Q' + w / 2 + ' -' + h * .2 + ' ' + w + ' ' + h * .4 + 'Z" fill="' + f + '"' + STK + ' opacity=".9"/>' + R(6, h * .38, w - 12, h * .1, '#F2C230', ' opacity=".7"') : '<path d="M0 ' + h * .42 + 'Q' + w / 2 + ' 0 ' + w + ' ' + h * .42 + 'Z" fill="' + f + '"' + STK + '/>') + R(0, h * .4, w, h * .6, f, STK + ' rx="6"') + R(w * .45, h * .35, w * .1, h * .3, '#F2C230', STK.replace('3"', '2"')) + R(0, h * .55, w, 8, '#6B3A1F') };
  A.desk = function (w, h, p, open) {
    var f = c(p.c || '#B98552'), o = R(0, h * .3, w, h * .12, f, STK + ' rx="4"') + R(w * .05, h * .42, w * .45, h * .58, f, STK) + R(w * .9, h * .42, w * .06, h * .58, '#7A5434');
    o += open ? R(w * .02, h * .5, w * .52, h * .2, '#7A5434', STK) + R(w * .06, h * .5, w * .44, h * .06, '#2A221C', ' opacity=".4"') : R(w * .1, h * .5, w * .35, h * .18, f, STK) + '<circle cx="' + w * .275 + '" cy="' + h * .59 + '" r="5" fill="#F2C230"' + STK.replace('3"', '1.5"') + '/>';
    o += R(w * .1, h * .72, w * .35, h * .18, f, STK) + row(p.items, w * .1, 0, w * .8, h * .3);
    return o;
  };
  A.safe = function (w, h, p, open) {
    var o = R(0, 0, w, h, '#6E7580', STK + ' rx="8"');
    if (open) return o + R(10, 10, w - 20, h - 20, '#2A2E35', ' rx="5"') + '<path d="M10 10L-' + w * .25 + ' 28V' + (h - 4) + 'L10 ' + (h - 10) + 'Z" fill="#8A929C"' + STK + '/>';
    o += R(10, 10, w - 20, h - 20, '#8A929C', STK.replace('3"', '2"') + ' rx="5"') + '<circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="' + Math.min(w, h) * .2 + '" fill="#C8CDD3"' + STK + '/>';
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; o += '<line x1="' + (w / 2 + Math.cos(a) * Math.min(w, h) * .13) + '" y1="' + (h / 2 + Math.sin(a) * Math.min(w, h) * .13) + '" x2="' + (w / 2 + Math.cos(a) * Math.min(w, h) * .2) + '" y2="' + (h / 2 + Math.sin(a) * Math.min(w, h) * .2) + '" stroke="#3A2C22" stroke-width="2"/>' }
    if (p.colors) p.colors.forEach(function (k, i) { o += '<circle cx="' + (w * .2 + i * w * .6 / Math.max(1, p.colors.length - 1)) + '" cy="' + h * .85 + '" r="7" fill="' + c(k) + '"' + STK.replace('3"', '1.5"') + '/>' });
    return o;
  };
  A.poster = function (w, h, p) {
    var o = R(0, 0, w, h, c(p.c || '#FFF6DC'), STK + ' rx="4"') + '<circle cx="' + w / 2 + '" cy="8" r="5" fill="#C8402F"/>', L = p.lines || [], fs = Math.min(fitw(L, w), p.fs || Math.min(26, (h - 20) / Math.max(2, L.length + (p.shapes ? 1.6 : 0)) * .72));
    L.forEach(function (s, i) { o += T(w / 2, 22 + fs * 1.3 * (i + .8), s, fs) });
    if (p.shapes) { var n = p.shapes.length, gap = (w - 16) / n, rr = Math.min(gap * .42, (h - 26 - L.length * fs * 1.3) * .32), cy = h - rr - 12; p.shapes.forEach(function (k, i) { var cx = 8 + gap * (i + .5); o += k === '?' ? T(cx, cy + rr * .6, '?', rr * 2, '#C8402F') : shape(k, cx, cy, rr, p.sc ? c(p.sc[i]) : '#3A2C22') }) }
    return o;
  };
  A.board = function (w, h, p, open) { var o = R(0, 0, w, h, '#8A5A2B', ' rx="6"') + R(8, 8, w - 16, h - 16, '#2E5E4E'), L = (open && p.openLines) || p.lines || [], fs = Math.min(fitw(L, w - 16), p.fs || Math.min(26, (h - 24) / Math.max(2, L.length) * .72)); L.forEach(function (s, i) { o += T(w / 2, 18 + fs * 1.3 * (i + .9), s, fs, '#F4F1E8') }); return o };
  A.frame = function (w, h, p, open) {
    var o = R(0, 0, w, h, '#C9A24B', STK + ' rx="3"') + R(10, 10, w - 20, h - 20, c(p.bg || '#BFE3F5'));
    if (p.kind === 'sun') o += '<circle cx="' + w * .7 + '" cy="' + h * .35 + '" r="' + h * .15 + '" fill="#F2C230"/>' + '<path d="M10 ' + (h - 10) + 'L' + w * .4 + ' ' + h * .45 + 'L' + w * .7 + ' ' + (h - 10) + 'Z" fill="#3DA35D"/>';
    else if (p.kind === 'shapes') (open && p.ans ? p.ans : p.shapes || []).forEach(function (k, i, a) { o += shape(k, 10 + (w - 20) / a.length * (i + .5), h / 2, Math.min(h * .25, (w - 20) / a.length * .35), c((p.sc || [])[i] || '#E5534B')) });
    else o += '<path d="M10 ' + (h - 10) + 'L' + w * .35 + ' ' + h * .35 + 'L' + w * .55 + ' ' + h * .6 + 'L' + w * .75 + ' ' + h * .3 + 'L' + (w - 10) + ' ' + (h - 10) + 'Z" fill="#6E9F5C"/>';
    if (open) o += R(10, 10, w - 20, h - 20, '#2A221C', ' opacity=".55"');
    return o;
  };
  A.robot = function (w, h, p, open) {
    var f = c(p.c || '#9AA7B8'), o = R(w * .2, h * .35, w * .6, h * .5, f, STK + ' rx="10"') + R(w * .25, h * .05, w * .5, h * .3, f, STK + ' rx="10"') + R(w * .3, h * .85, w * .12, h * .15, '#6E7580') + R(w * .58, h * .85, w * .12, h * .15, '#6E7580');
    o += '<line x1="' + w / 2 + '" y1="' + h * .05 + '" x2="' + w / 2 + '" y2="-6" stroke="#3A2C22" stroke-width="3"/><circle cx="' + w / 2 + '" cy="-8" r="6" fill="' + (open ? '#7CF29B' : '#E5534B') + '"/>';
    o += '<circle cx="' + w * .4 + '" cy="' + h * .18 + '" r="' + w * .06 + '" fill="' + (open ? '#7CF29B' : '#444') + '"/><circle cx="' + w * .6 + '" cy="' + h * .18 + '" r="' + w * .06 + '" fill="' + (open ? '#7CF29B' : '#444') + '"/>';
    o += R(w * .3, h * .45, w * .4, h * .22, '#1E1A17', ' rx="5"') + (open ? T(w / 2, h * .6, 'OK', h * .12, '#7CF29B') : R(w * .34, h * .52, w * .12, h * .08, '#E5534B') + R(w * .5, h * .52, w * .16, h * .08, '#444'));
    return o;
  };
  A.plant = function (w, h) { return R(w * .25, h * .6, w * .5, h * .4, '#C8743C', STK + ' rx="6"') + '<path d="M' + w / 2 + ' ' + h * .6 + 'C' + w * .1 + ' ' + h * .3 + ' ' + w * .1 + ' ' + h * .1 + ' ' + w * .3 + ' 0C' + w * .35 + ' ' + h * .3 + ' ' + w * .45 + ' ' + h * .4 + ' ' + w / 2 + ' ' + h * .6 + 'C' + w * .55 + ' ' + h * .3 + ' ' + w * .65 + ' ' + h * .1 + ' ' + w * .85 + ' ' + h * .05 + 'C' + w * .9 + ' ' + h * .3 + ' ' + w * .7 + ' ' + h * .45 + ' ' + w / 2 + ' ' + h * .6 + 'Z" fill="#3DA35D"' + STK.replace('3"', '2"') + '/>' };
  A.rug = function (w, h, p, open) { return open ? '<ellipse cx="' + w * .3 + '" cy="' + h / 2 + '" rx="' + w * .3 + '" ry="' + h * .45 + '" fill="' + c(p.c || '#C8402F') + '" opacity=".85"/>' + R(w * .55, h * .2, w * .3, h * .6, '#5A4030', STK + ' rx="4"') + '<circle cx="' + w * .7 + '" cy="' + h / 2 + '" r="5" fill="#F2C230"/>' : '<ellipse cx="' + w / 2 + '" cy="' + h / 2 + '" rx="' + w / 2 + '" ry="' + h * .45 + '" fill="' + c(p.c || '#C8402F') + '"' + STK + '/><ellipse cx="' + w / 2 + '" cy="' + h / 2 + '" rx="' + w * .35 + '" ry="' + h * .28 + '" fill="none" stroke="#F2C230" stroke-width="4"/>' };
  A.window = function (w, h, p) { var o = R(0, 0, w, h, '#F4F1E8', STK + ' rx="4"') + R(8, 8, w - 16, h - 16, p.night ? '#1D2B5A' : '#BFE3F5') + '<line x1="' + w / 2 + '" y1="8" x2="' + w / 2 + '" y2="' + (h - 8) + '" stroke="#F4F1E8" stroke-width="6"/><line x1="8" y1="' + h / 2 + '" x2="' + (w - 8) + '" y2="' + h / 2 + '" stroke="#F4F1E8" stroke-width="6"/>'; if (p.night) for (var i = 0; i < 6; i++) o += '<circle cx="' + (14 + (i * 37) % (w - 28)) + '" cy="' + (14 + (i * 23) % (h - 28)) + '" r="2" fill="#fff"/>'; else o += '<circle cx="' + w * .75 + '" cy="' + h * .25 + '" r="' + h * .1 + '" fill="#F2C230"/>'; return o };
  A.screen = function (w, h, p, open) { var o = R(0, 0, w, h * .85, '#3A3F48', STK + ' rx="8"') + R(10, 10, w - 20, h * .85 - 20, open ? '#123' : '#0E1A12') + R(w * .4, h * .85, w * .2, h * .15, '#3A3F48'), L = (open && p.open) ? p.open : (p.lines || []), fs = p.fs || Math.min(24, (h * .85 - 30) / Math.max(2, L.length) * .7); L.forEach(function (s, i) { o += T(w / 2, 20 + fs * 1.3 * (i + .9), s, fs, '#7CF29B') }); return o };
  A.panel = function (w, h, p, open) { var o = R(0, 0, w, h, '#4A5160', STK + ' rx="8"'), cols = p.colors || ['빨강', '노랑', '초록', '파랑']; cols.forEach(function (k, i) { o += '<circle cx="' + (w * (i + .5) / cols.length) + '" cy="' + h * .35 + '" r="' + Math.min(18, w / cols.length * .3) + '" fill="' + c(k) + '"' + STK.replace('3"', '2"') + '/>' }); o += R(w * .1, h * .62, w * .8, h * .22, open ? '#123' : '#0E1A12', ' rx="4"') + T(w / 2, h * .78, open ? (p.done || '열림') : (p.label || '잠김'), Math.min(h * .14, (w * .8 - 10) / Math.max(1, emw(open ? (p.done || '열림') : (p.label || '잠김')))), open ? '#7CF29B' : '#E5534B'); return o };
  A.porthole = function (w, h, p) { var r = Math.min(w, h) / 2 - 3, o = '<circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="' + r + '" fill="#8A929C"' + STK + '/><circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="' + r * .78 + '" fill="' + (p.sea ? '#1E6A8F' : '#11183A') + '"/>'; (p.items || []).forEach(function (it, i, a) { var n = it.n || 1; for (var j = 0; j < n; j++) { var ang = (i * 7 + j * 2.3), rr = r * .45 * ((j % 3) / 3 + .2); o += thing(it.k, w / 2 + Math.cos(ang) * rr - 9, h / 2 + Math.sin(ang) * rr - 9, 18, it.c) } }); if (!p.items) for (var i = 0; i < 7; i++) o += '<circle cx="' + (w / 2 + Math.cos(i * 2.1) * r * .5) + '" cy="' + (h / 2 + Math.sin(i * 1.7) * r * .5) + '" r="2" fill="#fff"/>'; return o };
  A.cabinet = function (w, h, p, open) { var f = c(p.c || '#C9B99A'), o = R(0, 0, w, h, f, STK + ' rx="5"'); if (open) return o + R(8, 8, w - 16, h - 16, '#3A2C22', ' opacity=".55"') + '<path d="M' + (w - 8) + ' 8L' + (w + w * .3) + ' 20V' + (h - 20) + 'L' + (w - 8) + ' ' + (h - 8) + 'Z" fill="' + f + '"' + STK + '/>'; o += '<line x1="' + w / 2 + '" y1="0" x2="' + w / 2 + '" y2="' + h + '" stroke="#3A2C22" stroke-width="3"/><circle cx="' + (w / 2 - 10) + '" cy="' + h / 2 + '" r="5" fill="#F2C230"/><circle cx="' + (w / 2 + 10) + '" cy="' + h / 2 + '" r="5" fill="#F2C230"/>'; if (p.label) o += R(w * .1, 10, w * .8, 30, '#fff', ' rx="4"') + T(w / 2, 32, p.label, Math.min(18, (w * .8 - 10) / Math.max(1, emw(p.label)))); return o };
  A.sign = function (w, h, p) { var L = p.lines || [], z = Math.min(h * .3, (p.fs || 24), fitw(L, w)); return R(0, 0, w, h, c(p.c || '#2E7D5B'), STK + ' rx="8"') + L.map(function (s, i, a) { return T(w / 2, h / 2 + (i - (a.length - 1) / 2) * h * .36 + h * .1, s, z, '#fff') }).join('') };   /* 글이 판 밖으로 나가지 않게 폭에 맞춤 */
  A.lamp = function (w, h, p, open) { return R(w * .45, h * .3, w * .1, h * .6, '#5A4030') + R(w * .25, h * .9, w * .5, h * .1, '#5A4030', ' rx="3"') + '<path d="M' + w * .15 + ' ' + h * .35 + 'L' + w * .3 + ' 0H' + w * .7 + 'L' + w * .85 + ' ' + h * .35 + 'Z" fill="' + (open ? '#FFE27A' : '#E8D9B8') + '"' + STK + '/>' };
  A.pipe = function (w, h, p, open) { var o = R(0, h * .4, w, h * .2, '#8A929C', STK) + '<circle cx="' + w / 2 + '" cy="' + h / 2 + '" r="' + h * .3 + '" fill="' + c(p.c || '빨강') + '"' + STK + '/>'; o += '<line x1="' + (w / 2 - h * .22) + '" y1="' + h / 2 + '" x2="' + (w / 2 + h * .22) + '" y2="' + h / 2 + '" stroke="#fff" stroke-width="5" transform="rotate(' + (open ? 90 : 0) + ' ' + w / 2 + ' ' + h / 2 + ')"/>'; return o };
  A.statue = function (w, h, p) { return R(w * .15, h * .75, w * .7, h * .25, '#D9D4CA', STK) + '<circle cx="' + w / 2 + '" cy="' + h * .2 + '" r="' + w * .18 + '" fill="#E8E3D8"' + STK + '/>' + R(w * .3, h * .38, w * .4, h * .38, '#E8E3D8', STK + ' rx="12"') + (p.plate ? R(w * .2, h * .8, w * .6, h * .14, '#C9A24B', ' rx="3"') + T(w / 2, h * .91, p.plate, h * .08) : '') };
  A.case = function (w, h, p, open) { var o = R(0, h * .55, w, h * .45, '#7A5434', STK) + R(4, 0, w - 8, h * .55, open ? '#E8F4FA' : '#CFE7F3', STK + ' opacity=".85"') + row(p.items, 14, h * .2, w - 28, h * .3); if (!open && p.lock) o += R(w / 2 - 12, h * .58, 24, 26, '#F2C230', STK.replace('3"', '2"') + ' rx="4"'); return o };
  A.counter = function (w, h, p) { return R(0, h * .35, w, h * .65, c(p.c || '#E8A0B4'), STK + ' rx="6"') + R(-6, h * .3, w + 12, h * .1, '#fff', STK + ' rx="4"') + row(p.items, 10, 0, w - 20, h * .3) };
  A.scale = function (w, h, p) { var o = R(w * .45, h * .25, w * .1, h * .65, '#8A929C', STK) + R(w * .25, h * .88, w * .5, h * .12, '#6E7580', ' rx="4"') + R(w * .05, h * .2, w * .9, 8, '#6E7580', ' rx="4"'); o += '<path d="M0 ' + h * .38 + 'Q' + w * .17 + ' ' + h * .52 + ' ' + w * .34 + ' ' + h * .38 + 'Z M' + w * .66 + ' ' + h * .38 + 'Q' + w * .83 + ' ' + h * .52 + ' ' + w + ' ' + h * .38 + 'Z" fill="#C8CDD3"' + STK.replace('3"', '2"') + '/>'; o += row(p.left, 4, h * .1, w * .3, h * .25) + row(p.right, w * .68, h * .1, w * .3, h * .25); return o };
  A.globe = function (w, h) { var r = Math.min(w, h * .8) / 2 - 3; return R(w * .3, h * .88, w * .4, h * .1, '#7A5434', ' rx="4"') + R(w * .47, h * .78, w * .06, h * .12, '#7A5434') + '<circle cx="' + w / 2 + '" cy="' + (r + 3) + '" r="' + r + '" fill="#6CC3EA"' + STK + '/><path d="M' + (w / 2 - r * .5) + ' ' + r * .6 + 'q' + r * .3 + ' -' + r * .3 + ' ' + r * .6 + ' 0t' + r * .2 + ' ' + r * .6 + 'q-' + r * .5 + ' ' + r * .2 + ' -' + r * .8 + ' -' + r * .2 + 'z" fill="#3DA35D"/>' };
  A.microscope = function (w, h) { return R(w * .2, h * .88, w * .6, h * .12, '#3A3F48', ' rx="4"') + '<path d="M' + w * .55 + ' ' + h * .88 + 'V' + h * .55 + 'Q' + w * .55 + ' ' + h * .3 + ' ' + w * .4 + ' ' + h * .2 + '" fill="none" stroke="#3A3F48" stroke-width="' + w * .08 + '"/>' + R(w * .28, h * .05, w * .16, h * .4, '#E8E3D8', STK + ' rx="5" transform="rotate(-25 ' + w * .36 + ' ' + h * .25 + ')"') + R(w * .25, h * .62, w * .4, h * .05, '#8A929C') };
  A.banner = function (w, h, p) { var f = c(p.c || '파랑'), o = R(0, 0, w, 8, '#7A5434') + '<path d="M6 8H' + (w - 6) + 'V' + h + 'L' + w / 2 + ' ' + h * .82 + 'L6 ' + h + 'Z" fill="' + f + '"' + STK + '/>'; if (p.shape) o += shape(p.shape, w / 2, h * .42, w * .22, '#F2C230'); if (p.n != null) o += T(w / 2, h * .7, p.n, w * .22, '#fff'); return o };
  A.cage = function (w, h, p, open) { var o = R(0, h - 12, w, 12, '#6E7580') + R(0, 0, w, 10, '#6E7580'); for (var i = 0; i <= 8; i++) if (!(open && i > 2 && i < 6)) o += R(i * (w - 6) / 8, 10, 6, h - 22, '#8A929C'); if (p.animal) o += thing(p.animal, w * .3, h * .35, h * .5, p.c); return o };
  A.fence = function (w, h, p) { var o = R(0, h * .3, w, 10, '#B98552') + R(0, h * .65, w, 10, '#B98552'); for (var x = 0; x < w; x += 34) o += '<path d="M' + x + ' ' + h + 'V' + h * .12 + 'L' + (x + 12) + ' 0L' + (x + 24) + ' ' + h * .12 + 'V' + h + 'Z" fill="#D9A86C"' + STK.replace('3"', '2"') + '/>'; return o };
  A.bookshelf = function (w, h, p) { return A.shelf(w, h, { c: p.c, rows: (p.books || [[]]).map(function (r) { return r.map(function (k) { return { k: 'book', c: k } }) }) }) };
  A.note = function (w, h, p) { return R(0, 0, w, h, '#FFFDF4', STK.replace('3"', '2"') + ' transform="rotate(-4 ' + w / 2 + ' ' + h / 2 + ')"') + '<line x1="10" y1="' + h * .4 + '" x2="' + (w - 10) + '" y2="' + h * .4 + '" stroke="#9AB" stroke-width="2"/><line x1="10" y1="' + h * .65 + '" x2="' + (w - 10) + '" y2="' + h * .65 + '" stroke="#9AB" stroke-width="2"/>' };
  A.conveyor = function (w, h, p, open) { var o = R(0, h * .55, w, h * .2, '#4A5160', STK + ' rx="10"'); for (var i = 0; i < 6; i++) o += '<circle cx="' + (12 + i * (w - 24) / 5) + '" cy="' + h * .65 + '" r="' + h * .07 + '" fill="#8A929C"/>'; (open && p.ans ? p.ans : p.shapes || []).forEach(function (k, i, a) { var cx = 20 + (w - 40) / a.length * (i + .5); o += k === '?' ? R(cx - h * .18, h * .14, h * .36, h * .36, '#fff', STK.replace('3"', '2"') + ' stroke-dasharray="5 4"') + T(cx, h * .42, '?', h * .3, '#C8402F') : shape(k, cx, h * .32, h * .18, (p.sc ? c(p.sc[i]) : '#E5534B')) }); if (open) o += T(w / 2, h * .95, '움직여요!', h * .16, '#3DA35D'); return o };
  /* 병·통: 이름표가 분모가 같은 분수(a/b, a ≤ b)면 몸통에 b칸 눈금을 긋고 a칸만큼 채움(양이 보이게, 2026-11-28; p.fill로 켜고 끔). 그 밖은 가득 찬 병 */
  A.bottles = function (w, h, p) {
    var it = p.items || [], o = R(0, h * .86, w, h * .14, '#7A5434'), bw = w / Math.max(1, it.length), S2 = STK.replace('3"', '2"'),
      dd = it.map(function (b) { var m = /^(\d+)\/(\d+)$/.exec(b.label || ''); return m && +m[1] <= +m[2] ? m[2] : null }),
      fr = p.fill === true || (p.fill !== false && dd.every(function (d) { return d && d === dd[0] }));   /* 분모가 모두 같은 분수일 때만 양을 그림(분모가 다르면 그림만 보고 크기 차례를 알 수 있어 계산 문제가 사라짐) */
    it.forEach(function (b, i) {
      var x = i * bw + bw * .18, bwid = bw * .64, by = h * .17, bh = h * .5, m = /^(\d+)\/(\d+)$/.exec(b.label || ''), fz = Math.min(h * .13, bwid * .3);
      o += R(x + bwid * .3, h * .06, bwid * .4, h * .13, '#C8CDD3', S2 + ' rx="3"');
      if (fr && m && +m[1] <= +m[2]) {
        var n = +m[1], d = +m[2], fh = bh * n / d;
        o += R(x, by, bwid, bh, '#EEF4F7', ' rx="8"') + R(x, by + bh - fh, bwid, fh, c(b.c), n === d ? ' rx="8"' : '');
        if (d <= 12) for (var k = 1; k < d; k++) o += '<line x1="' + x + '" y1="' + (by + bh * k / d).toFixed(1) + '" x2="' + (x + bwid * .45) + '" y2="' + (by + bh * k / d).toFixed(1) + '" stroke="#3A2C22" stroke-width="1.5" opacity=".75"/>';
        o += R(x, by, bwid, bh, 'none', S2 + ' rx="8"');
      } else o += R(x, by, bwid, bh, c(b.c), S2 + ' rx="8"');
      if (b.label) o += R(x - bwid * .04, h * .7, bwid * 1.08, h * .15, '#fff', ' stroke="#3A2C22" stroke-width="1.5" rx="4"') + T(x + bwid / 2, h * .7 + h * .075 + fz * .36, b.label, fz);
    });
    return o;
  };
  /* 숨은 곳(크게 볼 때만 보이는 작은 곳, 2026-11-27): 작은 서랍·쪽지·빠진 벽돌·작은 구멍 */
  /* 숨은 서랍(2026-11-28): 겉틀 안에 앞판 + 가로로 긴 손잡이라 자물쇠 장식과 헷갈리지 않게, 잠기면 손잡이 아래 열쇠 구멍 */
  A.drawer = function (w, h, p, open) {
    var f = c(p.c || '#B98552'), S1 = STK.replace('3"', '1.5"'), fr = R(0, 0, w, h, '#5A4030', STK + ' rx="4"');
    if (open) return fr + R(w * .06, h * .08, w * .88, h * .42, '#1F1A16', ' rx="2"') + '<path d="M' + w * .02 + ' ' + h * .5 + 'L' + w * .1 + ' ' + h * .3 + 'H' + w * .9 + 'L' + w * .98 + ' ' + h * .5 + 'Z" fill="#8A6440"' + S1 + '/>' + R(-w * .04, h * .5, w * 1.08, h * .5, f, STK + ' rx="3"') + R(w * .3, h * .66, w * .4, Math.max(4, h * .1), '#3A3F48', ' rx="' + Math.max(2, h * .05) + '"');
    return fr + R(w * .07, h * .1, w * .86, h * .8, f, S1 + ' rx="3"') + R(w * .13, h * .18, w * .74, h * .64, 'none', ' stroke="#3A2C22" stroke-width="1" opacity=".35" rx="2"') + R(w * .28, h * .3, w * .44, Math.max(4, h * .13), '#3A3F48', ' rx="' + Math.max(2, h * .065) + '"') + (p.lock ? (function () {   /* 숫자 자물쇠 서랍: 열쇠 구멍 대신 작은 숫자 다이얼(두 칸) */
      var dw = w * .4, dh = Math.max(9, h * .3), dx = w * .3, dy = h * .5, cw = dw * .38, ch = dh * .72, d = R(dx, dy, dw, dh, '#2E3440', ' rx="' + Math.max(2, dh * .2) + '"');
      [0, 1].forEach(function (i) { var x = dx + dw * .08 + i * (cw + dw * .08); d += R(x, dy + dh * .14, cw, ch, '#FFFDF4', ' rx="1.5"') + '<text x="' + (x + cw / 2) + '" y="' + (dy + dh * .14 + ch * .8) + '" font-size="' + ch * .85 + '" font-weight="700" text-anchor="middle" fill="#2A221C">0</text>' });
      return d })() : '');
  };
  A.scrap = function (w, h, p) { return '<path d="M3 3H' + (w - 6) + 'L' + (w - 2) + ' ' + h * .3 + 'L' + (w - 5) + ' ' + (h - 3) + 'H6L2 ' + h * .6 + 'Z" fill="#FFF8D6"' + STK.replace('3"', '1.5"') + '/>' + (p.t ? T(w / 2, h * .66, p.t, Math.min(h * .42, w * .36 / Math.max(1, String(p.t).length / 2)), '#C8402F') : '<line x1="8" y1="' + h * .45 + '" x2="' + (w - 8) + '" y2="' + h * .45 + '" stroke="#9AB" stroke-width="1.5"/><line x1="8" y1="' + h * .7 + '" x2="' + (w - 12) + '" y2="' + h * .7 + '" stroke="#9AB" stroke-width="1.5"/>') };
  A.brick = function (w, h, p, open) { return open ? R(0, 0, w, h, '#1F1A16', ' rx="3"') + R(w * .1, h * .7, w * .8, h * .25, '#5A4030', ' opacity=".6"') : R(0, 0, w, h, c(p.c || '#B5654A'), STK.replace('3"', '2"') + ' rx="3"') + '<path d="M' + w * .2 + ' ' + h * .3 + 'l' + w * .15 + ' ' + h * .25 + 'l' + w * .1 + ' -' + h * .1 + '" fill="none" stroke="#3A2C22" stroke-width="1.5"/>' };
  A.hole = function (w, h, p, open) { return '<path d="M0 ' + h + 'V' + h * .45 + 'Q' + w / 2 + ' -' + h * .2 + ' ' + w + ' ' + h * .45 + 'V' + h + 'Z" fill="#1F1A16"' + STK.replace('3"', '2"') + '/>' + (open ? '' : '<circle cx="' + w * .5 + '" cy="' + h * .72 + '" r="' + Math.min(w, h) * .1 + '" fill="#F2C230" opacity=".8"/>') };
  A.map = function (w, h, p) {
    var n = p.n || 4, m = p.m || n, cs = Math.min((w - 20) / m, (h - 20) / n), ox = (w - cs * m) / 2, oy = (h - cs * n) / 2, o = R(0, 0, w, h, '#F7EBC9', STK + ' rx="6"'), x = p.start[0], y = p.start[1], cells = [[x, y]];
    (p.path || '').split('').forEach(function (d) { if (d === 'U') y--; else if (d === 'D') y++; else if (d === 'L') x--; else x++; cells.push([x, y]) });
    for (var r = 0; r < n; r++) for (var q = 0; q < m; q++) o += R(ox + q * cs, oy + r * cs, cs, cs, '#FFF8E2', ' stroke="#B99A5E" stroke-width="1.5"');
    (p.block || []).forEach(function (b) { o += R(ox + b[0] * cs + 3, oy + b[1] * cs + 3, cs - 6, cs - 6, '#8A7A5E', ' rx="4"') });
    var s = cells[0], g = cells[cells.length - 1];
    /* 출발·도착 칸은 점을 찍지 않고, 이름표는 칸 안에 들어가게(길면 글자를 줄이거나 두 줄로) */
    if (p.show !== false) cells.forEach(function (cl, i) { if (i && i < cells.length - 1) o += '<circle cx="' + (ox + (cl[0] + .5) * cs) + '" cy="' + (oy + (cl[1] + .5) * cs) + '" r="' + cs * .12 + '" fill="#C8402F" opacity=".7"/>' });
    function lab(cl, t, f) {
      var cx = ox + (cl[0] + .5) * cs, cy = oy + (cl[1] + .5) * cs, a = String(t).split(' '), z;
      if (a.length > 1) { var l2 = a.slice(1).join(' '); z = Math.min(cs * .27, (cs - 16) / Math.max(a[0].length, l2.length)); return T(cx, cy - z * .14, a[0], z, f) + T(cx, cy + z * .92, l2, z, f) }
      z = Math.min(cs * .3, (cs - 16) / Math.max(1, String(t).length)); return T(cx, cy + z * .36, t, z, f);
    }
    o += R(ox + s[0] * cs + 4, oy + s[1] * cs + 4, cs - 8, cs - 8, '#E6EEFB', ' stroke="#3B6FD6" stroke-width="3" rx="6"') + lab(s, p.sl || '출발', '#2C57B0') + R(ox + g[0] * cs + 4, oy + g[1] * cs + 4, cs - 8, cs - 8, '#E4F4E9', ' stroke="#3DA35D" stroke-width="4" rx="6"') + lab(g, p.gl || '도착', '#256B4C');
    return o;
  };
  /* 가방 속 물건 아이콘 */
  var ITEM = {
    key: function (f) { return '<circle cx="14" cy="20" r="9" fill="none" stroke="' + f + '" stroke-width="5"/><path d="M22 20H40M34 20v7M39 20v5" stroke="' + f + '" stroke-width="5" stroke-linecap="round"/>' },
    battery: function (f) { return R(8, 12, 30, 18, f, STK.replace('3"', '2"') + ' rx="3"') + R(38, 17, 4, 8, '#3A2C22') + T(20, 26, '+', 12, '#fff') },
    torch: function (f) { return R(4, 15, 24, 12, '#3A3F48', ' rx="3"') + '<path d="M28 12L40 6V36L28 30Z" fill="' + f + '"' + STK.replace('3"', '2"') + '/>' },
    lens: function (f) { return '<circle cx="18" cy="18" r="11" fill="#CFE7F3" stroke="' + f + '" stroke-width="4"/><path d="M26 26L40 40" stroke="' + f + '" stroke-width="6" stroke-linecap="round"/>' },
    card: function (f) { return R(4, 10, 36, 24, f, STK.replace('3"', '2"') + ' rx="4"') + R(8, 15, 12, 8, '#F2C230', ' rx="2"') },
    gear: function (f) { var d = ''; for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, r = i % 2 ? 11 : 16; d += (i ? 'L' : 'M') + (22 + r * Math.cos(a)).toFixed(1) + ' ' + (22 + r * Math.sin(a)).toFixed(1) } return '<path d="' + d + 'Z" fill="' + f + '"' + STK.replace('3"', '2"') + '/><circle cx="22" cy="22" r="5" fill="#fff"/>' },
    coin: function (f) { return '<circle cx="22" cy="22" r="15" fill="' + f + '"' + STK.replace('3"', '2"') + '/><circle cx="22" cy="22" r="9" fill="none" stroke="#fff" stroke-width="2"/>' },
    piece: function (f) { return '<path d="M8 10H22Q22 4 27 4T32 10H38V22Q44 22 44 27T38 32V38H8Z" fill="' + f + '"' + STK.replace('3"', '2"') + '/>' },
    paper: function (f) { return R(8, 6, 28, 34, '#FFFDF4', STK.replace('3"', '2"')) + '<path d="M13 16H31M13 23H31M13 30H25" stroke="' + f + '" stroke-width="2.5"/>' },
    gem: function (f) { return thing('gem', 6, 6, 32, f) },
    candy: function (f) { return thing('candy', 4, 4, 36, f) },
    khead: function (f) { return '<circle cx="16" cy="22" r="11" fill="none" stroke="' + f + '" stroke-width="6"/><path d="M27 22H34" stroke="' + f + '" stroke-width="6" stroke-linecap="round"/><path d="M36 15L40 29" stroke="#3A2C22" stroke-width="2" stroke-dasharray="3 2"/>' },
    kblade: function (f) { return '<path d="M10 15L6 29" stroke="#3A2C22" stroke-width="2" stroke-dasharray="3 2"/><path d="M12 22H38M32 22v8M38 22v6" stroke="' + f + '" stroke-width="6" stroke-linecap="round"/>' },
    tornL: function (f) { return '<path d="M6 6H26L22 13L27 20L21 28L26 34L22 40H6Z" fill="#FFFDF4"' + STK.replace('3"', '2"') + '/><path d="M10 15H20M10 22H22M10 29H19" stroke="' + f + '" stroke-width="2.5"/>' },
    tornR: function (f) { return '<path d="M38 6H18L22 13L17 20L23 28L18 34L22 40H38Z" fill="#FFFDF4"' + STK.replace('3"', '2"') + '/><path d="M25 15H34M27 22H34M25 29H33" stroke="' + f + '" stroke-width="2.5"/>' },
    stick: function (f) { return '<path d="M8 36L36 8" stroke="' + f + '" stroke-width="6" stroke-linecap="round"/>' },
    hook: function (f) { return '<path d="M22 6V26Q22 36 14 36Q8 36 8 30" fill="none" stroke="' + f + '" stroke-width="5" stroke-linecap="round"/>' }
  };
  function item(kind, col) { return '<svg viewBox="0 0 44 44" aria-hidden="true" class="es-iv">' + (ITEM[kind] || ITEM.paper)(c(col || '#C9A24B')) + '</svg>' }
  return { A: A, c: c, shape: shape, arrow: arrow, thing: thing, item: item, esc: esc, COL: COL };
})();
