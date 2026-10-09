(function () {
  var KEY = 'hj-labguide-v1';
  var st = { s: '1', u: { '1': '0', '2': '0' }, hand: false, done: {} };
  try { var o = JSON.parse(localStorage.getItem(KEY) || '{}'); if (o && typeof o === 'object') { for (var k in o) st[k] = o[k]; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var $ = function (q, r) { return Array.prototype.slice.call((r || document).querySelectorAll(q)); };
  var hand = document.getElementById('lgHand');

  function show() {
    var s = st.s, u = st.u[s] || '0', n = 0, nd = 0;
    $('.lg-sb').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.s === s ? 'true' : 'false'); });
    $('.lg-units').forEach(function (g) { g.hidden = g.dataset.s !== s; });
    $('.lg-units[data-s="' + s + '"] .lg-ub').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.u === u ? 'true' : 'false'); });
    $('.lg-tl').forEach(function (g) { g.hidden = g.dataset.s !== s; });
    $('.lg-card').forEach(function (c) {
      var on = c.dataset.s === s && (u === '0' || c.dataset.u === u) && (!st.hand || c.dataset.hand === '1');
      c.hidden = !on;
      if (on) { n++; if (st.done[c.id]) nd++; }
    });
    hand.checked = !!st.hand;
    document.getElementById('lgCount').textContent = '보이는 차시 ' + n + '개 · 준비 끝 ' + nd + '개';
  }

  $('.lg-sb').forEach(function (b) { b.addEventListener('click', function () { st.s = b.dataset.s; save(); show(); }); });
  $('.lg-ub').forEach(function (b) { b.addEventListener('click', function () { st.u[b.closest('.lg-units').dataset.s] = b.dataset.u; save(); show(); }); });
  hand.addEventListener('change', function () { st.hand = hand.checked; save(); show(); });

  $('.lg-ok').forEach(function (c) {
    var card = c.closest('.lg-card');
    c.checked = !!st.done[c.dataset.key];
    card.classList.toggle('lg-isdone', c.checked);
    c.addEventListener('change', function () {
      if (c.checked) st.done[c.dataset.key] = 1; else delete st.done[c.dataset.key];
      card.classList.toggle('lg-isdone', c.checked); save(); show();
    });
  });
  document.getElementById('lgReset').addEventListener('click', function () {
    if (!confirm('준비 끝 표시와 준비물 체크를 모두 지울까요?')) return;
    st.done = {}; save();
    $('.lg-ok,.lg-pc').forEach(function (c) { c.checked = false; });
    $('.lg-card').forEach(function (c) { c.classList.remove('lg-isdone'); });
    show();
  });

  // 인쇄할 때는 접힌 '실험 순서'도 펼침
  var opened = [];
  window.addEventListener('beforeprint', function () { opened = $('details.lg-steps:not([open])'); opened.forEach(function (d) { d.open = true; }); });
  window.addEventListener('afterprint', function () { opened.forEach(function (d) { d.open = false; }); opened = []; });
  document.getElementById('lgPrint').addEventListener('click', function () { document.body.classList.remove('lg-plist'); window.print(); });
  // 준비물만: 준비물(물건 줄)과 미리 할 일만 촘촘히
  document.getElementById('lgPrintList').addEventListener('click', function () {
    document.body.classList.add('lg-plist'); window.print();
    setTimeout(function () { document.body.classList.remove('lg-plist'); }, 500);
  });
  window.addEventListener('afterprint', function () { document.body.classList.remove('lg-plist'); });

  // 주소의 #차시(예: #sci32-u2-l5)로 열면 그 학기·카드로
  var h = decodeURIComponent(location.hash.slice(1)), t = h && document.getElementById(h);
  if (t && t.classList.contains('lg-card')) { st.s = t.dataset.s; st.u[st.s] = '0'; st.hand = false; }
  show();
  if (t && t.classList.contains('lg-card')) setTimeout(function () { t.scrollIntoView(); }, 50);
  // 미리 할 일 목록의 링크: 그 학기 전체를 보이게 한 뒤 이동
  $('.lg-tl a').forEach(function (a) {
    a.addEventListener('click', function () { var c = document.getElementById(a.getAttribute('href').slice(1)); if (c) { st.u[c.dataset.s] = '0'; st.hand = false; show(); } });
  });
})();
