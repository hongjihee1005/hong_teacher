/* 창의수학게임 › 칠교놀이: 칠교 조각 7개를 끌어 옮기고 돌려서 그림자 모양을 빈틈·겹침 없이 채우기
   조각을 끌면 옮겨지고, 살짝 누르면 오른쪽으로 45° 돌아감. 놓으면 가까운 꼭짓점(그림자·다른 조각)에 붙음.
   판정은 그림자 안팎을 촘촘한 점으로 재어(점마다 조각이 꼭 하나) — 풀이와 다른 방법으로 채워도 맞음 */
(function () {
  'use strict';
  var BASE = { L: [[0, 0], [2, 0], [0, 2]], M: [[0, 0], [2, 0], [1, 1]], S: [[0, 0], [1, 0], [0, 1]], Q: [[0, 0], [1, 0], [1, 1], [0, 1]], P: [[0, 0], [1, 0], [2, 1], [1, 1]] };
  var TY = ['L', 'L', 'M', 'S', 'S', 'Q', 'P'], COL = ['#E5534B', '#3B82D6', '#2EAA6A', '#F2B92C', '#9B59D0', '#F08A24', '#20A5A5'];
  var NM = ['큰 삼각형', '큰 삼각형', '중간 삼각형', '작은 삼각형', '작은 삼각형', '정사각형', '평행사변형'];
  var CEN = {}, SQ = Math.SQRT1_2, NS = 'http://www.w3.org/2000/svg';
  Object.keys(BASE).forEach(function (t) { var b = BASE[t], mx = 0, my = 0; b.forEach(function (p) { mx += p[0] / b.length; my += p[1] / b.length }); CEN[t] = b.map(function (p) { return [p[0] - mx, p[1] - my] }) });
  function tf(pts, r, f) { var a = r * Math.PI / 4, c = Math.cos(a), s = Math.sin(a); return pts.map(function (p) { var x = f ? -p[0] : p[0], y = p[1]; return [x * c - y * s, x * s + y * c] }) }
  function polyOf(o) { return tf(CEN[o.t], o.r, o.f).map(function (p) { return [p[0] + o.x, p[1] + o.y] }) }
  function inside(poly, x, y) { var ins = false; for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) { var a = poly[i], b = poly[j]; if ((a[1] > y) !== (b[1] > y) && x < a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1])) ins = !ins } return ins }
  function pts(poly) { return poly.map(function (p) { return p[0].toFixed(3) + ',' + p[1].toFixed(3) }).join(' ') }
  function key(poly) { return poly.map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2) }).sort().join(' ') }

  var P, ctx, host, svg, gPc, sol, pcs, sel = -1, L, solved, drag = null, mode = '';

  function solution(p) {   // 풀이 조각(바둑판 점으로 맞춘 꼭짓점, 도전의 일부는 45° 돌려 보여 줌) → 왼쪽 위를 0으로
    var S = p.pcs.map(function (a) {
      var t = TY[a[0]], v = tf(CEN[t], a[3], a[4]).map(function (q) { return [Math.round(q[0] + a[1]), Math.round(q[1] + a[2])] });
      if (p.rot) v = v.map(function (q) { return [(q[0] - q[1]) * SQ, (q[0] + q[1]) * SQ] });
      var cx = 0, cy = 0; v.forEach(function (q) { cx += q[0] / v.length; cy += q[1] / v.length });
      return { k: a[0], t: t, v: v, x: cx, y: cy, r: (a[3] + (p.rot ? 1 : 0)) % 8, f: a[4] };
    });
    var mx = Infinity, my = Infinity, Mx = -Infinity, My = -Infinity;
    S.forEach(function (s) { s.v.forEach(function (q) { mx = Math.min(mx, q[0]); my = Math.min(my, q[1]); Mx = Math.max(Mx, q[0]); My = Math.max(My, q[1]) }) });
    S.forEach(function (s) { s.x -= mx; s.y -= my; s.v = s.v.map(function (q) { return [q[0] - mx, q[1] - my] }) });
    S.w = Mx - mx; S.h = My - my; return S;
  }
  function layout() {   // 넓은 화면: 그림자 왼쪽 · 조각 상자 오른쪽(3×3) / 좁은 화면: 그림자 위 · 조각 상자 아래(4×2)
    var wide = host.clientWidth >= 640, pad = .8, slot = 2.7, o = { wide: wide, slot: slot };
    if (wide) { o.th = Math.max(sol.h + 2 * pad, 3 * slot); o.tw = Math.max(sol.w + 2 * pad, 7); o.W = o.tw + 3 * slot + .3; o.H = o.th; o.tx = o.tw + .3; o.ty = (o.H - 3 * slot) / 2; o.cols = 3 }
    else { o.tw = Math.max(sol.w + 2 * pad, 4 * slot); o.th = sol.h + 2 * pad; o.W = o.tw; o.H = o.th + 2 * slot + .3; o.tx = (o.W - 4 * slot) / 2; o.ty = o.th + .3; o.cols = 4 }
    o.ox = (o.tw - sol.w) / 2; o.oy = (o.th - sol.h) / 2; return o;
  }
  function slotXY(i) { return [L.tx + (i % L.cols + .5) * L.slot, L.ty + (Math.floor(i / L.cols) + .5) * L.slot] }

  function draw() {
    svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'tg-svg'); svg.setAttribute('viewBox', '0 0 ' + L.W.toFixed(3) + ' ' + L.H.toFixed(3));
    svg.setAttribute('role', 'application'); svg.setAttribute('aria-label', '칠교 놀이판: 조각을 끌어 옮기고, 누르면 돌아가요');
    var h = '<rect class="tg-tray" x="' + (L.tx - .1) + '" y="' + (L.ty - .1) + '" width="' + (L.cols * L.slot + .2) + '" height="' + ((L.wide ? 3 : 2) * L.slot + .2) + '" rx=".35"/>';
    h += '<g class="tg-sil" transform="translate(' + L.ox + ' ' + L.oy + ')">' + sol.map(function (s) { return '<polygon points="' + pts(s.v) + '"/>' }).join('') + '</g>';
    if (P.ln) h += '<g class="tg-ln" transform="translate(' + L.ox + ' ' + L.oy + ')">' + sol.map(function (s) { return '<polygon points="' + pts(s.v) + '"/>' }).join('') + '</g>';
    svg.innerHTML = h + '<g class="tg-pcs"></g>'; gPc = svg.lastChild;
    pcs.forEach(function (o, i) { var e = document.createElementNS(NS, 'polygon'); e.setAttribute('class', 'tg-pc'); e.setAttribute('fill', COL[i]); e.dataset.k = i; e.setAttribute('aria-label', NM[i]); o.el = e; gPc.appendChild(e); place(o) });
    var b = host.querySelector('.tg-board'); b.innerHTML = ''; b.appendChild(svg); bind();
    if (sel >= 0) select(sel);
  }
  function place(o) { o.el.setAttribute('points', pts(polyOf(o))) }
  function world(e) { var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()) }
  function select(i) {
    sel = i; pcs.forEach(function (o, k) { o.el.classList.toggle('on', k === i) });
    if (i >= 0) gPc.appendChild(pcs[i].el);
    host.querySelectorAll('.tg-tool').forEach(function (b) { b.disabled = i < 0 });
    var n = host.querySelector('.tg-sel'); if (n) n.textContent = i >= 0 ? NM[i] : '조각을 골라요';
  }
  function bind() {
    svg.addEventListener('pointerdown', function (e) {
      var t = e.target.closest && e.target.closest('.tg-pc'); if (!t || solved) { if (!t) select(-1); return }
      e.preventDefault(); var i = +t.dataset.k, w = world(e); select(i);
      drag = { i: i, sx: w.x, sy: w.y, x: pcs[i].x, y: pcs[i].y, moved: false, id: e.pointerId };
      try { svg.setPointerCapture(e.pointerId) } catch (er) {}
    });
    svg.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return; var w = world(e), dx = w.x - drag.sx, dy = w.y - drag.sy;
      if (!drag.moved && dx * dx + dy * dy < .02) return; drag.moved = true;
      var o = pcs[drag.i]; o.x = clamp(drag.x + dx, 0, L.W); o.y = clamp(drag.y + dy, 0, L.H); place(o);
    });
    function up(e) {
      if (!drag || e.pointerId !== drag.id) return; var d = drag; drag = null;
      if (d.moved) { pcs[d.i].tray = false; snap(pcs[d.i]); after() } else turn(1);
    }
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)) }
  function snap(o) {   // 가장 가까운 꼭짓점끼리 붙이기(0.4칸 안)
    var mine = polyOf(o), best = .4, dx = 0, dy = 0, cand = [];
    sol.forEach(function (s) { s.v.forEach(function (q) { cand.push([q[0] + L.ox, q[1] + L.oy]) }) });
    pcs.forEach(function (p) { if (p !== o && !p.tray) cand = cand.concat(polyOf(p)) });
    mine.forEach(function (m) { cand.forEach(function (c) { var d = Math.hypot(c[0] - m[0], c[1] - m[1]); if (d < best) { best = d; dx = c[0] - m[0]; dy = c[1] - m[1] } }) });
    o.x += dx; o.y += dy; place(o);
  }
  function turn(d) { if (sel < 0 || solved) return; var o = pcs[sel]; o.r = (o.r + d + 8) % 8; if (!o.tray) snap(o); else place(o); after() }
  function flip() { if (sel < 0 || solved) return; var o = pcs[sel]; o.f = 1 - o.f; if (!o.tray) snap(o); else place(o); after() }

  function judge() {   // 그림자 안팎을 촘촘한 점으로 재기
    var S = sol.map(function (s) { return s.v.map(function (q) { return [q[0] + L.ox, q[1] + L.oy] }) }), Q = pcs.map(polyOf);
    var st = .125, inN = 0, bad = 0, over = 0;
    for (var x = L.ox - .4 + .0613; x < L.ox + sol.w + .4; x += st) for (var y = L.oy - .4 + .0587; y < L.oy + sol.h + .4; y += st) {
      var inT = S.some(function (p) { return inside(p, x, y) }), c = 0;
      for (var k = 0; k < Q.length; k++) if (inside(Q[k], x, y)) c++;
      if (inT) inN++; if (c > 1) over++;
      if (inT ? c !== 1 : c > 0) bad++;
    }
    return { ok: bad <= inN * .01, over: over > inN * .01 };
  }
  function after() {
    var allOut = pcs.every(function (o) { return !o.tray }), j = judge();
    if (j.ok) { solved = true; select(-1); host.classList.add('tg-win'); ctx.done('칠교 조각 7개로 ‘' + P.nm + '’ 모양을 완성했어요!'); return }
    if (j.over) ctx.msg('겹친 조각이 있어요. 조각끼리 겹치지 않게 놓아요.', 'bad');
    else if (allOut) ctx.msg('조금만 더! 빈틈이 있거나 그림자 밖으로 나온 조각이 있어요.', 'bad');
    else ctx.msg('');
  }

  function resetPieces() {
    pcs = TY.map(function (t, i) {
      var s = sol.filter(function (q) { return q.k === i })[0], r = 0, f = 0;
      if (P.pre) { r = s.r; f = s.f } else if (ctx.level.id === 'hard') r = (i * 5 + ctx.no * 3) % 8;
      var xy = slotXY(i); return { t: t, x: xy[0], y: xy[1], r: r, f: f, tray: true };
    });
  }
  function onResize() {
    if (!svg || !document.body.contains(svg)) return; var w = host.clientWidth >= 640; if (w === L.wide) return;
    var old = L; L = layout();
    pcs.forEach(function (o, i) { if (o.tray) { var xy = slotXY(i); o.x = xy[0]; o.y = xy[1] } else { o.x = clamp(o.x - old.ox + L.ox, 0, L.W); o.y = clamp(o.y - old.oy + L.oy, 0, L.H) } });
    draw();
  }
  window.addEventListener('resize', onResize);
  document.addEventListener('keydown', function (e) {
    if (!svg || !document.body.contains(svg) || sel < 0 || solved || /INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    var o = pcs[sel], m = { ArrowLeft: [-.5, 0], ArrowRight: [.5, 0], ArrowUp: [0, -.5], ArrowDown: [0, .5] }[e.key];
    if (m) { e.preventDefault(); o.x = clamp(o.x + m[0], 0, L.W); o.y = clamp(o.y + m[1], 0, L.H); o.tray = false; snap(o); after() }
    else if (e.key === 'r' || e.key === 'R') turn(1); else if (e.key === 'e' || e.key === 'E') turn(-1); else if (e.key === 'f' || e.key === 'F') flip();
  });

  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; solved = false; sel = -1; drag = null; sol = solution(p);
      host.classList.remove('tg-win');
      host.innerHTML = '<p class="tg-goal">' + (ctx.level.id === 'hard' ? '칠교 조각 7개를 모두 써서 이 <b>' + p.nm + '</b>을 만들어요' : '칠교 조각 7개로 <b>' + p.nm + '</b> 모양을 만들어요') + '</p>'
        + '<div class="tg-board"></div>'
        + '<div class="tg-tools"><span class="tg-sel">조각을 골라요</span><button type="button" class="tg-btn tg-tool" data-a="l" disabled><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v4h4"/></svg> 왼쪽으로 돌리기</button><button type="button" class="tg-btn tg-tool" data-a="r" disabled><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v4h-4"/></svg> 오른쪽으로 돌리기</button><button type="button" class="tg-btn tg-tool" data-a="f" disabled><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M9 7 4 17h5zM15 7l5 10h-5z"/></svg> 뒤집기</button></div>'
        + '<p class="tg-tip">조각을 <b>끌어서</b> 옮기고, <b>살짝 누르면</b> 오른쪽으로 45° 돌아가요. 키보드: 방향키로 옮기기 · R/E 돌리기 · F 뒤집기</p>';
      host.querySelector('.tg-tools').onclick = function (e) { var b = e.target.closest('[data-a]'); if (!b) return; ({ l: function () { turn(-1) }, r: function () { turn(1) }, f: flip })[b.dataset.a]() };
      L = layout(); resetPieces(); draw();
    },
    hint: function () {   // 아직 제자리에 없는 풀이 칸 하나에 같은 종류 조각을 놓아 줌
      var slotKey = sol.map(function (q) { return key(q.v.map(function (z) { return [z[0] + L.ox, z[1] + L.oy] })) });
      var now = pcs.map(function (o) { return o.tray ? '' : key(polyOf(o)) });
      function good(j) { var o = pcs[j]; return sol.some(function (q, i) { return q.t === o.t && slotKey[i] === now[j] }) }
      for (var i = 0; i < sol.length; i++) {
        var s = sol[i], done = false, k = -1;
        pcs.forEach(function (o, j) { if (o.t === s.t && now[j] === slotKey[i]) done = true });
        if (done) continue;
        pcs.forEach(function (o, j) { if (k < 0 && o.t === s.t && !good(j)) k = j });
        if (k < 0) continue;
        var o = pcs[k]; o.x = s.x + L.ox; o.y = s.y + L.oy; o.r = s.r; o.f = s.f; o.tray = false; place(o); select(k);
        o.el.classList.add('tg-hint'); setTimeout(function () { o.el.classList.remove('tg-hint') }, 900);
        after(); if (!solved) ctx.msg('💡 ' + NM[k] + '을(를) 제자리에 놓았어요.'); return true;
      }
      return false;
    },
    reveal: function () {
      var used = {};
      sol.forEach(function (s) {
        var j = -1; pcs.forEach(function (q, k) { if (j < 0 && q.t === s.t && !used[k]) j = k }); used[j] = 1;
        var o = pcs[j]; o.x = s.x + L.ox; o.y = s.y + L.oy; o.r = s.r; o.f = s.f; o.tray = false; place(o);
      });
      after();
    }
  };
})();
