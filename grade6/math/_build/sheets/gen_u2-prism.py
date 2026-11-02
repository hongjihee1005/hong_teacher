# -*- coding: utf-8 -*-
"""6-1 수학 2. 각기둥과 각뿔 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u2-prism.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u2-prism.py tb       # 교과서 차시 버전만
    python3 gen_u2-prism.py st       # 이야기 버전만

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
  - 이야기 버전(ST, `python3 gen_u2-prism.py st`)도 같은 방법으로 ../units/u2-prism.st.js('꿈의 쉼터 설계 공모전',
    1·2~3·4·5~6·7·8·9·10·11차시)의 LESSONS를 읽어 sem1-soop/sheets/에 만듭니다. 이야기 엔진 부품은 종이로 바꿉니다:
    panes(보여요·생각해요·궁금해요 세 칸) · thenWhy('왜 그럴까요?' 쓰기, 정답에 앱의 모범 답) · ruleFirst(활동 전에 '먼저 예상해요',
    정답에 '실제 규칙') · wonderRecall(11차시 '궁금해요' 다시 보기). 기본형은 쓰기 칸에 앱 help의 문장 틀을 '도움'으로 보여 줍니다.
    설계도 모눈은 모두 실제 크기(한 칸 1 cm)이고, 가로가 18 cm인 화단 전개도는 모눈을 시계 방향으로 90° 돌려 세로로 넣습니다.
    차시 id가 ST_IDS와 다르면 멈추고, 앱의 답은 check_story(파이썬으로 따로 계산)와 맞춥니다.
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
ST_RULES = [   # 이야기 버전 글만(교과서 버전 글은 그대로)
    (r'떠오르는 것을 세 칸에 써서 붙여요\.', '떠오르는 것을 세 칸에 써 보세요.'),
    (r'텐트 모형을 잘라서 펼쳐 보세요\.', '텐트 모형을 잘라서 펼치는 그림을 살펴보세요.'),
    (r'먼저 예상한 다음, 하나씩 접어서 확인해요\.', '먼저 예상한 다음, 오려서 접어 보거나 머릿속으로 접어 확인해요.'),
    (r'먼저 예상한 다음, 하나씩 접어서 확인해 보세요\.', '먼저 예상한 다음, 오려서 접어 보거나 머릿속으로 접어 확인해 보세요.'),
    (r'(각기둥|각뿔)을 돌려 가며 세어', r'\1의 그림을 살펴보며 세어'),
    (r'공학 도구로 쉼터에 쓸 나만의 (각기둥|각뿔)(?: 지붕)?을 만들고', r'쉼터에 쓸 나만의 \1을 정하고'),
    (r'컴퓨터 친구 2명과 함께 놀이를 해 보세요\.', '친구 2~3명과 모둠을 지어 놀이를 해 보세요.'),
    (r'가장 먼저 찾아 보세요\.', '찾아 기호를 써 보세요.'),
    (r'누른 것에는 번호가 붙어요\.', '센 것에 번호를 써 두면 두 번 세지 않아요.'),
]
INTERACT = re.compile(r'눌러|누르|누를|끌어|단추|화면|컴퓨터 친구|앱|돌려서|막대를')


def paper(t):
    t = str(t or '')
    for a, b in PAPER_RULES + (ST_RULES if DATA.get('kind') == 'st' else []):
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
    st = DATA.get('kind') == 'st'
    for it in rec['items']:
        s.ask(it['q'], blank=False)
        if st and lv == '기본형' and len(it.get('help') or []) > 1:
            s.text('도움: ' + it['help'][1])
        if lv == '기본형' and it.get('tag'):
            s.labeled([(it['tag'], '')], row_h=3969 * 2)
        else:
            s.lines(3)
        ans.append(('예) ' + it['ans']) if (st and it.get('ans')) else (it['ph'] or '(생각을 쓰면 맞아요)'))
    return ' / '.join(ans)


# ---------------------------------------------------------------- 이야기 엔진 부품(panes·thenWhy·ruleFirst·wonderRecall)
def w_panes(s, lv, rec):
    """보기·생각하기·궁금해하기 세 칸(이야기 1차시) — 앱 그림에 이름을 붙여 한 번만 보여 줌"""
    fig = rec.get('fig') or {}
    figs, names = fig.get('figs') or [], fig.get('texts') or []
    if figs:
        labs = names if len(names) == len(figs) else [f['label'] for f in figs]
        side(s, list(zip(labs, [f['svg'] for f in figs])), cols=cols_for(len(figs)))
    if lv == '기본형':
        s.labeled([(it['t'], '%s  (%s)' % (it['ph'], it['hint']) if it.get('hint') else it['ph']) for it in rec['items']], row_h=3969 * 2)
    else:
        for it in rec['items']:
            s.ask(it['t'] + ':', blank=False)
            s.lines(2)
    return '(자유) ' + ' / '.join('%s 예) %s' % (it['t'], it['ex'][0]) for it in rec['items'] if it.get('ex'))


def w_thenwhy(s, lv, rec):
    s.ask('왜 그럴까요? ' + rec['q'], blank=False)
    if lv == '기본형' and len(rec.get('help') or []) > 1:
        s.text('도움: ' + rec['help'][1])
    s.lines(2)
    return '왜? 예) ' + rec['ans']


def w_rule(s, lv, rec):
    s.ask('먼저 예상해요 · ' + rec['q'], blank=False)
    if lv == '기본형' and len(rec.get('help') or []) > 1:
        s.text('도움: ' + rec['help'][1])
    s.lines(2)
    return '예상(자유) — 실제 규칙: ' + rec['ans']


def w_wonder(s, lv, rec):
    s.text('1차시에 쓴 ‘궁금해요’ 칸을 다시 보고, 이제 답할 수 있는지 떠올려 보세요.')
    return ''





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
    if CTX.get('skip_pre'):      # 이야기 1차시: 같은 그림을 panes가 이름과 함께 보여 줌
        return ''
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


def net_window(rec, maxw, vm=2):
    xs = [p[0] for f in rec['full'] for p in f['P']]
    ys = [p[1] for f in rec['full'] for p in f['P']]
    bx0, bx1, by0, by1 = min(xs), max(xs), min(ys), max(ys)
    gw = min(rec['cols'], maxw)
    ox = int(round((bx0 + bx1) / 2 - gw / 2))
    ox = max(0, min(rec['cols'] - gw, ox))
    oy0 = max(0, int(by0) - vm)
    oy1 = min(rec['rows'], int(by1 + 0.999) + vm)
    assert ox <= bx0 and bx1 <= ox + gw, ('정답 전개도가 모눈 밖으로 나가요', bx0, bx1, ox, gw)
    return ox, oy0, gw, oy1 - oy0


def rot_rec(rec):
    """모눈 전개도를 시계 방향으로 90° 돌리기(뒤집지 않음): (x, y) → (rows − y, x)"""
    R = rec['rows']
    r = dict(rec)
    r['full'] = [{'P': [[R - y, x] for x, y in f['P']], 'base': f['base']} for f in rec['full']]
    r['cols'], r['rows'] = rec['rows'], rec['cols']
    return r


def w_netdraw(s, lv, rec):
    full = rec['full']
    xs = [p[0] for f in full for p in f['P']]
    ys = [p[1] for f in full for p in f['P']]
    real = max(xs) - min(xs) <= 17
    if (not real and DATA.get('kind') == 'st' and max(ys) - min(ys) <= 15 and max(xs) - min(xs) <= 18):
        # 이야기 버전: 가로가 18 cm인 전개도는 모눈을 옆으로 돌려 실제 크기 그대로(세로 20칸 = 200 mm)
        win = net_window(rot_rec(rec), 17, vm=1)
        svg = grid_svg(rot_rec(rec), K, win)
        s.text(REAL_NOTE)
        s.text('※ 종이에 실제 크기로 들어가도록 모눈을 옆으로 돌려 놓았어요. 종이를 돌려 보아도 좋아요.')
    elif real:
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
    if DATA.get('kind') == 'st':     # 이야기 버전: 막대(모서리)와 이음새(꼭짓점) — 수는 뒤의 물음 칸에 써요
        s.text('막대(선분)와 이음새(동그라미)를 빠짐없이 세어 보세요. 센 것에 차례대로 번호를 써도 좋아요.')
        pic(s, rec['svg'], 62)
        return after(s, lv, rec)
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

WIDGETS = {'panes': w_panes, 'thenwhy': w_thenwhy, 'rule': w_rule, 'wonder': w_wonder,
           'ask': lambda s, lv, r: w_ask(s, lv, r), 'quiz': w_quiz, 'blanks': w_blanks, 'write': w_write, 'sequence': w_sequence,
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


def check_numbers(D, story=False):
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
                                kind = 'pyr' if (st['name'] == '문제 2' or '각뿔' in st['name']) else 'prism'
                    assert kind, ('표 줄의 도형을 모르겠어요', L['no'], txts)
                    for j, c in enumerate(r):
                        if 'n' not in c:
                            continue
                        hj = re.sub(r'(?:막대|이음새)\((모서리|꼭짓점)\)', r'\1', head[j])
                        keys = [k for t, k in HEAD_KEY if t in hj]
                        if not keys:   # 카드 표: 카드에 적힌 구성 요소
                            el = [k for t, k in HEAD_KEY if t in txts[0]]
                            keys = el
                        k = keys[0]
                        want = n if k == 'n' else cnt(kind, n)[k]
                        assert c['n'] == want, ('표 수가 공식과 달라요', L['no'], txts, head[j], c['n'], want)
                        ntab += 1
    c = cnt
    if story:
        check_story(seen, nexpr, ntab, D)
        return
    assert nexpr >= 3, nexpr
    assert ntab >= 60, ntab
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


def check_story(seen, nexpr, ntab, D):
    """이야기 버전: 문제의 수로 따로 계산한 값이 앱 답 중에 있는지(ST_EXPECT), 카드 값·구성 요소 공식"""
    c = cnt
    assert nexpr >= 3, nexpr
    assert ntab >= 40, ntab
    expect = [6, 12, 8,                                                       # 1차시 직육면체
              4 * 12 + 9 * 6,                                                # 4차시 정육각기둥 모서리 합(표는 위에서 공식으로)
              2, 3, c('prism', 3)['edge'] - (5 - 1),                          # 5~6차시 펼친 그림, 맞닿는 선분 짝
              2 * 5, 5, 3 * 2 * 5 + 7 * 5,                                    # 정오각기둥 모서리 합
              c('pyr', 6)['side'], 2, 1,                                      # 7차시
              5 * c('pyr', 4)['edge'],                                         # 8차시
              c('prism', 3)['edge'], c('prism', 3)['vert'], c('pyr', 4)['edge'], c('pyr', 4)['vert'],   # 9차시
              c('prism', 8)['edge'], c('prism', 8)['vert'], c('pyr', 8)['edge'], c('pyr', 8)['vert'],
              c('prism', 8)['edge'] + c('pyr', 8)['edge'], c('prism', 8)['vert'] + c('pyr', 8)['vert'],
              c('prism', 30 // 3)['vert'], c('pyr', 11 - 1)['edge'],
              c('pyr', 4)['edge'], 9 + c('pyr', 4)['edge'], c('pyr', 3)['edge'], 9 + 8 - 6,   # 10차시
              c('pyr', 5)['edge'], 90 / c('pyr', 5)['edge'], 90 / c('pyr', 5)['edge'] * 5]  # 11차시
    for v in expect:
        assert any(abs(v - n) < 1e-9 for n in seen), ('앱 답 중에 없음(이야기)', v)
    assert c('prism', 8)['vert'] == 16 and c('pyr', 9)['face'] == 10          # 꼭짓점 16개 → 팔각기둥, 면 10개 각뿔 → 구각뿔
    assert 24 // 3 == 8 and 24 // 2 == 12                                    # 막대 24개 → 팔각기둥·십이각뿔
    assert c('pyr', 7)['face'] == c('pyr', 7)['vert'] == 8 and c('prism', 5)['edge'] == 15   # 암호 7△8, 5▭15
    assert 40 - c('prism', 4)['edge'] < 45 and 40 + c('prism', 5)['vert'] >= 45 and 40 + c('prism', 8)['face'] >= 45
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


# ================================================================ 이야기 버전 차시
ST_IDS = ['s1', 's23', 's4', 's56', 's7', 's8', 's9', 's10', 's11']   # 앱 u2-prism.st.js LESSONS의 id 차례(1·2~3·4·5~6·7·8·9·10·11차시)
WHY_ST = {   # 도전형 '생각 쓰기'(앱 thenWhy·ruleFirst 물음과 겹치지 않게)
    's1': ('기둥 모양 모형과 뿔 모양 모형은 무엇이 다른지 까닭과 함께 써 보세요.',
           '예) 기둥 모양은 위와 아래(양쪽 끝)에 똑같은 면이 있고, 뿔 모양은 한쪽 끝이 뾰족해서 똑같은 두 면이 없어요.'),
    's23': ('누워 있는 삼각 텐트에서도 밑면을 찾을 수 있는 까닭을 써 보세요.',
            '예) 밑면은 아래에 있는 면이 아니라 평행하고 합동인 두 면이라서, 누워 있어도 양쪽 끝의 평행하고 합동인 삼각형 두 면이 밑면이에요.'),
    's4': ('각기둥의 높이를 옆 모서리의 길이로 잴 수 있는 까닭을 써 보세요.',
           '예) 각기둥의 옆면은 모두 직사각형이고 두 밑면과 수직으로 만나서, 옆 모서리의 길이가 두 밑면 사이의 거리(높이)와 같아요.'),
    's56': ('텐트 설계도를 그릴 때 접었을 때 맞닿는 선분의 길이를 같게 그려야 하는 까닭을 써 보세요.',
            '예) 접으면 맞닿는 두 선분이 한 모서리가 되므로, 길이가 다르면 꼭 맞게 붙지 않아 텐트(각기둥)가 만들어지지 않아요.'),
    's7': ('각뿔의 밑면의 변의 수와 옆면의 수가 같은 까닭을 써 보세요.',
           '예) 밑면의 변마다 그 변을 한 변으로 하는 삼각형 옆면이 하나씩 붙어 있어서 옆면의 수와 밑면의 변의 수가 같아요.'),
    's8': ('각뿔의 모서리의 수가 밑면의 변의 수의 2배인 까닭을 써 보세요.',
           '예) 밑면의 변(모서리)이 □개 있고, 각뿔의 꼭짓점에서 밑면의 꼭짓점으로 이어진 모서리도 □개 있어서 모두 □×2개예요.'),
    's9': ('육각기둥 몸체와 육각뿔 지붕에 필요한 막대의 수가 다른 까닭을 써 보세요.',
           '예) 막대는 모서리를 나타내요. 육각기둥은 모서리가 6×3=18개, 육각뿔은 6×2=12개라서 필요한 막대의 수가 달라요.'),
    's10': ('암호 놀이에서 서로 다른 카드의 암호가 같아질 수 있는 까닭을 써 보세요.',
            '예) 칠각뿔은 면과 꼭짓점이 모두 8개인 것처럼, 한 도형에서 구성 요소의 수가 같은 것이 있으면 옆면의 수·옆면 모양·수가 모두 같아져요.'),
    's11': ('각기둥과 각뿔의 같은 점과 다른 점을 하나씩 써 보세요.',
            '예) 같은 점: 밑면이 다각형이고 밑면의 변의 수와 옆면의 수가 같아요. 다른 점: 각기둥은 밑면이 2개이고 옆면이 직사각형, 각뿔은 밑면이 1개이고 옆면이 삼각형이에요.'),
}


def st_step_label(i, name):
    parts = name.split(' — ', 1)
    return ('%s %s' % (NUM[i], label_of(parts[0])), parts[1] if len(parts) > 1 else None)


def st_lesson(s, lv, L, first, story):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if first and story:
        s.scene(None, story['lines'][0])
    ans = []
    for i, st_ in enumerate(L['steps']):
        s.step(*st_step_label(i, st_['name']))
        show_inst(s, lv, st_['inst'], st_['hints'])
        CTX['cur'] = (L['id'], st_['name'])
        CTX['skip_pre'] = any(r['t'] == 'panes' for r in st_['recs'])
        got = [run_rec(s, lv, r) for r in st_['recs']]
        CTX['skip_pre'] = False
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
        q, a = WHY_ST.get(L['id'], ('오늘 배운 내용을 친구에게 설명하듯 써 보세요.', '예) ' + L['summary'].split('. ')[0] + '.'))
        s.step('%s 생각 쓰기' % NUM[n], '왜 그럴까요?')
        s.ask(q, blank=False)
        s.lines(3)
        ans.append('%s %s' % (NUM[n], a))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


def _st(lid):
    def f(s, lv):
        Ls = DATA['lessons']
        k = [L['id'] for L in Ls].index(lid)
        return st_lesson(s, lv, Ls[k], k == 0, DATA.get('story'))
    f.__name__ = 'st_' + lid
    return f


ST = [_st(i) for i in ST_IDS]

# ================================================================ 도전형: ①~⑤(도전하기 앞의 모든 칸)를 새 문제로(2026-10-30)
# 기본형은 앱에서 읽은 그대로 두고, 도전형은 같은 칸 이름·같은 부품(표·고르기·색칠·전개도 …)에 새 도형(칠각기둥·구각뿔 …)과
# 새 물음을 넣은 기록(HARD_TB·HARD_ST)으로 바꿉니다. 수는 cnt()로 계산해 넣고, 그림은 아래 solid_svg·net_svg가 새로 그립니다.
import copy  # noqa: E402
import math  # noqa: E402


def S_(t):
    return {'s': t}


def N_(v):
    return {'n': v}


def O_(o, a=0):
    return {'o': list(o), 'a': a, 'multi': isinstance(a, list)}


BR = {'br': 1}


def _p(parts):
    return [p if isinstance(p, dict) else S_(p) for p in parts]


def AI(q, *parts, fig=None):
    return {'q': q, 'fig': fig, 'o': None, 'parts': _p(parts)}


def ASK(*items):
    return {'t': 'ask', 'items': list(items), 'title': ''}


def QI(q, o, a=0, fig=None):
    return {'q': q, 'fig': fig, 'o': list(o), 'a': a, 'parts': None}


def QUIZ(*items):
    return {'t': 'quiz', 'items': list(items)}


def BLK(*parts):
    return {'t': 'blanks', 'parts': _p(parts)}


def FIG(*pairs):
    return {'figs': [{'svg': g, 'label': lab} for lab, g in pairs], 'text': '', 'texts': [lab for lab, g in pairs]}


def CH(*parts):
    """chain: parts = (제목, [기록…], [(이름, 그림)…]) 또는 [기록…]"""
    out = []
    for p in parts:
        if isinstance(p, tuple):
            title, recs, figs = (p + ([],))[:3]
        else:
            title, recs, figs = None, p, []
        out.append({'title': title, 'recs': recs, 'extra': [{'figs': [{'svg': g, 'label': lab} for lab, g in figs], 'text': '', 'small': False}] if figs else []})
    return {'t': 'chain', 'parts': out}


def TBL(head, rows, q=None):
    def cell(c):
        if isinstance(c, dict):
            return c
        return {'n': c} if isinstance(c, (int, float)) else {'s': c}
    return {'t': 'pp6Table', 'q': q, 'head': head, 'rows': [[cell(c) for c in r] for r in rows], 'ask': []}


def PICK(q, items, a, ask=()):
    return {'t': 'pp6Pick', 'q': q, 'items': [{'name': nm, 'svg': g} for nm, g in items], 'a': a, 'ask': list(ask)}


def SORT(q, bins, items, ask=()):
    return {'t': 'pp6Sort', 'q': q, 'bins': bins, 'items': [{'name': nm, 'svg': g, 'bin': b} for nm, g, b in items], 'ask': list(ask)}


def TAP(items, pens=('밑면',), multi=True, ask=()):
    col = {'밑면': '빨간색', '옆면': '파란색'}
    out = []
    for nm, kind, n in items:
        sets = []
        for pen in pens:
            if pen == '밑면':
                sets.append({'pen': pen, 'col': col[pen], 'n': 2 if kind == 'prism' else 1, 'names': [], 'shape': POLY[n]})
            else:
                sets.append({'pen': pen, 'col': col[pen], 'n': n, 'names': [], 'shape': '직사각형' if kind == 'prism' else '삼각형'})
        out.append({'name': nm, 'lab': False, 'kind': kind, 'n': n, 'svg': solid_svg(kind, n), 'sets': sets})
    return {'t': 'pp6Tap', 'q': None, 'multi': multi, 'pens': [{'t': p, 'n': col[p]} for p in pens], 'items': out, 'ask': list(ask)}


def PARTS(kind, n, ask=()):
    c = cnt(kind, n)
    return {'t': 'pp6Parts', 'q': None, 'svg': solid_svg(kind, n), 'nE': c['edge'], 'nV': c['vert'], 'apex': kind == 'pyr', 'kind': kind, 'n': n, 'ask': list(ask)}


def SKEL(kind, n, ask=()):
    c = cnt(kind, n)
    return {'t': 'pp6Skeleton', 'q': None, 'svg': solid_svg(kind, n, balls=True), 'nE': c['edge'], 'nV': c['vert'], 'kind': kind, 'n': n, 'ask': list(ask)}


def WRITE(*items):
    return {'t': 'write', 'items': [{'q': q, 'tag': tag, 'ans': re.sub(r'^예\) ', '', ans), 'ph': ans} for q, tag, ans in items]}


def TW(q, ans):
    return {'t': 'thenwhy', 'q': q, 'ans': ans, 'help': []}


def RF(q, ans):
    return {'t': 'rule', 'q': q, 'ans': ans, 'help': []}


def PANES(*items, fig=None):
    return {'t': 'panes', 'fig': fig, 'items': [{'t': t, 'ph': ph, 'ex': [ex]} for t, ph, ex in items]}


def PNAME(kind, n):
    return KN[n] + ('기둥' if kind == 'prism' else '뿔')


# ---------------------------------------------------------------- 새 그림: 겨냥도와 전개도
def solid_svg(kind, n, balls=False):
    """n각기둥·n각뿔 겨냥도(보이지 않는 모서리는 점선). balls: 꼭짓점에 동그라미(이쑤시개 모형)"""
    W, H, cx, rx, ry = 230, 210, 115, 82, 26
    yb, yt = 168, 62
    off = 0.0 if n % 2 == 0 else math.pi / 2
    ang = [off + 2 * math.pi * k / n for k in range(n)]
    P = [(cx + rx * math.cos(a), yb + ry * math.sin(a)) for a in ang]
    back = [math.sin(a) < -0.2 for a in ang]
    xs = [p[0] for p in P]
    sil = {xs.index(min(xs)), xs.index(max(xs))}
    out = []
    dash = '7 6'
    for k in range(n):
        a, b = P[k], P[(k + 1) % n]
        mid = math.sin((ang[k] + ang[(k + 1) % n]) / 2 + (math.pi if k == n - 1 else 0))
        hidden = math.sin(ang[k]) + math.sin(ang[(k + 1) % n]) < -0.05
        out.append(_ln(a, b, INK, 2.6, dash if hidden else None))
    if kind == 'prism':
        T = [(x, y - (yb - yt)) for x, y in P]
        poly = ' '.join('%.1f,%.1f' % p for p in T)
        out.insert(0, '<polygon points="%s" fill="%s" stroke="none"/>' % (poly, SIDE_C))
        for k in range(n):
            out.append(_ln(T[k], T[(k + 1) % n], INK, 2.6))
            out.append(_ln(P[k], T[k], INK, 2.6, dash if back[k] and k not in sil else None))
        pts = P + T
    else:
        A = (cx, 24)
        for k in range(n):
            out.append(_ln(A, P[k], INK, 2.6, dash if back[k] and k not in sil else None))
        pts = P + [A]
    if balls:
        for p in pts:
            out.append('<circle cx="%.1f" cy="%.1f" r="7" fill="#fff" stroke="%s" stroke-width="2.4"/>' % (p[0], p[1], INK))
    return _svg(W, H, ''.join(out))


def _reg(A, B, n, up=True):
    """선분 AB를 한 변으로 하는 정n각형(위쪽 또는 아래쪽)"""
    pts = [A, B]
    dx, dy = B[0] - A[0], B[1] - A[1]
    t = (-1 if up else 1) * 2 * math.pi / n
    for _ in range(n - 2):
        dx, dy = dx * math.cos(t) - dy * math.sin(t), dx * math.sin(t) + dy * math.cos(t)
        pts.append((pts[-1][0] + dx, pts[-1][1] + dy))
    return pts


def net_svg(n, h=1.6, tops=(0,), bottoms=(0,), nside=None, w=1.0):
    """정n각형 밑면의 각기둥 펼친 그림: 옆면 nside개를 한 줄로, 밑면은 tops(위)·bottoms(아래) 옆면에 붙임"""
    nside = n if nside is None else nside
    U = 46
    polys = []
    for k in range(nside):
        polys.append(([(k * w, 0), ((k + 1) * w, 0), ((k + 1) * w, h), (k * w, h)], SIDE_C))
    for k in tops:
        polys.append((_reg((k * w, 0), ((k + 1) * w, 0), n, up=True), BASE_C))
    for k in bottoms:
        polys.append((_reg(((k + 1) * w, h), (k * w, h), n, up=True), BASE_C))
    xs = [x for P, c in polys for x, y in P]
    ys = [y for P, c in polys for x, y in P]
    x0, y0 = min(xs), min(ys)
    pad = 10
    out = []
    for P, c in polys:
        out.append('<polygon points="%s" fill="%s" stroke="%s" stroke-width="2.6" stroke-linejoin="round"/>'
                   % (' '.join('%.1f,%.1f' % (pad + (x - x0) * U, pad + (y - y0) * U) for x, y in P), c, INK))
    return _svg((max(xs) - x0) * U + 2 * pad, (max(ys) - y0) * U + 2 * pad, ''.join(out))


def NETJ(cards, ask=()):
    return {'t': 'pp6NetJudge', 'q': None, 'cards': [{'name': nm, 'svg': g, 'ok': ok, 'res': ''} for nm, g, ok in cards], 'ask': list(ask)}


def NETDRAW(full, given, cols, rows, n, bshape):
    return {'t': 'pp6NetDraw', 'q': None, 'full': [{'P': P, 'base': b} for P, b in full], 'given': given, 'cols': cols, 'rows': rows,
            'differ': False, 'n': n, 'bshape': bshape, 'nb': 2, 'nsd': n, 'ask': []}


def harden(D, kind):
    """도전형: 차시마다 칸(step)의 안내 글과 기록을 HARD_*의 새 문제로 바꿈(칸 이름은 그대로)"""
    D = copy.deepcopy(D)
    H = HARD_TB if kind == 'tb' else HARD_ST
    for L in D['lessons']:
        new = H[L['id']]
        assert len(new) == len(L['steps']), ('도전형 칸 수가 앱과 달라요', L['id'], len(new), len(L['steps']))
        for st_, (inst, recs) in zip(L['steps'], new):
            st_['inst'], st_['recs'], st_['hints'] = inst, recs, []
    return D


def _cn(kind, n, key):
    return cnt(kind, n)[key]


PR, PY = 'prism', 'pyr'


c_ = _cn
PRISM_NET_TRI = [([[4, 5], [7, 5], [7, 8], [4, 8]], False), ([[7, 5], [11, 5], [11, 8], [7, 8]], False), ([[11, 5], [16, 5], [16, 8], [11, 8]], False),
                 ([[7, 5], [11, 5], [7, 2]], True), ([[7, 8], [11, 8], [7, 11]], True)]
PRISM_NET_BOX = [([[3, 5], [6, 5], [6, 9], [3, 9]], False), ([[6, 5], [8, 5], [8, 9], [6, 9]], False), ([[8, 5], [11, 5], [11, 9], [8, 9]], False),
                 ([[11, 5], [13, 5], [13, 9], [11, 9]], False), ([[3, 3], [6, 3], [6, 5], [3, 5]], True), ([[3, 9], [6, 9], [6, 11], [3, 11]], True)]

HARD_TB = {
    't1': [
        ('주상 절리 기둥 다섯 개를 위에서 보았더니 오각형, 육각형, 육각형, 칠각형, 사각형 모양이 보였어요. 물음에 답해 보세요.', [ASK(
            AI('위에서 본 모양을 살펴보세요.', '가장 많이 보인 모양은 ', O_(['육각형', '오각형', '칠각형']), '이고, 그 모양의 꼭짓점은 ', N_(6), '개예요.', BR,
               '변이 가장 많은 모양은 ', O_(['칠각형', '육각형', '사각형']), '이고, 다섯 모양의 변의 수를 모두 더하면 ', N_(5 + 6 + 6 + 7 + 4), '개예요.'))]),
        ('기둥 모양과 뿔 모양의 특징을 떠올려 답해 보세요.', [QUIZ(
            QI('주상 절리처럼 위와 아래에 똑같은 모양의 면이 있는 것은 어떤 모양인가요?', ['기둥 모양', '뿔 모양', '공 모양']),
            QI('한쪽 끝이 뾰족한 모양은 무엇인가요?', ['뿔 모양', '기둥 모양', '평면 모양']),
            QI('보물을 찾으려면 여러 가지 모양을 살펴보고 무엇을 알아야 한다고 했나요?', ['그 모양의 이름', '바다의 깊이', '보물의 무게']))]),
        ('우리 주변의 물건이에요. 기둥 모양인지 뿔 모양인지 나누어 보세요.', [SORT(None, ['기둥 모양', '뿔 모양'], [
            ('육각 연필', None, 0), ('이집트의 피라미드', None, 1), ('삼각김밥 포장 상자', None, 0), ('뾰족한 탑 지붕', None, 1),
            ('벌집 한 칸', None, 0), ('사각뿔 모양 문진', None, 1), ('주사위', None, 0)])]),
        ('4학년과 5학년 때 배운 다각형과 직육면체를 떠올려 보세요.', [ASK(
            AI('칠각형의 변과 꼭짓점은 각각 몇 개인가요?', '변 ', N_(7), '개, 꼭짓점 ', N_(7), '개'),
            AI('직육면체에서 한 꼭짓점에서 만나는 모서리와 서로 평행한 면의 쌍을 세어 보세요.', '한 꼭짓점에서 만나는 모서리 ', N_(3), '개, 서로 평행한 면 ', N_(3), '쌍',
               fig=FIG(('', solid_svg(PR, 4)))))]),
        ('이 단원에서 배울 내용을 차례대로 늘어놓고, 배우고 싶은 것을 질문으로 써 보세요.', [CH(
            [{'t': 'sequence', 'cards': ['각기둥을 알아볼까요', '각기둥의 전개도를 알아볼까요', '각뿔을 알아볼까요', '필요한 재료의 수를 구해 볼까요', '구성 요소의 수를 더하고 빼 볼까요'],
              'order': [0, 1, 2, 3, 4]}],
            [WRITE(('기둥 모양과 뿔 모양의 물건을 하나씩 찾아 어떤 점이 다른지 써 보세요.', '찾은 물건', '예) 필통은 위아래가 똑같은 기둥 모양이고, 고깔모자는 끝이 뾰족한 뿔 모양이에요.'),
                   ('이 단원에서 알고 싶은 것을 질문 하나로 만들어 써 보세요.', '내 질문', '예) 각기둥의 모서리의 수는 어떻게 하면 세지 않고 알 수 있을까?'))])]),
    ],
    't23': [
        ('돌 조각의 설명을 읽고 각기둥인 것과 아닌 것으로 나누어 보세요.', [SORT(None, ['각기둥이에요', '각기둥이 아니에요'], [
            ('평행하고 합동인 두 육각형이 있고, 나머지 면이 모두 직사각형인 돌 조각', None, 0),
            ('평행한 두 사각형이 있지만 크기가 서로 다른 돌 조각', None, 1),
            ('평행한 두 면이 하나도 없는 돌 조각', None, 1),
            ('평행하고 합동인 두 면이 원인 돌 조각', None, 1),
            ('평행하고 합동인 두 삼각형이 있고, 나머지 면이 모두 직사각형인 돌 조각', None, 0)])]),
        ('각기둥의 뜻을 떠올리고, 각기둥을 모두 찾아보세요.', [CH(
            [BLK('각기둥은 서로 평행한 두 면이 ', O_(['합동인 다각형', '크기가 다른 다각형', '원']), '이고, 나머지 면이 모두 ', O_(['직사각형', '삼각형']),
                 '인 입체도형이에요. 그래서 평행한 두 면이 원인 입체도형은 각기둥이 ', O_(['아니에요', '맞아요']), '.')],
            [PICK('각기둥을 모두 찾아보세요.', [('가', solid_svg(PR, 5)), ('나', solid_svg(PY, 4)), ('다', solid_svg(PR, 7)), ('라', solid_svg(PY, 6)), ('마', solid_svg(PR, 3))], [0, 2, 4])])]),
        ('각기둥의 밑면을 떠올리고, 여러 각기둥에서 밑면을 찾아보세요.', [CH(
            [QUIZ(QI('각기둥의 두 밑면에 대한 설명으로 옳은 것을 모두 고르세요.', ['서로 평행해요.', '서로 합동이에요.', '언제나 위와 아래에 있어요.', '옆면과 수직으로 만나요.'], [0, 1, 3]))],
            [TAP([('가', PR, 5), ('나', PR, 7), ('다', PR, 8)])])]),
        ('각기둥의 옆면을 떠올리고, 옆면의 수와 밑면의 관계를 알아보세요.', [CH(
            [TAP([('', PR, 6)], pens=('밑면', '옆면'), multi=False)],
            [ASK(AI('옆면의 수와 밑면의 모양 사이의 관계를 이용해 보세요.', '팔각기둥의 옆면은 ', N_(8), '개이고 모두 ', O_(['직사각형', '삼각형', '팔각형']), '이에요.', BR,
                    '옆면이 9개인 각기둥의 밑면은 ', O_(['구각형', '팔각형', '십각형']), '이에요.'))])]),
        ('각기둥 모양의 물건을 찾고, 각기둥에 대한 설명을 확인해 보세요.', [QUIZ(
            QI('각기둥 모양인 것을 모두 고르세요.', ['벌집 한 칸', '삼각김밥 포장 상자', '이집트의 피라미드', '육각 연필', '고깔모자'], [0, 1, 3]),
            QI('각기둥에 대해 잘못 설명한 것을 고르세요.', ['㉠ 옆면의 수와 한 밑면의 변의 수가 같아요.', '㉡ 두 밑면은 서로 평행해요.', '㉢ 옆면은 모두 삼각형이에요.'], 2))]),
    ],
    't4': [
        ('각기둥 가, 나, 다의 밑면을 빨간색으로 색칠하고 밑면의 모양과 이름을 써 보세요.', [TAP([('가', PR, 6), ('나', PR, 8), ('다', PR, 9)], ask=[
            AI('밑면의 모양을 써 보세요.', '가: ', O_(['육각형', '팔각형', '구각형']), '  나: ', O_(['육각형', '팔각형', '구각형'], 1), '  다: ', O_(['육각형', '팔각형', '구각형'], 2)),
            AI('각기둥의 이름을 써 보세요.', '가: ', O_(['육각기둥', '팔각기둥', '구각기둥']), '  나: ', O_(['육각기둥', '팔각기둥', '구각기둥'], 1), '  다: ', O_(['육각기둥', '팔각기둥', '구각기둥'], 2))])]),
        ('각기둥의 이름을 약속에 따라 거꾸로 생각해 보세요.', [ASK(
            AI('밑면과 옆면으로 이름을 알아보세요.', '밑면이 구각형인 각기둥은 ', O_(['구각기둥', '구각뿔', '구각형']), '이고, 옆면이 10개인 각기둥은 ', O_(['십각기둥', '팔각기둥', '구각기둥']), '이에요.'))]),
        ('오각기둥의 모서리와 꼭짓점을 표시하고, 높이와 구성 요소를 알아보세요.', [CH(
            [PARTS(PR, 5)],
            [ASK(AI('높이가 7 cm인 오각기둥이에요.', '옆면끼리 만나서 생긴 모서리의 길이는 ', N_(7), ' cm이고, 이런 모서리는 모두 ', N_(5), '개예요.'))],
            [BLK('각기둥에서 두 밑면 사이의 거리를 ', O_(['높이', '모서리', '꼭짓점']), '라 하고, 모서리와 모서리가 만나는 점을 ', O_(['꼭짓점', '높이', '모서리']), '이라고 해요.')])]),
        ('각기둥의 이름과 구성 요소의 수를 구해 표를 완성해 보세요. 그림 없이 규칙으로 구해요.', [TBL(
            ['밑면의 모양', '이름', '면의 수(개)', '모서리의 수(개)', '꼭짓점의 수(개)'],
            [[POLY[n], PNAME(PR, n), c_(PR, n, 'face'), c_(PR, n, 'edge'), c_(PR, n, 'vert')] for n in (7, 9, 10)])]),
        ('조건에 맞는 각기둥을 찾아보세요.', [ASK(
            AI('1. 면의 수와 꼭짓점의 수의 합이 29인 각기둥이에요.', '이 각기둥은 ', O_(['구각기둥', '팔각기둥', '십각기둥']), '이고, 모서리는 ', N_(c_(PR, 9, 'edge')), '개예요.'),
            AI('2. 모서리가 30개인 각기둥이에요.', '한 밑면의 변은 ', N_(10), '개이고, 면은 ', N_(c_(PR, 10, 'face')), '개예요.'))]),
    ],
    't56': [
        ('오각기둥 모양 상자를 펼친 그림이에요. 밑면과 옆면을 찾아 표시해 보세요.', [{
            't': 'pp6NetMark', 'q': None, 'svg': net_svg(5, tops=(1,), bottoms=(3,)), 'nb': 2, 'ns': 5, 'bshape': '오각형', 'kind': 'prism', 'ask': [
                AI(None, '밑면은 ', O_(['오각형', '직사각형']), ' 모양 ', N_(2), '개, 옆면은 ', O_(['오각형', '직사각형'], 1), ' 모양 ', N_(5), '개예요.', BR,
                   '이 그림을 접으면 ', O_(['오각기둥', '오각뿔', '육각기둥']), '이 돼요.')]}]),
        ('펼친 그림을 접었을 때 맞닿는 선분을 찾고, 전개도를 그리는 약속을 떠올려 보세요.', [CH(
            [{'t': 'pp6NetPairs', 'q': None, 'pairs': 2 * 5 - 1, 'svg': net_svg(5, tops=(1,), bottoms=(3,)), 'ask': []}],
            [BLK('전개도에서 잘린 모서리는 ', O_(['실선', '점선']), '으로, 잘리지 않은 모서리는 ', O_(['점선', '실선']), '으로 그려요. 육각기둥의 전개도에서 맞닿는 선분은 모두 ', N_(2 * 6 - 1), '쌍이에요.')])]),
        ('각기둥의 전개도가 될 수 있는 것을 찾아보세요. 먼저 예상하고, 머릿속으로 접어서 확인해요.', [NETJ([
            ('가', net_svg(5, tops=(2,), bottoms=(0,)), True), ('나', net_svg(4, tops=(0, 2), bottoms=()), False),
            ('다', net_svg(3, tops=(1,), bottoms=(1,)), True), ('라', net_svg(6, nside=5, tops=(1,), bottoms=(3,), w=0.8), False)], ask=[
            AI('전개도가 될 수 있는 것과 그 각기둥의 이름을 써 보세요.', '가: ', O_(['오각기둥', '사각기둥', '삼각기둥']), '  다: ', O_(['오각기둥', '사각기둥', '삼각기둥'], 2)),
            AI('전개도가 될 수 없는 까닭을 짝지어 보세요.', '나: ', O_(['밑면 2개가 같은 쪽에 있어 접으면 겹쳐요.', '밑면이 육각형인데 옆면이 5개뿐이에요.']), BR,
               '라: ', O_(['밑면 2개가 같은 쪽에 있어 접으면 겹쳐요.', '밑면이 육각형인데 옆면이 5개뿐이에요.'], 1))])]),
        ('밑면이 세 변 3 cm, 4 cm, 5 cm인 직각삼각형이고 높이가 3 cm인 삼각기둥의 전개도를 완성해 보세요.', [CH(
            [BLK('삼각기둥의 전개도에는 밑면 ', N_(2), '개와 옆면 ', N_(3), '개가 있고, 옆면은 모두 ', O_(['직사각형', '삼각형']), '이에요. 옆면 세 개의 가로는 각각 밑면의 ', O_(['세 변의 길이', '높이']), '와 같아요.')],
            ('전개도를 완성해 보세요. (옆면 1개와 밑면 1개를 더 그려요)', [NETDRAW(PRISM_NET_TRI, [0, 1, 3], 20, 14, 3, '삼각형')], [('', solid_svg(PR, 3))]))]),
        ('밑면이 가로 3 cm, 세로 2 cm인 직사각형이고 높이가 4 cm인 사각기둥의 전개도를 완성하고, 오각기둥의 옆면을 생각해 보세요.', [CH(
            ('사각기둥의 전개도를 완성해 보세요. (옆면 2개와 밑면 1개를 더 그려요)', [NETDRAW(PRISM_NET_BOX, [0, 1, 4], 18, 14, 4, '사각형')], [('', solid_svg(PR, 4))]),
            [ASK(AI('밑면이 한 변 2 cm인 정오각형이고 높이가 5 cm인 오각기둥의 전개도에서 옆면 5개를 한 줄로 이으면 큰 직사각형이 돼요.',
                    '이 직사각형의 가로는 ', N_(2 * 5), ' cm, 세로는 ', N_(5), ' cm예요.'))])]),
    ],
    't7': [
        ('건물의 설명을 읽고 각뿔인 것과 아닌 것으로 나누어 보세요.', [SORT(None, ['각뿔이에요', '각뿔이 아니에요'], [
            ('밑면이 육각형이고 옆면이 모두 삼각형인 건물', None, 0), ('밑면이 원이고 끝이 뾰족한 건물', None, 1),
            ('옆면이 모두 직사각형인 건물', None, 1), ('밑면이 사각형이고 삼각형 옆면 4개가 한 점에서 만나는 건물', None, 0),
            ('평행하고 합동인 두 오각형이 있는 건물', None, 1)])]),
        ('각뿔의 뜻을 떠올리고, 각뿔을 모두 찾아보세요.', [CH(
            [BLK('밑면이 ', O_(['한 개', '두 개']), '인 다각형이고, 옆으로 둘러싼 면이 모두 ', O_(['삼각형', '직사각형']), '인 입체도형을 각뿔이라고 해요.')],
            [PICK('각뿔을 모두 찾아 기호를 써 보세요.', [('가', solid_svg(PY, 7)), ('나', solid_svg(PR, 6)), ('다', solid_svg(PY, 3)), ('라', solid_svg(PR, 4)), ('마', solid_svg(PY, 8))], [0, 2, 4])])]),
        ('각뿔의 밑면과 옆면을 떠올려 보세요.', [CH(
            [QUIZ(QI('각뿔의 밑면은 몇 개인가요?', ['1개', '2개', '옆면의 수만큼']), QI('각뿔의 옆면은 모두 어떤 도형인가요?', ['삼각형', '직사각형', '밑면과 같은 다각형']))],
            (None, [BLK('육각뿔에서 밑면과 만나는 면을 ', O_(['옆면', '밑면']), '이라고 하고, 육각뿔의 옆면은 ', N_(6), '개예요.')], [('', solid_svg(PY, 6))]))]),
        ('칠각뿔에서 밑면과 옆면을 모두 찾아 색칠해 보세요.', [TAP([('', PY, 7)], pens=('밑면', '옆면'), multi=False, ask=[
            AI('밑면의 모양과 옆면의 수의 관계를 이용해 보세요.', '칠각뿔의 옆면은 ', N_(7), '개예요. 옆면이 10개인 각뿔의 밑면은 ', O_(['십각형', '구각형', '오각형']), '이에요.')])]),
        ('각뿔 모양의 물건을 찾고, 각뿔과 각기둥을 견주어 보세요.', [QUIZ(
            QI('각뿔 모양인 것을 모두 고르세요.', ['이집트의 피라미드', '육각 연필', '사각뿔 모양 문진', '벌집 한 칸', '삼각뿔 모양 텐트'], [0, 2, 4]),
            QI('옳게 설명한 것을 고르세요.', ['㉠ 각뿔의 밑면은 2개예요.', '㉡ 각뿔의 옆면의 수는 밑면의 변의 수와 같아요.', '㉢ 각기둥의 옆면은 삼각형이에요.'], 1))]),
    ],
    't8': [
        ('각뿔 가, 나, 다의 밑면을 빨간색으로 색칠하고 밑면의 모양과 이름을 써 보세요.', [TAP([('가', PY, 7), ('나', PY, 9), ('다', PY, 10)], ask=[
            AI('각뿔의 이름을 써 보세요.', '가: ', O_(['칠각뿔', '구각뿔', '십각뿔']), '  나: ', O_(['칠각뿔', '구각뿔', '십각뿔'], 1), '  다: ', O_(['칠각뿔', '구각뿔', '십각뿔'], 2))])]),
        ('각뿔의 이름을 약속에 따라 거꾸로 생각해 보세요.', [ASK(
            AI('밑면과 옆면으로 이름을 알아보세요.', '밑면이 구각형인 각뿔은 ', O_(['구각뿔', '구각기둥', '구각형']), '이고, 옆면이 10개인 각뿔은 ', O_(['십각뿔', '구각뿔', '십각기둥']), '이에요.'))]),
        ('육각뿔의 모서리와 꼭짓점을 표시하고, 높이를 재는 방법을 알아보세요.', [CH(
            [PARTS(PY, 6)],
            [QUIZ(QI('각뿔의 높이를 바르게 재는 방법을 고르세요.', ['각뿔의 꼭짓점에서 밑면에 수직으로 내린 선분의 길이를 재요.', '옆면의 모서리 길이를 재요.', '밑면의 한 변의 길이를 재요.']))],
            [BLK('육각뿔의 꼭짓점 가운데 옆면이 모두 만나는 점은 ', N_(1), '개이고, 이 점을 ', O_(['각뿔의 꼭짓점', '밑면의 꼭짓점']), '이라고 해요.')])]),
        ('각뿔의 이름과 구성 요소의 수를 구해 표를 완성해 보세요. 꼭짓점의 수를 셀 때 각뿔의 꼭짓점을 빼놓지 않아요.', [TBL(
            ['밑면의 모양', '이름', '면의 수(개)', '모서리의 수(개)', '꼭짓점의 수(개)'],
            [[POLY[n], PNAME(PY, n), c_(PY, n, 'face'), c_(PY, n, 'edge'), c_(PY, n, 'vert')] for n in (6, 9, 10)])]),
        ('조건에 맞는 각뿔을 찾아보세요.', [ASK(
            AI('1. 모서리가 18개인 각뿔이에요.', '이 각뿔은 ', O_(['구각뿔', '십팔각뿔', '육각뿔']), '이고, 꼭짓점은 ', N_(c_(PY, 9, 'vert')), '개예요.'),
            AI('2. 면의 수와 꼭짓점의 수의 합이 22인 각뿔이에요.', '이 각뿔은 ', O_(['십각뿔', '십일각뿔', '구각뿔']), '이고, 모서리는 ', N_(c_(PY, 10, 'edge')), '개예요.'))]),
    ],
    't9': [
        ('윤우는 이번에는 팔각기둥을 만들려고 해요. 모서리는 이쑤시개로, 꼭짓점은 스타이로폼 공으로 나타내요. 먼저 문제를 이해해 보세요.', [CH(
            [QUIZ(QI('구하려는 것은 무엇인가요?', ['팔각기둥을 만드는 데 필요한 이쑤시개와 스타이로폼 공의 수', '팔각기둥의 면의 수', '윤우가 만든 각기둥의 높이']))],
            ('오각기둥 모형의 이쑤시개와 스타이로폼 공을 세어 보세요.', [SKEL(PR, 5)]),
            [TBL(['모형', '한 밑면의 변의 수(개)', '모서리의 수(개)', '꼭짓점의 수(개)'],
                 [[PNAME(PR, n), n, c_(PR, n, 'edge'), c_(PR, n, 'vert')] for n in (4, 5, 6)], q='각기둥 모형의 수를 표로 정리해 보세요.')])]),
        ('문제를 어떻게 해결할지 계획을 세워 보세요.', [BLK(
            '팔각기둥에 필요한 이쑤시개의 수는 팔각기둥의 ', O_(['모서리', '꼭짓점', '면']), '의 수와 같고, 스타이로폼 공의 수는 ', O_(['모서리', '꼭짓점', '면'], 1),
            '의 수와 같아요. 또, 이쑤시개 33개로 만들 수 있는 각기둥은 ', O_(['십일각기둥', '십각기둥', '구각기둥']), '이에요.')]),
        ('한 밑면의 변의 수와 모서리·꼭짓점의 수 사이의 관계로 문제를 해결해 보세요.', [ASK(
            AI('팔각기둥을 만드는 데 필요한 재료는 각각 몇 개인가요?', '이쑤시개: 8×3=', N_(24), '(개), 스타이로폼 공: 8×2=', N_(16), '(개)'),
            AI('이쑤시개 42개를 모두 써서 각기둥 하나를 만들었어요. 필요한 스타이로폼 공은 몇 개인가요?', '한 밑면의 변의 수: 42÷3=', N_(14), ', 스타이로폼 공: 14×2=', N_(28), '(개)'))]),
        ('표를 이어 그려 규칙을 찾고, 거꾸로 생각해 보세요.', [CH(
            [TBL(['한 밑면의 변의 수(개)', '7', '9', '11', '12'],
                 [['모서리의 수(개)'] + [c_(PR, n, 'edge') for n in (7, 9, 11, 12)], ['꼭짓점의 수(개)'] + [c_(PR, n, 'vert') for n in (7, 9, 11, 12)]],
                 q='표를 완성해 보세요.')],
            [ASK(AI('스타이로폼 공 26개를 모두 써서 각기둥 하나를 만들려고 해요.', '한 밑면의 변의 수: 26÷2=', N_(13), ', 필요한 이쑤시개: 13×3=', N_(39), '(개)'))],
            [WRITE(('이쑤시개의 수를 알 때 각기둥의 이름을 찾는 방법을 친구에게 설명하듯 써 보세요.', '찾는 방법', '예) 이쑤시개의 수는 모서리의 수이므로 3으로 나누면 한 밑면의 변의 수가 나와요. 그 수로 각기둥의 이름을 정해요.'))])]),
        ('지수는 각뿔 모형을 만들어요. 구각뿔을 만드는 데 필요한 재료의 수를 구하고, 거꾸로도 생각해 보세요.', [CH(
            ('오각뿔 모형의 이쑤시개와 스타이로폼 공을 세어 보세요.', [SKEL(PY, 5)]),
            [TBL(['모형', '밑면의 변의 수(개)', '모서리의 수(개)', '꼭짓점의 수(개)'],
                 [[PNAME(PY, n), n, c_(PY, n, 'edge'), c_(PY, n, 'vert')] for n in (6, 7, 8)], q='표를 완성해 보세요.')],
            [ASK(AI('관계를 이용해 구해 보세요.', '구각뿔: 이쑤시개 9×2=', N_(18), '(개), 스타이로폼 공 9+1=', N_(10), '(개)', BR,
                    '이쑤시개 24개로 만든 각뿔: 밑면의 변의 수 24÷2=', N_(12), ', 스타이로폼 공 ', N_(13), '개'))])]),
    ],
    't10': [
        ('새 도형 카드예요. 카드에 적힌 구성 요소의 수를 구해 보세요.', [TBL(
            ['카드', '구성 요소의 수(개)'],
            [['+ 칠각기둥 · 모서리의 수', c_(PR, 7, 'edge')], ['− 팔각뿔 · 면의 수', c_(PY, 8, 'face')], ['+ 육각기둥 · 꼭짓점의 수', c_(PR, 6, 'vert')],
             ['− 구각뿔 · 모서리의 수', c_(PY, 9, 'edge')], ['+ 십각기둥 · 옆면의 수', 10], ['+ 오각뿔 · 꼭짓점의 수', c_(PY, 5, 'vert')]])]),
        ('시작 수는 9, 끝 수는 48로 정했어요. 카드를 차례로 내려놓으며 외친 값을 구해 보세요.', [CH(
            [ASK(AI('네 사람이 차례로 카드를 냈어요.', '첫째(+ 칠각기둥·모서리): 9 + 21 = ', N_(30), BR, '둘째(− 팔각뿔·면): 30 − 9 = ', N_(21), BR,
                    '셋째(+ 육각기둥·꼭짓점): 21 + 12 = ', N_(33), BR, '넷째(− 구각뿔·모서리): 33 − 18 = ', N_(15)))],
            [QUIZ(QI('끝 수가 48이고 지금 값이 40일 때 내면 좋은 카드를 고르세요.', ['− 구각뿔·모서리의 수', '+ 칠각기둥·모서리의 수', '+ 육각기둥·꼭짓점의 수']))])]),
        ('시작 수 8, 끝 수 45로 연습해 보세요. 카드를 낼 때마다 값을 구하고, 끝 수 이상이 되는 때를 찾아요.', [ASK(
            AI(None, '+ 오각기둥·면의 수: 8 + ', N_(7), ' = ', N_(15), BR, '+ 팔각뿔·모서리의 수: 15 + ', N_(16), ' = ', N_(31), BR,
               '− 육각뿔·꼭짓점의 수: 31 − ', N_(7), ' = ', N_(24), BR, '+ 칠각기둥·꼭짓점의 수: 24 + ', N_(14), ' = ', N_(38), BR,
               '+ 사각기둥·모서리의 수: 38 + ', N_(12), ' = ', N_(50), ' → 끝 수 ', O_(['이상이에요', '미만이에요']), '.'))]),
        ('암호 놀이를 해 보세요. 암호는 ‘옆면의 수 + 옆면 모양 기호(직사각형이면 ▭, 삼각형이면 △) + 카드에 적힌 구성 요소의 수’예요.', [ASK(
            AI('1. 팔각뿔 · 모서리의 수 카드의 암호를 만들어 보세요.', '옆면 ', N_(8), '개, 기호 ', O_(['△', '▭']), ', 모서리 ', N_(16), '개'),
            AI('2. 암호 ‘9▭18’은 어떤 카드의 암호일까요?', O_(['구각기둥·꼭짓점의 수', '구각뿔·모서리의 수', '구각기둥·모서리의 수'])),
            AI('3. 암호 ‘8△9’가 될 수 있는 카드를 모두 골라 보세요.', O_(['팔각뿔·면의 수', '팔각뿔·꼭짓점의 수', '팔각뿔·모서리의 수'], [0, 1])))]),
        ('놀이를 되돌아보세요.', [CH(
            [QUIZ(QI('끝 수 가까이에서 이기는 데 도움이 되는 생각을 모두 고르세요.', ['− 카드를 아껴 두었다가 내요.', '내기 전에 계산한 값이 끝 수 이상인지 먼저 따져 봐요.', '구성 요소의 수가 가장 큰 + 카드부터 내요.'], [0, 1]))],
            [WRITE(('놀이에서 구성 요소의 수를 빠르게 구한 방법을 써 보세요.', '빠르게 구한 방법', '예) 각기둥은 모서리 □×3, 꼭짓점 □×2, 각뿔은 모서리 □×2, 꼭짓점 □+1로 계산했어요.'))])]),
    ],
    't11': [
        ('입체도형의 이름을 쓰고, 각뿔의 구성 요소의 이름을 알맞게 써 보세요.', [CH(
            [ASK(AI('1. 입체도형의 이름을 써 보세요.', '⑴ ', O_(['칠각기둥', '칠각뿔', '육각기둥']), ' ⑵ ', O_(['구각뿔', '구각기둥', '팔각뿔']), ' ⑶ ', O_(['삼각기둥', '삼각뿔', '사각기둥']), ' ⑷ ', O_(['오각뿔', '오각기둥', '사각뿔']),
                    fig=FIG(('⑴', solid_svg(PR, 7)), ('⑵', solid_svg(PY, 9)), ('⑶', solid_svg(PR, 3)), ('⑷', solid_svg(PY, 5)))))],
            [BLK('각뿔에서 옆면이 모두 만나는 점을 ', O_(['각뿔의 꼭짓점', '밑면', '높이']), '이라 하고, 그 점에서 밑면에 수직인 선분의 길이를 ', O_(['높이', '모서리', '옆면']), '라고 해요.')])]),
        ('각기둥의 전개도가 될 수 있는 것을 모두 찾아보세요.', [NETJ([
            ('첫째', net_svg(3, tops=(0, 2), bottoms=()), False), ('둘째', net_svg(6, tops=(1,), bottoms=(4,), w=0.8), True),
            ('셋째', net_svg(4, nside=3, tops=(1,), bottoms=(1,)), False)], ask=[AI('전개도가 될 수 있는 것을 모두 골라 보세요.', O_(['첫째', '둘째', '셋째'], [1]))])]),
        ('각뿔의 높이를 잰 방법을 살펴보세요.', [QUIZ(
            QI('채린이는 육각뿔의 옆 모서리에 자를 대고 9 cm를 재었어요. 이 9 cm를 육각뿔의 높이라고 할 수 있나요?', ['없어요', '있어요']),
            QI('그 까닭으로 알맞은 것을 고르세요.', ['높이는 각뿔의 꼭짓점에서 밑면에 수직인 선분의 길이인데, 옆 모서리는 밑면에 수직이 아니에요.', '자의 눈금이 9보다 커야 해요.', '각뿔에는 높이가 없어요.']))]),
        ('조건을 살펴보며 차례대로 해결해 보세요.', [CH(
            [ASK(AI('5. 밑면이 1개이고 옆면이 모두 삼각형이며, 꼭짓점이 11개인 입체도형의 이름을 써 보세요.', '밑면이 1개이고 옆면이 삼각형이므로 ', O_(['각뿔', '각기둥']),
                    '이고, 밑면의 변의 수는 11−1=', N_(10), '이므로 ', O_(['십각뿔', '십일각뿔', '구각뿔']), '이에요.'))],
            [ASK(AI('6. 모서리의 길이가 모두 같은 삼각기둥이 있어요. 모든 모서리의 길이의 합이 72 cm일 때, 한 밑면의 둘레는 몇 cm인지 구해 보세요.',
                    '삼각기둥의 모서리는 모두 ', N_(9), '개예요.', BR, '한 모서리의 길이: 72÷9=', N_(8), ' (cm)', BR, '한 밑면의 둘레: ', N_(24), ' cm'))])]),
        ('배운 내용을 새 예로 정리하고 스스로 평가해 보세요.', [CH(
            [BLK('• 십각기둥의 면은 ', N_(12), '개, 모서리는 ', N_(30), '개예요. • 십각뿔의 면은 ', N_(11), '개, 꼭짓점은 ', N_(11), '개예요. • 각기둥의 전개도에서 옆면은 모두 ', O_(['직사각형', '삼각형']), '이에요.')],
            [{'t': 'pp6Self', 'q': None, 'items': ['각기둥과 각뿔을 알고 밑면과 옆면을 찾을 수 있나요?', '각기둥과 각뿔의 구성 요소와 성질을 이해했나요?', '각기둥의 전개도를 이해하고 그릴 수 있나요?', '각기둥과 각뿔에 흥미와 관심을 가지게 되었나요?'], 'ask': []}])]),
    ],
}

ST_NET_TRI = [([[4, 5], [7, 5], [7, 9], [4, 9]], False), ([[7, 5], [11, 5], [11, 9], [7, 9]], False), ([[11, 5], [16, 5], [16, 9], [11, 9]], False),
              ([[7, 5], [11, 5], [7, 2]], True), ([[7, 9], [11, 9], [7, 12]], True)]
ST_NET_BOX = [([[2, 5], [6, 5], [6, 8], [2, 8]], False), ([[6, 5], [8, 5], [8, 8], [6, 8]], False), ([[8, 5], [12, 5], [12, 8], [8, 8]], False),
              ([[12, 5], [14, 5], [14, 8], [12, 8]], False), ([[2, 3], [6, 3], [6, 5], [2, 5]], True), ([[2, 8], [6, 8], [6, 10], [2, 10]], True)]

HARD_ST = {
    's1': [
        ('공모전에 낼 새 쉼터 모형이에요. 모형을 보고 떠오르는 것을 세 칸에 써 보세요.', [
            PANES(('보여요', '모형에서 ~이 보여요', '오각 정자 몸체는 위와 아래에 똑같은 오각형 면이 있어요.'),
                  ('생각해요', '~은 ~일 것 같아요', '팔각 지붕의 옆면은 모두 삼각형이고 8개일 것 같아요.'),
                  ('궁금해요', '~은 어떻게 알 수 있을까?', '팔각 지붕을 만들려면 막대가 몇 개 필요할까?'),
                  fig=FIG(('오각 정자 몸체', solid_svg(PR, 5)), ('팔각 지붕', solid_svg(PY, 8)), ('삼각 텐트', solid_svg(PR, 3)), ('사각 조명 갓', solid_svg(PY, 4))))]),
        ('나래가 새 재료 목록을 가져왔어요. 재료를 기둥 모양과 뿔 모양으로 나누어 보세요.', [SORT(None, ['기둥 모양', '뿔 모양'], [
            ('육각 기둥 의자', None, 0), ('사각뿔 모양 지붕', None, 1), ('삼각 텐트', None, 0), ('팔각뿔 모양 조명 갓', None, 1),
            ('오각 화분', None, 0), ('삼각뿔 조형물', None, 1), ('직육면체 벤치 상자', None, 0)])]),
        ('설계도를 그리기 전에 4학년, 5학년 때 배운 도형을 떠올려 보세요.', [
            ASK(AI('팔각형의 변과 꼭짓점은 각각 몇 개인가요?', '변 ', N_(8), '개, 꼭짓점 ', N_(8), '개'),
                AI('벤치 상자는 직육면체 모양이에요.', '직육면체의 모서리 가운데 길이가 같은 것끼리 묶으면 ', N_(3), '묶음이고, 한 묶음에 모서리가 ', N_(4), '개씩 있어요.',
                   fig=FIG(('', solid_svg(PR, 4))))),
            TW('직육면체의 꼭짓점이 8개인 까닭을 위와 아래 면으로 설명해 볼까요?', '위의 면에 꼭짓점이 4개, 아래 면에 꼭짓점이 4개 있어서 모두 8개예요.')]),
        ('도윤이가 기둥 모형 5개를 세웠더니 위에서 본 모양이 삼각형, 오각형, 육각형, 오각형, 팔각형이었어요. 물음에 답해 보세요.', [ASK(
            AI('위에서 본 모양을 살펴보세요.', '두 번 나온 모양은 ', O_(['오각형', '삼각형', '팔각형']), '이에요. 다섯 모양의 꼭짓점의 수를 모두 더하면 ', N_(3 + 5 + 6 + 5 + 8), '개예요.'))]),
        ('공모 준비 차례를 늘어놓고, 우리 반의 설계 계획을 세워 보세요.', [CH(
            [{'t': 'sequence', 'cards': ['공모 조건에 맞는 기둥 고르기', '텐트 천을 펼쳐 설계도 그리기', '지붕과 조명 갓 고르기', '재료 주문서 쓰기', '설계 발표회 하기'], 'order': [0, 1, 2, 3, 4]}],
            [WRITE(('우리 학교에서 기둥 모양과 뿔 모양의 물건을 하나씩 찾아 써 보세요.', '찾은 물건', '예) 기둥 모양: 교실의 사물함, 뿔 모양: 운동장 반환점의 고깔'),
                   ('쉼터를 설계하기 전에 꼭 알아보고 싶은 것을 질문으로 써 보세요.', '내 질문', '예) 지붕을 만들 때 삼각형 천은 몇 장이 필요할까?'))])]),
    ],
    's23': [
        ('공모 조건 “평행하고 합동인 두 면이 있고, 나머지 면이 모두 직사각형”을 읽고 나무 토막을 나누어 보세요.', [SORT(None, ['조건에 맞아요', '조건에 맞지 않아요'], [
            ('평행하고 합동인 두 칠각형과 직사각형 7개로 된 토막', None, 0), ('평행한 두 삼각형의 크기가 서로 다른 토막', None, 1),
            ('평행한 두 면이 없는 토막', None, 1), ('평행하고 합동인 두 사각형과 직사각형 4개로 된 토막', None, 0), ('평행하고 합동인 두 원이 있는 토막', None, 1)])]),
        ('각기둥을 약속하고, 쉼터 재료 가~마 중에서 각기둥을 모두 찾아보세요.', [
            CH([BLK('두 면이 서로 평행하고 ', O_(['합동인', '크기가 다른']), ' 다각형이고, 나머지 면이 모두 ', O_(['직사각형', '삼각형']), '인 입체도형을 각기둥이라고 해요.')],
               [PICK('각기둥을 모두 찾아보세요.', [('가', solid_svg(PR, 8)), ('나', solid_svg(PY, 5)), ('다', solid_svg(PR, 4)), ('라', solid_svg(PR, 6)), ('마', solid_svg(PY, 3))], [0, 2, 3])]),
            TW('나가 각기둥이 아닌 까닭을 써 볼까요?', '나는 평행하고 합동인 두 면이 없고 옆면이 모두 삼각형이라서 각기둥이 아니에요.')]),
        ('각기둥의 밑면을 떠올리고, 재료실의 각기둥에서 밑면을 찾아보세요.', [CH(
            [QUIZ(QI('각기둥의 밑면을 찾는 방법으로 알맞은 것을 고르세요.', ['평행하고 합동인 두 면을 찾아요.', '항상 바닥에 닿은 면을 찾아요.', '가장 넓은 면을 찾아요.']))],
            [TAP([('가', PR, 3), ('나', PR, 7), ('다', PR, 5)])])]),
        ('육각기둥 모양 의자에서 밑면과 옆면을 모두 찾아보세요.', [CH(
            [TAP([('', PR, 6)], pens=('밑면', '옆면'), multi=False)],
            [ASK(AI('밑면의 모양과 옆면의 수의 관계를 이용해 보세요.', '구각기둥의 옆면은 ', N_(9), '개이고, 옆면이 7개인 각기둥의 밑면은 ', O_(['칠각형', '육각형', '팔각형']), '이에요.'))])]),
        ('각기둥 모양의 재료를 찾고, 친구들의 설명을 확인해 보세요.', [QUIZ(
            QI('각기둥 모양의 재료를 모두 고르세요.', ['육각 기둥 의자', '사각뿔 모양 지붕', '오각 화분', '삼각 텐트', '삼각뿔 조형물'], [0, 2, 3]),
            QI('잘못 말한 친구를 고르세요.', ['서진: 각기둥의 두 밑면은 합동이에요.', '건우: 각기둥의 옆면은 모두 직사각형이에요.', '나래: 각기둥의 밑면은 언제나 1개예요.'], 2))]),
    ],
    's4': [
        ('쉼터 기둥 가, 나, 다의 밑면을 빨간색으로 색칠하고, 이름을 지어 보세요.', [TAP([('가', PR, 5), ('나', PR, 6), ('다', PR, 10)], ask=[
            AI('각기둥의 이름을 써 보세요.', '가: ', O_(['오각기둥', '육각기둥', '십각기둥']), '  나: ', O_(['오각기둥', '육각기둥', '십각기둥'], 1), '  다: ', O_(['오각기둥', '육각기둥', '십각기둥'], 2))])]),
        ('육각기둥 모형에 색 테이프를 붙여요. 모서리와 꼭짓점을 표시하고, 높이를 알아보세요.', [CH(
            [PARTS(PR, 6)],
            [ASK(AI('높이가 9 cm인 육각기둥 모형이에요.', '옆면끼리 만나는 모서리는 ', N_(6), '개이고, 그 길이를 모두 더하면 ', N_(54), ' cm예요.'))])]),
        ('먼저 규칙을 예상한 다음, 표를 완성해 보세요.', [
            RF('한 밑면의 변의 수가 2씩 늘어나면 면, 모서리, 꼭짓점의 수는 각각 얼마씩 늘어날지 예상해 써요.', '면은 2개씩, 모서리는 6개씩, 꼭짓점은 4개씩 늘어나요.'),
            TBL(['한 밑면의 변의 수(개)', '면의 수(개)', '모서리의 수(개)', '꼭짓점의 수(개)'],
                [[n, c_(PR, n, 'face'), c_(PR, n, 'edge'), c_(PR, n, 'vert')] for n in (4, 6, 8)])]),
        ('각기둥의 이름과 구성 요소를 거꾸로 생각해 보세요.', [ASK(
            AI('신청서에 적을 기둥의 이름을 구해 보세요.', '꼭짓점이 18개인 각기둥은 ', O_(['구각기둥', '십팔각기둥', '육각기둥']), '이고, 면이 12개인 각기둥은 ', O_(['십각기둥', '십이각기둥', '육각기둥']), '이에요.'))]),
        ('조건에 맞는 쉼터 기둥을 찾아보세요.', [ASK(
            AI('1. 모서리의 수와 꼭짓점의 수의 합이 50인 각기둥이에요.', '한 밑면의 변의 수: 50÷5=', N_(10), ', 이 각기둥은 ', O_(['십각기둥', '오각기둥', '팔각기둥']), '이에요.'),
            AI('2. 면이 8개인 각기둥이에요.', '모서리는 ', N_(c_(PR, 6, 'edge')), '개, 꼭짓점은 ', N_(c_(PR, 6, 'vert')), '개예요.'))]),
    ],
    's56': [
        ('육각기둥 모양 의자 덮개를 펼친 그림이에요. 밑면과 옆면을 찾아보세요.', [{
            't': 'pp6NetMark', 'q': None, 'svg': net_svg(6, tops=(2,), bottoms=(4,), w=0.8), 'nb': 2, 'ns': 6, 'bshape': '육각형', 'kind': 'prism', 'ask': [
                AI(None, '밑면은 ', O_(['육각형', '직사각형']), ' 모양 ', N_(2), '개, 옆면은 ', O_(['육각형', '직사각형'], 1), ' 모양 ', N_(6), '개예요.')]}]),
        ('펼친 그림을 다시 접는다고 생각하고 맞닿는 선분을 찾아보세요. 그다음 전개도의 약속을 떠올려요.', [CH(
            [{'t': 'pp6NetPairs', 'q': None, 'pairs': 2 * 6 - 1, 'svg': net_svg(6, tops=(2,), bottoms=(4,), w=0.8), 'ask': []}],
            [BLK('각기둥의 전개도에서 접었을 때 맞닿는 선분의 길이는 ', O_(['같아요', '달라요']), '. 오각기둥의 전개도에서 맞닿는 선분은 모두 ', N_(2 * 5 - 1), '쌍이에요.')])]),
        ('건우가 그린 설계도 가~라 중에서 각기둥의 전개도가 될 수 있는 것을 찾아보세요. 먼저 예상한 다음, 머릿속으로 접어서 확인해요.', [
            NETJ([('가', net_svg(4, tops=(1,), bottoms=(2,)), True), ('나', net_svg(5, nside=4, tops=(1,), bottoms=(1,)), False),
                  ('다', net_svg(3, tops=(0, 2), bottoms=()), False), ('라', net_svg(6, tops=(0,), bottoms=(3,), w=0.8), True)], ask=[
                AI('전개도가 될 수 있는 것의 이름을 써 보세요.', '가: ', O_(['사각기둥', '육각기둥', '오각기둥']), '  라: ', O_(['사각기둥', '육각기둥', '오각기둥'], 1))]),
            TW('다를 어떻게 고치면 전개도가 될지 써 볼까요?', '같은 쪽에 붙은 밑면 하나를 옆면의 반대쪽(아래쪽)으로 옮겨 붙이면 접었을 때 겹치지 않아 삼각기둥의 전개도가 돼요.')]),
        ('텐트(밑면의 세 변 3 cm, 4 cm, 5 cm인 직각삼각형, 높이 4 cm)의 설계도를 모눈에 완성해 보세요.', [CH(
            [BLK('삼각기둥의 전개도에서 옆면의 세로는 모두 높이와 같은 ', N_(4), ' cm이고, 옆면 세 개의 가로를 모두 더하면 밑면의 ', O_(['둘레', '넓이']), '와 같은 ', N_(12), ' cm예요.')],
            ('설계도를 완성해 보세요. (옆면 1개와 밑면 1개를 더 그려요)', [NETDRAW(ST_NET_TRI, [0, 1, 3], 20, 15, 3, '삼각형')], [('', solid_svg(PR, 3))]))]),
        ('나래가 사각기둥 모양 화단(밑면은 가로 4 cm, 세로 2 cm인 직사각형, 높이 3 cm)을 놓으려고 해요. 설계도를 완성해 보세요.', [CH(
            ('화단 설계도를 완성해 보세요. (옆면 2개와 밑면 1개를 더 그려요)', [NETDRAW(ST_NET_BOX, [0, 1, 4], 18, 13, 4, '사각형')], [('', solid_svg(PR, 4))]),
            [ASK(AI('화단의 전개도에서 실선과 점선은 무엇을 나타내나요?', '실선은 ', O_(['잘린 모서리', '잘리지 않은 모서리']), ', 점선은 ', O_(['잘린 모서리', '잘리지 않은 모서리'], 1), '예요.'))])]),
    ],
    's7': [
        ('공모 안내문의 지붕 조건 “밑면이 한 개이고 옆으로 둘러싼 면이 모두 삼각형”을 읽고 지붕 모형을 나누어 보세요.', [SORT(None, ['조건에 맞아요', '조건에 맞지 않아요'], [
            ('밑면이 오각형이고 삼각형 옆면 5개가 한 점에서 만나는 모형', None, 0), ('옆면이 모두 직사각형인 모형', None, 1),
            ('밑면이 원이고 끝이 뾰족한 모형', None, 1), ('밑면이 팔각형이고 옆면이 모두 삼각형인 모형', None, 0), ('평행하고 합동인 두 육각형이 있는 모형', None, 1)])]),
        ('각뿔을 약속하고, 모형 가~마 중에서 각뿔을 모두 찾아보세요.', [
            CH([BLK('밑면이 ', O_(['한 개', '두 개']), '인 다각형이고, 옆으로 둘러싼 면이 모두 ', O_(['삼각형', '직사각형']), '인 입체도형을 각뿔이라고 해요.')],
               [PICK('각뿔을 모두 찾아보세요.', [('가', solid_svg(PR, 5)), ('나', solid_svg(PY, 5)), ('다', solid_svg(PY, 9)), ('라', solid_svg(PR, 3)), ('마', solid_svg(PY, 4))], [1, 2, 4])]),
            TW('가가 각뿔이 아닌 까닭을 써 볼까요?', '가는 평행하고 합동인 두 오각형이 있고 옆면이 직사각형이라서 각뿔이 아니라 각기둥이에요.')]),
        ('각뿔의 밑면과 옆면을 떠올려 보세요.', [CH(
            [QUIZ(QI('각뿔에서 밑면과 만나는 면은 어떤 도형인가요?', ['삼각형', '직사각형', '밑면과 같은 다각형']), QI('각뿔의 밑면은 몇 개인가요?', ['1개', '2개', '옆면의 수만큼']))],
            (None, [BLK('오각뿔에서 밑면은 ', O_(['오각형', '삼각형']), ' 1개이고, 옆면은 ', O_(['삼각형', '오각형']), ' ', N_(5), '개예요.')], [('', solid_svg(PY, 5))]))]),
        ('팔각뿔 모양 조명 갓의 밑면에는 빨간 종이를, 옆면에는 파란 종이를 붙이려고 해요. 밑면과 옆면을 모두 찾아 색칠해 보세요.', [TAP([('', PY, 8)], pens=('밑면', '옆면'), multi=False, ask=[
            AI('밑면의 모양과 옆면의 수의 관계를 이용해 보세요.', '팔각뿔에 붙일 파란 종이는 ', N_(8), '장이에요. 파란 종이가 6장 필요한 각뿔의 밑면은 ', O_(['육각형', '칠각형', '팔각형']), '이에요.')])]),
        ('각뿔 모양의 재료를 찾고, 친구들의 설명을 확인해 보세요.', [QUIZ(
            QI('각뿔 모양의 재료를 모두 고르세요.', ['사각뿔 모양 지붕', '오각 화분', '삼각뿔 조형물', '팔각뿔 모양 조명 갓', '삼각 텐트'], [0, 2, 3]),
            QI('잘못 말한 친구를 고르세요.', ['서진: 각뿔의 옆면은 모두 삼각형이에요.', '도윤: 각뿔의 옆면의 수는 밑면의 변의 수와 같아요.', '건우: 각뿔에도 평행한 두 밑면이 있어요.'], 2))]),
    ],
    's8': [
        ('지붕 가, 나, 다의 밑면을 빨간색으로 색칠하고, 이름을 지어 보세요.', [TAP([('가', PY, 5), ('나', PY, 8), ('다', PY, 10)], ask=[
            AI('각뿔의 이름을 써 보세요.', '가: ', O_(['오각뿔', '팔각뿔', '십각뿔']), '  나: ', O_(['오각뿔', '팔각뿔', '십각뿔'], 1), '  다: ', O_(['오각뿔', '팔각뿔', '십각뿔'], 2))])]),
        ('팔각뿔 모양 지붕의 뼈대를 살펴봐요. 모서리와 꼭짓점을 표시하고, 높이를 재는 방법을 알아보세요.', [CH(
            [PARTS(PY, 8)],
            [QUIZ(QI('지붕의 높이를 바르게 재는 방법을 고르세요.', ['각뿔의 꼭짓점에서 밑면에 수직으로 자를 세워 재요.', '옆 모서리에 자를 대고 재요.', '밑면의 대각선 길이를 재요.']))])]),
        ('먼저 규칙을 예상한 다음, 표를 완성해 보세요.', [
            RF('밑면의 변의 수가 2씩 늘어나면 각뿔의 면, 모서리, 꼭짓점의 수는 각각 얼마씩 늘어날지 예상해 써요.', '면은 2개씩, 모서리는 4개씩, 꼭짓점은 2개씩 늘어나요.'),
            TBL(['밑면의 변의 수(개)', '면의 수(개)', '모서리의 수(개)', '꼭짓점의 수(개)'],
                [[n, c_(PY, n, 'face'), c_(PY, n, 'edge'), c_(PY, n, 'vert')] for n in (4, 6, 8)])]),
        ('각뿔의 이름과 구성 요소를 거꾸로 생각해 보세요.', [ASK(
            AI('지붕의 이름을 구해 보세요.', '꼭짓점이 7개인 각뿔은 ', O_(['육각뿔', '칠각뿔', '오각뿔']), '이고, 모서리가 20개인 각뿔은 ', O_(['십각뿔', '이십각뿔', '오각뿔']), '이에요.'))]),
        ('조건에 맞는 지붕을 찾아보세요.', [ASK(
            AI('1. 면의 수와 모서리의 수의 합이 25인 각뿔이에요.', '밑면의 변의 수: (25−1)÷3=', N_(8), ', 이 각뿔은 ', O_(['팔각뿔', '칠각뿔', '구각뿔']), '이에요.'),
            AI('2. 옆면이 11개인 각뿔이에요.', '면은 ', N_(12), '개, 모서리는 ', N_(22), '개, 꼭짓점은 ', N_(12), '개예요.'))]),
    ],
    's9': [
        ('도윤이가 만든 오각기둥 뼈대의 막대와 이음새를 세어 보세요. 모서리는 막대로, 꼭짓점은 이음새로 나타내요.', [SKEL(PR, 5, ask=[AI(None, '막대 ', N_(15), '개, 이음새 ', N_(10), '개')])]),
        ('먼저 규칙을 예상한 다음, 표를 완성해 보세요.', [
            RF('한 밑면의 변의 수와 막대(모서리)·이음새(꼭짓점)의 수 사이에 어떤 관계가 있을지 예상해 써요.', '막대는 한 밑면의 변의 수의 3배, 이음새는 2배예요.'),
            TBL(['각기둥', '한 밑면의 변의 수(개)', '막대(모서리)의 수(개)', '이음새(꼭짓점)의 수(개)'],
                [[PNAME(PR, n), n, c_(PR, n, 'edge'), c_(PR, n, 'vert')] for n in (6, 7, 9)])]),
        ('이번에는 오각뿔 지붕 뼈대를 세어 보고, 각뿔의 재료 규칙도 찾아보세요.', [
            CH([SKEL(PY, 5, ask=[AI(None, '막대 ', N_(10), '개, 이음새 ', N_(6), '개')])],
               [TBL(['각뿔', '밑면의 변의 수(개)', '막대(모서리)의 수(개)', '이음새(꼭짓점)의 수(개)'],
                    [[PNAME(PY, n), n, c_(PY, n, 'edge'), c_(PY, n, 'vert')] for n in (6, 7, 9)], q='표를 완성해 보세요.')]),
            TW('각뿔의 막대의 수가 밑면의 변의 수의 2배인 까닭을 써 볼까요?', '밑면의 변마다 막대가 하나씩 있고, 각뿔의 꼭짓점에서 밑면의 꼭짓점마다 막대가 하나씩 더 있어서 2배예요.')]),
        ('찾은 규칙을 식으로 정리하고, 거꾸로 생각해 보세요.', [BLK(
            '(각기둥의 막대의 수)=(한 밑면의 변의 수)×', O_(['3', '2']), ', (각뿔의 이음새의 수)=(밑면의 변의 수)+', O_(['1', '2']),
            '. 막대 36개로 만든 각기둥의 이음새는 ', N_(24), '개예요.')]),
        ('우리 반 쉼터 모형은 육각기둥 몸체와 육각뿔 지붕으로 바꾸었어요. 몸체와 지붕을 따로 만든다면 막대와 이음새는 모두 몇 개 주문해야 할까요?', [
            ASK(AI('이해해요', '몸체는 ', O_(['육각기둥', '육각뿔']), ', 지붕은 ', O_(['육각뿔', '육각기둥']), '이에요.'),
                AI('계획해요', '막대의 수는 ', O_(['모서리', '꼭짓점']), '의 수, 이음새의 수는 ', O_(['꼭짓점', '모서리']), '의 수로 구해요.'),
                AI('해결해요', '몸체: 막대 ', N_(18), '개, 이음새 ', N_(12), '개 / 지붕: 막대 ', N_(12), '개, 이음새 ', N_(7), '개', BR,
                   '주문할 막대 모두 ', N_(30), '개, 이음새 모두 ', N_(19), '개')),
            TW('되돌아봐요 — 몸체와 지붕을 따로 만들지 않고 붙여서 만든다면 막대의 수가 왜 줄어드는지 써 볼까요?', '몸체의 윗면과 지붕의 밑면이 같은 육각형이라 그 모서리 6개를 함께 쓸 수 있어서 막대가 6개 줄어요.')]),
    ],
    's10': [
        ('새 놀이 카드 두 장을 차례로 낸다고 생각하고 계산해 보세요. 시작 수는 10, 끝 수는 46이에요.', [ASK(
            AI('카드 ① + 구각기둥 · 모서리의 수, 카드 ② − 칠각뿔 · 면의 수', '① 10 + ', N_(27), ' = ', N_(37), BR, '② 37 − ', N_(8), ' = ', N_(29)),
            AI('계산한 값이 46이 되면 어떻게 하나요?', O_(['가진 카드를 모두 내려놓아요.', '카드 한 장을 가져와요.'])))]),
        ('시작 수 8, 끝 수 44로 연습해 보세요. 카드를 낼 때마다 값을 구해요.', [ASK(
            AI(None, '+ 육각뿔·모서리의 수: 8 + ', N_(12), ' = ', N_(20), BR, '+ 오각기둥·꼭짓점의 수: 20 + ', N_(10), ' = ', N_(30), BR,
               '− 사각뿔·꼭짓점의 수: 30 − ', N_(5), ' = ', N_(25), BR, '+ 칠각기둥·모서리의 수: 25 + ', N_(21), ' = ', N_(46), ' → 끝 수 ', O_(['이상이에요', '미만이에요']), '.'))]),
        ('지금 수는 38, 끝 수는 45예요. 이기는 작전을 세워 보세요.', [
            QUIZ(QI('내가 가진 카드 중에서 내기에 가장 알맞은 카드를 고르세요.', ['− 팔각기둥·면의 수', '+ 삼각기둥·모서리의 수', '+ 오각뿔·면의 수'])),
            WRITE(('끝 수 가까이에서 + 카드만 가지고 있다면 어떤 카드를 내는 것이 좋을지 까닭과 함께 써 보세요.', '나의 작전', '예) 구성 요소의 수가 가장 작은 + 카드를 내요. 더한 값이 끝 수보다 작아야 카드를 내려놓지 않기 때문이에요.'))]),
        ('암호는 ‘옆면의 수 + 옆면 모양 기호(직사각형이면 ▭, 삼각형이면 △) + 카드에 적힌 구성 요소의 수’예요. 새 카드 세 장의 암호를 만들어 보세요.', [ASK(
            AI('1. 구각뿔 · 꼭짓점의 수', N_(9), ' ', O_(['△', '▭']), ' ', N_(10)),
            AI('2. 칠각기둥 · 면의 수', N_(7), ' ', O_(['▭', '△']), ' ', N_(9)),
            AI('3. 팔각기둥 · 모서리의 수', N_(8), ' ', O_(['▭', '△']), ' ', N_(24)))]),
        ('친구가 보여 준 암호를 보고 어떤 카드인지 찾아보세요.', [ASK(
            AI('1. 암호 ‘6△12’', O_(['육각뿔·모서리의 수', '육각기둥·꼭짓점의 수', '육각뿔·면의 수'])),
            AI('2. 암호 ‘4▭12’', O_(['사각기둥·모서리의 수', '사각뿔·모서리의 수', '사각기둥·꼭짓점의 수'])),
            AI('3. 암호 ‘10▭20’이 될 수 있는 카드를 모두 골라 보세요.', O_(['십각기둥·꼭짓점의 수', '십각뿔·모서리의 수', '십각기둥·면의 수'], [0])))]),
    ],
    's11': [
        ('발표회에서 다른 반 모형 쉼터의 부분을 소개해요. 입체도형의 이름을 골라 보세요.', [ASK(
            AI('입체도형의 이름을 써 보세요.', '⑴ ', O_(['팔각기둥', '팔각뿔', '칠각기둥']), ' ⑵ ', O_(['칠각뿔', '칠각기둥', '육각뿔']), ' ⑶ ', O_(['육각기둥', '육각뿔', '오각기둥']), ' ⑷ ', O_(['삼각뿔', '삼각기둥', '사각뿔']),
               fig=FIG(('⑴', solid_svg(PR, 8)), ('⑵', solid_svg(PY, 7)), ('⑶', solid_svg(PR, 6)), ('⑷', solid_svg(PY, 3)))))]),
        ('발표판의 설명에 알맞은 말을 써 보세요. 보기: 밑면, 옆면, 높이, 꼭짓점, 모서리, 각뿔의 꼭짓점', [BLK(
            '각기둥에서 두 밑면 사이의 거리는 ', O_(['높이', '모서리']), '이고, 각뿔에서 옆면이 모두 만나는 점은 ', O_(['각뿔의 꼭짓점', '꼭짓점']),
            '이에요. 각기둥에서 두 밑면과 만나는 면은 ', O_(['옆면', '밑면']), '이에요.')]),
        ('다른 반이 낸 설계도 세 장을 심사해요. 각기둥의 전개도가 될 수 있는 것을 먼저 예상한 다음, 머릿속으로 접어서 확인해 보세요.', [NETJ([
            ('첫째', net_svg(5, tops=(0,), bottoms=(3,)), True), ('둘째', net_svg(4, nside=4, tops=(0, 3), bottoms=()), False),
            ('셋째', net_svg(3, tops=(2,), bottoms=(0,)), True)], ask=[AI('각기둥의 전개도가 될 수 있는 것을 모두 골라 보세요.', O_(['첫째', '둘째', '셋째'], [0, 2]))])]),
        ('서진이와 건우가 오각뿔 모양 지붕의 높이를 말했어요. 서진: “각뿔의 꼭짓점에서 밑면에 수직으로 잰 8 cm가 높이야.” 건우: “옆 모서리의 길이 10 cm가 높이야.”', [
            QUIZ(QI('높이를 잘못 말한 친구는 누구인가요?', ['서진', '건우'], 1)),
            TW('건우가 잘못 말한 까닭을 써 볼까요?', '각뿔의 높이는 각뿔의 꼭짓점에서 밑면에 수직인 선분의 길이인데, 옆 모서리는 밑면에 비스듬하게 놓여 있어서 높이가 아니에요.')]),
        ('설계 발표회를 마치며 단원을 정리하고, 1차시에 궁금했던 것을 해결했는지 돌아보세요. 마지막으로 스스로 평가해요.', [
            {'t': 'wonder'},
            CH([BLK('• 구각기둥의 꼭짓점은 ', N_(18), '개, 구각뿔의 꼭짓점은 ', N_(10), '개예요. • 각뿔의 옆면은 모두 ', O_(['삼각형', '직사각형']), '이에요.')],
               [WRITE(('1차시에 궁금했던 것 하나를 골라, 이제 어떻게 답할 수 있는지 써 보세요.', '궁금증 해결', '예) 팔각 지붕을 만들려면 막대가 8×2=16개 필요해요.'))],
               [{'t': 'pp6Self', 'q': None, 'items': ['각기둥과 각뿔을 알고 밑면과 옆면을 찾을 수 있나요?', '각기둥과 각뿔의 구성 요소와 성질을 이해했나요?', '각기둥의 전개도를 이해하고 그릴 수 있나요?', '각기둥과 각뿔에 흥미와 관심을 가지게 되었나요?'], 'ask': []}])]),
    ],
}


DATA = {}


def build_file(kind, lv):
    src = SRC_TB if kind == 'tb' else SRC_ST
    D = load(src)
    if kind == 'tb':
        check_numbers(D)
    else:
        ids = [L['id'] for L in D['lessons']]
        assert ids == ST_IDS, ('이야기 버전 차시가 바뀌었어요 — ST_IDS를 고치세요', ids)
        check_numbers(D, story=True)
    if lv == '도전형':
        D = harden(D, kind)
    DATA.clear()
    DATA.update(D)
    DATA['kind'] = kind
    label = '교과서 차시' if kind == 'tb' else '이야기 버전'
    s = Sheet(unit_label='6-1 수학 %s(%s)' % (UNIT_NAME, label), level=lv, grade_label='6학년')
    if kind == 'tb':
        lines = [tb_lesson(s, lv, L) for L in D['lessons']]
    else:
        lines = [f(s, lv) for f in ST]
    note = ('※ 이 활동지는 앱 u2-prism.html과 차시 번호가 같습니다. '
            '5~6차시 삼각기둥·사각기둥 전개도 모눈은 실제 크기(한 칸 1 cm)이므로 100%로 인쇄하세요. 육각기둥 모눈은 종이에 들어가도록 반으로 줄였어요. '
            '쓰기 칸의 ‘예)’는 예시 답이에요.') if kind == 'tb' else (
            '※ 이 활동지는 앱 u2-prism.html(이야기 버전)과 차시 번호가 같습니다. '
            '5~6차시 텐트·화단 설계도 모눈은 모두 실제 크기(한 칸 1 cm)이므로 100%로 인쇄하세요. 가로가 18 cm인 화단 모눈은 종이에 들어가도록 옆으로 돌려 놓았어요. '
            '쓰기 칸의 ‘예)’는 예시 답이고, ‘먼저 예상해요’는 예상이 달라도 괜찮아요.')
    s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT_NAME, label, lv), lines, note=note)
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
