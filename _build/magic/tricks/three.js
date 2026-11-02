/* 언제나 3이 되는 마술 */
window.TRICK = function (host, api) {
  var S = [['좋아하는 수를 하나 생각해요(1~100).', null], ['그 수에 2를 곱해요.', function (x, o) { return x * 2 }], ['6을 더해요.', function (x) { return x + 6 }], ['2로 나눠요.', function (x) { return x / 2 }], ['처음 생각한 수를 빼요.', function (x, o) { return x - o }]];
  host.innerHTML = '<div class="mj-env"><span>✉️ 예언 봉투</span><b class="mj-pred">?</b></div><p class="mj-say">마술사는 여러분의 수를 몰라요. 그래도 마지막 답을 맞혀요!</p><label class="tl-row">처음 수 <input class="mj-in" inputmode="numeric" maxlength="3" aria-label="처음 수"></label><ol class="mj-steps"></ol><div class="tl-row"><button type="button" class="tl-btn tl-go mj-next" disabled>다음 단계 ▶</button></div><p class="mj-big tl-big" aria-live="polite"></p><div class="mj-box"></div>';
  var inp = host.querySelector('input'), ol = host.querySelector('.mj-steps'), nb = host.querySelector('.mj-next'), k = 0, x = 0, o = 0;
  function reset() { k = 0; ol.innerHTML = '<li>' + S[0][0] + '</li>'; host.querySelector('.mj-big').textContent = ''; host.querySelector('.mj-pred').textContent = '?'; host.querySelector('.mj-box').innerHTML = ''; nb.disabled = !(+inp.value >= 1); x = o = +inp.value }
  inp.addEventListener('input', function () { this.value = this.value.replace(/\D/g, ''); reset() });
  nb.onclick = function () {
    k++; x = S[k][1](x, o); var li = document.createElement('li'); li.innerHTML = S[k][0] + ' → <b>' + x + '</b>'; ol.appendChild(li);
    if (k === S.length - 1) { nb.disabled = true; host.querySelector('.mj-pred').textContent = '3'; host.querySelector('.mj-big').innerHTML = '🎩 봉투를 열어 보니 <b>3</b>! 다른 수로 해도 언제나 3이에요.'; api.done() }
  };
  reset();
};
