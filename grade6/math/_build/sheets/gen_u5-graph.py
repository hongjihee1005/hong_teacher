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
      띠그래프 — 길이 10 cm 띠(가로), 가장 작은 눈금 한 칸 1 %(1 mm), 10 %마다 굵은 눈금과 수.
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
ST_MODE = [False]  # 이야기 버전을 만드는 동안 True(render_rec·paper가 REC_ST·PAPER_ST를 먼저 씀)

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
        f.write(_EX_ST if src.endswith('.st.js') else _EX)
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
    """길이 10 cm 띠(가로, 가장 작은 눈금 한 칸 1 % = 1 mm, 10 %마다 굵은 눈금과 수). 그림 너비 17 cm 가운데에 띠를 놓아요."""
    L, W = 10 * K, 17 * K
    x0 = (W - L) / 2
    yT, yD, yN, bandY, BH = 0.55 * K, 1.35 * K, 2.2 * K, 2.95 * K, 1.3 * K
    H = bandY + BH + 2.8 * K
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
        b.append(_t(cx, bandY + BH * .34, items[i]['n'], 13))
        b.append(_t(cx, bandY + BH * .70, '(%s %%)' % fmt(items[i]['p']), 13))
    for t in range(101):
        ln = 0.42 * K if t % 10 == 0 else 0.28 * K if t % 5 == 0 else 0.16 * K
        b.append(_ln((X(t), bandY - ln), (X(t), bandY), LINE, 2.4 if t % 10 == 0 else 0.8))
        if t % 10 == 0:
            b.append(_t(X(t), yN, str(t), 14, GRAY))
    b.append(_t(x0 + L + 0.5 * K, yN, '(%)', 12, GRAY, 'start'))
    return _svg(W, H, ''.join(b))


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
    if ST_MODE[0] and t in REC_ST:
        return REC_ST[t](s, lv, rec, st, D)
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
    if not band:
        s.page_break()
        s.text('나타낼 자료: ' + data)
    if band:
        s.text('띠그래프 그리기 판(실제 크기, 띠의 길이 10 cm)이에요. 가장 작은 눈금 한 칸은 1 %(1 mm)예요.')
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
    s.text('띠그래프 그리기 판(실제 크기, 띠의 길이 10 cm, 가장 작은 눈금 한 칸 1 %)이에요. 나온 차의 백분율만큼 띠를 나누어 내용과 백분율을 써요.')
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
    for a, b in PAPER_ST if ST_MODE[0] else []:
        t = re.sub(a[3:], b, t) if a.startswith('re:') else t.replace(a, b)
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
              note='※ 이 활동지는 앱 u5-graph.html과 차시 번호가 같습니다. 띠그래프 판(길이 10 cm)·원그래프 판(반지름 5 cm)은 실제 크기이니 100%로 인쇄하세요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


# ================================================================ 이야기 버전(ST) — u5-graph.st.js
SRC_ST = os.path.join(ROOT, '_build', 'units', 'u5-graph.st.js')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')


def _make_ex_st():
    """_EX(교과서 버전 읽기)를 고쳐 이야기 버전 엔진의 부품(panes·thenWhy·ruleFirst·wonderRecall·writeStep 도움과 답)과
    편집부 말풍선(gr5sSay)·메모 상자(gr5sNote)도 모읍니다."""
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
        ("  if (hasCls(v, 'gr5say')) return { say: v.textContent };",
         "  if (hasCls(v, 'gr5ssay')) return { say: v.children[0].textContent + ': ' + v.children[1].textContent };\n"
         "  if (hasCls(v, 'gr5snote')) return { note: v.children[0].textContent, lines: findAll(v, e => e.tag === 'li').map(e => e.textContent) };\n"
         "  if (hasCls(v, 'gr5say')) return { say: v.textContent };"),
    ]
    for a, b in rep:
        assert ex.count(a) == 1, a[:60]
        ex = ex.replace(a, b)
    return ex.replace('앱 원본(u5-graph.tb.js)', '앱 원본(u5-graph.st.js)')


_EX_ST = _make_ex_st()

# 종이에서 하는 말로 바꾸기(이야기 버전 단계 안내) — paper()가 PAPER보다 먼저 씀
PAPER_ST = [
    (' 두 활동을 모두 해야 계단을 올라요.', ''),
    # 달 이름이 바뀌어도 맞도록 정규식(re:) — 실제 양으로 보기
    ('re:‘비율로 보기’와 ‘실제 양으로 보기’를 번갈아 누르고 (.+?)의 ‘(.+?)’ 부분을 눌러 보세요\\.',
     r'‘비율로 보기’와 ‘실제 양으로 보기’ 그림을 견주어 보고, 두 그림에서 \1의 ‘\2’ 부분에 ○표 해 보세요.'),
    ('세 칸에 써서 붙여요.', '세 칸에 써 보세요.'),
    ('배울 내용을 배우는 차례대로 눌러 학습 계획을 세워 보세요.', '배울 내용을 배우는 차례대로 기호를 써서 학습 계획을 세워 보세요.'),
    ('두 그래프에서 ‘자전거’ 부분을 각각 찾아 눌러 보세요.', '두 그래프에서 ‘자전거’ 부분을 각각 찾아 ○표 해 보세요.'),
    ('‘학교 버스’ 부분을 누르고,', '‘학교 버스’ 부분에 ○표 하고,'),
    ('빨간 선을 옮겨 자리를 정하고 ‘여기에 선 긋기’를 눌러 띠를 나눈 다음, 나눈 부분에 내용과 백분율을 붙여요.',
     '앞 항목에 이어서 백분율만큼 선을 그어 띠를 나눈 다음, 나눈 부분에 내용과 백분율을 써요.'),
    ('(이 앱이 정한 수)', '(앱과 같은 수)'), ('(자료는 이 앱이 정했어요)', '(자료는 앱과 같아요)'),
]

EMOJI = re.compile('[\U00010000-\U0010FFFF⌀-⏿☀-➿⬀-⯿️‍]+')


def jo(w, a, b):
    """받침이 있으면 a, 없으면 b"""
    c = w[-1]
    return a if '가' <= c <= '힣' and (ord(c) - 0xAC00) % 28 else b


def hs_el(s, lv, rec, st, D):
    if rec.get('calc'):
        return ''
    if rec.get('note'):
        s.text('〈%s〉' % EMOJI.sub('', rec['note']).strip())
        s.fill([EMOJI.sub('', x).strip() for x in rec['lines']])
        return ''
    put_el(s, rec)
    return ''


def hs_pick(s, lv, rec, st, D):
    for q in rec['qs']:
        m = re.search(r'(\S+)의 (막대|점)을 눌러요\.$', q['q'])
        if m:
            q['q'] = q['q'][:m.start()] + m.group(1) + jo(m.group(1), '을', '를') + ' 써 보세요.'
    return h_pick(s, lv, rec, st, D)


def hs_survey(s, lv, rec, st, D):
    names, seq = rec['names'], rec['seq']
    assert sorted(seq) == sorted(i for i, c in enumerate(rec['counts']) for _ in range(c))
    s.text('우리 반 %d명이 낸 설문 쪽지예요(앱과 같은 차례). 쪽지를 하나씩 읽으면서 아래 표에 바를 정(正) 자로 표시해요.' % len(seq))
    cells = ['%d. %s' % (k + 1, names[i]) for k, i in enumerate(seq)]
    s.table([cells[i:i + 5] for i in range(0, len(cells), 5)], header=False, col_mm=[36] * 5, row_h=2835)
    s.table([['쓰임'] + names, ['표시'] + [''] * len(names), ['학생 수(명)'] + ['(    )'] * len(names)],
            header=True, header_col=True, col_mm=[30] + [150 / len(names)] * len(names), row_h=3969)
    return after(s, lv, rec)


def hs_maker(s, lv, rec, st, D):
    T = rec['target']
    tot = sum(c for _, c in T)
    pct = [c * 100 / tot for _, c in T]
    assert all(abs(p - round(p)) < 1e-9 for p in pct)
    m = re.search(r'「([^」]+)」', ' '.join(st['hints'] if st else []))
    ttl = m.group(1) if m else '%s별 학생 수' % rec['head']
    s.text('앱에서는 공학 도구(교과서의 EBSMath 이지통계처럼 움직이는 도구)로 그래프를 그려요. 종이에서는 표를 정리하고 원그래프로 나타내 보세요.')
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
    return ('표의 제목 %s, %s, 합계 %d명 / 백분율 %s, 합계 100 %% / 선의 자리 %s %% / 그래프 제목 예: %s의 비율 / 기타는 맨 나중'
            % (ttl, ', '.join('%s %d' % (n, c) for n, c in T), tot, ', '.join(fmt(p) for p in pct),
               ', '.join(fmt(c) for c in cum[:-1]), ttl))


