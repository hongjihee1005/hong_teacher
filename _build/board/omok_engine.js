/* 오목 규칙·인공지능 (15×15). makeOmok()은 화면과 워커(Worker) 둘 다에서 씀. 0 빈칸 · 1 흑 · 2 백 */
function makeOmok() {
  var N = 15, D = [[1, 0], [0, 1], [1, 1], [1, -1]];
  function at(b, x, y) { return x < 0 || y < 0 || x >= N || y >= N ? -1 : b[y * N + x] }
  function line(b, x, y, dx, dy, me) { var s = ''; for (var k = -5; k <= 5; k++) { var v = k === 0 ? me : at(b, x + k * dx, y + k * dy); s += v === 0 ? '.' : v === me ? 'X' : 'O' } return s }
  function cover(s, pat) { for (var i = s.indexOf(pat); i >= 0; i = s.indexOf(pat, i + 1)) { if (i <= 5 && 5 < i + pat.length && pat[5 - i] === 'X') return true } return false }
  function any(s, ps) { for (var i = 0; i < ps.length; i++) if (cover(s, ps[i])) return true; return false }
  var FOUR = ['XXXX.', '.XXXX', 'XX.XX', 'X.XXX', 'XXX.X'], THREE = ['..XXX.', '.XXX..', '.XX.X.', '.X.XX.'];
  function five(b, x, y, me) { for (var d = 0; d < 4; d++) if (line(b, x, y, D[d][0], D[d][1], me).indexOf('XXXXX') >= 0) return true; return false }
  /* 쌍삼: 한 수로 열린 3이 두 방향 이상 생기면 금지(5가 되는 수는 괜찮음) */
  function double3(b, x, y, me) { if (five(b, x, y, me)) return false; var c = 0; for (var d = 0; d < 4; d++) { var s = line(b, x, y, D[d][0], D[d][1], me); if (!any(s, FOUR) && any(s, THREE)) c++ } return c >= 2 }
  function legal(b, x, y, me, rule33) { if (at(b, x, y) !== 0) return 'stone'; if (rule33 && double3(b, x, y, me)) return 'd3'; return '' }
  function dirScore(s) {
    if (s.indexOf('XXXXX') >= 0) return 1e7;
    if (cover(s, '.XXXX.')) return 1e6;
    if (any(s, FOUR)) return 1e5;
    if (any(s, THREE)) return 1e4;
    if (any(s, ['XXX', 'XX.X', 'X.XX'])) return 900;
    if (any(s, ['..XX..', '.X.X.', '..XX.', '.XX..'])) return 300;
    if (any(s, ['XX', 'X.X'])) return 60;
    return 6;
  }
  function attack(b, x, y, me) { var t = 0, big = 0; for (var d = 0; d < 4; d++) { var v = dirScore(line(b, x, y, D[d][0], D[d][1], me)); t += v; if (v >= 1e4) big++ } if (big >= 2 && t < 1e6) t += 5e5; return t }
  function cands(b, me, rule33) {
    var out = [], has = false;
    for (var y = 0; y < N; y++) for (var x = 0; x < N; x++) {
      if (b[y * N + x]) { has = true; continue }
      var near = false; for (var dy = -2; dy <= 2 && !near; dy++) for (var dx = -2; dx <= 2; dx++) { var v = at(b, x + dx, y + dy); if (v > 0) { near = true; break } }
      if (near && !(rule33 && double3(b, x, y, me))) out.push(y * N + x);
    }
    if (!has) out.push(7 * N + 7);
    return out;
  }
  function scored(b, me, rule33, dw) { var op = 3 - me; return cands(b, me, rule33).map(function (p) { var x = p % N, y = (p / N) | 0, a = attack(b, x, y, me), d = attack(b, x, y, op); return { p: p, a: a, d: d, s: a * 1.1 + d * dw } }).sort(function (u, v) { return v.s - u.s }) }
  function winAt(b, me, rule33) { var c = cands(b, me, rule33); for (var i = 0; i < c.length; i++) if (five(b, c[i] % N, (c[i] / N) | 0, me)) return c[i]; return -1 }
  /* 연속 4(VCF): 4를 계속 만들어 이기는 길 */
  function fourMoves(b, me, rule33) { return cands(b, me, rule33).filter(function (p) { var x = p % N, y = (p / N) | 0; for (var d = 0; d < 4; d++) if (any(line(b, x, y, D[d][0], D[d][1], me), FOUR)) return true; return false }) }
  function vcf(b, me, depth, rule33) {
    if (depth <= 0) return -1;
    var F = fourMoves(b, me, rule33);
    for (var i = 0; i < F.length; i++) {
      var p = F[i]; if (five(b, p % N, (p / N) | 0, me)) return p;
      b[p] = me; var c = cands(b, me, false).filter(function (q) { return five(b, q % N, (q / N) | 0, me) }), ok = false;
      if (c.length >= 2) ok = true;
      else if (c.length === 1 && !five(b, c[0] % N, (c[0] / N) | 0, 3 - me)) { b[c[0]] = 3 - me; ok = vcf(b, me, depth - 1, rule33) >= 0; b[c[0]] = 0 }
      b[p] = 0; if (ok) return p;
    }
    return -1;
  }
  /* 단계: 1~3 일부러 실수(위에서 고르기·놓치기) · 4~5 욕심쟁이(공격+수비 점수) · 6~10 그 위에 연속 4 읽기(나의 필승·상대 필승 막기) */
  var LV = [null,
    { top: 12, dw: .3, miss: .35 }, { top: 6, dw: .6, miss: .12 }, { top: 3, dw: .85 }, { top: 1, dw: .95 }, { top: 1, dw: 1.05 },
    { dw: 1.05, vcf: 4 }, { dw: 1.05, vcf: 6, safe: 4, dv: 4 }, { dw: 1.05, vcf: 8, safe: 6, dv: 6 }, { dw: 1.1, vcf: 12, safe: 8, dv: 8 }, { dw: 1.1, vcf: 16, safe: 10, dv: 12 }];
  function ai(b, me, level, rule33) {
    b = b.slice(); var C = LV[level], op = 3 - me, w = winAt(b, me, rule33);
    if (w >= 0 && !(C.miss && Math.random() < C.miss)) return w;
    var bl = winAt(b, op, false); if (bl >= 0 && !legal(b, bl % N, (bl / N) | 0, me, rule33) && !(C.miss && Math.random() < C.miss * 2)) return bl;
    if (C.vcf) { var v = vcf(b, me, C.vcf, rule33); if (v >= 0) return v }
    var L = scored(b, me, rule33, C.dw);
    if (!L.length) return -1;
    if (C.top) { var k = Math.min(C.top, L.length); return L[Math.floor(Math.pow(Math.random(), 1.6) * k)].p }
    if (C.safe) for (var i = 0; i < Math.min(C.safe, L.length); i++) { var q = L[i].p; b[q] = me; var bad = winAt(b, op, rule33) >= 0 || vcf(b, op, C.dv, rule33) >= 0; b[q] = 0; if (!bad) return q }
    return L[0].p;
  }
  function full(b) { for (var i = 0; i < N * N; i++) if (!b[i]) return false; return true }
  return { N: N, at: at, five: five, double3: double3, legal: legal, ai: ai, full: full, LV: LV };
}
