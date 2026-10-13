# -*- coding: utf-8 -*-
"""5-2 수학 4. 소수의 곱셈 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u4-decmul.py

앱 원본 ../units/sem2/u4-decmul.tb.js('문화 예술 체험 센터', 11차시)와
u4-decmul.st.js('우리 반 과학 탐구 캠프', 11차시)의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 똑같이 맞춥니다.
계산은 모두 분수(Fraction)로 정확하게 합니다(소수는 Fraction(Decimal('1.4'))로 바꿈, float는 쓰지 않음).
글 속·빈칸의 모든 답은 이 스크립트가 다시 계산해 확인합니다(assert).

표기
  - 글 속 소수 뒤 조사는 읽는 말에 맞춥니다(0.6은 → '영 점 육' → 은, 1.2예요 → '일 점 이' → 예요).
  - 글 속 분수는 읽는 말('10분의 1배'), 계산 식 그림 속 분수는 위아래로 씁니다.
  - 세로셈은 자연수의 곱셈처럼 오른쪽 끝을 맞추고, 소수점은 그 숫자 칸의 오른쪽 아래에 찍습니다.
그림(막대·수 모형·수직선·이중 수직선·10×10 모눈·세로셈·놀이판)은 수에 맞게 SVG로 그려 임시 폴더에서 PNG로 바꿉니다.
"""
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from decimal import Decimal, getcontext
from fractions import Fraction
from itertools import permutations
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

getcontext().prec = 60
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '4단원_소수의곱셈_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧'
KO = '㉠㉡㉢㉣㉤'
WORK = tempfile.mkdtemp(prefix='u4dmul_')
INK = '#1D2A2A'
FILLS = ['#F6C08A', '#9CC6EC', '#A9D8A2', '#D7B5E6']
RED, BLUE, DARK = '#C8472E', '#2B7BD6', '#7A8C86'
PX_MM = 0.155

# ================================================================ 정확한 계산
def Q(s):
    """'1.4' · '14' · Fraction → Fraction (float 없이)"""
    if isinstance(s, Fraction):
        return s
    if isinstance(s, int):
        return Fraction(s)
    s = str(s).strip().replace(',', '')
    assert re.fullmatch(r'\d*\.?\d+|\d+\.', s), s
    return Fraction(Decimal(s))


def dec(x):
    """Fraction → 가장 짧은 소수 글(끝자리 0 생략). 나누어떨어지는 소수만."""
    x = Fraction(x)
    d = x.denominator
    while d % 2 == 0:
        d //= 2
    while d % 5 == 0:
        d //= 5
    assert d == 1, ('끝나는 소수가 아니에요', x)
    v = Decimal(x.numerator) / Decimal(x.denominator)
    t = format(v, 'f')
    if '.' in t:
        t = t.rstrip('0').rstrip('.')
    return t


def ev(e):
    """식 계산(Fraction): 수(소수), [n/d] 분수, + − - × ÷ ( ) — × ÷ 먼저"""
    src = str(e).replace('−', '-').replace(' ', '')
    toks = re.findall(r'\[[^\]]+\]|\d*\.?\d+|[-+×÷()]', src)
    assert ''.join(toks) == src, ('식을 읽을 수 없어요', e)
    pos = [0]

    def peek():
        return toks[pos[0]] if pos[0] < len(toks) else None

    def take():
        pos[0] += 1
        return toks[pos[0] - 1]

    def atom():
        t = take()
        if t == '(':
            v = expr()
            assert take() == ')', e
            return v
        if t.startswith('['):
            n, d = t[1:-1].rsplit('/', 1)
            return ev(n) / ev(d)
        return Q(t)

    def term():
        v = atom()
        while peek() in ('×', '÷'):
            op = take()
            w = atom()
            v = v * w if op == '×' else v / w
        return v

    def expr():
        v = term()
        while peek() in ('+', '-'):
            op = take()
            w = term()
            v = v + w if op == '+' else v - w
        return v
    v = expr()
    assert pos[0] == len(toks), ('식 끝을 못 읽었어요', e)
    return v


def X(e, ans=None):
    """식 e를 계산해 소수 글로. ans가 있으면 같은지 확인"""
    v = ev(e)
    if ans is not None:
        assert v == Q(ans), ('답 확인 필요', e, ans, dec(v))
    return dec(v)


def ndig(s):
    m = re.search(r'\.(\d+)', str(s))
    return len(m.group(1)) if m else 0


def nat(s):
    return str(int(str(s).replace('.', '')))


# ================================================================ 조사(읽는 말에 맞추기)
JO = [('이에요', '예요'), ('이라서', '라서'), ('이라', '라'), ('으로', '로'), ('은', '는'), ('이', '가'), ('을', '를'), ('과', '와')]
JO_RE = re.compile(r'(?<![\d.])(\d+(?:\.\d+)?)(이에요|예요|이라서|라서|이라|라|으로|로|은|는|이|가|을|를|과|와)(?![가-힣])')


def has_jong(num):
    """수의 읽는 말 끝 글자 받침: (받침 있음, ㄹ받침). 소수는 끝 숫자를 하나씩 읽고, 자연수 끝 0은 십·백·천(받침 있음)."""
    c = num[-1]
    return c in '013678', c in '178'


def jo(t):
    def rep(m):
        n, p = m.group(1), m.group(2)
        h, r = has_jong(n)
        for a, b in JO:
            if p in (a, b):
                if a == '으로':
                    return n + ('으로' if h and not r else '로')
                return n + (a if h else b)
        return m.group(0)
    return JO_RE.sub(rep, t)


FR_RE = re.compile(r'\[(?:(\d+) )?([^\[\]/ ]+)/([^\[\]]+)\]')
PART = r'(이에요|예요|으로|은|는|을|를|과|와|이|가|로)?(?![가-힣])'


def rd(t):
    """글 속 [1/10] → '10분의 1' (뒤 조사는 분자 읽는 말에 맞춤)"""
    def rep(m):
        w, n, d, pt = m.group(1), m.group(2), m.group(3), m.group(4) or ''
        r = ('%s %s분의 %s' % (w, d, n)) if w else '%s분의 %s' % (d, n)
        h, rr = has_jong(n)
        for a, b in JO:
            if pt in (a, b):
                pt = ('으로' if h and not rr else '로') if a == '으로' else (a if h else b)
        return r + pt
    return re.sub(FR_RE.pattern + PART, rep, t)


def K(t):
    """글: 분수 읽는 말 + 수 뒤 조사"""
    return jo(rd(t))


def flat(t):
    t = re.sub(r'\{([^}]*)\}', r'\1', str(t)).replace('▢', '')
    return re.sub(r'\[([^\]]+)/([^\]]+)\]', r'\1/\2', t)


# ================================================================ 그림 찍기(Chromium 한 번만) — 분수의 곱셈 활동지와 같은 방법
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
CHARSET = (''.join(chr(c) for c in range(32, 127)) + '−×÷○□▢①②③④⑤⑥⑦⑧㉠㉡㉢㉣㉤·…‘’“”→≥≤가★²')


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


def put_png(s, svg, w, h, max_mm=180):
    mm = min(max_mm, w * PX_MM)
    s.picture(SHOT.png(svg, min(2400, w * 2)), width_mm=mm)


# ---------------------------------------------------------------- 식(분수를 위아래로) 그리기
TOK = re.compile(r'\[[^\]]+\]|\{[^}]*\}|▢|[^\[\{▢]+')


def bw(a, fs):
    """빈칸 너비: 답 글자 수에 맞게(답을 알려 주지 않도록 넉넉히 반올림)"""
    n = len(a or '') if a is not None else 2
    n = max(2, n)
    return fs * (0.6 * n + 0.55)


def _part(t):
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
            segs.append(('f', None, _part(left), _part(den)))
        else:
            segs.append(('t', g.replace('-', '−')))
    return segs


def _pw(parts, fs):
    return sum(tw(v, fs) if k == 't' else bw(v, fs) + fs * .1 for k, v in parts)


def _pdraw(parts, x, cy, fs, out):
    for k, v in parts:
        if k == 't':
            out.append(T(x, cy, v, fs))
            x += tw(v, fs)
        else:
            w = bw(v, fs)
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="4" fill="#fff" stroke="#555" stroke-width="2"/>'
                       % (x + fs * .05, cy - fs * .52, w, fs * 1.04))
            x += w + fs * .1
    return x


def seg_w(sg, fs):
    if sg[0] == 't':
        return tw(sg[1], fs)
    if sg[0] == 'b':
        return bw(sg[1], fs) + fs * .2
    if sg[0] == 'A':
        return fs * 3.2
    _, w, n, d = sg
    sf = fs * .82
    return max(_pw(n, sf), _pw(d, sf)) + fs * .38


def seg_draw(sg, x, cy, fs, out):
    if sg[0] == 't':
        out.append(T(x, cy, sg[1], fs))
    elif sg[0] == 'b':
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="5" fill="#fff" stroke="#444" stroke-width="2.4"/>'
                   % (x + fs * .1, cy - fs * .58, bw(sg[1], fs), fs * 1.16))
    elif sg[0] == 'A':
        out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="8" fill="#fff" stroke="#333" stroke-width="2.6"/>'
                   % (x + fs * .12, cy - fs * .7, fs * 2.95, fs * 1.4))
    else:
        _, w, n, d = sg
        sf = fs * .82
        nw, dw = _pw(n, sf), _pw(d, sf)
        fw = max(nw, dw) + fs * .3
        out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.4"/>'
                   % (x + fs * .1, cy, x + fw, cy, INK))
        _pdraw(n, x + fs * .04 + (fw - nw) / 2, cy - fs * .66, sf, out)
        _pdraw(d, x + fs * .04 + (fw - dw) / 2, cy + fs * .68, sf, out)


def eq_line(s, x, cy, fs, out):
    for sg in parse_eq(s):
        wdt = seg_w(sg, fs)
        seg_draw(sg, x, cy, fs, out)
        x += wdt
    return x


def eq_w(s, fs):
    return sum(seg_w(sg, fs) for sg in parse_eq(s))


def tall(s):
    return '[' in s


EQW = 1120     # 한 줄 최대 너비(px, 34px 글자) ≈ 174mm


def wrap(e, fs=34, maxw=EQW):
    """괄호·빈칸 밖의 띄어쓰기에서 줄을 나눔"""
    if eq_w(e, fs) <= maxw:
        return [e]
    toks = re.findall(r'\[[^\]]*\]|\{[^}]*\}|[^\s\[\{]+|\s+', e)
    words, cur = [], ''
    for t in toks:
        if t.isspace():
            words.append(cur)
            cur = ''
        else:
            cur += t
    words.append(cur)
    lines, cur = [], ''
    for wd in words:
        if not wd:
            continue
        cand = (cur + ' ' + wd) if cur else wd
        if cur and eq_w(cand, fs) > maxw - (fs * 1.2 if lines else 0):
            lines.append(cur)
            cur = wd
        else:
            cur = cand
    lines.append(cur)
    return lines


def eq_fig(s, rows, fs=34, max_mm=180):
    """식 여러 줄(빈칸 {답}, 답 칸 ▢) 그림. 줄: 글 또는 (이름표, 글). 긴 줄은 나눔."""
    out, y, wmax = [], 10, 0
    for r in rows:
        tag, e = r if isinstance(r, tuple) else (None, r)
        x0 = 12
        if tag:
            tw_ = tw(tag, fs * .78) + fs * .7
            x0 += tw_ + fs * .35
        for k, ln in enumerate(wrap(e, fs, EQW - (x0 - 12))):
            h = fs * (2.75 if tall(ln) else 1.6)
            cy = y + h / 2
            x = x0 + (fs * 1.2 if k else 0)
            if tag and k == 0:
                out.append('<rect x="12" y="%.1f" width="%.1f" height="%.1f" rx="10" fill="#E8F1EE"/>' % (cy - fs * .6, tw_, fs * 1.2))
                out.append(T(12 + fs * .35, cy, tag, fs * .78, fill='#2E6B5A'))
            x = eq_line(ln, x, cy, fs, out)
            wmax = max(wmax, x + 12)
            y += h
    W, H = int(wmax + 4), int(y + 10)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def cards_fig(s, cards, fs=40):
    out, x = [], 12
    for c in cards:
        w = max(70, tw(c, fs) + 40)
        out.append('<rect x="%.1f" y="10" width="%.1f" height="96" rx="12" fill="#FFF8E6" stroke="%s" stroke-width="3"/>' % (x, w, INK))
        out.append(T(x + w / 2, 58, c, fs, anchor='middle'))
        x += w + 22
    put_png(s, svg_doc(int(x), 116, ''.join(out)), int(x), 116, max_mm=min(120, x * .16))


# ================================================================ 그림: 막대·수 모형·수직선·모눈·세로셈
def bars_fig(s, per, times, pre, bars=2, cell='0.1'):
    """한 칸이 cell인 10칸 막대 bars개. pre면 첫 묶음(per칸)을 색칠하고 묶음 표시."""
    cwd, x0, bh, gap = 72, 30, 60, 120
    out = []
    unit = Q(cell) * 10
    for b in range(bars):
        y = 40 + b * gap
        for k in range(10):
            i = b * 10 + k
            on = pre and i < per
            out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="%s" stroke-width="1.6"/>'
                       % (x0 + k * cwd, y, cwd, bh, FILLS[0] if on else '#fff', DARK))
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="%s" stroke-width="3"/>' % (x0, y, cwd * 10, bh, INK))
        out.append(T(x0, y + bh + 24, dec(unit * b), 24, anchor='middle', fill='#555'))
        out.append(T(x0 + cwd * 10, y + bh + 24, dec(unit * (b + 1)), 24, anchor='middle', fill='#555'))
    if pre:
        xa, xb, y = x0 + 4, x0 + per * cwd - 4, 40
        out.append('<path d="M%d %d Q%.1f %d %d %d" fill="none" stroke="%s" stroke-width="2.6"/>' % (xa, y - 4, (xa + xb) / 2, y - 26, xb, y - 4, RED))
        out.append(T((xa + xb) / 2, y - 30, '1번', 20, anchor='middle', fill=RED))
    W, H = x0 * 2 + cwd * 10, 40 + bars * gap
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=135)


def blocks_fig(s, unit, times, show, frame=None):
    """수 모형 묶음: 0.1 막대(세로 10칸)·0.01 조각. show개 묶음은 그리고, 나머지는 빈 점선 칸."""
    u = Q(unit)
    tens = int(u * 10) % 10
    hund = int(u * 100) % 10
    assert u == Fraction(tens, 10) + Fraction(hund, 100)
    sq = 16
    out, x = [], 20
    top = 40
    for g in range(times):
        gw = tens * (sq + 6) + (sq + 8 if hund else 0) + 18
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="10" fill="none" stroke="%s" stroke-width="2" stroke-dasharray="7 5"/>'
                   % (x, top - 10, gw, sq * 10 + 20, '#B85A22'))
        out.append(T(x + gw / 2, top - 24, '%d번째' % (g + 1), 18, anchor='middle', fill='#B85A22'))
        if g < show:
            xx = x + 9
            for r in range(tens):
                out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="%s" stroke-width="1"/>' % (xx, top, sq, sq * 10, FILLS[1], INK))
                for i in range(1, 10):
                    out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#5D6E68" stroke-width=".6"/>' % (xx, top + i * sq, xx + sq, top + i * sq))
                xx += sq + 6
            for i in range(hund):
                out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="%s" stroke-width="1"/>'
                           % (xx + 2, top + sq * 10 - (i + 1) * (sq + 3), sq, sq, FILLS[0], INK))
        x += gw + 16
    leg_y = top + sq * 10 + 40
    out.append('<rect x="20" y="%d" width="%d" height="%d" fill="%s" stroke="%s"/>' % (leg_y - 8, sq * 3, sq, FILLS[1], INK))
    out.append(T(20 + sq * 3 + 8, leg_y, '막대 = 0.1', 20))
    out.append('<rect x="200" y="%d" width="%d" height="%d" fill="%s" stroke="%s"/>' % (leg_y - 8, sq, sq, FILLS[0], INK))
    out.append(T(200 + sq + 8, leg_y, '조각 = 0.01', 20))
    if frame:
        fx, fy, fs_ = x + 20, top + 20, 110
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#FFF7EA" stroke="#B9C5C0" stroke-width="7"/>' % (fx, fy, fs_, fs_))
        out.append(T(fx + fs_ / 2, fy - 22, frame, 18, anchor='middle', fill=DARK))
        x = fx + fs_ + 30
    W, H = int(max(x, 380)), leg_y + 24
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(170, W * .17))


def jump_fig(s, to, minor, step_, pre_hops):
    """0~to 수직선(작은 눈금 minor). pre_hops번 뛰기를 그려 둠."""
    mi = Q(minor)
    N = int(Q(to) / mi)
    st = int(Q(step_) / mi)
    assert Q(step_) == st * mi
    x0, ln, y = 40, 1000, 150
    X = lambda i: x0 + i * ln / N
    per1 = int(1 / mi)
    out = ['<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3"/>' % (x0 - 10, y, x0 + ln + 20, y, INK)]
    for i in range(N + 1):
        maj = i % per1 == 0
        mid = (i * 2) % per1 == 0
        hgt = 16 if maj else 11 if mid else 7
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="%s"/>' % (X(i), y - hgt, X(i), y + hgt, INK, 2.6 if maj else 1.4))
        if maj:
            out.append(T(X(i), y + 40, dec(mi * i), 28, anchor='middle'))
    prev = 0
    for k in range(pre_hops):
        a, b = X(prev), X(prev + st)
        c = RED if k % 2 == 0 else BLUE
        out.append('<path d="M%.1f %d Q%.1f %d %.1f %d" fill="none" stroke="%s" stroke-width="3"/>' % (a, y - 6, (a + b) / 2, y - 100, b, y - 6, c))
        out.append('<path d="M%.1f %d l-10 -12 l13 0 z" fill="%s"/>' % (b, y - 6, c))
        out.append(T((a + b) / 2, y - 66, str(k + 1), 20, anchor='middle', fill=c))
        prev += st
    W, H = x0 + ln + 40, y + 64
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


def double_fig(s, top, unit, what, bot, step_, labels, target, pre, top_labels=()):
    """이중 수직선: 위 0~top(양), 아래 0~bot(배), 작은 눈금 step. pre면 target배에 점선과 표시."""
    sv = Q(step_)
    N = int(Q(bot) / sv)
    Tg = int(Q(target) / sv)
    assert Q(bot) == N * sv and Q(target) == Tg * sv
    x0, ln, yt, yb = 80, 860, 110, 230
    X = lambda i: x0 + i * ln / N
    out = [T(x0 - 50, yt - 58, what, 22, fill=DARK)]
    out.append('<rect x="%d" y="%d" width="%d" height="18" rx="6" fill="#E8EEEB" stroke="#B9C5C0"/>' % (x0, yt - 32, ln))
    for yy in (yt, yb):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.6"/>' % (x0 - 8, yy, x0 + ln + 10, yy, INK))
    for i in range(N + 1):
        for yy in (yt, yb):
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="%s"/>' % (X(i), yy - 10, X(i), yy + 10, INK, 2.4 if i in (0, N) else 1.4))
        bv = dec(sv * i)
        if i in (0, N) or bv in labels:
            out.append(T(X(i), yb + 40, bv, 24, anchor='middle'))
    out.append(T(X(0), yt + 30, '0', 24, anchor='middle'))
    out.append(T(X(N), yt + 30, '%s%s' % (top, (' ' + unit) if unit else ''), 24, anchor='middle'))
    for i, t in top_labels:
        out.append(T(X(i), yt + 30, t, 24, anchor='middle'))
    out.append(T(x0 + ln + 30, yb, '(배)', 20, fill=DARK))
    if unit:
        out.append(T(x0 + ln + 30, yt, '(%s)' % unit, 20, fill=DARK))
    if pre:
        out.append('<rect x="%d" y="%d" width="%.1f" height="18" rx="6" fill="%s"/>' % (x0, yt - 32, X(Tg) - x0, FILLS[0]))
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2.4" stroke-dasharray="7 5"/>' % (X(Tg), yt - 36, X(Tg), yb, RED))
        out.append('<path d="M%.1f %d l-13 22 h26 z" fill="%s"/>' % (X(Tg), yb + 2, BLUE))
        out.append(T(X(Tg), yt - 50, '?', 26, anchor='middle', fill=RED, weight='bold'))
    W, H = x0 + ln + 80, yb + 64
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


def area_fig(s, w, h, unit, pre, color=None):
    """한 변이 1인 정사각형을 10×10으로 나눈 모눈. pre면 가로 w칸·세로 h칸을 색칠하고 길이 표시."""
    S, x0, y0 = 400, 130, 70
    c = S / 10
    u = (' ' + unit) if unit else ''
    out = ['<rect x="%d" y="%d" width="%d" height="%d" fill="#fff"/>' % (x0, y0, S, S)]
    if pre:
        out.append('<rect x="%d" y="%d" width="%.1f" height="%.1f" fill="%s" opacity=".9"/>' % (x0, y0, w * c, h * c, color or FILLS[0]))
    for k in range(1, 10):
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#9AABA4" stroke-width="1.2"/>' % (x0 + k * c, y0, x0 + k * c, y0 + S))
        out.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#9AABA4" stroke-width="1.2"/>' % (x0, y0 + k * c, x0 + S, y0 + k * c))
    out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="%s" stroke-width="3"/>' % (x0, y0, S, S, INK))
    out.append(T(x0 + S / 2, y0 + S + 28, '← 가로 1%s →' % u, 22, anchor='middle', fill=DARK))
    out.append(T(x0 + S + 14, y0 + S / 2, '세로 1%s' % u, 22, fill=DARK))
    if pre:
        out.append('<path d="M%d %d H%.1f M%d %d v12 M%.1f %d v12" stroke="%s" stroke-width="2.6" fill="none"/>'
                   % (x0, y0 - 14, x0 + w * c, x0, y0 - 20, x0 + w * c, y0 - 20, RED))
        out.append(T(x0 + w * c / 2, y0 - 34, '%s%s' % (dec(Fraction(w, 10)), u), 22, anchor='middle', fill=RED))
        out.append('<path d="M%d %d V%.1f M%d %d h12 M%d %.1f h12" stroke="%s" stroke-width="2.6" fill="none"/>'
                   % (x0 - 14, y0, y0 + h * c, x0 - 20, y0, x0 - 20, y0 + h * c, BLUE))
        out.append(T(x0 - 26, y0 + h * c / 2, '%s%s' % (dec(Fraction(h, 10)), u), 22, anchor='end', fill=BLUE))
    W, H = x0 + S + 130, y0 + S + 50
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=95)


