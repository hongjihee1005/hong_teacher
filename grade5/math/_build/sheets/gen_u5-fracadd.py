# -*- coding: utf-8 -*-
"""5-1 수학 5. 분수의 덧셈과 뺄셈 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u5-fracadd.py

앱 원본 ../units/u5-fracadd.tb.js('유기견 보호 센터', 10차시)·u5-fracadd.st.js('우리 반 텃밭 가꾸기', 10차시)와
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 똑같이 맞춥니다. 정답은 모두 이 스크립트가 분수(Fraction)로 계산해 확인합니다.
분수 표기는 4-2 「분수의 덧셈과 뺄셈」 활동지(grade4/math/_build/sheets/gen_u1-fracadd.py)와 같은 방법을 씁니다.

분수 표기
  - 계산 식·빈칸은 그림(PNG)으로 넣어 분수를 위아래(분자/분모)로 씁니다. 빈칸은 네모, 답 칸은 큰 네모.
  - 글 속 분수는 읽는 말로 씁니다: [3/7] → '7분의 3', [2 1/4] → '2와 4분의 1'(앱의 읽어 주기와 같음).
  - 교사용 정답 쪽은 줄여서 '3/7', '2 1/4'(= 2와 4분의 1)로 쓰고, 통분한 꼴 뒤에 기약분수를 (= …)로 덧붙입니다.
그림은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음). Chromium 하나를 띄워 모든 그림을 찍습니다.
8차시(음표) 활동에는 노랫말을 싣지 않습니다.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from fractions import Fraction
from math import gcd
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '5단원_분수의덧셈과뺄셈_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦'
WORK = tempfile.mkdtemp(prefix='u5frac_')
INK = '#1D2A2A'
FILLS = ['#F6C08A', '#9CC6EC', '#A9D8A2', '#D7B5E6']
PX_MM = 0.155          # 그림 1px(글자 34px 기준) ≈ 0.155mm → 글자 높이가 본문(14pt)과 비슷

# ================================================================ 분수 계산
FR_RE = re.compile(r'\[(?:(\d+) )?([^\[\]/ ]+)/([^\[\]]+)\]')


def F(s):
    """'2 1/4' · '9/4' · '3' · '[2 1/4]' → Fraction"""
    s = str(s).strip().strip('[]').strip()
    m = re.fullmatch(r'(?:(\d+) )?(\d+)/(\d+)', s)
    if m:
        return int(m.group(1) or 0) + Fraction(int(m.group(2)), int(m.group(3)))
    m = re.fullmatch(r'(?:([\d+\-−×]+) )?([\d+\-−×]+)/([\d+\-−×]+)', s)
    if m:   # 분자·분모 안의 식: [{3}+{5}/7]
        iv = lambda t: int(eval(t.replace('−', '-').replace('×', '*'))) if t else 0
        return iv(m.group(1)) + Fraction(iv(m.group(2)), iv(m.group(3)))
    assert re.fullmatch(r'\d+', s), s
    return Fraction(int(s))


def den_of(s):
    m = re.search(r'/(\d+)', str(s))
    return int(m.group(1)) if m else 1


def ev(e):
    """앱 f1Eval과 같은 식 계산: '[1 3/5]+[2 4/5]', '4−[1 1/8]−[5/8]'"""
    rest = e.replace('−', '-').replace(' ', ' ')
    toks = re.findall(r'\[[^\]]+\]|\d+|[+\-]', rest)
    assert ''.join(toks) == rest.replace(' ', '') or True
    acc, op = None, '+'
    for t in toks:
        if t in '+-':
            op = t
            continue
        v = F(t.replace(' ', ' '))
        acc = v if acc is None else (acc + v if op == '+' else acc - v)
    return acc


def form(x, d):
    """분모가 d인 교과서 꼴(대분수·진분수·자연수)"""
    x = Fraction(x)
    n = x * d
    assert n.denominator == 1, (x, d)
    n = int(n)
    w, r = divmod(n, d)
    if r == 0:
        return str(w)
    return '%d/%d' % (r, d) if w == 0 else '%d %d/%d' % (w, r, d)


def book(x, d):
    """정답 표기: 대분수(=가분수)"""
    x = Fraction(x)
    n = int(x * d)
    m = form(x, d)
    if n % d == 0:
        return m
    return '%s (=%d/%d)' % (m, n, d) if n > d else m


PART = r'(이에요|예요|이므로|므로|으로|은|는|을|를|과|와|이|가|로)?'
PAIRS = {'이에요': 0, '예요': 0, '이므로': 1, '므로': 1, '은': 2, '는': 2, '을': 3, '를': 3, '과': 4, '와': 4, '이': 5, '가': 5}
FORMS = [('이에요', '예요'), ('이므로', '므로'), ('은', '는'), ('을', '를'), ('과', '와'), ('이', '가')]


def jong(num):
    """읽는 말 끝 글자의 받침: None(없음) · 'ㄹ' · 'o'(그 밖)"""
    n = int(re.findall(r'\d+', num)[-1])
    if n == 0:
        return 'o'
    if n % 10:
        return {1: 'ㄹ', 3: 'o', 6: 'o', 7: 'ㄹ', 8: 'ㄹ'}.get(n % 10)
    return 'o'      # 십·백·천


def rd(t):
    """글 속 [분수] → 읽는 말(뒤 조사도 읽는 말에 맞춤)"""
    def rep(m):
        w, n, d, pt = m.group(1), m.group(2), m.group(3), m.group(4) or ''
        if w:
            gwa = '과' if jong(w) else '와'
            r = '%s%s %s분의 %s' % (w, gwa, d, n)
        else:
            r = '%s분의 %s' % (d, n)
        j = jong(n)
        if pt in PAIRS:
            pt = FORMS[PAIRS[pt]][0 if j else 1]
        elif pt in ('으로', '로'):
            pt = '으로' if j == 'o' else '로'
        return r + pt
    return re.sub(FR_RE.pattern + PART, rep, t)


def flat(t):
    """[2 1/4] → 2 1/4 (정답 쪽 표기), 빈칸 {x} → x"""
    t = re.sub(r'\{([^}]*)\}', r'\1', t)
    t = t.replace('▢', '')

    def one(m):
        w, n, d = m.group(1), m.group(2), m.group(3)
        if re.search(r'[+−\-]', n):
            n = '(%s)' % n
        return ('%s ' % w if w else '') + '%s/%s' % (n, d)
    t = re.sub(r'\[(?:(\d+) )?([^\[\]/ ]+)/([^\[\]]+)\]', one, t)
    return re.sub(r'\[([^\]]+)\]', r'\1', t)


# ================================================================ 그림 찍기(Chromium 한 번만)
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
    if (m.op === 'measure') {
      await p.setContent('<html><body><svg id="s" xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg></body></html>');
      const r = await p.evaluate(([chars, font]) => {
        const s = document.getElementById('s'); const o = {};
        for (const c of chars) { const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          t.setAttribute('font-size', '100'); t.setAttribute('font-family', font); t.setAttribute('style', 'white-space:pre');
          t.textContent = c; s.appendChild(t); o[c] = t.getComputedTextLength(); }
        return o; }, [m.chars, m.font]);
      process.stdout.write(JSON.stringify(r) + '\n');
    } else {
      await p.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}' +
        '#w{display:inline-block;width:' + m.width + 'px;line-height:0}#w>svg{width:100%;height:auto;display:block}</style>' +
        '</head><body><div id="w">' + m.svg + '</div></body></html>');
      try { await p.evaluate(() => document.fonts.ready); } catch (e) {}
      await p.locator('#w').screenshot({ path: m.out });
      process.stdout.write('{"ok":1}\n');
    }
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
"""


class Shot:
    def __init__(self):
        self.proc = None
        self.cache = {}
        self.n = 0

    def _start(self):
        js = os.path.join(WORK, 'shot.js')
        with open(js, 'w') as f:
            f.write(_NODE)
        npm_root = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
        self.proc = subprocess.Popen(['node', js], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                     env=dict(os.environ, NPM_ROOT=npm_root), text=True, bufsize=1)

    def ask(self, msg):
        if not self.proc:
            self._start()
        self.proc.stdin.write(json.dumps(msg, ensure_ascii=False) + '\n')
        self.proc.stdin.flush()
        line = self.proc.stdout.readline()
        if not line:
            raise RuntimeError('그림 찍기 실패')
        return json.loads(line)

    def png(self, svg, width_px):
        key = (svg, width_px)
        if key not in self.cache:
            self.n += 1
            out = os.path.join(WORK, 'f%04d.png' % self.n)
            self.ask({'op': 'png', 'svg': svg, 'out': out, 'width': int(width_px)})
            self.cache[key] = out
        return self.cache[key]

    def close(self):
        if self.proc:
            self.proc.stdin.close()
            self.proc.wait(timeout=60)


SHOT = Shot()
_W = {}
CHARSET = (''.join(chr(c) for c in range(32, 127)) + '−×÷○□▢①②③④⑤⑥⑦⑧㉠㉡㉢㉣·…‘’“”→≥≤가★')


def cw(ch):
    if not _W:
        _W.update(SHOT.ask({'op': 'measure', 'chars': CHARSET, 'font': FONT.replace("'", '')}))
    if ch in _W:
        return _W[ch] / 100
    if '가' <= ch <= '힣':
        return _W['가'] / 100
    return 1.0


def tw(t, fs):
    return sum(cw(c) for c in t) * fs


def T(x, y, s, fs, anchor='start', fill=INK, weight='normal'):
    return ('<text x="%.1f" y="%.1f" font-size="%.1f" text-anchor="%s" dominant-baseline="central" fill="%s" '
            'font-weight="%s" style="white-space:pre">%s</text>' % (x, y, fs, anchor, fill, weight, escape(str(s))))


def svg_doc(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>'
            '<g font-family="%s">%s</g></svg>' % (w, h, w, h, FONT, body))


# ---------------------------------------------------------------- 식(분수를 위아래로) 그리기
TOK = re.compile(r'\[[^\]]+\]|\{[^}]*\}|▢|[^\[\{▢]+')


def _part(t):
    """분수 안 한 자리: 숫자·□·{답}·식('{3}+{5}') → [('t',글)|('b',답)]"""
    out = []
    for m in re.finditer(r'\{([^}]*)\}|□|[^{□]+', t):
        g = m.group(0)
        if g == '□':
            out.append(('b', None))
        elif g.startswith('{'):
            out.append(('b', m.group(1)))
        else:
            out.append(('t', g.replace('-', '−')))
    return out


def parse_eq(s):
    segs = []
    for m in TOK.finditer(s):
        g = m.group(0)
        if g == '▢':
            segs.append(('A',))
        elif g.startswith('{'):
            segs.append(('b', g[1:-1]))
        elif g.startswith('['):
            inner = g[1:-1]
            left, den = inner.rsplit('/', 1)
            w, num = (left.split(' ', 1) if ' ' in left else (None, left))
            segs.append(('f', _part(w) if w else None, _part(num), _part(den)))
        else:
            segs.append(('t', g.replace('-', '−')))
    return segs


def _pw(parts, fs):
    return sum(tw(v, fs) if k == 't' else fs * 1.15 for k, v in parts)


def _pdraw(parts, x, cy, fs, out):
    for k, v in parts:
        if k == 't':
            out.append(T(x, cy, v, fs))
            x += tw(v, fs)
        else:
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="4" fill="#fff" stroke="#555" stroke-width="2"/>'
                       % (x + fs * .07, cy - fs * .5, fs, fs))
            x += fs * 1.15
    return x


def seg_w(sg, fs):
    if sg[0] == 't':
        return tw(sg[1], fs)
    if sg[0] == 'b':
        return fs * 1.3
    if sg[0] == 'A':
        return fs * 3.2
    _, w, n, d = sg
    sf = fs * .82
    fw = max(_pw(n, sf), _pw(d, sf)) + fs * .3
    return (_pw(w, fs) + fs * .08 if w else 0) + fw + fs * .08


def seg_draw(sg, x, cy, fs, out):
    if sg[0] == 't':
        out.append(T(x, cy, sg[1], fs))
    elif sg[0] == 'b':
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="5" fill="#fff" stroke="#444" stroke-width="2.4"/>'
                   % (x + fs * .1, cy - fs * .58, fs * 1.1, fs * 1.16))
    elif sg[0] == 'A':
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="8" fill="#fff" stroke="#333" stroke-width="2.6"/>'
                   % (x + fs * .12, cy - fs * 1.15, fs * 2.95, fs * 2.3))
    else:
        _, w, n, d = sg
        sf = fs * .82
        if w:
            x = _pdraw(w, x, cy, fs, out) + fs * .08
        nw, dw = _pw(n, sf), _pw(d, sf)
        fw = max(nw, dw) + fs * .3
        out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.4"/>'
                   % (x + fs * .06, cy, x + fw - fs * .06, cy, INK))
        _pdraw(n, x + (fw - nw) / 2, cy - fs * .66, sf, out)
        _pdraw(d, x + (fw - dw) / 2, cy + fs * .68, sf, out)
    return x + seg_w(sg, fs) if sg[0] != 'f' or not sg[1] else None


def eq_line(s, x, cy, fs, out):
    """한 줄을 그리고 끝 x를 돌려줌"""
    for sg in parse_eq(s):
        wdt = seg_w(sg, fs)
        seg_draw(sg, x, cy, fs, out)
        x += wdt
    return x


def eq_w(s, fs):
    return sum(seg_w(sg, fs) for sg in parse_eq(s))


def tall(s):
    return '[' in s or '▢' in s


def answers_in(s):
    out = []
    for sg in parse_eq(s):
        if sg[0] == 'b':
            out.append(sg[1])
        elif sg[0] == 'f':
            for p in (sg[1] or []) + sg[2] + sg[3]:
                if p[0] == 'b':
                    out.append(p[1])
    return out


def put_png(s, svg, w, h, max_mm=180):
    mm = min(max_mm, w * PX_MM)
    s.picture(SHOT.png(svg, min(2400, w * 2)), width_mm=mm)


def eq_fig(s, rows, fs=34, max_mm=180, indent=0):
    """식 여러 줄(빈칸 {답}, 답 칸 ▢) 그림. 줄 [(tag, 식)] 또는 식."""
    out, y, wmax = [], 10, 0
    for r in rows:
        tag, e = r if isinstance(r, tuple) else (None, r)
        h = fs * (2.75 if tall(e) else 1.6)
        cy = y + h / 2
        x = 12 + indent
        if tag:
            tw_ = tw(tag, fs * .78) + fs * .7
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="10" fill="#E8F1EE"/>'
                       % (x, cy - fs * .6, tw_, fs * 1.2))
            out.append(T(x + fs * .35, cy, tag, fs * .78, fill='#2E6B5A'))
            x += tw_ + fs * .35
        elif tag == '':
            x += fs * 3.2          # 앞 줄에 이어지는 줄('= …')은 조금 들여 씀
        x = eq_line(e, x, cy, fs, out)
        wmax = max(wmax, x + 12)
        y += h
    W, H = int(wmax + 4), int(y + 10)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)
    return [a for r in rows for a in answers_in(r[1] if isinstance(r, tuple) else r)]


def grid_fig(s, cells, cols=2, fs=34, W=1100):
    """계산 문제 칸(번호 붙은 식 + 답 칸) 여러 개를 cols칸으로"""
    out = []
    cw_ = W / cols
    rows = [cells[i:i + cols] for i in range(0, len(cells), cols)]
    y = 8
    for row in rows:
        h = fs * 2.9
        for c, e in enumerate(row):
            eq_line(e, 14 + c * cw_, y + h / 2, fs, out)
            assert 14 + eq_w(e, fs) < cw_ + 4, ('칸이 좁아요', e)
        y += h
    H = int(y + 8)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


# ================================================================ 그림: 막대·수직선·원·지도·사다리
def bars_fig(s, rows, d, unit_w=None, fs=30, shade=None):
    """rows: [(이름, 칸 수 몇 개의 1(정수), 미리 칠한 칸 수 또는 None)] — 1마다 d칸 막대"""
    lab_w = max(eq_w(r[0], fs) for r in rows) + 30
    units = max(r[1] for r in rows)
    uw = unit_w or min(780 / units, 520)
    out, y = [], 12
    for name, k, pre in rows:
        h = 92 if tall(name) else 70
        cy = y + h / 2
        eq_line(name, 12, cy, fs, out)
        x0 = 12 + lab_w
        for u in range(k):
            cells = d
            for c in range(cells):
                idx = u * d + c
                fill = '#D9D9D9' if pre is not None and idx < pre else '#fff'
                out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="44" fill="%s" stroke="%s" stroke-width="%s"/>'
                           % (x0 + u * (uw + 16) + c * uw / d, cy - 22, uw / d, fill, INK, 2))
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="44" fill="none" stroke="%s" stroke-width="3.5"/>'
                       % (x0 + u * (uw + 16), cy - 22, uw, INK))
        y += h
    W = int(12 + lab_w + units * (uw + 16) + 10)
    H = int(y + 10)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


def amount_fig(s, rows, d, fs=30):
    """대분수만큼 막대: rows [(이름, 값 문자열)] — 1은 d칸 막대, 마지막은 남은 칸만(회색으로 칠해 둠)"""
    lab_w = max(eq_w(r[0], fs) for r in rows) + 30
    units = max(-(-F(v).numerator // F(v).denominator) if F(v).denominator > 1 else int(F(v)) for _, v in rows)
    uw = min(840 / units, 300)
    out, y = [], 12
    for name, v in rows:
        n = int(F(v) * d)
        h = 92 if tall(name) else 74
        cy = y + h / 2
        eq_line(name, 12, cy, fs, out)
        x0 = 12 + lab_w
        for c in range(n):
            u, k = divmod(c, d)
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="46" fill="#E4E4E4" stroke="%s" stroke-width="2"/>'
                       % (x0 + u * (uw + 16) + k * uw / d, cy - 23, uw / d, INK))
        for u in range(n // d):
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="46" fill="none" stroke="%s" stroke-width="3.5"/>'
                       % (x0 + u * (uw + 16), cy - 23, uw, INK))
        y += h
    W = int(12 + lab_w + units * (uw + 16) + 10)
    put_png(s, svg_doc(W, int(y + 10), ''.join(out)), W, int(y + 10))


def cards_fig(s, cards, fs=36):
    out, x = [], 12
    for c in cards:
        w = eq_w(c, fs) + 36
        out.append('<rect x="%.1f" y="10" width="%.1f" height="120" rx="12" fill="#FFF8E6" stroke="%s" stroke-width="3"/>'
                   % (x, w, INK))
        eq_line(c, x + 18, 70, fs, out)
        x += w + 22
    put_png(s, svg_doc(int(x), 140, ''.join(out)), int(x), 140)




def match_fig(s, left, right, fs=30):
    out = []
    lw = max(eq_w(e, fs) for e in left) + 40
    rw = max(eq_w(e, fs) for e in right) + 40
    gap = 300
    W = int(20 + lw + gap + rw + 20)
    H = 30 + 110 * max(len(left), len(right))
    for col, items, x, w in ((0, left, 20, lw), (1, right, 20 + lw + gap, rw)):
        off = (max(len(left), len(right)) - len(items)) * 55
        for i, e in enumerate(items):
            cy = 70 + off + i * 110
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="92" rx="10" fill="#FFF8E6" stroke="%s" stroke-width="2.5"/>'
                       % (x, cy - 46, w, INK))
            eq_line(e, x + 20, cy, fs, out)
            dx = x + w + 18 if col == 0 else x - 18
            out.append('<circle cx="%.1f" cy="%.1f" r="9" fill="%s"/>' % (dx, cy, INK))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


# ================================================================ 활동 조각
def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], label), sub)


def opt_text(opts):
    return '( ' + ' / '.join(rd(o) for o in opts) + ' )'


def blanks(s, lv, parts):
    """앱 blanks: parts = 글 | (보기 목록, 정답 번호). 기본형은 보기, 도전형은 빈칸 + 낱말 상자. 정답 글 목록."""
    txt, ans, words = '', [], []
    for p in parts:
        if isinstance(p, str):
            txt += rd(p)
        else:
            opts, a = p
            ans.append(flat(opts[a]))
            words += [rd(o) for o in opts]
            txt += opt_text(opts) if lv == '기본형' else '(              )'
    if lv == '도전형':
        s.wordbox(sorted(set(words), key=lambda w: (len(w), w)))
    s.fill(txt)
    return ans


def chooses(s, items):
    """[(질문, 보기 목록, 정답 번호)] → 2칸 고르기 표(보기가 길면 글로). 정답 글 목록."""
    ans = []
    short = [it for it in items if all(len(rd(o)) <= 16 for o in it[1])]
    if len(short) == len(items):
        s.choices([(rd(q), opt_text(o)) for q, o, a in items])
    else:
        for k, (q, o, a) in enumerate(items):
            s.ask(rd(q), blank=False)
            s.fill(['%s %s' % ('㉠㉡㉢㉣'[i], rd(x)) for i, x in enumerate(o)])
            s.ask('답: (        )', blank=False)
    for q, o, a in items:
        if isinstance(a, list):
            ans.append(', '.join(rd(o[i]) if len(o) > 3 else flat(o[i]) for i in a))
        elif len(short) == len(items):
            ans.append(flat(o[a]))
        else:
            ans.append('㉠㉡㉢㉣'[a])
    return ans


def sort_cards(s, cards, bins):
    s.choices([(rd(t), opt_text(bins)) for t, k in cards])
    return [bins[k] for t, k in cards]


def lcm(a, b):
    return a // gcd(a, b) * b


def lcd(e):
    """식에 나온 분모들의 최소공배수"""
    L = 1
    for d in re.findall(r'/(\d+)\]', e):
        L = lcm(L, int(d))
    return L


def red(x):
    """기약분수 꼴(대분수·진분수·자연수)"""
    x = Fraction(x)
    return form(x, x.denominator)


def book5(x, d):
    """정답 표기: 공통분모 d로 나타낸 꼴, 약분되면 (= 기약분수)"""
    m, r = form(x, d), red(x)
    return m if m == r else '%s (= %s)' % (m, r)


def calc(s, items, cols=2):
    """items: {e: 보이는 식, a: 앱의 답, unit, q: 문제 글, x: 확인용 식, den}. 정답 글 목록(번호 순)."""
    ans, plain, k = [], [], 0
    for it in items:
        e = it.get('x') or it['e']
        a = F(it['a'])
        assert ev(e) == a, ('답 확인 필요', e, it['a'])
        d = it.get('den') or lcd(e)
        if (a * d).denominator != 1:
            d = lcd(e)
        it['_ans'] = book5(a, d) + (' ' + it['unit'] if it.get('unit') else '')
    for it in items:
        if not it.get('q'):
            plain.append(it)
    if plain:
        cells = []
        for it in plain:
            cells.append('%s %s = ▢%s' % (NUM[k], it['e'], ' ' + it['unit'] if it.get('unit') else ''))
            ans.append(it['_ans'])
            k += 1
        cols = cols if max(eq_w(c, 34) for c in cells) < 1100 / cols - 30 else 1
        grid_fig(s, cells, cols)
    for it in items:
        if it.get('q'):
            s.ask('%s %s' % (NUM[k], rd(it['q'])), blank=False)
            e = it.get('e') or it['x']
            eq_fig(s, ['%s = ▢%s' % (e, ' ' + it['unit'] if it.get('unit') else '')], indent=30)
            ans.append(it['_ans'])
            k += 1
    return ans


def chain(s, rows, check_rows=True, draw=True):
    """앱 fa5Chain: 줄마다 빈칸 {답}. '='로 시작하는 줄은 앞 줄에 이어 붙여 하나의 식으로 봄.
    한글 없는 '=' 식은 값이 모두 같은지 확인. 정답(채운 식) 글."""
    logical = []
    for r in rows:
        e = r[1] if isinstance(r, tuple) else r
        if logical and e.lstrip().startswith('='):
            logical[-1] += ' ' + e.strip()
        else:
            logical.append(e)
    for e in logical:
        full = re.sub(r'\{([^}]*)\}', r'\1', e).replace('▢', '')
        if check_rows and '=' in full and not re.search(r'[가-힣]', full):
            vals = [ev(p.replace('(', '').replace(')', '')) if '(' not in p else _paren(p) for p in full.split('=') if p.strip()]
            assert all(v == vals[0] for v in vals), ('식 확인 필요', full)
    if draw:
        eq_fig(s, rows)
    return ' / '.join(flat(e).strip() for e in logical)


def _paren(p):
    """'(2+1)+([3/5]+[4/5])' 같은 괄호 식 계산"""
    t = p.replace('−', '-')
    t = re.sub(r'\[(?:(\d+) )?(\d+)/(\d+)\]', lambda m: '(%s+Fraction(%s,%s))' % (m.group(1) or 0, m.group(2), m.group(3)), t)
    t = re.sub(r'(?<![\w,(])(\d+)(?![\w,])', r'Fraction(\1)', t)
    return eval(t)


def frame(help1):
    """앱 도움 둘째 줄 '‘…~…’ 꼴로 써요.' → 쓰기 틀"""
    m = re.search(r'‘(.*)’', help1)
    t = m.group(1) if m else help1
    return rd(t).replace('~', '__________')


def why(s, lv, q, help1, label='왜 그럴까요?'):
    s.ask('%s %s' % (label, rd(q)), blank=False)
    if lv == '기본형':
        s.fill(frame(help1))
    else:
        s.lines(2)


