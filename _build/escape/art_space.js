/* 수학 방탈출 · 우주선 그림 (2026-11-28, B안 · 그림책 삽화) — 이름 앞글자 sp. */
(function () {
  var F = ART.fx;
  function C(x, y, r, f, o) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (o || '') + '/>' }
  /* 관측 창: 별 몇 개와 작은 파란 점(지구) — 별 7개·지구 자리는 예전 그대로 */
  ART.A.spWindow = function (w, h) {
    var r = Math.min(w, h) / 2 - 3, cx = w / 2, cy = h / 2;
    var o = C(cx + 4, cy + 6, r, '#1A1208', ' opacity=".18"') + C(cx, cy, r, F.lin([[0, '#D4DAE2'], [.45, '#9AA2AC'], [1, '#5E6670']], 0, 0, .7, 1), F.edge('#8A929C', 2)) + C(cx, cy, r * .78, F.rad([[0, '#1E2A5C'], [.7, '#11183A'], [1, '#070B1E']], .45, .45, .6), ' stroke="#3A4250" stroke-width="2"');
    for (var i = 0; i < 7; i++) o += C(cx + Math.cos(i * 2.1) * r * .5, cy + Math.sin(i * 1.7) * r * .5, Math.max(1.5, r * .025), '#fff');
    var ex = cx + r * .32, ey = cy + r * .3, er = Math.max(4, r * .11);
    o += C(ex, ey, er * 1.8, '#3B8CFF', ' opacity=".25"') + C(ex, ey, er, F.rad([[0, '#8CC4FF'], [.55, '#3B8CFF'], [1, '#1A4FA8']], .5, .5, .62, .32, .28), ' stroke="#BFE0FF" stroke-width="1.5"') + '<path d="M' + (ex - er * .5) + ' ' + (ey - er * .3) + 'q' + er * .4 + ' ' + (-er * .4) + ' ' + er * .8 + ' 0q' + (-er * .2) + ' ' + er * .5 + ' ' + (-er * .6) + ' ' + er * .4 + 'z" fill="#4FB06A"/>';
    o += '<path d="M' + (cx - r * .62) + ' ' + (cy - r * .1) + 'A' + r * .64 + ' ' + r * .64 + ' 0 0 1 ' + (cx - r * .08) + ' ' + (cy - r * .63) + '" fill="none" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="' + Math.max(2, r * .06) + '" stroke-linecap="round"/>';
    return o;
  };
})();
