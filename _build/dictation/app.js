/* 공통 › 받아쓰기·맞춤법 급수 화면 (2026-10-05)
   학년마다 15급(10개씩): 1~5급 낱말 · 6~10급 어절 · 11~15급 문장
   📖 익히기 · 🎧 받아쓰기(화면에 쓰기 / 공책에 쓰기) · ✅ 맞춤법 고르기 · 🖨️ 인쇄(시험지·정답·급수표)
   읽어 주기는 브라우저의 한국어 음성(speechSynthesis), 기록은 그 기기 localStorage('hj-dict-v1')에만. */
(function () {
  'use strict';
  var D = window.DT, $ = function (id) { return document.getElementById(id) };
  var KEY = 'hj-dict-v1', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {} } catch (e) {}
  if (!st[D.g]) st[D.g] = {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function pt(s) { return esc(s).replace(/'([^']+)'/g, '<b>$1</b>').replace(/\[([^\]]+)\]/g, '<span class="dt-snd">[$1]</span>') }
  var KIND = ['낱말', '어절', '문장'], LV = [];
  for (var k = 0; k < 3; k++) for (var j = 0; j < 5; j++) LV.push({ no: k * 5 + j + 1, kind: KIND[k], items: D.items[k].slice(j * 10, j * 10 + 10) });
  var lv = 0, tab = 'learn';

  /* ── 읽어 주기 ── */
  var SS = window.speechSynthesis, voice = null, rate = 1;
  function pickVoice() { if (!SS) return; var vs = SS.getVoices(); voice = vs.filter(function (v) { return /^ko/i.test(v.lang) })[0] || null; $('dtVoice').hidden = !!voice || !vs.length }
  if (SS) { pickVoice(); SS.onvoiceschanged = pickVoice } else $('dtVoice').hidden = false;
  function say(t, slow) {
    if (!SS) return; SS.cancel();
    var u = new SpeechSynthesisUtterance(t.replace(/[.?!]$/, '')); u.lang = 'ko-KR'; if (voice) u.voice = voice;
    u.rate = (slow ? .62 : .9) * rate; SS.speak(u);
  }
  document.addEventListener('click', function (e) { var b = e.target.closest('[data-say]'); if (b) say(b.dataset.say, b.dataset.slow === '1') });

  /* ── 급 고르기 ── */
  function lvBar() {
    var h = '';
    LV.forEach(function (L, i) {
      if (i % 5 === 0) h += '<span class="dt-lk">' + L.kind + '</span>';
      var r = st[D.g][L.no];
      h += '<button type="button" data-l="' + i + '" aria-pressed="' + (i === lv ? 'true' : 'false') + '"' + (r === 10 ? ' class="full"' : '') + '>' + L.no + '급' + (r != null ? '<i>' + r + '</i>' : '') + '</button>';
    });
    $('dtLv').innerHTML = h;
  }
  $('dtLv').onclick = function (e) { var b = e.target.closest('[data-l]'); if (b) { lv = +b.dataset.l; show() } };
  $('dtTabs').onclick = function (e) { var b = e.target.closest('[data-t]'); if (b) { tab = b.dataset.t; show() } };

  function show() {
    if (SS) SS.cancel();
    lvBar();
    document.querySelectorAll('#dtTabs [data-t]').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.t === tab ? 'true' : 'false') });
    ['learn', 'dict', 'pick', 'print'].forEach(function (t) { $('t-' + t).hidden = t !== tab });
    var L = LV[lv];
    $('dtTitle').textContent = D.name + ' ' + L.no + '급 · ' + L.kind + ' 10개';
    if (tab === 'learn') learn(); else if (tab === 'dict') dictSetup(); else if (tab === 'pick') pick(); else printSetup();
    history.replaceState(null, '', '#' + L.no + (tab === 'learn' ? '' : '-' + tab));
  }

  /* ── 📖 익히기 ── */
  function learn() {
    var h = '';
    LV[lv].items.forEach(function (it, i) {
      h += '<li><span class="no">' + (i + 1) + '</span><div class="tx"><p class="w">' + esc(it[0]) + '</p><p class="pt">💡 ' + pt(it[1]) + '</p>' +
        (it[2] ? '<p class="bad">틀리기 쉬워요: <s>' + esc(it[2]) + '</s></p>' : '') + '</div>' +
        '<span class="sb"><button type="button" class="dt-b" data-say="' + esc(it[0]) + '" aria-label="듣기">🔊</button><button type="button" class="dt-b" data-say="' + esc(it[0]) + '" data-slow="1" aria-label="천천히 듣기">🐢</button></span></li>';
    });
    $('lnList').innerHTML = h;
  }
  $('lnAll').onclick = function () {
    if (!SS) return; SS.cancel(); var it = LV[lv].items;
    it.forEach(function (x) { var u = new SpeechSynthesisUtterance(x[0].replace(/[.?!]$/, '')); u.lang = 'ko-KR'; if (voice) u.voice = voice; u.rate = .85 * rate; SS.speak(u) });
  };

  /* ── 🎧 받아쓰기 ── */
  var mode = 'screen', items = [], k2 = 0, ok = 0, wrong = [], tries = 0, punct = true;
  try { mode = localStorage.getItem(KEY + '-m') || 'screen'; punct = localStorage.getItem(KEY + '-p') !== '0' } catch (e) {}
  function norm(s) { s = String(s || '').replace(/\s+/g, ' ').trim(); if (!punct) s = s.replace(/[.?!,]/g, '').replace(/\s+/g, ' ').trim(); return s }
  function dictSetup() {
    document.querySelectorAll('#dcMode [data-m]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.m === mode ? 'true' : 'false') });
    $('dcPunct').checked = punct; $('dcPunctW').hidden = LV[lv].kind !== '문장';
    items = LV[lv].items.slice(); k2 = 0; ok = 0; wrong = []; $('dcEnd').hidden = true;
    if (mode === 'screen') { $('dcScreen').hidden = false; $('dcNote').hidden = true; dShow() }
    else { $('dcScreen').hidden = true; $('dcNote').hidden = false; nShow() }
  }
  $('dcMode').onclick = function (e) { var b = e.target.closest('[data-m]'); if (!b) return; mode = b.dataset.m; try { localStorage.setItem(KEY + '-m', mode) } catch (er) {} dictSetup() };
  $('dcPunct').onchange = function () { punct = this.checked; try { localStorage.setItem(KEY + '-p', punct ? '1' : '0') } catch (er) {} };
  function dShow() {
    tries = 0; var it = items[k2];
    $('dcCnt').textContent = (k2 + 1) + ' / 10'; $('dcOk').textContent = '⭕ ' + ok;
    $('dcBar').style.width = (k2 * 10) + '%';
    $('dcIn').value = ''; $('dcIn').disabled = false; $('dcMsg').innerHTML = ''; $('dcMsg').className = 'dt-msg';
    $('dcGo').hidden = false; $('dcNext').hidden = true;
    $('dcSay').dataset.say = it[0]; $('dcSlow').dataset.say = it[0];
    setTimeout(function () { say(it[0]) }, 250);
    $('dcIn').focus({ preventScroll: true });
  }
  /* 글자 비교(LCS): 정답 기준으로 맞은 글자·빠진 글자, 쓴 글 기준으로 더 쓴 글자 */
  function diff(a, b) {
    var n = a.length, m = b.length, T = [], i, j;
    for (i = 0; i <= n; i++) { T.push(new Array(m + 1).fill(0)) }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) T[i][j] = a[i] === b[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
    var ha = '', hb = ''; i = 0; j = 0;
    function c(ch, cls) { var s = ch === ' ' ? (cls ? '∨' : ' ') : esc(ch); return cls ? '<mark class="' + cls + '">' + s + '</mark>' : s }
    while (i < n || j < m) {
      if (i < n && j < m && a[i] === b[j]) { ha += c(a[i]); hb += c(b[j]); i++; j++ }
      else if (j < m && (i >= n || T[i][j + 1] >= T[i + 1][j])) { hb += c(b[j], 'x'); j++ }
      else { ha += c(a[i], 'm'); i++ }
    }
    return [ha, hb];
  }
  function dCheck() {
    if (!$('dcNext').hidden) { dNext(); return }
    var it = items[k2], v = norm($('dcIn').value), ans = norm(it[0]), m = $('dcMsg');
    if (!v) { m.textContent = '들은 말을 써 주세요.'; return }
    if (v === ans) {
      if (tries === 0) ok++; $('dcOk').textContent = '⭕ ' + ok;
      m.innerHTML = '⭕ 맞았어요! <span class="pt">💡 ' + pt(it[1]) + '</span>'; m.className = 'dt-msg ok';
      $('dcIn').disabled = true; $('dcGo').hidden = true; $('dcNext').hidden = false; $('dcNext').focus({ preventScroll: true }); return;
    }
    tries++;
    var d = diff(ans, v), sp = ans.replace(/ /g, '') === v.replace(/ /g, '');
    if (tries === 1) {
      m.innerHTML = '❌ ' + (sp ? '글자는 맞았어요. <b>띄어쓰기</b>를 다시 살펴보세요.' : '다시 한 번 들어 보고 고쳐 써 볼까요?') + '<p class="dt-df">내가 쓴 글: ' + d[1] + '</p>';
      m.className = 'dt-msg no'; $('dcIn').focus({ preventScroll: true }); return;
    }
    wrong.push([it, $('dcIn').value]);
    m.innerHTML = '정답: <b class="dt-ans">' + d[0] + '</b><p class="dt-df">내가 쓴 글: ' + d[1] + '</p><span class="pt">💡 ' + pt(it[1]) + '</span>';
    m.className = 'dt-msg no'; $('dcIn').disabled = true; $('dcGo').hidden = true; $('dcNext').hidden = false; $('dcNext').focus({ preventScroll: true });
  }
  function dNext() { k2++; if (k2 < 10) dShow(); else dEnd() }
  $('dcGo').onclick = dCheck; $('dcNext').onclick = dNext;
  $('dcIn').onkeydown = function (e) { if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); dCheck() } };
  function dEnd() {
    $('dcBar').style.width = '100%'; $('dcScreen').hidden = true; $('dcEnd').hidden = false;
    var L = LV[lv], best = st[D.g][L.no], nb = best == null || ok > best; if (nb) { st[D.g][L.no] = ok; save(); lvBar() }
    var h = '<p class="big">' + (ok === 10 ? '🌟 100점! ' + L.no + '급 통과!' : ok >= 8 ? '⭐ 잘했어요!' : '💪 틀린 것을 다시 익혀 봐요.') + '</p><p>10개 중 <b>' + ok + '개</b>를 한 번에 맞혔어요' + (nb && ok ? ' · 🏅 새 기록' : '') + '</p>';
    if (wrong.length) { h += '<h3>다시 볼 것</h3><ol class="dt-wr">'; wrong.forEach(function (w) { h += '<li><b>' + esc(w[0][0]) + '</b> <button type="button" class="dt-b" data-say="' + esc(w[0][0]) + '" aria-label="듣기">🔊</button><span class="pt">💡 ' + pt(w[0][1]) + '</span></li>' }); h += '</ol>' }
    $('dcRes').innerHTML = h; $('dcNextLv').hidden = lv === LV.length - 1;
  }
  $('dcAgain').onclick = dictSetup;
  $('dcNextLv').onclick = function () { lv++; show() };
  /* 공책에 쓰기: 선생님이 차례로 불러 주고 마지막에 정답 공개 */
  function nShow() {
    $('ntNo').textContent = (k2 + 1) + '번'; $('ntCnt').textContent = (k2 + 1) + ' / 10';
    $('ntPrev').disabled = k2 === 0; $('ntNext').textContent = k2 === 9 ? '✅ 정답 보기' : '다음 →';
    $('ntAns').hidden = true; $('ntShow').hidden = false;
    var it = items[k2]; $('ntSay').dataset.say = it[0]; $('ntSlow').dataset.say = it[0];
    setTimeout(function () { say(it[0]) }, 250);
  }
  $('ntPrev').onclick = function () { if (k2 > 0) { k2--; nShow() } };
  $('ntNext').onclick = function () {
    if (k2 < 9) { k2++; nShow(); return }
    $('ntShow').hidden = true; var h = '<ol class="dt-key">';
    items.forEach(function (it) { h += '<li><b>' + esc(it[0]) + '</b><span class="pt">💡 ' + pt(it[1]) + '</span></li>' });
    $('ntAns').innerHTML = h + '</ol><div class="dt-bar ctr"><button type="button" class="dt-b go" id="ntAgain">🔄 처음부터</button></div>'; $('ntAns').hidden = false;
    $('ntAgain').onclick = dictSetup;
  };

  /* ── ✅ 맞춤법 고르기 ── */
  function pick() {
    var h = '', its = LV[lv].items, sc = 0, n = 0;
    its.forEach(function (it, i) {
      if (!it[2]) return; n++;
      var sw = (i * 7 + lv * 3 + D.g) % 2, o = sw ? [it[2], it[0]] : [it[0], it[2]];
      h += '<li data-i="' + i + '"><div class="op">' + o.map(function (x) { return '<button type="button" class="dt-op" data-ok="' + (x === it[0] ? 1 : 0) + '">' + esc(x) + '</button>' }).join('') + '</div><p class="pt" hidden>💡 ' + pt(it[1]) + '</p></li>';
    });
    $('pkList').innerHTML = h; $('pkScore').textContent = '';
    $('pkList').onclick = function (e) {
      var b = e.target.closest('.dt-op'); if (!b) return; var li = b.closest('li'); if (li.dataset.done) return;
      li.dataset.done = 1; var good = b.dataset.ok === '1'; if (good) sc++;
      li.querySelectorAll('.dt-op').forEach(function (x) { x.disabled = true; if (x.dataset.ok === '1') x.classList.add('right'); else if (x === b) x.classList.add('wrong') });
      li.classList.add(good ? 'ok' : 'no'); li.querySelector('.pt').hidden = false;
      var done = $('pkList').querySelectorAll('li[data-done]').length;
      $('pkScore').textContent = done + '/' + n + '개 풀었어요 · ⭕ ' + sc + '개' + (done === n ? (sc === n ? ' · 🌟 모두 맞혔어요!' : '') : '');
    };
  }
  $('pkAgain').onclick = pick;

  /* ── 🖨️ 인쇄 ── */
  function out(h) { $('dtOut').innerHTML = h; setTimeout(function () { window.print() }, 350) }
  var paper = D.g <= 2 ? 'cell' : 'line';
  function printSetup() {
    document.querySelectorAll('#prPaper [data-p]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.p === paper ? 'true' : 'false') });
    $('prView').innerHTML = sheet(lv, 'test');
  }
  $('prPaper').onclick = function (e) { var b = e.target.closest('[data-p]'); if (b) { paper = b.dataset.p; printSetup() } };
  function cells(n) { var h = ''; for (var i = 0; i < n; i++) h += '<i></i>'; return '<span class="cells">' + h + '</span>' }
  function sheet(i, kind) {
    var L = LV[i], max = 0; L.items.forEach(function (x) { max = Math.max(max, x[0].length) });
    var per = L.kind === '낱말' ? 10 : 20, rows = Math.ceil((max + 1) / per);
    var h = '<div class="dt-sheet"><div class="sh-hd"><div><b>' + esc(D.name) + ' 받아쓰기 ' + L.no + '급</b><span>' + L.kind + ' 10개' + (kind === 'key' ? ' · 정답' : '') + '</span></div>' +
      (kind === 'key' ? '' : '<div class="sh-nm">이름: <i></i> 점수: <i class="s"></i> / 100</div>') + '</div><ol class="sh-list ' + kind + '">';
    L.items.forEach(function (it) {
      if (kind === 'key') h += '<li><b>' + esc(it[0]) + '</b><small>' + pt(it[1]) + '</small></li>';
      else if (paper === 'cell') { h += '<li>'; for (var r = 0; r < rows; r++) h += cells(per); h += '</li>' }
      else h += '<li><span class="dt-ln"></span>' + (L.kind === '문장' && max > 24 ? '<span class="dt-ln"></span>' : '') + '</li>';
    });
    return h + '</ol><p class="sh-ft">받아쓰기·맞춤법 급수 · 초등교사 홍지희</p></div>';
  }
  function home() {   // 가정 학습용 급수표: 15급 전체
    var h = '<div class="dt-sheet home"><div class="sh-hd"><div><b>' + esc(D.name) + ' 받아쓰기 급수표</b><span>집에서 미리 읽고 써 보세요 · 1~5급 낱말 · 6~10급 어절 · 11~15급 문장</span></div></div><div class="hm-grid">';
    LV.forEach(function (L) { h += '<section><h4>' + L.no + '급 <small>' + L.kind + '</small></h4><ol>'; L.items.forEach(function (it) { h += '<li>' + esc(it[0]) + '</li>' }); h += '</ol></section>' });
    return h + '</div><p class="sh-ft">받아쓰기·맞춤법 급수 · 초등교사 홍지희</p></div>';
  }
  $('prTest').onclick = function () { out(sheet(lv, 'test')) };
  $('prKey').onclick = function () { out(sheet(lv, 'key')) };
  $('prBoth').onclick = function () { out(sheet(lv, 'test') + sheet(lv, 'key')) };
  $('prAll').onclick = function () { var h = ''; for (var i = 0; i < LV.length; i++) h += sheet(i, 'test'); out(h) };
  $('prAllKey').onclick = function () { var h = ''; for (var i = 0; i < LV.length; i++) h += sheet(i, 'key'); out(h) };
  $('prHome').onclick = function () { out(home()) };

  $('dtRate').onchange = function () { rate = +this.value };
  var m = /^#(\d+)(?:-(\w+))?$/.exec(location.hash);
  if (m && +m[1] >= 1 && +m[1] <= 15) { lv = +m[1] - 1; if (m[2] && /^(dict|pick|print)$/.test(m[2])) tab = m[2] }
  show();
  var hh = location.hostname, okHost = location.protocol === 'file:' || /github\.io$/.test(hh) || hh === 'localhost' || hh === '127.0.0.1';
  if (okHost) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
