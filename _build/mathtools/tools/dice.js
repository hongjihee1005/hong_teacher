/* 주사위·동전: 여러 번 던져 결과를 표와 막대그래프로 — 많이 던질수록 어떻게 될까? */
window.TOOL = function (host, api) {
  var MODES = {
    d1: { nm: '주사위 1개', out: [1, 2, 3, 4, 5, 6], roll: function () { return 1 + Math.floor(Math.random() * 6) }, show: function (v) { return face(v) } },
    d2: { nm: '주사위 2개(합)', out: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], roll: function () { var a = 1 + Math.floor(Math.random() * 6), b = 1 + Math.floor(Math.random() * 6); last2 = [a, b]; return a + b }, show: function (v) { return face(last2[0]) + face(last2[1]) + '<b class="dc-sum">= ' + v + '</b>' } },
    c1: { nm: '동전 1개', out: ['앞', '뒤'], roll: function () { return Math.random() < .5 ? '앞' : '뒤' }, show: function (v) { return coin(v) } },
    c2: { nm: '동전 2개', out: ['앞 2개', '앞 1개·뒤 1개', '뒤 2개'], roll: function () { var a = Math.random() < .5, b = Math.random() < .5; last2 = [a ? '앞' : '뒤', b ? '앞' : '뒤']; return a && b ? '앞 2개' : !a && !b ? '뒤 2개' : '앞 1개·뒤 1개' }, show: function () { return coin(last2[0]) + coin(last2[1]) } }
  };
  var mode = 'd1', cnt = {}, total = 0, last2 = [1, 1], lastV = null;
  function face(v) { var P = { 1: [[2, 2]], 2: [[1, 1], [3, 3]], 3: [[1, 1], [2, 2], [3, 3]], 4: [[1, 1], [3, 1], [1, 3], [3, 3]], 5: [[1, 1], [3, 1], [2, 2], [1, 3], [3, 3]], 6: [[1, 1], [3, 1], [1, 2], [3, 2], [1, 3], [3, 3]] }[v]; return '<svg class="dc-die" viewBox="0 0 80 80" aria-label="주사위 ' + v + '"><rect x="3" y="3" width="74" height="74" rx="14"/>' + P.map(function (p) { return '<circle cx="' + p[0] * 20 + '" cy="' + p[1] * 20 + '" r="7" class="' + (v === 1 ? 'dc-red' : '') + '"/>' }).join('') + '</svg>' }
  function coin(v) { return '<span class="dc-coin dc-' + (v === '앞' ? 'h' : 't') + '">' + v + '</span>' }
  host.innerHTML = '<div class="tl-row">' + Object.keys(MODES).map(function (k) { return '<button type="button" class="tl-btn" data-m="' + k + '">' + MODES[k].nm + '</button>' }).join('') + '</div><div class="dc-show" aria-live="polite"></div>'
    + '<div class="tl-row"><button type="button" class="tl-btn tl-go" data-n="1">1번 던지기</button><button type="button" class="tl-btn" data-n="10">10번</button><button type="button" class="tl-btn" data-n="100">100번</button><button type="button" class="tl-btn" data-n="1000">1000번</button><button type="button" class="tl-btn" data-a="clr">처음부터</button></div><div class="dc-res"></div><p class="tl-msg"></p>';
  var msg = host.querySelector('.tl-msg');
  function draw() {
    var M = MODES[mode], mx = 1; M.out.forEach(function (o) { mx = Math.max(mx, cnt[o] || 0) });
    host.querySelector('.dc-show').innerHTML = lastV == null ? '<span class="dc-wait">던져 볼까요?</span>' : M.show(lastV);
    host.querySelector('.dc-res').innerHTML = '<table class="dc-tbl"><tr><th>나온 것</th>' + M.out.map(function (o) { return '<th>' + o + '</th>' }).join('') + '<th>합계</th></tr><tr><th>횟수</th>' + M.out.map(function (o) { return '<td>' + (cnt[o] || 0) + '</td>' }).join('') + '<td>' + total + '</td></tr></table>'
      + '<div class="dc-chart">' + M.out.map(function (o) { var c = cnt[o] || 0; return '<div class="dc-bar"><span class="dc-c">' + c + (total ? '<small>' + Math.round(c / total * 100) + '%</small>' : '') + '</span><i style="height:' + (c / mx * 100) + '%"></i><b>' + o + '</b></div>' }).join('') + '</div>';
    host.querySelectorAll('[data-m]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.m === mode ? 'true' : 'false') });
    api.bar(M.nm + ' · ' + total + '번 던짐');
    msg.textContent = total >= 100 ? (mode === 'd2' ? '두 주사위의 합은 7이 가장 많이 나와요. 7이 되는 경우가 6가지로 가장 많거든요(1+6, 2+5, 3+4, 4+3, 5+2, 6+1).' : mode === 'c2' ? '‘앞 1개·뒤 1개’가 다른 것의 약 2배예요. (앞,뒤)와 (뒤,앞) 두 가지 경우가 있거든요.' : '많이 던질수록 나온 횟수가 서로 비슷해져요. 어느 것이 나올 가능성이 같기 때문이에요.') : total ? '더 많이 던지면 어떻게 될까요? 예상해 보고 100번 던져 보세요.' : '';
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.m) { mode = b.dataset.m; cnt = {}; total = 0; lastV = null }
    if (b.dataset.a === 'clr') { cnt = {}; total = 0; lastV = null }
    if (b.dataset.n) { var M = MODES[mode]; for (var i = 0; i < +b.dataset.n; i++) { lastV = M.roll(); cnt[lastV] = (cnt[lastV] || 0) + 1; total++ } var sh = host.querySelector('.dc-show'); sh.classList.remove('dc-pop'); void sh.offsetWidth; sh.classList.add('dc-pop') }
    draw();
  });
  draw();
};
