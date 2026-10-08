/* 장기 판 그리기·누르기 (window.VIEW). 초(아래)·한(위) */
window.VIEW = (function () {
  var S = 58, M = 34, seen = null, NM = ['', '', '사', '상', '마', '차', '포', ''], RAD = [0, 27, 19, 23, 23, 23, 23, 19];
  function X(c) { return M + S * c } function Y(r) { return M + S * r }
  function oct(x, y, r) { var o = []; for (var i = 0; i < 8; i++) { var a = Math.PI / 8 + i * Math.PI / 4; o.push((x + r * Math.cos(a)).toFixed(1) + ',' + (y + r * Math.sin(a)).toFixed(1)) } return o.join(' ') }
  function label(v) { var s = v >> 3, k = v & 7; return k === 1 ? (s === 1 ? '초' : '한') : k === 7 ? (s === 1 ? '졸' : '병') : NM[k] }
  return {
    side: ['초', '한'], twoT: [0, 60, 90, 120], how: '움직일 말을 누르고, 갈 자리(점)를 누르세요.',
    size: function () { return [M * 2 + S * 8, M * 2 + S * 9] },
    draw: function (st, ui, E) {
      var anim = st !== seen, Wd = M * 2 + S * 8, Ht = M * 2 + S * 9; seen = st;
      var h = '<rect x="0" y="0" width="' + Wd + '" height="' + Ht + '" rx="14" class="jg-wood"/>';
      for (var r = 0; r < 10; r++) h += '<line x1="' + X(0) + '" y1="' + Y(r) + '" x2="' + X(8) + '" y2="' + Y(r) + '" class="jg-ln"/>';
      for (var c = 0; c < 9; c++) h += '<line x1="' + X(c) + '" y1="' + Y(0) + '" x2="' + X(c) + '" y2="' + Y(9) + '" class="jg-ln"/>';
      [0, 7].forEach(function (r0) { h += '<line x1="' + X(3) + '" y1="' + Y(r0) + '" x2="' + X(5) + '" y2="' + Y(r0 + 2) + '" class="jg-ln"/><line x1="' + X(5) + '" y1="' + Y(r0) + '" x2="' + X(3) + '" y2="' + Y(r0 + 2) + '" class="jg-ln"/>' });
      if (st.last >= 0) { var f = (st.last / 100) | 0; h += '<rect x="' + (X(f % 9) - 9) + '" y="' + (Y((f / 9) | 0) - 9) + '" width="18" height="18" rx="4" class="jg-from"/>' }
      var tg = {};
      if (ui.sel != null) ui.legal.forEach(function (m) { if (((m / 100) | 0) === ui.sel) tg[m % 100] = 1 });
      for (var p = 0; p < 90; p++) {
        var v = st.b[p], x = X(p % 9), y = Y((p / 9) | 0);
        if (v) {
          var k = v & 7, rr = RAD[k];
          h += '<g class="jg-pc jg-s' + (v >> 3) + (p === ui.sel ? ' jg-sel' : '') + (anim && st.last >= 0 && p === st.last % 100 ? ' jg-new' : '') + '"><polygon points="' + oct(x, y, rr) + '"/><text x="' + x + '" y="' + (y + rr * .36) + '" font-size="' + Math.round(rr * 1.05) + '">' + label(v) + '</text></g>';
          if (tg[p]) h += '<circle cx="' + x + '" cy="' + y + '" r="' + (rr + 4) + '" class="jg-cap"/>';
        } else if (tg[p]) h += '<circle cx="' + x + '" cy="' + y + '" r="9" class="jg-dot"/>';
      }
      if (st.last >= 0) { var t = st.last % 100; h += '<circle cx="' + X(t % 9) + '" cy="' + Y((t / 9) | 0) + '" r="' + (RAD[st.b[t] & 7] + 5) + '" class="jg-lastm"/>' }
      return h;
    },
    hit: function (st, ui, q, E) {
      var c = Math.round((q[0] - M) / S), r = Math.round((q[1] - M) / S); if (c < 0 || r < 0 || c > 8 || r > 9) return null;
      var p = r * 9 + c, v = st.b[p];
      if (ui.sel != null && ui.sel !== p) {
        var m = ui.sel * 100 + p;
        if (ui.legal.indexOf(m) >= 0) return { mv: m };
        if (E.gen(st.b, st.turn, false).indexOf(m) >= 0) return { msg: '⚠️ 그렇게 두면 내 궁이 잡혀요. 장군을 막는 수를 둬요.', sel: ui.sel };
      }
      if (v && (v >> 3) === st.turn) {
        if (ui.sel === p) return { sel: null };
        var any = ui.legal.some(function (m) { return ((m / 100) | 0) === p });
        return any ? { sel: p } : { msg: '그 말은 지금 움직일 수 없어요.', sel: null };
      }
      return { sel: null };
    },
    status: function (st, E) { var t = E.points(st.b); return ['점수 ' + t[1], '점수 ' + t[2] + '(덤 1.5)', st.n + '/' + E.LIMIT + '수'] },
    note: function (st, E) { return E.inCheck(st.b, st.turn) ? '⚠️ 장군! 궁을 지켜요.' : '' }
  };
})();
