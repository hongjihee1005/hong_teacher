/* 창의수학게임 › 님 게임: 돌 줄에서 번갈아 가져가고 마지막 돌을 가져가면 이김 — 컴퓨터와 / 친구와 둘이 */
(function () {
  'use strict';
  var P, ctx, host, piles, turn, sel, mode = 'cpu', over, busy, timer = null, hist, autoT = null;
  function maxTake(i) { return P.k ? Math.min(P.k, piles[i]) : piles[i] }
  function best(ps) {   // 이기는 수 [줄, 개수] (없으면 null)
    if (ps.length === 1 && P.k) { var r = ps[0] % (P.k + 1); return r ? [0, r] : null }
    var x = 0; ps.forEach(function (n) { x ^= n }); if (!x) return null;
    for (var i = 0; i < ps.length; i++) { var t = ps[i] ^ x; if (t < ps[i]) return [i, ps[i] - t] }
    return null;
  }
  function anyMove(ps) { var i = 0; ps.forEach(function (n, j) { if (n > ps[i]) i = j }); return [i, 1 + Math.floor(Math.random() * (P.k ? Math.min(P.k, ps[i]) : Math.min(ps[i], 3)))] }
  function who(t) { return mode === 'cpu' ? (t === 0 ? '나' : '컴퓨터') : (t === 0 ? '파랑' : '빨강') }
  function rule() { return P.k ? '한 줄에서 한 번에 <b>1~' + P.k + '개</b>씩 가져가요' : '한 줄을 골라 그 줄에서 <b>몇 개든</b>(1개 이상) 가져가요' }
  function draw() {
    host.innerHTML = '<div class="nm-modes" role="group" aria-label="누구와 할까요"><button type="button" class="nm-mode" data-m="cpu">🤖 컴퓨터와</button><button type="button" class="nm-mode" data-m="two">👫 친구와 둘이</button></div>'
      + '<p class="nm-rule">' + rule() + ' · <b>마지막 돌을 가져가는 사람이 이겨요</b></p>'
      + '<div class="nm-turn" id="nmTurn"></div><div class="nm-piles" id="nmPiles"></div>'
      + '<div class="nm-bar"><button type="button" class="nm-take" id="nmTake" disabled>가져가기</button><button type="button" class="nm-again" id="nmAgain" hidden>한 판 더</button></div>'
      + '<div class="nm-how" id="nmHow" hidden></div><ol class="nm-log" id="nmLog"></ol>'
      + '<p class="nm-tip">가져갈 돌을 누르면 그 돌부터 줄 끝까지 골라져요. ‘가져가기’를 눌러 차례를 넘겨요. 처음은 언제나 ' + (mode === 'cpu' ? '내' : '‘파랑’') + ' 차례예요.</p>';
    host.querySelectorAll('.nm-mode').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.m === mode)) });
    paint();
  }
  function paint() {
    var h = '';
    piles.forEach(function (n, i) {
      h += '<div class="nm-row"><span class="nm-lab">' + (piles.length > 1 ? (i + 1) + '줄' : '') + '<small>' + n + '개</small></span><div class="nm-stones">';
      for (var j = 0; j < n; j++) h += '<button type="button" class="nm-st' + (sel && sel[0] === i && j >= sel[1] ? ' pick' : '') + '" data-i="' + i + '" data-j="' + j + '" aria-label="' + (i + 1) + '줄 ' + (j + 1) + '번째 돌"></button>';
      h += '</div></div>';
    });
    host.querySelector('#nmPiles').innerHTML = h;
    var t = host.querySelector('#nmTurn');
    t.className = 'nm-turn p' + turn; t.innerHTML = over ? '' : (mode === 'cpu' && turn === 1 ? '🤖 컴퓨터가 생각하고 있어요…' : '<b>' + who(turn) + '</b> 차례' + (mode === 'cpu' ? '예요' : ''));
    var c = sel ? piles[sel[0]] - sel[1] : 0, b = host.querySelector('#nmTake');
    b.disabled = !c || over || busy || (mode === 'cpu' && turn === 1); b.textContent = c ? c + '개 가져가기' : '가져가기';
    host.querySelector('#nmLog').innerHTML = hist.map(function (x) { return '<li class="p' + x[0] + '">' + who(x[0]) + ': ' + (piles.length > 1 ? (x[1] + 1) + '줄에서 ' : '') + x[2] + '개</li>' }).join('');
  }
  function pick(i, j) {
    if (over || busy || (mode === 'cpu' && turn === 1)) return;
    var n = piles[i], from = Math.max(j, n - maxTake(i));
    if (j < n - maxTake(i)) ctx.msg('한 번에 ' + P.k + '개까지만 가져갈 수 있어요.', 'bad'); else ctx.msg('');
    sel = sel && sel[0] === i && sel[1] === from ? null : [i, from]; paint();
  }
  function take(i, c) {
    piles[i] -= c; hist.push([turn, i, c]); sel = null;
    if (piles.every(function (n) { return !n })) { end(turn); return }
    turn = 1 - turn; paint();
    if (mode === 'cpu' && turn === 1 && !autoT) cpu();
  }
  function cpu() {
    busy = true; paint();
    timer = setTimeout(function () {
      timer = null; busy = false; if (over || !document.body.contains(host)) return;
      var m = best(piles); if (!m || (P.k === 2 && Math.random() < .35)) m = anyMove(piles);   // 쉬움 단계 컴퓨터는 가끔 실수
      sel = [m[0], piles[m[0]] - m[1]]; paint();
      setTimeout(function () { if (!over && document.body.contains(host)) take(m[0], m[1]) }, 450);
    }, 700);
  }
  function end(t) {
    over = true; paint(); host.querySelector('#nmAgain').hidden = false;
    if (mode === 'cpu') {
      if (t === 0) ctx.done('마지막 돌을 가져갔어요 — 컴퓨터를 이겼어요! 이기는 규칙을 찾았나요?');
      else ctx.msg('컴퓨터가 마지막 돌을 가져갔어요. ‘한 판 더’로 다시 도전! 💡 힌트로 이기는 방법을 살짝 볼 수 있어요.', 'bad');
    } else ctx.msg('🎉 <b>' + who(t) + '</b>이 마지막 돌을 가져가서 이겼어요!', 'ok');
  }
  function reset() {
    if (timer) { clearTimeout(timer); timer = null } if (autoT) { clearInterval(autoT); autoT = null }
    piles = P.p.slice(); turn = 0; sel = null; over = false; busy = false; hist = []; draw(); ctx.msg('');
  }
  function howText() {
    return P.k ? '🔑 <b>이기는 규칙</b>: 상대에게 늘 <b>' + (P.k + 1) + '의 배수</b>만큼 남겨요. 상대가 □개를 가져가면 나는 ' + (P.k + 1) + '−□개를 가져가서, 둘이 한 번씩 할 때마다 꼭 ' + (P.k + 1) + '개씩 줄게 해요. 그러면 마지막 돌은 언제나 내 차지!'
      : '🔑 <b>이기는 규칙(님 합)</b>: 줄마다 돌 수를 <b>4개 묶음·2개 묶음·1개 묶음</b>으로 나누어 보세요(예: 7 = 4 + 2 + 1, 5 = 4 + 1). 모든 줄을 합쳐 4개 묶음, 2개 묶음, 1개 묶음이 <b>각각 짝수 개</b>가 되게 남기면 이겨요. 상대가 어떻게 가져가도 짝이 깨지고, 나는 다시 짝을 맞출 수 있어요.';
  }
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; reset();
      host.onclick = function (e) {
        var st = e.target.closest('.nm-st'), md = e.target.closest('.nm-mode');
        if (st) return pick(+st.dataset.i, +st.dataset.j);
        if (md) { mode = md.dataset.m; reset(); return }
        if (e.target.closest('#nmTake') && sel) return take(sel[0], piles[sel[0]] - sel[1]);
        if (e.target.closest('#nmAgain')) reset();
      };
    },
    hint: function () {
      if (over || busy || autoT) return false;
      if (mode === 'cpu' && turn === 1) return false;
      var m = best(piles);
      if (!m) { ctx.msg('💡 지금은 어떻게 가져가도 불리한 자리예요. 1개만 가져가고 상대의 실수를 기다려 보세요. 다음 판에는 처음부터 규칙을 지켜 봐요!'); return true }
      sel = [m[0], piles[m[0]] - m[1]]; paint();
      ctx.msg('💡 ' + (piles.length > 1 ? (m[0] + 1) + '줄에서 ' : '') + m[1] + '개를 가져가 보세요(골라 두었어요). ' + (P.k ? '남은 돌이 ' + (P.k + 1) + '의 배수가 돼요.' : '그러면 상대가 불리해져요.'));
      return true;
    },
    reveal: function () {   // 이기는 규칙을 보여 주고, 처음부터 양쪽 모두 잘하면 어떻게 되는지 저절로 보여 줌
      if (autoT) return;
      var md = mode; mode = 'cpu'; reset(); mode = md;
      var hw = host.querySelector('#nmHow'); hw.hidden = false; hw.innerHTML = howText();
      autoT = setInterval(function () {
        if (!document.body.contains(host)) { clearInterval(autoT); autoT = null; return }
        var m = best(piles) || anyMove(piles); var t = turn;
        piles[m[0]] -= m[1]; hist.push([t, m[0], m[1]]); sel = null;
        if (piles.every(function (n) { return !n })) { clearInterval(autoT); autoT = null; over = true; paint(); host.querySelector('#nmHow').hidden = false; ctx.done('규칙대로 하면 먼저 하는 사람이 이겨요. ' + (P.k ? (P.k + 1) + '의 배수를 남기는 것' : '님 합을 0으로 남기는 것') + '을 기억하세요!'); return }
        turn = 1 - turn; paint();
      }, 650);
    }
  };
})();
