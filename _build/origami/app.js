/* 종이접기 학년 페이지: 작품 고르기 → 한 단계씩 보기 → 한눈에 보기(인쇄) */
(function () {
  var M = window.OG_MODELS, $ = function (id) { return document.getElementById(id) };
  var LV = ['쉬움', '보통', '도전'];
  function lv(i) { return LV[(M[i].diff || 1) - 1] }
  function svg(m, i) { var s = m.steps[i]; return OG.render(s.d, m.color, s.z) }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }

  /* 접기 기호 */
  var sym = $('ogSym');
  if (sym && window.OG_LEGEND) sym.innerHTML = OG_LEGEND.map(function (x) { return '<figure>' + OG.render(x.d, '#F6C453') + '<figcaption><b>' + esc(x.n) + '</b>' + esc(x.t) + '</figcaption></figure>' }).join('');

  /* 작품 카드 */
  $('ogGrid').innerHTML = M.map(function (m, i) {
    return '<button type="button" class="og-card" data-i="' + i + '"><span class="og-th">' + svg(m, m.steps.length - 1) + '</span>' +
      '<span class="nm">' + esc(m.name) + '</span><span class="de">' + esc(m.desc) + '</span>' +
      '<span class="og-meta"><span class="lv">' + lv(i) + '</span><span>' + m.steps.length + '단계</span><span>⏱ ' + esc(m.time) + '</span></span>' +
      '<span class="og-meta"><span><i class="og-sw" style="background:' + m.color + '"></i>' + esc(m.paper) + '</span></span></button>';
  }).join('');

  var cur = null, k = 0;
  function show() {
    var m = M[cur], n = m.steps.length, last = k === n - 1;
    $('ogFig').innerHTML = svg(m, k);
    $('ogFig').querySelector('svg').setAttribute('aria-label', (k + 1) + '단계 그림: ' + m.steps[k].t);
    $('ogNum').textContent = (k + 1) + ' / ' + n + ' 단계';
    $('ogTxt').textContent = m.steps[k].t;
    $('ogPrev').disabled = k === 0;
    $('ogNext').textContent = last ? '완성!' : '다음 단계 →';
    $('ogNext').classList.toggle('go', true);
    var d = '';
    for (var i = 0; i < n; i++) d += '<button type="button" data-k="' + i + '" class="' + (i === k ? 'on' : i < k ? 'past' : '') + '" aria-label="' + (i + 1) + '단계로"' + (i === k ? ' aria-current="step"' : '') + '>' + (i + 1) + '</button>';
    $('ogDots').innerHTML = d;
    $('ogDone').hidden = true;
  }
  function open(i, step) {
    cur = i; k = step || 0;
    var m = M[i];
    $('ogName').textContent = m.name;
    $('ogTip').textContent = '💡 ' + m.tip;
    $('ogPick').hidden = true; $('ogView').hidden = false; $('ogSheet').hidden = true;
    $('ogAll').setAttribute('aria-expanded', 'false');
    $('ogOther').innerHTML = M.map(function (o, j) { return j === i ? '' : '<button type="button" class="og-btn" data-i="' + j + '">' + esc(o.name) + ' 접기</button>' }).join('');
    show();
    if (location.hash !== '#' + m.id) history.replaceState(null, '', '#' + m.id);
    window.scrollTo(0, 0);
  }
  function close() {
    cur = null; $('ogView').hidden = true; $('ogPick').hidden = false;
    history.replaceState(null, '', location.pathname + location.search);
  }
  function sheet() {
    var m = M[cur], on = $('ogSheet').hidden;
    if (on) {
      $('ogSheetT').textContent = m.name + ' — 전체 단계 (' + document.title.split(' · ')[0] + ')';
      $('ogAllList').innerHTML = m.steps.map(function (s, i) { return '<figure>' + svg(m, i) + '<figcaption><b>' + (i + 1) + '.</b> ' + esc(s.t) + '</figcaption></figure>' }).join('');
    }
    $('ogSheet').hidden = !on; $('ogAll').setAttribute('aria-expanded', on ? 'true' : 'false');
    if (on) $('ogSheet').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  document.addEventListener('click', function (e) {
    var c = e.target.closest('.og-card,[data-i]');
    if (c && c.dataset.i != null) { open(+c.dataset.i); return; }
    var d = e.target.closest('#ogDots button');
    if (d) { k = +d.dataset.k; show(); return; }
  });
  $('ogPrev').onclick = function () { if (k > 0) { k--; show(); } };
  $('ogNext').onclick = function () {
    if (k < M[cur].steps.length - 1) { k++; show(); }
    else { $('ogDone').hidden = false; $('ogDone').scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
  };
  $('ogBack').onclick = close; $('ogBack2').onclick = close;
  $('ogAll').onclick = sheet;
  $('ogPrint').onclick = function () { if ($('ogSheet').hidden) sheet(); setTimeout(function () { window.print() }, 200); };
  $('ogAgain').onclick = function () { k = 0; show(); };
  document.addEventListener('keydown', function (e) {
    if (cur === null || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); $('ogNext').click(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); $('ogPrev').click(); }
    else if (e.key === 'Escape') close();
  });
  var h = location.hash.slice(1);
  M.forEach(function (m, i) { if (m.id === h) open(i); });
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
