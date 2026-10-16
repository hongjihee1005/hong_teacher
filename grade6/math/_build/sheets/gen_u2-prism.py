# -*- coding: utf-8 -*-
"""6-1 수학 2. 각기둥과 각뿔 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u2-prism.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u2-prism.py tb       # 교과서 차시 버전만

앱 원본 ../units/u2-prism.tb.js('연서의 보물 찾기 각기둥과 각뿔', 9차시 묶음: 1·2~3·4·5~6·7·8·9·10·11)의
LESSONS를 node에서 가짜 DOM으로 그대로 실행해(CAP_JS), 활동마다 넘긴 물음·보기·정답·수와 앱이 그린 그림(SVG)을 모읍니다.
그래서 앱의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수·정답이 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.

  - 묻고 답하기(pp6Ask·blanks·quiz·writeStep·sequence)는 앱의 물음을 그대로 옮기고,
    기본형은 보기 고르기 + 도움 한 줄, 도전형은 짧은 낱말 보기를 빈칸 + 낱말 상자로 바꾸고 앱의 도전 문제와 '까닭 쓰기'를 더합니다.
  - 조작 활동은 종이에서 할 수 있게 바꿉니다: 카드 고르기·나누어 담기(pp6Pick·pp6Sort)는 그림 카드 + 기호 쓰기,
    면 색칠하기(pp6Tap)는 꼭짓점 이름이 있는 그림에 색칠하고 면의 이름 쓰기, 모서리·꼭짓점 표시(pp6Parts)·이쑤시개 모형(pp6Skeleton)은 그림에 표시하고 수 쓰기,
    높이 재기(pp6Ruler)는 삼각자를 댄 그림, 펼치기(pp6FoldView)는 접힘 → 펼치는 중 → 다 펼친 그림, 전개도 찾기(pp6NetJudge)는 예상·확인 표,
    놀이(10차시)는 카드 그림 + 연습 표 + 놀이 기록표로 바꿉니다.
  - 모눈에 전개도 그리기(pp6NetDraw)는 **실제 크기**(모눈 한 칸 = 1 cm, SVG 1 cm = 40 px, 그림 너비 mm = px ÷ 4, 100%로 인쇄):
    삼각기둥(3·4·5 cm, 높이 5 cm)·사각기둥(사다리꼴 밑면, 높이 2 cm)의 모눈은 앱의 모눈을 가로 17칸으로 잘라 씁니다.
    육각기둥(옆면 띠가 24 cm)은 A4에 실제 크기로 들어가지 않아 모눈 한 칸을 5 mm로 줄여 그리고 '한 칸을 1 cm로 생각해요'라고 적습니다.
  - 정답의 수(구성 요소의 수·모서리 길이의 합 등)는 식이 적힌 칸은 식을 계산해, 표의 각기둥·각뿔 이름이 있는 줄은
    (면 = □+2 / □+1, 모서리 = □×3 / □×2, 꼭짓점 = □×2 / □+1)로 따로 계산해 assert로 앱의 답과 맞춥니다(check_numbers).
  - 이야기 버전(ST)은 이 단원에 아직 없어서 건너뜁니다(앱 원본 u2-prism.st.js가 생기면 ST 목록에 더함).
그림은 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""

CAP_JS = r'''// 앱 원본(u2-prism.tb.js)을 가짜 DOM에서 실행해 차시·단계·물음·보기·정답·그림(SVG)을 모읍니다.
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const FONT = process.argv[3];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = {}; this.kids = []; this._t = ''; this.style = {}; this.dataset = {}; this.nodeType = 1; this.parent = null; this.isConnected = true; this.ev = {};
    this.classList = { add() {}, remove() {}, toggle() {}, contains() { return false; } }; if (a) for (const [k, v] of Object.entries(a)) this.setAttribute(k, v); }
  append(...k) { for (const x of k.flat(9)) if (x != null && x !== false) { if (x instanceof El) x.parent = this; this.kids.push(x); } }
  appendChild(x) { this.append(x); return x; }
  prepend(...k) { k.forEach(x => { if (x instanceof El) x.parent = this; }); this.kids.unshift(...k); }
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
  addEventListener(t, f) { this.ev[t] = f; } removeEventListener() {} focus() {} scrollIntoView() {} setPointerCapture() {}
  closest() { return null; }
  querySelector() { return null; } querySelectorAll() { return []; }
  getBBox() { return { x: 0, y: 0, width: 10, height: 10 }; }
  toString() {
    const a = Object.assign({}, this.a);
    if (this.tag === 'svg') { a.xmlns = 'http://www.w3.org/2000/svg'; delete a.class; delete a.role; }
    for (const k of Object.keys(a)) if (k.startsWith('on') || k === 'pointer-events' || k === 'aria-label' || k === 'class') delete a[k];
    const at = Object.entries(a).filter(([k, v]) => v != null).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this._t)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
const document = { createElement: t => new El(t), createElementNS: (n, t) => new El(t), head: { append() {} }, body: new El('body') };
let STOP = false;
const performance = { now: () => 0 }, requestAnimationFrame = cb => 0, setTimeout = () => 0, clearTimeout = () => {}, window = {};
const setInterval = fn => { STOP = false; for (let i = 0; i < 400 && !STOP; i++) fn(); STOP = false; return 1; };
const clearInterval = () => { STOP = true; };
const console = { log() {}, warn: (...a) => process.stderr.write('[warn] ' + a.map(x => typeof x === 'object' ? JSON.stringify(x) : x).join(' ') + '\n'), error: (...a) => process.stderr.write(a.join(' ') + '\n') };
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const plain = a && !(a instanceof El) && typeof a === 'object' && !Array.isArray(a); const e = new El(t, plain ? a : {}); if (!plain && a != null) e.append(a); e.append(...k); return e; };
function makeSvg(w, hgt, grid) {
  const s = svgEl('svg', { viewBox: `0 0 ${w} ${hgt}` });
  if (grid) { const g = svgEl('g', { stroke: '#DCE4E0', 'stroke-width': 1 }); for (let x = 0; x <= w; x += grid) g.append(svgEl('line', { x1: x, y1: 0, x2: x, y2: hgt })); for (let y = 0; y <= hgt; y += grid) g.append(svgEl('line', { x1: 0, y1: y, x2: w, y2: y })); s.append(g); }
  return s;
}
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
let DRAG = null;
function dragOn(svg, s, m, e) { DRAG = { s, m, e }; }
function svgPt() { return { x: 0, y: 0 }; }
let REC = [], INNER = 0;
function quiz() {} function blanks() {} function writeStep() {} function sequence() {}
/* 이야기 버전 엔진 부품(panes·thenWhy·ruleFirst·wonderRecall)과 autoRun */
function autoRun() { return () => {}; }
function panes(b, a, items, opts) { if (INNER) return; const last = b.kids.length ? b.kids[b.kids.length - 1] : null;
  REC.push({ t: 'panes', fig: last ? serEl(last) : null, items: items.map(x => ({ t: x.t, ph: x.ph || '', hint: x.hint || '', ex: x.ex || [] })) }); }
function thenWhy(render, o) { return (b, a) => { render(b, a); if (!INNER) REC.push({ t: 'thenwhy', q: o.q, ph: o.ph || '', help: o.help || [], ans: o.ans || '' }); }; }
function ruleFirst(render, o) { return (b, a) => { if (!INNER) REC.push({ t: 'rule', q: o.q, ph: o.ph || '', help: o.help || [], ans: o.ans || '' }); render(b, a); }; }
function wonderRecall(render) { return (b, a) => { if (!INNER) REC.push({ t: 'wonder' }); render(b, a); }; }

const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
const lesSrc = src.slice(src.indexOf('//@@LESSONS'));
eval((unitSrc + '\n' + lesSrc).replace(/^(const|let) /gm, 'var '));

function findAll(e, f, out) { out = out || []; if (e && typeof e === 'object' && e.kids) { if (f(e)) out.push(e); e.kids.forEach(k => findAll(k, f, out)); } return out; }
function plain(e) { if (e == null) return ''; if (typeof e !== 'object') return String(e); if (e.tag === 'svg') return ''; if (e.tag === 'br') return '\n'; return e._t + (e.kids || []).map(plain).join(''); }
const isJua = k => k instanceof El && (k.a.class || '') === 'jua';
function figsOf(root) {   /* 그림마다 {svg, label}: figure의 figcaption, 또는 그림 하나와 이름(.jua)이 든 묶음 */
  const out = [];
  (function walk(e, cap) {
    if (!e || typeof e !== 'object' || !e.kids) return;
    if (e.tag === 'svg') { out.push({ svg: String(e), label: cap || '' }); return; }
    if (e.tag === 'div' && e.kids.some(isJua)) { const ss = findAll(e, x => x.tag === 'svg'); if (ss.length === 1) { out.push({ svg: String(ss[0]), label: plain(e.kids.find(isJua)).trim() }); return; } }
    let c = cap; if (e.tag === 'figure') { const fc = e.kids.find(k => k instanceof El && k.tag === 'figcaption'); c = fc ? plain(fc).trim() : ''; }
    e.kids.forEach(k => walk(k, c));
  })(root, '');
  return out;
}
function serEl(v) {
  if (typeof v === 'function') v = v();
  if (v == null) return null;
  if (!(v instanceof El)) return { figs: [], text: String(v) };
  const figs = figsOf(v);
  const t = figs.length ? '' : plain(v).trim();
  return { figs, text: t, texts: v.kids.filter(k => k instanceof El && k.tag !== 'svg').map(k => plain(k).trim()).filter(Boolean) };
}
/* 활동 밖에서 본문에 바로 붙인 것(그림·안내 글) — 단추 줄은 빼요 */
function extras(box) {
  return box.kids.filter(k => k instanceof El && !/pp6btns|actions/.test(k.a.class || '')).map(k => ({ figs: figsOf(k), text: findAll(k, x => x.tag === 'svg').length ? '' : plain(k).trim(), small: /pp6small|pp6read/.test(k.a.class || '') }));
}
function serPart(p) {
  if (typeof p === 'string') return { s: p };
  if (p instanceof El) return p.tag === 'br' ? { br: 1 } : { s: plain(p) };
  if (p.o) return { o: p.o, a: p.a, multi: !!p.multi };
  if ('n' in p) return { n: p.n };
  return { s: '' };
}
function serQ(it) { return { q: it.q || null, fig: it.fig ? serEl(it.fig) : null, o: it.o || null, a: it.a, parts: it.parts ? it.parts.map(serPart) : null }; }
let PROV = null;
const api = new Proxy({}, { get: (t, k) => k === 'provide' ? (x => { PROV = x; }) : () => {} });

quiz = function (b, a, items, opts) { if (!INNER) REC.push({ t: 'quiz', items: items.map(serQ), ok: (opts || {}).ok || '' }); };
blanks = function (b, a, parts, opts) { if (!INNER) REC.push({ t: 'blanks', parts: parts.map(serPart), ok: (opts || {}).ok || '' }); };
writeStep = function (b, a, items) { if (!INNER) REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag || '', ph: x.ph || '', help: x.help || [], ans: x.ans || '' })) }); };
sequence = function (b, a, cards, order, opts) { if (!INNER) REC.push({ t: 'sequence', cards, order, ok: (opts || {}).ok || '' }); };
const ORIG = { pp6Ask };
pp6Ask = function (host, ap, items, opts) { if (!INNER) REC.push({ t: 'ask', items: items.map(serQ), ok: (opts || {}).ok || '', title: (opts || {}).title || '' }); return new El('div'); };
pp6Chain = function (body, ap, parts) {
  const out = [];
  for (const p of parts) { const save = REC; REC = []; const box = new El('div'); (p.run || p)(box, ap); out.push({ title: p.title || null, recs: REC, extra: extras(box) }); REC = save; }
  REC.push({ t: 'chain', parts: out });
};
function capThen(fn) { const save = REC; REC = []; const box = new El('div'); fn(box, api); const r = REC; REC = save; return r; }
const fig = (o) => String(pp6Fig(Object.assign({ W: 300, H: 250, maxW: '100%' }, o)));
const POLY = n => PP6_POLY[n];
function faceSets(it, pens) {   /* 색칠할 면: 펜마다 면 이름(꼭짓점 이름이 있으면)과 수 */
  const S = it.S, w = it.want || Object.fromEntries(S.F.map((_, fi) => [fi, pp6IsBase(S, fi) ? 0 : null]).filter(([, v]) => v != null));
  return pens.map((p, pi) => { const fs = Object.keys(w).filter(k => w[k] === pi).map(Number);
    return { pen: p.t || p.n, col: p.n, n: fs.length, names: it.lab ? fs.map(fi => pp6FaceName(S, fi, it.lab)) : [],
      shape: fs.length ? (pp6IsBase(S, fs[0]) ? POLY(S.n) : (S.kind === 'pyr' ? '삼각형' : '직사각형')) : '' }; });
}
const WID = ['pp6Pick', 'pp6Sort', 'pp6Tap', 'pp6Parts', 'pp6Ruler', 'pp6Columns', 'pp6Make', 'pp6FoldView', 'pp6NetMark', 'pp6NetPairs', 'pp6NetJudge',
  'pp6NetFaces', 'pp6NetDraw', 'pp6Skeleton', 'pp6Table', 'pp6Self', 'pp6PlusGame', 'pp6CodeGame', 'pp6CodeMake'];
function run0(name, opt) { const fb = new El('div'); INNER++; try { ORIG[name](fb, api, opt); } finally { INNER--; } return fb; }
WID.forEach(name => {
  ORIG[name] = eval(name);
  const w = function (body, ap, opt) {
    if (INNER) return ORIG[name](body, ap, opt);
    opt = opt || {};
    const rec = { t: name, q: opt.q || null };
    try {
      if (name === 'pp6Pick') { rec.items = opt.items.map(it => ({ name: it.name, svg: it.fig ? String(it.fig()) : null })); rec.a = opt.a; }
      else if (name === 'pp6Sort') { rec.bins = opt.bins; rec.items = opt.items.map(it => ({ name: it.name, svg: it.fig ? String(it.fig()) : null, bin: it.bin })); }
      else if (name === 'pp6Tap') { const items = opt.items || [opt], pens = opt.pens || [PP6_PEN.base];
        rec.multi = !!opt.items; rec.pens = pens.map(p => ({ t: p.t || '', n: p.n }));
        rec.items = items.map(it => ({ name: it.name || '', lab: !!it.lab, kind: it.S.kind, n: it.S.n, svg: fig({ solid: it.S, tilt: it.tilt || 0, yaw: it.yaw == null ? -24 : it.yaw, pitch: it.pitch == null ? 22 : it.pitch, lab: it.lab, side: '#FFFFFF', W: 300, H: 260 }), sets: faceSets(it, pens) })); }
      else if (name === 'pp6Parts') { const S = opt.S; rec.svg = fig({ solid: S, yaw: opt.yaw, pitch: opt.pitch, side: '#FFFFFF', W: 320, H: 270 }); rec.nE = S.E.size; rec.nV = S.V.length; rec.apex = !!opt.apex; rec.kind = S.kind; rec.n = S.n; }
      else if (name === 'pp6Ruler') { const fb = new El('div'); INNER++; try { ORIG[name](fb, api, opt); DRAG.m({ x: 0, y: 1e6 }); rec.svg = figsOf(fb)[0].svg; } finally { INNER--; } rec.h = opt.h; rec.kind = opt.S.kind; }
      else if (name === 'pp6Columns') { const fb = new El('div'); INNER++; try { ORIG[name](fb, api, opt); const sv = findAll(fb, x => x.tag === 'svg')[0]; rec.svg0 = String(sv);
          opt.cols.forEach((c, i) => sv.ev.click({ target: { dataset: { k: 'c' + i } } })); rec.svg1 = String(findAll(fb, x => x.tag === 'svg')[0]); } finally { INNER--; } rec.ns = opt.cols.map(c => c.n); }
      else if (name === 'pp6Make') { rec.kind = opt.kind; }
      else if (name === 'pp6FoldView') { const U = opt.U || pp6Unfold(opt.S, opt.nodes, opt.rot || 0); rec.svgs = [1, .55, 0].map(t => String(pp6FoldSvg(opt.S, U, { t, W: 300, H: 240 }).svg)); }
      else if (name === 'pp6NetMark') { const faces = pp6Faces(opt.S, opt.U); rec.svg = String(pp6NetSvg(faces, { s: opt.s || 26, col: faces.map(() => '#FFFFFF') }).svg);
        rec.nb = faces.filter(f => f.base).length; rec.ns = faces.length - rec.nb; rec.bshape = POLY(opt.S.n); rec.kind = opt.S.kind; }
      else if (name === 'pp6NetPairs') { const faces = pp6Faces(opt.S, opt.U), N = pp6NetSvg(faces, { s: opt.s || 26, col: faces.map(() => '#FFFFFF') });
        const cut = N.segs.filter(sg => !sg.fold).map(sg => pp6EK(faces[sg.i].ids[sg.j], faces[sg.i].ids[(sg.j + 1) % faces[sg.i].ids.length]));
        rec.pairs = [...new Set(cut)].filter(k => cut.filter(c => c === k).length === 2).length; rec.svg = String(N.svg); }
      else if (name === 'pp6NetJudge') { rec.cards = opt.cards.map(C => { const U = pp6Unfold(C.S, C.nodes, C.rot || 0), J = pp6Judge(C.S, U.map(u => u.P));
          if (J.ok !== C.ok) throw new Error('전개도 판정이 맞지 않아요: ' + C.name);
          return { name: C.name, ok: C.ok, res: C.res, svg: String(pp6NetSvg(pp6Faces(C.S, U), { s: opt.s || 12, plain: true, pad: 6 }).svg) }; }); }
      else if (name === 'pp6NetFaces') { PROV = null; const fb = run0(name, opt); rec.svg = figsOf(fb)[0].svg; rec.q = plain(fb.kids.find(isJua)).trim(); rec.ans = PROV.words; }
      else if (name === 'pp6NetDraw') { const S = opt.S, U = pp6Unfold(S, opt.nodes, opt.rot || 0), all = U.flatMap(u => u.P), x0 = Math.min(...all.map(p => p[0])), y1 = Math.max(...all.map(p => p[1]));
        const toG = p => [Math.round((opt.at[0] + p[0] - x0) * 1e6) / 1e6, Math.round((opt.at[1] + y1 - p[1]) * 1e6) / 1e6];
        rec.full = U.map(u => ({ P: pp6Clean(u.P.map(toG)), base: pp6IsBase(S, u.f) })); rec.given = opt.given; rec.cols = opt.cols; rec.rows = opt.rows;
        rec.differ = !!opt.differ; rec.n = S.n; rec.bshape = POLY(S.n);
        const nb = S.F.filter((_, fi) => pp6IsBase(S, fi)).length; rec.nb = nb; rec.nsd = S.F.length - nb;
        const J = pp6Judge(S, rec.full.map(f => f.P)); if (!J.ok) throw new Error('정답 전개도가 판정을 통과하지 못해요'); }
      else if (name === 'pp6Skeleton') { const S = opt.S; rec.svg = String(pp6SkelFig(S)); rec.nE = S.E.size; rec.nV = S.V.length; rec.kind = S.kind; rec.n = S.n; }
      else if (name === 'pp6Table') { rec.head = opt.head; rec.rows = opt.rows.map(r => r.map(c => c && c.n != null ? { n: c.n } : typeof c === 'function' ? Object.assign({ fig: 1 }, serEl(c)) : { s: String(c) })); }
      else if (name === 'pp6Self') { rec.items = opt.items; }
      else if (name === 'pp6CodeMake') { rec.ids = opt.ids; }
    } catch (e) { rec.err = String(e && e.stack || e).slice(0, 600); }
    const ask = typeof opt.ask === 'function' ? opt.ask() : opt.ask;
    rec.ask = (ask || []).map(serQ);
    if (opt.then) rec.then = capThen(opt.then);
    rec.ok = typeof opt.ok === 'string' ? opt.ok : '';
    REC.push(rec);
  };
  eval(name + ' = w');
});
function cap(render) { REC = []; const body = new El('div'); try { render(body, api); } catch (e) { REC.push({ t: 'error', err: String(e.stack || e).slice(0, 600) }); }
  const ex = extras(body); if (ex.length) REC.unshift({ t: 'pre', items: ex }); return REC; }
const OUT = { story: UNIT_STORY, lessons: LESSONS.map(L => ({ id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(s => ({ name: s.name, inst: s.inst, hints: s.hints || [], recs: cap(s.render) })),
  challenge: L.challenge ? { inst: L.challenge.inst, hints: L.challenge.hints || [], recs: cap(L.challenge.render) } : null })) };
OUT.cards = PP6_CARDS.map(c => ({ id: c.id, k: c.k, n: c.n, e: c.e, s: c.s, name: c.name, v: c.v, code: c.code, el: PP6_EL[c.e], svg: String(pp6CardFig(c)) }));
const tf = (S, py) => fig({ solid: S, side: py ? '#FBE0E6' : '#FFF1C7', fc: py ? [PP6.base] : [PP6.base, PP6.base], W: 240, H: 200, yaw: -22, pitch: 22 });
OUT.tblPr = [PP6_SH.tri(), pp6PrN(4, 1.6, 1.1, 45), PP6_SH.pent()].map(S => tf(S, false));
OUT.tblPy = [PP6_SH.py3(), pp6PyN(4, 1.9, 1.3, 45), PP6_SH.py5()].map(S => tf(S, true));
OUT.make = { prism: tf(pp6PrN(6, 1.5, 1.1), false), pyr: tf(pp6PyN(6, 1.8, 1.1), true) };
process.stdout.write(JSON.stringify(OUT));
'''

import hashlib
import json
import os
import random
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade6/math
UNITS = os.path.join(ROOT, '_build', 'units')
SRC_TB = os.path.join(UNITS, 'u2-prism.tb.js')
SRC_ST = os.path.join(UNITS, 'u2-prism.st.js')
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
UNIT_NAME = '2. 각기둥과 각뿔'
NAME = '2단원_각기둥과각뿔_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨⑩'
KO = '㉠㉡㉢㉣㉤㉥㉦㉧'
WORK = tempfile.mkdtemp(prefix='u2prism_')
K = 40            # 실제 크기: 1 cm = 40 px → 그림 너비 mm = px ÷ 4
ST = []           # 이야기 버전 차시(아직 없음 — 원본이 생기면 더함)

INK, BLUE, RED, GRAY, GRID = '#1D2A2A', '#2B7BD6', '#D64545', '#8795A1', '#B8C6D2'
BASE_C, SIDE_C = '#F7C9A3', '#FFF1C7'


def fmt(v):
    if isinstance(v, float):
        v = round(v, 6)
        if v.is_integer():
            return str(int(v))
        return '%.10g' % v
    return str(v)


def r2(v):
    return round(v * 100 + 1e-9) / 100


# ================================================================ 앱 읽기(node)
_CAP = {}


def load(src):
    if src in _CAP:
        return _CAP[src]
    js = os.path.join(WORK, 'cap.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(CAP_JS)
    r = subprocess.run(['node', js, src, FONT], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError('앱 원본을 읽지 못했어요: ' + r.stderr[-3000:])
    d = json.loads(r.stdout)

    def walk(recs, where):
        for rec in recs:
            assert rec['t'] != 'error' and not rec.get('err'), (where, rec)
            if rec['t'] == 'chain':
                for p in rec['parts']:
                    walk(p['recs'], where)
            walk(rec.get('then') or [], where)
    for L in d['lessons']:
        for st in L['steps'] + ([L['challenge']] if L['challenge'] else []):
            walk(st['recs'], (L['no'], st.get('name')))
    _CAP[src] = d
    return d


# ================================================================ 그림 찍기(Chromium 하나)
_NODE = r"""
const path = require('path');
const { chromium } = require(path.join(process.env.NPM_ROOT, 'playwright'));
const readline = require('readline');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 2800, height: 1400 }, deviceScaleFactor: 1 });
  const rl = readline.createInterface({ input: process.stdin });
  for await (const line of rl) {
    const m = JSON.parse(line);
    await p.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}' +
      '#w{display:inline-block;width:' + m.width + 'px;line-height:0}#w>svg{width:100%;height:auto;display:block}</style>' +
      '</head><body><div id="w">' + m.svg + '</div></body></html>');
    try { await p.evaluate(() => document.fonts.ready); } catch (e) {}
    await p.locator('#w').screenshot({ path: m.out });
    process.stdout.write('{"ok":1}\n');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
