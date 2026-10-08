/* 곱셈 사목 판 그리기·누르기 (window.VIEW). 위 6×6 곱 판, 아래 1~9 줄과 집게 ㄱ(위)·ㄴ(아래) */
window.VIEW = (function () {
  var S = 70, BX = 30, BY = 14, SW = 48, SX = 24, SY = 486, SH = 56, W = 480, seen = null, CL = ['ㄱ', 'ㄴ'];
  function sx(v) { return SX + SW * (v - 1) }
  function reach(st, E, legal, sel) { var o = {}; legal.forEach(function (m) { if (sel != null && ((m / 10) | 0) !== sel) return; var p = E.cellOf(st.c, m); if (p >= 0) o[p] = 1 }); return o }
  return {
    side: ['파랑', '주황'], twoT: [0, 20, 30, 60], how: '옮길 집게(ㄱ·ㄴ)를 누르고 아래 수를 누르거나, 칠할 곱 칸을 바로 누르세요.',
    size: function () { return [W, SY + SH + 46] },
    draw: function (st, ui, E) {
      var anim = st !== seen; seen = st;
      var h = '<rect x="' + (BX - 8) + '" y="' + (BY - 8) + '" width="' + (S * 6 + 16) + '" height="' + (S * 6 + 16) + '" rx="14" class="pm-frame"/>';
      var line = ui.over && ui.over.line || [], rc = ui.human ? reach(st, E, ui.legal, ui.sel) : {};
      for (var i = 0; i < 36; i++) {
        var x = BX + S * (i % 6), y = BY + S * ((i / 6) | 0), v = st.b[i];
        h += '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + (S - 6) + '" height="' + (S - 6) + '" rx="10" class="pm-cell' + (v ? ' pm-p' + v : '') + (rc[i] ? ' pm-can' : '') + (anim && i === st.last ? ' pm-new' : '') + '"/>';
        h += '<text x="' + (x + S / 2) + '" y="' + (y + S / 2 + 9) + '" class="pm-num' + (v ? ' pm-on' : '') + '">' + E.P[i] + '</text>';
        if (line.indexOf(i) >= 0) h += '<circle cx="' + (x + S / 2) + '" cy="' + (y + S - 12) + '" r="5" class="pm-win"/>';
      }
      if (st.last >= 0 && !line.length) h += '<rect x="' + (BX + S * (st.last % 6) + 2) + '" y="' + (BY + S * ((st.last / 6) | 0) + 2) + '" width="' + (S - 4) + '" height="' + (S - 4) + '" rx="11" class="pm-last"/>';
      /* 아래 1~9 줄과 집게 */
      h += '<text x="' + (SX - 6) + '" y="' + (SY - 18) + '" class="pm-lab" text-anchor="start">집게 ㄱ ▼</text><text x="' + (SX - 6) + '" y="' + (SY + SH + 34) + '" class="pm-lab" text-anchor="start">집게 ㄴ ▲</text>';
      for (var v2 = 1; v2 <= 9; v2++) h += '<rect x="' + (sx(v2) + 2) + '" y="' + SY + '" width="' + (SW - 4) + '" height="' + SH + '" rx="9" class="pm-key' + (st.c[0] === v2 || st.c[1] === v2 ? ' pm-keyon' : '') + '"/><text x="' + (sx(v2) + SW / 2) + '" y="' + (SY + SH / 2 + 10) + '" class="pm-knum">' + v2 + '</text>';
      [0, 1].forEach(function (w) {
        var v = st.c[w]; if (!v) return;
        var cx = sx(v) + SW / 2, y0 = w ? SY + SH + 4 : SY - 4, d = w ? 1 : -1, cls = 'pm-clip pm-c' + w + (ui.sel === w ? ' pm-csel' : '');
        h += '<g class="' + cls + '"><path d="M' + (cx - 15) + ' ' + (y0 + d * 24) + 'L' + (cx + 15) + ' ' + (y0 + d * 24) + 'L' + cx + ' ' + y0 + 'Z"/><text x="' + cx + '" y="' + (y0 + d * 15 + 5) + '">' + CL[w] + '</text></g>';
      });
      return h;
    },
    hit: function (st, ui, q, E) {
      var x = q[0], y = q[1];
      if (y > SY - 46 && y < SY && x > SX && x < SX + SW * 9) return st.c[0] ? { sel: ui.sel === 0 ? null : 0 } : null;          // 집게 ㄱ 줄
      if (y > SY + SH && y < SY + SH + 46 && x > SX && x < SX + SW * 9) return st.c[1] ? { sel: ui.sel === 1 ? null : 1 } : null;   // 집게 ㄴ 줄
      if (y >= SY && y <= SY + SH) {
        var v = Math.floor((x - SX) / SW) + 1; if (v < 1 || v > 9) return null;
        var w = !st.c[0] ? 0 : !st.c[1] ? 1 : ui.sel;
        if (w == null) return { msg: '먼저 옮길 집게(ㄱ 또는 ㄴ)를 누르세요.' };
        var m = w * 10 + v; if (ui.legal.indexOf(m) >= 0) return { mv: m };
        if (st.c[w] === v) return { msg: '집게는 지금 자리와 다른 수로 옮겨야 해요.' };
        return { msg: '⚠️ ' + st.c[1 - w] + ' × ' + v + ' = ' + st.c[1 - w] * v + ' 칸은 이미 칠해져 있어요. 다른 수를 골라요.' };
      }
      var c = Math.floor((x - BX) / S), r = Math.floor((y - BY) / S); if (c < 0 || r < 0 || c > 5 || r > 5) return null;
      var p = r * 6 + c;
      if (!st.c[0] || !st.c[1]) return { msg: !st.c[0] ? '처음에는 아래 1~9 줄에서 집게 ㄱ을 놓을 수를 눌러요.' : '아래 1~9 줄에서 집게 ㄴ을 놓을 수를 눌러요.' };
      if (st.b[p]) return { msg: '이미 칠해진 칸이에요.' };
      var ok = ui.legal.filter(function (m) { return E.cellOf(st.c, m) === p && (ui.sel == null || ((m / 10) | 0) === ui.sel) });
      if (ok.length === 1) return { mv: ok[0] };
      if (ok.length > 1) return { msg: '집게 ㄱ, ㄴ 어느 것을 옮겨도 ' + E.P[p] + '이(가) 돼요. 옮길 집게를 먼저 누르세요.' };
      return { msg: '⚠️ 집게 하나만 옮겨서는 ' + E.P[p] + '을(를) 만들 수 없어요. 지금 집게는 ' + st.c[0] + '와(과) ' + st.c[1] + '이에요.' };
    },
    status: function (st) { return ['', '', st.c[0] && st.c[1] ? '집게 ' + st.c[0] + ' × ' + st.c[1] + ' = ' + st.c[0] * st.c[1] : ''] },
    note: function (st) { return st.n === 0 ? '처음 사람은 집게 ㄱ만 놓아요(칸은 칠하지 않아요).' : st.n === 1 ? '집게 ㄴ을 놓으면 두 수의 곱 칸을 칠해요.' : '' }
  };
})();
