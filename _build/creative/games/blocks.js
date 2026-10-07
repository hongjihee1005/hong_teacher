/* 창의수학게임 › 쌓기나무: 입체 그림이나 위·앞·옆에서 본 모양을 보고 3×3 판에 똑같이 쌓기 */
(function () {
  'use strict';
  var N = 3, MAX = 3;
  var P, ctx, host, cur, mode, sel, solved, want;   // want: 정답 높이(쉬움·보통은 하나뿐, 도전은 예시 하나)
  function views(h) {
    var top = [], front = [], side = [], x, y;
    for (y = 0; y < N; y++) { top.push([]); for (x = 0; x < N; x++) top[y].push(h[y][x] ? 1 : 0) }
    for (x = 0; x < N; x++) { var m = 0; for (y = 0; y < N; y++) m = Math.max(m, h[y][x]); front.push(m) }
    for (y = N - 1; y >= 0; y--) side.push(Math.max.apply(null, h[y]));   // 왼쪽이 앞줄
    return [top, front, side];
  }
  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b) }
  function total(h) { return h.reduce(function (s, r) { return s + r.reduce(function (t, v) { return t + v }, 0) }, 0) }

  // 입체 그림(앞·오른쪽 위에서 본 모습). x 오른쪽, y 앞쪽, z 위
  var W = 26, H = 15, V = 30;
  function pt(x, y, z) { return ((x - y) * W).toFixed(1) + ',' + ((x + y) * H - z * V).toFixed(1) }
  function poly(ps, cls) { return '<polygon class="' + cls + '" points="' + ps.join(' ') + '"/>' }
  function iso(h, label) {
    var b = '', x, y, z, k;
    for (y = 0; y < N; y++) for (x = 0; x < N; x++) b += poly([pt(x, y, 0), pt(x + 1, y, 0), pt(x + 1, y + 1, 0), pt(x, y + 1, 0)], 'bk-floor');
    for (k = 0; k <= 2 * (N - 1); k++) for (x = 0; x < N; x++) {
      y = k - x; if (y < 0 || y >= N) continue;
      for (z = 0; z < h[y][x]; z++) {
        b += poly([pt(x, y + 1, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1)], 'bk-f')
          + poly([pt(x + 1, y, z), pt(x + 1, y + 1, z), pt(x + 1, y + 1, z + 1), pt(x + 1, y, z + 1)], 'bk-r')
          + poly([pt(x, y, z + 1), pt(x + 1, y, z + 1), pt(x + 1, y + 1, z + 1), pt(x, y + 1, z + 1)], 'bk-t');
      }
    }
    var lx = ((-N / 2 - .3) * W - 14).toFixed(1), ly = ((N * 1.5 + .3) * H + 12).toFixed(1);
    b += '<text class="bk-lab" x="' + lx + '" y="' + ly + '" text-anchor="middle">앞</text>';
    var x0 = -N * W - 22, y0 = -MAX * V - 8, w = 2 * N * W + 44, hh = 2 * N * H + MAX * V + 30;
    return '<svg class="bk-iso" viewBox="' + x0 + ' ' + y0 + ' ' + w + ' ' + hh + '" role="img" aria-label="' + label + '">' + b + '</svg>';
  }
  // 위·앞·옆에서 본 모양(칸 그림)
  function view(kind, v, mark) {
    var s = 22, p = 3, cells = '', i, j, rows = kind === 'top' ? N : MAX;
    for (i = 0; i < N; i++) for (j = 0; j < rows; j++) {
      var on = kind === 'top' ? v[j][i] : v[i] > rows - 1 - j;
      cells += '<rect x="' + (p + i * s) + '" y="' + (p + j * s) + '" width="' + s + '" height="' + s + '" class="' + (on ? 'bk-von' : 'bk-voff') + '"/>';
    }
    var name = { top: '위', front: '앞', side: '옆' }[kind];
    return '<figure class="bk-view' + (mark === true ? ' ok' : mark === false ? ' no' : '') + '"><svg viewBox="0 0 ' + (N * s + 2 * p) + ' ' + (rows * s + 2 * p) + '" role="img" aria-label="' + name + '에서 본 모양">' + cells
      + (kind === 'top' ? '' : '<line x1="0" x2="' + (N * s + 2 * p) + '" y1="' + (rows * s + p) + '" y2="' + (rows * s + p) + '" class="bk-ground"/>') + '</svg>'
      + '<figcaption>' + name + (kind === 'side' ? '(오른쪽)' : '') + (mark === true ? ' ✓' : '') + '</figcaption></figure>';
  }
  function viewsRow(v, marks) {
    return view('top', v[0], marks && marks[0]) + view('front', v[1], marks && marks[1]) + view('side', v[2], marks && marks[2]);
  }
  function goalText() {
    var lv = ctx.level.id;
    if (lv === 'easy') return '그림과 <b>똑같이</b> 쌓아 보세요. 쌓기나무는 몇 개일까요?';
    if (lv === 'normal') return '위·앞·옆에서 본 모양이 <b>똑같이</b> 되도록 쌓아 보세요.';
    return '세 모양이 똑같이 되도록, 쌓기나무를 <b>' + (P.want === 'min' ? '가장 적게' : '가장 많이') + '</b> 쌓아 보세요.';
  }
  function draw() {
    var lv = ctx.level.id, tv = lv === 'easy' ? null : (P.v || views(P.h));
    var h = '<p class="bk-goal">' + goalText() + '</p><div class="bk-wrap"><section class="bk-pane bk-target"><h3>보기</h3>'
      + (lv === 'easy' ? iso(P.h, '쌓기나무 입체 그림') : '<div class="bk-views">' + viewsRow(tv) + '</div>')
      + '</section><section class="bk-pane bk-mine"><h3>내가 쌓은 것 <span class="bk-cnt"></span></h3><div class="bk-build">'
      + '<div class="bk-boardwrap"><span class="bk-side">뒤</span><div class="bk-board" role="grid" aria-label="위에서 본 판(아래쪽이 앞)">';
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) h += '<button type="button" class="bk-cell" data-x="' + x + '" data-y="' + y + '" aria-label="' + (y + 1) + '째 줄 ' + (x + 1) + '째 칸"></button>';
    h += '</div><span class="bk-side">앞</span></div><div class="bk-prev"></div></div>'
      + '<div class="bk-modes"><button type="button" class="bk-mode" data-m="add">➕ 쌓기</button><button type="button" class="bk-mode" data-m="sub">➖ 빼기</button></div>'
      + (lv === 'easy' ? '' : '<div class="bk-views bk-myviews"></div>') + '</section></div>'
      + '<p class="bk-tip">판(위에서 본 모양, 아래쪽이 앞)의 칸을 누르면 한 개씩 쌓아요(한 칸에 ' + MAX + '개까지). 키보드: 방향키로 칸 옮기기, 0~3 높이, +/− 쌓기·빼기.</p>';
    host.innerHTML = h; paint();
  }
  function paint() {
    host.querySelectorAll('.bk-cell').forEach(function (el) {
      var x = +el.dataset.x, y = +el.dataset.y, v = cur[y][x];
      el.textContent = v || ''; el.className = 'bk-cell bk-h' + v + (x === sel[0] && y === sel[1] ? ' bk-cur' : '') + (solved ? ' bk-solved' : '');
    });
    host.querySelectorAll('.bk-mode').forEach(function (el) { el.classList.toggle('bk-act', el.dataset.m === mode) });
    host.querySelector('.bk-cnt').textContent = '· ' + total(cur) + '개';
    host.querySelector('.bk-prev').innerHTML = iso(cur, '내가 쌓은 쌓기나무');
    var mv = host.querySelector('.bk-myviews');
    if (mv) { var a = views(cur), t = P.v || views(P.h); mv.innerHTML = viewsRow(a, a.map(function (v, i) { return same(v, t[i]) })) }
  }
  function judge(quiet) {
    var lv = ctx.level.id, n = total(cur);
    if (lv === 'easy') {
      if (same(cur, P.h)) { solved = true; paint(); ctx.done('그림과 똑같이 쌓았어요! 쌓기나무는 모두 ' + n + '개예요.'); return }
      if (!quiet) ctx.msg(''); return;
    }
    var t = P.v || views(P.h), ok = same(views(cur), t);
    if (ok && (lv === 'normal' || n === P.n)) {
      solved = true; paint();
      ctx.done(lv === 'normal' ? '세 모양이 모두 똑같아요! 쌓기나무는 ' + n + '개예요.' : '세 모양이 같고 ' + (P.want === 'min' ? '가장 적은' : '가장 많은') + ' ' + n + '개로 쌓았어요!');
      return;
    }
    if (ok) ctx.msg('세 모양은 맞아요! 그런데 지금 ' + n + '개예요. ' + (P.want === 'min' ? '더 적게' : '더 많이') + ' 쌓을 수 있어요.', 'bad');
    else if (!quiet) ctx.msg('');
  }
  function setCell(x, y, v) {
    if (solved) return;
    sel = [x, y]; cur[y][x] = Math.max(0, Math.min(MAX, v)); paint(); judge();
  }
  document.addEventListener('keydown', function (e) {
    if (!host || !document.body.contains(host) || !host.querySelector('.bk-board') || solved) return;
    if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    var x = sel[0], y = sel[1], d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
    if (d) { e.preventDefault(); sel = [(x + d[0] + N) % N, (y + d[1] + N) % N]; paint() }
    else if (/^[0-3]$/.test(e.key)) setCell(x, y, +e.key);
    else if (e.key === '+' || e.key === '=') setCell(x, y, cur[y][x] + 1);
    else if (e.key === '-' || e.key === 'Backspace') setCell(x, y, cur[y][x] - 1);
  });
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; solved = false; mode = 'add'; sel = [0, N - 1];
      cur = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; want = p.h; draw();
      host.onclick = function (e) {
        var cell = e.target.closest('.bk-cell'), m = e.target.closest('.bk-mode');
        if (m) { mode = m.dataset.m; paint() }
        else if (cell) { var x = +cell.dataset.x, y = +cell.dataset.y; setCell(x, y, cur[y][x] + (mode === 'add' ? 1 : -1)) }
      };
    },
    hint: function () {   // 다른 칸 하나를 정답 높이로
      if (solved) return false;
      var lv = ctx.level.id, t = P.v || views(P.h);
      // 도전에서 세 모양이 이미 맞고 다른 방법으로 쌓는 중이면 예시 답으로 이끎
      for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) if (cur[y][x] !== want[y][x]) {
        sel = [x, y]; cur[y][x] = want[y][x]; paint(); judge(true);
        if (!solved) ctx.msg('💡 ' + (N - y) + '째 줄(앞에서부터) ' + (x + 1) + '째 칸에는 ' + want[y][x] + '개를 쌓아요.'
          + (lv === 'easy' ? '' : ' 앞에서 본 모양은 세로줄마다, 옆에서 본 모양은 가로줄마다 가장 높은 것만 보여요.'));
        return true;
      }
      return false;
    },
    reveal: function () { cur = want.map(function (r) { return r.slice() }); paint(); judge() }
  };
})();
