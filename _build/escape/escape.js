/* 수학 방탈출: 자물쇠 5개 → 마지막 문. 자료 window.ER = 방 */
window.TOOL = function (host, api) {
  var R = window.ER, N = R.locks.length, st, tick = null, limit = 0;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function frac(s) { return esc(s).replace(/(\d+)\/(\d+)/g, '<span class="fd-fr"><i>$1</i><i>$2</i></span>') }
  function reset() { st = { k: 0, open: [], hints: 0, wrong: 0, t0: 0, done: false, shown: {} }; stop(); draw() }
  function stop() { if (tick) clearInterval(tick); tick = null }
  function sec() { return st.t0 ? Math.floor((Date.now() - st.t0) / 1000) : 0 }
  function mmss(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') }
  function timer() { var el = host.querySelector('.es-time'); if (!el) return; var s = sec(); el.textContent = limit ? '남은 시간 ' + mmss(limit * 60 - s) : '걸린 시간 ' + mmss(s); if (limit && s >= limit * 60 && !st.done) { stop(); el.textContent = '⏰ 시간 끝! 계속 풀어도 돼요'; el.classList.add('es-over') } }
  function bar() { var h = ''; for (var i = 0; i <= N; i++) h += '<span class="es-dot' + (i < st.k ? ' es-ok' : i === st.k && !st.done ? ' es-now' : '') + (st.done ? ' es-ok' : '') + '">' + (i < N ? (i < st.k ? '🔓' : '🔒') : (st.done ? '🚪' : '🚪')) + '<small>' + (i < N ? (i + 1) + '번' : '문') + '</small></span>'; return h }
  function draw() {
    if (!st.t0) {
      host.innerHTML = '<div class="es-start"><p class="es-intro">' + esc(R.intro) + '</p><p class="tl-row">시간 제한 <select class="es-lim"><option value="0">없음(걸린 시간만)</option><option value="15">15분</option><option value="20" selected>20분</option><option value="30">30분</option></select></p><button type="button" class="tl-btn tl-go es-go">🔑 탈출 시작!</button></div>';
      api.bar('🔐 ' + R.title); return;
    }
    var h = '<div class="es-top"><div class="es-bar">' + bar() + '</div><span class="es-time"></span><span class="es-hc">💡 힌트 ' + st.hints + ' · ❌ ' + st.wrong + '</span></div>';
    if (st.done) h += '<div class="es-win"><p class="es-big">🎉 탈출 성공!</p><p>' + esc(R.final.story) + '</p><p>걸린 시간 <b>' + mmss(st.sec) + '</b> · 힌트 <b>' + st.hints + '</b>번 · 틀린 횟수 <b>' + st.wrong + '</b>번</p><button type="button" class="tl-btn" data-a="again">처음부터 다시</button></div>';
    else {
      var fin = st.k >= N, L = fin ? null : R.locks[st.k];
      h += '<div class="es-lock' + (fin ? ' es-door' : '') + '"><p class="es-story">' + (fin ? '🚪 마지막 문이에요! 모은 단서로 비밀번호를 알아내요.' : '🔒 ' + (st.k + 1) + '번 자물쇠 — ' + esc(L.story)) + '</p><p class="es-q">' + frac(fin ? R.final.q : L.q) + '</p>'
        + (fin ? '<p class="es-clues">' + st.open.map(function (a, i) { return '<span>' + (i + 1) + '번 답 <b>' + a + '</b></span>' }).join('') + '</p>' : '')
        + '<div class="es-in"><span class="es-disp" aria-live="polite"></span></div><div class="es-pad">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, '지움', 0, '열기'].map(function (d) { return '<button type="button" class="es-k' + (d === '열기' ? ' es-open' : '') + '" data-k="' + d + '">' + (d === '열기' ? '🔓 열기' : d) + '</button>' }).join('') + '</div>'
        + '<div class="tl-row"><button type="button" class="tl-btn" data-a="hint">💡 힌트 보기</button><button type="button" class="tl-btn" data-a="ans">🔑 정답 보기(선생님)</button></div><div class="es-hints"></div><p class="tl-msg" aria-live="polite"></p></div>';
    }
    host.innerHTML = h; timer(); api.bar('🔐 ' + R.title + (st.done ? ' · 탈출!' : ' · ' + (st.k >= N ? '마지막 문' : (st.k + 1) + '번 자물쇠')));
    var hs = host.querySelector('.es-hints'); if (hs) { var arr = st.k >= N ? [R.final.hint] : R.locks[st.k].hints; hs.innerHTML = arr.slice(0, st.shown[st.k] || 0).map(function (t, i) { return '<p>💡 ' + (i + 1) + '. ' + frac(t) + '</p>' }).join('') }
  }
  var typed = '';
  function want() { return st.k >= N ? R.final.a : R.locks[st.k].a }
  function tryOpen() {
    var m = host.querySelector('.tl-msg'), box = host.querySelector('.es-lock');
    if (!typed) return;
    if (+typed === want()) {
      st.open.push(want()); typed = '';
      if (st.k >= N) { st.done = true; st.sec = sec(); stop(); draw(); return }
      var sol = R.locks[st.k].sol; st.k++; draw(); var mm = host.querySelector('.tl-msg'); mm.innerHTML = '🔓 열렸어요! <small>' + frac(sol) + '</small>'; mm.style.color = 'var(--ok)';
    } else { st.wrong++; box.classList.remove('es-shake'); void box.offsetWidth; box.classList.add('es-shake'); m.textContent = '❌ 자물쇠가 열리지 않아요. 다시 생각해 보세요.'; m.style.color = 'var(--bad)'; typed = ''; host.querySelector('.es-disp').textContent = ''; host.querySelector('.es-hc').textContent = '💡 힌트 ' + st.hints + ' · ❌ ' + st.wrong }
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('es-go')) { limit = +host.querySelector('.es-lim').value; st.t0 = Date.now(); tick = setInterval(timer, 1000); typed = ''; draw(); return }
    if (b.dataset.a === 'again') { reset(); return }
    if (b.dataset.k != null) { var k = b.dataset.k; if (k === '열기') tryOpen(); else if (k === '지움') typed = typed.slice(0, -1); else if (typed.length < 6) typed += k; var d = host.querySelector('.es-disp'); if (d) d.textContent = typed; return }
    if (b.dataset.a === 'hint') { var arr = st.k >= N ? [R.final.hint] : R.locks[st.k].hints, s = st.shown[st.k] || 0; if (s < arr.length) { st.shown[st.k] = s + 1; st.hints++ } draw() }
    if (b.dataset.a === 'ans' && confirm('정답을 볼까요? (선생님 확인용)')) { var mm = host.querySelector('.tl-msg'); mm.innerHTML = '정답: <b>' + want() + '</b>' + (st.k < N ? ' — ' + frac(R.locks[st.k].sol) : ''); mm.style.color = '' }
  });
  document.addEventListener('keydown', function (e) { if (!host.querySelector('.es-pad') || /INPUT|SELECT/.test(e.target.tagName)) return; if (/^[0-9]$/.test(e.key) && typed.length < 6) typed += e.key; else if (e.key === 'Backspace') typed = typed.slice(0, -1); else if (e.key === 'Enter') { tryOpen(); return } else return; host.querySelector('.es-disp').textContent = typed });
  document.getElementById('esPrint').onclick = function () { document.documentElement.classList.add('es-printing'); var off = function () { document.documentElement.classList.remove('es-printing'); window.removeEventListener('afterprint', off) }; window.addEventListener('afterprint', off); setTimeout(function () { window.print() }, 80) };
  reset();
};