def _cells(sn):
    out = []
    for ch in sn:
        if ch == '.':
            out[-1][1] = True
        else:
            out.append([ch, False])
    return out


def vert_board(A, B, cap=None, c=52, fs=38):
    """세로셈 판 하나(SVG 조각, 너비, 높이, 답). 오른쪽 끝을 맞추고 소수점은 숫자 칸 오른쪽 아래."""
    na, nb = nat(A), nat(B)
    Nn = str(int(na) * int(nb))
    D = ndig(A) + ndig(B)
    val = ev('%s×%s' % (A, B))
    assert Q(Nn) / 10 ** D == val
    ca, cb = _cells(A), _cells(B)
    need = len(Nn.zfill(D + 1))
    C = max(len(ca), len(cb) + 1, need) + 1
    out = []
    cap = cap or '%s × %s' % (A, B)
    out.append(T(C * c / 2, 22, cap, 26, anchor='middle', fill='#2E6B5A'))
    y = 50

    def row(cells, sign=None):
        nonlocal y
        off = C - len(cells)
        for j, (d, dot) in enumerate(cells):
            cx = (off + j) * c + c / 2
            out.append(T(cx, y + c / 2, d, fs, anchor='middle'))
            if dot:
                out.append('<circle cx="%.1f" cy="%.1f" r="5" fill="%s"/>' % ((off + j + 1) * c - 3, y + c - 8, RED))
        if sign:
            out.append(T((off - 1) * c + c / 2, y + c / 2, sign, fs, anchor='middle'))
        y += c
    row(ca)
    row(cb, '×')
    out.append('<line x1="0" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3"/>' % (y + 2, C * c, y + 2, INK))
    y += 8
    if len(nb) >= 2:
        for r in range(len(nb)):
            for j in range(C):
                out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="4" fill="none" stroke="#9AABA4" stroke-width="1.6" stroke-dasharray="5 4"/>'
                           % (j * c + 6, y + 5, c - 12, c - 10))
            y += c
        out.append('<line x1="0" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>' % (y + 2, C * c, y + 2, '#9AABA4'))
        y += 8
    for j in range(C):
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="5" fill="#fff" stroke="#666" stroke-width="2"/>' % (j * c + 5, y + 4, c - 10, c - 8))
    y += c
    return ''.join(out), C * c, y + 6, '%s×%s=%s' % (A, B, dec(val))


def vert_fig(s, probs):
    """세로셈 문제 여러 개를 나란히. probs [(A, B, cap)] → 답 글 목록"""
    parts, ans = [], []
    for p in probs:
        A, B = p[0], p[1]
        cap = p[2] if len(p) > 2 else None
        g, w, h, a = vert_board(A, B, cap)
        parts.append((g, w, h))
        ans.append(a)
    gap = 90
    W = sum(w for g, w, h in parts) + gap * (len(parts) - 1) + 40
    H = max(h for g, w, h in parts) + 10
    out, x = [], 20
    for g, w, h in parts:
        out.append('<g transform="translate(%d 8)">%s</g>' % (x, g))
        x += w + gap
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(150, W * .2))
    if any(len(nat(p[1])) >= 2 for p in probs):
        s.text('※ 점선 칸에는 자연수의 곱셈을 할 때 나오는 곱을 메모해요. 맨 아래 칸에 곱을 쓰고 소수점을 찍어요.')
    else:
        s.text('※ 자연수의 곱셈처럼 계산해 맨 아래 칸에 곱을 쓰고, 알맞은 곳에 소수점을 찍어요.')
    return ans


def point_fig(s, items, sample=None):
    """자연수의 곱에 소수점 찍기: 숫자 사이 작은 동그라미 중 하나에 소수점을 찍고 → 곱을 써요."""
    out, y, rows = [], 10, []
    c, fs = 46, 40
    if sample:
        out.append(T(14, y + 26, sample, 34, fill='#2E6B5A'))
        y += 64
    lw = max(tw(e.replace('×', ' × ') + ' =', 34) for e in items) + 30
    ans = []
    for e in items:
        A, B = e.split('×')
        Nn = str(int(nat(A)) * int(nat(B)))
        D = ndig(A) + ndig(B)
        Z = max(2, D + 1 - len(Nn))
        cells = ['0'] * Z + list(Nn)
        val = ev(e)
        assert Q(Nn) / 10 ** D == val
        cy = y + 34
        out.append(T(14, cy, e.replace('×', ' × ') + ' =', 34))
        x0 = 14 + lw
        for j, d in enumerate(cells):
            out.append(T(x0 + j * c + c / 2, cy, d, fs, anchor='middle', fill='#B9C5C0' if j < Z else INK))
            if j < len(cells) - 1:
                out.append('<circle cx="%.1f" cy="%.1f" r="6" fill="#fff" stroke="%s" stroke-width="1.8" stroke-dasharray="3 2"/>'
                           % (x0 + (j + 1) * c, cy + 20, RED))
        xa = x0 + len(cells) * c + 20
        out.append(T(xa, cy, '→', 34))
        out.append('<rect x="%.1f" y="%.1f" width="190" height="52" rx="6" fill="#fff" stroke="#444" stroke-width="2.4"/>' % (xa + 50, cy - 26))
        y += 80
        ans.append('%s=%s' % (e, dec(val)))
        rows.append(xa + 260)
    W, H = int(max(rows) + 10), int(y + 6)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(170, W * .16))
    s.text('※ 흐린 0은 소수점 앞에 0이 필요할 때 쓰는 자리예요. 소수점을 찍을 동그라미에 점을 찍어요.')
    return ans


def rel_fig(s, rows, arr):
    """두 곱셈식 사이의 관계: rows=[['14','6','84'],['1.4','6','8.4']], arr={'a':'1/10','p':'1/10'}"""
    xs = {'a': 190, 'x': 300, 'b': 400, 'e': 500, 'p': 620}
    y1, y2 = 50, 200
    out = []
    for k, (a, b, p) in enumerate(rows):
        y = y2 if k else y1
        for key, t in (('a', a), ('x', '×'), ('b', b), ('e', '='), ('p', p)):
            out.append(T(xs[key], y, t, 34, anchor='middle'))
    for key in ('a', 'b', 'p'):
        f = arr.get(key)
        if not f:
            continue
        x = xs[key] - 58
        out.append('<path d="M%d %d Q%d %d %d %d" fill="none" stroke="%s" stroke-width="2.6"/>' % (x + 30, y1 + 22, x - 6, (y1 + y2) / 2, x + 30, y2 - 24, RED))
        out.append('<path d="M%d %d l-12 -4 l6 -10 z" fill="%s"/>' % (x + 30, y2 - 24, RED))
        lab = '[%s]배' % f
        lo = []
        eq_line(lab, x - 8 - eq_w(lab, 24), (y1 + y2) / 2, 24, lo)
        out.append(''.join(lo).replace('fill="%s"' % INK, 'fill="%s"' % RED).replace('stroke="%s"' % INK, 'stroke="%s"' % RED))
    W, H = 720, 240
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=100)


def stack_fig(s):
    """키가 기린 22마리를 쌓은 만큼인 나무(기린 1마리 약 5.2 m)"""
    base, u = 470, 19
    out = ['<line x1="20" y1="%d" x2="760" y2="%d" stroke="#8BA97A" stroke-width="4"/>' % (base, base)]
    tx = 560
    out.append('<rect x="%d" y="%d" width="30" height="%d" fill="#A8774E"/>' % (tx - 15, base - 22 * u, 22 * u))
    for k in range(9):
        out.append('<ellipse cx="%d" cy="%d" rx="46" ry="21" fill="%s"/>' % (tx + (32 if k % 2 else -32), base - 22 * u + 28 + k * 42, '#5E9B54' if k % 3 else '#4E8746'))
    out.append('<line x1="250" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2" stroke-dasharray="7 5"/>' % (base - 22 * u, tx + 60, base - 22 * u, RED))
    out.append(T(tx + 70, base - 22 * u, '나무 꼭대기', 20, fill=RED))
    gx = 300
    for k in range(22):
        y = base - (k + 1) * u
        out.append('<rect x="%d" y="%d" width="44" height="%d" rx="5" fill="#F2C35A" stroke="#B5832C" stroke-width="1.2"/>' % (gx - 22, y + 1, u - 2))
        if (k + 1) % 5 == 0 or k == 21:
            out.append(T(gx - 34, y + u / 2, '%d마리' % (k + 1), 17, anchor='end', fill=DARK))
    out.append('<rect x="90" y="%d" width="26" height="%d" fill="#F2C35A" stroke="#B5832C"/>' % (base - u, u))
    out.append(T(103, base - u - 18, '기린 1마리 약 5.2 m', 18, anchor='middle', fill=DARK))
    W, H = 780, base + 16
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=95)


# ---------------------------------------------------------------- 놀이판·점수판
def run_score(rows, who):
    R, C = len(rows), len(rows[0])
    B = lambda L: 7 if L >= 4 else 5 if L == 3 else 2 if L == 2 else 0
    cells = sum(r.count(who) for r in rows)
    bonus = 0
    for r in range(R):
        L = 0
        for c in range(C + 1):
            if c < C and rows[r][c] == who:
                L += 1
            else:
                bonus += B(L)
                L = 0
    for c in range(C):
        L = 0
        for r in range(R + 1):
            if r < R and rows[r][c] == who:
                L += 1
            else:
                bonus += B(L)
                L = 0
    return cells, bonus, cells + bonus


def mini_fig(s, rows, pond):
    sz = 92
    out = []
    for r, row in enumerate(rows):
        for c, ch in enumerate(row):
            fill = {'G': '#9ED58F', 'O': '#F6B67A', 'P': '#9CC9E8'}.get(ch, '#FFFDF6')
            x, y = 10 + c * sz, 10 + r * sz
            out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#6E7C76" stroke-width="2"/>' % (x, y, sz, sz, fill))
            lab = {'G': '연두', 'O': '주황', 'P': pond}.get(ch)
            if lab:
                out.append(T(x + sz / 2, y + sz / 2, lab, 22, anchor='middle', fill='#2D3F3A'))
    W, H = 20 + len(rows[0]) * sz, 20 + len(rows) * sz
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=80)


def board_fig(s, board, pond):
    sz = 168
    out = []
    for i, t in enumerate(board):
        r, c = divmod(i, 6)
        x, y = 10 + c * sz, 10 + r * sz
        fill = '#9CC9E8' if t == 'P' else '#FFF0B8' if t == 'B' else '#FFFDF6'
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#6E7C76" stroke-width="2"/>' % (x, y, sz, sz, fill))
        lab = pond if t == 'P' else '보너스' if t == 'B' else t.replace('×', ' × ')
        out.append(T(x + sz / 2, y + sz / 2, lab, 30, anchor='middle'))
    out.append('<rect x="10" y="10" width="%d" height="%d" fill="none" stroke="%s" stroke-width="4"/>' % (6 * sz, 6 * sz, INK))
    y = 10 + 6 * sz + 50
    out.append('<line x1="10" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3" stroke-dasharray="12 8"/>' % (y, 10 + 6 * sz, y, RED))
    out.append(T(10 + 3 * sz, y + 30, '출발선 (여기에서 바둑돌을 튕겨요)', 26, anchor='middle', fill=RED))
    W, H = 20 + 6 * sz, y + 56
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=150)


# ================================================================ 활동 조각
def N(a, e=None):
    """수 빈칸(답 a, 확인 식 e)"""
    if e:
        X(e, a)
    return ('n', str(a))


def O(opts, a):
    return ('o', opts, a)


def M(opts, al):
    return ('m', opts, al)


def Fb(n, d):
    return ('f', str(n), str(d))


GLUE = re.compile(r'^[\.\,\)\:]|^(이에요|예요|이에|이므로|므로|이고|이라|라서|으로|이|가|을|를|은|는|과|와|로|의|에|만큼|인|배|\(개\)|\(자리\)|번|칸|개|점|자리)')


def _join(pieces):
    out = ''
    for p in pieces:
        if not out:
            out = p
        elif GLUE.match(p) or out.endswith('('):
            out += p
        else:
            out += ' ' + p
    return out


def _is_fig(row):
    for p in row:
        if isinstance(p, tuple) and p[0] == 'f':
            return True
        if isinstance(p, str) and '[' in p:
            return True
    return False


def _ans(p):
    k = p[0]
    if k == 'n':
        return p[1]
    if k == 'f':
        return '%s/%s' % (p[1], p[2])
    if k == 'o':
        return flat(K(p[1][p[2]]))
    if k == 'm':
        return ', '.join(flat(K(p[1][i])) for i in p[2])


def _txt(p):
    if isinstance(p, str):
        return K(p)
    k = p[0]
    if k == 'n':
        return '(' + ' ' * max(8, 3 * len(p[1])) + ')'
    if k == 'o':
        return '( ' + ' / '.join(K(o) for o in p[1]) + ' )'
    if k == 'm':
        return '( ' + ' / '.join(K(o) for o in p[1]) + ' ) ← 모두 골라요'


def _fig(p):
    if isinstance(p, str):
        return jo(p)
    k = p[0]
    if k == 'n':
        return '{%s}' % p[1]
    if k == 'f':
        return '[{%s}/{%s}]' % (p[1], p[2])
    if k == 'o':
        return '( ' + ' / '.join(p[1]) + ' )'
    if k == 'm':
        return '( ' + ' / '.join(p[1]) + ' )'


def sent(s, rows):
    """앱 줄 문제 → 활동지. 줄: [글·빈칸…] | ('g', 제목, 줄들) | ('q', 글) | ('talk', [(누가, 글)]) | ('fig', 함수) | ('eq', 식)
    분수가 든 줄은 식 그림(분수를 위아래로), 나머지는 글 칸. 정답 글 목록."""
    ans, txt, eqs = [], [], []

    def flush():
        if txt:
            s.fill(txt[:] if len(txt) > 1 else txt[0])
            del txt[:]
        if eqs:
            eq_fig(s, eqs[:])
            del eqs[:]
    for r in rows:
        if isinstance(r, list):
            r = [(jo(r[i - 1][1] + p)[len(r[i - 1][1]):] if isinstance(p, str) and i and isinstance(r[i - 1], tuple) and r[i - 1][0] == 'n' else p)
                 for i, p in enumerate(r)]
            ans += [_ans(p) for p in r if not isinstance(p, str)]
            if _is_fig(r):
                if txt:
                    flush()
                e = _join([_fig(p) for p in r])
                full = re.sub(r'\{([^}]*)\}', r'\1', e)
                if '=' in full and not re.search(r'[가-힣(]', full):
                    vals = [ev(t) for t in full.split('=') if t.strip()]
                    assert all(v == vals[0] for v in vals), ('식 확인 필요', full)
                eqs.append(e)
            else:
                if eqs:
                    flush()
                txt.append(_join([_txt(p) for p in r]))
            continue
        flush()
        kind = r[0]
        if kind == 'g':
            s.text('▸ ' + K(r[1]))
            ans += sent(s, r[2])
        elif kind == 'q':
            s.text(K(r[1]))
        elif kind == 'talk':
            s.labeled([(w, K(t)) for w, t in r[1]])
        elif kind == 'fig':
            r[1](s)
        elif kind == 'eq':
            eq_fig(s, [r[1]])
        elif kind == 'eqt':
            eq_fig(s, [(r[1], r[2])])
    flush()
    return ans


def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], K(label)), K(sub) if sub else None)


def head(s, no, soop, title, question, scene):
    s.lesson(no, soop, K(title), K(question))
    if scene:
        s.scene(None, K(scene))


def opt_text(opts):
    return '( ' + ' / '.join(K(o) for o in opts) + ' )'


def blanks(s, lv, parts):
    """앱 blanks(약속하기): 기본형은 보기, 도전형은 빈칸 + 낱말 상자"""
    txt, ans, words = '', [], []
    for p in parts:
        if isinstance(p, str):
            txt += K(p)
        else:
            opts, a = p
            ans.append(flat(K(opts[a])))
            words += [K(o) for o in opts]
            txt += opt_text(opts) if lv == '기본형' else '(              )'
    if lv == '도전형':
        s.wordbox(sorted(set(words), key=lambda w: (len(w), w)))
    s.fill(txt)
    return ans


def chooses(s, items):
    """[(질문, 보기, 정답 번호|번호 목록)] → 고르기. 정답 글 목록"""
    ans = []
    short = all(len(K(o)) <= 16 for q, o, a in items for o in o)
    if short:
        s.choices([(K(q) + (' (모두)' if isinstance(a, list) else ''), opt_text(o)) for q, o, a in items])
    else:
        for q, o, a in items:
            s.ask(K(q) + (' 알맞은 것을 모두 골라 기호를 써요.' if isinstance(a, list) else ''), blank=False)
            s.fill(['%s %s' % (KO[i], K(x)) for i, x in enumerate(o)])
            s.ask('답: (        )', blank=False)
    for q, o, a in items:
        if isinstance(a, list):
            ans.append(', '.join((KO[i] if not short else flat(K(o[i]))) for i in a))
        else:
            ans.append(flat(K(o[a])) if short else KO[a])
    return ans


def frame(help1):
    m = re.search(r'‘(.*)’', help1)
    t = m.group(1) if m else help1
    return K(t).replace('~', '__________')


def why(s, lv, q, help1, ans, label='왜 그럴까요?'):
    s.ask('%s %s' % (label, K(q)), blank=False)
    if lv == '기본형':
        s.fill(frame(help1))
    else:
        s.lines(2)
    return '예) ' + flat(K(ans))


def rule_first(s, lv, q, help1):
    s.ask('먼저 예상해요 · ' + K(q), blank=False)
    if lv == '기본형':
        s.fill(frame(help1))
    else:
        s.lines(1)


def write(s, lv, q, fr, ans):
    """글쓰기 칸: 기본형은 쓰기 틀, 도전형은 쓰는 줄"""
    s.ask(K(q), blank=False)
    if lv == '기본형':
        s.fill(frame(fr))
    else:
        s.lines(2)
    return '예) ' + flat(K(ans))


def challenge_why(s, q, n=2):
    s.ask(K(q), blank=False)
    s.lines(n)


def seq(s, items, order):
    s.fill(['%s' % K(t) for t in items])
    s.ask('배우는 차례대로 기호를 써 보세요.   ' + ' → '.join(['(      )'] * len(order)), blank=False)
    return ' → '.join(items[i][0] for i in order)


def panes(s, lv, items):
    if lv == '기본형':
        s.labeled([(n, K(ph).replace('~', '______________')) for n, ph, ex in items])
        s.text('예시) ' + K(items[0][2]))
    else:
        for n, ph, ex in items:
            s.ask('%s: %s' % (n, K(ph).replace('~', '…')), blank=False)
            s.lines(1)


def best_cards(cards, pat, goal):
    """수 카드로 만든 식 중 곱이 가장 큰(작은) 것. pat: '0.□□×□' 꼴"""
    n = pat.count('□')
    best = None
    for p in permutations(cards, n):
        e = pat
        for c in p:
            e = e.replace('□', c, 1)
        v = ev(e)
        if best is None or (v > best[0] if goal == 'max' else v < best[0]):
            best = (v, e)
    return best


def cards_task(s, cards, pat, goal):
    cards_fig(s, cards)
    s.text('수 카드를 한 번씩만 써서 □ 안에 놓아요.')
    eq_fig(s, [pat.replace('□', '{0}').replace('×', ' × ') + ' = ▢'])
    v, e = best_cards(cards, pat, goal)
    return '%s=%s' % (e, dec(v))


FOOD_TB = [('소고기볶음밥', '그릇', '352'), ('단팥도넛', '개', '142.5'), ('우유', '컵', '67'),
           ('참치김밥', '줄', '435'), ('꿀떡', '개', '45.6'), ('해물된장국', '그릇', '56')]
FOOD_ST = [('카레라이스', '그릇', '486'), ('삶은 옥수수', '개', '112.5'), ('소시지', '개', '58.4'),
           ('참치 주먹밥', '개', '168.5'), ('미역국', '그릇', '64'), ('사과', '개', '95.5'), ('우유', '컵', '125')]


def food_table(s, food):
    rows = [['음식', '열량(킬로칼로리)']] + [['%s 1%s' % (n, u), k] for n, u, k in food]
    s.table(rows, col_mm=[90, 90], row_h=2400)


def meal(s, lv, food, want):
    """먹은 음식 열량 구하기: want {번호: 양} → 줄 문제와 합계"""
    rows, terms = [], []
    for i, amt in sorted(want.items()):
        n, u, k = food[i]
        e = '%s×%s' % (k, amt)
        rows.append(['%s %s%s: %s × %s =' % (n, amt, u, k, amt), N(X(e), e), '킬로칼로리'])
        terms.append(e)
    tot = X('+'.join(terms))
    rows.append(['모두 더하면', N(tot, '+'.join(terms)), '킬로칼로리'])
    return sent(s, rows), tot


def land_sheet(s, lv, board, pond):
    """땅따먹기: 놀이판 + 기록표(학생이 채움). 정답: 놀이판 모든 칸의 곱"""
    board_fig(s, board, pond)
    s.text('두 사람이 번갈아 한 번씩, 한 사람에 10번 바둑돌을 튕겨요. 도착한 칸의 식과 내가 구한 곱을 쓰고, 친구가 계산기로 확인해 맞으면 ○, 틀리면 ×를 써요.')
    rows = [['회', '연두: 칸의 식', '곱', '○/×', '주황: 칸의 식', '곱', '○/×']]
    rows += [[str(i + 1), '', '', '', '', '', ''] for i in range(10)]
    s.table(rows, col_mm=[12, 38, 26, 14, 38, 26, 14], row_h=1900, head_h=2200)
    s.table([['', '색칠한 칸 수', '추가 점수', '모두'], ['연두', '', '', '(    )점'], ['주황', '', '', '(    )점']], row_h=2300)
    keys = ['%s=%s' % (t.replace(' ', ''), X(t)) for t in board if t not in ('P', 'B')]
    return '놀이판 곱 — ' + ', '.join(keys) + ' (점수는 놀이마다 달라요)'


