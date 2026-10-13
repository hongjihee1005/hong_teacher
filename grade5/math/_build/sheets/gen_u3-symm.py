# -*- coding: utf-8 -*-
"""5-2 수학 3. 합동과 대칭 활동지(교과서 차시 버전[·이야기 버전] × 기본형·도전형) 만들기

    python3 gen_u3-symm.py            # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u3-symm.py tb         # 교과서 차시 버전만
    python3 gen_u3-symm.py st         # 이야기 버전만(원본이 다 되어 있을 때)

앱 원본 ../units/sem2/u3-symm.tb.js('미술관 합동과 대칭', 12차시: 1·2·3·4·5~6·7·8~9·10·11·12)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.

이야기 버전(u3-symm.st.js)은 아직 만드는 중이라, 원본 파일이 없거나 LESSONS가 다 들어 있지 않으면 건너뜁니다.
나중에 st1 … st12 함수를 쓰고 ST 목록에 넣으면 sem2-soop/sheets/에 같은 이름으로 만들어집니다
(교과서 버전과 같은 그림 도구 fig_*·wsComplete를 그대로 쓸 수 있어요. 이야기 버전 그림은 extract()에 st.js를 넘겨 뽑아요).

그림
  - 모든 도형은 앱 원본의 그리기 코드(sy3Fig·sy3RowFig·sy3Museum …)를 node로 그대로 실행해 SVG로 옮겨 씁니다.
    그래서 꼭짓점 이름·길이 글·각도 글·모눈이 앱과 똑같습니다.
  - 학생이 자·각도기로 재거나 대응점을 찍어 도형을 완성하는 그림은 **실제 크기**로 넣습니다:
    1 cm = 40 px(앱의 한 칸 = 1 cm), 그림 너비(mm) = px ÷ 4. 모눈 한 칸이 정말로 1 cm예요.
  - 길이가 글로 적혀 있는 그림(□ 구하기)은 줄여 넣습니다.
정답(대응점·대응변·대응각, 변의 길이·각의 크기, 대칭축의 수, 대칭의 종류, 완성할 대응점의 자리, 둘레)은
모두 이 스크립트가 앱의 좌표·판정 함수(sy3Kind·sy3SymLines·sy3CKey)로 계산해 assert로 확인합니다.
그림은 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""
import json
import math
import os
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
UNITS = os.path.join(ROOT, '_build', 'units', 'sem2')
SRC_TB = os.path.join(UNITS, 'u3-symm.tb.js')
SRC_ST = os.path.join(UNITS, 'u3-symm.st.js')
OUT = {'tb': os.path.join(ROOT, 'sem2', 'sheets'), 'st': os.path.join(ROOT, 'sem2-soop', 'sheets')}
LABEL = {'tb': '교과서 차시', 'st': '이야기 버전'}
NAME = '3단원_합동과대칭_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧'
WORK = tempfile.mkdtemp(prefix='u3symm_')
U = 40            # 실제 크기: 1 cm = 40 px

# ================================================================ 그림 찍기(Chromium 하나)
_NODE = r"""
const path = require('path');
const { chromium } = require(path.join(process.env.NPM_ROOT, 'playwright'));
const readline = require('readline');
(async () => {
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 2600, height: 1200 }, deviceScaleFactor: 1 });
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
        key = (svg, int(width_px))
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


SHOT = Shot()

# ================================================================ 앱 그림 코드 옮겨 오기(node)
_EX = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const FONT = process.argv[4];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = Object.assign({}, a || {}); this.kids = []; this.textContent = ''; this.style = {}; this.dataset = {};
    this.classList = { add() {}, remove() {}, toggle() {} }; }
  append(...k) { for (const x of k.flat(9)) if (x != null && x !== false) this.kids.push(x); }
  appendChild(x) { this.kids.push(x); return x; }
  setAttribute(k, v) { this.a[k] = v; }
  getAttribute(k) { return this.a[k]; }
  set innerHTML(v) { this.kids = []; }
  addEventListener() {}
  querySelector() { return null; } querySelectorAll() { return []; }
  toString() {
    const a = Object.assign({}, this.a);
    if (this.tag === 'svg') { a.xmlns = 'http://www.w3.org/2000/svg'; delete a.class; }
    const at = Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this.textContent)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
