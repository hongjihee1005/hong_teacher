window.TOOL = function (host, api) {
  var ITEMS = [['🍎', '사과', 800], ['🍌', '바나나', 1500], ['🥛', '우유', 1200], ['🍞', '식빵', 2500], ['🥚', '달걀 한 판', 6900], ['🍙', '삼각김밥', 1100], ['🧃', '주스', 900], ['🍪', '과자', 1300], ['✏️', '연필', 500], ['📒', '공책', 1500], ['🍦', '아이스크림', 700], ['🥕', '당근', 600]];
  LF.run(host, api, '장보기', function () {
    var n = LF.rnd(2, 4), sel = [], pool = ITEMS.slice(); for (var i = 0; i < n; i++) sel.push(pool.splice(LF.rnd(0, pool.length - 1), 1)[0]);
    var qty = sel.map(function () { return LF.rnd(1, 3) }), tot = sel.reduce(function (s, x, i) { return s + x[2] * qty[i] }, 0), pay = [5000, 10000, 20000].filter(function (p) { return p >= tot })[0] || Math.ceil(tot / 10000) * 10000, chg = pay - tot;
    return { html: '<p class="lf-q">장바구니에 담은 물건이에요. <b>모두 얼마</b>이고, <b>' + LF.won(pay) + '</b>을 내면 <b>거스름돈</b>은 얼마일까요?</p><table class="lf-tbl"><tr><th>물건</th><th>값</th><th>개수</th></tr>' + sel.map(function (x, i) { return '<tr><td>' + x[0] + ' ' + x[1] + '</td><td>' + LF.won(x[2]) + '</td><td>' + qty[i] + '개</td></tr>' }).join('') + '</table>',
      inputs: [{ label: '모두', unit: '원' }, { label: '거스름돈', unit: '원' }],
      ok: function (v) { return [v[0] === tot && v[1] === chg, sel.map(function (x, i) { return x[2] + ' × ' + qty[i] }).join(' + ') + ' = <b>' + LF.won(tot) + '</b>, ' + LF.won(pay) + ' − ' + LF.won(tot) + ' = <b>' + LF.won(chg) + '</b>', v[0] !== tot ? '먼저 물건마다 값 × 개수를 구해 더해요.' : '낸 돈에서 모두의 값을 빼요.'] } };
  });
};
