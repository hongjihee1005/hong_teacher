/* 창의수학게임 › 저울 퍼즐: 수평인 저울들을 보고 모양(●▲■★) 하나하나의 무게를 찾아 써 넣기 */
(function () {
  'use strict';
  var COL = ['#E5534B', '#3B82D6', '#2EAA6A', '#E0A21A'], NM = ['동그라미', '세모', '네모', '별'];
  var P, ctx, host, val, sel, solved;
  function shape(i, x, y, s) {   // (x, y) 가운데, 크기 s
    var c = COL[i], h = s / 2;
    if (i === 0) return '<circle cx="' + x + '" cy="' + y + '" r="' + h + '" fill="' + c + '"/>';
    if (i === 1) return '<polygon points="' + x + ',' + (y - h) + ' ' + (x + h) + ',' + (y + h) + ' ' + (x - h) + ',' + (y + h) + '" fill="' + c + '"/>';
    if (i === 2) return '<rect x="' + (x - h * .9) + '" y="' + (y - h * .9) + '" width="' + s * .9 + '" height="' + s * .9 + '" rx="3" fill="' + c + '"/>';
    var p = []; for (var k = 0; k < 10; k++) { var r = k % 2 ? h * .45 : h, a = -Math.PI / 2 + k * Math.PI / 5; p.push((x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1)) }
    return '<polygon points="' + p.join(' ') + '" fill="' + c + '"/>';
  }
  function weight(n, x, y, s) {
    var h = s / 2;
    return '<path d="M' + (x - h * .7) + ' ' + (y - h) + 'h' + h * 1.4 + 'l' + h * .3 + ' ' + s + 'h-' + h * 2 + 'z" fill="#6E635B"/>'
      + '<text x="' + x + '" y="' + (y + h * .45) + '" text-anchor="middle" font-size="' + (String(n).length > 1 ? s * .5 : s * .6) + '" font-weight="800" fill="#fff">' + n + '</text>';
  }
  function pan(side, cx) {   // 접시 위 토큰(한 줄에 4개까지)
    var s = 24, out = '', per = Math.min(4, side.length), rows = Math.ceil(side.length / 4);
    side.forEach(function (t, j) {
      var r = Math.floor(j / 4), n = r === rows - 1 ? side.length - r * 4 : 4, col = j % 4, x = cx + (col - (n - 1) / 2) * (s + 3), y = 96 - s / 2 - r * (s + 3);
      out += typeof t === 'number' ? shape(t, x, y, s) : weight(t.n, x, y, s);
    });
    return out;
  }
  function scaleSvg(sc) {
    return '<svg class="bl-scale" viewBox="0 0 300 132" role="img" aria-label="수평인 저울">'
      + '<path d="M150 46 L132 124 H168 Z" fill="#B9A897"/><rect x="118" y="122" width="64" height="7" rx="3" fill="#9C8B7D"/>'
      + '<rect x="22" y="40" width="256" height="7" rx="3.5" fill="#7A6A5D"/><circle cx="150" cy="43" r="7" fill="#5C4E43"/>'
      + '<path d="M70 47 L48 98 M70 47 L92 98 M230 47 L208 98 M230 47 L252 98" stroke="#9C8B7D" stroke-width="1.6"/>'
      + '<path d="M36 98 H104 Q102 110 70 110 Q38 110 36 98Z M196 98 H264 Q262 110 230 110 Q198 110 196 98Z" fill="#CDBFB1"/>'
      + pan(sc[0], 70) + pan(sc[1], 230) + '</svg>';
  }
  function draw() {
    var h = '<p class="bl-goal">저울은 모두 <b>수평</b>이에요. 모양 하나하나의 무게는 얼마일까요?</p><div class="bl-scales">' + P.sc.map(scaleSvg).join('') + '</div>'
      + '<div class="bl-ans">' + P.w.map(function (_, i) {
        return '<button type="button" class="bl-row" data-i="' + i + '" aria-label="' + NM[i] + '의 무게"><svg viewBox="0 0 30 30" width="34" height="34" aria-hidden="true">' + shape(i, 15, 15, 26) + '</svg><span class="bl-eq">=</span><b class="bl-box"></b></button>';
      }).join('') + '</div><div class="bl-pad">';
    for (var d = 1; d <= 9; d++) h += '<button type="button" class="bl-num" data-d="' + d + '">' + d + '</button>';
    h += '<button type="button" class="bl-num" data-d="0">0</button><button type="button" class="bl-num bl-del" data-d="x">지우기</button></div>'
      + '<p class="bl-tip">모양 칸을 누르고 수를 눌러 무게를 써요. 키보드 숫자·Backspace·Tab(다음 칸)도 돼요.</p>';
    host.innerHTML = h; paint();
  }
  function paint() {
    host.querySelectorAll('.bl-row').forEach(function (el, i) {
      el.querySelector('.bl-box').textContent = val[i];
      el.classList.toggle('sel', i === sel && !solved); el.classList.toggle('no', !!el.dataset.no && !solved); el.classList.toggle('ok', solved);
    });
  }
  function judge() {
    if (val.some(function (v) { return v === '' })) { ctx.msg(''); return }
    var wrong = 0;
    host.querySelectorAll('.bl-row').forEach(function (el, i) { var bad = +val[i] !== P.w[i]; el.dataset.no = bad ? '1' : ''; if (bad) wrong++ });
    if (!wrong) { solved = true; paint(); ctx.done('모든 무게를 찾았어요! ' + P.w.map(function (w, i) { return NM[i] + ' ' + w }).join(' · ')); return }
    paint(); ctx.msg('빨간 칸의 무게가 맞지 않아요. 저울 하나하나에 넣어서 양쪽이 같은지 확인해 보세요.', 'bad');
  }
  function type(d) {
    if (solved) return;
    var el = host.querySelector('.bl-row[data-i="' + sel + '"]'); el.dataset.no = '';
    if (d === 'x') val[sel] = val[sel].slice(0, -1);
    else if (val[sel].length < 2) val[sel] = (val[sel] === '0' ? '' : val[sel]) + d;
    paint(); judge();
  }
  document.addEventListener('keydown', function (e) {
    if (!host || !document.body.contains(host) || !host.querySelector('.bl-ans') || solved) return;
    if (/INPUT|TEXTAREA|SELECT/.test((e.target || {}).tagName || '')) return;
    if (/^[0-9]$/.test(e.key)) type(e.key);
    else if (e.key === 'Backspace' || e.key === 'Delete') type('x');
    else if (e.key === 'Tab' || e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); sel = (sel + (e.key === 'ArrowUp' || e.shiftKey ? P.k - 1 : 1)) % P.k; paint() }
  });
  window.CRG = {
    render: function (h, p, c) {
      host = h; P = p; ctx = c; val = p.w.map(function () { return '' }); sel = 0; solved = false; draw();
      host.onclick = function (e) {
        var r = e.target.closest('.bl-row'), n = e.target.closest('.bl-num');
        if (r && !solved) { sel = +r.dataset.i; paint() } else if (n) type(n.dataset.d);
      };
    },
    hint: function () {   // 비었거나 틀린 모양 하나의 무게를 알려 줌
      if (solved) return false;
      var i = val.findIndex(function (v, j) { return +v !== P.w[j] || v === '' }); if (i < 0) return false;
      val[i] = String(P.w[i]); sel = i; host.querySelector('.bl-row[data-i="' + i + '"]').dataset.no = ''; paint();
      judge();
      if (!solved) ctx.msg('💡 ' + NM[i] + '의 무게는 ' + P.w[i] + '이에요. 이 무게를 저울에 넣어 보면 다른 모양의 무게도 찾을 수 있어요.' + (host.querySelector('.bl-row.no') ? ' (빨간 칸은 아직 맞지 않아요)' : ''));
      return true;
    },
    reveal: function () { val = P.w.map(String); host.querySelectorAll('.bl-row').forEach(function (el) { el.dataset.no = '' }); judge() }
  };
})();
