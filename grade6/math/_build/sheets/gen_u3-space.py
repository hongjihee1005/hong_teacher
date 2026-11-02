# -*- coding: utf-8 -*-
"""6-2 수학 3. 공간과 입체 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u3-space.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u3-space.py tb       # 교과서 차시 버전만
    python3 gen_u3-space.py st       # 이야기 버전만

앱 원본 ../units/sem2/u3-space.tb.js('영상 촬영 학교 공간과 입체', 9개 차시 묶음: 1·2·3·4·5·6·7~8·9·10)의
LESSONS를 node에서 가짜 DOM으로 그대로 실행해, 단계마다 넘긴 물음·보기·정답·쌓기나무 배치(SP6_D)·그림(SVG)을 모아(_EX) 그대로 씁니다.
그래서 앱의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·배치·정답이 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.

  - 쌓기나무 투영도, 위·앞·옆에서 본 모양, 층별 모양, 사진·지도는 앱의 그리기 코드(sp6Iso·sp6View·sp6Photo·sp6Map)가 만든 SVG 그대로입니다.
  - 칠하기(sp6Paint)는 앱과 같은 크기의 빈 모눈(위·층별: 아래쪽이 앞 / 앞·옆: 굵은 바닥 선)을, 수 쓰기(sp6Nums)는 쌓기나무가 있는 칸만,
    쌓기(sp6Build)는 판과 같은 크기의 '위에서 본 모양에 수 쓰기' 칸을 넣습니다(종이에서는 쌓기나무로 쌓은 뒤 수로 나타냄).
  - 쌓기 활동의 정답은 node에서 앱의 채점 함수(check·sp6Joined)에 맞는 배치를 모두 찾아 씁니다(개수가 여러 가지면 모두).
  - 위·앞·옆 모양과 층별 개수는 파이썬으로 따로 다시 계산해 assert로 맞춥니다.
  - 이야기 버전(ST)도 같은 방법으로 ../units/sem2/u3-space.st.js('우리 학교 쌓기나무 모형 전시회')의 LESSONS를 읽어 씁니다.
    이야기 엔진의 탐구 도우미(panes 세 칸·thenWhy '왜 그럴까요?'·ruleFirst '먼저 예상해요'·wonderRecall)와 글쓰기 칸의 도움(help)·모범 답(ans)도 그대로 옮깁니다.
    차시 목록 ST는 원본 LESSONS의 차시 번호(그 차시에 도전형 '까닭 쓰기'를 붙일 WHY_ST가 있어야 함)이고, 원본과 어긋나면 멈춥니다.
그림은 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음). node 계산에 1분쯤 걸립니다.
"""

_EX = r'''// 앱 원본(u3-space.tb.js)을 가짜 DOM에서 실행해 차시·단계·물음·보기·정답·쌓기나무 배치·그림(SVG)을 모읍니다.
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
  get parentNode() { return this.parent || new El('div'); }
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
    for (const k of Object.keys(a)) if (k.startsWith('on') || k === 'pointer-events' || k === 'aria-label' || k === 'style') delete a[k];
    const at = Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this._t)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
const document = { createElement: t => new El(t), createElementNS: (n, t) => new El(t), head: { append() {} }, body: new El('body') };
const performance = { now: () => 0 }, requestAnimationFrame = cb => 0, setTimeout = () => 0, window = {};
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const plain = a && !(a instanceof El) && typeof a === 'object' && !Array.isArray(a); const e = new El(t, plain ? a : {}); if (!plain && a != null) e.append(a); e.append(...k); return e; };
function makeSvg(w, hgt) { return svgEl('svg', { viewBox: `0 0 ${w} ${hgt}` }); }
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
function dragOn() {} function svgPt() { return { x: 0, y: 0 }; }
let REC = [];
function quiz(b, a, items, opts) { REC.push({ t: 'quiz', items: items.map(serQ), opts: serOpt(opts) }); }
function blanks(b, a, parts, opts) { REC.push({ t: 'blanks', parts: parts.map(serPart), opts: serOpt(opts) }); }
function writeStep(b, a, items, opts) { REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag, ph: x.ph, help: x.help || null, ans: x.ans || null })) }); }
/* 이야기 버전 엔진의 탐구 도우미(칸 나누기·왜 그럴까요?·먼저 예상해요·궁금해요 다시 보기) */
function panes(b, a, items, opts) { REC.push({ t: 'panes', items: items.map(x => ({ t: x.t, ph: x.ph, hint: x.hint || null, ex: x.ex || [] })) }); }
const _wq = (t, o) => ({ t, q: o.q, ph: o.ph || null, help: o.help || null, ans: o.ans || null });
function thenWhy(f, o) { return (b, a) => { f(b, a); REC.push(_wq('thenWhy', o)); }; }
function ruleFirst(f, o) { return (b, a) => { REC.push(_wq('ruleFirst', o)); f(b, a); }; }
function wonderRecall(f) { return (b, a) => { REC.push({ t: 'wonder' }); f(b, a); }; }
function autoRun() { return () => {}; }
function sequence(b, a, cards, order, opts) { REC.push({ t: 'sequence', cards, order, opts: serOpt(opts) }); }

const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
const lesSrc = src.slice(src.indexOf('//@@LESSONS'));
eval((unitSrc + '\n' + lesSrc).replace(/^(const|let) /gm, 'var '));

function findTag(e, t, out) { out = out || []; if (e && typeof e === 'object') { if (e.tag === t) out.push(e); (e.kids || []).forEach(k => findTag(k, t, out)); } return out; }
/* 그림 묶음 → [{svg, cap}] (figure 안의 figcaption을 이름으로) */
function serFig(v) {
  if (typeof v === 'function') v = v();
  if (!v || typeof v !== 'object') return v == null ? null : { text: String(v) };
  const out = [];
  const walk = e => { if (!e || typeof e !== 'object' || !e.kids) return;
    if (e.tag === 'figure') { const s = findTag(e, 'svg')[0]; if (s) { const c = findTag(e, 'figcaption')[0]; out.push({ svg: String(s), cap: c ? c.textContent : null }); return; } }
    if (e.tag === 'svg') { out.push({ svg: String(e), cap: null }); return; }
    e.kids.forEach(walk); };
  walk(v);
  if (!out.length) return { text: v.textContent };
  return { figs: out };
}
function serPart(p) {
  if (typeof p === 'string') return { s: p };
  if (p instanceof El) return { s: p.textContent };
  if (p.o) return { o: p.o, a: p.a, multi: !!p.multi };
  if ('n' in p) return { n: p.n };
  return { s: '' };
}
function serQ(it) { return { q: it.q || null, fig: it.fig ? serFig(it.fig) : null, o: it.o || null, a: it.a, parts: it.parts ? it.parts.map(serPart) : null }; }
function serOpt(o) {
  if (!o) return {};
  const r = {};
  for (const [k, v] of Object.entries(o)) { if (typeof v === 'function' || k === 'ask' || k === 'items') continue; try { r[k] = JSON.parse(JSON.stringify(v)); } catch (e) { } }
  return r;
}
function askOf(opt) { const ask = typeof opt.ask === 'function' ? opt.ask() : opt.ask; return (ask || []).map(serQ); }
function subRecs(fn) { const save = REC; REC = []; try { fn(); } finally { } const r = REC; REC = save; return r; }
const api = new Proxy({}, { get: () => () => {} });

sp6Ask = function (host, ap, items, opts) { REC.push({ t: 'ask', items: items.map(serQ), opts: serOpt(opts) }); };
sp6Chain = function (body, ap, parts) {
  REC.push({ t: 'chain', parts: parts.map(p => { const bx = new El('div'); const recs = subRecs(() => (p.run || p)(bx, api)); if (findTag(bx, 'svg').length) recs.unshift({ t: 'figs', fig: serFig(bx) }); return { title: p.title || null, recs }; }) });
};
/* 쌓기 활동: 조건에 맞는 배치를 모두 찾아 정답으로 */
function buildSols(opt) {
  const R = opt.R, C = opt.C, M = opt.M || 3, ok = G => sp6Sum(G) > 0 && sp6Joined(G) && !opt.check(G);
  let all;
  if (opt.start && opt.lock) {       // 처음 모양에 1~2개 더 붙이기
    const st = opt.start, base = sp6Sum(st), seen = new Set(); all = [];
    const add = (G, k) => { if (k === 0) { const key = JSON.stringify(G); if (!seen.has(key)) { seen.add(key); if (ok(G)) all.push(sp6Clone(G)); } return; }
      for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) if (G[y][x] < M) { G[y][x]++; add(G, k - 1); G[y][x]--; } };
    for (let k = 1; k <= 2; k++) add(sp6Clone(st), k);
  } else all = sp6All(R, C, M, ok);
  return all;
}
sp6Build = function (body, ap, opt) {
  const sols = buildSols(opt);
  const rec = { t: 'sp6Build', R: opt.R, C: opt.C, M: opt.M || 3, start: opt.start || null, lock: !!opt.lock, show: opt.show ? serFig(opt.show) : null,
    distinct: opt.distinct ? opt.distinct.n : 0, live: opt.live || [], then: !!opt.then, ask: askOf(opt), sols, nsol: sols.length,
    sums: [...new Set(sols.map(sp6Sum))].sort((a, b) => a - b), ok: opt.ok || null };
  if (opt.start) rec.startFig = String(sp6Iso(opt.start, { maxW: '9em' }));
  REC.push(rec);
};
sp6Paint = function (body, ap, opt) {
  REC.push({ t: 'sp6Paint', show: opt.show ? serFig(opt.show) : null, items: opt.items.map(it => ({ title: it.title, kind: it.kind, rows: it.rows, cols: it.cols, ans: it.ans, exact: !!it.exact })),
    ask: askOf(opt), tip: opt.tip || null });
};
sp6Nums = function (body, ap, opt) {
  REC.push({ t: 'sp6Nums', H: opt.H, given: !!opt.given, total: !!opt.total, totalQ: opt.totalQ || null, title: opt.title || null, show: opt.show ? serFig(opt.show) : null, ask: askOf(opt), sum: sp6Sum(opt.H) });
};
sp6Pick = function (body, ap, opt) {
  const rec = { t: 'sp6Pick', show: opt.show ? serFig(opt.show) : null, q: opt.q || null, items: opt.items.map(it => ({ name: it.name, fig: it.fig ? serFig(it.fig) : null })), a: opt.a, ask: askOf(opt) };
  if (opt.then) rec.then = subRecs(() => opt.then(new El('div'), api));
  REC.push(rec);
};
sp6Turn = function (body, ap, opt) {
  const H = opt.H, M = sp6Max(H), dirs = ['위', '앞', '뒤', '왼쪽', '오른쪽'];
  REC.push({ t: 'sp6Turn', H, iso: String(sp6Iso(H, { side: true, maxW: '17em' })), views: dirs.map(d => { const dv = sp6DirView(H, d); return { d, v: dv.v, svg: String(sp6View(dv.kind, dv.v, { rows: M, cell: 28, frontLabel: d === '위' })) }; }), ask: askOf(opt) });
};
sp6Layers = function (body, ap, opt) {
  const H = opt.H, n = sp6Max(H);
  REC.push({ t: 'sp6Layers', H, names: opt.names || null, iso: String(sp6Iso(H, { maxW: '17em' })),
    layers: Array.from({ length: n }, (_, i) => ({ k: i + 1, svg: String(sp6View('layer', sp6Layer(H, i + 1), { frame: true, cell: 26 })), cnt: sp6LayerCount(H, i + 1) })), ask: askOf(opt) });
};
sp6Scene = function (body, ap, opt) {
  REC.push({ t: 'sp6Scene', map: String(sp6Map(opt.objs, opt.marks, { road: opt.road, maxW: '17em' })), marks: opt.marks.map(m => m.t), markWord: opt.markWord || null, askTitle: opt.askTitle || null, ask: askOf(opt) });
};
sp6Guess = function (body, ap, opt) { REC.push({ t: 'sp6Guess', n: opt.n || 5, goal: opt.goal || 10 }); };

function cap(render) { REC = []; const body = new El('div'); try { render(body, api); } catch (e) { REC.push({ t: 'error', err: String(e.stack || e).slice(0, 400) }); } if (findTag(body, 'svg').length) REC.unshift({ t: 'figs', fig: serFig(body) }); return REC; }
const OUT = { story: UNIT_STORY, D: SP6_D, lessons: LESSONS.map(L => ({ id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(s => ({ name: s.name, inst: s.inst, hints: s.hints || [], recs: cap(s.render) })),
  challenge: L.challenge ? { inst: L.challenge.inst, hints: L.challenge.hints || [], recs: cap(L.challenge.render) } : null })) };
OUT.views = Object.fromEntries(Object.entries(SP6_D).filter(([k, v]) => typeof v[0][0] === 'number').map(([k, H]) => [k, Object.assign(sp6Views(H), { sum: sp6Sum(H), lay: sp6Lay(H), hid: sp6Hid(H).length })]));
process.stdout.write(JSON.stringify(OUT));
'''

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade6/math
UNITS = os.path.join(ROOT, '_build', 'units', 'sem2')
SRC_TB = os.path.join(UNITS, 'u3-space.tb.js')
SRC_ST = os.path.join(UNITS, 'u3-space.st.js')
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '3단원_공간과입체_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨'
SUB = '⑴⑵⑶⑷⑸'
WORK = tempfile.mkdtemp(prefix='u3space_')
F = 0.3           # 그림: SVG 1 px = 0.3 mm (쌓기나무 한 개 너비 52 px ≈ 16 mm, 모눈 한 칸 34 px ≈ 10 mm)
ROW_PX = 170 / F  # 한 줄에 놓을 수 있는 그림 너비
ST = ['1', '2', '3', '4', '5', '6', '7~8', '9', '10']   # 이야기 버전 차시(원본 u3-space.st.js의 LESSONS 차시 번호와 같아야 함)
MODE = {'v': 'tb'}   # 지금 만드는 버전(tb|st) — 그림 이름·종이용 말 바꾸기·까닭 쓰기가 버전마다 다름

