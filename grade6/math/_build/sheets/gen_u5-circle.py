# -*- coding: utf-8 -*-
"""6-2 수학 5. 원의 둘레와 넓이 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u5-circle.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u5-circle.py tb       # 교과서 차시 버전만

앱 원본 ../units/sem2/u5-circle.tb.js('채안이와 현준이의 수학 체험 마을', 10차시: 1·2·3·4·5·6·7·8~9·10·11)의
LESSONS를 node에서 가짜 DOM으로 그대로 실행해, 단계마다 넘긴 물음·보기·정답·수·그림(SVG)을 모아(_EX) 그대로 씁니다.
그래서 앱의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수·정답이 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.

  - 묻고 답하기(ci6Ask·blanks·quiz·writeStep)는 앱의 물음을 그대로 옮기고, 기본형은 보기 고르기 + 도움 한 줄,
    도전형은 짧은 낱말 보기를 빈칸으로 바꾸고 앱의 도전 문제(challenge)와 '까닭 쓰기'를 더합니다.
  - 조작 활동(원 찾기·바퀴·원 굴리기·물레방아·지름 맞추기·정사각형 그리기·모눈 칠하기·자르기·옮기기·문제 만들기·땅따먹기)은
    앱의 처음 그림을 그대로 넣고(ci6Cut은 '이어 붙이기'를 눌러 끝난 모양) 종이에서 할 수 있는 말로 바꿉니다.
  - 학생이 재거나 그리는 그림은 **실제 크기**(SVG 1 cm = 40 px, 그림 너비 mm = px ÷ 4, 100%로 인쇄):
    1차시 도전(끈 24 cm로 만든 세 도형과 1 cm 간격 점), 2차시 반지름 1 cm인 원과 cm 수직선, 3차시 양초(지름 7 cm),
    5차시 모눈(한 칸 1 cm), 6차시 16등분한 원(반지름 4 cm), 10차시 놀이판(16 cm × 12 cm 모눈).
  - 바둑돌 수·모눈 칸 수·원의 넓이는 앱의 함수(ci6String의 셈, ci6GridCount·ci6GridTruth, ci6Area)로 구한 값을 쓰고,
    파이썬으로 따로 다시 계산해 assert로 맞춥니다.
  - 이야기 버전(ST)은 아직 없어서 건너뜁니다(앱 원본 u5-circle.st.js가 생기면 ST 목록에 더함).
그림은 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""

_EX = r'''// 앱 원본(u5-circle.tb.js)을 가짜 DOM에서 실행해 차시·단계·물음·보기·정답·그림(SVG)을 모읍니다.
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const FONT = process.argv[3];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = {}; this.kids = []; this._t = ''; this.style = {}; this.dataset = {}; this.nodeType = 1; this.parent = null;
    this.classList = { add() {}, remove() {}, toggle() {}, contains() { return false; } }; if (a) for (const [k, v] of Object.entries(a)) this.setAttribute(k, v); }
  append(...k) { for (const x of k.flat(9)) if (x != null && x !== false) { if (x instanceof El) x.parent = this; this.kids.push(x); } }
  appendChild(x) { this.append(x); return x; }
  prepend(...k) { this.kids.unshift(...k); }
  before() {} after() {}
  remove() { if (this.parent) this.parent.kids = this.parent.kids.filter(k => k !== this); }
  setAttribute(k, v) { if (typeof v === 'function') { (this.on = this.on || {})[k] = v; } else this.a[k] = v; }
  getAttribute(k) { return this.a[k]; }
  removeAttribute(k) { delete this.a[k]; }
  get children() { return this.kids.filter(k => k instanceof El); }
  get lastChild() { return this.kids[this.kids.length - 1]; }
  get firstChild() { return this.kids[0]; }
  set textContent(v) { this.kids = []; this._t = String(v); }
  get textContent() { return this._t + this.kids.map(k => k instanceof El ? k.textContent : String(k)).join(''); }
  set innerHTML(v) { this.kids = []; this._t = ''; }
  set value(v) { this.a.value = v; } get value() { return this.a.value || ''; }
  addEventListener() {} removeEventListener() {} focus() {} scrollIntoView() {}
  closest() { return null; }
  querySelector() { return null; } querySelectorAll() { return []; }
  getBBox() { return { x: 0, y: 0, width: 10, height: 10 }; }
  toString() {
    const a = Object.assign({}, this.a);
    if (this.tag === 'svg') { a.xmlns = 'http://www.w3.org/2000/svg'; delete a.class; delete a.role; }
    for (const k of Object.keys(a)) if (k.startsWith('on') || k === 'pointer-events' || k === 'aria-label') delete a[k];
    const at = Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this._t)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
const document = { createElement: t => new El(t), createElementNS: (n, t) => new El(t), head: { append() {} }, body: new El('body') };
const performance = { now: () => 0 }, requestAnimationFrame = cb => { cb(1e9); return 0; }, setTimeout = () => 0, window = {};
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const plain = a && !(a instanceof El) && typeof a === 'object' && !Array.isArray(a); const e = new El(t, plain ? a : {}); if (!plain && a != null) e.append(a); e.append(...k); return e; };
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function makeSvg(w, hgt, grid) {
  const s = svgEl('svg', { viewBox: `0 0 ${w} ${hgt}` });
  if (grid) { const g = svgEl('g', { stroke: '#DCE4E0', 'stroke-width': 1 }); for (let x = 0; x <= w; x += grid) g.append(svgEl('line', { x1: x, y1: 0, x2: x, y2: hgt })); for (let y = 0; y <= hgt; y += grid) g.append(svgEl('line', { x1: 0, y1: y, x2: w, y2: y })); s.append(g); }
  return s;
}
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
function dragOn() {} function svgPt() { return { x: 0, y: 0 }; }
function sweepTracker() { return { add() {}, full() { return false; }, count() { return 0; }, reset() {} }; }
let REC = [], INNER = 0;
function quiz(b, a, items, opts) { if (!INNER) REC.push({ t: 'quiz', items: items.map(serQ), opts: serOpt(opts) }); }
function blanks(b, a, parts, opts) { if (!INNER) REC.push({ t: 'blanks', parts: parts.map(serPart), opts: serOpt(opts) }); }
function writeStep(b, a, items, opts) { if (!INNER) REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag, ph: x.ph })) }); }

const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
const lesSrc = src.slice(src.indexOf('//@@LESSONS'));
eval((unitSrc + '\n' + lesSrc).replace(/^(const|let) /gm, 'var '));

function findAll(e, f, out) { out = out || []; if (e && typeof e === 'object' && e.kids) { if (f(e)) out.push(e); e.kids.forEach(k => findAll(k, f, out)); } return out; }
function click(root, label) { const b = findAll(root, e => e.tag === 'button' && e.textContent.trim() === label)[0]; if (!b) throw new Error('단추 없음: ' + label); b.on.onclick({ currentTarget: b, target: b }); }
function findSvg(e) { if (!e || typeof e !== 'object') return null; if (e.tag === 'svg') return e; for (const k of e.kids || []) { const r = findSvg(k); if (r) return r; } return null; }
function findTag(e, t, out) { out = out || []; if (e && typeof e === 'object') { if (e.tag === t) out.push(e); (e.kids || []).forEach(k => findTag(k, t, out)); } return out; }
function serEl(v) {
  if (typeof v === 'function') v = v();
  if (!v || typeof v !== 'object') return v == null ? null : { text: String(v) };
  const s = findSvg(v);
  if (s) return { svg: String(s), vb: s.a.viewBox, maxW: s.style.maxWidth || null };
  const tb = findTag(v, 'table');
  if (tb.length) return { table: findTag(tb[0], 'tr').map(tr => tr.children.map(c => c.textContent)) };
  if (v.children && v.children.length > 1) return { lines: v.children.map(c => c.textContent) };
  return { text: v.textContent };
}
function serPart(p) {
  if (typeof p === 'string') return { s: p };
  if (p instanceof El) return { s: p.textContent };
  if (p.o) return { o: p.o, a: p.a, multi: !!p.multi };
  if ('n' in p) return { n: ci6R(p.n) };
  return { s: '' };
}
function serQ(it) { return { q: it.q || null, fig: it.fig ? serEl(it.fig) : null, o: it.o || null, a: it.a, parts: it.parts ? it.parts.map(serPart) : null }; }
function serOpt(o) {
  if (!o) return {};
  const r = {};
  for (const [k, v] of Object.entries(o)) { if (typeof v === 'function' || k === 'ask' || k === 'pieces') continue; try { r[k] = JSON.parse(JSON.stringify(v)); } catch (e) { } }
  return r;
}
ci6Ask = function (host, api, items, opts) { if (!INNER) REC.push({ t: 'ask', items: items.map(serQ), opts: serOpt(opts) }); };
const ORIG = {};
['ci6Scene', 'ci6String', 'ci6Wheel', 'ci6Unroll', 'ci6Lab', 'ci6Roll', 'ci6Diam', 'ci6InOut', 'ci6Grid', 'ci6Cut', 'ci6Move', 'ci6Make', 'ci6Land'].forEach(name => {
  ORIG[name] = eval(name);
  const w = function (body, api, opt) {
    const rec = { t: name, opt: serOpt(opt) };
    const fb = new El('div'); INNER++;
    try { ORIG[name](fb, api, opt); const s = findSvg(fb); if (s) rec.svg = String(s), rec.vb = s.a.viewBox; } catch (e) { rec.err = String(e && e.stack || e).slice(0, 300); }
    if (name === 'ci6String') { rec.counts = {}; for (const nm of ['정삼각형', '정사각형', '원']) { click(fb, nm); const say = findAll(fb, e => e.tag === 'p' && e.a.class === 'ci6read')[0].textContent; rec.counts[nm] = +say.match(/바둑돌이 (\d+)개/)[1]; } }
    if (name === 'ci6Cut') { rec.cuts = {}; for (const n of [8, 16, 32, 64]) { const fb2 = new El('div'); try { ORIG[name](fb2, api, Object.assign({}, opt, { start: n })); click(fb2, '이어 붙이기'); rec.cuts[n] = String(findSvg(fb2)); } catch (e) { rec.err = String(e.stack || e).slice(0, 300); } } }
    INNER--;
    const ask = typeof opt.ask === 'function' ? opt.ask() : opt.ask;
    rec.ask = (ask || []).map(serQ);
    REC.push(rec);
  };
  eval(name + ' = w');
});
ci6Chain = function (body, api, parts) {
  const out = [];
  for (const p of parts) { const save = REC; REC = []; (p.run || p)(new El('div'), api); out.push({ title: p.title || null, recs: REC }); REC = save; }
  REC.push({ t: 'chain', parts: out });
};
const api = new Proxy({}, { get: () => () => {} });
function cap(render) { REC = []; try { render(new El('div'), api); } catch (e) { REC.push({ t: 'error', err: String(e.stack || e).slice(0, 400) }); } return REC; }
const OUT = { story: UNIT_STORY, lessons: LESSONS.map(L => ({ id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(s => ({ name: s.name, inst: s.inst, hints: s.hints || [], recs: cap(s.render) })),
  challenge: L.challenge ? { inst: L.challenge.inst, hints: L.challenge.hints || [], recs: cap(L.challenge.render) } : null })) };
// 활동지에만 쓰는 값(앱의 계산 함수 그대로)
OUT.calc = { grid: Object.fromEntries([4, 5, 7].map(r => [r, Object.assign(ci6GridCount(r), { T: ci6GridTruth(r) })])), area: [1, 2, 3, 4, 5, 6].map(ci6Area), circ: [1, 2, 3, 4, 5, 6].map(r => ci6Circ(2 * r)) };
OUT.figs = {};
[['hexsq1', () => ci6HexSqFig('1 cm')], ['parts', ci6PartsFig]].forEach(([k, f]) => { OUT.figs[k] = serEl(f); });
process.stdout.write(JSON.stringify(OUT));
'''