def hs_scaled(s, lv, rec, st, D):
    s.text('비율로 보기: 띠의 길이가 모두 같아요.')
    pic(s, rec['pct'], 160)
    s.text('실제 양으로 보기: 띠의 길이가 그달에 모은 재활용품 전체의 무게에 비례해요.')
    pic(s, rec['abs'], 160)
    s.text('띠의 부분은 왼쪽부터 ' + ', '.join(rec['names']) + '이에요. 띠 안의 수는 백분율(%)이에요.')
    need = rec['need']
    nm = {rec['names'][i] for _, i in need}
    assert len(nm) == 1
    pre = '%s ○표(%s)' % (nm.pop(), '·'.join(rec['years'][y] for y, _ in need))
    return after(s, lv, rec, pre)


def hs_bingo(s, lv, rec, st, D):
    cards = rec['cards']
    assert len(cards) == 12
    s.text('친구와 함께 놀이해요(2~4명). 신문 축제의 그래프 카드 12장 중 9장을 골라 번호를 빙고판에 써요(앱과 같은 그래프예요).')
    pic(s, bingo_svg(cards), 172)
    s.text('나의 빙고판 — 고른 그래프 카드의 번호를 써요. 친구가 말한 내용에 알맞은 그래프가 있으면 ◯표 해요. 먼저 3줄을 완성하면 이겨요.')
    s.table([['', '', ''], ['', '', ''], ['', '', '']], header=False, col_mm=[40, 40, 40], row_h=4536)
    s.ask('내 차례에 한 그래프를 설명한 말(제목은 말하지 않아요):', blank=False)
    s.lines(2)
    top = max(cards[0]['items'], key=lambda it: it['p'])
    return '(놀이) 예: ①번 — 비율이 가장 높은 것은 %s(%s %%)%s.' % (top['n'], fmt(top['p']), jo(top['n'], '이에요', '예요'))


def frame(help1):
    """앱 도움 둘째 줄 '‘…~…’ 꼴로 써요.' → 쓰기 틀"""
    t = help1.split('‘', 1)[1].rsplit('’', 1)[0] if '‘' in help1 else help1
    return t.replace('~', '__________')


def hs_write(s, lv, rec, st, D):
    """앱 writeStep: 기본형은 앱 도움의 문장 틀, 도전형은 빈 줄. 정답은 앱의 모범 답"""
    ans = []
    for it in rec['items']:
        s.ask('%s%s' % ('[%s] ' % it['tag'] if it.get('tag') else '', it['q']), blank=False)
        if lv == '기본형' and len(it.get('help') or []) > 1:
            s.fill(frame(it['help'][1]))
        else:
            s.lines(2)
        ans.append('예) ' + (it.get('ans') or it['ph']))
    return ' / '.join(ans)


def hs_panes(s, lv, rec, st, D):
    for p in rec['items']:
        s.ask('%s  (%s)' % (p['t'], p['hint']) if p.get('hint') else p['t'], blank=False)
        if lv == '기본형':
            s.fill(frame(p['ph']))
        else:
            s.lines(1)
    return '(자유) 예) ' + ' / '.join(p['ex'][0] for p in rec['items'] if p['ex'])


def hs_why(s, lv, rec, st, D):
    o = rec['o']
    s.ask('왜 그럴까요? ' + o['q'], blank=False)
    if lv == '기본형' and len(o['help']) > 1:
        s.fill(frame(o['help'][1]))
    else:
        s.lines(2)
    return '왜? 예) ' + o['ans']


def hs_rule(s, lv, rec, st, D):
    o = rec['o']
    s.ask('먼저 예상해요 · ' + o['q'], blank=False)
    if lv == '기본형' and len(o['help']) > 1:
        s.fill(frame(o['help'][1]))
    else:
        s.lines(1)
    return '예상(자유) — 실제: ' + o['ans']


def hs_wonder(s, lv, rec, st, D):
    s.text('1차시에 쓴 ‘궁금해요’ 칸을 다시 읽고, 이제 답할 수 있는지 생각해 보세요.')
    return ''


REC_ST = {'el': hs_el, 'pick': hs_pick, 'survey': hs_survey, 'maker': hs_maker, 'scaled': hs_scaled, 'bingo': hs_bingo,
          'write': hs_write, 'panes': hs_panes, 'thenWhy': hs_why, 'ruleFirst': hs_rule, 'wonderRecall': hs_wonder}

WHY_ST = {
    '1': ('신문 기사에 학생 수 대신 백분율을 쓰면 좋은 점을 우리 반(25명)과 옆 반(20명)의 아침 식사를 견주는 일로 써 보세요.',
          '두 반의 전체 학생 수가 달라도 전체를 100으로 보고 비율을 견줄 수 있어요. 예를 들어 우리 반 25명 중 밥을 먹은 10명은 40 %예요.'),
    '2': ('그래프를 읽기 전에 작은 눈금 한 칸이 몇 %인지 먼저 확인해야 하는 까닭을 써 보세요.',
          '그래프마다 전체를 나눈 칸 수가 달라서 한 칸이 나타내는 백분율이 다르기 때문이에요. 학급 문고 띠그래프는 20칸이라 한 칸이 5 %이고, 과학책 4칸은 20 %예요.'),
    '3': ('띠나 원을 나눌 때 0부터 다시 재지 않고 이전 항목에 이어서 백분율만큼 선을 그어야 하는 까닭을 써 보세요.',
          '각 항목이 전체에서 자기 백분율만큼만 차지해야 하기 때문이에요. 빵(25 %)은 밥이 끝난 40 %에서 이어서 25칸 더 간 65 %에 선을 그어요.'),
    '4~5': ('6학년 2반(21명) 조사에서 반올림한 백분율의 합계가 100.1 %가 되었을 때 어떻게 하는지 까닭과 함께 써 보세요.',
            '전체는 100 %이므로 가장 큰 항목인 퀴즈를 42.9 %에서 42.8 %로 0.1만큼 줄여 합계가 100 %가 되게 맞추어요.'),
    '6': ('급식 잔반 원그래프를 근거로 잔반을 줄이는 방법을 하나 정하고, 그래프의 수를 들어 까닭을 써 보세요.',
          '(예) 남긴 음식 중 채소 반찬이 36.5 %, 남긴 까닭 중 ‘입맛에 맞지 않아서’가 34 %로 가장 높으니, 채소 반찬을 맛있게 먹는 방법을 알리는 캠페인을 해요.'),
    '7': ('같은 도서관 자료를 막대그래프와 원그래프로 나타내면 각각 무엇을 알아보기 편리한지 써 보세요.',
          '막대그래프는 요일별 도서관을 찾은 학생 수의 많고 적음을, 원그래프는 학년별 도서관을 찾은 학생 수의 비율을 한눈에 알아보기 편리해요.'),
    '8~9': ('알뜰 장터에서 2025년에 장난감의 비율은 늘었는데 실제 판매 개수는 줄어든 까닭을 써 보세요.',
            '실제 판매 개수는 (팔린 물건 수)×(비율)인데, 2025년에 팔린 물건 수가 700개에서 500개로 줄어 500 × 0.23 = 115(개)로 2024년의 154개보다 적어졌기 때문이에요.'),
    '10': ('빙고 카드 ①(좋아하는 급식 메뉴별 학생 수의 비율)을 제목을 말하지 않고 설명하는 문장을 두 가지 써 보세요.',
           '(예) 비율이 가장 높은 것은 떡볶이(32 %)예요. 떡볶이의 비율은 짜장면(16 %)의 비율의 2배예요.'),
    '11': ('5학년(80명)과 6학년(120명)의 ‘걸어서’ 비율이 모두 40 %일 때, 그래프만 보고 걸어서 오는 학생 수가 같다고 말하면 안 되는 까닭을 써 보세요.',
           '띠그래프와 원그래프는 비율만 나타내요. 실제 학생 수는 (전체 학생 수)×(비율)이라 80 × 0.4 = 32(명), 120 × 0.4 = 48(명)으로 달라요.'),
}


def check_st(D):
    """WHY_ST 답의 수를 앱 자료로 다시 계산해 맞추고, 소수가 앱 차시에 그대로 나오는지 확인(앱 수가 바뀌면 빌드를 멈춤)"""
    Ls = {str(L['no']): L for L in D['lessons']}
    assert set(Ls) == set(WHY_ST), (sorted(Ls), sorted(WHY_ST))
    for k, (_, a) in WHY_ST.items():
        blob = json.dumps(Ls[k], ensure_ascii=False)
        bad = [x for x in re.findall(r'\d+\.\d+', a) if x not in blob]
        assert not bad, ('WHY_ST의 수가 앱과 달라요', k, bad)
    assert round(500 * 0.23) == 115 and round(700 * 0.22) == 154 and round(600 * 0.2) == 120
    assert round(80 * 0.4) == 32 and round(120 * 0.4) == 48 and 10 / 25 * 100 == 40
    assert round(9 / 21 * 100, 1) == 42.9 and round(6 / 21 * 100, 1) == 28.6 and round(42.9 + 28.6 * 2, 1) == 100.1
    return len(WHY_ST)


