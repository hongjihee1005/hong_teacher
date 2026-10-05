/* 독서교육 추천도서 페이지: 추천 기관 수(많은 순)로 묶어 보여 주기 · 찾기 · 갈래/학년 고르기 · 읽었어요 표시 · 독서 기록표 인쇄 (자료 window.RD — build.py) */
(function () {
  var D = window.RD, $ = function (id) { return document.getElementById(id) };
  var KEY = 'hj-reading-v1', store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {} } catch (e) { store = {} }
  if (!store.read) store.read = {};
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)) } catch (e) { } }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  var KC = { '그림책': '#E0567A', '동화': '#7B4FB0', '지식책': '#2F74E0', '시·동시': '#3E9A3E', '옛이야기': '#D9731A', '인물 이야기': '#B7791F', '만화': '#1F7A8C' };
  var BAND = { '1-2': '1·2학년', '3-4': '3·4학년', '5-6': '5·6학년' };
  var app = $('rdApp');

  if (D.page === 'orgs') return orgsPage();

  var st = { q: '', kind: '', band: '', subj: '', org: '', only: '' };
  var B = D.books;
  var kinds = uniq(B.map(function (b) { return b.kind }));
  var bands = uniq(B.map(function (b) { return b.band })).sort();
  var subjs = D.subjChips ? uniq([].concat.apply([], B.map(function (b) { return b.subjects.filter(function (s) { return D.subjChips.indexOf(s) >= 0 }) }))) : [];
  var orgs = uniq([].concat.apply([], B.map(function (b) { return b.recs.map(function (r) { return r.org }) }))).sort(function (a, b) { return cntOrg(b) - cntOrg(a) || (a < b ? -1 : 1) });
  function cntOrg(o) { return B.filter(function (b) { return b.recs.some(function (r) { return r.org === o }) }).length }
  function uniq(a) { var o = []; a.forEach(function (x) { if (x && o.indexOf(x) < 0) o.push(x) }); return o }
  var multi = B.filter(function (b) { return b.recs.length >= 2 }).length;

  app.innerHTML =
    '<details class="rd-how"><summary>💡 이 목록은 이렇게 골랐어요</summary>' + D.how + '</details>' +
    '<div class="rd-stat"><span>모두 ' + B.length + '권</span><span class="g">⭐ 두 곳 이상이 함께 추천 ' + multi + '권</span><span>추천 기관 ' + orgs.length + '곳</span><span id="rdDone"></span></div>' +
    '<div class="rd-ctl"><input type="search" id="rdQ" placeholder="🔍 책 제목·지은이·내용으로 찾기" aria-label="책 찾기">' +
    '<select id="rdOrg" aria-label="추천 기관으로 고르기"><option value="">🏛️ 모든 추천 기관</option>' + orgs.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + ' (' + cntOrg(o) + ')</option>' }).join('') + '</select>' +
    '<button type="button" class="rd-b" id="rdPrint">🖨️ 독서 기록표 인쇄</button></div>' +
    '<div class="rd-kinds" id="rdChips"></div>' +
    '<p class="rd-cnt" id="rdCnt" aria-live="polite"></p><div id="rdList"></div>';

  function chips() {
    var h = '';
    if (bands.length > 1) h += chipRow('band', '전체 학년', bands.map(function (b) { return [b, BAND[b] || b] }));
    if (subjs.length > 1) h += chipRow('subj', '모두', subjs.map(function (s) { return [s, s] }));
    if (kinds.length > 1) h += chipRow('kind', '모든 갈래', kinds.map(function (k) { return [k, k] }));
    h += '<button type="button" class="rd-b" data-f="only" data-v="todo" aria-pressed="' + (st.only === 'todo') + '">아직 안 읽은 책만</button>';
    $('rdChips').innerHTML = h;
  }
  function chipRow(f, all, items) {
    return '<button type="button" class="rd-b" data-f="' + f + '" data-v="" aria-pressed="' + (!st[f]) + '">' + all + '</button>' +
      items.map(function (it) { return '<button type="button" class="rd-b" data-f="' + f + '" data-v="' + esc(it[0]) + '" aria-pressed="' + (st[f] === it[0]) + '">' + esc(it[1]) + '</button>' }).join('') +
      '<span style="flex-basis:100%;height:0"></span>';
  }
  function match(b) {
    if (st.kind && b.kind !== st.kind) return false;
    if (st.band && b.band !== st.band) return false;
    if (st.subj && b.subjects.indexOf(st.subj) < 0) return false;
    if (st.org && !b.recs.some(function (r) { return r.org === st.org })) return false;
    if (st.only === 'todo' && store.read[b.id]) return false;
    if (st.q) {
      var t = (b.title + ' ' + b.author + ' ' + b.publisher + ' ' + b.desc + ' ' + b.link + ' ' + b.kind).toLowerCase();
      if (st.q.toLowerCase().split(/\s+/).some(function (w) { return w && t.indexOf(w) < 0 })) return false;
    }
    return true;
  }
  function card(b, n) {
    var k = KC[b.kind] || 'var(--acc)', r = b.recs.length;
    return '<article class="rd-bk' + (store.read[b.id] ? ' done' : '') + '" style="--kc:' + k + '" data-id="' + esc(b.id) + '">' +
      '<div class="rd-top"><span class="rd-no">' + n + '</span><div class="rd-tt"><b>' + esc(b.title) + '</b><span class="rd-by">' + esc(b.author) + ' · ' + esc(b.publisher) + '</span></div></div>' +
      '<div class="rd-tags"><span class="rd-tag n' + (r >= 3 ? ' top' : '') + '">' + (r >= 2 ? '⭐ ' : '') + r + '곳 추천</span><span class="rd-tag k">' + esc(b.kind) + '</span>' +
      (D.showGrade ? '<span class="rd-tag">' + (b.grade ? b.grade + '학년' : BAND[b.band]) + '</span>' : '') +
      (D.showSubj ? b.subjects.map(function (s) { return '<span class="rd-tag">' + esc(s) + '</span>' }).join('') : '') + '</div>' +
      (b.desc ? '<p class="rd-desc">' + esc(b.desc) + '</p>' : '') +
      (b.link ? '<p class="rd-link"><b>이어지는 공부</b> · ' + esc(b.link) + '</p>' : '') +
      '<div class="rd-recs"><span class="h">추천한 곳 (누르면 확인한 출처가 열려요)</span>' + b.recs.map(function (x) {
        return x.url ? '<a href="' + esc(x.url) + '" target="_blank" rel="noopener"><b>' + esc(x.org) + '</b> <i>' + esc(x.detail) + '</i></a>' : '<span class="o"><b>' + esc(x.org) + '</b> <i>' + esc(x.detail) + '</i></span>';
      }).join('') + '</div>' +
      (b.awards && b.awards.length ? '<p class="rd-aw">🏅 ' + b.awards.map(esc).join(' · ') + '</p>' : '') +
      '<label class="rd-chk"><input type="checkbox" data-read="' + esc(b.id) + '"' + (store.read[b.id] ? ' checked' : '') + '> 읽었어요</label>' +
      '</article>';
  }
  var GR = [[3, '⭐ 세 곳 이상이 함께 추천한 책'], [2, '⭐ 두 곳이 함께 추천한 책'], [1, '한 곳이 추천한 책']];
  function shown() { return B.filter(match) }
  function render() {
    var L = shown(), h = '', n = 0;
    GR.forEach(function (g, i) {
      var part = L.filter(function (b) { var c = b.recs.length; return i === 0 ? c >= 3 : c === g[0] });
      if (!part.length) return;
      h += '<h2 class="rd-grp">' + g[1] + ' <small>' + part.length + '권</small></h2><div class="rd-list">' + part.map(function (b) { return card(b, ++n) }).join('') + '</div>';
    });
    $('rdList').innerHTML = h || '<p class="rd-empty">고른 조건에 맞는 책이 없어요. 조건을 바꿔 보세요.</p>';
    $('rdCnt').textContent = L.length === B.length ? '추천 기관이 많은 책부터 놓았어요.' : '조건에 맞는 책 ' + L.length + '권';
    done();
  }
  function done() {
    var c = B.filter(function (b) { return store.read[b.id] }).length;
    $('rdDone').textContent = '📖 읽은 책 ' + c + ' / ' + B.length;
  }
  chips(); render();
  $('rdQ').addEventListener('input', function () { st.q = this.value.trim(); render() });
  $('rdOrg').addEventListener('change', function () { st.org = this.value; render() });
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
    $('rdOut').innerHTML = '<h2>📚 ' + esc(D.title) + ' — 독서 기록표</h2><p class="meta">이름: ________________ &nbsp; ' + (L.length < B.length ? '(고른 책 ' + L.length + '권)' : '(모두 ' + L.length + '권, 추천 기관이 많은 책부터)') + '</p>' +
      '<table><thead><tr><th>번호</th><th>책 제목 · 지은이 · 출판사</th><th>추천한 곳</th><th style="width:16%">읽은 날</th><th style="width:22%">한 줄 느낌</th></tr></thead><tbody>' +
      L.map(function (b) {
        return '<tr><td class="c">' + (++n) + '</td><td><b>' + esc(b.title) + '</b><br>' + esc(b.author) + ' · ' + esc(b.publisher) + '</td><td class="o">' + b.recs.map(function (r) { return esc(r.org) }).join(', ') + '</td><td></td><td></td></tr>';
      }).join('') + '</tbody></table><p class="src">추천 기관은 각 기관의 추천·권장 도서 목록과 그 목록을 실은 도서관·교육청·서점 자료에서 확인했어요(' + esc(D.asof) + ' 기준). 출처 주소는 화면의 기관 이름을 누르면 볼 수 있어요. · 만든 사람: 초등교사 홍지희</p>';
    window.print();
  });

  function orgsPage() {
    var O = D.orgList;
    app.innerHTML = '<div class="rd-how">' + D.how + '</div>' + O.map(function (o) {
      return '<section class="rd-org"><h3>🏛️ ' + esc(o.name) + ' <small class="rd-note">· 이 자료에 ' + o.books.length + '권</small></h3>' +
        (o.full && o.full !== o.name ? '<p class="rd-note">' + esc(o.full) + '</p>' : '') + '<p>' + esc(o.about) + '</p>' +
        (o.home ? '<p><a class="rd-b" href="' + esc(o.home) + '" target="_blank" rel="noopener">🔗 누리집 열기</a></p>' : '') +
        '<div class="bl">' + o.books.map(function (b) { return '<a href="' + esc(b[1]) + '">' + esc(b[0]) + '</a>' }).join('') + '</div></section>';
    }).join('');
  }
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
