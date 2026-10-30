# -*- coding: utf-8 -*-
"""6-2 수학 1. 분수의 나눗셈 활동지(교과서 차시 버전[·이야기 버전] × 기본형·도전형) 만들기

    python3 gen_u1-fracdiv.py            # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u1-fracdiv.py tb         # 교과서 차시 버전만

앱 원본 ../units/sem2/u1-fracdiv.tb.js('남극 과학 기지 분수의 나눗셈', 10차시: 1·2·3·4·5·6·7·8~9·10·11)의
LESSONS를 node에서 그대로 실행해(활동 함수 대신 기록하는 함수를 넣어 render를 부름) 활동마다 넘긴 설정
(물음·보기·정답·식·빈칸·띠와 수직선의 수·수 카드)을 모읍니다(CAP_JS). 그래서 차시 번호·제목·S.O.O.P.·탐구 질문·
이야기·수가 앱과 같고, 원본의 수가 바뀌면 활동지도 저절로 따라 바뀝니다. 정답은 모두 이 스크립트가
분수(Fraction)로 다시 계산해 앱의 답과 같은지 assert로 확인합니다.

이야기 버전 ../units/sem2/u1-fracdiv.st.js('6학년 2반 숲속 수련회', 11차시)도 같은 방법으로 읽어 sem2-soop/sheets/에
만듭니다(CAP_JS에 이야기 엔진 부품 panes·thenWhy·ruleFirst·wonderRecall·writeStep과 수련회 그림·쪽지·놀이 활동지 표를 더 기록 —
_ST_REPL). 차시 목록은 ST_IDS, 도전형 '왜' 쓰기는 WHY_ST.
    python3 gen_u1-fracdiv.py st         # 이야기 버전만

분수 표기(5-2 「분수의 곱셈」 활동지 gen_u2-fracmul.py의 방법을 그대로 옮김)
  - 계산 식·빈칸은 그림(PNG)으로 넣어 분수를 위아래(분자/분모)로 씁니다. 빈칸은 네모, 답 칸은 큰 네모.
  - 글 속 분수는 읽는 말로 씁니다: [3/7] → '7분의 3', [2 1/4] → '2와 4분의 1'.
  - 교사용 정답 쪽은 '3/7', '2 1/4'(= 2와 4분의 1)로 씁니다.
그림(덜어 내기 띠, 원, 이중 척도 모델, 잇기, 남극 기지)은 수에 맞는 비율로 SVG를 그려 임시 폴더에서 PNG로 바꿉니다.
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

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade6/math
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '1단원_분수의나눗셈_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧'
WORK = tempfile.mkdtemp(prefix='u1fdiv_')
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


# ================================================================ 6-2 분수의 나눗셈: 앱 원본 읽기
UNITS = os.path.join(ROOT, '_build', 'units', 'sem2')
SRC_TB = os.path.join(UNITS, 'u1-fracdiv.tb.js')
SRC_ST = os.path.join(UNITS, 'u1-fracdiv.st.js')
UNIT_NAME = '1. 분수의 나눗셈'


def _sym(t):
    return not re.fullmatch(r'\d+', t)


_rd0 = rd


def rd(t):
    """[■/●]·[□/13] 같은 기호 분수도 다룸: [□/13] → '13분의 □', [■/●] → '■/●'"""
    def sym(m):
        w, n, d = m.group(1), m.group(2), m.group(3)
        if w is None and _sym(n) and not _sym(d) and n in ('□', '~'):
            return '%s분의 %s' % (d, n)
        if w is None and (_sym(n) or _sym(d)) and not re.search(r'\d', n + d):
            return '%s/%s' % (n, d)
        return m.group(0)
    t = re.sub(r'\[(?:(\d+) )?([^\[\]/ ]+)/([^\[\]]+)\]', sym, str(t))
    return _rd0(t)


CAP_JS = r"""
const fs = require('fs');
const INK = '#1D2A2A';
const FONT = process.argv[3];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = Object.assign({}, a || {}); this.kids = []; this.textContent = ''; this.style = {}; }
  append(...k) { for (const x of k.flat(9)) if (x != null && x !== false && x !== '') this.kids.push(x); }
  appendChild(x) { this.kids.push(x); return x; }
  setAttribute(k, v) { this.a[k] = v; }
  addEventListener() {}
  set innerHTML(v) { this.kids = []; }
  text() { return this.textContent + this.kids.map(k => typeof k === 'string' ? k : k.text()).join(''); }
  toString() {
    const a = Object.assign({}, this.a);
    if (this.tag === 'svg') { a.xmlns = 'http://www.w3.org/2000/svg'; delete a.class; }
    const at = Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this.textContent)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const plain = a && !(a instanceof El) && typeof a === 'object' && !Array.isArray(a); const e = new El(t, plain ? a : {}); if (!plain && a != null) e.append(a); e.append(...k); return e; };
function makeSvg(w, hh) { return svgEl('svg', { viewBox: `0 0 ${w} ${hh}` }); }
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: '#1D2A2A' }, attrs)); e.textContent = t; return e; }
const find = (e, tag) => { if (!e || typeof e !== 'object') return null; if (e.tag === tag) return e; for (const k of e.kids || []) { const r = find(k, tag); if (r) return r; } return null; };
function fd6Style() {} function fd6Style2() {} function fd6Style3() {}
const all = fs.readFileSync(process.argv[2], 'utf8');
const fnSrc = name => { const i = all.indexOf('function ' + name + '('); if (i < 0) return ''; const j = all.indexOf('\n}\n', i); return all.slice(i, j + 3); };
eval(fnSrc('fd6Scene').replace('function fd6Scene', 'var fd6SceneReal = function'));
eval(fnSrc('fd6Sheets').replace('function fd6Sheets', 'var fd6SheetsReal = function'));
var REC = [];
const rec = w => function (b, a, ...args) { REC.push({ w, args }); };
var quiz = rec('quiz'), blanks = rec('blanks'), sequence = rec('sequence'), writeStep = rec('writeStep'), panes = rec('panes');
var fd6Calc = rec('fd6Calc'), fd6Chain = rec('fd6Chain'), fd6Scoop = rec('fd6Scoop'), fd6Pie = rec('fd6Pie'), fd6Double = rec('fd6Double'),
  fd6Flip = rec('fd6Flip'), fd6Build = rec('fd6Build'), fd6Pose = rec('fd6Pose'), fd6Game = rec('fd6Game'), fd6Dice = rec('fd6Dice'),
  fd6Match = rec('fd6Match'), fd6Sort = rec('fd6Sort'), fd6Bars = rec('fd6Bars');
function fd6Scene() {} function fd6Sheets() {}
const api = { provide() {}, hint() {}, done() {}, fail() {}, tryOnce() {} };
const ls = all.slice(all.indexOf('//@@LESSONS'));
eval(ls.replace(/^(const|let) /gm, 'var '));
const run = S => { REC = []; try { S.render(new El('div'), api); } catch (e) { REC.push({ w: 'error', args: [String(e && e.message || e)] }); } return REC; };
const out = { story: typeof UNIT_STORY !== 'undefined' ? UNIT_STORY : null, lessons: LESSONS.map(L => ({
  id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(S => ({ name: S.name, inst: S.inst, hints: S.hints || [], calls: run(S) })),
  ch: L.challenge ? { inst: L.challenge.inst, hints: L.challenge.hints || [], calls: run(L.challenge) } : null })) };
const sc = fd6SceneReal && fd6SceneReal(); out.scene = sc ? String(find(sc, 'svg')) : null;
const sh = fd6SheetsReal && fd6SheetsReal();
if (sh) { const t = find(sh, 'table'), p = find(sh, 'p');
  out.sheets = { cap: p ? p.text() : '', rows: t.kids.filter(k => k.tag === 'tr').map(tr => tr.kids.map(c => c.text())) }; }