def do_step_st(s, lv, i, st, D):
    nm, _, sub = st['name'].partition(' — ')
    s.step('%s %s' % (NUM[i], nm), sub or None)
    kinds = {r['t'] for r in all_recs(st['recs'])}
    if not kinds & OWN_INST:
        s.text(paper(st['inst']))
    if lv == '기본형' and st['hints'] and has_num(st['recs']):
        s.text('도움: ' + plain(st['hints'][0]))
    return NUM[i] + ' ' + render_recs(s, lv, st['recs'], st, D)


def lesson_st(s, lv, L, D):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if L['no'] == 1:
        s.scene(None, D['story']['lines'][0])
    out = [do_step_st(s, lv, i, st, D) for i, st in enumerate(L['steps'])]
    if lv == '도전형':
        n = len(L['steps'])
        if L['challenge']:
            out.append(do_step_st(s, lv, n, L['challenge'], D))
            n += 1
        q, a = WHY_ST[str(L['no'])]
        s.step('%s 까닭 쓰기' % NUM[n])
        s.ask(q, blank=False)
        s.lines(2)
        out.append(NUM[n] + ' ' + a)
    return '%s차시  ' % L['no'] + '   '.join(out)


ST = [lesson_st]          # 이야기 버전 차시 함수(앱 LESSONS의 차시마다 lesson_st를 부름)


def build_st(D, lv):
    D_REF[0] = D
    ST_MODE[0] = True
    try:
        s = Sheet(unit_label='6-1 수학 5. 여러 가지 그래프(이야기 버전)', level=lv, grade_label='6학년')
        lines = [lesson_st(s, lv, L, D) for L in D['lessons']]
    finally:
        ST_MODE[0] = False
    s.answers('【교사용】 5. 여러 가지 그래프(이야기 버전) 활동지 정답 (%s)' % lv, lines,
              note='※ 이 활동지는 앱 u5-graph.html과 차시 번호가 같습니다. 띠그래프 판(길이 10 cm)·원그래프 판(반지름 5 cm)은 실제 크기이니 100%로 인쇄하세요.')
    os.makedirs(OUT_ST, exist_ok=True)
    path = os.path.join(OUT_ST, NAME % lv)
    s.save(path)
    return path


# ================================================================ 도전형: ①~⑤(도전하기 앞의 모든 칸)를 새 문제로(2026-10-30)
# 기본형은 앱에서 읽은 그대로 두고, 도전형은 같은 칸 이름에 새 자료(표·띠그래프·원그래프)와 새 물음을 넣은 기록(HARD_TB·HARD_ST)으로
# 바꿉니다. 그래프는 이 스크립트가 띠·원 그림(band_real·pie_real)으로 새로 그리고, 백분율·실제 양은 아래 pc()·amt()로 계산해 넣습니다.
import copy  # noqa: E402
from fractions import Fraction as _Fr  # noqa: E402


def _num(v):
    v = _Fr(v).limit_denominator(10 ** 6)
    return int(v) if v.denominator == 1 else float(v)


def pc(a, total):
    return _num(_Fr(a * 100, total))


def S_(t):
    return {'s': t}


def N_(v):
    return {'n': _num(v)}


def O_(o, a=0):
    return {'o': list(o), 'a': a, 'multi': isinstance(a, list)}


def _p(parts):
    return [p if isinstance(p, dict) else S_(p) for p in parts]


def AI(q, *parts):
    return {'q': q, 'fig': None, 'parts': _p(parts)}


def ASK(*items):
    return {'t': 'ask', 'items': list(items)}


def QUIZ(*items):
    return {'t': 'quiz', 'items': [{'q': q, 'o': list(o), 'a': a, 'fig': None} for q, o, a in [(it + (0,))[:3] for it in items]]}


def BLK(*parts):
    return {'t': 'blanks', 'parts': _p(parts)}


def WR(*items):
    return {'t': 'write', 'items': [{'q': q, 'ph': ph, 'ans': ph, 'help': []} for q, ph in items]}


def TB_(rows, cap=None):
    return {'t': 'el', 'table': rows, 'cap': cap}


def SEQ_(cards, order):
    return {'t': 'sequence', 'cards': cards, 'order': order}


def SORT_(cards, bins):
    return {'t': 'sort', 'cards': [{'t': t, 'b': b} for t, b in cards], 'order': list(range(len(cards))), 'bins': bins}


def ITEMS(pairs):
    its = [{'n': n, 'p': _num(p)} for n, p in pairs]
    assert abs(sum(_Fr(it['p']).limit_denominator(1000) for it in its) - 100) < _Fr(1, 100), pairs
    return its


def DRAW(kind, title, pairs, given=0, ask=()):
    return {'t': 'draw', 'g': {'kind': kind, 'title': title, 'items': ITEMS(pairs)}, 'given': given, 'ask': list(ask)}


def GRAPH(*graphs, ask=()):
    """완성된 띠·원그래프(이 스크립트가 그림): graphs = (이름표, 'band'|'pie', 제목, [(항목, 백분율)…])"""
    return {'t': 'hgraph', 'graphs': [{'lab': lab, 'kind': k, 'title': ttl, 'items': ITEMS(pp)} for lab, k, ttl, pp in graphs], 'ask': list(ask)}


def TWHY(q, ans):
    return {'t': 'thenWhy', 'o': {'q': q, 'ans': ans, 'help': []}}


def RFIRST(q, ans):
    return {'t': 'ruleFirst', 'o': {'q': q, 'ans': ans, 'help': []}}


def PANES(*items):
    return {'t': 'panes', 'items': [{'t': t, 'ph': ph, 'ex': [ex]} for t, ph, ex in items]}


def h_graph(s, lv, rec, st, D):
    for g in rec['graphs']:
        if g['lab']:
            s.text('〈%s〉 %s' % (g['lab'], g['title']))
        else:
            s.text('〈%s〉' % g['title'])
        n = len(g['items'])
        if g['kind'] == 'band':
            pic(s, band_real(g['items'], n, g['title'], ''), 150)
        else:
            pic(s, pie_real(g['items'], n), 78)
    return after(s, lv, rec)


HANDLERS['hgraph'] = h_graph


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


G_WORRY = [('친구', 35), ('공부', 30), ('진로', 20), ('외모', 10), ('기타', 5)]
G_WAY = [('직접 만나기', 45), ('쪽지', 25), ('전화', 20), ('기타', 10)]
G_SNACK = [('떡볶이', 45), ('과일', 30), ('빵', 15), ('기타', 10)]
G_GO = [('걸어서', 44), ('자전거', 26), ('버스', 18), ('기타', 12)]
G_REST = [('이야기', 36), ('책 읽기', 24), ('운동', 28), ('기타', 12)]
G_Y23 = [('친구', 40), ('공부', 30), ('진로', 20), ('기타', 10)]
G_Y24 = [('친구', 30), ('공부', 35), ('진로', 25), ('기타', 10)]
G_VISIT = [('이야기 나누기', 40), ('놀이', 25), ('쉬기', 20), ('기타', 15)]
G_SPORT = [('축구', 35), ('피구', 25), ('줄넘기', 20), ('기타', 20)]

