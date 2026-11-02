/* 창의수학게임 › 네모 로직: 줄 끝의 수(이어서 칠한 칸 묶음의 길이)를 보고 칸을 칠해 숨은 그림 찾기
   '칠하기'·'X 표시' 모드, 눌러서 끌면 여러 칸을 한 번에. 줄이 수와 맞으면 그 수가 흐려짐 */
(function () {
  'use strict';
  var P, ctx, host, W, H, st, mode = 1, solved, drag = null;   // st: 0 빈칸 · 1 칠함 · 2 X
  function runs(a) { var o = [], r = 0; a.forEach(function (v) { if (v === 1) r++; else if (r) { o.push(r); r = 0 } }); if (r) o.push(r); return o }
  function same(a, b) { return a.length === b.length && a.every(function (v, i) { return v === b[i] }) }
  function draw() {
    var mx = Math.max.apply(null, P.rc.map(function (r) { return r.length })), my = Math.max.apply(null, P.cc.map(function (c) { return c.length }));
    var h = '<p class="ng-goal">줄 끝의 수만큼 이어서 칠해요. 다 칠하면 숨은 그림이 나타나요! <b>무엇이 나올까요?</b></p>'
      + '<div class="ng-modes" role="group" aria-label="칠하는 방법"><button type="button" class="ng-mode" data-m="1">■ 칠하기</button><button type="button" class="ng-mode" data-m="2">✕ X 표시</button></div>'
      + '<div class="ng-wrap"><div class="ng-board w' + W + '" style="--w:' + W + ';--h:' + H + ';--mx:' + mx + ';--my:' + my + '"><div class="ng-corner"></div>';
    for (var c = 0; c < W; c++) h += '<div class="ng-cc' + (c % 5 === 4 && c < W - 1 ? ' b5' : '') + '" data-c="' + c + '">' + (P.cc[c].length ? P.cc[c] : [0]).map(function (v) { return '<span>' + v + '</span>' }).join('') + '</div>';
    for (var r = 0; r < H; r++) {
      h += '<div class="ng-rc' + (r % 5 === 4 && r < H - 1 ? ' b5' : '') + '" data-r="' + r + '">' + (P.rc[r].length ? P.rc[r] : [0]).map(function (v) { return '<span>' + v + '</span>' }).join('') + '</div>';
      for (c = 0; c < W; c++) h += '<div class="ng-cell' + (c % 5 === 4 && c < W - 1 ? ' br5' : '') + (r % 5 === 4 && r < H - 1 ? ' bb5' : '') + '" data-i="' + (r * W + c) + '"></div>';
    }
    h += '</div></div><p class="ng-tip">칸을 누르거나 눌러서 끌면 여러 칸이 한 번에 바뀌어요. 칠하지 않을 칸에는 X를 해 두면 생각하기 쉬워요.</p>';
    host.innerHTML = h; setMode(mode); fit(); paint();
  }
  function fit() {   // 판이 남은 너비·화면 높이에 들어가도록 칸 크기를 맞춤(잘려서 못 누르는 칸이 없게)
    var bd = host.querySelector('.ng-board'), wrap = host.querySelector('.ng-wrap'); if (!bd) return;
    var c = 46, maxH = Math.max(260, window.innerHeight * .68);
    do { bd.style.setProperty('--c', c + 'px'); c-- } while (c >= 14 && (bd.offsetWidth > wrap.clientWidth || bd.offsetHeight > maxH));
  }
  function setMode(m) { mode = m; host.querySelectorAll('.ng-mode').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.m === m)) }) }
  function paint() {
    host.querySelectorAll('.ng-cell').forEach(function (el, i) { el.className = el.className.replace(/ (on|x)\b/g, '') + (st[i] === 1 ? ' on' : st[i] === 2 ? ' x' : '') });
    for (var r = 0; r < H; r++) host.querySelector('.ng-rc[data-r="' + r + '"]').classList.toggle('done', same(runs(st.slice(r * W, r * W + W)), P.rc[r]));
    for (var c = 0; c < W; c++) { var col = []; for (r = 0; r < H; r++) col.push(st[r * W + c]); host.querySelector('.ng-cc[data-c="' + c + '"]').classList.toggle('done', same(runs(col), P.cc[c])) }
    if (!solved && st.every(function (v, i) { return (v === 1) === (P.s[Math.floor(i / W)][i % W] === '1') })) {
      solved = true; host.querySelector('.ng-board').classList.add('win'); ctx.done('그림 완성! 숨은 그림은 ‘' + P.nm + '’이었어요.');
    }
  }
  function cellAt(x, y) { var e = document.elementFromPoint(x, y); return e && e.closest && e.closest('.ng-cell') }
  function apply(el) { var i = +el.dataset.i; if (drag.done[i]) return; drag.done[i] = 1; st[i] = drag.to; paint() }
  window.addEventListener('resize', function () { if (host && document.body.contains(host) && host.querySelector('.ng-board')) fit() });
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; W = p.w; H = p.h; st = new Array(W * H).fill(0); solved = false; drag = null; draw();
      host.onclick = function (e) { var b = e.target.closest('.ng-mode'); if (b) setMode(+b.dataset.m) };
      var bd = host.querySelector('.ng-board');
      bd.addEventListener('pointerdown', function (e) {
        var el = e.target.closest('.ng-cell'); if (!el || solved) return; e.preventDefault();
        var i = +el.dataset.i; drag = { id: e.pointerId, to: st[i] === mode ? 0 : mode, done: {} }; apply(el);
        try { bd.setPointerCapture(e.pointerId) } catch (er) {}
      });
      bd.addEventListener('pointermove', function (e) { if (!drag || e.pointerId !== drag.id) return; var el = cellAt(e.clientX, e.clientY); if (el) apply(el) });
      function end(e) { if (drag && e.pointerId === drag.id) drag = null }
      bd.addEventListener('pointerup', end); bd.addEventListener('pointercancel', end);
    },
    hint: function () {   // 잘못 칠한 칸이 있으면 하나 지우고, 없으면 칠해야 할 칸 하나를 칠함
      if (solved) return false;
      var want = function (i) { return P.s[Math.floor(i / W)][i % W] === '1' }, i = st.findIndex(function (v, j) { return v === 1 && !want(j) }), msg;
      if (i >= 0) { st[i] = 2; msg = '💡 잘못 칠한 칸 하나를 X로 바꿨어요.' }
      else { i = st.findIndex(function (v, j) { return v !== 1 && want(j) }); if (i < 0) return false; st[i] = 1; msg = '💡 칠해야 할 칸 하나를 칠했어요.' }
      paint(); var el = host.querySelector('.ng-cell[data-i="' + i + '"]'); if (el) el.classList.add('hint');
      if (!solved) ctx.msg(msg); return true;
    },
    reveal: function () { st = st.map(function (v, i) { return P.s[Math.floor(i / W)][i % W] === '1' ? 1 : 0 }); paint() }
  };
})();
