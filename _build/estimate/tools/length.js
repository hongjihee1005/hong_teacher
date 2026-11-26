window.TOOL = function (host, api) {
  EST.game(host, api, { name: '길이 어림', lv: ['빨간 막대가 크고, 2~6개처럼 딱 떨어지는 길이', '빨간 막대 3~14개, 0.5개 단위도 나와요', '빨간 막대가 작고 8~20개, 0.5개 단위 · 파란 막대가 아래쪽 어긋난 곳에서 시작'], round: function (st, done, lv) {
    var u = lv === 0 ? EST.rnd(56, 72) : lv === 1 ? EST.rnd(36, 60) : EST.rnd(24, 34), n = lv === 0 ? EST.rnd(2, 6) : lv === 1 ? EST.rnd(3, 14) + [0, .5][EST.rnd(0, 1)] : EST.rnd(8, 19) + [0, .5][EST.rnd(0, 1)], L = u * n, x0 = lv === 2 ? EST.rnd(60, 160) : 20, W = Math.max(L + x0 + 20, 640);
    st.innerHTML = '<p class="es-q">아래 <b>파란 막대</b>의 길이는 <b>빨간 막대</b> 몇 개만큼일까요?</p><svg class="tl-svg es-svg" viewBox="0 0 ' + W + ' 150"><rect x="20" y="20" width="' + u + '" height="18" rx="4" fill="#E5534B"/><text x="' + (28 + u) + '" y="35" font-size="16" fill="#555">← 빨간 막대 1개</text><rect x="' + x0 + '" y="90" width="' + L + '" height="22" rx="4" fill="#3B6FD6" class="es-bar"/><g class="es-ov"></g></svg>';
    EST.ask(st, '빨간 막대', function (v) {
      var g = '', svg = st.querySelector('.es-ov'); for (var i = 0; i < Math.ceil(n); i++) g += '<rect x="' + (x0 + i * u) + '" y="118" width="' + Math.min(u, L - i * u) + '" height="12" rx="3" fill="#E5534B" opacity=".75" stroke="#fff"/>'; svg.innerHTML = g;
      done(v, n, '빨간 막대를 이어 붙여 보면 ' + n + '개예요. 💡 막대 하나를 머릿속으로 옮겨 가며 세거나, 반쯤에서 몇 개인지 세고 두 배 해 보세요.', '개');
    });
  } });
};
