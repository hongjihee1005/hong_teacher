window.TOOL = function (host, api) {
  var UNITS = [10000, 5000, 1000, 500, 100, 50, 10];
  LF.run(host, api, '거스름돈', function (lv) {
    var price = lv === 0 ? LF.rnd(1, 9) * 100 : lv === 1 ? LF.rnd(3, 98) * 100 + LF.pick([0, 0, 50, 70, 30]) : LF.rnd(11, 98) * 100 + LF.rnd(1, 9) * 10, pay = [1000, 5000, 10000].filter(function (p) { return p > price })[0], chg = pay - price, given = [];
    return { html: '<p class="lf-q">' + LF.won(price) + '짜리 물건을 사고 ' + LF.money(pay) + '을 냈어요. 아래 돈을 눌러 <b>거스름돈</b>을 만들어 주세요. <small>(' + (lv === 2 ? '<b>가장 적은 개수</b>로 주어야 맞아요!' : '되도록 적은 개수로!') + ')</small></p><div class="lf-wallet">' + UNITS.filter(function (u) { return u < pay }).map(function (u) { return '<button type="button" class="lf-mb" data-u="' + u + '">' + LF.money(u) + '</button>' }).join('') + '</div><div class="lf-tray" aria-live="polite"></div><p class="tl-row"><b class="lf-sum">0원</b><button type="button" class="tl-btn lf-undo">한 개 빼기</button><button type="button" class="tl-btn tl-go lf-give">건네주기</button></p>',
      mount: function (card, check) {
        function draw() { card.querySelector('.lf-tray').innerHTML = given.map(LF.money).join(''); card.querySelector('.lf-sum').textContent = LF.won(given.reduce(function (a, b) { return a + b }, 0)) }
        card.querySelector('.lf-wallet').onclick = function (e) { var b = e.target.closest('.lf-mb'); if (!b || b.disabled) return; given.push(+b.dataset.u); draw() };
        card.querySelector('.lf-undo').onclick = function () { given.pop(); draw() };
        card.querySelector('.lf-give').onclick = function () { check([given.reduce(function (a, b) { return a + b }, 0)]) };
      },
      lock: function (card) { card.querySelectorAll('.lf-mb,.lf-undo,.lf-give').forEach(function (x) { x.disabled = true }) },
      ok: function (v) { var best = [], r = chg; UNITS.forEach(function (u) { while (r >= u) { best.push(u); r -= u } }); return [v[0] === chg && (lv < 2 || given.length === best.length), LF.won(pay) + ' − ' + LF.won(price) + ' = <b>' + LF.won(chg) + '</b>. 가장 적은 개수: ' + best.map(function (u) { return LF.won(u) }).join(' + ') + ' (' + best.length + '개)', v[0] > chg ? '너무 많이 줬어요.' : v[0] < chg ? '조금 모자라요.' : '금액은 맞지만 더 적은 개수로 줄 수 있어요. 큰 돈부터 써 보세요.'] } };
  }, 10, ['1,000원으로 몇백 원짜리 물건 사기', '몇천 원짜리 물건, 50원·10원 단위도', '10원 단위 값 · 가장 적은 개수로 주어야 정답']);
};
