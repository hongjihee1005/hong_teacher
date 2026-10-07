/* 주사위 탑 마술: 쌓은 주사위 3개의 보이지 않는 면 5개의 합 = 21 − 맨 위 숫자 */
window.TRICK = function (host, api) {
  var T = [];
  host.innerHTML = '<p class="mj-say">주사위 3개를 쌓았어요. 서로 맞닿은 면과 맨 아래 바닥 면, 모두 <b>5개 면</b>은 보이지 않아요. 마술사는 그 합을 맨 위만 보고 맞혀요!</p><div class="mj-tower"></div><div class="mj-env"><span>🎩 보이지 않는 면의 합</span><b class="mj-pred">?</b></div><div class="tl-row"><button type="button" class="tl-btn tl-go mj-roll">🎲 다시 쌓기</button><button type="button" class="tl-btn mj-look">맞닿은 면 들여다보기</button></div><p class="tl-msg" aria-live="polite"></p>';
  var tw = host.querySelector('.mj-tower'), msg = host.querySelector('.tl-msg');
  function pips(v) { var P = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] }[v]; return P.map(function (p) { return '<circle cx="' + p[0] * 15 + '" cy="' + p[1] * 15 + '" r="5"/>' }).join('') }
  function draw(open) {
    tw.innerHTML = T.map(function (t, i) {
      return '<div class="mj-die"><svg viewBox="0 0 60 60" aria-label="' + (i === 0 ? '맨 위 주사위 윗면 ' + t : '') + '"><rect x="2" y="2" width="56" height="56" rx="10" class="' + (i === 0 ? 'mj-top' : 'mj-side') + '"/>' + (i === 0 ? pips(t) : '') + '</svg>' + (open ? '<small>위 ' + t + ' · 아래 ' + (7 - t) + '</small>' : '') + '</div>';
    }).join('');
  }
  function roll() { T = [0, 0, 0].map(function () { return 1 + Math.floor(Math.random() * 6) }); draw(false); host.querySelector('.mj-pred').textContent = 21 - T[0]; msg.textContent = '맨 위 숫자는 ' + T[0] + '. 마술사의 답이 맞는지 들여다볼까요?'; msg.style.color = '' }
  host.querySelector('.mj-roll').onclick = roll;
  host.querySelector('.mj-look').onclick = function () { draw(true); var hid = [7 - T[0], T[1], 7 - T[1], T[2], 7 - T[2]]; msg.innerHTML = '보이지 않는 면: ' + hid.join(' + ') + ' = <b>' + hid.reduce(function (a, b) { return a + b }, 0) + '</b> ✔'; msg.style.color = 'var(--ok)'; api.done() };
  roll();
};
