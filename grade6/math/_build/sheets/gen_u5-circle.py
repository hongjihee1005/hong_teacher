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
    if (name === 'ci6String') { rec.counts = {}; for (const nm of ['정삼각형', '정사각형', '원']) { click(fb, nm); const say = findAll(fb, e => e.tag === 'p' && e.a.class === 'ci6read')[0].textContent; rec.counts[nm] = +say.match(/바둑돌이 (\d+)개/)[1]; rec.stones = rec.stones || {}; rec.stones[nm] = findAll(findSvg(fb), e => e.tag === 'circle' && e.a.fill === '#2B2B2B').map(e => [ci6R((e.a.cx - 198) / 22), ci6R((e.a.cy - 132) / 22)]); } }
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

import hashlib
import json
import math
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
SRC_TB = os.path.join(UNITS, 'u5-circle.tb.js')
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
NAME = '5단원_원의둘레와넓이_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨'
WORK = tempfile.mkdtemp(prefix='u5circ_')
K = 40            # 실제 크기: 1 cm = 40 px → 그림 너비 mm = px ÷ 4
PI = 3.14
ST = []           # 이야기 버전 차시(아직 없음 — 원본이 생기면 더함)

INK, BLUE, RED, GREEN, ORG, GRAY, GRID = '#1D2A2A', '#2B7BD6', '#D64545', '#2E8B57', '#E47A38', '#8795A1', '#B8C6D2'


def r4(v):
    return round(v * 10000) / 10000


def area(r):
    return r4(r * r * PI)


def fmt(v):
    if isinstance(v, float):
        v = r4(v)
        if v.is_integer():
            return str(int(v))
        return ('%.10g' % v)
    return str(v)


# ================================================================ 앱 읽기(node)
def load(src):
    js = os.path.join(WORK, 'ex.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(_EX)
    r = subprocess.run(['node', js, src, FONT], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-3000:])
    d = json.loads(r.stdout)
    for L in d['lessons']:
        for st in L['steps'] + ([L['challenge']] if L['challenge'] else []):
            for rec in st['recs']:
                assert rec['t'] != 'error' and not rec.get('err'), (L['no'], st.get('name'), rec)
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
    process.stdout.write('{"ok":1}\\n');
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


def vb_wh(svg):
    m = re.search(r'viewBox="([-\d.]+) ([-\d.]+) ([\d.]+) ([\d.]+)"', svg)
    return float(m.group(3)), float(m.group(4))


def pic(s, svg, mm):
    """앱 그림(줄여 넣기)"""
    w, _ = vb_wh(svg)
    s.picture(SHOT.png(svg, min(2400, max(900, mm * 9))), width_mm=mm)


def pic_real(s, svg):
    """실제 크기 그림: SVG 1 cm = 40 px → 너비 mm = px ÷ 4"""
    w, _ = vb_wh(svg)
    mm = w / 4
    assert mm <= 180, ('실제 크기 그림이 너무 넓어요', mm)
    s.picture(SHOT.png(svg, min(2600, w * 2.5)), width_mm=mm)


def em_mm(fig, default=120):
    m = re.match(r'([\d.]+)em', (fig or {}).get('maxW') or '')
    return min(160, round(float(m.group(1)) * 6)) if m else default


def _svg(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s">%s</svg>' % (fmt(float(w)), fmt(float(h)), body))


def _t(x, y, t, size=15, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" dominant-baseline="middle" font-family="%s" fill="%s" font-weight="%s">%s</text>'
            % (fmt(float(x)), fmt(float(y)), size, anchor, FONT.replace("'", '&apos;'), fill, weight, t))


def _ln(a, b, col=INK, w=2, dash=None):
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round"%s/>'
            % (fmt(float(a[0])), fmt(float(a[1])), fmt(float(b[0])), fmt(float(b[1])), col, w, ' stroke-dasharray="%s"' % dash if dash else ''))


def _poly(pts, fill='none', stroke=INK, w=2):
    return '<polygon points="%s" fill="%s" stroke="%s" stroke-width="%s"/>' % (' '.join('%s,%s' % (fmt(float(x)), fmt(float(y))) for x, y in pts), fill, stroke, w)


def _circ(c, r, fill='none', stroke=INK, w=2, dash=None):
    return ('<circle cx="%s" cy="%s" r="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>'
            % (fmt(float(c[0])), fmt(float(c[1])), fmt(float(r)), fill, stroke, w, ' stroke-dasharray="%s"' % dash if dash else ''))


# ================================================================ 실제 크기 그림
SR = 8 / 22        # 앱 ci6String의 바둑돌 반지름(cm)


