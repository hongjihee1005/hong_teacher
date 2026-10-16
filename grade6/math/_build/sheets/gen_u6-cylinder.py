# -*- coding: utf-8 -*-
"""6-2 수학 6. 원기둥, 원뿔, 구 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u6-cylinder.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u6-cylinder.py tb       # 교과서 차시 버전만

앱 원본 ../units/sem2/u6-cylinder.tb.js('마을 체육 대회 원기둥·원뿔·구', 8차시 묶음: 1·2·3~4·5·6·7~8·9·10)의
LESSONS를 node에서 가짜 DOM으로 그대로 실행해(CAP_JS), 활동마다 넘긴 물음·보기·정답·수와 앱이 그린 그림(SVG)을 모읍니다.
그래서 앱의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수·정답이 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.

  - 묻고 답하기(cy6Ask·blanks·quiz·cy6Pick·cy6Sort·sequence·writeStep)는 앱의 물음을 그대로 옮기고,
    기본형은 보기 고르기 + 도움 한 줄, 도전형은 짧은 낱말 보기를 빈칸 + 낱말 상자로 바꾸고 앱의 도전 문제와 '까닭 쓰기'를 더합니다.
  - 조작 활동은 앱의 그림을 그대로 넣습니다: 막대 돌리기(cy6Spin)는 돌리기 전·한 바퀴 돌린 뒤, 펼치기(cy6Unroll)는 다 펼친 모습,
    자와 삼각자(cy6Ruler)는 삼각자를 맞춘 모습, 테니스공 통(cy6Tube)은 공 2개를 넣은 모습(앱의 단추·끌기를 가짜로 눌러서 얻음).
  - 학생이 그리거나 재는 그림은 **실제 크기**(SVG 1 cm = 40 px, 그림 너비 mm = px ÷ 4, 100%로 인쇄):
    3~4차시 원기둥의 전개도 그리기 모눈(한 칸 1 cm, 17 cm × 13 cm), 6차시 구를 반으로 자른 단면(반지름은 앱의 R).
  - 놀이(9차시)는 종이에서 할 수 있게 놀이 순서 정하기·연습 표·물건 이름 쓰기로 바꿉니다(카드와 관계는 앱의 CY6_CARDS 그대로).
  - 정답의 계산(원주·옆면의 가로·지름·둘레 등)은 파이썬으로 따로 다시 계산해 assert로 앱의 답과 맞춥니다(check_numbers).
  - 이야기 버전(ST)은 아직 없어서 건너뜁니다(앱 원본 u6-cylinder.st.js가 생기면 ST 목록에 더함).
그림은 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""

CAP_JS = r'''// 앱 원본(u6-cylinder.tb.js)을 가짜 DOM에서 실행해 차시·단계·물음·보기·정답·그림(SVG)을 모읍니다.
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

const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
const lesSrc = src.slice(src.indexOf('//@@LESSONS'));
eval((unitSrc + '\n' + lesSrc).replace(/^(const|let) /gm, 'var '));

function findAll(e, f, out) { out = out || []; if (e && typeof e === 'object' && e.kids) { if (f(e)) out.push(e); e.kids.forEach(k => findAll(k, f, out)); } return out; }
function click(root, label) { const b = findAll(root, e => e.tag === 'button' && e.textContent.trim() === label)[0]; if (!b) throw new Error('단추 없음: ' + label); b.on.onclick({ currentTarget: b, target: b, stopPropagation() {} }); }
function findSvg(e) { if (!e || typeof e !== 'object') return null; if (e.tag === 'svg') return e; for (const k of e.kids || []) { const r = findSvg(k); if (r) return r; } return null; }
function plain(e) { if (e == null) return ''; if (typeof e !== 'object') return String(e); if (e.tag === 'svg') return ''; if (e.tag === 'br') return '\n'; return e._t + (e.kids || []).map(plain).join(''); }
/* 그림(함수·요소) → {figs:[{svg, label}], text} */
function serEl(v) {
  if (typeof v === 'function') v = v();
  if (v == null) return null;
  if (!(v instanceof El)) return { figs: [], text: String(v) };
  if (v.tag === 'svg') return { figs: [{ svg: String(v), label: '' }], text: '' };
  const kids = v.children.filter(k => findSvg(k));
  if (kids.length > 1) return { figs: kids.map(k => ({ svg: String(findSvg(k)), label: plain(k).trim() })), text: '' };
  const s = findSvg(v);
  return { figs: s ? [{ svg: String(s), label: plain(v).trim() }] : [], text: s ? '' : plain(v).trim() };
}
function serPart(p) {
  if (typeof p === 'string') return { s: p };
  if (p instanceof El) return p.tag === 'br' ? { br: 1 } : { s: plain(p) };
  if (p.o) return { o: p.o, a: p.a, multi: !!p.multi };
  if ('n' in p) return { n: p.n };
  return { s: '' };
}
function serQ(it) { return { q: it.q || null, fig: it.fig ? serEl(it.fig) : null, o: it.o || null, a: it.a, parts: it.parts ? it.parts.map(serPart) : null }; }
function serAsk(a) { const v = typeof a === 'function' ? a() : a; return (v || []).map(serQ); }
const api = new Proxy({}, { get: () => () => {} });

quiz = function (b, a, items, opts) { if (!INNER) REC.push({ t: 'quiz', items: items.map(serQ), ok: (opts || {}).ok || '' }); };
blanks = function (b, a, parts, opts) { if (!INNER) REC.push({ t: 'blanks', parts: parts.map(serPart), ok: (opts || {}).ok || '' }); };
writeStep = function (b, a, items) { if (!INNER) REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag || '', ph: x.ph || '' })) }); };
sequence = function (b, a, cards, order) { if (!INNER) REC.push({ t: 'sequence', cards, order }); };
const ORIG = { cy6Ask };
cy6Ask = function (host, ap, items, opts) { if (!INNER) REC.push({ t: 'ask', items: items.map(serQ), ok: (opts || {}).ok || '' }); return new El('div'); };
cy6Chain = function (body, ap, parts) {
  const out = [];
  for (const p of parts) { const save = REC; REC = []; (p.run || p)(new El('div'), ap); out.push({ title: p.title || null, recs: REC }); REC = save; }
  REC.push({ t: 'chain', parts: out });
};
const WID = ['cy6Pick', 'cy6Sort', 'cy6Tap', 'cy6Ruler', 'cy6Spin', 'cy6Gen', 'cy6Probe', 'cy6Unroll', 'cy6NetMark', 'cy6NetJudge', 'cy6NetDraw',
  'cy6View', 'cy6Make', 'cy6Riddle', 'cy6CardCheck', 'cy6Shout', 'cy6NameGame', 'cy6Tube'];
WID.forEach(name => {
  ORIG[name] = eval(name);
  const w = function (body, ap, opt) {
    if (INNER) return ORIG[name](body, ap, opt);
    const rec = { t: name, opt: {} };
    for (const [k, v] of Object.entries(opt || {})) { if (typeof v === 'function' || k === 'ask' || k === 'items' || k === 'then') continue; try { rec.opt[k] = JSON.parse(JSON.stringify(v)); } catch (e) { } }
    if (opt.items) rec.items = opt.items.map(it => ({ name: it.name, bin: it.bin, fig: it.fig ? serEl(it.fig) : null }));
    const fb = new El('div'); INNER++;
    try {
      ORIG[name](fb, api, opt);
      const s0 = findSvg(fb); if (s0) rec.svg0 = String(s0);
      if (name === 'cy6Spin') { click(fb, '↻ 한 바퀴 돌리기'); rec.svg1 = String(findSvg(fb)); }
      if (name === 'cy6Unroll') { click(fb, '✂ 잘라서 펼치기'); rec.svg1 = String(findSvg(fb)); }
      if (name === 'cy6Ruler') { DRAG.m({ x: 0, y: 1e6 }); rec.svg1 = String(findSvg(fb)); }
      if (name === 'cy6Tube') { const W = 420, H = 380; [[W * .78, H * .3], [W * .78, H * .72]].forEach(([x, y]) => { if (DRAG.s({ x, y })) { DRAG.m({ x: W * .33, y: 60 }); DRAG.e({ x: W * .33, y: 60 }); } }); rec.svg1 = String(findSvg(fb)); }
    } catch (e) { rec.err = String(e && e.stack || e).slice(0, 400); }
    INNER--;
    if (name === 'cy6NetMark') rec.net = cy6NetSvg(opt.net, { s: opt.s || 26 }).svg.toString();
    if (name === 'cy6NetJudge') rec.nets = opt.nets.map(N => ({ name: N.name, res: N.res, svg: String(cy6NetSvg(N, { s: 20, plain: true, pad: 6, box: opt.box || [6.6, 6.6] }).svg) }));
    if (name === 'cy6Riddle') rec.objs = opt.objs.map(o => ({ key: o, name: CY6_OBJS[o].n, k: CY6_OBJS[o].k, svg: String(cy6ObjFig(o)) }));
    if (name === 'cy6CardCheck') rec.cards = opt.ids.map(id => ({ id, name: CY6_CARDS[id].name, rel: CY6_CARDS[id].rel, kind: CY6_CARDS[id].t ? 't' : CY6_CARDS[id].o ? 'o' : 's' }));
    if (name === 'cy6Make') rec.shapes = ['cyl', 'cone', 'sph'].map(k => ({ name: CY6_KN[k], svg: String(cy6Shp(k)()) }));
    if (name === 'cy6Unroll' && opt.then) { const save = REC; REC = []; const box = new El('div'); opt.then(box, api); rec.then = REC; rec.thenText = box.children.filter(k => k.tag === 'p').map(plain); REC = save; }
    rec.ask = serAsk(opt.ask);
    rec.ok = opt.ok || '';
    REC.push(rec);
  };
  eval(name + ' = w');
});
function cap(render) { REC = []; try { render(new El('div'), api); } catch (e) { REC.push({ t: 'error', err: String(e.stack || e).slice(0, 400) }); } return REC; }
const OUT = { story: UNIT_STORY, lessons: LESSONS.map(L => ({ id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(s => ({ name: s.name, inst: s.inst, hints: s.hints || [], recs: cap(s.render) })),
  challenge: L.challenge ? { inst: L.challenge.inst, hints: L.challenge.hints || [], recs: cap(L.challenge.render) } : null })) };
OUT.cards = CY6_CARDS.map(c => ({ id: c.id, name: c.name, rel: c.rel, kind: c.t ? 't' : c.o ? 'o' : 's' }));
OUT.bank = Object.fromEntries(Object.entries(CY6_BANK).map(([k, v]) => [k, v.map(o => CY6_OBJS[o].n)]));
OUT.props = CY6_PROPS.map(p => ({ c: p.c, l: p.l, v: p.v }));
OUT.kn = CY6_KN; OUT.pi = CY6_PI;
process.stdout.write(JSON.stringify(OUT));
'''

import hashlib
import json
import math
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
UNITS = os.path.join(ROOT, '_build', 'units', 'sem2')
SRC_TB = os.path.join(UNITS, 'u6-cylinder.tb.js')
SRC_ST = os.path.join(UNITS, 'u6-cylinder.st.js')
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
UNIT_NAME = '6. 원기둥, 원뿔, 구'
NAME = '6단원_원기둥원뿔구_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨⑩'
KO = '㉠㉡㉢㉣㉤㉥㉦㉧'
WORK = tempfile.mkdtemp(prefix='u6cyl_')
K = 40            # 실제 크기: 1 cm = 40 px → 그림 너비 mm = px ÷ 4
PI = 3.14
ST = []           # 이야기 버전 차시(아직 없음 — 원본이 생기면 더함)

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
def grid_svg(cols=17, rows=13, start=None):
    """한 칸 1 cm 모눈(실제 크기). start = (x, y) 칸 좌표에 시작점 ㄱ"""
    m = 0.4 * K
    W, H = cols * K + 2 * m, rows * K + 2 * m
    b = ['<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="2"/>' % (m, m, cols * K, rows * K, GRID)]
    for i in range(1, cols):
        b.append(_ln((m + i * K, m), (m + i * K, m + rows * K), GRID, 1.2))
    for j in range(1, rows):
        b.append(_ln((m, m + j * K), (m + cols * K, m + j * K), GRID, 1.2))
    if start:
        p = (m + start[0] * K, m + start[1] * K)
        b.append('<circle cx="%s" cy="%s" r="5" fill="%s"/>' % (fmt(p[0]), fmt(p[1]), RED))
        b.append(_t(p[0] - 12, p[1] - 12, 'ㄱ', 16, RED, weight='bold'))
    return _svg(W, H, ''.join(b))


def section_svg(R):
    """구를 반으로 자른 단면(반지름 R cm, 실제 크기) — 중심은 표시하지 않음"""
    m = 0.5 * K
    W = H = 2 * R * K + 2 * m
    c = W / 2
    b = ['<circle cx="%s" cy="%s" r="%s" fill="#E3F1EA" stroke="%s" stroke-width="2.5"/>' % (fmt(c), fmt(c), fmt(R * K), INK),
         '<ellipse cx="%s" cy="%s" rx="%s" ry="%s" fill="none" stroke="#7C8A96" stroke-width="1.4" stroke-dasharray="5 5"/>' % (fmt(c), fmt(c), fmt(R * K), fmt(R * K * .28))]
    return _svg(W, H, ''.join(b))


# ================================================================ 종이에 맞게 글 고치기
PAPER_RULES = [
    (r'물건 카드를 모양에 따라 상자에 나누어 담아 보세요', '물건을 모양에 따라 나누어 보세요'),
    (r'각각 모두 찾아 상자에 담아 보세요', '각각 모두 찾아 기호를 써 보세요'),
    (r'상자에 나누어 담아', '나누어'),
    (r'(\S+)을 돌려 가며 ', r'\1에서 '),
    (r'먼저 예상한 다음, 하나씩 접어서 확인해요', '먼저 예상한 다음, 접었을 때의 모양을 떠올려 확인해요'),
    (r'순서대로 눌러 보세요', '순서대로 기호를 써 보세요'),
    (r'차례대로 눌러 붙여 보세요', '차례대로 기호를 써 보세요'),
    (r'\(교과서 준비물 카드 대신 이 앱이 만든 카드예요\.\)', '(교과서 준비물 카드 대신 앱에서 만든 카드예요.)'),
    (r'통을 잘라서 펼쳐 보세요', '통을 잘라서 펼친 그림을 살펴보세요'),
    (r'막대를 돌리면 어떤 입체도형이 만들어지는지 알아보세요', '막대를 한 바퀴 돌리면 어떤 입체도형이 만들어지는지 그림을 보고 알아보세요'),
]
INTERACT = re.compile(r'눌러|누르|누를|끌어|끌거나|단추|화면|연습판|컴퓨터 친구|돌려요\(|▲|막대를 끝까지')


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
                lab = cur.strip().rstrip(':').split()[-1] + ' ' if cur.strip() else ''
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
        s.fill(lines)
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
    s.fill(re.sub(r'\s+', ' ', txt).strip().replace('\x00', '(          )').replace('\x01', '(             )'))
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


def w_pick(s, lv, rec):
    o = rec['opt']
    items = rec['items']
    s.ask(o.get('q') or '알맞은 것을 모두 골라 보세요.', blank=False)
    cards = [(it['name'], it['fig']['figs'][0]['svg']) for it in items if it.get('fig') and it['fig']['figs']]
    named = all(len(it['name']) <= 1 or it['name'] in '①②③④⑤⑥' for it in items)
    if len(cards) != len(items):      # 글 카드가 섞여 있으면 글로
        def desc(it):
            f = it.get('fig') or {}
            t = f.get('text') or ((f.get('figs') or [{}])[0].get('label') or '')
            t = t.replace('이 앱이 만든 카드', '').strip()
            return t + (' (물건 그림 카드)' if f.get('figs') else '')
        s.fill(['%s %s' % (it['name'], desc(it)) for it in items])
    else:
        cols = min(len(items), 6 if len(items) >= 6 and named else 5)
        if len(items) == 6 and not named:
            cols = 3
        svg = cards_svg(cards, cols=cols, cw=150 if 'cardW' not in o else 190, ch=130 if 'cardW' not in o else 150)
        pic(s, svg, min(170, vb(svg)[2] * 0.2))
    s.ask('알맞은 것을 모두 골라 %s 써 보세요.' % ('기호를' if named else '이름을'), answer_space=30)
    a = ', '.join(items[i]['name'] for i in o['a'])
    more = w_ask(s, lv, rec['ask']) if rec.get('ask') else ''
    return a + (' / ' + more if more else '')


def w_sort(s, lv, rec):
    o = rec['opt']
    items = rec['items']
    if o.get('q'):
        s.ask(o['q'], blank=False)
    cards = [(it['name'], it['fig']['figs'][0]['svg']) for it in items]
    named = all(len(it['name']) <= 1 for it in items)
    cols = len(items) if len(items) <= 5 else 4
    svg = cards_svg(cards, cols=cols, cw=150, ch=130)
    pic(s, svg, min(170, vb(svg)[2] * 0.2))
    bins = o['bins']
    s.text('알맞은 칸에 %s 써 보세요.' % ('기호를' if named else '이름을'))
    s.table([bins, [''] * len(bins)], row_h=2835 * 2)
    a = ' / '.join('%s: %s' % (b, ', '.join(it['name'] for it in items if it['bin'] == k)) for k, b in enumerate(bins))
    more = w_ask(s, lv, rec['ask']) if rec.get('ask') else ''
    return a + (' / ' + more if more else '')


NM_FACE = {'top': '위쪽 평평한 면', 'bot': '아래쪽 평평한 면', 'side': '굽은 면', 'apex': '뾰족한 부분의 점'}


def w_tap(s, lv, rec):
    pic(s, rec['svg0'], 70)
    s.text('보이지 않는 면의 둘레는 점선으로 그렸어요. 점선으로 그린 면도 찾아 색칠해요.')
    want = rec['opt']['want']
    pens = {p['c']: p['n'] for p in rec['opt'].get('pens', [])}
    a = ', '.join('%s %s' % (NM_FACE[k], pens.get(v, '색칠')) for k, v in want.items())
    more = w_ask(s, lv, rec['ask'])
    return a + ' / ' + more


def w_ruler(s, lv, rec):
    s.text('그림처럼 자를 바닥에 수직으로 세우고, 삼각자를 내려 맞추었어요. 자의 눈금을 읽어 보세요.')
    pic(s, rec['svg1'], 80)
    return w_ask(s, lv, rec['ask'])


def w_spin(s, lv, rec):
    svg = cards_svg([('돌리기 전', rec['svg0']), ('한 바퀴 돌린 뒤', rec['svg1'])], cols=2, cw=440, ch=360)
    pic(s, svg, 150)
    return w_ask(s, lv, rec['ask'])


def w_gen(s, lv, rec):
    n = rec['opt'].get('need', 6)
    pic(s, rec['svg0'], 70)
    s.text('원뿔의 꼭짓점(파란 점)에서 밑면의 둘레의 한 점까지 자를 대고 선분을 %d개 그어 보세요. 꼭짓점에서 밑면에 수직인 선분(높이)도 점선으로 그어 보세요.' % n)
    return w_ask(s, lv, rec['ask'])


def w_probe(s, lv, rec):
    R = rec['opt'].get('R', 5)
    s.text('※ 아래 그림은 실제 크기예요. 100%%로 인쇄하면 자로 재어 확인할 수 있어요. (반지름 %s cm)' % fmt(R) if lv == '기본형'
           else '※ 아래 그림은 실제 크기예요. 100%로 인쇄하면 자로 재어 확인할 수 있어요.')
    pic_real(s, section_svg(R))
    s.text('구를 반으로 자른 단면이에요. 가장 안쪽에 있는 점을 찾아 점을 찍고, 그 점과 겉면의 한 점을 이은 선분을 4개 그어 보세요.')
    if lv == '기본형':
        s.text('도움: 원 안에 가장 긴 선분을 두 개 그으면 두 선분이 만나는 점이 가장 안쪽에 있는 점이에요.')
    s.ask('그은 선분 4개의 길이를 자로 재어 보세요.   (      ) cm, (      ) cm, (      ) cm, (      ) cm', blank=False)
    more = w_ask(s, lv, rec['ask'])
    return '모두 %s cm / %s' % (fmt(R), more)


def w_unroll(s, lv, rec):
    svg = cards_svg([('원기둥 모양의 통', rec['svg0']), ('잘라서 펼친 그림', rec['svg1'])], cols=2, cw=460, ch=400)
    pic(s, svg, 150)
    out = []
    for t in rec.get('thenText') or []:
        s.text(t)
    for r in rec.get('then') or []:
        out.append(run_rec(s, lv, r))
    return ' / '.join(x for x in out if x)


def w_netmark(s, lv, rec):
    pic(s, rec['net'], 80)
    more = w_ask(s, lv, rec['ask'])
    return '원 2개 ◯, 직사각형 △ / ' + more


def w_netjudge(s, lv, rec):
    nets = rec['nets']
    svg = cards_svg([(N['name'], N['svg']) for N in nets], cols=3, cw=200, ch=200)
    pic(s, svg, 140)
    s.text('전개도가 될 수 있을 것 같은 것을 먼저 예상해 보고, 접었을 때의 모양을 떠올려 확인해요.')
    s.ask('예상한 것:', answer_space=24)
    return w_ask(s, lv, rec['ask'])


def w_netdraw(s, lv, rec):
    R, Hh = rec['opt']['r'], rec['opt']['h']
    WW = r2(2 * R * PI)
    s.text('※ 아래 모눈은 실제 크기예요(한 칸 = 1 cm). 100%로 인쇄해요. 원은 컴퍼스로 그려요.')
    s.text('밑면의 반지름이 %s cm, 높이가 %s cm인 원기둥의 전개도를 모눈에 그려 보세요.' % (fmt(R), fmt(Hh)))
    if lv == '기본형':
        s.text('도움: 점 ㄱ에서 시작해 옆면(가로 %s cm, 세로 %s cm)을 먼저 그리고, 두 밑면을 옆면의 위쪽과 아래쪽에 하나씩 붙여 그려요.' % (fmt(WW), fmt(Hh)))
    # 옆면 + 두 밑면이 들어가는지 확인
    cols, rows, sx, sy = 17, 13, 1, 2 * R
    assert sx + WW <= cols and sy + Hh + 2 * R <= rows, '모눈이 작아요'
    pic_real(s, grid_svg(cols, rows, (sx, sy) if lv == '기본형' else None))
    more = w_ask(s, lv, rec['ask'])
    return '옆면 가로 %s cm·세로 %s cm, 반지름 %s cm인 원 2개를 위·아래에 하나씩 / %s' % (fmt(WW), fmt(Hh), fmt(R), more)


def w_view(s, lv, rec):
    pic(s, rec['svg0'], 62)
    s.text('이 입체도형을 앞·뒤·왼쪽·오른쪽·위·아래에서 본 모양을 떠올려 보세요.')
    return w_ask(s, lv, rec['ask'])


def w_make(s, lv, rec):
    svg = cards_svg([(x['name'], x['svg']) for x in rec['shapes']], cols=3, cw=150, ch=130)
    pic(s, svg, 100)
    s.text('공학 도구(알지오매스 키즈)에서 입체 도구를 골라 원기둥, 원뿔, 구를 만들어 보고, 만든 것에 ✓표 해요.')
    s.table([[x['name'] for x in rec['shapes']], ['(     )'] * len(rec['shapes'])])
    return '원기둥·원뿔·구를 만들면 ✓'


def w_riddle(s, lv, rec):
    objs = rec['objs']
    svg = cards_svg([(o['name'], o['svg']) for o in objs], cols=len(objs), cw=160, ch=140)
    pic(s, svg, 100)
    props = DATA['props']
    s.text('설명하는 말:')
    half = (len(props) + 1) // 2
    s.table([['(%d) %s' % (i + 1, props[i]['l']), '(%d) %s' % (i + 1 + half, props[i + half]['l']) if i + half < len(props) else '']
             for i in range(half)], header=False)
    s.text('답이 될 물건을 하나 고르고, 그 물건의 모양을 설명하는 말을 1~3개 골라 문제를 만들어 보세요. 답이 하나만 나와야 해요.')
    s.labeled([('내가 만든 문제', ''), ('답', '')], row_h=3969 * 2)
    # 예시 문제: 첫 물건만 맞는 설명 하나
    o0 = objs[0]
    ex = next(p for p in props if p['v'] == [o0['k']] and all(o['k'] not in p['v'] for o in objs[1:]))
    more = w_ask(s, lv, rec['ask'])
    return '예) %s 입체도형 모양의 물건은? → %s / %s' % (ex['c'], o0['name'], more)


def w_cardcheck(s, lv, rec):
    kn = DATA['kn']
    ks = ['cyl', 'cone', 'sph']
    s.text('카드마다 관계가 있는 입체도형에 모두 ○표 해요. 두 가지 이상과 관계있는 카드도 있어요.')
    rows = [['카드'] + [kn[k] for k in ks]]
    for c in rec['cards']:
        nm = c['name'] + (' (물건 그림)' if c['kind'] == 'o' else '')
        rows.append([nm] + [''] * 3)
    s.table(rows, col_mm=[96, 28, 28, 28])
    return ' / '.join('%s: %s' % (c['name'], ', '.join(kn[k] for k in c['rel'])) for c in rec['cards'])


def w_shout(s, lv, rec):
    kn = DATA['kn']
    cards = {c['id']: c for c in DATA['cards']}
    s.text('4명이 모둠을 만들어 해요. 차례가 되면 쌓아 둔 카드를 한 장 뒤집고, 정한 순서에 맞게 입체도형을 외쳐요. '
           '카드가 외친 입체도형과 관계가 있으면 “가져갈게!”, 없으면 “네 차례야.”라고 말해요.')
    s.ask('우리 모둠이 정한 외치는 순서:   (          ) → (          ) → (          )', blank=False)
    order = ['cone', 'cyl', 'sph']
    seq = [0, 9, 11, 19, 17, 2]     # 카드 번호(앱 CY6_CARDS)
    s.text('연습해요: 외치는 순서를 ‘%s’로 정했어요. 카드가 차례로 나왔을 때 알맞은 말에 ○표 해요.' % ', '.join(kn[k] for k in order))
    rows = [['차례', '뒤집은 카드', '외친 말', '가져갈게! / 네 차례야.']]
    ans = []
    for i, cid in enumerate(seq):
        c = cards[cid]
        e = order[i % 3]
        rows.append([str(i + 1), c['name'] + (' (물건 그림)' if c['kind'] == 'o' else ''), kn[e] + '!', '가져갈게! · 네 차례야.'])
        ans.append('%d %s' % (i + 1, '가져갈게!' if e in c['rel'] else '네 차례야.'))
    s.table(rows, col_mm=[14, 80, 24, 62])
    assert any(a.endswith('가져갈게!') for a in ans) and any(a.endswith('네 차례야.') for a in ans)
    return ', '.join(ans)


def w_namegame(s, lv, rec):
    kn = DATA['kn']
    s.text('놀이 전에 생각해 봐요: 입체도형 모양의 물건을 세 가지씩 써 보세요.')
    s.table([['', '물건 1', '물건 2', '물건 3']] + [[kn[k], '', '', ''] for k in ['cyl', 'cone', 'sph']])
    return '예) ' + ' / '.join('%s: %s' % (kn[k], ', '.join(DATA['bank'][k][:3])) for k in ['cyl', 'cone', 'sph'])


def w_tube(s, lv, rec):
    d = rec['opt'].get('d', 6)
    s.text('지름이 %s cm인 테니스공 2개를 통에 꼭 맞게 넣은 그림이에요.' % fmt(d))
    pic(s, rec['svg1'], 75)
    return w_ask(s, lv, rec['ask'])


def w_chain(s, lv, rec):
    out = []
    for p in rec['parts']:
        if p.get('title'):
            t = paper(p['title'])
            if t:
                s.text('▶ ' + t)
        for r in p['recs']:
            out.append(run_rec(s, lv, r))
    return ' / '.join(x for x in out if x)


WIDGETS = {'ask': w_ask, 'quiz': w_quiz, 'blanks': w_blanks, 'sequence': w_sequence, 'write': w_write, 'chain': w_chain,
           'cy6Pick': w_pick, 'cy6Sort': w_sort, 'cy6Tap': w_tap, 'cy6Ruler': w_ruler, 'cy6Spin': w_spin, 'cy6Gen': w_gen,
           'cy6Probe': w_probe, 'cy6Unroll': w_unroll, 'cy6NetMark': w_netmark, 'cy6NetJudge': w_netjudge, 'cy6NetDraw': w_netdraw,
           'cy6View': w_view, 'cy6Make': w_make, 'cy6Riddle': w_riddle, 'cy6CardCheck': w_cardcheck, 'cy6Shout': w_shout,
           'cy6NameGame': w_namegame, 'cy6Tube': w_tube}


def run_rec(s, lv, r):
    if r['t'] not in WIDGETS:
        raise RuntimeError('활동지에 아직 없는 부품: %s — gen_u6-cylinder.py의 WIDGETS에 더하세요' % r['t'])
    return WIDGETS[r['t']](s, lv, r)


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
        items = r.get('items') if r['t'] in ('ask',) else r.get('ask')
        for it in items or []:
            prev = ''
            for p in it.get('parts') or []:
                if 's' in p:
                    prev += p['s']
                elif 'n' in p:
                    out.append((prev, p['n'], it.get('q') or ''))
                    prev = ''
    return out


def check_numbers(D):
    """식이 적힌 칸은 식을 계산해 맞추고, 식이 없는 칸은 문제의 수로 따로 계산한 값과 맞춥니다."""
    seen = []
    for L in D['lessons']:
        sts = L['steps'] + ([L['challenge']] if L['challenge'] else [])
        for st in sts:
            for prev, n, q in all_nums(st['recs']):
                m = re.search(r'([\d.]+(?:\s*[−\-+×÷]\s*[\d.]+)+)\s*=\s*$', prev)
                if m:
                    e = m.group(1).replace('−', '-').replace('×', '*').replace('÷', '/')
                    v = eval(e, {'__builtins__': {}}, {})
                    assert abs(v - n) < 1e-9, ('식 계산이 달라요', L['no'], prev, n, v)
                seen.append(n)
    # 문제의 수로 따로 계산(앱 문제와 같은 수): 원주 = 지름 × 3.14 등
    expect = [r2(10 * PI), r2(4 * 2 * PI),                    # 1차시 원주
              r2(3 * 2 * PI), r2(2 * 2 * PI), r2(2.5 * 2 * PI),  # 3~4차시 옆면의 가로
              r2(6 * 2 * PI), r2(25.12 / PI), r2(51.96 - 8), r2((51.96 - 8) / PI),
              4 * 2, 6 * 2, math.hypot(6, 8), 8 * 2, 14 * 2, 5 * 2,   # 돌려 만든 도형의 지름·모선
              26 / 2, 14 / 2, r2(12 * 2 * PI),                    # 구
              5 * 2, math.hypot(5, 12), 4 * 2, 6 * 2, r2(6 * PI),  # 10차시
              r2(10 * PI), r2((r2(10 * PI) + 10) * 2)]
    for v in expect:
        assert any(abs(v - n) < 1e-9 for n in seen), ('앱 답 중에 없음', v)


# ================================================================ 차시
WHY = {   # 도전형 '왜' 쓰기(차시 id → 물음, 예시 답)
    't1': ('공 모양, 기둥 모양, 뿔 모양의 물건이 각각 어떤 점에서 다른지 써 보세요.',
           '예) 공 모양은 평평한 면이 없고, 기둥 모양은 평평한 원이 2개, 뿔 모양은 평평한 원이 1개이고 뾰족한 부분이 있어요.'),
    't2': ('누워 있는 원기둥에서 아래에 있는 면이 밑면이 아닌 까닭을 써 보세요.',
           '예) 밑면은 아래에 있는 면이 아니라 평행하고 합동인 두 원이기 때문이에요. 아래에 닿은 것은 굽은 옆면이에요.'),
    't34': ('원기둥의 전개도에서 옆면의 가로가 밑면의 둘레와 같아야 하는 까닭을 써 보세요.',
            '예) 옆면을 말아 접으면 옆면의 가로가 밑면의 둘레를 한 바퀴 감싸서 맞닿기 때문이에요.'),
    't5': ('원뿔에서 모선이 높이보다 긴 까닭을 써 보세요.',
           '예) 높이는 꼭짓점에서 밑면에 수직으로 내린 가장 짧은 길이이고, 모선은 비스듬히 이은 선분이라서 더 길어요.'),
    't6': ('구의 반지름이 셀 수 없이 많고 길이가 모두 같은 까닭을 써 보세요.',
           '예) 구의 중심에서 겉면의 어느 점까지나 거리가 같고, 겉면의 점은 셀 수 없이 많기 때문이에요.'),
    't78': ('원기둥과 원뿔을 위에서 본 모양은 같은데 앞에서 본 모양이 다른 까닭을 써 보세요.',
            '예) 둘 다 밑면이 원이라 위에서 보면 원이지만, 원기둥은 위아래 크기가 같아 직사각형, 원뿔은 위로 갈수록 좁아져 삼각형으로 보여요.'),
    't9': ('‘굽은 면이 있어요.’ 카드가 원기둥, 원뿔, 구 모두와 관계있는 까닭을 써 보세요.',
           '예) 원기둥의 옆면, 원뿔의 옆면, 구의 겉면이 모두 굽은 면이기 때문이에요.'),
    't10': ('원기둥, 원뿔, 구 가운데 두 가지를 골라 같은 점과 다른 점을 써 보세요.',
            '예) 원기둥과 원뿔은 밑면이 원이고 굽은 면이 있어요. 원기둥은 밑면이 2개이고 꼭짓점이 없지만, 원뿔은 밑면이 1개이고 꼭짓점이 1개 있어요.'),
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


def tb_lesson(s, lv, L, first, story):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if first and story:
        s.scene(None, story['lines'][0])
    ans = []
    for i, st_ in enumerate(L['steps']):
        s.step('%s %s' % (NUM[i], label_of(st_['name'])))
        show_inst(s, lv, st_['inst'], st_['hints'])
        ans.append('%s %s' % (NUM[i], ' / '.join(x for x in (run_rec(s, lv, r) for r in st_['recs']) if x)))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('challenge'):
            s.step('%s ★ 도전하기' % NUM[n], '앱의 도전 문제')
            show_inst(s, lv, L['challenge']['inst'], [])
            ans.append('%s %s' % (NUM[n], ' / '.join(x for x in (run_rec(s, lv, r) for r in L['challenge']['recs']) if x)))
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
    s = Sheet(unit_label='6-2 수학 %s(%s)' % (UNIT_NAME, label), level=lv, grade_label='6학년')
    if kind == 'tb':
        lines = [tb_lesson(s, lv, L, i == 0, D.get('story')) for i, L in enumerate(D['lessons'])]
    else:
        lines = [f(s, lv) for f in ST]
    s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT_NAME, label, lv), lines,
              note='※ 이 활동지는 앱 u6-cylinder.html과 차시 번호가 같습니다. 원주율은 3.14로 계산했어요. '
                   '전개도 그리기 모눈과 구의 단면 그림은 실제 크기이므로 100%로 인쇄하세요. 쓰기 칸의 ‘예)’는 예시 답이에요.')
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
