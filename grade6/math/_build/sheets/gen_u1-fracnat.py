# -*- coding: utf-8 -*-
"""6-1 수학 1. 분수의 나눗셈(나누는 수가 자연수) 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u1-fracnat.py            # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u1-fracnat.py tb         # 교과서 차시 버전만

앱 원본 ../units/u1-fracnat.tb.js('생태 도시 푸름시 분수의 나눗셈', 9차시: 1·2·3·4·5·6·7~8·9·10)의
LESSONS를 node에서 그대로 실행해(활동 함수 대신 기록하는 함수를 넣어 render를 부름) 활동마다 넘긴 설정
(물음·보기·정답·식·빈칸·띠와 넓이 모델의 수·수 카드·놀이 카드)을 모읍니다(CAP_JS). 그래서 차시 번호·제목·S.O.O.P.·
탐구 질문·이야기·수가 앱과 같고, 원본의 수가 바뀌면 활동지도 저절로 따라 바뀝니다. 정답은 모두 이 스크립트가
분수(Fraction)로 다시 계산해 앱의 답과 같은지 assert로 확인합니다.

이야기 버전 ../units/u1-fracnat.st.js('6학년 3반 나눔 빵 공방', 10차시)도 같은 방법으로 읽어 sem1-soop/sheets/에
같은 이름으로 만듭니다(python3 gen_u1-fracnat.py st). 이야기 엔진 부품(panes·thenWhy·ruleFirst·wonderRecall·writeStep)과
공방 그림·준비 쪽지·상자 그림·상자 바닥 그림도 기록해 넣습니다.

분수 표기(6-2 「분수의 나눗셈」 활동지 gen_u1-fracdiv.py와 같음)
  - 계산 식·빈칸은 그림(PNG)으로 넣어 분수를 위아래(분자/분모)로 씁니다. 빈칸은 네모, 답 칸은 큰 네모.
  - 글 속 분수는 읽는 말로 씁니다: [3/7] → '7분의 3', [2 1/4] → '2와 4분의 1'.
  - 교사용 정답 쪽은 '3/7', '2 1/4'(= 2와 4분의 1)로 씁니다.
그림(나누어 주기 띠, (분수)÷(자연수) 띠, 넓이 모델, 막대, 잇기, 푸름시, 평행사변형, 정삼각형)은 수에 맞는 비율로
SVG를 그려 임시 폴더에서 PNG로 바꿉니다.
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
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '1단원_분수의나눗셈_활동지_%s.hwpx'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧'
WORK = tempfile.mkdtemp(prefix='u1fnat_')
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
    m = re.fullmatch(r'(?:([\d+\-−×÷]+) )?([\d+\-−×÷]+)/([\d+\-−×÷]+)', s)
    if m:   # 분자·분모 안의 식: [{3}+{5}/7], [4÷2/9]
        iv = lambda t: ev(t) if t else 0
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
        n = '(%s)' % n if re.search(r'[+−×÷]', n) else n      # [6÷3/9] → '9분의 (6÷3)'
        d = '(%s)' % d if re.search(r'[+−×÷]', d) else d
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
    """앱 도움 둘째 줄 '‘…~…’ 꼴로 써요.' → 쓰기 틀('‘…’ 또는 ‘…’'이면 두 틀을 '또는'으로 이음)"""
    ms = re.findall(r'‘([^‘’]*)’', help1)
    t = '  또는  '.join(ms) if len(ms) > 1 else (ms[0] if ms else help1)
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


# ================================================================ 6-1 분수의 나눗셈: 앱 원본 읽기
UNITS = os.path.join(ROOT, '_build', 'units')
SRC_TB = os.path.join(UNITS, 'u1-fracnat.tb.js')
SRC_ST = os.path.join(UNITS, 'u1-fracnat.st.js')
UNIT_NAME = '1. 분수의 나눗셈'


def _sym(t):
    return not re.fullmatch(r'\d+', t)


_rd0 = rd


def rd(t):
    """[■/●]·[□/13] 같은 기호 분수도 다룸: [□/13] → '13분의 □', [■/●] → '■/●'"""
    def sym(m):
        w, n, d = m.group(1), m.group(2), m.group(3)
        if w is None and _sym(n) and not _sym(d) and n == '□':
            return '%s분의 □' % d
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
function fn6Style() {} function fn6Style2() {} function fn6Style3() {} function fn6Style4() {}
const all = fs.readFileSync(process.argv[2], 'utf8');
const fnSrc = name => { const i = all.indexOf('function ' + name + '('); if (i < 0) return ''; const j = all.indexOf('\n}\n', i); return all.slice(i, j + 3); };
eval(fnSrc('fn6Scene').replace('function fn6Scene', 'var fn6SceneReal = function'));
{ const m = all.match(/^const FN6_CARDS = (\[[^\n]*\]);/m); var FN6_CARDS = m ? eval(m[1]) : []; }
var REC = [];
const rec = w => function (b, a, ...args) { REC.push({ w, args }); };
var quiz = rec('quiz'), blanks = rec('blanks'), sequence = rec('sequence'), writeStep = rec('writeStep'), panes = rec('panes');
var fn6Calc = rec('fn6Calc'), fn6Chain = rec('fn6Chain'), fn6Bars = rec('fn6Bars'), fn6Sort = rec('fn6Sort'), fn6Match = rec('fn6Match'),
  fn6Area = rec('fn6Area'), fn6Share = rec('fn6Share'), fn6Div = rec('fn6Div'), fn6Build = rec('fn6Build'), fn6Relay = rec('fn6Relay'),
  fn6Line = rec('fn6Line');
var fn6Both = function (b, a, parts, opt) { (parts || []).forEach((p, i) => { REC.push({ w: 'title', args: [(opt && opt.titles && opt.titles[i]) || ''] }); p(new El('div'), a); }); };
function fn6Scene() {} function fn6Para() {} function fn6Tri() {}
const api = { provide() {}, hint() {}, done() {}, fail() {}, tryOnce() {} };
const ls = all.slice(all.indexOf('//@@LESSONS'));
eval(ls.replace(/^(const|let) /gm, 'var '));
const run = S => { REC = []; try { S.render(new El('div'), api); } catch (e) { REC.push({ w: 'error', args: [String(e && e.message || e)] }); } return REC; };
const out = { story: typeof UNIT_STORY !== 'undefined' ? UNIT_STORY : null, lessons: LESSONS.map(L => ({
  id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(S => ({ name: S.name, inst: S.inst, hints: S.hints || [], calls: run(S) })),
  ch: L.challenge ? { inst: L.challenge.inst, hints: L.challenge.hints || [], calls: run(L.challenge) } : null })) };
const sc = fn6SceneReal && fn6SceneReal(); out.scene = sc ? String(find(sc, 'svg')) : null;
out.cards = FN6_CARDS;
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
    (r'이 앱에서는 ', ''),
    (r'(할 일을 )?차례대로 눌러요', r'\1차례대로 늘어놓아 보세요'),
    (r'교과서 차례대로 눌러 보세요', '교과서 차례대로 늘어놓아 보세요'),
    (r'‘＋’(?:로|를 눌러) ', ''),          # 이야기 버전: 앱의 ＋ 단추
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
    """앱 fn6Chain 한 줄 → dict(tag, disp, full, ans, boxes)"""
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
    """앱 fn6Chain 줄들: 빈칸이 있는 줄은 식 그림, 글과 고르기만 있는 줄은 테두리 문장. 정답 글."""
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
    """앱 fn6Calc: 식 계산 · 문장제 · 보기 고르기. 모든 답을 분수로 다시 계산해 확인. 정답 글 목록."""
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
    """앱 fn6Lbl: 자연수 / [진분수] / [대분수]"""
    x = Fraction(x)
    if x.denominator == 1:
        return str(x.numerator)
    return '[%s]' % mixed(x)


def written_den(t):
    return den_of(t) if '/' in str(t) else 1


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
        if fig == 'fn6Scene' and DATA.get('scene'):
            scene_pic(s, DATA['scene'])
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
    return (" / " if any(isinstance(it["a"], list) for it in items) else ", ").join(ans)


def w_blanks(s, lv, parts, opts=None, *_):
    conv = [p if isinstance(p, str) else (p['o'], p['a']) for p in parts]
    return ', '.join(blanks(s, lv, conv))


def w_sequence(s, lv, items, order, opts=None, *_):
    s.fill(['%s %s' % (KO[i], rd(t)) for i, t in enumerate(items)])
    s.ask('차례대로 기호를 써 보세요.   ' + ' → '.join(['(      )'] * len(items)), blank=False)
    return ' → '.join(KO[i] for i in order)


def ask_part(s, lv, o):
    if o.get('ask'):
        return render_rows(s, o['ask'])
    if o.get('askCalc'):
        return ', '.join(calc_items(s, lv, o['askCalc']))
    return ''


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




# ---------------------------------------------------------------- 6-1 단원 그림
STEP_NAMES = ['만져 보기', '그려 보기', '말해 보기', '약속하기', '확인하기']     # 앱 엔진(tpl_tb.html)과 같음


def _lab_left(out, name, x_end, cy, fs=22, fill=INK):
    eq_line(name, x_end - eq_w(name, fs), cy, fs, out)


def share_fig(s, lv, o):
    """앱 fn6Share: 크기가 같은 띠 N개(하나가 1). 기본형은 나눌 띠를 d칸으로 나누어 둠(점선).
    mode 'whole'은 먼저 1짜리를 q개씩 나누어 주고 남은 띠만 나눔. choose(방법 고르기)는 나누지 않고 그대로 둠."""
    N, d = int(o['N']), int(o['d'])
    mode = o.get('mode') or 'each'
    q = N // d
    n_whole = q * d if mode == 'whole' and not o.get('choose') else 0
    strip = o.get('strip') or '1'
    fs = 21
    names = [('남은 ' if n_whole and i >= n_whole else '') + strip for i in range(N)]
    LX = 24 + max(tw(n, fs) for n in names) + 16
    BW, BH, GP = 640, 46, 16
    out = []
    pre = lv == '기본형' and not o.get('choose')
    for i in range(N):
        y = 12 + i * (BH + GP)
        out.append('<rect x="%.1f" y="%d" width="%d" height="%d" fill="#fff" stroke="%s" stroke-width="3"/>' % (LX, y, BW, BH, INK))
        if pre and i >= n_whole:
            for j in range(1, d):
                x = LX + BW * j / d
                out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#555" stroke-width="2" stroke-dasharray="6 5"/>'
                           % (x, y, x, y + BH))
        out.append(T(LX - 12, y + BH / 2, names[i], fs, anchor='end', fill='#B4610F' if n_whole and i >= n_whole else '#444'))
    W, H = int(LX + BW + 20), int(12 + N * (BH + GP) + 4)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(170, 60 + 22 * N + 60))
    return q, n_whole


ST_MODE = [False]     # 이야기 버전을 만드는 동안 True


def _to(one):
    """'한 명에게' · '그릇 한 개에'(이야기 버전만 — 교과서 버전 활동지 글은 그대로 둠)"""
    return '에' if ST_MODE[0] and not re.search(r'(명|모둠)$', one) else '에게'


def _many(one, d, who):
    """'3명' · 이야기 버전에서 사물이면 '그릇 3개'(교과서 버전 글은 그대로)"""
    noun = re.sub(r'\s*한\s*\S+$', '', one)
    return '%s %d%s' % (noun, d, who) if ST_MODE[0] and who != '명' and noun and noun != one else '%d%s' % (d, who)


def w_share(s, lv, o, *_):
    N, d = int(o['N']), int(o['d'])
    unit = o.get('unit') or ''
    one = o.get('one') or '한 명'
    who = o.get('who') or '명'
    q, n_whole = share_fig(s, lv, o)
    if o.get('choose'):
        s.text('방법 1(1개씩 먼저 나누어 주고 남은 것을 나누기)과 방법 2(모두 똑같이 %d칸으로 나누기) 중 하나를 골라 그림에 선을 긋고, '
               '%s의 몫을 색칠해 보세요.' % (d, one))
    elif n_whole:
        to = '에게' if who == '명' else '에'
        s.text('먼저 ‘%s’ 띠 %d개는 %s%s 1개씩 나누어 줄 수 있어요. %s의 몫인 띠 %d개에 색칠해 보세요. '
               '그다음 남은 띠를 똑같이 %d칸으로 %s %s%s 줄 한 칸을 색칠해 보세요.'
               % (rd(o.get('strip') or '1'), n_whole, _many(one, d, who), to, one, q, d,
                  '나누어 두었어요.' if lv == '기본형' else '나누고,', one, to))
    elif lv == '기본형':
        s.text('띠마다 똑같이 %d칸으로 나누어 두었어요. %s%s 줄 부분을 띠마다 한 칸씩 색칠해 보세요.' % (d, one, _to(one)))
    else:
        s.text('띠마다 똑같이 %d칸으로 나누는 선을 긋고, %s%s 줄 부분을 띠마다 한 칸씩 색칠해 보세요.' % (d, one, _to(one)))
    v = Fraction(N, d)
    a = ask_part(s, lv, o)
    g = '(그림) %s 몫 %d÷%d = %s%s' % (one, N, d, bk(v), unit)
    return '%s / %s' % (g, a) if a else g


def div_fig(s, lv, o):
    """앱 fn6Div: 나누어지는 수를 색칠해 둔 띠(1마다 점선 틀). 기본형은 색칠한 칸을 m칸으로 더 나누어 둠."""
    A = F(o['A'])
    k = int(o['k'])
    mode = o.get('mode') or 'frac'
    raw = str(o['A'])
    mm = re.fullmatch(r'(?:(\d+) )?(\d+)/(\d+)', raw)
    w0, n0, den = int(mm.group(1) or 0), int(mm.group(2)), int(mm.group(3))
    num = w0 * den + n0
    nf = n0
    colored = nf if mode == 'mixed' else num
    m = o.get('m') or ((colored % k) and k or 1)
    if mode == 'mixed':
        assert w0 % k == 0 and (nf * m) % k == 0, raw
    else:
        assert (num * m) % k == 0, raw
    U = max(1, math.ceil(Fraction(num, den)))
    LX, BW, BH, Y = 30, 820, 64, 64
    uw = BW / U
    out = []
    if o.get('aName'):
        eq_line(o['aName'], LX, 26, 24, out)
    for u in range(U):
        out.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" fill="#fff" stroke="#B9C4C0" stroke-width="2" stroke-dasharray="6 5"/>'
                   % (LX + u * uw, Y, uw, BH))
    cells = []
    if mode == 'mixed':
        for u in range(w0):
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" fill="#F6C08A" stroke="%s" stroke-width="3"/>'
                       % (LX + u * uw, Y, uw, BH, INK))
        base = LX + w0 * uw
        cells = [base + c * uw / den for c in range(den)]
        ncol = nf
    else:
        cells = [LX + c * uw / den for c in range(U * den)]
        ncol = num
    cw_ = uw / den
    for c, x in enumerate(cells):
        on = c < ncol
        out.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" fill="%s" stroke="%s" stroke-width="2.4"/>'
                   % (x, Y, cw_, BH, '#F6C08A' if on else '#fff', INK))
        if on and lv == '기본형' and m > 1:
            for j in range(1, m):
                xx = x + cw_ * j / m
                out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#555" stroke-width="1.4" stroke-dasharray="4 3"/>'
                           % (xx, Y, xx, Y + BH))
    yl = Y + BH + 28
    unit = o.get('unit') or ''
    out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3"/>' % (LX, yl, LX + BW, yl, INK))
    for u in range(U + 1):
        x = LX + u * uw
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (x, yl - 9, x, yl + 9, INK))
        out.append(T(x, yl + 26, '%d%s' % (u, unit if u == U else ''), 20, anchor='middle', fill='#444'))
    W, H = LX + BW + 40, yl + 48
    put_png(s, svg_doc(W, H, ''.join(out)), W, H)
    return m, w0, nf, den


def w_div(s, lv, o, *_):
    m, w0, nf, den = div_fig(s, lv, o)
    k = int(o['k'])
    mode = o.get('mode') or 'frac'
    if m > 1:
        s.text(rd('색칠한 [1/%d] 칸을 각각 똑같이 %d칸으로 %s' % (den, m, '나누어 두었어요.' if lv == '기본형' else '나누는 선을 그어 보세요.')))
    if mode == 'mixed':
        s.text('1짜리 %d개와 진분수 부분을 각각 %d묶음으로 똑같이 나누어, 한 묶음에 빗금을 그어 보세요.' % (w0, k))
    else:
        s.text('색칠한 부분을 %d묶음으로 똑같이 나눈 것 중 한 묶음에 빗금을 그어 보세요.' % k)
    v = F(o['A']) / k
    a = ask_part(s, lv, o)
    g = '(그림) 한 묶음 %s÷%d = %s%s' % (o['A'], k, bk(v), o.get('unit') or '')
    return '%s / %s' % (g, a) if a else g


def area_fig(s, lv, stages, whole):
    """앱 fn6Area: 넓이가 1인 정사각형. 기본형은 세로 d1등분 선(실선)과 가로 d2등분 선(점선)을 그어 둠."""
    S, x0, y0 = 440, 60, 66
    v = next(st for st in stages if st['dir'] == 'v')
    hz = next(st for st in stages if st['dir'] == 'h')
    out = []
    if whole:
        out.append(T(x0 + S / 2, 32, whole, 26, anchor='middle', fill='#444'))
    if lv == '기본형':
        for i in range(1, int(v['d'])):
            x = x0 + S * i / v['d']
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2.6"/>' % (x, y0, x, y0 + S, INK))
        for j in range(1, int(hz['d'])):
            yy = y0 + S * j / hz['d']
            out.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="#2B6FB8" stroke-width="2.6" stroke-dasharray="10 6"/>' % (x0, yy, x0 + S, yy))
    out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="%s" stroke-width="4"/>' % (x0, y0, S, S, INK))
    out.append(T(x0 - 14, y0 + S / 2, '1', 26, anchor='end', fill='#555'))
    out.append(T(x0 + S / 2, y0 + S + 30, '1', 26, anchor='middle', fill='#555'))
    W, H = x0 + S + 40, y0 + S + 50
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=78)


def w_area(s, lv, o, *_):
    st = o['stages']
    v = next(x for x in st if x['dir'] == 'v')
    hz = next(x for x in st if x['dir'] == 'h')
    area_fig(s, lv, st, o.get('whole'))
    if lv == '기본형':
        s.fill([rd('%s: 세로선으로 나눈 %d칸 중 %d칸에 색칠해요.' % (v['t'], v['d'], v['n'])),
                rd('%s: 가로 점선으로 나눈 %d줄 중 %d줄의 색칠한 부분에 빗금을 그어요.' % (hz['t'], hz['d'], hz['n']))])
    else:
        s.fill([rd('%s: 정사각형을 세로로 %d등분하여 %d칸에 색칠해요.' % (v['t'], v['d'], v['n'])),
                rd('%s: 가로로 %d등분하여 %d줄의 색칠한 부분에 빗금을 그어요.' % (hz['t'], hz['d'], hz['n']))])
    val = Fraction(int(v['n']), int(v['d'])) * Fraction(int(hz['n']), int(hz['d']))
    a = ask_part(s, lv, o)
    g = '(그림) 빗금 친 부분 %s' % bk(val)
    return '%s / %s' % (g, a) if a else g


def bars_fig(s, d, bars):
    fs = 26
    LX = 20 + max(eq_w(b['name'], fs) for b in bars) + 20
    BW, BH, GP = 660, 62, 30
    out = []
    for i, b in enumerate(bars):
        y = 14 + i * (BH + GP)
        for c in range(d):
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" fill="#fff" stroke="%s" stroke-width="2"/>'
                       % (LX + c * BW / d, y, BW / d, BH, INK))
        out.append('<rect x="%.1f" y="%d" width="%d" height="%d" fill="none" stroke="%s" stroke-width="4"/>' % (LX, y, BW, BH, INK))
        _lab_left(out, b['name'], LX - 16, y + BH / 2, fs)
    W, H = int(LX + BW + 20), int(14 + len(bars) * (BH + GP))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=150)


def w_bars(s, lv, o, *_):
    d = int(o['d'])
    bars_fig(s, d, o['bars'])
    s.text(rd('막대에 %s만큼 색칠해 보세요.' % ', '.join(b['name'] for b in o['bars'])))
    a = ask_part(s, lv, o)
    g = '(그림) ' + ', '.join('%s → %d칸 색칠' % (flat(b['name']), b['k']) for b in o['bars'])
    return '%s / %s' % (g, a) if a else g


def _bval(kind, v):
    return Fraction(v[0], v[1]) if kind == 'nat' else Fraction(v[0], v[1] * v[2])


def _btxt(kind, v):
    return '%d÷%d' % tuple(v) if kind == 'nat' else '%d/%d÷%d' % tuple(v)


def w_build(s, lv, o, *_):
    cards = [int(c) for c in o['cards']]
    cards_fig(s, [str(c) for c in cards])
    if o.get('tip'):
        s.text(rd(paper(o['tip'])))
    boards = o['boards']
    for bd in boards:
        if bd.get('label'):
            s.text(rd(bd['label']))
        e = '{}÷{} = ▢' if bd['kind'] == 'nat' else '[{}/{}]÷{} = ▢'
        eq_fig(s, [e], indent=30)
    n_of = lambda bd: 2 if bd['kind'] == 'nat' else 3
    ok_v = lambda bd, v: not (bd.get('proper') and bd['kind'] == 'fr' and v[0] >= v[1])
    ans = []
    if o.get('all'):
        assert sum(n_of(bd) for bd in boards) == len(cards)
        found = None
        for perm in permutations(cards):
            vs, i = [], 0
            for bd in boards:
                vs.append(list(perm[i:i + n_of(bd)]))
                i += n_of(bd)
            if all(ok_v(bd, v) for bd, v in zip(boards, vs)):
                found = vs
                break
        assert found
        for bd, v in zip(boards, found):
            ans.append('%s = %s' % (_btxt(bd['kind'], v), bk(_bval(bd['kind'], v))))
        return '(예) ' + ', '.join(ans) + ' (카드를 모두 한 번씩 쓰면 다른 답도 맞아요)'
    for bd in boards:
        sign = {'max': 1, 'min': -1}.get(bd.get('goal'), 0)
        best_ = None
        for v in permutations(cards, n_of(bd)):
            if not ok_v(bd, v):
                continue
            x = _bval(bd['kind'], v)
            if best_ is None or sign * (x - best_[0]) > 0:
                best_ = (x, v)
        ans.append(('' if sign else '(예) ') + '%s = %s' % (_btxt(bd['kind'], best_[1]), bk(best_[0])))
    return ', '.join(ans)


SEEN_CARDS = []


def card_vals(cards):
    return ', '.join('%s = %s' % (flat(c), bk(ev(c))) for c in cards)


def w_relay(s, lv, o, *_):
    rounds, need, sec = int(o['rounds']), int(o['need']), int(o.get('sec') or 5)
    s.text('선생님이나 친구가 나눗셈 카드를 %d초 동안 보여 주면, 기억했다가 아래 표에 쓰고 계산해요.' % sec)
    s.table([['판', '기억한 나눗셈', '계산(몫)', '점수']] + [[str(i), '', '', '      점'] for i in range(1, rounds + 1)],
            col_mm=[14, 62, 64, 40], row_h=3300)
    s.text('점수: 카드를 맞히고 옳게 계산 2점 · 맞혔으나 잘못 계산 1점 · 맞히지 못했으나 옳게 계산 1점 · 둘 다 못 하면 0점')
    SEEN_CARDS[:] = list(o['cards'])
    return '카드의 몫(앱 카드 %d장): %s' % (len(o['cards']), card_vals(o['cards']))


def cards_grid_fig(s, cards, cols=4, fs=30):
    cw_, ch = 270, 110
    out = []
    for i, c in enumerate(cards):
        r, k = divmod(i, cols)
        x, y = 10 + k * (cw_ + 14), 10 + r * (ch + 14)
        out.append('<rect x="%d" y="%d" width="%d" height="%d" rx="12" fill="#FFF8E6" stroke="%s" stroke-width="3"/>' % (x, y, cw_, ch, INK))
        w = eq_w(c, fs)
        assert w < cw_ - 10, ('카드가 좁아요', c)
        eq_line(c, x + (cw_ - w) / 2, y + ch / 2, fs, out)
    rows = (len(cards) + cols - 1) // cols
    W, H = 10 + cols * (cw_ + 14), 10 + rows * (ch + 14)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=170)


def w_line(s, lv, o, *_):
    cards = o['cards']
    s.text('카드를 오려 뒤집어 놓고 놀이해요. 고른 카드의 몫을 옳게 계산하면 그 카드에 내 이름을 써요.')
    cards_grid_fig(s, cards)
    s.ask('내가 계산한 카드와 몫을 써 보세요.', blank=False)
    s.lines(2)
    if list(cards) == SEEN_CARDS:
        return '카드 16장의 몫은 ③과 같아요'
    return '카드의 몫: ' + card_vals(cards)


def para_fig(s):
    out = ['<polygon points="260,40 700,40 620,180 180,180" fill="#FBE6CC" stroke="%s" stroke-width="4"/>' % INK,
           '<line x1="260" y1="40" x2="260" y2="180" stroke="#C8472E" stroke-width="3" stroke-dasharray="8 6"/>',
           '<rect x="260" y="164" width="16" height="16" fill="none" stroke="#C8472E" stroke-width="2"/>',
           T(272, 112, '높이 □ cm', 22, fill='#C8472E'), T(400, 210, '7 cm', 22, anchor='middle')]
    eq_line('넓이 [8 3/4] cm²', 440, 112, 24, out)
    put_png(s, svg_doc(900, 230, ''.join(out)), 900, 230, max_mm=120)


def tri_fig(s):
    out = []
    for x in (180, 520):
        out.append('<polygon points="%d,170 %d,170 %d,%.1f" fill="#E3F0FA" stroke="#8A6400" stroke-width="5"/>'
                   % (x, x + 180, x + 90, 170 - 90 * math.sqrt(3)))
    t_ = '철사 [8/9] m를 모두 사용해요'
    eq_line(t_, 450 - eq_w(t_, 22) / 2, 210, 22, out)
    put_png(s, svg_doc(900, 245, ''.join(out)), 900, 245, max_mm=120)


FIGS = {'fn6Para': para_fig, 'fn6Tri': tri_fig}


def w_calc(s, lv, items, opt=None, *_):
    fig = ((opt or {}).get('fig') or {}).get('fn')
    if fig:
        FIGS[fig](s)
    return ', '.join(calc_items(s, lv, items))


def w_chain(s, lv, rows, opt=None, *_):
    fig = ((opt or {}).get('fig') or {}).get('fn')
    if fig:
        FIGS[fig](s)
    return render_rows(s, rows)


def w_title(s, lv, title, *_):
    if title:
        s.text('▶ ' + rd(title))
    return ''


WIDGETS = {'quiz': w_quiz, 'blanks': w_blanks, 'sequence': w_sequence, 'fn6Chain': w_chain, 'fn6Calc': w_calc,
           'fn6Share': w_share, 'fn6Div': w_div, 'fn6Area': w_area, 'fn6Bars': w_bars, 'fn6Build': w_build,
           'fn6Relay': w_relay, 'fn6Line': w_line, 'fn6Match': w_match, 'fn6Sort': w_sort, 'title': w_title, 'error': w_error}


def run_calls(s, lv, calls):
    out = []
    for c in calls:
        if c['w'] not in WIDGETS:
            raise RuntimeError('활동지에 아직 없는 부품: %s — gen_u1-fracnat.py의 WIDGETS에 더하세요' % c['w'])
        out.append(WIDGETS[c['w']](s, lv, *c['args']))
    return ' / '.join(a for a in out if a)


# ---------------------------------------------------------------- 차시
WHY = {   # 도전형 '왜' 쓰기(차시 id → 물음, 예시 답)
    't1': ('270÷60처럼 몫이 자연수로 나누어떨어지지 않는 나눗셈이 생활에서 쓰이는 때를 하나 찾아 써 보세요.',
           '예) 피자 3판을 4명이 똑같이 나누어 먹을 때 한 명이 먹는 양을 구할 때 써요.'),
    't2': ('3÷5처럼 나누어지는 수가 나누는 수보다 작아도 나눌 수 있는 까닭을 써 보세요.',
           '예) 1을 똑같이 5로 나누면 1/5이고, 3은 1이 3개이므로 3÷5는 1/5이 3개인 3/5이에요.'),
    't3': ('4÷3을 방법 1로 구한 몫 [1 1/3]과 방법 2로 구한 몫 [4/3]이 같은 까닭을 써 보세요.',
           '예) 4/3은 1/3이 4개이고, 1/3이 3개면 1이므로 1과 1/3과 크기가 같아요.'),
    't4': ('[2/3]÷5를 계산할 때 [2/3]를 [10/15]로 바꾸는 까닭을 써 보세요.',
           '예) 분자 2는 5로 나누어떨어지지 않아서, 크기가 같고 분자가 5의 배수인 10/15로 바꾸면 분자를 5로 나눌 수 있어요.'),
    't5': ('÷3과 ×[1/3]의 의미가 같은 까닭을 써 보세요.',
           '예) 3으로 똑같이 나눈 것 중 하나는 전체의 1/3이므로, ÷3은 ×1/3과 같아요.'),
    't6': ('[5 1/2]÷5는 방법 1(자연수 부분과 진분수 부분으로 나누기)이 편리한 까닭을 써 보세요.',
           '예) 자연수 부분 5가 나누는 수 5의 배수라서 5÷5 = 1로 바로 나누어떨어지기 때문이에요.'),
    't78': ('문제를 해결할 때 상자 1개의 무게를 먼저 구하는 까닭을 써 보세요.',
            '예) 상자 1개에 든 텐트 수를 알고 있어서, 상자 1개의 무게에서 빈 상자의 무게를 빼야 텐트의 무게를 구할 수 있기 때문이에요.'),
    't9': ('놀이에서 점수를 많이 얻으려면 어떻게 해야 하는지 써 보세요.',
           '예) 카드의 수를 소리 내어 정확하게 외워 전달하고, 분자가 나누는 수의 배수가 아니면 크기가 같은 분수로 바꾸거나 ×1/▲로 정확하게 계산해요.'),
    't10': ('(분수)÷(자연수)를 계산하는 방법 중 가장 편리한 방법과 그 까닭을 써 보세요.',
            '예) 분수의 곱셈(×1/▲)으로 나타내는 방법이 편리해요. 분자가 나누는 수의 배수가 아니어도 바로 계산할 수 있어요.'),
}


def show_inst(s, lv, inst, hints, kinds=()):
    t = str(inst or '')
    if 'fn6Div' in kinds:
        t = re.sub(r'한 묶음을 골라 보세요', '한 묶음에 빗금을 그어 보세요', t)
        t = re.sub(r'(\d)칸을 골라', r'\1칸에 빗금을 그어', t)
    if 'fn6Share' in kinds:
        t = t.replace('골라 보세요', '색칠해 보세요')
    t = paper(t)
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
    for i, st_ in enumerate(L['steps']):
        lab = st_.get('name') or STEP_NAMES[min(i, len(STEP_NAMES) - 1)]
        lab, sub = split_name(lab)
        step(s, i, lab, sub)
        show_inst(s, lv, st_['inst'], st_['hints'], [c['w'] for c in st_['calls']])
        ans.append('%s %s' % (NUM[i], run_calls(s, lv, st_['calls'])))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('ch'):
            step(s, n, '★ 도전하기', '앱의 도전 문제')
            show_inst(s, lv, L['ch']['inst'], [], [c['w'] for c in L['ch']['calls']])
            ans.append('%s %s' % (NUM[n], run_calls(s, lv, L['ch']['calls'])))
            n += 1
        q, a = WHY[L['id']]
        step(s, n, '생각 쓰기', '왜 그럴까요?')
        challenge_why(s, q)
        ans.append('%s %s' % (NUM[n], a))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


def split_name(n):
    m = re.match(r'^(.*?)\s*[①-⑧]\s*(.+)$', n)
    return (m.group(1), m.group(2)) if m else (n, None)


def note_line(s):
    s.text('※ 계산 식은 분수를 위아래로 썼어요. 글 속에서는 ‘7분의 3’, ‘2와 4분의 1’처럼 읽는 말로 썼어요. '
           '네모 칸에는 수를, 큰 네모 칸에는 답을 써요. 몫은 약분하지 않은 분수, 가분수, 대분수로 써도 값이 같으면 맞아요.')


DATA = {}

# ================================================================ 이야기 버전(u1-fracnat.st.js '6학년 3반 나눔 빵 공방', 10차시)
# 교과서 버전과 같은 부품(fn6Share·fn6Div·fn6Calc·fn6Chain …)을 쓰고, 이야기 엔진 부품(panes·thenWhy·ruleFirst·wonderRecall·
# writeStep)과 공방 그림(fn6sBakery)·준비 쪽지(fn6sNote)·상자 그림(fn6sBoxes)·상자 바닥(fn6sRect)을 더 기록합니다.
_ST_REPL = [
    ("function fn6Style() {} function fn6Style2() {} function fn6Style3() {} function fn6Style4() {}",
     "function fn6Style() {} function fn6Style2() {} function fn6Style3() {} function fn6Style4() {} function fn6sStyle() {}"),
    ("eval(fnSrc('fn6Scene').replace('function fn6Scene', 'var fn6SceneReal = function'));",
     "eval(fnSrc('fn6sBakery').replace('function fn6sBakery', 'var fn6SceneReal = function'));"),
    ("{ const m = all.match(/^const FN6_CARDS = (\\[[^\\n]*\\]);/m); var FN6_CARDS = m ? eval(m[1]) : []; }",
     "{ const m = all.match(/^const FN6S_CARDS = (\\[[^\\n]*\\]);/m); var FN6S_CARDS = m ? eval(m[1]) : []; var FN6_CARDS = FN6S_CARDS; }"),
    ("function fn6Scene() {} function fn6Para() {} function fn6Tri() {}",
     "var fn6sBakery = () => { REC.push({ w: 'bakery', args: [] }); return null; };\n"
     "var fn6sNote = (title, lines) => { REC.push({ w: 'note', args: [title, lines] }); return null; };\n"
     "var fn6sBoxes = (n, per, label, kind) => { REC.push({ w: 'boxes', args: [n, per, label, kind || 'box'] }); return null; };\n"
     "var fn6sRect = () => { REC.push({ w: 'rect', args: [] }); return null; };\n"
     "const figFirst = w => function (b, a, items, opt) { if (opt && typeof opt.fig === 'function') { opt.fig(); opt = Object.assign({}, opt); delete opt.fig; } REC.push({ w, args: [items, opt] }); };\n"
     "fn6Calc = figFirst('fn6Calc'); fn6Chain = figFirst('fn6Chain');\n"
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


def w_bakery(s, lv, *_):
    if DATA.get('scene'):
        scene_pic(s, DATA['scene'])
    return ''


def w_note(s, lv, title, lines, *_):
    s.text(re.sub(r'^\W+\s*', '', title))
    s.fill([rd(re.sub(r'^[^\w\[(]+\s*', '', t)) for t in lines])
    return ''


def w_boxes(s, lv, n, per, label, kind='box', *_):
    """앱 fn6sBoxes: 상자(바구니) n개, 한 개에 빵 per개"""
    n, per = int(n), int(per)
    W, GAP = 900, 16
    bw = min(150, (W - 40) / n - GAP)
    x0 = (W - n * (bw + GAP) + GAP) / 2
    out = []
    fs = 24
    eq_line(label, W / 2 - eq_w(label, fs) / 2, 26, fs, out)
    cols = math.ceil(per / 2)
    cwid = (bw - 16) / cols
    for i in range(n):
        x, y = x0 + i * (bw + GAP), 50
        if kind == 'basket':
            out.append('<path d="M%.1f %d L%.1f %d L%.1f %d L%.1f %d Z" fill="#D9A55E" stroke="%s" stroke-width="3"/>'
                       % (x, y + 30, x + bw, y + 30, x + bw - 12, y + 110, x + 12, y + 110, INK))
        else:
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="90" fill="#FBE6CC" stroke="%s" stroke-width="3"/>' % (x, y + 20, bw, INK))
        for k in range(per):
            cx, cy = x + 8 + (k % cols + .5) * cwid, y + 52 + (k // cols) * 34
            r = min(14, cwid / 2 - 2) if kind == 'basket' else min(16, cwid / 2 - 2)
            if kind == 'basket':
                out.append('<circle cx="%.1f" cy="%d" r="%.1f" fill="#B5764A" stroke="#6B3E1E" stroke-width="2"/>' % (cx, cy, r))
            else:
                out.append('<rect x="%.1f" y="%d" width="%.1f" height="26" rx="8" fill="#F2D29B" stroke="#8A4A0B" stroke-width="2"/>'
                           % (cx - r, cy - 13, 2 * r))
    out.append(T(W / 2, 190, '%d개 · 한 개에 %d개씩' % (n, per), 20, anchor='middle', fill='#555'))
    put_png(s, svg_doc(W, 212, ''.join(out)), W, 212, max_mm=140)
    return ''


def w_rect(s, lv, *_):
    """앱 fn6sRect: 직사각형 상자 바닥(글은 원본에서 읽음)"""
    src = open(SRC_ST, encoding='utf-8').read()
    i = src.index('function fn6sRect(')
    labs = re.findall(r'fn6SvgLine\("([^"]+)"', src[i:src.index('\n}\n', i)])
    assert len(labs) == 3, labs
    out = ['<rect x="250" y="30" width="400" height="140" fill="#FBE6CC" stroke="%s" stroke-width="4"/>' % INK]
    for (t, x, y, fill, anchor) in [(labs[0], 450, 200, INK, 'mid'), (labs[1], 664, 100, '#C8472E', 'start'), (labs[2], 450, 100, INK, 'mid')]:
        if fill == INK:
            eq_line(t, x - (eq_w(t, 24) / 2 if anchor == 'mid' else 0), y, 24, out)
        else:
            out.append(T(x, y, t, 24, fill=fill))
    put_png(s, svg_doc(900, 225, ''.join(out)), 900, 225, max_mm=120)
    return ''


def w_panes(s, lv, items, opts=None, *_):
    panes(s, lv, [(it['t'], it.get('ph') or '~', (it.get('ex') or [''])[0]) for it in items])
    return '(자유) ' + ' / '.join('%s 예) %s' % (it['t'], flat(it['ex'][0])) for it in items if it.get('ex'))


def _help1(o):
    """쓰기 틀: 앱 도움 둘째 줄. 빈칸(~)이 없는 완성 문장이면(답이 그대로 보이므로) 입력 칸 안내(ph)를 씀"""
    h = (o.get('help') or ['', ''])[-1]
    return h if '~' in h or not o.get('ph') else o['ph']


def w_then_why(s, lv, o, *_):
    why(s, lv, o['q'], _help1(o))
    return '왜? 예) ' + flat(o.get('ans') or '')


def w_rule_first(s, lv, o, *_):
    rule_first(s, lv, o['q'], _help1(o))
    return '예상(자유) — 실제 규칙: ' + flat(o.get('ans') or '')


def w_wonder(s, lv, *_):
    s.text('1차시에 쓴 ‘궁금해요’ 칸을 다시 보고, 이제 답할 수 있게 된 것을 떠올려 보세요.')
    return ''


def w_write(s, lv, items, opts=None, *_):
    out = []
    for it in items:
        q = ('%s · ' % it['tag'] if it.get('tag') else '') + it['q']
        out.append(write_ans(s, lv, q, _help1(it), it.get('ans') or '(자유)'))
    return ' / '.join('예) ' + a for a in out)


WIDGETS.update({'bakery': w_bakery, 'note': w_note, 'boxes': w_boxes, 'rect': w_rect, 'panes': w_panes,
                'thenWhy': w_then_why, 'ruleFirst': w_rule_first, 'wonder': w_wonder, 'writeStep': w_write})

WHY_ST = {   # 도전형 '왜' 쓰기(이야기 차시 id → 물음, 예시 답)
    's1': ('나눔 빵 공방에서 몫이 자연수가 아닌 나눗셈을 써야 하는 때를 쪽지 말고 하나 더 찾아 써 보세요.',
           '예) 머핀 반죽 2덩이를 5모둠이 똑같이 나누어 쓸 때 한 모둠이 받는 양을 구할 때 써요.'),
    's2': ('3÷4의 몫이 [3/4]인 까닭을 막대 반죽으로 설명해 보세요.',
           '예) 반죽 1줄을 4명이 나누면 한 명이 [1/4]줄씩 받고, 3줄이면 [1/4]줄을 3개 받아서 [3/4]줄이에요.'),
    's3': ('5÷3을 방법 1로 구한 몫 [1 2/3]과 방법 2로 구한 몫 [5/3]이 같은 까닭을 우유 그릇으로 설명해 보세요.',
           '예) [5/3]은 [1/3] L가 5개이고, [1/3] L가 3개면 1 L이므로 1 L와 [2/3] L를 더한 [1 2/3] L와 같아요.'),
    's4': ('[2/5]÷3을 계산할 때 [2/5]를 [6/15]로 바꾸는 까닭을 써 보세요.',
           '예) 분자 2는 3으로 나누어떨어지지 않아서, 크기가 같고 분자가 3의 배수인 [6/15]로 바꾸면 분자를 3으로 나눌 수 있어요.'),
    's5': ('설탕 [2/3] kg을 반죽 4덩이에 나눌 때 ÷4 대신 ×[1/4]을 해도 되는 까닭을 써 보세요.',
           '예) 4덩이로 똑같이 나눈 것 중 하나는 [2/3]의 [1/4]이므로 ÷4는 ×[1/4]과 같아요.'),
    's6': ('[6 3/4]÷3은 방법 1(자연수 부분과 진분수 부분으로 나누기)이 편리한 까닭을 써 보세요.',
           '예) 자연수 부분 6과 분자 3이 모두 3으로 나누어떨어져서 6÷3 = 2, [3/4]÷3 = [1/4]로 바로 계산할 수 있어요.'),
    's7': ('식빵 1개의 무게를 구할 때 상자 1개의 무게를 먼저 구하는 까닭을 써 보세요.',
           '예) 주어진 무게는 상자 여러 개를 합한 무게라서, 상자 1개의 무게를 알아야 빈 상자 무게를 빼고 식빵의 무게를 구할 수 있어요.'),
    's8': ('문제에 필요 없는 정보가 있을 때 어떻게 해야 하는지 써 보세요.',
           '예) 구하려는 것을 먼저 확인하고, 그것을 구하는 데 쓰이는 정보만 골라 식을 세워요.'),
    's9': ('주문서 이어달리기 놀이에서 점수를 많이 얻으려면 어떻게 해야 하는지 써 보세요.',
           '예) 카드의 수를 정확하게 기억해 전달하고, 분자가 나누는 수의 배수가 아니면 크기가 같은 분수로 바꾸거나 ×[1/▲]로 정확하게 계산해요.'),
    's10': ('(분수)÷(자연수)를 계산하는 방법 가운데 가장 편리한 방법과 그 까닭을 써 보세요.',
            '예) 분수의 곱셈(×[1/▲])으로 나타내는 방법이 편리해요. 분자가 나누는 수의 배수가 아니어도 바로 계산할 수 있어요.'),
}
ST_IDS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10']


def st_lesson(s, lv, L, first, story):
    s.lesson(L['no'], L['soop'], rd(L['title']), rd(L['question']))
    if first and story:
        s.scene(None, rd(story['lines'][0]))
        note_line(s)
    ans = []
    for i, st_ in enumerate(L['steps']):
        lab, sub = split_name(st_['name'])
        step(s, i, lab, sub)
        show_inst(s, lv, st_['inst'], st_['hints'], [c['w'] for c in st_['calls']])
        ans.append('%s %s' % (NUM[i], run_calls(s, lv, st_['calls'])))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('ch'):
            step(s, n, '★ 도전하기', '앱의 도전 문제')
            show_inst(s, lv, L['ch']['inst'], [], [c['w'] for c in L['ch']['calls']])
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


def build_file(kind, lv):
    src = SRC_TB if kind == 'tb' else SRC_ST
    D = cap(src)
    if kind == 'st':
        ids = [L['id'] for L in D['lessons']]
        assert ids == ST_IDS, ('이야기 버전 차시가 바뀌었어요 — ST_IDS·WHY_ST를 고치세요', ids)
    DATA.clear()
    DATA.update(D)
    ST_MODE[0] = kind == 'st'
    label = '교과서 차시' if kind == 'tb' else '이야기 버전'
    s = Sheet(unit_label='6-1 수학 %s(%s)' % (UNIT_NAME, label), level=lv, grade_label='6학년')
    if kind == 'tb':
        lines = [tb_lesson(s, lv, L, i == 0, D.get('story')) for i, L in enumerate(D['lessons'])]
    else:
        lines = [f(s, lv) for f in ST]
    s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT_NAME, label, lv), lines,
              note='※ 이 활동지는 앱 u1-fracnat.html과 차시 번호가 같습니다. 정답의 ‘2 1/4’은 대분수 2와 4분의 1, ‘9/4’는 가분수 4분의 9를 뜻해요. '
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
