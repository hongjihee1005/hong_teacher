/* 종이접기 그림 엔진 — 단계(step.d)의 요소를 SVG로 그립니다. 요소 뜻은 geo.py 맨 위 설명 참고. */
var OG = (function () {
  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    function f(v) { return Math.max(0, Math.min(255, Math.round(v * k))) }
    return 'rgb(' + f(r) + ',' + f(g) + ',' + f(b) + ')';
  }
  function fillOf(f, col) {
    if (f === 'c') return col;
    if (f === 'c2') return shade(col, .84);
    if (f === 'w') return '#FFFFFF';
    if (f === 'w2') return '#EEE8E0';
    if (f === 'none') return 'none';
    return f;
  }
  function pts(a) { return a.map(function (p) { return p[0] + ',' + p[1] }).join(' ') }
  function line(a, b, cls) { return '<line class="' + cls + '" x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"/>' }
  function curve(a, b, k) {
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    var cx = mx - dy * k, cy = my + dx * k;
    return { d: 'M' + a[0] + ' ' + a[1] + 'Q' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + b[0] + ' ' + b[1], cx: cx, cy: cy };
  }
  function head(tip, from, open, hollow) {
    var ang = Math.atan2(tip[1] - from[1], tip[0] - from[0]), L = 11, w = .45;
    var p1 = [tip[0] - L * Math.cos(ang - w), tip[1] - L * Math.sin(ang - w)];
    var p2 = [tip[0] - L * Math.cos(ang + w), tip[1] - L * Math.sin(ang + w)];
    if (open) return '<path class="og-ar" d="M' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + 'L' + tip[0] + ' ' + tip[1] + 'L' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + '"/>';
    return '<polygon class="' + (hollow ? 'og-hh' : 'og-hd') + '" points="' + pts([tip, p1, p2]) + '"/>';
  }
  function arrow(a, b, k, kind) {
    var c = curve(a, b, k), s = '<path class="og-ar" d="' + c.d + '"/>';
    s += head(b, [c.cx, c.cy], false, kind === 'B');
    if (kind === 'U') s += head(a, [c.cx, c.cy], false, true);
    return s;
  }
  function esc(t) { return String(t).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] }) }
  var FLIP = '<g class="og-badge" transform="translate(166 8)"><rect width="68" height="30" rx="15"/><path class="og-ic" d="M10 13a8 6 0 0 1 14 0M22 10l2 3-3.4.6M24 18a8 6 0 0 1-14 0M12 21l-2-3 3.4-.6"/><text x="47" y="20">뒤집기</text></g>';
  var TURN = '<g class="og-badge" transform="translate(166 8)"><rect width="68" height="30" rx="15"/><path class="og-ic" d="M19 8a7.5 7.5 0 1 1-7 4.8M11 7.5v5h5"/><text x="47" y="20">돌리기</text></g>';
  function render(d, col, z) {
    var s = '', badge = '';
    d.forEach(function (e) {
      var t = e[0];
      if (t === 'P') s += e[2] === 'none' ? '' : '<polygon class="og-p" points="' + pts(e[1]) + '" fill="' + fillOf(e[2], col) + '"/>';
      else if (t === 'V') s += line(e[1], e[2], 'og-v');
      else if (t === 'M') s += line(e[1], e[2], 'og-m');
      else if (t === 'L') s += line(e[1], e[2], 'og-l');
      else if (t === 'E') s += line(e[1], e[2], 'og-e');
      else if (t === 'C') s += line(e[1], e[2], 'og-c') + '<text class="og-sc" x="' + (e[1][0] - 8) + '" y="' + (e[1][1] + 6) + '">✂</text>';
      else if (t === 'A' || t === 'U' || t === 'B') s += arrow(e[1], e[2], e[3], t);
      else if (t === 'S') s += line(e[1], e[2], 'og-ar') + head(e[2], e[1], false, false);
      else if (t === 'O') s += '<circle class="og-o" cx="' + e[1][0] + '" cy="' + e[1][1] + '" r="6"/>';
      else if (t === 'D') s += '<circle cx="' + e[1][0] + '" cy="' + e[1][1] + '" r="' + e[2] + '" fill="' + e[3] + '"/>';
      else if (t === 'W') s += '<path d="' + e[1] + '" fill="' + fillOf(e[4], col) + '" stroke="' + e[3] + '" stroke-width="' + e[2] + '" stroke-linecap="round" stroke-linejoin="round"/>';
      else if (t === 'T') s += '<text class="og-t" x="' + e[1][0] + '" y="' + e[1][1] + '" font-size="' + e[3] + '">' + esc(e[2]) + '</text>';
      else if (t === 'FLIP') badge += FLIP;
      else if (t === 'TURN') badge += TURN;
    });
    if (z) s = '<g class="og-z" transform="translate(' + z[1] + ' ' + z[2] + ') scale(' + z[0] + ')">' + s + '</g>';
    return '<svg class="og-svg" viewBox="0 0 240 240" role="img">' + s + badge + '</svg>';
  }
  return { render: render };
})();
