/* 어림 왕 공통: 10판 진행, 오차에 따라 별(★★★/★★/★/☆), 결과 */
var EST = (function () {
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)) }
  function stars(err) { return err <= .05 ? 3 : err <= .15 ? 2 : err <= .3 ? 1 : 0 }   // err: 상대 오차
  function star(n) { return '<span class="es-st">' + '★★★'.slice(0, n) + '<i>' + '★★★'.slice(n) + '</i></span>' }
  /* game(host, api, {name, lv:[쉬움 설명, 보통, 도전], round(stage, done, 단계 0·1·2), score(내 답, 정답, 단계)})
     round는 한 판을 그리고, 끝나면 done(내 답, 정답, 설명) 호출. 단계(2026-11-26)는 위 단추로 고르고, 바꾸면 처음부터. */
  var LVN = ['쉬움', '보통', '도전'], LK = 'hj-est-lv';
  function lvGet(id) { try { var v = JSON.parse(localStorage.getItem(LK) || '{}')[id]; return v >= 0 && v <= 2 ? v : 1 } catch (e) { return 1 } }
  function lvSet(id, v) { try { var o = JSON.parse(localStorage.getItem(LK) || '{}'); o[id] = v; localStorage.setItem(LK, JSON.stringify(o)) } catch (e) {} }
  function game(host, api, G) {
    var k = 0, total = 0, log = [], id = (window.TL && TL.id) || G.name, lv = lvGet(id);
    host.innerHTML = '<div class="es-lvs" role="group" aria-label="단계">' + LVN.map(function (n, i) { return '<button type="button" class="es-lv" data-lv="' + i + '" aria-pressed="' + (i === lv) + '">' + n + '</button>' }).join('') + '<small class="es-lvd"></small></div><div class="es-head"><span class="es-k"></span><span class="es-sum"></span></div><div class="es-stage"></div><div class="es-res" aria-live="polite"></div>';
    var stage = host.querySelector('.es-stage'), res = host.querySelector('.es-res');
    function drawLv() { host.querySelectorAll('.es-lv').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.lv === lv) }); host.querySelector('.es-lvd').textContent = G.lv ? G.lv[lv] : '' }
    host.querySelector('.es-lvs').onclick = function (e) { var b = e.target.closest('.es-lv'); if (!b || +b.dataset.lv === lv) return; lv = +b.dataset.lv; lvSet(id, lv); drawLv(); k = 0; total = 0; log = []; next() };
    drawLv();
    function next() {
      if (k >= 10) { var avg = total / 10, title = avg >= 2.5 ? '👑 어림 왕!' : avg >= 1.8 ? '🥇 어림 박사' : avg >= 1 ? '🥈 어림 탐험가' : '🌱 어림 새싹'; stage.innerHTML = '<div class="es-end"><p class="es-title">' + title + '</p><p>' + LVN[lv] + ' 단계 · 10판 별 <b>' + total + '</b>개 (평균 ' + avg.toFixed(1) + '개)</p><table class="es-log"><tr><th>판</th><th>내 어림</th><th>실제</th><th>별</th></tr>' + log.map(function (l, i) { return '<tr><td>' + (i + 1) + '</td><td>' + l[0] + '</td><td>' + l[1] + '</td><td>' + star(l[2]) + '</td></tr>' }).join('') + '</table><button type="button" class="tl-btn tl-go es-again">다시 하기</button></div>'; res.innerHTML = ''; stage.querySelector('.es-again').onclick = function () { k = 0; total = 0; log = []; next() }; api.bar(G.name + ' · ' + LVN[lv] + ' · 끝'); return }
      host.querySelector('.es-k').textContent = (k + 1) + ' / 10판'; host.querySelector('.es-sum').innerHTML = '별 ' + total + '개'; res.innerHTML = ''; api.bar(G.name + ' · ' + LVN[lv] + ' · ' + (k + 1) + '판');
      G.round(stage, function (mine, real, why, unit) {
        var err = Math.abs(mine - real) / Math.max(1, Math.abs(real)), s = G.score ? G.score(mine, real, lv) : stars(err); total += s; log.push([mine + (unit || ''), real + (unit || ''), s]);
        host.querySelector('.es-sum').innerHTML = '별 ' + total + '개';
        res.innerHTML = '<p class="es-rp">' + star(s) + ' 내 어림 <b>' + mine + (unit || '') + '</b> · 실제 <b>' + real + (unit || '') + '</b> (차이 ' + Math.abs(Math.round((mine - real) * 10) / 10) + (unit || '') + ')</p>' + (why ? '<p class="es-why">' + why + '</p>' : '') + '<button type="button" class="tl-btn tl-go es-next">' + (k < 9 ? '이어서 ▶' : '결과 보기') + '</button>';
        var nb = res.querySelector('.es-next'); nb.onclick = function () { k++; next() }; setTimeout(function () { nb.focus() }, 400);
      }, lv);
    }
    next();
  }
  /* 숫자 입력 + 확인 */
  function ask(el, label, cb) { el.insertAdjacentHTML('beforeend', '<div class="tl-row es-ask"><label>' + label + ' <input class="es-in" inputmode="numeric" maxlength="5"></label><button type="button" class="tl-btn tl-go">확인</button></div>'); var inp = el.querySelector('.es-in'), b = el.querySelector('.es-ask button'), go = function () { var v = parseFloat(inp.value); if (isNaN(v)) return; b.disabled = inp.disabled = true; cb(v) }; b.onclick = go; inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go() }); setTimeout(function () { inp.focus() }, 50) }
  return { rnd: rnd, game: game, ask: ask, star: star };
})();