def rule_first(s, lv, q, help1):
    s.ask('먼저 예상해요 · ' + rd(q), blank=False)
    if lv == '기본형':
        s.fill(frame(help1))
    else:
        s.lines(1)


def panes(s, lv, items):
    """보기·생각하기·궁금해하기 같은 세 칸: items [(이름, 쓰기 틀(ph), 예시)]"""
    if lv == '기본형':
        s.labeled([(n, rd(ph).replace('~', '______________')) for n, ph, ex in items])
        s.text('예시) ' + rd(items[0][2]))
    else:
        for n, ph, ex in items:
            s.ask('%s: %s' % (n, rd(ph).replace('~', '…')), blank=False)
            s.lines(1)


def est(s, q, opts, a):
    s.choices([('먼저 어림해요 · ' + rd(q), opt_text(opts))])
    return opts[a]


def note_line(s):
    s.text('※ 계산 식은 분수를 위아래로 썼어요. 글 속에서는 ‘7분의 3’, ‘2와 4분의 1’처럼 읽는 말로 썼어요. '
           '네모 칸에는 수를, 큰 네모 칸에는 답을 써요. 답은 약분하지 않은 분수나 가분수로 써도 맞아요.')


# ================================================================ 5학년 단원 그림: 통분 막대·잠자는 시간·음표
def split_fig(s, pairs, d, fine, fs=30):
    """앱 fa5Split: pairs [(이름, 진분수)] 막대마다 1을 분모만큼 나누고 분자만큼 색칠. fine이면 한 칸이 1/d이 되는 점선."""
    lab_w = max(eq_w(n, fs) for n, v in pairs) + 30
    UW = 760
    out, y = [], 12
    for i, (name, v) in enumerate(pairs):
        f, den = F(v), den_of(v)
        assert d % den == 0 and f < 1, (v, d)
        num = int(f * den)
        h = 96 if tall(name) else 76
        cy = y + h / 2
        eq_line(name, 12, cy, fs, out)
        x0 = 12 + lab_w
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="50" fill="%s"/>' % (x0, cy - 25, UW * num / den, FILLS[i]))
        if fine:
            for k in range(1, d):
                if (k * den) % d:
                    x = x0 + UW * k / d
                    out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#555" stroke-width="1.6" stroke-dasharray="6 5"/>'
                               % (x, cy - 25, x, cy + 25))
        for k in range(1, den):
            x = x0 + UW * k / den
            out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="3"/>' % (x, cy - 25, x, cy + 25, INK))
        out.append('<rect x="%.1f" y="%.1f" width="%d" height="50" fill="none" stroke="%s" stroke-width="3.5"/>' % (x0, cy - 25, UW, INK))
        y += h
    W, H = int(12 + lab_w + UW + 16), int(y + 10)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


def take_fig(s, name, v, d, fs=30):
    """앱 fa5Take: 1을 d칸으로 나눈 막대(1마다 굵은 테두리)에 v만큼 색칠 — 빼는 만큼 ×표 할 막대"""
    n = F(v) * d
    assert n.denominator == 1
    n = int(n)
    units = -(-n // d)
    lab_w = eq_w(name, fs) + 30
    uw = min((1080 - lab_w) / units - 16, 640)
    h = 96 if tall(name) else 80
    cy = 12 + h / 2
    out = []
    eq_line(name, 12, cy, fs, out)
    x0 = 12 + lab_w
    for c in range(units * d):
        u, k = divmod(c, d)
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="56" fill="%s" stroke="%s" stroke-width="2"/>'
                   % (x0 + u * (uw + 16) + k * uw / d, cy - 28, uw / d, '#E4E4E4' if c < n else '#fff', INK))
    for u in range(units):
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="56" fill="none" stroke="%s" stroke-width="3.5"/>'
                   % (x0 + u * (uw + 16), cy - 28, uw, INK))
    W, H = int(x0 + units * (uw + 16) + 10), int(h + 24)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


