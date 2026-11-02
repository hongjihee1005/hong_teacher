/* 틀린 그림 찾기: 고르기 → 두 그림에서 다른 곳 누르기 · 기록은 이 기기(localStorage)에만 */
(function () {
  var G = SDG, S = SD.specs(G), $ = function (i) { return document.getElementById(i) };
  var KEY = 'hj-spot-v1', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { st = {} }
  st[G] = st[G] || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) { } }
  function fmt(t) { t = Math.floor(t / 1000); return Math.floor(t / 60) + ':' + ('0' + t % 60).slice(-2) }
  function list() {
    var h = '', done = 0, LV = [['쉬움', '큰 그림 · 눈에 띄는 차이 3~6곳'], ['보통', '크기·자리·부분이 달라져요 5~8곳'], ['도전', '작은 그림이 많고 방향까지 달라져요 7~10곳']];
    for (var b = 0; b < 3; b++) {
      h += '<h3>' + LV[b][0] + ' <small>' + (b * 30 + 1) + '~' + (b * 30 + 30) + '번 · ' + LV[b][1] + '</small></h3><div class="sd-grid">';
      for (var i = b * 30; i < b * 30 + 30; i++) { var d = st[G][i]; if (d) done++; h += '<button type="button" class="sd-q' + (d ? ' done' : '') + '" data-q="' + i + '"><b>' + (i + 1) + '</b><span>' + SD.title(S[i]) + ' · ' + S[i].n + '곳' + (d ? ' · ' + fmt(d.t) : '') + '</span></button>' }
      h += '</div>';
    }
    $('sdList').innerHTML = h; $('sdProg').textContent = '다 찾은 그림 ' + done + ' / ' + S.length;
  }
  var q = -1, m, found, miss, t0, tick, fin, ans = false;
  function name(d) { return d.kind === 'add' ? '' : SD.OBJ[m.L[d.idx].k][0] }
  function open(k) {
    q = k; m = SD.make(S[k]); found = []; miss = 0; fin = false; ans = false;
    $('sdTitle').textContent = G + '학년 · ' + (k + 1) + '번 ' + S[k].lv;
    $('sdAsk').textContent = SD.title(S[k]) + ' 그림 두 장에서 다른 곳 ' + m.D.length + '군데를 찾아 눌러요.';
    $('sdL').innerHTML = '<b>처음 그림</b>' + SD.svg(m, 0); $('sdR').innerHTML = '<b>바뀐 그림</b>' + SD.svg(m, 1);
    $('sdAns').setAttribute('aria-pressed', 'false'); $('sdPick').hidden = true; $('sdPlay').hidden = false; $('sdDone').hidden = true; say('');
    $('sdPrev').disabled = k === 0; $('sdNext2').disabled = k === S.length - 1;
    clearInterval(tick); t0 = Date.now(); tick = setInterval(function () { if (!fin) $('sdTime').textContent = fmt(Date.now() - t0) }, 500); $('sdTime').textContent = '0:00';
    count(); history.replaceState(null, '', '#' + (k + 1)); window.scrollTo(0, 0);
  }
  function count() {
    $('sdCnt').textContent = '찾은 곳 (' + found.length + ' / ' + m.D.length + ')';
    $('sdDots').innerHTML = m.D.map(function (d, i) { return '<i class="' + (found.indexOf(i) >= 0 ? 'on' : '') + '"></i>' }).join('');
    $('sdWhat').innerHTML = found.map(function (i) { var d = m.D[i]; return '<li>' + (d.kind === 'add' ? '오른쪽 그림에 ' + SD.KIND.add.replace('새로 ', '새로 ') : name(d) + ': ' + SD.KIND[d.kind]) + '</li>' }).join('');
  }
  function marks() { return document.querySelectorAll('#sdPlay .sd-marks') }
  function ring(d, cls, col) { var r = Math.max(d.r * 1.05, 14) + 5; marks().forEach(function (g) { d.at.forEach(function (p) { g.insertAdjacentHTML('beforeend', '<circle class="' + cls + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + r.toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="4"' + (cls === 'sd-a' ? ' stroke-dasharray="7 5"' : '') + '/>') }) }) }
  function close() { clearInterval(tick); q = -1; $('sdPlay').hidden = true; $('sdPick').hidden = false; list(); history.replaceState(null, '', location.pathname + location.search) }
  function say(t, b) { $('sdMsg').textContent = t; $('sdMsg').classList.toggle('bad', !!b) }
  document.querySelector('.sd-pics').addEventListener('click', function (e) {
    var svg = e.target.closest('svg'); if (!svg || q < 0 || fin) return;
    var pt = svg.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    var p = pt.matrixTransform(svg.getScreenCTM().inverse()), i = SD.hit(m, p.x, p.y);
    if (i >= 0 && found.indexOf(i) < 0) {
      found.push(i); ring(m.D[i], 'sd-f', getComputedStyle(document.documentElement).getPropertyValue('--acc')); count();
      var d = m.D[i]; say(d.kind === 'add' ? '찾았어요! 새로 생긴 그림이에요.' : '찾았어요! ' + name(d) + ' — ' + SD.KIND[d.kind]);
      if (found.length === m.D.length) win();
    } else if (i < 0) {
      miss++; say('거기는 똑같아요. 다시 찾아봐요!', 1);
      var g = svg.querySelector('.sd-marks'); g.insertAdjacentHTML('beforeend', '<path d="M' + (p.x - 8) + ' ' + (p.y - 8) + 'l16 16m0 -16l-16 16" stroke="#C6392F" stroke-width="3.5" stroke-linecap="round"/>');
      var x = g.lastChild; setTimeout(function () { if (x.parentNode) x.parentNode.removeChild(x) }, 700);
    }
  });
  function win() { fin = true; var t = Date.now() - t0; st[G][q] = { t: t, e: miss }; save(); $('sdDone').hidden = false; $('sdDoneT').textContent = '걸린 시간 ' + fmt(t) + ' · 헛짚은 곳 ' + miss + '번'; $('sdNext').hidden = q >= S.length - 1 }
  $('sdHint').onclick = function () {
    if (fin) return; var left = m.D.map(function (d, i) { return i }).filter(function (i) { return found.indexOf(i) < 0 }); if (!left.length) return;
    var d = m.D[left[Math.floor(Math.random() * left.length)]], p = d.at[0], R = 60, cx = Math.min(400 - R, Math.max(R, p[0] + (Math.random() - .5) * 50)), cy = Math.min(300 - R, Math.max(R, p[1] + (Math.random() - .5) * 40));
    marks().forEach(function (g) { g.insertAdjacentHTML('beforeend', '<circle class="sd-h" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + R + '" fill="rgba(255,214,102,.3)" stroke="#E8A100" stroke-width="3" stroke-dasharray="8 6"/>') });
    setTimeout(function () { document.querySelectorAll('#sdPlay .sd-h').forEach(function (c) { c.remove() }) }, 2200);
    say('노란 동그라미 안에 다른 곳이 있어요.');
  };
  $('sdReset').onclick = function () { open(q) };
  $('sdAns').onclick = function () {
    if (!ans && !confirm('다른 곳을 모두 보여 줄까요?')) return;
    ans = !ans; this.setAttribute('aria-pressed', ans);
    if (ans) m.D.forEach(function (d, i) { if (found.indexOf(i) < 0) ring(d, 'sd-a', '#F2A93B') });
    else document.querySelectorAll('#sdPlay .sd-a').forEach(function (c) { c.remove() });
  };
  $('sdPrint').onclick = function () {
    $('sdSheet').innerHTML = '<p><b>' + G + '학년 틀린 그림 찾기 ' + (q + 1) + '번</b> &nbsp; 이름: ____________</p><p>' + $('sdAsk').textContent + '</p>' + SD.svg(m, 0) + SD.svg(m, 1);
    setTimeout(function () { window.print() }, 50);
  };
  $('sdNext').onclick = $('sdNext2').onclick = function () { if (q < S.length - 1) open(q + 1) };
  $('sdPrev').onclick = function () { if (q > 0) open(q - 1) };
  $('sdBack').onclick = $('sdBack2').onclick = close;
  $('sdList').addEventListener('click', function (e) { var b = e.target.closest('.sd-q'); if (b) open(+b.dataset.q) });
  document.addEventListener('keydown', function (e) { if (q >= 0 && e.key === 'Escape') close() });
  list();
  function fromHash() { var h = parseInt(location.hash.slice(1), 10); if (h >= 1 && h <= S.length && h - 1 !== q) open(h - 1) }
  window.addEventListener('hashchange', fromHash); fromHash();
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
