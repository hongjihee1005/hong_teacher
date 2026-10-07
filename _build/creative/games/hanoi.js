/* 창의수학게임 › 하노이 탑: 원판을 하나씩 옮겨 모두 목표 기둥으로 — 큰 원판은 작은 원판 위에 놓을 수 없음
   기둥을 눌러 맨 위 원판을 들고, 다른 기둥을 눌러 내려놓음(키보드 1·2·3). 옮긴 횟수와 가장 적은 횟수를 보여 줌 */
(function () {
  'use strict';
  var NAMES = ['가', '나', '다'], COL = ['#E5534B', '#F08A24', '#F2B92C', '#2EAA6A', '#20A5A5', '#3B82D6', '#9B59D0'];
  var P, ctx, host, pos, held, moves, hist, solved, auto = null, hintMove = null;
  function tops() { var t = [0, 0, 0]; for (var k = P.n; k >= 1; k--) t[pos[k - 1]] = k; return t }   // 기둥마다 맨 위 원판(0 = 빈 기둥)
  function minLeft() { var t = P.g, m = 0; for (var k = P.n; k >= 1; k--) if (pos[k - 1] !== t) { m += Math.pow(2, k - 1); t = 3 - pos[k - 1] - t } return m }
  function nextMove() { var t = P.g, mv = null; for (var k = P.n; k >= 1; k--) if (pos[k - 1] !== t) { mv = [k, pos[k - 1], t]; t = 3 - pos[k - 1] - t } return mv }
  function draw() {
    var h = '<p class="hn-goal">원판을 모두 <b>' + NAMES[P.g] + ' 기둥</b>으로 옮겨요 · 가장 적은 횟수 <b>' + P.m + '번</b></p>';
    h += '<div class="hn-stage" style="--n:' + P.n + '">';
    for (var p = 0; p < 3; p++) h += '<button type="button" class="hn-peg' + (p === P.g ? ' goal' : '') + '" data-p="' + p + '" aria-label="' + NAMES[p] + ' 기둥"><span class="hn-pole"></span><span class="hn-stack"></span><span class="hn-base"></span><span class="hn-nm">' + NAMES[p] + (p === P.g ? ' <i>목표</i>' : '') + '</span></button>';
    h += '</div><div class="hn-bar"><span class="hn-cnt">옮긴 횟수 <b id="hnMv">0</b>번</span><button type="button" class="hn-btn" id="hnUndo" disabled>한 번 되돌리기</button></div>'
      + '<p class="hn-tip">옮길 원판이 있는 기둥을 누르고, 놓을 기둥을 눌러요. 키보드: 1·2·3</p>';
    host.innerHTML = h; paint();
  }
  function paint() {
    var t = tops();
    host.querySelectorAll('.hn-peg').forEach(function (el, p) {
      var st = el.querySelector('.hn-stack'), ks = [];
      for (var k = 1; k <= P.n; k++) if (pos[k - 1] === p) ks.push(k);   // 위(작은 원판)부터
      st.innerHTML = ks.map(function (k) {
        return '<span class="hn-disk' + (held === p && k === t[p] ? ' up' : '') + '" style="--w:' + (28 + 70 * (k - 1) / Math.max(1, P.n - 1)) + '%;--c:' + COL[(k - 1) % COL.length] + '">' + k + '</span>';
      }).join('');
      el.classList.toggle('from', held === p); el.classList.toggle('hfrom', !!hintMove && hintMove[1] === p); el.classList.toggle('hto', !!hintMove && hintMove[2] === p);
    });
    var mv = host.querySelector('#hnMv'); if (mv) mv.textContent = moves;
    var u = host.querySelector('#hnUndo'); if (u) u.disabled = !hist.length || solved || !!auto;
  }
  function tap(p) {
    if (solved || auto) return;
    var t = tops();
    if (held === null) { if (!t[p]) { ctx.msg(NAMES[p] + ' 기둥에는 원판이 없어요.', 'bad'); return } held = p; ctx.msg(''); paint(); return }
    if (held === p) { held = null; paint(); return }
    if (t[p] && t[p] < t[held]) { ctx.msg('큰 원판은 작은 원판 위에 놓을 수 없어요.', 'bad'); shake(p); held = null; paint(); return }
    move(held, p);
  }
  function move(a, b) {
    var k = tops()[a]; hist.push([k, a]); pos[k - 1] = b; moves++; held = null; hintMove = null; ctx.msg(''); paint();
    if (pos.every(function (x) { return x === P.g })) {
      solved = true; paint();
      ctx.done(moves + '번 만에 다 옮겼어요! (가장 적은 횟수 ' + P.m + '번)' + (moves === P.m ? ' 가장 적은 횟수로 해냈어요!' : ''), moves);
    }
  }
  function shake(p) { var el = host.querySelector('.hn-peg[data-p="' + p + '"]'); el.classList.remove('shk'); void el.offsetWidth; el.classList.add('shk') }
  function onKey(e) {
    if (!host || !document.body.contains(host) || !host.querySelector('.hn-stage')) return;
    if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    if (/^[123]$/.test(e.key)) tap(+e.key - 1);
  }
  document.addEventListener('keydown', onKey);
  window.CRG = {
    render: function (h, p, c) {
      if (auto) { clearInterval(auto); auto = null }
      host = h; P = p; ctx = c; pos = p.s.slice(); held = null; moves = 0; hist = []; solved = false; hintMove = null;
      draw();
      host.onclick = function (e) {
        var pg = e.target.closest('.hn-peg'); if (pg) return tap(+pg.dataset.p);
        if (e.target.closest('#hnUndo') && hist.length && !solved && !auto) { var l = hist.pop(); pos[l[0] - 1] = l[1]; moves++; held = null; hintMove = null; ctx.msg('되돌리기도 한 번 옮긴 것으로 세요.'); paint() }
      };
    },
    hint: function () {   // 다음에 옮기면 좋은 원판을 알려 줌(기둥 두 개를 빛냄)
      if (solved || auto) return false;
      var mv = nextMove(); if (!mv) return false;
      held = null; hintMove = mv; paint();
      ctx.msg('💡 ' + NAMES[mv[1]] + ' 기둥 맨 위의 ' + mv[0] + '번 원판을 ' + NAMES[mv[2]] + ' 기둥으로 옮겨 보세요. (여기서부터 가장 적게: ' + minLeft() + '번)');
      return true;
    },
    reveal: function () {   // 지금 상태에서 가장 적은 횟수로 저절로 옮겨 보여 줌
      if (solved || auto) return;
      held = null; hintMove = null; var left = minLeft(), gap = Math.max(110, Math.min(450, 7000 / Math.max(1, left)));
      ctx.msg('가장 적은 횟수로 옮기는 방법을 보여 줄게요…');
      auto = setInterval(function () {
        var mv = nextMove(); if (!mv || !document.body.contains(host)) { clearInterval(auto); auto = null; return }
        var a = mv[1], b = mv[2];
        pos[mv[0] - 1] = b; moves++; hist.push([mv[0], a]); paint();
        if (pos.every(function (x) { return x === P.g })) { clearInterval(auto); auto = null; solved = true; paint(); ctx.done('이렇게 옮기면 돼요. (가장 적은 횟수 ' + P.m + '번)', moves) }
      }, gap);
    }
  };
})();
