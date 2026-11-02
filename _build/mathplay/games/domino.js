/* 도미노: 한쪽 끝은 그림(또는 식), 다른 쪽은 이름(또는 답) — 이어 붙여 한 바퀴 */
window.GAME = function (host, api) {
  var SH = [['삼각형', 'tri'], ['사각형', 'quad'], ['원', 'circle'], ['직각삼각형', 'rtri'], ['직사각형', 'rect'], ['정사각형', 'square'], ['마름모', 'rhom'], ['사다리꼴', 'trap'], ['평행사변형', 'pgram'], ['정삼각형', 'equi'], ['정오각형', 'reg'], ['둔각삼각형', 'otri']];
  var K = { shape: '도형 (그림 ↔ 이름)', mul: '곱셈구구 (식 ↔ 답)', solid: '입체도형·각 (그림 ↔ 이름)' };
  var SO = [['직육면체', 'cuboid'], ['정육면체', 'cube'], ['삼각기둥', 'prism'], ['사각뿔', 'pyramid'], ['원기둥', 'cyl'], ['원뿔', 'cone'], ['구', 'sphere'], ['직각', 'right'], ['예각', 'acute'], ['둔각', 'obtuse'], ['평행', 'para'], ['수직', 'perp']];
  host.innerHTML = '<div class="cp-set"><label>종류 <select class="dm-k">' + Object.keys(K).map(function (k) { return '<option value="' + k + '">' + K[k] + '</option>' }).join('') + '</select></label><label>모둠 수 <input class="dm-g" type="number" min="1" max="10" value="1"></label><button type="button" class="tl-btn tl-go" data-a="print">🖨️ 도미노 인쇄(모둠마다 12장)</button></div><div class="cp-prev"></div>';
  function pairs(k) {
    if (k === 'mul') { var s = {}, o = []; while (o.length < 12) { var a = 2 + CP.rnd(8), b = 2 + CP.rnd(8); if (s[a * b]) continue; s[a * b] = 1; o.push(['<b class="dm-txt">' + a + ' × ' + b + '</b>', '<b class="dm-txt">' + a * b + '</b>']) } return o }
    return CP.shuffle(k === 'shape' ? SH : SO).map(function (p) { return [FIG[p[1]](), '<b class="dm-txt">' + p[0] + '</b>'] });
  }
  function sheet(k) { var P = pairs(k), n = P.length; return '<div class="dm-grid">' + P.map(function (p, i) { return '<div class="dm-d"><div class="dm-h">' + P[(i + 1) % n][1] + '</div><div class="dm-h">' + p[0] + '</div></div>' }).join('') + '</div><p class="pr-rule"><b>규칙</b> (모둠 2~4명) 도미노 12장을 잘라 나눠 가져요. 아무 도미노나 하나 놓고, 한쪽 끝의 그림(식)과 짝이 맞는 이름(답)이 있는 도미노를 이어 붙여요. 다 이으면 한 바퀴 동그랗게 이어져요! 차례대로 이어 붙이고 먼저 다 내려놓은 사람이 이겨요.</p>' }
  function prev() { var k = host.querySelector('.dm-k').value; host.querySelector('.cp-prev').innerHTML = CP.page(sheet(k), '도미노 · ' + K[k], false) }
  host.querySelector('.dm-k').onchange = prev;
  host.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || b.dataset.a !== 'print') return; var k = host.querySelector('.dm-k').value, g = Math.max(1, Math.min(10, +host.querySelector('.dm-g').value || 1)), h = ''; for (var i = 0; i < g; i++) h += CP.page(sheet(k), '도미노 · ' + K[k] + (g > 1 ? ' (' + (i + 1) + '모둠)' : ''), false); CP.print(h) });
  prev(); api.bar('도미노');
};
