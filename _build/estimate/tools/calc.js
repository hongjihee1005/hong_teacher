window.TOOL = function (host, api) {
  function mk(lv) {
    var t = lv === 0 ? EST.rnd(0, 1) : EST.rnd(0, 3), a, b, ans, s;
    if (lv === 0) {   // 쉬움: 두 자리 수 덧셈·뺄셈
      if (t === 0) { a = EST.rnd(21, 89); b = EST.rnd(21, 89); ans = a + b; s = a + ' + ' + b }
      else { a = EST.rnd(51, 99); b = EST.rnd(11, a - 20); ans = a - b; s = a + ' − ' + b }
    } else if (lv === 2) {   // 도전: 네 자리 덧셈·뺄셈, 세 자리 × 두 자리, 두 자리로 나누기
      if (t === 0) { a = EST.rnd(1001, 8999); b = EST.rnd(1001, 8999); ans = a + b; s = a + ' + ' + b }
      else if (t === 1) { a = EST.rnd(5001, 9999); b = EST.rnd(1001, a - 500); ans = a - b; s = a + ' − ' + b }
      else if (t === 2) { a = EST.rnd(102, 899); b = EST.rnd(12, 98); ans = a * b; s = a + ' × ' + b }
      else { b = EST.rnd(12, 49); ans = EST.rnd(21, 98); a = ans * b + EST.rnd(0, b - 1); ans = Math.floor(a / b); s = a + ' ÷ ' + b + ' (몫)' }
    } else {
    if (t === 0) { a = EST.rnd(101, 899); b = EST.rnd(101, 899); ans = a + b; s = a + ' + ' + b }
    else if (t === 1) { a = EST.rnd(501, 999); b = EST.rnd(101, a - 50); ans = a - b; s = a + ' − ' + b }
    else if (t === 2) { a = EST.rnd(12, 98); b = EST.rnd(12, 98); ans = a * b; s = a + ' × ' + b }
    else { b = EST.rnd(3, 9); ans = EST.rnd(21, 98); a = ans * b + EST.rnd(0, b - 1); ans = Math.floor(a / b); s = a + ' ÷ ' + b + ' (몫)' }
    }
    var r = Math.round(ans / Math.pow(10, Math.floor(Math.log10(ans)) - 1)) * Math.pow(10, Math.floor(Math.log10(ans)) - 1);
    var opts = [r, Math.round(r * .5), Math.round(r * 2), Math.round(r * (EST.rnd(0, 1) ? 1.4 : .7))].map(function (x) { var p = Math.pow(10, Math.max(0, Math.floor(Math.log10(x)) - 1)); return Math.round(x / p) * p });
    opts = opts.filter(function (x, i) { return opts.indexOf(x) === i }); while (opts.length < 4) opts.push(opts[opts.length - 1] * 3);
    return { s: s, ans: ans, near: r, opts: opts.sort(function () { return Math.random() - .5 }), t: t };
  }
  EST.game(host, api, { name: '어림셈', lv: ['두 자리 수 덧셈·뺄셈, 10초 안에', '세 자리 덧셈·뺄셈, 두 자리 곱셈, 한 자리로 나누기, 8초 안에', '네 자리 덧셈·뺄셈, 세 자리 × 두 자리, 두 자리로 나누기, 6초 안에'], round: function (st, done, lv) {
    var q = mk(lv), t0 = performance.now(), lim = [10, 8, 6][lv];
    st.innerHTML = '<p class="es-q">정확히 계산하지 말고 어림해요! 답에 <b>가장 가까운 수</b>는? <small>(' + lim + '초 안에)</small></p><p class="tl-big es-expr">' + q.s + '</p><div class="es-opts">' + q.opts.map(function (o) { return '<button type="button" class="es-o" data-v="' + o + '">약 ' + o + '</button>' }).join('') + '</div>';
    st.querySelector('.es-opts').onclick = function (e) {
      var b = e.target.closest('.es-o'); if (!b || this.dataset.done) return; this.dataset.done = 1; var v = +b.dataset.v, best = q.opts.reduce(function (x, y) { return Math.abs(y - q.ans) < Math.abs(x - q.ans) ? y : x }), sec = (performance.now() - t0) / 1000;
      st.querySelectorAll('.es-o').forEach(function (x) { x.classList.toggle('es-good', +x.dataset.v === best) });
      var tip = lv === 0 ? '두 수를 몇십으로 어림해 계산해요.' : lv === 2 && q.t < 2 ? '두 수를 몇천(또는 몇천 몇백)으로 어림해 계산해요.' : q.t === 2 ? '두 수를 몇십으로 어림해 곱해요.' : q.t === 3 ? '나누어지는 수를 나누는 수의 몇십 배쯤인지 생각해요.' : '두 수를 몇백으로 어림해 계산해요.';
      done(v, q.ans, '정확한 답은 ' + q.ans + '. 가장 가까운 보기는 ' + best + '. 💡 ' + tip + (sec > lim ? ' (' + lim + '초가 넘었어요)' : ''));
    };
  }, score: function (m, r) { var e = Math.abs(m - r) / r; return e <= .08 ? 3 : e <= .2 ? 2 : e <= .4 ? 1 : 0 } });
};