def string_inside(shape, x, y, m=SR):
    """앱과 따로 계산: 바둑돌(반지름 m cm)이 끈 24 cm로 만든 도형 안에 통째로 들어가는지"""
    if shape == '정삼각형':
        a = 8
        hh = a * math.sqrt(3) / 2
        V = [(0, -hh * 2 / 3), (a / 2, hh / 3), (-a / 2, hh / 3)]
        for e in range(3):
            (x1, y1), (x2, y2) = V[e], V[(e + 1) % 3]
            if ((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)) / math.hypot(x2 - x1, y2 - y1) < m - 1e-3:
                return False
        return True
    if shape == '정사각형':
        return abs(x) <= 3 - m + 1e-3 and abs(y) <= 3 - m + 1e-3
    return math.hypot(x, y) <= 24 / (2 * math.pi) - m + 1e-3


def string_svg(shapes, stones):
    """끈 24 cm로 만든 도형과 앱이 놓은 바둑돌(실제 크기, 바둑돌 사이 1 cm)"""
    a = 8
    hh = a * math.sqrt(3) / 2
    rc = 24 / (2 * math.pi)
    box = {'정삼각형': (-4.3, -hh * 2 / 3 - .3, 4.3, hh / 3 + .3), '정사각형': (-3.3, -3.3, 3.3, 3.3), '원': (-rc - .3, -rc - .3, rc + .3, rc + .3)}
    gap, top = 0.6, 0.8
    W = sum(box[k][2] - box[k][0] for k in shapes) + gap * (len(shapes) - 1)
    H = max(box[k][3] - box[k][1] for k in shapes) + top
    b, x = [], 0.0
    for k in shapes:
        x0, y0, x1, y1 = box[k]
        ox, oy = x - x0, top - y0
        P = lambda p: ((ox + p[0]) * K, (oy + p[1]) * K)   # noqa: E731
        if k == '정삼각형':
            b.append(_poly([P((0, -hh * 2 / 3)), P((a / 2, hh / 3)), P((-a / 2, hh / 3))], 'none', RED, 3))
        elif k == '정사각형':
            b.append(_poly([P((-3, -3)), P((3, -3)), P((3, 3)), P((-3, 3))], 'none', RED, 3))
        else:
            b.append(_circ(P((0, 0)), rc * K, 'none', RED, 3))
        for q in stones[k]:
            assert string_inside(k, q[0], q[1]), (k, q)
            b.append(_circ(P(q), SR * K, '#2B2B2B', '#000', 1))
        b.append(_t(ox * K, 0.35 * K, k + ' (둘레 24 cm)', 15, INK, weight='bold'))
        x += (x1 - x0) + gap
    return _svg(W * K, H * K, ''.join(b))


