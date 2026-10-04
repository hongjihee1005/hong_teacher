/* 숨은 그림 찾기: 고르기 → 그림을 눌러 물건 찾기 · 기록은 이 기기(localStorage)에만 */
(function () {
  var G = HPG, S = HP.specs(G), $ = function (i) { return document.getElementById(i) };
  var KEY = 'hj-hidden-v1', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { st = {} }
  st[G] = st[G] || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) { } }
  function fmt(t) { t = Math.floor(t / 1000); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2) }
  function list() {
    var h = '', done = 0, LV = [['쉬움', '물건이 크고 또렷해요'], ['보통', '물건이 배경과 겹치고 조금 기울어져요'], ['도전', '작고 빙글 돌아가 있고 무늬에 가려져요']];
    for (var b = 0; b < 3; b++) {
      h += '<h3>' + LV[b][0] + ' <small>' + (b * 30 + 1) + '~' + (b * 30 + 30) + '번 · ' + LV[b][1] + '</small></h3><div class="hp-grid">';
      for (var i = b * 30; i < b * 30 + 30; i++) { var d = st[G][i]; if (d) done++; h += '<button type="button" class="hp-q' + (d ? ' done' : '') + '" data-q="' + i + '"><b>' + (i + 1) + '</b><span>' + HP.title(S[i]) + ' · ' + S[i].n + '개' + (d ? ' · ' + fmt(d.t) : '') + '</span></button>' }
      h += '</div>';
    }
    $('hpList').innerHTML = h; $('hpProg').textContent = '다 찾은 그림 ' + done + ' / ' + S.length;
  }
  var q = -1, m, found, miss, t0, tick, fin, ans = false;
  function open(k) {
    q = k; m = HP.make(S[k]); found = {}; miss = 0; fin = false; ans = false;
    $('hpTitle').textContent = G + '학년 · ' + (k + 1) + '번 ' + S[k].lv;
    $('hpAsk').textContent = HP.SCENES[S[k].sc].name + ' 그림에 숨은 물건 ' + m.T.length + '개를 찾아 눌러요.';
    $('hpBoard').innerHTML = HP.svg(m); $('hpAns').setAttribute('aria-pressed', 'false');
    $('hpItems').innerHTML = m.T.map(function (t, i) { return '<span class="hp-it" data-i="' + i + '">' + HP.icon(t.k) + HP.ICONS[t.k][0] + '</span>' }).join('');
    $('hpPick').hidden = true; $('hpPlay').hidden = false; $('hpDone').hidden = true; say('');
    $('hpPrev').disabled = k === 0; $('hpNext2').disabled = k === S.length - 1;
    clearInterval(tick); t0 = Date.now(); tick = setInterval(function () { if (!fin) $('hpTime').textContent = fmt(Date.now() - t0) }, 500); $('hpTime').textContent = '0:00';
    count(); history.replaceState(null, '', '#' + (k + 1)); window.scrollTo(0, 0);
  }
  function count() { var n = Object.keys(found).length; $('hpCnt').textContent = '찾을 물건 (' + n + ' / ' + m.T.length + ')' }
  function close() { clearInterval(tick); q = -1; $('hpPlay').hidden = true; $('hpPick').hidden = false; list(); history.replaceState(null, '', location.pathname + location.search) }
  function mark(i) {
    var t = m.T[i], g = $('hpBoard').querySelector('.hp-marks'), ac = getComputedStyle(document.documentElement).getPropertyValue('--acc');
    g.insertAdjacentHTML('beforeend', '<circle cx="' + t.x.toFixed(1) + '" cy="' + t.y.toFixed(1) + '" r="' + (m.R + 6).toFixed(1) + '" fill="none" stroke="' + ac + '" stroke-width="4"/>');
  }
  function say(t, b) { $('hpMsg').textContent = t; $('hpMsg').classList.toggle('bad', !!b) }
  $('hpBoard').addEventListener('click', function (e) {
    if (q < 0 || fin) return;
    var svg = $('hpBoard').querySelector('svg'), pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    var p = pt.matrixTransform(svg.getScreenCTM().inverse()), i = HP.hit(m, p.x, p.y);
    if (i >= 0 && !found[i]) {
      found[i] = 1; mark(i); $('hpItems').querySelector('[data-i="' + i + '"]').classList.add('ok'); count();
      say(HP.ICONS[m.T[i].k][0] + '을(를) 찾았어요!'.replace('을(를)', /[가-힣]$/.test(HP.ICONS[m.T[i].k][0]) && (HP.ICONS[m.T[i].k][0].slice(-1).charCodeAt(0) - 0xAC00) % 28 ? '을' : '를'));
      if (Object.keys(found).length === m.T.length) win();
    } else if (i < 0) {
      miss++; say('거기에는 없어요. 다시 찾아봐요!', 1);
      var g = svg.querySelector('.hp-marks'); g.insertAdjacentHTML('beforeend', '<path class="hp-x" d="M' + (p.x - 7) + ' ' + (p.y - 7) + 'l14 14m0 -14l-14 14" stroke="#C6392F" stroke-width="3" stroke-linecap="round"/>');
      var x = g.lastChild; setTimeout(function () { if (x.parentNode) x.parentNode.removeChild(x) }, 700);
    }
  });
  function win() {
    fin = true; var t = Date.now() - t0; st[G][q] = { t: t, e: miss }; save();
    $('hpDone').hidden = false; $('hpDoneT').textContent = '걸린 시간 ' + fmt(t) + ' · 헛짚은 곳 ' + miss + '번'; $('hpNext').hidden = q >= S.length - 1;
  }
  $('hpHint').onclick = function () {
    if (fin) return; var left = m.T.map(function (t, i) { return i }).filter(function (i) { return !found[i] }); if (!left.length) return;
    var t = m.T[left[Math.floor(Math.random() * left.length)]], R = 70, cx = Math.min(400 - R, Math.max(R, t.x + (Math.random() - .5) * 60)), cy = Math.min(400 - R, Math.max(R, t.y + (Math.random() - .5) * 60));
    var g = $('hpBoard').querySelector('.hp-marks'); g.insertAdjacentHTML('beforeend', '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + R + '" fill="rgba(255,214,102,.28)" stroke="#E8A100" stroke-width="3" stroke-dasharray="8 6"/>');
    var c = g.lastChild; setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c) }, 2200);
    say('노란 동그라미 안에 ' + HP.ICONS[t.k][0] + '이(가) 숨어 있어요.'.replace('이(가)', (HP.ICONS[t.k][0].slice(-1).charCodeAt(0) - 0xAC00) % 28 ? '이' : '가'));
  };
  $('hpReset').onclick = function () { open(q) };
  $('hpAns').onclick = function () {
    if (!ans && !confirm('숨은 물건의 자리를 모두 보여 줄까요?')) return;
    ans = !ans; this.setAttribute('aria-pressed', ans);
    var g = $('hpBoard').querySelector('.hp-marks');
    if (ans) m.T.forEach(function (t, i) { if (!found[i]) g.insertAdjacentHTML('beforeend', '<circle class="hp-a" cx="' + t.x.toFixed(1) + '" cy="' + t.y.toFixed(1) + '" r="' + (m.R + 6).toFixed(1) + '" fill="none" stroke="#F2A93B" stroke-width="4" stroke-dasharray="6 5"/>') });
    else g.querySelectorAll('.hp-a').forEach(function (c) { c.remove() });
  };
  $('hpPrint').onclick = function () {
    $('hpSheet').innerHTML = '<p><b>' + G + '학년 숨은 그림 찾기 ' + (q + 1) + '번</b> &nbsp; 이름: ____________</p><p>' + $('hpAsk').textContent + '</p>' + HP.svg(m) +
      '<div class="hp-items">' + m.T.map(function (t) { return '<span class="hp-it">' + HP.icon(t.k) + HP.ICONS[t.k][0] + '</span>' }).join('') + '</div>';
    setTimeout(function () { window.print() }, 50);
  };
  $('hpNext').onclick = $('hpNext2').onclick = function () { if (q < S.length - 1) open(q + 1) };
  $('hpPrev').onclick = function () { if (q > 0) open(q - 1) };
  $('hpBack').onclick = $('hpBack2').onclick = close;
  $('hpList').addEventListener('click', function (e) { var b = e.target.closest('.hp-q'); if (b) open(+b.dataset.q) });
  document.addEventListener('keydown', function (e) { if (q >= 0 && e.key === 'Escape') close() });
  list();
  function fromHash() { var h = parseInt(location.hash.slice(1), 10); if (h >= 1 && h <= S.length && h - 1 !== q) open(h - 1) }
  window.addEventListener('hashchange', fromHash); fromHash();
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
