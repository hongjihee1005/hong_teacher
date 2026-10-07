/* 창의수학게임 › 성냥개비 식 고치기: 성냥개비를 정해진 개수만큼 옮겨 맞는 식 만들기
   성냥개비를 누르면 들리고, 빈 자리(점선)를 누르면 그리로 옮겨짐. = 는 움직이지 않음 */
(function () {
  'use strict';
  var SEG = { '0': 'abcdef', '1': 'bc', '2': 'abdeg', '3': 'abcdg', '4': 'bcfg', '5': 'acdfg', '6': 'acdefg', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg' }, OPS = { '+': 'hv', '-': 'h' };
  var X0 = 8, X1 = 52, Y0 = 10, YM = 58, Y1 = 106, DW = 60, OW = 50, GAP = 8;
  var DC = { a: [X0, Y0, X1, Y0], b: [X1, Y0, X1, YM], c: [X1, YM, X1, Y1], d: [X0, Y1, X1, Y1], e: [X0, YM, X0, Y1], f: [X0, Y0, X0, YM], g: [X0, YM, X1, YM] };
  var OC = { h: [7, 58, 43, 58], v: [25, 40, 25, 76] };
  var P, ctx, host, sl, start, sol, on, held, solved, hintPair = null;
  function parse(eq) { return eq.split('').map(function (ch) { return { t: /\d/.test(ch) ? 'd' : ch === '=' ? 'e' : 'o', ch: ch } }) }
  function setOf(eq) { var s = {}; parse(eq).forEach(function (x, i) { if (x.t === 'e') return; (x.t === 'd' ? SEG[x.ch] : OPS[x.ch]).split('').forEach(function (c) { s[i + ':' + c] = 1 }) }); return s }
  function read() {
    var out = '';
    for (var i = 0; i < sl.length; i++) {
      if (sl[i].t === 'e') { out += '='; continue }
      var cs = (sl[i].t === 'd' ? 'abcdefg' : 'hv').split('').filter(function (c) { return on[i + ':' + c] }).join(''), hit = null, tb = sl[i].t === 'd' ? SEG : OPS;
      Object.keys(tb).forEach(function (k) { if (tb[k] === cs) hit = k }); if (hit === null) return null; out += hit;
    }
    return out;
  }
  function isTrue(s) {
    if (!s) return false; var lr = s.split('='), l = lr[0], r = lr[1], parts = l.split(/[+-]/).concat([r]);
    if (parts.some(function (x) { return x.length > 1 && x[0] === '0' })) return false;
    var a = parseInt(parts[0], 10), b = parseInt(parts[1], 10), c = parseInt(r, 10);
    return l.indexOf('+') >= 0 ? a + b === c : a - b === c;
  }
  function moved() { var n = 0; Object.keys(start).forEach(function (k) { if (!on[k]) n++ }); return n }
  function layout() { var x = 0; sl.forEach(function (s) { s.x = x; x += (s.t === 'd' ? DW : OW) + GAP }); return x - GAP }
  function stick(k, x1, y1, x2, y2, cls) {
    var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, a = [x1 + ux * 4, y1 + uy * 4], b = [x2 - ux * 4, y2 - uy * 4];
    var line = 'x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '"';
    if (cls === 'off') return '<g class="mt-off" data-k="' + k + '"><line ' + line + ' class="mt-slot"/><line ' + line + ' class="mt-hit"/></g>';
    return '<g class="mt-on' + (cls ? ' ' + cls : '') + '" data-k="' + k + '"><line ' + line + ' class="mt-wood"/><circle cx="' + a[0] + '" cy="' + a[1] + '" r="5.2" class="mt-head"/><line ' + line + ' class="mt-hit"/></g>';
  }
  function draw() {
    var W = layout(), h = '<svg class="mt-svg" viewBox="-6 0 ' + (W + 12) + ' 116" role="application" aria-label="성냥개비 식">';
    sl.forEach(function (s, i) {
      if (s.t === 'e') { h += stick('', s.x + 7, 48, s.x + 43, 48, 'fixed') + stick('', s.x + 7, 68, s.x + 43, 68, 'fixed'); return }
      var C = s.t === 'd' ? DC : OC;
      Object.keys(C).forEach(function (c) {
        var k = i + ':' + c, q = C[c], cls = on[k] ? (held === k ? 'held' : '') + (hintPair && hintPair[0] === k ? ' hfrom' : '') : 'off';
        if (cls === 'off' && hintPair && hintPair[1] === k) cls = 'off';
        h += stick(k, s.x + q[0], q[1], s.x + q[2], q[3], cls);
      });
    });
    host.querySelector('.mt-board').innerHTML = h + '</svg>';
    if (hintPair) { var t = host.querySelector('.mt-off[data-k="' + hintPair[1] + '"]'); if (t) t.classList.add('hto') }
    var r = read(), m = moved();
    host.querySelector('#mtCnt').innerHTML = '옮긴 성냥개비 <b>' + m + '</b> / ' + P.k + '개';
    host.querySelector('#mtNow').innerHTML = '지금 식: <b>' + (r ? r.replace(/-/g, '−') : '?') + '</b>' + (r ? (isTrue(r) ? ' <span class="ok">맞음</span>' : ' <span class="no">틀림</span>') : ' <span class="no">숫자가 아닌 모양이 있어요</span>');
  }
  function after() {
    var r = read(), m = moved();
    if (m === P.k && isTrue(r)) { solved = true; held = null; draw(); host.querySelector('.mt-board').classList.add('win'); ctx.done('성냥개비 ' + P.k + '개를 옮겨 <b>' + r.replace(/-/g, '−') + '</b>를 만들었어요!'); return }
    if (m > P.k) ctx.msg('성냥개비는 ' + P.k + '개만 옮길 수 있어요. 옮긴 성냥개비를 제자리로 돌려 보세요.', 'bad');
    else if (m === P.k) ctx.msg('아직 맞는 식이 아니에요. 다른 성냥개비를 옮겨 보세요.', 'bad');
    else ctx.msg('');
  }
  function tap(k, isOn) {
    if (solved) return; hintPair = null;
    if (isOn) { held = held === k ? null : k; draw(); return }
    if (!held) { ctx.msg('먼저 옮길 성냥개비를 눌러요.', 'bad'); return }
    delete on[held]; on[k] = 1; held = null; draw(); after();
  }
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; sl = parse(p.q); start = setOf(p.q); sol = setOf(p.a); on = Object.assign({}, start); held = null; solved = false; hintPair = null;
      host.innerHTML = '<p class="mt-goal">성냥개비를 <b>' + p.k + '개</b> 옮겨서 맞는 식을 만들어요</p><div class="mt-board"></div>'
        + '<div class="mt-bar"><span id="mtCnt"></span><span id="mtNow"></span></div>'
        + '<p class="mt-tip">성냥개비를 누르면 들려요. 점선으로 된 빈 자리를 누르면 그리로 옮겨요. <b>=</b> 는 움직이지 않아요.</p>';
      draw();
      host.querySelector('.mt-board').onclick = function (e) {
        var g = e.target.closest('[data-k]'); if (!g || !g.dataset.k) return;
        tap(g.dataset.k, g.classList.contains('mt-on'));
      };
    },
    hint: function () {   // 옮길 성냥개비 하나와 놓을 자리를 빛냄(엉뚱하게 옮긴 것이 있으면 처음으로)
      if (solved) return false;
      var extra = Object.keys(on).filter(function (k) { return !sol[k] }), need = Object.keys(sol).filter(function (k) { return !on[k] }), note = '';
      if (extra.some(function (k) { return !start[k] }) || moved() > P.k) { on = Object.assign({}, start); note = '처음 모양으로 돌렸어요. '; extra = Object.keys(on).filter(function (k) { return !sol[k] }); need = Object.keys(sol).filter(function (k) { return !on[k] }) }
      if (!extra.length || !need.length) return false;
      held = null; hintPair = [extra[0], need[0]]; draw();
      ctx.msg('💡 ' + note + '반짝이는 성냥개비를 초록 점선 자리로 옮겨 보세요.'); return true;
    },
    reveal: function () { on = Object.assign({}, sol); held = null; hintPair = null; draw(); after() }
  };
})();
