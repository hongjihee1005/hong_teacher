/* 어림 왕 공통: 10판 진행, 오차에 따라 별(★★★/★★/★/☆), 결과 */
var EST = (function () {
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)) }
  function stars(err) { return err <= .05 ? 3 : err <= .15 ? 2 : err <= .3 ? 1 : 0 }   // err: 상대 오차
  function star(n) { return '<span class="es-st">' + '★★★'.slice(0, n) + '<i>' + '★★★'.slice(n) + '</i></span>' }
  /* game(host, api, {name, round(stage, done) }) : round는 한 판을 그리고, 끝나면 done(내 답, 정답, 설명) 호출 */
  function game(host, api, G) {
    var k = 0, total = 0, log = [];
    host.innerHTML = '<div class="es-head"><span class="es-k"></span><span class="es-sum"></span></div><div class="es-stage"></div><div class="es-res" aria-live="polite"></div>';
    var stage = host.querySelector('.es-stage'), res = host.querySelector('.es-res');
    function next() {
      if (k >= 10) { var avg = total / 10, title = avg >= 2.5 ? '👑 어림 왕!' : avg >= 1.8 ? '🥇 어림 박사' : avg >= 1 ? '🥈 어림 탐험가' : '🌱 어림 새싹'; stage.innerHTML = '<div class="es-end"><p class="es-title">' + title + '</p><p>10판 별 <b>' + total + '</b>개 (평균 ' + avg.toFixed(1) + '개)</p><table class="es-log"><tr><th>판</th><th>내 어림</th><th>실제</th><th>별</th></tr>' + log.map(function (l, i) { return '<tr><td>' + (i + 1) + '</td><td>' + l[0] + '</td><td>' + l[1] + '</td><td>' + star(l[2]) + '</td></tr>' }).join('') + '</table><button type="button" class="tl-btn tl-go es-again">다시 하기</button></div>'; res.innerHTML = ''; stage.querySelector('.es-again').onclick = function () { k = 0; total = 0; log = []; next() }; api.bar(G.name + ' · 끝'); return }
      host.querySelector('.es-k').textContent = (k + 1) + ' / 10판'; host.querySelector('.es-sum').innerHTML = '별 ' + total + '개'; res.innerHTML = ''; api.bar(G.name + ' · ' + (k + 1) + '판');
      G.round(stage, function (mine, real, why, unit) {
        var err = Math.abs(mine - real) / Math.max(1, Math.abs(real)), s = G.score ? G.score(mine, real) : stars(err); total += s; log.push([mine + (unit || ''), real + (unit || ''), s]);
        host.querySelector('.es-sum').innerHTML = '별 ' + total + '개';
        res.innerHTML = '<p class="es-rp">' + star(s) + ' 내 어림 <b>' + mine + (unit || '') + '</b> · 실제 <b>' + real + (unit || '') + '</b> (차이 ' + Math.abs(Math.round((mine - real) * 10) / 10) + (unit || '') + ')</p>' + (why ? '<p class="es-why">' + why + '</p>' : '') + '<button type="button" class="tl-btn tl-go es-next">' + (k < 9 ? '이어서 ▶' : '결과 보기') + '</button>';
        var nb = res.querySelector('.es-next'); nb.onclick = function () { k++; next() }; setTimeout(function () { nb.focus() }, 400);
      });
    }
    next();
  }
  /* 숫자 입력 + 확인 */
  function ask(el, label, cb) { el.insertAdjacentHTML('beforeend', '<div class="tl-row es-ask"><label>' + label + ' <input class="es-in" inputmode="numeric" maxlength="5"></label><button type="button" class="tl-btn tl-go">확인</button></div>'); var inp = el.querySelector('.es-in'), b = el.querySelector('.es-ask button'), go = function () { var v = parseFloat(inp.value); if (isNaN(v)) return; b.disabled = inp.disabled = true; cb(v) }; b.onclick = go; inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go() }); setTimeout(function () { inp.focus() }, 50) }
  return { rnd: rnd, game: game, ask: ask, star: star };
})();
