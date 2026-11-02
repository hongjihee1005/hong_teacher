window.TOOL = function (host, api) {
  var IN = ['용돈', '심부름 값', '할머니께 받은 돈'], OUT = ['공책', '간식', '친구 선물', '저금', '연필', '스티커'];
  LF.run(host, api, '용돈 기입장', function () {
    var bal = LF.rnd(5, 30) * 100, rows = [], n = 4, blank = LF.rnd(1, n);
    var start = bal;
    for (var i = 0; i < n; i++) { var isIn = i === 0 || bal < 300 || LF.rnd(0, 2) === 0, amt = isIn ? LF.rnd(5, 30) * 100 : LF.rnd(3, Math.max(3, Math.min(25, Math.floor(bal / 100)))) * 100; if (!isIn && amt > bal) amt = bal; bal += isIn ? amt : -amt; rows.push([(i + 1) + '일', isIn ? LF.pick(IN) : LF.pick(OUT), isIn ? amt : 0, isIn ? 0 : amt, bal]) }
    var ans = rows[blank - 1][4];
    return { html: '<p class="lf-q">처음에 <b>' + LF.won(start) + '</b>이 있었어요. 용돈 기입장의 <b>빈칸(남은 돈)</b>을 채워요.</p><table class="lf-tbl"><tr><th>날짜</th><th>내용</th><th>들어온 돈</th><th>쓴 돈</th><th>남은 돈</th></tr>' + rows.map(function (r, i) { return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + (r[2] ? LF.won(r[2]) : '') + '</td><td>' + (r[3] ? LF.won(r[3]) : '') + '</td><td>' + (i === blank - 1 ? '<b class="lf-q-mark">?</b>' : i < blank - 1 ? LF.won(r[4]) : '') + '</td></tr>' }).join('') + '</table>',
      inputs: [{ label: blank + '일의 남은 돈', unit: '원' }],
      ok: function (v) { var steps = [LF.won(start)]; rows.slice(0, blank).forEach(function (r) { steps.push(r[2] ? '+ ' + LF.won(r[2]) : '− ' + LF.won(r[3])) }); return [v[0] === ans, steps.join(' ') + ' = <b>' + LF.won(ans) + '</b>', '들어온 돈은 더하고, 쓴 돈은 빼요.'] } };
  });
};