INK, BLUE, GREEN, GRAY, LINE = '#1D2A2A', '#2B7BD6', '#2E8B57', '#8795A1', '#5A6B73'


def fmt(v):
    v = round(float(v), 2)
    return str(int(v)) if v.is_integer() else ('%g' % v)


# ================================================================ 앱 읽기(node)
def load(src, ver='tb'):
    js = os.path.join(WORK, 'ex.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(_EX)
    r = subprocess.run(['node', js, src, FONT], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-3000:])
    d = json.loads(r.stdout)

    def walk(recs):
        for rec in recs:
            assert rec['t'] != 'error', rec
            if rec['t'] == 'chain':
                for p in rec['parts']:
                    walk(p['recs'])
            if isinstance(rec.get('then'), list):
                walk(rec['then'])
            if rec['t'] == 'sp6Build':
                assert rec['nsol'] >= 1, ('쌓기 활동의 답이 없어요', rec.get('ok'))
    for L in d['lessons']:
        for st in L['steps'] + ([L['challenge']] if L['challenge'] else []):
            walk(st['recs'])
    (verify if ver == 'tb' else verify_st)(d)
    return d


# ---------------------------------------------------------------- 앱과 따로 계산해 맞추기
def views(H):
    R, C = len(H), len(H[0])
    top = [[1 if v else 0 for v in r] for r in H]
    front = [max(H[y][x] for y in range(R)) for x in range(C)]
    side = [max(H[y]) for y in range(R - 1, -1, -1)]
    return top, front, side


def layers(H):
    return [sum(1 for r in H for v in r if v >= k) for k in range(1, 5)]


def verify(d):
    for k, V in d['views'].items():
        H = d['D'][k]
        top, front, side = views(H)
        assert (top, front, side) == (V['top'], V['front'], V['side']), k
        assert sum(map(sum, H)) == V['sum'] and layers(H) == V['lay'], k
    D = d['D']
    # 지도서의 답(앱 주석)과 맞는지
    assert layers(D['l1A'])[:3] == [5, 1, 1] and layers(D['l1B'])[:3] == [4, 2, 1]
    assert sum(map(sum, D['power'])) == 7 and d['views']['power']['hid'] == 1
    assert sum(map(sum, D['l3a4L'])) == 8 and sum(map(sum, D['l3a4R'])) == 10
    assert sum(map(sum, D['dice'])) == 6 and sum(map(sum, D['plant'])) == 7
    assert [sum(map(sum, D[k])) for k in ('l5b', 'l5c', 'l5d', 'l5a3')] == [8, 11, 11, 10]
    assert layers(D['hotel'])[:3] == [5, 4, 3] and layers(D['l6a2'])[:3] == [6, 5, 4]
    assert sum(map(sum, D['t2'])) == 9 and sum(map(sum, D['t3'])) == 8 and sum(map(sum, D['k1'])) == 9


def verify_st(d):
    """이야기 버전: 앱 주석에 적힌 개수·층별 개수·숨은 쌓기나무와 맞는지"""
    for k, V in d['views'].items():
        H = d['D'][k]
        top, front, side = views(H)
        assert (top, front, side) == (V['top'], V['front'], V['side']), k
        assert sum(map(sum, H)) == V['sum'] and layers(H) == V['lay'], k
    D, Vw = d['D'], d['views']
    n = lambda k: sum(map(sum, D[k]))
    assert layers(D['l1A'])[:3] == [6, 2, 1] and layers(D['l1B'])[:3] == [5, 3, 1]
    assert n('main') == 8 and Vw['main']['hid'] == 1 and layers(D['main'])[:2] == [6, 2]
    assert n('l3a4L') == 9 and Vw['l3a4L']['hid'] == 0 and layers(D['l3a4L'])[:3] == [5, 3, 1]
    assert n('l3a4R') == 11 and Vw['l3a4R']['hid'] == 1 and layers(D['l3a4R'])[:3] == [6, 3, 2]
    assert n('l3ch') == 10 and Vw['l3ch']['hid'] == 1 and layers(D['l3ch'])[:3] == [7, 2, 1]
    assert [n(k) for k in ('lib', 'l5b', 'l5c', 'l5d', 'l5a3', 'art')] == [9, 8, 10, 12, 11, 8]
    assert layers(D['annex'])[:3] == [6, 4, 2] and layers(D['l6a2'])[:3] == [7, 4, 2]
    assert n('ga') == 4 and n('na') == 5 and [sum(map(sum, H)) for H in D['gaC']] == [5, 5, 5]
    assert [sum(map(sum, H)) for H in D['naC']] == [6, 7, 7, 7]
    assert n('t2a') == 10 and Vw['t2a']['hid'] == 1 and layers(D['t2a'])[:3] == [6, 3, 1]
    assert n('t2b') == 9 and layers(D['t2b'])[:3] == [6, 2, 1] and n('t3') == 9 and Vw['t3']['hid'] == 0
    assert layers(D['t5'])[1:3] == [3, 1] and D['k2'][0][2] == 2 and layers(D['k3'])[1] == 4


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
    return [float(m.group(i)) for i in range(1, 5)]


def _t(x, y, t, size=15, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" dominant-baseline="middle" font-family="%s" fill="%s" font-weight="%s">%s</text>'
            % (fmt(x), fmt(y), size, anchor, FONT.replace("'", '&apos;'), fill, weight, t))


def _rect(x, y, w, h, fill='none', stroke=INK, sw=1.5, dash=None):
    return ('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>'
            % (fmt(x), fmt(y), fmt(w), fmt(h), fill, stroke, sw, ' stroke-dasharray="%s"' % dash if dash else ''))


def cap_w(cap):
    return (len(cap) * 15.5 + 6) if cap else 0


def compose(figs, gap=26):
    """[(svg, 이름)] → 한 장의 SVG(한 줄에 넘치면 다음 줄로), 너비 mm. 이름이 그림보다 넓으면 칸을 넓힘"""
    items = []
    for svg, cap in figs:
        x0, y0, w, h = vb(svg)
        k = min(1.0, (320 if abs(w - h) < 1 else 230) / w)   # 사진·지도처럼 큰 그림은 줄여서(정사각형 지도는 덜 줄임)
        items.append((svg, cap, w * k, h * k, max(w * k, cap_w(cap))))
    rows, cur, cw = [], [], 0
    for it in items:
        if cur and cw + gap + it[4] > ROW_PX:
            rows.append(cur)
            cur, cw = [], 0
        cw += (gap if cur else 0) + it[4]
        cur.append(it)
    rows.append(cur)
    body, y, W = [], 0, 0
    for row in rows:
        x = 0
        hmax = max(it[3] for it in row)
        capH = 24 if any(it[1] for it in row) else 0
        for svg, cap, ww, hh, slot in row:
            fx = x + (slot - ww) / 2
            inner = re.sub(r'^<svg ', '<svg x="%s" y="%s" width="%s" height="%s" ' % (fmt(fx), fmt(y + hmax - hh), fmt(ww), fmt(hh)), svg, count=1)
            body.append(inner)
            if cap:
                body.append(_t(x + slot / 2, y + hmax + 14, cap, 15))
            x += slot + gap
        W = max(W, x - gap)
        y += hmax + capH + 14
    H = y - 14
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 %s %s">%s</svg>' % (fmt(W + 8), fmt(H + 8), ''.join(body))
    return svg, (W + 8) * F


def put_figs(s, figs):
    if not figs:
        return
    svg, mm = compose(figs)
    s.picture(SHOT.png(svg, min(2600, max(900, mm * 10))), width_mm=min(175, mm))


def put_fig(s, fig):
    if not fig:
        return
    if fig.get('figs'):
        put_figs(s, [(f['svg'], f['cap']) for f in fig['figs']])
    elif fig.get('text', '').strip():
        s.text(fig['text'])


# ---------------------------------------------------------------- 빈 모눈(종이에서 그리기·쓰기)
CELL = 34


def grid_svg(rows, cols, kind, nums=None, gray=None, only=None):
    """kind: top|layer(아래쪽이 앞, '앞'·'뒤' 글) · up(앞·옆에서 본 모양, 굵은 바닥 선) · nums(수 쓰는 칸)
       nums: 칸에 미리 쓴 수, gray: 흐리게 미리 쓴 수, only: 이 칸만 그림(수 쓰기)"""
    c, pad = CELL, 4
    top_lab = 18 if kind in ('top', 'layer', 'build') else 0
    W, Hh = cols * c + pad * 2, rows * c + pad * 2 + top_lab * 2 + (6 if kind == 'up' else 0)
    b = []
    for r in range(rows):
        for q in range(cols):
            if only is not None and not only[r][q]:
                continue
            x, y = pad + q * c, pad + top_lab + r * c
            b.append(_rect(x, y, c, c, '#FFFFFF', '#7F8C93', 1.4))
            if nums is not None and nums[r][q]:
                b.append(_t(x + c / 2, y + c / 2 + 1, str(nums[r][q]), 19, INK))
            if gray is not None and gray[r][q]:
                b.append(_t(x + c / 2, y + c / 2 + 1, str(gray[r][q]), 17, '#B5BDC2'))
    if kind == 'up':
        yy = pad + rows * c + 3
        b.append('<line x1="0" x2="%s" y1="%s" y2="%s" stroke="%s" stroke-width="3"/>' % (fmt(W), fmt(yy), fmt(yy), LINE))
    if top_lab:
        if kind == 'build':
            b.append(_t(W / 2, 11, '뒤', 13, GRAY))
        b.append(_t(W / 2, Hh - 9, '앞', 13, BLUE))
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s">%s</svg>' % (fmt(W), fmt(Hh), ''.join(b))