"""


class Shot:
    def __init__(self):
        self.proc, self.cache, self.n = None, {}, 0

    def _start(self):
        js = os.path.join(WORK, 'shot.js')
        with open(js, 'w') as f:
            f.write(_NODE)
        npm_root = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
        self.proc = subprocess.Popen(['node', js], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                     env=dict(os.environ, NPM_ROOT=npm_root), text=True, bufsize=1)

    def png(self, svg, width_px):
        key = hashlib.md5((svg + str(int(width_px))).encode()).hexdigest()
        if key not in self.cache:
            if not self.proc:
                self._start()
            self.n += 1
            out = os.path.join(WORK, 'f%04d.png' % self.n)
            if os.environ.get('DUMP_SVG'):
                with open(out[:-4] + '.svg', 'w') as f:
                    f.write(svg)
            self.proc.stdin.write(json.dumps({'svg': svg, 'out': out, 'width': int(width_px)}, ensure_ascii=False) + '\n')
            self.proc.stdin.flush()
            if not self.proc.stdout.readline():
                raise RuntimeError('그림 찍기 실패')
            self.cache[key] = out
        return self.cache[key]

    def close(self):
        if self.proc:
            self.proc.stdin.close()
            self.proc.wait(timeout=60)
            self.proc = None


SHOT = Shot()


def vb(svg):
    m = re.search(r'viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"', svg)
    return float(m.group(1)), float(m.group(2)), float(m.group(3)), float(m.group(4))


def pic(s, svg, mm):
    mm = min(180, mm)
    s.picture(SHOT.png(svg, min(2400, max(900, mm * 10))), width_mm=mm)


def pic_real(s, svg):
    """실제 크기 그림: SVG 1 cm = 40 px → 너비 mm = px ÷ 4"""
    w = vb(svg)[2]
    mm = w / 4
    assert mm <= 180, ('실제 크기 그림이 너무 넓어요', mm)
    s.picture(SHOT.png(svg, min(2600, w * 3)), width_mm=mm)


def _svg(w, h, body):
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s">%s</svg>' % (fmt(float(w)), fmt(float(h)), body)


def _t(x, y, t, size=15, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" dominant-baseline="middle" font-family="%s" fill="%s" font-weight="%s">%s</text>'
            % (fmt(float(x)), fmt(float(y)), size, anchor, FONT.replace("'", '&apos;'), fill, weight, t))


def _ln(a, b, col=INK, w=2, dash=None):
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round"%s/>'
            % (fmt(float(a[0])), fmt(float(a[1])), fmt(float(b[0])), fmt(float(b[1])), col, w, ' stroke-dasharray="%s"' % dash if dash else ''))


def nest(svg, x, y, w, h):
    """앱 그림을 큰 그림 안의 한 칸(x, y, w, h)에 비율을 지켜 넣기"""
    m = re.match(r'<svg[^>]*>', svg)
    inner = svg[m.end():-6]
    vx, vy, vw, vh = vb(svg)
    return ('<svg x="%s" y="%s" width="%s" height="%s" viewBox="%s %s %s %s" preserveAspectRatio="xMidYMid meet">%s</svg>'
            % (fmt(float(x)), fmt(float(y)), fmt(float(w)), fmt(float(h)), fmt(vx), fmt(vy), fmt(vw), fmt(vh), inner))


def cards_svg(items, cols=None, cw=170, ch=150, lab=True, box=True):
    """[(이름, svg)] → 카드 묶음 그림(이름은 그림 아래)"""
    n = len(items)
    cols = cols or min(n, 5)
    rows = (n + cols - 1) // cols
    gap, lh = 12, (max(30, cw / 11) if lab else 0)
    W, H = cols * cw + (cols - 1) * gap, rows * (ch + lh) + (rows - 1) * gap
    b = []
    for i, (name, svg) in enumerate(items):
        x, y = (i % cols) * (cw + gap), (i // cols) * (ch + lh + gap)
        if box:
            b.append('<rect x="%s" y="%s" width="%s" height="%s" rx="12" fill="#fff" stroke="#C9D4CF" stroke-width="2"/>' % (x + 1, y + 1, cw - 2, ch + lh - 2))
        b.append(nest(svg, x + 6, y + 6, cw - 12, ch - 10))
        if lab and name:
            fs = min(max(19 if len(name) < 8 else 16, cw / 15), (cw - 16) / (len(name) * 0.92))
            b.append(_t(x + cw / 2, y + ch + lh / 2 - 2, name, round(fs), INK, weight='bold'))
    return _svg(W, H, ''.join(b))


def fig_mm(svg, k=0.25, lo=45, hi=160):
    return max(lo, min(hi, vb(svg)[2] * k))


def put_fig(s, fig, k=0.25, hi=160):
    """serEl 결과({figs, text})를 활동지에"""
    if not fig:
        return
    if fig.get('text'):
        s.fill([t.strip() for t in fig['text'].split('\n') if t.strip()])
    figs = fig.get('figs') or []
    if len(figs) == 1:
        pic(s, figs[0]['svg'], fig_mm(figs[0]['svg'], k, hi=hi))
    elif figs:
        ws = [vb(f['svg'])[2] for f in figs]
        hs = [vb(f['svg'])[3] for f in figs]
        H = max(hs)
        cw = max(w * H / h for w, h in zip(ws, hs))
        lab = any(f['label'] for f in figs)
        svg = cards_svg([(f['label'], f['svg']) for f in figs], cols=len(figs), cw=cw, ch=H, lab=lab, box=lab)
        pic(s, svg, max(120, fig_mm(svg, k * 0.95, hi=hi)))





REAL_NOTE = '※ 아래 모눈은 실제 크기예요(한 칸 = 1 cm). 100%로 인쇄하면 자로 재어 확인할 수 있어요.'


def side(s, figs, mm=None, labels=True, cols=None, cwmin=0):
    """[(이름, svg)] 여러 그림을 한 줄(또는 cols개씩 여러 줄)로(높이를 맞춤)"""
    if len(figs) == 1 and not (labels and figs[0][0]):
        pic(s, figs[0][1], mm or fig_mm(figs[0][1], 0.3))
        return
    ws = [vb(f[1])[2] for f in figs]
    hs = [vb(f[1])[3] for f in figs]
    H = max(hs)
    cw = max([w * H / h for w, h in zip(ws, hs)] + [cwmin])
    lab = labels and any(f[0] for f in figs)
    cols = cols or len(figs)
    svg = cards_svg(figs, cols=cols, cw=cw, ch=H, lab=lab, box=lab)
    pic(s, svg, mm or max(70 if len(figs) <= 2 else 110, min(170, fig_mm(svg, 0.25))))


# ================================================================ 종이에 맞게 글 고치기
PAPER_RULES = [
    (r'기둥의 윗면을 하나씩 눌러 위에서 본 모양을 살펴보세요\.', '그림에서 기둥의 윗면을 보고 위에서 본 모양을 살펴보세요.'),
    (r'나누어 담아 보세요\.', '나누어 보세요.'),
    (r'를 찾아 눌러 빨간색으로 표시해 보세요\.', '를 찾아 빨간색으로 색칠해 보세요.'),
    (r'의 밑면을 찾아 눌러 빨간색으로 표시해 보세요\.', '의 밑면을 찾아 빨간색으로 색칠해 보세요.'),
    (r'그림을 돌려 가며 세어도 좋아요\.', ''),
    (r'공학 도구로 나만의 (각기둥|각뿔)을 만들고', r'나만의 \1을 정하고'),
    (r'상자를 잘라 펼쳐 보세요\.', '상자를 잘라 펼치는 그림을 살펴보세요.'),
    (r'펼친 그림을 접어 보고 서로', '펼친 그림을 접는다고 생각하고 서로'),
    (r'먼저 예상하고, 하나씩 접어서 확인해요\.', '먼저 예상하고, 오려서 접어 보거나 머릿속으로 접어 확인해요.'),
    (r'각뿔을 돌려 가며 살펴보고', '각뿔을 살펴보고'),
    (r'컴퓨터 친구 2명과 놀이를 해 보세요\.', '친구 2~3명과 모둠을 지어 놀이를 해 보세요.'),
    (r'내 차례에는 카드를 고르고, 계산한 값을 써서 외쳐요\.', '내 차례에는 카드를 한 장 내려놓고, 계산한 값을 외친 뒤 기록표에 써요.'),
    (r'책장을 넘겨 이 단원에서 배울 내용을 살펴보고', '이 단원에서 배울 내용을 살펴보고'),
    (r'\s*\(과정을 중시하는 평가\)', ''),
    (r' ― 육각기둥의 모양은 이 앱이 정했어요\.', ''),
    (r'\(카드는 이 앱이 정했어요\.\) ', ''),
]
INTERACT = re.compile(r'눌러|누르|누를|끌어|단추|화면|컴퓨터 친구|앱|돌려서|막대를')


def paper(t):
    t = str(t or '')
    for a, b in PAPER_RULES:
        t = re.sub(a, b, t)
    sents = re.split(r'(?<=[.?!”])\s+', t)
    return ' '.join(x for x in sents if x and not INTERACT.search(x)).strip()


def label_of(name):
    m = re.match(r'^(.*?)\s*([①-⑨])$', name)
    if m:
        return '%s(%d)' % (m.group(1), '①②③④⑤⑥⑦⑧⑨'.index(m.group(2)) + 1)
    return name


# ================================================================ 앱 부품 → 활동지
def unparen(t):
    """앱 글 '(' + 빈칸 + ')' 처럼 괄호가 겹치면 하나로"""
    return re.sub(r'\(\((\s*)([^()]*?)(\s*)\)\)', lambda m: '( %s )' % m.group(2) if m.group(2) else '(%s)' % (m.group(1) + m.group(3)), t)


def opt_text(opts):
    return '( ' + ' / '.join(opts) + ' )'


def is_short(opts):
    return all(len(o) <= 12 for o in opts)


def ans_of(p):
    if 'n' in p:
        return fmt(p['n'])
    a = p['a']
    if p.get('multi') or isinstance(a, list):
        return ', '.join(p['o'][i] for i in a)
    return re.sub(r'(?<=[가-힣])\.$', '', p['o'][a])


def render_parts(s, lv, parts, ctx):
    """앱 cy6Ask의 한 물음(parts) → 테두리 문장 + (긴 보기 목록). 정답 목록."""
    lines, cur, ans, lists = [], '', [], []
    for p in parts:
        if 'br' in p:
            lines.append(cur)
            cur = ''
        elif 's' in p:
            cur += p['s']
        elif 'n' in p:
            cur += '\x00'
            ans.append(fmt(p['n']))
        else:
            o = p['o']
            multi = p.get('multi') or isinstance(p['a'], list)
            if multi and is_short(o):
                cur += '%s 에서 모두 골라 써 보세요: \x00' % opt_text(o).replace(' / ', ' · ')
                ans.append(', '.join(o[i] for i in p['a']))
            elif multi or not is_short(o):
                lab = ''
                key = tuple(o)
                if key not in [x[0] for x in lists]:
                    lists.append((key, multi))
                li = [x[0] for x in lists].index(key)
                tag = ('기호' if len(lists) == 1 else '기호%d' % (li + 1))
                cur += '\x00' if cur.strip() else '%s: \x00' % ('알맞은 것을 모두 골라 기호를 써 보세요' if multi else '알맞은 것의 기호를 써 보세요')
                pre = '' if len(lists) == 1 else '[%d] ' % (li + 1)
                ans.append(pre + lab + ', '.join(KO[i] for i in (p['a'] if multi else [p['a']])))
                del tag
            elif lv == '도전형' or tuple(o) in ctx.get('boxed', ()):
                cur += '\x01'
                ctx['words'].update(o)
                ans.append(ans_of(p))
            else:
                cur += opt_text(o)
                ans.append(ans_of(p))
    lines.append(cur)
    lines = [re.sub(r'\s+', ' ', x).strip().replace('\x00', '(          )').replace('\x01', '(             )') for x in lines if x.strip()]
    for li, (o, multi) in enumerate(lists):
        pre = '' if len(lists) == 1 else '[%d] ' % (li + 1)
        s.fill(['%s%s %s' % (pre if i == 0 else ' ' * len(pre), KO[i], x) for i, x in enumerate(o)])
    if lines:
        s.fill([unparen(x) for x in lines])
    return ans


def words_of(items, lv):
    """도전형: 짧은 보기(한 개 고르기)를 모두 모아 낱말 상자로"""
    w = []
    for it in items:
        for p in it.get('parts') or []:
            if 'o' in p and not (p.get('multi') or isinstance(p['a'], list)) and is_short(p['o']):
                for o in p['o']:
                    if o not in w:
                        w.append(o)
    return w


def w_ask(s, lv, rec, k=0.25):
    items = rec['items'] if 'items' in rec else rec
    # 같은 보기가 세 번 넘게 되풀이되면(이름 붙이기·표 채우기) 기본형도 낱말 상자 + 빈칸
    cnt = {}
    for it in items:
        for p in it.get('parts') or []:
            if 'o' in p and not (p.get('multi') or isinstance(p['a'], list)) and is_short(p['o']):
                cnt[tuple(p['o'])] = cnt.get(tuple(p['o']), 0) + 1
    boxed = {o for o, c in cnt.items() if c >= 3}
    ctx = {'words': set(), 'boxed': boxed}
    if lv == '도전형':
        w = words_of(items, lv)
    else:
        w = []
        for o in cnt:
            if o in boxed:
                w += [x for x in o if x not in w]
    if w:
        s.wordbox(w)
    out = []
    for it in items:
        if it.get('q'):
            s.ask(it['q'], blank=False)
        put_fig(s, it.get('fig'), k)
        out += render_parts(s, lv, it.get('parts') or [], ctx)
    return ', '.join(out)


def w_quiz(s, lv, rec):
    ans = []
    items = rec['items']
    for n, it in enumerate(items):
        q = ('%d. ' % (n + 1) if len(items) > 1 else '') + it['q']
        o, a = it['o'], it['a']
        many = isinstance(a, list)
        if all(x[:1] in KO for x in o):          # 보기가 이미 ㉠㉡…으로 시작함
            s.ask(q, blank=False)
            put_fig(s, it.get('fig'))
            if any(len(x) > 1 for x in o):
                s.fill(o)
            s.ask('알맞은 것%s' % ('을 모두 골라 기호를 써 보세요.' if many else '의 기호를 써 보세요.'), answer_space=12)
            ans.append(', '.join(o[i][:1] for i in (a if many else [a])))
            continue
        if it.get('fig') or many or not all(len(x) <= 16 for x in o):
            s.ask(q, blank=False)
            put_fig(s, it.get('fig'))
            s.fill(['%s %s' % (KO[i], x) for i, x in enumerate(o)])
            s.ask('알맞은 것%s' % ('을 모두 골라 기호를 써 보세요.' if many else '의 기호를 써 보세요.'), answer_space=12)
            ans.append(', '.join(KO[i] for i in (a if many else [a])))
        else:
            s.choices([(q, opt_text(o))])
            ans.append(o[a])
    return ', '.join(ans)


def w_blanks(s, lv, rec):
    txt, ans, words = '', [], []
    for p in rec['parts']:
        if 'br' in p:
            txt += ' '
        elif 's' in p:
            txt += p['s']
        elif 'n' in p:
            txt += '\x00'
            ans.append(fmt(p['n']))
        else:
            ans.append(p['o'][p['a']])
            for o in p['o']:
                if o not in words:
                    words.append(o)
            txt += opt_text(p['o']) if lv == '기본형' else '\x01'
    if lv == '도전형':
        s.wordbox(words)
    s.fill(unparen(re.sub(r'\s+', ' ', txt).strip().replace('\x00', '(          )').replace('\x01', '(             )')))
    return ', '.join(ans)


def w_sequence(s, lv, rec):
    cards, order = rec['cards'], rec['order']
    idx = list(range(len(cards)))
    rnd = random.Random('|'.join(cards))
    while idx == sorted(idx) or idx == list(range(len(cards))):
        rnd.shuffle(idx)
    s.fill(['%s %s' % (KO[j], re.sub(r'^[①-⑨]\s*', '', cards[i])) for j, i in enumerate(idx)])
    s.ask('차례대로 기호를 써 보세요.   ' + ' → '.join(['(      )'] * len(cards)), blank=False)
    pos = {i: j for j, i in enumerate(idx)}
    return ' → '.join(KO[pos[i]] for i in order)


def w_write(s, lv, rec):
    ans = []
    for it in rec['items']:
        s.ask(it['q'], blank=False)
        if lv == '기본형' and it.get('tag'):
            s.labeled([(it['tag'], '')], row_h=3969 * 2)
        else:
            s.lines(3)
        ans.append(it['ph'] or '(생각을 쓰면 맞아요)')
    return ' / '.join(ans)





# ================================================================ 이 단원의 조작 부품 → 활동지
CTX = {'challenge': False, 'cur': None}
KN = ['', '', '', '삼각', '사각', '오각', '육각', '칠각', '팔각', '구각', '십각']
POLY = ['', '', '', '삼각형', '사각형', '오각형', '육각형', '칠각형', '팔각형', '구각형', '십각형']


def cnt(kind, n):
    if kind == 'prism':
        return {'face': n + 2, 'edge': 3 * n, 'vert': 2 * n, 'side': n}
    return {'face': n + 1, 'edge': 2 * n, 'vert': n + 1, 'side': n}


def jo(w, pair):
    """받침에 따라 조사 고르기(앱 pp6Jo와 같음)"""
    s = str(w)
    a, b = pair.split('/')
    c = s.strip()[-1:]
    bat = rieul = False
    if c.isdigit():
        bat, rieul = c in '0136780', c in '178'
    elif '가' <= c <= '힣':
        k = (ord(c) - 0xAC00) % 28
        bat, rieul = k != 0, k == 8
    elif 'ㄱ' <= c <= 'ㅎ':
        bat, rieul = True, c == 'ㄹ'
    if pair == '으로/로':
        return s + ('으로' if bat and not rieul else '로')
    return s + (a if bat else b)


def after(s, lv, rec, ans=''):
    """조작 뒤의 물음(ask)과 이어지는 활동(then)"""
    out = [ans] if ans else []
    if rec.get('ask'):
        out.append(w_ask(s, lv, rec['ask']))
    for r in rec.get('then') or []:
        out.append(run_rec(s, lv, r))
    return ' / '.join(x for x in out if x)


def cols_for(n):
    return n if n <= 5 else (n + 1) // 2


def key_word(names):
    return '기호' if all(len(x) <= 2 for x in names) else '이름'


def w_pre(s, lv, rec):
    rep = PRE_FIGS.get(CTX['cur'])
    if rep:
        rep(s, lv)
        return ''
    for it in rec['items']:
        if it['figs']:
            side(s, [(f['label'], f['svg']) for f in it['figs']], 60 if len(it['figs']) == 1 else None)
        elif it['text'] and not it['small']:
            t = paper(it['text'])
            if t:
                s.fill(t)
    return ''


def w_pick(s, lv, rec):
    items = rec['items']
    names = [it['name'] for it in items]
    if rec.get('q'):
        s.ask(rec['q'], blank=False)
    figs = [(it['name'], it['svg']) for it in items if it['svg']]
    if figs:
        side(s, figs, cols=cols_for(len(figs)))
    s.ask('알맞은 것을 모두 골라 %s 써 보세요.' % jo(key_word(names), '을/를'), answer_space=26)
    return after(s, lv, rec, ', '.join(names[i] for i in rec['a']))


def w_sort(s, lv, rec):
    items = rec['items']
    if rec.get('q'):
        s.ask(rec['q'], blank=False)
    figs = [(it['name'], it['svg']) for it in items if it['svg']]
    if figs:
        side(s, figs, cols=cols_for(len(figs)))
        names = [it['name'] for it in items]
        kw = key_word(names)
    else:
        s.fill(['%s %s' % (KO[i], it['name']) for i, it in enumerate(items)])
        names = [KO[i] for i in range(len(items))]
        kw = '기호'
    s.text('알맞은 칸에 %s 써 보세요.' % jo(kw, '을/를'))
    s.labeled([(b, '') for b in rec['bins']], label_mm=64)
    ans = ' / '.join('%s: %s' % (b, ', '.join(names[i] for i, it in enumerate(items) if it['bin'] == bi)) for bi, b in enumerate(rec['bins']))
    return after(s, lv, rec, ans)


def pen_word(p):
    return p['t'] or '밑면'


def w_tap(s, lv, rec):
    items, pens = rec['items'], rec['pens']
    s.text('%s 색칠해 보세요. 점선으로 그려진 뒤쪽 면도 빠뜨리지 마세요.' % ', '.join('%s %s으로' % (jo(pen_word(p), '은/는'), p['n']) for p in pens))
    if rec['multi']:
        side(s, [(it['name'], it['svg']) for it in items], cols=len(items))
    else:
        pic(s, items[0]['svg'], 78)
    ans = []
    for it in items:
        nm = (it['name'] + ': ') if rec['multi'] else ''
        if it['lab']:
            rows = []
            for st in it['sets']:
                if lv == '기본형':
                    rows.append('%s(%s) %d개:  %s' % (st['pen'], st['col'], st['n'], ',  '.join(['면 (          )'] * st['n'])))
                else:
                    rows.append('%s(%s):  (                                                  )' % (st['pen'], st['col']))
            s.text('%s색칠한 면의 이름을 써 보세요.' % nm)
            s.fill(rows)
            ans.append(nm + ' / '.join('%s %s' % (st['pen'], ', '.join(st['names'])) for st in it['sets']))
        else:
            ans.append(nm + ' / '.join('%s %s %d개' % (st['pen'], st['shape'], st['n']) for st in it['sets']))
    if not rec.get('ask') and not any(it['lab'] for it in items):
        st0 = items[0]['sets'][0]['pen']
        s.fill(['%s %s의 모양 (            ),  %s의 수 (     )개' % (it['name'] + ':' if it['name'] else '', st0, st0) for it in items])
    return after(s, lv, rec, '; '.join(ans))


def w_parts(s, lv, rec):
    s.text('모서리(면과 면이 만나는 선분)는 빨간색, 꼭짓점(모서리와 모서리가 만나는 점)은 파란색으로 표시해 보세요.'
           + (' 옆면이 모두 만나는 점에는 ◯표 해요.' if rec['apex'] else '') + ' 점선으로 그려진 뒤쪽 것도 빠뜨리지 마세요.')
    pic(s, rec['svg'], 74)
    s.fill('빨간 선분(모서리) (       )개,   파란 점(꼭짓점) (       )개')
    a = '모서리 %d개, 꼭짓점 %d개' % (rec['nE'], rec['nV'])
    if rec['apex']:
        a += ', ◯는 꼭대기의 뾰족한 점(각뿔의 꼭짓점)'
    return after(s, lv, rec, a)


def w_ruler(s, lv, rec):
    py = rec['kind'] == 'pyr'
    s.text('자를 바닥(눈금 0)에 수직으로 세우고, 삼각자를 %s에 닿게 대었어요. 자의 눈금을 읽어 보세요.' % ('옆면이 모두 만나는 뾰족한 점' if py else '위쪽 밑면'))
    pic(s, rec['svg'], 100)
    return after(s, lv, rec)


def w_columns(s, lv, rec):
    if lv == '기본형':
        s.text('색칠한 윗면에 위에서 본 모양의 이름을 적었어요.')
        pic(s, rec['svg1'], 112)
        a = ''
    else:
        pic(s, rec['svg0'], 112)
        s.ask('기둥 5개의 윗면은 각각 어떤 모양인가요? 모두 써 보세요.', answer_space=30)
        c = {}
        for n in rec['ns']:
            c[n] = c.get(n, 0) + 1
        a = ', '.join(POLY[n] + ('(%d개)' % c[n] if c[n] > 1 else '') for n in sorted(c))
    return after(s, lv, rec, a)


def w_make(s, lv, rec):
    k = rec['kind']
    kw = '각기둥' if k == 'prism' else '각뿔'
    suf = '기둥' if k == 'prism' else '뿔'
    s.text('예를 들어 육각%s을 만들었다면 이런 모양이에요.' % suf)
    pic(s, DATA['make'][k], 52)
    c6 = cnt(k, 6)
    s.text('내가 만들 %s의 밑면의 변의 수를 정하고(3~10), 구성 요소의 수를 묻는 문제를 만들어 풀어 보세요.' % kw)
    s.fill('내가 만든 문제: “(          )%s의 면, 꼭짓점, 모서리, 옆면은 각각 몇 개인가요?”' % suf)
    rows = [['이름', '면의 수(개)', '꼭짓점의 수(개)', '모서리의 수(개)', '옆면의 수(개)']]
    if lv == '기본형':
        rows.append(['육각%s(예)' % suf, '', '', '', ''])
    rows.append(['(        )%s' % suf, '', '', '', ''])
    s.table(rows)
    f = ('면 □+2, 꼭짓점 □×2, 모서리 □×3, 옆면 □' if k == 'prism' else '면 □+1, 꼭짓점 □+1, 모서리 □×2, 옆면 □')
    a = '(□ = 밑면의 변의 수) %s' % f
    if lv == '기본형':
        a = '육각%s 면 %d·꼭짓점 %d·모서리 %d·옆면 %d, ' % (suf, c6['face'], c6['vert'], c6['edge'], c6['side']) + a
    return after(s, lv, rec, a)


def w_fold(s, lv, rec):
    side(s, list(zip(['상자', '펼치는 중', '다 펼친 모양'], rec['svgs'])), 165)
    return after(s, lv, rec)


def w_netmark(s, lv, rec):
    s.text('밑면에 ◯표, 옆면에 △표 해 보세요.')
    pic(s, rec['svg'], 72)
    a = '◯ %d개(%s), △ %d개(%s)' % (rec['nb'], rec['bshape'], rec['ns'], '직사각형' if rec['kind'] == 'prism' else '삼각형')
    return after(s, lv, rec, a)


def w_netpairs(s, lv, rec):
    s.text('펼친 그림을 접었을 때 서로 맞닿는 선분끼리 같은 색으로 칠해 보세요(실선으로 된 바깥 선분끼리 짝이 돼요).')
    pic(s, rec['svg'], 72)
    s.ask('맞닿는 선분의 짝은 모두 몇 쌍인가요?', answer_space=8)
    return after(s, lv, rec, '%d쌍' % rec['pairs'])


def w_netjudge(s, lv, rec):
    cards = rec['cards']
    side(s, [(c['name'], c['svg']) for c in cards], 170 if len(cards) > 3 else 150, cols=len(cards))
    s.text('전개도가 될 수 있을 것 같으면 ○, 없을 것 같으면 ×를 ‘예상’ 칸에 쓰고, 오려서 접어 보거나 머릿속으로 접어 ‘확인’ 칸에 써 보세요.')
    s.table([[''] + [c['name'] for c in cards], ['예상(○/×)'] + [''] * len(cards), ['확인(○/×)'] + [''] * len(cards)])
    a = ', '.join('%s %s' % (c['name'], '○' if c['ok'] else '×') for c in cards)
    return after(s, lv, rec, a)


def w_netfaces(s, lv, rec):
    s.ask(rec['q'].replace('모두 눌러 보세요.', '모두 찾아 색칠해 보세요.'), blank=False)
    pic(s, rec['svg'], 74)
    s.ask('만나는 면을 모두 써 보세요.', answer_space=36)
    return after(s, lv, rec, ', '.join(rec['ans']))


# ---------------------------------------------------------------- 모눈 전개도(실제 크기)
def poly_key(P):
    return tuple(sorted((round(x, 4), round(y, 4)) for x, y in P))


def grid_svg(rec, cell, win):
    gx, gy, gw, gh = win
    pad = 6
    W, H = gw * cell + 2 * pad, gh * cell + 2 * pad
    out = ['<rect x="0" y="0" width="%s" height="%s" fill="#fff"/>' % (W, H)]
    for i in range(gw + 1):
        out.append(_ln((pad + i * cell, pad), (pad + i * cell, pad + gh * cell), GRID, 1.2))
    for j in range(gh + 1):
        out.append(_ln((pad, pad + j * cell), (pad + gw * cell, pad + j * cell), GRID, 1.2))
    X = lambda p: (pad + (p[0] - gx) * cell, pad + (p[1] - gy) * cell)
    for i in rec['given']:
        f = rec['full'][i]
        pts = ' '.join('%s,%s' % tuple(fmt(float(v)) for v in X(p)) for p in f['P'])
        out.append('<polygon points="%s" fill="%s" stroke="%s" stroke-width="2.6" stroke-linejoin="round"/>' % (pts, BASE_C if f['base'] else SIDE_C, INK))
    return _svg(W, H, ''.join(out))


def net_window(rec, maxw):
    xs = [p[0] for f in rec['full'] for p in f['P']]
    ys = [p[1] for f in rec['full'] for p in f['P']]
    bx0, bx1, by0, by1 = min(xs), max(xs), min(ys), max(ys)
    gw = min(rec['cols'], maxw)
    ox = int(round((bx0 + bx1) / 2 - gw / 2))
    ox = max(0, min(rec['cols'] - gw, ox))
    oy0 = max(0, int(by0) - 2)
    oy1 = min(rec['rows'], int(by1 + 0.999) + 2)
    assert ox <= bx0 and bx1 <= ox + gw, ('정답 전개도가 모눈 밖으로 나가요', bx0, bx1, ox, gw)
    return ox, oy0, gw, oy1 - oy0


def w_netdraw(s, lv, rec):
    full = rec['full']
    xs = [p[0] for f in full for p in f['P']]
    real = max(xs) - min(xs) <= 17
    if real:
        win = net_window(rec, 17)
        svg = grid_svg(rec, K, win)
        s.text(REAL_NOTE)
    else:
        win = (0, 0, rec['cols'], rec['rows'])
        svg = grid_svg(rec, K // 2, win)
        s.text('※ 이 모눈은 종이에 들어가도록 실제 크기의 반으로 줄였어요. 모눈 한 칸을 1 cm로 생각하고 그려요.')
    s.text('주어진 면에 이어서 나머지 면을 그려 전개도를 완성해 보세요. 잘린 모서리는 실선, 잘리지 않은 모서리는 점선으로 그려요.')
    mm = vb(svg)[2] / 4
    assert mm <= 180
    s.picture(SHOT.png(svg, min(2600, vb(svg)[2] * 3)), width_mm=mm)
    need = []
    nb = sum(1 for i in range(len(full)) if i not in rec['given'] and full[i]['base'])
    sides = []
    for i, f in enumerate(full):
        if i in rec['given'] or f['base']:
            continue
        px = [p[0] for p in f['P']]
        py = [p[1] for p in f['P']]
        w, h = max(px) - min(px), max(py) - min(py)
        sides.append('%s cm × %s cm' % (fmt(w), fmt(h)))
    if nb:
        need.append('밑면(%s) %d개' % (rec['bshape'], nb))
    if sides:
        need.append('옆면(직사각형 %s) %d개' % (', '.join(sides), len(sides)))
    a = '더 그릴 면 ' + ', '.join(need) + ' — 겹치지 않고 맞닿는 선분의 길이가 같게'
    if rec['differ']:
        a = '앞과 다른 자리에 붙인 전개도(예: 밑면을 다른 옆면의 위나 아래에 붙임)도 맞아요; ' + a
    return after(s, lv, rec, a)


def w_skeleton(s, lv, rec):
    s.text('이쑤시개(막대)와 스타이로폼 공(동그라미)을 빠짐없이 세어 보세요. 센 것에 차례대로 번호를 써도 좋아요.')
    pic(s, rec['svg'], 62)
    s.fill('이쑤시개 (       )개,   스타이로폼 공 (       )개')
    return after(s, lv, rec, '이쑤시개 %d개, 공 %d개' % (rec['nE'], rec['nV']))


def cell_label(c, ri):
    t = [x for x in (c.get('texts') or []) if x not in ('+', '−', '이 앱이 정한 카드')]
    return ' · '.join(t[:2]) if t else NUM[ri]


def w_table(s, lv, rec):
    if rec.get('q'):
        s.ask(rec['q'], blank=False)
    figs, rows, ans = [], [list(rec['head'])], []
    for ri, r in enumerate(rec['rows']):
        cells, got, name = [], [], ''
        for c in r:
            if c.get('fig'):
                lab = cell_label(c, ri)
                figs.append((lab, c['figs'][0]['svg']))
                cells.append(lab)
                name = name or lab
            elif 'n' in c:
                cells.append('')
                got.append(fmt(c['n']))
            else:
                cells.append(c['s'])
                if not name and not re.match(r'^\d+$', c['s']):
                    name = c['s']
        rows.append(cells)
        ans.append('%s %s' % (name, '·'.join(got)))
    if figs:
        side(s, figs, cols=min(6, len(figs)) if len(figs) > 3 else len(figs))
    s.table(rows)
    return after(s, lv, rec, ', '.join(ans))


def w_self(s, lv, rec):
    s.text('알맞은 칸에 ○표 해 보세요.')
    s.table([['스스로 평가해요', '◎ 잘했어요', '○ 보통이에요', '△ 노력할래요']] + [[q, '', '', ''] for q in rec['items']], col_mm=[105, 25, 25, 25])
    return '(스스로 평가)'


def card_lab(c, sign=True):
    return ('%s ' % ('+' if c['s'] > 0 else '−') if sign else '') + '%s · %s' % (c['name'], c['el'].replace('의 수', ''))


PLUS_SEQ = [2, 7, 3, 9, 1]     # 연습: 시작 수 10, 끝 수 45


def w_plus(s, lv, rec):
    C = DATA['cards']
    s.text('놀이 카드 12장이에요(카드는 이 활동지에서 정했어요). 두 벌을 만들어 섞어 쓰고, 한 사람당 3장씩 나누어 가져요.')
    side(s, [(card_lab(c), c['svg']) for c in C], 170, cols=4, cwmin=200)
    start, end = 10, 45
    s.text('연습해요: 시작 수는 %d, 끝 수는 %s. 다섯 사람이 차례대로 아래 카드를 냈어요. 표를 완성해 보세요.' % (start, jo(end, '이에요/예요')))
    rows = [['차례', '낸 카드', '구성 요소의 수', '계산', '계산한 값']]
    cur, vals = start, []
    for i, cid in enumerate(PLUS_SEQ):
        c = C[cid]
        new = cur + c['s'] * c['v']
        rows.append(['%d번째' % (i + 1), card_lab(c), '', '%d %s (    ) =' % (cur, '+' if c['s'] > 0 else '−') if lv == '기본형' else '', ''])
        vals.append((c['v'], cur, new))
        cur = new
    s.table(rows, col_mm=[18, 62, 30, 40, 30])
    last = vals[-1][2]
    over = [i + 1 for i, v in enumerate(vals) if v[2] >= end]
    s.ask('계산한 값이 끝 수 이상이 된 사람은 몇 번째 사람이고, 어떻게 해야 하나요?', blank=False)
    s.lines(1)
    a = '연습: ' + ', '.join('%d(%d%s%d=%d)' % (v[0], v[1], '+' if C[PLUS_SEQ[i]]['s'] > 0 else '−', v[0], v[2]) for i, v in enumerate(vals))
    assert over == [len(vals)] and last >= end, (over, last)
    a += ' / %d번째 사람: %s %d 이상이라 가진 카드를 모두 내려놓아요' % (over[0], jo(last, '이/가'), end)
    s.text('놀이 기록표: 내 차례마다 낸 카드와 계산한 값을 써요.')
    s.table([['차례', '낸 카드(도형 · 구성 요소 · +/−)', '계산', '계산한 값']] + [['', '', '', ''] for _ in range(6)], col_mm=[18, 72, 55, 35])
    return a + ' / 기록표: 놀이 결과에 따라 달라요'


CODE_IDS = [0, 3, 6, 9, 11]


def w_code(s, lv, rec):
    C = DATA['cards']
    cs = [C[i] for i in CODE_IDS]
    codes = [c['code'] for c in cs]
    assert len(set(codes)) == len(codes)
    side(s, [('%s %s' % (KO[i], card_lab(c, False)), c['svg']) for i, c in enumerate(cs)], 170, cols=5, cwmin=190)
    order = [2, 4, 0, 3, 1]
    s.text('친구가 보여 준 암호예요. 어떤 카드의 암호인지 기호를 써 보세요.')
    s.table([['암호'] + [codes[i] for i in order], ['카드 기호'] + [''] * len(order)])
    return '암호 ' + ', '.join('%s → %s' % (codes[i], KO[i]) for i in order)


def w_codemake(s, lv, rec):
    C = DATA['cards']
    cs = [C[i] for i in rec['ids']]
    side(s, [(card_lab(c, False), c['svg']) for c in cs], 130, cols=len(cs), cwmin=180)
    rows = [['카드', '옆면의 수', '옆면 모양(▭/△)', '구성 요소의 수', '암호']]
    for c in cs:
        rows.append([card_lab(c, False), '', '', '', ''])
    s.table(rows, col_mm=[52, 28, 34, 34, 32])
    return after(s, lv, rec, ', '.join('%s → %s' % (card_lab(c, False), c['code']) for c in cs))


def w_chain(s, lv, rec):
    out = []
    for p in rec['parts']:
        draw = any(r['t'] == 'pp6NetDraw' for r in p['recs'])
        if draw:
            s.page_break()
        if p.get('title'):
            t = paper(p['title'])
            if t:
                s.text('▶ ' + t)
        for e in p.get('extra') or []:
            if e['figs']:
                side(s, [(f['label'], f['svg']) for f in e['figs']], 52 if draw else None)
            elif e['text'] and not e['small']:
                t = paper(e['text'])
                if t:
                    s.fill(t)
        for r in p['recs']:
            out.append(run_rec(s, lv, r))
    return ' / '.join(x for x in out if x)


def pre_tbl(key, kind):
    names = ['삼각' + kind, '사각' + kind, '오각' + kind]
    return lambda s, lv: side(s, list(zip(names, DATA[key])), 150)


PRE_FIGS = {('t4', '표 완성하기'): pre_tbl('tblPr', '기둥'), ('t8', '표 완성하기'): pre_tbl('tblPy', '뿔')}

WIDGETS = {'ask': lambda s, lv, r: w_ask(s, lv, r), 'quiz': w_quiz, 'blanks': w_blanks, 'write': w_write, 'sequence': w_sequence,
           'chain': w_chain, 'pre': w_pre,
           'pp6Pick': w_pick, 'pp6Sort': w_sort, 'pp6Tap': w_tap, 'pp6Parts': w_parts, 'pp6Ruler': w_ruler, 'pp6Columns': w_columns,
           'pp6Make': w_make, 'pp6FoldView': w_fold, 'pp6NetMark': w_netmark, 'pp6NetPairs': w_netpairs, 'pp6NetJudge': w_netjudge,
           'pp6NetFaces': w_netfaces, 'pp6NetDraw': w_netdraw, 'pp6Skeleton': w_skeleton, 'pp6Table': w_table, 'pp6Self': w_self,
           'pp6PlusGame': w_plus, 'pp6CodeGame': w_code, 'pp6CodeMake': w_codemake}


def run_rec(s, lv, r):
    if r['t'] not in WIDGETS:
        raise RuntimeError('활동지에 아직 없는 부품: %s — gen_u2-prism.py의 WIDGETS에 더하세요' % r['t'])
    return WIDGETS[r['t']](s, lv, r)


# ================================================================ 정답 다시 계산(앱의 수와 맞추기)
def all_nums(recs, out=None):
    """기록 안의 모든 수 칸: (앞 글, 정답, 물음)"""
    out = [] if out is None else out
    for r in recs:
        if r['t'] == 'chain':
            for p in r['parts']:
                all_nums(p['recs'], out)
            continue
        all_nums(r.get('then') or [], out)
        items = r.get('items') if r['t'] == 'ask' else r.get('ask')
        for it in items or []:
            prev = ''
            for p in it.get('parts') or []:
                if 's' in p:
                    prev += p['s']
                elif 'n' in p:
                    out.append((prev, p['n'], it.get('q') or ''))
                    prev = ''
    return out


def all_tables(recs, out=None):
    out = [] if out is None else out
    for r in recs:
        if r['t'] == 'chain':
            for p in r['parts']:
                all_tables(p['recs'], out)
            continue
        if r['t'] == 'pp6Table':
            out.append(r)
        all_tables(r.get('then') or [], out)
    return out


EXPR = re.compile(r'(\(?\d[\d.\s()−\-+×÷]*[−\-+×÷][\d.\s()−\-+×÷]*\d\)?)\s*=\s*$')
NAME_RE = re.compile(r'(삼|사|오|육|칠|팔|구|십)각(기둥|뿔)')
SHAPE_RE = re.compile(r'^(삼|사|오|육|칠|팔|구|십)각형$')
HEAD_KEY = [('옆면의 수', 'side'), ('모서리의 수', 'edge'), ('꼭짓점의 수', 'vert'), ('면의 수', 'face'), ('변의 수', 'n')]
KN1 = ['', '', '', '삼', '사', '오', '육', '칠', '팔', '구', '십']


def check_numbers(D):
    """식이 적힌 칸은 식을 계산하고, 표는 각기둥·각뿔 공식으로 따로 계산해 앱의 답과 맞춥니다."""
    seen, nexpr, ntab = [], 0, 0
    for L in D['lessons']:
        sts = L['steps'] + ([L['challenge']] if L['challenge'] else [])
        for st in sts:
            for prev, n, q in all_nums(st['recs']):
                m = EXPR.search(prev)
                if m and m.group(1).count('(') == m.group(1).count(')'):
                    e = m.group(1).replace('−', '-').replace('×', '*').replace('÷', '/')
                    v = eval(e, {'__builtins__': {}}, {})
                    assert abs(v - n) < 1e-9, ('식 계산이 달라요', L['no'], prev, n, v)
                    nexpr += 1
                seen.append(n)
            for T in all_tables(st['recs']):
                head = T['head']
                if '변의 수' in head[0]:          # 가로로 늘어놓은 표(한 밑면의 변의 수 5, 6, 7, 8)
                    for r in T['rows']:
                        key = [k for t, k in HEAD_KEY if t in r[0]['s']][0]
                        for j, c in enumerate(r[1:], 1):
                            v = c.get('n', int(c['s']) if 's' in c else None)
                            assert v == cnt('prism', int(head[j]))[key], (L['no'], head[j], key, v)
                            ntab += 1
                    continue
                for r in T['rows']:
                    txts = [c.get('s') or ' '.join(c.get('texts') or []) for c in r]
                    kind = n = None
                    for t in txts:
                        m = NAME_RE.search(t or '')
                        if m:
                            n, kind = KN1.index(m.group(1)), ('prism' if m.group(2) == '기둥' else 'pyr')
                            break
                    if kind is None:
                        for t in txts:
                            m = SHAPE_RE.match(t or '')
                            if m:
                                n = KN1.index(m.group(1))
                                kind = 'pyr' if st['name'] == '문제 2' else 'prism'
                    assert kind, ('표 줄의 도형을 모르겠어요', L['no'], txts)
                    for j, c in enumerate(r):
                        if 'n' not in c:
                            continue
                        keys = [k for t, k in HEAD_KEY if t in head[j]]
                        if not keys:   # 카드 표: 카드에 적힌 구성 요소
                            el = [k for t, k in HEAD_KEY if t in txts[0]]
                            keys = el
                        k = keys[0]
                        want = n if k == 'n' else cnt(kind, n)[k]
                        assert c['n'] == want, ('표 수가 공식과 달라요', L['no'], txts, head[j], c['n'], want)
                        ntab += 1
    assert nexpr >= 3, nexpr
    assert ntab >= 60, ntab
    c = cnt
    expect = [6, 12, 8, 6, 7 * 15, 2, 3, 5, 6, 7, 6 * 18, 5, 6, 6 * 6, c('pyr', 7)['face'] - 1, 10 * 3, 10 * 2,
              c('pyr', 8)['edge'], c('prism', 7)['face'], 72 / 8, 9 * 4, 8, 16 - 6, 10 + 6, 30, 20, 16]
    for v in expect:
        assert any(abs(v - n) < 1e-9 for n in seen), ('앱 답 중에 없음', v)
    # 문제 그림의 수: 정오각형 기둥(7 cm) 모서리 합, 정육각형 기둥(6 cm), 정사면체 6 cm, 모서리 72 cm 사각뿔
    assert 7 * c('prism', 5)['edge'] == 105 and 6 * c('prism', 6)['edge'] == 108 and 6 * c('pyr', 3)['edge'] == 36
    assert 72 / c('pyr', 4)['edge'] * 4 == 36
    # 9차시 도전: 이쑤시개 30개 → 십각기둥, 공 9개 → 팔각뿔
    assert c('prism', 10)['edge'] == 30 and c('prism', 10)['vert'] == 20 and c('pyr', 8)['vert'] == 9 and c('pyr', 8)['edge'] == 16
    # 11차시 도전: 면 9개 각뿔 → 팔각뿔 모서리 16, 꼭짓점 14개 각기둥 → 칠각기둥 면 9, 면+꼭짓점 17 → 오각기둥
    assert c('pyr', 8)['face'] == 9 and c('prism', 7)['vert'] == 14 and c('prism', 7)['face'] == 9
    assert [n for n in range(3, 11) if c('prism', n)['face'] + c('prism', n)['vert'] == 17] == [5]
    # 카드 값
    for cd in D['cards']:
        assert cd['v'] == cnt(cd['k'], cd['n'])[cd['e']], cd


# ================================================================ 차시
WHY = {   # 도전형 '왜' 쓰기(차시 id → 물음, 예시 답)
    't1': ('기둥 모양과 뿔 모양은 무엇이 다른지 까닭과 함께 써 보세요.',
           '예) 기둥 모양은 위와 아래(양쪽 끝)에 똑같은 면이 있고, 뿔 모양은 한쪽 끝이 뾰족해서 똑같은 두 면이 없어요.'),
    't23': ('누워 있는 각기둥에서도 밑면을 찾을 수 있는 까닭을 써 보세요.',
            '예) 밑면은 아래에 있는 면이 아니라 평행하고 합동인 두 면이라서, 누워 있어도 양쪽 끝의 평행하고 합동인 두 면이 밑면이에요.'),
    't4': ('한 밑면의 변의 수가 □인 각기둥의 모서리가 □×3개인 까닭을 써 보세요.',
           '예) 위 밑면의 모서리 □개, 아래 밑면의 모서리 □개, 옆면끼리 만나는 모서리 □개가 있어서 모두 □×3개예요.'),
    't56': ('전개도를 그릴 때 접었을 때 맞닿는 선분의 길이를 같게 그려야 하는 까닭을 써 보세요.',
            '예) 접으면 맞닿는 두 선분이 한 모서리가 되므로, 길이가 다르면 꼭 맞게 붙지 않아 각기둥이 만들어지지 않아요.'),
    't7': ('각뿔의 밑면의 변의 수와 옆면의 수가 같은 까닭을 써 보세요.',
           '예) 밑면의 변마다 그 변을 한 변으로 하는 삼각형 옆면이 하나씩 붙어 있어서 옆면의 수와 밑면의 변의 수가 같아요.'),
    't8': ('각뿔의 꼭짓점의 수가 밑면의 변의 수보다 1 큰 까닭을 써 보세요.',
           '예) 밑면의 꼭짓점은 밑면의 변의 수만큼 있고, 여기에 옆면이 모두 만나는 각뿔의 꼭짓점 1개가 더 있어서 1 커요.'),
    't9': ('육각기둥과 육각뿔에 필요한 이쑤시개의 수가 다른 까닭을 써 보세요.',
           '예) 이쑤시개는 모서리를 나타내요. 육각기둥은 모서리가 6×3=18개, 육각뿔은 6×2=12개라서 필요한 이쑤시개의 수가 달라요.'),
    't10': ('끝 수에 가까울 때 어떤 카드를 내면 좋을지 까닭과 함께 써 보세요.',
            '예) − 카드나 구성 요소의 수가 작은 카드를 내요. 계산한 값이 끝 수 이상이 되면 가진 카드를 모두 내려놓아야 하기 때문이에요.'),
    't11': ('각기둥과 각뿔의 같은 점과 다른 점을 하나씩 써 보세요.',
            '예) 같은 점: 밑면이 다각형이고 밑면의 변의 수와 옆면의 수가 같아요. 다른 점: 각기둥은 밑면이 2개이고 옆면이 직사각형, 각뿔은 밑면이 1개이고 옆면이 삼각형이에요.'),
}


def show_inst(s, lv, inst, hints):
    t = paper(inst)
    if t:
        s.text(t)
    if lv == '기본형' and t:
        for hn in hints or []:
            h = paper(hn)
            if h:
                s.text('도움: ' + h)
                break


def tb_lesson(s, lv, L):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    ans = []
    for i, st_ in enumerate(L['steps']):
        s.step('%s %s' % (NUM[i], label_of(st_['name'])))
        show_inst(s, lv, st_['inst'], st_['hints'])
        CTX['challenge'] = False
        CTX['cur'] = (L['id'], st_['name'])
        got = [run_rec(s, lv, r) for r in st_['recs']]
        ans.append('%s %s' % (NUM[i], ' / '.join(x for x in got if x)))
    CTX['cur'] = None
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('challenge'):
            s.step('%s ★ 도전하기' % NUM[n], '앱의 도전 문제')
            show_inst(s, lv, L['challenge']['inst'], [])
            CTX['challenge'] = True
            ans.append('%s %s' % (NUM[n], ' / '.join(x for x in (run_rec(s, lv, r) for r in L['challenge']['recs']) if x)))
            CTX['challenge'] = False
            n += 1
        q, a = WHY.get(L['id'], ('오늘 배운 내용을 친구에게 설명하듯 써 보세요.', '예) ' + L['summary'].split('. ')[0] + '.'))
        s.step('%s 생각 쓰기' % NUM[n], '왜 그럴까요?')
        s.ask(q, blank=False)
        s.lines(3)
        ans.append('%s %s' % (NUM[n], a))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


DATA = {}


def build_file(kind, lv):
    src = SRC_TB if kind == 'tb' else SRC_ST
    D = load(src)
    if kind == 'tb':
        check_numbers(D)
    DATA.clear()
    DATA.update(D)
    label = '교과서 차시' if kind == 'tb' else '이야기 버전'
    s = Sheet(unit_label='6-1 수학 %s(%s)' % (UNIT_NAME, label), level=lv, grade_label='6학년')
    if kind == 'tb':
        lines = [tb_lesson(s, lv, L) for L in D['lessons']]
    else:
        lines = [f(s, lv) for f in ST]
    s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT_NAME, label, lv), lines,
              note='※ 이 활동지는 앱 u2-prism.html과 차시 번호가 같습니다. '
                   '5~6차시 삼각기둥·사각기둥 전개도 모눈은 실제 크기(한 칸 1 cm)이므로 100%로 인쇄하세요. 육각기둥 모눈은 종이에 들어가도록 반으로 줄였어요. '
                   '쓰기 칸의 ‘예)’는 예시 답이에요.')
    outdir = OUT_TB if kind == 'tb' else OUT_ST
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    want = sys.argv[1:] or ['tb', 'st']
    kinds = []
    if 'tb' in want:
        kinds.append('tb')
    if 'st' in want:
        if ST and os.path.exists(SRC_ST):
            kinds.append('st')
        else:
            print('이야기 버전은 아직 없어 건너뜁니다.')
    out = []
    try:
        for kind in kinds:
            for lv in ('기본형', '도전형'):
                out.append(build_file(kind, lv))
    finally:
        SHOT.close()
        if os.environ.get('KEEP_FIGS'):
            print('그림 폴더:', WORK)
        else:
            shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob = check(p)
        bad += bool(prob)
        print(p, 'OK' if not prob else '\n  ' + '\n  '.join(prob))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
