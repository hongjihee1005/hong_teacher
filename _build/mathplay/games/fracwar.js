/* 분수 카드 대결: 두 사람이 한 장씩 뒤집어 더 큰 분수가 이김 */
window.GAME = function (host, api) {
  var L = [[1, 2], [1, 3], [2, 3], [1, 4], [2, 4], [3, 4], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [1, 12], [3, 12], [4, 12], [6, 12], [8, 12], [9, 12]];
  host.innerHTML = '<div class="cp-set"><label><input type="checkbox" class="fw-pic" checked> 막대 그림 넣기(쉬움)</label><label>모둠 수 <input class="fw-g" type="number" min="1" max="10" value="1"></label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 카드 인쇄(모둠마다 24장)</button></div>'
    + '<div class="cp-helper"><h3>🖥️ 화면에서 대결해 보기</h3><div class="fw-vs"></div><div class="tl-row"><button type="button" class="tl-btn tl-go" data-a="flip">카드 두 장 뒤집기</button><button type="button" class="tl-btn" data-a="who" disabled>어느 쪽이 클까? 정답</button></div><p class="tl-msg"></p></div><div class="cp-prev"></div>';
  function bar(a, b) { var s = '<svg viewBox="0 0 120 30" class="fw-bar">'; for (var i = 0; i < b; i++) s += '<rect x="' + (1 + i * 118 / b) + '" y="2" width="' + 118 / b + '" height="26" fill="' + (i < a ? '#F0A05A' : '#fff') + '" stroke="#000" stroke-width="1.3"/>'; return s + '</svg>' }
  function card(p, pic) { return '<div class="fw-card"><span class="fd-fr fw-f"><i>' + p[0] + '</i><i>' + p[1] + '</i></span>' + (pic ? bar(p[0], p[1]) : '') + '</div>' }
  var cur = null;
  host.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var pic = host.querySelector('.fw-pic').checked;
    if (b.dataset.a === 'flip') { var s = CP.shuffle(L); cur = [s[0], s[1]]; host.querySelector('.fw-vs').innerHTML = card(cur[0], pic) + '<b class="fw-x">VS</b>' + card(cur[1], pic); host.querySelector('[data-a="who"]').disabled = false; host.querySelector('.tl-msg').textContent = '어느 분수가 더 클까요? 생각해 보고 정답을 눌러요.' }
    if (b.dataset.a === 'who' && cur) { var x = cur[0][0] / cur[0][1], y = cur[1][0] / cur[1][1]; host.querySelector('.tl-msg').innerHTML = x === y ? '두 분수의 크기가 같아요! (' + cur[0].join('/') + ' = ' + cur[1].join('/') + ') — 이럴 땐 “전쟁”: 한 장씩 더 뒤집어요.' : '<b>' + (x > y ? cur[0] : cur[1]).join('/') + '</b>이(가) 더 커요. 막대의 색칠한 길이를 견줘 보세요.'; host.querySelector('.fw-vs').innerHTML = card(cur[0], true) + '<b class="fw-x">' + (x > y ? '&gt;' : x < y ? '&lt;' : '=') + '</b>' + card(cur[1], true) }
    if (b.dataset.a === 'print') { var g = Math.max(1, Math.min(10, +host.querySelector('.fw-g').value || 1)), h = ''; for (var i = 0; i < g; i++) h += CP.page(sheet(pic), '분수 카드 대결' + (g > 1 ? ' (' + (i + 1) + '모둠)' : ''), false); CP.print(h) }
  });
  function sheet(pic) { return '<div class="fw-grid">' + L.map(function (p) { return card(p, pic) }).join('') + '</div><p class="pr-rule"><b>규칙</b> (2명) 카드를 잘라 섞어 반씩 나눠 뒤집어 쌓아요. 동시에 한 장씩 뒤집어 <b>더 큰 분수</b>를 낸 사람이 두 장을 가져가요. 크기가 같으면(예: 1/2과 4/8) “전쟁!” 한 장씩 더 뒤집어 이긴 사람이 모두 가져가요. 카드를 모두 가져간 사람(또는 시간이 끝났을 때 많이 가진 사람)이 이겨요.</p>' }
  host.querySelector('.cp-prev').innerHTML = CP.page(sheet(true), '분수 카드 대결', false);
  host.querySelector('.fw-pic').onchange = function () { host.querySelector('.cp-prev').innerHTML = CP.page(sheet(this.checked), '분수 카드 대결', false) };
  api.bar('분수 카드 대결');
};