# ---------------------------------------------------------------- 정답 글
def mat_txt(m):
    return ' / '.join(''.join('■' if v else '□' for v in r) for r in m)


def trim(m, keep_bottom=False):
    R, C = len(m), len(m[0])
    rs = [r for r in range(R) if any(m[r])]
    cs = [q for q in range(C) if any(m[r][q] for r in range(R))]
    if not rs:
        return []
    r1 = R - 1 if keep_bottom else rs[-1]
    return [[m[r][q] for q in range(cs[0], cs[-1] + 1)] for r in range(rs[0], r1 + 1)]


def num_txt(H, do_trim=False):
    M = trim(H) if do_trim else H
    return '[' + ' / '.join(' '.join(str(v) if v else '-' for v in r) for r in M) + ']'


def heights(ans):
    return [sum(1 for r in ans if r[q]) for q in range(len(ans[0]))]


def paint_ans(it):
    a = it['ans']
    if it['kind'] == 'up':
        hs = [v for v in heights(a) if v]
        return '%s: 왼쪽부터 %s층' % (it['title'], ', '.join(map(str, hs)))
    m = a if it['exact'] else trim(a)
    return '%s: %s' % (it['title'], mat_txt(m))


# ================================================================ 앱 물음 → 활동지
def blankable(p):
    o = p['o']
    return not p['multi'] and len(o) >= 3 and all(len(x) <= 5 for x in o) and not any(x[0] in '㉠㉡㉢[' for x in o)


def right(p):
    if 'n' in p:
        return fmt(p['n'])
    if p['multi']:
        return ', '.join(p['o'][i] for i in p['a'])
    return p['o'][p['a']]


def is_long(p):
    return 'o' in p and (any(len(x) > 14 for x in p['o']) or p['multi'])


def sentence(parts, lv):
    out, ans, longs = [], [], []
    for p in parts:
        if 's' in p:
            out.append(p['s'])
        elif 'n' in p:
            out.append('(        )')
            ans.append(right(p))
        else:
            ans.append(right(p))
            if is_long(p):
                longs.append(p)
                out.append('(        )')
            elif lv == '도전형' and blankable(p):
                out.append('(          )')
            else:
                out.append('( ' + ' / '.join(p['o']) + ' )')
    return ''.join(out).strip(), ans, longs


def opt_list(o):
    return '   '.join('%s %s' % (NUM[i], x) for i, x in enumerate(o))


def long_ans(p):
    if p['multi']:
        return ', '.join(NUM[i] for i in p['a'])
    return NUM[p['a']]


def render_items(s, lv, items):
    ans_all, buf = [], []

    def flush():
        if buf:
            s.fill(list(buf))
            buf.clear()
    for it in items:
        if it.get('fig') or it.get('q'):
            flush()
        if it.get('q'):
            s.text(it['q'])
        put_fig(s, it.get('fig'))
        sent, ans, longs = sentence(it['parts'] or [], lv)
        if longs and sent == '(        )':
            p = longs[0]
            s.ask(opt_list(p['o']))
            ans_all.append(long_ans(p) + ' ' + right(p))
            continue
        if sent:
            buf.append(sent)
        for p in longs:
            flush()
            s.text('보기  ' + opt_list(p['o']))
        ans_all.append(', '.join((long_ans(p) + ' ' + right(p)) if p in longs else a
                                 for p, a in zip([q for q in it['parts'] if 's' not in q], ans)))
    flush()
    return '; '.join(ans_all)


def render_quiz(s, lv, items):
    ans = []
    for it in items:
        put_fig(s, it.get('fig'))
        o, a = it['o'], it['a']
        multi = isinstance(a, list)
        if not multi and all(len(x) <= 12 for x in o) and sum(len(x) for x in o) <= 30:
            s.choices([(it['q'], '( ' + ' / '.join(o) + ' )')])
            ans.append(o[a])
        else:
            s.text(it['q'] + (' (모두)' if multi else ''))
            s.ask(opt_list(o))
            ans.append(', '.join(NUM[i] for i in a) if multi else NUM[a] + ' ' + o[a])
    return '; '.join(ans)


def render_write(s, lv, items):
    ans = []
    for it in items:
        s.ask(it['q'], blank=False)
        if lv == '기본형' and it.get('help') and len(it['help']) > 1:
            s.text('도움: ' + it['help'][1])
        s.lines(2)
        ans.append(('(예) ' + it['ans']) if it.get('ans') else ('(자유) ' + it['ph'].replace('예) ', '예: ')))
    return ' / '.join(ans)


def render_panes(s, lv, items):
    """보여요·생각해요·궁금해요 세 칸"""
    if lv == '기본형':
        s.labeled([(it['t'], '______________________ ' + re.sub(r'^~\s*', '', it['ph'])) for it in items])
    else:
        for it in items:
            s.ask(it['t'] + ':', blank=False)
            s.lines(1)
    return '(자유) 예) ' + ' / '.join(it['ex'][0] for it in items if it['ex'])


def render_why(s, lv, rec):
    """thenWhy(왜 그럴까요?)·ruleFirst(먼저 예상해요)"""
    first = rec['t'] == 'ruleFirst'
    s.ask(('먼저 예상해요 · ' if first else '왜 그럴까요? ') + rec['q'], blank=False)
    if lv == '기본형' and rec.get('help') and len(rec['help']) > 1:
        s.text('도움: ' + rec['help'][1])
    s.lines(1 if first else 2)
    return ('(예상) ' if first else '(왜) ') + josa_num(rec['ans'] or '(자유)')


def josa_num(t):
    """앱 글의 '2이 가장'처럼 수 뒤 조사를 받침에 맞게(2·4·5·9 → 가)"""
    return re.sub(r'(\d)이 ', lambda m: m.group(1) + ('가 ' if m.group(1) in '2459' else '이 '), t)


def ask_after(s, lv, rec, pre=''):
    a = render_items(s, lv, rec['ask']) if rec.get('ask') else ''
    return '; '.join(x for x in (pre, a) if x)


def render_rec(s, lv, rec, st):
    t = rec['t']
    if t == 'quiz':
        return render_quiz(s, lv, rec['items'])
    if t == 'ask':
        if rec['opts'].get('title'):
            s.text(rec['opts']['title'])
        return render_items(s, lv, rec['items'])
    if t == 'blanks':
        sent, ans, longs = sentence(rec['parts'], lv)
        s.fill(sent)
        return ', '.join(ans)
    if t == 'write':
        return render_write(s, lv, rec['items'])
    if t == 'panes':
        return render_panes(s, lv, rec['items'])
    if t in ('thenWhy', 'ruleFirst'):
        return render_why(s, lv, rec)
    if t == 'wonder':
        s.text('1차시에 쓴 ‘궁금해요’ 쪽지를 다시 꺼내 읽어 보세요.')
        return ''
    if t == 'chain':
        out = []
        for k, part in enumerate(rec['parts']):
            t = part['title'] or ''
            lab = t if re.fullmatch(r'[①②③]|보기', t) else SUB[k]
            if t:
                s.text(lab if lab == t else lab + ' ' + re.sub(r'^[①②③]\s+(?=\S)', '', t))
            elif MODE['v'] == 'st' and len(rec['parts']) > 1:     # 이름 없는 첫 활동도 정답의 ⑴과 맞게
                s.text(lab)
            out.append(lab + ' ' + '; '.join(x for x in (render_rec(s, lv, r, None) for r in part['recs']) if x))
        return ' '.join(out)
    return HANDLERS[t](s, lv, rec, st)


# ---------------------------------------------------------------- 조작 활동(종이에서 하는 말로)
def h_sequence(s, lv, rec, st):
    for c in rec['cards']:
        s.text(c)
    s.ask('놀이 차례대로 기호를 써 보세요.' if lv == '기본형' else '차례에 맞게 기호를 늘어놓아 보세요.')
    return ' → '.join(rec['cards'][i][0] for i in rec['order'])


def h_pick(s, lv, rec, st):
    put_fig(s, rec['show'])
    put_figs(s, [(it['fig']['figs'][0]['svg'], it['name']) for it in rec['items']])
    multi = isinstance(rec['a'], list)
    A = rec['a'] if multi else [rec['a']]
    s.ask((rec['q'] or '알맞은 것을 찾아 기호를 써 보세요.') + (' (모두)' if multi else ''))
    out = ', '.join(rec['items'][i]['name'] for i in A)
    if rec.get('then'):
        out += '; ' + '; '.join(render_rec(s, lv, r, None) for r in rec['then'])
    return ask_after(s, lv, rec, out)


def build_ans(rec):
    sols = rec['sols']
    if rec['nsol'] == 1:
        return '수를 쓴 모양 ' + num_txt(sols[0], rec['lock'])
    sums = rec['sums']
    ex, seen = [], set()
    for G in sols:                       # 개수가 다른 예부터
        k = sum(map(sum, G))
        if k not in seen:
            seen.add(k)
            ex.append(G)
    for G in sols:
        if len(ex) >= max(2, rec['distinct']):
            break
        if G not in ex:
            ex.append(G)
    ex = ex[:max(2, rec['distinct'])] if len(sums) <= 1 else ex
    head = ('쌓을 수 있는 개수 %s개' % ', '.join(map(str, sums))) if len(sums) > 1 else '%d개' % sums[0]
    return '%s(방법 %d가지), 예: %s' % (head, rec['nsol'], ' · '.join(num_txt(G, True) for G in ex))


def h_build(s, lv, rec, st):
    put_fig(s, rec['show'])
    n = max(1, rec['distinct'])
    R, C = rec['R'], rec['C']
    gray = rec['start'] if rec['lock'] else None
    if gray:
        s.text('흐린 수가 쓰인 칸은 처음 모양이에요. 그대로 두고 더 붙인 자리의 수를 고쳐 써요.')
    s.text('쌓기나무로 쌓아 본 다음, 쌓은 모양을 위에서 본 모양에 수를 써서 나타내 보세요.' +
           (' (서로 다른 방법 %d가지)' % n if n > 1 else ''))
    put_figs(s, [(grid_svg(R, C, 'build', gray=gray), ('%d번째' % (i + 1)) if n > 1 else '위에서 본 모양에 수 쓰기') for i in range(n)])
    out = build_ans(rec)
    if rec['then']:
        s.text('내가 쌓은 모양의 1층, 2층, 3층 모양을 칸에 칠해 그려 보세요.')
        put_figs(s, [(grid_svg(3, 3, 'layer'), '%d층 모양' % k) for k in (1, 2, 3)])
        out += ' → 층별 모양은 내가 쌓은 모양대로'
    return ask_after(s, lv, rec, out)


def h_paint(s, lv, rec, st):
    put_fig(s, rec['show'])
    figs = [(grid_svg(it['rows'], it['cols'], it['kind']), it['title']) for it in rec['items']]
    if any(it['kind'] == 'up' for it in rec['items']):
        s.text('칸을 색칠해 그려요. 앞·옆에서 본 모양은 굵은 바닥 선 위에 바닥부터 칠해요.' if lv == '기본형'
               else '앞·옆에서 본 모양은 굵은 선을 바닥으로 하여 아래 칸부터 색칠해요.')
    put_figs(s, figs)
    out = ' · '.join(paint_ans(it) for it in rec['items'])
    return ask_after(s, lv, rec, out)


