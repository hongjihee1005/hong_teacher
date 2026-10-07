/* 창의수학게임 › 마방진: 빈칸에 수 카드를 넣어 가로·세로·대각선의 합이 모두 같게 */
(function () {
  'use strict';
  var P, ctx, host, cells, pool, sel = -1, selCell = -1;
  function lines(n) {
    var L = [], r, c, i;
    for (r = 0; r < n; r++) { var a = []; for (c = 0; c < n; c++) a.push(r * n + c); L.push({ k: 'r' + r, c: a }) }
    for (c = 0; c < n; c++) { var b = []; for (r = 0; r < n; r++) b.push(r * n + c); L.push({ k: 'c' + c, c: b }) }
    var d1 = [], d2 = []; for (i = 0; i < n; i++) { d1.push(i * n + i); d2.push(i * n + n - 1 - i) }
    L.push({ k: 'd1', c: d1 }, { k: 'd2', c: d2 }); return L;
  }
  function draw() {
    var n = P.n, L = lines(n), h = '<p class="mg3-goal">가로·세로·대각선에 있는 수의 합이 모두 <b>' + P.sum + '</b>이 되게 만들어요</p>';
    h += '<div class="mg3-wrap n' + n + '">';
    for (var r = 0; r < n; r++) {
      h += '<span class="mg3-gap"></span>';
      for (var c = 0; c < n; c++) { var i = r * n + c, g = P.g[i]; h += '<button type="button" class="mg3-cell' + (g ? ' giv' : '') + (selCell === i ? ' sel' : '') + '" data-i="' + i + '"' + (g ? ' disabled' : '') + '>' + (cells[i] || '') + '</button>' }
      h += '<span class="mg3-sum" data-k="r' + r + '" title="가로줄의 합"></span>';
    }
    h += '<span class="mg3-sum d d2" data-k="d2" title="↙ 대각선의 합"></span>'; for (c = 0; c < n; c++) h += '<span class="mg3-sum" data-k="c' + c + '" title="세로줄의 합"></span>'; h += '<span class="mg3-sum d d1" data-k="d1" title="↘ 대각선의 합"></span></div>';
    h += '<p class="mg3-ph">남은 수 카드 — 카드를 고르고 빈칸을 눌러요 (넣은 수를 다시 누르면 빠져요)</p><div class="mg3-pool">' + pool.map(function (v, k) { return '<button type="button" class="mg3-tile' + (sel === k ? ' sel' : '') + '" data-k="' + k + '">' + v + '</button>' }).join('') + '</div>';
    host.innerHTML = h; sums(L);
  }
  function sums(L) {
    var full = cells.every(function (v) { return v }), allOk = true;
    L.forEach(function (l) {
      var s = 0, f = true; l.c.forEach(function (i) { if (cells[i]) s += cells[i]; else f = false });
      var el = host.querySelector('[data-k="' + l.k + '"]'); el.textContent = s || '';
      el.className = el.className.replace(/ (ok|no)/g, '') + (f ? (s === P.sum ? ' ok' : ' no') : '');
      if (!f || s !== P.sum) allOk = false;
    });
    if (full) { if (allOk) ctx.done('마방진 완성! 모든 줄의 합이 ' + P.sum + '이에요.'); else ctx.msg('빈칸을 다 채웠지만 합이 ' + P.sum + '이 아닌 줄이 있어요(빨간 수). 바꿔 보세요.', 'bad') }
    else ctx.msg('');
  }
  function put(i, k) { cells[i] = pool[k]; pool.splice(k, 1); sel = -1; selCell = -1; draw() }
  function take(i) { pool.push(cells[i]); pool.sort(function (a, b) { return a - b }); cells[i] = 0; draw() }
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; cells = p.g.slice(); sel = -1; selCell = -1;
      pool = p.s.filter(function (v, i) { return !p.g[i] }).sort(function (a, b) { return a - b });
      draw();
      host.onclick = function (e) {
        var t = e.target.closest('.mg3-tile'), ce = e.target.closest('.mg3-cell');
        if (t) { var k = +t.dataset.k; if (selCell >= 0 && !cells[selCell]) return put(selCell, k); sel = sel === k ? -1 : k; draw() }
        else if (ce && !ce.disabled) { var i = +ce.dataset.i; if (cells[i]) return take(i); if (sel >= 0) return put(i, sel); selCell = selCell === i ? -1 : i; draw() }
      };
    },
    hint: function () {   // 비었거나 틀린 칸 하나에 맞는 수를 넣어 줌
      for (var i = 0; i < cells.length; i++) {
        if (P.g[i] || cells[i] === P.s[i]) continue;
        if (cells[i]) { pool.push(cells[i]); cells[i] = 0 }
        var v = P.s[i], k = pool.indexOf(v);
        if (k < 0) { for (var j = 0; j < cells.length; j++) if (!P.g[j] && cells[j] === v) { cells[j] = 0; k = pool.push(v) - 1; break } }
        pool.sort(function (a, b) { return a - b }); k = pool.indexOf(v); cells[i] = v; pool.splice(k, 1);
        draw(); var el = host.querySelector('[data-i="' + i + '"]'); if (el) el.classList.add('hint'); return true;
      }
      return false;
    },
    reveal: function () { cells = P.s.slice(); pool = []; draw() }
  };
})();
