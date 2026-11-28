/* 수학 방탈출 · 우주선 그림 (2026-11-28) — 이름 앞글자 sp. */
(function () {
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  /* 관측 창: 별 몇 개와 작은 파란 점(지구) */
  ART.A.spWindow = function (w, h) {
    var r = Math.min(w, h) / 2 - 3, cx = w / 2, cy = h / 2, o = C(cx, cy, r, '#8A929C', ' stroke="#2A2233" stroke-width="3"') + C(cx, cy, r * .78, '#11183A');
    for (var i = 0; i < 7; i++) o += C(cx + Math.cos(i * 2.1) * r * .5, cy + Math.sin(i * 1.7) * r * .5, Math.max(1.5, r * .025), '#fff');
    var ex = cx + r * .32, ey = cy + r * .3, er = Math.max(4, r * .11);
    o += C(ex, ey, er * 1.8, '#3B8CFF', ' opacity=".25"') + C(ex, ey, er, '#3B8CFF', ' stroke="#BFE0FF" stroke-width="1.5"') + '<path d="M' + (ex - er * .5) + ' ' + (ey - er * .3) + 'q' + er * .4 + ' ' + (-er * .4) + ' ' + er * .8 + ' 0q' + (-er * .2) + ' ' + er * .5 + ' ' + (-er * .6) + ' ' + er * .4 + 'z" fill="#4FB06A"/>';
    return o;
  };
})();
