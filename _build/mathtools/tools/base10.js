/* 수 모형: 백·십·일 모형을 놓고 모으기(일 10 → 십 1)·풀기(십 1 → 일 10) */
window.TOOL = function (host, api) {
  var S = { h: 1, t: 2, o: 4 }, show = true, NM = { h: '백 모형', t: '십 모형', o: '일 모형' }, V = { h: 100, t: 10, o: 1 };
  host.innerHTML = '<div class="bt-board"></div><p class="tl-row bt-val"></p>'
    + '<div class="tl-row">' + ['h', 't', 'o'].map(function (k) { return '<span class="bt-ctl"><b>' + NM[k] + '</b><button type="button" class="tl-btn" data-k="' + k + '" data-d="-1">−</button><button type="button" class="tl-btn" data-k="' + k + '" data-d="1">+</button></span>' }).join('') + '</div>'
    + '<div class="tl-row"><button type="button" class="tl-btn" data-r="ot">일 10개 → 십 1개 (모으기)</button><button type="button" class="tl-btn" data-r="to">십 1개 → 일 10개 (풀기)</button><button type="button" class="tl-btn" data-r="th">십 10개 → 백 1개</button><button type="button" class="tl-btn" data-r="ht">백 1개 → 십 10개</button></div>'
    + '<div class="tl-row"><label>수 넣기 <input class="bt-in" inputmode="numeric" maxlength="3" aria-label="수 넣기"></label><button type="button" class="tl-btn" data-a="set">놓기</button><button type="button" class="tl-btn" data-a="show" aria-pressed="true">수 보이기</button><button type="button" class="tl-btn" data-a="clr">모두 치우기</button></div><p class="tl-msg"></p>';
  var msg = host.querySelector('.tl-msg');
  function piece(k) { return '<button type="button" class="bt-p bt-' + k + '" data-k="' + k + '" aria-label="' + NM[k] + ' 빼기"></button>' }
  function draw() {
    host.querySelector('.bt-board').innerHTML = ['h', 't', 'o'].map(function (k) {
      var h = ''; for (var i = 0; i < S[k]; i++) h += piece(k);
      return '<div class="bt-col bt-c' + k + '"><div class="bt-lab">' + NM[k].replace(' 모형', '') + '<small>' + S[k] + '개</small></div><div class="bt-pile">' + h + '</div></div>';
    }).join('');
    var n = S.h * 100 + S.t * 10 + S.o;
    host.querySelector('.bt-val').innerHTML = show ? '<span class="tl-big">' + n + '</span><span class="bt-eq">= 100 × ' + S.h + ' + 10 × ' + S.t + ' + 1 × ' + S.o + '</span>' : '<span class="tl-big">?</span>';
    api.bar(show ? '수 모형 · ' + n : '수 모형');
    host.querySelector('[data-r="ot"]').disabled = S.o < 10; host.querySelector('[data-r="to"]').disabled = S.t < 1;
    host.querySelector('[data-r="th"]').disabled = S.t < 10; host.querySelector('[data-r="ht"]').disabled = S.h < 1;
  }
  host.onclick = function (e) {
    var b = e.target.closest('button'); if (!b) return; msg.textContent = '';
    if (b.classList.contains('bt-p')) { S[b.dataset.k]--; }
    else if (b.dataset.d) { var k = b.dataset.k, v = S[k] + +b.dataset.d; if (v < 0) return; if (v > 20) { msg.textContent = '한 자리에 20개까지 놓을 수 있어요. 모으기를 해 보세요!'; return } S[k] = v }
    else if (b.dataset.r) {
      var r = b.dataset.r;
      if (r === 'ot') { S.o -= 10; S.t++; msg.textContent = '일 모형 10개를 모으면 십 모형 1개가 돼요 (받아올림).' }
      if (r === 'to') { S.t--; S.o += 10; msg.textContent = '십 모형 1개를 풀면 일 모형 10개가 돼요 (받아내림).' }
      if (r === 'th') { S.t -= 10; S.h++; msg.textContent = '십 모형 10개를 모으면 백 모형 1개가 돼요.' }
      if (r === 'ht') { S.h--; S.t += 10; msg.textContent = '백 모형 1개를 풀면 십 모형 10개가 돼요.' }
    }
    else if (b.dataset.a === 'set') { var n = parseInt(host.querySelector('.bt-in').value, 10); if (!(n >= 0 && n <= 999)) { msg.textContent = '0부터 999까지의 수를 써 주세요.'; return } S = { h: Math.floor(n / 100), t: Math.floor(n / 10) % 10, o: n % 10 } }
    else if (b.dataset.a === 'show') { show = !show; b.setAttribute('aria-pressed', show ? 'true' : 'false') }
    else if (b.dataset.a === 'clr') S = { h: 0, t: 0, o: 0 };
    draw();
  };
  host.querySelector('.bt-in').addEventListener('keydown', function (e) { if (e.key === 'Enter') host.querySelector('[data-a="set"]').click() });
  draw();
};
