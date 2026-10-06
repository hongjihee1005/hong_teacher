/* 도서 활용 세계시민교육: 주제·학년 묶음별 책 목록 · 찾기 · 갈래 고르기 · 읽었어요 표시 · 독서 기록표 인쇄 (자료 window.RD — build.py) */
(function () {
  var D = window.RD, $ = function (id) { return document.getElementById(id) };
  var KEY = 'hj-gcedbooks-v1', store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {} } catch (e) { store = {} }
  if (!store.read) store.read = {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)) } catch (e) { } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  var KC = { '그림책': '#E0567A', '동화': '#7B4FB0', '지식책': '#2F74E0', '시·동시': '#3E9A3E', '인물 이야기': '#B7791F', '만화': '#1F7A8C' };
  var app = $('rdApp'), B = D.books, st = { q: '', kind: '', only: '' };
  function uniq(a) { var o = []; a.forEach(function (x) { if (x && o.indexOf(x) < 0) o.push(x) }); return o }
  var kinds = uniq(B.map(function (b) { return b.kind }));
  var fm = B.filter(function (b) { return b.famous }).length;

  app.innerHTML =
    '<div class="gb-topic"><p><b>🎯 이 주제에서 배우는 것</b> · ' + esc(D.goal) + '</p>' +
    '<div class="gb-go"><a class="rd-b" href="' + esc(D.lesson) + '">🌏 이 주제 수업 자료 열기</a><a class="rd-b" href="index.html">📋 이 주제의 학년 묶음</a></div></div>' +
    '<nav class="gb-bands" aria-label="학년 묶음">' + D.bands.map(function (x) {
      return x.cur ? '<span aria-current="page">' + esc(x.ico + ' ' + x.name) + ' · ' + x.n + '권</span>' : '<a href="' + esc(x.href) + '">' + esc(x.ico + ' ' + x.name) + ' · ' + x.n + '권</a>';
    }).join('') + '</nav>' +
    '<details class="rd-how"><summary>💡 이 목록은 이렇게 골랐어요</summary>' + D.how + '</details>' +
    '<div class="rd-stat"><span>모두 ' + B.length + '권</span>' + (fm ? '<span class="g">🏅 널리 알려진 책 ' + fm + '권</span>' : '') + '<span id="rdDone"></span></div>' +
    '<div class="rd-ctl"><input type="search" id="rdQ" placeholder="🔍 책 제목·지은이·내용으로 찾기" aria-label="책 찾기">' +
    '<button type="button" class="rd-b" id="rdPrint">🖨️ 독서 기록표 인쇄</button></div>' +
    '<div class="rd-kinds" id="rdChips"></div>' +
    '<p class="rd-cnt" id="rdCnt" aria-live="polite"></p><div id="rdList"></div>';

  function chips() {
    var h = '';
    if (kinds.length > 1) h += '<button type="button" class="rd-b" data-f="kind" data-v="" aria-pressed="' + (!st.kind) + '">모든 갈래</button>' +
      kinds.map(function (k) { return '<button type="button" class="rd-b" data-f="kind" data-v="' + esc(k) + '" aria-pressed="' + (st.kind === k) + '">' + esc(k) + '</button>' }).join('');
    h += '<button type="button" class="rd-b" data-f="only" data-v="todo" aria-pressed="' + (st.only === 'todo') + '">아직 안 읽은 책만</button>';
    $('rdChips').innerHTML = h;
  }
  function match(b) {
    if (st.kind && b.kind !== st.kind) return false;
    if (st.only === 'todo' && store.read[b.id]) return false;
    if (st.q) {
      var t = (b.title + ' ' + b.author + ' ' + b.publisher + ' ' + b.desc + ' ' + b.fit + ' ' + b.kind).toLowerCase();
      if (st.q.toLowerCase().split(/\s+/).some(function (w) { return w && t.indexOf(w) < 0 })) return false;
    }
    return true;
  }
  function when(b) { return b.year + '년' + (b.month ? ' ' + b.month + '월' : '') }
  function card(b, n) {
    var k = KC[b.kind] || 'var(--acc)', r = b.recs.length;
    return '<article class="rd-bk' + (store.read[b.id] ? ' done' : '') + '" style="--kc:' + k + '" data-id="' + esc(b.id) + '">' +
      '<div class="rd-top"><span class="rd-no">' + n + '</span><div class="rd-tt"><b>' + esc(b.title) + '</b><span class="rd-by">' + esc(b.author) + ' · ' + esc(b.publisher) + '</span></div></div>' +
      '<div class="rd-tags"><span class="rd-tag k">' + esc(b.kind) + '</span><span class="rd-tag y">' + when(b) + (b.orig_year ? ' (원서 ' + b.orig_year + ')' : '') + '</span>' +
      (b.famous ? '<span class="rd-tag fm">🏅 널리 알려진 책</span>' : '') +
      (r ? '<span class="rd-tag n' + (r >= 2 ? ' top' : '') + '">' + (r >= 2 ? '⭐ ' : '') + r + '곳 추천</span>' : '') + '</div>' +
      (b.desc ? '<p class="rd-desc">' + esc(b.desc) + '</p>' : '') +
      (b.fit ? '<p class="gb-fit"><b>주제와 이어지는 점</b> · ' + esc(b.fit) + '</p>' : '') +
      (b.ask ? '<p class="gb-ask"><b>💬 함께 이야기해요</b> ' + esc(b.ask) + '</p>' : '') +
      (b.famous ? '<p class="gb-fm"><b>🏅</b> ' + esc(b.famous) + '</p>' : '') +
      '<div class="rd-recs"><span class="h">확인한 출처 (누르면 열려요)</span>' + b.recs.concat([b.src]).map(function (x) {
        var o = x.org || '책 정보';
        return x.url ? '<a href="' + esc(x.url) + '" target="_blank" rel="noopener"><b>' + esc(o) + '</b> <i>' + esc(x.detail) + '</i></a>' : '<span class="o"><b>' + esc(o) + '</b> <i>' + esc(x.detail) + '</i></span>';
      }).join('') + '</div>' +
      '<label class="rd-chk"><input type="checkbox" data-read="' + esc(b.id) + '"' + (store.read[b.id] ? ' checked' : '') + '> 읽었어요</label>' +
      '</article>';
  }
  function shown() { return B.filter(match) }
  function render() {
    var L = shown(), n = 0;
    $('rdList').innerHTML = L.length ? '<div class="rd-list">' + L.map(function (b) { return card(b, ++n) }).join('') + '</div>'
      : '<p class="rd-empty">' + (B.length ? '고른 조건에 맞는 책이 없어요. 조건을 바꿔 보세요.' : '이 학년 묶음은 아직 출처를 확인한 책이 없어요. 앞뒤 학년 묶음을 함께 보세요.') + '</p>';
    $('rdCnt').textContent = L.length === B.length ? '추천 근거가 확인된 책, 널리 알려진 책, 새로 나온 책 차례로 놓았어요.' : '조건에 맞는 책 ' + L.length + '권';
    done();
  }
  function done() {
    var c = B.filter(function (b) { return store.read[b.id] }).length;
    $('rdDone').textContent = '📖 읽은 책 ' + c + ' / ' + B.length;
  }
  chips(); render();
  $('rdQ').addEventListener('input', function () { st.q = this.value.trim(); render() });
  $('rdChips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]'); if (!b) return;
    var f = b.getAttribute('data-f'), v = b.getAttribute('data-v');
    st[f] = (f === 'only' && st.only === v) ? '' : v; chips(); render();
  });
  $('rdList').addEventListener('change', function (e) {
    var id = e.target.getAttribute('data-read'); if (!id) return;
    if (e.target.checked) store.read[id] = 1; else delete store.read[id];
    save(); e.target.closest('.rd-bk').classList.toggle('done', e.target.checked); done();
  });
  $('rdPrint').addEventListener('click', function () {
    var L = shown(), n = 0;
    $('rdOut').innerHTML = '<h2>🌏 ' + esc(D.topic) + ' — ' + esc(D.band) + ' 독서 기록표</h2><p class="meta">이름: ________________ &nbsp; ' + (L.length < B.length ? '(고른 책 ' + L.length + '권)' : '(모두 ' + L.length + '권)') + '</p>' +
      '<table><thead><tr><th>번호</th><th>책 제목 · 지은이 · 출판사</th><th style="width:30%">함께 이야기할 질문</th><th style="width:12%">읽은 날</th><th style="width:24%">내 생각 한 줄</th></tr></thead><tbody>' +
      L.map(function (b) {
        return '<tr><td class="c">' + (++n) + '</td><td><b>' + esc(b.title) + '</b><br>' + esc(b.author) + ' · ' + esc(b.publisher) + ' (' + b.year + ')</td><td class="o">' + esc(b.ask) + '</td><td></td><td></td></tr>';
      }).join('') + '</tbody></table><p class="src">국내 초판이 2015년 이후인 책만 골랐고, 책 정보와 추천 근거는 ' + esc(D.asof) + ' 기준 검색으로 확인했어요. · 만든 사람: 초등교사 홍지희</p>';
    window.print();
  });
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
