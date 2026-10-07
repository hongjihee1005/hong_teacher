/* 주사위 경주판: 주사위 2개 → 합(또는 곱)을 말하고 맞으면 앞으로 */
window.GAME = function (host, api) {
  var op = '+';
  host.innerHTML = '<div class="cp-set"><label>계산 <select class="rc-op"><option value="+">두 수의 합 (1~2학년)</option><option value="×">두 수의 곱 (3학년~)</option><option value="−">큰 수 − 작은 수 (1~2학년)</option></select></label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 경주판 인쇄</button></div>'
    + '<div class="cp-helper"><h3>🎲 화면 주사위</h3><div class="rc-dice"></div><p class="rc-say tl-big"></p><button type="button" class="tl-btn" data-a="show">답 확인</button></div>';
  var v = [1, 1];
  function calc() { return op === '+' ? v[0] + v[1] : op === '×' ? v[0] * v[1] : Math.abs(v[0] - v[1]) }
  CP.dice(host.querySelector('.rc-dice'), 2, function (x) { v = x; host.querySelector('.rc-say').innerHTML = (op === '−' ? Math.max(v[0], v[1]) + ' − ' + Math.min(v[0], v[1]) : v[0] + ' ' + op + ' ' + v[1]) + ' = ?' });
  function board() {
    var N = 30, SP = { 5: '2칸 앞으로', 11: '한 번 쉬기', 16: '2칸 뒤로', 21: '한 번 더', 26: '3칸 뒤로' }, h = '<div class="rc-board">';
    for (var i = 0; i < N; i++) { var r = Math.floor(i / 6), c = r % 2 ? 5 - i % 6 : i % 6; h += '<div class="rc-sq' + (SP[i] ? ' rc-sp' : '') + (i === 0 ? ' rc-st' : '') + (i === N - 1 ? ' rc-end' : '') + '" style="grid-row:' + (5 - r) + ';grid-column:' + (c + 1) + '"><b>' + (i === 0 ? '출발' : i === N - 1 ? '도착' : i) + '</b>' + (SP[i] ? '<small>' + SP[i] + '</small>' : '') + '</div>' }
    return h + '</div>';
  }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; op = host.querySelector('.rc-op').value;
    if (b.dataset.a === 'show') host.querySelector('.rc-say').innerHTML = (op === '−' ? Math.max(v[0], v[1]) + ' − ' + Math.min(v[0], v[1]) : v[0] + ' ' + op + ' ' + v[1]) + ' = <b>' + calc() + '</b>';
    if (b.dataset.a === 'print') CP.print(CP.page(board() + '<div class="rc-rule"><b>규칙</b> (2~4명, 주사위 2개, 말) ① 차례대로 주사위 2개를 굴려요. ② 두 수의 ' + (op === '+' ? '합' : op === '×' ? '곱' : '차') + '을 소리 내어 말해요. ③ 맞으면 <b>큰 눈의 수</b>만큼 앞으로 가요(틀리면 제자리). ④ 색칠된 칸에 멈추면 칸에 쓰인 대로 해요. ⑤ 도착에 먼저 닿는 사람이 이겨요(딱 맞지 않아도 돼요).</div>', '주사위 경주 · 두 수의 ' + (op === '+' ? '합' : op === '×' ? '곱' : '차'), false));
  });
  api.bar('주사위 경주판');
};
