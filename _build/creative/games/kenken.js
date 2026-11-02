/* 창의수학게임 › 계산 스도쿠(켄켄): 줄마다 1~N이 한 번씩, 굵은 선 묶음은 적힌 셈의 결과가 되게 */
(function () {
  'use strict';
  var P, ctx, host, n, vals, sel = 0, cageOf, solved, SYM = { '+': '+', '-': '−', 'x': '×', '/': '÷', '=': '' };
  function label(cg) { return cg.t + SYM[cg.op] }
  function calc(op, v) {
    if (op === '+' || op === '=') return v.reduce(function (a, b) { return a + b }, 0);
    if (op === 'x') return v.reduce(function (a, b) { return a * b }, 1);
    var a = Math.max(v[0], v[1]), b = Math.min(v[0], v[1]);
    return op === '-' ? a - b : (a % b ? -1 : a / b);
  }
  function draw() {
    var h = '<p class="kk-goal">가로줄·세로줄마다 <b>1~' + n + '</b>이 한 번씩! 굵은 선으로 묶인 칸은 적힌 셈을 하면 적힌 수가 돼요</p><div class="kk-grid n' + n + '" style="--n:' + n + '">';
    for (var i = 0; i < n * n; i++) {
      var r = Math.floor(i / n), c = i % n, k = cageOf[i], cg = P.cages[k], b = '';
      if (r === 0 || cageOf[i - n] !== k) b += ' bt'; if (r === n - 1 || cageOf[i + n] !== k) b += ' bb';
      if (c === 0 || cageOf[i - 1] !== k) b += ' bl'; if (c === n - 1 || cageOf[i + 1] !== k) b += ' br';
      h += '<button type="button" class="kk-cell' + b + '" data-i="' + i + '" aria-label="' + (r + 1) + '째 줄 ' + (c + 1) + '째 칸">' + (cg.c[0] === i ? '<span class="kk-lab" data-k="' + k + '">' + label(cg) + '</span>' : '') + '<b class="kk-v"></b></button>';
    }
    h += '</div><div class="kk-pad">';
    for (var v = 1; v <= n; v++) h += '<button type="button" class="kk-num" data-v="' + v + '">' + v + '</button>';
    h += '<button type="button" class="kk-num kk-del" data-v="0">지우기</button></div><p class="kk-tip">칸을 누르고 아래 수를 눌러요. 키보드: 숫자 · 방향키 · 지우기(Backspace)</p>';
    host.innerHTML = h; paint();
  }
  function paint() {
    var cells = host.querySelectorAll('.kk-cell');
    cells.forEach(function (el, i) {
      el.querySelector('.kk-v').textContent = vals[i] || '';
      var r = Math.floor(i / n), c = i % n, bad = false;
      if (vals[i]) for (var j = 0; j < n; j++) { if ((j !== c && vals[r * n + j] === vals[i]) || (j !== r && vals[j * n + c] === vals[i])) bad = true }
      el.classList.toggle('bad', bad); el.classList.toggle('sel', i === sel && !solved);
      el.classList.toggle('same', !!vals[i] && vals[i] === vals[sel] && i !== sel && !solved);
    });
    P.cages.forEach(function (cg, k) {
      var v = cg.c.map(function (i) { return vals[i] }), full = v.every(Boolean), lab = host.querySelector('.kk-lab[data-k="' + k + '"]');
      lab.classList.toggle('ok', full && calc(cg.op, v) === cg.t); lab.classList.toggle('no', full && calc(cg.op, v) !== cg.t);
    });
    if (!solved && vals.every(Boolean)) {
      if (vals.every(function (v, i) { return v === P.s[i] })) { solved = true; paint(); ctx.done('계산 스도쿠 완성! 모든 줄과 묶음이 딱 맞아요.'); }
      else ctx.msg('칸을 다 채웠지만 맞지 않는 곳이 있어요. 빨간 칸(같은 줄에 같은 수)이나 빨간 묶음을 살펴보세요.', 'bad');
    } else if (!solved) ctx.msg('');
  }
  function put(v) { if (solved) return; vals[sel] = v; paint() }
  function onKey(e) {
    if (!host || !document.body.contains(host) || !host.querySelector('.kk-grid') || solved) return;
    if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    var k = e.key, m = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -n, ArrowDown: n }[k];
    if (m) { e.preventDefault(); var s = sel + m; if (s >= 0 && s < n * n && !(Math.abs(m) === 1 && Math.floor(s / n) !== Math.floor(sel / n))) { sel = s; paint() } }
    else if (/^[1-9]$/.test(k) && +k <= n) put(+k);
    else if (k === 'Backspace' || k === 'Delete' || k === '0') put(0);
  }
  document.addEventListener('keydown', onKey);
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; n = p.n; solved = false; sel = 0; vals = new Array(n * n).fill(0); cageOf = [];
      p.cages.forEach(function (cg, k) { cg.c.forEach(function (i) { cageOf[i] = k }) });
      draw();
      host.onclick = function (e) {
        var ce = e.target.closest('.kk-cell'), nu = e.target.closest('.kk-num');
        if (ce && !solved) { sel = +ce.dataset.i; paint() } else if (nu) put(+nu.dataset.v);
      };
    },
    hint: function () {   // 고른 칸(비었거나 틀리면) 아니면 비었거나 틀린 첫 칸에 맞는 수
      var i = (vals[sel] !== P.s[sel]) ? sel : vals.findIndex(function (v, j) { return v !== P.s[j] });
      if (i < 0) return false;
      sel = i; vals[i] = P.s[i]; paint();
      var el = host.querySelector('.kk-cell[data-i="' + i + '"]'); if (el) el.classList.add('hint');
      return true;
    },
    reveal: function () { vals = P.s.slice(); paint() }
  };
})();
