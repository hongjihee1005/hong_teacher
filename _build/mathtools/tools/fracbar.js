/* 분수 막대: 같은 길이의 막대를 n칸으로 나누고 칸을 눌러 색칠 — 크기가 같은 분수 비교 */
window.TOOL = function (host, api) {
  var COL = ['#E5534B', '#E0861A', '#D9B21A', '#3E9A3E', '#2B8C9E', '#3B6FD6', '#7B4FB0', '#C2479A'];
  var rows = [1, 2, 3, 4, 6, 8, 12].map(function (n) { return { n: n, on: {} } }), lab = true;
  host.innerHTML = '<div class="fr-rows"></div><div class="tl-row"><label>칸 수 <select class="fr-n" aria-label="새 막대 칸 수">' + Array.from({ length: 12 }, function (_, i) { return '<option' + (i === 4 ? ' selected' : '') + '>' + (i + 1) + '</option>' }).join('') + '</select></label><button type="button" class="tl-btn" data-a="add">막대 더하기</button><button type="button" class="tl-btn" data-a="lab" aria-pressed="true">분수 글자 보이기</button><button type="button" class="tl-btn" data-a="clr">색칠 지우기</button><button type="button" class="tl-btn" data-a="reset">처음 막대로</button></div><p class="tl-msg">칸을 누르면 색칠돼요. 막대마다 오른쪽에 색칠한 만큼의 분수가 나와요. 크기가 같은 분수를 찾아보세요!</p>';
  function gcd(a, b) { return b ? gcd(b, a % b) : a }
  function draw() {
    host.querySelector('.fr-rows').innerHTML = rows.map(function (r, i) {
      var k = Object.keys(r.on).length, c = COL[i % COL.length], h = '';
      for (var j = 0; j < r.n; j++) h += '<button type="button" class="fr-cell' + (r.on[j] ? ' fr-on' : '') + '" data-r="' + i + '" data-j="' + j + '" style="--c:' + c + '" aria-label="' + r.n + '칸 중 ' + (j + 1) + '번째">' + (lab ? (r.n === 1 ? '1' : '<span class="fr-f"><i>1</i><i>' + r.n + '</i></span>') : '') + '</button>';
      var g = k ? gcd(k, r.n) : 1, val = k === 0 ? '0' : k === r.n ? '1' : '<span class="fr-f"><i>' + k + '</i><i>' + r.n + '</i></span>' + (g > 1 ? ' = <span class="fr-f"><i>' + k / g + '</i><i>' + r.n / g + '</i></span>' : '');
      return '<div class="fr-row"><div class="fr-bar">' + h + '</div><div class="fr-val">' + val + '</div><button type="button" class="fr-x" data-del="' + i + '" aria-label="이 막대 빼기">✕</button></div>';
    }).join('');
    api.bar('분수 막대');
  }
  host.onclick = function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.j != null) { var r = rows[+b.dataset.r], j = +b.dataset.j; if (r.on[j]) delete r.on[j]; else r.on[j] = 1 }
    else if (b.dataset.del != null) rows.splice(+b.dataset.del, 1);
    else if (b.dataset.a === 'add') { if (rows.length < 12) rows.push({ n: +host.querySelector('.fr-n').value, on: {} }) }
    else if (b.dataset.a === 'lab') { lab = !lab; b.setAttribute('aria-pressed', lab ? 'true' : 'false') }
    else if (b.dataset.a === 'clr') rows.forEach(function (r) { r.on = {} });
    else if (b.dataset.a === 'reset') rows = [1, 2, 3, 4, 6, 8, 12].map(function (n) { return { n: n, on: {} } });
    draw();
  };
  draw();
};
