/* 수학 방탈출 · 탐정 사무소 탈출 그림 (2026-11-28) — 이름 앞글자 dt2. art.js의 ART.c·ART.shape·ART.arrow·ART.esc를 씀.
   세는 그림(고양이 발자국)·재는 그림(도형 조각)은 p로 받은 값대로 그림. */
(function () {
  var c = ART.c, esc = ART.esc, shape = ART.shape, arrow = ART.arrow;
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
  function T(x, y, s, size, f, o, anc) { return '<text x="' + x + '" y="' + y + '" font-size="' + size + '" fill="' + (f || '#1F2433') + '" text-anchor="' + (anc || 'middle') + '" font-weight="700"' + (o || '') + '>' + esc(s) + '</text>' }
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  function P(d, f, o) { return '<path d="' + d + '" fill="' + f + '"' + (o || '') + '/>' }
  function L(x1, y1, x2, y2, s, w, o) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + s + '" stroke-width="' + w + '"' + (o || '') + '/>' }
  function poly(pts, f, o) { return '<polygon points="' + pts.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1) }).join(' ') + '" fill="' + f + '"' + (o || '') + '/>' }
  function DL(x1, y1, x2, y2) { return L(x1, y1, x2, y2, '#1F2433', 1.6, ' stroke-dasharray="5 4"') }
  var K = ' stroke="#1F2433" stroke-width="3" stroke-linejoin="round"', K2 = ' stroke="#1F2433" stroke-width="2" stroke-linejoin="round"';
  function pin(x, y) { return C(x + 1.5, y + 2, 5, '#2A1608', ' opacity=".25"') + C(x, y, 5, F.ball('#D23B2E'), ' stroke="#7A1F18" stroke-width="1.2"') }
  function trophy(cx, cy, s) { return P('M' + (cx - s * .5) + ' ' + (cy - s * .6) + 'H' + (cx + s * .5) + 'Q' + (cx + s * .45) + ' ' + (cy + s * .05) + ' ' + cx + ' ' + (cy + s * .12) + 'Q' + (cx - s * .45) + ' ' + (cy + s * .05) + ' ' + (cx - s * .5) + ' ' + (cy - s * .6) + 'Z', '#F2C230', K2) + R(cx - s * .08, cy + s * .1, s * .16, s * .3, '#F2C230', K2) + R(cx - s * .3, cy + s * .4, s * .6, s * .14, '#8A5A2B', K2 + ' rx="2"') + P('M' + (cx - s * .5) + ' ' + (cy - s * .5) + 'q-' + s * .25 + ' 0 -' + s * .2 + ' ' + s * .22 + 'q' + s * .05 + ' ' + s * .14 + ' ' + s * .27 + ' ' + s * .12 + 'M' + (cx + s * .5) + ' ' + (cy - s * .5) + 'q' + s * .25 + ' 0 ' + s * .2 + ' ' + s * .22 + 'q-' + s * .05 + ' ' + s * .14 + ' -' + s * .27 + ' ' + s * .12, 'none', ' stroke="#1F2433" stroke-width="2.5"') }

  /* 사건 게시판: 축제 포스터(p.lines) + 트로피 사진 + 빨간 실. 오른쪽 아래는 비워 둠(쪽지 자리) */
  ART.A.dt2Board = function (w, h, p) {
    var o = bdrop(w, h, 6) + R(0, 0, w, h, '#7A5434', K + ' rx="6"') + R(9, 9, w - 18, h - 18, F.mat('cloth', '#C89B62')) + F.shade(w * .6, 9, w * .4 - 9, h - 18, 0, .14);
    for (var i = 0; i < 30; i++) o += C(12 + (i * 71) % (w - 24), 12 + (i * 43) % (h - 24), 1.6, '#9A6A3F', ' opacity=".6"');
    var L_ = p.lines || [], pw = w * .4, ph = h * .62, fs = Math.min(ph / (L_.length + 1) * .7, pw * .13);
    o += R(18, 18, pw, ph, '#FFFDF4', K2 + ' rx="3"') + R(18, 18, pw, fs * 1.5, '#3B6FD6', ' rx="3"') + pin(18 + pw / 2, 22);
    L_.forEach(function (s, i) { o += T(18 + pw / 2, 18 + fs * 1.15 + i * fs * 1.45 + (i ? fs * .35 : 0), s, i ? fs : fs * .9, i ? '#1F2433' : '#fff') });
    var tx = 30 + pw, tw = w * .3, th = h * .45;
    o += R(tx, 22, tw, th, '#F6F3EC', K2 + ' rx="2"') + R(tx + 6, 28, tw - 12, th - 26, '#9FC3D9') + trophy(tx + tw / 2, 28 + (th - 26) * .5, Math.min(tw, th) * .55) + T(tx + tw / 2, 22 + th - 6, '사라진 트로피', Math.min(13, tw * .11), '#1F2433') + pin(tx + tw / 2, 26);
    var nx = tx + tw + 10, nw = w - 18 - nx - 4;
    if (nw > 30) o += R(nx, 34, nw, h * .3, '#FFF2A8', K2.replace('2"', '1.5"') + ' rx="2"') + T(nx + nw / 2, 34 + h * .18, '?', h * .14, '#C8402F') + pin(nx + nw / 2, 38);
    o += L(18 + pw / 2, 22, tx + tw / 2, 26, '#D23B2E', 2) + L(tx + tw / 2, 26, nx + nw / 2, 38, '#D23B2E', 2);
    o += R(18, 26 + ph, pw + tw * .7, h - 44 - ph, '#FFFDF4', K2.replace('2"', '1.5"') + ' rx="2"') + T(18 + (pw + tw * .7) / 2, 26 + ph + (h - 44 - ph) * .62, '고양이 털이 떨어져 있었음', Math.min(14, (h - 44 - ph) * .42), '#1F2433');
    return bq(o);
  };

  /* 암호표: p.rows=[[약수 개수, 화살표]] */
  ART.A.dt2Code = function (w, h, p) {
    var rows = p.rows || [], o = bdrop(w, h, 6) + R(0, 0, w, h, '#FFFDF4', K + ' rx="6"') + pin(w / 2, 9), fs = Math.min(h * .1, w * .09);
    o += T(w / 2, fs * 1.9, '암호표', fs * 1.1, '#1F2433') + T(w / 2, fs * 3.15, '약수의 개수 → 화살표', fs * .8, '#5A6070');
    var top = fs * 3.9, rh = (h - top - 8) / Math.max(1, rows.length);
    rows.forEach(function (r, i) { var y = top + i * rh; o += R(10, y + 2, w - 20, rh - 4, i % 2 ? '#F1EEE6' : '#E6EDF5', ' rx="4"') + T(w * .42, y + rh * .66, '약수 ' + r[0] + '개', Math.min(rh * .48, fs), '#1F2433', '', 'end') + T(w * .52, y + rh * .66, '→', Math.min(rh * .48, fs), '#8A929C') + arrow(r[1], w * .72, y + rh / 2, Math.min(rh * .32, fs * .7), '#C8402F') });
    return bq(o);
  };

  /* 서류함: 위 놋쇠판에 수 p.nums, 옆에 화살표 단추. 열리면 맨 위 서랍이 나옴 */
  ART.A.dt2Files = function (w, h, p, open) {
    var o = F.ground(w / 2, h, w * .56, 9) + R(0, 0, w, h, '#5E6B78', K + ' rx="5"'), dh = (h - h * .2 - 16) / 3, nums = p.nums || [];
    o += R(w * .06, 8, w * .88, h * .16, '#C9A24B', K2 + ' rx="4"') + T(w / 2, 8 + h * .11, nums.join('  '), Math.min(h * .07, w * .09), '#3A2C22');
    for (var i = 0; i < 3; i++) {
      var y = h * .2 + 8 + i * dh;
      if (i === 0 && open) { o += R(8, y, w - 16, dh - 8, '#1F2433') + R(-w * .06, y + dh * .25, w * 1.12, dh * .75, '#8A97A6', K2) + R(w * .05, y + dh * .05, w * .2, dh * .4, '#F2E6C2', K2.replace('2"', '1.2"')) + R(w * .3, y, w * .2, dh * .45, '#F2C2A8', K2.replace('2"', '1.2"')) + R(w * .55, y + dh * .08, w * .2, dh * .37, '#CDE3F2', K2.replace('2"', '1.2"')); continue }
      o += R(8, y, w - 16, dh - 8, '#7A8896', K2 + ' rx="3"') + F.shade(w * .62, y, w * .38 - 8, dh - 8, 3, .2) + R(w * .38, y + dh * .3, w * .24, dh * .16, '#C8CDD3', K2.replace('2"', '1.5"') + ' rx="3"') + R(w * .42, y + dh * .55, w * .16, dh * .2, '#FFFDF4', ' rx="2"');
    }
    return bq(o);
  };

  /* 합동 찾기 그림: 왼쪽 p.target, 오른쪽 p.items=[{s:이름표 모양, pts:[[x,y]…]}] (모눈 칸 좌표) */
  ART.A.dt2Shapes = function (w, h, p) {
    var o = bdrop(w, h, 6) + R(0, 0, w, h, '#FFFDF4', K + ' rx="6"') + T(w / 2, 24, p.title || '', 16, '#1F2433'), it = p.items || [], cols = 3, rows = Math.ceil(it.length / cols);
    var top = 36, g = Math.min((w - 24) / (5.2 + cols * 5), (h - top - 10) / (rows * 5.2)), pw = 5 * g, ph = (h - top - 10) / rows;
    function panel(x, y, pts, f, tag) {
      var s = R(x + 3, y + 3, pw - 6, ph - 6, '#fff', ' stroke="#C9CED6" stroke-width="1.2" rx="4"'), gx = x + g * .5, gy = y + g * .9;
      for (var a = 0; a <= 4; a++) for (var b = 0; b <= 3; b++) s += C(gx + a * g, gy + b * g * 1, 1.6, '#9AA3AE');
      s += poly(pts.map(function (q) { return [gx + q[0] * g, gy + q[1] * g] }), f, K2);
      if (tag) s += C(x + pw - g * .55, y + g * .55, g * .38, '#FFF2A8', K2.replace('2"', '1.2"')) + shape(tag, x + pw - g * .55, y + g * .57, g * .24, '#1F2433');
      return s;
    }
    var ty = top + (h - top - 10 - ph) / 2;
    o += panel(8, ty, p.target || [], '#E9C46A') + T(8 + pw / 2, ty + ph + 4, '트로피 받침', Math.min(13, g * .55), '#9A520C');
    it.forEach(function (q, i) { o += panel(16 + pw + (i % cols) * pw, top + Math.floor(i / cols) * ph, q.pts, '#8FB0D0', q.s) });
    return bq(o);
  };

  /* 작은 글씨 신문: 열리면(돋보기를 대면) 동그란 렌즈 안이 크게 보임 */
  ART.A.dt2Paper = function (w, h, p, open) {
    var o = bdrop(w, h, 3) + R(0, 0, w, h, '#F4F1E8', K + ' rx="3"') + T(w / 2, h * .17, '마을 소식', h * .12, '#1F2433') + L(10, h * .23, w - 10, h * .23, '#1F2433', 2);
    for (var i = 0; i < 7; i++) o += R(12, h * .3 + i * h * .085, w * .45, h * .035, '#B8B3A8');
    o += R(w * .55, h * .3, w * .38, h * .55, '#E6E0D2', K2.replace('2"', '1.2"'));
    for (var j = 0; j < 9; j++) o += R(w * .58, h * .34 + j * h * .055, w * .32, h * .02, '#9A958A');
    if (open) o += C(w * .74, h * .57, h * .34, '#FFFDF4', ' stroke="#8A5A2B" stroke-width="5"') + F.glassHL(w * .74 - h * .18, h * .57 - h * .26, h * .36, h * .14, .3) + L(w * .74 + h * .24, h * .57 + h * .24, w * .74 + h * .42, h * .57 + h * .42, '#8A5A2B', 7, ' stroke-linecap="round"') + T(w * .74, h * .52, '합동인', h * .08, '#1F2433') + T(w * .74, h * .64, '도형만!', h * .08, '#C8402F');
    return bq(o);
  };

  /* 도형 타일: p.tiles=[{k:'para'|'tri'|'rhom'|'rect', c, a, b}] — 같은 비율로 그리고 길이(cm) 글 */
  ART.A.dt2Tiles = function (w, h, p) {
    var tl = p.tiles || [], cols = 2, rows = Math.ceil(tl.length / cols), top = 34, pw = (w - 16) / cols, ph = (h - top - 8) / rows, o = bdrop(w, h, 6) + R(0, 0, w, h, '#FFFDF4', K + ' rx="6"') + T(w / 2, 23, p.title || '', 16, '#1F2433');
    var s = Math.min((pw - 70) / 12, (ph - 40) / 10), fs = Math.min(14, ph * .12), HL = ' paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"';
    tl.forEach(function (t, i) {
      var px = 8 + (i % cols) * pw, py = top + Math.floor(i / cols) * ph, cx = px + pw / 2, by = py + ph - 26, f = c(t.c), a = t.a * s, b = t.b * s, x0 = cx - a / 2;
      o += R(px + 3, py + 2, pw - 6, ph - 4, '#fff', ' stroke="#E0DDD5" stroke-width="1" rx="4"') + R(px + 10, py + 9, 16, 16, f, K2.replace('2"', '1.5"') + ' rx="3"') + T(px + 32, py + 22, t.nm || '', fs * .9, '#5A6070', '', 'start');
      if (t.k === 'para') { var sl = a * .28; o += poly([[x0 - sl / 2, by], [x0 + a - sl / 2, by], [x0 + a + sl / 2, by - b], [x0 + sl / 2, by - b]], f, K2) + DL(x0 + sl / 2, by - b, x0 + sl / 2, by) + T(cx, by + 17, t.a + ' cm', fs) + T(x0 + sl / 2 + 5, by - b / 2 + 5, t.b + ' cm', fs, '#1F2433', HL, 'start') }
      else if (t.k === 'tri') { o += poly([[x0, by], [x0 + a, by], [x0 + a * .35, by - b]], f, K2) + DL(x0 + a * .35, by - b, x0 + a * .35, by) + T(cx, by + 17, t.a + ' cm', fs) + T(x0 + a * .35 + 5, by - b * .3, t.b + ' cm', fs, '#1F2433', HL, 'start') }
      else if (t.k === 'rhom') { var my = by - b / 2; o += poly([[cx, by - b], [cx + a / 2, my], [cx, by], [cx - a / 2, my]], f, K2) + DL(cx - a / 2, my, cx + a / 2, my) + DL(cx, by - b, cx, by) + T(cx - a / 4, my - 6, t.a + ' cm', fs, '#1F2433', HL) + T(cx + 6, my + b / 4 + fs * .4, t.b + ' cm', fs, '#1F2433', HL, 'start') }   /* 길이 글을 그 대각선 위에 붙임(2026-11-28) */
      else { var q = Math.min(a, b) * .14; o += R(x0, by - b, a, b, f, K2) + '<path d="M' + x0 + ' ' + (by - q) + 'H' + (x0 + q) + 'V' + by + 'M' + (x0 + a - q) + ' ' + (by - b) + 'V' + (by - b + q) + 'H' + (x0 + a) + '" fill="none" stroke="#1F2433" stroke-width="1.5"/>' + T(cx, by + 17, t.a + ' cm', fs) + T(x0 + a + 5, by - b / 2 + 5, t.b + ' cm', fs, '#1F2433', '', 'start') }
    });
    return bq(o);
  };

  /* 고양이 발자국 p.n개(왼쪽에서 오른쪽으로, 좌우 발이 번갈아) */
  ART.A.dt2Prints = function (w, h, p) {
    var n = p.n || 0, o = '', st = (w - 30) / Math.max(1, n), r = Math.min(st * .45, h * .16);
    for (var i = 0; i < n; i++) {
      var x = 15 + st * (i + .5), y = h * .5 + (i % 2 ? r * 1.1 : -r * 1.1) + Math.sin(i * .5) * h * .12;
      o += '<g transform="rotate(90 ' + x + ' ' + y + ')"><ellipse cx="' + x + '" cy="' + (y + r * .3) + '" rx="' + r * .55 + '" ry="' + r * .45 + '" fill="#2A2A2A" opacity=".75"/>' + [-.55, -.2, .2, .55].map(function (d) { return C(x + d * r, y - r * .45 - (Math.abs(d) < .3 ? r * .15 : 0), r * .2, '#2A2A2A', ' opacity=".75"') }).join('') + '</g>';
    }
    return bq(o);
  };
})();