def memory_sheet(s, mem):
    """카드 짝 맞추기: 오려 쓰는 카드 16장(4×4) + 찾은 짝 기록표. 정답: 8쌍"""
    vals = []
    for a, b in mem:
        assert ev(a) == ev(b), (a, b)
        vals.append(ev(a))
    assert len(set(vals)) == len(vals)
    cards = [c for p in mem for c in p]
    order = [0, 5, 10, 15, 3, 6, 9, 12, 1, 4, 11, 14, 2, 7, 8, 13]
    assert sorted(order) == list(range(16))
    cells = [cards[i].replace('×', ' × ') for i in order]
    s.text('✂ 카드 16장을 오려 뒤집어 놓고 놀이해요. 두 장을 뒤집어 곱이 같으면 가져가요.')
    s.table([cells[i:i + 4] for i in range(0, 16, 4)], header=False, row_h=3000)
    s.table([['찾은 짝', '식 ①', '식 ②', '곱']] + [[str(i + 1), '', '', ''] for i in range(8)], col_mm=[22, 56, 56, 46], row_h=1900, head_h=2200)
    return '카드 짝 — ' + ', '.join('%s = %s = %s' % (a, b, dec(v)) for (a, b), v in zip(mem, vals))


def score_sheet(s, rows, pond, three=False):
    mini_fig(s, rows, pond)
    g, o = run_score(rows, 'G'), run_score(rows, 'O')
    win = '연두' if g[2] > o[2] else '주황' if g[2] < o[2] else '비겼어요'
    opts = ['연두', '주황'] + (['비겼어요'] if three else [])
    assert win in opts
    a = sent(s, [['연두: 색칠한 칸', N(g[0]), '칸, 추가 점수', N(g[1]), '점, 모두', N(g[2]), '점'],
                 ['주황: 색칠한 칸', N(o[0]), '칸, 추가 점수', N(o[1]), '점, 모두', N(o[2]), '점'],
                 ['이긴 사람은', O(opts, opts.index(win))]])
    return '연두 %d+%d=%d점, 주황 %d+%d=%d점, %s' % (g[0], g[1], g[2], o[0], o[1], o[2], win)


def note_line(s):
    s.text('※ 계산 식 그림에서 분수는 위아래로 썼어요. 글 속 분수는 ‘10분의 1’처럼 읽는 말로 썼어요. 네모 칸에는 수를, 큰 네모 칸에는 답을 써요.')


# ================================================================ 교과서 차시 버전 (문화 예술 체험 센터)
TB_SCENE = ('마을 폐교 활용 아이디어 공모전에 은성이네 모둠이 제안한 ‘문화 예술 체험 센터’가 뽑혔어요. '
            '개관하는 날 은성이네 모둠이 특별 초대를 받았어요.')
PLAN = ['㉠ 곱의 소수점 위치 알아보기', '㉡ (소수)×(소수) 알아보기', '㉢ (소수)×(자연수) 알아보기', '㉣ (자연수)×(소수) 알아보기']
BASIC_TIP = '세로셈은 소수점이 없다고 생각하고 자연수의 곱셈처럼 계산한 뒤, 두 수의 소수점 아래 자리 수를 더한 만큼 곱의 소수점을 찍어요.'
MEM_TB = [('357×0.1', '3570×0.01'), ('357×0.001', '3.57×0.1'), ('3.57×100', '35.7×10'), ('0.24×100', '2.4×10'),
          ('2.4×0.1', '0.024×10'), ('0.45×10', '450×0.01'), ('1.6×1000', '16×100'), ('0.16×0.1', '1.6×0.01')]
BOARD_TB = ['4.5×2.7', '0.3×4', '1.6×5', 'P', '0.12×6', '3.14×2',
            '6×0.7', '8×1.5', '12×0.25', '5×0.36', 'B', '0.8×0.9',
            '1.2×1.5', '2.4×0.5', '0.25×0.4', '3.5×2.2', '0.15×0.6', '7.2×3',
            '2.05×4', 'B', '9×0.8', '25×0.12', '1.8×2.5', '0.6×0.07',
            '4×3.25', '0.48×5', 'P', '11×1.1', '0.9×0.9', '6.4×0.5',
            '3.6×1.25', '15×0.6', '2.3×4.1', '0.75×8', '1.05×0.3', '2.5×0.4']


def rel(rows, arr):
    return ('fig', lambda s: rel_fig(s, rows, arr))


def J(xs):
    return ', '.join(xs)


def tb1(s, lv):
    head(s, 1, '개념 찾기(S)', '단원 도입 ― 문화 예술 체험 센터에 가요', '우리 주변에서 소수의 곱셈이 필요한 상황은 어떤 것이 있을까요?', TB_SCENE)
    note_line(s)
    step(s, 0, '가장 큰 나무', '기린을 쌓아 보기')
    s.text('“살아 있는 나무 중 세계에서 키가 가장 큰 나무는 키가 기린 22마리를 쌓아 올린 만큼이나 된대. 기린의 키가 약 5.2 m이니까 이 나무의 키는 약 몇 m일까?”')
    stack_fig(s)
    a1 = sent(s, [['나무의 키는 기린의 키 5.2 m를', N('22'), '번 더한 것과 같아요.'],
                  ['나무의 키를 구하는 곱셈식은', O(['5.2×22', '5.2+22', '22−5.2'], 0), '예요.'],
                  ['5.2를 5로 어림하면 5×22 =', N('110', '5×22'), '이므로 나무의 키는', O(['110 m보다 조금 커요', '110 m보다 조금 작아요'], 0), '.']])
    assert ev('5.2×22') > 110
    step(s, 1, '배울 내용 살펴보기', '학습 계획 세우기')
    s.text('“소수의 곱셈은 어떻게 계산하면 될까요?” 이 단원에서 배울 내용을 배우는 차례대로 써 보세요.')
    a2 = seq(s, PLAN, [2, 3, 1, 0])
    step(s, 2, '배운 내용 떠올리기', '분수와 소수, 분수의 곱셈')
    if lv == '기본형':
        s.text('0.1이 10개이면 1이에요. (분수)×(자연수)는 분모는 그대로 두고 분자와 자연수를 곱해요.')
    a3 = sent(s, [['[7/10]을 소수로 나타내면', N('0.7', '[7/10]'), '이에요.'],
                  ['0.1이 12개인 수는', N('1.2', '0.1×12'), '예요.', '　　0.3+0.3+0.3 =', N('0.9', '0.3+0.3+0.3')],
                  ['1.4의 10배는', N('14', '1.4×10'), '이고, 14의 [1/10]은', N('1.4', '14×[1/10]'), '예요.'],
                  ['[2/5]×3 = [2×3/5] =', Fb(6, 5)]])
    step(s, 3, '체험 센터 이야기', '소수의 곱셈이 필요한 상황')
    s.labeled([('은성', '우리의 아이디어로 폐교가 새로운 공간이 되었어!'), ('안내 선생님', '입구에서 주스를 한 명당 0.3 L씩 나누어 줄게요. 기념품으로 액자도 받아 가세요.')])
    a4 = chooses(s, [('은성이네 모둠 4명이 받은 주스의 양을 구하는 식은?', ['0.3×4', '0.3+4', '4−0.3'], 0)])
    a4 += chooses(s, [('우리 주변에서 소수의 곱셈을 이용하는 상황을 모두 골라 보세요.',
                       ['한 병에 1.5 L인 주스 3병의 양 알아보기', '가로 23.77 m, 세로 10.97 m인 테니스장의 넓이 알아보기',
                        '우리 반 학생 수 세기', '가로 2.5 m, 세로 1.2 m인 돗자리의 넓이 알아보기'], [0, 1, 3])])
    step(s, 4, '말해 보기', '내 경험과 관련짓기')
    w1 = write(s, lv, '체험 센터에서 해 보고 싶은 체험은 무엇인가요?', '‘저는 ~에서 ~을 해 보고 싶어요.’', '도자기 공방에서 그릇을 만들어 보고 싶어요.')
    w2 = write(s, lv, '주변에서 소수의 곱셈을 이용하는 상황을 하나 써 보세요.', '‘한 ~에 ~인 ~ ~개의 ~을 알아볼 때’', '한 개에 1.5 kg인 수박 3통의 무게를 알아볼 때')
    ans = '1차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s / %s' % (J(a1), a2, J(a3), J(a4), w1, w2)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 마트에서 물건 사기')
        a6 = sent(s, [['한 바구니에 1.2 kg인 딸기 4바구니: 1.2+1.2+1.2+1.2 =', N('4.8', '1.2+1.2+1.2+1.2'), 'kg'],
                      ['한 병에 1.5 L인 주스 3병: 1.5+1.5+1.5 =', N('4.5', '1.5×3'), 'L'],
                      ['한 봉지에 2.5 kg인 설탕 5봉지:', N('12.5', '2.5×5'), 'kg'],
                      ['같은 수를 여러 번 더하는 것은', O(['곱셈', '뺄셈'], 0), '으로 나타낼 수 있어요.']])
        ans += '  ⑥ %s' % J(a6)
    return ans


def tb2(s, lv):
    head(s, 2, '개념 구축하기(O)', '(소수)×(자연수)를 알아볼까요(1) ― 소수 한 자리 수인 경우', '(소수 한 자리 수)×(자연수)는 어떻게 계산할까요?',
         '“체험 센터 입구에서 주스를 한 명당 0.3 L씩 나누어 주었습니다.” 은성이네 마을의 자랑인 당근으로 만든 주스예요.')
    step(s, 0, '만져 보기', '주스 0.3 L씩 4명')
    s.text('은성이네 모둠 4명이 받은 주스는 모두 몇 L인지 알아보려고 해요. 한 칸이 0.1인 막대에 0.3씩 4번 색칠해 보세요.'
           + (' 첫 번째 0.3은 색칠해 두었어요.' if lv == '기본형' else ''))
    bars_fig(s, 3, 4, lv == '기본형')
    a1 = sent(s, [['4명이 받은 주스의 양을 구하는 식은', O(['0.3+0.3+0.3+0.3', '0.3×4', '두 식 모두 돼요'], 2)],
                  ['0.3×4는 0.3을 4번 더한 것과 같아요. 0.3+0.3+0.3+0.3 =', N('1.2', '0.3×4')],
                  ['0.3은 0.1이 3개이므로 0.3×4는 0.1이 3×4 =', N('12', '3×4'), '(개)예요.'],
                  ['0.3×4 = 0.1×', N('12'), '=', N('1.2', '0.1×12'), '　→ 4명이 받은 주스는 모두', N('1.2'), 'L예요.']])
    step(s, 1, '그려 보기', '1.4×6을 두 가지 방법으로')
    a2 = sent(s, [('g', '어림하기', [['1.4를 1.5로 보면 1.5×6은 1.5+1.5=3이 3번이므로 약', N('9', '1.5×6'), '예요.']]),
                  ('g', '방법 ① 분수의 곱셈으로 나타내어 계산하기', [['1.4×6 =', Fb(14, 10), '×6 = [14×6/10] =', Fb(84, 10), '=', N('8.4', '1.4×6')]]),
                  ('g', '방법 ② 자연수의 곱셈을 이용하여 계산하기',
                   ([rel([['14', '6', '84'], ['1.4', '6', '8.4']], {'a': '1/10', 'p': '1/10'})] if lv == '기본형' else []) +
                   [['14×6 =', N('84', '14×6')],
                    ['1.4는 14의', O(['10배', '[1/10]배', '[1/100]배'], 1), '이므로 1.4×6은 84의 [1/10]배인', N('8.4', '1.4×6'), '예요.']]),
                  ['어림한 9와 계산한 8.4는', O(['비슷해요', '많이 달라요'], 0)]])
    step(s, 2, '말해 보기', '2.6×3을 두 가지 방법으로')
    a3 = sent(s, [('g', '방법 ①', [['2.6×3 =', Fb(26, 10), '×3 = [26×3/10] =', Fb(78, 10), '=', N('7.8', '2.6×3')]]),
                  ('g', '방법 ②', [['26×3 =', N('78', '26×3'), '→ 2.6×3 =', N('7.8', '2.6×3')]]),
                  ['곱해지는 수가 [1/10]배가 되면 곱도', O(['10배', '[1/10]배', '그대로'], 1), '가 돼요.'],
                  ['0.4×5 = 2.0이에요. 2.0과 2는', O(['같은 수예요', '다른 수예요'], 0)]])
    assert ev('0.4×5') == Q('2.0')
    w3 = None
    if lv == '도전형':
        challenge_why(s, '26×3=78을 계산한 뒤 2.6×3을 왜 7.8로 써야 하는지 친구에게 말하듯 써 보세요.')
        w3 = '예) 2.6은 26의 10분의 1배이므로 곱도 78의 10분의 1배인 7.8이에요.'
    step(s, 3, '약속하기', '(소수)×(자연수)')
    a4 = blanks(s, lv, ['(소수)×(자연수)는 ', (['분수의 곱셈', '분수의 덧셈'], 0), '으로 나타내어 계산하거나 ', (['자연수의 곱셈', '소수의 뺄셈'], 0),
                        '을 이용하여 계산해요. 곱해지는 수가 [1/10]배가 되면 곱도 ', (['10배', '[1/10]배'], 1), '가 돼요.'])
    step(s, 4, '확인하기', '세로셈으로 계산하기')
    if lv == '기본형':
        s.text(BASIC_TIP)
    a5 = vert_fig(s, [('1.7', '4'), ('5.2', '6')])
    a5 += sent(s, [['0.9×3 =', Fb(9, 10), '×3 =', Fb(27, 10), '=', N('2.7', '0.9×3')]])
    ans = '2차시  ① %s  ② %s  ③ %s%s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), (' / ' + w3) if w3 else '', J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수학익힘 문제')
        s.text('수직선에서 0.3씩 6번 뛰어 세어 0.3×6을 구해 보세요.')
        jump_fig(s, '2', '0.1', '0.3', 0)
        a6 = sent(s, [['0.3씩', N('6'), '번 뛰어 세면', N('1.8', '0.3×6'), '이므로 0.3×6 =', N('1.8', '0.3×6')],
                      ['23×4 = 92이므로 2.3×4 =', N('9.2', '2.3×4')],
                      ['레몬청 한 통에 설탕이 0.5 kg 들어가요. 9통을 만들려면 설탕이', N('4.5', '0.5×9'), 'kg 필요해요.'],
                      ['한 변이 8.4 cm인 정육각형의 둘레는', N('50.4', '8.4×6'), 'cm예요.']])
        assert ev('23×4') == 92
        ans += '  ⑥ %s' % J(a6)
    return ans


