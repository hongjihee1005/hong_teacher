/* 사고력 수학: 한 문제씩 — 답 쓰기(수·고르기·여러 칸) · 🔑 생각 열쇠(공통 '힌트' 단추로 하나씩) · 📝 풀이 · 🖨️ 학습지/정답 인쇄 */
(function () {
  'use strict';
  var P, ctx, host, opened, solved, tries;
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  function ansHtml(a) {
    if (a.t === 'pick') return '<div class="th-picks">' + a.o.map(function (o) { return '<button type="button" class="th-pick" data-v="' + esc(o) + '">' + esc(o) + (a.o.every(function (x) { return x.length === 1 }) && /[월화수목금토일]/.test(o) ? '요일' : '') + '</button>' }).join('') + '</div>';
    var f = a.t === 'num' ? [{ l: '', v: a.v, u: a.u }] : a.f;
    return '<div class="th-fields">' + f.map(function (x, i) {
      return '<label class="th-field">' + (x.l ? '<span class="th-fl">' + esc(x.l) + '</span>' : '<span class="th-fl">답</span>') + '<input class="th-in" data-i="' + i + '" inputmode="decimal" autocomplete="off" aria-label="' + esc(x.l || '답') + '">' + (x.u ? '<span class="th-u">' + esc(x.u) + '</span>' : '') + '</label>';
    }).join('') + '<button type="button" class="th-ok">확인</button></div>';
  }
  function answerText(a) {
    if (a.t === 'pick') return a.v + (/^[월화수목금토일]$/.test(a.v) ? '요일' : '');
    if (a.t === 'num') return a.v + (a.u || '');
    return a.f.map(function (x) { return x.l + ' ' + x.v }).join(', ');
  }
  function solHtml(p) {
    return '<div class="th-sol"><b class="th-sh">📝 풀이' + (p.tag ? ' <span class="th-tag">' + esc(p.tag) + '</span>' : '') + '</b>' + p.s.map(function (t) { return '<p>' + t + '</p>' }).join('') + '<p class="th-ans">정답: <b>' + esc(answerText(p.a)) + '</b></p></div>';
  }
  function num(v) { var s = String(v).replace(/[^0-9.\-]/g, ''); return s === '' ? NaN : parseFloat(s) }
  function check(val) {
    if (solved) return;
    var a = P.a, ok;
    if (a.t === 'pick') ok = val === a.v;
    else {
      var ins = host.querySelectorAll('.th-in'), vs = [].map.call(ins, function (e) { return num(e.value) });
      if (vs.some(isNaN)) { ctx.msg('답을 모두 써 주세요.', 'bad'); return }
      var want = a.t === 'num' ? [a.v] : a.f.map(function (x) { return x.v });
      ok = vs.every(function (v, i) { return Math.abs(v - want[i]) < 1e-9 });
      [].forEach.call(ins, function (e, i) { e.classList.toggle('no', Math.abs(vs[i] - want[i]) > 1e-9) });
    }
    if (ok) return win('정답이에요! 풀이를 보며 내 생각과 견주어 보세요.');
    tries++;
    var box = host.querySelector('.th-answer'); box.classList.remove('shk'); void box.offsetWidth; box.classList.add('shk');
    ctx.msg('다시 생각해 보세요.' + (opened < P.k.length ? ' 막히면 ‘💡 힌트’로 생각 열쇠를 열어 봐요.' : ''), 'bad');
  }
  function win(t) {
    solved = true; host.querySelector('.th-solbox').innerHTML = solHtml(P);
    if (P.a.t === 'pick') host.querySelectorAll('.th-pick').forEach(function (b) { b.classList.toggle('on', b.dataset.v === P.a.v) });
    ctx.done(t);
  }
  function keysHtml() {
    var h = ''; for (var i = 0; i < opened; i++) h += '<li><b>🔑 생각 열쇠 ' + (i + 1) + '</b> ' + P.k[i] + '</li>'; return h;
  }
  function printSheet(withAns) {   // A4 · 여백 15mm(@page) · 학습지는 한 쪽에 2문제쯤(생각 칸이 넉넉하도록 쪽이 늘어남)
    var D = window.CR, lv = ctx.level, list = D.data[lv.id] || [], old = document.getElementById('thPrint'); if (old) old.remove();
    var area = esc(document.querySelector('h1').textContent.replace(/^\S+\s/, ''));
    var h = '<div id="thPrint"><header class="th-phead"><h1>사고력 수학 · ' + area + ' — ' + esc(lv.nm) + (withAns ? ' 정답과 풀이' : ' 학습지') + '</h1>'
      + (withAns ? '' : '<p class="th-pname"><span>학년</span><span>반</span><span>번</span><span class="th-pnm">이름</span></p>') + '</header>';
    var secs = list.map(function (p, i) {
      return '<section class="th-pq' + (withAns ? ' th-pqa' : '') + '"><div class="th-pqh"><b>' + (i + 1) + '번</b></div><div class="th-q">' + p.q + '</div>' + (p.fig ? '<div class="th-pfig">' + p.fig + '</div>' : '')
        + (p.a.t === 'pick' ? '<p class="th-popts">' + p.a.o.map(function (o, j) { return '①②③④⑤⑥⑦'[j] + ' ' + esc(o) }).join('　') + '</p>' : '')
        + (withAns ? solHtml(p) : '<div class="th-pspace"><span>생각한 과정 (그림·식·표로 써도 좋아요)</span></div><div class="th-pa"><span>답</span><i></i></div>') + '</section>';
    });
    if (withAns) h += secs.join('');
    else {   // 한 쪽(쓸 수 있는 높이 약 262mm)에 들어갈 만큼 묶고, 남는 높이는 '생각한 과정' 칸이 나눠 가짐 — 칸마다 적어도 55mm
      // 실제 높이를 잼: 인쇄 폭(178mm)으로 화면 밖에 그려 보고, 쓰는 칸은 가장 작은 55mm로 둔 높이
      var mm = 96 / 25.4, box = document.createElement('div'); box.id = 'thPrint'; box.className = 'th-measure';
      box.innerHTML = secs.join(''); document.body.appendChild(box);
      var est = [].map.call(box.querySelectorAll('.th-pq'), function (el) { return el.getBoundingClientRect().height / mm + 5 });
      box.remove();
      var head = h.slice(h.indexOf('<header')); h = h.slice(0, h.indexOf('<header'));
      var pages = [], cur = [], used = 24;   // 첫 쪽은 머리말 자리
      est.forEach(function (e, i) { if (cur.length && used + e > 266) { pages.push(cur); cur = []; used = 0 } cur.push(i); used += e });
      pages.push(cur);
      h += pages.map(function (pg, k) { return '<div class="th-ppage">' + (k ? '' : head) + pg.map(function (i) { return secs[i] }).join('') + '</div>' }).join('');
    }
    document.body.insertAdjacentHTML('beforeend', h + '</div>');
    document.documentElement.classList.add('th-printing');
    setTimeout(function () { window.print(); setTimeout(function () { document.documentElement.classList.remove('th-printing') }, 500) }, 60);
  }
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; opened = 0; solved = false; tries = 0;
      host.innerHTML = '<div class="th-card"><div class="th-q">' + p.q + '</div>' + (p.fig ? '<div class="th-figbox">' + p.fig + '</div>' : '')
        + '<div class="th-answer">' + ansHtml(p.a) + '</div><ul class="th-keys" id="thKeys"></ul><div class="th-solbox"></div></div>'
        + '<div class="th-prints"><button type="button" class="th-pbtn" data-w="0">🖨️ 이 단계 학습지 인쇄</button><button type="button" class="th-pbtn" data-w="1">🖨️ 정답과 풀이 인쇄</button></div>';
      host.onclick = function (e) {
        var pk = e.target.closest('.th-pick'), ok = e.target.closest('.th-ok'), pb = e.target.closest('.th-pbtn');
        if (pk) check(pk.dataset.v); else if (ok) check(); else if (pb) printSheet(pb.dataset.w === '1');
      };
      host.querySelectorAll('.th-in').forEach(function (inp, i, all) {
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (all[i + 1]) all[i + 1].focus(); else check() } });
        inp.addEventListener('input', function () { inp.classList.remove('no') });
      });
    },
    hint: function () {
      if (solved || opened >= P.k.length) { if (!solved) ctx.msg('생각 열쇠를 모두 열었어요. 그래도 어려우면 ‘🔑 정답 보기’로 풀이를 보세요.'); return false }
      opened++; host.querySelector('#thKeys').innerHTML = keysHtml(); ctx.msg(''); return true;
    },
    reveal: function () {
      if (solved) return;
      if (P.a.t !== 'pick') { var want = P.a.t === 'num' ? [P.a.v] : P.a.f.map(function (x) { return x.v }); host.querySelectorAll('.th-in').forEach(function (e, i) { e.value = want[i]; e.classList.remove('no') }) }
      win('정답: <b>' + esc(answerText(P.a)) + '</b> — 풀이를 천천히 읽어 보세요.');
    }
  };
})();
