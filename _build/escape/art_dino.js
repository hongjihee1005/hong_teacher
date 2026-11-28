/* 수학 방탈출 · 공룡 박물관·화석 발굴장 그림 (2026-11-27) — 그림 이름 앞글자 dn. 모두 직접 그린 SVG(이모지 없음).
   ART.A.이름(w, h, p, open) → 0,0~w,h 안에 그리는 SVG 조각. 개수를 세는 그림은 p의 수만큼 정확히 그림. */
(function () {
  var c = ART.c, esc = ART.esc;
  /* B안(그림책 삽화, 2026-11-28): 검은 굵은 테두리가 있는 면 → 재질 그러데이션 + 같은 계열 테두리(자리·크기·개수는 그대로, 칠하는 방법만 바꿈) */
  var F = ART.fx, BMAT = { wood: /^#(7A5434|9A6A3F|8B5A2B|B98552|C99A5B|8A5A30|7A4A22|5A4030|9A6A3F|E8C08B|D9A86C)$/i, metal: /^#(8A929C|6E7580|5E6B78|7A8896|C8CDD3|4A5160|3A3F48|5A6070|5D6675|8A97A6)$/i, glass: /^#(BFE3F5|CFE7F3|E8F4FA|EAF4F8|EEF6FA)$/i, paper: /^#(FFFDF4|FFF8E2|F4F1E8|FFF6E8|FFF2A8|F6F3EC|E6E0D2|FFFFFF|FFF|F2E6C2|FFF3C4|E4F5E8|E3F2DC|FCE6C4|C9B08A)$/i, stone: /^#(7A6A58|6B5A48)$/i };
  function bkind(tag, f, attrs) {
    for (var k in BMAT) if (BMAT[k].test(f) && !(k === 'paper' && tag !== 'rect' && tag !== 'path' && tag !== 'polygon')) return k;
    if (/^#(2A2A2A|2A221C|1F2433|120C1C|2A1D18|1F2A1C|2A2140)$/i.test(f)) return 'paint';
    if (tag === 'circle') return 'ball';
    if (tag === 'ellipse') { var rx = +(/rx="([\d.]+)"/.exec(attrs) || [0, 1])[1], ry = +(/ry="([\d.]+)"/.exec(attrs) || [0, 1])[1]; return ry < rx * .55 ? 'cylv' : 'ball' }
    return 'paint';
  }
  function bq(s) {
    return s.replace(/<(rect|circle|ellipse|path|polygon)\b([^>]*?)fill="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"\s*stroke="(?:#3A2C22|#1F2433|#22301F)" stroke-width="([\d.]+)"(?: stroke-linejoin="round")?/g, function (m, tag, pre, f, wd) {
      var ew = { '3': 1.8, '2.5': 1.6, '2': 1.4, '1.5': 1.2, '1.2': 1 }[wd] || Math.max(1, wd * .6);
      return '<' + tag + pre + 'fill="' + F.mat(bkind(tag, f, pre), f) + '"' + F.edge(f, ew);
    });
  }
  function bdrop(w, h, rx) { return F.drop('<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="' + (rx || 6) + '" fill="#000"/>', 5, 7, .26) }
  function R(x, y, w, h, f, o) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"' + (o || '') + '/>' }
  function T(x, y, s, size, f, o) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#2A221C') + '" text-anchor="middle" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  var INK = '#3A2C22', STK = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"', S2 = ' stroke="' + INK + '" stroke-width="2" stroke-linejoin="round"';
  var BONE = '#F1E7D0', BK = '#8A7A5C';   /* 뼈 테두리: 검은 선 대신 뼈 색 계열 어두운 색 */
  function n1(v) { return (+v).toFixed(1) }
  /* 뼈 한 개: 굵은 막대 + 양 끝 둥근 마디 */
  function bone(x1, y1, x2, y2, wd) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy) || 1, px = -dy / L * wd * .45, py = dx / L * wd * .45, r = wd * .62, o = '', k;
    var ends = [[x1 + px, y1 + py], [x1 - px, y1 - py], [x2 + px, y2 + py], [x2 - px, y2 - py]];
    o += '<line x1="' + n1(x1) + '" y1="' + n1(y1) + '" x2="' + n1(x2) + '" y2="' + n1(y2) + '" stroke="' + BK + '" stroke-width="' + (wd + 4) + '" stroke-linecap="round"/>';
    for (k = 0; k < 4; k++) o += '<circle cx="' + n1(ends[k][0]) + '" cy="' + n1(ends[k][1]) + '" r="' + n1(r + 2) + '" fill="' + BK + '"/>';
    o += '<line x1="' + n1(x1) + '" y1="' + n1(y1) + '" x2="' + n1(x2) + '" y2="' + n1(y2) + '" stroke="' + BONE + '" stroke-width="' + wd + '" stroke-linecap="round"/>';
    for (k = 0; k < 4; k++) o += '<circle cx="' + n1(ends[k][0]) + '" cy="' + n1(ends[k][1]) + '" r="' + n1(r) + '" fill="' + F.ball(BONE) + '"/>';
    o += '<line x1="' + n1(x1 + px * .45) + '" y1="' + n1(y1 + py * .45 - wd * .15) + '" x2="' + n1(x2 + px * .45) + '" y2="' + n1(y2 + py * .45 - wd * .15) + '" stroke="#FFFFFF" stroke-opacity=".55" stroke-width="' + n1(Math.max(1, wd * .22)) + '" stroke-linecap="round"/>';   /* 위쪽 빛 */
    return o;
  }
  /* 이빨 화석 하나(아래 넓고 위 뾰족) */
  function tooth(x, y, s) { return '<path d="M' + n1(x) + ' ' + n1(y + s) + 'Q' + n1(x + s * .1) + ' ' + n1(y + s * .3) + ' ' + n1(x + s * .32) + ' ' + n1(y) + 'Q' + n1(x + s * .5) + ' ' + n1(y + s * .35) + ' ' + n1(x + s * .62) + ' ' + n1(y + s) + 'Z" fill="#FFF8E6"' + S2 + '/>' }
  /* 작은 공룡 모양(인형·간판) */
  function dino(x, y, s, f) {
    return '<path d="M' + n1(x) + ' ' + n1(y + s * .75) + 'Q' + n1(x + s * .25) + ' ' + n1(y + s * .45) + ' ' + n1(x + s * .45) + ' ' + n1(y + s * .5) + 'L' + n1(x + s * .62) + ' ' + n1(y + s * .2) + 'Q' + n1(x + s * .7) + ' ' + n1(y) + ' ' + n1(x + s * .9) + ' ' + n1(y + s * .08) + 'Q' + n1(x + s) + ' ' + n1(y + s * .18) + ' ' + n1(x + s * .82) + ' ' + n1(y + s * .25) + 'L' + n1(x + s * .78) + ' ' + n1(y + s * .55) + 'Q' + n1(x + s * .8) + ' ' + n1(y + s * .75) + ' ' + n1(x + s * .7) + ' ' + n1(y + s * .8) + 'L' + n1(x + s * .72) + ' ' + n1(y + s) + 'H' + n1(x + s * .6) + 'L' + n1(x + s * .58) + ' ' + n1(y + s * .82) + 'H' + n1(x + s * .42) + 'L' + n1(x + s * .4) + ' ' + n1(y + s) + 'H' + n1(x + s * .28) + 'L' + n1(x + s * .3) + ' ' + n1(y + s * .8) + 'Q' + n1(x + s * .15) + ' ' + n1(y + s * .8) + ' ' + n1(x) + ' ' + n1(y + s * .75) + 'Z" fill="' + f + '"' + S2 + '/><circle cx="' + n1(x + s * .82) + '" cy="' + n1(y + s * .12) + '" r="' + n1(s * .035) + '" fill="' + INK + '"/>';
  }
  /* 발자국: 큰 발자국(발가락 셋) / 작은 발자국(둥근 발) — 오른쪽을 향함 */
  function print3(cx, cy, s) {
    var o = '<g transform="rotate(90 ' + n1(cx) + ' ' + n1(cy) + ')" fill="#6B4A2E">';
    o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy + s * .22) + '" rx="' + n1(s * .26) + '" ry="' + n1(s * .22) + '"/>';
    [-28, 0, 28].forEach(function (a) { o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(cy - s * .2) + '" rx="' + n1(s * .1) + '" ry="' + n1(s * .3) + '" transform="rotate(' + a + ' ' + n1(cx) + ' ' + n1(cy + s * .15) + ')"/>' });
    return o + '</g>';
  }
  function printS(cx, cy, s) {
    return '<g fill="#8A6A4A"><ellipse cx="' + n1(cx) + '" cy="' + n1(cy) + '" rx="' + n1(s * .24) + '" ry="' + n1(s * .19) + '"/>' +
      [-1, 0, 1].map(function (k) { return '<circle cx="' + n1(cx + s * .28) + '" cy="' + n1(cy + k * s * .15) + '" r="' + n1(s * .07) + '"/>' }).join('') + '</g>';
  }
  /* 암모나이트(소용돌이 조개 화석) */
  function ammo(cx, cy, r, f) { return '<circle cx="' + n1(cx) + '" cy="' + n1(cy) + '" r="' + n1(r) + '" fill="' + (f || '#E8D9B8') + '"' + S2 + '/><path d="M' + n1(cx) + ' ' + n1(cy) + 'm' + n1(r * .15) + ' 0a' + n1(r * .15) + ' ' + n1(r * .15) + ' 0 1 1 -' + n1(r * .3) + ' 0a' + n1(r * .35) + ' ' + n1(r * .35) + ' 0 1 1 ' + n1(r * .6) + ' 0a' + n1(r * .6) + ' ' + n1(r * .6) + ' 0 1 1 -' + n1(r * 1.05) + ' 0" fill="none" stroke="#7A6646" stroke-width="1.5"/>' }
  /* 받침대 위 이름표 줄(lines 1~3줄) */
  function plate(w, h, lines, y0) {
    var L = lines || [], ph = h - y0, fs = Math.min(20, ph / Math.max(1, L.length) * .62, w * .9 / Math.max.apply(null, L.map(function (s) { return String(s).length || 1 }).concat([1])) * .95);
    return R(w * .04, y0, w * .92, ph, '#C9A24B', STK + ' rx="6"') + L.map(function (s, i) { return T(w / 2, y0 + ph * (i + .5) / L.length + fs * .36, s, fs) }).join('');
  }

  /* 공룡 뼈 전시(티라노사우루스 모양 골격). p.plate = 이름표 줄 목록, p.c = 받침 색 */
  ART.A.dnSkel = function (w, h, p) {
    var L = p.plate || [], py = L.length ? h - Math.max(34, L.length * 24) : h - 14, gy = py - 8, o = F.ground(w / 2, h - 2, w * .5, 9);
    o += R(w * .08, gy - 6, w * .84, 10, F.mat('stone', '#7A6A58'), F.edge('#7A6A58', 1.2) + ' rx="4"');
    o += R(w * .3, gy * .55, 8, gy * .45, F.mat('cyl', '#8A929C')) + R(w * .62, gy * .45, 8, gy * .55, F.mat('cyl', '#8A929C'));
    // 꼬리·등뼈
    var sp = [[w * .03, gy * .5], [w * .14, gy * .44], [w * .26, gy * .42], [w * .38, gy * .42], [w * .5, gy * .38], [w * .6, gy * .33], [w * .68, gy * .26]];
    for (var i = 0; i < sp.length - 1; i++) o += bone(sp[i][0], sp[i][1], sp[i + 1][0], sp[i + 1][1], Math.max(5, 7 + i));
    // 갈비뼈
    for (var j = 0; j < 5; j++) { var rx = w * (.42 + j * .045), ry = gy * (.42 - j * .012); o += '<path d="M' + n1(rx) + ' ' + n1(ry) + 'q' + n1(w * .02) + ' ' + n1(gy * .12) + ' -' + n1(w * .015) + ' ' + n1(gy * .2) + '" fill="none" stroke="' + BK + '" stroke-width="7" stroke-linecap="round"/><path d="M' + n1(rx) + ' ' + n1(ry) + 'q' + n1(w * .02) + ' ' + n1(gy * .12) + ' -' + n1(w * .015) + ' ' + n1(gy * .2) + '" fill="none" stroke="' + BONE + '" stroke-width="3.5" stroke-linecap="round"/>' }
    // 다리 두 개(뒤쪽 다리 먼저)
    o += bone(w * .4, gy * .45, w * .47, gy * .7, 11) + bone(w * .47, gy * .7, w * .42, gy * .95, 9) + bone(w * .42, gy * .95, w * .5, gy * .99, 6);
    o += bone(w * .34, gy * .45, w * .38, gy * .7, 12) + bone(w * .38, gy * .7, w * .32, gy * .95, 10) + bone(w * .32, gy * .95, w * .41, gy * .99, 7);
    // 작은 앞발
    o += bone(w * .64, gy * .36, w * .68, gy * .47, 5) + bone(w * .68, gy * .47, w * .72, gy * .45, 4);
    // 머리뼈
    var hx = w * .66, hy = gy * .1, hw = w * .3, hh = gy * .22;
    o += '<path d="M' + n1(hx) + ' ' + n1(hy + hh * .3) + 'Q' + n1(hx + hw * .2) + ' ' + n1(hy - hh * .05) + ' ' + n1(hx + hw * .62) + ' ' + n1(hy + hh * .08) + 'L' + n1(hx + hw) + ' ' + n1(hy + hh * .42) + 'L' + n1(hx + hw * .96) + ' ' + n1(hy + hh * .62) + 'L' + n1(hx + hw * .2) + ' ' + n1(hy + hh * .7) + 'Z" fill="' + BONE + '"' + STK + '/>';
    o += '<path d="M' + n1(hx + hw * .2) + ' ' + n1(hy + hh * .78) + 'L' + n1(hx + hw * .92) + ' ' + n1(hy + hh * .72) + 'L' + n1(hx + hw * .8) + ' ' + n1(hy + hh * 1.02) + 'L' + n1(hx + hw * .25) + ' ' + n1(hy + hh * 1.05) + 'Z" fill="' + BONE + '"' + STK + '/>';
    for (var t = 0; t < 5; t++) o += '<path d="M' + n1(hx + hw * (.38 + t * .11)) + ' ' + n1(hy + hh * .68) + 'l' + n1(hw * .03) + ' ' + n1(hh * .12) + 'l' + n1(hw * .03) + ' -' + n1(hh * .12) + '" fill="#fff"' + S2.replace('2"', '1.2"') + '/>';
    o += '<ellipse cx="' + n1(hx + hw * .42) + '" cy="' + n1(hy + hh * .3) + '" rx="' + n1(hw * .09) + '" ry="' + n1(hh * .14) + '" fill="' + INK + '"/>';
    if (L.length) o += plate(w, h, L, py);
    return bq(o);
  };

  /* 공룡 알 둥지: p.eggs = [{c, n}] (n개씩 정확히), p.dia = 지름 글(둥지 가로에 화살표), p.label = 위 이름표 */
  ART.A.dnNest = function (w, h, p) {
    var o = '', ex = [], top = p.label ? 34 : 0;
    (p.eggs || []).forEach(function (e) { for (var i = 0; i < (e.n || 0); i++) ex.push(e) });
    if (p.label) o += R(w * .2, 0, w * .6, 28, '#2E7D5B', ' rx="6"') + T(w / 2, 20, p.label, 17, '#fff');
    var cy = top + (h - top) * .7, rx = w * .48, ry = (h - top) * .27;
    o += F.ground(w / 2, cy + ry * .75, rx * 1.08, ry * .4) + '<ellipse cx="' + w / 2 + '" cy="' + n1(cy) + '" rx="' + n1(rx) + '" ry="' + n1(ry) + '" fill="#8A5A30"' + STK + '/>';
    o += '<ellipse cx="' + w / 2 + '" cy="' + n1(cy - ry * .2) + '" rx="' + n1(rx * .82) + '" ry="' + n1(ry * .55) + '" fill="' + F.rad([[0, '#3A220E'], [.7, '#5E3C1E'], [1, '#7A5028']], .5, .45, .6) + '"/>';
    var N = ex.length, rows = N > 12 ? 3 : (N > 5 ? 2 : 1), per = Math.ceil(N / rows), er = Math.min(w * .84 / per * .36, (h - top) * .14), k = 0;
    for (var r = 0; r < rows; r++) {
      var cnt = Math.min(per, N - k), yy = cy - ry * .2 - (rows - 1 - r) * (er * 2.56 + 5), x0 = w / 2 - (cnt - 1) * er * 1.25;
      for (var i = 0; i < cnt; i++, k++) { var ccx = x0 + i * er * 2.5; o += '<ellipse cx="' + n1(ccx) + '" cy="' + n1(yy) + '" rx="' + n1(er) + '" ry="' + n1(er * 1.28) + '" fill="' + c(ex[k].c) + '"' + S2 + '/><ellipse cx="' + n1(ccx - er * .35) + '" cy="' + n1(yy - er * .5) + '" rx="' + n1(er * .2) + '" ry="' + n1(er * .32) + '" fill="#fff" opacity=".55"/>' }
    }
    for (var q = 0; q < 9; q++) { var a = Math.PI * (.05 + q * .1), x1 = w / 2 + Math.cos(a) * rx * .98, y1 = cy + Math.sin(a) * ry * .9; o += '<line x1="' + n1(x1) + '" y1="' + n1(y1) + '" x2="' + n1(x1 + (q % 2 ? 18 : -18)) + '" y2="' + n1(y1 - 6) + '" stroke="#C9965A" stroke-width="4" stroke-linecap="round"/>' }
    if (p.dia) {
      var ay = cy + ry * .62;
      o += '<line x1="' + n1(w / 2 - rx * .96) + '" y1="' + n1(ay) + '" x2="' + n1(w / 2 + rx * .96) + '" y2="' + n1(ay) + '" stroke="#fff" stroke-width="3" stroke-dasharray="7 5"/>';
      o += R(w / 2 - 62, ay - 15, 124, 28, '#fff', S2 + ' rx="6"') + T(w / 2, ay + 6, p.dia, 17, '#2E7D5B');
    }
    return bq(o);
  };

  /* 발자국 길: p.big = 큰 발자국 수(발가락 셋), p.small = 작은 발자국 수. 오른쪽 위 구석은 비워 둠(쪽지 자리) */
  ART.A.dnPrints = function (w, h, p) {
    var o = bdrop(w, h, 10) + R(0, 0, w, h, '#E8D2A0', STK + ' rx="10"'), x0 = 30, x1 = w - 84;
    for (var d = 0; d < 26; d++) o += '<circle cx="' + ((d * 97) % (w - 20) + 10) + '" cy="' + ((d * 53) % (h - 20) + 10) + '" r="2" fill="#C9A66A"/>';
    var nb = p.big || 0, ns = p.small || 0, s = Math.min(46, h * .34);
    for (var i = 0; i < nb; i++) o += print3(x0 + (nb > 1 ? i * (x1 - x0) / (nb - 1) : 0), h * .3 + (i % 2 ? s * .25 : -s * .25), s);
    for (var j = 0; j < ns; j++) o += printS(x0 + 10 + (ns > 1 ? j * (w - 40 - x0) / (ns - 1) : 0), h * .76 + (j % 2 ? 6 : -6), s);
    return bq(o);
  };

  /* 발굴 구덩이(모래 상자): 닫힘 = 모래 더미, 열림 = 이빨 화석 p.teeth개(10개씩 한 줄, 5개마다 틈) + 큰 뼈 화석.
     p.grid = [가로 칸, 세로 칸] 줄, p.bone = 열리면 큰 뼈, p.leave = [x, y, w, h] 비워 둘 곳(숨은 서랍 자리) */
  ART.A.dnDig = function (w, h, p, open) {   /* 열면 구역 선을 흐리게: 이빨을 셀 때 선이 이빨과 겹쳐 보이지 않게 */
    var o = F.ground(w / 2, h, w * .54, 9) + R(0, 0, w, h, '#9A6A3F', STK + ' rx="6"') + R(10, 10, w - 20, h - 20, F.lin([[0, '#5A3A1E', .9], [.12, open ? '#B88C58' : '#C9A06A'], [1, F.sh(open ? '#B88C58' : '#C9A06A', -.12)]]), ' rx="3"');
    var g = p.grid || [4, 2];
    for (var i = 1; i < g[0]; i++) o += '<line x1="' + n1(10 + i * (w - 20) / g[0]) + '" y1="10" x2="' + n1(10 + i * (w - 20) / g[0]) + '" y2="' + (h - 10) + '" stroke="#FFF6E0" stroke-width="2" opacity="' + (open ? '.35' : '.8') + '"/>';
    for (var j = 1; j < g[1]; j++) o += '<line x1="10" y1="' + n1(10 + j * (h - 20) / g[1]) + '" x2="' + (w - 10) + '" y2="' + n1(10 + j * (h - 20) / g[1]) + '" stroke="#FFF6E0" stroke-width="2" opacity="' + (open ? '.35' : '.8') + '"/>';
    if (!open) {
      for (var m = 0; m < 7; m++) o += '<ellipse cx="' + n1(30 + (m * 71) % (w - 60)) + '" cy="' + n1(h * .35 + (m * 37) % (h * .45)) + '" rx="' + n1(w * .12) + '" ry="' + n1(h * .1) + '" fill="#E6C88E"' + S2.replace('2"', '1.5"') + '/>';
      return o + R(w * .4, h * .44, w * .2, 6, BONE, S2 + ' rx="3"');
    }
    var nt = p.teeth || 0, s = Math.min(22, (h - 40) / 4.6), cols = 10, gx = Math.min(24, (w - 50) / 10.6);
    for (var t = 0; t < nt; t++) { var cx = 24 + (t % cols) * gx + ((t % cols) >= 5 ? gx * .55 : 0), cy = 20 + Math.floor(t / cols) * s * 1.35; o += tooth(cx, cy, s) }
    if (p.bone) o += bone(w * .1, h * .8, w * .42, h * .72, 12);
    return bq(o);
  };

  /* 모래 양동이 p.n개 */
  ART.A.dnBucket = function (w, h, p) {
    var n = p.n || 1, bw = w / n, o = F.ground(w / 2, h, w * .5, 7);
    for (var i = 0; i < n; i++) {
      var x = i * bw + bw * .12, ww = bw * .76, f = c(p.c || '파랑');
      o += '<path d="M' + n1(x + ww * .2) + ' ' + n1(h * .32) + 'Q' + n1(x + ww / 2) + ' ' + n1(-h * .05) + ' ' + n1(x + ww * .8) + ' ' + n1(h * .32) + '" fill="none" stroke="#5A6070" stroke-width="3"/>';
      o += '<path d="M' + n1(x) + ' ' + n1(h * .32) + 'H' + n1(x + ww) + 'L' + n1(x + ww * .85) + ' ' + h + 'H' + n1(x + ww * .15) + 'Z" fill="' + F.mat('cyl', f) + '"' + F.edge(f, 1.8) + '/>';
      o += '<ellipse cx="' + n1(x + ww / 2) + '" cy="' + n1(h * .33) + '" rx="' + n1(ww * .46) + '" ry="' + n1(h * .07) + '" fill="#E6C88E"' + S2 + '/>';
    }
    return bq(o);
  };

  /* 지층 벽: p.layers = [{c, t: 두께 수, f: 'ammo'|'bone'|'leaf'|''}] 위에서 아래로, 두께에 맞춘 높이, 오른쪽에 'N cm' 표.
     왼쪽 위 구석 46×40은 비워 둠(쪽지 자리) */
  ART.A.dnStrata = function (w, h, p) {
    var L = p.layers || [], tot = L.reduce(function (s, a) { return s + a.t }, 0) || 1, y = 0, o = bdrop(w, h, 6) + R(0, 0, w, h, '#6B5A48', STK + ' rx="6"');
    L.forEach(function (a, i) {
      var lh = (h - 8) * a.t / tot, yy = 4 + y;
      o += R(4, yy, w - 8, lh, F.mat('stone', c(a.c)), i ? '' : ' rx="4"') + R(4, yy, w - 8, lh, '#fff', ' opacity=".2"');
      for (var d = 0; d < 10; d++) o += '<circle cx="' + n1(70 + (d * 53 + i * 31) % (w - 170)) + '" cy="' + n1(yy + 6 + (d * 17 + i * 7) % Math.max(4, lh - 12)) + '" r="1.8" fill="#000" opacity=".22"/>';
      if (i) o += '<path d="M4 ' + n1(yy) + 'Q' + n1(w * .3) + ' ' + n1(yy - 4) + ' ' + n1(w * .55) + ' ' + n1(yy + 2) + 'T' + (w - 4) + ' ' + n1(yy) + '" fill="none" stroke="' + INK + '" stroke-opacity=".55" stroke-width="2"/>';
      var fx = w * .45, fy = yy + lh / 2;
      if (a.f === 'ammo') o += ammo(fx, fy, Math.min(lh * .32, 18));
      if (a.f === 'bone') o += bone(fx - 28, fy + 4, fx + 18, fy - 4, Math.min(8, lh * .2));
      if (a.f === 'leaf') o += '<path d="M' + n1(fx - 22) + ' ' + n1(fy + 6) + 'Q' + n1(fx) + ' ' + n1(fy - 16) + ' ' + n1(fx + 24) + ' ' + n1(fy - 4) + 'Q' + n1(fx) + ' ' + n1(fy + 14) + ' ' + n1(fx - 22) + ' ' + n1(fy + 6) + 'Z" fill="#5E7A3A"' + S2 + '/>';
      if (a.t != null) o += R(w - 92, fy - 15, 80, 28, '#fff', S2 + ' rx="6"') + T(w - 52, fy + 6, a.t + ' cm', 17);
      y += lh;
    });
    return bq(o);
  };

  /* 기념품 선반: p.goods = [{k:'kit'|'doll'|'egg', nm, price}] 한 줄, 아래에 가격표 */
  ART.A.dnShop = function (w, h, p) {
    var G = p.goods || [], o = bdrop(w, h, 6) + R(0, 0, w, h, '#B98552', STK + ' rx="6"') + R(10, 10, w - 20, h * .62, F.lin([[0, '#D9C2A0'], [.1, '#F6E6CF'], [1, '#EBD6B6']])) + R(4, h * .62 + 8, w - 8, 12, F.mat('wood', '#7A5434'), F.edge('#7A5434', 1.2));
    var gw = (w - 20) / Math.max(1, G.length), s = Math.min(gw * .62, h * .48);
    G.forEach(function (g, i) {
      var x = 10 + i * gw + (gw - s) / 2, y = 10 + h * .62 - s - 6;
      if (g.k === 'kit') o += R(x, y + s * .2, s, s * .8, '#3B6FD6', STK + ' rx="5"') + bone(x + s * .2, y + s * .62, x + s * .8, y + s * .5, s * .1) + R(x + s * .1, y + s * .26, s * .8, s * .14, '#fff', ' opacity=".7" rx="3"');
      else if (g.k === 'doll') o += dino(x, y + s * .05, s * .95, '#3DA35D');
      else o += '<ellipse cx="' + n1(x + s / 2) + '" cy="' + n1(y + s * .48) + '" rx="' + n1(s * .3) + '" ry="' + n1(s * .4) + '" fill="#F2C230"' + STK + '/>' + R(x + s * .2, y + s * .82, s * .6, s * .16, '#7A5434', STK + ' rx="4"');
      var ty = h * .62 + 28, tw = gw - 14;
      o += R(10 + i * gw + 7, ty, tw, h - ty - 8, '#FFFDF4', S2 + ' rx="6"');
      var fs = Math.min(18, tw / 6.2, (h - ty - 8) * .32);
      o += T(10 + i * gw + gw / 2, ty + (h - ty - 8) * .42, g.nm, fs) + T(10 + i * gw + gw / 2, ty + (h - ty - 8) * .82, g.price, fs, '#C8402F');
    });
    return bq(o);
  };

  /* 둥근 선물 상자(원기둥): p.c 색, p.label 옆 글, p.lock 자물쇠, 열리면 뚜껑이 들림 */
  ART.A.dnRound = function (w, h, p, open) {
    var f = c(p.c || '#E07A9A'), rx = w * .46, ry = h * .13, cx = w / 2, ty = open ? h * .38 : h * .3, by = h - ry - 3, o = F.ground(cx, h - 3, rx * 1.12, ry * .7);
    o += '<path d="M' + n1(cx - rx) + ' ' + n1(ty) + 'V' + n1(by) + 'A' + n1(rx) + ' ' + n1(ry) + ' 0 0 0 ' + n1(cx + rx) + ' ' + n1(by) + 'V' + n1(ty) + 'Z" fill="' + F.mat('cyl', f) + '"' + F.edge(f, 1.8) + '/>';
    o += R(cx - 9, ty, 18, by - ty + ry, '#F2C230', S2);
    if (open) {
      o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(ty) + '" rx="' + n1(rx) + '" ry="' + n1(ry) + '" fill="#2A221C"' + STK + '/>';
      o += '<g transform="rotate(-14 ' + n1(cx) + ' ' + n1(h * .1) + ')"><ellipse cx="' + n1(cx) + '" cy="' + n1(h * .14) + '" rx="' + n1(rx * 1.04) + '" ry="' + n1(ry) + '" fill="' + f + '"' + STK + '/></g>';
    } else {
      o += '<ellipse cx="' + n1(cx) + '" cy="' + n1(ty) + '" rx="' + n1(rx * 1.04) + '" ry="' + n1(ry) + '" fill="' + f + '"' + STK + '/>';
      o += '<path d="M' + n1(cx - 26) + ' ' + n1(ty - 16) + 'q-8 -18 10 -10l16 10l16 -10q18 -8 10 10z" fill="#F2C230"' + S2 + '/>';
      if (p.lock) o += R(cx - 13, (ty + by) / 2 - 6, 26, 28, '#F2C230', S2 + ' rx="4"') + '<circle cx="' + n1(cx) + '" cy="' + n1((ty + by) / 2 + 6) + '" r="4" fill="' + INK + '"/>';
    }
    if (p.label) o += R(cx + rx * .3, (ty + by) / 2 - 16, rx * .62, 30, '#fff', S2 + ' rx="5"') + T(cx + rx * .61, (ty + by) / 2 + 5, p.label, Math.min(16, rx * .62 / Math.max(2, String(p.label).length) * 1.6));
    return bq(o);
  };
})();
