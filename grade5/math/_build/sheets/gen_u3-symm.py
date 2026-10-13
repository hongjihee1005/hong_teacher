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
    if (o.grid) svg.append(sy3GridG(Math.floor(it.box[0]), Math.floor(it.box[1]), Math.ceil(it.box[2]), Math.ceil(it.box[3]), m));
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
        f.write(WS_JS)
    r = subprocess.run(['node', js, src, jf, FONT, pre], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-3000:])
    return json.loads(r.stdout)
