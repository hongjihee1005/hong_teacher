/* 1~16, 합 34인 4×4 마방진을 모두 구해 JSON으로 내보냄(7,040가지) — gen_magic.py가 부름 */
'use strict';
var rows = [];
function perm(a, p) { if (!a.length) { rows.push(p); return } a.forEach(function (x, i) { perm(a.slice(0, i).concat(a.slice(i + 1)), p.concat([x])) }) }
(function pick(cur, start) {
  if (cur.length === 4) { if (cur[0] + cur[1] + cur[2] + cur[3] === 34) perm(cur, []); return }
  for (var v = start; v <= 16; v++) pick(cur.concat([v]), v + 1);
})([], 1);
function mask(r) { return (1 << r[0]) | (1 << r[1]) | (1 << r[2]) | (1 << r[3]) }
var M = rows.map(mask), out = [];
for (var i = 0; i < rows.length; i++) {
  var a = rows[i];
  for (var j = 0; j < rows.length; j++) {
    if (M[i] & M[j]) continue; var b = rows[j], mb = M[i] | M[j];
    for (var k = 0; k < rows.length; k++) {
      if (mb & M[k]) continue; var c = rows[k], used = mb | M[k], d = [], ok = true;
      for (var x = 0; x < 4; x++) { var v = 34 - a[x] - b[x] - c[x]; if (v < 1 || v > 16 || (used & (1 << v))) { ok = false; break } used |= 1 << v; d.push(v) }
      if (!ok || a[0] + b[1] + c[2] + d[3] !== 34 || a[3] + b[2] + c[1] + d[0] !== 34) continue;
      out.push(a.concat(b, c, d));
    }
  }
}
process.stdout.write(JSON.stringify(out));
