/* 공통 › 기초연산 — 단계(문제 유형)와 문제 생성기 (2026-10-05)
   같은 단계 · 같은 씨앗(seed)이면 언제나 같은 문제가 나옵니다(학습지 번호, 급수 시험 회차).
   브라우저(window.AR)와 node(check.js) 둘 다에서 씁니다.

   문제 { q:[토큰…], a:답, v:세로셈 여부, txt:글 문제 }
   토큰  {k:'n',v}=자연수  {k:'d',v,p}=소수(v÷10^p)  {k:'f',w,n,d}=분수(대분수 w n/d)  {k:'b'}=빈칸  그 밖은 문자열 '+','−','×','÷','(',')','=','○'
   답    {t:'n',v} {t:'qr',q,r} {t:'f',n,d,form} {t:'d',v,p} {t:'cmp',v:'<'|'='|'>'} {t:'list',v:[…]}
         분수 form: any(값만 같으면) simp(기약분수) mixed(대분수로) improper(가분수로)
*/
(function () {
  'use strict';
  /* ── 씨앗 있는 난수 ── */
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
  function rng(seed) { var a = typeof seed === 'number' ? seed >>> 0 : hash(String(seed)); return function () { a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
  function ri(r, a, b) { return a + Math.floor(r() * (b - a + 1)) }
  function pick(r, a) { return a[Math.floor(r() * a.length)] }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t } return a }
  function lcm(a, b) { return a / gcd(a, b) * b }
  var P10 = [1, 10, 100, 1000, 10000, 100000, 1000000];

  /* ── 토큰 ── */
  function N(v) { return { k: 'n', v: v } }
  function D(v, p) { while (p > 0 && v % 10 === 0) { v /= 10; p-- } return p ? { k: 'd', v: v, p: p } : N(v) }
  function F(n, d, w) { return { k: 'f', w: w || 0, n: n, d: d } }
  var B = { k: 'b' };
  function An(v) { return { t: 'n', v: v } }
  function Ad(v, p) { while (p > 0 && v % 10 === 0) { v /= 10; p-- } return { t: 'd', v: v, p: p } }
  function Af(n, d, form) { var g = form === 'simp' ? gcd(n, d) : 1; return { t: 'f', n: n / g, d: d / g, form: form || 'any' } }   // 4학년 분수(any)는 약분하지 않은 교과서 꼴 그대로
  function Ac(x, y) { return { t: 'cmp', v: x < y ? '<' : x > y ? '>' : '=' } }
  function dig(x, i) { return Math.floor(x / P10[i]) % 10 }
  function carries(a, b) { var c = 0, k = 0; for (var i = 0; i < 7; i++) { var s = dig(a, i) + dig(b, i) + c; c = s >= 10 ? 1 : 0; k += c } return k }
  function borrows(a, b) { var c = 0, k = 0; for (var i = 0; i < 7; i++) { var s = dig(a, i) - dig(b, i) - c; c = s < 0 ? 1 : 0; k += c } return k }
  function mixed(n, d) { return F(n % d, d, Math.floor(n / d)) }       // 가분수 n/d → 대분수 토큰
  function nz(r, a, b) { var v; do { v = ri(r, a, b) } while (v % 10 === 0); return v }  // 끝자리가 0이 아닌 수

  function add2(a, b, v) { return { q: [N(a), '+', N(b)], a: An(a + b), v: v } }
  function sub2(a, b, v) { return { q: [N(a), '−', N(b)], a: An(a - b), v: v } }
  function mul2(a, b, v) { return { q: [N(a), '×', N(b)], a: An(a * b), v: v } }
  function div2(a, b) { return { q: [N(a), '÷', N(b)], a: An(a / b) } }
  function qr2(a, b) { return { q: [N(a), '÷', N(b)], a: { t: 'qr', q: Math.floor(a / b), r: a % b } } }
  function until(r, f, ok) { for (var i = 0; i < 5000; i++) { var x = f(); if (ok(x)) return x } throw new Error('생성 실패') }

  /* ── 혼합 계산: 식 틀(a+b×c …)에 수를 넣고, 중간 결과가 모두 0 이상 자연수이며 나눗셈이 나누어떨어질 때만 씀 ── */
  function prec(o) { return o === '×' || o === '÷' ? 2 : 1 }
  function evalTok(t) {   // 자연수 식 계산(실패하면 null)
    var out = [], ops = [];
    function ap() { var o = ops.pop(), y = out.pop(), x = out.pop(), z;
      if (o === '+') z = x + y; else if (o === '−') z = x - y; else if (o === '×') z = x * y; else { if (y === 0 || x % y) return false; z = x / y }
      if (z < 0) return false; out.push(z); return true }
    for (var i = 0; i < t.length; i++) { var k = t[i];
      if (typeof k === 'object') out.push(k.v);
      else if (k === '(') ops.push(k);
      else if (k === ')') { while (ops[ops.length - 1] !== '(') if (!ap()) return null; ops.pop() }
      else { while (ops.length && ops[ops.length - 1] !== '(' && prec(ops[ops.length - 1]) >= prec(k)) if (!ap()) return null; ops.push(k) } }
    while (ops.length) if (!ap()) return null;
    return out[0];
  }
  function mixGen(r, tpls, max) {
    return until(r, function () {
      var tp = pick(r, tpls), t = [], i, ch;
      for (i = 0; i < tp.length; i++) {
        ch = tp[i];
        if (/[a-z]/.test(ch)) {
          var nxt = tp[i + 1], prv = tp[i - 1];
          var muldiv = nxt === '*' || nxt === '/' || prv === '*' || prv === '/';
          if (nxt === '/' && /[a-z]/.test(tp[i + 2] || '') ) {   // x÷y 꼴: 나누어떨어지게 미리 맞춤
            var y = ri(r, 2, 9), qq = ri(r, 2, 12); t.push(N(y * qq)); t.push('÷'); t.push(N(y)); i += 2; continue;
          }
          t.push(N(muldiv ? ri(r, 2, prv === '/' ? 9 : 12) : ri(r, 3, 60)));
        } else t.push({ '+': '+', '-': '−', '*': '×', '/': '÷', '(': '(', ')': ')' }[ch]);
      }
      var v = evalTok(t); return { q: t, a: An(v), _v: v };
    }, function (x) { return x._v !== null && x._v > 0 && x._v <= max });
  }

  /* ── 분수 도우미 ── */
  function prop(r, d1, d2) { var d = ri(r, d1, d2); return [ri(r, 1, d - 1), d] }
  function irr(r, d1, d2) { return until(r, function () { return prop(r, d1, d2) }, function (x) { return gcd(x[0], x[1]) === 1 }) }

  /* ── 소수 도우미 ── */
  function dcmp(a, ap, b, bp) { var m = Math.max(ap, bp); return a * P10[m - ap] - b * P10[m - bp] }

  /* ── 영역 ── */
  var AREAS = [
    { id: 'add', file: 'add.html', name: '덧셈', ico: '➕', acc: '#E0567A', de: '10까지의 덧셈부터 받아올림이 여러 번 있는 네 자리 수 덧셈까지' },
    { id: 'sub', file: 'sub.html', name: '뺄셈', ico: '➖', acc: '#2F74E0', de: '10까지의 뺄셈부터 받아내림이 여러 번 있는 네 자리 수 뺄셈까지' },
    { id: 'mul', file: 'mul.html', name: '곱셈', ico: '✖️', acc: '#D9731A', de: '곱셈구구 2단~9단부터 (세 자리 수)×(두 자리 수)까지' },
    { id: 'div', file: 'div.html', name: '나눗셈', ico: '➗', acc: '#3E9A3E', de: '곱셈구구로 몫 구하기, 나머지가 있는 나눗셈, 두 자리 수로 나누기' },
    { id: 'mix', file: 'mix.html', name: '혼합 계산', ico: '🧮', acc: '#8A55D6', de: '덧셈·뺄셈·곱셈·나눗셈이 섞인 식과 괄호가 있는 식의 계산 순서' },
    { id: 'factor', file: 'factor.html', name: '약수와 배수', ico: '🧩', acc: '#1C8C7A', de: '약수·배수·공약수, 최대공약수·최소공배수, 약분과 통분' },
    { id: 'frac', file: 'frac.html', name: '분수', ico: '🍕', acc: '#C0503A', de: '분수의 크기 비교, 대분수와 가분수, 분수의 덧셈·뺄셈·곱셈·나눗셈' },
    { id: 'dec', file: 'dec.html', name: '소수', ico: '🔢', acc: '#2B6FB8', de: '소수의 크기 비교, 분수를 소수로, 소수의 덧셈·뺄셈·곱셈·나눗셈' }
  ];

  var ASK = {
    calc: '계산해 보세요.', blank: '□ 안에 알맞은 수를 써넣으세요.', cmp: '○ 안에 >, =, < 중 알맞은 것을 골라요.',
    qr: '몫과 나머지를 구해 보세요.', simp: '계산해서 기약분수로 나타내세요. (가분수는 대분수로 나타내도 돼요.)'
  };

  /* g: 주로 배우는 학년(참고), ch: 도전, v: 세로셈으로 보여 줌, ask: 지시문, gen(r) → 문제 */
  var S = [
    /* ── 덧셈 ── */
    { id: 'add01', ar: 'add', g: 1, nm: '10까지의 덧셈', de: '(몇)+(몇), 합이 10까지', gen: function (r) { var a = ri(r, 1, 9), b = ri(r, 1, 10 - a); return add2(a, b) } },
    { id: 'add02', ar: 'add', g: 1, nm: '10이 되는 더하기', de: '□+(몇)=10, 10 가르기와 모으기', ask: 'blank', gen: function (r) { var a = ri(r, 1, 9); return r() < .5 ? { q: [N(a), '+', B, '=', N(10)], a: An(10 - a) } : { q: [B, '+', N(a), '=', N(10)], a: An(10 - a) } } },
    { id: 'add03', ar: 'add', g: 1, nm: '받아올림이 있는 (몇)+(몇)', de: '10을 만들어 더하기, 합이 11~18', gen: function (r) { var a = ri(r, 2, 9), b = ri(r, Math.max(2, 11 - a), 9); return add2(a, b) } },
    { id: 'add04', ar: 'add', g: 1, nm: '(몇십몇)+(몇)', de: '받아올림이 없는 덧셈', gen: function (r) { var x = until(r, function () { return [ri(r, 10, 88), ri(r, 1, 9)] }, function (x) { return x[0] % 10 + x[1] <= 9 }); return add2(x[0], x[1]) } },
    { id: 'add05', ar: 'add', g: 1, nm: '(몇십몇)+(몇십몇)', de: '받아올림이 없는 두 자리 수 덧셈, (몇십)+(몇십)', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 10, 88), ri(r, 10, 88)] }, function (x) { return carries(x[0], x[1]) === 0 && x[0] + x[1] < 100 }); return add2(x[0], x[1], 1) } },
    { id: 'add06', ar: 'add', g: 1, nm: '세 수의 덧셈', de: '한 자리 수 세 개, 10을 만들어 더하기', gen: function (r) { var a = ri(r, 1, 9), b = r() < .5 ? 10 - a : ri(r, 1, 9), c = ri(r, 1, 9); if (a + b + c > 19) c = 19 - a - b > 0 ? ri(r, 1, 19 - a - b) : 1; return { q: [N(a), '+', N(b), '+', N(c)], a: An(a + b + c) } } },
    { id: 'add07', ar: 'add', g: 2, nm: '받아올림이 있는 (두 자리)+(한 자리)', de: '일의 자리에서 받아올림', gen: function (r) { var x = until(r, function () { return [ri(r, 11, 89), ri(r, 2, 9)] }, function (x) { return x[0] % 10 + x[1] >= 10 && x[0] + x[1] < 100 }); return add2(x[0], x[1]) } },
    { id: 'add08', ar: 'add', g: 2, nm: '받아올림이 한 번 있는 (두 자리)+(두 자리)', de: '합이 100보다 작은 덧셈', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 11, 79), ri(r, 11, 79)] }, function (x) { return x[0] % 10 + x[1] % 10 >= 10 && x[0] + x[1] < 100 }); return add2(x[0], x[1], 1) } },
    { id: 'add09', ar: 'add', g: 2, nm: '합이 세 자리 수인 (두 자리)+(두 자리)', de: '십의 자리에서 받아올림, 받아올림 두 번', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 15, 99), ri(r, 15, 99)] }, function (x) { return x[0] + x[1] >= 100 }); return add2(x[0], x[1], 1) } },
    { id: 'add10', ar: 'add', g: 2, nm: '덧셈식에서 □ 구하기', de: '(두 자리)+□=(두 자리)', ask: 'blank', gen: function (r) { var a = ri(r, 11, 80), c = ri(r, a + 3, 99); return r() < .5 ? { q: [N(a), '+', B, '=', N(c)], a: An(c - a) } : { q: [B, '+', N(a), '=', N(c)], a: An(c - a) } } },
    { id: 'add11', ar: 'add', g: 3, nm: '(세 자리)+(세 자리) ①', de: '받아올림이 없거나 한 번', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 101, 899), ri(r, 101, 899)] }, function (x) { return carries(x[0], x[1]) <= 1 && x[0] + x[1] < 1000 }); return add2(x[0], x[1], 1) } },
    { id: 'add12', ar: 'add', g: 3, nm: '(세 자리)+(세 자리) ②', de: '받아올림이 두 번 이상, 합이 네 자리 수도', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 128, 989), ri(r, 128, 989)] }, function (x) { return carries(x[0], x[1]) >= 2 }); return add2(x[0], x[1], 1) } },
    { id: 'add13', ar: 'add', g: 3, ch: 1, nm: '(네 자리)+(네 자리)', de: '받아올림이 여러 번 있는 큰 수의 덧셈', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 1001, 8999), ri(r, 1001, 8999)] }, function (x) { return carries(x[0], x[1]) >= 2 }); return add2(x[0], x[1], 1) } },

    /* ── 뺄셈 ── */
    { id: 'sub01', ar: 'sub', g: 1, nm: '10까지의 뺄셈', de: '(몇)−(몇)', gen: function (r) { var a = ri(r, 2, 10), b = ri(r, 1, a - 1); return sub2(a, b) } },
    { id: 'sub02', ar: 'sub', g: 1, nm: '10에서 빼기', de: '10−(몇), 10−□=(몇)', gen: function (r) { var b = ri(r, 1, 9); return r() < .65 ? sub2(10, b) : { q: [N(10), '−', B, '=', N(10 - b)], a: An(b) } } },
    { id: 'sub03', ar: 'sub', g: 1, nm: '받아내림이 있는 (십몇)−(몇)', de: '10에서 빼고 더하기, 11~18에서 빼기', gen: function (r) { var x = until(r, function () { return [ri(r, 11, 18), ri(r, 2, 9)] }, function (x) { return x[0] % 10 < x[1] }); return sub2(x[0], x[1]) } },
    { id: 'sub04', ar: 'sub', g: 1, nm: '(몇십몇)−(몇)', de: '받아내림이 없는 뺄셈', gen: function (r) { var x = until(r, function () { return [ri(r, 11, 99), ri(r, 1, 9)] }, function (x) { return x[0] % 10 >= x[1] }); return sub2(x[0], x[1]) } },
    { id: 'sub05', ar: 'sub', g: 1, nm: '(몇십몇)−(몇십몇)', de: '받아내림이 없는 두 자리 수 뺄셈, (몇십)−(몇십)', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 20, 99), ri(r, 10, 89)] }, function (x) { return x[0] > x[1] && borrows(x[0], x[1]) === 0 }); return sub2(x[0], x[1], 1) } },
    { id: 'sub06', ar: 'sub', g: 1, nm: '세 수의 덧셈과 뺄셈', de: '앞에서부터 차례대로, 한 자리 수 세 개', gen: function (r) {
      return until(r, function () { var a = ri(r, 2, 9), b = ri(r, 1, 9), c = ri(r, 1, 9), o1 = pick(r, ['+', '−']), o2 = pick(r, ['+', '−']), t = [N(a), o1, N(b), o2, N(c)]; return { q: t, a: An(evalTok(t)), _o: o1 + o2 } }, function (x) { return x.a.v !== null && x.a.v <= 19 && x._o !== '++' }) } },
    { id: 'sub07', ar: 'sub', g: 2, nm: '(몇십)−(몇십몇)', de: '받아내림이 있는 뺄셈, 40−17', gen: function (r) { var a = ri(r, 2, 9) * 10, b = until(r, function () { return ri(r, 11, a - 1) }, function (x) { return x % 10 }); return sub2(a, b) } },
    { id: 'sub08', ar: 'sub', g: 2, nm: '받아내림이 있는 (두 자리)−(한 자리)', de: '일의 자리에서 받아내림', gen: function (r) { var x = until(r, function () { return [ri(r, 21, 98), ri(r, 2, 9)] }, function (x) { return x[0] % 10 < x[1] }); return sub2(x[0], x[1]) } },
    { id: 'sub09', ar: 'sub', g: 2, nm: '받아내림이 있는 (두 자리)−(두 자리)', de: '십의 자리에서 받아내림', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 31, 98), ri(r, 12, 89)] }, function (x) { return x[0] > x[1] && x[0] % 10 < x[1] % 10 && x[1] % 10 }); return sub2(x[0], x[1], 1) } },
    { id: 'sub10', ar: 'sub', g: 2, nm: '뺄셈식에서 □ 구하기', de: '□−(몇십몇)=(몇십몇), (몇십몇)−□=(몇십몇)', ask: 'blank', gen: function (r) { var a = ri(r, 30, 99), b = ri(r, 11, a - 5), c = a - b; return pick(r, [{ q: [N(a), '−', B, '=', N(c)], a: An(b) }, { q: [B, '−', N(b), '=', N(c)], a: An(a) }]) } },
    { id: 'sub11', ar: 'sub', g: 3, nm: '(세 자리)−(세 자리) ①', de: '받아내림이 없거나 한 번', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 200, 999), ri(r, 101, 899)] }, function (x) { return x[0] > x[1] && borrows(x[0], x[1]) <= 1 }); return sub2(x[0], x[1], 1) } },
    { id: 'sub12', ar: 'sub', g: 3, nm: '(세 자리)−(세 자리) ②', de: '받아내림이 두 번, 503−268처럼 0이 있는 수', v: 1, gen: function (r) { var x = until(r, function () { var a = r() < .35 ? ri(r, 2, 9) * 100 + ri(r, 0, 9) : ri(r, 201, 999); return [a, ri(r, 101, 899)] }, function (x) { return x[0] > x[1] && borrows(x[0], x[1]) >= 2 }); return sub2(x[0], x[1], 1) } },
    { id: 'sub13', ar: 'sub', g: 3, ch: 1, nm: '(네 자리)−(네 자리)', de: '받아내림이 여러 번 있는 큰 수의 뺄셈', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 2000, 9999), ri(r, 1001, 8999)] }, function (x) { return x[0] > x[1] && borrows(x[0], x[1]) >= 2 }); return sub2(x[0], x[1], 1) } },

    /* ── 곱셈 ── */
    { id: 'mul01', ar: 'mul', g: 2, nm: '곱셈구구 2단·5단', de: '2×(몇), 5×(몇)', gen: function (r) { return mul2(pick(r, [2, 5]), ri(r, 1, 9)) } },
    { id: 'mul02', ar: 'mul', g: 2, nm: '곱셈구구 3단·6단', de: '3×(몇), 6×(몇)', gen: function (r) { return mul2(pick(r, [3, 6]), ri(r, 1, 9)) } },
    { id: 'mul03', ar: 'mul', g: 2, nm: '곱셈구구 4단·8단', de: '4×(몇), 8×(몇)', gen: function (r) { return mul2(pick(r, [4, 8]), ri(r, 1, 9)) } },
    { id: 'mul04', ar: 'mul', g: 2, nm: '곱셈구구 7단·9단', de: '7×(몇), 9×(몇)', gen: function (r) { return mul2(pick(r, [7, 9]), ri(r, 1, 9)) } },
    { id: 'mul05', ar: 'mul', g: 2, nm: '1단 곱셈구구와 0의 곱', de: '1×(몇), 0×(몇), (몇)×0', gen: function (r) { var k = ri(r, 0, 9); return pick(r, [mul2(1, k), mul2(k, 1), mul2(0, ri(r, 1, 9)), mul2(ri(r, 1, 9), 0)]) } },
    { id: 'mul06', ar: 'mul', g: 2, nm: '곱셈구구 섞어서', de: '2단~9단 전체', gen: function (r) { return mul2(ri(r, 2, 9), ri(r, 2, 9)) } },
    { id: 'mul07', ar: 'mul', g: 2, nm: '곱셈구구 □ 구하기', de: '(몇)×□=(몇십몇)', ask: 'blank', gen: function (r) { var a = ri(r, 2, 9), b = ri(r, 2, 9); return r() < .5 ? { q: [N(a), '×', B, '=', N(a * b)], a: An(b) } : { q: [B, '×', N(a), '=', N(a * b)], a: An(b) } } },
    { id: 'mul08', ar: 'mul', g: 3, nm: '(몇십)×(몇)', de: '20×3, 60×7', gen: function (r) { return mul2(ri(r, 1, 9) * 10, ri(r, 2, 9)) } },
    { id: 'mul09', ar: 'mul', g: 3, nm: '(두 자리)×(한 자리) ①', de: '올림이 없는 곱셈, 십의 자리에서만 올림', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 11, 99), ri(r, 2, 9)] }, function (x) { return (x[0] % 10) * x[1] < 10 }); return mul2(x[0], x[1], 1) } },
    { id: 'mul10', ar: 'mul', g: 3, nm: '(두 자리)×(한 자리) ②', de: '일의 자리에서 올림이 있는 곱셈', v: 1, gen: function (r) { var x = until(r, function () { return [ri(r, 12, 99), ri(r, 2, 9)] }, function (x) { return (x[0] % 10) * x[1] >= 10 }); return mul2(x[0], x[1], 1) } },
    { id: 'mul11', ar: 'mul', g: 3, nm: '(세 자리)×(한 자리)', de: '올림이 여러 번 있는 곱셈', v: 1, gen: function (r) { return mul2(nz(r, 102, 989), ri(r, 2, 9), 1) } },
    { id: 'mul12', ar: 'mul', g: 3, nm: '(몇십)×(몇십), (몇십몇)×(몇십)', de: '30×40, 27×50', gen: function (r) { return r() < .45 ? mul2(ri(r, 1, 9) * 10, ri(r, 1, 9) * 10) : mul2(nz(r, 11, 99), ri(r, 2, 9) * 10) } },
    { id: 'mul13', ar: 'mul', g: 3, nm: '(두 자리)×(두 자리)', de: '13×24, 68×57', v: 1, gen: function (r) { return mul2(nz(r, 12, 99), nz(r, 12, 99), 1) } },
    { id: 'mul14', ar: 'mul', g: 4, nm: '(세 자리)×(두 자리)', de: '254×37', v: 1, gen: function (r) { return mul2(nz(r, 102, 989), nz(r, 12, 99), 1) } },
    { id: 'mul15', ar: 'mul', g: 4, nm: '0이 많은 곱셈', de: '(몇백)×(몇십), (세 자리)×(몇십)', gen: function (r) { return r() < .5 ? mul2(ri(r, 1, 9) * 100, ri(r, 1, 9) * 10) : mul2(nz(r, 102, 989), ri(r, 2, 9) * 10) } },

    /* ── 나눗셈 ── */
    { id: 'div01', ar: 'div', g: 3, nm: '곱셈구구로 몫 구하기', de: '나누어떨어지는 나눗셈, 56÷8', gen: function (r) { var a = ri(r, 2, 9), b = ri(r, 2, 9); return div2(a * b, a) } },
    { id: 'div02', ar: 'div', g: 3, nm: '나눗셈식에서 □ 구하기', de: '□÷(몇)=(몇), (몇십몇)÷□=(몇)', ask: 'blank', gen: function (r) { var a = ri(r, 2, 9), b = ri(r, 2, 9); return pick(r, [{ q: [B, '÷', N(a), '=', N(b)], a: An(a * b) }, { q: [N(a * b), '÷', B, '=', N(b)], a: An(a) }, { q: [N(a * b), '÷', N(a), '=', B], a: An(b) }]) } },
    { id: 'div03', ar: 'div', g: 3, nm: '(몇십)÷(몇)', de: '60÷3, 70÷5 (나누어떨어짐)', gen: function (r) { return until(r, function () { var b = ri(r, 2, 9), a = ri(r, 1, 9) * 10; return div2(a, b) }, function (x) { return Number.isInteger(x.a.v) && x.a.v >= 5 }) } },
    { id: 'div04', ar: 'div', g: 3, nm: '(두 자리)÷(한 자리)', de: '나머지가 없는 나눗셈, 48÷4, 52÷4', gen: function (r) { return until(r, function () { var b = ri(r, 2, 9), q = ri(r, 11, 49); return div2(b * q, b) }, function (x) { return x.q[0].v < 100 && x.q[0].v % 10 }) } },
    { id: 'div05', ar: 'div', g: 3, nm: '나머지가 있는 (두 자리)÷(한 자리)', de: '17÷5, 53÷4', ask: 'qr', gen: function (r) { return until(r, function () { var b = ri(r, 2, 9), q = ri(r, 2, 40), m = ri(r, 1, b - 1); return qr2(b * q + m, b) }, function (x) { return x.q[0].v < 100 }) } },
    { id: 'div06', ar: 'div', g: 3, nm: '(세 자리)÷(한 자리)', de: '나머지가 없는 나눗셈, 384÷6', gen: function (r) { return until(r, function () { var b = ri(r, 2, 9), q = ri(r, 12, 199); return div2(b * q, b) }, function (x) { return x.q[0].v >= 100 && x.q[0].v < 1000 }) } },
    { id: 'div07', ar: 'div', g: 3, nm: '나머지가 있는 (세 자리)÷(한 자리)', de: '275÷4', ask: 'qr', gen: function (r) { return until(r, function () { var b = ri(r, 2, 9), q = ri(r, 12, 300), m = ri(r, 1, b - 1); return qr2(b * q + m, b) }, function (x) { return x.q[0].v >= 100 && x.q[0].v < 1000 }) } },
    { id: 'div08', ar: 'div', g: 4, nm: '(몇백몇십)÷(몇십)', de: '240÷60, 350÷70 (나누어떨어짐)', gen: function (r) { var b = ri(r, 2, 9), q = ri(r, 2, 9); return div2(b * q * 10, b * 10) } },
    { id: 'div09', ar: 'div', g: 4, nm: '(두 자리)÷(두 자리)', de: '나머지가 있는 나눗셈, 85÷21', ask: 'qr', gen: function (r) { return until(r, function () { var b = ri(r, 11, 32), q = ri(r, 2, 8), m = ri(r, 0, b - 1); return qr2(b * q + m, b) }, function (x) { return x.q[0].v < 100 }) } },
    { id: 'div10', ar: 'div', g: 4, nm: '(세 자리)÷(두 자리) ①', de: '몫이 한 자리 수, 192÷24, 300÷47', ask: 'qr', gen: function (r) { return until(r, function () { var b = ri(r, 12, 99), q = ri(r, 2, 9), m = ri(r, 0, b - 1); return qr2(b * q + m, b) }, function (x) { return x.q[0].v >= 100 && x.q[0].v < 1000 }) } },
    { id: 'div11', ar: 'div', g: 4, nm: '(세 자리)÷(두 자리) ②', de: '몫이 두 자리 수, 779÷26', ask: 'qr', gen: function (r) { return until(r, function () { var b = ri(r, 11, 49), q = ri(r, 10, 89), m = ri(r, 0, b - 1); return qr2(b * q + m, b) }, function (x) { return x.q[0].v >= 100 && x.q[0].v < 1000 }) } },

    /* ── 혼합 계산 ── */
    { id: 'mix01', ar: 'mix', g: 5, nm: '덧셈과 뺄셈이 섞인 식', de: '앞에서부터 차례로, ( ) 안을 먼저', gen: function (r) { return mixGen(r, ['a+b-c', 'a-b+c', 'a-(b+c)', 'a-(b-c)', 'a+b-c+d', 'a-b-(c-d)', '(a+b)-(c+d)'], 300) } },
    { id: 'mix02', ar: 'mix', g: 5, nm: '곱셈과 나눗셈이 섞인 식', de: '앞에서부터 차례로, ( ) 안을 먼저', gen: function (r) { return mixGen(r, ['a/b*c', 'a*b/c', 'a/(b*c)', 'a*(b/c)', 'a/b*c/d'], 600) } },
    { id: 'mix03', ar: 'mix', g: 5, nm: '덧셈·뺄셈·곱셈이 섞인 식', de: '곱셈을 먼저, ( ) 안을 먼저', gen: function (r) { return mixGen(r, ['a+b*c', 'a-b*c', 'a*b-c', '(a+b)*c', 'a*(b-c)', 'a+b*c-d', '(a-b)*c+d', 'a*b+c*d'], 999) } },
    { id: 'mix04', ar: 'mix', g: 5, nm: '덧셈·뺄셈·나눗셈이 섞인 식', de: '나눗셈을 먼저, ( ) 안을 먼저', gen: function (r) { return mixGen(r, ['a+b/c', 'a-b/c', 'a/b+c', '(a+b)/c', 'a/(b-c)', 'a+b/c-d', 'a-(b+c)/d'], 300) } },
    { id: 'mix05', ar: 'mix', g: 5, nm: '덧셈·뺄셈·곱셈·나눗셈이 섞인 식', de: '곱셈·나눗셈 먼저, ( ) 안을 먼저', gen: function (r) { return mixGen(r, ['a+b*c-d/e', 'a*b-c/d+e', '(a+b)*c-d/e', 'a-b/c*d', 'a/b+c*d-e', 'a*(b+c)-d/e', '(a-b)/c+d*e'], 999) } },

    /* ── 약수와 배수 ── */
    { id: 'fac01', ar: 'factor', g: 5, nm: '약수 모두 구하기', de: '어떤 수를 나누어떨어지게 하는 수', ask: 'list', gen: function (r) { var n = until(r, function () { return ri(r, 6, 72) }, function (n) { return fl(n).length >= 4 }); return { txt: [N(n), '의 약수를 모두 쓰세요.'], a: { t: 'list', v: fl(n) } } } },
    { id: 'fac02', ar: 'factor', g: 5, nm: '배수 구하기', de: '작은 수부터 차례로 5개', ask: 'list', gen: function (r) { var n = ri(r, 2, 15); return { txt: [N(n), '의 배수를 작은 수부터 5개 쓰세요.'], a: { t: 'list', v: [n, n * 2, n * 3, n * 4, n * 5] } } } },
    { id: 'fac03', ar: 'factor', g: 5, nm: '공약수 모두 구하기', de: '두 수의 공통인 약수', ask: 'list', gen: function (r) { var x = until(r, function () { var g = ri(r, 2, 12); return [g * ri(r, 1, 6), g * ri(r, 1, 6)] }, function (x) { return x[0] !== x[1] && x[0] > 3 && x[1] > 3 && x[0] <= 60 && x[1] <= 60 && fl(gcd(x[0], x[1])).length >= 2 }); return { txt: [N(x[0]), wa(x[0]), N(x[1]), '의 공약수를 모두 쓰세요.'], a: { t: 'list', v: fl(gcd(x[0], x[1])) } } } },
    { id: 'fac04', ar: 'factor', g: 5, nm: '최대공약수', de: '두 수의 공약수 중 가장 큰 수', gen: function (r) { var x = until(r, function () { var g = ri(r, 2, 15); return [g * ri(r, 1, 7), g * ri(r, 1, 7)] }, function (x) { return x[0] !== x[1] && x[0] > 3 && x[1] > 3 && x[0] <= 90 && x[1] <= 90 }); return { txt: [N(x[0]), wa(x[0]), N(x[1]), '의 최대공약수'], a: An(gcd(x[0], x[1])) } } },
    { id: 'fac05', ar: 'factor', g: 5, nm: '최소공배수', de: '두 수의 공배수 중 가장 작은 수', gen: function (r) { var x = until(r, function () { return [ri(r, 2, 20), ri(r, 2, 20)] }, function (x) { return x[0] < x[1] && lcm(x[0], x[1]) <= 150 && lcm(x[0], x[1]) !== x[1] || (x[0] < x[1] && x[1] % x[0] === 0 && r() < .15) }); return { txt: [N(x[0]), wa(x[0]), N(x[1]), '의 최소공배수'], a: An(lcm(x[0], x[1])) } } },
    { id: 'fac06', ar: 'factor', g: 5, nm: '약분하여 기약분수로', de: '분모와 분자를 최대공약수로 나누기', ask: 'simp', gen: function (r) { var x = until(r, function () { var b = irr(r, 2, 12), k = ri(r, 2, 8); return [b[0] * k, b[1] * k] }, function (x) { return x[1] <= 72 }); return { q: [F(x[0], x[1])], a: Af(x[0], x[1], 'simp') } } },
    { id: 'fac07', ar: 'factor', g: 5, nm: '통분하여 크기 비교', de: '분모가 다른 두 분수의 크기 비교', ask: 'cmp', gen: function (r) { var x = until(r, function () { return [irr(r, 2, 12), irr(r, 2, 12)] }, function (x) { return x[0][1] !== x[1][1] && (x[0][0] * x[1][1] !== x[1][0] * x[0][1] || r() < .12) }); return { q: [F(x[0][0], x[0][1]), '○', F(x[1][0], x[1][1])], a: Ac(x[0][0] * x[1][1], x[1][0] * x[0][1]) } } },

    /* ── 분수 ── */
    { id: 'fr01', ar: 'frac', g: 3, nm: '분모가 같은 분수의 크기 비교', de: '분자가 클수록 큰 분수', ask: 'cmp', gen: function (r) { var d = ri(r, 3, 15), a = ri(r, 1, d - 1), b = r() < .1 ? a : ri(r, 1, d - 1); return { q: [F(a, d), '○', F(b, d)], a: Ac(a, b) } } },
    { id: 'fr02', ar: 'frac', g: 3, nm: '단위분수의 크기 비교', de: '분모가 작을수록 큰 단위분수', ask: 'cmp', gen: function (r) { var a = ri(r, 2, 15), b = until(r, function () { return ri(r, 2, 15) }, function (b) { return b !== a }); return { q: [F(1, a), '○', F(1, b)], a: Ac(b, a) } } },
    { id: 'fr03', ar: 'frac', g: 4, nm: '가분수를 대분수로', de: '7/3 = 2와 1/3', ask: 'mixed', gen: function (r) { var d = ri(r, 2, 12), w = ri(r, 1, 6), m = ri(r, 1, d - 1); return { q: [F(w * d + m, d), '='], a: { t: 'f', n: w * d + m, d: d, form: 'mixed' } } } },
    { id: 'fr04', ar: 'frac', g: 4, nm: '대분수를 가분수로', de: '2와 1/3 = 7/3', ask: 'improper', gen: function (r) { var d = ri(r, 2, 12), w = ri(r, 1, 6), m = ri(r, 1, d - 1); return { q: [F(m, d, w), '='], a: { t: 'f', n: w * d + m, d: d, form: 'improper' } } } },
    { id: 'fr05', ar: 'frac', g: 4, nm: '분모가 같은 진분수의 덧셈', de: '분모는 그대로, 분자끼리 더하기', gen: function (r) { var d = ri(r, 3, 15), a = ri(r, 1, d - 1), b = ri(r, 1, d - 1); return { q: [F(a, d), '+', F(b, d)], a: Af(a + b, d) } } },
    { id: 'fr06', ar: 'frac', g: 4, nm: '분모가 같은 진분수의 뺄셈', de: '분모는 그대로, 분자끼리 빼기, 1−(분수)', gen: function (r) { var d = ri(r, 3, 15), a = ri(r, 2, d - 1), b = ri(r, 1, a - 1); return r() < .25 ? { q: [N(1), '−', F(b, d)], a: Af(d - b, d) } : { q: [F(a, d), '−', F(b, d)], a: Af(a - b, d) } } },
    { id: 'fr07', ar: 'frac', g: 4, nm: '분모가 같은 대분수의 덧셈', de: '자연수끼리, 분수끼리 더하기', gen: function (r) { var d = ri(r, 3, 12), a = ri(r, 1, d - 1), b = ri(r, 1, d - 1), w1 = ri(r, 1, 6), w2 = ri(r, 1, 6); return { q: [F(a, d, w1), '+', F(b, d, w2)], a: Af((w1 + w2) * d + a + b, d) } } },
    { id: 'fr08', ar: 'frac', g: 4, nm: '분모가 같은 대분수의 뺄셈', de: '받아내림이 있는 뺄셈, (자연수)−(대분수)', gen: function (r) { return until(r, function () { var d = ri(r, 3, 12), a = ri(r, 1, d - 1), b = ri(r, 1, d - 1), w1 = ri(r, 2, 8), w2 = ri(r, 1, w1 - 1), k = r();
      if (k < .25) return { q: [N(w1), '−', F(b, d, w2)], a: Af(w1 * d - w2 * d - b, d) };
      return { q: [F(a, d, w1), '−', F(b, d, w2)], a: Af(w1 * d + a - w2 * d - b, d) } }, function (x) { return x.a.n > 0 }) } },
    { id: 'fr09', ar: 'frac', g: 5, nm: '분모가 다른 진분수의 덧셈', de: '통분하여 더하고 약분하기', ask: 'simp', gen: function (r) { var x = until(r, function () { return [irr(r, 2, 12), irr(r, 2, 12)] }, function (x) { return x[0][1] !== x[1][1] && lcm(x[0][1], x[1][1]) <= 60 }); return { q: [F(x[0][0], x[0][1]), '+', F(x[1][0], x[1][1])], a: Af(x[0][0] * x[1][1] + x[1][0] * x[0][1], x[0][1] * x[1][1], 'simp') } } },
    { id: 'fr10', ar: 'frac', g: 5, nm: '분모가 다른 진분수의 뺄셈', de: '통분하여 빼고 약분하기', ask: 'simp', gen: function (r) { var x = until(r, function () { return [irr(r, 2, 12), irr(r, 2, 12)] }, function (x) { return x[0][1] !== x[1][1] && lcm(x[0][1], x[1][1]) <= 60 && x[0][0] * x[1][1] > x[1][0] * x[0][1] }); return { q: [F(x[0][0], x[0][1]), '−', F(x[1][0], x[1][1])], a: Af(x[0][0] * x[1][1] - x[1][0] * x[0][1], x[0][1] * x[1][1], 'simp') } } },
    { id: 'fr11', ar: 'frac', g: 5, nm: '분모가 다른 대분수의 덧셈과 뺄셈', de: '통분한 뒤 자연수끼리, 분수끼리', ask: 'simp', gen: function (r) { return until(r, function () { var p = irr(r, 2, 10), q = irr(r, 2, 10), w1 = ri(r, 1, 6), w2 = ri(r, 1, 6), o = pick(r, ['+', '−']);
      var A = (w1 * p[1] + p[0]) * q[1], C = (w2 * q[1] + q[0]) * p[1], dd = p[1] * q[1];
      return { q: [F(p[0], p[1], w1), o, F(q[0], q[1], w2)], a: Af(o === '+' ? A + C : A - C, dd, 'simp'), _ok: p[1] !== q[1] && lcm(p[1], q[1]) <= 40 && (o === '+' || A > C) } }, function (x) { return x._ok }) } },
    { id: 'fr12', ar: 'frac', g: 5, nm: '(분수)×(자연수)', de: '(진분수)×(자연수), (대분수)×(자연수)', ask: 'simp', gen: function (r) { var p = irr(r, 2, 12), k = ri(r, 2, 9), w = r() < .3 ? ri(r, 1, 3) : 0; return { q: [F(p[0], p[1], w), '×', N(k)], a: Af((w * p[1] + p[0]) * k, p[1], 'simp') } } },
    { id: 'fr13', ar: 'frac', g: 5, nm: '(자연수)×(분수)', de: '(자연수)×(진분수), (자연수)×(대분수)', ask: 'simp', gen: function (r) { var p = irr(r, 2, 12), k = ri(r, 2, 9), w = r() < .3 ? ri(r, 1, 3) : 0; return { q: [N(k), '×', F(p[0], p[1], w)], a: Af((w * p[1] + p[0]) * k, p[1], 'simp') } } },
    { id: 'fr14', ar: 'frac', g: 5, nm: '(분수)×(분수)', de: '진분수끼리, 대분수가 있는 곱셈', ask: 'simp', gen: function (r) { var p = irr(r, 2, 10), q = irr(r, 2, 10), w1 = r() < .3 ? ri(r, 1, 3) : 0, w2 = w1 ? 0 : r() < .2 ? ri(r, 1, 2) : 0; return { q: [F(p[0], p[1], w1), '×', F(q[0], q[1], w2)], a: Af((w1 * p[1] + p[0]) * (w2 * q[1] + q[0]), p[1] * q[1], 'simp') } } },
    { id: 'fr15', ar: 'frac', g: 6, nm: '(자연수)÷(자연수)의 몫을 분수로', de: '3÷4 = 3/4, 7÷3', ask: 'simp', gen: function (r) { var x = until(r, function () { return [ri(r, 1, 20), ri(r, 2, 9)] }, function (x) { return x[0] % x[1] }); return { q: [N(x[0]), '÷', N(x[1])], a: Af(x[0], x[1], 'simp') } } },
    { id: 'fr16', ar: 'frac', g: 6, nm: '(분수)÷(자연수)', de: '(진분수)÷(자연수), (대분수)÷(자연수)', ask: 'simp', gen: function (r) { var p = irr(r, 2, 12), k = ri(r, 2, 9), w = r() < .3 ? ri(r, 1, 3) : 0; return { q: [F(p[0], p[1], w), '÷', N(k)], a: Af(w * p[1] + p[0], p[1] * k, 'simp') } } },
    { id: 'fr17', ar: 'frac', g: 6, nm: '분모가 같은 (분수)÷(분수)', de: '분자끼리 나누기', ask: 'simp', gen: function (r) { var d = ri(r, 3, 15), a = ri(r, 1, d - 1), b = until(r, function () { return ri(r, 1, d - 1) }, function (b) { return b !== a }); return { q: [F(a, d), '÷', F(b, d)], a: Af(a, b, 'simp') } } },
    { id: 'fr18', ar: 'frac', g: 6, nm: '(분수)÷(분수), (자연수)÷(분수)', de: '나누는 분수의 분모와 분자를 바꾸어 곱하기', ask: 'simp', gen: function (r) { var q = irr(r, 2, 10), k = r();
      if (k < .3) { var n = ri(r, 2, 9); return { q: [N(n), '÷', F(q[0], q[1])], a: Af(n * q[1], q[0], 'simp') } }
      var p = until(r, function () { return prop(r, 2, 10) }, function (p) { return p[1] !== q[1] }), w = k > .8 ? ri(r, 1, 2) : 0;
      return { q: [F(p[0], p[1], w), '÷', F(q[0], q[1])], a: Af((w * p[1] + p[0]) * q[1], p[1] * q[0], 'simp') } } },

    /* ── 소수 ── */
    { id: 'de01', ar: 'dec', g: 3, nm: '소수 한 자리 수의 크기 비교', de: '0.1이 몇 개인지 비교하기', ask: 'cmp', gen: function (r) { var a = nz(r, 1, 99), b = r() < .4 ? Math.floor(a / 10) * 10 + nz(r, 1, 9) : nz(r, 1, 99); return { q: [D(a, 1), '○', D(b, 1)], a: Ac(a, b) } } },
    { id: 'de02', ar: 'dec', g: 4, nm: '소수 두·세 자리 수의 크기 비교', de: '0.35와 0.4, 1.257과 1.26', ask: 'cmp', gen: function (r) { var p1 = ri(r, 1, 3), p2 = ri(r, 1, 3), a = nz(r, P10[p1 - 1] + 1, 5 * P10[p1]), b, x;
      b = until(r, function () { return nz(r, P10[p2 - 1] + 1, 5 * P10[p2]) }, function (b) { var c = dcmp(a, p1, b, p2); return p1 !== p2 || Math.abs(c) < P10[Math.max(p1, p2)] }); return { q: [D(a, p1), '○', D(b, p2)], a: (x = dcmp(a, p1, b, p2), { t: 'cmp', v: x < 0 ? '<' : x > 0 ? '>' : '=' }) } } },
    { id: 'de03', ar: 'dec', g: 4, nm: '분수를 소수로 (분모 10·100·1000)', de: '7/10 = 0.7, 23/100 = 0.23', gen: function (r) { var p = ri(r, 1, 3), n = nz(r, 1, P10[p] * 2 - 1); return { q: [F(n, P10[p]), '='], a: Ad(n, p) } } },
    { id: 'de04', ar: 'dec', g: 4, nm: '소수 한 자리 수의 덧셈', de: '0.6+0.8, 3.7+2.5', v: 1, gen: function (r) { var a = nz(r, 1, 199), b = nz(r, 1, 199); return { q: [D(a, 1), '+', D(b, 1)], a: Ad(a + b, 1), v: 1 } } },
    { id: 'de05', ar: 'dec', g: 4, nm: '소수 한 자리 수의 뺄셈', de: '1.2−0.5, 6.3−2.8', v: 1, gen: function (r) { var x = until(r, function () { return [nz(r, 5, 199), nz(r, 1, 150)] }, function (x) { return x[0] > x[1] }); return { q: [D(x[0], 1), '−', D(x[1], 1)], a: Ad(x[0] - x[1], 1), v: 1 } } },
    { id: 'de06', ar: 'dec', g: 4, nm: '소수 두 자리 수의 덧셈', de: '0.47+0.85, 2.36+1.59', v: 1, gen: function (r) { var a = nz(r, 11, 999), b = nz(r, 11, 999); return { q: [D(a, 2), '+', D(b, 2)], a: Ad(a + b, 2), v: 1 } } },
    { id: 'de07', ar: 'dec', g: 4, nm: '소수 두 자리 수의 뺄셈', de: '1.25−0.68, 5.03−2.47', v: 1, gen: function (r) { var x = until(r, function () { return [nz(r, 50, 999), nz(r, 11, 800)] }, function (x) { return x[0] > x[1] }); return { q: [D(x[0], 2), '−', D(x[1], 2)], a: Ad(x[0] - x[1], 2), v: 1 } } },
    { id: 'de08', ar: 'dec', g: 4, nm: '자릿수가 다른 소수의 덧셈과 뺄셈', de: '3.5+1.27, 4−1.35', v: 1, gen: function (r) { return until(r, function () { var o = pick(r, ['+', '−']), k = r(), a, ap, b, bp;
      if (k < .2 && o === '−') { a = ri(r, 2, 9) * 100; ap = 2; b = nz(r, 11, a - 1); bp = 2 } else { ap = 1; a = nz(r, 3, 120); bp = 2; b = nz(r, 11, 999); if (r() < .5) { var t = a; a = b; b = t; t = ap; ap = bp; bp = t } }
      var A = a * P10[2 - ap], C = b * P10[2 - bp]; return { q: [D(a, ap), o, D(b, bp)], a: Ad(o === '+' ? A + C : A - C, 2), v: 1, _ok: o === '+' || A > C } }, function (x) { return x._ok }) } },
    { id: 'de09', ar: 'dec', g: 5, nm: '(소수)×(자연수)', de: '0.6×4, 1.25×3', gen: function (r) { var p = ri(r, 1, 2), a = nz(r, 2, p === 1 ? 99 : 499), k = ri(r, 2, 9); return { q: [D(a, p), '×', N(k)], a: Ad(a * k, p) } } },
    { id: 'de10', ar: 'dec', g: 5, nm: '(자연수)×(소수)', de: '3×0.7, 12×1.5', gen: function (r) { var p = ri(r, 1, 2), a = nz(r, 2, p === 1 ? 99 : 299), k = ri(r, 2, 15); return { q: [N(k), '×', D(a, p)], a: Ad(a * k, p) } } },
    { id: 'de11', ar: 'dec', g: 5, nm: '(소수)×(소수)', de: '0.3×0.7, 1.4×2.5, 0.25×0.6', gen: function (r) { var p1 = ri(r, 1, 2), p2 = p1 === 2 ? 1 : ri(r, 1, 2), a = nz(r, 2, p1 === 1 ? 59 : 199), b = nz(r, 2, 59); return { q: [D(a, p1), '×', D(b, p2)], a: Ad(a * b, p1 + p2) } } },
    { id: 'de12', ar: 'dec', g: 5, nm: '10·100·1000배와 0.1·0.01배', de: '소수점이 옮겨지는 곱셈', gen: function (r) { var p = ri(r, 1, 3), a = nz(r, 2, 9999), e = ri(r, 1, 3); if (r() < .5) return { q: [D(a, p), '×', N(P10[e])], a: Ad(a * P10[e], p) }; return { q: [D(a, p > 1 ? p - 1 : 0), '×', D(1, e)], a: Ad(a, (p > 1 ? p - 1 : 0) + e) } } },
    { id: 'de13', ar: 'dec', g: 6, nm: '(소수)÷(자연수), (자연수)÷(자연수)를 소수로', de: '7.2÷3, 3÷4 = 0.75', gen: function (r) { if (r() < .3) { var k = pick(r, [2, 4, 5, 8]), a = until(r, function () { return ri(r, 1, 30) }, function (a) { return a % k }); var e = { 2: 1, 4: 2, 5: 1, 8: 3 }[k]; return { q: [N(a), '÷', N(k)], a: Ad(a * P10[e] / k, e) } }
      var p = ri(r, 1, 2), q = nz(r, 2, p === 1 ? 99 : 299), b = ri(r, 2, 9); return { q: [D(q * b, p), '÷', N(b)], a: Ad(q, p) } } },
    { id: 'de14', ar: 'dec', g: 6, nm: '(소수)÷(소수)', de: '7.2÷0.8, 5.25÷0.75', gen: function (r) { var p = ri(r, 1, 2), b = nz(r, 2, p === 1 ? 49 : 299), q = ri(r, 2, 15); return { q: [D(b * q, p), '÷', D(b, p)], a: An(q) } } },
    { id: 'de15', ar: 'dec', g: 6, nm: '(자연수)÷(소수)', de: '6÷1.5, 9÷0.3', gen: function (r) { return until(r, function () { var p = ri(r, 1, 2), b = nz(r, 2, p === 1 ? 49 : 99), q = ri(r, 2, 40); return { q: [N(b * q / P10[p]), '÷', D(b, p)], a: An(q), _ok: (b * q) % P10[p] === 0 && b * q / P10[p] <= 60 } }, function (x) { return x._ok }) } },
    { id: 'de16', ar: 'dec', g: 5, nm: '분수를 소수로 (분모 2·4·5·8·20·25)', de: '3/4 = 0.75, 7/20 = 0.35', gen: function (r) { var d = pick(r, [2, 4, 5, 8, 20, 25, 50]), n = until(r, function () { return ri(r, 1, d - 1) }, function (n) { return gcd(n, d) === 1 }), e = 0; while ((n * P10[e]) % d) e++; return { q: [F(n, d), '='], a: Ad(n * P10[e] / d, e) } } }
  ];
  function wa(n) { var d = n % 10; return d === 2 || d === 4 || d === 5 || d === 9 ? '와 ' : '과 ' }   // 수를 읽은 끝소리에 맞는 조사(10·20…은 '십'으로 끝남 → 과)
  function fl(n) { var o = []; for (var i = 1; i <= n; i++) if (n % i === 0) o.push(i); return o }

  var BY = {}; S.forEach(function (s, i) { s.i = i; s.ask = s.ask || 'calc'; BY[s.id] = s });

  /* ── 급수 시험 — 연습용으로 정한 12단계(교과서 차례를 참고) ── */
  var LV = [
    { id: 12, nm: '12급', lv: '1학년 수준 ①', k: ['add01', 'add02', 'sub01', 'sub02', 'add06'] },
    { id: 11, nm: '11급', lv: '1학년 수준 ②', k: ['add03', 'sub03', 'add04', 'sub04', 'add05', 'sub05', 'sub06'] },
    { id: 10, nm: '10급', lv: '2학년 수준 ①', k: ['add07', 'add08', 'add09', 'sub07', 'sub08', 'sub09', 'add10', 'sub10'] },
    { id: 9, nm: '9급', lv: '2학년 수준 ②', k: ['mul01', 'mul02', 'mul03', 'mul04', 'mul05', 'mul06', 'mul07'] },
    { id: 8, nm: '8급', lv: '3학년 수준 ①', k: ['add11', 'add12', 'sub11', 'sub12', 'div01', 'div02', 'mul08', 'mul09', 'mul10'] },
    { id: 7, nm: '7급', lv: '3학년 수준 ②', k: ['mul11', 'mul12', 'mul13', 'div03', 'div04', 'div05', 'div06', 'div07', 'fr01', 'fr02', 'de01'] },
    { id: 6, nm: '6급', lv: '4학년 수준 ①', k: ['mul14', 'mul15', 'div08', 'div09', 'div10', 'div11', 'add13', 'sub13'] },
    { id: 5, nm: '5급', lv: '4학년 수준 ②', k: ['fr03', 'fr04', 'fr05', 'fr06', 'fr07', 'fr08', 'de02', 'de03', 'de04', 'de05', 'de06', 'de07', 'de08'] },
    { id: 4, nm: '4급', lv: '5학년 수준 ①', k: ['mix01', 'mix02', 'mix03', 'mix04', 'mix05', 'fac01', 'fac03', 'fac04', 'fac05', 'fac06', 'fac07'] },
    { id: 3, nm: '3급', lv: '5학년 수준 ②', k: ['fr09', 'fr10', 'fr11', 'fr12', 'fr13', 'fr14', 'de09', 'de10', 'de11', 'de12', 'de16'] },
    { id: 2, nm: '2급', lv: '6학년 수준 ①', k: ['fr15', 'fr16', 'fr17', 'fr18', 'de13', 'de14', 'de15'] },
    { id: 1, nm: '1급', lv: '6학년 수준 ② · 모두 섞어서', k: ['mul14', 'div11', 'mix05', 'fac04', 'fac05', 'fr11', 'fr14', 'fr18', 'de08', 'de11', 'de14', 'de15'] }
  ];
  var EXAM = { n: 20, pass: 16, rounds: 20 };

  /* ── 문제 만들기 ── */
  function key(p) { return JSON.stringify(p.q || p.txt) }
  function gen(id, seed) { var s = BY[id], p = s.gen(rng(seed)); delete p._v; delete p._o; delete p._ok; p.s = id; return p }
  function wsCount(s) { return s.ask === 'list' || s.ar === 'factor' && s.id !== 'fac06' && s.id !== 'fac07' ? 10 : s.v ? 12 : s.ar === 'frac' || /fac0[67]|de03|de16/.test(s.id) ? 16 : 20 }
  function set(id, seed, n) {   // 같은 문제가 겹치지 않게 n개
    var r = rng(seed), out = [], seen = {};
    for (var i = 0; out.length < n && i < n * 40; i++) { var p = gen(id, Math.floor(r() * 4294967296)), k = key(p); if (seen[k] && i < n * 30) continue; seen[k] = 1; out.push(p) }
    return out;
  }
  function sheet(id, no) { return set(id, id + '#ws' + no, wsCount(BY[id])) }
  function exam(lv, no) {
    var L = LV.filter(function (x) { return x.id === lv })[0], r = rng('lv' + lv + '#' + no), out = [], seen = {}, ks = L.k.slice();
    // 단계를 고르게: 섞은 차례대로 돌아가며
    for (var i = ks.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)), t = ks[i]; ks[i] = ks[j]; ks[j] = t }
    for (var i = 0; out.length < EXAM.n && i < 2000; i++) { var p = gen(ks[out.length % ks.length], Math.floor(r() * 4294967296)), k = key(p); if (seen[k]) continue; seen[k] = 1; out.push(p) }
    // 쉬운 것부터: 단계 차례로 정렬
    return out.sort(function (a, b) { return BY[a.s].i - BY[b.s].i });
  }

  /* ── 답 확인 ── */
  function pInt(s) { s = String(s == null ? '' : s).replace(/[\s,]/g, ''); return /^\d+$/.test(s) ? parseInt(s, 10) : null }
  function pDec(s) {  // '1.25' → {v:125,p:2}
    s = String(s == null ? '' : s).replace(/\s/g, '').replace(/,/g, '.'); var m = /^(\d*)(?:\.(\d*))?$/.exec(s); if (!m || (m[1] === '' && !m[2])) return null;
    var f = m[2] || ''; return { v: parseInt((m[1] || '0') + f, 10), p: f.length };
  }
  /* inp: n→문자열, qr→[몫,나머지], f→[자연수,분자,분모], d→문자열, cmp→'<'…, list→문자열
     → {ok:true} | {ok:false, near:'값은 맞아요 …'} | {ok:false, empty:true} */
  function judge(a, inp) {
    if (a.t === 'n') { var v = pInt(inp); return v === null ? { ok: false, empty: !String(inp || '').trim() } : { ok: v === a.v } }
    if (a.t === 'qr') { var q = pInt(inp[0]), r = pInt(inp[1]); if (q === null || r === null) return { ok: false, empty: q === null && r === null }; return { ok: q === a.q && r === a.r } }
    if (a.t === 'd') { var d = pDec(inp); if (!d) return { ok: false, empty: !String(inp || '').trim() }; return { ok: dcmp(d.v, d.p, a.v, a.p) === 0 } }
    if (a.t === 'cmp') return { ok: inp === a.v, empty: !inp };
    if (a.t === 'list') { var xs = String(inp || '').split(/[^\d]+/).filter(Boolean).map(Number); if (!xs.length) return { ok: false, empty: true };
      var u = xs.filter(function (x, i) { return xs.indexOf(x) === i }).sort(function (x, y) { return x - y }); var ok = u.length === a.v.length && u.every(function (x, i) { return x === a.v[i] });
      if (!ok && u.every(function (x) { return a.v.indexOf(x) >= 0 })) return { ok: false, near: '쓴 수는 모두 맞아요. 빠진 수가 있어요.' }; return { ok: ok } }
    if (a.t === 'f') {
      var w = String(inp[0] || '').trim(), n = String(inp[1] || '').trim(), dd = String(inp[2] || '').trim();
      if (!w && !n && !dd) return { ok: false, empty: true };
      var W = w ? pInt(w) : 0, Nn = n ? pInt(n) : null, Dd = dd ? pInt(dd) : null;
      if (W === null) return { ok: false };
      if (Nn === null && Dd === null) { // 자연수만 씀
        if (n || dd) return { ok: false };
        var okI = W * a.d === a.n; if (okI && a.form === 'improper') return { ok: false, near: '값은 맞아요. 가분수로 나타내 보세요.' }; return { ok: okI } }
      if (Nn === null || Dd === null || Dd === 0) return { ok: false, near: '분자와 분모를 모두 써요.' };
      var top = W * Dd + Nn, same = top * a.d === a.n * Dd;
      if (!same) return { ok: false };
      if (a.form === 'mixed' && (W === 0 || Nn >= Dd)) return { ok: false, near: '값은 맞아요. 대분수(자연수와 진분수)로 나타내 보세요.' };
      if (a.form === 'improper' && W) return { ok: false, near: '값은 맞아요. 가분수로 나타내 보세요.' };
      if (a.form === 'simp' && (gcd(Nn, Dd) !== 1 || (Nn % Dd === 0 && Nn))) return { ok: false, near: '값은 맞아요. 약분해서 기약분수로 나타내 보세요.' };
      if (a.form === 'simp' && W && Nn >= Dd) return { ok: false, near: '값은 맞아요. 대분수의 분수 부분은 진분수로 써요.' };
      return { ok: true };
    }
    return { ok: false };
  }
  /* 정답을 입력 꼴로(점검·정답 보기에 씀) */
  function canon(a) {
    if (a.t === 'n') return String(a.v);
    if (a.t === 'qr') return [String(a.q), String(a.r)];
    if (a.t === 'd') return dstr(a.v, a.p);
    if (a.t === 'cmp') return a.v;
    if (a.t === 'list') return a.v.join(', ');
    if (a.t === 'f') { if (a.n % a.d === 0) return [String(a.n / a.d), '', '']; if (a.form === 'improper' || a.n < a.d) return ['', String(a.n), String(a.d)]; return [String(Math.floor(a.n / a.d)), String(a.n % a.d), String(a.d)] }
  }
  function dstr(v, p) { var s = String(v); if (!p) return s; while (s.length <= p) s = '0' + s; return s.slice(0, s.length - p) + '.' + s.slice(s.length - p) }

  var AR = { AREAS: AREAS, S: S, BY: BY, LV: LV, EXAM: EXAM, ASK: ASK, gen: gen, set: set, sheet: sheet, exam: exam, wsCount: wsCount, judge: judge, canon: canon, dstr: dstr, rng: rng, gcd: gcd, lcm: lcm, evalTok: evalTok, fl: fl, P10: P10 };
  if (typeof module !== 'undefined' && module.exports) module.exports = AR; else window.AR = AR;
})();
