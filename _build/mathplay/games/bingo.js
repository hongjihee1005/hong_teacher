/* 수학 빙고: 학생마다 다른 빙고판 인쇄 + 화면에서 문제 뽑기 */
window.GAME = function (host, api) {
  /* 문제 종류마다 단계 쉬움·보통·도전(2026-11-26): ALL(단계)가 [문제, 답] 목록을 만들고, 판의 칸은 그 답들 */
  function rng(a, b, f) { var o = []; for (var x = a; x <= b; x++) f(x, o); return o }
  var TOP = {
    add: { nm: '덧셈', de: ['합이 10까지', '한 자리 + 한 자리', '두 자리 + 한 자리 (받아올림)'], all: function (L) { var o = []; if (L === 0) rng(1, 9, function (x) { rng(1, 9, function (y) { if (x + y <= 10) o.push([x + ' + ' + y, x + y]) }) }); else if (L === 1) rng(1, 9, function (x) { rng(1, 9, function (y) { o.push([x + ' + ' + y, x + y]) }) }); else rng(11, 38, function (a) { rng(2, 9, function (b) { if (a % 10 + b >= 10 && a % 10) o.push([a + ' + ' + b, a + b]) }) }); return o } },
    sub: { nm: '뺄셈', de: ['10까지의 뺄셈', '십몇 − 몇', '두 자리 − 한 자리 (받아내림)'], all: function (L) { var o = []; if (L === 0) rng(2, 10, function (a) { rng(1, a - 1, function (b) { o.push([a + ' − ' + b, a - b]) }) }); else if (L === 1) rng(10, 18, function (a) { rng(1, 9, function (b) { if (a - b >= 1 && a - b <= 9) o.push([a + ' − ' + b, a - b]) }) }); else rng(21, 49, function (a) { rng(2, 9, function (b) { if (a % 10 < b) o.push([a + ' − ' + b, a - b]) }) }); return o } },
    mul: { nm: '곱셈', de: ['2·3·4·5단', '곱셈구구 (2~9단)', '두 자리 × 한 자리 (11~19 × 2~5)'], all: function (L) { var o = []; if (L === 0) rng(2, 5, function (a) { rng(2, 9, function (b) { o.push([a + ' × ' + b, a * b]) }) }); else if (L === 1) rng(2, 9, function (a) { rng(2, 9, function (b) { o.push([a + ' × ' + b, a * b]) }) }); else rng(11, 19, function (a) { rng(2, 5, function (b) { o.push([a + ' × ' + b, a * b]) }) }); return o } },
    div: { nm: '나눗셈', de: ['÷2·÷3·÷4·÷5', '곱셈구구 범위 (÷2~÷9)', '몫이 두 자리 (몫 11~19, ÷2~÷5)'], all: function (L) { var o = []; if (L === 0) rng(2, 5, function (b) { rng(1, 9, function (v) { o.push([v * b + ' ÷ ' + b, v]) }) }); else if (L === 1) rng(2, 9, function (b) { rng(2, 9, function (v) { o.push([v * b + ' ÷ ' + b, v]) }) }); else rng(2, 5, function (b) { rng(11, 19, function (v) { if (v * b <= 99) o.push([v * b + ' ÷ ' + b, v]) }) }); return o } }
  };
  function tnm() { return TOP[t].nm + ' · ' + CP.LVN[L] + ' (' + TOP[t].de[L] + ')' }
  var t = 'mul', n = 4, cnt = 24, drawn = [], pool = [], L = 1;
  host.innerHTML = '<div class="cp-set"><label>문제 종류 <select class="bg-t">' + Object.keys(TOP).map(function (k) { return '<option value="' + k + '"' + (k === t ? ' selected' : '') + '>' + TOP[k].nm + '</option>' }).join('') + '</select></label>' + CP.lvSel('bingo') + '<label>판 크기 <select class="bg-n"><option value="3">3×3</option><option value="4" selected>4×4</option><option value="5">5×5</option></select></label><label>판 수(학생 수) <input class="bg-c" type="number" min="1" max="40" value="24"></label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 빙고판 인쇄(한 쪽에 2판)</button><button type="button" class="tl-btn" data-a="list">🖨️ 문제 목록 인쇄</button></div>'
    + '<p class="cp-note bg-de"></p><div class="cp-helper"><h3>🎤 문제 뽑기 (선생님 화면)</h3><p class="bg-q tl-big">?</p><div class="tl-row"><button type="button" class="tl-btn tl-go" data-a="draw">문제 뽑기</button><button type="button" class="tl-btn" data-a="ans" aria-pressed="false">답 보이기</button><button type="button" class="tl-btn" data-a="reset">처음부터</button></div><p class="bg-hist"></p></div><p class="cp-note">판마다 칸의 수(답)가 다르게 섞여 나와요. 문제를 듣고 답이 판에 있으면 ○ 표, 가로·세로·대각선 한 줄이 되면 “빙고!”</p>';
  var showA = false;
  function pk() { t = host.querySelector('.bg-t').value; L = CP.lv(host); n = +host.querySelector('.bg-n').value; cnt = Math.max(1, Math.min(40, +host.querySelector('.bg-c').value || 1)); }
  function allQ() { return TOP[t].all(L) }
  function ansOf() { var s = {}; allQ().forEach(function (q) { s[q[1]] = 1 }); return Object.keys(s).map(Number).sort(function (x, y) { return x - y }) }
  function board() { var A = ansOf(), cells = CP.shuffle(A).slice(0, n * n); while (cells.length < n * n) cells.push(CP.shuffle(A)[0]); return cells }
  function boardsHtml() { var h = ''; for (var i = 0; i < cnt; i += 2) { var two = ''; for (var k = i; k < Math.min(cnt, i + 2); k++) { var b = board(); two += '<div class="bg-one"><div class="bg-top"><b>수학 빙고 · ' + TOP[t].nm + '</b><span>이름 __________</span></div><div class="bg-grid" style="--n:' + n + '">' + b.map(function (v) { return '<span>' + v + '</span>' }).join('') + '</div></div>' } h += '<div class="cp-pg bg-pg">' + two + '<p class="cp-ft">교실 수학 놀이 · 초등교사 홍지희</p></div>' } return h }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; pk(); var a = b.dataset.a;
    if (a === 'print') CP.print(boardsHtml());
    if (a === 'list') { var Q = allQ(); CP.print(CP.page('<div class="bg-list">' + Q.map(function (q) { return '<span>' + q[0] + ' <small>= ' + q[1] + '</small></span>' }).join('') + '</div>', '수학 빙고 문제 목록 · ' + tnm() + ' (' + Q.length + '문제, 잘라서 뽑기 상자에)', false)) }
    if (a === 'draw') { if (!pool.length) { pool = CP.shuffle(allQ()); drawn = [] } var q = pool.pop(); drawn.push(q); host.querySelector('.bg-q').innerHTML = q[0] + (showA ? ' = <b>' + q[1] + '</b>' : ' = ?'); host.querySelector('.bg-hist').innerHTML = '뽑은 문제 ' + drawn.length + '개: ' + drawn.map(function (x) { return x[0] + (showA ? '=' + x[1] : '') }).join(' · '); api.bar('수학 빙고 · ' + drawn.length + '번째 문제') }
    if (a === 'ans') { showA = !showA; b.setAttribute('aria-pressed', showA ? 'true' : 'false') }
    if (a === 'reset') { pool = []; drawn = []; host.querySelector('.bg-q').textContent = '?'; host.querySelector('.bg-hist').textContent = '' }
  });
  function showDe() { pk(); host.querySelector('.bg-de').textContent = '지금 고른 문제: ' + tnm() + ' · 칸에 들어갈 답 ' + ansOf().length + '가지' + (ansOf().length < n * n ? ' (판 칸보다 적어 같은 수가 두 번 나오는 칸이 있어요)' : '') }
  host.querySelector('.bg-t').onchange = host.querySelector('.cp-lv').onchange = host.querySelector('.bg-n').onchange = function () { pool = []; drawn = []; showDe() };
  showDe();
  api.bar('수학 빙고');
};
