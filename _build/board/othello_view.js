/* 오셀로 판 그리기·누르기 (window.VIEW) */
window.VIEW = (function () {
  var S = 64, M = 16, seen = null;
  function cc(i) { return M + S * i + S / 2 }
  return {
    side: ['흑', '백'], twoT: [0, 20, 30, 60], how: '점이 있는 곳에 놓으세요. 상대 돌을 내 돌 사이에 끼우면 뒤집혀요.',
    size: function () { return [M * 2 + S * 8, M * 2 + S * 8] },
    draw: function (st, ui) {
      var anim = st !== seen, Z = M * 2 + S * 8; seen = st;
      var h = '<rect x="0" y="0" width="' + Z + '" height="' + Z + '" rx="14" class="ot-frame"/><rect x="' + M + '" y="' + M + '" width="' + S * 8 + '" height="' + S * 8 + '" class="ot-board"/>';
      for (var i = 0; i <= 8; i++) h += '<line x1="' + M + '" y1="' + (M + S * i) + '" x2="' + (M + S * 8) + '" y2="' + (M + S * i) + '" class="ot-ln"/><line x1="' + (M + S * i) + '" y1="' + M + '" x2="' + (M + S * i) + '" y2="' + (M + S * 8) + '" class="ot-ln"/>';
      [[2, 2], [2, 6], [6, 2], [6, 6]].forEach(function (a) { h += '<circle cx="' + (M + S * a[0]) + '" cy="' + (M + S * a[1]) + '" r="4" class="ot-star"/>' });
      var fl = anim && st.fl ? st.fl : [];
      for (var p = 0; p < 64; p++) {
        var v = st.b[p], x = cc(p & 7), y = cc(p >> 3);
        if (v) h += '<circle cx="' + x + '" cy="' + y + '" r="' + (S * .41) + '" class="ot-d ot-p' + v + (fl.indexOf(p) >= 0 ? ' ot-flip' : anim && p === st.last ? ' ot-new' : '') + '"/>';
        else if (ui.legal.indexOf(p) >= 0) h += '<circle cx="' + x + '" cy="' + y + '" r="' + (S * .12) + '" class="ot-can ot-c' + st.turn + '"/>';
      }
      if (st.last >= 0) h += '<circle cx="' + cc(st.last & 7) + '" cy="' + cc(st.last >> 3) + '" r="6" class="ot-last"/>';
      return h;
    },
    hit: function (st, ui, q) {
      var x = Math.floor((q[0] - M) / S), y = Math.floor((q[1] - M) / S); if (x < 0 || y < 0 || x > 7 || y > 7) return null;
      var p = y * 8 + x; if (st.b[p]) return null;
      if (ui.legal.indexOf(p) < 0) return { msg: '그 자리는 뒤집을 돌이 없어서 둘 수 없어요. 점이 있는 곳에 놓아요.' };
      return { mv: p };
    },
    status: function (st, E) { var c = E.count(st.b); return [c[1] + '개', c[2] + '개', ''] }
  };
})();
