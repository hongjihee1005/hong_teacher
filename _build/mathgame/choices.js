/* 수학게임 — 보기 만들기 (2026-10-07)
   기초연산 문제(skills.js의 gen)에 정답 1개 + 그럴듯한 오답을 붙여 보기 4개(크기 비교는 >, =, < 3개)를 만듭니다.
   오답은 값이 정답과 다르고 서로도 달라야 합니다(분수는 약분한 값으로 비교). node check.js가 모두 점검합니다.
   브라우저(window.MGC)와 node(require) 둘 다에서 씁니다.
*/
(function () {
  'use strict';
  var AR = typeof module !== 'undefined' && module.exports ? require('../arith/skills.js') : window.AR;
  var gcd = AR.gcd;

  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)) }
  function shuffle(r, a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t } return a }
  function nums(p) { return (p.q || p.txt || []).filter(function (t) { return t && t.k === 'n' }).map(function (t) { return t.v }) }
  function ops(p) { return (p.q || []).filter(function (t) { return typeof t === 'string' && '+−×÷'.indexOf(t) >= 0 }) }
  function fracs(p) { return (p.q || []).filter(function (t) { return t && t.k === 'f' }) }

  /* 값 비교용 열쇠: 값이 같으면 같은 열쇠 */
  function vkey(a) {
    if (a.t === 'n') return 'n' + a.v;
    if (a.t === 'd') { var v = a.v, p = a.p; while (p > 0 && v % 10 === 0) { v /= 10; p-- } return 'd' + v + '/' + p }
    if (a.t === 'f') { var g = gcd(a.n, a.d) || 1; return 'f' + a.n / g + '/' + a.d / g }
    if (a.t === 'qr') return 'q' + a.q + ',' + a.r;
    if (a.t === 'cmp') return 'c' + a.v;
    if (a.t === 'list') return 'l' + a.v.join(',');
  }

  /* 자연수 오답 */
  function nCand(p, r) {
    var v = p.a.v, ns = nums(p), op = ops(p), c = [], s = String(v);
    var near = v < 10 ? [1, 2, 3] : v < 100 ? [1, 2, 10, 9, 11] : v < 1000 ? [1, 10, 100, 2, 9, 11, 20] : [1, 10, 100, 1000, 9, 110];
    near.forEach(function (m) { c.push(v + m, v - m) });
    if (op.length === 1 && ns.length === 2) {
      var a = ns[0], b = ns[1];
      if (op[0] === '×') { c.unshift(a * (b + 1), a * (b - 1), (a + 1) * b, (a - 1) * b); if (v === 0) c.unshift(a, b, a + b) }   // 이웃 곱, 0의 곱을 그 수로
      if (op[0] === '+') c.unshift(v - 10, v + 10);   // 받아올림 실수
      if (op[0] === '−') c.unshift(v + 10, v - 10, Math.abs((a % 10) - (b % 10)) + (Math.floor(a / 10) - Math.floor(b / 10)) * 10);   // 받아내림 실수(큰 수에서 작은 수를 뺌)
    }
    if (s.length >= 2) c.push(+(s.slice(0, -2) + s.slice(-1) + s.slice(-2, -1)));   // 끝 두 자리 바꿈
    var head = c.slice(0, 4), rest = shuffle(r, c.slice(4));
    return shuffle(r, head).concat(rest).filter(function (x) { return x >= 0 && Math.floor(x) === x && (v < 10 || x >= 1) && String(x).length >= s.length - 1 && String(x).length <= s.length + 1 })
      .map(function (x) { return { t: 'n', v: x } });
  }
  /* 소수 오답: 끝자리 ±1·±10, 소수점 옮김 */
  function dCand(p, r) {
    var v = p.a.v, q = p.a.p, c = [];
    [[v + 1, q], [v - 1, q], [v + 10, q], [v - 10, q]].forEach(function (x) { c.push(x) });
    c.push([v, q + 1]); if (q > 0) c.push([v, q - 1]); else c.push([v * 10, 0]);
    shuffle(r, c);
    // 소수점 옮긴 것 하나는 꼭 넣음(소수에서 가장 흔한 실수)
    var sh = c.filter(function (x) { return x[1] !== q || x[0] === v * 10 })[0]; if (sh) { c.splice(c.indexOf(sh), 1); c.unshift(sh) }
    return c.filter(function (x) { return x[0] > 0 && x[1] >= 0 && x[1] <= 4 }).map(function (x) { return { t: 'd', v: x[0], p: x[1] } });
  }
  /* 몫 … 나머지 오답 */
  function qrCand(p, r) {
    var ns = nums(p), b = ns[1], Q = p.a.q, R = p.a.r, c = [];
    if (R + 1 < b) c.push([Q, R + 1]); if (R >= 1) c.push([Q, R - 1]);
    c.push([Q + 1, R]); if (Q >= 1) c.push([Q - 1, R]);
    if (Q >= 1) c.push([Q - 1, R + b]);   // 나머지가 나누는 수보다 큼(흔한 실수)
    if (R + 2 < b) c.push([Q, R + 2]); c.push([Q + 1, R ? R - 1 : 1]); c.push([Q + 10, R]);
    return shuffle(r, c).filter(function (x) { return x[0] >= 0 && x[1] >= 0 }).map(function (x) { return { t: 'qr', q: x[0], r: x[1] } });
  }
  /* 분수 오답: 분자·분모 ±1, 거꾸로, 분자끼리·분모끼리 더하기(흔한 실수) */
  function fCand(p, r) {
    var n = p.a.n, d = p.a.d, F = fracs(p), op = ops(p), c = [];
    if (F.length === 2 && (op[0] === '+' || op[0] === '−')) {
      var x = F[0], y = F[1], xn = x.w * x.d + x.n, yn = y.w * y.d + y.n;
      if (op[0] === '+') c.push([xn + yn, x.d + y.d]); else if (xn > yn && x.d !== y.d) c.push([xn - yn, Math.abs(x.d - y.d) || 1]);
    }
    c.push([n + 1, d], [n - 1, d], [n + d, d], [n - d, d], [n + 2, d], [n - 2, d], [n + 2 * d, d], [n + d + 1, d]);   // 분모는 그대로(분자·자연수 부분 실수)
    if (op[0] === '÷' && n !== d) c.unshift([d, n]);   // 나눗셈: 거꾸로 곱함
    var head = F.length === 2 && op[0] !== '÷' && c.length > 8 ? c.slice(0, 1) : op[0] === '÷' && n !== d ? c.slice(0, 1) : [];
    var rest = shuffle(r, c.slice(head.length));
    var whole = n % d === 0, big = n > d;
    var ok = head.concat(rest).filter(function (x) { return x[0] > 0 && x[1] > 1 });
    // 정답과 같은 모양(자연수인지, 1보다 큰지)을 먼저
    var same = ok.filter(function (x) { return (x[0] % x[1] === 0) === whole && (x[0] > x[1]) === big });
    var other = ok.filter(function (x) { return same.indexOf(x) < 0 });
    return same.concat(other).map(function (x) { return { t: 'f', n: x[0], d: x[1], form: p.a.form } });
  }
  /* 수 여러 개(약수·배수·공약수) 오답 */
  function listCand(p, r) {
    var v = p.a.v, mx = v[v.length - 1], c = [], i;
    function non() { for (var k = 0; k < 60; k++) { var x = ri(r, 2, Math.max(mx + 3, 6)); if (v.indexOf(x) < 0) return x } return mx + 1 }
    for (i = 0; i < 6; i++) {
      var t = v.slice(), kind = i % 3;
      if (kind === 0 && t.length > 2) t.splice(ri(r, 1, t.length - 2), 1);            // 하나 빠짐(가운데)
      else if (kind === 1) t.push(non());                                             // 아닌 수가 끼어듦
      else if (t.length > 1) t[ri(r, 1, t.length - 1)] = non();                       // 하나가 다른 수
      else t.push(non());
      t = t.filter(function (x, j) { return t.indexOf(x) === j }).sort(function (a, b) { return a - b });
      c.push(t);
    }
    if (v.length >= 3 && v[1] - v[0] === v[0]) { var st = v[0]; c.unshift(v.map(function (x) { return x + st })) }   // 배수: 한 칸 밀림
    if (v.length >= 3 && v[0] !== 1) { /* 배수 문제에서 0부터 셈 */ c.push([0].concat(v.slice(0, -1))) }
    return shuffle(r, c).map(function (t) { return { t: 'list', v: t } });
  }

  /* 문제 p → { opts:[답…], ok:정답 차례 } */
  function choices(p, r, n) {
    n = n || 4;
    var a = p.a;
    if (a.t === 'cmp') return { opts: ['>', '=', '<'].map(function (v) { return { t: 'cmp', v: v } }), ok: ['>', '=', '<'].indexOf(a.v), fixed: true };
    var cand = a.t === 'n' ? nCand(p, r) : a.t === 'd' ? dCand(p, r) : a.t === 'qr' ? qrCand(p, r) : a.t === 'f' ? fCand(p, r) : listCand(p, r);
    var seen = {}, out = [a]; seen[vkey(a)] = 1;
    for (var i = 0; i < cand.length && out.length < n; i++) { var k = vkey(cand[i]); if (seen[k]) continue; seen[k] = 1; out.push(cand[i]) }
    // 모자라면(아주 작은 수 등) 가까운 수로 채움
    for (var j = 0; out.length < n && j < 400; j++) {
      var e;
      if (a.t === 'n') e = { t: 'n', v: Math.max(0, a.v + ri(r, -5 - j, 5 + j)) };
      else if (a.t === 'd') e = { t: 'd', v: Math.max(1, a.v + ri(r, -20 - j, 20 + j)), p: a.p };
      else if (a.t === 'qr') e = { t: 'qr', q: Math.max(0, a.q + ri(r, -3, 3)), r: ri(r, 0, a.r + 3) };
      else if (a.t === 'f') e = { t: 'f', n: Math.max(1, a.n + ri(r, -4 - j, 4 + j)), d: Math.max(2, a.d + ri(r, -2, 3)), form: a.form };
      else e = { t: 'list', v: a.v.concat([a.v[a.v.length - 1] + ri(r, 1, 9 + j)]) };
      var kk = vkey(e); if (seen[kk]) continue; seen[kk] = 1; out.push(e);
    }
    shuffle(r, out);
    return { opts: out, ok: out.indexOf(a) };
  }

  /* 보기를 화면에 보일 꼴로: 분수는 정답과 같은 모양 규칙(기약분수·대분수·가분수)으로 */
  function fShow(o) {
    var n = o.n, d = o.d;
    if (o.form === 'simp') { var g = gcd(n, d); n /= g; d /= g }
    if (n % d === 0 && o.form !== 'improper') return { k: 'n', v: n / d };
    if (o.form === 'improper' || n < d) return { k: 'f', w: 0, n: n, d: d };
    return { k: 'f', w: Math.floor(n / d), n: n % d, d: d };
  }

  var MGC = { choices: choices, vkey: vkey, fShow: fShow };
  if (typeof module !== 'undefined' && module.exports) module.exports = MGC; else window.MGC = MGC;
})();
