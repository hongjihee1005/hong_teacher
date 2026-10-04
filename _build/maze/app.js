/* 미로찾기: 고르기 → 출발 칸에서 길 그리기(끌기·누르기·방향키) → 도착 · 기록은 이 기기(localStorage)에만 */
(function () {
  var G = MZG, S = MZ.specs(G), $ = function (i) { return document.getElementById(i) };
  var KEY = 'hj-maze-v2', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { st = {} }
  st[G] = st[G] || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) { } }
  function fmt(t) { t = Math.floor(t / 1000); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2) }
  function ask(s) {
    if (s.k === 'rule') return MZ.RULES[s.rule].name + '. 초록 칸에서 출발해 분홍 칸까지 가요.';
    if (s.geo === 'circ') return '가운데 ' + s.th[0] + '에서 출발해 미로 밖 ' + s.th[1] + '까지 나가요.';
    return s.th[0] + ' 에서 출발해 ' + s.th[1] + ' 까지 가는 길을 찾아요.';
  }
  function list() {
    var h = '', done = 0, LV = [['쉬움', '작은 벽 미로 · 쉬운 조건 미로'], ['보통', '모양·원형 미로 · 조금 큰 조건 미로'], ['도전', '큰 미로 · 헷갈리는 갈래가 있는 조건 미로']];
    for (var b = 0; b < 3; b++) {
      h += '<h3>' + LV[b][0] + ' <small>' + (b * 30 + 1) + '~' + (b * 30 + 30) + '번 · ' + LV[b][1] + '</small></h3><div class="mz-grid">';
      for (var i = b * 30; i < b * 30 + 30; i++) { var d = st[G][i]; if (d) done++; h += '<button type="button" class="mz-q' + (d ? ' done' : '') + '" data-q="' + i + '"><b>' + (i + 1) + '</b><span>' + MZ.title(S[i]) + (d ? ' · ' + fmt(d.t) : '') + '</span></button>' }
      h += '</div>';
    }
    $('mzList').innerHTML = h; $('mzProg').textContent = '도착한 미로 ' + done + ' / ' + S.length;
  }
  var q = -1, m, trail, err, t0, tick, fin, cs, ans = false;
  function open(k) {
    q = k; m = MZ.make(S[k]); trail = [m.s]; err = 0; fin = false; ans = false;
    cs = Math.sqrt(368 * 368 / m.G.cells.length);
    $('mzTitle').textContent = G + '학년 · ' + (k + 1) + '번 ' + S[k].lv; $('mzAsk').textContent = ask(S[k]);
    $('mzBoard').innerHTML = MZ.svg(m); $('mzAns').setAttribute('aria-pressed', 'false');
    $('mzPick').hidden = true; $('mzPlay').hidden = false; $('mzDone').hidden = true; say('');
    $('mzPrev').disabled = k === 0; $('mzNext2').disabled = k === S.length - 1;
    clearInterval(tick); t0 = Date.now(); tick = setInterval(function () { if (!fin) $('mzTime').textContent = fmt(Date.now() - t0) }, 500); $('mzTime').textContent = '0:00';
    draw(); history.replaceState(null, '', '#' + (k + 1)); window.scrollTo(0, 0);
  }
  function close() { clearInterval(tick); q = -1; $('mzPlay').hidden = true; $('mzPick').hidden = false; list(); history.replaceState(null, '', location.pathname + location.search) }
  function draw() {
    var C = m.G.cells, g = $('mzBoard').querySelector('.mz-trail'), w = Math.max(5, cs * .34);
    var pts = trail.map(function (i) { return C[i].c[0].toFixed(1) + ',' + C[i].c[1].toFixed(1) }).join(' '), e = C[trail[trail.length - 1]].c;
    g.innerHTML = '<polyline points="' + pts + '" fill="none" stroke="' + getComputedStyle(document.documentElement).getPropertyValue('--acc') + '" stroke-width="' + w.toFixed(1) + '" stroke-linecap="round" stroke-linejoin="round" opacity=".8"/>' +
      '<circle cx="' + e[0].toFixed(1) + '" cy="' + e[1].toFixed(1) + '" r="' + (w * .85).toFixed(1) + '" fill="#fff" stroke="#2A221C" stroke-width="2.5"/>';
  }
  function bad(t) { err++; say(t, 1); var b = $('mzBoard'); b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake') }
  function step(x) {
    if (fin) return false;
    var end = trail[trail.length - 1];
    if (x === end) return false;
    if (trail.length > 1 && x === trail[trail.length - 2]) { trail.pop(); draw(); say(''); return true }
    var at = trail.indexOf(x); if (at >= 0) { trail = trail.slice(0, at + 1); draw(); return true }
    if (!MZ.link(m, end, x)) return false;
    if (m.kind === 'set' && !m.ok[x]) { bad('그 칸은 조건에 맞지 않아요. (' + MZ.RULES[m.rule].name + ')'); return false }
    if (m.kind === 'seq' && m.lab[x] !== m.seq[trail.length]) { bad('그 칸은 다음 차례가 아니에요. 규칙을 다시 살펴봐요!'); return false }
    trail.push(x); say(''); draw();
    if (x === m.g) win();
    return true;
  }
  function win() {
    fin = true; var t = Date.now() - t0; st[G][q] = { t: t, e: err }; save();
    $('mzDone').hidden = false; $('mzDoneT').textContent = '걸린 시간 ' + fmt(t) + (m.kind !== 'wall' ? ' · 실수 ' + err + '번' : '');
    $('mzNext').hidden = q >= S.length - 1;
  }
  function say(t, b) { $('mzMsg').textContent = t; $('mzMsg').classList.toggle('bad', !!b) }
  function cellAt(x, y) { var el = document.elementFromPoint(x, y); return el && el.closest && el.closest('.mz-c') ? +el.closest('.mz-c').dataset.c : -1 }
  var drag = false, board = $('mzBoard');
  board.addEventListener('pointerdown', function (e) {
    if (q < 0) return; var x = cellAt(e.clientX, e.clientY); if (x < 0) return;
    var end = trail[trail.length - 1];
    if (x === end || trail.indexOf(x) >= 0) { if (x !== end) step(x); drag = true }
    else if (step(x)) drag = true;
    else if (!fin && m.kind === 'wall') say('지금 있는 칸(흰 동그라미)에서 이어서 그려요.');
    if (drag) { try { board.setPointerCapture(e.pointerId) } catch (er) { } }
    e.preventDefault();
  });
  board.addEventListener('pointermove', function (e) { if (!drag) return; var x = cellAt(e.clientX, e.clientY); if (x >= 0) step(x) });
  ['pointerup', 'pointercancel'].forEach(function (t) { board.addEventListener(t, function () { drag = false }) });
  document.addEventListener('keydown', function (e) {
    if (q < 0) return;
    var dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key];
    if (e.key === 'Escape') { close(); return }
    if (!dir) return; e.preventDefault();
    var end = trail[trail.length - 1], c = m.G.cells[end].c, best = -1, bv = .45;
    MZ.neighbors(m, end).forEach(function (y) { var d = m.G.cells[y].c, vx = d[0] - c[0], vy = d[1] - c[1], l = Math.hypot(vx, vy), v = (vx * dir[0] + vy * dir[1]) / l; if (v > bv && (MZ.link(m, end, y) || y === trail[trail.length - 2])) { bv = v; best = y } });
    if (best >= 0) step(best);
  });
  $('mzUndo').onclick = function () { if (fin || trail.length < 2) return; trail.pop(); draw(); say('') };
  $('mzReset').onclick = function () { trail = [m.s]; fin = false; $('mzDone').hidden = true; t0 = Date.now(); err = 0; draw(); say('') };
  $('mzAns').onclick = function () {
    if (!ans && !confirm('정답 길을 보여 줄까요?')) return;
    ans = !ans; this.setAttribute('aria-pressed', ans); board.querySelector('.mz-sol').style.display = ans ? '' : 'none';
  };
  $('mzPrint').onclick = function () {
    $('mzSheet').innerHTML = '<p><b>' + G + '학년 미로찾기 ' + (q + 1) + '번</b> &nbsp; 이름: ____________</p><p>' + ask(S[q]) + '</p>' + MZ.svg(m);
    setTimeout(function () { window.print() }, 50);
  };
  $('mzNext').onclick = $('mzNext2').onclick = function () { if (q < S.length - 1) open(q + 1) };
  $('mzPrev').onclick = function () { if (q > 0) open(q - 1) };
  $('mzBack').onclick = $('mzBack2').onclick = close;
  $('mzList').addEventListener('click', function (e) { var b = e.target.closest('.mz-q'); if (b) open(+b.dataset.q) });
  list();
  function fromHash() { var h = parseInt(location.hash.slice(1), 10); if (h >= 1 && h <= S.length && h - 1 !== q) open(h - 1) }
  window.addEventListener('hashchange', fromHash); fromHash();
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
