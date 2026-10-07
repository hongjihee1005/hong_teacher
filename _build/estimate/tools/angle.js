window.TOOL = function (host, api) {
  EST.game(host, api, { name: '각도 어림', round: function (st, done) {
    var a = EST.rnd(10, 170), rot = EST.rnd(0, 1) ? 0 : EST.rnd(-40, 40), O = [320, 230], R = 200, P = function (d, r) { var t = (d + rot) * Math.PI / 180; return [O[0] + r * Math.cos(t), O[1] - r * Math.sin(t)] };
    var s = '<line x1="' + O + '" x2="' + P(0, R)[0] + '" y1="' + O[1] + '" y2="' + P(0, R)[1] + '" stroke="#2A221C" stroke-width="6" stroke-linecap="round"/><line x1="' + O[0] + '" y1="' + O[1] + '" x2="' + P(a, R)[0] + '" y2="' + P(a, R)[1] + '" stroke="#2A221C" stroke-width="6" stroke-linecap="round"/>';
    var s0 = P(0, 50), s1 = P(a, 50); s += '<path d="M' + s0 + ' A50 50 0 0 0 ' + s1 + '" fill="none" stroke="#E5534B" stroke-width="4"/>';
    st.innerHTML = '<p class="es-q">이 각은 몇 도일까요? <small>(💡 직각 90°보다 큰지 작은지 먼저!)</small></p><svg class="tl-svg es-svg" viewBox="0 0 640 260">' + s.replace('x1="' + O + '"', 'x1="' + O[0] + '"') + '<g class="es-ov"></g></svg>';
    EST.ask(st, '각도(°)', function (v) {
      var g = '<path d="M' + P(0, R + 10) + ' A' + (R + 10) + ' ' + (R + 10) + ' 0 0 0 ' + P(180, R + 10) + '" fill="rgba(156,200,238,.3)" stroke="#4A7FB0"/>'; for (var d = 0; d <= 180; d += 10) { var p1 = P(d, R + 10), p2 = P(d, R - 2); g += '<line x1="' + p1[0] + '" y1="' + p1[1] + '" x2="' + p2[0] + '" y2="' + p2[1] + '" stroke="#4A7FB0" stroke-width="1.5"/>' }
      st.querySelector('.es-ov').innerHTML = g;
      done(v, a, a < 90 ? '90°보다 작은 예각이에요.' : a > 90 ? '90°보다 큰 둔각이에요.' : '직각!', '°');
    });
  }, score: function (m, r) { var e = Math.abs(m - r); return e <= 5 ? 3 : e <= 12 ? 2 : e <= 25 ? 1 : 0 } });
};
