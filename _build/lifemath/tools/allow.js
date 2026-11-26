window.TOOL = function (host, api) {
  var IN = ['용돈', '심부름 값', '할머니께 받은 돈'], OUT = ['공책', '간식', '친구 선물', '저금', '연필', '스티커'];
  LF.run(host, api, '용돈 기입장', function (lv) {
    var U = lv === 0 ? 500 : lv === 1 ? 100 : 10, bal = lv === 0 ? LF.rnd(2, 6) * 500 : LF.rnd(5, 30) * 100 + (lv === 2 ? LF.rnd(1, 9) * 10 : 0), rows = [], n = [3, 4, 6][lv], blank = lv === 2 ? n : LF.rnd(1, n);
    var start = bal;
    for (var i = 0; i < n; i++) { var isIn = i === 0 || bal < 3 * U || LF.rnd(0, 2) === 0, amt = isIn ? (lv === 0 ? LF.rnd(1, 4) * 500 : LF.rnd(5, 30) * 100 + (lv === 2 ? LF.rnd(0, 9) * 10 : 0)) : Math.min(bal, lv === 0 ? LF.rnd(1, Math.max(1, Math.floor(bal / 500))) * 500 : LF.rnd(3, Math.max(3, Math.min(25, Math.floor(bal / 100)))) * 100 + (lv === 2 ? LF.rnd(0, 9) * 10 : 0)); if (!isIn && amt > bal) amt = bal; bal += isIn ? amt : -amt; rows.push([(i + 1) + '일', isIn ? LF.pick(IN) : LF.pick(OUT), isIn ? amt : 0, isIn ? 0 : amt, bal]) }
    var ans = rows[blank - 1][4];
    return { html: '<p class="lf-q">처음에 <b>' + LF.won(start) + '</b>이 있었어요. 용돈 기입장의 <b>빈칸(남은 돈)</b>을 채워요.</p><table class="lf-tbl"><tr><th>날짜</th><th>내용</th><th>들어온 돈</th><th>쓴 돈</th><th>남은 돈</th></tr>' + rows.map(function (r, i) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + (r[2] ? LF.won(r[2]) : '') + '</td><td>' + (r[3] ? LF.won(r[3]) : '') + '</td><td>' + (i === blank - 1 ? '<b class="lf-q-mark">?</b>' : i < blank - 1 && lv < 2 ? LF.won(r[4]) : '') + '</td></tr>' }).join('') + '</table>',
      inputs: [{ label: blank + '일의 남은 돈', unit: '원' }],
      ok: function (v) { var steps = [LF.won(start)]; rows.slice(0, blank).forEach(function (r) { steps.push(r[2] ? '+ ' + LF.won(r[2]) : '− ' + LF.won(r[3])) }); return [v[0] === ans, steps.join(' ') + ' = <b>' + LF.won(ans) + '</b>', '들어온 돈은 더하고, 쓴 돈은 빼요.'] } };
  }, 10, ['3일, 500원 단위', '4일, 100원 단위', '6일, 10원 단위 · 중간 남은 돈 없이 마지막 날만']);
};