def h_nums(s, lv, rec, st):
    put_fig(s, rec['show'])
    H = rec['H']
    only = [[1 if v else 0 for v in r] for r in H]
    put_figs(s, [(grid_svg(len(H), len(H[0]), 'top', nums=H if rec['given'] else None, only=only), rec['title'] or '위에서 본 모양')])
    if rec['total'] and lv == '도전형':
        s.ask('%s (        )개 필요해요.' % (rec['totalQ'] or '똑같은 모양으로 만들려면 쌓기나무가 모두'), blank=False)
    elif rec['total']:
        s.ask(('%s ' % rec['totalQ'] if rec['totalQ'] else '똑같은 모양으로 만드는 데 필요한 쌓기나무는 ') + '(        )개예요.', blank=False)
    out = num_txt(H) + (' → %d개' % rec['sum'] if rec['total'] else '')
    return ask_after(s, lv, rec, out)


def h_turn(s, lv, rec, st):
    V = {v['d']: v for v in rec['views']}
    if lv == '기본형':
        put_figs(s, [(rec['iso'], CAPS[MODE['v']]['turn'])] + [(V[d]['svg'], d + '에서 본 모양') for d in ('위', '앞', '뒤', '왼쪽', '오른쪽')])
        s.text('앞과 뒤에서 본 모양, 오른쪽과 왼쪽에서 본 모양을 견주어 보세요.')
        out = ''
    else:
        put_figs(s, [(rec['iso'], CAPS[MODE['v']]['turn'])] + [(V[d]['svg'], d + '에서 본 모양') for d in ('위', '앞', '오른쪽')])
        M = max(max(v['v']) if isinstance(v['v'][0], int) else 1 for v in rec['views'])
        s.text('뒤와 왼쪽에서 본 모양을 칸에 칠해 그려 보세요. (뒤에서 보면 왼쪽과 오른쪽이 바뀌어요.)')
        put_figs(s, [(grid_svg(M + 1, len(V['뒤']['v']) + 1, 'up'), '뒤에서 본 모양'), (grid_svg(M + 1, len(V['왼쪽']['v']) + 1, 'up'), '왼쪽에서 본 모양')])
        out = '뒤: 왼쪽부터 %s층 · 왼쪽: 왼쪽부터 %s층' % (', '.join(map(str, V['뒤']['v'])), ', '.join(map(str, V['왼쪽']['v'])))
    return ask_after(s, lv, rec, out)


def h_layers(s, lv, rec, st):
    nm = rec['names'] or []
    put_figs(s, [(rec['iso'], CAPS[MODE['v']]['layers'])] + [(L['svg'], '%d층%s' % (L['k'], ' · ' + nm[L['k'] - 1] if nm else '')) for L in rec['layers']])
    return ask_after(s, lv, rec)


def h_scene(s, lv, rec, st):
    put_figs(s, [(rec['map'], '위에서 본 지도')])
    if rec['askTitle']:
        s.text(rec['askTitle'])
    return ask_after(s, lv, rec)


def h_guess(s, lv, rec, st):
    s.text('놀이 방법: 한 사람이 쌓기나무 %d개로 몰래 모양을 만들고, 위에서 본 모양을 그려 보여 줘요. 다른 사람이 똑같이 만들지 못하면 앞에서 본 모양, 그다음 옆에서 본 모양을 차례로 더 그려 보여 줘요.' % rec['n'])
    s.text('만들 사람이 그려 보여 줄 모양')
    put_figs(s, [(grid_svg(4, 4, 'top'), '위에서 본 모양'), (grid_svg(4, 4, 'up'), '앞에서 본 모양'), (grid_svg(4, 4, 'up'), '옆에서 본 모양')])
    s.table([['판', '본 모양(위 / 위·앞 / 위·앞·옆)', '맞혔나요?', '점수']] + [[str(i), '', '', ''] for i in range(1, 6)],
            header=True, col_mm=[20, 80, 40, 40], row_h=2268)
    return '(놀이) 위만 보고 맞히면 3점, 위·앞 2점, 위·앞·옆 1점, 다르게 만들면 0점 — %d점을 먼저 모으면 이겨요.' % rec['goal']


def h_figs(s, lv, rec, st):
    put_fig(s, rec['fig'])
    return ''


CAPS = {'tb': {'turn': '시청 모양', 'layers': '호텔 모양'}, 'st': {'turn': '강당 모형', 'layers': '별관 모형'}}

def h_hard_game(s, lv, rec, st):
    """도전형 맞히기 놀이 기록표(쌓기나무 6개)"""
    s.text('내가 만든 모양을 위에서 본 모양에 수로 몰래 적어 두고, 짝이 맞히면 몇 점인지 기록해요.')
    put_figs(s, [(grid_svg(4, 4, 'top'), '내가 만든 모양(수 쓰기)'), (grid_svg(4, 4, 'up'), '앞에서 본 모양'), (grid_svg(4, 4, 'up'), '옆에서 본 모양')])
    s.table([['차례', '보여 준 모양', '짝이 쌓은 개수', '얻은 점수']] + [[str(i), '', '', ''] for i in range(1, 6)],
            header=True, col_mm=[24, 64, 46, 46], row_h=2268)
    return '(놀이) 쌓기나무 6개로 만든 모양 — 위만 보고 맞히면 3점, 위·앞 2점, 위·앞·옆 1점, 12점을 먼저 모으면 이겨요.'


HANDLERS = {'hardGame': h_hard_game, 'figs': h_figs, 'sequence': h_sequence, 'sp6Pick': h_pick, 'sp6Build': h_build, 'sp6Paint': h_paint, 'sp6Nums': h_nums,
            'sp6Turn': h_turn, 'sp6Layers': h_layers, 'sp6Scene': h_scene, 'sp6Guess': h_guess}

PAPER = [('지도에서 사진기를 끌어 돌리거나 단추를 눌러 가, 나, 다 방향에서 학교 입구를 모두 보세요.', '지도에서 가, 나, 다 방향에 서서 학교 입구를 본다고 생각해 보세요.'),
         ('먼저 지도에서 사진기를 돌려 네 사람이 서 있는 곳에서 모두 보세요.', '지도에서 네 사람이 서 있는 곳을 살펴보세요.'),
         ('방향 단추를 눌러 위, 앞, 뒤, 왼쪽, 오른쪽에서 본 모양을 모두 살펴보세요.', '위, 앞, 뒤, 왼쪽, 오른쪽에서 본 모양을 살펴보세요.'),
         ('층 단추를 눌러 만든 모양을 층별로 살펴보세요.', '만든 모양을 층별로 살펴보세요.'),
         ('놀이 방법을 차례대로 눌러 보세요.', '놀이 방법을 차례대로 알아보세요.'),
         ('2명이 하는 놀이를 컴퓨터와 해 보세요. 컴퓨터가 쌓기나무 5개로 만든 모양의 위에서 본 모양을 보여 줘요. ', '짝과 함께 2명이 하는 놀이를 해 보세요. '),
         ('(위에서 칸 아래의 층별 모양은 잠시 가려 두었어요.)', '')]

# 이야기 버전: 화면에서 누르거나 끄는 말을 종이에서 하는 말로(위 PAPER도 함께 씀)
PAPER_ST = [('지도에서 사진기를 끌어 돌리거나 단추를 눌러 가, 나, 다 방향에서 모두 보세요.', '지도에서 가, 나, 다 방향에 서서 교문 쪽을 본다고 생각해 보세요.'),
            ('층 단추를 눌러 별관 모형을 층별로 살펴보세요.', '별관 모형을 층별로 살펴보세요.'),
            ('세 칸에 써서 붙여요.', '세 칸에 써 보세요.'),
            ('사진기는 지도 가운데를 바라보며 원을 따라 움직여요.', '가, 나, 다 자리에 서서 지도 가운데를 바라본다고 생각해요.'),
            ('층 단추를 누르면 그 층만 진하게 보이고, 그 층을 위에서 본 모양도 보여요.', '층별 그림은 그 층에 있는 쌓기나무만 위에서 본 모양이에요.'),
            ('점선 칸은 처음 급식실 모형이라 뺄 수 없어요.', '처음 급식실 모형의 쌓기나무는 그대로 두어요.')]

WHY_ST = {
    '1': ('그림에서 보이는 쌓기나무의 수와 하준이·서윤이가 쌓은 쌓기나무의 수가 다른 까닭을 써 보세요.',
          '그림에서 보이지 않는 뒤쪽 자리에 숨겨진 쌓기나무가 있을 수 있기 때문이에요.'),
    '2': ('동상 사진 ㉢을 하준이가 찍었다고 생각한 까닭을 써 보세요.',
          '하준이가 서 있는 곳을 앞이라고 했으므로, 앞에서 찍은 사진에는 동상의 얼굴과 책이 보여요. ㉢에 얼굴과 책이 보여요.'),
    '3': ('“보이는 쌓기나무만큼만 있으면 돼.”라는 도윤이의 말이 맞지 않는 까닭을 써 보세요.',
          '위에서 본 모양을 보면 그림에서 보이지 않는 가운데 자리에 숨겨진 쌓기나무가 1개 있어서, 보이는 것보다 1개 더 많은 8개가 필요해요.'),
    '4': ('옆에서 본 모양을 오른쪽에서 본 모양 하나만 그려도 되는 까닭을 써 보세요.',
          '오른쪽과 왼쪽에서 본 모양은 좌우로 뒤집으면 같기 때문이에요.'),
    '5': ('위에서 본 모양에 수를 쓰면 모양이 한 가지로만 만들어지는 까닭을 써 보세요.',
          '각 자리에 쌓여 있는 쌓기나무의 개수를 모두 알 수 있기 때문이에요.'),
    '6': ('층별 모양에서 1층 모양이 위에서 본 모양과 같은 까닭을 써 보세요.',
          '쌓기나무는 바닥부터 쌓으므로 위층 쌓기나무는 모두 1층 쌓기나무 위에 있어요. 그래서 위에서 내려다보면 1층 자리가 그대로 보여요.'),
    '7~8': ('㉠이 가 모형에 쌓기나무 1개를 더 붙인 모양이 아닌 까닭을 써 보세요.',
            '㉠도 쌓기나무가 5개이지만 가 모형이 그대로 들어 있지 않아요. 가 모형처럼 2층 쌓기나무가 뒷줄에 있어야 해요.'),
    '9': ('층별 모양을 그릴 때 2층, 3층을 1층과 같은 칸 자리에 그려야 하는 까닭을 써 보세요.',
          '층별 모양은 각 층을 위에서 본 모양이라 자리가 달라지면 실제 모양도 달라지기 때문이에요.'),
    '10': ('위, 앞, 옆에서 본 모양만으로는 쌓기나무의 개수를 정확히 모를 수 있는 까닭과, 정확히 나타내는 방법을 써 보세요.',
           '숨어 있는 부분이 있을 수 있기 때문이에요. 위에서 본 모양에 수를 쓰거나 층별로 나타내면 정확히 알 수 있어요.'),
}