const document = { createElement: t => new El(t), createElementNS: (n, t) => new El(t), head: { append() {} } };
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const plain = a && !(a instanceof El) && typeof a === 'object' && !Array.isArray(a); const e = new El(t, plain ? a : {}); if (!plain && a != null) e.append(a); e.append(...k); return e; };
function makeSvg(w, hh) { return svgEl('svg', { viewBox: `0 0 ${w} ${hh}` }); }
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
const findSvg = e => { if (!e || typeof e !== 'object') return null; if (e.tag === 'svg') return e; for (const k of e.kids || []) { const r = findSvg(k); if (r) return r; } return null; };
const api = { provide() {}, hint() {}, done() {}, bad() {}, tryOnce() {}, fail() {} };
const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
const lesSrc = src.slice(src.indexOf('//@@LESSONS'));
eval((unitSrc + '\n' + lesSrc.slice(0, lesSrc.indexOf('const LESSONS')) + '\n' + fs.readFileSync(process.argv[5], 'utf8')).replace(/^(const|let) /gm, 'var '));
const OUT = {};
for (const [k, e] of Object.entries(JSON.parse(fs.readFileSync(process.argv[3], 'utf8')))) {
  let v; try { v = eval(e); } catch (err) { throw new Error(k + ': ' + err.message); }
  const s = findSvg(v); OUT[k] = s ? String(s) : v;
}
process.stdout.write(JSON.stringify(OUT));
"""

# 활동지에만 쓰는 그리기 도구(앱의 sy3Setup·sy3Paint·sy3DrawParts·sy3Line·sy3Dot·txt를 그대로 씀)
WS_JS = r"""
var K = 40;   // 실제 크기: 1 cm = 40 px
function wsO(o, k) { return Object.assign({}, o, { k: k || K, pad: o.pad == null ? 30 : o.pad }); }
function wsFig(o, k) { return sy3Fig(wsO(o, k)); }
/* 대응점을 찍어 완성하는 모눈(앱 sy3Complete의 바탕 그림과 같음). help면 도움선(수선·대칭의 중심을 지나는 직선) */
function wsComplete(o, help, k) {
  o = wsO(o, k);
  const { svg, m } = sy3Setup(o), box = o.box, line = o.mode !== 'point', P = o.pts;
  sy3Paint(svg, m, { box, shapes: [] });
  const X = line ? sy3Refl(o.axis[0], o.axis[1]) : sy3Rot(o.center, 180);
  if (help) o.miss.forEach(x => {
    const p = P[x.of], q = x.A ? sy3Ap(x.A, p) : sy3Ap(X, p);
    if (line) { const u = [q[0] - p[0], q[1] - p[1]], L = Math.hypot(...u); if (L < 1e-6) return; sy3Line(svg, m, p, [p[0] + u[0] / L, p[1] + u[1] / L], { color: '#9FB3C8', w: 1.8, ext: 40, dash: '4 5' }); }
    else sy3Line(svg, m, p, o.center, { color: '#9FB3C8', w: 1.8, ext: 40, dash: '4 5' });
  });
  if (line) { sy3Line(svg, m, o.axis[0], o.axis[1], { color: SY3.red, w: 2.6, dash: '10 6' }); if (o.axisNames) o.axisNames.forEach((n, i) => { if (n) { const a = m(o.axis[i]); svg.append(txt(sy3R(a[0] + 15), sy3R(a[1] + (i ? 12 : -12)), n, 18, { fill: SY3.red })); } }); }
  (o.lines2 || []).forEach(L => sy3Line(svg, m, L[0], L[1], { color: SY3.red, w: 2.6, dash: '10 6' }));
  if (!line) { sy3Dot(svg, m, o.center, { r: 6, color: SY3.red }); const a = m(o.center); svg.append(txt(sy3R(a[0] + 15), sy3R(a[1] - 15), o.cName || 'ㅇ', 18, { fill: SY3.red, 'font-weight': 'bold' })); }
  (o.drawn || []).forEach(([a, b]) => sy3Line(svg, m, P[a], P[b], { color: SY3.ink, w: 3 }));
  const v = Object.values(P), cenAll = [v.reduce((s, p) => s + p[0], 0) / v.length, v.reduce((s, p) => s + p[1], 0) / v.length];
  Object.entries(P).forEach(([n, p]) => { sy3Dot(svg, m, p, { r: 4.5 }); const a = m(p), dx = p[0] - (line ? o.axis[0][0] : cenAll[0]), dd = (o.nameDir && o.nameDir[n]) || [Math.abs(dx) < 1e-6 ? 0.7 : Math.sign(dx) * .8, -0.6]; svg.append(txt(sy3R(a[0] + dd[0] * 18), sy3R(a[1] + dd[1] * 18), n, 18)); });
  return svg;
}
function wsWant(o) {
  const line = o.mode !== 'point', X = line ? sy3Refl(o.axis[0], o.axis[1]) : sy3Rot(o.center, 180), W = {};
  o.miss.forEach(x => W[x.n] = (x.A ? sy3Ap(x.A, o.pts[x.of]) : sy3Ap(X, o.pts[x.of])).map(v => Math.round(v * 1000) / 1000));
  return W;
}
/* 도형 여러 개를 칸에 나란히(항목마다 box·parts·label, line: 주어진 접는 선, center: 돌리는 점) */
function wsItems(items, o) {
  o = o || {}; const k = o.k || 30, per = o.per || items.length, gap = 18, top = 30;
  const bw = Math.max(...items.map(it => it.box[2] - it.box[0])), bh = Math.max(...items.map(it => it.box[3] - it.box[1]));
  const cw = bw * k + 16, ch = bh * k + 16, rows = Math.ceil(items.length / per), cols = Math.min(per, items.length);
  const W = cols * cw + (cols + 1) * gap, H = rows * (ch + top + gap) + gap, svg = makeSvg(sy3R(W), sy3R(H));
  items.forEach((it, i) => {
    const r = Math.floor(i / per), c = i % per, x0 = gap + c * (cw + gap), y0 = gap + r * (ch + top + gap) + top;
    svg.append(svgEl('rect', { x: x0, y: y0, width: cw, height: ch, rx: 10, fill: '#fff', stroke: '#C9D4CF', 'stroke-width': 2 }));
    const iw = (it.box[2] - it.box[0]) * k, ih = (it.box[3] - it.box[1]) * k;
    const m = sy3Map(k, x0 + (cw - iw) / 2 - it.box[0] * k, y0 + (ch - ih) / 2 - it.box[1] * k);
    if (o.grid) svg.append(sy3GridG(Math.ceil(it.box[0]), Math.ceil(it.box[1]), Math.floor(it.box[2]), Math.floor(it.box[3]), m));
    sy3DrawParts(svg, it.parts, m, { w: 2.4 });
    if (o.lines && it.line) sy3Line(svg, m, it.line[0], it.line[1], { color: SY3.red, w: 2.6, dash: '9 6' });
    if (o.center && it.center) { sy3Dot(svg, m, it.center, { r: 5, color: SY3.red }); const a = m(it.center); svg.append(txt(sy3R(a[0] + 14), sy3R(a[1] - 14), o.cName || 'ㅇ', 18, { fill: SY3.red, 'font-weight': 'bold' })); }
    svg.append(txt(x0 + cw / 2, y0 - 15, it.name || it.label, 19, { 'font-weight': 'bold' }));
  });
  return svg;
}
/* 카드(앱 sy3CardSvg와 같은 모양) 여러 장 */
function wsCards(cards, per) {
  per = per || cards.length; const cw = 100, chh = 120, gap = 14, top = 26, rows = Math.ceil(cards.length / per), cols = Math.min(per, cards.length);
  const W = cols * cw + (cols + 1) * gap, H = rows * (chh + top + gap) + gap, svg = makeSvg(W, H);
  cards.forEach((c, i) => {
    const x0 = gap + (i % per) * (cw + gap), y0 = gap + Math.floor(i / per) * (chh + top + gap) + top;
    svg.append(svgEl('rect', { x: x0 + 4, y: y0 + 4, width: 92, height: 112, rx: 12, fill: '#fff', stroke: '#C9D4CF', 'stroke-width': 3 }));
    const bb = sy3BBox(c.parts), bw = bb[2] - bb[0], bh = bb[3] - bb[1], kk = Math.min(72 / bw, 86 / bh), m = sy3Map(kk, x0 + 50 - (bb[0] + bw / 2) * kk, y0 + 60 - (bb[1] + bh / 2) * kk);
    sy3DrawParts(svg, c.parts, m, { w: 2 });
    svg.append(txt(x0 + cw / 2, y0 - 10, c.label, 18, { 'font-weight': 'bold' }));
  });
  return svg;
}
/* 1차시 데칼코마니 종이(접는 선 왼쪽에 물감) */
function wsDecal(cells, cols, rows) {
  const box = [0, 0, cols, rows], { svg, m } = sy3Setup({ box, k: K, pad: 30 });
  sy3Paint(svg, m, { box, shapes: [] });
  cells.forEach(([x, y, c]) => { const a = m([x, y]); svg.append(svgEl('rect', { x: sy3R(a[0] + 2), y: sy3R(a[1] + 2), width: K - 4, height: K - 4, rx: 9, fill: c })); });
  sy3Line(svg, m, [cols / 2, 0], [cols / 2, rows], { color: SY3.red, w: 3, dash: '10 6' });
  svg.append(txt(m([cols / 2, 0])[0], 14, '접는 선', 15, { fill: SY3.red }));
  return svg;
}
/* 10차시 자연물 그림(앱 SY3_PICS의 그림 함수) */
function wsPics(k) {
  return wsItems(SY3_PICS.map(p => ({ box: p.box, parts: p.parts, label: p.label })), { k: k || 22 });
}
/* 10차시: 대칭축과 반쪽 선분이 있는 그리기 모눈 */
function wsMirror(cols, rows, axis, segs, k) {
  const box = [0, 0, cols, rows], { svg, m } = sy3Setup({ box, k: k || K, pad: 30 });
  sy3Paint(svg, m, { box, shapes: [] });
  for (let x = 0; x <= cols; x++) for (let y = 0; y <= rows; y++) sy3Dot(svg, m, [x, y], { r: 2.2, color: '#8A9BAA' });
  if (axis) sy3Line(svg, m, axis[0], axis[1], { color: SY3.red, w: 2.6, dash: '10 6' });
  (segs || []).forEach(s => sy3Line(svg, m, s[0], s[1], { color: SY3.blue, w: 3.4 }));
  return svg;
}
var SY3_SYM_IS = (parts) => sy3Kind(parts, true);
"""


def extract(src, jobs):
    jf = os.path.join(WORK, 'jobs.json')
    with open(jf, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False)
    js, pre = os.path.join(WORK, 'ex.js'), os.path.join(WORK, 'pre.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(_EX)
    with open(pre, 'w', encoding='utf-8') as f:
        f.write(WS_JS + WS_LESSON_JS)
    r = subprocess.run(['node', js, src, jf, FONT, pre], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-3000:])
    return json.loads(r.stdout)

# 앱 LESSONS 안에 바로 적힌 도형(좌표를 그대로 옮김 — 원본 줄 번호는 u3-symm.tb.js 기준)
WS_LESSON_JS = r"""
/* 1차시 떠올리기 ⑵(1680~1686) */
var L1_PERP = { box: [0, 0, 12, 6], grid: true,
  lines: [{ p: [0, 4], q: [12, 4], color: SY3.ink, w: 3 }, { p: [3, 0], q: [3, 6], color: SY3.blue, w: 3 }, { p: [6, 6], q: [9, 0], color: SY3.green, w: 3 }, { p: [0, 1], q: [12, 1], color: SY3.purple, w: 3 }],
  texts: [{ p: [11.3, 3.5], t: "가" }, { p: [3.5, .4], t: "나", color: SY3.blue }, { p: [9.2, .5], t: "다", color: SY3.green }, { p: [11.3, .5], t: "라", color: SY3.purple }] };
