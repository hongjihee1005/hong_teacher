/* 공통 › 속담·관용어·사자성어 화면 (2026-10-05)
   영역마다 150개를 10개씩 15급으로(쉬운 것부터).
   📖 익히기 · ✅ 뜻 고르기 · 🔎 말 고르기 · 🧩 짝 맞추기(앞부분 → 뒷부분) · 🖨️ 인쇄(학습지·정답·한눈에 보기)
   보기(오답)는 급·문제 방식마다 정해진 씨앗으로 골라, 화면과 인쇄가 같고 다시 열어도 같습니다.
   기록은 그 기기 localStorage('hj-words-v1')에만. */
(function () {
  'use strict';
  var W = window.WD, $ = function (id) { return document.getElementById(id) };
  var KEY = 'hj-words-v1', st = {};
  try { st = JSON.parse(localStorage.getItem(KEY) || '{}') || {} } catch (e) {}
  if (!st[W.area]) st[W.area] = {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  var IT = W.items, LV = [], lv = 0, tab = 'learn';
  for (var i = 0; i < IT.length; i += 10) LV.push({ no: LV.length + 1, from: i, items: IT.slice(i, i + 10) });
  var MODE = { mean: '뜻 고르기', expr: '말 고르기', pair: '짝 맞추기' };
  /* 씨앗 있는 난수 */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  function rng(seed) { var a = hash(seed); return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
  function shuffle(a, r) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }
  function show(it) { return it.h ? it.t + ' (' + it.h + ')' : it.t }
  function field(it, m) { return m === 'mean' ? it.m : m === 'expr' ? it.t : it.b }
  /* 문제 만들기: 같은 급과 앞뒤 급에서 보기를 고름 */
  function quiz(L, m) {
    var r = rng(W.area + ':' + L.no + ':' + m), out = [];
    L.items.forEach(function (it, k) {
      var gi = L.from + k, pool = [];
      for (var d = 1; pool.length < 40 && d < IT.length; d++) [gi - d, gi + d].forEach(function (j) { if (j >= 0 && j < IT.length) pool.push(IT[j]) });
      var ans = field(it, m), seen = {}, ops = [ans]; seen[ans] = 1;
      var no = {}; (it.x || []).forEach(function (j) { no[j] = 1 });   // 뜻이 같은 말은 보기에서 뺌(답이 둘이 되지 않게)
      pool = pool.filter(function (x) { return !no[IT.indexOf(x)] && !(m === 'pair' && x.a === it.a) });
      shuffle(pool.slice(0, 24), r).forEach(function (x) { var v = field(x, m); if (ops.length < 4 && !seen[v]) { seen[v] = 1; ops.push(v) } });
      ops = shuffle(ops, r);
      var q = m === 'mean' ? show(it) : m === 'expr' ? it.m : it.a + ' (     )';
      out.push({ it: it, q: q, ops: ops, ans: ops.indexOf(ans) });
    });
    return out;
  }

  /* ── 급 ── */
  function lvBar() {
    var h = '';
    LV.forEach(function (L, i) {
      var r = st[W.area][L.no] || {}, n = 0; for (var m in MODE) if (r[m] === L.items.length) n++;
      h += '<button type="button" data-l="' + i + '" aria-pressed="' + (i === lv ? 'true' : 'false') + '"' + (n === 3 ? ' class="full"' : '') + '>' + L.no + '급' + (n ? '<i>' + '★'.repeat(n) + '</i>' : '') + '</button>';
    });
    $('wdLv').innerHTML = h;
  }
  $('wdLv').onclick = function (e) { var b = e.target.closest('[data-l]'); if (b) { lv = +b.dataset.l; render() } };
  $('wdTabs').onclick = function (e) { var b = e.target.closest('[data-t]'); if (b) { tab = b.dataset.t; render() } };
  function render() {
    lvBar();
    document.querySelectorAll('#wdTabs [data-t]').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.t === tab ? 'true' : 'false') });
    $('t-learn').hidden = tab !== 'learn'; $('t-quiz').hidden = !MODE[tab]; $('t-print').hidden = tab !== 'print';
    var L = LV[lv];
    $('wdTitle').textContent = W.name + ' ' + L.no + '급' + (MODE[tab] ? ' · ' + MODE[tab] : '') + ' (' + (L.from + 1) + '~' + (L.from + L.items.length) + '번)';
    if (tab === 'learn') learn(); else if (MODE[tab]) play(); else $('prView').innerHTML = sheet(lv, 'sheet');
    history.replaceState(null, '', '#' + L.no + (tab === 'learn' ? '' : '-' + tab));
  }

  /* ── 📖 익히기 ── */
  function mark(it) {
    var e = esc(it.e), k = esc(it.t);
    if (e.indexOf(k) >= 0) return e.replace(k, '<mark>' + k + '</mark>');
    var a = esc(it.a), i = e.indexOf(a); if (i < 0) return e;   // 관용어는 활용된 꼴: 첫 낱말부터 다음 낱말까지
    var m = /^\S+(\s+\S+)?/.exec(e.slice(i)); var s = m ? m[0].replace(/[.,?!]+$/, '') : a;
    return e.slice(0, i) + '<mark>' + s + '</mark>' + e.slice(i + s.length);
  }
  function chars(it) {
    if (!it.c) return '';
    return '<div class="wd-chars">' + it.c.map(function (c) {
      var inner = '<b>' + esc(c[0]) + '</b>' + esc(c[1]) + (c[2] ? '<i>' + esc(c[2]) + '</i>' : '');
      return c[3] ? '<a href="../hanja/' + c[3] + '" title="' + esc(c[2]) + ' 한자 익히기">' + inner + '</a>' : '<span>' + inner + '</span>';
    }).join('') + '</div>';
  }
  function learn() {
    var h = '';
    LV[lv].items.forEach(function (it, i) {
      h += '<li><span class="no">' + (LV[lv].from + i + 1) + '</span><div class="tx">' + (it.h ? '<p class="hz">' + esc(it.h) + '</p>' : '') +
        '<p class="w">' + esc(it.t) + '</p><p class="mean">💡 ' + esc(it.m) + '</p><p class="eg">✏️ ' + mark(it) + '</p>' +
        (it.r ? '<p class="rel">🔗 ' + esc(it.r) + '</p>' : '') + chars(it) + '</div></li>';
    });
    $('lnList').innerHTML = h;
  }

  /* ── 퀴즈 ── */
  var NOTE = { mean: '말을 읽고 알맞은 뜻을 골라요.', expr: '뜻을 읽고 알맞은 말을 골라요.', pair: '앞부분에 이어지는 뒷부분을 골라요.' };
  function play() {
    var L = LV[lv], m = tab, Q = quiz(L, m), sc = 0, done = 0, h = '';
    $('qzNote').textContent = NOTE[m];
    Q.forEach(function (q, i) {
      h += '<li data-i="' + i + '"><p class="qq">' + esc(q.q) + '</p><div class="ops">' + q.ops.map(function (o, j) { return '<button type="button" class="wd-op" data-j="' + j + '">' + '①②③④'[j] + ' ' + esc(o) + '</button>' }).join('') + '</div><p class="fb" hidden></p></li>';
    });
    $('qzList').innerHTML = h; $('qzScore').textContent = '0 / ' + Q.length; $('qzNext').hidden = lv === LV.length - 1;
    $('qzList').onclick = function (e) {
      var b = e.target.closest('.wd-op'); if (!b) return; var li = b.closest('li'); if (li.dataset.done) return;
      var q = Q[+li.dataset.i], ok = +b.dataset.j === q.ans; li.dataset.done = 1; done++; if (ok) sc++;
      li.classList.add(ok ? 'ok' : 'no');
      li.querySelectorAll('.wd-op').forEach(function (x) { x.disabled = true; if (+x.dataset.j === q.ans) x.classList.add('right'); else if (x === b) x.classList.add('wrong') });
      var fb = li.querySelector('.fb'); fb.hidden = false; fb.innerHTML = (ok ? '⭕ ' : '❌ ') + '<b>' + esc(show(q.it)) + '</b> — ' + esc(q.it.m);
      $('qzScore').textContent = sc + ' / ' + Q.length + (done === Q.length ? (sc === Q.length ? ' · 🌟 모두 맞혔어요!' : ' · 다 풀었어요') : '');
      if (done === Q.length) { var r = st[W.area][L.no] = st[W.area][L.no] || {}; if (!(r[m] >= sc)) { r[m] = sc; save(); lvBar() } }
    };
  }
  $('qzAgain').onclick = play;
  $('qzNext').onclick = function () { if (lv < LV.length - 1) { lv++; render(); scrollTo(0, 0) } };

  /* ── 🖨️ 인쇄 ── */
  function out(html) {   // 한자 글꼴(글자마다 나눠 받음)이 다 받아진 뒤 인쇄 — 안 그러면 처음 쓰는 글자가 빈칸으로 찍힘(2026-10-07)
    $('wdOut').innerHTML = html;
    var go = function () { setTimeout(function () { window.print() }, 150) }, t = setTimeout(go, 5000);
    var txt = $('wdOut').textContent, fl = document.fonts && document.fonts.load ? Promise.all(['Noto Serif KR', 'Noto Serif JP', 'Noto Serif TC'].map(function (f) { return document.fonts.load('500 40px "' + f + '"', txt).catch(function () { }) })) : Promise.resolve();
    fl.then(function () { return document.fonts.ready }).then(function () { clearTimeout(t); go() }, function () { clearTimeout(t); go() });
  }
  var GA = '가나다라마바사아자차';
  function sheet(i, kind) {
    var L = LV[i], key = kind === 'key', Q = quiz(L, 'mean'), P = quiz(L, 'pair');
    var right = shuffle(L.items.map(function (it, k) { return k }), rng(W.area + ':' + L.no + ':line'));
    var h = '<div class="wd-sheet"><div class="sh-hd"><div><b>' + esc(W.name) + ' ' + L.no + '급 학습지' + (key ? ' · 정답' : '') + '</b><span>' + (L.from + 1) + '~' + (L.from + L.items.length) + '번</span></div>' +
      (key ? '' : '<div class="sh-nm">이름: <i></i> 맞은 개수: <i class="s"></i> / ' + (L.items.length * 2) + '</div>') + '</div>';
    h += '<p class="sh-sec">① 알맞은 뜻을 골라 ○표 해요.</p><ol class="sh-q2">';
    Q.forEach(function (q) { h += '<li><b>' + esc(q.q) + '</b>' + (key ? ' → <b style="color:#C8402F">' + '①②③④'[q.ans] + ' ' + esc(q.ops[q.ans]) + '</b>' : '<br>' + q.ops.map(function (o, j) { return '<span class="o">' + '①②③④'[j] + ' ' + esc(o) + '</span>' }).join('')) + '</li>' });
    h += '</ol><p class="sh-sec">② 앞부분과 뒷부분을 알맞게 선으로 이어요.</p><div class="sh-pair">';
    L.items.forEach(function (it, k) {
      var rk = right[k], pos = right.indexOf(k);
      h += '<div class="l">' + (k + 1) + '. ' + esc(it.a) + (key ? ' → <b style="color:#C8402F">' + GA[pos] + '</b>' : '') + '</div><div class="r">' + GA[k] + '. ' + esc(L.items[rk].b) + '</div>';
    });
    return h + '</div><p class="sh-ft">' + esc(W.name) + ' · 초등교사 홍지희</p></div>';
  }
  function list() {
    var h = '<div class="wd-sheet"><div class="sh-hd"><div><b>' + esc(W.name) + ' ' + IT.length + '개 한눈에 보기</b><span>10개씩 1~' + LV.length + '급</span></div></div><div class="hm-list">';
    IT.forEach(function (it, i) { h += '<p>' + (i % 10 === 0 ? '<b>[' + (i / 10 + 1) + '급]</b> ' : '') + (i + 1) + '. <b>' + esc(show(it)) + '</b> — ' + esc(it.m) + '</p>' });
    return h + '</div><p class="sh-ft">' + esc(W.name) + ' · 초등교사 홍지희</p></div>';
  }
  $('prSheet').onclick = function () { out(sheet(lv, 'sheet')) };
  $('prKey').onclick = function () { out(sheet(lv, 'key')) };
  $('prBoth').onclick = function () { out(sheet(lv, 'sheet') + sheet(lv, 'key')) };
  $('prAll').onclick = function () { var h = ''; for (var i = 0; i < LV.length; i++) h += sheet(i, 'sheet'); out(h) };
  $('prAllKey').onclick = function () { var h = ''; for (var i = 0; i < LV.length; i++) h += sheet(i, 'key'); out(h) };
  $('prList').onclick = function () { out(list()) };

  var mm = /^#(\d+)(?:-(\w+))?$/.exec(location.hash);
  if (mm && +mm[1] >= 1 && +mm[1] <= LV.length) { lv = +mm[1] - 1; if (mm[2] && (MODE[mm[2]] || mm[2] === 'print')) tab = mm[2] }
  render();
  var hh = location.hostname, okHost = location.protocol === 'file:' || /github\.io$/.test(hh) || hh === 'localhost' || hh === '127.0.0.1';
  if (okHost) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
