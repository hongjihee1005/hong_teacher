# -*- coding: utf-8 -*-
"""5-2 수학 2. 분수의 곱셈 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u2-fracmul.py

앱 원본 ../units/sem2/u2-fracmul.tb.js('한옥 마을의 하준이와 나은이', 11차시: 1·2·3·4·5·6~7·8·9·10·11)와
u2-fracmul.st.js('우리 반 전통 음식 장터', 11차시)의 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 똑같이 맞춥니다.
정답은 모두 이 스크립트가 분수(Fraction)로 계산해 확인합니다(assert).
분수 표기는 5-1 「분수의 덧셈과 뺄셈」 활동지(gen_u5-fracadd.py)의 방법을 그대로 옮겨 곱셈(×, 괄호)에 맞게 고쳤습니다.

분수 표기
  - 계산 식·빈칸은 그림(PNG)으로 넣어 분수를 위아래(분자/분모)로 씁니다. 빈칸은 네모, 답 칸은 큰 네모.
  - 글 속 분수는 읽는 말로 씁니다: [3/7] → '7분의 3', [2 1/4] → '2와 4분의 1'. 뒤 조사는 읽는 말의 끝(분자)에 맞춥니다.
  - 교사용 정답 쪽은 줄여서 '3/7', '2 1/4'(= 2와 4분의 1)로 씁니다.
그림(막대·수직선·넓이 모델·멍석·조각보)은 수에 맞는 비율로 SVG를 그려 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
"""
import json
import math
import os
import random
import re
import shutil
import subprocess
import sys
import tempfile
from fractions import Fraction
from itertools import permutations
from math import gcd
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '2단원_분수의곱셈_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧'
WORK = tempfile.mkdtemp(prefix='u2fmul_')
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
    """식 계산(앱 fx2Eval과 같음): '[1 1/5]×3', '[3/5]×[1/2]×[3/4]', '(3×1)+(3×[1/4])' — 괄호, × ÷ 를 + − 보다 먼저"""
    src = str(e).replace('−', '-')
    toks = re.findall(r'\[[^\]]+\]|\d+|[-+×÷*()]', src)
    assert ''.join(toks).replace(' ', '') == src.replace(' ', ''), ('식을 읽을 수 없어요', e)
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
            return F(t)
        assert t.isdigit(), (e, t)
        return Fraction(int(t))

    def term():
        v = atom()
        while peek() in ('×', '*', '÷'):
            op = take()
            w = atom()
            v = v * w if op != '÷' else v / w
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


PART = r'(이에요|예요|이므로|므로|이라서|라서|(?:으로|은|는|을|를|과|와|이|가|로)(?![가-힣]))?'   # 한 글자 조사는 뒤에 글자가 이어지면(이고·이나) 건드리지 않음
PAIRS = {'이에요': 0, '예요': 0, '이므로': 1, '므로': 1, '은': 2, '는': 2, '을': 3, '를': 3, '과': 4, '와': 4, '이': 5, '가': 5,
         '이라서': 6, '라서': 6}
FORMS = [('이에요', '예요'), ('이므로', '므로'), ('은', '는'), ('을', '를'), ('과', '와'), ('이', '가'), ('이라서', '라서')]


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
        if re.search(r'[+−\-×]', n):
            n = '(%s)' % n
        if re.search(r'[+−\-×]', d):
            d = '(%s)' % d
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
def cards_fig(s, cards, fs=36):
    out, x = [], 12
    for c in cards:
        w = eq_w(c, fs) + 36
        out.append('<rect x="%.1f" y="10" width="%.1f" height="120" rx="12" fill="#FFF8E6" stroke="%s" stroke-width="3"/>'
                   % (x, w, INK))
        eq_line(c, x + 18, 70, fs, out)
        x += w + 22
    put_png(s, svg_doc(int(x), 140, ''.join(out)), int(x), 140)




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
            vals = [ev(p) for p in full.split('=') if p.strip()]
            assert all(v == vals[0] for v in vals), ('식 확인 필요', full)
    if draw:
        eq_fig(s, rows)
    return ' / '.join(flat(e).strip() for e in logical)


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




# ================================================================ 곱셈 단원 조각
KO = '㉠㉡㉢㉣㉤'


def mixed(x):
    """기약분수 꼴(대분수·진분수·자연수) 글: '2 2/5', '3/4', '6'"""
    x = Fraction(x)
    return form(x, x.denominator)


def bk(x):
    """정답 표기: 기약 대분수(=가분수)"""
    x = Fraction(x)
    m = mixed(x)
    if x.denominator > 1 and x > 1:
        return '%s (=%d/%d)' % (m, x.numerator, x.denominator)
    return m


def step(s, i, label, sub=None):
    s.step('%s %s' % (NUM[i], rd(label)), rd(sub) if sub else None)


def note_line(s):
    s.text('※ 계산 식은 분수를 위아래로 썼어요. 글 속에서는 ‘7분의 3’, ‘2와 4분의 1’처럼 읽는 말로 썼어요. '
           '네모 칸에는 수를, 큰 네모 칸에는 답을 써요. 답은 약분하지 않은 분수나 가분수로 써도 맞아요.')


def head(s, no, soop, title, question, scene):
    s.lesson(no, soop, title, question)
    if scene:
        s.scene(None, rd(scene))


def unit_txt(it):
    """단위 붙이기: m·kg·L·cm처럼 기호는 띄어 쓰고, 개·명·컵·마리 같은 우리말 단위는 붙여 써요."""
    u = it.get('unit') or ''
    return (' ' + u if re.match(r'[A-Za-z]', u) else u) if u else ''


def calc(s, items, cols=2):
    """items: {e: 보이는 식(빈 답), x: 확인용 식, show: 그림에 보일 식(글), a: 분수 답 | n: 자연수 답, unit, q: 문제 글}
    정답 글 목록(번호 순). 모든 답을 분수로 다시 계산해 확인해요."""
    out, plain, k = [], [], 0
    for it in items:
        e = it.get('x') or it['e']
        v = Fraction(it['n']) if 'n' in it else F(it['a'])
        assert ev(e) == v, ('답 확인 필요', e, it.get('a', it.get('n')))
        it['_ans'] = bk(v) + unit_txt(it)
    plain = [it for it in items if not it.get('q')]
    if plain:
        cells = []
        for it in plain:
            cells.append('%s %s = ▢%s' % (NUM[k], it.get('show') or it['e'], unit_txt(it)))
            out.append(it['_ans'])
            k += 1
        cols = cols if max(eq_w(c, 34) for c in cells) < 1100 / cols - 30 else 1
        grid_fig(s, cells, cols)
    for it in items:
        if it.get('q'):
            s.ask('%s %s' % (NUM[k], rd(it['q'])), blank=False)
            shown = it.get('show') or it.get('e') or it['x']
            eq_fig(s, ['%s = ▢%s' % (shown, unit_txt(it))], indent=30)
            out.append(it['_ans'])
            k += 1
    return out


def pk(s, q, opts, a):
    """식으로 된 보기 고르기 → '㉠ 16×1/3'"""
    s.ask(rd(q), blank=False)
    cells = ['%s %s' % (KO[i], o) for i, o in enumerate(opts)]
    cols = len(cells) if max(eq_w(c, 34) for c in cells) < 1100 / len(cells) - 30 else 1
    grid_fig(s, cells, cols)
    s.ask('답: (        )', blank=False)
    return '%s %s' % (KO[a], flat(opts[a]))


def cmp(s, pairs):
    """크기 비교 ○ : pairs [(왼쪽 식, 오른쪽 식)] → 기호 목록(분수로 계산해 정함)"""
    rows, signs = [], []
    for i, (l, r) in enumerate(pairs):
        a, b = ev(l), ev(r)
        signs.append('>' if a > b else '<' if a < b else '=')
        rows.append('%s %s ○ %s' % (KO[i] if len(pairs) > 1 else '', l, r))
    s.text('○ 안에 >, =, < 를 알맞게 써요.')
    eq_fig(s, rows)
    return signs


def cmp3(s, a, b, c):
    """a ○ b ○ c (세 식) → 기호 두 개"""
    va, vb, vc = ev(a), ev(b), ev(c)
    sg = lambda x, y: '>' if x > y else '<' if x < y else '='
    s.text('○ 안에 >, =, < 를 알맞게 써요.')
    eq_fig(s, ['%s ○ %s ○ %s' % (a, b, c)])
    return [sg(va, vb), sg(vb, vc)]


def why_ans(s, lv, q, help1, ans, label='왜 그럴까요?'):
    why(s, lv, q, help1, label)
    return flat(ans)


def write_ans(s, lv, q, help1, ans):
    """앱 writeStep: 질문 + 쓰기 틀(기본형) / 쓰는 줄(도전형)"""
    s.ask(rd(q), blank=False)
    if lv == '기본형':
        s.fill(frame(help1))
    else:
        s.lines(2)
    return flat(ans)


def challenge_why(s, q, n=2):
    """도전형 '왜' 쓰기 줄"""
    s.ask(rd(q), blank=False)
    s.lines(n)


def vote_min(N):
    att = N // 2 + 1
    v = (att * 2) // 3 + 1
    assert Fraction(att) > Fraction(N, 2) and Fraction(att - 1) <= Fraction(N, 2)
    assert Fraction(v) > Fraction(att * 2, 3) and Fraction(v - 1) <= Fraction(att * 2, 3)
    return att, v


def vote_chain(s, N, who='명'):
    """참석 인원 → 찬성표 두 번 곱하기 (빈칸 식)"""
    att, v = vote_min(N)
    h1, h2 = Fraction(N, 2), Fraction(att * 2, 3)

    def fr(x, top):     # 곱의 꼴: 가분수 = 대분수(자연수면 자연수)
        if x.denominator == 1:
            return '{%d}' % x
        w, r = divmod(x.numerator, x.denominator)
        return '[{%d}/%d] = [{%d} {%d}/%d]' % (x.numerator, x.denominator, w, r, x.denominator)
    rows = ['%d×[1/2] = %s' % (N, fr(h1, 1)),
            '→ 회의에 최소 {%d}명이 참석해야 해요.' % att,
            '{%d}×[2/3] = %s' % (att, fr(h2, 1)),
            '→ 찬성표를 최소 {%d}표 받아야 해요.' % v]
    eq_fig(s, rows)
    assert ev('%d×[1/2]' % N) == h1 and ev('%d×[2/3]' % att) == h2
    return '%d×1/2 = %s → %d명, %d×2/3 = %s → %d표' % (N, mixed(h1), att, att, mixed(h2), v)


# ---------------------------------------------------------------- 수 카드로 식 만들기(앱 fx2Build)
COND = [('(진분수)×(자연수)', ['p', 'w']), ('(자연수)×(진분수)', ['w', 'p']), ('(대분수)×(자연수)', ['m', 'w']),
        ('(자연수)×(대분수)', ['w', 'm']), ('(진분수)×(진분수)', ['p', 'p'])]


def slots(shape):
    return sum(0 if isinstance(t, int) else {'p': 2, 'm': 3, 'w': 1}[t] for t in shape)


def shape_val(shape, vals):
    i, acc = 0, Fraction(1)
    for t in shape:
        if isinstance(t, int):
            v = Fraction(t)
        elif t == 'w':
            v = Fraction(vals[i]); i += 1
        elif t == 'p':
            n, d = vals[i], vals[i + 1]; i += 2
            if n >= d:
                return None
            v = Fraction(n, d)
        else:
            w, n, d = vals[i], vals[i + 1], vals[i + 2]; i += 3
            if n >= d:
                return None
            v = w + Fraction(n, d)
        acc *= v
    return acc


def shape_txt(shape, vals):
    i, out = 0, []
    for t in shape:
        if isinstance(t, int):
            out.append(str(t))
        elif t == 'w':
            out.append(str(vals[i])); i += 1
        elif t == 'p':
            out.append('[%d/%d]' % (vals[i], vals[i + 1])); i += 2
        else:
            out.append('[%d %d/%d]' % (vals[i], vals[i + 1], vals[i + 2])); i += 3
    return '×'.join(out)


def shape_blank(shape):
    return '×'.join(str(t) if isinstance(t, int) else {'w': '{}', 'p': '[{}/{}]', 'm': '[{} {}/{}]'}[t] for t in shape)


def best(shape, cards):
    b = None
    for perm in permutations(range(len(cards)), slots(shape)):
        vals = [cards[i] for i in perm]
        v = shape_val(shape, vals)
        if v is not None and (b is None or v > b[0]):
            b = (v, shape_txt(shape, vals))
    return b


def build(s, lv, cards, shape, goal, ex=None):
    """수 카드 그림 + 빈 식 틀. goal 'max' → 가장 큰 곱 정답 / 'any' → ex(예시 카드 차례)로 만든 예시 정답"""
    cards_fig(s, [str(c) for c in cards])
    eq_fig(s, [shape_blank(shape) + ' = ▢'])
    if goal == 'max':
        v, t = best(shape, cards)
        return '%s = %s' % (flat(t), bk(v))
    v = shape_val(shape, ex)
    assert v is not None and all(c in cards for c in ex) and len(set(ex)) == len(ex)
    return '(예) %s = %s (식에 따라 답이 달라요)' % (flat(shape_txt(shape, ex)), bk(v))


def game(s, lv, seed):
    """앱 fx2Game을 종이 놀이로: 정해 둔 5판(조건 카드·수 카드) 기록표. 정답: 판마다 가장 큰 곱"""
    rng = random.Random(seed)
    conds = COND[:]
    rng.shuffle(conds)
    rows, keys = [], []
    for i, (ct, shape) in enumerate(conds):
        cards = sorted(rng.sample(range(1, 10), slots(shape)))
        v, t = best(shape, cards)
        rows.append([str(i + 1), ct, ', '.join(map(str, cards)), '', '', ''])
        keys.append('%d판 %s = %s' % (i + 1, flat(t), mixed(v)))
    s.text('곱이 맞으면 1점, 그 카드로 만들 수 있는 가장 큰 곱이면 2점을 더 얻어요. 5판에서 3점 이상이면 통과예요.')
    if lv == '기본형':
        s.text('진분수는 분자가 분모보다 작아요. 대분수의 분수 부분도 진분수예요. 자연수와 분자는 크게, 분모는 작게 해 봐요.')
    s.table([['판', '조건 카드', '수 카드', '내가 만든 식', '곱', '점수']] + rows, col_mm=[12, 40, 26, 50, 30, 22], row_h=3000)
    return '가장 큰 곱 — ' + ', '.join(keys)


# ================================================================ 그림(수에 맞는 비율)
def _lab(name, x_end, cy, fs, out):
    """오른쪽 끝을 x_end에 맞춘 이름표(분수 가능)"""
    eq_line(name, x_end - eq_w(name, fs), cy, fs, out)


def pour_fig(s, d, amt, k, pre, unit=''):
    """앱 fx2Pour: 1을 d칸으로 나눈 막대(1마다 굵은 테두리)에 amt만큼씩 k번 담기. pre번까지는 색칠해 둠"""
    a = F(amt)
    per = a * d
    assert per.denominator == 1
    per = int(per)
    total = int(a * k * d)
    units = -(-total // d)
    uw = min(960 / units - 24, 330)
    out, x0, y = [], 20, 16
    for u in range(units):
        bx = x0 + u * (uw + 24)
        for c in range(d):
            idx = u * d + c
            p = idx // per
            fill = FILLS[p % 4] if (idx < total and p < pre) else '#fff'
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="60" fill="%s" stroke="%s" stroke-width="2"/>'
                       % (bx + c * uw / d, y, uw / d, fill, INK))
        out.append('<rect x="%.1f" y="%d" width="%.1f" height="60" fill="none" stroke="%s" stroke-width="3.5"/>' % (bx, y, uw, INK))
        out.append(T(bx + uw / 2, y + 86, '1' + (unit if unit.startswith(' ') or not unit else unit), 24, anchor='middle', fill='#555'))
    W, H = int(x0 + units * (uw + 24)), y + 110
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(170, W * .16))


def part_fig(s, N, d, n, name, pre, discrete=False, fine=False, whole=None, unit=''):
    """앱 fx2Part: 전체 N을 똑같이 d부분으로 나누기(pre면 나누는 점선을 그려 둠). whole이면 'N×1' 막대를 위에."""
    fs = 30
    names = [name] + ([whole] if whole else [])
    lab_w = max(eq_w(t, fs) for t in names) + 30
    out, y = [], 14
    x0 = 12 + lab_w
    if discrete:
        g = N // d
        assert g * d == N
        sz, gap, ggap = 44, 10, 26
        cy = y + 40
        _lab(name, x0 - 20, cy, fs, out)
        x = x0
        for j in range(d):
            gx = x
            for i in range(g):
                out.append('<rect x="%.1f" y="%.1f" width="%d" height="%d" rx="10" fill="#F3E3B8" stroke="%s" stroke-width="2.4"/>'
                           % (x, cy - sz / 2, sz, sz, INK))
                x += sz + gap
            if pre:
                out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%d" rx="12" fill="none" stroke="#B85A22" stroke-width="2.4" stroke-dasharray="8 6"/>'
                           % (gx - 7, cy - sz / 2 - 8, x - gap - gx + 14, sz + 16))
            x += ggap - gap
        W, H = int(x + 10), int(cy + sz / 2 + 22)
        put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(175, W * .16))
        return
    BW = 760
    rows = ([(whole, False)] if whole else []) + [(name, True)]
    for nm, div in rows:
        cy = y + 30
        _lab(nm, x0 - 20, cy, fs, out)
        out.append('<rect x="%d" y="%d" width="%d" height="56" fill="#fff" stroke="%s" stroke-width="3.5"/>' % (x0, cy - 28, BW, INK))
        if fine:
            for j in range(1, N * d):
                if j % d:
                    x = x0 + BW * j / (N * d)
                    out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#777" stroke-width="1.6"/>' % (x, cy + 12, x, cy + 28))
        for i in range(1, N):
            x = x0 + BW * i / N
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2.4"/>' % (x, cy + 4, x, cy + 28, INK))
        if div and pre:
            for j in range(1, d):
                x = x0 + BW * j / d
                out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#B85A22" stroke-width="3" stroke-dasharray="9 6"/>' % (x, cy - 28, x, cy + 28))
        for i in range(N + 1):
            x = x0 + BW * i / N
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2.4"/>' % (x, cy + 28, x, cy + 40, INK))
            out.append(T(x, cy + 58, str(i), 22, anchor='middle', fill='#555'))
        y += 108
    if unit:
        out.append(T(x0 + BW, y + 2, '(단위: %s)' % unit.strip(), 20, anchor='end', fill='#555'))
        y += 18
    W, H = int(x0 + BW + 20), int(y + 6)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


def jump_fig(s, mx, d, step_, k, pre):
    """앱 fx2Jump: 0~mx 수직선(작은 눈금 1/d). pre면 첫 번째 뛰기를 그려 둠"""
    PU = min(230, 1000 / mx)
    x0, y = 40, 150
    out = ['<line x1="%d" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (x0 - 10, y, x0 + PU * mx + 14, y, INK)]
    for j in range(mx * d + 1):
        x = x0 + PU * j / d
        big = j % d == 0
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="%s"/>'
                   % (x, y - (14 if big else 8), x, y + (14 if big else 8), INK, 3 if big else 1.8))
        if big:
            out.append(T(x, y + 40, str(j // d), 28, anchor='middle'))
    st = F(step_)
    if pre:
        x1, x2 = x0, x0 + PU * float(st)
        out.append('<path d="M%.1f,%d Q%.1f,%d %.1f,%d" fill="none" stroke="#B85A22" stroke-width="3"/>' % (x1, y - 6, (x1 + x2) / 2, y - 110, x2, y - 6))
        out.append('<path d="M%.1f,%d l-12,-6 l2,13 z" fill="#B85A22"/>' % (x2, y - 6))
        lab = '[%s]' % step_
        eq_line(lab, (x1 + x2) / 2 - eq_w(lab, 26) / 2, y - 98, 26, out)
    W, H = int(x0 + PU * mx + 40), y + 64
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)


def area_fig(s, stages, whole, pre):
    """앱 fx2Area: 넓이가 1인 정사각형. 세로로 d1등분(선은 늘 그림), pre면 n1칸 색칠 + 가로 d2등분 점선(+ d3 잔 점선)"""
    S, x0, y0 = 440, 60, 70
    (_, d1, n1), (_, d2, n2) = stages[0][:3], stages[1][:3]
    d3 = stages[2][1] if len(stages) > 2 else 1
    out = [T(x0 + S / 2, 34, whole, 26, anchor='middle', fill='#444')]
    if pre:
        out.append('<rect x="%d" y="%d" width="%.1f" height="%d" fill="%s"/>' % (x0, y0, S * n1 / d1, S, FILLS[0]))
        for j in range(1, d2 * d3):
            yy = y0 + S * j / (d2 * d3)
            if j % d3 == 0:
                out.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#2B6FB8" stroke-width="2.6" stroke-dasharray="10 6"/>' % (x0, yy, x0 + S, yy))
            else:
                out.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#2B6FB8" stroke-width="1.6" stroke-dasharray="3 5"/>' % (x0, yy, x0 + S, yy))
    for i in range(1, d1):
        x = x0 + S * i / d1
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2.6"/>' % (x, y0, x, y0 + S, INK))
    out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="%s" stroke-width="4"/>' % (x0, y0, S, S, INK))
    out.append(T(x0 - 14, y0 + S / 2, '1', 26, anchor='end', fill='#555'))
    out.append(T(x0 + S / 2, y0 + S + 30, '1', 26, anchor='middle', fill='#555'))
    W, H = x0 + S + 40, y0 + S + 50
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=80)


def mat_fig(s, A, B, mode, pre, what='멍석'):
    """앱 fx2Mat: 가로 A m, 세로 B m인 직사각형(1 m = 260px, 비율 그대로)과 1 m² 점선 정사각형.
    mode 1(pre): 세로를 1 m와 나머지로 나눈 선 / mode 2(pre): 가로 1/den(A) m, 세로 1/den(B) m 칸"""
    P = 260
    a, b = F(A), F(B)
    W_, H_ = float(a) * P, float(b) * P
    fs = 26
    left = max(eq_w('세로 [%s] m' % B, fs), 120) + 40
    x0, y0 = left, 30
    out = ['<rect x="%.1f" y="%d" width="%.1f" height="%.1f" fill="#F7EBD3" stroke="%s" stroke-width="3.5"/>' % (x0, y0, W_, H_, INK)]
    if pre and mode == 1:
        out.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" fill="#CFE2F6"/>' % (x0, y0, W_, P))
        out.append('<rect x="%.1f" y="%d" width="%.1f" height="%.1f" fill="#FBE7A6"/>' % (x0, y0 + P, W_, H_ - P))
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (x0, y0 + P, x0 + W_, y0 + P, INK))
        eq_line('1 m', x0 + W_ + 14, y0 + P / 2, fs, out)
        eq_line('[%s] m' % (mixed(b - 1)), x0 + W_ + 14, y0 + P + (H_ - P) / 2, fs, out)
    if pre and mode == 2:
        da, db = a.denominator, b.denominator
        for j in range(1, int(a * da) + 1):
            x = x0 + P * j / da
            if x < x0 + W_ - 1:
                out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%.1f" stroke="#555" stroke-width="1.8"/>' % (x, y0, x, y0 + H_))
        for j in range(1, int(b * db) + 1):
            yy = y0 + P * j / db
            if yy < y0 + H_ - 1:
                out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#555" stroke-width="1.8"/>' % (x0, yy, x0 + W_, yy))
    out.append('<rect x="%.1f" y="%d" width="%.1f" height="%.1f" fill="none" stroke="%s" stroke-width="3.5"/>' % (x0, y0, W_, H_, INK))
    out.append('<rect x="%.1f" y="%d" width="%d" height="%d" fill="none" stroke="#D9822B" stroke-width="3.5" stroke-dasharray="12 8"/>' % (x0, y0, P, P))
    out.append('<rect x="%.1f" y="%d" width="64" height="30" rx="6" fill="#fff" stroke="#D9822B" stroke-width="1.5"/>' % (x0 + 8, y0 + 8))
    out.append(T(x0 + 40, y0 + 23, '1 m²', 22, anchor='middle', fill='#B85A22'))
    lab = '가로 [%s] m' % A
    eq_line(lab, x0 + W_ / 2 - eq_w(lab, fs) / 2, y0 + H_ + 38, fs, out)
    lab = '세로 [%s] m' % B
    eq_line(lab, x0 - 16 - eq_w(lab, fs), y0 + H_ / 2, fs, out)
    W = int(x0 + W_ + (120 if pre and mode == 1 else 30))
    H = int(y0 + H_ + 84)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=120)


