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
