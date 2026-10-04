/* 점검: node _build/hidden/check.js → 540개 모두 숨은 그림 개수·겹침·화면 안·중복 확인 */
var HP = require('./hidden.js'), bad = 0, seen = {}, dup = 0, out = [];
for (var g = 1; g <= 6; g++) {
  var S = HP.specs(g); if (S.length !== 90) { bad++; console.log(g, '개수', S.length) }
  var ns = [];
  S.forEach(function (s, i) {
    var m = HP.make(s), T = m.T, key = T.map(function (t) { return t.k + Math.round(t.x) + ',' + Math.round(t.y) }).join('|');
    if (seen[key]) dup++; seen[key] = 1;
    if (T.length !== s.n || new Set(T.map(function (t) { return t.k })).size !== T.length) { bad++; console.log(g + '학년 ' + (i + 1) + '번 물건 개수·중복 문제') }
    T.forEach(function (t, a) {
      if (t.x < m.R || t.y < m.R || t.x > 400 - m.R || t.y > 400 - m.R) { bad++; console.log(g + '학년 ' + (i + 1) + '번 화면 밖') }
      T.forEach(function (u, b) { if (b > a && Math.hypot(t.x - u.x, t.y - u.y) < 2 * m.R + 10) { bad++; console.log(g + '학년 ' + (i + 1) + '번 겹침') } });
      if (HP.hit(m, t.x, t.y) !== a) { bad++; console.log(g + '학년 ' + (i + 1) + '번 누르기 판정 문제') }
    });
    if (m.sc.no.some(function (k) { return T.some(function (t) { return t.k === k }) })) { bad++; console.log('장면과 같은 물건') }
    ns.push(s.n);
  });
  out.push(g + '학년: 찾을 물건 ' + ns[0] + '~' + ns[29] + ' | ' + ns[30] + '~' + ns[59] + ' | ' + ns[60] + '~' + ns[89]);
}
console.log(out.join('\n')); console.log('숨은 그림 점검: 540개, 문제 ' + bad + '개, 중복 ' + dup + '개');
process.exit(bad || dup ? 1 : 0);
