/* 수학 방탈출 그림 묶음 (2026-11-26, B안 · 그림책 삽화 2026-11-28): ART.A[이름](w, h, p, open) → 0,0~w,h 안에 그리는 SVG 조각.
   방 그림(장면)과 크게 보기 창에서 같은 함수를 씀. 이모지 대신 모두 직접 그린 도형(공통 덮개가 이모지를 바꾸지 않게).
   B안 규칙: 빛은 왼쪽 위 하나 → 위·왼쪽이 밝고 오른쪽 아래가 어두움, 물건 밑에 바닥 그림자, 테두리는 같은 계열 어두운 색.
   그림자·질감 도우미는 ART.fx(아래). 그러데이션·무늬는 문서에 하나만 있는 <svg id="hjb-defs">에 모아 두고 url(#hjb…)로 씀. */
var ART = (function () {
  var COL = { 빨강: '#E5534B', 주황: '#F08A24', 노랑: '#F2C230', 초록: '#3DA35D', 파랑: '#3B6FD6', 보라: '#8A5BC9', 분홍: '#EE7DB0', 갈색: '#9A6A3F', 하양: '#F6F3EC', 검정: '#2A2A2A', 하늘: '#6CC3EA', 회색: '#9AA0A8' };
  function c(n) { return COL[n] || n || '#9A6A3F' }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x] }) }
  function n1(v) { return Math.round(v * 10) / 10 }
  function R(x, y, w, h, f, o) { return '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + n1(Math.max(0, w)) + '" height="' + n1(Math.max(0, h)) + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o) { return '<text x="' + n1(x) + '" y="' + n1(y) + '" font-size="' + n1(size) + '" fill="' + (f || '#2A221C') + '" text-anchor="middle" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function E(cx, cy, rx, ry, f, o) { return '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy) + '" rx="' + n1(Math.max(0, rx)) + '" ry="' + n1(Math.max(0, ry)) + '" fill="' + f + '"' + (o || '') + '/>' }
  function C(cx, cy, r, f, o) { return '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(Math.max(0, r)) + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function emw(s) { var n = 0; String(s).split('').forEach(function (ch) { n += ch === ' ' ? .3 : /[가-힣]/.test(ch) ? 1.08 : .6 }); return n }
  function fitw(L, w) { return Math.min.apply(null, (L || []).map(function (s) { return (w - 20) / Math.max(1, emw(s)) }).concat([99])) }   /* 글줄이 폭 안에 들어가는 가장 큰 글자 */

  /* ───────────── B안 도우미 ART.fx ───────────── */
  var fx = (function () {
    var NS = 'http://www.w3.org/2000/svg', DEFS = null, HAVE = {}, ALL = [];
    /* 문서에 하나뿐인 그러데이션 창고(크기 0인 svg). 다시 그려도 지워지지 않게 body 끝에 둠 */
    function store() {
      if (DEFS && DEFS.isConnected) return DEFS;
      if (typeof document === 'undefined' || !document.body) return null;
      var s = document.getElementById('hjb-defs');
      if (!s) { s = document.createElementNS(NS, 'svg'); s.setAttribute('id', 'hjb-defs'); s.setAttribute('aria-hidden', 'true'); s.setAttribute('focusable', 'false'); s.setAttribute('style', 'position:absolute;left:0;top:0;width:0;height:0;overflow:hidden;pointer-events:none'); s.appendChild(document.createElementNS(NS, 'defs')); document.body.appendChild(s) }
      DEFS = s.firstChild; if (DEFS.childNodes.length < ALL.length) DEFS.innerHTML = ALL.join('');
      return DEFS;
    }
    function reg(id, mk) { if (!HAVE[id]) { HAVE[id] = 1; ALL.push(mk); var d = store(); if (d) d.insertAdjacentHTML('beforeend', mk) } else if (!(DEFS && DEFS.isConnected)) store() }
    function hid(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return 'hjb' + (h >>> 0).toString(36) }
    function hx(h) { h = String(h || '').trim(); if (/^#[0-9a-f]{3}$/i.test(h)) h = '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3]; var m = /^#([0-9a-f]{6})$/i.exec(h); if (!m) return null; var v = parseInt(m[1], 16); return [v >> 16 & 255, v >> 8 & 255, v & 255] }
    function toh(a) { return '#' + a.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return ('0' + v.toString(16)).slice(-2) }).join('') }
    /* sh(색, +밝게/−어둡게 0~1) */
    function sh(h, f) { h = c(h); var a = hx(h); if (!a) return h; var t = f > 0 ? 255 : 0, k = Math.abs(f); return toh(a.map(function (v) { return v + (t - v) * k })) }
    function mix(a, b, t) { var x = hx(c(a)), y = hx(c(b)); if (!x || !y) return c(a); return toh(x.map(function (v, i) { return v + (y[i] - v) * t })) }
    function lum(h) { var a = hx(c(h)); return a ? (a[0] * .299 + a[1] * .587 + a[2] * .114) / 255 : .5 }
    function stp(st) { return st.map(function (s) { return '<stop offset="' + s[0] + '" stop-color="' + s[1] + '"' + (s[2] != null ? ' stop-opacity="' + s[2] + '"' : '') + '/>' }).join('') }
    /* lin(멈춤 [[0,색,투명도]…], x1,y1,x2,y2) — 기본 위→아래. 같은 설정이면 같은 id를 다시 씀 */
    function lin(st, x1, y1, x2, y2) { x1 = x1 || 0; y1 = y1 || 0; x2 = x2 == null ? 0 : x2; y2 = y2 == null ? 1 : y2; var k = 'L' + JSON.stringify([st, x1, y1, x2, y2]), id = hid(k); reg(id, '<linearGradient id="' + id + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">' + stp(st) + '</linearGradient>'); return 'url(#' + id + ')' }
    function rad(st, cx, cy, r, fx_, fy) { cx = cx == null ? .5 : cx; cy = cy == null ? .5 : cy; r = r || .5; var k = 'R' + JSON.stringify([st, cx, cy, r, fx_, fy]), id = hid(k); reg(id, '<radialGradient id="' + id + '" cx="' + cx + '" cy="' + cy + '" r="' + r + '"' + (fx_ != null ? ' fx="' + fx_ + '" fy="' + fy + '"' : '') + '>' + stp(st) + '</radialGradient>'); return 'url(#' + id + ')' }
    /* 재질별 면 색: 왼쪽 위가 밝음 */
    var MAT = {
      paint: function (k) { return lin([[0, sh(k, .16)], [.6, k], [1, sh(k, -.18)]], 0, 0, .4, 1) },
      wood: function (k) { return lin([[0, sh(k, .22)], [.45, k], [1, sh(k, -.26)]], 0, 0, .5, 1) },
      metal: function (k) { return lin([[0, sh(k, .55)], [.28, sh(k, .14)], [.55, sh(k, -.1)], [.78, sh(k, .2)], [1, sh(k, -.32)]], 0, 0, 1, .35) },
      glass: function (k) { return lin([[0, '#FFFFFF', .8], [.45, k, .42], [1, sh(k, -.25), .7]], 0, 0, 1, 1) },
      cloth: function (k) { return lin([[0, sh(k, .14)], [1, sh(k, -.18)]], 0, 0, .2, 1) },
      paper: function (k) { return lin([[0, sh(k, .12)], [.6, k], [1, mix(k, '#D9BE8C', .22)]], 0, 0, 1, 1) },
      stone: function (k) { return lin([[0, sh(k, .2)], [.55, k], [1, sh(k, -.3)]], 0, 0, .6, 1) },
      plastic: function (k) { return lin([[0, sh(k, .45)], [.22, sh(k, .14)], [.6, k], [1, sh(k, -.22)]], 0, 0, .15, 1) },
      gold: function () { return lin([[0, '#FFF1B0'], [.35, '#F2C94C'], [.7, '#C99A2A'], [1, '#8C6512']], 0, 0, .6, 1) },
      screen: function (k) { return lin([[0, sh(k, .16)], [1, sh(k, -.32)]]) },
      ball: function (k) { return rad([[0, sh(k, .6)], [.45, k], [1, sh(k, -.36)]], .5, .5, .62, .32, .28) },
      cyl: function (k) { return lin([[0, sh(k, -.12)], [.25, sh(k, .38)], [.6, k], [1, sh(k, -.36)]], 0, 0, 1, 0) },
      cylv: function (k) { return lin([[0, sh(k, .3)], [.35, k], [1, sh(k, -.34)]]) }
    };
    function mat(kind, col) { return (MAT[kind] || MAT.paint)(c(col)) }
    /* 테두리: 진한 검은 선 대신 같은 계열 어두운 색 */
    function edge(col, w) { return ' stroke="' + sh(col, -.5) + '" stroke-width="' + (w || 1.6) + '" stroke-linejoin="round"' }
    /* 바닥 그림자(물건 밑, 가운데가 진하고 가장자리가 사라짐) */
    function ground(cx, cy, rx, ry, op) { return E(cx, cy, rx, ry, rad([[0, '#2A1608', .46], [.6, '#2A1608', .2], [1, '#2A1608', 0]]), op != null ? ' opacity="' + op + '"' : '') }
    /* 흐린 드롭 그림자(벽에 건 것만: 필터는 아껴서) — 안쪽 모양을 어두운 색으로 오른쪽 아래에 한 번 더 */
    function blur() { reg('hjbblur', '<filter id="hjbblur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4"/></filter>'); return 'url(#hjbblur)' }
    function drop(inner, dx, dy, op) { return '<g transform="translate(' + (dx == null ? 6 : dx) + ' ' + (dy == null ? 8 : dy) + ')" filter="' + blur() + '" opacity="' + (op || .28) + '">' + inner.replace(/fill="[^"]*"/g, 'fill="#2A1608"').replace(/stroke="[^"]*"/g, 'stroke="none"').replace(/<text[^>]*>[^<]*<\/text>/g, '') + '</g>' }
    /* 위쪽 빛(반사) · 오른쪽 그늘 · 반짝 점 · 빛줄 */
    function gloss(x, y, w, h, rx, op) { return R(x, y, w, h, lin([[0, '#FFFFFF', op == null ? .5 : op], [1, '#FFFFFF', 0]]), rx ? ' rx="' + rx + '"' : '') }
    function shade(x, y, w, h, rx, op) { return R(x, y, w, h, lin([[0, '#1A0E06', 0], [1, '#1A0E06', op == null ? .22 : op]], 0, 0, 1, 0), rx ? ' rx="' + rx + '"' : '') }
    function spec(cx, cy, rx, ry, op) { return E(cx, cy, rx, ry == null ? rx : ry, '#FFFFFF', ' opacity="' + (op == null ? .75 : op) + '"') }
    function streak(d, w, op) { return '<path d="' + d + '" fill="none" stroke="#FFFFFF" stroke-opacity="' + (op == null ? .7 : op) + '" stroke-width="' + (w || 2) + '" stroke-linecap="round"/>' }
    /* 나뭇결: 가로(기본) 또는 세로로 물결 선 n개 */
    function grain(x, y, w, h, col, n, vert) {
      var o = '', k = sh(col, -.45); n = n || 4;
      for (var i = 0; i < n; i++) {
        if (vert) { var gx = x + w * (i + .5) / n; o += '<path d="M' + n1(gx) + ' ' + n1(y + 2) + 'Q' + n1(gx + w / n * .22) + ' ' + n1(y + h * .5) + ' ' + n1(gx - w / n * .1) + ' ' + n1(y + h - 2) + '"' }
        else { var gy = y + h * (i + .5) / n; o += '<path d="M' + n1(x + 2) + ' ' + n1(gy) + 'Q' + n1(x + w * .5) + ' ' + n1(gy - h / n * .22) + ' ' + n1(x + w - 2) + ' ' + n1(gy + h / n * .1) + '"' }
        o += ' fill="none" stroke="' + k + '" stroke-opacity=".16" stroke-width="1.2"/>';
      }
      return o;
    }
    /* 무늬(pattern, 사용자 좌표): 'tile' 타일 · 'brick' 벽돌 · 'stripe' 벽지 줄 · 'dot' 작은 점 */
    function pat(kind, col, s) {
      col = c(col); s = s || 50; var id = hid('P' + kind + col + s), dk = sh(col, -.16), lt = sh(col, .35), body = '', W = s, H = s;
      if (kind === 'tile') body = '<rect width="' + s + '" height="' + s + '" fill="' + col + '"/><rect x="1" y="1" width="' + (s - 2) + '" height="' + (s - 2) + '" rx="3" fill="' + sh(col, .06) + '"/><path d="M2 ' + (s - 2) + 'V2H' + (s - 2) + '" fill="none" stroke="' + lt + '" stroke-opacity=".7" stroke-width="1.5"/><path d="M2 ' + (s - 1.5) + 'H' + (s - 1.5) + 'V2" fill="none" stroke="' + dk + '" stroke-opacity=".55" stroke-width="1.5"/>';
      else if (kind === 'brick') { W = 80; H = 36; body = '<rect width="80" height="36" fill="' + sh(col, -.1) + '"/>' + [[2, 2, 76], [-38, 20, 76], [42, 20, 76]].map(function (b) { return '<rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="14" rx="2" fill="' + col + '"/><path d="M' + (b[0] + 1) + ' ' + (b[1] + 13) + 'V' + (b[1] + 1) + 'H' + (b[0] + b[2] - 1) + '" fill="none" stroke="' + lt + '" stroke-opacity=".6" stroke-width="1.2"/>' }).join('') }
      else if (kind === 'stripe') { W = 60; H = 60; body = '<rect width="60" height="60" fill="' + col + '"/><rect width="30" height="60" fill="' + dk + '" opacity=".35"/><rect x="29" width="1.5" height="60" fill="' + lt + '" opacity=".7"/><circle cx="45" cy="30" r="2" fill="' + dk + '" opacity=".35"/>' }
      else if (kind === 'dot') body = '<rect width="' + s + '" height="' + s + '" fill="' + col + '"/><circle cx="' + s / 2 + '" cy="' + s / 2 + '" r="' + s * .08 + '" fill="' + dk + '" opacity=".5"/>';
      reg(id, '<pattern id="' + id + '" patternUnits="userSpaceOnUse" width="' + W + '" height="' + H + '">' + body + '</pattern>');
      return 'url(#' + id + ')';
    }
    /* 상자 한 면: 재질 그러데이션 + 같은 계열 테두리 + 위쪽 빛 */
    function box(x, y, w, h, col, kind, rx, ew) { col = c(col); var r = rx ? ' rx="' + rx + '"' : ''; return R(x, y, w, h, mat(kind || 'paint', col), edge(col, ew) + r) + (h > 10 && w > 10 ? gloss(x + 1.5, y + 1.5, w - 3, Math.min(h * .22, 14), rx ? Math.max(0, rx - 1) : 0, .35) : '') }
    /* 단단한 공 모양 그러데이션 */
    function ball(col) { return MAT.ball(c(col)) }
    /* 작은 모양(○△□☆◇♡)을 입체로 — 자리·크기는 ART.shape와 같음 */
    function shp(k, cx, cy, r, col) {
      col = c(col || '#3A2C22'); var d = shapeD(k, cx, cy, r), f = k === '○' ? ball(col) : mat('plastic', col);
      return P(d, f, edge(col, Math.max(1, Math.min(2, r * .12)))) + (r > 6 ? streak('M' + n1(cx - r * .5) + ' ' + n1(cy - r * .18) + 'Q' + n1(cx - r * .38) + ' ' + n1(cy - r * .52) + ' ' + n1(cx - r * .02) + ' ' + n1(cy - r * .58), Math.max(1, r * .14), .6) : '');
    }
    /* 금속 손잡이·나사 */
    function knob(cx, cy, r, col) { return C(cx + r * .25, cy + r * .35, r, '#2A1608', ' opacity=".22"') + C(cx, cy, r, ball(col || '#E2B84A'), edge(col || '#C99A2A', 1)) }
    function screw(cx, cy, r) { return C(cx, cy, r, ball('#B9C0C8'), ' stroke="#5E6670" stroke-width=".8"') + '<path d="M' + n1(cx - r * .6) + ' ' + n1(cy + r * .3) + 'L' + n1(cx + r * .6) + ' ' + n1(cy - r * .3) + '" stroke="#5E6670" stroke-width=".9"/>' }
    /* 화면 유리 반사 */
    function glassHL(x, y, w, h, op) { op = op == null ? .14 : op; return P('M' + n1(x) + ' ' + n1(y) + 'H' + n1(x + w * .42) + 'L' + n1(x + w * .2) + ' ' + n1(y + h) + 'H' + n1(x) + 'Z', '#FFFFFF', ' opacity="' + op + '"') + P('M' + n1(x + w * .5) + ' ' + n1(y) + 'H' + n1(x + w * .58) + 'L' + n1(x + w * .36) + ' ' + n1(y + h) + 'H' + n1(x + w * .28) + 'Z', '#FFFFFF', ' opacity="' + op * .6 + '"') }
    function defs() { return '<defs>' + ALL.join('') + '</defs>' }
    return { ensure: store, sh: sh, mix: mix, lum: lum, lin: lin, rad: rad, mat: mat, MAT: MAT, edge: edge, ground: ground, drop: drop, blur: blur, gloss: gloss, shade: shade, spec: spec, streak: streak, grain: grain, pat: pat, box: box, ball: ball, shape: shp, knob: knob, screw: screw, glassHL: glassHL, defs: defs, n1: n1, R: R, T: T, E: E, C: C, P: P };
  })();
  var sh = fx.sh, edge = fx.edge, mat = fx.mat, ball = fx.ball;
  var INK = '#4A3426', S2 = ' stroke="' + INK + '" stroke-opacity=".55" stroke-width="1.5" stroke-linejoin="round"';

  /* 작은 모양: ○ △ □ ☆ ◇ 하트 — 단추·글 속 모양(납작한 한 색). 그림 속에서는 fx.shape(입체) */
  function shapeD(k, cx, cy, r) {
    if (k === '○') return 'M' + n1(cx - r) + ' ' + n1(cy) + 'a' + n1(r) + ' ' + n1(r) + ' 0 1 0 ' + n1(r * 2) + ' 0a' + n1(r) + ' ' + n1(r) + ' 0 1 0 ' + n1(-r * 2) + ' 0Z';
    if (k === '△') return 'M' + n1(cx) + ' ' + n1(cy - r) + 'L' + n1(cx + r * .95) + ' ' + n1(cy + r * .75) + 'H' + n1(cx - r * .95) + 'Z';
    if (k === '□') return 'M' + n1(cx - r * .82) + ' ' + n1(cy - r * .82) + 'h' + n1(r * 1.64) + 'v' + n1(r * 1.64) + 'h' + n1(-r * 1.64) + 'Z';
    if (k === '◇') return 'M' + n1(cx) + ' ' + n1(cy - r) + 'L' + n1(cx + r) + ' ' + n1(cy) + 'L' + n1(cx) + ' ' + n1(cy + r) + 'L' + n1(cx - r) + ' ' + n1(cy) + 'Z';
    if (k === '♡') return 'M' + n1(cx) + ' ' + n1(cy + r * .8) + 'C' + n1(cx - r * 1.4) + ' ' + n1(cy - r * .1) + ' ' + n1(cx - r * .6) + ' ' + n1(cy - r * 1.1) + ' ' + n1(cx) + ' ' + n1(cy - r * .35) + 'C' + n1(cx + r * .6) + ' ' + n1(cy - r * 1.1) + ' ' + n1(cx + r * 1.4) + ' ' + n1(cy - r * .1) + ' ' + n1(cx) + ' ' + n1(cy + r * .8) + 'Z';
    var d = ''; for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1) } return d + 'Z';
  }
  function shape(k, cx, cy, r, f) {
    f = f || '#3A2C22';
    if (k === '○') return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"/>';
    if (k === '□') return '<rect x="' + (cx - r * .82) + '" y="' + (cy - r * .82) + '" width="' + r * 1.64 + '" height="' + r * 1.64 + '" fill="' + f + '"/>';
    return '<path d="' + shapeD(k, cx, cy, r) + '" fill="' + f + '"/>';
  }
  function arrow(dir, cx, cy, r, f) { var a = { '↑': 0, '→': 90, '↓': 180, '←': 270 }[dir] || 0; return '<g transform="translate(' + cx + ' ' + cy + ') rotate(' + a + ')"><path d="M0 ' + (-r) + 'L' + (r * .8) + ' 0H' + (r * .32) + 'V' + r + 'H' + (-r * .32) + 'V0H' + (-r * .8) + 'Z" fill="' + (f || '#3A2C22') + '"/></g>' }

  /* 작은 물건(선반·탁자 위에 놓는 것): 높이 s 안에 그림 — 자리·크기·개수는 예전과 같음 */
  function thing(k, x, y, s, col) {
    var f = c(col), e = edge(f, 1.3), g = fx.ground(x + s * .42, y + s * .99, s * .42, s * .07, .8);
    if (k === 'block') return g + fx.box(x, y + s * .25, s * .8, s * .75, f, 'plastic', 2, 1.3) + fx.shade(x + s * .55, y + s * .25, s * .25, s * .75, 0, .18) + fx.box(x + s * .15, y + s * .1, s * .5, s * .17, f, 'plastic', 2, 1.3);
    if (k === 'book') return R(x, y, s * .32, s, mat('cloth', f), e + ' rx="1.5"') + R(x, y + s * .06, s * .32, s * .04, sh(f, -.3), ' opacity=".6"') + R(x, y + s * .9, s * .32, s * .04, sh(f, -.3), ' opacity=".6"') + R(x + s * .06, y + s * .2, s * .2, s * .08, '#fff', ' opacity=".75" rx="1"') + R(x + s * .02, y + 1, s * .07, s - 2, '#fff', ' opacity=".22"');
    if (k === 'ball') return g + C(x + s * .45, y + s * .55, s * .42, ball(f), e) + '<path d="M' + n1(x + s * .1) + ' ' + n1(y + s * .5) + 'Q' + n1(x + s * .45) + ' ' + n1(y + s * .75) + ' ' + n1(x + s * .82) + ' ' + n1(y + s * .45) + '" fill="none" stroke="#fff" stroke-width="' + n1(Math.max(1.5, s * .06)) + '" opacity=".7"/>' + fx.spec(x + s * .32, y + s * .36, s * .08, s * .05, .8);
    if (k === 'jar') return g + R(x + s * .05, y + s * .2, s * .7, s * .8, mat('plastic', f), e + ' rx="' + n1(s * .12) + '"') + R(x + s * .12, y + s * .05, s * .56, s * .18, mat('metal', '#9AA2AC'), edge('#8C8C8C', 1.2) + ' rx="4"') + R(x + s * .17, y + s * .32, s * .12, s * .5, '#fff', ' opacity=".5" rx="' + n1(s * .05) + '"') + fx.shade(x + s * .5, y + s * .22, s * .24, s * .76, s * .1, .2);
    if (k === 'bear') { var gb = ball(f); return g + C(x + s * .4, y + s * .66, s * .3, gb, e) + C(x + s * .4, y + s * .3, s * .24, gb, e) + C(x + s * .2, y + s * .1, s * .09, gb, e) + C(x + s * .6, y + s * .1, s * .09, gb, e) + E(x + s * .4, y + s * .37, s * .09, s * .06, sh(f, .35)) + C(x + s * .33, y + s * .27, 2.4, '#2A221C') + C(x + s * .47, y + s * .27, 2.4, '#2A221C') + fx.spec(x + s * .3, y + s * .18, Math.min(4, s * .05), Math.min(2.5, s * .03), .6) }
    if (k === 'flask') { var fp = 'M' + n1(x + s * .3) + ' ' + n1(y) + 'h' + n1(s * .2) + 'v' + n1(s * .35) + 'l' + n1(s * .3) + ' ' + n1(s * .55) + 'q0 ' + n1(s * .1) + ' -' + n1(s * .1) + ' ' + n1(s * .1) + 'h-' + n1(s * .6) + 'q-' + n1(s * .1) + ' 0 -' + n1(s * .1) + ' -' + n1(s * .1) + 'l' + n1(s * .3) + ' -' + n1(s * .55) + 'z'; return g + P(fp, mat('glass', '#DCEBF3'), edge('#9AB4C4', 1.3)) + '<path d="M' + n1(x + s * .12) + ' ' + n1(y + s * .75) + 'h' + n1(s * .56) + 'l' + n1(s * .09) + ' ' + n1(s * .16) + 'q0 ' + n1(s * .05) + ' -.05 ' + n1(s * .05) + 'h-' + n1(s * .7) + 'q-.05 0 -.05 -' + n1(s * .05) + 'z" fill="' + mat('plastic', f) + '"/>' + fx.streak('M' + n1(x + s * .34) + ' ' + n1(y + s * .1) + 'V' + n1(y + s * .34) + 'L' + n1(x + s * .2) + ' ' + n1(y + s * .62), Math.max(1, s * .05), .6) }
    if (k === 'candy') { var cx = x + s * .45, cy = y + s * .5, r = s * .26; return g + P('M' + n1(x + s * .2) + ' ' + n1(cy) + 'l-' + n1(s * .18) + ' -' + n1(s * .14) + 'v' + n1(s * .28) + 'z M' + n1(x + s * .7) + ' ' + n1(cy) + 'l' + n1(s * .18) + ' -' + n1(s * .14) + 'v' + n1(s * .28) + 'z', mat('plastic', f), e) + C(cx, cy, r, ball(f), e) + fx.streak('M' + n1(cx - r * .55) + ' ' + n1(cy - r * .1) + 'Q' + n1(cx - r * .4) + ' ' + n1(cy - r * .62) + ' ' + n1(cx + r * .1) + ' ' + n1(cy - r * .66), Math.max(1.2, r * .2), .85) }
    if (k === 'star') return g + fx.shape('☆', x + s * .45, y + s * .5, s * .45, f);
    if (k === 'shell') { var sp = 'M' + n1(x + s * .45) + ' ' + n1(y + s) + 'L' + n1(x) + ' ' + n1(y + s * .35) + 'Q' + n1(x + s * .45) + ' ' + n1(y - s * .2) + ' ' + n1(x + s * .9) + ' ' + n1(y + s * .35) + 'Z', rr = ''; [.18, .45, .72].forEach(function (t) { rr += '<path d="M' + n1(x + s * .45) + ' ' + n1(y + s * .95) + 'L' + n1(x + s * .9 * t) + ' ' + n1(y + s * (.28 - Math.abs(t - .45) * .1)) + '" stroke="' + sh(f, -.35) + '" stroke-opacity=".5" stroke-width="1.2"/>' }); return g + P(sp, fx.rad([[0, sh(f, .5)], [.6, f], [1, sh(f, -.25)]], .5, .2, .9, .4, .1), e) + rr }
    if (k === 'gem') { var top = y + s * .35; return g + P('M' + n1(x + s * .1) + ' ' + n1(top) + 'L' + n1(x + s * .3) + ' ' + n1(y + s * .1) + 'H' + n1(x + s * .65) + 'L' + n1(x + s * .85) + ' ' + n1(top) + 'L' + n1(x + s * .47) + ' ' + n1(y + s * .95) + 'Z', mat('plastic', f), e) + P('M' + n1(x + s * .1) + ' ' + n1(top) + 'H' + n1(x + s * .85) + 'L' + n1(x + s * .65) + ' ' + n1(y + s * .1) + 'H' + n1(x + s * .3) + 'Z', sh(f, .35), ' opacity=".85"') + P('M' + n1(x + s * .47) + ' ' + n1(y + s * .95) + 'L' + n1(x + s * .85) + ' ' + n1(top) + 'H' + n1(x + s * .55) + 'Z', sh(f, -.3), ' opacity=".55"') + fx.spec(x + s * .36, y + s * .2, s * .07, s * .04, .9) }
    if (k === 'fish') return g + P('M' + n1(x + s * .7) + ' ' + n1(y + s * .5) + 'l' + n1(s * .22) + ' -' + n1(s * .17) + 'v' + n1(s * .34) + 'z', mat('plastic', sh(f, -.08)), e) + E(x + s * .4, y + s * .5, s * .32, s * .2, mat('plastic', f), e) + '<path d="M' + n1(x + s * .36) + ' ' + n1(y + s * .52) + 'q' + n1(s * .1) + ' ' + n1(s * .1) + ' ' + n1(s * .18) + ' 0" fill="' + sh(f, -.2) + '" opacity=".6"/>' + C(x + s * .25, y + s * .45, 2.5, '#2A221C') + C(x + s * .245, y + s * .44, .9, '#fff') + fx.spec(x + s * .38, y + s * .38, s * .1, s * .03, .55);
    return g + fx.shape(k, x + s * .45, y + s * .5, s * .42, f);
  }
  /* 물건을 줄지어 놓기: items = [{k, c, n}] → 왼쪽부터 */
  function row(items, x, y, w, s) { var o = '', cx = x, step = s * .95; (items || []).forEach(function (it) { for (var i = 0; i < (it.n || 1); i++) { if (cx + s * .8 > x + w) return; o += thing(it.k, cx, y, s, it.c); cx += it.k === 'book' ? s * .36 : step } }); return o }

  var A = {};
  A.door = function (w, h, p, open) {
    var f = c(p.c || '갈색'), fr = '#7A5638', o = R(0, 0, w, h, mat('wood', fr), edge(fr, 1.8) + ' rx="8"') + fx.grain(2, 2, 8, h - 4, fr, 1, true) + fx.grain(w - 10, 2, 8, h - 4, fr, 1, true) + R(10, h - 3, w - 20, 3, '#1A0E06', ' opacity=".3"');
    if (open) return o + R(10, 10, w - 20, h - 10, fx.lin([[0, '#0E0B09'], [.7, '#2A211A'], [1, '#4A3A2C']]), ' rx="6"') + P('M' + n1(w * .3) + ' ' + h + 'L' + n1(w * .7) + ' ' + h + 'L' + n1(w - 14) + ' ' + n1(h * .45) + 'L' + n1(w * .45) + ' ' + n1(h * .45) + 'Z', fx.lin([[0, '#FFE9A8', 0], [1, '#FFE9A8', .35]])) + R(w * .2, h * .3, w * .6, h * .4, '#FFE9A8', ' opacity=".22"') + P('M10 10L' + n1(w * .55) + ' 30V' + (h - 10) + 'L10 ' + h + 'Z', mat('wood', f), edge(f, 1.8)) + fx.shade(w * .32, 24, w * .23, h - 36, 0, .25) + fx.knob(w * .45, h * .55, 5, '#E2B84A');
    o += fx.box(10, 10, w - 20, h - 10, f, 'wood', 6, 1.8) + fx.grain(12, 14, w - 24, h - 16, f, 3, true);
    [[24, 26, w - 48, h * .36], [24, h * .48, w - 48, h * .42]].forEach(function (q) {
      o += R(q[0], q[1], q[2], q[3], sh(f, -.07), ' rx="4"') + '<path d="M' + q[0] + ' ' + n1(q[1] + q[3]) + 'V' + q[1] + 'H' + n1(q[0] + q[2]) + '" fill="none" stroke="#1A0E06" stroke-opacity=".3" stroke-width="3"/><path d="M' + q[0] + ' ' + n1(q[1] + q[3]) + 'H' + n1(q[0] + q[2]) + 'V' + q[1] + '" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2.5"/>';
    });
    o += R(12, 12, w * .26, h - 14, fx.lin([[0, '#fff', .18], [1, '#fff', 0]], 0, 0, 1, 0)) + fx.shade(w * .7, 12, w * .3 - 12, h - 14, 0, .18);
    o += R(w - 37, h * .55 - 14, 13, 30, mat('gold'), edge('#C99A2A', 1) + ' rx="5"') + fx.knob(w - 30, h * .55, 8, '#E2B84A');
    if (p.sign) { var sw = Math.max(w * .76, Math.min(w + 20, emw(p.sign) * 18 + 16)), sx = (w - sw) / 2; o += '<path d="M' + n1(w * .38) + ' -18L' + n1(w / 2) + ' -27L' + n1(w * .62) + ' -18" fill="none" stroke="#6B5A4A" stroke-width="1.8"/>' + C(w / 2, -27, 2.5, ball('#B9C0C8')) + R(sx + 3, -15, sw, 30, '#1A0E06', ' opacity=".22" rx="6"') + R(sx, -18, sw, 30, mat('paint', '#2E7D5B'), edge('#2E7D5B', 1.4) + ' rx="6"') + fx.gloss(sx + 2, -16, sw - 4, 8, 4, .3) + T(w / 2, 3, p.sign, Math.min(18, (sw - 12) / emw(p.sign)), '#fff') }   /* 긴 이름표는 판을 넓히고 그래도 길면 글자를 줄임 */
    if (p.keypad) { o += R(w + 10, h * .4 + 3, 34, 52, '#1A0E06', ' opacity=".22" rx="5"') + R(w + 8, h * .4, 34, 52, mat('metal', '#5A606B'), edge('#3A3F48', 1.4) + ' rx="5"') + R(w + 13, h * .4 + 6, 24, 12, fx.lin([[0, '#C2FFD2'], [1, '#55D17A']]), ' rx="2"') + [0, 1, 2].map(function (i) { return R(w + 13 + i * 8, h * .4 + 24, 6, 6, mat('plastic', '#D9DEE4'), ' rx="1.5"') + R(w + 13 + i * 8, h * .4 + 34, 6, 6, mat('plastic', '#D9DEE4'), ' rx="1.5"') }).join('') }
    return o;
  };
  A.clock = function (w, h, p) {
    var r = Math.min(w, h) / 2 - 4, cx = w / 2, cy = h / 2, face = c(p.c || '#FFF8E8'), o = fx.drop(C(cx, cy, r, '#000'), 5, 7);
    o += C(cx, cy, r, fx.lin([[0, '#D79A5E'], [.5, '#A9693A'], [1, '#6E3F1E']], 0, 0, 1, 1), edge('#8A5530', 1.4)) + C(cx, cy, r - 1.5, 'none', ' stroke="#F0C48E" stroke-opacity=".55" stroke-width="1.2"');
    o += C(cx, cy, r * .95, fx.rad([[0, sh(face, .5)], [.8, face], [1, sh(face, -.14)]], .5, .5, .5, .42, .4), ' stroke="#6E3F1E" stroke-opacity=".35" stroke-width="1.2"');
    o += '<path d="M' + n1(cx - r * .72) + ' ' + n1(cy - r * .22) + 'A' + n1(r * .78) + ' ' + n1(r * .78) + ' 0 0 1 ' + n1(cx - r * .12) + ' ' + n1(cy - r * .76) + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="' + n1(r * .06) + '" stroke-linecap="round"/>';
    for (var i = 1; i <= 12; i++) { var a = i * Math.PI / 6; o += T(cx + Math.sin(a) * r * .78, cy - Math.cos(a) * r * .78 + r * .09, i, r * .22) }
    var hh = (p.h % 12 + (p.m || 0) / 60) * Math.PI / 6, mm = (p.m || 0) * Math.PI / 30;
    function hand(ang, len, wd, col, d) { return '<line x1="' + n1(cx + d) + '" y1="' + n1(cy + d) + '" x2="' + n1(cx + Math.sin(ang) * len + d) + '" y2="' + n1(cy - Math.cos(ang) * len + d) + '" stroke="' + col + '" stroke-width="' + n1(wd) + '" stroke-linecap="round"/>' }
    o += '<g opacity=".22">' + hand(hh, r * .45, r * .09, '#000', 2) + hand(mm, r * .7, r * .05, '#000', 2) + '</g>';
    o += hand(hh, r * .45, r * .09, '#2A221C', 0) + hand(mm, r * .7, r * .05, '#C8402F', 0) + C(cx, cy, r * .06, ball('#C9A24B'), ' stroke="#6E4A14" stroke-width=".8"');
    return o;
  };
  A.shelf = function (w, h, p) {
    var rows = p.rows || [], n = Math.max(1, rows.length), rh = (h - 14) / n, f = c(p.c || '#B98552'), o = fx.ground(w / 2, h, w * .56, 9) + R(0, 0, w, h, mat('wood', f), edge(f, 1.8) + ' rx="4"') + R(2, 2, w - 4, 4, sh(f, .35), ' rx="2"') + fx.grain(1, 6, 7, h - 12, f, 1, true) + fx.grain(w - 8, 6, 7, h - 12, f, 1, true);
    for (var i = 0; i < n; i++) {
      var y = 7 + i * rh;
      o += R(8, y, w - 16, rh - 8, fx.lin([[0, sh(f, -.5)], [.4, sh(f, -.3)], [1, sh(f, -.18)]]), '') + R(8, y, 9, rh - 8, '#1A0E06', ' opacity=".16"') + fx.grain(8, y, w - 16, rh - 8, sh(f, -.3), 3);
      o += R(4, y + rh - 8, w - 8, 3, sh(f, .3)) + R(4, y + rh - 5, w - 8, 5, sh(f, -.28)) + R(8, y + rh, w - 16, 3, '#1A0E06', ' opacity=".18"');
      o += row(rows[i], 14, y + rh * .18, w - 24, Math.min(rh * .72, 46));
    }
    return o + fx.shade(w - 10, 0, 10, h, 4, .2);
  };
  A.table = function (w, h, p) {
    var f = c(p.c || '#B98552'), lg = sh(f, -.3);
    return fx.ground(w / 2, h, w * .52, 8) + R(w * .08, h * .37, 12, h * .63, mat('cyl', lg), edge(lg, 1.2)) + R(w * .92 - 12, h * .37, 12, h * .63, mat('cyl', lg), edge(lg, 1.2)) + R(w * .06, h * .37, w * .88, 5, '#1A0E06', ' opacity=".18"')
      + fx.box(0, h * .25, w, h * .12, f, 'wood', 4, 1.6) + fx.grain(4, h * .25, w - 8, h * .12, f, 2) + row(p.items, w * .06, 0, w * .88, h * .25);
  };
  A.box = function (w, h, p, open) {
    var f = c(p.c || '#D99A4E'), o = fx.ground(w / 2, h, w * .56, 8) + fx.box(0, h * .25, w, h * .75, f, 'paint', 6, 1.8) + fx.shade(w * .78, h * .25, w * .22, h * .75, 6, .2);
    o += open ? P('M0 ' + n1(h * .25) + 'L-' + n1(w * .08) + ' 0H' + n1(w * .92) + 'L' + w + ' ' + n1(h * .25) + 'Z', mat('paint', sh(f, .1)), edge(f, 1.6) + ' opacity=".92"') + R(6, h * .25, w - 12, h * .12, fx.lin([[0, '#1A120C', .75], [1, '#1A120C', .25]]))
      : R(-4, h * .15, w + 8, h * .16, mat('paint', sh(f, .08)), edge(f, 1.6) + ' rx="5"') + fx.gloss(-2, h * .15 + 1, w + 4, h * .06, 4, .4) + R(-4, h * .31, w + 8, 4, '#1A0E06', ' opacity=".16"') + (p.lock ? R(w / 2 - 12, h * .3, 24, 28, mat('gold'), edge('#C99A2A', 1.4) + ' rx="4"') + C(w / 2, h * .3 + 12, 4, '#3A2C22') + R(w / 2 - 1.5, h * .3 + 13, 3, 8, '#3A2C22') + fx.spec(w / 2 - 6, h * .3 + 5, 4, 2, .7) : '');
    if (p.label) o += R(w * .15, h * .5, w * .7, h * .3, mat('paper', '#FFFDF8'), edge('#C9B79A', 1.2) + ' rx="5"') + T(w / 2, h * .5 + h * .2, p.label, Math.min(28, h * .2, (w * .7 - 12) / Math.max(1, emw(p.label))));
    return o;
  };
  A.chest = function (w, h, p, open) {
    var f = c(p.c || '#A0522D'), o = fx.ground(w / 2, h, w * .56, 8);
    o += open ? P('M0 ' + n1(h * .4) + 'Q' + n1(w / 2) + ' -' + n1(h * .2) + ' ' + w + ' ' + n1(h * .4) + 'Z', mat('wood', f), edge(f, 1.8) + ' opacity=".92"') + R(6, h * .38, w - 12, h * .1, fx.lin([[0, '#FFE58A'], [1, '#D6A93A']]), ' opacity=".8"') + C(w * .35, h * .4, 4, '#fff', ' opacity=".7"')
      : P('M0 ' + n1(h * .42) + 'Q' + n1(w / 2) + ' 0 ' + w + ' ' + n1(h * .42) + 'Z', mat('wood', sh(f, .06)), edge(f, 1.8)) + '<path d="M' + n1(w * .12) + ' ' + n1(h * .3) + 'Q' + n1(w * .35) + ' ' + n1(h * .1) + ' ' + n1(w * .55) + ' ' + n1(h * .1) + '" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>';
    o += fx.box(0, h * .4, w, h * .6, f, 'wood', 6, 1.8) + fx.grain(2, h * .42, w - 4, h * .56, f, 3) + fx.shade(w * .75, h * .4, w * .25, h * .6, 6, .22);
    o += R(0, h * .55, w, 8, mat('metal', '#7A4A26'), edge('#6B3A1F', 1)) + R(w * .45, h * .35, w * .1, h * .3, mat('gold'), edge('#A07A1A', 1.3)) + fx.screw(w * .06, h * .59, 2.4) + fx.screw(w * .94, h * .59, 2.4);
    return o;
  };
  A.desk = function (w, h, p, open) {
    var f = c(p.c || '#B98552'), lg = sh(f, -.3), o = fx.ground(w / 2, h, w * .55, 8) + R(w * .9, h * .42, w * .06, h * .58, mat('cyl', lg), edge(lg, 1.2)) + fx.box(w * .05, h * .42, w * .45, h * .58, f, 'wood', 0, 1.6) + fx.shade(w * .38, h * .42, w * .12, h * .58, 0, .2) + R(w * .05, h * .42, w * .9, 5, '#1A0E06', ' opacity=".18"') + fx.box(0, h * .3, w, h * .12, f, 'wood', 4, 1.6) + fx.grain(4, h * .3, w - 8, h * .12, f, 2);
    o += open ? R(w * .02, h * .5, w * .52, h * .2, mat('wood', sh(f, -.18)), edge(f, 1.6)) + R(w * .06, h * .5, w * .44, h * .06, '#1A120C', ' opacity=".5"') : fx.box(w * .1, h * .5, w * .35, h * .18, f, 'wood', 2, 1.4) + fx.knob(w * .275, h * .59, 5, '#E2B84A');
    o += fx.box(w * .1, h * .72, w * .35, h * .18, f, 'wood', 2, 1.4) + row(p.items, w * .1, 0, w * .8, h * .3);
    return o;
  };
  A.safe = function (w, h, p, open) {
    var g = '#6E7580', o = fx.ground(w / 2, h, w * .56, 8) + R(0, 0, w, h, mat('metal', g), edge(g, 2) + ' rx="8"');
    if (open) return o + R(10, 10, w - 20, h - 20, fx.lin([[0, '#14171C'], [1, '#3A3F48']]), ' rx="5"') + R(16, h * .55, w - 32, 4, '#8A929C', ' opacity=".5"') + P('M10 10L-' + n1(w * .25) + ' 28V' + (h - 4) + 'L10 ' + (h - 10) + 'Z', mat('metal', '#8A929C'), edge('#6E7580', 1.6));
    var m = Math.min(w, h), dc = '#C8CDD3';
    o += fx.box(10, 10, w - 20, h - 20, '#8A929C', 'metal', 5, 1.4) + fx.screw(18, 18, 3) + fx.screw(w - 18, 18, 3) + fx.screw(18, h - 18, 3) + fx.screw(w - 18, h - 18, 3);
    o += C(w / 2 + 2, h / 2 + 3, m * .2, '#1A0E06', ' opacity=".25"') + C(w / 2, h / 2, m * .2, fx.rad([[0, '#FFFFFF'], [.5, dc], [1, '#7E868F']], .5, .5, .6, .35, .3), edge(dc, 1.6));
    for (var i = 0; i < 8; i++) { var a = i * Math.PI / 4; o += '<line x1="' + n1(w / 2 + Math.cos(a) * m * .13) + '" y1="' + n1(h / 2 + Math.sin(a) * m * .13) + '" x2="' + n1(w / 2 + Math.cos(a) * m * .2) + '" y2="' + n1(h / 2 + Math.sin(a) * m * .2) + '" stroke="#3A3F48" stroke-width="2"/>' }
    o += C(w / 2, h / 2, m * .07, ball('#9AA2AC'));
    if (p.colors) p.colors.forEach(function (k, i) { o += C(w * .2 + i * w * .6 / Math.max(1, p.colors.length - 1), h * .85, 7, ball(k), edge(k, 1.2)) });
    return o + fx.shade(w * .8, 0, w * .2, h, 8, .18);
  };
  A.poster = function (w, h, p) {
    var pc = c(p.c || '#FFF6DC'), o = fx.drop(R(0, 0, w, h, '#000'), 5, 7) + R(0, 0, w, h, mat('paper', pc), edge(sh(pc, -.18), 1.4) + ' rx="4"') + R(0, 0, w, h, fx.lin([[0, '#fff', .3], [.5, '#fff', 0]], 0, 0, 1, 1), ' rx="4"');
    o += E(w / 2 + 1.5, 10.5, 5, 2.5, '#1A0E06', ' opacity=".25"') + C(w / 2, 8, 5, ball('#C8402F'));
    var L = p.lines || [], fs = Math.min(fitw(L, w), p.fs || Math.min(26, (h - 20) / Math.max(2, L.length + (p.shapes ? 1.6 : 0)) * .72));
    L.forEach(function (s, i) { o += T(w / 2, 22 + fs * 1.3 * (i + .8), s, fs) });
    if (p.shapes) { var n = p.shapes.length, gap = (w - 16) / n, rr = Math.min(gap * .42, (h - 26 - L.length * fs * 1.3) * .32), cy = h - rr - 12; p.shapes.forEach(function (k, i) { var cx = 8 + gap * (i + .5); o += k === '?' ? T(cx, cy + rr * .6, '?', rr * 2, '#C8402F') : fx.shape(k, cx, cy, rr, p.sc ? c(p.sc[i]) : '#3A2C22') }) }
    return o;
  };
  A.board = function (w, h, p, open) {
    var fr = '#8A5A2B', bd = '#2E5E4E', o = fx.drop(R(0, 0, w, h, '#000'), 5, 7) + R(0, 0, w, h, mat('wood', fr), edge(fr, 1.6) + ' rx="6"') + R(8, 8, w - 16, h - 16, fx.lin([[0, sh(bd, .14)], [.6, bd], [1, sh(bd, -.22)]], 0, 0, .6, 1)) + R(8, 8, w - 16, 3, '#1A0E06', ' opacity=".3"') + P('M' + n1(w * .12) + ' ' + n1(h - 16) + 'Q' + n1(w * .3) + ' ' + n1(h * .6) + ' ' + n1(w * .55) + ' ' + n1(h - 20), 'none', ' stroke="#fff" stroke-opacity=".045" stroke-width="14" stroke-linecap="round"') + R(w * .15, h - 9, w * .2, 4, mat('cyl', '#F4F1E8'), ' rx="2"');
    var L = (open && p.openLines) || p.lines || [], fs = Math.min(fitw(L, w - 16), p.fs || Math.min(26, (h - 24) / Math.max(2, L.length) * .72));
    L.forEach(function (s, i) { o += T(w / 2, 18 + fs * 1.3 * (i + .9), s, fs, '#F4F1E8') });
    return o;
  };
  A.frame = function (w, h, p, open) {
    var o = fx.drop(R(0, 0, w, h, '#000'), 5, 7) + R(0, 0, w, h, mat('gold'), edge('#A07A1A', 1.6) + ' rx="3"') + R(4, 4, w - 8, h - 8, 'none', ' stroke="#FFF1B0" stroke-opacity=".6" stroke-width="1.5"') + R(10, 10, w - 20, h - 20, c(p.bg || '#BFE3F5')) + R(10, 10, w - 20, 4, '#1A0E06', ' opacity=".22"');
    if (p.kind === 'sun') o += C(w * .7, h * .35, h * .15, ball('#F2C230')) + P('M10 ' + (h - 10) + 'L' + n1(w * .4) + ' ' + n1(h * .45) + 'L' + n1(w * .7) + ' ' + (h - 10) + 'Z', mat('paint', '#3DA35D'));
    else if (p.kind === 'shapes') (open && p.ans ? p.ans : p.shapes || []).forEach(function (k, i, a) { o += fx.shape(k, 10 + (w - 20) / a.length * (i + .5), h / 2, Math.min(h * .25, (w - 20) / a.length * .35), c((p.sc || [])[i] || '#E5534B')) });
    else o += P('M10 ' + (h - 10) + 'L' + n1(w * .35) + ' ' + n1(h * .35) + 'L' + n1(w * .55) + ' ' + n1(h * .6) + 'L' + n1(w * .75) + ' ' + n1(h * .3) + 'L' + (w - 10) + ' ' + (h - 10) + 'Z', mat('paint', '#6E9F5C'));
    if (open) o += R(10, 10, w - 20, h - 20, '#2A221C', ' opacity=".55"');
    return o;
  };
  A.robot = function (w, h, p, open) {
    var f = c(p.c || '#9AA7B8'), dk = '#6E7580', eye = open ? '#7CF29B' : '#444', o = fx.ground(w / 2, h, w * .42, 6);
    o += R(w * .3, h * .85, w * .12, h * .15, mat('metal', dk), edge(dk, 1.2)) + R(w * .58, h * .85, w * .12, h * .15, mat('metal', dk), edge(dk, 1.2));
    o += fx.box(w * .2, h * .35, w * .6, h * .5, f, 'metal', 10, 1.8) + fx.box(w * .25, h * .05, w * .5, h * .3, f, 'metal', 10, 1.8);
    o += '<line x1="' + n1(w / 2) + '" y1="' + n1(h * .05) + '" x2="' + n1(w / 2) + '" y2="-6" stroke="#4A5160" stroke-width="3"/>' + C(w / 2, -8, 6, ball(open ? '#7CF29B' : '#E5534B'));
    o += C(w * .4, h * .18, w * .06, open ? fx.rad([[0, '#E6FFEC'], [1, '#3FCB6A']]) : ball('#444')) + C(w * .6, h * .18, w * .06, open ? fx.rad([[0, '#E6FFEC'], [1, '#3FCB6A']]) : ball('#444'));
    o += R(w * .3, h * .45, w * .4, h * .22, fx.lin([[0, '#2A2420'], [1, '#141110']]), ' rx="5"') + (open ? T(w / 2, h * .6, 'OK', h * .12, '#7CF29B') : R(w * .34, h * .52, w * .12, h * .08, '#E5534B') + R(w * .5, h * .52, w * .16, h * .08, '#444')) + fx.glassHL(w * .3, h * .45, w * .4, h * .22, .12);
    return o + fx.screw(w * .26, h * .4, 2.2) + fx.screw(w * .74, h * .4, 2.2);
  };
  A.plant = function (w, h) {
    var lf = 'M' + n1(w / 2) + ' ' + n1(h * .6) + 'C' + n1(w * .1) + ' ' + n1(h * .3) + ' ' + n1(w * .1) + ' ' + n1(h * .1) + ' ' + n1(w * .3) + ' 0C' + n1(w * .35) + ' ' + n1(h * .3) + ' ' + n1(w * .45) + ' ' + n1(h * .4) + ' ' + n1(w / 2) + ' ' + n1(h * .6) + 'C' + n1(w * .55) + ' ' + n1(h * .3) + ' ' + n1(w * .65) + ' ' + n1(h * .1) + ' ' + n1(w * .85) + ' ' + n1(h * .05) + 'C' + n1(w * .9) + ' ' + n1(h * .3) + ' ' + n1(w * .7) + ' ' + n1(h * .45) + ' ' + n1(w / 2) + ' ' + n1(h * .6) + 'Z';
    return fx.ground(w / 2, h, w * .32, 6) + P(lf, fx.lin([[0, '#7ED492'], [.5, '#3DA35D'], [1, '#22703C']], 0, 0, .6, 1), edge('#3DA35D', 1.5)) + '<path d="M' + n1(w / 2) + ' ' + n1(h * .58) + 'Q' + n1(w * .3) + ' ' + n1(h * .3) + ' ' + n1(w * .3) + ' ' + n1(h * .05) + 'M' + n1(w / 2) + ' ' + n1(h * .58) + 'Q' + n1(w * .68) + ' ' + n1(h * .3) + ' ' + n1(w * .83) + ' ' + n1(h * .08) + '" fill="none" stroke="#1E5A30" stroke-opacity=".45" stroke-width="1.4"/>'
      + R(w * .25, h * .6, w * .5, h * .4, mat('cyl', '#C8743C'), edge('#C8743C', 1.6) + ' rx="6"') + R(w * .22, h * .6, w * .56, h * .08, mat('paint', '#D88A50'), edge('#C8743C', 1.3) + ' rx="3"');
  };
  A.rug = function (w, h, p, open) {
    var f = c(p.c || '#C8402F');
    return open ? E(w * .3, h / 2, w * .3, h * .45, mat('cloth', f), ' opacity=".9"') + R(w * .55, h * .2, w * .3, h * .6, mat('wood', '#5A4030'), edge('#5A4030', 1.6) + ' rx="4"') + R(w * .57, h * .22, w * .26, 3, '#1A0E06', ' opacity=".3"') + fx.knob(w * .7, h / 2, 5, '#F2C230')
      : E(w / 2 + 3, h / 2 + 4, w / 2, h * .45, '#1A0E06', ' opacity=".14"') + E(w / 2, h / 2, w / 2, h * .45, fx.rad([[0, sh(f, .2)], [.7, f], [1, sh(f, -.25)]], .45, .4, .6), edge(f, 1.6)) + E(w / 2, h / 2, w * .35, h * .28, 'none', ' stroke="#F2C230" stroke-width="4"') + E(w / 2, h / 2, w * .42, h * .37, 'none', ' stroke="' + sh(f, .35) + '" stroke-width="1.5" stroke-dasharray="4 4"');
  };
  A.window = function (w, h, p) {
    var fr = '#F4F1E8', o = fx.drop(R(0, 0, w, h, '#000'), 5, 7) + R(0, 0, w, h, mat('paint', fr), edge('#B9B2A2', 1.6) + ' rx="4"');
    o += R(8, 8, w - 16, h - 16, p.night ? fx.lin([[0, '#0F1A40'], [1, '#2C3E78']]) : fx.lin([[0, '#8CCBF0'], [.7, '#CDEBFA'], [1, '#EAF7FD']]));
    if (p.night) for (var i = 0; i < 6; i++) o += C(14 + (i * 37) % (w - 28), 14 + (i * 23) % (h - 28), 2, '#fff') + C(14 + (i * 37) % (w - 28), 14 + (i * 23) % (h - 28), 4, '#fff', ' opacity=".2"');
    else o += C(w * .75, h * .25, h * .16, '#FFF2B0', ' opacity=".45"') + C(w * .75, h * .25, h * .1, ball('#F2C230'));
    o += fx.glassHL(8, 8, w - 16, h - 16, p.night ? .06 : .18) + R(8, 8, w - 16, 3, '#1A0E06', ' opacity=".18"');
    o += '<line x1="' + n1(w / 2) + '" y1="8" x2="' + n1(w / 2) + '" y2="' + (h - 8) + '" stroke="' + fr + '" stroke-width="6"/><line x1="8" y1="' + n1(h / 2) + '" x2="' + (w - 8) + '" y2="' + n1(h / 2) + '" stroke="' + fr + '" stroke-width="6"/>';
    return o + R(-6, h - 6, w + 12, 8, mat('paint', '#EDE7DA'), edge('#B9B2A2', 1.2) + ' rx="2"');
  };
  A.screen = function (w, h, p, open) {
    var b = '#3A3F48', o = fx.ground(w / 2, h, w * .3, 5) + R(w * .4, h * .85, w * .2, h * .15, mat('metal', b), edge(b, 1.2)) + R(0, 0, w, h * .85, mat('metal', b), edge(b, 1.8) + ' rx="8"') + R(10, 10, w - 20, h * .85 - 20, open ? fx.lin([[0, '#1A3048'], [1, '#0C1726']]) : fx.lin([[0, '#14261A'], [1, '#08120B']]), ' rx="2"') + R(10, 10, w - 20, h * .85 - 20, fx.rad([[0, '#7CF29B', .12], [1, '#7CF29B', 0]], .5, .5, .7), ' rx="2"');
    var L = (open && p.open) ? p.open : (p.lines || []), fs = p.fs || Math.min(24, (h * .85 - 30) / Math.max(2, L.length) * .7);
    L.forEach(function (s, i) { o += T(w / 2, 20 + fs * 1.3 * (i + .9), s, fs, '#7CF29B') });
    return o + fx.glassHL(10, 10, w - 20, h * .85 - 20, .08) + C(w - 16, h * .85 - 5, 2, '#7CF29B');
  };
  A.panel = function (w, h, p, open) {
    var b = '#4A5160', o = fx.ground(w / 2, h, w * .45, 5) + R(0, 0, w, h, mat('metal', b), edge(b, 1.8) + ' rx="8"') + fx.screw(9, 9, 2.6) + fx.screw(w - 9, 9, 2.6), cols = p.colors || ['빨강', '노랑', '초록', '파랑'];
    cols.forEach(function (k, i) { var cx = w * (i + .5) / cols.length, r = Math.min(18, w / cols.length * .3); o += C(cx + 1.5, h * .35 + 2.5, r, '#000', ' opacity=".3"') + C(cx, h * .35, r, ball(k), edge(k, 1.4)) });
    var t = open ? (p.done || '열림') : (p.label || '잠김');
    o += R(w * .1, h * .62, w * .8, h * .22, fx.lin([[0, open ? '#1A3048' : '#14261A'], [1, open ? '#0C1726' : '#08120B']]), ' rx="4"' + edge('#2A2E35', 1)) + T(w / 2, h * .78, t, Math.min(h * .14, (w * .8 - 10) / Math.max(1, emw(t))), open ? '#7CF29B' : '#E5534B');
    return o;
  };
  A.porthole = function (w, h, p) {
    var r = Math.min(w, h) / 2 - 3, cx = w / 2, cy = h / 2, o = C(cx, cy, r, mat('metal', '#8A929C'), edge('#6E7580', 2));
    for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4 + Math.PI / 8; o += fx.screw(cx + Math.cos(a) * r * .89, cy + Math.sin(a) * r * .89, Math.max(1.6, r * .045)) }
    o += C(cx, cy, r * .78, p.sea ? fx.rad([[0, '#3FA0C8'], [.7, '#1E6A8F'], [1, '#0E3E58']], .5, .35, .75) : fx.rad([[0, '#2A3570'], [1, '#0A0F2A']]), ' stroke="#4A5160" stroke-width="2"');
    (p.items || []).forEach(function (it, i, a) { var n = it.n || 1; for (var j = 0; j < n; j++) { var ang = (i * 7 + j * 2.3), rr = r * .45 * ((j % 3) / 3 + .2); o += thing(it.k, cx + Math.cos(ang) * rr - 9, cy + Math.sin(ang) * rr - 9, 18, it.c) } });
    if (!p.items) for (var i = 0; i < 7; i++) o += C(cx + Math.cos(i * 2.1) * r * .5, cy + Math.sin(i * 1.7) * r * .5, 2, '#fff');
    return o + P('M' + n1(cx - r * .62) + ' ' + n1(cy - r * .1) + 'A' + n1(r * .7) + ' ' + n1(r * .7) + ' 0 0 1 ' + n1(cx - r * .1) + ' ' + n1(cy - r * .62), 'none', ' stroke="#fff" stroke-opacity=".45" stroke-width="' + n1(r * .07) + '" stroke-linecap="round"');
  };
  A.cabinet = function (w, h, p, open) {
    var f = c(p.c || '#C9B99A'), o = fx.ground(w / 2, h, w * .56, 8) + fx.box(0, 0, w, h, f, 'wood', 5, 1.8) + fx.grain(3, 6, w - 6, h - 12, f, 5, true);
    if (open) return o + R(8, 8, w - 16, h - 16, fx.lin([[0, '#1A120C', .85], [1, '#3A2C22', .5]])) + R(12, h * .5, w - 24, 4, sh(f, -.2), ' opacity=".7"') + P('M' + (w - 8) + ' 8L' + n1(w + w * .3) + ' 20V' + (h - 20) + 'L' + (w - 8) + ' ' + (h - 8) + 'Z', mat('wood', f), edge(f, 1.6)) + fx.shade(w, 20, w * .3 - 8, h - 40, 0, .2);
    [[8, 48, w / 2 - 12, h - 62], [w / 2 + 4, 48, w / 2 - 12, h - 62]].forEach(function (q) { if (q[3] > 20) o += '<path d="M' + q[0] + ' ' + n1(q[1] + q[3]) + 'V' + q[1] + 'H' + n1(q[0] + q[2]) + '" fill="none" stroke="#1A0E06" stroke-opacity=".18" stroke-width="2"/><path d="M' + q[0] + ' ' + n1(q[1] + q[3]) + 'H' + n1(q[0] + q[2]) + 'V' + q[1] + '" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>' });
    o += '<line x1="' + n1(w / 2) + '" y1="2" x2="' + n1(w / 2) + '" y2="' + (h - 2) + '" stroke="' + sh(f, -.5) + '" stroke-width="2.4"/>' + fx.knob(w / 2 - 10, h / 2, 5, '#F2C230') + fx.knob(w / 2 + 10, h / 2, 5, '#F2C230') + fx.shade(w * .8, 0, w * .2, h, 5, .18);
    if (p.label) o += R(w * .1, 10, w * .8, 30, mat('paper', '#FFFDF6'), edge('#C9B79A', 1.2) + ' rx="4"') + T(w / 2, 32, p.label, Math.min(18, (w * .8 - 10) / Math.max(1, emw(p.label))));
    return o;
  };
  A.sign = function (w, h, p) { var f = c(p.c || '#2E7D5B'), L = p.lines || [], z = Math.min(h * .3, (p.fs || 24), fitw(L, w)); return fx.drop(R(0, 0, w, h, '#000'), 5, 7) + R(0, 0, w, h, mat('paint', f), edge(f, 1.6) + ' rx="8"') + R(4, 4, w - 8, h - 8, 'none', ' stroke="#fff" stroke-opacity=".25" stroke-width="1.5" rx="6"') + fx.gloss(2, 2, w - 4, h * .3, 7, .25) + L.map(function (s, i, a) { return T(w / 2, h / 2 + (i - (a.length - 1) / 2) * h * .36 + h * .1, s, z, '#fff') }).join('') };   /* 글이 판 밖으로 나가지 않게 폭에 맞춤 */
  A.lamp = function (w, h, p, open) {
    var sh_ = 'M' + n1(w * .15) + ' ' + n1(h * .35) + 'L' + n1(w * .3) + ' 0H' + n1(w * .7) + 'L' + n1(w * .85) + ' ' + n1(h * .35) + 'Z';
    return (open ? E(w / 2, h * .5, w * .7, h * .45, fx.rad([[0, '#FFE27A', .45], [1, '#FFE27A', 0]])) : '') + fx.ground(w / 2, h, w * .3, 4) + R(w * .45, h * .3, w * .1, h * .6, mat('cyl', '#5A4030')) + R(w * .25, h * .9, w * .5, h * .1, mat('wood', '#5A4030'), edge('#5A4030', 1.2) + ' rx="3"') + P(sh_, open ? fx.lin([[0, '#FFF6C8'], [1, '#FFD84A']]) : mat('cloth', '#E8D9B8'), edge(open ? '#E0B030' : '#B9A57E', 1.6));
  };
  A.pipe = function (w, h, p, open) { var f = c(p.c || '빨강'); return R(0, h * .4, w, h * .2, mat('cylv', '#8A929C'), edge('#6E7580', 1.6)) + R(w * .1, h * .38, 6, h * .24, mat('metal', '#6E7580')) + R(w * .9 - 6, h * .38, 6, h * .24, mat('metal', '#6E7580')) + C(w / 2 + 2, h / 2 + 3, h * .3, '#000', ' opacity=".2"') + C(w / 2, h / 2, h * .3, ball(f), edge(f, 1.8)) + '<line x1="' + n1(w / 2 - h * .22) + '" y1="' + n1(h / 2) + '" x2="' + n1(w / 2 + h * .22) + '" y2="' + n1(h / 2) + '" stroke="#fff" stroke-width="5" stroke-linecap="round" transform="rotate(' + (open ? 90 : 0) + ' ' + n1(w / 2) + ' ' + n1(h / 2) + ')"/>' };
  A.statue = function (w, h, p) {
    var s = '#E8E3D8';
    return fx.ground(w / 2, h, w * .45, 7) + fx.box(w * .15, h * .75, w * .7, h * .25, '#D9D4CA', 'stone', 0, 1.6) + fx.box(w * .3, h * .38, w * .4, h * .38, s, 'stone', 12, 1.6) + C(w / 2, h * .2, w * .18, fx.rad([[0, '#FFFFFF'], [.55, s], [1, '#A9A296']], .5, .5, .62, .35, .3), edge(s, 1.6)) + fx.shade(w * .55, h * .38, w * .15, h * .38, 12, .2)
      + (p.plate ? R(w * .2, h * .8, w * .6, h * .14, mat('gold'), edge('#A07A1A', 1) + ' rx="3"') + T(w / 2, h * .91, p.plate, h * .08) : '');
  };
  A.case = function (w, h, p, open) {
    var o = fx.ground(w / 2, h, w * .55, 8) + fx.box(0, h * .55, w, h * .45, '#7A5434', 'wood', 0, 1.6) + fx.grain(2, h * .57, w - 4, h * .41, '#7A5434', 3) + R(4, 0, w - 8, h * .55, open ? fx.lin([[0, '#F4FAFD'], [1, '#D8EAF3']]) : fx.lin([[0, '#E4F2F8'], [1, '#B9D8E8']]), edge('#8FB4C8', 1.6) + ' opacity=".85"') + R(6, h * .55 - 4, w - 12, 4, '#1A0E06', ' opacity=".12"');
    o += row(p.items, 14, h * .2, w - 28, h * .3) + fx.glassHL(4, 0, w - 8, h * .55, open ? .07 : .12);
    if (!open && p.lock) o += R(w / 2 - 12, h * .58, 24, 26, mat('gold'), edge('#A07A1A', 1.4) + ' rx="4"') + C(w / 2, h * .58 + 10, 3.5, '#3A2C22') + R(w / 2 - 1.3, h * .58 + 11, 2.6, 7, '#3A2C22');
    return o;
  };
  A.counter = function (w, h, p) {
    var f = c(p.c || '#E8A0B4'), o = fx.ground(w / 2, h, w * .55, 9) + fx.box(0, h * .35, w, h * .65, f, 'paint', 6, 1.6) + fx.shade(w * .82, h * .35, w * .18, h * .65, 6, .18);
    for (var i = 0; i < 3; i++) { var x = 14 + i * (w - 28) / 3; o += R(x + 4, h * .5, (w - 28) / 3 - 8, h * .42, 'none', ' stroke="' + sh(f, -.4) + '" stroke-opacity=".35" stroke-width="2" rx="4"') + '<path d="M' + n1(x + 6) + ' ' + n1(h * .92 - 2) + 'H' + n1(x + (w - 28) / 3 - 6) + 'V' + n1(h * .5 + 2) + '" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>' }
    o += R(-6, h * .3, w + 12, h * .1, fx.lin([[0, '#FFFFFF'], [.6, '#ECEBE6'], [1, '#C9C6BE']]), edge('#C9C6BE', 1.4) + ' rx="4"') + R(-6, h * .4, w + 12, 5, '#1A0E06', ' opacity=".14"');
    return o + row(p.items, 10, 0, w - 20, h * .3);
  };
  A.scale = function (w, h, p) {
    var m = '#8A929C', o = fx.ground(w / 2, h, w * .3, 5) + R(w * .45, h * .25, w * .1, h * .65, mat('cyl', m), edge(m, 1.4)) + R(w * .25, h * .88, w * .5, h * .12, mat('metal', '#6E7580'), edge('#6E7580', 1.4) + ' rx="4"') + R(w * .05, h * .2, w * .9, 8, mat('cylv', '#6E7580'), edge('#6E7580', 1.2) + ' rx="4"') + C(w / 2, h * .2 + 4, 6, ball('#C9A24B'));
    o += P('M0 ' + n1(h * .38) + 'Q' + n1(w * .17) + ' ' + n1(h * .52) + ' ' + n1(w * .34) + ' ' + n1(h * .38) + 'Z M' + n1(w * .66) + ' ' + n1(h * .38) + 'Q' + n1(w * .83) + ' ' + n1(h * .52) + ' ' + w + ' ' + n1(h * .38) + 'Z', fx.lin([[0, '#EEF1F4'], [1, '#9AA2AC']]), edge('#8A929C', 1.4));
    return o + row(p.left, 4, h * .1, w * .3, h * .25) + row(p.right, w * .68, h * .1, w * .3, h * .25);
  };
  A.globe = function (w, h) {
    var r = Math.min(w, h * .8) / 2 - 3, cx = w / 2, cy = r + 3;
    return fx.ground(w / 2, h, w * .26, 5) + R(w * .3, h * .88, w * .4, h * .1, mat('wood', '#7A5434'), edge('#7A5434', 1.2) + ' rx="4"') + R(w * .47, h * .78, w * .06, h * .12, mat('cyl', '#7A5434')) + C(cx, cy, r, fx.rad([[0, '#B8E6F8'], [.55, '#6CC3EA'], [1, '#2F7FAE']], .5, .5, .62, .35, .3), edge('#3F8FBA', 1.6))
      + P('M' + n1(cx - r * .5) + ' ' + n1(r * .6) + 'q' + n1(r * .3) + ' -' + n1(r * .3) + ' ' + n1(r * .6) + ' 0t' + n1(r * .2) + ' ' + n1(r * .6) + 'q-' + n1(r * .5) + ' ' + n1(r * .2) + ' -' + n1(r * .8) + ' -' + n1(r * .2) + 'z', fx.lin([[0, '#7ED492'], [1, '#2E8048']])) + P('M' + n1(cx - r * 1.08) + ' ' + n1(cy) + 'A' + n1(r * 1.08) + ' ' + n1(r * 1.08) + ' 0 0 1 ' + n1(cx) + ' ' + n1(cy - r * 1.08), 'none', ' stroke="#C9A24B" stroke-width="3"') + fx.spec(cx - r * .35, cy - r * .4, r * .16, r * .09, .55);
  };
  A.microscope = function (w, h) {
    var d = '#3A3F48';
    return fx.ground(w / 2, h, w * .34, 5) + R(w * .2, h * .88, w * .6, h * .12, mat('metal', d), edge(d, 1.2) + ' rx="4"') + '<path d="M' + n1(w * .55) + ' ' + n1(h * .88) + 'V' + n1(h * .55) + 'Q' + n1(w * .55) + ' ' + n1(h * .3) + ' ' + n1(w * .4) + ' ' + n1(h * .2) + '" fill="none" stroke="' + d + '" stroke-width="' + n1(w * .08) + '" stroke-linecap="round"/><path d="M' + n1(w * .53) + ' ' + n1(h * .85) + 'V' + n1(h * .55) + 'Q' + n1(w * .53) + ' ' + n1(h * .34) + ' ' + n1(w * .42) + ' ' + n1(h * .25) + '" fill="none" stroke="#8A929C" stroke-opacity=".6" stroke-width="2"/>'
      + R(w * .28, h * .05, w * .16, h * .4, mat('cyl', '#E8E3D8'), edge('#B9B2A2', 1.4) + ' rx="5" transform="rotate(-25 ' + n1(w * .36) + ' ' + n1(h * .25) + ')"') + R(w * .25, h * .62, w * .4, h * .05, mat('metal', '#8A929C'), edge('#6E7580', 1));
  };
  A.banner = function (w, h, p) { var f = c(p.c || '파랑'), o = R(0, 0, w, 8, mat('cylv', '#7A5434'), ' rx="3"') + fx.drop(P('M6 8H' + (w - 6) + 'V' + h + 'L' + n1(w / 2) + ' ' + n1(h * .82) + 'L6 ' + h + 'Z', '#000'), 4, 6, .22) + P('M6 8H' + (w - 6) + 'V' + h + 'L' + n1(w / 2) + ' ' + n1(h * .82) + 'L6 ' + h + 'Z', fx.lin([[0, sh(f, .12)], [.5, f], [.75, sh(f, -.12)], [1, sh(f, .05)]], 0, 0, 1, 0), edge(f, 1.6)) + R(6, 8, w - 12, 4, '#1A0E06', ' opacity=".2"'); if (p.shape) o += fx.shape(p.shape, w / 2, h * .42, w * .22, '#F2C230'); if (p.n != null) o += T(w / 2, h * .7, p.n, w * .22, '#fff'); return o };
  A.cage = function (w, h, p, open) {
    var m = '#8A929C', o = fx.ground(w / 2, h, w * .55, 8) + R(0, h - 12, w, 12, mat('metal', '#6E7580'), edge('#5A606B', 1.2)) + R(0, 0, w, 10, mat('metal', '#6E7580'), edge('#5A606B', 1.2));
    if (p.animal) o += thing(p.animal, w * .3, h * .35, h * .5, p.c);
    for (var i = 0; i <= 8; i++) if (!(open && i > 2 && i < 6)) o += R(i * (w - 6) / 8, 10, 6, h - 22, mat('cyl', m)) + R(i * (w - 6) / 8 + 4, h - 12, 4, 3, '#1A0E06', ' opacity=".2"');
    return o;
  };
  A.fence = function (w, h, p) {
    var f = '#D9A86C', o = R(0, h * .3, w, 10, mat('wood', '#B98552'), edge('#B98552', 1)) + R(0, h * .65, w, 10, mat('wood', '#B98552'), edge('#B98552', 1));
    for (var x = 0; x < w; x += 34) o += P('M' + x + ' ' + h + 'V' + n1(h * .12) + 'L' + (x + 12) + ' 0L' + (x + 24) + ' ' + n1(h * .12) + 'V' + h + 'Z', mat('wood', f), edge(f, 1.4)) + R(x + 18, h * .14, 6, h * .86, '#1A0E06', ' opacity=".1"');
    return o;
  };
  A.bookshelf = function (w, h, p) { return A.shelf(w, h, { c: p.c, rows: (p.books || [[]]).map(function (r) { return r.map(function (k) { return { k: 'book', c: k } }) }) }) };
  A.note = function (w, h, p) { var tr = ' transform="rotate(-4 ' + n1(w / 2) + ' ' + n1(h / 2) + ')"'; return R(3, 4, w, h, '#1A0E06', ' opacity=".16"' + tr) + R(0, 0, w, h, mat('paper', '#FFFDF4'), edge('#D8CFAE', 1.2) + tr) + '<g' + tr + '><line x1="10" y1="' + n1(h * .4) + '" x2="' + (w - 10) + '" y2="' + n1(h * .4) + '" stroke="#9AB" stroke-width="2"/><line x1="10" y1="' + n1(h * .65) + '" x2="' + (w - 10) + '" y2="' + n1(h * .65) + '" stroke="#9AB" stroke-width="2"/></g>' };
  A.conveyor = function (w, h, p, open) {
    var b = '#4A5160', o = fx.ground(w / 2, h * .8, w * .5, 7) + R(0, h * .55, w, h * .2, mat('cylv', b), edge(b, 1.6) + ' rx="10"');
    for (var i = 0; i < 6; i++) o += C(12 + i * (w - 24) / 5, h * .65, h * .07, ball('#AEB5BE'), ' stroke="#5A606B" stroke-width=".8"');
    o += R(4, h * .55, w - 8, 3, '#fff', ' opacity=".2" rx="1.5"');
    (open && p.ans ? p.ans : p.shapes || []).forEach(function (k, i, a) { var cx = 20 + (w - 40) / a.length * (i + .5); o += k === '?' ? R(cx - h * .18, h * .14, h * .36, h * .36, '#fff', S2 + ' stroke-dasharray="5 4"') + T(cx, h * .42, '?', h * .3, '#C8402F') : E(cx, h * .52, h * .16, h * .025, '#1A0E06', ' opacity=".25"') + fx.shape(k, cx, h * .32, h * .18, (p.sc ? c(p.sc[i]) : '#E5534B')) });
    if (open) o += T(w / 2, h * .95, '움직여요!', h * .16, '#3DA35D');
    return o;
  };
  /* 병·통: 이름표가 분모가 같은 분수(a/b, a ≤ b)면 몸통에 b칸 눈금을 긋고 a칸만큼 채움(양이 보이게, 2026-11-28; p.fill로 켜고 끔). 그 밖은 가득 찬 병 */
  A.bottles = function (w, h, p) {
    var it = p.items || [], o = fx.ground(w / 2, h, w * .55, 6) + R(0, h * .86, w, h * .14, mat('wood', '#7A5434'), edge('#7A5434', 1.2)), bw = w / Math.max(1, it.length),
      dd = it.map(function (b) { var m = /^(\d+)\/(\d+)$/.exec(b.label || ''); return m && +m[1] <= +m[2] ? m[2] : null }),
      fr = p.fill === true || (p.fill !== false && dd.every(function (d) { return d && d === dd[0] }));   /* 분모가 모두 같은 분수일 때만 양을 그림(분모가 다르면 그림만 보고 크기 차례를 알 수 있어 계산 문제가 사라짐) */
    it.forEach(function (b, i) {
      var x = i * bw + bw * .18, bwid = bw * .64, by = h * .17, bh = h * .5, m = /^(\d+)\/(\d+)$/.exec(b.label || ''), fz = Math.min(h * .13, bwid * .3), bc = c(b.c);
      o += E(x + bwid / 2 + 3, h * .86, bwid * .5, 3, '#1A0E06', ' opacity=".2"') + R(x + bwid * .3, h * .06, bwid * .4, h * .13, mat('metal', '#C8CDD3'), edge('#8A929C', 1.2) + ' rx="3"');
      if (fr && m && +m[1] <= +m[2]) {
        var n = +m[1], d = +m[2], fh = bh * n / d;
        o += R(x, by, bwid, bh, fx.lin([[0, '#F7FBFD'], [1, '#DCE8EE']], 0, 0, 1, 0), ' rx="8"') + R(x, by + bh - fh, bwid, fh, mat('cyl', bc), n === d ? ' rx="8"' : '');
        if (d <= 12) for (var k = 1; k < d; k++) o += '<line x1="' + n1(x) + '" y1="' + (by + bh * k / d).toFixed(1) + '" x2="' + n1(x + bwid * .45) + '" y2="' + (by + bh * k / d).toFixed(1) + '" stroke="#3A2C22" stroke-width="1.5" opacity=".75"/>';
        o += R(x, by, bwid, bh, 'none', edge('#7E97A6', 1.6) + ' rx="8"');
      } else o += R(x, by, bwid, bh, mat('cyl', bc), edge(bc, 1.6) + ' rx="8"');
      o += R(x + bwid * .1, by + 5, bwid * .12, bh - 10, '#fff', ' opacity=".45" rx="' + n1(bwid * .06) + '"');
      if (b.label) o += R(x - bwid * .04, h * .7, bwid * 1.08, h * .15, mat('paper', '#FFFFFF'), ' stroke="#3A2C22" stroke-width="1.5" rx="4"') + T(x + bwid / 2, h * .7 + h * .075 + fz * .36, b.label, fz);
    });
    return o;
  };
  /* 숨은 곳(크게 볼 때만 보이는 작은 곳, 2026-11-27): 작은 서랍·쪽지·빠진 벽돌·작은 구멍 */
  /* 숨은 서랍(2026-11-28): 겉틀 안에 앞판 + 가로로 긴 손잡이라 자물쇠 장식과 헷갈리지 않게, 잠기면 손잡이 아래 열쇠 구멍 */
  A.drawer = function (w, h, p, open) {
    var f = c(p.c || '#B98552'), fr = R(0, 0, w, h, mat('wood', '#5A4030'), edge('#5A4030', 1.6) + ' rx="4"'), hd = Math.max(4, h * .13);
    if (open) return fr + R(w * .06, h * .08, w * .88, h * .42, fx.lin([[0, '#0E0B09'], [1, '#3A2C22']]), ' rx="2"') + P('M' + n1(w * .02) + ' ' + n1(h * .5) + 'L' + n1(w * .1) + ' ' + n1(h * .3) + 'H' + n1(w * .9) + 'L' + n1(w * .98) + ' ' + n1(h * .5) + 'Z', mat('wood', '#8A6440'), edge('#8A6440', 1.2)) + R(-w * .04, h * .5, w * 1.08, h * .5, mat('wood', f), edge(f, 1.6) + ' rx="3"') + R(w * .3, h * .66, w * .4, Math.max(4, h * .1), mat('metal', '#3A3F48'), ' rx="' + n1(Math.max(2, h * .05)) + '"');
    return fr + R(w * .07, h * .1, w * .86, h * .8, mat('wood', f), edge(f, 1.2) + ' rx="3"') + R(w * .13, h * .18, w * .74, h * .64, 'none', ' stroke="#1A0E06" stroke-width="1" opacity=".3" rx="2"') + fx.gloss(w * .08, h * .11, w * .84, h * .2, 2, .3) + R(w * .28, h * .3, w * .44, hd, mat('cylv', '#5A606B'), ' rx="' + n1(Math.max(2, h * .065)) + '"') + (p.lock ? (function () {   /* 숫자 자물쇠 서랍: 열쇠 구멍 대신 작은 숫자 다이얼(두 칸) */
      var dw = w * .4, dh = Math.max(9, h * .3), dx = w * .3, dy = h * .5, cw = dw * .38, ch = dh * .72, d = R(dx, dy, dw, dh, mat('metal', '#3A404C'), ' rx="' + n1(Math.max(2, dh * .2)) + '"');
      [0, 1].forEach(function (i) { var x = dx + dw * .08 + i * (cw + dw * .08); d += R(x, dy + dh * .14, cw, ch, fx.lin([[0, '#FFFFFF'], [1, '#E8E2CC']]), ' rx="1.5"') + '<text x="' + n1(x + cw / 2) + '" y="' + n1(dy + dh * .14 + ch * .8) + '" font-size="' + n1(ch * .85) + '" font-weight="700" text-anchor="middle" fill="#2A221C">0</text>' });
      return d })() : '');
  };
  A.scrap = function (w, h, p) { var d = 'M3 3H' + (w - 6) + 'L' + (w - 2) + ' ' + n1(h * .3) + 'L' + (w - 5) + ' ' + (h - 3) + 'H6L2 ' + n1(h * .6) + 'Z'; return P(d, '#1A0E06', ' opacity=".18" transform="translate(2 2.5)"') + P(d, fx.lin([[0, '#FFFCE8'], [1, '#F2E7B8']], 0, 0, 1, 1), edge('#E3D49A', 1.2)) + (p.t ? T(w / 2, h * .66, p.t, Math.min(h * .42, w * .36 / Math.max(1, String(p.t).length / 2)), '#C8402F') : '<line x1="8" y1="' + n1(h * .45) + '" x2="' + (w - 8) + '" y2="' + n1(h * .45) + '" stroke="#9AB" stroke-width="1.5"/><line x1="8" y1="' + n1(h * .7) + '" x2="' + (w - 12) + '" y2="' + n1(h * .7) + '" stroke="#9AB" stroke-width="1.5"/>') };
  A.brick = function (w, h, p, open) { var f = c(p.c || '#B5654A'); return open ? R(0, 0, w, h, fx.lin([[0, '#0E0B09'], [1, '#3A2C22']]), ' rx="3"') + R(w * .1, h * .7, w * .8, h * .25, '#5A4030', ' opacity=".6"') : R(0, 0, w, h, mat('stone', f), edge(f, 1.4) + ' rx="3"') + fx.gloss(1, 1, w - 2, h * .25, 2, .3) + '<path d="M' + n1(w * .2) + ' ' + n1(h * .3) + 'l' + n1(w * .15) + ' ' + n1(h * .25) + 'l' + n1(w * .1) + ' -' + n1(h * .1) + '" fill="none" stroke="' + sh(f, -.55) + '" stroke-width="1.5"/>' };
  A.hole = function (w, h, p, open) { return P('M0 ' + h + 'V' + n1(h * .45) + 'Q' + n1(w / 2) + ' -' + n1(h * .2) + ' ' + w + ' ' + n1(h * .45) + 'V' + h + 'Z', fx.rad([[0, '#3A2C22'], [1, '#0E0B09']], .5, .7, .7), edge('#5A4030', 1.4)) + (open ? '' : C(w * .5, h * .72, Math.min(w, h) * .1, ball('#F2C230'), ' opacity=".9"')) };
  A.map = function (w, h, p) {
    var n = p.n || 4, m = p.m || n, cs = Math.min((w - 20) / m, (h - 20) / n), ox = (w - cs * m) / 2, oy = (h - cs * n) / 2, o = fx.drop(R(0, 0, w, h, '#000'), 4, 6, .22) + R(0, 0, w, h, fx.lin([[0, '#FBF1D4'], [1, '#EBD9A8']], 0, 0, 1, 1), edge('#C9AC6E', 1.6) + ' rx="6"'), x = p.start[0], y = p.start[1], cells = [[x, y]];
    (p.path || '').split('').forEach(function (d) { if (d === 'U') y--; else if (d === 'D') y++; else if (d === 'L') x--; else x++; cells.push([x, y]) });
    for (var r = 0; r < n; r++) for (var q = 0; q < m; q++) o += R(ox + q * cs, oy + r * cs, cs, cs, '#FFF8E2', ' stroke="#B99A5E" stroke-width="1.5"');
    (p.block || []).forEach(function (b) { o += R(ox + b[0] * cs + 3, oy + b[1] * cs + 3, cs - 6, cs - 6, mat('stone', '#8A7A5E'), ' rx="4"') });
    var s = cells[0], g = cells[cells.length - 1];
    /* 출발·도착 칸은 점을 찍지 않고, 이름표는 칸 안에 들어가게(길면 글자를 줄이거나 두 줄로) */
    if (p.show !== false) cells.forEach(function (cl, i) { if (i && i < cells.length - 1) o += C(ox + (cl[0] + .5) * cs, oy + (cl[1] + .5) * cs, cs * .12, '#C8402F', ' opacity=".75"') });
    function lab(cl, t, f) {
      var cx = ox + (cl[0] + .5) * cs, cy = oy + (cl[1] + .5) * cs, a = String(t).split(' '), z;
      if (a.length > 1) { var l2 = a.slice(1).join(' '); z = Math.min(cs * .27, (cs - 16) / Math.max(a[0].length, l2.length)); return T(cx, cy - z * .14, a[0], z, f) + T(cx, cy + z * .92, l2, z, f) }
      z = Math.min(cs * .3, (cs - 16) / Math.max(1, String(t).length)); return T(cx, cy + z * .36, t, z, f);
    }
    o += R(ox + s[0] * cs + 4, oy + s[1] * cs + 4, cs - 8, cs - 8, '#E6EEFB', ' stroke="#3B6FD6" stroke-width="3" rx="6"') + lab(s, p.sl || '출발', '#2C57B0') + R(ox + g[0] * cs + 4, oy + g[1] * cs + 4, cs - 8, cs - 8, '#E4F4E9', ' stroke="#3DA35D" stroke-width="4" rx="6"') + lab(g, p.gl || '도착', '#256B4C');
    return o;
  };
  /* 가방 속 물건 아이콘(44×44) — 같은 B안 빛·그림자 */
  var IS = function (f, w) { return edge(f, w || 1.4) };
  var ITEM = {
    key: function (f) { return '<g opacity=".25" transform="translate(1.5 2)"><circle cx="14" cy="20" r="9" fill="none" stroke="#1A0E06" stroke-width="5"/><path d="M22 20H40M34 20v7M39 20v5" stroke="#1A0E06" stroke-width="5" stroke-linecap="round"/></g><circle cx="14" cy="20" r="9" fill="none" stroke="' + sh(f, -.35) + '" stroke-width="6"/><circle cx="14" cy="20" r="9" fill="none" stroke="' + f + '" stroke-width="4"/><path d="M22 20H40M34 20v7M39 20v5" stroke="' + sh(f, -.35) + '" stroke-width="6" stroke-linecap="round"/><path d="M22 20H40M34 20v7M39 20v5" stroke="' + f + '" stroke-width="4" stroke-linecap="round"/><path d="M9 16.5Q11 13 15 13M24 18.8H38" stroke="#fff" stroke-opacity=".6" stroke-width="1.5" fill="none" stroke-linecap="round"/>' },
    battery: function (f) { return R(9.5, 14, 30, 18, '#1A0E06', ' opacity=".2" rx="3"') + R(8, 12, 30, 18, mat('cylv', f), IS(f) + ' rx="3"') + R(38, 17, 4, 8, mat('metal', '#5A606B'), ' rx="1"') + R(10, 13.5, 26, 3, '#fff', ' opacity=".35" rx="1.5"') + T(20, 26, '+', 12, '#fff') },
    torch: function (f) { return R(4, 15, 24, 12, mat('cylv', '#3A3F48'), ' rx="3"') + P('M28 12L40 6V36L28 30Z', mat('metal', f), IS(f)) + R(6, 16.5, 20, 2.5, '#fff', ' opacity=".25" rx="1"') },
    lens: function (f) { return E(23, 40, 12, 2.5, '#1A0E06', ' opacity=".18"') + '<path d="M26 26L40 40" stroke="' + sh(f, -.35) + '" stroke-width="7" stroke-linecap="round"/><path d="M26 26L40 40" stroke="' + f + '" stroke-width="4.5" stroke-linecap="round"/>' + C(18, 18, 11, fx.lin([[0, '#F2FBFF'], [1, '#A9D6EC']], 0, 0, 1, 1), ' stroke="' + f + '" stroke-width="4"') + '<path d="M11 15Q13 10 18 10" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round"/>' },
    card: function (f) { return R(5.5, 12, 36, 24, '#1A0E06', ' opacity=".2" rx="4"') + R(4, 10, 36, 24, mat('plastic', f), IS(f) + ' rx="4"') + R(8, 15, 12, 8, mat('gold'), ' rx="2"') + R(8, 27, 24, 2.5, '#fff', ' opacity=".45" rx="1"') },
    gear: function (f) { var d = ''; for (var i = 0; i < 16; i++) { var a = i * Math.PI / 8, r = i % 2 ? 11 : 16; d += (i ? 'L' : 'M') + (22 + r * Math.cos(a)).toFixed(1) + ' ' + (22 + r * Math.sin(a)).toFixed(1) } return P(d + 'Z', '#1A0E06', ' opacity=".2" transform="translate(1.5 2)"') + P(d + 'Z', fx.rad([[0, sh(f, .5)], [.6, f], [1, sh(f, -.3)]], .5, .5, .6, .35, .3), IS(f)) + C(22, 22, 5, '#fff', IS(f, 1)) },
    coin: function (f) { return C(23.5, 24, 15, '#1A0E06', ' opacity=".2"') + C(22, 22, 15, ball(f), IS(f)) + C(22, 22, 9, 'none', ' stroke="#fff" stroke-opacity=".7" stroke-width="2"') + '<path d="M12 15Q15 10 21 9" stroke="#fff" stroke-opacity=".7" stroke-width="2" fill="none" stroke-linecap="round"/>' },
    piece: function (f) { var d = 'M8 10H22Q22 4 27 4T32 10H38V22Q44 22 44 27T38 32V38H8Z'; return P(d, '#1A0E06', ' opacity=".2" transform="translate(1.5 2)"') + P(d, mat('plastic', f), IS(f)) },
    paper: function (f) { return R(9.5, 8, 28, 34, '#1A0E06', ' opacity=".18"') + R(8, 6, 28, 34, mat('paper', '#FFFDF4'), IS('#D8CFAE', 1.2)) + '<path d="M13 16H31M13 23H31M13 30H25" stroke="' + f + '" stroke-width="2.5"/>' },
    gem: function (f) { return thing('gem', 6, 6, 32, f) },
    candy: function (f) { return thing('candy', 4, 4, 36, f) },
    khead: function (f) { return '<circle cx="16" cy="22" r="11" fill="none" stroke="' + sh(f, -.35) + '" stroke-width="7.5"/><circle cx="16" cy="22" r="11" fill="none" stroke="' + f + '" stroke-width="5"/><path d="M27 22H34" stroke="' + sh(f, -.35) + '" stroke-width="7.5" stroke-linecap="round"/><path d="M27 22H34" stroke="' + f + '" stroke-width="5" stroke-linecap="round"/><path d="M9 17Q11 13 16 12.5" stroke="#fff" stroke-opacity=".6" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M36 15L40 29" stroke="#3A2C22" stroke-width="2" stroke-dasharray="3 2"/>' },
    kblade: function (f) { return '<path d="M10 15L6 29" stroke="#3A2C22" stroke-width="2" stroke-dasharray="3 2"/><path d="M12 22H38M32 22v8M38 22v6" stroke="' + sh(f, -.35) + '" stroke-width="7.5" stroke-linecap="round"/><path d="M12 22H38M32 22v8M38 22v6" stroke="' + f + '" stroke-width="5" stroke-linecap="round"/><path d="M14 20.5H36" stroke="#fff" stroke-opacity=".55" stroke-width="1.5" stroke-linecap="round"/>' },
    tornL: function (f) { return P('M6 6H26L22 13L27 20L21 28L26 34L22 40H6Z', '#1A0E06', ' opacity=".18" transform="translate(1.5 2)"') + P('M6 6H26L22 13L27 20L21 28L26 34L22 40H6Z', mat('paper', '#FFFDF4'), IS('#D8CFAE', 1.2)) + '<path d="M10 15H20M10 22H22M10 29H19" stroke="' + f + '" stroke-width="2.5"/>' },
    tornR: function (f) { return P('M38 6H18L22 13L17 20L23 28L18 34L22 40H38Z', '#1A0E06', ' opacity=".18" transform="translate(1.5 2)"') + P('M38 6H18L22 13L17 20L23 28L18 34L22 40H38Z', mat('paper', '#FFFDF4'), IS('#D8CFAE', 1.2)) + '<path d="M25 15H34M27 22H34M25 29H33" stroke="' + f + '" stroke-width="2.5"/>' },
    stick: function (f) { return '<path d="M9.5 38L37.5 10" stroke="#1A0E06" stroke-opacity=".2" stroke-width="6" stroke-linecap="round"/><path d="M8 36L36 8" stroke="' + sh(f, -.35) + '" stroke-width="7" stroke-linecap="round"/><path d="M8 36L36 8" stroke="' + f + '" stroke-width="4.5" stroke-linecap="round"/><path d="M10 32L32 10" stroke="#fff" stroke-opacity=".4" stroke-width="1.4" stroke-linecap="round"/>' },
    hook: function (f) { return '<path d="M22 6V26Q22 36 14 36Q8 36 8 30" fill="none" stroke="' + sh(f, -.35) + '" stroke-width="7" stroke-linecap="round"/><path d="M22 6V26Q22 36 14 36Q8 36 8 30" fill="none" stroke="' + f + '" stroke-width="4.5" stroke-linecap="round"/><path d="M21 8V24" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>' }
  };
  function item(kind, col) { return '<svg viewBox="0 0 44 44" aria-hidden="true" class="es-iv">' + (ITEM[kind] || ITEM.paper)(c(col || '#C9A24B')) + '</svg>' }
  return { A: A, c: c, shape: shape, arrow: arrow, thing: thing, item: item, esc: esc, COL: COL, fx: fx };
})();