def flag_fig(s):
    """태극기 틀: 가로 72 cm, 세로 = 가로의 2/3(48 cm), 태극 지름 = 세로의 1/2(24 cm) — 1 cm = 6px"""
    k = 6
    w, hh, dm = 72 * k, 48 * k, 24 * k
    assert Fraction(48) == 72 * Fraction(2, 3) and Fraction(24) == 48 * Fraction(1, 2)
    x, y = 130, 20
    cx, cy, r = x + w / 2, y + hh / 2, dm / 2
    out = ['<rect x="%d" y="%d" width="%d" height="%d" fill="#fff" stroke="%s" stroke-width="3"/>' % (x, y, w, hh, INK),
           '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="#3D6FC2"/>' % (cx, cy, r),
           # 태극(가로로 놓은 본보기): 위 빨강, 아래 파랑, 가운데 S자 경계
           '<path d="M%.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f A%.1f,%.1f 0 0 1 %.1f,%.1f A%.1f,%.1f 0 0 0 %.1f,%.1f Z" fill="#E05A5A"/>'
           % (cx - r, cy, r, r, cx + r, cy, r / 2, r / 2, cx, cy, r / 2, r / 2, cx - r, cy),
           '<circle cx="%.1f" cy="%.1f" r="%.1f" fill="none" stroke="%s" stroke-width="2"/>' % (cx, cy, r, INK)]
    # 지름 치수선(태극 위)
    yd = cy - r - 14
    out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#B85A22" stroke-width="2.4"/>' % (cx - r, yd, cx + r, yd))
    for xx in (cx - r, cx + r):
        out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#B85A22" stroke-width="2.4"/>' % (xx, yd - 8, xx, yd + 8))
    # 4괘: 막대는 대각선에 수직, 건(☰ 왼쪽 위)·곤(☷ 오른쪽 아래)·감(☵ 오른쪽 위)·리(☲ 왼쪽 아래)
    diag = math.degrees(math.atan2(hh, w))
    gua = {(0, 0): 'sss', (1, 1): 'bbb', (1, 0): 'bsb', (0, 1): 'sbs'}
    for (gxk, gyk), kind in gua.items():
        gx = x + (64 if gxk == 0 else w - 64)
        gy = y + (52 if gyk == 0 else hh - 52)
        ang = (diag if gxk == gyk else -diag) + 90
        bars = []
        for j, t in enumerate(kind):
            yy = -16 + j * 16
            if t == 's':
                bars.append('<rect x="-27" y="%.1f" width="54" height="10" fill="%s"/>' % (yy - 5, INK))
            else:
                bars.append('<rect x="-27" y="%.1f" width="24" height="10" fill="%s"/><rect x="3" y="%.1f" width="24" height="10" fill="%s"/>'
                            % (yy - 5, INK, yy - 5, INK))
        out.append('<g transform="translate(%.1f %.1f) rotate(%.1f)">%s</g>' % (gx, gy, ang, ''.join(bars)))
    out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.4"/>' % (x, y + hh + 22, x + w, y + hh + 22, INK))
    out.append(T(cx, y + hh + 48, '가로 72 cm', 24, anchor='middle'))
    out.append(T(x - 14, cy, '세로 ? cm', 24, anchor='end'))
    out.append(T(cx, cy - r - 36, '지름 ? cm', 22, anchor='middle', fill='#B85A22'))
    W, H = x + w + 30, y + hh + 64
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=95)


def banner_fig(s):
    """현수막: 가로 90 cm, 세로 = 가로의 2/5(36 cm), 글자 높이 = 세로의 3/4(27 cm) — 1 cm = 5px"""
    k = 5
    w, hh, th = 90 * k, 36 * k, 27 * k
    assert Fraction(36) == 90 * Fraction(2, 5) and Fraction(27) == 36 * Fraction(3, 4)
    x, y = 260, 20
    out = ['<rect x="%d" y="%d" width="%d" height="%d" rx="6" fill="#FFF1DE" stroke="%s" stroke-width="3"/>' % (x, y, w, hh, INK),
           '<rect x="%d" y="%.1f" width="%d" height="%d" fill="none" stroke="#2B6FB8" stroke-width="2.4" stroke-dasharray="8 6"/>'
           % (x + 30, y + (hh - th) / 2, w - 60, th),
           T(x + w / 2, y + hh / 2, '5학년 3반 전통 음식 장터', 30, anchor='middle', fill='#8A4A22'),
           '<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.4"/>' % (x, y + hh + 22, x + w, y + hh + 22, INK),
           T(x + w / 2, y + hh + 48, '가로 90 cm', 24, anchor='middle')]
    eq_line('세로 = 가로의 [2/5]', x - 14 - eq_w('세로 = 가로의 [2/5]', 22), y + hh / 2, 22, out)
    eq_line('글자 높이 = 세로의 [3/4]', x + w + 14, y + hh / 2, 22, out)
    W = int(x + w + 30 + eq_w('글자 높이 = 세로의 [3/4]', 22))
    H = y + hh + 64
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=170)


def seq_order(s, items, order):
    """앱 sequence: items 원래 차례, order = 바른 차례의 번호"""
    s.fill(['%s %s' % (KO[i], rd(t)) for i, t in enumerate(items)])
    s.ask('놀이 순서대로 기호를 써 보세요.   (      ) → (      ) → (      ) → (      ) → (      )', blank=False)
    return ' → '.join(KO[i] for i in order)


def wrong(s, tag, e):
    eq_fig(s, [(tag, e)])


# ================================================================ 교과서 차시 버전 (한옥 마을의 하준이와 나은이)
TB_SCENE = ('하준이는 외국에서 놀러 온 사촌 동생 나은이에게 우리나라 전통문화를 소개해 주려고 한복을 입고 한옥 마을에 왔어요. '
            '맷돌로 콩 갈기, 인절미 만들기, 전통 빗자루 만들기, 돌담길 걷기, 조각보 만들기, 멍석 만들기를 체험해요.')
RULE_PW = ['(진분수)×(자연수)는 분수의 분모는 ', (['그대로 쓰고', '자연수를 곱하고'], 0), ' 분자에 ', (['자연수를 곱하여', '자연수를 더하여'], 0),
           ' 계산합니다. 약분은 ', (['곱한 후에 해도 되고, 먼저 해도 돼요', '반드시 곱하기 전에 해야 해요'], 0), '.']
RULE_MW = ['(대분수)×(자연수)는 대분수를 ', (['자연수와 진분수의 합', '분자와 분모의 합'], 0), '으로 나타내어 계산하거나, 대분수를 ',
           (['가분수', '진분수'], 0), '로 나타내어 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산해요.']
RULE_WP = ['6의 [1/3]은 6의 [1/3]배와 같으므로 ', (['6×[1/3]', '6+[1/3]', '6−[1/3]'], 0), '로 나타내요. (자연수)×(진분수)는 분수의 분모는 ',
           (['그대로 쓰고', '자연수를 곱하고'], 0), ' 자연수와 ', (['분자를 곱하여', '분모를 곱하여'], 0), ' 계산합니다.']
RULE_WM = ['(자연수)×(대분수)는 대분수를 ', (['자연수와 진분수의 합', '분자와 분모의 합'], 0), '으로 나타내어 계산하거나, 대분수를 ',
           (['가분수', '진분수'], 0), '로 나타내어 분모는 그대로 쓰고 ', (['자연수와 분자를 곱하여', '자연수와 분모를 곱하여'], 0), ' 계산해요.']
RULE_PP = ['(진분수)×(진분수)는 분자는 ', (['분자끼리', '분모끼리'], 0), ', 분모는 ', (['분모끼리', '분자끼리'], 0),
           ' 곱하여 계산합니다. 분모끼리의 곱은 전체를 똑같이 나눈 ', (['칸 수', '빗금 친 칸 수'], 0), ', 분자끼리의 곱은 ',
           (['빗금 친 칸 수', '전체 칸 수'], 0), '예요.']
RULE_MM = ['(대분수)×(대분수)는 곱하는 대분수를 ', (['자연수와 진분수의 합', '두 분수의 차'], 0), '으로 나타내어 계산하거나 두 대분수를 ',
           (['가분수', '진분수'], 0), '로 나타내어 계산합니다. 약분은 대분수를 가분수로 ', (['바꾼 뒤에', '바꾸기 전에'], 0), ' 해요.']
RULE_BIG = ['곱이 더 큰 식을 만들려면 자연수끼리의 곱이나 분수의 분자끼리의 곱은 ', (['크게', '작게'], 0), ', 분모의 곱은 ', (['작게', '크게'], 0),
            ' 만들어요. 수 카드는 ', (['한 번씩만', '여러 번'], 0), ' 사용하고, ', (['조건에 맞는 식', '아무 식'], 0), '을 만들어야 해요.']
WHY_MIX = ['대분수를 가분수로 바꾸지 않고 대분수의 분모와 자연수를 약분했어요', '분모에도 자연수를 곱했어요']
WHY_MM = ['대분수를 가분수로 나타내지 않고 진분수 부분끼리 약분했어요', '분모끼리 더했어요']


def tb1(s, lv):
    head(s, 1, '개념 찾기(S)', '단원 도입 ― 한옥 마을에 가요', '우리 주변에서 분수의 곱셈을 이용할 수 있는 상황에는 무엇이 있을까요?', TB_SCENE)
    note_line(s)
    if lv == '기본형':
        step(s, 0, '살펴보기', '향유고래의 머리 길이')
        s.text(rd('바닷속을 헤엄치는 향유고래는 이빨을 가진 동물 중 가장 큰 동물이고, 머리 길이가 몸길이의 [1/3]만큼이나 된대요. '
                  '몸길이가 16 m라면 머리 길이는 몇 m일까요?'))
        a1 = [pk(s, '머리 길이를 구하는 식으로 알맞은 것은?', ['16×[1/3]', '16+[1/3]', '16−[1/3]'], 0)]
        a1 += chooses(s, [('머리 길이는 몸길이 16 m와 비교하면 어떨까요?', ['16 m보다 짧아요', '16 m보다 길어요', '16 m와 같아요'], 0)])
        assert ev('16×[1/3]') < 16
        step(s, 1, '이야기하기', '같은 수를 여러 번 더하기')
        s.text(rd('1인분에 물이 [1 1/2]컵 필요한 음식을 8인분 만들려고 해요. 분수의 곱셈은 분수의 덧셈과 어떤 관련이 있을까요?'))
        if lv == '기본형':
            s.text('같은 수를 여러 번 더하는 것은 곱셈으로 나타낼 수 있어요. 3+3+3+3 = 3×4처럼요.')
        a2 = blanks(s, lv, ['물 [1 1/2]컵을 8번 넣는 것은 [1 1/2]을 ', (['8번 더하는 것', '8로 나누는 것', '8에서 빼는 것'], 0), '과 같아요. 같은 수를 여러 번 더하는 것은 ',
                            (['곱셈', '뺄셈'], 0), '으로 나타낼 수 있으므로 ', (['[1 1/2]×8', '[1 1/2]+8', '[1 1/2]−8'], 0), '로 나타내요.'])
        step(s, 2, '떠올리기 ①', '분수만큼은 얼마인지')
        s.text(rd('인절미 12개의 [3/4]은 몇 개일까요? 12개를 똑같이 4부분으로 나누고 3부분을 색칠해 보세요.'
                  + (' 점선으로 4부분을 나누어 두었어요.' if lv == '기본형' else '')))
        part_fig(s, 12, 4, 3, '인절미 12개', lv == '기본형', discrete=True)
        a3 = calc(s, [{'q': '12의 [3/4]은 몇 개일까요?', 'x': '12×[3/4]', 'show': '12의 [3/4]', 'n': 9, 'unit': '개'}])
        step(s, 3, '떠올리기 ②', '대분수와 덧셈')
        if lv == '기본형':
            s.text(rd('[2 1/4]에서 2는 [8/4]이에요. 분모가 같은 분수의 덧셈은 분모는 그대로 쓰고 분자끼리 더해요.'))
        a4 = chain(s, ['[2 1/4] = [{9}/4]', '[13/5] = [{2} {3}/5]', '[2/7]+[3/7] = [{5}/7]', '[3/8]+[3/8]+[3/8] = [{9}/8] = [{1} {1}/8]'])
        step(s, 4, '확인하기', '약분 떠올리기')
        s.text('분수를 기약분수로 나타내 보세요.' + (' 분모와 분자를 최대공약수로 나누어요.' if lv == '기본형' else ''))
        a5 = chain(s, ['[6/8] = [{3}/{4}]', '[10/15] = [{2}/{3}]', '[12/18] = [{2}/{3}]'])
        for t in ('3/4', '2/3'):
            assert gcd(*map(int, t.split('/'))) == 1
        ans = '1차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), a3[0], a4, a5)
    else:  # 도전형
        step(s, 0, '살펴보기', '연못의 잉어')
        s.text(rd('한옥 마을 연못에 잉어가 24마리 있어요. 그중 [3/8]이 빨간 잉어예요. 빨간 잉어는 몇 마리일까요?'))
        a1 = [pk(s, '빨간 잉어의 수를 구하는 식으로 알맞은 것은?', ['24×[3/8]', '24+[3/8]', '24−[3/8]'], 0)]
        a1 += chooses(s, [('빨간 잉어의 수는 24마리와 비교하면 어떨까요?', ['24마리보다 적어요', '24마리보다 많아요', '24마리와 같아요'], 0)])
        a1 += calc(s, [{'q': '빨간 잉어는 몇 마리일까요?', 'e': '24×[3/8]', 'n': 9, 'unit': '마리'}])
        step(s, 1, '이야기하기', '같은 수를 여러 번 더하기')
        s.text(rd('떡을 한 사람에게 [2 1/3]개씩 나누어 주려고 해요. 6명에게 주려면 떡은 몇 개 필요할까요?'))
        a2 = blanks(s, lv, ['[2 1/3]개씩 6명에게 주는 것은 [2 1/3]을 ', (['6번 더하는 것', '6으로 나누는 것', '6에서 빼는 것'], 0), '과 같아요. 그래서 ',
                            (['[2 1/3]×6', '[2 1/3]+6', '[2 1/3]−6'], 0), '로 나타내고, 필요한 떡은 ', (['14개', '12개', '8개'], 0), '예요.'])
        assert ev('[2 1/3]×6') == 14
        step(s, 2, '떠올리기 ①', '분수만큼은 얼마인지')
        s.text(rd('인절미 20개의 [2/5]는 몇 개일까요? 20개를 똑같이 5부분으로 나누고 2부분을 색칠해 보세요.'))
        part_fig(s, 20, 5, 2, '인절미 20개', False, discrete=True)
        a3 = calc(s, [{'q': '20의 [2/5]는 몇 개일까요?', 'x': '20×[2/5]', 'show': '20의 [2/5]', 'n': 8, 'unit': '개'}])
        step(s, 3, '떠올리기 ②', '대분수와 덧셈')
        a4 = chain(s, ['[3 2/5] = [{17}/5]', '[23/6] = [{3} {5}/6]', '[4/9]+[7/9] = [{11}/9] = [{1} {2}/9]', '[5/6]+[5/6]+[5/6] = [{15}/6] = [{2} {3}/6]'])
        step(s, 4, '확인하기', '약분 떠올리기')
        s.text('분수를 기약분수로 나타내 보세요.')
        a5 = chain(s, ['[9/12] = [{3}/{4}]', '[14/21] = [{2}/{3}]', '[18/24] = [{3}/{4}]', '[16/40] = [{2}/{5}]'])
        ans = '1차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), a3[0], a4, a5)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '물은 모두 몇 컵?')
        a6 = calc(s, [{'q': '1인분에 물이 [1 1/2]컵 필요한 음식을 8인분 만들려면 물은 모두 몇 컵 필요할까요? [1 1/2]을 8번 더해서 구해 보세요.',
                       'e': '[1 1/2]×8', 'n': 12, 'unit': '컵'}])
        a6 += [pk(s, '[1/3]+[1/3]+[1/3]+[1/3]+[1/3]을 곱셈식으로 나타내면?', ['[1/3]×5', '[5/3]×5', '[1/15]'], 0)]
        assert ev('[1/3]+[1/3]+[1/3]+[1/3]+[1/3]') == ev('[1/3]×5')
        challenge_why(s, '곱셈을 하면 항상 처음 수보다 커질까요? 향유고래의 머리 길이를 보고 생각을 써 보세요.')
        ans += '  ⑥ %s / 왜: 예) 아니에요. 16에 1보다 작은 1/3을 곱하면 16보다 작은 16/3이 돼요.' % ', '.join(a6)
    return ans


def tb2(s, lv):
    head(s, 2, '개념 구축하기(O)', '(진분수)×(자연수)를 알아볼까요', '(진분수)×(자연수)는 어떻게 계산할까요?',
         '하준이와 나은이는 맷돌로 콩을 갈아 두부를 만드는 체험장에 왔어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '맷돌에 물 넣기')
        s.text(rd('나은이는 같은 컵으로 물을 [1/4]컵씩 3번 넣었어요. ' +
                  ('첫 번째로 넣은 물을 색칠해 두었어요. 나머지 두 번을 다른 색으로 색칠해 보세요.' if lv == '기본형'
                   else '넣은 물을 막대에 색칠해 보세요.') + ' 막대 하나가 1컵이에요.'))
        pour_fig(s, 4, '1/4', 3, 1 if lv == '기본형' else 0, '컵')
        a1 = chain(s, ['[1/4]컵씩 3번 넣은 것은 [1/4]컵의 {3}배이므로 [1/4]×{3}으로 나타내요.', '[1/4]×3 = [1/4]+[1/4]+[1/4] = [{3}/4]'])
        step(s, 1, '그려 보기', '[3/5]×2를 그림으로')
        s.text(rd('막대에 [3/5]만큼씩 2번 색칠한 다음 계산해요. 막대 하나가 1이고 작은 칸 하나는 [1/5]이에요.'))
        pour_fig(s, 5, '3/5', 2, 1 if lv == '기본형' else 0)
        a2 = chain(s, ['[3/5]×2 = [3/5]+[3/5] = [3+{3}/5]', ('', '= [3×{2}/5] = [{6}/5] = [{1} {1}/5]')])
        step(s, 2, '말해 보기', '약분은 언제 할까?')
        s.text(rd('윤호와 예린이가 [3/10]×8을 서로 다른 방법으로 계산했어요. 예린이는 분모 10과 자연수 8을 (      )로 먼저 약분했어요.'))
        a3 = chain(s, [('윤호', '[3/10]×8 = [3×{8}/10] = [{24}/10] = [{12}/5] = [{2} {2}/5]'), ('예린', '[3/10]×8 = [3×{4}/{5}] = [{12}/5] = [{2} {2}/5]')])
        assert gcd(10, 8) == 2
        a3b = chooses(s, [('윤호는?', ['분자와 자연수를 곱한 후 약분했어요', '분모와 자연수를 먼저 약분했어요'], 0),
                          ('예린이는?', ['분자와 자연수를 곱한 후 약분했어요', '분모와 자연수를 먼저 약분했어요'], 1)])
        step(s, 3, '약속하기', '(진분수)×(자연수)')
        a4 = blanks(s, lv, RULE_PW)
        step(s, 4, '확인하기', '계산하기')
        if lv == '기본형':
            s.text('분모는 그대로 쓰고 분자에 자연수를 곱해요. 약분하지 않아도, 가분수로 써도 맞아요.')
        a5 = calc(s, [{'e': '[2/7]×2', 'a': '4/7'}, {'e': '[5/6]×4', 'a': '3 1/3'}, {'e': '[3/4]×8', 'n': 6},
                      {'q': '한 변의 길이가 [3/4] cm인 정육각형의 둘레는 몇 cm일까요?', 'e': '[3/4]×6', 'a': '4 1/2', 'unit': 'cm'}])
        ans = '2차시  ① %s (3/4컵)  ② %s  ③ 2 / %s, %s  ④ %s  ⑤ %s' % (a1, a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '맷돌에 물 넣기')
        s.text(rd('하준이는 같은 컵으로 물을 [2/7]컵씩 4번 넣었어요. 넣은 물을 막대에 색칠해 보세요. 막대 하나가 1컵이에요.'))
        pour_fig(s, 7, '2/7', 4, 0, '컵')
        a1 = chain(s, ['[2/7]컵씩 4번 넣은 것은 [2/7]컵의 {4}배이므로 [2/7]×{4}로 나타내요.', '[2/7]×4 = [2/7]+[2/7]+[2/7]+[2/7] = [{8}/7] = [{1} {1}/7]'])
        step(s, 1, '그려 보기', '[4/9]×3을 그림으로')
        s.text(rd('막대에 [4/9]만큼씩 3번 색칠한 다음 계산해요. 막대 하나가 1이에요.'))
        pour_fig(s, 9, '4/9', 3, 0)
        a2 = chain(s, ['[4/9]×3 = [4/9]+[4/9]+[4/9] = [4+4+{4}/9]', ('', '= [4×{3}/9] = [{12}/9] = [{1} {1}/3]')])
        step(s, 2, '말해 보기', '약분은 언제 할까?')
        s.text(rd('도현이와 소이가 [5/12]×9를 서로 다른 방법으로 계산했어요.'))
        a3 = chain(s, [('도현', '[5/12]×9 = [5×{9}/12] = [{45}/12] = [{15}/4] = [{3} {3}/4]'), ('소이', '[5/12]×9 = [5×{3}/{4}] = [{15}/4] = [{3} {3}/4]')])
        assert gcd(12, 9) == 3
        a3b = chooses(s, [('소이가 12와 9를 약분할 때 나눈 수는?', ['3', '9', '12'], 0), ('두 사람의 답은?', ['같아요', '달라요'], 0)])
        step(s, 3, '약속하기', '(진분수)×(자연수)')
        a4 = blanks(s, lv, ['[3/8]×5에서 분모 8은 ', (['그대로 써요', '5를 곱해요'], 0), '. 분자 3에는 ', (['5를 곱해요', '5를 더해요'], 0), '. 그래서 [3/8]×5 = ',
                            (['[15/8]', '[15/40]', '[8/8]'], 0), '이에요.'])
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'e': '[4/9]×5', 'a': '2 2/9'}, {'e': '[7/12]×8', 'a': '4 2/3'}, {'e': '[5/6]×18', 'n': 15},
                      {'q': '한 변의 길이가 [5/8] m인 정팔각형의 둘레는 몇 m일까요?', 'e': '[5/8]×8', 'n': 5, 'unit': 'm'}])
        ans = '2차시  ① %s (1 1/7컵)  ② %s  ③ %s, %s  ④ %s  ⑤ %s' % (a1, a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        a6 = calc(s, [{'e': '[5/6]×3', 'a': '2 1/2'}, {'e': '[2/9]×18', 'n': 4}, {'e': '[3/14]×7', 'a': '1 1/2'},
                      {'q': '연서는 한 묶음에 [11/20] m인 털실을 12묶음 샀어요. 연서가 산 털실은 모두 몇 m일까요?', 'e': '[11/20]×12', 'a': '6 3/5', 'unit': 'm'}])
        a6b = cmp(s, [('[3/10]×8', '[8/35]×7')])
        challenge_why(s, '[2/9]×18을 계산할 때 약분을 먼저 하면 어떤 점이 좋은지 써 보세요.')
        ans += '  ⑥ %s, %s (2 2/5 > 1 3/5) / 왜: 예) 9와 18을 9로 먼저 약분하면 2×2만 하면 되어 계산이 쉬워요.' % (', '.join(a6), a6b[0])
    return ans


def tb3(s, lv):
    head(s, 3, '개념 구축하기(O)', '(대분수)×(자연수)를 알아볼까요', '(대분수)×(자연수)는 어떻게 계산할까요?',
         '인절미 체험장이에요. 만든 떡에 콩고물을 묻혀 고소한 인절미를 만들어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '콩고물 모으기')
        s.text(rd('하준이는 한 봉지에 [1 1/5] kg인 콩고물을 3봉지 사용했어요. 막대 하나가 1 kg이고 작은 칸 하나는 [1/5] kg이에요.'))
        e1 = est(s, '사용한 콩고물은 몇 kg쯤일까요?', ['3 kg보다 조금 더 많아요', '3 kg보다 적어요', '6 kg쯤이에요'], 0)
        if lv == '기본형':
            s.text('첫 번째 봉지를 색칠해 두었어요. 나머지 두 봉지를 색칠하고 자연수끼리, 진분수끼리 모아 보세요.')
        pour_fig(s, 5, '1 1/5', 3, 1 if lv == '기본형' else 0, ' kg')
        a1 = chain(s, [('방법 1', '[1 1/5]×3 = (1+1+1)+([1/5]+[1/5]+[1/5])'), ('', '= (1×{3})+([1/5]×{3}) = {3}+[{3}/5] = [{3} {3}/5]')])
        step(s, 1, '그려 보기', '가분수로 뛰어 세기')
        s.text(rd('[1 1/5]을 가분수로 나타내면 [6/5]이에요. 수직선에서 [6/5]만큼씩 3번 뛰어 보세요.'
                  + (' 첫 번째 뛰기를 그려 두었어요.' if lv == '기본형' else '')))
        jump_fig(s, 4, 5, '6/5', 3, lv == '기본형')
        a2 = chain(s, [('방법 2', '[1 1/5]×3 = [{6}/5]×3 = [6×{3}/5] = [{18}/5] = [{3} {3}/5]')])
        step(s, 2, '말해 보기', '두 방법 비교하기')
        s.text(rd('주아와 수현이가 [2 2/9]×6을 대분수를 가분수로 바꾸어 계산했어요.'))
        a3 = chain(s, [('주아', '[2 2/9]×6 = [{20}/9]×6 = [20×{6}/9]'), ('', '= [{120}/9] = [{40}/3] = [{13} {1}/3]'),
                       ('수현', '[2 2/9]×6 = [20/9]×6 = [20×{2}/{3}] = [{40}/3] = [{13} {1}/3]')])
        a3b = chooses(s, [('수현이는?', ['가분수로 바꾼 뒤 분모와 자연수를 약분한 후 계산했어요', '대분수의 분모와 자연수를 바로 약분했어요'], 0),
                          ('대분수의 분모 9와 자연수 6을 바로 약분하면?', ['결과가 달라져요', '결과가 같아요'], 0)])
        assert ev('[2 2/9]×6') != ev('[2 2/3]×2')
        step(s, 3, '약속하기', '(대분수)×(자연수)')
        a4 = blanks(s, lv, RULE_MW)
        step(s, 4, '확인하기', '계산하기')
        if lv == '기본형':
            s.text('대분수를 가분수로 바꾼 다음 약분해요. 가분수로 써도, 대분수로 써도 맞아요.')
        a5 = calc(s, [{'e': '[1 1/7]×4', 'a': '4 4/7'}, {'e': '[2 5/6]×8', 'a': '22 2/3'}, {'e': '[1 3/10]×5', 'a': '6 1/2'},
                      {'q': '민지는 주말농장에서 감자를 [1 7/12] kg 캤어요. 어머니는 민지가 캔 감자의 4배를 캤어요. 어머니가 캔 감자는 몇 kg일까요?',
                       'e': '[1 7/12]×4', 'a': '6 1/3', 'unit': 'kg'}])
        ans = '3차시  ① %s / %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (e1, a1, a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '콩고물 모으기')
        s.text(rd('나은이는 한 봉지에 [1 3/8] kg인 콩고물을 4봉지 사용했어요. 막대 하나가 1 kg이에요.'))
        e1 = est(s, '사용한 콩고물은 몇 kg쯤일까요?', ['4 kg보다 많고 8 kg보다 적어요', '4 kg보다 적어요', '8 kg보다 많아요'], 0)
        pour_fig(s, 8, '1 3/8', 4, 0, ' kg')
        a1 = chain(s, [('방법 1', '[1 3/8]×4 = (1+1+1+1)+([3/8]+[3/8]+[3/8]+[3/8])'), ('', '= (1×{4})+([3/8]×{4}) = {4}+[{12}/8] = [{5} {4}/8]')])
        step(s, 1, '그려 보기', '가분수로 뛰어 세기')
        s.text(rd('이번에는 [2 1/4]×3이에요. [2 1/4]을 가분수로 나타내고, 수직선에서 그만큼씩 3번 뛰어 보세요.'))
        jump_fig(s, 7, 4, '9/4', 3, False)
        a2 = chain(s, [('방법 2', '[2 1/4]×3 = [{9}/4]×3 = [9×{3}/4] = [{27}/4] = [{6} {3}/4]')])
        step(s, 2, '말해 보기', '두 방법 비교하기')
        s.text(rd('서진이와 하람이가 [3 3/10]×4를 대분수를 가분수로 바꾸어 계산했어요.'))
        a3 = chain(s, [('서진', '[3 3/10]×4 = [{33}/10]×4 = [33×{4}/10]'), ('', '= [{132}/10] = [{66}/5] = [{13} {1}/5]'),
                       ('하람', '[3 3/10]×4 = [33/10]×4 = [33×{2}/{5}] = [{66}/5] = [{13} {1}/5]')])
        a3b = chooses(s, [('하람이는?', ['가분수로 바꾼 뒤 10과 4를 2로 약분했어요', '대분수의 분모 10과 4를 바로 약분했어요'], 0),
                          ('10과 4를 바로 약분해 [3 3/5]×2로 계산하면?', ['결과가 달라져요', '결과가 같아요'], 0)])
        assert ev('[3 3/5]×2') != ev('[3 3/10]×4')
        step(s, 3, '약속하기', '(대분수)×(자연수)')
        a4 = blanks(s, lv, ['[2 1/6]×3은 (2×3)+([1/6]×3)처럼 ', (['자연수 부분과 진분수 부분을 각각 곱해', '분모와 분자를 각각 곱해'], 0), ' 더할 수 있어요. 또는 [2 1/6]을 ',
                            (['[13/6]', '[3/6]', '[21/6]'], 0), '로 바꾸어 계산해요. 답은 ', (['[6 1/2]', '[6 1/6]', '[2 1/2]'], 0), '이에요.'])
        assert ev('[2 1/6]×3') == F('6 1/2')
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'e': '[1 2/9]×6', 'a': '7 1/3'}, {'e': '[3 3/4]×10', 'a': '37 1/2'}, {'e': '[2 4/15]×5', 'a': '11 1/3'},
                      {'q': '할머니는 한 시간에 [2 5/6] km를 걸어요. 같은 빠르기로 3시간 동안 걸으면 몇 km를 걸을까요?', 'e': '[2 5/6]×3', 'a': '8 1/2', 'unit': 'km'}])
        ans = '3차시  ① %s / %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (e1, a1, a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '잘못 고치기와 가장 큰 수·작은 수의 곱')
        s.text(rd('친구가 [1 7/10]×6을 잘못 계산했어요.'))
        wrong(s, '잘못된 계산', '[1 7/10]×6 = [1 7/5]×3 = [12/5]×3 = [36/5] = [7 1/5]')
        a6 = chooses(s, [('잘못된 까닭은?', WHY_MIX, 0)])
        a6b = chain(s, [('옳은 계산', '[1 7/10]×6 = [{17}/10]×6 = [17×{3}/5] = [{51}/5] = [{10} {1}/5]')])
        nums = ['7 3/4', '12', '8', '3 5/6']
        lo, hi = min(nums, key=F), max(nums, key=F)
        a6c = calc(s, [{'q': '수 [7 3/4], 12, 8, [3 5/6] 중 가장 작은 수와 가장 큰 수의 곱을 구해 보세요.', 'x': '[%s]×%s' % (lo, hi),
                        'show': '(가장 작은 수)×(가장 큰 수)', 'n': 46}])
        challenge_why(s, '대분수의 분모와 자연수를 바로 약분하면 안 되는 까닭을 써 보세요.')
        ans += '  ⑥ %s / %s / %s (3 5/6×12) / 왜: 예) 분모 10은 진분수 부분에만 있어서 자연수 부분 1은 함께 나누어지지 않아요.' % (
            a6[0], a6b, a6c[0])
    return ans


