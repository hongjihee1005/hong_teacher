/* 무늬 만들기(테셀레이션): 타일 한 칸에 그리면 밀기·뒤집기·돌리기로 판 전체에 퍼짐 */
window.TOOL = function (host, api) {
  var TS = 240, st = { c: '#2B8C9E', w: 8 }, strokes = [], mode = 'slide', bg = '#FFF4D6', cols = 4, rows = 3;
  host.innerHTML = '<div class="tl-row"><button type="button" class="tl-btn" data-m="slide">밀기</button><button type="button" class="tl-btn" data-m="flip">뒤집기(좌우로 번갈아)</button><button type="button" class="tl-btn" data-m="turn">돌리기(90°씩)</button><label>바탕 <input type="color" class="tt-bg" value="' + bg + '"></label></div><div class="tt-wrap"><div class="tt-left"><b>여기에 그려요 (타일 한 칸)</b><canvas class="ar-cv tt-one" width="' + TS + '" height="' + TS + '"></canvas></div><div class="tt-right"><b>판 전체</b><canvas class="ar-cv tt-all" width="' + TS * cols + '" height="' + TS * rows + '"></canvas></div></div><p class="tl-msg"></p>';
  var one = host.querySelector('.tt-one'), all = host.querySelector('.tt-all'), c1 = one.getContext('2d'), ca = all.getContext('2d');
  var MSG = { slide: '<b>밀기</b>: 같은 모양을 옆·아래로 밀어 빈틈없이 채워요. 타일 가장자리에 걸쳐 그리면 이어지는 무늬가 돼요.', flip: '<b>뒤집기</b>: 이웃한 칸은 좌우로 뒤집힌 모양이에요. 마주 보는 무늬가 생겨요.', turn: '<b>돌리기</b>: 2×2 칸마다 90°씩 돌려 놓아요. 가운데를 중심으로 도는 무늬가 생겨요.' };
  function draw1(ctx) { ctx.lineCap = ctx.lineJoin = 'round'; strokes.forEach(function (s) { [[0, 0], [-TS, 0], [TS, 0], [0, -TS], [0, TS]].forEach(function (o) { ctx.strokeStyle = s.c; ctx.lineWidth = s.w; ctx.beginPath(); s.pts.forEach(function (p, i) { if (i) ctx.lineTo(p[0] + o[0], p[1] + o[1]); else ctx.moveTo(p[0] + o[0], p[1] + o[1]) }); if (s.pts.length === 1) ctx.lineTo(s.pts[0][0] + o[0] + .1, s.pts[0][1] + o[1]); ctx.stroke() }) }) }
  function redraw() {
    c1.fillStyle = bg; c1.fillRect(0, 0, TS, TS); draw1(c1); c1.strokeStyle = 'rgba(0,0,0,.25)'; c1.setLineDash([6, 6]); c1.strokeRect(1, 1, TS - 2, TS - 2); c1.setLineDash([]);
    for (var r = 0; r < rows; r++) for (var k = 0; k < cols; k++) {
      ca.save(); ca.translate(k * TS, r * TS); ca.beginPath(); ca.rect(0, 0, TS, TS); ca.clip();
      if (mode === 'flip' && (k + r) % 2) { ca.translate(TS, 0); ca.scale(-1, 1) }
      if (mode === 'turn') { var q = (k % 2) + (r % 2) * 2, ang = [0, 1, 3, 2][q]; ca.translate(TS / 2, TS / 2); ca.rotate(ang * Math.PI / 2); ca.translate(-TS / 2, -TS / 2) }
      ca.fillStyle = bg; ca.fillRect(0, 0, TS, TS); draw1(ca); ca.restore();
    }
    host.querySelectorAll('[data-m]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.m === mode ? 'true' : 'false') });
    host.querySelector('.tl-msg').innerHTML = MSG[mode]; api.bar('무늬 만들기 · ' + { slide: '밀기', flip: '뒤집기', turn: '돌리기' }[mode]);
  }
  ART.bar(host, st, function (a) { if (a === 'undo') strokes.pop(); if (a === 'clear') strokes.length = 0; if (a === 'save') return ART.save(all, '테셀레이션'); if (a === 'print') return ART.print(all, '무늬 만들기(테셀레이션)'); redraw() });
  ART.drawable(one, strokes, st, redraw);
  host.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && b.dataset.m) { mode = b.dataset.m; redraw() } });
  host.querySelector('.tt-bg').oninput = function () { bg = this.value; redraw() };
  redraw();
};