def fill_fig(s, rows, d):
    """앱 fa5Fill: 색칠할 빈 막대(값을 올림한 개수의 1 막대)"""
    bars_fig(s, [(n, -(-F(v).numerator // F(v).denominator), None) for n, v in rows], d)


def sleep_fig(s, rows):
    """1차시: 하루 24시간 막대에 잠자는 시간"""
    LX, UW = 300, 760
    out, y = [], 16
    for i, (n, v) in enumerate(rows):
        w = UW * F(v) / 24
        out.append('<rect x="%d" y="%d" width="%d" height="50" fill="#fff" stroke="%s" stroke-width="2"/>' % (LX, y, UW, INK))
        out.append('<rect x="%d" y="%d" width="%.1f" height="50" fill="%s" stroke="%s" stroke-width="2"/>' % (LX, y, w, FILLS[2 - 2 * i], INK))
        for k in range(0, 25, 6):
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2"/>' % (LX + UW * k / 24, y + 50, LX + UW * k / 24, y + 60, INK))
        out.append(T(LX - 14, y + 25, n, 28, anchor='end'))
        eq_line('[%s]시간' % v, LX + float(w) + 14, y + 25, 26, out)
        y += 110
    for k in range(0, 25, 6):
        out.append(T(LX + UW * k / 24, y - 20, '%d시간' % k, 22, anchor='middle', fill='#555'))
    W, H = LX + UW + 60, y + 4
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=160)


NOTE = {'s': ('16분음표', '1/4'), 'e': ('8분음표', '1/2'), 'de': ('점 8분음표', '3/4'), 'q': ('4분음표', '1'),
        'dq': ('점 4분음표', '1 1/2'), 'hf': ('2분음표', '2')}


def beats(types):
    return sum((F(NOTE[t][1]) for t in types), Fraction(0))


def note_svg(t, x, y, k=1.5, col=INK):
    """앱 fa5DrawNote와 같은 음표(머리·기둥·꼬리·점), k배 크게"""
    o = ['<ellipse cx="%.1f" cy="%.1f" rx="%.1f" ry="%.1f" transform="rotate(-22 %.1f %.1f)" fill="%s" stroke="%s" stroke-width="%.1f"/>'
         % (x, y, 12 * k, 8.5 * k, x, y, '#fff' if t == 'hf' else col, col, 3 * k)]
    sx = x + 10.5 * k
    o.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%.1f"/>' % (sx, y - 3 * k, sx, y - 62 * k, col, 3 * k))

    def flag(yy):
        return ('<path d="M%.1f,%.1f C%.1f,%.1f %.1f,%.1f %.1f,%.1f" fill="none" stroke="%s" stroke-width="%.1f" stroke-linecap="round"/>'
                % (sx, yy, x + 22 * k, yy + 10 * k, x + 32 * k, yy + 18 * k, x + 24 * k, yy + 36 * k, col, 4 * k))
    if t in ('e', 'de'):
        o.append(flag(y - 62 * k))
    if t == 's':
        o += [flag(y - 62 * k), flag(y - 48 * k)]
    if t in ('de', 'dq'):
        o.append('<circle cx="%.1f" cy="%.1f" r="%.1f" fill="%s"/>' % (x + 22 * k, y + k, 4 * k, col))
    return ''.join(o)


def notes_fig(s, types, label=False):
    W = 60 + len(types) * 200
    out = ['<line x1="10" y1="140" x2="%d" y2="140" stroke="#9AA8A4" stroke-width="2"/>' % (W - 10)]
    for i, t in enumerate(types):
        x = 100 + i * 200
        out.append(note_svg(t, x, 140))
        if label:
            out.append(T(x + 8, 200, NOTE[t][0], 26, anchor='middle', fill='#444'))
    H = 220 if label else 170
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(150, W * .12))


def measure_fig(s, label, top, types, slot=True):
    """마디 하나: 박자표(top/4), 음표, 빈칸(?)"""
    NW = 110
    x0, yl = 20, 160
    w = 140 + len(types) * NW + (170 if slot else 30)
    out = [T(x0, 30, label, 26, fill='#444'),
           '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>' % (x0, yl, x0 + w, yl, INK),
           '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3"/>' % (x0, yl - 60, x0, yl + 50, INK),
           '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3"/>' % (x0 + w, yl - 60, x0 + w, yl + 50, INK),
           T(x0 + 45, yl - 26, str(top), 40, anchor='middle', weight='bold'), T(x0 + 45, yl + 24, '4', 40, anchor='middle', weight='bold')]
    for i, t in enumerate(types):
        out.append(note_svg(t, x0 + 140 + i * NW, yl))
    if slot:
        sx = x0 + 140 + len(types) * NW - 30
        out.append('<rect x="%d" y="%d" width="150" height="150" rx="12" fill="#FFF6EC" stroke="#B85A22" stroke-width="3" stroke-dasharray="10 7"/>'
                   % (sx, yl - 115))
        out.append(T(sx + 75, yl - 40, '?', 46, anchor='middle', fill='#B85A22'))
    W, H = x0 + w + 20, yl + 64
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(170, W * .14))


# ================================================================ 5학년 단원 활동 조각
KO = '㉠㉡㉢㉣㉤'


def two_ways(s, lv, expr, m1, m2, t1='방법 1 · 두 분모의 곱', t2='방법 2 · 최소공배수'):
    """두 가지 방법: m1·m2는 줄 목록(둘째 줄부터 '='로 시작). 기본형은 빈칸 식, 도전형은 식만 주고 과정을 씀."""
    rows = [(t1, m1[0])] + [('', r) for r in m1[1:]] + [(t2, m2[0])] + [('', r) for r in m2[1:]]
    if lv == '기본형':
        return chain(s, rows)
    a = chain(s, rows, draw=False)
    for t in (t1, t2):
        s.ask(t, blank=False)
        eq_fig(s, [expr + ' ='], indent=20)
        s.lines(2)
    return a


def cmp(s, pairs):
    """크기 비교 ○ : pairs [(왼쪽 식, 오른쪽 식)] → 기호 목록"""
    rows, signs = [], []
    for i, (l, r) in enumerate(pairs):
        a, b = ev(l), ev(r)
        signs.append('>' if a > b else '<' if a < b else '=')
        rows.append('%s %s ○ %s' % (KO[i] if len(pairs) > 1 else '', l, r))
    s.text('○ 안에 >, =, < 를 알맞게 써요.')
    eq_fig(s, rows)
    return signs


def pick_eq(s, q, opts, a):
    """식으로 된 보기 고르기"""
    s.ask(rd(q), blank=False)
    cells = ['%s %s' % (KO[i], o) for i, o in enumerate(opts)]
    cols = len(cells) if max(eq_w(c, 34) for c in cells) < 1100 / len(cells) - 30 else 1
    grid_fig(s, cells, cols)
    s.ask('답: (        )', blank=False)
    return KO[a]


def odd_one(opts):
    """합(차)이 다른 하나"""
    vals = [ev(o) for o in opts]
    odd = [i for i, v in enumerate(vals) if vals.count(v) == 1]
    assert len(odd) == 1, vals
    return odd[0], vals


def best_mixed(cards, kind):
    """수 카드 세 장으로 가장 큰/작은 대분수"""
    best = None
    for w in cards:
        for n in cards:
            for d in cards:
                if len({w, n, d}) < 3 or n >= d:
                    continue
                v = w + Fraction(n, d)
                if best is None or (v > best[0] if kind == 'max' else v < best[0]):
                    best = (v, '%d %d/%d' % (w, n, d))
    return best


def mixed_cards(s, lv, groups, op):
    """앱 fa5Mixed: groups [(이름, 카드, 'max'|'min')], op '+'|'-' → 정답 글"""
    bs = [best_mixed(c, k) for n, c, k in groups]
    tot = bs[0][0] + bs[1][0] if op == '+' else bs[0][0] - bs[1][0]
    assert tot > 0
    for n, c, k in groups:
        s.text('%s의 수 카드 — %s 로 %s 대분수 만들기' % (n, ', '.join(map(str, c)), '가장 큰' if k == 'max' else '가장 작은'))
        cards_fig(s, [str(x) for x in c])
    if lv == '기본형':
        s.text('가장 큰 대분수는 자연수 부분에 가장 큰 수를, 가장 작은 대분수는 자연수 부분에 가장 작은 수를 놓고, 남은 두 카드로 진분수를 만들어요.')
    s.table([['', groups[0][0], groups[1][0]], ['만든 대분수', '', '']], row_h=3400)
    s.ask('두 대분수의 %s를 구하는 식과 답을 써 보세요.' % ('합' if op == '+' else '차'), blank=False)
    s.lines(2)
    e = '[%s]%s[%s]' % (bs[0][1], '+' if op == '+' else '−', bs[1][1])
    L = lcd(e)
    assert ev(e) == tot
    return '%s %s, %s %s, %s %s %s = %s' % (groups[0][0], bs[0][1], groups[1][0], bs[1][1], bs[0][1],
                                          '+' if op == '+' else '−', bs[1][1], book5(tot, L))


def proper_cards(s, lv, cards, ex):
    """앱 fa5Proper: 수 카드로 진분수를 만들고 친구의 진분수와 더하기. ex = 예시 식"""
    cards_fig(s, [str(x) for x in cards])
    s.text('수 카드 %s 중에서 2장을 골라 한 번씩만 사용하여 진분수를 만들어요. 짝과 서로 만든 진분수를 바꾸어 두 진분수의 합을 구해요.'
           % ', '.join(map(str, cards)))
    if lv == '기본형':
        s.text('진분수는 분자가 분모보다 작아요. 두 분모가 다르면 먼저 통분해요.')
    s.table([['내가 만든 진분수', '친구가 만든 진분수', '두 진분수의 합(식과 답)'], ['', '', '']], row_h=4300)
    v = ev(ex)
    return '(예) %s = %s' % (flat(ex), book5(v, lcd(ex)))


def lessons_head(s, no, soop, title, question, scene):
    s.lesson(no, soop, title, question)
    if scene:
        s.scene(None, rd(scene))


def seq_order(s, items, order):
    """앱 sequence: items 원래 차례, order = 바른 차례의 번호"""
    s.fill(['%s %s' % (KO[i], rd(t)) for i, t in enumerate(items)])
    s.ask('놀이 순서대로 기호를 써 보세요.   (      ) → (      ) → (      ) → (      ) → (      )', blank=False)
    return ' → '.join(KO[i] for i in order)


YUT_DIE = ['+[1/2]', '−[1/3]', '+[1/4]', '−[1/6]', '+[2/5]', '♥']
CARD_YEL = ['1/2', '2/3', '3/4', '4/5', '1 2/3', '2 1/5']
CARD_BLU = ['5/6', '3/7', '5/8', '7/9', '1 1/6', '2 3/8']


def yut_record(s):
    s.text(rd('분수 주사위의 면: ' + ', '.join(YUT_DIE) + '  (♥가 나오면 계산하지 않고 그 칸에 그대로 두어요.)'))
    s.table([['번', '도착한 칸의 분수', '분수 주사위', '식', '계산 결과', '맞았나요?']] +
            [[str(i), '', '', '', '', ''] for i in range(1, 6)], row_h=2600)


def card_record(s):
    for a in CARD_YEL:
        for b in CARD_BLU:
            assert F(a) != F(b)
    s.text(rd('노란 카드: ' + ', '.join('[%s]' % c for c in CARD_YEL) + '   /   파란 카드: ' + ', '.join('[%s]' % c for c in CARD_BLU)))
    s.table([['판', '고른 셈(+ / −)', '노란 카드', '파란 카드', '식과 계산 결과', '점수']] +
            [[str(i), '', '', '', '', ''] for i in range(1, 6)], row_h=2600)


# ================================================================ 교과서 차시 버전 (유기견 보호 센터)
TB_SCENE = ('유기견과 관련된 책을 읽고 관심이 많아진 소윤이와 지후는 유기견 보호 센터에 봉사 활동을 하러 가요. '
            '센터에서는 사료 주기, 함께 산책하기, 간식 만들기 같은 봉사를 해요.')
ADD_RULE = ['분모가 다른 분수의 덧셈은 분수를 ', (['통분한 후', '약분한 후'], 0), ' 분모는 ', (['그대로 쓰고', '분모끼리 더하고'], 0),
            ' 분자끼리 ', (['더합니다', '곱합니다'], 0), '.']
SUB_RULE = ['분모가 다른 분수의 뺄셈은 분수를 ', (['통분한 후', '약분한 후'], 0), ' 분모는 ', (['그대로 쓰고', '분모끼리 빼고'], 0),
            ' 분자끼리 ', (['뺍니다', '더합니다'], 0), '.']
ADD2_RULE = ['분모가 다른 진분수의 덧셈은 두 분모의 ', (['곱이나 최소공배수', '합이나 차'], 0),
             '를 공통분모로 하여 통분한 후 분모는 그대로 쓰고 분자끼리 더합니다. 합이 가분수이면 ', (['대분수', '진분수'], 0), '로 나타낼 수 있어요.']
MIXADD_RULE = ['두 대분수를 통분하여 ', (['자연수는 자연수끼리, 분수는 분수끼리', '분모는 분모끼리, 분자는 분자끼리'], 0), ' 더하거나, 대분수를 ',
               (['가분수', '진분수'], 0), '로 나타내고 두 가분수를 통분하여 더합니다. 분수 부분의 합이 1이거나 1보다 크면 ',
               (['1을 자연수 부분에 더해요', '그대로 두어요'], 0), '.']
COMPARE_WAYS = ['두 분모의 곱을 공통분모로 하여 통분하면 ', (['공통분모를 구하기 쉽고', '약분할 필요가 없고'], 0),
                ', 두 분모의 최소공배수를 공통분모로 하여 통분하면 계산한 결과를 ', (['약분할 필요가 없거나 간단해요', '반드시 약분해야 해요'], 0), '. ']
SORT_BINS = ['덧셈', '뺄셈']


def short_sort(a):
    return '·'.join(x[0] for x in a)


def tb1(s, lv):
    lessons_head(s, 1, '개념 찾기(S)', '단원 도입 ― 유기견 보호 센터에 가요',
                 '분수의 덧셈과 뺄셈, 자연수의 덧셈과 뺄셈은 어떤 공통점과 차이점이 있을까요?', TB_SCENE)
    note_line(s)
    if lv == '기본형':
        step(s, 0, '살펴보기', '나무늘보와 말의 잠')
        s.text(rd('세 발가락 나무늘보는 하루에 [14 4/5]시간 정도, 말은 하루에 [2 9/10]시간 정도 잔대요. (이 활동지에서 정한 예시 값이에요.)'))
        sleep_fig(s, [('세 발가락 나무늘보', '14 4/5'), ('말', '2 9/10')])
        a1 = [pick_eq(s, '나무늘보는 말보다 하루에 몇 시간 더 자는지 구하는 식은?', ['[14 4/5]+[2 9/10]', '[14 4/5]−[2 9/10]'], 1)]
        a1 += chooses(s, [('두 분수 [14 4/5]와 [2 9/10]의 분모는 어떤가요?', ['서로 달라요', '같아요'], 0)])
        step(s, 1, '이야기하기', '덧셈일까, 뺄셈일까')
        if lv == '기본형':
            s.text('‘모두’ 얼마인지 구할 때는 더하고, ‘남은’ 양이나 ‘얼마나 더’ 많은지 구할 때는 빼요.')
        a2 = sort_cards(s, [('미술 시간에 짝과 함께 사용한 철사의 길이는 모두 몇 m일까?', 0), ('입구에서 운동장을 지나 상담소까지의 거리는 몇 km일까?', 0),
                            ('소윤이와 지후가 나누어 준 사료는 모두 몇 kg일까?', 0), ('요리에 사용하고 남은 재료의 양은 얼마일까?', 1),
                            ('나무늘보는 말보다 하루에 몇 시간 더 잘까?', 1), ('지후는 소윤이보다 몇 km 더 많이 걸었을까?', 1)], SORT_BINS)
        step(s, 2, '떠올리기', '분모가 같은 분수')
        if lv == '기본형':
            s.text('분모가 같으면 분모는 그대로 쓰고 분자끼리 더하거나 빼요. 분수 부분끼리 뺄 수 없으면 자연수 1만큼을 분수로 바꾸어요.')
        a3 = calc(s, [{'e': '[3/7]+[5/7]', 'a': '1 1/7'}, {'e': '[1 3/5]+[2 4/5]', 'a': '4 2/5'},
                      {'e': '[5/6]−[2/6]', 'a': '3/6'}, {'e': '[3 1/4]−[1 3/4]', 'a': '1 2/4'}])
        step(s, 3, '떠올리기', '통분')
        if lv == '기본형':
            s.text(rd('4와 6의 최소공배수는 12예요. 점선을 따라 나누면 한 칸이 [1/12]이 돼요. 색칠한 칸을 세어 통분해 보세요.'))
        else:
            s.text(rd('[3/4]과 [1/6]의 막대를 더 잘게 나누는 선을 그어 한 칸의 크기를 같게 만들어 보세요. 두 분모의 최소공배수로 맞춰요.'))
        split_fig(s, [('[3/4]', '3/4'), ('[1/6]', '1/6')], 12, lv == '기본형')
        a4 = chain(s, ['([3/4], [1/6]) → ([{9}/12], [{2}/12])'])
        step(s, 4, '확인하기', '가분수·대분수와 크기 비교')
        a5 = chain(s, ['[2 1/4] = [{9}/4]', '[13/5] = [{2} {3}/5]'])
        a5b = cmp(s, [('[3/4]', '[5/6]'), ('[2/3]', '[3/5]')])
        ans = '1차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s, %s' % (', '.join(a1), short_sort(a2), ', '.join(a3), a4, a5, ' '.join(a5b))
    else:
        step(s, 0, '살펴보기', '코알라와 기린의 잠')
        s.text(rd('코알라는 하루에 [20 1/2]시간 정도, 기린은 하루에 [1 9/10]시간 정도 잔대요. (이 활동지에서 정한 예시 값이에요.)'))
        sleep_fig(s, [('코알라', '20 1/2'), ('기린', '1 9/10')])
        a1 = [pick_eq(s, '코알라와 기린이 하루에 자는 시간을 모두 더하는 식은?', ['[20 1/2]−[1 9/10]', '[20 1/2]+[1 9/10]'], 1)]
        a1 += chooses(s, [('[20 1/2]과 [1 9/10]을 더하려면 먼저 무엇을 해야 할까요?', ['두 분수를 통분해요', '분자끼리 더해요'], 0)])
        step(s, 1, '이야기하기', '말을 잘 읽고 덧셈·뺄셈 정하기')
        a2 = sort_cards(s, [('물통에 [3/4] L가 있는데 1 L를 채우려면 몇 L 더 부어야 할까?', 1), ('어제와 오늘 읽은 책의 양은 모두 얼마일까?', 0),
                            ('사료가 [2 1/2] kg 있었는데 [1 3/4] kg을 주었다면 남은 사료는?', 1), ('강아지 두 마리의 무게를 합하면 몇 kg일까?', 0),
                            ('산책 거리를 [1 1/2] km로 늘리려면 지금보다 몇 km 더 걸어야 할까?', 1), ('간식 두 봉지를 합하면 몇 kg일까?', 0)], SORT_BINS)
        step(s, 2, '떠올리기', '분모가 같은 분수 ― 받아올림·받아내림')
        a3 = calc(s, [{'e': '[5/9]+[7/9]', 'a': '1 3/9'}, {'e': '[2 5/8]+[3 7/8]', 'a': '6 4/8'},
                      {'e': '[11/12]−[7/12]', 'a': '4/12'}, {'e': '[4 2/7]−[1 5/7]', 'a': '2 4/7'}])
        step(s, 3, '떠올리기', '통분 ― [2/3]과 [3/5]')
        s.text(rd('[2/3]과 [3/5]의 막대를 더 잘게 나누는 선을 그어 한 칸의 크기를 같게 만들어 보세요. 두 분모의 최소공배수로 맞춰요.'))
        split_fig(s, [('[2/3]', '2/3'), ('[3/5]', '3/5')], 15, False)
        a4 = chain(s, ['([2/3], [3/5]) → ([{10}/15], [{9}/15])'])
        step(s, 4, '확인하기', '새 가분수·대분수, 크기 비교')
        a5 = chain(s, ['[3 2/5] = [{17}/5]', '[29/6] = [{4} {5}/6]'])
        a5b = cmp(s, [('[5/7]', '[7/10]'), ('[3/8]', '[2/5]')])
        ans = '1차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s, %s' % (', '.join(a1), short_sort(a2), ', '.join(a3), a4, a5, ' '.join(a5b))
    if lv == '도전형':
        step(s, 5, '도전하기', '계산하기 전에 어림하기')
        a6 = chooses(s, [('나무늘보는 말보다 하루에 약 몇 시간 더 잘까요?', ['약 8시간', '약 12시간', '약 17시간'], 1),
                         ('정확한 값은 약 12시간보다 조금 클까요, 조금 작을까요?', ['조금 커요', '조금 작아요'], 1)])
        assert 11.5 < float(F('14 4/5') - F('2 9/10')) < 12
        s.ask(rd('정확한 값이 12시간보다 조금 작은 까닭을 써 보세요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s (14 4/5는 15보다 1/5, 2 9/10는 3보다 1/10 작아요. 빼지는 수가 더 많이 작아서 12보다 조금 작아요. 정확한 값 11 9/10)' % ', '.join(a6)
    return ans


def tb2(s, lv):
    lessons_head(s, 2, '개념 구축하기(O)', '진분수의 덧셈을 해 볼까요(1)', '합이 1보다 작은 분모가 다른 진분수의 덧셈은 어떻게 할까요?',
                 '유기견 보호 센터 입구에서 운동장까지의 거리는 [1/2] km, 운동장에서 상담소까지의 거리는 [1/3] km예요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '조각의 크기 같게 만들기')
        s.text(rd('입구에서 운동장을 지나 상담소까지의 거리를 알아보려고 해요. ' +
                  ('점선을 따라 나누면 한 칸이 [1/6]이 돼요. 색칠한 칸을 세어 보세요.' if lv == '기본형'
                   else '두 막대의 한 칸을 더 잘게 나누는 선을 그어 조각의 크기를 같게 만들어 보세요.')))
        split_fig(s, [('[1/2] km', '1/2'), ('[1/3] km', '1/3')], 6, lv == '기본형')
        a1 = chain(s, ['[1/2] = [{3}/6]', '[1/3] = [{2}/6]', '[1/2]+[1/3] = [{3}/6]+[{2}/6] = [{5}/6]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 통분하기')
        s.text(rd('[1/4]+[3/10]을 두 가지 방법으로 계산해 보세요. 방법 1은 두 분모의 곱을, 방법 2는 두 분모의 최소공배수를 공통분모로 해요.'))
        a2 = two_ways(s, lv, '[1/4]+[3/10]', ['[1/4]+[3/10] = [1×{10}/4×{10}]+[3×{4}/10×{4}]', '= [{10}/{40}]+[{12}/{40}] = [{22}/40]'],
                      ['[1/4]+[3/10] = [1×{5}/4×{5}]+[3×{2}/10×{2}]', '= [{5}/{20}]+[{6}/{20}] = [{11}/20]'])
        step(s, 2, '말해 보기', '두 방법 비교하기')
        a3 = blanks(s, lv, COMPARE_WAYS + ['[22/40]를 약분하면 ', (['[11/20]', '[11/40]', '[22/20]'], 0), '이에요.'])
        assert F('22/40') == F('11/20')
        step(s, 3, '약속하기', '분모가 다른 분수의 덧셈')
        a4 = blanks(s, lv, ADD_RULE)
        step(s, 4, '확인하기', '계산하기')
        if lv == '기본형':
            s.text('먼저 통분하고, 분모는 그대로 쓰고 분자끼리 더해요. 약분하지 않은 분수로 써도 맞아요.')
        a5 = calc(s, [{'e': '[4/9]+[7/15]', 'a': '41/45'}, {'e': '[3/8]+[1/6]', 'a': '13/24'},
                      {'q': '물 로켓을 꾸미는 데 색 테이프를 지훈이는 [3/20] m, 다연이는 [2/5] m 사용했어요. 두 사람이 사용한 색 테이프는 모두 몇 m일까요?',
                       'x': '[3/20]+[2/5]', 'a': '11/20', 'unit': 'm'}])
        ans = '2차시  ① %s (5/6 km)  ② %s  ③ %s  ④ %s  ⑤ %s' % (a1, a2, ', '.join(a3), ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '다른 길 ― [1/4] km와 [2/5] km')
        s.text(rd('다른 길로 가면 입구에서 운동장까지 [1/4] km, 운동장에서 상담소까지 [2/5] km예요. 두 막대의 한 칸을 더 잘게 나누는 선을 그어 조각의 크기를 같게 만들어 보세요.'))
        split_fig(s, [('[1/4] km', '1/4'), ('[2/5] km', '2/5')], 20, False)
        a1 = chain(s, ['[1/4] = [{5}/20]', '[2/5] = [{8}/20]', '[1/4]+[2/5] = [{5}/20]+[{8}/20] = [{13}/20]'])
        step(s, 1, '그려 보기', '[1/6]+[3/8]을 두 가지 방법으로')
        s.text(rd('[1/6]+[3/8]을 두 가지 방법으로 계산해 보세요. 방법 1은 두 분모의 곱을, 방법 2는 두 분모의 최소공배수를 공통분모로 해요.'))
        a2 = two_ways(s, lv, '[1/6]+[3/8]', ['[1/6]+[3/8] = [1×{8}/6×{8}]+[3×{6}/8×{6}]', '= [{8}/{48}]+[{18}/{48}] = [{26}/48]'],
                      ['[1/6]+[3/8] = [1×{4}/6×{4}]+[3×{3}/8×{3}]', '= [{4}/{24}]+[{9}/{24}] = [{13}/24]'])
        step(s, 2, '말해 보기', '곱과 최소공배수 견주기')
        a3 = blanks(s, lv, COMPARE_WAYS + ['[26/48]을 약분하면 ', (['[13/24]', '[13/48]', '[26/24]'], 0), '이에요.'])
        assert F('26/48') == F('13/24')
        step(s, 3, '약속하기', '분모가 다른 분수의 덧셈')
        a4 = blanks(s, lv, ADD_RULE)
        step(s, 4, '확인하기', '새 문제 계산하기')
        a5 = calc(s, [{'e': '[2/9]+[5/12]', 'a': '23/36'}, {'e': '[3/10]+[4/15]', 'a': '17/30'},
                      {'q': '물 로켓을 꾸미는 데 색 테이프를 지훈이는 [5/12] m, 다연이는 [3/8] m 사용했어요. 두 사람이 사용한 색 테이프는 모두 몇 m일까요?',
                       'x': '[5/12]+[3/8]', 'a': '19/24', 'unit': 'm'}])
        ans = '2차시  ① %s (13/20 km)  ② %s  ③ %s  ④ %s  ⑤ %s' % (a1, a2, ', '.join(a3), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        a6 = calc(s, [{'q': '재범: “[1/9]이 2개인 수야.” 은지: “[1/27]이 11개인 수야.” 두 사람이 설명하는 분수의 합은?', 'x': '[2/9]+[11/27]', 'a': '17/27'},
                      {'q': '[5/32], [3/8], [5/16] 중에서 가장 큰 분수와 가장 작은 분수의 합은?', 'x': '[3/8]+[5/32]', 'a': '17/32'},
                      {'q': '이서는 파란색 리본 [7/10] m와 분홍색 리본 [1/4] m를 가지고 있어요. 리본은 모두 몇 m일까요?', 'x': '[7/10]+[1/4]', 'a': '19/20', 'unit': 'm'}])
        assert max(F('5/32'), F('3/8'), F('5/16')) == F('3/8') and min(F('5/32'), F('3/8'), F('5/16')) == F('5/32')
        s.ask('두 분모의 곱과 최소공배수 중 어느 것을 공통분모로 하면 좋을지 까닭과 함께 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s (2/9+11/27, 3/8+5/32) / 까닭: 예) 최소공배수로 하면 수가 작고 약분할 필요가 없어요.' % ', '.join(a6)
    return ans


def tb3(s, lv):
    lessons_head(s, 3, '개념 구축하기(O)', '진분수의 덧셈을 해 볼까요(2)', '합이 1보다 큰 분모가 다른 진분수의 덧셈은 어떻게 할까요?',
                 '유기견들에게 사료를 소윤이는 [3/4] kg, 지후는 [5/8] kg 나누어 주었어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '나누어 준 사료 합치기')
        s.text(rd('두 막대의 조각 크기를 같게 만들고, 나누어 준 사료가 모두 몇 kg인지 알아보세요.' +
                  (' [3/4]의 한 칸을 점선을 따라 2칸으로 나누었어요.' if lv == '기본형' else '')))
        split_fig(s, [('소윤 [3/4] kg', '3/4'), ('지후 [5/8] kg', '5/8')], 8, lv == '기본형')
        a1 = chain(s, ['[3/4] = [{6}/8]', '[3/4]+[5/8] = [{6}/8]+[5/8] = [{11}/8] = [{1} {3}/8]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 더하기')
        s.text(rd('[7/10]+[5/12]를 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[7/10]+[5/12]', ['[7/10]+[5/12] = [7×{12}/10×{12}]+[5×{10}/12×{10}]', '= [{84}/120]+[{50}/120] = [{134}/120] = [{1} {14}/120]'],
                      ['[7/10]+[5/12] = [7×{6}/10×{6}]+[5×{5}/12×{5}]', '= [{42}/60]+[{25}/60] = [{67}/60] = [{1} {7}/60]'])
        step(s, 2, '말해 보기', '잘못된 계산 고치기')
        s.text(rd('친구가 [9/14]+[6/7]을 잘못 계산했어요.'))
        eq_fig(s, [('잘못된 계산', '[9/14]+[6/7] = [9/14]+[6/14] = [15/14]')])
        a3 = chooses(s, [('잘못된 까닭은?', ['분모에만 2를 곱하고 분자에는 곱하지 않았어요', '분모끼리 더했어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[9/14]+[6/7] = [9/14]+[6×{2}/7×{2}]'), ('', '= [9/14]+[{12}/14] = [{21}/14] = [{1} {7}/14]')])
        step(s, 3, '약속하기', '합이 1보다 클 때')
        a4 = blanks(s, lv, ADD2_RULE)
        step(s, 4, '확인하기', '계산하기')
        if lv == '기본형':
            s.text('가분수로 써도, 대분수로 써도 맞아요. 합이 가분수이면 대분수로 나타내 보세요.')
        a5 = calc(s, [{'e': '[6/7]+[8/9]', 'a': '1 47/63'}, {'e': '[13/15]+[11/20]', 'a': '1 5/12'},
                      {'e': '[4/5]+[2/3]', 'a': '1 7/15'}, {'e': '[7/12]+[5/8]', 'a': '1 5/24'}])
        a5b = cmp(s, [('[41/45]+[7/15]', '[4/9]+[17/30]')])
        ans = '3차시  ① %s (1 3/8 kg)  ② %s  ③ %s / %s  ④ %s  ⑤ %s, %s (62/45 > 91/90)' % (
            a1, a2, a3[0], a3b, ', '.join(a4), ', '.join(a5), a5b[0])
    else:
        step(s, 0, '만져 보기', '다음 날 나누어 준 사료')
        s.text(rd('다음 날에는 사료를 소윤이가 [5/6] kg, 지후가 [7/12] kg 나누어 주었어요. 두 막대의 조각 크기를 같게 만들고, 모두 몇 kg인지 알아보세요.'))
        split_fig(s, [('소윤 [5/6] kg', '5/6'), ('지후 [7/12] kg', '7/12')], 12, False)
        a1 = chain(s, ['[5/6] = [{10}/12]', '[5/6]+[7/12] = [{10}/12]+[7/12] = [{17}/12] = [{1} {5}/12]'])
        step(s, 1, '그려 보기', '[5/6]+[3/4]을 두 가지 방법으로')
        s.text(rd('[5/6]+[3/4]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[5/6]+[3/4]', ['[5/6]+[3/4] = [5×{4}/6×{4}]+[3×{6}/4×{6}]', '= [{20}/24]+[{18}/24] = [{38}/24] = [{1} {14}/24]'],
                      ['[5/6]+[3/4] = [5×{2}/6×{2}]+[3×{3}/4×{3}]', '= [{10}/12]+[{9}/12] = [{19}/12] = [{1} {7}/12]'])
        step(s, 2, '말해 보기', '[7/10]+[3/5]의 실수 고치기')
        s.text(rd('친구가 [7/10]+[3/5]을 잘못 계산했어요.'))
        eq_fig(s, [('잘못된 계산', '[7/10]+[3/5] = [7/10]+[3/10] = [10/10] = 1')])
        a3 = chooses(s, [('잘못된 까닭은?', ['분자끼리 더하지 않았어요', '[3/5]의 분모에만 2를 곱하고 분자에는 곱하지 않았어요'], 1)])
        a3b = chain(s, [('옳은 계산', '[7/10]+[3/5] = [7/10]+[3×{2}/5×{2}]'), ('', '= [7/10]+[{6}/10] = [{13}/10] = [{1} {3}/10]')])
        step(s, 3, '약속하기', '합이 1보다 클 때')
        a4 = blanks(s, lv, ADD2_RULE)
        step(s, 4, '확인하기', '합이 1보다 큰 덧셈')
        a5 = calc(s, [{'e': '[5/8]+[9/10]', 'a': '1 21/40'}, {'e': '[11/12]+[7/18]', 'a': '1 11/36'},
                      {'e': '[3/4]+[4/5]', 'a': '1 11/20'}, {'e': '[8/9]+[5/6]', 'a': '1 13/18'}])
        a5b = cmp(s, [('[5/6]+[3/4]', '[7/8]+[2/3]')])
        ans = '3차시  ① %s (1 5/12 kg)  ② %s  ③ %s / %s  ④ %s  ⑤ %s, %s (19/12 > 37/24)' % (
            a1, a2, a3[0], a3b, ', '.join(a4), ', '.join(a5), a5b[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '수 카드로 진분수 만들기')
        a6 = proper_cards(s, lv, [4, 5, 6, 7, 8], '[7/8]+[5/6]')
        s.ask('합이 가장 크게 되려면 어떤 진분수를 만들면 좋을지 생각을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s (만든 진분수에 따라 답이 달라요)' % a6
    return ans


def tb4(s, lv):
    lessons_head(s, 4, '개념 구축하기(O)', '대분수의 덧셈을 해 볼까요', '분모가 다른 대분수의 덧셈은 어떻게 할까요?',
                 '소윤이는 청소하는 데 같은 크기의 통으로 물을 [2 2/3]통 사용한 후 부족하여 [1 1/2]통 더 사용했어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '물의 양 색칠하고 모으기')
        e1 = est(s, '청소하는 데 물을 4통보다 많이 사용했을까요, 적게 사용했을까요?', ['4통보다 많아요', '4통보다 적어요'], 0)
        s.text(rd('한 통을 6칸으로 나눈 막대에 [2 2/3]통과 [1 1/2]통을 색칠해 보세요. [2 2/3] = [2 4/6], [1 1/2] = [1 3/6]이에요.'
                  if lv == '기본형' else '한 통을 6칸으로 나눈 막대에 [2 2/3]통과 [1 1/2]통을 색칠하고, 자연수 부분끼리, 분수 부분끼리 모아 보세요.'))
        fill_fig(s, [('처음 [2 2/3]통', '2 2/3'), ('더 [1 1/2]통', '1 1/2')], 6)
        a1 = calc(s, [{'q': '청소하는 데 사용한 물은 모두 몇 통일까요?', 'e': '[2 2/3]+[1 1/2]', 'a': '4 1/6', 'unit': '통'}])
        step(s, 1, '그려 보기', '두 가지 방법으로 더하기')
        s.text(rd('[1 3/4]+[2 1/8]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[1 3/4]+[2 1/8]', ['[1 3/4]+[2 1/8] = [{1} {6}/8]+[2 1/8]', '= ({1}+{2})+([{6}/8]+[1/8]) = [{3} {7}/8]'],
                      ['[1 3/4]+[2 1/8] = [{7}/4]+[{17}/8]', '= [{14}/8]+[17/8] = [{31}/8] = [{3} {7}/8]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '두 방법 설명하기')
        s.text(rd('[2 3/5]+[3 5/6]를 두 가지 방법으로 계산하고, 두 방법을 설명해 보세요.'))
        a3 = chain(s, [('방법 1', '[2 3/5]+[3 5/6] = [2 {18}/30]+[3 {25}/30]'), ('', '= {5}+[{43}/30] = [{6} {13}/30]'),
                       ('방법 2', '[2 3/5]+[3 5/6] = [{13}/5]+[{23}/6]'), ('', '= [{78}/30]+[{115}/30] = [{193}/30] = [{6} {13}/30]')])
        W2 = ['자연수는 자연수끼리, 분수는 분수끼리 더했어요', '대분수를 가분수로 나타내어 더했어요']
        a3b = blanks(s, '기본형', ['방법 1은 ', (W2, 0), '.  방법 2는 ', (W2, 1), '.'])
        step(s, 3, '약속하기', '대분수의 덧셈 방법')
        a4 = blanks(s, lv, MIXADD_RULE)
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'q': '예준이는 자전거를 어제는 [1 2/15]시간, 오늘은 [1 7/12]시간 탔어요. 모두 몇 시간 탔을까요?', 'x': '[1 2/15]+[1 7/12]', 'a': '2 43/60', 'unit': '시간'},
                      {'e': '[1 2/15]+[2 9/10]', 'a': '4 1/30'}, {'e': '[4 5/9]+[2 7/27]', 'a': '6 22/27'},
                      {'q': '혜리는 고구마를 [1 3/5] kg 캤고, 윤호는 혜리보다 [2 1/7] kg 더 캤어요. 윤호가 캔 고구마는 몇 kg일까요?', 'x': '[1 3/5]+[2 1/7]', 'a': '3 26/35', 'unit': 'kg'}])
        ans = '4차시  ① %s, %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (e1, a1[0], a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '다른 날 사용한 물')
        s.text(rd('다른 날에는 청소하는 데 물을 [1 3/4]통 사용한 후 [2 5/6]통 더 사용했어요.'))
        e1 = est(s, '두 번 사용한 물을 합하면 4통이 넘을까요?', ['4통이 넘어요', '4통이 넘지 않아요'], 0)
        s.text(rd('한 통을 12칸으로 나눈 막대에 [1 3/4]통과 [2 5/6]통을 색칠하고, 자연수 부분끼리, 분수 부분끼리 모아 보세요.'))
        fill_fig(s, [('처음 [1 3/4]통', '1 3/4'), ('더 [2 5/6]통', '2 5/6')], 12)
        a1 = calc(s, [{'q': '이날 청소에 쓴 물은 모두 몇 통일까요?', 'e': '[1 3/4]+[2 5/6]', 'a': '4 7/12', 'unit': '통'}])
        step(s, 1, '그려 보기', '[2 2/5]+[1 7/10]을 두 가지 방법으로')
        s.text(rd('[2 2/5]+[1 7/10]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[2 2/5]+[1 7/10]', ['[2 2/5]+[1 7/10] = [{2} {4}/10]+[1 7/10]', '= ({2}+{1})+([{4}/10]+[7/10]) = [{4} {1}/10]'],
                      ['[2 2/5]+[1 7/10] = [{12}/5]+[{17}/10]', '= [{24}/10]+[17/10] = [{41}/10] = [{4} {1}/10]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '[3 4/9]+[1 5/6] 두 방법 설명하기')
        s.text(rd('[3 4/9]+[1 5/6]를 두 가지 방법으로 계산하고, 두 방법을 설명해 보세요.'))
        a3 = chain(s, [('방법 1', '[3 4/9]+[1 5/6] = [3 {8}/18]+[1 {15}/18]'), ('', '= {4}+[{23}/18] = [{5} {5}/18]'),
                       ('방법 2', '[3 4/9]+[1 5/6] = [{31}/9]+[{11}/6]'), ('', '= [{62}/18]+[{33}/18] = [{95}/18] = [{5} {5}/18]')])
        W2 = ['자연수는 자연수끼리, 분수는 분수끼리 더했어요', '대분수를 가분수로 나타내어 더했어요']
        a3b = blanks(s, lv, ['방법 1은 ', (W2, 0), '.  방법 2는 ', (W2, 1), '.'])
        step(s, 3, '약속하기', '대분수의 덧셈 방법')
        a4 = blanks(s, lv, MIXADD_RULE)
        step(s, 4, '확인하기', '여러 단계로 계산하기')
        a5 = calc(s, [{'q': '예준이는 자전거를 어제는 [2 3/8]시간, 오늘은 [1 5/6]시간 탔어요. 모두 몇 시간 탔을까요?', 'x': '[2 3/8]+[1 5/6]', 'a': '4 5/24', 'unit': '시간'},
                      {'e': '[3 7/12]+[2 4/9]', 'a': '6 1/36'}, {'e': '[1 11/15]+[4 7/10]', 'a': '6 13/30'},
                      {'q': '혜리는 고구마를 [2 4/9] kg 캤고, 윤호는 혜리보다 [1 5/6] kg 더 캤어요. 두 사람이 캔 고구마는 모두 몇 kg일까요?', 'x': '[2 4/9]+[2 4/9]+[1 5/6]', 'a': '6 13/18', 'unit': 'kg'}])
        ans = '4차시  ① %s, %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s (윤호 4 5/18 kg)' % (e1, a1[0], a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        opts = ['[2 1/4]+[3 1/6]', '[3 1/2]+[2 1/6]', '[3 1/3]+[2 1/12]']
        k, vals = odd_one(opts)
        a6 = pick_eq(s, '합이 다른 하나를 골라요.', opts, k)
        a7 = calc(s, [{'q': '[1 7/8]+[4 5/12]를 계산해요.', 'x': '[1 7/8]+[4 5/12]', 'a': '6 7/24'}])
        tot = ev('[1 7/8]+[4 5/12]')
        n = len([m for m in range(1, 20) if tot > m])
        assert n == 6
        eq_fig(s, ['[1 7/8]+[4 5/12] > □'], indent=30)
        s.ask('□ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?   (        )개', blank=False)
        s.ask('왜 그 개수인지 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s (㉠ %s, ㉡ %s, ㉢ %s)  %s  %d개(1~6)' % (a6, red(vals[0]), red(vals[1]), red(vals[2]), a7[0], n)
    return ans


def tb5(s, lv):
    lessons_head(s, 5, '개념 구축하기(O)', '진분수의 뺄셈을 해 볼까요', '분모가 다른 진분수의 뺄셈은 어떻게 할까요?',
                 '소윤이는 유기견들에게 영양제를 주기 위해 영양제 [5/6] g 중에서 [1/2] g을 덜어 냈어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '덜어 낸 영양제')
        s.text(rd('막대에 [5/6]만큼 색칠되어 있어요. [1/2]만큼 ×표 해 보세요.' + (' 한 칸은 [1/6]이에요.' if lv == '기본형' else '')))
        take_fig(s, '영양제 [5/6] g', '5/6', 6)
        a1 = chain(s, ['[1/2] = [{3}/6]', '[5/6]−[1/2] = [5/6]−[{3}/6] = [{2}/6]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 빼기')
        s.text(rd('[2/9]−[1/6]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[2/9]−[1/6]', ['[2/9]−[1/6] = [2×{6}/9×{6}]−[1×{9}/6×{9}]', '= [{12}/54]−[{9}/54] = [{3}/54]'],
                      ['[2/9]−[1/6] = [2×{2}/9×{2}]−[1×{3}/6×{3}]', '= [{4}/18]−[{3}/18] = [{1}/18]'])
        step(s, 2, '말해 보기', '유나와 다른 방법')
        s.text(rd('유나는 [5/8]−[3/10]을 다음과 같이 계산했어요. 유나와 다른 방법으로 계산하고, 두 방법을 비교해 보세요.'))
        a3 = chain(s, [('유나의 방법', '[5/8]−[3/10] = [50/80]−[24/80] = [26/80] = [13/40]'),
                       ('다른 방법', '[5/8]−[3/10] = [5×{5}/8×{5}]−[3×{4}/10×{4}]'), ('', '= [{25}/40]−[{12}/40] = [{13}/40]')])
        a3b = blanks(s, lv, ['유나의 공통분모 80은 두 분모의 ', (['곱', '최소공배수'], 0), '이고, 40은 두 분모의 ', (['곱', '최소공배수'], 1), '예요.'])
        assert lcm(8, 10) == 40
        step(s, 3, '약속하기', '분모가 다른 분수의 뺄셈')
        a4 = blanks(s, lv, SUB_RULE)
        step(s, 4, '확인하기', '계산하기')
        if lv == '기본형':
            s.text('분모끼리, 분자끼리 빼면 안 돼요. 먼저 통분해요.')
        a5 = calc(s, [{'q': '케이크를 만드는 데 다연이는 우유를 [6/7] L, 시우는 [2/5] L 사용했어요. 다연이는 시우보다 우유를 몇 L 더 사용했을까요?', 'x': '[6/7]−[2/5]', 'a': '16/35', 'unit': 'L'},
                      {'e': '[4/5]−[1/2]', 'a': '3/10'}, {'e': '[7/9]−[1/6]', 'a': '11/18'}, {'e': '[7/8]−[3/10]', 'a': '23/40'}, {'e': '[11/12]−[1/15]', 'a': '17/20'}])
        ans = '5차시  ① %s (×표 3칸, 남은 영양제 2/6 g = 1/3 g)  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (
            a1, a2, a3.split(' / ', 1)[1], ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '[7/8] g에서 덜어 내기')
        s.text(rd('이번에는 영양제 [7/8] g 중에서 [1/4] g을 덜어 냈어요. 막대에 [7/8]만큼 색칠되어 있어요. [1/4]만큼 ×표 해 보세요.'))
        take_fig(s, '영양제 [7/8] g', '7/8', 8)
        a1 = chain(s, ['[1/4] = [{2}/8]', '[7/8]−[1/4] = [7/8]−[{2}/8] = [{5}/8]'])
        step(s, 1, '그려 보기', '[5/6]−[3/8]을 두 가지 방법으로')
        s.text(rd('[5/6]−[3/8]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[5/6]−[3/8]', ['[5/6]−[3/8] = [5×{8}/6×{8}]−[3×{6}/8×{6}]', '= [{40}/48]−[{18}/48] = [{22}/48]'],
                      ['[5/6]−[3/8] = [5×{4}/6×{4}]−[3×{3}/8×{3}]', '= [{20}/24]−[{9}/24] = [{11}/24]'])
        step(s, 2, '말해 보기', '유나와 다른 방법 ― [7/12]−[4/9]')
        s.text(rd('유나는 [7/12]−[4/9]을 다음과 같이 계산했어요. 유나와 다른 방법으로 계산하고, 두 방법을 비교해 보세요.'))
        a3 = chain(s, [('유나의 방법', '[7/12]−[4/9] = [63/108]−[48/108] = [15/108] = [5/36]'),
                       ('다른 방법', '[7/12]−[4/9] = [7×{3}/12×{3}]−[4×{4}/9×{4}]'), ('', '= [{21}/36]−[{16}/36] = [{5}/36]')])
        a3b = blanks(s, lv, ['유나의 공통분모 108은 두 분모의 ', (['곱', '최소공배수'], 0), '이고, 36은 두 분모의 ', (['곱', '최소공배수'], 1), '예요.'])
        assert lcm(12, 9) == 36
        step(s, 3, '약속하기', '분모가 다른 분수의 뺄셈')
        a4 = blanks(s, lv, SUB_RULE)
        step(s, 4, '확인하기', '새 문제 계산하기')
        a5 = calc(s, [{'q': '케이크를 만드는 데 다연이는 우유를 [8/9] L, 시우는 [5/12] L 사용했어요. 다연이는 시우보다 우유를 몇 L 더 사용했을까요?', 'x': '[8/9]−[5/12]', 'a': '17/36', 'unit': 'L'},
                      {'e': '[5/6]−[2/9]', 'a': '11/18'}, {'e': '[9/10]−[3/4]', 'a': '3/20'}, {'e': '[13/15]−[5/12]', 'a': '9/20'}, {'e': '[5/8]−[7/12]', 'a': '1/24'}])
        ans = '5차시  ① %s (×표 2칸, 남은 영양제 5/8 g)  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (
            a1, a2, a3.split(' / ', 1)[1], ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        s.text(rd('어떤 수에서 [2/7]를 빼야 하는데 잘못하여 더했더니 [16/21]이 되었어요.'))
        a6 = calc(s, [{'q': '어떤 수는?', 'x': '[16/21]−[2/7]', 'a': '10/21'}, {'q': '바르게 계산한 값은?', 'x': '[10/21]−[2/7]', 'a': '4/21'}])
        s.text(rd('실과 시간에 모형을 꾸미는 데 색 테이프를 유진이는 [3/7] m, 동원이는 [2/9] m 사용했어요.'))
        assert F('3/7') > F('2/9')
        a7 = chooses(s, [('누가 더 많이 사용했을까요?', ['유진', '동원'], 0)])
        a8 = calc(s, [{'q': '몇 m 더 많이 사용했을까요?', 'x': '[3/7]−[2/9]', 'a': '13/63', 'unit': 'm'}])
        s.ask('어떤 수를 어떻게 구했는지 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ 어떤 수 %s, 바른 값 %s, %s, %s' % (a6[0], a6[1], a7[0], a8[0])
    return ans


def tb6(s, lv):
    lessons_head(s, 6, '개념 구축하기(O)', '대분수의 뺄셈을 해 볼까요(1)', '분수 부분끼리 뺄 수 있는 분모가 다른 대분수의 뺄셈은 어떻게 할까요?',
                 '유기견들을 산책시키는 데 지후는 [1 1/2] km, 소윤이는 [1 1/5] km를 걸었어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '걸은 거리 비교하기')
        s.text(rd('1 km를 10칸으로 나눈 막대에 지후가 걸은 거리가 색칠되어 있어요. 소윤이가 걸은 거리만큼 ×표 하여 지후가 몇 km 더 걸었는지 알아보세요.'
                  + (' [1 1/5] = [1 2/10]예요.' if lv == '기본형' else '')))
        take_fig(s, '지후 [1 1/2] km', '1 1/2', 10)
        a1 = chain(s, ['[1 1/2] = [1 {5}/10]', '[1 1/5] = [1 {2}/10]', '[1 1/2]−[1 1/5] = [1 {5}/10]−[1 {2}/10] = [{3}/10]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 빼기')
        s.text(rd('[3 5/6]−[1 2/3]를 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[3 5/6]−[1 2/3]', ['[3 5/6]−[1 2/3] = [3 5/6]−[1 {4}/6]', '= ({3}−{1})+([5/6]−[{4}/6]) = [{2} {1}/6]'],
                      ['[3 5/6]−[1 2/3] = [{23}/6]−[{5}/3]', '= [23/6]−[{10}/6] = [{13}/6] = [{2} {1}/6]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '두 방법의 좋은 점')
        s.text(rd('[4 3/4]−[2 1/6]을 두 가지 방법으로 계산하고, 두 방법의 좋은 점을 말해 보세요.'))
        a3 = chain(s, [('방법 1', '[4 3/4]−[2 1/6] = [4 {9}/12]−[2 {2}/12] = [{2} {7}/12]'),
                       ('방법 2', '[4 3/4]−[2 1/6] = [{19}/4]−[{13}/6]'), ('', '= [{57}/12]−[{26}/12] = [{31}/12] = [{2} {7}/12]')])
        G2 = ['분수 부분의 계산이 편리해요', '자연수 부분과 분수 부분을 따로 계산하지 않아서 편리해요']
        a3b = blanks(s, '기본형', ['자연수는 자연수끼리, 분수는 분수끼리 계산하면 ', (G2, 0), '.  대분수를 가분수로 나타내어 계산하면 ', (G2, 1), '.'])
        step(s, 3, '약속하기', '대분수의 뺄셈 방법')
        a4 = blanks(s, lv, ['두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 ', (['빼거나', '더하거나'], 0), ', 대분수를 ', (['가분수', '진분수'], 0),
                            '로 나타내고 두 가분수를 통분하여 뺍니다. 자연수끼리 뺀 결과와 분수끼리 뺀 결과는 ', (['더해요', '빼요'], 0), '.'])
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'q': '세계에서 가장 긴 공룡 발자국의 길이는 [1 3/4] m, 두 번째로 긴 공룡 발자국의 길이는 [1 11/20] m라고 해요(교과서의 수와 다를 수 있어요). 두 발자국의 길이의 차는 몇 m일까요?',
                       'x': '[1 3/4]−[1 11/20]', 'a': '1/5', 'unit': 'm'},
                      {'e': '[4 4/5]−[2 1/3]', 'a': '2 7/15'}, {'e': '[5 3/4]−[3 3/8]', 'a': '2 3/8'}, {'e': '[8 5/6]−[3 1/14]', 'a': '5 16/21'}])
        ans = '6차시  ① %s (×표 1 km 막대와 2칸, 3/10 km)  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (a1, a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '다음 날 걸은 거리')
        s.text(rd('다음 날에는 지후가 [2 3/4] km, 소윤이가 [1 1/6] km를 걸었어요. 1 km를 12칸으로 나눈 막대에 지후가 걸은 거리가 색칠되어 있어요. 소윤이가 걸은 거리만큼 ×표 해 보세요.'))
        take_fig(s, '지후 [2 3/4] km', '2 3/4', 12)
        a1 = chain(s, ['[2 3/4] = [2 {9}/12]', '[1 1/6] = [1 {2}/12]', '[2 3/4]−[1 1/6] = [2 {9}/12]−[1 {2}/12] = [{1} {7}/12]'])
        step(s, 1, '그려 보기', '[5 7/8]−[2 1/6]을 두 가지 방법으로')
        s.text(rd('[5 7/8]−[2 1/6]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[5 7/8]−[2 1/6]', ['[5 7/8]−[2 1/6] = [5 {21}/24]−[2 {4}/24]', '= ({5}−{2})+([{21}/24]−[{4}/24]) = [{3} {17}/24]'],
                      ['[5 7/8]−[2 1/6] = [{47}/8]−[{13}/6]', '= [{141}/24]−[{52}/24] = [{89}/24] = [{3} {17}/24]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '[6 5/6]−[3 4/15] 두 방법의 좋은 점')
        s.text(rd('[6 5/6]−[3 4/15]을 두 가지 방법으로 계산하고, 두 방법의 좋은 점을 말해 보세요.'))
        a3 = chain(s, [('방법 1', '[6 5/6]−[3 4/15] = [6 {25}/30]−[3 {8}/30] = [{3} {17}/30]'),
                       ('방법 2', '[6 5/6]−[3 4/15] = [{41}/6]−[{49}/15]'), ('', '= [{205}/30]−[{98}/30] = [{107}/30] = [{3} {17}/30]')])
        G2 = ['분수 부분의 계산이 편리해요', '자연수 부분과 분수 부분을 따로 계산하지 않아서 편리해요']
        a3b = blanks(s, lv, ['자연수는 자연수끼리, 분수는 분수끼리 계산하면 ', (G2, 0), '.  대분수를 가분수로 나타내어 계산하면 ', (G2, 1), '.'])
        step(s, 3, '약속하기', '대분수의 뺄셈 방법')
        a4 = blanks(s, lv, ['두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 ', (['빼거나', '더하거나'], 0), ', 대분수를 ', (['가분수', '진분수'], 0),
                            '로 나타내고 두 가분수를 통분하여 뺍니다. 자연수끼리 뺀 결과와 분수끼리 뺀 결과는 ', (['더해요', '빼요'], 0), '.'])
        step(s, 4, '확인하기', '새 문제 계산하기')
        a5 = calc(s, [{'q': '공룡 발자국 모형 두 개의 길이가 [1 5/6] m, [1 3/10] m예요. 두 모형의 길이의 차는 몇 m일까요?',
                       'x': '[1 5/6]−[1 3/10]', 'a': '8/15', 'unit': 'm'},
                      {'e': '[5 7/9]−[2 1/6]', 'a': '3 11/18'}, {'e': '[7 5/8]−[4 1/12]', 'a': '3 13/24'}, {'e': '[9 11/12]−[5 3/8]', 'a': '4 13/24'}])
        ans = '6차시  ① %s (×표 1 km 막대와 2칸, 1 7/12 km)  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (a1, a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        a6 = calc(s, [{'q': '수지네 집에서 문구점까지는 [2 13/16] km, 도서관까지는 [1 7/12] km예요. 문구점은 도서관보다 몇 km 더 멀까요?', 'x': '[2 13/16]−[1 7/12]', 'a': '1 11/48', 'unit': 'km'},
                      {'q': '승민: “[7 11/15]보다 [1 9/20]만큼 더 작은 수야.” 승민이가 설명하는 수는?', 'x': '[7 11/15]−[1 9/20]', 'a': '6 17/60'},
                      {'q': '두 수 [2 25/32]와 [1 3/8]의 차는?', 'x': '[2 25/32]−[1 3/8]', 'a': '1 13/32'}])
        s.ask('자연수끼리 뺀 결과와 분수끼리 뺀 결과를 더해야 하는 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s' % ', '.join(a6)
    return ans


def tb7(s, lv):
    lessons_head(s, 7, '개념 구축하기(O)', '대분수의 뺄셈을 해 볼까요(2)', '분수 부분끼리 뺄 수 없는 분모가 다른 대분수의 뺄셈은 어떻게 할까요?',
                 '유기견들의 간식을 만드는 데 고구마를 소윤이는 [2 1/3] kg, 지후는 [1 3/4] kg 사용했어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '고구마의 양 비교하기')
        s.text(rd('1 kg을 12칸으로 나눈 막대에 소윤이가 사용한 양이 색칠되어 있어요. 지후가 사용한 양만큼 ×표 해 보세요.'
                  + (' [1 3/4] = [1 9/12]예요. 칸이 모자라면 1 kg 막대 하나를 [12/12]로 생각해요.' if lv == '기본형' else '')))
        take_fig(s, '소윤 [2 1/3] kg', '2 1/3', 12)
        a1 = chain(s, ['[2 1/3] = [2 {4}/12] = [1 {16}/12]', '[1 3/4] = [1 {9}/12]', '[2 1/3]−[1 3/4] = [1 {16}/12]−[1 {9}/12] = [{7}/12]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 빼기')
        s.text(rd('[4 1/2]−[1 2/3]를 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[4 1/2]−[1 2/3]', ['[4 1/2]−[1 2/3] = [4 {3}/6]−[1 {4}/6] = [{3} {9}/6]−[1 4/6]', '= ({3}−{1})+([{9}/6]−[4/6]) = [{2} {5}/6]'],
                      ['[4 1/2]−[1 2/3] = [{9}/2]−[{5}/3]', '= [{27}/6]−[{10}/6] = [{17}/6] = [{2} {5}/6]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '예준이와 다른 방법')
        s.text(rd('예준이는 [3 1/4]−[2 5/8]를 가분수로 나타내어 계산했어요. 예준이와 다른 방법으로 계산해 보세요.'))
        a3 = chain(s, [('예준이의 방법', '[3 1/4]−[2 5/8] = [13/4]−[21/8] = [26/8]−[21/8] = [5/8]'),
                       ('다른 방법', '[3 1/4]−[2 5/8] = [3 {2}/8]−[2 5/8]'), ('', '= [{2} {10}/8]−[2 5/8] = [{5}/8]')])
        a3b = blanks(s, lv, ['[2/8]에서 [5/8]를 뺄 수 없어서 자연수 부분의 ', (['1만큼을 분수로', '분모를 분자로'], 0), ' 나타내었어요.'])
        step(s, 3, '약속하기', '분수 부분끼리 뺄 수 없을 때')
        a4 = blanks(s, lv, ['분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 ', (['1만큼을', '분수 부분만큼을'], 0), ' 분수로 나타내어 계산해요. 이때 자연수 부분은 ',
                            (['1 작아져요', '그대로예요'], 0), '.'])
        step(s, 4, '확인하기', '알맞은 문제 고르고 해결하기')
        a5 = chooses(s, [('[5 1/6]−[2 4/9]에 알맞은 문제는?',
                          ['민규의 리본은 [5 1/6] m, 유진이의 리본은 [2 4/9] m예요. 민규의 리본은 유진이의 리본보다 몇 m 더 길까요?',
                           '민규의 리본은 [5 1/6] m, 유진이의 리본은 [2 4/9] m예요. 두 사람의 리본은 모두 몇 m일까요?'], 0)])
        a5b = calc(s, [{'q': '고른 문제를 해결해요.', 'x': '[5 1/6]−[2 4/9]', 'a': '2 13/18', 'unit': 'm'},
                       {'e': '[3 5/8]−[1 3/4]', 'a': '1 7/8'}, {'e': '[4 5/12]−[2 8/15]', 'a': '1 53/60'}])
        ans = '7차시  ① %s (×표 1 kg 막대와 9칸)  ② %s  ③ %s / %s  ④ %s  ⑤ %s, %s' % (
            a1, a2, a3.split(' / ', 1)[1], ', '.join(a3b), ', '.join(a4), a5[0], ', '.join(a5b))
    else:
        step(s, 0, '만져 보기', '다른 날 사용한 고구마')
        s.text(rd('다른 날에는 고구마를 소윤이가 [3 1/4] kg, 지후가 [1 5/6] kg 사용했어요. 1 kg을 12칸으로 나눈 막대에 소윤이가 사용한 양이 색칠되어 있어요. 지후가 사용한 양만큼 ×표 해 보세요.'))
        take_fig(s, '소윤 [3 1/4] kg', '3 1/4', 12)
        a1 = chain(s, ['[3 1/4] = [3 {3}/12] = [2 {15}/12]', '[1 5/6] = [1 {10}/12]', '[3 1/4]−[1 5/6] = [2 {15}/12]−[1 {10}/12] = [{1} {5}/12]'])
        step(s, 1, '그려 보기', '[5 1/3]−[2 3/4]를 두 가지 방법으로')
        s.text(rd('[5 1/3]−[2 3/4]를 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[5 1/3]−[2 3/4]', ['[5 1/3]−[2 3/4] = [5 {4}/12]−[2 {9}/12] = [{4} {16}/12]−[2 9/12]', '= ({4}−{2})+([{16}/12]−[9/12]) = [{2} {7}/12]'],
                      ['[5 1/3]−[2 3/4] = [{16}/3]−[{11}/4]', '= [{64}/12]−[{33}/12] = [{31}/12] = [{2} {7}/12]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '예준이와 다른 방법 ― [4 1/6]−[2 7/9]')
        s.text(rd('예준이는 [4 1/6]−[2 7/9]를 가분수로 나타내어 계산했어요. 예준이와 다른 방법으로 계산해 보세요.'))
        a3 = chain(s, [('예준이의 방법', '[4 1/6]−[2 7/9] = [25/6]−[25/9] = [75/18]−[50/18] = [25/18]'),
                       ('다른 방법', '[4 1/6]−[2 7/9] = [4 {3}/18]−[2 {14}/18]'), ('', '= [{3} {21}/18]−[2 14/18] = [{1} {7}/18]')])
        a3b = blanks(s, lv, ['[3/18]에서 [14/18]를 뺄 수 없어서 자연수 부분의 ', (['1만큼을 분수로', '분모를 분자로'], 0), ' 나타내었어요.'])
        step(s, 3, '약속하기', '분수 부분끼리 뺄 수 없을 때')
        a4 = blanks(s, lv, ['분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 ', (['1만큼을', '분수 부분만큼을'], 0), ' 분수로 나타내어 계산해요. 이때 자연수 부분은 ',
                            (['1 작아져요', '그대로예요'], 0), '.'])
        step(s, 4, '확인하기', '알맞은 문제 고르고 새 계산 하기')
        a5 = chooses(s, [('[6 1/4]−[3 5/6]에 알맞은 문제는?',
                          ['민규의 끈은 [6 1/4] m, 유진이의 끈은 [3 5/6] m예요. 두 사람의 끈은 모두 몇 m일까요?',
                           '민규의 끈은 [6 1/4] m, 유진이의 끈은 [3 5/6] m예요. 민규의 끈은 유진이의 끈보다 몇 m 더 길까요?'], 1)])
        a5b = calc(s, [{'q': '고른 문제를 해결해요.', 'x': '[6 1/4]−[3 5/6]', 'a': '2 5/12', 'unit': 'm'},
                       {'e': '[5 2/9]−[2 5/6]', 'a': '2 7/18'}, {'e': '[7 3/10]−[4 7/8]', 'a': '2 17/40'}])
        ans = '7차시  ① %s (×표 1 kg 막대와 10칸)  ② %s  ③ %s / %s  ④ %s  ⑤ %s, %s' % (
            a1, a2, a3.split(' / ', 1)[1], ', '.join(a3b), ', '.join(a4), a5[0], ', '.join(a5b))
    if lv == '도전형':
        step(s, 5, '도전하기', '수 카드로 대분수 만들기')
        s.text('수 카드 2, 5, 8을 한 번씩만 사용하여 가장 큰 대분수와 가장 작은 대분수를 만들고, 두 수의 차를 구해 보세요.')
        a6 = mixed_cards(s, lv, [('① 큰 수', [2, 5, 8], 'max'), ('② 작은 수', [2, 5, 8], 'min')], '-')
        s.ask('가장 큰 대분수를 만들 때 자연수 부분에 어떤 카드를 놓았는지, 왜 그렇게 했는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s' % a6
    return ans


def tb8(s, lv):
    lessons_head(s, 8, '탐구 정리하기(O)', '생각을 더하다 ― 음표로 분수의 덧셈을 해 볼까요', '음표의 길이를 분수로 나타내어 악보를 완성할 수 있을까요?',
                 '「비행기」 악보의 2/4박자는 4분음표를 1박으로 하여 각 마디가 모두 2박으로 이루어져 있다는 뜻이에요.')
    if lv == '기본형':
        step(s, 0, '음표의 박 알아보기', '4분음표를 1박으로')
        notes_fig(s, ['q', 'e', 's'], label=True)
        a1 = chooses(s, [('4분음표를 1박으로 하면 8분음표는 몇 박일까요?', ['[1/2]박', '2박', '[1/8]박'], 0),
                         ('16분음표는 몇 박일까요?', ['[1/4]박', '[1/16]박', '4박'], 0),
                         ('점음표에서 점의 길이는?', ['본 음표 길이의 반', '본 음표 길이와 같음'], 0)])
        step(s, 1, '점 8분음표', '분수의 덧셈으로 박 구하기')
        notes_fig(s, ['de'])
        s.text('점 8분음표 = 8분음표 + 16분음표')
        a2 = chain(s, ['[1/2]+[1/4] = [{2}/4]+[1/4] = [{3}/4]'])
        assert beats(['de']) == F('3/4')
        s.ask('그래서 점 8분음표는 몇 박일까요?')
        step(s, 2, '마디 확인하기', '㉠ 마디')
        s.text('㉠ 마디에는 점 8분음표, 16분음표, 8분음표, 8분음표가 있어요. ㉠ 마디가 2/4박자에 맞는지 박을 더해 확인해 보세요.')
        measure_fig(s, '㉠ 마디 (2/4박자)', 2, ['de', 's', 'e', 'e'], slot=False)
        a3 = chain(s, ['[3/4]+[1/4]+[1/2]+[1/2] = [3/4]+[1/4]+[{2}/4]+[{2}/4] = [{8}/4] = {2}'])
        assert beats(['de', 's', 'e', 'e']) == 2
        a3b = chooses(s, [('㉠ 마디는 2/4박자가 맞나요?', ['맞아요', '아니에요'], 0)])
        step(s, 3, '음표 넣기', '㉡ 마디 완성하기')
        s.text('㉡ 마디에는 8분음표, 8분음표, 점 8분음표가 있어요. 빈칸에 알맞은 음표 하나를 넣어 2/4박자에 맞게 완성해 보세요.')
        measure_fig(s, '㉡ 마디 (2/4박자)', 2, ['e', 'e', 'de'])
        need2 = 2 - beats(['e', 'e', 'de'])
        a4 = chain(s, ['[1/2]+[1/2]+[3/4] = [{7}/4] = [{1} {3}/4]', '2−[1 3/4] = [{1}/4]'])
        assert need2 == beats(['s'])
        if lv == '기본형':
            s.wordbox(['16분음표', '8분음표', '점 8분음표', '4분음표', '2분음표'])
        s.ask('빈칸에 들어갈 음표는?')
        step(s, 4, '악보 완성하기', '4/4박자 마디')
        s.text('4/4박자 악보예요. 마디마다 4박이 되도록 빈칸에 알맞은 음표를 넣어 보세요. 첫 번째 마디는 음표 하나만 넣어요.')
        measure_fig(s, '첫 번째 마디 (4/4박자)', 4, ['e', 'q', 'q', 'de'])
        measure_fig(s, '두 번째 마디 (4/4박자)', 4, ['s', 'e', 'e', 'de'])
        n1, n2 = 4 - beats(['e', 'q', 'q', 'de']), 4 - beats(['s', 'e', 'e', 'de'])
        assert n1 == beats(['de']) and n2 == beats(['hf'])
        a5 = chain(s, ['[1/2]+1+1+[3/4] = [{13}/4] = [{3} {1}/4]', '4−[3 1/4] = [{3}/4]', '[1/4]+[1/2]+[1/2]+[3/4] = [{8}/4] = {2}', '4−2 = {2}'])
        s.ask('첫 번째 마디에 넣을 음표: (            )     두 번째 마디에 넣을 음표: (            )', blank=False)
        ans = '8차시  ① %s  ② %s, 3/4박  ③ %s, %s  ④ %s → 16분음표  ⑤ %s → 첫 번째 마디 점 8분음표, 두 번째 마디 2박만큼(예: 2분음표, 4분음표 2개)' % (
            ', '.join(a1), a2, a3, a3b[0], a4, a5)
    else:
        step(s, 0, '음표의 박 알아보기', '여러 음표를 모으면')
        notes_fig(s, ['hf', 'q', 'e', 's'], label=True)
        a1 = chooses(s, [('4분음표를 1박으로 하면 2분음표는 몇 박일까요?', ['[1/2]박', '2박', '4박'], 1),
                         ('8분음표 2개를 모으면 몇 박일까요?', ['[1/4]박', '2박', '1박'], 2),
                         ('16분음표 4개를 모으면 몇 박일까요?', ['1박', '4박', '[1/2]박'], 0)])
        step(s, 1, '점 4분음표', '분수의 덧셈으로 박 구하기')
        notes_fig(s, ['dq'])
        s.text('점 4분음표 = 4분음표 + 8분음표')
        a2 = chain(s, ['1+[1/2] = [{1} {1}/2]'])
        assert beats(['dq']) == F('1 1/2')
        s.ask('그래서 점 4분음표는 몇 박일까요?')
        step(s, 2, '마디 확인하기', '㉠ 마디 (3/4박자)')
        s.text('㉠ 마디에는 점 4분음표, 8분음표, 16분음표, 8분음표가 있어요. ㉠ 마디가 3/4박자에 맞는지 박을 더해 확인해 보세요.')
        measure_fig(s, '㉠ 마디 (3/4박자)', 3, ['dq', 'e', 's', 'e'], slot=False)
        a3 = chain(s, ['[1 1/2]+[1/2]+[1/4]+[1/2] = [{6}/4]+[{2}/4]+[1/4]+[{2}/4] = [{11}/4] = [{2} {3}/4]'])
        assert beats(['dq', 'e', 's', 'e']) == F('2 3/4')
        a3b = chooses(s, [('㉠ 마디는 3/4박자가 맞나요?', ['맞아요', '아니에요'], 1)])
        s.ask('몇 박이 모자라나요?')
        step(s, 3, '음표 넣기', '㉡ 마디 완성하기 (3/4박자)')
        s.text('㉡ 마디에는 8분음표, 점 8분음표, 16분음표가 있어요. 빈칸에 알맞은 음표 하나를 넣어 3/4박자에 맞게 완성해 보세요.')
        measure_fig(s, '㉡ 마디 (3/4박자)', 3, ['e', 'de', 's'])
        need2 = 3 - beats(['e', 'de', 's'])
        a4 = chain(s, ['[1/2]+[3/4]+[1/4] = [{6}/4] = [{1} {2}/4]', '3−[1 2/4] = [{1} {2}/4]'])
        assert need2 == beats(['dq'])
        s.ask('빈칸에 들어갈 음표는?')
        step(s, 4, '악보 완성하기', '4/4박자 마디 두 개')
        s.text('4/4박자 악보예요. 마디마다 4박이 되도록 빈칸에 알맞은 음표를 하나씩 넣어 보세요.')
        measure_fig(s, '첫 번째 마디 (4/4박자)', 4, ['dq', 'e', 'q'])
        measure_fig(s, '두 번째 마디 (4/4박자)', 4, ['de', 's', 'dq'])
        n1, n2 = 4 - beats(['dq', 'e', 'q']), 4 - beats(['de', 's', 'dq'])
        assert n1 == beats(['q']) and n2 == beats(['dq'])
        a5 = chain(s, ['[1 1/2]+[1/2]+1 = {3}', '4−3 = {1}', '[3/4]+[1/4]+[1 1/2] = [{2} {2}/4]', '4−[2 2/4] = [{1} {2}/4]'])
        s.ask('첫 번째 마디에 넣을 음표: (            )     두 번째 마디에 넣을 음표: (            )', blank=False)
        ans = '8차시  ① %s  ② %s, 1 1/2박  ③ %s, %s, 1/4박  ④ %s → 점 4분음표  ⑤ %s → 첫 번째 마디 4분음표, 두 번째 마디 점 4분음표' % (
            ', '.join(a1), a2, a3, a3b[0], a4, a5)
    if lv == '도전형':
        step(s, 5, '도전하기', '나만의 말 붙이기')
        s.text('완성한 리듬의 음표 하나에 한 글자씩 붙여 나만의 말을 지어 보세요. 긴 음표에는 길게 부를 글자를 붙여 봐요.')
        s.lines(2)
        s.ask('음표의 길이를 분수로 나타내어 더해 보니 어떤 점이 좋았나요?', blank=False)
        s.lines(2)
        ans += '  ⑥ (자유) 예) 한 마디에 박이 맞는지 정확하게 알 수 있었어요.'
    return ans


def tb9(s, lv):
    lessons_head(s, 9, '발표하기(P)', '놀이를 더하다 ― 신나는 분수 윷놀이', '윷놀이를 하며 분모가 다른 분수의 덧셈과 뺄셈을 해 볼까요?', None)
    if lv == '기본형':
        step(s, 0, '놀이 방법 알아보기', '놀이 순서')
        a1 = seq_order(s, ['나온 눈의 수만큼 말을 이동해요.', '가위바위보로 놀이 순서를 정해요.', '계산이 맞으면 그 칸에 두고, 틀리면 원래 칸으로 되돌려요.',
                           '주사위와 분수 주사위를 동시에 던져요.', '칸의 분수와 분수 주사위의 분수의 합 또는 차를 구해요.'], [1, 3, 0, 4, 2])
        step(s, 1, '연습하기', '놀이에서 하는 계산')
        if lv == '기본형':
            s.text('뺄셈은 (큰 수)−(작은 수)로 식을 세워요. 통분한 후 분자끼리 계산해요.')
        a2 = calc(s, [{'q': '말이 [2 7/10] 칸에 도착했고, 분수 주사위에서 ‘−[1 3/8]’이 나왔어요.', 'e': '[2 7/10]−[1 3/8]', 'a': '1 13/40'}])
        assert F('2/3') > F('1/4')
        a2b = pick_eq(s, '칸의 분수가 [1/4]이고 분수 주사위에서 ‘−[2/3]’가 나왔을 때 알맞은 식은?', ['[2/3]−[1/4]', '[1/4]−[2/3]'], 0)
        a2c = calc(s, [{'q': '그 식을 계산해요.', 'x': '[2/3]−[1/4]', 'a': '5/12'}])
        step(s, 2, '윷놀이 하기', '놀이 기록')
        s.text('주사위와 분수 주사위를 던져 말을 옮기고, 도착한 칸의 분수와 분수 주사위의 분수의 합 또는 차를 구해요. '
               '★ 칸에 멈추면 지름길로 가고, 다른 편 말이 있는 칸에 멈추면 그 말을 잡고 한 번 더 던져요.')
        yut_record(s)
        step(s, 3, '또 다른 놀이', '분수 카드 놀이')
        s.text('카드를 보기 전에 덧셈이나 뺄셈을 고르고, 노란 카드와 파란 카드를 한 장씩 뒤집어 계산해요. 계산이 맞으면 1점, 계산 결과가 더 큰 사람은 1점을 더 얻어요.')
        card_record(s)
        step(s, 4, '되돌아보기', '놀이 되돌아보기')
        a5 = chooses(s, [('윷놀이에서 이기려면 어떻게 하면 좋을까요? 알맞은 것을 모두 골라요.',
                          ['정확하게 계산해요', '다른 편의 말을 잡아요', '★ 지름길 칸에 멈추도록 말을 골라 옮겨요', '계산하지 않고 빨리 옮겨요'], [0, 1, 2]),
                         (rd('계산 결과가 [10/12]일 때, 약분하여 [5/6]로 쓰지 않아도 맞을까요?'), ['맞아요. 값이 같으면 정답이에요', '틀려요. 꼭 약분해야 해요'], 0)])
        ans = '9차시  ① %s  ② %s, %s, %s  ③·④ (놀이 기록, 계산은 통분하여 확인)  ⑤ %s' % (a1, a2[0], a2b, a2c[0], ' / '.join(a5))
    else:
        step(s, 0, '놀이 방법 알아보기', '맞으면 ○, 틀리면 ×')
        s.choices([('주사위와 분수 주사위를 동시에 던져요.', '( ○ / × )'), ('계산이 틀려도 그 칸에 그대로 두어요.', '( ○ / × )'),
                   ('칸의 분수와 분수 주사위의 분수의 합 또는 차를 구해요.', '( ○ / × )'), ('놀이 순서는 나이가 많은 사람부터 정해요.', '( ○ / × )')])
        step(s, 1, '연습하기', '받아내림이 있는 계산')
        a2 = calc(s, [{'q': '말이 [3 1/6] 칸에 도착했고, 분수 주사위에서 ‘−[1 3/4]’이 나왔어요.', 'e': '[3 1/6]−[1 3/4]', 'a': '1 5/12'}])
        assert F('5/6') > F('3/8')
        a2b = pick_eq(s, '칸의 분수가 [3/8]이고 분수 주사위에서 ‘−[5/6]’가 나왔을 때 알맞은 식은?', ['[3/8]−[5/6]', '[5/6]−[3/8]'], 1)
        a2c = calc(s, [{'q': '그 식을 계산해요.', 'x': '[5/6]−[3/8]', 'a': '11/24'}])
        step(s, 2, '윷놀이 하기', '내 놀이 기록')
        s.text('주사위와 분수 주사위를 던져 말을 옮기고, 도착한 칸의 분수와 분수 주사위의 분수의 합 또는 차를 구해요. '
               '★ 칸에 멈추면 지름길로 가고, 다른 편 말이 있는 칸에 멈추면 그 말을 잡고 한 번 더 던져요.')
        yut_record(s)
        step(s, 3, '또 다른 놀이', '분수 카드 놀이 기록')
        s.text('카드를 보기 전에 덧셈이나 뺄셈을 고르고, 노란 카드와 파란 카드를 한 장씩 뒤집어 계산해요. 계산이 맞으면 1점, 계산 결과가 더 큰 사람은 1점을 더 얻어요.')
        card_record(s)
        step(s, 4, '되돌아보기', '♥와 약분')
        a5 = chooses(s, [('분수 주사위에서 ♥가 나왔을 때는?', ['계산하지 않고 그 칸에 그대로 두어요', '처음 칸으로 돌아가요'], 0),
                         (rd('계산 결과가 [18/24]일 때, 약분하여 [3/4]으로 쓰지 않아도 맞을까요?'), ['맞아요. 값이 같으면 정답이에요', '틀려요. 꼭 약분해야 해요'], 0)])
        ans = '9차시  ① ○ × ○ ×  ② %s, %s, %s  ③·④ (놀이 기록, 계산은 통분하여 확인)  ⑤ %s' % (a2[0], a2b, a2c[0], ' / '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '놀이판에서 나올 수 있는 계산')
        a6 = calc(s, [{'e': '[1 7/8]+[1/2]', 'a': '2 3/8'}, {'e': '[1 1/6]−[1/3]', 'a': '5/6'},
                      {'e': '[5/9]+[2/5]', 'a': '43/45'}, {'e': '[1 1/4]−[1/6]', 'a': '1 1/12'}])
        s.ask('분수 주사위에서 뺄셈이 나왔을 때 (큰 수)−(작은 수)로 식을 세워야 하는 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s' % ', '.join(a6)
    return ans


def tb10(s, lv):
    lessons_head(s, 10, '발표하기(P)', '공부한 내용을 확인해요', '분모가 다른 분수의 덧셈과 뺄셈을 할 수 있나요?', None)
    if lv == '기본형':
        step(s, 0, '그림으로 계산하기', '1번')
        s.text(rd('[4/5]와 [1/3]의 막대를 한 칸이 [1/15]이 되게 나누어 [4/5]−[1/3]을 계산해 보세요.'))
        split_fig(s, [('[4/5]', '4/5'), ('[1/3]', '1/3')], 15, lv == '기본형')
        a1 = chain(s, ['[4/5]−[1/3] = [{12}/15]−[{5}/15] = [{7}/15]'])
        step(s, 1, '빈칸 채우기', '2번')
        a2 = chain(s, ['[1/2]+[2/7] = [1×{7}/2×{7}]+[2×{2}/7×{2}]', '= [{7}/14]+[{4}/14] = [{11}/14]'])
        step(s, 2, '계산하기', '3~5번')
        a3 = calc(s, [{'e': '[3 5/7]+[1 4/9]', 'a': '5 10/63'}, {'e': '[7 3/8]−[3 1/10]', 'a': '4 11/40'}])
        a3b = cmp(s, [('[5/6]+[3/8]', '[5 5/6]−[4 3/4]')])
        a3c = calc(s, [{'q': '유나는 일주일 동안 줄넘기를 [2 1/6]시간, 오래달리기를 [1 1/5]시간 했어요. 줄넘기를 몇 시간 더 했을까요?', 'x': '[2 1/6]−[1 1/5]', 'a': '29/30', 'unit': '시간'},
                       {'q': '1차시의 나무늘보는 하루에 [14 4/5]시간, 말은 [2 9/10]시간 잔다면(이 활동지의 예시 값) 나무늘보는 말보다 몇 시간 더 잘까요?', 'x': '[14 4/5]−[2 9/10]', 'a': '11 9/10', 'unit': '시간'}])
        step(s, 3, '잘못 찾기', '6번')
        eq_fig(s, [('잘못된 계산', '[4 3/8]−[2 7/12] = [4 9/24]−[2 14/24]'), ('', '= [4 33/24]−[2 14/24] = [2 19/24]')])
        a4 = chooses(s, [('잘못된 까닭은?', ['1만큼을 분수로 나타냈는데 자연수 부분을 그대로 두었어요', '통분을 잘못했어요'], 0)])
        a4b = chain(s, [('옳은 계산', '[4 9/24]−[2 14/24] = [{3} {33}/24]−[2 14/24] = [{1} {19}/24]')])
        step(s, 4, '수 카드 문제', '7번')
        s.text('지훈이는 수 카드 2, 5, 9를, 서윤이는 수 카드 4, 6, 7을 가지고 있어요. 각자 수 카드를 한 번씩만 사용하여 가장 큰 대분수를 만들고, 두 대분수의 합을 구해 보세요.')
        a5 = mixed_cards(s, lv, [('지훈', [2, 5, 9], 'max'), ('서윤', [4, 6, 7], 'max')], '+')
        ans = '10차시  ① %s  ② %s  ③~⑤ %s, %s, %s  ⑥ %s / %s  ⑦ %s' % (a1, a2, ', '.join(a3), a3b[0], ', '.join(a3c), a4[0], a4b, a5)
    else:
        step(s, 0, '그림으로 계산하기', '1번 ― 한 칸이 [1/24]')
        s.text(rd('[5/6]와 [3/8]의 막대를 한 칸이 [1/24]이 되게 나누어 [5/6]−[3/8]을 계산해 보세요. 나누는 선을 그어 보세요.'))
        split_fig(s, [('[5/6]', '5/6'), ('[3/8]', '3/8')], 24, False)
        a1 = chain(s, ['[5/6]−[3/8] = [{20}/24]−[{9}/24] = [{11}/24]'])
        step(s, 1, '빈칸 채우기', '2번 ― 합이 1보다 큰 덧셈')
        a2 = chain(s, ['[2/3]+[3/8] = [2×{8}/3×{8}]+[3×{3}/8×{3}]', '= [{16}/24]+[{9}/24] = [{25}/24] = [{1} {1}/24]'])
        step(s, 2, '계산하기', '3~5번 ― 대분수와 문장제')
        a3 = calc(s, [{'e': '[4 5/6]+[2 7/10]', 'a': '7 8/15'}, {'e': '[8 2/9]−[3 5/12]', 'a': '4 29/36'}])
        a3b = cmp(s, [('[7/9]+[5/12]', '[6 1/4]−[5 1/6]')])
        a3c = calc(s, [{'q': '유나는 일주일 동안 줄넘기를 [3 1/4]시간, 오래달리기를 [1 5/6]시간 했어요. 줄넘기를 몇 시간 더 했을까요?', 'x': '[3 1/4]−[1 5/6]', 'a': '1 5/12', 'unit': '시간'},
                       {'q': '1차시의 코알라는 하루에 [20 1/2]시간, 기린은 [1 9/10]시간 잔다면(이 활동지의 예시 값) 코알라는 기린보다 몇 시간 더 잘까요?', 'x': '[20 1/2]−[1 9/10]', 'a': '18 3/5', 'unit': '시간'}])
        step(s, 3, '잘못 찾기', '6번 ― 받아내림 실수')
        eq_fig(s, [('잘못된 계산', '[5 1/6]−[2 3/4] = [5 2/12]−[2 9/12]'), ('', '= [5 14/12]−[2 9/12] = [3 5/12]')])
        a4 = chooses(s, [('잘못된 까닭은?', ['통분을 잘못했어요', '1만큼을 분수로 나타냈는데 자연수 부분을 그대로 두었어요'], 1)])
        a4b = chain(s, [('옳은 계산', '[5 2/12]−[2 9/12] = [{4} {14}/12]−[2 9/12] = [{2} {5}/12]')])
        step(s, 4, '수 카드 문제', '7번 ― 가장 큰 수와 가장 작은 수의 차')
        s.text('지훈이는 수 카드 3, 6, 8로 가장 큰 대분수를, 서윤이는 수 카드 2, 5, 9로 가장 작은 대분수를 만들어요. 두 대분수의 차를 구해 보세요.')
        a5 = mixed_cards(s, lv, [('지훈', [3, 6, 8], 'max'), ('서윤', [2, 5, 9], 'min')], '-')
        ans = '10차시  ① %s  ② %s  ③~⑤ %s, %s (43/36 > 1 1/12), %s  ⑥ %s / %s  ⑦ %s' % (a1, a2, ', '.join(a3), a3b[0], ', '.join(a3c), a4[0], a4b, a5)
    if lv == '도전형':
        step(s, 5, '도전하기', '이 단원에서 배운 계산 정리하기')
        a6 = chain(s, [('진분수의 덧셈', '[2/3]+[1/5] = [{10}/15]+[{3}/15] = [{13}/15]'), ('진분수의 뺄셈', '[7/8]−[1/4] = [7/8]−[{2}/8] = [{5}/8]'),
                       ('대분수의 덧셈', '[1 1/6]+[1 1/4] = [{14}/12]+[{15}/12]'), ('', '= [{29}/12] = [{2} {5}/12]'),
                       ('대분수의 뺄셈', '[3 1/2]−[1 1/5] = [3 {5}/10]−[1 {2}/10] = [{2} {3}/10]')])
        s.ask('분모가 다른 분수의 덧셈과 뺄셈에서 가장 중요한 것은 무엇인지 까닭과 함께 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑧ %s' % a6
    return ans


# ================================================================ 이야기 버전 (우리 반 텃밭 가꾸기)
def why_ans(s, lv, q, help1, ans, label='왜 그럴까요?'):
    why(s, lv, q, help1, label)
    return flat(ans)


def st1(s, lv):
    lessons_head(s, 1, '개념 찾기(S)', '우리 반 텃밭을 열어요', '텃밭을 가꿀 때 분모가 다른 분수를 더하거나 빼야 하는 때는 언제일까요?',
                 '새솔초등학교 5학년 2반은 학교 뒤뜰에 우리 반 텃밭을 얻었어요. 텃밭 반장 서진이와 하린, 민재, 예나, 태오, 지안이가 '
                 '모둠을 나누어 상추·고추·방울토마토·고구마를 길러요.')
    note_line(s)
    if lv == '기본형':
        step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
        s.text('텃밭 반장 서진이가 가져온 🌱 5학년 2반 텃밭 계획 쪽지')
        s.fill([rd(t) for t in ['상추 물 주기: 아침 [1/2] L, 저녁 [1/3] L', '거름: 상추 칸 [3/4] kg, 고추 칸 [2/5] kg',
                                '고랑 길이: 첫째 고랑 [4 1/2] m, 둘째 고랑 [3 2/3] m', '물통: 물 [5 1/4] L 중에서 [1 5/6] L 쓰기']])
        panes(s, lv, [('보여요', '쪽지에 ~이 보여요', '[1/2] L와 [1/3] L처럼 분모가 다른 분수가 보여요.'),
                      ('생각해요', '~할 때 분수를 더하거나 빼야 할 것 같아요', '상추에 하루 동안 준 물을 구하려면 [1/2]과 [1/3]을 더해야 할 것 같아요.'),
                      ('궁금해요', '~은 어떻게 계산할까?', '분모가 2와 3으로 다른데 분자끼리 그냥 더해도 될까?')])
        step(s, 1, '그려 보기', '거름 막대의 조각 맞추기')
        s.text(rd('거름을 상추 칸에 [3/4] kg, 고추 칸에 [2/5] kg 뿌리기로 했어요. ' +
                  ('점선을 따라 나누면 한 칸이 [1/20]이 돼요. 색칠한 칸을 세어 보세요.' if lv == '기본형'
                   else '두 막대의 한 칸을 더 잘게 나누는 선을 그어 한 칸이 [1/20]이 되게 만들어 보세요.')))
        split_fig(s, [('상추 칸 [3/4] kg', '3/4'), ('고추 칸 [2/5] kg', '2/5')], 20, lv == '기본형')
        a2 = chain(s, ['[3/4] = [{15}/20]', '[2/5] = [{8}/20]'])
        a2b = cmp(s, [('[3/4]', '[2/5]')])
        step(s, 2, '말해 보기', '더할까, 뺄까?')
        if lv == '기본형':
            s.text('‘모두’ 얼마인지 구할 때는 더하고, ‘남은’ 양이나 ‘얼마나 더’ 많은지 구할 때는 빼요.')
        a3 = sort_cards(s, [('상추에 아침과 저녁에 준 물은 모두 몇 L일까?', 0), ('상추 칸과 고추 칸에 뿌린 거름은 모두 몇 kg일까?', 0),
                            ('첫째 고랑과 둘째 고랑의 길이를 합하면 몇 m일까?', 0), ('물통에서 물을 쓰고 남은 양은 몇 L일까?', 1),
                            ('첫째 고랑은 둘째 고랑보다 몇 m 더 길까?', 1), ('상추 칸에 고추 칸보다 거름을 몇 kg 더 뿌렸을까?', 1)], SORT_BINS)
        w3 = why_ans(s, lv, '‘얼마나 더’를 구할 때 왜 뺄셈을 할까요?', '‘얼마나 더는 두 양의 ~라서, 큰 양에서 작은 양을 빼서 구해요.’ 꼴로 써요.',
                     '얼마나 더 많은지는 두 양의 차이라서, 큰 양에서 작은 양을 빼면 더 많은 만큼이 남아요.')
        step(s, 3, '약속하기', '분모가 같을 때 떠올리기')
        if lv == '기본형':
            s.text('분모가 같으면 분모는 그대로 쓰고 분자끼리 더하거나 빼요. 분수 부분끼리 뺄 수 없으면 자연수 1만큼을 분수로 바꾸어요.')
        a4 = calc(s, [{'e': '[2/7]+[4/7]', 'a': '6/7'}, {'e': '[1 5/8]+[2 6/8]', 'a': '4 3/8'}, {'e': '[7/9]−[4/9]', 'a': '3/9'}, {'e': '[4 1/5]−[1 3/5]', 'a': '2 3/5'}])
        w4 = why_ans(s, lv, '상추에 준 물 [1/2] L와 [1/3] L는 왜 바로 분자끼리 더할 수 없을까요?',
                     '‘[1/2]과 [1/3]은 한 조각의 크기가 달라서, 먼저 ~해야 해요.’ 꼴로 써요.',
                     '[1/2]과 [1/3]은 한 조각의 크기가 달라서 조각 수를 그냥 더할 수 없어요. 먼저 통분하여 조각의 크기를 같게 만들어야 해요.')
        step(s, 4, '확인하기', '가분수·대분수와 크기 비교')
        a5 = chain(s, ['[3 2/5] = [{17}/5]', '[23/6] = [{3} {5}/6]'])
        a5b = cmp(s, [('[5/8]', '[2/3]'), ('[7/10]', '[3/5]')])
        ans = '1차시  ① (자유)  ② %s, %s  ③ %s / 왜: %s  ④ %s / 왜: %s  ⑤ %s, %s' % (
            a2, a2b[0], short_sort(a3), w3, ', '.join(a4), w4, a5, ' '.join(a5b))
    else:
        step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
        s.text('텃밭 반장 서진이가 가져온 🌱 5학년 2반 텃밭 계획 쪽지')
        s.fill([rd(t) for t in ['상추 물 주기: 아침 [1/2] L, 저녁 [1/3] L', '거름: 상추 칸 [3/4] kg, 고추 칸 [2/5] kg',
                                '고랑 길이: 첫째 고랑 [4 1/2] m, 둘째 고랑 [3 2/3] m', '물통: 물 [5 1/4] L 중에서 [1 5/6] L 쓰기']])
        panes(s, lv, [('보여요', '쪽지에 ~이 보여요', ''), ('생각해요', '~할 때 분수를 더하거나 빼야 할 것 같아요', ''), ('궁금해요', '~은 어떻게 계산할까?', '')])
        step(s, 1, '그려 보기', '상추 칸과 오이 칸의 거름')
        s.text(rd('이번에는 거름을 상추 칸에 [5/6] kg, 오이 칸에 [4/9] kg 뿌리기로 했어요. 두 막대의 한 칸을 더 잘게 나누는 선을 그어 한 칸이 [1/18]이 되게 만들어 보세요.'))
        split_fig(s, [('상추 칸 [5/6] kg', '5/6'), ('오이 칸 [4/9] kg', '4/9')], 18, False)
        a2 = chain(s, ['[5/6] = [{15}/18]', '[4/9] = [{8}/18]'])
        a2b = cmp(s, [('[5/6]', '[4/9]')])
        step(s, 2, '말해 보기', '더할까, 뺄까? ― 헷갈리는 말')
        a3 = sort_cards(s, [('감자와 고구마를 캔 양을 합하면 몇 kg일까?', 0), ('고랑을 5 m로 늘리려면 몇 m 더 만들어야 할까?', 1),
                            ('오늘과 어제 딴 방울토마토는 모두 몇 kg일까?', 0), ('비료 [3/4] L 중에서 쓰고 남은 비료는 몇 L일까?', 1),
                            ('두 고랑에 깐 짚은 모두 몇 kg일까?', 0), ('오이 덩굴은 호박 덩굴보다 몇 m 짧을까?', 1)], SORT_BINS)
        w3 = why_ans(s, lv, '‘몇 m 더 만들어야’처럼 ‘더’라는 말이 있는데도 뺄셈을 하는 까닭은 무엇일까요?', '',
                     '5 m가 되려면 지금 길이와 5 m의 차이만큼 더 만들어야 해서, 5 m에서 지금 길이를 빼요.')
        step(s, 3, '약속하기', '분모가 같을 때 ― 받아올림·받아내림')
        a4 = calc(s, [{'e': '[3/8]+[7/8]', 'a': '1 2/8'}, {'e': '[3 4/9]+[1 7/9]', 'a': '5 2/9'}, {'e': '[11/15]−[4/15]', 'a': '7/15'}, {'e': '[5 2/9]−[2 7/9]', 'a': '2 4/9'}])
        w4 = why_ans(s, lv, '거름 [3/4] kg과 [2/5] kg은 왜 분자끼리 바로 더할 수 없을까요?', '',
                     '[3/4]과 [2/5]는 한 조각의 크기가 달라서 조각 수를 그냥 더할 수 없어요. 먼저 통분해야 해요.')
        step(s, 4, '확인하기', '새 가분수·대분수, 크기 비교')
        a5 = chain(s, ['[4 3/7] = [{31}/7]', '[35/8] = [{4} {3}/8]'])
        a5b = cmp(s, [('[4/7]', '[5/9]'), ('[7/12]', '[5/8]')])
        ans = '1차시  ① (자유)  ② %s, %s  ③ %s / 왜: %s  ④ %s / 왜: %s  ⑤ %s, %s' % (
            a2, a2b[0], short_sort(a3), w3, ', '.join(a4), w4, a5, ' '.join(a5b))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 계산하기 전에 어림하기')
        s.text(rd('물통에 물이 [5 1/4] L 있었는데 [1 5/6] L를 썼어요.'))
        a6 = chooses(s, [('남은 물은 약 몇 L일까요?', ['약 7 L', '약 4 L', '약 3 L'], 2),
                         ('정확한 값은 3 L보다 조금 많을까요, 조금 적을까요?', ['조금 적어요', '조금 많아요'], 1)])
        v = ev('[5 1/4]−[1 5/6]')
        assert 3 < v < 4
        s.ask('그렇게 생각한 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s (5 1/4은 5보다 1/4 크고 1 5/6는 2보다 1/6 작아서 3 L보다 많아요. 정확한 값 %s L)' % (', '.join(a6), red(v))
    return ans


def st2(s, lv):
    lessons_head(s, 2, '개념 구축하기(O)', '아침저녁 물 주기 ― 진분수의 덧셈(1)', '합이 1보다 작은 분모가 다른 진분수의 덧셈은 어떻게 할까요?',
                 '하린이는 상추 칸에 아침에 물을 [2/5] L, 저녁에 [1/3] L 주었어요. 하루 동안 준 물은 모두 몇 L일까요?')
    if lv == '기본형':
        step(s, 0, '만져 보기', '물의 양 조각 맞추기')
        rule_first(s, lv, '분모가 다른 두 분수는 어떻게 더하면 될까요?', '‘내 규칙: 먼저 ~하고, 분모는 ~, 분자는 ~해요.’ 꼴로 써요.')
        s.text(rd('두 막대의 한 칸을 더 잘게 나누어 조각의 크기를 같게 만들어 보세요. ' +
                  ('점선을 따라 나누면 한 칸이 [1/15]이 돼요.' if lv == '기본형' else '한 칸이 [1/15]이 되게 선을 그어 보세요.')))
        split_fig(s, [('아침 [2/5] L', '2/5'), ('저녁 [1/3] L', '1/3')], 15, lv == '기본형')
        a1 = chain(s, ['[2/5] = [{6}/15]', '[1/3] = [{5}/15]', '[2/5]+[1/3] = [6/15]+[5/15] = [{11}/15]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 통분하기')
        s.text(rd('민재는 고추 모종에 물을 [1/6] L, 가지 모종에 [3/8] L 주었어요. [1/6]+[3/8]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[1/6]+[3/8]', ['[1/6]+[3/8] = [1×{8}/6×{8}]+[3×{6}/8×{6}]', '= [{8}/48]+[{18}/48] = [{26}/48]'],
                      ['[1/6]+[3/8] = [1×{4}/6×{4}]+[3×{3}/8×{3}]', '= [{4}/24]+[{9}/24] = [{13}/24]'])
        step(s, 2, '말해 보기', '어느 방법이 편할까?')
        a3 = blanks(s, lv, COMPARE_WAYS + ['[26/48]을 약분하면 ', (['[13/24]', '[13/48]', '[26/24]'], 0), '이에요.'])
        assert F('26/48') == F('13/24')
        w3 = why_ans(s, lv, '나라면 어느 방법으로 통분할지 까닭과 함께 써 봐요.', '‘나는 두 분모의 ~을 공통분모로 할래요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요.',
                     '예) 최소공배수 — 수가 작아서 계산이 쉽고 약분하지 않아도 돼요. (곱이라고 써도 까닭이 맞으면 좋아요.)')
        step(s, 3, '약속하기', '분모가 다른 분수의 덧셈')
        a4 = blanks(s, lv, ADD_RULE)
        step(s, 4, '확인하기', '텃밭 물 계산하기')
        if lv == '기본형':
            s.text('먼저 통분하고, 분모는 그대로 쓰고 분자끼리 더해요. 약분하지 않은 분수로 써도 맞아요.')
        a5 = calc(s, [{'e': '[5/12]+[3/8]', 'a': '19/24'}, {'e': '[2/7]+[1/3]', 'a': '13/21'},
                      {'q': '예나는 방울토마토 칸에 액체 비료 [1/4] L와 물 [3/5] L를 섞어 뿌렸어요. 뿌린 것은 모두 몇 L일까요?', 'x': '[1/4]+[3/5]', 'a': '17/20', 'unit': 'L'}])
        ans = '2차시  ① 예상 예: 먼저 통분하고 분모는 그대로, 분자끼리 더해요. / %s (11/15 L)  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (
            a1, a2, ', '.join(a3), w3, ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '다른 날의 물 ― [3/8] L와 [1/6] L')
        rule_first(s, lv, '분모가 8과 6인 두 분수를 더하려면 막대를 몇 칸으로 나누면 좋을까요?', '')
        s.text(rd('다른 날 하린이는 아침에 물을 [3/8] L, 저녁에 [1/6] L 주었어요. 두 막대의 한 칸을 더 잘게 나누어 한 칸이 [1/24]이 되게 선을 그어 보세요.'))
        split_fig(s, [('아침 [3/8] L', '3/8'), ('저녁 [1/6] L', '1/6')], 24, False)
        a1 = chain(s, ['[3/8] = [{9}/24]', '[1/6] = [{4}/24]', '[3/8]+[1/6] = [9/24]+[4/24] = [{13}/24]'])
        step(s, 1, '그려 보기', '[3/10]+[1/4]를 두 가지 방법으로')
        s.text(rd('민재는 고추 모종에 물을 [3/10] L, 가지 모종에 [1/4] L 주었어요. [3/10]+[1/4]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[3/10]+[1/4]', ['[3/10]+[1/4] = [3×{4}/10×{4}]+[1×{10}/4×{10}]', '= [{12}/40]+[{10}/40] = [{22}/40]'],
                      ['[3/10]+[1/4] = [3×{2}/10×{2}]+[1×{5}/4×{5}]', '= [{6}/20]+[{5}/20] = [{11}/20]'])
        step(s, 2, '말해 보기', '곱과 최소공배수가 같을 때')
        a3 = blanks(s, lv, COMPARE_WAYS + ['[22/40]을 약분하면 ', (['[11/20]', '[11/40]', '[22/20]'], 0), '이에요.'])
        assert F('22/40') == F('11/20')
        w3 = why_ans(s, lv, '두 분모의 곱과 최소공배수가 같아지는 때는 언제일지 예를 들어 써 봐요.', '',
                     '예) 2와 3처럼 두 분모의 공약수가 1뿐이면 곱과 최소공배수가 같아요.')
        step(s, 3, '약속하기', '분모가 다른 분수의 덧셈')
        a4 = blanks(s, lv, ADD_RULE)
        step(s, 4, '확인하기', '새 텃밭 물 계산하기')
        a5 = calc(s, [{'e': '[2/9]+[1/4]', 'a': '17/36'}, {'e': '[3/14]+[3/7]', 'a': '9/14'},
                      {'q': '예나는 방울토마토 칸에 액체 비료 [3/10] L와 물 [7/15] L를 섞어 뿌렸어요. 뿌린 것은 모두 몇 L일까요?', 'x': '[3/10]+[7/15]', 'a': '23/30', 'unit': 'L'}])
        ans = '2차시  ① 예상 예: 8과 6의 최소공배수인 24칸으로 나누어요. / %s (13/24 L)  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (
            a1, a2, ', '.join(a3), w3, ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 텃밭 퀴즈')
        a6 = calc(s, [{'q': '태오: “[1/10]이 3개인 수야.” 지안: “[1/15]이 4개인 수야.” 두 사람이 말한 분수의 합은?', 'x': '[3/10]+[4/15]', 'a': '17/30'},
                      {'q': '[3/16], [1/4], [5/8] 중에서 가장 큰 분수와 가장 작은 분수의 합은?', 'x': '[5/8]+[3/16]', 'a': '13/16'}])
        assert max(F('3/16'), F('1/4'), F('5/8')) == F('5/8') and min(F('3/16'), F('1/4'), F('5/8')) == F('3/16')
        s.ask(rd('[3/16], [1/4], [5/8] 중에서 가장 작은 분수를 어떻게 찾았는지 써 보세요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s (5/8+3/16)' % ', '.join(a6)
    return ans


def st3(s, lv):
    lessons_head(s, 3, '개념 구축하기(O)', '거름 뿌리기 ― 진분수의 덧셈(2)', '합이 1보다 큰 분모가 다른 진분수의 덧셈은 어떻게 할까요?',
                 '서진이와 태오는 거름을 상추 칸에 [5/6] kg, 고추 칸에 [3/4] kg 뿌렸어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '거름 막대 합치기')
        s.text(rd('두 막대의 조각 크기를 같게 만들고, 뿌린 거름이 모두 몇 kg인지 알아보세요.' +
                  (' 6과 4의 최소공배수는 12예요. 점선을 따라 나누었어요.' if lv == '기본형' else '')))
        split_fig(s, [('상추 칸 [5/6] kg', '5/6'), ('고추 칸 [3/4] kg', '3/4')], 12, lv == '기본형')
        a1 = chain(s, ['[5/6] = [{10}/12]', '[3/4] = [{9}/12]', '[5/6]+[3/4] = [10/12]+[9/12] = [{19}/12] = [{1} {7}/12]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 더하기')
        s.text(rd('예나네 모둠은 오이 칸에 거름을 [4/9] kg, 가지 칸에 [5/6] kg 뿌렸어요. [4/9]+[5/6]를 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[4/9]+[5/6]', ['[4/9]+[5/6] = [4×{6}/9×{6}]+[5×{9}/6×{9}]', '= [{24}/54]+[{45}/54] = [{69}/54] = [{1} {15}/54]'],
                      ['[4/9]+[5/6] = [4×{2}/9×{2}]+[5×{3}/6×{3}]', '= [{8}/18]+[{15}/18] = [{23}/18] = [{1} {5}/18]'])
        step(s, 2, '말해 보기', '지안이의 계산 고치기')
        s.text(rd('지안이가 [5/8]+[3/4]을 잘못 계산했어요.'))
        eq_fig(s, [('지안이의 계산', '[5/8]+[3/4] = [5/8]+[3/8] = [8/8] = 1')])
        a3 = chooses(s, [('잘못된 까닭은?', ['분모에만 2를 곱하고 분자에는 곱하지 않았어요', '분모끼리 더했어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[5/8]+[3/4] = [5/8]+[3×{2}/4×{2}]'), ('', '= [5/8]+[{6}/8] = [{11}/8] = [{1} {3}/8]')])
        w3 = why_ans(s, lv, '분모에 곱한 수를 분자에도 곱해야 하는 까닭을 써 봐요.', '‘분모에만 곱하면 크기가 ~ 분수가 되어서, 분모와 분자에 ~을 곱해야 해요.’ 꼴로 써요.',
                     '분모에만 2를 곱하면 [3/8]처럼 크기가 더 작은 분수가 되어요. 분모와 분자에 같은 수를 곱해야 [6/8]처럼 크기가 같은 분수가 돼요.')
        step(s, 3, '약속하기', '합이 1보다 클 때')
        a4 = blanks(s, lv, ADD2_RULE)
        step(s, 4, '확인하기', '거름 계산하기')
        if lv == '기본형':
            s.text('가분수로 써도, 대분수로 써도 맞아요. 합이 가분수이면 대분수로 나타내 보세요.')
        a5 = calc(s, [{'e': '[3/4]+[9/10]', 'a': '1 13/20'}, {'e': '[8/9]+[5/12]', 'a': '1 11/36'}, {'e': '[5/7]+[1/2]', 'a': '1 3/14'}])
        a5b = cmp(s, [('[7/8]+[1/3]', '[5/6]+[3/10]')])
        ans = '3차시  ① %s (1 7/12 kg)  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s, %s (29/24 > 34/30)' % (
            a1, a2, a3[0], a3b, w3, ', '.join(a4), ', '.join(a5), a5b[0])
    else:
        step(s, 0, '만져 보기', '다른 칸의 거름 합치기')
        s.text(rd('다음 주에는 거름을 상추 칸에 [7/9] kg, 고추 칸에 [5/6] kg 뿌렸어요. 두 막대의 조각 크기를 같게 만들고, 뿌린 거름이 모두 몇 kg인지 알아보세요.'))
        split_fig(s, [('상추 칸 [7/9] kg', '7/9'), ('고추 칸 [5/6] kg', '5/6')], 18, False)
        a1 = chain(s, ['[7/9] = [{14}/18]', '[5/6] = [{15}/18]', '[7/9]+[5/6] = [14/18]+[15/18] = [{29}/18] = [{1} {11}/18]'])
        step(s, 1, '그려 보기', '[5/8]+[11/12]를 두 가지 방법으로')
        s.text(rd('예나네 모둠은 오이 칸에 거름을 [5/8] kg, 가지 칸에 [11/12] kg 뿌렸어요. [5/8]+[11/12]를 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[5/8]+[11/12]', ['[5/8]+[11/12] = [5×{12}/8×{12}]+[11×{8}/12×{8}]', '= [{60}/96]+[{88}/96] = [{148}/96] = [{1} {52}/96]'],
                      ['[5/8]+[11/12] = [5×{3}/8×{3}]+[11×{2}/12×{2}]', '= [{15}/24]+[{22}/24] = [{37}/24] = [{1} {13}/24]'])
        step(s, 2, '말해 보기', '지안이의 계산 고치기')
        s.text(rd('지안이가 [7/12]+[5/6]을 잘못 계산했어요.'))
        eq_fig(s, [('지안이의 계산', '[7/12]+[5/6] = [7/12]+[5/12] = [12/12] = 1')])
        a3 = chooses(s, [('잘못된 까닭은?', ['분모끼리 더했어요', '[5/6]의 분모에만 2를 곱하고 분자에는 곱하지 않았어요'], 1)])
        a3b = chain(s, [('옳은 계산', '[7/12]+[5/6] = [7/12]+[5×{2}/6×{2}]'), ('', '= [7/12]+[{10}/12] = [{17}/12] = [{1} {5}/12]')])
        w3 = why_ans(s, lv, '[7/12]과 [5/6]이 둘 다 [1/2]보다 크다는 것을 이용해 지안이의 답이 틀렸음을 어림으로 설명해 봐요.', '',
                     '두 분수가 모두 [1/2]보다 크니까 합은 1보다 커야 해요. 그런데 지안이의 답은 1이라서 틀렸어요.')
        step(s, 3, '약속하기', '합이 1보다 클 때')
        a4 = blanks(s, lv, ADD2_RULE)
        step(s, 4, '확인하기', '새 거름 계산하기')
        a5 = calc(s, [{'e': '[5/6]+[7/10]', 'a': '1 8/15'}, {'e': '[7/12]+[9/16]', 'a': '1 7/48'}, {'e': '[4/7]+[2/3]', 'a': '1 5/21'}])
        a5b = cmp(s, [('[5/8]+[2/3]', '[3/4]+[5/12]')])
        ans = '3차시  ① %s (1 11/18 kg)  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s, %s (31/24 > 14/12)' % (
            a1, a2, a3[0], a3b, w3, ', '.join(a4), ', '.join(a5), a5b[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수 카드로 진분수 만들기')
        a6 = proper_cards(s, lv, [3, 4, 5, 6, 8], '[5/6]+[3/8]')
        s.ask('합이 가장 크게 되려면 어떤 진분수를 만들면 좋을지 생각을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s (만든 진분수에 따라 답이 달라요)' % a6
    return ans


def st4(s, lv):
    lessons_head(s, 4, '개념 구축하기(O)', '물뿌리개로 물 주기 ― 대분수의 덧셈', '분모가 다른 대분수의 덧셈은 어떻게 할까요?',
                 '민재는 물뿌리개로 텃밭에 물을 [1 3/4] L 준 다음, 흙이 말라 보여서 [2 1/2] L를 더 주었어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '물 색칠하고 모으기')
        e1 = est(s, '민재가 준 물은 4 L보다 많을까요, 적을까요?', ['4 L보다 많아요', '4 L보다 적어요'], 0)
        s.text(rd('1 L를 4칸으로 나눈 막대에 두 양을 색칠하고 모아 보세요.' + (' [2 1/2] = [2 2/4]예요. 한 칸은 [1/4] L예요.' if lv == '기본형' else '')))
        fill_fig(s, [('처음 [1 3/4] L', '1 3/4'), ('더 [2 1/2] L', '2 1/2')], 4)
        a1 = calc(s, [{'q': '민재가 준 물은 모두 몇 L일까요?', 'e': '[1 3/4]+[2 1/2]', 'a': '4 1/4', 'unit': 'L'}])
        step(s, 1, '그려 보기', '두 가지 방법으로 더하기')
        s.text(rd('하린이네 모둠은 상추 모종을 심는 데 흙을 [2 1/3]포대, 거름을 섞은 흙을 [1 3/5]포대 썼어요. [2 1/3]+[1 3/5]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[2 1/3]+[1 3/5]', ['[2 1/3]+[1 3/5] = [{2} {5}/15]+[{1} {9}/15]', '= ({2}+{1})+([5/15]+[9/15]) = [{3} {14}/15]'],
                      ['[2 1/3]+[1 3/5] = [{7}/3]+[{8}/5]', '= [{35}/15]+[{24}/15] = [{59}/15] = [{3} {14}/15]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '편리한 방법 고르기')
        s.text(rd('고랑에 깔 짚을 첫째 날 [3 5/8] kg, 둘째 날 [1 5/6] kg 날랐어요. [3 5/8]+[1 5/6]를 두 가지 방법으로 계산하고, 두 방법을 설명해 보세요.'))
        a3 = chain(s, [('방법 1', '[3 5/8]+[1 5/6] = [3 {15}/24]+[1 {20}/24]'), ('', '= {4}+[{35}/24] = [{5} {11}/24]'),
                       ('방법 2', '[3 5/8]+[1 5/6] = [{29}/8]+[{11}/6]'), ('', '= [{87}/24]+[{44}/24] = [{131}/24] = [{5} {11}/24]')])
        W2 = ['자연수는 자연수끼리, 분수는 분수끼리 더했어요', '대분수를 가분수로 나타내어 더했어요']
        a3b = blanks(s, '기본형', ['방법 1은 ', (W2, 0), '.  방법 2는 ', (W2, 1), '.'])
        w3 = why_ans(s, lv, '나는 어느 방법이 더 편리한가요? 까닭과 함께 써 봐요.', '‘나는 방법 ~이 더 편리해요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요.',
                     '예) 방법 1 — 가분수로 바꾸면 [131/24]처럼 분자가 커지는데, 방법 1은 작은 분수만 더하면 되기 때문이에요.')
        step(s, 3, '약속하기', '대분수의 덧셈 방법')
        a4 = blanks(s, lv, MIXADD_RULE)
        step(s, 4, '확인하기', '고랑과 물 계산하기')
        a5 = calc(s, [{'e': '[2 4/9]+[1 5/6]', 'a': '4 5/18'}, {'e': '[3 1/4]+[2 3/10]', 'a': '5 11/20'},
                      {'q': '서진이네 모둠이 만든 첫째 고랑은 [4 2/3] m, 둘째 고랑은 [3 3/4] m예요. 두 고랑의 길이를 합하면 모두 몇 m일까요?', 'x': '[4 2/3]+[3 3/4]', 'a': '8 5/12', 'unit': 'm'}])
        ans = '4차시  ① %s, %s  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (e1, a1[0], a2, a3, ', '.join(a3b), w3, ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '다른 날 준 물 색칠하고 모으기')
        s.text(rd('다른 날 민재는 물을 [2 2/5] L 준 다음 [1 3/4] L를 더 주었어요.'))
        e1 = est(s, '민재가 준 물은 4 L보다 많을까요, 적을까요?', ['4 L보다 많아요', '4 L보다 적어요'], 0)
        s.text('1 L를 20칸으로 나눈 막대에 두 양을 색칠하고 모아 보세요.')
        fill_fig(s, [('처음 [2 2/5] L', '2 2/5'), ('더 [1 3/4] L', '1 3/4')], 20)
        a1 = calc(s, [{'q': '민재가 준 물은 모두 몇 L일까요?', 'e': '[2 2/5]+[1 3/4]', 'a': '4 3/20', 'unit': 'L'}])
        step(s, 1, '그려 보기', '[1 5/6]+[2 4/9]를 두 가지 방법으로')
        s.text(rd('하린이네 모둠은 흙을 [1 5/6]포대, 거름을 섞은 흙을 [2 4/9]포대 썼어요. [1 5/6]+[2 4/9]를 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[1 5/6]+[2 4/9]', ['[1 5/6]+[2 4/9] = [{1} {15}/18]+[{2} {8}/18]', '= ({1}+{2})+([15/18]+[8/18]) = [{4} {5}/18]'],
                      ['[1 5/6]+[2 4/9] = [{11}/6]+[{22}/9]', '= [{33}/18]+[{44}/18] = [{77}/18] = [{4} {5}/18]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '[2 7/10]+[3 11/15] 편리한 방법 고르기')
        s.text(rd('짚을 첫째 날 [2 7/10] kg, 둘째 날 [3 11/15] kg 날랐어요. [2 7/10]+[3 11/15]를 두 가지 방법으로 계산하고, 두 방법을 설명해 보세요.'))
        a3 = chain(s, [('방법 1', '[2 7/10]+[3 11/15] = [2 {21}/30]+[3 {22}/30]'), ('', '= {5}+[{43}/30] = [{6} {13}/30]'),
                       ('방법 2', '[2 7/10]+[3 11/15] = [{27}/10]+[{56}/15]'), ('', '= [{81}/30]+[{112}/30] = [{193}/30] = [{6} {13}/30]')])
        W2 = ['자연수는 자연수끼리, 분수는 분수끼리 더했어요', '대분수를 가분수로 나타내어 더했어요']
        a3b = blanks(s, lv, ['방법 1은 ', (W2, 0), '.  방법 2는 ', (W2, 1), '.'])
        w3 = why_ans(s, lv, '방법 2에서 분자가 193처럼 커지는 까닭과, 그때 더 편리한 방법은 무엇인지 써 봐요.', '',
                     '자연수 부분까지 분자에 넣어서 분자가 커져요. 그래서 수가 클 때는 자연수끼리, 분수끼리 더하는 방법 1이 편리해요.')
        step(s, 3, '약속하기', '대분수의 덧셈 방법')
        a4 = blanks(s, lv, MIXADD_RULE)
        step(s, 4, '확인하기', '고랑과 물 ― 여러 단계로')
        a5 = calc(s, [{'e': '[3 5/6]+[2 7/8]', 'a': '6 17/24'}, {'e': '[1 4/5]+[4 9/10]', 'a': '6 7/10'},
                      {'q': '첫째 고랑은 [3 5/8] m이고, 둘째 고랑은 첫째 고랑보다 [1 2/3] m 더 길어요. 두 고랑의 길이를 합하면 모두 몇 m일까요?', 'x': '[3 5/8]+[3 5/8]+[1 2/3]', 'a': '8 11/12', 'unit': 'm'}])
        ans = '4차시  ① %s, %s  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s (둘째 고랑 5 7/24 m)' % (e1, a1[0], a2, a3, ', '.join(a3b), w3, ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 텃밭 퀴즈')
        opts = ['[1 1/2]+[2 1/3]', '[2 1/6]+[1 2/3]', '[1 3/4]+[2 1/6]']
        k, vals = odd_one(opts)
        a6 = pick_eq(s, '합이 다른 하나를 골라요.', opts, k)
        a7 = calc(s, [{'q': '[1 5/8]+[3 2/3]를 계산해요.', 'x': '[1 5/8]+[3 2/3]', 'a': '5 7/24'}])
        tot = ev('[1 5/8]+[3 2/3]')
        n = len([m for m in range(1, 20) if tot > m])
        assert n == 5
        eq_fig(s, ['[1 5/8]+[3 2/3] > □'], indent=30)
        s.ask('□ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?   (        )개', blank=False)
        s.ask('왜 그 개수인지 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s (㉠ %s, ㉡ %s, ㉢ %s)  %s  %d개(1~5)' % (a6, red(vals[0]), red(vals[1]), red(vals[2]), a7[0], n)
    return ans


def st5(s, lv):
    lessons_head(s, 5, '개념 구축하기(O)', '액체 비료 덜어 내기 ― 진분수의 뺄셈', '분모가 다른 진분수의 뺄셈은 어떻게 할까요?',
                 '예나는 액체 비료 [3/4] L 중에서 [1/3] L를 덜어 내어 물에 섞었어요. 남은 액체 비료는 몇 L일까요?')
    if lv == '기본형':
        step(s, 0, '만져 보기', '덜어 낸 비료')
        rule_first(s, lv, '분모가 다른 두 분수의 뺄셈은 어떻게 하면 될까요?', '‘내 규칙: 먼저 ~하고, 분모는 ~, 분자는 ~해요.’ 꼴로 써요.')
        s.text(rd('두 막대의 조각 크기를 같게 만들어 보세요.' + (' 4와 3의 최소공배수는 12예요. 점선을 따라 나누었어요.' if lv == '기본형' else '')))
        split_fig(s, [('처음 [3/4] L', '3/4'), ('덜어 낸 [1/3] L', '1/3')], 12, lv == '기본형')
        a1 = chain(s, ['[3/4] = [{9}/12]', '[1/3] = [{4}/12]', '[3/4]−[1/3] = [9/12]−[4/12] = [{5}/12]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 빼기')
        s.text(rd('고추 칸 물통에 물이 [5/6] L 있었는데 [3/8] L를 썼어요. [5/6]−[3/8]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[5/6]−[3/8]', ['[5/6]−[3/8] = [5×{8}/6×{8}]−[3×{6}/8×{6}]', '= [{40}/48]−[{18}/48] = [{22}/48]'],
                      ['[5/6]−[3/8] = [5×{4}/6×{4}]−[3×{3}/8×{3}]', '= [{20}/24]−[{9}/24] = [{11}/24]'])
        step(s, 2, '말해 보기', '태오와 다른 방법')
        s.text(rd('태오는 [7/10]−[1/4]을 두 분모의 곱으로 통분해 계산했어요. 태오와 다른 방법으로 계산해 보세요.'))
        a3 = chain(s, [('태오의 방법', '[7/10]−[1/4] = [28/40]−[10/40] = [18/40] = [9/20]'),
                       ('다른 방법', '[7/10]−[1/4] = [7×{2}/10×{2}]−[1×{5}/4×{5}]'), ('', '= [{14}/20]−[{5}/20] = [{9}/20]')])
        w3 = why_ans(s, lv, '태오의 방법과 내 방법을 비교해 말해 봐요.', '‘태오는 ~을, 나는 ~을 공통분모로 했어요. 그래서 ~’ 꼴로 써요.',
                     '태오는 두 분모의 곱 40을, 나는 최소공배수 20을 공통분모로 했어요. 태오는 [18/40]을 약분해야 했지만 나는 바로 [9/20]가 나왔어요.')
        step(s, 3, '약속하기', '분모가 다른 분수의 뺄셈')
        a4 = blanks(s, lv, SUB_RULE)
        step(s, 4, '확인하기', '빗물과 비료 계산하기')
        if lv == '기본형':
            s.text('분모끼리, 분자끼리 빼면 안 돼요. 먼저 통분해요.')
        a5 = calc(s, [{'e': '[7/9]−[1/6]', 'a': '11/18'}, {'e': '[4/5]−[3/7]', 'a': '13/35'},
                      {'q': '비가 온 뒤 상추 칸 물받이에는 빗물이 [5/6] L, 고추 칸 물받이에는 [3/4] L 모였어요. 상추 칸 물받이에 빗물이 몇 L 더 많이 모였을까요?', 'x': '[5/6]−[3/4]', 'a': '1/12', 'unit': 'L'}])
        ans = '5차시  ① 예상 예: 덧셈처럼 먼저 통분하고 분자끼리 빼요. / %s (5/12 L)  ② %s  ③ %s / 왜: %s  ④ %s  ⑤ %s' % (
            a1, a2, a3.split(' / ', 1)[1], w3, ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '[5/6] L에서 [2/5] L 덜어 내기')
        rule_first(s, lv, '[5/6]에서 [2/5]를 빼려면 막대를 몇 칸으로 나누어야 할까요?', '')
        s.text(rd('이번에는 액체 비료 [5/6] L 중에서 [2/5] L를 덜어 냈어요. 두 막대의 조각 크기를 같게 만들어 보세요.'))
        split_fig(s, [('처음 [5/6] L', '5/6'), ('덜어 낸 [2/5] L', '2/5')], 30, False)
        a1 = chain(s, ['[5/6] = [{25}/30]', '[2/5] = [{12}/30]', '[5/6]−[2/5] = [25/30]−[12/30] = [{13}/30]'])
        step(s, 1, '그려 보기', '[7/9]−[1/6]을 두 가지 방법으로')
        s.text(rd('고추 칸 물통에 물이 [7/9] L 있었는데 [1/6] L를 썼어요. [7/9]−[1/6]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[7/9]−[1/6]', ['[7/9]−[1/6] = [7×{6}/9×{6}]−[1×{9}/6×{9}]', '= [{42}/54]−[{9}/54] = [{33}/54]'],
                      ['[7/9]−[1/6] = [7×{2}/9×{2}]−[1×{3}/6×{3}]', '= [{14}/18]−[{3}/18] = [{11}/18]'])
        step(s, 2, '말해 보기', '태오와 다른 방법 ― [9/10]−[5/8]')
        s.text(rd('태오는 [9/10]−[5/8]을 두 분모의 곱으로 통분해 계산했어요. 태오와 다른 방법으로 계산해 보세요.'))
        a3 = chain(s, [('태오의 방법', '[9/10]−[5/8] = [72/80]−[50/80] = [22/80] = [11/40]'),
                       ('다른 방법', '[9/10]−[5/8] = [9×{4}/10×{4}]−[5×{5}/8×{5}]'), ('', '= [{36}/40]−[{25}/40] = [{11}/40]')])
        w3 = why_ans(s, lv, '태오가 [22/80]을 약분해야 했던 까닭을 공통분모로 설명해 봐요.', '',
                     '두 분모의 곱 80은 최소공배수 40의 2배라서, 계산 결과의 분모와 분자를 2로 나누어 약분해야 했어요.')
        step(s, 3, '약속하기', '분모가 다른 분수의 뺄셈')
        a4 = blanks(s, lv, SUB_RULE)
        step(s, 4, '확인하기', '새 빗물과 비료 계산하기')
        a5 = calc(s, [{'e': '[8/9]−[5/12]', 'a': '17/36'}, {'e': '[6/7]−[3/5]', 'a': '9/35'},
                      {'q': '비가 온 뒤 상추 칸 물받이에는 빗물이 [7/8] L, 고추 칸 물받이에는 [5/6] L 모였어요. 상추 칸 물받이에 빗물이 몇 L 더 많이 모였을까요?', 'x': '[7/8]−[5/6]', 'a': '1/24', 'unit': 'L'}])
        ans = '5차시  ① 예상 예: 6과 5의 최소공배수인 30칸으로 나누어요. / %s (13/30 L)  ② %s  ③ %s / 왜: %s  ④ %s  ⑤ %s' % (
            a1, a2, a3.split(' / ', 1)[1], w3, ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 지안이의 실수')
        s.text(rd('지안이가 비료 계산을 하다가 실수했어요. 어떤 수에서 [1/4]을 빼야 하는데 잘못하여 더했더니 [11/12]이 되었어요.'))
        a6 = calc(s, [{'q': '어떤 수는 얼마일까요?', 'x': '[11/12]−[1/4]', 'a': '8/12'}, {'q': '바르게 계산하면 얼마일까요?', 'x': '[8/12]−[1/4]', 'a': '5/12'}])
        s.ask('어떤 수를 어떻게 구했는지 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ 어떤 수 %s, 바르게 계산한 값 %s' % (a6[0], a6[1])
    return ans


def st6(s, lv):
    lessons_head(s, 6, '개념 구축하기(O)', '덩굴 길이 비교하기 ― 대분수의 뺄셈(1)', '분수 부분끼리 뺄 수 있는 분모가 다른 대분수의 뺄셈은 어떻게 할까요?',
                 '지안이네 모둠의 호박 덩굴은 [2 3/4] m, 오이 덩굴은 [1 1/6] m 자랐어요. 호박 덩굴은 오이 덩굴보다 몇 m 더 길까요?')
    if lv == '기본형':
        step(s, 0, '만져 보기', '덩굴 길이 덜어 내기')
        e1 = est(s, '호박 덩굴은 오이 덩굴보다 약 몇 m 더 길까요?', ['약 1 m', '약 2 m', '약 4 m'], 1)
        s.text(rd('1 m를 12칸으로 나눈 막대에 호박 덩굴의 길이가 색칠되어 있어요. [1 1/6] m만큼 ×표 해 보세요.' + (' [1 1/6] = [1 2/12]예요.' if lv == '기본형' else '')))
        take_fig(s, '호박 덩굴 [2 3/4] m', '2 3/4', 12)
        a1 = chain(s, ['[2 3/4] = [2 {9}/12]', '[1 1/6] = [1 {2}/12]', '[2 3/4]−[1 1/6] = [2 9/12]−[1 2/12] = [{1} {7}/12]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 빼기')
        s.text(rd('고추 칸 둘레에 친 줄은 [4 5/6] m, 가지 칸 둘레에 친 줄은 [2 3/8] m예요. [4 5/6]−[2 3/8]을 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[4 5/6]−[2 3/8]', ['[4 5/6]−[2 3/8] = [4 {20}/24]−[2 {9}/24]', '= ({4}−{2})+([20/24]−[9/24]) = [{2} {11}/24]'],
                      ['[4 5/6]−[2 3/8] = [{29}/6]−[{19}/8]', '= [{116}/24]−[{57}/24] = [{59}/24] = [{2} {11}/24]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '민재의 계산 고치기')
        s.text(rd('민재가 [3 2/3]−[1 1/4]을 잘못 계산했어요.'))
        eq_fig(s, [('민재의 계산', '[3 2/3]−[1 1/4] = [3 8/12]−[1 3/12]'), ('', '= 2−[5/12] = [1 7/12]')])
        a3 = chooses(s, [('잘못된 까닭은?', ['자연수끼리 뺀 결과와 분수끼리 뺀 결과를 더해야 하는데 뺐어요', '통분을 잘못했어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[3 2/3]−[1 1/4] = [3 8/12]−[1 3/12] = {2}+[{5}/12] = [{2} {5}/12]')])
        w3 = why_ans(s, lv, '자연수끼리 뺀 결과와 분수끼리 뺀 결과를 더해야 하는 까닭을 써 봐요.', '‘대분수는 자연수와 분수를 ~ 수라서, 나누어 뺀 두 결과를 ~해야 해요.’ 꼴로 써요.',
                     '대분수 [3 8/12]은 3과 [8/12]을 더한 수예요. 그래서 3−1과 [8/12]−[3/12]을 각각 구한 다음 두 결과를 더해야 해요.')
        step(s, 3, '약속하기', '대분수의 뺄셈 방법')
        a4 = blanks(s, lv, ['두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 빼고 두 결과를 ', (['더하거나', '빼거나'], 0), ', 대분수를 ', (['가분수', '진분수'], 0),
                            '로 나타내고 통분하여 뺍니다. 자연수끼리, 분수끼리 계산하면 ', (['분수 부분의 계산이 편리하고', '약분을 꼭 해야 하고'], 0),
                            ', 가분수로 나타내면 자연수 부분과 분수 부분을 따로 계산하지 않아서 편리해요.'])
        step(s, 4, '확인하기', '덩굴과 감자 계산하기')
        a5 = calc(s, [{'e': '[5 7/10]−[2 1/4]', 'a': '3 9/20'}, {'e': '[6 5/9]−[3 1/6]', 'a': '3 7/18'},
                      {'q': '태오네 모둠은 감자를 [3 4/5] kg 캐어 그중 [1 1/2] kg을 급식실에 보냈어요. 남은 감자는 몇 kg일까요?', 'x': '[3 4/5]−[1 1/2]', 'a': '2 3/10', 'unit': 'kg'}])
        ans = '6차시  ① %s, %s (×표 1 m 막대와 2칸, 1 7/12 m)  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (
            e1, a1, a2, a3[0], a3b, w3, ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '더 자란 덩굴 길이')
        s.text(rd('한 주가 지나 호박 덩굴은 [3 5/6] m, 오이 덩굴은 [1 1/4] m가 되었어요.'))
        e1 = est(s, '호박 덩굴은 오이 덩굴보다 약 몇 m 더 길까요?', ['약 1 m', '약 3 m', '약 5 m'], 1)
        s.text(rd('1 m를 12칸으로 나눈 막대에 호박 덩굴의 길이가 색칠되어 있어요. [1 1/4] m만큼 ×표 해 보세요.'))
        take_fig(s, '호박 덩굴 [3 5/6] m', '3 5/6', 12)
        a1 = chain(s, ['[3 5/6] = [3 {10}/12]', '[1 1/4] = [1 {3}/12]', '[3 5/6]−[1 1/4] = [3 10/12]−[1 3/12] = [{2} {7}/12]'])
        step(s, 1, '그려 보기', '[6 3/4]−[3 2/5]를 두 가지 방법으로')
        s.text(rd('고추 칸 둘레에 친 줄은 [6 3/4] m, 가지 칸 둘레에 친 줄은 [3 2/5] m예요. [6 3/4]−[3 2/5]를 두 가지 방법으로 계산해 보세요.'))
        a2 = two_ways(s, lv, '[6 3/4]−[3 2/5]', ['[6 3/4]−[3 2/5] = [6 {15}/20]−[3 {8}/20]', '= ({6}−{3})+([15/20]−[8/20]) = [{3} {7}/20]'],
                      ['[6 3/4]−[3 2/5] = [{27}/4]−[{17}/5]', '= [{135}/20]−[{68}/20] = [{67}/20] = [{3} {7}/20]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '민재의 새 계산 고치기')
        s.text(rd('민재가 [4 5/6]−[2 1/4]을 잘못 계산했어요.'))
        eq_fig(s, [('민재의 계산', '[4 5/6]−[2 1/4] = [4 10/12]−[2 3/12]'), ('', '= 2−[7/12] = [1 5/12]')])
        a3 = chooses(s, [('잘못된 까닭은?', ['자연수끼리 뺀 결과와 분수끼리 뺀 결과를 더해야 하는데 뺐어요', '통분을 잘못했어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[4 5/6]−[2 1/4] = [4 10/12]−[2 3/12] = {2}+[{7}/12] = [{2} {7}/12]')])
        w3 = why_ans(s, lv, '민재의 답 [1 5/12]이 너무 작다는 것을 어림으로 설명해 봐요.', '',
                     '[4 5/6]은 5에 가깝고 [2 1/4]은 2에 가까워서 차는 약 3쯤이어야 하는데 [1 5/12]은 너무 작아요.')
        step(s, 3, '약속하기', '대분수의 뺄셈 방법')
        a4 = blanks(s, lv, ['두 대분수를 통분하여 자연수는 자연수끼리, 분수는 분수끼리 빼고 두 결과를 ', (['더하거나', '빼거나'], 0), ', 대분수를 ', (['가분수', '진분수'], 0),
                            '로 나타내고 통분하여 뺍니다. 자연수끼리, 분수끼리 계산하면 ', (['분수 부분의 계산이 편리하고', '약분을 꼭 해야 하고'], 0),
                            ', 가분수로 나타내면 자연수 부분과 분수 부분을 따로 계산하지 않아서 편리해요.'])
        step(s, 4, '확인하기', '덩굴과 감자 ― 여러 단계로')
        a5 = calc(s, [{'e': '[7 9/10]−[3 1/4]', 'a': '4 13/20'}, {'e': '[8 7/12]−[5 2/9]', 'a': '3 13/36'},
                      {'q': '태오네 모둠은 감자를 [4 5/6] kg 캐어 [2 1/4] kg은 급식실에, [1 1/3] kg은 집으로 보냈어요. 남은 감자는 몇 kg일까요?', 'x': '[4 5/6]−[2 1/4]−[1 1/3]', 'a': '1 3/12', 'unit': 'kg'}])
        ans = '6차시  ① %s, %s (×표 1 m 막대와 3칸, 2 7/12 m)  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (
            e1, a1, a2, a3[0], a3b, w3, ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 텃밭 퀴즈')
        a6 = calc(s, [{'q': '[5 3/4]보다 [2 1/6]만큼 더 작은 수는?', 'x': '[5 3/4]−[2 1/6]', 'a': '3 7/12'},
                      {'q': '물통 두 개에 물이 [4 5/6] L, [2 1/4] L 들어 있어요. 두 물통에 든 물의 양의 차는 몇 L일까요?', 'x': '[4 5/6]−[2 1/4]', 'a': '2 7/12', 'unit': 'L'}])
        s.ask('두 문제를 어떤 방법으로 계산했는지, 그 방법을 고른 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s' % ', '.join(a6)
    return ans


def st7(s, lv):
    lessons_head(s, 7, '개념 구축하기(O)', '고구마 나누어 먹기 ― 대분수의 뺄셈(2)', '분수 부분끼리 뺄 수 없는 분모가 다른 대분수의 뺄셈은 어떻게 할까요?',
                 '서진이네 모둠은 고구마를 [3 1/4] kg 캤어요. 그중 [1 2/3] kg을 쪄서 반 친구들과 나누어 먹었어요. 남은 고구마는 몇 kg일까요?')
    if lv == '기본형':
        step(s, 0, '만져 보기', '고구마 덜어 내기')
        rule_first(s, lv, '분수 부분끼리 뺄 수 없을 때는 어떻게 하면 될까요?', '‘내 규칙: 자연수 부분에서 1만큼을 ~로 바꾸어 분수 부분에 더한 다음 빼요.’ 꼴로 써요.')
        s.text(rd('1 kg 막대를 12칸으로 나누었어요. [1 2/3] kg만큼 ×표 해 보세요.' +
                  (' [1 2/3] = [1 8/12]이에요. 남은 작은 칸이 모자라면 1 kg 막대 하나를 [12/12]로 생각해요.' if lv == '기본형' else '')))
        take_fig(s, '고구마 [3 1/4] kg', '3 1/4', 12)
        a1 = chain(s, ['[3 1/4] = [3 {3}/12]', '[1 2/3] = [1 {8}/12]', '[3 1/4]−[1 2/3] = [{2} {15}/12]−[1 8/12] = [{1} {7}/12]'])
        step(s, 1, '그려 보기', '두 가지 방법으로 빼기')
        s.text(rd('고구마 줄기를 [5 1/6] m 걷어서 그중 [2 3/4] m로 바구니를 엮었어요. 남은 줄기의 길이를 두 가지 방법으로 구해 보세요.'))
        a2 = two_ways(s, lv, '[5 1/6]−[2 3/4]', ['[5 1/6]−[2 3/4] = [5 {2}/12]−[2 {9}/12]', '= [{4} {14}/12]−[2 9/12] = [{2} {5}/12]'],
                      ['[5 1/6]−[2 3/4] = [{31}/6]−[{11}/4]', '= [{62}/12]−[{33}/12] = [{29}/12] = [{2} {5}/12]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '하린이의 계산 고치기')
        s.text(rd('하린이가 [4 1/6]−[1 3/4]을 계산했어요.'))
        eq_fig(s, [('하린이의 계산', '[4 1/6]−[1 3/4] = [4 2/12]−[1 9/12]'), ('', '= [4 14/12]−[1 9/12] = [3 5/12]')])
        a3 = chooses(s, [('잘못된 까닭은?', ['1만큼을 분수로 바꾸었는데 자연수 부분 4를 그대로 두었어요', '분수 부분끼리 더했어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[4 2/12]−[1 9/12] = [{3} {14}/12]−[1 9/12] = [{2} {5}/12]')])
        w3 = why_ans(s, lv, '1만큼을 분수로 바꾸면 자연수 부분이 왜 1 작아질까요?',
                     '‘1을 [12/12]로 바꾸어 ~에 더했으니, 자연수 부분에서는 1을 ~야 크기가 그대로예요.’ 꼴로 써요.',
                     '자연수 부분의 1을 [12/12]로 바꾸어 분수 부분에 더했으니, 자연수 부분에서는 그 1을 빼야 크기가 그대로예요.')
        step(s, 3, '약속하기', '분수 부분끼리 뺄 수 없을 때')
        a4 = blanks(s, lv, ['분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 ', (['1만큼을 분수로 나타내어', '분모만큼을 분자에 더하여'], 0), ' 계산해요. 이때 자연수 부분은 ',
                            (['1 작아져요', '그대로예요'], 0), '. 대분수를 ', (['가분수', '진분수'], 0), '로 나타내어 통분한 다음 빼도 돼요.'])
        step(s, 4, '확인하기', '고구마와 물 계산하기')
        a5 = calc(s, [{'e': '[6 2/5]−[3 2/3]', 'a': '2 11/15'}, {'e': '[4 1/8]−[2 5/6]', 'a': '1 7/24'},
                      {'q': '텃밭 물통에 물이 [5 1/3] L 있었는데 아침에 [2 4/5] L를 썼어요. 남은 물은 몇 L일까요?', 'x': '[5 1/3]−[2 4/5]', 'a': '2 8/15', 'unit': 'L'}])
        ans = '7차시  ① 예상 예: 자연수 부분에서 1만큼을 12/12로 바꾸어 분수 부분에 더한 다음 빼요. / %s (×표 1 kg 막대와 8칸)  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (
            a1, a2, a3[0], a3b, w3, ', '.join(a4), ', '.join(a5))
    else:
        step(s, 0, '만져 보기', '다른 모둠의 고구마 덜어 내기')
        rule_first(s, lv, '[4 1/6]에서 [1 3/4]을 뺄 때 어느 부분에서 막히는지 먼저 예상해 보세요.', '')
        s.text(rd('다른 모둠은 고구마를 [4 1/6] kg 캐어 그중 [1 3/4] kg을 쪄서 먹었어요. 1 kg 막대를 12칸으로 나누었어요. [1 3/4] kg만큼 ×표 해 보세요.'))
        take_fig(s, '고구마 [4 1/6] kg', '4 1/6', 12)
        a1 = chain(s, ['[4 1/6] = [4 {2}/12]', '[1 3/4] = [1 {9}/12]', '[4 1/6]−[1 3/4] = [{3} {14}/12]−[1 9/12] = [{2} {5}/12]'])
        step(s, 1, '그려 보기', '[6 1/5]−[3 2/3]을 두 가지 방법으로')
        s.text(rd('고구마 줄기를 [6 1/5] m 걷어서 그중 [3 2/3] m로 바구니를 엮었어요. 남은 줄기의 길이를 두 가지 방법으로 구해 보세요.'))
        a2 = two_ways(s, lv, '[6 1/5]−[3 2/3]', ['[6 1/5]−[3 2/3] = [6 {3}/15]−[3 {10}/15]', '= [{5} {18}/15]−[3 10/15] = [{2} {8}/15]'],
                      ['[6 1/5]−[3 2/3] = [{31}/5]−[{11}/3]', '= [{93}/15]−[{55}/15] = [{38}/15] = [{2} {8}/15]'],
                      '방법 1 · 자연수끼리, 분수끼리', '방법 2 · 가분수로')
        step(s, 2, '말해 보기', '하린이의 새 계산 고치기')
        s.text(rd('하린이가 [5 1/8]−[2 5/6]를 계산했어요.'))
        eq_fig(s, [('하린이의 계산', '[5 1/8]−[2 5/6] = [5 3/24]−[2 20/24]'), ('', '= [5 27/24]−[2 20/24] = [3 7/24]')])
        a3 = chooses(s, [('잘못된 까닭은?', ['1만큼을 분수로 바꾸었는데 자연수 부분 5를 그대로 두었어요', '분수 부분끼리 더했어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[5 3/24]−[2 20/24] = [{4} {27}/24]−[2 20/24] = [{2} {7}/24]')])
        w3 = why_ans(s, lv, '하린이의 계산을 거꾸로 확인하는 방법(뺀 결과에 빼는 수를 더하기)으로 틀린 것을 보여 봐요.', '',
                     '[3 7/24]+[2 20/24] = [6 3/24]이라서 처음 수 [5 3/24]보다 1 커요. 그래서 1만큼 잘못 계산했어요.')
        step(s, 3, '약속하기', '분수 부분끼리 뺄 수 없을 때')
        a4 = blanks(s, lv, ['분수 부분끼리 뺄 수 없을 때에는 자연수 부분의 ', (['1만큼을 분수로 나타내어', '분모만큼을 분자에 더하여'], 0), ' 계산해요. 이때 자연수 부분은 ',
                            (['1 작아져요', '그대로예요'], 0), '. 대분수를 ', (['가분수', '진분수'], 0), '로 나타내어 통분한 다음 빼도 돼요.'])
        step(s, 4, '확인하기', '고구마와 물 ― 여러 단계로')
        a5 = calc(s, [{'e': '[7 3/8]−[4 5/6]', 'a': '2 13/24'}, {'e': '[5 2/7]−[1 2/3]', 'a': '3 13/21'},
                      {'q': '텃밭 물통에 물이 [6 1/4] L 있었는데 아침에 [2 5/6] L, 저녁에 [1 2/3] L를 썼어요. 남은 물은 몇 L일까요?', 'x': '[6 1/4]−[2 5/6]−[1 2/3]', 'a': '1 9/12', 'unit': 'L'}])
        ans = '7차시  ① 예상 예: 2/12에서 9/12를 뺄 수 없어서 막혀요. / %s (×표 1 kg 막대와 9칸)  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (
            a1, a2, a3[0], a3b, w3, ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 계산하고 문제 만들기')
        a6 = calc(s, [{'e': '[4 1/3]−[1 4/5]', 'a': '2 8/15'}])
        s.ask(rd('[4 1/3]−[1 4/5]에 알맞은 텃밭 문제를 만들어 써 봐요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s / 문제 예: 텃밭 물통에 물이 4 1/3 L 있었는데 오이 칸에 1 4/5 L를 주었어요. 남은 물은 몇 L일까요?' % a6[0]
    return ans


HV = {'let': '1 3/4', 'pep': '5/6', 'tom': '2 2/3', 'give': '2 1/2'}


def st8(s, lv):
    lessons_head(s, 8, '탐구 정리하기(O)', '수확한 채소 나누기 ― 생각을 모아요', '수확한 채소의 무게를 더하고 빼서 나눔 계획을 세워 볼까요?',
                 '드디어 수확하는 날이에요! 수확 기록 카드를 읽어 보세요.')
    s.table([['수확한 채소', '나눔 계획'],
             [rd('상추 [%s] kg\n고추 [%s] kg\n방울토마토 [%s] kg' % (HV['let'], HV['pep'], HV['tom'])),
              rd('급식실에 보내기: [%s] kg\n나머지는 반 친구들 가족과 나누기' % HV['give'])]], row_h=5200)
    if lv == '기본형':
        step(s, 0, '만져 보기', '문제 이해하기')
        a1 = chooses(s, [('우리 반이 구하려는 것은 무엇인가요?', ['급식실에 보내고 남는 채소의 무게', '수확한 채소의 가격', '채소를 나누어 줄 친구의 수'], 0),
                         ('수확한 방울토마토는 몇 kg인가요?', ['[2 2/3] kg', '[1 3/4] kg', '[5/6] kg'], 0),
                         ('급식실에 보낼 채소는 몇 kg인가요?', ['[2 1/2] kg', '[2 2/3] kg', '[5 1/4] kg'], 0)])
        step(s, 1, '그려 보기', '계획 세우기')
        a2 = blanks(s, lv, ['수확한 채소의 무게는 세 채소의 무게를 모두 ', (['더해요', '빼요'], 0), '. 남는 채소는 수확한 무게에서 급식실에 보낼 무게를 ',
                            (['빼요', '더해요'], 0), '. 세 분수를 더할 때는 ', (['두 수씩 차례대로 더하거나 세 분모의 공통분모로 통분해요', '분모끼리 모두 더해요'], 0), '.'])
        step(s, 2, '말해 보기', '차례대로 계산하기')
        if lv == '기본형':
            s.text(rd('[1 3/4]+[5/6] = [1 9/12]+[10/12]처럼 통분해요. 분수 부분끼리 뺄 수 없으면 1만큼을 [12/12]로 바꾸어요.'))
        tot = F(HV['let']) + F(HV['pep']) + F(HV['tom'])
        left = tot - F(HV['give'])
        assert tot == F('5 3/12') and left == F('2 9/12')
        a3 = []
        for tag, e, a in [('① 상추와 고추', '[1 3/4]+[5/6]', '2 7/12'), ('② 방울토마토까지', '[2 7/12]+[2 2/3]', '5 3/12'),
                          ('③ 급식실에 보내고 남는 채소', '[5 3/12]−[2 1/2]', '2 9/12')]:
            s.ask(tag, blank=False)
            a3 += calc(s, [{'e': e, 'a': a, 'unit': 'kg', 'den': 12}])
        w3 = why_ans(s, lv, '세 분수를 한꺼번에 통분한다면 공통분모로 무엇을 쓰면 좋을까요?', '‘4, 6, 3의 최소공배수인 ~를 공통분모로 써요.’ 꼴로 써요.',
                     '4, 6, 3의 최소공배수인 12를 공통분모로 써요. [1 9/12]+[10/12]+[2 8/12] = 3+[27/12] = [5 3/12]이에요.')
        assert lcm(lcm(4, 6), 3) == 12
        step(s, 3, '약속하기', '값이 같은 식 잇기')
        left_e, right_e = ['[1 3/4]+[5/6]', '[5 1/4]−[2 1/2]'], ['[3 1/3]−[3/4]', '[1 1/6]+[1 7/12]', '[2 2/3]+[1/6]']
        pairs = []
        for l in left_e:
            m = [r for r in right_e if ev(r) == ev(l)]
            assert len(m) == 1
            pairs.append(m[0])
        assert all(ev(r) not in [ev(l) for l in left_e] for r in right_e if r not in pairs)
        s.text('계산 결과가 같은 식끼리 선으로 이어 보세요. 짝이 없는 식도 있어요.')
        match_fig(s, left_e, right_e)
        a4 = ', '.join('%s — %s (= %s)' % (flat(l), flat(r), red(ev(l))) for l, r in zip(left_e, pairs))
        step(s, 4, '확인하기', '되돌아보기')
        s.ask('남는 채소의 무게를 어떻게 구했는지 설명해 보세요.', blank=False)
        if lv == '기본형':
            s.fill('세 채소의 무게를 통분하여 ________________ 하고, 그 합에서 ________________ 을 빼서 구했어요.')
        else:
            s.lines(2)
        s.ask('계산 결과가 알맞은지 어떻게 확인할 수 있을까요?', blank=False)
        if lv == '기본형':
            s.fill('어림하면 약 ______ kg에서 약 ______ kg을 빼서 약 ______ kg이니까 알맞아요.')
        else:
            s.lines(2)
        ans = '8차시  ① %s  ② %s  ③ %s / 왜: %s  ④ %s  ⑤ 예) 세 채소의 무게를 통분하여 차례대로 더해 5 1/4 kg을 구하고, 급식실에 보낼 2 1/2 kg을 빼서 2 3/4 kg을 구했어요. / 어림: 2+1+3 = 6에서 약 2 1/2을 빼서 약 3 1/2 kg쯤이에요.' % (
            ', '.join(a1), ', '.join(a2), ', '.join(a3), w3, a4)
    else:
        step(s, 0, '만져 보기', '수확 기록 카드 견주기')
        a1 = chooses(s, [('수확한 채소 중 가장 무거운 것은?', ['방울토마토', '상추', '고추'], 0),
                         ('상추와 고추 중 더 가벼운 것은?', ['고추', '상추'], 0),
                         ('급식실에 보낼 무게는 수확한 방울토마토보다 무거운가요, 가벼운가요?', ['무거워요', '가벼워요'], 1)])
        assert F(HV['give']) < F(HV['tom']) and F(HV['pep']) < F(HV['let'])
        step(s, 1, '그려 보기', '새 계획 ― 상추와 고추만 보낸다면')
        s.text(rd('서진이가 “급식실에 상추와 고추만 모두 보내면 어떨까?”라고 했어요. 상추와 고추를 합한 무게가 급식실에 보낼 [2 1/2] kg보다 얼마나 많은지 알아보려고 해요.'))
        a2 = blanks(s, lv, ['상추와 고추를 합한 무게는 두 무게를 ', (['더해요', '빼요'], 0), '. 급식실에 보낼 무게보다 얼마나 많은지는 두 무게의 ',
                            (['차', '합'], 0), '를 구해요.'])
        step(s, 2, '말해 보기', '새 계획 차례대로 계산하기')
        two = F(HV['let']) + F(HV['pep'])
        assert two == F('2 7/12') and two - F(HV['give']) == F('1/12')
        a3 = []
        for tag, e, a in [('① 상추와 고추를 합하면', '[1 3/4]+[5/6]', '2 7/12'), ('② 급식실에 보낼 무게보다 많은 양', '[2 7/12]−[2 1/2]', '1/12'),
                          ('③ 방울토마토는 상추보다 몇 kg 더 무거울까요?', '[2 2/3]−[1 3/4]', '11/12')]:
            s.ask(tag, blank=False)
            a3 += calc(s, [{'e': e, 'a': a, 'unit': 'kg', 'den': 12}])
        w3 = why_ans(s, lv, '상추와 고추만 보내도 [2 1/2] kg을 넘는다는 것을 계산하기 전에 어림으로 설명해 봐요.', '',
                     '[1 3/4]에 [3/4]만 더해도 [2 1/2]인데, [5/6]은 [3/4]보다 크니까 합은 [2 1/2]보다 커요.')
        step(s, 3, '약속하기', '값이 같은 새 식 잇기')
        left_e, right_e = ['[2 2/3]−[5/6]', '[1 3/4]+[2 1/2]'], ['[1 1/3]+[1/2]', '[5 1/2]−[1 1/4]', '[3/4]+[1 1/6]']
        pairs = []
        for l in left_e:
            m = [r for r in right_e if ev(r) == ev(l)]
            assert len(m) == 1
            pairs.append(m[0])
        assert all(ev(r) not in [ev(l) for l in left_e] for r in right_e if r not in pairs)
        s.text('계산 결과가 같은 식끼리 선으로 이어 보세요. 짝이 없는 식도 있어요.')
        match_fig(s, left_e, right_e)
        a4 = ', '.join('%s — %s (= %s)' % (flat(l), flat(r), red(ev(l))) for l, r in zip(left_e, pairs))
        step(s, 4, '확인하기', '새 계획 되돌아보기')
        s.ask('상추와 고추를 합한 무게와 급식실에 보낼 무게를 어떻게 비교했는지 설명해 보세요.', blank=False)
        s.lines(2)
        s.ask('새 계획처럼 하면 방울토마토는 모두 가족과 나눌 수 있어요. 가족과 나누는 채소는 처음 계획보다 몇 kg 많아지거나 적어지는지 써 보세요.', blank=False)
        s.lines(2)
        fam_old = two + F(HV['tom']) - F(HV['give'])
        fam_new = F(HV['tom'])
        ans = '8차시  ① %s  ② %s  ③ %s / 왜: %s  ④ %s  ⑤ 예) 상추와 고추를 통분하여 더해 2 7/12 kg을 구하고, 2 1/2 kg을 빼서 1/12 kg 더 많다는 것을 알았어요. / 처음 계획은 %s kg, 새 계획은 %s kg이라서 %s kg 적어져요.' % (
            ', '.join(a1), ', '.join(a2), ', '.join(a3), w3, a4, red(fam_old), red(fam_new), red(fam_old - fam_new))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 가족 나눔 봉지')
        s.text(rd('남은 [2 3/4] kg으로 가족 나눔 봉지를 만들어요. 첫째 봉지에 [1 1/3] kg, 둘째 봉지에 [7/8] kg을 담았어요.'))
        a6 = calc(s, [{'q': '담고 남은 채소는 몇 kg일까요?', 'x': '[2 3/4]−[1 1/3]−[7/8]', 'a': '13/24', 'unit': 'kg'}])
        s.ask('세 수를 어떤 차례로 계산했는지 까닭과 함께 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s' % a6[0]
    return ans


def st9(s, lv):
    lessons_head(s, 9, '발표하기(P)', '텃밭 놀이 한마당 ― 분수 윷놀이', '놀이를 하며 분모가 다른 분수를 정확하게 더하고 뺄 수 있을까요?',
                 '수확을 마친 날, 텃밭 놀이 한마당이 열렸어요! 주사위 눈만큼 말을 옮기고, 분수 주사위에 따라 도착한 칸의 분수와 더하거나 빼요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '놀이 방법 알아보기')
        a1 = chooses(s, [('분수 주사위에서 ♥가 나오면?', ['계산하지 않고 말을 그 칸에 그대로 두어요', '말을 처음으로 되돌려요'], 0),
                         ('계산 결과가 틀리면?', ['말을 옮기기 전에 있던 칸으로 되돌려요', '말을 한 칸 더 옮겨요'], 0)])
        assert F('1/6') > F('1/8')
        a1b = pick_eq(s, '도착한 칸이 [1/8]이고 분수 주사위가 −[1/6]일 때 세울 식은?', ['[1/6]−[1/8]', '[1/8]−[1/6]'], 0)
        step(s, 1, '그려 보기', '예나의 놀이 기록')
        a2 = calc(s, [{'q': '도착한 칸 [5/8], 분수 주사위 +[1/2]', 'e': '[5/8]+[1/2]', 'a': '1 1/8'},
                      {'q': '도착한 칸 [1 2/5], 분수 주사위 −[1/3]', 'e': '[1 2/5]−[1/3]', 'a': '1 1/15'},
                      {'q': '도착한 칸 [1/8], 분수 주사위 −[1/6]', 'e': '[1/6]−[1/8]', 'a': '1/24'}])
        step(s, 2, '말해 보기', '분수 윷놀이 하기')
        s.text('주사위를 던지고 말을 골라 움직인 다음, 계산 결과를 써요. ★ 칸에 멈추면 지름길로 가요. 모든 말이 먼저 놀이판을 나오면 이겨요.')
        yut_record(s)
        step(s, 3, '약속하기', '카드 놀이 하기')
        s.text('카드를 보기 전에 덧셈이나 뺄셈을 고르고, 노란 카드와 파란 카드를 한 장씩 뒤집어 계산해요. 5판을 해요. 계산이 맞으면 1점, 결과가 더 크면 1점을 더 얻어요.')
        card_record(s)
        step(s, 4, '확인하기', '이기는 전략 찾기')
        assert ev('[4/5]+[7/9]') > 1 and ev('[1 2/3]−[5/6]') == F('5/6') and ev('[3/4]−[3/8]') > ev('[3/4]−[3/7]')
        a5 = chooses(s, [('[4/5]+[7/9]은 1보다 클까요, 작을까요?', ['1보다 커요', '1보다 작아요'], 0),
                         ('[1 2/3]−[5/6]는?', ['[5/6]', '[1 1/6]', '[3/6]'], 0)])
        a5b = pick_eq(s, '[3/4]−[3/7]과 [3/4]−[3/8] 중 차가 더 큰 것은?', ['[3/4]−[3/7]', '[3/4]−[3/8]'], 1)
        w5 = why_ans(s, lv, '카드 놀이에서 결과가 큰 사람이 1점을 더 얻으려면 덧셈과 뺄셈 중 무엇을 고르면 좋을까요?',
                     '‘~을 고르면 좋아요. 왜냐하면 ~하면 결과가 ~지기 때문이에요.’ 꼴로 써요.',
                     '덧셈을 고르면 좋아요. 두 수를 더하면 결과가 두 수보다 커지고, 빼면 큰 수보다 작아지기 때문이에요.')
        ans = '9차시  ① %s, %s  ② %s  ③·④ (놀이 기록, 계산은 통분하여 확인)  ⑤ %s, %s (3/8 > 9/28) / 왜: %s' % (
            ', '.join(a1), a1b, ', '.join(a2), ', '.join(a5), a5b, w5)
    else:
        step(s, 0, '만져 보기', '놀이 방법 확인하기')
        a1 = chooses(s, [('★ 칸에 멈추면?', ['지름길로 가요', '처음으로 돌아가요'], 0),
                         ('모든 말이 먼저 놀이판을 나오면?', ['한 번 더 해요', '이겨요'], 1)])
        assert F('1/3') > F('1/4')
        a1b = pick_eq(s, '도착한 칸이 [1/4]이고 분수 주사위가 −[1/3]일 때 세울 식은?', ['[1/3]−[1/4]', '[1/4]−[1/3]'], 0)
        step(s, 1, '그려 보기', '하린이의 놀이 기록')
        a2 = calc(s, [{'q': '도착한 칸 [7/8], 분수 주사위 +[2/3]', 'e': '[7/8]+[2/3]', 'a': '1 13/24'},
                      {'q': '도착한 칸 [2 1/6], 분수 주사위 −[3/4]', 'e': '[2 1/6]−[3/4]', 'a': '1 5/12'},
                      {'q': '도착한 칸 [1/4], 분수 주사위 −[1/3]', 'e': '[1/3]−[1/4]', 'a': '1/12'}])
        step(s, 2, '말해 보기', '분수 윷놀이 기록')
        s.text('주사위를 던지고 말을 골라 움직인 다음, 계산 결과를 써요. ★ 칸에 멈추면 지름길로 가요. 모든 말이 먼저 놀이판을 나오면 이겨요.')
        yut_record(s)
        step(s, 3, '약속하기', '카드 놀이 기록')
        s.text('카드를 보기 전에 덧셈이나 뺄셈을 고르고, 노란 카드와 파란 카드를 한 장씩 뒤집어 계산해요. 5판을 해요. 계산이 맞으면 1점, 결과가 더 크면 1점을 더 얻어요.')
        card_record(s)
        step(s, 4, '확인하기', '새 전략 찾기')
        assert ev('[5/6]+[3/7]') > 1 and ev('[2 1/4]−[1 3/8]') == F('7/8') and ev('[5/6]−[2/7]') > ev('[5/6]−[2/5]')
        a5 = chooses(s, [('[5/6]+[3/7]은 1보다 클까요, 작을까요?', ['1보다 커요', '1보다 작아요'], 0),
                         ('[2 1/4]−[1 3/8]는?', ['[7/8]', '[1 1/8]', '[1 7/8]'], 0)])
        a5b = pick_eq(s, '[5/6]−[2/5]과 [5/6]−[2/7] 중 차가 더 큰 것은?', ['[5/6]−[2/5]', '[5/6]−[2/7]'], 1)
        w5 = why_ans(s, lv, '빼는 수가 [2/5]일 때와 [2/7]일 때 차가 달라지는 까닭을 써 봐요.', '',
                     '[2/7]이 [2/5]보다 작아서 덜 빼게 되니까 [5/6]−[2/7]의 차가 더 커요.')
        ans = '9차시  ① %s, %s  ② %s  ③·④ (놀이 기록, 계산은 통분하여 확인)  ⑤ %s, %s (23/42 > 13/30) / 왜: %s' % (
            ', '.join(a1), a1b, ', '.join(a2), ', '.join(a5), a5b, w5)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 윷판에서 나올 수 있는 계산')
        a6 = calc(s, [{'q': '도착한 칸 [1 1/4], 분수 주사위 −[1/3]', 'e': '[1 1/4]−[1/3]', 'a': '11/12'},
                      {'q': '도착한 칸 [1 7/8], 분수 주사위 +[2/5]', 'e': '[1 7/8]+[2/5]', 'a': '2 11/40'}])
        s.ask(rd('[1 1/4]−[1/3]을 어떻게 계산했는지 차례대로 써 보세요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s' % ', '.join(a6)
    return ans


def st10(s, lv):
    lessons_head(s, 10, '발표하기(P)', '우리 반 텃밭 발표회 ― 공부한 내용을 확인해요',
                 '분모가 다른 분수의 덧셈과 뺄셈을 배우기 전과 후, 내 생각은 어떻게 달라졌나요?', None)
    if lv == '기본형':
        step(s, 0, '만져 보기', '그림으로 빼기')
        s.text(rd('텃밭 발표회 첫 순서예요. 지안이는 씨앗 [5/6]봉지 중 [2/9]봉지를 심었어요. 두 막대의 조각 크기를 같게 만들고 남은 씨앗을 구해 보세요.'
                  + (' 점선을 따라 나누면 한 칸이 [1/18]이에요.' if lv == '기본형' else '')))
        split_fig(s, [('처음 [5/6]봉지', '5/6'), ('심은 [2/9]봉지', '2/9')], 18, lv == '기본형')
        a1 = chain(s, ['[5/6]−[2/9] = [{15}/18]−[{4}/18] = [{11}/18]'])
        step(s, 1, '그려 보기', '계산하기')
        a2 = calc(s, [{'e': '[1/3]+[2/7]', 'a': '13/21'}, {'e': '[2 5/6]+[1 3/8]', 'a': '4 5/24'}, {'e': '[7/12]−[2/9]', 'a': '13/36'}, {'e': '[6 3/10]−[2 3/4]', 'a': '3 11/20'}])
        step(s, 2, '말해 보기', '비교하고 고치기')
        a3 = cmp(s, [('[3/4]+[2/5]', '[3 1/2]−[2 1/3]')])
        s.text(rd('태오가 [6 2/9]−[3 5/6]를 잘못 계산했어요.'))
        eq_fig(s, [('태오의 계산', '[6 2/9]−[3 5/6] = [6 4/18]−[3 15/18]'), ('', '= [6 22/18]−[3 15/18] = [3 7/18]')])
        a3b = chooses(s, [('잘못된 까닭은?', ['1만큼을 분수로 바꾸었는데 자연수 부분 6을 그대로 두었어요', '통분을 잘못했어요'], 0)])
        a3c = chain(s, [('옳게', '[6 4/18]−[3 15/18] = [{5} {22}/18]−[3 15/18] = [{2} {7}/18]')])
        step(s, 3, '약속하기', '수 카드로 대분수 만들기')
        s.text('서진이는 수 카드 3, 4, 8로 가장 큰 대분수를, 하린이는 수 카드 2, 5, 7로 가장 작은 대분수를 만들어요. 두 대분수의 차를 구해 보세요.')
        a4 = mixed_cards(s, lv, [('서진', [3, 4, 8], 'max'), ('하린', [2, 5, 7], 'min')], '-')
        step(s, 4, '되돌아보기', '예전 생각, 지금 생각')
        s.text('1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 써 보세요.')
        panes(s, lv, [('예전 생각', '예전에는 ~라고 생각했어요', '예전에는 [1/2]+[1/3]을 분모끼리, 분자끼리 더해 [2/5]라고 생각했어요.'),
                      ('지금 생각', '지금은 ~라고 생각해요', '지금은 먼저 통분하고 분모는 그대로, 분자끼리 더해야 한다는 것을 알아요.'),
                      ('왜 바뀌었나', '~을 해 보고 바뀌었어요', '물 주기 막대를 더 잘게 나누어 조각 크기를 맞춰 보고 바뀌었어요.')])
        ans = '10차시  ① %s  ② %s  ③ %s (1 3/20 < 1 1/6), %s, %s  ④ %s  ⑤ (자유)' % (a1, ', '.join(a2), a3[0], a3b[0], a3c, a4)
    else:
        step(s, 0, '만져 보기', '그림으로 빼기 ― [7/8]봉지와 [5/12]봉지')
        s.text(rd('예나는 씨앗 [7/8]봉지 중 [5/12]봉지를 심었어요. 두 막대의 한 칸이 [1/24]이 되게 나누는 선을 그어 남은 씨앗을 구해 보세요.'))
        split_fig(s, [('처음 [7/8]봉지', '7/8'), ('심은 [5/12]봉지', '5/12')], 24, False)
        a1 = chain(s, ['[7/8]−[5/12] = [{21}/24]−[{10}/24] = [{11}/24]'])
        step(s, 1, '그려 보기', '새 계산하기')
        a2 = calc(s, [{'e': '[3/5]+[2/9]', 'a': '37/45'}, {'e': '[3 7/12]+[1 5/8]', 'a': '5 5/24'}, {'e': '[11/15]−[3/10]', 'a': '13/30'}, {'e': '[7 1/6]−[3 4/9]', 'a': '3 13/18'}])
        step(s, 2, '말해 보기', '새 식 비교하고 태오의 실수 고치기')
        a3 = cmp(s, [('[5/6]+[1/4]', '[4 2/3]−[3 3/4]')])
        s.text(rd('태오가 [5 1/4]−[2 5/6]를 잘못 계산했어요.'))
        eq_fig(s, [('태오의 계산', '[5 1/4]−[2 5/6] = [5 3/12]−[2 10/12]'), ('', '= [5 15/12]−[2 10/12] = [3 5/12]')])
        a3b = chooses(s, [('잘못된 까닭은?', ['통분을 잘못했어요', '1만큼을 분수로 바꾸었는데 자연수 부분 5를 그대로 두었어요'], 1)])
        a3c = chain(s, [('옳게', '[5 3/12]−[2 10/12] = [{4} {15}/12]−[2 10/12] = [{2} {5}/12]')])
        step(s, 3, '약속하기', '새 수 카드로 대분수 만들기')
        s.text('서진이는 수 카드 2, 6, 9로 가장 큰 대분수를, 하린이는 수 카드 1, 4, 7로 가장 작은 대분수를 만들어요. 두 대분수의 차를 구해 보세요.')
        a4 = mixed_cards(s, lv, [('서진', [2, 6, 9], 'max'), ('하린', [1, 4, 7], 'min')], '-')
        step(s, 4, '되돌아보기', '예전 생각, 지금 생각')
        s.text('이 단원에서 가장 크게 달라진 생각을 떠올리며 써 보세요.')
        panes(s, lv, [('예전 생각', '예전에는 ~라고 생각했어요', ''), ('지금 생각', '지금은 ~라고 생각해요', ''), ('왜 바뀌었나', '~을 해 보고 바뀌었어요', '')])
        ans = '10차시  ① %s  ② %s  ③ %s (1 1/12 > 11/12), %s, %s  ④ %s  ⑤ (자유)' % (a1, ', '.join(a2), a3[0], a3b[0], a3c, a4)
    if lv == '도전형':
        step(s, 5, '도전하기', '★★ 교문에서 꽃밭까지')
        s.text(rd('교문에서 텃밭까지는 [2/5] km, 텃밭에서 꽃밭까지는 [1/2] km, 교문에서 꽃밭까지 바로 가면 [5/6] km예요.'))
        a6 = calc(s, [{'q': '교문에서 텃밭을 거쳐 꽃밭까지 가는 거리는 몇 km일까요?', 'e': '[2/5]+[1/2]', 'a': '9/10', 'unit': 'km'},
                      {'q': '텃밭을 거쳐 가는 거리는 바로 가는 거리보다 몇 km 더 멀까요?', 'e': '[9/10]−[5/6]', 'a': '2/30', 'unit': 'km'}])
        s.ask('두 번째 문제를 풀 때 첫 번째 답을 어떻게 썼는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s' % ', '.join(a6)
    return ans


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10]


def build(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 5. 분수의 덧셈과 뺄셈(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u5-fracadd.html과 차시 번호가 같습니다. 정답의 ‘2 1/4’은 대분수 2와 4분의 1, ‘9/4’는 가분수 4분의 9를 뜻해요. '
                   '(= …)는 약분한 기약분수예요. 합이나 차는 약분하지 않은 분수, 가분수, 대분수로 써도 값이 같으면 맞아요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build(TB, '5-1 수학 5. 분수의 덧셈과 뺄셈(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build(ST, '5-1 수학 5. 분수의 덧셈과 뺄셈(이야기 버전)', '이야기 버전', OUT_ST, lv))
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