def tb4(s, lv):
    head(s, 4, '개념 구축하기(O)', '(자연수)×(진분수)를 알아볼까요', '(자연수)×(진분수)는 어떻게 계산할까요?',
         '전통 빗자루 체험장이에요. 갈대, 수수, 싸리 같은 재료로 만든 빗자루 대에 끈을 묶어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '끈 6 m의 [1/3]만큼'.replace('[1/3]', '3분의 1'))
        s.text(rd('나은이는 끈 6 m의 [1/3]만큼을 사용했어요. 6 m 막대를 똑같이 3부분으로 나누고 1부분을 색칠해 보세요.'
                  + (' 나누는 점선을 그려 두었어요.' if lv == '기본형' else '')))
        part_fig(s, 6, 3, 1, '끈 6 m', lv == '기본형', unit='m')
        a1 = calc(s, [{'q': '나은이가 사용한 끈은 몇 m일까요?', 'e': '6×[1/3]', 'n': 2, 'unit': 'm'}])
        step(s, 1, '그려 보기', '2×[1/3]과 2×[2/3]'.replace('[1/3]', '3분의 1').replace('[2/3]', '3분의 2'))
        s.text(rd('0부터 2까지의 막대를 똑같이 3부분으로 나누고 2×[2/3]만큼(2부분) 색칠해요. 각각의 1을 3등분한 작은 눈금도 살펴보세요.'))
        part_fig(s, 2, 3, 2, '2', lv == '기본형', fine=True)
        a2 = chain(s, ['2×[1/3] = [{2}/3]', '2×[2/3] = (2×[1/3])×{2} = [{2}/3]×2', ('', '= [2×{2}/3] = [{4}/3] = [{1} {1}/3]')])
        step(s, 2, '말해 보기', '순서를 바꾸어 곱하기')
        a3 = chain(s, ['[2/3]×2 = [2×{2}/3] = [{4}/3] = [{1} {1}/3]', '2×[2/3] = [2×{2}/3] = [{4}/3] = [{1} {1}/3]'])
        a3b = blanks(s, lv, ['두 곱셈은 계산 방법과 결과가 ', (['같아요', '달라요'], 0), '. 두 수의 곱셈은 순서를 바꾸어 계산해도 결과가 ', (['같아요', '달라져요'], 0), '.'])
        step(s, 3, '약속하기', '(자연수)×(진분수)')
        a4 = blanks(s, lv, RULE_WP)
        step(s, 4, '확인하기', '계산하기')
        if lv == '기본형':
            s.text('분모는 그대로 쓰고 자연수와 분자를 곱해요. 약분하지 않아도, 가분수로 써도 맞아요.')
        a5 = calc(s, [{'e': '3×[1/4]', 'a': '3/4'}, {'e': '7×[1/5]', 'a': '1 2/5'}, {'e': '5×[3/8]', 'a': '1 7/8'}, {'e': '12×[4/9]', 'a': '5 1/3'}])
        ans = '4차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (a1[0], a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '끈 10 m의 5분의 2만큼')
        s.text(rd('하준이는 끈 10 m의 [2/5]만큼을 사용했어요. 10 m 막대를 똑같이 5부분으로 나누고 2부분을 색칠해 보세요.'))
        part_fig(s, 10, 5, 2, '끈 10 m', False, unit='m')
        a1 = calc(s, [{'q': '하준이가 사용한 끈은 몇 m일까요?', 'e': '10×[2/5]', 'n': 4, 'unit': 'm'}])
        step(s, 1, '그려 보기', '3×5분의 1과 3×5분의 2')
        s.text(rd('0부터 3까지의 막대를 똑같이 5부분으로 나누고 3×[2/5]만큼(2부분) 색칠해요. 각각의 1을 5등분한 작은 눈금도 살펴보세요.'))
        part_fig(s, 3, 5, 2, '3', False, fine=True)
        a2 = chain(s, ['3×[1/5] = [{3}/5]', '3×[2/5] = (3×[1/5])×{2} = [{3}/5]×2', ('', '= [3×{2}/5] = [{6}/5] = [{1} {1}/5]')])
        step(s, 2, '말해 보기', '순서를 바꾸어 곱하기')
        a3 = chain(s, ['[4/7]×3 = [4×{3}/7] = [{12}/7] = [{1} {5}/7]', '3×[4/7] = [3×{4}/7] = [{12}/7] = [{1} {5}/7]'])
        a3b = blanks(s, lv, ['[4/7]×3은 [4/7]을 ', (['3번 더한 것', '3으로 나눈 것'], 0), '이고, 3×[4/7]은 3의 ', (['[4/7]만큼', '[4/7]번 더한 것'], 0), '이에요. 두 곱은 ',
                             (['같아요', '달라요'], 0), '.'])
        step(s, 3, '약속하기', '(자연수)×(진분수)')
        a4 = blanks(s, lv, ['15×[2/3]은 15를 3부분으로 나눈 것 중 ', (['2부분', '3부분'], 0), '이므로 15×[2/3] = ', (['10', '[30/45]', '[17/3]'], 0), '이에요. 자연수와 ',
                            (['분자', '분모'], 0), '를 곱하고 분모는 그대로 써요.'])
        assert ev('15×[2/3]') == 10
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'e': '4×[1/9]', 'a': '4/9'}, {'e': '9×[2/7]', 'a': '2 4/7'}, {'e': '14×[5/6]', 'a': '11 2/3'}, {'e': '20×[7/15]', 'a': '9 1/3'}])
        ans = '4차시  ① %s  ② %s  ③ %s / %s  ④ %s  ⑤ %s' % (a1[0], a2, a3, ', '.join(a3b), ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        a6 = calc(s, [{'e': '2×[3/4]', 'a': '1 1/2'}, {'e': '10×[11/12]', 'a': '9 1/6'}, {'e': '12×[5/8]', 'a': '7 1/2'},
                      {'q': '어항에 물고기가 40마리 있어요. 그중 [9/20]만큼이 수컷이에요. 수컷은 몇 마리일까요?', 'e': '40×[9/20]', 'n': 18, 'unit': '마리'}])
        s.ask('곱이 다른 사람은 누구일까요?', blank=False)
        eq_fig(s, ['승민: 15×[7/10]     은서: 10×[7/15]     준희: [7/15]×10'])
        s.ask('답: (        )', blank=False)
        vs = {'승민': ev('15×[7/10]'), '은서': ev('10×[7/15]'), '준희': ev('[7/15]×10')}
        odd = [k for k, v in vs.items() if list(vs.values()).count(v) == 1]
        assert odd == ['승민']
        challenge_why(s, '은서와 준희의 곱이 같은 까닭을 써 보세요.')
        ans += '  ⑥ %s, 승민 (21/2, 은서·준희 14/3) / 왜: 예) 곱하는 두 수의 순서만 바뀌었어요. 순서를 바꾸어 곱해도 결과가 같아요.' % ', '.join(a6)
    return ans


def tb5(s, lv):
    head(s, 5, '개념 구축하기(O)', '(자연수)×(대분수)를 알아볼까요', '(자연수)×(대분수)는 어떻게 계산할까요?',
         '한옥 마을의 아름다운 돌담길이에요. 나은이는 3 km를 걸으려고 하고, 하준이는 나은이가 걸으려는 거리의 [1 1/4]만큼을 걸으려고 해요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '돌담길 걷기')
        e1 = est(s, '하준이는 몇 km쯤 걸을까요?', ['3 km보다 조금 더 많이', '3 km보다 적게', '6 km쯤'], 0)
        s.text(rd('‘3×1’ 막대를 색칠하고, 3 km를 똑같이 4부분으로 나누어 3×[1/4]만큼 색칠해 보세요.'
                  + (' 나누는 점선을 그려 두었어요.' if lv == '기본형' else '')))
        part_fig(s, 3, 4, 1, '3×[1/4]', lv == '기본형', whole='3×1', unit='km')
        a1 = chain(s, [('방법 1', '3×[1 1/4] = (3×1)+(3×[1/4]) = {3}+[{3}/4] = [{3} {3}/4]')])
        step(s, 1, '그려 보기', '가분수로 나타내어 계산하기')
        a2 = chain(s, [('방법 2', '3×[1 1/4] = 3×[{5}/4] = [3×{5}/4] = [{15}/4] = [{3} {3}/4]')])
        a2b = chooses(s, [('하준이가 걸으려는 거리는 어림한 ‘3 km보다 조금 더’와', ['비슷해요', '많이 달라요'], 0)])
        step(s, 2, '말해 보기', '곱의 크기 비교하기')
        s.text(rd('1을 기준으로 [2/5]와 [1 2/5]의 크기를 생각해 보세요.'))
        a3 = cmp3(s, '4×[2/5]', '4×1', '4×[1 2/5]')
        a3b = chain(s, ['4×[2/5] = [{1} {3}/5]', '4×[1 2/5] = 4×[7/5] = [{5} {3}/5]'])
        a3c = blanks(s, lv, ['(자연수)×(진분수)는 (자연수)×1보다 ', (['더 작고', '더 크고'], 0), ', (자연수)×(대분수)는 (자연수)×1보다 ', (['더 커요', '더 작아요'], 0), '.'])
        step(s, 3, '약속하기', '(자연수)×(대분수)')
        a4 = blanks(s, lv, RULE_WM)
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'e': '7×[1 1/5]', 'a': '8 2/5'}, {'e': '5×[2 2/9]', 'a': '11 1/9'}, {'e': '9×[1 2/3]', 'n': 15},
                      {'q': '세로가 4 m인 텃밭의 가로는 세로의 [1 5/8]배예요. 텃밭의 가로는 몇 m일까요?', 'e': '4×[1 5/8]', 'a': '6 1/2', 'unit': 'm'}])
        ans = '5차시  ① %s / %s  ② %s, %s  ③ %s / %s / %s  ④ %s  ⑤ %s' % (
            e1, a1, a2, a2b[0], ', '.join(a3), a3b, ', '.join(a3c), ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '돌담길 걷기')
        s.text(rd('이번에는 나은이가 5 km를 걷고, 하준이는 나은이가 걷는 거리의 [1 2/5]만큼을 걸으려고 해요.'))
        e1 = est(s, '하준이는 몇 km쯤 걸을까요?', ['5 km보다 많고 10 km보다 적게', '5 km보다 적게', '10 km보다 많이'], 0)
        s.text(rd('‘5×1’ 막대를 색칠하고, 5 km를 똑같이 5부분으로 나누어 5×[2/5]만큼 색칠해 보세요.'))
        part_fig(s, 5, 5, 2, '5×[2/5]', False, whole='5×1', unit='km')
        a1 = chain(s, [('방법 1', '5×[1 2/5] = (5×1)+(5×[2/5]) = {5}+[{10}/5] = {7}')])
        step(s, 1, '그려 보기', '가분수로 나타내어 계산하기')
        a2 = chain(s, [('방법 2', '5×[1 2/5] = 5×[{7}/5] = [5×{7}/5] = [{35}/5] = {7}')])
        a2b = chooses(s, [('하준이가 걷는 거리는 나은이가 걷는 거리보다', ['2 km 더 길어요', '2 km 더 짧아요', '같아요'], 0)])
        step(s, 2, '말해 보기', '곱의 크기 비교하기')
        a3 = cmp3(s, '6×[5/6]', '6×1', '6×[2 1/3]')
        a3b = chain(s, ['6×[5/6] = {5}', '6×[2 1/3] = 6×[7/3] = {14}'])
        a3c = blanks(s, lv, ['6에 1보다 작은 수를 곱하면 6보다 ', (['작아지고', '커지고'], 0), ', 1보다 큰 수를 곱하면 6보다 ', (['커져요', '작아져요'], 0), '.'])
        step(s, 3, '약속하기', '(자연수)×(대분수)')
        a4 = blanks(s, lv, ['4×[2 3/8]을 가분수로 계산하면 4×[19/8] = ', (['[19/2]', '[76/32]', '[8 3/8]'], 0), '이고, 대분수로 나타내면 ', (['[9 1/2]', '[8 3/8]', '[9 3/8]'], 0), '이에요.'])
        assert ev('4×[2 3/8]') == F('9 1/2')
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'e': '8×[1 3/10]', 'a': '10 2/5'}, {'e': '6×[3 4/9]', 'a': '20 2/3'}, {'e': '12×[2 3/4]', 'n': 33},
                      {'q': '세로가 6 m인 꽃밭의 가로는 세로의 [1 7/9]배예요. 꽃밭의 가로는 몇 m일까요?', 'e': '6×[1 7/9]', 'a': '10 2/3', 'unit': 'm'}])
        ans = '5차시  ① %s / %s  ② %s, %s  ③ %s / %s / %s  ④ %s  ⑤ %s' % (
            e1, a1, a2, a2b[0], ', '.join(a3), a3b, ', '.join(a3c), ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수 카드로 가장 큰 대분수 만들기')
        s.text('수 카드 1, 4, 6을 한 번씩 모두 사용하여 가장 큰 대분수를 만들고, 2와 그 대분수의 곱을 구해 보세요.')
        a6 = build(s, lv, [1, 4, 6], [2, 'm'], 'max')
        challenge_why(s, '가장 큰 대분수를 어떻게 만들었는지 까닭과 함께 써 보세요.')
        ans += '  ⑥ %s / 왜: 예) 자연수 부분에 가장 큰 6을 놓고, 남은 1과 4로 진분수 1/4을 만들었어요.' % a6
    return ans


def tb67(s, lv):
    head(s, '6~7', '개념 구축하기(O)', '진분수의 곱셈을 알아볼까요', '진분수의 곱셈은 어떻게 계산할까요?',
         '조각보 체험장이에요. 조각보는 색색의 천 조각을 이어 만든 것이에요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '빨간색 천의 5분의 1의 3분의 1')
        s.text(rd('하준이는 빨간색 천 한 장의 [1/5] 중에서 [1/3]만큼을 사용했어요. 넓이가 1인 천을 세로로 5등분하여 1칸을 색칠하고(1단계), '
                  '가로로 3등분하여 색칠한 부분의 [1/3]만큼 빗금을 그어 보세요(2단계).'
                  + (' 1단계는 색칠해 두었고, 가로 점선을 따라 빗금을 그어요.' if lv == '기본형' else ' 가로로 나누는 선도 직접 그어요.')))
        area_fig(s, [('v', 5, 1), ('h', 3, 1)], '빨간색 천 한 장 = 1', lv == '기본형')
        a1 = chain(s, ['[1/5]×[1/3] = [1/5×{3}] = [{1}/{15}]'])
        step(s, 1, '그려 보기', '[4/5]×[2/3]'.replace('[4/5]', '5분의 4').replace('[2/3]', '3분의 2'))
        s.text(rd('전체를 세로로 5등분한 것 중 4를 색칠하고, 가로로 3등분하여 색칠한 부분의 [2/3]만큼 빗금을 그어 보세요.'))
        area_fig(s, [('v', 5, 4), ('h', 3, 2)], '전체 = 1', lv == '기본형')
        a2 = chain(s, ['전체를 똑같이 5×3 = {15}칸으로 나누었고, 빗금 친 부분은 4×2 = {8}칸이에요.', '[4/5]×[2/3] = [4×{2}/5×{3}] = [{8}/{15}]'])
        step(s, 2, '세 분수의 곱셈', '그림으로 알아보기')
        s.text(rd('[3/5]×[1/2]×[3/4]을 그림으로 알아보세요. [3/5]을 색칠하고(1단계), 그 [1/2]만큼 빗금을 긋고(2단계), '
                  '빗금 친 줄을 다시 4등분하여 그중 3만큼 진하게 빗금을 그어 보세요(3단계).'))
        area_fig(s, [('v', 5, 3), ('h', 2, 1), ('h2', 4, 3)], '전체 = 1', lv == '기본형')
        a3 = chain(s, ['전체를 똑같이 5×2×4 = {40}칸으로 나누었고, 진한 빗금은 3×1×3 = {9}칸이에요.',
                       '[3/5]×[1/2]×[3/4] = [3×1×{3}/5×2×{4}] = [{9}/{40}]'])
        assert 5 * 3 == 15 and 4 * 2 == 8 and 5 * 2 * 4 == 40 and 3 * 1 * 3 == 9
        s.page_break()
        step(s, 3, '여러 가지 방법', '약분은 언제 할까?')
        s.text(rd('윤호와 가은이가 [7/10]×[15/28]을 서로 다른 방법으로 계산했어요.'))
        a4 = chain(s, [('윤호', '[7/10]×[15/28] = [7×15/10×28] = [{1}×{3}/{2}×{4}] = [{3}/{8}]'),
                       ('가은', '[7/10]×[15/28] = [{1}/{2}]×[{3}/{4}] = [{3}/{8}]')])
        a4b = chooses(s, [('가은이는?', ['먼저 약분한 후 곱했어요', '곱한 후에 약분했어요'], 0)])
        step(s, 4, '약속하기', '(진분수)×(진분수)')
        a5 = blanks(s, lv, RULE_PP)
        step(s, 5, '확인하기', '계산하기')
        if lv == '기본형':
            s.text('분자는 분자끼리, 분모는 분모끼리 곱해요. 약분할 수 있는 수끼리 먼저 약분하면 계산이 쉬워요.')
        a6 = calc(s, [{'e': '[1/3]×[1/4]', 'a': '1/12'}, {'e': '[7/9]×[5/8]', 'a': '35/72'}, {'e': '[7/12]×[9/14]', 'a': '3/8'}, {'e': '[4/7]×[5/8]×[1/3]', 'a': '5/42'},
                      {'q': '반 학생의 [4/7]은 여학생이고, 여학생 중 [7/12]은 안경을 썼어요. 안경을 쓴 여학생은 반 전체의 얼마일까요?', 'e': '[4/7]×[7/12]', 'a': '1/3'}])
        ans = '6~7차시  ① %s  ② %s  ③ %s  ④ %s / %s  ⑤ %s  ⑥ %s' % (a1, a2, a3, a4, a4b[0], ', '.join(a5), ', '.join(a6))
    else:  # 도전형
        step(s, 0, '만져 보기', '파란색 천의 3분의 1의 4분의 1')
        s.text(rd('나은이는 파란색 천 한 장의 [1/3] 중에서 [1/4]만큼을 사용했어요. 넓이가 1인 천을 세로로 3등분하여 1칸을 색칠하고(1단계), '
                  '가로로 4등분하여 색칠한 부분의 [1/4]만큼 빗금을 그어 보세요(2단계). 가로로 나누는 선도 직접 그어요.'))
        area_fig(s, [('v', 3, 1), ('h', 4, 1)], '파란색 천 한 장 = 1', False)
        a1 = chain(s, ['[1/3]×[1/4] = [1/3×{4}] = [{1}/{12}]'])
        step(s, 1, '그려 보기', '4분의 3×5분의 2')
        s.text(rd('전체를 세로로 4등분한 것 중 3을 색칠하고, 가로로 5등분하여 색칠한 부분의 [2/5]만큼 빗금을 그어 보세요.'))
        area_fig(s, [('v', 4, 3), ('h', 5, 2)], '전체 = 1', False)
        a2 = chain(s, ['전체를 똑같이 4×5 = {20}칸으로 나누었고, 빗금 친 부분은 3×2 = {6}칸이에요.', '[3/4]×[2/5] = [3×{2}/4×{5}] = [{6}/{20}]'])
        step(s, 2, '세 분수의 곱셈', '그림으로 알아보기')
        s.text(rd('[2/3]×[3/4]×[1/2]을 그림으로 알아보세요. [2/3]을 색칠하고(1단계), 그 [3/4]만큼 빗금을 긋고(2단계), 빗금 친 부분의 [1/2]만큼 진하게 빗금을 그어 보세요(3단계).'))
        area_fig(s, [('v', 3, 2), ('h', 4, 3), ('h2', 2, 1)], '전체 = 1', False)
        a3 = chain(s, ['전체를 똑같이 3×4×2 = {24}칸으로 나누었고, 진한 빗금은 2×3×1 = {6}칸이에요.', '[2/3]×[3/4]×[1/2] = [2×3×{1}/3×4×{2}] = [{6}/{24}]'])
        assert 3 * 4 * 2 == 24 and 2 * 3 * 1 == 6
        s.page_break()
        step(s, 3, '여러 가지 방법', '약분은 언제 할까?')
        s.text(rd('태민이와 세아가 [8/15]×[9/16]을 서로 다른 방법으로 계산했어요.'))
        a4 = chain(s, [('태민', '[8/15]×[9/16] = [8×9/15×16] = [{1}×{3}/{5}×{2}] = [{3}/{10}]'), ('세아', '[8/15]×[9/16] = [{1}/{5}]×[{3}/{2}] = [{3}/{10}]')])
        a4b = chooses(s, [('세아가 먼저 약분한 수끼리 바르게 짝지은 것은?', ['8과 16, 9와 15', '8과 9, 15와 16'], 0)])
        step(s, 4, '약속하기', '(진분수)×(진분수)')
        a5 = blanks(s, lv, ['[5/6]×[2/7]에서 분모끼리 곱한 42는 전체를 똑같이 나눈 ', (['칸 수', '빗금 친 칸 수'], 0), '이고, 분자끼리 곱한 10은 ', (['빗금 친 칸 수', '전체 칸 수'], 0),
                            '예요. 기약분수로 나타내면 ', (['[5/21]', '[10/13]', '[7/13]'], 0), '이에요.'])
        assert ev('[5/6]×[2/7]') == F('5/21')
        step(s, 5, '확인하기', '계산하기')
        a6 = calc(s, [{'e': '[1/5]×[1/6]', 'a': '1/30'}, {'e': '[5/8]×[3/7]', 'a': '15/56'}, {'e': '[9/10]×[5/12]', 'a': '3/8'}, {'e': '[3/5]×[5/9]×[3/4]', 'a': '1/4'},
                      {'q': '우리 반 학생의 [5/8]는 운동을 좋아하고, 그중 [2/5]는 축구를 좋아해요. 축구를 좋아하는 학생은 반 전체의 얼마일까요?', 'e': '[5/8]×[2/5]', 'a': '1/4'}])
        ans = '6~7차시  ① %s  ② %s  ③ %s  ④ %s / %s  ⑤ %s  ⑥ %s' % (a1, a2, a3, a4, a4b[0], ', '.join(a5), ', '.join(a6))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 6, '도전하기', '수 카드로 진분수의 곱셈식 만들기')
        s.text('수 카드 2, 3, 5, 6, 8, 9 중에서 4장을 골라 한 번씩만 사용하여 진분수의 곱셈식을 만들고 계산해 보세요. 여러 가지 식을 만들 수 있어요.')
        a7 = build(s, lv, [2, 3, 5, 6, 8, 9], ['p', 'p'], 'any', [2, 5, 8, 9])
        challenge_why(s, '내가 만든 식의 곱이 두 진분수보다 작은 까닭을 써 보세요.')
        ans += '  ⑦ %s / 왜: 예) 진분수는 1보다 작아서 곱하면 그 수의 일부분만 구하게 돼요.' % a7
    return ans


def tb8(s, lv):
    head(s, 8, '개념 구축하기(O)', '(대분수)×(대분수)를 알아볼까요', '(대분수)×(대분수)는 어떻게 계산할까요?',
         '멍석 체험장이에요. 멍석은 짚으로 만든 큰 깔개로, 바닥에 깔거나 곡식을 널어 말릴 때 써요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '멍석의 넓이 나누어 구하기')
        s.text(rd('하준이네가 만든 직사각형 멍석은 가로 [1 1/2] m, 세로 [1 1/4] m예요. (직사각형의 넓이) = (가로)×(세로)예요.'))
        e1 = est(s, '멍석의 넓이는 약 몇 m²일까요?', ['약 2 m²', '약 1 m²', '약 4 m²'], 0)
        s.text(rd('세로를 1 m와 [1/4] m로 나누어 보세요.' + (' 나눈 선을 그려 두었어요. 파란 부분은 [1 1/2]×1, 노란 부분은 [1 1/2]×[1/4]이에요.'
                                                    if lv == '기본형' else ' 그림에 나누는 선을 그어요. 주황 점선 정사각형이 1 m²예요.')))
        mat_fig(s, '1 1/2', '1 1/4', 1, lv == '기본형')
        a1 = chain(s, [('방법 1', '[1 1/2]×[1 1/4] = ([1 1/2]×1)+([1 1/2]×[1/4])'), ('', '= [1 1/2]+([3/2]×[1/4]) = [1 1/2]+[{3}/{8}]'),
                       ('', '= [{12}/8]+[3/8] = [{15}/8] = [{1} {7}/8]')])
        step(s, 1, '그려 보기', '가분수로 나타내어 칸 세기')
        s.text(rd('가로와 세로의 1 m를 똑같이 나누어 칸이 멍석 끝에 딱 맞게 해 보세요. 점선 정사각형이 1 m²예요.'
                  + (' 가로는 [1/2] m, 세로는 [1/4] m씩 나누었어요.' if lv == '기본형' else '')))
        mat_fig(s, '1 1/2', '1 1/4', 2, lv == '기본형')
        a2 = chain(s, [('방법 2', '[1 1/2]×[1 1/4] = [{3}/2]×[{5}/4] = [3×{5}/2×{4}] = [{15}/8] = [{1} {7}/8]')])
        assert 3 * 5 == 15 and 2 * 4 == 8
        a2b = chooses(s, [('1 m² 안에 들어가는 칸 수는?', ['8칸', '15칸', '6칸'], 0), ('멍석의 넓이는 어림한 약 2 m²와', ['비슷해요', '많이 달라요'], 0)])
        step(s, 2, '말해 보기', '잘못된 계산 고치기')
        s.text(rd('친구가 [3 7/8]×[2 4/5]를 잘못 계산했어요.'))
        wrong(s, '잘못된 계산', '[3 7/8]×[2 4/5] = [3 7/2]×[2 1/5] = [13/2]×[11/5] = [143/10] = [14 3/10]')
        a3 = chooses(s, [('잘못된 까닭은?', WHY_MM, 0)])
        a3b = chain(s, [('옳은 계산', '[3 7/8]×[2 4/5] = [{31}/8]×[{14}/5] = [31×{7}/{4}×5]'), ('', '= [{217}/20] = [{10} {17}/20]')])
        step(s, 3, '약속하기', '(대분수)×(대분수)')
        a4 = blanks(s, lv, RULE_MM)
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'e': '[2 1/2]×[1 5/8]', 'a': '4 1/16'}, {'e': '[3 1/5]×[3 1/3]', 'a': '10 2/3'}, {'e': '[1 3/4]×[2 4/7]', 'a': '4 1/2'},
                      {'e': '[4 1/6]×[2 2/5]', 'n': 10},
                      {'q': '수현이는 롤러스케이트를 [2 5/8] km 탔고, 주아는 수현이가 탄 거리의 [1 3/5]배를 탔어요. 주아가 탄 거리는 몇 km일까요?',
                       'e': '[2 5/8]×[1 3/5]', 'a': '4 1/5', 'unit': 'km'}])
        ans = '8차시  ① %s / %s  ② %s, %s  ③ %s / %s  ④ %s  ⑤ %s' % (e1, a1, a2, ', '.join(a2b), a3[0], a3b, ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '멍석의 넓이 나누어 구하기')
        s.text(rd('나은이네가 만든 직사각형 멍석은 가로 [2 1/2] m, 세로 [1 1/3] m예요.'))
        e1 = est(s, '멍석의 넓이는 약 몇 m²일까요?', ['약 3 m²', '약 2 m²', '약 5 m²'], 0)
        s.text(rd('세로를 1 m와 [1/3] m로 나누는 선을 그어 보세요. 주황 점선 정사각형이 1 m²예요.'))
        mat_fig(s, '2 1/2', '1 1/3', 1, False)
        a1 = chain(s, [('방법 1', '[2 1/2]×[1 1/3] = ([2 1/2]×1)+([2 1/2]×[1/3])'), ('', '= [2 1/2]+([5/2]×[1/3]) = [2 1/2]+[{5}/{6}]'),
                       ('', '= [{15}/6]+[5/6] = [{20}/6] = [{3} {1}/3]')])
        step(s, 1, '그려 보기', '가분수로 나타내어 칸 세기')
        s.text(rd('가로의 1 m는 [1/2] m씩, 세로의 1 m는 [1/3] m씩 나누어 칸이 멍석 끝에 딱 맞게 해 보세요.'))
        mat_fig(s, '2 1/2', '1 1/3', 2, False)
        a2 = chain(s, [('방법 2', '[2 1/2]×[1 1/3] = [{5}/2]×[{4}/3] = [5×{4}/2×{3}] = [{20}/6] = [{3} {1}/3]')])
        a2b = chooses(s, [('1 m² 안에 들어가는 칸 수는?', ['6칸', '20칸', '5칸'], 0), ('멍석 전체의 칸 수는?', ['20칸', '6칸', '12칸'], 0)])
        step(s, 2, '말해 보기', '잘못된 계산 고치기')
        s.text(rd('친구가 [2 3/10]×[1 5/6]을 잘못 계산했어요.'))
        wrong(s, '잘못된 계산', '[2 3/10]×[1 5/6] = [2 1/10]×[1 5/2] = [21/10]×[7/2] = [147/20] = [7 7/20]')
        a3 = chooses(s, [('잘못된 까닭은?', ['대분수를 가분수로 바꾸기 전에 진분수 부분의 3과 6을 약분했어요', '자연수 부분끼리만 곱했어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[2 3/10]×[1 5/6] = [{23}/10]×[{11}/6] = [{253}/{60}]'), ('', '= [{4} {13}/60]')])
        step(s, 3, '약속하기', '(대분수)×(대분수)')
        a4 = blanks(s, lv, ['[1 1/4]×[2 2/3]은 두 대분수를 ', (['가분수', '진분수'], 0), '로 바꾸면 [5/4]×[8/3]이에요. 4와 8을 약분하면 ', (['[10/3]', '[13/7]', '[5/6]'], 0),
                            '이 되고, 대분수로 ', (['[3 1/3]', '[2 1/3]', '[3 2/3]'], 0), '이에요.'])
        assert ev('[1 1/4]×[2 2/3]') == F('3 1/3')
        step(s, 4, '확인하기', '계산하기')
        a5 = calc(s, [{'e': '[1 1/2]×[2 2/9]', 'a': '3 1/3'}, {'e': '[2 1/4]×[3 1/3]', 'a': '7 1/2'}, {'e': '[1 5/7]×[2 5/8]', 'a': '4 1/2'},
                      {'e': '[3 3/4]×[2 2/5]', 'n': 9},
                      {'q': '가은이는 자전거를 [3 3/4] km 탔고, 도윤이는 가은이가 탄 거리의 [1 1/5]배를 탔어요. 도윤이가 탄 거리는 몇 km일까요?',
                       'e': '[3 3/4]×[1 1/5]', 'a': '4 1/2', 'unit': 'km'}])
        ans = '8차시  ① %s / %s  ② %s, %s  ③ %s / %s  ④ %s  ⑤ %s' % (e1, a1, a2, ', '.join(a2b), a3[0], a3b, ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '수학익힘 문제')
        a6 = calc(s, [{'e': '[2 2/3]×[1 3/4]', 'a': '4 2/3'}, {'e': '[2 1/2]×[4 3/5]', 'a': '11 1/2'},
                      {'q': '서하: “[6 2/9]의 [1 1/8]배인 수야.” 서하가 설명하는 수는?', 'e': '[6 2/9]×[1 1/8]', 'n': 7},
                      {'q': '1분에 [6 7/11] L씩 물이 나오는 수도로 5분 30초 동안 받은 물은 몇 L일까요?', 'e': '[6 7/11]×[5 1/2]', 'a': '36 1/2', 'unit': 'L'}])
        challenge_why(s, '5분 30초를 분수로 어떻게 나타냈는지 써 보세요.')
        ans += '  ⑥ %s (6 7/11×5 1/2) / 왜: 예) 30초는 1분의 1/2이므로 5분 30초는 5 1/2분이에요.' % ', '.join(a6)
    return ans


def tb9(s, lv):
    att57, v57 = vote_min(57)
    head(s, 9, '탐구 정리하기(O)', '생각을 더하다 ― 투표 과정에도 분수의 곱셈을 활용해요',
         '환경 지킴이 학년별 회의에서 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?',
         '‘환경 지킴이 회원 모집’ 공고문이에요. 학년별 회의에서 제안한 의견이 투표를 통해 통과되면 지역 행사가 될 수 있어요.')
    if lv == '기본형':
        step(s, 0, '이해해요', '통과 조건 읽기')
        s.fill([rd(t) for t in ['통과 조건 ① 학년 전체 회원 수의 [1/2]보다 많은 회원이 회의에 참석해야 해요.',
                               '통과 조건 ② 참석한 회원 수의 [2/3]보다 많은 회원의 찬성표를 받아야 해요.']])
        a1 = chooses(s, [('5학년 환경 지킴이 회원은 57명이에요. 이 문제에서 구하려는 것은?', ['의견이 통과되기 위한 최소 찬성표 수', '회의에 참석한 회원 수', '5학년 회원 수'], 0),
                         ('회원이 10명인 학년이에요. 10×[1/2] = 5예요. 회의가 열리려면 최소 몇 명이 참석해야 할까요?', ['5명', '6명', '4명'], 1)])
        assert vote_min(10)[0] == 6
        step(s, 1, '계획해요', '풀 방법 정하기')
        a2 = blanks(s, lv, ['먼저 ', (['57×[1/2]', '57×[2/3]'], 0), '을 계산하여 그보다 많은 가장 작은 자연수로 최소 참석 인원을 구해요. 그다음 (최소 참석 인원)×',
                            (['[2/3]', '[1/2]'], 0), '를 계산하여 그보다 많은 가장 작은 자연수로 최소 찬성표를 구해요.'])
        step(s, 2, '해결해요', '5학년 57명')
        if lv == '기본형':
            s.text(rd('‘[28 1/2]보다 많은’ 가장 작은 자연수를 찾아요.'))
        a3 = vote_chain(s, 57)
        step(s, 3, '한 번 더 해요', '6학년 63명')
        a4 = vote_chain(s, 63)
        step(s, 4, '되돌아봐요', '곱이 자연수로 딱 나올 때')
        a5 = chooses(s, [('어느 학년 회의에 30명이 참석했어요. 30×[2/3] = 20이에요. 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?', ['20표', '21표', '19표'], 1),
                         ('57명인 5학년에서 30명이 참석하면 필요한 최소 찬성표는 어떻게 될까요?',
                          ['%d명이 참석할 때(%d표)보다 1표 더 많은 21표가 필요해요' % (att57, v57), '참석 인원과 상관없이 20표예요'], 0)])
        assert ev('30×[2/3]') == 20 and v57 == 20
        ans = '9차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), a3, a4, ', '.join(a5))
    else:  # 도전형
        step(s, 0, '이해해요', '통과 조건 읽기')
        s.fill([rd('통과하려면: 회의 참석자 수 > (전체 회원 수)×[1/2],  찬성표 수 > (참석자 수)×[2/3]')])
        a1 = chooses(s, [('6학년 환경 지킴이 회원은 45명이에요. 이 문제에서 구하려는 것은?', ['통과에 필요한 최소 찬성표 수', '6학년 회원 수', '반대표 수'], 0),
                         ('회원이 14명인 모임이에요. 14×[1/2] = 7이에요. 회의가 열리려면 최소 몇 명이 참석해야 할까요?', ['7명', '8명', '6명'], 1)])
        assert vote_min(14)[0] == 8
        step(s, 1, '계획해요', '풀 방법 정하기')
        a2 = blanks(s, lv, ['회원이 45명이면 먼저 ', (['45×[1/2]', '45×[2/3]'], 0), '보다 많은 가장 작은 자연수를 구해요. 그 수에 ', (['[2/3]', '[1/2]'], 0),
                            '를 곱한 값보다 많은 가장 작은 자연수가 최소 찬성표예요.'])
        step(s, 2, '해결해요', '6학년 45명')
        a3 = vote_chain(s, 45)
        step(s, 3, '한 번 더 해요', '학교 전체 81명')
        s.text('학교 전체 환경 지킴이 회의는 81명이에요(이 활동지에서 정한 수).')
        a4 = vote_chain(s, 81)
        step(s, 4, '되돌아봐요', '곱이 자연수로 딱 나올 때')
        a5 = chooses(s, [('어느 회의에 36명이 참석했어요. 36×[2/3] = 24예요. 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?', ['24표', '25표', '23표'], 1),
                         ('45명 중 36명이 참석하면, 최소 인원(23명)이 참석할 때보다 찬성표가 몇 표 더 필요할까요?', ['9표', '8표', '11표'], 0)])
        assert ev('36×[2/3]') == 24 and vote_min(45) == (23, 16) and 25 - 16 == 9
        ans = '9차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), a3, a4, ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '4학년 59명')
        s.text('4학년 환경 지킴이 회원은 59명이라고 해요(이 활동지에서 정한 수). 곱이 자연수로 나올 때 조심해요!')
        a6 = vote_chain(s, 59)
        challenge_why(s, '곱이 자연수로 나오면 왜 그 수에 1을 더해야 할까요?')
        ans += '  ⑥ %s / 왜: 예) ‘보다 많은’에는 그 수가 들어가지 않아서, 20표로는 안 되고 21표가 필요해요.' % a6
    return ans


def tb10(s, lv):
    head(s, 10, '발표하기(P)', '놀이를 더하다 ― 어떻게 만들어야 곱이 더 클까요', '조건에 맞는 분수의 곱셈식에서 곱을 더 크게 만들려면 어떻게 해야 할까요?',
         '3~4명이 수 카드와 조건 카드로 놀이를 해요.')
    if lv == '기본형':
        step(s, 0, '놀이 방법', '차례대로 늘어놓기')
        a1 = seq_order(s, ['가위바위보로 놀이 순서를 정해요.', '곱이 맞으면 1점, 곱이 가장 큰 사람은 2점을 더 얻어요.', '수 카드끼리, 조건 카드끼리 잘 섞어서 뒤집어 쌓아 두어요.',
                           '가져온 수 카드를 한 번씩만 사용하여 조건에 맞는 식을 만들고 계산해요.', '조건 카드 한 장을 뒤집어 내려놓고, 조건에 맞게 각자 수 카드를 가져와요.'],
                       [2, 0, 4, 3, 1])
        step(s, 1, '예시 살펴보기', '조건 카드 (대분수)×(자연수)')
        s.text(rd('수 카드 9, 1, 6, 4로 [9 1/6]×4를 만들었어요. 수 카드를 한 번씩만 썼어요.'))
        a2 = chooses(s, [('[9 1/6]×4는 조건 카드에 맞나요?', ['맞아요', '맞지 않아요'], 0)])
        a2 += calc(s, [{'e': '[9 1/6]×4', 'a': '36 2/3'}])
        step(s, 2, '곱을 크게', '같은 수 카드로 가장 큰 곱')
        s.text('같은 수 카드 9, 1, 6, 4로 ‘(대분수)×(자연수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.')
        if lv == '기본형':
            s.text('곱하는 자연수와 대분수의 자연수 부분을 크게, 진분수 부분은 분자는 크게, 분모는 작게 해 봐요.')
        a3 = build(s, lv, [9, 1, 6, 4], ['m', 'w'], 'max')
        assert best(['m', 'w'], [9, 1, 6, 4])[0] > ev('[9 1/6]×4')
        step(s, 3, '곱을 크게 하는 방법', '정리하기')
        a4 = blanks(s, lv, RULE_BIG)
        step(s, 4, '놀이하기', '5판 기록하기')
        a5 = game(s, lv, 'tb10-' + lv)
        ans = '10차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (a1, ', '.join(a2), a3, ', '.join(a4), a5)
    else:  # 도전형
        step(s, 0, '놀이 방법', '규칙 바르게 알기')
        a1 = chooses(s, [('수 카드는 한 번 만든 식에서 여러 번 쓸 수 있어요.', ['맞아요', '틀려요'], 1), ('곱을 바르게 계산하면 1점을 얻어요.', ['맞아요', '틀려요'], 0),
                         ('조건 카드와 맞지 않는 식은 점수를 얻지 못해요.', ['맞아요', '틀려요'], 0)])
        step(s, 1, '예시 살펴보기', '조건 카드 (대분수)×(자연수)')
        s.text(rd('수 카드 7, 2, 5, 3으로 [7 2/5]×3을 만들었어요.'))
        a2 = chooses(s, [('[7 2/5]×3은 조건 카드에 맞나요?', ['맞아요', '맞지 않아요'], 0)])
        a2 += calc(s, [{'e': '[7 2/5]×3', 'a': '22 1/5'}])
        step(s, 2, '곱을 크게', '같은 수 카드로 가장 큰 곱')
        s.text('같은 수 카드 7, 2, 5, 3으로 ‘(대분수)×(자연수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.')
        a3 = build(s, lv, [7, 2, 5, 3], ['m', 'w'], 'max')
        assert best(['m', 'w'], [7, 2, 5, 3])[0] > ev('[7 2/5]×3')
        step(s, 3, '곱을 크게 하는 방법', '정리하기')
        a4 = blanks(s, lv, ['(진분수)×(자연수)에서 곱을 크게 하려면 자연수 자리에 ', (['가장 큰 수', '가장 작은 수'], 0), '를, 분모 자리에는 분자보다 큰 수 중 ',
                            (['가장 작은 수', '가장 큰 수'], 0), '를 놓아요.'])
        step(s, 4, '놀이하기', '5판 기록하기')
        a5 = game(s, lv, 'tb10-' + lv)
        ans = '10차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), a3, ', '.join(a4), a5)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '(진분수)×(진분수)로 가장 큰 곱')
        s.text('수 카드 2, 3, 5, 7을 한 번씩 모두 사용하여 ‘(진분수)×(진분수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.')
        a6 = build(s, lv, [2, 3, 5, 7], ['p', 'p'], 'max')
        challenge_why(s, '분자와 분모에 어떤 수를 놓았는지 까닭과 함께 써 보세요.')
        ans += '  ⑥ %s (2/5×3/7처럼 분자와 분모를 바꾸어도 같아요) / 왜: 예) 분자의 곱은 크게, 분모의 곱은 작게 하면서 진분수가 되게 했어요.' % a6
    return ans


def tb11(s, lv):
    head(s, 11, '발표하기(P)', '공부한 내용을 확인해요', '분수의 곱셈을 잘 할 수 있나요?', None)
    if lv == '기본형':
        step(s, 0, '그림 보고 계산하기', '막대에 색칠하기')
        s.text(rd('막대에 [2/3]만큼씩 2번 색칠하고 [2/3]×2를 계산해 보세요. 막대 하나가 1이고 작은 칸 하나는 [1/3]이에요.'))
        pour_fig(s, 3, '2/3', 2, 1 if lv == '기본형' else 0)
        a1 = chain(s, ['[2/3]×2 = [2/3]+[2/3] = [2+{2}/3]', ('', '= [2×{2}/3] = [{4}/3] = [{1} {1}/3]')])
        step(s, 1, '두 가지 방법', '3×[1 2/5]'.replace('[1 2/5]', '1과 5분의 2'))
        a2 = chain(s, [('방법 1', '3×[1 2/5] = (3×1)+(3×[2/5]) = {3}+[{6}/5]'), ('', '= 3+[{1} {1}/5] = [{4} {1}/5]'),
                       ('방법 2', '3×[1 2/5] = 3×[{7}/5] = [3×{7}/5] = [{21}/5] = [{4} {1}/5]')])
        step(s, 2, '계산하기', '네 가지 곱셈')
        a3 = calc(s, [{'e': '[1 4/5]×2', 'a': '3 3/5'}, {'e': '6×[5/8]', 'a': '3 3/4'}, {'e': '[3/4]×[6/7]', 'a': '9/14'}, {'e': '[2 1/7]×[4 2/3]', 'n': 10}])
        step(s, 3, '크기 비교', '계산 결과 비교하기')
        a4 = cmp(s, [('4×[2 5/6]', '[1 5/8]×10'), ('[3/10]×[7/8]', '[3/4]×[7/12]×[3/5]')])
        s.page_break()
        step(s, 4, '잘못 고치기', '친구의 계산')
        s.text(rd('친구가 [1 5/8]×[2 4/5]를 잘못 계산했어요.'))
        wrong(s, '잘못된 계산', '[1 5/8]×[2 4/5] = [1 5/2]×[2 1/5] = [7/2]×[11/5] = [77/10] = [7 7/10]')
        a5 = chooses(s, [('잘못된 까닭은?', ['대분수를 가분수로 나타내지 않고 약분했어요', '분자끼리 곱했어요'], 0)])
        a5b = chain(s, [('옳은 계산', '[1 5/8]×[2 4/5] = [{13}/8]×[{14}/5] = [13×{7}/{4}×5]'), ('', '= [{91}/20] = [{4} {11}/20]')])
        step(s, 5, '태극기', '생활 속 분수의 곱셈')
        s.text(rd('태극기의 가로는 72 cm예요. 세로는 가로의 [2/3]이고, 가운데 태극 문양의 지름은 세로의 [1/2]이에요.'))
        flag_fig(s)
        a6 = calc(s, [{'q': '태극기의 세로는 몇 cm일까요?', 'e': '72×[2/3]', 'n': 48, 'unit': 'cm'},
                      {'q': '태극 문양의 지름은 몇 cm일까요?', 'x': '48×[1/2]', 'show': '(세로)×[1/2]', 'n': 24, 'unit': 'cm'}])
        ans = '11차시  ① %s  ② %s  ③ %s  ④ %s (11 1/3 < 16 1/4, 둘 다 21/80)  ⑤ %s / %s  ⑥ %s' % (
            a1, a2, ', '.join(a3), ' '.join(a4), a5[0], a5b, ', '.join(a6))
    else:  # 도전형
        step(s, 0, '그림 보고 계산하기', '막대에 색칠하기')
        s.text(rd('막대에 [3/5]만큼씩 3번 색칠하고 [3/5]×3을 계산해 보세요. 막대 하나가 1이에요.'))
        pour_fig(s, 5, '3/5', 3, 0)
        a1 = chain(s, ['[3/5]×3 = [3/5]+[3/5]+[3/5] = [3+3+{3}/5]', ('', '= [3×{3}/5] = [{9}/5] = [{1} {4}/5]')])
        step(s, 1, '두 가지 방법', '4×2와 6분의 1')
        a2 = chain(s, [('방법 1', '4×[2 1/6] = (4×2)+(4×[1/6]) = {8}+[{4}/6]'), ('', '= 8+[{2}/3] = [{8} {2}/3]'),
                       ('방법 2', '4×[2 1/6] = 4×[{13}/6] = [{26}/3] = [{8} {2}/3]')])
        step(s, 2, '계산하기', '네 가지 곱셈')
        a3 = calc(s, [{'e': '[2 2/7]×3', 'a': '6 6/7'}, {'e': '9×[7/12]', 'a': '5 1/4'}, {'e': '[5/8]×[4/15]', 'a': '1/6'}, {'e': '[1 7/8]×[3 1/5]', 'n': 6}])
        step(s, 3, '크기 비교', '계산 결과 비교하기')
        a4 = cmp(s, [('5×[2 3/4]', '[1 3/8]×10'), ('[3/5]×[5/6]', '[3/4]×[2/3]×[5/6]')])
        s.page_break()
        step(s, 4, '잘못 고치기', '친구의 계산')
        s.text(rd('친구가 [1 4/9]×[2 5/6]을 잘못 계산했어요.'))
        wrong(s, '잘못된 계산', '[1 4/9]×[2 5/6] = [1 2/9]×[2 5/3] = [11/9]×[11/3] = [121/27] = [4 13/27]')
        a5 = chooses(s, [('잘못된 까닭은?', ['대분수를 가분수로 바꾸기 전에 진분수 부분끼리 약분했어요', '분모끼리 더했어요'], 0)])
        a5b = chain(s, [('옳은 계산', '[1 4/9]×[2 5/6] = [{13}/9]×[{17}/6] = [{221}/{54}]'), ('', '= [{4} {5}/54]')])
        step(s, 5, '태극기', '생활 속 분수의 곱셈')
        s.text(rd('태극기의 가로는 72 cm이고, 세로는 가로의 [2/3], 태극 문양의 지름은 세로의 [1/2]이에요. 괘(검은 막대)의 길이는 태극 문양 지름의 [1/2]이에요.'))
        flag_fig(s)
        a6 = calc(s, [{'q': '태극 문양의 지름을 한 식으로 구해 보세요.', 'e': '72×[2/3]×[1/2]', 'n': 24, 'unit': 'cm'},
                      {'q': '괘의 길이는 몇 cm일까요?', 'x': '24×[1/2]', 'show': '(지름)×[1/2]', 'n': 12, 'unit': 'cm'}])
        ans = '11차시  ① %s  ② %s  ③ %s  ④ %s (13 3/4 = 13 3/4, 1/2 > 5/12)  ⑤ %s / %s  ⑥ %s' % (
            a1, a2, ', '.join(a3), ' '.join(a4), a5[0], a5b, ', '.join(a6))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 6, '도전하기', '네 가지 분수의 곱셈 정리')
        a7 = chain(s, [('(분수)×(자연수)', '[2/7]×3 = [2×{3}/7] = [{6}/7]'),
                       ('(자연수)×(분수)', '2×[1 5/6] = 2×[{11}/6] = [{11}/3] = [{3} {2}/3]'),
                       ('(진분수)×(진분수)', '[2/9]×[4/5] = [2×{4}/9×{5}] = [{8}/{45}]'),
                       ('(대분수)×(대분수)', '[1 3/7]×[2 1/2] = [{10}/7]×[{5}/2] = [{25}/7] = [{3} {4}/7]')])
        challenge_why(s, '네 가지 곱셈 가운데 가장 조심해야 할 점을 한 가지 써 보세요.')
        ans += '  ⑦ %s / 왜: 예) 대분수는 가분수로 바꾼 다음에 약분해요.' % a7
    return ans