var L1_DIAG = { box: [0, 0, 7, 5], grid: false, shapes: [{ P: [[1, 1], [5, .6], [6, 4], [.6, 4.4]], fill: SY3.f4 }] };
/* 1차시 도전(1694~1697) */
var L1_BLOCKS = [{ label: "가", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 0, 1, 1.4), fill: SY3.f4 }, { label: "나", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 1, 6, 1.4), fill: SY3.f4 },
  { label: "다", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 2, 10, 1.4), fill: SY3.f4 }, { label: "라", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 4, 14, 1.4), fill: SY3.f4 },
  { label: "마", P: sy3Put([[0, 0], [2, 0], [2, 1], [4, 1], [4, 2], [0, 2]], 0, 2, 5.6), fill: SY3.f4 }, { label: "바", P: sy3Put([[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], 3, 9, 5.6), fill: SY3.f4 }];
/* 2차시 도전(1733~1738) */
var L2_TILES = [{ label: "가", P: sy3Put([[0, 0], [3, 0], [3, 1], [4, 1], [4, 2], [0, 2]], 0, 6, 1.4), fill: SY3.f1 }, { label: "나", P: sy3Put([[0, 0], [1, 0], [1, 1], [3, 1], [3, 2], [0, 2]], 0, 11, 1.4), fill: SY3.f1 }, { label: "다", P: sy3Put(SY3_TILE, 1, 15, 1.4), fill: SY3.f1 }];
var L2_BROKEN = sy3Put(SY3_TILE, 0, 1, 1.4);
var L2_CUT = [{ label: "가", P: [[1, 1], [4, 1], [4, 5]], labelAt: [3, 2.2] }, { label: "라", P: [[1, 1], [4, 5], [1, 5]], labelAt: [2, 3.8] }, { label: "나", P: [[4, 1], [7, 1], [7, 3], [4, 3]], labelAt: [5.5, 2] }, { label: "다", P: [[4, 3], [7, 3], [7, 5], [4, 5]], labelAt: [5.5, 4] }].map(s => Object.assign(s, { fill: SY3.f3 }));
/* 3차시 */
var L3_T12 = { box: [0, 0, 15, 5.4], grid: false, shapes: [{ P: SY3_T1, names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2 }, { P: SY3_T2, names: ["ㄹ", "ㅁ", "ㅂ"], fill: SY3.f1 }] };
var L3_TZ = { box: [0, 0, 11.4, 6], grid: true, shapes: [{ P: SY3_TZ1, names: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], fill: SY3.f2 }, { P: SY3_TZ2, names: ["ㅇ", "ㅅ", "ㅂ", "ㅁ"], fill: SY3.f1 }] };
var L3_PZA = (() => { const T = sy3Sh(SY3_PZT, 10, 1.5), H = SY3_PZH; return [0, 1, -1, 0, H[0][0] - (-T[0][1]), H[0][1] - T[0][0]]; })();
var L3_FLIP = { box: [0, 0, 14, 5.2], grid: false, shapes: [{ P: SY3_FLIPT.a, names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2 }, { P: SY3_FLIPT.b, names: ["ㄹ", "ㅁ", "ㅂ"], fill: SY3.f1 }] };
function L3_Q30() { const A = sy3Sh(SY3_Q30, .8, .8), B = sy3Sh(SY3_Q30, 13, .8), cA = sy3Cen([sy3P(A)]), cB = sy3Cen([sy3P(B)]); return { box: [0, 0, 24.4, 8.8], grid: false, shapes: [{ P: A, names: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], fill: SY3.f2 }, { P: B, names: ["ㅁ", "ㅂ", "ㅅ", "ㅇ"], fill: SY3.f1 }], labs: [{ a: A[1], b: A[2], t: "5 cm", c: cA }, { a: B[2], b: B[3], t: "7 cm", c: cB }, { a: B[3], b: B[0], t: "8 cm", c: cB }] }; }
function L3_T40() { const A = SY3_T40, B = sy3Sh(SY3_T40, 7, 0); return { box: [0, 0, 13, 5], grid: false, shapes: [{ P: A, names: ["ㄱ", "ㄴ", "ㄷ"], fill: SY3.f2 }, { P: B, names: ["ㄹ", "ㅁ", "ㅂ"], fill: SY3.f1 }], arcs: [{ V: A[0], A: A[1], B: A[2], t: "65°", r: 18 }, { V: B[2], A: B[0], B: B[1], t: "75°", r: 18 }] }; }
/* 4차시 확인하기(1815~1818) */
var L4_PICK = [{ label: "가", P: sy3Sh([[2, 0], [4, 2], [2, 5], [0, 2]], 1, 1.4), fill: SY3.f1 }, { label: "나", P: sy3Sh([[2, 0], [4, 2], [4, 4], [0, 4], [0, 2]], 6, 1.9), fill: SY3.f2 },
  { label: "다", P: sy3Sh([[1, 0], [4, 0], [3, 3], [0, 3]], 11, 2.4), fill: SY3.f3 }, { label: "라", P: sy3Sh([[0, 0], [5, 0], [5, 1], [3, 1], [3, 4], [2, 4], [2, 1], [0, 1]], 16, 1.9), fill: SY3.f4 },
  { label: "마", parts: [sy3Cells2(["##.", ".#.", ".##"], 21.4, 2.4, { fill: SY3.f5 })] }, { label: "바", parts: [sy3C([26.3, 3.9], 1.4, { fill: SY3.f6 })], labelAt: [26.3, 2.05] }];
var L4_PICK_PARTS = L4_PICK.map(S => S.parts || [sy3P(S.P)]);
/* 5~6차시 */
var L56_GRID = (() => { const N = SY3_GRIDHL; return { box: [0, 0, 12, 8], grid: true,
  shapes: [{ P: [N["ㄱ"], N["ㄴ"], N["ㄷ"], N["ㄹ"], N["ㅁ"], N["ㅂ"]], names: SY3_N6, fill: SY3.f3 }],
  lines: [{ p: [6, 0], q: [6, 8], color: SY3.red, dash: "9 6", w: 2.4 }, { p: N["ㄴ"], q: N["ㅂ"], color: SY3.blue, dash: "6 5", w: 2 }, { p: N["ㄷ"], q: N["ㅁ"], color: SY3.blue, dash: "6 5", w: 2 }],
  dots: [{ p: [6, 3], n: "ㅈ", d: [.75, -.75], tcolor: SY3.blue, r: 4 }, { p: [6, 6], n: "ㅊ", d: [.75, -.75], tcolor: SY3.blue, r: 4 }], texts: [{ p: [6.45, .3], t: "ㅅ", color: SY3.red }, { p: [6.45, 7.7], t: "ㅇ", color: SY3.red }] }; })();
