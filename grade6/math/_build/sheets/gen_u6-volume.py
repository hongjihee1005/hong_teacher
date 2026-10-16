# -*- coding: utf-8 -*-
"""6-1 수학 6. 직육면체의 부피와 겉넓이 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u6-volume.py          # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u6-volume.py tb       # 교과서 차시 버전만

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
  - 이야기 버전(ST)은 아직 없어서 건너뜁니다(앱 원본 u6-volume.st.js가 생기면 ST 목록에 더함).
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
writeStep = function (b, a, items) { if (!INNER) REC.push({ t: 'write', items: items.map(x => ({ q: x.q, tag: x.tag || '', ph: x.ph || '' })) }); };
const ORIG = { vo6Ask };
vo6Ask = function (host, ap, items, opts) { if (!INNER) REC.push({ t: 'ask', items: items.map(serQ), ok: (opts || {}).ok || '', title: (opts || {}).title || '' }); return new El('div'); };
vo6Chain = function (body, ap, parts) {
  const out = [];
  for (const p of parts) { const save = REC; REC = []; const box = new El('div'); (p.run || p)(box, ap); out.push({ title: p.title || null, recs: REC, extra: extras(box) }); REC = save; }
  REC.push({ t: 'chain', parts: out });
};
function capThen(fn, extra) { const save = REC; REC = []; const box = new El('div'); fn(box, api, extra); const r = REC; REC = save; return r; }
const WID = ['vo6Pour', 'vo6Touch', 'vo6Fill', 'vo6Dims', 'vo6Net', 'vo6M3', 'vo6Pack', 'vo6Make', 'vo6Hunt', 'vo6Notes', 'vo6Cards'];
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
          const D = vo6PackD(B, n); return String(vo6Solid({ d: D, mode: 'none', blocks: bl, W: 230, H: 170, labels: { a: D[0] + ' cm', b: D[1] + ' cm', c: D[2] + ' cm' }, plain: true })); };
        rec.svgSol = sol.length ? packSvg(sol[0].n) : null;
        rec.one = String(vo6Solid({ d: B, mode: 'solid', s: 12, tint: { top: VO6.box[0], front: VO6.box[1], right: VO6.box[2] }, labels: { a: B[0] + ' cm', b: B[1] + ' cm', c: B[2] + ' cm' }, plain: true }));
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
OUT.D = VO6_D; OUT.P8 = VO6_P8; OUT.names = VO6_NAMES;
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
INTERACT = re.compile(r'눌러|누르|누를|끌어|단추|화면|컴퓨터 친구|앱|‘한 줄 채우기’|‘한 층 채우기’')


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
    for it in rec['items']:
        s.ask(it['q'], blank=False)
        if lv == '기본형' and it.get('tag'):
            s.labeled([(it['tag'], '')], row_h=3969 * 2)
        else:
            s.lines(3)
        ans.append(it['ph'] or '(생각을 쓰면 맞아요)')
    return ' / '.join(ans)




# ================================================================ 이 단원의 조작 부품 → 활동지
REAL_Q = {'직사각형의 넓이는 몇 cm²인가요?': lambda: rect_real(8, 5)}


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
    side(s, [('상자 가', rec['figs0'][0]['svg']), ('상자 나', rec['figs0'][1]['svg'])], 110)
    s.text('상자 가는 가로 쌓기나무 %d개, 세로 %d개, 높이 %d개 길이이고, 상자 나는 가로 %d개, 세로 %d개, 높이 %d개 길이예요.' % (A[0], A[1], A[2], B[0], B[1], B[2]))
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
    side(s, [('상자 한 개', rec['one']), ('쌓은 모양', rec['svgSol'])], 100)
    return after(s, lv, rec)


def w_make(s, lv, rec):
    o = rec['opt']
    vol = o.get('kind') != 'surf'
    U, word = ('cm³', '부피') if vol else ('cm²', '겉넓이')
    s.text('① 내 문제 만들기 — 주변에서 직육면체 모양의 물건을 하나 골라 자로 가로, 세로, 높이를 재고, %s를 구하는 문제를 만들어 보세요.' % word)
    if lv == '기본형':
        s.text('예) 지우개, 필통, 과자 상자, 택배 상자, 사물함, 주사위, 초콜릿 상자, 휴지 상자')
    s.labeled([('고른 물건', ''), ('잰 길이', '가로 (       ) cm,  세로 (       ) cm,  높이 (       ) cm'), ('내가 만든 문제', ''), ('내 답', '')],
              label_mm=34, row_h=3969 + 600)
    f = o['friend']
    s.text('② 바꾸어 풀기 — 짝이 만든 문제를 풀어 보세요.')
    s.fill(f['q'])
    pic(s, rec['friendSvg'], 50)
    s.ask('%s의 %s:   (            ) %s' % (f['obj'], word, U), blank=False)
    d = f['d']
    right = d[0] * d[1] * d[2] if vol else 2 * (d[0] * d[1] + d[1] * d[2] + d[0] * d[2])
    assert right == f['a'], (f, right)
    return '내 문제: 잰 길이로 바르게 계산하면 맞아요 / 짝의 문제 %d %s' % (f['a'], U)


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
           'vo6Pack': w_pack, 'vo6Make': w_make, 'vo6Hunt': w_hunt, 'vo6Notes': w_notes, 'vo6Cards': w_cards}


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


EXTRA = {('t2', '약속하기'): extra_cube}


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


def check_numbers(D):
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
    assert nexpr >= 25, nexpr
    vol = lambda a, b, c: a * b * c
    surf = lambda a, b, c: 2 * (a * b + b * c + a * c)
    expect = [8 * 5, 100 * 100, vol(*D['D']['boxA']), vol(*D['D']['boxB']), vol(*D['D']['boxA']) // 4,     # 1·2차시(지우개는 쌓기나무 4개)
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
              note='※ 이 활동지는 앱 u6-volume.html과 차시 번호가 같습니다. '
                   '1차시 직사각형, 2차시 1 cm³ 정육면체의 전개도, 7~8차시 직육면체의 전개도는 실제 크기이므로 100%로 인쇄하세요. 쓰기 칸의 ‘예)’는 예시 답이에요.')
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
