# -*- coding: utf-8 -*-
"""4-2 수학 1. 분수의 덧셈과 뺄셈 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u1-fracadd.py

앱 원본 ../units/sem2/u1-fracadd.tb.js('우주 호텔', 10차시)·u1-fracadd.st.js('우리 반 요리 교실', 10차시)와
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 똑같이 맞춥니다. 정답은 모두 이 스크립트가 분수로 계산해 확인합니다.

분수 표기
  - 계산 식·빈칸은 그림(PNG)으로 넣어 분수를 위아래(분자/분모)로 씁니다. 빈칸은 네모, 답 칸은 큰 네모.
  - 글 속 분수는 읽는 말로 씁니다: [3/7] → '7분의 3', [2 1/4] → '2와 4분의 1'(앱의 읽어 주기와 같음).
  - 교사용 정답 쪽은 줄여서 '3/7', '2 1/4'(= 2와 4분의 1)로 씁니다.
그림은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음). Chromium 하나를 띄워 모든 그림을 찍습니다.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from fractions import Fraction
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade4/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '1단원_분수의덧셈과뺄셈_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦'
WORK = tempfile.mkdtemp(prefix='u1frac_')
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


def pie_fig(s, d, label):
    import math
    out = []
    cx, cy, r = 160, 150, 120
    out.append('<circle cx="%d" cy="%d" r="%d" fill="#F7E7C6" stroke="%s" stroke-width="4"/>' % (cx, cy, r, INK))
    for k in range(d):
        a = math.radians(-90 + 360 * k / d)
        out.append('<line x1="%d" y1="%d" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.5"/>'
                   % (cx, cy, cx + r * math.cos(a), cy + r * math.sin(a), INK))
    out.append(T(330, 150, label, 30))
    W = int(330 + tw(label, 30) + 20)
    put_png(s, svg_doc(W, 300, ''.join(out)), W, 300, max_mm=110)


def line_fig(s, d, mx, fs=28):
    """0~mx 수직선, 작은 눈금 1/d"""
    W = 1160
    x0, x1 = 50, W - 50
    out = ['<line x1="%d" y1="90" x2="%d" y2="90" stroke="%s" stroke-width="3"/>' % (x0 - 20, x1 + 20, INK)]
    n = mx * d
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        big = i % d == 0
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="%s"/>'
                   % (x, 90 - (18 if big else 10), x, 90 + (18 if big else 10), INK, 3 if big else 2))
        if big:
            out.append(T(x, 135, str(i // d), fs, anchor='middle'))
    put_png(s, svg_doc(W, 160, ''.join(out)), W, 160)


def cards_fig(s, cards, fs=36):
    out, x = [], 12
    for c in cards:
        w = eq_w(c, fs) + 36
        out.append('<rect x="%.1f" y="10" width="%.1f" height="120" rx="12" fill="#FFF8E6" stroke="%s" stroke-width="3"/>'
                   % (x, w, INK))
        eq_line(c, x + 18, 70, fs, out)
        x += w + 22
    put_png(s, svg_doc(int(x), 140, ''.join(out)), int(x), 140)


def coins_fig(s):
    out = []
    for cx, name, wgt, col in ((200, '100원', '[5 21/50] g', '#D9D9D9'), (620, '10원', '[1 11/50] g', '#E7C08A')):
        out.append('<circle cx="%d" cy="80" r="62" fill="%s" stroke="%s" stroke-width="4"/>' % (cx, col, INK))
        out.append(T(cx, 80, name, 34, anchor='middle'))
        ww = eq_w(wgt, 32)
        eq_line(wgt, cx - ww / 2, 200, 32, out)
    put_png(s, svg_doc(820, 250, ''.join(out)), 820, 250, max_mm=120)


def map_fig(s, names, labs):
    """세 곳 지도: names [왼쪽 아래, 위, 오른쪽 아래], labs [왼-위, 위-오른, 왼-오른]"""
    P = [(130, 250), (450, 80), (770, 250)]
    out = []
    for (a, b), lab, ly in zip(((0, 1), (1, 2), (0, 2)), labs, (140, 140, 300)):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#C9A777" stroke-width="16" stroke-linecap="round"/>'
                   % (P[a] + P[b]))
        mx = (P[a][0] + P[b][0]) / 2
        if (a, b) == (0, 1):
            mx -= 120
        elif (a, b) == (1, 2):
            mx += 120
        w = eq_w(lab, 30)
        eq_line(lab, mx - w / 2, ly, 30, out)
    for (x, y), n, c in zip(P, names, FILLS):
        out.append('<rect x="%d" y="%d" width="124" height="56" rx="12" fill="%s" stroke="%s" stroke-width="3"/>'
                   % (x - 62, y - 28, c, INK))
        out.append(T(x, y, n, 26, anchor='middle'))
    put_png(s, svg_doc(900, 350, ''.join(out)), 900, 350, max_mm=140)


def ladder(items, perm):
    """앱 f1Ladder와 같은 가로줄 → (rungs, 각 식이 도착하는 집)"""
    n = len(items)
    arr, core = list(range(n)), []
    for _ in range(n):
        for c in range(n - 1):
            if perm[arr[c]] > perm[arr[c + 1]]:
                arr[c], arr[c + 1] = arr[c + 1], arr[c]
                core.append(c)
    rungs = [2, 2] + core[:1] + [0, 0] + core[1:] + [2, 2]

    def walk(i):
        c = i
        for r in rungs:
            if c == r:
                c = r + 1
            elif c == r + 1:
                c = r
        return c
    for i in range(n):
        assert walk(i) == perm[i], '사다리 확인 필요'
    return rungs


def ladder_fig(s, items, perm):
    rungs = ladder(items, perm)
    n = len(items)
    W, top, bot = 1160, 120, 520
    CX = [145 + 290 * c for c in range(n)]
    out = []
    for c in range(n):
        w = eq_w(items[c], 26) + 20
        out.append('<rect x="%.1f" y="8" width="%.1f" height="96" rx="10" fill="#FFF8E6" stroke="%s" stroke-width="2.5"/>'
                   % (CX[c] - w / 2, w, INK))
        eq_line(items[c], CX[c] - w / 2 + 10, 56, 26, out)
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="5"/>' % (CX[c], top, CX[c], bot, INK))
        out.append('<rect x="%d" y="%d" width="190" height="110" rx="10" fill="#fff" stroke="%s" stroke-width="2.5"/>'
                   % (CX[c] - 95, bot + 12, INK))
        out.append(T(CX[c], bot + 34, '%d번 집' % (c + 1), 24, anchor='middle', fill='#2E6B5A'))
    for k, r in enumerate(rungs):
        y = top + (k + .5) * (bot - top) / len(rungs)
        out.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="%s" stroke-width="5"/>' % (CX[r], y, CX[r + 1], y, INK))
    put_png(s, svg_doc(W, bot + 132, ''.join(out)), W, bot + 132)


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


def classify(s, cards):
    """진분수·가분수·대분수 나누기: cards [(분수, 종류번호)]"""
    cards_fig(s, [c for c, k in cards])
    s.table([['진분수', '가분수', '대분수'], ['', '', '']], row_h=4300)
    names = ['진분수', '가분수', '대분수']
    return ' · '.join('%s %s' % (names[k], ', '.join(flat(c) for c, kk in cards if kk == k)) for k in range(3))


def calc(s, items, cols=2):
    """items: {e: 보이는 식, a: 답, unit, q: 문제 글, x: 확인용 식, den}. 정답 글 목록(번호 순)."""
    ans, plain, k = [], [], 0
    for it in items:
        e = it.get('x') or it['e']
        a = F(it['a'])
        assert ev(e) == a, ('답 확인 필요', e, it['a'])
        d = it.get('den') or den_of(it['e'] if 'e' in it else e) or den_of(it['a'])
        it['_ans'] = book(a, d) + (' ' + it['unit'] if it.get('unit') else '')
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


def chain(s, rows, check_rows=True):
    """앱 f1Chain: 줄마다 빈칸 {답}. 한글 없는 '=' 줄은 값이 같은지 확인. 정답(채운 식) 글."""
    for r in rows:
        e = r[1] if isinstance(r, tuple) else r
        full = re.sub(r'\{([^}]*)\}', r'\1', e).replace('▢', '')
        if check_rows and '=' in full and not re.search(r'[가-힣]', full):
            vals = [ev(p.replace('(', '').replace(')', '')) if '(' not in p else _paren(p) for p in full.split('=') if p.strip()]
            assert all(v == vals[0] for v in vals), ('식 확인 필요', full)
    eq_fig(s, rows)
    return ' / '.join(flat(r[1] if isinstance(r, tuple) else r).strip() for r in rows)


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
           '네모 칸에는 수를, 큰 네모 칸에는 답(가분수나 대분수)을 써요.')


def cards_best(cards, den):
    best = worst = None
    for a in cards:
        for b in cards:
            if a == b or b >= den or a < 1:
                continue
            v = a * den + b
            if best is None or v > best[2]:
                best = (a, b, v)
            if worst is None or v < worst[2]:
                worst = (a, b, v)
    return best, worst


# ================================================================ 차시 내용(앱과 같은 수) — 교과서·이야기 공통 틀
def L_add_proper(s, lv, P):
    """2차시: 진분수의 덧셈"""
    s.lesson(2, '개념 구축하기(O)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    step(s, 0, *P['n'][0])
    s.text(rd(P['bars_inst']))
    bars_fig(s, [(nm, 1, None) for nm, k in P['bars']], P['d1'])
    a1 = chain(s, P['bars_rows'])
    step(s, 1, *P['n'][1])
    if P.get('rule'):
        rule_first(s, lv, *P['rule'][:2])
    s.text(rd(P['line_inst']))
    line_fig(s, P['line'][0], P['line'][1])
    a2 = chain(s, P['line_rows'])
    step(s, 2, *P['n'][2])
    s.text(rd(P['wrong']))
    a3 = blanks(s, lv, P['wrong_blanks'])
    if P.get('why3'):
        why(s, lv, *P['why3'][:2])
    step(s, 3, *P['n'][3])
    a4 = blanks(s, lv, [
        '분모가 같은 분수의 덧셈은 분모는 ', (['그대로 쓰고', '분모끼리 더하고'], 0), ', 분자끼리 ', (['더합니다', '곱합니다'], 0),
        '. 합이 가분수이면 ', (['대분수', '진분수'], 0), '로 나타낼 수 있어요.'])
    step(s, 4, *P['n'][4])
    if lv == '기본형':
        s.text('분모는 그대로, 분자끼리 더해요. 합은 가분수로 써도, 대분수로 써도 맞아요.')
    a5 = calc(s, P['calc'])
    ans = '2차시  ① %s (색칠 %s)  ② %s%s  ③ %s%s  ④ %s  ⑤ %s' % (
        a1, '·'.join('%d칸' % k for nm, k in P['bars']), a2,
        ' (예상: %s)' % rd(P['rule'][2]) if P.get('rule') else '', ', '.join(a3),
        ' / 왜: %s' % rd(P['why3'][2]) if P.get('why3') else '', ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', P['ch_sub'])
        a6 = calc(s, P['ch'])
        s.ask('□ 안에 들어갈 수 있는 자연수를 모두 써 보세요. 왜 그 수만 되는지 까닭도 써요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %d개 (□ = %s, 분자의 합이 %d보다 작아야 해요)' % (', '.join(a6), len(P['ch_box']), ', '.join(map(str, P['ch_box'])), P['ch_box_den'])
    return ans


def L_add_mixed(s, lv, P):
    """3차시: 대분수의 덧셈"""
    s.lesson(3, '개념 구축하기(O)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    step(s, 0, *P['n'][0])
    s.text(rd(P['fill1_inst']))
    (A, av), (B, bv) = P['fill1']
    amount_fig_blank(s, [(A, av), (B, bv)], P['d1'])
    e1 = est(s, *P['est1'])
    a1 = calc(s, [P['calc1']])
    step(s, 1, *P['n'][1])
    if P.get('rule'):
        rule_first(s, lv, *P['rule'][:2])
    s.text(rd(P['fill2_inst']))
    amount_fig_blank(s, P['fill2'], P['d2'])
    a2 = chain(s, P['m1_rows'])
    step(s, 2, *P['n'][2])
    a3 = chain(s, [P['m2_row']])
    a3b = blanks(s, '기본형', [
        '방법 1은 ', (['자연수 부분과 분수 부분으로 나누어서', '대분수를 가분수로 바꾸어'], 0), ' 계산했고, 방법 2는 ',
        (['자연수 부분과 분수 부분으로 나누어서', '대분수를 가분수로 바꾸어'], 1), ' 계산했어요.'])
    if P.get('why3'):
        why(s, lv, *P['why3'][:2])
    step(s, 3, *P['n'][3])
    a4 = blanks(s, lv, [
        '대분수의 덧셈은 자연수 부분끼리, ', (['분수 부분끼리', '분모끼리'], 0), ' 더하거나, 대분수를 ', (['가분수', '진분수'], 0),
        '로 바꾸어 계산해요. 분수 부분끼리 더한 것이 가분수이면 ', (['대분수로 바꾸어 자연수 부분에 더해요', '그대로 두어요'], 0), '.'])
    step(s, 4, *P['n'][4])
    if lv == '기본형':
        s.text('자연수 부분끼리, 분수 부분끼리 더해요. 분수 부분의 합이 1이거나 1보다 크면 1을 자연수 부분으로 옮겨요.')
    a5 = calc(s, P['calc'], cols=2)
    ans = '3차시  ① %s, %s  ② %s%s  ③ %s (%s)%s  ④ %s  ⑤ %s' % (
        e1, a1[0], a2, ' (예상: %s)' % rd(P['rule'][2]) if P.get('rule') else '', a3, ' / '.join(a3b),
        ' / %s' % rd(P['why3'][2]) if P.get('why3') else '', ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        cards, den = P['cards']
        (bw, bn, bv), (ww, wn, wv) = cards_best(cards, den)
        step(s, 5, '도전하기', '수 카드로 대분수 만들기')
        s.text(rd(P['cards_inst']))
        cards_fig(s, [str(c) for c in cards])
        eq_fig(s, [('가장 큰 대분수', '[□ □/%d]' % den), ('가장 작은 대분수', '[□ □/%d]' % den), '두 수의 합 = ▢'])
        s.ask('가장 큰 대분수를 만든 방법을 써 보세요.', blank=False)
        s.lines(1)
        tot = Fraction(bv + wv, den)
        ans += '  ⑥ %d %d/%d, %d %d/%d, 합 %s (자연수 부분에 가장 큰 수, 분자에 그다음 큰 수)' % (
            bw, bn, den, ww, wn, den, book(tot, den))
    return ans


def amount_fig_blank(s, rows, d):
    """색칠할 빈 막대: 값만큼 1(d칸) 막대를 넉넉히 그림"""
    k = max(int(F(v)) + (1 if F(v) % 1 else 0) for _, v in rows)
    bars_fig(s, [('%s [%s]' % (n, v) if '/' in v else '%s %s' % (n, v), k, None) for n, v in rows], d)


def L_sub_proper(s, lv, P):
    """4차시: 진분수의 뺄셈"""
    s.lesson(4, '개념 구축하기(O)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    step(s, 0, *P['n'][0])
    s.text(rd(P['bars_inst']))
    bars_fig(s, [(nm, 1, None) for nm, k in P['bars']], P['d1'])
    a1 = chain(s, P['bars_rows'])
    step(s, 1, *P['n'][1])
    s.text(rd(P['line_inst']))
    line_fig(s, P['line'][0], P['line'][1])
    a2 = chain(s, P['line_rows'])
    step(s, 2, *P['n'][2])
    a3 = blanks(s, lv, P['say'])
    if P.get('why3'):
        why(s, lv, *P['why3'][:2])
    step(s, 3, *P['n'][3])
    a4 = blanks(s, lv, ['분모가 같은 분수의 뺄셈은 분모는 ', (['그대로 쓰고', '분모끼리 빼고'], 0), ', 분자끼리 ',
                        (['뺍니다', '더합니다'], 0), '.'])
    step(s, 4, *P['n'][4])
    if lv == '기본형':
        s.text('분모는 그대로, 분자끼리 빼요. 약분은 아직 배우지 않았으니 차를 그대로 써요.')
    a5 = calc(s, P['calc'], cols=3)
    ans = '4차시  ① %s (색칠 %s)  ② %s  ③ %s%s  ④ %s  ⑤ %s' % (
        a1, '·'.join('%d칸' % k for nm, k in P['bars']), a2, ', '.join(a3),
        ' / %s' % rd(P['why3'][2]) if P.get('why3') else '', ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '알맞은 문제 완성하기')
        s.text(rd(P['ch_inst']))
        a6 = chooses(s, P['ch'])
        s.ask('왜 그 문장을 골랐는지 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s, %s (남은 양을 묻는 문제가 뺄셈이에요)' % (a6[0], a6[1])
        if P.get('ch_write'):
            s.ask(rd(P['ch_write'][0]), blank=False)
            s.lines(2)
            ans += ' / 문제 만들기 예: %s' % rd(P['ch_write'][1])
    return ans


def L_sub_mixed1(s, lv, P):
    """5차시: 대분수의 뺄셈(1)"""
    s.lesson(5, '개념 구축하기(O)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    step(s, 0, *P['n'][0])
    s.text(rd(P['take_inst']))
    amount_fig(s, [(P['take_name'], P['take'][0])], P['take'][2])
    e1 = est(s, *P['est1'])
    a1 = calc(s, [P['calc1']])
    step(s, 1, *P['n'][1])
    s.text(rd(P['m1_inst']))
    a2 = chain(s, P['m1_rows'])
    step(s, 2, *P['n'][2])
    a3 = chain(s, [P['m2_row']])
    a3b = blanks(s, '기본형', ['방법 1은 ', (['자연수 부분과 분수 부분으로 나누어서', '대분수를 가분수로 바꾸어'], 0),
                               ' 계산했고, 방법 2는 ', (['자연수 부분과 분수 부분으로 나누어서', '대분수를 가분수로 바꾸어'], 1), ' 계산했어요.'])
    if P.get('why3'):
        why(s, lv, *P['why3'][:2])
    step(s, 3, *P['n'][3])
    a4 = blanks(s, lv, ['분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 자연수 부분끼리, 분수 부분끼리 ', (['빼거나', '더하거나'], 0),
                        ', 대분수를 ', (['가분수', '자연수'], 0), '로 바꾸어 계산해요. 어느 방법으로 계산해도 답은 ', (['같아요', '달라요'], 0), '.'])
    step(s, 4, *P['n'][4])
    if lv == '기본형':
        s.text('자연수 부분끼리, 분수 부분끼리 빼요. 가분수가 섞여 있으면 같은 꼴로 바꾸어 계산해요.')
    a5 = calc(s, P['calc'])
    ans = '5차시  ① %s, %s (×표 %s만큼)  ② %s  ③ %s (%s)%s  ④ %s  ⑤ %s' % (
        e1, a1[0], P['take'][1], a2, a3, ' / '.join(a3b), ' / %s' % rd(P['why3'][2]) if P.get('why3') else '',
        ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', P['ch_sub'])
        q, picks, a = P['pick']
        target = F(re.search(r'\[([^\]]+)\]', q).group(1))
        for i, p in enumerate(picks):
            assert (ev(p) == target) == (i == a), p
        s.ask(rd(q), blank=False)
        grid_fig(s, ['%s %s' % ('㉠㉡㉢'[i], p) for i, p in enumerate(picks)], cols=3)
        s.ask('답: (        )', blank=False)
        a6 = calc(s, [P['ch_calc']])
        s.ask('㉠~㉢ 중 하나를 골라 왜 답이 아닌지 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s (%s)  %s' % ('㉠㉡㉢'[a], ', '.join('%s=%s' % (flat(p), form(ev(p), den_of(p))) for p in picks), a6[0])
    return ans


def L_sub_whole(s, lv, P):
    """6차시: 자연수와 분수의 뺄셈"""
    s.lesson(6, '개념 구축하기(O)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    step(s, 0, *P['n'][0])
    if P.get('rule'):
        rule_first(s, lv, *P['rule'][:2])
    s.text(rd(P['pie_inst']))
    pie_fig(s, P['pie'], P['pie_label'])
    a1 = chain(s, P['pie_rows'])
    step(s, 1, *P['n'][1])
    s.text(rd(P['take_inst']))
    amount_fig(s, [(P['take_name'], P['take'][0])], P['take'][1])
    a2 = chain(s, P['m1_rows'])
    if P.get('why2'):
        why(s, lv, *P['why2'][:2])
    step(s, 2, *P['n'][2])
    a3 = chain(s, [P['m2_row']])
    a3b = blanks(s, '기본형', ['방법 1은 자연수에서 ', (['1만큼을 분수로 바꾸어', '분수를 자연수로 바꾸어'], 0),
                               ' 자연수 부분과 분수 부분으로 나누어서 계산했고, 방법 2는 ',
                               (['자연수와 대분수를 모두 가분수로 바꾸어', '자연수 부분끼리만 빼서'], 0), ' 계산했어요.'])
    step(s, 3, *P['n'][3])
    a4 = blanks(s, lv, ['(자연수)−(분수)는 자연수에서 ', (['1만큼을', '분모만큼을'], 0),
                        ' 분모와 분자가 같은 분수로 바꾸어 계산하거나, 자연수와 분수를 모두 ', (['가분수', '진분수'], 0),
                        '로 바꾸어 계산해요. 예를 들어 '] + P['ex4'])
    step(s, 4, *P['n'][4])
    if lv == '기본형':
        s.text(rd(P['hint5']))
    a5 = calc(s, P['calc'], cols=3)
    ans = '6차시  ① %s%s  ② %s%s  ③ %s (%s)  ④ %s  ⑤ %s' % (
        a1, ' (예상: %s)' % rd(P['rule'][2]) if P.get('rule') else '', a2,
        ' / %s' % rd(P['why2'][2]) if P.get('why2') else '', a3, ' / '.join(a3b), ', '.join(a4), ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', P['ch_sub'])
        a6 = calc(s, [P['ch_calc']])
        picks, a = P['pick']
        vals = [ev(p) for p in picks]
        assert vals[a] == max(vals) and len(set(vals)) == 2
        s.ask('⑤ 차가 더 큰 것을 골라 ○ 하세요.', blank=False)
        grid_fig(s, ['%s %s' % ('㉠㉡'[i], p) for i, p in enumerate(picks)], cols=2)
        s.ask('어떻게 비교했는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s  ㉠㉡ 중 %s (%s)' % (a6[0], '㉠㉡'[a], ', '.join('%s=%s' % (flat(p), form(ev(p), den_of(p))) for p in picks))
    return ans


def L_sub_mixed2(s, lv, P):
    """7차시: 대분수의 뺄셈(2)"""
    s.lesson(7, '개념 구축하기(O)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    step(s, 0, *P['n'][0])
    if P.get('rule'):
        rule_first(s, lv, *P['rule'][:2])
    s.text(rd(P['take_inst']))
    amount_fig(s, [(P['take_name'], P['take'][0])], P['take'][2])
    e1 = est(s, *P['est1'])
    a1 = calc(s, [P['calc1']])
    step(s, 1, *P['n'][1])
    s.text(rd(P['line_inst']))
    line_fig(s, P['line'][0], P['line'][1])
    a2 = chain(s, P['m1_rows'])
    step(s, 2, *P['n'][2])
    a3 = chain(s, [P['m2_row']])
    a3b = blanks(s, '기본형', ['방법 1은 자연수에서 ', (['1만큼을 분수로 바꾸어', '큰 분자에서 작은 분자를 빼서'], 0),
                               ' 계산했고, 방법 2는 ', (['자연수 부분끼리만 빼서', '대분수를 가분수로 바꾸어'], 1), ' 계산했어요.'])
    step(s, 3, *P['n'][3])
    s.text(rd(P['fix_inst']))
    a4 = blanks(s, lv, P['fix'])
    if P.get('why4'):
        why(s, lv, *P['why4'][:2])
    step(s, 4, *P['n'][4])
    if lv == '기본형':
        s.text('분수 부분끼리 뺄 수 없으면 자연수에서 1만큼을 분수로 바꾸어요. 가분수로 바꾸어 계산해도 돼요.')
    a5 = calc(s, P['calc'], cols=3)
    ans = '7차시  ① %s, %s%s  ② %s  ③ %s (%s)  ④ %s%s  ⑤ %s' % (
        e1, a1[0], ' (예상: %s)' % rd(P['rule'][2]) if P.get('rule') else '', a2, a3, ' / '.join(a3b), ', '.join(a4),
        ' / %s' % rd(P['why4'][2]) if P.get('why4') else '', ', '.join(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', P['ch_sub'])
        e, mixed_w, d, opts = P['ch_box']
        v = ev(e)
        ok = [o for o in opts if v > mixed_w + Fraction(o, d)]
        s.text('□ 안에 들어갈 수 있는 자연수를 모두 골라 ○ 하세요.')
        eq_fig(s, ['%s > [%d □/%d]' % (e, mixed_w, d)], indent=30)
        s.ask('( ' + ' / '.join(map(str, opts)) + ' )', blank=False)
        l, r = P['ch_cmp']
        vl, vr = ev(l), ev(r)
        sign = '>' if vl > vr else '<' if vl < vr else '='
        s.text('○ 안에 >, =, < 중 알맞은 것을 써 보세요.')
        eq_fig(s, ['%s  ○  %s' % (l, r)], indent=30)
        s.ask('왜 그렇게 생각했는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ □ = %s (%s = %s)  ○: %s (%s, %s)' % (', '.join(map(str, ok)), flat(e), form(v, d), sign,
                                                       form(vl, den_of(l)), form(vr, den_of(r)))
    return ans


def L_drink(s, lv, P):
    """8차시: 생각을 더하다"""
    R = P['R']
    s.lesson(8, '탐구 정리하기(O)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    s.table([['필요한 재료 (1잔)', '가지고 있는 재료', '주문서'],
             [rd('%s: %s 1%s + %s [%s] 큰술\n%s: %s 1%s + %s [%s] 큰술' % (
                 R['d1'], R['base'], R['bu'], R['s1'], R['v1'], R['d2'], R['base'], R['bu'], R['s2'], R['v2'])),
              '%s %d%s\n%s %d 큰술\n%s %d 큰술' % (R['base'], R['have'][0], R['bu'], R['s1'], R['have'][1], R['s2'], R['have'][2]),
              '\n'.join(o[0] for o in R['orders'])]], col_mm=[70, 50, 60], row_h=5600)
    step(s, 0, *P['n'][0])
    a1 = chooses(s, P['quiz'])
    step(s, 1, *P['n'][1])
    a2 = blanks(s, lv, P['plan'])
    step(s, 2, *P['n'][2])
    # 주문서별 표
    v1, v2 = F(R['v1']), F(R['v2'])
    used = [0, Fraction(0), Fraction(0)]
    rows_ans = []
    lines = []
    for name, c1, c2 in R['orders']:
        cnt = c1 + c2
        e1 = '+'.join(['[%s]' % R['v1']] * c1) if c1 else None
        e2 = '+'.join(['[%s]' % R['v2']] * c2) if c2 else None
        used[0] += cnt
        used[1] += v1 * c1
        used[2] += v2 * c2
        row = [name, str(cnt), book(v1 * c1, den_of(R['v1'])) if c1 else '−', book(v2 * c2, den_of(R['v2'])) if c2 else '−']
        rows_ans.append('%s %s%s, %s, %s' % (row[0][:1], row[1], R['bu'], row[2], row[3]))
        if lv == '기본형':
            parts = ['%s %s = {%d}%s' % (R['base'], '+'.join(['1'] * cnt), cnt, R['bu'])]
            if e1:
                parts.append('%s %s = ▢' % (R['s1'], e1))
            if e2:
                parts.append('%s %s = ▢' % (R['s2'], e2))
            lines.append((name[:1], '    '.join(parts[:1])))
            for p in parts[1:]:
                lines.append(p)
    if lv == '기본형':
        eq_fig(s, lines, fs=30)
    else:
        s.table([['주문서', '%s(%s)' % (R['base'], R['bu']), '%s(큰술)' % R['s1'], '%s(큰술)' % R['s2']]] +
                [[name, '', '' if c1 else '−', '' if c2 else '−'] for name, c1, c2 in R['orders']],
                col_mm=[60, 35, 42, 43], row_h=3600)
    step(s, 3, *P['n'][3])
    base_used = used[0]
    left = [R['have'][0] - base_used, R['have'][1] - used[1], R['have'][2] - used[2]]
    assert [book(x, d) for x, d in zip(left, (1, den_of(R['v1']), den_of(R['v2'])))] == P['left'], left
    tot1 = '+'.join('[%s]' % form(v1 * c1, den_of(R['v1'])) for _, c1, _ in R['orders'] if c1)
    tot2 = '+'.join('[%s]' % form(v2 * c2, den_of(R['v2'])) for _, _, c2 in R['orders'] if c2)
    tot0 = '+'.join(str(c1 + c2) for _, c1, c2 in R['orders'])
    assert ev(tot1) == used[1] and ev(tot2) == used[2]
    a4 = calc(s, [{'e': tot0, 'a': str(base_used), 'unit': R['bu']}, {'e': tot1, 'a': form(used[1], den_of(R['v1'])), 'unit': '큰술'},
                  {'e': tot2, 'a': form(used[2], den_of(R['v2'])), 'unit': '큰술'},
                  {'e': '%d−%d' % (R['have'][0], base_used), 'a': str(left[0]), 'unit': R['bu']},
                  {'e': '%d−[%s]' % (R['have'][1], form(used[1], den_of(R['v1']))), 'a': form(left[1], den_of(R['v1'])), 'unit': '큰술'},
                  {'e': '%d−[%s]' % (R['have'][2], form(used[2], den_of(R['v2']))), 'a': form(left[2], den_of(R['v2'])), 'unit': '큰술'}],
               cols=2)
    step(s, 4, *P['n'][4])
    for q, help1, ansx in P['write']:
        s.ask(rd(q), blank=False)
        if lv == '기본형' and help1:
            s.fill(frame(help1))
        else:
            s.lines(2)
    ans = '8차시  ① %s  ② %s  ③ %s  ④ 쓴 양 %s / 남은 양 %s  ⑤ 예) %s' % (
        ', '.join(a1), ', '.join(a2), ' / '.join(rows_ans), ', '.join(a4[:3]), ', '.join(a4[3:]), rd(P['write'][0][2]))
    if lv == '도전형':
        step(s, 5, '도전하기', '주문서 ④')
        s.text(rd(P['ch_inst']))
        a6 = chooses(s, [P['ch_pick']])
        a7 = calc(s, [P['ch_calc']])
        s.ask('왜 그 재료가 모자라는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s, %s' % (a6[0], a7[0])
    return ans


def L_game(s, lv, P):
    """9차시: 놀이를 더하다"""
    s.lesson(9, '발표하기(P)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    step(s, 0, *P['n'][0])
    a1 = chooses(s, [('내 말이 친구의 말보다 도착선에 더 가까우면?', ['더해요', '빼요'], 0),
                     ('내 말이 책상 아래로 떨어지면?', ['더해요', '빼요'], 1),
                     ('놀이에서 이기려면 세 번 계산한 마지막 값이 친구보다?', ['커야 해요', '작아야 해요'], 0)])
    step(s, 1, *P['n'][1])
    s.text(rd(P['prac_inst']))
    a2 = calc(s, P['prac'], cols=1)
    step(s, 2, *P['n'][2])
    sets = {8: (3, ['1/8', '2/8', '3/8', '4/8', '5/8', '7/8']), 6: (5, ['3/6', '5/6', '7/6', '1 2/6', '1 4/6', '11/6']),
            4: (7, ['1/4', '3/4', '6/4', '1 1/4', '2 3/4', '9/4'])}
    for dd, (st, pcs) in sets.items():
        big = sorted((F(p) for p in pcs), reverse=True)
        assert st - sum(big[:3]) > 0
    s.text('친구와 함께 놀이해요. 분모가 8인 말 6개를 주머니에 넣고, 처음 수 3에서 시작해요.')
    cards_fig(s, ['[%s]' % p for p in sets[8][1]], fs=32)
    rec = [['회', '나: 꺼낸 말 · 더하기/빼기', '나: 계산한 값', '친구: 꺼낸 말 · 더하기/빼기', '친구: 계산한 값'],
           ['처음', '', '3', '', '3'], ['1회', '', '', '', ''], ['2회', '', '', '', ''], ['3회', '', '', '', '']]
    s.table(rec, col_mm=[18, 46, 35, 46, 35], row_h=3600)
    step(s, 3, *P['n'][3])
    s.text('주머니를 바꾸어 놀이해요. 분모 6: 처음 수 5 / 분모 4: 처음 수 7')
    cards_fig(s, ['[%s]' % p for p in sets[6][1]], fs=30)
    cards_fig(s, ['[%s]' % p for p in sets[4][1]], fs=30)
    if lv == '기본형':
        s.text('대분수와 가분수가 섞여 있으면 같은 꼴로 바꾸어 계산해요. 분수 부분끼리 뺄 수 없으면 1만큼을 분수로 바꾸어요.')
    s.table([['회', '꺼낸 말', '+ / −', '계산한 값'], ['처음', '', '', ''], ['1회', '', '', ''], ['2회', '', '', ''], ['3회', '', '', '']],
            col_mm=[25, 50, 35, 70], row_h=3300)
    step(s, 4, *P['n'][4])
    s.text(rd(P['other_inst']))
    me, fr = P['other']
    sums = [ev('[%s]+[%s]' % tuple(me)), ev('[%s]+[%s]' % tuple(fr))]
    difs = [abs(F(me[0]) - F(me[1])), abs(F(fr[0]) - F(fr[1]))]
    who = lambda a, b, big: P['who'][0] if (a > b) == big and a != b else P['who'][1] if a != b else '비겨요'  # noqa: E731
    exp = [who(sums[0], sums[1], True), who(difs[0], difs[1], True), who(difs[0], difs[1], False)]
    opts = [P['who'][0], P['who'][1], '비겨요']
    a5 = chooses(s, [('두 분수를 더하여 더 큰 수가 나온 사람', opts, opts.index(exp[0])),
                     ('큰 분수에서 작은 분수를 빼서 더 큰 수가 나온 사람', opts, opts.index(exp[1])),
                     ('큰 분수에서 작은 분수를 빼서 더 작은 수가 나온 사람', opts, opts.index(exp[2]))])
    assert a5 == P['who_ans'], (a5, P['who_ans'])
    if P.get('why5'):
        why(s, lv, *P['why5'][:2])
    d6 = den_of(me[0])
    ans = '9차시  ① %s  ② %s  ③④ (놀이 결과에 따라 달라요)  ⑤ %s (나 %s·%s, %s %s·%s)%s' % (
        ', '.join(a1), ', '.join(a2), ', '.join(a5), form(sums[0], d6), form(difs[0], d6), P['who'][1],
        form(sums[1], d6), form(difs[1], d6), ' / %s' % rd(P['why5'][2]) if P.get('why5') else '')
    if lv == '도전형':
        step(s, 5, '도전하기', '마지막 값 구하기')
        s.text(rd(P['ch_inst']))
        a6 = calc(s, [P['ch_calc']], cols=1)
        s.ask('어떤 차례로 계산했는지 써 보세요.', blank=False)
        s.lines(1)
        ans += '  ⑥ %s' % a6[0]
    return ans


def L_review(s, lv, P):
    """10차시: 공부한 내용을 확인해요"""
    s.lesson(10, '발표하기(P)', P['title'], P['question'])
    s.scene(None, rd(P['scene']))
    step(s, 0, *P['n'][0])
    s.text(rd(P['bars_inst']))
    bars_fig(s, [(nm, 1, None) for nm, k in P['bars']], P['d1'])
    a1 = chain(s, [P['bars_row']])
    step(s, 1, *P['n'][1])
    a2 = calc(s, P['calc'])
    step(s, 2, *P['n'][2])
    s.text('계산 결과가 같은 것끼리 선으로 이어 보세요. 짝이 없는 것도 있어요.')
    L, Rr = P['match']
    match_fig(s, L, Rr)
    pairs = []
    for l in L:
        hit = [r for r in Rr if ev(r) == ev(l)]
        assert len(hit) == 1, l
        pairs.append('%s = %s = %s' % (flat(l), flat(hit[0]), form(ev(l), den_of(l))))
    assert sum(1 for r in Rr if not any(ev(r) == ev(l) for l in L)) == 1
    step(s, 3, *P['n'][3])
    l, r = P['cmp']
    vl, vr = ev(l), ev(r)
    sign = '>' if vl > vr else '<' if vl < vr else '='
    s.text('합과 차의 크기를 비교하여 ○ 안에 >, =, < 중 알맞은 것을 써 보세요.')
    eq_fig(s, ['%s  ○  %s' % (l, r)], indent=30)
    s.text(rd(P['wrong']))
    eq_fig(s, [P['wrong_eq']], indent=30)
    a4 = blanks(s, '기본형', ['잘못된 까닭: ', (['분수 부분끼리 뺄 수 없는데 큰 분자에서 작은 분자를 뺐어요', '자연수 부분끼리 빼면 안 돼요'], 0)])
    s.text('옳게 계산해 보세요.')
    a4b = chain(s, [P['fix_row']])
    step(s, 4, *P['n'][4])
    s.text('위의 식에서 사다리를 타고 내려가 도착한 집에 합 또는 차를 써 보세요.')
    items, perm = P['ladder']
    ladder_fig(s, items, perm)
    lad = []
    for j in range(len(items)):
        i = perm.index(j)
        lad.append('%d번 집 %s' % (j + 1, form(ev(items[i]), den_of(items[i]))))
    ans = '10차시  ① %s  ② %s  ③ %s  ④ %s (%s, %s) / %s / %s  ⑤ %s' % (
        a1, ', '.join(a2), ' · '.join(pairs), sign, form(vl, den_of(l)), form(vr, den_of(r)), a4[0], a4b, ', '.join(lad))
    if P.get('panes'):
        step(s, 5, *P['n'][5])
        panes(s, lv, P['panes'])
        ans += '  ⑥ (자유)'
    k = 6 if P.get('panes') else 5
    if lv == '도전형':
        step(s, k, '도전하기', '★★ 거쳐 가는 길')
        s.text(rd(P['ch_inst']))
        map_fig(s, *P['map'])
        a6 = calc(s, P['ch'], cols=1)
        s.ask('거쳐 가는 길이 바로 가는 길보다 먼 까닭을 써 보세요.', blank=False)
        s.lines(1)
        ans += '  %s %s' % (NUM[k], ', '.join(a6))
    return ans


# ================================================================ 1차시(교과서·이야기 따로)
def tb1(s, lv):
    s.lesson(1, '개념 찾기(S)', '단원 도입 ― 우주 호텔에서 분수를 만나요',
             '분수의 덧셈과 뺄셈은 자연수의 덧셈과 뺄셈과 어떤 공통점과 차이점이 있을까요?')
    s.scene(None, '미래의 어느 날, 시우는 부모님과 함께 우주 호텔에 살고 있어요. 지구에서 온 친구 혜지와 함께 우주 채소를 키우고, '
                  '우주 식량을 먹고, 찰흙으로 우주 탐사선도 만들어요.')
    note_line(s)
    step(s, 0, '살펴보기', '동전의 무게')
    s.text(rd('자판기는 동전의 무게로 어떤 동전인지 구별한대요. 100원짜리 동전은 [5 21/50] g, 10원짜리 동전은 [1 11/50] g이에요(한국은행, 2023).'))
    coins_fig(s)
    a1 = chooses(s, [('두 동전을 저울 접시에 하나씩 올리면 어느 쪽으로 기울까요?', ['100원짜리', '10원짜리'], 0),
                     ('두 동전의 무게의 차를 구할 때 쓰는 셈은?', ['덧셈', '뺄셈'], 1)])
    assert F('5 21/50') > F('1 11/50')
    step(s, 1, '이야기하기', '덧셈일까, 뺄셈일까')
    if lv == '기본형':
        s.text('‘모두’, ‘함께’ 얼마인지 구할 때는 더하고, ‘남은’ 양이나 ‘얼마나 더’ 많은지, ‘차’를 구할 때는 빼요.')
    a2 = sort_cards(s, [('음식을 만들 때 사용한 재료의 양은 모두 얼마일까?', 0), ('미술 시간에 함께 사용한 철사의 길이는 모두 몇 m일까?', 0),
                        ('두 재배기에 준 물의 양은 모두 몇 L일까?', 0), ('먹고 남은 피자의 양은 얼마일까?', 1),
                        ('누가 음료수를 얼마나 더 많이 가지고 있을까?', 1), ('100원짜리와 10원짜리 동전의 무게의 차는 몇 g일까?', 1)],
                    ['덧셈', '뺄셈'])
    step(s, 2, '떠올리기', '분수')
    s.text('막대 전체를 똑같이 5로 나눈 것 중의 3만큼 색칠하고 빈칸을 채워 보세요.')
    bars_fig(s, [('막대', 1, None)], 5)
    a3 = chain(s, ['전체를 똑같이 5로 나눈 것 중의 3 → [{3}/{5}]', '[3/5]은 [1/5]이 {3}개예요.'])
    step(s, 3, '떠올리기', '여러 가지 분수')
    if lv == '기본형':
        s.text('분자가 분모보다 작으면 진분수, 분자가 분모와 같거나 분모보다 크면 가분수, 자연수와 진분수로 이루어진 분수는 대분수예요.')
    else:
        s.text('분수 카드를 진분수, 가분수, 대분수로 나누어 표에 써 보세요.')
    a4 = classify(s, [('[3/7]', 0), ('[9/4]', 1), ('[1 2/5]', 2), ('[5/5]', 1), ('[2/9]', 0), ('[3 1/6]', 2), ('[11/6]', 1)])
    step(s, 4, '확인하기', '가분수와 대분수 바꾸기')
    if lv == '기본형':
        s.text('자연수 1은 분모와 분자가 같은 분수예요. 1 = 4분의 4 = 5분의 5 = 6분의 6')
    a5 = chain(s, ['[2 1/4] = [{9}/4]', '[1 3/5] = [{8}/5]', '[13/5] = [{2} {3}/5]', '[11/6] = [{1} {5}/6]'])
    ans = '1차시  ① %s  ② %s  ③ %s (색칠 3칸)  ④ %s  ⑤ %s' % (', '.join(a1), '·'.join(a2), a3, a4, a5)
    if lv == '도전형':
        step(s, 5, '도전하기', '분수의 크기 비교')
        a6 = chooses(s, [('[5/8]와 [3/8] 중 더 큰 분수는?', ['[5/8]', '[3/8]'], 0), ('[1/4]과 [1/6] 중 더 큰 분수는?', ['[1/4]', '[1/6]'], 0),
                         ('[2 1/3]과 [8/3] 중 더 큰 분수는?', ['[2 1/3]', '[8/3]'], 1)])
        assert F('1/4') > F('1/6') and F('8/3') > F('2 1/3')
        s.ask(rd('[2 1/3]과 [8/3]의 크기를 어떻게 비교했는지 써 보세요.'), blank=False)
        s.lines(1)
        ans += '  ⑥ %s (예: 2 1/3 = 7/3이므로 8/3이 더 커요)' % ', '.join(a6)
    return ans


def st1(s, lv):
    s.lesson(1, '개념 찾기(S)', '우리 반 요리 교실을 열어요', '요리를 할 때 분수를 더하거나 빼야 하는 때는 언제일까요?')
    s.scene(None, '무지개초등학교 4학년 3반은 학기 말 ‘나눔 파티’를 위해 교실에서 요리 교실을 열었어요. '
                  '요리 반장 하은, 준서, 서아, 도윤, 지호가 모둠을 나누어 준비해요.')
    note_line(s)
    step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
    s.text('하은이가 가져온 🍪 나눔 파티 요리법 쪽지')
    s.fill([rd(t) for t in ['과일 펀치: 포도 주스 [2/5] L, 사과 주스 [1/5] L', '쿠키: 초코 반죽 [2 1/5] kg, 버터 반죽 [1 3/5] kg',
                            '팬케이크: 밀가루 [3 4/5] 컵 중에서 [1 2/5] 컵 쓰기', '선물 상자: 리본 1 m를 8칸으로 나누어 쓰기']])
    panes(s, lv, [('보여요', '쪽지에 ~이 보여요', '포도 주스 [2/5] L처럼 분수로 쓴 양이 보여요.'),
                  ('생각해요', '~할 때 분수를 더하거나 빼야 할 것 같아요', '펀치에 넣은 주스를 모두 구하려면 [2/5]와 [1/5]을 더해야 할 것 같아요.'),
                  ('궁금해요', '~은 어떻게 계산할까?', '분수끼리 더할 때 분모도 더해야 할까?')])
    step(s, 1, '그려 보기', '계량컵에 분수 나타내기')
    s.text(rd('준서가 계량컵 1컵을 똑같이 6칸으로 나누어 우유를 [4/6] 컵 따랐어요. 우유가 든 만큼 색칠하고 빈칸을 채워 보세요.'))
    bars_fig(s, [('우유', 1, None)], 6)
    a2 = chain(s, ['1컵을 똑같이 6으로 나눈 것 중의 4 → [{4}/{6}] 컵', '[4/6]는 [1/6]이 {4}개예요.'])
    step(s, 2, '말해 보기', '더할까, 뺄까?')
    if lv == '기본형':
        s.text('‘모두’, ‘함께’ 얼마인지 구할 때는 더하고, ‘남은’ 양이나 ‘얼마나 더’ 많은지 구할 때는 빼요.')
    a3 = sort_cards(s, [('펀치에 넣은 포도 주스와 사과 주스는 모두 몇 L일까?', 0), ('두 모둠이 만든 쿠키 반죽은 모두 몇 kg일까?', 0),
                        ('선물 상자 두 개를 꾸미는 데 쓴 리본은 모두 몇 m일까?', 0), ('밀가루를 덜어 쓰고 남은 양은 몇 컵일까?', 1),
                        ('빨간 리본은 노란 리본보다 몇 m 더 길까?', 1), ('감자전 1판 중에서 먹고 남은 양은 얼마일까?', 1)],
                    ['덧셈', '뺄셈'])
    why(s, lv, '‘남은 양’이나 ‘얼마나 더’를 구할 때 왜 뺄셈을 할까요?',
        '‘남은 양은 처음 양에서 ~을 덜어 낸 것이라서 뺄셈으로 구해요.’ 꼴로 써요.')
    step(s, 3, '약속하기', '여러 가지 분수')
    if lv == '기본형':
        s.text('분자가 분모보다 작으면 진분수, 분자가 분모와 같거나 분모보다 크면 가분수, 자연수와 진분수로 이루어진 분수는 대분수예요.')
    else:
        s.text('요리법에 나오는 분수 카드를 진분수, 가분수, 대분수로 나누어 표에 써 보세요.')
    a4 = classify(s, [('[2/5]', 0), ('[7/3]', 1), ('[2 1/4]', 2), ('[6/6]', 1), ('[5/8]', 0), ('[1 3/7]', 2), ('[9/4]', 1)])
    step(s, 4, '확인하기', '가분수와 대분수 바꾸기')
    if lv == '기본형':
        s.text('자연수 1은 분모와 분자가 같은 분수예요. 1 = 3분의 3 = 4분의 4 = 5분의 5')
    a5 = chain(s, ['[1 3/4] = [{7}/4]', '[2 2/3] = [{8}/3]', '[11/4] = [{2} {3}/4]', '[9/5] = [{1} {4}/5]'])
    ans = '1차시  ① (자유)  ② %s (색칠 4칸)  ③ %s / 왜: 남은 양은 처음 양에서 쓴 양을 덜어 낸 것이고, ‘얼마나 더’는 두 양의 차이라서 뺄셈으로 구해요.  ④ %s  ⑤ %s' % (
        a2, '·'.join(a3), a4, a5)
    if lv == '도전형':
        step(s, 5, '도전하기', '요리법 분수의 크기 비교')
        a6 = chooses(s, [('우유 [3/8] 컵과 [5/8] 컵 중 더 많은 것은?', ['[3/8] 컵', '[5/8] 컵'], 1),
                         ('케이크를 똑같이 5조각으로 나눈 한 조각과 3조각으로 나눈 한 조각 중 더 큰 것은?', ['[1/5]', '[1/3]'], 1),
                         ('[1 3/4]과 [9/4] 중 더 큰 분수는?', ['[1 3/4]', '[9/4]'], 1)])
        assert F('9/4') > F('1 3/4') and F('1/3') > F('1/5')
        s.ask(rd('[1 3/4]과 [9/4]의 크기를 어떻게 비교했는지 써 보세요.'), blank=False)
        s.lines(1)
        ans += '  ⑥ %s (예: 1 3/4 = 7/4이므로 9/4가 더 커요)' % ', '.join(a6)
    return ans


# ================================================================ 교과서 차시 버전 자료
TB_P = {
    2: dict(title='진분수의 덧셈을 해 볼까요', question='분모가 같은 진분수의 덧셈은 어떻게 할까요?',
            scene='로봇 선생님이 우유 전체를 똑같이 4로 나눈 것 중의 2만큼은 시우에게, 1만큼은 혜지에게 따라 주었어요.',
            n=[('색칠해 보기',), ('수직선에 나타내기',), ('말해 보기',), ('약속하기',), ('확인하기',)],
            bars_inst='두 사람이 마신 우유의 양을 색칠해 보세요.', d1=4, bars=[('시우', 2), ('혜지', 1)],
            bars_rows=['시우가 마신 양 [{2}/{4}] · 혜지가 마신 양 [{1}/{4}]',
                       '[2/4]는 [1/4]이 {2}개, [2/4]+[1/4]은 [1/4]이 {3}개예요.',
                       '두 사람이 마신 우유의 양  [2/4]+[1/4] = 전체의 [{3}/{4}]'],
            line_inst='[3/7]+[5/7]를 수직선에 화살표로 나타내어 계산해 보세요. 작은 눈금 한 칸은 [1/7]이에요.', line=(7, 2),
            line_rows=['[3/7]은 [1/7]이 {3}개, [5/7]는 [1/7]이 {5}개 → 합은 [1/7]이 {8}개',
                       '[3/7]+[5/7] = [{3}+{5}/7] = [{8}/7] = [{1} {1}/7]'],
            wrong='친구가 [3/7]+[5/7] = [8/14]이라고 계산했어요. 무엇이 잘못되었는지 알맞은 말을 골라 보세요.',
            wrong_blanks=['친구는 ', (['분모끼리도 더했어요', '분자끼리 뺐어요'], 0), '. [3/7]과 [5/7]는 모두 ', (['[1/7]', '[1/14]'], 0),
                          '이 몇 개인 수이므로, 더해도 단위분수는 바뀌지 않아요. 그래서 분모는 ', (['그대로 7', '14'], 0),
                          '이고, 분자끼리 더하면 [1/7]이 ', (['8개', '15개'], 0), '예요.'],
            calc=[{'e': '[3/8]+[4/8]', 'a': '7/8'}, {'e': '[7/9]+[2/9]', 'a': '1'}, {'e': '[4/6]+[5/6]', 'a': '1 3/6'},
                  {'q': '재생비누를 만드는 데 폐식용유를 예지는 [4/5] L, 수호는 [2/5] L 사용했어요. 두 사람이 사용한 폐식용유는 모두 몇 L일까요?',
                   'e': '[4/5]+[2/5]', 'a': '1 1/5', 'unit': 'L'}],
            ch_sub='수학익힘 문제',
            ch=[{'q': '민혁이는 집에서 출발하여 [6/10] km는 걷고 [7/10] km는 버스를 타고 학교에 갔어요. 집에서 학교까지의 거리는 몇 km일까요?',
                 'e': '[6/10]+[7/10]', 'a': '1 3/10', 'unit': 'km'}],
            ch_box=[1, 2, 3], ch_box_den=7, ch_box_expr=('3', 7)),
    3: dict(title='대분수의 덧셈을 해 볼까요', question='분모가 같은 대분수의 덧셈은 어떻게 할까요?',
            scene='우주 호텔 재배실에서 배추를 심은 재배기에는 물을 [2 1/4] L, 무를 심은 재배기에는 [1 2/4] L 사용했어요.',
            n=[('색칠하고 모으기',), ('방법 1', '나누어 더하기'), ('방법 2', '가분수로'), ('정리하기',), ('확인하기',)],
            fill1_inst='1 L를 4칸으로 나눈 막대에 두 물의 양을 색칠하고, 자연수 부분끼리, 분수 부분끼리 모아 보세요.',
            fill1=[('배추', '2 1/4'), ('무', '1 2/4')], d1=4,
            est1=('[2 1/4]+[1 2/4]는 몇 L쯤일까요?', ['2 L쯤', '3 L쯤', '5 L쯤'], 1),
            calc1={'e': '[2 1/4]+[1 2/4]', 'a': '3 3/4', 'unit': 'L'},
            fill2_inst='[1 3/5]+[2 4/5]를 그림에 색칠하고 모은 다음, 자연수 부분끼리, 분수 부분끼리 더해 보세요.',
            fill2=[('가', '1 3/5'), ('나', '2 4/5')], d2=5,
            m1_rows=[('방법 1', '[1 3/5]+[2 4/5] = ({1}+{2})+([3/5]+[4/5])'),
                     ' = {3}+[{7}/5] = 3+[{1} {2}/5] = [{4} {2}/5]'],
            m2_row=('방법 2', '[1 3/5]+[2 4/5] = [{8}/5]+[{14}/5] = [{22}/5] = [{4} {2}/5]'),
            calc=[{'e': '[1 1/7]+[2 4/7]', 'a': '3 5/7'}, {'e': '[2 5/6]+[3 2/6]', 'a': '6 1/6'}, {'e': '[3 5/8]+[10/8]', 'a': '4 7/8'}],
            cards=([3, 6, 8, 9], 11),
            cards_inst='수 카드 3, 6, 8, 9 중에서 2장을 골라 분모가 11인 대분수를 만들려고 해요. 가장 큰 대분수와 가장 작은 대분수를 만들고, 두 수의 합을 구해 보세요.'),
    4: dict(title='진분수의 뺄셈을 해 볼까요', question='분모가 같은 진분수의 뺄셈은 어떻게 할까요?',
            scene='시우와 혜지는 수수깡 1개를 똑같이 7조각으로 나눈 것 중 4조각을 날개에, 3조각을 몸통에 붙여 나비를 꾸몄어요.',
            n=[('색칠해 보기',), ('수직선에 나타내기',), ('말해 보기',), ('약속하기',), ('확인하기',)],
            bars_inst='사용한 수수깡을 각각 색칠해 보세요.', d1=7, bars=[('날개', 4), ('몸통', 3)],
            bars_rows=['날개 [{4}/{7}] · 몸통 [{3}/{7}]', '[4/7]와 [3/7]은 [1/7]이 각각 {4}개, {3}개예요.',
                       '[4/7]−[3/7]은 [1/7]이 {1}개 → 날개에 전체의 [{1}/{7}]만큼 더 사용했어요.'],
            line_inst='[5/6]−[2/6]를 수직선에 화살표로 나타내어 계산해 보세요. 작은 눈금 한 칸은 [1/6]이에요.', line=(6, 1),
            line_rows=['[5/6]와 [2/6]는 [1/6]이 각각 {5}개, {2}개 → 차는 [1/6]이 {3}개', '[5/6]−[2/6] = [{5}−{2}/6] = [{3}/6]'],
            say=['[5/6]는 [1/6]이 5개, [2/6]는 [1/6]이 2개예요. [5/6]−[2/6]는 [1/6]이 ', (['3개', '7개', '1개'], 0), '이므로 ',
                 (['[3/6]', '[3/0]', '[7/6]'], 0), '이에요. 빼도 단위분수 [1/6]의 크기는 ', (['그대로예요', '작아져요'], 0), '.'],
            calc=[{'e': '[3/4]−[2/4]', 'a': '1/4'}, {'e': '[6/8]−[4/8]', 'a': '2/8'}, {'e': '[8/9]−[5/9]', 'a': '3/9'}],
            ch_inst='[4/5]−[3/5]에 알맞은 문제를 완성하고 해결해 보세요. 문제의 앞부분은 “물병에 물이 [4/5] L 들어 있습니다.”예요.',
            ch=[('물병에 물이 [4/5] L 들어 있습니다. 뒤에 이어질 알맞은 문장은?',
                 ['그중에서 [3/5] L를 마셨습니다. 마시고 남은 물의 양은 몇 L인가요?', '[3/5] L를 더 부었습니다. 물은 모두 몇 L인가요?',
                  '물병 3개에 물이 [4/5] L씩 들어 있습니다. 물은 모두 몇 L인가요?'], 0),
                ('완성한 문제의 답은?', ['[1/5] L', '[7/5] L', '[1/0] L'], 0)]),
    5: dict(title='대분수의 뺄셈을 해 볼까요(1)', question='분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 어떻게 할까요?',
            scene='전망대에서 혜지는 실 [3 3/4] m 중에서 [1 1/4] m를 사용하여 시우에게 실뜨기를 가르쳐 주었어요.',
            n=[('×표 해 보기',), ('방법 1', '나누어 빼기'), ('방법 2', '가분수로'), ('정리하기',), ('확인하기',)],
            take_inst='실 그림(1 m가 4칸)에서 사용한 [1 1/4] m만큼 ×표 해 보세요.', take_name='실 [3 3/4] m', take=('3 3/4', '1 1/4', 4),
            est1=('[3 3/4]−[1 1/4]은 몇 m쯤일까요?', ['1 m쯤', '2 m쯤', '4 m쯤'], 1),
            calc1={'e': '[3 3/4]−[1 1/4]', 'a': '2 2/4', 'unit': 'm'},
            m1_inst='[2 4/5]−[1 2/5]를 자연수 부분끼리, 분수 부분끼리 빼서 계산해 보세요.',
            m1_rows=[('방법 1', '[2 4/5]−[1 2/5] = ({2}−{1})+([4/5]−[2/5])'), ' = {1}+[{2}/5] = [{1} {2}/5]'],
            m2_row=('방법 2', '[2 4/5]−[1 2/5] = [{14}/5]−[{7}/5] = [{7}/5] = [{1} {2}/5]'),
            calc=[{'e': '[8 5/6]−[4 4/6]', 'a': '4 1/6'}, {'e': '[7 6/8]−[1 2/8]', 'a': '6 4/8'}, {'e': '[5 9/11]−[18/11]', 'a': '4 2/11'}],
            ch_sub='수학익힘 문제',
            pick=('차가 [3 3/7]인 것을 골라 기호를 써 보세요.', ['[4 5/7]−[2 2/7]', '[8 4/7]−[36/7]', '[7 6/7]−[3 3/7]'], 1),
            ch_calc={'q': '밀가루가 [20/8] kg 있어요. 빵을 만드는 데 [1 3/8] kg을 사용하면 남는 밀가루는 몇 kg일까요?',
                     'e': '[20/8]−[1 3/8]', 'a': '1 1/8', 'unit': 'kg'}),
    6: dict(title='자연수와 분수의 뺄셈을 해 볼까요', question='(자연수)−(분수)는 어떻게 계산할까요?',
            scene='시우의 생일에 아버지가 떡케이크를 만들어 주셨어요. 시우와 혜지는 떡케이크 1판 중에서 [5/8]판을 먹었어요.',
            n=[('×표 해 보기',), ('방법 1', '1만큼을 분수로'), ('방법 2', '가분수로'), ('정리하기',), ('확인하기',)],
            pie_inst='떡케이크를 8조각으로 자른 그림이에요. 먹은 만큼 ×표 해 보세요.', pie=8, pie_label='떡케이크 1판',
            pie_rows=['1은 [8/8]이므로 [1/8]이 {8}개, [5/8]는 [1/8]이 {5}개예요.',
                      '1−[5/8]는 [1/8]이 {3}개 → 남은 떡케이크는 [{3}/{8}]판이에요.'],
            take_inst='3−[1 3/4]을 계산해요. 1을 [4/4]로 쪼갠 막대에 [1 3/4]만큼 ×표 한 다음, 빈칸을 채워 보세요.',
            take_name='3', take=('3', 4),
            m1_rows=[('방법 1', '3−[1 3/4] = [{2} {4}/4]−[1 3/4]'), ' = ({2}−{1})+([{4}/4]−[3/4]) = {1}+[{1}/4] = [{1} {1}/4]'],
            m2_row=('방법 2', '3−[1 3/4] = [{12}/4]−[{7}/4] = [{5}/4] = [{1} {1}/4]'),
            ex4=['4는 ', (['[3 5/5]', '[4 5/5]'], 0), '로 나타낼 수 있어요.'],
            hint5='1 = [6/6], 5 = [4 7/7], 4 = [3 5/5]로 바꾸어 봐요.',
            calc=[{'e': '1−[4/6]', 'a': '2/6'}, {'e': '5−[6/7]', 'a': '4 1/7'}, {'e': '4−[2 2/5]', 'a': '1 3/5'}],
            ch_sub='수학익힘 문제',
            ch_calc={'q': '철사 4 m가 있어요. 민서가 [1 1/8] m, 도현이가 [5/8] m를 사용했어요. 남은 철사는 몇 m일까요?',
                     'e': '4−[1 1/8]−[5/8]', 'a': '2 2/8', 'unit': 'm'},
            pick=(['5−[23/10]', '4−[1 2/10]'], 1)),
    7: dict(title='대분수의 뺄셈을 해 볼까요(2)', question='분수 부분끼리 뺄 수 없는 대분수의 뺄셈은 어떻게 할까요?',
            scene='시우와 혜지는 찰흙 [3 3/6] kg 중에서 [1 4/6] kg을 사용하여 우주 탐사선을 만들었어요.',
            n=[('×표 해 보기',), ('방법 1', '1만큼을 분수로'), ('방법 2', '가분수로'), ('정리하기',), ('확인하기',)],
            take_inst='찰흙 그림(1 kg이 6칸)에서 사용한 [1 4/6] kg만큼 ×표 해 보세요. [3/6]에서는 [4/6]만큼 ×표 할 수 없으면 어떻게 할까요?',
            take_name='찰흙 [3 3/6] kg', take=('3 3/6', '1 4/6', 6),
            est1=('[3 3/6]−[1 4/6]는 몇 kg쯤일까요?', ['1 kg쯤', '2 kg쯤', '3 kg쯤'], 1),
            calc1={'e': '[3 3/6]−[1 4/6]', 'a': '1 5/6', 'unit': 'kg'},
            line_inst='[4 1/3]−[1 2/3]를 수직선에 나타낸 다음, 자연수에서 1만큼을 분수로 바꾸어 계산해 보세요.', line=(3, 5),
            m1_rows=[('방법 1', '[4 1/3]−[1 2/3] = [{3} {4}/3]−[1 2/3]'), ' = ({3}−{1})+([{4}/3]−[2/3]) = {2}+[{2}/3] = [{2} {2}/3]'],
            m2_row=('방법 2', '[4 1/3]−[1 2/3] = [{13}/3]−[{5}/3] = [{8}/3] = [{2} {2}/3]'),
            fix_inst='친구가 [2 1/4]−[1 3/4]을 (2−1)+([3/4]−[1/4]) = [1 2/4]라고 계산했어요. 알맞은 말을 골라 정리해 보세요.',
            fix=['[1 2/4]+[1 3/4] = [3 1/4]이므로 [1 2/4]는 ', (['틀린 답이에요', '맞는 답이에요'], 0),
                 '. 분수 부분끼리 뺄 수 없을 때는 자연수에서 1만큼을 ', (['분모와 분자가 같은 분수', '[1/10]'], 0), '로 바꾸어 [2 1/4]을 ',
                 (['[1 5/4]', '[2 5/4]'], 0), '로 나타낸 다음 빼요. 그러면 [1 5/4]−[1 3/4] = ', (['[2/4]', '[1 2/4]'], 0), '이에요.'],
            calc=[{'e': '[3 2/4]−[1 3/4]', 'a': '1 3/4'}, {'e': '[5 1/7]−[2 5/7]', 'a': '2 3/7'}, {'e': '[2 4/8]−[14/8]', 'a': '6/8'}],
            ch_sub='수학익힘 문제', ch_box=('[6 2/4]−[15/4]', 2, 4, [1, 2, 3]), ch_cmp=('[4 2/9]−[2 6/9]', '[3 5/9]−[16/9]')),
    8: dict(title='생각을 더하다 ― 주어진 재료로 음료를 만들어 볼까요', question='주어진 재료로 음료를 만들고 남은 재료의 양은 어떻게 구할까요?',
            scene='세아는 학교에서 친구들과 함께 일일 찻집을 열었어요. 가지고 있는 재료로 주문서 ①~③의 음료를 만들었어요.',
            n=[('이해해요',), ('계획해요',), ('해결해요', '표 만들기'), ('해결해요', '남은 양'), ('되돌아봐요',)],
            R=dict(d1='매실에이드', d2='레모네이드', base='탄산수', bu='병', s1='매실청', s2='레몬청', v1='2 3/4', v2='3 1/3',
                   have=(10, 9, 15), orders=[('① 매실에이드 1잔, 레모네이드 2잔', 1, 2), ('② 매실에이드 2잔', 2, 0), ('③ 레모네이드 2잔', 0, 2)]),
            quiz=[('구하려는 것은 무엇인가요?', ['주문서 ①~③의 음료를 만들고 남은 재료의 양', '음료 한 잔의 값', '만들 수 있는 음료의 수'], 0),
                  ('레모네이드 1잔에 필요한 레몬청은?', ['[2 3/4] 큰술', '[3 1/3] 큰술', '15 큰술'], 1),
                  ('가지고 있는 매실청은?', ['9 큰술', '10 큰술', '15 큰술'], 0)],
            plan=['사용하는 재료의 양은 주문서별로 사용하는 재료의 양을 ', (['더해요', '빼요'], 0), '. 남은 재료의 양은 가지고 있는 재료에서 사용한 재료의 양을 ',
                  (['빼요', '더해요'], 0), '. 주문서별로 사용하는 양을 ', (['표로', '그림 한 장으로'], 0), ' 정리하면 보기 쉬워요.'],
            left=['3', '3/4', '1 2/3 (=5/3)'],
            write=[('남은 재료의 양을 어떻게 구했는지 설명해 보세요.', '‘주문서별로 ~을 표로 정리해 더하고, 가지고 있는 양에서 ~을 빼서 구했어요.’',
                    '주문서별로 사용한 양을 표로 정리해 더하고, 가지고 있는 양에서 빼서 구했어요.'),
                   ('다른 방법으로도 구할 수 있을까요?', '‘레몬청은 레모네이드가 모두 ~잔이니까 [3 1/3]을 ~번 더해서 구할 수도 있어요.’', '')],
            ch_inst='척척! 남은 재료로 주문서 ④ 레모네이드 1잔을 만들려고 해요. 더 필요한 재료의 양을 구해 보세요.',
            ch_pick=('모자라는 재료는 무엇인가요?', ['탄산수', '매실청', '레몬청'], 2),
            ch_calc={'q': '더 필요한 레몬청은 몇 큰술일까요?', 'e': '[3 1/3]−[1 2/3]', 'a': '1 2/3', 'unit': '큰술'}),
    9: dict(title='놀이를 더하다 ― 말을 튕겨 분수를 더하거나 빼 볼까요', question='말을 튕기는 놀이를 하며 분수를 더하거나 빼 볼까요?',
            scene='분모가 같은 분수 말 6개를 주머니에 넣고, 차례대로 하나씩 꺼내 책상 위에서 튕겨요. 내 말이 도착선에 더 가까우면 말에 적힌 분수를 더하고, '
                  '더 멀거나 책상 아래로 떨어지면 빼요. 세 번 계산한 뒤 마지막 값이 더 큰 사람이 이겨요. (말의 분수와 처음 수는 앱에서 정한 것이에요.)',
            n=[('놀이 방법 알아보기',), ('연습하기',), ('놀이하기', '분모 8'), ('놀이하기', '분모 6 · 4'), ('또 다른 놀이',)],
            prac_inst='분모가 8인 주머니로 놀이한 친구의 계산이에요. 처음 수는 3이에요. 차례대로 계산해 보세요.',
            prac=[{'e': '1회 (더 가까워서 더해요)  3+[2/8]', 'x': '3+[2/8]', 'a': '3 2/8'},
                  {'e': '2회 (떨어져서 빼요)  [3 2/8]−[5/8]', 'x': '[3 2/8]−[5/8]', 'a': '2 5/8'},
                  {'e': '3회 (더 가까워서 더해요)  [2 5/8]+[7/8]', 'x': '[2 5/8]+[7/8]', 'a': '3 4/8'}],
            other_inst='이긴 사람이 승리 조건을 고르고, 각자 분수 말을 2개씩 골라 동시에 뒤집어요. 나는 [5/6], [1 2/6]를, 친구는 [7/6], [3/6]을 뒤집었어요. 누가 이길까요?',
            other=(['5/6', '1 2/6'], ['7/6', '3/6']), who=('나', '친구'), who_ans=['나', '친구', '나'],
            ch_inst='말의 뒷면에 분모가 4인 분수를 적어 놀이했어요. 처음 수 7에서 [6/4]을 빼고, [2 3/4]을 더하고, [9/4]를 뺐어요. 마지막 값은 얼마일까요?',
            ch_calc={'e': '7−[6/4]+[2 3/4]−[9/4]', 'a': '6', 'den': 4}),
    10: dict(title='공부한 내용을 확인해요', question='분수의 덧셈과 뺄셈을 얼마나 잘 이해했는지 확인해 볼까요?',
             scene='분모가 같은 분수의 덧셈과 뺄셈은 분모는 그대로 쓰고 분자끼리 계산해요. 합이나 차는 가분수로 써도, 대분수로 써도 맞아요.',
             n=[('그림 보고 계산하기',), ('계산하기',), ('이어 보기',), ('비교하고 고치기',), ('꼭꼭! 사다리 타기',)],
             bars_inst='[3/6]과 [2/6]만큼 색칠하고, 그림을 보고 빈칸에 알맞은 수를 써 보세요.', d1=6, bars=[('[3/6]', 3), ('[2/6]', 2)],
             bars_row='[3/6]+[2/6] = [{3}+{2}/6] = [{5}/6]',
             calc=[{'e': '[3 6/10]+[4 3/10]', 'a': '7 9/10'}, {'e': '[1 8/9]+[2 5/9]', 'a': '4 4/9'}, {'e': '[7/8]−[5/8]', 'a': '2/8'},
                   {'e': '1−[4/5]', 'a': '1/5'}],
             match=(['[1 1/7]+[8/7]', '[3 2/7]−[1 5/7]'], ['3−[5/7]', '[4 6/7]−[2 3/7]', '[5/7]+[6/7]']),
             cmp=('[2 8/12]+[17/12]', '[7 4/12]−[41/12]'),
             wrong='잘못 계산한 곳을 찾아 까닭을 고르고 옳게 계산해 보세요.', wrong_eq='[5 1/4]−[3 2/4] = 2+[1/4] = [2 1/4]',
             fix_row='[5 1/4]−[3 2/4] = [{4} {5}/4]−[3 2/4] = {1}+[{3}/4] = [{1} {3}/4]',
             ladder=(['[6/11]+[4/11]', '[4 7/10]−[1 8/10]', '[1 3/6]+[2 4/6]', '1−[2/9]'], [1, 3, 0, 2]),
             ch_inst='은우네 집에서 우체국까지는 [1 5/8] km, 우체국에서 미술관까지는 [1 3/8] km, 은우네 집에서 미술관까지 바로 가면 [2 6/8] km예요.',
             map=(['은우네 집', '우체국', '미술관'], ['[1 5/8] km', '[1 3/8] km', '[2 6/8] km']),
             ch=[{'q': '은우네 집에서 우체국을 거쳐 미술관까지 가는 거리는 몇 km일까요?', 'e': '[1 5/8]+[1 3/8]', 'a': '3', 'unit': 'km'},
                 {'q': '우체국을 거쳐 가는 거리는 바로 가는 거리보다 몇 km 더 멀까요?', 'e': '3−[2 6/8]', 'a': '2/8', 'unit': 'km'}]),
}

# ================================================================ 이야기 버전 자료
ST_P = {
    2: dict(title='과일 펀치를 만들어요 ― 진분수의 덧셈', question='분모가 같은 진분수끼리는 어떻게 더할까요?',
            scene='서아와 준서가 과일 펀치를 만들어요. 서아는 포도 주스 [2/5] L, 준서는 사과 주스 [1/5] L를 부었어요.',
            n=[('만져 보기', '주스 색칠하기'), ('그려 보기', '수직선에서 더하기'), ('말해 보기', '지호의 계산'),
               ('약속하기', '진분수의 덧셈 방법'), ('확인하기', '펀치 재료 더하기')],
            bars_inst='1 L를 똑같이 5칸으로 나눈 그림에 포도 주스 [2/5] L와 사과 주스 [1/5] L를 색칠해 보세요.', d1=5,
            bars=[('포도 주스', 2), ('사과 주스', 1)],
            bars_rows=['포도 주스 [{2}/{5}] L · 사과 주스 [{1}/{5}] L', '[2/5]는 [1/5]이 {2}개, [2/5]+[1/5]은 [1/5]이 {3}개예요.',
                       '펀치에 넣은 주스  [2/5]+[1/5] = [{3}/{5}] L'],
            rule=('분모가 같은 두 분수를 더하면 분모와 분자는 어떻게 될까요?', '‘내 규칙: 분모는 ~하고, 분자는 ~해요.’ 꼴로 써요.',
                  '분모는 그대로 6이고, 분자끼리 더해요.'),
            line_inst='도윤이는 레몬 시럽 [4/6] 컵에 탄산수 [5/6] 컵을 더 부었어요. [4/6]+[5/6]를 수직선에 화살표로 나타내어 계산해 보세요. 작은 눈금 한 칸은 [1/6]이에요.',
            line=(6, 2),
            line_rows=['[4/6]는 [1/6]이 {4}개, [5/6]는 [1/6]이 {5}개 → 합은 [1/6]이 {9}개',
                       '[4/6]+[5/6] = [{4}+{5}/6] = [{9}/6] = [{1} {3}/6]'],
            wrong='지호는 [4/6]+[5/6] = [9/12]라고 계산했어요. 무엇이 잘못되었는지 알맞은 말을 골라 보세요.',
            wrong_blanks=['지호는 ', (['분모끼리도 더했어요', '분자끼리 뺐어요'], 0), '. [4/6]와 [5/6]는 모두 ', (['[1/6]', '[1/12]'], 0),
                          '이 몇 개인 수이므로, 더해도 단위분수의 크기는 바뀌지 않아요. 그래서 분모는 ', (['그대로 6', '12'], 0),
                          '이고, 분자끼리 더하면 [1/6]이 ', (['9개', '20개'], 0), '예요.'],
            why3=('[9/12]가 틀린 답인 까닭을 크기로 말해 봐요.', '‘[9/12]는 1보다 ~지만, [4/6]+[5/6]는 1보다 ~야 해요.’ 꼴로 써요.',
                  '[9/12]는 분자가 분모보다 작아서 1보다 작아요. 그런데 [4/6]+[5/6]는 [1/6]이 9개라서 [6/6]인 1보다 커야 하니 [9/12]는 틀린 답이에요.'),
            calc=[{'e': '[2/9]+[5/9]', 'a': '7/9'}, {'e': '[3/8]+[5/8]', 'a': '1'}, {'e': '[5/7]+[4/7]', 'a': '1 2/7'},
                  {'q': '하은이는 펀치에 오렌지 주스를 [8/10] L, 탄산수를 [5/10] L 넣었어요. 하은이가 넣은 것은 모두 몇 L일까요?',
                   'e': '[8/10]+[5/10]', 'a': '1 3/10', 'unit': 'L'}],
            ch_sub='★ 펀치 문제',
            ch=[{'q': '펀치를 만들고 남은 포도 주스 [4/7] L와 사과 주스 [6/7] L를 한 병에 모으면 모두 몇 L일까요?',
                 'e': '[4/7]+[6/7]', 'a': '1 3/7', 'unit': 'L'}],
            ch_box=[1, 2, 3], ch_box_den=9, ch_box_expr=('5', 9)),
    3: dict(title='쿠키 반죽을 모아요 ― 대분수의 덧셈', question='분모가 같은 대분수끼리는 어떻게 더할까요?',
            scene='쿠키 모둠이 초코 반죽 [2 1/5] kg과 버터 반죽 [1 3/5] kg을 만들었어요.',
            n=[('만져 보기', '반죽 색칠하고 모으기'), ('그려 보기', '분수 부분이 1을 넘으면'), ('말해 보기', '가분수로 더하기'),
               ('약속하기', '대분수의 덧셈 방법'), ('확인하기', '반죽 더하기')],
            fill1_inst='1 kg을 5칸으로 나눈 막대에 두 반죽의 양을 색칠하고, 자연수 부분끼리, 분수 부분끼리 모아 보세요.',
            fill1=[('초코 반죽', '2 1/5'), ('버터 반죽', '1 3/5')], d1=5,
            est1=('[2 1/5]+[1 3/5]은 몇 kg쯤일까요?', ['2 kg쯤', '3 kg쯤', '5 kg쯤'], 1),
            calc1={'e': '[2 1/5]+[1 3/5]', 'a': '3 4/5', 'unit': 'kg'},
            rule=('분수 부분끼리 더한 것이 1보다 크면 어떻게 하면 좋을까요?', '‘내 규칙: 분수 부분의 합에서 1만큼을 ~에 더해요.’ 꼴로 써요.',
                  '분수 부분의 합 [9/6]를 [1 3/6]으로 바꾸고, 그 1을 자연수 부분에 더해요.'),
            fill2_inst='하은이네 모둠은 반죽 [2 4/6] kg, 도윤이네 모둠은 [1 5/6] kg을 만들었어요. 그림에 색칠하고 모은 다음, 자연수 부분끼리, 분수 부분끼리 더해 보세요.',
            fill2=[('하은 모둠', '2 4/6'), ('도윤 모둠', '1 5/6')], d2=6,
            m1_rows=[('방법 1', '[2 4/6]+[1 5/6] = ({2}+{1})+([4/6]+[5/6])'), ' = {3}+[{9}/6] = 3+[{1} {3}/6] = [{4} {3}/6]'],
            m2_row=('방법 2', '[2 4/6]+[1 5/6] = [{16}/6]+[{11}/6] = [{27}/6] = [{4} {3}/6]'),
            why3=('나는 어느 방법이 더 편리한가요? 까닭과 함께 써 봐요.', '‘나는 방법 ~이 더 편리해요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요.',
                  '예) 나는 방법 1이 더 편리해요. 자연수 부분은 그대로 더하고 작은 분수만 더하면 되기 때문이에요.'),
            calc=[{'e': '[1 2/8]+[3 5/8]', 'a': '4 7/8'}, {'e': '[3 4/9]+[2 7/9]', 'a': '6 2/9'}, {'e': '[2 3/5]+[9/5]', 'a': '4 2/5'}],
            cards=([1, 4, 6, 7], 8),
            cards_inst='쿠키 상자에 붙일 수 카드 1, 4, 6, 7 중에서 2장을 골라 분모가 8인 대분수를 만들려고 해요. 가장 큰 대분수와 가장 작은 대분수를 만들고, 두 수의 합을 구해 보세요.'),
    4: dict(title='리본으로 선물 상자를 꾸며요 ― 진분수의 뺄셈', question='분모가 같은 진분수끼리는 어떻게 뺄까요?',
            scene='파티 선물 상자를 꾸며요. 리본 1 m를 똑같이 8칸으로 나눈 것 중 빨간 리본은 6칸, 노란 리본은 3칸을 썼어요.',
            n=[('만져 보기', '리본 색칠하기'), ('그려 보기', '수직선에서 빼기'), ('말해 보기', '단위분수로 설명하기'),
               ('약속하기', '진분수의 뺄셈 방법'), ('확인하기', '리본 계산하기')],
            bars_inst='쓴 리본을 각각 색칠해 보세요.', d1=8, bars=[('빨간 리본', 6), ('노란 리본', 3)],
            bars_rows=['빨간 리본 [{6}/{8}] m · 노란 리본 [{3}/{8}] m', '[6/8]과 [3/8]은 [1/8]이 각각 {6}개, {3}개예요.',
                       '[6/8]−[3/8]은 [1/8]이 {3}개 → 빨간 리본을 [{3}/{8}] m 더 썼어요.'],
            line_inst='서아는 리본 [7/9] m 중에서 [4/9] m를 잘라 꽃 모양을 만들었어요. [7/9]−[4/9]를 수직선에 화살표로 나타내어 계산해 보세요. 작은 눈금 한 칸은 [1/9]이에요.',
            line=(9, 1),
            line_rows=['[7/9]과 [4/9]는 [1/9]이 각각 {7}개, {4}개 → 차는 [1/9]이 {3}개', '[7/9]−[4/9] = [{7}−{4}/9] = [{3}/9]'],
            say=['[7/9]은 [1/9]이 7개, [4/9]는 [1/9]이 4개예요. [7/9]−[4/9]는 [1/9]이 ', (['3개', '11개', '1개'], 0), '이므로 ',
                 (['[3/9]', '[3/0]', '[11/9]'], 0), '이에요. 빼도 단위분수 [1/9]의 크기는 ', (['그대로예요', '작아져요'], 0), '.'],
            why3=('도윤이는 [7/9]−[4/9] = [3/0]이라고 했어요. 무엇이 잘못되었는지 써 봐요.',
                  '‘~끼리도 빼서 틀렸어요. 분모는 ~이고 답은 ~예요.’ 꼴로 써요.',
                  '도윤이는 분모끼리도 빼서 틀렸어요. 빼도 단위분수 [1/9]의 크기는 그대로라서 분모는 9이고, 답은 [3/9]이에요.'),
            calc=[{'e': '[5/6]−[1/6]', 'a': '4/6'}, {'e': '[9/10]−[6/10]', 'a': '3/10'}, {'e': '[4/7]−[2/7]', 'a': '2/7'},
                  {'q': '지호는 노란 리본 [11/12] m 중에서 [5/12] m를 썼어요. 남은 노란 리본은 몇 m일까요?', 'e': '[11/12]−[5/12]',
                   'a': '6/12', 'unit': 'm'}],
            ch_inst='[5/8]−[2/8]에 알맞은 리본 문제를 완성하고 해결해 보세요. 문제의 앞부분은 “하은이에게 리본이 [5/8] m 있습니다.”예요.',
            ch=[('하은이에게 리본이 [5/8] m 있습니다. 뒤에 이어질 알맞은 문장은?',
                 ['그중에서 [2/8] m를 상자에 묶었습니다. 남은 리본은 몇 m인가요?', '준서가 [2/8] m를 더 주었습니다. 리본은 모두 몇 m인가요?',
                  '상자 2개에 리본을 [5/8] m씩 묶었습니다. 쓴 리본은 모두 몇 m인가요?'], 0),
                ('완성한 문제의 답은?', ['[3/8] m', '[7/8] m', '[3/0] m'], 0)],
            ch_write=('이번에는 [5/8]−[2/8]에 알맞은 리본 문제를 내가 직접 만들어 써 봐요.',
                      '서아는 리본이 [5/8] m 있었는데 꽃 모양을 만드는 데 [2/8] m를 썼어요. 남은 리본은 몇 m일까요? (답: [3/8] m)')),
    5: dict(title='밀가루와 설탕을 덜어요 ― 대분수의 뺄셈(1)', question='분수 부분끼리 뺄 수 있는 대분수의 뺄셈은 어떻게 할까요?',
            scene='팬케이크 모둠은 밀가루 [3 4/5] 컵 중에서 [1 2/5] 컵을 덜어 반죽을 만들었어요.',
            n=[('만져 보기', '덜어 낸 만큼 ×표'), ('그려 보기', '나누어 빼기'), ('말해 보기', '가분수로 빼기'),
               ('약속하기', '대분수의 뺄셈 방법'), ('확인하기', '재료 덜기')],
            take_inst='밀가루 그림(1컵이 5칸)에서 덜어 낸 [1 2/5] 컵만큼 ×표 해 보세요.', take_name='밀가루 [3 4/5] 컵',
            take=('3 4/5', '1 2/5', 5),
            est1=('[3 4/5]−[1 2/5]는 몇 컵쯤일까요?', ['1컵쯤', '2컵쯤', '4컵쯤'], 1),
            calc1={'e': '[3 4/5]−[1 2/5]', 'a': '2 2/5', 'unit': '컵'},
            m1_inst='설탕 [4 5/7] 큰술 중에서 [2 3/7] 큰술을 반죽에 넣었어요. [4 5/7]−[2 3/7]을 자연수 부분끼리, 분수 부분끼리 빼서 계산해 보세요.',
            m1_rows=[('방법 1', '[4 5/7]−[2 3/7] = ({4}−{2})+([5/7]−[3/7])'), ' = {2}+[{2}/7] = [{2} {2}/7]'],
            m2_row=('방법 2', '[4 5/7]−[2 3/7] = [{33}/7]−[{17}/7] = [{16}/7] = [{2} {2}/7]'),
            why3=('두 방법으로 계산한 답이 같은 까닭은 무엇일까요?', '‘두 방법 모두 ~의 차를 구했고, 대분수와 가분수는 ~이기 때문이에요.’ 꼴로 써요.',
                  '두 방법 모두 [4 5/7]와 [2 3/7]의 차를 구했고, 대분수와 가분수는 꼴만 다르고 크기가 같기 때문이에요.'),
            calc=[{'e': '[6 7/9]−[2 3/9]', 'a': '4 4/9'}, {'e': '[5 5/8]−[3 1/8]', 'a': '2 4/8'}, {'e': '[4 6/10]−[23/10]', 'a': '2 3/10'}],
            ch_sub='★ 팬케이크 모둠의 문제',
            pick=('차가 [2 3/8]인 것을 골라 기호를 써 보세요.', ['[4 7/8]−[1 4/8]', '[30/8]−[1 5/8]', '[5 6/8]−[3 3/8]'], 2),
            ch_calc={'q': '우유가 [17/6] L 있어요. 팬케이크 반죽에 [1 2/6] L를 넣으면 남는 우유는 몇 L일까요?',
                     'e': '[17/6]−[1 2/6]', 'a': '1 3/6', 'unit': 'L'}),
    6: dict(title='감자전을 나누어 먹어요 ― 자연수와 분수의 뺄셈', question='(자연수)−(분수)는 어떻게 계산할까요?',
            scene='우리 반이 부친 감자전 1판 중에서 [4/6]판을 먹었어요.',
            n=[('만져 보기', '감자전 자르기'), ('그려 보기', '1만큼을 분수로'), ('말해 보기', '가분수로 빼기'),
               ('약속하기', '(자연수)−(분수)'), ('확인하기', '남은 양 구하기')],
            rule=('1에서 분수를 빼려면 1을 어떻게 바꾸면 좋을까요?', '‘내 규칙: 1을 분모와 ~가 같은 분수로 바꾸어 빼요.’ 꼴로 써요.',
                  '1을 분모와 분자가 같은 분수로 바꾸어요. 1 = [6/6]'),
            pie_inst='감자전을 6조각으로 자른 그림이에요. 먹은 만큼 ×표 해 보세요.', pie=6, pie_label='감자전 1판',
            pie_rows=['1은 [6/6]이므로 [1/6]이 {6}개, [4/6]는 [1/6]이 {4}개예요.', '1−[4/6]는 [1/6]이 {2}개 → 남은 감자전은 [{2}/{6}]판이에요.'],
            take_inst='감자전 반죽을 만들려고 밀가루 4컵 중에서 [2 2/5] 컵을 썼어요. 1컵을 [5/5]로 쪼갠 막대에 [2 2/5] 컵만큼 ×표 한 다음, 빈칸을 채워 보세요.',
            take_name='밀가루 4컵', take=('4', 5),
            m1_rows=[('방법 1', '4−[2 2/5] = [{3} {5}/5]−[2 2/5]'), ' = ({3}−{2})+([{5}/5]−[2/5]) = {1}+[{3}/5] = [{1} {3}/5]'],
            why2=('4를 [3 5/5]로 바꾸어 계산하는 까닭은 무엇일까요?', '‘4에는 ~이 없어서 1만큼을 [5/5]로 바꾸면 ~끼리 뺄 수 있어요.’ 꼴로 써요.',
                  '4에는 분수 부분이 없어서 [2/5]를 바로 뺄 수 없어요. 1만큼을 [5/5]로 바꾸어 [3 5/5]로 나타내면 분수 부분끼리 뺄 수 있어요.'),
            m2_row=('방법 2', '4−[2 2/5] = [{20}/5]−[{12}/5] = [{8}/5] = [{1} {3}/5]'),
            ex4=['3은 ', (['[2 6/6]', '[3 6/6]'], 0), '으로 나타낼 수 있어요.'],
            hint5='1 = [7/7], 6 = [5 8/8], 3 = [2 9/9]로 바꾸어 봐요.',
            calc=[{'e': '1−[3/7]', 'a': '4/7'}, {'e': '6−[5/8]', 'a': '5 3/8'}, {'e': '3−[1 4/9]', 'a': '1 5/9'}],
            ch_sub='★ 파티 준비 문제',
            ch_calc={'q': '리본 5 m가 있어요. 하은이가 [1 3/4] m, 준서가 [2/4] m를 썼어요. 남은 리본은 몇 m일까요?',
                     'e': '5−[1 3/4]−[2/4]', 'a': '2 3/4', 'unit': 'm'},
            pick=(['4−[17/6]', '3−[1 4/6]'], 1)),
    7: dict(title='피자 반죽을 떼어 내요 ― 대분수의 뺄셈(2)', question='분수 부분끼리 뺄 수 없는 대분수의 뺄셈은 어떻게 할까요?',
            scene='피자 모둠은 반죽 [3 2/5] kg 중에서 [1 4/5] kg을 떼어 첫 번째 피자를 만들었어요.',
            n=[('만져 보기', '반죽을 떼어 내요'), ('그려 보기', '1만큼을 분수로'), ('말해 보기', '가분수로 빼기'),
               ('약속하기', '지호의 계산 고치기'), ('확인하기', '반죽과 치즈 계산')],
            rule=('분수 부분끼리 뺄 수 없을 때는 어떻게 하면 좋을까요?', '‘내 규칙: 자연수에서 1만큼을 ~로 바꾸어 분수 부분에 더한 뒤 빼요.’ 꼴로 써요.',
                  '자연수에서 1만큼을 [5/5]로 바꾸어 분수 부분에 더한 뒤 빼요.'),
            take_inst='반죽 그림(1 kg이 5칸)에서 떼어 낸 [1 4/5] kg만큼 ×표 해 보세요. [2/5]에서는 [4/5]만큼 ×표 할 수 없으면 어떻게 할까요?',
            take_name='반죽 [3 2/5] kg', take=('3 2/5', '1 4/5', 5),
            est1=('[3 2/5]−[1 4/5]는 몇 kg쯤일까요?', ['1 kg쯤', '2 kg쯤', '3 kg쯤'], 1),
            calc1={'e': '[3 2/5]−[1 4/5]', 'a': '1 3/5', 'unit': 'kg'},
            line_inst='치즈 [5 1/4] 컵 중에서 [2 3/4] 컵을 피자에 뿌렸어요. [5 1/4]−[2 3/4]을 수직선에 나타낸 다음, 자연수에서 1만큼을 분수로 바꾸어 계산해 보세요.',
            line=(4, 6),
            m1_rows=[('방법 1', '[5 1/4]−[2 3/4] = [{4} {5}/4]−[2 3/4]'), ' = ({4}−{2})+([{5}/4]−[3/4]) = {2}+[{2}/4] = [{2} {2}/4]'],
            m2_row=('방법 2', '[5 1/4]−[2 3/4] = [{21}/4]−[{11}/4] = [{10}/4] = [{2} {2}/4]'),
            fix_inst='지호는 [3 2/6]−[1 5/6]를 (3−1)+([5/6]−[2/6]) = [2 3/6]이라고 계산했어요. 덧셈으로 확인하며 알맞은 말을 골라 보세요.',
            fix=['[2 3/6]에 [1 5/6]를 더하면 [4 2/6]가 돼요. 그래서 지호의 답 [2 3/6]은 ', (['틀렸어요', '맞았어요'], 0),
                 '. [2/6]에서 [5/6]를 뺄 수 없으니 [3 2/6]를 ', (['[2 8/6]', '[3 8/6]'], 0), '로 바꾸어 빼요. 그러면 [2 8/6]−[1 5/6] = ',
                 (['[1 3/6]', '[2 3/6]'], 0), '이에요.'],
            why4=('뺄셈의 답이 맞는지 덧셈으로 확인하는 방법을 써 봐요.', '‘답에 빼는 수를 더해서 ~가 나오면 맞는 답이에요.’ 꼴로 써요.',
                  '구한 답에 빼는 수를 더해서 처음 수가 나오면 맞는 답이에요. [1 3/6]+[1 5/6] = [3 2/6]'),
            calc=[{'e': '[4 3/8]−[1 6/8]', 'a': '2 5/8'}, {'e': '[6 2/9]−[3 7/9]', 'a': '2 4/9'}, {'e': '[3 1/5]−[8/5]', 'a': '1 3/5'}],
            ch_sub='★ 피자 모둠의 문제', ch_box=('[5 3/7]−[13/7]', 3, 7, [1, 2, 3, 4, 5]), ch_cmp=('[4 1/8]−[1 5/8]', '[3 2/8]−[6/8]')),
    8: dict(title='생각을 더하다 ― 파티 음료를 준비해요', question='가지고 있는 재료로 음료를 만들고 남은 재료의 양은 어떻게 구할까요?',
            scene='나눔 파티 날, 음료 모둠이 친구들에게 주문을 받아 음료를 만들어요.',
            n=[('만져 보기', '문제 이해하기'), ('그려 보기', '계획 세우기'), ('말해 보기', '표 만들기'), ('약속하기', '남은 양 구하기'),
               ('확인하기', '되돌아보기')],
            R=dict(d1='딸기 라테', d2='초코 우유', base='우유', bu='컵', s1='딸기청', s2='초코 시럽', v1='1 3/4', v2='2 2/5',
                   have=(8, 6, 10), orders=[('① 딸기 라테 2잔', 2, 0), ('② 딸기 라테 1잔, 초코 우유 1잔', 1, 1), ('③ 초코 우유 2잔', 0, 2)]),
            quiz=[('음료 모둠이 구하려는 것은 무엇인가요?', ['주문서 ①~③의 음료를 만들고 남은 재료의 양', '음료 한 잔의 값', '만들 수 있는 음료의 수'], 0),
                  ('초코 우유 1잔에 필요한 초코 시럽은?', ['[1 3/4] 큰술', '[2 2/5] 큰술', '10 큰술'], 1),
                  ('가지고 있는 딸기청은?', ['6 큰술', '8 큰술', '10 큰술'], 0)],
            plan=['쓰는 재료의 양은 주문서별로 쓰는 재료의 양을 ', (['더해요', '빼요'], 0), '. 남은 재료의 양은 가지고 있는 재료에서 쓴 재료의 양을 ',
                  (['빼요', '더해요'], 0), '. 주문서별로 쓰는 양을 ', (['표로', '그림 한 장으로'], 0), ' 정리하면 보기 쉬워요.'],
            left=['2', '3/4', '2 4/5 (=14/5)'],
            write=[('남은 재료의 양을 어떻게 구했는지 설명해 보세요.', '‘주문서별로 ~을 표로 정리해 더하고, 가지고 있는 양에서 ~을 빼서 구했어요.’ 꼴로 써요.',
                    '주문서별로 쓴 재료의 양을 표로 정리해 재료마다 더하고, 가지고 있는 양에서 쓴 양을 빼서 남은 양을 구했어요.'),
                   ('딸기청을 다른 방법으로도 구할 수 있을까요?', '‘딸기 라테가 모두 ~잔이니까 [1 3/4]을 ~번 더해서 구할 수도 있어요.’ 꼴로 써요.',
                    '딸기 라테가 모두 3잔이니까 [1 3/4]을 3번 더해서 [5 1/4] 큰술로 구할 수도 있어요.')],
            ch_inst='★ 남은 재료로 주문서 ④ 딸기 라테 2잔을 더 만들려고 해요. 더 필요한 재료의 양을 구해 보세요.',
            ch_pick=('모자라는 재료는 무엇인가요?', ['우유', '딸기청', '초코 시럽'], 1),
            ch_calc={'q': '더 필요한 딸기청은 몇 큰술일까요?', 'e': '[3 2/4]−[3/4]', 'a': '2 3/4', 'unit': '큰술'}),
    9: dict(title='파티 놀이 ― 말을 튕겨 분수를 더하고 빼요', question='말을 튕기는 놀이를 하며 분수를 더하거나 빼 볼까요?',
            scene='파티 놀이 시간이에요! 분모가 같은 분수 말 6개를 주머니에 넣고, 차례대로 하나씩 꺼내 책상 위에서 튕겨요. 내 말이 도착선에 더 가까우면 더하고, '
                  '더 멀거나 책상 아래로 떨어지면 빼요. 세 번 계산한 뒤 마지막 값이 더 큰 사람이 이겨요. (말의 분수와 처음 수는 앱에서 정한 것이에요.)',
            n=[('만져 보기', '놀이 방법 알아보기'), ('그려 보기', '준서의 놀이 기록'), ('말해 보기', '놀이하기 ① 분모 8'),
               ('약속하기', '놀이하기 ② 분모 6 · 4'), ('확인하기', '또 다른 놀이')],
            prac_inst='준서가 분모가 8인 주머니로 놀이한 기록이에요. 처음 수는 4예요. 차례대로 계산해 보세요.',
            prac=[{'e': '1회 (떨어져서 빼요)  4−[3/8]', 'x': '4−[3/8]', 'a': '3 5/8'},
                  {'e': '2회 (더 가까워서 더해요)  [3 5/8]+[6/8]', 'x': '[3 5/8]+[6/8]', 'a': '4 3/8'},
                  {'e': '3회 (더 멀어서 빼요)  [4 3/8]−[7/8]', 'x': '[4 3/8]−[7/8]', 'a': '3 4/8'}],
            other_inst='이긴 사람이 승리 조건을 고르고, 각자 분수 말을 2개씩 골라 동시에 뒤집어요. 나는 [4/6], [1 3/6]을, 서아는 [8/6], [2/6]를 뒤집었어요. 누가 이길까요?',
            other=(['4/6', '1 3/6'], ['8/6', '2/6']), who=('나', '서아'), who_ans=['나', '서아', '나'],
            why5=('‘두 분수를 더하여 더 큰 수’ 조건이면 어떤 말 2개를 고르면 좋을까요?', '‘가장 ~ 분수 말 2개를 고르면 좋아요. 왜냐하면 ~ 때문이에요.’ 꼴로 써요.',
                  '가장 큰 분수 말 2개를 고르면 좋아요. 큰 수끼리 더해야 합이 가장 커지기 때문이에요.'),
            ch_inst='★ 말의 뒷면에 분모가 4인 분수를 적어 놀이했어요. 처음 수 6에서 [5/4]를 빼고, [2 1/4]을 더하고, [7/4]을 뺐어요. 마지막 값은 얼마일까요?',
            ch_calc={'e': '6−[5/4]+[2 1/4]−[7/4]', 'a': '5 1/4', 'den': 4}),
    10: dict(title='우리 반 요리 발표회 ― 공부한 내용을 확인해요', question='분수의 덧셈과 뺄셈을 배우기 전과 후, 내 생각은 어떻게 달라졌나요?',
             scene='우리 반 요리 발표회 날이에요. 그동안 요리 교실에서 배운 분수의 덧셈과 뺄셈을 확인해요.',
             n=[('만져 보기', '그림 보고 계산하기'), ('그려 보기', '계산하기'), ('말해 보기', '이어 보기'), ('약속하기', '비교하고 고치기'),
                ('확인하기', '사다리 타기'), ('되돌아보기', '예전 생각, 지금 생각')],
             bars_inst='주스 [2/7] L와 [3/7] L만큼 색칠하고, 그림을 보고 빈칸에 알맞은 수를 써 보세요.', d1=7, bars=[('[2/7]', 2), ('[3/7]', 3)],
             bars_row='[2/7]+[3/7] = [{2}+{3}/7] = [{5}/7]',
             calc=[{'e': '[2 4/7]+[3 2/7]', 'a': '5 6/7'}, {'e': '[3 5/6]+[1 4/6]', 'a': '5 3/6'}, {'e': '[9/10]−[4/10]', 'a': '5/10'},
                   {'e': '1−[5/9]', 'a': '4/9'}],
             match=(['[2 3/9]+[13/9]', '[4 2/9]−[1 5/9]'], ['5−[11/9]', '[5 8/9]−[2 3/9]', '[11/9]+[13/9]']),
             cmp=('[1 7/10]+[19/10]', '[6 3/10]−[25/10]'),
             wrong='도윤이가 잘못 계산한 곳을 찾아 까닭을 고르고 옳게 계산해 보세요.', wrong_eq='[6 2/5]−[2 4/5] = 4+[2/5] = [4 2/5]',
             fix_row='[6 2/5]−[2 4/5] = [{5} {7}/5]−[2 4/5] = {3}+[{3}/5] = [{3} {3}/5]',
             ladder=(['[3/10]+[4/10]', '[5 2/7]−[2 6/7]', '[2 5/8]+[1 6/8]', '1−[5/12]'], [2, 0, 3, 1]),
             panes=[('예전 생각', '예전에는 ~라고 생각했어요', '예전에는 분수끼리 더할 때 분모도 더해야 한다고 생각했어요.'),
                    ('지금 생각', '지금은 ~라고 생각해요', '지금은 분모는 그대로 두고 분자끼리 계산하면 된다고 생각해요.'),
                    ('왜 바뀌었나', '~을 해 보고 바뀌었어요', '과일 펀치를 수직선에 나타내 [1/6]이 몇 칸인지 세어 보고 바뀌었어요.')],
             ch_inst='★★ 파티 재료를 사러 가는 길이에요. 학교에서 마트까지는 [1 2/6] km, 마트에서 공원까지는 [1 4/6] km, 학교에서 공원까지 바로 가면 [2 5/6] km예요.',
             map=(['학교', '마트', '공원'], ['[1 2/6] km', '[1 4/6] km', '[2 5/6] km']),
             ch=[{'q': '학교에서 마트를 거쳐 공원까지 가는 거리는 몇 km일까요?', 'e': '[1 2/6]+[1 4/6]', 'a': '3', 'unit': 'km'},
                 {'q': '마트를 거쳐 가는 거리는 바로 가는 거리보다 몇 km 더 멀까요?', 'e': '3−[2 5/6]', 'a': '1/6', 'unit': 'km'}]),
}

LESSON_FN = {2: L_add_proper, 3: L_add_mixed, 4: L_sub_proper, 5: L_sub_mixed1, 6: L_sub_whole, 7: L_sub_mixed2,
             8: L_drink, 9: L_game, 10: L_review}


def challenge_box(s, P):
    """2차시 도전: □ 안에 들어갈 수 있는 자연수의 개수"""
    a, d = P['ch_box_expr']
    ok = [k for k in range(1, d) if Fraction(int(a) + k, d) < 1]
    assert ok == P['ch_box'], ok
    eq_fig(s, ['[%s/%d]+[□/%d] < 1' % (a, d, d)], indent=30)
    s.ask('□ 안에 들어갈 수 있는 자연수는 모두 몇 개일까요?   (        )개', blank=False)


def run(funcs_first, PP, s, lv):
    lines = [funcs_first(s, lv)]
    for no in range(2, 11):
        P = PP[no]
        if no == 2 and lv == '도전형':
            # 2차시 도전에는 □ 문제가 앱에 함께 있어요(교과서: 2번째, 이야기: 1번째) — calc 다음에 넣음
            orig = P['ch']
            P = dict(P)
            P['ch'] = orig
            ans = L_add_proper_with_box(s, lv, P)
        else:
            ans = LESSON_FN[no](s, lv, P)
        lines.append(ans)
    return lines


def L_add_proper_with_box(s, lv, P):
    """2차시 도전형: 앱의 □ 문제를 도전하기에 넣음"""
    P2 = dict(P)
    hook = {}

    real_calc = globals()['calc']

    def calc_with_box(s_, items, cols=2):
        out = real_calc(s_, items, cols)
        if items is P2['ch']:
            challenge_box(s_, P2)
            hook['done'] = True
        return out
    globals()['calc'] = calc_with_box
    try:
        ans = L_add_proper(s, lv, P2)
    finally:
        globals()['calc'] = real_calc
    assert hook.get('done')
    return ans


def build(first, PP, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='4학년')
    lines = run(first, PP, s, lv)
    s.answers('【교사용】 1. 분수의 덧셈과 뺄셈(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u1-fracadd.html과 차시 번호가 같습니다. 정답의 ‘2 1/4’은 대분수 2와 4분의 1, ‘9/4’는 가분수 4분의 9를 뜻해요. '
                   '합이나 차는 가분수로 써도, 대분수로 써도 맞아요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build(tb1, TB_P, '4-2 수학 1. 분수의 덧셈과 뺄셈(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build(st1, ST_P, '4-2 수학 1. 분수의 덧셈과 뺄셈(이야기 버전)', '이야기 버전', OUT_ST, lv))
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
