/* 수학게임 점검 (2026-10-07) — node _build/mathgame/check.js
   ① units.json이 기초연산 98단계를 빠짐없이, 한 번씩만 담는지
   ② 모든 단계에서 무작위 문제 600개씩 보기를 만들어:
      보기 수(4개, 크기 비교는 3개) · 값이 서로 다른지 · 정답이 한 개뿐인지(기초연산 judge로 확인) · 음수·NaN이 없는지
*/
'use strict';
var path = require('path'), fs = require('fs');
var AR = require('../arith/skills.js'), MGC = require('./choices.js');
var U = JSON.parse(fs.readFileSync(path.join(__dirname, 'units.json'), 'utf8'));
var bad = [], seen = {}, N = 600, total = 0;

Object.keys(U).forEach(function (g) {
  U[g].forEach(function (u) {
    if (!u.id || !u.nm || !u.k.length) bad.push(g + '학년 ' + u.id + ': 빈 칸');
    u.k.forEach(function (id) {
      if (!AR.BY[id]) bad.push(g + '학년 ' + u.id + ': 없는 단계 ' + id);
      if (seen[id]) bad.push(id + ': 두 곳에 있음 (' + seen[id] + ', ' + g + '-' + u.id + ')');
      seen[id] = g + '-' + u.id;
    });
  });
});
AR.S.forEach(function (s) { if (!seen[s.id]) bad.push(s.id + ' (' + s.nm + '): 어느 단원에도 없음') });

function num(t) { return typeof t === 'number' && isFinite(t) && t >= 0 }
function okAns(a) {
  if (a.t === 'n') return num(a.v);
  if (a.t === 'd') return num(a.v) && num(a.p);
  if (a.t === 'qr') return num(a.q) && num(a.r);
  if (a.t === 'f') { var s = MGC.fShow(a); return num(a.n) && a.d > 0 && (s.k === 'n' ? num(s.v) : num(s.n) && s.d > 1) }
  if (a.t === 'cmp') return /^[<=>]$/.test(a.v);
  if (a.t === 'list') return a.v.length > 0 && a.v.every(num);
  return false;
}

AR.S.forEach(function (s) {
  var r = AR.rng('mg-check-' + s.id), errs = 0;
  for (var i = 0; i < N && errs < 3; i++) {
    var p = AR.gen(s.id, Math.floor(r() * 4294967296)), c = MGC.choices(p, AR.rng(Math.floor(r() * 4294967296)));
    var want = p.a.t === 'cmp' ? 3 : 4, keys = {}, right = 0, msg = '';
    if (c.opts.length !== want) msg = '보기 ' + c.opts.length + '개';
    c.opts.forEach(function (o, j) {
      if (!okAns(o)) msg = msg || '이상한 보기 ' + JSON.stringify(o);
      var k = MGC.vkey(o); if (keys[k]) msg = msg || '같은 값 보기 ' + k; keys[k] = 1;
      var ok = AR.judge(p.a, AR.canon(o)).ok;
      if (ok) right++;
      if (ok !== (j === c.ok)) msg = msg || (j === c.ok ? '정답 보기가 틀림으로 채점됨' : '오답 보기가 맞음으로 채점됨') + ' ' + JSON.stringify(o);
      if (j !== c.ok && k === MGC.vkey(p.a)) msg = msg || '오답이 정답과 값이 같음';
    });
    if (!msg && right !== 1) msg = '정답 ' + right + '개';
    if (msg) { errs++; bad.push(s.id + ': ' + msg + ' · 문제 ' + JSON.stringify(p.q || p.txt) + ' 답 ' + JSON.stringify(p.a)) }
    total++;
  }
});

if (bad.length) { console.log(bad.slice(0, 40).join('\n')); console.log('수학게임 점검 실패: ' + bad.length + '곳'); process.exit(1) }
console.log('수학게임 점검 통과: 단원 ' + Object.keys(U).reduce(function (a, g) { return a + U[g].length }, 0) + '개 · 단계 ' + AR.S.length + '개 · 보기 ' + total + '묶음');