WHY = {
    '1': ('그림에 보이는 쌓기나무만 세면 실제 개수와 다를 수 있는 까닭을 써 보세요.',
          '그림에서 보이지 않는 뒤쪽에 숨겨진 쌓기나무가 있을 수 있기 때문이에요.'),
    '2': ('가 방향과 다 방향에서 본 모습은 보이는 차례가 서로 거꾸로예요. 그 까닭을 써 보세요.',
          '가 방향과 다 방향은 서로 반대쪽에서 보기 때문에 왼쪽과 오른쪽이 바뀌어요.'),
    '3': ('만든 모양과 위에서 본 모양을 함께 보아도 쌓기나무의 개수가 여러 가지일 수 있는 까닭을 써 보세요.',
          '숨겨진 자리에 쌓기나무가 몇 개 있는지는 알 수 없기 때문이에요(예: 10개 또는 11개).'),
    '4': ('옆에서 본 모양을 오른쪽에서 본 모양 하나만 그려도 되는 까닭을 써 보세요.',
          '오른쪽과 왼쪽에서 본 모양은 좌우로 뒤집으면 같기 때문이에요.'),
    '5': ('위에서 본 모양에 수를 쓰면 모양이 한 가지로만 만들어지는 까닭을 써 보세요.',
          '각 자리에 쌓여 있는 쌓기나무의 개수를 모두 알 수 있기 때문이에요.'),
    '6': ('2층에 쌓기나무를 놓으려면 1층의 같은 자리에 쌓기나무가 꼭 있어야 하는 까닭을 써 보세요.',
          '쌓기나무는 바닥부터 쌓으므로 바로 아래층의 같은 자리에 쌓기나무가 없으면 그 위에 놓을 수 없어요.'),
    '7~8': ('㉡이 가 모양에 쌓기나무 1개를 더 붙인 모양이 아닌 까닭을 써 보세요.',
            '㉡에는 가 모양이 그대로 들어 있지 않아요. 2층 쌓기나무의 자리가 가 모양과 달라요.'),
    '9': ('층별 모양을 그릴 때 2층, 3층을 1층과 같은 칸 자리에 그려야 하는 까닭을 써 보세요.',
          '층별 모양은 각 층을 위에서 본 모양이라 자리가 달라지면 실제 모양도 달라지기 때문이에요.'),
    '10': ('위, 앞, 옆에서 본 모양만으로는 쌓기나무의 개수를 정확히 모를 수 있는 까닭과, 정확히 나타내는 방법을 써 보세요.',
           '숨어 있는 부분이 있을 수 있기 때문이에요. 위에서 본 모양에 수를 쓰거나 층별로 나타내면 정확히 알 수 있어요.'),
}



# ================================================================ 도전형 새 문제(2026-10-30)
# 도전형 ①~⑤는 기본형과 다른 쌓기나무 모양·상황으로 새로 씁니다(_build/sheets_hard/BRIEF.md).
# 새 모양의 그림은 앱의 그리기 코드(sp6Iso·sp6View)를 node에서 그대로 불러 그리고, 숨은 쌓기나무가 있을 때
# 가능한 개수는 앱의 sp6Possible로 셉니다. 답(층별 개수·세 방향 모양·수를 쓴 모양)은 파이썬 views()·layers()로 계산합니다.
_DRAW = _EX[:_EX.index('function findTag(')] + r'''
const REQ = JSON.parse(fs.readFileSync(process.argv[4], 'utf8'));
const res = REQ.map(q => {
  const H = q.H, V = H ? sp6Views(H) : null;
  if (q.f === 'iso') return String(sp6Iso(H, { maxW: '9em' }));
  if (q.f === 'topnums') return String(sp6View('top', H, { nums: true }));
  if (q.f === 'top') return String(sp6View('top', V.top));
  if (q.f === 'front') return String(sp6View('front', V.front, { rows: sp6Max(H) }));
  if (q.f === 'side') return String(sp6View('side', V.side, { rows: sp6Max(H) }));
  if (q.f === 'layer') return String(sp6View('layer', sp6Layer(H, q.k), { frame: true, cell: 26 }));
  if (q.f === 'turn') { const M = sp6Max(H); return { iso: String(sp6Iso(H, { side: true, maxW: '17em' })), views: ['위', '앞', '뒤', '왼쪽', '오른쪽'].map(d => {
      const dv = sp6DirView(H, d); return { d, v: dv.v, svg: String(sp6View(dv.kind, dv.v, { rows: M, cell: 28, frontLabel: d === '위' })) }; }) }; }
  if (q.f === 'poss') { const P = sp6Possible(H, q.opt || {}); return [...new Set(P.map(sp6Sum))].sort((a, b) => a - b); }
  if (q.f === 'look') { const L = sp6Look(H); return [L.gone.length, L.part.length]; }
  throw new Error('모르는 그림 ' + q.f);
});
process.stdout.write(JSON.stringify(res));
'''


class _X:
    """새 모양 그리기·세기(두 번 돎: 처음엔 필요한 것만 모으고, node 한 번으로 구한 뒤 다시 만듦)"""
    def __init__(self, src):
        self.src, self.want, self.got = src, [], None

    def _q(self, **q):
        key = json.dumps(q, sort_keys=True)
        if self.got is None:
            self.want.append(key)
            return {'iso': '<svg viewBox="0 0 10 10"></svg>', 'poss': [0], 'look': [0, 0],
                    'turn': {'iso': '<svg viewBox="0 0 10 10"></svg>', 'views': []}}.get(q['f'], '<svg viewBox="0 0 10 10"></svg>')
        return self.got[key]

    def run(self):
        keys = sorted(set(self.want))
        req = os.path.join(WORK, 'draw_req.json')
        with open(req, 'w', encoding='utf-8') as f:
            json.dump([json.loads(k) for k in keys], f)
        js = os.path.join(WORK, 'draw.js')
        with open(js, 'w', encoding='utf-8') as f:
            f.write(_DRAW)
        r = subprocess.run(['node', js, self.src, FONT, req], capture_output=True, text=True)
        if r.returncode:
            raise RuntimeError(r.stderr[-3000:])
        self.got = dict(zip(keys, json.loads(r.stdout)))

    def iso(self, H):
        return self._q(f='iso', H=H)

    def topnums(self, H):
        return self._q(f='topnums', H=H)

    def top(self, H):
        return self._q(f='top', H=H)

    def front(self, H):
        return self._q(f='front', H=H)

    def side(self, H):
        return self._q(f='side', H=H)

    def layer(self, H, k):
        return self._q(f='layer', H=H, k=k)

    def turn(self, H):
        return self._q(f='turn', H=H)

    def poss(self, H, **opt):
        return self._q(f='poss', H=H, opt=opt)

    def look(self, H):
        return self._q(f='look', H=H)


def _P(*parts):
    """물음 줄 조각: 글 → {'s'}, 수 → {'n'}, (보기, 정답 번호) → 고르기"""
    out = []
    for p in parts:
        if isinstance(p, str):
            out.append({'s': p})
        elif isinstance(p, tuple):
            out.append({'o': p[0], 'a': p[1], 'multi': False})
        else:
            out.append({'n': p})
    return out


def _fig(*pairs):
    return {'figs': [{'svg': s, 'cap': c} for s, c in pairs]}


def _ask(*items, title=None):
    """items: (물음|None, 그림|None, 줄 조각)"""
    return {'t': 'ask', 'items': [{'q': q, 'fig': f, 'o': None, 'parts': p} for q, f, p in items], 'opts': {'title': title} if title else {}}


def _quiz(*items):
    return {'t': 'quiz', 'items': [{'q': q, 'fig': None, 'o': o, 'a': a, 'parts': None} for q, o, a in items], 'opts': {}}


def _blanks(*parts):
    return {'t': 'blanks', 'parts': _P(*parts), 'opts': {}}


def _write(*items):
    return {'t': 'write', 'items': [{'q': q, 'tag': None, 'ph': '예) ' + a, 'help': None, 'ans': a} for q, a in items]}


def _chain(*parts):
    return {'t': 'chain', 'parts': [{'title': t, 'recs': r} for t, r in parts]}


def _lay(H, k):
    return [[1 if v >= k else 0 for v in r] for r in H]


def _upm(V):
    M = max(V)
    return [[1 if V[q] >= M - r else 0 for q in range(len(V))] for r in range(M)]


def _paint(H, kinds, show=None, ask=()):
    R, C = len(H), len(H[0])
    top, front, side = views(H)
    items = []
    for k in kinds:
        if k == 'top':
            items.append({'title': '위에서 본 모양', 'kind': 'top', 'rows': R + 1, 'cols': C + 1, 'ans': top, 'exact': False})
        elif k in ('front', 'side'):
            V = front if k == 'front' else side
            items.append({'title': '앞에서 본 모양' if k == 'front' else '옆에서 본 모양', 'kind': 'up', 'rows': max(V) + 1, 'cols': len(V) + 1, 'ans': _upm(V), 'exact': False})
        else:
            n = int(k[1:])
            items.append({'title': '%d층 모양' % n, 'kind': 'layer', 'rows': R, 'cols': C, 'ans': _lay(H, n), 'exact': True})
    return {'t': 'sp6Paint', 'show': show, 'items': items, 'ask': list(ask), 'tip': None}


def _nums(H, show=None, total=True, totalQ=None, title=None, given=False, ask=()):
    return {'t': 'sp6Nums', 'H': H, 'given': given, 'total': total, 'totalQ': totalQ, 'title': title, 'show': show, 'ask': list(ask), 'sum': sum(map(sum, H))}


def _layers(X, H, names=None, ask=()):
    n = max(map(max, H))
    return {'t': 'sp6Layers', 'H': H, 'names': names, 'iso': X.iso(H),
            'layers': [{'k': k, 'svg': X.layer(H, k), 'cnt': layers(H)[k - 1]} for k in range(1, n + 1)], 'ask': list(ask)}


def _turn(X, H, ask=()):
    T = X.turn(H)
    return {'t': 'sp6Turn', 'H': H, 'iso': T['iso'], 'views': T['views'], 'ask': list(ask)}


def _pick(show, q, items, a):
    return {'t': 'sp6Pick', 'show': show, 'q': q, 'items': [{'name': n, 'fig': {'figs': [{'svg': s, 'cap': None}]}} for n, s in items], 'a': a, 'ask': []}


def _lay_parts(H):
    """'1층 (n)개, 2층 (n)개, … → 모두 (n)개'"""
    L = [c for c in layers(H) if c]
    out = []
    for k, c in enumerate(L):
        out += ['%s%d층 ' % (' + ' if k else '', k + 1), c, '개']
    return out + [' = 모두 ', sum(L), '개']


def _seq(pre, vals, post):
    out = [pre]
    for k, v in enumerate(vals):
        out += ([', '] if k else []) + [v]
    return out + [post]


def _contains(big, small):
    d = [[b - s for b, s in zip(rb, rs)] for rb, rs in zip(big, small)]
    return all(v >= 0 for r in d for v in r) and sum(map(sum, d)) == sum(map(sum, big)) - sum(map(sum, small))


def _uniq(X, H, **opt):
    P = X.poss(H, **opt)
    assert X.got is None or P == [sum(map(sum, H))], ('답이 하나가 아니에요', H, opt, P)
    return P


def _range(X, H, **opt):
    P = X.poss(H, **opt)
    assert X.got is None or (len(P) >= 2 and sum(map(sum, H)) in P), ('개수가 여러 가지가 아니에요', H, opt, P)
    return P[0], P[-1]


def _seen(X, H):
    L = X.look(H)
    assert X.got is None or L == [0, 0], ('숨은 쌓기나무가 있어요', H)


