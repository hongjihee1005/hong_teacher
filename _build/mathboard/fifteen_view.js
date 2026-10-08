/* 15 만들기 그리기·누르기 (window.VIEW). 1~9 카드 → 각자 가진 카드 → 끝나면 비밀 마방진 */
window.VIEW = (function () {
  var CW = 52, GAP = 6, X0 = 12, Y0 = 16, CH = 74, W = 540, seen = null;
  function cx(v) { return X0 + (CW + GAP) * (v - 1) }
  return {
    side: ['파랑', '주황'], twoT: [0, 15, 30, 60], how: '가져갈 수 카드를 누르세요. 내 카드 세 장의 합이 15가 되면 이겨요.',
    size: function () { return [W, 400] },
    draw: function (st, ui, E) {
      var anim = st !== seen, line = ui.over && ui.over.line || []; seen = st;
      var h = '';
      for (var v = 1; v <= 9; v++) {
        var o = st.o[v];
        h += '<g class="ft-card' + (o ? ' ft-p' + o : ui.human ? ' ft-can' : '') + (line.indexOf(v) >= 0 && o ? ' ft-win' : '') + (anim && v === st.last ? ' ft-new' : '') + '"><rect x="' + cx(v) + '" y="' + Y0 + '" width="' + CW + '" height="' + CH + '" rx="10"/><text x="' + (cx(v) + CW / 2) + '" y="' + (Y0 + CH / 2 + 12) + '">' + v + '</text></g>';
      }
      [1, 2].forEach(function (p, i) {
        var mine = []; for (var v = 1; v <= 9; v++) if (st.o[v] === p) mine.push(v);
        var y = Y0 + CH + 40 + i * 42;
        h += '<circle cx="' + (X0 + 10) + '" cy="' + (y - 8) + '" r="9" class="ft-dot ft-d' + p + '"/><text x="' + (X0 + 28) + '" y="' + y + '" class="ft-lst">' + ['파랑', '주황'][i] + ' 카드: ' + (mine.length ? mine.join(', ') : '아직 없음') + '</text>';
      });
      /* 비밀 마방진: 끝나면 열림 */
      var MX = W / 2 - 75, MY = 236, Q = 50;
      if (ui.over) {
        h += '<text x="' + W / 2 + '" y="' + (MY - 12) + '" class="ft-cap">🔮 비밀: 카드를 이 마방진에 놓으면 — 틱택토(한 줄 세 개)와 같아요!</text>';
        E.SQ.forEach(function (v, i) { var o = st.o[v]; h += '<rect x="' + (MX + Q * (i % 3)) + '" y="' + (MY + Q * ((i / 3) | 0)) + '" width="' + Q + '" height="' + Q + '" class="ft-sq' + (o ? ' ft-s' + o : '') + (line.indexOf(v) >= 0 && o ? ' ft-win' : '') + '"/><text x="' + (MX + Q * (i % 3) + Q / 2) + '" y="' + (MY + Q * ((i / 3) | 0) + Q / 2 + 9) + '" class="ft-sqn' + (o ? ' ft-on' : '') + '">' + v + '</text>' });
      } else h += '<rect x="' + MX + '" y="' + MY + '" width="' + Q * 3 + '" height="' + Q * 3 + '" rx="12" class="ft-lock"/><text x="' + W / 2 + '" y="' + (MY + 70) + '" class="ft-cap">🔮</text><text x="' + W / 2 + '" y="' + (MY + 102) + '" class="ft-cap ft-sm">다 끝나면 비밀이 열려요</text>';
      return h;
    },
    hit: function (st, ui, q) {
      if (q[1] < Y0 || q[1] > Y0 + CH) return null;
      var v = Math.floor((q[0] - X0) / (CW + GAP)) + 1; if (v < 1 || v > 9 || q[0] > cx(v) + CW) return null;
      if (st.o[v]) return { msg: v + ' 카드는 이미 누군가 가져갔어요.' };
      return { mv: v };
    }
  };
})();
