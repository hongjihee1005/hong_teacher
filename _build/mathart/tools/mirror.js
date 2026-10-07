/* 대칭 그림(만화경): 선대칭 1개(좌우)·2개(좌우+상하)·4개(+대각선 = 8방향) */
window.TOOL = function (host, api) {
  var S = 640, st = { c: '#3B6FD6', w: 6 }, strokes = [], mode = 2, guide = true;
  host.innerHTML = '<div class="tl-row"><button type="button" class="tl-btn" data-m="1">좌우 대칭</button><button type="button" class="tl-btn" data-m="2">좌우·상하 대칭(4조각)</button><button type="button" class="tl-btn" data-m="4">만화경(8조각)</button><button type="button" class="tl-btn" data-g aria-pressed="true">대칭축 보이기</button></div><div class="ar-wrap"><canvas class="ar-cv" width="' + S + '" height="' + S + '"></canvas><canvas class="ar-cv ar-guide" width="' + S + '" height="' + S + '"></canvas></div><p class="tl-msg">한쪽에만 그려도 대칭축에 비친 모양이 저절로 그려져요. 대칭축에 대해 접으면 완전히 겹치는 <b>선대칭도형</b>이 돼요.</p>';
  var cv = host.querySelector('.ar-cv'), gd = host.querySelector('.ar-guide'), ctx = cv.getContext('2d'), g = gd.getContext('2d'), c = S / 2;
  function T() {
    var t = [function (p) { return p }, function (p) { return [S - p[0], p[1]] }];
    if (mode >= 2) t.push(function (p) { return [p[0], S - p[1]] }, function (p) { return [S - p[0], S - p[1]] });
    if (mode >= 4) t = t.concat(t.map(function (f) { return function (p) { var q = f(p); return [q[1], q[0]] } }));
    return t;
  }
  function redraw() {
    ART.render(ctx, S, S, strokes, T()); g.clearRect(0, 0, S, S);
    if (guide) { g.strokeStyle = 'rgba(208,69,59,.55)'; g.setLineDash([8, 6]); g.lineWidth = 2; g.beginPath(); g.moveTo(c, 0); g.lineTo(c, S); if (mode >= 2) { g.moveTo(0, c); g.lineTo(S, c) } if (mode >= 4) { g.moveTo(0, 0); g.lineTo(S, S); g.moveTo(S, 0); g.lineTo(0, S) } g.stroke(); g.setLineDash([]) }
    host.querySelectorAll('[data-m]').forEach(function (b) { b.setAttribute('aria-pressed', +b.dataset.m === mode ? 'true' : 'false') });
    api.bar('대칭 그림 · 대칭축 ' + (mode === 1 ? 1 : mode === 2 ? 2 : 4) + '개');
  }
  ART.bar(host, st, function (a) { if (a === 'undo') strokes.pop(); if (a === 'clear') strokes.length = 0; if (a === 'save') return ART.save(cv, '대칭그림'); if (a === 'print') return ART.print(cv, '대칭 그림'); redraw() });
  ART.drawable(gd, strokes, st, redraw);
  host.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; if (b.dataset.m) { mode = +b.dataset.m; redraw() } if (b.hasAttribute('data-g')) { guide = !guide; b.setAttribute('aria-pressed', guide ? 'true' : 'false'); redraw() } });
  redraw();
};
