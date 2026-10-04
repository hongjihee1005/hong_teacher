/* 한자 급수 페이지: 한자 익히기 · 쓰기 연습지 · 모의 시험 20회 (자료 window.HZ — gen.py가 만듦) */
(function () {
  var D = window.HZ, L = D.learn, $ = function (id) { return document.getElementById(id) };
  var KEY = 'hj-hanja-v1', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') } catch (e) { st = {} }
  st[D.id] = st[D.id] || {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) { } }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function hn(t, c) { return '<span class="han' + (c ? ' ' + c : '') + '">' + esc(t) + '</span>' }
  function hun(x) { return x[1].map(function (m) { return m[0].join('·') + ' ' + m[1].join('·') }).join(', ') }
  /* 훈음 표시: 훈(뜻)은 조금 작고 진한 회색, 음(소리)은 굵게, 사이를 조금 띄움 */
  function he(h, e) { return '<span class="hu">' + esc(h) + '</span><span class="eu">' + esc(e) + '</span>' }
  function heStr(t) { t = String(t); var k = t.lastIndexOf(' '); return k < 0 ? esc(t) : he(t.slice(0, k), t.slice(k + 1)) }
  function heAll(x) { return x[1].map(function (m) { return he(m[0].join('·'), m[1].join('·')) }).join('<span class="sep">, </span>') }
  /* 획순 그림: 1~upto획(upto번째 획은 강조색). nums면 획 번호 */
  function strokeSvg(P, upto, cls, nums) {
    var s = '<path class="hz-gd" d="M54.5 2V107M2 54.5H107"/>';
    P.forEach(function (d, i) { if (i < upto) s += '<path class="' + (i === upto - 1 ? 'hz-now' : 'hz-done') + '" d="' + d + '"/>' });
    if (nums) P.forEach(function (d, i) { var m = /^M(-?[\d.]+),(-?[\d.]+)/.exec(d); if (m) s += '<text x="' + (+m[1] - 5) + '" y="' + (+m[2] - 2) + '">' + (i + 1) + '</text>' });
    return '<svg class="' + cls + '" viewBox="0 0 109 109" aria-hidden="true">' + s + '</svg>';
  }
  function steps(P, cls) { var h = ''; for (var k = 1; k <= P.length; k++) h += '<span class="' + cls + '">' + strokeSvg(P, k, 'hzst') + '<i>' + k + '</i></span>'; return h }
  var CIR = '①②③④';

  /* ── 탭 ── */
  var TABS = { learn: 'tLearn', sheet: 'tSheet', exam: 'tExam' };
  function tab(t, keep) {
    document.querySelectorAll('.hz-tabs button').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === t ? 'true' : 'false') });
    for (var k in TABS) $(TABS[k]).hidden = k !== t;
    if (!keep) history.replaceState(null, '', '#' + t);
  }
  document.querySelectorAll('.hz-tabs button').forEach(function (b) { b.onclick = function () { tab(b.dataset.tab); if (b.dataset.tab === 'exam') closeExam(true) } });

  /* ── 한자 익히기 ── */
  function cards(list) {
    $('hzGrid').innerHTML = list.map(function (i) { var x = L[i]; return '<button type="button" class="hz-card" data-i="' + i + '"><span class="h han">' + esc(x[0]) + '</span><span class="m">' + he(x[1][0][0][0], x[1][0][1][0]) + '</span></button>' }).join('');
    $('hzCount').textContent = list.length === L.length ? '이 급에서 새로 나오는 한자 ' + L.length + '자' : list.length + '자 찾음';
  }
  function detail(i) {
    var x = L[i];
    $('hzDet').innerHTML = '<div class="hz-big">' + hn(x[0]) + '</div><div class="hz-info"><h3>' + heAll(x) + '</h3><dl><dt>부수</dt><dd>' + hn(x[2]) + '</dd><dt>총획</dt><dd>' + x[3] + '획</dd><dt>급수</dt><dd>' + esc(D.name) + '</dd></dl>' +
      (x[4].length ? '<div>이 한자가 든 낱말</div><div class="hz-words">' + x[4].map(function (w) { return '<span>' + hn(w[0]) + ' ' + esc(w[1]) + '</span>' }).join('') + '</div>' : '') +
      '<div class="hz-bar" style="margin-top:10px"><button type="button" class="hz-btn" data-go="' + ((i + L.length - 1) % L.length) + '">← 앞 글자</button><button type="button" class="hz-btn" data-go="' + ((i + 1) % L.length) + '">다음 글자 →</button></div></div>';
    $('hzDet').insertAdjacentHTML('beforeend', '<div class="hz-order"><h4>획순 <small>' + x[3] + '획</small></h4>' + (x[5] ?
      '<div class="ho-wrap"><div class="ho-anim">' + strokeSvg(x[5], x[5].length, 'hzan', true) + '<button type="button" class="hz-btn" id="hoPlay">▶ 획순 다시 보기</button></div><div class="ho-steps">' + steps(x[5], 'ho-s') + '</div></div>'
      : '<p class="hz-note">이 글자는 한국 획수와 맞는 획순 자료가 없어 싣지 않았어요. 교재의 획순을 참고해 주세요.</p>') + '</div>');
    if (x[5]) { $('hoPlay').onclick = function () { play($('hzDet').querySelector('svg.hzan')) }; play($('hzDet').querySelector('svg.hzan')) }
    $('hzDet').hidden = false;
    document.querySelectorAll('.hz-card.on').forEach(function (c) { c.classList.remove('on') });
    var c = document.querySelector('.hz-card[data-i="' + i + '"]'); if (c) c.classList.add('on');
    $('hzDet').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  var timer = null;
  function play(svg) {
    clearTimeout(timer); if (!svg) return;
    var ps = [].slice.call(svg.querySelectorAll('path:not(.hz-gd)')), ts = [].slice.call(svg.querySelectorAll('text')), k = 0;
    ps.forEach(function (p) { var n = p.getTotalLength(); p.style.transition = 'none'; p.style.strokeDasharray = n + ' ' + n; p.style.strokeDashoffset = n; p.setAttribute('class', 'hz-done') });
    ts.forEach(function (t) { t.style.opacity = 0 });
    (function next() {
      if (k >= ps.length) { ps.forEach(function (q) { q.setAttribute('class', 'hz-done') }); return; }
      var p = ps[k], n = p.getTotalLength(), sec = Math.max(.3, n / 120);
      ps.forEach(function (q, j) { q.setAttribute('class', j === k ? 'hz-now' : 'hz-done') });
      if (ts[k]) ts[k].style.opacity = 1;
      p.getBoundingClientRect(); p.style.transition = 'stroke-dashoffset ' + sec + 's linear'; p.style.strokeDashoffset = 0;
      k++; timer = setTimeout(next, sec * 1000 + 260);
    })();
  }
  cards(L.map(function (x, i) { return i }));
  $('hzGrid').onclick = function (e) { var c = e.target.closest('.hz-card'); if (c) detail(+c.dataset.i) };
  $('hzDet').onclick = function (e) { var b = e.target.closest('[data-go]'); if (b) detail(+b.dataset.go) };
  $('hzFind').oninput = function () {
    var q = this.value.replace(/\s+/g, '');
    cards(L.map(function (x, i) { return i }).filter(function (i) { var x = L[i]; return !q || (x[0] + hun(x).replace(/\s+/g, '')).indexOf(q) >= 0 }));
  };

  /* ── 쓰기 연습지 ── */
  var PER = 8, NP = Math.ceil(L.length / PER), sp = 0;
  function sheet(p) {
    var rows = L.slice(p * PER, p * PER + PER).map(function (x) {
      var b = '<div class="hz-box k">' + hn(x[0]) + '</div>';
      for (var k = 0; k < 3; k++) b += '<div class="hz-box">' + hn(x[0]) + '</div>';
      for (k = 0; k < 5; k++) b += '<div class="hz-box"></div>';
      return '<div class="hz-row"><div class="lab">' + hn(x[0]) + '<small>' + he(x[1][0][0][0], x[1][0][1][0]) + '</small><i>' + hn(x[2]) + '부 · ' + x[3] + '획</i></div><div class="hz-rt">' + (x[5] ? '<div class="sh-steps">' + steps(x[5], 'sh-s') + '</div>' : '<div class="sh-steps none">획순: 교재 참고</div>') + '<div class="hz-boxes">' + b + '</div></div></div>';
    }).join('');
    return '<div class="hz-sheet"><div class="sh-top"><span>' + esc(D.name) + ' 한자 쓰기 ' + (p + 1) + '쪽 / ' + NP + '쪽</span><span>이름: ____________</span></div>' + rows + '</div>';
  }
  function showSheet(p) {
    sp = p; $('shView').innerHTML = sheet(p);
    $('shTitle').textContent = (p + 1) + '쪽 · ' + L[p * PER][0] + ' ~ ' + L[Math.min(L.length, p * PER + PER) - 1][0];
    document.querySelectorAll('#shPages button').forEach(function (b) { b.setAttribute('aria-current', +b.dataset.p === p ? 'true' : 'false') });
  }
  var pg = ''; for (var p = 0; p < NP; p++) pg += '<button type="button" data-p="' + p + '" aria-label="' + (p + 1) + '쪽">' + (p + 1) + '</button>';
  $('shPages').innerHTML = pg;
  $('shPages').onclick = function (e) { var b = e.target.closest('button'); if (b) { showSheet(+b.dataset.p); history.replaceState(null, '', '#sheet-' + (+b.dataset.p + 1)) } };
  showSheet(0);
  function out(html) { $('hzOut').innerHTML = html; setTimeout(function () { window.print() }, 350) }
  $('shPrint').onclick = function () { out(sheet(sp)) };
  $('shAll').onclick = function () {
    if (NP > 20 && !confirm('모두 ' + NP + '쪽이에요. 한꺼번에 인쇄할까요?')) return;
    var h = ''; for (var p = 0; p < NP; p++) h += sheet(p); out(h);
  };

  /* ── 모의 시험 ── */
  var E = D.exams, cur = -1, ans = {}, self = {}, graded = false, keyOn = false;
  function norm(s) { return String(s || '').replace(/[\s·,.]/g, '') }
  function list() {
    $('exInfo').innerHTML = esc(D.name) + ' 모의 시험 20회 · 회마다 ' + D.total + '문항, ' + D.pass_ + '문항 이상 맞으면 합격 기준(' + Math.round(D.pass_ / D.total * 100) + '%)이에요. 화면에서 풀고 채점하거나, 시험지를 인쇄해서 풀어요.';
    var h = ''; for (var e = 0; e < E.length; e++) { var r = st[D.id][e]; h += '<button type="button" class="hz-eq' + (r ? ' done' : '') + '" data-e="' + e + '"><b>' + (e + 1) + '회</b><span>' + (r ? '최고 ' + r + '점 / ' + D.total + (r >= D.pass_ ? ' · 합격 ✓' : '') : D.total + '문항') + '</span></button>' }
    $('exList').innerHTML = h;
  }
  function flat(e) { var a = []; E[e].forEach(function (s) { s.items.forEach(function (x) { a.push([s.t, x]) }) }); return a }
  function correct(t, x, v) {
    if (t === 'R') return norm(v) === norm(x.a);
    if (t === 'H') return x.a.some(function (a) { return norm(a) === norm(v) });
    if (t === 'W') return null;
    return v === x.a;
  }
  function ansText(t, x) {
    if (t === 'R') return esc(x.a);
    if (t === 'H') return heStr(x.a[0]);
    if (t === 'W') return hn(x.a);
    if (t === 'C') return CIR[x.a] + ' ' + hn(x.o[x.a]) + ' (' + hn(x.w) + ' ' + esc(x.r) + ')';
    if (t === 'S') return CIR[x.a] + ' ' + hn(x.o[x.a]) + ' (' + esc(x.r) + ')';
    return CIR[x.a] + ' ' + (t === 'B' ? esc(x.o[x.a]) : hn(x.o[x.a]));
  }
  function qhtml(t, x, n, pr) {
    var q;
    if (t === 'W') q = '<span class="q t">' + heStr(x.q) + '</span>';
    else if (t === 'C') q = '<span class="q han">' + esc(x.q) + '</span><span class="rd">[' + esc(x.r) + ']</span>';
    else q = '<span class="q han">' + esc(x.q) + '</span>';
    var h = '<div class="ex-it" data-n="' + n + '"><span class="no">' + (n + 1) + '.</span>' + q;
    if (x.o) h += '<div class="ex-opts">' + x.o.map(function (o, k) { return '<button type="button" data-k="' + k + '" aria-pressed="' + (ans[n] === k ? 'true' : 'false') + '">' + CIR[k] + ' ' + (t === 'B' ? esc(o) : hn(o)) + '</button>' }).join('') + '</div>';
    else if (pr) h += '<span class="pr-blank"></span>';
    else if (t === 'W') h += '<span class="wbox" aria-hidden="true"></span><span class="hz-note" style="margin:0">종이에 써 보세요</span>';
    else h += '<input type="text" autocomplete="off" spellcheck="false" lang="ko" data-n="' + n + '" value="' + esc(ans[n] || '') + '" aria-label="' + (n + 1) + '번 답" placeholder="' + (t === 'H' ? '뜻 소리' : '읽는 소리') + '">';
    return h + '</div>';
  }
  function paper(e, pr) {
    var n = 0, h = '<div class="ex-head"><b>' + esc(D.name) + ' 모의 시험 ' + (e + 1) + '회</b><span>' + D.total + '문항 · 합격 ' + D.pass_ + '문항 이상' + (pr ? ' · 이름: ____________ · 점수: ______' : '') + '</span></div>';
    E[e].forEach(function (s) {
      var a = n + 1, b = n + s.items.length;
      h += '<div class="ex-sec"><p>[' + a + '~' + b + '] ' + esc(s.g) + '</p><div class="ex-items' + (s.t === 'C' || s.t === 'S' || s.t === 'A' || s.t === 'B' || s.t === 'Y' ? ' wide' : '') + '">';
      s.items.forEach(function (x) { h += qhtml(s.t, x, n, pr); n++ });
      h += '</div></div>';
    });
    return h;
  }
  function keySheet(e) {
    var h = '<div class="ex-head"><b>' + esc(D.name) + ' 모의 시험 ' + (e + 1) + '회 정답</b><span>' + D.total + '문항 · 합격 ' + D.pass_ + '문항 이상</span></div><div class="ex-items">';
    flat(e).forEach(function (p, n) { h += '<div class="ex-it"><span class="no">' + (n + 1) + '.</span><span>' + ansText(p[0], p[1]) + '</span></div>' });
    return '<div class="pr-key">' + h + '</div></div>';
  }
  function openExam(e) {
    cur = e; ans = {}; self = {}; graded = false; keyOn = false;
    $('exPick').hidden = true; $('exView').hidden = false; $('exResult').hidden = true;
    $('exTitle').textContent = D.name + ' 모의 시험 ' + (e + 1) + '회';
    $('exKey').setAttribute('aria-pressed', 'false');
    $('exPaper').innerHTML = paper(e);
    $('exPrev').disabled = e === 0; $('exNext').disabled = e === E.length - 1;
    history.replaceState(null, '', '#exam-' + (e + 1)); window.scrollTo(0, 0);
  }
  function closeExam(quiet) { cur = -1; $('exView').hidden = true; $('exPick').hidden = false; list(); if (!quiet) history.replaceState(null, '', '#exam') }
  function mark(show) {
    var F = flat(cur), ok = 0, need = 0, by = {};
    F.forEach(function (p, n) {
      var t = p[0], x = p[1], el = document.querySelector('.ex-it[data-n="' + n + '"]'), c = correct(t, x, ans[n]);
      if (c === null) c = self[n] === true ? true : self[n] === false ? false : null;
      by[t] = by[t] || [0, 0]; by[t][1]++;
      if (c) { ok++; by[t][0]++ }
      if (c === null) need++;
      el.classList.toggle('ok', show && c === true); el.classList.toggle('no', show && c === false);
      var a = el.querySelector('.ex-ans'); if (a) a.remove();
      if (show || keyOn) {
        var d = document.createElement('div'); d.className = 'ex-ans';
        d.innerHTML = '정답: ' + ansText(t, x) + (t === 'W' && show ? ' <span class="ex-self"><button type="button" data-self="1" aria-pressed="' + (self[n] === true) + '">⭕ 맞게 썼어요</button><button type="button" data-self="0" aria-pressed="' + (self[n] === false) + '">❌ 틀렸어요</button></span>' : '');
        el.appendChild(d);
      }
    });
    return { ok: ok, need: need, by: by };
  }
  var TN = { R: '독음', H: '훈음', W: '한자 쓰기', A: '반대·상대', C: '한자어 완성', B: '부수', S: '동음이의어', Y: '약자' };
  function grade(quiet) {
    graded = true; var r = mark(true), pass = r.ok >= D.pass_;
    $('exResult').innerHTML = '<b>' + r.ok + '점 / ' + D.total + '점</b><p>' + (pass ? '🎉 합격 기준(' + D.pass_ + '문항)을 넘었어요!' : '합격 기준은 ' + D.pass_ + '문항이에요. 틀린 문제를 다시 살펴봐요.') + '</p>' +
      (r.need ? '<p>✏️ 한자 쓰기 ' + r.need + '문제는 정답을 보고 ⭕/❌를 눌러 주세요. 누르면 점수가 바로 바뀌어요.</p>' : '') +
      '<p class="hz-note">' + Object.keys(r.by).map(function (t) { return TN[t] + ' ' + r.by[t][0] + '/' + r.by[t][1] }).join(' · ') + '</p>';
    $('exResult').hidden = false;
    if (!st[D.id][cur] || r.ok > st[D.id][cur]) { st[D.id][cur] = r.ok; save() }
    if (quiet !== true) $('exResult').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  $('exList').onclick = function (e) { var b = e.target.closest('[data-e]'); if (b) openExam(+b.dataset.e) };
  $('exBack').onclick = function () { closeExam() };
  $('exGrade').onclick = $('exGrade2').onclick = function () { grade() };
  $('exReset').onclick = function () { if (confirm('쓴 답을 모두 지우고 처음부터 풀까요?')) openExam(cur) };
  $('exKey').onclick = function () { keyOn = !keyOn; this.setAttribute('aria-pressed', keyOn ? 'true' : 'false'); mark(graded) };
  $('exPrev').onclick = function () { if (cur > 0) openExam(cur - 1) };
  $('exNext').onclick = function () { if (cur < E.length - 1) openExam(cur + 1) };
  $('exPrint').onclick = function () { out('<div class="pr-exam">' + paper(cur, true) + '</div>') };
  $('exPrintKey').onclick = function () { out(keySheet(cur)) };
  $('exPaper').addEventListener('input', function (e) { var i = e.target.closest('input[data-n]'); if (i) ans[+i.dataset.n] = i.value });
  $('exPaper').addEventListener('click', function (e) {
    var o = e.target.closest('.ex-opts button');
    if (o) { var it = o.closest('.ex-it'), n = +it.dataset.n; ans[n] = +o.dataset.k; it.querySelectorAll('.ex-opts button').forEach(function (b) { b.setAttribute('aria-pressed', b === o ? 'true' : 'false') }); if (graded) grade(true); return; }
    var s = e.target.closest('[data-self]');
    if (s) { self[+s.closest('.ex-it').dataset.n] = s.dataset.self === '1'; grade(true); }
  });
  $('exPaper').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return; var i = e.target.closest('input[data-n]'); if (!i) return;
    e.preventDefault(); var all = [].slice.call(document.querySelectorAll('#exPaper input')), k = all.indexOf(i); if (all[k + 1]) all[k + 1].focus(); else i.blur();
  });
  list();

  /* 주소 뒤 #learn · #sheet-3 · #exam · #exam-5 */
  var h = location.hash.slice(1), m;
  if ((m = /^sheet(?:-(\d+))?$/.exec(h))) { tab('sheet', true); if (m[1]) showSheet(Math.max(0, Math.min(NP - 1, m[1] - 1))) }
  else if ((m = /^exam(?:-(\d+))?$/.exec(h))) { tab('exam', true); if (m[1]) openExam(Math.max(0, Math.min(E.length - 1, m[1] - 1))) }
  /* 이 급의 한자를 미리 불러와 글꼴이 바뀌어 보이지 않게 */
  if (document.fonts && document.fonts.load) document.fonts.load('500 40px "Noto Serif KR"', L.map(function (x) { return x[0] }).join('')).catch(function () { });
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
