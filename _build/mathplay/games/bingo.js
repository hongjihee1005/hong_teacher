/* 수학 빙고: 학생마다 다른 빙고판 인쇄 + 화면에서 문제 뽑기 */
window.GAME = function (host, api) {
  var TOP = {
    add: { nm: '덧셈 (한 자리 + 한 자리)', ans: function () { var a = []; for (var i = 2; i <= 18; i++) a.push(i); return a }, q: function (v) { var o = []; for (var x = 1; x <= 9; x++) { var y = v - x; if (y >= 1 && y <= 9) o.push(x + ' + ' + y) } return o } },
    sub: { nm: '뺄셈 (십몇 − 몇)', ans: function () { return [1, 2, 3, 4, 5, 6, 7, 8, 9] }, q: function (v) { var o = []; for (var a = 10; a <= 18; a++) { var b = a - v; if (b >= 1 && b <= 9) o.push(a + ' − ' + b) } return o } },
    mul: { nm: '곱셈구구', ans: function () { var s = {}; for (var a = 2; a <= 9; a++) for (var b = 2; b <= 9; b++) s[a * b] = 1; return Object.keys(s).map(Number).sort(function (x, y) { return x - y }) }, q: function (v) { var o = []; for (var a = 2; a <= 9; a++) if (v % a === 0 && v / a >= 2 && v / a <= 9) o.push(a + ' × ' + v / a); return o } },
    div: { nm: '나눗셈 (곱셈구구 범위)', ans: function () { return [2, 3, 4, 5, 6, 7, 8, 9] }, q: function (v) { var o = []; for (var b = 2; b <= 9; b++) o.push(v * b + ' ÷ ' + b); return o } }
  };
  var t = 'mul', n = 4, cnt = 24, drawn = [], pool = [];
  host.innerHTML = '<div class="cp-set"><label>문제 종류 <select class="bg-t">' + Object.keys(TOP).map(function (k) { return '<option value="' + k + '"' + (k === t ? ' selected' : '') + '>' + TOP[k].nm + '</option>' }).join('') + '</select></label><label>판 크기 <select class="bg-n"><option value="3">3×3</option><option value="4" selected>4×4</option><option value="5">5×5</option></select></label><label>판 수(학생 수) <input class="bg-c" type="number" min="1" max="40" value="24"></label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 빙고판 인쇄(한 쪽에 2판)</button><button type="button" class="tl-btn" data-a="list">🖨️ 문제 목록 인쇄</button></div>'
    + '<div class="cp-helper"><h3>🎤 문제 뽑기 (선생님 화면)</h3><p class="bg-q tl-big">?</p><div class="tl-row"><button type="button" class="tl-btn tl-go" data-a="draw">문제 뽑기</button><button type="button" class="tl-btn" data-a="ans" aria-pressed="false">답 보이기</button><button type="button" class="tl-btn" data-a="reset">처음부터</button></div><p class="bg-hist"></p></div><p class="cp-note">판마다 칸의 수(답)가 다르게 섞여 나와요. 문제를 듣고 답이 판에 있으면 ○ 표, 가로·세로·대각선 한 줄이 되면 “빙고!”</p>';
  var showA = false;
  function pk() { t = host.querySelector('.bg-t').value; n = +host.querySelector('.bg-n').value; cnt = Math.max(1, Math.min(40, +host.querySelector('.bg-c').value || 1)); }
  function allQ() { var T = TOP[t], o = []; T.ans().forEach(function (v) { T.q(v).forEach(function (q) { o.push([q, v]) }) }); return o }
  function board() { var A = TOP[t].ans(), cells = CP.shuffle(A).slice(0, n * n); while (cells.length < n * n) cells.push(CP.shuffle(A)[0]); return cells }
  function boardsHtml() { var h = ''; for (var i = 0; i < cnt; i += 2) { var two = ''; for (var k = i; k < Math.min(cnt, i + 2); k++) { var b = board(); two += '<div class="bg-one"><div class="bg-top"><b>수학 빙고 · ' + TOP[t].nm + '</b><span>이름 __________</span></div><div class="bg-grid" style="--n:' + n + '">' + b.map(function (v) { return '<span>' + v + '</span>' }).join('') + '</div></div>' } h += '<div class="cp-pg bg-pg">' + two + '<p class="cp-ft">교실 수학 놀이 · 초등교사 홍지희</p></div>' } return h }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; pk(); var a = b.dataset.a;
    if (a === 'print') CP.print(boardsHtml());
    if (a === 'list') { var Q = allQ(); CP.print(CP.page('<div class="bg-list">' + Q.map(function (q) { return '<span>' + q[0] + ' <small>= ' + q[1] + '</small></span>' }).join('') + '</div>', '수학 빙고 문제 목록 · ' + TOP[t].nm + ' (' + Q.length + '문제, 잘라서 뽑기 상자에)', false)) }
    if (a === 'draw') { if (!pool.length) { pool = CP.shuffle(allQ()); drawn = [] } var q = pool.pop(); drawn.push(q); host.querySelector('.bg-q').innerHTML = q[0] + (showA ? ' = <b>' + q[1] + '</b>' : ' = ?'); host.querySelector('.bg-hist').innerHTML = '뽑은 문제 ' + drawn.length + '개: ' + drawn.map(function (x) { return x[0] + (showA ? '=' + x[1] : '') }).join(' · '); api.bar('수학 빙고 · ' + drawn.length + '번째 문제') }
    if (a === 'ans') { showA = !showA; b.setAttribute('aria-pressed', showA ? 'true' : 'false') }
    if (a === 'reset') { pool = []; drawn = []; host.querySelector('.bg-q').textContent = '?'; host.querySelector('.bg-hist').textContent = '' }
  });
  host.querySelector('.bg-t').onchange = function () { pool = []; drawn = [] };
  api.bar('수학 빙고');
};