def tb3(s, lv):
    head(s, 3, '개념 구축하기(O)', '(소수)×(자연수)를 알아볼까요(2) ― 소수 두 자리 수인 경우', '(소수 두 자리 수)×(자연수)는 어떻게 계산할까요?',
         '“은성이는 기념품으로 한 변의 길이가 0.12 m인 정사각형 모양의 액자를 받았습니다.”')
    step(s, 0, '만져 보기', '액자의 둘레')
    s.text('액자의 둘레는 몇 m인지 알아봐요. 액자의 한 변마다 0.12만큼인 수 모형 묶음을 놓고, 같은 모형끼리 모아 세어 보세요.'
           + ('' if lv == '기본형' else ' 첫 번째 묶음처럼 나머지 묶음을 그려 보세요.'))
    blocks_fig(s, '0.12', 4, 4 if lv == '기본형' else 1, frame='액자 한 변 0.12 m')
    a1 = sent(s, [['액자의 둘레를 구하는 식은 0.12+0.12+0.12+0.12 또는', O(['0.12×4', '0.12+4', '0.12×2'], 0)],
                  ['0.12×4에서 0.1이', N('4'), '개이므로', N('0.4', '0.1×4'), ', 0.01이 2×4 =', N('8', '2×4'), '(개)이므로', N('0.08', '0.01×8'), '이에요.'],
                  ['0.12×4 = 0.4+0.08 =', N('0.48', '0.12×4'), '　→ 액자의 둘레는', N('0.48'), 'm예요.']])
    step(s, 1, '그려 보기', '3.14×3을 두 가지 방법으로')
    a2 = sent(s, [('g', '어림하기', [['3.14를 3으로 어림하면 3×3 =', N('9', '3×3'), '이므로 3.14×3은', O(['9보다 조금 커요', '9보다 조금 작아요', '90쯤이에요'], 0)]]),
                  ('g', '방법 ① 분수의 곱셈으로', [['3.14×3 =', Fb(314, 100), '×3 = [314×3/100] =', Fb(942, 100), '=', N('9.42', '3.14×3')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['314', '3', '942'], ['3.14', '3', '9.42']], {'a': '1/100', 'p': '1/100'})] if lv == '기본형' else []) +
                   [['314×3 =', N('942', '314×3'), '. 3.14는 314의', O(['[1/10]배', '[1/100]배'], 1), '이므로 3.14×3은 942의 [1/100]배인', N('9.42', '3.14×3'), '예요.']])])
    step(s, 2, '말해 보기', '잘못 계산한 곳 찾기')
    a3 = sent(s, [('eqt', '친구의 계산', '5.18×2 = [518/10]×2 = [1036/10] = 103.6'),
                  ['잘못된 곳은', O(['5.18을 [518/10]로 나타낸 것', '518×2를 1036으로 계산한 것'], 0)],
                  ['5×2=10으로 어림하면 103.6은', O(['너무 커요', '알맞아요'], 0)],
                  ['옳게 계산하면 5.18×2 =', Fb(518, 100), '×2 =', Fb(1036, 100), '=', N('10.36', '5.18×2')],
                  ['[1036/100]처럼 분모가 10, 100, 1000인 분수는', O(['약분하지 않고 그대로 두면 소수로 나타내기 편리해요', '꼭 기약분수로 고쳐야 해요'], 0)]])
    assert ev('518×2') == 1036
    w3 = why(s, lv, '어림을 하면 잘못된 계산을 어떻게 찾을 수 있을까요?', '‘5.18을 ~로 어림하면 5×2 = ~이므로 곱은 ~쯤이어야 하는데, 103.6은 ~.’',
             '5.18을 5로 어림하면 5×2=10이므로 곱은 10쯤이어야 하는데, 103.6은 10보다 훨씬 커서 소수점 위치가 잘못된 것을 알 수 있어요.')
    step(s, 3, '약속하기', '(소수 두 자리 수)×(자연수)')
    a4 = blanks(s, lv, ['(소수 두 자리 수)×(자연수)는 분모가 ', (['10', '100', '1000'], 1), '인 분수의 곱셈으로 나타내어 계산하거나, 자연수의 곱셈을 한 뒤 곱을 ',
                        (['[1/10]배', '[1/100]배'], 1), ' 하여 계산해요. 곱해지는 수가 [1/100]배가 되면 곱도 ', (['100배', '[1/100]배'], 1), '가 돼요.'])
    step(s, 4, '확인하기', '세로셈과 김치 문제')
    if lv == '기본형':
        s.text(BASIC_TIP)
    a5 = vert_fig(s, [('4.87', '2'), ('6.09', '4')])
    a5 += sent(s, [['0.71×6 =', Fb(71, 100), '×6 =', Fb(426, 100), '=', N('4.26', '0.71×6')],
                   ('q', '수현이가 사는 지역에서는 매년 다문화 가정과 함께 김치를 담가요. 김치를 작년에는 1.25 t 담갔고, 올해는 작년의 3배만큼 담갔어요.'),
                   ['올해 담근 김치는', N('3.75', '1.25×3'), 't이에요.']])
    ans = '3차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수 카드 놀이')
        s.text('수 카드 4, 8, 6을 한 번씩 놓아 곱이 가장 큰 (소수 두 자리 수)×(자연수)를 만들어 보세요.')
        a6 = [cards_task(s, ['4', '8', '6'], '0.□□×□', 'max')]
        assert a6[0] == '0.64×8=5.12'
        a6 += sent(s, [['0.54×6', O(['>', '=', '<'], 2), '0.83×4'],
                       ['서준이가 하루에 1.95 km씩 일주일 동안 자전거를 타면 모두', N('13.65', '1.95×7'), 'km예요.']])
        assert ev('0.54×6') < ev('0.83×4')
        challenge_why(s, '가장 큰 수 8을 어느 자리에 놓았는지, 그 까닭을 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 8을 곱하는 수(자연수)에 놓으면 곱이 가장 커요(0.86×4=3.44, 0.84×6=5.04보다 커요).' % J(a6)
        assert ev('0.86×4') == Q('3.44') and ev('0.84×6') == Q('5.04')
    return ans


def tb4(s, lv):
    head(s, 4, '개념 구축하기(O)', '(자연수)×(소수)를 알아볼까요(1) ― 소수 한 자리 수인 경우', '(자연수)×(소수 한 자리 수)는 어떻게 계산할까요?',
         '“은성이는 작품을 만들기 위해 철사를 2 m의 0.9배만큼 사용하였습니다.” 작품 만들기 체험장에서 철사를 구부려 안경을 만들었어요.')
    step(s, 0, '만져 보기', '철사 2 m의 0.9배')
    s.text('이중 수직선의 아래 0.9배인 곳을 찾아 위로 올려 보고, 사용한 철사는 몇 m인지 알아보세요. 아래 작은 눈금 한 칸은 0.1배예요.'
           + (' 0.9배인 곳에 점선을 그려 두었어요.' if lv == '기본형' else ' 0.9배인 곳에 표시해 보세요.'))
    double_fig(s, '2', 'm', '철사 2 m', '1', '0.1', ['0.1', '0.2', '0.5', '0.9'], '0.9', lv == '기본형')
    a1 = sent(s, [['사용한 철사의 길이를 구하는 식은', O(['2×0.9', '2+0.9', '2−0.9'], 0)],
                  ['2의 1배는 2이므로 2의 0.1배는', N('0.2', '2×0.1'), '예요.'],
                  ['2의 0.9배는 0.2×9 =', N('1.8', '2×0.9'), '이에요.'],
                  ['은성이가 사용한 철사는', N('1.8'), 'm예요. 2 m보다', O(['길어요', '짧아요'], 1), '.']])
    step(s, 1, '그려 보기', '6×1.2를 두 가지 방법으로')
    a2 = sent(s, [('g', '어림하기', [['1.2를 1로 어림하면 6×1 =', N('6', '6×1'), '이므로 6×1.2는', O(['6보다 조금 커요', '6보다 조금 작아요'], 0)]]),
                  ('g', '방법 ① 분수의 곱셈으로', [['6×1.2 = 6×', Fb(12, 10), '= [6×12/10] =', Fb(72, 10), '=', N('7.2', '6×1.2')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['6', '12', '72'], ['6', '1.2', '7.2']], {'b': '1/10', 'p': '1/10'})] if lv == '기본형' else []) +
                   [['6×12 =', N('72', '6×12'), '. 1.2는 12의 [1/10]배이므로 6×1.2는 72의', O(['10배', '[1/10]배'], 1), '인', N('7.2', '6×1.2'), '예요.']])])
    step(s, 2, '말해 보기', '곱셈을 하면 항상 커질까?')
    a3 = sent(s, [('g', '방법 ①', [['5×2.3 = 5×', Fb(23, 10), '= [5×23/10] =', Fb(115, 10), '=', N('11.5', '5×2.3')]]),
                  ('g', '방법 ②', [['5×23 =', N('115', '5×23'), '→ 5×2.3 =', N('11.5', '5×2.3')]]),
                  ['5에 1보다 큰 수 2.3을 곱하면 곱은 5보다', O(['커져요', '작아져요'], 0)],
                  ['2에 1보다 작은 수 0.9를 곱하면 곱은 2보다', O(['커져요', '작아져요'], 1)],
                  ['곱셈을 하면 곱은', O(['항상 커져요', '곱하는 수가 1보다 작으면 작아져요'], 1)]])
    w3 = why(s, lv, '1보다 작은 수를 곱하면 왜 곱이 곱해지는 수보다 작아질까요?', '‘0.9배는 전체(1배)보다 ~ 부분만 구하는 것이라서 2 m의 0.9배는 2 m보다 ~.’',
             '0.9배는 전체(1배)보다 적은 부분만 구하는 것이라서 2 m의 0.9배는 2 m보다 짧아요.')
    step(s, 3, '약속하기', '(자연수)×(소수)')
    a4 = blanks(s, lv, ['(자연수)×(소수 한 자리 수)는 6×1.2=6×[12/10]처럼 ', (['분수의 곱셈', '분수의 덧셈'], 0), '으로 나타내어 계산하거나, 곱하는 수를 10배 한 자연수와 곱한 뒤 곱을 ',
                        (['10배', '[1/10]배'], 1), ' 해요. 1보다 작은 수를 곱하면 곱은 곱해지는 수보다 ', (['커져요', '작아져요'], 1), '.'])
    step(s, 4, '확인하기', '세로셈으로 계산하기')
    if lv == '기본형':
        s.text(BASIC_TIP)
    a5 = vert_fig(s, [('4', '2.6'), ('13', '3.4')])
    a5 += sent(s, [['7×0.8 = 7×', Fb(8, 10), '=', Fb(56, 10), '=', N('5.6', '7×0.8')]])
    ans = '4차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 곱이 가장 작은 식')
        s.text('수 카드 7, 3, 6을 한 번씩 놓아 곱이 가장 작은 (자연수)×(소수 한 자리 수)를 만들어 보세요.')
        a6 = [cards_task(s, ['7', '3', '6'], '□×□.□', 'min')]
        assert a6[0] == '3×6.7=20.1'
        a6 += sent(s, [['3×2.9 = 3×[29/10] =', Fb(87, 10), '=', N('8.7', '3×2.9')],
                       ['주원이는 어제 우유를 180 mL 마셨고, 오늘은 어제의 1.3배만큼 마셨어요. 오늘 마신 우유는', N('234', '180×1.3'), 'mL예요.']])
        challenge_why(s, '곱이 가장 작은 식을 만들 때 어떤 수를 어디에 놓았는지 까닭과 함께 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 가장 작은 수 3을 자연수에 놓고 남은 6, 7로 작은 소수 6.7을 만들었어요.' % J(a6)
    return ans


def tb5(s, lv):
    head(s, 5, '개념 구축하기(O)', '(자연수)×(소수)를 알아볼까요(2) ― 소수 두 자리 수인 경우', '(자연수)×(소수 두 자리 수)는 어떻게 계산할까요?',
         '“은성이는 벽화 그리기 체험을 하는 데 페인트를 2 L의 0.75배만큼 사용하였습니다.” “난 노란색 페인트로 꽃을 칠할래.”')
    step(s, 0, '만져 보기', '페인트 2 L의 0.75배')
    s.text('이중 수직선의 아래 0.75배인 곳을 찾아 사용한 페인트는 몇 L인지 알아보세요. 아래 작은 눈금 한 칸은 0.25배예요.'
           + (' 0.75배인 곳에 점선을 그려 두었어요.' if lv == '기본형' else ' 0.75배인 곳에 표시해 보세요.'))
    double_fig(s, '2', 'L', '페인트 2 L', '1', '0.25', ['0.25', '0.5', '0.75'], '0.75', lv == '기본형')
    a1 = sent(s, [['사용한 페인트의 양을 구하는 식은', O(['2×0.75', '2+0.75', '2×75'], 0)],
                  ['2의 1배는 2이므로 2의 0.25배는', N('0.5', '2×0.25'), '예요.'],
                  ['2의 0.75배는 0.5의 3배이므로', N('1.5', '2×0.75'), '예요. → 은성이가 사용한 페인트는', N('1.5'), 'L예요.']])
    step(s, 1, '그려 보기', '4×1.24를 두 가지 방법으로')
    a2 = sent(s, [('g', '어림하기', [['1.24는 1과 1.5의 중간쯤이에요. 4×1 =', N('4', '4×1'), ', 4×1.5 =', N('6', '4×1.5'), '이므로 4×1.24는 약', O(['5', '50', '0.5'], 0), '예요.']]),
                  ('g', '방법 ① 분수의 곱셈으로', [['4×1.24 = 4×', Fb(124, 100), '= [4×124/100] =', Fb(496, 100), '=', N('4.96', '4×1.24')]]),
                  ('g', '방법 ② 자연수의 곱셈으로', [['4×124 =', N('496', '4×124'), '. 1.24는 124의', O(['[1/10]배', '[1/100]배'], 1), '이므로 4×1.24 =', N('4.96', '4×1.24')]]),
                  ['1.24×4를 계산해도 곱은', O(['같아요', '달라요'], 0), '. 곱하는 수와 곱해지는 수의 위치가 바뀌어도 곱은 같아요.']])
    assert ev('1.24×4') == ev('4×1.24')
    step(s, 2, '말해 보기', '어림셈으로 견주기')
    s.text('“작품을 만드는 데 색점토를 더 많이 사용한 사람은 누구인지 어림셈하여 구하고, 어떻게 어림셈했는지 이야기해 봅시다.”')
    a3 = sent(s, [('talk', [('은찬', '나는 색점토 50 g의 0.75배만큼 사용하여 고양이를 만들었어.'), ('예린', '나는 색점토 40 g의 1.25배만큼 사용하여 강아지를 만들었어.')]),
                  ('g', '어림하기', [['은찬: 0.75를 1로 어림하면 50×1 =', N('50', '50×1'), '이므로 약 50 g이고, 실제로는 50 g보다', O(['적어요', '많아요'], 0)],
                                   ['예린: 1.25를 1.5로 어림하면 40×1.5 =', N('60', '40×1.5'), '이므로 약 60 g이에요.'],
                                   ['색점토를 더 많이 사용한 사람은', O(['은찬', '예린'], 1), '이에요.']]),
                  ('g', '정확하게 계산해 확인하기', [['50×0.75 =', N('37.5', '50×0.75'), ', 40×1.25 =', N('50', '40×1.25'), '　→ 어림한 결과와 계산한 결과는', O(['같아요', '달라요'], 0)]])])
    w3 = why(s, lv, '어떻게 어림셈했는지 친구에게 설명해 보세요.', '‘은찬이는 50 g에 1보다 ~ 수를 곱했으니 50 g보다 ~, 예린이는 약 ~ g이에요.’',
             '은찬이는 50 g에 1보다 작은 0.75를 곱했으니 50 g보다 적고, 예린이는 1.25를 1.5로 어림하면 약 60 g이에요. 그래서 예린이가 더 많이 사용했어요.')
    step(s, 3, '약속하기', '(자연수)×(소수 두 자리 수)')
    a4 = blanks(s, lv, ['(자연수)×(소수 두 자리 수)는 분모가 ', (['10', '100'], 1), '인 분수의 곱셈으로 나타내어 계산하거나, 자연수끼리 곱한 뒤 곱을 ', (['[1/10]배', '[1/100]배'], 1),
                        ' 해요. 곱하는 수가 1보다 크면 곱은 곱해지는 수보다 ', (['커지고', '작아지고'], 0), ', 1보다 작으면 곱은 곱해지는 수보다 ', (['커져요', '작아져요'], 1), '.'])
    step(s, 4, '확인하기', '세로셈으로 계산하기')
    s.text('20×3.04는 두 수의 자리를 바꾸어 3.04×20으로 세로셈을 해도 곱이 같아요.' + (' ' + BASIC_TIP if lv == '기본형' else ''))
    a5 = vert_fig(s, [('17', '0.32'), ('3.04', '20', '20 × 3.04 → 3.04 × 20')])
    assert ev('20×3.04') == ev('3.04×20')
    a5 += sent(s, [['5×2.63 = 5×', Fb(263, 100), '=', Fb(1315, 100), '=', N('13.15', '5×2.63')]])
    ans = '5차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수학익힘 문제')
        s.text('이중 수직선의 아래 1.75배인 곳에 표시하고 2×1.75를 구해 보세요. 아래 작은 눈금 한 칸은 0.25배예요.')
        double_fig(s, '4', '', '2의 몇 배', '2', '0.25', ['0.25', '0.5', '1', '1.75'], '1.75', False, top_labels=[(4, '2')])
        a6 = sent(s, [['2의 0.25배는', N('0.5', '2×0.25'), '이므로 2의 1.75배는 2×1.75 =', N('3.5', '2×1.75')],
                      ['곱이 8보다 큰 것은', O(['9×0.79', '2×3.85', '6×1.48'], 2)],
                      ['13×0.06 =', N('0.78', '13×0.06')],
                      ['승호의 식물은 12 cm이고, 민아의 식물은 승호 식물의 2.25배예요. 민아의 식물은', N('27', '12×2.25'), 'cm예요.']])
        assert ev('9×0.79') < 8 and ev('2×3.85') < 8 and ev('6×1.48') > 8
        ans += '  ⑥ %s' % J(a6)
    return ans


def tb6(s, lv):
    head(s, 6, '개념 구축하기(O)', '(소수)×(소수)를 알아볼까요(1) ― 소수 한 자리 수인 경우', '(소수 한 자리 수)×(소수 한 자리 수)는 어떻게 계산할까요?',
         '“은성이와 지아는 가로가 0.8 m, 세로가 0.6 m인 직사각형 모양의 천을 염색하려고 합니다.”')
    step(s, 0, '만져 보기', '천의 넓이를 모눈으로')
    s.text('가로·세로가 1 m인 정사각형을 100칸으로 나눈 모눈종이에 천의 크기만큼 색칠하고, 천의 넓이는 몇 m²인지 알아보세요. 모눈 한 칸의 한 변은 0.1 m예요.'
           + (' 천의 크기만큼 색칠해 두었어요.' if lv == '기본형' else ''))
    area_fig(s, 8, 6, 'm', lv == '기본형')
    a1 = sent(s, [['천의 넓이를 구하는 식은', O(['0.8×0.6', '0.8+0.6', '8×6'], 0)],
                  ['색칠한 칸은 모두', N('48', '8×6'), '칸이에요. 모눈 한 칸의 넓이는 0.1×0.1 =', N('0.01', '0.1×0.1'), '(m²)예요.'],
                  ['0.8×0.6 = 0.01×', N('48'), '=', N('0.48', '0.8×0.6'), '　→ 천의 넓이는', N('0.48'), 'm²예요.'],
                  ['0.48은 0.8과 0.6보다', O(['커요', '작아요'], 1), '.']])
    step(s, 1, '그려 보기', '3.4×1.7을 두 가지 방법으로')
    a2 = sent(s, [('g', '어림하기', [['3.4를 3으로, 1.7을 2로 어림하면 3×2 =', N('6', '3×2'), '이므로 3.4×1.7은 약 6이에요.']]),
                  ('g', '방법 ① 분수의 곱셈으로', [['3.4×1.7 =', Fb(34, 10), '×', Fb(17, 10), '= [34×17/100] =', Fb(578, 100), '=', N('5.78', '3.4×1.7')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['34', '17', '578'], ['3.4', '1.7', '5.78']], {'a': '1/10', 'b': '1/10', 'p': '1/100'})] if lv == '기본형' else []) +
                   [['34×17 =', N('578', '34×17')],
                    ['3.4는 34의 [1/10]배, 1.7은 17의 [1/10]배이므로 3.4×1.7은 578의', O(['[1/10]배', '[1/100]배', '100배'], 1), '인', N('5.78', '3.4×1.7'), '이에요.']])])
    step(s, 2, '말해 보기', '곱의 소수점 바르게 찍기')
    s.text('5.9×2.4를 계산해 보아요. 그리고 어떤 친구가 1.7×3.4를 세로로 계산한 뒤 덧셈처럼 소수점을 맞추어 57.8이라고 썼어요. 자연수의 곱에 소수점을 바르게 찍어 보세요.')
    a3 = point_fig(s, ['5.9×2.4', '1.7×3.4'])
    a3 += sent(s, [['방법 ①: 5.9×2.4 = [59/10]×[24/10] =', Fb(1416, 100), '=', N('14.16', '5.9×2.4')],
                   ['1.7×3.4를 2×3=6으로 어림하면 57.8은', O(['너무 커요', '알맞아요'], 0), '.'],
                   ['곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수를', O(['더한 것', '맞춘 것'], 0), '과 같아요.']])
    step(s, 3, '약속하기', '(소수)×(소수)')
    a4 = blanks(s, lv, ['(소수 한 자리 수)×(소수 한 자리 수)는 분모가 10인 분수의 곱셈으로 나타내어 계산하거나, 자연수끼리 곱한 뒤 곱을 ', (['[1/10]배', '[1/100]배'], 1),
                        ' 해요. 1보다 작은 두 수의 곱은 곱한 두 수보다 ', (['커요', '작아요'], 1), '.'])
    step(s, 4, '확인하기', '세로셈으로 계산하기')
    if lv == '기본형':
        s.text(BASIC_TIP + ' 1보다 작은 곱이면 소수점 앞 일의 자리에 0을 써요.')
    a5 = vert_fig(s, [('4.6', '0.9'), ('2.8', '6.7')])
    a5 += sent(s, [['0.5×0.7 =', Fb(5, 10), '×', Fb(7, 10), '=', Fb(35, 100), '=', N('0.35', '0.5×0.7')]])
    ans = '6차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수학익힘 문제')
        s.text('한 칸이 0.01인 모눈에 가로 0.7만큼, 세로 0.8만큼 색칠해 0.7×0.8을 구해 보세요.')
        area_fig(s, 7, 8, '', False)
        a6 = sent(s, [['0.7×0.8 = 0.01×', N('56', '7×8'), '=', N('0.56', '0.7×0.8')],
                      ['16×13 = 208이므로 1.6×1.3 =', N('2.08', '1.6×1.3')],
                      ['7.2×3.2를 옳게 계산한 것은', O(['203.4', '2.034', '23.04', '0.2304'], 2)],
                      ['0.6×9.5 =', N('5.7', '0.6×9.5'), '이므로 0.6×9.5 < □에서 □ 안에 들어갈 수 있는 가장 작은 자연수는', N('6'), '이에요.'],
                      ['한 변이 4.5 cm인 정사각형의 가로를 0.8배로 줄이고 세로를 1.4배로 늘인 직사각형은 가로', N('3.6', '4.5×0.8'), 'cm, 세로', N('6.3', '4.5×1.4'), 'cm, 넓이',
                       N('22.68', '3.6×6.3'), 'cm²예요.']])
        assert ev('16×13') == 208 and ev('7.2×3.2') == Q('23.04')
        challenge_why(s, '7.2×3.2의 곱을 어림으로 어떻게 고를 수 있는지 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 7×3=21쯤이므로 21에 가까운 23.04예요.' % J(a6)
    return ans


def tb7(s, lv):
    head(s, 7, '개념 구축하기(O)', '(소수)×(소수)를 알아볼까요(2) ― 소수 두 자리 수인 경우', '(소수 두 자리 수)×(소수 한 자리 수)는 어떻게 계산할까요?',
         '도자기 공방에서 “은성이는 흙을 0.21 kg 사용하여 그릇을 만들었고, 지아는 은성이가 사용한 흙의 0.6배만큼 사용하여 접시를 만들었습니다.”')
    step(s, 0, '만져 보기', '흙 0.21 kg의 0.6배')
    s.text('이중 수직선의 아래 0.6배인 곳을 찾아 지아가 사용한 흙은 몇 kg인지 알아보세요. 아래 작은 눈금 한 칸은 0.1배예요.'
           + (' 0.6배인 곳에 점선을 그려 두었어요.' if lv == '기본형' else ' 0.6배인 곳에 표시해 보세요.'))
    double_fig(s, '0.21', 'kg', '은성이가 사용한 흙 0.21 kg', '1', '0.1', ['0.1', '0.6'], '0.6', lv == '기본형')
    a1 = sent(s, [['지아가 사용한 흙의 양을 구하는 식은', O(['0.21×0.6', '0.21+0.6', '0.21×6'], 0)],
                  ['0.21의 1배는 0.21이므로 0.21의 0.1배는', N('0.021', '0.21×0.1'), '이에요.'],
                  ['0.21의 0.6배는 0.021의 6배이므로', N('0.126', '0.21×0.6'), '이에요. → 지아가 사용한 흙은', N('0.126'), 'kg이에요.']])
    step(s, 1, '그려 보기', '4.32×1.8을 두 가지 방법으로')
    a2 = sent(s, [('g', '어림하기', [['4.32를 4로, 1.8을 2로 어림하면 4×2 =', N('8', '4×2'), '이므로 4.32×1.8은 약 8이에요.']]),
                  ('g', '방법 ① 분수의 곱셈으로', [['4.32×1.8 =', Fb(432, 100), '×', Fb(18, 10), '=', Fb(7776, 1000), '=', N('7.776', '4.32×1.8')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['432', '18', '7776'], ['4.32', '1.8', '7.776']], {'a': '1/100', 'b': '1/10', 'p': '1/1000'})] if lv == '기본형' else []) +
                   [['432×18 =', N('7776', '432×18')],
                    ['4.32는 432의 [1/100]배, 1.8은 18의 [1/10]배이므로 4.32×1.8은 7776의', O(['[1/100]배', '[1/1000]배'], 1), '인', N('7.776', '4.32×1.8'), '이에요.']])])
    step(s, 2, '말해 보기', '앞 차시와 견주기')
    s.text('자연수의 곱에 소수점을 찍고, (소수 한 자리 수)×(소수 한 자리 수)와 견주어 공통점과 차이점을 말해 보세요.')
    a3 = point_fig(s, ['3.4×1.7', '4.32×1.8', '0.38×0.2'])
    a3 += sent(s, [['3.4×1.7의 곱은 소수', N('2'), '자리 수, 4.32×1.8의 곱은 소수', N('3'), '자리 수예요.'],
                   ['두 경우 모두 자연수의 곱셈을 한 뒤 두 수의 소수점 아래 자리 수를', O(['더한 만큼', '곱한 만큼'], 0), '곱의 소수점 아래 자리 수가 정해져요.']])
    w3 = why(s, lv, '두 계산의 같은 점과 다른 점을 써 보세요.', '‘같은 점은 ~하는 것이고, 다른 점은 곱의 소수점 아래 자리 수가 ~자리와 ~자리인 것이에요.’',
             '같은 점은 자연수의 곱셈을 한 뒤 곱의 소수점을 찍는 것이고, 다른 점은 곱의 소수점 아래 자리 수가 2자리와 3자리인 것이에요.')
    step(s, 3, '약속하기', '(소수 두 자리 수)×(소수 한 자리 수)')
    a4 = blanks(s, lv, ['(소수 두 자리 수)×(소수 한 자리 수)를 분수의 곱셈으로 나타내면 분모가 ', (['100', '1000'], 1), '인 분수가 돼요. 자연수끼리 곱한 뒤 곱을 ',
                        (['[1/100]배', '[1/1000]배'], 1), ' 하여 계산할 수도 있어요.'])
    step(s, 4, '확인하기', '세로셈으로 계산하기')
    if lv == '기본형':
        s.text(BASIC_TIP)
    a5 = vert_fig(s, [('5.73', '0.9'), ('1.27', '3.4')])
    a5 += sent(s, [['0.38×0.2 =', Fb(38, 100), '×', Fb(2, 10), '=', Fb(76, 1000), '=', N('0.076', '0.38×0.2')]])
    ans = '7차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 문제 만들기와 수학익힘 문제')
        s.text('5.63×2.5에 알맞은 문제를 골라 해결해 보세요. 문제 앞부분은 “방울토마토를 심은 밭의 가로는 5.63 m입니다.”예요.')
        a6 = chooses(s, [('5.63×2.5에 알맞은 뒷부분은?', ['“밭의 세로가 2.5 m라면 밭의 넓이는 몇 m²인지 구해 보세요.”',
                                                   '“밭의 세로가 2.5 m라면 밭의 둘레는 몇 m인지 구해 보세요.”',
                                                   '“밭의 가로를 2.5 m 늘이면 가로는 몇 m인지 구해 보세요.”'], 0)])
        a6 += sent(s, [['방울토마토를 심은 밭의 넓이는', N('14.075', '5.63×2.5'), 'm²예요.'],
                       ['0.37×5.1 = [37/100]×[51/10] =', Fb(1887, 1000), '=', N('1.887', '0.37×5.1')],
                       ['6.83, 20.04, 1.5, 17.9 중 가장 큰 수와 가장 작은 수의 곱은', N('30.06', '20.04×1.5')],
                       ['가인이는 한 봉지에 1.2 kg인 밀가루의 0.37배를 사용했어요. 사용한 밀가루는', N('0.444', '1.2×0.37'), 'kg이에요.'],
                       ['어떤 수에 0.4를 곱해야 하는데 잘못하여 뺐더니 11.65가 되었어요. 어떤 수는', N('12.05', '11.65+0.4'), '이고, 옳게 계산하면', N('4.82', '12.05×0.4'), '예요.']])
        assert max(Q(x) for x in ('6.83', '20.04', '1.5', '17.9')) == Q('20.04') and min(Q(x) for x in ('6.83', '20.04', '1.5', '17.9')) == Q('1.5')
        challenge_why(s, '5.63×2.5에 알맞은 나만의 문제를 하나 더 만들어 써 보세요.', 2)
        ans += '  ⑥ %s / 문제: 예) 한 상자에 5.63 kg인 귤 2.5상자의 무게는 몇 kg일까요?' % J(a6)
    return ans


