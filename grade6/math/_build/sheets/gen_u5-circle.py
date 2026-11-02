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
  - 이야기 버전(ST, `python3 gen_u5-circle.py st`)은 앱 원본 ../units/sem2/u5-circle.st.js('우리 반 둥근 쉼터 설계단', 11차시)를
    같은 방법(_EX_ST: _EX에 panes·thenWhy·ruleFirst·wonderRecall·writeStep 답을 더 모음)으로 읽어 sem2-soop/sheets/에 만듭니다.
    이야기 버전 그림: 1차시 도전(끈 28 cm로 만든 세 도형), 2차시 반지름 1.5 cm인 원과 cm 수직선, 3차시 컵 받침(지름 9 cm),
    5·6·10차시는 교과서 버전과 같은 실제 크기 그림. 기본형은 '왜 그럴까요?'·'먼저 예상해요'에 앱 도움의 문장 틀을 줍니다.
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
SRC_ST = os.path.join(UNITS, 'u5-circle.st.js')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')

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
def load(src, ex=None):
    js = os.path.join(WORK, 'ex.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(ex or _EX)
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
    cw, ch, gap, top = 400, 175, 20, 26
    b = []
    for i, n in enumerate(['8', '16', '32', '64']):
        x, y = (i % 2) * (cw + gap), (i // 2) * (ch + top + gap) + top
        inner = re.sub(r'^<svg[^>]*>', '', cuts[n])[:-6]
        b.append('<rect x="%s" y="%s" width="%s" height="%s" rx="10" fill="#fff" stroke="#C9D4CF" stroke-width="2"/>' % (x, y, cw, ch))
        b.append('<svg x="%s" y="%s" width="%s" height="%s" viewBox="205 50 320 140">%s</svg>' % (x, y, cw, ch, inner))
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
# ================================================================ 앱 물음 → 활동지
SYM = ('>', '=', '<', '÷', '×', '+', '−')


def blankable(p):
    """도전형에서 빈칸으로 바꿀 보기: 짧은 낱말 보기 셋 이상(기호·기호 보기·여러 개 고르기 제외)"""
    o = p['o']
    return (not p['multi'] and len(o) >= 3 and all(len(x) <= 5 for x in o)
            and not any(x in SYM or x[0] in '㉠㉡㉢' for x in o))


def right(p):
    if 'n' in p:
        return fmt(p['n'])
    if p['multi']:
        return ', '.join(p['o'][i] for i in p['a'])
    return p['o'][p['a']]


def is_long(p):
    return 'o' in p and (any(len(x) > 14 for x in p['o']) or p['multi'])


def sentence(parts, lv):
    """parts → (문장, 정답 목록, 긴 보기 목록)"""
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


def put_fig(s, fig, default=110):
    if not fig:
        return
    if fig.get('svg'):
        pic(s, fig['svg'], em_mm(fig, default))
    elif fig.get('table'):
        rows = fig['table']
        n = max(len(r) for r in rows)
        s.table(rows, header=True, header_col=rows[0][1] != '원주(cm)' and rows[1][0] in ('지름(cm)',), col_mm=[180 / n] * n, row_h=3118)
    elif fig.get('lines'):
        for t in fig['lines']:
            s.text(re.sub(r'^([^:]{1,6}):', r'\1: ', t))
    elif fig.get('text'):
        s.text(fig['text'])


def render_items(s, lv, items):
    """ci6Ask·blanks·ask 묶음 → 정답 글"""
    ans_all, buf = [], []

    def flush():
        if buf:
            s.fill(list(buf))
            buf.clear()
    for it in items:
        if it.get('fig') or it.get('q'):
            flush()
        put_fig(s, it.get('fig'))
        if it.get('q'):
            s.text(it['q'])
        sent, ans, longs = sentence(it['parts'] or [], lv)
        if longs and sent == '(        )':          # 물음 하나에 긴 보기
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
            s.text(it['q'])
            s.ask(opt_list(o))
            ans.append(', '.join(NUM[i] for i in a) if multi else NUM[a] + ' ' + o[a])
    return '; '.join(ans)


def render_write(s, lv, items):
    ans = []
    for it in items:
        s.ask(it['q'], blank=False)
        s.lines(2)
        ans.append('(자유) ' + it['ph'])
    return ' / '.join(ans)


def render_rec(s, lv, rec, st, D):
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
    if t == 'chain':
        out = []
        for k, part in enumerate(rec['parts']):
            if part['title']:
                s.text('⑴⑵⑶⑷'[k] + ' ' + re.sub(r'^[①②③]\s*', '', part['title']))
            out.append('⑴⑵⑶⑷'[k] + ' ' + '; '.join(render_rec(s, lv, r, None, D) for r in part['recs']))
        return ' '.join(out)
    return HANDLERS[t](s, lv, rec, st, D)


def ask_after(s, lv, rec, pre=''):
    a = render_items(s, lv, rec['ask']) if rec.get('ask') else ''
    return '; '.join(x for x in (pre, a) if x)


# ---------------------------------------------------------------- 조작 활동(종이에서 하는 말로)
def h_scene(s, lv, rec, st, D):
    s.text(st['inst'].replace('찾아 눌러 보세요', '찾아 ○표 해 보세요'))
    pic(s, rec['svg'], 150)
    src = open(SRC_TB, encoding='utf-8').read()
    found = re.findall(r'add\("([^"]+)", true', src[src.index('function ci6Scene'):src.index('function ci6String')])
    assert len(found) == 5, found
    s.ask('찾은 원 모양을 모두 써 보세요.', blank=False)
    s.lines(1)
    return ask_after(s, lv, rec, ', '.join(found))


def h_string(s, lv, rec, st, D):
    s.text(st['inst'].replace('세 도형을 모두 만들어 봐요.', '').strip())
    s.text('그림은 실제 크기예요. 바둑돌 사이는 1 cm예요. 도형마다 바둑돌의 수를 세어 보세요.')
    st_ = rec['stones']
    for nm in st_:
        assert len(st_[nm]) == rec['counts'][nm], (nm, len(st_[nm]), rec['counts'][nm])
    pic_real(s, string_svg(['정삼각형', '정사각형'], st_))
    pic_real(s, string_svg(['원'], st_))
    names = ['정삼각형', '정사각형', '원']
    s.table([names, ['(      )개'] * 3], header=True, col_mm=[60, 60, 60], row_h=3402)
    best = max(names, key=lambda n: rec['counts'][n])
    s.choices([('끈의 길이가 같을 때 바둑돌이 가장 많이 들어가는 도형', '( 정삼각형 / 정사각형 / 원 )'),
               ('둘레가 같을 때 넓이가 가장 넓은 도형', '( 정삼각형 / 정사각형 / 원 )')])
    return '%s; %s, %s' % (', '.join('%s %d개' % (n, rec['counts'][n]) for n in names), best, best)


def h_wheel(s, lv, rec, st, D):
    s.text(st['inst'].replace('표시해 보세요.', '그림에 표시해 보세요.'))
    pic(s, rec['svg'], 80)
    s.text('원의 중심은 점(•)으로, 지름은 선분으로, 둘레는 색연필로 한 바퀴 따라 그려요.')
    return ask_after(s, lv, rec, '중심·지름·둘레 표시')


def h_unroll(s, lv, rec, st, D):
    C = 2 * math.pi        # 반지름 1 cm인 원이 한 바퀴 굴러간 길이(앱 그림과 같음)
    s.text('반지름이 1 cm인 원이 있어요(그림은 실제 크기). 원 안에 꼭 맞는 정육각형(초록)과 원 밖에 꼭 맞는 정사각형(빨강)의 '
           '둘레를 수직선 위에 선으로 그어 원주와 비교해 보세요. 파란 선은 원을 한 바퀴 굴려 나타낸 원주예요.')
    pic_real(s, unroll_svg(C))
    if lv == '기본형':
        s.fill(['정육각형의 한 변은 반지름과 같은 (      ) cm  →  둘레 (      )×6 = (      ) cm',
                '정사각형의 한 변은 지름과 같은 (      ) cm  →  둘레 (      )×4 = (      ) cm'])
        pre = '정육각형 1 cm, 1×6=6 cm / 정사각형 2 cm, 2×4=8 cm (수직선에 6 cm, 8 cm 선)'
    else:
        s.fill('정육각형의 둘레: (      ) cm,   정사각형의 둘레: (      ) cm')
        pre = '6 cm, 8 cm (수직선에 6 cm, 8 cm 선)'
    return ask_after(s, lv, rec, pre)


def h_lab(s, lv, rec, st, D):
    items = rec['opt']['items']
    c0 = items[0]
    assert c0['d'] <= 15
    s.text('채안이와 현준이는 나무로 만든 집의 탁자 위에 있는 여러 가지 원 모양 물건의 원주와 지름을 재어 보았어요.')
    s.text('%s를 위에서 본 모양을 실제 크기로 그렸어요. 양쪽에 삼각자를 대어 지름을 재고, 둘레에 실을 감았다 펴서 원주를 재어 보세요.' % c0['name'])
    pic_real(s, candle_svg(c0['d']))
    s.fill('%s:  지름 (        ) cm,   원주 약 (        ) cm' % c0['name'])
    s.text('채안이와 현준이가 잰 결과예요.')
    s.table([['물건', '원주(cm)', '지름(cm)']] + [[it['name'], fmt(float(it['C'])), fmt(float(it['d']))] for it in items],
            header=True, col_mm=[60, 60, 60], row_h=3118)
    return ask_after(s, lv, rec, '%s 지름 %s cm, 원주 약 %s cm' % (c0['name'], fmt(float(c0['d'])), fmt(float(c0['C']))))


def h_roll(s, lv, rec, st, D):
    d = rec['opt']['d']
    s.text(st['inst'].replace(' 한 바퀴 굴려 보세요.', ' 한 바퀴 굴린다고 생각해 보세요.'))
    pic(s, rec['svg'], 150)
    s.text('빨간 점이 다시 땅에 닿으면 한 바퀴예요. 그림의 눈금(m)으로 한 바퀴 굴러간 거리를 어림해 보세요.')
    s.choices([('바퀴가 한 바퀴 굴러간 거리(원주)에는 지름 %d m가' % d, '( 2번 / 3번 / 4번 ) 들어가고 조금 남아요')])
    assert 3 * d < d * math.pi < 4 * d
    return ask_after(s, lv, rec, '3번')


def h_diam(s, lv, rec, st, D):
    C = rec['opt']['C']
    dd = round(C / PI)
    assert abs(r4(dd * PI) - C) < 1e-9
    ds = [dd - 2, dd - 1, dd, dd + 1]
    s.text('물레방아 옆에 단면이 원 모양인 기둥이 있어요. 기둥의 단면의 원주는 %s cm예요. 지름을 바꾸어 원주를 구해 보고, 단면의 원주와 같아지는 지름을 찾아보세요.' % fmt(C))
    pic(s, rec['svg'], 70)
    s.table([['지름(cm)'] + [str(x) for x in ds], ['원주(cm)'] + ['(        )'] * 4], header=False, header_col=True,
            col_mm=[36, 36, 36, 36, 36], row_h=3402)
    pre = '표 ' + ', '.join('%d→%s' % (x, fmt(r4(x * PI))) for x in ds) + ' (지름 %d cm)' % dd
    return ask_after(s, lv, rec, pre)


def h_inout(s, lv, rec, st, D):
    s.text(st['inst'].replace('원 위의 점 4개를 눌러 원 안에 꼭 맞는 정사각형을 그려 보세요.',
                              '원 위의 점 4개를 이어 원 안에 꼭 맞는 정사각형(초록)을 그리고, 원 밖에 꼭 맞는 정사각형(빨강)도 그려 보세요.'))
    pic(s, rec['svg'], 72)
    return ask_after(s, lv, rec, '정사각형 그리기')


def h_grid(s, lv, rec, st, D):
    r, unit = rec['opt']['r'], rec['opt']['unit']
    g = D['calc']['grid'][str(r)]
    s.text(st['inst'].replace('칠해 보세요', '색연필로 칠해 보세요') if st else
           '원을 4등분한 한 조각이에요. 원 안에 완전히 들어간 칸은 초록, 원이 걸친 칸은 주황으로 칠해 보세요.')
    s.text('모눈 한 칸은 1 cm예요(실제 크기%s).' % (', 1칸이 1 m×1 m를 나타내요' if unit == 'm' else ''))
    pic_real(s, grid_svg(r, unit, g['T']))
    # 앱과 따로 칸 세기: 칸 전체가 원 안(먼 꼭짓점이 원 안·위) / 원이 칸을 지나감
    gg = sum(1 for i in range(r) for j in range(r) if (i + 1) ** 2 + (j + 1) ** 2 <= r * r)
    aa = sum(1 for i in range(r) for j in range(r) if i * i + j * j < r * r)
    assert (gg, aa) == (g['g'], g['all']), (r, gg, aa, g)
    return ask_after(s, lv, rec, '초록 %d칸, 주황 %d칸' % (g['g'], g['all'] - g['g']))


def h_cut(s, lv, rec, st, D):
    if not rec['opt'].get('labels'):
        s.text('원의 넓이를 어떻게 구하면 좋을지 생각해 보아요. 원을 잘게 잘라 위아래로 번갈아 이어 붙여 볼 거예요.')
        s.ask('이어 붙이기 전에 어떤 도형이 될지 먼저 예상해 보세요.', blank=False)
        s.lines(1)
        s.text('아래 원(실제 크기, 반지름 4 cm)은 16등분되어 있어요. 선을 따라 오려 주황 조각과 파란 조각을 위아래로 번갈아 공책에 이어 붙여 보세요.')
        pic_real(s, cutcircle_svg(4, 16))
        s.fill('이어 붙인 모양의 가로는 약 (        ) cm, 세로는 약 (        ) cm예요. (자로 재어 보세요.)')
        s.text('원을 8등분, 16등분, 32등분, 64등분하여 이어 붙인 모양이에요.')
        pic(s, cuts_svg(rec['cuts']), 160)
        half = r4(4 * 2 * PI / 2)
        return ask_after(s, lv, rec, '(예상 자유) 가로 약 12.5 cm(원주의 ½ = %s cm), 세로 4 cm' % fmt(half))
    s.text(st['inst'])
    pic(s, rec['cuts']['32'], 150)
    return ask_after(s, lv, rec)


def h_move(s, lv, rec, st, D):
    s.text(st['inst'])
    s.text('종이에서는 옮긴 모양을 그림에 그려 넣어 보세요.')
    pic(s, rec['svg'], em_mm({'maxW': rec['opt'].get('maxW')}, 130))
    return ask_after(s, lv, rec)


def h_make(s, lv, rec, st, D):
    s.text(st['inst'])
    out = []
    for it in rec['opt']['items']:
        r = it['d'] / 2
        s.text('내가 찾은 %s의 지름은 %s cm입니다. 이 물건의 넓이는 몇 cm²인가요? (원주율 3.14)' % (it['name'], fmt(float(it['d']))))
        s.fill('반지름 (        ) cm   →   넓이 (        )×(        )×3.14 = (            ) cm²')
        out.append('%s 반지름 %s cm, %s cm²' % (it['name'], fmt(float(r)), fmt(area(r))))
    s.text('내가 찾은 물건으로 문제를 만들고 풀어 보세요.')
    s.fill(['내가 찾은 (            )의 지름은 (        ) cm입니다. 이 물건의 넓이는 몇 cm²인가요?',
            '풀이:                                            답: (            ) cm²'])
    return '; '.join(out) + '; (자유) (지름÷2)×(지름÷2)×3.14'


def h_land(s, lv, rec, st, D):
    s.text('짝과 함께 놀이해 보세요(파랑과 빨강). 주사위를 굴려 나온 눈의 수를 반지름(cm)으로 하는 원의 넓이를 구하고, 맞으면 아래 모눈종이에 '
           '컴퍼스로 원을 그린 뒤 원 안에 넓이를 써요. 원의 중심은 모눈의 점에 놓아요. 원이 모눈종이 밖으로 나가거나 다른 원과 겹치면 안 돼요(한 점에서 만나는 것은 돼요).')
    s.text('모눈종이는 실제 크기예요(한 칸 = 1 cm, 가로 16 cm, 세로 12 cm).')
    pic_real(s, board_svg(16, 12))
    rows = [['차례', '파랑 반지름(cm)', '파랑 넓이(cm²)', '빨강 반지름(cm)', '빨강 넓이(cm²)']]
    rows += [[str(i + 1), '', '', '', ''] for i in range(6)] + [['합계', '', '', '', '']]
    s.table(rows, header=True, col_mm=[20, 40, 40, 40, 40], row_h=2835)
    return '(놀이) 넓이 = (눈의 수)×(눈의 수)×3.14'


HANDLERS = {'ci6Scene': h_scene, 'ci6String': h_string, 'ci6Wheel': h_wheel, 'ci6Unroll': h_unroll, 'ci6Lab': h_lab,
            'ci6Roll': h_roll, 'ci6Diam': h_diam, 'ci6InOut': h_inout, 'ci6Grid': h_grid, 'ci6Cut': h_cut,
            'ci6Move': h_move, 'ci6Make': h_make, 'ci6Land': h_land}
INTERACTIVE = set(HANDLERS) - {'ci6Make'}

PAPER = [(' 피자를 끌어 겹쳐 보아도 돼요.', '')]

WHY = {
    '1': ('원의 둘레와 원의 넓이를 구하는 방법을 하나씩 써 보세요.', '둘레는 끈을 감아 잰 뒤 끈의 길이를 재요. 넓이는 원을 다각형으로 바꾸어 생각해요.'),
    '2': ('원주가 지름의 3배보다 길고 4배보다 짧은 까닭을 정육각형과 정사각형을 이용하여 써 보세요.',
          '원 안의 정육각형의 둘레는 지름의 3배, 원 밖의 정사각형의 둘레는 지름의 4배인데 원주는 그 사이에 있기 때문이에요.'),
    '3': ('원주율을 3.14처럼 어림하여 사용하는 까닭을 써 보세요.', '원주율은 3.1415926…처럼 끝없이 계속되는 소수이기 때문이에요.'),
    '4': ('지름을 알 때 원주를, 원주를 알 때 지름을 구하는 방법을 써 보세요.', '(원주)=(지름)×(원주율), (지름)=(원주)÷(원주율)'),
    '5': ('모눈으로 원의 넓이를 어림할 때 어림한 값이 조금씩 다를 수 있는 까닭을 써 보세요.', '원이 걸친 칸을 세느냐 세지 않느냐에 따라 달라지기 때문이에요.'),
    '6': ('(원의 넓이)=(반지름)×(반지름)×(원주율)인 까닭을 원을 잘라 이어 붙인 직사각형으로 설명해 보세요.',
          '직사각형의 가로는 (원주)×½=(반지름)×(원주율), 세로는 반지름이므로 넓이는 (반지름)×(반지름)×(원주율)이에요.'),
    '7': ('색칠한 부분의 넓이를 구할 때 쓴 방법(빼기·옮기기·나누기·합치기) 중 하나를 골라 어떻게 했는지 써 보세요.',
          '(예) 정사각형의 넓이에서 네 모서리의 흰 부분을 합친 원의 넓이를 뺐어요.'),
    '8~9': ('지름이 2배가 되면 원의 넓이는 몇 배가 되는지 까닭과 함께 써 보세요.', '반지름도 2배가 되므로 넓이는 2×2=4(배)가 돼요.'),
    '10': ('땅을 더 넓게 차지하려면 원을 어디에 그리면 좋을지 까닭과 함께 써 보세요.', '(예) 큰 원이 들어갈 넓은 자리를 남겨 두고 작은 원은 구석에 그려요.'),
    '11': ('원주가 251.2 cm인 탁자의 넓이를 구한 과정을 차례대로 써 보세요.', '지름 251.2÷3.14=80 (cm) → 반지름 40 cm → 40×40×3.14=5024 (cm²)'),
}


def has_num(recs):
    for r in recs:
        for it in r.get('items', []) + r.get('ask', []):
            if any('n' in p for p in (it.get('parts') or [])):
                return True
        for part in r.get('parts', []) if r['t'] == 'chain' else []:
            if has_num(part['recs']):
                return True
    return False


def lesson(s, lv, L, D, hard=None):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    out = []
    assert hard is None or len(hard) == len(L['steps']), ('도전형 새 문제 수가 계단 수와 달라요', L['no'])
    for i, st in enumerate(L['steps']):
        s.step('%s %s' % (NUM[i], st['name']))
        if hard:                                         # 도전형 ①~⑤는 새 문제
            s.text(hard[i][0])
            out.append(NUM[i] + ' ' + '; '.join(render_rec(s, lv, r, st, D) for r in hard[i][1]))
            continue
        rec0 = st['recs'][0]
        if rec0['t'] not in INTERACTIVE and rec0['t'] != 'ci6Make':
            inst = st['inst']
            for a, b in PAPER:
                inst = inst.replace(a, b)
            s.text(inst)
        if lv == '기본형' and st['hints'] and has_num(st['recs']) and rec0['t'] not in INTERACTIVE:
            s.text('도움: ' + st['hints'][0])
        out.append(NUM[i] + ' ' + '; '.join(render_rec(s, lv, r, st, D) for r in st['recs']))
    if lv == '도전형':
        n = len(L['steps'])
        ch = L['challenge']
        if ch:
            s.step('%s 도전하기' % NUM[n])
            if ch['recs'][0]['t'] not in INTERACTIVE:
                s.text(ch['inst'])
            out.append(NUM[n] + ' ' + '; '.join(render_rec(s, lv, r, ch, D) for r in ch['recs']))
            n += 1
        q, a = WHY[str(L['no'])]
        s.step('%s 까닭 쓰기' % NUM[n])
        s.ask(q, blank=False)
        s.lines(2)
        out.append(NUM[n] + ' ' + a)
    return '%s차시  ' % L['no'] + '   '.join(out)


def build(D, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='6학년')
    HL = hard_u5('tb') if lv == '도전형' else None
    assert HL is None or len(HL) == len(D['lessons'])
    lines = [lesson(s, lv, L, D, HL[k] if HL else None) for k, L in enumerate(D['lessons'])]
    s.answers('【교사용】 5. 원의 둘레와 넓이(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u5-circle.html과 차시 번호가 같습니다. 원주율은 3.14로 계산합니다. 실제 크기 그림(양초·모눈·16등분한 원·놀이판 등)은 100%로 인쇄하세요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


# ================================================================ 이야기 버전(ST) — u5-circle.st.js
def _make_ex_st():
    """_EX(교과서 버전 읽기)를 고쳐 이야기 버전 엔진의 부품(panes·thenWhy·ruleFirst·wonderRecall)도 모읍니다."""
    ex = _EX
    rep = [
        ("function writeStep(b, a, items, opts) { if (!INNER) REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag, ph: x.ph })) }); }",
         "function writeStep(b, a, items, opts) { if (!INNER) REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag, ph: x.ph, help: x.help || [], ans: x.ans || '' })) }); }\n"
         "const clearTimeout = () => {};\n"
         "function autoRun() { return () => false; }\n"
         "function panes(b, a, items, opts) { if (!INNER) REC.push({ t: 'panes', items: items.map(x => ({ t: x.t, ph: x.ph, hint: x.hint || '', ex: x.ex || [] })) }); }\n"
         "const _wo = o => ({ q: o.q, ph: o.ph, help: o.help || [], ans: o.ans || '' });\n"
         "function thenWhy(f, o) { return function (b, a) { f(b, a); if (!INNER) REC.push({ t: 'thenWhy', o: _wo(o) }); }; }\n"
         "function ruleFirst(f, o) { return function (b, a) { if (!INNER) REC.push({ t: 'ruleFirst', o: _wo(o) }); f(b, a); }; }\n"
         "function wonderRecall(f) { return function (b, a) { if (!INNER) REC.push({ t: 'wonderRecall' }); f(b, a); }; }"),
        ("OUT.calc = { grid: Object.fromEntries([4, 5, 7].map(", "OUT.calc = { grid: Object.fromEntries([3, 4, 5, 6, 7].map("),
        ("function cap(render) { REC = []; try { render(new El('div'), api); } catch (e) { REC.push({ t: 'error', err: String(e.stack || e).slice(0, 400) }); } return REC; }",
         "let ROOTFIG = [];\n"
         "function cap(render) { REC = []; const root = new El('div'); try { render(root, api); } catch (e) { REC.push({ t: 'error', err: String(e.stack || e).slice(0, 400) }); }"
         " ROOTFIG = findTag(root, 'svg').map(String); return REC; }"),
        ("steps: L.steps.map(s => ({ name: s.name, inst: s.inst, hints: s.hints || [], recs: cap(s.render) })),",
         "steps: L.steps.map(s => { const recs = cap(s.render); return { name: s.name, inst: s.inst, hints: s.hints || [], recs, figs: ROOTFIG }; }),"),
    ]
    for a, b in rep:
        assert ex.count(a) == 1, a[:60]
        ex = ex.replace(a, b)
    return ex.replace('앱 원본(u5-circle.tb.js)', '앱 원본(u5-circle.st.js)')


_EX_ST = _make_ex_st()

# 종이에서 하는 말로 바꾸기(이야기 버전 단계 안내)
PAPER_ST = [
    ('그림에서 원 모양을 모두 찾아 눌러 보세요.', '그림에서 원 모양을 모두 찾아 ○표 해 보세요.'),
    ('원의 중심, 지름, 둘레를 차례로 표시해 보세요.', '원의 중심, 지름, 둘레를 차례로 그림에 표시해 보세요.'),
    ('먼저 원을 한 바퀴 굴려 원주를 수직선에 나타내고, 원 안에 꼭 맞는 정육각형(초록)과 원 밖에 꼭 맞는 정사각형(빨강)의 둘레를 막대로 늘여 원주와 비교해 보세요.',
     '원을 한 바퀴 굴린 원주는 수직선에 파란 선으로 나타냈어요. 원 안에 꼭 맞는 정육각형(초록)과 원 밖에 꼭 맞는 정사각형(빨강)의 둘레를 수직선 위에 선으로 그어 원주와 비교해 보세요.'),
    ('바퀴를 끌어 한 바퀴 굴려 보세요.', '바퀴를 한 바퀴 굴린다고 생각해 보세요.'),
    ('막대를 움직여 지름을 바꾸어 보며 둘레가 141.3 cm가 되는 지름을 찾아보세요.', '지름을 바꾸어 둘레를 구해 보며 둘레가 141.3 cm가 되는 지름을 찾아보세요.'),
    ('원 위의 점 4개를 눌러 원 안에 꼭 맞는 정사각형을 그려 보세요.', '원 위의 점 4개를 이어 원 안에 꼭 맞는 정사각형(초록)을 그리고, 원 밖에 꼭 맞는 정사각형(빨강)도 그려 보세요.'),
    ('원이 걸친 칸은 주황으로 칠해 보세요.', '원이 걸친 칸은 주황으로 색연필로 칠해 보세요.'),
    (' (세 가지 이상 해 봐요.)', ''),
    ('분수(작은 원)를 끌어 오른쪽 점선 자리로 옮겨 보세요.', '분수(작은 원)를 오른쪽 점선 자리로 옮긴다고 생각해 보세요.'),
    ('왼쪽 아래에 붙은 작은 반원을 끌어 오른쪽의 빈 곳(점선)에 넣어 보세요.', '왼쪽 아래에 붙은 작은 반원을 오른쪽의 빈 곳(점선)으로 옮겨 그려 보세요.'),
    ('네 모서리의 색칠하지 않은 부분(흰 부분)을 끌어 오른쪽 점선 원에 모아 보세요.', '네 모서리의 색칠하지 않은 부분(흰 부분)을 오른쪽 점선 원에 모아 그려 보세요.'),
    (' 피자를 끌어 겹쳐 보아도 돼요.', ''),
    ('맞으면 모눈의 점을 눌러 원의 중심을 정해요.', '맞으면 아래 모눈종이에 컴퍼스로 원을 그리고 원 안에 넓이를 써요(원의 중심은 모눈의 점에 놓아요).'),
    (' 세 도형을 모두 만들어 봐요.', ''),
]


def paper_st(t):
    for a, b in PAPER_ST:
        t = t.replace(a, b)
    return t


def string_inside_p(P, shape, x, y, m=SR):
    """앱과 따로 계산: 바둑돌(반지름 m cm)이 끈 P cm로 만든 도형 안에 통째로 들어가는지"""
    if shape == '정삼각형':
        a = P / 3
        hh = a * math.sqrt(3) / 2
        V = [(0, -hh * 2 / 3), (a / 2, hh / 3), (-a / 2, hh / 3)]
        for e in range(3):
            (x1, y1), (x2, y2) = V[e], V[(e + 1) % 3]
            if ((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)) / math.hypot(x2 - x1, y2 - y1) < m - 1e-3:
                return False
        return True
    if shape == '정사각형':
        return abs(x) <= P / 8 - m + 1e-3 and abs(y) <= P / 8 - m + 1e-3
    return math.hypot(x, y) <= P / (2 * math.pi) - m + 1e-3


def string_svg_p(P, shapes, stones):
    """끈 P cm로 만든 도형과 앱이 놓은 바둑돌(실제 크기, 바둑돌 사이 1 cm)"""
    a = P / 3
    hh = a * math.sqrt(3) / 2
    rc = P / (2 * math.pi)
    q = P / 8
    box = {'정삼각형': (-a / 2 - .3, -hh * 2 / 3 - .3, a / 2 + .3, hh / 3 + .3), '정사각형': (-q - .3, -q - .3, q + .3, q + .3),
           '원': (-rc - .3, -rc - .3, rc + .3, rc + .3)}
    gap, top = 0.3, 0.8
    W = sum(box[k][2] - box[k][0] for k in shapes) + gap * (len(shapes) - 1)
    H = max(box[k][3] - box[k][1] for k in shapes) + top
    b, x = [], 0.0
    for k in shapes:
        x0, y0, x1, y1 = box[k]
        ox, oy = x - x0, top - y0
        Pt = lambda p: ((ox + p[0]) * K, (oy + p[1]) * K)   # noqa: E731
        if k == '정삼각형':
            b.append(_poly([Pt((0, -hh * 2 / 3)), Pt((a / 2, hh / 3)), Pt((-a / 2, hh / 3))], 'none', RED, 3))
        elif k == '정사각형':
            b.append(_poly([Pt((-q, -q)), Pt((q, -q)), Pt((q, q)), Pt((-q, q))], 'none', RED, 3))
        else:
            b.append(_circ(Pt((0, 0)), rc * K, 'none', RED, 3))
        for p in stones[k]:
            assert string_inside_p(P, k, p[0], p[1]), (k, p)
            b.append(_circ(Pt(p), SR * K, '#2B2B2B', '#000', 1))
        b.append(_t(ox * K, 0.35 * K, '%s (둘레 %s cm)' % (k, fmt(P)), 15, INK, weight='bold'))
        x += (x1 - x0) + gap
    return _svg(W * K, H * K, ''.join(b))


def unroll_svg_r(r):
    """반지름 r cm인 원(원 안 정육각형·원 밖 정사각형, 실제 크기)과 cm 수직선. 원주(파란 선)는 원을 한 바퀴 굴린 길이"""
    N = math.ceil(8 * r) + 1                    # 앱 ci6Unroll과 같은 수직선 길이(cm)
    x0 = 1.0 * K
    W = x0 + N * K + 0.8 * K
    R = r * K
    F = (W - R - 0.5 * K, 0.4 * K + R)
    b = [_poly([(F[0] - R, F[1] - R), (F[0] + R, F[1] - R), (F[0] + R, F[1] + R), (F[0] - R, F[1] + R)], '#FDECEC', RED, 2.5),
         _circ(F, R, '#fff', BLUE, 2.5),
         _poly([(F[0] + R * math.cos(i * math.pi / 3), F[1] + R * math.sin(i * math.pi / 3)) for i in range(6)], '#E3F4EA', GREEN, 2.5),
         _ln(F, (F[0] + R, F[1]), INK, 1.6), _t(F[0] + R / 2, F[1] - 9, '%s cm' % fmt(r), 11),
         _t(F[0], F[1] + R + 16, '반지름이 %s cm인 원' % fmt(r), 12, GRAY)]
    C = 2 * math.pi * r
    assert x0 + C * K < F[0] - R - 6, '원주 선이 그림과 겹쳐요'
    top = F[1] + R + 1.0 * K
    rows = [(1.0 * K, '원의 지름 (%s cm)' % fmt(2 * r), GRAY, 2 * r), (2.1 * K, '원주 (원을 한 바퀴 굴린 길이)', BLUE, C),
            (top + 0.3 * K, '정육각형의 둘레', GREEN, None), (top + 1.6 * K, '정사각형의 둘레', RED, None)]
    base = top + 2.9 * K
    H = base + 1.2 * K
    for i in range(N + 1):
        xi = x0 + i * K
        y_top = F[1] + R + 26 if xi >= F[0] - R - 4 else 0.6 * K      # 원 그림 아래부터(그림과 겹치지 않게)
        b.append(_ln((xi, y_top), (xi, base), '#DCE4E0', 1, '4 4'))
    for y, lab, col, L in rows:
        b.append(_t(x0, y - 14, lab, 13, col, 'start', 'bold'))
        if L:
            b.append(_ln((x0, y), (x0 + L * K, y), col, 7))
        else:
            b.append(_circ((x0, y), 4, col, 'none', 0))
            b.append(_ln((x0, y + 12), (x0 + N * K, y + 12), '#C9D3DA', 1, '2 4'))
    b.append(_ln((x0 - 6, base), (x0 + N * K + 6, base), INK, 2))
    for i in range(2 * N + 1):
        x = x0 + i * K / 2
        b.append(_ln((x, base), (x, base + (6 if i % 2 else 11)), INK, 1.5))
        if i % 2 == 0:
            b.append(_t(x, base + 24, str(i // 2), 13))
    b.append(_t(x0 - 22, base + 24, '(cm)', 10, GRAY))
    return _svg(W, H, ''.join(b))


def coaster_svg(d):
    """앱 ci6ObjG('coaster')를 실제 크기로: 위에서 본 컵 받침"""
    r = d / 2 * K
    W = H = d * K + 1.2 * K
    c = (W / 2, H / 2)
    b = [_circ(c, r, '#CFE8C9', '#5E9A55', 3), _circ(c, r * .6, 'none', '#8CC084', 2, '4 3')]
    return _svg(W, H, ''.join(b))


def hs_scene(s, lv, rec, st, D):
    pic(s, rec['svg'], 150)
    src = open(SRC_ST, encoding='utf-8').read()
    found = re.findall(r'add\("([^"]+)", true', src[src.index('function ci6Scene'):src.index('function ci6String')])
    assert len(found) == 5, found
    s.ask('찾은 원 모양을 모두 써 보세요.', blank=False)
    s.lines(1)
    return ask_after(s, lv, rec, ', '.join(found))


def hs_string(s, lv, rec, st, D):
    P = rec['opt'].get('P', 24)
    s.text('그림은 실제 크기예요. 끈 %s cm로 만든 세 도형 안에 바둑돌을 1 cm 간격으로 넣었어요. 도형마다 바둑돌의 수를 세어 보세요.' % fmt(P))
    st_ = rec['stones']
    for nm in st_:
        assert len(st_[nm]) == rec['counts'][nm], (nm, len(st_[nm]), rec['counts'][nm])
    pic_real(s, string_svg_p(P, ['정삼각형', '정사각형'], st_))
    pic_real(s, string_svg_p(P, ['원'], st_))
    names = ['정삼각형', '정사각형', '원']
    s.table([names, ['(      )개'] * 3], header=True, col_mm=[60, 60, 60], row_h=3402)
    best = max(names, key=lambda n: rec['counts'][n])
    s.choices([('끈의 길이가 같을 때 바둑돌이 가장 많이 들어가는 도형', '( 정삼각형 / 정사각형 / 원 )'),
               ('둘레가 같을 때 넓이가 가장 넓은 도형', '( 정삼각형 / 정사각형 / 원 )')])
    return '%s; %s, %s' % (', '.join('%s %d개' % (n, rec['counts'][n]) for n in names), best, best)


def hs_wheel(s, lv, rec, st, D):
    pic(s, rec['svg'], 80)
    s.text('원의 중심은 점(•)으로, 지름은 선분으로 그리고, 보호 띠를 두를 둘레는 색연필로 한 바퀴 따라 그려요.')
    return ask_after(s, lv, rec, '중심·지름·둘레 표시')


def hs_unroll(s, lv, rec, st, D):
    r = rec['opt'].get('r', 1)
    s.text('그림은 실제 크기예요. 파란 선은 반지름이 %s cm인 원을 한 바퀴 굴려 나타낸 원주예요.' % fmt(r))
    pic_real(s, unroll_svg_r(r))
    hx, sq = r4(6 * r), r4(8 * r)
    if lv == '기본형':
        s.fill(['정육각형의 한 변은 반지름과 같은 (      ) cm  →  둘레 (      )×6 = (      ) cm',
                '정사각형의 한 변은 지름과 같은 (      ) cm  →  둘레 (      )×4 = (      ) cm'])
        pre = '정육각형 %s cm, %s×6=%s cm / 정사각형 %s cm, %s×4=%s cm (수직선에 %s cm, %s cm 선)' % (
            fmt(r), fmt(r), fmt(hx), fmt(2 * r), fmt(2 * r), fmt(sq), fmt(hx), fmt(sq))
    else:
        s.fill('정육각형의 둘레: (      ) cm,   정사각형의 둘레: (      ) cm')
        pre = '%s cm, %s cm (수직선에 %s cm, %s cm 선)' % (fmt(hx), fmt(sq), fmt(hx), fmt(sq))
    return ask_after(s, lv, rec, pre)


def hs_lab(s, lv, rec, st, D):
    items = rec['opt']['items']
    c0 = items[0]
    assert c0['d'] <= 15
    nm = c0['name']
    s.text('%s%s 위에서 본 모양을 실제 크기로 그렸어요.' % (nm, '을' if (ord(nm[-1]) - 0xAC00) % 28 else '를'))
    pic_real(s, coaster_svg(c0['d']))
    s.fill('%s:  지름 (        ) cm,   원주 약 (        ) cm' % c0['name'])
    s.text('도윤이가 잰 결과예요.')
    s.table([['물건', '원주(cm)', '지름(cm)']] + [[it['name'], fmt(float(it['C'])), fmt(float(it['d']))] for it in items],
            header=True, col_mm=[60, 60, 60], row_h=3118)
    return ask_after(s, lv, rec, '%s 지름 %s cm, 원주 약 %s cm' % (c0['name'], fmt(float(c0['d'])), fmt(float(c0['C']))))


def hs_roll(s, lv, rec, st, D):
    d, u = rec['opt']['d'], rec['opt'].get('unit', 'cm')
    pic(s, rec['svg'], 150)
    s.text('빨간 점이 다시 땅에 닿으면 한 바퀴예요. 그림의 눈금(%s)으로 한 바퀴 굴러간 거리를 어림해 보세요.' % u)
    s.choices([('바퀴가 한 바퀴 굴러간 거리(원주)에는 지름 %s %s가' % (fmt(d), u), '( 2번 / 3번 / 4번 ) 들어가고 조금 남아요')])
    assert 3 * d < d * math.pi < 4 * d
    return ask_after(s, lv, rec, '3번')


def hs_diam(s, lv, rec, st, D):
    C = rec['opt']['C']
    dd = round(C / PI)
    assert abs(r4(dd * PI) - C) < 1e-9
    ds = [dd - 2, dd - 1, dd, dd + 1]
    pic(s, rec['svg'], 70)
    s.table([['지름(cm)'] + [str(x) for x in ds], ['원주(cm)'] + ['(        )'] * 4], header=False, header_col=True,
            col_mm=[36, 36, 36, 36, 36], row_h=3402)
    pre = '표 ' + ', '.join('%d→%s' % (x, fmt(r4(x * PI))) for x in ds) + ' (지름 %d cm)' % dd
    return ask_after(s, lv, rec, pre)


def hs_inout(s, lv, rec, st, D):
    pic(s, rec['svg'], 72)
    return ask_after(s, lv, rec, '정사각형 그리기')


def hs_grid(s, lv, rec, st, D):
    r, unit = rec['opt']['r'], rec['opt']['unit']
    g = D['calc']['grid'][str(r)]
    if not st:
        s.text('원을 4등분한 한 조각이에요. 원 안에 완전히 들어간 칸은 초록, 원이 걸친 칸은 주황으로 칠해 보세요.')
    s.text('모눈 한 칸은 1 cm예요(실제 크기%s).' % (', 1칸이 1 m×1 m를 나타내요' if unit == 'm' else ''))
    pic_real(s, grid_svg(r, unit, g['T']))
    gg = sum(1 for i in range(r) for j in range(r) if (i + 1) ** 2 + (j + 1) ** 2 <= r * r)
    aa = sum(1 for i in range(r) for j in range(r) if i * i + j * j < r * r)
    assert (gg, aa) == (g['g'], g['all']), (r, gg, aa, g)
    return ask_after(s, lv, rec, '초록 %d칸, 주황 %d칸' % (g['g'], g['all'] - g['g']))


def hs_cut(s, lv, rec, st, D):
    if not rec['opt'].get('labels'):
        s.text('아래 원(실제 크기, 반지름 4 cm)은 16등분되어 있어요. 선을 따라 오려 주황 조각과 파란 조각을 위아래로 번갈아 공책에 이어 붙여 보세요.')
        pic_real(s, cutcircle_svg(4, 16))
        s.fill('이어 붙인 모양의 가로는 약 (        ) cm, 세로는 약 (        ) cm예요. (자로 재어 보세요.)')
        s.text('원을 8등분, 16등분, 32등분, 64등분하여 이어 붙인 모양이에요.')
        pic(s, cuts_svg(rec['cuts']), 160)
        half = r4(4 * 2 * PI / 2)
        return ask_after(s, lv, rec, '가로 약 12.5 cm(원주의 ½ = %s cm), 세로 4 cm' % fmt(half))
    pic(s, rec['cuts']['32'], 150)
    return ask_after(s, lv, rec)


def hs_move(s, lv, rec, st, D):
    s.text('종이에서는 옮긴 모양을 그림에 그려 넣어 보세요.')
    pic(s, rec['svg'], em_mm({'maxW': rec['opt'].get('maxW')}, 130))
    return ask_after(s, lv, rec)


def hs_make(s, lv, rec, st, D):
    out = []
    for it in rec['opt']['items']:
        r = it['d'] / 2
        s.text('쉼터에 놓을 %s의 지름은 %s cm입니다. 이 물건의 넓이는 몇 cm²인가요? (원주율 3.14)' % (it['name'], fmt(float(it['d']))))
        s.fill('반지름 (        ) cm   →   넓이 (        )×(        )×3.14 = (            ) cm²')
        out.append('%s 반지름 %s cm, %s cm²' % (it['name'], fmt(float(r)), fmt(area(r))))
    s.text('내가 찾은 물건으로 문제를 만들고 풀어 보세요.')
    s.fill(['내가 찾은 (            )의 지름은 (        ) cm입니다. 이 물건의 넓이는 몇 cm²인가요?',
            '풀이:                                            답: (            ) cm²'])
    return '; '.join(out) + '; (자유) (지름÷2)×(지름÷2)×3.14'


def hs_land(s, lv, rec, st, D):
    s.text('모눈종이는 실제 크기예요(한 칸 = 1 cm, 가로 16 cm, 세로 12 cm). 다른 원과 한 점에서 만나는 것은 돼요.')
    pic_real(s, board_svg(16, 12))
    rows = [['차례', '파랑 반지름(cm)', '파랑 넓이(cm²)', '빨강 반지름(cm)', '빨강 넓이(cm²)']]
    rows += [[str(i + 1), '', '', '', ''] for i in range(6)] + [['합계', '', '', '', '']]
    s.table(rows, header=True, col_mm=[20, 40, 40, 40, 40], row_h=2835)
    return '(놀이) 넓이 = (눈의 수)×(눈의 수)×3.14'


HANDLERS_ST = {'ci6Scene': hs_scene, 'ci6String': hs_string, 'ci6Wheel': hs_wheel, 'ci6Unroll': hs_unroll, 'ci6Lab': hs_lab,
               'ci6Roll': hs_roll, 'ci6Diam': hs_diam, 'ci6InOut': hs_inout, 'ci6Grid': hs_grid, 'ci6Cut': hs_cut,
               'ci6Move': hs_move, 'ci6Make': hs_make, 'ci6Land': hs_land}
WRAP_ST = {'thenWhy', 'ruleFirst', 'wonderRecall'}


def frame(help1):
    """앱 도움 둘째 줄 '‘…~…’ 꼴로 써요.' → 쓰기 틀"""
    t = help1.split('‘', 1)[1].rsplit('’', 1)[0] if '‘' in help1 else help1
    return t.replace('~', '__________')


def render_write_st(s, lv, items):
    """앱 writeStep: 기본형은 앱 도움의 문장 틀, 도전형은 빈 줄. 정답은 앱의 모범 답"""
    ans = []
    for it in items:
        s.ask('%s%s' % ('[%s] ' % it['tag'] if it.get('tag') else '', it['q']), blank=False)
        if lv == '기본형' and len(it.get('help') or []) > 1:
            s.fill(frame(it['help'][1]))
        else:
            s.lines(2)
        ans.append('예) ' + (it.get('ans') or it['ph']))
    return ' / '.join(ans)


def render_rec_st(s, lv, rec, st, D):
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
        return render_write_st(s, lv, rec['items'])
    if t == 'panes':
        for p in rec['items']:
            s.ask('%s  (%s)' % (p['t'], p['hint']) if p.get('hint') else p['t'], blank=False)
            if lv == '기본형':
                s.fill(frame(p['ph']))
            else:
                s.lines(1)
        return '(자유) 예) ' + ' / '.join(p['ex'][0] for p in rec['items'] if p['ex'])
    if t == 'thenWhy':
        o = rec['o']
        s.ask('왜 그럴까요? ' + o['q'], blank=False)
        if lv == '기본형' and len(o['help']) > 1:
            s.fill(frame(o['help'][1]))
        else:
            s.lines(2)
        return '왜? 예) ' + o['ans']
    if t == 'ruleFirst':
        o = rec['o']
        s.ask('먼저 예상해요 · ' + o['q'], blank=False)
        if lv == '기본형' and len(o['help']) > 1:
            s.fill(frame(o['help'][1]))
        else:
            s.lines(1)
        return '예상(자유) — 실제: ' + o['ans']
    if t == 'wonderRecall':
        s.text('1차시에 쓴 ‘궁금해요’ 칸을 다시 읽어 보세요.')
        return ''
    if t == 'chain':
        out = []
        for k, part in enumerate(rec['parts']):
            if part['title']:
                s.text('⑴⑵⑶⑷'[k] + ' ' + re.sub(r'^[①②③]\s*', '', part['title']))
            out.append('⑴⑵⑶⑷'[k] + ' ' + '; '.join(x for x in (render_rec_st(s, lv, r, None, D) for r in part['recs']) if x))
        return ' '.join(out)
    return HANDLERS_ST[t](s, lv, rec, st, D)


WHY_ST = {
    '1': ('둥근 쉼터를 만들 때 원의 둘레가 필요한 곳과 원의 넓이가 필요한 곳을 하나씩 써 보세요.',
          '둘레: 둥근 탁자의 보호 띠, 분수 화단의 울타리 / 넓이: 원형 잔디밭의 잔디 씨앗, 탁자의 식탁보'),
    '2': ('반지름이 1.5 cm인 원의 원주가 9 cm보다 길고 12 cm보다 짧은 까닭을 정육각형과 정사각형을 이용하여 써 보세요.',
          '원 안의 정육각형의 둘레는 9 cm(지름의 3배), 원 밖의 정사각형의 둘레는 12 cm(지름의 4배)인데 원주는 그 사이에 있기 때문이에요.'),
    '3': ('원주율을 3.14처럼 어림하여 사용하는 까닭을 써 보세요.', '원주율은 3.1415926…처럼 끝없이 계속되는 소수이기 때문이에요.'),
    '4': ('지름을 알 때 원주를, 원주를 알 때 지름을 구하는 방법을 써 보세요.', '(원주)=(지름)×(원주율), (지름)=(원주)÷(원주율)'),
    '5': ('모눈으로 잔디밭의 넓이를 어림할 때 어림한 값이 조금씩 다를 수 있는 까닭을 써 보세요.', '원이 걸친 칸을 세느냐 세지 않느냐에 따라 달라지기 때문이에요.'),
    '6': ('(원의 넓이)=(반지름)×(반지름)×(원주율)인 까닭을 원을 잘라 이어 붙인 직사각형으로 설명해 보세요.',
          '직사각형의 가로는 (원주)×½=(반지름)×(원주율), 세로는 반지름이므로 넓이는 (반지름)×(반지름)×(원주율)이에요.'),
    '7': ('꽃 화단에서 꽃을 심을 곳의 넓이를 구한 방법을 써 보세요.', '큰 원(반지름 6 m)의 넓이 113.04 m²에서 분수(반지름 2 m)의 넓이 12.56 m²를 빼서 100.48 m²예요.'),
    '8': ('메뉴 2를 지름이 24 cm인 피자 3판으로 바꾸었더니 고르는 메뉴가 달라진 까닭을 써 보세요.',
          '피자 한 판이 더해져 메뉴 2의 넓이의 합이 452.16×3=1356.48 (cm²)로 메뉴 1(1017.36 cm²)보다 넓어졌기 때문이에요.'),
    '9': ('지름이 2배가 되면 원의 넓이는 몇 배가 되는지 까닭과 함께 써 보세요.', '반지름도 2배가 되므로 넓이는 2×2=4(배)가 돼요.'),
    '10': ('주사위 눈이 3일 때와 6일 때 그리는 원의 넓이는 몇 배 차이가 나는지 까닭과 함께 써 보세요.',
           '28.26 cm²와 113.04 cm²로 4배예요. 반지름이 2배이면 넓이는 2×2=4(배)가 되기 때문이에요.'),
    '11': ('원주를 구할 때와 원의 넓이를 구할 때 각각 지름과 반지름 중 무엇을 쓰는지 까닭과 함께 써 보세요.',
           '(원주)=(지름)×(원주율)이라 지름을 쓰고, (원의 넓이)=(반지름)×(반지름)×(원주율)이라 반지름을 써요.'),
}


def why_ok(L, a):
    """WHY_ST 답에 쓴 소수가 앱 차시(LESSONS)에 그대로 나오는지(앱 수가 바뀌면 빌드를 멈춤)"""
    blob = json.dumps(L, ensure_ascii=False)
    bad = [x for x in re.findall(r'\d+\.\d+', a) if x not in blob]
    assert not bad, ('WHY_ST의 수가 앱과 달라요', L['no'], bad)


def lesson_st(s, lv, L, D, hard=None):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if L['no'] == 1:
        s.scene(None, D['story']['lines'][0])
    out = []
    assert hard is None or len(hard) == len(L['steps']), ('도전형 새 문제 수가 계단 수와 달라요', L['no'])

    def one(i, label, st):
        nm, _, sub = label.partition(' — ')
        s.step('%s %s' % (NUM[i], nm), sub or None)
        if hard and i < len(L['steps']):              # 도전형 ①~⑤는 새 문제
            s.text(hard[i][0])
            parts = [render_rec_st(s, lv, r, st, D) for r in hard[i][1]]
            out.append(NUM[i] + ' ' + '; '.join(x for x in parts if x))
            return
        recs = st['recs']
        main = next(r for r in recs if r['t'] not in WRAP_ST)
        s.text(paper_st(st['inst']))
        for svg in st.get('figs') or []:
            pic(s, svg, 140)
        if lv == '기본형' and st['hints'] and has_num(recs) and main['t'] not in INTERACTIVE:
            s.text('도움: ' + st['hints'][0])
        parts = [render_rec_st(s, lv, r, st, D) for r in recs]
        out.append(NUM[i] + ' ' + '; '.join(x for x in parts if x))
    for i, st in enumerate(L['steps']):
        one(i, st['name'], st)
    n = len(L['steps'])
    if lv == '도전형':
        if L['challenge']:
            one(n, '도전하기', L['challenge'])
            n += 1
        q, a = WHY_ST[str(L['no'])]
        why_ok(L, a)
        s.step('%s 까닭 쓰기' % NUM[n])
        s.ask(q, blank=False)
        s.lines(2)
        out.append(NUM[n] + ' ' + a)
    return '%s차시  ' % L['no'] + '   '.join(out)


ST = [lesson_st]          # 이야기 버전 차시 함수(앱 LESSONS의 차시마다 lesson_st를 부름)


def build_st(D, lv):
    assert len(D['lessons']) == 11, len(D['lessons'])
    s = Sheet(unit_label='6-2 수학 5. 원의 둘레와 넓이(이야기 버전)', level=lv, grade_label='6학년')
    HL = hard_u5('st') if lv == '도전형' else None
    assert HL is None or len(HL) == len(D['lessons'])
    lines = [lesson_st(s, lv, L, D, HL[k] if HL else None) for k, L in enumerate(D['lessons'])]
    s.answers('【교사용】 5. 원의 둘레와 넓이(이야기 버전) 활동지 정답 (%s)' % lv, lines,
              note='※ 이 활동지는 앱 u5-circle.html과 차시 번호가 같습니다. 원주율은 3.14로 계산합니다. '
                   '실제 크기 그림(끈 28 cm 도형·수직선·컵 받침·모눈·16등분한 원·놀이판)은 100%로 인쇄하세요.')
    os.makedirs(OUT_ST, exist_ok=True)
    path = os.path.join(OUT_ST, NAME % lv)
    s.save(path)
    return path




# ================================================================ 도전형 새 문제(2026-10-30)
# 도전형 ①~⑤는 기본형과 다른 수·상황으로 새로 씁니다(_build/sheets_hard/BRIEF.md). 앱 기록과 같은 꼴(ask·quiz·blanks·write)로 적어
# 같은 그리기 코드로 찍고, 답은 모두 아래에서 원주율 3.14로 계산합니다. 수를 보여 주는 그림은 쓰지 않고 글로 수를 줍니다.
def _P(*parts):
    out = []
    for p in parts:
        if isinstance(p, str):
            out.append({'s': p})
        elif isinstance(p, tuple):
            out.append({'o': p[0], 'a': p[1], 'multi': False})
        else:
            out.append({'n': r4(p) if isinstance(p, float) else p})
    return out


def _ask(*items):
    """items: (물음|None, 줄 조각 목록)"""
    return {'t': 'ask', 'items': [{'q': q, 'fig': None, 'o': None, 'parts': _P(*p)} for q, p in items], 'opts': {}}


def _quiz(*items):
    return {'t': 'quiz', 'items': [{'q': q, 'fig': None, 'o': o, 'a': a} for q, o, a in items], 'opts': {}}


def _blanks(*parts):
    return {'t': 'blanks', 'parts': _P(*parts), 'opts': {}}


def _write(*items):
    return {'t': 'write', 'items': [{'q': q, 'tag': None, 'ph': a, 'help': [], 'ans': a} for q, a in items]}


def _why(q, a):
    return {'t': 'thenWhy', 'o': {'q': q, 'help': [], 'ans': a}}


def _quarter(r):
    """반지름 r인 원의 1/4을 1칸 모눈에 그렸을 때: 원 안에 꼭 들어간 칸, 원이 걸친 칸"""
    full = sum(1 for i in range(r) for j in range(r) if (i + 1) ** 2 + (j + 1) ** 2 <= r * r)
    part = sum(1 for i in range(r) for j in range(r) if i * i + j * j < r * r) - full
    return full, part


U5 = {
    'tb': dict(r1=7, d1=26, s=9, a=12, b=7, d=15, r2=4, d3=11, r4=13, cd=[(47.1, 15), (69.08, 22)], cd2=[(22, 7), (50.3, 16)], park=(1131, 360),
               wheel=1.2, col=113.04, r6=9, c6=125.6, rr=(19, 7), q=8, mq=6, rd=(12, 12), sq=20, s4=10, grid=9, dg=18, r9=9, find=200.96,
               ring=(10, 4), menu=((36, 1), (24, 2)), menu2=((40, 1), (28, 2)), who='현준', c11=94.2, ring11=(9, 3), c11b=219.8),
    'st': dict(r1=9, d1=34, s=7, a=15, b=8, d=13, r2=6, d3=14, r4=11, cd=[(62.8, 20), (40.82, 13)], cd2=[(31, 10), (44, 14)], park=(942, 300),
               wheel=0.8, col=131.88, r6=7, c6=157, rr=(16, 6), q=6, mq=9, rd=(14, 14), sq=16, s4=12, grid=8, dg=22, r9=11, find=254.34,
               ring=(12, 5), menu=((32, 1), (20, 2)), menu2=((44, 1), (30, 2)), who='태오', c11=81.64, ring11=(11, 4), c11b=263.76),
}


def hard_u5(v):
    p = U5[v]
    L = []
    # 1 단원 도입
    L.append([
        ('원의 둘레를 구해야 하는 상황과 원의 넓이를 구해야 하는 상황을 구별해 보세요.',
         [_quiz(('원의 둘레를 구해야 하는 상황은?', ['훌라후프에 감을 테이프의 길이', '원 모양 매트에 깔 천의 양', '원 모양 시계의 무게'], 0),
                ('원의 넓이를 구해야 하는 상황은?', ['바퀴가 한 바퀴 구른 거리', '원 모양 화단에 깔 잔디의 양', '굴렁쇠 테두리의 길이'], 1))]),
        ('주변에서 원 모양인 것을 찾아보세요.',
         [_quiz(('원 모양인 것을 모두 골라 보세요.', ['맨홀 뚜껑', '양보 표지판', '동전', '공책 표지'], [0, 2]))]),
        ('원의 구성 요소를 떠올려 보세요.',
         [_ask((None, ['반지름이 %d cm인 원의 지름은 ' % p['r1'], p['r1'] * 2, 'cm예요.']),
               (None, ['지름이 %d cm인 원의 반지름은 ' % p['d1'], p['d1'] // 2, 'cm예요.']),
               (None, ['한 원에서 반지름은 ', (['모두 같아요', '모두 달라요'], 0), '.']))]),
        ('5학년 때 배운 다각형의 둘레와 넓이, 소수의 곱셈을 떠올려 보세요.',
         [_ask((None, ['한 변이 %d cm인 정육각형의 둘레는 ' % p['s'], p['s'] * 6, 'cm예요.']),
               (None, ['가로 %d cm, 세로 %d cm인 직사각형의 넓이는 ' % (p['a'], p['b']), p['a'] * p['b'], 'cm²예요.']),
               (None, ['3.14 × %d = ' % p['d'], 3.14 * p['d'], ', 3.14 × %d × %d = ' % (p['r1'], p['r1']), 3.14 * p['r1'] * p['r1']]))]),
        ('이 단원에서 배울 내용을 생각하며 알고 싶은 것을 써 보세요.',
         [_write(('원의 둘레나 넓이를 알면 좋을 생활 속 상황을 하나 쓰고, 무엇을 알아야 하는지 써 보세요.', '훌라후프에 감을 테이프 길이를 알려면 훌라후프의 지름을 알아야 해요.'))]),
    ])
    r2, d3, r4_ = p['r2'], p['d3'], p['r4']
    L.append([
        ('원주가 무엇인지 생각하며 물음에 답해 보세요.',
         [_quiz(('바퀴가 한 바퀴 구를 때 바퀴가 간 거리와 같은 것은?', ['바퀴의 반지름', '바퀴의 원주', '바퀴의 넓이'], 1))]),
        ('원주를 다른 말로 정리해 보세요.',
         [_blanks('원의 둘레를 ', (['원주', '지름', '반지름'], 0), '라고 해요. 원주는 지름보다 ', (['길어요', '짧아요'], 0), '.')]),
        ('반지름이 %d cm인 원 안에 꼭 맞는 정육각형과 원 밖에 꼭 맞는 정사각형의 둘레를 구해 원주를 어림해 보세요.' % r2,
         [_ask((None, ['정육각형의 둘레: ', r2 * 6, 'cm, 정사각형의 둘레: ', r2 * 8, 'cm']),
               (None, ['원주는 ', r2 * 6, 'cm보다 길고 ', r2 * 8, 'cm보다 짧아요.']))]),
        ('원주와 지름의 관계를 말해 보세요.',
         [_ask((None, ['원주는 지름의 ', (['3배', '4배', '2배'], 0), '보다 길고, 지름의 ', (['3배', '4배', '2배'], 1), '보다 짧아요.']),
               (None, ['지름이 %d cm인 원의 원주는 ' % d3, d3 * 3, 'cm보다 길고 ', d3 * 4, 'cm보다 짧아요.']))]),
        ('반지름이 %d cm인 원의 원주를 어림해 보세요.' % r4_,
         [_ask((None, ['(정육각형의 둘레) ', r4_ * 6, 'cm < (원주) < (정사각형의 둘레) ', r4_ * 8, 'cm']))]),
    ])
    (c1, e1), (c2, e2) = p['cd']
    (c3, e3), (c4, e4) = p['cd2']
    pc, pdd = p['park']
    L.append([
        ('원 모양 물건의 원주와 지름을 재었어요. (원주)÷(지름)을 구해 보세요.',
         [_ask((None, ['원주 %s cm, 지름 %d cm → (원주)÷(지름) = ' % (fmt(c1), e1), c1 / e1]),
               (None, ['원주 %s cm, 지름 %d cm → (원주)÷(지름) = ' % (fmt(c2), e2), c2 / e2]))]),
        ('(원주)÷(지름)을 반올림하여 소수 둘째 자리까지 나타내어 보세요. (계산기를 써도 돼요.)',
         [_ask((None, ['원주 %d cm, 지름 %d cm → 약 ' % (c3, e3), round(c3 / e3 + 1e-9, 2)]),
               (None, ['원주 %s cm, 지름 %d cm → 약 ' % (fmt(c4), e4), round(c4 / e4 + 1e-9, 2)]))]),
        ('원주율을 다른 말로 정리해 보세요.',
         [_blanks('원의 지름에 대한 원주의 비율을 ', (['원주율', '반지름', '원주'], 0), '이라고 해요. 원주율은 원의 크기와 상관없이 ', (['일정해요', '달라져요'], 0), '.')]),
        ('둘레가 %d m, 지름이 %d m인 원 모양 산책로가 있어요. 원주율을 구해 보세요. (계산기를 써도 돼요.)' % (pc, pdd),
         [_ask((None, ['반올림하여 소수 첫째 자리까지: ', round(pc / pdd, 1), ', 소수 둘째 자리까지: ', round(pc / pdd, 2)]))]),
        ('원주율에 대해 옳은 설명을 찾아보세요.',
         [_quiz(('옳은 설명을 모두 골라 보세요.', ['원주율은 3.14에서 끝나는 소수예요.', '원이 클수록 원주율도 커져요.', '원주율은 (원주)÷(지름)이에요.', '원주율은 3보다 크고 4보다 작아요.'], [2, 3]))]),
    ])
    w, col = p['wheel'], p['col']
    L.append([
        ('지름이 %s m인 물레방아 바퀴가 있어요. 바퀴의 원주를 구해 보세요. (원주율 3.14)' % fmt(w),
         [_ask((None, ['(원주) = ', w, ' × 3.14 = ', w * 3.14, ' (m)']))]),
        ('단면이 원 모양인 기둥의 원주가 %s cm예요. 기둥의 지름을 구해 보세요.' % fmt(col),
         [_ask((None, ['(지름) = ', col, ' ÷ 3.14 = ', col / 3.14, ' (cm)']))]),
        ('악기의 원 모양 부분의 원주와 반지름을 구해 보세요.',
         [_ask(('반지름이 %d cm인 북의 원주' % p['r6'], ['', p['r6'] * 2 * 3.14, 'cm']),
               ('원주가 %s cm인 심벌즈의 반지름' % fmt(p['c6']), ['', p['c6'] / 3.14 / 2, 'cm']))]),
        ('원주와 지름을 구하는 방법을 정리해 보세요.',
         [_blanks('(원주) = (', (['지름', '반지름'], 0), ') × (원주율), (지름) = (원주) ', (['÷', '×'], 0), ' (원주율), (반지름) = (원주) ÷ (원주율) ', (['÷ 2', '× 2'], 0))]),
        ('바퀴가 굴러간 거리를 생각하며 풀어 보세요.',
         [_ask(('지름 %s m인 바퀴가 5바퀴 굴러간 거리' % fmt(w), ['', w * 3.14 * 5, 'm']),
               ('어떤 바퀴가 3바퀴 굴러 %s cm를 갔을 때 바퀴의 지름' % fmt(col * 3), ['', col * 3 / 3 / 3.14, 'cm']))]),
    ])
    g = p['grid']
    full, part = _quarter(g)
    dg, r9 = p['dg'], p['r9']
    L.append([
        ('반지름이 %d m인 원 모양 텃밭의 넓이를 정사각형으로 어림해 보세요.' % g,
         [_ask((None, ['원 밖의 정사각형 넓이: ', (2 * g) ** 2, 'm², 원 안의 정사각형 넓이: ', (2 * g) ** 2 // 2, 'm²']),
               (None, ['원의 넓이는 ', (2 * g) ** 2 // 2, 'm²보다 크고 ', (2 * g) ** 2, 'm²보다 작아요.']))]),
        ('반지름이 %d m인 원의 4분의 1을 1칸이 1 m×1 m인 모눈에 그렸더니 원 안에 꼭 들어간 칸이 %d칸, 원이 걸친 칸이 %d칸이었어요.' % (g, full, part),
         [_ask((None, ['원 전체의 넓이는 ', full * 4, 'm²보다 크고 ', (full + part) * 4, 'm²보다 작아요.']))]),
        ('지름이 %d cm인 원 모양 과자의 넓이를 어림해 보세요.' % dg,
         [_ask((None, ['원 안의 정사각형 ', dg * dg // 2, 'cm² < (과자의 넓이) < 원 밖의 정사각형 ', dg * dg, 'cm²']))]),
        ('원의 넓이를 어림하는 방법을 정리해 보세요.',
         [_blanks('원의 넓이는 원 안에 꼭 맞는 정사각형의 넓이보다 ', (['커요', '작아요'], 0), '. 모눈으로 어림할 때 원이 걸친 칸까지 세면 원의 넓이보다 ', (['커요', '작아요'], 0), '.')]),
        ('반지름이 %d cm인 원의 넓이를 원 안과 원 밖의 정사각형으로 어림해 보세요.' % r9,
         [_ask((None, ['원 안: ', 2 * r9 * r9, 'cm², 원 밖: ', 4 * r9 * r9, 'cm², 두 넓이의 가운데 값으로 어림하면 약 ', 3 * r9 * r9, 'cm²']))]),
    ])
    r6, c6, fd = p['r6'], p['c6'], p['find']
    L.append([
        ('원을 잘게 잘라 위아래로 번갈아 이어 붙인 모양을 생각해 보세요.',
         [_ask((None, ['잘게 자를수록 이어 붙인 모양은 ', (['직사각형', '삼각형'], 0), '에 가까워져요.']))]),
        ('반지름이 %d cm인 원을 잘라 이어 붙인 직사각형의 가로, 세로, 넓이를 구해 보세요.' % r6,
         [_ask((None, ['가로(원주의 ½): ', r6 * 3.14, 'cm, 세로(반지름): ', r6, 'cm, 넓이: ', area(r6), 'cm²']))]),
        ('원의 넓이를 구하는 식을 다른 말로 정리해 보세요.',
         [_blanks('(원의 넓이) = (원주) × ', (['½', '2'], 0), ' × (반지름) = (반지름) × (반지름) × ', (['원주율', '지름'], 0))]),
        ('원 모양 물건의 넓이를 구해 보세요. (계산기를 써도 돼요.)',
         [_ask(('원주가 %s cm인 접시' % fmt(c6), ['반지름 ', c6 / 3.14 / 2, 'cm, 넓이 ', area(c6 / 3.14 / 2), 'cm²']),
               ('지름이 %d cm인 시계' % p['dg'], ['넓이 ', area(p['dg'] / 2), 'cm²']))]),
        ('넓이를 보고 반지름을 거꾸로 구해 보세요.',
         [_ask(('넓이가 %s cm²인 원의 반지름' % fmt(fd), ['(반지름) × (반지름) = ', fd / 3.14, ', 반지름 ', round((fd / 3.14) ** .5), 'cm']))]),
    ])
    R, r = p['ring']
    a, b = p['rd']
    sq, s4 = p['sq'], p['s4']
    L.append([
        ('반지름이 %d m인 원 모양 꽃밭 가운데에 반지름이 %d m인 원 모양 연못이 있어요. 꽃을 심을 곳의 넓이를 구해 보세요.' % (R, r),
         [_ask((None, ['', area(R), ' − ', area(r), ' = ', area(R) - area(r), ' (m²)']))]),
        ('반지름이 %d cm인 반원의 넓이를 구해 보세요.' % p['q'],
         [_ask((None, ['', area(p['q']), ' ÷ 2 = ', area(p['q']) / 2, ' (cm²)']))]),
        ('반지름이 %d cm인 반원과 지름이 %d cm인 반원을 붙인 도형의 넓이를 구해 보세요.' % (a, b),
         [_ask((None, ['큰 반원 ', area(a) / 2, 'cm² + 작은 반원 ', area(b / 2) / 2, 'cm² = ', area(a) / 2 + area(b / 2) / 2, 'cm²']))]),
        ('한 변이 %d cm인 정사각형 안에 꼭 맞는 원을 그렸어요. 원 밖의 네 모서리 부분의 넓이를 구해 보세요.' % sq,
         [_ask((None, ['', sq * sq, ' − ', area(sq / 2), ' = ', sq * sq - area(sq / 2), ' (cm²)']))]),
        ('반지름이 %d cm인 원의 4분의 1(부채꼴 모양)의 넓이와 둘레를 구해 보세요.' % s4,
         [_ask((None, ['넓이: ', area(s4) / 4, 'cm², 둘레: ', s4 * 2 * 3.14 / 4 + 2 * s4, 'cm']))]),
    ])
    (m1d, m1n), (m2d, m2n) = p['menu']
    A1, A2 = area(m1d / 2) * m1n, area(m2d / 2) * m2n
    (n1d, n1n), (n2d, n2n) = p['menu2']
    B1, B2 = area(n1d / 2) * n1n, area(n2d / 2) * n2n
    pick = lambda x, y: 0 if x > y else 1
    L.append([
        ('메뉴 1은 지름이 %d cm인 피자 1판, 메뉴 2는 지름이 %d cm인 피자 2판이에요. 피자의 두께가 같을 때 피자를 더 많이 먹을 수 있는 메뉴를 고르려고 해요.' % (m1d, m2d),
         [_quiz(('비교해야 하는 것은?', ['피자의 둘레', '피자 넓이의 합', '피자의 판 수'], 1))]),
        ('어떻게 해결할지 계획해 보세요.',
         [_blanks('각 피자의 ', (['반지름', '둘레'], 0), '을 구해 넓이를 구하고, 메뉴 2는 넓이를 ', (['2배', '2로 나누어'], 0), ' 해서 비교해요.')]),
        ('계획대로 해결해 보세요. (계산기를 써도 돼요.)',
         [_ask((None, ['메뉴 1: ', A1, 'cm², 메뉴 2: ', A2, 'cm² → ', (['메뉴 1', '메뉴 2'], pick(A1, A2)), '을 골라요.']))]),
        ('해결 과정을 되돌아보세요.',
         [_write(('판 수가 많은 메뉴가 항상 더 많은 것은 아닌 까닭을 써 보세요.', '피자의 넓이는 반지름×반지름에 따라 달라져서, 지름이 큰 피자 한 판이 작은 피자 여러 판보다 넓을 수 있기 때문이에요.'))]),
        ('메뉴 1은 지름이 %d cm인 피자 1판, 메뉴 2는 지름이 %d cm인 피자 2판이에요. 어느 메뉴를 고를까요?' % (n1d, n2d),
         [_ask((None, ['메뉴 1: ', B1, 'cm², 메뉴 2: ', B2, 'cm² → ', (['메뉴 1', '메뉴 2'], pick(B1, B2))]))]),
    ])
    if v == 'st':      # 이야기 버전은 피자 고르기가 두 차시
        L.append([
            ('도윤이네 모둠도 피자를 골라요. 메뉴 1은 지름이 %d cm인 피자 1판, 메뉴 2는 지름이 %d cm인 피자 2판이에요.' % (n1d, n2d),
             [_ask((None, ['메뉴 1 피자의 반지름: ', n1d // 2, 'cm, 메뉴 2 피자 한 판의 반지름: ', n2d // 2, 'cm']))]),
            ('넓이를 구해 비교해 보세요. (계산기를 써도 돼요.)',
             [_ask((None, ['메뉴 1: ', B1, 'cm², 메뉴 2: ', B2, 'cm² → ', (['메뉴 1', '메뉴 2'], pick(B1, B2))]))]),
            ('지름이 3배가 되면 넓이는 몇 배가 될까요?',
             [_ask((None, ['지름 10 cm인 원의 넓이 ', area(5), 'cm², 지름 30 cm인 원의 넓이 ', area(15), 'cm² → ', 9, '배'])),
              _why('지름이 3배이면 넓이가 9배가 되는 까닭은 무엇일까요?', '반지름도 3배가 되어 넓이는 3×3=9(배)가 되기 때문이에요.')]),
            ('조건을 바꾸어 피자 문제를 만들어 보세요.',
             [_write(('지름과 판 수를 정해 피자 메뉴 두 가지를 만들고, 어느 메뉴가 더 넓은지 써 보세요.', '지름 20 cm 피자 2판(628 cm²)과 지름 30 cm 피자 1판(706.5 cm²) 중 30 cm 피자 1판이 더 넓어요.'))]),
            ('피자 고르기 문제를 정리해 보세요.',
             [_blanks('피자를 비교할 때는 지름이나 판 수가 아니라 ', (['넓이의 합', '둘레의 합'], 0), '을 비교해요. 지름이 2배이면 넓이는 ', (['4배', '2배'], 0), '가 돼요.')]),
        ])
    L.append([
        ('땅따먹기 놀이 방법을 떠올리며 답해 보세요.',
         [_quiz(('원을 다른 원과 겹치게 그려도 되나요?', ['돼요', '안 돼요'], 1), ('원의 넓이를 틀리게 쓰면 어떻게 하나요?', ['원을 그릴 수 없어요', '원을 두 개 그려요'], 0))]),
        ('이번에는 주사위 눈의 수의 2배를 반지름으로 해요. 원의 넓이를 미리 구해 보세요.',
         [_ask((None, ['눈 1: ', area(2), ', 눈 2: ', area(4), ', 눈 3: ', area(6)]), (None, ['눈 4: ', area(8), ', 눈 5: ', area(10), ', 눈 6: ', area(12), ' (cm²)']))]),
        ('반지름이 3 cm인 원과 4 cm인 원을 그리려고 해요. 두 원의 중심 사이의 거리에 따라 그릴 수 있는지 골라 보세요.',
         [_ask((None, ['중심 사이 7 cm: ', (['그릴 수 있어요', '그릴 수 없어요'], 0), ', 5 cm: ', (['그릴 수 있어요', '그릴 수 없어요'], 1), ', 9 cm: ', (['그릴 수 있어요', '그릴 수 없어요'], 0)]))]),
        ('파랑은 눈 2와 5, 빨강은 눈 4와 3이 나왔어요(반지름 = 눈의 수 × 2). 누가 땅을 더 넓게 차지했을까요?',
         [_ask((None, ['파랑: ', area(4) + area(10), 'cm², 빨강: ', area(8) + area(6), 'cm² → ', (['파랑', '빨강'], 0)]))]),
        ('놀이를 되돌아보세요.',
         [_write(('반지름을 눈의 수의 2배로 하면 넓이는 처음 놀이의 몇 배가 되는지 까닭과 함께 써 보세요.', '반지름이 2배가 되어 넓이는 2×2=4(배)가 돼요.'))]),
    ])
    c11, (R11, r11), c11b = p['c11'], p['ring11'], p['c11b']
    L.append([
        ('원주와 지름을 구해 보세요.',
         [_ask(('원주가 %s cm인 원의 지름' % fmt(c11), ['', c11 / 3.14, 'cm']), ('반지름이 %d cm인 원의 원주' % R11, ['', R11 * 2 * 3.14, 'cm']))]),
        ('원의 넓이와 색칠한 부분의 넓이를 구해 보세요.',
         [_ask(('반지름이 %d cm인 원의 넓이' % R11, ['', area(R11), 'cm²']),
               ('반지름이 %d cm인 원에서 반지름이 %d cm인 원을 뺀 부분의 넓이' % (R11, r11), ['', area(R11) - area(r11), 'cm²']))]),
        ('친구들이 원에 대해 말했어요. 잘못 말한 사람을 찾아보세요.',
         [_quiz(('잘못 말한 사람은?', ['가: 지름이 2배이면 원주도 2배예요.', '나: 반지름이 2배이면 넓이도 2배예요.', '다: 원주율은 원의 크기와 상관없어요.'], 1)),
          _write(('잘못 말한 것을 옳게 고쳐 써 보세요.', '반지름이 2배이면 넓이는 2×2=4(배)예요.'))]),
        ('원주가 %s cm인 원 모양 탁자의 넓이를 구해 보세요.' % fmt(c11b),
         [_ask((None, ['반지름: ', c11b / 3.14 / 2, 'cm, 넓이: ', area(c11b / 3.14 / 2), 'cm²']))]),
        ('배운 내용을 정리해 보세요.',
         [_blanks('(원주) = (지름) × ', (['원주율', '반지름'], 0), ', (원의 넓이) = (반지름) × (반지름) × ', (['원주율', '지름'], 0), '. 반지름이 3배이면 넓이는 ', (['9배', '3배', '6배'], 0), '예요.')]),
    ])
    return L


def main():
    want = [a for a in sys.argv[1:] if a in ('tb', 'st')] or ['tb', 'st']
    out = []
    try:
        if 'tb' in want:
            D = load(SRC_TB)
            for lv in ('기본형', '도전형'):
                out.append(build(D, '6-2 수학 5. 원의 둘레와 넓이(교과서 차시)', '교과서 차시', OUT_TB, lv))
        if 'st' in want:
            if ST and os.path.exists(SRC_ST):
                D = load(SRC_ST, _EX_ST)
                for lv in ('기본형', '도전형'):
                    out.append(build_st(D, lv))
            else:
                print('[건너뜀] 이야기 버전 원본(u5-circle.st.js)이 없어요.')
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