HARD_TB = {
    't1': [
        ('또래 상담실에서 여러 가지 자료를 그래프로 나타내려고 해요. 알맞은 그래프를 골라 보세요.', [QUIZ(
            ('전체에 대한 각 부분의 비율을 한눈에 보기 좋은 그래프는 무엇일까요?', ['띠그래프', '꺾은선그래프', '그림그래프']),
            ('시간에 따라 변하는 모양을 나타내기 좋은 그래프는 무엇일까요?', ['꺾은선그래프', '띠그래프', '원그래프']))]),
        ('그래프를 그리는 차례를 생각해 보세요.', [SEQ_(['㉠ 띠그래프로 나타내기', '㉡ 자료를 조사하여 표로 정리하기', '㉢ 각 항목의 백분율 구하기', '㉣ 그래프를 보고 알 수 있는 내용 쓰기'], [1, 2, 0, 3])]),
        ('요일별 상담 수를 정리한 표예요. 배운 내용을 떠올려 답해 보세요.', [
            TB_([['요일', '월', '화', '수', '목', '합계'], ['상담 수(건)', '6', '9', '4', '11', '30']]),
            ASK(AI(None, '상담 수가 가장 많은 요일은 ', O_(['목요일', '화요일', '월요일']), '이고, 가장 적은 요일보다 ', N_(7), '건 많아요.'),
                AI(None, '전체 상담 수에 대한 화요일 상담 수의 비율을 백분율로 나타내면 [9/30] × 100 = ', N_(pc(9, 30)), ' %예요.'))]),
        ('승아는 학급 친구 40명에게 고민을 조사하려고 해요. 계획을 생각해 보세요.', [QUIZ(
            ('조사한 학생이 40명일 때 한 명은 전체의 몇 %일까요?', ['2.5 %', '4 %', '40 %']),
            ('조사 결과를 원그래프로 나타낼 때 원 전체는 몇 %인가요?', ['100 %', '360 %', '40 %']))]),
        ('조사 결과를 백분율로 나타내 보세요.', [ASK(
            AI(None, '40명 중 친구 관계를 고민하는 학생이 14명이면 [14/40] × 100 = ', N_(pc(14, 40)), ' %예요.'),
            AI(None, '공부를 고민하는 학생이 12명이면 [12/40] × 100 = ', N_(pc(12, 40)), ' %예요.'))]),
    ],
    't2': [
        ('학생들의 고민거리를 띠그래프로 나타냈어요. 그래프를 보고 답해 보세요.', [GRAPH(('', 'band', '고민거리별 학생 수', G_WORRY), ask=[
            AI(None, '친구 관계의 비율은 진로의 ', N_(_Fr(35, 20)), '배이고, 공부와 진로를 합하면 ', N_(50), ' %예요.')])]),
        ('좋아하는 상담 방법을 원그래프로 나타냈어요. 그래프를 보고 답해 보세요.', [GRAPH(('', 'pie', '좋아하는 상담 방법별 학생 수', G_WAY), ask=[
            AI(None, '눈금 한 칸이 5 %일 때 쪽지 부분은 ', N_(5), '칸이고, 직접 만나기는 전화의 ', N_(_Fr(45, 20)), '배예요.')])]),
        ('두 그래프를 견주어 보세요.', [ASK(
            AI(None, '고민거리 그래프에서 비율이 가장 낮은 항목은 ', O_(['기타', '외모', '진로']), '이고, 상담 방법 그래프에서 비율이 25 %인 항목은 ', O_(['쪽지', '전화', '기타']), '예요.'),
            AI(None, '두 그래프에서 비율이 같은 항목끼리 짝 지으면 고민거리의 진로와 상담 방법의 ', O_(['전화', '쪽지', '직접 만나기']), '예요.'))]),
        ('띠그래프와 원그래프를 새 말로 정리해요.', [BLK(
            '전체에 대한 각 부분의 비율을 띠 모양에 나타낸 그래프를 ', O_(['띠그래프', '원그래프', '막대그래프']), ', 원 모양에 나타낸 그래프를 ',
            O_(['원그래프', '띠그래프', '막대그래프']), '라고 해요. 두 그래프 모두 전체는 ', N_(100), ' %예요.')]),
        ('그래프의 길이와 넓이로 생각해 보세요.', [ASK(
            AI(None, '원그래프에서 25 %인 부분은 원 전체의 ', O_(['[1/4]', '[1/2]', '[1/5]']), '이에요.'),
            AI(None, '띠그래프의 길이가 20 cm일 때 15 %인 부분의 길이는 ', N_(3), ' cm예요.'))]),
    ],
    't3': [
        ('우리 반 학생 40명이 좋아하는 간식을 조사한 표예요. 백분율을 구해 보세요.', [
            TB_([['간식', '떡볶이', '과일', '빵', '기타', '합계'], ['학생 수(명)', '18', '12', '6', '4', '40'], ['백분율(%)', '', '', '', '', '100']]),
            ASK(AI(None, '떡볶이 [18/40] × 100 = ', N_(pc(18, 40)), ' %,  과일 [12/40] × 100 = ', N_(pc(12, 40)), ' %,  빵 ', N_(pc(6, 40)), ' %,  기타 ', N_(pc(4, 40)), ' %'))]),
        ('좋아하는 간식별 학생 수를 띠그래프로 나타내 보세요.', [DRAW('band', '좋아하는 간식별 학생 수', G_SNACK, 1)]),
        ('학생 50명의 등교 방법(걸어서 22명, 자전거 13명, 버스 9명, 기타 6명)을 백분율로 구해 원그래프로 나타내 보세요.', [
            ASK(AI(None, '걸어서 ', N_(pc(22, 50)), ' %, 자전거 ', N_(pc(13, 50)), ' %, 버스 ', N_(pc(9, 50)), ' %, 기타 ', N_(pc(6, 50)), ' %')),
            DRAW('pie', '등교 방법별 학생 수', G_GO, 0)]),
        ('그래프로 나타내는 차례를 새 예로 정리해요.', [BLK(
            '띠그래프나 원그래프를 그릴 때는 먼저 각 항목의 ', O_(['백분율', '학생 수의 합']), '을 구하고, 백분율의 합계가 ', N_(100), ' %인지 확인해요. 그다음 ',
            O_(['비율에 따라 나누고', '항목 이름만 쓰고']), ' 내용과 백분율을 써요.')]),
        ('반올림이 필요한 백분율을 구해 보세요.', [ASK(
            AI(None, '21명 가운데 3명이 고른 항목의 백분율을 소수 첫째 자리까지 반올림하면 ', N_(14.3), ' %예요.'),
            AI(None, '21명 가운데 9명이 고른 항목은 ', N_(42.9), ' %예요.'))]),
    ],
    't45': [
        ('우리 반 학생들이 쉬는 시간에 하는 일을 조사하려고 해요. 조사 계획을 세워 보세요.', [QUIZ(
            ('알맞은 조사 방법을 고르세요.', ['설문 쪽지를 나누어 주고 모아요.', '한 사람에게만 물어봐요.']),
            ('조사 결과를 원그래프로 나타내려면 무엇을 먼저 해야 할까요?', ['각 항목의 백분율 구하기', '그래프 제목만 정하기']))]),
        ('설문 쪽지를 모아 표로 정리했어요. 표를 완성해 보세요.', [
            TB_([['하는 일', '이야기', '책 읽기', '운동', '기타', '합계'], ['학생 수(명)', '9', '6', '7', '3', '(    )']]),
            ASK(AI(None, '조사한 학생 수의 합계는 ', N_(25), '명이에요.'))]),
        ('백분율을 구해 띠그래프로 나타내 보세요.', [
            ASK(AI(None, '이야기 ', N_(pc(9, 25)), ' %, 책 읽기 ', N_(pc(6, 25)), ' %, 운동 ', N_(pc(7, 25)), ' %, 기타 ', N_(pc(3, 25)), ' %')),
            DRAW('band', '쉬는 시간에 하는 일별 학생 수', G_REST, 0)]),
        ('같은 자료를 원그래프로 나타내 보세요.', [DRAW('pie', '쉬는 시간에 하는 일별 학생 수', G_REST, 0)]),
        ('그래프를 보고 알 수 있는 내용을 말해 보세요.', [ASK(
            AI(None, '이야기를 하는 학생의 비율은 기타의 ', N_(3), '배예요.'),
            AI(None, '운동과 책 읽기를 합한 비율은 ', N_(52), ' %이고, 이것은 이야기의 비율보다 ', N_(16), ' %포인트 높아요.'))]),
    ],
    't6': [
        ('두 해의 고민거리 띠그래프를 견주어 보세요.', [GRAPH(('2023년', 'band', '고민거리별 학생 수(2023년)', G_Y23), ('2024년', 'band', '고민거리별 학생 수(2024년)', G_Y24), ask=[
            AI(None, '비율이 줄어든 항목은 ', O_(['친구', '공부', '진로']), '이고, 비율이 늘어난 항목을 모두 고르면 ', O_(['공부', '진로', '기타'], [0, 1]), '예요.')])]),
        ('조사한 학생이 2023년에 200명, 2024년에 240명이에요. 실제 학생 수를 구해 보세요.', [ASK(
            AI(None, '진로를 고민한 학생: 2023년 200 × 0.2 = ', N_(40), '명, 2024년 240 × 0.25 = ', N_(60), '명'),
            AI(None, '친구를 고민한 학생: 2023년 ', N_(80), '명, 2024년 ', N_(72), '명이므로 실제 학생 수도 ', O_(['줄었어요', '늘었어요']), '.'))]),
        ('상담실을 방문한 이유를 원그래프로 나타냈어요. 그래프를 해석해 보세요.', [GRAPH(('', 'pie', '상담실 방문 이유별 학생 수', G_VISIT), ask=[
            AI(None, '방문한 학생이 160명일 때 놀이로 방문한 학생은 160 × 0.25 = ', N_(40), '명이에요.'),
            AI(None, '쉬기와 기타를 합한 비율은 ', N_(35), ' %예요.')])]),
        ('그래프를 보고 글을 완성해요.', [BLK(
            '원그래프에서 비율이 클수록 차지하는 넓이가 ', O_(['넓어요', '좁아요']), '. 이야기 나누기의 비율은 기타의 약 ', O_(['2.7배', '2배', '3배']), '예요.')]),
        ('방문한 학생 160명으로 더 알아보세요.', [ASK(
            AI(None, '이야기 나누기로 방문한 학생은 ', N_(64), '명, 쉬기로 방문한 학생은 ', N_(32), '명이므로 두 학생 수의 차는 ', N_(32), '명이에요.'))]),
    ],
    't7': [
        ('자료에 알맞은 그래프를 골라 보세요.', [QUIZ(
            ('한 달 동안 교실 온도의 변화를 나타내기 알맞은 그래프는?', ['꺾은선그래프', '원그래프', '띠그래프']),
            ('반 학생들이 좋아하는 과목별 학생 수를 비교하기 쉬운 그래프는?', ['막대그래프', '꺾은선그래프']),
            ('전체 쓰레기 가운데 종류별 비율을 나타내기 알맞은 그래프는?', ['원그래프', '꺾은선그래프']))]),
        ('해마다 조사한 우리 학교 학생 수예요.', [
            TB_([['연도', '2020년', '2021년', '2022년', '2023년'], ['학생 수(명)', '600', '620', '580', '560']]),
            ASK(AI(None, '이 자료를 나타내기에 알맞은 그래프는 ', O_(['꺾은선그래프', '원그래프', '띠그래프']), '이고, 학생 수가 가장 많이 줄어든 때는 ',
                   O_(['2021년과 2022년 사이', '2022년과 2023년 사이']), '예요.'))]),
        ('그래프의 특징을 알맞은 칸에 번호로 정리해 보세요.', [SORT_([
            ('자료의 크기를 그림의 크기와 수로 나타내요.', 0), ('항목별 수량을 막대의 길이로 비교해요.', 1), ('시간에 따른 변화를 선으로 나타내요.', 2),
            ('전체에 대한 부분의 비율을 나타내요.', 3), ('지역별 생산량을 지도 위에 나타내기 좋아요.', 0), ('선의 기울기로 변화가 큰지 작은지 알 수 있어요.', 2),
            ('백분율의 합이 100 %예요.', 3), ('가장 많은 항목과 가장 적은 항목의 차이를 견주기 쉬워요.', 1)],
            ['그림그래프', '막대그래프', '꺾은선그래프', '띠·원그래프'])]),
        ('알맞은 그래프를 골라 보세요.', [ASK(
            AI(None, '하루 동안 운동장 그늘의 길이 변화 → ', O_(['꺾은선그래프', '원그래프'])),
            AI(None, '용돈을 쓴 곳별 비율 → ', O_(['원그래프', '꺾은선그래프'])),
            AI(None, '반별 줄넘기 기록 → ', O_(['막대그래프', '띠그래프'])))]),
        ('우리 반 학생 30명이 좋아하는 계절을 띠그래프로 나타내려고 해요.', [ASK(
            AI(None, '봄 9명은 ', N_(pc(9, 30)), ' %, 여름 12명은 ', N_(pc(12, 30)), ' %, 가을 6명은 ', N_(pc(6, 30)), ' %, 겨울 3명은 ', N_(pc(3, 30)), ' %예요.'))]),
    ],
    't89': [
        ('학교 도서관의 갈래별 대출 권수를 두 해 동안 조사했어요. 표를 보고 답해 보세요.', [
            TB_([['갈래', '동화', '과학', '역사', '기타', '전체 대출 권수'], ['2023년(%)', '40', '25', '20', '15', '1000권'], ['2024년(%)', '30', '30', '25', '15', '1500권']]),
            QUIZ(('2023년보다 2024년에 비율이 줄어든 갈래는 무엇일까요?', ['동화', '과학', '역사']))]),
        ('비율만 보지 말고 실제 권수로도 견주어 보세요.', [ASK(
            AI(None, '동화 대출 권수: 2023년 1000 × 0.4 = ', N_(400), '권, 2024년 1500 × 0.3 = ', N_(450), '권'),
            AI(None, '동화의 비율은 줄었지만 실제 대출 권수는 ', O_(['늘었어요', '줄었어요']), '.'))]),
        ('잘못 설명한 사람을 찾아보세요.', [
            QUIZ(('잘못 설명한 사람은 누구일까요?', ['지우: 기타의 비율이 같으므로 기타 대출 권수도 같아요.', '하준: 과학 대출 권수는 2024년이 더 많아요.'])),
            ASK(AI(None, '기타 대출 권수: 2023년 ', N_(150), '권, 2024년 ', N_(225), '권'))]),
        ('마을 축제 예산 800만 원을 원그래프로 나타냈더니 음식 35 %, 공연 25 %, 체험 25 %, 기타 15 %였어요. 실제 금액으로 판단해 보세요.', [
            GRAPH(('', 'pie', '마을 축제 예산의 쓰임', [('음식', 35), ('공연', 25), ('체험', 25), ('기타', 15)])),
            ASK(AI(None, '음식: 800 × 0.35 = ', N_(280), '(만 원), 공연: ', N_(200), '만 원'),
                AI(None, '예산이 1000만 원으로 늘고 비율이 같다면 체험에 쓰는 돈은 ', N_(250), '만 원이에요.'))]),
        ('그래프를 해석할 때 생각할 점을 새 말로 정리해요.', [BLK(
            '비율이 같아도 전체의 양이 다르면 실제 양은 ', O_(['다를 수 있어요', '항상 같아요']), '. 실제 양은 (전체의 양) × ', O_(['(비율)', '(항목 수)']), '로 구해요.')]),
    ],
    't10': [
        ('그래프 빙고 놀이 규칙을 확인해 보세요.', [QUIZ(
            ('빙고판에 놓는 그래프 카드는 몇 장인가요?', ['9장', '12장', '3장']),
            ('친구에게 그래프를 설명할 때 말하지 않는 것은 무엇일까요?', ['그래프의 제목', '비율이 가장 높은 항목']))]),
        ('세 그래프를 보고 설명에 알맞은 그래프를 찾아보세요.', [GRAPH(
            ('①', 'band', '가 반이 좋아하는 놀이', [('술래잡기', 40), ('공기', 30), ('보드게임', 20), ('기타', 10)]),
            ('②', 'band', '나 반이 좋아하는 놀이', [('술래잡기', 35), ('공기', 35), ('보드게임', 20), ('기타', 10)]),
            ('③', 'band', '다 반이 좋아하는 놀이', [('술래잡기', 40), ('공기', 20), ('보드게임', 25), ('기타', 15)]), ask=[
                AI(None, '“가장 높은 비율은 40 %이고 기타는 10 %예요.”에 알맞은 그래프: ', O_(['①', '②', '③'])),
                AI(None, '“비율이 같은 두 항목이 있어요.”에 알맞은 그래프: ', O_(['②', '①', '③']))])]),
        ('빙고 놀이에서 설명할 그래프를 정해 보세요.', [WR(
            ('위 그래프 ③을 제목을 말하지 않고 설명하는 말을 써 보세요.', '술래잡기가 40 %로 가장 높고, 공기는 보드게임보다 5 % 낮아요. 기타는 15 %예요.'))]),
        ('친구의 설명을 듣고 알맞은 그래프를 골라 보세요.', [QUIZ(
            ('“공기와 술래잡기의 비율이 같아요.” 어느 그래프의 설명일까요?', ['②', '①', '③']),
            ('“보드게임이 25 %예요.” 어느 그래프의 설명일까요?', ['③', '①', '②']))]),
        ('놀이를 되돌아봐요.', [QUIZ(
            ('그래프를 설명할 때 도움이 되는 방법을 모두 고르세요.', ['가장 높은 항목과 낮은 항목을 말해요.', '두 항목의 비율을 견주어 말해요.', '그래프의 색깔만 말해요.'], [0, 1]))]),
    ],
    't11': [
        ('우리 반 학생 40명이 좋아하는 운동을 조사한 표예요. 표를 완성해 보세요.', [
            TB_([['운동', '축구', '피구', '줄넘기', '기타', '합계'], ['학생 수(명)', '14', '10', '8', '8', '40'], ['백분율(%)', '', '', '', '', '']]),
            ASK(AI(None, '축구 ', N_(pc(14, 40)), ' %, 피구 ', N_(pc(10, 40)), ' %, 줄넘기 ', N_(pc(8, 40)), ' %, 기타 ', N_(pc(8, 40)), ' %, 합계 ', N_(100), ' %'))]),
        ('좋아하는 운동별 학생 수를 띠그래프로 나타내 보세요.', [DRAW('band', '좋아하는 운동별 학생 수', G_SPORT, 0)]),
        ('같은 자료를 원그래프로 나타내 보세요.', [DRAW('pie', '좋아하는 운동별 학생 수', G_SPORT, 0)]),
        ('옆 반(학생 20명)의 띠그래프와 견주어 보세요.', [GRAPH(('', 'band', '옆 반이 좋아하는 운동별 학생 수', [('축구', 30), ('피구', 35), ('줄넘기', 25), ('기타', 10)]), ask=[
            AI(None, '옆 반에서 피구를 좋아하는 학생은 ', N_(7), '명이고, 우리 반에서 피구를 좋아하는 학생보다 ', N_(3), '명 적어요.'),
            AI(None, '피구의 비율은 옆 반이 더 ', O_(['높지만', '낮지만']), ' 학생 수는 우리 반이 더 많아요.')])]),
        ('단원에서 배운 내용을 새 예로 정리해요.', [BLK(
            '백분율의 합계는 언제나 ', N_(100), ' %예요. 전체가 50명일 때 한 명은 ', N_(2), ' %이고, 전체가 다른 두 그래프를 견줄 때는 ', O_(['실제 양', '그래프의 색']), '도 함께 생각해요.')]),
    ],
}


