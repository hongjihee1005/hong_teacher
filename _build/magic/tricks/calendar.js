/* 달력 마술: 3×3 묶음 아홉 수의 합을 바로 맞히기 = 가운데 수 × 9 */
window.TRICK = function (host, api) {
  var start = 3, days = 31, pick = null;   // 1일이 수요일
  host.innerHTML = '<p class="mj-say">달력에서 <b>가로 3칸 × 세로 3칸</b> 묶음을 하나 골라요(묶음의 왼쪽 위 칸을 눌러요). 마술사가 아홉 수의 합을 바로 맞혀요!</p><div class="mj-cal"></div><div class="mj-env"><span>🎩 마술사의 답</span><b class="mj-pred">?</b></div><div class="tl-row"><button type="button" class="tl-btn mj-chk" disabled>직접 더해서 확인하기</button></div><p class="tl-msg" aria-live="polite"></p>';
  var cal = host.querySelector('.mj-cal'), msg = host.querySelector('.tl-msg');
  function cell(r, c) { var d = r * 7 + c - start + 1; return d >= 1 && d <= days ? d : 0 }
  function draw() {
    var h = '일월화수목금토'.split('').map(function (d) { return '<b class="mj-dw">' + d + '</b>' }).join('');
    for (var r = 0; r < 5; r++) for (var c = 0; c < 7; c++) { var d = cell(r, c), inP = pick && r >= pick[0] && r < pick[0] + 3 && c >= pick[1] && c < pick[1] + 3; h += '<button type="button" class="mj-day' + (inP ? ' mj-in3' : '') + (pick && r === pick[0] + 1 && c === pick[1] + 1 ? ' mj-mid' : '') + '" data-r="' + r + '" data-c="' + c + '"' + (d ? '' : ' disabled') + '>' + (d || '') + '</button>' }
    cal.innerHTML = h;
  }
  cal.onclick = function (e) {
    var b = e.target.closest('.mj-day'); if (!b) return; var r = +b.dataset.r, c = +b.dataset.c;
    if (c > 4 || r > 2 || !cell(r, c) || !cell(r + 2, c + 2) || !cell(r, c + 2) || !cell(r + 2, c)) { msg.textContent = '3×3 묶음이 달력 안에 다 들어가게 왼쪽 위 칸을 골라 주세요.'; return }
    pick = [r, c]; draw(); host.querySelector('.mj-pred').textContent = cell(r + 1, c + 1) * 9; host.querySelector('.mj-chk').disabled = false; msg.textContent = '정말일까요? 직접 더해 보세요!'; api.done();
  };
  host.querySelector('.mj-chk').onclick = function () { var a = []; for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) a.push(cell(pick[0] + i, pick[1] + j)); msg.innerHTML = a.join(' + ') + ' = <b>' + a.reduce(function (x, y) { return x + y }, 0) + '</b> ✔'; msg.style.color = 'var(--ok)' };
  draw();
};
