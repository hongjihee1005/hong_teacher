/* 분수 카드 대결: 두 사람이 한 장씩 뒤집어 더 큰 분수가 이김 */
window.GAME = function (host, api) {
  /* 단계(2026-11-26): 쉬움 분모 2·4·8(막대 반씩 나누기) · 보통 분모 2~12 · 도전 분모 3~12의 비슷한 크기 분수(그림 없이 견주기 권장) */
  var LS = [[[1, 2], [1, 4], [2, 4], [3, 4], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [1, 2], [1, 4], [3, 4], [1, 8], [3, 8], [5, 8], [7, 8], [2, 4], [4, 8], [6, 8], [2, 8], [1, 2], [3, 4]],
    [[1, 2], [1, 3], [2, 3], [1, 4], [2, 4], [3, 4], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [1, 12], [3, 12], [4, 12], [6, 12], [8, 12], [9, 12]],
    [[2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [3, 5], [5, 8], [4, 7], [7, 12], [5, 9], [3, 7], [2, 5], [5, 12], [3, 8], [4, 9], [7, 10], [5, 7], [1, 3], [2, 7], [3, 10], [6, 9]]];
  var DE = ['분모가 2·4·8인 분수 — 막대를 반씩 나누어 견줘요', '분모가 2~12인 여러 가지 분수', '크기가 비슷한 분수 — 통분하거나 1에 얼마나 가까운지 견줘요'], L = LS[1];
  function lvNow() { var v = CP.lv(host); L = LS[v]; return v }
  host.innerHTML = '<div class="cp-set">' + CP.lvSel('fracwar') + '<label><input type="checkbox" class="fw-pic" checked> 막대 그림 넣기</label><label>모둠 수 <input class="fw-g" type="number" min="1" max="10" value="1"></label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 카드 인쇄(모둠마다 24장)</button></div>'
    + '<p class="cp-note fw-de"></p><div class="cp-helper"><h3>🖥️ 화면에서 대결해 보기</h3><div class="fw-vs"></div><div class="tl-row"><button type="button" class="tl-btn tl-go" data-a="flip">카드 두 장 뒤집기</button><button type="button" class="tl-btn" data-a="who" disabled>어느 쪽이 클까? 정답</button></div><p class="tl-msg"></p></div><div class="cp-prev"></div>';
  function bar(a, b) { var s = '<svg viewBox="0 0 120 30" class="fw-bar">'; for (var i = 0; i < b; i++) s += '<rect x="' + (1 + i * 118 / b) + '" y="2" width="' + 118 / b + '" height="26" fill="' + (i < a ? '#F0A05A' : '#fff') + '" stroke="#000" stroke-width="1.3"/>'; return s + '</svg>' }
  function card(p, pic) { return '<div class="fw-card"><span class="fd-fr fw-f"><i>' + p[0] + '</i><i>' + p[1] + '</i></span>' + (pic ? bar(p[0], p[1]) : '') + '</div>' }
  var cur = null;
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var pic = host.querySelector('.fw-pic').checked, v = lvNow();
    if (b.dataset.a === 'flip') { var s = CP.shuffle(L); cur = [s[0], s[1]]; host.querySelector('.fw-vs').innerHTML = card(cur[0], pic) + '<b class="fw-x">VS</b>' + card(cur[1], pic); host.querySelector('[data-a="who"]').disabled = false; host.querySelector('.tl-msg').textContent = '어느 분수가 더 클까요? 생각해 보고 정답을 눌러요.' }
    if (b.dataset.a === 'who' && cur) { var x = cur[0][0] / cur[0][1], y = cur[1][0] / cur[1][1]; host.querySelector('.tl-msg').innerHTML = x === y ? '두 분수의 크기가 같아요! (' + cur[0].join('/') + ' = ' + cur[1].join('/') + ') — 이럴 땐 “전쟁”: 한 장씩 더 뒤집어요.' : '<b>' + (x > y ? cur[0] : cur[1]).join('/') + '</b>' + ('013678'.indexOf(String((x > y ? cur[0] : cur[1])[0]).slice(-1)) >= 0 ? '이' : '가') + ' 더 커요. 막대의 색칠한 길이를 견줘 보세요.'; host.querySelector('.fw-vs').innerHTML = card(cur[0], true) + '<b class="fw-x">' + (x > y ? '&gt;' : x < y ? '&lt;' : '=') + '</b>' + card(cur[1], true) }
    if (b.dataset.a === 'print') { var g = Math.max(1, Math.min(10, +host.querySelector('.fw-g').value || 1)), h = ''; for (var i = 0; i < g; i++) h += CP.page(sheet(pic), '분수 카드 대결 · ' + CP.LVN[v] + (g > 1 ? ' (' + (i + 1) + '모둠)' : ''), false); CP.print(h) }
  });
  function sheet(pic) { return '<div class="fw-grid">' + L.map(function (p) { return card(p, pic) }).join('') + '</div><p class="pr-rule"><b>규칙</b> (2명) 카드를 잘라 섞어 반씩 나눠 뒤집어 쌓아요. 동시에 한 장씩 뒤집어 <b>더 큰 분수</b>를 낸 사람이 두 장을 가져가요. 크기가 같으면(예: 1/2과 4/8) “전쟁!” 한 장씩 더 뒤집어 이긴 사람이 모두 가져가요. 카드를 모두 가져간 사람(또는 시간이 끝났을 때 많이 가진 사람)이 이겨요.</p>' }
  function prev() { var v = lvNow(); host.querySelector('.fw-de').textContent = CP.LVN[v] + ': ' + DE[v]; host.querySelector('.cp-prev').innerHTML = CP.page(sheet(host.querySelector('.fw-pic').checked), '분수 카드 대결 · ' + CP.LVN[v], false) }
  host.querySelector('.fw-pic').onchange = prev;
  host.querySelector('.cp-lv').onchange = function () { if (+this.value === 2) host.querySelector('.fw-pic').checked = false; else if (+this.value === 0) host.querySelector('.fw-pic').checked = true; prev() };
  prev();
  api.bar('분수 카드 대결');
};
