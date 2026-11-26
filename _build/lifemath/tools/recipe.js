window.TOOL = function (host, api) {
  var R = [['🥞 핫케이크', [['밀가루', 200, 'g'], ['우유', 150, 'mL'], ['달걀', 2, '개'], ['설탕', 30, 'g']]], ['🍪 쿠키', [['버터', 100, 'g'], ['설탕', 80, 'g'], ['밀가루', 180, 'g'], ['초콜릿 칩', 60, 'g']]], ['🍋 레모네이드', [['레몬즙', 60, 'mL'], ['물', 600, 'mL'], ['꿀', 40, 'g']]], ['🥗 과일 샐러드', [['사과', 2, '개'], ['바나나', 2, '개'], ['요구르트', 200, 'mL']]]];
  LF.run(host, api, '요리 비율', function (lv) {
    var r, base, to, it, ans, tries = 0;
    do {   // 쉬움: 2배·3배 / 보통: 몇 배·나누기 / 도전: 1.5배처럼 나누어떨어지지 않는 배수(답은 자연수)
      r = LF.pick(R); it = LF.pick(r[1]);
      if (lv === 0) { base = LF.pick([1, 2]); to = base * LF.pick([2, 3]) }
      else if (lv === 1) { base = LF.pick([2, 4]); to = LF.pick(base === 2 ? [4, 6, 8, 1] : [2, 6, 8, 12]) }
      else { base = LF.pick([4, 6, 8]); to = LF.pick([3, 5, 6, 9, 10, 12, 15].filter(function (x) { return x % base && base % x })) }
      ans = it[1] * to / base;
    } while (ans % 1 && ++tries < 50);
    if (ans % 1) { to = base * 2; ans = it[1] * 2 }
    return { html: '<p class="lf-q">' + r[0] + ' <b>' + base + '인분</b> 재료예요. <b>' + to + '인분</b>을 만들려면 <b>' + it[0] + '</b>' + ((it[0].charCodeAt(it[0].length - 1) - 0xAC00) % 28 ? '은' : '는') + ' 얼마나 필요할까요?</p><table class="lf-tbl"><tr><th>재료</th><th>' + base + '인분</th></tr>' + r[1].map(function (x) { return '<tr><td>' + x[0] + '</td><td>' + x[1] + ' ' + x[2] + '</td></tr>' }).join('') + '</table>',
      inputs: [{ label: it[0], unit: it[2] }],
      ok: function (v) { return [v[0] === ans, (to % base === 0 || base % to === 0 ? base + '인분 → ' + to + '인분은 ' + (to > base ? to / base + '배' : '1/' + base / to) + '예요. ' + it[1] + ' ' + it[2] + (to > base ? ' × ' + to / base : ' ÷ ' + base / to) : '1인분은 ' + it[1] + ' ÷ ' + base + ', ' + to + '인분은 그 ' + to + '배 → ' + it[1] + ' ÷ ' + base + ' × ' + to) + ' = <b>' + ans + ' ' + it[2] + '</b> (비례식: ' + base + ' : ' + it[1] + ' = ' + to + ' : □)', '사람 수가 몇 배가 되었는지 먼저 구해요.'] } };
  }, 10, ['1·2인분을 2배·3배로', '2·4인분을 몇 배로 늘리거나 줄이기', '4·6·8인분을 3·5·9인분처럼 — 1인분을 먼저 구해요']);
};
