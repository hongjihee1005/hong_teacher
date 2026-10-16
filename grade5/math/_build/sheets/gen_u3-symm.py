# -*- coding: utf-8 -*-
"""5-2 수학 3. 합동과 대칭 활동지(교과서 차시 버전[·이야기 버전] × 기본형·도전형) 만들기

    python3 gen_u3-symm.py            # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u3-symm.py tb         # 교과서 차시 버전만
    python3 gen_u3-symm.py st         # 이야기 버전만(원본이 다 되어 있을 때)

앱 원본 ../units/sem2/u3-symm.tb.js('미술관 합동과 대칭', 12차시: 1·2·3·4·5~6·7·8~9·10·11·12)의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.

이야기 버전은 앱 원본 ../units/sem2/u3-symm.st.js('우리 반 대칭 무늬 공방', 12차시: 1~12)의 LESSONS를 node에서 그대로 실행해
활동마다 넘긴 설정(물음·보기·정답·도형 좌표·완성할 점)을 모아(ST_JS의 CAP) 그 물음과 수를 그대로 씁니다 → sem2-soop/sheets/.
원본 파일이 없거나 LESSONS가 없으면 건너뜁니다.

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
import re
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


def extract(src, jobs, pre_js=None):
    jf = os.path.join(WORK, 'jobs.json')
    with open(jf, 'w', encoding='utf-8') as f:
        json.dump(jobs, f, ensure_ascii=False)
    js, pre = os.path.join(WORK, 'ex.js'), os.path.join(WORK, 'pre.js')
    with open(js, 'w', encoding='utf-8') as f:
        f.write(_EX)
    with open(pre, 'w', encoding='utf-8') as f:
        f.write(WS_JS + (WS_LESSON_JS if pre_js is None else pre_js))
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
        if src == SRC_ST:      # 이야기 버전: 앱 LESSONS를 그대로 읽어 쓰는 ST_JS·ST_FIGS·ST_DATA
            _SVG[src] = extract(src, ST_FIGS, ST_JS)
            _DAT[src] = extract(src, ST_DATA, ST_JS)
        else:
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
                cells.append('%s → (%s)' % (w, ' ' * (3 + 2 * len(w))))
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


# ================================================================ 교과서 차시 버전(tb)
def tb1(s, lv):
    S, D = load(SRC_TB)
    assert D['ckey']['flip'] and D['ckey']['rot']
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 다윤이와 승현이의 미술관 나들이', '미술관에 있는 여러 가지 모양에는 어떤 특징이 있을까요?')
    s.scene(None, '다윤이와 승현이가 미술관을 방문했어요. 미술관에는 다양한 작품이 있고 판화 찍기, 색종이로 작품 만들기 같은 체험도 할 수 있대요.')
    step(s, 0, '둘러보기', '미술관의 다섯 곳')
    pic(s, 'museum', 160)
    s.text('작품을 하나씩 살펴보고 어떤 특징이 있는지 알아보세요.')
    s.choices([('미술관 바닥의 화살표들은 모양과 크기가', opt('같아요', '달라요')),
               ('색유리 창문 무늬는', optn('왼쪽과 오른쪽의 모양이 같아요', '왼쪽과 오른쪽의 모양이 달라요'))])
    a1 = qa(s, [('모양과 크기가 똑같은 도형이 있는 곳', '바닥 화살표, 판화 체험장'),
                ('왼쪽과 오른쪽의 모양이 같은 곳', '색유리 창문'),
                ('가운데 점을 중심으로 180° 돌려도 처음과 겹치는 곳', '천장 글자 작품, 복도의 작품')], col=(105, 75))
    step(s, 1, '데칼코마니', '반으로 접었다 펴기')
    s.text('인도의 타지마할은 건물의 왼쪽과 오른쪽이 대칭을 이룬대요. 데칼코마니 작품도 비슷한 특징이 있어요. '
           '접는 선 왼쪽에 물감을 찍었어요. 반으로 접었다 펴면 오른쪽에 생기는 무늬를 같은 색으로 칠해 보세요.')
    pic(s, 'decal')
    s.choices([('펼친 종이에서 접는 선의 왼쪽과 오른쪽 무늬는 모양과 크기가', opt('같아요', '달라요')),
               ('접는 선을 따라 다시 접으면 두 무늬가', opt('완전히 겹쳐요', '겹치지 않아요'))])
    step(s, 2, '떠올리기 ⑴', '4학년 평면도형의 이동')
    pic(s, 'f_flip', 105)
    pic(s, 'f_rot', 105)
    s.choices([('보기 도형을 오른쪽으로 뒤집었을 때의 모양 (위 그림)', opt('가', '나', '다')),
               ('보기 도형을 시계 방향으로 90°만큼 돌렸을 때의 모양 (아래 그림)', opt('가', '나', '다'))])
    step(s, 3, '떠올리기 ⑵', '수직과 수선, 대각선')
    pic(s, 'perp', 95)
    s.choices([('직선 가와 수직으로 만나는 직선', opt('나', '다', '라'))])
    s.fill(['두 직선이 만나서 이루는 각이 직각일 때, 두 직선은 서로 %s이라고 합니다.' % ch(lv, ['수직', '평행', '대각선']),
            '사각형에서 서로 이웃하지 않는 두 꼭짓점을 이은 선분을 %s이라고 합니다.' % ch(lv, ['대각선', '수선', '높이'])])
    pic(s, 'diag', 45)
    a4 = qa(s, [('사각형에 대각선을 모두 그어 보세요. 대각선은 모두 몇 개일까요?', 2, '개')])
    step(s, 4, '확인하기', '이 단원에서 배울 내용')
    write_pane(s, lv, [('경험', '생활에서 ________________________ 에서 똑같은 모양을 보았어요.'),
                       ('짐작', '합동은 ______________, 대칭은 ______________ 일 것 같아요.')])
    ans = ('1차시  ① 같아요, 왼쪽과 오른쪽의 모양이 같아요, %s   ② 오른쪽에 접는 선에서 같은 거리만큼 떨어진 칸을 같은 색으로(좌우가 바뀐 모양), 같아요, 완전히 겹쳐요'
           '   ③ 나, 다   ④ 나, 수직, 대각선, %s   ⑤ (자유) 예) 포장지·보도블록 / 모양과 크기가 같은 것, 양쪽이 똑같은 것' % (' / '.join(a1), a4[0]))
    if lv == '도전형':
        step(s, 5, '도전하기', '미술관 앞 보도블록')
        pic(s, 'blocks', 130)
        keys = D['ckey']['blocks']
        odd = [k for k, v in keys.items() if list(keys.values()).count(v) == 1]
        assert odd == ['마'], odd
        s.ask('다른 블록들과 모양과 크기가 다른 블록 하나를 찾아 기호를 써 보세요.')
        why(s, '그 블록이 다른 까닭과, 나머지 블록들이 모양과 크기가 같다고 할 수 있는 까닭을 써 보세요.', 2)
        ans += '   ⑥ 마 (아래쪽이 4칸이라 모양과 크기가 달라요. 나머지는 돌리거나 뒤집어 놓았을 뿐 모양과 크기가 같아요.)'
    return ans


def tb2(s, lv):
    S, D = load(SRC_TB)
    K = D['ckey']
    s.lesson(2, '개념 구축하기(O)', '도형의 합동을 알아볼까요', '모양과 크기가 같은 도형은 어떻게 알 수 있을까요?')
    s.scene(None, '미술관 작품 만들기 체험장과 바닥의 화살표에서 모양과 크기가 같은 도형을 찾아봐요.')
    step(s, 0, '만져 보기', '색종이 두 장을 겹쳐서 오리기')
    s.text('색종이 한 장에 도형을 그리고, 그 아래에 다른 색종이 한 장을 겹쳐서 오려 보세요. 오려 낸 두 도형을 포개어 보세요.')
    s.choices([('겹쳐서 오린 두 도형은 모양과 크기가', opt('같아요', '달라요')),
               ('두 도형을 포개면', opt('완전히 겹쳐요', '조금 남아요'))])
    step(s, 1, '포개어 보기', '미술관 바닥의 화살표')
    s.text('투명 종이에 도형 가를 본떠 그린 다음, 도형 나, 다, 라, 마에 각각 포개어 보세요. 방향이 다르면 투명 종이를 돌리거나 뒤집어 봐요.')
    pic(s, 'arrows', 165)
    fit = [k for k in '나다라마' if K['arrows'][k] == K['arrows']['가']]
    assert fit == ['라'], fit
    s.choices([('도형 가와 완전히 겹치는 도형', opt('나', '다', '라', '마')),
               ('도형 라에 포개려면 투명 종이를', optn('밀기만 하면 돼요', '돌리거나 뒤집어야 해요')),
               ('도형 나, 다, 마가 도형 가와 완전히 겹치지 않는 까닭', optn('모양이나 크기가 달라서', '놓인 자리가 달라서'))])
    step(s, 2, '말해 보기', '포개어 본 것 떠올리기')
    s.choices([('뒤집어서 포개었을 때 완전히 겹치는 두 도형도 모양과 크기가 같은 도형일까요?', opt('네', '아니요')),
               ('모양은 같지만 크기가 다른 두 도형은 포개었을 때', optn('완전히 겹쳐요', '완전히 겹치지 않아요')),
               ('도형 옆에 똑같은 도형을 붙여 놓은 그림은', optn('두 도형을 합한 큰 도형', '모양과 크기가 같은 두 도형'))])
    step(s, 3, '약속하기', '합동')
    s.fill('모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 %s이라고 합니다.' % ch(lv, ['합동', '대칭', '평행']))
    step(s, 4, '확인하기', '모눈 위의 도형 가~차')
    pic(s, 'ten', 175)
    groups = {}
    for k, v in K['ten'].items():
        groups.setdefault(v, []).append(k)
    pairs = sorted(tuple(sorted(g, key='가나다라마바사아자차'.index)) for g in groups.values() if len(g) == 2)
    assert pairs == [('가', '차'), ('나', '마'), ('다', '바')], pairs
    assert all(len(g) <= 2 for g in groups.values())
    s.text('서로 합동인 도형을 모두 찾아 짝 지어 보세요.')
    if lv == '기본형':
        s.text('도움: 삼각형은 밑변과 높이, 직사각형은 가로와 세로, 원은 지름의 칸 수를 세어 봐요.')
        s.fill('( 가 ) 와 (      ),   (      ) 와 (      ),   (      ) 와 (      )')
    else:
        s.fill('(      ) 와 (      ),   (      ) 와 (      ),   (      ) 와 (      )')
    s.choices([('어떻게 찾았나요?', optn('모눈의 칸 수를 세어서 같은 것끼리', '같은 줄에 있는 것끼리'))])
    ans = ('2차시  ① 같아요, 완전히 겹쳐요   ② 라, 돌리거나 뒤집어야 해요, 모양이나 크기가 달라서   ③ 네, 완전히 겹치지 않아요, 모양과 크기가 같은 두 도형'
           '   ④ 합동   ⑤ %s, 모눈의 칸 수를 세어서' % ', '.join('%s와 %s' % p for p in pairs))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘')
        s.text('⑴ 윤아네 집 욕실에서 깨진 타일을 새 타일로 바꾸어 붙이려고 해요.')
        pic(s, 'tiles', 140)
        fit = [k for k, v in K['tiles'].items() if v == K['broken']]
        assert fit == ['다'], fit
        s.ask('바꾸어 붙일 수 있는 타일의 기호를 쓰고, 어떻게 붙이면 되는지 써 보세요.')
        s.lines(1)
        s.text('⑵ 사각형을 점선을 따라 모두 잘랐어요. 잘라 낸 도형 중 서로 합동인 도형을 짝 지어 보세요.')
        pic(s, 'cut', 75)
        g2 = {}
        for k, v in K['cut'].items():
            g2.setdefault(v, []).append(k)
        p2 = sorted(tuple(sorted(g, key='가나다라'.index)) for g in g2.values())
        assert p2 == [('가', '라'), ('나', '다')], p2
        s.fill('(      ) 와 (      ),   (      ) 와 (      )')
        ans += '   ⑥ ⑴ 다(돌려서 붙이면 깨진 곳과 완전히 겹쳐요) ⑵ %s' % ', '.join('%s와 %s' % p for p in p2)
    return ans


def tb3(s, lv):
    S, D = load(SRC_TB)
    P = D['pt']
    s.lesson(3, '개념 구축하기(O)', '합동인 도형의 성질을 알아볼까요', '서로 합동인 두 도형을 포개었을 때 겹치는 점, 변, 각에는 어떤 성질이 있을까요?')
    s.scene(None, '승현이가 판화 체험장에서 만든 작품이에요. 판에 새긴 삼각형 ㄱㄴㄷ과 찍어 낸 삼각형 ㄹㅁㅂ이 있어요.')
    step(s, 0, '만져 보기', '투명 종이로 포개어 보기')
    pic(s, 't12', 115)
    s.text('삼각형 ㄱㄴㄷ을 투명 종이에 본떠 그린 다음, 삼각형 ㄹㅁㅂ에 완전히 겹치도록 포개어 보세요. 포개었을 때 겹치는 꼭짓점, 변, 각을 써 보세요.')
    mp = vmap(named(P['T1'], 'ㄱㄴㄷ'), named(P['T2'], 'ㄹㅁㅂ'), [1, 0, 0, 1, 8, 0])
    a1 = corr(s, lv, mp, [('점', ['ㄱ', 'ㄴ', 'ㄷ']), ('변', ['ㄱㄴ', 'ㄴㄷ', 'ㄷㄱ']), ('각', ['ㄱㄴㄷ', 'ㄴㄷㄱ', 'ㄷㄱㄴ'])])
    step(s, 1, '약속하기', '대응점, 대응변, 대응각')
    o3 = ['대응점', '대응변', '대응각']
    s.fill('서로 합동인 두 도형을 완전히 겹치도록 포개었을 때 겹치는 점을 %s, 겹치는 변을 %s, 겹치는 각을 %s이라고 합니다.'
           % (ch(lv, o3), ch(lv, o3), ch(lv, o3)))
    step(s, 2, '재어 보기', '합동인 두 사각형(실제 크기)')
    s.text('사각형 ㄱㄴㄷㄹ과 사각형 ㅁㅂㅅㅇ은 서로 합동이에요. 그림은 실제 크기예요(모눈 한 칸은 1 cm). 자와 각도기로 재어 표를 완성해 보세요.')
    pic(s, 'tz')
    A = named(P['TZ1'], 'ㄱㄴㄷㄹ')
    B = named(P['TZ2'], 'ㅇㅅㅂㅁ')
    mpz = {'ㄱ': 'ㅇ', 'ㄴ': 'ㅅ', 'ㄷ': 'ㅂ', 'ㄹ': 'ㅁ'}
    sides = ['ㄱㄹ', 'ㄹㄷ', 'ㄷㄴ', 'ㄴㄱ']
    angs = ['ㄱㄹㄷ', 'ㄹㄷㄴ', 'ㄱㄴㄷ', 'ㄴㄱㄹ']
    L = [dist(A[w[0]], A[w[1]]) for w in sides]
    for w, v in zip(sides, L):
        near(dist(B[mpz[w[0]]], B[mpz[w[1]]]), v)
    G = [ang(A[w[1]], A[w[0]], A[w[2]]) for w in angs]
    for w, v in zip(angs, G):
        near(ang(B[mpz[w[1]]], B[mpz[w[0]]], B[mpz[w[2]]]), v)
    assert [round(g) for g in G] == [90, 90, 45, 135], G
    if lv == '기본형':
        s.table([['변'] + ['변 ' + w for w in sides], ['길이'] + ['(     ) cm'] * 4,
                 ['대응변'] + ['변 ' + ''.join(mpz[c] for c in w) for w in sides], ['길이'] + ['(     ) cm'] * 4],
                header=True, header_col=True, col_mm=[24, 39, 39, 39, 39], row_h=3402)
        s.table([['각'] + ['각 ' + w for w in angs], ['크기'] + ['(     )°'] * 4,
                 ['대응각'] + ['각 ' + ''.join(mpz[c] for c in w) for w in angs], ['크기'] + ['(     )°'] * 4],
                header=True, header_col=True, col_mm=[24, 39, 39, 39, 39], row_h=3402)
    else:
        s.table([['변'] + ['변 ' + w for w in sides], ['길이'] + ['(     ) cm'] * 4,
                 ['대응변'] + ['변 (        )'] * 4, ['길이'] + ['(     ) cm'] * 4],
                header=True, header_col=True, col_mm=[24, 39, 39, 39, 39], row_h=3402)
        s.table([['각'] + ['각 ' + w for w in angs], ['크기'] + ['(     )°'] * 4,
                 ['대응각'] + ['각 (          )'] * 4, ['크기'] + ['(     )°'] * 4],
                header=True, header_col=True, col_mm=[24, 39, 39, 39, 39], row_h=3402)
    s.text('※ 변 ㄴㄱ처럼 모눈을 비스듬히 지나는 변은 소수 첫째 자리까지 어림하여 재어요.')
    s.fill('서로 합동인 두 도형은 %s의 길이와 %s의 크기가 각각 같습니다.' % (ch(lv, o3), ch(lv, o3)))
    ztxt = ', '.join('%s=%s %s cm' % (w, ''.join(mpz[c] for c in w), ('약 ' if abs(v - round(v)) > 1e-6 else '') + cm(v)) for w, v in zip(sides, L))
    gtxt = ', '.join('%s=%s %d°' % (w, ''.join(mpz[c] for c in w), round(g)) for w, g in zip(angs, G))
    step(s, 3, '구해 보기', '합동인 두 사각형의 □')
    s.text('두 사각형은 서로 합동이에요. □ 안에 알맞은 수를 구해 보세요.')
    pic(s, 'quad3', 135)
    Lq, Rq = P['Q3L'], P['Q3R']
    near(dist(Lq[0], Lq[1]), 5, 1e-3)
    near(dist(Lq[1], Lq[2]), 4, 1e-3)
    near(dist(Rq[1], Rq[2]), 4, 1e-3)
    qang = [ang(Lq[i], Lq[(i + 3) % 4], Lq[(i + 1) % 4]) for i in range(4)]
    rang = [ang(Rq[i], Rq[(i + 3) % 4], Rq[(i + 1) % 4]) for i in range(4)]
    near(qang[0], 100, .05)
    near(rang[0], 100, .05)
    near(rang[2], 110, .05)
    a3 = qa(s, [('구하려는 변의 길이 □', 4, ' cm'), ('구하려는 각의 크기 □', 100, '°')])
    if lv == '기본형':
        s.choices([('그렇게 구한 까닭: 서로 합동인 두 도형은', optn('대응변의 길이와 대응각의 크기가 각각 같기 때문이에요', '모든 변의 길이가 같기 때문이에요'))])
    else:
        why(s, '□ 안의 수를 그렇게 구한 까닭을 써 보세요.', 1)
    step(s, 4, '확인하기', '퍼즐의 빈자리 채우기')
    s.text('삼각형 ㄱㄴㄷ을 퍼즐의 비어 있는 부분(점선)에 채우면 퍼즐이 완성돼요. 빈자리에 넣은 삼각형 ㄱㄴㄷ과 삼각형 ㅁㅂㄹ은 서로 합동이에요.')
    pic(s, 'puzzle', 135)
    mpp = vmap(named(P['PZT'], 'ㄱㄴㄷ'), named(P['PZH'], 'ㅁㅂㄹ'), P['PZA'])
    assert P['PZA'][:4] == [0, 1, -1, 0]          # 화면에서 시계 방향 90°
    s.choices([('삼각형 ㄱㄴㄷ을 빈자리에 꼭 맞게 넣으려면', optn('시계 방향으로 90° 돌려요', '시계 반대 방향으로 90° 돌려요', '위쪽으로 뒤집어요'))])
    a5 = corr(s, lv, mpp, [('점', ['ㄱ', 'ㄴ', 'ㄷ']), ('변', ['ㄱㄴ', 'ㄴㄷ', 'ㄷㄱ']), ('각', ['ㄱㄴㄷ', 'ㄴㄷㄱ', 'ㄷㄱㄴ'])])
    ans = ('3차시  ① %s   ② 대응점, 대응변, 대응각   ③ %s / %s, 대응변, 대응각   ④ %s (대응변의 길이와 대응각의 크기가 각각 같기 때문)'
           '   ⑤ 시계 방향으로 90° 돌려요, %s' % (', '.join(a1), ztxt, gtxt, ', '.join(a3), ', '.join(a5)))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘')
        s.text('⑴ 두 삼각형은 서로 합동이에요(한 삼각형은 뒤집힌 모양이에요).')
        pic(s, 'flipt', 110)
        mpf = vmap(named(P['FLA'], 'ㄱㄴㄷ'), named(P['FLB'], 'ㄹㅁㅂ'), [-1, 0, 0, 1, 14, 0])
        f = qa(s, [('점 ㄴ의 대응점', '점 ' + mpf['ㄴ']), ('변 ㄱㄴ의 대응변', '변 ' + mpf['ㄱ'] + mpf['ㄴ']),
                   ('각 ㄱㄷㄴ의 대응각', '각 ' + mpf['ㄱ'] + mpf['ㄷ'] + mpf['ㄴ'])])
        s.text('⑵ 두 사각형 ㄱㄴㄷㄹ과 ㅁㅂㅅㅇ은 서로 합동이에요. 사각형 ㄱㄴㄷㄹ의 둘레는 30 cm예요.')
        pic(s, 'q30', 140)
        Q = P['Q30']
        near(dist(Q[0], Q[1]), 10)
        near(dist(Q[1], Q[2]), 5)
        near(dist(Q[2], Q[3]), 7)
        near(dist(Q[3], Q[0]), 8)
        g1 = qa(s, [('변 ㄱㄴ의 길이', 30 - 5 - 7 - 8, ' cm'), ('합동인 두 사각형의 대응점(대응변, 대응각)은 각각 몇 쌍', 4, '쌍')])
        s.text('⑶ 두 삼각형은 서로 합동이에요(점 ㄱ과 점 ㄹ, 점 ㄴ과 점 ㅁ, 점 ㄷ과 점 ㅂ이 대응점).')
        pic(s, 't40', 105)
        T = P['T40']
        near(ang(T[0], T[1], T[2]), 65, .05)
        near(ang(T[2], T[0], T[1]), 75, .05)
        near(ang(T[1], T[0], T[2]), 40, .05)
        g2 = qa(s, [('각 ㄹㅁㅂ의 크기', 180 - 65 - 75, '°')])
        why(s, '각 ㄹㅁㅂ의 크기를 구한 방법을 써 보세요.', 1)
        ans += '   ⑥ %s / %s(30−5−7−8), %s / %s (각 ㄹ은 65°, 각 ㅂ은 75°이므로 180°−65°−75°)' % (', '.join(f), g1[0], g1[1], g2[0])
    return ans


def hl_check(P):
    """선대칭 육각형 SY3_HL: 변 3·2·3 cm, 각 80°·100°, 대칭축 x = 4"""
    H = named(P['HL'], 'ㄱㄴㄷㄹㅁㅂ')
    near(dist(H['ㄱ'], H['ㄴ']), 3, 1e-3)
    near(dist(H['ㄴ'], H['ㄷ']), 2, 1e-3)
    near(dist(H['ㄷ'], H['ㄹ']), 3, 1e-3)
    near(ang(H['ㄴ'], H['ㄱ'], H['ㄷ']), 80, .05)
    near(ang(H['ㄷ'], H['ㄴ'], H['ㄹ']), 100, .05)
    return H


def tb4(s, lv):
    S, D = load(SRC_TB)
    P, KD = D['pt'], D['kind']
    s.lesson(4, '개념 구축하기(O)', '선대칭도형을 알아볼까요', '한 직선을 따라 접었을 때 완전히 겹치는 도형에는 어떤 특징이 있을까요?')
    s.scene(None, '미술관의 색유리 창문에 있는 무늬예요. 무늬마다 빨간 선이 그어져 있어요.')
    step(s, 0, '만져 보기', '색유리 창문 무늬 접어 보기')
    pic(s, 'win', 172)
    assert all(KD['win'])
    s.text('무늬마다 빨간 선을 따라 접으면 어떻게 될지 생각해 보세요. (종이에 옮겨 그려 접어 봐도 좋아요.)')
    s.choices([('색유리 창문의 무늬는 주어진 선을 따라 접었을 때', opt('완전히 겹쳐요', '겹치지 않아요'))])
    step(s, 1, '그려 보기', '반으로 접어 완전히 겹치는 직선')
    s.text('도형 가~마를 반으로 접었을 때 완전히 겹치는 도형을 찾아, 접을 수 있는 직선을 모두 그어 보세요. 세로·가로뿐 아니라 비스듬한 방향도 생각해 봐요.')
    pic(s, 'sym6', 150)
    n6 = KD['sym6']
    yes = [k for k, v in n6.items() if v != 0]
    assert yes == ['나', '라', '마'] and n6['나'] == 1 and n6['마'] == 2 and n6['라'] == -1, n6
    s.ask('반으로 접었을 때 완전히 겹치는 도형을 모두 찾아 기호를 써 보세요.')
    s.fill('접을 수 있는 직선은 도형 나는 (    )개, 도형 마는 (    )개이고, 도형 라는 %s.' % ch(lv, ['1개예요', '4개예요', '셀 수 없이 많아요'], 16))
    step(s, 2, '약속하기', '선대칭도형과 대칭축')
    s.fill(['한 직선을 따라 접었을 때 완전히 겹치는 도형을 %s이라고 합니다. 이때 그 직선을 %s이라고 합니다.'
            % (ch(lv, ['선대칭도형', '점대칭도형', '합동']), ch(lv, ['대칭축', '대각선', '수선'])),
            '대칭축을 따라 접었을 때 겹치는 점을 %s, 겹치는 변을 %s, 겹치는 각을 %s이라고 합니다.'
            % (ch(lv, ['대응점', '꼭짓점']), ch(lv, ['대응변', '대각선']), ch(lv, ['대응각', '직각']))])
    step(s, 3, '말해 보기', '대칭축을 따라 접었을 때 겹치는 것')
    s.text('직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이에요. 대칭축을 따라 접었을 때 겹치는 대응점, 대응변, 대응각을 써 보세요.')
    pic(s, 'hl', 80)
    H = hl_check(P)
    mp = vmap(H, H, refl_x(4))
    assert mp['ㄱ'] == 'ㄱ' and mp['ㄹ'] == 'ㄹ'
    a3 = corr(s, lv, mp, [('점', ['ㄴ', 'ㄷ']), ('변', ['ㄱㄴ', 'ㄴㄷ', 'ㄷㄹ']), ('각', ['ㄱㄴㄷ', 'ㄴㄷㄹ'])])
    if lv == '기본형':
        s.text('도움: 점 ㄱ과 점 ㄹ은 대칭축 위에 있어서 접어도 제자리예요.')
    step(s, 4, '확인하기', '수학익힘 ― 선대칭도형 찾기')
    pic(s, 'pick4', 175)
    a4 = kinds_of(KD['pick4'], 'L')
    assert a4 == ['가', '나', '라', '바'], a4
    s.ask('선대칭도형을 모두 찾아 기호를 써 보세요.', answer_space=16)
    ans = ('4차시  ① 완전히 겹쳐요   ② 나, 라, 마 / 나 1개, 마 2개, 라 셀 수 없이 많아요   ③ 선대칭도형, 대칭축, 대응점, 대응변, 대응각'
           '   ④ %s   ⑤ %s' % (', '.join(a3), ', '.join(a4)))
    if lv == '도전형':
        step(s, 5, '도전하기', '대칭축의 수 비교하기')
        s.text('선대칭도형의 대칭축을 모두 찾아 긋고, 대칭축의 수가 적은 것부터 차례대로 기호를 써 보세요.')
        pic(s, 'ax4', 150)
        n4 = KD['ax4']
        order = sorted(n4, key=lambda k: n4[k])
        assert order == ['나', '다', '라', '가'] and len(set(n4.values())) == 4
        s.table([['도형', '가', '나', '다', '라'], ['대칭축의 수'] + ['(    )개'] * 4], header=True, header_col=True,
                col_mm=[40, 35, 35, 35, 35], row_h=3402)
        s.ask('대칭축의 수가 적은 것부터:   (     ) → (     ) → (     ) → (     )', blank=False)
        why(s, '정사각형의 대칭축은 어디에 있는지 써 보세요.', 1)
        ans += '   ⑥ 가 %d개, 나 %d개, 다 %d개, 라 %d개 → %s (정사각형: 마주 보는 변의 가운데끼리, 마주 보는 꼭짓점끼리 이은 직선)' % (
            n4['가'], n4['나'], n4['다'], n4['라'], ' → '.join(order))
    return ans


def tb56(s, lv):
    S, D = load(SRC_TB)
    P = D['pt']
    s.lesson('5~6', '개념 구축하기(O)', '선대칭도형의 성질을 알아볼까요', '선대칭도형에는 어떤 성질이 있고, 그 성질을 이용하여 선대칭도형을 어떻게 완성할 수 있을까요?')
    s.scene(None, '작품 만들기 체험장에서 색종이를 반으로 접어 오려 선대칭도형을 만들었어요.')
    step(s, 0, '재어 보기', '대응변의 길이와 대응각의 크기(실제 크기)')
    s.text('직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이에요. 그림은 실제 크기예요. 자와 각도기로 재어 보세요.')
    pic(s, 'hl')
    H = hl_check(P)
    measure_table(s, ['변 ㄱㄴ', '변 ㄱㅂ', '변 ㄴㄷ', '변 ㅂㅁ', '변 ㄷㄹ', '변 ㅁㄹ'], ' cm')
    measure_table(s, ['각 ㄱㄴㄷ', '각 ㄱㅂㅁ', '각 ㄴㄷㄹ', '각 ㅂㅁㄹ'], '°')
    near(dist(H['ㄱ'], H['ㅂ']), 3, 1e-3)
    near(ang(H['ㅂ'], H['ㄱ'], H['ㅁ']), 80, .05)
    o3 = ['대응점', '대응변', '대응각']
    s.fill('선대칭도형은 %s의 길이와 %s의 크기가 각각 같습니다.' % (ch(lv, o3), ch(lv, o3)))
    step(s, 1, '모눈에서 살펴보기', '대응점끼리 이은 선분과 대칭축(실제 크기)')
    s.text('직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이에요. 선분 ㄴㅂ과 대칭축이 만나는 점이 점 ㅈ, 선분 ㄷㅁ과 대칭축이 만나는 점이 점 ㅊ이에요.')
    pic(s, 'gridhl')
    N = P['GRIDHL']
    J, C = (6, 3), (6, 6)
    a1 = qa(s, [('선분 ㄴㅈ과 선분 ㅂㅈ의 길이(모눈 칸 수)', '%d칸, %d칸' % (dist(N['ㄴ'], J), dist(N['ㅂ'], J))),
                ('선분 ㄷㅊ과 선분 ㅁㅊ의 길이(모눈 칸 수)', '%d칸, %d칸' % (dist(N['ㄷ'], C), dist(N['ㅁ'], C))),
                ('선분 ㄴㅂ이 대칭축과 만나서 이루는 각', 90, '°')], col=(115, 65))
    assert dist(N['ㄴ'], J) == dist(N['ㅂ'], J) == 4 and dist(N['ㄷ'], C) == dist(N['ㅁ'], C) == 3
    assert N['ㄴ'][1] == N['ㅂ'][1] == 3 and N['ㄷ'][1] == N['ㅁ'][1] == 6     # 대칭축(세로)과 수직
    s.fill('선대칭도형에서 대응점끼리 이은 선분은 대칭축과 %s으로 만나고, 대응점에서 대칭축까지의 거리는 %s.'
           % (ch(lv, ['수직', '평행']), ch(lv, ['같습니다', '다릅니다'])))
    step(s, 2, '구해 보기', '선대칭도형의 □')
    s.text('두 도형은 모두 직선 ㄱㄴ을 대칭축으로 하는 선대칭도형이에요. □ 안에 알맞은 수를 구해 보세요.')
    pic(s, 'kites', 130)
    KT = P['KITE']
    k1, k2 = KT['shapes'][0]['P'], KT['shapes'][1]['P']
    near(dist(k1[0], k1[1]), 5, 1e-3)
    near(dist(k1[0], k1[3]), 5, 1e-3)
    near(ang(k1[3], k1[0], k1[2]), ang(k1[1], k1[2], k1[0]), 1e-3)
    a_l = round(ang(k1[3], k1[0], k1[2]))
    assert a_l == 100, a_l
    near(abs(k2[5][0] - 10.5), 4)
    a2 = qa(s, [('왼쪽 도형의 □ cm', 5, ' cm'), ('왼쪽 도형의 □°', a_l, '°'), ('오른쪽 도형의 □ cm', 4, ' cm'), ('오른쪽 도형의 □°', 90, '°')])
    step(s, 3, '완성 방법 찾기', '선대칭도형 완성하기(실제 크기)')
    s.text('직선 ㅁㅂ을 대칭축으로 하는 선대칭도형의 일부예요. 점 ㄴ과 점 ㄷ의 대응점을 찾아 각각 점 ㅅ과 점 ㅇ으로 표시하고, '
           '점 ㄱ, 점 ㅅ, 점 ㅇ, 점 ㄹ을 차례대로 이어 선대칭도형을 완성해 보세요.')
    if lv == '기본형':
        s.text('도움: 흐린 점선은 각 점에서 대칭축에 그은 수선이에요. 대칭축까지 몇 칸인지 세어 반대쪽으로 같은 칸만큼 가요.')
    pic(s, 'c56a1' if lv == '기본형' else 'c56a0')
    w1 = want_txt(SRC_TB, 'c56a', {'ㅅ': 'ㄴ', 'ㅇ': 'ㄷ'})
    o4 = order_q(s, lv, ['가. 각 점을 차례대로 이어 선대칭도형을 완성합니다.', '나. 각 점에서 대칭축에 수선을 긋습니다.',
                         '다. 각 점에서 대칭축까지의 거리가 같도록 대응점을 찾아 표시합니다.'], [1, 2, 0], '선대칭도형을 완성하는 방법을')
    step(s, 4, '확인하기', '가로로 놓인 대칭축(실제 크기)')
    s.text('가로로 놓인 빨간 직선을 대칭축으로 하는 선대칭도형의 일부예요. 점 ㄹ, ㄷ, ㄴ의 대응점을 찾아 각각 점 ㅂ, ㅅ, ㅇ으로 표시하고 선대칭도형을 완성해 보세요.')
    pic(s, 'c56b1' if lv == '기본형' else 'c56b0')
    w2 = want_txt(SRC_TB, 'c56b', {'ㅂ': 'ㄹ', 'ㅅ': 'ㄷ', 'ㅇ': 'ㄴ'})
    chk = ['㉠ 대칭축을 따라 접었을 때 완전히 겹치는지 알아봐요.', '㉡ 대응변의 길이와 대응각의 크기가 각각 같은지 알아봐요.',
           '㉢ 대응점끼리 이은 선분이 대칭축과 수직이고, 대칭축까지의 거리가 같은지 알아봐요.', '㉣ 한 점을 중심으로 180° 돌렸을 때 겹치는지 알아봐요.']
    s.ask('완성한 도형이 선대칭도형인지 확인하는 방법으로 알맞은 것을 모두 골라 기호를 써 보세요.', blank=False)
    for t in chk:
        s.text(t)
    s.ask('알맞은 것', answer_space=14)
    ans = ('5~6차시  ① 3·3·2·2·3·3 cm, 80·80·100·100°, 대응변, 대응각   ② %s, 수직, 같습니다   ③ %s   ④ %s / %s'
           '   ⑤ %s / ㉠, ㉡, ㉢' % (' / '.join(a1), ', '.join(a2), w1, o4, w2))
    if lv == '도전형':
        step(s, 5, '도전하기', '비스듬한 대칭축 · 수학익힘')
        s.text('⑴ 대칭축이 비스듬히 놓여 있어요. 각 점에서 대칭축에 수선을 그어 점 ㄷ, ㄴ의 대응점 ㅁ, ㅂ을 찾아 선대칭도형을 완성해 보세요.')
        pic(s, 'c56c0')
        w3 = want_txt(SRC_TB, 'c56c', {'ㅁ': 'ㄷ', 'ㅂ': 'ㄴ'})
        s.text('⑵ 직선 ㄱㄴ을 대칭축으로 하는 선대칭도형의 반쪽이에요.')
        pic(s, 'half', 42)
        H0 = P['HALF0']
        sides = [dist(H0[0], H0[1]), dist(H0[1], H0[2]), dist(H0[2], H0[3])]
        assert [round(v, 6) for v in sides] == [6, 11, 9], sides
        b = qa(s, [('선대칭도형을 완성했을 때 둘레', (6 + 11 + 9) * 2, ' cm'),
                   ('대응점끼리 이은 선분과 대칭축이 만나는 점까지의 거리가 4 cm일 때 두 대응점 사이의 거리', 8, ' cm')])
        why(s, '둘레를 구한 방법을 써 보세요.', 1)
        ans += '   ⑥ %s / %s((6+11+9)×2), %s(4×2)' % (w3, b[0], b[1])
    return ans


def tb7(s, lv):
    S, D = load(SRC_TB)
    P, KD = D['pt'], D['kind']
    s.lesson(7, '개념 구축하기(O)', '점대칭도형을 알아볼까요', '어떤 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치는 도형에는 어떤 특징이 있을까요?')
    s.scene(None, '미술관 천장에 있는 글자 작품이에요. 다윤이가 “글자 작품 ‘ㄹ’에는 지금까지 보았던 작품들과는 다른 특징이 있는 것 같아.”라고 했어요.')
    step(s, 0, '만져 보기', '글자 ㄹ을 180° 돌리기')
    pic(s, 'glyph_r', 55)
    assert KD['glyphR']
    s.text('글자를 투명 종이에 본떠 그리고, 연필 끝으로 점 ㅇ을 누른 채 180° 돌려 보세요.')
    s.choices([('점 ㅇ을 중심으로 글자 ‘ㄹ’을 180° 돌리면 처음 글자와', opt('완전히 겹쳐요', '겹치지 않아요'))])
    step(s, 1, '그려 보기', '90°, 180° 돌려 보기')
    s.text('점 ㅇ을 중심으로 도형을 90°, 180° 돌려 보고, 처음 도형과 완전히 겹치면 ○, 겹치지 않으면 ×를 써 보세요.')
    pic(s, 'spin3', 150)
    sp = KD['spin3']
    assert all(v == [False, True] for v in sp.values()), sp
    s.table([['', '가', '나', '다'], ['90° 돌렸을 때', '', '', ''], ['180° 돌렸을 때', '', '', '']],
            header=True, header_col=True, col_mm=[54, 42, 42, 42], row_h=3402)
    s.fill('세 도형은 모두 점 ㅇ을 중심으로 %s 돌렸을 때 처음 도형과 완전히 겹쳐요.' % ch(lv, ['90°', '180°', '270°']))
    step(s, 2, '약속하기', '점대칭도형과 대칭의 중심')
    s.fill(['한 도형을 어떤 점을 중심으로 %s 돌렸을 때 처음 도형과 완전히 겹치면 이 도형을 %s이라고 합니다.'
            % (ch(lv, ['90°', '180°', '360°'], 8), ch(lv, ['점대칭도형', '선대칭도형'])),
            '이때 그 점을 %s이라고 합니다. 대칭의 중심을 중심으로 180° 돌렸을 때 겹치는 점을 대응점, 겹치는 변을 대응변, 겹치는 각을 대응각이라고 합니다.'
            % ch(lv, ['대칭의 중심', '대칭축', '꼭짓점'])])
    step(s, 3, '말해 보기', '점대칭도형 찾기')
    pic(s, 'spin5', 172)
    a3 = kinds_of(KD['spin5'], 'P')
    assert a3 == ['가', '라', '마'], a3
    if lv == '기본형':
        s.text('도움: 도형의 한가운데에 있는 점을 중심으로 180° 돌려 봐요.')
    s.ask('점대칭도형을 모두 찾아 기호를 써 보세요.', answer_space=14)
    s.choices([('점대칭도형인지 알아보려면 대칭의 중심을 중심으로', optn('180° 돌렸을 때', '반으로 접었을 때'))])
    step(s, 4, '확인하기', '대응점·대응변·대응각')
    s.text('점 ㅇ을 대칭의 중심으로 하는 점대칭도형이에요. 180° 돌렸을 때 겹치는 대응점, 대응변, 대응각을 써 보세요.')
    pic(s, 'hp_c', 70)
    Hp = named(P['HP'], 'ㄱㄴㄷㄹㅁㅂ')
    mp = vmap(Hp, Hp, rot180(P['HPC']))
    a4 = corr(s, lv, mp, [('점', ['ㄱ', 'ㄴ', 'ㄷ']), ('변', ['ㄱㄴ', 'ㄴㄷ', 'ㄷㄹ']), ('각', ['ㄱㄴㄷ', 'ㄴㄷㄹ', 'ㄷㄹㅁ'])])
    ans = ('7차시  ① 완전히 겹쳐요   ② 가·나·다 모두 90° ×, 180° ○ / 180°   ③ 180°, 점대칭도형, 대칭의 중심   ④ %s, 180° 돌렸을 때   ⑤ %s'
           % (', '.join(a3), ', '.join(a4)))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 ― 글자 모양')
        pic(s, 'glyphs', 170)
        g = KD['glyphs']
        p1, p2 = kinds_of(g, 'P'), kinds_of(g, 'B')
        assert p1 == ['ㄹ', 'ㅁ', 'ㅍ', 'S'] and p2 == ['ㅁ', 'ㅍ'], (p1, p2)
        s.ask('⑴ 점대칭도형 모양인 글자를 모두 써 보세요.', answer_space=14)
        s.ask('⑵ 점대칭도형이면서 선대칭도형 모양인 글자를 모두 써 보세요.', answer_space=10)
        why(s, '⑶ 글자 ‘ㄱ’이 점대칭도형이 아닌 까닭을 써 보세요.', 1)
        ans += '   ⑥ ⑴ %s ⑵ %s ⑶ 어떤 점을 중심으로 180° 돌려도 처음 도형과 완전히 겹치지 않기 때문' % (', '.join(p1), ', '.join(p2))
    return ans


def hp_check(P):
    """점대칭 육각형 SY3_HP: 변 1·2·2.5 cm, 각 145°·140°·75°"""
    H = named(P['HP'], 'ㄱㄴㄷㄹㅁㅂ')
    names = 'ㄱㄴㄷㄹㅁㅂ'
    L = [dist(H[names[i]], H[names[(i + 1) % 6]]) for i in range(6)]
    for v, w in zip(L, [1, 2, 2.5, 1, 2, 2.5]):
        near(v, w, 1e-3)
    G = [ang(H[names[i]], H[names[i - 1]], H[names[(i + 1) % 6]]) for i in range(6)]   # 각 ㅂㄱㄴ, ㄱㄴㄷ, …
    for v, w in zip(G, [75, 145, 140, 75, 145, 140]):
        near(v, w, .05)
    return H


def tb89(s, lv):
    S, D = load(SRC_TB)
    P, KD = D['pt'], D['kind']
    s.lesson('8~9', '개념 구축하기(O)', '점대칭도형의 성질을 알아볼까요', '점대칭도형에는 어떤 성질이 있고, 그 성질을 이용하여 점대칭도형을 어떻게 완성할 수 있을까요?')
    s.scene(None, '미술관 복도에 점대칭도형 작품이 걸려 있어요.')
    step(s, 0, '재어 보기', '대응변의 길이와 대응각의 크기(실제 크기)')
    s.text('점 ㅇ을 대칭의 중심으로 하는 점대칭도형이에요. 그림은 실제 크기예요. 자와 각도기로 재어 보세요.')
    pic(s, 'hp_c')
    H = hp_check(P)
    measure_table(s, ['변 ㄱㄴ', '변 ㄹㅁ', '변 ㄴㄷ', '변 ㅁㅂ', '변 ㄷㄹ', '변 ㅂㄱ'], ' cm')
    measure_table(s, ['각 ㄱㄴㄷ', '각 ㄹㅁㅂ', '각 ㄴㄷㄹ', '각 ㅁㅂㄱ', '각 ㄷㄹㅁ', '각 ㅂㄱㄴ'], '°')
    o3 = ['대응점', '대응변', '대응각']
    s.fill('점대칭도형은 %s의 길이와 %s의 크기가 각각 같습니다.' % (ch(lv, o3), ch(lv, o3)))
    step(s, 1, '대칭의 중심 찾기', '대응점끼리 이어 보기(실제 크기)')
    s.text('대칭의 중심이 표시되지 않은 점대칭도형이에요. 대응점끼리 각각 선분으로 이어 보세요(점 ㄱ과 점 ㄹ, 점 ㄴ과 점 ㅁ, 점 ㄷ과 점 ㅂ). '
           '세 선분이 만나는 점을 점 ㅇ으로 표시하고, 점 ㅇ까지의 길이를 재어 보세요.')
    pic(s, 'hp')
    O = P['HPC']
    seg = [dist(H[n], O) for n in 'ㄱㄹㄴㅁㄷㅂ']
    for i in range(0, 6, 2):
        near(seg[i], seg[i + 1], 1e-3)
    measure_table(s, ['선분 ㄱㅇ', '선분 ㄹㅇ', '선분 ㄴㅇ', '선분 ㅁㅇ', '선분 ㄷㅇ', '선분 ㅂㅇ'], ' cm')
    s.fill(['선분 ㄱㅇ과 선분 ㄹㅇ, 선분 ㄴㅇ과 선분 ㅁㅇ, 선분 ㄷㅇ과 선분 ㅂㅇ의 길이는 각각 %s.' % ch(lv, ['같아요', '달라요']),
            '점대칭도형에서 대칭의 중심은 대응점끼리 이은 선분을 %s 나눕니다.' % ch(lv, ['똑같이 둘로', '셋으로', '직각으로'])])
    segt = '선분 ㄱㅇ=ㄹㅇ 약 %s cm, ㄴㅇ=ㅁㅇ 약 %s cm, ㄷㅇ=ㅂㅇ 약 %s cm' % (cm(seg[0]), cm(seg[2]), cm(seg[4]))
    step(s, 2, '구해 보기', '점대칭도형의 선분과 각')
    s.text('두 도형은 모두 점 ㅇ을 대칭의 중심으로 하는 점대칭도형이에요. 오른쪽 도형에서 선분 ㄴㅁ은 26 cm, 선분 ㄷㅇ은 10 cm예요.')
    pic(s, 'p89', 150)
    Lp, Rp = P['P89L'], P['P89R']
    near(dist(Lp[0], Lp[1]) / .2, 14, .02)
    near(dist(Lp[3], Lp[4]) / .2, 14, .02)
    near(ang(Lp[0], Lp[5], Lp[1]), 100, .1)
    near(ang(Lp[3], Lp[2], Lp[4]), 100, .1)
    cR = (sum(p[0] for p in Rp) / 6, sum(p[1] for p in Rp) / 6)
    near(dist(Rp[1], Rp[4]) / .2, 26, .02)
    near(dist(Rp[2], cR) / .2, 10, .02)
    a2 = qa(s, [('왼쪽 도형: 선분 ㄹㅁ의 길이', 14, ' cm'), ('왼쪽 도형: 각 ㄷㄹㅁ의 크기', 100, '°'),
                ('오른쪽 도형: 선분 ㄴㅇ의 길이', 26 // 2, ' cm'), ('오른쪽 도형: 선분 ㄷㅂ의 길이', 10 * 2, ' cm')])
    step(s, 3, '완성 방법 찾기', '점대칭도형 완성하기(실제 크기)')
    s.text('점 ㅇ을 대칭의 중심으로 하는 점대칭도형의 일부예요. 점 ㄴ과 점 ㄷ의 대응점을 찾아 각각 점 ㅁ과 점 ㅂ으로 표시하고, '
           '점 ㄱ, 점 ㅂ, 점 ㅁ, 점 ㄹ을 차례대로 이어 점대칭도형을 완성해 보세요.')
    if lv == '기본형':
        s.text('도움: 흐린 점선은 각 점과 대칭의 중심을 지나는 직선이에요. 점 ㅇ까지 가로·세로로 몇 칸인지 세어, 점 ㅇ을 지나 같은 만큼 더 가요.')
    pic(s, 'c89a1' if lv == '기본형' else 'c89a0')
    w1 = want_txt(SRC_TB, 'c89a', {'ㅁ': 'ㄴ', 'ㅂ': 'ㄷ'})
    o4 = order_q(s, lv, ['가. 각 점에서 대칭의 중심까지의 거리가 같도록 대응점을 찾아 표시합니다.', '나. 각 점을 차례대로 이어 점대칭도형을 완성합니다.',
                         '다. 각 점에서 대칭의 중심을 지나는 직선을 긋습니다.'], [2, 0, 1], '점대칭도형을 완성하는 방법을')
    step(s, 4, '확인하기', '바람개비 모양(실제 크기)')
    s.text('점 ㅈ을 대칭의 중심으로 하는 점대칭도형의 일부예요. 점 ㄴ, ㄷ, ㄹ의 대응점을 찾아 각각 점 ㅂ, ㅅ, ㅇ으로 표시하고 점대칭도형을 완성해 보세요.')
    pic(s, 'c89b1' if lv == '기본형' else 'c89b0')
    w2 = want_txt(SRC_TB, 'c89b', {'ㅂ': 'ㄴ', 'ㅅ': 'ㄷ', 'ㅇ': 'ㄹ'})
    s.ask('완성한 도형이 점대칭도형인지 확인하는 방법으로 알맞은 것을 모두 골라 기호를 써 보세요.', blank=False)
    for t in ['㉠ 대칭의 중심을 중심으로 180° 돌렸을 때 완전히 겹치는지 알아봐요.', '㉡ 대응변의 길이와 대응각의 크기가 각각 같은지 알아봐요.',
              '㉢ 대응점끼리 이은 선분이 대칭의 중심에서 똑같이 둘로 나뉘는지 알아봐요.', '㉣ 대칭의 중심을 지나는 직선을 따라 접었을 때 겹치는지 알아봐요.']:
        s.text(t)
    s.ask('알맞은 것', answer_space=14)
    ans = ('8~9차시  ① 1·1·2·2·2.5·2.5 cm, 145·145·140·140·75·75°, 대응변, 대응각   ② %s, 같아요, 똑같이 둘로   ③ %s   ④ %s / %s'
           '   ⑤ %s(점 ㄱ의 대응점은 점 ㅁ) / ㉠, ㉡, ㉢' % (segt, ', '.join(a2), w1, o4, w2))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 · 펜토미노')
        s.text('⑴ 점 ㅇ을 대칭의 중심으로 하는 점대칭도형이에요.')
        pic(s, 'p115', 62)
        Q = named(P['P115'], 'ㄱㄴㄷㄹㅁㅂ')
        near(dist(Q['ㄹ'], Q['ㅁ']) / .38, 8, .02)
        near(dist(Q['ㄱ'], Q['ㄴ']) / .38, 8, .02)
        near(ang(Q['ㄷ'], Q['ㄴ'], Q['ㄹ']), 115, .1)
        near(ang(Q['ㅂ'], Q['ㄱ'], Q['ㅁ']), 115, .1)
        mq = vmap(Q, Q, rot180((sum(p[0] for p in Q.values()) / 6, sum(p[1] for p in Q.values()) / 6)))
        b1 = qa(s, [('변 ㄱㄴ의 대응변과 길이', '변 %s%s, 8 cm' % (mq['ㄱ'], mq['ㄴ'])),
                    ('각 ㄱㅂㅁ의 대응각과 크기', '각 %s%s%s, 115°' % (mq['ㄱ'], mq['ㅂ'], mq['ㅁ']))], col=(100, 80))
        s.text('⑵ 점 ㅈ을 대칭의 중심으로 하는 점대칭도형의 둘레가 58 cm예요.')
        pic(s, 'oct', 62)
        Oc = P['OCT']
        L8 = [dist(Oc[i], Oc[(i + 1) % 8]) / .32 for i in range(8)]
        assert [round(v, 2) for v in L8] == [7, 11, 5, 6, 7, 11, 5, 6], L8
        rest = 58 - (7 + 11 + 5) * 2
        b2 = qa(s, [('변 ㄹㅁ과 변 ㅇㄱ의 길이의 합', rest, ' cm'), ('변 ㄹㅁ의 길이', rest // 2, ' cm')])
        assert rest == 12 and round(L8[3]) == 6
        s.text('⑶ 펜토미노 조각을 대칭의 종류로 나누어 보세요.')
        pic(s, 'pento', 165)
        pk = KD['pento']
        grp = {k: [c for c, v in pk.items() if v == k] for k in 'LPBN'}
        assert grp == {'L': list('TUVW'), 'P': ['Z'], 'B': ['I', 'X'], 'N': list('FLNPY')}, grp
        s.table([[KIND[k] for k in 'LPBN'], ['', '', '', '']], header=True, col_mm=[45] * 4, row_h=4536)
        ans += '   ⑥ ⑴ %s ⑵ %s(58−(7+11+5)×2), %s ⑶ %s' % (' / '.join(b1), b2[0], b2[1],
                                                         ' / '.join('%s: %s' % (KIND[k], ', '.join(grp[k])) for k in 'LPBN'))
    return ans


def tb10(s, lv):
    S, D = load(SRC_TB)
    KD = D['kind']
    s.lesson(10, '탐구 정리하기(O)', '생각을 더하다 ― 자연 속 선대칭도형을 그려 볼까요', '자연 속 선대칭도형 모양을 어떻게 그릴 수 있을까요?')
    s.scene(None, ['교과서에서는 공학 도구 ‘알지오매스 키즈’(xcms.kr/dtJaL2W)로 선대칭도형을 그려요.',
                   '이 활동지에서는 모눈 위에 대칭축을 긋고, 한쪽에 선분을 그은 다음 뒤집은 대응변을 그려요.'])
    step(s, 0, '도구 익히기', '나뭇잎 모양 선대칭도형')
    s.text('빨간 점선이 대칭축이에요. 파란 선분 3개를 대칭축에 대하여 뒤집은 대응변을 그어 나뭇잎 모양 선대칭도형을 완성해 보세요.')
    pic(s, 'mirror', 110)
    M = D['mirror']
    assert [tuple(p) for p in (M[0][1], M[1][1])] == [(9, 3), (10, 6)], M      # 파란 선분의 꺾인 점 (3,3)·(2,6) → 대칭축 x = 6의 반대쪽
    mtxt = '파란 선분의 꺾인 두 점과 같은 높이에서 대칭축 오른쪽으로 각각 3칸, 4칸 떨어진 곳에 점을 찍고, 대칭축 위의 두 끝점과 차례로 이어요'
    o1 = order_q(s, lv, ['가. 선분과 대칭축을 차례대로 골라 뒤집어 대응변을 만들어요.', '나. 대칭축으로 할 직선을 그어요.',
                         '다. 이것을 되풀이하여 선대칭도형을 완성해요.', '라. 대칭축의 한쪽에 선분을 그어요.'], [1, 3, 0, 2], '선대칭도형을 그리는')
    step(s, 1, '대칭축 긋기', '나비, 도토리, 코스모스')
    s.text('선대칭도형 모양인 동물과 식물이에요. 각각 대칭축을 그어 보세요.')
    pic(s, 'pics', 140)
    na = dict(KD['pics'])
    assert na == {'나비': 1, '도토리': 1, '코스모스': 8}, na
    if lv == '기본형':
        s.choices([('나비와 도토리의 대칭축은', opt('1개', '2개')), ('꽃잎이 8장인 코스모스의 대칭축은', opt('1개', '여러 개'))])
    else:
        a1 = qa(s, [('나비와 도토리의 대칭축의 수', 1, '개'), ('꽃잎이 8장인 코스모스의 대칭축의 수', 8, '개')])
    step(s, 2, '그리기', '내가 찾은 선대칭도형 그리기')
    s.text('주변에서 찾은 선대칭도형 모양인 동물이나 식물을 그려 보세요. 대칭축의 한쪽에 선분을 6개 이상 긋고, 대칭축에 대하여 뒤집은 대응변을 그어요. '
           '곡선은 짧은 선분 여러 개로 나타내요.')
    pic(s, 'blank', 118)
    if lv == '기본형':
        s.text('자로 대응변 두 쌍의 길이를 재어 써 보세요.')
        s.table([['', '선분', '대응변'], ['첫째 쌍', '(      ) cm', '(      ) cm'], ['둘째 쌍', '(      ) cm', '(      ) cm']],
                header=True, header_col=True, col_mm=[40, 70, 70], row_h=3402)
    s.choices([('내가 그린 선대칭도형에서 대응변의 길이는', opt('같아요', '달라요')), ('대응각의 크기는', opt('같아요', '달라요')),
               ('자연물의 곡선은', optn('짧은 선분 여러 개로 나타냈어요', '점 하나로 나타냈어요'))])
    step(s, 3, '말해 보기', '내 그림 설명하기')
    write_pane(s, lv, [('그린 방법', '________ 을 그렸어요. 대칭축을 긋고, ______________________'),
                       ('성질', '대칭축을 따라 접으면 ____________, 대응변의 길이가 ________.')])
    step(s, 4, '확인하기', '선대칭도형을 그리는 방법')
    s.choices([('대칭축의 한쪽에 그은 선분의 대응변을 만들려면 어떤 도구를 써야 할까요?', opt('직선', '선분', '뒤집기')),
               ('나비 날개처럼 둥근 부분은', optn('짧은 선분 여러 개로 이어 그려요', '대칭축을 여러 개 그어요')),
               ('선대칭도형 모양인 것', optn('나비', '달팽이 껍데기', '구불구불한 강'))])
    ans = ('10차시  ① %s / %s   ② %s   ③ (자유) 같아요, 같아요, 짧은 선분 여러 개로   ④ (자유)'
           '   ⑤ 뒤집기, 짧은 선분 여러 개로 이어 그려요, 나비' % (mtxt, o1, '1개, 여러 개(8개: 꽃잎 끝을 지나는 직선 4개, 꽃잎 사이를 지나는 직선 4개)' if lv == '기본형' else ', '.join(a1) + ' 8개 — 꽃잎 끝을 지나는 직선 4개, 꽃잎 사이를 지나는 직선 4개'))
    if lv == '도전형':
        step(s, 5, '도전하기', '단풍잎 모양 완성하기(실제 크기)')
        s.text('단풍잎의 반쪽이 그려져 있어요. 세로 대칭축을 기준으로 점 ㄴ, ㄷ, ㄹ, ㅁ, ㅂ의 대응점을 찾아 각각 점 ㅇ, ㅈ, ㅊ, ㅋ, ㅌ으로 표시하고 '
               '단풍잎 모양 선대칭도형을 완성해 보세요.')
        pic(s, 'c10')
        ans += '   ⑥ %s' % want_txt(SRC_TB, 'c10', {'ㅇ': 'ㄴ', 'ㅈ': 'ㄷ', 'ㅊ': 'ㄹ', 'ㅋ': 'ㅁ', 'ㅌ': 'ㅂ'})
    return ans


def tb11(s, lv):
    S, D = load(SRC_TB)
    KD = D['kind']
    s.lesson(11, '발표하기(P)', '놀이를 더하다 ― 카드를 없애는 완벽한 방법', '도형 카드의 대칭의 종류를 빠르게 판단하여 카드를 먼저 모두 없애려면 어떻게 해야 할까요?')
    s.scene(None, '‘카드를 없애는 완벽한 방법’ 놀이를 해요. 3명이 카드를 5장씩 나누어 갖고, 내용이 보이도록 놓은 카드와 같은 종류의 대칭인 카드를 내려놓으며 어떤 도형인지 외쳐요.')
    step(s, 0, '카드 살펴보기', '대칭의 종류로 나누기')
    pic(s, 'cards8', 120)
    k8 = KD['cards8']
    grp = {k: [c for c, v in k8.items() if v == k] for k in 'LPBN'}
    assert all(len(v) == 2 for v in grp.values()), grp
    if lv == '기본형':
        s.text('도움: 먼저 접어서 겹치는 직선이 있는지, 다음으로 180° 돌려서 겹치는지 생각해요.')
    s.text('카드의 번호를 알맞은 칸에 써 보세요.')
    s.table([[KIND[k] for k in 'LPBN'], ['', '', '', '']], header=True, col_mm=[45] * 4, row_h=4536)
    step(s, 1, '규칙 알기', '놀이 규칙')
    s.text('특별 카드: ① 다음 차례의 친구에게 쌓아 둔 카드에서 2장 선물 · ② 놀이 진행 순서 바꾸기 · ③ 내용이 보이도록 놓은 카드 바꾸기')
    s.choices([('내려놓을 카드가 없으면', optn('뒤집어 쌓아 둔 카드에서 한 장을 가져와요', '아무 카드나 내려놓아요')),
               ('가지고 있는 카드가 한 장 남으면 외치는 말', opt('대칭!', '합동!', '끝!')),
               ('선대칭도형이면서 점대칭도형인 카드는', optn('선대칭도형일 때만 낼 수 있어요', '어느 쪽일 때도 낼 수 있어요'))])
    pic(s, 'rule', 60)
    assert KD['rule'] == ['B', 'P']
    s.choices([('보이는 카드가 직사각형일 때 평행사변형 카드는', optn('“점대칭도형!” 하고 낼 수 있어요', '“선대칭도형!” 하고 낼 수 있어요', '낼 수 없어요'))])
    step(s, 2, '놀이하기', '놀이 기록표')
    s.text('친구 2명과 놀이를 해 보세요. 내 차례마다 보이는 카드, 내가 낸 카드, 외친 말을 기록해요.')
    s.table([['차례', '보이는 카드(대칭의 종류)', '내가 낸 카드', '외친 말']] + [[str(i), '', '', ''] for i in range(1, 6)],
            header=True, col_mm=[18, 62, 50, 50], row_h=3402)
    step(s, 3, '전략 말하기', '놀이를 하며 생각한 것')
    write_pane(s, lv, [('전략', '놀이에서 이기려면 ______________________________________'),
                       ('주의할 점', '놀이할 때 ______________________________________')])
    step(s, 4, '확인하기', '놀이 상황')
    pic(s, 'play', 110)
    pl = KD['play']
    sym = {'L': {'L'}, 'P': {'P'}, 'B': {'L', 'P'}, 'N': {'N'}}
    can = [k for k in '가나다' if sym[pl[k]] & sym[pl['보이는 카드']]]
    assert pl['보이는 카드'] == 'L' and can == ['가', '다'], (pl, can)
    s.ask('보이는 카드가 이등변삼각형(선대칭도형)이에요. 낼 수 있는 카드를 모두 골라 기호를 써 보세요.', answer_space=10)
    s.choices([('보이는 카드가 평행사변형일 때 원 카드를 내며 외칠 말', opt('선대칭도형!', '점대칭도형!', '둘 다 아닌 도형!'))])
    ans = ('11차시  ① %s   ② 한 장을 가져와요, 대칭!, 어느 쪽일 때도 낼 수 있어요, “점대칭도형!” 하고 낼 수 있어요   ③ (놀이 기록)   ④ (자유) 예) 둘 다인 카드는 아껴 두었다가 낼 카드가 없을 때 내요'
           '   ⑤ %s, 점대칭도형!' % (' / '.join('%s: %s' % (KIND[k], ', '.join(grp[k])) for k in 'LPBN'), ', '.join(can)))
    if lv == '도전형':
        step(s, 5, '도전하기', '짝 맞추기 기억 놀이')
        s.text('또 다른 놀이 방법이에요. 카드 2장을 펼쳐 대칭의 종류가 같으면 가져가요. 먼저 카드 12장을 대칭의 종류가 같은 것끼리 세 묶음으로 나누어 번호를 써 보세요.')
        pic(s, 'mem', 165)
        mem = KD['mem']
        assert all(a == b for _, a, b in mem)
        g3 = {k: [n for n, a, _ in mem if a == k] for k in 'LPN'}
        assert all(len(v) == 4 for v in g3.values())
        s.labeled([('선대칭도형', ''), ('점대칭도형', ''), ('둘 다 아닌 도형', '')], label_mm=40)
        why(s, '짝을 빨리 찾으려면 어떻게 하면 좋을지 써 보세요.', 1)
        ans += '   ⑥ 선대칭도형 %s / 점대칭도형 %s / 둘 다 아닌 도형 %s' % tuple(', '.join(g3[k]) for k in 'LPN')
    return ans


def tb12(s, lv):
    S, D = load(SRC_TB)
    P, K, KD = D['pt'], D['ckey'], D['kind']
    s.lesson(12, '발표하기(P)', '공부한 내용을 확인해요', '합동과 대칭에 대해 공부한 내용을 정리하고 문제를 해결할 수 있을까요?')
    s.scene(None, '미술관 나들이에서 공부한 합동, 선대칭도형, 점대칭도형을 정리해요.')
    step(s, 0, '합동', '1번, 2번 문제')
    pic(s, 'pick12', 150)
    fit = [k for k in '나다라' if K['pick12'][k] == K['pick12']['가']]
    assert fit == ['다'], fit
    s.ask('1. 도형 가와 합동인 도형을 찾아 기호를 써 보세요.')
    s.text('2. 두 사각형은 서로 합동이에요.')
    pic(s, 'quad12', 115)
    A, B = P['Q12']
    mp = vmap(named(A, 'ㄱㄴㄷㄹ'), named(B, 'ㅁㅂㅅㅇ'), [-1, 0, 0, -1, 15, 5])
    if lv == '기본형':
        s.text('도움: 대응변과 대응각은 대응점의 순서대로 읽어요. 점 ㄱ의 대응점은 점 %s이에요.' % mp['ㄱ'])
    a1 = qa(s, [('변 ㄱㄴ의 대응변', '변 ' + mp['ㄱ'] + mp['ㄴ']), ('각 ㄴㄷㄹ의 대응각', '각 ' + mp['ㄴ'] + mp['ㄷ'] + mp['ㄹ'])])
    step(s, 1, '대칭축', '3번 문제')
    s.text('3. 선대칭도형의 대칭축을 모두 찾아 긋고, 대칭축의 수가 많은 것부터 차례대로 기호를 써 보세요.')
    pic(s, 'ax12', 140)
    n3 = KD['ax12']
    order = sorted(n3, key=lambda k: -n3[k])
    assert n3 == {'가': 1, '나': 2, '다': 6} and order == ['다', '나', '가'], n3
    s.table([['도형', '가', '나', '다'], ['대칭축의 수', '(    )개', '(    )개', '(    )개']], header=True, header_col=True,
            col_mm=[45, 45, 45, 45], row_h=3402)
    s.ask('대칭축의 수가 많은 것부터:   (     ) → (     ) → (     )', blank=False)
    step(s, 2, '완성하기', '4번 문제(실제 크기)')
    s.text('4. ⑴ 선대칭도형을 완성해 보세요(점 ㄷ, ㄴ의 대응점 ㅁ, ㅂ).')
    pic(s, 'c12a1' if lv == '기본형' else 'c12a0')
    s.text('⑵ 점 ㅇ을 대칭의 중심으로 하는 점대칭도형을 완성해 보세요(점 ㄴ, ㄷ의 대응점 ㅁ, ㅂ).')
    pic(s, 'c12b1' if lv == '기본형' else 'c12b0')
    w1 = want_txt(SRC_TB, 'c12a', {'ㅁ': 'ㄷ', 'ㅂ': 'ㄴ'})
    w2 = want_txt(SRC_TB, 'c12b', {'ㅁ': 'ㄴ', 'ㅂ': 'ㄷ'})
    step(s, 3, '둘레·표지판', '5번, 6번 문제')
    s.text('5. 점 ㅇ을 대칭의 중심으로 하는 점대칭도형의 둘레를 구해 보세요.')
    pic(s, 'hex30', 52)
    Hx = named(P['HEX30'], 'ㄱㄴㄷㄹㅁㅂ')
    sd = {w: dist(Hx[w[0]], Hx[w[1]]) / .42 for w in ['ㄱㄴ', 'ㄴㄷ', 'ㄷㄹ', 'ㄹㅁ', 'ㅁㅂ', 'ㅂㄱ']}
    assert {k: round(v, 2) for k, v in sd.items()} == {'ㄱㄴ': 3, 'ㄴㄷ': 5, 'ㄷㄹ': 7, 'ㄹㅁ': 3, 'ㅁㅂ': 5, 'ㅂㄱ': 7}, sd
    a5 = qa(s, [('변 ㄴㄷ의 길이', 5, ' cm'), ('변 ㄹㅁ의 길이', 3, ' cm'), ('변 ㅂㄱ의 길이', 7, ' cm'), ('점대칭도형의 둘레', (5 + 3 + 7) * 2, ' cm')])
    s.text('6. 교통안전 체험관의 표지판을 대칭의 종류로 나누어 보세요.')
    pic(s, 'signs', 130)
    sg = KD['signs']
    l6, p6, b6 = kinds_of(sg, 'L'), kinds_of(sg, 'P'), kinds_of(sg, 'B')
    assert (l6, p6, b6) == (['가', '나', '마'], ['라', '마'], ['마']), (l6, p6, b6)
    qa(s, [('선대칭도형 모양인 표지판', ''), ('점대칭도형 모양인 표지판', ''), ('선대칭도형이면서 점대칭도형 모양인 표지판', '')], col=(110, 70))
    step(s, 4, '확인하고 정리해요', '배운 내용 정리')
    s.fill('1. 모양과 크기가 같아서 포개었을 때 완전히 겹치는 두 도형을 서로 %s이라고 해요.' % ch(lv, ['합동', '대칭']))
    s.text('2. 서로 합동인 두 도형은 대응변의 길이가 같아요.')
    pic(s, 'sum2', 80)
    A2, B2 = P['SUM2A'], P['SUM2B']
    near(dist(A2[1], A2[2]), dist(B2[1], B2[2]))
    b2 = qa(s, [('□ 안에 알맞은 수', 6, ' cm')])
    s.fill('3. 한 직선을 따라 접었을 때 완전히 겹치는 도형을 %s이라고 해요.' % ch(lv, ['선대칭도형', '점대칭도형']))
    s.text('4. 선대칭도형은 대응각의 크기가 같아요.')
    pic(s, 'dart', 48)
    Dt = P['DART']
    near(ang(Dt[5], Dt[0], Dt[4]), 60, .05)
    near(ang(Dt[1], Dt[2], Dt[0]), 60, .05)
    b4 = qa(s, [('□ 안에 알맞은 수', 60, '°')])
    s.fill('5. 한 도형을 어떤 점을 중심으로 180° 돌렸을 때 처음 도형과 완전히 겹치면 이 도형을 %s이라고 해요.' % ch(lv, ['선대칭도형', '점대칭도형']))
    s.text('6. 점대칭도형에서 대칭의 중심은 대응점끼리 이은 선분을 똑같이 둘로 나눠요.')
    pic(s, 'sum6', 75)
    Q6 = P['SUM6']
    near(dist(Q6['O'], Q6['B']), dist(Q6['O'], Q6['D']))
    b6_ = qa(s, [('□ 안에 알맞은 수', 2, ' cm')])
    ans = ('12차시  ① 다 / %s   ② 가 1개, 나 2개, 다 6개 → 다 → 나 → 가   ③ ⑴ %s ⑵ %s   ④ %s / 선대칭 %s, 점대칭 %s, 둘 다 %s'
           '   ⑤ 합동, %s, 선대칭도형, %s, 점대칭도형, %s' % (', '.join(a1), w1, w2, ', '.join(a5), ', '.join(l6), ', '.join(p6), ', '.join(b6),
                                                     b2[0], b4[0], b6_[0]))
    if lv == '도전형':
        step(s, 5, '도전하기', '대칭축이 2개인 도형 완성하기(실제 크기)')
        s.text('가로 대칭축과 세로 대칭축이 있는 선대칭도형이면서, 두 대칭축이 만나는 점을 대칭의 중심으로 하는 점대칭도형이에요. '
               '그려진 부분을 보고 나머지 대응점 ㅁ, ㅂ, ㅅ, ㅇ, ㅈ, ㅊ, ㅋ, ㅌ을 모두 찾아 점 ㄱ부터 차례대로 이어 도형을 완성해 보세요.')
        pic(s, 'c12d0')
        assert KD['double'] == 'B:2', KD['double']
        s.text('도움말: 세로 대칭축 → 점 ㅁ, ㅂ, ㅅ / 대칭의 중심 → 점 ㅇ, ㅈ / 가로 대칭축 → 점 ㅊ, ㅋ, ㅌ')
        c2 = qa(s, [('완성한 도형의 대칭축의 수', 2, '개')])
        why(s, '점 ㅇ을 찾은 방법을 써 보세요.', 1)
        ans += '   ⑥ %s, %s' % (want_txt(SRC_TB, 'c12d', {'ㅁ': 'ㄴ', 'ㅂ': 'ㄷ', 'ㅅ': 'ㄹ', 'ㅇ': 'ㄷ', 'ㅈ': 'ㄴ', 'ㅊ': 'ㄱ', 'ㅋ': 'ㄴ', 'ㅌ': 'ㄷ'}), c2[0])
    return ans


TB = [tb1, tb2, tb3, tb4, tb56, tb7, tb89, tb10, tb11, tb12]

# ================================================================ 이야기 버전(st) — '우리 반 대칭 무늬 공방'
# 앱 원본 ../units/sem2/u3-symm.st.js의 LESSONS를 node에서 그대로 읽어(활동 함수 대신 기록하는 함수를 넣어 render를 실행)
# 활동마다 넘긴 설정(도형 좌표·물음·보기·정답 번호·완성할 점)을 모읍니다(CAP). 그래서 활동지의 차시·제목·물음·수가 앱과 같고,
# 원본의 수가 바뀌면 assert가 멈춰 알려 줘요. 그림도 같은 설정으로 그립니다.
ST_JS = r"""
var CAP = (function () {
  var REC = [];
  var rec = w => function (b, a, ...args) { REC.push({ w, args }); };
  var thenWhy = (f, o) => function (b, a) { REC.push({ w: "thenWhy", args: [o] }); return f(b, a); };
  var ruleFirst = (f, o) => function (b, a) { REC.push({ w: "ruleFirst", args: [o] }); return f(b, a); };
  var wonderRecall = f => function (b, a) { REC.push({ w: "wonderRecall", args: [] }); return f(b, a); };
  var sy3Chain = function (b, a, parts) { parts.forEach(p => { if (typeof p === "function") p(b, a); else { REC.push({ w: "title", args: [p.title] }); p.run(b, a); } }); };
  var panes = rec("panes"), quiz = rec("quiz"), blanks = rec("blanks"), sequence = rec("sequence"), writeStep = rec("writeStep");
  var sy3Museum = rec("sy3Museum"), sy3Decal = rec("sy3Decal"), sy3Pick = rec("sy3Pick"), sy3Cut = rec("sy3Cut"), sy3Trace = rec("sy3Trace"), sy3Corr = rec("sy3Corr");
  var sy3Measure = rec("sy3Measure"), sy3Ask = rec("sy3Ask"), sy3Fold = rec("sy3Fold"), sy3Complete = rec("sy3Complete"), sy3Mirror = rec("sy3Mirror"), sy3Spin = rec("sy3Spin");
  var sy3Join = rec("sy3Join"), sy3Sort = rec("sy3Sort"), sy3Uno = rec("sy3Uno"), sy3Memory = rec("sy3Memory");
  var LESSONS;
  const all = fs.readFileSync(process.argv[2], "utf8"), ls = all.slice(all.indexOf("//@@LESSONS"));
  eval(ls.slice(ls.indexOf("const LESSONS")).replace("const LESSONS", "LESSONS"));
  const out = {};
  LESSONS.forEach(L => {
    const steps = L.steps.map(S => { REC = []; S.render(new El("div"), api); return REC; });
    REC = []; L.challenge.render(new El("div"), api);
    out[L.id] = { no: L.no, title: L.title, soop: L.soop, question: L.question, names: L.steps.map(S => S.name), insts: L.steps.map(S => S.inst),
      hints: L.steps.map(S => S.hints), steps, ch: REC, chInst: L.challenge.inst, chHints: L.challenge.hints };
  });
  return out;
})();
function CO(id, st, w, n) { const L = st === "c" ? CAP[id].ch : CAP[id].steps[st]; const r = L.filter(x => x.w === w)[n || 0]; if (!r) throw new Error("앱 원본에 없음: " + id + " " + st + " " + w); return r.args; }
function noLab(o) { return Object.assign({}, o, { segs: [], angs: [], shapes: (o.shapes || []).map(S => S.hideLabel ? Object.assign({}, S, { label: null }) : S) }); }
function capJSON() { return JSON.parse(JSON.stringify(CAP, (k, v) => typeof v === "function" ? undefined : (v instanceof El ? (v.tag === "br" ? "⏎" : "") : v))); }
function CK(shapes) { return Object.fromEntries(shapes.map(S => [S.label, sy3CKey(S.parts || [sy3P(S.P)])])); }
function KD(list) { return Object.fromEntries(list.map(c => [c.label, sy3Kind(c.parts || [sy3P(c.P)])])); }
function NAX(items) { return Object.fromEntries(items.map(it => { const L = sy3SymLines(it.parts); return [it.label, L === Infinity ? -1 : L.length]; })); }
/* 1차시 물감 무늬(활동지에서 정한 물감 자리 — 접는 선 왼쪽 5칸 안) */
var ST_DECAL = [[1, 1, "#E5533D"], [2, 1, "#E5533D"], [3, 2, "#F2B33D"], [1, 3, "#3D8FE5"], [4, 3, "#3D8FE5"], [0, 4, "#5DAA4E"], [2, 5, "#9A5BD6"], [3, 5, "#9A5BD6"]];
/* 11차시 기억 놀이 카드를 섞어 놓는 차례(활동지에서 정함) */
var ST_ORDER = [4, 9, 0, 6, 11, 2, 8, 5, 1, 10, 3, 7];
var ST_MEM = ST_ORDER.map((j, i) => ({ label: String(i + 1), parts: [Object.assign({}, SY3_MEM[j].parts[0], { fill: "#EAF1F8" })], kind: SY3_MEM[j].kind }));
var ST_CPL = { c6a: ["s6", 0, 0], c6b: ["s6", 1, 0], c6d: ["s6", 3, 0], c6x: ["s6", "c", 0], c9a: ["s9", 0, 0], c9b: ["s9", 1, 0], c9d: ["s9", 3, 0], c9x: ["s9", "c", 0], c12a: ["s12", 3, 0], c12b: ["s12", 3, 1] };
function CPL(k) { const [id, st, n] = ST_CPL[k]; return CO(id, st, "sy3Complete", n)[0]; }
function polyKind(o) { const all = Object.assign({}, o.pts, wsWant(o)); return sy3Kind([sy3P(o.poly.map(n => all[n]))]); }
"""

ST_FIGS = {
    # 1차시
    'booth': 'sy3sBooth()',
    'spots': '(() => { const b = new El("div"); sy3Museum(b, api, CO("s1", 1, "sy3Museum")[0]); return b; })()',
    'decal': 'wsDecal(ST_DECAL, 10, 6)',
    'flag_flip': 'CO("s1", 3, "quiz")[0][0].fig()',
    'flag_rot': 'CO("s1", 3, "quiz")[0][1].fig()',
    'perp': 'CO("s1", 4, "quiz")[0][0].fig()',
    'pent': 'CO("s1", 4, "quiz")[0][1].fig()',
    'tiles1': 'wsFig(CO("s1", "c", "sy3Pick")[0], 30)',
    # 2차시
    'badges': 'wsFig(CO("s2", 1, "sy3Trace")[0], 30)',
    'ten2': 'wsFig(CO("s2", 4, "sy3Pick")[0], 28)',
    'hole2': 'wsFig(CO("s2", "c", "sy3Pick", 0)[0], 30)',
    'cut2': 'wsFig(CO("s2", "c", "sy3Pick", 1)[0], 40)',
    # 3차시
    'stamp': 'wsFig(noLab(CO("s3", 0, "sy3Trace")[0]), 34)',
    'tq': 'wsFig(noLab(CO("s3", 2, "sy3Measure")[0]))',
    'q6': 'CO("s3", 3, "sy3Ask")[0][0].fig()',
    'puzzle': 'wsFig(sy3sFigPuzzle(true), 34)',
    'ft': 'wsFig(noLab(CO("s3", "c", "sy3Corr")[0]), 34)',
    'q34': 'CO("s3", "c", "sy3Ask")[0][0].fig()',
    't55': 'CO("s3", "c", "sy3Ask")[0][2].fig()',
    # 4차시
    'win4': 'wsItems(CO("s4", 0, "sy3Fold")[0].items, { k: 18, lines: true })',
    'flags4': 'wsItems(CO("s4", 1, "sy3Fold")[0].items, { k: 26, grid: true })',
    'hl4': 'wsFig(sy3sFigHL(), 40)',
    'pick4': 'wsFig(CO("s4", 4, "sy3Pick")[0], 25)',
    'ax4': 'wsItems(CO("s4", "c", "sy3Fold")[0].items, { k: 30, grid: true })',
    # 5차시
    'hl5': 'wsFig(sy3sFigHL())',
    'grid5': 'wsFig(noLab(CO("s5", 1, "sy3Measure")[0]), 32)',
    'kites': 'CO("s5", 3, "sy3Ask")[0][0].fig()',
    'half5': 'CO("s5", 4, "sy3Ask")[0][0].fig()',
    # 6차시
    'c6a1': 'wsComplete(CPL("c6a"), true)', 'c6a0': 'wsComplete(CPL("c6a"), false)',
    'c6b1': 'wsComplete(CPL("c6b"), true)', 'c6b0': 'wsComplete(CPL("c6b"), false)',
    'mir6': '(() => { const o = CO("s6", 2, "sy3Mirror")[0]; return wsMirror(o.cols, o.rows, o.axis, o.guide, 34); })()',
    'c6d1': 'wsComplete(CPL("c6d"), true)', 'c6d0': 'wsComplete(CPL("c6d"), false)',
    'c6x0': 'wsComplete(CPL("c6x"), false)',
    # 7차시
    'n7': 'wsItems(CO("s7", 0, "sy3Spin")[0].items, { k: 30, center: true })',
    'spin7': 'wsItems(CO("s7", 1, "sy3Spin")[0].items, { k: 28, center: true })',
    'find7': 'wsItems(CO("s7", 3, "sy3Spin")[0].items, { k: 26 })',
    'hp7': 'wsFig(sy3sFigHP({ dots: [SY3S_CEN(SY3S_HPC)] }), 46)',
    'gly7': 'wsFig(CO("s7", "c", "sy3Pick")[0], 15)',
    # 8차시
    'hp8': 'wsFig(sy3sFigHP({ dots: [SY3S_CEN(SY3S_HPC)] }))',
    'hp8n': 'wsFig(sy3sFigHP())',
    'p8': 'CO("s8", 3, "sy3Ask")[0][0].fig()',
    'oct8': 'CO("s8", 4, "sy3Ask")[0][0].fig()',
    'pento8': 'wsCards(CO("s8", "c", "sy3Sort")[0].cards, 6)',
    # 9차시
    'c9a1': 'wsComplete(CPL("c9a"), true)', 'c9a0': 'wsComplete(CPL("c9a"), false)',
    'c9b1': 'wsComplete(CPL("c9b"), true)', 'c9b0': 'wsComplete(CPL("c9b"), false)',
    'c9d1': 'wsComplete(CPL("c9d"), true)', 'c9d0': 'wsComplete(CPL("c9d"), false)',
    'c9x0': 'wsComplete(CPL("c9x"), false)',
    # 10차시
    'mir10': '(() => { const o = CO("s10", 0, "sy3Mirror")[0]; return wsMirror(o.cols, o.rows, o.axisGuide, o.guide, 34); })()',
    'pics10': 'wsPics(24)',
    'blank10': '(() => { const o = CO("s10", 2, "sy3Mirror")[0]; return wsMirror(o.cols, o.rows, [[o.cols / 2, 0], [o.cols / 2, o.rows]], [], 30); })()',
    'cards10': 'wsCards(CO("s10", 3, "sy3Sort")[0].cards, 4)',
    'poly10': 'CO("s10", "c", "quiz")[0][1].fig()',
    # 11차시
    'play11': 'CO("s11", 0, "quiz")[0][0].fig()',
    'cards11': 'wsCards(CO("s11", 1, "sy3Sort")[0].cards, 4)',
    'mem11': 'wsCards(ST_MEM, 6)',
    # 12차시
    'badge12': 'wsFig(CO("s12", 0, "sy3Pick")[0], 28)',
    'quad12': 'CO("s12", 1, "sy3Ask")[0][0].fig()',
    'ax12': 'CO("s12", 2, "sy3Ask")[0][0].fig()',
    'c12a1': 'wsComplete(CPL("c12a"), true)', 'c12a0': 'wsComplete(CPL("c12a"), false)',
    'c12b1': 'wsComplete(CPL("c12b"), true)', 'c12b0': 'wsComplete(CPL("c12b"), false)',
    'hex12': 'CO("s12", 4, "sy3Ask")[0][0].fig()',
    'signs12': 'wsCards(CO("s12", 5, "sy3Sort")[0].cards, 5)',
}

ST_DATA = {
    'cap': 'capJSON()',
    'want': '(() => { const W = {}, P = {}; Object.keys(ST_CPL).forEach(k => { W[k] = wsWant(CPL(k)); P[k] = CPL(k).pts; }); W.pts = P; return W; })()',
    'pt': '({ HL: SY3S_HL, HP: SY3S_HP, HPC: SY3S_HPC, ST: SY3S_ST, STM: SY3S_STM, TQ1: SY3S_TQ1, TQ2: SY3S_TQ2, PZ: SY3S_PZ, HOLE: SY3S_HOLE, PZA: SY3S_PZA,'
          ' FTA: SY3S_FT.a, FTB: SY3S_FT.b, Q6: sy3sFigQ6().shapes.map(S => S.P), Q6S: .42, KITE: sy3sFigKites(), P8L: SY3S_P8L, P8R: SY3S_P8R, OCT: SY3S_OCT,'
          ' HEX36: SY3S_HEX36, Q34: SY3S_Q34, T55: SY3S_T55 })',
    'ckey': '({ s1c: CK(CO("s1", "c", "sy3Pick")[0].shapes), s2b: CK(Object.entries(SY3S_BADGE).map(([label, P]) => ({ label, P }))),'
            ' s2t: CK(CO("s2", 4, "sy3Pick")[0].shapes), s2h: CK(CO("s2", "c", "sy3Pick", 0)[0].shapes),'
            ' hole: sy3CKey([sy3P(sy3Put([[0, 0], [2, 0], [2, 2], [3, 2], [3, 3], [0, 3]], 0, 1, 1.4))]),'
            ' s2c: CK(CO("s2", "c", "sy3Pick", 1)[0].shapes), s12: CK(CO("s12", 0, "sy3Pick")[0].shapes) })',
    'kind': '({ s4fold: CO("s4", 0, "sy3Fold")[0].items.map(w => sy3Key(sy3XPs(w.parts, sy3Refl(w.line[0], w.line[1]))) === sy3Key(w.parts)),'
            ' s4find: NAX(CO("s4", 1, "sy3Fold")[0].items), s4pick: KD(CO("s4", 4, "sy3Pick")[0].shapes), s4ax: NAX(CO("s4", "c", "sy3Fold")[0].items),'
            ' s7n: CO("s7", 0, "sy3Spin")[0].items.map(it => sy3Key(sy3XPs(it.parts, sy3Rot(it.center, 180))) === sy3Key(it.parts)),'
            ' s7spin: Object.fromEntries(CO("s7", 1, "sy3Spin")[0].items.map(it => [it.label, [90, 180].map(d => sy3Key(sy3XPs(it.parts, sy3Rot(it.center, d))) === sy3Key(it.parts))])),'
            ' s7find: KD(CO("s7", 3, "sy3Spin")[0].items), s7gly: KD(CO("s7", "c", "sy3Pick")[0].shapes),'
            ' s8: KD(CO("s8", "c", "sy3Sort")[0].cards), s10: KD(CO("s10", 3, "sy3Sort")[0].cards), s11: KD(CO("s11", 1, "sy3Sort")[0].cards),'
            ' s12: KD(CO("s12", 5, "sy3Sort")[0].cards), pics: SY3_PICS.map(p => [p.label, p.axes.length]),'
            ' mem: ST_MEM.map(c => [c.label, c.kind, sy3Kind(c.parts)]), c9x: polyKind(CPL("c9x")),'
            ' play: { see: sy3Kind([SY3_SHAPES.P[0]]), 가: sy3Kind([SY3_SHAPES.L[0]]), 나: sy3Kind([SY3_SHAPES.B[0]]), 다: sy3Kind([SY3_SHAPES.N[1]]), 라: sy3Kind([SY3_SHAPES.P[1]]) } })',
}


def SD():
    return load(SRC_ST)[1]


def CAPL(id_):
    return SD()['cap'][id_]


def calls(id_, st):
    L = CAPL(id_)
    return L['ch'] if st == 'c' else L['steps'][st]


def arg(id_, st, w, n=0):
    r = [c for c in calls(id_, st) if c['w'] == w]
    assert len(r) > n, ('앱 원본에 없음', id_, st, w, n)
    return r[n]['args']


def spic(s, key, mm=None):
    pic(s, key, mm, src=SRC_ST)


def slesson(s, id_):
    L = CAPL(id_)
    s.lesson(L['no'], L['soop'], L['title'], L['question'])


def sstep(s, id_, i, sub=None):
    """앱 계단 이름 '그려 보기 — 부스 둘러보기' → '② 그려 보기 | 부스 둘러보기'"""
    lab, _, sb = CAPL(id_)['names'][i].partition(' — ')
    step(s, i, lab, sub or sb)


def nf(v):
    t = '%.2f' % round(v, 2)
    return t.rstrip('0').rstrip('.') if '.' in t else t


LONG = 12
CIR = '㉠㉡㉢㉣㉤㉥'


def ptxt(parts, lv, ans, keep=False):
    """앱 물음 조각 → 활동지 문장. {n}은 빈칸, {o}는 기본형 보기 고르기·도전형 빈칸(보기가 길거나 여러 개 고르기면 보기를 남김)."""
    out = []
    for p in parts:
        if isinstance(p, str):
            out.append('\n' if p == '⏎' else p)
        elif not p:
            continue
        elif 'n' in p:
            out.append('(      )')
            ans.append(nf(p['n']))
        elif 'o' in p:
            o, a = p['o'], p['a']
            many = isinstance(a, list)
            ans.append(', '.join(o[i] for i in a) if many else o[a])
            if lv == '기본형' or keep or many or max(map(len, o)) > LONG:
                out.append(('( 모두 고르기: ' + ' / '.join(o) + ' )') if many else opt(*o))
            else:
                out.append('(' + ' ' * 14 + ')')
    return ''.join(out)


def optq(s, q, o, a):
    """보기 고르기 물음 하나. 여러 개 고르기·긴 보기는 ㉠㉡…로 늘어놓아요."""
    many = isinstance(a, list)
    if many and max(map(len, o)) <= 3:                    # 그림 속 기호(가~라)를 모두 고르기
        s.ask('%s %s' % (q, opt(*o)), answer_space=12)
        return ', '.join(o[i] for i in a)
    if many or max(map(len, o)) > 24:
        s.ask(q, blank=False)
        for i, t in enumerate(o):
            s.text('%s %s' % (CIR[i], t))
        s.ask('알맞은 것%s' % ('을 모두 골라 기호를 써 보세요' if many else '의 기호'), answer_space=12)
        return ', '.join(CIR[i] for i in (a if many else [a]))
    s.choices([(q, (optn if max(map(len, o)) > LONG else opt)(*o))])
    return o[a]


def ask_parts(s, lv, parts, ans, q=None, keep=False):
    """sy3Ask 한 물음(또는 blanks)의 조각"""
    only = [p for p in parts if isinstance(p, dict) and p]
    if len(parts) == 1 and only and 'o' in only[0]:          # 보기만 있는 물음
        ans.append(optq(s, q or '알맞은 것을 골라 보세요.', only[0]['o'], only[0]['a']))
        return
    if q:
        s.ask(q, blank=False)
    t = ptxt(parts, lv, ans, keep)
    s.fill([x.strip() for x in t.split('\n') if x.strip()])


def asks(s, lv, items, figs=None, keep=False):
    """sy3Ask 물음 목록(그림 키는 figs[i])"""
    ans = []
    for i, it in enumerate(items):
        if figs and i < len(figs) and figs[i]:
            k, mm = figs[i]
            spic(s, k, mm)
        ask_parts(s, lv, it['parts'], ans, it.get('q'), keep)
    return ans


def quizq(s, items, figs=None):
    ans = []
    for i, it in enumerate(items):
        if figs and i < len(figs) and figs[i]:
            k, mm = figs[i]
            spic(s, k, mm)
        ans.append(optq(s, it['q'], it['o'], it['a']))
    return ans


def frame(h):
    m = re.search(r'‘(.+?)’', h or '')
    return m.group(1).replace('~', '__________') if m else None


def thenwhy(s, lv, o, n=2):
    """'왜 그럴까요?'·글쓰기 칸: 기본형은 앱 도움의 문장 틀, 도전형은 쓰는 줄"""
    s.ask(o['q'], blank=False)
    fr = frame(o['help'][1]) if lv == '기본형' and o.get('help') else None
    if fr:
        s.fill(fr)
    else:
        s.lines(n)
    return '(예) ' + o['ans']


def rulefirst(s, o):
    s.ask('먼저 예상해요 ― ' + o['q'], blank=False)
    s.lines(1)
    return '(예상은 자유) 실제: ' + o['ans']


def ph(t):
    return t.replace('~', '______________________ ')


def first(id_, st, w):
    return arg(id_, st, w)[0]


def tw(id_, st):
    return arg(id_, st, 'thenWhy')[0]


def rf(id_, st):
    return arg(id_, st, 'ruleFirst')[0]


def hint(s, lv, id_, st, i=0):
    if lv == '기본형':
        h = (CAPL(id_)['chHints'] if st == 'c' else CAPL(id_)['hints'][st])[i]
        s.text('도움: ' + h)


def corr_items(s, lv, items):
    """sy3sItems 목록({k, q, a}) → 대응점·대응변·대응각 표. 기본형은 첫 칸이 보기."""
    rows, ans, seen = [], [], {}
    for it in items:
        seen.setdefault(it['k'], []).append(it)
    for k, its in seen.items():
        cells = ['대응' + k]
        for i, it in enumerate(its):
            ans.append('%s %s→%s' % (k, it['q'], it['a']))
            if lv == '기본형' and i == 0 and k == '점':
                cells.append('%s → ( %s )' % (it['q'], it['a']))
            else:
                cells.append('%s → (%s)' % (it['q'], ' ' * (3 + 2 * len(it['q']))))
        rows.append(cells)
    n = max(len(r) for r in rows)
    rows = [r + [''] * (n - len(r)) for r in rows]
    s.table(rows, header=False, header_col=True, col_mm=[24] + [156 / (n - 1)] * (n - 1), row_h=3402)
    return ans


def check_items(P, Q, A, items):
    """앱의 대응 관계가 실제 도형의 합동 이동과 같은지"""
    mp = {}
    for n, p in P.items():           # 앱 좌표는 소수 셋째 자리까지라 조금 넉넉히 견줘요
        q = ap(A, p)
        hit = [m for m, r in Q.items() if dist(q, r) < 1e-2]
        assert len(hit) == 1, (n, q)
        mp[n] = hit[0]
    for it in items:
        assert ''.join(mp[c] for c in it['q']) == it['a'], (it, mp)
    return mp


def sort_table(s, kinds, lv):
    grp = {k: [c for c, v in kinds.items() if v == k] for k in 'LPBN'}
    if lv == '기본형':
        s.text('도움: 먼저 한 직선을 따라 접으면 겹치는지, 다음으로 180° 돌리면 겹치는지 생각해요.')
    s.table([[KIND[k] for k in 'LPBN'], ['', '', '', '']], header=True, col_mm=[45] * 4, row_h=4536)
    return ' / '.join('%s: %s' % (KIND[k], ', '.join(grp[k]) or '없음') for k in 'LPBN')


def answer(no, parts, chal=None, lv='기본형'):
    t = '%s차시  ' % no + '   '.join('%s %s' % (NUM[i], p) for i, p in enumerate(parts))
    if lv == '도전형' and chal:
        t += '   %s %s' % (NUM[len(parts)], chal)
    return t


def J(a, sep=', '):
    return sep.join(a)


def st1(s, lv):
    I = 's1'
    slesson(s, I)
    s.scene(None, '한빛초등학교 5학년 3반이 가을 축제에서 ‘대칭 무늬 공방’ 부스를 열기로 했어요. 공방장 하린이와 도윤, 지아, 민재, 서윤이가 '
                  '배지와 타일을 오리고, 종이를 접어 무늬를 만들고, 바람개비와 카드 놀이를 준비해요.')
    A = []
    sstep(s, I, 0)
    spic(s, 'booth', 140)
    s.text('공방장 하린이가 부스를 꾸밀 물건을 늘어놓았어요. 그림을 보고 떠오르는 것을 세 칸에 써 보세요.')
    write_pane(s, lv, [(p['t'], ph(p['ph'])) for p in first(I, 0, 'panes')])
    A.append('(자유) 예) ' + first(I, 0, 'panes')[0]['ex'][0])
    sstep(s, I, 1)
    mu = first(I, 1, 'sy3Museum')
    spic(s, 'spots', 160)
    s.text('지아와 민재가 부스 다섯 곳을 둘러보고 있어요. 하나씩 살펴보고 어떤 특징이 있는지 알아보세요.')
    sp = {x['id']: x['name'] for x in mu['spots']}
    a1 = qa(s, [('모양과 크기가 똑같은 도형이 되풀이되는 곳', '%s, %s' % (sp['tile'], sp['badge'])),
                ('가운데 선을 따라 접으면 완전히 겹치는 곳', sp['fold']),
                ('가운데 점을 중심으로 180° 돌리면 처음과 겹치는 곳', '%s, %s' % (sp['letter'], sp['wheel']))], col=(110, 70))
    a1b = asks(s, lv, mu['ask'])
    A.append(J(a1, ' / ') + ' / ' + J(a1b))
    sstep(s, I, 2)
    de = first(I, 2, 'sy3Decal')
    s.text('서윤이가 부스 손님과 함께 할 물감 놀이를 준비했어요. 접는 선 왼쪽에 물감을 찍었어요. 반으로 접었다 펴면 오른쪽에 생기는 무늬를 같은 색으로 칠해 보세요.')
    spic(s, 'decal', 105)
    a2 = asks(s, lv, de['ask'])
    a2w = thenwhy(s, lv, tw(I, 2))
    A.append('오른쪽에 접는 선에서 같은 거리만큼 떨어진 칸을 같은 색으로(좌우가 바뀐 모양), %s / %s' % (J(a2), a2w))
    sstep(s, I, 3)
    s.text('도윤이가 깃발 모양 스티커를 이리저리 움직여 붙이려고 해요. 4학년 ‘평면도형의 이동’을 떠올려 알맞은 모양을 골라 보세요.')
    hint(s, lv, I, 3)
    A.append(J(quizq(s, first(I, 3, 'quiz'), [('flag_flip', 100), ('flag_rot', 100)]), ' / '))
    sstep(s, I, 4)
    s.text('부스 안내판을 만들려면 4학년 때 배운 수직과 대각선도 알아야 해요.')
    qz = first(I, 4, 'quiz')
    A.append(J(quizq(s, qz, [('perp', 90), ('pent', 40)]), ' / '))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '부스 바닥 타일')
        pk = first(I, 'c', 'sy3Pick')
        spic(s, 'tiles1', 140)
        K = SD()['ckey']['s1c']
        odd = [k for k, v in K.items() if list(K.values()).count(v) == 1]
        assert odd == pk['answer'], (odd, pk['answer'])
        s.ask('부스 바닥에 깔 타일이에요. 다른 타일들과 모양과 크기가 다른 타일 하나를 찾아 기호를 써 보세요.')
        why(s, '그 타일이 다른 까닭과, 나머지 타일들이 모양과 크기가 같다고 할 수 있는 까닭을 써 보세요.', 2)
        ch_ = '%s (%s)' % (J(odd), pk['ok'])
    return answer(1, A, ch_, lv)


def st2(s, lv):
    I = 's2'
    slesson(s, I)
    s.scene(None, '부스에서 나누어 줄 배지를 만들어요. 똑같은 배지가 여러 개 있어야 해요.')
    A = []
    sstep(s, I, 0)
    s.text('하린이처럼 노란 색종이 아래에 다른 색종이를 겹쳐 놓고, 노란 색종이에 배지 모양을 그려 한 번에 오려 보세요. 오려 낸 두 배지를 포개어 보세요.')
    A.append(J(asks(s, lv, first(I, 0, 'sy3Cut')['ask'])))
    sstep(s, I, 1)
    r1 = rulefirst(s, rf(I, 1))
    tr = first(I, 1, 'sy3Trace')
    spic(s, 'badges', 165)
    s.text('도윤이가 배지 가를 투명 종이에 본떠 그렸어요. 투명 종이를 배지 나, 다, 라, 마에 하나씩 포개어 보고, 배지 가와 완전히 겹치는 배지를 찾아보세요. '
           '방향이 다르면 투명 종이를 돌리거나 뒤집어 봐요.')
    K = SD()['ckey']['s2b']
    fit = [k for k in tr['visit'] if K[k] == K['가']]
    assert fit == tr['fit'], (fit, tr['fit'])
    A.append(r1 + ' / ' + J(asks(s, lv, tr['ask'])))
    sstep(s, I, 2)
    s.text('민재가 “배지 라는 뒤집어야 겹치니까 배지 가와 다른 배지야.”라고 말했어요. 포개어 본 것을 떠올리며 물음에 답해 보세요.')
    a2 = quizq(s, first(I, 2, 'quiz'))
    A.append(J(a2, ' / ') + ' / ' + thenwhy(s, lv, tw(I, 2)))
    sstep(s, I, 3)
    A.append(J(asks(s, lv, [{'parts': first(I, 3, 'blanks')}])))
    sstep(s, I, 4)
    pk = first(I, 4, 'sy3Pick')
    spic(s, 'ten2', 175)
    s.text('지아가 모눈종이에 타일 가~차를 그렸어요. 서로 합동인 타일을 모두 찾아 짝 지어 보세요.')
    hint(s, lv, I, 4)
    g = {}
    for k, v in SD()['ckey']['s2t'].items():
        g.setdefault(v, []).append(k)
    pairs = sorted(tuple(sorted(x, key='가나다라마바사아자차'.index)) for x in g.values() if len(x) == 2)
    assert pairs == [('가', '사'), ('나', '바'), ('다', '아')] and all(len(x) <= 2 for x in g.values()), pairs
    s.fill(('( 가 ) 와 (      ),   ' if lv == '기본형' else '(      ) 와 (      ),   ') + '(      ) 와 (      ),   (      ) 와 (      )')
    a4 = []
    for it in pk['ask']:
        ask_parts(s, lv, it['parts'], a4, it.get('q'))
    A.append(J(['%s와 %s' % p for p in pairs]) + ' / ' + J(a4))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '부스 바닥과 간판 조각')
        p0 = arg(I, 'c', 'sy3Pick', 0)[0]
        s.text('⑴ 부스 바닥에 빈자리(빨간 점선)가 생겼어요. 빈자리에 꼭 맞게 붙일 수 있는 타일의 기호를 쓰고, 어떻게 붙이면 되는지 써 보세요.')
        spic(s, 'hole2', 140)
        KH = SD()['ckey']
        fit = [k for k, v in KH['s2h'].items() if v == KH['hole']]
        assert fit == p0['answer'], (fit, p0['answer'])
        s.ask('붙일 수 있는 타일')
        s.lines(1)
        p1 = arg(I, 'c', 'sy3Pick', 1)[0]
        s.text('⑵ 간판 판자를 점선을 따라 모두 잘랐어요. 잘라 낸 조각 중 서로 합동인 조각을 짝 지어 보세요.')
        spic(s, 'cut2', 75)
        g2 = {}
        for k, v in KH['s2c'].items():
            g2.setdefault(v, []).append(k)
        p2 = sorted(tuple(sorted(x, key='가나다라마바사아자차'.index)) for x in g2.values())
        assert p2 == [('가', '다'), ('나', '라')], p2
        s.fill('(      ) 와 (      ),   (      ) 와 (      )')
        why(s, '두 조각이 합동이라고 할 수 있는 까닭을 써 보세요.', 1)
        ch_ = '⑴ %s(%s) ⑵ %s (%s)' % (J(fit), p0['ok'], J(['%s와 %s' % p for p in p2]), p1['ok'].split('. ', 1)[1])
    return answer(2, A, ch_, lv)


def st3(s, lv):
    I = 's3'
    slesson(s, I)
    s.scene(None, '서윤이가 고무판에 삼각형을 새겨 배지 도장을 만들었어요. 도장으로 찍으면 모양이 뒤집혀요!')
    P = SD()['pt']
    A = []
    sstep(s, I, 0)
    s.text('고무판에 새긴 삼각형 ㄱㄴㄷ을 종이에 찍었더니 삼각형 ㄹㅁㅂ이 나왔어요. 삼각형 ㄱㄴㄷ을 투명 종이에 본떠 그린 다음, 뒤집어서 삼각형 ㄹㅁㅂ에 완전히 겹치도록 포개어 보세요. '
           '포개었을 때 겹치는 꼭짓점, 변, 각을 써 보세요.')
    spic(s, 'stamp', 125)
    co = first(I, 0, 'sy3Corr')
    check_items(named(P['ST'], 'ㄱㄴㄷ'), named(P['STM'], 'ㄹㅁㅂ'), co['demo']['A'], co['items'])
    A.append(J(corr_items(s, lv, co['items'])))
    sstep(s, I, 1)
    A.append(J(asks(s, lv, [{'parts': first(I, 1, 'blanks')}])))
    sstep(s, I, 2)
    me = first(I, 2, 'sy3Measure')
    s.text('하린이가 모눈종이에 서로 합동인 사각형 ㄱㄴㄷㄹ과 사각형 ㅁㅂㅅㅇ 모양 이름표를 그렸어요(점 ㄱ과 점 ㅁ, 점 ㄴ과 점 ㅂ, 점 ㄷ과 점 ㅅ, 점 ㄹ과 점 ㅇ이 대응점). '
           '그림은 실제 크기예요(모눈 한 칸은 1 cm). 자와 각도기로 대응변의 길이와 대응각의 크기를 재어 비교해 보세요.')
    spic(s, 'tq')
    Aq, Bq = named(P['TQ1'], 'ㄱㄴㄷㄹ'), named(P['TQ2'], 'ㅁㅂㅅㅇ')
    mpq = dict(zip('ㄱㄴㄷㄹ', 'ㅁㅂㅅㅇ'))
    for w in ['ㄱㄴ', 'ㄴㄷ', 'ㄷㄹ', 'ㄹㄱ']:
        near(dist(Bq[mpq[w[0]]], Bq[mpq[w[1]]]), dist(Aq[w[0]], Aq[w[1]]))
    L3 = [dist(Aq['ㄱ'], Aq['ㄴ']), dist(Aq['ㄴ'], Aq['ㄷ']), dist(Aq['ㄹ'], Aq['ㄱ'])]
    G3 = [ang(Aq['ㄷ'], Aq['ㄴ'], Aq['ㄹ']), ang(Aq['ㄹ'], Aq['ㄷ'], Aq['ㄱ']), ang(Aq['ㄱ'], Aq['ㄹ'], Aq['ㄴ']), ang(Aq['ㄴ'], Aq['ㄱ'], Aq['ㄷ'])]
    for nm in 'ㄱㄴㄷㄹ':
        i = 'ㄱㄴㄷㄹ'.index(nm)
        a_, v_, b_ = 'ㄱㄴㄷㄹ'[i - 1], nm, 'ㄱㄴㄷㄹ'[(i + 1) % 4]
        near(ang(Bq[mpq[v_]], Bq[mpq[a_]], Bq[mpq[b_]]), ang(Aq[v_], Aq[a_], Aq[b_]), 1e-6)
    a2 = asks(s, lv, me['ask'])
    assert [float(x) for x in a2[:3]] == [round(v, 6) for v in L3], (a2, L3)
    assert [float(x) for x in a2[4:7]] == [round(G3[0]), round(G3[1]), 90] and round(G3[2]) == round(G3[3]) == 90, (a2, G3)
    A.append(J(a2))
    sstep(s, I, 3)
    s.text('도윤이가 사각형 ㄱㄴㄷㄹ 모양 도장으로 이름표 ㅁㅂㅅㅇ을 찍었어요. 두 사각형은 서로 합동이에요(점 ㄱ과 점 ㅁ, 점 ㄴ과 점 ㅂ, 점 ㄷ과 점 ㅅ, 점 ㄹ과 점 ㅇ이 대응점). '
           '□ 안에 알맞은 변의 길이와 각의 크기를 구해 보세요.')
    L, R = P['Q6']
    near(dist(L[0], L[1]) / P['Q6S'], 6, 1e-3)
    near(ang(L[1], L[0], L[2]), 115, .05)
    near(dist(R[0], R[1]) / P['Q6S'], 6, 1e-3)
    near(ang(R[1], R[0], R[2]), 115, .05)
    a3 = asks(s, lv, first(I, 3, 'sy3Ask'), [('q6', 125)])
    assert a3 == ['6', '115'], a3
    A.append(J(a3) + ' / ' + thenwhy(s, lv, tw(I, 3)))
    sstep(s, I, 4)
    s.text('부스 간판 퍼즐에 삼각형 조각 하나가 빠졌어요. 오른쪽의 삼각형 ㄱㄴㄷ을 돌리거나 뒤집어 빈자리(점선)에 꼭 맞게 넣으려고 해요.')
    spic(s, 'puzzle', 135)
    assert P['PZA'][:4] == [0, 1, -1, 0], P['PZA']          # 화면에서 시계 방향 90°
    s.choices([('삼각형 ㄱㄴㄷ을 빈자리에 꼭 맞게 넣으려면', optn('시계 방향으로 90° 돌려요', '시계 반대 방향으로 90° 돌려요', '위쪽으로 뒤집어요'))])
    s.text('삼각형 ㄱㄴㄷ과 합동인 삼각형 ㅂㄹㅁ에서 대응점, 대응변, 대응각을 찾아 써 보세요.')
    co = arg(I, 4, 'sy3Corr')[0]
    check_items(named(P['PZ'], 'ㄱㄴㄷ'), named(P['HOLE'], 'ㅂㄹㅁ'), P['PZA'], co['items'])
    A.append('시계 방향으로 90° 돌려요, ' + J(corr_items(s, lv, co['items'])))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '배지 도장 문제')
        s.text('⑴ 두 삼각형은 서로 합동이에요(도장으로 찍어서 한 삼각형은 뒤집힌 모양이에요).')
        spic(s, 'ft', 105)
        co = arg(I, 'c', 'sy3Corr')[0]
        mp = check_items(named(P['FTA'], 'ㄱㄴㄷ'), named(P['FTB'], 'ㄹㅂㅁ'), co['demo']['A'], co['items'])
        what = {'점': '대응점', '변': '대응변', '각': '대응각'}
        f = qa(s, [('%s %s의 %s' % (it['k'], it['q'], what[it['k']]), '%s %s' % (it['k'], it['a'])) for it in co['items']])
        s.text('⑵ 물음에 답해 보세요.')
        items = arg(I, 'c', 'sy3Ask')[0]
        Q = P['Q34']
        sd = [dist(Q[i], Q[(i + 1) % 4]) for i in range(4)]
        assert [round(v, 6) for v in sd] == [11, 6, 9, 8], sd
        T = P['T55']
        near(ang(T[0], T[1], T[2]), 50, .05)
        near(ang(T[1], T[0], T[2]), 55, .05)
        near(ang(T[2], T[0], T[1]), 75, .05)
        b = []
        for i, it in enumerate(items):
            if i == 0:
                spic(s, 'q34', 140)
            if i == 2:
                spic(s, 't55', 105)
            ask_parts(s, lv, it['parts'], b, it['q'])
        assert b == [nf(34 - 6 - 9 - 8), '5', '5', '5', nf(180 - 50 - 75)], b
        why(s, '각 ㄹㅁㅂ의 크기를 구한 방법을 써 보세요.', 1)
        ch_ = '⑴ %s ⑵ 변 ㄱㄴ %s cm(34−6−9−8), 대응점·대응변·대응각 각각 5쌍, 각 ㄹㅁㅂ %s°(180°−50°−75°)' % (J(f), b[0], b[4])
    return answer(3, A, ch_, lv)


def st4(s, lv):
    I = 's4'
    slesson(s, I)
    s.scene(None, '지아와 민재가 부스 창문 장식과 깃발을 만들어요. 종이를 반으로 접어 오리면 어떤 무늬가 될까요?')
    P, KD_ = SD()['pt'], SD()['kind']
    A = []
    sstep(s, I, 0)
    fo = first(I, 0, 'sy3Fold')
    assert all(KD_['s4fold'])
    spic(s, 'win4', 172)
    s.text('지아가 만든 창문 장식 다섯 장이에요. 장식마다 그어 둔 빨간 선을 따라 접으면 어떻게 될지 생각해 보세요. (종이에 옮겨 그려 접어 봐도 좋아요.)')
    A.append(J(asks(s, lv, fo['ask'])))
    sstep(s, I, 1)
    r1 = rulefirst(s, rf(I, 1))
    fo = arg(I, 1, 'sy3Fold')[0]
    spic(s, 'flags4', 172)
    s.text('민재가 오린 부스 깃발 모양 가~마예요. 반으로 접었을 때 완전히 겹치는 깃발을 찾아, 접을 수 있는 직선을 모두 그어 보세요. 세로·가로뿐 아니라 비스듬한 방향도 생각해 봐요.')
    n6 = KD_['s4find']
    need = {k: (-1 if v == 'inf' else v) for k, v in fo['need'].items()}
    assert {k: v for k, v in n6.items() if v} == need, (n6, need)
    A.append(r1 + ' / ' + J(asks(s, lv, fo['ask'])))
    sstep(s, I, 2)
    A.append(J(asks(s, lv, [{'parts': first(I, 2, 'blanks')}])))
    sstep(s, I, 3)
    s.text('하린이가 만든 육각형 배지는 직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이에요. 대칭축을 따라 접었을 때 겹치는 대응점, 대응변, 대응각을 써 보세요.')
    spic(s, 'hl4', 62)
    H = named(P['HL'], 'ㄱㄴㄷㄹㅁㅂ')
    co = first(I, 3, 'sy3Corr')
    check_items(H, H, refl_x(co['demo']['p'][0]), co['items'])
    hint(s, lv, I, 3, 1)
    A.append(J(corr_items(s, lv, co['items'])))
    sstep(s, I, 4)
    pk = first(I, 4, 'sy3Pick')
    spic(s, 'pick4', 175)
    a4 = kinds_of(KD_['s4pick'], 'L')
    assert a4 == pk['answer'], (a4, pk['answer'])
    s.ask('부스 안내판 가~바 중에서 선대칭도형을 모두 찾아 기호를 써 보세요.', answer_space=16)
    hint(s, lv, I, 4, 1)
    A.append(J(a4))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '대칭축의 수 비교하기')
        fo = first(I, 'c', 'sy3Fold')
        s.text('장식 가~라의 대칭축을 모두 찾아 긋고, 대칭축의 수가 적은 것부터 차례대로 기호를 써 보세요.')
        spic(s, 'ax4', 150)
        n4 = KD_['s4ax']
        assert n4 == fo['need'], (n4, fo['need'])
        order = sorted(n4, key=lambda k: n4[k])
        oa = []
        ptxt(fo['ask'][0]['parts'], lv, oa)
        assert oa == order, (oa, order)
        s.table([['장식', '가', '나', '다', '라'], ['대칭축의 수'] + ['(    )개'] * 4], header=True, header_col=True, col_mm=[40, 35, 35, 35, 35], row_h=3402)
        s.ask('대칭축의 수가 적은 것부터:   (     ) → (     ) → (     ) → (     )', blank=False)
        why(s, '정사각형 장식 나의 대칭축은 어디에 있는지 써 보세요.', 1)
        ch_ = '가 %d개, 나 %d개, 다 %d개, 라 %d개 → %s (정사각형: 마주 보는 변의 가운데끼리, 마주 보는 꼭짓점끼리 이은 직선)' % (
            n4['가'], n4['나'], n4['다'], n4['라'], ' → '.join(order))
    return answer(4, A, ch_, lv)


def hl_st(P):
    """선대칭 육각형 SY3S_HL: 변 3·4·2 cm, 각 110°·130°"""
    H = named(P['HL'], 'ㄱㄴㄷㄹㅁㅂ')
    for w, v in [('ㄱㄴ', 3), ('ㄱㅂ', 3), ('ㄴㄷ', 4), ('ㅂㅁ', 4), ('ㄷㄹ', 2), ('ㅁㄹ', 2)]:
        near(dist(H[w[0]], H[w[1]]), v, 1e-3)
    for (a_, v_, b_), g in [('ㄱㄴㄷ', 110), ('ㄱㅂㅁ', 110), ('ㄴㄷㄹ', 130), ('ㅂㅁㄹ', 130)]:
        near(ang(H[v_], H[a_], H[b_]), g, .05)
    return H


def st5(s, lv):
    I = 's5'
    slesson(s, I)
    s.scene(None, '접어서 만든 배지와 무늬에는 어떤 비밀이 있을까요? 하린이와 도윤이가 자와 각도기로 재어 보기로 했어요.')
    P = SD()['pt']
    A = []
    sstep(s, I, 0)
    s.text('하린이의 육각형 배지예요. 직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이에요. 그림은 실제 크기예요. 자와 각도기로 대응변의 길이와 대응각의 크기를 재어 보세요.')
    spic(s, 'hl5')
    hl_st(P)
    a0 = asks(s, lv, first(I, 0, 'sy3Measure')['ask'])
    assert a0 == ['3', '3', '4', '4', '2', '2', '110', '110', '130', '130'], a0
    A.append(J(a0[:6], '·') + ' cm, ' + J(a0[6:], '·') + '°')
    sstep(s, I, 1)
    r1 = rulefirst(s, rf(I, 1))
    me = arg(I, 1, 'sy3Measure')[0]
    s.text('도윤이가 모눈종이에 그린 선대칭도형이에요. 직선 ㅅㅇ이 대칭축이고, 선분 ㄴㅂ과 대칭축이 만나는 점을 점 ㅈ, 선분 ㄷㅁ과 대칭축이 만나는 점을 점 ㅊ이라고 해요. '
           '선분의 길이(모눈 칸 수)와 대칭축과 이루는 각을 재어 보세요.')
    spic(s, 'grid5', 95)
    N = named(me['shapes'][0]['P'], me['shapes'][0]['names'])
    J_, C_ = me['pts']['ㅈ'], me['pts']['ㅊ']
    assert dist(N['ㄴ'], J_) == dist(N['ㅂ'], J_) == 3 and dist(N['ㄷ'], C_) == dist(N['ㅁ'], C_) == 5
    assert N['ㄴ'][1] == N['ㅂ'][1] == J_[1] and N['ㄷ'][1] == N['ㅁ'][1] == C_[1] and J_[0] == C_[0] == me['lines'][0]['p'][0] == me['lines'][0]['q'][0]
    A.append(r1 + ' / ' + J(asks(s, lv, me['ask'])))
    sstep(s, I, 2)
    A.append(J(asks(s, lv, [{'parts': first(I, 2, 'blanks')}])))
    sstep(s, I, 3)
    s.text('직선 ㄱㄴ을 대칭축으로 하는 선대칭도형 두 개예요. □ 안에 알맞은 수를 구해 보세요.')
    KT = P['KITE']
    k1, k2 = KT['shapes'][0]['P'], KT['shapes'][1]['P']
    near(dist(k1[0], k1[1]), 6, 1e-3)
    near(dist(k1[0], k1[3]), 6, 1e-3)
    near(ang(k1[3], k1[0], k1[2]), 110, .05)
    near(ang(k1[1], k1[2], k1[0]), 110, .05)
    near(abs(k2[5][0] - KT['lines'][1]['p'][0]), 5, 1e-6)
    near(k2[5][1], k2[1][1])
    a3 = asks(s, lv, first(I, 3, 'sy3Ask'), [('kites', 130)])
    assert a3 == ['6', '110', '5', '90'], a3
    A.append(J(a3) + ' / ' + thenwhy(s, lv, tw(I, 3)))
    sstep(s, I, 4)
    s.text('서윤이가 반쪽만 그린 무늬를 직선 ㄱㄴ을 대칭축으로 하는 선대칭도형으로 완성하려고 해요.')
    hint(s, lv, I, 4)
    a4 = asks(s, lv, first(I, 4, 'sy3Ask'), [('half5', 40)])
    assert a4 == [nf((5 + 8 + 7) * 2), nf(6 * 2)], a4
    A.append('%s cm((5+8+7)×2), %s cm(6×2)' % tuple(a4))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '잘못 말한 친구 찾기')
        s.text('친구들이 선대칭도형의 성질을 말했어요.')
        b = quizq(s, first(I, 'c', 'quiz'))
        why(s, '민재의 말을 바르게 고쳐 써 보세요.', 1)
        ch_ = '%s (도윤, 민재) / %s / 선대칭도형의 대칭축은 여러 개일 수도 있어(정사각형 4개, 원은 셀 수 없이 많음)' % tuple(b)
    return answer(5, A, ch_, lv)


def complete(s, lv, key, text, help_txt, how, order=None):
    """선대칭·점대칭도형 완성(실제 크기 모눈)"""
    s.text(text)
    if lv == '기본형' and help_txt:
        s.text('도움: ' + help_txt)
    spic(s, key + ('1' if lv == '기본형' else '0'))
    return want_txt(SRC_ST, key, how)


HELP_LINE = '흐린 점선은 각 점에서 대칭축에 그은 수선이에요. 대칭축까지 몇 칸인지 세어 반대쪽으로 같은 칸만큼 가요.'
HELP_POINT = '흐린 점선은 각 점과 대칭의 중심을 지나는 직선이에요. 대칭의 중심까지 가로·세로로 몇 칸인지 세어, 대칭의 중심을 지나 같은 만큼 더 가요.'


def howmap(o):
    return {x['n']: x['of'] for x in o['miss']}


def cpl(id_, st, n=0):
    return arg(id_, st, 'sy3Complete', n)[0]


def st6(s, lv):
    I = 's6'
    slesson(s, I)
    s.scene(None, '공방 로고와 왕관·하트·리본 로고를 반쪽만 그려 두었어요. 선대칭도형의 성질을 이용해 나머지 반쪽을 완성해요. 모눈 한 칸은 1 cm예요(실제 크기).')
    A = []
    sstep(s, I, 0)
    o = cpl(I, 0)
    w0 = complete(s, lv, 'c6a', '공방 로고를 반쪽만 그렸어요. 직선 ㅅㅇ이 대칭축이에요. 점 ㄴ과 점 ㄷ의 대응점을 찾아 각각 점 ㅂ과 점 ㅁ으로 표시하고, '
                  '점 ㄱ, 점 ㅂ, 점 ㅁ, 점 ㄹ을 차례대로 이어 로고를 완성해 보세요.', HELP_LINE, howmap(o))
    sq = arg(I, 0, 'sequence')
    o0 = order_q(s, lv, sq[0], sq[1], '선대칭도형을 완성하는 방법을')
    A.append('%s / %s' % (w0, o0))
    sstep(s, I, 1)
    o = cpl(I, 1)
    w1 = complete(s, lv, 'c6b', '도윤이가 왕관 모양 로고를 그리다가 멈췄어요. 가로로 놓인 빨간 직선이 대칭축이에요. 점 ㄹ, ㄷ, ㄴ의 대응점을 찾아 각각 점 ㅂ, ㅅ, ㅇ으로 표시하고 '
                  '선대칭도형을 완성해 보세요.', '대칭축이 가로로 놓여 있어요. 각 점에서 대칭축까지 세로로 몇 칸인지 세어요. 점 ㄱ과 점 ㅁ은 대칭축 위에 있어요.', howmap(o))
    a1 = []
    for it in o['ask']:
        ask_parts(s, lv, it['parts'], a1, it['q'])
    A.append('%s / %s' % (w1, J(a1)))
    sstep(s, I, 2)
    mi = first(I, 2, 'sy3Mirror')
    s.text('지아가 하트 로고를 그려요. 빨간 점선이 대칭축이에요. 회색 점선을 따라 선분을 긋고, 그 선분을 대칭축에 대하여 뒤집은 대응변을 그어 하트 모양 선대칭도형을 완성해 보세요.')
    spic(s, 'mir6', 105)
    ax = mi['axis'][0][0]
    assert mi['axis'][0][0] == mi['axis'][1][0] and mi['guide'][0][0][0] == ax == mi['guide'][-1][1][0]
    A.append('회색 점선의 꺾인 점 %d개와 같은 높이에서 대칭축 오른쪽으로 각각 %s칸 떨어진 곳에 점을 찍고 차례로 이어요(하트 모양) / %s' % (
        len(mi['guide']) - 1, J([nf(ax - g[1][0]) for g in mi['guide'][:-1]]), thenwhy(s, lv, tw(I, 2))))
    sstep(s, I, 3)
    o = cpl(I, 3)
    w3 = complete(s, lv, 'c6d', '민재가 리본 모양 로고의 반쪽을 그렸어요. 세로로 놓인 빨간 직선이 대칭축이에요. 점 ㄹ, ㄷ, ㄴ의 대응점을 찾아 각각 점 ㅂ, ㅅ, ㅇ으로 표시하고 '
                  '선대칭도형을 완성해 보세요.', '점 ㄱ과 점 ㅁ은 대칭축 위에 있어요. 각 점에서 대칭축까지 가로로 몇 칸인지 세어 반대쪽에 찍어요.', howmap(o))
    A.append(w3)
    ch_ = None
    if lv == '도전형':
        step(s, 4, '도전하기', '비스듬한 대칭축')
        o = cpl(I, 'c')
        wx = complete(s, lv, 'c6x', '대칭축이 비스듬히 놓여 있어요. 먼저 각 점에서 대칭축에 수선을 그어 점 ㄷ, ㄴ의 대응점 ㅁ, ㅂ을 찾아 선대칭도형을 완성해 보세요.', None, howmap(o))
        why(s, '비스듬한 대칭축에서 대응점을 찾은 방법을 써 보세요.', 1)
        ch_ = wx + ' (모눈의 다른 대각선 방향이 대칭축과 수직이에요)'
    return answer(6, A, ch_, lv)


def hp_st(P):
    """점대칭 육각형 SY3S_HP: 변 2·3·1.5 cm, 각 130°·120°·110°"""
    H = named(P['HP'], 'ㄱㄴㄷㄹㅁㅂ')
    n = 'ㄱㄴㄷㄹㅁㅂ'
    for i, v in enumerate([2, 3, 1.5, 2, 3, 1.5]):
        near(dist(H[n[i]], H[n[(i + 1) % 6]]), v, 1e-3)
    for i, g in enumerate([110, 130, 120, 110, 130, 120]):          # 각 ㅂㄱㄴ, ㄱㄴㄷ, ㄴㄷㄹ, …
        near(ang(H[n[i]], H[n[i - 1]], H[n[(i + 1) % 6]]), g, .05)
    return H


def st7(s, lv):
    I = 's7'
    slesson(s, I)
    s.scene(None, '부스 간판 글자와 바람개비를 만들어요. 거꾸로 붙이거나 돌려도 똑같아 보이는 모양이 있을까요?')
    P, KD_ = SD()['pt'], SD()['kind']
    A = []
    sstep(s, I, 0)
    sp = first(I, 0, 'sy3Spin')
    assert all(KD_['s7n'])
    spic(s, 'n7', 50)
    s.text('부스 간판에 붙일 글자 ‘N’이 거꾸로 붙어도 괜찮을지 서윤이가 걱정해요. 글자를 투명 종이에 본떠 그리고, 연필 끝으로 점 ㅇ을 누른 채 180° 돌려 보세요.')
    A.append(J(asks(s, lv, sp['ask'])))
    sstep(s, I, 1)
    r1 = rulefirst(s, rf(I, 1))
    sp = arg(I, 1, 'sy3Spin')[0]
    spic(s, 'spin7', 150)
    s.text('민재가 만든 바람개비 날개 판 가~다예요. 점 ㅇ을 중심으로 각각 90°, 180° 돌려 보고, 처음 모양과 완전히 겹치면 ○, 겹치지 않으면 ×를 써 보세요.')
    assert all(v == [False, True] for v in KD_['s7spin'].values()), KD_['s7spin']
    s.table([['', '가', '나', '다'], ['90° 돌렸을 때', '', '', ''], ['180° 돌렸을 때', '', '', '']],
            header=True, header_col=True, col_mm=[54, 42, 42, 42], row_h=3402)
    A.append(r1 + ' / 가·나·다 모두 90° ×, 180° ○ / ' + J(asks(s, lv, sp['ask'])))
    sstep(s, I, 2)
    A.append(J(asks(s, lv, [{'parts': first(I, 2, 'blanks')}])))
    sstep(s, I, 3)
    sp = arg(I, 3, 'sy3Spin')[0]
    spic(s, 'find7', 172)
    s.text('부스 소품 가~마 중에서 점대칭도형을 모두 찾아보세요. 대칭의 중심이 될 만한 점을 찾아 180° 돌려 봐요.')
    hint(s, lv, I, 3)
    a3 = kinds_of(KD_['s7find'], 'P')
    assert a3 == sp['need'], (a3, sp['need'])
    A.append(J(asks(s, lv, sp['ask'])) + ' / ' + thenwhy(s, lv, tw(I, 3)))
    sstep(s, I, 4)
    s.text('점 ㅇ을 대칭의 중심으로 하는 점대칭도형 모양의 바람개비 판이에요. 대칭의 중심을 중심으로 180° 돌렸을 때 겹치는 대응점, 대응변, 대응각을 써 보세요.')
    spic(s, 'hp7', 66)
    H = hp_st(P)
    co = first(I, 4, 'sy3Corr')
    check_items(H, H, rot180(P['HPC']), co['items'])
    hint(s, lv, I, 4, 1)
    A.append(J(corr_items(s, lv, co['items'])))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '간판 글자')
        spic(s, 'gly7', 170)
        g = KD_['s7gly']
        p1, p2 = kinds_of(g, 'P'), kinds_of(g, 'B')
        q1, q2 = arg(I, 'c', 'sy3Pick', 0)[0], arg(I, 'c', 'sy3Pick', 1)[0]
        assert p1 == q1['answer'] and p2 == q2['answer'], (p1, p2)
        s.ask('⑴ 점대칭도형 모양인 글자를 모두 써 보세요.', answer_space=14)
        s.ask('⑵ 점대칭도형이면서 선대칭도형 모양인 글자를 모두 써 보세요.', answer_space=10)
        why(s, '⑶ 글자 ‘ㅗ’가 점대칭도형이 아닌 까닭을 써 보세요.', 1)
        ch_ = '⑴ %s ⑵ %s ⑶ 180° 돌리면 ‘ㅜ’ 모양이 되어 처음 글자와 완전히 겹치지 않기 때문' % (J(p1), J(p2))
    return answer(7, A, ch_, lv)


def st8(s, lv):
    I = 's8'
    slesson(s, I)
    s.scene(None, '돌려도 같은 바람개비 판에는 어떤 비밀이 있을까요? 하린이와 친구들이 자와 각도기로 재어 보기로 했어요.')
    P, KD_ = SD()['pt'], SD()['kind']
    A = []
    sstep(s, I, 0)
    s.text('점 ㅇ을 대칭의 중심으로 하는 바람개비 판이에요. 그림은 실제 크기예요. 자와 각도기로 대응변의 길이와 대응각의 크기를 재어 보세요.')
    spic(s, 'hp8')
    H = hp_st(P)
    a0 = asks(s, lv, first(I, 0, 'sy3Measure')['ask'])
    assert a0[:12] == ['2', '2', '3', '3', '1.5', '1.5', '130', '130', '120', '120', '110', '110'], a0
    A.append('%s cm, %s°, %s' % (J(a0[:6], '·'), J(a0[6:12], '·'), J(a0[12:])))
    sstep(s, I, 1)
    jo = first(I, 1, 'sy3Join')
    s.text('하린이가 바람개비 판의 대칭의 중심 표시를 지워 버렸어요. 대응점끼리 각각 선분으로 이어 보세요(%s). 세 선분이 만나는 점을 점 ㅇ으로 표시하고, 점 ㅇ까지의 길이를 재어 보세요.'
           % ', '.join('점 %s과 점 %s' % tuple(p) for p in jo['pairs']))
    spic(s, 'hp8n')
    O = P['HPC']
    seg = [dist(H[n], O) for n in 'ㄱㄹㄴㅁㄷㅂ']
    for i in range(0, 6, 2):
        near(seg[i], seg[i + 1], 1e-3)
    measure_table(s, ['선분 ㄱㅇ', '선분 ㄹㅇ', '선분 ㄴㅇ', '선분 ㅁㅇ', '선분 ㄷㅇ', '선분 ㅂㅇ'], ' cm')
    A.append('ㄱㅇ=ㄹㅇ 약 %s cm, ㄴㅇ=ㅁㅇ 약 %s cm, ㄷㅇ=ㅂㅇ 약 %s cm, %s' % (cm(seg[0]), cm(seg[2]), cm(seg[4]), J(asks(s, lv, jo['ask']))))
    sstep(s, I, 2)
    A.append(J(asks(s, lv, [{'parts': first(I, 2, 'blanks')}])))
    sstep(s, I, 3)
    s.text('점 ㅇ을 대칭의 중심으로 하는 점대칭도형 두 개예요. 오른쪽 도형에서 선분 ㄴㅁ은 18 cm, 선분 ㄷㅇ은 7 cm예요. 선분의 길이와 각의 크기를 구해 보세요.')
    Lp, Rp = P['P8L'], P['P8R']
    near(dist(Lp[0], Lp[1]) / .2, 12, .02)
    near(dist(Lp[1], Lp[2]) / .2, 7, .02)
    near(dist(Lp[3], Lp[4]) / .2, 12, .02)
    near(ang(Lp[0], Lp[5], Lp[1]), 105, .1)
    near(ang(Lp[3], Lp[2], Lp[4]), 105, .1)
    cR = (sum(p[0] for p in Rp) / 6, sum(p[1] for p in Rp) / 6)
    near(dist(Rp[1], Rp[4]) / .22, 18, .02)
    near(dist(Rp[2], cR) / .22, 7, .02)
    a3 = asks(s, lv, first(I, 3, 'sy3Ask'), [('p8', 150)])
    assert a3 == ['12', '105', nf(18 / 2), nf(7 * 2)], a3
    A.append('%s cm, %s°, %s cm(18÷2), %s cm(7×2) / %s' % (tuple(a3) + (thenwhy(s, lv, tw(I, 3)),)))
    sstep(s, I, 4)
    s.text('점 ㅈ을 대칭의 중심으로 하는 팔각형 바람개비 판이에요. 둘레가 54 cm일 때 물음에 답해 보세요.')
    Oc = P['OCT']
    L8 = [dist(Oc[i], Oc[(i + 1) % 8]) / .3 for i in range(8)]
    assert [round(v, 2) for v in L8] == [6, 9, 4, 8, 6, 9, 4, 8], L8
    hint(s, lv, I, 4)
    a4 = asks(s, lv, first(I, 4, 'sy3Ask'), [('oct8', 60)])
    rest = 54 - (6 + 9 + 4) * 2
    assert a4 == [nf(rest), nf(rest / 2)], a4
    A.append('%s cm(54−(6+9+4)×2), %s cm' % tuple(a4))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '펜토미노 조각 나누기')
        s.text('부스 장식에 쓸 펜토미노 조각을 대칭의 종류로 나누어 기호를 써 보세요.')
        spic(s, 'pento8', 165)
        ch_ = sort_table(s, KD_['s8'], lv)
    return answer(8, A, ch_, lv)


def st9(s, lv):
    I = 's9'
    slesson(s, I)
    s.scene(None, '바람개비 무늬를 반쪽만 그려 두었어요. 점대칭도형의 성질을 이용해 나머지를 완성해요. 모눈 한 칸은 1 cm예요(실제 크기).')
    KD_ = SD()['kind']
    A = []
    sstep(s, I, 0)
    o = cpl(I, 0)
    w0 = complete(s, lv, 'c9a', '점 ㅇ을 대칭의 중심으로 하는 점대칭도형 무늬의 일부예요. 점 ㄴ과 점 ㄷ의 대응점을 찾아 각각 점 ㅁ과 점 ㅂ으로 표시하고, '
                  '점 ㄹ, 점 ㅁ, 점 ㅂ, 점 ㄱ을 차례대로 이어 무늬를 완성해 보세요.', HELP_POINT, howmap(o))
    sq = arg(I, 0, 'sequence')
    A.append('%s / %s' % (w0, order_q(s, lv, sq[0], sq[1], '점대칭도형을 완성하는 방법을')))
    sstep(s, I, 1)
    o = cpl(I, 1)
    w1 = complete(s, lv, 'c9b', '지아가 바람개비 무늬의 반쪽을 그렸어요. 점 ㅈ을 대칭의 중심으로 하는 점대칭도형이 되도록 점 ㄴ, ㄷ, ㄹ의 대응점을 찾아 각각 점 ㅂ, ㅅ, ㅇ으로 표시하고 '
                  '완성해 보세요.', '점 ㄱ의 대응점은 점 ㅁ이에요. 이미 그려져 있어요. 점 ㄴ의 대응점은 점 ㅈ의 건너편, 같은 거리에 있어요.', howmap(o))
    a1 = []
    for it in o['ask']:
        ask_parts(s, lv, it['parts'], a1, it['q'])
    A.append('%s / %s' % (w1, J(a1)))
    sstep(s, I, 2)
    s.text('민재가 점대칭도형을 완성하다가 대칭의 중심을 지나는 세로선을 ‘대칭축’처럼 보고, 점 ㄴ의 대응점을 세로선의 반대쪽에 같은 높이로 찍었어요.')
    a2 = quizq(s, first(I, 2, 'quiz'))
    A.append('%s / %s' % (J(a2, ' / '), thenwhy(s, lv, tw(I, 2))))
    sstep(s, I, 3)
    o = cpl(I, 3)
    A.append(complete(s, lv, 'c9d', '서윤이의 리본 바람개비 무늬예요. 점 ㅈ을 대칭의 중심으로 하는 점대칭도형이 되도록 점 ㄱ, ㄴ, ㄷ, ㄹ의 대응점을 찾아 각각 점 ㅁ, ㅂ, ㅅ, ㅇ으로 표시하고 '
                      '완성해 보세요.', '각 점에서 점 ㅈ까지 가로·세로로 몇 칸인지 세어요. 점 ㅈ을 지나 같은 칸만큼 더 가면 대응점이에요.', howmap(o)))
    ch_ = None
    if lv == '도전형':
        step(s, 4, '도전하기', '공방 엠블럼')
        o = cpl(I, 'c')
        assert KD_['c9x'] == 'B', KD_['c9x']
        wx = complete(s, lv, 'c9x', '선대칭도형이면서 점대칭도형인 공방 엠블럼을 만들어요. 빨간 세로 직선을 대칭축으로 하여 점 ㄹ, ㄷ, ㄴ의 대응점 ㅂ, ㅅ, ㅇ을 찾아 선대칭도형을 완성해 보세요.', None, howmap(o))
        b = []
        for it in o['ask']:
            ask_parts(s, lv, it['parts'], b, it['q'])
        why(s, '완성한 엠블럼이 점대칭도형인지 확인한 방법을 써 보세요.', 1)
        ch_ = '%s / %s' % (wx, J(b))
    return answer(9, A, ch_, lv)


def st10(s, lv):
    I = 's10'
    slesson(s, I)
    s.scene(None, '포스터 담당 서윤이가 부스 포스터를 꾸며요. 모눈 위에 대칭축을 긋고, 한쪽에 선분을 그은 다음 뒤집은 대응변을 그려 자연 속 선대칭도형을 그려요.')
    KD_ = SD()['kind']
    A = []
    sstep(s, I, 0)
    mi = first(I, 0, 'sy3Mirror')
    ax = mi['axisGuide'][0][0]
    assert mi['axisGuide'][1][0] == ax == mi['guide'][0][0][0] == mi['guide'][-1][1][0]
    s.text('서윤이가 잠자리 날개를 그리려고 해요. 빨간 점선이 대칭축이에요. 회색 점선을 따라 선분을 긋고, 대칭축에 대하여 뒤집은 대응변을 그어 잠자리 날개 모양 선대칭도형을 완성해 보세요.')
    spic(s, 'mir10', 105)
    sq = arg(I, 0, 'sequence')
    o1 = order_q(s, lv, sq[0], sq[1], '선대칭도형을 그리는')
    A.append('회색 점선의 꺾인 점 %d개와 같은 높이에서 대칭축 오른쪽으로 각각 %s칸 떨어진 곳에 점을 찍고 차례로 이어요 / %s' % (
        len(mi['guide']) - 1, J([nf(ax - g[1][0]) for g in mi['guide'][:-1]]), o1))
    sstep(s, I, 1)
    fo = first(I, 1, 'sy3Fold')
    s.text('포스터에 넣을 나비, 도토리, 코스모스 그림이에요. 그림마다 대칭축을 모두 그어 보세요.')
    spic(s, 'pics10', 140)
    na = dict(KD_['pics'])
    assert na == {'나비': 1, '도토리': 1, '코스모스': 8}, na
    A.append(J(asks(s, lv, fo['ask'])) + '(8개: 꽃잎 끝을 지나는 직선 4개, 꽃잎 사이를 지나는 직선 4개)')
    sstep(s, I, 2)
    mi = arg(I, 2, 'sy3Mirror')[0]
    s.text('우리 주변에서 찾은 선대칭도형 모양의 동물이나 식물을 그려 포스터에 넣어요. 빨간 점선을 대칭축으로 하여 한쪽에 선분을 %d개 이상 긋고, 대칭축에 대하여 뒤집은 대응변을 그어요. '
           '곡선은 짧은 선분 여러 개로 나타내요.' % mi['need'])
    spic(s, 'blank10', 118)
    s.text('자로 대응변 %d쌍의 길이를 재어 써 보세요.' % mi['needMeasure'])
    s.table([['', '선분', '대응변'], ['첫째 쌍', '(      ) cm', '(      ) cm'], ['둘째 쌍', '(      ) cm', '(      ) cm']],
            header=True, header_col=True, col_mm=[40, 70, 70], row_h=3402)
    A.append('(자유) 대응변의 길이가 같아요 / ' + thenwhy(s, lv, tw(I, 2)))
    sstep(s, I, 3)
    s.text('포스터 둘레에 붙일 장식 카드 ①~⑧을 대칭의 종류에 따라 나누어 번호를 써 보세요.')
    spic(s, 'cards10', 120)
    A.append(sort_table(s, KD_['s10'], lv))
    sstep(s, I, 4)
    s.text('포스터 아래에 선대칭도형과 점대칭도형을 설명하는 글을 써요.')
    A.append(J([thenwhy(s, lv, o) for o in first(I, 4, 'writeStep')], ' / '))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '정다각형 무늬')
        b = quizq(s, first(I, 'c', 'quiz'), [None, ('poly10', 70)])
        why(s, '정오각형이 점대칭도형이 아닌 까닭을 써 보세요.', 1)
        ch_ = '%s, %s (정오각형은 180° 돌리면 뾰족한 꼭짓점이 아래로 가서 겹치지 않아요)' % tuple(b)
    return answer(10, A, ch_, lv)


def st11(s, lv):
    I = 's11'
    slesson(s, I)
    s.scene(None, '축제 둘째 날, 부스에서 ‘대칭 카드 놀이 대회’를 열어요. 보이는 카드와 같은 종류의 대칭인 카드를 내며 도형 이름을 외치는 놀이예요. '
                  '선대칭도형이면서 점대칭도형인 카드는 둘 중 어느 쪽으로도 낼 수 있어요.')
    KD_ = SD()['kind']
    A = []
    sstep(s, I, 0)
    qz = first(I, 0, 'quiz')
    pl = KD_['play']
    sym = {'L': {'L'}, 'P': {'P'}, 'B': {'L', 'P'}, 'N': {'N'}}
    can = [k for k in '가나다라' if sym[pl[k]] & sym[pl['see']]]
    assert pl['see'] == 'P' and [qz[0]['o'][i] for i in qz[0]['a']] == can, (pl, can)
    hint(s, lv, I, 0)
    A.append(J(quizq(s, qz, [('play11', 140)]), ' / '))
    sstep(s, I, 1)
    s.text('놀이 전에 지아가 카드를 미리 살펴보재요. 카드 ①~⑧을 대칭의 종류에 따라 나누어 번호를 써 보세요.')
    spic(s, 'cards11', 120)
    A.append(sort_table(s, KD_['s11'], lv))
    sstep(s, I, 2)
    s.text('도윤, 지아와 셋이서 놀이를 해요. 카드를 5장씩 나누어 갖고, 내 차례에 보이는 카드와 같은 종류의 대칭인 카드를 골라 어떤 도형인지 외치며 내요. '
           '낼 카드가 없으면 한 장 가져오고, 카드가 한 장 남으면 ‘대칭!’을 외쳐요. 카드를 먼저 모두 내려놓으면 이겨요.')
    s.text('특별 카드: ① 다음 차례의 친구에게 2장 선물 · ② 놀이 순서 바꾸기 · ③ 보이는 카드 바꾸기')
    s.table([['차례', '보이는 카드(대칭의 종류)', '내가 낸 카드', '외친 말']] + [[str(i), '', '', ''] for i in range(1, 6)],
            header=True, col_mm=[18, 62, 50, 50], row_h=3402)
    A.append('(놀이 기록)')
    sstep(s, I, 3)
    mem = KD_['mem']
    assert all(a == b for _, a, b in mem)
    g3 = {k: [n for n, a, _ in mem if a == k] for k in 'LPN'}
    assert all(len(v) == 4 for v in g3.values())
    s.text('민재와 둘이서 하는 기억 놀이예요. 카드 2장을 펼쳐 대칭의 종류가 같으면 2장을 가져가요. 놀이 전에 카드 12장을 대칭의 종류가 같은 것끼리 세 묶음으로 나누어 번호를 써 보세요.')
    spic(s, 'mem11', 165)
    hint(s, lv, I, 3, 1)
    s.labeled([('선대칭도형', ''), ('점대칭도형', ''), ('둘 다 아닌 도형', '')], label_mm=40)
    A.append('선대칭도형 %s / 점대칭도형 %s / 둘 다 아닌 도형 %s' % tuple(J(g3[k]) for k in 'LPN'))
    sstep(s, I, 4)
    s.text('놀이를 마치고 반 친구들과 이기는 전략을 나누어요.')
    A.append(J([thenwhy(s, lv, o) for o in first(I, 4, 'writeStep')], ' / '))
    ch_ = None
    if lv == '도전형':
        step(s, 5, '도전하기', '놀이에서 생긴 일')
        ch_ = J(quizq(s, first(I, 'c', 'quiz')), ' / ')
        why(s, '보이는 카드가 원일 때 부등변삼각형 카드를 낼 수 없는 까닭을 써 보세요.', 1)
        ch_ += ' (부등변삼각형은 선대칭도형도 점대칭도형도 아니에요)'
    return answer(11, A, ch_, lv)


def st12(s, lv):
    I = 's12'
    slesson(s, I)
    s.scene(None, '축제를 마치며 ‘대칭 무늬 공방 발표회’를 열어요. 공방에서 만든 작품으로 배운 합동과 대칭을 설명해요.')
    P, KD_ = SD()['pt'], SD()['kind']
    A = []
    sstep(s, I, 0)
    pk = first(I, 0, 'sy3Pick')
    spic(s, 'badge12', 160)
    K = SD()['ckey']['s12']
    fit = [k for k in K if k != '가' and K[k] == K['가']]
    assert fit == pk['answer'], (fit, pk['answer'])
    s.ask('발표회에서 하린이가 질문했어요. “배지 가와 합동인 배지는 어느 것일까요?” 모눈의 칸 수를 세어 찾아 기호를 써 보세요.')
    hint(s, lv, I, 0, 1)
    A.append(J(fit))
    sstep(s, I, 1)
    s.text('도윤이가 서로 합동인 두 사각형 이름표를 보여 주며 물었어요. 두 사각형을 포갠다고 생각하여 대응점을 찾고, 대응점의 순서대로 읽은 것을 골라 보세요.')
    hint(s, lv, I, 1)
    A.append(J(asks(s, lv, first(I, 1, 'sy3Ask'), [('quad12', 120)], keep=True)))
    sstep(s, I, 2)
    s.text('지아가 부스 깃발 가~다의 대칭축을 세어 발표해요.')
    a2 = asks(s, lv, first(I, 2, 'sy3Ask'), [('ax12', 110)])
    assert a2 == ['2', '6', '3', '나', '다', '가'], a2
    A.append('가 2개, 나 6개, 다 3개 → 나 → 다 → 가')
    sstep(s, I, 3)
    o = cpl(I, 3, 0)
    w1 = complete(s, lv, 'c12a', '⑴ 민재가 그려 온 공방 로고예요. 직선 ㅅㅇ을 대칭축으로 하는 선대칭도형이 되도록 점 ㄷ, ㄴ의 대응점 ㅁ, ㅂ을 찾아 완성해 보세요.', HELP_LINE, howmap(o))
    o = cpl(I, 3, 1)
    w2 = complete(s, lv, 'c12b', '⑵ 점 ㅈ을 대칭의 중심으로 하는 점대칭도형이 되도록 점 ㄴ, ㄷ의 대응점 ㅁ, ㅂ을 찾아 완성해 보세요.', HELP_POINT, howmap(o))
    A.append('⑴ %s ⑵ %s' % (w1, w2))
    sstep(s, I, 4)
    s.text('서윤이가 만든 바람개비 판은 점 ㅇ을 대칭의 중심으로 하는 점대칭도형이에요. 둘레는 몇 cm인지 구해 보세요.')
    Hx = P['HEX36']
    L6 = [dist(Hx[i], Hx[(i + 1) % 6]) / .4 for i in range(6)]
    assert [round(v, 2) for v in L6] == [4, 6, 8, 4, 6, 8], L6
    hint(s, lv, I, 4)
    a4 = asks(s, lv, first(I, 4, 'sy3Ask'), [('hex12', 60)])
    assert a4 == [nf((4 + 6 + 8) * 2)], a4
    A.append('%s cm((4+6+8)×2) / %s' % (a4[0], thenwhy(s, lv, tw(I, 4))))
    sstep(s, I, 5)
    s.text('축제를 마치고 부스 안내판 가~마를 정리해요. 안내판 모양을 대칭의 종류에 따라 나누어 기호를 써 보세요.')
    spic(s, 'signs12', 130)
    A.append(sort_table(s, KD_['s12'], lv))
    sstep(s, I, 6)
    s.text('단원에서 배운 내용을 정리하고, 1차시에 쓴 ‘궁금해요’ 쪽지를 다시 읽어 궁금했던 것을 해결했는지 돌아보세요.')
    a6 = asks(s, lv, [{'parts': first(I, 6, 'blanks')}])
    A.append(J(a6) + ' / ' + J([thenwhy(s, lv, o) for o in first(I, 6, 'writeStep')]))
    ch_ = None
    if lv == '도전형':
        step(s, 7, '도전하기', '발표회 마지막 퀴즈')
        ch_ = J(quizq(s, first(I, 'c', 'quiz')), ' / ')
        why(s, '직사각형을 대각선으로 잘라 생긴 두 삼각형이 합동인 까닭을 써 보세요.', 1)
    return answer(12, A, ch_, lv)


ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11, st12]


def st_ready():
    """이야기 버전 원본이 있고, LESSONS가 들어 있으며, ST 함수가 그 차시 수만큼 있을 때만 만들어요."""
    if not os.path.exists(SRC_ST):
        return False, '원본 없음(%s)' % os.path.relpath(SRC_ST, ROOT)
    with open(SRC_ST, encoding='utf-8') as f:
        src = f.read()
    if '//@@LESSONS' not in src or 'const LESSONS' not in src:
        return False, '원본에 LESSONS가 아직 없음'
    n = len(set(__import__('re').findall(r'\bid:\s*"(s\d+)"', src)))
    if not ST:
        return False, '활동지 함수(ST)를 아직 쓰지 않음'
    if n and len(ST) != n:
        return False, '원본 차시 %d개, ST 함수 %d개' % (n, len(ST))
    return True, ''


# ================================================================ 만들기
def build(ver, funcs, lv):
    s = Sheet(unit_label='5-2 수학 3. 합동과 대칭(%s)' % LABEL[ver], level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 3. 합동과 대칭(%s) 활동지 정답 (%s)' % (LABEL[ver], lv), lines,
              note='※ 이 활동지는 앱 u3-symm.html과 차시 번호가 같습니다. 완성할 대응점의 자리는 주어진 점에서 모눈 칸 수로 적었어요. '
                   '자로 잰 길이는 어림한 값이에요(실제 크기 그림, 인쇄 배율 100%).')
    os.makedirs(OUT[ver], exist_ok=True)
    path = os.path.join(OUT[ver], NAME % lv)
    s.save(path)
    return path


def main():
    which = sys.argv[1:] or ['tb', 'st']
    out = []
    try:
        if 'tb' in which:
            for lv in ('기본형', '도전형'):
                out.append(build('tb', TB, lv))
        if 'st' in which:
            ok, why_ = st_ready()
            if ok:
                for lv in ('기본형', '도전형'):
                    out.append(build('st', ST, lv))
            else:
                print('이야기 버전은 건너뜀:', why_)
    finally:
        SHOT.close()
        shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob_ = check(p)
        bad += bool(prob_)
        print(p, 'OK' if not prob_ else '\n  ' + '\n  '.join(prob_))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
