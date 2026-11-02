/* 예언의 마방진: 덧셈표로 만든 4×4 판에서 줄마다 하나씩 고르면 합이 언제나 같음 */
window.TRICK = function (host, api) {
  var R, C, sel, out;
  host.innerHTML = '<div class="mj-env"><span>✉️ 예언 봉투</span><b class="mj-pred">?</b></div><p class="mj-say">아무 칸이나 하나 골라 누르면 그 칸의 가로줄과 세로줄이 지워져요. 남은 칸에서 또 고르기를 네 번! 고른 네 수를 더하면…?</p><div class="mj-grid"></div><p class="tl-big mj-sum"></p><div class="tl-row"><button type="button" class="tl-btn tl-go mj-new">새 판</button><button type="button" class="tl-btn mj-rst">이 판 다시</button><button type="button" class="tl-btn mj-sec">판의 비밀 보기</button></div><p class="tl-msg" aria-live="polite"></p>';
  var g = host.querySelector('.mj-grid'), msg = host.querySelector('.tl-msg'), secret = false;
  function sh(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }
  function neu() { R = sh([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4); C = sh([2, 4, 5, 6, 7, 9, 11, 12]).slice(0, 4); secret = false; again() }
  function again() { sel = []; out = {}; host.querySelector('.mj-pred').textContent = R.concat(C).reduce(function (a, b) { return a + b }, 0); host.querySelector('.mj-sum').textContent = ''; msg.textContent = ''; draw() }
  function draw() {
    var h = secret ? '<span class="mj-h"></span>' + C.map(function (c) { return '<span class="mj-h">' + c + '</span>' }).join('') : '';
    for (var r = 0; r < 4; r++) { if (secret) h += '<span class="mj-h">' + R[r] + '</span>'; for (var c = 0; c < 4; c++) { var s = sel.some(function (p) { return p[0] === r && p[1] === c }), x = !s && (out['r' + r] || out['c' + c]); h += '<button type="button" class="mj-gc' + (s ? ' mj-sel' : '') + (x ? ' mj-x' : '') + '" data-r="' + r + '" data-c="' + c + '"' + (x || s ? ' disabled' : '') + '>' + (R[r] + C[c]) + '</button>' } }
    g.innerHTML = h; g.classList.toggle('mj-sec5', secret);
  }
  g.onclick = function (e) {
    var b = e.target.closest('.mj-gc'); if (!b || sel.length >= 4) return; var r = +b.dataset.r, c = +b.dataset.c;
    sel.push([r, c]); out['r' + r] = out['c' + c] = 1; draw();
    if (sel.length === 4) { var v = sel.map(function (p) { return R[p[0]] + C[p[1]] }); host.querySelector('.mj-sum').innerHTML = v.join(' + ') + ' = <b>' + v.reduce(function (a, b) { return a + b }, 0) + '</b>'; msg.innerHTML = '🎩 봉투 속 예언과 같아요! 다른 칸을 골라도 언제나 같을까요?'; msg.style.color = 'var(--ok)'; api.done() }
  };
  host.querySelector('.mj-new').onclick = neu; host.querySelector('.mj-rst').onclick = again;
  host.querySelector('.mj-sec').onclick = function () { secret = !secret; draw() };
  neu();
};