# ---------------------------------------------------------------- 두 버전에 쓰는 새 모양(버전마다 다른 수)
U3 = {
    'tb': dict(who=('규진', '시연'), bld=('발전소', '시청', '식물원', '호텔'),
               iso_rng=[[0, 1, 1], [1, 2, 2], [0, 1, 1]], simple=[[2, 1, 1], [1, 1, 0], [1, 0, 0]],
               a3=[[1, 1, 0], [1, 2, 3], [1, 0, 0]], b3=[[1, 1, 1], [1, 2, 1], [0, 1, 1]], c3=[[1, 0, 0], [1, 1, 1], [1, 3, 1]],
               d3a=[[1, 1, 0], [3, 2, 1], [2, 0, 0]], d3b=[[2, 1, 3], [0, 2, 3], [0, 1, 0]],
               turn=[[2, 1, 1], [1, 2, 1], [1, 1, 1]], p4=[[3, 1, 0], [2, 1, 1], [1, 0, 0]], r4=[[2, 1, 2], [1, 1, 0], [1, 2, 1]], u4=[[0, 2, 0], [1, 3, 3], [1, 1, 1]],
               i5=[[0, 0, 2], [2, 0, 1], [2, 1, 1]], t5=[[1, 3, 1], [2, 1, 0], [1, 0, 0]], c5=([[2, 2, 1], [1, 1, 1], [0, 1, 1]], [[0, 1, 0], [3, 3, 0], [1, 1, 3]]),
               e5=[[2, 3, 1], [1, 0, 2], [1, 1, 0]],
               a6=[[3, 2, 1], [2, 1, 0]], b6=[[1, 2, 3], [1, 0, 2], [2, 1, 0]], c6=[[2, 1, 3], [1, 1, 2], [0, 1, 0]], d6=[[3, 1, 0], [2, 2, 1], [1, 0, 1]],
               A7=[[0, 0, 0], [0, 2, 0], [1, 1, 0]], A7c=[[[0, 1, 0], [0, 2, 0], [1, 1, 0]], [[0, 0, 0], [0, 2, 0], [1, 1, 1]], [[0, 0, 0], [0, 1, 0], [1, 2, 1]]],
               B7=[[0, 0, 0], [1, 2, 0], [0, 1, 1]], B7c=[[[0, 1, 0], [1, 2, 0], [0, 1, 2]], [[0, 0, 0], [2, 1, 1], [0, 1, 2]], [[0, 0, 0], [1, 3, 1], [0, 1, 1]], [[0, 0, 0], [1, 2, 0], [2, 2, 0]]],
               card1=[[1, 1, 1], [1, 2, 1], [1, 1, 1]], card2=[[2, 1, 3], [1, 1, 0]],
               g10a=[[1, 2, 0], [2, 1, 2], [1, 1, 1]], g10b=[[0, 3, 1], [2, 1, 1], [1, 3, 0]], p10=[[2, 1, 1], [0, 1, 1], [2, 1, 1]],
               n10=[[2, 1, 1], [2, 1, 1], [1, 1, 0]], n10x=([[2, 1, 1], [1, 2, 1], [1, 1, 0]], [[1, 1, 2], [2, 1, 1], [1, 1, 0]]),
               l10=[[3, 0, 0], [2, 2, 0], [2, 1, 2]], s10=[[0, 1, 0, 0], [2, 1, 3, 1], [0, 1, 0, 0]]),
    'st': dict(who=('하준', '서윤'), bld=('본관', '강당', '도서관', '별관'),
               iso_rng=[[0, 1, 0], [1, 2, 0], [1, 2, 1]], simple=[[0, 1, 0], [1, 1, 0], [2, 1, 1]],
               a3=[[1, 1, 2], [1, 3, 1], [1, 0, 1]], b3=[[0, 1, 2], [2, 1, 2], [1, 1, 0]], c3=[[0, 1, 1], [1, 1, 1], [0, 3, 2]],
               d3a=[[1, 1, 2], [1, 1, 2], [0, 1, 1]], d3b=[[1, 1, 1], [0, 1, 3], [1, 2, 2]],
               turn=[[2, 1, 1], [2, 1, 1], [1, 1, 0]], p4=[[0, 1, 2], [1, 1, 1], [2, 1, 1]], r4=[[1, 1, 2], [2, 1, 1], [2, 1, 1]], u4=[[1, 3, 1], [1, 1, 1], [1, 2, 1]],
               i5=[[1, 1, 1], [2, 0, 1], [2, 0, 2]], t5=[[2, 1, 0], [3, 1, 2], [0, 1, 0]], c5=([[2, 2, 2], [1, 1, 1], [1, 1, 1]], [[1, 1, 1], [0, 1, 1], [1, 2, 1]]),
               e5=[[1, 2, 3], [2, 0, 1], [0, 1, 1]],
               a6=[[2, 3, 1], [1, 2, 0]], b6=[[3, 2, 1], [1, 2, 2], [0, 1, 0]], c6=[[3, 1, 1], [2, 2, 0], [1, 0, 0]], d6=[[1, 2, 3], [1, 1, 2], [0, 0, 1]],
               A7=[[0, 0, 0], [1, 2, 0], [1, 0, 0]], A7c=[[[0, 0, 0], [1, 2, 1], [1, 0, 0]], [[0, 0, 0], [1, 1, 0], [1, 1, 1]], [[0, 0, 0], [2, 2, 0], [1, 0, 0]]],
               B7=[[0, 1, 0], [1, 2, 1], [0, 0, 0]], B7c=[[[0, 1, 0], [1, 2, 1], [1, 1, 0]], [[0, 2, 0], [1, 3, 1], [0, 0, 0]], [[0, 1, 0], [2, 1, 2], [0, 1, 0]], [[0, 1, 0], [1, 1, 1], [1, 1, 1]]],
               card1=[[1, 1, 2], [3, 1, 2], [0, 1, 0]], card2=[[1, 3, 2], [2, 1, 0]],
               g10a=[[2, 1, 2], [1, 1, 0], [1, 2, 1]], g10b=[[1, 1, 1], [1, 1, 0], [2, 3, 1]], p10=[[1, 1, 1], [2, 0, 1], [0, 1, 2]],
               n10=[[1, 1, 1], [1, 1, 1], [3, 1, 1]], n10x=([[1, 1, 1], [1, 1, 1], [1, 1, 3]], [[3, 1, 1], [1, 1, 1], [1, 1, 1]]),
               l10=[[0, 1, 0], [3, 3, 0], [1, 1, 3]], s10=[[0, 0, 1, 0], [1, 2, 1, 3], [0, 0, 1, 0]]),
}