process.stdout.write(JSON.stringify(out, (k, v) => typeof v === 'function' ? { fn: v.name || 'fn' } : (v instanceof El ? null : v)));
"""

_CAP = {}


def cap(src):
    if src not in _CAP:
        js = os.path.join(WORK, 'cap.js')
        with open(js, 'w', encoding='utf-8') as f:
            f.write(_cap_st_js() if src == SRC_ST else CAP_JS)
        r = subprocess.run(['node', js, src, FONT.replace("'", '')], capture_output=True, text=True)
        if r.returncode:
            raise RuntimeError('앱 원본을 읽지 못했어요: ' + r.stderr[-800:])
        _CAP[src] = json.loads(r.stdout)
    return _CAP[src]


# ================================================================ 종이에 맞게 글 고치기
PAPER_RULES = [
    (r'띠를 눌러 ', '띠에서 '),
    (r'그림을 눌러 나누어 주고, ', '그림에 한 사람 몫씩 색을 바꾸어 칠하고, '),
    (r'(아래 )?수직선의 표시를 (.+?)(?:으로|로) 차례로 옮겨 보세요', r'아래 그림에서 \2일 때의 양을 차례로 구해 보세요'),
    (r'표시를 (.+?)(?:으로|로) 옮겨 본 다음 ', r'\1일 때의 값을 그림에 써 본 다음 '),
    (r'표시를 차례로 옮겨 ', ''),
    (r'차례대로 눌러 보세요', '차례대로 늘어놓아 보세요'),
    (r'이 앱이 정한', '앱에서 정한'),
]
INTERACT = re.compile(r'눌러|누르|누를|끌어|표시를.*옮겨|드래그')


def paper(t):
    t = str(t or '')
    for a, b in PAPER_RULES:
        t = re.sub(a, b, t)
    sents = re.split(r'(?<=[.?!)])\s+', t)
    return ' '.join(x for x in sents if x and not INTERACT.search(x)).strip()


# ================================================================ 앱 부품 → 활동지
def c_or(v):
    return v if isinstance(v, list) else [v]


def num_text(v):
    """'2×3' · '4÷2' → 값(정수면 정수)"""
    x = eval(str(v).replace('−', '-').replace('×', '*').replace('÷', '/'), {'__builtins__': {}}, {}) if re.search(r'[×÷+−-]', str(v)) else Fraction(int(v))
    x = Fraction(x).limit_denominator(10 ** 6)
    return str(x.numerator) if x.denominator == 1 else str(x)


def _cell(v):
    """{q:[W,N,D]} 한 자리 → (보이는 글, 채운 글, 빈칸 답 목록)"""
    if v is None:
        return '', '', []
    if isinstance(v, list):
        parts = [_cell(x) for x in v]
        return ''.join(p[0] for p in parts), ''.join(p[1] for p in parts), [a for p in parts for a in p[2]]
    v = str(v)
    if v.startswith('?'):
        return '{%s}' % v[1:], v[1:], [v[1:]]
    return v, v, []


def row_parts(row):
    """앱 fd6Chain 한 줄 → dict(tag, disp, full, ans, boxes)"""
    parts = row if isinstance(row, list) else row['p']
    tag = None if isinstance(row, list) else row.get('t')
    disp, full, ans, boxes, txtonly = '', '', [], 0, True
    for p in parts:
        if isinstance(p, (str, int, float)):
            disp += str(p)
            full += str(p)
        elif 'i' in p:
            disp += '{%s}' % p['i']
            full += str(p['i'])
            ans.append(str(p['i']))
            boxes += 1
        elif 'q' in p:
            W, N, D = p['q']
            w, n, d = _cell(W), _cell(N), _cell(D)
            disp += '[%s%s/%s]' % (w[0] + ' ' if W is not None else '', n[0], d[0])
            fw = num_text(w[1]) if W is not None else None
            fn, fdn = num_text(n[1]), num_text(d[1])
            full += '[%s%s/%s]' % (fw + ' ' if fw else '', fn, fdn)
            simple = all(not isinstance(x, list) for x in (W, N, D))
            if simple:
                ans.append(('%s ' % w[1] if W is not None else '') + '%s/%s' % (n[1], d[1]))
            else:
                ans += w[2] + n[2] + d[2]
            boxes += 1
        elif 'f' in p:
            disp += '▢'
            full += '[%s]' % p['f'] if '/' in str(p['f']) else str(p['f'])
            ans.append(str(p['f']))
            boxes += 1
        elif 'c' in p:
            o, a = p['c'], p['a']
            disp += '( %s )' % ' / '.join(o)
            full += o[a]
            ans.append(flat(o[a]))
        else:
            raise ValueError('모르는 칸: %r' % (p,))
    return {'tag': tag, 'disp': disp, 'full': full, 'ans': ans, 'eq': boxes > 0}


def check_full(full):
    """한글이 없는 '=' 식은 값이 모두 같은지 확인(앞의 한글 설명·뒤의 단위 괄호는 떼어 냄)"""
    t = re.sub(r'\s*\([^)]*[A-Za-z가-힣][^)]*\)\s*$', '', full)
    m = re.search(r'^.*[가-힣“”?:]\s*', t)
    tail = t[m.end():] if m else t
    if '=' not in tail or re.search(r'[가-힣□■●▲♥]', tail) or tail.strip().startswith('='):
        return
    vals = [ev(x) for x in tail.split('=') if x.strip()]
    assert all(v == vals[0] for v in vals), ('식 확인 필요', full)


WMAX = 1130


def wrap_eq(disp):
    """긴 줄을 '. '·' = '에서 나눠 여러 줄로"""
    if eq_w(disp, 34) <= WMAX:
        return [disp]
    pieces = re.split(r'(?<=\. )', disp)
    if len(pieces) > 1:
        out, cur = [], ''
        for pc in pieces:
            if cur and eq_w(cur + pc, 34) > WMAX:
                out.append(cur.rstrip())
                cur = pc
            else:
                cur += pc
        out.append(cur.rstrip())
        return [y for x in out for y in wrap_eq(x)] if len(out) > 1 else out
    eqs = disp.split(' = ')
    if len(eqs) > 2:
        out, cur = [], eqs[0]
        for pc in eqs[1:]:
            if eq_w(cur + ' = ' + pc, 34) > WMAX and cur:
                out.append(cur)
                cur = '= ' + pc
            else:
                cur += ' = ' + pc
        out.append(cur)
        return out
    return [disp]


def render_rows(s, rows):
    """앱 fd6Chain 줄들: 빈칸이 있는 줄은 식 그림, 글과 고르기만 있는 줄은 테두리 문장. 정답 글."""
    pend_eq, pend_txt, ans = [], [], []

    def flush():
        if pend_eq:
            eq_fig(s, list(pend_eq))
            pend_eq.clear()
        if pend_txt:
            s.fill(list(pend_txt))
            pend_txt.clear()
    for row in rows:
        r = row_parts(row)
        check_full(r['full'])
        if r['eq']:
            if pend_txt:
                flush()
            lines = wrap_eq(r['disp'])
            for i, ln in enumerate(lines):
                tag = r['tag'] if i == 0 else ('' if r['tag'] or ln.startswith('= ') else None)
                pend_eq.append((tag, ln) if tag is not None else ln)
        else:
            if pend_eq:
                flush()
            t = r['disp']
            t = re.sub(r'\( ([^()]*?) \)', lambda m: opt_text(m.group(1).split(' / ')), t) if '( ' in t else t
            pend_txt.append(('[%s] ' % r['tag'] if r['tag'] else '') + rd(t))
        ans.append(', '.join(r['ans']))
    flush()
    return ' / '.join(a for a in ans if a)


def opt_text(opts):
    return '( ' + ' / '.join(rd(o) for o in opts) + ' )'


def value_of(it):
    return Fraction(it['n']) if it.get('n') is not None else F(it['a'])


def calc_items(s, lv, items):
    """앱 fd6Calc: 식 계산 · 문장제 · 보기 고르기. 모든 답을 분수로 다시 계산해 확인. 정답 글 목록."""
    out, grid, k = [], [], [0]

    def flush():
        if grid:
            cols = 2 if max(eq_w(c, 34) for c in grid) < 1100 / 2 - 30 else 1
            grid_fig(s, list(grid), cols)
            grid.clear()
    for it in items:
        no = NUM[k[0]]
        k[0] += 1
        if it.get('pick'):
            flush()
            o, a = it['pick'], it['a']
            pre = all(re.match(r'[㉠-㉦]', x) for x in o)
            if not any('[' in x for x in o) and not pre and max(len(x) for x in o) <= 16:
                s.choices([('%s %s' % (no, rd(it['q'])), opt_text(o))])
                out.append(flat(o[a]))
                continue
            s.ask('%s %s' % (no, rd(it.get('q') or '알맞은 것을 골라 보세요.')), blank=False)
            cells = [x if pre else '%s %s' % (KO[i], x) for i, x in enumerate(o)]
            if any('[' in x for x in o):
                eq_fig(s, cells, indent=30)
            else:
                s.fill([rd(c) for c in cells])
            s.ask('답: (        )', blank=False)
            out.append(cells[a].split(' ')[0] if pre else '%s %s' % (KO[a], flat(o[a])))
            continue
        v = value_of(it)
        ex = it.get('x') or it.get('e')
        if ex and not it.get('noEval'):
            assert ev(ex) == v, ('답 확인 필요', ex, v)
        ut = unit_txt(it)
        out.append(bk(v) + ut)
        if it.get('q') or not it.get('e'):
            flush()
            if it.get('q'):
                s.ask('%s %s' % (no, rd(it['q'])), blank=False)
            lab = it.get('lab') or ''
            if not it.get('q'):
                lab = '%s %s' % (no, lab)
            if it.get('e'):
                eq_fig(s, ['%s = ▢%s' % (it['e'], ut)], indent=30)
            elif re.search(r'[×÷]', lab):
                if lv == '도전형':
                    eq_fig(s, ['식: ' + '_' * 16 + '    답: ▢%s' % ut], indent=30)
                else:
                    eq_fig(s, ['%s ▢%s' % (lab.rstrip(), ut)], indent=30)
            else:
                eq_fig(s, ['%s%s ▢%s' % (lab or '답', '' if lab.endswith('=') else ':', ut)], indent=30)
        else:
            grid.append('%s %s = ▢%s' % (no, it['e'], ut))
    flush()
    return out


# ---------------------------------------------------------------- 그림
def frac_lab(x):
    """앱 fd6Lbl: 자연수 / [진분수] / [대분수]"""
    x = Fraction(x)
    if x.denominator == 1:
        return str(x.numerator)
    return '[%s]' % mixed(x)


def written_den(t):
    return den_of(t) if '/' in str(t) else 1


def scoop_fig(s, lv, o):
    """앱 fd6Scoop: 위 띠 = 나누는 수, 아래 띠 = 나누어지는 수(1마다 점선 틀). 기본형은 칸을 공통분모로 나누어 두고
    첫 묶음을 색칠해 둠. 도전형은 처음 분모 그대로(학생이 나눔)."""
    A, B = F(o['A']), F(o['B'])
    dA, dB = written_den(o['A']), written_den(o['B'])
    cd = o.get('cd') or dA * dB // gcd(dA, dB)
    nT, g = A * cd, B * cd
    assert nT.denominator == 1 and g.denominator == 1
    nT, g = int(nT), int(g)
    full, rem = divmod(nT, g)
    U = max(1, math.ceil(A), math.ceil(B))
    cA, cB = (cd, cd) if lv == '기본형' else (dA, dB)
    unit = o.get('unit', '')
    names = [o.get('bName') or '[%s]' % o['B'], o.get('aName') or '[%s]' % o['A']]
    fs = 26
    lab_w = max(max(eq_w(n, fs) for n in names), tw('나누어지는 수', 19)) + 30
    LX, BW = 14 + lab_w, 760
    uw = BW / U
    out = []

    def bar(y, cells, den, fill, name, sub):
        for u in range(U):
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="54" fill="#fff" stroke="#B9C4C0" stroke-width="2" stroke-dasharray="6 5"/>'
                       % (LX + u * uw, y, uw))
        cw_ = uw / den
        for c in range(cells):
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="54" fill="%s" stroke="%s" stroke-width="%s"/>'
                       % (LX + c * cw_, y, cw_, fill(c), INK, 1.4 if cells > 30 else 2))
        out.append('<rect x="%.1f" y="%d" width="%.1f" height="54" fill="none" stroke="%s" stroke-width="4"/>' % (LX, y, cells * cw_, INK))
        eq_line(name, LX - 14 - eq_w(name, fs), y + 27, fs, out)
        out.append(T(LX - 14, y + 72, sub, 19, anchor='end', fill='#5B6B6B'))
    nB, nA = B * cB, A * cA
    assert nB.denominator == 1 and nA.denominator == 1
    bar(20, int(nB), cB, lambda c: '#9CC6EC', names[0], '나누는 수')
    pre = lv == '기본형' and full >= 1
    bar(134, int(nA), cA, lambda c: FILLS[0] if pre and c < g else '#FBE6CC', names[1], '나누어지는 수')
    cw_ = uw / cA
    if pre:
        out.append(T(LX + g * cw_ / 2, 161, '1', 24, anchor='middle', weight='bold'))
    if lv == '기본형' and full == 0:
        out.append('<rect x="%.1f" y="128" width="%.1f" height="66" fill="none" stroke="#C8472E" stroke-width="3" stroke-dasharray="9 6"/>'
                   % (LX, g * cw_))
    yl = 246
    out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (LX, yl, LX + BW, yl, INK))
    for u in range(U + 1):
        x = LX + u * uw
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (x, yl - 9, x, yl + 9, INK))
        out.append(T(x, yl + 26, '%d%s' % (u, unit if u == U else ''), 20, anchor='middle', fill='#444'))
    W, H = int(LX + BW + 30), 286
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)
    return full, rem, g, cd


def pie_fig(s, lv, o):
    A, B = F(o['A']), F(o['B'])
    d = A.denominator * B.denominator // gcd(A.denominator, B.denominator)
    nT, g = int(A * d), int(B * d)
    full, rem = divmod(nT, g)
    cx, cy, R = 200, 190, 160
    out = []
    for i in range(d):
        a0 = -math.pi / 2 + i * 2 * math.pi / d
        a1 = a0 + 2 * math.pi / d
        pre = lv == '기본형' and i < g and full >= 1
        f = '#F4F1EA' if i >= nT else (FILLS[0] if pre else '#E9C79C')
        out.append('<path d="M%.1f %.1f L%.1f %.1f A%d %d 0 0 1 %.1f %.1f Z" fill="%s" stroke="%s" stroke-width="3"/>'
                   % (cx, cy, cx + R * math.cos(a0), cy + R * math.sin(a0), R, R, cx + R * math.cos(a1), cy + R * math.sin(a1), f, INK))
        if pre:
            am = (a0 + a1) / 2
            out.append(T(cx + R * .62 * math.cos(am), cy + R * .62 * math.sin(am), '1', 26, anchor='middle', weight='bold'))
    nm = o.get('aName') or '[%s]' % o['A']
    eq_line(nm, 410, 120, 30, out)
    eq_line('한 %s: [%s]' % (o.get('one') or o.get('word') or '묶음', o['B']), 410, 220, 30, out)
    W = int(420 + max(eq_w(nm, 30), eq_w('한 사람: [%s]' % o['B'], 30)) + 30)
    put_png(s, svg_doc(W, 380, ''.join(out)), W, 380, max_mm=120)
    return full, rem, g


def double_fig(s, lv, it):
    """앱 fd6Double: 위는 양, 아래는 수직선(0~1을 b칸). 아래 a/b일 때 위 Q. [1/b]과 1일 때의 양을 빈칸으로."""
    a, b = int(it['a']), int(it['b'])
    Q = F(it['Q'])
    seg = Q / a
    one = seg * b
    LX, BW, YT, YB = 120, 720, 92, 236
    st = BW / b
    out = []
    if it.get('name'):
        eq_line(it['name'], 16, 26, 24, out)
    top, bot = it.get('top', ''), it.get('bot', '')
    for i in range(b):
        out.append('<rect x="%.1f" y="%d" width="%.1f" height="52" fill="%s" stroke="%s" stroke-width="2.4"/>'
                   % (LX + i * st, YT, st, '#F6C08A' if i < a else '#fff', INK))
    out.append('<rect x="%d" y="%d" width="%d" height="52" fill="none" stroke="%s" stroke-width="4"/>' % (LX, YT, BW, INK))

    def top_lab(j, t, col):
        x = LX + j * st
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (x, YT - 8, x, YT + 60, col))
        eq_line(t, x - eq_w(t, 24) / 2, YT - 30, 24, out)
    top_lab(a, '%s%s' % (frac_lab(Q), top), INK)
    top_lab(1, '{}' + top, '#C8472E')
    top_lab(b, '{}' + top, '#2E8B57')
    out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3"/>' % (LX - 10, YB, LX + BW + 14, YB, INK))
    for j in range(b + 1):
        x = LX + j * st
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (x, YB - 12, x, YB + 12, INK))
        lab = '0' if j == 0 else ('1' if j == b else '[%d/%d]' % (j, b))
        eq_line(lab, x - eq_w(lab, 24) / 2, YB + 44, 24, out)
    out.append('<path d="M%.1f %d l-11 -18 l22 0 z" fill="#E47A38"/>' % (LX + a * st, YB - 14))
    if bot.strip():
        out.append(T(LX + BW + 18, YB + 44, '(%s)' % bot.strip(), 22, anchor='start', fill='#555'))
    H = YB + 80
    if lv == '기본형':
        def arc(j1, j2, depth, t, col):
            x1, x2 = LX + j1 * st, LX + j2 * st
            yb = YB + 74
            out.append('<path d="M%.1f %d Q%.1f %d %.1f %d" fill="none" stroke="%s" stroke-width="3"/>' % (x1, yb, (x1 + x2) / 2, yb + depth, x2, yb, col))
            out.append(T((x1 + x2) / 2, yb + depth * .5 + 24, t, 24, anchor='middle', fill=col, weight='bold'))
        arc(a, 1, 44, '÷%d' % a, '#C8472E')
        arc(1, b, 80, '×%d' % b, '#2E8B57')
        H = YB + 170
    W = int(LX + BW + 110)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)
    return seg, one


def match_fig(s, left, right):
    fs = 32
    rows = max(len(left), len(right))
    lw = max(eq_w(t, fs) for t in left) + 40
    rw = max(eq_w(t, fs) for t in right) + 40
    x1, x2 = 30 + lw, 30 + lw + 260
    out = []
    for i, t in enumerate(left):
        cy = 50 + i * 100
        eq_line(t, x1 - 26 - eq_w(t, fs), cy, fs, out)
        out.append('<circle cx="%.1f" cy="%d" r="8" fill="%s"/>' % (x1, cy, INK))
    for j, t in enumerate(right):
        cy = 50 + j * 100
        out.append('<circle cx="%.1f" cy="%d" r="8" fill="%s"/>' % (x2, cy, INK))
        eq_line(t, x2 + 26, cy, fs, out)
    W, H = int(x2 + rw + 20), 100 * rows
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=130)


def scene_pic(s, svg):
    s.picture(SHOT.png(svg, 1800), width_mm=150)


# ---------------------------------------------------------------- 활동(앱 부품)마다
def w_quiz(s, lv, items, opts=None, *_):
    ans = []
    for k, it in enumerate(items):
        fig = (it.get('fig') or {}).get('fn')
        if fig == 'fd6Scene' and DATA.get('scene'):
            scene_pic(s, DATA['scene'])
        elif fig in ('fd6Sheets', 'fd6sSheet') and DATA.get('sheets'):
            sh = DATA['sheets']
            if sh['cap']:
                s.text(rd(sh['cap']))
            ncol = len(sh['rows'][0])
            s.table([[rd(c) if not re.search(r'\[\d', c) else flat(c) for c in r] for r in sh['rows']],
                    col_mm=[18, 40, 30, 92] if ncol == 4 else [180 // ncol] * ncol)
        q = ('%d. ' % (k + 1) if len(items) > 1 else '') + rd(it['q'])
        o, a = it['o'], it['a']
        many = isinstance(a, list)
        if many or max(len(rd(x)) for x in o) > 16:
            s.ask(q, blank=False)
            s.fill(['%s %s' % (KO[i], rd(x)) for i, x in enumerate(o)])
            s.ask('알맞은 것%s' % ('을 모두 골라 기호를 써 보세요.' if many else '의 기호를 써 보세요.'), answer_space=12)
            ans.append(', '.join(KO[i] for i in c_or(a)))
        else:
            s.choices([(q, opt_text(o))])
            ans.append(flat(o[a]))
    return ', '.join(ans)


def w_blanks(s, lv, parts, opts=None, *_):
    conv = [p if isinstance(p, str) else (p['o'], p['a']) for p in parts]
    return ', '.join(blanks(s, lv, conv))


def w_sequence(s, lv, items, order, opts=None, *_):
    s.fill(['%s %s' % (KO[i], rd(t)) for i, t in enumerate(items)])
    s.ask('차례대로 기호를 써 보세요.   ' + ' → '.join(['(      )'] * len(items)), blank=False)
    return ' → '.join(KO[i] for i in order)


def w_chain(s, lv, rows, opt=None, *_):
    return render_rows(s, rows)


def w_calc(s, lv, items, opt=None, *_):
    return ', '.join(calc_items(s, lv, items))


def ask_part(s, lv, o):
    if o.get('ask'):
        return render_rows(s, o['ask'])
    if o.get('askCalc'):
        return ', '.join(calc_items(s, lv, o['askCalc']))
    return ''


def w_scoop(s, lv, o, *_):
    full, rem, g, cd = scoop_fig(s, lv, o)
    dA, dB = written_den(o['A']), written_den(o['B'])
    if dA != cd or dB != cd:
        s.text(rd('두 띠의 한 칸이 모두 [1/%d]이 되도록 칸을 나누어 두었어요.' % cd) if lv == '기본형'
               else rd('먼저 두 띠의 한 칸이 모두 [1/%d]이 되도록 선을 그어 칸을 똑같이 나누어 보세요.' % cd))
    s.text('아래 띠(나누어지는 수)에서 위 띠(나누는 수)만큼씩 묶어 색을 바꾸어 칠하고 번호를 써 보세요.'
           + (' 첫 묶음은 칠해 두었어요.' if lv == '기본형' and full >= 1 else '')
           + (' 남는 칸은 한 묶음의 얼마만큼인지 살펴보세요.' if rem else ''))
    a = ask_part(s, lv, o)
    k = '%d번' % full + (' + 한 묶음의 %d/%d' % (rem, g) if rem else '')
    return '(덜어 내기 %s) %s' % (k, a) if a else '덜어 내기 %s' % k


def w_pie(s, lv, o, *_):
    full, rem, g = pie_fig(s, lv, o)
    s.text(rd('원에서 [%s]만큼씩 색을 바꾸어 칠하고 번호를 써 보세요.' % o['B']) + (' 첫 몫은 칠해 두었어요.' if lv == '기본형' else ''))
    return '(%d%s) %s' % (full, o.get('cnt') or '묶음', ask_part(s, lv, o))


def at_bot(bot, x):
    """아래 수직선 단위에 맞는 말: '[1/3]시간', '[1/6] m' / 단위가 아닌 말(수조)은 '수조의 [1/3]', '수조 1개'"""
    if bot.startswith(' ') or bot in ('시간', '원') or not re.search(r'[가-힣]', bot):
        return x + bot
    return ('%s 1개' % bot) if x == '1' else '%s의 %s' % (bot, x)


def w_double(s, lv, o, *_):
    ans = []
    if o.get('est'):
        e = o['est']
        s.choices([('먼저 어림해요 · ' + rd(e['q']), opt_text(e['o']))])
        ans.append('어림 ' + flat(e['o'][e['a']]))
    vals = []
    for it in o['items']:
        seg, one = double_fig(s, lv, it)
        bot = it.get('bot', '')
        vals.append('%s → %s%s, %s → %s%s' % (at_bot(bot, '1/%d' % int(it['b'])), mixed(seg), it.get('top', ''),
                                                at_bot(bot, '1'), mixed(one), it.get('top', '')))
    if len(o['items']) == 1:
        it = o['items'][0]
        bot = it.get('bot', '')
        s.text(rd('그림의 네모 칸에 %s일 때와 %s일 때의 양을 써 보세요.' % (at_bot(bot, '[1/%d]' % int(it['b'])), at_bot(bot, '1'))))
    else:
        s.text('두 그림의 네모 칸에 알맞은 값을 써 보세요.')
    ans.append('그림 ' + flat(' / '.join(vals)))
    a = ask_part(s, lv, o)
    if a:
        ans.append(a)
    return ' / '.join(ans)


def w_flip(s, lv, o, *_):
    rows, ans = [], []
    for i, r in enumerate(o['rows']):
        A, B = F(r['A']), F(r['B'])
        v = A / B
        inv = '[%d/%d]' % (B.denominator, B.numerator)
        assert ev('[%s]×%s' % (r['A'], inv)) == v
        if lv == '기본형':
            rows.append('%s [%s]÷[%s] = [%s]×[{}/{}] = ▢' % (NUM[i], r['A'], r['B'], r['A']))
        else:
            rows.append('%s [%s]÷[%s] = %s = ▢' % (NUM[i], r['A'], r['B'], '_' * 14))
        ans.append('%s×%s = %s' % (r['A'], flat(inv), bk(v)))
    eq_fig(s, rows)
    if lv == '도전형':
        s.ask('분자와 분모를 바꾸는 분수는 어느 것인지 까닭과 함께 써 보세요.', blank=False)
        s.lines(1)
        ans.append('예) 나누는 수(÷ 뒤의 분수)예요. ÷(분수)는 그 분수의 분모를 곱하고 분자로 나누는 것과 같아요.')
    return ', '.join(ans)


def best_div(cards, shape, sign, proper=False, avoid=()):
    slots_ = sum(1 for f in shape for x in f if x is None)
    best_ = None
    for perm in permutations(range(len(cards)), slots_):
        it = iter(cards[i] for i in perm)
        f = [[x if x is not None else next(it) for x in fr] for fr in shape]
        if any(n == 0 or d == 0 or (proper and n >= d) for n, d in f):
            continue
        key = '%d/%d÷%d/%d' % (f[0][0], f[0][1], f[1][0], f[1][1])
        if key in avoid:
            continue
        v = Fraction(f[0][0], f[0][1]) / Fraction(f[1][0], f[1][1])
        if sign == 0:
            return v, key
        if best_ is None or sign * (v - best_[0]) > 0:
            best_ = (v, key)
    return best_


def board_txt(shape):
    p = lambda x: '{}' if x is None else str(x)
    return '[%s/%s]÷[%s/%s] = ▢' % (p(shape[0][0]), p(shape[0][1]), p(shape[1][0]), p(shape[1][1]))


def w_build(s, lv, o, *_):
    cards_fig(s, [str(c) for c in o['cards']])
    ans = []
    for bd in o['boards']:
        if bd.get('label'):
            s.text(rd(bd['label']))
        eq_fig(s, [board_txt(bd['shape'])], indent=30)
        sign = {'max': 1, 'min': -1}.get(bd.get('goal'), 0)
        v, key = best_div(o['cards'], bd['shape'], sign, bd.get('proper'), bd.get('avoid') or ())
        ans.append(('' if sign else '(예) ') + '%s = %s' % (key, bk(v)))
    if any(bd.get('goal') == 'any' for bd in o['boards']):
        ans[-1] += ' (식에 따라 몫이 달라요)'
    return ', '.join(ans)


def w_pose(s, lv, o, *_):
    cards_fig(s, ['[%s]' % f for f in o['fr']])
    sent = o['s'][0] + '(        )' + o['s'][1] + '(        )' + o['s'][2]
    s.fill([rd(sent)])
    s.ask('식: (                        )    %s (          )%s' % (o.get('ansLab') or '답:', o.get('unit') or ''), blank=False)
    a, b = o['fr'][0], o['fr'][1]
    v = F(a) / F(b)
    return '(예) %s÷%s = %s%s (고른 분수에 따라 달라요)' % (a, b, bk(v), o.get('unit') or '')


def w_game(s, lv, o, *_):
    sets = o['sets']
    rows = [['회', '수 카드', '내가 만든 나눗셈', '몫', '같은 나눗셈', '점수']]
    ex = []
    for i, st_ in enumerate(sets):
        hd = o.get('hard')      # 도전형 새 문제: 칸 글을 조금 다르게
        rows.append([str(i + 1), ', '.join(map(str, st_['cards'])), '', '', '있음 / 없음' if hd else '있어요 / 없어요', '(    )점' if hd else '      점'])
        a, b, c, d = st_['cards']
        ex.append('%d회 %d/%d÷%d/%d = %s' % (i + 1, a, b, c, d, bk(Fraction(a, b) / Fraction(c, d))))
    s.text('같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점을 더 얻어요. 모둠 친구들과 활동지를 바꾸어 확인해요.')
    s.table(rows, col_mm=[12, 26, 52, 30, 34, 26], row_h=3300)
    ans = '(예) ' + ', '.join(ex)
    if lv == '도전형' and len(sets) > 1:
        st_ = sets[1]
        s.text(rd('%d회 수 카드 %s로 친구들이 만든 활동지예요(앱에서 정한 것). 친구 셋끼리 견주어 점수를 매겨 보세요.'
                  % (2, ', '.join(map(str, st_['cards'])))))
        keys = ['%d/%d÷%d/%d' % tuple(f['e']) for f in st_['fr']]
        trs, pts = [['친구', '만든 나눗셈', '쓴 몫', '같은 나눗셈', '계산', '점수']], []
        for f, k in zip(st_['fr'], keys):
            a, b, c, d = f['e']
            ok = F(f['q']) == Fraction(a, b) / Fraction(c, d)
            dup = keys.count(k) > 1
            pts.append('%s %d점(%s, %s)' % (f['name'], (1 if dup else 2) + (1 if ok else 0), '같은 것 있음' if dup else '같은 것 없음', '옳음' if ok else '틀림'))
            trs.append([f['name'], '%d/%d ÷ %d/%d' % (a, b, c, d), f['q'], '', '', ''])
        s.table(trs, col_mm=[20, 40, 26, 34, 30, 30], row_h=3000)
        ans += ' / 2회 친구: ' + ', '.join(pts)
    return ans


def w_dice(s, lv, o, *_):
    s.table([['회', '나온 수(4개)', '만든 나눗셈', '몫']] + [[str(i), '', '', ''] for i in range(1, 4)], col_mm=[14, 50, 60, 56], row_h=3300)
    return '학생마다 달라요(나온 수를 한 번씩 모두 썼는지, 몫이 맞는지 확인)'


def w_match(s, lv, o, *_):
    L, R = o['left'], o['right']
    for l in L:
        for r in R:
            assert (ev(l['t']) == ev(r['t'])) == (r['k'] == l['k']), ('잇기 확인 필요', l, r)
    s.text('왼쪽 식과 몫이 같은 오른쪽 수를 선으로 이어 보세요. 짝이 없는 수도 있어요.')
    match_fig(s, [l['t'] for l in L], [r['t'] for r in R])
    return ', '.join('%s — %s' % (flat(l['t']), flat(next(r['t'] for r in R if r['k'] == l['k']))) for l in L)


def w_sort(s, lv, o, *_):
    s.choices([(rd(c['t']), opt_text(o['bins'])) for c in o['cards']])
    return ', '.join('%s → %s' % (flat(c['t']), o['bins'][c['k']]) for c in o['cards'])


def w_error(s, lv, msg, *_):
    raise RuntimeError('앱 원본의 활동을 읽지 못했어요: ' + msg)


WIDGETS = {'quiz': w_quiz, 'blanks': w_blanks, 'sequence': w_sequence, 'fd6Chain': w_chain, 'fd6Calc': w_calc,
           'fd6Scoop': w_scoop, 'fd6Pie': w_pie, 'fd6Double': w_double, 'fd6Flip': w_flip, 'fd6Build': w_build,
           'fd6Pose': w_pose, 'fd6Game': w_game, 'fd6Dice': w_dice, 'fd6Match': w_match, 'fd6Sort': w_sort, 'error': w_error}


def run_calls(s, lv, calls):
    out = []
    for c in calls:
        if c['w'] not in WIDGETS:
            raise RuntimeError('활동지에 아직 없는 부품: %s — gen_u1-fracdiv.py의 WIDGETS에 더하세요' % c['w'])
        out.append(WIDGETS[c['w']](s, lv, *c['args']))
    return ' / '.join(a for a in out if a)


# ---------------------------------------------------------------- 차시
WHY = {   # 도전형 '왜' 쓰기(차시 id → 물음, 예시 답)
    't1': ('[3/4]÷[1/4]처럼 나누는 수가 분수인 나눗셈이 생활에서 쓰이는 때를 하나 찾아 써 보세요.',
           '예) 우유 2 L를 1/4 L씩 컵에 따르면 몇 컵이 되는지 알아볼 때 써요.'),
    't2': ('분모가 같은 (분수)÷(분수)를 분자끼리 나누어 계산해도 되는 까닭을 써 보세요.',
           '예) 두 분수가 모두 같은 단위분수의 몇 개인지로 나타나므로, 단위분수의 개수끼리 나누면 돼요.'),
    't3': ('[3/5]÷[4/5]의 몫이 1보다 작은 까닭을 써 보세요.',
           '예) 나누는 수 4/5가 나누어지는 수 3/5보다 커서 한 번도 다 덜어 낼 수 없기 때문이에요.'),
    't4': ('분모가 다른 (분수)÷(분수)에서 먼저 통분하는 까닭을 써 보세요.',
           '예) 분모를 같게 해야 같은 단위분수의 개수로 나타내어 분자끼리 나눌 수 있기 때문이에요.'),
    't5': ('6÷[2/3]의 몫 9가 6보다 큰 까닭을 써 보세요.',
           '예) 1보다 작은 2/3씩 덜어 내면 6에서 여러 번 덜어 낼 수 있어서 몫이 6보다 커져요.'),
    't6': ('[4/5]÷[2/3]가 [4/5]×[3/2]과 같은 까닭을 써 보세요.',
           '예) 2/3로 나누는 것은 2로 나누고(×1/2) 3을 곱하는 것과 같아서 ×3/2이 돼요.'),
    't7': ('대분수를 가분수로 바꾸지 않고 계산하면 어떤 실수를 할 수 있는지 써 보세요.',
           '예) 자연수 부분은 두고 분수 부분만 나누는 실수를 해요. 가분수로 바꾸어야 바르게 계산해요.'),
    't89': ('양이 다른 두 가게의 값을 비교할 때 1 kg의 가격을 구하는 까닭을 써 보세요.',
            '예) 양이 달라서 값만으로는 비교할 수 없으니, 같은 양(1 kg)의 가격으로 바꾸어 비교해요.'),
    't10': ('놀이에서 점수를 많이 얻으려면 어떻게 해야 하는지 써 보세요.',
            '예) 친구와 다른 나눗셈을 만들고, 나누는 분수의 분자와 분모를 바꾸어 곱해 정확하게 계산해요.'),
    't11': ('분수의 나눗셈을 계산하는 방법 중 가장 편리한 방법과 그 까닭을 써 보세요.',
            '예) 분수의 곱셈으로 바꾸는 방법이 편리해요. 통분하지 않아도 되고 약분을 먼저 할 수 있어요.'),
}


def split_name(n):
    m = re.match(r'^(.*?)\s*[①-⑧]\s*(.+)$', n)
    return (m.group(1), m.group(2)) if m else (n, None)


def show_inst(s, lv, inst, hints):
    t = paper(inst)
    if t:
        s.text(rd(t))
    if lv == '기본형':
        for hn in hints or []:
            h = paper(hn)
            if h:
                s.text('도움: ' + rd(h))
                break


def tb_lesson(s, lv, L, first, story):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if first and story:
        s.scene(None, rd(story['lines'][0]))
        note_line(s)
    ans = []
    hard = HARD_TB.get(L['id']) if lv == '도전형' else None      # 도전형 ①~⑤는 새 문제
    assert hard is None or len(hard) == len(L['steps']), ('도전형 새 문제 수가 계단 수와 달라요', L['id'])
    for i, st_ in enumerate(L['steps']):
        lab, sub = split_name(st_['name'])
        if hard and len(hard[i]) > 2:       # 계단 이름에 든 수도 새 문제에 맞게
            sub = hard[i][2]
        step(s, i, lab, sub)
        if hard:
            show_inst(s, lv, hard[i][0], [])
            ans.append('%s %s' % (NUM[i], run_calls(s, lv, hard[i][1])))
            continue
        show_inst(s, lv, st_['inst'], st_['hints'])
        ans.append('%s %s' % (NUM[i], run_calls(s, lv, st_['calls'])))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('ch'):
            step(s, n, '★ 도전하기', '앱의 도전 문제')
            show_inst(s, lv, L['ch']['inst'], [])
            ans.append('%s %s' % (NUM[n], run_calls(s, lv, L['ch']['calls'])))
            n += 1
        q, a = WHY.get(L['id'], ('오늘 배운 계산 방법을 친구에게 설명하듯 써 보세요.', '예) ' + flat(L['summary'].split('. ')[-1])))
        step(s, n, '생각 쓰기', '왜 그럴까요?')
        challenge_why(s, q)
        ans.append('%s %s' % (NUM[n], a))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


def note_line(s):
    s.text('※ 계산 식은 분수를 위아래로 썼어요. 글 속에서는 ‘7분의 3’, ‘2와 4분의 1’처럼 읽는 말로 썼어요. '
           '네모 칸에는 수를, 큰 네모 칸에는 답을 써요. 몫은 약분하지 않은 분수, 가분수, 대분수로 써도 값이 같으면 맞아요.')


DATA = {}

# ================================================================ 이야기 버전(u1-fracdiv.st.js '6학년 2반 숲속 수련회', 11차시)
# 교과서 버전과 같은 부품(fd6Scoop·fd6Calc·fd6Chain …)을 쓰고, 이야기 엔진 부품(panes·thenWhy·ruleFirst·wonderRecall·
# writeStep)과 수련회 그림(fd6sCamp)·준비 쪽지(fd6sNote)·놀이 활동지 표(fd6sSheet)를 더 기록합니다.
_ST_REPL = [
    ("function fd6Style() {} function fd6Style2() {} function fd6Style3() {}",
     "function fd6Style() {} function fd6Style2() {} function fd6Style3() {} function fd6sStyle() {}\n"
     "const fd6G = (a, b) => b ? fd6G(b, a % b) : Math.abs(a);\n"
     "function fd6R(num, den) { const g = fd6G(num, den) || 1; return { num: num / g, den: den / g }; }\n"
     "function fd6Form(num, den) { const w = Math.floor(num / den), r = num % den; return r === 0 ? String(w) : w === 0 ? `${r}/${den}` : `${w} ${r}/${den}`; }"),
    ("eval(fnSrc('fd6Scene').replace('function fd6Scene', 'var fd6SceneReal = function'));\n"
     "eval(fnSrc('fd6Sheets').replace('function fd6Sheets', 'var fd6SheetsReal = function'));",
     "eval(fnSrc('fd6sCamp').replace('function fd6sCamp', 'var fd6SceneReal = function'));\n"
     "eval(fnSrc('fd6sSheet').replace('function fd6sSheet', 'var fd6SheetsReal = function'));"),
    ("function fd6Scene() {} function fd6Sheets() {}",
     "function fd6sSheet() {}\n"
     "var fd6sCamp = () => { REC.push({ w: 'camp', args: [] }); return null; };\n"
     "var fd6sNote = (title, lines) => { REC.push({ w: 'note', args: [title, lines] }); return null; };\n"
     "var thenWhy = (fn, o) => (b, a) => { fn(b, a); REC.push({ w: 'thenWhy', args: [o] }); };\n"
     "var ruleFirst = (fn, o) => (b, a) => { REC.push({ w: 'ruleFirst', args: [o] }); fn(b, a); };\n"
     "var wonderRecall = (fn, o) => (b, a) => { REC.push({ w: 'wonder', args: [] }); fn(b, a); };"),
]


def _cap_st_js():
    js = CAP_JS
    for a, b in _ST_REPL:
        assert js.count(a) == 1, ('CAP_JS가 바뀌었어요', a[:40])
        js = js.replace(a, b)
    return js


def w_camp(s, lv, *_):
    if DATA.get('scene'):
        scene_pic(s, DATA['scene'])
    return ''


def w_note(s, lv, title, lines, *_):
    s.text(re.sub(r'^\W+\s*', '', title))
    s.fill([rd(re.sub(r'^[^\w\[(]+\s*', '', t)) for t in lines])
    return ''


def w_panes(s, lv, items, opts=None, *_):
    panes(s, lv, [(it['t'], it.get('ph') or '~', (it.get('ex') or [''])[0]) for it in items])
    return '(자유) ' + ' / '.join('%s 예) %s' % (it['t'], flat(it['ex'][0])) for it in items if it.get('ex'))


def w_then_why(s, lv, o, *_):
    why(s, lv, o['q'], (o.get('help') or ['', o.get('ph') or ''])[-1])
    return '왜? 예) ' + flat(o.get('ans') or '')


def w_rule_first(s, lv, o, *_):
    rule_first(s, lv, o['q'], (o.get('help') or ['', o.get('ph') or ''])[-1])
    return '예상(자유) — 실제 규칙: ' + flat(o.get('ans') or '')


def w_wonder(s, lv, *_):
    s.text('1차시에 쓴 ‘궁금해요’ 칸을 다시 보고, 이제 답할 수 있게 된 것을 떠올려 보세요.')
    return ''


def w_write(s, lv, items, opts=None, *_):
    out = []
    for it in items:
        q = ('%s · ' % it['tag'] if it.get('tag') else '') + it['q']
        out.append(write_ans(s, lv, q, (it.get('help') or ['', it.get('ph') or ''])[-1], it.get('ans') or '(자유)'))
    return ' / '.join('예) ' + a for a in out)


WIDGETS.update({'camp': w_camp, 'note': w_note, 'panes': w_panes, 'thenWhy': w_then_why, 'ruleFirst': w_rule_first,
                'wonder': w_wonder, 'writeStep': w_write})

WHY_ST = {   # 도전형 '왜' 쓰기(이야기 차시 id → 물음, 예시 답)
    's1': ('수련회에서 나누는 수가 분수인 나눗셈을 써야 하는 때를 쪽지 말고 하나 더 찾아 써 보세요.',
           '예) 물 2 L를 [1/4] L씩 컵에 따르면 몇 컵이 되는지 알아볼 때 써요.'),
    's2': ('[6/8]÷[2/8]을 분자끼리 6÷2로 계산해도 되는 까닭을 피자 조각으로 설명해 보세요.',
           '예) 두 분수가 모두 [1/8]판 조각으로 되어 있어서 조각 6개를 2개씩 묶는 것과 같기 때문이에요.'),
    's3': ('[7/8]÷[3/8]의 몫이 2와 3 사이인 까닭을 레모네이드 컵으로 설명해 보세요.',
           '예) [3/8] L 컵을 2번 채우고 [1/8] L가 남아서, 2컵과 1컵의 [1/3]만큼이 되기 때문이에요.'),
    's4': ('분모가 다른 (분수)÷(분수)에서 먼저 통분하는 까닭을 써 보세요.',
           '예) 분모를 같게 해야 같은 크기 조각의 개수로 나타내어 분자끼리 나눌 수 있기 때문이에요.'),
    's5': ('8÷[2/3]의 몫 12가 8보다 큰 까닭을 팔찌 끈으로 설명해 보세요.',
           '예) 1 m보다 짧은 [2/3] m씩 자르면 8 m에서 8번보다 많이 자를 수 있어서 몫이 8보다 커요.'),
    's6': ('[3/4]÷[3/5]이 [3/4]×[5/3]과 같은 까닭을 보리차 물통으로 설명해 보세요.',
           '예) 물통의 [1/5]만큼을 구하려고 3으로 나누고(×[1/3]), 물통 가득을 구하려고 5를 곱하니 ×[5/3]이 돼요.'),
    's7': ('[2 1/2]÷[5/8]을 계산할 때 대분수를 그대로 두고 분수 부분만 나누면 어떤 잘못이 생기는지 써 보세요.',
           '예) 자연수 부분 2를 나누지 않아 몫이 틀려요. 가분수 [5/2]로 바꾸어야 바르게 계산해요.'),
    's8': ('양이 다른 두 마트의 값을 비교할 때 1 kg의 가격을 구하는 까닭을 써 보세요.',
           '예) 양이 달라서 값만으로는 비교할 수 없으니, 같은 양(1 kg)의 가격으로 바꾸어 비교해요.'),
    's9': ('분수의 나눗셈을 계산하는 방법 가운데 가장 편리한 방법과 그 까닭을 써 보세요.',
           '예) 분수의 곱셈으로 바꾸는 방법이 편리해요. 통분하지 않아도 되고 약분을 먼저 할 수 있어요.'),
    's10': ('캠프파이어 놀이에서 점수를 많이 얻으려면 어떻게 해야 하는지 써 보세요.',
            '예) 친구와 다른 나눗셈을 만들고, 나누는 분수의 분자와 분모를 바꾸어 곱해 정확하게 계산해요.'),
    's11': ('이 단원에서 배운 것 가운데 1차시에 궁금했던 것에 답할 수 있게 된 것을 써 보세요.',
            '예) 몫이 나누어지는 수보다 커질 수 있는지 궁금했는데, 1보다 작은 수로 나누면 몫이 커진다는 것을 알았어요.'),
}
ST_IDS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11']


def st_lesson(s, lv, L, first, story):
    s.lesson(L['no'], L['soop'], rd(L['title']), rd(L['question']))
    if first and story:
        s.scene(None, rd(story['lines'][0]))
        note_line(s)
    ans = []
    hard = HARD_ST.get(L['id']) if lv == '도전형' else None      # 도전형 ①~⑤는 새 문제
    assert hard is None or len(hard) == len(L['steps']), ('도전형 새 문제 수가 계단 수와 달라요', L['id'])
    for i, st_ in enumerate(L['steps']):
        lab, sub = split_name(st_['name'])
        if hard and len(hard[i]) > 2:       # 계단 이름에 든 수도 새 문제에 맞게
            sub = hard[i][2]
        step(s, i, lab, sub)
        if hard:
            show_inst(s, lv, hard[i][0], [])
            ans.append('%s %s' % (NUM[i], run_calls(s, lv, hard[i][1])))
            continue
        show_inst(s, lv, st_['inst'], st_['hints'])
        ans.append('%s %s' % (NUM[i], run_calls(s, lv, st_['calls'])))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('ch'):
            step(s, n, '★ 도전하기', '앱의 도전 문제')
            show_inst(s, lv, L['ch']['inst'], [])
            ans.append('%s %s' % (NUM[n], run_calls(s, lv, L['ch']['calls'])))
            n += 1
        q, a = WHY_ST.get(L['id'], ('오늘 배운 계산 방법을 친구에게 설명하듯 써 보세요.', '예) ' + flat(L['summary'].split('. ')[-1])))
        step(s, n, '생각 쓰기', '왜 그럴까요?')
        challenge_why(s, q)
        ans.append('%s %s' % (NUM[n], flat(a)))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


def _st(lid):
    def f(s, lv):
        Ls = DATA['lessons']
        k = [L['id'] for L in Ls].index(lid)
        return st_lesson(s, lv, Ls[k], k == 0, DATA.get('story'))
    f.__name__ = 'st_' + lid
    return f


ST = [_st(i) for i in ST_IDS]



# ================================================================ 도전형 새 문제(2026-10-30)
# 도전형 ①~⑤는 기본형과 다른 수·상황으로 새로 씁니다(_build/sheets_hard/BRIEF.md). 앱 부품과 같은 꼴로 적어
# 같은 그리기·채점 코드(run_calls)를 쓰므로, 계산 칸(fd6Calc)·식 줄(fd6Chain)의 답은 ev()로 다시 계산해 맞춥니다.
def _i(x):
    return {'i': str(x)}


def _c(o, a=0):
    return {'c': o, 'a': a}


def _qi(n, d, bd=False):
    """분수 칸(분자 빈칸, bd면 분모도 빈칸)"""
    return {'q': [None, '?%d' % n, ('?%d' if bd else '%d') % d]}


def _qm(x):
    """대분수 칸(자연수·분자 빈칸)"""
    x = Fraction(x)
    w, r = divmod(x.numerator, x.denominator)
    return {'q': ['?%d' % w, '?%d' % r, str(x.denominator)]}


def _fr(x):
    """Fraction → 식 글 '[3/4]' · '[2 1/3]' · '5'"""
    x = Fraction(x)
    return str(x.numerator) if x.denominator == 1 else '[%s]' % mixed(x)


def _calc(*items):
    """계산 칸: 식 글 또는 dict(q=문제, x=식, unit=, lab=) → 앱 fd6Calc 꼴(답은 ev로 계산)"""
    out = []
    for it in items:
        it = {'e': it} if isinstance(it, str) else dict(it)
        if 'pick' in it:
            out.append(it)
            continue
        v = ev(it.get('x') or it['e'])
        if v.denominator == 1:
            it['n'] = int(v)
        else:
            it['a'] = mixed(v)
        out.append(it)
    return {'w': 'fd6Calc', 'args': [out]}


def _chain(*rows):
    return {'w': 'fd6Chain', 'args': [list(rows)]}


def _blanks(*parts):
    return {'w': 'blanks', 'args': [[p if isinstance(p, str) else {'o': p[0], 'a': p[1]} for p in parts]]}


def _quiz(*items):
    return {'w': 'quiz', 'args': [[{'q': q, 'o': o, 'a': a} for q, o, a in items]]}


def _why(q, a):
    return {'w': 'thenWhy', 'args': [{'q': q, 'ans': a}]}


def _rule(q, a):
    return {'w': 'ruleFirst', 'args': [{'q': q, 'ans': a}]}


def _write(*items):
    return {'w': 'writeStep', 'args': [[{'q': q, 'tag': t, 'ans': a} for t, q, a in items]]}


def _panes(*items):
    return {'w': 'panes', 'args': [[{'t': t, 'ph': ph, 'ex': [ex]} for t, ph, ex in items]]}


def _scoop(A, B, **kw):
    o = {'A': A, 'B': B}
    o.update(kw)
    return {'w': 'fd6Scoop', 'args': [o]}


def _double(items, **kw):
    o = {'items': items}
    o.update(kw)
    return {'w': 'fd6Double', 'args': [o]}


def _sort(bins, cards):
    return {'w': 'fd6Sort', 'args': [{'bins': bins, 'cards': [{'t': t, 'k': k} for t, k in cards]}]}


def _match(left, right):
    """left [(식, 짝 번호)], right [(수, 짝 번호|None)] — w_match가 몫이 같은지 다시 확인"""
    return {'w': 'fd6Match', 'args': [{'left': [{'t': t, 'k': k} for t, k in left], 'right': [{'t': t, 'k': k} for t, k in right]}]}


def _pick_scores(cards, sheet):
    """놀이 점수 매기기: sheet [(이름, (a,b,c,d), 쓴 몫)] → 고르기 문제(점수는 규칙대로 계산)"""
    keys = [k for _, k, _ in sheet]
    items = []
    for nm, k, q in sheet:
        a, b, c, d = k
        ok = F(q) == Fraction(a, b) / Fraction(c, d)
        pt = (1 if keys.count(k) > 1 else 2) + (1 if ok else 0)
        items.append(('%s: [%d/%d]÷[%d/%d] = %s' % (nm, a, b, c, d, _fr(F(q))), ['3점', '2점', '1점'], 3 - pt))
    return _quiz(*items)


def _game_sets(sets):
    """fd6Game 세트: [(카드, [(이름, e, 쓴 몫)])]"""
    return [{'cards': c, 'fr': [{'name': n, 'e': list(e), 'q': q} for n, e, q in fr]} for c, fr in sets]


HARD_TB = {
    't1': [
        ('삼촌이 보내 준 과학 기지 사진을 다시 보며 기지에서 하는 일과 그 까닭을 짝지어 보세요.',
         [_quiz(('과학 기지에서 하는 일과 그 까닭을 바르게 짝지은 것을 모두 고르세요.',
                 ['쓰레기 줍기 — 펭귄 보호', '바닷물 분석 — 기후 변화 연구', '운석 연구 — 우주 환경 파악', '운석 연구 — 바닷물 식수 만들기'], [0, 1, 2]),
                ('우리나라가 남극에 처음으로 세운 과학 기지는 무엇일까요?', ['세종 과학 기지', '장보고 과학 기지'], 0))]),
        ('팬케이크 반죽 [9/10] L를 [3/10] L씩 나누어 구우면 팬케이크를 몇 장 구울 수 있을까요? 띠에서 [3/10] L씩 덜어 내 보세요.',
         [_scoop('9/10', '3/10', unit=' L', cnt='장', aName='반죽 [9/10] L', bName='한 장 [3/10] L',
                 askCalc=[{'lab': '구울 수 있는 팬케이크', 'x': '[9/10]÷[3/10]', 'n': 3, 'unit': '장'}])]),
        ('부엌에서 생긴 일이에요. 나눗셈 식으로 알맞은 것을 골라 보세요. 나누는 순서에 주의해요.',
         [_quiz(('설탕 [5/6]컵을 한 번에 [1/6]컵씩 넣으면 몇 번 넣어야 할까요?', ['[1/6]÷[5/6]', '[5/6]÷[1/6]', '[5/6]−[1/6]'], 1),
                ('식초 [1/8]컵은 올리브유 [3/8]컵의 몇 배일까요?', ['[3/8]÷[1/8]', '[3/8]×[1/8]', '[1/8]÷[3/8]'], 2),
                ('버터 3 kg을 [3/4] kg씩 포장하면 몇 봉지가 될까요?', ['3÷[3/4]', '[3/4]÷3', '3×[3/4]'], 0))]),
        ('통분과 (분수)×(분수)를 더 어려운 수로 떠올려요.',
         [_chain(['([5/6], [4/9])를 최소공배수로 통분하면 (', _qi(15, 18), ', ', _qi(8, 18), ')'],
                 ['([3/10], [7/15])을 최소공배수로 통분하면 (', _qi(9, 30), ', ', _qi(14, 30), ')'],
                 ['[5/8]×[4/15] = ', {'q': [None, ['5', '×', '?4'], ['8', '×', '?15']]}, ' = ', _qi(1, 6, True)])]),
        ('(자연수)÷(자연수)와 (분수)÷(자연수)를 떠올려요. 대분수로도 나타내 보세요.',
         [_chain(['5÷8 = ', _qi(5, 8, True)],
                 ['11÷3 = ', _qi(11, 3), ' = ', _qm(Fraction(11, 3))],
                 ['[6/7]÷3 = ', {'q': [None, ['6', '÷', '?3'], '7']}, ' = ', _qi(2, 7)],
                 ['[4/5]÷3 = [4/5]×', _qi(1, 3, True), ' = ', _qi(4, 15)])]),
    ],
    't2': [
        ('식물 공장에서 비료 [9/11] kg을 화분 한 개에 [3/11] kg씩 나누어 주려고 해요. 화분 몇 개에 줄 수 있을까요?',
         [_scoop('9/11', '3/11', unit=' kg', aName='비료 [9/11] kg', bName='화분 1개 [3/11] kg',
                 ask=[['구하는 식: ', _c(['[3/11]÷[9/11]', '[9/11]÷[3/11]', '[9/11]×[3/11]'], 1)],
                      ['[9/11]은 [1/11]이 ', _i(9), '개, [3/11]은 [1/11]이 ', _i(3), '개예요.'],
                      ['[9/11]÷[3/11] = ', _i(9), '÷', _i(3), ' = ', _i(3)],
                      ['화분 ', _i(3), '개에 나누어 줄 수 있어요.']])]),
        ('[12/13]÷[4/13]를 어떻게 계산하는지 알아봐요. 띠에서 [4/13]씩 덜어 내 보세요.',
         [_scoop('12/13', '4/13', ask=[['[12/13]는 [4/13]가 ', _i(3), '개예요.'],
                                       ['[12/13]÷[4/13] = ', _i(12), '÷', _i(4), ' = ', _i(3)]])]),
        ('사과파이 [6/7]판을 한 사람에게 [2/7]판씩 나누어 주려고 해요. 그림에 한 사람 몫씩 색을 바꾸어 칠하고, 몇 명에게 나누어 줄 수 있는지 설명해 보세요.',
         [{'w': 'fd6Pie', 'args': [{'A': '6/7', 'B': '2/7', 'cnt': '명', 'one': '사람', 'aName': '사과파이 [6/7]판', 'bName': '[2/7]판',
                                    'ask': [['식: [6/7]÷[2/7] = ', _i(3)],
                                            ['설명: [6/7]은 [1/7]이 ', _i(6), '개, [2/7]는 [1/7]이 ', _i(2), '개이므로 ', _c(['2명', '3명', '6명'], 1), '에게 나누어 줄 수 있어요.']]}]}]),
        ('분모가 같은 (분수)÷(분수)를 다른 말로 정리해요. 알맞은 말을 낱말 상자에서 골라 써요.',
         [_blanks('[8/15]÷[2/15]의 몫은 ', (['8÷2', '15÷15', '8×2'], 0), '와 같아요. 분모가 같으면 ', (['분자', '분모'], 1),
                  '는 몫을 구하는 데 쓰지 않고, ', (['분자', '분모'], 0), '끼리 나누어요.')]),
        ('계산해 보세요. 마지막 문제는 □ 안에 알맞은 분수를 구해요.',
         [_calc('[14/15]÷[2/15]', '[18/19]÷[6/19]', '[24/25]÷[3/25]',
                {'q': '□÷[3/11] = 3일 때, □ 안에 알맞은 분수는?', 'x': '3×[3/11]', 'lab': '□ ='})]),
    ],
    't3': [
        ('식수 [11/12] L를 들이가 [5/12] L인 컵에 옮겨 담으려고 해요. 식수를 모두 옮겨 담으면 몇 컵이 될까요?',
         [_scoop('11/12', '5/12', unit=' L', aName='식수 [11/12] L', bName='컵 1개 [5/12] L',
                 ask=[['구하는 식: ', _c(['[11/12]×[5/12]', '[5/12]÷[11/12]', '[11/12]÷[5/12]'], 2)],
                      ['', _i(2), '컵과 1컵의 ', _qi(1, 5, True), '만큼이 돼요.'],
                      ['[11/12]÷[5/12] = ', _qm(Fraction(11, 5))]])]),
        ('[7/8]÷[3/8]을 어떻게 계산하는지 알아봐요. [3/8]씩 묶고, 남는 부분이 한 묶음의 얼마만큼인지 살펴보세요.',
         [_scoop('7/8', '3/8', ask=[['[7/8]은 [3/8]씩 ', _i(2), '번 묶을 수 있고, 남는 부분은 [3/8]의 ', _qi(1, 3, True), '이에요.'],
                                    ['[7/8]÷[3/8] = ', _i(7), '÷', _i(3), ' = ', _qi(7, 3), ' = ', _qm(Fraction(7, 3))]])]),
        ('[4/7]÷[6/7]처럼 나누는 수가 더 크면 몫은 어떻게 될까요? 띠에서 덜어 내 보고, 몫을 기약분수로도 나타내 보세요.',
         [_scoop('4/7', '6/7', ask=[['[4/7]÷[6/7] = ', _i(4), '÷', _i(6), ' = ', _qi(4, 6), ' = ', _qi(2, 3)],
                                    ['나누는 수가 나누어지는 수보다 크면 몫은 ', _c(['1보다 커요', '1보다 작아요'], 1), '.']])]),
        ('분자끼리 나누어떨어지지 않을 때의 몫을 정리해요. 알맞은 말을 낱말 상자에서 골라 써요.',
         [_blanks('[■/●]÷[▲/●]에서 ■가 ▲보다 작으면 몫은 ', (['1보다 작은 분수', '1보다 큰 수'], 0), '이고, ■가 ▲보다 크면 몫은 ',
                  (['1보다 작은 분수', '1보다 큰 수'], 1), '예요. 나누어떨어지지 않는 몫은 ', (['분수로', '자연수로만'], 0), ' 나타내요.')]),
        ('몫을 구해 보세요. 가분수와 대분수 어느 꼴로 써도 맞아요.',
         [_calc('[5/13]÷[9/13]', '[11/14]÷[3/14]', '[17/20]÷[7/20]', '[9/16]÷[13/16]')]),
    ],
    't4': [
        ('삼촌이 쓰레기를 어제는 [2/3] kg, 오늘은 [1/12] kg 주웠어요. 어제 주운 양은 오늘 주운 양의 몇 배일까요? 칸 크기를 같게 한 다음 덜어 내 보세요.',
         [_scoop('2/3', '1/12', unit=' kg', aName='어제 [2/3] kg', bName='오늘 [1/12] kg',
                 ask=[['구하는 식: ', _c(['[1/12]÷[2/3]', '[2/3]÷[1/12]', '[2/3]×[1/12]'], 1)],
                      ['[2/3] = ', _qi(8, 12), '이고, [8/12]은 [1/12]이 ', _i(8), '개예요.'],
                      ['[2/3]÷[1/12] = ', _i(8)],
                      ['어제 주운 양은 오늘의 ', _i(8), '배예요.']])]),
        ('[4/5]÷[2/3]을 알아봐요. 두 띠의 한 칸이 같은 크기가 되도록 나눈 다음 덜어 내 보세요.',
         [_scoop('4/5', '2/3', ask=[['[4/5]÷[2/3] = ', _qi(12, 15), '÷', _qi(10, 15), ' = ', _i(12), '÷', _i(10), ' = ', _qi(12, 10, True), ' = ', _qm(Fraction(6, 5))],
                                    ['두 분모 5와 3의 ', _c(['공배수', '공약수'], 0), '로 통분했어요.']])]),
        ('보기의 분수에서 서로 다른 두 개를 골라 넣어 문제를 만들고 답을 구해 보세요.',
         [{'w': 'fd6Pose', 'args': [{'fr': ['3/4', '2/9', '5/6', '4/15'], 's': ['고구마가 ', ' kg, 감자가 ', ' kg 있습니다. 고구마의 무게는 감자의 무게의 몇 배인가요?'],
                                     'ansLab': '답:', 'unit': '배'}]}]),
        ('[2/5]÷[3/4]를 예로 분모가 다른 (분수)÷(분수)의 계산 방법을 정리해요.',
         [_blanks('[2/5]÷[3/4]은 먼저 분모 5와 4의 ', (['공배수', '공약수'], 0), '로 통분하여 [8/20]÷[15/20]로 바꾼 다음 ', (['8÷15', '20÷20'], 0),
                  '를 계산해요. 그래서 몫은 ', (['[8/15]', '[15/8]'], 0), '이에요.')]),
        ('몫을 구해 보세요. 약분하지 않은 분수, 가분수, 대분수 모두 맞아요.',
         [_calc('[4/9]÷[2/27]', '[5/8]÷[5/12]', '[3/10]÷[4/15]', '[7/12]÷[7/9]')]),
    ],
    't5': [
        ('아라온호가 일정한 빠르기로 10 km를 가는 데 [2/5]시간이 걸렸어요. 같은 빠르기로 1시간 동안 몇 km를 갈 수 있을까요? 아래 그림에서 [1/5]시간, 1시간일 때의 양을 차례로 구해 보세요.',
         [_double([{'Q': '10', 'a': 2, 'b': 5, 'top': ' km', 'bot': '시간', 'name': '아라온호'}],
                  est={'q': '10 km를 가는 데 2시간이 걸렸다면 1시간 동안 몇 km를 갈까요?', 'o': ['20 km', '5 km', '12 km'], 'a': 1},
                  ask=[['구하는 식: ', _c(['10×[2/5]', '[2/5]÷10', '10÷[2/5]'], 2)],
                       ['[1/5]시간 동안: 10÷', _i(2), ' = ', _i(5), ' (km)'],
                       ['1시간 동안: 5×', _i(5), ' = ', _i(25), ' (km)']])]),
        ('12÷[3/7]을 두 가지 방법으로 계산해 보세요.',
         [_chain({'t': '분자로 나누고 분모 곱하기', 'p': ['12÷[3/7] = (12÷', _i(3), ')×', _i(7), ' = ', _i(28)]},
                 {'t': '분수로 바꾸기', 'p': ['12÷[3/7] = ', _qi(84, 7), '÷[3/7] = ', _i(84), '÷', _i(3), ' = ', _i(28)]},
                 ['두 방법으로 구한 몫은 ', _c(['같아요', '달라요'], 0), '.'])]),
        ('리본 5 m를 [5/6] m씩 나누어 상자를 포장하려고 해요. 1 m를 똑같이 나누어 [5/6] m씩 덜어 내 보고, 상자를 몇 개 포장할 수 있는지 구해 보세요.',
         [_scoop('5', '5/6', unit=' m', aName='리본 5 m', bName='상자 1개 [5/6] m',
                 ask=[['5÷[5/6] = (5÷', _i(5), ')×', _i(6), ' = ', _i(6)], ['상자를 ', _i(6), '개 포장할 수 있어요.']])]),
        ('9÷[3/4]을 예로 (자연수)÷(분수)의 계산 방법을 정리해요.',
         [_blanks('9÷[3/4]은 (9÷', (['3', '4'], 0), ')×', (['3', '4'], 1), '로 계산해요. 나누는 분수가 1보다 작으면 몫은 나누어지는 자연수보다 ',
                  (['커요', '작아요'], 0), '.')]),
        ('계산해 보세요. 몫이 자연수가 아닌 것도 있어요.',
         [_calc('16÷[4/9]', '18÷[6/11]', '25÷[5/8]', '10÷[4/7]')]),
    ],
    't6': [
        ('바닷물 [6/7] L를 빈 수조에 옮겨 담았더니 수조의 [3/4]만큼 찼어요. 수조를 가득 채울 수 있는 바닷물은 몇 L일까요? 아래 그림에서 수조의 [1/4], 수조 1개일 때의 양을 차례로 구해 보세요.',
         [_double([{'Q': '6/7', 'a': 3, 'b': 4, 'top': ' L', 'bot': '수조', 'pre': '수조', 'name': '바닷물'}],
                  ask=[['구하는 식: ', _c(['[6/7]×[3/4]', '[6/7]÷[3/4]', '[3/4]÷[6/7]'], 1)],
                       ['수조의 [1/4]만큼: [6/7]÷', _i(3), ' = ', _qi(2, 7), ' (L)'],
                       ['수조 가득: [2/7]×', _i(4), ' = ', _qi(8, 7), ' = ', _qm(Fraction(8, 7)), ' (L)']])]),
        ('그림에서 한 계산을 이어서 [6/7]÷[3/4]을 분수의 곱셈으로 나타내 보세요.',
         [_chain(['[6/7]÷[3/4] = [6/7]÷', _i(3), '×', _i(4), ' = [6/7]×', _qi(1, 3, True), '×4 = [6/7]×', _qi(4, 3, True), ' = ', _qi(8, 7), ' = ', _qm(Fraction(8, 7))],
                 ['÷[3/4]은 ×', _c(['[3/4]', '[4/3]'], 1), '로 바꾸어 계산할 수 있어요.'])]),
        ('나눗셈을 곱셈으로 바꾸어 계산해 보세요. 어느 분수의 분자와 분모를 바꾸었는지 확인해요.',
         [{'w': 'fd6Flip', 'args': [{'rows': [{'A': '7/9', 'B': '14/15'}, {'A': '5/8', 'B': '3/10'}, {'A': '9/14', 'B': '6/7'}]}]}]),
        ('나누는 분수를 곱셈으로 바꾸는 방법을 정리해요.',
         [_blanks('÷[2/9]는 ×', (['[9/2]', '[2/9]'], 0), '와 같고, ÷[1/5]은 ×', (['5', '[1/5]'], 0), '와 같아요. 나누어지는 분수는 ',
                  (['그대로 두어요', '분자와 분모를 바꾸어요'], 0), '.')]),
        ('분수의 곱셈으로 나타내어 계산해 보세요. 약분할 수 있으면 먼저 약분해요.',
         [_calc('[5/12]÷[10/21]', '[9/10]÷[3/8]', '[14/15]÷[7/9]', '[11/12]÷[11/18]')]),
    ],
    't7': [
        ('운석 [3 1/3] g을 페트리 접시 한 개에 [5/6] g씩 나누어 담으려고 해요. 필요한 페트리 접시는 몇 개일까요? 칸의 크기를 같게 한 다음 덜어 내 보세요.',
         [_scoop('3 1/3', '5/6', unit=' g', aName='운석 [3 1/3] g', bName='접시 1개 [5/6] g',
                 ask=[['구하는 식: ', _c(['[5/6]÷[3 1/3]', '[3 1/3]÷[5/6]', '[3 1/3]×[5/6]'], 1)],
                      ['[3 1/3] = ', _qi(10, 3), ' = ', _qi(20, 6)],
                      ['필요한 페트리 접시는 ', _i(4), '개예요.']])]),
        ('하윤이와 재민이가 [3 3/4]÷[5/8]을 서로 다른 방법으로 계산했어요. 빈칸을 채워 보세요.',
         [_chain({'t': '하윤', 'p': ['[3 3/4]÷[5/8] = ', _qi(15, 4), '÷[5/8] = ', _qi(30, 8), '÷[5/8] = ', _i(30), '÷', _i(5), ' = ', _i(6)]},
                 {'t': '재민', 'p': ['[3 3/4]÷[5/8] = [15/4]÷[5/8] = [15/4]×', _qi(8, 5, True), ' = ', _i(6)]},
                 ['두 사람이 구한 몫은 ', _c(['같아요', '달라요'], 0), '.'])]),
        ('[3 1/2]÷[1 2/3]을 두 가지 방법으로 계산해 보세요.',
         [_chain({'t': '방법 1', 'p': ['[3 1/2]÷[1 2/3] = ', _qi(7, 2), '÷', _qi(5, 3), ' = ', _qi(21, 6), '÷', _qi(10, 6), ' = ', _i(21), '÷', _i(10), ' = ', _qi(21, 10), ' = ', _qm(Fraction(21, 10))]},
                 {'t': '방법 2', 'p': ['[3 1/2]÷[1 2/3] = [7/2]÷[5/3] = [7/2]×', _qi(3, 5, True), ' = ', _qi(21, 10), ' = ', _qm(Fraction(21, 10))]},
                 ['몫은 나누어지는 수 [3 1/2]보다 ', _c(['커요', '작아요'], 1), '.'])]),
        ('[2 1/4]÷[3/8]을 예로 (대분수)÷(분수)의 계산 방법을 정리해요.',
         [_blanks('[2 1/4]÷[3/8]은 먼저 [2 1/4]을 ', (['[9/4]', '[3/4]'], 0), '로 바꾸어요. 분수 부분만 나누어 2와 ([1/4]÷[3/8])로 계산하면 ',
                  (['틀려요', '맞아요'], 0), '.')]),
        ('편리한 방법을 골라 몫을 구해 보세요. 가분수와 대분수 어느 꼴로 써도 맞아요.',
         [_calc('[3 1/3]÷[5/9]', '[4 2/5]÷[1 1/10]', '[1 5/7]÷[2 2/3]', '[5 1/4]÷[2/3]')]),
    ],
    't89': [
        ('초록 가게에서는 감자 [3/4] kg을 1500원에, 싱싱 가게에서는 감자 [5/6] kg을 1800원에 팔아요. 어느 가게에서 감자를 사는 것이 더 저렴할까요?',
         [_quiz(('두 가게의 값만 보고 정할 수 없는 까닭은 무엇인가요?', ['감자의 양이 서로 달라서', '가게 이름이 달라서', '감자의 색이 달라서'], 0),
                ('비교하려면 무엇을 구하면 될까요?', ['두 가게 감자 값의 차', '두 가게 감자 1 kg의 가격', '두 가게 감자 양의 합'], 1))]),
        ('감자 1 kg의 가격을 구하는 식을 세워 보세요.',
         [_blanks('초록 가게 감자 1 kg의 가격: ', (['[3/4]÷1500', '1500÷[3/4]', '1500×[3/4]'], 1), ' / 싱싱 가게 감자 1 kg의 가격: ',
                  (['1800×[5/6]', '[5/6]÷1800', '1800÷[5/6]'], 2))]),
        ('두 그림에서 감자 1 kg의 가격을 구하고, 더 저렴한 가게를 골라 보세요.',
         [_double([{'Q': '1500', 'a': 3, 'b': 4, 'top': '원', 'bot': ' kg', 'name': '초록 가게 감자'},
                   {'Q': '1800', 'a': 5, 'b': 6, 'top': '원', 'bot': ' kg', 'name': '싱싱 가게 감자'}],
                  ask=[{'t': '초록', 'p': ['1500÷[3/4] = (1500÷', _i(3), ')×', _i(4), ' = ', _i(2000)]},
                       {'t': '싱싱', 'p': ['1800÷[5/6] = (1800÷', _i(5), ')×', _i(6), ' = ', _i(2160)]},
                       ['두 가게 가운데 ', _c(['초록 가게', '싱싱 가게'], 0), '의 감자가 1 kg에 더 싸요.']])]),
        ('달콤 가게에서는 양파 [5/7] kg을 1500원에, 새콤 가게에서는 양파 [7/9] kg을 1540원에 팔아요. 어느 가게에서 양파를 사는 것이 더 저렴할까요?',
         [_calc({'q': '달콤 가게 양파 1 kg의 가격', 'e': '1500÷[5/7]', 'unit': '원'}, {'q': '새콤 가게 양파 1 kg의 가격', 'e': '1540÷[7/9]', 'unit': '원'},
                {'q': '양파를 더 저렴하게 살 수 있는 가게는?', 'pick': ['달콤 가게', '새콤 가게'], 'a': 1})]),
        ('다른 방법으로 풀어 보고, 조건을 바꾸어 생각해 보세요.',
         [_quiz(('1500÷[3/4]를 자연수를 분수로 바꾸어 계산한 것으로 알맞은 것은?', ['1500×[3/4] = 1125', '[6000/4]÷[3/4] = 6000÷3 = 2000', '[3/4]÷1500 = [1/2000]'], 1),
                ('싱싱 가게가 감자 [5/6] kg을 1600원에 판다면 어느 가게가 더 저렴할까요?', ['초록 가게(1 kg에 2000원)', '싱싱 가게(1 kg에 1920원)'], 1))]),
    ],
    't10': [
        ('놀이 방법을 차례대로 늘어놓아 보세요. (문장을 바꾸어 썼어요.)',
         [{'w': 'sequence', 'args': [['모둠 친구들과 활동지를 바꾸어 보며 같은 나눗셈이 있는지, 계산이 옳은지에 따라 점수를 받아요.',
                                      '모둠이 보기에서 수 카드 세트 하나를 정해요.',
                                      '여섯 번의 점수를 모두 더해 가장 큰 사람이 이겨요.',
                                      '정한 수 카드를 한 장도 빠짐없이 한 번씩 써서 나만의 분수 나눗셈을 만들고 몫을 구해요.',
                                      '쓴 세트는 빼고 다른 세트로 다섯 번 더 해요.'], [1, 3, 0, 4, 2]]}]),
        ('수 카드 2, 3, 5, 9로 네 친구가 만든 활동지예요. 규칙에 따라 각 친구의 점수를 매겨 보세요. 규칙: 같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점 추가.',
         [_pick_scores([2, 3, 5, 9], [('가', (2, 3, 5, 9), '1 1/5'), ('나', (2, 3, 5, 9), '10/27'), ('다', (3, 5, 2, 9), '2 7/10'), ('라', (5, 9, 2, 3), '1 1/5')])]),
        ('나와 라의 계산이 왜 틀렸는지 살펴보고 바르게 고쳐 보세요.',
         [_chain(['나가 틀린 까닭: ', _c(['통분을 잘못했어요', '나누는 분수를 그대로 곱했어요'], 1)],
                 ['[2/3]÷[5/9] = [2/3]×', _qi(9, 5, True), ' = ', _qi(18, 15), ' = ', _qm(Fraction(6, 5))],
                 ['[5/9]÷[2/3] = [5/9]×', _qi(3, 2, True), ' = ', _qi(15, 18), ' = ', _qi(5, 6)])]),
        ('같은 수 카드 2, 3, 5, 9로 네 친구와 다른 나눗셈을 만들고, 몫이 가장 큰 나눗셈도 만들어 보세요. 친구들이 만든 나눗셈: [2/3]÷[5/9], [3/5]÷[2/9], [5/9]÷[2/3]',
         [{'w': 'fd6Build', 'args': [{'cards': [2, 3, 5, 9], 'boards': [
             {'shape': [[None, None], [None, None]], 'goal': 'max', 'label': '몫이 가장 큰 나눗셈'},
             {'shape': [[None, None], [None, None]], 'goal': 'any', 'avoid': ['2/3÷5/9', '3/5÷2/9', '5/9÷2/3'], 'label': '나만의 나눗셈'}]}]}]),
        ('새 수 카드 여섯 세트로 6회 놀이를 해요(세트와 친구 활동지는 이 활동지에서 정한 것이에요).',
         [{'w': 'fd6Game', 'args': [{'hard': 1, 'need': 4, 'sets': _game_sets([
             ([2, 5, 6, 11], []), ([3, 4, 7, 10], [('하윤', (3, 4, 7, 10), '1 1/14'), ('재민', (3, 4, 7, 10), '21/40'), ('소민', (4, 7, 3, 10), '1 19/21')]),
             ([5, 8, 9, 12], []), ([2, 9, 13, 15], []), ([3, 7, 11, 14], []), ([4, 5, 6, 17], [])])}]}]),
    ],
    't11': [
        ('[10/13]÷[2/13]를 띠에서 덜어 내 보고 계산해 보세요.',
         [_scoop('10/13', '2/13', ask=[['[10/13]÷[2/13] = ', _i(10), '÷', _i(2), ' = ', _i(5)]])]),
        ('몫을 구해 보세요. 약분하지 않은 분수, 가분수, 대분수 모두 맞아요.',
         [_calc('[4/9]÷[8/9]', '[7/8]÷[7/24]', '15÷[6/7]', '[2 2/5]÷[9/10]')]),
        ('나눗셈의 몫을 찾아 이어 보세요.',
         [_match([('[7/9]÷[1/9]', 1), ('[1 1/3]÷[1 1/9]', 2), ('[5/12]÷[5/18]', 3)],
                 [('[1 1/2]', 3), ('[1 1/3]', None), ('7', 1), ('[1 1/5]', 2)])]),
        ('굵기가 일정한 통나무 [3/4] m의 무게가 [5 1/4] kg이에요. 이 통나무 1 m의 무게는 몇 kg일까요? [1/4] m, 1 m일 때의 값을 그림에 써 본 다음 두 가지 방법으로 구해 보세요.',
         [_double([{'Q': '5 1/4', 'a': 3, 'b': 4, 'top': ' kg', 'bot': ' m', 'name': '통나무'}],
                  ask=[{'t': '방법 1', 'p': ['[5 1/4]÷[3/4] = ', _qi(21, 4), '÷[3/4] = ', _i(21), '÷', _i(3), ' = ', _i(7)]},
                       {'t': '방법 2', 'p': ['[5 1/4]÷[3/4] = [21/4]×', _qi(4, 3, True), ' = ', _i(7)]}])]),
        ('문제를 풀어 보세요.',
         [_calc({'q': '6÷[3/8] < □ 에서 □ 안에 들어갈 수 있는 가장 작은 자연수는?', 'x': '6÷[3/8]+1', 'lab': '□ ='},
                {'q': '가로 [5/6] m, 세로 [3/5] m인 직사각형 모양 게시판의 넓이는 몇 m²일까요?', 'x': '[5/6]×[3/5]', 'unit': 'm²', 'lab': '[5/6]×[3/5] ='},
                {'q': '이 게시판을 칠하는 데 페인트 [3/4] L를 사용했어요. 게시판 1 m²를 칠하는 데 필요한 페인트는 몇 L일까요?', 'x': '[3/4]÷[1/2]', 'unit': 'L', 'lab': '[3/4]÷[1/2] ='})]),
    ],
}

HARD_ST = {
    's1': [
        ('수련회 둘째 날 일정 쪽지가 새로 왔어요. 쪽지를 읽고, 세 칸에 내 생각을 써 보세요.',
         [{'w': 'note', 'args': ['📜 수련회 둘째 날 일정 쪽지', ['🍙 주먹밥: 밥 [5/6] kg을 주먹밥 하나에 [1/12] kg씩 뭉치기',
                                                        '🚣 카누: 호수 2 km를 [2/5]시간 동안 노 젓기',
                                                        '🧵 매듭 팔찌: 끈 9 m를 [3/4] m씩 자르기',
                                                        '🪣 물 양동이: 물 [2/3] L를 부었더니 양동이의 [4/9]만큼 찼어요']]},
          _panes(('보여요', '쪽지에서 ~ 같은 나눗셈이 보여요', '밥 [5/6] kg을 [1/12] kg씩 뭉치는 것처럼 분모가 다른 분수끼리 나누는 일이 보여요.'),
                 ('생각해요', '~은 ~보다 클 것 같아요', '카누가 1시간 동안 가는 거리는 2 km보다 클 것 같아요. [2/5]시간은 1시간보다 짧으니까요.'),
                 ('궁금해요', '~÷~은 어떻게 계산할까?', '분모가 다른 [5/6]÷[1/12]은 어떻게 계산할까?'))]),
        ('하람이네 모둠은 포도 주스 [8/9] L를 컵 하나에 [2/9] L씩 따르려고 해요. 몇 컵을 따를 수 있을까요? 띠에서 [2/9] L씩 덜어 내 보세요.',
         [_scoop('8/9', '2/9', unit=' L', aName='주스 [8/9] L', bName='컵 1개 [2/9] L',
                 askCalc=[{'lab': '따를 수 있는 컵', 'x': '[8/9]÷[2/9]', 'n': 4, 'unit': '컵'}]),
          _why('몫 4는 무엇을 뜻하는지 써 보세요.', '주스 [8/9] L에서 [2/9] L를 4번 덜어 낼 수 있다는 뜻이라서, 주스를 4컵 따를 수 있어요.')]),
        ('수련회 둘째 날에 나눗셈이 필요한 상황이에요. 알맞은 식을 골라 보세요. 나누는 순서에 주의해요.',
         [_quiz(('매듭 끈 [7/8] m를 [1/8] m씩 자르면 몇 도막이 될까요?', ['[1/8]÷[7/8]', '[7/8]−[1/8]', '[7/8]÷[1/8]'], 2),
                ('카누 가 팀은 [5/6] km, 나 팀은 [5/12] km를 저었어요. 나 팀이 저은 거리는 가 팀이 저은 거리의 몇 배일까요?', ['[5/6]÷[5/12]', '[5/12]÷[5/6]', '[5/12]×[5/6]'], 1),
                ('물 4 L를 병 하나에 [2/5] L씩 담으면 몇 병이 될까요?', ['4÷[2/5]', '[2/5]÷4', '4×[2/5]'], 0))]),
        ('통분과 (분수)×(분수)를 더 어려운 수로 떠올려요.',
         [_chain(['([3/8], [5/12])를 최소공배수로 통분하면 (', _qi(9, 24), ', ', _qi(10, 24), ')'],
                 ['([4/7], [2/3])를 통분하면 (', _qi(12, 21), ', ', _qi(14, 21), ')'],
                 ['[6/7]×[5/9] = ', {'q': [None, ['6', '×', '?5'], ['7', '×', '?9']]}, ' = ', _qi(10, 21, True)])]),
        ('(자연수)÷(자연수)와 (분수)÷(자연수)를 떠올려요. 대분수로도 나타내 보세요.',
         [_chain(['7÷9 = ', _qi(7, 9, True)],
                 ['13÷5 = ', _qi(13, 5), ' = ', _qm(Fraction(13, 5))],
                 ['[9/10]÷3 = ', {'q': [None, ['9', '÷', '?3'], '10']}, ' = ', _qi(3, 10)],
                 ['[5/6]÷4 = [5/6]×', _qi(1, 4, True), ' = ', _qi(5, 24)])]),
    ],
    's2': [
        ('민서는 찰흙 [10/11] kg을 친구 한 명에게 [2/11] kg씩 나누어 주려고 해요. 몇 명에게 줄 수 있을까요?',
         [_scoop('10/11', '2/11', unit=' kg', aName='찰흙 [10/11] kg', bName='한 명 [2/11] kg',
                 ask=[['구하는 식: ', _c(['[2/11]÷[10/11]', '[10/11]×[2/11]', '[10/11]÷[2/11]'], 2)],
                      ['[10/11] kg은 [2/11] kg이 ', _i(5), '개예요.'],
                      ['[10/11]÷[2/11] = ', _i(10), '÷', _i(2), ' = ', _i(5)],
                      ['찰흙을 ', _i(5), '명에게 나누어 줄 수 있어요.']])]),
        ('[15/16]÷[5/16]을 알아봐요. 먼저 분모가 어떻게 될지 예상한 다음, 띠에서 [5/16]씩 덜어 내 보세요.',
         [_rule('분모가 같은 분수끼리 나누면 분모는 몫에서 어떻게 될까요?', '분모가 같으면 같은 크기 조각끼리 나누는 것이라 분모는 몫에 남지 않아요. [15/16]÷[5/16] = 15÷5 = 3이에요.'),
          _scoop('15/16', '5/16', ask=[['[15/16]은 [5/16]이 ', _i(3), '개예요.'], ['[15/16]÷[5/16] = ', _i(15), '÷', _i(5), ' = ', _i(3)]])], '[15/16]÷[5/16]'),
        ('10조각 피자 가운데 9조각, 곧 [9/10]판이 남았어요. 한 사람에게 [3/10]판씩 나누어 주면 몇 명에게 줄 수 있을까요? 그림에 한 사람 몫씩 색을 바꾸어 칠해 보세요.',
         [{'w': 'fd6Pie', 'args': [{'A': '9/10', 'B': '3/10', 'cnt': '명', 'one': '사람', 'aName': '피자 [9/10]판', 'bName': '[3/10]판',
                                    'ask': [['식: [9/10]÷[3/10] = ', _i(3)],
                                            ['설명: [9/10]은 [1/10]이 ', _i(9), '개, [3/10]은 [1/10]이 ', _i(3), '개이므로 ', _c(['3명', '9명', '6명'], 0), '에게 줄 수 있어요.']]}]},
          _why('한 사람에게 [3/10]판이 아니라 [1/10]판씩 나누어 주면 몇 명에게 줄 수 있고, 몫은 어떻게 달라지나요?',
               '9명에게 줄 수 있어요. 한 사람 몫이 [3/10]판의 [1/3]로 작아지니 몫은 3배인 9가 돼요.')]),
        ('찰흙과 피자에서 찾은 계산 방법을 다른 말로 정리해요.',
         [_blanks('[10/17]÷[2/17]의 몫은 ', (['10÷2', '17÷17', '10×2'], 0), '와 같아요. 분모가 같은 두 분수는 같은 크기 조각의 ',
                  (['개수', '크기'], 0), '로 나타나므로 ', (['분자', '분모'], 0), '끼리 나누어요.')]),
        ('계산해 보세요. 마지막 문제는 식을 세워 풀어요.',
         [_calc('[16/17]÷[4/17]', '[21/23]÷[7/23]', '[18/25]÷[2/25]', '[12/19]÷[6/19]',
                {'q': '하람이는 리본 [14/15] m를 [2/15] m씩 잘라 이름표를 꾸며요. 이름표를 몇 개 꾸밀 수 있을까요?', 'x': '[14/15]÷[2/15]', 'unit': '개', 'lab': '[14/15]÷[2/15] ='})]),
    ],
    's3': [
        ('도현이네 모둠이 레모네이드 [9/11] L를 만들었어요. 들이가 [4/11] L인 컵에 모두 옮겨 담으면 몇 컵이 될까요?',
         [_scoop('9/11', '4/11', unit=' L', aName='레모네이드 [9/11] L', bName='컵 1개 [4/11] L',
                 ask=[['구하는 식: ', _c(['[4/11]÷[9/11]', '[9/11]÷[4/11]', '[9/11]×[4/11]'], 1)],
                      ['', _i(2), '컵과 1컵의 ', _qi(1, 4, True), '만큼이 돼요.'],
                      ['[9/11]÷[4/11] = ', _qm(Fraction(9, 4))]])]),
        ('[13/14]÷[5/14]을 알아봐요. [5/14]씩 묶고, 남는 부분이 한 묶음의 얼마만큼인지 살펴보세요.',
         [_scoop('13/14', '5/14', ask=[['[13/14]은 [5/14]씩 ', _i(2), '번 묶을 수 있고, 남는 부분은 [5/14]의 ', _qi(3, 5, True), '이에요.'],
                                       ['[13/14]÷[5/14] = ', _i(13), '÷', _i(5), ' = ', _qi(13, 5), ' = ', _qm(Fraction(13, 5))]]),
          _why('[2 3/5]에서 자연수 2와 분수 [3/5]은 각각 무엇을 뜻하나요?',
               '2는 [5/14]씩 2번 덜어 낼 수 있다는 뜻이고, [3/5]은 남은 [3/14]이 한 묶음 [5/14]의 [3/5]만큼이라는 뜻이에요.')]),
        ('[5/9]÷[8/9]처럼 나누는 수가 더 크면 몫은 어떻게 될까요? 띠에서 덜어 내 보세요.',
         [_scoop('5/9', '8/9', ask=[['[5/9]÷[8/9] = ', _i(5), '÷', _i(8), ' = ', _qi(5, 8)],
                                    ['나누는 수가 나누어지는 수보다 크면 몫은 ', _c(['1보다 커요', '1보다 작아요'], 1), '.']]),
          _why('[5/9]÷[8/9]과 [8/9]÷[5/9]의 몫을 견주어 써 보세요.', '[5/9]÷[8/9] = [5/8]은 1보다 작고, [8/9]÷[5/9] = [8/5]은 1보다 커요. 두 몫은 분자와 분모가 서로 바뀐 수예요.')]),
        ('나누어떨어지지 않는 (분수)÷(분수)를 다른 말로 정리해요.',
         [_blanks('[■/●]÷[▲/●]의 몫 ■÷▲가 나누어떨어지지 않으면 ', (['[■/▲]', '[▲/■]'], 0), '처럼 분수로 나타내고, 가분수이면 ',
                  (['대분수', '소수'], 0), '로 바꾸어 나타낼 수도 있어요. ■가 ▲보다 작으면 몫은 ', (['1보다 작아요', '1보다 커요'], 0), '.')]),
        ('몫을 구해 보세요. 가분수와 대분수 어느 꼴로 써도 맞아요.',
         [_calc('[4/11]÷[9/11]', '[7/15]÷[11/15]', '[13/16]÷[5/16]', '[19/20]÷[7/20]',
                {'q': '모둠 요리에 밀가루 [13/15] kg이 있어요. 반죽 한 번에 [4/15] kg씩 쓰면 반죽 몇 번 할 양인가요?', 'x': '[13/15]÷[4/15]', 'unit': '번', 'lab': '[13/15]÷[4/15] ='})]),
    ],
    's4': [
        ('솔숲 길은 [3/4] km, 개울 길은 [1/8] km예요. 솔숲 길은 개울 길의 몇 배일까요? 칸 크기를 같게 한 다음 덜어 내 보세요.',
         [_scoop('3/4', '1/8', unit=' km', aName='솔숲 길 [3/4] km', bName='개울 길 [1/8] km',
                 ask=[['구하는 식: ', _c(['[1/8]÷[3/4]', '[3/4]×[1/8]', '[3/4]÷[1/8]'], 2)],
                      ['[3/4] = ', _qi(6, 8), '이고, [6/8]은 [1/8]이 ', _i(6), '개예요.'],
                      ['[3/4]÷[1/8] = ', _i(6)],
                      ['솔숲 길은 개울 길의 ', _i(6), '배예요.']])]),
        ('[5/6]÷[3/4]을 알아봐요. 먼저 통분하는 수를 예상한 다음, 두 띠의 한 칸이 같은 크기가 되게 나누고 덜어 내 보세요.',
         [_rule('분모가 다른 분수끼리 나눌 때 분모의 곱으로 통분해도 될까요?', '분모의 곱(24)으로 통분해도 되고 최소공배수(12)로 통분해도 몫은 같아요. [5/6]÷[3/4] = [10/12]÷[9/12] = [10/9]예요.'),
          _scoop('5/6', '3/4', ask=[['[5/6]÷[3/4] = ', _qi(10, 12), '÷', _qi(9, 12), ' = ', _i(10), '÷', _i(9), ' = ', _qi(10, 9, True), ' = ', _qm(Fraction(10, 9))]])], '[5/6]÷[3/4]'),
        ('보기의 분수에서 서로 다른 두 개를 골라 넣어 문제를 만들고 답을 구해 보세요. 짝과 문제를 바꾸어 풀어도 좋아요.',
         [{'w': 'fd6Pose', 'args': [{'fr': ['2/3', '4/5', '5/8', '3/10'], 's': ['주전자에 식혜가 ', ' L, 컵에 수정과가 ', ' L 있어요. 식혜의 양은 수정과의 양의 몇 배인가요?'],
                                     'ansLab': '답:', 'unit': '배'}]},
          _why('내가 만든 문제의 몫이 1보다 큰지 작은지 계산하기 전에 어떻게 알 수 있을까요?',
               '나누어지는 수가 나누는 수보다 크면 몫이 1보다 크고, 작으면 1보다 작아요. 예를 들어 [4/5]÷[2/3]은 [4/5]가 더 커서 몫이 1보다 커요.')]),
        ('[3/7]÷[2/3]을 예로 분모가 다른 (분수)÷(분수)의 계산 방법을 정리해요.',
         [_blanks('[3/7]÷[2/3]는 분모 7과 3의 ', (['최소공배수', '최대공약수'], 0), '인 21로 통분하여 [9/21]÷[14/21]로 바꾸고, ', (['9÷14', '21÷21'], 0),
                  '를 계산해요. 그래서 몫은 ', (['[9/14]', '[14/9]'], 0), '이에요.')]),
        ('몫을 구해 보세요. 약분하지 않은 분수, 가분수, 대분수 모두 맞아요.',
         [_calc('[7/10]÷[7/30]', '[5/9]÷[1/6]', '[3/8]÷[5/6]', '[11/12]÷[2/3]',
                {'q': '물길은 [9/10] km, 솔숲 길은 [3/5] km예요. 물길은 솔숲 길의 몇 배일까요?', 'x': '[9/10]÷[3/5]', 'unit': '배', 'lab': '[9/10]÷[3/5] ='})]),
    ],
    's5': [
        ('수련원에서 돌아오는 버스가 일정한 빠르기로 56 km를 가는 데 [7/8]시간이 걸렸어요. 같은 빠르기로 1시간 동안 몇 km를 갈 수 있을까요? 아래 그림에서 [1/8]시간, 1시간일 때의 양을 차례로 구해 보세요.',
         [_double([{'Q': '56', 'a': 7, 'b': 8, 'top': ' km', 'bot': '시간', 'name': '돌아오는 버스'}],
                  est={'q': '56 km를 가는 데 7시간이 걸렸다면 1시간 동안 몇 km를 갈까요?', 'o': ['392 km', '8 km', '63 km'], 'a': 1},
                  ask=[['구하는 식: ', _c(['56×[7/8]', '56÷[7/8]', '[7/8]÷56'], 1)],
                       ['[1/8]시간 동안: 56÷', _i(7), ' = ', _i(8), ' (km)'],
                       ['1시간 동안: 8×', _i(8), ' = ', _i(64), ' (km)']]),
          _why('버스가 56 km를 [7/4]시간 동안 갔다면 1시간 동안 가는 거리는 64 km보다 길까요, 짧을까요? 까닭도 써 보세요.',
               '짧아요. [7/4]시간은 1시간보다 길어서 1시간 동안은 56 km보다 짧은 56÷[7/4] = 32(km)를 가요.')]),
        ('20÷[4/9]을 두 가지 방법으로 계산해 보세요.',
         [_chain({'t': '분자로 나누고 분모 곱하기', 'p': ['20÷[4/9] = (20÷', _i(4), ')×', _i(9), ' = ', _i(45)]},
                 {'t': '분수로 바꾸기', 'p': ['20÷[4/9] = ', _qi(180, 9), '÷[4/9] = ', _i(180), '÷', _i(4), ' = ', _i(45)]},
                 ['두 방법으로 구한 몫은 ', _c(['달라요', '같아요'], 1), '.'])]),
        ('지안이는 끈 6 m를 [3/5] m씩 잘라 팔찌를 만들려고 해요. 1 m를 똑같이 나누어 [3/5] m씩 덜어 내 보고, 팔찌를 몇 개 만들 수 있는지 구해 보세요.',
         [_scoop('6', '3/5', unit=' m', aName='끈 6 m', bName='팔찌 1개 [3/5] m',
                 ask=[['6÷[3/5] = (6÷', _i(3), ')×', _i(5), ' = ', _i(10)], ['팔찌를 ', _i(10), '개 만들 수 있어요.']])]),
        ('14÷[2/5]을 예로 (자연수)÷(분수)의 계산 방법을 정리해요.',
         [_blanks('14÷[2/5]은 (14÷', (['2', '5'], 0), ')×', (['2', '5'], 1), '로 계산하거나, 14를 ', (['[70/5]', '[14/5]'], 0), '로 바꾸어 70÷2로 계산해요.')]),
        ('계산해 보세요. 몫이 자연수가 아닌 것도 있어요.',
         [_calc('9÷[3/8]', '8÷[4/11]', '21÷[7/9]', '7÷[2/3]',
                {'q': '물 4 L를 한 컵에 [2/9] L씩 나누어 담으면 몇 컵이 될까요?', 'x': '4÷[2/9]', 'unit': '컵', 'lab': '4÷[2/9] ='})]),
    ],
    's6': [
        ('서준이가 빈 물통에 보리차 [4/5] L를 부었더니 물통의 [2/7]만큼 찼어요. 물통을 가득 채우려면 보리차가 몇 L 필요할까요? 아래 그림에서 물통의 [1/7], 물통 1개일 때의 양을 차례로 구해 보세요.',
         [_double([{'Q': '4/5', 'a': 2, 'b': 7, 'top': ' L', 'bot': '물통', 'pre': '물통', 'name': '보리차'}],
                  ask=[['구하는 식: ', _c(['[2/7]÷[4/5]', '[4/5]×[2/7]', '[4/5]÷[2/7]'], 2)],
                       ['물통의 [1/7]만큼: [4/5]÷', _i(2), ' = ', _qi(2, 5), ' (L)'],
                       ['물통 가득: [2/5]×', _i(7), ' = ', _qi(14, 5), ' = ', _qm(Fraction(14, 5)), ' (L)']])]),
        ('그림에서 한 계산을 이어서 [4/5]÷[2/7]을 분수의 곱셈으로 나타내 보세요. 먼저 규칙을 예상해 봐요.',
         [_rule('÷[2/7]을 곱셈으로 바꾸면 어떤 수를 곱하게 될지 예상해 봐요.', '×[7/2]을 해요. ÷2를 하고 ×7을 하는 것과 같기 때문이에요.'),
          _chain(['[4/5]÷[2/7] = [4/5]÷', _i(2), '×', _i(7), ' = [4/5]×', _qi(1, 2, True), '×7 = [4/5]×', _qi(7, 2, True), ' = ', _qi(28, 10), ' = ', _qm(Fraction(14, 5))],
                 ['÷[2/7]은 ×', _c(['[2/7]', '[7/2]'], 1), '로 바꾸어 계산할 수 있어요.'])]),
        ('나눗셈을 곱셈으로 바꾸어 계산해 보세요. 약분을 먼저 하면 편리해요.',
         [{'w': 'fd6Flip', 'args': [{'rows': [{'A': '8/9', 'B': '4/15'}, {'A': '3/10', 'B': '9/20'}, {'A': '7/12', 'B': '5/8'}]}]},
          _why('[8/9]÷[4/15]을 곱셈으로 바꾸어 계산할 때 약분을 먼저 하면 좋은 점을 써 보세요.',
               '[8/9]×[15/4]에서 8과 4, 9와 15를 먼저 약분하면 2×[5/3]처럼 수가 작아져 계산이 쉬워요.')]),
        ('곱셈으로 바꾸는 방법을 다른 수로 정리해요.',
         [_blanks('÷[5/8]은 ×', (['[8/5]', '[5/8]'], 0), '와 같고, ÷4는 ×', (['[1/4]', '4'], 0), '와 같아요. 곱셈으로 바꿀 때 ',
                  (['나누는 수', '나누어지는 수'], 0), '만 분자와 분모를 바꾸어요.')]),
        ('분수의 곱셈으로 나타내어 계산해 보세요. 약분할 수 있으면 먼저 약분해요.',
         [_calc('[3/8]÷[9/16]', '[7/9]÷[14/27]', '[5/6]÷[10/21]', '[2/3]÷[8/9]')]),
    ],
    's7': [
        ('쿠키 반죽 [3 3/4] kg을 한 판에 [5/8] kg씩 나누어 구우려고 해요. 몇 판을 구울 수 있을까요? 칸의 크기를 같게 한 다음 덜어 내 보세요.',
         [_scoop('3 3/4', '5/8', unit=' kg', aName='반죽 [3 3/4] kg', bName='한 판 [5/8] kg',
                 ask=[['구하는 식: ', _c(['[5/8]÷[3 3/4]', '[3 3/4]×[5/8]', '[3 3/4]÷[5/8]'], 2)],
                      ['[3 3/4] = ', _qi(15, 4), ' = ', _qi(30, 8)],
                      ['쿠키를 ', _i(6), '판 구울 수 있어요.']])]),
        ('서준이와 지안이가 [1 4/5]÷[3/10]을 서로 다른 방법으로 계산했어요. 빈칸을 채워 보세요.',
         [_chain({'t': '서준', 'p': ['[1 4/5]÷[3/10] = ', _qi(9, 5), '÷[3/10] = ', _qi(18, 10), '÷[3/10] = ', _i(18), '÷', _i(3), ' = ', _i(6)]},
                 {'t': '지안', 'p': ['[1 4/5]÷[3/10] = [9/5]÷[3/10] = [9/5]×', _qi(10, 3, True), ' = ', _i(6)]}),
          _why('몫 6이 맞는지 곱셈으로 확인하는 방법을 써 보세요.', '몫 6에 나누는 수 [3/10]을 곱하면 [18/10] = [1 4/5]이 되니 맞아요.')]),
        ('쿠키에 넣을 건포도 [2 1/4]컵은 땅콩 [1 1/2]컵의 몇 배일까요? [2 1/4]÷[1 1/2]을 두 가지 방법으로 계산해 보세요.',
         [_chain({'t': '방법 1', 'p': ['[2 1/4]÷[1 1/2] = ', _qi(9, 4), '÷', _qi(3, 2), ' = ', _qi(9, 4), '÷', _qi(6, 4), ' = ', _i(9), '÷', _i(6), ' = ', _qi(9, 6), ' = ', _qm(Fraction(3, 2))]},
                 {'t': '방법 2', 'p': ['[2 1/4]÷[1 1/2] = [9/4]÷[3/2] = [9/4]×', _qi(2, 3, True), ' = ', _qi(18, 12), ' = ', _qm(Fraction(3, 2))]}),
          _why('몫 [1 1/2]은 무엇을 뜻하는지 써 보세요.', '건포도의 양이 땅콩의 [1 1/2]배, 곧 땅콩 한 컵 반만큼이라는 뜻이에요.')]),
        ('[3 1/3]÷[2/9]를 예로 (대분수)÷(분수)의 계산 방법을 정리해요.',
         [_blanks('[3 1/3]÷[2/9]는 [3 1/3]을 ', (['[10/3]', '[1/3]'], 0), '로 바꾼 다음 통분하여 분자끼리 나누거나 ×', (['[9/2]', '[2/9]'], 0), '를 하여 계산해요.')]),
        ('편리한 방법을 골라 몫을 구해 보세요. 가분수와 대분수 어느 꼴로 써도 맞아요.',
         [_calc('[2 1/7]÷[5/14]', '[1 1/8]÷[3/4]', '[4 1/2]÷[2 2/5]', '[2 4/5]÷[1 3/4]')]),
    ],
    's8': [
        ('햇살 마트에서는 견과 [2/5] kg을 3600원에, 바람 마트에서는 견과 [3/4] kg을 6600원에 팔아요. 어느 마트에서 사는 것이 더 저렴할까요?',
         [_quiz(('값이 더 싼 햇살 마트에서 사면 된다는 말이 맞지 않을 수 있는 까닭은?', ['두 마트의 견과 양이 달라서', '두 마트의 이름이 달라서', '견과의 종류가 같아서'], 0),
                ('같은 양으로 견주려면 무엇을 구할까요?', ['두 마트 견과 값의 합', '두 마트 견과 1 kg의 가격', '두 마트 견과 양의 차'], 1))]),
        ('견과 1 kg의 가격을 구하는 식을 세워 보세요.',
         [_blanks('햇살 마트: ', (['3600×[2/5]', '[2/5]÷3600', '3600÷[2/5]'], 2), ' / 바람 마트: ', (['6600÷[3/4]', '6600×[3/4]', '[3/4]÷6600'], 0)),
          _why('[2/5] kg이 3600원이면 [1/5] kg의 값은 얼마이고, 어떻게 구하나요?', '3600÷2 = 1800(원)이에요. [2/5] kg은 [1/5] kg이 2개이기 때문이에요.')]),
        ('두 그림에 [1/5] kg, [1/4] kg, 1 kg일 때의 값을 차례로 구해 쓰고, 견과를 더 싸게 파는 마트를 골라 보세요.',
         [_double([{'Q': '3600', 'a': 2, 'b': 5, 'top': '원', 'bot': ' kg', 'name': '햇살 마트 견과'},
                   {'Q': '6600', 'a': 3, 'b': 4, 'top': '원', 'bot': ' kg', 'name': '바람 마트 견과'}],
                  ask=[{'t': '햇살', 'p': ['3600÷[2/5] = (3600÷', _i(2), ')×', _i(5), ' = ', _i(9000)]},
                       {'t': '바람', 'p': ['6600÷[3/4] = (6600÷', _i(3), ')×', _i(4), ' = ', _i(8800)]},
                       ['두 마트 가운데 ', _c(['햇살 마트', '바람 마트'], 1), '의 견과가 1 kg에 더 싸요.']])]),
        ('사과도 사야 해요. 햇살 마트에서는 사과 [3/4] kg을 2700원에, 바람 마트에서는 사과 [5/8] kg을 2400원에 팔아요. 어느 마트에서 사는 것이 더 저렴할까요?',
         [_calc({'q': '햇살 마트 사과 1 kg의 가격', 'e': '2700÷[3/4]', 'unit': '원'}, {'q': '바람 마트 사과 1 kg의 가격', 'e': '2400÷[5/8]', 'unit': '원'},
                {'q': '사과를 더 저렴하게 살 수 있는 마트는?', 'pick': ['햇살 마트', '바람 마트'], 'a': 0})]),
        ('다른 방법으로 풀어 보고, 조건을 바꾸어 생각해 보세요.',
         [_write(('다른 방법', '6600÷[3/4]을 6600을 분모가 4인 분수로 바꾸어 계산해 보세요.', '6600을 [26400/4]로 바꾸면 [26400/4]÷[3/4] = 26400÷3 = 8800이에요.'),
                 ('조건 바꾸기', '바람 마트가 견과 [3/4] kg을 6900원에 판다면 어느 마트가 더 저렴한지 써 보세요.', '6900÷[3/4] = 9200(원)이라서 1 kg에 9000원인 햇살 마트가 더 저렴해요.'))]),
    ],
    's9': [
        ('둘째 날 일정 쪽지의 나눗셈 문제를 무엇을 구하는지에 따라 나누어 보세요.',
         [_sort(['몇 배일까요', '몇 번 덜어 낼까요', '1만큼은 얼마일까요'],
                [('매듭 끈 9 m를 [3/4] m씩 자르면 몇 도막?', 1), ('밥 [5/6] kg을 [1/12] kg씩 뭉치면 주먹밥 몇 개?', 1),
                 ('가 팀 [5/6] km는 나 팀 [5/12] km의 몇 배?', 0), ('물 [3/5] L는 주스 [9/10] L의 몇 배?', 0),
                 ('2 km를 [2/5]시간에 → 1시간에 몇 km?', 2), ('물 [2/3] L로 양동이의 [4/9]가 참 → 양동이 가득은?', 2)]),
          _why('‘1만큼은 얼마일까요’ 상황에서 나누는 수는 무엇을 나타내나요?',
               '전체(1)의 얼마만큼인지를 나타내요. 양동이의 [4/9]만큼이 [2/3] L이면 [2/3]÷[4/9] = [1 1/2]로 양동이 가득의 양을 구해요.')]),
        ('몫이 나누어지는 수보다 큰지 작은지 먼저 예상한 다음, 나누어 보세요.',
         [_rule('몫이 나누어지는 수와 같아지는 것은 나누는 수가 얼마일 때일까요?', '나누는 수가 1일 때 몫이 나누어지는 수와 같아요. 1보다 작으면 몫이 커지고, 1보다 크면 몫이 작아져요.'),
          _sort(['나누어지는 수보다 작은 몫', '나누어지는 수보다 큰 몫'],
                [('[5/8]÷[5/6]', 1), ('9÷[3/4]', 1), ('[3/10]÷[1/5]', 1), ('[7/9]÷3', 0), ('[2/5]÷[1 1/3]', 0), ('[1 1/2]÷[1 1/4]', 0)])]),
        ('[7/10]÷[4/15]를 통분하는 방법과 곱셈으로 바꾸는 방법으로 계산하고, 어떤 방법이 편리한지 이야기해 보세요.',
         [_chain({'t': '통분하기', 'p': ['[7/10]÷[4/15] = ', _qi(21, 30), '÷', _qi(8, 30), ' = ', _i(21), '÷', _i(8), ' = ', _qi(21, 8), ' = ', _qm(Fraction(21, 8))]},
                 {'t': '곱셈으로', 'p': ['[7/10]÷[4/15] = [7/10]×', _qi(15, 4, True), ' = ', _qi(105, 40), ' = ', _qm(Fraction(21, 8))]}),
          _why('곱셈 방법에서 약분을 먼저 하면 어떤 점이 좋은지 써 보세요.', '10과 15를 5로 약분하면 [7/2]×[3/4] = [21/8]처럼 작은 수로 계산할 수 있어 편리해요.')]),
        ('수련회 보고서에 분수의 나눗셈 계산 방법을 예와 함께 정리해요.',
         [_blanks('[5/9]÷[2/9]처럼 분모가 같으면 ', (['5÷2', '9÷9'], 0), '로 계산하고, [3/4]÷[2/5]처럼 분모가 다르면 통분하거나 [3/4]×',
                  (['[5/2]', '[2/5]'], 0), '로 계산해요. [1 1/2]÷[3/4]은 먼저 [1 1/2]을 ', (['[3/2]', '[1/2]'], 0), '로 바꾸어요.')]),
        ('나눗셈의 몫을 찾아 이은 다음, 보고서에 한 줄 정리를 써 보세요.',
         [_match([('[9/10]÷[3/10]', 1), ('[1 1/4]÷[5/6]', 2), ('[4/9]÷[2/3]', 3)],
                 [('[2/3]', 3), ('3', 1), ('[1 1/3]', None), ('[1 1/2]', 2)]),
          _write(('한 줄 정리', '몫이 나누어지는 수보다 커지는 때는 언제인지 한 줄로 정리해 보세요.', '나누는 수가 1보다 작으면 몫이 나누어지는 수보다 커져요. 예를 들어 [3/4]÷[1/2] = [1 1/2]이에요.'))]),
    ],
    's10': [
        ('캠프파이어 앞에서 ‘다를까요, 같을까요’ 수 카드 놀이를 해요. 놀이 방법을 차례대로 늘어놓아 보세요. (문장을 바꾸어 썼어요.)',
         [{'w': 'sequence', 'args': [['친구들과 활동지를 바꾸어 보며 같은 나눗셈이 있는지, 몫이 맞는지 보고 점수를 받아요.',
                                      '모둠 친구들과 함께 쓸 수 카드 4장을 골라요.',
                                      '네 판의 점수를 모두 더해 가장 큰 사람이 이겨요.',
                                      '고른 수 카드를 한 장도 빠짐없이 써서 나만의 분수 나눗셈을 만들고 몫을 구해요.'], [1, 3, 0, 2]]}]),
        ('수 카드 3, 4, 7, 9로 네 친구가 만든 활동지예요. 규칙에 따라 각 친구의 점수를 매겨 보세요. 규칙: 같은 나눗셈이 없으면 2점, 있으면 1점, 옳게 계산하면 1점 추가.',
         [_pick_scores([3, 4, 7, 9], [('서준', (3, 4, 7, 9), '27/28'), ('지안', (3, 4, 7, 9), '7/12'), ('하람', (4, 7, 3, 9), '1 5/7'), ('도현', (7, 9, 3, 4), '7/12')])]),
        ('지안이와 도현이의 계산이 왜 틀렸는지 살펴보고 바르게 고쳐 보세요.',
         [_chain(['두 친구가 틀린 까닭: ', _c(['통분을 잘못했어요', '나누는 분수를 그대로 곱했어요'], 1)],
                 ['[3/4]÷[7/9] = [3/4]×', _qi(9, 7, True), ' = ', _qi(27, 28)],
                 ['[7/9]÷[3/4] = [7/9]×', _qi(4, 3, True), ' = ', _qi(28, 27), ' = ', _qm(Fraction(28, 27))])]),
        ('같은 수 카드 3, 4, 7, 9로 몫이 가장 작은 나눗셈과, 네 친구와 다른 나눗셈을 만들어 보세요. 친구들이 만든 나눗셈: [3/4]÷[7/9], [4/7]÷[3/9], [7/9]÷[3/4]',
         [{'w': 'fd6Build', 'args': [{'cards': [3, 4, 7, 9], 'boards': [
             {'shape': [[None, None], [None, None]], 'goal': 'min', 'label': '몫이 가장 작은 나눗셈'},
             {'shape': [[None, None], [None, None]], 'goal': 'any', 'avoid': ['3/4÷7/9', '4/7÷3/9', '7/9÷3/4'], 'label': '나만의 나눗셈'}]}]},
          _why('몫이 가장 작은 나눗셈을 만들려면 카드를 어떻게 놓아야 하는지 써 보세요.',
               '나누어지는 수는 작게(분자에 작은 수, 분모에 큰 수), 나누는 수는 크게(분자에 큰 수, 분모에 작은 수) 놓아요.')]),
        ('새 수 카드로 캠프파이어 놀이를 4판 해요(수 카드와 친구 활동지는 이 활동지에서 정한 것이에요). 4판 중 3판 이상 옳게 계산하면 통과예요.',
         [{'w': 'fd6Game', 'args': [{'hard': 1, 'need': 3, 'sets': _game_sets([
             ([3, 4, 7, 9], []), ([2, 5, 8, 9], [('서준', (2, 5, 8, 9), '9/20'), ('지안', (5, 8, 2, 9), '2 13/16'), ('하람', (2, 5, 8, 9), '16/45')]),
             ([4, 5, 8, 11], []), ([3, 7, 10, 12], [])])}]}]),
    ],
    's11': [
        ('수련회 발표회 첫 순서예요. [14/15]÷[7/15]을 띠에서 덜어 내 보고 계산해 보세요.',
         [_scoop('14/15', '7/15', ask=[['[14/15]÷[7/15] = ', _i(14), '÷', _i(7), ' = ', _i(2)]])]),
        ('몫을 구해 보세요. 약분하지 않은 분수, 가분수, 대분수 모두 맞아요.',
         [_calc('[7/11]÷[10/11]', '[5/9]÷[5/27]', '16÷[6/7]', '[3 1/3]÷[5/12]')]),
        ('굵기가 일정한 장작 [5/6] m의 무게가 [3 1/3] kg이에요. 이 장작 1 m의 무게는 몇 kg일까요? [1/6] m, 1 m일 때의 값을 그림에 써 본 다음 두 가지 방법으로 구해 보세요.',
         [_double([{'Q': '3 1/3', 'a': 5, 'b': 6, 'top': ' kg', 'bot': ' m', 'name': '장작'}],
                  ask=[{'t': '방법 1', 'p': ['[3 1/3]÷[5/6] = ', _qi(10, 3), '÷[5/6] = ', _qi(20, 6), '÷[5/6] = ', _i(20), '÷', _i(5), ' = ', _i(4)]},
                       {'t': '방법 2', 'p': ['[3 1/3]÷[5/6] = [10/3]×', _qi(6, 5, True), ' = ', _qi(60, 15), ' = ', _i(4)]}])]),
        ('도현이가 [3 1/2]÷[7/8]을 계산했는데 답이 이상해요. 도현이의 계산: [3 1/2]÷[7/8] = 3과 ([1/2]÷[7/8]) = [3 4/7] 잘못된 까닭을 고르고 옳게 계산해 보세요.',
         [_chain(['까닭: ', _c(['나누는 분수를 그대로 곱했어요', '대분수를 가분수로 바꾸지 않고 진분수 부분만 나누었어요'], 1)],
                 {'t': '옳은 계산', 'p': ['[3 1/2]÷[7/8] = ', _qi(28, 8), '÷[7/8] = ', _i(28), '÷', _i(7), ' = ', _i(4)]}),
          _write(('확인하는 말', '구한 몫이 맞는지 곱셈으로 확인하는 방법을 도현이에게 알려 주는 말을 써 보세요.', '도현아, 몫 4에 나누는 수 [7/8]을 곱하면 [28/8] = [3 1/2]이 되니까 4가 맞아.'))]),
        ('1차시에 쓴 ‘궁금해요’ 칸을 떠올리며, 이 단원에서 생각이 어떻게 달라졌는지 세 칸에 써 보세요.',
         [_panes(('예전 생각', '처음에는 분수로 나누면 ~라고 생각했어요', '처음에는 나누면 몫이 항상 작아진다고 생각했어요.'),
                 ('지금 생각', '이제는 ~라는 것을 알아요', '이제는 1보다 작은 분수로 나누면 몫이 커진다는 것을 알아요.'),
                 ('왜 바뀌었나', '~을 계산해 보고 생각이 바뀌었어요', '56÷[7/8] = 64를 계산해 보고 생각이 바뀌었어요.'))]),
    ],
}


def build_file(kind, lv):
    src = SRC_TB if kind == 'tb' else SRC_ST
    D = cap(src)
    if kind == 'st':
        ids = [L['id'] for L in D['lessons']]
        assert ids == ST_IDS, ('이야기 버전 차시가 바뀌었어요 — ST_IDS·WHY_ST를 고치세요', ids)
    DATA.clear()
    DATA.update(D)
    label = '교과서 차시' if kind == 'tb' else '이야기 버전'
    s = Sheet(unit_label='6-2 수학 %s(%s)' % (UNIT_NAME, label), level=lv, grade_label='6학년')
    if kind == 'tb':
        lines = [tb_lesson(s, lv, L, i == 0, D.get('story')) for i, L in enumerate(D['lessons'])]
    else:
        lines = [f(s, lv) for f in ST]
    s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT_NAME, label, lv), lines,
              note='※ 이 활동지는 앱 u1-fracdiv.html과 차시 번호가 같습니다. 정답의 ‘2 1/4’은 대분수 2와 4분의 1, ‘9/4’는 가분수 4분의 9를 뜻해요. '
                   '(=…)는 같은 값의 가분수예요. 몫은 약분하지 않은 분수, 가분수, 대분수로 써도 값이 같으면 맞아요.')
    outdir = OUT_TB if kind == 'tb' else OUT_ST
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, NAME % lv)
    s.save(path)
    return path


def main():
    want = sys.argv[1:] or ['tb', 'st']
    kinds = []
    if 'tb' in want:
        kinds.append('tb')
    if 'st' in want:
        if ST and os.path.exists(SRC_ST):
            kinds.append('st')
        else:
            print('이야기 버전은 아직 없어 건너뜁니다.')
    out = []
    try:
        for kind in kinds:
            for lv in ('기본형', '도전형'):
                out.append(build_file(kind, lv))
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
