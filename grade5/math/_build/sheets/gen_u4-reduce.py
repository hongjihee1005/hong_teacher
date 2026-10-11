# -*- coding: utf-8 -*-
"""5-1 수학 4. 약분과 통분 활동지(교과서 차시 버전·이야기 버전 × 기본형·도전형) 만들기

    python3 gen_u4-reduce.py

앱 원본 ../units/u4-reduce.tb.js('세계 음식 축제', 10차시)·u4-reduce.st.js('우리 반 과일 가게 놀이', 11차시)와
차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수를 똑같이 맞춥니다. 정답은 모두 이 스크립트가 분수(Fraction)로 계산해 확인합니다
(크기가 같은 분수·약분·기약분수·통분·크기 비교·최대공약수·최소공배수).
분수 표기는 4-2 「분수의 덧셈과 뺄셈」 활동지(grade4/math/_build/sheets/gen_u1-fracadd.py)와 같은 방법을 씁니다.

분수 표기
  - 식·빈칸은 그림(PNG)으로 넣어 분수를 위아래(분자/분모)로 씁니다. 빈칸은 네모, 답 칸은 큰 네모.
  - 글 속 분수는 읽는 말로 씁니다: [3/7] → '7분의 3', [2 1/4] → '2와 4분의 1'(앱의 읽어 주기와 같음).
  - 교사용 정답 쪽은 줄여서 '3/7', '2 1/4'로 씁니다.
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
from math import gcd
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade5/math
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '4단원_약분과통분_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧'
WORK = tempfile.mkdtemp(prefix='u4red_')
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
        return fs * bw(sg[1])
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
                   % (x + fs * .1, cy - fs * .58, fs * (bw(sg[1]) - .2), fs * 1.16))
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




# ================================================================ 이 단원의 수 계산(분수·소수, 약분·통분)
KO = '㉠㉡㉢㉣㉤㉥'


def V(t):
    """'[2/5]' · '2/5' · '[1 3/25]' · '0.48' · '7' · '{0.4}' → Fraction(정확한 값)"""
    t = str(t).strip().replace('{', '').replace('}', '')
    if re.fullmatch(r'\d+\.\d+', t):
        return Fraction(t)
    if re.fullmatch(r'\d+', t):
        return Fraction(int(t))
    m = re.fullmatch(r'\[?([\d×÷]+)/([\d×÷]+)\]?', t)
    if m and re.search('[×÷]', t):       # [12÷2/18÷2] · [1×2/2×2]
        def side(x):
            v = Fraction(1)
            for op, k in re.findall(r'(^|[×÷])(\d+)', x):
                v = v / int(k) if op == '÷' else v * int(k)
            return v
        return side(m.group(1)) / side(m.group(2))
    return F(t)


def nd(f):
    n, d = str(f).strip('[]').split('/')
    return int(n), int(d)


def fx(x):
    """Fraction → '3/4' · '1 3/25' · '2'"""
    x = Fraction(x)
    if x.denominator == 1:
        return str(x.numerator)
    w, r = divmod(x.numerator, x.denominator)
    return '%d/%d' % (r, x.denominator) if w == 0 else '%d %d/%d' % (w, r, x.denominator)


def SG(a, b):
    a, b = V(a), V(b)
    return '>' if a > b else '<' if a < b else '='


def lcm(a, b):
    return a // gcd(a, b) * b


def divisors(n):
    return [k for k in range(1, n + 1) if n % k == 0]


def irr(f):
    n, d = nd(f)
    g = gcd(n, d)
    return '%d/%d' % (n // g, d // g)


def red_all(f):
    """앱 rd4AllRed: 1이 아닌 공약수로 약분하여 만들 수 있는 분수 모두"""
    n, d = nd(f)
    return ['%d/%d' % (n // k, d // k) for k in divisors(gcd(n, d)) if k > 1]


def bw(ans):
    """빈칸 너비(글자 크기 배): 답 글자가 길면 넓게"""
    if ans is None:
        return 1.3
    return max(1.3, .62 * len(str(ans)) + .6)


def chain(s, rows, draw=True):
    """식 줄 그림(빈칸 {답}). 한글·○·▢·괄호가 없는 '=' 줄은 값이 모두 같은지 확인. 채운 식 글을 돌려줌."""
    for r in rows:
        e = r[1] if isinstance(r, tuple) else r
        full = re.sub(r'\{([^}]*)\}', r'\1', e)
        if '=' in full and not re.search(r'[가-힣○▢(,→]', full):
            vals = [V(p.strip()) for p in full.split('=') if p.strip()]
            assert all(v == vals[0] for v in vals), ('식 확인 필요', full)
    if draw:
        eq_fig(s, rows)
    return ' / '.join(flat(r[1] if isinstance(r, tuple) else r).strip() for r in rows)


def mulrow(f, k, op='×', tag=None):
    """앱 rd4MulRow: [1/2] = [1×{2}/2×{2}] = [{2}/{4}]"""
    n, d = nd(f)
    if op == '×':
        N, D = n * k, d * k
    else:
        assert n % k == 0 and d % k == 0, (f, k)
        N, D = n // k, d // k
    assert Fraction(n, d) == Fraction(N, D)
    e = '[%d/%d] = [%d%s{%d}/%d%s{%d}] = [{%d}/{%d}]' % (n, d, n, op, k, d, op, k, N, D)
    return (tag, e) if tag else e


def pairrow(a, b, D, tag=None):
    """앱 rd4PairRow: ([4/6], [3/8]) → ([{16}/24], [{9}/24]) → [4/6] ○ [3/8]"""
    (na, da), (nb, db) = nd(a), nd(b)
    assert D % da == 0 and D % db == 0
    e = '([%s], [%s]) → ([{%d}/%d], [{%d}/%d]) → [%s] ○ [%s]' % (a, b, na * D // da, D, nb * D // db, D, a, b)
    ans = '(%d/%d, %d/%d) → %s %s %s' % (na * D // da, D, nb * D // db, D, a, SG(a, b), b)
    return ((tag, e) if tag else e), ans


def tongrow(a, b, D, tag=None):
    """앱 rd4TongRow: ([3/10], [7/15]) → ([3×{15}/10×{15}], [7×{10}/15×{10}]) = ([{45}/{150}], [{70}/{150}])"""
    (na, da), (nb, db) = nd(a), nd(b)
    ka, kb = D // da, D // db
    assert ka * da == D and kb * db == D
    e1 = '([%s], [%s]) → ([%d×{%d}/%d×{%d}], [%d×{%d}/%d×{%d}])' % (a, b, na, ka, da, ka, nb, kb, db, kb)
    e2 = '= ([{%d}/{%d}], [{%d}/{%d}])' % (na * ka, D, nb * kb, D)
    rows = [(tag, e1), ('', e2)] if tag else [e1, ('', e2)]
    return rows, '(%d/%d, %d/%d)' % (na * ka, D, nb * kb, D)


def cols_for(cells, fs=34, W=1100):
    for c in range(min(len(cells), 4), 0, -1):
        if max(eq_w(x, fs) for x in cells) < W / c - 30:
            return c
    return 1


def pick(s, q, opts, ok):
    """식·말 보기 고르기(여러 개면 모두). ok = 정답 번호 목록. 정답 기호 글."""
    s.ask(rd(q), blank=False)
    cells = ['%s %s' % (KO[i], o) for i, o in enumerate(opts)]
    grid_fig(s, cells, cols_for(cells))
    s.ask('답: (              )', blank=False)
    return ', '.join(KO[i] for i in ok)


def pick_eq_val(s, q, opts, test, app_ok):
    """크기가 같은 분수 고르기 등: test(값 글) → 참/거짓으로 정답을 계산하고 앱의 정답과 견줌"""
    ok = [i for i, o in enumerate(opts) if test(o)]
    assert ok == app_ok, (q, ok, app_ok)
    return pick(s, q, ['[%s]' % o if '/' in o and '[' not in o else o for o in opts], ok)


def cmp2(s, pairs, lv=None):
    """○ 안에 >, =, < : pairs [(왼쪽, 오른쪽)] (분수는 [ ]) → 기호 목록"""
    rows, signs = [], []
    for i, (l, r) in enumerate(pairs):
        signs.append(SG(l, r))
        rows.append('%s %s ○ %s' % (KO[i] if len(pairs) > 1 else '', l, r))
    s.text('○ 안에 >, =, < 를 알맞게 써요.')
    cells = rows
    grid_fig(s, cells, cols_for(cells), fs=34)
    return signs


def order_q(s, q, items, desc=True, sep=None):
    """차례 정하기: items [(보이는 글, 값)] → 정답 글"""
    s.ask(rd(q), blank=False)
    eq_fig(s, ['   ' + ',      '.join(t for t, v in items)])
    sym = sep or ('>' if desc else '<')
    s.ask('답: (          ) %s (          ) %s (          )' % (sym, sym), blank=False)
    srt = sorted(items, key=lambda it: V(it[1]), reverse=desc)
    for a, b in zip(srt, srt[1:]):
        assert V(a[1]) != V(b[1])
    return (' %s ' % sym).join(flat(t) for t, v in srt)


def red_grid(s, froms, irr_only=False):
    """약분하기·기약분수로 나타내기: '① [8/24] = ▢' → 기약분수 정답 목록"""
    cells = ['%s [%s] = ▢' % (NUM[i], f) for i, f in enumerate(froms)]
    grid_fig(s, cells, cols_for(cells))
    return [irr(f) for f in froms]


def tong_grid(s, items):
    """통분하기: items [(a, b, D)] → '① ([5/8], [9/10]) → (▢, ▢)' → 정답 목록"""
    cells, ans = [], []
    for i, (a, b, D) in enumerate(items):
        (na, da), (nb, db) = nd(a), nd(b)
        assert D % da == 0 and D % db == 0
        cells.append('%s ([%s], [%s]) → ( ▢ , ▢ )' % (NUM[i], a, b))
        ans.append('(%d/%d, %d/%d)' % (na * D // da, D, nb * D // db, D))
    grid_fig(s, cells, cols_for(cells))
    return ans


def qa(s, items):
    """[(질문, 정답, 단위)] → 질문 + 답 칸, 정답 글 목록"""
    out = []
    for q, a, *u in items:
        s.ask(rd(q))
        out.append('%s%s' % (a, u[0] if u else ''))
    return out


def same_as(f):
    return lambda o: V(o) == V(f)


def write(s, lv, items):
    """앱 writeStep(교과서): [(질문, 예시 ph)]"""
    for q, ph in items:
        s.ask(rd(q), blank=False)
        if lv == '기본형':
            s.text(rd(ph))
            s.lines(1)
        else:
            s.lines(2)


def write_h(s, lv, q, help1):
    """앱 writeStep·thenWhy(이야기, 도움 둘째 줄로 쓰기 틀)"""
    s.ask(rd(q), blank=False)
    if lv == '기본형':
        s.fill(frame(help1))
    else:
        s.lines(2)


def lessons_head(s, no, soop, title, question, scene=None):
    s.lesson(no, soop, rd(title), rd(question))
    if scene:
        s.scene(None, rd(scene))


def seq_order(s, items, order):
    """앱 sequence: items 원래 차례(㉠~㉤ 붙어 있음), order = 바른 차례의 번호"""
    s.fill([rd(t) for t in items])
    s.ask('놀이 순서대로 기호를 써 보세요.   (      ) → (      ) → (      ) → (      ) → (      )', blank=False)
    return ' → '.join(KO[i] for i in order)


def note_line(s):
    s.text('※ 식은 분수를 위아래로 썼어요. 글 속에서는 ‘4분의 3’, ‘2와 4분의 1’처럼 읽는 말로 썼어요. '
           '네모 칸에는 수를, 큰 네모 칸에는 분수나 소수를 써요.')


# ================================================================ 그림
def bar_fig(s, rows, UW=760, fs=30, max_mm=170):
    """막대: rows [(이름, 칸 수, 색칠 양(분수 글 또는 None), 점선 칸 수 또는 None)]"""
    lab_w = max(eq_w(r[0], fs) for r in rows) + 30
    out, y = [], 12
    for i, (name, d, sh, dash) in enumerate(rows):
        h = 96 if tall(name) else 76
        cy = y + h / 2
        eq_line(name, 12, cy, fs, out)
        x0 = 12 + lab_w
        if sh:
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="50" fill="%s"/>'
                       % (x0, cy - 25, UW * float(V(sh)), FILLS[i % 4]))
        if dash:
            for k in range(1, dash):
                if (k * d) % dash:
                    x = x0 + UW * k / dash
                    out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="#555" stroke-width="1.6" '
                               'stroke-dasharray="6 5"/>' % (x, cy - 25, x, cy + 25))
        for k in range(1, d):
            x = x0 + UW * k / d
            out.append('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.6"/>' % (x, cy - 25, x, cy + 25, INK))
        out.append('<rect x="%.1f" y="%.1f" width="%d" height="50" fill="none" stroke="%s" stroke-width="3.5"/>' % (x0, cy - 25, UW, INK))
        y += h
    W, H = int(12 + lab_w + UW + 16), int(y + 10)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def blank_bars(s, items):
    """색칠할 빈 막대: items [(이름, 칸 수)]"""
    bar_fig(s, [(n, d, None, None) for n, d in items])


def split_bars(s, lv, v, parts, label=None):
    """앱 rd4Split: v만큼 색칠한 막대를 parts칸으로 나누기. 기본형은 칸을 그어 두고, 도전형은 처음 칸만(선을 직접 그음)."""
    n, d = nd(v)
    rows = [((label or '[%s]' % v), d, v, None)]
    for p in parts:
        assert (V(v) * p).denominator == 1, (v, p)
        rows.append(('%d칸' % p, p if lv == '기본형' else 1, v, None))
    bar_fig(s, rows)


def pie_fig(s, rows, R=100, fs=28, max_mm=120):
    """원(피자·그릇·수박) 똑같이 d조각: rows [(이름, d)] — 색칠은 학생이"""
    out = []
    step_w = 2 * R + 150
    for i, (name, d) in enumerate(rows):
        cx, cy = 40 + R + i * step_w + 35, 20 + R
        out.append('<circle cx="%d" cy="%d" r="%d" fill="#fff" stroke="%s" stroke-width="3.5"/>' % (cx, cy, R, INK))
        if d > 1:
            import math
            for k in range(d):
                a = math.radians(-90 + 360 * k / d)
                out.append('<line x1="%d" y1="%d" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="2.6"/>'
                           % (cx, cy, cx + R * math.cos(a), cy + R * math.sin(a), INK))
        eq_line(name, cx - eq_w(name, fs) / 2, cy + R + 48, fs, out)
    W, H = int(40 + len(rows) * step_w + 20), int(2 * R + 110)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def wall_fig(s, ds, UW=900, max_mm=165):
    """분수 막대(벽): ds = [1, 6, 9, 15] — 한 줄에 [1/d]이 d칸"""
    out, y = [], 10
    for i, d in enumerate(ds):
        h = 76
        cw_ = UW / d
        for k in range(d):
            x = 12 + k * cw_
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" fill="%s" stroke="%s" stroke-width="2.4"/>'
                       % (x, y, cw_, h, FILLS[i % 4] if d > 1 else '#F2E6D0', INK))
            lab = '1' if d == 1 else '[1/%d]' % d
            f_ = min(24, cw_ * .42)
            eq_line(lab, x + cw_ / 2 - eq_w(lab, f_) / 2, y + h / 2, f_, out)
        y += h + 6
    W, H = int(UW + 26), int(y + 6)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def hund_fig(s, names, fs=30, max_mm=150):
    """100칸 모눈 두 개(한 칸 = 1/100)"""
    C, out = 30, []
    for i, name in enumerate(names):
        x0, y0 = 30 + i * (10 * C + 140), 70
        eq_line(name, x0 + 5 * C - eq_w(name, fs) / 2, 34, fs, out)
        for k in range(11):
            sw = 3.5 if k in (0, 10) else 1.6
            out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="%s"/>' % (x0, y0 + k * C, x0 + 10 * C, y0 + k * C, INK, sw))
            out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="%s"/>' % (x0 + k * C, y0, x0 + k * C, y0 + 10 * C, INK, sw))
    W, H = int(30 + len(names) * (10 * C + 140) - 110), int(70 + 10 * C + 20)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def nl_fig(s, all_labels, max_mm=170):
    """0~1 수직선(눈금 10칸)"""
    x0, L, y = 50, 1000, 70
    out = ['<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3.5"/>' % (x0, y, x0 + L, y, INK)]
    for k in range(11):
        x = x0 + L * k / 10
        big = k in (0, 5, 10)
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="%s"/>'
                   % (x, y - (22 if big else 14), x, y + (22 if big else 14), INK, 3 if big else 2))
        if k in (0, 10) or all_labels:
            lab = '0' if k == 0 else '1' if k == 10 else '0.%d' % k
            out.append(T(x, y + 52, lab, 28, anchor='middle'))
    W, H = x0 + L + 50, 130
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def cups_fig(s, fs_list, max_mm=110):
    """크기가 같은 컵(눈금은 분모만큼)에 담긴 양"""
    out = []
    for i, f in enumerate(fs_list):
        n, d = nd(f)
        x, y0, w, hh = 40 + i * 300, 30, 170, 240
        top = y0 + hh * (1 - n / d)
        out.append('<rect x="%d" y="%.1f" width="%d" height="%.1f" fill="#BFE0F7"/>' % (x, top, w, y0 + hh - top))
        for k in range(1, d):
            yy = y0 + hh * k / d
            out.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#5B6B6B" stroke-width="2"/>' % (x, yy, x + 26, yy))
        out.append('<path d="M%d,%d L%d,%d L%d,%d L%d,%d" fill="none" stroke="%s" stroke-width="4"/>'
                   % (x, y0 - 10, x, y0 + hh, x + w, y0 + hh, x + w, y0 - 10, INK))
        lab = '[%s]만큼' % f
        eq_line(lab, x + w / 2 - eq_w(lab, 26) / 2, y0 + hh + 52, 26, out)
    W, H = 40 + len(fs_list) * 300 - 90, 360
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def fold_fig(s, lv, v, parts, name):
    """색종이 접었다 펴기: v만큼 빨갛게 칠한 색종이를 parts칸으로"""
    rows = [('%s (처음)' % name, nd(v)[1], v, None)]
    for p in parts:
        rows.append(('%d칸' % p, p, v, None))
    bar_fig(s, rows)


def cards_text(s, title, items):
    s.table([[title] + ['카드 %d' % (i + 1) for i in range(len(items))], [''] + items], header=True, row_h=2600)


def game_record(s, cols=('판', '내 카드', '말한 조건(또는 들은 조건)', '접은 사람', '맞게 판정했나요?'), n=5):
    s.table([list(cols)] + [[str(i)] + [''] * (len(cols) - 1) for i in range(1, n + 1)], row_h=2300)


def tong_game(s, lv, pairs):
    """통분 놀이: 연습 카드 짝 + 기록표. pairs [(a, b)] → 정답 글"""
    if lv == '기본형':
        s.text('두 분모의 최소공배수를 먼저 구하고, 분모에 곱한 수만큼 분자에도 곱해요.')
    rows = [['카드 두 장', '두 분모의 최소공배수', '통분한 두 분수']]
    ans = []
    for a, b in pairs:
        (na, da), (nb, db) = nd(a), nd(b)
        L = lcm(da, db)
        rows.append(['%s, %s' % (rd('[%s]' % a), rd('[%s]' % b)), '', ''])
        ans.append('%s, %s → %d → (%d/%d, %d/%d)' % (a, b, L, na * L // da, L, nb * L // db, L))
    s.table(rows, row_h=2300)
    return ans


# ================================================================ 교과서 차시 버전 (세계 음식 축제)
FEST = '체험장: 스위스 퐁뒤 · 미국 브라우니 · 아르헨티나 바비큐 · 멕시코 타코 · 이탈리아 젤라토 · 필리핀 망고주스'
CMP_RULE = ['분모가 다른 두 분수의 크기를 비교할 때에는 두 분수를 ', (['통분하여', '약분하여', '더하여'], 0), ' 비교해요. 통분한 다음에는 ',
            (['분자', '분모'], 0), '가 큰 쪽이 더 큰 분수예요.']


def tb1(s, lv):
    lessons_head(s, 1, '개념 찾기(S)', '단원 도입 ― 세계 음식 축제에 가요', '우리 주변에서 약분과 통분은 언제 쓰일까요?',
                 '준서는 하은이, 유주와 함께 세계 음식 축제에 갔어요. 여러 나라의 전통 음식을 맛보고 직접 만들어 보는 체험을 할 수 있대요.')
    note_line(s)
    step(s, 0, '그림 살펴보기', '세계 음식 축제')
    s.text(FEST)
    a1 = chooses(s, [('준서와 친구들은 어디에 갔나요?', ['세계 음식 축제', '과학 박물관', '운동회'], 0),
                     ('체험장이 아닌 것은?', ['멕시코 타코 만들기', '필리핀 망고주스', '이탈리아 젤라토', '일본 초밥 만들기'], 3)])
    s.text(rd('유리컵에 물을 많이 넣을수록 높은 소리가 나요. 크기가 같은 두 컵에 물을 각각 [1/2]만큼, [5/6]만큼 넣었어요.'))
    cups_fig(s, ['1/2', '5/6'])
    assert V('5/6') > V('1/2')
    a1 += chooses(s, [('어느 컵에서 더 높은 소리가 날까요?', ['[1/2]만큼 넣은 컵', '[5/6]만큼 넣은 컵', '두 컵의 소리가 같아요'], 1)])
    step(s, 1, '만져 보기', '피자 두 판')
    s.text('크기가 같은 피자 두 판이 있어요. 한 판은 똑같이 4조각으로 나누어 2조각을, 다른 한 판은 똑같이 2조각으로 나누어 1조각을 먹었어요. 먹은 만큼 색칠해 보세요.')
    pie_fig(s, [('4조각 중 2조각', 4), ('2조각 중 1조각', 2)])
    assert Fraction(2, 4) == Fraction(1, 2)
    a2 = chooses(s, [('먹은 피자의 양을 비교해 보세요.', ['4조각 중 2조각이 더 많아요', '2조각 중 1조각이 더 많아요', '먹은 양이 같아요'], 2),
                     ('먹은 양을 분수로 나타내면?', ['[2/4]와 [1/2]', '[2/4]와 [1/4]', '[4/2]와 [2/1]'], 0)])
    step(s, 2, '말해 보기', '경험 떠올리기')
    write(s, lv, [('세계 여러 나라의 문화를 경험해 본 일을 써 보세요.', '예: 세계 여러 나라 문화 축제에 가서 다른 나라 음식을 먹어 보았어요.'),
                  ('생활에서 분모가 다른 분수의 크기를 비교해 본 경험을 써 보세요.', '예: 우유가 [1/2]만큼, [2/3]만큼 남은 두 병 중 어느 병에 더 많이 남았는지 비교해 봤어요.'),
                  ('이 단원에서 무엇이 궁금한가요?', '예: 그림을 그리지 않고 분모가 다른 분수의 크기를 비교하는 방법이 궁금해요.')])
    step(s, 3, '배운 내용 떠올리기', '3학년 분수와 소수, 5학년 약수와 배수')
    if lv == '기본형':
        s.text(rd('소수 한 자리 수는 분모가 10인 분수로 나타낼 수 있어요. 0.7은 [1/10]이 7개예요. 최대공약수는 공약수 중 가장 큰 수, 최소공배수는 공배수 중 가장 작은 수예요.'))
    assert V('0.7') == Fraction(7, 10) and Fraction(3, 10) == V('0.3')
    a4 = qa(s, [('① 0.7을 분수로 나타내 보세요.', '7/10'), ('② [3/10]을 소수로 나타내 보세요.', '0.3')])
    a4b = cmp2(s, [('[5/8]', '[3/8]'), ('0.6', '0.58')])
    a4c = qa(s, [('③ 12와 18의 최대공약수를 구해 보세요.', gcd(12, 18)), ('④ 4와 6의 최소공배수를 구해 보세요.', lcm(4, 6))])
    step(s, 4, '확인하기', '이 단원에서 배울 것')
    s.text('이 단원에서 배울 내용에 모두 ○ 하세요.')
    s.choices([('크기가 같은 분수 알아보기·만들기', '(    )'), ('약분과 기약분수', '(    )'), ('통분과 공통분모', '(    )'),
               ('분수와 소수의 크기 비교', '(    )'), ('분수의 곱셈', '(    )')])
    a5 = chooses(s, [('약분과 통분이 쓰이는 때로 알맞은 것은?', ['분모가 다른 두 분수의 크기를 비교할 때', '자연수의 덧셈을 할 때', '시각을 읽을 때'], 0)])
    ans = '1차시  ① %s  ② %s  ③ (자유)  ④ %s, %s, %s  ⑤ 앞의 네 가지에 ○, %s' % (
        ', '.join(a1), ', '.join(a2), ', '.join(a4), ' '.join(a4b), ', '.join(map(str, a4c)), a5[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 배운 내용 한 번 더')
        assert V('0.25') == Fraction(25, 100)
        a6 = qa(s, [('① 0.25를 분수로 나타내 보세요.', '25/100'), ('② 16과 24의 최대공약수를 구해 보세요.', gcd(16, 24)),
                    ('③ 6과 8의 최소공배수를 구해 보세요.', lcm(6, 8))])
        a6b = cmp2(s, [('[7/9]', '[4/9]'), ('1.3', '1.25')])
        s.ask('약분과 통분을 배우면 생활에서 어떤 점이 좋을지 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s / 예) 분모가 다른 분수의 크기를 그림 없이도 비교할 수 있어요.' % (', '.join(map(str, a6)), ' '.join(a6b))
    return ans


def tb2(s, lv):
    lessons_head(s, 2, '개념 구축하기(O)', '크기가 같은 분수를 알아볼까요', '준서와 하은이가 담은 치즈의 양을 어떻게 비교할 수 있을까요?',
                 '스위스 체험장에서 퐁뒤를 먹으려고 치즈를 녹였어요. 크기가 같은 그릇에 준서는 [1/2]만큼, 하은이는 [2/4]만큼 담았어요.')
    step(s, 0, '만져 보기', '그릇에 담은 치즈')
    s.text(rd('그릇 그림에 담은 치즈의 양만큼 색칠해 보세요.' + (' 준서의 그릇은 2칸 중 1칸, 하은이의 그릇은 4칸 중 2칸을 색칠해요.' if lv == '기본형' else '')))
    pie_fig(s, [('준서 [1/2]', 2), ('하은 [2/4]', 4)])
    assert Fraction(1, 2) == Fraction(2, 4)
    a1 = chooses(s, [('담은 치즈의 양을 비교해 보세요.', ['준서가 더 많이 담았어요', '하은이가 더 많이 담았어요', '두 사람이 담은 양은 같아요'], 2)])
    step(s, 1, '그려 보기', '막대 세 개')
    s.text(rd('길이가 같은 막대 3개에 [1/3], [2/6], [3/9]만큼 색칠하고 크기를 비교해 보세요.'))
    blank_bars(s, [('[1/3]', 3), ('[2/6]', 6), ('[3/9]', 9)])
    assert V('1/3') == V('2/6') == V('3/9') == V('4/12') and V('4/10') != V('1/3')
    a2 = chooses(s, [('세 분수의 크기를 비교해 보세요.', ['[1/3]이 가장 커요', '[3/9]가 가장 커요', '세 분수의 크기가 모두 같아요'], 2),
                     ('[1/3], [2/6], [3/9] 다음에 올 크기가 같은 분수는?', ['[4/12]', '[4/10]', '[3/12]'], 0)])
    step(s, 2, '말해 보기', '색칠한 끝 견주기')
    s.text(rd('[3/4], [6/8], [9/12]만큼 막대에 색칠하고, 크기를 비교하여 이야기해 보세요.'))
    blank_bars(s, [('[3/4]', 4), ('[6/8]', 8), ('[9/12]', 12)])
    assert V('3/4') == V('6/8') == V('9/12')
    a3 = chooses(s, [('세 분수의 크기를 비교해 보세요.', ['세 분수의 크기가 모두 같아요', '[9/12]가 가장 커요', '[3/4]이 가장 작아요'], 0),
                     ('어떻게 알 수 있나요?', ['색칠한 부분의 끝이 한 줄로 맞아요', '분모가 클수록 큰 분수예요', '분자가 클수록 큰 분수예요'], 0)])
    step(s, 3, '약속하기', '크기가 같은 분수')
    a4 = blanks(s, lv, ['[1/3], [2/6], [3/9], [4/12], …처럼 분모와 분자는 달라도 ', (['크기가 같은', '크기가 다른'], 0), ' 분수가 있어요. [1/2]과 ',
                        (['[2/4]', '[2/3]', '[1/4]'], 0), ', [3/4]과 ', (['[6/8]', '[3/8]', '[4/8]'], 0), '도 크기가 같은 분수예요.'])
    step(s, 4, '확인하기', '수학익힘 문제')
    s.text(rd('[1/5], [2/10], [3/15]만큼 색칠하고 크기를 비교해 보세요.'))
    blank_bars(s, [('[1/5]', 5), ('[2/10]', 10), ('[3/15]', 15)])
    a5 = chooses(s, [('[1/5], [2/10], [3/15]는 어떤 분수인가요?', ['크기가 같은 분수', '크기가 다른 분수'], 0)])
    a5b = pick_eq_val(s, '[2/6], [4/12], [5/18] 중 크기가 같은 분수를 모두 고르세요.', ['2/6', '4/12', '5/18'], same_as('1/3'), [0, 1])
    a5c = pick_eq_val(s, '[9/12]와 크기가 같은 분수를 모두 고르세요.', ['6/8', '5/8', '3/4', '2/4'], same_as('9/12'), [0, 2])
    ans = '2차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ %s, %s, %s' % (a1[0], ', '.join(a2), ', '.join(a3), ', '.join(a4), a5[0], a5b, a5c)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 분수 막대에서 찾기')
        s.text(rd('분수 막대에 자를 세로로 대어 [3/9]의 끝과 [10/15]의 끝에 놓아 보고, 크기가 같은 분수를 찾아보세요.'))
        wall_fig(s, [1, 6, 9, 15])
        a6 = pick_eq_val(s, '[3/9]과 크기가 같은 분수를 모두 고르세요.', ['2/6', '3/6', '5/15', '4/15'], same_as('3/9'), [0, 2])
        a6b = pick_eq_val(s, '[10/15]과 크기가 같은 분수를 모두 고르세요.', ['4/6', '5/6', '6/9', '7/9'], same_as('10/15'), [0, 2])
        s.ask(rd('분모와 분자가 다른데도 [3/9]과 [5/15]의 크기가 같은 까닭을 써 보세요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s (3/9 = 2/6 = 5/15, 10/15 = 4/6 = 6/9) / 예) 분수 막대에서 색칠한 끝이 한 줄로 맞아요.' % (a6, a6b)
    return ans


def tb3(s, lv):
    lessons_head(s, 3, '개념 구축하기(O)', '크기가 같은 분수를 만들어 볼까요',
                 '하은이와 유주가 준서와 같은 양만큼 브라우니를 먹으려면 각각 얼마만큼 먹어야 할까요?',
                 '미국 체험장에서 준서는 브라우니를 [1/2]만큼 먹었어요. 하은이는 크기가 같은 브라우니를 똑같이 4조각으로, 유주는 똑같이 8조각으로 나누었어요.')
    step(s, 0, '만져 보기', '색종이 접었다 펴기')
    s.text('반을 빨간색으로 칠한 색종이를 반으로 계속 접었다 펴며, 빨간색 부분을 분수로 나타내 보세요.' +
           (' 반으로 한 번 더 접으면 칸 수가 2배가 돼요.' if lv == '기본형' else ''))
    fold_fig(s, lv, '1/2', [4, 8], '색종이')
    a1 = chain(s, [('하은이가 먹어야 하는 양', '[{2}/4]'), ('유주가 먹어야 하는 양', '[{4}/8]'), mulrow('1/2', 2), mulrow('1/2', 4)])
    step(s, 1, '그려 보기', '막대를 9칸, 6칸으로')
    s.text(rd('[12/18]만큼 색칠한 막대를 9칸, 6칸으로 똑같이 나누어 [12/18]와 크기가 같은 분수를 만들어 보세요.' +
              ('' if lv == '기본형' else ' 막대에 나누는 선을 그어 보세요.')))
    split_bars(s, lv, '12/18', [9, 6])
    a2 = chain(s, [mulrow('12/18', 2, '÷'), mulrow('12/18', 3, '÷'), mulrow('12/18', 6, '÷')])
    step(s, 2, '말해 보기', '만든 방법')
    a3 = chooses(s, [('[1/2] = [2/4] = [3/6] = [4/8] = …에서 분모와 분자를 어떻게 했나요?',
                      ['분모와 분자에 각각 같은 수 2, 3, 4를 곱했어요', '분모에만 2, 3, 4를 곱했어요', '분모와 분자에 서로 다른 수를 곱했어요'], 0),
                     ('[12/18] = [6/9] = [4/6] = [2/3]에서 분모와 분자를 어떻게 했나요?',
                      ['분모와 분자를 각각 같은 수 2, 3, 6으로 나누었어요', '분모만 2, 3, 6으로 나누었어요', '분모와 분자를 서로 다른 수로 나누었어요'], 0),
                     ('분모와 분자에 0을 곱하면 어떻게 될까요?',
                      ['[1/5], [1/6], [1/7]이 모두 [0/0]이 되어 크기가 다른 분수끼리 같다고 해야 하는 이상한 일이 생겨요', '언제나 크기가 같은 분수가 돼요'], 0)])
    step(s, 3, '약속하기', '크기가 같은 분수 만들기')
    a4 = blanks(s, lv, ['분모와 분자에 각각 ', (['0이 아닌 같은 수', '서로 다른 수'], 0), '를 곱하면 크기가 같은 분수가 돼요. 분모와 분자를 각각 0이 아닌 같은 수로 ',
                        (['나누면', '더하면', '빼면'], 0), ' 크기가 같은 분수가 돼요.'])
    step(s, 4, '확인하기', '[6/8]과 크기가 같은 분수')
    if lv == '기본형':
        s.text(rd('분모와 분자에 각각 2를 곱하면 [12/16]이에요. 분모와 분자를 각각 2로 나누면 [3/4]이에요.'))
    eq_fig(s, ['[6/8] = ▢ = ▢ = ▢'])
    ex = ['%d/%d' % (6 * k, 8 * k) for k in (2, 3)] + ['3/4']
    assert all(V(x) == V('6/8') for x in ex)
    a5 = chooses(s, [('어떤 방법으로 만들었나요?', ['분모와 분자에 각각 0이 아닌 같은 수를 곱하거나 같은 수로 나누었어요', '분모와 분자에 같은 수를 더했어요',
                                              '분모에만 같은 수를 곱했어요'], 0)])
    ans = '3차시  ① %s  ② %s  ③ %s  ④ %s  ⑤ 예) %s (크기가 같으면 모두 정답), %s' % (
        a1, a2, ', '.join(a3), ', '.join(a4), ', '.join(ex), a5[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 빈칸에 알맞은 수')
        a6 = chain(s, ['[3/7] = [6/{14}] = [{9}/21]', '[45/72] = [{15}/24] = [5/{8}]', '[4/5] = [{8}/10] = [{12}/15] = [16/{20}]',
                       '[24/64] = [12/{32}] = [{6}/16] = [3/{8}]', '[4/15] = [{24}/90]', '[2/9] = [4/18] = [{6}/27] = [{8}/36]'])
        s.ask('분모와 분자에 0을 곱하면 안 되는 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s / 예) 분모가 0이 되어 분수가 될 수 없고, 모든 분수가 [0/0]이 되어 크기를 구별할 수 없어요.'.replace('[0/0]', '0/0') % a6
    return ans


def tb4(s, lv):
    lessons_head(s, 4, '개념 구축하기(O)', '분수를 간단하게 나타내어 볼까요', '준서가 먹은 바비큐의 양 [8/16]을 간단한 분수로 어떻게 나타낼 수 있을까요?',
                 '아르헨티나 체험장에서 준서는 숯불에 오랫동안 익힌 바비큐 한 개를 [8/16]만큼 먹었어요.')
    step(s, 0, '만져 보기', '막대를 8칸, 4칸, 2칸으로')
    s.text(rd('[8/16]만큼 색칠한 막대를 8칸, 4칸, 2칸으로 똑같이 나누어 간단한 분수로 나타내 보세요.' +
              ('' if lv == '기본형' else ' 막대에 나누는 선을 그어 보세요.')))
    split_bars(s, lv, '8/16', [8, 4, 2])
    a1 = chain(s, [mulrow('8/16', 2, '÷'), mulrow('8/16', 4, '÷'), mulrow('8/16', 8, '÷')])
    assert [k for k in divisors(16) if 8 % k == 0 and k > 1] == [2, 4, 8]
    a1b = blanks(s, '기본형', ['공통으로 나눈 수 2, 4, 8은 분모 16과 분자 8의 ', (['공약수', '공배수', '최소공배수'], 0), '예요.'])
    step(s, 1, '그려 보기', '더 이상 나눌 수 없을 때까지')
    s.text(rd('[16/40]을 간단한 분수로 나타내 봐요. 분모와 분자를 공약수로 나누어, 더 이상 나눌 수 없을 때까지 나누어 보세요.'))
    if lv == '기본형':
        s.text('40의 약수: 1, 2, 4, 5, 8, 10, 20, 40   /   16의 약수: 1, 2, 4, 8, 16')
    cd = [k for k in divisors(40) if 16 % k == 0]
    assert cd == [1, 2, 4, 8]
    a2 = qa(s, [('① 40과 16의 공약수를 모두 써 보세요.', ', '.join(map(str, cd)))])
    a2b = chain(s, [('나누어 보기', '[16/40] = [{8}/{20}] = [{4}/{10}] = [{2}/{5}]')]) if lv == '기본형' else None
    if lv == '도전형':
        s.ask('② 더 이상 나눌 수 없는 가장 간단한 분수를 구하는 과정을 식으로 써 보세요.', blank=False)
        eq_fig(s, ['[16/40] = '], indent=20)
        s.lines(1)
    step(s, 2, '말해 보기', '한 번에 간단하게')
    assert gcd(40, 16) == 8
    a3 = chooses(s, [('[16/40]을 한 번에 [2/5]로 나타내려면 분모와 분자를 무엇으로 나누어야 하나요?', ['40과 16의 최대공약수 8', '40과 16의 최소공배수 80', '2'], 0)])
    a3b = pick_eq_val(s, '분모와 분자의 공약수가 1뿐인 분수를 모두 고르세요.', ['1/2', '4/8', '2/5', '4/10'], lambda o: gcd(*nd(o)) == 1, [0, 2])
    a3c = chooses(s, [('[8/16]을 간단하게 나타낼 때 [8/16] = [1/2]처럼 써도 되나요?', ['네, 약분은 이렇게 나타낼 수도 있어요', '아니요, 한 번에 2로만 나누어야 해요'], 0)])
    step(s, 3, '약속하기', '약분과 기약분수')
    a4 = blanks(s, lv, ['분모와 분자를 1이 아닌 ', (['공약수', '공배수', '아무 수'], 0), '로 나누어 간단한 분수로 나타내는 것을 ', (['약분한다', '통분한다'], 0),
                        '고 해요. [1/2]과 같이 분모와 분자의 공약수가 1뿐인 분수를 ', (['기약분수', '단위분수', '가분수'], 0), '라고 해요.'])
    step(s, 4, '확인하기', '약분하기')
    s.text('분수를 약분해 보세요. 약분한 분수는 기약분수가 아니어도 정답이에요.')
    a5 = red_grid(s, ['8/24', '12/32', '25/45', '48/60'])
    a5b = qa(s, [('⑤ 서윤이가 농구공을 20번 던져서 6번 넣었어요. 넣은 횟수는 전체의 얼마인지 기약분수로 나타내 보세요.', irr('6/20'))])
    ans = '4차시  ① %s, %s  ② %s%s  ③ %s, %s, %s  ④ %s  ⑤ %s (중간까지 약분한 분수도 정답), %s' % (
        a1, a1b[0], a2[0], (' / ' + a2b) if a2b else ' / 16/40 = 8/20 = 4/10 = 2/5 (또는 16/40 = 2/5)', a3[0], a3b, a3c[0],
        ', '.join(a4), ', '.join(a5), a5b[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 약분과 기약분수 문제')
        a6 = qa(s, [('① 30과 24의 최대공약수를 구해 보세요.', gcd(30, 24)), ('② [24/30]을 기약분수로 나타내 보세요.', irr('24/30'))])
        a6b = pick_eq_val(s, '③ [20/50]을 약분한 분수를 모두 고르세요.', ['10/25', '4/10', '2/5', '5/20'], lambda o: o in red_all('20/50'), [0, 1, 2])
        a6c = pick_eq_val(s, '④ [40/56]을 약분한 분수를 모두 고르세요.', ['20/28', '10/14', '5/7', '8/14'], lambda o: o in red_all('40/56'), [0, 1, 2])
        assert irr('40/48') == '5/6' and len(red_all('40/48')) == 3
        a6d = chooses(s, [('⑤ [40/48]을 잘못 말한 사람은? 소희: “기약분수로 나타내면 [5/6]야.” 진우: “약분하여 만들 수 있는 분수는 모두 4개야.”', ['소희', '진우'], 1)])
        cnt = sum(1 for n in range(1, 22) if 22 + n < 30 and gcd(n, 22) == 1)
        assert cnt == 4
        a6e = qa(s, [('⑥ 도서관에 있는 책 81권 중 54권이 만화책이에요. 만화책은 전체의 얼마인지 기약분수로 나타내 보세요.', irr('54/81')),
                     ('⑦ 분모가 22인 진분수 중에서 분모와 분자의 합이 30보다 작은 기약분수는 모두 몇 개인가요?', cnt, '개')])
        s.ask('최대공약수로 나누면 한 번에 기약분수가 되는 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s, %s, %s, %s(진우: 20/24, 10/12, 5/6 3개뿐), %s (1/22, 3/22, 5/22, 7/22) / 예) 최대공약수로 나누면 남은 분모와 분자의 공약수가 1뿐이에요.' % (
            a6[0], a6[1], a6b, a6c, a6d[0], ', '.join(map(str, a6e)))
    return ans


def tb5(s, lv):
    lessons_head(s, 5, '개념 구축하기(O)', '분모가 같은 분수로 나타내어 볼까요', '준서와 하은이 중 누가 토마토를 더 많이 사용했을까요?',
                 '멕시코 체험장에서 타코를 만드는 데 크기가 같은 토마토를 준서는 [1/2]개, 하은이는 [2/3]개 사용했어요.')
    step(s, 0, '만져 보기', '같은 칸 수로 나누기')
    s.text(rd('두 막대를 같은 칸 수로 나누어, 색칠한 끝이 모두 칸의 경계와 맞는 때를 찾아보세요.' +
              (' 두 분모 2와 3의 곱인 6칸으로 나눈 점선을 그려 두었어요.' if lv == '기본형' else ' 두 막대에 나누는 선을 그어 보세요.')))
    bar_fig(s, [('준서 [1/2]', 2, '1/2', 6 if lv == '기본형' else None), ('하은 [2/3]', 3, '2/3', 6 if lv == '기본형' else None)])
    a1 = chain(s, [mulrow('1/2', 3), mulrow('2/3', 2)])
    assert V('2/3') > V('1/2')
    a1b = chooses(s, [('토마토를 더 많이 사용한 사람은?', ['준서', '하은'], 1)])
    step(s, 1, '그려 보기', '분모가 같은 짝 찾기')
    s.text(rd('[3/4]과 [5/6]과 크기가 같은 분수를 분모가 작은 것부터 늘어놓고, 분모가 같은 짝을 모두 찾아 ○ 하세요.'))
    r1 = '[3/4] = ' + ' = '.join('[{%d}/%d]' % (3 * k, 4 * k) for k in range(2, 7))
    r2 = '[5/6] = ' + ' = '.join('[{%d}/%d]' % (5 * k, 6 * k) for k in range(2, 7))
    a2 = chain(s, [r1, r2])
    common = sorted(set(4 * k for k in range(1, 7)) & set(6 * k for k in range(1, 7)))
    assert common == [12, 24]
    a2b = chooses(s, [('분모가 같은 짝의 분모 12, 24는 4와 6의 무엇인가요?', ['공배수', '공약수'], 0)])
    step(s, 2, '말해 보기', '알게 된 것')
    assert lcm(4, 6) == 12
    a3 = chooses(s, [('12는 4와 6의 무엇인가요?', ['최소공배수', '최대공약수', '곱'], 0)])
    a3b = pick(s, '[3/4]과 [5/6]의 분모를 같게 할 때 분모가 될 수 있는 수를 모두 고르세요.', ['12', '24', '36', '18', '48'],
               [i for i, x in enumerate([12, 24, 36, 18, 48]) if x % 4 == 0 and x % 6 == 0])
    a3c = chooses(s, [('두 분모의 곱 4 × 6 = 24도 분모가 될 수 있나요?', ['네, 24는 4와 6의 공배수예요', '아니요, 최소공배수만 쓸 수 있어요'], 0)])
    step(s, 3, '약속하기', '통분과 공통분모')
    a4 = blanks(s, lv, ['분모가 다른 분수의 분모를 같게 나타내는 것을 ', (['통분한다', '약분한다'], 0), '고 하고, 통분한 분모를 ', (['공통분모', '기약분수', '공약수'], 0), '라고 해요.'])
    step(s, 4, '확인하기', '두 가지 방법으로 통분하기')
    s.text(rd('[7/8]과 [5/12]을 두 가지 방법으로 통분해 보세요.' + (' 두 분모의 곱: 8 × 12 = 96, 최소공배수: 24' if lv == '기본형' else '')))
    assert lcm(8, 12) == 24
    a5 = chain(s, [mulrow('7/8', 12, '×', '두 분모의 곱 96'), mulrow('5/12', 8, '×', '두 분모의 곱 96'),
                   mulrow('7/8', 3, '×', '최소공배수 24'), mulrow('5/12', 2, '×', '최소공배수 24')])
    a5b = blanks(s, '기본형', ['두 분모의 곱을 공통분모로 하면 최소공배수를 구하지 않아도 되지만 분모와 분자가 ', (['커져서 계산이 복잡해요', '작아져서 계산이 간단해요'], 0),
                             '. 최소공배수를 공통분모로 하면 최소공배수를 구해야 하지만 수가 ', (['작아서 계산이 간단해요', '커서 계산이 복잡해요'], 0), '.'])
    ans = '5차시  ① %s, %s  ② %s → (9/12, 10/12), (18/24, 20/24), %s  ③ %s, %s, %s  ④ %s  ⑤ %s / %s' % (
        a1, a1b[0], a2, a2b[0], a3[0], a3b, a3c[0], ', '.join(a4), a5, ', '.join(a5b))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 분수를 통분해요')
        s.text(rd('①은 두 분모의 곱, ②는 두 분모의 최소공배수, ③은 90을 공통분모로 하여 통분해 보세요.'))
        a6 = tong_grid(s, [('5/8', '9/10', 80), ('5/8', '9/10', lcm(8, 10)), ('4/15', '7/9', 90)])
        a6b = pick(s, '④ [7/16]과 [3/40]의 공통분모가 될 수 있는 수를 모두 고르세요.', ['40', '80', '120', '160', '200'],
                   [i for i, x in enumerate([40, 80, 120, 160, 200]) if x % 16 == 0 and x % 40 == 0])
        s.text(rd('⑤ 누군가 [3/4]과 [7/10]을 ([3/20], [7/20])으로 잘못 통분했어요. 옳게 통분해 보세요.'))
        a6c = tong_grid(s, [('3/4', '7/10', 20)])
        assert irr('16/56') == '2/7' and irr('20/56') == '5/14'
        a6d = qa(s, [('⑥ 두 기약분수를 통분하였더니 [16/56], [20/□]이 되었어요. □ 안에 알맞은 수는?', 56),
                     ('⑦ 통분하기 전의 두 기약분수를 구해 보세요.', '2/7, 5/14')])
        s.ask(rd('[3/4]과 [7/10]을 ([3/20], [7/20])으로 통분한 것이 왜 틀렸는지 써 보세요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s, %s, %s, %s / 예) 분모에만 곱하고 분자에는 같은 수를 곱하지 않아서 크기가 달라졌어요.' % (
            ', '.join(a6), a6b, a6c[0], a6d[0], a6d[1])
    return ans


def tb6(s, lv):
    lessons_head(s, 6, '개념 구축하기(O)', '분수의 크기를 비교해 볼까요', '딸기 맛 젤라토와 초코 맛 젤라토 중 어느 맛이 더 많이 남아 있을까요?',
                 '이탈리아 체험장에서 크기가 같은 통에 딸기 맛 젤라토는 [5/6]만큼, 초코 맛 젤라토는 [7/10]만큼 남아 있어요.')
    step(s, 0, '만져 보기', '같은 칸 수로 나누어 비교하기')
    s.text(rd('두 막대를 같은 칸 수로 나누어 보고, 두 분모의 곱(60칸)과 최소공배수(30칸)로 나누어 비교해 보세요.' +
              (' 점선은 30칸으로 나눈 선이에요.' if lv == '기본형' else '')))
    bar_fig(s, [('딸기 맛 [5/6]', 6, '5/6', 30 if lv == '기본형' else None), ('초코 맛 [7/10]', 10, '7/10', 30 if lv == '기본형' else None)])
    pr, pa = pairrow('5/6', '7/10', lcm(6, 10), '최소공배수 30')
    a1 = chain(s, [mulrow('5/6', 10, '×', '곱 60'), mulrow('7/10', 6, '×', '곱 60'), pr])
    a1b = chooses(s, [('더 많이 남은 젤라토는?', ['딸기 맛', '초코 맛'], 0 if V('5/6') > V('7/10') else 1)])
    step(s, 1, '그려 보기', '세 분수의 크기 비교')
    s.text(rd('세 분수 [4/6], [3/8], [5/9]의 크기를 두 분수끼리 통분하여 비교해 보세요.'))
    rows, pas = zip(*[pairrow(a, b, D) for a, b, D in [('4/6', '3/8', 24), ('3/8', '5/9', 72), ('4/6', '5/9', 18)]])
    a2 = chain(s, list(rows))
    a2b = order_q(s, '큰 분수부터 차례로 써 보세요.', [('[4/6]', '4/6'), ('[3/8]', '3/8'), ('[5/9]', '5/9')])
    step(s, 2, '말해 보기', '크기를 비교하는 방법')
    a3 = chooses(s, [('분모가 다른 세 분수의 크기를 비교하는 방법으로 알맞은 것은?', ['두 분수끼리 통분하여 차례대로 비교해요', '분모가 큰 분수가 더 커요', '분자만 비교해요'], 0),
                     ('[2 3/4]과 [2 4/5]처럼 대분수의 크기를 비교할 때 먼저 할 일은?', ['자연수 부분을 먼저 비교해요', '분모를 먼저 비교해요'], 0),
                     ('자연수 부분이 같은 [2 3/4]과 [2 4/5]은 어떻게 비교하나요?', ['분수 부분 [3/4]과 [4/5]을 통분하여 비교해요', '분자 3과 4만 비교해요'], 0)])
    step(s, 3, '약속하기', '분모가 다른 분수의 크기 비교')
    a4 = blanks(s, lv, CMP_RULE)
    step(s, 4, '확인하기', '크기 비교하기')
    if lv == '기본형':
        s.text(rd('[5/11]과 [4/9]은 99로 통분해요. 대분수는 자연수 부분이 같으면 분수 부분을 통분해요.'))
    a5 = cmp2(s, [('[5/11]', '[4/9]'), ('[5/6]', '[11/12]'), ('[2 3/4]', '[2 4/5]'), ('[3/10]', '[8/25]'), ('[4 5/8]', '[4 7/12]')])
    a5b = order_q(s, '[4/9], [1/3], [2/5]를 큰 분수부터 차례로 써 보세요.', [('[4/9]', '4/9'), ('[1/3]', '1/3'), ('[2/5]', '2/5')])
    cnt = sum(1 for k in range(1, 10) if V('5/14') > Fraction(k, 21))
    assert cnt == 7
    s.ask(rd('1부터 9까지의 수 중에서 □ 안에 들어갈 수 있는 수는 모두 몇 개인가요?'), blank=False)
    eq_fig(s, ['[5/14] > [□/21]        답: (        )개'])
    ans = '6차시  ① %s, %s  ② %s, %s  ③ %s  ④ %s  ⑤ %s, %s, %d개' % (
        a1, a1b[0], ' / '.join(pas), a2b, ', '.join(a3), ', '.join(a4), ' '.join(a5), a5b, cnt)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수 카드로 분수 만들기')
        s.text('수 카드 5, 7, 9를 한 번씩만 사용하여 분자가 1, 2, 4인 분수를 3개 만들고, 만든 세 분수를 비교하여 가장 큰 분수를 찾아보세요.')
        cards_fig(s, ['5', '7', '9'])
        eq_fig(s, ['[1/▢]      [2/▢]      [4/▢]'.replace('▢', '□')])
        s.ask('가장 큰 분수: (          )', blank=False)
        import itertools
        best = max((max(Fraction(1, p[0]), Fraction(2, p[1]), Fraction(4, p[2])), p) for p in itertools.permutations([5, 7, 9]))
        assert best[0] == Fraction(4, 5)
        s.ask('만든 분수 중 가장 큰 분수가 될 수 있는 것 중에서 가장 큰 것은 무엇일지, 까닭과 함께 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ 만든 분수에 따라 답이 달라요 (예: 1/5, 2/7, 4/9 → 4/9 > 2/7 > 1/5) / 예) 분자가 가장 큰 4에 가장 작은 5를 놓은 4/5 — 분자는 크고 분모는 작을수록 커요.'
    return ans


def tb7(s, lv):
    lessons_head(s, 7, '개념 구축하기(O)', '분수와 소수의 크기를 비교해 볼까요', '망고주스를 [2/5] L 따른 준서와 0.3 L 따른 하은이 중 누가 더 많이 따랐을까요?',
                 '필리핀 체험장에서 망고주스를 준서는 [2/5] L, 하은이는 0.3 L 따랐어요.')
    step(s, 0, '만져 보기', '수직선에 놓기')
    s.text(rd('수직선에 [2/5]와 0.3을 놓아 보세요.' + (' [2/5]의 분모와 분자에 2를 곱하면 분모가 10인 분수가 돼요.' if lv == '기본형' else '')))
    nl_fig(s, lv == '기본형')
    assert V('2/5') == V('0.4')
    a1 = chain(s, ['[2/5] = [2×{2}/5×{2}] = [{4}/10] = {0.4}', '0.3 = [{3}/{10}]', '[2/5] ○ 0.3'])
    a1b = chooses(s, [('망고주스를 더 많이 따른 사람은?', ['준서', '하은'], 0)])
    step(s, 1, '그려 보기', '100칸 모눈')
    s.text(rd('[8/25]과 0.48의 크기를 비교해 봐요. 모눈 한 칸은 [1/100]이에요. 두 수만큼 모눈에 색칠해 보세요.'))
    hund_fig(s, ['[8/25]', '0.48'])
    assert V('8/25') == V('0.32') and V('0.48') == V('12/25')
    a2 = chain(s, ['[8/25] = [8×{4}/25×{4}] = [{32}/100] = {0.32}', '0.48 = [{48}/100] = [48÷{4}/100÷{4}] = [{12}/{25}]', '[8/25] ○ 0.48'])
    step(s, 2, '말해 보기', '두 가지 방법')
    s.text(rd('0.7과 [3/5]의 크기를 두 가지 방법으로 비교해 보세요.'))
    assert V('3/5') == V('0.6') and V('0.7') > V('3/5')
    a3 = chain(s, [('방법 1 분수를 소수로', '[3/5] = [{6}/10] = {0.6}'), ('', '0.7 ○ 0.6 이므로 0.7 ○ [3/5]'),
                   ('방법 2 소수를 분수로', '0.7 = [{7}/{10}],  [3/5] = [{6}/{10}]  →  0.7 ○ [3/5]')])
    a3b = blanks(s, '기본형', ['소수 한 자리 수는 분모가 ', (['10', '100'], 0), '인 분수로, 소수 두 자리 수는 분모가 ', (['10', '100'], 1), '인 분수로 나타내요.'])
    step(s, 3, '약속하기', '분수와 소수의 크기 비교')
    a4 = blanks(s, lv, ['분수와 소수의 크기를 비교할 때에는 분수를 ', (['소수', '자연수'], 0), '로 나타내어 비교하거나 소수를 ', (['분수', '자연수'], 0), '로 나타내어 비교해요.'])
    step(s, 4, '확인하기', '분수와 소수의 크기 비교')
    if lv == '기본형':
        s.text(rd('[9/20] = [45/100] = 0.45, [1 9/50] = [1 18/100] = 1.18이에요.'))
    a5 = cmp2(s, [('[1/2]', '0.5'), ('[9/20]', '0.41'), ('1.07', '[1 9/50]')])
    a5b = order_q(s, '시우가 수확한 채소 바구니의 무게예요. 무거운 것부터 차례로 기호를 써 보세요.',
                  [('가 [97/100] kg', '97/100'), ('나 1.02 kg', '1.02'), ('다 [1 3/25] kg', '1 3/25')])
    a5b = re.sub(r' [\d ./]+ kg', '', a5b)
    ans = '7차시  ① %s, %s  ② %s  ③ %s, %s  ④ %s  ⑤ %s, %s' % (
        a1.replace('○', SG('2/5', '0.3')), a1b[0], a2.replace('○', SG('8/25', '0.48')), a3.replace('○', '>'), ', '.join(a3b), ', '.join(a4), ' '.join(a5), a5b)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수학익힘 문제')
        a6 = qa(s, [('① [1/2]을 소수로 나타내 보세요.', fx(V('1/2')) and '0.5')])
        assert V('1/2') == V('0.5')
        a6b = cmp2(s, [('[1/2]', '0.7'), ('0.39', '[7/20]'), ('[3/4]', '0.7'), ('8.41', '[8 20/50]')])
        a6c = pick_eq_val(s, '② [5/8]보다 큰 수를 고르세요.', ['0.6', '15/25', '0.74'], lambda o: V(o) > V('5/8'), [2])
        a6d = pick_eq_val(s, '③ 0.39보다 크고 [44/100]보다 작은 분수 중에서 분모가 100인 기약분수를 모두 고르세요.',
                          ['40/100', '41/100', '42/100', '43/100'], lambda o: V('0.39') < V(o) < V('44/100') and gcd(*nd(o)) == 1, [1, 3])
        cnt = sum(1 for k in range(20) if V('4 11/20') < 4 + Fraction(k, 20) < V('4.7'))
        assert cnt == 2
        a6e = qa(s, [('④ 분모가 20인 분수 중에서 [4 11/20]보다 크고 4.7보다 작은 분수는 모두 몇 개인가요?', cnt, '개')])
        s.ask('분수와 소수를 비교할 때 어느 쪽으로 나타내는 것이 편리한지 까닭과 함께 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s, %s, %s, %s (4 12/20, 4 13/20)' % (a6[0], ' '.join(a6b), a6c, a6d, a6e[0])
    return ans


def tb8(s, lv):
    lessons_head(s, 8, '탐구 정리하기(O)', '생각을 더하다 ― [1/2]을 기준으로 길이를 비교해 볼까요', '통분하지 않고 [1/2] km를 기준으로 둘레길 코스의 길이를 비교할 수 있을까요?',
                 '승아는 아버지와 함께 둘레길을 걸으려고 해요. 4코스는 [3/4] km, 5코스는 [2/8] km예요. 아버지께서 “통분하지 않고 [1/2] km를 기준으로 비교할 수도 있단다.”라고 하셨어요.')
    step(s, 0, '만져 보기', '막대에 색칠하기')
    s.text(rd('막대에 [2/8], [1/2], [3/4]만큼 색칠해 보세요.'))
    blank_bars(s, [('5코스 [2/8]', 8), ('[1/2]', 2), ('4코스 [3/4]', 4)])
    assert V('2/8') < V('1/2') < V('3/4')
    a1 = chooses(s, [('[2/8]는 [1/2]보다', ['작아요', '커요'], 0), ('[3/4]은 [1/2]보다', ['작아요', '커요'], 1), ('길이가 더 긴 코스는?', ['4코스', '5코스'], 0)])
    step(s, 1, '그려 보기', '[1/2]과 크기가 같은 분수')
    a2 = chain(s, ['[1/2] = [{2}/4] = [{3}/6] = [{4}/8]'])
    a2b = blanks(s, '기본형', ['분모 4, 6, 8은 분자 2, 3, 4를 ', (['2배', '3배'], 0), ' 한 수예요.'])
    step(s, 2, '말해 보기', '분자를 2배 한 수와 분모')
    s.text('둘레길 표지판의 코스 길이예요. 분자를 2배 한 수를 구하고 분모와 비교해 보세요.')
    courses = [('1코스', '1/4'), ('3코스', '3/10'), ('5코스', '2/8'), ('2코스', '7/8'), ('4코스', '3/4'), ('6코스', '5/6')]
    rows = [['코스', '길이(km)', '분자 × 2', '분모', '분자 × 2와 분모 비교']]
    for c, f in courses:
        rows.append([c, rd('[%s]' % f), '', '', '( < / > )'])
    s.table(rows, row_h=2300)
    a3 = ['%s %d%s%d' % (c, 2 * nd(f)[0], '<' if 2 * nd(f)[0] < nd(f)[1] else '>', nd(f)[1]) for c, f in courses]
    for c, f in courses[:3]:
        assert V(f) < V('1/2')
    for c, f in courses[3:]:
        assert V(f) > V('1/2')
    a3b = blanks(s, '기본형', ['[1/2]보다 짧은 코스는 분자를 2배 한 수가 분모보다 ', (['작아요', '커요'], 0), '. [1/2]보다 긴 코스는 분자를 2배 한 수가 분모보다 ', (['작아요', '커요'], 1), '.'])
    step(s, 3, '약속하기', '[1/2]을 기준으로 비교하기')
    a4 = blanks(s, lv, ['분자를 2배 한 수가 분모보다 작으면 [1/2] km보다 ', (['짧고', '길고'], 0), ', 분자를 2배 한 수가 분모보다 크면 [1/2] km보다 ', (['길어요', '짧아요'], 0), '.'])
    step(s, 4, '확인하기', '캠핑장 시설까지의 거리')
    if lv == '기본형':
        s.text(rd('화장실 [3/8] km: 3 × 2 = 6은 8보다 작아요.'))
    places = [('화장실', '3/8'), ('사무실', '7/10'), ('매점', '7/16'), ('샤워장', '13/20'), ('체육 시설', '5/12'), ('주차장', '9/14')]
    bins = ['[1/2] km보다 가까운 곳', '[1/2] km보다 먼 곳']
    a5 = sort_cards(s, [('%s [%s] km' % (p, f), 1 if V(f) > V('1/2') else 0) for p, f in places], bins)
    near = [p for (p, f), b in zip(places, a5) if b == bins[0]]
    far = [p for (p, f), b in zip(places, a5) if b == bins[1]]
    assert near == ['화장실', '매점', '체육 시설']
    ans = '8차시  ① %s  ② %s, %s  ③ %s / %s  ④ %s  ⑤ 가까운 곳: %s / 먼 곳: %s' % (
        ', '.join(a1), a2, a2b[0], ', '.join(a3), ', '.join(a3b), ', '.join(a4), ', '.join(near), ', '.join(far))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 통분하지 않고 비교하기')
        s.text(rd('[4/5]와 [6/7]은 1보다 각각 [1/5], [1/7]만큼 작아요. [9/13] = [18/26]이에요.'))
        a6 = cmp2(s, [('[4/5]', '[6/7]'), ('[7/11]', '[6/13]'), ('[18/25]', '[9/13]')])
        a6b = pick_eq_val(s, '[1/2]보다 큰 분수를 모두 고르세요.', ['5/12', '8/15', '11/20', '9/18', '7/16'], lambda o: V(o) > V('1/2'), [1, 2])
        s.ask(rd('[18/25]와 [9/13]를 통분하지 않고 비교한 방법을 써 보세요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s / 예) 9/13 = 18/26으로 분자를 같게 하면 분모가 작은 18/25가 더 커요.' % (' '.join(a6), a6b)
    return ans


GAME_SEQ_TB = ['㉠ 조건에 해당하는 사람은 모두 손가락을 하나 접어요.', '㉡ 가위바위보로 순서를 정하고, 왼손을 들어 손가락을 모두 펼쳐요.',
               '㉢ 자기 차례가 되면 카드에 적힌 수와 크기를 비교하는 조건을 만들어 말해요.', '㉣ 각자 카드를 한 장씩 가져와 수가 보이도록 놓아요.',
               '㉤ 사용한 카드는 한쪽에 모아 두어요.']
TONG_PAIRS = [('3/4', '5/6'), ('2/9', '1/6'), ('3/8', '2/5'), ('4/7', '1/2')]


def tb9(s, lv):
    lessons_head(s, 9, '발표하기(P)', '놀이를 더하다 ― 손가락 접어!', '분모가 다른 분수, 분수와 소수의 크기를 빠르게 비교할 수 있을까요?')
    step(s, 0, '카드 만들기', '놀이 준비')
    s.text('빈 카드 4장에 진분수, 1보다 작은 소수 한 자리 수, 1보다 작은 소수 두 자리 수를 자유롭게 써넣어요. 진분수의 분모는 2부터 9까지의 수 중에서 써요.')
    if lv == '기본형':
        s.text(rd('예: 진분수 [3/8], 소수 한 자리 수 0.6, 소수 두 자리 수 0.45'))
    cards_text(s, '내 카드', ['진분수', '진분수', '소수 한 자리 수', '소수 두 자리 수'])
    step(s, 1, '놀이 방법 알기', '순서 정하기')
    a2 = seq_order(s, GAME_SEQ_TB, [1, 3, 2, 0, 4])
    s.text('남은 카드가 없을 때까지 놀이를 되풀이하고, 펼친 손가락이 많은 사람이 이겨요.')
    step(s, 2, '조건 판단하기', '0.64보다 큰 수')
    s.text(rd('하은이가 0.64 카드를 들고 “0.64보다 큰 수를 가지고 있는 사람 모두 손가락 하나 접어!”라고 말했어요.'))
    a3 = pick_eq_val(s, '손가락을 접어야 하는 사람을 모두 고르세요.', ['준서 0.75', '유주 [1/2]', '나 [7/10]'],
                     lambda o: V(o.split(' ')[1]) > V('0.64'), [0, 2])
    a3b = chooses(s, [('놀이에서 이기려면 조건을 어떻게 만들면 좋을까요?', ['조건에 해당하는 사람이 많도록, 나는 해당하지 않도록 만들어요', '내가 손가락을 접도록 만들어요'], 0)])
    step(s, 3, '놀이 약속', '지킬 약속')
    a4 = blanks(s, lv, ['조건을 말하는 사람은 자신이 조건에 ', (['해당되지 않도록', '해당되도록'], 0), ' 조건을 만들어요. 남은 카드가 없을 때 펼친 손가락이 ',
                        (['많은', '적은'], 0), ' 사람이 이겨요. 승부보다 크기를 바르게 비교하는 것이 중요해요.'])
    step(s, 4, '놀이하기', '손가락 접어!')
    if lv == '기본형':
        s.text(rd('분수와 소수를 비교할 때에는 소수를 분수로 나타내어 통분해 봐요. 예: 0.35 = [35/100]. 조건을 말한 사람과 크기가 같은 수는 접지 않아요.'))
    game_record(s)
    ans = '9차시  ① (자유)  ② %s  ③ %s, %s  ④ %s  ⑤ (놀이 기록)' % (a2, a3, a3b[0], ', '.join(a4))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 또 다른 놀이 ― 통분 놀이')
        s.text('분모가 2부터 9까지인 진분수 카드를 2장씩 뒤집어요. 두 분모의 최소공배수를 공통분모로 하여 통분하고, 옳게 통분하면 1점을 얻어요. 아래 카드로 먼저 연습해요.')
        a6 = tong_game(s, lv, TONG_PAIRS)
        s.ask('통분 놀이에서 빨리 통분하는 나만의 방법을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s' % ' / '.join(a6)
    return ans


def tb10(s, lv):
    lessons_head(s, 10, '발표하기(P)', '공부한 내용을 확인해요', '약분과 통분에 대해 배운 내용을 잘 알고 있나요?')
    step(s, 0, '내 힘으로 풀어요 ①', '크기가 같은 분수')
    s.text(rd('[1/4], [3/8], [3/12]만큼 색칠하고, 크기가 같은 분수를 찾아보세요.'))
    blank_bars(s, [('[1/4]', 4), ('[3/8]', 8), ('[3/12]', 12)])
    a1 = pick_eq_val(s, '크기가 같은 두 분수를 고르세요.', ['1/4', '3/8', '3/12'], same_as('1/4'), [0, 2])
    a1b = pick_eq_val(s, '[24/30]와 크기가 같은 분수를 모두 고르세요.', ['4/5', '10/15', '48/60', '8/10', '70/90'], same_as('24/30'), [0, 2, 3])
    step(s, 1, '내 힘으로 풀어요 ②', '약분과 통분')
    s.text('분수를 약분해 보세요. 약분한 분수는 기약분수가 아니어도 정답이에요.')
    a2 = red_grid(s, ['16/36', '40/60'])
    s.text(rd('[5/6]과 [3/10]을 ③ 두 분모의 곱, ④ 두 분모의 최소공배수를 공통분모로 하여 통분해 보세요.'))
    a2b = tong_grid(s, [('5/6', '3/10', 60), ('5/6', '3/10', lcm(6, 10))])
    step(s, 2, '내 힘으로 풀어요 ③', '크기 비교')
    a3 = cmp2(s, [('[4/7]', '[6/11]'), ('[2 2/3]', '[2 3/6]'), ('[3/4]', '0.9'), ('0.64', '[16/25]')])
    step(s, 3, '내 힘으로 풀어요 ④', '소금이 녹은 비커')
    s.text(rd('크기가 같은 비커에 온도가 같은 물을 넣고 소금을 녹였더니, 물의 양이 많을수록 녹은 소금이 많았어요. 넣은 물의 양은 가 [5/6]컵, 나 [5/8]컵, 다 [9/10]컵이에요.'))
    s.text('① 가와 나를 24로, ② 가와 다를 30으로 통분해 보세요.')
    a4 = tong_grid(s, [('5/6', '5/8', 24), ('5/6', '9/10', 30)])
    vals = {'가': V('5/6'), '나': V('5/8'), '다': V('9/10')}
    mx, mn = max(vals, key=vals.get), min(vals, key=vals.get)
    assert (mx, mn) == ('다', '나')
    a4b = chooses(s, [('녹은 소금이 가장 많은 비커는?', ['가', '나', '다'], 2), ('녹은 소금이 가장 적은 비커는?', ['가', '나', '다'], 1)])
    step(s, 4, '확인하고 정리해요', '배운 내용 정리')
    a5 = chain(s, [mulrow('1/3', 2, '×', '크기가 같은 분수'), mulrow('12/15', 3, '÷', '약분')])
    a5b = blanks(s, '기본형', ['분모와 분자를 1이 아닌 공약수로 나누어 간단한 분수로 나타내는 것을 ', (['약분한다', '통분한다'], 0), '고 해요. 분모가 다른 분수의 분모를 같게 나타내는 것을 ',
                             (['약분한다', '통분한다'], 1), '고 해요.'])
    assert V('1/4') == V('0.25') and V('1/4') < V('0.5')
    a5c = chain(s, [mulrow('3/4', 8, '×', '통분(곱 32)'), mulrow('5/8', 4, '×', '통분(곱 32)'), ('분수와 소수', '[1/4] = [{25}/100] = {0.25}'), '[1/4] ○ 0.5'])
    ans = '10차시  ① %s, %s  ② %s (약분한 분수 모두 정답), %s  ③ %s  ④ %s, %s  ⑤ %s / %s / %s' % (
        a1, a1b, ', '.join(a2), ', '.join(a2b), ' '.join(a3), ', '.join(a4), ', '.join(a4b), a5, ', '.join(a5b), a5c.replace('○', '<'))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 문제를 해결해요')
        a6 = pick_eq_val(s, '① [3/8]보다 크고 [7/12]보다 작은 분수 중에서 분모가 24인 기약분수를 모두 고르세요.', ['10/24', '11/24', '12/24', '13/24', '14/24'],
                         lambda o: V('3/8') < V(o) < V('7/12') and gcd(*nd(o)) == 1, [1, 3])
        a6b = order_q(s, '② [2/3], [3/5], [5/8]을 큰 분수부터 차례로 써 보세요.', [('[2/3]', '2/3'), ('[3/5]', '3/5'), ('[5/8]', '5/8')])
        a6c = cmp2(s, [('[13/20]', '0.6')])
        a6d = qa(s, [('③ [36/48]을 기약분수로 나타내 보세요.', irr('36/48'))])
        s.ask('약분과 통분은 어떤 점이 같고 어떤 점이 다른지 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s, %s, %s / 예) 둘 다 크기가 같은 분수를 만드는 방법을 쓰지만, 약분은 나누어 간단하게, 통분은 곱하여 분모를 같게 해요.' % (a6, a6b, a6c[0], a6d[0])
    return ans


# ================================================================ 이야기 버전 (우리 반 과일 가게 놀이)
def st1(s, lv):
    lessons_head(s, 1, '개념 찾기(S)', '우리 반 과일 가게 놀이를 준비해요', '과일 가게 놀이를 준비할 때 분수는 어디에 쓰일까요?',
                 '새봄초등학교 5학년 3반은 다음 주에 ‘알록달록 과일 가게 놀이’를 열어요. 가게 대표 지우, 주스 바를 맡은 도윤, 가격표 담당 수아, '
                 '과일 자르기 담당 건우, 장부 담당 채린이가 가게를 준비해요.')
    note_line(s)
    step(s, 0, '만져 보기', '보기·생각하기·궁금해하기')
    s.fill([rd(t) for t in ['📝 과일 가게 준비 메모',
                            '건우: 수박 한 통을 똑같이 8조각으로 잘라 4조각을 팔았어요. ‘수박 반 통 팔림’이라고 써도 될까요?',
                            '수아: 사과 파이를 우리 모둠은 6조각 중 3조각, 옆 모둠은 2조각 중 1조각 먹었대요.',
                            '도윤: 같은 컵에 딸기 주스 [3/4]컵, 키위 주스 [2/3]컵을 담았어요. 어느 주스가 더 많을까요?',
                            '채린: 딸기 24팩 중 18팩이 팔렸어요. 장부에 [18/24]이라고 쓰니 너무 복잡해요.',
                            '지우: 가격표에 바나나는 [3/5] kg, 포도는 0.7 kg이라고 쓰여 있어요.']])
    panes(s, lv, [('보여요', '그림과 메모에서 ~이 보여요', '수박 8조각 중 4조각을 팔았다고 쓰여 있어요.'),
                  ('생각해요', '~은 ~일 것 같아요', '수박 8조각 중 4조각은 반 통과 양이 같을 것 같아요.'),
                  ('궁금해요', '~은 어떻게 할까?', '장부에 쓴 분수를 더 간단한 분수로 나타낼 수 있을까?')])
    step(s, 1, '그려 보기', '수박 조각 색칠하기')
    s.text('건우가 크기가 같은 수박 두 통을 잘랐어요. 한 통은 똑같이 8조각으로 나누어 4조각을, 다른 한 통은 똑같이 2조각으로 나누어 1조각을 팔았어요. 판 만큼 색칠해 보세요.')
    pie_fig(s, [('8조각 중 4조각', 8), ('2조각 중 1조각', 2)])
    assert Fraction(4, 8) == Fraction(1, 2)
    a2 = chooses(s, [('판 수박의 양을 비교해 보세요.', ['8조각 중 4조각이 더 많아요', '2조각 중 1조각이 더 많아요', '판 양이 같아요'], 2),
                     ('판 양을 분수로 나타내면?', ['[4/8]와 [1/2]', '[4/8]와 [1/4]', '[8/4]과 [2/1]'], 0)])
    why(s, lv, '조각 수가 다른데 판 수박의 양이 같은 까닭을 써 보세요.', '‘8조각 중 4조각은 한 통의 ~이고, 2조각 중 1조각도 ~이라서 양이 같아요.’ 꼴로 써요.')
    step(s, 2, '말해 보기', '나누고 견주어 본 경험')
    write_h(s, lv, '음식을 똑같이 나누어 먹거나 담아 본 경험을 써 보세요.', '‘○○을 □조각으로 똑같이 나누어 △명이 ☆조각씩 먹었어요.’ 꼴로 써요.')
    write_h(s, lv, '분모가 다른 두 분수의 크기를 견주어 본 경험을 써 보세요.', '‘○○이 □만큼, △만큼 남아서 ~으로 견주어 보았어요.’ 꼴로 써요.')
    step(s, 3, '약속하기', '이 단원에서 배울 것')
    s.text('이 단원에서 배울 내용에 모두 ○ 하세요.')
    s.choices([('크기가 같은 분수 알아보기·만들기', '(    )'), ('약분과 기약분수', '(    )'), ('통분과 공통분모', '(    )'),
               ('분수와 소수의 크기 비교', '(    )'), ('분수의 곱셈', '(    )')])
    a4 = chooses(s, [('[18/24]처럼 분모와 분자가 큰 분수를 간단하게 나타내는 것과 관계있는 것은?', ['분수를 간단하게 나타내기(약분)', '분모를 같게 나타내기(통분)'], 0),
                     ('딸기 주스 [3/4]컵과 키위 주스 [2/3]컵의 양을 견주려면 무엇이 필요할까요?', ['두 분수의 분모를 같게 나타내기(통분)', '두 분수의 분자끼리 더하기'], 0)])
    step(s, 4, '확인하기', '배운 내용 떠올리기')
    if lv == '기본형':
        s.text(rd('소수 한 자리 수는 분모가 10인 분수로 나타낼 수 있어요. 0.6은 [1/10]이 6개예요. 최대공약수는 공약수 중 가장 큰 수, 최소공배수는 공배수 중 가장 작은 수예요.'))
    assert V('0.6') == V('6/10') and V('7/10') == V('0.7')
    a5 = qa(s, [('① 0.6을 분수로 나타내 보세요.', '6/10'), ('② [7/10]을 소수로 나타내 보세요.', '0.7')])
    a5b = cmp2(s, [('[4/9]', '[7/9]'), ('0.45', '0.5')])
    a5c = qa(s, [('③ 18과 24의 최대공약수를 구해 보세요.', gcd(18, 24)), ('④ 6과 9의 최소공배수를 구해 보세요.', lcm(6, 9))])
    ans = '1차시  ① (자유)  ② %s / 예) 8조각 중 4조각은 한 통의 절반이고, 2조각 중 1조각도 절반이라서 판 양이 같아요.  ③ (자유)  ④ 앞의 네 가지에 ○, %s  ⑤ %s, %s, %s' % (
        ', '.join(a2), ', '.join(a4), ', '.join(a5), ' '.join(a5b), ', '.join(map(str, a5c)))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 배운 내용 한 번 더')
        assert V('0.35') == V('35/100') and V('9/100') == V('0.09')
        a6 = qa(s, [('① 0.35를 분수로 나타내 보세요.', '35/100'), ('② [9/100]를 소수로 나타내 보세요.', '0.09'),
                    ('③ 20과 30의 최대공약수를 구해 보세요.', gcd(20, 30)), ('④ 8과 12의 최소공배수를 구해 보세요.', lcm(8, 12))])
        a6b = cmp2(s, [('[11/12]', '[5/12]'), ('1.4', '1.38')])
        s.ask(rd('[3/4]컵과 [2/3]컵 중 어느 주스가 더 많은지 내 생각과 까닭을 써 보세요.'), blank=False)
        s.lines(2)
        assert V('3/4') > V('2/3')
        ans += '  ⑥ %s, %s / 예) 3/4 = 9/12, 2/3 = 8/12라서 딸기 주스가 더 많아요(1에서 모자란 1/4이 1/3보다 작아요).' % (', '.join(map(str, a6)), ' '.join(a6b))
    return ans


def st2(s, lv):
    lessons_head(s, 2, '개념 구축하기(O)', '사과 파이를 나누어요 ― 크기가 같은 분수', '조각 수가 달라도 같은 양이라고 할 수 있을까요?',
                 '건우가 크기가 같은 사과 파이 두 판을 구웠어요. 수아는 똑같이 3조각으로 나눈 파이에서 1조각을, 채린이는 똑같이 6조각으로 나눈 파이에서 2조각을 접시에 담았어요.')
    step(s, 0, '만져 보기', '사과 파이 나누기')
    s.text('담은 만큼 색칠해 보세요.' + (' 수아의 파이는 3조각 중 1조각, 채린이의 파이는 6조각 중 2조각을 색칠해요.' if lv == '기본형' else ''))
    pie_fig(s, [('수아 [1/3]', 3), ('채린 [2/6]', 6)])
    assert V('1/3') == V('2/6')
    a1 = chooses(s, [('수아와 채린이가 담은 파이의 양을 비교해 보세요.', ['수아가 더 많이 담았어요', '채린이가 더 많이 담았어요', '두 사람이 담은 양은 같아요'], 2)])
    step(s, 1, '그려 보기', '바나나 케이크 막대')
    s.text(rd('건우는 길이가 같은 바나나 케이크 3개를 각각 3칸, 6칸, 12칸으로 똑같이 나누어 [2/3], [4/6], [8/12]만큼 팔았어요. 판 만큼 색칠하고 크기를 비교해 보세요.'))
    blank_bars(s, [('[2/3]', 3), ('[4/6]', 6), ('[8/12]', 12)])
    assert V('2/3') == V('4/6') == V('8/12') == V('6/9') and V('5/9') != V('2/3') and V('3/4') != V('2/3')
    a2 = chooses(s, [('세 분수의 크기를 비교해 보세요.', ['[8/12]이 가장 커요', '[2/3]가 가장 커요', '세 분수의 크기가 모두 같아요'], 2),
                     ('[2/3]와 크기가 같은 분수를 하나 더 고르세요.', ['[6/9]', '[5/9]', '[3/4]'], 0)])
    step(s, 2, '말해 보기', '분수 막대에서 찾기')
    s.text(rd('지우가 가게 벽에 붙일 분수 막대를 만들었어요. 자를 세로로 대어 [3/4]의 끝과 [1/2]의 끝에 놓아 보고, 끝이 맞는 분수를 찾아보세요.'))
    wall_fig(s, [1, 2, 4, 8, 12])
    a3 = pick_eq_val(s, '[3/4]과 크기가 같은 분수를 모두 고르세요.', ['6/8', '9/12', '7/8', '8/12'], same_as('3/4'), [0, 1])
    a3b = pick_eq_val(s, '[1/2]과 크기가 같은 분수를 모두 고르세요.', ['2/4', '4/8', '6/12', '5/12'], same_as('1/2'), [0, 1, 2])
    why(s, lv, '분모가 다른데도 크기가 같은 분수가 생기는 까닭을 써 보세요.', '‘한 칸을 더 작게 나누면 ~가 많아지지만 색칠한 양은 ~라서 크기가 같아요.’ 꼴로 써요.')
    step(s, 3, '약속하기', '크기가 같은 분수')
    a4 = blanks(s, lv, ['[1/3]과 [2/6], [2/3]와 [4/6]처럼 분모와 분자는 달라도 ', (['크기가 같은', '크기가 다른'], 0), ' 분수가 있어요. 분수만큼 그림에 색칠했을 때 색칠한 부분의 크기가 ',
                        (['같으면', '다르면'], 0), ' 크기가 같은 분수예요. [3/4]과 ', (['[6/8]', '[3/8]', '[4/8]'], 0), '도 크기가 같은 분수예요.'])
    step(s, 4, '확인하기', '가격표 막대')
    s.text(rd('수아가 가격표 막대에 [3/5], [6/10], [8/15]만큼 색칠하려고 해요. 색칠하고 크기가 같은 분수를 찾아보세요.'))
    blank_bars(s, [('[3/5]', 5), ('[6/10]', 10), ('[8/15]', 15)])
    a5 = pick_eq_val(s, '크기가 같은 분수를 모두 고르세요.', ['3/5', '6/10', '8/15'], same_as('3/5'), [0, 1])
    a5b = pick_eq_val(s, '[4/12]와 크기가 같은 분수를 모두 고르세요.', ['1/3', '2/6', '3/12', '2/4'], same_as('4/12'), [0, 1])
    ans = '2차시  ① %s  ② %s  ③ %s, %s / 예) 한 칸을 더 작게 나누면 칸 수(분모)와 색칠한 칸 수(분자)가 많아지지만 색칠한 양은 그대로라서 크기가 같아요.  ④ %s  ⑤ %s, %s' % (
        a1[0], ', '.join(a2), a3, a3b, ', '.join(a4), a5, a5b)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 다른 분수 막대')
        s.text(rd('자를 세로로 대어 [2/3]의 끝과 [5/15]의 끝에 놓아 보고, 크기가 같은 분수를 찾아보세요.'))
        wall_fig(s, [1, 3, 6, 9, 15])
        a6 = pick_eq_val(s, '[2/3]와 크기가 같은 분수를 모두 고르세요.', ['4/6', '6/9', '10/15', '5/9'], same_as('2/3'), [0, 1, 2])
        a6b = pick_eq_val(s, '[5/15]와 크기가 같은 분수를 모두 고르세요.', ['1/3', '2/6', '3/9', '4/9'], same_as('5/15'), [0, 1, 2])
        ans += '  ⑥ %s, %s (2/3 = 4/6 = 6/9 = 10/15, 5/15 = 1/3 = 2/6 = 3/9)' % (a6, a6b)
    return ans


def st3(s, lv):
    lessons_head(s, 3, '개념 구축하기(O)', '가격표 색종이를 접어요 ― 크기가 같은 분수 만들기', '분모와 분자를 어떻게 하면 크기가 같은 분수를 만들 수 있을까요?',
                 '수아가 가격표를 만들 색종이의 [1/3]을 빨간색으로 칠했어요.')
    step(s, 0, '만져 보기', '색종이 접었다 펴기')
    rule_first(s, lv, '색종이를 반으로 접었다 펼 때마다 분모와 분자는 어떻게 될까요?', '‘내 규칙: 반으로 접을 때마다 분모는 ~, 분자는 ~가 돼요.’ 꼴로 써요.')
    s.text('색종이를 반으로 계속 접었다 펴며, 빨간색 부분을 분수로 나타내 보세요.')
    fold_fig(s, lv, '1/3', [6, 12], '가격표 색종이')
    a1 = chain(s, [('한 번 접었다 펴면', '[{2}/6]'), ('두 번 접었다 펴면', '[{4}/12]'), mulrow('1/3', 2), mulrow('1/3', 4)])
    s.ask('예상이 맞았나요? 실제 규칙을 써 보세요.', blank=False)
    s.lines(1)
    step(s, 1, '그려 보기', '딸기 우유 막대 나누기')
    s.text(rd('도윤이가 딸기 우유 한 팩의 [8/12]만큼 컵에 따랐어요. [8/12]만큼 색칠한 막대를 6칸, 3칸으로 똑같이 나누어 [8/12]과 크기가 같은 분수를 만들어 보세요.' +
              ('' if lv == '기본형' else ' 막대에 나누는 선을 그어 보세요.')))
    split_bars(s, lv, '8/12', [6, 3])
    a2 = chain(s, [mulrow('8/12', 2, '÷'), mulrow('8/12', 4, '÷')])
    step(s, 2, '말해 보기', '만든 방법 말하기')
    assert V('2/5') == V('4/10') == V('6/15') == V('8/20') and V('18/24') == V('9/12') == V('6/8') == V('3/4')
    a3 = chooses(s, [('[2/5] = [4/10] = [6/15] = [8/20] = …에서 분모와 분자를 어떻게 했나요?',
                      ['분모와 분자에 각각 같은 수 2, 3, 4를 곱했어요', '분모에만 2, 3, 4를 곱했어요', '분모와 분자에 같은 수를 더했어요'], 0),
                     ('[18/24] = [9/12] = [6/8] = [3/4]에서 분모와 분자를 어떻게 했나요?',
                      ['분모와 분자를 각각 같은 수 2, 3, 6으로 나누었어요', '분모만 2, 3, 6으로 나누었어요', '분모와 분자를 서로 다른 수로 나누었어요'], 0)])
    why(s, lv, '크기가 같은 분수를 만들 때 왜 ‘0이 아닌 같은 수’를 곱하거나 나누어야 할까요?', '‘0을 곱하면 ~, 서로 다른 수를 곱하면 ~라서 0이 아닌 같은 수를 써야 해요.’ 꼴로 써요.')
    step(s, 3, '약속하기', '크기가 같은 분수 만들기')
    a4 = blanks(s, lv, ['분모와 분자에 각각 ', (['0이 아닌 같은 수', '서로 다른 수'], 0), '를 곱하면 크기가 같은 분수가 돼요. 분모와 분자를 각각 0이 아닌 같은 수로 ',
                        (['나누면', '더하면', '빼면'], 0), ' 크기가 같은 분수가 돼요.'])
    step(s, 4, '확인하기', '포도 가격표')
    s.text(rd('수아가 포도 한 송이 [4/10] kg을 다른 분수로도 써 보려고 해요. [4/10]와 크기가 같은 분수를 3개 만들어 보세요.'))
    if lv == '기본형':
        s.text(rd('분모와 분자에 각각 2를 곱하면 [8/20]이에요. 분모와 분자를 각각 2로 나누면 [2/5]예요.'))
    eq_fig(s, ['[4/10] = ▢ = ▢ = ▢'])
    ex = ['8/20', '12/30', '2/5']
    assert all(V(x) == V('4/10') for x in ex)
    a5 = chooses(s, [('어떤 방법으로 만들었나요?', ['분모와 분자에 각각 0이 아닌 같은 수를 곱하거나 같은 수로 나누었어요', '분모와 분자에 같은 수를 더했어요', '분모에만 같은 수를 곱했어요'], 0)])
    ans = '3차시  ① %s / 예) 반으로 접을 때마다 분모도 분자도 2배가 돼요.  ② %s  ③ %s / 예) 0을 곱하면 분모가 0이 되어 분수가 될 수 없고, 서로 다른 수를 곱하면 크기가 달라져요.  ④ %s  ⑤ 예) %s (크기가 같으면 모두 정답), %s' % (
        a1, a2, ', '.join(a3), ', '.join(a4), ', '.join(ex), a5[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 빈칸에 알맞은 수')
        a6 = chain(s, ['[5/6] = [10/{12}] = [{15}/18]', '[36/48] = [{18}/24] = [9/{12}] = [{3}/4]', '[3/8] = [{6}/16] = [{9}/24] = [12/{32}]', '[2/7] = [{12}/42]'])
        ans += '  ⑥ %s' % a6
    return ans


def st4(s, lv):
    lessons_head(s, 4, '개념 구축하기(O)', '판매 기록을 간단하게 ― 약분과 기약분수', '장부에 적은 [12/18]를 더 간단한 분수로 나타낼 수 있을까요?',
                 '채린이가 딸기 18팩 중 12팩이 팔렸다고 장부에 [12/18]로 적었어요.')
    step(s, 0, '만져 보기', '판매 기록 막대')
    s.text(rd('[12/18]만큼 색칠한 막대를 9칸, 6칸, 3칸으로 똑같이 나누어 간단한 분수로 나타내 보세요.' + ('' if lv == '기본형' else ' 막대에 나누는 선을 그어 보세요.')))
    split_bars(s, lv, '12/18', [9, 6, 3])
    a1 = chain(s, [mulrow('12/18', 2, '÷'), mulrow('12/18', 3, '÷'), mulrow('12/18', 6, '÷')])
    assert [k for k in divisors(18) if 12 % k == 0 and k > 1] == [2, 3, 6]
    a1b = blanks(s, '기본형', ['공통으로 나눈 수 2, 3, 6은 분모 18과 분자 12의 ', (['공약수', '공배수', '최소공배수'], 0), '예요.'])
    step(s, 1, '그려 보기', '귤 판매 기록 약분하기')
    s.text(rd('귤은 36개 중 24개가 팔려서 [24/36]로 적었어요.'))
    rule_first(s, lv, '분모와 분자를 더 이상 나눌 수 없을 때까지 나누면 분모와 분자의 공약수는 어떻게 될까요?', '‘내 규칙: 끝까지 나누면 분모와 분자의 공약수가 ~뿐이에요.’ 꼴로 써요.')
    if lv == '기본형':
        s.text('36의 약수: 1, 2, 3, 4, 6, 9, 12, 18, 36   /   24의 약수: 1, 2, 3, 4, 6, 8, 12, 24')
    cd = [k for k in divisors(36) if 24 % k == 0]
    assert cd == [1, 2, 3, 4, 6, 12]
    a2 = qa(s, [('① 36과 24의 공약수를 모두 써 보세요.', ', '.join(map(str, cd)))])
    s.ask(rd('② [24/36]의 분모와 분자를 공약수로 나누어 더 이상 나눌 수 없을 때까지 나누어 보세요.'), blank=False)
    eq_fig(s, ['[24/36] = '], indent=20)
    s.lines(1)
    a2b = irr('24/36')
    step(s, 2, '말해 보기', '한 번에 간단하게')
    assert gcd(36, 24) == 12
    a3 = chooses(s, [('[24/36]를 한 번에 [2/3]로 나타내려면 분모와 분자를 무엇으로 나누어야 하나요?', ['36과 24의 최대공약수 12', '36과 24의 최소공배수 72', '2'], 0)])
    a3b = pick_eq_val(s, '분모와 분자의 공약수가 1뿐인 분수를 모두 고르세요.', ['3/7', '6/9', '5/8', '10/12'], lambda o: gcd(*nd(o)) == 1, [0, 2])
    why(s, lv, '최대공약수로 나누면 왜 한 번에 가장 간단한 분수가 될까요?', '‘최대공약수는 ~ 수라서, 그 수로 나누면 남은 분모와 분자의 공약수가 ~뿐이에요.’ 꼴로 써요.')
    step(s, 3, '약속하기', '약분과 기약분수')
    a4 = blanks(s, lv, ['분모와 분자를 1이 아닌 ', (['공약수', '공배수', '아무 수'], 0), '로 나누어 간단한 분수로 나타내는 것을 ', (['약분한다', '통분한다'], 0),
                        '고 해요. [2/3]처럼 분모와 분자의 공약수가 1뿐인 분수를 ', (['기약분수', '단위분수', '가분수'], 0), '라고 해요.'])
    step(s, 4, '확인하기', '장부 정리하기')
    s.text('채린이의 장부에 적힌 분수를 약분해 보세요. 약분한 분수는 기약분수가 아니어도 정답이에요.')
    a5 = red_grid(s, ['6/16', '15/35', '18/27', '28/42'])
    a5b = qa(s, [('⑤ 가게에 사과 30개가 있었는데 12개가 팔렸어요. 팔린 사과는 전체의 얼마인지 기약분수로 나타내 보세요.', irr('12/30'))])
    ans = '4차시  ① %s, %s  ② %s / 24/36 = 12/18 = 2/3 등 (끝까지 나누면 %s) / 예) 끝까지 나누면 공약수가 1뿐이에요.  ③ %s, %s / 예) 최대공약수는 가장 큰 공약수라서 나누면 남은 분모와 분자의 공약수가 1뿐이에요.  ④ %s  ⑤ %s (약분한 분수 모두 정답), %s' % (
        a1, a1b[0], a2[0], a2b, a3[0], a3b, ', '.join(a4), ', '.join(a5), a5b[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 약분과 기약분수 문제')
        a6 = qa(s, [('① 56과 42의 최대공약수를 구해 보세요.', gcd(56, 42)), ('② [42/56]를 기약분수로 나타내 보세요.', irr('42/56'))])
        a6b = pick_eq_val(s, '③ [18/48]을 약분한 분수를 모두 고르세요.', ['9/24', '6/16', '3/8', '6/24'], lambda o: o in red_all('18/48'), [0, 1, 2])
        n36 = len(red_all('36/60'))
        assert irr('36/60') == '3/5' and n36 == 5
        a6c = chooses(s, [('④ [36/60]을 잘못 말한 사람은? 도윤: “기약분수로 나타내면 [3/5]이야.” 채린: “약분하여 만들 수 있는 분수는 모두 4개야.”', ['도윤', '채린'], 1)])
        c15 = sum(1 for k in range(1, 15) if gcd(k, 15) == 1)
        assert c15 == 8
        a6d = qa(s, [('⑤ 분모가 15인 진분수 중에서 기약분수는 모두 몇 개인가요?', c15, '개')])
        ans += '  ⑥ %s, %s, %s, %s (약분한 분수 %s → %d개), %s' % (a6[0], a6[1], a6b, a6c[0], ', '.join(red_all('36/60')), n36, a6d[0])
    return ans


def st5(s, lv):
    lessons_head(s, 5, '개념 구축하기(O)', '주스 바 메뉴판 ― 통분', '분모가 다른 두 주스의 양을 분모가 같은 분수로 나타낼 수 있을까요?',
                 '주스 바를 맡은 도윤이가 크기가 같은 컵에 딸기 주스를 [2/3]컵, 키위 주스를 [3/4]컵 담았어요.')
    step(s, 0, '만져 보기', '주스 막대 나누기')
    rule_first(s, lv, '두 막대를 몇 칸으로 나누어야 두 분수의 분모가 같아질까요?', '‘내 규칙: 3과 4의 ~인 칸 수로 나누면 분모가 같아져요.’ 꼴로 써요.')
    cups_fig(s, ['2/3', '3/4'])
    s.text('두 막대를 같은 칸 수로 나누어, 색칠한 끝이 모두 칸의 경계와 맞는 때를 찾아보세요.' + (' 점선은 12칸으로 나눈 선이에요.' if lv == '기본형' else ''))
    bar_fig(s, [('딸기 [2/3]', 3, '2/3', 12 if lv == '기본형' else None), ('키위 [3/4]', 4, '3/4', 12 if lv == '기본형' else None)])
    a1 = chain(s, [mulrow('2/3', 4), mulrow('3/4', 3)])
    a1b = chooses(s, [('주스가 더 많은 컵은?', ['딸기 주스', '키위 주스'], 1 if V('3/4') > V('2/3') else 0)])
    step(s, 1, '그려 보기', '공통분모 찾기')
    s.text(rd('도윤이는 망고 주스 [5/6]컵과 포도 주스 [4/9]컵도 분모를 같게 나타내 보려고 해요. 크기가 같은 분수를 분모가 작은 것부터 늘어놓고, 분모가 같은 짝을 모두 찾아 ○ 하세요.'))
    r1 = '[5/6] = ' + ' = '.join('[{%d}/%d]' % (5 * k, 6 * k) for k in range(2, 7))
    r2 = '[4/9] = ' + ' = '.join('[{%d}/%d]' % (4 * k, 9 * k) for k in range(2, 7))
    a2 = chain(s, [r1, r2])
    common = sorted(set(6 * k for k in range(1, 7)) & set(9 * k for k in range(1, 7)))
    assert common == [18, 36] and lcm(6, 9) == 18
    a2b = chooses(s, [('찾은 짝의 분모 18, 36은 6과 9의 무엇인가요?', ['공배수', '공약수'], 0),
                      ('분모가 같은 짝 중 분모가 가장 작은 18은 6과 9의 무엇인가요?', ['최소공배수', '최대공약수', '두 분모의 곱'], 0)])
    step(s, 2, '말해 보기', '두 가지 방법으로 통분하기')
    s.text(rd('채린이가 메뉴판에 레몬에이드 [3/10]컵, 자몽에이드 [7/15]컵을 적었어요. 두 분모의 곱과 두 분모의 최소공배수를 공통분모로 하여 각각 통분해 보세요.'))
    if lv == '기본형':
        s.text('두 분모의 곱: 10 × 15 = 150,  최소공배수: 30')
    r1, x1 = tongrow('3/10', '7/15', 150, '두 분모의 곱')
    r2, x2 = tongrow('3/10', '7/15', lcm(10, 15), '최소공배수')
    chain(s, r1 + r2)
    why(s, lv, '두 방법 중 어떤 방법이 더 편리한지 까닭과 함께 써 보세요.', '‘○○ 방법은 ~하지만 ~해요. 그래서 나는 ~ 방법이 편리해요.’ 꼴로 써요.')
    step(s, 3, '약속하기', '통분과 공통분모')
    a4 = blanks(s, lv, ['분모가 다른 분수의 분모를 같게 나타내는 것을 ', (['통분한다', '약분한다'], 0), '고 하고, 통분한 분모를 ', (['공통분모', '기약분수', '공약수'], 0),
                        '라고 해요. 두 분모의 ', (['공배수', '공약수'], 0), '는 모두 공통분모가 될 수 있어요.'])
    step(s, 4, '확인하기', '메뉴판 통분하기')
    s.text(rd('① [5/8]과 [1/6]을 두 분모의 최소공배수로, ② [2/9]와 [1/4]을 두 분모의 곱으로 통분해 보세요.'))
    a5 = tong_grid(s, [('5/8', '1/6', lcm(8, 6)), ('2/9', '1/4', 9 * 4)])
    a5b = pick(s, '③ [3/8]과 [5/12]의 공통분모가 될 수 있는 수를 모두 고르세요.', ['12', '24', '36', '48', '60'],
               [i for i, x in enumerate([12, 24, 36, 48, 60]) if x % 8 == 0 and x % 12 == 0])
    ans = '5차시  ① %s, %s / 예) 3과 4의 공배수인 12칸, 24칸, …으로 나누면 분모가 같아져요.  ② %s → (15/18, 8/18), (30/36, 16/36), %s  ③ %s, %s / 예) 최소공배수로 하면 수가 작아서 계산이 간단해요.  ④ %s  ⑤ %s, %s' % (
        a1, a1b[0], a2, ', '.join(a2b), x1, x2, ', '.join(a4), ', '.join(a5), a5b)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 통분을 이용하여 해결하기')
        s.text(rd('① 수아가 ([2/5], [3/4])를 ([2/20], [3/20])으로 잘못 통분했어요. 옳게 통분해 보세요.'))
        a6 = tong_grid(s, [('2/5', '3/4', 20)])
        assert irr('10/24') == '5/12' and irr('9/24') == '3/8'
        a6b = qa(s, [('② 두 기약분수를 통분하였더니 [10/24], [9/24]가 되었어요. 통분하기 전의 두 기약분수를 써 보세요.', '5/12, 3/8'),
                     ('③ [7/10]과 [4/15]를 통분할 때 가장 작은 공통분모는?', lcm(10, 15))])
        s.ask('통분한 분수를 약분하면 처음 분수로 돌아가는 까닭을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s / 예) 통분할 때 분모와 분자에 곱한 같은 수로 다시 나누는 것이라서 처음 분수가 돼요.' % (a6[0], ', '.join(map(str, a6b)))
    return ans


def st6(s, lv):
    lessons_head(s, 6, '개념 구축하기(O)', '어느 주스가 더 많이 남았을까? ― 분수의 크기 비교', '분모가 다른 분수의 크기는 어떻게 비교할까요?',
                 '가게를 마칠 때 크기가 같은 병에 망고 주스는 [5/8]만큼, 포도 주스는 [7/12]만큼 남았어요.')
    step(s, 0, '만져 보기', '남은 주스 비교하기')
    s.text('두 막대를 같은 칸 수로 나누어 분모를 같게 한 다음 비교해 보세요.' + (' 점선은 8과 12의 최소공배수 24칸으로 나눈 선이에요.' if lv == '기본형' else ''))
    bar_fig(s, [('망고 [5/8]', 8, '5/8', 24 if lv == '기본형' else None), ('포도 [7/12]', 12, '7/12', 24 if lv == '기본형' else None)])
    pr, pa = pairrow('5/8', '7/12', 24)
    chain(s, [pr])
    a1b = chooses(s, [('더 많이 남은 주스는?', ['망고 주스', '포도 주스'], 0 if V('5/8') > V('7/12') else 1)])
    step(s, 1, '그려 보기', '세 가지 주스 비교하기')
    s.text(rd('사과 주스 [3/5]병, 배 주스 [4/7]병, 귤 주스 [5/9]병이 남았어요. 두 분수씩 짝 지어 통분하여 비교해 보세요.'))
    rows, pas = zip(*[pairrow(a, b, D) for a, b, D in [('3/5', '4/7', 35), ('4/7', '5/9', 63), ('3/5', '5/9', 45)]])
    chain(s, list(rows))
    a2b = order_q(s, '많이 남은 것부터 차례로 써 보세요.', [('[3/5]', '3/5'), ('[4/7]', '4/7'), ('[5/9]', '5/9')])
    step(s, 2, '말해 보기', '통분하지 않고 비교하기')
    assert V('6/7') > V('4/5') and V('3/8') > V('3/10') and V('2 1/3') > V('1 5/6')
    a3 = chooses(s, [('[4/5]와 [6/7] 중 더 큰 분수는?', ['[6/7] ― 1에서 모자란 [1/7]이 [1/5]보다 작아요', '[4/5] ― 분모가 더 작아요'], 0),
                     ('[3/8]과 [3/10]처럼 분자가 같으면 어느 분수가 더 클까요?', ['분모가 작은 [3/8]', '분모가 큰 [3/10]'], 0),
                     ('[2 1/3]과 [1 5/6] 중 더 큰 분수는?', ['[2 1/3]', '[1 5/6]'], 0)])
    why(s, lv, '분모가 다른 두 분수의 크기를 비교할 때 통분하는 까닭을 써 보세요.', '‘분모가 다르면 ~라서 분자만 보고 비교할 수 없어요. 통분하면 ~’ 꼴로 써요.')
    step(s, 3, '약속하기', '분모가 다른 분수의 크기 비교')
    a4 = blanks(s, lv, CMP_RULE + [' 세 분수는 ', (['두 분수씩 짝 지어', '한꺼번에 더해서'], 0), ' 차례대로 비교해요.'])
    step(s, 4, '확인하기', '남은 과일 비교하기')
    if lv == '기본형':
        s.text(rd('([5/6], [7/9])는 18로, ([3/7], [4/9])는 63으로 통분해요. [2 3/8]과 [2 5/12]는 분수 부분을 24로 통분해요.'))
    a5 = cmp2(s, [('[5/6]', '[7/9]'), ('[3/7]', '[4/9]'), ('[2 3/8]', '[2 5/12]'), ('[6/9]', '[4/6]')])
    a5b = order_q(s, '남은 양이 많은 것부터 차례로 써 보세요.', [('[2/3]', '2/3'), ('[5/8]', '5/8'), ('[7/12]', '7/12')])
    ans = '6차시  ① %s, %s  ② %s, %s  ③ %s / 예) 분모가 다르면 한 칸의 크기가 달라서 분자만 보고 비교할 수 없어요. 통분하면 분자만 비교하면 돼요.  ④ %s  ⑤ %s, %s' % (
        pa, a1b[0], ' / '.join(pas), a2b, ', '.join(a3), ', '.join(a4), ' '.join(a5), a5b)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 수 카드와 □ 문제')
        s.text('수아가 수 카드 5, 7, 8을 한 번씩만 써서 분자가 1, 2, 3인 분수 3개를 만들어요. 만든 분수 중 가장 큰 분수를 찾아보세요.')
        cards_fig(s, ['5', '7', '8'])
        eq_fig(s, ['[1/□]      [2/□]      [3/□]'])
        s.ask('가장 큰 분수: (          )', blank=False)
        cnt = sum(1 for k in range(1, 18) if V('5/12') > Fraction(k, 18))
        assert cnt == 7
        s.ask(rd('[5/12] > [□/18]에서 □ 안에 들어갈 수 있는 자연수는 모두 몇 개인가요?'))
        s.ask('□의 개수를 구한 방법을 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ 만든 분수에 따라 답이 달라요 (예: 1/5, 2/7, 3/8 → 3/8 > 2/7 > 1/5), %d개 (36으로 통분하면 □ × 2가 15보다 작아야 하니 1~7)' % cnt
    return ans


def st7(s, lv):
    lessons_head(s, 7, '개념 구축하기(O)', '가격표의 무게를 비교해요 ― 분수와 소수', '분수와 소수로 쓴 가격표의 무게는 어떻게 비교할까요?',
                 '가격표 담당 수아가 바나나 한 송이에 [3/5] kg, 포도 한 송이에 0.7 kg이라고 썼어요.')
    step(s, 0, '만져 보기', '수직선에 무게 놓기')
    s.text(rd('두 무게를 수직선에 놓아 보고 어느 것이 더 무거운지 알아보세요.' + (' [3/5]의 분모와 분자에 2를 곱하면 [6/10]이에요.' if lv == '기본형' else '')))
    nl_fig(s, lv == '기본형')
    assert V('3/5') == V('0.6') < V('0.7')
    a1 = chain(s, ['[3/5] = [3×{2}/5×{2}] = [{6}/10] = {0.6}'])
    a1b = chooses(s, [('더 무거운 과일은?', ['바나나', '포도'], 1)])
    step(s, 1, '그려 보기', '100칸 모눈에 나타내기')
    s.text(rd('사과 한 봉지는 [7/20] kg, 배 한 개는 0.4 kg이에요. 모눈 한 칸을 [1/100] kg으로 보고, 두 무게만큼 색칠해 비교해 보세요.'))
    hund_fig(s, ['사과 [7/20] kg', '배 0.4 kg'])
    assert V('7/20') == V('0.35') < V('0.4')
    a2 = chain(s, ['[7/20] = [7×{5}/20×{5}] = [{35}/100] = {0.35}', '0.4 = [{40}/100]', '[7/20] ○ 0.4'])
    why(s, lv, '분수를 소수로 나타내려면 어떻게 하면 좋을까요?', '‘분모와 분자에 같은 수를 곱해서 분모를 ~으로 만든 다음 소수로 나타내요.’ 꼴로 써요.')
    step(s, 2, '말해 보기', '두 가지 방법')
    s.text(rd('채린이는 귤 한 봉지 [3/4] kg과 키위 한 봉지 0.8 kg을 비교하려고 해요. 두 가지 방법으로 비교해 보세요.'))
    assert V('3/4') == V('0.75') < V('0.8') == V('80/100')
    a3 = chain(s, [('분수를 소수로', '[3/4] = [3×{25}/4×{25}] = [{75}/100] = {0.75}'), ('소수를 분수로', '0.8 = [{8}/10] = [{80}/100]'), ('', '그래서 0.8 ○ [3/4]')])
    write_h(s, lv, '두 방법 중 나는 어느 방법이 더 편리한지 까닭과 함께 써 보세요.', '‘나는 ~를 ~로 나타내는 방법이 편리해요. 왜냐하면 ~’ 꼴로 써요.')
    step(s, 3, '약속하기', '분수와 소수의 크기 비교')
    a4 = blanks(s, lv, ['분수와 소수의 크기를 비교할 때에는 분수를 ', (['소수', '자연수'], 0), '로 나타내어 비교하거나, 소수를 ', (['분수', '자연수'], 0),
                        '로 나타내어 비교해요. 소수 두 자리 수는 분모가 ', (['100', '10', '1000'], 0), '인 분수로 나타낼 수 있어요.'])
    step(s, 4, '확인하기', '과일 상자 무게')
    if lv == '기본형':
        s.text(rd('[1/4] = [25/100] = 0.25, [13/20] = [65/100] = 0.65, [1 7/25] = [1 28/100] = 1.28이에요.'))
    a5 = cmp2(s, [('[1/4]', '0.3'), ('0.65', '[13/20]'), ('1.3', '[1 7/25]')])
    assert V('9/25') == V('0.36')
    a5b = qa(s, [('[9/25]를 소수로 나타내 보세요.', '0.36')])
    a5c = order_q(s, '과일 상자의 무게가 가 [4/5] kg, 나 0.78 kg, 다 [1 1/20] kg이에요. 무거운 것부터 차례로 기호를 써 보세요.',
                  [('가', '4/5'), ('나', '0.78'), ('다', '1 1/20')])
    ans = '7차시  ① %s, %s  ② %s / 예) 분모와 분자에 같은 수를 곱해 분모를 10이나 100으로 만든 다음 소수로 나타내요.  ③ %s / (자유)  ④ %s  ⑤ %s, %s, %s' % (
        a1, a1b[0], a2.replace('○', '<'), a3.replace('○', '>'), ', '.join(a4), ' '.join(a5), a5b[0], a5c)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 분모가 40인 기약분수')
        ks = [k for k in range(1, 40) if V('0.45') < Fraction(k, 40) < V('3/5') and gcd(k, 40) == 1]
        assert ks == [19, 21, 23]
        a6 = qa(s, [('0.45보다 크고 [3/5]보다 작은 분수 중에서 분모가 40인 기약분수는 모두 몇 개인가요?', len(ks), '개')])
        a6b = pick_eq_val(s, '그 기약분수를 모두 고르세요.', ['19/40', '20/40', '21/40', '23/40', '25/40'],
                          lambda o: V('0.45') < V(o) < V('3/5') and gcd(*nd(o)) == 1, [0, 2, 3])
        s.ask('어떻게 찾았는지 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s (0.45 = 18/40, 3/5 = 24/40 사이에서 약분되지 않는 분수)' % (a6[0], a6b)
    return ans


def st8(s, lv):
    lessons_head(s, 8, '개념 구축하기(O)', '배달 거리를 어림해요 ― [1/2]을 기준으로', '통분하지 않고도 분수의 크기를 비교할 수 있을까요?',
                 '과일 가게에서 이웃에 과일 바구니를 배달하기로 했어요. 학교에서 도서관까지는 [3/8] km, 경로당까지는 [4/7] km예요.')
    step(s, 0, '만져 보기', '막대로 견주기')
    s.text(rd('길이가 같은 막대에 [3/8], [1/2], [4/7]만큼 색칠하고 [1/2]과 견주어 보세요.'))
    blank_bars(s, [('도서관 [3/8]', 8), ('[1/2]', 2), ('경로당 [4/7]', 7)])
    assert V('3/8') < V('1/2') < V('4/7')
    a1 = chooses(s, [('도서관까지의 거리 [3/8] km는 [1/2] km보다', ['짧아요', '길어요'], 0), ('경로당까지의 거리 [4/7] km는 [1/2] km보다', ['길어요', '짧아요'], 0)])
    step(s, 1, '그려 보기', '[1/2]과 견주는 규칙')
    rule_first(s, lv, '통분하지 않고 어떤 분수가 [1/2]보다 큰지 작은지 알아보는 규칙을 예상해 보세요.', '‘내 규칙: 분자를 2배 한 수가 분모보다 ~면 [1/2]보다 ~.’ 꼴로 써요.')
    a2 = chain(s, ['[1/2] = [2/{4}] = [3/{6}] = [{5}/10]'])
    a2b = blanks(s, '기본형', ['[1/2]과 크기가 같은 분수는 분모가 분자의 ', (['2배', '3배', '절반'], 0), '예요.'])
    s.table([['분수', '분자 × 2', '분모', '[1/2]보다'], [rd('[3/8]'), '', '8', '( 작아요 / 커요 )'], [rd('[4/7]'), '', '7', '( 작아요 / 커요 )']], row_h=2300)
    a2c = '3/8: 6 < 8 작아요, 4/7: 8 > 7 커요'
    step(s, 2, '말해 보기', '배달 지도 만들기')
    places = [('도서관', '3/8'), ('경로당', '5/9'), ('우체국', '7/16'), ('공원', '7/12'), ('아파트', '6/13'), ('보건소', '11/20')]
    bins = ['[1/2] km보다 가까운 곳', '[1/2] km보다 먼 곳']
    a3 = sort_cards(s, [('%s [%s] km' % (p, f), 1 if V(f) > V('1/2') else 0) for p, f in places], bins)
    near = [p for (p, f), b in zip(places, a3) if b == bins[0]]
    far = [p for (p, f), b in zip(places, a3) if b == bins[1]]
    assert near == ['도서관', '우체국', '아파트']
    why(s, lv, '아파트까지 [6/13] km가 [1/2] km보다 가깝다는 것을 통분하지 않고 어떻게 알 수 있나요?', '‘분자를 2배 한 수 ~는 분모 ~보다 ~라서 [1/2] km보다 ~.’ 꼴로 써요.')
    step(s, 3, '약속하기', '[1/2]을 기준으로 비교하기')
    a4 = blanks(s, lv, ['분자를 2배 한 수가 분모보다 작으면 [1/2]보다 ', (['작고', '크고'], 0), ', 분자를 2배 한 수가 분모보다 크면 [1/2]보다 ', (['커요', '작아요'], 0),
                        '. 그래서 [1/2]을 ', (['기준으로', '분모로'], 0), ' 하면 통분하지 않고도 크기를 어림할 수 있어요.'])
    step(s, 4, '확인하기', '[1/2]을 기준으로 비교하기')
    a5 = cmp2(s, [('[4/9]', '[5/8]'), ('[7/12]', '[5/11]')])
    a5b = pick_eq_val(s, '[1/2]보다 큰 분수를 모두 고르세요.', ['5/9', '7/15', '9/17', '6/12'], lambda o: V(o) > V('1/2'), [0, 2])
    ans = '8차시  ① %s  ② %s, %s, %s / 예) 분자를 2배 한 수가 분모보다 작으면 1/2보다 작고, 크면 1/2보다 커요.  ③ 가까운 곳: %s / 먼 곳: %s / 예) 6을 2배 한 12는 분모 13보다 작아서 1/2 km보다 가까워요.  ④ %s  ⑤ %s, %s' % (
        ', '.join(a1), a2, a2b[0], a2c, ', '.join(near), ', '.join(far), ', '.join(a4), ' '.join(a5), a5b)
    if lv == '도전형':
        step(s, 5, '도전하기', '★ [1/2]을 기준으로 해결하기')
        a6 = cmp2(s, [('[8/15]', '[9/19]')])
        a6b = order_q(s, '학교에서 가 [5/11] km, 나 [7/13] km, 다 [1/2] km예요. 가까운 곳부터 차례로 기호를 써 보세요.',
                      [('가', '5/11'), ('나', '7/13'), ('다', '1/2')], desc=False)
        s.ask(rd('[8/15]와 [9/19]를 통분하지 않고 비교한 방법을 써 보세요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s / 예) 8/15는 16 > 15라서 1/2보다 크고, 9/19는 18 < 19라서 1/2보다 작아요.' % (a6[0], a6b)
    return ans


def st9(s, lv):
    lessons_head(s, 9, '탐구 정리하기(O)', '과일 가게 정산 회의', '약분과 통분을 어떻게 이용하면 가게 기록을 잘 정리할 수 있을까요?',
                 '채린이가 정산표를 정리해요. 귤 60개 중 45개가 팔려서 [45/60]로 적었어요.')
    step(s, 0, '만져 보기', '한 번에 약분하기')
    s.text(rd('이번에는 한 번만 나누어 바로 [45/60]를 기약분수로 나타내 보세요.' + (' 한 번에 기약분수로 만들려면 최대공약수로 나누어요.' if lv == '기본형' else '')))
    g = gcd(60, 45)
    assert g == 15
    a1 = qa(s, [('① 60과 45의 최대공약수는?', g)])
    a1b = chain(s, ['[45/60] = [45÷{15}/60÷{15}] = [{3}/{4}]'])
    step(s, 1, '그려 보기', '세 모둠 판매량 비교')
    s.text(rd('사과 파이는 [5/6]판, 블루베리 파이는 [7/9]판, 복숭아 파이는 [11/12]판이 팔렸어요. 두 분수씩 통분하여 비교해 보세요.'))
    rows, pas = zip(*[pairrow(a, b, D) for a, b, D in [('5/6', '7/9', 18), ('7/9', '11/12', 36), ('5/6', '11/12', 12)]])
    chain(s, list(rows))
    a2b = order_q(s, '많이 팔린 것부터 차례로 써 보세요.', [('[5/6]', '5/6'), ('[7/9]', '7/9'), ('[11/12]', '11/12')])
    step(s, 2, '말해 보기', '약분과 통분 정리')
    write_h(s, lv, '과일 가게를 준비하면서 약분이 편리했던 때를 써 보세요.', '‘○○을 □로 적으면 복잡했는데 ~로 약분하니 ~했어요.’ 꼴로 써요.')
    write_h(s, lv, '통분이 꼭 필요했던 때를 써 보세요.', '‘○○와 △△ 중 어느 것이 많은지 알려고 □로 통분하여 비교했어요.’ 꼴로 써요.')
    step(s, 3, '약속하기', '약분과 통분')
    a4 = blanks(s, lv, ['분모와 분자를 공약수로 나누어 간단하게 나타내는 것은 ', (['약분', '통분'], 0), '이고, 분모가 다른 분수의 분모를 같게 나타내는 것은 ', (['통분', '약분'], 0),
                        '이에요. 두 가지 모두 분모와 분자에 0이 아닌 같은 수를 곱하거나 나누어도 ', (['크기가 같다', '크기가 커진다'], 0), '는 성질을 이용해요.'])
    step(s, 4, '확인하기', '정산표 마무리')
    a5 = qa(s, [('① [24/40]를 기약분수로 나타내 보세요.', irr('24/40'))])
    s.text(rd('② [3/4]과 [5/6]를 두 분모의 최소공배수로 통분해 보세요.'))
    a5b = tong_grid(s, [('3/4', '5/6', lcm(4, 6))])
    a5c = cmp2(s, [('[5/8]', '0.6'), ('[3/7]', '[2/5]')])
    ans = '9차시  ① %s, %s  ② %s, %s  ③ (자유) 예) 12/18을 2/3로 약분하니 한눈에 알 수 있었어요 / 2/3컵과 3/4컵을 12로 통분하여 비교했어요.  ④ %s  ⑤ %s, %s, %s' % (
        a1[0], a1b, ' / '.join(pas), a2b, ', '.join(a4), a5[0], a5b[0], ' '.join(a5c))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 남은 주스')
        s.text(rd('크기가 같은 병 세 개에 주스가 가 [5/6] L, 나 [5/8] L, 다 [9/10] L 남았어요.'))
        vals = {'가': V('5/6'), '나': V('5/8'), '다': V('9/10')}
        mx, mn = max(vals, key=vals.get), min(vals, key=vals.get)
        assert (mx, mn) == ('다', '나')
        a6 = chooses(s, [('가장 많이 남은 병은?', ['가', '나', '다'], 2), ('가장 적게 남은 병은?', ['가', '나', '다'], 1)])
        a6b = pick_eq_val(s, '[3/8]보다 크고 [2/3]보다 작은 분수 중에서 분모가 24인 기약분수를 모두 고르세요.', ['10/24', '11/24', '13/24', '15/24', '17/24'],
                          lambda o: V('3/8') < V(o) < V('2/3') and gcd(*nd(o)) == 1, [1, 2])
        s.ask(rd('[5/6]와 [5/8]처럼 분자가 같은 두 분수는 통분하지 않고 어떻게 비교할 수 있는지 써 보세요.'), blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s, %s / 예) 분자가 같으면 분모가 작을수록 한 칸이 커서 더 큰 분수예요.' % (a6[0], a6[1], a6b)
    return ans


GAME_SEQ_ST = ['㉠ 조건에 해당하는 사람은 모두 손가락을 하나 접어요.', '㉡ 가위바위보로 순서를 정하고, 왼손을 들어 손가락을 모두 펼쳐요.',
               '㉢ 자기 차례가 되면 카드의 수와 크기를 비교하는 조건을 말해요.', '㉣ 카드가 없을 때까지 되풀이하고, 펼친 손가락이 많은 사람이 이겨요.',
               '㉤ 각자 카드를 한 장씩 가져와 수가 보이도록 놓아요.']


def st10(s, lv):
    lessons_head(s, 10, '발표하기(P)', '과일 가게 놀이 날 ― 손가락 접어!', '분수와 소수의 크기를 재빨리 비교할 수 있을까요?',
                 '과일 가게 놀이 날, 손님을 기다리는 동안 지우가 ‘손가락 접어!’ 놀이를 하자고 했어요.')
    step(s, 0, '놀이 방법 알기', '순서 정하기')
    a1 = seq_order(s, GAME_SEQ_ST, [1, 4, 2, 0, 3])
    step(s, 1, '카드 만들기', '내 카드')
    s.text('빈 카드 4장에 진분수 2장(분모는 2부터 9까지), 1보다 작은 소수 한 자리 수 1장, 1보다 작은 소수 두 자리 수 1장을 써요.')
    if lv == '기본형':
        s.text(rd('예: 진분수 [3/8], 소수 한 자리 수 0.6, 소수 두 자리 수 0.45'))
    cards_text(s, '내 카드', ['진분수', '진분수', '소수 한 자리 수', '소수 두 자리 수'])
    step(s, 2, '규칙 알기', '손가락을 접을까요?')
    if lv == '기본형':
        s.text(rd('[3/5] = [6/10] = 0.6이에요. [5/8] = 0.625예요.'))
    a3 = pick_eq_val(s, '도윤이가 “0.6보다 큰 수를 가지고 있는 사람 모두 손가락 하나 접어!”라고 했어요. 손가락을 접어야 하는 카드를 모두 고르세요.',
                     ['2/3', '3/5', '0.55', '5/8'], lambda o: V(o) > V('0.6'), [0, 3])
    others = ['0.45', '3/4', '0.7']
    big = sum(1 for o in others if V(o) > V('1/2'))
    assert big == 2
    a3b = chooses(s, [('수아가 [1/2] 카드를 가지고 있어요. 다른 사람 카드가 0.45, [3/4], 0.7일 때 수아가 말하면 좋은 조건은?',
                       ['“[1/2]보다 큰 수를 가진 사람 접어!”', '“[1/2]보다 작은 수를 가진 사람 접어!”'], 0),
                      ('조건을 말하는 사람은 어떻게 조건을 만들어야 할까요?', ['자신은 조건에 해당되지 않도록 만들어요', '자신도 손가락을 꼭 접도록 만들어요'], 0)])
    step(s, 3, '놀이하기', '손가락 접어!')
    game_record(s)
    step(s, 4, '이기는 비법 말하기')
    write_h(s, lv, '‘손가락 접어!’ 놀이에서 이기는 비법을 써 보세요.', '‘내 카드가 ~이면 ‘~보다 ~ 수’라고 말해요. 분수는 ~로 바꾸어 비교해요.’ 꼴로 써요.')
    ans = '10차시  ① %s  ② (자유)  ③ %s, %s  ④ (놀이 기록)  ⑤ 예) 내 카드가 작은 수이면 ‘내 수보다 큰 수’, 큰 수이면 ‘내 수보다 작은 수’라고 말해요. 분수는 소수로 바꾸어 비교해요.' % (
        a1, a3, ', '.join(a3b))
    if lv == '도전형':
        step(s, 5, '도전하기', '★ 또 다른 놀이 ― 통분 놀이')
        s.text('뒤집은 카드 2장의 두 분모의 최소공배수를 공통분모로 하여 통분하면 1점, 4점을 모으면 성공이에요. 아래 카드로 먼저 연습해요.')
        a6 = tong_game(s, lv, [('2/3', '3/4'), ('5/6', '4/9'), ('1/4', '5/6'), ('3/5', '7/8')])
        ans += '  ⑥ %s' % ' / '.join(a6)
    return ans


def st11(s, lv):
    lessons_head(s, 11, '발표하기(P)', '과일 가게 놀이를 마치고 발표해요', '과일 가게 놀이에서 배운 약분과 통분을 친구들에게 설명할 수 있나요?',
                 '과일 가게 놀이를 마치고 결산을 해요.')
    step(s, 0, '만져 보기', '가게 결산')
    a1 = qa(s, [('① 사과 파이 40조각 중 32조각이 팔렸어요. 팔린 양을 기약분수로 나타내 보세요.', irr('32/40'))])
    s.text(rd('② 크기가 같은 수박 두 통이 [3/8]통, [5/12]통 남았어요.  ③ 바나나 [4/5] kg과 사과 0.85 kg의 무게를 비교해요.'))
    a1b = cmp2(s, [('[3/8]', '[5/12]'), ('[4/5]', '0.85')])
    step(s, 1, '그려 보기', '발표 자료 만들기')
    s.text(rd('레몬 주스 [5/12] L와 라임 주스 [7/18] L를 두 가지 방법으로 통분하여 비교해 보세요.'))
    if lv == '기본형':
        s.text('두 분모의 곱: 12 × 18 = 216,  최소공배수: 36')
    r1, x1 = tongrow('5/12', '7/18', 12 * 18, '두 분모의 곱')
    r2, x2 = tongrow('5/12', '7/18', lcm(12, 18), '최소공배수')
    chain(s, r1 + r2 + [('', '그래서 [5/12] ○ [7/18]')])
    sg = SG('5/12', '7/18')
    step(s, 2, '말해 보기', '우리 가게 발표')
    write_h(s, lv, '약분을 가게의 어디에 썼는지 발표해 보세요.', '‘장부의 ○○을 □로 약분하여 △로 나타냈더니 ~했어요.’ 꼴로 써요.')
    write_h(s, lv, '통분을 가게의 어디에 썼는지 발표해 보세요.', '‘○○와 △△를 비교하려고 □를 공통분모로 하여 통분했어요.’ 꼴로 써요.')
    write_h(s, lv, '분수와 소수의 크기를 어떻게 비교했는지 발표해 보세요.', '‘○ kg을 소수(분수)로 나타내어 △ kg과 비교했어요.’ 꼴로 써요.')
    step(s, 3, '확인하기', '마무리 문제')
    a4 = pick_eq_val(s, '① [30/45]과 크기가 같은 분수를 모두 고르세요.', ['2/3', '6/9', '10/15', '3/5', '60/90'], same_as('30/45'), [0, 1, 2, 4])
    a4b = qa(s, [('② [7/12]과 [5/8]를 통분할 때 가장 작은 공통분모는?', lcm(12, 8))])
    a4c = chooses(s, [('③ [7/12]과 [5/8] 중 더 큰 분수는?', ['[7/12]', '[5/8]'], 1 if V('5/8') > V('7/12') else 0)])
    step(s, 4, '되돌아보기', '예전 생각, 지금 생각')
    panes(s, lv, [('예전 생각', '예전에는 ~라고 생각했어요', '예전에는 조각 수가 많으면 더 많이 먹은 거라고 생각했어요.'),
                  ('지금 생각', '지금은 ~라고 생각해요', '지금은 통분하여 분모를 같게 하면 분자만 비교하면 된다고 생각해요.'),
                  ('왜 바뀌었나', '~을 해 보고 바뀌었어요', '주스 막대를 12칸으로 나누어 [8/12]과 [9/12]로 비교해 보고 바뀌었어요.')])
    ans = '11차시  ① %s, %s  ② %s, %s, 5/12 %s 7/18  ③ (자유)  ④ %s, %s, %s  ⑤ (자유)' % (
        a1[0], ' '.join(a1b), x1, x2, sg, a4, a4b[0], a4c[0])
    if lv == '도전형':
        step(s, 5, '도전하기', '★★ 단원 마무리')
        assert V('18/42') == V('3/7') and 42 == 7 * 6
        ks = [k for k in range(1, 40) if V('0.4') < Fraction(k, 40) < V('5/8') and gcd(k, 40) == 1]
        assert ks == [17, 19, 21, 23]
        a6 = qa(s, [('① 어떤 분수의 분모와 분자를 6으로 나누어 약분하였더니 [3/7]이 되었어요. 처음 분수는?', '18/42'),
                    ('② 0.4보다 크고 [5/8]보다 작은 분수 중에서 분모가 40인 기약분수는 모두 몇 개인가요?', len(ks), '개')])
        s.ask('②를 어떻게 해결했는지 써 보세요.', blank=False)
        s.lines(2)
        ans += '  ⑥ %s, %s (17/40, 19/40, 21/40, 23/40)' % (a6[0], a6[1])
    return ans


TB = [tb1, tb2, tb3, tb4, tb5, tb6, tb7, tb8, tb9, tb10]
ST = [st1, st2, st3, st4, st5, st6, st7, st8, st9, st10, st11]


def build(funcs, label, short, outdir, lv):
    s = Sheet(unit_label=label, level=lv, grade_label='5학년')
    lines = [f(s, lv) for f in funcs]
    s.answers('【교사용】 4. 약분과 통분(%s) 활동지 정답 (%s)' % (short, lv), lines,
              note='※ 이 활동지는 앱 u4-reduce.html과 차시 번호가 같습니다.')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    out = []
    try:
        for lv in ('기본형', '도전형'):
            out.append(build(TB, '5-1 수학 4. 약분과 통분(교과서 차시)', '교과서 차시', OUT_TB, lv))
            out.append(build(ST, '5-1 수학 4. 약분과 통분(이야기 버전)', '이야기 버전', OUT_ST, lv))
    finally:
        SHOT.close()
        shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob = check(p)
        bad += bool(prob)
        print(p, 'OK' if not prob else '\n  ' + '\n  '.join(prob))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