def tb8(s, lv):
    head(s, 8, '개념 구축하기(O)', '곱의 소수점 위치는 어떻게 달라질까요', '곱하는 수에 따라 곱의 소수점 위치는 어떻게 달라질까요?',
         '“계단을 한 칸 오를 때마다 열량 0.15 킬로칼로리를 소모한다고 합니다.” 지아가 센터 계단을 오르며 “1칸은 0.15, 10칸은 1.5, 100칸은 15 킬로칼로리를 소모하네.” 하고 말했어요.')
    step(s, 0, '만져 보기', '곱의 소수점 움직임')
    s.text('곱을 써 보고 곱의 소수점이 어떻게 움직이는지 살펴보세요.')
    rows, a1 = [['가 · 0.15에 곱하기', '곱', '나 · 150에 곱하기', '곱']], []
    for f1, f2 in zip(['1', '10', '100', '1000'], ['1', '0.1', '0.01', '0.001']):
        rows.append(['0.15 × %s' % f1, '0.15' if f1 == '1' else '', '150 × %s' % f2, '150' if f2 == '1' else ''])
        a1.append('0.15×%s=%s' % (f1, X('0.15×' + f1)))
        a1.append('150×%s=%s' % (f2, X('150×' + f2)))
    s.table(rows, row_h=2300)
    a1 += sent(s, [['가: 곱하는 수가 10배, 100배, 1000배가 될 때마다 곱의 소수점이', O(['오른쪽', '왼쪽'], 0), '으로 한 자리씩 옮겨져요.'],
                   ['나: 곱하는 수가 [1/10]배, [1/100]배, [1/1000]배가 될 때마다 곱의 소수점이', O(['오른쪽', '왼쪽'], 1), '으로 한 자리씩 옮겨져요.']])
    step(s, 1, '그려 보기', '분수의 곱셈으로 살펴보기')
    if lv == '기본형':
        s.text('자연수는 분모가 1인 분수로 나타낼 수 있어요. 분모 10은 소수 한 자리, 100은 두 자리, 1000은 세 자리 수예요.')
    a2 = sent(s, [['4×7 = [4/1]×[7/1] =', Fb(28, 1), '=', N('28', '4×7')],
                  ['0.4×7 = [4/10]×[7/1] =', Fb(28, 10), '=', N('2.8', '0.4×7')],
                  ['0.4×0.7 = [4/10]×[7/10] =', Fb(28, 100), '=', N('0.28', '0.4×0.7')],
                  ['0.04×0.7 = [4/100]×[7/10] =', Fb(28, 1000), '=', N('0.028', '0.04×0.7')],
                  ['0.04×0.7에서 소수점 아래 자리 수는 2+1 =', N('3', '2+1'), '(자리)이므로 곱도 소수', N('3'), '자리 수예요.'],
                  ['두 수의 소수점 아래 자리 수가 늘어날 때마다 곱의 소수점이', O(['왼쪽', '오른쪽'], 0), '으로 옮겨져요.']])
    step(s, 2, '말해 보기', '보기를 이용하여 소수점 찍기')
    a3 = point_fig(s, ['5.7×39', '5.7×3.9', '5.7×0.39', '0.57×0.39'], sample='보기  57 × 39 = 2223')
    assert ev('57×39') == 2223
    w3 = why(s, lv, '0.57×0.39의 곱의 소수점은 어디에 찍었나요? 까닭을 써 보세요.', '‘0.57은 소수 ~자리, 0.39는 소수 ~자리라서 곱은 소수 ~자리 수예요.’',
             '0.57은 소수 두 자리, 0.39는 소수 두 자리라서 곱은 소수 네 자리 수예요. 2223 앞에 0을 채워 0.2223이에요.')
    step(s, 3, '약속하기', '곱의 소수점 위치')
    a4 = blanks(s, lv, ['소수에 10, 100, 1000을 곱하면 곱하는 수의 ', (['0의 개수', '소수점 아래 자리 수'], 0), '만큼 곱의 소수점이 ', (['오른쪽', '왼쪽'], 0),
                        '으로 옮겨져요. 자연수에 0.1, 0.01, 0.001을 곱하면 곱하는 수의 소수점 아래 자리 수만큼 곱의 소수점이 ', (['오른쪽', '왼쪽'], 1),
                        '으로 옮겨져요. 곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을 ', (['옮겨요', '그대로 둬요'], 0), '.'])
    step(s, 4, '확인하기', '소수점 위치를 생각하여 계산하기')
    a5 = sent(s, [['1.36×10 =', N('13.6', '1.36×10'), '1.36×100 =', N('136', '1.36×100'), '1.36×1000 =', N('1360', '1.36×1000')],
                  ['528×0.1 =', N('52.8', '528×0.1'), '528×0.01 =', N('5.28', '528×0.01'), '528×0.001 =', N('0.528', '528×0.001')],
                  ['한 개에 8.46 g인 사탕 10개는', N('84.6', '8.46×10'), 'g, 100개는', N('846', '8.46×100'), 'g, 1000개는', N('8460', '8.46×1000'), 'g이에요.']])
    ans = '8차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수학익힘 문제')
        s.text('보기  63 × 27 = 1701')
        assert ev('63×27') == 1701
        a6 = sent(s, [['6.3 ×', N('0.27'), '= 1.701', '　　', N('0.063'), '× 2700 = 170.1'],
                      ['4.06×1000 =', N('4060', '4.06×1000'), ', 920×0.01 =', N('9.2', '920×0.01')],
                      ['곱이 다른 하나는', O(['㉠ 54×0.12', '㉡ 54×0.012', '㉢ 0.054×12'], 0)],
                      ['재호가 0.8×0.5를 계산하려다 한 수의 소수점을 잘못 눌러 0.04가 나왔어요. 재호가 계산기에 누른 식은', O(['0.8×0.05', '8×0.5', '0.8×5'], 0)]])
        assert ev('6.3×0.27') == Q('1.701') and ev('0.063×2700') == Q('170.1')
        assert ev('54×0.012') == ev('0.054×12') != ev('54×0.12')
        assert ev('0.8×0.05') == Q('0.04') and ev('8×0.5') != Q('0.04')
        challenge_why(s, '6.3×□=1.701에서 □를 어떻게 구했는지 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 1.701은 소수 세 자리 수이고 6.3은 소수 한 자리 수라서 □는 27의 100분의 1배인 0.27이에요.' % J(a6)
    return ans


def tb9(s, lv):
    head(s, 9, '탐구 정리하기(O)', '생각을 더하다 ― 건강하게 식단을 관리해요', '예은이가 먹은 점심과 저녁은 적절한 한 끼 식사 열량과 비교하여 어떨까요?',
         '✽ 열량: 음식을 먹었을 때 낼 수 있는 에너지의 양을 킬로칼로리 단위로 나타낸 것. “5학년 여학생의 한 끼 식사로 적절한 열량은 600 킬로칼로리라고 합니다.”')
    step(s, 0, '이해해요', '음식별 열량 표')
    food_table(s, FOOD_TB)
    a1 = chooses(s, [('구하려는 것은?', ['점심에 먹은 음식의 열량', '먹은 음식의 무게', '먹은 음식의 가격'], 0),
                     ('한 끼 식사로 적절한 열량은?', ['600 킬로칼로리', '352 킬로칼로리', '1000 킬로칼로리'], 0),
                     ('단팥도넛 1개의 열량은?', ['142.5 킬로칼로리', '67 킬로칼로리', '45.6 킬로칼로리'], 0)])
    step(s, 1, '계획해요', '열량 구하는 방법')
    a2 = chooses(s, [('먹은 음식의 열량은 어떻게 구하나요?', ['음식별 열량과 먹은 음식의 양을 곱해요', '음식별 열량에 먹은 양을 더해요', '음식별 열량을 먹은 양만큼 빼요'], 0),
                     ('소고기볶음밥 0.5그릇의 열량을 구하는 식은?', ['352×0.5', '352+0.5', '352−0.5'], 0),
                     ('점심에 먹은 음식 전체의 열량은 어떻게 구하나요?', ['세 음식의 열량을 모두 더해요', '가장 큰 열량만 골라요'], 0)])
    step(s, 2, '해결해요 ①', '예은이의 점심')
    s.text('예은이의 점심: 소고기볶음밥 0.5그릇, 단팥도넛 2개, 우유 1.5컵.' + (' 67×1.5는 67×15=1005의 10분의 1배예요.' if lv == '기본형' else ''))
    a3, t3 = meal(s, lv, FOOD_TB, {0: '0.5', 1: '2', 2: '1.5'})
    assert t3 == '561.5'
    a3 += sent(s, [['600 킬로칼로리와 비교하면 점심 열량은', O(['600 킬로칼로리에 가까우므로 적절해요', '600 킬로칼로리보다 많이 적으므로 적절하지 않아요'], 0)]])
    step(s, 3, '해결해요 ②', '예은이의 저녁')
    s.text('“예은이가 저녁에 먹은 음식의 열량을 구해 보고, 적절한 한 끼 식사 열량과 비교해 봅시다.” 예은이의 저녁: 참치김밥 0.7줄, 꿀떡 3개, 해물된장국 0.5그릇.')
    a4, t4 = meal(s, lv, FOOD_TB, {3: '0.7', 4: '3', 5: '0.5'})
    assert t4 == '469.3'
    a4 += sent(s, [['600 킬로칼로리와 비교하면 저녁 열량은', O(['600 킬로칼로리에 가까우므로 적절해요', '600 킬로칼로리보다 많이 적으므로 적절하지 않아요'], 1)],
                   ['꿀떡 2개의 열량은 45.6×2 =', N('91.2', '45.6×2'), '킬로칼로리예요.']])
    step(s, 4, '되돌아봐요', '해결 과정 되돌아보기')
    w1 = write(s, lv, '음식의 열량을 어떻게 구했는지 설명해 보세요.', '‘음식별 열량과 ~을 곱한 뒤 ~.’', '음식별 열량과 먹은 양을 곱한 뒤 모두 더했어요.')
    w2 = write(s, lv, '저녁 식사를 적절하게 하려면 어떻게 바꾸면 좋을지 써 보세요.', '‘~을 ~개 더 먹으면 469.3+~=~ (킬로칼로리)가 돼요.’',
               '꿀떡을 2개 더 먹으면 469.3+91.2=560.5 (킬로칼로리)가 돼요.')
    assert ev('469.3+91.2') == Q('560.5')
    ans = '9차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s / %s' % (J(a1), J(a2), J(a3), J(a4), w1, w2)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 나만의 한 끼 식단')
        s.text('음식별 열량 표를 보고 나만의 한 끼 식단을 짜 보세요. 음식을 두 가지 이상 고르고 양을 정해, 열량의 합이 550 킬로칼로리 이상 650 킬로칼로리 이하가 되게 해요.')
        s.table([['음식', '먹을 양', '계산 식', '열량(킬로칼로리)']] + [['', '', '', ''] for _ in range(4)] + [['합계', '', '', '']], col_mm=[40, 30, 62, 48], row_h=2300)
        ex = X('435×1+56×1+67×1')
        assert Q(550) <= Q(ex) <= Q(650)
        ans += '  ⑥ (예) 참치김밥 1줄+해물된장국 1그릇+우유 1컵 = 435+56+67 = %s 킬로칼로리 (550~650이면 맞아요)' % ex
    return ans


def tb10(s, lv):
    head(s, 10, '발표하기(P)', '놀이를 더하다 ― 땅을 차지해 볼까요', '소수의 곱셈을 정확하게 계산하여 땅을 많이 차지해 볼까요?', None)
    step(s, 0, '놀이 방법 알기', '규칙 읽기')
    s.fill(['① 서로 다른 색의 색연필을 고르고 가위바위보로 순서를 정해요.', '② 자기 차례에 바둑돌을 ‘출발’에 놓고 손가락으로 튕겨요.',
            '③ 바둑돌이 도착한 칸의 식을 계산해요(선에 걸치면 바둑돌이 가장 많이 차지한 칸).', '④ 다른 사람은 계산기로 확인해요. 곱이 맞으면 땅을 색칠하고, 틀리면 순서가 넘어가요.',
            '⑤ 2~4를 10회 반복해요.', '⑥ 칸 수와 연속 칸으로 점수를 세요. 색칠한 칸마다 1점, 가로나 세로로 2칸 연속이면 2점, 3칸이면 5점, 4칸 이상이면 7점을 더 얻어요.'])
    a1 = chooses(s, [('땅을 색칠할 수 있는 경우를 모두 골라 보세요.', ['도착한 칸의 곱을 맞게 계산했을 때', '보너스에 들어갔을 때', '연못에 들어갔을 때',
                                                       '놀이판 밖으로 넘어갔을 때', '색칠된 땅에 들어갔을 때'], [0, 1])])
    a1 += chooses(s, [('가로로 3칸을 연속으로 색칠하면 추가 점수는?', ['2점', '5점', '7점'], 1)])
    step(s, 1, '놀이판 식 계산하기', '미리 계산하기')
    if lv == '기본형':
        s.text('어림해서 곱의 소수점 위치가 알맞은지도 확인해요. 0.6×0.07은 6×7=42에서 소수점 아래 자리 수가 1+2=3(자리)예요.')
    a2 = sent(s, [['4.5×2.7 =', N('12.15', '4.5×2.7'), '　　0.12×6 =', N('0.72', '0.12×6'), '　　12×0.25 =', N('3', '12×0.25')],
                  ['0.6×0.07 =', N('0.042', '0.6×0.07'), '　　3.6×1.25 =', N('4.5', '3.6×1.25')]])
    step(s, 2, '점수 세기', '놀이가 끝난 판')
    s.text('놀이가 끝난 판이에요. 연두와 주황이 얻은 점수를 세어 보세요(한 칸이 가로·세로 묶음에 함께 들어가도 돼요).')
    a3 = score_sheet(s, ['GGGO.', 'O.GO.', '.PGOO', 'GG..O'], '연못')
    assert a3.startswith('연두 7+12=19점, 주황 6+9=15점'), a3
    step(s, 3, '땅따먹기 놀이', '놀이판과 기록표')
    a4 = land_sheet(s, lv, BOARD_TB, '연못')
    step(s, 4, '되돌아보기', '놀이 되돌아보기')
    w1 = write(s, lv, '놀이에서 계산하기 어려웠던 식과 그 식을 계산한 방법을 써 보세요.', '‘~은 ~×~=~에서 소수점 아래 자리 수가 ~자리라서 ~이에요.’',
               '0.6×0.07은 6×7=42에서 소수점 아래 자리 수가 3자리라서 0.042예요.')
    w2 = write(s, lv, '점수를 더 얻으려면 어떻게 하면 좋을지 써 보세요.', '‘내가 색칠한 칸 ~을 노려서 ~.’', '내가 색칠한 칸 옆을 노려서 연속으로 차지해요.')
    step(s, 5, '또 다른 놀이', '카드 짝 맞추기')
    a6 = memory_sheet(s, MEM_TB)
    return '10차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s / %s  ⑥ %s' % (J(a1), J(a2), a3, a4, w1, w2, a6)


def tb11(s, lv):
    head(s, 11, '발표하기(P)', '공부한 내용을 확인해요', '소수의 곱셈을 어림하고 계산할 수 있나요?', None)
    step(s, 0, '그림 보고 계산하기', '수직선에서 뛰어 세기')
    s.text('수직선에서 0.4씩 4번 뛰어 세어 0.4×4를 구해 보세요.' + (' 첫 번째로 뛴 것을 그려 두었어요.' if lv == '기본형' else ''))
    jump_fig(s, '2', '0.1', '0.4', 1 if lv == '기본형' else 0)
    a1 = sent(s, [['0.4×4 =', N('1.6', '0.4×4')]])
    step(s, 1, '계산하기', '세로셈과 계산')
    a2 = vert_fig(s, [('3.59', '6.3')])
    a2 += sent(s, [['1.2×7 =', N('8.4', '1.2×7'), '　　12×0.3 =', N('3.6', '12×0.3')]])
    step(s, 2, '소수점 위치와 크기 비교', '')
    a3 = sent(s, [['98×47=4606이에요. 곱이 다른 하나는', O(['㉠ 9.8×4.7', '㉡ 9.8×0.47', '㉢ 98×0.47', '㉣ 0.98×47'], 1)],
                  ['5×2.75 =', N('13.75', '5×2.75'), ', 8.6×1.4 =', N('12.04', '8.6×1.4'), '→ 5×2.75', O(['>', '=', '<'], 0), '8.6×1.4'],
                  ['가로 3.04 m, 세로 2 m인 직사각형 모양 돗자리의 넓이는', N('6.08', '3.04×2'), 'm²예요.']])
    assert ev('98×47') == 4606 and ev('9.8×4.7') == ev('98×0.47') == ev('0.98×47') != ev('9.8×0.47')
    step(s, 3, '어림하여 해결하기', '')
    a4 = sent(s, [('talk', [('예린', '나는 물 4 L를 가지고 있어.'), ('윤호', '나는 예린이가 가지고 있는 물의 0.89배만큼 가지고 있어.'),
                            ('가은', '나는 예린이가 가지고 있는 물의 1.01배만큼 가지고 있어.')]),
                  ['가장 적은 양의 물을 가지고 있는 사람은', O(['예린', '윤호', '가은'], 1)],
                  ['까닭: 1보다 작은 수를 곱하면 계산 결과는 곱해지는 수보다', O(['작아져요', '커져요'], 0)],
                  ('q', '어느 가게에서는 빈 세제 통을 가져오면 세제를 1 L당 3500원에 팔아요. 은찬이는 세제를 2 L 샀고, 주아는 은찬이가 산 양의 1.4배만큼 샀어요.'),
                  ['주아가 산 세제는', N('2.8', '2×1.4'), 'L이고, 가격은', N('9800', '3500×2.8'), '원이에요.']])
    assert ev('4×0.89') < 4 < ev('4×1.01')
    step(s, 4, '확인하고 정리해요', '')
    a5 = sent(s, [['(소수)×(자연수): 1.37×2 = [137/100]×2 =', Fb(274, 100), '=', N('2.74', '1.37×2')],
                  ['(자연수)×(소수): 4×1.3 = 4×[13/10] =', Fb(52, 10), '=', N('5.2', '4×1.3')],
                  ['(소수)×(소수): 1.49×1.4 = [149/100]×[14/10] =', Fb(2086, 1000), '=', N('2.086', '1.49×1.4')],
                  ['곱의 소수점 위치: 32×16=512, 32×1.6=51.2, 3.2×1.6=5.12 → 3.2×0.16 =', N('0.512', '3.2×0.16')],
                  ['소수의 곱셈은 분수의 곱셈으로 나타내거나', O(['자연수의 곱셈', '소수의 덧셈'], 0), '을 이용하여 계산해요.'],
                  ['곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을', O(['옮겨요', '그대로 둬요'], 0)]])
    assert ev('32×16') == 512 and ev('32×1.6') == Q('51.2') and ev('3.2×1.6') == Q('5.12')
    ans = '11차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 어림하고 소수점 찍기')
        a6 = point_fig(s, ['4.9×3.2', '2.49×3', '3.7×3.2'])
        a6 += sent(s, [['4.9×3.2를 앞자리 수로 어림하면 4×3 =', N('12', '4×3'), '이므로 곱은 12보다', O(['커요', '작아요'], 0)],
                       ['햄버거 한 개가 2.49달러일 때 3개의 값을 2×3=6달러로 어림하면 실제 값보다', O(['부족해요', '많아요'], 0)]])
        challenge_why(s, '어림셈이 곱의 소수점 위치를 확인하는 데 어떻게 도움이 되는지 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 어림한 값과 크기가 비슷한지 보면 소수점을 바르게 찍었는지 알 수 있어요.' % J(a6)
    return ans


# ================================================================ 이야기 버전 (우리 반 과학 탐구 캠프)
ST_SCENE = ('한빛초등학교 5학년 2반은 학교에서 1박 2일 과학 탐구 캠프를 열어요. 캠프 반장 도윤이와 서아, 지호, 하윤, 민준, 수빈, 태오가 '
            '모둠을 나누어 실험을 맡았어요.')
ST_PLAN = ['실험 ① 비커 6개에 소금물을 0.4 L씩 담기', '실험 ② 강낭콩 줄기는 하루에 1.25 cm씩 자라요 — 4일 동안 자란 길이는?',
           '실험 ③ 구리선 5 m의 0.6배만큼 잘라 전기 회로 만들기', '실험 ④ 가로 0.8 m, 세로 0.6 m인 모종판에 씨앗 심기',
           '실험 ⑤ 지름 0.36 mm인 물방울을 돋보기·현미경으로 10배, 100배 확대해 보기', '캠프 식단: 카레라이스 0.8그릇의 열량은?']
TYPES = ['(소수)×(자연수)', '(자연수)×(소수)', '(소수)×(소수)']
MEM_ST = [('0.48×100', '4.8×10'), ('480×0.01', '0.48×10'), ('48×0.001', '0.48×0.1'), ('4.8×1000', '48×100'),
          ('0.048×10', '4.8×0.1'), ('2.5×100', '25×10'), ('250×0.001', '2.5×0.1'), ('25×0.1', '0.25×10')]
BOARD_ST = ['3.5×2.4', '0.7×6', '2.4×5', 'P', '0.16×5', '4.25×2',
            '5×0.8', '12×1.5', '8×0.75', '4×0.35', 'B', '0.6×0.7',
            '1.4×2.5', '3.2×0.5', '0.25×0.8', '2.5×1.8', '0.12×0.5', '6.4×3',
            '3.05×4', 'B', '7×0.9', '20×0.15', '1.5×3.6', '0.9×0.08',
            '5×4.12', '0.65×4', 'P', '1.2×1.2', '0.8×0.8', '2.6×0.5',
            '4.8×1.25', '25×0.4', '1.6×2.3', '0.45×6', '2.05×0.2', '3.6×0.5']


def st1(s, lv):
    head(s, 1, '개념 찾기(S)', '과학 탐구 캠프를 계획해요', '과학 탐구 캠프를 준비할 때 소수의 곱셈이 필요한 때는 언제일까요?', ST_SCENE)
    note_line(s)
    step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
    s.text('캠프 반장 도윤이가 만든 「5학년 2반 과학 탐구 캠프 계획표」를 보고, 세 칸에 써 보세요.')
    s.fill(ST_PLAN)
    panes(s, lv, [('보여요', '계획표에 ~이 보여요', '0.4 L, 1.25 cm, 0.36 mm처럼 소수가 많이 보여요.'),
                  ('생각해요', '~할 때 소수를 곱해야 할 것 같아요', '비커 6개에 담는 소금물은 0.4를 6번 더해야 하니까 0.4×6으로 구할 것 같아요.'),
                  ('궁금해요', '~은 어떻게 계산할까?', '0.8×0.6처럼 소수끼리 곱하면 곱의 소수점은 어디에 찍을까?')])
    step(s, 1, '그려 보기', '계획표를 곱셈식으로')
    a2 = sent(s, [['실험 ① 비커 6개에 담는 소금물의 양:', O(['0.4×6', '0.4+6', '6−0.4'], 0), '→', O(TYPES, 0)],
                  ['실험 ③ 구리선 5 m의 0.6배:', O(['5+0.6', '5×0.6', '5−0.6'], 1), '→', O(TYPES, 1)],
                  ['실험 ④ 모종판의 넓이:', O(['0.8+0.6', '0.8×0.6', '0.8×2+0.6×2'], 1), '→', O(TYPES, 2)]])
    w2 = why(s, lv, '비커 6개에 담는 소금물의 양을 왜 0.4×6으로 나타낼 수 있을까요?', '‘0.4 L씩 6개는 0.4를 ~번 더한 것과 같아서 ~으로 나타내요.’',
             '비커 6개에 0.4 L씩 담으면 0.4를 6번 더한 것과 같아요. 같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어서 0.4×6이에요.')
    step(s, 2, '말해 보기', '배운 내용 떠올리기')
    a3 = sent(s, [['[4/10]를 소수로 나타내면', N('0.4', '[4/10]'), '예요.'],
                  ['0.1이 24개인 수는', N('2.4', '0.1×24'), '예요.', '　　0.4+0.4+0.4 =', N('1.2', '0.4+0.4+0.4')],
                  ['2.5의 10배는', N('25', '2.5×10'), '이고, 25의 [1/10]은', N('2.5', '25×[1/10]'), '예요.'],
                  ['[3/7]×2 = [3×2/7] =', Fb(6, 7)]])
    assert ev('[3/7]×2') == Fraction(6, 7)
    step(s, 3, '약속하기', '배울 차례 정하기')
    s.text('“소수의 곱셈은 어떻게 계산하면 될까?” 이 단원에서 배울 내용을 배우는 차례대로 써 보세요.')
    a4 = seq(s, PLAN, [2, 3, 1, 0])
    step(s, 4, '확인하기', '먼저 어림해요')
    a5 = chooses(s, [('실험 ① 비커 6개에 0.4 L씩 담은 소금물은 모두 약 몇 L일까요?', ['약 0.24 L', '약 2.4 L', '약 24 L'], 1),
                     ('실험 ③에서 잘라 쓰는 구리선은 5 m보다 길까요, 짧을까요?', ['5 m보다 길어요', '5 m보다 짧아요', '5 m와 같아요'], 1),
                     ('실험 ④ 모종판의 넓이는 1 m²보다 넓을까요, 좁을까요?', ['1 m²보다 넓어요', '1 m²보다 좁아요'], 1)])
    assert ev('0.4×6') == Q('2.4') and ev('5×0.6') < 5 and ev('0.8×0.6') < 1
    ans = '1차시  ① (자유) 예) 0.4 L, 1.25 cm처럼 소수가 많이 보여요  ② %s / %s  ③ %s  ④ %s  ⑤ %s' % (J(a2), w2, J(a3), a4, J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 캠프 간식 장보기')
        a6 = sent(s, [['한 봉지에 0.35 kg인 견과류 4봉지: 0.35+0.35+0.35+0.35 =', N('1.4', '0.35+0.35+0.35+0.35'), 'kg'],
                      ['한 병에 1.8 L인 생수 5병:', N('9', '1.8×5'), 'L', '　　한 통에 2.5 kg인 수박 3통:', N('7.5', '2.5×3'), 'kg'],
                      ['같은 수를 여러 번 더하는 것은', O(['곱셈', '뺄셈'], 0), '으로 나타낼 수 있어요.']])
        ans += '  ⑥ %s' % J(a6)
    return ans


def st2(s, lv):
    head(s, 2, '개념 구축하기(O)', '비커에 소금물을 담아요 ― (소수 한 자리 수)×(자연수)', '(소수 한 자리 수)×(자연수)는 어떻게 계산할까요?',
         '지호네 모둠은 실험을 하려고 비커 3개에 소금물을 0.6 L씩 담았어요. 담은 소금물은 모두 몇 L일까요?')
    step(s, 0, '만져 보기', '비커 세 개의 소금물')
    rule_first(s, lv, '0.6×3처럼 소수에 자연수를 곱하면 어떻게 계산할 수 있을까요?', '‘내 규칙: 0.6은 0.1이 ~개이니까 0.6×3은 0.1이 ~개예요.’')
    s.text('한 칸이 0.1인 막대에 0.6씩 3번 색칠해 보세요.' + (' 첫 번째 0.6은 색칠해 두었어요.' if lv == '기본형' else ''))
    bars_fig(s, 6, 3, lv == '기본형')
    a1 = sent(s, [['소금물의 양을 구하는 식은', O(['0.6+0.6+0.6', '0.6×3', '두 식 모두 돼요'], 2), '　　0.6+0.6+0.6 =', N('1.8', '0.6×3')],
                  ['0.6은 0.1이 6개이므로 0.6×3은 0.1이 6×3 =', N('18', '6×3'), '(개)예요.'],
                  ['0.6×3 = 0.1×', N('18'), '=', N('1.8', '0.1×18'), '　→ 담은 소금물은 모두', N('1.8'), 'L예요.']])
    r1 = '실제 규칙: 0.6은 0.1이 6개이니까 0.6×3은 0.1이 18개, 1.8이에요.'
    step(s, 1, '그려 보기', '1.4×8을 두 가지 방법으로')
    s.text('하윤이네 모둠은 소금물 1.4 L씩을 8개 모둠에 나누어 주려고 해요. 필요한 소금물은 1.4×8 (L)이에요.')
    a2 = sent(s, [('g', '어림하기', [['1.4를 1.5로 보면 1.5×8은 1.5+1.5=3이 4번이므로 약', N('12', '1.5×8'), '이에요.']]),
                  ('g', '방법 ① 분수의 곱셈으로 나타내어 계산하기', [['1.4×8 =', Fb(14, 10), '×8 = [14×8/10] =', Fb(112, 10), '=', N('11.2', '1.4×8')]]),
                  ('g', '방법 ② 자연수의 곱셈을 이용하여 계산하기',
                   ([rel([['14', '8', '112'], ['1.4', '8', '11.2']], {'a': '1/10', 'p': '1/10'})] if lv == '기본형' else []) +
                   [['14×8 =', N('112', '14×8')],
                    ['1.4는 14의', O(['10배', '[1/10]배', '[1/100]배'], 1), '이므로 1.4×8은 112의 [1/10]배인', N('11.2', '1.4×8'), '예요.']]),
                  ['어림한 12와 계산한 11.2는', O(['비슷해요', '많이 달라요'], 0)]])
    step(s, 2, '말해 보기', '곱해지는 수가 10분의 1배가 되면')
    s.text('서아는 3.7×4를 두 가지 방법으로 계산했어요. 빈칸을 채우고, 왜 그렇게 되는지 말해 보세요.')
    a3 = sent(s, [('g', '방법 ①', [['3.7×4 =', Fb(37, 10), '×4 = [37×4/10] =', Fb(148, 10), '=', N('14.8', '3.7×4')]]),
                  ('g', '방법 ②', [['37×4 =', N('148', '37×4'), '→ 3.7×4 =', N('14.8', '3.7×4')]]),
                  ['곱해지는 수가 [1/10]배가 되면 곱도', O(['10배', '[1/10]배', '그대로'], 1), '가 돼요.'],
                  ['0.5×4 = 2.0이에요. 2.0과 2는', O(['같은 수예요', '다른 수예요'], 0)]])
    assert ev('0.5×4') == Q('2.0')
    w3 = why(s, lv, '37×4=148을 계산한 뒤 3.7×4를 왜 14.8로 써야 할까요?', '‘3.7은 37의 ~배이므로 곱도 148의 ~배인 ~이에요.’',
             '3.7은 37의 [1/10]배예요. 곱해지는 수가 [1/10]배가 되면 곱도 [1/10]배가 되므로 3.7×4는 148의 [1/10]배인 14.8이에요.')
    step(s, 3, '약속하기', '(소수)×(자연수) 계산 방법')
    a4 = blanks(s, lv, ['(소수)×(자연수)는 ', (['분수의 곱셈', '분수의 덧셈'], 0), '으로 나타내어 계산하거나 ', (['자연수의 곱셈', '소수의 뺄셈'], 0),
                        '을 이용하여 계산해요. 곱해지는 수가 [1/10]배가 되면 곱도 ', (['10배', '[1/10]배'], 1), '가 돼요.'])
    step(s, 4, '확인하기', '세로셈으로 계산하기')
    if lv == '기본형':
        s.text(BASIC_TIP)
    a5 = vert_fig(s, [('2.7', '3'), ('6.3', '5')])
    a5 += sent(s, [['0.7×6 =', Fb(7, 10), '×6 =', Fb(42, 10), '=', N('4.2', '0.7×6')],
                   ('q', '수빈이네 모둠은 실험이 끝나고 비커 5개를 씻는 데 비커 한 개에 물을 1.3 L씩 썼어요.'),
                   ['쓴 물은 모두', N('6.5', '1.3×5'), 'L예요.']])
    ans = '2차시  ① %s / %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), r1, J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수직선에서 뛰어 세기')
        s.text('수직선에서 0.4씩 7번 뛰어 세어 0.4×7을 구해 보세요.')
        jump_fig(s, '3', '0.1', '0.4', 0)
        a6 = sent(s, [['0.4씩', N('7'), '번 뛰어 세면', N('2.8', '0.4×7'), '이므로 0.4×7 =', N('2.8', '0.4×7')],
                      ['24×3 = 72이므로 2.4×3 =', N('7.2', '2.4×3')],
                      ['한 변이 3.5 cm인 정오각형 모양 표지판의 둘레는', N('17.5', '3.5×5'), 'cm예요.']])
        ans += '  ⑥ %s' % J(a6)
    return ans


def st3(s, lv):
    head(s, 3, '개념 구축하기(O)', '강낭콩 줄기가 자라요 ― (소수 두 자리 수)×(자연수)', '(소수 두 자리 수)×(자연수)는 어떻게 계산할까요?',
         '서아의 강낭콩은 싹이 튼 뒤 하루에 0.32 cm씩 자랐어요. 4일 동안 자란 길이는 몇 cm일까요?')
    step(s, 0, '만져 보기', '하루에 0.32 cm씩')
    s.text('하루에 0.32만큼인 수 모형 묶음을 4개 놓고, 같은 모형끼리 모아 세어 보세요.' + ('' if lv == '기본형' else ' 첫 번째 묶음처럼 나머지 묶음을 그려 보세요.'))
    blocks_fig(s, '0.32', 4, 4 if lv == '기본형' else 1)
    a1 = sent(s, [['4일 동안 자란 길이를 구하는 식은 0.32+0.32+0.32+0.32 또는', O(['0.32×4', '0.32+4', '0.32×2'], 0)],
                  ['0.32×4에서 0.1이 3×4 =', N('12', '3×4'), '(개)이므로', N('1.2', '0.1×12'), ', 0.01이 2×4 =', N('8', '2×4'), '(개)이므로', N('0.08', '0.01×8'), '이에요.'],
                  ['0.32×4 = 1.2+0.08 =', N('1.28', '0.32×4'), '　→ 서아의 강낭콩은 4일 동안', N('1.28'), 'cm 자랐어요.']])
    step(s, 1, '그려 보기', '2.45×4를 두 가지 방법으로')
    s.text('지호의 강낭콩은 덩굴손이 뻗기 시작하면서 하루에 2.45 cm씩 자랐어요. 4일 동안 자란 길이는 2.45×4 (cm)예요.')
    a2 = sent(s, [('g', '어림하기', [['2.45를 2.5로 어림하면 2.5×4 =', N('10', '2.5×4'), '이므로 2.45×4는', O(['10보다 조금 커요', '10보다 조금 작아요', '100쯤이에요'], 1)]]),
                  ('g', '방법 ① 분수의 곱셈으로', [['2.45×4 =', Fb(245, 100), '×4 = [245×4/100] =', Fb(980, 100), '=', N('9.8', '2.45×4')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['245', '4', '980'], ['2.45', '4', '9.80']], {'a': '1/100', 'p': '1/100'})] if lv == '기본형' else []) +
                   [['245×4 =', N('980', '245×4'), '. 2.45는 245의', O(['[1/10]배', '[1/100]배'], 1), '이므로 2.45×4는 980의 [1/100]배인', N('9.8', '2.45×4'), '이에요.']]),
                  ['9.80과 9.8은', O(['같은 수예요', '다른 수예요'], 0)]])
    assert ev('2.45×4') < 10
    step(s, 2, '말해 보기', '잘못된 계산 찾기')
    s.text('민준이가 강낭콩이 3일 동안 자란 길이 3.07×3을 다음과 같이 계산했어요.')
    a3 = sent(s, [('eqt', '민준이의 계산', '3.07×3 = [307/10]×3 = [921/10] = 92.1'),
                  ['잘못된 곳은', O(['3.07을 [307/10]로 나타낸 것', '307×3을 921로 계산한 것'], 0)],
                  ['3×3=9로 어림하면 92.1은', O(['너무 커요', '알맞아요'], 0)],
                  ['옳게 계산하면 3.07×3 =', Fb(307, 100), '×3 =', Fb(921, 100), '=', N('9.21', '3.07×3')],
                  ['[921/100]처럼 분모가 10, 100, 1000인 분수는', O(['약분하지 않고 그대로 두면 소수로 나타내기 편리해요', '꼭 기약분수로 고쳐야 해요'], 0)]])
    assert ev('307×3') == 921
    w3 = why(s, lv, '어림을 하면 잘못된 계산을 어떻게 찾을 수 있을까요?', '‘3.07을 ~로 어림하면 ~이므로 곱은 ~쯤이어야 하는데, 92.1은 ~.’',
             '3.07을 3으로 어림하면 3×3=9이므로 곱은 9쯤이어야 해요. 그런데 92.1은 9보다 훨씬 커서 소수점 위치가 잘못된 것을 알 수 있어요.')
    step(s, 3, '약속하기', '(소수 두 자리 수)×(자연수)')
    a4 = blanks(s, lv, ['(소수 두 자리 수)×(자연수)는 분모가 ', (['10', '100', '1000'], 1), '인 분수의 곱셈으로 나타내어 계산하거나, 자연수의 곱셈을 한 뒤 곱을 ',
                        (['[1/10]배', '[1/100]배'], 1), ' 하여 계산해요. 곱해지는 수가 [1/100]배가 되면 곱도 ', (['100배', '[1/100]배'], 1), '가 돼요.'])
    step(s, 4, '확인하기', '세로셈과 흙의 무게')
    if lv == '기본형':
        s.text(BASIC_TIP)
    a5 = vert_fig(s, [('1.38', '4'), ('7.06', '3')])
    a5 += sent(s, [['0.84×5 =', Fb(84, 100), '×5 =', Fb(420, 100), '=', N('4.2', '0.84×5')],
                   ('q', '작년 캠프에서는 강낭콩 모종에 흙을 1.35 kg 넣었고, 올해는 작년의 4배만큼 준비했어요.'),
                   ['올해 준비한 흙은', N('5.4', '1.35×4'), 'kg이에요.']])
    ans = '3차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수 카드 놀이')
        s.text('수 카드 3, 7, 5를 한 번씩 놓아 곱이 가장 큰 (소수 두 자리 수)×(자연수)를 만들어 보세요.')
        a6 = [cards_task(s, ['3', '7', '5'], '0.□□×□', 'max')]
        assert a6[0] == '0.53×7=3.71'
        a6 += sent(s, [['0.46×7', O(['>', '=', '<'], 2), '0.58×6'],
                       ['민준이가 강낭콩에 하루에 0.65 L씩 5일 동안 물을 주면 모두', N('3.25', '0.65×5'), 'L예요.']])
        assert ev('0.46×7') < ev('0.58×6')
        challenge_why(s, '카드를 어떻게 놓았는지 까닭과 함께 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 가장 큰 수 7을 곱하는 수(자연수)로 놓고, 남은 수 중 큰 수 5를 소수 첫째 자리에 놓았어요.' % J(a6)
    return ans


def st4(s, lv):
    head(s, 4, '개념 구축하기(O)', '구리선을 잘라 회로를 만들어요 ― (자연수)×(소수 한 자리 수)', '(자연수)×(소수 한 자리 수)는 어떻게 계산할까요?',
         '민준이네 모둠은 꼬마전구에 불을 켜는 회로를 만들려고 구리선 3 m의 0.7배만큼 잘라 썼어요.')
    step(s, 0, '만져 보기', '구리선 3 m의 0.7배')
    rule_first(s, lv, '3 m의 0.7배는 3 m보다 길까요, 짧을까요? 어떻게 구할 수 있을까요?', '‘내 규칙: 0.7배는 1배보다 ~니까 3 m보다 ~. 3의 0.1배를 ~번 더해요.’')
    s.text('이중 수직선의 아래 0.7배인 곳을 찾아 사용한 구리선의 길이를 알아보세요. 아래 작은 눈금 한 칸은 0.1배예요.'
           + (' 0.7배인 곳에 점선을 그려 두었어요.' if lv == '기본형' else ' 0.7배인 곳에 표시해 보세요.'))
    double_fig(s, '3', 'm', '구리선 3 m', '1', '0.1', ['0.1', '0.5', '0.7'], '0.7', lv == '기본형')
    a1 = sent(s, [['사용한 구리선의 길이를 구하는 식은', O(['3×0.7', '3+0.7', '3−0.7'], 0)],
                  ['3의 1배는 3이므로 3의 0.1배는', N('0.3', '3×0.1'), '이에요.', '　3의 0.7배는 0.3×7 =', N('2.1', '3×0.7'), '이에요.'],
                  ['민준이네 모둠이 사용한 구리선은', N('2.1'), 'm예요. 3 m보다', O(['길어요', '짧아요'], 1), '.']])
    r1 = '실제 규칙: 0.7배는 1배보다 작으니까 3 m보다 짧아요. 3의 0.1배 0.3이 7개이므로 2.1 m예요.'
    step(s, 1, '그려 보기', '8×1.3을 두 가지 방법으로')
    s.text('태오네 모둠은 더 큰 회로를 만들려고 구리선 8 m의 1.3배만큼 준비했어요. 준비한 구리선은 8×1.3 (m)예요.')
    a2 = sent(s, [('g', '어림하기', [['1.3을 1로 어림하면 8×1 =', N('8', '8×1'), '이므로 8×1.3은', O(['8보다 조금 커요', '8보다 조금 작아요'], 0)]]),
                  ('g', '방법 ① 분수의 곱셈으로', [['8×1.3 = 8×', Fb(13, 10), '= [8×13/10] =', Fb(104, 10), '=', N('10.4', '8×1.3')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['8', '13', '104'], ['8', '1.3', '10.4']], {'b': '1/10', 'p': '1/10'})] if lv == '기본형' else []) +
                   [['8×13 =', N('104', '8×13'), '. 1.3은 13의 [1/10]배이므로 8×1.3은 104의', O(['10배', '[1/10]배'], 1), '인', N('10.4', '8×1.3'), '예요.']])])
    step(s, 2, '말해 보기', '곱셈을 하면 항상 커질까?')
    a3 = sent(s, [('g', '방법 ①', [['6×2.4 = 6×', Fb(24, 10), '= [6×24/10] =', Fb(144, 10), '=', N('14.4', '6×2.4')]]),
                  ('g', '방법 ②', [['6×24 =', N('144', '6×24'), '→ 6×2.4 =', N('14.4', '6×2.4')]]),
                  ['6에 1보다 큰 수 2.4를 곱하면 곱은 6보다', O(['커져요', '작아져요'], 0), '　3에 1보다 작은 수 0.7을 곱하면 곱은 3보다', O(['커져요', '작아져요'], 1)],
                  ['곱셈을 하면 곱은', O(['항상 커져요', '곱하는 수가 1보다 작으면 작아져요'], 1)]])
    w3 = why(s, lv, '왜 1보다 작은 수를 곱하면 곱이 곱해지는 수보다 작아질까요?', '‘1보다 작은 수만큼 곱하는 것은 전체보다 ~ 부분만 구하는 것이라서 ~.’',
             '1보다 작은 수를 곱하는 것은 전체(1배)보다 적은 부분만 구하는 것이에요. 3 m의 0.7배는 3 m를 10으로 똑같이 나눈 것 중 7개만이라서 3 m보다 짧아요.')
    step(s, 3, '약속하기', '(자연수)×(소수) 계산 방법')
    a4 = blanks(s, lv, ['(자연수)×(소수)는 ', (['분수의 곱셈', '분수의 덧셈'], 0), '으로 나타내어 계산하거나, 곱하는 수를 10배 한 자연수의 곱셈을 한 뒤 곱을 ', (['10배', '[1/10]배'], 1),
                        ' 해요. 1보다 작은 수를 곱하면 곱은 곱해지는 수보다 ', (['커져요', '작아져요'], 1), '.'])
    step(s, 4, '확인하기', '세로셈과 회로 실험 물')
    if lv == '기본형':
        s.text(BASIC_TIP + ' 40.0은 40과 같아요.')
    a5 = vert_fig(s, [('3', '4.7'), ('16', '2.5')])
    a5 += sent(s, [['9×0.8 = 9×', Fb(8, 10), '=', Fb(72, 10), '=', N('7.2', '9×0.8')],
                   ('q', '수빈이는 어제 소금 녹이기 실험에 물을 150 mL 썼고, 오늘은 어제의 1.2배만큼 썼어요.'),
                   ['오늘 쓴 물은', N('180', '150×1.2'), 'mL예요.']])
    ans = '4차시  ① %s / %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), r1, J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 곱이 가장 작은 식')
        s.text('수 카드 2, 5, 8을 한 번씩 놓아 곱이 가장 작은 (자연수)×(소수 한 자리 수)를 만들어 보세요.')
        a6 = [cards_task(s, ['2', '5', '8'], '□×□.□', 'min')]
        assert a6[0] == '2×5.8=11.6'
        a6 += sent(s, [['7×0.6, 4×1.2, 9×0.4 중 곱이 가장 작은 것은', O(['7×0.6', '4×1.2', '9×0.4'], 2)]])
        assert ev('9×0.4') < ev('7×0.6') < ev('4×1.2')
        challenge_why(s, '카드를 어떻게 놓았는지 까닭과 함께 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 가장 작은 수 2를 자연수로 놓고, 남은 수 중 작은 수 5를 일의 자리에 놓았어요.' % J(a6)
    return ans


def st5(s, lv):
    head(s, 5, '개념 구축하기(O)', '강낭콩 키를 견주어요 ― (자연수)×(소수 두 자리 수)', '(자연수)×(소수 두 자리 수)는 어떻게 계산할까요?',
         '지호의 강낭콩 키는 4 cm이고, 하윤이의 강낭콩 키는 지호 강낭콩 키의 1.75배예요.')
    step(s, 0, '만져 보기', '4 cm의 1.75배')
    s.text('이중 수직선의 아래 1.75배인 곳을 찾아 하윤이의 강낭콩 키를 알아보세요. 아래 작은 눈금 한 칸은 0.25배예요.'
           + (' 1.75배인 곳에 점선을 그려 두었어요.' if lv == '기본형' else ' 1.75배인 곳에 표시해 보세요.'))
    double_fig(s, '8', 'cm', '지호 강낭콩 키(4 cm)의 2배까지', '2', '0.25', ['0.25', '0.5', '1', '1.75'], '1.75', lv == '기본형', top_labels=[(4, '4 cm')])
    a1 = sent(s, [['하윤이의 강낭콩 키를 구하는 식은', O(['4×1.75', '4+1.75', '4×0.75'], 0)],
                  ['4의 1배는 4이므로 4의 0.25배는', N('1', '4×0.25'), '이에요.'],
                  ['4의 1.75배는 4의 0.25배가', N('7', '1.75÷0.25'), '개이므로', N('7', '4×1.75'), '이에요.'],
                  ['하윤이의 강낭콩 키는', N('7'), 'cm이고, 지호 강낭콩보다', O(['커요', '작아요'], 0), '.']])
    step(s, 1, '그려 보기', '6×1.35를 두 가지 방법으로')
    s.text('수빈이네 모둠은 강낭콩 덩굴이 타고 올라갈 끈을 6 m의 1.35배만큼 준비했어요. 준비한 끈은 6×1.35 (m)예요.')
    a2 = sent(s, [('g', '어림하기', [['1.35를 1.5로 어림하면 6×1.5 =', N('9', '6×1.5'), '이므로 6×1.35는', O(['9보다 조금 커요', '9보다 조금 작아요'], 1)]]),
                  ('g', '방법 ① 분수의 곱셈으로', [['6×1.35 = 6×', Fb(135, 100), '= [6×135/100] =', Fb(810, 100), '=', N('8.1', '6×1.35')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['6', '135', '810'], ['6', '1.35', '8.10']], {'b': '1/100', 'p': '1/100'})] if lv == '기본형' else []) +
                   [['6×135 =', N('810', '6×135'), '. 1.35는 135의 [1/100]배이므로 6×1.35는 810의', O(['[1/10]배', '[1/100]배'], 1), '인', N('8.1', '6×1.35'), '이에요.']])])
    step(s, 2, '말해 보기', '어림해서 견주기')
    s.text('서아와 민준이가 강낭콩에 영양액을 주었어요. 정확하게 계산하지 않고 어림해서 누가 더 많이 주었는지 알아보세요.')
    a3 = sent(s, [('talk', [('서아', '나는 영양액 50 mL의 0.92배만큼 주었어.'), ('민준', '나는 영양액 40 mL의 1.38배만큼 주었어.')]),
                  ['서아: 0.92를 1로 어림하면 50×1 =', N('50', '50×1'), '이에요. 0.92는 1보다 작으니 서아가 준 영양액은 50 mL보다', O(['많아요', '적어요'], 1)],
                  ['민준: 1.38을 1.5로 어림하면 40×1.5 =', N('60', '40×1.5'), '이므로 민준이가 준 영양액은 약 60 mL예요.'],
                  ['영양액을 더 많이 준 사람은', O(['서아', '민준'], 1)]])
    w3 = why(s, lv, '어떻게 어림했는지 친구에게 설명해 봐요.', '‘서아는 0.92를 ~로 어림해서 ~보다 적고, 민준이는 1.38을 ~로 어림해서 약 ~이에요.’',
             '서아는 50 mL에 1보다 작은 0.92를 곱했으니 50 mL보다 적게 주었어요. 민준이는 1.38을 1.5로 어림하면 40×1.5=60이니 약 60 mL예요. 그래서 민준이가 더 많이 주었어요.')
    step(s, 3, '약속하기', '(자연수)×(소수 두 자리 수)')
    a4 = blanks(s, lv, ['(자연수)×(소수 두 자리 수)는 분모가 ', (['10', '100', '1000'], 1), '인 분수의 곱셈으로 나타내어 계산하거나, 곱하는 수를 100배 한 자연수의 곱셈을 한 뒤 곱을 ',
                        (['[1/10]배', '[1/100]배'], 1), ' 해요. 곱해지는 수와 곱하는 수의 순서를 바꾸어도 곱은 ', (['같아요', '달라요'], 0), '.'])
    assert ev('6×1.35') == ev('1.35×6')
    step(s, 4, '확인하기', '세로셈과 영양액의 양')
    if lv == '기본형':
        s.text(BASIC_TIP)
    a5 = vert_fig(s, [('14', '2.05'), ('30', '1.08')])
    a5 += sent(s, [['9×0.36 = 9×', Fb(36, 100), '=', Fb(324, 100), '=', N('3.24', '9×0.36')],
                   ['서아가 준 영양액은 50×0.92 =', N('46', '50×0.92'), 'mL, 민준이가 준 영양액은 40×1.38 =', N('55.2', '40×1.38'), 'mL예요.'],
                   ['정확하게 계산해도 더 많이 준 사람은', O(['서아', '민준'], 1)]])
    ans = '5차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 어림해서 고르기')
        a6 = sent(s, [['곱이 8보다 작은 것을 모두 골라 보세요.', M(['9×0.85', '3×2.75', '7×1.16', '4×1.98'], [0, 3])],
                      ['서아의 강낭콩은 처음에 16 cm였는데, 3주 뒤에는 처음 키의 1.75배가 되었어요. 3주 뒤 키는', N('28', '16×1.75'), 'cm예요.']])
        assert ev('9×0.85') < 8 and ev('4×1.98') < 8 and ev('3×2.75') > 8 and ev('7×1.16') > 8
        challenge_why(s, '3×2.75가 8보다 큰지 작은지 어림으로 어떻게 알 수 있는지 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 3×2.75=8.25이고, 2.75를 2.7로 보아도 3×2.7=8.1이니 8보다 커요.' % J(a6)
        assert ev('3×2.7') > 8
    return ans


def st6(s, lv):
    head(s, 6, '개념 구축하기(O)', '모종판에 씨앗을 심어요 ― (소수 한 자리 수)×(소수 한 자리 수)', '(소수 한 자리 수)×(소수 한 자리 수)는 어떻게 계산할까요?',
         '하윤이네 모둠의 작은 모종판은 가로 0.7 m, 세로 0.4 m인 직사각형이에요.')
    step(s, 0, '만져 보기', '모종판의 넓이')
    rule_first(s, lv, '0.7×0.4의 곱은 0.7보다 클까요, 작을까요? 어떻게 구할 수 있을까요?', '‘내 규칙: 0.4는 1보다 ~니까 곱은 0.7보다 ~. 0.01인 칸이 ~개예요.’')
    s.text('한 변이 1 m인 정사각형 모눈에 모종판만큼 색칠해 넓이를 알아보세요. 모눈 한 칸의 가로와 세로는 0.1 m예요.' + (' 모종판만큼 색칠해 두었어요.' if lv == '기본형' else ''))
    area_fig(s, 7, 4, 'm', lv == '기본형', '#A9D8A2')
    a1 = sent(s, [['모종판의 넓이를 구하는 식은', O(['0.7×0.4', '0.7+0.4', '7×4'], 0), '　색칠한 칸은 7×4 =', N('28', '7×4'), '칸이에요.'],
                  ['모눈 한 칸은 0.01 m²이므로 0.7×0.4 = 0.01×', N('28'), '=', N('0.28', '0.7×0.4')],
                  ['모종판의 넓이는', N('0.28'), 'm²이고, 곱 0.28은 0.7과 0.4보다', O(['커요', '작아요'], 1), '.']])
    r1 = '실제 규칙: 0.4는 1보다 작으니까 곱은 0.7보다 작아요. 0.01 m²인 칸이 28칸이라 0.28이에요.'
    step(s, 1, '그려 보기', '2.6×1.8을 두 가지 방법으로')
    s.text('도윤이네 모둠은 가로 2.6 m, 세로 1.8 m인 직사각형 화단 자리를 만들었어요. 넓이는 2.6×1.8 (m²)예요.')
    a2 = sent(s, [('g', '어림하기', [['2.6을 2.5로, 1.8을 2로 어림하면 2.5×2 =', N('5', '2.5×2'), '이므로 화단의 넓이는 약 5 m²예요.']]),
                  ('g', '방법 ① 분수의 곱셈으로', [['2.6×1.8 =', Fb(26, 10), '×', Fb(18, 10), '= [26×18/100] =', Fb(468, 100), '=', N('4.68', '2.6×1.8')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['26', '18', '468'], ['2.6', '1.8', '4.68']], {'a': '1/10', 'b': '1/10', 'p': '1/100'})] if lv == '기본형' else []) +
                   [['26×18 =', N('468', '26×18'), '. 2.6과 1.8은 각각 26과 18의 [1/10]배이므로 2.6×1.8은 468의', O(['[1/10]배', '[1/100]배', '100배'], 1), '인', N('4.68', '2.6×1.8'), '이에요.']]),
                  ['어림한 5와 계산한 4.68은', O(['비슷해요', '많이 달라요'], 0)]])
    step(s, 2, '말해 보기', '왜 100분의 1배일까?')
    a3 = sent(s, [('g', '방법 ①', [['4.3×2.7 =', Fb(43, 10), '×', Fb(27, 10), '=', Fb(1161, 100), '=', N('11.61', '4.3×2.7')]]),
                  ('g', '방법 ②', [['43×27 =', N('1161', '43×27'), '→ 4.3×2.7 =', N('11.61', '4.3×2.7')]]),
                  ['4.3을 4로, 2.7을 3으로 어림하면 4×3 = 12이므로 11.61은', O(['알맞아요', '너무 작아요'], 0)]])
    w3 = why(s, lv, '43×27=1161을 계산한 뒤 4.3×2.7은 왜 100분의 1배를 할까요?', '‘4.3은 43의 ~배, 2.7은 27의 ~배이므로 곱은 1161의 ~배예요.’',
             '4.3은 43의 [1/10]배이고 2.7은 27의 [1/10]배예요. 곱해지는 수와 곱하는 수가 모두 [1/10]배가 되었으니 곱은 [1/10]배의 [1/10]배인 [1/100]배가 돼서 11.61이에요.')
    step(s, 3, '약속하기', '(소수)×(소수) 계산 방법')
    a4 = blanks(s, lv, ['(소수 한 자리 수)×(소수 한 자리 수)는 분모가 10인 두 분수의 ', (['곱셈', '덧셈'], 0), '으로 나타내어 계산하거나, 자연수의 곱셈을 한 뒤 곱을 ',
                        (['[1/10]배', '[1/100]배'], 1), ' 해요. 1보다 작은 두 소수의 곱은 두 수보다 ', (['커요', '작아요'], 1), '.'])
    step(s, 4, '확인하기', '세로셈과 어림')
    if lv == '기본형':
        s.text(BASIC_TIP + ' 1보다 작은 곱이면 소수점 앞 일의 자리에 0을 써요.')
    a5 = vert_fig(s, [('3.5', '0.7'), ('2.4', '5.6')])
    a5 += sent(s, [['0.6×0.9 =', Fb(6, 10), '×', Fb(9, 10), '=', Fb(54, 100), '=', N('0.54', '0.6×0.9')],
                   ['7.2×3.2를 어림하면 7×3=21쯤이므로 곱은', O(['2.304', '23.04', '230.4'], 1)]])
    assert ev('7.2×3.2') == Q('23.04')
    ans = '6차시  ① %s / %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), r1, J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 새 화단 만들기')
        s.text('한 변이 3.5 m인 정사각형 화단의 가로를 0.6배로 줄이고, 세로를 1.4배로 늘여 새 화단을 만들었어요.')
        a6 = sent(s, [['새 화단의 가로는', N('2.1', '3.5×0.6'), 'm, 세로는', N('4.9', '3.5×1.4'), 'm예요. 새 화단의 넓이는', N('10.29', '2.1×4.9'), 'm²예요.'],
                      ['0.8×6.5 < □에서 □ 안에 들어갈 수 있는 가장 작은 자연수는', N('6'), '이에요.']])
        assert ev('0.8×6.5') == Q('5.2')
        challenge_why(s, '새 화단은 처음 화단보다 넓어졌나요, 좁아졌나요? 까닭과 함께 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 처음 화단은 3.5×3.5=12.25 m²이고 새 화단은 10.29 m²라서 좁아졌어요.' % J(a6)
        assert ev('3.5×3.5') == Q('12.25')
    return ans


def st7(s, lv):
    head(s, 7, '개념 구축하기(O)', '소금물을 나누어 써요 ― (소수 두 자리 수)×(소수 한 자리 수)', '(소수 두 자리 수)×(소수 한 자리 수)는 어떻게 계산할까요?',
         '1모둠은 실험에 소금물을 0.35 L 썼고, 2모둠은 1모둠이 쓴 소금물의 0.6배만큼 썼어요.')
    step(s, 0, '만져 보기', '0.35 L의 0.6배')
    s.text('이중 수직선의 아래 0.6배인 곳을 찾아 2모둠이 쓴 소금물의 양을 알아보세요. 아래 작은 눈금 한 칸은 0.1배예요.'
           + (' 0.6배인 곳에 점선을 그려 두었어요.' if lv == '기본형' else ' 0.6배인 곳에 표시해 보세요.'))
    double_fig(s, '0.35', 'L', '1모둠이 쓴 소금물 0.35 L', '1', '0.1', ['0.1', '0.6'], '0.6', lv == '기본형')
    a1 = sent(s, [['2모둠이 쓴 소금물의 양을 구하는 식은', O(['0.35×0.6', '0.35+0.6', '0.35×6'], 0)],
                  ['0.35의 1배는 0.35이므로 0.35의 0.1배는', N('0.035', '0.35×0.1'), '예요.'],
                  ['0.35의 0.6배는 0.035가', N('6'), '개이므로', N('0.21', '0.35×0.6'), '이에요. → 2모둠이 쓴 소금물은', N('0.21'), 'L예요.']])
    w1 = why(s, lv, '0.35의 0.1배가 왜 0.035일까요?', '‘0.1배는 ~으로 똑같이 나눈 것 중 하나라서 0.35의 소수점이 ~으로 한 자리 옮겨져요.’',
             '0.1배는 10으로 똑같이 나눈 것 중 하나예요. 0.35를 10으로 똑같이 나누면 소수점이 왼쪽으로 한 자리 옮겨져 0.035가 돼요.')
    step(s, 1, '그려 보기', '3.24×2.5를 두 가지 방법으로')
    s.text('태오네 모둠은 큰 수조에 물을 받으려고 해요. 물통 하나에 물이 3.24 L 들어가는데, 물통 2.5개만큼 받았어요. 받은 물은 3.24×2.5 (L)예요.')
    a2 = sent(s, [('g', '어림하기', [['3.24를 3으로 어림하면 3×2.5 =', N('7.5', '3×2.5'), '이므로 3.24×2.5는', O(['7.5보다 조금 커요', '7.5보다 조금 작아요'], 0)]]),
                  ('g', '방법 ① 분수의 곱셈으로', [['3.24×2.5 =', Fb(324, 100), '×', Fb(25, 10), '= [324×25/1000] =', Fb(8100, 1000), '=', N('8.1', '3.24×2.5')]]),
                  ('g', '방법 ② 자연수의 곱셈으로',
                   ([rel([['324', '25', '8100'], ['3.24', '2.5', '8.100']], {'a': '1/100', 'b': '1/10', 'p': '1/1000'})] if lv == '기본형' else []) +
                   [['324×25 =', N('8100', '324×25'), '. 3.24는 324의 [1/100]배, 2.5는 25의 [1/10]배이므로 3.24×2.5는 8100의', O(['[1/100]배', '[1/1000]배'], 1), '인',
                     N('8.1', '3.24×2.5'), '이에요.']]),
                  ['8.100과 8.1은', O(['같은 수예요', '다른 수예요'], 0)]])
    step(s, 2, '말해 보기', '같은 점과 다른 점')
    s.text('6차시의 (소수 한 자리 수)×(소수 한 자리 수)와 오늘 배운 (소수 두 자리 수)×(소수 한 자리 수)를 견주어 보세요.')
    a3 = sent(s, [['2.6×1.8 = 4.68에서 곱의 소수점 아래 자리 수는 1+1 =', N('2', '1+1'), '(자리)예요.'],
                  ['127×34 =', N('4318', '127×34'), '이므로 1.27×3.4 =', N('4.318', '1.27×3.4')],
                  ['1.27×3.4에서 곱의 소수점 아래 자리 수는 2+1 =', N('3', '2+1'), '(자리)예요.']])
    assert ev('2.6×1.8') == Q('4.68')
    w3 = why(s, lv, '두 계산의 같은 점과 다른 점을 써 봐요.', '‘같은 점은 ~하는 것이고, 다른 점은 곱을 ~배와 ~배 하는 것이에요.’',
             '같은 점은 두 경우 모두 자연수의 곱셈을 한 뒤 곱의 소수점을 찍는 것이에요. 다른 점은 소수 한 자리 수끼리는 곱을 [1/100]배 해서 소수 두 자리 수가 되고, 소수 두 자리 수와 소수 한 자리 수의 곱은 [1/1000]배 해서 소수 세 자리 수가 되는 것이에요.')
    step(s, 3, '약속하기', '(소수 두 자리 수)×(소수 한 자리 수)')
    a4 = blanks(s, lv, ['(소수 두 자리 수)×(소수 한 자리 수)는 분모가 100과 10인 분수의 곱셈으로 나타내어 계산하거나, 자연수의 곱셈을 한 뒤 곱을 ', (['[1/100]배', '[1/1000]배'], 1),
                        ' 해요. 곱의 소수점 아래 자리 수는 2+1 = ', (['2', '3'], 1), '(자리)예요.'])
    step(s, 4, '확인하기', '세로셈으로 계산하기')
    if lv == '기본형':
        s.text(BASIC_TIP)
    a5 = vert_fig(s, [('2.18', '0.6'), ('1.36', '2.4')])
    a5 += sent(s, [['0.45×0.3 =', Fb(45, 100), '×', Fb(3, 10), '=', Fb(135, 1000), '=', N('0.135', '0.45×0.3')]])
    ans = '7차시  ① %s / %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), w1, J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 계산하고 문제 만들기')
        a6 = sent(s, [['6.25×1.6 =', N('10', '6.25×1.6')]])
        assert ev('625×16') == 10000
        w6 = write(s, lv, '6.25×1.6에 알맞은 캠프 문제를 만들어 써 봐요.', '‘~는 6.25 ~이고, ~는 그 1.6배예요. ~는 몇 ~일까요?’',
                   '캠프 화단의 가로는 6.25 m이고 세로는 1.6 m예요. 화단의 넓이는 몇 m²일까요? (답: 6.25×1.6=10, 10 m²)')
        ans += '  ⑥ %s / %s' % (J(a6), w6)
    return ans