var C56A = { box: [0, 0, 10, 9], mode: "line", axis: [[5, 0], [5, 9]], axisNames: ["ㅁ", "ㅂ"],
  pts: { "ㄱ": [5, 1], "ㄴ": [1, 3], "ㄷ": [2, 7], "ㄹ": [5, 8] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅅ", of: "ㄴ" }, { n: "ㅇ", of: "ㄷ" }],
  poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅇ", "ㅅ"], nameDir: { "ㄱ": [-.8, -.6], "ㄹ": [-.8, .7] } };
var C56B = { box: [0, 0, 10, 8], mode: "line", axis: [[0, 4], [10, 4]],
  pts: { "ㄱ": [1, 4], "ㄴ": [2, 1], "ㄷ": [5, 2], "ㄹ": [7, 0], "ㅁ": [9, 4] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"], ["ㄹ", "ㅁ"]], miss: [{ n: "ㅂ", of: "ㄹ" }, { n: "ㅅ", of: "ㄷ" }, { n: "ㅇ", of: "ㄴ" }],
  poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"], nameDir: { "ㄱ": [-.8, -.6], "ㅁ": [.8, -.6], "ㄴ": [-.6, -.7], "ㄷ": [.2, -.9], "ㄹ": [.8, -.4] } };
var C56C = { box: [0, 0, 8, 8], mode: "line", axis: [[0, 0], [8, 8]],
  pts: { "ㄱ": [2, 2], "ㄴ": [5, 1], "ㄷ": [7, 3], "ㄹ": [7, 7] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅁ", of: "ㄷ" }, { n: "ㅂ", of: "ㄴ" }],
  poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"], nameDir: { "ㄱ": [-.8, .5], "ㄹ": [.6, .7] } };
var L56_HALF0 = [[0, 0], [4.8, 3.6], [7.2, 3.6 + Math.sqrt(121 - 5.76)], [0, 3.6 + Math.sqrt(121 - 5.76) + Math.sqrt(81 - 51.84)]];
function L56_HALF() { const P = L56_HALF0.map(p => [sy3R(p[0] * .3 + 1), sy3R(p[1] * .3 + .6)]);
  return { box: [0, 0, 4.4, 7.3], grid: false, shapes: [{ P, fill: SY3.f3 }], lines: [{ p: [1, .2], q: [1, 7.1], color: SY3.red, dash: "8 5", w: 2.2 }],
    texts: [{ p: [.65, .3], t: "ㄱ", color: SY3.red }, { p: [.65, 7.05], t: "ㄴ", color: SY3.red }],
    labs: [{ a: P[0], b: P[1], t: "6 cm", c: [1, 3] }, { a: P[1], b: P[2], t: "11 cm", c: [1, 3] }, { a: P[2], b: P[3], t: "9 cm", c: [1, 3] }] }; }
/* 7차시 */
var L7_R = [{ label: "ㄹ", name: "글자 ㄹ", parts: [sy3Cells2(SY3_GLY["ㄹ"], 1, 1, { fill: "#C9A8EE", stroke: "#5E3496" })], box: [0, 0, 7, 7], center: [3.5, 3.5] }];
var L7_SPIN3 = [
  { label: "가", parts: [sy3P([[3, 1], [7, 1], [5, 5], [1, 5]], { fill: SY3.f1 })], box: [0, 0, 8, 6], center: [4, 3] },
  { label: "나", parts: [sy3Cells2(["###..", "..#..", "..###"], 1, 2, { fill: SY3.f2 })], box: [0, 0, 7, 7], center: [3.5, 3.5] },
  { label: "다", parts: [sy3P([[1, 2], [4, 1], [6, 2], [6, 4], [3, 5], [1, 4]], { fill: SY3.f3 })], box: [0, 0, 7, 6], center: [3.5, 3] }];
var L7_SPIN5 = [
  { label: "가", parts: [sy3P([[2, 1], [6, 1], [5, 4], [1, 4]], { fill: SY3.f1 })], box: [0, 0, 7, 5] },
  { label: "나", parts: [sy3P([[3, 1], [6, 5], [0, 5]], { fill: SY3.f2 })], box: [-.5, 0, 6.5, 6] },
  { label: "다", parts: [sy3P([[3, 1], [5, 3], [3, 6], [1, 3]], { fill: SY3.f3 })], box: [0, 0, 6, 7] },
  { label: "라", parts: [sy3P([[1, 1], [6, 1], [6, 4], [1, 4]], { fill: SY3.f4 })], box: [0, 0, 7, 5] },
  { label: "마", parts: [sy3Cells2(["##..", ".##.", "..##"], 1, 1, { fill: SY3.f5 })], box: [0, 0, 6, 5] }];
var L7_KEYS = ["ㄹ", "ㅁ", "ㅍ", "S", "ㄷ", "ㅗ", "ㄱ"];
function L7_GLYPHS() { let x = .8; const shapes = L7_KEYS.map(k => { const C = sy3Grid(SY3_GLY[k]), w = Math.max(...C.map(c => c[0])) + 1, s = { label: k, parts: [sy3Cells(C.map(c => [c[0] + x, c[1] + 1.6]), { fill: "#F3E3C0", stroke: "#8A6248" })] }; x += w + 1.4; return s; });
  return { box: [0, 0, x - .6, 8.2], grid: false, shapes }; }
/* 8~9차시 */
function L89_FIG() { const L = SY3_P89L, R = SY3_P89R, cL = sy3Cen([sy3P(L)]), cR = sy3Cen([sy3P(R)]);
  return { box: [0, 0, 12.6, 5.6], grid: false, shapes: [{ P: L, names: SY3_N6, fill: SY3.f5 }, { P: R, names: SY3_N6, fill: SY3.f1 }],
    segs: [{ p: R[1], q: R[4], color: SY3.blue, dash: "6 5", w: 2 }, { p: R[2], q: R[5], color: SY3.blue, dash: "6 5", w: 2 }],
    dots: [{ p: cL, n: "ㅇ", d: [.8, -.6], color: SY3.red, tcolor: SY3.red, r: 4 }, { p: cR, n: "ㅇ", d: [.9, .5], color: SY3.red, tcolor: SY3.red, r: 4 }],
    labs: [{ a: L[0], b: L[1], t: "14 cm", c: cL }, { a: L[1], b: L[2], t: "8 cm", c: cL }, { a: L[3], b: L[4], t: "□ cm", c: cL, color: SY3.blue }, { a: R[2], b: cR, t: "10 cm", d: 13, size: 15 }],
    arcs: [{ V: L[0], A: L[5], B: L[1], t: "100°", r: 18 }, { V: L[3], A: L[2], B: L[4], t: "□°", r: 18, color: SY3.blue }] }; }
var C89A = { box: [0, 0, 10, 8], mode: "point", center: [5, 4], cName: "ㅇ",
  pts: { "ㄱ": [2, 2], "ㄴ": [1, 5], "ㄷ": [4, 7], "ㄹ": [8, 6] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅁ", of: "ㄴ" }, { n: "ㅂ", of: "ㄷ" }],
  poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"], nameDir: { "ㄱ": [-.6, -.8], "ㄴ": [-.9, 0], "ㄷ": [-.4, .9], "ㄹ": [.8, .7] } };
var C89B = { box: [0, 0, 10, 8], mode: "point", center: [5, 4], cName: "ㅈ",
  pts: { "ㄱ": [1, 4], "ㄴ": [2, 1], "ㄷ": [4, 2], "ㄹ": [6, 0], "ㅁ": [9, 4] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"], ["ㄹ", "ㅁ"]], miss: [{ n: "ㅂ", of: "ㄴ" }, { n: "ㅅ", of: "ㄷ" }, { n: "ㅇ", of: "ㄹ" }],
  poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅇ"], nameDir: { "ㄱ": [-.8, -.6], "ㄴ": [-.7, -.6], "ㄷ": [-.2, .9], "ㄹ": [.8, .5], "ㅁ": [.8, -.6] } };
function L89_P115() { const P = SY3_P115, c = sy3Cen([sy3P(P)]); return { box: [0, 0, 7, 6], grid: false, shapes: [{ P, names: SY3_N6, fill: SY3.f5 }], dots: [{ p: c, n: "ㅇ", d: [.8, -.6], color: SY3.red, tcolor: SY3.red, r: 4 }], labs: [{ a: P[3], b: P[4], t: "8 cm", c }], arcs: [{ V: P[2], A: P[1], B: P[3], t: "115°", r: 18 }] }; }
function L89_OCT() { const P = SY3_OCT, c = sy3Cen([sy3P(P)]); return { box: [0, 0, 7.7, 7], grid: false, shapes: [{ P, names: SY3_N8, fill: SY3.f3 }], dots: [{ p: c, n: "ㅈ", d: [.8, -.6], color: SY3.red, tcolor: SY3.red, r: 4 }], labs: [{ a: P[0], b: P[1], t: "7 cm", c }, { a: P[5], b: P[6], t: "11 cm", c }, { a: P[2], b: P[3], t: "5 cm", c }] }; }
var L89_PENTO = Object.entries(SY3_PENTO).map(([k, r]) => ({ label: k, parts: [sy3Cells(sy3Grid(r), { fill: "#F3E3C0", stroke: "#8A6248" })] }));
/* 10차시 */
var L10_GUIDE = [[[6, 1], [3, 3]], [[3, 3], [2, 6]], [[2, 6], [6, 9]]];
var C10 = { box: [0, 0, 12, 10], mode: "line", axis: [[6, 0], [6, 10]],
  pts: { "ㄱ": [6, 0], "ㄴ": [4, 2], "ㄷ": [1, 2], "ㄹ": [3, 5], "ㅁ": [1, 8], "ㅂ": [5, 7], "ㅅ": [6, 10] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"], ["ㄹ", "ㅁ"], ["ㅁ", "ㅂ"], ["ㅂ", "ㅅ"]],
  miss: [{ n: "ㅇ", of: "ㄴ" }, { n: "ㅈ", of: "ㄷ" }, { n: "ㅊ", of: "ㄹ" }, { n: "ㅋ", of: "ㅁ" }, { n: "ㅌ", of: "ㅂ" }],
  poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ", "ㅅ", "ㅌ", "ㅋ", "ㅊ", "ㅈ", "ㅇ"], nameDir: { "ㄱ": [-.8, .6], "ㅅ": [-.8, -.4], "ㄴ": [.2, -.9], "ㄷ": [-.8, -.5], "ㄹ": [.8, .2], "ㅁ": [-.8, .4], "ㅂ": [-.6, .8] } };
/* 11차시 */
var L11_CARDS = [
  { label: "①", parts: [Object.assign({}, SY3_SHAPES.L[1], { fill: SY3_FILLK.L })] }, { label: "②", parts: [Object.assign({}, SY3_SHAPES.P[0], { fill: SY3_FILLK.P })] },
  { label: "③", parts: [Object.assign({}, SY3_SHAPES.B[4], { fill: SY3_FILLK.B })] }, { label: "④", parts: [Object.assign({}, SY3_SHAPES.N[0], { fill: SY3_FILLK.N })] },
  { label: "⑤", parts: [Object.assign({}, SY3_SHAPES.P[2], { fill: SY3_FILLK.P })] }, { label: "⑥", parts: [Object.assign({}, SY3_SHAPES.L[5], { fill: SY3_FILLK.L })] },
  { label: "⑦", parts: [Object.assign({}, SY3_SHAPES.N[1], { fill: SY3_FILLK.N })] }, { label: "⑧", parts: [Object.assign({}, SY3_SHAPES.B[1], { fill: SY3_FILLK.B })] }];
var L11_RULE = [{ parts: [sy3P([[0, 0], [5, 0], [5, 3], [0, 3]], { fill: SY3_FILLK.B })], label: "보이는 카드", hl: true }, { parts: [sy3P([[1, 0], [4, 0], [3, 2], [0, 2]], { fill: SY3_FILLK.P })], label: "내 카드" }];
var L11_PLAY = [{ parts: [sy3P([[2, 0], [4, 4], [0, 4]], { fill: SY3_FILLK.L })], label: "보이는 카드", hl: true }, { parts: [sy3C([2, 2], 2, { fill: SY3_FILLK.B })], label: "가" }, { parts: [sy3P([[1, 0], [4, 0], [3, 2], [0, 2]], { fill: SY3_FILLK.P })], label: "나" }, { parts: [SY3_SHAPES.L[4]], label: "다" }];
var L11_ORDER = [5, 0, 9, 2, 11, 6, 1, 8, 4, 10, 3, 7];   // 기억 놀이 카드를 섞어 놓는 차례(활동지에서 정함)
var L11_MEM = L11_ORDER.map((j, i) => ({ label: String(i + 1), parts: [Object.assign({}, SY3_MEM[j].parts[0], { fill: "#EAF1F8" })], kind: SY3_MEM[j].kind }));
/* 12차시 */
var L12_PICK = [{ label: "가", P: sy3Put([[0, 0], [3, 0], [3, 2], [1, 3], [0, 2]], 0, 1, 1.5), fill: SY3.f2 }, { label: "나", P: sy3Put([[0, 0], [4, 0], [4, 3], [1, 4], [0, 3]], 0, 5.5, 1.5), fill: SY3.f1 },
  { label: "다", P: sy3Put([[0, 0], [3, 0], [3, 2], [1, 3], [0, 2]], 1, 11, 1.5), fill: SY3.f1 }, { label: "라", P: sy3Put([[0, 0], [3, 0], [3, 3], [1, 3], [0, 2]], 0, 15.5, 1.5), fill: SY3.f1 }];
var L12_QUAD = { box: [0, 0, 15, 5], grid: false, shapes: [{ P: [[1, 1], [1, 4], [5, 4], [4, 1]], names: ["ㄱ", "ㄴ", "ㄷ", "ㄹ"], fill: SY3.f2 }, { P: [[10, 1], [11, 4], [14, 4], [14, 1]], names: ["ㅁ", "ㅂ", "ㅅ", "ㅇ"], fill: SY3.f1 }] };
var L12_AX = [
  { label: "가", parts: [sy3P([[2, 1], [5, 1], [7, 5], [0, 5]], { fill: SY3.f1 })], box: [-.5, 0, 7.5, 6] },
  { label: "나", parts: [sy3P([[1, 1], [7, 1], [7, 5], [1, 5]], { fill: SY3.f2 })], box: [0, 0, 8, 6] },
  { label: "다", parts: [sy3P(SY3_HEXR, { fill: SY3.f3 })], box: [0, 0, 8, 7] }];
var C12A = { box: [0, 0, 10, 7], mode: "line", axis: [[5, 0], [5, 7]],
  pts: { "ㄱ": [5, 1], "ㄴ": [2, 2], "ㄷ": [3, 5], "ㄹ": [5, 6] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅁ", of: "ㄷ" }, { n: "ㅂ", of: "ㄴ" }],
  poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"], nameDir: { "ㄱ": [-.8, -.6], "ㄹ": [-.8, .6] } };
var C12B = { box: [0, 0, 8, 6], mode: "point", center: [4, 3], cName: "ㅇ",
  pts: { "ㄱ": [1, 3], "ㄴ": [2, 0], "ㄷ": [5, 1], "ㄹ": [7, 3] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]], miss: [{ n: "ㅁ", of: "ㄴ" }, { n: "ㅂ", of: "ㄷ" }],
  poly: ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"], nameDir: { "ㄱ": [-.8, -.4], "ㄴ": [-.7, -.5], "ㄷ": [.6, -.7], "ㄹ": [.8, -.4] } };
var RX = sy3Refl([5, 0], [5, 10]), RY = sy3Refl([0, 5], [10, 5]), RO = sy3Rot([5, 5], 180);
var C12D = { box: [0, 0, 10, 10], mode: "line", axis: [[5, 0], [5, 10]], lines2: [[[0, 5], [10, 5]]],
  pts: { "ㄱ": [5, 1], "ㄴ": [3, 2], "ㄷ": [2, 4], "ㄹ": [1, 5] }, drawn: [["ㄱ", "ㄴ"], ["ㄴ", "ㄷ"], ["ㄷ", "ㄹ"]],
  miss: [{ n: "ㅁ", of: "ㄴ", A: RX }, { n: "ㅂ", of: "ㄷ", A: RX }, { n: "ㅅ", of: "ㄹ", A: RX }, { n: "ㅇ", of: "ㄷ", A: RO }, { n: "ㅈ", of: "ㄴ", A: RO }, { n: "ㅊ", of: "ㄱ", A: RY }, { n: "ㅋ", of: "ㄴ", A: RY }, { n: "ㅌ", of: "ㄷ", A: RY }],
  poly: ["ㄱ", "ㅁ", "ㅂ", "ㅅ", "ㅇ", "ㅈ", "ㅊ", "ㅋ", "ㅌ", "ㄹ", "ㄷ", "ㄴ"], nameDir: { "ㄱ": [-.8, -.6], "ㄹ": [-.6, -.8], "ㄴ": [-.6, -.7], "ㄷ": [-.8, -.4] } };
function L12_HEX30() { const P = SY3_HEX30, c = sy3Cen([sy3P(P)]); return { box: [0, 0, 5.4, 6], grid: false, shapes: [{ P, names: SY3_N6, fill: SY3.f1 }], dots: [{ p: c, n: "ㅇ", d: [.8, -.6], color: SY3.red, tcolor: SY3.red, r: 4 }], labs: [{ a: P[0], b: P[1], t: "3 cm", c }, { a: P[4], b: P[5], t: "5 cm", c }, { a: P[2], b: P[3], t: "7 cm", c }] }; }
var L12_SUM2B = SY3_T1.map(p => [sy3R(-p[0] + 15), sy3R(-p[1] + 5)]);
function L12_SUM2() { const A = SY3_T1, B = L12_SUM2B; return { box: [0, 0, 15, 5], grid: false, shapes: [{ P: A, fill: SY3.f2 }, { P: B, fill: SY3.f1 }], labs: [{ a: A[1], b: A[2], t: "6 cm", c: sy3Cen([sy3P(A)]) }, { a: B[1], b: B[2], t: "□ cm", c: sy3Cen([sy3P(B)]), color: SY3.blue }] }; }
function L12_DART() { const P = SY3_DART; return { box: [0, 0, 6, 5.4], grid: false, shapes: [{ P, fill: SY3.f3 }], lines: [{ p: [3, .1], q: [3, 5.3], color: SY3.red, dash: "8 5", w: 2 }], arcs: [{ V: P[0], A: [3, 3], B: P[1], t: "25°", r: 30, tr: 16, size: 14 }, { V: P[0], A: P[5], B: [3, 3], t: "25°", r: 30, tr: 16, size: 14 }, { V: P[5], A: P[0], B: P[4], t: "60°", r: 16 }, { V: P[1], A: P[2], B: P[0], t: "□°", r: 16, color: SY3.blue }] }; }
var L12_SUM6P = { O: [5, 2.4], A: [1, 2.4], C: [9, 2.4], B: [6.2, .8], D: [3.8, 4] };
function L12_SUM6() { const { O, A, C, B, D } = L12_SUM6P; return { box: [0, 0, 10, 4.8], grid: false, shapes: [{ P: [A, B, C, D], fill: SY3.f5 }], segs: [{ p: A, q: C, color: SY3.blue, dash: "6 5", w: 2 }, { p: B, q: D, color: SY3.blue, dash: "6 5", w: 2 }], dots: [{ p: O, color: SY3.red, r: 4 }], labs: [{ a: A, b: O, t: "4 cm", d: 12, size: 15 }, { a: O, b: C, t: "4 cm", d: 12, size: 15 }, { a: O, b: B, t: "2 cm", d: 14, size: 15 }, { a: D, b: O, t: "□ cm", d: 18, size: 15, color: SY3.blue }] }; }
/* 1차시 데칼코마니(활동지에서 정한 물감 자리 — 접는 선 왼쪽 5칸 안) */
var DECAL = [[1, 1, "#E5533D"], [2, 1, "#E5533D"], [3, 2, "#F2B33D"], [4, 2, "#F2B33D"], [2, 3, "#3D8FE5"], [0, 4, "#5DAA4E"], [1, 4, "#5DAA4E"], [4, 4, "#9A5BD6"]];
"""

# 그림(SVG) — 이름: JS 식
FIGS = {
    # 1차시
    'museum': '(() => { const b = new El("div"); sy3Museum(b, api, { spots: SY3_SPOTS }); return b; })()',
    'decal': 'wsDecal(DECAL, 10, 6)',
    'f_flip': 'sy3RowFig([{ parts: [SY3_F], label: "보기", hl: true }, { parts: sy3D4([SY3_F], 5), label: "가" }, { parts: sy3D4([SY3_F], 4), label: "나" }, { parts: sy3D4([SY3_F], 1), label: "다" }])',
    'f_rot': 'sy3RowFig([{ parts: [SY3_F], label: "보기", hl: true }, { parts: sy3D4([SY3_F], 3), label: "가" }, { parts: sy3D4([SY3_F], 2), label: "나" }, { parts: sy3D4([SY3_F], 1), label: "다" }])',
    'perp': 'wsFig(L1_PERP, 30)',
    'diag': 'wsFig(L1_DIAG, 30)',
    'blocks': 'wsFig({ box: [0, 0, 18, 9], grid: true, shapes: L1_BLOCKS }, 30)',
    # 2차시
    'arrows': 'wsFig({ box: [0, 0, 23, 12], grid: true, shapes: Object.entries(SY3_ARW).map(([l, P]) => ({ label: l, P, fill: l === "가" ? SY3.f2 : SY3.f1, labelAt: sy3Cen([sy3P(P)]) })) }, 30)',
    'ten': 'wsFig({ box: [0, 0, 26, 10], grid: true, shapes: SY3_TEN.map(t => ({ label: t.label, parts: t.parts || [sy3P(t.P, { fill: SY3.f1 })] })) }, 28)',
    'tiles': 'wsFig({ box: [0, 0, 18, 4.4], grid: true, shapes: L2_TILES, after: (g, m) => { sy3DrawPart(g, sy3P(L2_BROKEN), m, { fill: "#fff", stroke: SY3.red, dash: "7 5" }); g.append(txt(m([2.5, 0.8])[0], m([2.5, 0.8])[1], "깨진 곳", 16, { fill: SY3.red })); } }, 30)',
    'cut': 'wsFig({ box: [0, 0, 8, 6], grid: true, shapes: L2_CUT, segs: [{ p: [1, 1], q: [4, 5], color: SY3.ink, w: 2.4, dash: "6 5" }] }, 40)',
    # 3차시
    't12': 'wsFig(L3_T12, 34)',
    'tz': 'wsFig(L3_TZ)',
    'quad3': 'wsFig(sy3FigQuad3(), 34)',
    'puzzle': 'wsFig(sy3FigPuzzle(true), 34)',
    'flipt': 'wsFig(L3_FLIP, 30)',
    'q30': 'wsFig(L3_Q30(), 17)',
    't40': 'wsFig(L3_T40(), 28)',
    # 4차시
    'win': 'wsItems(SY3_WIN.map(w => Object.assign({}, w)), { k: 18, lines: true })',
    'sym6': 'wsItems(SY3_SYM6, { k: 30, per: 3, grid: true })',
    'hl': 'wsFig(sy3FigHL())',
    'pick4': 'wsFig({ box: [0, 0, 28.2, 7.4], grid: true, shapes: L4_PICK }, 26)',
    'ax4': 'wsItems(SY3_AX4, { k: 30, grid: true })',
    # 5~6차시
    'gridhl': 'wsFig(L56_GRID)',
    'kites': 'wsFig(sy3FigKites(), 34)',
    'c56a1': 'wsComplete(C56A, true)', 'c56a0': 'wsComplete(C56A, false)',
    'c56b1': 'wsComplete(C56B, true)', 'c56b0': 'wsComplete(C56B, false)',
    'c56c0': 'wsComplete(C56C, false)',
    'half': 'wsFig(L56_HALF(), 46)',
    # 7차시
    'glyph_r': 'wsItems(L7_R, { k: 30, center: true })',
    'spin3': 'wsItems(L7_SPIN3, { k: 30, center: true })',
    'spin5': 'wsItems(L7_SPIN5, { k: 30, per: 5 })',
    'hp_c': 'wsFig(sy3FigHP({ dots: [{ p: SY3_HPC, n: "ㅇ", d: [.8, -.8], color: SY3.red, tcolor: SY3.red, r: 4.5 }] }))',
    'glyphs': 'wsFig(L7_GLYPHS(), 16)',
    # 8~9차시
    'hp': 'wsFig(sy3FigHP())',
    'p89': 'wsFig(L89_FIG(), 46)',
    'c89a1': 'wsComplete(C89A, true)', 'c89a0': 'wsComplete(C89A, false)',
    'c89b1': 'wsComplete(C89B, true)', 'c89b0': 'wsComplete(C89B, false)',
    'p115': 'wsFig(L89_P115(), 44)',
    'oct': 'wsFig(L89_OCT(), 40)',
    'pento': 'wsCards(L89_PENTO, 6)',
    # 10차시
    'mirror': 'wsMirror(12, 10, [[6, 0], [6, 10]], L10_GUIDE)',
    'pics': 'wsPics(24)',
    'blank': 'wsMirror(14, 10, [[7, 0], [7, 10]], [], 34)',
    'c10': 'wsComplete(C10, false)',
    # 11차시
    'cards8': 'wsCards(L11_CARDS, 4)',
    'rule': 'sy3RowFig(L11_RULE)',
    'play': 'sy3RowFig(L11_PLAY)',
    'mem': 'wsCards(L11_MEM, 6)',
    # 12차시
    'pick12': 'wsFig({ box: [0, 0, 20, 6], grid: true, shapes: L12_PICK }, 30)',
    'quad12': 'wsFig(L12_QUAD, 32)',
    'ax12': 'wsItems(L12_AX, { k: 26, grid: true })',
    'c12a1': 'wsComplete(C12A, true)', 'c12a0': 'wsComplete(C12A, false)',
    'c12b1': 'wsComplete(C12B, true)', 'c12b0': 'wsComplete(C12B, false)',
    'c12d0': 'wsComplete(C12D, false)',
    'hex30': 'wsFig(L12_HEX30(), 46)',
    'signs': 'wsCards(SY3_SIGNS, 5)',
    'sum2': 'wsFig(L12_SUM2(), 26)',
    'dart': 'wsFig(L12_DART(), 40)',
    'sum6': 'wsFig(L12_SUM6(), 34)',
}

# 정답 계산에 쓰는 자료(앱의 좌표·판정 함수 결과)
DATA = {
    'pt': '({ HL: SY3_HL, HP: SY3_HP, HPC: SY3_HPC, TZ1: SY3_TZ1, TZ2: SY3_TZ2, Q3L: sy3FigQuad3().shapes[0].P, Q3R: sy3FigQuad3().shapes[1].P,'
          ' PZT: sy3Sh(SY3_PZT, 10, 1.5), PZH: SY3_PZH, PZA: L3_PZA, T1: SY3_T1, T2: SY3_T2, FLA: SY3_FLIPT.a, FLB: SY3_FLIPT.b, Q30: SY3_Q30, T40: SY3_T40,'
          ' P89L: SY3_P89L, P89R: SY3_P89R, P115: SY3_P115, OCT: SY3_OCT, HEX30: SY3_HEX30, DART: SY3_DART, KITE: sy3FigKites(), GRIDHL: SY3_GRIDHL,'
          ' HALF0: L56_HALF0, Q12: L12_QUAD.shapes.map(s => s.P), SUM2A: SY3_T1, SUM2B: L12_SUM2B, SUM6: L12_SUM6P })',
    'want': '({ c56a: wsWant(C56A), c56b: wsWant(C56B), c56c: wsWant(C56C), c89a: wsWant(C89A), c89b: wsWant(C89B), c10: wsWant(C10), c12a: wsWant(C12A), c12b: wsWant(C12B), c12d: wsWant(C12D),'
            ' pts: { c56a: C56A.pts, c56b: C56B.pts, c56c: C56C.pts, c89a: C89A.pts, c89b: C89B.pts, c10: C10.pts, c12a: C12A.pts, c12b: C12B.pts, c12d: C12D.pts } })',
    'mirror': 'L10_GUIDE.map(s => s.map(p => sy3Ap(sy3Refl([6, 0], [6, 10]), p)))',
    'ckey': '({ arrows: Object.fromEntries(Object.entries(SY3_ARW).map(([l, P]) => [l, sy3CKey([sy3P(P)])])),'
            ' ten: Object.fromEntries(SY3_TEN.map(t => [t.label, sy3CKey(t.parts || [sy3P(t.P)])])),'
            ' blocks: Object.fromEntries(L1_BLOCKS.map(s => [s.label, sy3CKey([sy3P(s.P)])])),'
            ' tiles: Object.fromEntries(L2_TILES.map(s => [s.label, sy3CKey([sy3P(s.P)])])), broken: sy3CKey([sy3P(L2_BROKEN)]),'
            ' cut: Object.fromEntries(L2_CUT.map(s => [s.label, sy3CKey([sy3P(s.P)])])),'
            ' pick12: Object.fromEntries(L12_PICK.map(s => [s.label, sy3CKey([sy3P(s.P)])])),'
            ' flip: sy3Key(sy3D4([SY3_F], 4)) === sy3Key(sy3D4(sy3XPs([SY3_F], [-1, 0, 0, 1, 0, 0]), 0)),'
            ' rot: sy3Key(sy3D4([SY3_F], 1)) === sy3Key(sy3D4(sy3XPs([SY3_F], sy3Rot([0, 0], 90)), 0)) })',
    'kind': '({ pick4: Object.fromEntries(L4_PICK.map((S, i) => [S.label, sy3Kind(L4_PICK_PARTS[i])])),'
            ' sym6: Object.fromEntries(SY3_SYM6.map(it => { const L = sy3SymLines(it.parts); return [it.label, L === Infinity ? -1 : L.length]; })),'
            ' ax4: Object.fromEntries(SY3_AX4.map(it => [it.label, sy3SymLines(it.parts).length])),'
            ' ax12: Object.fromEntries(L12_AX.map(it => [it.label, sy3SymLines(it.parts).length])),'
            ' win: SY3_WIN.map(w => { const R = sy3Refl(w.line[0], w.line[1]); return sy3Key(sy3XPs(w.parts, R)) === sy3Key(w.parts); }),'
            ' spin3: Object.fromEntries(L7_SPIN3.map(it => [it.label, [90, 180].map(d => sy3Key(sy3XPs(it.parts, sy3Rot(it.center, d))) === sy3Key(it.parts))])),'
            ' glyphR: sy3Key(sy3XPs(L7_R[0].parts, sy3Rot([3.5, 3.5], 180))) === sy3Key(L7_R[0].parts),'
            ' spin5: Object.fromEntries(L7_SPIN5.map(it => [it.label, sy3Kind(it.parts)])),'
            ' glyphs: Object.fromEntries(L7_KEYS.map(k => [k, sy3Kind([sy3Cells(sy3Grid(SY3_GLY[k]))])])),'
            ' pento: Object.fromEntries(L89_PENTO.map(c => [c.label, sy3Kind(c.parts)])),'
            ' cards8: Object.fromEntries(L11_CARDS.map(c => [c.label, sy3Kind(c.parts)])),'
            ' play: Object.fromEntries(L11_PLAY.map(c => [c.label, sy3Kind(c.parts)])),'
            ' rule: L11_RULE.map(c => sy3Kind(c.parts)),'
            ' mem: L11_MEM.map(c => [c.label, c.kind, sy3Kind(c.parts)]),'
            ' signs: Object.fromEntries(SY3_SIGNS.map(c => [c.label, sy3Kind(c.parts)])),'
            ' pics: SY3_PICS.map(p => [p.label, p.axes.length]),'
            ' double: (() => { const W = wsWant(C12D), all = Object.assign({}, C12D.pts, W), P = C12D.poly.map(n => all[n]); return sy3Kind([sy3P(P)]) + ":" + sy3SymLines([sy3P(P)]).length; })() })',
}


# ================================================================ 그림 넣기
_SVG, _DAT = {}, {}


def load(src):
    """앱 원본에서 그림·자료를 한 번에 뽑기"""
    if src not in _SVG:
        _SVG[src] = extract(src, FIGS)
        _DAT[src] = extract(src, DATA)
    return _SVG[src], _DAT[src]


def _w(svg):
    return float(svg.split('viewBox="')[1].split('"')[0].split()[2])


def pic(s, key, mm=None, src=SRC_TB):
    """그림 넣기. mm가 없으면 실제 크기(1 cm = 40 px → 너비 mm = px ÷ 4)."""
    svg = load(src)[0][key]
    w = _w(svg)
    real = mm is None
    if real:
        mm = w / 4
        assert mm <= 180, ('실제 크기 그림이 너무 넓어요', key, mm)
    t = svg.replace('>', '><rect x="-2000" y="-2000" width="6000" height="6000" fill="#fff"/>', 1)
    s.picture(SHOT.png(t, min(2600, w * (2.5 if real else 2.2))), width_mm=mm)


# ================================================================ 계산
def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def ang(V, A, B):
    a1 = math.atan2(A[1] - V[1], A[0] - V[0])
    a2 = math.atan2(B[1] - V[1], B[0] - V[0])
    d = abs(a1 - a2) * 180 / math.pi
    return 360 - d if d > 180 else d


def near(v, want, tol=1e-6):
    assert abs(v - want) < tol, (v, want)
    return want


def ap(A, p):
    return (A[0] * p[0] + A[2] * p[1] + A[4], A[1] * p[0] + A[3] * p[1] + A[5])


def vmap(src, dst, A):
    """합동 이동 A로 src의 꼭짓점 이름 → dst의 꼭짓점 이름"""
    out = {}
    for n, p in src.items():
        q = ap(A, p)
        hit = [m for m, r in dst.items() if dist(q, r) < 1e-6]
        assert len(hit) == 1, (n, q)
        out[n] = hit[0]
    return out


def refl_x(x0):
    return [-1, 0, 0, 1, 2 * x0, 0]


def rot180(c):
    return [-1, 0, 0, -1, 2 * c[0], 2 * c[1]]


def named(P, names):
    return dict(zip(names, P))


def cm(v, d=1):
    r = round(v, d)
    return ('%d' % r) if abs(r - round(r)) < 1e-9 else ('%.*f' % (d, r))


def mv(p, q):
    """p에서 q로 가는 길(모눈 칸)"""
    dx, dy = q[0] - p[0], q[1] - p[1]
    out = []
    if dx:
        out.append('%s으로 %d칸' % ('오른쪽' if dx > 0 else '왼쪽', abs(dx)))
    if dy:
        out.append('%s로 %d칸' % ('아래' if dy > 0 else '위', abs(dy)))
    return ', '.join(out)


def want_txt(src, key, how=None):
    """완성할 대응점: '점 ㅅ(점 ㄴ에서 오른쪽으로 8칸)'"""
    D = load(src)[1]['want']
    W, P = D[key], D['pts'][key]
    of = how or {}
    out = []
    for n, q in W.items():
        o = of.get(n)
        if o:
            out.append('점 %s(점 %s에서 %s)' % (n, o, mv(P[o], q)))
        else:
            out.append('점 %s' % n)
    return ', '.join(out)


KIND = {'L': '선대칭도형만', 'P': '점대칭도형만', 'B': '둘 다', 'N': '둘 다 아님'}


def kinds_of(d, want):
    """want: 'L'(선대칭) 'P'(점대칭) 'B'(둘 다) — 해당하는 이름"""
    ok = {'L': ('L', 'B'), 'P': ('P', 'B'), 'B': ('B',)}[want]
    return [k for k, v in d.items() if v in ok]


# ================================================================ 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def opt(*o):
    return '( ' + ' / '.join(o) + ' )'


def optn(*o):
    """보기가 길 때 한 줄에 하나씩"""
    return '( ' + ' /\n'.join(o) + ' )'


def ch(lv, opts, width=12):
    """기본형은 고르기, 도전형은 빈칸."""
    return opt(*opts) if lv == '기본형' else '(' + ' ' * width + ')'


def qa(s, items, col=(120, 60)):
    """(질문, 답, 단위) 표. 정답 글 목록."""
    rows, ans = [], []
    for it in items:
        q, a = it[0], it[1]
        unit = it[2] if len(it) > 2 else ''
        rows.append([q, '(            )' + unit])
        ans.append(str(a) + unit)
    s.table(rows, header=False, col_mm=list(col), row_h=3402)
    return ans


def why(s, q, n=2):
    s.ask(q, blank=False)
    s.lines(n)


def write_pane(s, lv, items):
    if lv == '기본형':
        s.labeled(items)
    else:
        for k, _ in items:
            s.ask(k + ':', blank=False)
            s.lines(1)


def corr(s, lv, mp, rows):
    """대응점·대응변·대응각 표. rows: [('점', ['ㄱ', …]), ('변', ['ㄱㄴ', …]), ('각', [...])]. 기본형은 첫 칸이 보기."""
    out, ans = [], []
    for k, items in rows:
        cells = ['대응' + k]
        for i, w in enumerate(items):
            a = ''.join(mp[c] for c in w)
            ans.append('%s %s→%s' % (k, w, a))
            if lv == '기본형' and i == 0 and k == '점':
                cells.append('%s → ( %s )' % (w, a))
            else:
                cells.append('%s → (%s)' % (w, ' ' * (6 + 2 * len(w))))
        out.append(cells)
    n = max(len(r) for r in out)
    out = [r + [''] * (n - len(r)) for r in out]
    s.table(out, header=False, header_col=True, col_mm=[24] + [156 / (n - 1)] * (n - 1), row_h=3402)
    return ans


def measure_table(s, names, unit):
    """재어 쓰는 표: 첫 줄 이름, 둘째 줄 (   ) 단위"""
    n = len(names)
    s.table([names, ['(      )' + unit] * n], header=True, col_mm=[180 / n] * n, row_h=3402)


def order_q(s, lv, items, right, what):
    """차례 맞히기: 보기 글을 늘어놓고 차례를 쓰기"""
    for t in items:
        s.text(t)
    s.ask(what + ' 차례대로 기호를 써 보세요.   (     ) → (     ) → (     )' + (' → (     )' if len(items) > 3 else ''), blank=False)
    return ' → '.join(items[i][0] for i in right)
