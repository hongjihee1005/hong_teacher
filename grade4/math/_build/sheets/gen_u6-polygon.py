# -*- coding: utf-8 -*-
"""4-2 수학 6. 다각형 활동지(HWPX) 만들기 — 교과서 차시 버전 · 이야기 버전 × 기본형 · 도전형

    python3 gen_u6-polygon.py

앱 원본(../units/sem2/u6-polygon.tb.js '은하의 어린이 미술관', u6-polygon.st.js '우리 반 교실 꾸미기 디자인단')의
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 그대로 따릅니다.

그림
  - 도형 카드·표지판·교실 그림·등대와 배·게시판 작품 등은 앱 원본의 그리기 코드를 node로 그대로 실행해 SVG로 옮겨 씁니다
    (좌표·크기가 앱과 똑같음). 모양 조각(패턴 블록) 좌표도 앱 원본에서 그대로 가져옵니다.
  - 학생이 그리는 곳에는 점 종이(앱과 같은 칸 수)·삼각 점 종이·원형 도형판을 넣습니다.
  - 모양 조각으로 만들기·채우기 그림은 실제 모양 조각과 같은 크기(한 변 25.4 mm)로 넣고, 채우는 모양 안에는
    조각의 변이 놓일 수 있는 삼각 격자 선을 옅게 그어 선을 따라 나누어 그릴 수 있게 합니다.
  - 대각선 길이를 재는 사각형은 1 = 1 cm 크기로 넣습니다(자로 재어 볼 수 있음).
정답(변·꼭짓점의 수, 대각선의 수, 길이, 각, 채우기 조각 수 등)은 이 스크립트가 좌표로 계산해 확인합니다.
그림은 임시 폴더에서 PNG로 찍습니다(저장소에 남기지 않음).
"""
import hashlib
import json
import math
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

