/* 넓이 땅따먹기: 주사위 두 개의 눈만큼 가로·세로 직사각형을 그리고 넓이 식 쓰기 */
window.GAME = function (host, api) {
  host.innerHTML = '<div class="cp-set"><label>모눈 <select class="ar-s"><option value="16x20">16칸 × 20칸 (3~4학년)</option><option value="20x24" selected>20칸 × 24칸 (5학년~)</option></select></label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 모눈 놀이판 인쇄</button></div><div class="cp-helper"><h3>🎲 화면 주사위</h3><div class="ar-dice"></div><p class="ar-say tl-big"></p></div>';
  CP.dice(host.querySelector('.ar-dice'), 2, function (v) { host.querySelector('.ar-say').innerHTML = '가로 ' + v[0] + '칸 × 세로 ' + v[1] + '칸 직사각형 → 넓이 <b>?</b>' });
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || b.dataset.a !== 'print') return;
    var sz = host.querySelector('.ar-s').value.split('x').map(Number), c = sz[0], r = sz[1], cell = Math.min(180 / c, 170 / r);
    var g = '<div class="ar-grid" style="grid-template-columns:repeat(' + c + ',' + cell + 'mm);grid-template-rows:repeat(' + r + ',' + cell + 'mm)">' + new Array(c * r + 1).join('<i></i>') + '</div>';
    var rec = '<table class="ar-rec"><tr><th>차례</th><th>나 (넓이 식)</th><th>친구 (넓이 식)</th></tr>' + [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) { return '<tr><td>' + i + '</td><td></td><td></td></tr>' }).join('') + '<tr><th>합계</th><td></td><td></td></tr></table>';
    CP.print(CP.page(g, '넓이 땅따먹기 · ' + c + '칸 × ' + r + '칸', false) + CP.page('<p class="pr-rule"><b>규칙</b> (2명, 주사위 2개, 색연필 2가지) ① 차례대로 주사위 2개를 굴려요. ② 나온 두 눈을 <b>가로·세로 칸 수</b>로 하는 직사각형을 모눈의 빈 곳에 그리고 색칠해요(다른 땅과 겹치면 안 돼요). ③ 직사각형 안에 넓이 식(예: 4 × 3 = 12)을 써요. ④ 그릴 자리가 없으면 한 번 쉬어요. 두 사람 모두 그릴 수 없으면 끝! 넓이의 합이 더 큰 사람이 이겨요.</p>' + rec + '<div class="ar-think"><b>생각해 봐요</b> 같은 넓이 12칸을 만드는 직사각형은 몇 가지일까요? 가로와 세로를 바꿔 그리면 넓이가 같을까요?</div>', '넓이 땅따먹기 · 기록표'));
  });
  api.bar('넓이 땅따먹기');
};
