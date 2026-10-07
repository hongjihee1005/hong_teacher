/* 기초연산 점검 — node _build/arith/check.js
   모든 단계에서 문제를 많이 만들어
   ① 정답을 따로(분수로 정확하게) 다시 계산해 맞는지 ② 단계 조건(받아올림 여부 등)을 지키는지
   ③ 정답을 넣으면 '맞음', 틀린 답을 넣으면 '틀림'인지 ④ 학습지 30장·급수 시험 12급×20회가 만들어지고 겹치지 않는지
   ⑤ 같은 번호면 같은 문제인지 점검합니다. 하나라도 틀리면 끝 코드 1. */
'use strict';
const A = require('./skills.js');
let bad = 0; const err = (m) => { if (bad++ < 40) console.log('✗', m) };

/* 정확한 분수 계산 */
const g = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a };
const R = (n, d = 1) => { if (d < 0) { n = -n; d = -d } const k = g(n, d) || 1; return [n / k, d / k] };
const add = (x, y) => R(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
const sub = (x, y) => R(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
const mul = (x, y) => R(x[0] * y[0], x[1] * y[1]);
const div = (x, y) => R(x[0] * y[1], x[1] * y[0]);
const eq = (x, y) => x[0] * y[1] === y[0] * x[1];
const val = (t) => t.k === 'n' ? R(t.v) : t.k === 'd' ? R(t.v, 10 ** t.p) : R(t.w * t.d + t.n, t.d);
function ev(toks) {
  const out = [], ops = [], pr = (o) => (o === '×' || o === '÷') ? 2 : 1;
  const ap = () => { const o = ops.pop(), y = out.pop(), x = out.pop(); out.push(o === '+' ? add(x, y) : o === '−' ? sub(x, y) : o === '×' ? mul(x, y) : div(x, y)) };
  for (const k of toks) {
    if (typeof k === 'object') out.push(val(k));
    else if (k === '(') ops.push(k);
    else if (k === ')') { while (ops[ops.length - 1] !== '(') ap(); ops.pop() }
    else { while (ops.length && ops[ops.length - 1] !== '(' && pr(ops[ops.length - 1]) >= pr(k)) ap(); ops.push(k) }
  }
  while (ops.length) ap();
  return out[0];
}
const aval = (a) => a.t === 'n' ? R(a.v) : a.t === 'd' ? R(a.v, 10 ** a.p) : a.t === 'f' ? R(a.n, a.d) : null;

/* 단계 조건 */
const D = (x, i) => Math.floor(x / 10 ** i) % 10;
const car = (a, b) => { let c = 0, k = 0; for (let i = 0; i < 7; i++) { c = D(a, i) + D(b, i) + c >= 10 ? 1 : 0; k += c } return k };
const bor = (a, b) => { let c = 0, k = 0; for (let i = 0; i < 7; i++) { c = D(a, i) - D(b, i) - c < 0 ? 1 : 0; k += c } return k };
const nums = (p) => (p.q || []).filter(t => typeof t === 'object' && t.k === 'n').map(t => t.v);
const C = {
  add01: (p, [a, b]) => a + b <= 10, add03: (p, [a, b]) => a < 10 && b < 10 && a + b > 10,
  add04: (p, [a, b]) => a >= 10 && b < 10 && car(a, b) === 0, add05: (p, [a, b]) => car(a, b) === 0 && a + b < 100,
  add07: (p, [a, b]) => b < 10 && car(a, b) === 1 && a + b < 100, add08: (p, [a, b]) => car(a, b) === 1 && a + b < 100,
  add09: (p, [a, b]) => a < 100 && b < 100 && a + b >= 100, add11: (p, [a, b]) => a >= 100 && b >= 100 && car(a, b) <= 1 && a + b < 1000,
  add12: (p, [a, b]) => a >= 100 && a < 1000 && car(a, b) >= 2, add13: (p, [a, b]) => a >= 1000 && b >= 1000 && car(a, b) >= 2,
  sub01: (p, [a, b]) => a <= 10, sub03: (p, [a, b]) => a > 10 && a < 20 && bor(a, b) === 1, sub04: (p, [a, b]) => bor(a, b) === 0 && b < 10,
  sub05: (p, [a, b]) => bor(a, b) === 0 && b >= 10, sub07: (p, [a, b]) => a % 10 === 0 && b % 10 !== 0,
  sub08: (p, [a, b]) => b < 10 && bor(a, b) === 1, sub09: (p, [a, b]) => b >= 10 && bor(a, b) === 1 && a < 100,
  sub11: (p, [a, b]) => bor(a, b) <= 1 && b >= 100, sub12: (p, [a, b]) => bor(a, b) >= 2 && a < 1000, sub13: (p, [a, b]) => bor(a, b) >= 2 && b >= 1000,
  mul01: (p, [a]) => a === 2 || a === 5, mul02: (p, [a]) => a === 3 || a === 6, mul03: (p, [a]) => a === 4 || a === 8, mul04: (p, [a]) => a === 7 || a === 9,
  mul09: (p, [a, b]) => (a % 10) * b < 10, mul10: (p, [a, b]) => (a % 10) * b >= 10,
  mul13: (p, [a, b]) => a > 10 && a < 100 && b > 10 && b < 100, mul14: (p, [a, b]) => a >= 100 && a < 1000 && b > 10 && b < 100,
  div04: (p, [a, b]) => a < 100 && b < 10, div06: (p, [a, b]) => a >= 100 && a < 1000 && b < 10, div10: (p) => p.a.q < 10, div11: (p) => p.a.q >= 10 && p.a.q < 100,
  fr03: (p) => p.a.n > p.a.d && p.a.n % p.a.d !== 0, fr04: (p) => p.a.n > p.a.d,
  fac06: (p) => p.q[0].n % p.a.n === 0 && p.q[0].d !== p.a.d
};
/* 글 문제(txt) 정답 따로 구하기 */
const divs = (n) => { const o = []; for (let i = 1; i <= n; i++) if (n % i === 0) o.push(i); return o };
const TX = {
  fac01: ([n]) => divs(n), fac02: ([n]) => [1, 2, 3, 4, 5].map(k => k * n),
  fac03: ([a, b]) => divs(a).filter(x => b % x === 0),
  fac04: ([a, b]) => Math.max(...divs(a).filter(x => b % x === 0)),
  fac05: ([a, b]) => { for (let m = 1; ; m++) if (m % a === 0 && m % b === 0) return m }
};

function wrong(a) {   // 틀린 답(입력 꼴)
  if (a.t === 'n') return String(a.v + 1);
  if (a.t === 'qr') return [String(a.q), String(a.r + 1)];
  if (a.t === 'd') return A.dstr(a.v + 1, a.p);
  if (a.t === 'cmp') return a.v === '<' ? '>' : '<';
  if (a.t === 'list') return a.v.slice(0, -1).concat([a.v[a.v.length - 1] + 1]).join(', ');
  if (a.t === 'f') return ['', String(a.n + 1), String(a.d)];
}

function verify(p, where) {
  const s = A.BY[p.s], a = p.a, q = p.q;
  try {
    if (p.txt) {
      const x = TX[p.s](p.txt.filter(t => typeof t === 'object').map(t => t.v));
      if (JSON.stringify(a.t === 'list' ? a.v : a.v) !== JSON.stringify(x)) err(`${where} 글 문제 정답 다름 ${JSON.stringify(p)}`);
    } else if (q.includes('○')) {
      const i = q.indexOf('○'), l = ev(q.slice(0, i)), r = ev(q.slice(i + 1)), c = l[0] * r[1] - r[0] * l[1];
      if ((c < 0 ? '<' : c > 0 ? '>' : '=') !== a.v) err(`${where} 크기 비교 틀림 ${JSON.stringify(p)}`);
    } else if (q.some(t => t && t.k === 'b')) {
      const t = q.map(t => t && t.k === 'b' ? { k: 'n', v: a.v } : t), i = t.indexOf('=');
      if (!eq(ev(t.slice(0, i)), ev(t.slice(i + 1)))) err(`${where} □ 넣으면 식이 안 맞음 ${JSON.stringify(p)}`);
      if (!(a.v >= 0)) err(`${where} □가 음수`);
    } else if (a.t === 'qr') {
      const [x, y] = nums(p);
      if (!(x === y * a.q + a.r && a.r >= 0 && a.r < y)) err(`${where} 몫·나머지 틀림 ${JSON.stringify(p)}`);
    } else {
      const t = q[q.length - 1] === '=' ? q.slice(0, -1) : q, v = ev(t);
      if (!eq(v, aval(a))) err(`${where} 정답 틀림 ${JSON.stringify(p)} → ${v}`);
      if (v[0] < 0) err(`${where} 답이 음수`);
      if (s.ar === 'mix') { // 중간 결과도 자연수
        if (A.evalTok(t) !== a.v) err(`${where} 혼합 계산 중간 결과 문제 ${JSON.stringify(p)}`);
      }
    }
    if (a.t === 'n' && !(Number.isInteger(a.v) && a.v >= 0)) err(`${where} 자연수 답이 아님 ${a.v}`);
    if (a.t === 'f' && ((a.form === 'simp' && g(a.n, a.d) !== 1) || a.n <= 0)) err(`${where} 분수 답이 기약분수가 아님`);
    if (a.t === 'd' && (a.v % 10 === 0 && a.p > 0)) err(`${where} 소수 답 끝자리 0`);
    if (C[p.s] && !C[p.s](p, nums(p))) err(`${where} 단계 조건 어김 ${JSON.stringify(p)}`);
    // 화면 숫자 조건: 문제 속 소수 끝자리 0 없음, 분수는 진분수 부분
    for (const t of q || []) if (t && t.k === 'f' && t.w && t.n >= t.d) err(`${where} 대분수 모양 이상`);
    // ③ 답 확인
    const ok = A.judge(a, A.canon(a)); if (!ok.ok) err(`${where} 정답 입력이 '틀림' ${JSON.stringify(a)} ${JSON.stringify(A.canon(a))}`);
    const no = A.judge(a, wrong(a)); if (no.ok) err(`${where} 틀린 입력이 '맞음' ${JSON.stringify(a)} ${JSON.stringify(wrong(a))}`);
    if (a.t === 'f' && a.form === 'simp' && a.d < 40) { const k = A.judge(a, ['', String(a.n * 2), String(a.d * 2)]); if (k.ok || !k.near) err(`${where} 약분 안 한 답 처리 이상`) }
    if (a.t === 'f' && a.form === 'mixed') { const k = A.judge(a, ['', String(a.n), String(a.d)]); if (k.ok) err(`${where} 대분수 요구인데 가분수가 맞음`) }
    if (a.t === 'f' && a.form === 'improper') { const k = A.judge(a, A.canon({ ...a, form: 'any' })); if (k.ok) err(`${where} 가분수 요구인데 대분수가 맞음`) }
  } catch (e) { err(`${where} 오류 ${e.message} ${JSON.stringify(p)}`) }
}

let total = 0;
for (const s of A.S) {
  const seen = new Set();
  for (let i = 0; i < 400; i++) { const p = A.gen(s.id, s.id + ':' + i); verify(p, s.id + '#' + i); seen.add(JSON.stringify(p.q || p.txt)); total++ }
  const n = A.wsCount(s), space = seen.size;
  for (let w = 1; w <= 30; w++) {
    const ps = A.sheet(s.id, w);
    if (ps.length !== n) err(`${s.id} 학습지 ${w} 문제 수 ${ps.length}`);
    const u = new Set(ps.map(p => JSON.stringify(p.q || p.txt)));
    if (u.size < Math.min(n, space)) err(`${s.id} 학습지 ${w} 겹침 ${u.size}/${n} (만들 수 있는 가짓수 약 ${space})`);
    ps.forEach((p, j) => verify(p, `${s.id} 학습지${w}-${j + 1}`)); total += ps.length;
    if (w === 1 && JSON.stringify(ps) !== JSON.stringify(A.sheet(s.id, 1))) err(`${s.id} 같은 번호인데 다른 문제`);
  }
}
for (const L of A.LV) {
  for (const k of L.k) if (!A.BY[k]) err(`${L.nm} 없는 단계 ${k}`);
  for (let r = 1; r <= A.EXAM.rounds; r++) {
    const ps = A.exam(L.id, r);
    if (ps.length !== A.EXAM.n) err(`${L.nm} ${r}회 문항 수 ${ps.length}`);
    ps.forEach((p, j) => verify(p, `${L.nm} ${r}회-${j + 1}`)); total += ps.length;
  }
}
const ids = A.S.map(s => s.id); if (new Set(ids).size !== ids.length) err('단계 id 겹침');
for (const ar of A.AREAS) if (!A.S.some(s => s.ar === ar.id)) err(`${ar.name} 영역에 단계 없음`);
console.log(bad ? `기초연산 점검 실패 ${bad}건` : `기초연산 점검 통과 — ${A.S.length}단계, 문제 ${total.toLocaleString()}개`);
/* 일일수학: 학년마다 400일 — 날마다 10문제, 겹침 없음, 같은 날이면 같은 문제 */
{
  let dbad = 0;
  for (let g = 1; g <= 6; g++) for (let k = 0; k < 400; k++) {
    const d = new Date(2026, 0, 1 + k), s = d.toISOString().slice(0, 10), ps = A.daily(g, s);
    if (ps.length !== A.DAILY.n || new Set(ps.map(p => JSON.stringify(p.q || p.txt))).size !== ps.length) dbad++;
    if (k < 5 && JSON.stringify(A.daily(g, s)) !== JSON.stringify(ps)) dbad++;
  }
  if (dbad) { console.log('일일수학 점검 실패 ' + dbad); bad++ } else console.log('일일수학 점검 통과 — 6개 학년 × 400일')
}
process.exit(bad ? 1 : 0);