G4 = os.path.normpath(os.path.join(HERE, '..', '..'))
UNITS = os.path.join(G4, '_build', 'units', 'sem2')
TMP = tempfile.mkdtemp(prefix='u6poly_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, BLUE, TENT, GOLD = '#1D2A2A', '#2B7BD6', '#E47A38', '#E8B630'
KO = ['가', '나', '다', '라', '마', '바', '사', '아']
JA = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ']
NAMES = {3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형', 7: '칠각형', 8: '팔각형', 9: '구각형', 10: '십각형'}
H3 = math.sqrt(3) / 2
MM_PB = 25.4          # 모양 조각 한 변(실제 패턴 블록 1인치)

# ================================================================ 앱 그림 코드 옮겨 오기(node)
_STUB = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const FONT = process.argv[3];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = Object.assign({}, a || {}); this.kids = []; this.textContent = ''; this.style = {};
    this.classList = { add() {}, remove() {}, toggle() {} }; }
  append(...k) { for (const x of k.flat(9)) if (x != null && x !== false) this.kids.push(x); }
  setAttribute(k, v) { this.a[k] = v; }
  set innerHTML(v) { this.kids = []; }
  addEventListener() {}
  toString() {
    const a = Object.assign({}, this.a);
    if (this.tag === 'svg') { a.xmlns = 'http://www.w3.org/2000/svg'; }
    const at = Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this.textContent)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
const document = { createElement: t => new El(t), head: { append() {} } };
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const e = new El(t, a); e.append(...k); return e; };
function makeSvg(w, hh) { return svgEl('svg', { viewBox: `0 0 ${w} ${hh}` }); }
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
const BLUE = '#2B7BD6', INK = '#1D2A2A', TENT = '#E47A38', PINE = '#2F6B57';
const unitSrc = src.slice(src.indexOf('//@@UNIT'), src.indexOf('//@@LESSONS'));
eval(unitSrc.replace(/^(const|let) /gm, 'var ').replace(/^function /gm, 'var __f = function '));
"""
# 위 eval: 맨 앞 const/let을 var로 바꿔 eval 밖에서도 보이게 합니다. function 선언은 eval 안에서도 함수 범위로 올라가므로
# 따로 바꿀 필요가 없지만, 안전하게 그대로 둡니다(아래 _fix로 되돌림).


def _job_js(jobs):
    """jobs: {이름: JS 식} — 식이 El이면 SVG 글, 아니면 JSON 값"""
    lines = ['const OUT = {};']
    for k, e in jobs.items():
        lines.append('OUT[%s] = (() => { const v = (%s); return (v && v.tag) ? String(v) : v; })();' % (json.dumps(k), e))
    lines.append('process.stdout.write(JSON.stringify(OUT));')
    return '\n'.join(lines)


def extract(fname, jobs):
    stub = _STUB.replace(".replace(/^function /gm, 'var __f = function ')", '')
    js = os.path.join(TMP, 'ex_%s.js' % hashlib.md5(fname.encode()).hexdigest()[:8])
    with open(js, 'w', encoding='utf-8') as f:
        f.write(stub + '\n' + _job_js(jobs))
    r = subprocess.run(['node', js, os.path.join(UNITS, fname), FONT], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError(r.stderr[-2500:])
    return json.loads(r.stdout)


SCENE_JS = """(() => { const s = makeSvg(%(W)s, %(H)s); %(V)s.deco(s);
  %(V)s.items.forEach(it => s.append(it.circle ? svgEl('circle', { cx: it.circle[0], cy: it.circle[1], r: it.circle[2], fill: it.fill, stroke: '#5C6B73', 'stroke-width': 3 })
    : svgEl('polygon', { points: p6PtsAttr(it.pts), fill: it.fill, stroke: '#5C6B73', 'stroke-width': 3, 'stroke-linejoin': 'round' })));
  return s; })()"""
MEAS = "{ measure: true, unit: 'cm', fs: 20, pad: 58, dots: true }"

TB = extract('u6-polygon.tb.js', {
    'ent': SCENE_JS % dict(W=900, H=470, V='P6_ENT'),
    'ent_items': 'P6_ENT.items.map(it => ({ n: it.n, k: it.circle ? 0 : p6Clean(it.pts).length }))',
    'mobile1': "p6Cards(P6_MOBILE1.map(p6S), { per: 4, cw: 180, ch: 170, shape: { dots: true } })",
    'mobile1_n': 'P6_MOBILE1.map(P => p6Clean(P).length)',
    'art1': "p6Cards(P6_ART1, { per: 6, cw: 190, ch: 160, shape: { dots: true } })",
    'find': "p6Cards(P6_FIND, { per: 6, cw: 190, ch: 160, shape: { dots: true } })",
    'find_ok': "P6_FIND.map(S => !!(S.pts && p6Info(S.pts).ok))",
    'sides': "p6Cards(P6_SIDES, { per: 4, cw: 220, ch: 190, shape: { dots: true } })",
    'sides_n': 'P6_SIDES.map(S => p6Clean(S.pts).length)',
    'signs': 'p6Signs()',
    'ch23': "p6Cards([p6S(p6Blob(7, [1.5, 1.3, 1.6], 5)), p6S(p6Blob(10, [1.6, 1.25], 0))], { per: 2, cw: 220, ch: 190, shape: { dots: true } })",
    'mob': "p6Cards(P6_MOB, { per: 3, cw: 340, ch: 300, shape: %s })" % MEAS,
    'mob_info': 'P6_MOB.map(S => { const i = p6Info(S.pts); return { eqL: !!i.eqL, eqA: !!i.eqA, reg: !!i.reg, n: i.n }; })',
    'reg4': "p6Cards([p6Reg(3, 2), p6Reg(4, 2), p6Reg(5, 2), p6Reg(6, 2)].map(p6S), { per: 4, cw: 170, ch: 160, shape: { dots: true } })",
    'regq': "p6Cards(P6_REGQ, { per: 3, cw: 340, ch: 300, shape: { measure: true, unit: 'cm', fs: 19, pad: 60 } })",
    'regq_info': 'P6_REGQ.map(S => { const i = p6Info(S.pts); return { eqL: !!i.eqL, eqA: !!i.eqA, reg: !!i.reg, n: i.n }; })',
    'hex6': """p6Fig(420, 340, s => {
          const P = p6Reg(6, 2), m = p6Fit(P, 420, 340, 60), Q = P.map(m);
          s.append(svgEl('polygon', { points: p6PtsAttr(Q), fill: '#FFF1C7', stroke: INK, 'stroke-width': 4 }));
          const lab = (i, t) => { const [mid, nv] = p6Out(Q, i); s.append(txt(p6R(mid[0] + nv[0] * 22), p6R(mid[1] + nv[1] * 22), t, 22, { fill: '#2B5FA8' })); };
          lab(0, '2 cm'); lab(2, '□ cm');
          const ang = (i, t) => { const c = p6Cen(Q), v = [c[0] - Q[i][0], c[1] - Q[i][1]], l = Math.hypot(...v); s.append(txt(p6R(Q[i][0] + v[0] / l * 38), p6R(Q[i][1] + v[1] / l * 38), t, 21, { fill: '#B4610F' })); };
          ang(1, '120°'); ang(4, '□°'); })""",
    'segcards': """(() => { const P = p6Blob(5, [1.5], -90); return p6Cards([p6SegCard(P, P[0], P[2]), p6SegCard(P, P[0], [(P[2][0] + P[3][0]) / 2, (P[2][1] + P[3][1]) / 2]),
          p6SegCard(P, [(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], [(P[3][0] + P[4][0]) / 2, (P[3][1] + P[4][1]) / 2]), p6SegCard(P, P[1], P[2])], { per: 4, cw: 180, ch: 170 }); })()""",
    'village': """p6ArtFig(440, 210, 40, [P6_VIL.house, P6_VIL.flower, P6_VIL.bird], { bg: s => s.append(svgEl('rect', { x: 0, y: 0, width: 440, height: 210, fill: '#F4FAF2' }), svgEl('rect', { x: 0, y: 192, width: 440, height: 18, fill: '#CFE6C4' })),
          after: s => { s.append(svgEl('circle', { cx: 343, cy: 68, r: 3.5, fill: INK })); [[80, '집'], [222, '꽃'], [330, '새']].forEach(([x, t]) => s.append(txt(x, 202, t, 15))); } })""",
    'vil': 'P6_VIL',
    'ship': 'P6_SHIP',
    'fish': 'P6_FISH',
    'chick': 'P6_CHICK',
    'chick_outline': 'p6Outline(P6_CHICK.pieces.map(p => p.pts)).P',
    'light': 'p6Light()',
    'rabbit': 'P6_RABBIT.map(r => ({ pts: r.pts, n: p6Clean(r.pts).length }))',
    'ws': 'P6_WS',
    'final': "p6Cards([p6S(p6Blob(8, [1.5, 1.3], 10)), p6S([[0, 0], [3, .4], [2.6, 2.2], [.4, 1.8]]), p6Drop(), p6S(p6Blob(6, [1.5, 1.2, 1.4], 30)), { open: [[0, 2], [1.2, 0], [2.4, 2], [.4, 2]] }], { per: 5, cw: 190, ch: 170, shape: { dots: true } })",
    'pb': 'P6_PB',
    'tg': 'P6_TG',
    'reg5': 'p6Reg(5, 3)',
})

ST = extract('u6-polygon.st.js', {
    'room': 'p6sRoomFig()',
    'room_items': 'P6S_ROOM.items.map(it => ({ n: it.n, k: it.circle ? 0 : p6Clean(it.pts).length }))',
    'stk': "p6Cards(P6S_STK, { per: 4, cw: 180, ch: 170, shape: { dots: true } })",
    'stk_n': 'P6S_STK.map(S => p6Clean(S.pts).length)',
    'stkn': 'P6S_STKN',
    'art': "p6Cards(P6S_ART, { per: 6, cw: 190, ch: 160, shape: { dots: true } })",
    'artcat': 'P6S_ARTCAT',
    'find': "p6Cards(P6S_FIND, { per: 6, cw: 190, ch: 160, shape: { dots: true } })",
    'find_ok': "P6S_FIND.map(S => !!(S.pts && p6Info(S.pts).ok))",
    'sides': "p6Cards(P6S_SIDES, { per: 4, cw: 220, ch: 190, shape: { dots: true } })",
    'sides_n': 'P6S_SIDES.map(S => p6Clean(S.pts).length)',
    'signs': 'p6sSigns()',
    'ch3': "p6Cards([p6S(p6Blob(9, [1.5, 1.3, 1.6], 5)), p6S(p6Blob(10, [1.6, 1.25], 0))], { per: 2, cw: 220, ch: 190, shape: { dots: true } })",
    'ch3_n': '[p6Blob(9, [1.5, 1.3, 1.6], 5), p6Blob(10, [1.6, 1.25], 0)].map(P => p6Clean(P).length)',
    'tile': "p6Cards(P6S_TILE, { per: 3, cw: 340, ch: 300, shape: %s })" % MEAS,
    'tile_info': 'P6S_TILE.map(S => { const i = p6Info(S.pts); return { eqL: !!i.eqL, eqA: !!i.eqA, reg: !!i.reg, n: i.n, A: p6Angles(S.pts).map(Math.round) }; })',
    'regq': "p6Cards(P6S_REGQ, { per: 3, cw: 340, ch: 300, shape: { measure: true, unit: 'cm', fs: 19, pad: 60 } })",
    'regq_info': 'P6S_REGQ.map(S => { const i = p6Info(S.pts); return { eqL: !!i.eqL, eqA: !!i.eqA, reg: !!i.reg, n: i.n }; })',
    'oct': 'p6sOctFig()',
    'octv': 'P6S_OCT',
    'dg': 'P6S_DG',
    'dgn': 'P6S_DGN',
    'qd': 'P6S_QD',
    'board': 'p6sBoardFig()',
    'tree': 'P6S_TREE',
    'star': 'P6S_STAR',
    'band': 'p6sBandFig()',
    'bandpts': 'P6S_BAND',
    'bandex': 'P6S_BANDEX',
    'hex1': 'P6S_HEX1',
    'hex2': 'P6S_HEX2',
    'bighex': 'P6S_BIGHEX',
    'area': 'P6S_AREA',
    'robot': 'P6S_ROBOT.map(r => ({ pts: r.pts, n: p6Clean(r.pts).length }))',
    'final': "p6Cards(P6S_FINAL, { per: 5, cw: 190, ch: 170, shape: { dots: true } })",
    'final_ok': "P6S_FINAL.map(S => !!(S.pts && p6Info(S.pts).ok))",
    'final_n': "P6S_FINAL.map(S => S.pts ? p6Clean(S.pts).length : 0)",
    'reg52': 'p6Reg(5, 2)',
})
PB = TB['pb']
