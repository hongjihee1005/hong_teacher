/* 그림 수학 사전 — 찾아보기 · 낱말 퀴즈 · 카드 인쇄. 자료 window.MD = {terms, area, mode, areas} */
window.TOOL = function (host, api) {
  var M = window.MD, ALL = M.terms, AN = M.areas, g = 0, q = '', esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) };
  var mine = ALL.filter(function (t) { return M.area === 'all' || M.area.split(',').indexOf(t.a) >= 0 });
  function fig(t) { return t.fig && FIG[t.fig] ? FIG[t.fig]() : '' }
  function frac(s) { return esc(s).replace(/(\d+)\/(\d+)/g, '<span class="fd-fr"><i>$1</i><i>$2</i></span>') }
  if (M.mode === 'quiz') return quiz();
  host.innerHTML = '<div class="tl-row md-tools"><input class="md-q" placeholder="낱말 찾기 (예: 평행)" aria-label="낱말 찾기"><span class="md-gs">' + ['전체', 1, 2, 3, 4, 5, 6].map(function (x, i) { return '<button type="button" class="tl-btn" data-g="' + i + '">' + (i ? x + '학년' : x) + '</button>' }).join('') + '</span></div>'
    + '<p class="md-cnt"></p><div class="md-grid"></div><div class="tl-row"><button type="button" class="tl-btn" data-a="cards">🖨️ 보이는 낱말 카드 인쇄</button><button type="button" class="tl-btn" data-a="list">🖨️ 낱말 목록 인쇄</button></div>'
    + '<div class="md-pop" hidden role="dialog" aria-modal="true"><div class="md-card"><button type="button" class="md-x" aria-label="닫기">✕</button><div class="md-body"></div></div></div><div id="mdSheet"></div>';
  var grid = host.querySelector('.md-grid'), pop = host.querySelector('.md-pop');
  function list() { return mine.filter(function (t) { return (!g || t.g === g) && (!q || (t.w + t.d + t.ex + t.rel).indexOf(q) >= 0) }) }
  function draw() {
    var L = list(); host.querySelector('.md-cnt').textContent = '낱말 ' + L.length + '개' + (q ? ' · “' + q + '” 찾기' : '');
    grid.innerHTML = L.map(function (t) { var i = ALL.indexOf(t); return '<button type="button" class="md-it" data-i="' + i + '"><span class="md-fig">' + (fig(t) || '<span class="md-ex">' + frac(t.ex || t.w) + '</span>') + '</span><b>' + esc(t.w) + '</b><small>' + t.g + '학년 · ' + AN[t.a] + '</small></button>' }).join('') || '<p class="tl-msg">찾는 낱말이 없어요. 다른 말로 찾아보세요.</p>';
    host.querySelectorAll('[data-g]').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.g === g ? 'true' : 'false') });
    api.bar('그림 수학 사전 · ' + (M.area === 'all' ? '모든 영역' : M.title));
  }
  function open(i) {
    var t = ALL[i], rel = t.rel ? t.rel.split(/,\s*/).map(function (w) { var j = ALL.findIndex(function (x) { return x.w === w || x.w.split('·').indexOf(w) >= 0 }); return j >= 0 ? '<button type="button" class="tl-btn md-rel" data-i="' + j + '">' + esc(w) + '</button>' : '<span class="md-rel0">' + esc(w) + '</span>' }).join('') : '';
    pop.querySelector('.md-body').innerHTML = '<p class="md-tag">' + t.g + '학년 · ' + AN[t.a] + '</p><h3>' + esc(t.w) + '</h3>' + (fig(t) ? '<div class="md-bigfig">' + fig(t) + '</div>' : '') + '<p class="md-d">' + frac(t.d) + '</p>' + (t.ex ? '<p class="md-e"><b>예</b> ' + frac(t.ex) + '</p>' : '') + (t.conf ? '<p class="md-c"><b>⚠️ 헷갈리기 쉬워요</b> ' + frac(t.conf) + '</p>' : '') + (rel ? '<p class="md-r"><b>🔗 함께 알아 두면 좋은 낱말</b> ' + rel + '</p>' : '');
    pop.hidden = false; pop.querySelector('.md-x').focus();
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (e.target === pop || (b && b.classList.contains('md-x'))) { pop.hidden = true; return }
    if (!b) return;
    if (b.dataset.i != null) open(+b.dataset.i);
    else if (b.dataset.g != null) { g = +b.dataset.g; draw() }
    else if (b.dataset.a) print(b.dataset.a);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pop.hidden = true });
  host.querySelector('.md-q').addEventListener('input', function () { q = this.value.trim(); draw() });
  function print(kind) {
    var L = list(), h = '';
    if (kind === 'cards') { for (var p = 0; p < L.length; p += 6) h += '<div class="mdp-pg"><div class="mdp-cards">' + L.slice(p, p + 6).map(function (t) { return '<div class="mdp-card"><div class="mdp-top"><b>' + esc(t.w) + '</b><span>' + t.g + '학년</span></div><div class="mdp-fig">' + (fig(t) || '<span class="md-ex">' + frac(t.ex) + '</span>') + '</div><p>' + frac(t.d) + '</p>' + (t.ex && fig(t) ? '<p class="mdp-e">예) ' + frac(t.ex) + '</p>' : '') + '</div>' }).join('') + '</div></div>' }
    else h = '<div class="mdp-pg mdp-list"><h2>그림 수학 사전 · 낱말 목록 (' + L.length + '개)</h2><table><tr><th>낱말</th><th>학년</th><th>뜻</th></tr>' + L.map(function (t) { return '<tr><td><b>' + esc(t.w) + '</b></td><td>' + t.g + '</td><td>' + frac(t.d) + '</td></tr>' }).join('') + '</table></div>';
    host.querySelector('#mdSheet').innerHTML = h; document.documentElement.classList.add('md-printing');
    var off = function () { document.documentElement.classList.remove('md-printing'); window.removeEventListener('afterprint', off) }; window.addEventListener('afterprint', off); setTimeout(function () { window.print() }, 80);
  }
  draw();

  function quiz() {
    var mode = 'd', upto = 6, Q = [], k = 0, right = 0, done = false;
    host.innerHTML = '<div class="tl-row"><button type="button" class="tl-btn" data-m="d">뜻 보고 낱말 고르기</button><button type="button" class="tl-btn" data-m="f">그림 보고 낱말 고르기</button><label>몇 학년까지 <select class="mq-g">' + [2, 3, 4, 5, 6].map(function (x) { return '<option' + (x === 6 ? ' selected' : '') + '>' + x + '</option>' }).join('') + '</select></label></div><div class="mq-box"></div>';
    var box = host.querySelector('.mq-box');
    function hideW(svg, w) { var parts = w.split(/[·\s]|과 |와 /).filter(function (x) { return x.length >= 2 }); return svg.replace(/<text[^>]*>([^<]*)<\/text>/g, function (m, tx) { return parts.some(function (p) { return tx.indexOf(p) >= 0 || tx.indexOf(p.slice(0, 2)) >= 0 }) ? '' : m }) }
    function rnd(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }
    function start() {
      var pool = ALL.filter(function (t) { return t.g <= upto && (mode === 'd' || (t.fig && FIG[t.fig])) });
      Q = rnd(pool.slice()).slice(0, 10).map(function (t) { var near = function (x) { return (t.rel + ',').indexOf(x.w.split('·')[0]) >= 0 || (x.rel + ',').indexOf(t.w.split('·')[0]) >= 0 }, same = pool.filter(function (x) { return x !== t && x.a === t.a && x.fig !== t.fig && !near(x) }); if (same.length < 3) same = pool.filter(function (x) { return x !== t && !near(x) && x.fig !== t.fig }); return { t: t, o: rnd([t].concat(rnd(same).slice(0, 3))) } });
      k = 0; right = 0; one();
      host.querySelectorAll('[data-m]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.m === mode ? 'true' : 'false') });
    }
    function one() {
      if (k >= Q.length) { box.innerHTML = '<p class="tl-big">' + Q.length + '문제 중 <b>' + right + '</b>개 맞혔어요!</p><div class="tl-row"><button type="button" class="tl-btn tl-go" data-a="again">한 번 더</button></div>'; api.bar('낱말 퀴즈 · 끝'); return }
      var c = Q[k]; done = false;
      box.innerHTML = '<p class="mq-n">' + (k + 1) + ' / ' + Q.length + '</p>' + (mode === 'd' ? '<p class="mq-d">' + frac(c.t.d).replace(new RegExp(esc(c.t.w).split('·')[0], 'g'), '○○') + '</p>' : '<div class="md-bigfig">' + hideW(fig(c.t), c.t.w) + '</div>') + '<div class="mq-opts">' + c.o.map(function (t, i) { return '<button type="button" class="mq-o" data-o="' + i + '">' + esc(t.w) + '</button>' }).join('') + '</div><p class="tl-msg"></p>';
      api.bar('낱말 퀴즈 · ' + (k + 1) + '번');
    }
    host.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.dataset.m) { mode = b.dataset.m; start() }
      if (b.dataset.a === 'again') start();
      if (b.dataset.o != null && !done) {
        done = true; var c = Q[k], ok = c.o[+b.dataset.o] === c.t; if (ok) right++;
        box.querySelectorAll('.mq-o').forEach(function (x, i) { x.classList.toggle('mq-ok', c.o[i] === c.t); if (i === +b.dataset.o && !ok) x.classList.add('mq-no') });
        var m = box.querySelector('.tl-msg'); m.innerHTML = (ok ? '⭕ 맞아요! ' : '❌ 정답은 <b>' + esc(c.t.w) + '</b>. ') + (mode === 'f' ? frac(c.t.d) : '') + ' <button type="button" class="tl-btn tl-go" data-a="next">다음 ▶</button>';
      }
      if (b.dataset.a === 'next') { k++; one() }
    });
    host.querySelector('.mq-g').onchange = function () { upto = +this.value; start() };
    start();
  }
};
