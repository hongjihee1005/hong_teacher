# -*- coding: utf-8 -*-
"""6-1 수학 6. 직육면체의 부피와 겉넓이 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u6-volume.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u6-volume.py tb       # 교과서 차시 버전만
    python3 gen_u6-volume.py st       # 이야기 버전만

앱 원본 ../units/u6-volume.tb.js('자원봉사 센터 부피와 겉넓이', 8차시 묶음: 1·2·3~4·5~6·7~8·9·10·11)의
LESSONS를 node에서 가짜 DOM으로 그대로 실행해(CAP_JS), 활동마다 넘긴 물음·보기·정답·수와 앱이 그린 그림(SVG)을 모읍니다.
그래서 앱의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수·정답이 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.

  - 묻고 답하기(vo6Ask·blanks·quiz·writeStep)는 앱의 물음을 그대로 옮기고,
    기본형은 보기 고르기 + 도움 한 줄, 도전형은 짧은 낱말 보기를 빈칸 + 낱말 상자로 바꾸고 앱의 도전 문제와 '까닭 쓰기'를 더합니다.
  - 조작 활동은 앱의 그림을 그대로 넣습니다: 상자 채우기(vo6Fill)는 다 채운 모습, 쌓기(vo6Dims)는 2배·3배로 늘린 모습이나
    다 쌓은 모습, 1 m³ 채우기(vo6M3)는 세 단계, 상자 포장(vo6Pack)은 쌓은 모양(정답이 될 쌓기는 앱의 check로 모두 찾아 계산).
    도전 문제(상자 8개를 632 cm²보다 좁게)는 정답 그림 대신 쌓는 방법을 적는 표를 줍니다.
  - 학생이 재는 그림은 **실제 크기**(SVG 1 cm = 40 px, 그림 너비 mm = px ÷ 4, 100%로 인쇄):
    1차시 가로 8 cm·세로 5 cm 직사각형, 2차시 1 cm³ 정육면체의 전개도, 7~8차시 가로 5 cm·세로 2 cm·높이 3 cm 직육면체의 전개도.
  - 놀이(10차시)는 종이에서 할 수 있게 쪽지 만들기 표·찾은 쪽지 기록표·연습 문제·종이 뒤집기 기록표로 바꿉니다.
  - 정답의 계산(부피·겉넓이·단위 바꾸기)은 식이 적힌 칸은 식을 계산해, 식이 없는 칸은 파이썬으로 따로 계산해 assert로 앱의 답과 맞춥니다(check_numbers).
  - 이야기 버전(ST, `python3 gen_u6-volume.py st`)도 같은 방법으로 ../units/u6-volume.st.js('6학년 1반 교실 새 단장',
    1·2·3~4·5~6·7~8·9·10·11차시)의 LESSONS를 읽어 sem1-soop/sheets/에 만듭니다. 이야기 엔진 부품은 종이로 바꿉니다:
    panes(보여요·생각해요·궁금해요 세 칸) · thenWhy('왜 그럴까요?' 쓰기, 정답에 앱의 모범 답) · ruleFirst(활동 전에 '먼저 예상해요',
    정답에 '실제 규칙') · wonderRecall(1차시 '궁금해요' 다시 보기) · sequence(차례 기호 쓰기). 기본형은 쓰기 칸에 앱 help의 문장 틀을 '도움'으로.
    9차시 '상자 8개 쌓기'(앱에서 찾는 활동)는 정답 그림 대신 쌓는 방법을 적는 표를 줍니다.
    실제 크기 그림: 1차시 가로 9 cm·세로 6 cm 이름표, 2차시 1 cm³ 정육면체의 전개도.
    차시 id가 ST_IDS와 다르면 멈추고, 앱의 답은 ST_EXPECT(파이썬으로 따로 계산)와 맞춥니다.
그림은 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""

CAP_JS = r'''// 앱 원본(u6-volume.tb.js)을 가짜 DOM에서 실행해 차시·단계·물음·보기·정답·그림(SVG)을 모읍니다.
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const FONT = process.argv[3];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = {}; this.kids = []; this._t = ''; this.style = {}; this.dataset = {}; this.nodeType = 1; this.parent = null; this.isConnected = true;
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
  addEventListener() {} removeEventListener() {} focus() {} scrollIntoView() {} setPointerCapture() {}
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
let STOP = false;
const performance = { now: () => 0 }, requestAnimationFrame = cb => 0, setTimeout = () => 0, clearTimeout = () => {}, window = {};
const setInterval = fn => { STOP = false; for (let i = 0; i < 400 && !STOP; i++) fn(); STOP = false; return 1; };
const clearInterval = () => { STOP = true; };
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
/* 이야기 버전 엔진 부품(panes·thenWhy·ruleFirst·wonderRecall)과 autoRun — 교과서 버전에는 없음 */
function autoRun() { return () => {}; }
function panes(b, a, items, opts) { if (INNER) return; REC.push({ t: 'panes', fig: null, items: items.map(x => ({ t: x.t, ph: x.ph || '', hint: x.hint || '', ex: x.ex || [] })) }); }
function thenWhy(render, o) { return (b, a) => { render(b, a); if (!INNER) REC.push({ t: 'thenwhy', q: o.q, ph: o.ph || '', help: o.help || [], ans: o.ans || '' }); }; }
function ruleFirst(render, o) { return (b, a) => { if (!INNER) REC.push({ t: 'rule', q: o.q, ph: o.ph || '', help: o.help || [], ans: o.ans || '' }); render(b, a); }; }
function wonderRecall(render) { return (b, a) => { if (!INNER) REC.push({ t: 'wonder' }); render(b, a); }; }

const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
const lesSrc = src.slice(src.indexOf('//@@LESSONS'));
eval((unitSrc + '\n' + lesSrc).replace(/^(const|let) /gm, 'var '));

function findAll(e, f, out) { out = out || []; if (e && typeof e === 'object' && e.kids) { if (f(e)) out.push(e); e.kids.forEach(k => findAll(k, f, out)); } return out; }
function click(root, label, n) { for (let i = 0; i < (n || 1); i++) { const b = findAll(root, e => e.tag === 'button' && e.textContent.trim() === label)[0]; if (!b) throw new Error('단추 없음: ' + label); b.on.onclick({ currentTarget: b, target: b, stopPropagation() {} }); } }
function findSvg(e) { if (!e || typeof e !== 'object') return null; if (e.tag === 'svg') return e; for (const k of e.kids || []) { const r = findSvg(k); if (r) return r; } return null; }
function plain(e) { if (e == null) return ''; if (typeof e !== 'object') return String(e); if (e.tag === 'svg') return ''; if (e.tag === 'br') return '\n'; return e._t + (e.kids || []).map(plain).join(''); }
function figsOf(root) {   /* 그림마다 {svg, label}: figure 안이면 figcaption 글 */
  const out = [];
  (function walk(e, cap) {
    if (!e || typeof e !== 'object' || !e.kids) return;
    if (e.tag === 'svg') { out.push({ svg: String(e), label: cap || '' }); return; }
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
  return { figs, text: t };
}
/* 활동 밖에서 본문에 바로 붙인 것(그림·안내 글) */
function extras(box) {
  return box.kids.filter(k => k instanceof El).map(k => ({ figs: figsOf(k), text: findSvg(k) ? '' : plain(k).trim(), small: (k.a.class || '') === 'vo6small' }));
}
function serPart(p) {
  if (typeof p === 'string') return { s: p };
  if (p instanceof El) return p.tag === 'br' ? { br: 1 } : { s: plain(p) };
  if (p.o) return { o: p.o, a: p.a, multi: !!p.multi };
  if ('n' in p) return { n: p.n };
  return { s: '' };
}
function serQ(it) { return { q: it.q || null, fig: it.fig ? serEl(it.fig) : null, o: it.o || null, a: it.a, parts: it.parts ? it.parts.map(serPart) : null }; }
const api = new Proxy({}, { get: () => () => {} });

quiz = function (b, a, items, opts) { if (!INNER) REC.push({ t: 'quiz', items: items.map(serQ), ok: (opts || {}).ok || '' }); };
blanks = function (b, a, parts, opts) { if (!INNER) REC.push({ t: 'blanks', parts: parts.map(serPart), ok: (opts || {}).ok || '' }); };
writeStep = function (b, a, items) { if (!INNER) REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag || '', ph: x.ph || '', ans: x.ans || '', help: x.help || [] })) }); };
sequence = function (b, a, cards, order) { if (!INNER) REC.push({ t: 'sequence', cards, order }); };
const ORIG = { vo6Ask };
vo6Ask = function (host, ap, items, opts) { if (!INNER) REC.push({ t: 'ask', items: items.map(serQ), ok: (opts || {}).ok || '', title: (opts || {}).title || '' }); return new El('div'); };
vo6Chain = function (body, ap, parts) {
  const out = [];
  for (const p of parts) { const save = REC; REC = []; const box = new El('div'); (p.run || p)(box, ap); out.push({ title: p.title || null, recs: REC, extra: extras(box) }); REC = save; }
  REC.push({ t: 'chain', parts: out });
};
function capThen(fn, extra) { const save = REC; REC = []; const box = new El('div'); fn(box, api, extra); const r = REC; REC = save; return r; }
const WID = ['vo6Pour', 'vo6Touch', 'vo6Fill', 'vo6Dims', 'vo6Net', 'vo6M3', 'vo6Pack', 'vo6Make', 'vo6Hunt', 'vo6Notes', 'vo6Cards']
  .filter(n => { try { return typeof eval(n) === 'function'; } catch (e) { return false; } });   /* 이야기 버전에는 vo6Pour가 없음 */
function run0(name, opt) { const fb = new El('div'); INNER++; try { ORIG[name](fb, api, opt); } finally { INNER--; } return fb; }
WID.forEach(name => {
  ORIG[name] = eval(name);
  const w = function (body, ap, opt) {
    if (INNER) return ORIG[name](body, ap, opt);
    opt = opt || {};
    const rec = { t: name, opt: {} };
    for (const [k, v] of Object.entries(opt)) { if (typeof v === 'function' || k === 'ask' || k === 'then') continue; try { rec.opt[k] = JSON.parse(JSON.stringify(v)); } catch (e) { } }
    let extra;
    try {
      if (name === 'vo6Pour') { rec.figs0 = figsOf(run0(name, opt)); }
      else if (name === 'vo6Touch') { rec.figs0 = figsOf(run0(name, opt)).slice(0, 2); }
      else if (name === 'vo6Fill') {
        const fb = new El('div'); INNER++; try { ORIG[name](fb, api, opt); rec.figs0 = figsOf(fb); const N = vo6Slots(opt.box, opt.unit || [1, 1, 1]).out.length; click(fb, '한 개 넣기', N); rec.figs1 = figsOf(fb); rec.N = N; } finally { INNER--; }
      }
      else if (name === 'vo6Dims') {
        const mn = opt.min || [1, 1, 1], mx = opt.max || [10, 8, 8], sol = [];
        if (opt.check) for (let a = mn[0]; a <= mx[0]; a++) for (let b = mn[1]; b <= mx[1]; b++) for (let c = mn[2]; c <= mx[2]; c++) if (opt.check([a, b, c]) == null) sol.push([a, b, c]);
        rec.sol = sol; extra = sol[0];
        const st = opt.start || [1, 1, 1];
        rec.figsShow = opt.show ? figsOf(opt.show()) : [];
        const at = d => { const o = Object.assign({}, opt, { start: d, show: null }); const f = figsOf(run0(name, o)); return f[f.length - 1].svg; };
        rec.svgStart = at(st);
        if (opt.lock && opt.lock.filter(x => !x).length === 1) { const i = opt.lock.indexOf(false); rec.steps = [1, 2, 3].map(m => { const d = st.slice(); d[i] = st[i] * m; return { d, svg: at(d) }; }); }
        if (sol.length) rec.svgSol = at(sol[0]);
        rec.count = sol.length ? (opt.countText ? opt.countText(sol[0]) : null) : null;
      }
      else if (name === 'vo6Net') { const f = figsOf(run0(name, opt)); rec.netSvg = f[0].svg; rec.cubSvg = f[1] ? f[1].svg : null;
        rec.netPlain = String(vo6NetSvg(opt.d, opt.unit || 'cm', {})); }
      else if (name === 'vo6M3') { const fb = new El('div'); INNER++; try { ORIG[name](fb, api, opt); rec.figsM = [];
        ['한 줄 놓기', '한 층 채우기', '모두 채우기'].forEach(t => { click(fb, t); rec.figsM.push({ svg: figsOf(fb)[0].svg, label: t }); }); } finally { INNER--; } }
      else if (name === 'vo6Pack') {
        const N = opt.N, sol = [];
        for (let a = 1; a <= N; a++) for (let b = 1; b <= N; b++) for (let c = 1; c <= N; c++) if (a * b * c === N && (!opt.check || opt.check([a, b, c]) == null)) sol.push({ n: [a, b, c], D: vo6PackD(opt.box, [a, b, c]), s: vo6Surf(vo6PackD(opt.box, [a, b, c])) });
        rec.sol = sol; sol.sort((p, q) => p.s - q.s); extra = sol[0] && sol[0].n;
        rec.all = []; for (let a = 1; a <= N; a++) for (let b = 1; b <= N; b++) for (let c = 1; c <= N; c++) if (a * b * c === N) rec.all.push({ n: [a, b, c], D: vo6PackD(opt.box, [a, b, c]), s: vo6Surf(vo6PackD(opt.box, [a, b, c])) });
        const B = opt.box, packSvg = n => { const bl = []; for (let i = 0; i < n[0]; i++) for (let j = 0; j < n[1]; j++) for (let k = 0; k < n[2]; k++) bl.push({ x: i * B[0], y: j * B[1], z: k * B[2], w: B[0], d: B[1], h: B[2], c: VO6.box });
          const D = vo6PackD(B, n); return String(vo6Solid({ d: D, mode: 'none', blocks: bl, s: 9, plain: true })); };
        rec.svgSol = sol.length ? packSvg(sol[0].n) : null;
        rec.one = String(vo6Solid({ d: B, mode: 'solid', s: 9, tint: { top: VO6.box[0], front: VO6.box[1], right: VO6.box[2] }, labels: { a: B[0] + ' cm', b: B[1] + ' cm', c: B[2] + ' cm' }, plain: true }));
      }
      else if (name === 'vo6Make') { rec.friendSvg = String(vo6Cub(opt.friend.d, 'cm', { maxW: '12em' })); }
      else if (name === 'vo6Hunt') { rec.names = VO6_NAMES; }
    } catch (e) { rec.err = String(e && e.stack || e).slice(0, 600); }
    const ask = typeof opt.ask === 'function' ? opt.ask(extra) : opt.ask;
    rec.ask = (ask || []).map(serQ);
    if (opt.then) rec.then = capThen(opt.then, extra);
    rec.ok = opt.ok || '';
    REC.push(rec);
  };
  eval(name + ' = w');
});
function cap(render) { REC = []; const body = new El('div'); try { render(body, api); } catch (e) { REC.push({ t: 'error', err: String(e.stack || e).slice(0, 600) }); }
  const ex = extras(body); if (ex.length) REC.unshift({ t: 'pre', items: ex }); return REC; }
const OUT = { story: UNIT_STORY, lessons: LESSONS.map(L => ({ id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(s => ({ name: s.name, inst: s.inst, hints: s.hints || [], recs: cap(s.render) })),
  challenge: L.challenge ? { inst: L.challenge.inst, hints: L.challenge.hints || [], recs: cap(L.challenge.render) } : null })) };
OUT.D = typeof VO6_D !== 'undefined' ? VO6_D : VO6S; OUT.P8 = typeof VO6_P8 !== 'undefined' ? VO6_P8 : VO6S_P8; OUT.names = VO6_NAMES;
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
SRC_TB = os.path.join(UNITS, 'u6-volume.tb.js')
SRC_ST = os.path.join(UNITS, 'u6-volume.st.js')
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
UNIT_NAME = '6. 직육면체의 부피와 겉넓이'
NAME = '6단원_직육면체의부피와겉넓이_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨⑩'
KO = '㉠㉡㉢㉣㉤㉥㉦㉧'
WORK = tempfile.mkdtemp(prefix='u6vol_')
K = 40            # 실제 크기: 1 cm = 40 px → 그림 너비 mm = px ÷ 4

INK, BLUE, RED, GRAY, GRID = '#1D2A2A', '#2B7BD6', '#D64545', '#8795A1', '#B8C6D2'


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
            fs = max(19 if len(name) < 8 else 16, cw / 15)
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




# ================================================================ 실제 크기 그림
def net_real_svg(d, unit='cm', labels=True):
    """직육면체의 전개도(앱 vo6NetFaces와 같은 놓임: 윗면 / 왼쪽 옆면·앞면·오른쪽 옆면·뒷면 / 아랫면), 실제 크기"""
    a, b, c = d
    L, T, Rm, B = 1.5 * K, 0.8 * K, 0.3 * K, 0.9 * K
    W, H = (2 * a + 2 * b) * K + L + Rm, (2 * b + c) * K + T + B
    faces = [(0, b, b, c), (b, b, a, c), (b + a, b, b, c), (2 * b + a, b, a, c), (b, 0, a, b), (b, b + c, a, b)]
    out = []
    for x, y, w, h in faces:
        out.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="2.5"/>'
                   % (fmt(L + x * K), fmt(T + y * K), fmt(w * K), fmt(h * K), INK))
    if labels:
        lab = lambda x, y, t, anc='middle': out.append(_t(x, y, t, 17, BLUE, anc))
        lab(L + (b + a / 2) * K, T - 14, '%s %s' % (fmt(a), unit))
        lab(L + b * K - 8, T + b / 2 * K, '%s %s' % (fmt(b), unit), 'end')
        lab(L - 8, T + (b + c / 2) * K, '%s %s' % (fmt(c), unit), 'end')
        lab(L + b / 2 * K, T + (b + c) * K + 16, '%s %s' % (fmt(b), unit))
    return _svg(W, H, ''.join(out))


def cube_net_real():
    """한 모서리 1 cm 정육면체의 전개도(십자 모양), 실제 크기, 접는 선은 점선"""
    m = 0.6 * K
    cells = [(1, 0), (0, 1), (1, 1), (2, 1), (3, 1), (1, 2)]
    W, H = 4 * K + 2 * m, 3 * K + 2 * m
    out = []
    for x, y in cells:
        out.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#FFE7AE" stroke="none"/>' % (fmt(m + x * K), fmt(m + y * K), K, K))
    # 바깥선(실선)과 접는 선(점선)
    S = set(cells)
    for x, y in cells:
        for dx, dy, p, q in [(0, -1, (x, y), (x + 1, y)), (0, 1, (x, y + 1), (x + 1, y + 1)), (-1, 0, (x, y), (x, y + 1)), (1, 0, (x + 1, y), (x + 1, y + 1))]:
            inner = (x + dx, y + dy) in S
            if inner and (dx < 0 or dy < 0):
                continue
            out.append(_ln((m + p[0] * K, m + p[1] * K), (m + q[0] * K, m + q[1] * K), INK, 1.6 if inner else 2.4, '4 3' if inner else None))
    return _svg(W, H, ''.join(out))


def rect_real(w, h):
    """가로 w cm, 세로 h cm 직사각형, 실제 크기(길이 글은 바깥에)"""
    L, T = 0.4 * K, 0.4 * K
    W, H = w * K + L + 1.6 * K, h * K + T + 0.9 * K
    out = ['<rect x="%s" y="%s" width="%s" height="%s" fill="#FFE9C4" stroke="%s" stroke-width="2.5"/>' % (fmt(L), fmt(T), w * K, h * K, INK),
           _t(L + w * K / 2, T + h * K + 18, '%s cm' % fmt(w), 17, BLUE), _t(L + w * K + 10, T + h * K / 2, '%s cm' % fmt(h), 17, BLUE, 'start')]
    return _svg(W, H, ''.join(out))


REAL_NOTE = '※ 아래 그림은 실제 크기예요. 100%로 인쇄하면 자로 재어 확인할 수 있어요.'


def side(s, figs, mm=None, labels=True):
    """[(이름, svg)] 여러 그림을 한 줄로(높이를 맞춤)"""
    if len(figs) == 1:
        pic(s, figs[0][1], mm or fig_mm(figs[0][1], 0.3))
        return
    ws = [vb(f[1])[2] for f in figs]
    hs = [vb(f[1])[3] for f in figs]
    H = max(hs)
    cw = max(w * H / h for w, h in zip(ws, hs))
    lab = labels and any(f[0] for f in figs)
    svg = cards_svg(figs, cols=len(figs), cw=cw, ch=H, lab=lab, box=lab)
    pic(s, svg, mm or max(110, min(170, fig_mm(svg, 0.25))))


# ================================================================ 종이에 맞게 글 고치기
PAPER_RULES = [
    (r'되로 쌀을 퍼서 말에 부어 보세요\.', '되로 쌀을 퍼서 말에 붓는다고 생각해 보세요.'),
    (r'책장을 넘겨 이 단원에서 배울 내용을 모두 골라 붙임딱지를 붙여 보세요\.', '이 단원에서 배울 내용을 모두 골라 보세요.'),
    (r'두 상자 가와 나의 면끼리 여러 가지로 맞대어 보세요\.', '두 상자 가와 나의 면끼리 여러 가지로 맞대어 본다고 생각해 보세요.'),
    (r'상자 안을 빈틈없이 채우며 따라 해 보세요\.', '상자 안을 빈틈없이 채운 그림을 보고 세어 보세요.'),
    (r'두 상자에 쌓기나무를 채워 보세요\.', '두 상자에 쌓기나무를 채운 그림을 보고 세어 보세요.'),
    (r'쌓기나무로 가로, 세로, 높이의 변화에 따른 부피의 변화를 살펴보세요\.', '쌓기나무 그림을 보고 가로, 세로, 높이의 변화에 따른 부피의 변화를 살펴보세요.'),
    (r'쌓기나무로 똑같이 쌓아 보세요\.', '쌓기나무로 똑같이 쌓은 그림을 살펴보세요.'),
    (r'이 앱에서는 교실', '이 활동지에서는 교실'),
    (r'1 cm³ 쌓기나무로 1 m³ 정육면체를 만들어', '1 cm³ 쌓기나무로 1 m³ 정육면체를 채운 그림을 보고'),
    (r'□ 안에 알맞은 수를 써넣고, 부피가 같은 것끼리 이어 보세요\.', '빈칸에 알맞은 수를 써넣고, 부피가 같은 것끼리 찾아보세요.'),
    (r'상자 4개를 가 모양처럼 한 층에 1개씩 4층으로 쌓아 보세요\.', '상자 4개를 가 모양처럼 한 층에 1개씩 4층으로 쌓았어요.'),
    (r'상자 4개를 나 모양처럼 한 층에 2개씩\(앞뒤로 2개\) 2층으로 쌓아 보세요\.', '상자 4개를 나 모양처럼 한 층에 2개씩(앞뒤로 2개) 2층으로 쌓았어요.'),
    (r'쌓아 비교해 보세요\.', '쌓은 모양을 비교해 보세요.'),
    (r'포장지를 더 적게 사용하도록 쌓아 보세요\.', '포장지를 더 적게 사용하도록 쌓는 방법을 찾아보세요.'),
    (r'내 붙임쪽지 3장을 만들어 붙이고, 다른 모둠 친구가 구한 부피를 확인해 보세요\.', '내 붙임쪽지 3장에 적을 수를 정하고, 다른 모둠 친구가 구한 부피를 확인해 보세요.'),
    (r'다른 모둠 친구들이 교실 곳곳에 붙인 쪽지를 3분 동안 찾고, 부피를 구해 보세요\.', '다른 모둠 친구들이 교실 곳곳에 붙인 쪽지를 3분 동안 찾고, 기록표에 적어 부피를 구해 보세요.'),
    (r'면을 눌러 평행한 두 면을 찾아보세요\.', '평행한 두 면을 찾아 같은 색으로 칠해 보세요.'),
    (r'\s*전개도의 면을 모두 눌러 보세요\.', ''),
    (r'로 늘려 보세요\.$', '로 늘린 그림을 살펴보세요.'),
    (r'가를 쌓기나무로 채워 보세요\.', '가를 쌓기나무로 채운 그림을 살펴보세요.'),
]
ST_RULES = [   # 이야기 버전 글만(교과서 버전 글은 그대로)
    (r'떠오르는 것을 세 칸에 써서 붙여요\.', '떠오르는 것을 세 칸에 써 보세요.'),
    (r'배울 내용을 차례대로 눌러 보세요\.', '배울 내용을 차례대로 기호로 써 보세요.'),
    (r'카드를 차례대로 눌러 보세요\.', '카드를 차례대로 기호로 써 보세요.'),
    (r'두 수납 상자 가와 나의 면끼리 여러 가지로 맞대어 보세요\.', '두 수납 상자 가와 나의 면끼리 여러 가지로 맞대어 본다고 생각해 보세요.'),
    (r'두 상자를 빈틈없이 채워 보세요\.', '두 상자를 빈틈없이 채운 그림을 보고 세어 보세요.'),
    (r'쌓기나무로 가로, 세로, 높이를 늘려 보며 부피의 변화를 살펴보세요\.', '쌓기나무 그림을 보고 가로, 세로, 높이를 늘렸을 때 부피의 변화를 살펴보세요.'),
    (r'쌓기나무로 똑같이 쌓고, 하나하나', '쌓기나무로 똑같이 쌓은 그림을 보고, 하나하나'),
    (r'정육면체 틀을 쌓아 보세요\.', '정육면체 틀을 가득 쌓은 그림을 살펴보세요.'),
    (r'먼저 예상해 보고, 쌓기나무를 채워 보세요\.', '먼저 예상해 보고, 쌓기나무를 채운 그림으로 확인해 보세요.'),
    (r'두 가지 모양으로 쌓아 보세요\.', '두 가지 모양으로 쌓은 그림을 살펴보세요.'),
    (r'한 층에 1개씩 4층으로 쌓아 보세요\.', '한 층에 1개씩 4층으로 쌓았어요.'),
    (r'한 층에 4개씩 1층으로 놓아 보세요\.', '한 층에 4개씩 1층으로 놓았어요.'),
    (r'내 붙임쪽지 3장을 만들어 교실에 붙여요\.', '내 붙임쪽지 3장에 적을 수를 정해요.'),
]
INTERACT = re.compile(r'눌러|누르|누를|끌어|단추|화면|컴퓨터 친구|앱|‘한 줄 채우기’|‘한 층 채우기’')


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
    return p['o'][a]


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


# ================================================================ 이야기 엔진 부품 → 활동지
def w_panes(s, lv, rec):
    """보여요·생각해요·궁금해요 세 칸(이야기 1차시)"""
    put_fig(s, rec.get('fig'), 0.25, hi=150)
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
REAL_Q = {'직사각형의 넓이는 몇 cm²인가요?': lambda: rect_real(8, 5),
          '직사각형 모양 이름표의 넓이는 몇 cm²인가요?': lambda: rect_real(9, 6)}     # 이야기 버전 1차시


def w_ask_real(s, lv, rec, k=0.25):
    """앱 물음 가운데 실제 크기로 그릴 그림이 있으면 바꾸어 넣기"""
    items = rec['items'] if 'items' in rec else rec
    for it in items:
        if it.get('q') in REAL_Q and it.get('fig'):
            it['fig'] = None
            it['_real'] = REAL_Q[it['q']]()
    if any(it.get('_real') for it in items):
        out = []
        for it in items:
            if it.get('_real'):
                s.ask(it['q'], blank=False)
                s.text(REAL_NOTE)
                pic_real(s, it['_real'])
                sub = dict(it)
                sub['q'] = None
                out.append(w_ask(s, lv, [sub], k))
            else:
                out.append(w_ask(s, lv, [it], k))
        return ', '.join(x for x in out if x)
    return w_ask(s, lv, rec, k)


def after(s, lv, rec, ans=''):
    """조작 뒤의 물음(ask)과 이어지는 활동(then)"""
    out = [ans] if ans else []
    if rec.get('ask'):
        out.append(w_ask_real(s, lv, rec['ask']))
    for r in rec.get('then') or []:
        out.append(run_rec(s, lv, r))
    return ' / '.join(x for x in out if x)


def w_pre(s, lv, rec):
    for it in rec['items']:
        if it['figs']:
            side(s, [(f['label'], f['svg']) for f in it['figs']], 60 if len(it['figs']) == 1 else None)
        elif it['text'] and not it['small']:
            t = paper(it['text'])
            if t:
                s.fill(t)
    return ''


def w_pour(s, lv, rec):
    pic(s, rec['figs0'][0]['svg'], 85)
    s.text('왼쪽은 되, 오른쪽은 말이에요. 말 옆의 눈금은 말의 높이를 10칸으로 나눈 것이에요.')
    return after(s, lv, rec)


def faces_of(d):
    """앱 vo6Touch와 같은 면 모양(앞면·옆면·윗면, 같은 모양은 한 번만)"""
    f = [(d[0], d[2], '앞면'), (d[1], d[2], '옆면'), (d[0], d[1], '윗면')]
    seen, out = set(), []
    for x in f:
        key = tuple(sorted(x[:2]))
        if key not in seen:
            seen.add(key)
            out.append(x)
    return out


def w_touch(s, lv, rec):
    A, B = rec['opt']['A'], rec['opt']['B']
    nA, nB = rec['opt'].get('nA') or '상자 가', rec['opt'].get('nB') or '상자 나'
    side(s, [(nA, rec['figs0'][0]['svg']), (nB, rec['figs0'][1]['svg'])], 110)
    s.text('%s는 가로 쌓기나무 %d개, 세로 %d개, 높이 %d개 길이이고, %s는 가로 %d개, 세로 %d개, 높이 %d개 길이예요.' % (nA, A[0], A[1], A[2], nB, B[0], B[1], B[2]))
    FA, FB = faces_of(A), faces_of(B)
    both = [(a, b) for a in FA for b in FB if sorted(a[:2]) == sorted(b[:2])]
    s.choices([('가와 나의 면끼리 맞대었을 때 두 길이가 모두 같은 면이 있나요?', '( 있어요 / 없어요 )')])
    a = '두 길이가 모두 같은 면 %s' % ('있어요' if both else '없어요')
    return after(s, lv, rec, a)


def w_fill(s, lv, rec):
    o = rec['opt']
    nm = o.get('name') or '쌓기나무'
    if o.get('unit') and o['unit'] != [1, 1, 1]:
        u = o['unit']
        s.text('%s 한 개는 쌓기나무 가로 %d개, 세로 %d개, 높이 %d개 크기예요. 상자 가를 %s로 빈틈없이 채웠어요.' % (nm, u[0], u[1], u[2], nm))
    else:
        s.text('상자를 %s로 빈틈없이 채웠어요.' % nm)
    pic(s, rec['figs1'][0]['svg'], 62)
    return after(s, lv, rec)


def w_dims(s, lv, rec):
    o = rec['opt']
    if rec.get('steps'):
        side(s, [(lab, st['svg']) for lab, st in zip(['처음', '2배', '3배'], rec['steps'])], 150)
        ans = ''
    elif o.get('room'):
        r = o['room']
        s.text('교실(가로 %d m, 세로 %d m, 높이 %d m) 안을 1 m³ 정육면체로 가득 쌓은 그림이에요.' % tuple(r))
        pic(s, rec['svgSol'], 70)
        ans = ''
    elif rec.get('figsShow'):
        side(s, [(f['label'] or '만들 모양', f['svg']) for f in rec['figsShow']] + [('쌓기나무로 쌓은 모양', rec['svgSol'])], 120)
        ans = ''
    else:
        side(s, [('처음', rec['svgStart']), ('가로·세로·높이를 2배로', rec['svgSol'])], 110)
        ans = ''
    return after(s, lv, rec, ans)


def w_net(s, lv, rec):
    o = rec['opt']
    d, mode = o['d'], o.get('mode', 'six')
    a, b, c = d
    if d == [5, 2, 3] and mode == 'six':
        s.text(REAL_NOTE)
        pic_real(s, net_real_svg(d))
    else:
        figs = [('', rec['netPlain'])] + ([('', rec['cubSvg'])] if rec.get('cubSvg') else [])
        side(s, figs, 120 if mode != 'six' else 130, labels=False)
    ar = [b * c, a * c, b * c, a * c, a * b, a * b]
    if mode == 'six':
        s.text('전개도의 여섯 면에 각 면의 넓이를 써 보세요.' + (' 자로 재어 길이를 확인해요.' if d == [5, 2, 3] else ''))
        ans = '면의 넓이 %s cm²' % ', '.join(str(x) for x in [a * b, b * c, a * c, b * c, a * c, a * b])
    elif mode == 'pair':
        s.text('평행한 두 면을 같은 색으로 칠해 보세요. 모두 몇 쌍인가요?   답: (        )쌍')
        ans = '3쌍(%d cm² 2개, %d cm² 2개, %d cm² 2개)' % (a * b, b * c, a * c)
    else:
        s.text('옆면 네 개를 이어 붙인 하나의 직사각형을 찾아 빨간색으로 테두리를 그려 보세요.')
        ans = '옆면: 가로 %d cm, 세로 %d cm인 직사각형' % (2 * a + 2 * b, c)
    del ar
    return after(s, lv, rec, ans)


def w_m3(s, lv, rec):
    side(s, [(f['label'], f['svg']) for f in rec['figsM']], 160)
    s.text('※ 쌓기나무 한 개는 너무 작아서 그림에서는 10 cm마다 선을 긋고, 줄·층의 두께를 크게 그렸어요.')
    return after(s, lv, rec)


CTX = {'challenge': False}


def w_pack(s, lv, rec):
    o = rec['opt']
    B, N = o['box'], o['N']
    s.text('상자 한 개는 가로 %d cm, 세로 %d cm, 높이 %d cm예요. (겹치는 부분 없이 포장해요.)' % tuple(B))
    if DATA.get('kind') == 'st' and o.get('start'):
        return w_pack_search(s, lv, rec)
    if CTX['challenge']:
        good = [p for p in rec['all'] if p['s'] < 632]
        assert len(good) == 1 and len(rec['sol']) == 1 and good[0]['n'] == rec['sol'][0]['n'], good
        pic(s, rec['one'], 40)
        s.text('상자 %d개를 여러 가지로 쌓아 보고, 쌓은 모양의 크기와 겉넓이를 표에 써 보세요.' % N)
        rows = [['가로로', '세로로', '위로', '쌓은 모양(가로 × 세로 × 높이)', '겉넓이']]
        ex = next(p for p in rec['all'] if p['n'] == [2, 2, 2])
        if lv == '기본형':
            rows.append(['2개', '2개', '2층', '%d cm × %d cm × %d cm' % tuple(ex['D']), '%d cm²' % ex['s']])
        rows += [['개', '개', '층', 'cm ×      cm ×      cm', 'cm²'] for _ in range(4)]
        s.table(rows, col_mm=[22, 22, 22, 74, 40])
        if lv == '기본형':
            s.text('도움: 쌓은 모양이 정육면체에 가까울수록 겉넓이가 좁아지는 경향이 있어요. 위로 4층, 앞뒤로 2개도 쌓아 보세요.')
        s.ask('632 cm²보다 겉넓이가 좁은 쌓기:   가로 (     ) cm, 세로 (     ) cm, 높이 (     ) cm, 겉넓이 (       ) cm²', blank=False)
        g = good[0]
        others = ', '.join('%s %d' % ('×'.join(map(str, p['n'])), p['s']) for p in sorted(rec['all'], key=lambda p: p['s']))
        return '가로 %d cm, 세로 %d cm, 높이 %d cm(가로로 %d개·앞뒤로 %d개·%d층) → 겉넓이 %d cm² (8개를 쌓는 방법 모두: %s)' % (
            tuple(g['D']) + tuple(g['n']) + (g['s'], others))
    # 상자 한 개와 쌓은 모양을 같은 비율로(두 그림 모두 1 cm = 9 px)
    svg = same_scale([('상자 한 개', rec['one']), ('쌓은 모양', rec['svgSol'])])
    pic(s, svg, min(150, vb(svg)[2] * 0.32))
    return after(s, lv, rec)


def w_pack_search(s, lv, rec):
    """이야기 9차시 '상자 8개 쌓기': 앱에서 찾는 활동이라 정답 그림 대신 쌓는 방법을 적는 표"""
    o = rec['opt']
    N, st0 = o['N'], o['start']
    best = min(p['s'] for p in rec['all'])
    good = [p for p in rec['all'] if p['s'] == best]
    assert len(good) == 1 and len(rec['sol']) == 1 and good[0]['n'] == rec['sol'][0]['n'], good
    pic(s, rec['one'], 40)
    s.text('상자 %d개를 여러 가지로 쌓아 보고, 쌓은 모양의 크기와 겉넓이를 표에 써 보세요. 겉넓이가 가장 작은 모양을 찾아요.' % N)
    rows = [['가로로', '앞뒤로', '위로', '쌓은 모양(가로 × 세로 × 높이)', '겉넓이']]
    ex = next(p for p in rec['all'] if p['n'] == st0)
    rows.append(['%d개' % st0[0], '%d개' % st0[1], '%d층' % st0[2], '%d cm × %d cm × %d cm' % tuple(ex['D']), '%d cm²' % ex['s'] if lv == '기본형' else 'cm²'])
    rows += [['개', '개', '층', 'cm ×      cm ×      cm', 'cm²'] for _ in range(4)]
    s.table(rows, col_mm=[22, 22, 22, 74, 40])
    g = good[0]
    others = ', '.join('%s %d' % ('×'.join(map(str, p['n'])), p['s']) for p in sorted(rec['all'], key=lambda p: p['s']))
    a = '표: 처음 모양 %d×%d×%d → %d cm × %d cm × %d cm, %d cm² / 가장 작은 쌓기 가로로 %d개·앞뒤로 %d개·%d층 → %d cm × %d cm × %d cm, %d cm² (8개를 쌓는 방법 모두: %s)' % (
        tuple(st0) + tuple(ex['D']) + (ex['s'],) + tuple(g['n']) + tuple(g['D']) + (g['s'], others))
    return after(s, lv, rec, a)


def same_scale(items, gap=40):
    """그림을 줄이거나 늘리지 않고 아래를 맞춰 나란히(이름은 아래)"""
    H = max(vb(v)[3] for _, v in items)
    x, out = 0, []
    for name, v in items:
        vx, vy, vw, vh = vb(v)
        out.append(nest(v, x, H - vh, vw, vh))
        out.append(_t(x + vw / 2, H + 18, name, 15, INK, weight='bold'))
        x += vw + gap
    return _svg(x - gap, H + 34, ''.join(out))


def w_make(s, lv, rec):
    o = rec['opt']
    vol = o.get('kind') != 'surf'
    U, word = ('cm³', '부피') if vol else ('cm²', '겉넓이')
    where = '교실에서' if DATA.get('kind') == 'st' else '주변에서'
    s.text('① 내 문제 만들기 — %s 직육면체 모양의 물건을 하나 골라 자로 가로, 세로, 높이를 재고, %s를 구하는 문제를 만들어 보세요.' % (where, word))
    if lv == '기본형':
        s.text('예) ' + ', '.join(o.get('objs') or ['지우개', '필통', '과자 상자', '택배 상자', '사물함', '주사위', '초콜릿 상자', '휴지 상자']))
    s.labeled([('고른 물건', ''), ('잰 길이', '가로 (       ) cm,  세로 (       ) cm,  높이 (       ) cm'), ('내가 만든 문제', ''), ('내 답', '')],
              label_mm=34, row_h=3969 + 600)
    f = o['friend']
    s.text('② 바꾸어 풀기 — %s 만든 문제를 풀어 보세요.' % (jo(f['who'], '이/가') if f.get('who') else '짝이'))
    s.fill(f['q'])
    pic(s, rec['friendSvg'], 50)
    s.ask('%s의 %s:   (            ) %s' % (f['obj'], word, U), blank=False)
    d = f['d']
    right = d[0] * d[1] * d[2] if vol else 2 * (d[0] * d[1] + d[1] * d[2] + d[0] * d[2])
    assert right == f['a'], (f, right)
    return '내 문제: 잰 길이로 바르게 계산하면 맞아요 / %s의 문제 %d %s' % (f.get('who') or '짝', f['a'], U)


def w_notes(s, lv, rec):
    s.text('붙임쪽지 3장에 서로 다른 크기의 직육면체의 가로, 세로, 높이를 적어요. 1부터 20까지의 자연수로 써요.')
    s.table([['쪽지', '이름', '가로(cm)', '세로(cm)', '높이(cm)', '부피(cm³)']] + [['%d장' % i, '', '', '', '', '(친구가 씀)'] for i in (1, 2, 3)],
            col_mm=[18, 32, 30, 30, 30, 40])
    friend = DATA['names'][3]
    D = [[6, 5, 4], [12, 3, 10], [8, 7, 2]] if lv == '기본형' else [[15, 4, 6], [9, 11, 5], [13, 6, 7]]
    wrong = 2
    res = []
    for i, d in enumerate(D):
        v = d[0] * d[1] * d[2]
        w = d[0] * d[1] + d[2]
        res.append(v if i != wrong else (w if w != v else v + 10))
    s.text('연습해요: 다른 모둠의 %s 내 쪽지 3장을 찾아 부피를 구해 왔어요. 맞으면 ○, 틀리면 ×를 쓰고, 틀린 것은 바르게 고쳐 보세요.' % jo(friend, '이/가'))
    s.table([['가로', '세로', '높이', '친구가 구한 부피', '○ / ×', '바른 부피']] +
            [['%d cm' % d[0], '%d cm' % d[1], '%d cm' % d[2], '%d cm³' % r, '', ''] for d, r in zip(D, res)],
            col_mm=[22, 22, 22, 44, 25, 45])
    marks = ['○' if r == d[0] * d[1] * d[2] else '× (바른 부피 %d cm³)' % (d[0] * d[1] * d[2]) for d, r in zip(D, res)]
    return '내 쪽지: 1~20의 자연수, 서로 다른 크기 / 연습: ' + ', '.join(marks)


def jo(w, pair):
    """받침에 따라 조사(앱 vo6Jo와 같음)"""
    a, b = pair.split('/')
    c = str(w).strip()[-1]
    bat = False
    if c.isdigit():
        bat = c in '0136780'
    elif '가' <= c <= '힣':
        bat = (ord(c) - 0xAC00) % 28 != 0
    return w + (a if bat else b)


def w_hunt(s, lv, rec):
    s.text('찾은 붙임쪽지를 아래 기록표에 옮겨 적고, 부피를 구해 쪽지 주인에게 확인해요. 부피를 바르게 구한 쪽지 수만큼 점수를 얻어요.')
    s.table([['쪽지 주인', '가로(cm)', '세로(cm)', '높이(cm)', '부피(cm³)', '확인']] + [[''] * 6 for _ in range(3)],
            col_mm=[34, 26, 26, 26, 40, 28])
    rnd = random.Random('u6-volume hunt ' + lv)
    names = DATA['names']
    notes, used = [], set()
    while len(notes) < 3:
        d = [rnd.randint(1, 20) for _ in range(3)] if lv == '도전형' else [rnd.randint(2, 12) for _ in range(3)]
        if tuple(d) in used:
            continue
        used.add(tuple(d))
        notes.append(d)
    s.text('연습해요: 이런 쪽지를 찾았다면 부피는 몇 cm³일까요?')
    s.table([['쪽지 주인', '가로', '세로', '높이', '부피']] +
            [[names[i + 4], '%d cm' % d[0], '%d cm' % d[1], '%d cm' % d[2], '(          ) cm³'] for i, d in enumerate(notes)],
            col_mm=[34, 26, 26, 26, 68])
    if lv == '기본형':
        s.text('도움: (직육면체의 부피) = (가로) × (세로) × (높이). 계산기를 써도 돼요.')
    return '찾은 쪽지는 (가로) × (세로) × (높이) / 연습: ' + ', '.join('%s %d cm³' % (names[i + 4], d[0] * d[1] * d[2]) for i, d in enumerate(notes))


def w_cards(s, lv, rec):
    sets = [[('가로', 3), ('세로', 5), ('높이', 4)], [('가로', 3), ('가로', 4), ('높이', 6)], [('높이', 2), ('세로', 7), ('가로', 10)]]
    if lv == '도전형':
        sets.append([('세로', 12), ('높이', 5), ('세로', 8)])
    s.text('연습해요: 뒤집은 종이 3장이 이렇다면 가져올 수 있을까요? 가져올 수 있으면 부피도 구해 보세요.')
    rows = [['뒤집은 종이 3장', '가져와요 / 다시 놓아요', '부피(cm³)']]
    ans = []
    for st in sets:
        rows.append(['  ·  '.join('%s %d cm' % x for x in st), '가져와요 · 다시 놓아요', ''])
        ks = {k for k, _ in st}
        if len(ks) == 3:
            v = 1
            for _, x in st:
                v *= x
            ans.append('가져와요 %d' % v)
        else:
            miss = [k for k in ('가로', '세로', '높이') if k not in ks]
            ans.append('다시 놓아요(%s 없음)' % '·'.join(miss))
    s.table(rows, col_mm=[80, 56, 44])
    s.text('놀이 기록표: 내가 가져온 종이로 부피를 구하고, 부피의 합을 구해 보세요.')
    s.table([['가로(cm)', '세로(cm)', '높이(cm)', '부피(cm³)']] + [[''] * 4 for _ in range(4)] + [['합계', '', '', '']])
    return '연습: ' + ', '.join(ans) + ' / 기록표: 부피를 모두 더하면 돼요'


def w_chain(s, lv, rec):
    out = []
    for p in rec['parts']:
        if p.get('title'):
            t = paper(p['title'])
            if t:
                s.text('▶ ' + t)
        for e in p.get('extra') or []:
            if e['figs']:
                side(s, [(f['label'], f['svg']) for f in e['figs']])
            elif e['text'] and not e['small']:
                t = paper(e['text'])
                if t:
                    s.fill(t)
        for r in p['recs']:
            out.append(run_rec(s, lv, r))
    return ' / '.join(x for x in out if x)


WIDGETS = {'ask': w_ask_real, 'quiz': w_quiz, 'blanks': w_blanks, 'write': w_write, 'chain': w_chain, 'pre': w_pre,
           'vo6Pour': w_pour, 'vo6Touch': w_touch, 'vo6Fill': w_fill, 'vo6Dims': w_dims, 'vo6Net': w_net, 'vo6M3': w_m3,
           'vo6Pack': w_pack, 'vo6Make': w_make, 'vo6Hunt': w_hunt, 'vo6Notes': w_notes, 'vo6Cards': w_cards,
           'sequence': w_sequence, 'panes': w_panes, 'thenwhy': w_thenwhy, 'rule': w_rule, 'wonder': w_wonder}


def run_rec(s, lv, r):
    if r['t'] not in WIDGETS:
        raise RuntimeError('활동지에 아직 없는 부품: %s — gen_u6-volume.py의 WIDGETS에 더하세요' % r['t'])
    return WIDGETS[r['t']](s, lv, r)


# 차시마다 더 넣는 실제 크기 그림(차시 id, 단계 이름)
def extra_cube(s, lv):
    s.text('한 모서리의 길이가 1 cm인 정육면체의 전개도예요. 오려서 점선을 따라 접고 테이프로 붙이면 1 cm³ 정육면체가 돼요.')
    s.text(REAL_NOTE)
    pic_real(s, cube_net_real())
    s.ask('자로 재어 보면 한 모서리의 길이는 몇 cm인가요?', answer_space=10)
    return '전개도 한 모서리 1 cm'


EXTRA = {('t2', '약속하기'): extra_cube, ('s2', '약속하기 — 1 cm³'): extra_cube}


# ================================================================ 정답 다시 계산(앱의 수와 맞추기)
def all_nums(recs, out=None):
    """기록 안의 모든 수 칸: (앞 글, 정답)"""
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


EXPR = re.compile(r'(\(?\d[\d.\s()−\-+×÷]*[−\-+×÷][\d.\s()−\-+×÷]*\d\)?)\s*=\s*$')


def check_numbers(D, expect=None, min_expr=25):
    """식이 적힌 칸은 식을 계산해 맞추고, 식이 없는 칸은 문제의 수로 따로 계산한 값과 맞춥니다."""
    seen, nexpr = [], 0
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
    assert nexpr >= min_expr, nexpr
    vol = lambda a, b, c: a * b * c
    surf = lambda a, b, c: 2 * (a * b + b * c + a * c)
    expect = expect if expect is not None else [8 * 5, 100 * 100, vol(*D['D']['boxA']), vol(*D['D']['boxB']), vol(*D['D']['boxA']) // 4,     # 1·2차시(지우개는 쌓기나무 4개)
              vol(4, 3, 3), 4 * 3, vol(5, 4, 2), 5 * 4, vol(6, 4, 5), vol(5, 5, 5), vol(10, 9, 7), vol(8, 8, 8), vol(7, 4, 9),
              vol(10, 4, 6), 6 ** 3, 45 * 7, 360 / (12 * 6), vol(10, 14, 10), 2 ** 3,
              vol(400, 200, 250), 12, vol(9, 7, 3), 100 ** 3, 5 * 10 ** 6, 12000000 / 10 ** 6, 7 * 10 ** 6, 46000000 / 10 ** 6,
              vol(6, 3, 3), vol(300, 400, 250) / 10 ** 6, vol(7, 8, 5), 27, 900000 / 10 ** 6, vol(200, 400, 60) / 10 ** 6,
              surf(5, 2, 3), 2 * 5 + 2 * 2, surf(3, 5, 8), surf(12, 25, 15), surf(6, 30, 30), surf(6, 30, 30) - surf(12, 25, 15),
              8 * 8 * 6, 5 * 5 * 6, 12 * 12 * 6, surf(4, 5, 6), surf(10, 7, 2), 6 * 6 * 6, 96 / 12,
              surf(8, 5, 12), surf(8, 10, 6), surf(16, 10, 6), surf(16, 5, 12), vol(16, 10, 6), surf(8, 10, 12),
              vol(10, 8, 4), 20 ** 3, vol(5, 2, 2), vol(3, 3, 2), 2 * 10 ** 6, 130000000 / 10 ** 6, vol(9, 5, 2), surf(9, 5, 2),
              7 ** 3, 7 * 7 * 6, 30 * 2 + 52, vol(4, 4, 6), surf(4, 4, 6), 40 ** 3, vol(30, 60, 20), vol(40, 30, 60), 150 / 6, 5, 125]
    for v in expect:
        assert any(abs(v - n) < 1e-9 for n in seen), ('앱 답 중에 없음', v)


# ================================================================ 차시
WHY = {   # 도전형 '왜' 쓰기(차시 id → 물음, 예시 답)
    't1': ('상자에 물건을 담을 때와 상자를 포장할 때 각각 무엇을 알아야 하는지 까닭과 함께 써 보세요.',
           '예) 물건을 많이 담으려면 상자가 차지하는 공간의 크기인 부피를, 포장하려면 포장지가 덮을 겉면의 넓이인 겉넓이를 알아야 해요.'),
    't2': ('채린이처럼 지우개와 쌓기나무로 쌓은 개수(8개, 24개)로는 부피를 비교할 수 없는 까닭을 써 보세요.',
           '예) 지우개와 쌓기나무는 크기가 달라서 개수만으로는 어느 쪽이 더 큰지 알 수 없어요. 같은 단위로 세어야 비교할 수 있어요.'),
    't34': ('직육면체의 부피를 (가로) × (세로) × (높이)로 구할 수 있는 까닭을 쌓기나무로 설명해 보세요.',
            '예) 한 층에 쌓기나무가 (가로) × (세로)개 놓이고, 그런 층이 높이만큼 쌓이니까 모두 (가로) × (세로) × (높이)개예요.'),
    't56': ('1 m³가 1000000 cm³인 까닭을 써 보세요. 1 m²가 10000 cm²인 것과 견주어 보세요.',
            '예) 1 m = 100 cm이므로 1 m³ 안에 쌓기나무가 가로·세로·높이로 100개씩, 100 × 100 × 100 = 1000000개 들어가요. 넓이는 100 × 100이라 10000이에요.'),
    't78': ('직육면체의 겉넓이를 (한 꼭짓점에서 만나는 세 면의 넓이의 합) × 2로 구할 수 있는 까닭을 써 보세요.',
            '예) 서로 평행한 두 면은 모양과 크기가 같아서, 서로 다른 세 면의 넓이를 더한 뒤 2배 하면 여섯 면의 넓이의 합이 돼요.'),
    't9': ('상자를 쌓은 모양이 달라도 부피는 같은데 겉넓이는 다른 까닭을 써 보세요.',
           '예) 상자 수가 같아서 차지하는 공간은 같지만, 쌓은 모양에 따라 맞닿아 가려지는 면의 넓이가 달라져서 겉넓이가 달라요.'),
    't10': ('부피를 빨리 구하려고 곱하는 차례를 바꾸어도 답이 같은 까닭을 써 보세요.',
            '예) 곱셈은 곱하는 차례를 바꾸어도 결과가 같아요. 4 × 7 × 5를 4 × 5 × 7로 계산하면 20 × 7 = 140으로 더 쉬워요.'),
    't11': ('정육면체의 겉넓이가 150 cm²일 때 한 모서리의 길이를 어떻게 구했는지 써 보세요.',
            '예) 정육면체의 여섯 면은 넓이가 같으니 150 ÷ 6 = 25(cm²)가 한 면의 넓이예요. 5 × 5 = 25이므로 한 모서리는 5 cm예요.'),
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
        got = [run_rec(s, lv, r) for r in st_['recs']]
        f = EXTRA.get((L['id'], st_['name']))
        if f:
            got.append(f(s, lv))
        ans.append('%s %s' % (NUM[i], ' / '.join(x for x in got if x)))
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
ST_IDS = ['s1', 's2', 's34', 's56', 's78', 's9', 's10', 's11']   # 앱 u6-volume.st.js LESSONS의 id 차례(1·2·3~4·5~6·7~8·9·10·11차시)
WHY_ST = {   # 도전형 '생각 쓰기'(앱 thenWhy 물음과 겹치지 않게)
    's1': ('교실 새 단장에서 부피가 필요한 일과 겉넓이가 필요한 일을 하나씩 들고, 그 까닭을 써 보세요.',
           '예) 수조에 물이 얼마나 들어가는지 알려면 수조 안 공간의 크기인 부피가, 수납장을 시트지로 감싸려면 겉면의 넓이인 겉넓이가 필요해요.'),
    's2': ('1 cm³처럼 모두가 같은 단위로 부피를 나타내면 좋은 점을 써 보세요.',
           '예) 누가 재어도 같은 수로 나타나서, 서로 다른 상자의 부피도 수만 보고 바로 비교할 수 있어요.'),
    's34': ('가로, 세로, 높이가 각각 2배가 되면 부피가 8배가 되는 까닭을 써 보세요.',
            '예) 가로가 2배이면 부피가 2배, 세로도 2배이면 또 2배, 높이도 2배이면 또 2배가 되어 2 × 2 × 2 = 8(배)가 돼요.'),
    's56': WHY['t56'],
    's78': ('옆면을 하나의 직사각형으로 보았을 때 그 가로가 밑면의 둘레와 같은 까닭을 써 보세요.',
            '예) 옆면 네 개를 이어 붙이면 밑면의 네 변을 한 바퀴 두르게 되어, 가로가 밑면의 둘레(6 + 3 + 6 + 3 = 18 cm)와 같아요.'),
    's9': ('상자 8개를 가로로 1개, 앞뒤로 2개씩 4층으로 쌓은 모양이 비닐을 가장 적게 쓰는 까닭을 써 보세요.',
           '예) 넓은 면(9 cm × 5 cm)끼리 많이 맞닿아 가려지는 넓이가 커지므로 겉넓이가 484 cm²로 가장 작아지기 때문이에요.'),
    's10': WHY['t10'],
    's11': ('겉넓이가 216 cm²인 정육면체의 한 모서리의 길이를 어떻게 구했는지 써 보세요.',
            '예) 정육면체의 여섯 면은 넓이가 같으니 216 ÷ 6 = 36(cm²)이 한 면의 넓이예요. 6 × 6 = 36이므로 한 모서리는 6 cm예요.'),
}


def _st_expect():
    """이야기 버전 문제의 수로 따로 계산한 값(앱 답 중에 꼭 있어야 함)"""
    vol = lambda a, b, c: a * b * c
    surf = lambda a, b, c: 2 * (a * b + b * c + a * c)
    return [9 * 6, 100 * 100, 3 * 10000, 6, 3,                                   # 1차시
            6 // 3,                                                               # 1차시 도전(가·나 높이 6, 3)
            vol(6, 2, 3) // vol(2, 1, 3), vol(2, 4, 4), vol(6, 2, 3),             # 2차시
            vol(3, 2, 3), vol(4, 2, 2), vol(2, 3, 3),
            5 * 3, 2, vol(5, 3, 2), 4 * 4, 3, vol(4, 4, 3),                       # 3~4차시
            2 * 2, 2 * 3, 3 * 2, 3 * 3, 4 * 2, 4 * 3, vol(4, 2, 2), 8,
            vol(7, 3, 4), 4, vol(4, 4, 4), vol(12, 5, 6), 9 ** 3, 48 * 8,
            12000 / (30 * 20), vol(8, 5, 7), 7 ** 3, 60 * 5, vol(8, 6, 10),
            vol(300, 100, 200), 12, 8 * 6, vol(8, 6, 3), 100, 100 ** 3,          # 5~6차시
            4 * 10 ** 6, 15000000 / 10 ** 6, 0.8 * 10 ** 6, vol(400, 50, 150), vol(400, 50, 150) / 10 ** 6,
            0.5, 1.5, vol(6, 4, 3), 2 ** 3, 7500000 / 10 ** 6, vol(300, 200, 140) / 10 ** 6,
            surf(6, 3, 4), 2 * (6 + 3), 2 * (6 + 3) * 4, 6 * 3 * 2 + 2 * (6 + 3) * 4,   # 7~8차시
            surf(5, 5, 5), surf(4, 2, 5), 10 * 10 * 6, surf(20, 10, 15), surf(25, 10, 10), surf(20, 10, 15) - surf(25, 10, 10),
            84 / 12, 7 * 7 * 6, surf(9, 4, 5),
            9, 5, 2 * 4, 18, 10, vol(9, 5, 8), surf(9, 5, 8), surf(18, 10, 2),   # 9차시
            surf(9, 10, 8), vol(9, 10, 8), surf(9, 10, 6), surf(27, 10, 2), surf(27, 10, 2) - surf(9, 10, 6),
            vol(12, 5, 7),                                                        # 10차시
            vol(4, 3, 2), vol(5, 2, 2), 3 * 10 ** 6, 250000000 / 10 ** 6, 0.5 * 10 ** 6,   # 11차시
            10 * 4, (10 + 4 + 10 + 4) * 3, 10 * 4 * 2 + (10 + 4 + 10 + 4) * 3, vol(8, 3, 5), surf(8, 3, 5),
            vol(5, 5, 3), surf(5, 5, 3), 30 ** 3, vol(40, 25, 30), vol(50, 20, 25),
            216 / 6, 6, 6 ** 3, 10 ** 3, vol(20, 5, 10), 10 * 10 * 6, surf(20, 5, 10)]


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
        CTX['challenge'] = False
        got = [run_rec(s, lv, r) for r in st_['recs']]
        f = EXTRA.get((L['id'], st_['name']))
        if f:
            got.append(f(s, lv))
        ans.append('%s %s' % (NUM[i], ' / '.join(x for x in got if x)))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('challenge'):
            s.step('%s ★ 도전하기' % NUM[n], '앱의 도전 문제')
            show_inst(s, lv, L['challenge']['inst'], [])
            ans.append('%s %s' % (NUM[n], ' / '.join(x for x in (run_rec(s, lv, r) for r in L['challenge']['recs']) if x)))
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
# 기본형은 앱에서 읽은 그대로 두고, 도전형은 같은 칸 이름에 새 상자·새 수·거꾸로 묻기·틀린 곳 찾기를 넣은 기록(HARD_TB·HARD_ST)으로 바꿉니다.
# 답은 아래 vol()·surf()로 계산해 넣고, 상자·전개도 그림은 box_svg()·net_svg()가 새 수에 맞게 그립니다.
import copy  # noqa: E402


def vol(a, b, c):
    return a * b * c


def surf(a, b, c):
    return 2 * (a * b + b * c + a * c)


def rnd(v):
    return round(v, 6)


def S_(t):
    return {'s': t}


def N_(v):
    return {'n': rnd(v) if isinstance(v, float) else v}


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
    return {'figs': [{'svg': g, 'label': lab} for lab, g in pairs], 'text': ''}


def CH(*parts):
    """chain: parts = (제목, [기록…]) 또는 [기록…]"""
    out = []
    for p in parts:
        title, recs = p if isinstance(p, tuple) else (None, p)
        out.append({'title': title, 'recs': recs, 'extra': []})
    return {'t': 'chain', 'parts': out}


def WRITE(*items):
    return {'t': 'write', 'items': [{'q': q, 'tag': tag, 'ans': re.sub(r'^예\) ', '', ans), 'ph': ans} for q, tag, ans in items]}


def TW(q, ans):
    return {'t': 'thenwhy', 'q': q, 'ans': ans, 'help': []}


def RF(q, ans):
    return {'t': 'rule', 'q': q, 'ans': ans, 'help': []}


def PANES(*items, fig=None):
    return {'t': 'panes', 'fig': fig, 'items': [{'t': t, 'ph': ph, 'ex': [ex]} for t, ph, ex in items]}


def SEQ(cards, order):
    return {'t': 'sequence', 'cards': list(cards), 'order': list(order)}


def HFIG(*pairs, mm=None, text=None):
    return {'t': 'hfig', 'figs': list(pairs), 'mm': mm, 'text': text}


def HT(head, rows, col_mm=None, q=None):
    """표: 칸이 N_(값)이면 빈칸으로 두고 답에 적음"""
    return {'t': 'htbl', 'head': head, 'rows': rows, 'col_mm': col_mm, 'q': q}


def w_hfig(s, lv, rec):
    if rec.get('text'):
        s.text(rec['text'])
    figs = rec['figs']
    if len(figs) == 1:
        pic(s, figs[0][1], rec.get('mm') or fig_mm(figs[0][1], 0.28))
    else:
        side(s, figs, rec.get('mm'))
    return ''


def w_htbl(s, lv, rec):
    if rec.get('q'):
        s.ask(rec['q'], blank=False)
    rows, ans = [list(rec['head'])], []
    for r in rec['rows']:
        row = []
        for c in r:
            if isinstance(c, dict) and 'n' in c:
                row.append('')
                ans.append(fmt(c['n']))
            elif isinstance(c, dict) and 'a' in c:     # 쓰는 칸(예시 답)
                row.append('')
                ans.append(c['a'])
            else:
                row.append(str(c))
        rows.append(row)
    s.table(rows, col_mm=rec.get('col_mm'))
    return '표: ' + ', '.join(ans)


WIDGETS['hfig'] = w_hfig
WIDGETS['htbl'] = w_htbl


def EX(a):
    """표의 쓰는 칸(정해진 답이 없을 때 예시)"""
    return {'a': a}


# ---------------------------------------------------------------- 새 그림: 상자(겨냥도)·전개도·직사각형
def box_svg(a, b, c, la=None, lb=None, lc=None, div=None, W=250, Hmax=190, col=('#FFE9C4', '#FFF4DF', '#F4D49E')):
    """가로 a, 세로(깊이) b, 높이 c인 직육면체 겨냥도(보이지 않는 모서리는 점선). div=(가로, 세로, 높이 칸 수)면 면에 칸 선."""
    f = 0.5
    ox_u, oy_u = b * f * 0.866, -b * f * 0.5
    s_ = min((W - 120) / (a + ox_u), Hmax / (c - oy_u))
    L, T = 62, 18 + (-oy_u) * s_
    x0, y0 = L, T + c * s_
    ox, oy = ox_u * s_, oy_u * s_
    A, B_, C, D = (x0, y0), (x0 + a * s_, y0), (x0 + a * s_, y0 - c * s_), (x0, y0 - c * s_)
    sh = lambda p: (p[0] + ox, p[1] + oy)
    pts = lambda ps: ' '.join('%s,%s' % (fmt(round(x, 2)), fmt(round(y, 2))) for x, y in ps)
    out = ['<polygon points="%s" fill="%s" stroke="none"/>' % (pts([A, B_, C, D]), col[0]),
           '<polygon points="%s" fill="%s" stroke="none"/>' % (pts([D, C, sh(C), sh(D)]), col[1]),
           '<polygon points="%s" fill="%s" stroke="none"/>' % (pts([B_, sh(B_), sh(C), C]), col[2])]
    if div:
        nx, ny, nz = div
        g = '#B07A2A'
        for i in range(1, nx):
            x = x0 + a * s_ * i / nx
            out.append(_ln((x, y0), (x, y0 - c * s_), g, 1.2))
            out.append(_ln((x, y0 - c * s_), (x + ox, y0 - c * s_ + oy), g, 1.2))
        for k in range(1, nz):
            y = y0 - c * s_ * k / nz
            out.append(_ln((x0, y), (x0 + a * s_, y), g, 1.2))
            out.append(_ln((x0 + a * s_, y), (x0 + a * s_ + ox, y + oy), g, 1.2))
        for j in range(1, ny):
            dx, dy = ox * j / ny, oy * j / ny
            out.append(_ln((x0 + dx, y0 - c * s_ + dy), (x0 + a * s_ + dx, y0 - c * s_ + dy), g, 1.2))
            out.append(_ln((x0 + a * s_ + dx, y0 + dy), (x0 + a * s_ + dx, y0 - c * s_ + dy), g, 1.2))
    for p, q in [(A, B_), (B_, C), (C, D), (D, A), (D, sh(D)), (C, sh(C)), (B_, sh(B_)), (sh(D), sh(C)), (sh(C), sh(B_))]:
        out.append(_ln(p, q, INK, 2.2))
    for p, q in [(sh(A), sh(B_)), (sh(A), sh(D)), (A, sh(A))]:
        out.append(_ln(p, q, GRAY, 1.6, '6 5'))
    if la:
        out.append(_t((A[0] + B_[0]) / 2, y0 + 17, la, 15, BLUE))
    if lc:
        out.append(_t(x0 - 8, (A[1] + D[1]) / 2, lc, 15, BLUE, 'end'))
    if lb:
        out.append(_t(B_[0] + ox / 2 + 8, y0 + oy / 2 + 8, lb, 15, BLUE, 'start'))
    return _svg(W, y0 + 32, ''.join(out))


def cm3(a, b, c, unit='cm', **kw):
    return box_svg(a, b, c, '%s %s' % (fmt(a), unit), '%s %s' % (fmt(b), unit), '%s %s' % (fmt(c), unit), **kw)


def cubes(a, b, c, **kw):
    """쌓기나무로 만든 직육면체(칸 선)"""
    return box_svg(a, b, c, div=(a, b, c), col=('#CFE6FF', '#E6F2FF', '#A9CDF2'), **kw)


def net_svg(d, unit='cm', k=None):
    """직육면체의 전개도(앱과 같은 놓임), 화면에 맞춘 크기"""
    a, b, c = d
    k = k or 520 / (2 * a + 2 * b)
    L, T, Rm, B = 70, 30, 14, 34
    W, H = (2 * a + 2 * b) * k + L + Rm, (2 * b + c) * k + T + B
    faces = [(0, b, b, c), (b, b, a, c), (b + a, b, b, c), (2 * b + a, b, a, c), (b, 0, a, b), (b, b + c, a, b)]
    out = []
    for x, y, w, h in faces:
        out.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="2.5"/>'
                   % (fmt(round(L + x * k, 2)), fmt(round(T + y * k, 2)), fmt(round(w * k, 2)), fmt(round(h * k, 2)), INK))
    lab = lambda x, y, t, anc='middle': out.append(_t(x, y, t, 17, BLUE, anc))
    lab(L + (b + a / 2) * k, T - 13, '%s %s' % (fmt(a), unit))
    lab(L + b * k - 8, T + b / 2 * k, '%s %s' % (fmt(b), unit), 'end')
    lab(L - 8, T + (b + c / 2) * k, '%s %s' % (fmt(c), unit), 'end')
    return _svg(W, H, ''.join(out))


def rect_svg(w, h, lw, lh):
    k = 200 / max(w, h)
    L, T = 20, 16
    out = ['<rect x="%s" y="%s" width="%s" height="%s" fill="#FFE9C4" stroke="%s" stroke-width="2.5"/>' % (L, T, fmt(round(w * k, 2)), fmt(round(h * k, 2)), INK)]
    if lw:
        out.append(_t(L + w * k / 2, T + h * k + 18, lw, 16, BLUE))
    if lh:
        out.append(_t(L + w * k + 8, T + h * k / 2, lh, 16, BLUE, 'start'))
    return _svg(w * k + L + 70, h * k + T + 34, ''.join(out))


def check_hard(D):
    """도전형 기록의 식 칸(… = 답)을 다시 계산해 맞춤"""
    n = 0
    for L in D['lessons']:
        for st_ in L['steps']:
            for prev, v, q in all_nums(st_['recs']):
                m = EXPR.search(prev)
                if m and m.group(1).count('(') == m.group(1).count(')'):
                    e = m.group(1).replace('−', '-').replace('×', '*').replace('÷', '/')
                    x = eval(e, {'__builtins__': {}}, {})
                    assert abs(x - v) < 1e-9, ('도전형 식 계산이 달라요', L['id'], prev, v, x)
                    n += 1
    return n


def harden(D, kind):
    """도전형: 차시마다 칸(step)의 안내 글과 기록을 HARD_*의 새 문제로 바꿈(칸 이름은 그대로)"""
    D = copy.deepcopy(D)
    H = HARD_TB if kind == 'tb' else HARD_ST
    for L in D['lessons']:
        new = H[L['id']]
        assert len(new) == len(L['steps']), ('도전형 칸 수가 앱과 달라요', L['id'], len(new), len(L['steps']))
        for st_, (inst, recs) in zip(L['steps'], new):
            st_['inst'], st_['recs'], st_['hints'] = inst, recs, []
    assert check_hard(D) >= 20
    return D


# ---------------------------------------------------------------- 교과서 버전
VS = ['부피', '겉넓이']
P9 = (12, 4, 3)            # 9차시 상자
PS9 = (9, 6, 2)            # 이야기 9차시 상자


def _stack(B, n):
    return (B[0] * n[0], B[1] * n[1], B[2] * n[2])


HARD_TB = {
    't1': [
        ('‘말’은 열 되가 들어가는 그릇이에요. 되와 말 사이의 관계를 이용하여 물음에 답해 보세요.', [ASK(
            AI('쌀 3말 4되를 되로만 잰다면?', '되로 ', N_(3 * 10 + 4), '번 부어야 해요.'),
            AI('되로 쌀을 57번 부었어요. 몇 말 몇 되인가요?', N_(57 // 10), '말 ', N_(57 % 10), '되예요.'),
            AI('되와 말 중 어느 것의 부피가 더 큰가요?', O_(['말', '되']), '의 부피가 되의 ', N_(10), '배예요.'))]),
        ('자원봉사 센터에서 할 일이에요. 부피와 겉넓이 중 무엇을 알아야 하는지 골라 보세요.', [QUIZ(
            QI('냉동고에 식료품 상자가 몇 개 들어갈지 알아보기', VS, 0),
            QI('상자 겉면에 빈틈없이 색지를 붙이는 데 필요한 색지의 양 알아보기', VS, 1),
            QI('쌀통에 쌀이 얼마나 담기는지 알아보기', VS, 0),
            QI('나무 상자 겉면 전체에 페인트를 칠하는 데 필요한 넓이 알아보기', VS, 1))]),
        ('이 단원에서 배우지 않는 내용을 모두 골라 보세요.', [QUIZ(
            QI('이 단원에서 배우지 않는 것을 모두 골라 보세요.', ['원기둥의 겉넓이 구하기', '1 m³와 1 cm³의 관계', '정육면체의 부피 구하기',
                                                       '쌓기나무로 부피 비교하기', '원의 둘레 구하기', '직육면체의 겉넓이 구하기'], [0, 4]))]),
        ('직사각형의 넓이와 넓이의 단위를 거꾸로 생각해 보세요.', [ASK(
            AI('넓이가 63 cm²이고 가로가 9 cm인 직사각형의 세로는 몇 cm인가요?', '63 ÷ 9 = ', N_(7), ' (cm)', fig=FIG(('', rect_svg(9, 7, '9 cm', '? cm')))),
            AI(None, '4 m² = ', N_(40000), ' cm²이고, 25000 cm² = ', N_(2.5), ' m²예요.'))]),
        ('직육면체의 전개도를 보고 답해 보세요.', [ASK(
            AI('가로 6 cm, 세로 4 cm, 높이 2 cm인 직육면체의 전개도예요.', '넓이가 24 cm²인 면은 ', N_(2), '개, 8 cm²인 면은 ', N_(2), '개예요.', BR,
               '한 꼭짓점에서 만나는 면은 ', N_(3), '개이고, 모서리는 모두 ', N_(12), '개예요.', fig=FIG(('', net_svg((6, 4, 2)))))),
        ]),
    ],
    't2': [
        ('두 상자 가(쌓기나무 가로 3개, 세로 6개, 높이 2개)와 나(가로 4개, 세로 3개, 높이 3개)를 맞대어 본다고 생각해 보세요.', [ASK(
            AI(None, '두 상자에서 길이가 같은 것은 쌓기나무 ', N_(3), '개 길이 하나뿐이에요. 그래서 맞대어서는 부피를 비교하기 ', O_(['어려워요', '쉬워요']), '.',
               fig=FIG(('가', cubes(3, 6, 2, W=220)), ('나', cubes(4, 3, 3, W=220)))))]),
        ('세 사람이 서로 다른 방법으로 상자를 채웠어요. 그림을 보고 세어 보세요.', [CH(
            ('① 민재: 가를 지우개(쌓기나무 가로 1개, 세로 3개, 높이 2개 크기)로 채웠어요.', [ASK(
                AI(None, '지우개 한 개는 쌓기나무 ', N_(1 * 3 * 2), '개 크기이므로 가는 지우개 ', N_(vol(3, 6, 2) // 6), '개로 채워져요.'))]),
            ('② 수빈: 가와 나를 모두 쌓기나무로 채웠어요.', [ASK(
                AI(None, '가는 한 층에 ', N_(18), '개씩 ', N_(2), '층이라 ', N_(36), '개, 나는 한 층에 ', N_(12), '개씩 ', N_(3), '층이라 ', N_(36), '개예요.'))]))]),
        ('민재는 “가는 지우개 6개라 나(쌓기나무 36개)보다 작아.”라고 말했어요. 이 말을 따져 보세요.', [ASK(
            AI('민재의 말은 맞나요?', O_(['틀려요', '맞아요']), ' ― 지우개 한 개는 쌓기나무 한 개보다 ', O_(['커서', '작아서']), ' 개수만으로 비교할 수 없어요.'),
            AI('같은 쌓기나무로 센 수로 비교해 보세요.', '36 ', O_(['=', '>', '<']), ' 36이므로 가와 나의 부피는 ', O_(['같아요', '달라요']), '.'))]),
        ('부피의 단위를 쓰고 읽어 보세요.', [BLK(
            '1 cm³인 쌓기나무 48개로 만든 직육면체의 부피는 ', N_(48), ' ', O_(['cm³', 'cm²', 'cm']), '이고, ', O_(['48 세제곱센티미터', '48 제곱센티미터']),
            '라고 읽어요. 1 cm³는 한 모서리의 길이가 1 cm인 ', O_(['정육면체', '정사각형']), '의 부피예요.')]),
        ('쌓기나무 수로 부피를 거꾸로 생각해 보세요.', [ASK(
            AI('1 cm³ 쌓기나무를 한 층에 가로 5개, 세로 3개씩 놓고 4층으로 쌓았어요. 부피는?', N_(vol(5, 3, 4)), ' cm³'),
            AI('1 cm³ 쌓기나무 64개로 정육면체를 만들면 한 모서리에 쌓기나무가 몇 개 놓일까요?', N_(4), '개'),
            AI('부피가 27 cm³인 정육면체를 만드는 데 쌓기나무가 한 층에 몇 개 필요할까요?', N_(9), '개'))]),
    ],
    't34': [
        ('두 상자에 1 cm³ 쌓기나무를 채운 그림이에요. 한 층의 수와 층수로 세어 보세요.', [ASK(
            AI('첫째 상자', '한 층에 ', N_(15), '개씩 ', N_(4), '층 → 부피 ', N_(60), ' cm³', fig=FIG(('', cubes(5, 3, 4)))),
            AI('둘째 상자', '한 층에 ', N_(9), '개씩 ', N_(5), '층 → 부피 ', N_(45), ' cm³', fig=FIG(('', cubes(3, 3, 5)))))]),
        ('가로 2 cm, 세로 1 cm, 높이 3 cm인 직육면체(6 cm³)의 길이를 바꾸면 부피는 어떻게 될까요? 표를 완성해 보세요.', [HT(
            ['바꾼 것', '가로(cm)', '세로(cm)', '높이(cm)', '부피(cm³)', '처음의 몇 배'],
            [['처음', 2, 1, 3, 6, '1배'], ['가로만 2배', N_(4), 1, 3, N_(12), N_(2)], ['가로와 세로를 2배', N_(4), N_(2), 3, N_(24), N_(4)],
             ['세 길이를 모두 2배', N_(4), N_(2), N_(6), N_(48), N_(8)]], col_mm=[44, 24, 24, 24, 28, 30]),
            ASK(AI('세 길이를 모두 3배로 늘리면 부피는 처음의 몇 배일까요?', '3 × 3 × 3 = ', N_(27), '(배)'))]),
        ('가로, 세로, 높이와 부피 사이의 관계를 거꾸로도 생각해 보세요.', [BLK(
            '가로를 3배, 높이를 2배로 늘리면 부피는 ', O_(['6배', '5배', '9배']), '가 돼요. 가로를 2배로 늘리고 세로를 반으로 줄이면 부피는 ', O_(['그대로예요', '2배가 돼요', '반이 돼요']), '.')]),
        ('가로 9 cm, 세로 5 cm, 높이 4 cm인 직육면체의 부피를 두 가지로 구해 보세요.', [ASK(
            AI(None, '가로, 세로, 높이로: 9 × 5 × 4 = ', N_(180), ' (cm³)', fig=FIG(('', cm3(9, 5, 4)))),
            AI(None, '한 밑면의 넓이 ', N_(45), ' cm²에 높이를 곱하면: 45 × 4 = ', N_(180), ' (cm³)')),
            BLK('(직육면체의 부피) = (한 밑면의 넓이) × (', O_(['높이', '둘레', '가로']), ')')]),
        ('정육면체의 부피를 구하고, 거꾸로 한 모서리의 길이를 찾아보세요.', [ASK(
            AI('한 모서리의 길이가 11 cm인 정육면체', '11 × 11 × 11 = ', N_(11 ** 3), ' (cm³)'),
            AI('부피가 1000 cm³인 정육면체의 한 모서리의 길이', N_(10), ' cm (10 × 10 × 10 = 1000)'),
            AI('부피가 343 cm³인 정육면체의 한 면의 넓이', N_(49), ' cm²'))]),
        ('직육면체의 부피를 구하거나, 모르는 길이를 구해 보세요.', [ASK(
            AI(None, '13 × 4 × 5 = ', N_(260), ' (cm³)', fig=FIG(('', cm3(13, 4, 5)))),
            AI('한 밑면의 넓이가 56 cm²이고 높이가 9 cm인 직육면체의 부피', '56 × 9 = ', N_(504), ' (cm³)'),
            AI('부피가 420 cm³, 가로 7 cm, 세로 6 cm인 직육면체의 높이', '420 ÷ (7 × 6) = ', N_(10), ' (cm)'))]),
        ('친구가 만든 문제를 살펴보고, 내 문제를 만들어 보세요.', [ASK(
            AI('수아의 문제: “가로가 12 cm, 높이가 5 cm인 직육면체 모양 상자의 부피는 몇 cm³인가요?” 이 문제를 풀 수 있나요?',
               O_(['풀 수 없어요', '풀 수 있어요']), ' ― ', O_(['세로', '둘레']), '가 없기 때문이에요.'),
            AI('수아가 세로 8 cm를 더했어요. 부피는?', '12 × 8 × 5 = ', N_(480), ' (cm³)')),
            WRITE(('주변의 직육면체 모양 물건으로, 부피를 구하려면 곱셈을 꼭 해야 하는 문제를 만들고 답도 써 보세요.', '내 문제와 답',
                   '예) 가로 25 cm, 세로 15 cm, 높이 10 cm인 신발 상자의 부피는 몇 cm³인가요? → 25 × 15 × 10 = 3750(cm³)'))]),
    ],
    't56': [
        ('트럭에 싣는 직육면체 모양 냉동 컨테이너는 가로 600 cm, 세로 250 cm, 높이 260 cm예요. 부피를 구하고 단위를 생각해 보세요.', [ASK(
            AI(None, '600 × 250 × 260 = ', N_(vol(600, 250, 260)), ' (cm³)', fig=FIG(('', cm3(600, 250, 260)))),
            AI('m 단위로 바꾸면?', '가로 ', N_(6), ' m, 세로 ', N_(2.5), ' m, 높이 ', N_(2.6), ' m예요.'))]),
        ('1 m³를 거꾸로 생각해 보세요.', [BLK(
            '1 m³는 한 모서리의 길이가 ', N_(100), ' cm인 정육면체의 부피예요. 5 m³는 ', O_(['5 세제곱미터', '5 제곱미터', '5 세제곱센티미터']),
            '라고 읽고, 부피가 ', O_(['m³', 'm²', 'cm²']), '인 단위예요.')]),
        ('1 m 막대로 1 m³ 정육면체 틀을 만들어 강당(가로 20 m, 세로 12 m, 높이 6 m)의 부피를 어림해 보세요.', [ASK(
            AI('1 m 막대 36개로 1 m³ 정육면체 틀을 몇 개 만들 수 있을까요?', '36 ÷ 12 = ', N_(3), '(개)'),
            AI('강당 바닥에 틀을 한 층 깔면 몇 개일까요?', '20 × 12 = ', N_(240), '(개)'),
            AI('강당을 가득 채우면?', '240 × 6 = ', N_(1440), '(개) → 강당의 부피는 약 ', N_(1440), ' m³'))]),
        ('1 m³와 1 cm³의 관계를 이용해 보세요. “1 m는 100 cm야.”', [ASK(
            AI('한 모서리가 2 m인 정육면체 안에 1 cm³ 쌓기나무는 몇 개 들어갈까요?', '200 × 200 × 200 = ', N_(8000000), '(개)'),
            AI('그 정육면체의 부피는 몇 m³인가요?', '2 × 2 × 2 = ', N_(8), ' (m³)'),
            AI('0.1 m³는 몇 cm³인가요?', N_(100000), ' cm³'))]),
        ('□ 안에 알맞은 수를 써넣고, 부피가 같은 것끼리 이어 보세요.', [ASK(
            AI(None, '4.2 m³ = ', N_(4200000), ' cm³ · 820000 cm³ = ', N_(0.82), ' m³ · 63000000 cm³ = ', N_(63), ' m³'),
            AI('부피가 같은 것끼리 이어 보세요.', '0.25 m³ — ', O_(['250000 cm³', '2500000 cm³', '25000000 cm³'], 0), ' · 25 m³ — ',
               O_(['250000 cm³', '2500000 cm³', '25000000 cm³'], 2), ' · 2.5 m³ — ', O_(['250000 cm³', '2500000 cm³', '25000000 cm³'], 1)))]),
        ('직육면체의 부피는 몇 m³인지 구해 보세요.', [ASK(
            AI(None, '5 × 4 × 3 = ', N_(60), ' (m³)', fig=FIG(('', cm3(5, 4, 3, unit='m')))),
            AI('가로 250 cm, 세로 120 cm, 높이 80 cm인 직육면체', '방법 1: 250 × 120 × 80 = ', N_(2400000), ' (cm³) = ', N_(2.4), ' m³', BR,
               '방법 2: 2.5 × ', N_(1.2), ' × 0.8 = ', N_(2.4), ' (m³)'))]),
    ],
    't78': [
        ('가로 7 cm, 세로 4 cm, 높이 3 cm인 직육면체 상자와 그 전개도를 살펴보세요.', [HFIG(('', cm3(7, 4, 3, W=230)), ('', net_svg((7, 4, 3)))),
            ASK(AI(None, '넓이가 같은 면은 ', N_(2), '개씩 ', N_(3), '쌍이에요.'),
                AI('겉넓이를 구할 때 필요 없는 것은 무엇인가요?', O_(['상자의 부피', '각 면의 넓이', '가로, 세로, 높이']))),
            ]),
        ('여섯 면의 넓이를 표에 쓰고 모두 더해 보세요.', [HT(
            ['면', '윗면', '아랫면', '앞면', '뒷면', '오른쪽 옆면', '왼쪽 옆면', '합'],
            [['넓이(cm²)', N_(28), N_(28), N_(21), N_(21), N_(12), N_(12), N_(surf(7, 4, 3))]], col_mm=[26, 20, 20, 20, 20, 26, 26, 22])]),
        ('평행한 두 면의 넓이가 같다는 것을 이용해 보세요. 그리고 친구의 계산을 살펴보세요.', [ASK(
            AI(None, '(28 + 21 + 12) × 2 = ', N_(122), ' (cm²)'),
            AI('규리는 (28 + 21 + 12) × 6으로 구했어요. 바르게 고치면?', '평행한 두 면이 ', O_(['2개씩', '6개씩']), ' 있으므로 × ', N_(2), '를 해야 해요.'))]),
        ('옆면 네 개를 하나의 직사각형으로 보고 구해 보세요.', [ASK(
            AI(None, '옆면의 가로는 7 + 4 + 7 + 4 = ', N_(22), ' (cm), 세로는 ', N_(3), ' cm이니까 옆면의 넓이는 ', N_(66), ' cm²예요.'),
            AI(None, '두 밑면과 옆면: 28 × 2 + 66 = ', N_(122), ' (cm²)'),
            AI('옆면의 가로는 무엇과 같나요?', O_(['밑면의 둘레', '밑면의 넓이', '높이'])))]),
        ('겉넓이를 구하는 방법을 정리하고, 알맞은 방법을 골라 보세요.', [BLK(
            '(직육면체의 겉넓이) = (서로 다른 세 면의 넓이의 합) × ', O_(['2', '3', '6']), ' = (한 밑면의 넓이) × 2 + (밑면의 ', O_(['둘레', '넓이']), ') × (높이)'),
            QUIZ(QI('한 모서리의 길이만 알고 있는 정육면체의 겉넓이를 구할 때 가장 편리한 방법은?', ['한 면의 넓이에 6을 곱해요.', '옆면을 하나로 보고 구해요.', '여섯 면을 하나씩 그려요.']))]),
        ('직육면체의 겉넓이를 구하고, 두 상자를 비교해 보세요.', [ASK(
            AI(None, '(54 + 24 + 36) × 2 = ', N_(surf(9, 6, 4)), ' (m²)', fig=FIG(('', cm3(9, 6, 4, unit='m')))),
            AI('가(가로 20 cm, 세로 10 cm, 높이 8 cm)와 나(가로 15 cm, 세로 12 cm, 높이 9 cm) 중 겉넓이가 더 넓은 것은?',
               '가: ', N_(surf(20, 10, 8)), ' cm², 나: ', N_(surf(15, 12, 9)), ' cm² → ', O_(['가', '나']), '가 ', N_(surf(20, 10, 8) - surf(15, 12, 9)), ' cm² 더 넓어요.'))]),
        ('정육면체의 겉넓이를 구하고, 거꾸로 한 모서리의 길이도 구해 보세요.', [ASK(
            AI('한 모서리 9 cm', '81 × 6 = ', N_(486), ' (cm²)'),
            AI('한 모서리 11 m', N_(121 * 6), ' m²'),
            AI('겉넓이가 54 m²인 정육면체', '한 면의 넓이는 54 ÷ 6 = ', N_(9), ' (m²)이므로 한 모서리의 길이는 ', N_(3), ' m예요.'))]),
        ('친구가 만든 겉넓이 문제의 풀이에서 잘못된 곳을 찾고, 내 문제를 만들어 보세요.', [ASK(
            AI('도윤: “가로 6 cm, 세로 5 cm, 높이 2 cm인 휴지 상자의 겉넓이는 6 × 5 × 2 = 60(cm²)이에요.” 바르게 고치면?',
               '도윤이는 ', O_(['부피', '겉넓이']), '를 구했어요. 겉넓이는 (30 + 10 + 12) × 2 = ', N_(surf(6, 5, 2)), ' (cm²)예요.')),
            WRITE(('주변의 직육면체 모양 물건으로 겉넓이를 구하는 문제를 만들고, 두 가지 방법으로 답을 확인해 보세요.', '내 문제와 답',
                   '예) 가로 20 cm, 세로 10 cm, 높이 5 cm인 과자 상자의 겉넓이는? (200 + 50 + 100) × 2 = 700, 200 × 2 + 60 × 5 = 700(cm²)'))]),
    ],
    't9': [
        ('기사에서 생활 폐기물 중 포장 폐기물이 차지하는 비율은 35%라고 했어요. 물음에 답해 보세요.', [ASK(
            AI('생활 폐기물 200 kg 중 포장 폐기물은 약 몇 kg일까요?', N_(70), ' kg'),
            AI('포장 폐기물이 아닌 것은 몇 %일까요?', N_(65), '%')),
            QUIZ(QI('포장 폐기물을 늘리는 일은 무엇인가요?', ['작은 물건마다 큰 상자에 따로 담기', '물건을 모아 겉넓이가 작게 쌓아 포장하기', '포장재를 다시 쓰기']))]),
        ('상자 한 개는 가로 12 cm, 세로 4 cm, 높이 3 cm예요(겹치는 부분 없이 포장해요). 상자 4개를 한 층에 1개씩 4층으로 쌓았어요.', [ASK(
            AI(None, '쌓은 모양은 가로 ', N_(12), ' cm, 세로 ', N_(4), ' cm, 높이 ', N_(12), ' cm예요.', fig=FIG(('가', box_svg(12, 4, 12, '12 cm', '4 cm', '12 cm', div=(1, 1, 4), W=230)))),
            AI(None, '부피: 12 × 4 × 12 = ', N_(576), ' (cm³), 겉넓이: (48 + 144 + 48) × 2 = ', N_(surf(12, 4, 12)), ' (cm²)'))]),
        ('상자 4개를 앞뒤로 2개씩 2층으로 쌓았어요.', [ASK(
            AI(None, '쌓은 모양은 가로 ', N_(12), ' cm, 세로 ', N_(8), ' cm, 높이 ', N_(6), ' cm예요.', fig=FIG(('나', box_svg(12, 8, 6, '12 cm', '8 cm', '6 cm', div=(1, 2, 2), W=230)))),
            AI(None, '부피: 12 × 8 × 6 = ', N_(576), ' (cm³), 겉넓이: (96 + 48 + 72) × 2 = ', N_(surf(12, 8, 6)), ' (cm²)'))]),
        ('가와 나를 견주어 보세요.', [ASK(
            AI(None, '부피는 ', O_(['같고', '다르고']), ', 겉넓이는 ', O_(['나', '가']), '가 ', N_(surf(12, 4, 12) - surf(12, 8, 6)), ' cm² 더 좁아요.'),
            AI('나가 포장지를 덜 쓰는 까닭은?', O_(['넓은 면(12 cm × 4 cm)끼리 더 많이 맞닿아 가려지기 때문이에요.', '부피가 더 작기 때문이에요.'])))]),
        ('상자 8개를 세 가지로 쌓았어요. 쌓은 모양의 크기와 겉넓이를 구해 표를 완성하고, 포장지가 가장 적게 드는 것을 골라 보세요.', [HT(
            ['', '가로로', '앞뒤로', '위로', '쌓은 모양(가로 × 세로 × 높이)', '겉넓이(cm²)'],
            [['㉠', '2개', '2개', '2층', EX('24 cm × 8 cm × 6 cm'), N_(surf(*_stack(P9, (2, 2, 2))))],
             ['㉡', '1개', '2개', '4층', EX('12 cm × 8 cm × 12 cm'), N_(surf(*_stack(P9, (1, 2, 4))))],
             ['㉢', '1개', '4개', '2층', EX('12 cm × 16 cm × 6 cm'), N_(surf(*_stack(P9, (1, 4, 2))))]], col_mm=[12, 22, 22, 22, 62, 32]),
            QUIZ(QI('포장지가 가장 적게 드는 것은?', ['㉡', '㉠', '㉢']))]),
        ('포장지를 적게 쓰는 방법을 정리해 보세요.', [WRITE(
            ('상자 8개를 쌓는 모양 가운데 겉넓이가 가장 작은 것이 다른 것보다 정육면체에 가까운지 살펴보고, 알게 된 점을 써 보세요.', '알게 된 점',
             '예) ㉡은 12 cm × 8 cm × 12 cm로 세 길이가 비슷해 정육면체에 가까워요. 쌓은 모양이 정육면체에 가까울수록 겉넓이가 작아 포장지를 덜 써요.'))]),
    ],
    't10': [
        ('놀이 규칙(1부터 20까지의 자연수, 단위 cm, 3분 동안 한 사람이 3장까지)을 생각하며 답해 보세요.', [ASK(
            AI('붙임쪽지에 쓸 수 있는 직육면체 중 부피가 가장 작은 것은 몇 cm³일까요?', N_(1), ' cm³'),
            AI('한 모둠 12명이 3장씩 붙이면 쪽지는 모두 몇 장일까요?', N_(36), '장'),
            AI('3분은 몇 초인가요?', N_(180), '초')),
            QUIZ(QI('규칙에 맞지 않는 쪽지를 모두 골라 보세요.', ['가로 25 cm · 세로 3 cm · 높이 4 cm', '가로 2.5 cm · 세로 6 cm · 높이 8 cm', '가로 20 cm · 세로 1 cm · 높이 20 cm', '가로 7 cm · 세로 0 cm · 높이 5 cm'], [0, 1, 3]))]),
        ('부피가 240 cm³가 되도록 서로 다른 쪽지 3장을 만들고, 다른 모둠 친구가 구한 부피를 확인해 보세요.', [HT(
            ['쪽지', '가로(cm)', '세로(cm)', '높이(cm)', '부피(cm³)'],
            [['1장', EX('10'), EX('4'), EX('6'), 240], ['2장', EX('12'), EX('5'), EX('4'), 240], ['3장', EX('20'), EX('3'), EX('4'), 240]], col_mm=[20, 32, 32, 32, 34]),
            HT(['가로', '세로', '높이', '친구가 구한 부피', '○ / ×', '바른 부피'],
               [['16 cm', '5 cm', '3 cm', '240 cm³', EX('○'), EX('240 cm³')], ['11 cm', '7 cm', '4 cm', '298 cm³', EX('×'), N_(vol(11, 7, 4))],
                ['18 cm', '2 cm', '9 cm', '324 cm³', EX('○'), EX('324 cm³')]], col_mm=[22, 22, 22, 40, 22, 40])]),
        ('찾은 쪽지의 부피를 구하고, 지워진 길이도 찾아보세요.', [HT(
            ['쪽지 주인', '가로', '세로', '높이', '부피(cm³)'],
            [['정우진', '13 cm', '6 cm', '5 cm', N_(vol(13, 6, 5))], ['한예린', '20 cm', '15 cm', '4 cm', N_(vol(20, 15, 4))], ['오시우', '17 cm', '3 cm', '8 cm', N_(vol(17, 3, 8))]],
            col_mm=[34, 26, 26, 26, 40]),
            ASK(AI('윤채원의 쪽지: 가로 9 cm, 높이 5 cm, 부피 450 cm³ (세로가 지워졌어요)', '세로 = 450 ÷ (9 × 5) = ', N_(10), ' (cm)'))]),
        ('종이 뒤집기 놀이예요. 뒤집은 종이 3장을 보고 가져올 수 있는지 판단하고, 가져올 수 있으면 부피를 구해 보세요.', [HT(
            ['뒤집은 종이 3장', '가져와요 / 다시 놓아요', '부피(cm³)'],
            [['세로 9 cm · 가로 6 cm · 높이 7 cm', EX('가져와요'), N_(vol(6, 9, 7))], ['높이 5 cm · 가로 8 cm · 높이 2 cm', EX('다시 놓아요(세로 없음)'), EX('-')],
             ['가로 14 cm · 높이 3 cm · 세로 5 cm', EX('가져와요'), N_(vol(14, 5, 3))], ['세로 11 cm · 세로 4 cm · 가로 6 cm', EX('다시 놓아요(높이 없음)'), EX('-')]],
            col_mm=[80, 56, 44]),
            ASK(AI('가져온 두 장 묶음의 부피의 합은?', N_(vol(6, 9, 7) + vol(14, 5, 3)), ' cm³'))]),
        ('놀이를 돌아보며 생각을 써 보세요.', [WRITE(
            ('부피를 빨리 구하려고 곱하는 차례를 바꾼 예를 하나 들어 써 보세요.', '빨리 구하는 방법', '예) 13 × 6 × 5는 6 × 5 = 30을 먼저 곱해 13 × 30 = 390(cm³)으로 쉽게 구했어요.'))]),
    ],
    't11': [
        ('부피가 1 cm³인 쌓기나무로 만든 직육면체 가와 나의 부피를 비교해 보세요.', [ASK(
            AI(None, '가의 부피는 ', N_(24), ' cm³, 나의 부피는 ', N_(vol(2, 2, 7)), ' cm³이므로 ', O_(['나', '가']), '의 부피가 ', N_(4), ' cm³ 더 커요.',
               fig=FIG(('가', cubes(4, 2, 3, W=200)), ('나', cubes(2, 2, 7, W=200)))))]),
        ('□ 안에 알맞은 수를 써넣으세요.', [ASK(
            AI(None, '6.5 m³ = ', N_(6500000), ' cm³ · 48000000 cm³ = ', N_(48), ' m³ · 0.3 m³ = ', N_(300000), ' cm³'))]),
        ('직육면체와 정육면체의 부피와 겉넓이를 구해 보세요.', [ASK(
            AI(None, '부피 ', N_(vol(11, 4, 6)), ' cm³, 겉넓이 ', N_(surf(11, 4, 6)), ' cm²', fig=FIG(('', cm3(11, 4, 6)))),
            AI('한 모서리의 길이가 13 cm인 정육면체', '부피 ', N_(13 ** 3), ' cm³, 겉넓이 ', N_(169 * 6), ' cm²'))]),
        ('가로 7 cm, 세로 5 cm, 높이 4 cm인 상자의 포장지 넓이를 친구가 이렇게 구했어요. “한 밑면의 넓이는 35 cm², 옆면의 넓이는 (7 + 5) × 4 = 48(cm²)이므로 35 × 2 + 48 = 118(cm²)입니다.” 잘못된 곳을 찾아 고쳐 보세요.', [ASK(
            AI(None, '옆면의 가로는 밑면의 ', O_(['둘레', '가로와 세로의 합']), '이므로 (7 + 5 + 7 + 5) × 4 = ', N_(96), ' (cm²)예요. 바른 넓이는 35 × 2 + 96 = ', N_(166), ' (cm²)예요.',
               fig=FIG(('', cm3(7, 5, 4)))))]),
        ('한 변의 길이가 6 m인 정사각형을 밑면으로 하고, 높이가 9 m인 직육면체의 부피와 겉넓이를 구해 보세요.', [CH(
            [ASK(AI('이해해요 ― 알고 있는 것은 무엇인가요?', '가로 ', N_(6), ' m, 세로 ', N_(6), ' m, 높이 ', N_(9), ' m'))],
            [QUIZ(QI('계획해요 ― 옆면을 하나로 보면 옆면의 넓이는 어떻게 구할까요?', ['(밑면의 둘레) × (높이)', '(밑면의 넓이) × 4', '(가로) × (높이)']))],
            [ASK(AI('해결해요', '부피: 6 × 6 × 9 = ', N_(324), ' (m³) · 겉넓이: 36 × 2 + 24 × 9 = ', N_(288), ' (m²)', fig=FIG(('', cm3(6, 6, 9, unit='m')))))],
            [WRITE(('되돌아봐요 ― 서로 다른 세 면의 넓이로도 겉넓이를 구해 확인해 보세요.', '되돌아봐요', '예) (36 + 54 + 54) × 2 = 288(m²)로 같아요.'))])]),
        ('한 모서리가 50 cm인 정육면체 모양 상자보다 부피가 더 큰 상자를 찾고 있어요. 상자 가는 가로 60 cm, 세로 40 cm, 높이 50 cm, 상자 나는 가로 0.8 m, 세로 40 cm, 높이 40 cm예요.', [ASK(
            AI(None, '정육면체 상자 ', N_(125000), ' cm³, 가 ', N_(vol(60, 40, 50)), ' cm³, 나 ', N_(vol(80, 40, 40)), ' cm³ → 더 큰 것은 ', O_(['나', '가']), ' 상자예요.'))]),
        ('빈칸에 알맞은 말이나 수를 써넣어 정리해 보세요.', [BLK(
            '1 m³는 1 cm³의 ', O_(['1000000배', '10000배', '100배']), '예요. 직육면체의 부피는 (한 밑면의 넓이) × (', O_(['높이', '둘레']),
            ')이고, 겉넓이는 (한 밑면의 넓이) × 2 + (밑면의 둘레) × (', O_(['높이', '세로']), ')예요. 정육면체의 겉넓이를 6으로 나누면 ', O_(['한 면의 넓이', '한 모서리의 길이']), '가 나와요.')]),
    ],
}


# ---------------------------------------------------------------- 이야기 버전
HARD_ST = {
    's1': [
        ('교실 뒤편에 들일 물건이에요. 그림을 보고 떠오르는 것을 세 칸에 써 보세요.', [HFIG(
            ('어항', cm3(40, 25, 30, W=210)), ('책꽂이 상자', cm3(60, 20, 35, W=210)), ('사물함 한 칸', cm3(30, 30, 40, W=210))),
            PANES(('보여요', '', '세 물건 모두 직육면체 모양이고, 사물함 한 칸은 가로와 세로가 같아요.'),
                  ('생각해요', '', '어항은 가장 길지는 않지만 물이 꽤 많이 들어갈 것 같아요.'),
                  ('궁금해요', '', '세 물건 중 안쪽 공간이 가장 큰 것은 무엇일까?'))]),
        ('친구들이 궁금해하는 것이에요. 부피와 겉넓이 중 무엇을 알아야 할까요?', [QUIZ(
            QI('윤슬: “어항 겉면에 물고기 그림 시트지를 빈틈없이 붙이려면?”', VS, 1),
            QI('도경: “책꽂이 상자에 책이 얼마나 들어갈까?”', VS, 0),
            QI('나래: “사물함 한 칸을 상자로 가득 채우면 상자가 몇 개 들어갈까?”', VS, 0),
            QI('시온: “상자 겉면 전체에 물감을 칠하려면 얼마나 칠해야 할까?”', VS, 1)),
            TW('같은 상자라도 부피와 겉넓이를 쓰는 때가 다른 까닭을 써 볼까요?', '부피는 상자 안에 들어가는 공간의 크기를 알 때 쓰고, 겉넓이는 상자 겉면을 덮거나 칠할 때 써요. 알고 싶은 것이 다르기 때문이에요.')]),
        ('넓이를 거꾸로 생각해 보세요.', [ASK(
            AI('넓이가 72 cm²이고 세로가 8 cm인 직사각형 이름표의 가로는 몇 cm인가요?', '72 ÷ 8 = ', N_(9), ' (cm)', fig=FIG(('', rect_svg(9, 8, '? cm', '8 cm')))),
            AI(None, '2.5 m² = ', N_(25000), ' cm²이고, 40000 cm² = ', N_(4), ' m²예요.'))]),
        ('가로 8 cm, 세로 3 cm, 높이 5 cm인 수납 상자의 전개도예요. 물음에 답해 보세요.', [ASK(
            AI(None, '넓이가 40 cm²인 면은 ', N_(2), '개이고, 넓이가 가장 작은 면의 넓이는 ', N_(15), ' cm²예요. 넓이가 24 cm²인 면과 평행한 면의 넓이는 ', N_(24), ' cm²예요.',
               fig=FIG(('', net_svg((8, 3, 5))))))]),
        ('배울 내용을 차례대로 놓고, 새 단장 계획을 세워 보세요.', [CH(
            ('배울 내용을 배우는 차례대로 기호를 써 보세요.', [SEQ(['직육면체의 겉넓이 구하기', '1 cm³로 부피 나타내기', '1 m³와 1 cm³의 관계 알기', '(가로) × (세로) × (높이)로 부피 구하기'], [1, 3, 2, 0])]),
            [WRITE(('새 단장에서 부피를 구해 보고 싶은 물건 하나와 겉넓이를 구해 보고 싶은 물건 하나를 골라, 그 까닭을 써 보세요.', '부피·겉넓이 계획',
                    '예) 어항의 부피를 구해 물이 얼마나 들어가는지 알고, 사물함 한 칸의 겉넓이를 구해 시트지가 얼마나 필요한지 알고 싶어요.'))])]),
    ],
    's2': [
        ('두 수납 상자 가(쌓기나무 가로 5개, 세로 2개, 높이 4개)와 나(가로 7개, 세로 2개, 높이 3개)를 맞대어 본다고 생각해 보세요.', [ASK(
            AI(None, '두 상자는 세로가 ', N_(2), '개로 같지만, 가로는 ', O_(['나', '가']), '가 더 길고 높이는 ', O_(['가', '나']), '가 더 높아요. 그래서 맞대어서는 비교하기 어려워요.',
               fig=FIG(('가', cubes(5, 2, 4, W=220)), ('나', cubes(7, 2, 3, W=220)))))]),
        ('상자 안을 채운 것을 보고 세어 보세요.', [CH(
            ('① 하린: 가를 지우개(쌓기나무 가로 5개, 세로 1개, 높이 2개 크기)로 채웠어요.', [ASK(
                AI(None, '지우개 한 개는 쌓기나무 ', N_(10), '개 크기이므로 가는 지우개 ', N_(4), '개예요.'))]),
            ('② 태민: 가와 나를 모두 쌓기나무로 채웠어요.', [ASK(
                AI(None, '가는 ', N_(vol(5, 2, 4)), '개, 나는 ', N_(vol(7, 2, 3)), '개예요.'))]))]),
        ('하린이는 “가는 지우개 4개, 나는 쌓기나무 42개니까 나가 10배 넘게 커!”라고 말했어요.', [ASK(
            AI('하린이의 말을 고쳐 보세요.', '같은 쌓기나무로 세면 40 ', O_(['<', '>', '=']), ' 42이므로 ', O_(['나', '가']), '가 쌓기나무 ', N_(2), '개만큼 더 커요.')),
            TW('나가 가보다 10배 넘게 크다고 하면 왜 안 되는지 써 볼까요?', '지우개 한 개는 쌓기나무 10개 크기라서 4와 42를 그대로 견주면 안 돼요. 같은 쌓기나무로 세면 40개와 42개라 나가 조금만 더 커요.')]),
        ('부피의 단위를 쓰고 읽어 보세요.', [BLK(
            '1 cm³ 쌓기나무 42개로 만든 상자 나의 부피는 ', N_(42), ' ', O_(['cm³', 'cm²', 'cm']), '이고, ', O_(['42 세제곱센티미터', '42 제곱센티미터']),
            '라고 읽어요. 1 cm³는 한 모서리의 길이가 ', O_(['1 cm', '1 m']), '인 정육면체의 부피예요.')]),
        ('1 cm³로 부피를 거꾸로 생각해 보세요.', [ASK(
            AI('1 cm³ 쌓기나무 125개로 정육면체를 만들면 한 모서리에 몇 개가 놓일까요?', N_(5), '개'),
            AI('부피가 60 cm³인 직육면체를 쌓기나무로 한 층에 12개씩 쌓으면 몇 층일까요?', '60 ÷ 12 = ', N_(5), '(층)')),
            QUIZ(QI('부피가 1 cm³보다 훨씬 큰 것을 모두 골라 보세요.', ['어항', '공깃돌', '책꽂이 상자', '작은 주사위'], [0, 2]))]),
    ],
    's34': [
        ('두 받침 상자 모형에 1 cm³ 쌓기나무를 채운 그림이에요. 부피를 구해 보세요.', [ASK(
            AI('받침 상자 가', '한 층에 ', N_(12), '개씩 ', N_(3), '층 → ', N_(36), ' cm³', fig=FIG(('', cubes(6, 2, 3)))),
            AI('받침 상자 나', '한 층에 ', N_(10), '개씩 ', N_(4), '층 → ', N_(40), ' cm³', fig=FIG(('', cubes(5, 2, 4)))))]),
        ('가로 3 cm, 세로 2 cm, 높이 1 cm인 직육면체(6 cm³)를 늘리면 부피가 어떻게 될까요?', [
            RF('높이를 4배로 늘리면, 가로와 세로를 모두 3배로 늘리면 부피가 각각 몇 배가 될지 예상해 써요.', '높이를 4배 하면 부피도 4배, 가로와 세로를 3배씩 하면 3 × 3 = 9(배)가 돼요.'),
            HT(['바꾼 것', '가로(cm)', '세로(cm)', '높이(cm)', '부피(cm³)'],
               [['처음', 3, 2, 1, 6], ['높이를 4배', 3, 2, N_(4), N_(24)], ['가로와 세로를 3배', N_(9), N_(6), 1, N_(54)]], col_mm=[50, 28, 28, 28, 30])]),
        ('태민이가 정한 받침 상자는 가로 8 cm, 세로 6 cm, 높이 5 cm예요. 하나하나 세지 않고 부피를 구해 보세요.', [ASK(
            AI(None, '한 층에 8 × 6 = ', N_(48), '(개)씩 ', N_(5), '층이므로 부피는 ', N_(240), ' cm³예요.', fig=FIG(('', cm3(8, 6, 5))))),
            BLK('(직육면체의 부피) = (한 ', O_(['밑면의 넓이', '모서리의 길이']), ') × (높이)'),
            TW('높이가 1 cm 늘어날 때마다 부피가 48 cm³씩 늘어나는 까닭을 써 볼까요?', '높이가 1 cm 늘면 한 층(8 × 6 = 48개)이 더 쌓이기 때문이에요.')]),
        ('정육면체 모양 통의 부피를 구하고, 거꾸로 한 모서리의 길이도 구해 보세요.', [ASK(
            AI('한 모서리 12 cm인 통', '12 × 12 × 12 = ', N_(1728), ' (cm³)'),
            AI('부피가 512 cm³인 정육면체 통의 한 모서리', N_(8), ' cm'))]),
        ('새 단장에 쓸 물건의 부피나 모르는 길이를 구해 보세요.', [ASK(
            AI('어항', '40 × 25 × 30 = ', N_(vol(40, 25, 30)), ' (cm³)', fig=FIG(('', cm3(40, 25, 30)))),
            AI('한 밑면의 넓이가 35 cm²이고 높이가 12 cm인 크레파스 상자', '35 × 12 = ', N_(420), ' (cm³)'),
            AI('부피가 630 cm³, 가로 9 cm, 높이 7 cm인 블록 상자의 세로', '630 ÷ (9 × 7) = ', N_(10), ' (cm)'))]),
        ('친구가 만든 문제를 풀고, 조건을 하나 더한 내 문제를 만들어 보세요.', [ASK(
            AI('지안: “가로 16 cm, 세로 9 cm, 높이 6 cm인 연필 상자의 부피는?”', '16 × 9 × 6 = ', N_(864), ' (cm³)')),
            WRITE(('부피와 길이 두 개를 알려 주고 나머지 길이를 구하는 문제를 만들고 답도 써 보세요.', '내 문제와 답',
                   '예) 부피가 600 cm³, 가로 10 cm, 세로 6 cm인 휴지 상자의 높이는? → 600 ÷ 60 = 10(cm)'))]),
    ],
    's56': [
        ('서아: “교실에 들일 교구장은 가로 250 cm, 세로 80 cm, 높이 150 cm래.” 교구장의 부피를 구해 보세요.', [ASK(
            AI(None, '250 × 80 × 150 = ', N_(vol(250, 80, 150)), ' (cm³)', fig=FIG(('', cm3(250, 80, 150)))),
            AI('m 단위로 바꾸면?', '가로 ', N_(2.5), ' m, 세로 ', N_(0.8), ' m, 높이 ', N_(1.5), ' m예요.'))]),
        ('1 m 막대로 정육면체 틀을 만들어 과학실(가로 10 m, 세로 7 m, 높이 3 m)을 채운다고 생각해 보세요.', [CH(
            [ASK(AI('1 m 막대 60개로 정육면체 틀을 몇 개 만들 수 있을까요?', '60 ÷ 12 = ', N_(5), '(개)'))],
            [ASK(AI(None, '한 층에 ', N_(70), '개씩 ', N_(3), '층이니까, 과학실에는 정육면체 틀이 약 ', N_(210), '개 들어가요.'))])]),
        ('준혁: “한 모서리가 3 m인 정육면체에는 1 cm³ 쌓기나무가 몇 개 들어갈까?”', [
            RF('한 모서리가 3 m인 정육면체에 1 cm³ 쌓기나무가 몇 개 들어갈지 예상해 써요.', '3 m = 300 cm라서 300 × 300 × 300 = 27000000(개)가 들어가요. 27 m³ = 27000000 cm³예요.'),
            ASK(AI(None, '한 모서리에 ', N_(300), '개, 한 층에 300 × 300 = ', N_(90000), '(개), 모두 ', N_(27000000), '개예요.'))]),
        ('1 m³와 1 cm³의 관계를 거꾸로 정리해 보세요.', [BLK(
            '1000000 cm³ = ', O_(['1 m³', '1 m²', '100 m³']), '이고, 과학실의 부피는 약 ', O_(['210 m³', '210 cm³', '210 m²']), '예요. 1 cm³는 1 m³의 ', O_(['1000000분의 1', '100분의 1']), '이에요.')]),
        ('새 단장 물건들의 부피를 단위를 바꾸어 써 보세요.', [ASK(
            AI(None, '6.2 m³ = ', N_(6200000), ' cm³ · 34000000 cm³ = ', N_(34), ' m³ · 450000 cm³ = ', N_(0.45), ' m³'))]),
        ('교실 뒤 게시판 아래 수납장은 가로 500 cm, 세로 40 cm, 높이 120 cm예요. 두 가지 방법으로 m³로 구해 보세요.', [ASK(
            AI('방법 1', '500 × 40 × 120 = ', N_(2400000), ' (cm³) = ', N_(2.4), ' m³'),
            AI('방법 2', '5 × ', N_(0.4), ' × ', N_(1.2), ' = ', N_(2.4), ' (m³)')),
            TW('2.4 m³와 240000 cm³ 중 어느 것이 맞는지, 실수하기 쉬운 까닭과 함께 써 볼까요?', '1 m³ = 1000000 cm³이므로 2400000 cm³ = 2.4 m³예요. 1 m² = 10000 cm²처럼 0을 네 개만 생각하면 실수하기 쉬워요.')]),
    ],
    's78': [
        ('지안: “사물함 모형(가로 5 cm, 세로 4 cm, 높이 6 cm)을 시트지로 감싸 보자.” 전개도의 여섯 면의 넓이를 표에 쓰고 더해 보세요.', [HFIG(('', net_svg((5, 4, 6))), mm=120),
            HT(['면', '윗면', '아랫면', '앞면', '뒷면', '오른쪽 옆면', '왼쪽 옆면', '합'],
               [['넓이(cm²)', N_(20), N_(20), N_(30), N_(30), N_(24), N_(24), N_(surf(5, 4, 6))]], col_mm=[26, 20, 20, 20, 20, 26, 26, 22])]),
        ('평행한 두 면을 이용하여 구하고, 친구의 계산도 살펴보세요.', [ASK(
            AI(None, '(20 + 30 + 24) × 2 = ', N_(148), ' (cm²)'),
            AI('윤슬이는 20 + 30 + 24 = 74(cm²)로 끝냈어요. 무엇을 빠뜨렸나요?', O_(['× 2', '× 6']), '를 빠뜨렸어요.')),
            TW('세 면의 넓이를 더한 뒤 2를 곱하는 까닭을 써 볼까요?', '서로 평행한 두 면은 넓이가 같아서, 서로 다른 세 면이 두 번씩 있기 때문이에요.')]),
        ('옆면 네 개를 하나의 직사각형으로 보고 구해 보세요.', [ASK(
            AI(None, '옆면의 가로는 (5 + 4) × 2 = ', N_(18), ' (cm), 옆면의 넓이는 18 × 6 = ', N_(108), ' (cm²)'),
            AI(None, '두 밑면과 옆면: 20 × 2 + 108 = ', N_(148), ' (cm²)'),
            AI('옆면을 하나로 보는 방법이 편리한 때는?', O_(['밑면의 둘레와 높이를 쉽게 알 때', '밑면이 정사각형이 아닐 때만', '높이를 모를 때'])))]),
        ('겉넓이를 구하는 방법을 정리하고, 정육면체의 겉넓이를 거꾸로 생각해 보세요.', [BLK(
            '(직육면체의 겉넓이) = (한 꼭짓점에서 만나는 세 면의 넓이의 합) × ', O_(['2', '3', '6']), ' = (한 밑면의 넓이) × 2 + (밑면의 ', O_(['둘레', '넓이']), ') × (높이)'),
            ASK(AI('겉넓이가 96 cm²인 정육면체 화분 받침의 한 모서리의 길이', '96 ÷ 6 = ', N_(16), ' (cm²)이므로 한 모서리는 ', N_(4), ' cm예요.'))]),
        ('새 단장 물건의 겉넓이를 구해 보세요. 계산기를 써도 돼요.', [ASK(
            AI('가로 6 m, 세로 3 m, 높이 4 m인 학교 창고', '(18 + 12 + 24) × 2 = ', N_(108), ' (m²)', fig=FIG(('', cm3(6, 3, 4, unit='m')))),
            AI('두 수납 상자 가(가로 30 cm, 세로 20 cm, 높이 10 cm)와 나(한 모서리 18 cm인 정육면체) 중 시트지가 더 많이 드는 것은?',
               '가: ', N_(surf(30, 20, 10)), ' cm², 나: ', N_(18 * 18 * 6), ' cm² → ', O_(['가', '나']), '가 ', N_(surf(30, 20, 10) - 18 * 18 * 6), ' cm² 더 필요해요.'))]),
        ('친구의 겉넓이 풀이를 살펴보고, 내 문제를 만들어 보세요.', [ASK(
            AI('도경: “가로 9 cm, 세로 4 cm, 높이 3 cm인 필통의 겉넓이는 (36 + 12 + 27) × 2 = 140(cm²)이에요.” 맞나요?',
               O_(['틀려요', '맞아요']), ' ― 바른 겉넓이는 ', N_(surf(9, 4, 3)), ' cm²예요.')),
            WRITE(('교실 물건으로 겉넓이 문제를 만들고, 두 가지 방법으로 답을 확인해 보세요.', '내 문제와 답',
                   '예) 가로 12 cm, 세로 6 cm, 높이 4 cm인 분필 상자의 겉넓이는? (72 + 24 + 48) × 2 = 288, 72 × 2 + 36 × 4 = 288(cm²)'))]),
    ],
    's9': [
        ('상자 한 개는 가로 9 cm, 세로 6 cm, 높이 2 cm예요. 상자 4개를 두 가지로 쌓은 그림을 보고 쌓은 모양의 크기를 써 보세요.', [CH(
            ('① 가 — 한 층에 1개씩 4층', [ASK(AI(None, '가로 ', N_(9), ' cm, 세로 ', N_(6), ' cm, 높이 ', N_(8), ' cm',
                                             fig=FIG(('', box_svg(9, 6, 8, '9 cm', '6 cm', '8 cm', div=(1, 1, 4), W=220)))))]),
            ('② 나 — 가로로 2개, 앞뒤로 2개씩 1층', [ASK(AI(None, '가로 ', N_(18), ' cm, 세로 ', N_(12), ' cm, 높이 ', N_(2), ' cm',
                                                     fig=FIG(('', box_svg(18, 12, 2, '18 cm', '12 cm', '2 cm', div=(2, 2, 1), W=240)))))]))]),
        ('가와 나의 부피와 겉넓이를 견주어 보세요. 계산기를 써도 돼요.', [ASK(
            AI(None, '부피: 가 ', N_(432), ' cm³, 나 ', N_(432), ' cm³', BR, '겉넓이: 가 (54 + 48 + 72) × 2 = ', N_(surf(9, 6, 8)), ' cm², 나 (216 + 24 + 36) × 2 = ', N_(surf(18, 12, 2)), ' cm²'),
            AI(None, '비닐은 ', O_(['가', '나']), '가 ', N_(surf(18, 12, 2) - surf(9, 6, 8)), ' cm² 덜 들어요.')),
            TW('나처럼 넓게 펼쳐 놓으면 겉넓이가 커지는 까닭을 써 볼까요?', '상자끼리 맞닿는 면이 좁은 옆면뿐이라 가려지는 넓이가 작아서, 바깥으로 드러나는 면이 많아지기 때문이에요.')]),
        ('상자 8개를 가로로 2개, 앞뒤로 2개씩 2층으로 쌓았더니 겉넓이가 672 cm²였어요. 더 작게 쌓을 수 있을까요?', [
            RF('상자 8개를 어떻게 쌓으면 겉넓이가 더 작아질지 예상해 써요.', '가로로 1개, 앞뒤로 2개씩 4층으로 쌓으면 9 cm × 12 cm × 8 cm가 되어 세 길이가 비슷해지고 겉넓이가 552 cm²로 작아져요.'),
            HT(['', '가로로', '앞뒤로', '위로', '쌓은 모양(가로 × 세로 × 높이)', '겉넓이(cm²)'],
               [['㉠', '2개', '2개', '2층', '18 cm × 12 cm × 4 cm', 672],
                ['㉡', '1개', '2개', '4층', EX('9 cm × 12 cm × 8 cm'), N_(surf(*_stack(PS9, (1, 2, 4))))],
                ['㉢', '1개', '1개', '8층', EX('9 cm × 6 cm × 16 cm'), N_(surf(*_stack(PS9, (1, 1, 8))))]], col_mm=[12, 22, 22, 22, 62, 32])]),
        ('상자를 쌓아 감싸며 알게 된 점을 정리해 보세요.', [BLK(
            '같은 상자 8개를 쌓으면 모양이 달라도 부피는 ', N_(864), ' cm³로 ', O_(['같아요', '달라요']), '. 겉넓이는 쌓은 모양이 ', O_(['정육면체', '길쭉한 모양']), '에 가까울수록 작아져요.')]),
        ('쓰레기를 줄이는 보관 방법을 써 보세요.', [WRITE(
            ('상자 12개를 보관할 때 비닐을 아끼려면 어떻게 쌓을지 계획을 써 보세요.', '보관 계획', '예) 넓은 면끼리 맞닿게 앞뒤로 2개씩, 위로 여러 층 쌓아서 쌓은 모양이 정육면체에 가깝게 만들어요.'),
            ('포장을 아예 줄이는 방법도 써 보세요.', '포장 줄이기', '예) 상자를 비닐로 감싸지 않고 뚜껑 있는 정리함에 넣어 두면 비닐을 쓰지 않아도 돼요.'))]),
    ],
    's10': [
        ('놀이 차례를 바르게 늘어놓아 보세요.', [SEQ(
            ['찾은 쪽지의 부피를 구해 빈 곳에 적어요.', '눈을 가린 모둠 몰래 쪽지를 교실 곳곳에 붙여요.', '두 모둠이 역할을 바꾸어 다시 해요.',
             '쪽지 3장에 이름과 가로·세로·높이를 적어요.', '3분 동안 한 사람이 3장까지 찾아요.', '쪽지 주인에게 확인하고 점수를 얻어요.'], [3, 1, 4, 0, 5, 2])]),
        ('부피가 480 cm³가 되는 서로 다른 쪽지 3장을 만들고, 친구가 구한 부피를 확인해 보세요.', [HT(
            ['쪽지', '가로(cm)', '세로(cm)', '높이(cm)', '부피(cm³)'],
            [['1장', EX('10'), EX('6'), EX('8'), 480], ['2장', EX('12'), EX('5'), EX('8'), 480], ['3장', EX('20'), EX('4'), EX('6'), 480]], col_mm=[20, 32, 32, 32, 34]),
            HT(['가로', '세로', '높이', '친구가 구한 부피', '○ / ×', '바른 부피'],
               [['19 cm', '4 cm', '5 cm', '380 cm³', EX('○'), EX('380 cm³')], ['13 cm', '8 cm', '3 cm', '302 cm³', EX('×'), N_(vol(13, 8, 3))],
                ['6 cm', '15 cm', '7 cm', '630 cm³', EX('○'), EX('630 cm³')]], col_mm=[22, 22, 22, 40, 22, 40])]),
        ('찾은 쪽지의 부피를 구하고, 지워진 길이도 찾아보세요.', [HT(
            ['쪽지 주인', '가로', '세로', '높이', '부피(cm³)'],
            [['윤슬', '17 cm', '5 cm', '6 cm', N_(vol(17, 5, 6))], ['도경', '20 cm', '11 cm', '3 cm', N_(vol(20, 11, 3))], ['나래', '9 cm', '9 cm', '14 cm', N_(vol(9, 9, 14))]],
            col_mm=[34, 26, 26, 26, 40]),
            ASK(AI('시온의 쪽지: 세로 8 cm, 높이 6 cm, 부피 528 cm³ (가로가 지워졌어요)', '가로 = 528 ÷ (8 × 6) = ', N_(11), ' (cm)'))]),
        ('놀이 약속을 정하고, 이기는 방법을 생각해 보세요.', [CH(
            [QUIZ(QI('놀이 약속으로 알맞지 않은 것을 모두 골라 보세요.', ['찾은 쪽지를 친구에게 보여 주지 않고 몰래 버려요.', '부피를 구한 뒤 한 번 더 검산해요.',
                                                            '높은 곳이나 위험한 곳에 쪽지를 붙여요.', '쪽지 주인은 친구의 답을 친절하게 확인해 줘요.'], [0, 2]))],
            [WRITE(('부피를 빠르고 정확하게 구하는 우리 모둠만의 방법을 써 보세요.', '우리 모둠의 방법',
                    '예) 곱해서 10이나 100이 되는 두 수를 먼저 곱하고, 다 구한 뒤에는 곱하는 차례를 바꾸어 한 번 더 계산해 확인해요.'))])]),
        ('종이 뒤집기 놀이예요. 뒤집은 종이 3장을 보고 가져올 수 있는지 판단하고, 부피를 구해 보세요.', [HT(
            ['뒤집은 종이 3장', '가져와요 / 다시 놓아요', '부피(cm³)'],
            [['높이 8 cm · 세로 5 cm · 가로 12 cm', EX('가져와요'), N_(vol(12, 5, 8))], ['가로 4 cm · 가로 9 cm · 세로 3 cm', EX('다시 놓아요(높이 없음)'), EX('-')],
             ['세로 7 cm · 높이 6 cm · 가로 15 cm', EX('가져와요'), N_(vol(15, 7, 6))]], col_mm=[80, 56, 44]),
            ASK(AI('가져온 종이로 구한 부피의 합은?', N_(vol(12, 5, 8) + vol(15, 7, 6)), ' cm³'))]),
    ],
    's11': [
        ('서아가 1 cm³ 쌓기나무로 만든 두 직육면체를 보여 주었어요. 부피를 비교해 보세요.', [ASK(
            AI(None, '가 ', N_(vol(3, 3, 3)), ' cm³, 나 ', N_(vol(7, 2, 2)), ' cm³ → ', O_(['나', '가']), '의 부피가 ', N_(1), ' cm³ 더 커요.',
               fig=FIG(('가', cubes(3, 3, 3, W=200)), ('나', cubes(7, 2, 2, W=200)))))]),
        ('하린이의 단위 바꾸기 문제를 풀어 보세요.', [ASK(
            AI(None, '8.5 m³ = ', N_(8500000), ' cm³ · 360000000 cm³ = ', N_(360), ' m³ · 0.06 m³ = ', N_(60000), ' cm³'))]),
        ('지안이가 정리 상자(가로 9 cm, 세로 5 cm, 높이 3 cm)의 시트지 넓이를 이렇게 구했어요. “(45 + 15 + 27) × 3 = 261(cm²)” 잘못된 곳을 찾아 고쳐 보세요.', [ASK(
            AI(None, '서로 다른 세 면의 넓이의 합에 ', N_(2), '를 곱해야 하므로 (45 + 15 + 27) × 2 = ', N_(174), ' (cm²)예요.', fig=FIG(('', cm3(9, 5, 3))))),
            TW('지안이가 왜 3을 곱했을지 생각하고, 바른 방법을 설명해 볼까요?', '세 면을 구했으니 3을 곱한다고 헷갈린 것 같아요. 직육면체에는 같은 면이 두 개씩 있으니 2를 곱해야 해요.')]),
        ('발표회 정리 판을 완성해 보세요.', [BLK(
            '2 m³는 ', O_(['2000000 cm³', '20000 cm³', '200 cm³']), '예요. 직육면체의 부피는 (한 밑면의 넓이) × (', O_(['높이', '둘레']),
            '), 정육면체의 겉넓이는 (한 모서리의 길이) × (한 모서리의 길이) × ', O_(['6', '3', '2']), '예요.')]),
        ('준혁이와 태민이가 낸 발표 문제를 풀어 보세요. 계산기를 써도 돼요.', [CH(
            [ASK(AI('가로 11 cm, 세로 6 cm, 높이 7 cm인 직육면체', '부피 ', N_(vol(11, 6, 7)), ' cm³, 겉넓이 ', N_(surf(11, 6, 7)), ' cm²', fig=FIG(('', cm3(11, 6, 7)))),
                 AI('한 변이 4 m인 정사각형이 밑면이고 높이가 7 m인 직육면체', '부피 ', N_(112), ' m³, 겉넓이: 16 × 2 + 16 × 7 = ', N_(144), ' m²'))],
            [ASK(AI('세 수조 중 부피가 가장 작은 것은? ㉠ 한 모서리 40 cm인 정육면체 ㉡ 가로 0.5 m, 세로 30 cm, 높이 40 cm ㉢ 가로 60 cm, 세로 25 cm, 높이 45 cm',
                    '㉠ ', N_(64000), ' cm³, ㉡ ', N_(vol(50, 30, 40)), ' cm³, ㉢ ', N_(vol(60, 25, 45)), ' cm³ → 가장 작은 것은 ', O_(['㉡', '㉠', '㉢'])))])]),
        ('1차시의 ‘궁금해요’ 칸을 다시 보고, 이 단원에서 알게 된 것으로 답해 보세요.', [{'t': 'wonder'}, WRITE(
            ('1차시에 궁금했던 것 하나를 골라, 지금은 어떻게 답할 수 있는지 계산과 함께 써 보세요.', '궁금했던 것 해결',
             '예) 어항(40 cm × 25 cm × 30 cm)의 안쪽 공간은 40 × 25 × 30 = 30000(cm³)로 구할 수 있어요.'),
            ('교실 새 단장에서 부피와 겉넓이를 모두 쓴 일을 골라 발표 문장을 써 보세요.', '발표 문장',
             '예) 사물함 모형(5 cm × 4 cm × 6 cm)은 부피가 120 cm³이고, 감싸는 데 시트지가 148 cm² 필요했어요.'))]),
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
        check_numbers(D, _st_expect(), 25)
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
    real = ('1차시 직사각형, 2차시 1 cm³ 정육면체의 전개도, 7~8차시 직육면체의 전개도는' if kind == 'tb'
            else '1차시 이름표(직사각형)와 2차시 1 cm³ 정육면체의 전개도는')
    if lv == '도전형':
        real = '2차시 1 cm³ 정육면체의 전개도는'
    s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT_NAME, label, lv), lines,
              note='※ 이 활동지는 앱 u6-volume.html과 차시 번호가 같습니다. '
                   '%s 실제 크기이므로 100%%로 인쇄하세요. 쓰기 칸의 ‘예)’는 예시 답이에요.' % real)
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