def hard_u3(X, v):
    """버전 v(tb|st)의 도전형 새 계단: 차시 번호 → [(안내 글, [앱 기록 꼴])]"""
    d = U3[v]
    p1, p2 = d['who']
    b1, b2, b3, b4 = d['bld']
    out = {}
    H = d['iso_rng']
    lo, hi = _range(X, H, M=3)
    S = d['simple']
    _seen(X, S)
    out['1'] = [
        ('주변 물건을 여러 방향에서 본다고 생각하며 물음에 답해 보세요.',
         [_quiz(('둥근 컵을 바로 위에서 내려다본 모양으로 알맞은 것은?', ['원', '직사각형', '삼각형'], 0),
                ('직육면체 모양 상자를 바로 앞에서 본 모양으로 알맞은 것은?', ['삼각형', '직사각형', '원'], 1))]),
        ('%s와 %s의 영상 촬영 이야기를 떠올리며 물음에 답해 보세요.' % (p1, p2) if v == 'tb' else '%s와 %s의 전시회 준비 이야기를 떠올리며 물음에 답해 보세요.' % (p1, p2),
         [_quiz(('같은 건물을 여러 방향에서 찍으면 좋은 점은?', ['건물의 여러 면을 볼 수 있어요', '건물이 더 커져요', '건물의 색이 바뀌어요'], 0),
                ('쌓기나무 모양을 한 방향에서만 보면 알 수 없는 것은?', ['쌓기나무의 모양이 정육면체인 것', '뒤쪽에 숨은 쌓기나무가 있는지', '쌓기나무의 색'], 1))]),
        ('그림과 똑같아 보이게 쌓기나무를 쌓으려고 해요. 한 자리에 3개까지 쌓을 수 있다면 쌓기나무는 몇 개가 필요할까요?',
         [_ask((None, _fig((X.iso(H), '쌓기나무로 만든 모양')), _P('가장 적으면 ', lo, '개, 가장 많으면 ', hi, '개예요.')),
               ('개수가 한 가지로 정해지지 않는 까닭은 무엇일까요?', None, _P((['쌓기나무의 크기가 달라서', '그림에서 보이지 않는 자리가 있어서'], 1))))]),
        ('이 단원에서 하게 될 활동을 모두 골라 보세요.',
         [_quiz(('이 단원에서 하게 될 활동을 모두 골라 보세요.', ['위에서 본 모양에 수를 써서 개수 구하기', '층별 모양을 보고 쌓기나무로 만들기',
                                                 '쌓기나무의 무게 재기', '앞과 옆에서 본 모양 그리기', '도형의 넓이 구하기'], [0, 1, 3]))]),
        ('쌓기나무로 만든 모양을 보고 물음에 답해 보세요. (숨은 쌓기나무는 없어요.)',
         [_ask(('쌓기나무 몇 개로 만든 모양인가요?', _fig((X.iso(S), None)), _P(*_lay_parts(S))),
               ('가장 높은 곳은 몇 층인가요?', None, _P(max(map(max, S)), '층')))]),
    ]
    obj = ('철봉', '그네', '미끄럼틀') if v == 'tb' else ('교명석', '국기 게양대', '은행나무')
    O3 = list(obj)
    out['2'] = [
        ('%s 앞쪽(남쪽)이 가 방향, 오른쪽(동쪽)이 나 방향, 뒤쪽(북쪽)이 다 방향이에요. 가 방향에서 보면 왼쪽부터 %s, %s, %s가 한 줄로 보여요.'
         % ('운동장' if v == 'tb' else '교문', obj[0], obj[1], obj[2]),
         [_ask((None, None, _P('다 방향에서 보면 왼쪽부터 ', (O3, 2), ', ', (O3, 1), ', ', (O3, 0), ' 차례로 보여요.')))]),
        ('보는 방향에 따라 보이는 차례와 모습을 말해 보세요.',
         [_ask((None, None, _P('나 방향에서 보면 가장 가까이 보이는 것은 ', (O3, 2), '예요.')),
               (None, None, _P('왼쪽부터 %s, %s, %s 차례로 보이는 것은 ' % (obj[2], obj[1], obj[0]), (['가', '나', '다'], 2), ' 방향에서 본 모습이에요.')))]),
        ('곰 인형을 탁자 가운데 놓았어요. 지호가 선 쪽을 앞이라고 하면 곰 인형의 얼굴이 지호를 보고 있어요. 민아는 지호의 맞은편, 태오는 지호의 왼쪽, 수아는 지호의 오른쪽에 서서 곰 인형을 찍었어요.',
         [_ask((None, None, _P('㉠ 곰 인형의 등만 보임: ', (['지호', '민아', '태오', '수아'], 1), ' · ㉡ 곰 인형의 얼굴이 보임: ', (['지호', '민아', '태오', '수아'], 0))),
               (None, None, _P('㉢ 곰 인형의 오른쪽 옆모습: ', (['지호', '민아', '태오', '수아'], 2), ' · ㉣ 곰 인형의 왼쪽 옆모습: ', (['지호', '민아', '태오', '수아'], 3))))]),
        ('여러 방향에서 본 모습을 다른 말로 정리해 보세요.',
         [_blanks('맞은편에서 보면 보이는 차례가 ', (['반대로', '똑같이'], 0), ' 보여요. 같은 물체라도 ', (['보는 방향', '물체의 크기'], 0),
                  '에 따라 보이는 모습이 달라서, 사진을 보고 찍은 곳을 찾을 때는 가장 ', (['가까이', '멀리'], 0), ' 보이는 것부터 살펴보면 편리해요.')]),
        ('탁자 위에 왼쪽부터 컵, 접시, 병을 한 줄로 놓고 앞에서 보았어요. 물음에 답해 보세요.',
         [_ask((None, None, _P('뒤에서 보면 왼쪽부터 ', (['컵', '접시', '병'], 2), ', ', (['컵', '접시', '병'], 1), ', ', (['컵', '접시', '병'], 0), ' 차례로 보여요.'))),
          _write(('왼쪽에서 볼 때 가장 가까이 보이는 물건과 그 까닭을 써 보세요.', '컵이에요. 왼쪽 끝에 놓여 있어서 왼쪽에서 볼 때 가장 가까이 있기 때문이에요.'))]),
    ]
    A, B_, C_ = d['a3'], d['b3'], d['c3']
    alo, ahi = _range(X, A, M=3)
    _uniq(X, B_, top=True)
    clo, chi = _range(X, C_, top=True)
    Da, Db = d['d3a'], d['d3b']
    _uniq(X, Da, top=True)
    dlo, dhi = _range(X, Db, top=True)
    out['3'] = [
        ('%s 모양을 그림만 보고 쌓으려고 해요. 한 자리에 3개까지 쌓는다면 쌓기나무는 몇 개 필요할까요?' % b1,
         [_ask((None, _fig((X.iso(A), '%s 모양' % b1)), _P('가장 적으면 ', alo, '개, 가장 많으면 ', ahi, '개예요.')),
               ('개수를 하나로 정하려면 무엇을 더 알아야 할까요?', None, _P((['쌓기나무의 색깔', '만든 모양을 위에서 본 모양', '쌓기나무의 무게'], 1))))]),
        ('만든 모양과 위에서 본 모양을 함께 보고 필요한 쌓기나무의 개수를 구해 보세요.',
         [_ask((None, _fig((X.iso(B_), '쌓기나무로 만든 모양'), (X.top(B_), '위에서 본 모양')), _P(*_lay_parts(B_))),
               ('그림에서 윗면이 보이지 않는 자리는 몇 군데인가요?', None, _P(sum(X.look(B_)), '군데')))]),
        ('만든 모양과 위에서 본 모양이에요. 똑같은 모양으로 만들 때 쌓기나무의 수가 여러 가지일 수 있어요. 한 자리에 4개까지 쌓는다면 몇 개일까요?',
         [_ask((None, _fig((X.iso(C_), '쌓기나무로 만든 모양'), (X.top(C_), '위에서 본 모양')), _P('가장 적으면 ', clo, '개, 가장 많으면 ', chi, '개예요.')))]),
        ('위에서 본 모양으로 숨은 쌓기나무를 찾는 방법을 다른 말로 정리해 보세요.',
         [_blanks('위에서 본 모양의 칸 수는 ', (['1층', '2층'], 0), '에 있는 쌓기나무의 수와 같아요. 위에서 본 모양에는 칸이 있는데 그림에서 윗면이 보이지 않는 자리에는 쌓기나무가 ',
                  (['1개 이상', '0개'], 0), ' 있어요.')]),
        ('두 모양을 똑같이 만드는 데 필요한 쌓기나무는 몇 개인지 구해 보세요. (한 자리에 4개까지)',
         [_ask(('가', _fig((X.iso(Da), '쌓기나무로 만든 모양'), (X.top(Da), '위에서 본 모양')), _P(*_lay_parts(Da))),
               ('나', _fig((X.iso(Db), '쌓기나무로 만든 모양'), (X.top(Db), '위에서 본 모양')), _P('가장 적으면 ', dlo, '개, 가장 많으면 ', dhi, '개')))]),
    ]
    T4, P4, R4, U4 = d['turn'], d['p4'], d['r4'], d['u4']
    _seen(X, T4)
    _seen(X, P4)
    rlo, rhi = _range(X, R4, views=True)
    _uniq(X, U4, views=True)
    out['4'] = [
        ('%s 모양을 위, 앞, 오른쪽에서 본 모양이에요. 살펴보고 물음에 답해 보세요.' % b2,
         [_turn(X, T4, ask=[{'q': '앞에서 본 모양과 뒤에서 본 모양은 어떤 관계인가요?', 'fig': None, 'o': None,
                            'parts': _P((['위아래로 뒤집으면 같아요', '좌우로 뒤집으면 같아요'], 1), '.')}])]),
        ('쌓기나무로 만든 모양을 보고 위, 앞, 옆에서 본 모양을 각각 칸에 칠해 그려 보세요. (숨은 쌓기나무는 없고, 옆은 오른쪽이에요.)',
         [_paint(P4, ['top', 'front', 'side'], show=_fig((X.iso(P4), '쌓기나무로 만든 모양')))]),
        ('위, 앞, 옆에서 본 모양만 보고 쌓으면 쌓기나무의 수가 여러 가지일 수 있어요. 세 모양이 똑같이 되도록 쌓는다면 몇 개일까요?',
         [_ask((None, _fig((X.top(R4), '위에서 본 모양'), (X.front(R4), '앞에서 본 모양'), (X.side(R4), '옆에서 본 모양')),
                _P('가장 적으면 ', rlo, '개, 가장 많으면 ', rhi, '개예요.')))]),
        ('앞과 옆에서 본 모양을 그리는 방법을 다른 말로 정리해 보세요.',
         [_blanks('앞에서 본 모양의 칸 수는 앞에서 볼 때 각 줄의 ', (['가장 높은 층의 수', '쌓기나무 수의 합'], 0), '를 왼쪽부터 나타낸 것이에요. 옆(오른쪽)에서 볼 때 왼쪽에 보이는 줄은 ',
                  (['맨 앞줄', '맨 뒷줄'], 0), '이에요.')]),
        ('위, 앞, 옆에서 본 모양이에요. 똑같은 모양으로 만드는 데 필요한 쌓기나무는 몇 개인지 구해 보세요.',
         [_ask((None, _fig((X.top(U4), '위에서 본 모양'), (X.front(U4), '앞에서 본 모양'), (X.side(U4), '옆에서 본 모양')),
                _P('필요한 쌓기나무는 ', sum(map(sum, U4)), '개예요.'))),
          _nums(U4, title='위에서 본 모양에 수 쓰기', total=False)]),
    ]
    I5, T5, E5 = d['i5'], d['t5'], d['e5']
    C5a, C5b = d['c5']
    for h_ in (I5, C5a, C5b):
        _seen(X, h_)
    out['5'] = [
        ('%s 모양을 보고 위에서 본 모양의 각 자리에 쌓기나무의 수를 써 보세요. (숨은 쌓기나무는 없어요.)' % b3,
         [_nums(I5, show=_fig((X.iso(I5), '%s 모양' % b3)))]),
        ('위에서 본 모양에 수를 쓴 것이에요. 쌓기나무로 쌓았다고 생각하고 물음에 답해 보세요.',
         [_ask((None, _fig((X.topnums(T5), '위에서 본 모양에 수를 쓴 것')), _P(*_lay_parts(T5))),
               ('앞에서 본 모양은 왼쪽부터 몇 층인가요?', None, _P(*_seq('왼쪽부터 ', views(T5)[1], '층'))))]),
        ('두 모양을 보고 위에서 본 모양에 수를 쓰고, 필요한 쌓기나무의 개수를 구해 보세요. (숨은 쌓기나무는 없어요.)',
         [_chain(('①', [_nums(C5a, show=_fig((X.iso(C5a), None)))]), ('②', [_nums(C5b, show=_fig((X.iso(C5b), None)))]))]),
        ('위에서 본 모양에 수를 쓰는 방법을 다른 말로 정리해 보세요.',
         [_blanks('위에서 본 모양에 쓴 수가 모두 같은 줄(앞에서 볼 때 세로줄)에서 앞에서 본 모양의 높이는 그 줄의 ', (['가장 큰 수', '모든 수의 합'], 0),
                  '예요. 수를 쓰면 숨은 쌓기나무도 알 수 있어서 모양이 ', (['한 가지로', '여러 가지로'], 0), ' 정해져요.')]),
        ('위에서 본 모양에 수를 쓴 것만 보고 쌓기나무의 개수를 구하고, 앞과 옆에서 본 모양을 그려 보세요.',
         [_ask((None, _fig((X.topnums(E5), '위에서 본 모양에 수를 쓴 것')), _P('쌓기나무는 모두 ', sum(map(sum, E5)), '개예요.'))),
          _paint(E5, ['front', 'side'])]),
    ]
    A6, B6, C6, D6 = d['a6'], d['b6'], d['c6'], d['d6']
    _seen(X, B6)
    names = ['식당', '운동 시설', '숙소'] if v == 'tb' else ['과학실', '음악실', '미술실']
    out['6'] = [
        ('%s 모양을 층별로 살펴보고 물음에 답해 보세요.' % b4,
         [_layers(X, A6, names, ask=[{'q': '각 층의 쌓기나무 수와 전체 개수를 구해 보세요.', 'fig': None, 'o': None, 'parts': _P(*_lay_parts(A6))},
                                     {'q': '3층까지 쌓인 자리는 몇 군데인가요?', 'fig': None, 'o': None, 'parts': _P(sum(1 for r in A6 for x in r if x >= 3), '군데')}])]),
        ('쌓기나무로 만든 모양을 층별로 위에서 본 모양을 칸에 칠해 그려 보세요. (숨은 쌓기나무는 없어요. 아래쪽이 앞이에요.)',
         [_paint(B6, ['L1', 'L2', 'L3'], show=_fig((X.iso(B6), '쌓기나무로 만든 모양')))]),
        ('층별 모양을 보고 위에서 본 모양의 각 자리에 쌓기나무의 수를 써 보세요.',
         [_nums(C6, show=_fig(*[(X.layer(C6, k), '%d층' % k) for k in range(1, max(map(max, C6)) + 1)]))]),
        ('층별로 나타내는 방법을 다른 말로 정리해 보세요.',
         [_blanks('2층 모양의 칸은 모두 ', (['1층 모양', '3층 모양'], 0), '에도 칠해져 있어야 해요. 위에서 본 모양의 한 자리에 쓴 수는 그 자리가 칠해진 ',
                  (['층의 수', '칸의 수'], 0), '와 같아요.')]),
        ('층별 모양이에요. 쌓기나무의 개수를 구하고, 위, 앞, 옆에서 본 모양을 그려 보세요.',
         [_ask((None, _fig(*[(X.layer(D6, k), '%d층' % k) for k in range(1, max(map(max, D6)) + 1)]), _P(*_lay_parts(D6)))),
          _paint(D6, ['top', 'front', 'side'])]),
    ]
    A7, B7 = d['A7'], d['B7']
    ka = [i for i, Cc in enumerate(d['A7c']) if _contains(Cc, A7)]
    kb = [i for i, Cc in enumerate(d['B7c']) if _contains(Cc, B7)]
    assert sum(map(sum, A7)) + 1 == sum(map(sum, d['A7c'][0])) and len(ka) == 2 and len(kb) == 2, (ka, kb)
    pick_b = d['B7c'][kb[0]]
    pick_a = d['A7c'][ka[0]]
    g7 = '가 모양' if v == 'tb' else '가 모형'
    n7 = '나 모양' if v == 'tb' else '나 모형'
    out['7~8'] = [
        ('%s(쌓기나무 %d개)에 쌓기나무 1개를 더 붙인 모양을 모두 찾아보세요.' % (g7, sum(map(sum, A7))),
         [_pick(_fig((X.iso(A7), g7)), '%s에 1개를 더 붙인 모양을 모두 찾아 기호를 써 보세요.' % g7, [('㉠㉡㉢'[i], X.iso(Cc)) for i, Cc in enumerate(d['A7c'])], ka)]),
        ('%s(쌓기나무 %d개)에 쌓기나무 2개를 더 붙인 모양을 모두 찾아보세요.' % (n7, sum(map(sum, B7))),
         [_pick(_fig((X.iso(B7), n7)), '%s에 2개를 더 붙인 모양을 모두 찾아 기호를 써 보세요.' % n7, [('㉠㉡㉢㉣'[i], X.iso(Cc)) for i, Cc in enumerate(d['B7c'])], kb)]),
        ('찾은 모양 가운데 %s을 위, 앞, 옆에서 본 모양으로 나타내 보세요.' % '㉠㉡㉢㉣'[kb[0]],
         [_paint(pick_b, ['top', 'front', 'side'], show=_fig((X.iso(pick_b), '%s 모양' % '㉠㉡㉢㉣'[kb[0]])))]),
        ('%s에서 찾은 %s을 위에서 본 모양에 수를 쓴 것과 층별 모양으로 나타내 보세요.' % (g7, '㉠㉡㉢'[ka[0]]),
         [_nums(pick_a, show=_fig((X.iso(pick_a), '%s 모양' % '㉠㉡㉢'[ka[0]])), total=False),
          _paint(pick_a, ['L1', 'L2'])]),
        ('쌓기나무로 만든 모양을 나타내는 방법을 견주어 보세요.',
         [_quiz(('숨은 쌓기나무가 있어도 개수를 정확히 알 수 있는 방법을 모두 골라 보세요.', ['만든 모양 그림만 보기', '위에서 본 모양에 수 쓰기', '층별로 나타내기', '앞에서 본 모양만 보기'], [1, 2]),
                ('앞에서 본 모양을 가장 빨리 그릴 수 있는 방법은?', ['층별 모양의 칸 수 세기', '위에서 본 모양에 쓴 수에서 각 줄의 가장 큰 수 찾기'], 1))]),
    ]
    K1, K2 = d['card1'], d['card2']
    _uniq(X, K1, top=True)
    out['9'] = [
        ('놀이 방법 카드의 순서가 섞였어요. 차례대로 기호를 써 보세요. (문장을 바꾸어 썼어요.)',
         [{'t': 'sequence', 'cards': ['㉠ 모두가 만드는 역할을 한 번씩 맡으면 놀이를 마쳐요.',
                                      '㉡ 만드는 사람은 등을 돌리고, 다음 사람이 카드 한 장을 다른 두 사람에게만 보여 줘요.',
                                      '㉢ 만드는 사람은 세 사람이 그린 층별 모양만 보고 쌓기나무로 만들어요.',
                                      '㉣ 카드를 본 세 사람이 1층, 2층, 3층 모양을 하나씩 나누어 그려요.'], 'order': [1, 3, 2, 0], 'opts': {}}]),
        ('1번 카드는 만든 모양과 위에서 본 모양이에요. 1층, 2층, 3층 모양을 그려 보세요.',
         [_paint(K1, ['L1', 'L2', 'L3'], show=_fig((X.iso(K1), '쌓기나무로 만든 모양'), (X.top(K1), '위에서 본 모양')))]),
        ('2번 카드는 위에서 본 모양에 수를 쓴 카드예요. 층별 모양을 그려 보세요.',
         [_paint(K2, ['L1', 'L2', 'L3'], show=_fig((X.topnums(K2), '2번 카드')))]),
        ('짝과 함께 맞히기 놀이를 해요. 이번에는 쌓기나무 6개로 만들고, 위에서 본 모양만 보고 맞히면 3점, 위·앞을 보고 맞히면 2점, 위·앞·옆을 보고 맞히면 1점이에요. 12점을 먼저 모으면 이겨요.',
         [{'t': 'hardGame'}]),
        ('놀이를 하며 느낀 점을 정리해 보세요.',
         [_write(('위에서 본 모양만 보고 맞히기 어려웠던 까닭을 써 보세요.', '위에서 본 모양만으로는 각 자리에 몇 개씩 쌓았는지 알 수 없어서 여러 가지로 만들 수 있었기 때문이에요.'),
                 ('친구가 맞히기 쉽게 하려면 앞에서 본 모양을 그릴 때 무엇에 주의해야 하나요?', '각 줄에서 가장 높은 층의 수만큼 바닥부터 빈칸 없이 칠해야 해요.'))]),
    ]
    Ga, Gb, P10, N10, L10, S10 = d['g10a'], d['g10b'], d['p10'], d['n10'], d['l10'], d['s10']
    _uniq(X, Ga, top=True)
    glo, ghi = _range(X, Gb, top=True)
    _seen(X, P10)
    _seen(X, L10)
    _seen(X, N10)
    cands = [d['n10x'][0], N10, d['n10x'][1]]
    assert len({json.dumps(c) for c in cands}) == 3 and all(views(c)[0] == views(N10)[0] for c in cands)
    top10, front10, side10 = views(S10)
    assert all(sum(1 for y in range(len(S10)) if S10[y][x]) == 1 or front10[x] == 1 for x in range(len(S10[0])))
    out['10'] = [
        ('탁자 위에 왼쪽부터 꽃병, 시계, 액자를 한 줄로 놓았어요. 오른쪽에서 보면 가장 가까이 보이는 것은 무엇일까요?',
         [_ask((None, None, _P((['꽃병', '시계', '액자'], 2), '가 가장 가까이 보여요.')),
               (None, None, _P('뒤에서 보면 가장 왼쪽에 보이는 것은 ', (['꽃병', '시계', '액자'], 2), '예요.')))]),
        ('만든 모양과 위에서 본 모양을 보고 필요한 쌓기나무의 개수를 구해 보세요. (한 자리에 4개까지)',
         [_ask(('①', _fig((X.iso(Ga), '쌓기나무로 만든 모양'), (X.top(Ga), '위에서 본 모양')), _P(*_lay_parts(Ga))),
               ('②', _fig((X.iso(Gb), '쌓기나무로 만든 모양'), (X.top(Gb), '위에서 본 모양')), _P('가장 적으면 ', glo, '개, 가장 많으면 ', ghi, '개')))]),
        ('쌓기나무 %d개로 만든 모양이에요. 위, 앞, 옆에서 본 모양을 각각 그려 보세요. (숨은 쌓기나무는 없어요.)' % sum(map(sum, P10)),
         [_paint(P10, ['top', 'front', 'side'], show=_fig((X.iso(P10), '쌓기나무 %d개로 만든 모양' % sum(map(sum, P10)))))]),
        ('위에서 본 모양에 수를 쓴 것을 보고 어떤 모양인지 찾고, 만든 모양과 1층 모양을 보고 2층과 3층 모양을 그려 보세요.',
         [_chain(('4번', [_pick(_fig((X.topnums(N10), '위에서 본 모양에 수를 쓴 것')), '어느 모양을 위에서 보고 수를 쓴 것인가요?',
                                [('가', X.iso(cands[0])), ('나', X.iso(cands[1])), ('다', X.iso(cands[2]))], 1)]),
                 ('5번', [_paint(L10, ['L2', 'L3'], show=_fig((X.iso(L10), '만든 모양'), (X.layer(L10, 1), '1층 모양')))]))]),
        ('위와 앞에서 본 모양이에요. 위에서 본 모양에 수를 써 보고, 옆에서 본 모양을 그려 보세요.',
         [_chain(('위에서 본 모양에 수 쓰기', [_nums(S10, show=_fig((X.top(S10), '위에서 본 모양'), (X.front(S10), '앞에서 본 모양')), totalQ='쌓기나무는 모두')]),
                 ('옆에서 본 모양 그리기', [_paint(S10, ['side'])]))]),
    ]
    if v == 'st':
        out['10'].append(('이 단원에서 배운 것을 떠올리며 1차시에 궁금했던 것에 답해 보세요.',
                          [_write(('위, 앞, 옆에서 본 모양만으로는 개수를 하나로 정할 수 없을 때, 개수를 정확히 알려 주려면 어떻게 나타내면 좋을지 써 보세요.',
                                   '위에서 본 모양에 각 자리의 쌓기나무 수를 쓰거나 층별 모양으로 나타내면 숨은 쌓기나무까지 정확히 알 수 있어요.'))]))
    return out



