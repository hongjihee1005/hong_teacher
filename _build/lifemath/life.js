/* 생활 속 수학 공통: 10문제 진행(점수), 돈 그림, 숫자 입력 */
var LF = (function () {
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)) }
  function pick(a) { return a[rnd(0, a.length - 1)] }
  function won(n) { return n.toLocaleString('ko-KR') + '원' }
  function money(v) { var coin = v < 1000; return '<span class="lf-m ' + (coin ? 'lf-coin lf-c' + v : 'lf-bill lf-b' + v) + '">' + (v >= 10000 ? '1만' : v >= 1000 ? v / 1000 + '천' : v) + '<small>원</small></span>' }
  /* run(host, api, name, make): make()는 {html, ok(값들)→[맞음, 설명], inputs:[{label, unit}] } */
  function run(host, api, name, make, N) {
    N = N || 10; var k = 0, score = 0;
    host.innerHTML = '<div class="lf-head"><span class="lf-k"></span><span class="lf-s"></span></div><div class="lf-card"></div>';
    var card = host.querySelector('.lf-card');
    function next() {
      if (k >= N) { card.innerHTML = '<div class="lf-end"><p class="lf-title">' + (score >= N * .9 ? '🏆 생활 수학 달인!' : score >= N * .6 ? '👍 잘했어요!' : '🌱 다시 도전해요!') + '</p><p>' + N + '문제 중 <b>' + score + '</b>개 맞혔어요.</p><button type="button" class="tl-btn tl-go lf-again">다시 하기</button></div>'; card.querySelector('.lf-again').onclick = function () { k = 0; score = 0; next() }; api.bar(name + ' · 끝'); return }
      var P = make(), tries = 0; host.querySelector('.lf-k').textContent = (k + 1) + ' / ' + N; host.querySelector('.lf-s').textContent = '맞힌 문제 ' + score; api.bar(name + ' · ' + (k + 1) + '번');
      card.innerHTML = P.html + (P.inputs ? '<div class="tl-row lf-ins">' + P.inputs.map(function (x, i) { return '<label>' + x.label + ' <input class="lf-in" data-i="' + i + '" inputmode="numeric" maxlength="7"> ' + (x.unit || '') + '</label>' }).join('') + '<button type="button" class="tl-btn tl-go lf-chk">확인</button></div>' : '') + '<p class="lf-msg" aria-live="polite"></p>';
      if (P.mount) P.mount(card, check);
      function check(vals) {
        if (!vals) vals = [].map.call(card.querySelectorAll('.lf-in'), function (x) { return x.value.replace(/[^0-9.]/g, '') });
        if (vals.some(function (v) { return v === '' })) return;
        var r = P.ok(vals.map(Number)), m = card.querySelector('.lf-msg'); tries++;
        if (r[0] || tries >= 2) {
          if (r[0] && tries === 1) score++;
          m.innerHTML = (r[0] ? '⭕ 맞아요! ' : '❌ 정답을 볼까요? ') + r[1] + ' <button type="button" class="tl-btn tl-go lf-next">' + (k < N - 1 ? '이어서 ▶' : '결과 보기') + '</button>'; m.className = 'lf-msg ' + (r[0] ? 'lf-ok' : 'lf-bad');
          card.querySelectorAll('.lf-in,.lf-chk').forEach(function (x) { x.disabled = true }); if (P.lock) P.lock(card);
          var nb = m.querySelector('.lf-next'); nb.onclick = function () { k++; next() }; setTimeout(function () { nb.focus() }, 400);
        } else { m.innerHTML = '❌ 다시 한 번 생각해 보세요. ' + (r[2] || ''); m.className = 'lf-msg lf-bad' }
      }
      var cb = card.querySelector('.lf-chk'); if (cb) cb.onclick = function () { check() };
      card.querySelectorAll('.lf-in').forEach(function (x) { x.addEventListener('keydown', function (e) { if (e.key === 'Enter') check() }) });
      var f = card.querySelector('.lf-in'); if (f) setTimeout(function () { f.focus() }, 60);
    }
    next();
  }
  return { rnd: rnd, pick: pick, won: won, money: money, run: run };
})();