S_BRK = [('밥', 40), ('빵', 25), ('시리얼', 15), ('안 먹음', 20)]
S_CLUB = [('운동', 36), ('미술', 24), ('음악', 22), ('기타', 18)]
S_READ = [('동화', 45), ('만화', 30), ('과학책', 15), ('기타', 10)]
S_PE = [('피구', 32), ('달리기', 28), ('줄넘기', 24), ('기타', 16)]
S_MONEY = [('간식', 40), ('저금', 30), ('학용품', 20), ('기타', 10)]
S_FOOD22 = [('밥', 30), ('국', 25), ('반찬', 35), ('기타', 10)]
S_FOOD23 = [('밥', 20), ('국', 30), ('반찬', 35), ('기타', 15)]
S_WASTE = [('채소', 45), ('국물', 25), ('밥', 20), ('기타', 10)]
S_APR = [('기사', 40), ('만화', 30), ('퀴즈', 20), ('기타', 10)]

HARD_ST = {
    's1': [
        ('신문부가 새 기사 거리를 모았어요. 메모를 보고 세 칸에 써 보세요.', [
            {'t': 'el', 'note': '신문부 기사 거리 메모', 'lines': ['아침밥으로 먹은 음식 조사(우리 반 40명)', '동아리별 회원 수 조사', '학급 문고에서 가장 많이 빌린 책 조사']},
            PANES(('보여요', '메모에서 ~이 보여요', '학생 수를 조사한 자료가 여러 개 보여요.'),
                  ('생각해요', '~은 ~그래프로 나타내면 좋을 것 같아요', '아침밥 조사는 전체에 대한 비율을 보여 주는 원그래프로 나타내면 좋을 것 같아요.'),
                  ('궁금해요', '~은 어떻게 그릴까?', '백분율을 어떻게 띠그래프에 나타낼까?'))]),
        ('아침밥 조사 결과를 띠그래프로 나타냈어요. 그래프를 보고 답해 보세요.', [
            GRAPH(('', 'band', '오늘 아침에 먹은 음식별 학생 수', S_BRK), ask=[AI(None, '40명 중 밥을 먹은 학생은 ', N_(16), '명이고, 아침을 안 먹은 학생은 ', N_(8), '명이에요.')]),
            TWHY('기사에 학생 수 대신 백분율을 쓰면 좋은 점을 써 볼까요?', '조사한 학생 수가 달라도 백분율은 전체를 100으로 보고 나타내서 다른 반의 결과와 쉽게 견줄 수 있어요.')]),
        ('기사에 알맞은 그래프를 골라 보세요.', [QUIZ(
            ('일주일 동안 기온의 변화를 쓴 기사에 알맞은 그래프는?', ['꺾은선그래프', '원그래프']),
            ('동아리별 회원 수의 비율을 쓴 기사에 알맞은 그래프는?', ['원그래프', '꺾은선그래프']))]),
        ('기사를 쓰는 차례를 정해 보세요.', [SEQ_(['㉠ 그래프를 보고 기사를 써요.', '㉡ 조사 주제를 정하고 조사해요.', '㉢ 띠그래프나 원그래프로 나타내요.', '㉣ 표로 정리하고 백분율을 구해요.'], [1, 3, 2, 0])]),
        ('기사에 쓸 백분율을 구해 보세요.', [ASK(
            AI(None, '동아리 회원 50명 중 운동 동아리가 18명이면 [18/50] × 100 = ', N_(pc(18, 50)), ' %예요.'),
            AI(None, '미술 동아리가 12명이면 ', N_(pc(12, 50)), ' %예요.'))]),
    ],
    's2': [
        ('동아리별 회원 수를 띠그래프와 원그래프로 나타냈어요. 두 그래프에서 같은 부분을 찾아보세요.', [
            GRAPH(('가', 'band', '동아리별 회원 수', S_CLUB), ('나', 'pie', '동아리별 회원 수', S_CLUB), ask=[
                AI(None, '두 그래프에서 비율이 24 %인 동아리는 ', O_(['미술', '음악', '운동']), '이에요.')]),
            TWHY('띠그래프와 원그래프에서 같은 항목의 비율이 같은 까닭을 써 볼까요?', '두 그래프 모두 같은 자료를 전체 100 %에 대한 비율로 나타냈기 때문이에요.')]),
        ('학급 문고 대출 원그래프의 눈금을 살펴보세요.', [GRAPH(('', 'pie', '많이 빌린 책의 갈래별 권수', S_READ), ask=[
            AI(None, '원그래프 둘레의 작은 눈금 한 칸은 ', N_(1), ' %이고, 만화 부분은 작은 눈금 ', N_(30), '칸이에요.')])]),
        ('두 그래프(동아리, 학급 문고)를 견주어 보세요.', [
            ASK(AI(None, '동아리 그래프에서 가장 높은 항목은 ', O_(['운동', '미술', '음악']), '이고, 학급 문고 그래프에서 가장 높은 항목은 ', O_(['동화', '만화', '과학책']), '예요.'),
                AI(None, '동화의 비율은 과학책의 ', N_(3), '배예요.')),
            WR(('두 그래프에서 알 수 있는 내용을 기사 한 줄로 써 보세요.', '학급 문고에서는 동화가 45 %로 가장 많이 빌린 갈래이고, 과학책의 3배예요.'))]),
        ('띠그래프와 원그래프를 새 말로 정리해요.', [BLK(
            '띠그래프에서 각 부분의 ', O_(['길이', '색깔']), '는 비율에 비례하고, 원그래프에서 각 부분의 ', O_(['넓이', '색깔']), '는 비율에 비례해요.')]),
        ('눈금이 다른 그래프를 살펴보세요.', [ASK(
            AI(None, '길이가 15 cm인 띠그래프에서 20 %인 부분의 길이는 ', N_(3), ' cm예요.'),
            AI(None, '원그래프에서 50 %인 부분은 원 전체의 ', O_(['[1/2]', '[1/4]', '[1/5]']), '이에요.'))]),
    ],
    's3': [
        ('동생들 25명의 체육 시간 활동을 조사했어요. 먼저 예상한 다음, 백분율을 구해 보세요.', [
            RFIRST('25명 중 한 명은 전체의 몇 %일지 예상해 써요.', '100 ÷ 25 = 4이므로 한 명은 4 %예요.'),
            TB_([['활동', '피구', '달리기', '줄넘기', '기타', '합계'], ['학생 수(명)', '8', '7', '6', '4', '25']]),
            ASK(AI(None, '피구 ', N_(pc(8, 25)), ' %, 달리기 ', N_(pc(7, 25)), ' %, 줄넘기 ', N_(pc(6, 25)), ' %, 기타 ', N_(pc(4, 25)), ' %'))]),
        ('체육 시간 활동별 학생 수를 띠그래프로 나타내 보세요.', [DRAW('band', '체육 시간 활동별 학생 수', S_PE, 1)]),
        ('같은 자료를 원그래프로 나타내 보세요.', [
            DRAW('pie', '체육 시간 활동별 학생 수', S_PE, 0),
            TWHY('원그래프를 그릴 때 이전 항목이 끝난 자리에서 이어서 나누는 까닭을 써 볼까요?', '각 부분이 겹치거나 비지 않게 나누어야 모든 항목의 백분율의 합이 100 %가 되기 때문이에요.')]),
        ('그래프로 나타내는 차례를 새 예로 정리해요.', [BLK(
            '표로 정리 → 각 항목의 ', O_(['백분율', '학생 수의 차']), ' 구하기 → 백분율의 합이 ', N_(100), ' %인지 확인 → 비율에 따라 띠나 원을 나누기 → ', O_(['제목 쓰기', '색칠만 하기']))]),
        ('반올림한 백분율을 구해 보세요.', [ASK(
            AI(None, '28명 중 9명이 고른 항목을 소수 첫째 자리까지 반올림하면 ', N_(32.1), ' %예요.'),
            AI(None, '28명 중 5명이 고른 항목은 ', N_(17.9), ' %예요.'))]),
    ],
    's45': [
        ('우리 반 용돈 기사를 쓰려고 해요. 조사 방법을 정해 보세요.', [QUIZ(
            ('조사 주제로 알맞은 것을 고르세요.', ['용돈을 주로 쓰는 곳', '선생님의 나이']),
            ('조사 결과를 백분율로 나타내려면 무엇이 꼭 필요할까요?', ['조사한 전체 학생 수', '조사한 날의 날씨']))]),
        ('설문 쪽지를 정리한 표예요. 표를 완성해 보세요.', [
            TB_([['쓰는 곳', '간식', '저금', '학용품', '기타', '합계'], ['학생 수(명)', '8', '6', '4', '2', '(    )']]),
            ASK(AI(None, '조사한 학생은 모두 ', N_(20), '명이에요.'))]),
        ('백분율을 구해 띠그래프로 나타내 보세요.', [
            ASK(AI(None, '간식 ', N_(pc(8, 20)), ' %, 저금 ', N_(pc(6, 20)), ' %, 학용품 ', N_(pc(4, 20)), ' %, 기타 ', N_(pc(2, 20)), ' %')),
            DRAW('band', '용돈을 주로 쓰는 곳별 학생 수', S_MONEY, 0)]),
        ('같은 자료를 원그래프로 나타내 보세요.', [DRAW('pie', '용돈을 주로 쓰는 곳별 학생 수', S_MONEY, 0)]),
        ('반올림해도 백분율의 합계를 100 %로 맞추어 보세요.', [
            TB_([['좋아하는 기사', '만화', '퀴즈', '소식', '합계'], ['학생 수(명)', '5', '5', '2', '12']]),
            ASK(AI(None, '만화 [5/12] × 100은 소수 첫째 자리까지 반올림하면 ', N_(41.7), ' %, 퀴즈도 ', N_(41.7), ' %, 소식은 ', N_(16.7), ' %예요.'),
                AI(None, '세 백분율의 합은 ', N_(100.1), ' %이므로 가장 큰 항목 하나를 ', N_(41.6), ' %로 고쳐 합계를 100 %로 맞추어요.'))]),
        ('용돈 기사를 써 보세요.', [
            ASK(AI(None, '간식에 쓰는 학생의 비율은 학용품의 ', N_(2), '배예요.')),
            WR(('용돈 그래프를 보고 기사 한 문단을 써 보세요.', '우리 반 학생 20명 중 40 %가 용돈을 주로 간식에 써요. 저금하는 학생은 30 %로 두 번째로 많아요.'))]),
    ],
    's6': [
        ('두 해의 급식 잔반 띠그래프를 견주어 보세요.', [GRAPH(('작년', 'band', '종류별 잔반의 양(작년)', S_FOOD22), ('올해', 'band', '종류별 잔반의 양(올해)', S_FOOD23), ask=[
            AI(None, '비율이 줄어든 항목은 ', O_(['밥', '국', '반찬']), '이고, 비율이 변하지 않은 항목은 ', O_(['반찬', '국', '기타']), '이에요.')])]),
        ('잔반 전체의 양이 작년 400 kg, 올해 300 kg이에요. 실제 양을 구해 보세요.', [
            ASK(AI(None, '국 잔반: 작년 400 × 0.25 = ', N_(100), ' kg, 올해 300 × 0.3 = ', N_(90), ' kg')),
            TWHY('국 잔반의 비율은 늘었는데 실제 양은 줄어든 까닭을 써 볼까요?', '올해 잔반 전체의 양이 400 kg에서 300 kg으로 줄었기 때문에 비율이 늘어도 실제 양은 줄 수 있어요.')]),
        ('이번 달 잔반의 종류를 원그래프로 나타냈어요. 그래프를 해석해 보세요.', [GRAPH(('', 'pie', '이번 달 종류별 잔반의 양', S_WASTE), ask=[
            AI(None, '잔반이 80 kg이면 채소 잔반은 80 × 0.45 = ', N_(36), ' kg이에요.'), AI(None, '국물과 밥을 합한 비율은 ', N_(45), ' %로 채소와 같아요.')])]),
        ('잔반 줄이기 기사를 완성해요.', [
            BLK('이번 달 잔반 가운데 가장 많은 것은 ', O_(['채소', '국물', '밥']), '이고, 그 비율은 밥의 ', O_(['2.25배', '2배', '4.5배']), '예요.'),
            WR(('잔반을 줄이기 위한 기사 제목과 한 줄 내용을 써 보세요.', '채소 잔반이 45 %! 한 입씩 더 먹어 잔반을 줄여요.'))]),
        ('그래프에서 알 수 있는 것을 새 말로 정리해요.', [BLK(
            '두 해의 그래프를 견줄 때 비율이 같아도 전체의 양이 다르면 실제 양은 ', O_(['다를 수 있어요', '항상 같아요']), '. 그래서 ', O_(['전체의 양', '그래프의 색']), '도 함께 살펴봐요.')]),
        ('학급 문고 대출 기사를 확인해 보세요.', [GRAPH(('', 'band', '이번 달 학급 문고 대출 갈래', [('동화', 35), ('만화', 30), ('과학책', 25), ('기타', 10)]), ask=[
            AI(None, '대출한 책이 120권이면 과학책은 ', N_(30), '권이고, 만화보다 ', N_(6), '권 적어요.')])]),
    ],
    's7': [
        ('줄넘기 기사에 쓸 그래프를 골라 보세요.', [QUIZ(
            ('한 달 동안 줄넘기 기록이 늘어난 모습을 나타내기 알맞은 그래프는?', ['꺾은선그래프', '원그래프']),
            ('줄넘기 종목별로 연습한 학생의 비율을 나타내기 알맞은 그래프는?', ['띠그래프', '꺾은선그래프']))]),
        ('도서관 기사의 표를 보고 알맞은 그래프를 골라 보세요.', [
            TB_([['달', '3월', '4월', '5월', '6월'], ['대출 권수(권)', '150', '210', '180', '250']]),
            ASK(AI(None, '이 자료에 알맞은 그래프는 ', O_(['꺾은선그래프', '원그래프']), '이고, 대출 권수가 가장 많이 늘어난 때는 ', O_(['5월과 6월 사이', '3월과 4월 사이']), '예요.'),
                AI(None, '6월 대출 권수는 3월보다 ', N_(100), '권 많아요.'))]),
        ('그래프의 특징을 알맞은 칸에 번호로 정리해 보세요.', [
            SORT_([('수량을 그림으로 나타내 지역별로 보기 좋아요.', 0), ('항목별 수량의 크기를 막대로 비교해요.', 1), ('자료가 변하는 모양을 선으로 나타내요.', 2),
                   ('전체에 대한 각 부분의 비율을 나타내요.', 3), ('조사하지 않은 중간값을 어림할 수 있어요.', 2), ('각 부분의 비율을 길이나 넓이로 견줘요.', 3)],
                  ['그림그래프', '막대그래프', '꺾은선그래프', '띠·원그래프']),
            TWHY('띠그래프와 원그래프를 같은 칸에 넣은 까닭을 써 볼까요?', '두 그래프 모두 전체에 대한 각 부분의 비율을 백분율로 나타내는 그래프이기 때문이에요.')]),
        ('기사에 알맞은 그래프를 고르고 까닭을 써 보세요.', [
            QUIZ(('반별 헌 종이 모은 양을 비교하는 기사에 알맞은 그래프는?', ['막대그래프', '꺾은선그래프', '원그래프'])),
            WR(('“우리 학교 전체 쓰레기 가운데 종이가 차지하는 비율”을 쓴 기사에 알맞은 그래프와 까닭을 써 보세요.', '원그래프예요. 전체에 대한 종이의 비율을 한눈에 보여 줄 수 있어요.'))]),
        ('헌 종이 모으기 기사를 확인해 보세요.', [ASK(
            AI(None, '모은 헌 종이 200 kg 가운데 신문지가 70 kg이면 ', N_(35), ' %, 상자가 90 kg이면 ', N_(45), ' %, 나머지는 ', N_(20), ' %예요.'))]),
    ],
    's89': [
        ('분리배출 기사의 두 해 자료예요. 표를 보고 답해 보세요.', [
            TB_([['종류', '종이', '플라스틱', '캔', '기타', '전체의 양'], ['작년(%)', '45', '30', '15', '10', '600 kg'], ['올해(%)', '40', '30', '20', '10', '900 kg']]),
            QUIZ(('작년보다 올해 비율이 늘어난 종류는 무엇일까요?', ['캔', '종이', '플라스틱']))]),
        ('비율만 보지 말고 실제 양으로도 견주어 보세요.', [
            RFIRST('종이의 비율은 줄었는데, 실제 양도 줄었을지 예상해 써요.', '전체의 양이 600 kg에서 900 kg으로 늘어서 종이의 실제 양은 270 kg에서 360 kg으로 늘었어요.'),
            ASK(AI(None, '종이: 작년 600 × 0.45 = ', N_(270), ' kg, 올해 900 × 0.4 = ', N_(360), ' kg'))]),
        ('잘못 쓴 기사를 찾아 바로잡아 보세요.', [
            ASK(AI(None, '“플라스틱은 비율이 같으므로 모은 양도 같다.”는 기사는 ', O_(['틀렸어요', '맞아요']), '. 작년 ', N_(180), ' kg, 올해 ', N_(270), ' kg이에요.')),
            WR(('잘못 쓴 기사를 바르게 고쳐 써 보세요.', '플라스틱의 비율은 30 %로 같지만, 전체의 양이 늘어서 모은 양은 180 kg에서 270 kg으로 늘었어요.'))]),
        ('알뜰 장터에서 번 돈 60만 원의 쓰임을 원그래프로 나타냈어요. 판단해 보세요.', [
            GRAPH(('', 'pie', '알뜰 장터 수익금의 쓰임', [('기부', 45), ('학급 문고', 30), ('간식', 15), ('기타', 10)])),
            ASK(AI(None, '기부한 돈은 60 × 0.45 = ', N_(27), '(만 원)이고, 학급 문고에 쓴 돈은 ', N_(18), '만 원이에요.'),
                AI(None, '수익금이 80만 원이고 비율이 같다면 간식에 쓴 돈은 ', N_(12), '만 원이에요.'))]),
        ('그래프를 판단할 때 생각할 점을 새 말로 정리해요.', [BLK(
            '두 그래프의 비율을 견줄 때는 ', O_(['전체의 양', '그래프의 크기']), '이 같은지 먼저 살펴봐요. 실제 양은 (전체의 양) × ', O_(['(비율)', '(항목 수)']), '로 구해요.')]),
        ('편집 회의에서 발표할 내용을 써 보세요.', [WR(
            ('분리배출 자료에서 비율과 실제 양이 다르게 움직인 예를 찾아 발표할 말을 써 보세요.', '종이는 비율이 45 %에서 40 %로 줄었지만, 실제 양은 270 kg에서 360 kg으로 늘었어요.'))]),
    ],
    's10': [
        ('그래프 빙고 놀이 방법을 차례대로 정해 보세요.', [SEQ_(['㉠ 먼저 세 줄을 완성한 사람이 이겨요.', '㉡ 그래프 카드 9장을 골라 빙고판에 놓아요.', '㉢ 돌아가며 한 그래프를 제목 없이 설명해요.', '㉣ 설명에 알맞은 카드에 ◯표 해요.'], [1, 2, 3, 0])]),
        ('세 그래프를 보고 설명에 알맞은 그래프를 찾아보세요.', [GRAPH(
            ('①', 'band', '가 모둠이 좋아하는 기사', [('만화', 45), ('퀴즈', 25), ('소식', 20), ('기타', 10)]),
            ('②', 'band', '나 모둠이 좋아하는 기사', [('만화', 30), ('퀴즈', 30), ('소식', 25), ('기타', 15)]),
            ('③', 'band', '다 모둠이 좋아하는 기사', [('만화', 40), ('퀴즈', 20), ('소식', 30), ('기타', 10)]), ask=[
                AI(None, '“만화가 가장 높고 소식이 30 %예요.”에 알맞은 그래프: ', O_(['③', '①', '②'])),
                AI(None, '“비율이 같은 두 항목이 있어요.”에 알맞은 그래프: ', O_(['②', '①', '③']))])]),
        ('빙고 놀이에서 설명할 말을 미리 써 보세요.', [WR(
            ('위 그래프 ①을 제목을 말하지 않고 설명하는 말을 써 보세요.', '만화가 45 %로 가장 높고, 퀴즈는 소식보다 5 % 높아요. 기타는 10 %예요.'))]),
        ('친구의 설명을 듣고 알맞은 그래프를 골라 보세요.', [QUIZ(
            ('“퀴즈가 20 %로 가장 낮은 기사예요.” 어느 그래프의 설명일까요?', ['③', '①', '②']),
            ('“기타가 15 %예요.” 어느 그래프의 설명일까요?', ['②', '①', '③']))]),
        ('놀이를 되돌아봐요.', [
            QUIZ(('친구에게 그래프를 설명할 때 좋은 방법을 모두 고르세요.', ['비율이 가장 높은 항목을 말해요.', '두 항목의 비율을 견주어 말해요.', '그래프의 색깔만 말해요.'], [0, 1])),
            WR(('놀이에서 설명하기 어려웠던 그래프와 그 까닭을 써 보세요.', '②번이 어려웠어요. 만화와 퀴즈의 비율이 같아서 가장 높은 항목을 하나로 말할 수 없었어요.'))]),
    ],
    's11': [
        ('신문 독자 50명에게 7월에 좋아하는 꼭지를 물었어요. 표를 완성해 보세요.', [
            TB_([['꼭지', '기사', '만화', '퀴즈', '기타', '합계'], ['학생 수(명)', '20', '15', '10', '5', '50'], ['백분율(%)', '', '', '', '', '']]),
            ASK(AI(None, '기사 ', N_(pc(20, 50)), ' %, 만화 ', N_(pc(15, 50)), ' %, 퀴즈 ', N_(pc(10, 50)), ' %, 기타 ', N_(pc(5, 50)), ' %'))]),
        ('7월 조사 결과를 띠그래프로 나타내 보세요.', [DRAW('band', '7월에 좋아하는 꼭지별 학생 수', S_APR, 0)]),
        ('같은 자료를 원그래프로 나타내고, 그래프 제목을 정해 보세요.', [
            DRAW('pie', '7월에 좋아하는 꼭지별 학생 수', S_APR, 0),
            WR(('원그래프를 보고 알 수 있는 내용을 한 줄로 써 보세요.', '기사가 40 %로 가장 인기 있고, 만화는 퀴즈의 1.5배예요.'))]),
        ('4월(독자 40명)의 띠그래프와 견주어 보세요.', [GRAPH(('', 'band', '4월에 좋아하는 꼭지별 학생 수', [('기사', 30), ('만화', 35), ('퀴즈', 25), ('기타', 10)]), ask=[
            AI(None, '4월에 만화를 좋아한 학생은 ', N_(14), '명이고, 7월에는 ', N_(15), '명이에요.'),
            AI(None, '만화의 비율은 4월이 더 ', O_(['높지만', '낮지만']), ' 학생 수는 7월이 더 많아요.')])]),
        ('친구들의 말에서 잘못된 곳을 찾아보세요.', [
            QUIZ(('잘못 말한 사람은 누구일까요?', ['서준: 기사의 비율이 늘었으니 기사를 좋아한 학생 수도 늘었어요. 4월 12명, 7월 20명이에요.', '다은: 퀴즈의 비율이 같으면 학생 수도 늘 같아요.'], 1)),
            TWHY('다은이의 말이 틀린 까닭을 써 볼까요?', '비율이 같아도 조사한 전체 학생 수가 다르면 학생 수는 달라질 수 있기 때문이에요.')]),
        ('1차시에 궁금했던 것을 떠올리며 단원을 정리해요.', [
            {'t': 'wonderRecall'},
            BLK('백분율의 합계는 언제나 ', N_(100), ' %예요. 전체가 40명이면 한 명은 ', N_(2.5), ' %이고, 전체가 다른 두 그래프를 견줄 때는 ', O_(['실제 양', '그래프의 색']), '도 함께 생각해요.')]),
    ],
}


def main():
    if 'dump' in sys.argv[1:]:
        print(json.dumps(load(SRC_ST if 'st' in sys.argv[1:] else SRC_TB), ensure_ascii=False, indent=1))
        shutil.rmtree(WORK, ignore_errors=True)
        return
    want = [a for a in sys.argv[1:] if a in ('tb', 'st')] or ['tb', 'st']
    out = []
    try:
        if 'tb' in want:
            D = load(SRC_TB)
            print('수 점검 %d곳' % check_numbers(D))
            for lv in ('기본형', '도전형'):
                out.append(build(D if lv == '기본형' else harden(D, 'tb'), '6-1 수학 5. 여러 가지 그래프(교과서 차시)', '교과서 차시', OUT_TB, lv))
        if 'st' in want:
            if ST and os.path.exists(SRC_ST):
                D = load(SRC_ST)
                print('이야기 버전 수 점검 %d곳, 까닭 쓰기 %d차시' % (check_numbers(D), check_st(D)))
                for lv in ('기본형', '도전형'):
                    out.append(build_st(D if lv == '기본형' else harden(D, 'st'), lv))
            else:
                print('[건너뜀] 이야기 버전 원본(u5-graph.st.js)이 없어요.')
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