def paper(t):
    for a, b in PAPER + (PAPER_ST if MODE['v'] == 'st' else []):
        t = t.replace(a, b)
    return t


def lesson(s, lv, L, story=None, hard=None):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if story:
        s.scene(None, story)
    out = []
    assert hard is None or len(hard) == len(L['steps']), ('도전형 새 문제 수가 계단 수와 달라요', L['no'])
    for i, st in enumerate(L['steps']):
        if MODE['v'] == 'st' and ' — ' in st['name']:       # 이야기 버전 계단 이름 '만져 보기 — 교문 둘러보기'
            s.step('%s %s' % (NUM[i], st['name'].split(' — ')[0]), st['name'].split(' — ', 1)[1])
        else:
            s.step('%s %s' % (NUM[i], st['name']))
        if hard:                                             # 도전형 ①~⑤는 새 문제
            s.text(hard[i][0])
            out.append(NUM[i] + ' ' + '; '.join(x for x in (render_rec(s, lv, r, st) for r in hard[i][1]) if x))
            continue
        inst = paper(st['inst'])
        s.text(inst.strip())
        if lv == '기본형' and st['hints'] and st['recs'][0]['t'] not in ('write', 'sp6Guess'):
            s.text('도움: ' + (paper(st['hints'][0]) if MODE['v'] == 'st' else st['hints'][0]))
        out.append(NUM[i] + ' ' + '; '.join(x for x in (render_rec(s, lv, r, st) for r in st['recs']) if x))
    if lv == '도전형':
        n = len(L['steps'])
        ch = L['challenge']
        if ch:
            s.step('%s 도전하기' % NUM[n])
            s.text(paper(ch['inst']))
            out.append(NUM[n] + ' ' + '; '.join(x for x in (render_rec(s, lv, r, ch) for r in ch['recs']) if x))
            n += 1
        q, a = (WHY if MODE['v'] == 'tb' else WHY_ST)[str(L['no'])]
        s.step('%s 까닭 쓰기' % NUM[n])
        s.ask(q, blank=False)
        s.lines(2)
        out.append(NUM[n] + ' ' + a)
    return '%s차시  ' % L['no'] + '   '.join(out)


def build(D, label, short, outdir, lv, ver='tb'):
    MODE['v'] = ver
    s = Sheet(unit_label=label, level=lv, grade_label='6학년')
    HARD = {}
    if lv == '도전형':
        X = _X(SRC_TB if ver == 'tb' else SRC_ST)
        hard_u3(X, ver)
        X.run()
        HARD = hard_u3(X, ver)
        assert set(HARD) == {str(L['no']) for L in D['lessons']}, sorted(HARD)
    if ver == 'tb':
        lines = [lesson(s, lv, L, hard=HARD.get(str(L['no']))) for L in D['lessons']]
        tail = '쌓기나무 그림은 지도서의 답이 그대로 나오도록 앱에서 새로 그린 모양입니다.'
    else:
        nos = [str(L['no']) for L in D['lessons']]
        assert nos == ST, ('이야기 버전 차시가 원본과 달라요', nos, ST)
        assert set(WHY_ST) == set(ST)
        story = D['story']['lines'][:2]
        lines = [lesson(s, lv, L, story if i == 0 else None, hard=HARD.get(str(L['no']))) for i, L in enumerate(D['lessons'])]
        tail = '쌓기나무 배치는 이야기 버전에서 새로 설계한 것으로, 앱과 같은 그림입니다. 글쓰기 칸의 답은 모범 답의 한 예입니다.'
    s.answers('【교사용】 3. 공간과 입체(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u3-space.html과 차시 번호가 같습니다. 수를 쓴 모양 [ ]은 뒷줄부터 앞줄 차례, 왼쪽부터이고 ‘-’는 빈자리, ■는 칠할 칸입니다. ' + tail)
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    want = [a for a in sys.argv[1:] if a in ('tb', 'st')] or ['tb', 'st']
    out = []
    try:
        if 'tb' in want:
            D = load(SRC_TB)
            for lv in ('기본형', '도전형'):
                out.append(build(D, '6-2 수학 3. 공간과 입체(교과서 차시)', '교과서 차시', OUT_TB, lv))
        if 'st' in want:
            if not os.path.exists(SRC_ST):
                print('[건너뜀] 이야기 버전 원본(u3-space.st.js)이 아직 없어요.')
            else:
                D = load(SRC_ST, 'st')
                for lv in ('기본형', '도전형'):
                    out.append(build(D, '6-2 수학 3. 공간과 입체(이야기 버전)', '이야기 버전', OUT_ST, lv, 'st'))
    finally:
        SHOT.close()
        shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob = check(p)
        bad += bool(prob)
        print(p, 'OK' if not prob else '\n  ' + '\n  '.join(prob))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
