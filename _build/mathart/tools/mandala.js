/* 각도 만다라: 360°를 n등분해 돌려 그리기(회전 대칭), 거울 더하기 */
window.TOOL = function (host, api) {
  var S = 640, st = { c: '#C2479A', w: 4 }, strokes = [], n = 8, mirror = false, guide = true;
  host.innerHTML = '<div class="tl-row"><label>조각 수 <input type="range" min="2" max="16" value="8" class="ma-n"></label><b class="ma-t"></b><button type="button" class="tl-btn" data-a2="mir" aria-pressed="false">거울도 함께</button><button type="button" class="tl-btn" data-a2="g" aria-pressed="true">나눔 선 보이기</button></div><div class="ar-wrap ar-round"><canvas class="ar-cv" width="' + S + '" height="' + S + '"></canvas><canvas class="ar-cv ar-guide" width="' + S + '" height="' + S + '"></canvas></div><p class="tl-msg"></p>';
  var cv = host.querySelector('.ar-cv'), gd = host.querySelector('.ar-guide'), ctx = cv.getContext('2d'), g = gd.getContext('2d'), c = S / 2;
  function T() { var t = []; for (var k = 0; k < n; k++) { (function (a) { t.push(function (p) { var x = p[0] - c, y = p[1] - c; return [c + x * Math.cos(a) - y * Math.sin(a), c + x * Math.sin(a) + y * Math.cos(a)] }); if (mirror) t.push(function (p) { var x = -(p[0] - c), y = p[1] - c; return [c + x * Math.cos(a) - y * Math.sin(a), c + x * Math.sin(a) + y * Math.cos(a)] }) })(2 * Math.PI * k / n) } return t }
  function redraw() {
    ART.render(ctx, S, S, strokes, T()); g.clearRect(0, 0, S, S);
    if (guide) { g.strokeStyle = 'rgba(120,100,90,.35)'; g.lineWidth = 1.5; g.setLineDash([6, 6]); for (var k = 0; k < n; k++) { var a = 2 * Math.PI * k / n - Math.PI / 2; g.beginPath(); g.moveTo(c, c); g.lineTo(c + c * Math.cos(a), c + c * Math.sin(a)); g.stroke() } g.setLineDash([]); g.beginPath(); g.arc(c, c, c - 2, 0, 7); g.stroke() }
    var d = 360 / n; host.querySelector('.ma-t').textContent = n + '조각 · 한 조각 ' + (d % 1 ? d.toFixed(1) : d) + '°';
    host.querySelector('.tl-msg').innerHTML = '한 조각에 그리면 <b>360° ÷ ' + n + ' = ' + (d % 1 ? d.toFixed(1) : d) + '°</b>씩 돌려 ' + n + '번 그려져요. 가운데를 중심으로 ' + (d % 1 ? d.toFixed(1) : d) + '° 돌리면 처음 모양과 겹치는 <b>회전 대칭</b>이에요.' + (n === 2 ? ' (2조각은 180° 돌려 겹치는 점대칭!)' : '');
    api.bar('각도 만다라 · ' + n + '조각');
  }
  ART.bar(host, st, function (a) { if (a === 'undo') strokes.pop(); if (a === 'clear') strokes.length = 0; if (a === 'save') return ART.save(cv, '만다라'); if (a === 'print') return ART.print(cv, '각도 만다라 (' + n + '조각)'); redraw() });
  ART.drawable(gd, strokes, st, redraw);
  host.querySelector('.ma-n').oninput = function () { n = +this.value; redraw() };
  host.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b || !b.dataset.a2) return; if (b.dataset.a2 === 'mir') { mirror = !mirror; b.setAttribute('aria-pressed', mirror ? 'true' : 'false') } else { guide = !guide; b.setAttribute('aria-pressed', guide ? 'true' : 'false') } redraw() });
  redraw();
};
