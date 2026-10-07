/* 수학자 이야기 — 해 보기 활동(인물마다 하나)과 확인 문제. 자료 window.MP = {p: 인물} (build.py가 넣음)
   클래스 앞글자 mp- (공통 덮개 content.css의 .on/.sel/.st/.an/.ex 등과 겹치지 않게) */
(function () {
  'use strict';
  var P = window.MP.p, $ = function (id) { return document.getElementById(id) };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function say(el, t, kind) { el.innerHTML = t; el.className = 'mp-msg' + (kind ? ' mp-' + kind : '') }
  function isPrime(n) { if (n < 2) return false; for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return true }
  function numIn(cls, w) { return '<input class="mp-in ' + (cls || '') + '" inputmode="numeric" autocomplete="off" maxlength="' + (w || 5) + '" aria-label="답">' }
  function onNum(el, fn) { el.addEventListener('input', function () { el.value = el.value.replace(/[^0-9]/g, ''); fn() }) }

  var W = {};
  /* ── 탈레스: 그림자로 높이 ── */
  W.shadow = function (host, A) {
    host.innerHTML = A.items.map(function (it, i) {
      var sx = 30, gy = 150, u = Math.min(30, 125 / Math.max(it.a, it.stick), 260 / (it.big + it.sh));
      var st = it.stick * u, ss = it.sh * u, bh = it.a * u, bs = it.big * u, bx = Math.max(sx + 6 + ss + 50, 130);
      var svg = '<svg class="mp-fig" viewBox="0 0 470 175" role="img" aria-label="막대와 ' + it.what + '의 그림자">'
        + '<circle cx="440" cy="22" r="14" class="mp-sun"/>'
        + '<line x1="0" y1="' + gy + '" x2="470" y2="' + gy + '" class="mp-ground"/>'
        + '<rect x="' + sx + '" y="' + (gy - st) + '" width="6" height="' + st + '" class="mp-stick"/>'
        + '<line x1="' + (sx + 6) + '" y1="' + (gy + 3) + '" x2="' + (sx + 6 + ss) + '" y2="' + (gy + 3) + '" class="mp-shadow"/>'
        + '<text x="' + (sx - 4) + '" y="' + (gy - st / 2) + '" class="mp-t" text-anchor="end">' + it.stick + 'm</text>'
        + '<text x="' + (sx + 6 + ss / 2) + '" y="' + (gy + 20) + '" class="mp-t" text-anchor="middle">그림자 ' + it.sh + 'm</text>'
        + '<rect x="' + bx + '" y="' + (gy - bh) + '" width="26" height="' + bh + '" rx="3" class="mp-big"/>'
        + '<line x1="' + (bx + 26) + '" y1="' + (gy + 3) + '" x2="' + (bx + 26 + bs) + '" y2="' + (gy + 3) + '" class="mp-shadow"/>'
        + '<text x="' + (bx + 13) + '" y="' + (gy - bh - 6) + '" class="mp-t" text-anchor="middle">' + it.what + ' ?m</text>'
        + '<text x="' + (bx + 26 + bs / 2) + '" y="' + (gy + 20) + '" class="mp-t" text-anchor="middle">그림자 ' + it.big + 'm</text></svg>';
      return '<div class="mp-card"><p class="mp-q"><b>' + (i + 1) + '.</b> 막대 ' + it.stick + 'm의 그림자가 ' + it.sh + 'm일 때, ' + it.what + '의 그림자는 ' + it.big + 'm예요. ' + it.what + '의 높이는?</p>' + svg
        + '<p class="mp-row">' + numIn('', 4) + ' m</p><p class="mp-msg" aria-live="polite"></p></div>';
    }).join('');
    host.querySelectorAll('.mp-card').forEach(function (c, i) {
      var inp = c.querySelector('input'), m = c.querySelector('.mp-msg'), it = A.items[i];
      onNum(inp, function () {
        if (!inp.value) return say(m, '');
        if (+inp.value === it.a) { say(m, '⭕ 맞아요! ' + it.why, 'ok'); inp.classList.add('mp-good') }
        else if (String(it.a).length <= inp.value.length) say(m, '다시 생각해 보세요. 막대의 높이와 그림자 길이가 몇 배인지 먼저 찾아요.', 'bad');
      });
    });
  };
  /* ── 아르키메데스: 다각형으로 원주율 ── */
  W.polygon = function (host) {
    host.innerHTML = '<div class="mp-poly"><svg class="mp-fig mp-sq" viewBox="-130 -130 260 260" role="img" aria-label="원과 정다각형"></svg><div class="mp-pside">'
      + '<p class="mp-row">변의 수: <b class="mp-n"></b></p><input type="range" min="3" max="96" value="6" class="mp-range" aria-label="변의 수">'
      + '<p class="mp-chips">' + [6, 12, 24, 48, 96].map(function (n) { return '<button type="button" class="mp-chip" data-n="' + n + '">정' + n + '각형</button>' }).join('') + '</p>'
      + '<table class="mp-tbl"><tr><th>안쪽 다각형 둘레 ÷ 지름</th><td class="mp-in1"></td></tr><tr><th>바깥 다각형 둘레 ÷ 지름</th><td class="mp-out1"></td></tr><tr><th>진짜 원주율</th><td>3.14159…</td></tr></table>'
      + '<p class="mp-msg"></p></div></div>';
    var svg = host.querySelector('svg'), rg = host.querySelector('.mp-range');
    function draw(n) {
      var r = 100, R = r / Math.cos(Math.PI / n), a = [], b = [];
      for (var i = 0; i < n; i++) { var t = -Math.PI / 2 + 2 * Math.PI * i / n, u = t + Math.PI / n; a.push((r * Math.cos(t)).toFixed(1) + ',' + (r * Math.sin(t)).toFixed(1)); b.push((R * Math.cos(t)).toFixed(1) + ',' + (R * Math.sin(t)).toFixed(1)) }
      svg.innerHTML = '<polygon points="' + b.join(' ') + '" class="mp-pout"/><circle r="100" class="mp-circ"/><polygon points="' + a.join(' ') + '" class="mp-pin"/><line x1="-100" y1="0" x2="100" y2="0" class="mp-dia"/><text y="-6" class="mp-t" text-anchor="middle">지름</text>';
      var lo = n * Math.sin(Math.PI / n), hi = n * Math.tan(Math.PI / n);
      host.querySelector('.mp-n').textContent = '정' + n + '각형';
      host.querySelector('.mp-in1').textContent = lo.toFixed(4); host.querySelector('.mp-out1').textContent = hi.toFixed(4);
      say(host.querySelector('.mp-msg'), n >= 96 ? '🎉 아르키메데스가 계산한 정96각형이에요! 원주율은 ' + lo.toFixed(4) + '과 ' + hi.toFixed(4) + ' 사이 — 거의 3.14예요.' : '원주율은 두 값 사이에 있어요. 변을 늘려 보세요!', n >= 96 ? 'ok' : '');
    }
    rg.oninput = function () { draw(+rg.value) };
    host.querySelectorAll('.mp-chip').forEach(function (b) { b.onclick = function () { rg.value = b.dataset.n; draw(+b.dataset.n) } });
    draw(6);
  };
  /* ── 에라토스테네스의 체 ── */
  W.sieve = function (host) {
    host.innerHTML = '<div class="mp-sieve" role="grid" aria-label="1부터 100까지"></div><p class="mp-row"><button type="button" class="mp-btn mp-go">▶ 다음 수로 거르기</button><button type="button" class="mp-btn mp-rst">처음부터</button></p><p class="mp-msg" aria-live="polite"></p>';
    var g = host.querySelector('.mp-sieve'), m = host.querySelector('.mp-msg'), st;
    function reset() { st = { out: { 1: 1 }, pr: {}, last: 1 }; paint(); say(m, '1은 소수가 아니라서 먼저 지웠어요. ‘다음 수로 거르기’를 누르거나, 남아 있는 가장 작은 수를 눌러 보세요.') }
    function paint() {
      var h = ''; for (var n = 1; n <= 100; n++) h += '<button type="button" class="mp-sv' + (st.out[n] ? ' mp-x' : '') + (st.pr[n] ? ' mp-p' : '') + '" data-n="' + n + '">' + n + '</button>';
      g.innerHTML = h;
    }
    function next() { for (var n = st.last + 1; n <= 100; n++) if (!st.out[n] && !st.pr[n]) return n; return 0 }
    function step() {
      var p = next(); if (!p) return;
      if (p * p > 100) {   // 남은 수는 모두 소수
        for (var n = 2; n <= 100; n++) if (!st.out[n]) st.pr[n] = 1;
        st.last = 100; paint(); say(m, '🎉 ' + p + '×' + p + '이 100보다 크니 더 지울 수가 없어요. 남은 수는 모두 소수 — <b>25개</b>예요!', 'ok'); return;
      }
      st.pr[p] = 1; st.last = p; var c = 0; for (var k = p * p; k <= 100; k += p) if (!st.out[k]) { st.out[k] = 1; c++ }
      paint(); say(m, '<b>' + p + '</b>는 소수! ' + p + '의 배수 ' + c + '개를 새로 지웠어요. 다음으로 남은 가장 작은 수는 무엇일까요?');
    }
    g.onclick = function (e) {
      var b = e.target.closest('.mp-sv'); if (!b) return; var n = +b.dataset.n;
      if (n === next()) step(); else if (!st.out[n] && !st.pr[n]) say(m, '아직 남아 있는 가장 작은 수부터 골라요. 지금은 <b>' + next() + '</b>예요.', 'bad');
    };
    host.querySelector('.mp-go').onclick = step; host.querySelector('.mp-rst').onclick = reset; reset();
  };
  /* ── 피보나치: 수열 빈칸 ── */
  W.seq = function (host, A) {
    host.innerHTML = '<div class="mp-seq">' + A.seq.map(function (v, i) {
      return '<div class="mp-sc"><small>' + (i + 1) + A.label + '</small>' + (A.blank.indexOf(i) >= 0 ? numIn('', 4) : '<b>' + v + '</b>') + '<span class="mp-rab">' + (v <= 8 ? new Array(v + 1).join('🐰') : '🐰×' + v) + '</span></div>';
    }).join('') + '</div><p class="mp-msg" aria-live="polite">빈칸에 알맞은 수를 써 보세요. 💡 지난달 토끼 + 그 전 달 토끼(새끼를 낳을 수 있는 어른)!</p>';
    var m = host.querySelector('.mp-msg'), ins = host.querySelectorAll('input');
    ins.forEach(function (inp, k) {
      var want = A.seq[A.blank[k]];
      onNum(inp, function () {
        inp.classList.toggle('mp-good', +inp.value === want); inp.classList.toggle('mp-badin', inp.value.length >= String(want).length && +inp.value !== want);
        var all = [].every.call(ins, function (x, j) { return +x.value === A.seq[A.blank[j]] });
        if (all) say(m, '🎉 모두 맞아요! 앞의 두 수를 더하면 다음 수 — 이것이 피보나치 수예요. 1년(12째 달)이면 토끼가 144쌍!', 'ok');
      });
    });
  };
  /* ── 파스칼의 삼각형 ── */
  W.pascal = function (host, A) {
    var R = [[1]]; for (var r = 1; r < A.rows; r++) { var row = [1]; for (var j = 1; j < r; j++) row.push(R[r - 1][j - 1] + R[r - 1][j]); row.push(1); R.push(row) }
    var blanks = { '2,1': 1, '3,1': 1, '4,2': 1, '4,3': 1, '5,2': 1, '5,3': 1, '6,1': 1, '6,3': 1, '6,4': 1, '7,2': 1, '7,3': 1, '7,5': 1 };
    host.innerHTML = '<div class="mp-pas">' + R.map(function (row, r) {
      return '<div class="mp-prow">' + row.map(function (v, j) { return blanks[r + ',' + j] ? '<span class="mp-pc">' + numIn('', 2).replace('class="mp-in ', 'data-v="' + v + '" class="mp-in ') + '</span>' : '<span class="mp-pc"><b>' + v + '</b></span>' }).join('') + '<i class="mp-psum">합 ' + Math.pow(2, r) + '</i></div>';
    }).join('') + '</div><p class="mp-msg" aria-live="polite"></p>';
    var ins = host.querySelectorAll('input'), m = host.querySelector('.mp-msg');
    ins.forEach(function (inp) {
      onNum(inp, function () {
        var v = +inp.dataset.v; inp.classList.toggle('mp-good', +inp.value === v); inp.classList.toggle('mp-badin', inp.value.length >= String(v).length && +inp.value !== v);
        if ([].every.call(ins, function (x) { return +x.value === +x.dataset.v })) { say(m, '🎉 완성! 오른쪽의 ‘줄의 합’을 보세요 — 1, 2, 4, 8, 16 … 두 배씩 늘어나요.', 'ok'); host.classList.add('mp-pdone') }
      });
    });
  };
  /* ── 최석정: 라틴 방진 ── */
  W.latin = function (host) {
    var sol = [[1, 2, 3], [2, 3, 1], [3, 1, 2]], given = { '0,0': 1, '0,1': 1, '1,1': 1 }, cur = sol.map(function (r, y) { return r.map(function (v, x) { return given[y + ',' + x] ? v : 0 }) });
    var B = [['가', '나', '다'], ['다', '가', '나'], ['나', '다', '가']];
    host.innerHTML = '<div class="mp-lat"></div><p class="mp-msg" aria-live="polite">빈칸을 눌러 1 → 2 → 3 → 빈칸 차례로 바꿔요.</p><div class="mp-orth" hidden></div>';
    var g = host.querySelector('.mp-lat'), m = host.querySelector('.mp-msg');
    function bad(y, x) { var v = cur[y][x]; if (!v) return false; for (var k = 0; k < 3; k++) { if (k !== x && cur[y][k] === v) return true; if (k !== y && cur[k][x] === v) return true } return false }
    function paint() {
      var h = ''; for (var y = 0; y < 3; y++) for (var x = 0; x < 3; x++) h += '<button type="button" class="mp-lc' + (given[y + ',' + x] ? ' mp-giv' : '') + (bad(y, x) ? ' mp-bad' : '') + '" data-y="' + y + '" data-x="' + x + '">' + (cur[y][x] || '') + '</button>';
      g.innerHTML = h;
      var done = cur.every(function (r, y) { return r.every(function (v, x) { return v && !bad(y, x) }) });
      if (done) {
        say(m, '🎉 라틴 방진 완성! 가로줄·세로줄마다 1, 2, 3이 한 번씩 있어요.', 'ok');
        var o = host.querySelector('.mp-orth'); o.hidden = false;
        var grid = function (f) { var s = '<div class="mp-lg">'; for (var y = 0; y < 3; y++) for (var x = 0; x < 3; x++) s += '<span>' + f(y, x) + '</span>'; return s + '</div>' };
        o.innerHTML = '<p>최석정은 이런 방진 <b>두 개를 겹쳤어요</b>. 오른쪽 ‘가·나·다’ 방진도 줄마다 한 번씩만 나와요. 둘을 겹치면 생기는 9개의 짝이 <b>모두 달라요</b> — 이것이 ‘직교 라틴 방진’이에요. 최석정은 9×9 크기로 만들었어요!</p>'
          + '<div class="mp-lrow">' + grid(function (y, x) { return cur[y][x] }) + '<b>+</b>' + grid(function (y, x) { return B[y][x] }) + '<b>=</b>' + grid(function (y, x) { return cur[y][x] + B[y][x] }) + '</div>';
      }
    }
    g.onclick = function (e) { var b = e.target.closest('.mp-lc'); if (!b || b.classList.contains('mp-giv')) return; var y = +b.dataset.y, x = +b.dataset.x; cur[y][x] = (cur[y][x] + 1) % 4; host.querySelector('.mp-orth').hidden = true; say(m, ''); paint() };
    paint();
  };
  /* ── 오일러: 한붓그리기 ── */
  var FIGS = [
    { nm: '사각형과 대각선 하나', p: [[30, 30], [150, 30], [150, 130], [30, 130]], e: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]] },
    { nm: '사각형과 대각선 두 개', p: [[30, 30], [150, 30], [150, 130], [30, 130]], e: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3]] },
    { nm: '지붕 있는 집', p: [[40, 70], [140, 70], [140, 150], [40, 150], [90, 15]], e: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [1, 3], [0, 4], [4, 1]] },
    { nm: '별', p: [[90, 12], [146, 150], [12, 62], [168, 62], [34, 150]], e: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
    { nm: '쾨니히스베르크의 다리', p: [[90, 18], [90, 150], [60, 84], [160, 84]], e: [[0, 2, -22], [0, 2, 22], [1, 2, -22], [1, 2, 22], [0, 3], [1, 3], [2, 3]], kb: 1 }];
  W.euler = function (host) {
    host.innerHTML = '<div class="mp-figs">' + FIGS.map(function (f, i) {
      var deg = f.p.map(function () { return 0 }); f.e.forEach(function (e) { deg[e[0]]++; deg[e[1]]++ });
      var s = '<svg class="mp-fig" viewBox="0 0 180 165" role="img" aria-label="' + f.nm + '">';
      if (f.kb) s += '<path d="M0 50 Q90 70 180 45 L180 122 Q90 100 0 125 Z" class="mp-river"/>';
      f.e.forEach(function (e) {
        var a = f.p[e[0]], b = f.p[e[1]];
        if (e[2]) { var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy); s += '<path d="M' + a + ' Q' + (mx - dy / L * e[2] * 2) + ',' + (my + dx / L * e[2] * 2) + ' ' + b + '" class="mp-edge"/>' }
        else s += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + b[0] + '" y2="' + b[1] + '" class="mp-edge"/>';
      });
      f.p.forEach(function (q, k) { s += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="7" class="mp-node" data-k="' + k + '"/><text x="' + q[0] + '" y="' + (q[1] + 4) + '" class="mp-deg" text-anchor="middle">' + deg[k] + '</text>' });
      s += '</svg>';
      f.odd = deg.filter(function (d) { return d % 2 }).length;
      return '<div class="mp-card mp-ef" data-i="' + i + '"><b>' + (i + 1) + '. ' + f.nm + '</b>' + s + '<p class="mp-row"><button type="button" class="mp-btn" data-a="1">✏️ 할 수 있다</button><button type="button" class="mp-btn" data-a="0">🚫 할 수 없다</button></p><p class="mp-msg"></p></div>';
    }).join('') + '</div>';
    host.querySelectorAll('.mp-ef').forEach(function (c) {
      var f = FIGS[+c.dataset.i], can = f.odd === 0 || f.odd === 2;
      c.onclick = function (e) {
        var b = e.target.closest('[data-a]'); if (!b) return;
        c.classList.add('mp-show');
        var why = '홀수점(이어진 선이 홀수인 점)이 <b>' + f.odd + '개</b>예요. ' + (can ? (f.odd ? '홀수점 하나에서 시작해 다른 홀수점에서 끝나면 돼요.' : '어디서 시작해도 제자리로 돌아와요.') : '홀수점이 0개나 2개가 아니면 한붓그리기를 할 수 없어요.');
        say(c.querySelector('.mp-msg'), ((b.dataset.a === '1') === can ? '⭕ 맞아요! ' : '❌ 아쉬워요. ') + why, (b.dataset.a === '1') === can ? 'ok' : 'bad');
      };
    });
  };
  /* ── 소피 제르맹 소수 ── */
  W.multi = function (host, A) {
    var on = {};
    host.innerHTML = '<p class="mp-chips">' + A.nums.map(function (n) { return '<button type="button" class="mp-chip mp-big1" data-n="' + n + '" aria-pressed="false">' + n + '</button>' }).join('') + '</p><p class="mp-row"><button type="button" class="mp-btn mp-go">확인하기</button></p><div class="mp-why"></div><p class="mp-msg" aria-live="polite"></p>';
    host.querySelectorAll('.mp-chip').forEach(function (b) { b.onclick = function () { var n = +b.dataset.n; on[n] = !on[n]; b.setAttribute('aria-pressed', on[n] ? 'true' : 'false') } });
    host.querySelector('.mp-go').onclick = function () {
      var right = A.nums.every(function (n) { return !!on[n] === (A.ok.indexOf(n) >= 0) });
      host.querySelector('.mp-why').innerHTML = '<ul>' + A.nums.map(function (n) { var q = 2 * n + 1, p = isPrime(q); return '<li class="' + (p ? 'mp-yes' : 'mp-no') + '">' + n + ' → 2 × ' + n + ' + 1 = <b>' + q + '</b> ' + (p ? '소수 ✔' : '소수 아님 (' + (function () { for (var d = 2; d < q; d++) if (q % d === 0) return d + ' × ' + q / d })() + ')') + '</li>' }).join('') + '</ul>';
      say(host.querySelector('.mp-msg'), right ? '🎉 모두 맞아요! 소피 제르맹 소수는 ' + A.ok.join(', ') + '예요.' : '표를 보고 다시 골라 보세요. 2 × p + 1이 소수인 것만 골라요.', right ? 'ok' : 'bad');
    };
  };
  /* ── 가우스: 짝지어 더하기 ── */
  W.gauss = function (host) {
    host.innerHTML = '<p class="mp-row">1부터 <input type="range" min="4" max="20" value="10" class="mp-range" aria-label="끝 수"> <b class="mp-gn">10</b>까지</p><div class="mp-pairs"></div><p class="mp-gsum"></p>'
      + '<div class="mp-card"><p class="mp-q">이제 직접 해 보세요!</p>' + [[10, 55], [50, 1275], [100, 5050]].map(function (q) { return '<p class="mp-row">1부터 ' + q[0] + '까지의 합 = ' + numIn('', 5).replace('class="mp-in ', 'data-v="' + q[1] + '" class="mp-in ') + '</p>' }).join('') + '<p class="mp-msg" aria-live="polite"></p></div>';
    var rg = host.querySelector('.mp-range');
    function draw() {
      var n = +rg.value, h = '<div class="mp-pr">'; host.querySelector('.mp-gn').textContent = n;
      for (var i = 1; i <= n; i++) h += '<span>' + i + '</span>'; h += '</div><div class="mp-pr mp-rev">';
      for (i = n; i >= 1; i--) h += '<span>' + i + '</span>'; h += '</div><div class="mp-pr mp-sum">';
      for (i = 1; i <= n; i++) h += '<span>' + (n + 1) + '</span>'; host.querySelector('.mp-pairs').innerHTML = h + '</div>';
      host.querySelector('.mp-gsum').innerHTML = '위아래를 더하면 모두 <b>' + (n + 1) + '</b>, 그런 칸이 <b>' + n + '</b>개 → ' + (n + 1) + ' × ' + n + ' = ' + (n + 1) * n + '. 그런데 1부터 ' + n + '까지를 <b>두 번</b> 더했으니 ÷ 2 → <b>' + (n + 1) * n / 2 + '</b>';
    }
    rg.oninput = draw; draw();
    var ins = host.querySelectorAll('.mp-card input'), m = host.querySelector('.mp-card .mp-msg');
    ins.forEach(function (inp) { onNum(inp, function () { var v = +inp.dataset.v; inp.classList.toggle('mp-good', +inp.value === v); inp.classList.toggle('mp-badin', inp.value.length >= String(v).length && +inp.value !== v); if ([].every.call(ins, function (x) { return +x.value === +x.dataset.v })) say(m, '🎉 가우스처럼 해냈어요! 1부터 100까지는 101 × 100 ÷ 2 = 5050.', 'ok') }) });
  };
  /* ── 러브레이스: 로봇 명령 ── */
  var RB = [{ s: [0, 4], g: [4, 4], rock: [[2, 4], [2, 3]] }, { s: [0, 0], g: [4, 4], rock: [[1, 1], [2, 2], [3, 3], [1, 3], [3, 1]] }, { s: [0, 4], g: [4, 0], rock: [[1, 4], [1, 3], [1, 2], [3, 0], [3, 1], [3, 2]] }];
  W.robot = function (host) {
    var lv = 0, cmds = [], pos, busy = false, D = { '↑': [0, -1], '↓': [0, 1], '←': [-1, 0], '→': [1, 0] };
    host.innerHTML = '<p class="mp-chips mp-rlv">' + RB.map(function (_, i) { return '<button type="button" class="mp-chip" data-l="' + i + '">' + (i + 1) + '단계</button>' }).join('') + '</p><div class="mp-rob"><div class="mp-rgrid"></div><div class="mp-rside"><p class="mp-cmds" aria-label="명령 차례"></p>'
      + '<p class="mp-row">' + Object.keys(D).map(function (k) { return '<button type="button" class="mp-btn mp-arr" data-c="' + k + '">' + k + '</button>' }).join('') + '</p><p class="mp-row"><button type="button" class="mp-btn mp-back">한 개 지우기</button><button type="button" class="mp-btn mp-clr">모두 지우기</button><button type="button" class="mp-btn mp-run">▶ 실행</button></p><p class="mp-msg" aria-live="polite"></p></div></div>';
    var g = host.querySelector('.mp-rgrid'), m = host.querySelector('.mp-msg');
    function isRock(x, y) { return RB[lv].rock.some(function (r) { return r[0] === x && r[1] === y }) }
    function paint() {
      var L = RB[lv], h = '';
      for (var y = 0; y < 5; y++) for (var x = 0; x < 5; x++) h += '<span class="mp-rc">' + (pos[0] === x && pos[1] === y ? '🤖' : L.g[0] === x && L.g[1] === y ? '⭐' : isRock(x, y) ? '🪨' : '') + '</span>';
      g.innerHTML = h; host.querySelector('.mp-cmds').innerHTML = cmds.length ? cmds.map(function (c, i) { return '<span>' + (i + 1) + '. ' + c + '</span>' }).join('') : '<small>명령을 넣어 주세요</small>';
      host.querySelectorAll('.mp-rlv .mp-chip').forEach(function (b, i) { b.setAttribute('aria-pressed', i === lv ? 'true' : 'false') });
    }
    function setLv(i) { lv = i; cmds = []; pos = RB[lv].s.slice(); paint(); say(m, '로봇(🤖)을 별(⭐)까지! 바위(🪨)와 판 밖은 갈 수 없어요.') }
    host.onclick = function (e) {
      if (busy) return; var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.l) setLv(+b.dataset.l);
      else if (b.dataset.c) { if (cmds.length < 20) cmds.push(b.dataset.c); pos = RB[lv].s.slice(); paint() }
      else if (b.classList.contains('mp-back')) { cmds.pop(); paint() }
      else if (b.classList.contains('mp-clr')) { cmds = []; pos = RB[lv].s.slice(); paint() }
      else if (b.classList.contains('mp-run')) {
        if (!cmds.length) return say(m, '먼저 명령을 넣어 주세요.', 'bad');
        busy = true; pos = RB[lv].s.slice(); paint(); var i = 0;
        (function go() {
          if (i >= cmds.length) { busy = false; var ok = pos[0] === RB[lv].g[0] && pos[1] === RB[lv].g[1]; return say(m, ok ? '🎉 별에 도착했어요! 명령 ' + cmds.length + '개로 해냈어요.' + (lv < RB.length - 1 ? ' 다음 단계도 해 보세요.' : ' 모든 단계를 마쳤어요!') : '명령이 끝났는데 별에 닿지 못했어요. 차례를 고쳐 보세요.', ok ? 'ok' : 'bad') }
          var d = D[cmds[i]], nx = pos[0] + d[0], ny = pos[1] + d[1];
          if (nx < 0 || ny < 0 || nx > 4 || ny > 4 || isRock(nx, ny)) { busy = false; return say(m, (i + 1) + '번째 명령(' + cmds[i] + ')에서 ' + (isRock(nx, ny) ? '바위에 막혔어요.' : '판 밖으로 나가려 했어요.') + ' 명령을 고쳐 보세요.', 'bad') }
          pos = [nx, ny]; i++; paint(); setTimeout(go, 380);
        })();
      }
    };
    setLv(0);
  };
  /* ── 라마누잔: 1729 ── */
  W.cubes = function (host) {
    var pick = [], found = {};
    host.innerHTML = '<p class="mp-chips mp-cube">' + Array.from({ length: 12 }, function (_, i) { var n = i + 1; return '<button type="button" class="mp-chip" data-n="' + n + '"><b>' + n + '</b><small>' + n + '×' + n + '×' + n + ' = ' + n * n * n + '</small></button>' }).join('') + '</p><p class="mp-row mp-csum">두 수를 골라 보세요.</p><p class="mp-msg" aria-live="polite"></p>';
    var m = host.querySelector('.mp-msg'), sm = host.querySelector('.mp-csum');
    host.querySelectorAll('.mp-chip').forEach(function (b) {
      b.onclick = function () {
        var n = +b.dataset.n; pick.push(n); if (pick.length > 2) pick.shift();
        host.querySelectorAll('.mp-chip').forEach(function (c) { c.setAttribute('aria-pressed', pick.indexOf(+c.dataset.n) >= 0 ? 'true' : 'false') });
        if (pick.length < 2) return; var a = pick[0], c = pick[1], s = a * a * a + c * c * c;
        sm.innerHTML = a * a * a + ' + ' + c * c * c + ' = <b>' + s + '</b>';
        if (s === 1729 && a !== c) { found[Math.min(a, c)] = 1; var k = Object.keys(found).length; say(m, k >= 2 ? '🎉 두 가지를 모두 찾았어요! 1729 = 1³ + 12³ = 9³ + 10³. 라마누잔은 이런 수 중 1729가 가장 작다는 것을 바로 알았대요.' : '⭕ 1729를 만들었어요! 다른 짝도 하나 더 있어요.', 'ok') }
        else say(m, s > 1729 ? '1729보다 커요. 더 작은 수를 골라 보세요.' : '1729보다 작아요.', '');
      };
    });
  };
  /* ── 미르자하니: 당구공 ── */
  var TB = [[3, 2], [4, 3], [5, 2], [4, 2], [5, 3], [6, 4]];
  W.billiard = function (host) {
    var t = 0, busy = false, CN = { tr: '오른쪽 위', br: '오른쪽 아래', tl: '왼쪽 위' };
    host.innerHTML = '<p class="mp-chips mp-tbs">' + TB.map(function (w, i) { return '<button type="button" class="mp-chip" data-t="' + i + '">' + w[0] + ' × ' + w[1] + '</button>' }).join('') + '</p><svg class="mp-fig mp-bil" role="img" aria-label="당구대"></svg>'
      + '<p class="mp-row">' + Object.keys(CN).map(function (k) { return '<button type="button" class="mp-btn" data-c="' + k + '">' + CN[k] + '</button>' }).join('') + '</p><p class="mp-msg" aria-live="polite"></p><details class="mp-rule"><summary>규칙 보기</summary>가로·세로 칸 수를 같은 수로 나눌 수 있을 만큼 나눠요(예: 4 × 2 → 2 × 1). 그다음 <b>둘 다 홀수</b>면 오른쪽 위, <b>가로가 짝수</b>면 오른쪽 아래, <b>세로가 짝수</b>면 왼쪽 위 구멍으로 들어가요.</details>';
    var svg = host.querySelector('svg'), m = host.querySelector('.mp-msg');
    function path(w, h) { var x = 0, y = 0, dx = 1, dy = 1, pts = [[0, 0]]; for (var i = 0; i < 200; i++) { x += dx; y += dy; if ((x === 0 || x === w) && (y === 0 || y === h)) { pts.push([x, y]); break } if (x === 0 || x === w) { dx = -dx; pts.push([x, y]) } if (y === 0 || y === h) { dy = -dy; pts.push([x, y]) } } return pts }
    function end(w, h) { var p = path(w, h), e = p[p.length - 1]; return e[0] === w ? (e[1] === h ? 'tr' : 'br') : 'tl' }
    function draw(k) {
      var w = TB[t][0], h = TB[t][1], s = Math.min(60, 360 / w), W2 = w * s + 40, H2 = h * s + 40, b = '';
      svg.setAttribute('viewBox', '0 0 ' + W2 + ' ' + H2); svg.style.maxWidth = W2 + 'px';
      b += '<rect x="20" y="20" width="' + w * s + '" height="' + h * s + '" class="mp-felt"/>';
      for (var i = 1; i < w; i++) b += '<line x1="' + (20 + i * s) + '" y1="20" x2="' + (20 + i * s) + '" y2="' + (20 + h * s) + '" class="mp-gl"/>';
      for (i = 1; i < h; i++) b += '<line x1="20" y1="' + (20 + i * s) + '" x2="' + (20 + w * s) + '" y2="' + (20 + i * s) + '" class="mp-gl"/>';
      [[0, 0], [w, 0], [0, h], [w, h]].forEach(function (c) { b += '<circle cx="' + (20 + c[0] * s) + '" cy="' + (20 + (h - c[1]) * s) + '" r="9" class="mp-hole"/>' });
      if (k) { var p = path(w, h).slice(0, k); b += '<polyline points="' + p.map(function (q) { return (20 + q[0] * s) + ',' + (20 + (h - q[1]) * s) }).join(' ') + '" class="mp-ball-path"/>'; var q = p[p.length - 1]; b += '<circle cx="' + (20 + q[0] * s) + '" cy="' + (20 + (h - q[1]) * s) + '" r="7" class="mp-ball"/>' }
      else b += '<circle cx="20" cy="' + (20 + h * s) + '" r="7" class="mp-ball"/>';
      svg.innerHTML = b;
      host.querySelectorAll('.mp-tbs .mp-chip').forEach(function (c, i) { c.setAttribute('aria-pressed', i === t ? 'true' : 'false') });
    }
    host.onclick = function (e) {
      if (busy) return; var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.t) { t = +b.dataset.t; draw(0); say(m, '공은 왼쪽 아래 구석에서 출발해요. 어느 구멍에 들어갈까요?') }
      else if (b.dataset.c) {
        var w = TB[t][0], h = TB[t][1], p = path(w, h), k = 1, guess = b.dataset.c; busy = true;
        (function go() { k++; draw(k); if (k < p.length) return setTimeout(go, 260); busy = false; var ans = end(w, h); say(m, (guess === ans ? '⭕ 맞아요! ' : '❌ 아쉬워요. ') + CN[ans] + ' 구멍으로 들어갔어요. 다른 당구대도 해 보고 규칙을 찾아보세요.', guess === ans ? 'ok' : 'bad') })();
      }
    };
    draw(0); say(m, '공은 왼쪽 아래 구석에서 출발해요. 어느 구멍에 들어갈까요?');
  };
  /* ── 허준이: 색칠 방법 세기 ── */
  W.color = function (host) {
    var C = [['r', '빨강', '#E5534B'], ['b', '파랑', '#3B82D6'], ['y', '노랑', '#E0B21A']], cur = ['', '', ''], pen = 'r', found = [];
    host.innerHTML = '<p class="mp-chips mp-pal">' + C.map(function (c) { return '<button type="button" class="mp-chip" data-p="' + c[0] + '"><i style="background:' + c[2] + '"></i>' + c[1] + '</button>' }).join('') + '</p><div class="mp-strip"></div>'
      + '<p class="mp-row"><button type="button" class="mp-btn mp-save">이 방법 모으기</button><button type="button" class="mp-btn mp-clr">지우기</button></p><p class="mp-msg" aria-live="polite"></p><p class="mp-found-t">모은 방법 <b>0</b> / 12</p><div class="mp-found"></div>';
    var m = host.querySelector('.mp-msg'), col = function (k) { return (C.filter(function (c) { return c[0] === k })[0] || [0, 0, 'transparent'])[2] };
    function paint() {
      host.querySelector('.mp-strip').innerHTML = cur.map(function (k, i) { return '<button type="button" class="mp-cell" data-i="' + i + '" style="background:' + col(k) + '" aria-label="' + (i + 1) + '번 칸">' + (k ? '' : (i + 1)) + '</button>' }).join('');
      host.querySelectorAll('.mp-pal .mp-chip').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.p === pen ? 'true' : 'false') });
      host.querySelector('.mp-found-t b').textContent = found.length;
      host.querySelector('.mp-found').innerHTML = found.map(function (f) { return '<span class="mp-mini">' + f.split('').map(function (k) { return '<i style="background:' + col(k) + '"></i>' }).join('') + '</span>' }).join('');
    }
    host.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.p) { pen = b.dataset.p; paint() }
      else if (b.dataset.i) { cur[+b.dataset.i] = pen; paint() }
      else if (b.classList.contains('mp-clr')) { cur = ['', '', '']; paint(); say(m, '') }
      else if (b.classList.contains('mp-save')) {
        if (cur.indexOf('') >= 0) return say(m, '세 칸을 모두 칠해 주세요.', 'bad');
        if (cur[0] === cur[1] || cur[1] === cur[2]) return say(m, '붙어 있는 칸끼리 같은 색이에요. 다르게 칠해요!', 'bad');
        var k = cur.join(''); if (found.indexOf(k) >= 0) return say(m, '이미 모은 방법이에요. 다른 방법을 찾아보세요.', 'bad');
        found.push(k); cur = ['', '', '']; paint();
        say(m, found.length >= 12 ? '🎉 12가지를 모두 찾았어요! 첫 칸 3가지 × 둘째 칸 2가지(첫 칸과 다른 색) × 셋째 칸 2가지(둘째 칸과 다른 색) = 12. 허준이는 이런 ‘색칠 방법의 수’에 숨은 규칙을 증명했어요.' : '⭕ 새 방법! (' + found.length + '가지)', 'ok');
      }
    };
    paint();
  };

  /* ── 확인 문제 ── */
  function quiz() {
    var host = $('mpQuiz'), right = {};
    host.innerHTML = P.quiz.map(function (q, i) {
      return '<div class="mp-card mp-qz" data-i="' + i + '"><p class="mp-q"><b>' + (i + 1) + '.</b> ' + esc(q[0]) + '</p><p class="mp-opts">' + q[1].map(function (o, k) { return '<button type="button" class="mp-opt" data-k="' + k + '">' + '①②③④'[k] + ' ' + esc(o) + '</button>' }).join('') + '</p><p class="mp-msg" aria-live="polite"></p></div>';
    }).join('') + '<p class="mp-score" aria-live="polite"></p>';
    host.querySelectorAll('.mp-qz').forEach(function (c) {
      var q = P.quiz[+c.dataset.i];
      c.onclick = function (e) {
        var b = e.target.closest('.mp-opt'); if (!b) return; var k = +b.dataset.k, ok = k === q[2];
        c.querySelectorAll('.mp-opt').forEach(function (x) { x.classList.remove('mp-pick', 'mp-wrong') }); b.classList.add(ok ? 'mp-pick' : 'mp-wrong');
        say(c.querySelector('.mp-msg'), (ok ? '⭕ 맞아요! ' : '❌ 다시 골라 보세요. ') + (ok ? esc(q[3]) : ''), ok ? 'ok' : 'bad');
        if (ok) right[c.dataset.i] = 1;
        var n = Object.keys(right).length; host.querySelector('.mp-score').textContent = n === P.quiz.length ? '🎉 ' + n + '문제를 모두 맞혔어요!' : '';
      };
    });
  }
  /* ── 인쇄(읽기 자료 + 확인 문제) ── */
  $('mpPrint').onclick = function () { document.documentElement.classList.add('mp-printing'); setTimeout(function () { window.print(); setTimeout(function () { document.documentElement.classList.remove('mp-printing') }, 500) }, 60) };

  var A = P.act; $('mpActT').textContent = A.title; $('mpActI').innerHTML = A.intro;
  (W[A.w] || function () { })( $('mpAct'), A);
  quiz();
  var tl = document.querySelector('.tolist'); if (tl && (location.protocol === 'file:' || /github\.io$/.test(location.hostname) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname))) tl.classList.add('on');
})();
