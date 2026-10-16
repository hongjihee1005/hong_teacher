# -*- coding: utf-8 -*-
"""6-2 수학 3. 공간과 입체 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u3-space.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u3-space.py tb       # 교과서 차시 버전만

앱 원본 ../units/sem2/u3-space.tb.js('영상 촬영 학교 공간과 입체', 9개 차시 묶음: 1·2·3·4·5·6·7~8·9·10)의
LESSONS를 node에서 가짜 DOM으로 그대로 실행해, 단계마다 넘긴 물음·보기·정답·쌓기나무 배치(SP6_D)·그림(SVG)을 모아(_EX) 그대로 씁니다.
그래서 앱의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·배치·정답이 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.

  - 쌓기나무 투영도, 위·앞·옆에서 본 모양, 층별 모양, 사진·지도는 앱의 그리기 코드(sp6Iso·sp6View·sp6Photo·sp6Map)가 만든 SVG 그대로입니다.
  - 칠하기(sp6Paint)는 앱과 같은 크기의 빈 모눈(위·층별: 아래쪽이 앞 / 앞·옆: 굵은 바닥 선)을, 수 쓰기(sp6Nums)는 쌓기나무가 있는 칸만,
    쌓기(sp6Build)는 판과 같은 크기의 '위에서 본 모양에 수 쓰기' 칸을 넣습니다(종이에서는 쌓기나무로 쌓은 뒤 수로 나타냄).
  - 쌓기 활동의 정답은 node에서 앱의 채점 함수(check·sp6Joined)에 맞는 배치를 모두 찾아 씁니다(개수가 여러 가지면 모두).
  - 위·앞·옆 모양과 층별 개수는 파이썬으로 따로 다시 계산해 assert로 맞춥니다.
  - 이야기 버전(ST)은 아직 없어서 건너뜁니다(앱 원본 u3-space.st.js가 생기면 ST 목록에 더함).
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
function writeStep(b, a, items, opts) { REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag, ph: x.ph })) }); }
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
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
NAME = '3단원_공간과입체_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨'
SUB = '⑴⑵⑶⑷⑸'
WORK = tempfile.mkdtemp(prefix='u3space_')
F = 0.3           # 그림: SVG 1 px = 0.3 mm (쌓기나무 한 개 너비 52 px ≈ 16 mm, 모눈 한 칸 34 px ≈ 10 mm)
ROW_PX = 170 / F  # 한 줄에 놓을 수 있는 그림 너비
ST = []           # 이야기 버전 차시(아직 없음 — 원본 u3-space.st.js가 생기면 더함)

INK, BLUE, GREEN, GRAY, LINE = '#1D2A2A', '#2B7BD6', '#2E8B57', '#8795A1', '#5A6B73'


def fmt(v):
    v = round(float(v), 2)
    return str(int(v)) if v.is_integer() else ('%g' % v)


# ================================================================ 앱 읽기(node)
def load(src):
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
    verify(d)
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
        s.lines(2)
        ans.append('(자유) ' + it['ph'].replace('예) ', '예: '))
    return ' / '.join(ans)


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
    if t == 'chain':
        out = []
        for k, part in enumerate(rec['parts']):
            t = part['title'] or ''
            lab = t if re.fullmatch(r'[①②③]|보기', t) else SUB[k]
            if t:
                s.text(lab if lab == t else lab + ' ' + re.sub(r'^[①②③]\s+(?=\S)', '', t))
            out.append(lab + ' ' + '; '.join(render_rec(s, lv, r, None) for r in part['recs']))
        return ' '.join(out)
    return HANDLERS[t](s, lv, rec, st)


# ---------------------------------------------------------------- 조작 활동(종이에서 하는 말로)
def h_sequence(s, lv, rec, st):
    for c in rec['cards']:
        s.text(c)
    s.ask('놀이 차례대로 기호를 써 보세요.')
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
        s.text('칸을 색칠해 그려요. 앞·옆에서 본 모양은 굵은 바닥 선 위에 바닥부터 칠해요.')
    put_figs(s, figs)
    out = ' · '.join(paint_ans(it) for it in rec['items'])
    return ask_after(s, lv, rec, out)


def h_nums(s, lv, rec, st):
    put_fig(s, rec['show'])
    H = rec['H']
    only = [[1 if v else 0 for v in r] for r in H]
    put_figs(s, [(grid_svg(len(H), len(H[0]), 'top', nums=H if rec['given'] else None, only=only), rec['title'] or '위에서 본 모양')])
    if rec['total']:
        s.ask(('%s ' % rec['totalQ'] if rec['totalQ'] else '똑같은 모양으로 만드는 데 필요한 쌓기나무는 ') + '(        )개예요.', blank=False)
    out = ('보기 ' if rec['given'] else '') + num_txt(H) + (' → %d개' % rec['sum'] if rec['total'] else '')
    return ask_after(s, lv, rec, out)


def h_turn(s, lv, rec, st):
    V = {v['d']: v for v in rec['views']}
    if lv == '기본형':
        put_figs(s, [(rec['iso'], '시청 모양')] + [(V[d]['svg'], d + '에서 본 모양') for d in ('위', '앞', '뒤', '왼쪽', '오른쪽')])
        s.text('앞과 뒤에서 본 모양, 오른쪽과 왼쪽에서 본 모양을 견주어 보세요.')
        out = ''
    else:
        put_figs(s, [(rec['iso'], '시청 모양')] + [(V[d]['svg'], d + '에서 본 모양') for d in ('위', '앞', '오른쪽')])
        M = max(max(v['v']) if isinstance(v['v'][0], int) else 1 for v in rec['views'])
        s.text('뒤와 왼쪽에서 본 모양을 칸에 칠해 그려 보세요. (뒤에서 보면 왼쪽과 오른쪽이 바뀌어요.)')
        put_figs(s, [(grid_svg(M + 1, len(V['뒤']['v']) + 1, 'up'), '뒤에서 본 모양'), (grid_svg(M + 1, len(V['왼쪽']['v']) + 1, 'up'), '왼쪽에서 본 모양')])
        out = '뒤: 왼쪽부터 %s층 · 왼쪽: 왼쪽부터 %s층' % (', '.join(map(str, V['뒤']['v'])), ', '.join(map(str, V['왼쪽']['v'])))
    return ask_after(s, lv, rec, out)


def h_layers(s, lv, rec, st):
    nm = rec['names'] or []
    put_figs(s, [(rec['iso'], '호텔 모양')] + [(L['svg'], '%d층%s' % (L['k'], ' · ' + nm[L['k'] - 1] if nm else '')) for L in rec['layers']])
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


HANDLERS = {'figs': h_figs, 'sequence': h_sequence, 'sp6Pick': h_pick, 'sp6Build': h_build, 'sp6Paint': h_paint, 'sp6Nums': h_nums,
            'sp6Turn': h_turn, 'sp6Layers': h_layers, 'sp6Scene': h_scene, 'sp6Guess': h_guess}

PAPER = [('지도에서 사진기를 끌어 돌리거나 단추를 눌러 가, 나, 다 방향에서 학교 입구를 모두 보세요.', '지도에서 가, 나, 다 방향에 서서 학교 입구를 본다고 생각해 보세요.'),
         ('먼저 지도에서 사진기를 돌려 네 사람이 서 있는 곳에서 모두 보세요.', '지도에서 네 사람이 서 있는 곳을 살펴보세요.'),
         ('방향 단추를 눌러 위, 앞, 뒤, 왼쪽, 오른쪽에서 본 모양을 모두 살펴보세요.', '위, 앞, 뒤, 왼쪽, 오른쪽에서 본 모양을 살펴보세요.'),
         ('층 단추를 눌러 만든 모양을 층별로 살펴보세요.', '만든 모양을 층별로 살펴보세요.'),
         ('놀이 방법을 차례대로 눌러 보세요.', '놀이 방법을 차례대로 알아보세요.'),
         ('2명이 하는 놀이를 컴퓨터와 해 보세요. 컴퓨터가 쌓기나무 5개로 만든 모양의 위에서 본 모양을 보여 줘요. ', '짝과 함께 2명이 하는 놀이를 해 보세요. '),
         ('(위에서 칸 아래의 층별 모양은 잠시 가려 두었어요.)', '')]

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


def lesson(s, lv, L):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    out = []
    for i, st in enumerate(L['steps']):
        s.step('%s %s' % (NUM[i], st['name']))
        inst = st['inst']
        for a, b in PAPER:
            inst = inst.replace(a, b)
        s.text(inst.strip())
        if lv == '기본형' and st['hints'] and st['recs'][0]['t'] not in ('write', 'sp6Guess'):
            s.text('도움: ' + st['hints'][0])
        out.append(NUM[i] + ' ' + '; '.join(render_rec(s, lv, r, st) for r in st['recs']))
    if lv == '도전형':
        n = len(L['steps'])
        ch = L['challenge']
        if ch:
            s.step('%s 도전하기' % NUM[n])
            inst = ch['inst']
            for a, b in PAPER:
                inst = inst.replace(a, b)
            s.text(inst)
            out.append(NUM[n] + ' ' + '; '.join(render_rec(s, lv, r, ch) for r in ch['recs']))
            n += 1
        q, a = WHY[str(L['no'])]
        s.step('%s 까닭 쓰기' % NUM[n])
        s.ask(q, blank=False)
        s.lines(2)
        out.append(NUM[n] + ' ' + a)
    return '%s차시  ' % L['no'] + '   '.join(out)


def build(D, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='6학년')
    lines = [lesson(s, lv, L) for L in D['lessons']]
    s.answers('【교사용】 3. 공간과 입체(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u3-space.html과 차시 번호가 같습니다. 수를 쓴 모양 [ ]은 뒷줄부터 앞줄 차례, 왼쪽부터이고 ‘-’는 빈자리, ■는 칠할 칸입니다. '
                   '쌓기나무 그림은 지도서의 답이 그대로 나오도록 앱에서 새로 그린 모양입니다.')
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
        if 'st' in want and not ST:
            print('[건너뜀] 이야기 버전 원본(u3-space.st.js)이 아직 없어요.')
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