# ================================================================ 이야기 버전 (우리 반 전통 음식 장터)
ST_SCENE = ('누리초등학교 5학년 3반은 학교 축제 날 ‘전통 음식 장터’를 열기로 했어요. 장터 반장 도윤이와 서아, 지호, 하은, 민준, 유나가 '
            '모둠을 나누어 식혜·인절미·약과·다식을 준비하고 보자기로 선물 꾸러미를 싸요.')
NOTE_ST = ['식혜: 한 병에 쌀 [2/5]컵 → 3병 만들기', '보자기 끈: 6 m의 [2/3]만큼 잘라 쓰기',
           '약과 쟁반: 쟁반의 [3/4]에 한지 깔기, 그 [1/2]에 약과 올리기', '인절미 반죽: 한 판에 찹쌀가루 [1 1/4] kg → 4판']
RULE_PW_ST = ['(진분수)×(자연수)는 분수의 분모는 ', (['그대로 쓰고', '자연수를 곱하고'], 0), ' 분자에 ', (['자연수를 곱하여', '자연수를 더하여'], 0),
              ' 계산합니다. 약분은 ', (['곱한 뒤에 해도 되고, 먼저 해도 돼요', '반드시 곱하기 전에 해야 해요'], 0), '.']
RULE_MW_ST = ['(대분수)×(자연수)는 대분수를 ', (['자연수와 진분수의 합', '분자와 분모의 합'], 0), '으로 나타내어 계산하거나, 대분수를 ',
              (['가분수', '진분수'], 0), '로 나타내어 분모는 그대로 쓰고 분자에 자연수를 곱하여 계산해요. 약분은 대분수를 가분수로 ',
              (['바꾼 뒤에', '바꾸기 전에'], 0), ' 해요.']
