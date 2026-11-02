/* 점검: node _build/spot/check.js → 540개 모두 다른 곳 개수·실제로 달라졌는지·겹침·중복 확인 */
var SD = require('./spot.js'), bad = 0, seen = {}, dup = 0, out = [];
for (var g = 1; g <= 6; g++) {
  var S = SD.specs(g); if (S.length !== 90) { bad++; console.log('개수', g) }
  var ns = [];
  S.forEach(function (s, i) {
    var m = SD.make(s), id = g + '학년 ' + (i + 1) + '번 ';
    if (m.D.length !== s.n) { bad++; console.log(id + '다른 곳 ' + m.D.length + '/' + s.n) }
    m.D.forEach(function (d, a) {
      if (d.kind !== 'add') { var L = SD.objSvg(m.L[d.idx]), R = SD.objSvg(m.R[d.idx]); if (L === R) { bad++; console.log(id + '바뀌지 않음 ' + d.kind) } }
      m.D.forEach(function (e, b) { if (b > a) d.at.forEach(function (p) { e.at.forEach(function (q) { if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 18) { bad++; console.log(id + '다른 곳끼리 너무 가까움') } }) }) });
      d.at.forEach(function (p) { if (SD.hit(m, p[0], p[1]) !== a) { bad++; console.log(id + '누르기 판정 문제 ' + d.kind) } });
    });
    var same = m.L.filter(function (o, k) { return !m.D.some(function (d) { return d.idx === k }) && SD.objSvg(o) !== SD.objSvg(m.R[k]) }).length;
    if (same) { bad++; console.log(id + '정답 아닌 곳이 다름') }
    var key = JSON.stringify([m.L.map(function (o) { return [o.k, Math.round(o.x), Math.round(o.y)] }), m.D.map(function (d) { return d.kind })]);
    if (seen[key]) dup++; seen[key] = 1; ns.push(m.D.length);
  });
  out.push(g + '학년: 다른 곳 ' + ns[0] + '~' + ns[29] + ' | ' + ns[30] + '~' + ns[59] + ' | ' + ns[60] + '~' + ns[89]);
}
console.log(out.join('\n')); console.log('틀린 그림 점검: 540개, 문제 ' + bad + '개, 중복 ' + dup + '개');
process.exit(bad || dup ? 1 : 0);
