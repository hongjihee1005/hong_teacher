# -*- coding: utf-8 -*-
"""6-1 수학 5. 여러 가지 그래프 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u5-graph.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u5-graph.py tb       # 교과서 차시 버전만
    python3 gen_u5-graph.py dump     # 앱에서 읽은 자료(JSON)만 보기

앱 원본 ../units/u5-graph.tb.js('또래 상담실 여러 가지 그래프', 9차시 묶음: 1·2·3·4~5·6·7·8~9·10·11)의
LESSONS를 node에서 가짜 DOM으로 그대로 실행해, 단계마다 넘긴 물음·보기·정답·표·그래프 자료와 앱이 그린 그래프(SVG)를 모아 씁니다.
그래서 앱의 차시 번호·제목·S.O.O.P.·탐구 질문·수·정답이 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.

  - 묻고 답하기(gr5Ask·blanks·quiz·sequence·writeStep)는 앱의 물음을 그대로 옮기고, 기본형은 보기 고르기 + 도움 한 줄,
    도전형은 짧은 낱말 보기를 빈칸으로 바꾸고 앱의 도전 문제(challenge)와 '까닭 쓰기'를 더합니다.
  - 그래프 부분 누르기(gr5Pick)는 앱이 그린 그래프를 그대로 넣고 '찾아 써 보세요·○표 해 보세요'로 바꿉니다.
  - 띠·원 나누기(gr5Draw)와 공학 도구(gr5Maker)·주사위 놀이(gr5Dice)는 학생이 종이에 직접 그리도록 **실제 크기** 판을 줍니다
    (SVG 1 cm = 40 px, 그림 너비 mm = px ÷ 4, 100%로 인쇄):
      띠그래프 — 길이 20 cm 띠, 가장 작은 눈금 한 칸 1 %(2 mm), 10 %마다 수. 본문 너비(18 cm)보다 길어서 그림을 옆으로 눕혀 넣었어요
                 (종이를 시계 방향으로 돌려 놓고 그려요).
      원그래프 — 반지름 5 cm 원, 둘레에 눈금 100칸(한 칸 1 %), 0·25·50·75 수, 원의 중심 점.
    앱에서 '미리 나타내 둔' 항목(given)은 색칠하고 이름을 써 둡니다.
  - 쪽지 조사(gr5Survey)는 앱과 같은 차례의 쪽지 25장과 표시 표, 특징 카드(gr5Sort)는 번호를 쓰는 표,
    비율/실제 양(gr5Scaled)은 앱의 두 그림, 빙고(gr5Bingo)는 그래프 카드 12장과 빈 빙고판으로 바꿉니다.
  - 정답의 계산(백분율·누적 자리·실제 양)은 앱의 표와 그래프 자료에서 파이썬으로 다시 계산해 assert로 앱의 답과 맞춥니다(check_*).
  - 이야기 버전(ST)은 아직 없어서 건너뜁니다(앱 원본 u5-graph.st.js가 생기면 ST 목록에 더함).
그림은 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""

_EX = r'''// 앱 원본(u5-graph.tb.js)을 가짜 DOM에서 실행해 차시·단계·물음·보기·정답·표·그래프를 모읍니다.
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const FONT = process.argv[3];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let REC = [], INNER = 0;
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
  set className(v) { this.a.class = v; }
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
/* 차시 화면(body): 앱이 직접 붙이는 표·그래프·말풍선을 차례대로 기록 */
class Body extends El {
  append(...k) { super.append(...k); if (!INNER) for (const x of k.flat(9)) if (x instanceof El) REC.push(Object.assign({ t: 'el' }, serEl(x))); }
}
const document = { createElement: t => new El(t), createElementNS: (n, t) => new El(t), head: { append() {} }, body: new El('body') };
const performance = { now: () => 0 }, requestAnimationFrame = cb => { cb(1e9); return 0; }, setTimeout = () => 0, window = {};
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const plain = a && !(a instanceof El) && typeof a === 'object' && !Array.isArray(a); const e = new El(t, plain ? a : {}); if (!plain && a != null) e.append(a); e.append(...k); return e; };
function makeSvg(w, hgt) { return svgEl('svg', { viewBox: `0 0 ${w} ${hgt}` }); }
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
function dragOn() {} function svgPt() { return { x: 0, y: 0 }; }

function findAll(e, f, out) { out = out || []; if (e && typeof e === 'object' && e.kids) { if (f(e)) out.push(e); e.kids.forEach(k => findAll(k, f, out)); } return out; }
const hasCls = (e, c) => e instanceof El && (' ' + (e.a.class || '') + ' ').includes(' ' + c + ' ');
function click(root, label) { const b = findAll(root, e => e.tag === 'button' && e.textContent.trim() === label)[0]; if (!b) throw new Error('단추 없음: ' + label); b.on.onclick({ currentTarget: b, target: b }); }
const clean = s => String(s).replace(/​/g, '');
function serEl(v) {
  if (typeof v === 'function') v = v();
  if (!v || typeof v !== 'object') return v == null ? {} : { text: String(v) };
  if (v.tag === 'svg') return { figs: [{ svg: String(v), lead: null }] };
  if (hasCls(v, 'gr5tbl')) { const cap = findAll(v, e => hasCls(e, 'gr5cap'))[0]; return { table: findAll(v, e => e.tag === 'tr').map(tr => tr.children.map(c => clean(c.textContent))), cap: cap ? cap.textContent : null }; }
  if (hasCls(v, 'gr5say')) return { say: v.textContent };
  if (hasCls(v, 'gr5small')) return { small: v.textContent };
  if (findAll(v, e => hasCls(e, 'gr5calc')).length) return { calc: 1 };
  const svgs = findAll(v, e => e.tag === 'svg');
  if (svgs.length) {
    const figs = svgs.map(s => { const box = s.parent, ld = box ? box.children.find(c => hasCls(c, 'gr5lead')) : null; return { svg: String(s), lead: ld ? ld.textContent : null }; });
    return { figs };
  }
  return { text: v.textContent };
}
function serPart(p) {
  if (typeof p === 'string') return { s: p };
  if (p instanceof El) return { s: p.textContent };
  if (p.o) return { o: p.o, a: p.a, multi: !!p.multi };
  if ('n' in p) return { n: p.n };
  return { s: '' };
}
function serQ(it) { return { q: it.q || null, fig: it.fig ? serEl(it.fig) : null, o: it.o || null, a: it.a, parts: it.parts ? it.parts.map(serPart) : null }; }
function serOpt(o) {
  if (!o) return {};
  const r = {};
  for (const [k, v] of Object.entries(o)) { if (typeof v === 'function' || k === 'ask') continue; try { r[k] = JSON.parse(JSON.stringify(v)); } catch (e) { } }
  return r;
}
function sub(fn) { const save = REC; REC = []; fn(new Body('div'), api); const out = REC; REC = save; return out; }
function askOf(opt, data) { const a = typeof opt.ask === 'function' ? opt.ask(data) : opt.ask; return (a || []).map(serQ); }
function thenOf(opt) { return opt.then ? sub((b, x) => opt.then(new Body('div'), api)) : null; }

function quiz(b, a, items, opts) { if (!INNER) REC.push({ t: 'quiz', items: items.map(serQ), opts: serOpt(opts) }); }
function blanks(b, a, parts, opts) { if (!INNER) REC.push({ t: 'blanks', parts: parts.map(serPart), opts: serOpt(opts) }); }
function writeStep(b, a, items, opts) { if (!INNER) REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag, ph: x.ph })) }); }
function sequence(b, a, cards, order, opts) { if (!INNER) REC.push({ t: 'sequence', cards, order }); }

const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
const lesSrc = src.slice(src.indexOf('//@@LESSONS'));
eval((unitSrc + '\n' + lesSrc).replace(/^(const|let) /gm, 'var '));

const api = new Proxy({}, { get: () => () => {} });
gr5Ask = function (host, api, items, opts) { if (!INNER) REC.push({ t: 'ask', items: items.map(serQ), opts: serOpt(opts) }); };
gr5Chain = function (body, api, parts) { REC.push({ t: 'chain', parts: parts.map(p => ({ title: p.title || null, recs: sub(p.run || p) })) }); };
gr5Calc = function () { return h('div', { class: 'gr5calcwrap' }, h('div', { class: 'gr5calc' })); };
const ORIG = { gr5Scaled };
gr5Pick = function (body, api, opt) {
  const keysOf = q => q.at ? q.at.map(([g, i]) => opt.whole ? String(g) : `${g}-${i}`) : (Array.isArray(q.a) ? q.a.map(i => opt.whole ? String(i) : `0-${i}`) : [opt.whole ? String(q.a) : `0-${q.a}`]);
  const nameOf = k => { const [gi, i] = k.split('-').map(Number); const g = opt.figs[gi]; if (opt.whole) return opt.leads ? opt.leads[gi] : g.title; return g.items ? g.items[i].n : (g.names || g.xs)[i]; };
  INNER++; const figs = opt.figs.map((g, gi) => ({ svg: String(gr5Graph(g, { mini: opt.mini }).el), kind: g.kind, lead: opt.leads ? opt.leads[gi] : null })); INNER--;
  REC.push({ t: 'pick', figs, whole: !!opt.whole, qs: opt.qs.map(q => ({ q: q.q, names: keysOf(q).map(nameOf), multi: !!(q.multi || keysOf(q).length > 1) })),
    ask: askOf(opt), then: thenOf(opt), data: JSON.parse(JSON.stringify(opt.figs)) });
};
gr5Draw = function (body, api, opt) { gr5Chk(opt.g); REC.push({ t: 'draw', g: JSON.parse(JSON.stringify(opt.g)), given: opt.given || 0, label: opt.label !== false, ask: askOf(opt), then: thenOf(opt) }); };
gr5Maker = function (body, api, opt) { REC.push({ t: 'maker', head: opt.head, target: opt.target, unit: opt.unit || '명' }); };
gr5Survey = function (body, api, opt) {
  const seq = gr5Mix(opt.counts.flatMap((c, i) => Array(c).fill(i)), opt.seed || 11);
  REC.push({ t: 'survey', names: opt.names, counts: opt.counts, seq, ask: askOf(opt, opt.counts) });
};
gr5Sort = function (body, api, opt) { REC.push({ t: 'sort', bins: opt.bins, cards: opt.cards.map(c => ({ t: c.t, b: c.b })), order: gr5Mix(opt.cards.map((_, i) => i), opt.cards.length * 5 + 1) }); };
gr5Scaled = function (body, api, opt) {
  const fb = new El('div'); INNER++;
  ORIG.gr5Scaled(fb, api, opt); const pct = String(findAll(fb, e => e.tag === 'svg')[0]);
  click(fb, '실제 양으로 보기'); const abs = String(findAll(fb, e => e.tag === 'svg')[0]);
  INNER--;
  REC.push({ t: 'scaled', pct, abs, title: opt.title, years: opt.years, totals: opt.totals, names: opt.names, rows: opt.rows, unit: opt.unit, need: opt.need, ask: askOf(opt), then: thenOf(opt) });
};
gr5Bingo = function (body, api, opt) { INNER++; const cards = opt.cards.map(g => ({ svg: String(gr5Graph(g, { mini: true }).el), title: g.title, kind: g.kind, items: g.items })); INNER--; REC.push({ t: 'bingo', cards }); };
gr5Dice = function (body, api, opt) { REC.push({ t: 'dice', n: opt.n || 10 }); };

function cap(render) { REC = []; try { render(new Body('div'), api); } catch (e) { REC.push({ t: 'error', err: String(e.stack || e).slice(0, 600) }); } return REC; }
const OUT = { story: UNIT_STORY, lessons: LESSONS.map(L => ({ id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(s => ({ name: s.name, inst: s.inst, hints: s.hints || [], recs: cap(s.render) })),
  challenge: L.challenge ? { name: '도전하기', inst: L.challenge.inst, hints: L.challenge.hints || [], recs: cap(L.challenge.render) } : null })) };
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
SRC_TB = os.path.join(ROOT, '_build', 'units', 'u5-graph.tb.js')
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
NAME = '5단원_여러가지그래프_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫'
KO = '㉠㉡㉢㉣㉤㉥㉦'
WORK = tempfile.mkdtemp(prefix='u5graph_')
K = 40            # 실제 크기: 1 cm = 40 px → 그림 너비 mm = px ÷ 4
ST = []           # 이야기 버전 차시(아직 없음 — 원본이 생기면 더함)

INK, GRAY, RED, LINE = '#1D2A2A', '#7B8A8A', '#D64545', '#3B4A47'
COLS = ["#F6A89E", "#8FC3EA", "#A9D99B", "#F5D27B", "#C6B2E8", "#F7BC8C", "#9BD8CF", "#E9C7A8"]
ETC = "#DADFDD"


def fmt(v):
    if isinstance(v, (int, float)):
        v = round(float(v) * 10000) / 10000
        if v.is_integer():
            return str(int(v))
        return '%.10g' % v
    return str(v)


def plain(s):
    """앱 글 속 [14/40](세로 분수) → 14/40"""
    return paper(re.sub(r'\[(\d+)/(\d+)\]', r'\1/\2', s or ''))


# ================================================================ 앱 읽기(node)
def load(src):
    js = os.path.join(WORK, 'ex.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(_EX)
    r = subprocess.run(['node', js, src, FONT], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-3000:])
    d = json.loads(r.stdout)

    def walk(recs, where):
        for rec in recs:
            assert rec['t'] != 'error', (where, rec)
            for p in rec.get('parts', []) if rec['t'] == 'chain' else []:
                walk(p['recs'], where)
            if rec.get('then'):
                walk(rec['then'], where)
    for L in d['lessons']:
        for st in L['steps'] + ([L['challenge']] if L['challenge'] else []):
            walk(st['recs'], (L['no'], st['name']))
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
    s.picture(SHOT.png(svg, min(2400, max(900, mm * 9))), width_mm=mm)


def pic_real(s, svg):
    """실제 크기 그림: SVG 1 cm = 40 px → 너비 mm = px ÷ 4"""
    w, _ = vb_wh(svg)
    mm = w / 4
    assert mm <= 180, ('실제 크기 그림이 너무 넓어요', mm)
    s.picture(SHOT.png(svg, min(2600, w * 2.5)), width_mm=mm)


def _svg(w, h, body):
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s">%s</svg>' % (fmt(w), fmt(h), body)


def _t(x, y, t, size=15, fill=INK, anchor='middle', weight='normal'):
    return ('<text x="%s" y="%s" font-size="%s" text-anchor="%s" dominant-baseline="middle" font-family="%s" fill="%s" font-weight="%s">%s</text>'
            % (fmt(x), fmt(y), size, anchor, FONT.replace("'", '&apos;'), fill, weight,
               t.replace('&', '&amp;').replace('<', '&lt;')))


def _ln(a, b, col=INK, w=2):
    return ('<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" stroke-linecap="round"/>'
            % (fmt(a[0]), fmt(a[1]), fmt(b[0]), fmt(b[1]), col, w))


def inner(svg):
    return re.sub(r'^<svg[^>]*>', '', svg)[:-6]


def combine(figs, cols=2, gap=24, lead_h=34):
    """앱 그래프 여러 개를 한 그림으로(cols개씩 한 줄, 각 그림 위에 '가'·'나' 같은 이름)"""
    cells = []
    for f in figs:
        w, h = vb_wh(f['svg'])
        cells.append((f, w, h))
    cw = max(w for _, w, _ in cells)
    rows = [cells[i:i + cols] for i in range(0, len(cells), cols)]
    lh = lead_h if any(f.get('lead') for f in figs) else 0
    body, y = [], 0
    for row in rows:
        rh = max(h * cw / w for _, w, h in row) + lh
        for j, (f, w, h) in enumerate(row):
            x = j * (cw + gap)
            if f.get('lead'):
                body.append(_t(x + 8, y + lh / 2, f['lead'], 24, INK, 'start', 'bold'))
            body.append('<svg x="%s" y="%s" width="%s" height="%s" viewBox="0 0 %s %s">%s</svg>'
                        % (fmt(x), fmt(y + lh), fmt(cw), fmt(h * cw / w), fmt(w), fmt(h), inner(f['svg'])))
        y += rh + gap
    W = len(rows[0]) * cw + (len(rows[0]) - 1) * gap
    return _svg(W, y - gap, ''.join(body))


def show_figs(s, figs, whole=False):
    """띠·막대·꺾은선·그림그래프는 한 줄에 하나, 원그래프는 두 개씩 나란히"""
    i = 0
    while i < len(figs):
        f = figs[i]
        pie = '<path' in f['svg'] and vb_wh(f['svg'])[0] == 560
        if pie and i + 1 < len(figs) and vb_wh(figs[i + 1]['svg'])[0] == 560:
            pic(s, combine(figs[i:i + 2]), 170)
            i += 2
            continue
        if f.get('lead'):
            pic(s, combine([f], 1), 82 if pie else 150)
        else:
            pic(s, f['svg'], 82 if pie else 150)
        i += 1


# ================================================================ 실제 크기 그리기 판
def cum_of(items):
    out, c = [], 0
    for it in items:
        c = round((c + it['p']) * 1000) / 1000
        out.append(c)
    return out


def col_of(items, i):
    it = items[i]
    if it.get('c'):
        return it['c']
    if it['n'].startswith('기타'):
        return ETC
    return COLS[i % len(COLS)]


def band_real(items, given, title, data_line):
    """길이 20 cm 띠(가장 작은 눈금 한 칸 1 % = 2 mm). 본문(18 cm)에 들어가도록 눕혀서(시계 반대 방향 90°) 그려요."""
    L, x0 = 20 * K, 1.2 * K
    W = L + 2 * x0
    yT, yD, yN, bandY, BH = 0.55 * K, 1.35 * K, 2.25 * K, 3.0 * K, 1.6 * K
    H = bandY + BH + 3.2 * K
    X = lambda t: x0 + L * t / 100   # noqa: E731
    cum = cum_of(items)
    b = ['<rect x="0" y="0" width="%s" height="%s" fill="#fff"/>' % (fmt(W), fmt(H))]
    b.append(_t(W / 2, yT, title, 17, INK, weight='bold'))
    b.append(_t(W / 2, yD, data_line, 14, INK))
    b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="#fff" stroke="%s" stroke-width="2"/>' % (fmt(x0), fmt(bandY), fmt(L), fmt(BH), LINE))
    for i in range(given):
        a = cum[i] - items[i]['p']
        b.append('<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="2"/>'
                 % (fmt(X(a)), fmt(bandY), fmt(L * items[i]['p'] / 100), fmt(BH), col_of(items, i), LINE))
        cx = X(a + items[i]['p'] / 2)
        b.append(_t(cx, bandY + BH * .36, items[i]['n'], 14))
        b.append(_t(cx, bandY + BH * .70, '(%s %%)' % fmt(items[i]['p']), 14))
    for t in range(101):
        ln = 0.42 * K if t % 10 == 0 else 0.3 * K if t % 5 == 0 else 0.18 * K
        b.append(_ln((X(t), bandY - ln), (X(t), bandY), LINE, 1.6 if t % 10 == 0 else 1))
        if t % 10 == 0:
            b.append(_t(X(t), yN, str(t), 14, GRAY))
    b.append(_t(W - 6, yN - 0.5 * K, '(%)', 12, GRAY, 'end'))
    # 눕히기: (x, y) → (y, W − x)  → 종이를 시계 방향으로 돌리면 바로 보여요
    return _svg(H, W, '<g transform="translate(0 %s) rotate(-90)">%s</g>' % (fmt(W), ''.join(b)))


def pie_real(items, given, R=5):
    """반지름 5 cm 원(둘레 눈금 100칸, 한 칸 1 %), 0·25·50·75 수, 원의 중심"""
    r = R * K
    m = 1.1 * K
    W = H = 2 * (r + m)
    c = (W / 2, H / 2)
    P = lambda rr, t: (c[0] + rr * math.sin(t / 50 * math.pi), c[1] - rr * math.cos(t / 50 * math.pi))   # noqa: E731
    cum = cum_of(items)
    b = ['<rect x="0" y="0" width="%s" height="%s" fill="#fff"/>' % (fmt(W), fmt(H)),
         '<circle cx="%s" cy="%s" r="%s" fill="#fff"/>' % (fmt(c[0]), fmt(c[1]), fmt(r))]
    for i in range(given):
        a, e = cum[i] - items[i]['p'], cum[i]
        p0, p1 = P(r, a), P(r, e)
        b.append('<path d="M%s %sL%s %sA%s %s 0 %d 1 %s %sZ" fill="%s" stroke="%s" stroke-width="2"/>'
                 % (fmt(c[0]), fmt(c[1]), fmt(p0[0]), fmt(p0[1]), fmt(r), fmt(r), 1 if e - a > 50 else 0,
                    fmt(p1[0]), fmt(p1[1]), col_of(items, i), LINE))
        q = P(r * .58, a + items[i]['p'] / 2)
        b.append(_t(q[0], q[1] - 10, items[i]['n'], 15))
        b.append(_t(q[0], q[1] + 11, '(%s %%)' % fmt(items[i]['p']), 15))
    for t in range(100):
        ln = 0.32 * K if t % 25 == 0 else 0.22 * K if t % 5 == 0 else 0.12 * K
        b.append(_ln(P(r, t), P(r + ln, t), LINE, 1.5 if t % 5 == 0 else 1))
    for t in (0, 25, 50, 75):
        q = P(r + 0.65 * K, t)
        b.append(_t(q[0], q[1], str(t), 15, GRAY))
    b.append('<circle cx="%s" cy="%s" r="%s" fill="none" stroke="%s" stroke-width="2.4"/>' % (fmt(c[0]), fmt(c[1]), fmt(r), LINE))
    b.append('<circle cx="%s" cy="%s" r="4" fill="%s"/>' % (fmt(c[0]), fmt(c[1]), INK))
    return _svg(W, H, ''.join(b))


# ================================================================ 앱 물음 → 활동지
SYM = ('>', '=', '<', '÷', '×', '+', '−')


def blankable(p):
    """도전형에서 빈칸으로 바꿀 보기: 짧은 낱말 보기 셋 이상(기호·여러 개 고르기 제외)"""
    o = p['o']
    return (not p['multi'] and len(o) >= 3 and all(len(x) <= 6 for x in o)
            and not any(x in SYM or x[0] in KO for x in o))


def right(p):
    if 'n' in p:
        return fmt(p['n'])
    if p['multi']:
        return ', '.join(p['o'][i] for i in p['a'])
    return p['o'][p['a']]


def is_long(p):
    return 'o' in p and (any(len(x) > 16 for x in p['o']) or p['multi'])


def sentence(parts, lv):
    """parts → (문장, 정답 목록, 긴 보기 목록)"""
    out, ans, longs = [], [], []
    for p in parts:
        if 's' in p:
            out.append(plain(p['s']))
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


def put_el(s, el):
    """앱이 화면에 붙인 표·그래프·말풍선"""
    if not el:
        return
    if el.get('table'):
        rows = el['table']
        if el.get('cap'):
            s.text('〈%s〉' % el['cap'])
        n = max(len(r) for r in rows)
        first = 34 if n >= 6 else 40
        rest = (180 - first) / (n - 1)
        s.table(rows, header=True, header_col=True, col_mm=[first] + [rest] * (n - 1), row_h=3118)
    elif el.get('figs'):
        show_figs(s, el['figs'])
    elif el.get('say'):
        s.text(el['say'])
    elif el.get('small'):
        s.text(el['small'])
    elif el.get('text'):
        s.text(el['text'])


def render_items(s, lv, items):
    """gr5Ask 묶음 → 정답 글"""
    ans_all, buf = [], []

    def flush():
        if buf:
            s.fill(list(buf))
            buf.clear()
    for it in items:
        if it.get('fig') or it.get('q'):
            flush()
        if it.get('q'):
            s.text(plain(it['q']))
        put_el(s, it.get('fig'))
        sent, ans, longs = sentence(it['parts'] or [], lv)
        for p in longs:
            flush()
            if sent:
                s.fill(sent)
                sent = ''
            s.text('보기  ' + opt_list(p['o']))
        if sent:
            buf.append(sent)
        ans_all.append(', '.join((long_ans(p) + ' ' + right(p)) if p in longs else a
                                 for p, a in zip([q for q in it['parts'] if 's' not in q], ans)))
    flush()
    return '; '.join(a for a in ans_all if a)


def render_quiz(s, lv, items):
    ans = []
    for k, it in enumerate(items):
        q = ('%d. ' % (k + 1) if len(items) > 1 else '') + plain(it['q'] or '')
        o, a = it['o'], it['a']
        multi = isinstance(a, list)
        if it.get('fig'):
            s.text(q)
            put_el(s, it['fig'])
            q = None
        if not multi and all(len(x) <= 12 for x in o) and sum(len(x) for x in o) <= 30:
            s.choices([(q or '알맞은 것에 ○표 해 보세요.', '( ' + ' / '.join(o) + ' )')])
            ans.append(o[a])
        else:
            if q:
                s.text(q + (' (모두 고르기)' if multi and '모두' not in q else ''))
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


def render_sequence(s, lv, rec):
    s.fill(rec['cards'])
    s.ask('차례대로 기호를 써 보세요.   ' + ' → '.join(['(    )'] * len(rec['cards'])), blank=False)
    return ' → '.join(rec['cards'][i][0] for i in rec['order'])


def render_recs(s, lv, recs, st, D):
    out = []
    for r in recs:
        a = render_rec(s, lv, r, st, D)
        if a:
            out.append(a)
    return '; '.join(out)


def render_rec(s, lv, rec, st, D):
    t = rec['t']
    if t == 'el':
        if not rec.get('calc'):
            put_el(s, rec)
        return ''
    if t == 'quiz':
        return render_quiz(s, lv, rec['items'])
    if t == 'ask':
        return render_items(s, lv, rec['items'])
    if t == 'blanks':
        sent, ans, longs = sentence(rec['parts'], lv)
        for p in longs:
            s.text('보기  ' + opt_list(p['o']))
        s.fill(sent)
        return ', '.join((long_ans(p) + ' ' + right(p)) if p in longs else a
                         for p, a in zip([q for q in rec['parts'] if 's' not in q], ans))
    if t == 'write':
        return render_write(s, lv, rec['items'])
    if t == 'sequence':
        return render_sequence(s, lv, rec)
    if t == 'chain':
        out = []
        for k, part in enumerate(rec['parts']):
            if len(rec['parts']) > 1:
                s.text('⑴⑵⑶⑷⑸'[k])
            out.append('⑴⑵⑶⑷⑸'[k] + ' ' + render_recs(s, lv, part['recs'], None, D))
        return ' '.join(out)
    return HANDLERS[t](s, lv, rec, st, D)


def after(s, lv, rec, pre=''):
    parts = [pre] if pre else []
    if rec.get('then'):
        parts.append(render_recs(s, lv, rec['then'], None, D_REF[0]))
    if rec.get('ask'):
        parts.append(render_items(s, lv, rec['ask']))
    return '; '.join(x for x in parts if x)


# ---------------------------------------------------------------- 조작 활동(종이에서 하는 말로)
def pick_q(q, whole):
    t = q['q']
    mark = False
    if whole:
        return t + '  → 알맞은 그래프의 기호를 써 보세요.', False
    for a, b in [('의 막대를 눌러요.', '을 써 보세요.'), ('의 점을 눌러요.', '를 써 보세요.'),
                 ('부분을 각각 눌러요.', '부분을 각각 찾아 ○표 해 보세요.'), ('부분을 눌러요.', '부분을 찾아 ○표 해 보세요.'),
                 ('눌러요.', '써 보세요.')]:
        if t.endswith(a):
            mark = '○표' in b
            t = t[:-len(a)] + b
            break
    return t, mark


def h_pick(s, lv, rec, st, D):
    show_figs(s, rec['figs'], rec['whole'])
    out = []
    for k, q in enumerate(rec['qs']):
        t, mark = pick_q(q, rec['whole'])
        pre = '%d. ' % (k + 1) if len(rec['qs']) > 1 else ''
        if mark:
            s.ask(pre + t, blank=False)
        else:
            s.ask(pre + t, answer_space=16 if q['multi'] else 10)
        out.append(pre + ', '.join(q['names']) + (' (○표)' if mark else ''))
    return after(s, lv, rec, ' '.join(out))


def draw_scaffold(s, lv, items, given, band):
    cum = cum_of(items)
    if lv == '기본형':
        head = ['항목'] + [it['n'] for it in items]
        row1 = ['백분율(%)'] + [fmt(it['p']) for it in items]
        row2 = ['선을 긋는 자리(%)'] + [fmt(cum[i]) if i < given else ('(      )' if i < len(items) - 1 else '100') for i in range(len(items))]
        n = len(head)
        s.table([head, row1, row2], header=True, header_col=True, col_mm=[40] + [140 / (n - 1)] * (n - 1), row_h=3402)
        s.text('도움: 앞 항목이 끝난 자리에서 이어서 백분율만큼 더 가요. %s' %
               ('띠의 가장 작은 눈금 한 칸은 1 %예요.' if band else '원의 중심에서 눈금까지 선을 그어요. 작은 눈금 한 칸은 1 %예요.'))


def h_draw(s, lv, rec, st, D):
    g, given = rec['g'], rec['given']
    items, band = g['items'], g['kind'] == 'band'
    cum = cum_of(items)
    assert abs(cum[-1] - 100) < 1e-9
    data = ', '.join('%s %s %%' % (it['n'], fmt(it['p'])) for it in items)
    draw_scaffold(s, lv, items, given, band)
    s.page_break()
    if not band:
        s.text('나타낼 자료: ' + data)
    if band:
        s.text('띠그래프 그리기 판(실제 크기, 띠의 길이 20 cm)이에요. 종이를 시계 방향으로 돌려 놓고 그려요.')
        s.text(('%s 이전 항목에 이어서 백분율만큼 선을 그어 띠를 나누고, 나눈 부분에 내용과 백분율을 써요. 띠 안에 쓰기 어려우면 화살표를 그어 띠 밖에 써요.'
               % ('색칠한 부분은 미리 나타내 두었어요.' if given else '')).strip())
        pic_real(s, band_real(items, given, '%s' % g['title'], '나타낼 자료: ' + data))
    else:
        s.text('원그래프 그리기 판(실제 크기, 반지름 5 cm, 눈금 100칸)이에요. %s원의 중심에서 눈금까지 선을 그어 이전 항목에 이어서 백분율만큼 원을 나누고, 나눈 부분에 내용과 백분율을 써요.'
               % ('색칠한 부분은 미리 나타내 두었어요. ' if given else ''))
        pic_real(s, pie_real(items, given))
    if not any('제목' in json.dumps(it, ensure_ascii=False) for it in rec.get('ask') or []):
        s.fill('그래프의 제목: (                                                    )')
    pre = '선의 자리 %s %% (%s)' % (', '.join(fmt(c) for c in cum[given:-1]), ' | '.join('%s %s %%' % (it['n'], fmt(it['p'])) for it in items))
    return after(s, lv, rec, pre)


def h_maker(s, lv, rec, st, D):
    T = rec['target']
    tot = sum(c for _, c in T)
    pct = [c * 100 / tot for _, c in T]
    assert all(abs(p * 10 - round(p * 10)) < 1e-9 for p in pct)
    s.text('교과서에서는 공학 도구(EBSMath 이지통계)로 그래프를 그려요. 종이에서는 표를 정리하고 원그래프로 나타내 보세요.')
    s.fill('표의 제목: (                                                    )')
    rows = [[rec['head'], '학생 수(%s)' % rec['unit'], '백분율(%)']] + [[n, '(      )', '(      )'] for n, _ in T] + [['합계', '(      )', '(      )']]
    s.table(rows, header=True, col_mm=[70, 55, 55], row_h=2835)
    items = [{'n': n, 'p': p} for (n, _), p in zip(T, pct)]
    s.page_break()
    s.text('원그래프 그리기 판(실제 크기, 반지름 5 cm, 눈금 100칸)이에요. 원의 중심에서 눈금까지 선을 그어 나누고, 나눈 부분에 내용과 백분율을 써요.')
    pic_real(s, pie_real(items, 0))
    s.fill(['그래프의 제목: (                                                    )',
            '크기순으로 항목을 정렬할 때 ‘기타’는 ( 맨 앞 / 맨 나중 )에 놓아요.'])
    cum = cum_of(items)
    return ('표 %s, 합계 %d명 / 백분율 %s, 합계 100 %% / 선의 자리 %s %% / 제목 예: %s의 비율 / 기타는 맨 나중'
            % (', '.join('%s %d' % (n, c) for n, c in T), tot, ', '.join(fmt(p) for p in pct),
               ', '.join(fmt(c) for c in cum[:-1]), '친구에게 듣고 싶어 하는 말별 학생 수'))


def h_survey(s, lv, rec, st, D):
    names, seq = rec['names'], rec['seq']
    assert sorted(seq) == sorted(i for i, c in enumerate(rec['counts']) for _ in range(c))
    s.text('학생 %d명이 낸 설문 쪽지예요(앱과 같은 차례). 쪽지를 하나씩 읽으면서 아래 표에 바를 정(正) 자로 표시해요.' % len(seq))
    cells = ['%d. %s' % (k + 1, names[i]) for k, i in enumerate(seq)]
    rows = [cells[i:i + 5] for i in range(0, len(cells), 5)]
    s.table(rows, header=False, col_mm=[36] * 5, row_h=2835)
    s.table([['듣고 싶어 하는 말'] + names, ['표시'] + [''] * len(names), ['학생 수(명)'] + ['(    )'] * len(names)],
            header=True, header_col=True, col_mm=[30] + [150 / len(names)] * len(names), row_h=3969)
    return after(s, lv, rec)


def h_sort(s, lv, rec, st, D):
    cards = rec['cards']
    order = rec['order']
    num = {ci: NUM[k] for k, ci in enumerate(order)}
    s.fill(['%s %s' % (NUM[k], cards[ci]['t']) for k, ci in enumerate(order)])
    s.table([rec['bins'], ['', '', '', '']], header=True, col_mm=[45] * 4, row_h=4536)
    return ' / '.join('%s: %s' % (b, ', '.join(num[ci] for ci in sorted(order, key=lambda c: num[c]) if cards[ci]['b'] == bi))
                      for bi, b in enumerate(rec['bins']))


def h_scaled(s, lv, rec, st, D):
    s.text('비율로 보기: 띠의 길이가 모두 같아요.')
    pic(s, rec['pct'], 160)
    s.text('실제 양으로 보기: 띠의 길이가 그해의 전체 인구에 비례해요.')
    pic(s, rec['abs'], 160)
    s.text('띠의 부분은 왼쪽부터 ' + ', '.join(rec['names']) + '이에요. 띠 안의 수는 백분율(%)이에요(좁은 강원권·제주권은 수를 쓰지 않았어요).')
    return after(s, lv, rec, '제주권 ○표(2000년·2010년)')


def bingo_svg(cards):
    cw, ch, gap, top = 360, 300, 22, 40
    b = []
    for k, c in enumerate(cards):
        x, y = (k % 4) * (cw + gap), (k // 4) * (ch + top + gap)
        w, h = vb_wh(c['svg'])
        sc = min(cw / w, ch / h)
        b.append('<rect x="%s" y="%s" width="%s" height="%s" rx="10" fill="#fff" stroke="#9AA8A4" stroke-width="2"/>' % (x, y + top, cw, ch))
        b.append(_t(x + 6, y + top / 2, NUM[k], 26, INK, 'start', 'bold'))
        b.append('<svg x="%s" y="%s" width="%s" height="%s" viewBox="0 0 %s %s">%s</svg>'
                 % (fmt(x + (cw - w * sc) / 2), fmt(y + top + (ch - h * sc) / 2), fmt(w * sc), fmt(h * sc), fmt(w), fmt(h), inner(c['svg'])))
    return _svg(4 * cw + 3 * gap, 3 * (ch + top + gap) - gap, ''.join(b))


def h_bingo(s, lv, rec, st, D):
    cards = rec['cards']
    assert len(cards) == 12
    s.text('친구와 함께 놀이해요. 그래프 카드 12장 중 9장을 골라 번호를 빙고판에 써요(앞의 두 장은 교과서의 예, 나머지는 앱과 같은 그래프예요).')
    pic(s, bingo_svg(cards), 172)
    s.text('나의 빙고판 — 고른 그래프 카드의 번호를 써요. 친구가 말한 내용에 알맞은 그래프가 있으면 ◯표 해요.')
    s.table([['', '', ''], ['', '', ''], ['', '', '']], header=False, col_mm=[40, 40, 40], row_h=4536)
    s.ask('내 차례에 한 그래프를 설명한 말(제목은 말하지 않아요):', blank=False)
    s.lines(2)
    ex = cards[0]
    top = max(ex['items'], key=lambda it: it['p'])
    jo = '이에요' if (ord(top['n'][-1]) - 0xAC00) % 28 else '예요'
    return '(놀이) 예: ①번 — 비율이 가장 높은 것은 %s(%s %%)%s.' % (top['n'], fmt(top['p']), jo)


def h_dice(s, lv, rec, st, D):
    n = rec['n']
    s.text('주사위 2개를 동시에 %d번 던져 두 눈의 수의 차를 기록해요.' % n)
    s.table([['번째'] + [str(i + 1) for i in range(n)], ['두 눈의 수'] + [''] * n, ['차'] + [''] * n],
            header=True, header_col=True, col_mm=[30] + [150 / n] * n, row_h=3402)
    s.table([['두 눈의 수의 차', '0', '1', '2', '3', '4', '5', '합계'], ['횟수(번)'] + ['(   )'] * 6 + [str(n)], ['백분율(%)'] + ['(   )'] * 6 + ['100']],
            header=True, header_col=True, col_mm=[40] + [20] * 7, row_h=3402)
    s.text('%d번 던졌으니 한 번은 전체의 %s %%예요.' % (n, fmt(100 / n)))
    s.page_break()
    s.text('띠그래프 그리기 판(실제 크기, 띠의 길이 20 cm)이에요. 종이를 시계 방향으로 돌려 놓고, 나온 차의 백분율만큼 띠를 나누어 내용과 백분율을 써요.')
    pic_real(s, band_real([{'n': '', 'p': 100}], 0, '두 눈의 수의 차별 나온 횟수의 비율', '내가 던진 결과로 나타내요. (차 0 ~ 차 5, 나오지 않은 차는 빼요)'))
    s.ask('두 눈의 수의 차가 3인 횟수의 비율은 몇 %인가요?')
    return '(결과에 따라 다름) 백분율 = 횟수 × %s; 합계 100 %%; 많이 던질수록 차가 1인 경우가 가장 많이 나오는 편' % fmt(100 / n)


HANDLERS = {'pick': h_pick, 'draw': h_draw, 'maker': h_maker, 'survey': h_survey, 'sort': h_sort,
            'scaled': h_scaled, 'bingo': h_bingo, 'dice': h_dice}
OWN_INST = {'maker', 'bingo'}       # 처리기가 종이용 안내를 따로 씀
D_REF = [None]

PAPER = [
    ('배울 차례대로 스티커를 붙이듯 눌러 보세요.', '배울 차례대로 기호를 써 보세요.'),
    ('두 그래프에서 같은 고민거리를 찾아 눌러 보세요.', '두 그래프에서 같은 고민거리를 찾아 ○표 해 보세요.'),
    ('‘진로’ 부분을 누르고,', '‘진로’ 부분에 ○표 하고,'),
    ('쪽지를 한 장씩 읽고 알맞은 칸을 눌러 표시한 다음 표를 완성해요.', '쪽지를 한 장씩 읽고 표에 표시한 다음 표를 완성해요.'),
    ('카드를 하나 골라 알맞은 그래프 칸을 눌러 넣어 보세요.', '카드의 번호를 알맞은 그래프 칸에 써 보세요.'),
    ('‘비율로 보기’와 ‘실제 양으로 보기’를 번갈아 누르고, 2000년과 2010년의 ‘제주권’ 부분을 눌러 보세요.',
     '‘비율로 보기’와 ‘실제 양으로 보기’ 그림을 견주어 보고, 두 그림에서 2000년과 2010년의 ‘제주권’ 부분에 ○표 해 보세요.'),
    ('준비하기와 놀이 방법을 차례대로 눌러 보세요.', '준비하기와 놀이 방법을 차례대로 기호로 써 보세요.'),
    ('친구가 말한 내용에 알맞은 그래프를 눌러 보세요.', '친구가 말한 내용에 알맞은 그래프의 기호를 써 보세요.'),
    ('쪽지에 쓰인 말과 같은 칸을 눌러요.', '쪽지에 쓰인 말과 같은 칸에 표시해요.'),
    ('‘항목 정렬’을 누르면 크기순으로 정렬돼요.', '크기순으로 정렬할 때 기타는 맨 나중에 놓아요.'),
    ('(이 앱이 정한 수)', '(앱과 같은 수)'), ('(이 앱이 정한 예)', '(앱과 같은 예)'), ('이 앱이 정한', '앱과 같은'), ('이 앱이 정했어요', '앱과 같게 정했어요'),
]

WHY = {
    '1': ('페트병의 재활용 용도별 비율을 나타낼 때 띠그래프나 원그래프가 필요한 까닭을 써 보세요.',
          '옷·솜·부직포가 전체 재활용 양에서 각각 몇 %인지 한눈에 비교할 수 있기 때문이에요.'),
    '2': ('띠그래프와 원그래프의 같은 점과 다른 점을 한 가지씩 써 보세요.',
          '같은 점: 전체에 대한 각 부분의 비율을 나타내고 백분율의 합계가 100 %예요. 다른 점: 띠그래프는 띠 모양, 원그래프는 원 모양이에요.'),
    '3': ('원그래프를 그릴 때 원의 중심에서 눈금까지 선을 그어야 하는 까닭을 써 보세요.',
          '원의 중심을 지나지 않게 나누면 나눈 부분의 크기가 백분율과 맞지 않기 때문이에요.'),
    '4~5': ('반올림한 백분율의 합계가 100 %가 되지 않을 때 어떻게 하는지 까닭과 함께 써 보세요.',
            '전체는 100 %이므로 반올림 값을 맞추어(예: 33.3 % → 33.4 %) 합계가 100 %가 되게 해요.'),
    '6': ('두 띠그래프를 견주어 알 수 있는 사실 한 가지를 그래프의 수를 근거로 써 보세요.',
          '(예) 편지 상담의 비율은 5학년 15 %, 6학년 22 %로 6학년이 더 높아요.'),
    '7': ('같은 산불 자료를 막대그래프와 원그래프로 나타내면 각각 무엇을 알아보기 편리한지 써 보세요.',
          '막대그래프는 요일별 발생 건수의 많고 적음을, 원그래프는 계절별 발생 건수의 비율을 한눈에 알아보기 편리해요.'),
    '8~9': ('비율이 같은데 실제 양이 다를 수 있는 까닭을 써 보세요.',
            '실제 양은 (전체의 양)×(비율)이어서 전체의 양이 다르면 비율이 같아도 실제 양이 달라지기 때문이에요.'),
    '10': ('빙고 카드 ①(기부한 물품별 학생 수의 비율)을 보고 알 수 있는 내용을 두 가지 써 보세요(제목은 말하지 않아요).',
           '(예) 비율이 가장 높은 것은 학용품(35 %)이에요. 학용품과 옷의 비율을 합하면 50 %예요.'),
    '11': ('국토의 용도별 면적 비율을 그림그래프로 나타내기 알맞지 않은 까닭을 써 보세요.',
           '그림그래프는 수량의 많고 적음을 나타내기 알맞고, 전체에 대한 각 부분의 비율은 띠그래프나 원그래프로 나타내야 한눈에 알아볼 수 있기 때문이에요.'),
}


def paper(t):
    for a, b in PAPER:
        t = t.replace(a, b)
    return t


def has_num(recs):
    for r in recs:
        for it in r.get('items', []) + r.get('ask', []):
            if any('n' in p for p in (it.get('parts') or [])):
                return True
        for part in r.get('parts', []) if r['t'] == 'chain' else []:
            if has_num(part['recs']):
                return True
    return False


def all_recs(recs):
    for r in recs:
        yield r
        if r['t'] == 'chain':
            for p in r['parts']:
                yield from all_recs(p['recs'])
        if r.get('then'):
            yield from all_recs(r['then'])


def do_step(s, lv, i, st, D):
    s.step('%s %s' % (NUM[i], st['name']))
    kinds = {r['t'] for r in all_recs(st['recs'])}
    if not kinds & OWN_INST:
        s.text(paper(st['inst']))
    if lv == '기본형' and st['hints'] and has_num(st['recs']):
        s.text('도움: ' + plain(st['hints'][0]))
    return NUM[i] + ' ' + render_recs(s, lv, st['recs'], st, D)


def lesson(s, lv, L, D):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    out = [do_step(s, lv, i, st, D) for i, st in enumerate(L['steps'])]
    if lv == '도전형':
        n = len(L['steps'])
        if L['challenge']:
            out.append(do_step(s, lv, n, L['challenge'], D))
            n += 1
        q, a = WHY[str(L['no'])]
        s.step('%s 까닭 쓰기' % NUM[n])
        s.ask(q, blank=False)
        s.lines(2)
        out.append(NUM[n] + ' ' + a)
    return '%s차시  ' % L['no'] + '   '.join(out)


# ================================================================ 앱의 수를 따로 다시 계산해 맞추기
def check_numbers(D):
    n_chk = 0

    def nums_in(recs):
        for r in all_recs(recs):
            for it in r.get('items', []) + r.get('ask', []):
                yield it.get('parts') or []
            if r['t'] == 'blanks':
                yield r['parts']

    for L in D['lessons']:
        for st in L['steps'] + ([L['challenge']] if L['challenge'] else []):
            recs = list(all_recs(st['recs']))
            # 문장 속 계산: [a/b] × 100 = □, a × b ≈ □, a − b − … = □
            for parts in nums_in(st['recs']):
                for k, p in enumerate(parts):
                    if 'n' not in p or k == 0 or 's' not in parts[k - 1]:
                        continue
                    pre = parts[k - 1]['s']
                    m = re.search(r'\[(\d+)/(\d+)\] × 100 = $', pre)
                    if m:
                        assert abs(int(m.group(1)) / int(m.group(2)) * 100 - p['n']) < 1e-9, (L['no'], pre, p)
                        n_chk += 1
                    m = re.search(r'(\d+) × ([\d.]+) ≈ $', pre)
                    if m:
                        assert round(int(m.group(1)) * float(m.group(2))) == p['n'], (L['no'], pre, p)
                        n_chk += 1
                    m = re.search(r'(\d+) × ([\d.]+) = ([\d.]+)이므로 약 $', pre)
                    if m:
                        v = int(m.group(1)) * float(m.group(2))
                        assert abs(v - float(m.group(3))) < 1e-6 and round(v) == p['n'], (L['no'], pre, p)
                        n_chk += 1
                    m = re.search(r'(\d+(?: − \d+)+) = $', pre)
                    if m:
                        a = [int(x) for x in m.group(1).split(' − ')]
                        assert a[0] - sum(a[1:]) == p['n'], (L['no'], pre, p)
                        n_chk += 1
            # 표(학생 수) → 다음 그래프·백분율 답
            tables = [r for r in recs if r['t'] == 'el' and r.get('table')]
            for tb in tables:
                rows = tb['table']
                cnt = next((r for r in rows if r[0].startswith('학생 수')), None)
                if not cnt or '( )' in cnt or '' in cnt[1:]:
                    continue
                names, vals = rows[0][1:-1], [int(x) for x in cnt[1:-1]]
                assert sum(vals) == int(cnt[-1]), (L['no'], rows)
                pct = [v * 100 / sum(vals) for v in vals]
                for r in recs:
                    if r['t'] == 'draw' and [it['n'] for it in r['g']['items']] == names:
                        assert all(abs(it['p'] - q) < 1e-9 for it, q in zip(r['g']['items'], pct)), (L['no'], names)
                        n_chk += 1
                    for parts in ([it['parts'] for it in r.get('items', [])] if r['t'] == 'ask' else []):
                        for k, p in enumerate(parts):
                            if 'n' in p and k and 's' in parts[k - 1]:
                                nm = re.sub(r'[\s,]+$', '', parts[k - 1]['s'].split(',')[-1]).strip()
                                nm = re.sub(r'^.*%\s*', '', nm).strip()
                                if nm in names:
                                    assert abs(pct[names.index(nm)] - p['n']) < 1e-9, (L['no'], nm, p, pct)
                                    n_chk += 1
            for r in recs:
                if r['t'] == 'draw':
                    assert abs(sum(it['p'] for it in r['g']['items']) - 100) < 1e-9
                if r['t'] == 'survey':
                    ask = r['ask']
                    got = [p['n'] for p in ask[0]['parts'] if 'n' in p]
                    assert got == r['counts'], (got, r['counts'])
                    n_chk += 1
                if r['t'] == 'scaled':
                    for parts in [it['parts'] for it in r['ask']]:
                        pass
    # 반올림 맞추기(4~5차시): 7 ÷ 21 × 100
    v = round(7 / 21 * 100, 1)
    assert v == 33.3 and round(3 * v, 1) == 99.9
    return n_chk


def build(D, label, short, outdir, lv):
    D_REF[0] = D
    s = Sheet(unit_label=label, level=lv, grade_label='6학년')
    lines = [lesson(s, lv, L, D) for L in D['lessons']]
    s.answers('【교사용】 5. 여러 가지 그래프(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u5-graph.html과 차시 번호가 같습니다. 띠그래프 판(길이 20 cm)·원그래프 판(반지름 5 cm)은 실제 크기이니 100%로 인쇄하세요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    if 'dump' in sys.argv[1:]:
        print(json.dumps(load(SRC_TB), ensure_ascii=False, indent=1))
        shutil.rmtree(WORK, ignore_errors=True)
        return
    want = [a for a in sys.argv[1:] if a in ('tb', 'st')] or ['tb', 'st']
    out = []
    try:
        if 'tb' in want:
            D = load(SRC_TB)
            print('수 점검 %d곳' % check_numbers(D))
            for lv in ('기본형', '도전형'):
                out.append(build(D, '6-1 수학 5. 여러 가지 그래프(교과서 차시)', '교과서 차시', OUT_TB, lv))
        if 'st' in want and not ST:
            print('[건너뜀] 이야기 버전 원본(u5-graph.st.js)이 아직 없어요.')
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