RULE_WP_ST = ['8의 [1/4]은 8의 [1/4]배와 같으므로 ', (['8×[1/4]', '8+[1/4]', '8−[1/4]'], 0), '로 나타내요. (자연수)×(진분수)는 분수의 분모는 ',
              (['그대로 쓰고', '자연수를 곱하고'], 0), ' 자연수와 ', (['분자를 곱하여', '분모를 곱하여'], 0), ' 계산합니다.']
RULE_WM_ST = RULE_WM[:-1] + [' 계산해요. (자연수)×(대분수)는 (자연수)×1보다 ', (['커요', '작아요'], 0), '.']
RULE_PP_ST = ['(진분수)×(진분수)는 분자는 ', (['분자끼리', '분모끼리'], 0), ', 분모는 ', (['분모끼리', '분자끼리'], 0),
              ' 곱하여 계산합니다. 이때 넓이 모델에서 나눈 조각의 크기는 모두 ', (['같아야 해요', '달라도 돼요'], 0), '.']
RULE_3F = ['세 분수의 곱셈도 분자는 ', (['분자끼리', '분모끼리'], 0), ', 분모는 분모끼리 곱해요. 약분은 곱하는 과정에서 해도 되고 ',
           (['곱하기 전에 먼저 해도 돼요', '반드시 다 곱한 뒤에만 해요'], 0), '. 먼저 약분하면 곱하는 수가 ', (['작아져 계산이 쉬워요', '커져 계산이 어려워요'], 0), '.']


def st1(s, lv):
    head(s, 1, '개념 찾기(S)', '전통 음식 장터를 열어요', '장터를 준비할 때 분수의 곱셈을 써야 하는 때는 언제일까요?', ST_SCENE)
    note_line(s)
    if lv == '기본형':
        step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
        s.text('장터 반장 도윤이가 가져온 ‘5학년 3반 장터 준비 쪽지’예요. 쪽지를 보고 세 칸에 써 보세요.')
        s.fill([rd(t) for t in NOTE_ST])
        panes(s, lv, [('보여요', '쪽지에 ~이 보여요', '식혜 한 병에 쌀 [2/5]컵처럼 분수로 나타낸 양이 보여요.'),
                      ('생각해요', '~을 구하려면 ~해야 할 것 같아요', '식혜 3병에 넣을 쌀은 [2/5]컵을 3번 더하면 될 것 같아요.'),
                      ('궁금해요', '~은 어떻게 계산할까?', '분수에 자연수를 곱하는 것은 어떻게 계산할까?')])
        step(s, 1, '그려 보기', '더하기를 곱하기로')
        s.text(rd('서아네 모둠은 식혜를 3병 만들어요. 한 병에 쌀이 [2/5]컵 들어가요.'))
        a2 = blanks(s, lv, ['식혜 3병에 넣을 쌀은 [2/5]+[2/5]+[2/5]컵이에요. 이것은 [2/5]를 ', (['3번 더한 것', '3으로 나눈 것', '3에서 뺀 것'], 0),
                            '이므로 곱셈식 ', (['[2/5]×3', '[2/5]+3', '[6/15]'], 0), '으로 나타낼 수 있어요.'])
        assert ev('[2/5]+[2/5]+[2/5]') == ev('[2/5]×3')
        w2 = why_ans(s, lv, '같은 분수를 여러 번 더한 것을 왜 곱셈으로 나타낼 수 있을까요?',
                     '‘4+4+4를 4×3으로 나타내는 것처럼, [2/5]를 3번 더한 것도 ~으로 나타내요.’ 꼴로 써요.',
                     '4+4+4를 4×3으로 나타내는 것처럼, 같은 수를 여러 번 더하는 것은 곱셈이에요. 그래서 [2/5]를 3번 더한 것도 [2/5]×3으로 나타낼 수 있어요.')
        step(s, 2, '말해 보기', '분수만큼 떠올리기')
        s.text(rd('하은이가 송편 15개 중 [2/5]만큼을 손님 맛보기용으로 덜어 놓기로 했어요. 15개를 똑같이 5부분으로 나누고 2부분을 색칠해 보세요.'
                  + (' 점선으로 5부분을 나누어 두었어요.' if lv == '기본형' else '')))
        part_fig(s, 15, 5, 2, '송편 15개', lv == '기본형', discrete=True)
        a3 = calc(s, [{'q': '15의 [2/5]는 몇 개일까요?', 'x': '15×[2/5]', 'show': '15의 [2/5]', 'n': 6, 'unit': '개'}])
        step(s, 3, '약속하기', '대분수·가분수·약분 떠올리기')
        s.text('대분수와 가분수를 바꾸고, 아래 두 분수는 기약분수로 나타내 보세요.' + (' 기약분수는 분모와 분자를 최대공약수로 나누면 한 번에 돼요.' if lv == '기본형' else ''))
        a4 = chain(s, ['[1 3/4] = [{7}/4]', '[11/3] = [{3} {2}/3]', '[6/9] = [{2}/{3}]', '[12/16] = [{3}/{4}]'])
        step(s, 4, '확인하기', '곱하면 항상 커질까?')
        a5 = chooses(s, [('보자기 끈 6 m의 [2/3]만큼은 6 m와 비교하면?', ['6 m보다 짧아요', '6 m보다 길어요', '6 m와 같아요'], 0),
                         ('인절미 반죽 [1 1/4] kg씩 4판은 4 kg과 비교하면?', ['4 kg보다 많아요', '4 kg보다 적어요', '4 kg과 같아요'], 0)])
        assert ev('6×[2/3]') < 6 and ev('[1 1/4]×4') > 4
        w5 = why_ans(s, lv, '6 m의 [2/3]만큼이 6 m보다 짧은 까닭을 써 봐요.', '‘[2/3]는 1보다 작아서, 6 m의 ~만 쓰기 때문이에요.’ 꼴로 써요.',
                     '[2/3]는 1보다 작아서, 6 m를 3부분으로 나눈 것 중 2부분, 즉 6 m의 일부분만 쓰기 때문이에요.')
        ans = '1차시  ① (자유)  ② %s / 왜: %s  ③ %s  ④ %s  ⑤ %s / 왜: %s' % (', '.join(a2), w2, a3[0], a4, ', '.join(a5), w5)
    else:  # 도전형
        step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
        s.text('서아가 가져온 ‘둘째 날 장터 준비 쪽지’예요. 쪽지를 보고 세 칸에 써 보세요.')
        s.fill([rd(t) for t in ['수정과: 한 통에 계피물 [3/4] L → 5통 만들기', '포장 리본: 9 m의 [4/9]만큼 잘라 쓰기',
                                '다식 판: 판의 [2/3]에 콩가루, 그 [3/4]에 꽃 모양 찍기', '꿀떡 반죽: 한 판에 쌀가루 [1 2/3] kg → 3판']])
        panes(s, lv, [('보여요', '쪽지에서 ~ 보여요', ''), ('생각해요', '~을 구할 때 ~하면 될 것 같아요', ''), ('궁금해요', '~은 어떻게 구할까?', '')])
        step(s, 1, '그려 보기', '더하기를 곱하기로')
        s.text(rd('지호네 모둠은 수정과를 5통 만들어요. 한 통에 계피물이 [3/4] L 들어가요.'))
        a2 = blanks(s, lv, ['수정과 5통에 넣을 계피물은 [3/4]을 ', (['5번 더한 것', '5로 나눈 것', '5에서 뺀 것'], 0), '이므로 곱셈식 ', (['[3/4]×5', '[3/4]+5', '[15/20]'], 0),
                            '으로 나타내요. 계산하면 ', (['[3 3/4] L', '[15/4] mL', '[3/20] L'], 0), '예요.'])
        assert ev('[3/4]+[3/4]+[3/4]+[3/4]+[3/4]') == ev('[3/4]×5') == F('3 3/4')
        w2 = why_ans(s, lv, '[3/4]+[3/4]+[3/4]+[3/4]+[3/4]보다 [3/4]×5로 쓰면 어떤 점이 좋을까요?', '',
                     '같은 수를 여러 번 쓰지 않아도 되어 짧고, 몇 번 더했는지 한눈에 알 수 있어요.')
        step(s, 2, '말해 보기', '분수만큼 떠올리기')
        s.text(rd('민준이가 송편 18개 중 [5/6]만큼을 접시에 담기로 했어요. 18개를 똑같이 6부분으로 나누고 5부분을 색칠해 보세요.'))
        part_fig(s, 18, 6, 5, '송편 18개', False, discrete=True)
        a3 = calc(s, [{'q': '18의 [5/6]는 몇 개일까요?', 'x': '18×[5/6]', 'show': '18의 [5/6]', 'n': 15, 'unit': '개'}])
        step(s, 3, '약속하기', '대분수·가분수·약분 떠올리기')
        a4 = chain(s, ['[2 5/6] = [{17}/6]', '[19/4] = [{4} {3}/4]', '[15/25] = [{3}/{5}]', '[14/42] = [{1}/{3}]'])
        step(s, 4, '확인하기', '곱하면 항상 커질까?')
        a5 = chooses(s, [('리본 9 m의 [4/9]만큼은 9 m와 비교하면?', ['9 m보다 짧아요', '9 m보다 길어요', '9 m와 같아요'], 0),
                         ('쌀가루 [1 2/3] kg씩 3판은 3 kg과 비교하면?', ['3 kg보다 많아요', '3 kg보다 적어요', '3 kg과 같아요'], 0)])
        assert ev('9×[4/9]') < 9 and ev('[1 2/3]×3') > 3
        w5 = why_ans(s, lv, '쌀가루 [1 2/3] kg씩 3판이 3 kg보다 많은 까닭을 써 봐요.', '',
                     '[1 2/3]은 1보다 커서, 1 kg씩 3판인 3 kg보다 한 판마다 [2/3] kg씩 더 많기 때문이에요.')
        ans = '1차시  ① (자유)  ② %s / 왜: %s  ③ %s  ④ %s  ⑤ %s / 왜: %s' % (', '.join(a2), w2, a3[0], a4, ', '.join(a5), w5)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 쪽지의 인절미 반죽')
        a6 = calc(s, [{'q': '한 판에 찹쌀가루 [1 1/4] kg씩 4판을 만들어요. [1 1/4]을 4번 더해서 필요한 찹쌀가루가 모두 몇 kg인지 구해 보세요.',
                       'e': '[1 1/4]×4', 'n': 5, 'unit': 'kg'}])
        a6 += [pk(s, '[3/7]+[3/7]+[3/7]+[3/7]을 곱셈식으로 나타내면?', ['[3/7]×4', '[12/28]', '[3/7]+4'], 0)]
        assert ev('[3/7]+[3/7]+[3/7]+[3/7]') == ev('[3/7]×4')
        ans += '  ⑥ %s' % ', '.join(a6)
    return ans


