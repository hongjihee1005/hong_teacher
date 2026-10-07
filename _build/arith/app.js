/* 공통 › 기초연산 화면 (2026-10-05)
   영역 페이지(add.html …): 단계 고르기 → ✏️ 연습하기(한 문제씩, 바로 확인) · 🖨️ 학습지(번호 1~30, 같은 번호면 같은 문제, 정답 인쇄)
   급수 시험(rank.html): 12급 ~ 1급, 급마다 20회, 화면에서 풀고 채점 · 시험지/정답 인쇄
   기록은 그 기기 localStorage('hj-arith-v1')에만 저장합니다. */
(function () {
  'use strict';
  var AR = window.AR, PG = window.ARP, $ = function (id) { return document.getElementById(id) };
  var KEY = 'hj-arith-v1', st = { s: {}, r: {} };
  try { var o = JSON.parse(localStorage.getItem(KEY) || 'null'); if (o && o.s && o.r) st = o } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)) } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function tm(sec) { sec = Math.round(sec); var m = Math.floor(sec / 60), s = sec % 60; return m ? m + '분 ' + (s < 10 ? '0' : '') + s + '초' : s + '초' }
  var AREA = {}; AR.AREAS.forEach(function (a) { AREA[a.id] = a });

  /* ── 그리기 ── */
  function fracH(w, n, d) {
    return '<span class="ar-fr">' + (w ? '<span class="ar-fw">' + w + '</span>' : '') + '<span class="ar-fd"><span>' + n + '</span><span>' + d + '</span></span></span>';
  }
  function tokH(t) {
    if (typeof t === 'object') {
      if (t.k === 'n') return '<span class="ar-nm">' + t.v + '</span>';
      if (t.k === 'd') return '<span class="ar-nm">' + AR.dstr(t.v, t.p) + '</span>';
      if (t.k === 'f') return fracH(t.w, t.n, t.d);
    }
    if (t === '(' || t === ')') return '<span class="ar-pa">' + t + '</span>';
    if (/^[+−×÷=]$/.test(t)) return '<span class="ar-op">' + t + '</span>';
    return '<span class="ar-tx">' + esc(t).replace(/^ | $/g, '&nbsp;') + '</span>';
  }
  function ansH(a) {
    if (a.t === 'n') return String(a.v);
    if (a.t === 'qr') return a.q + ' <span class="ar-dots">…</span> ' + a.r;
    if (a.t === 'd') return AR.dstr(a.v, a.p);
    if (a.t === 'cmp') return a.v;
    if (a.t === 'list') return a.v.join(', ');
    if (a.t === 'f') { if (a.n % a.d === 0) return String(a.n / a.d); if (a.form === 'improper' || a.n < a.d) return fracH(0, a.n, a.d); return fracH(Math.floor(a.n / a.d), a.n % a.d, a.d) }
  }
  function inp(cls, im, lab, w) { return '<input class="ar-in ' + cls + '" inputmode="' + im + '" autocomplete="off" spellcheck="false" aria-label="' + lab + '"' + (w ? ' style="width:' + w + 'ch"' : '') + '>' }
  /* 답 칸: live(입력) print(빈칸) key(정답) */
  function slotH(a, mode, vw) {
    if (mode === 'key') return '<b class="ar-key">' + ansH(a) + '</b>';
    if (mode === 'print') {
      if (a.t === 'cmp') return '<span class="ar-circ"></span>';
      if (a.t === 'qr') return '<span class="ar-box"></span> <span class="ar-dots">…</span> <span class="ar-box"></span>';
      if (a.t === 'f') return '<span class="ar-box fbx"></span>';
      if (a.t === 'list') return '<span class="ar-line"></span>';
      return '<span class="ar-box"></span>';
    }
    var L = String(a.t === 'n' ? a.v : a.t === 'd' ? AR.dstr(a.v, a.p) : 0).length;
    if (a.t === 'n') return inp('', 'numeric', '답', Math.max(3, L + 1.5));
    if (a.t === 'd') return inp('', 'decimal', '답', Math.max(4, L + 1.5));
    if (a.t === 'qr') return '<span class="ar-qr">' + inp('q', 'numeric', '몫', 4) + ' <span class="ar-dots">…</span> ' + inp('r', 'numeric', '나머지', 3.5) + '</span>';
    if (a.t === 'cmp') return '<span class="ar-cmp"><span class="ar-circ" aria-live="polite"></span><span class="ar-cmpb">' +
      ['<', '=', '>'].map(function (x) { return '<button type="button" class="ar-cb" data-v="' + x + '" aria-label="' + { '<': '작다', '=': '같다', '>': '크다' }[x] + '">' + esc(x) + '</button>' }).join('') + '</span></span>';
    if (a.t === 'list') return inp('wide', 'decimal', '답(쉼표로 나누어 쓰기)', 16);
    if (a.t === 'f') return '<span class="ar-fin' + (a.form === 'improper' ? ' imp' : '') + '">' + inp('fw', 'numeric', '자연수 부분', 2.6) +
      '<span class="ar-fdi">' + inp('fn', 'numeric', '분자', 3) + '<i></i>' + inp('fdn', 'numeric', '분모', 3) + '</span></span>';
  }
  function readSlot(el, a) {
    var g = function (c) { var x = el.querySelector('.ar-in.' + c); return x ? x.value : '' };
    if (a.t === 'qr') return [g('q'), g('r')];
    if (a.t === 'f') return [g('fw'), g('fn'), g('fdn')];
    if (a.t === 'cmp') { var c = el.querySelector('.ar-circ'); return c ? c.dataset.v || '' : '' }
    var x = el.querySelector('.ar-in'); return x ? x.value : '';
  }
  /* 세로셈 */
  function vstr(t) { return t.k === 'd' ? AR.dstr(t.v, t.p) : String(t.v) }
  function vertH(p, mode) {
    var x = vstr(p.q[0]), y = vstr(p.q[2]), op = p.q[1], ans = p.a.t === 'd' ? AR.dstr(p.a.v, p.a.p) : String(p.a.v);
    var sp = function (s) { var i = s.indexOf('.'); return i < 0 ? [s, ''] : [s.slice(0, i), s.slice(i + 1)] };
    var X = sp(x), Y = sp(y), Z = sp(ans), F = Math.max(X[1].length, Y[1].length, mode === 'key' ? Z[1].length : 0);
    var I = Math.max(X[0].length, Y[0].length) + (op === '×' ? 0 : 1);
    if (op === '×') I = Math.max(I, X[0].length + Y[0].length + (F ? 0 : 0));
    if (mode === 'key') I = Math.max(I, Z[0].length);
    function row(s, o, cls) {
      var q = sp(s), h = '<tr' + (cls ? ' class="' + cls + '"' : '') + '><td class="o">' + (o || '') + '</td>';
      for (var i = 0; i < I; i++) { var k = q[0].length - I + i; h += '<td>' + (k >= 0 ? q[0][k] : '') + '</td>' }
      if (F) { h += '<td class="pt">' + (q[1] || s.indexOf('.') >= 0 ? '.' : '') + '</td>'; for (var j = 0; j < F; j++) h += '<td>' + (q[1][j] || '') + '</td>' }
      return h + '</tr>';
    }
    var cols = 1 + I + (F ? F + 1 : 0), h = '<table class="ar-vt"><tbody>' + row(x) + row(y, op, 'vl');
    if (mode === 'key') h += row(ans, '', 'va vk');
    else if (mode === 'print') h += '<tr class="va vp' + (op === '×' && y.replace('.', '').length > 1 ? ' tall' : '') + '"><td colspan="' + cols + '"></td></tr>';
    else h += '<tr class="va"><td colspan="' + cols + '">' + slotH(p.a, 'live') + '</td></tr>';
    return h + '</tbody></table>';
  }
  /* 문제 한 개 */
  function qH(p, mode) {
    if (p.v) return '<div class="ar-q vt">' + vertH(p, mode) + '</div>';
    var h = '', q = p.txt || p.q, slot = slotH(p.a, mode), used = false;
    for (var i = 0; i < q.length; i++) {
      var t = q[i];
      if (t === '○' || (t && t.k === 'b')) { h += slot; used = true }
      else h += tokH(t);
    }
    if (!used) {
      if (p.txt) h += ' <span class="ar-op">→</span> ' + slot;
      else if (q[q.length - 1] === '=') h += slot;
      else h += tokH('=') + slot;
    }
    return '<div class="ar-q' + (p.txt ? ' tx' : '') + '">' + h + '</div>';
  }
  function askOf(s) {
    var a = s.ask; if (a === 'mixed') return '대분수로 나타내세요.'; if (a === 'improper') return '가분수로 나타내세요.';
    if (a === 'list') return '알맞은 수를 모두 쓰세요. (쉼표로 나누어 써요)';
    if (s.ar === 'dec' && /de03|de16/.test(s.id)) return '소수로 나타내세요.';
    return AR.ASK[a] || AR.ASK.calc;
  }
  function hintOf(s) {   // 급수 시험처럼 여러 단계가 섞일 때 문제 앞에 붙이는 짧은 안내
    var a = s.ask; if (a === 'mixed') return '대분수로'; if (a === 'improper') return '가분수로'; if (a === 'simp') return '기약분수로';
    if (/de03|de16/.test(s.id)) return '소수로'; if (a === 'qr') return '몫 … 나머지'; if (a === 'cmp') return '>, =, <'; return '';
  }
  function hintH(p) { var h = hintOf(AR.BY[p.s]); return h ? '<span class="ar-hint">' + esc(h) + '</span>' : '' }
  function gtag(s) { return (s.ch ? '도전 · ' : '') + s.g + '학년' }

  /* ── 숫자판(전자칠판·태블릿용) ── */
  var kpOn = false; try { kpOn = localStorage.getItem(KEY + '-kp') === '1' } catch (e) {}
  var lastIn = null;
  document.addEventListener('focusin', function (e) { if (e.target.classList && e.target.classList.contains('ar-in')) lastIn = e.target });
  function kpApply() {
    document.querySelectorAll('.ar-in').forEach(function (x) { if (kpOn) { x.dataset.im = x.dataset.im || x.getAttribute('inputmode'); x.setAttribute('inputmode', 'none') } else if (x.dataset.im) x.setAttribute('inputmode', x.dataset.im) });
    var k = $('arKp'); if (k) k.hidden = !kpOn;
    document.querySelectorAll('.ar-kpt').forEach(function (b) { b.setAttribute('aria-pressed', kpOn ? 'true' : 'false') });
    document.body.classList.toggle('kp-on', kpOn);
  }
  function kpTarget() {
    if (lastIn && document.body.contains(lastIn) && lastIn.offsetParent) return lastIn;
    var all = [].slice.call(document.querySelectorAll('.ar-in')).filter(function (x) { return x.offsetParent && !x.disabled });
    return all.filter(function (x) { return !x.value })[0] || all[0];
  }
  function kpBuild() {
    var d = document.createElement('div'); d.id = 'arKp'; d.className = 'ar-kp'; d.hidden = true; d.setAttribute('aria-label', '숫자판');
    var ks = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '⌫'], h = '';
    ks.forEach(function (k) { h += '<button type="button" data-k="' + k + '">' + k + '</button>' });
    h += '<button type="button" data-k="tab" class="w">다음 칸 ⇥</button><button type="button" data-k="ok" class="w go">확인 ✔</button>';
    d.innerHTML = h; document.body.appendChild(d);
    d.addEventListener('mousedown', function (e) { e.preventDefault() });
    d.onclick = function (e) {
      var b = e.target.closest('button'); if (!b) return; var k = b.dataset.k, t = kpTarget();
      if (k === 'ok') { if (window.ARok) window.ARok(); return }
      if (!t) return;
      if (k === 'tab') { var all = [].slice.call(document.querySelectorAll('.ar-in')).filter(function (x) { return x.offsetParent && !x.disabled }), i = all.indexOf(t); (all[i + 1] || all[0]).focus(); return }
      if (k === '⌫') t.value = t.value.slice(0, -1); else t.value += k;
      t.focus(); t.dispatchEvent(new Event('input', { bubbles: true }));
    };
  }
  function kpToggle() { kpOn = !kpOn; try { localStorage.setItem(KEY + '-kp', kpOn ? '1' : '0') } catch (e) {} kpApply(); if (!kpOn && document.activeElement) document.activeElement.blur() }

  /* ── 인쇄 ── */
  function out(html) { $('arOut').innerHTML = html; setTimeout(function () { window.print() }, 350) }
  function paperH(title, sub, ask, ps, mode, cols) {
    var h = '<div class="ar-sheet' + (mode === 'key' ? ' key' : '') + '"><div class="sh-hd"><div><b>' + esc(title) + '</b><span>' + esc(sub) + (mode === 'key' ? ' · 정답' : '') + '</span></div>' +
      (mode === 'key' ? '' : '<div class="sh-nm">이름: <i></i> 맞은 개수: <i class="s"></i> / ' + ps.length + '</div>') + '</div>' +
      '<p class="sh-ask">' + esc(ask) + '</p><ol class="sh-ps c' + cols + '">';
    ps.forEach(function (p) { h += '<li>' + qH(p, mode) + '</li>' });
    return h + '</ol><p class="sh-ft">기초연산 · 초등교사 홍지희</p></div>';
  }
  function colsOf(ps) { var p = ps[0]; return p.v ? 3 : p.txt ? 1 : 2 }

  /* ════════ 영역 페이지 ════════ */
  function areaPage() {
    var A = AREA[PG.area], SS = AR.S.filter(function (s) { return s.ar === A.id }), cur = null;
    // 단계 목록
    function rec(id) { var r = st.s[id]; return r ? '최고 ' + r.b + '/' + r.n + ' · ' + tm(r.t) + (r.b === r.n ? ' ⭐' : '') : '' }
    function list() {
      var h = '', g = -1;
      SS.forEach(function (s, i) {
        var gg = s.g * 10 + (s.ch ? 1 : 0);
        if (gg !== g) { if (g >= 0) h += '</div>'; g = gg; h += '<h2 class="ar-gh">' + s.g + '학년' + (s.ch ? ' · 도전' : '') + '</h2><div class="ar-sl">' }
        var ex = AR.gen(s.id, s.id + '#ex');
        h += '<button type="button" class="ar-sk" data-id="' + s.id + '"><span class="no">' + (i + 1) + '</span><span class="tx"><b>' + esc(s.nm) + '</b><small>' + esc(s.de) + '</small>' +
          '<span class="eg">' + qH(ex, 'print') + '</span><i class="rec">' + rec(s.id) + '</i></span></button>';
      });
      $('arList').innerHTML = h + '</div>';
    }
    $('arList').onclick = function (e) { var b = e.target.closest('.ar-sk'); if (b) { open(b.dataset.id, 'p'); scrollTo(0, 0) } };

    function open(id, tab, ws) {
      cur = AR.BY[id]; document.body.classList.add('sk-open'); $('arPick').hidden = true; $('arSkill').hidden = false;
      var i = SS.indexOf(cur);
      $('skNo').textContent = A.name + ' ' + (i + 1) + '단계 · ' + gtag(cur);
      $('skTitle').textContent = cur.nm; $('skDe').textContent = cur.de;
      $('skPrev').disabled = i === 0; $('skNext').disabled = i === SS.length - 1;
      setTab(tab || 'p', ws);
    }
    function close() { stopTimer(); cur = null; document.body.classList.remove('sk-open'); $('arSkill').hidden = true; $('arPick').hidden = false; list(); history.replaceState(null, '', location.pathname); window.ARok = null }
    $('skBack').onclick = close;
    $('skPrev').onclick = function () { var i = SS.indexOf(cur); if (i > 0) open(SS[i - 1].id, 'p') };
    $('skNext').onclick = function () { var i = SS.indexOf(cur); if (i < SS.length - 1) open(SS[i + 1].id, 'p') };
    function setTab(t, ws) {
      document.querySelectorAll('#skTabs [data-t]').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.t === t ? 'true' : 'false') });
      $('tPrac').hidden = t !== 'p'; $('tWs').hidden = t !== 'w';
      if (t === 'p') { prSetup(); history.replaceState(null, '', '#' + cur.id) }
      else { stopTimer(); window.ARok = null; wsShow(ws || wsNo); }
    }
    $('skTabs').onclick = function (e) { var b = e.target.closest('[data-t]'); if (b) setTab(b.dataset.t) };

    /* 연습하기 */
    var PN = 10, ps = [], k = 0, tries = 0, right = 0, wrongs = [], t0 = 0, tick = null, done = false, lock = false;
    try { PN = +localStorage.getItem(KEY + '-n') || 10 } catch (e) {}
    function stopTimer() { if (tick) { clearInterval(tick); tick = null } }
    function prSetup() {
      stopTimer();
      $('prN').innerHTML = [10, 20, 30].map(function (n) { return '<button type="button" class="ar-b" data-n="' + n + '" aria-pressed="' + (n === PN ? 'true' : 'false') + '">' + n + '문제</button>' }).join('');
      $('prAsk').textContent = askOf(cur);
      start();
    }
    $('prN').onclick = function (e) { var b = e.target.closest('[data-n]'); if (!b) return; PN = +b.dataset.n; try { localStorage.setItem(KEY + '-n', PN) } catch (er) {} prSetup() };
    function start() {
      ps = AR.set(cur.id, Math.floor(Math.random() * 4294967296), PN); k = 0; right = 0; wrongs = []; done = false; t0 = Date.now();
      $('prEnd').hidden = true; $('prPlay').hidden = false; stopTimer();
      tick = setInterval(function () { $('prTime').textContent = '⏱️ ' + tm((Date.now() - t0) / 1000) }, 1000);
      $('prTime').textContent = '⏱️ 0초'; show();
    }
    function show() {
      tries = 0; lock = false; var p = ps[k];
      $('prCnt').textContent = (k + 1) + ' / ' + ps.length; $('prOk').textContent = '⭕ ' + right;
      $('prBar').style.width = (k / ps.length * 100) + '%';
      $('prQ').innerHTML = qH(p, 'live'); $('prMsg').textContent = ''; $('prMsg').className = 'ar-msg';
      $('prGo').hidden = false; $('prNext').hidden = true;
      kpApply(); bindSlot($('prQ'), p.a);
      var f = $('prQ').querySelector('.ar-in'); if (f && !kpOn) f.focus({ preventScroll: true }); else lastIn = f;
      window.ARok = check; window.ARcur = function () { return ps[k] };   // ARcur: 점검(Playwright)용
    }
    function bindSlot(el, a) {
      el.querySelectorAll('.ar-cb').forEach(function (b) {
        b.onclick = function () { var c = b.closest('.ar-cmp').querySelector('.ar-circ'); c.dataset.v = b.dataset.v; c.textContent = b.dataset.v;
          b.parentNode.querySelectorAll('.ar-cb').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false') });
          if (el.id === 'prQ') check() }
      });
      el.querySelectorAll('.ar-in').forEach(function (x) { x.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); if (el.id === 'prQ') { if (!$('prNext').hidden) next(); else check() } } } });
    }
    function check() {
      if (done || lock) return; if (!$('prNext').hidden) { next(); return }
      var p = ps[k], r = AR.judge(p.a, readSlot($('prQ'), p.a)), m = $('prMsg');
      if (r.empty) { m.textContent = '답을 써 주세요.'; m.className = 'ar-msg'; return }
      if (r.ok) {
        if (tries === 0) right++;
        m.innerHTML = tries ? '⭕ 맞았어요!' : pick(['⭕ 맞았어요!', '⭕ 잘했어요!', '⭕ 정답!']); m.className = 'ar-msg ok'; $('prOk').textContent = '⭕ ' + right;
        lock = true; setTimeout(next, 650); return;
      }
      if (r.near) { m.textContent = '💡 ' + r.near; m.className = 'ar-msg near'; return }
      tries++;
      if (tries === 1) { m.textContent = '❌ 다시 한 번 생각해 볼까요?'; m.className = 'ar-msg no'; var q = $('prQ'); q.classList.remove('shake'); void q.offsetWidth; q.classList.add('shake'); return }
      wrongs.push(p);
      m.innerHTML = '정답은 <b class="ar-key">' + ansH(p.a) + '</b> 이에요.'; m.className = 'ar-msg no';
      $('prGo').hidden = true; $('prNext').hidden = false; $('prNext').focus({ preventScroll: true });
    }
    function pick(a) { return a[Math.floor(Math.random() * a.length)] }
    function next() { if (done) return; k++; if (k < ps.length) show(); else end() }
    $('prGo').onclick = check; $('prNext').onclick = next;
    function end() {
      done = true; stopTimer(); window.ARok = null; var t = (Date.now() - t0) / 1000;
      $('prBar').style.width = '100%';
      var r = st.s[cur.id], better = !r || right / ps.length > r.b / r.n || (right / ps.length === r.b / r.n && t < r.t);
      if (better) { st.s[cur.id] = { b: right, n: ps.length, t: Math.round(t) }; save() }
      var star = right === ps.length ? '🌟 모두 맞혔어요!' : right >= ps.length * .8 ? '⭐ 아주 잘했어요!' : right >= ps.length * .5 ? '👍 조금만 더 연습해요.' : '💪 앞 단계부터 다시 해 볼까요?';
      var h = '<p class="big">' + star + '</p><p>' + ps.length + '문제 중 <b>' + right + '문제</b>를 한 번에 맞혔어요 · 걸린 시간 <b>' + tm(t) + '</b>' + (better ? ' · 🏅 새 기록' : '') + '</p>';
      if (wrongs.length) { h += '<h3>다시 볼 문제</h3><ol class="ar-wr">'; wrongs.forEach(function (p) { h += '<li>' + qH(p, 'key') + '</li>' }); h += '</ol>' }
      $('prRes').innerHTML = h; $('prPlay').hidden = true; $('prEnd').hidden = false;
      var i = SS.indexOf(cur); $('prNextSk').hidden = i === SS.length - 1;
    }
    $('prAgain').onclick = start;
    $('prNextSk').onclick = function () { $('skNext').click() };
    $('prToWs').onclick = function () { setTab('w') };

    /* 학습지 */
    var wsNo = 1;
    function wsShow(n) {
      wsNo = n; var h = ''; for (var i = 1; i <= 30; i++) h += '<button type="button" data-w="' + i + '" aria-current="' + (i === n ? 'true' : 'false') + '">' + i + '</button>';
      $('wsNos').innerHTML = h;
      $('wsView').innerHTML = wsPaper(n, 'print');
      history.replaceState(null, '', '#' + cur.id + '-ws' + n);
    }
    function wsPaper(n, mode) { var ps = AR.sheet(cur.id, n); return paperH(A.name + ' · ' + cur.nm, '학습지 ' + n + '번 · ' + gtag(cur), askOf(cur), ps, mode, colsOf(ps)) }
    $('wsNos').onclick = function (e) { var b = e.target.closest('[data-w]'); if (b) wsShow(+b.dataset.w) };
    $('wsPrint').onclick = function () { out(wsPaper(wsNo, 'print')) };
    $('wsKey').onclick = function () { out(wsPaper(wsNo, 'key')) };
    $('wsBoth').onclick = function () { out(wsPaper(wsNo, 'print') + wsPaper(wsNo, 'key')) };
    $('wsKeyView').onclick = function () { var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on ? 'true' : 'false'); $('wsView').innerHTML = wsPaper(wsNo, on ? 'key' : 'print') };

    list();
    var m = /^#([a-z]+\d+)(?:-ws(\d+))?$/.exec(location.hash);
    if (m && AR.BY[m[1]] && AR.BY[m[1]].ar === A.id) open(m[1], m[2] ? 'w' : 'p', m[2] ? Math.min(30, Math.max(1, +m[2])) : 0);
  }

  /* ════════ 급수 시험 ════════ */
  function rankPage() {
    var E = AR.EXAM, L = null, rd = 0, ps = [], t0 = 0, tick = null, graded = false;
    function lvOf(id) { return AR.LV.filter(function (x) { return x.id === id })[0] }
    function passCnt(id) { var r = st.r[id] || {}, c = 0; for (var k in r) if (r[k] >= E.pass) c++; return c }
    function list() {
      var h = '';
      AR.LV.forEach(function (l) {
        var names = l.k.map(function (k) { return AR.BY[k].nm }), ars = [];
        l.k.forEach(function (k) { var a = AREA[AR.BY[k].ar].name; if (ars.indexOf(a) < 0) ars.push(a) });
        var pc = passCnt(l.id);
        h += '<button type="button" class="ar-lv" data-l="' + l.id + '"><b>' + l.nm + '</b><span class="lv">' + esc(l.lv) + '</span><small>' + esc(ars.join(' · ')) + ' — ' + names.length + '가지 문제 유형</small>' +
          (pc ? '<i class="rec">합격 ' + pc + '회 / ' + E.rounds + '회' + (pc === E.rounds ? ' 🏆' : '') + '</i>' : '') + '</button>';
      });
      $('rkList').innerHTML = h;
      $('rkInfo').textContent = '12급(1학년 수준)부터 1급(6학년 수준)까지 12단계예요. 급마다 시험이 ' + E.rounds + '회 있고, 한 회는 ' + E.n + '문제, ' + E.pass + '문제 이상 맞히면 합격이에요. 급수와 합격 기준은 이 자료에서 연습용으로 정한 것이에요.';
    }
    $('rkList').onclick = function (e) { var b = e.target.closest('[data-l]'); if (b) { level(+b.dataset.l); scrollTo(0, 0) } };
    function level(id) {
      L = lvOf(id); stop(); document.body.classList.add('sk-open'); $('rkPick').hidden = true; $('rkLevel').hidden = false; $('rkExam').hidden = true;
      $('lvTitle').textContent = L.nm + ' · ' + L.lv;
      $('lvKinds').innerHTML = L.k.map(function (k) { var s = AR.BY[k]; return '<a href="' + AREA[s.ar].file + '#' + s.id + '">' + esc(AREA[s.ar].name + ' · ' + s.nm) + '</a>' }).join('');
      var h = '', r = st.r[L.id] || {};
      for (var i = 1; i <= E.rounds; i++) h += '<button type="button" class="ar-rd' + (r[i] >= E.pass ? ' pass' : r[i] != null ? ' done' : '') + '" data-r="' + i + '"><b>' + i + '회</b><span>' + (r[i] != null ? '최고 ' + r[i] + '/' + E.n + (r[i] >= E.pass ? ' · 합격' : '') : E.n + '문제') + '</span></button>';
      $('lvRounds').innerHTML = h; history.replaceState(null, '', '#lv' + L.id);
    }
    $('lvRounds').onclick = function (e) { var b = e.target.closest('[data-r]'); if (b) { exam(+b.dataset.r); scrollTo(0, 0) } };
    $('lvBack').onclick = function () { L = null; stop(); document.body.classList.remove('sk-open'); $('rkLevel').hidden = true; $('rkPick').hidden = false; list(); history.replaceState(null, '', location.pathname) };
    function stop() { if (tick) { clearInterval(tick); tick = null } }
    function exam(r) {
      rd = r; ps = AR.exam(L.id, r); graded = false; stop();
      $('rkLevel').hidden = true; $('rkExam').hidden = false; $('exRes').hidden = true;
      $('exTitle').textContent = L.nm + ' 시험 ' + r + '회';
      $('exKey').setAttribute('aria-pressed', 'false');
      var h = '<ol class="ex-ps">';
      ps.forEach(function (p, i) { h += '<li data-i="' + i + '"><span class="ex-mk"></span>' + hintH(p) + qH(p, 'live') + '</li>' });
      $('exPaper').innerHTML = h + '</ol>';
      $('exPaper').querySelectorAll('li').forEach(function (li) {
        var p = ps[+li.dataset.i];
        li.querySelectorAll('.ar-cb').forEach(function (b) { b.onclick = function () { if (graded) return; var c = li.querySelector('.ar-circ'); c.dataset.v = b.dataset.v; c.textContent = b.dataset.v; li.querySelectorAll('.ar-cb').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false') }) } });
        li.querySelectorAll('.ar-in').forEach(function (x) { x.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); var all = [].slice.call($('exPaper').querySelectorAll('.ar-in')), j = all.indexOf(x); if (all[j + 1]) all[j + 1].focus() } } });
      });
      t0 = Date.now(); $('exTime').textContent = '⏱️ 0초';
      tick = setInterval(function () { $('exTime').textContent = '⏱️ ' + tm((Date.now() - t0) / 1000) }, 1000);
      $('exPrev').disabled = r === 1; $('exNext').disabled = r === E.rounds;
      kpApply(); window.ARok = grade;
      history.replaceState(null, '', '#lv' + L.id + '-' + r);
    }
    function grade() {
      if (graded) return; var sc = 0, empty = 0;
      $('exPaper').querySelectorAll('li').forEach(function (li) { var p = ps[+li.dataset.i]; if (AR.judge(p.a, readSlot(li, p.a)).empty) empty++ });
      if (empty && !confirm('아직 안 푼 문제가 ' + empty + '개 있어요. 채점할까요?')) return;
      graded = true; stop(); var t = (Date.now() - t0) / 1000;
      $('exPaper').querySelectorAll('li').forEach(function (li) {
        var p = ps[+li.dataset.i], j = AR.judge(p.a, readSlot(li, p.a)), mk = li.querySelector('.ex-mk');
        if (j.ok) sc++;
        li.classList.add(j.ok ? 'ok' : 'no'); mk.textContent = j.ok ? '⭕' : '❌';
        if (!j.ok) { var d = document.createElement('div'); d.className = 'ex-ans'; d.innerHTML = '정답: <b class="ar-key">' + ansH(p.a) + '</b>'; li.appendChild(d) }
        li.querySelectorAll('.ar-in').forEach(function (x) { x.disabled = true });
      });
      var pass = sc >= E.pass, R = st.r[L.id] = st.r[L.id] || {}, best = R[rd] == null || sc > R[rd];
      if (best) { R[rd] = sc; save() }
      $('exRes').hidden = false;
      $('exRes').className = 'ar-res ' + (pass ? 'pass' : 'fail');
      $('exRes').innerHTML = '<p class="big">' + (pass ? '🏆 합격!' : '💪 아쉬워요. 다시 도전해요!') + '</p><p>' + E.n + '문제 중 <b>' + sc + '문제</b> 맞힘 (합격 ' + E.pass + '문제) · 걸린 시간 <b>' + tm(t) + '</b>' + (best && R[rd] === sc && sc ? ' · 🏅 이 회 최고 점수' : '') + '</p>';
      $('exRes').scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.ARok = null;
    }
    $('exGrade').onclick = grade; $('exGrade2').onclick = grade;
    $('exReset').onclick = function () { exam(rd) };
    $('exBack').onclick = function () { stop(); level(L.id) };
    $('exPrev').onclick = function () { if (rd > 1) exam(rd - 1) };
    $('exNext').onclick = function () { if (rd < E.rounds) exam(rd + 1) };
    $('exKey').onclick = function () {
      var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on ? 'true' : 'false');
      $('exPaper').querySelectorAll('li').forEach(function (li) {
        var old = li.querySelector('.ex-k'); if (old) old.remove();
        if (on) { var d = document.createElement('div'); d.className = 'ex-k'; d.innerHTML = '정답: <b class="ar-key">' + ansH(ps[+li.dataset.i].a) + '</b>'; li.appendChild(d) }
      });
    };
    function examPaper(mode) {
      var h = '<div class="ar-sheet' + (mode === 'key' ? ' key' : '') + '"><div class="sh-hd"><div><b>기초연산 ' + L.nm + ' 시험 ' + rd + '회</b><span>' + esc(L.lv) + ' · ' + E.n + '문제 · 합격 ' + E.pass + '문제' + (mode === 'key' ? ' · 정답' : '') + '</span></div>' +
        (mode === 'key' ? '' : '<div class="sh-nm">이름: <i></i> 걸린 시간: <i class="s"></i> 점수: <i class="s"></i> / ' + E.n + '</div>') + '</div><ol class="sh-ps c2 exm">';
      ps.forEach(function (p) { h += '<li>' + hintH(p) + qH(p, mode) + '</li>' });
      return h + '</ol><p class="sh-ft">급수와 합격 기준은 연습용으로 정한 것입니다 · 기초연산 · 초등교사 홍지희</p></div>';
    }
    $('exPrint').onclick = function () { out(examPaper('print')) };
    $('exPrintKey').onclick = function () { out(examPaper('key')) };

    list();
    var m = /^#lv(\d+)(?:-(\d+))?$/.exec(location.hash);
    if (m && lvOf(+m[1])) { level(+m[1]); if (m[2]) exam(Math.min(E.rounds, Math.max(1, +m[2]))) }
  }

  /* ── 일일수학(2026-10-07): 학년마다 날짜별 10문제 ── */
  function dailyPage() {
    var G = PG.daily, N = AR.DAILY.n, ps = [], ymd = '', t0 = 0, tick = null, graded = false, WD = '일월화수목금토';
    st.d = st.d || {}; var D = st.d[G] = st.d[G] || {};
    function p2(n) { return (n < 10 ? '0' : '') + n }
    function fmt(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) }
    function parse(s) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null }
    function today() { return fmt(new Date()) }
    function kr(s) { var d = parse(s); return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + WD[d.getDay()] + ')' }
    function shift(s, k) { var d = parse(s); d.setDate(d.getDate() + k); return fmt(d) }
    function stop() { if (tick) { clearInterval(tick); tick = null } }
    function load(s) {
      ymd = s; ps = AR.daily(G, ymd); graded = false; stop();
      $('dyDate').value = ymd; $('dyRes').hidden = true; $('dyKey').setAttribute('aria-pressed', 'false');
      $('dyTitle').textContent = G + '학년 일일수학 · ' + kr(ymd) + (ymd === today() ? ' · 오늘' : '');
      $('dyInfo').textContent = '같은 날 같은 학년이면 누구나 같은 10문제예요. 다 풀고 채점해요.' + (D[ymd] != null ? ' (이 날 최고 ' + D[ymd] + '/' + N + ')' : '');
      var h = '<ol class="ex-ps">';
      ps.forEach(function (p, i) { h += '<li data-i="' + i + '"><span class="ex-mk"></span>' + hintH(p) + qH(p, 'live') + '</li>' });
      $('dyPaper').innerHTML = h + '</ol>';
      $('dyPaper').querySelectorAll('li').forEach(function (li) {
        li.querySelectorAll('.ar-cb').forEach(function (b) { b.onclick = function () { if (graded) return; var c = li.querySelector('.ar-circ'); c.dataset.v = b.dataset.v; c.textContent = b.dataset.v; li.querySelectorAll('.ar-cb').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false') }) } });
        li.querySelectorAll('.ar-in').forEach(function (x) { x.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); var all = [].slice.call($('dyPaper').querySelectorAll('.ar-in')), j = all.indexOf(x); if (all[j + 1]) all[j + 1].focus() } } });
      });
      t0 = Date.now(); $('dyTime').textContent = '⏱️ 0초';
      tick = setInterval(function () { $('dyTime').textContent = '⏱️ ' + tm((Date.now() - t0) / 1000) }, 1000);
      kpApply(); window.ARok = grade; cal();
      history.replaceState(null, '', '#' + ymd);
    }
    function grade() {
      if (graded) return; var sc = 0, empty = 0;
      $('dyPaper').querySelectorAll('li').forEach(function (li) { var p = ps[+li.dataset.i]; if (AR.judge(p.a, readSlot(li, p.a)).empty) empty++ });
      if (empty && !confirm('아직 안 푼 문제가 ' + empty + '개 있어요. 채점할까요?')) return;
      graded = true; stop(); var t = (Date.now() - t0) / 1000;
      $('dyPaper').querySelectorAll('li').forEach(function (li) {
        var p = ps[+li.dataset.i], j = AR.judge(p.a, readSlot(li, p.a)), mk = li.querySelector('.ex-mk');
        if (j.ok) sc++;
        li.classList.add(j.ok ? 'ok' : 'no'); mk.textContent = j.ok ? '⭕' : '❌';
        if (!j.ok) { var d = document.createElement('div'); d.className = 'ex-ans'; d.innerHTML = (j.near ? '💡 ' + esc(j.near) + ' ' : '') + '정답: <b class="ar-key">' + ansH(p.a) + '</b>'; li.appendChild(d) }
        li.querySelectorAll('.ar-in').forEach(function (x) { x.disabled = true });
      });
      var best = D[ymd] == null || sc > D[ymd]; if (best) { D[ymd] = sc; save() }
      var streak = 0, d = ymd; while (D[d] != null) { streak++; d = shift(d, -1) }
      $('dyRes').hidden = false; $('dyRes').className = 'ar-res ' + (sc === N ? 'pass' : sc >= N * .7 ? 'pass' : 'fail');
      $('dyRes').innerHTML = '<p class="big">' + (sc === N ? '⭐ 모두 맞혔어요!' : sc >= N * .7 ? '👍 잘했어요!' : '💪 틀린 문제를 다시 살펴봐요!') + '</p><p>' + N + '문제 중 <b>' + sc + '문제</b> 맞힘 · 걸린 시간 <b>' + tm(t) + '</b>' + (streak > 1 ? ' · 🔥 ' + streak + '일 이어서 풀었어요' : '') + '</p>';
      $('dyRes').scrollIntoView({ behavior: 'smooth', block: 'center' });
      window.ARok = null; cal();
    }
    function cal() {
      var d0 = parse(ymd), y = d0.getFullYear(), m = d0.getMonth(), first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), td = today(), h = '';
      $('dyCalT').textContent = '📅 ' + y + '년 ' + (m + 1) + '월 도장';
      for (var i = 0; i < 7; i++) h += '<span class="dy-wd">' + WD[i] + '</span>';
      for (i = 0; i < first.getDay(); i++) h += '<span></span>';
      for (var dd = 1; dd <= days; dd++) { var s = y + '-' + p2(m + 1) + '-' + p2(dd), v = D[s]; h += '<button type="button" class="dy-day' + (s === ymd ? ' dy-cur' : '') + (s === td ? ' dy-td' : '') + (v === N ? ' dy-star' : v != null ? ' dy-done' : '') + '" data-d="' + s + '"><b>' + dd + '</b><small>' + (v === N ? '⭐' : v != null ? '✔ ' + v : '') + '</small></button>' }
      $('dyCal').innerHTML = h;
    }
    $('dyCal').onclick = function (e) { var b = e.target.closest('[data-d]'); if (b) { load(b.dataset.d); scrollTo(0, 0) } };
    $('dyPrev').onclick = function () { load(shift(ymd, -1)) };
    $('dyNext').onclick = function () { load(shift(ymd, 1)) };
    $('dyToday').onclick = function () { load(today()) };
    $('dyDate').onchange = function () { if (parse(this.value)) load(this.value) };
    $('dyGrade').onclick = grade; $('dyGrade2').onclick = grade;
    $('dyReset').onclick = function () { load(ymd) };
    $('dyKey').onclick = function () {
      var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', on ? 'true' : 'false');
      $('dyPaper').querySelectorAll('li').forEach(function (li) { var old = li.querySelector('.ex-k'); if (old) old.remove(); if (on) { var d = document.createElement('div'); d.className = 'ex-k'; d.innerHTML = '정답: <b class="ar-key">' + ansH(ps[+li.dataset.i].a) + '</b>'; li.appendChild(d) } });
    };
    function paper(s, mode) {
      var q = AR.daily(G, s), h = '<div class="ar-sheet' + (mode === 'key' ? ' key' : '') + '"><div class="sh-hd"><div><b>' + G + '학년 일일수학 · ' + kr(s) + '</b><span>' + N + '문제' + (mode === 'key' ? ' · 정답' : ' · 계산은 문제 아래 빈 곳에') + '</span></div>' +
        (mode === 'key' ? '' : '<div class="sh-nm">이름: <i></i> 맞은 개수: <i class="s"></i> / ' + N + '</div>') + '</div><ol class="sh-ps c2 exm">';
      q.forEach(function (p) { h += '<li>' + hintH(p) + qH(p, mode) + '</li>' });
      return h + '</ol><p class="sh-ft">일일수학 · 초등교사 홍지희</p></div>';
    }
    function week() { var d = parse(ymd), k = (d.getDay() + 6) % 7, mon = shift(ymd, -k), o = []; for (var i = 0; i < 5; i++) o.push(shift(mon, i)); return o }
    $('dyPrint').onclick = function () { out(paper(ymd, 'print')) };
    $('dyPrintKey').onclick = function () { out(paper(ymd, 'key')) };
    $('dyWeek').onclick = function () { out(week().map(function (s) { return paper(s, 'print') }).join('')) };
    $('dyWeekKey').onclick = function () { out(week().map(function (s) { return paper(s, 'key') }).join('')) };
    var m = /^#(\d{4}-\d\d-\d\d)$/.exec(location.hash);
    load(m && parse(m[1]) ? m[1] : today());
  }

  /* ── 공통 ── */
  var nav = '';
  if (PG.daily) { for (var gi = 1; gi <= 6; gi++) nav += '<a href="g' + gi + '.html"' + (PG.daily === gi ? ' aria-current="page"' : '') + '>' + gi + '학년</a>' }
  else {
  AR.AREAS.forEach(function (a) { nav += '<a href="' + a.file + '"' + (PG.area === a.id ? ' aria-current="page"' : '') + '>' + a.ico + ' ' + a.name + '</a>' });
  var RK = 'rank.html'; nav += '<a href="' + RK + '" class="rk"' + (PG.rank ? ' aria-current="page"' : '') + '>🏆 급수 시험</a>';
  }
  $('arNav').innerHTML = nav;
  kpBuild();
  document.querySelectorAll('.ar-kpt').forEach(function (b) { b.onclick = kpToggle });
  if (PG.daily) dailyPage(); else if (PG.rank) rankPage(); else areaPage();
  kpApply();
  var h = location.hostname, okHost = location.protocol === 'file:' || /github\.io$/.test(h) || h === 'localhost' || h === '127.0.0.1';
  if (okHost) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
