/* 창의수학게임 › 목표 수 만들기: 카드 두 장과 셈을 골라 한 장으로 합치기를 되풀이해 마지막 한 장을 목표 수로
   뺄셈은 큰 수에서 작은 수를(0은 됨), 나눗셈은 나누어떨어질 때만. 완성하면 괄호가 든 식으로 보여 줌 */
(function () {
  'use strict';
  var SYM = { '+': '+', '-': '−', 'x': '×', '/': '÷' }, PR = { '+': 1, '-': 1, 'x': 2, '/': 2 };
  var P, ctx, host, cards, hist, selA, selOp, solved, timer = null, seq = 0;
  function calc(a, op, b) { if (op === '+') return a + b; if (op === '-') return a >= b ? a - b : null; if (op === 'x') return a * b; return b && a % b === 0 ? a / b : null }
  function wrap(c, need) { return c.p && c.p < need ? '(' + c.e + ')' : c.e }
  function joinExpr(A, op, B) {   // 괄호가 꼭 필요한 곳에만
    var p = PR[op], l = wrap(A, p), r = (op === '-' || op === '/') ? (B.p && B.p <= p ? '(' + B.e + ')' : B.e) : wrap(B, p);
    return { e: l + ' ' + SYM[op] + ' ' + r, p: p };
  }
  function start() { seq = 0; cards = P.c.map(function (v) { return { v: v, e: String(v), p: 0, id: ++seq } }); hist = []; selA = null; selOp = null }
  function solve(vs) {   // 지금 카드들로 목표 수를 만드는 첫 계산(없으면 null)
    if (vs.length === 1) return vs[0] === P.t ? [] : null;
    for (var i = 0; i < vs.length; i++) for (var j = 0; j < vs.length; j++) {
      if (i === j) continue;
      for (var k = 0; k < P.ops.length; k++) {
        var op = P.ops[k], r = calc(vs[i], op, vs[j]); if (r === null) continue;
        var rest = vs.filter(function (_, x) { return x !== i && x !== j }).concat([r]), s = solve(rest);
        if (s) return [[i, op, j]].concat(s);
      }
    }
    return null;
  }
  function draw() {
    var h = '<p class="mk-goal">카드를 <b>모두 한 번씩</b> 써서 <span class="mk-t">' + P.t + '</span> 만들기</p>'
      + '<div class="mk-cards" id="mkCards"></div>'
      + '<div class="mk-ops">' + P.ops.split('').map(function (o) { return '<button type="button" class="mk-op" data-o="' + o + '">' + SYM[o] + '</button>' }).join('') + '</div>'
      + '<div class="mk-bar"><button type="button" class="mk-btn" id="mkUndo">한 단계 되돌리기</button></div>'
      + '<ol class="mk-hist" id="mkHist"></ol>'
      + '<p class="mk-tip">① 카드 하나 → ② 셈 → ③ 다른 카드를 누르면 두 카드가 계산 결과 한 장이 돼요.</p>';
    host.innerHTML = h; paint();
  }
  function paint(newId) {
    host.querySelector('#mkCards').innerHTML = cards.map(function (c) {
      return '<button type="button" class="mk-card' + (selA === c.id ? ' sel' : '') + (c.id === newId ? ' new' : '') + (c.p ? ' made' : '') + '" data-id="' + c.id + '"><b>' + c.v + '</b>' + (c.p ? '<small>' + c.e + '</small>' : '') + '</button>';
    }).join('');
    host.querySelectorAll('.mk-op').forEach(function (b) { b.classList.toggle('sel', b.dataset.o === selOp) });
    host.querySelector('#mkHist').innerHTML = hist.map(function (s) { return '<li>' + s.txt + '</li>' }).join('');
    host.querySelector('#mkUndo').disabled = !hist.length || solved || !!timer;
  }
  function pick(id) {
    if (solved || timer) return;
    if (selA === null || selOp === null) { selA = selA === id ? null : id; selOp = null; ctx.msg(''); paint(); return }
    if (id === selA) { selA = null; selOp = null; paint(); return }
    combine(selA, selOp, id);
  }
  function combine(aId, op, bId) {
    var A = cards.filter(function (c) { return c.id === aId })[0], B = cards.filter(function (c) { return c.id === bId })[0], r = calc(A.v, op, B.v);
    if (r === null) {
      ctx.msg(op === '-' ? '뺄셈은 큰 수에서 작은 수를 빼요. 카드 차례를 바꿔 보세요.' : '나누어떨어지지 않아요. 다른 카드를 골라 보세요.', 'bad');
      selOp = null; paint(); return false;
    }
    var ex = joinExpr(A, op, B), C = { v: r, e: ex.e, p: ex.p, id: ++seq };
    hist.push({ before: cards.slice(), txt: A.v + ' ' + SYM[op] + ' ' + B.v + ' = ' + r });
    var at = cards.indexOf(A); cards = cards.filter(function (c) { return c !== A && c !== B }); cards.splice(Math.min(at, cards.length), 0, C);
    selA = null; selOp = null; ctx.msg(''); paint(C.id);
    if (cards.length === 1) {
      if (r === P.t) { solved = true; paint(C.id); ctx.done('<b>' + C.e + ' = ' + P.t + '</b> — 목표 수를 만들었어요!') }
      else ctx.msg(r + '이(가) 되었어요. 목표는 ' + P.t + '! ‘한 단계 되돌리기’로 다른 방법을 찾아보세요.', 'bad');
    }
    return true;
  }
  window.CRG = {
    render: function (h, p, c) {
      if (timer) { clearInterval(timer); timer = null }
      host = h; P = p; ctx = c; solved = false; start(); draw();
      host.onclick = function (e) {
        var cd = e.target.closest('.mk-card'), o = e.target.closest('.mk-op');
        if (cd) return pick(+cd.dataset.id);
        if (o && !solved && !timer) { if (selA === null) { ctx.msg('먼저 카드를 하나 골라요.', 'bad'); return } selOp = o.dataset.o; paint(); return }
        if (e.target.closest('#mkUndo') && hist.length && !solved && !timer) { cards = hist.pop().before; selA = null; selOp = null; ctx.msg(''); paint() }
      };
    },
    hint: function () {   // 지금 카드로 만들 수 있으면 다음 계산을, 아니면 처음부터 첫 계산을 알려 줌
      if (solved || timer) return false;
      var s = solve(cards.map(function (c) { return c.v })), note = '';
      if (!s) { start(); s = solve(cards.map(function (c) { return c.v })); note = '지금 카드로는 만들 수 없어서 처음으로 돌렸어요. ' }
      if (!s || !s.length) return false;
      var a = cards[s[0][0]], b = cards[s[0][2]];
      selA = a.id; selOp = null; paint();
      ctx.msg('💡 ' + note + a.v + ' ' + SYM[s[0][1]] + ' ' + b.v + ' 부터 계산해 보세요.');
      return true;
    },
    reveal: function () {   // 처음부터 저장한 방법대로 한 단계씩 보여 줌
      if (solved || timer) return;
      start(); paint(); var i = 0;
      timer = setInterval(function () {
        if (!document.body.contains(host)) { clearInterval(timer); timer = null; return }
        var st = P.s[i++]; if (!st) { clearInterval(timer); timer = null; return }
        var A = cards.filter(function (c) { return c.v === st[0] })[0], B = cards.filter(function (c) { return c !== A && c.v === st[2] })[0];
        var last = i === P.s.length; if (last) { clearInterval(timer); timer = null }
        combine(A.id, st[1], B.id);
      }, 700);
    }
  };
})();
