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
    '<button type="button" class="rd-b go" id="rdSheet">📝 활동지 인쇄</button><button type="button" class="rd-b" id="rdPrint">🖨️ 독서 기록표 인쇄</button></div>' +
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
      '<div class="rd-recs"><span class="h">확인한 출처 (누르면 열려요)</span>' + b.recs.concat((b.made || []).map(function (x) { return { org: '🤝 ' + x.org, detail: '함께 만든 곳 · ' + x.detail, url: x.url } }), [b.src]).map(function (x) {
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
    $('rdOut').className = '';
    $('rdOut').innerHTML = '<h2>🌏 ' + esc(D.topic) + ' — ' + esc(D.band) + ' 독서 기록표</h2><p class="meta">이름: ________________ &nbsp; ' + (L.length < B.length ? '(고른 책 ' + L.length + '권)' : '(모두 ' + L.length + '권)') + '</p>' +
      '<table><thead><tr><th>번호</th><th>책 제목 · 지은이 · 출판사</th><th style="width:30%">함께 이야기할 질문</th><th style="width:12%">읽은 날</th><th style="width:24%">내 생각 한 줄</th></tr></thead><tbody>' +
      L.map(function (b) {
        return '<tr><td class="c">' + (++n) + '</td><td><b>' + esc(b.title) + '</b><br>' + esc(b.author) + ' · ' + esc(b.publisher) + ' (' + b.year + ')</td><td class="o">' + esc(b.ask) + '</td><td></td><td></td></tr>';
      }).join('') + '</tbody></table><p class="src">국내 초판이 2015년 이후인 책만 골랐고, 책 정보와 추천 근거는 ' + esc(D.asof) + ' 기준 검색으로 확인했어요. · 만든 사람: 초등교사 홍지희</p>';
    window.print();
  });

  /* 활동지(학년 묶음마다 1종, 이 묶음의 어떤 책에도 씀) */
  function ln(n) { var h = ''; for (var i = 0; i < n; i++) h += '<div class="wl"></div>'; return h }
  function q(no, t, body) { return '<section class="wq"><h3><b class="wno">' + no + '</b>' + t + '</h3>' + body + '</section>' }
  function sheet() {
    var k = D.bandKey, T = esc(D.topic.replace(/^\d+\.\s*/, ''));
    var pick = '<p class="wpick' + (B.length > 3 ? ' many' : '') + '"><b>읽은 책에 ○ 하세요</b> ' + B.map(function (b) { return '<span>' + esc(b.title) + '</span>' }).join('') + '<span>다른 책: ____________</span></p>';
    var head = '<div class="wh"><p class="wt">📖 책으로 만나는 세계시민 <small>' + esc(D.band) + '</small></p><p class="wtp">주제 · ' + esc(D.topic) + '</p>' +
      '<p class="wn">' + (k === 'low' ? '' : '____학년 ____반 ____번 ') + '이름 ______________ &nbsp; 날짜 ____월 ____일</p></div>' + pick;
    var body;
    if (k === 'low') body =
      q(1, '내가 읽은 책의 제목을 써요.', ln(1)) +
      q(2, '가장 기억에 남는 장면을 그려요.', '<div class="wb" style="height:52mm"></div><p class="wf">이 장면에서 ' + ln(1).replace('wl', 'wl in') + '</p>') +
      q(3, '주인공의 마음은 어땠을까요? 알맞은 곳에 ○ 해요.', '<p class="wch"><span>😊 기뻐요</span><span>😢 슬퍼요</span><span>😠 화나요</span><span>😲 놀라요</span><span>😟 걱정돼요</span></p><p class="wf">왜냐하면</p>' + ln(1)) +
      q(4, '내가 주인공이라면 어떻게 했을까요?', ln(2)) +
      q(5, '세계시민 약속', '<p class="wf big">나는 ____________________________________ 할게요.</p><p class="wf">이 책은 몇 개의 별을 줄까요? <span class="stars">☆ ☆ ☆ ☆ ☆</span></p>');
    else if (k === 'mid') body =
      q(1, '책 정보', '<p class="wf">제목 ______________________________ &nbsp; 지은이 __________________</p>') +
      q(2, '줄거리를 세 칸으로 정리해요.', '<div class="w3"><div><b>처음</b></div><div><b>가운데</b></div><div><b>끝</b></div></div>') +
      q(3, '이 책은 이번 주제(' + T + ')와 어떻게 이어질까요?', ln(3)) +
      q(4, '읽고 나서 궁금한 점을 질문으로 만들어요.', '<p class="wtip">질문 시작말: 왜 … ? · 만약 … 라면? · 어떻게 하면 … ?</p><p class="wf">질문 ①</p>' + ln(1) + '<p class="wf">질문 ②</p>' + ln(1)) +
      q(5, '친구의 생각을 들어요.', '<table class="wtb"><tr><th style="width:22%">친구 이름</th><th>친구 생각</th><th style="width:28%">나와 같은 점·다른 점</th></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>') +
      q(6, '나의 실천 다짐', '<p class="wf">나는 이번 주에 ______________________________________ 을/를 실천할게요.</p><table class="wtb wk"><tr><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table>');
    else body =
      q(1, '책 정보', '<p class="wf">제목 ________________________ 지은이 ______________ 출판사 ____________ 갈래 ________</p>') +
      q(2, '책 속 문제를 살펴봐요.', '<table class="wtb tall"><tr><th style="width:24%">어떤 문제가 있나요?</th><td></td></tr><tr><th>왜 생겼을까요? (원인)</th><td></td></tr><tr><th>누구에게 어떤 영향을 주나요?</th><td></td></tr></table>') +
      q(3, '서로 다른 처지에서 생각해요.', '<table class="wtb tall"><tr><th style="width:18%"></th><th>인물 ① ____________</th><th>인물 ② ____________</th></tr><tr><th>처지</th><td></td><td></td></tr><tr><th>생각·마음</th><td></td><td></td></tr><tr><th>바라는 것</th><td></td><td></td></tr></table>') +
      q(4, '세계시민의 세 눈으로 이번 주제(' + T + ')를 봐요.', '<table class="wtb tall"><tr><th style="width:24%">🧠 알게 된 것<br><small>(인지)</small></th><td></td></tr><tr><th>💗 느낀 것<br><small>(사회정서)</small></th><td></td></tr><tr><th>✋ 할 수 있는 행동<br><small>(행동)</small></th><td></td></tr></table>') +
      q(5, '나의 실천 계획', '<table class="wtb"><tr><th>무엇을</th><th>언제</th><th>누구와</th><th>어떻게</th></tr><tr class="tall"><td></td><td></td><td></td><td></td></tr></table><p class="wf">실천해 보니 ______________________________________________________________</p>') +
      q(6, '친구에게 이 책을 추천하는 한 줄', ln(1));
    $('rdOut').className = 'ws ws-' + k;
    $('rdOut').innerHTML = head + body + '<p class="src">이 활동지는 이 주제·학년 묶음의 어떤 책에도 쓸 수 있어요. · 도서활용세계시민교육 · 만든 사람: 초등교사 홍지희</p>';
    window.print();
  }
  $('rdSheet').addEventListener('click', sheet);
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
