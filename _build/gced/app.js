/* 세계시민교육 주제 페이지: 배우기 · 생각하고 해 보기 · 확인 문제 · 함께 볼 자료 · 활동지(인쇄) · 슬라이드 (자료 window.GC — topics_*.py) */
(function () {
  var D = window.GC, $ = function (id) { return document.getElementById(id) }, WS = [];
  var KEY = 'hj-gced-v1', store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}') || {} } catch (e) { store = {} }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)) } catch (e) { } }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function wid(spec) { WS.push(spec); return WS.length - 1 }
  function link(m) { return m.kind === 'book' ? 'https://www.google.com/search?q=' + encodeURIComponent(m.q || m.t.replace(/[「」]/g, '') + ' ' + m.by) : 'https://www.youtube.com/results?search_query=' + encodeURIComponent(m.q || m.t.replace(/[「」]/g, '')) }
  var UNT = ['', '지역·국가·세계의 체계와 구조', '지역·국가·세계 공동체를 잇는 문제', '숨은 생각과 힘의 관계', '여러 겹의 정체성', '내가 속한 여러 공동체와 그 연결', '차이와 다양성 존중', '혼자서, 함께 할 수 있는 행동', '윤리적으로 책임 있는 행동', '참여하고 행동하기'];

  /* ── 위젯 ── */
  var SDG = [['#E5243B', '빈곤 퇴치', '모든 곳에서 모든 형태의 가난을 없애요.'], ['#DDA63A', '기아 종식', '굶주림을 없애고 누구나 영양 있는 음식을 먹게 해요. 지속 가능한 농업도 키워요.'], ['#4C9F38', '건강과 웰빙', '모든 나이의 사람이 건강하게 살도록 해요.'], ['#C5192D', '양질의 교육', '모두가 차별 없이 좋은 교육을 받고 평생 배울 수 있게 해요.'], ['#FF3A21', '성평등', '여자와 남자가 똑같이 존중받고 같은 기회를 가져요.'], ['#26BDE2', '깨끗한 물과 위생', '모두가 깨끗한 물과 화장실을 쓸 수 있게 해요.'], ['#FCC30B', '깨끗한 에너지', '누구나 값싸고 깨끗한 에너지를 쓸 수 있게 해요.'], ['#A21942', '좋은 일자리와 경제 성장', '모두가 안전하고 보람 있는 일을 하며 경제가 함께 자라요. 어린이 노동을 없애요.'], ['#FD6925', '산업·혁신·사회 기반 시설', '튼튼한 길·다리·통신망을 갖추고 새로운 기술을 키워요.'], ['#DD1367', '불평등 감소', '나라 안, 나라와 나라 사이의 불평등을 줄여요.'], ['#FD9D24', '지속 가능한 도시와 공동체', '안전하고 살기 좋은 마을과 도시를 만들어요.'], ['#BF8B2E', '책임 있는 소비와 생산', '아껴 쓰고 다시 쓰고, 쓰레기를 줄여요.'], ['#3F7E44', '기후 변화 대응', '기후 변화를 막고 그 피해에 대비해요.'], ['#0A97D9', '해양 생태계 보호', '바다와 바다 생물을 지켜요.'], ['#56C02B', '육상 생태계 보호', '숲과 땅, 그곳에 사는 생물을 지켜요.'], ['#00689D', '평화·정의·제도', '폭력 없는 평화로운 사회, 모두에게 공정한 법과 제도를 만들어요.'], ['#19486A', '목표를 위한 협력', '나라와 사람들이 힘을 모아 함께 목표를 이뤄요.']];
  var W = {
    html: function (o) { return '<div class="mu-w">' + o.h + '</div>' },
    cards: function (o) {
      return '<div class="mu-cards">' + o.items.map(function (it) {
        return '<div class="mu-card"' + (it.c ? ' style="--cc:' + it.c + '"' : '') + '><b>' + it.t + '</b>' + (it.sub ? '<span class="sub2">' + it.sub + '</span>' : '') + '<p>' + it.d + '</p></div>';
      }).join('') + '</div>';
    },
    table: function (o) { return '<div class="mu-w mu-tbw"><table class="mu-tb"><thead><tr>' + o.head.map(function (h) { return '<th>' + h + '</th>' }).join('') + '</tr></thead><tbody>' + o.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>' }).join('') + '</tr>' }).join('') + '</tbody></table></div>' },
    sdg: function (o) {
      var k = wid(o);
      return '<div class="mu-w" data-wid="' + k + '"><div class="gc-sdg">' + SDG.map(function (g, i) { return '<button type="button" data-act="sdg" data-i="' + i + '" style="--c:' + g[0] + '" aria-pressed="false"><b>' + (i + 1) + '</b><span>' + g[1] + '</span></button>' }).join('') +
        '</div><p class="gc-sdgd" aria-live="polite">' + (o.cap || '목표를 눌러 보세요.') + '</p></div>';
    },
    pick: function (o) {
      var k = wid(o);
      return '<div class="mu-w gc-pick" data-wid="' + k + '"><p class="qq">' + o.q + '</p><div class="po">' + o.o.map(function (x, i) { return '<button type="button" class="mu-b" data-act="pick" data-i="' + i + '">' + '①②③④⑤'[i] + ' ' + x[0] + '</button>' }).join('') + '</div><p class="gc-fb" aria-live="polite"></p></div>';
    },
    sort: function (o) {
      var k = wid(o);
      return '<div class="mu-w gc-sort" data-wid="' + k + '">' + (o.cap ? '<p class="cap">' + o.cap + '</p>' : '') + o.items.map(function (it, i) {
        return '<div class="row" data-i="' + i + '"><span class="it">' + it[0] + '</span><span class="bs">' + o.cats.map(function (c, j) { return '<button type="button" class="mu-b" data-act="sort" data-j="' + j + '">' + c + '</button>' }).join('') + '</span><p class="why" aria-live="polite"></p></div>';
      }).join('') + '<p class="gc-fb"></p></div>';
    },
    think: function (o) {
      var k = wid(o), id = 'gct' + k;
      return '<div class="mu-w gc-think" data-wid="' + k + '"><label for="' + id + '">' + o.q + '</label><textarea id="' + id + '" data-key="' + D.no + '-' + o.id + '" placeholder="' + esc(o.ph || '내 생각을 써 보세요.') + '"></textarea>' + (o.cap ? '<p class="cap">' + o.cap + '</p>' : '') + '</div>';
    },
    circles: function (o) {
      var h = '', n = o.items.length;
      o.items.forEach(function (it, i) { h = '<div style="--c:' + it[1] + ';width:' + (i === n - 1 ? 'min(100%,560px)' : '80%') + '"><span>' + it[0] + '</span>' + h + '</div>' });
      return '<div class="mu-w gc-circles">' + h + '</div>' + (o.cap ? '<p class="cap">' + o.cap + '</p>' : '');
    }
  };
  function widget(o) { return o ? (W[o.w] || W.html)(o) : '' }
  function fillThinks(root) { root.querySelectorAll('textarea[data-key]').forEach(function (t) { t.value = store[t.dataset.key] || '' }) }

  /* ── 동작(문서 전체에서 받음: 슬라이드에 복사된 것도 동작) ── */
  document.addEventListener('input', function (e) {
    var t = e.target; if (!t.matches || !t.matches('textarea[data-key]')) return;
    store[t.dataset.key] = t.value; save();
    document.querySelectorAll('textarea[data-key="' + t.dataset.key + '"]').forEach(function (x) { if (x !== t) x.value = t.value });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var box = b.closest('[data-wid]'), o = box ? WS[+box.dataset.wid] : null, act = b.dataset.act;
    if (act === 'sdg') {
      var g = SDG[+b.dataset.i];
      box.querySelectorAll('[data-act="sdg"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false') });
      box.querySelector('.gc-sdgd').innerHTML = '<b>목표 ' + (+b.dataset.i + 1) + '. ' + g[1] + '</b> — ' + g[2]; return;
    }
    if (act === 'pick') {
      var x = o.o[+b.dataset.i];
      box.querySelectorAll('[data-act="pick"]').forEach(function (y) { y.classList.remove('ok', 'no') });
      b.classList.add(x[2] ? 'ok' : 'no');
      box.querySelector('.gc-fb').innerHTML = (x[2] ? '👍 ' : '🤔 ') + x[1]; return;
    }
    if (act === 'sort') {
      var row = b.closest('.row'), it = o.items[+row.dataset.i], j = +b.dataset.j;
      row.querySelectorAll('[data-act="sort"]').forEach(function (y) { y.classList.remove('ok', 'no') });
      b.classList.add(j === it[1] ? 'ok' : 'no');
      row.dataset.ok = j === it[1] ? '1' : '';
      row.querySelector('.why').innerHTML = (j === it[1] ? '⭕ ' : '❌ 다시 생각해 봐요. ') + (j === it[1] && it[2] ? it[2] : '');
      var ok = box.querySelectorAll('.row[data-ok="1"]').length;
      box.querySelector('.gc-fb').textContent = ok === o.items.length ? '🎉 모두 바르게 나누었어요!' : ok + ' / ' + o.items.length; return;
    }
    if (act === 'qa') {
      var qb = b.closest('.mu-q'), q = D.quiz[+qb.dataset.q], vv = +b.dataset.v;
      qb.querySelectorAll('[data-act="qa"]').forEach(function (y) { y.classList.remove('ok', 'no') });
      b.classList.add(vv === q.a ? 'ok' : 'no');
      qb.querySelector('.qmsg').innerHTML = (vv === q.a ? '⭕ 맞았어요! ' : '❌ 다시 생각해 봐요. ') + (vv === q.a && q.e ? q.e : '');
      if (vv === q.a) qb.dataset.ok = '1';
      var all = document.querySelectorAll('#muQuiz .mu-q'), okn = document.querySelectorAll('#muQuiz .mu-q[data-ok]').length;
      $('muScore').textContent = okn + ' / ' + all.length + ' 문제 맞힘';
    }
  });

  /* ── 페이지 그리기 ── */
  $('gcChips').innerHTML = D.un.map(function (n) { return '<span>유네스코 주제 ' + n + ' · ' + UNT[n] + '</span>' }).join('') + D.dom.map(function (d) { return '<span class="d">' + d + '</span>' }).join('');
  function sec(c) { return '<article class="mu-sec"><h3>' + c.h + '</h3>' + (c.p ? '<div class="mu-p">' + c.p + '</div>' : '') + widget(c.w) + '</article>' }
  function qcard(q, i) {
    return '<div class="mu-q" data-q="' + i + '"><p class="qq"><b>' + (i + 1) + '.</b> ' + q.q + '</p><div class="qopts">' + q.o.map(function (o, k) { return '<button type="button" class="mu-b" data-act="qa" data-v="' + k + '">' + '①②③④⑤'[k] + ' ' + o + '</button>' }).join('') + '</div><p class="qmsg" aria-live="polite"></p></div>';
  }
  var media = '<div class="mu-cards">' + D.media.map(function (m) { return '<div class="mu-card"><b>' + m.t + '</b><span class="sub2">' + (m.kind === 'book' ? '📚 책 · ' : '🎬 영상 · ') + m.by + '</span><p>' + m.why + '</p><a class="mu-yt" href="' + link(m) + '" target="_blank" rel="noopener">🔎 찾아보기</a></div>' }).join('') + '</div>';
  $('muLearn').innerHTML = D.learn.map(sec).join('');
  $('muAct').innerHTML = D.act.map(sec).join('');
  $('muQuiz').innerHTML = D.quiz.map(qcard).join('');
  $('muMedia').innerHTML = media;
  $('muSum').innerHTML = '<ul>' + D.sum.map(function (s) { return '<li>' + s + '</li>' }).join('') + '</ul>';
  $('muScore').textContent = '0 / ' + D.quiz.length + ' 문제 맞힘';
  fillThinks(document);

  /* ── 활동지(인쇄) ── */
  function sheet(key) {
    var n = 0, h = '<div class="ws"><div class="ws-top"><b>세계시민교육 ' + D.no + '. ' + D.title + ' — 활동지' + (key ? ' (정답·예시)' : '') + '</b><span>' + D.area + '</span></div><p class="ws-name">학년 ___ 반 ___ 번 이름: ______________</p>';
    h += '<div class="ws-sum"><b>핵심 정리</b><ul>' + D.sum.map(function (s) { return '<li>' + s + '</li>' }).join('') + '</ul></div>';
    D.sheet.forEach(function (it) {
      n++; h += '<div class="ws-it"><p class="ws-q"><b>' + n + '.</b> ' + it.q + '</p>';
      if (it.k === 'choice') h += '<p class="ws-o">' + it.o.map(function (o, k) { return '<span' + (key && k === it.a ? ' class="key"' : '') + '>' + '①②③④⑤'[k] + ' ' + o + '</span>' }).join('') + '</p>';
      else if (it.k === 'match') h += '<div class="ws-match"><div>' + it.l.map(function (x) { return '<p>' + x + ' ●</p>' }).join('') + '</div><div>' + it.r.map(function (x) { return '<p>● ' + x + '</p>' }).join('') + '</div></div>';
      else if (it.k === 'write') h += '<div class="ws-lines">' + new Array((it.lines || 2) + 1).join('<span></span>') + '</div>';
      if (key && it.a != null && it.k !== 'choice') h += '<p class="ws-a">' + (it.k === 'write' && it.ex ? '예시: ' : '정답: ') + (Array.isArray(it.a) ? it.a.join(', ') : it.a) + '</p>';
      h += '</div>';
    });
    return h + '<p class="ws-foot">만든 사람: 초등교사 홍지희 · 세계시민교육</p></div>';
  }
  function out(html) { $('muOut').innerHTML = html; setTimeout(function () { window.print() }, 300) }
  $('muPrint').onclick = function () { out(sheet(false)) };
  $('muPrintKey').onclick = function () { out(sheet(true)) };
  $('muPreview').onclick = function () { var v = $('muSheetView'); v.hidden = !v.hidden; if (!v.hidden) v.innerHTML = sheet(false); this.setAttribute('aria-expanded', v.hidden ? 'false' : 'true') };

  /* ── 슬라이드 ── */
  var SL = [], si = 0;
  function buildSlides() {
    SL = ['<div class="sl-title"><span class="sl-area">' + D.area + ' · ' + D.no + '</span><h2>' + D.title + '</h2><p>' + D.goal + '</p></div>'];
    D.learn.concat(D.act).forEach(function (c) { SL.push('<h2>' + c.h + '</h2>' + (c.p ? '<div class="mu-p">' + c.p + '</div>' : '') + widget(c.w)) });
    D.quiz.forEach(function (q, i) { SL.push('<h2>확인 문제 ' + (i + 1) + '</h2>' + qcard(q, i).replace('class="mu-q"', 'class="mu-q sl-q"')) });
    SL.push('<h2>함께 볼 자료</h2>' + media);
    SL.push('<h2>핵심 정리</h2><ul class="sl-sum">' + D.sum.map(function (s) { return '<li>' + s + '</li>' }).join('') + '</ul>');
  }
  function showSlide(k) {
    si = Math.max(0, Math.min(SL.length - 1, k));
    $('slBody').innerHTML = SL[si]; $('slNo').textContent = (si + 1) + ' / ' + SL.length; fillThinks($('slBody'));
    $('slPrev').disabled = si === 0; $('slNext').disabled = si === SL.length - 1;
  }
  $('muSlides').onclick = function () { buildSlides(); $('slides').hidden = false; document.body.classList.add('sl-on'); showSlide(0); var el = $('slides'); if (el.requestFullscreen) el.requestFullscreen().catch(function () { }) };
  function closeSlides() { $('slides').hidden = true; document.body.classList.remove('sl-on'); if (document.fullscreenElement) document.exitFullscreen().catch(function () { }) }
  $('slClose').onclick = closeSlides; $('slPrev').onclick = function () { showSlide(si - 1) }; $('slNext').onclick = function () { showSlide(si + 1) };
  document.addEventListener('keydown', function (e) {
    if ($('slides').hidden || /TEXTAREA|INPUT/.test((e.target || {}).tagName || '')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); showSlide(si + 1) }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); showSlide(si - 1) }
    else if (e.key === 'Escape') closeSlides();
  });
  if (location.hash === '#slides') $('muSlides').click();
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
