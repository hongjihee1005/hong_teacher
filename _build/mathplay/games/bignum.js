/* 가장 큰 수 만들기: 숫자 카드를 뽑을 때마다 바로 자리를 정해 쓰기 */
window.GAME = function (host, api) {
  var D = 4, deck = [], got = [];
  var PL = ['일', '십', '백', '천', '만', '십만'];
  host.innerHTML = '<div class="cp-set"><label>자릿수 <select class="bn-d"><option value="3">세 자리</option><option value="4" selected>네 자리</option><option value="5">다섯 자리</option><option value="6">여섯 자리</option></select></label><label>목표 <select class="bn-t"><option value="big">가장 큰 수</option><option value="small">가장 작은 수</option></select></label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 놀이판 인쇄(한 쪽에 5판)</button></div>'
    + '<div class="cp-helper"><h3>🃏 숫자 카드 뽑기 (0~9 각 한 장)</h3><p class="bn-card tl-big">?</p><div class="tl-row"><button type="button" class="tl-btn tl-go" data-a="draw">카드 뽑기</button><button type="button" class="tl-btn" data-a="reset">새 판</button></div><p class="bn-hist"></p></div><p class="cp-note">뽑은 숫자는 <b>바로</b> 자기 놀이판의 빈칸 하나에 써야 하고, 한 번 쓰면 바꿀 수 없어요. 칸이 다 차면 수를 읽고, 목표에 가장 가까운 사람이 이겨요.</p>';
  function reset() { D = +host.querySelector('.bn-d').value; deck = CP.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); got = []; host.querySelector('.bn-card').textContent = '?'; host.querySelector('.bn-hist').textContent = '' }
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.a === 'draw') { if (got.length >= D) { host.querySelector('.bn-hist').innerHTML += ' — 칸이 다 찼어요! 자기 수를 읽어 보세요. 뽑힌 숫자로 만들 수 있었던 가장 큰 수: <b>' + got.slice().sort(function (a, b) { return b - a }).join('') + '</b>, 가장 작은 수: <b>' + small(got) + '</b>'; return } var v = deck.pop(); got.push(v); host.querySelector('.bn-card').textContent = v; host.querySelector('.bn-hist').textContent = '뽑은 숫자: ' + got.join(', ') + ' (' + got.length + '/' + D + ')'; api.bar('가장 큰 수 만들기 · ' + got.length + '번째 카드') }
    if (b.dataset.a === 'reset') reset();
    if (b.dataset.a === 'print') { D = +host.querySelector('.bn-d').value; var t = host.querySelector('.bn-t').value, one = function (k) { return '<div class="bn-one"><span class="bn-r">' + k + '판</span><table class="bn-tbl"><tr>' + PL.slice(0, D).reverse().map(function (p) { return '<th>' + p + '</th>' }).join('') + '</tr><tr>' + PL.slice(0, D).map(function () { return '<td></td>' }).join('') + '</tr></table><span class="bn-read">읽기: ____________</span></div>' }, h = ''; for (var k = 1; k <= 5; k++) h += one(k); CP.print(CP.page(h + '<p class="pr-rule"><b>규칙</b> 선생님(또는 모둠 친구)이 숫자 카드를 한 장씩 뽑아요. 뽑을 때마다 <b>바로</b> 빈칸 하나에 써요(바꿀 수 없어요). 칸이 다 차면 수를 읽고, <b>' + (t === 'big' ? '가장 큰 수' : '가장 작은 수(맨 앞자리는 0이 아니게)') + '</b>를 만든 사람이 이겨요. 💡 큰 숫자가 나오면 어느 자리에 쓰는 게 좋을까요?</p>', '가장 ' + (t === 'big' ? '큰' : '작은') + ' 수 만들기')) }
  });
  function small(a) { var s = a.slice().sort(function (x, y) { return x - y }), i = s.findIndex(function (x) { return x > 0 }); if (i > 0) { var f = s.splice(i, 1)[0]; s.unshift(f) } return s.join('') }
  host.querySelector('.bn-d').onchange = reset; reset(); api.bar('가장 큰 수 만들기');
};