def st2(s, lv):
    head(s, 2, '개념 구축하기(O)', '식혜 만들기 ― (진분수)×(자연수)', '(진분수)×(자연수)는 어떻게 계산할까요?',
         '서아네 모둠이 식혜를 만들어요. 한 병에 쌀을 [2/5]컵씩, 모두 3병을 만들어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '식혜 쌀 담기')
        rule_first(s, lv, '(진분수)×(자연수)는 어떻게 계산할까요?', '‘내 규칙: 분모는 ~ 쓰고, 분자에 ~을 곱해요.’ 꼴로 써요.')
        s.text('쌀을 3번 담아 막대에 색칠해 보세요. 막대 하나가 1컵이에요.' + (' 첫 번째로 담은 쌀은 색칠해 두었어요.' if lv == '기본형' else ''))
        pour_fig(s, 5, '2/5', 3, 1 if lv == '기본형' else 0, '컵')
        a1 = chain(s, ['[2/5]컵씩 3번 담은 것은 [2/5]컵의 {3}배이므로 [2/5]×{3}으로 나타내요.', '[2/5]×3 = [2/5]+[2/5]+[2/5] = [2×{3}/5]',
                       ('', '= [{6}/5] = [{1} {1}/5]')])
        step(s, 1, '그려 보기', '수정과 계피물')
        s.text(rd('지호는 수정과 한 통에 계피물을 [5/6] L씩 넣어요. 2통을 만들려면 계피물은 몇 L 필요할까요? 막대에 [5/6]만큼씩 2번 담고 계산해 보세요. '
                  '막대 하나가 1 L이고 작은 칸 하나는 [1/6] L예요.'))
        pour_fig(s, 6, '5/6', 2, 1 if lv == '기본형' else 0, ' L')
        a2 = chain(s, ['[5/6]×2 = [5/6]+[5/6] = [5+{5}/6]', ('', '= [5×{2}/6] = [{10}/6] = [{1} {4}/6]')])
        step(s, 2, '말해 보기', '약분은 언제 할까?')
        s.text(rd('식혜 한 병에 설탕을 [5/12]컵씩 넣어요. 8병이면 설탕은 몇 컵일까요? 서아와 지호가 [5/12]×8을 서로 다른 방법으로 계산했어요. '
                  '지호는 12와 8의 최대공약수 (      )로 먼저 약분했어요.'))
        a3 = chain(s, [('서아', '[5/12]×8 = [5×{8}/12] = [{40}/12] = [{10}/3] = [{3} {1}/3]'), ('지호', '[5/12]×8 = [5×{2}/{3}] = [{10}/3] = [{3} {1}/3]')])
        assert gcd(12, 8) == 4
        a3b = chooses(s, [('서아는?', ['분자와 자연수를 곱한 뒤 약분했어요', '분모와 자연수를 먼저 약분했어요'], 0),
                          ('지호는?', ['분자와 자연수를 곱한 뒤 약분했어요', '분모와 자연수를 먼저 약분했어요'], 1)])
        w3 = why_ans(s, lv, '약분을 먼저 하면 어떤 점이 좋을까요?', '‘먼저 약분하면 곱하는 수가 ~져서 계산이 ~해요.’ 꼴로 써요.',
                     '먼저 약분하면 곱하는 수가 작아져서 계산이 쉬워요. 지호는 5×2만 하면 되었지만 서아는 5×8을 하고 다시 약분해야 했어요.')
        step(s, 3, '약속하기', '(진분수)×(자연수)')
        a4 = blanks(s, lv, RULE_PW_ST)
        step(s, 4, '확인하기', '장터 재료 계산')
        if lv == '기본형':
            s.text('분모는 그대로 쓰고 분자에 자연수를 곱해요. 약분하지 않아도, 가분수로 써도 맞아요.')
        a5 = calc(s, [{'e': '[3/7]×2', 'a': '6/7'}, {'e': '[7/10]×4', 'a': '2 4/5'}, {'e': '[5/9]×6', 'a': '3 1/3'},
                      {'q': '민준이는 약과 한 개에 조청을 [3/8]컵씩 발라요. 약과 12개에는 조청이 모두 몇 컵 필요할까요?', 'e': '[3/8]×12', 'a': '4 1/2', 'unit': '컵'}])
        ans = '2차시  ① 예상 예: 분모는 그대로, 분자에 자연수를 곱해요. / %s (1 1/5컵)  ② %s (=1 2/3 L)  ③ 4 / %s, %s / 왜: %s  ④ %s  ⑤ %s' % (
            a1, a2, a3, ', '.join(a3b), w3, ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '식혜 엿기름 담기')
        rule_first(s, lv, '[3/8]×4는 [3/8]보다 클까요, 작을까요?', '')
        s.text(rd('식혜 한 병에 엿기름을 [3/8]컵씩 넣어요. 4병에 넣을 엿기름을 막대에 색칠해 보세요. 막대 하나가 1컵이에요.'))
        pour_fig(s, 8, '3/8', 4, 0, '컵')
        a1 = chain(s, ['[3/8]컵씩 4번 담은 것은 [3/8]컵의 {4}배이므로 [3/8]×{4}로 나타내요.', '[3/8]×4 = [3/8]+[3/8]+[3/8]+[3/8] = [3×{4}/8]',
                       ('', '= [{12}/8] = [{1} {1}/2]')])
        step(s, 1, '그려 보기', '수정과와 계피물')
        s.text(rd('지호는 수정과 한 통에 계피물을 [2/3] L씩 넣어요. 4통을 만들려면 계피물은 몇 L 필요할까요? 막대에 [2/3]만큼씩 4번 담고 계산해 보세요.'))
        pour_fig(s, 3, '2/3', 4, 0, ' L')
        a2 = chain(s, ['[2/3]×4 = [2/3]+[2/3]+[2/3]+[2/3] = [2+2+2+{2}/3]', ('', '= [2×{4}/3] = [{8}/3] = [{2} {2}/3]')])
        step(s, 2, '말해 보기', '약분은 언제 할까?')
        s.text(rd('식혜 한 병에 설탕을 [7/15]컵씩 넣어요. 10병이면 설탕은 몇 컵일까요? 서아와 지호가 [7/15]×10을 서로 다른 방법으로 계산했어요.'))
        a3 = chain(s, [('서아', '[7/15]×10 = [7×{10}/15] = [{70}/15] = [{14}/3] = [{4} {2}/3]'), ('지호', '[7/15]×10 = [7×{2}/{3}] = [{14}/3] = [{4} {2}/3]')])
        a3b = chooses(s, [('지호가 15와 10을 약분할 때 나눈 수는?', ['5', '3', '10'], 0)])
        w3 = why_ans(s, lv, '서아가 [70/15]를 약분할 때와 지호가 먼저 약분할 때 나눈 수를 비교해 써 봐요.', '',
                     '두 사람 모두 5로 나누었어요. 서아는 곱한 뒤 70과 15를 5로, 지호는 곱하기 전에 15와 10을 5로 나누어 더 작은 수로 계산했어요.')
        step(s, 3, '약속하기', '(진분수)×(자연수)')
        a4 = blanks(s, lv, ['[5/9]×6은 분모 9를 ', (['그대로 두고', '6과 곱하고'], 0), ' 분자 5에 6을 곱해 [30/9]이에요. 9와 6을 먼저 약분하면 ',
                            (['[10/3]', '[30/54]', '[5/3]'], 0), '이 돼요.'])
        assert ev('[5/9]×6') == F('10/3')
        step(s, 4, '확인하기', '장터 재료 계산')
        a5 = calc(s, [{'e': '[4/11]×2', 'a': '8/11'}, {'e': '[5/8]×6', 'a': '3 3/4'}, {'e': '[7/12]×9', 'a': '5 1/4'},
                      {'q': '유나는 꾸러미 한 개에 리본을 [5/6] m씩 써요. 꾸러미 15개에는 리본이 모두 몇 m 필요할까요?', 'e': '[5/6]×15', 'a': '12 1/2', 'unit': 'm'}])
        ans = '2차시  ① 예상 예: 4배라서 커요. / %s (1 1/2컵)  ② %s (2 2/3 L)  ③ %s, %s / 왜: %s  ④ %s  ⑤ %s' % (
            a1, a2, a3, a3b[0], w3, ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 장터 문제')
        a6 = calc(s, [{'q': '한 변이 [4/9] m인 정사각형 돗자리의 둘레는 몇 m일까요?', 'e': '[4/9]×4', 'a': '1 7/9', 'unit': 'm'}])
        a6b = cmp(s, [('[5/6]×3', '[3/4]×4')])
        challenge_why(s, '두 곱의 크기를 어떻게 비교했는지 써 보세요.')
        ans += '  ⑥ %s, %s (2 1/2 < 3)' % (a6[0], a6b[0])
    return ans


def st3(s, lv):
    head(s, 3, '개념 구축하기(O)', '인절미 반죽 ― (대분수)×(자연수)', '(대분수)×(자연수)는 어떻게 계산할까요?',
         '하은이네 모둠은 인절미 반죽을 만들어요. 한 판에 찹쌀가루 [1 2/5] kg씩 3판을 만들어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '반죽 모으기')
        e1 = est(s, '필요한 찹쌀가루는 몇 kg쯤일까요?', ['3 kg보다 많고 6 kg보다 적어요', '3 kg보다 적어요', '6 kg보다 많아요'], 0)
        s.text(rd('찹쌀가루를 3판 담아 색칠하고, 자연수끼리, 진분수끼리 모아 보세요. 막대 하나가 1 kg이고 작은 칸 하나는 [1/5] kg이에요.'
                  + (' 첫 번째 판은 색칠해 두었어요.' if lv == '기본형' else '')))
        pour_fig(s, 5, '1 2/5', 3, 1 if lv == '기본형' else 0, ' kg')
        a1 = chain(s, [('방법 1', '[1 2/5]×3 = (1+1+1)+([2/5]+[2/5]+[2/5])'), ('', '= (1×{3})+([2/5]×{3}) = {3}+[{6}/5] = [{4} {1}/5]')])
        assert 3 < ev('[1 2/5]×3') < 6
        step(s, 1, '그려 보기', '가분수로 뛰기')
        s.text(rd('[1 2/5]를 가분수로 나타내면 [7/5]이에요. 수직선에서 [7/5]만큼씩 3번 뛰어 보세요.' + (' 첫 번째 뛰기를 그려 두었어요.' if lv == '기본형' else '')))
        jump_fig(s, 5, 5, '7/5', 3, lv == '기본형')
        a2 = chain(s, [('방법 2', '[1 2/5]×3 = [{7}/5]×3 = [7×{3}/5] = [{21}/5] = [{4} {1}/5]')])
        step(s, 2, '말해 보기', '하은이의 실수')
        s.text(rd('하은이가 떡고물 [2 5/6] kg씩 4판의 양을 계산했는데 답이 이상해요.'))
        wrong(s, '하은이의 계산', '[2 5/6]×4 = [2 5/3]×2 = [11/3]×2 = [22/3] = [7 1/3]')
        a3 = chooses(s, [('잘못된 까닭은?', WHY_MIX, 0)])
        a3b = chain(s, [('옳은 계산', '[2 5/6]×4 = [{17}/6]×4 = [17×{2}/{3}] = [{34}/3] = [{11} {1}/3]')])
        w3 = why_ans(s, lv, '대분수의 분모와 자연수를 바로 약분하면 왜 안 될까요?',
                     '‘분모 6은 진분수 부분에만 있어서, 바로 약분하면 자연수 부분 ~이 ~되지 않아요.’ 꼴로 써요.',
                     '[2 5/6]에서 분모 6은 진분수 부분 [5/6]에만 있어서, 바로 약분하면 자연수 부분 2는 함께 나누어지지 않아요. 그래서 가분수 [17/6]로 바꾼 다음 약분해야 해요.')
        step(s, 3, '약속하기', '(대분수)×(자연수)')
        a4 = blanks(s, lv, RULE_MW_ST)
        step(s, 4, '확인하기', '떡 반죽 계산')
        if lv == '기본형':
            s.text('대분수를 가분수로 바꾼 다음 약분해요. 가분수로 써도, 대분수로 써도 맞아요.')
        a5 = calc(s, [{'e': '[1 1/6]×5', 'a': '5 5/6'}, {'e': '[2 3/8]×4', 'a': '9 1/2'}, {'e': '[3 1/4]×6', 'a': '19 1/2'},
                      {'q': '꿀떡 반죽은 한 판에 찹쌀가루가 [1 3/5] kg 들어가요. 5판을 만들려면 찹쌀가루는 몇 kg 필요할까요?', 'e': '[1 3/5]×5', 'n': 8, 'unit': 'kg'}])
        ans = '3차시  ① %s / %s  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (e1, a1, a2, a3[0], a3b, w3, ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '반죽 모으기')
        s.text(rd('둘째 날에는 한 판에 찹쌀가루 [1 3/4] kg씩 4판을 만들어요. 막대 하나가 1 kg이에요.'))
        e1 = est(s, '필요한 찹쌀가루는 몇 kg쯤일까요?', ['4 kg보다 많고 8 kg보다 적어요', '4 kg보다 적어요', '8 kg보다 많아요'], 0)
        pour_fig(s, 4, '1 3/4', 4, 0, ' kg')
        a1 = chain(s, [('방법 1', '[1 3/4]×4 = (1+1+1+1)+([3/4]+[3/4]+[3/4]+[3/4])'), ('', '= (1×{4})+([3/4]×{4}) = {4}+{3} = {7}')])
        step(s, 1, '그려 보기', '가분수로 뛰기')
        s.text(rd('콩고물은 한 판에 [2 2/3] kg씩 3판이에요. [2 2/3]을 가분수로 나타내고 수직선에서 그만큼씩 3번 뛰어 보세요.'))
        jump_fig(s, 8, 3, '8/3', 3, False)
        a2 = chain(s, [('방법 2', '[2 2/3]×3 = [{8}/3]×3 = [8×{3}/3] = [{24}/3] = {8}')])
        step(s, 2, '말해 보기', '하은이의 실수')
        s.text(rd('하은이가 떡고물 [1 7/12] kg씩 9판의 양을 계산했는데 답이 이상해요.'))
        wrong(s, '하은이의 계산', '[1 7/12]×9 = [1 7/4]×3 = [11/4]×3 = [33/4] = [8 1/4]')
        a3 = chooses(s, [('잘못된 까닭은?', ['대분수를 가분수로 바꾸기 전에 분모 12와 9를 약분했어요', '분자에 9를 곱하지 않았어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[1 7/12]×9 = [{19}/12]×9 = [19×{3}/{4}] = [{57}/4] = [{14} {1}/4]')])
        w3 = why_ans(s, lv, '하은이처럼 계산하면 답이 실제보다 작아지는 까닭을 써 봐요.', '',
                     '분모 12는 진분수 부분에만 있는데 3으로 나누면서 자연수 부분 1은 함께 나누지 않았어요. 그래서 [1 7/12]×9가 아닌 다른 곱을 구하게 되었어요.')
        step(s, 3, '약속하기', '(대분수)×(자연수)')
        a4 = blanks(s, lv, ['[2 3/10]×4를 계산할 때 [2 3/10]을 ', (['[23/10]', '[5/10]', '[13/10]'], 0), '으로 바꾼 뒤 10과 4를 약분하면 [46/5] = ',
                            (['[9 1/5]', '[9 2/5]', '[8 1/5]'], 0), '이에요.'])
        assert ev('[2 3/10]×4') == F('9 1/5')
        step(s, 4, '확인하기', '떡 반죽 계산')
        a5 = calc(s, [{'e': '[1 5/8]×6', 'a': '9 3/4'}, {'e': '[2 2/9]×3', 'a': '6 2/3'}, {'e': '[4 1/6]×9', 'a': '37 1/2'},
                      {'q': '떡볶이 떡 반죽은 한 판에 쌀가루가 [2 4/7] kg 들어가요. 7판을 만들려면 쌀가루는 몇 kg 필요할까요?', 'e': '[2 4/7]×7', 'n': 18, 'unit': 'kg'}])
        ans = '3차시  ① %s / %s  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (e1, a1, a2, a3[0], a3b, w3, ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 가장 큰 대분수와 3의 곱')
        s.text('수 카드 2, 5, 7을 한 번씩 모두 사용하여 가장 큰 대분수를 만들고, 그 대분수와 3의 곱을 구해 보세요.')
        a6 = build(s, lv, [2, 5, 7], ['m', 3], 'max')
        challenge_why(s, '가장 큰 대분수를 어떻게 만들었는지 까닭과 함께 써 보세요.')
        ans += '  ⑥ %s / 왜: 예) 자연수 부분에 가장 큰 7을 놓고, 남은 2와 5로 진분수 2/5를 만들었어요.' % a6
    return ans


def st4(s, lv):
    head(s, 4, '개념 구축하기(O)', '보자기 끈과 리본 ― (자연수)×(진분수)', '(자연수)×(진분수)는 어떻게 계산할까요?',
         '유나는 선물 꾸러미를 보자기로 싸요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '끈 잘라 쓰기')
        s.text(rd('보자기 매듭 장식에 끈 8 m의 [1/4]만큼을 잘라 썼어요. 8 m 막대를 똑같이 4부분으로 나누고 1부분을 색칠해 보세요.'
                  + (' 나누는 점선을 그려 두었어요.' if lv == '기본형' else '')))
        part_fig(s, 8, 4, 1, '끈 8 m', lv == '기본형', unit='m')
        a1 = calc(s, [{'q': '유나가 쓴 끈은 몇 m일까요?', 'e': '8×[1/4]', 'n': 2, 'unit': 'm'}])
        w1 = why_ans(s, lv, '8 m의 [1/4]만큼을 왜 8×[1/4]로 나타낼 수 있을까요?', '‘8의 2배를 8×2로 나타내는 것처럼, 8의 [1/4]배도 ~로 나타내요.’ 꼴로 써요.',
                     '8의 2배를 8×2로 나타내는 것처럼, 8의 [1/4]만큼은 8의 [1/4]배라서 8×[1/4]로 나타낼 수 있어요.')
        step(s, 1, '그려 보기', '리본의 4분의 3만큼')
        s.text(rd('도윤이는 리본 3 m의 [3/4]만큼으로 꽃 매듭을 만들어요. 3 m 막대를 똑같이 4부분으로 나누고 3부분을 색칠한 다음, 작은 눈금을 보며 계산해 보세요.'))
        part_fig(s, 3, 4, 3, '리본 3 m', lv == '기본형', fine=True, unit='m')
        a2 = chain(s, ['3×[1/4] = [{3}/4]', '3×[3/4] = (3×[1/4])×{3} = [{3}/4]×3', ('', '= [3×{3}/4] = [{9}/4] = [{2} {1}/4]')])
        step(s, 2, '말해 보기', '순서를 바꾸면?')
        s.text(rd('[3/4] m씩 리본 3개와 3 m의 [3/4]만큼은 길이가 같을까요?'))
        a3 = chain(s, ['[3/4]×3 = [3×{3}/4] = [{9}/4]', '3×[3/4] = [3×{3}/4] = [{9}/4]'])
        a3b = blanks(s, lv, ['두 곱은 ', (['같아요', '달라요'], 0), '. 두 수의 곱셈은 순서를 바꾸어 계산해도 결과가 ', (['같아요', '달라져요'], 0), '.'])
        w3 = why_ans(s, lv, '[3/4]×3과 3×[3/4]의 곱이 같은 까닭을 써 봐요.', '‘두 식 모두 분모 4는 그대로 두고 ~과 ~을 곱해서 ~가 되기 때문이에요.’ 꼴로 써요.',
                     '두 식 모두 분모 4는 그대로 두고 분자 3과 자연수 3을 곱해서 [9/4]가 되기 때문이에요. 계산하는 방법이 같아서 곱도 같아요.')
        step(s, 3, '약속하기', '(자연수)×(진분수)')
        a4 = blanks(s, lv, RULE_WP_ST)
        step(s, 4, '확인하기', '장터 손님 계산')
        if lv == '기본형':
            s.text('분모는 그대로 쓰고 자연수와 분자를 곱해요. 약분하지 않아도, 가분수로 써도 맞아요.')
        a5 = calc(s, [{'e': '5×[1/6]', 'a': '5/6'}, {'e': '4×[2/7]', 'a': '1 1/7'}, {'e': '10×[3/4]', 'a': '7 1/2'},
                      {'q': '장터 첫 시간에 손님 36명이 왔어요. 그중 [5/9]가 식혜를 샀어요. 식혜를 산 손님은 몇 명일까요?', 'e': '36×[5/9]', 'n': 20, 'unit': '명'}])
        ans = '4차시  ① %s / 왜: %s  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (a1[0], w1, a2, a3, ', '.join(a3b), w3, ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '끈 잘라 쓰기')
        s.text(rd('서아는 매듭 장식에 끈 12 m의 [1/3]만큼을 잘라 썼어요. 12 m 막대를 똑같이 3부분으로 나누고 1부분을 색칠해 보세요.'))
        part_fig(s, 12, 3, 1, '끈 12 m', False, unit='m')
        a1 = calc(s, [{'q': '서아가 쓴 끈은 몇 m일까요?', 'e': '12×[1/3]', 'n': 4, 'unit': 'm'}])
        w1 = why_ans(s, lv, '12 m의 [2/3]만큼은 12 m의 [1/3]만큼의 몇 배인지 까닭과 함께 써 봐요.', '',
                     '[2/3]은 [1/3]이 2개이므로 12 m의 [2/3]만큼은 4 m의 2배인 8 m예요.')
        step(s, 1, '그려 보기', '리본의 5분의 3만큼')
        s.text(rd('도윤이는 리본 4 m의 [3/5]만큼으로 꽃 매듭을 만들어요. 4 m 막대를 똑같이 5부분으로 나누고 3부분을 색칠한 다음 계산해 보세요.'))
        part_fig(s, 4, 5, 3, '리본 4 m', False, fine=True, unit='m')
        a2 = chain(s, ['4×[1/5] = [{4}/5]', '4×[3/5] = (4×[1/5])×{3} = [{4}/5]×3', ('', '= [4×{3}/5] = [{12}/5] = [{2} {2}/5]')])
        step(s, 2, '말해 보기', '순서를 바꾸면?')
        s.text(rd('[2/5] m씩 리본 4개와 4 m의 [2/5]만큼을 비교해 보세요.'))
        a3 = chain(s, ['[2/5]×4 = [2×{4}/5] = [{8}/5]', '4×[2/5] = [4×{2}/5] = [{8}/5]'])
        a3b = blanks(s, lv, ['4 m의 [2/5]만큼은 ', (['4×[2/5]', '4+[2/5]'], 0), '로 나타내요. [2/5] m씩 4개와 길이가 ', (['같아요', '달라요'], 0), '.'])
        w3 = why_ans(s, lv, '[2/5] m씩 4개를 이어 붙인 길이와 4 m의 [2/5]만큼이 같은 까닭을 써 봐요.', '',
                     '두 식 모두 분모 5는 그대로 두고 분자 2와 4를 곱해서 [8/5]가 되기 때문이에요.')
        step(s, 3, '약속하기', '(자연수)×(진분수)')
        a4 = blanks(s, lv, ['24의 [3/8]은 24를 8부분으로 나눈 것 중 ', (['3부분', '8부분'], 0), '이므로 24×[3/8] = ', (['9', '[72/192]', '[27/8]'], 0), '이에요.'])
        assert ev('24×[3/8]') == 9
        step(s, 4, '확인하기', '장터 손님 계산')
        a5 = calc(s, [{'e': '7×[1/8]', 'a': '7/8'}, {'e': '6×[4/9]', 'a': '2 2/3'}, {'e': '15×[5/6]', 'a': '12 1/2'},
                      {'q': '장터 둘째 시간에 손님 42명이 왔어요. 그중 [4/7]가 약과를 샀어요. 약과를 산 손님은 몇 명일까요?', 'e': '42×[4/7]', 'n': 24, 'unit': '명'}])
        ans = '4차시  ① %s / 왜: %s  ② %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (a1[0], w1, a2, a3, ', '.join(a3b), w3, ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 장터 퀴즈')
        s.ask('곱이 다른 친구는 누구일까요?', blank=False)
        eq_fig(s, ['도윤: 12×[5/6]     유나: [5/6]×12     민준: 6×[5/12]'])
        s.ask('답: (        )', blank=False)
        vs = {'도윤': ev('12×[5/6]'), '유나': ev('[5/6]×12'), '민준': ev('6×[5/12]')}
        assert [k for k, v in vs.items() if list(vs.values()).count(v) == 1] == ['민준']
        a6 = calc(s, [{'q': '다식 틀 한 판에 콩가루를 15 g 넣는데, 장식용으로 그 [4/9]만큼을 따로 덜었어요. 덜어 낸 콩가루는 몇 g일까요?', 'e': '15×[4/9]', 'a': '6 2/3', 'unit': 'g'}])
        challenge_why(s, '도윤이와 유나의 곱이 같은 까닭을 써 보세요.')
        ans += '  ⑥ 민준 (도윤·유나 10, 민준 2 1/2), %s / 왜: 예) 곱하는 두 수의 순서만 바뀌었어요.' % a6[0]
    return ans


def st5(s, lv):
    head(s, 5, '개념 구축하기(O)', '현수막 줄 ― (자연수)×(대분수)', '(자연수)×(대분수)는 어떻게 계산할까요?',
         '장터 입구에 현수막을 달아요. 도윤이가 줄 4 m를 준비했는데, 서아가 “그 줄의 [1 1/3]배는 있어야 해!”라고 했어요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '현수막 줄 길이')
        e1 = est(s, '필요한 줄은 몇 m쯤일까요?', ['4 m보다 조금 더 길어요', '4 m보다 짧아요', '8 m쯤이에요'], 0)
        s.text(rd('‘4×1’ 막대를 색칠하고 4 m를 똑같이 3부분으로 나누어 4×[1/3]만큼 색칠해 보세요.' + (' 나누는 점선을 그려 두었어요.' if lv == '기본형' else '')))
        part_fig(s, 4, 3, 1, '4×[1/3]', lv == '기본형', whole='4×1', unit='m')
        a1 = chain(s, [('방법 1', '4×[1 1/3] = (4×1)+(4×[1/3]) = {4}+[{4}/3] = [{5} {1}/3]')])
        step(s, 1, '그려 보기', '가분수로 계산하기')
        a2 = chain(s, [('방법 2', '4×[1 1/3] = 4×[{4}/3] = [4×{4}/3] = [{16}/3] = [{5} {1}/3]')])
        a2b = chooses(s, [('필요한 줄은 어림한 ‘4 m보다 조금 더’와', ['비슷해요', '많이 달라요'], 0)])
        step(s, 2, '말해 보기', '1보다 작은 수, 큰 수')
        s.text(rd('식혜 6 L의 [3/4]만큼, 1배만큼, [1 3/4]배만큼을 비교해요. 1을 기준으로 [3/4]과 [1 3/4]의 크기를 생각해 보세요.'))
        a3 = cmp3(s, '6×[3/4]', '6×1', '6×[1 3/4]')
        a3b = chain(s, ['6×[3/4] = [{4} {1}/2]', '6×[1 3/4] = 6×[7/4] = [{10} {1}/2]'])
        w3 = why_ans(s, lv, '6에 [3/4]을 곱하면 왜 6보다 작아질까요?', '‘6×[3/4]은 6을 4부분으로 나눈 것 중 ~만이라서 6보다 작아요.’ 꼴로 써요.',
                     '6×[3/4]은 6을 4부분으로 나눈 것 중 3부분만이라서 6보다 작아요. 1보다 작은 수를 곱하면 처음 수의 일부분만 구하는 것이기 때문이에요.')
        step(s, 3, '약속하기', '(자연수)×(대분수)')
        a4 = blanks(s, lv, RULE_WM_ST)
        step(s, 4, '확인하기', '장터 물건 계산')
        a5 = calc(s, [{'e': '5×[1 1/4]', 'a': '6 1/4'}, {'e': '3×[2 2/7]', 'a': '6 6/7'}, {'e': '8×[1 3/4]', 'n': 14},
                      {'q': '약과를 한 봉지에 6개씩 담았어요. 민준이네 모둠은 [2 1/2]봉지만큼의 약과를 팔았어요. 판 약과는 몇 개일까요?', 'e': '6×[2 1/2]', 'n': 15, 'unit': '개'}])
        ans = '5차시  ① %s / %s  ② %s, %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (
            e1, a1, a2, a2b[0], ', '.join(a3), a3b, w3, ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '현수막 줄 길이')
        s.text(rd('둘째 날에는 도윤이가 줄 6 m를 준비했고, 서아가 “그 줄의 [1 1/4]배가 필요해!”라고 했어요.'))
        e1 = est(s, '필요한 줄은 몇 m쯤일까요?', ['6 m보다 조금 더 길어요', '6 m보다 짧아요', '12 m쯤이에요'], 0)
        s.text(rd('‘6×1’ 막대를 색칠하고 6 m를 똑같이 4부분으로 나누어 6×[1/4]만큼 색칠해 보세요.'))
        part_fig(s, 6, 4, 1, '6×[1/4]', False, whole='6×1', unit='m')
        a1 = chain(s, [('방법 1', '6×[1 1/4] = (6×1)+(6×[1/4]) = {6}+[{6}/4] = [{7} {1}/2]')])
        step(s, 1, '그려 보기', '가분수로 계산하기')
        a2 = chain(s, [('방법 2', '6×[1 1/4] = 6×[{5}/4] = [6×{5}/4] = [{30}/4] = [{7} {1}/2]')])
        a2b = chooses(s, [('필요한 줄은 처음 준비한 6 m보다 몇 m 더 길까요?', ['[1 1/2] m', '[1/4] m', '6 m'], 0)])
        step(s, 2, '말해 보기', '1보다 작은 수, 큰 수')
        a3 = cmp3(s, '8×[3/5]', '8×1', '8×[1 3/5]')
        a3b = chain(s, ['8×[3/5] = [{4} {4}/5]', '8×[1 3/5] = 8×[8/5] = [{12} {4}/5]'])
        w3 = why_ans(s, lv, '8×[1 3/5]이 8보다 큰 까닭을 써 봐요.', '', '[1 3/5]은 1보다 커서 8×[1 3/5]은 8에 8의 [3/5]만큼을 더한 것이기 때문이에요.')
        step(s, 3, '약속하기', '(자연수)×(대분수)')
        a4 = blanks(s, lv, ['9×[2 1/6]은 (9×2)+(9×[1/6]) = 18+', (['[1 1/2]', '[1/6]', '[9/54]'], 0), ' = ', (['[19 1/2]', '[18 1/6]', '[19 1/6]'], 0), '이에요.'])
        assert ev('9×[2 1/6]') == F('19 1/2')
        step(s, 4, '확인하기', '장터 물건 계산')
        a5 = calc(s, [{'e': '4×[1 2/7]', 'a': '5 1/7'}, {'e': '6×[2 3/8]', 'a': '14 1/4'}, {'e': '10×[1 4/5]', 'n': 18},
                      {'q': '다식을 한 상자에 8개씩 담았어요. 하은이네 모둠은 [3 3/4]상자만큼의 다식을 팔았어요. 판 다식은 몇 개일까요?', 'e': '8×[3 3/4]', 'n': 30, 'unit': '개'}])
        ans = '5차시  ① %s / %s  ② %s, %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (
            e1, a1, a2, a2b[0], ', '.join(a3), a3b, w3, ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 계산하지 않고 어림하기')
        s.text('계산하지 않고 곱이 10보다 작은지 큰지 어림하여 알맞은 쪽에 ○표 해요.')
        cards = [('10×[3/5]', 0), ('10×[1 1/8]', 1), ('10×[9/10]', 0), ('10×[2 1/3]', 1), ('[4/5]×10', 0)]
        bins = ['10보다 작아요', '10보다 커요']
        grid_fig(s, ['%s %s' % (KO[i], e) for i, (e, k) in enumerate(cards)], cols=3)
        s.choices([(KO[i], opt_text(bins)) for i in range(len(cards))])
        for e, k in cards:
            assert (ev(e) > 10) == (k == 1) and ev(e) != 10
        challenge_why(s, '계산하지 않고도 알 수 있는 까닭을 써 보세요.')
        ans += '  ⑥ %s / 왜: 예) 곱하는 수가 1보다 작으면 10보다 작고, 1보다 크면 10보다 커요.' % ', '.join(
            '%s %s' % (KO[i], '작아요' if k == 0 else '커요') for i, (e, k) in enumerate(cards))
    return ans


def st6(s, lv):
    head(s, 6, '개념 구축하기(O)', '약과 쟁반 ― 진분수의 곱셈', '진분수끼리의 곱셈은 어떻게 계산할까요?', '민준이네 모둠은 약과를 담을 네모 쟁반을 꾸며요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '쟁반의 4분의 1의 2분의 1')
        rule_first(s, lv, '단위분수끼리 곱하면 결과는 어떻게 될까요?', '‘내 규칙: 분자는 ~이고, 분모는 두 분모를 ~한 수예요.’ 꼴로 써요.')
        s.text(rd('쟁반의 [1/4]에 한지를 깔고, 한지를 깐 부분의 [1/2]에 약과를 올렸어요. 쟁반을 세로로 4등분하여 1칸을 색칠하고(1단계), '
                  '가로로 2등분하여 색칠한 부분의 [1/2]만큼 빗금을 그어 보세요(2단계).'
                  + (' 1단계는 색칠해 두었어요.' if lv == '기본형' else ' 가로로 나누는 선도 직접 그어요.')))
        area_fig(s, [('v', 4, 1), ('h', 2, 1)], '약과 쟁반 = 1', lv == '기본형')
        a1 = chain(s, ['[1/4]×[1/2] = [1/4×{2}] = [{1}/{8}]'])
        step(s, 1, '그려 보기', '다식 쟁반')
        s.text(rd('하은이는 다른 쟁반의 [2/3]에 꽃무늬 한지를 깔고, 그 [3/5]에 다식을 올렸어요. 쟁반을 세로로 3등분하여 2칸을 색칠하고, '
                  '가로로 5등분하여 색칠한 부분의 [3/5]만큼 빗금을 그어 보세요.'))
        area_fig(s, [('v', 3, 2), ('h', 5, 3)], '다식 쟁반 = 1', lv == '기본형')
        a2 = chain(s, ['전체를 똑같이 3×5 = {15}칸으로 나누었고, 빗금 친 부분은 2×3 = {6}칸이에요.', '[2/3]×[3/5] = [2×{3}/3×{5}] = [{6}/{15}]'])
        step(s, 2, '말해 보기', '곱한 수의 뜻')
        a3 = chooses(s, [('[2/3]×[3/5]에서 분모끼리 곱한 15(= 3×5)는 그림에서 무엇일까요?', ['쟁반 전체를 똑같이 나눈 칸 수', '빗금 친 칸 수', '색칠한 세로줄 수'], 0),
                         ('분자끼리 곱한 6(= 2×3)은 그림에서 무엇일까요?', ['다식을 올린(빗금 친) 칸 수', '쟁반 전체의 칸 수', '가로로 나눈 줄 수'], 0)])
        w3 = why_ans(s, lv, '진분수끼리 곱할 때 분모끼리 곱하는 까닭을 써 봐요.',
                     '‘세로로 3등분, 가로로 5등분하면 전체가 3×5 = ~칸이 되어서, 한 칸은 ~이기 때문이에요.’ 꼴로 써요.',
                     '세로로 3등분, 가로로 5등분하면 전체가 3×5 = 15칸으로 나뉘어서 한 칸이 [1/15]이 되기 때문이에요. 그래서 분모는 분모끼리 곱해요.')
        step(s, 3, '약속하기', '(진분수)×(진분수)')
        a4 = blanks(s, lv, RULE_PP_ST)
        step(s, 4, '확인하기', '장터 자리 계산')
        if lv == '기본형':
            s.text('분자는 분자끼리, 분모는 분모끼리 곱해요. 약분하지 않아도 맞아요.')
        a5 = calc(s, [{'e': '[1/6]×[1/3]', 'a': '1/18'}, {'e': '[3/4]×[5/7]', 'a': '15/28'}, {'e': '[5/8]×[4/9]', 'a': '5/18'},
                      {'q': '학교 마당의 [5/6]가 장터 자리이고, 장터 자리의 [3/10]이 떡 코너예요. 떡 코너는 학교 마당 전체의 얼마일까요?', 'e': '[5/6]×[3/10]', 'a': '1/4'}])
        ans = '6차시  ① 예상 예: 분자는 1, 분모는 두 분모의 곱이에요. / %s  ② %s (=2/5)  ③ %s / 왜: %s  ④ %s  ⑤ %s' % (
            a1, a2, ', '.join(a3), w3, ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '쟁반의 3분의 1의 5분의 1')
        rule_first(s, lv, '[1/3]×[1/5]의 분모는 얼마일까요?', '')
        s.text(rd('쟁반의 [1/3]에 한지를 깔고, 한지를 깐 부분의 [1/5]에 약과를 올렸어요. 쟁반을 세로로 3등분하여 1칸을 색칠하고(1단계), '
                  '가로로 5등분하여 색칠한 부분의 [1/5]만큼 빗금을 그어 보세요(2단계). 가로로 나누는 선도 직접 그어요.'))
        area_fig(s, [('v', 3, 1), ('h', 5, 1)], '약과 쟁반 = 1', False)
        a1 = chain(s, ['[1/3]×[1/5] = [1/3×{5}] = [{1}/{15}]'])
        step(s, 1, '그려 보기', '다식 쟁반')
        s.text(rd('민준이는 다른 쟁반의 [3/5]에 꽃무늬 한지를 깔고, 그 [3/4]에 다식을 올렸어요. 쟁반을 세로로 5등분하여 3칸을 색칠하고, 가로로 4등분하여 빗금을 그어 보세요.'))
        area_fig(s, [('v', 5, 3), ('h', 4, 3)], '다식 쟁반 = 1', False)
        a2 = chain(s, ['전체를 똑같이 5×4 = {20}칸으로 나누었고, 빗금 친 부분은 3×3 = {9}칸이에요.', '[3/5]×[3/4] = [3×{3}/5×{4}] = [{9}/{20}]'])
        step(s, 2, '말해 보기', '곱한 수의 뜻')
        a3 = chooses(s, [('[3/5]×[3/4]에서 분모 20(= 5×4)은 그림에서 무엇일까요?', ['쟁반 전체를 똑같이 나눈 칸 수', '다식을 올린 칸 수', '세로로 나눈 줄 수'], 0),
                         ('분자 9(= 3×3)는 그림에서 무엇일까요?', ['다식을 올린(빗금 친) 칸 수', '쟁반 전체의 칸 수', '가로로 나눈 줄 수'], 0)])
        w3 = why_ans(s, lv, '[3/5]×[3/4]이 [3/5]보다 작은 까닭을 그림과 관련지어 써 봐요.', '',
                     '한지를 깐 [3/5] 중에서 [3/4]에만 다식을 올렸으니, 다식을 올린 부분은 한지를 깐 부분의 일부분이에요.')
        step(s, 3, '약속하기', '(진분수)×(진분수)')
        a4 = blanks(s, lv, ['[4/7]×[2/3]은 분자끼리 곱한 ', (['8', '6', '21'], 0), '을 분자에, 분모끼리 곱한 ', (['21', '8', '10'], 0), '을 분모에 써서 [8/21]이에요.'])
        assert ev('[4/7]×[2/3]') == F('8/21')
        step(s, 4, '확인하기', '장터 자리 계산')
        a5 = calc(s, [{'e': '[1/5]×[1/7]', 'a': '1/35'}, {'e': '[2/3]×[4/5]', 'a': '8/15'}, {'e': '[6/7]×[5/9]', 'a': '10/21'},
                      {'q': '학교 강당의 [3/4]이 장터 자리이고, 장터 자리의 [2/9]가 식혜 코너예요. 식혜 코너는 강당 전체의 얼마일까요?', 'e': '[3/4]×[2/9]', 'a': '1/6'}])
        ans = '6차시  ① 예상 예: 3×5 = 15예요. / %s  ② %s  ③ %s / 왜: %s  ④ %s  ⑤ %s' % (a1, a2, ', '.join(a3), w3, ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 진분수를 곱하면 커질까, 작아질까?')
        a6 = cmp(s, [('[2/3]×[4/5]', '[2/3]'), ('[7/8]×[8/9]', '[7/9]')])
        challenge_why(s, '[2/3]에 [4/5]를 곱하면 [2/3]보다 작아지는 까닭을 써 보세요.')
        ans += '  ⑥ %s (8/15 < 10/15, 56/72 = 7/9) / 왜: 예) 1보다 작은 4/5를 곱하면 2/3의 일부분만 구하게 돼요.' % ' '.join(a6)
    return ans


def st7(s, lv):
    head(s, 7, '개념 구축하기(O)', '조각보 꾸미기 ― 세 분수의 곱셈과 약분', '세 분수의 곱셈은 어떻게 하고, 약분은 언제 하면 편리할까요?', '유나는 장터에서 팔 조각보를 꾸며요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '조각보 물들이기')
        s.text(rd('천의 [3/4]에 노란 물을 들이고(1단계), 그중 [1/2]에 꽃수를 놓고(2단계), 꽃수를 놓은 부분의 [2/3]에 금실을 더했어요(3단계). 그림으로 나타내 보세요.'
                  + (' 1단계는 색칠해 두었어요. 가로 점선을 따라 2단계 빗금, 잔 점선을 따라 3단계 진한 빗금을 그어요.' if lv == '기본형' else '')))
        area_fig(s, [('v', 4, 3), ('h', 2, 1), ('h2', 3, 2)], '조각보 천 = 1', lv == '기본형')
        a1 = chain(s, ['전체를 똑같이 4×2×3 = {24}칸으로 나누었고, 진한 빗금은 3×1×2 = {6}칸이에요.', '[3/4]×[1/2]×[2/3] = [3×1×{2}/4×2×{3}] = [{6}/{24}]'])
        step(s, 1, '그려 보기', '두 가지 약분 방법')
        s.text(rd('식혜 [4/9] L 중 [3/8]만큼을 시음 컵에 따랐어요. 서아와 민준이가 [4/9]×[3/8]을 서로 다른 방법으로 계산했어요.'))
        a2 = chain(s, [('서아', '[4/9]×[3/8] = [4×3/9×8] = [{1}×{1}/{3}×{2}] = [{1}/{6}]'), ('민준', '[4/9]×[3/8] = [{1}/{3}]×[{1}/{2}] = [{1}/{6}]')])
        a2b = chooses(s, [('민준이는?', ['곱하기 전에 먼저 약분했어요', '곱한 뒤에 약분했어요'], 0)])
        w2 = why_ans(s, lv, '[4/9]×[3/8]에서 4와 8을 약분해도 되는 까닭은 무엇일까요?',
                     '‘하나의 분수 (4×3)/(9×8)로 보면 4는 ~에, 8은 ~에 있어서 같은 수로 나누어도 크기가 같아요.’ 꼴로 써요.',
                     '하나의 분수 (4×3)/(9×8)로 보면 4는 분자에, 8은 분모에 있어요. 분자와 분모를 같은 수 4로 나누는 것이라 분수의 크기가 변하지 않아요.')
        step(s, 2, '말해 보기', '수 카드로 식 만들기')
        s.text('수 카드 2, 3, 4, 5, 7, 9 중에서 4장을 골라 한 번씩만 사용하여 진분수의 곱셈식을 만들고 곱을 써 보세요. 여러 가지 식을 만들 수 있어요.')
        a3 = build(s, lv, [2, 3, 4, 5, 7, 9], ['p', 'p'], 'any', [2, 5, 3, 7])
        w3 = why_ans(s, lv, '내가 만든 식의 곱은 곱한 두 진분수보다 클까요, 작을까요? 까닭도 써 봐요.',
                     '‘곱은 두 진분수보다 작아요. 왜냐하면 진분수는 1보다 ~서, 곱하면 ~만 구하기 때문이에요.’ 꼴로 써요.',
                     '곱은 두 진분수보다 작아요. 진분수는 1보다 작아서, 어떤 수에 진분수를 곱하면 그 수의 일부분만 구하게 되기 때문이에요.')
        step(s, 3, '약속하기', '세 분수와 약분')
        a4 = blanks(s, lv, RULE_3F)
        step(s, 4, '확인하기', '조각보와 식혜 계산')
        a5 = calc(s, [{'e': '[2/3]×[3/4]×[1/5]', 'a': '1/10'}, {'e': '[5/6]×[9/10]', 'a': '3/4'}, {'e': '[7/8]×[4/21]', 'a': '1/6'},
                      {'q': '식혜 [9/10] L 중 [2/3]를 시음 컵에 따르고, 그중 [1/2]을 선생님께 드렸어요. 선생님께 드린 식혜는 몇 L일까요?', 'e': '[9/10]×[2/3]×[1/2]', 'a': '3/10', 'unit': 'L'}])
        ans = '7차시  ① %s (=1/4)  ② %s / %s / 왜: %s  ③ %s / %s  ④ %s  ⑤ %s' % (
            a1, a2, a2b[0], w2, a3, w3, ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '조각보 물들이기')
        s.text(rd('천의 [4/5]에 분홍 물을 들이고(1단계), 그중 [2/3]에 꽃수를 놓고(2단계), 꽃수를 놓은 부분의 [1/2]에 은실을 더했어요(3단계). 그림으로 나타내 보세요.'))
        area_fig(s, [('v', 5, 4), ('h', 3, 2), ('h2', 2, 1)], '조각보 천 = 1', False)
        a1 = chain(s, ['전체를 똑같이 5×3×2 = {30}칸으로 나누었고, 진한 빗금은 4×2×1 = {8}칸이에요.', '[4/5]×[2/3]×[1/2] = [4×2×{1}/5×3×{2}] = [{8}/{30}]'])
        step(s, 1, '그려 보기', '두 가지 약분 방법')
        s.text(rd('수정과 [10/21] L 중 [7/15]만큼을 시음 컵에 따랐어요. 서아와 민준이가 [10/21]×[7/15]을 서로 다른 방법으로 계산했어요.'))
        a2 = chain(s, [('서아', '[10/21]×[7/15] = [10×7/21×15] = [{2}×{1}/{3}×{3}] = [{2}/{9}]'), ('민준', '[10/21]×[7/15] = [{2}/{3}]×[{1}/{3}] = [{2}/{9}]')])
        a2b = chooses(s, [('민준이가 10과 15를 약분할 때 나눈 수는?', ['5', '3', '7'], 0)])
        w2 = why_ans(s, lv, '[10/21]×[7/15]에서 7과 21을 약분해도 되는 까닭을 써 봐요.', '',
                     '하나의 분수 (10×7)/(21×15)로 보면 7은 분자에, 21은 분모에 있어서 같은 수 7로 나누어도 분수의 크기가 변하지 않아요.')
        step(s, 2, '말해 보기', '수 카드로 식 만들기')
        s.text('수 카드 3, 4, 6, 7, 8, 9 중에서 4장을 골라 한 번씩만 사용하여 곱하기 전에 약분할 수 있는 진분수의 곱셈식을 만들고 곱을 써 보세요.')
        a3 = build(s, lv, [3, 4, 6, 7, 8, 9], ['p', 'p'], 'any', [4, 7, 6, 9])
        w3 = why_ans(s, lv, '내가 만든 식에서 먼저 약분할 수 있는 수끼리 찾아 써 봐요.', '', '(예) 4/7×6/9에서 6과 9를 3으로 약분할 수 있어요.')
        step(s, 3, '약속하기', '세 분수와 약분')
        a4 = blanks(s, lv, ['[3/4]×[2/9]×[6/7]의 분자끼리 곱은 ', (['36', '14', '252'], 0), ', 분모끼리 곱은 ', (['252', '36', '20'], 0), '이고, 기약분수로 나타내면 ',
                            (['[1/7]', '[1/9]', '[2/7]'], 0), '이에요.'])
        assert ev('[3/4]×[2/9]×[6/7]') == F('1/7')
        step(s, 4, '확인하기', '조각보와 수정과 계산')
        a5 = calc(s, [{'e': '[3/5]×[5/6]×[2/3]', 'a': '1/3'}, {'e': '[8/9]×[3/4]', 'a': '2/3'}, {'e': '[5/12]×[9/10]', 'a': '3/8'},
                      {'q': '수정과 [8/9] L 중 [3/4]를 시음 컵에 따르고, 그중 [1/4]을 교장 선생님께 드렸어요. 교장 선생님께 드린 수정과는 몇 L일까요?', 'e': '[8/9]×[3/4]×[1/4]', 'a': '1/6', 'unit': 'L'}])
        ans = '7차시  ① %s (=4/15)  ② %s / %s / 왜: %s  ③ %s / %s  ④ %s  ⑤ %s' % (a1, a2, a2b[0], w2, a3, w3, ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 잘못 계산한 지호')
        s.text(rd('지호가 어떤 수에 [3/4]을 곱해야 할 것을 잘못하여 [3/4]을 뺐더니 [1/8]이 되었어요.'))
        a6 = calc(s, [{'q': '어떤 수는 얼마일까요?', 'x': '[1/8]+[3/4]', 'show': '어떤 수', 'a': '7/8'},
                      {'q': '바르게 계산한 값은 얼마일까요?', 'x': '[7/8]×[3/4]', 'show': '(어떤 수)×[3/4]', 'a': '21/32'}])
        assert ev('[7/8]−[3/4]') == F('1/8')
        challenge_why(s, '어떤 수를 어떻게 구했는지 써 보세요.')
        ans += '  ⑥ %s / 왜: 예) 어떤 수 − 3/4 = 1/8이므로 1/8에 3/4을 더해 구했어요.' % ', '.join(a6)
    return ans


def st8(s, lv):
    head(s, 8, '개념 구축하기(O)', '손님 돗자리 ― (대분수)×(대분수)', '(대분수)×(대분수)는 어떻게 계산할까요?',
         '장터 손님이 앉을 돗자리를 만들어요. 직사각형 돗자리는 가로 [1 2/3] m, 세로 [1 1/2] m예요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '돗자리 나누기')
        e1 = est(s, '돗자리의 넓이는 몇 m²쯤일까요?', ['1 m²보다 넓고 4 m²보다 좁아요', '1 m²보다 좁아요', '4 m²보다 넓어요'], 0)
        s.text(rd('세로를 1 m와 [1/2] m로 나누어 보세요.' + (' 나눈 선을 그려 두었어요. 파란 부분은 [1 2/3]×1, 노란 부분은 [1 2/3]×[1/2]이에요.'
                                                   if lv == '기본형' else ' 그림에 나누는 선을 그어요. 주황 점선 정사각형이 1 m²예요.')))
        mat_fig(s, '1 2/3', '1 1/2', 1, lv == '기본형', '돗자리')
        a1 = chain(s, [('방법 1', '[1 2/3]×[1 1/2] = ([1 2/3]×1)+([1 2/3]×[1/2])'), ('', '= [1 2/3]+([5/3]×[1/2]) = [1 2/3]+[{5}/{6}]'),
                       ('', '= [{10}/6]+[5/6] = [{15}/6] = [{2} {1}/2]')])
        assert 1 < ev('[1 2/3]×[1 1/2]') < 4
        step(s, 1, '그려 보기', '가분수로 칸 세기')
        s.text(rd('가로와 세로의 1 m를 똑같이 나누어 칸이 돗자리 끝에 딱 맞게 해 보세요. 점선 정사각형이 1 m²예요.'
                  + (' 가로는 [1/3] m, 세로는 [1/2] m씩 나누었어요.' if lv == '기본형' else '')))
        mat_fig(s, '1 2/3', '1 1/2', 2, lv == '기본형', '돗자리')
        a2 = chain(s, [('방법 2', '[1 2/3]×[1 1/2] = [{5}/3]×[{3}/2] = [5×{3}/3×{2}] = [{15}/6] = [{2} {1}/2]')])
        a2b = chooses(s, [('1 m² 안에 들어가는 칸 수는?', ['6칸', '15칸', '5칸'], 0), ('돗자리의 넓이는 어림한 범위(1 m²와 4 m² 사이)에', ['들어가요', '들어가지 않아요'], 0)])
        assert 3 * 2 == 6
        step(s, 2, '말해 보기', '지호의 실수')
        s.text(rd('지호가 [2 3/4]×[1 5/9]를 계산했는데 답이 이상해요.'))
        wrong(s, '지호의 계산', '[2 3/4]×[1 5/9] = [2 1/4]×[1 5/3] = [9/4]×[8/3] = 6')
        a3 = chooses(s, [('잘못된 까닭은?', WHY_MM, 0)])
        a3b = chain(s, [('옳은 계산', '[2 3/4]×[1 5/9] = [{11}/4]×[{14}/9] = [11×{7}/{2}×9]'), ('', '= [{77}/18] = [{4} {5}/18]')])
        w3 = why_ans(s, lv, '[2 3/4]의 3과 [1 5/9]의 9를 바로 약분하면 왜 안 될까요?',
                     '‘[2 3/4]을 가분수로 바꾸면 분자는 ~이라서, 3과 9를 약분하는 것은 ~예요.’ 꼴로 써요.',
                     '[2 3/4]을 가분수로 바꾸면 [11/4]이라서 실제로 곱하는 분자는 3이 아니라 11이에요. 그래서 3과 9를 약분하면 다른 수를 계산하게 돼요.')
        step(s, 3, '약속하기', '(대분수)×(대분수)')
        a4 = blanks(s, lv, RULE_MM)
        step(s, 4, '확인하기', '장터 넓이와 길이')
        a5 = calc(s, [{'e': '[1 1/3]×[2 1/4]', 'n': 3}, {'e': '[2 2/5]×[1 1/6]', 'a': '2 4/5'}, {'e': '[3 1/2]×[1 3/7]', 'n': 5},
                      {'q': '지호는 장터 안내 리본을 [1 3/4] m 만들었고, 유나는 지호가 만든 리본의 [2 1/3]배를 만들었어요. 유나가 만든 리본은 몇 m일까요?',
                       'e': '[1 3/4]×[2 1/3]', 'a': '4 1/12', 'unit': 'm'}])
        ans = '8차시  ① %s / %s  ② %s, %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (
            e1, a1, a2, ', '.join(a2b), a3[0], a3b, w3, ', '.join(a4), ', '.join(a5))
    else:  # 도전형
        step(s, 0, '만져 보기', '돗자리 나누기')
        s.text(rd('둘째 날에는 더 큰 돗자리를 만들어요. 가로 [2 1/3] m, 세로 [1 1/4] m예요.'))
        e1 = est(s, '돗자리의 넓이는 몇 m²쯤일까요?', ['2 m²보다 넓고 4 m²보다 좁아요', '2 m²보다 좁아요', '4 m²보다 넓어요'], 0)
        s.text(rd('세로를 1 m와 [1/4] m로 나누는 선을 그어 보세요. 주황 점선 정사각형이 1 m²예요.'))
        mat_fig(s, '2 1/3', '1 1/4', 1, False, '돗자리')
        a1 = chain(s, [('방법 1', '[2 1/3]×[1 1/4] = ([2 1/3]×1)+([2 1/3]×[1/4])'), ('', '= [2 1/3]+([7/3]×[1/4]) = [2 1/3]+[{7}/{12}]'),
                       ('', '= [{28}/12]+[7/12] = [{35}/12] = [{2} {11}/12]')])
        assert 2 < ev('[2 1/3]×[1 1/4]') < 4
        step(s, 1, '그려 보기', '가분수로 칸 세기')
        s.text(rd('가로의 1 m는 [1/3] m씩, 세로의 1 m는 [1/4] m씩 나누어 칸이 돗자리 끝에 딱 맞게 해 보세요.'))
        mat_fig(s, '2 1/3', '1 1/4', 2, False, '돗자리')
        a2 = chain(s, [('방법 2', '[2 1/3]×[1 1/4] = [{7}/3]×[{5}/4] = [7×{5}/3×{4}] = [{35}/12] = [{2} {11}/12]')])
        a2b = chooses(s, [('1 m² 안에 들어가는 칸 수는?', ['12칸', '35칸', '7칸'], 0)])
        step(s, 2, '말해 보기', '지호의 실수')
        s.text(rd('지호가 [1 5/8]×[2 2/15]를 계산했는데 답이 이상해요.'))
        wrong(s, '지호의 계산', '[1 5/8]×[2 2/15] = [1 1/8]×[2 2/3] = [9/8]×[8/3] = 3')
        a3 = chooses(s, [('잘못된 까닭은?', ['대분수를 가분수로 바꾸기 전에 5와 15를 약분했어요', '자연수 부분끼리 더했어요'], 0)])
        a3b = chain(s, [('옳은 계산', '[1 5/8]×[2 2/15] = [{13}/8]×[{32}/15] = [13×{4}/{1}×15]'), ('', '= [{52}/15] = [{3} {7}/15]')])
        w3 = why_ans(s, lv, '지호의 답 3이 실제 곱보다 작은 까닭을 써 봐요.', '',
                     '[1 5/8]을 가분수로 바꾸면 [13/8]이라 실제 분자는 5가 아니라 13이에요. 5를 1로 줄여 계산해서 곱이 작아졌어요.')
        step(s, 3, '약속하기', '(대분수)×(대분수)')
        a4 = blanks(s, lv, ['[1 1/5]×[1 2/3]은 [6/5]×[5/3]이고, 5끼리, 6과 3을 약분하면 ', (['2', '[1 2/15]', '[11/15]'], 0), '예요.'])
        assert ev('[1 1/5]×[1 2/3]') == 2
        step(s, 4, '확인하기', '장터 넓이와 길이')
        a5 = calc(s, [{'e': '[1 1/2]×[3 1/3]', 'n': 5}, {'e': '[2 1/4]×[1 5/9]', 'a': '3 1/2'}, {'e': '[1 2/7]×[2 1/3]', 'n': 3},
                      {'q': '서아는 안내 리본을 [2 2/3] m 만들었고, 도윤이는 서아가 만든 리본의 [1 3/4]배를 만들었어요. 도윤이가 만든 리본은 몇 m일까요?',
                       'e': '[2 2/3]×[1 3/4]', 'a': '4 2/3', 'unit': 'm'}])
        ans = '8차시  ① %s / %s  ② %s, %s  ③ %s / %s / 왜: %s  ④ %s  ⑤ %s' % (e1, a1, a2, a2b[0], a3[0], a3b, w3, ', '.join(a4), ', '.join(a5))
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 장터 부엌 문제')
        a6 = calc(s, [{'q': '수도에서 1분에 [2 2/5] L씩 물이 나와요. [3 3/4]분 동안 받은 물은 몇 L일까요?', 'e': '[2 2/5]×[3 3/4]', 'n': 9, 'unit': 'L'},
                      {'q': '떡 판 하나의 넓이는 [3 1/3] m²예요. 큰 떡 판은 그 [2 1/4]배예요. 큰 떡 판의 넓이는 몇 m²일까요?', 'e': '[3 1/3]×[2 1/4]', 'a': '7 1/2', 'unit': 'm²'}])
        challenge_why(s, '두 문제를 어떤 차례로 계산했는지 써 보세요.')
        ans += '  ⑥ %s' % ', '.join(a6)
    return ans


def st9(s, lv):
    att27, v27 = vote_min(27)
    head(s, 9, '탐구 정리하기(O)', '수익금 투표 ― 생각을 모아요', '학급 회의에서 의견이 통과되려면 찬성표를 최소 몇 표 받아야 할까요?',
         '장터가 끝나고 수익금이 생겼어요! 수익금을 어디에 쓸지 학급 회의에서 투표로 정해요. 우리 반은 27명이에요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '회의 규칙 읽기')
        s.fill([rd(t) for t in ['회의 규칙 ① 반 전체 학생 수의 [1/2]보다 많은 학생이 회의에 참석해야 해요.',
                                '회의 규칙 ② 참석한 학생 수의 [2/3]보다 많은 찬성표를 받아야 의견이 통과돼요.']])
        a1 = chooses(s, [('이 문제에서 구하려는 것은 무엇일까요?', ['의견이 통과되기 위한 최소 찬성표 수', '회의에 참석한 학생 수', '우리 반 학생 수'], 0),
                         ('학생이 10명인 모둠이라면 10×[1/2] = 5예요. 회의가 열리려면 최소 몇 명이 참석해야 할까요?', ['5명', '6명', '4명'], 1)])
        step(s, 1, '그려 보기', '계획 세우기')
        a2 = blanks(s, lv, ['먼저 ', (['27×[1/2]', '27×[2/3]'], 0), '을 계산하여 그보다 많은 가장 작은 자연수로 최소 참석 인원을 구해요. 그다음 (최소 참석 인원)×',
                            (['[2/3]', '[1/2]'], 0), '를 계산하여 그보다 많은 가장 작은 자연수로 최소 찬성표를 구해요.'])
        step(s, 2, '말해 보기', '우리 반 투표')
        if lv == '기본형':
            s.text(rd('‘[13 1/2]보다 많은’ 가장 작은 자연수를 찾아요.'))
        a3 = vote_chain(s, 27)
        step(s, 3, '약속하기', '5학년 장터 위원회 75명')
        s.text('5학년 전체 장터 위원회도 같은 규칙으로 투표해요. 위원은 75명이에요.')
        a4 = vote_chain(s, 75)
        step(s, 4, '확인하기', '되돌아보기')
        w5a = write_ans(s, lv, '우리 반의 최소 찬성표를 어떻게 구했는지 설명해 보세요.',
                        '‘27×[1/2] = ~보다 많은 ~명이 참석하고, ~×[2/3] = ~보다 많은 ~표가 필요해요.’ 꼴로 써요.',
                        '27×[1/2] = [13 1/2]보다 많아야 하므로 최소 %d명이 참석하고, %d×[2/3] = [9 1/3]보다 많아야 하므로 찬성표는 최소 %d표가 필요해요.' % (att27, att27, v27))
        w5b = write_ans(s, lv, '곱이 자연수로 딱 나누어떨어질 때는 무엇을 조심해야 할까요?',
                        '‘곱이 자연수이면 그 수는 들어가지 않으니, 그 수에 ~을 더해야 해요.’ 꼴로 써요.',
                        '곱이 자연수이면 ‘보다 많은’ 조건에 그 수는 들어가지 않으니, 그 수에 1을 더해야 해요. 30명이 참석하면 30×[2/3] = 20이므로 21표가 필요해요.')
        assert ev('27×[1/2]') == F('13 1/2') and ev('%d×[2/3]' % att27) == F('9 1/3') and ev('30×[2/3]') == 20
        ans = '9차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ 예) %s / 예) %s' % (', '.join(a1), ', '.join(a2), a3, a4, w5a, w5b)
    else:  # 도전형
        att31, v31 = vote_min(31)
        step(s, 0, '만져 보기', '회의 규칙 읽기')
        s.text('옆 반(31명)도 같은 회의 규칙으로 수익금 쓰는 곳을 정해요.')
        s.fill([rd('통과하려면: 참석 학생 수 > (반 학생 수)×[1/2],  찬성표 수 > (참석 학생 수)×[2/3]')])
        a1 = chooses(s, [('옆 반에서 구하려는 것은 무엇일까요?', ['통과에 필요한 최소 찬성표 수', '옆 반 학생 수', '반대한 학생 수'], 0),
                         ('학생이 12명인 동아리라면 12×[1/2] = 6이에요. 회의가 열리려면 최소 몇 명이 참석해야 할까요?', ['6명', '7명', '5명'], 1)])
        assert vote_min(12)[0] == 7
        step(s, 1, '그려 보기', '계획 세우기')
        a2 = blanks(s, lv, ['31명이면 31×[1/2] = ', (['[15 1/2]', '[10 1/3]'], 0), '이므로 최소 ', (['16명', '15명'], 0), '이 참석해야 해요. 그다음 16×',
                            (['[2/3]', '[1/2]'], 0), '보다 많은 가장 작은 자연수가 최소 찬성표예요.'])
        step(s, 2, '말해 보기', '옆 반 투표')
        a3 = vote_chain(s, 31)
        step(s, 3, '약속하기', '학년 전체 93명')
        s.text('5학년 전체 학생 93명이 같은 규칙으로 투표해요(이 활동지에서 정한 수).')
        a4 = vote_chain(s, 93)
        step(s, 4, '확인하기', '되돌아보기')
        w5a = write_ans(s, lv, '옆 반의 최소 찬성표를 어떻게 구했는지 설명해 보세요.', '',
                        '31×[1/2] = [15 1/2]보다 많아야 하므로 최소 %d명이 참석하고, %d×[2/3] = [10 2/3]보다 많아야 하므로 찬성표는 최소 %d표가 필요해요.' % (att31, att31, v31))
        w5b = write_ans(s, lv, '옆 반 회의에 18명이 참석했다면 찬성표는 최소 몇 표가 필요한지 까닭과 함께 써 보세요.', '',
                        '18×[2/3] = 12이고 12보다 많아야 하므로 최소 13표가 필요해요.')
        assert ev('31×[1/2]') == F('15 1/2') and ev('%d×[2/3]' % att31) == F('10 2/3') and ev('18×[2/3]') == 12 and v31 == 11
        ans = '9차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ 예) %s / 예) %s' % (', '.join(a1), ', '.join(a2), a3, a4, w5a, w5b)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 학교 장터 위원회 47명')
        s.text('5학년과 6학년이 함께하는 학교 장터 위원회는 47명이라고 해요(이 활동지에서 정한 수). 곱이 자연수로 나올 때 조심해요!')
        a6 = vote_chain(s, 47)
        ans += '  ⑥ %s' % a6
    return ans


def st10(s, lv):
    head(s, 10, '발표하기(P)', '장터 놀이 마당 ― 곱이 더 큰 식 만들기', '조건에 맞는 분수의 곱셈식에서 곱을 더 크게 만들려면 어떻게 해야 할까요?',
         '장터 놀이 마당에서 ‘곱 키우기 카드 놀이’를 해요. 조건 카드 한 장을 뒤집고, 조건에 맞게 수 카드를 가져와 한 번씩만 사용하여 식을 만들고 계산해요.')
    if lv == '기본형':
        step(s, 0, '만져 보기', '놀이 방법 알아보기')
        a1 = [pk(s, '조건 카드가 ‘(진분수)×(자연수)’일 때 알맞은 식은?', ['[2/9]×6', '[9/2]×6', '6×[2/9]'], 0)]
        a1 += chooses(s, [('곱을 맞게 계산했지만 가장 큰 곱은 아니라면 몇 점일까요?', ['1점', '3점', '0점'], 0)])
        step(s, 1, '그려 보기', '지호의 식')
        s.text(rd('지호가 조건 카드 ‘(진분수)×(자연수)’와 수 카드 2, 6, 9로 식 [2/9]×6을 만들었어요. 계산하고, 더 큰 곱을 만들 수 있는지 생각해 보세요.'))
        a2 = calc(s, [{'e': '[2/9]×6', 'a': '1 1/3'}, {'e': '[2/6]×9', 'n': 3}])
        a2 += [pk(s, '지호의 식보다 곱이 더 큰 식은?', ['[2/6]×9', '[6/9]×2', '없어요'], 0)]
        assert ev('[2/6]×9') > ev('[2/9]×6') == ev('[6/9]×2')
        step(s, 2, '말해 보기', '가장 큰 곱 만들기')
        s.text('같은 수 카드 2, 6, 9로 ‘(진분수)×(자연수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.')
        a3 = build(s, lv, [2, 6, 9], ['p', 'w'], 'max')
        w3 = why_ans(s, lv, '어떻게 하면 곱이 커지는지 까닭과 함께 써 봐요.',
                     '‘가장 큰 수 9를 ~에 놓아야 분자와 자연수의 곱이 ~지고, 분모는 ~아져서 곱이 커져요.’ 꼴로 써요.',
                     '가장 큰 수 9를 자연수 자리에 놓으면 분자와 자연수의 곱(2×9 = 18)은 크고 분모(6)는 작아져서 곱이 커져요. 9를 분모에 놓으면 분모가 커져서 곱이 작아져요.')
        step(s, 3, '약속하기', '곱을 크게 하는 방법')
        a4 = blanks(s, lv, ['곱이 더 큰 식을 만들려면 자연수끼리의 곱이나 분자끼리의 곱은 ', (['크게', '작게'], 0), ', 분모의 곱은 ', (['작게', '크게'], 0),
                            ' 만들어요. 수 카드는 ', (['한 번씩만', '여러 번'], 0), ' 사용하고, ', (['조건에 맞는 식', '아무 식'], 0), '을 만들어야 해요.'])
        step(s, 4, '확인하기', '곱 키우기 놀이 5판')
        a5 = game(s, lv, 'st10-' + lv)
        ans = '10차시  ① %s  ② %s  ③ %s / 왜: %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), a3, w3, ', '.join(a4), a5)
    else:  # 도전형
        step(s, 0, '만져 보기', '놀이 방법 알아보기')
        a1 = [pk(s, '조건 카드가 ‘(자연수)×(진분수)’일 때 알맞은 식은?', ['5×[3/8]', '5×[8/3]', '[3/8]×5'], 0)]
        a1 += chooses(s, [('곱을 틀리게 계산했다면 몇 점일까요?', ['0점', '1점', '3점'], 0)])
        step(s, 1, '그려 보기', '서아의 식')
        s.text(rd('서아가 조건 카드 ‘(자연수)×(진분수)’와 수 카드 2, 7, 9로 식 2×[7/9]를 만들었어요. 계산하고, 더 큰 곱을 만들 수 있는지 생각해 보세요.'))
        a2 = calc(s, [{'e': '2×[7/9]', 'a': '1 5/9'}, {'e': '9×[2/7]', 'a': '2 4/7'}])
        a2 += [pk(s, '서아의 식보다 곱이 더 큰 식은?', ['9×[2/7]', '7×[2/9]', '없어요'], 0)]
        assert ev('9×[2/7]') > ev('2×[7/9]') == ev('7×[2/9]')
        step(s, 2, '말해 보기', '가장 큰 곱 만들기')
        s.text('수 카드 3, 5, 8로 ‘(자연수)×(진분수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.')
        a3 = build(s, lv, [3, 5, 8], ['w', 'p'], 'max')
        w3 = why_ans(s, lv, '8을 진분수의 분모에 놓지 않은 까닭을 써 봐요.', '', '8을 분모에 놓으면 분모가 커져서 곱이 작아져요. 8을 자연수 자리에 놓아야 곱이 커요.')
        step(s, 3, '약속하기', '곱을 크게 하는 방법')
        a4 = blanks(s, lv, ['(대분수)×(자연수)에서 곱을 크게 하려면 대분수의 자연수 부분과 곱하는 자연수에 ', (['큰 수', '작은 수'], 0), '를 놓고, 진분수 부분은 분모를 ',
                            (['작게', '크게'], 0), ' 해요.'])
        step(s, 4, '확인하기', '곱 키우기 놀이 5판')
        a5 = game(s, lv, 'st10-' + lv)
        ans = '10차시  ① %s  ② %s  ③ %s / 왜: %s  ④ %s  ⑤ %s' % (', '.join(a1), ', '.join(a2), a3, w3, ', '.join(a4), a5)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★ (진분수)×(진분수)로 가장 큰 곱')
        s.text('수 카드 3, 4, 5, 8을 한 번씩 모두 사용하여 ‘(진분수)×(진분수)’ 조건에 맞으면서 곱이 가장 큰 식을 만들고 계산해 보세요.')
        a6 = build(s, lv, [3, 4, 5, 8], ['p', 'p'], 'max')
        challenge_why(s, '분자와 분모에 어떤 수를 놓았는지 까닭과 함께 써 보세요.')
        ans += '  ⑥ %s (두 분수의 자리를 바꾸어도 같아요) / 왜: 예) 분자의 곱은 크게, 분모의 곱은 작게 하면서 진분수가 되게 했어요.' % a6
    return ans


def st11(s, lv):
    head(s, 11, '발표하기(P)', '장터 발표회 ― 공부한 내용을 확인해요', '분수의 곱셈을 배우기 전과 후, 내 생각은 어떻게 달라졌나요?', None)
    if lv == '기본형':
        step(s, 0, '만져 보기', '그림으로 곱하기')
        s.text(rd('장터 발표회 첫 순서예요. 다식 한 판에 콩가루가 [3/4]컵 들어가요. 3판을 만든 양을 막대에 색칠하고 [3/4]×3을 계산해 보세요. 막대 하나가 1컵이에요.'))
        pour_fig(s, 4, '3/4', 3, 1 if lv == '기본형' else 0, '컵')
        a1 = chain(s, ['[3/4]×3 = [3/4]+[3/4]+[3/4] = [3×{3}/4]', ('', '= [{9}/4] = [{2} {1}/4]')])
        step(s, 1, '그려 보기', '계산하기')
        a2 = calc(s, [{'e': '[5/6]×9', 'a': '7 1/2'}, {'e': '8×[3/10]', 'a': '2 2/5'}, {'e': '[4/9]×[3/8]', 'a': '1/6'}, {'e': '[2 2/3]×[1 1/8]', 'n': 3}])
        step(s, 2, '말해 보기', '크기 비교')
        a3 = cmp(s, [('9×[1 1/6]', '[2 3/4]×4'), ('[2/5]×[5/6]', '[1/3]'), ('[3/4]×[8/9]', '[3/4]')])
        step(s, 3, '약속하기', '고치고 알려 주기')
        s.text(rd('민준이가 떡고물 [1 3/8] kg씩 6판의 양을 계산했어요.'))
        wrong(s, '민준이의 계산', '[1 3/8]×6 = [1 3/4]×3 = [7/4]×3 = [21/4] = [5 1/4]')
        a4 = chooses(s, [('잘못된 까닭은?', ['대분수를 가분수로 바꾸지 않고 대분수의 분모와 자연수를 약분했어요', '분자끼리 곱했어요'], 0)])
        a4b = chain(s, [('옳은 계산', '[1 3/8]×6 = [{11}/8]×6 = [11×{3}/4] = [{33}/4] = [{8} {1}/4]')])
        w4 = write_ans(s, lv, '민준이에게 바르게 계산하는 방법을 알려 주는 말을 써 보세요.',
                       '‘민준아, 대분수는 먼저 ~로 바꾼 다음에 ~해야 해. 그러면 ~가 나와.’ 꼴로 써요.',
                       '민준아, 대분수는 먼저 가분수 [11/8]로 바꾼 다음에 8과 6을 약분해야 해. 그러면 [11/8]×6 = [33/4] = [8 1/4]이 나와.')
        step(s, 4, '되돌아보기', '예전 생각, 지금 생각')
        s.text('1차시에 궁금했던 것을 떠올리며, 생각이 어떻게 달라졌는지 써 보세요.')
        panes(s, lv, [('예전 생각', '예전에는 ~라고 생각했어요', '예전에는 곱셈을 하면 항상 수가 커진다고 생각했어요.'),
                      ('지금 생각', '지금은 ~라고 생각해요', '지금은 1보다 작은 분수를 곱하면 곱이 작아진다는 것을 알아요.'),
                      ('왜 바뀌었나', '~을 해 보고 바뀌었어요', '약과 쟁반을 세로와 가로로 나누어 빗금 친 칸을 세어 보고 바뀌었어요.')])
        ans = '11차시  ① %s  ② %s  ③ %s (10 1/2 < 11, 1/3 = 1/3, 2/3 < 3/4)  ④ %s / %s / 예) %s  ⑤ (자유)' % (
            a1, ', '.join(a2), ' '.join(a3), a4[0], a4b, w4)
    else:  # 도전형
        step(s, 0, '만져 보기', '그림으로 곱하기')
        s.text(rd('다식 한 판에 꿀이 [4/5]컵 들어가요. 3판을 만든 양을 막대에 색칠하고 [4/5]×3을 계산해 보세요. 막대 하나가 1컵이에요.'))
        pour_fig(s, 5, '4/5', 3, 0, '컵')
        a1 = chain(s, ['[4/5]×3 = [4/5]+[4/5]+[4/5] = [4×{3}/5]', ('', '= [{12}/5] = [{2} {2}/5]')])
        step(s, 1, '그려 보기', '계산하기')
        a2 = calc(s, [{'e': '[7/9]×6', 'a': '4 2/3'}, {'e': '10×[5/12]', 'a': '4 1/6'}, {'e': '[5/6]×[9/10]', 'a': '3/4'}, {'e': '[1 1/5]×[3 3/4]', 'a': '4 1/2'}])
        step(s, 2, '말해 보기', '크기 비교')
        a3 = cmp(s, [('6×[1 1/4]', '[2 1/2]×3'), ('[3/7]×[7/9]', '[1/3]'), ('[4/5]×[5/6]', '[4/5]')])
        step(s, 3, '약속하기', '고치고 알려 주기')
        s.text(rd('민준이가 쌀가루 [2 3/10] kg씩 5판의 양을 계산했어요.'))
        wrong(s, '민준이의 계산', '[2 3/10]×5 = [2 3/2]×1 = [7/2] = [3 1/2]')
        a4 = chooses(s, [('잘못된 까닭은?', ['대분수를 가분수로 바꾸기 전에 분모 10과 5를 약분했어요', '분모에 5를 곱했어요'], 0)])
        a4b = chain(s, [('옳은 계산', '[2 3/10]×5 = [{23}/10]×5 = [{23}/{2}] = [{11} {1}/2]')])
        w4 = write_ans(s, lv, '민준이의 답이 5판의 양으로 알맞지 않다는 것을 어림으로 설명해 보세요.', '',
                       '한 판이 2 kg보다 많으니 5판은 10 kg보다 많아야 하는데, [3 1/2] kg은 너무 적어요.')
        step(s, 4, '되돌아보기', '예전 생각, 지금 생각')
        s.ask('이 단원에서 가장 어려웠던 곱셈을 하나 골라 식을 쓰고, 어떻게 해결했는지 써 보세요.', blank=False)
        s.lines(2)
        s.ask('‘곱셈을 하면 항상 커진다.’는 말이 맞는지 예를 들어 써 보세요.', blank=False)
        s.lines(1)
        ans = '11차시  ① %s  ② %s  ③ %s (7 1/2 = 7 1/2, 1/3 = 1/3, 2/3 < 4/5)  ④ %s / %s / 예) %s  ⑤ (자유) 예) 아니에요. 6×3/4 = 4 1/2처럼 1보다 작은 수를 곱하면 작아져요.' % (
            a1, ', '.join(a2), ' '.join(a3), a4[0], a4b, w4)
    # ── 도전형 새 문제 끝
    if lv == '도전형':
        step(s, 5, '도전하기', '★★ 장터 현수막')
        s.text(rd('현수막의 가로는 90 cm이고, 세로는 가로의 [2/5]예요. 가운데 글자의 높이는 세로의 [3/4]이에요.'))
        banner_fig(s)
        a6 = calc(s, [{'q': '현수막의 세로는 몇 cm일까요?', 'e': '90×[2/5]', 'n': 36, 'unit': 'cm'},
                      {'q': '글자의 높이는 몇 cm일까요?', 'x': '36×[3/4]', 'show': '(세로)×[3/4]', 'n': 27, 'unit': 'cm'}])
        challenge_why(s, '두 번째 문제를 풀 때 첫 번째 답을 어떻게 썼는지 써 보세요.', 1)
        ans += '  ⑥ %s' % ', '.join(a6)
    return ans


TB = [tb1, tb2, tb3, tb4, tb5, tb67, tb8, tb9, tb10, tb11]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11]


def build_file(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 2. 분수의 곱셈(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u2-fracmul.html과 차시 번호가 같습니다. 정답의 ‘2 1/4’은 대분수 2와 4분의 1, ‘9/4’는 가분수 4분의 9를 뜻해요. '
                   '(=…)는 같은 값의 가분수예요. 곱은 약분하지 않은 분수, 가분수, 대분수로 써도 값이 같으면 맞아요.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build_file(TB, '5-2 수학 2. 분수의 곱셈(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build_file(ST, '5-2 수학 2. 분수의 곱셈(이야기 버전)', '이야기 버전', OUT_ST, lv))
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
