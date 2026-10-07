/* 마법의 수 1089 */
window.TRICK = function (host, api) {
  host.innerHTML = '<div class="mj-env" aria-live="polite"><span>✉️ 예언 봉투</span><b class="mj-pred">?</b></div><ol class="mj-steps"><li>첫째 자리와 셋째 자리의 숫자가 2 넘게 차이 나는 <b>세 자리 수</b>를 생각해요. (예: 742)<br><input class="mj-in" data-k="n" inputmode="numeric" maxlength="3" aria-label="세 자리 수"></li></ol><p class="tl-msg"></p>';
  var ol = host.querySelector('.mj-steps'), msg = host.querySelector('.tl-msg');
  function rev(n) { return +String(n).padStart(3, '0').split('').reverse().join('') }
  host.querySelector('[data-k="n"]').addEventListener('input', function () {
    var v = this.value.replace(/\D/g, ''); this.value = v; while (ol.children.length > 1) ol.lastChild.remove(); host.querySelector('.mj-pred').textContent = '?'; msg.textContent = '';
    if (v.length < 3) return;
    var n = +v, a = Math.floor(n / 100), c = n % 10;
    if (Math.abs(a - c) < 2) { msg.textContent = '첫째 자리와 셋째 자리 숫자가 2 넘게 차이 나야 해요. 다른 수를 써 보세요.'; return }
    var r = rev(n), big = Math.max(n, r), sm = Math.min(n, r), d = big - sm, rd = rev(d);
    var add = function (h) { var li = document.createElement('li'); li.innerHTML = h; ol.appendChild(li); return li };
    var li2 = add('거꾸로 쓴 수와 큰 수에서 작은 수를 빼요: <b>' + big + ' − ' + sm + ' = ' + String(d).padStart(3, '0') + '</b>' + (d < 100 ? ' (두 자리면 앞에 0을 붙여 세 자리로)' : ''));
    var li3 = add('그 답을 또 거꾸로 써서 더해요: <b>' + String(d).padStart(3, '0') + ' + ' + String(rd).padStart(3, '0') + ' = ?</b> <button type="button" class="tl-btn tl-go mj-open">✉️ 봉투 열기</button>');
    li3.querySelector('.mj-open').onclick = function () { host.querySelector('.mj-pred').textContent = '1089'; li3.innerHTML = '그 답을 또 거꾸로 써서 더해요: <b>' + String(d).padStart(3, '0') + ' + ' + String(rd).padStart(3, '0') + ' = ' + (d + rd) + '</b>'; msg.innerHTML = '🎩 봉투 속 예언과 똑같이 <b>1089</b>! 다른 수로도 해 보세요. 언제나 1089가 될까요?'; msg.style.color = 'var(--ok)'; api.done() };
  });
};