def st8(s, lv):
    head(s, 8, '개념 구축하기(O)', '돋보기와 지도 ― 곱의 소수점 위치', '곱의 소수점 위치는 어떻게 달라질까요?',
         '지호는 지름이 0.36 mm인 물방울을 돋보기와 현미경으로 10배, 100배, 1000배로 확대해 보았어요. 도윤이는 길이가 425 m인 캠프장 산책로를 지도에 0.1배, 0.01배, 0.001배로 줄여 그려 보았어요.')
    step(s, 0, '만져 보기', '확대하고 줄이기')
    rule_first(s, lv, '소수에 10, 100, 1000을 곱하거나 자연수에 0.1, 0.01, 0.001을 곱하면 곱의 소수점은 어떻게 옮겨질까요?',
               '‘내 규칙: 10, 100, 1000을 곱하면 소수점이 ~으로, 0.1, 0.01, 0.001을 곱하면 ~으로 옮겨져요.’')
    s.text('곱을 써 보고 곱의 소수점이 어떻게 움직이는지 살펴보세요.')
    rows, a1 = [['가 · 물방울 확대', '곱', '나 · 산책로 지도', '곱']], []
    for f1, f2 in zip(['1', '10', '100', '1000'], ['1', '0.1', '0.01', '0.001']):
        rows.append(['0.36 × %s' % f1, '0.36' if f1 == '1' else '', '425 × %s' % f2, '425' if f2 == '1' else ''])
        a1.append('0.36×%s=%s' % (f1, X('0.36×' + f1)))
        a1.append('425×%s=%s' % (f2, X('425×' + f2)))
    s.table(rows, row_h=2300)
    a1 += sent(s, [['가: 곱하는 수가 10배, 100배, 1000배가 될수록 곱의 소수점이', O(['오른쪽으로', '왼쪽으로'], 0), '한 자리씩 옮겨져요.'],
                   ['나: 곱하는 수가 [1/10]배, [1/100]배, [1/1000]배가 될수록 곱의 소수점이', O(['오른쪽으로', '왼쪽으로'], 1), '한 자리씩 옮겨져요.'],
                   ['물방울을 1000배로 확대하면 지름이', N('360', '0.36×1000'), 'mm인 것처럼 보여요.　산책로를 0.001배로 줄이면 지도에서', N('0.425', '425×0.001'), 'm예요.']])
    r1 = '실제 규칙: 10, 100, 1000을 곱하면 0의 개수만큼 오른쪽으로, 0.1, 0.01, 0.001을 곱하면 소수점 아래 자리 수만큼 왼쪽으로 옮겨져요.'
    step(s, 1, '그려 보기', '분수의 곱셈으로 살펴보기')
    if lv == '기본형':
        s.text('자연수는 분모가 1인 분수로 나타낼 수 있어요. 분모가 1000이면 소수 세 자리 수예요.')
    a2 = sent(s, [['7×6 = [7/1]×[6/1] =', N('42', '7×6')],
                  ['0.7×6 =', Fb(7, 10), '×[6/1] =', Fb(42, 10), '=', N('4.2', '0.7×6')],
                  ['0.7×0.6 = [7/10]×[6/10] =', Fb(42, 100), '=', N('0.42', '0.7×0.6')],
                  ['0.07×0.6 =', Fb(7, 100), '×[6/10] =', Fb(42, 1000), '=', N('0.042', '0.07×0.6')],
                  ['두 수의 소수점 아래 자리 수를', O(['더한', '곱한'], 0), '만큼 곱의 소수점 아래 자리 수가 정해져요.']])
    step(s, 2, '말해 보기', '보기를 이용해 소수점 찍기')
    a3 = point_fig(s, ['4.3×27', '4.3×2.7', '4.3×0.27', '0.43×0.27'], sample='보기  43 × 27 = 1161')
    assert ev('43×27') == 1161
    w3 = why(s, lv, '4.3×0.27의 곱의 소수점은 어디에 찍어야 할까요? 까닭을 써 봐요.', '‘4.3은 소수 ~자리, 0.27은 소수 ~자리라서 곱은 ~자리 소수예요.’',
             '4.3은 소수 한 자리 수, 0.27은 소수 두 자리 수라서 곱은 1+2=3(자리) 소수예요. 1161에서 소수점을 왼쪽으로 세 자리 옮겨 1.161이에요.')
    step(s, 3, '약속하기', '곱의 소수점 위치')
    a4 = blanks(s, lv, ['소수에 10, 100, 1000을 곱하면 곱하는 수의 0의 개수만큼 곱의 소수점이 ', (['오른쪽', '왼쪽'], 0), '으로 옮겨지고, 자연수에 0.1, 0.01, 0.001을 곱하면 곱하는 수의 소수점 아래 자리 수만큼 곱의 소수점이 ',
                        (['오른쪽', '왼쪽'], 1), '으로 옮겨져요. 소수끼리 곱할 때 곱의 소수점 아래 자리 수는 두 수의 소수점 아래 자리 수를 ', (['더한', '곱한'], 0), ' 것과 같아요.'])
    step(s, 4, '확인하기', '규칙으로 계산하기')
    a5 = sent(s, [['2.47×10 =', N('24.7', '2.47×10'), ', 2.47×100 =', N('247', '2.47×100'), ', 2.47×1000 =', N('2470', '2.47×1000')],
                  ['386×0.1 =', N('38.6', '386×0.1'), ', 386×0.01 =', N('3.86', '386×0.01'), ', 386×0.001 =', N('0.386', '386×0.001')],
                  ['곱이 다른 하나는', O(['36×0.25', '3.6×2.5', '0.36×2.5'], 2)]])
    assert ev('36×0.25') == ev('3.6×2.5') == 9 and ev('0.36×2.5') == Q('0.9')
    ans = '8차시  ① %s / %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), r1, J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 규칙으로 문제 해결하기')
        a6 = sent(s, [['도윤이가 계산기로 0.6×0.4를 계산하려다 한 수의 소수점을 잘못 눌러 0.024가 나왔어요. 도윤이가 누른 식은', O(['0.06×0.4', '6×0.4', '0.6×4'], 0)],
                      ['한 개에 2.35 g인 각설탕 10개는', N('23.5', '2.35×10'), 'g, 100개는', N('235', '2.35×100'), 'g, 1000개는', N('2350', '2.35×1000'), 'g이에요.'],
                      ['52×18 = 936을 이용하면 5.2×', N('0.18'), '= 0.936이고,', N('0.052'), '×1800 = 93.6이에요.']])
        assert ev('0.06×0.4') == Q('0.024') and ev('52×18') == 936 and ev('5.2×0.18') == Q('0.936') and ev('0.052×1800') == Q('93.6')
        challenge_why(s, '5.2×□=0.936에서 □를 어떻게 구했는지 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 0.936은 소수 세 자리 수이고 5.2는 소수 한 자리 수라서 □는 소수 두 자리 수인 0.18이에요.' % J(a6)
    return ans


def st9(s, lv):
    head(s, 9, '탐구 정리하기(O)', '캠프 탐구 보고서를 정리해요', '지금까지 배운 소수의 곱셈을 어떻게 정리할 수 있을까요?', '캠프에서 한 실험을 떠올리며 탐구 보고서를 정리해요.')
    step(s, 0, '만져 보기', '그림 모델 다시 보기')
    a1 = sent(s, [['비커: 0.6×3은', O(['0.1이 18개', '0.01이 18개'], 0), '이므로', N('1.8', '0.6×3')],
                  ['구리선: 3×0.7은 3의 0.1배인 0.3이', N('7'), '개이므로', N('2.1', '3×0.7')],
                  ['모종판: 0.7×0.4는 모눈 한 칸 0.01이', N('28', '7×4'), '개이므로', N('0.28', '0.7×0.4')],
                  ['소금물: 0.35×0.6은 0.35의 0.1배인 0.035가 6개이므로', N('0.21', '0.35×0.6')]])
    step(s, 1, '그려 보기', '확인하고 정리해요')
    a2 = sent(s, [('g', '(소수)×(자연수)', [['1.46×3 =', Fb(146, 100), '×3 =', Fb(438, 100), '=', N('4.38', '1.46×3')]]),
                  ('g', '(자연수)×(소수)', [['5×1.7 = 5×', Fb(17, 10), '=', Fb(85, 10), '=', N('8.5', '5×1.7')]]),
                  ('g', '(소수)×(소수)', [['1.45×1.6 =', Fb(145, 100), '×', Fb(16, 10), '=', Fb(2320, 1000), '=', N('2.32', '1.45×1.6')]]),
                  ('g', '곱의 소수점 위치', [['24×13 = 312이므로 2.4×1.3 =', N('3.12', '2.4×1.3'), ', 2.4×0.13 =', N('0.312', '2.4×0.13')]])])
    assert ev('24×13') == 312
    step(s, 2, '말해 보기', '친구의 생각 고치기')
    a3 = sent(s, [('talk', [('하윤', '2.3×4.6을 세로셈으로 계산했더니 105.8이 나왔어.'), ('민준', '곱셈을 하면 곱은 항상 곱해지는 수보다 커져.')]),
                  ['2.3×4.6을 2×5로 어림하면 약', N('10', '2×5'), '이므로 105.8은', O(['알맞아요', '소수점 위치가 틀렸어요'], 1)],
                  ['바르게 계산하면 2.3×4.6 =', N('10.58', '2.3×4.6'), '　민준이의 말은', O(['맞아요', '틀렸어요'], 1)]])
    w3 = why(s, lv, '민준이에게 곱셈을 해도 곱이 작아질 수 있다는 것을 예를 들어 설명해 봐요.', '‘예를 들어 ~×~=~인데, ~은 ~보다 작아요. 1보다 작은 수를 곱하면 ~.’',
             '예를 들어 구리선 3 m의 0.7배는 3×0.7=2.1(m)로 3 m보다 짧아요. 1보다 작은 수를 곱하면 곱이 곱해지는 수보다 작아져요.')
    step(s, 3, '약속하기', '소수의 곱셈 정리')
    a4 = blanks(s, lv, ['소수의 곱셈은 ', (['분수의 곱셈', '분수의 덧셈'], 0), '으로 나타내거나 ', (['자연수의 곱셈', '소수의 덧셈'], 0), '을 이용하여 계산해요. 곱해지는 수와 곱하는 수의 소수점을 옮긴 것만큼 곱의 소수점을 ',
                        (['옮겨요', '그대로 둬요'], 0), '. 계산하기 전에 ', (['어림', '반올림한 정답'], 0), '을 해 보면 소수점 위치가 맞는지 알 수 있어요.'])
    step(s, 4, '확인하기', '캠프 문제 해결하기')
    a5 = sent(s, [('talk', [('서아', '나는 정제수 2 L를 가지고 있어.'), ('지호', '나는 서아가 가진 정제수의 0.85배만큼 가지고 있어.'), ('하윤', '나는 서아가 가진 정제수의 1.05배만큼 가지고 있어.')]),
                  ['정제수를 가장 적게 가진 사람은', O(['서아', '지호', '하윤'], 1)],
                  ['가로 4.06 m, 세로 2 m인 직사각형 모종판 자리의 넓이는', N('8.12', '4.06×2'), 'm²예요.'],
                  ['실험용 정제수를 1 L에 2500원씩 3.6 L 사면', N('9000', '2500×3.6'), '원이에요.'],
                  ['5×2.45', O(['>', '=', '<'], 0), '7.2×1.6']])
    assert ev('2×0.85') < 2 < ev('2×1.05') and ev('5×2.45') > ev('7.2×1.6')
    ans = '9차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (J(a1), J(a2), J(a3), w3, J(a4), J(a5))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 세로셈으로 계산하기')
        s.text('곱의 소수점 아래 자리 수를 세고, 필요하면 소수점 앞에 0을 써요.')
        a6 = vert_fig(s, [('3.48', '2.6'), ('0.75', '0.08')])
        challenge_why(s, '0.75×0.08의 곱을 어떻게 정했는지 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 75×8=600이고 소수점 아래 자리 수가 2+2=4(자리)라서 0.0600=0.06이에요.' % J(a6)
    return ans


def st10(s, lv):
    head(s, 10, '발표하기(P)', '캠프 식단의 열량을 발표해요', '소수의 곱셈으로 캠프 식단의 열량을 구하고 알맞은 한 끼를 짤 수 있을까요?',
         '캠프 선생님은 한 끼 열량 목표를 600 킬로칼로리쯤으로 정했어요(음식의 열량은 이 이야기에서 정한 값이에요).')
    food_table(s, FOOD_ST)
    step(s, 0, '만져 보기', '도윤이의 저녁 식판')
    s.text('캠프 첫날 저녁, 도윤이는 카레라이스 0.8그릇, 삶은 옥수수 0.5개, 소시지 3개를 먹었어요.')
    a1, t1 = meal(s, lv, FOOD_ST, {0: '0.8', 1: '0.5', 2: '3'})
    assert t1 == '620.25'
    a1 += sent(s, [['캠프 한 끼 목표 600 킬로칼로리와 견주면 도윤이의 저녁은', O(['목표에 가까워 알맞아요', '목표보다 많이 모자라요'], 0)]])
    step(s, 1, '그려 보기', '서아의 아침 열량')
    s.text('캠프 둘째 날 아침, 서아는 참치 주먹밥 2개, 미역국 0.5그릇, 사과 0.4개를 먹었어요.')
    a2 = sent(s, [['참치 주먹밥 2개: 168.5×2 =', N('337', '168.5×2'), '킬로칼로리', '　미역국 0.5그릇: 64×0.5 =', N('32', '64×0.5'), '킬로칼로리'],
                  ['사과 0.4개: 95.5×0.4 =', N('38.2', '95.5×0.4'), '킬로칼로리', '　모두 더하면', N('407.2', '168.5×2+64×0.5+95.5×0.4'), '킬로칼로리'],
                  ['목표 600 킬로칼로리보다', O(['많이 모자라요', '많아요'], 0)],
                  ['우유 1.5컵을 더 마시면 125×1.5 =', N('187.5', '125×1.5'), '킬로칼로리가 늘어 모두', N('594.7', '407.2+187.5'), '킬로칼로리가 돼요.']])
    step(s, 2, '말해 보기', '어림으로 빨리 견주기')
    a3 = sent(s, [['카레라이스 486×0.8을 500×0.8로 어림하면', N('400', '500×0.8'), '　소시지 58.4×3을 60×3으로 어림하면', N('180', '60×3')],
                  ['삶은 옥수수 112.5×0.5를 100×0.5로 어림하면', N('50', '100×0.5'), '　도윤이의 저녁 열량은 약', O(['630', '400', '900'], 0), '킬로칼로리예요.']])
    assert ev('400+180+50') == 630
    w3 = why(s, lv, '식단을 짤 때 정확하게 계산하지 않고 어림해도 좋은 때는 언제일까요?', '‘~보다 많은지 적은지만 알아보면 될 때는 어림해도 돼요. 왜냐하면 ~.’',
             '한 끼 열량이 목표 600 킬로칼로리에 가까운지, 많이 모자라거나 넘치는지만 알아보면 될 때는 어림해도 돼요. 어림한 값으로도 빨리 견줄 수 있기 때문이에요.')
    step(s, 3, '약속하기', '우리 모둠 점심 식단 짜기')
    s.text('캠프 둘째 날 점심 식단을 짜 보세요. 음식을 두 가지 이상 고르고 양을 정한 뒤, 열량의 합이 550~650 킬로칼로리가 되게 해요.'
           + (' 예를 들어 카레라이스 1그릇과 우유 1컵으로 시작해 보세요.' if lv == '기본형' else ''))
    s.table([['음식', '먹을 양', '계산 식', '열량(킬로칼로리)']] + [['', '', '', ''] for _ in range(4)] + [['합계', '', '', '']], col_mm=[40, 30, 62, 48], row_h=2300)
    ex = X('486×1+125×1')
    assert Q(550) <= Q(ex) <= Q(650)
    step(s, 4, '확인하기', '식단 발표하기')
    w5a = write(s, lv, '내가 짠 점심 식단과 열량의 합을 발표 문장으로 써요.', '‘저는 ~와 ~를 골랐어요. ~×~=~이므로 모두 ~ 킬로칼로리예요.’',
                '저는 카레라이스 1그릇과 우유 1컵을 골랐어요. 486×1=486, 125×1=125이므로 모두 611 킬로칼로리예요. 목표 600 킬로칼로리에 가까워요.')
    w5b = write(s, lv, '식단을 짤 때 소수의 곱셈이 어떻게 쓰였나요?', '‘음식 1~의 열량에 먹은 양 ~을 곱해서 ~을 구했어요.’',
                '음식 1그릇(1개)의 열량에 먹은 양을 곱해서 먹은 음식의 열량을 구했어요. 카레라이스 0.8그릇은 486×0.8=388.8 (킬로칼로리)처럼 소수의 곱셈으로 구했어요.')
    assert ev('486×0.8') == Q('388.8')
    ans = '10차시  ① %s  ② %s  ③ %s / %s  ④ (예) 카레라이스 1그릇+우유 1컵 = 486+125 = %s 킬로칼로리 (550~650이면 맞아요)  ⑤ %s / %s' % (
        J(a1), J(a2), J(a3), w3, ex, w5a, w5b)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 열량 견주기')
        a6 = sent(s, [['삶은 옥수수 0.5개와 사과 0.6개의 열량을 견주면 112.5×0.5', O(['>', '=', '<'], 2), '95.5×0.6'],
                      ['카레라이스 1.5그릇의 열량은', N('729', '486×1.5'), '킬로칼로리예요.']])
        assert ev('112.5×0.5') == Q('56.25') < ev('95.5×0.6') == Q('57.3')
        challenge_why(s, '112.5×0.5와 95.5×0.6의 크기를 어떻게 견주었는지 써 보세요.', 1)
        ans += '  ⑥ %s / 왜: 예) 112.5×0.5=56.25, 95.5×0.6=57.3이므로 56.25 < 57.3이에요.' % J(a6)
    return ans


def st11(s, lv):
    head(s, 11, '발표하기(P)', '캠프 마지막 밤 놀이 한마당', '소수의 곱셈을 정확하게 계산하며 놀이를 즐기고, 배운 것을 되돌아볼까요?',
         '캠프 마지막 밤, 운동장 놀이판에서 땅따먹기 놀이를 해요.')
    step(s, 0, '만져 보기', '놀이 방법 알기')
    s.fill(['① 두 사람이 서로 다른 색을 고르고 순서를 정해요.', '② 자기 차례에 바둑돌을 출발선에 놓고 튕겨요.', '③ 바둑돌이 도착한 칸의 식을 계산해요.',
            '④ 다른 사람이 계산기로 확인해서 곱이 맞으면 땅을 색칠해요.', '⑤ 한 사람에 10번씩 해요.',
            '⑥ 칸 수와 연속 칸으로 점수를 세요. 색칠한 칸마다 1점, 가로나 세로로 2칸 연속이면 2점, 3칸이면 5점, 4칸 이상이면 7점을 더 얻어요.'])
    a1 = chooses(s, [('땅을 색칠할 수 있는 경우를 모두 골라 보세요.', ['도착한 칸의 곱을 맞게 계산했을 때', '보너스 칸에 들어갔을 때', '웅덩이에 들어갔을 때',
                                                       '놀이판 밖으로 넘어갔을 때', '이미 색칠된 땅에 들어갔을 때'], [0, 1])])
    a1 += chooses(s, [('가로로 3칸을 연속으로 색칠하면 추가 점수는?', ['2점', '5점', '7점'], 1)])
    step(s, 1, '그려 보기', '놀이판 식 미리 계산하기')
    if lv == '기본형':
        s.text('어림해서 곱의 소수점 위치가 알맞은지도 확인해요. 0.9×0.08은 9×8=72에서 소수점 아래 자리 수가 1+2=3(자리)예요.')
    a2 = sent(s, [['3.5×2.4 =', N('8.4', '3.5×2.4'), '　　0.16×5 =', N('0.8', '0.16×5'), '　　25×0.4 =', N('10', '25×0.4')],
                  ['0.9×0.08 =', N('0.072', '0.9×0.08'), '　　4.8×1.25 =', N('6', '4.8×1.25')]])
    step(s, 2, '말해 보기', '점수 세기')
    s.text('옆 반 친구들이 놀이를 끝낸 판이에요. 연두와 주황이 얻은 점수를 세어 보세요(한 칸이 가로·세로 묶음에 함께 들어가도 돼요).')
    a3 = score_sheet(s, ['OOG.G', 'G.GO.', 'GPGO.', '.O.OO'], '웅덩이', three=True)
    step(s, 3, '약속하기', '땅따먹기 놀이')
    a4 = land_sheet(s, lv, BOARD_ST, '웅덩이')
    step(s, 4, '확인하기', '캠프 탐구 되돌아보기')
    s.text('1차시에 쓴 ‘궁금해요’를 다시 떠올리며 캠프 탐구를 되돌아보세요.')
    w1 = write(s, lv, '1차시에 궁금했던 것 중 하나를 골라, 이제는 어떻게 답할 수 있는지 써 봐요.', '‘궁금했던 것: ~ → 이제는 ~라고 답할 수 있어요.’',
               '궁금했던 것: 0.8×0.6처럼 소수끼리 곱하면 곱의 소수점은 어디에 찍을까? → 이제는 8×6=48을 계산하고 소수점 아래 자리 수가 1+1=2(자리)라서 0.48이라고 답할 수 있어요.')
    w2 = write(s, lv, '캠프에서 한 탐구 중 가장 기억에 남는 소수의 곱셈과 계산 방법을 써 봐요.', '‘~ 탐구에서 ~×~을 ~ 방법으로 계산해 ~이 나왔어요.’',
               '모종판 탐구에서 0.7×0.4를 모눈 한 칸 0.01이 28개인 것으로 계산해 0.28 m²가 나왔어요.')
    step(s, 5, '또 다른 놀이', '카드 짝 맞추기')
    a6 = memory_sheet(s, MEM_ST)
    return '11차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s / %s  ⑥ %s' % (J(a1), J(a2), a3, a4, w1, w2, a6)


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10, tb11]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11]


def build_file(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 4. 소수의 곱셈(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u4-decmul.html과 차시 번호가 같습니다. 정답의 ‘84/10’은 분수 10분의 84를 뜻해요. '
                   '소수의 끝자리 0은 생략할 수 있어요(8.40 = 8.4). 글쓰기 칸의 ‘예)’는 예시 답이에요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build_file(TB, '5-2 수학 4. 소수의 곱셈(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build_file(ST, '5-2 수학 4. 소수의 곱셈(이야기 버전)', '이야기 버전', OUT_ST, lv))
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
