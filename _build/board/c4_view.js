/* 사목 판 그리기·누르기 (window.VIEW) */
window.VIEW = (function () {
  var S = 76, M = 14, T = 44, W = 7, H = 6, seen = null;
  function cx(c) { return M + S * c + S / 2 } function cy(r) { return T + M + S * r + S / 2 }
  return {
    side: ['빨강', '노랑'], twoT: [0, 10, 20, 30], how: '돌을 넣을 세로줄을 누르세요.',
    size: function () { return [M * 2 + S * W, T + M * 2 + S * H] },
    draw: function (st, ui) {
      var anim = st !== seen; seen = st;
      var h = '<rect x="0" y="' + T + '" width="' + (M * 2 + S * W) + '" height="' + (M * 2 + S * H) + '" rx="18" class="c4-board"/>';
      if (ui.hov != null) h += '<rect x="' + (M + S * ui.hov) + '" y="' + T + '" width="' + S + '" height="' + (M * 2 + S * H) + '" class="c4-col"/><circle cx="' + cx(ui.hov) + '" cy="' + (T / 2) + '" r="' + (S * .36) + '" class="c4-d c4-p' + st.turn + ' c4-ghost"/>';
      var line = ui.over && ui.over.line || [];
      for (var r = 0; r < H; r++) for (var c = 0; c < W; c++) {
        var p = r * W + c, v = st.b[p];
        h += '<circle cx="' + cx(c) + '" cy="' + cy(r) + '" r="' + (S * .38) + '" class="' + (v ? 'c4-d c4-p' + v + (anim && p === st.last ? ' c4-new" style="--fy:' + (-(cy(r) - T / 2)) + 'px' : '') : 'c4-hole') + '"/>';
        if (line.indexOf(p) >= 0) h += '<circle cx="' + cx(c) + '" cy="' + cy(r) + '" r="' + (S * .2) + '" class="c4-win"/>';
      }
      if (st.last >= 0 && !line.length) h += '<circle cx="' + cx(st.last % W) + '" cy="' + cy((st.last / W) | 0) + '" r="6" class="c4-last"/>';
      return h;
    },
    hover: function (st, q) { var c = Math.floor((q[0] - M) / S); return c >= 0 && c < W ? c : null },
    hit: function (st, ui, q) { var c = Math.floor((q[0] - M) / S); if (c < 0 || c >= W) return null; if (ui.legal.indexOf(c) < 0) return { msg: '그 줄은 꽉 찼어요. 다른 줄을 골라요.' }; return { mv: c } }
  };
})();
