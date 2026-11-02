/* 스도쿠: 문제 고르기 → 풀기(번호판·메모·되돌리기·힌트) · 진행 상황은 이 기기(localStorage)에만 저장 */
(function () {
  var D = SD, n = D.n, bh = D.bh, bw = D.bw, N = n * n, G = D.g, $ = function (i) { return document.getElementById(i) };
  var KEY = 'hj-sudoku-v1', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { st = {} }
  st[G] = st[G] || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) { } }
  var peers = [];
  for (var i = 0; i < N; i++) {
    var r = Math.floor(i / n), c = i % n, s = {};
    for (var k = 0; k < n; k++) { s[r * n + k] = 1; s[k * n + c] = 1 }
    var r0 = r - r % bh, c0 = c - c % bw;
    for (var a = 0; a < bh; a++) for (var b = 0; b < bw; b++) s[(r0 + a) * n + c0 + b] = 1;
    delete s[i]; peers.push(Object.keys(s).map(Number));
  }
  function fmt(t) { t = Math.floor(t / 1000); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2) }

  /* 문제 목록 */
  function list() {
    var done = 0, h = '';
    D.p.forEach(function (p, q) {
      var rec = st[G][q] || {}, givens = p.replace(/0/g, '').length;
      if (rec.done) done++;
      h += '<button type="button" class="sd-q' + (rec.done ? ' done' : rec.v ? ' go' : '') + '" data-q="' + q + '"><b>' + (q + 1) + '</b><small>' +
        (rec.done ? fmt(rec.t) : rec.v ? '이어서 풀기' : (q < 10 ? '쉬움' : q < 20 ? '보통' : '도전')) + '</small></button>';
    });
    $('sdList').innerHTML = h;
    $('sdProg').textContent = '다 푼 문제 ' + done + ' / ' + D.p.length;
  }

  var q = -1, giv, sol, v, memo, hist, sel = -1, memoOn = false, t0 = 0, acc = 0, tick = null, fin = false;
  var board = $('sdBoard'); board.style.setProperty('--n', n);
  var pad = $('sdPad'), ph = '';
  for (var d = 1; d <= n; d++) ph += '<button type="button" data-d="' + d + '" aria-label="' + d + ' 넣기">' + d + '</button>';
  ph += '<button type="button" class="er" data-d="0" aria-label="지우기">지우개</button>';
  pad.innerHTML = ph; pad.style.setProperty('--pc', n === 9 ? 4 : n === 6 ? 4 : 3); pad.style.setProperty('--pm', n === 9 ? 5 : n === 6 ? 4 : 5);

  function open(k) {
    q = k; var rec = st[G][k] || {};
    giv = D.p[k].split('').map(Number); sol = D.s[k].split('').map(Number);
    v = rec.v ? rec.v.split('').map(Number) : giv.slice();
    memo = rec.m || {}; hist = []; sel = -1; fin = !!rec.done; acc = rec.t || 0;
    $('sdTitle').textContent = G + '학년 · ' + (k + 1) + '번 (' + n + '×' + n + ')';
    $('sdPick').hidden = true; $('sdPlay').hidden = false; $('sdDone').hidden = true; $('sdMsg').textContent = '';
    if (fin) { v = sol.slice(); showDone() }
    startClock(); draw();
    history.replaceState(null, '', '#' + (k + 1)); window.scrollTo(0, 0);
  }
  function startClock() {
    clearInterval(tick); t0 = Date.now();
    tick = setInterval(function () { if (!fin) $('sdTime').textContent = fmt(acc + Date.now() - t0) }, 500);
    $('sdTime').textContent = fmt(acc);
  }
  function elapsed() { return acc + (fin ? 0 : Date.now() - t0) }
  function persist() {
    var rec = st[G][q] || {};
    if (!fin) { rec.v = v.join(''); rec.m = memo; rec.t = elapsed() }
    st[G][q] = rec; save();
  }
  function close() {
    if (q >= 0 && !fin) persist();
    clearInterval(tick); q = -1;
    $('sdPlay').hidden = true; $('sdPick').hidden = false; list();
    history.replaceState(null, '', location.pathname + location.search);
  }
  function bad(i) { if (!v[i]) return false; for (var j = 0; j < peers[i].length; j++) if (v[peers[i][j]] === v[i]) return true; return false }
  function draw() {
    var h = '', sv = sel >= 0 ? v[sel] : 0, pk = sel >= 0 ? peers[sel] : [];
    for (var i = 0; i < N; i++) {
      var r = Math.floor(i / n), c = i % n, cls = 'sd-c';
      if (giv[i]) cls += ' g';
      if (c % bw === bw - 1 && c < n - 1) cls += ' br';
      if (r % bh === bh - 1 && r < n - 1) cls += ' bb';
      if (i === sel) cls += ' sel'; else if (sv && v[i] === sv) cls += ' same'; else if (pk.indexOf(i) >= 0) cls += ' hl';
      if (!giv[i] && bad(i)) cls += ' bad';
      var inner = v[i] ? v[i] : '';
      if (!v[i] && memo[i] && memo[i].length) {
        var cols = n === 4 ? 2 : 3, m = '<span class="sd-memo" style="grid-template-columns:repeat(' + cols + ',1fr)">';
        for (var d = 1; d <= n; d++) m += '<span>' + (memo[i].indexOf(d) >= 0 ? d : '') + '</span>';
        inner = m + '</span>';
      }
      h += '<button type="button" class="' + cls + '" data-i="' + i + '" role="gridcell" aria-label="' + (r + 1) + '행 ' + (c + 1) + '열 ' + (v[i] ? v[i] + (giv[i] ? ' (처음부터 있는 수)' : '') : '빈칸') + '">' + inner + '</button>';
    }
    board.innerHTML = h;
    pad.querySelectorAll('[data-d]').forEach(function (b) {
      var d = +b.dataset.d; if (!d) return;
      var cnt = v.filter(function (x) { return x === d }).length; b.classList.toggle('full', cnt >= n);
    });
  }
  function put(d) {
    if (sel < 0 || giv[sel] || fin) { if (sel < 0) say('먼저 빈칸을 눌러 골라요.'); return }
    if (memoOn && d) {
      hist.push([sel, v[sel], (memo[sel] || []).slice()]);
      var m = memo[sel] = (memo[sel] || []).slice(), at = m.indexOf(d);
      if (at >= 0) m.splice(at, 1); else m.push(d);
      draw(); persist(); return;
    }
    hist.push([sel, v[sel], (memo[sel] || []).slice()]);
    v[sel] = d; if (d) delete memo[sel];
    if (d) peers[sel].forEach(function (p) { if (memo[p]) memo[p] = memo[p].filter(function (x) { return x !== d }) });
    say(d && bad(sel) ? '같은 줄이나 굵은 칸에 똑같은 수(' + d + ')가 벌써 있어요.' : '');
    draw(); persist(); check();
  }
  function check() {
    if (v.indexOf(0) >= 0) return;
    for (var i = 0; i < N; i++) if (v[i] !== sol[i]) { say('모든 칸을 채웠지만 빨간 동그라미가 있거나 틀린 곳이 있어요. 다시 살펴봐요!'); return }
    acc = elapsed(); fin = true;
    st[G][q] = { done: 1, t: acc }; save(); showDone(); draw();
  }
  function showDone() {
    $('sdDone').hidden = false; $('sdDoneT').textContent = '걸린 시간 ' + fmt(st[G][q] ? st[G][q].t || acc : acc);
    $('sdNext').hidden = q >= D.p.length - 1; $('sdTime').textContent = fmt(acc);
  }
  function say(t) { $('sdMsg').textContent = t }

  board.addEventListener('click', function (e) { var c = e.target.closest('.sd-c'); if (!c) return; sel = +c.dataset.i; draw(); });
  pad.addEventListener('click', function (e) { var b = e.target.closest('[data-d]'); if (b) put(+b.dataset.d) });
  $('sdList').addEventListener('click', function (e) { var b = e.target.closest('.sd-q'); if (b) open(+b.dataset.q) });
  $('sdMemo').onclick = function () { memoOn = !memoOn; this.setAttribute('aria-pressed', memoOn); say(memoOn ? '메모 켜짐: 들어갈 수 있는 수를 작게 적어 둬요.' : '') };
  $('sdUndo').onclick = function () {
    var h = hist.pop(); if (!h || fin) return;
    v[h[0]] = h[1]; if (h[2].length) memo[h[0]] = h[2]; else delete memo[h[0]];
    sel = h[0]; draw(); persist();
  };
  $('sdHint').onclick = function () {
    if (fin) return;
    var i = sel >= 0 && !giv[sel] && v[sel] !== sol[sel] ? sel : -1;
    if (i < 0) for (var k = 0; k < N; k++) if (v[k] !== sol[k]) { i = k; break }
    if (i < 0) return;
    hist.push([i, v[i], (memo[i] || []).slice()]); v[i] = sol[i]; delete memo[i]; sel = i;
    draw(); var c = board.querySelector('[data-i="' + i + '"]'); if (c) c.classList.add('hint');
    say('힌트: ' + (Math.floor(i / n) + 1) + '행 ' + (i % n + 1) + '열의 답은 ' + sol[i] + '예요. 왜 그 수인지 생각해 봐요!');
    persist(); check();
  };
  $('sdReset').onclick = function () {
    if (!confirm('이 문제를 처음부터 다시 풀까요?')) return;
    v = giv.slice(); memo = {}; hist = []; fin = false; acc = 0; delete st[G][q]; save();
    $('sdDone').hidden = true; say(''); startClock(); draw();
  };
  $('sdAns').onclick = function () {
    if (!confirm('정답을 모두 보여 줄까요? (선생님 확인용)')) return;
    v = sol.slice(); memo = {}; fin = true; acc = elapsed(); draw(); say('정답을 보여 주었어요. "처음부터"를 누르면 다시 풀 수 있어요.');
  };
  $('sdPrint').onclick = function () { window.print() };
  $('sdNext').onclick = function () { if (q < D.p.length - 1) open(q + 1) };
  $('sdBack').onclick = close; $('sdBack2').onclick = close;
  document.addEventListener('keydown', function (e) {
    if (q < 0 || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    var k = e.key;
    if (/^[1-9]$/.test(k) && +k <= n) { e.preventDefault(); put(+k) }
    else if (k === 'Backspace' || k === 'Delete' || k === '0') { e.preventDefault(); put(0) }
    else if (/^Arrow/.test(k)) {
      e.preventDefault(); if (sel < 0) sel = 0;
      var r = Math.floor(sel / n), c = sel % n;
      if (k === 'ArrowUp') r = (r + n - 1) % n; if (k === 'ArrowDown') r = (r + 1) % n;
      if (k === 'ArrowLeft') c = (c + n - 1) % n; if (k === 'ArrowRight') c = (c + 1) % n;
      sel = r * n + c; draw(); var b = board.querySelector('.sel'); if (b) b.focus();
    } else if (k === 'Escape') close();
  });
  window.addEventListener('pagehide', function () { if (q >= 0 && !fin) persist() });
  list();
  function fromHash() { var h = parseInt(location.hash.slice(1), 10); if (h >= 1 && h <= D.p.length && h - 1 !== q) open(h - 1) }
  window.addEventListener('hashchange', fromHash);
  fromHash();
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
