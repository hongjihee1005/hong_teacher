/* 점 잇기 상자 그리기·누르기 (window.VIEW) */
window.VIEW = (function () {
  var Z = 480, M = 40, seen = null;
  function L(N) { return (Z - M * 2) / N }
  function seg(st, E, i) { var N = st.N, g = E.geo(N), s = L(N); if (i < g.H) { var r = (i / N) | 0, c = i % N; return [M + c * s, M + r * s, M + (c + 1) * s, M + r * s] } var j = i - g.H, r2 = (j / (N + 1)) | 0, c2 = j % (N + 1); return [M + c2 * s, M + r2 * s, M + c2 * s, M + (r2 + 1) * s] }
  function near(st, E, q, legal) {
    var best = -1, bd = 1e9, s = L(st.N);
    legal.forEach(function (i) { var a = seg(st, E, i), mx = (a[0] + a[2]) / 2, my = (a[1] + a[3]) / 2, d = Math.hypot(q[0] - mx, q[1] - my); if (d < bd) { bd = d; best = i } });
    return bd < s * .55 ? best : -1;
  }
  return {
    side: ['파랑', '주황'], twoT: [0, 15, 30, 60], how: '두 점 사이를 눌러 선을 그어요. 상자의 네 번째 변을 그으면 그 상자를 갖고 한 번 더 해요.',
    opts: [{ id: 'n', label: '판 크기', choices: [[3, '상자 3×3'], [4, '4×4'], [5, '5×5']], def: 1 }],
    size: function () { return [Z, Z] },
    draw: function (st, ui, E) {
      var anim = st !== seen; seen = st;
      var N = st.N, g = E.geo(N), s = L(N), h = '<rect x="0" y="0" width="' + Z + '" height="' + Z + '" rx="16" class="dt-bg"/>';
      for (var b = 0; b < N * N; b++) if (st.bx[b]) { var x = M + (b % N) * s, y = M + ((b / N) | 0) * s; h += '<rect x="' + (x + 4) + '" y="' + (y + 4) + '" width="' + (s - 8) + '" height="' + (s - 8) + '" rx="6" class="dt-box dt-b' + st.bx[b] + (anim && g.EB[st.last] && g.EB[st.last].indexOf(b) >= 0 ? ' dt-new' : '') + '"/><text x="' + (x + s / 2) + '" y="' + (y + s / 2 + 10) + '" class="dt-bt">' + (st.bx[b] === 1 ? '파' : '주') + '</text>' }
      for (var i = 0; i < g.E; i++) {
        var a = seg(st, E, i);
        if (st.e[i]) h += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + a[2] + '" y2="' + a[3] + '" class="dt-ln dt-l' + st.e[i] + (i === st.last ? ' dt-last' : '') + '"/>';
        else h += '<line x1="' + a[0] + '" y1="' + a[1] + '" x2="' + a[2] + '" y2="' + a[3] + '" class="dt-empty' + (i === ui.hov ? ' dt-hov dt-h' + st.turn : '') + '"/>';
      }
      for (var r = 0; r <= N; r++) for (var c = 0; c <= N; c++) h += '<circle cx="' + (M + c * s) + '" cy="' + (M + r * s) + '" r="7" class="dt-dot"/>';
      return h;
    },
    hover: function (st, q, E) { var i = near(st, E, q, st.e.map(function (v, k) { return v ? -1 : k }).filter(function (k) { return k >= 0 })); return i < 0 ? null : i },
    hit: function (st, ui, q, E) { var i = near(st, E, q, ui.legal); return i < 0 ? null : { mv: i } },
    status: function (st, E) { var c = E.cnt(st); return ['상자 ' + c[1], '상자 ' + c[2], ''] },
    note: function (st) { return st.again ? '📦 상자를 완성해서 한 번 더 해요!' : '' }
  };
})();
