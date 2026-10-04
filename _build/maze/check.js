/* 점검: node _build/maze/check.js → 학년마다 90개를 모두 만들어 풀 수 있는지 확인 */
var MZ = require('./maze.js'), bad = 0, seen = {}, dup = 0, t0 = Date.now(), stat = [];
for (var g = 1; g <= 6; g++) {
  var S = MZ.specs(g), cells = [];
  if (S.length !== 300) { console.log(g + '학년 개수', S.length); bad++ }
  S.forEach(function (s, i) {
    var m;
    try { m = MZ.make(s) } catch (e) { console.log(g + '학년 ' + (i + 1) + '번 오류', e.message); bad++; return }
    var ok = MZ.check(m), key = m.G.cells.length + ':' + (m.open ? Object.keys(m.open).join(',') : m.lab.join(','));
    if (seen[key]) dup++; seen[key] = 1;
    if (!ok) { console.log(g + '학년 ' + (i + 1) + '번 풀 수 없음', MZ.title(s)); bad++ }
    for (var j = 1; j < m.sol.length; j++) {   // 화면 규칙(link·조건)으로 정답 길을 그대로 갈 수 있는지
      var x = m.sol[j - 1], y = m.sol[j];
      if (!MZ.link(m, x, y) || (m.kind === 'set' && !m.ok[y]) || (m.kind === 'seq' && m.lab[y] !== m.seq[j])) { console.log(g + '학년 ' + (i + 1) + '번 정답 길이 화면 규칙과 다름'); bad++; break }
    }
    if (m.sol[m.sol.length - 1] !== m.g || m.sol[0] !== m.s) { console.log(g + '학년 ' + (i + 1) + '번 출발·도착 불일치'); bad++ }
    if (m.sol.length < 3) { console.log(g + '학년 ' + (i + 1) + '번 길이 짧음', m.sol.length); bad++ }
    cells.push(m.G.cells.length + '/' + m.sol.length);
  });
  stat.push(g + '학년: 칸/정답길이 ' + cells[0] + ' … ' + cells[29] + ' | ' + cells[30] + ' … ' + cells[59] + ' | ' + cells[60] + ' … ' + cells[89]);
}
console.log(stat.join('\n'));
console.log('미로 점검: 1800개, 문제 ' + bad + '개, 중복 ' + dup + '개, ' + (Date.now() - t0) + 'ms');
process.exit(bad || dup ? 1 : 0);
