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
