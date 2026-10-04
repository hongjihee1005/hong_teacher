/* 음악이론 주제 페이지: 배우기 · 해 보기 · 연습 문제 · 추천 음악 · 활동지(인쇄) · 슬라이드 (자료 window.MT — topics.py) */
(function () {
  var D = window.MT, $ = function (id) { return document.getElementById(id) }, esc = MU.esc, WS = [];
  function wid(spec) { WS.push(spec); return WS.length - 1 }
  function yt(q) { return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q) }

  /* ── 위젯 ── */
  function staffBox(o, opt) {
    var k = wid(o), names = o.names;
    return '<div class="mu-w mu-stf" data-wid="' + k + '">' + (o.cap ? '<p class="cap">' + o.cap + '</p>' : '') + '<div class="svgw">' + MU.staff(o) + '</div>' +
      ((o.play !== false || o.toggle) ? '<div class="mu-ctl">' + (o.play !== false ? '<button type="button" class="mu-b go" data-act="play">▶ 들어 보기</button><button type="button" class="mu-b" data-act="stop">■ 멈춤</button>' : '') +
        (o.toggle ? '<button type="button" class="mu-b" data-act="names" aria-pressed="' + (names ? 'true' : 'false') + '">' + (o.toggle === 'eum' ? '음이름' : '계이름') + ' 보기</button>' : '') + '</div>' : '') + '</div>';
  }
  var W = {
    staff: staffBox,
    html: function (o) { return '<div class="mu-w">' + o.h + '</div>' },
    compare: function (o) { return '<div class="mu-cmp">' + o.items.map(function (it) { return '<div class="mu-cmpi"><b>' + it.label + '</b>' + staffBox(it) + (it.desc ? '<p class="cap">' + it.desc + '</p>' : '') + '</div>' }).join('') + '</div>' },
    keys: function (o) {
      var k = wid(o), lo = MU.parsePitch(o.from || 'c4'), hi = MU.parsePitch(o.to || 'c6'), wh = '', bl = '', n = 0;
      for (var s = lo.step; s <= hi.step; s++) {
        var l = s % 7, oct = Math.floor(s / 7), p = 'cdefgab'[l] + oct;
        wh += '<button type="button" class="wk" data-act="key" data-p="' + p + '"><span class="g">' + MU.GYE[l] + '</span><span class="e">' + MU.EUM[l] + '·' + MU.EN[l] + '</span></button>';
        if (l !== 2 && l !== 6 && s < hi.step) bl += '<button type="button" class="bk" data-act="key" data-p="' + 'cdefgab'[l] + '#' + oct + '" style="left:calc(' + (n + 1) + ' * var(--kw) - var(--kw) * .3)" aria-label="' + MU.GYE[l] + ' 올림"></button>';
        n++;
      }
      return '<div class="mu-w mu-keys" data-wid="' + k + '"><div class="kb" style="--n:' + n + '">' + wh + bl + '</div><div class="ksf"></div></div>';
    },
    namegame: function (o) {
      var k = wid(o);
      return '<div class="mu-w mu-game" data-wid="' + k + '"><div class="gq"></div><div class="gopts">' + MU.GYE.map(function (g, i) { return '<button type="button" class="mu-b" data-act="gans" data-v="' + i + '">' + g + '</button>' }).join('') +
        '</div><p class="gmsg" aria-live="polite"></p><div class="mu-ctl"><button type="button" class="mu-b" data-act="gnext">다음 음 →</button><span class="gsc"></span></div></div>';
    },
    tempo: function (o) {
      var k = wid(o);
      return '<div class="mu-w" data-wid="' + k + '">' + (o.cap ? '<p class="cap">' + o.cap + '</p>' : '') + '<div class="svgw">' + MU.staff({ n: o.n, key: o.key, clef: o.clef, time: o.time }) + '</div><div class="mu-list">' +
        o.items.map(function (it, i) { return '<button type="button" class="mu-li" data-act="tempo" data-i="' + i + '"><b>' + it[0] + '</b><span>' + it[2] + '</span><i>' + (o.dyn ? '' : '♩ = ' + it[1]) + '</i></button>' }).join('') + '</div><div class="mu-ctl"><button type="button" class="mu-b" data-act="stop">■ 멈춤</button></div></div>';
    },
    meter: function (o) {
      var k = wid(o);
      return '<div class="mu-w" data-wid="' + k + '"><div class="mu-list">' + o.items.map(function (it, i) {
        return '<div class="mu-met"><button type="button" class="mu-li" data-act="meter" data-i="' + i + '"><b>' + it[0] + '</b><span>' + it[2] + '</span></button><div class="beats">' + it[1].map(function (b) { return '<span class="bt ' + (b === '강' ? 's' : b === '중강' ? 'm' : '') + '">' + b + '</span>' }).join('') + '</div></div>';
      }).join('') + '</div></div>';
    },
    jang: function (o) {
      var k = wid(o), per = o.per || 3;
      var cells = o.cells.map(function (c, i) { return '<span class="jc' + (i % per === 0 ? ' b1' : '') + (c && c.length > 2 ? ' long' : '') + '" data-c="' + i + '">' + (c || '·') + '</span>' }).join('');
      return '<div class="mu-w mu-jang" data-wid="' + k + '"><p class="cap"><b>' + o.name + '</b> ' + (o.sub || '') + '</p><div class="jrow" style="--cols:' + o.cells.length + ';--per:' + per + '">' + cells + '</div>' +
        '<div class="mu-ctl"><button type="button" class="mu-b go" data-act="jang">▶ 장단 듣기(2번)</button><button type="button" class="mu-b" data-act="stop">■ 멈춤</button></div></div>';
    },
    cards: function (o) {
      return '<div class="mu-cards">' + o.items.map(function (it) {
        return '<div class="mu-card"' + (it.c ? ' style="--cc:' + it.c + '"' : '') + '><b>' + it.t + '</b>' + (it.sub ? '<span class="sub2">' + it.sub + '</span>' : '') + '<p>' + it.d + '</p>' + (it.q ? '<a class="mu-yt" href="' + yt(it.q) + '" target="_blank" rel="noopener">🔎 소리 찾아 듣기</a>' : '') + '</div>';
      }).join('') + '</div>';
    },
    table: function (o) { return '<div class="mu-w mu-tbw"><table class="mu-tb"><thead><tr>' + o.head.map(function (h) { return '<th>' + h + '</th>' }).join('') + '</tr></thead><tbody>' + o.rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>' }).join('') + '</tr>' }).join('') + '</tbody></table></div>' }
  };
  function widget(o) { return o ? (W[o.w] || W.html)(o) : '' }

  /* ── 위젯 동작(이벤트는 문서 전체에서 받음: 슬라이드에 복사된 것도 동작) ── */
  function game(box, o) {
    var lo = MU.parsePitch(o.lo || 'c4').step, hi = MU.parsePitch(o.hi || 'c5').step, s = lo + Math.floor(Math.random() * (hi - lo + 1)), p = 'cdefgab'[s % 7] + Math.floor(s / 7);
    if (box._p === p) return game(box, o);
    box._p = p; box._done = false;
    box.querySelector('.gq').innerHTML = MU.staff({ n: p + '/1', clef: o.clef || 'g', key: o.key || 'C' });
    box.querySelector('.gmsg').textContent = '이 음의 계이름은 무엇일까요?';
    box.querySelectorAll('[data-act="gans"]').forEach(function (b) { b.classList.remove('ok', 'no') });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]'); if (!b) return;
    var box = b.closest('[data-wid]'), o = box ? WS[+box.dataset.wid] : null, act = b.dataset.act;
    if (act === 'stop') { MU.stop(); return; }
    if (act === 'play') { MU.play({ n: o.n, key: o.key, bpm: o.bpm, el: box.querySelector('svg') }); return; }
    if (act === 'names') {
      var on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var o2 = Object.assign({}, o, { names: on ? (o.toggle === 'eum' ? 'eum' : 'gye') : false }); box.querySelector('.svgw').innerHTML = MU.staff(o2); return;
    }
    if (act === 'key') {
      var pp = MU.parsePitch(b.dataset.p); MU.playMidi(MU.midi(pp, 'C'), .8);
      var ks = box.querySelector('.ksf'); ks.innerHTML = MU.staff({ n: b.dataset.p + '/1', clef: o.clef || 'g', names: 'gye' }) + '<p class="cap">' + MU.gyeName(pp, 'C') + (pp.acc ? ' 올림' : '') + ' — 음이름 ' + MU.eumName(pp, 'C') + ' (' + MU.EN[pp.l] + (pp.acc ? '♯' : '') + ')</p>'; return;
    }
    if (act === 'gnext') { game(box, o); return; }
    if (act === 'gans') {
      if (!box._p || box._done) return;
      var pp2 = MU.parsePitch(box._p), right = MU.GYE.indexOf(MU.gyeName(pp2, o.key || 'C')), v = +b.dataset.v;
      MU.playMidi(MU.midi(pp2, o.key || 'C'), .7);
      box._n = (box._n || 0) + 1;
      if (v === right) { b.classList.add('ok'); box._ok = (box._ok || 0) + 1; box._done = true; box.querySelector('.gmsg').textContent = '딩동댕! ' + MU.GYE[right] + '예요.'; MU.later(function () { if (box._done) game(box, o) }, 1100); }
      else { b.classList.add('no'); box.querySelector('.gmsg').textContent = '다시 생각해 봐요. 줄인지 칸인지 세어 보세요.'; }
      box.querySelector('.gsc').textContent = '맞힌 수 ' + (box._ok || 0); return;
    }
    if (act === 'tempo') { var it = o.items[+b.dataset.i]; MU.play({ n: o.n, key: o.key, bpm: o.dyn ? (o.bpm || 100) : it[1], vol: o.dyn ? (typeof it[1] === 'string' ? (function (sp) { var a = sp.split('-').map(Number); return function (k, n) { return a[0] + (a[1] - a[0]) * k / Math.max(1, n - 1) } })(it[1]) : it[1]) : 1, el: box.querySelector('svg') }); return; }
    if (act === 'meter') {
      MU.stop(); var m = o.items[+b.dataset.i], beats = m[1], a = MU.ctx(); if (!a) return; var t0 = a.currentTime + .05, bp = 60 / (m[3] || 100), spans = b.parentNode.querySelectorAll('.bt');
      for (var r = 0; r < 2; r++) beats.forEach(function (x, i) { var t = t0 + (r * beats.length + i) * bp; MU.click(t, x === '강'); (function (ii, tt) { MU.later(function () { spans.forEach(function (sp, j) { sp.classList.toggle('on', j === ii) }) }, (tt - a.currentTime) * 1000) })(i, t) });
      MU.later(function () { spans.forEach(function (sp) { sp.classList.remove('on') }) }, (t0 + beats.length * 2 * bp - a.currentTime) * 1000 + 200); return;
    }
    if (act === 'jang') {
      MU.stop(); var ac = MU.ctx(); if (!ac) return; var c = o.cells, sub = 60 / (o.bpm || 90) / (o.per || 3), t1 = ac.currentTime + .08, cs = box.querySelectorAll('.jc');
      for (var r2 = 0; r2 < 2; r2++) c.forEach(function (x, i) { var t = t1 + (r2 * c.length + i) * sub; if (x) MU.janggu(x, t, sub); (function (ii, tt) { MU.later(function () { cs.forEach(function (sp, j) { sp.classList.toggle('on', j === ii) }) }, (tt - ac.currentTime) * 1000) })(i, t) });
      MU.later(function () { cs.forEach(function (sp) { sp.classList.remove('on') }) }, (t1 + c.length * 2 * sub - ac.currentTime) * 1000 + 300); return;
    }
    if (act === 'qa') {
      var qb = b.closest('.mu-q'), q = D.quiz[+qb.dataset.q], vv = +b.dataset.v;
      qb.querySelectorAll('[data-act="qa"]').forEach(function (x) { x.classList.remove('ok', 'no') });
      b.classList.add(vv === q.a ? 'ok' : 'no');
      qb.querySelector('.qmsg').innerHTML = (vv === q.a ? '⭕ 맞았어요! ' : '❌ 다시 생각해 봐요. ') + (vv === q.a && q.e ? q.e : '');
      if (vv === q.a) qb.dataset.ok = '1';
      var all = document.querySelectorAll('#muQuiz .mu-q'), ok = document.querySelectorAll('#muQuiz .mu-q[data-ok]').length;
      $('muScore').textContent = ok + ' / ' + all.length + ' 문제 맞힘';
      return;
    }
    if (act === 'qplay') { var q2 = D.quiz[+b.closest('.mu-q').dataset.q]; MU.play({ n: q2.play.n, key: q2.play.key, bpm: q2.play.bpm, vol: q2.play.vol }); return; }
  });
  /* 처음 게임 문제 */
  function initGames(root) { root.querySelectorAll('.mu-game').forEach(function (g) { game(g, WS[+g.dataset.wid]) }) }

  /* ── 페이지 그리기 ── */
  var learn = D.learn.map(function (c) { return '<article class="mu-sec"><h3>' + c.h + '</h3>' + (c.p ? '<div class="mu-p">' + c.p + '</div>' : '') + widget(c.w) + '</article>' }).join('');
  var act = D.act.map(function (c) { return '<article class="mu-sec"><h3>' + c.h + '</h3>' + (c.p ? '<div class="mu-p">' + c.p + '</div>' : '') + widget(c.w) + '</article>' }).join('');
  function qcard(q, i) {
    return '<div class="mu-q" data-q="' + i + '"><p class="qq"><b>' + (i + 1) + '.</b> ' + q.q + '</p>' + (q.staff ? '<div class="svgw">' + MU.staff(q.staff) + '</div>' : '') +
      (q.play ? '<div class="mu-ctl"><button type="button" class="mu-b go" data-act="qplay">▶ 듣기</button></div>' : '') +
      '<div class="qopts">' + q.o.map(function (o, k) { return '<button type="button" class="mu-b" data-act="qa" data-v="' + k + '">' + '①②③④⑤'[k] + ' ' + o + '</button>' }).join('') + '</div><p class="qmsg" aria-live="polite"></p></div>';
  }
  var quiz = D.quiz.map(qcard).join('');
  var music = D.music.map(function (m) { return '<div class="mu-card"><b>' + m.t + '</b><span class="sub2">' + m.by + '</span><p>' + m.why + '</p><a class="mu-yt" href="' + yt(m.q || (m.t.replace(/[「」]/g, '') + ' ' + m.by)) + '" target="_blank" rel="noopener">🔎 찾아 듣기</a></div>' }).join('');
  $('muLearn').innerHTML = learn; $('muAct').innerHTML = act; $('muQuiz').innerHTML = quiz; $('muMusic').innerHTML = '<div class="mu-cards">' + music + '</div>';
  $('muSum').innerHTML = '<ul>' + D.sum.map(function (s) { return '<li>' + s + '</li>' }).join('') + '</ul>';
  $('muScore').textContent = '0 / ' + D.quiz.length + ' 문제 맞힘';
  initGames(document);

  /* ── 활동지(인쇄) ── */
  function sheet(key) {
    var n = 0, h = '<div class="ws"><div class="ws-top"><b>음악이론 ' + D.no + '. ' + D.title + ' — 활동지' + (key ? ' (정답)' : '') + '</b><span>' + D.area + '</span></div><p class="ws-name">학년 ___ 반 ___ 번 이름: ______________</p>';
    h += '<div class="ws-sum"><b>핵심 정리</b><ul>' + D.sum.map(function (s) { return '<li>' + s + '</li>' }).join('') + '</ul></div>';
    D.sheet.forEach(function (it) {
      n++; h += '<div class="ws-it"><p class="ws-q"><b>' + n + '.</b> ' + it.q + '</p>';
      if (it.k === 'names') h += '<div class="svgw">' + MU.staff(Object.assign({}, it, { names: key ? 'gye' : 'blank' })) + '</div>';
      else if (it.k === 'staff') h += '<div class="svgw">' + MU.staff(it) + '</div>';
      else if (it.k === 'choice') h += '<p class="ws-o">' + it.o.map(function (o, k) { return '<span' + (key && k === it.a ? ' class="key"' : '') + '>' + '①②③④⑤'[k] + ' ' + o + '</span>' }).join('') + '</p>';
      else if (it.k === 'match') h += '<div class="ws-match"><div>' + it.l.map(function (x, i) { return '<p>' + x + ' ●</p>' }).join('') + '</div><div>' + it.r.map(function (x) { return '<p>● ' + x + '</p>' }).join('') + '</div></div>';
      else if (it.k === 'draw') h += '<div class="ws-draw">' + MU.staff({ n: it.n || '', clef: it.clef || 'g', minW: 560, time: it.time }) + '</div>';
      else if (it.k === 'write') h += '<div class="ws-lines">' + new Array((it.lines || 2) + 1).join('<span></span>') + '</div>';
      if (key && it.a != null && it.k !== 'choice') h += '<p class="ws-a">정답: ' + (Array.isArray(it.a) ? it.a.join(', ') : it.a) + '</p>';
      h += '</div>';
    });
    return h + '<p class="ws-foot">만든 사람: 초등교사 홍지희 · 음악이론</p></div>';
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
    D.quiz.forEach(function (q, i) { SL.push('<h2>연습 문제 ' + (i + 1) + '</h2><div id="muQuizS">' + qcard(q, i).replace('class="mu-q"', 'class="mu-q sl-q"') + '</div>') });
    SL.push('<h2>추천 음악</h2><div class="mu-cards">' + music + '</div>');
    SL.push('<h2>핵심 정리</h2><ul class="sl-sum">' + D.sum.map(function (s) { return '<li>' + s + '</li>' }).join('') + '</ul>');
  }
  function showSlide(k) {
    si = Math.max(0, Math.min(SL.length - 1, k)); MU.stop();
    $('slBody').innerHTML = SL[si]; $('slNo').textContent = (si + 1) + ' / ' + SL.length; initGames($('slBody'));
    $('slPrev').disabled = si === 0; $('slNext').disabled = si === SL.length - 1;
  }
  $('muSlides').onclick = function () { buildSlides(); $('slides').hidden = false; document.body.classList.add('sl-on'); showSlide(0); var el = $('slides'); if (el.requestFullscreen) el.requestFullscreen().catch(function () { }) };
  function closeSlides() { $('slides').hidden = true; document.body.classList.remove('sl-on'); MU.stop(); if (document.fullscreenElement) document.exitFullscreen().catch(function () { }) }
  $('slClose').onclick = closeSlides; $('slPrev').onclick = function () { showSlide(si - 1) }; $('slNext').onclick = function () { showSlide(si + 1) };
  document.addEventListener('keydown', function (e) {
    if ($('slides').hidden) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); showSlide(si + 1) }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); showSlide(si - 1) }
    else if (e.key === 'Escape') closeSlides();
  });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement && !$('slides').hidden) { } });
  if (location.hash === '#slides') $('muSlides').click();
})();
(function () {
  var h = location.hostname, ok = location.protocol === 'file:' || /github\.io$/.test(h) || /^localhost$/.test(h) || h === '127.0.0.1';
  if (ok) document.querySelectorAll('.tolist').forEach(function (e) { e.classList.add('on') });
})();
