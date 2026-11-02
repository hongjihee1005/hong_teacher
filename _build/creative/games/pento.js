/* 창의수학게임 › 펜토미노 채우기: 조각을 끌어 판에 놓고(칸에 착 붙음), 누르면 90° 돌리기, 단추로 뒤집기 — 판을 빈틈·겹침 없이 채우기 */
(function () {
  'use strict';
  var BASE = { F: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], I: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]], L: [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]], N: [[0, 0], [0, 1], [1, 1], [1, 2], [1, 3]],
    P: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], T: [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]], U: [[0, 0], [2, 0], [0, 1], [1, 1], [2, 1]], V: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]],
    W: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], X: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], Y: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], Z: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]] };
  var COL = { F: '#E5534B', I: '#3B82D6', L: '#2EAA6A', N: '#F2B92C', P: '#9B59D0', T: '#F08A24', U: '#20A5A5', V: '#D94F8A', W: '#7A9A2E', X: '#5B6BD6', Y: '#C98A2E', Z: '#2E8F9A' };
  var NS = 'http://www.w3.org/2000/svg', P, ctx, host, svg, L, pcs, sel = -1, drag = null, solved;
  function norm(cs) { var mx = Infinity, my = Infinity; cs.forEach(function (c) { mx = Math.min(mx, c[0]); my = Math.min(my, c[1]) }); return cs.map(function (c) { return [c[0] - mx, c[1] - my] }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1] }) }
  function cellsOf(o) { var cs = BASE[o.p].map(function (c) { return [o.f ? -c[0] : c[0], c[1]] }); for (var i = 0; i < o.r; i++) cs = cs.map(function (c) { return [-c[1], c[0]] }); return norm(cs) }
  function size(cs) { var w = 0, h = 0; cs.forEach(function (c) { w = Math.max(w, c[0] + 1); h = Math.max(h, c[1] + 1) }); return [w, h] }
  function layout() {
    var wide = host.clientWidth >= 640, cols = Math.min(P.p.length, wide ? 4 : 2), slotW = 6, slotH = 4.2, n = P.p.length, rows = Math.ceil(n / cols);
    var W = Math.max(P.w + 1, cols * slotW), bx = (W - P.w) / 2, by = .5, ty = P.h + 1.3;
    return { W: W, H: ty + rows * slotH + .2, bx: bx, by: by, ty: ty, cols: cols, slotW: slotW, slotH: slotH, tx: (W - cols * slotW) / 2 };
  }
  function toTray(o, i) {   // 트레이 칸에, 높이가 낮은 방향으로
    var best = null; for (var f = 0; f < 2; f++) for (var r = 0; r < 4; r++) { var s = size(cellsOf({ p: o.p, r: r, f: f })); if (s[0] <= 5 && (!best || s[1] < best.h || (s[1] === best.h && s[0] > best.w))) best = { r: r, f: f, w: s[0], h: s[1] } }
    if (o.r === undefined || o.home) { o.r = best.r; o.f = best.f }
    var s2 = size(cellsOf(o)), cx = L.tx + (i % L.cols + .5) * L.slotW, cy = L.ty + (Math.floor(i / L.cols) + .5) * L.slotH;
    o.x = cx - s2[0] / 2; o.y = cy - s2[1] / 2; o.on = false; o.home = false;
  }
  function occupied(skip) { var m = {}; pcs.forEach(function (o, k) { if (o.on && k !== skip) cellsOf(o).forEach(function (c) { m[(o.gx + c[0]) + ',' + (o.gy + c[1])] = k }) }); return m }
  function tryPlace(o, k, gx, gy) {
    var m = occupied(k), ok = cellsOf(o).every(function (c) { var x = gx + c[0], y = gy + c[1]; return x >= 0 && y >= 0 && x < P.w && y < P.h && m[x + ',' + y] === undefined });
    if (ok) { o.on = true; o.gx = gx; o.gy = gy; o.x = L.bx + gx; o.y = L.by + gy } return ok;
  }
  function draw() {
    svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'pt-svg'); svg.setAttribute('viewBox', '0 0 ' + L.W + ' ' + L.H.toFixed(2));
    var h = '<rect class="pt-tray" x="' + (L.tx - .1) + '" y="' + (L.ty - .15) + '" width="' + (L.cols * L.slotW + .2) + '" height="' + (L.H - L.ty) + '" rx=".4"/>';
    for (var y = 0; y < P.h; y++) for (var x = 0; x < P.w; x++) h += '<rect class="pt-cell" x="' + (L.bx + x) + '" y="' + (L.by + y) + '" width="1" height="1"/>';
    h += '<rect class="pt-frame" x="' + L.bx + '" y="' + L.by + '" width="' + P.w + '" height="' + P.h + '"/><g class="pt-pcs"></g>';
    svg.innerHTML = h; var g = svg.lastChild;
    pcs.forEach(function (o, k) { var e = document.createElementNS(NS, 'g'); e.setAttribute('class', 'pt-pc'); e.dataset.k = k; o.el = e; g.appendChild(e); paint(o) });
    var b = host.querySelector('.pt-board'); b.innerHTML = ''; b.appendChild(svg); bind(); select(sel);
  }
  function paint(o) {
    o.el.setAttribute('transform', 'translate(' + o.x.toFixed(3) + ' ' + o.y.toFixed(3) + ')');
    o.el.innerHTML = cellsOf(o).map(function (c) { return '<rect x="' + (c[0] + .04) + '" y="' + (c[1] + .04) + '" width=".92" height=".92" rx=".12" fill="' + COL[o.p] + '"/>' }).join('');
    o.el.classList.toggle('pt-on', !!o.on);
  }
  function select(k) { sel = k; pcs.forEach(function (o, j) { o.el.classList.toggle('pt-sel', j === k) }); if (k >= 0) o_front(k); host.querySelectorAll('.pt-tool').forEach(function (b) { b.disabled = k < 0 }) }
  function o_front(k) { pcs[k].el.parentNode.appendChild(pcs[k].el) }
  function world(e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()) }
  function bind() {
    svg.addEventListener('pointerdown', function (e) {
      var t = e.target.closest && e.target.closest('.pt-pc'); if (!t || solved) { if (!t) select(-1); return }
      e.preventDefault(); var k = +t.dataset.k, w = world(e); select(k);
      drag = { k: k, sx: w.x, sy: w.y, x: pcs[k].x, y: pcs[k].y, moved: false, id: e.pointerId };
      try { svg.setPointerCapture(e.pointerId) } catch (er) {}
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return; var w = world(e), dx = w.x - drag.sx, dy = w.y - drag.sy;
      if (!drag.moved && dx * dx + dy * dy < .04) return;
      var o = pcs[drag.k]; if (!drag.moved) { drag.moved = true; o.on = false } o.x = drag.x + dx; o.y = drag.y + dy; paint(o);
    });
    function up(e) {
      if (!drag || e.pointerId !== drag.id) return; var d = drag; drag = null; var o = pcs[d.k];
      if (!d.moved) { turn(1); return }
      var gx = Math.round(o.x - L.bx), gy = Math.round(o.y - L.by);
      if (!tryPlace(o, d.k, gx, gy)) {
        var s = size(cellsOf(o)), cx = o.x + s[0] / 2, cy = o.y + s[1] / 2;
        if (cx > L.bx - .5 && cx < L.bx + P.w + .5 && cy < L.by + P.h + .5) ctx.msg('판 밖으로 나가거나 다른 조각과 겹쳐요. 돌리거나 다른 자리를 찾아보세요.', 'bad');
        o.x = Math.max(0, Math.min(L.W - s[0], o.x)); o.y = Math.max(0, Math.min(L.H - s[1], o.y));
      } else ctx.msg('');
      paint(o); after();
    }
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
  }
  function reshape(fn) {
    if (sel < 0 || solved) return; var o = pcs[sel], s0 = size(cellsOf(o)), cx = o.x + s0[0] / 2, cy = o.y + s0[1] / 2, wasOn = o.on;
    fn(o); var s1 = size(cellsOf(o));
    o.on = false; o.x = cx - s1[0] / 2; o.y = cy - s1[1] / 2;   // 제자리에서 돌기(밀려나지 않게)
    if (wasOn) tryPlace(o, sel, Math.round(o.x - L.bx), Math.round(o.y - L.by));   // 판 위에 있던 조각은 될 수 있으면 다시 칸에 붙임
    paint(o); after();
  }
  function turn(d) { reshape(function (o) { o.r = (o.r + d + 4) % 4 }) }
  function flip() { reshape(function (o) { o.f = 1 - o.f }) }
  function after() {
    var n = pcs.filter(function (o) { return o.on }).length;
    host.querySelector('#ptCnt').innerHTML = '놓은 조각 <b>' + n + '</b> / ' + pcs.length;
    if (n === pcs.length) { solved = true; select(-1); host.querySelector('.pt-board').classList.add('win'); ctx.done('조각 ' + pcs.length + '개로 판을 빈틈없이 채웠어요!') }
  }
  function onResize() { if (!svg || !document.body.contains(svg)) return; var w = host.clientWidth >= 640, want = Math.min(P.p.length, w ? 4 : 2); if (L.cols === want) return; L = layout(); pcs.forEach(function (o, i) { if (o.on) { o.x = L.bx + o.gx; o.y = L.by + o.gy } else toTray(o, i) }); draw() }
  window.addEventListener('resize', onResize);
  document.addEventListener('keydown', function (e) {
    if (!svg || !document.body.contains(svg) || sel < 0 || solved || /INPUT|TEXTAREA/.test((e.target || {}).tagName || '')) return;
    if (e.key === 'r' || e.key === 'R') turn(1); else if (e.key === 'e' || e.key === 'E') turn(-1); else if (e.key === 'f' || e.key === 'F') flip();
  });
  function putSolution(k, s) { var o = pcs[k]; o.r = s[1]; o.f = s[2]; var m = occupied(k); cellsOf(o).forEach(function (c) { var j = m[(s[3] + c[0]) + ',' + (s[4] + c[1])]; if (j !== undefined) { pcs[j].home = true; toTray(pcs[j], j); paint(pcs[j]) } }); tryPlace(o, k, s[3], s[4]); paint(o) }
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; solved = false; sel = -1; drag = null;
      host.innerHTML = '<p class="pt-goal">조각 <b>' + p.p.length + '개</b>를 모두 써서 ' + p.w + '×' + p.h + ' 판을 빈틈없이 채워요</p><div class="pt-board"></div>'
        + '<div class="pt-tools"><span id="ptCnt"></span><button type="button" class="pt-btn pt-tool" data-a="l" disabled>↶ 왼쪽으로</button><button type="button" class="pt-btn pt-tool" data-a="r" disabled>↷ 오른쪽으로</button><button type="button" class="pt-btn pt-tool" data-a="f" disabled>⇄ 뒤집기</button></div>'
        + '<p class="pt-tip">조각을 <b>끌어서</b> 판에 놓으면 칸에 착 붙어요. <b>살짝 누르면</b> 90° 돌아가요. 키보드: R/E 돌리기 · F 뒤집기</p>';
      host.querySelector('.pt-tools').onclick = function (e) { var b = e.target.closest('[data-a]'); if (!b) return; ({ l: function () { turn(-1) }, r: function () { turn(1) }, f: flip })[b.dataset.a]() };
      L = layout(); pcs = p.p.map(function (q, i) { var o = { p: q, home: true }; toTray(o, i); return o }); draw(); after();
    },
    hint: function () {   // 제자리에 없는 조각 하나를 풀이 자리에 놓아 줌(그 자리를 막은 조각은 트레이로)
      if (solved) return false;
      for (var i = 0; i < P.s.length; i++) {
        var s = P.s[i], k = P.p.indexOf(s[0]), o = pcs[k], want = cellsOf({ p: s[0], r: s[1], f: s[2] }).map(function (c) { return (s[3] + c[0]) + ',' + (s[4] + c[1]) }).sort().join(' ');
        var now = o.on ? cellsOf(o).map(function (c) { return (o.gx + c[0]) + ',' + (o.gy + c[1]) }).sort().join(' ') : '';
        if (now === want) continue;
        putSolution(k, s); select(k); o.el.classList.add('pt-hint'); after(); if (!solved) ctx.msg('💡 ' + s[0] + ' 조각을 제자리에 놓았어요.'); return true;
      }
      return false;
    },
    reveal: function () { P.s.forEach(function (s) { putSolution(P.p.indexOf(s[0]), s) }); after() }
  };
})();
