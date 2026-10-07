/* 11 곱하기 번개 계산: ab × 11 = a (a+b) b, 받아올림 */
window.TRICK = function (host, api) {
  var n, ok = 0;
  host.innerHTML = '<p class="mj-say">마술사는 두 자리 수 × 11을 눈 깜짝할 사이에 계산해요. 비밀을 알면 여러분도 번개처럼!</p><p class="tl-big mj-q"></p><div class="tl-row"><input class="mj-in" inputmode="numeric" maxlength="4" aria-label="답"><button type="button" class="tl-btn tl-go mj-chk">확인</button><button type="button" class="tl-btn mj-new">다음 문제</button></div><div class="mj-how"></div><p class="tl-msg" aria-live="polite"></p>';
  var inp = host.querySelector('input'), msg = host.querySelector('.tl-msg'), how = host.querySelector('.mj-how');
  function nq() { n = 12 + Math.floor(Math.random() * 87); if (n % 10 === 0) n++; host.querySelector('.mj-q').textContent = n + ' × 11 = ?'; inp.value = ''; how.innerHTML = ''; msg.textContent = ''; inp.focus() }
  function show() { var a = Math.floor(n / 10), b = n % 10, m = a + b; how.innerHTML = '<div class="mj-sand"><span>' + a + '</span><span class="mj-mid2">' + a + ' + ' + b + ' = ' + m + '</span><span>' + b + '</span></div><p>' + (m < 10 ? '가운데에 ' + m + '을(를) 넣으면 <b>' + a + m + b + '</b>' : '가운데 합 ' + m + '은 두 자리라 십의 자리 1을 앞자리로 받아올려요: ' + a + '+1 = ' + (a + 1) + ' → <b>' + (a + 1) + (m - 10) + b + '</b>') + '</p>' }
  host.querySelector('.mj-chk').onclick = function () { var v = +inp.value; if (v === n * 11) { ok++; msg.innerHTML = '⭕ 맞아요! (' + ok + '개째)'; msg.style.color = 'var(--ok)'; api.done() } else { msg.textContent = '❌ 아래 비밀 계산을 보세요.'; msg.style.color = 'var(--bad)' } show() };
  inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') host.querySelector('.mj-chk').click() });
  host.querySelector('.mj-new').onclick = nq; nq();
};