def unroll_svg(C):
    """반지름 1 cm인 원(원 안 정육각형·원 밖 정사각형)과 cm 수직선, 원주(파란 선)는 앱처럼 굴린 결과를 그려 둠"""
    x0, W, H = 1.6 * K, 12.2 * K, 7.6 * K
    F = (10.4 * K, 1.4 * K)
    b = [_poly([(F[0] - K, F[1] - K), (F[0] + K, F[1] - K), (F[0] + K, F[1] + K), (F[0] - K, F[1] + K)], '#FDECEC', RED, 2.5),
         _circ(F, K, '#fff', BLUE, 2.5),
         _poly([(F[0] + K * math.cos(i * math.pi / 3), F[1] + K * math.sin(i * math.pi / 3)) for i in range(6)], '#E3F4EA', GREEN, 2.5),
         _ln(F, (F[0] + K, F[1]), INK, 1.6), _t(F[0] + K / 2, F[1] - 9, '1 cm', 11),
         _t(F[0], F[1] + K + 16, '반지름이 1 cm인 원', 12, GRAY)]
    rows = [(1.0, '원의 지름 (2 cm)', GRAY, 2), (2.1, '원주 (원을 한 바퀴 굴린 길이)', BLUE, C), (3.4, '정육각형의 둘레', GREEN, None), (4.7, '정사각형의 둘레', RED, None)]
    base = 6.0 * K
    for i in range(10):
        b.append(_ln((x0 + i * K, 0.6 * K), (x0 + i * K, base), '#DCE4E0', 1, '4 4'))
    for y, lab, col, L in rows:
        b.append(_t(x0, y * K - 14, lab, 13, col, 'start', 'bold'))
        if L:
            b.append(_ln((x0, y * K), (x0 + L * K, y * K), col, 7))
        else:
            b.append(_circ((x0, y * K), 4, col, 'none', 0))
            b.append(_ln((x0, y * K + 12), (x0 + 9 * K, y * K + 12), '#C9D3DA', 1, '2 4'))
    b.append(_ln((x0 - 6, base), (x0 + 9 * K + 6, base), INK, 2))
    for i in range(19):
        x = x0 + i * K / 2
        b.append(_ln((x, base), (x, base + (6 if i % 2 else 11)), INK, 1.5))
        if i % 2 == 0:
            b.append(_t(x, base + 24, str(i // 2), 13))
    b.append(_t(x0 - 30, base + 24, '(cm)', 11, GRAY))
    return _svg(W, H, ''.join(b))


def candle_svg(d):
    """앱 ci6ObjG('candle')를 실제 크기로: 위에서 본 양초"""
    r = d / 2 * K
    W = H = d * K + 1.2 * K
    c = (W / 2, H / 2)
    b = [_circ(c, r, '#FFF3D6', '#D9B36A', 3), _circ(c, r * .7, 'none', '#EAD3A0', 2), _circ(c, r * .12, '#5C3A1A', 'none', 0)]
    return _svg(W, H, ''.join(b))


def grid_svg(r, unit, T):
    """앱 ci6Grid와 같은 4등분한 한 조각(한 칸 = 1 cm, 실제 크기). T: 앱 ci6GridTruth(r)"""
    p = 0.9 * K
    S = r * K
    W, H = S + 2.2 * K, S + 2 * K
    x0, y0 = p, 0.7 * K
    b = []
    for i in range(r):
        for j in range(r):
            b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="1.4"/>'
                     % (fmt(x0 + i * K), fmt(y0 + S - (j + 1) * K), K, K, GRID))
    b.append('<path d="M%s,%s L%s,%s A%s,%s 0 0 0 %s,%s Z" fill="none" stroke="%s" stroke-width="3"/>'
             % (fmt(x0), fmt(y0 + S), fmt(x0 + S), fmt(y0 + S), S, S, fmt(x0), fmt(y0), INK))
    b.append(_circ((x0, y0 + S), 4, INK, 'none', 0))
    yy = y0 + S + 18
    b += [_ln((x0, yy), (x0 + S, yy), INK, 1.6), _ln((x0, yy - 6), (x0, yy + 6), INK, 1.6), _ln((x0 + S, yy - 6), (x0 + S, yy + 6), INK, 1.6),
          _t(x0 + S / 2, yy + 16, '반지름 %d %s' % (r, unit), 14),
          _t(x0 + S + 0.3 * K, y0 - 12, '1칸 = 1 %s×1 %s' % (unit, unit), 12, GRAY, 'end')]
    assert len(T) == r * r
    return _svg(W, H, ''.join(b))


def cutcircle_svg(R=4, n=16):
    """16등분한 원(반지름 4 cm, 실제 크기) — 위 반원 파랑, 아래 반원 주황(앱 ci6Cut과 같은 색)"""
    r = R * K
    W, H = 2 * r + 1.2 * K, 2 * r + 1.2 * K
    c = (W / 2, H / 2)
    b = []
    for i in range(n):
        a0, a1 = 2 * math.pi * i / n, 2 * math.pi * (i + 1) / n
        low = i < n // 2          # 아래쪽(y가 큰 쪽)
        p0 = (c[0] + r * math.cos(a0), c[1] + r * math.sin(a0))
        p1 = (c[0] + r * math.cos(a1), c[1] + r * math.sin(a1))
        b.append('<path d="M%s,%s L%s,%s A%s,%s 0 0 1 %s,%s Z" fill="%s" stroke="%s" stroke-width="1.6"/>'
                 % (fmt(c[0]), fmt(c[1]), fmt(p0[0]), fmt(p0[1]), fmt(r), fmt(r), fmt(p1[0]), fmt(p1[1]),
                    '#F7C9A5' if low else '#BFD9F2', '#C9744A' if low else '#3F79B5'))
    b.append(_circ(c, 3, INK, 'none', 0))
    return _svg(W, H, ''.join(b))


def cuts_svg(cuts):
    """앱 ci6Cut에서 '이어 붙이기'를 누른 뒤의 그림 넷(8·16·32·64등분)을 이어 붙인 부분만 2×2로"""
    cw, ch, gap, top = 410, 180, 20, 26
    b = []
    for i, n in enumerate(['8', '16', '32', '64']):
        x, y = (i % 2) * (cw + gap), (i // 2) * (ch + top + gap) + top
        inner = re.sub(r'^<svg[^>]*>', '', cuts[n])[:-6]
        b.append('<rect x="%s" y="%s" width="%s" height="%s" rx="10" fill="#fff" stroke="#C9D4CF" stroke-width="2"/>' % (x, y, cw, ch))
        b.append('<svg x="%s" y="%s" width="%s" height="%s" viewBox="232 48 410 %s">%s</svg>' % (x, y, cw, ch, ch, inner))
        b.append(_t(x + cw / 2, y - 13, '%s등분' % n, 17, INK, weight='bold'))
    return _svg(2 * cw + gap, 2 * (ch + top) + gap, ''.join(b))


def board_svg(GW=16, GH=12):
    """앱 ci6Land의 놀이판(16칸 × 12칸)을 실제 크기로(한 칸 = 1 cm)"""
    m = 0.5 * K
    W, H = GW * K + 2 * m, GH * K + 2 * m
    b = ['<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="2.5"/>' % (m, m, GW * K, GH * K, INK)]
    for i in range(1, GW):
        b.append(_ln((m + i * K, m), (m + i * K, m + GH * K), GRID, 1.2))
    for j in range(1, GH):
        b.append(_ln((m, m + j * K), (m + GW * K, m + j * K), GRID, 1.2))
    return _svg(W, H, ''.join(b))
