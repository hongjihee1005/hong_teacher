# -*- coding: utf-8 -*-
"""6-1 수학 4. 비와 비율 활동지(교과서 차시 버전[·이야기 버전] × 기본형·도전형) 만들기

    python3 gen_u4-ratio61.py            # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u4-ratio61.py tb         # 교과서 차시 버전만

※ 6-2 4단원(비례식과 비례배분, 원본 ../units/sem2/u4-ratio.tb.js)은 gen_u4-ratio.py가 만듭니다. 이 파일은 6-1 단원입니다.

앱 원본 ../units/u4-ratio.tb.js('휴양림 비와 비율', 10차시: 1~10)의 UNIT·LESSONS를 node에서 그대로 실행해
(활동 부품 대신 기록하는 함수를 넣어 render를 부름) 활동마다 넘긴 설정(물음·보기·정답·빈칸 줄·묶음 표·양 카드·
이중 테이프·모눈·지도·잇기·카드)을 모읍니다(CAP_JS). 그래서 차시 번호·제목·S.O.O.P.·탐구 질문·이야기·수가 앱과 같고,
원본의 수가 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.
  - 빈칸 줄(ra4Chain)의 '=' 식과 '→'로 이은 비는 채운 답으로 분수(Fraction)로 다시 계산해 값이 같은지 assert로 확인하고
    ('%'는 '× 100 = 55 %'의 이름표와 '0.85 = 85 %'의 값 두 가지로 읽어 봄), 글로 된 문제(인구·할인·이자·불량품 …)는
    check_words가 파이썬으로 따로 계산해 앱의 답과 견줍니다. 묶음 표·지도 길이·테이프 눈금·잇기·카드 짝·
    '비율이 가장 높은/낮은 카드'도 이 스크립트가 계산해 씁니다.
  - 그림: 파르테논 신전·휴양림·묶음(모노레일·반죽·통·병)·초콜릿·메모지·포도 음료·청구서 등은 앱의 처음 그림(SVG)을 그대로,
    두 막대와 수직선·이중 테이프·모눈·지도 자는 수에 맞게 이 스크립트가 그립니다. 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
  - 놀이(9차시)는 종이에서 할 수 있게 카드 24장 그림·짝 찾기 표, 또 다른 놀이는 정해 둔 차례(씨앗 고정)의 6판 표로 바꿉니다.
  - 분수: 식 줄은 그림으로 분수를 위아래로 쓰고(빈칸은 네모), 글 속 분수는 '5분의 3'처럼 읽는 말로 씁니다(정답 쪽은 3/5).

이야기 버전은 아직 없습니다. 생기면 ST(차시 함수 목록)를 채우고 SRC_ST가 있으면 sem1-soop/sheets/에 만듭니다.
ST가 비어 있거나 원본 파일이 없으면 건너뜁니다.
"""
import json
import math
import random
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

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade6/math
UNITS = os.path.join(ROOT, '_build', 'units')          # 6-1 단원(sem2/ 아님)
SRC_TB = os.path.join(UNITS, 'u4-ratio.tb.js')
SRC_ST = os.path.join(UNITS, 'u4-ratio.st.js')
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '4단원_비와비율_활동지_%s.hwpx'
UNIT_NAME = '4. 비와 비율'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨'
KO = '㉠㉡㉢㉣㉤㉥㉦'
WORK = tempfile.mkdtemp(prefix='u4ratio61_')
INK = '#1D2A2A'
PX_MM = 0.155
STEP_NAMES = ["만져 보기", "그려 보기", "말해 보기", "약속하기", "확인하기"]     # 앱 엔진(tpl_tb.html)과 같음
CHECKS = [0]

# ================================================================ 수 읽기·계산
FR_RE = re.compile(r'\[(?:(\d+) )?([^\[\]/ ]+)/([^\[\]]+)\]')


def P(s):
    """'12' · '0.8' · '2/3' · '[2/3]' · '1 1/2' · '[1 1/2]' → Fraction"""
    s = str(s).strip().strip('[]').strip()
    m = re.fullmatch(r'(?:(\d+) )?(\d+)/(\d+)', s)
    if m:
        return int(m.group(1) or 0) + Fraction(int(m.group(2)), int(m.group(3)))
    assert re.fullmatch(r'\d+(?:\.\d+)?', s), ('수를 읽을 수 없어요', s)
    return Fraction(s)


def ev(e):
    """식 계산: 괄호, × ÷ 를 + − 보다 먼저. 수는 자연수·소수·[분수]"""
    src = str(e).replace('−', '-').strip()
    toks = re.findall(r'\[[^\]]+\]|\d+(?:\.\d+)?|[-+×÷()]', src)
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
        assert t is not None and t not in '+-×÷)', e
        return P(t)

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


def try_ev(e):
    try:
        return ev(e)
    except (AssertionError, ZeroDivisionError, TypeError):
        return None


def ratio_of(t):
    """'0.8 : 0.2' · '[1/2] : [1/3]' · '3 × 3 : 5 × 3' → 비율(Fraction) 또는 None"""
    if t.count(':') != 1:
        return None
    a, b = (try_ev(x) for x in t.split(':'))
    if a is None or b is None or b == 0:
        return None
    return a / b


def RT(t):
    a, b = t.split(':')
    return P(a), P(b)


def simplest(t):
    v = (lambda a, b: a / b)(*RT(t))
    return '%d : %d' % (v.numerator, v.denominator)


def fr_txt(x):
    x = Fraction(x)
    return str(x.numerator) if x.denominator == 1 else '%d/%d' % (x.numerator, x.denominator)


def num_txt(x):
    """정수면 정수, 소수로 끝나면 소수 글"""
    x = Fraction(x)
    if x.denominator == 1:
        return str(x.numerator)
    for k in range(1, 6):
        if (x * 10 ** k).denominator == 1:
            return ('%.*f' % (k, float(x)))
    return fr_txt(x)


def check_full(full):
    """'%'는 두 가지로 읽어 봐요: '× 100 = 55 %'의 55(이름표)와 '0.85 = 85 %'의 85 %(= 0.85). 둘 중 하나가 맞으면 돼요."""
    if '%' not in full:
        return _check_full(full)
    n0 = CHECKS[0]
    try:
        return _check_full(re.sub(r'\s*%', '', full))
    except AssertionError:
        CHECKS[0] = n0
        return _check_full(re.sub(r'(\d+(?:\.\d+)?)\s*%', r'(\1 ÷ 100)', full))


def _check_full(full):
    """채운 줄에서 '=' 식·비례식·'→'로 이은 비가 맞는지 확인"""
    t = re.sub(r'\((?:[^()]*[가-힣A-Za-z][^()]*)\)', ' ', full)
    t = re.sub(r'→\([×÷][^)]*\)→', '≡', t).replace('→', '≡')
    for seg in re.split(r'\s{3,}', t):
        found = re.findall(r'□\s*=\s*(\d+(?:\.\d+)?)', seg)
        if found:
            seg = seg.replace('□', found[-1])
        for m in re.finditer(r'[0-9.\[\]/ ×÷+−()=:≡]+', seg):
            run = re.sub(r'^\s*\d+\.\s(?=\S)', '', m.group(0)).strip(' :=≡')
            if not re.search(r'\d', run):
                continue
            ratios = []
            for pc in run.split('≡'):
                pc = pc.strip(' ')
                if not pc:
                    continue
                if '=' in pc:
                    sides = [x.strip() for x in pc.split('=')]
                    if any(not x for x in sides):
                        continue
                    if all(':' in x for x in sides):
                        vs = [ratio_of(x) for x in sides]
                        if None not in vs:
                            assert all(v == vs[0] for v in vs), ('비례식 확인 필요', full)
                            CHECKS[0] += 1
                            ratios.append(vs[0])
                    elif not any(':' in x for x in sides):
                        vs = [try_ev(x) for x in sides]
                        if None not in vs:
                            assert all(v == vs[0] for v in vs), ('식 확인 필요', full)
                            CHECKS[0] += 1
                elif ':' in pc:
                    v = ratio_of(pc)
                    if v is not None:
                        ratios.append(v)
            if len(ratios) > 1:
                assert all(v == ratios[0] for v in ratios), ('비 확인 필요', full)
                CHECKS[0] += 1


# ================================================================ 글(읽는 말·조사)
PART = r'(이에요|예요|이므로|므로|이라서|라서|(?:으로|은|는|을|를|과|와|이|가|로)(?![가-힣]))?'
PAIRS = {'이에요': 0, '예요': 0, '이므로': 1, '므로': 1, '은': 2, '는': 2, '을': 3, '를': 3, '과': 4, '와': 4, '이': 5, '가': 5,
         '이라서': 6, '라서': 6}
FORMS = [('이에요', '예요'), ('이므로', '므로'), ('은', '는'), ('을', '를'), ('과', '와'), ('이', '가'), ('이라서', '라서')]


def jong(num):
    """읽는 말 끝 글자의 받침: None(없음) · 'ㄹ' · 'o'(그 밖)"""
    ds = re.findall(r'\d+', num)
    if not ds:
        return 'o'
    n = int(ds[-1])
    if n == 0:
        return 'o'
    if n % 10:
        return {1: 'ㄹ', 3: 'o', 6: 'o', 7: 'ㄹ', 8: 'ㄹ'}.get(n % 10)
    return 'o'


def rd(t):
    """글 속 [분수] → 읽는 말(뒤 조사도 읽는 말에 맞춤)"""
    def rep(m):
        w, n, d, pt = m.group(1), m.group(2), m.group(3), m.group(4) or ''
        r = ('%s%s %s분의 %s' % (w, '과' if jong(w) else '와', d, n)) if w else '%s분의 %s' % (d, n)
        j = jong(n)
        if pt in PAIRS:
            pt = FORMS[PAIRS[pt]][0 if j else 1]
        elif pt in ('으로', '로'):
            pt = '으로' if j == 'o' else '로'
        return r + pt
    return re.sub(FR_RE.pattern + PART, rep, str(t))


def ro(num):
    """수 뒤 '(으)로': 3 → 으로, 2 → 로, 1 → 로"""
    return '으로' if jong(str(num)) == 'o' else '로'


def flat(t):
    """[2 1/4] → 2 1/4 (정답 쪽 표기), 빈칸 {x} → x"""
    t = re.sub(r'\{([^}]*)\}', r'\1', str(t))
    t = re.sub(r'\[(?:(\d+) )?([^\[\]/ ]+)/([^\[\]]+)\]', lambda m: ('%s ' % m.group(1) if m.group(1) else '') + '%s/%s' % (m.group(2), m.group(3)), t)
    return t


PAPER_RULES = [
    (r'되게 빨간 점을 끌어 보세요\.', '되는 직사각형을 그려 보세요.'),
    (r'이 앱에서 ', '앱에서 '),
    (r'늘려 보고,? ', '늘린다고 생각하고 '),
    (r'세 병까지 만들어 보고,? ', '세 병까지 만든다고 생각하고 '),
    (r'차례로 눌러 보세요\.', '차례로 기호를 써 보세요.'),
    (r'초콜릿을 눌러 4개를 먹어 보세요\.', ''),
    (r'배울 차례대로 스티커를 붙이듯 눌러 보세요\.', '배울 차례대로 기호를 써 보세요.'),
    (r'놀이 순서대로 눌러 보세요\.', '놀이 순서대로 기호를 써 보세요.'),
    (r'이 앱이 정한', '앱에서 정한'),
    (r'체험 부스를 모두 눌러 ', '체험 부스를 모두 살펴보며 '),
    (r'만들어 보고,? ', '만든다고 생각하고 '),
    (r'줄여 보고,? ', '줄인다고 생각하고 '),
    (r'(빨간색 톱니바퀴)를 (\d+)바퀴 돌려 보고, ', r'\1가 \2바퀴 회전할 때 '),
    (r'\(교과서 카드와 다를 수 있어요\)', '(교과서 카드와 다를 수 있어요)'),
]
INTERACT = re.compile(r'눌러|누르|누를|끌어|돌려 보세요|단추|컴퓨터|‘[^’]*’를 ')


def paper(t):
    t = str(t or '')
    for a, b in PAPER_RULES:
        t = re.sub(a, b, t)
    sents = re.split(r'(?:(?<=[.?!])|(?<=[.?!]”))\s+', t)
    gone = [x for x in sents if x and INTERACT.search(x)]
    if gone and os.environ.get('SHOW_DROP'):
        print('  [뺀 문장]', ' | '.join(gone))
    return ' '.join(x for x in sents if x and not INTERACT.search(x)).strip()


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
        '#w{display:inline-block;width:' + m.width + 'px;line-height:0;background:#fff}#w>svg{width:100%;height:auto;display:block}</style>' +
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
        self.proc, self.cache, self.n = None, {}, 0

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
CHARSET = (''.join(chr(c) for c in range(32, 127)) + '−×÷○◯△□▢①②③④⑤⑥⑦⑧㉠㉡㉢㉣㉤㉥·…‘’“”→≥≤가★■')


def cw(ch):
    if not _W:
        _W.update(SHOT.ask({'op': 'measure', 'chars': CHARSET, 'font': FONT.replace("'", '')}))
    if ch in _W:
        return _W[ch] / 100
    if '가' <= ch <= '힣':
        return _W['가'] / 100
    return 1.0


def tw(t, fs):
    return sum(cw(c) for c in str(t)) * fs


def T(x, y, s, fs, anchor='start', fill=INK, weight='normal'):
    return ('<text x="%.1f" y="%.1f" font-size="%.1f" text-anchor="%s" dominant-baseline="central" fill="%s" '
            'font-weight="%s" style="white-space:pre">%s</text>' % (x, y, fs, anchor, fill, weight, escape(str(s))))


def svg_doc(w, h, body):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>'
            '<g font-family="%s">%s</g></svg>' % (w, h, w, h, FONT, body))


# ---------------------------------------------------------------- 식(분수를 위아래로, 빈칸 네모) 그리기
TOK = re.compile(r'\[[^\]]+\]|\{[^}]*\}|▢|[^\[\{▢]+')


def _part(t):
    out = []
    for m in re.finditer(r'\{([^}]*)\}|□|[^{□]+', t):
        g = m.group(0)
        if g == '□':
            out.append(('b', None))
        elif g.startswith('{'):
            out.append(('b', m.group(1)))
        else:
            out.append(('t', g))
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
            segs.append(('t', g))
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


def box_w(ans, fs):
    """빈칸 너비: 답의 글자 수에 맞게(최소 한 칸)"""
    n = len(str(ans or ''))
    return fs * max(1.15, .62 * n + .55)


def seg_w(sg, fs):
    if sg[0] == 't':
        return tw(sg[1], fs)
    if sg[0] == 'b':
        return box_w(sg[1], fs) + fs * .2
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
                   % (x + fs * .1, cy - fs * .58, box_w(sg[1], fs), fs * 1.16))
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


def eq_line(s, x, cy, fs, out):
    for sg in parse_eq(s):
        wdt = seg_w(sg, fs)
        seg_draw(sg, x, cy, fs, out)
        x += wdt
    return x


def eq_w(s, fs):
    return sum(seg_w(sg, fs) for sg in parse_eq(s))


def tall(s):
    return '[' in s or '▢' in s


def put_png(s, svg, w, h, max_mm=180):
    mm = min(max_mm, w * PX_MM)
    s.picture(SHOT.png(svg, min(2400, w * 2)), width_mm=mm)


def eq_fig(s, rows, fs=34, max_mm=180, indent=0):
    """식 여러 줄(빈칸 {답}) 그림. 줄 (tag, 식) 또는 식. tag '' 는 앞 줄에 이어지는 줄(들여 씀)."""
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
            x += fs * 2.2
        x = eq_line(e, x, cy, fs, out)
        wmax = max(wmax, x + 12)
        y += h
    W, H = int(wmax + 4), int(y + 10)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


WMAX = 1120


def top_split(disp):
    """[ ]·{ } 밖의 띄어쓰기에서 나눈 조각(띄어쓰기는 앞 조각 끝에 붙여 둠)"""
    out, cur, depth = [], '', 0
    for ch in disp:
        cur += ch
        if ch in '[{':
            depth += 1
        elif ch in ']}':
            depth -= 1
        elif ch == ' ' and depth == 0:
            out.append(cur)
            cur = ''
    if cur:
        out.append(cur)
    return out


def wrap_eq(disp, limit=WMAX, tagw=0):
    if eq_w(disp, 34) + tagw <= limit:
        return [disp]
    out, cur = [], ''
    for pc in top_split(disp):
        lim = limit - (tagw if not out else 34 * 2.2)
        if cur and eq_w(cur + pc, 34) > lim:
            out.append(cur.rstrip())
            cur = pc
        else:
            cur += pc
    if cur.strip():
        out.append(cur.rstrip())
    return out




# ================================================================ 앱 원본 읽기(node)
CAP_JS = r"""
const fs = require('fs');
const INK = '#1D2A2A';
const FONT = process.argv[3] || 'sans-serif';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
class El {
  constructor(tag, a) { this.tag = tag; this.a = {}; this.kids = []; this._t = ''; this.style = {}; this.dataset = {}; this.nodeType = 1; this.parent = null;
    this.classList = { add() {}, remove() {}, toggle() {}, contains() { return false; } }; if (a) for (const [k, v] of Object.entries(a)) this.setAttribute(k, v); }
  append(...k) { for (const x of k.flat(9)) if (x != null && x !== false && x !== '') { if (x instanceof El) x.parent = this; this.kids.push(x); } }
  appendChild(x) { this.append(x); return x; }
  prepend(...k) { this.kids.unshift(...k); }
  replaceChild() {} before() {} after() {}
  remove() { if (this.parent) this.parent.kids = this.parent.kids.filter(k => k !== this); }
  contains() { return true; }
  setAttribute(k, v) { if (typeof v === 'function') { (this.on = this.on || {})[k] = v; } else this.a[k] = v; }
  getAttribute(k) { return this.a[k]; }
  removeAttribute(k) { delete this.a[k]; }
  get children() { return this.kids.filter(k => k instanceof El); }
  get lastChild() { return this.kids[this.kids.length - 1]; }
  get firstChild() { return this.kids[0]; }
  set textContent(v) { this.kids = []; this._t = String(v); }
  get textContent() { return this._t + this.kids.map(k => k instanceof El ? k.textContent : String(k)).join(''); }
  set innerHTML(v) { this.kids = []; this._t = ''; }
  set value(v) { this.a.value = v; } get value() { return this.a.value || ''; }
  addEventListener() {} removeEventListener() {} focus() {} scrollIntoView() {}
  closest() { return null; }
  querySelector() { return null; } querySelectorAll() { return []; }
  getBBox() { return { x: 0, y: 0, width: 10, height: 10 }; }
  toString() {
    const a = Object.assign({}, this.a);
    if (this.tag === 'svg') { a.xmlns = 'http://www.w3.org/2000/svg'; delete a.class; delete a.role; }
    for (const k of Object.keys(a)) if (k.startsWith('on') || k === 'pointer-events' || k === 'aria-label' || (k === 'style' && /cursor/.test(a[k]))) delete a[k];
    const at = Object.entries(a).map(([k, v]) => ` ${k}="${esc(v)}"`).join('');
    return `<${this.tag}${at}>${esc(this._t)}${this.kids.map(k => typeof k === 'string' ? esc(k) : String(k)).join('')}</${this.tag}>`;
  }
}
var document = { createElement: t => new El(t), createElementNS: (n, t) => new El(t), createDocumentFragment: () => new El('frag'), head: { append() {} }, body: new El('body') };
var window = {}, performance = { now: () => 0 }, requestAnimationFrame = cb => 0, setTimeout = () => 0, NodeFilter = {};
const svgEl = (t, a) => new El(t, a);
const h = (t, a, ...k) => { const plain = a && !(a instanceof El) && typeof a === 'object' && !Array.isArray(a); const e = new El(t, plain ? a : {}); if (!plain && a != null) e.append(a); e.append(...k); return e; };
function makeSvg(w, hh) { return svgEl('svg', { viewBox: `0 0 ${w} ${hh}` }); }
function txt(x, y, t, size = 22, attrs = {}) { const e = svgEl('text', Object.assign({ x, y, 'font-size': size, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': FONT, fill: INK }, attrs)); e.textContent = t; return e; }
function dragOn() {}
const findSvg = e => { if (!e || typeof e !== 'object') return null; if (e.tag === 'svg') return e; for (const k of e.kids || []) { const r = findSvg(k); if (r) return r; } return null; };
var REC = [];
const rec = w => function (b, a, ...args) { REC.push({ w, args }); };
var quiz = rec('quiz'), blanks = rec('blanks'), sequence = rec('sequence'), writeStep = rec('writeStep');
/* 활동 함수의 body: 표·그림·계산기를 붙이면 기록해요 */
class Body extends El {
  append(...k) {
    for (const x of k.flat(9)) {
      if (!(x instanceof El)) continue;
      if (x._tbl) REC.push({ w: 'tbl', args: [x._tbl] });
      else if (x._calc) REC.push({ w: 'calc', args: [] });
      else { const s = findSvg(x); if (s) REC.push({ w: 'fig', args: [{ svg: String(s) }] }); }
    }
  }
}
const all = fs.readFileSync(process.argv[2], 'utf8');
const unitSrc = all.slice(all.indexOf('//@@UNIT'), all.indexOf('//@@LESSONS'));
eval(unitSrc.replace(/^(const|let) /gm, 'var '));
quiz = rec('quiz'); blanks = rec('blanks');
const T0 = ra4Tbl;
ra4Tbl = function (head, rows) { const e = T0(head, rows); e._tbl = { head, rows }; return e; };
ra4Calc = function () { const e = new El('div'); e._calc = 1; return e; };
const api = new Proxy({}, { get: () => () => {} });
const ORIG = {};
const sub = run => { const save = REC; REC = []; try { run(); } catch (e) { REC.push({ w: 'error', args: [String(e && e.stack || e).slice(0, 400)] }); } const r = REC; REC = save; return r; };
['ra4Build', 'ra4Slots', 'ra4Choc', 'ra4Comp', 'ra4Rect', 'ra4Map', 'ra4Tape2', 'ra4Grid', 'ra4Link', 'ra4Save', 'ra4Make',
 'ra4Same', 'ra4Memory', 'ra4High', 'ra4Scene', 'ra4Candy', 'ra4sStudio'].forEach(name => {
  if (eval('typeof ' + name) !== 'function') return;     // 교과서에만(ra4Choc·ra4Scene) · 이야기에만(ra4Candy·ra4sStudio) 있는 부품
  ORIG[name] = eval(name);
  const w = function (body, ap, opt) {
    opt = Object.assign({}, opt || {});
    let svg = null;
    try { const fb = new El('div'); const s0 = REC; REC = []; ORIG[name](fb, api, opt); REC = s0; const s = findSvg(fb); if (s) svg = String(s); } catch (e) { svg = null; }
    if (name === 'ra4Save' && typeof opt.ask === 'function') {
      if (opt.plan) { const tot = opt.plan.reduce((a, i) => a + opt.items[i].kwh, 0); opt.planSum = tot; opt.ask = opt.ask(tot, opt.plan); }
      else { opt.free = true; opt.ask = null; }
    } else if (typeof opt.ask === 'function') opt.ask = opt.ask();
    if (name === 'ra4Rect') {
      opt.tasks = opt.tasks.map(T => { const sols = [];
        for (let w = 1; w <= (opt.W || 12); w++) for (let hh = 1; hh <= (opt.H || 9); hh++) {
          if (opt.lockH && hh !== opt.h0) continue;
          if (T.test(w, hh)) sols.push([w, hh]);
        }
        return { goal: T.goal, sols }; });
    }
    if (typeof opt.ok === 'function') delete opt.ok;
    REC.push({ w: name, args: [opt], svg });
  };
  eval(name + ' = w');
});
ra4Chain = function (body, ap, lines, opt) { REC.push({ w: 'ra4Chain', args: [lines, opt || {}] }); };
ra4Seq = function (body, ap, parts) {
  REC.push({ w: 'ra4Seq', args: [parts.map(p => ({ title: p.title || null, calls: sub(() => (p.run || p)(new Body('div'), api)) }))] });
};
// 이야기 버전: 글 상자(기획표), 엔진의 탐구 도우미(thenWhy 활동 뒤 '왜?', ruleFirst 활동 앞 '예상', wonderRecall '궁금해요' 다시 보기)·panes
if (typeof ra4sNote === 'function') ra4sNote = function (title, lines) { REC.push({ w: 'note', args: [title, lines] }); return new El('div'); };
var panes = rec('panes');
var thenWhy = (f, o) => function (b, a) { const r = f(b, a); REC.push({ w: 'thenWhy', args: [o] }); return r; };
var ruleFirst = (f, o) => function (b, a) { REC.push({ w: 'ruleFirst', args: [o] }); return f(b, a); };
var wonderRecall = f => function (b, a) { REC.push({ w: 'wonderRecall', args: [] }); return f(b, a); };
const lesSrc = all.slice(all.indexOf('//@@LESSONS'));
eval(lesSrc.replace(/^(const|let) /gm, 'var '));
const run = S => sub(() => S.render(new Body('div'), api));
const SCN = all.indexOf('function ra4Scene(') >= 0 ? 'function ra4Scene(' : 'function ra4sStudio(';
const sceneSrc = all.slice(all.indexOf(SCN), all.indexOf(SCN) + 4000);
const spots = [...sceneSrc.matchAll(/\{ x: \d+, y: \d+, k: "\w+", t: "([^"]+)", d: "([^"]+)" \}/g)].map(m => ({ t: m[1], d: m[2] }));
const out = { story: UNIT_STORY, cards: RA4_CARDS, high: RA4_HIGH, spots, lessons: LESSONS.map(L => ({
  id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, summary: L.summary,
  steps: L.steps.map(S => ({ name: S.name || null, inst: S.inst, hints: S.hints || [], calls: run(S) })),
  ch: L.challenge ? { inst: L.challenge.inst, hints: L.challenge.hints || [], calls: run(L.challenge) } : null })) };
process.stdout.write(JSON.stringify(out, (k, v) => {
  if (typeof v === 'function') { try { const r = v(); const s = findSvg(r); return s ? { svg: String(s), fn: v.name } : { fn: v.name }; } catch (e) { return { fn: v.name }; } }
  return v instanceof El ? null : v;
}));
"""

_CAP = {}


def cap(src):
    if src not in _CAP:
        js = os.path.join(WORK, 'cap.js')
        with open(js, 'w', encoding='utf-8') as f:
            f.write(CAP_JS)
        r = subprocess.run(['node', js, src, FONT.replace("'", '')], capture_output=True, text=True)
        if r.returncode:
            raise RuntimeError('앱 원본을 읽지 못했어요: ' + r.stderr[-800:])
        _CAP[src] = json.loads(r.stdout)
    return _CAP[src]


# ================================================================ 활동지 조각
def opt_text(opts):
    return '( ' + ' / '.join(rd(o) for o in opts) + ' )'


def app_svg(s, svg, mm, viewbox=None):
    """앱의 처음 그림(SVG) 그대로. viewbox를 주면 그 부분만."""
    if viewbox:
        svg = re.sub(r'viewBox="[^"]*"', 'viewBox="%s"' % viewbox, svg, count=1)
    s.picture(SHOT.png(svg, 1600), width_mm=mm)


def row_parts(row):
    """앱 rp4Chain 한 줄 → dict(tag, disp, full, ans, eq)"""
    parts = row if isinstance(row, list) else row['p']
    tag = None if isinstance(row, list) else row.get('t')
    disp, full, ans, eq = '', '', [], False
    for t in parts:
        if isinstance(t, (str, int, float)):
            disp += str(t)
            full += str(t)
        elif t is None:
            continue
        elif 'i' in t:
            disp += '{%s}' % t['i']
            full += str(t['i'])
            ans.append(str(t['i']))
            eq = True
        elif 'f' in t:
            n, d = str(t['f']).split('/')
            disp += '[{%s}/{%s}]' % (n, d)
            full += '[%s]' % t['f']
            ans.append(str(t['f']))
            eq = True
        elif 'r' in t:
            a, b = t['r']
            disp += '{%s} : {%s}' % (a, b)
            full += '%s : %s' % (a, b)
            ans.append(('(예) %s : %s' if t.get('any') else '%s : %s') % (a, b))
            eq = True
        elif 'c' in t:
            disp += '( %s )' % ' / '.join(t['c'])
            full += t['c'][t['a']]
            ans.append(t['c'][t['a']])
        else:
            raise ValueError('모르는 칸: %r' % (t,))
    return {'tag': tag, 'disp': disp, 'full': full, 'ans': ans, 'eq': eq}


def render_rows(s, rows):
    """빈칸이 있는 줄은 식 그림, 글과 고르기만 있는 줄은 테두리 문장. 정답 글."""
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
            tagw = (tw(r['tag'], 34 * .78) + 34 * 1.05) if r['tag'] else 0
            for i, ln in enumerate(wrap_eq(r['disp'], tagw=tagw)):
                pend_eq.append((r['tag'], ln) if i == 0 and r['tag'] else ('', ln) if i else ln)
        else:
            if pend_eq:
                flush()
            t = re.sub(r'\( ([^()]*?) \)', lambda m: opt_text(m.group(1).split(' / ')), r['disp'])
            pend_txt.append(('[%s] ' % r['tag'] if r['tag'] else '') + rd(t))
        a = ', '.join(flat(x) for x in r['ans'])
        ans.append(('%s: %s' % (r['tag'], a)) if r['tag'] and a else a)
    flush()
    return ' / '.join(a for a in ans if a)


def cards_fig(s, cards, per_row=7, fs=32, max_mm=180):
    out, rows = [], [cards[i:i + per_row] for i in range(0, len(cards), per_row)]
    cwid = max(eq_w(c, fs) for c in cards) + 34
    y, W = 10, 0
    for row in rows:
        x = 12
        hgt = 112 if any('[' in c for c in row) else 76
        for c in row:
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%d" rx="12" fill="#FFF8E6" stroke="%s" stroke-width="3"/>'
                       % (x, y, cwid, hgt, INK))
            eq_line(c, x + (cwid - eq_w(c, fs)) / 2, y + hgt / 2, fs, out)
            x += cwid + 16
        W = max(W, x)
        y += hgt + 16
    W, H = int(W), int(y)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def unit_sp(u):
    """기호 단위는 띄어 쓰고(cm, g, mL) 우리말 단위는 붙여 써요(개, 장)"""
    return (' ' + u) if re.match(r'[A-Za-z]', u or '') else (u or '')


# ================================================================ 앱 부품 → 활동지
def w_quiz(s, lv, items, opts=None, *_):
    ans = []
    for k, it in enumerate(items):
        fig = it.get('fig') or {}
        if fig.get('svg'):
            app_svg(s, fig['svg'], 130 if fig.get('fn') == 'rp4Dabo' else 120)
        q = ('%d) ' % (k + 1) if len(items) > 1 and not re.match(r'\d+\.', it['q']) else '') + rd(it['q'])
        o, a = it['o'], it['a']
        many = isinstance(a, list)
        pre = all(re.match(r'[㉠-㉦]', x) for x in o)
        if many or pre or max(len(rd(x)) for x in o) > 16:
            s.ask(q, blank=False)
            s.fill([rd(x) if pre else '%s %s' % (KO[i], rd(x)) for i, x in enumerate(o)])
            s.ask('알맞은 것%s' % ('을 모두 골라 기호를 써 보세요.' if many else '의 기호를 써 보세요.'), answer_space=12)
            ans.append(', '.join(KO[i] for i in (a if many else [a])))
        else:
            s.choices([(q, opt_text(o))])
            ans.append(flat(o[a]))
    if len(ans) > 1:
        return '  '.join('%d) %s' % (i + 1, a) for i, a in enumerate(ans))
    return ', '.join(ans)


def w_blanks(s, lv, parts, opts=None, *_):
    txt, ans, words = '', [], []
    for p in parts:
        if isinstance(p, str):
            txt += rd(p)
        else:
            o, a = p['o'], p['a']
            ans.append(flat(o[a]))
            words += [rd(x) for x in o]
            txt += opt_text(o) if lv == '기본형' else '(              )'
    if lv == '도전형':
        s.wordbox(sorted(set(words), key=lambda w: (len(w), w)))
    s.fill(txt)
    return ', '.join(ans)


def w_sequence(s, lv, items, order, opts=None, *_):
    pre = all(re.match(r'[㉠-㉦]', t) for t in items)
    s.fill([rd(t) if pre else '%s %s' % (KO[i], rd(t)) for i, t in enumerate(items)])
    s.ask('차례대로 기호를 써 보세요.   ' + ' → '.join(['(    )'] * len(items)), blank=False)
    return ' → '.join((items[i][0] if pre else KO[i]) for i in order)


def w_write(s, lv, items, *_):
    out = []
    for it in items:
        s.ask(rd(it['q']), blank=False)
        ex = re.sub(r'^예\)\s*', '', it.get('ph') or '')
        if lv == '기본형' and ex:
            first = re.split(r'(?<=[.?!])\s', ex)[0]
            s.text('도움: ' + rd(first.rstrip('…').rstrip()) + ' …')
            s.lines(2)
        else:
            s.lines(3)
        out.append('(예) ' + flat(ex))
    return ' / '.join(out)


def w_chain(s, lv, rows, opt=None, *_):
    return render_rows(s, rows)


def w_seq(s, lv, parts, *_):
    out = []
    for p in parts:
        if p.get('title'):
            t = paper(p['title'])
            if t:
                s.text('▶ ' + rd(t))
        a = run_calls(s, lv, p['calls'])
        if a:
            out.append(a)
    return ' / '.join(out)


def ask_part(s, o):
    return render_rows(s, o['ask']) if o.get('ask') else ''




# ================================================================ 6-1 비와 비율 부품 → 활동지
def val(t):
    """카드·칸 글 '3 : 4' · '[3/4]' · '0.75' · '75 %' → 비율(Fraction)"""
    s = str(t).strip()
    if ':' in s:
        a, b = s.split(':')
        return P(a) / P(b)
    m = re.fullmatch(r'([\d.]+)\s*%', s)
    if m:
        return P(m.group(1)) / 100
    return P(s)


def say(v):
    """비율 → '3/4 = 0.75 = 75 %' (정답 쪽 표기)"""
    v = Fraction(v)
    out = [fr_txt(v)]
    d = num_txt(v)
    if d != out[0]:
        out.append(d)
    pc = num_txt(v * 100)
    if v <= 1 and '/' not in pc:
        out.append(pc + ' %')
    return ' = '.join(out)


def vb_w(svg):
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', svg)
    return float(m.group(1)) if m else 400


def fig_mm(svg, lo=60, hi=125):
    return max(lo, min(hi, vb_w(svg) * .21))


def w_fig(s, lv, o, *_):
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', o['svg'])
    vb = '-36 0 %g %s' % (float(m.group(1)) + 44, m.group(2)) if m else None     # 왼쪽 글이 잘리지 않게
    app_svg(s, o['svg'], fig_mm(o['svg']), viewbox=vb)
    return ''


def w_tbl(s, lv, o, *_):
    head, rows = o['head'], o['rows']
    n = len(head)
    s.table([list(head)] + [[str(c) for c in r] for r in rows], col_mm=[180 / n] * n)
    return ''


def w_calc(s, lv, *_):
    s.text('※ 큰 수의 나눗셈은 계산기를 써도 좋아요.')
    return ''


CNT = ['한', '두', '세', '네', '다섯', '여섯']


def w_build(s, lv, o, svg=None):
    its, K, u = o['items'], o.get('max') or 4, o['unit']
    if svg:      # 앱 그림의 첫 묶음만(나머지 칸은 '?')
        H = re.search(r'viewBox="0 0 [\d.]+ ([\d.]+)"', svg).group(1)
        app_svg(s, svg, 38, viewbox='0 0 156 %s' % H)
    first = ', '.join('%s %s%s' % (it['name'], it['per'], unit_sp(it['unit'])) for it in its)
    s.text(rd('%s %s %s:  %s.  %s 수가 늘어날 때 두 양을 표에 써 보세요.'
              % (o['what'], CNT[o['start'] - 1], u, first, o['what'])))
    rows = [[o.get('head') or '%s 수' % o['what']] + ['%s %s' % (CNT[k - 1], u) for k in range(1, K + 1)]]
    ans = []
    for it in its:
        r = ['%s(%s)' % (it['name'], it['unit'])]
        for k in range(1, K + 1):
            v = it['per'] * k
            if k == o['start'] or (lv == '기본형' and k == o['start'] + 1 and k != o['target']):
                r.append(str(v))
            else:
                r.append('')
                ans.append('%s %s %s %s%s' % (CNT[k - 1], u, it['name'], v, unit_sp(it['unit'])))
        rows.append(r)
    s.table(rows, col_mm=[48] + [132 / K] * K)
    a = ask_part(s, o)
    return '표: ' + ', '.join(ans) + (' / ' + a if a else '')


def w_slots(s, lv, o, svg=None):
    chips = o['chips']
    s.text('양 카드:  ' + '   ·   '.join(c['t'] for c in chips))
    s.fill(['%s → (        ) : (        )' % rd(T_['q']) if len(o['tasks']) == 1 else
            '%d. %s → (        ) : (        )' % (k + 1, rd(T_['q'])) for k, T_ in enumerate(o['tasks'])])
    return ', '.join('%s : %s' % (chips[T_['a'][0]]['v'], chips[T_['a'][1]]['v']) for T_ in o['tasks'])


def w_choc(s, lv, o, svg=None):
    if svg:
        app_svg(s, svg, 95)
    s.text('초콜릿 %d개 중 %d개를 먹었다고 생각하고, 먹은 초콜릿에 ×표를 해 보세요.' % (o['total'], o['eat']))
    a = ask_part(s, o)
    return '먹은 %d개, 남은 %d개' % (o['eat'], o['total'] - o['eat']) + (' / ' + a if a else '')


def comp_fig(s, lv, o):
    B, C = o['base'], o['comp']
    v = Fraction(C['n'], B['n'])
    mx = max(Fraction(1), Fraction(math.ceil(v * 10), 10))
    x0, L = 190, 900 / mx
    cell = L / B['n']
    out = []
    for y, it, col in ((70, B, '#2B7BD6'), (170, C, '#E47A38')):
        out.append(T(x0 - 14, y, '%s %d개' % (it['name'], it['n']), 24, anchor='end', weight='bold'))
        for i in range(it['n']):
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="52" fill="%s" fill-opacity=".22" stroke="%s" stroke-width="3"/>'
                       % (x0 + i * cell, y - 26, cell, col, col))
    out.append(T(x0 + B['n'] * cell, 30, '미끼통 전체 = 1' if B['name'] == '미끼통' else '%s 전체 = 1' % B['name'], 21, anchor='end', fill='#2B7BD6'))
    yN = 290
    out.append('<line x1="%d" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="3"/>' % (x0, yN, x0 + mx * L + 10, yN, INK))
    for t in range(int(mx * 10) + 1):
        x = x0 + Fraction(t, 10) * L
        big = t % 5 == 0
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2.4"/>' % (x, yN - (12 if big else 7), x, yN + (12 if big else 7), INK))
        if t % 10 == 0:
            out.append(T(x, yN + 36, str(t // 10), 24, anchor='middle'))
    out.append('<line x1="%.1f" y1="96" x2="%.1f" y2="%d" stroke="#2B7BD6" stroke-width="2.5" stroke-dasharray="7 6"/>'
               % (x0 + B['n'] * cell, x0 + B['n'] * cell, yN))
    W, H = int(x0 + mx * L + 40), yN + 60
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=160)
    return v


def w_comp(s, lv, o, svg=None):
    v = comp_fig(s, lv, o)
    B, C = o['base'], o['comp']
    s.text(rd('%s 막대 전체를 1로 보았어요. %s 막대의 끝을 수직선에서 찾아 ↓로 표시하고, 그 수를 써 보세요.' % (B['name'], C['name'])))
    s.fill('%s 막대의 끝:  (          )' % C['name'])
    a = ask_part(s, o)
    return '%s 막대의 끝 %s' % (C['name'], num_txt(v)) + (' / ' + a if a else '')


def grid_svg(cols, rows, cell=34, fills=0, col='#F2A541', label=None):
    out = []
    ox, oy = 6, 6 + (40 if label else 0)
    if label:
        out.append(T(ox, 22, label, 24, weight='bold'))
    for i in range(cols * rows):
        x, y = ox + (i % cols) * cell, oy + (i // cols) * cell
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" stroke="#8DA39A" stroke-width="1.8"/>'
                   % (x, y, cell, cell, col if i < fills else '#fff'))
    return out, ox * 2 + cols * cell, oy + rows * cell + 6


def w_grid(s, lv, o, svg=None):
    G = o['grids']
    cell = o.get('cell') or 34
    parts, x, Hm = [], 0, 0
    for g in G:
        out, w, hh = grid_svg(g['cols'], g['rows'], cell=cell, label=g.get('title') or g['name'])
        parts.append('<g transform="translate(%d,0)">%s</g>' % (x, ''.join(out)))
        x += max(w, tw(g.get('title') or g['name'], 24) + 20) + 50
        Hm = max(Hm, hh)
    W = int(x - 50)
    put_png(s, svg_doc(W, Hm, ''.join(parts)), W, Hm, max_mm=min(170, W * .2))
    if all(g['cols'] * g['rows'] == 100 for g in G):
        s.text('100칸 모눈에 각각 몇 칸을 색칠해야 할지 생각해 보고 색칠해 보세요.')
    else:
        s.text(rd(', '.join('%s 모눈에 %d칸' % (g['name'], g['target']) for g in G) + '을 색칠해 보세요.'))
    a = ask_part(s, o)
    return '색칠 ' + ', '.join('%s %d칸' % (g['name'], g['target']) for g in G) + (' / ' + a if a else '')


def w_rect(s, lv, o, svg=None):
    W, H, u = o.get('W') or 12, o.get('H') or 9, o.get('unit') or 'cm'
    out, w, hh = grid_svg(W, H, cell=34)
    put_png(s, svg_doc(w, hh, ''.join(out)), w, hh, max_mm=min(120, w * .23))
    nw, nh = o.get('nw') or '가로', o.get('nh') or '세로'
    ans = []
    for k, T_ in enumerate(o['tasks']):
        g = paper(T_['goal'])
        pre = '%d. ' % (k + 1) if len(o['tasks']) > 1 else ''
        s.text(rd(pre + g + ('' if u == '칸' else ' 모눈 한 칸의 한 변은 1%s예요.' % unit_sp(u)) + ' 모눈에 그려 보세요.'))
        s.fill('%s (        )%s,  %s (        )%s' % (nw, unit_sp(u), nh, unit_sp(u)))
        sols = T_['sols']
        assert sols, T_
        f = lambda p: '%s %d%s·%s %d%s' % (nw, p[0], unit_sp(u), nh, p[1], unit_sp(u))
        ans.append((pre + f(sols[0])) if len(sols) == 1 else pre + '(예) ' + ', '.join(f(p) for p in sols[2:4]) + ' (%s)' % (
            '가로와 세로가 같으면 맞아요' if all(p[0] == p[1] for p in sols) else '비율이 같으면 맞아요'))
    return ' / '.join(ans)


def map_fig(s, o):
    maps, MX, cm = o['maps'], 9, 100
    x0, out = 40, []
    for i, M in enumerate(maps):
        y = 10 + i * 170
        out.append('<rect x="10" y="%d" width="%d" height="158" rx="14" fill="%s" stroke="#C9B79C" stroke-width="2.5"/>'
                   % (y, x0 + MX * cm + 70, '#FFF6E3' if i == 0 else '#EEF6EA'))
        out.append(T(28, y + 28, '%s (실제 거리 %d m를 1 cm로)' % (M['name'], M['per']), 24, weight='bold', fill='#4A3A20'))
        out.append('<circle cx="%d" cy="%d" r="10" fill="#2F6B57"/>' % (x0 + 20, y + 84))
        out.append(T(x0 + 54, y + 84, '입구', 19, fill='#2F6B57'))
        ry = y + 108
        out.append('<rect x="%d" y="%d" width="%d" height="20" fill="#fff" stroke="#8A7B66" stroke-width="2"/>' % (x0 + 20, ry, MX * cm))
        for t in range(MX + 1):
            out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#5A4A30" stroke-width="2"/>' % (x0 + 20 + t * cm, ry, x0 + 20 + t * cm, ry + 12))
            out.append(T(x0 + 20 + t * cm, ry + 34, str(t), 18, anchor='middle', fill='#5A4A30'))
        out.append(T(x0 + 34 + MX * cm, ry + 34, 'cm', 18, fill='#5A4A30'))
    W, H = x0 + MX * cm + 90, 10 + len(maps) * 170
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=160)


def w_map(s, lv, o, svg=None):
    map_fig(s, o)
    s.text('실제 거리 %d m를 두 지도에 각각 몇 cm로 그려야 할까요? 입구에서부터 빨간 선을 그리고 길이를 써 보세요.' % o['real'])
    s.fill(['%s:  (        ) cm' % M['name'] for M in o['maps']])
    ans = []
    for M in o['maps']:
        v = Fraction(o['real'], M['per'])
        assert v.denominator == 1
        ans.append('%s %d cm' % (M['name'], v))
    a = ask_part(s, o)
    return ', '.join(ans) + (' / ' + a if a else '')


def tape2_fig(s, lv, o):
    N, K, pct = o['N'], o['steps'], o['mode'] == 'pct'
    x0, L, yT, yB = 40, 1000, 70, 210
    out = [T(x0, yT - 46, '%s(%s)' % (o['whole'], o['unit']), 22, fill='#4A5A55')]
    out.append('<rect x="%d" y="%d" width="%d" height="44" fill="#fff" stroke="#2B7BD6" stroke-width="2.5"/>' % (x0, yT - 22, L))
    if K <= 50:
        for i in range(1, K):
            x = x0 + L * i / K
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#9DB7D6" stroke-width="1.5"/>' % (x, yT - 22, x, yT + 22))
    else:
        for i in range(1, 10):
            x = x0 + L * i / 10
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#9DB7D6" stroke-width="1.5"/>' % (x, yT - 22, x, yT + 22))
    out.append(T(x0, yT + 38, '0', 20, anchor='middle'))
    out.append(T(x0 + L, yT + 38, num_txt(N), 20, anchor='middle'))
    out.append(T(x0, yB - 46, '백분율(%)' if pct else '비율', 22, fill='#4A5A55'))
    out.append('<rect x="%d" y="%d" width="%d" height="44" fill="#fff" stroke="#2F6B57" stroke-width="2.5"/>' % (x0, yB - 22, L))
    for i in range(11):
        x = x0 + L * i / 10
        out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#2F6B57" stroke-width="2"/>' % (x, yB - 22, x, yB + 30))
        lab = str(i * 10) if pct else ('1' if i == 10 else '0' if i == 0 else '0.%d' % i)
        out.append(T(x, yB + 46, lab, 19, anchor='middle', fill='#2F6B57'))
    W, H = x0 * 2 + L, yB + 66
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=170)


def ieyo(word):
    """낱말 뒤 '이에요/예요'(받침 따라). 한글이 아니면(kWh 등) '예요'"""
    c = str(word).strip()[-1:]
    if '가' <= c <= '힣':
        return '이에요' if (ord(c) - 0xAC00) % 28 else '예요'
    return '예요'


def w_tape2(s, lv, o, svg=None):
    N, K, tg, U = o['N'], o['steps'], o['target'], o['unit']
    tape2_fig(s, lv, o)
    pct = o['mode'] == 'pct'
    v = Fraction(tg, N)
    tip = ''
    if lv == '기본형':
        if K <= 50:
            tip = ' 위 테이프 한 칸은 %s%s%s.' % (num_txt(Fraction(N, K)), unit_sp(U), ieyo(U))
        else:
            tip = ' 위 테이프의 눈금 한 칸은 %s%s%s.' % (num_txt(Fraction(N, 10)), unit_sp(U), ieyo(U))
    t = '위 테이프를 %s %s%s만큼 색칠하고, 아래 테이프에서 %s 읽어 보세요.%s' % (
        o['part'], num_txt(tg), unit_sp(U), '백분율을' if pct else '비율을', tip)
    s.text(t.replace('만큼만큼', '만큼'))
    s.fill('%s %s%s일 때 %s:  (          )%s' % (o['part'], num_txt(tg), unit_sp(U), '백분율' if pct else '비율', ' %' if pct else ''))
    rd_ = num_txt(v * 100) + ' %' if pct else num_txt(v)
    a = ask_part(s, o)
    return '테이프 %s' % rd_ + (' / ' + a if a else '')


def w_link(s, lv, o, svg=None):
    heads = o.get('heads') or [''] * len(o['cols'])
    cols = [[(it, it) if isinstance(it, str) else (it['t'], it['v']) for it in col] for col in o['cols']]
    n = len(cols)
    rows = [list(heads)] + [[rd(cols[c][r][0]) for c in range(n)] for r in range(len(cols[0]))]
    s.table(rows, col_mm=[180 / n] * n, row_h=3200)
    s.text('비율이 같은 것끼리 선으로 이어 보세요.')
    ans = []
    for t, v in cols[0]:
        grp = [t]
        for c in range(1, n):
            m = [x for x in cols[c] if val(x[1]) == val(v)]
            assert len(m) == 1, (t, cols[c])
            grp.append(m[0][0])
        ans.append(' — '.join(flat(x) for x in grp))
    return ', '.join(ans)


def w_save(s, lv, o, svg=None):
    its = o['items']
    if o.get('free'):
        rows = [['가전제품', '줄일 수 있는 전기 사용량(kWh)', '줄일 것에 ○표']] + [[it['name'], str(it['kwh']), ''] for it in its]
        s.table(rows, col_mm=[60, 70, 50])
        s.fill(['줄이려는 전기 사용량:  (          ) kWh',
                '지난달 전기 사용량에 대한 줄이려는 전기 사용량의 비:  (          ) : (          )',
                '백분율:  (          ) %'])
        pick = [0, 5]
        tot = sum(its[i]['kwh'] for i in pick)
        check_full('[%d/200] × 100 = %s' % (tot, num_txt(Fraction(tot * 100, 200))))
        return '(예) %s → %d kWh, %d : 200, %s %% (고른 것에 따라 달라요: 백분율 = 줄이려는 양 ÷ 200 × 100)' % (
            '·'.join(its[i]['name'] for i in pick), tot, tot, num_txt(Fraction(tot, 2)))
    rows = [['가전제품', '줄일 수 있는 전기 사용량(kWh)', '계획에 있으면 ○표']] + [[it['name'], str(it['kwh']), ''] for it in its]
    s.table(rows, col_mm=[60, 70, 50])
    assert sum(its[i]['kwh'] for i in o['plan']) == o['planSum']
    a = ask_part(s, o)
    return '○: ' + ', '.join(its[i]['name'] for i in o['plan']) + (' / ' + a if a else '')


def w_make(s, lv, o, svg=None):
    (n1, d1, t1), (n2, d2, t2) = o['base']
    s.text('보기의 수를 바꾸어 나만의 문제를 만들고 풀어 보세요. 두 사람의 비율이 같아지지 않게 해요.')
    s.fill('%s는 자전거를 타고 (        ) m를 가는 데 (        )초가 걸렸고, %s는 자전거를 타고 (        ) m를 가는 데 (        )초가 걸렸습니다. '
           '걸린 시간에 대한 간 거리의 비율이 더 높은 사람은 누구인가요?' % (n1, n2))
    s.fill(['%s의 비율:  (        ) ÷ (        ) = (          )' % n1, '%s의 비율:  (        ) ÷ (        ) = (          )' % n2,
            '비율이 더 높은 사람:  (          )'])
    ex = [(80, 40), (90, 30)]
    r = [Fraction(a, b) for a, b in ex]
    assert r[0] != r[1]
    return '(예) %s %d m·%d초 → %s, %s %d m·%d초 → %s → %s' % (n1, ex[0][0], ex[0][1], num_txt(r[0]), n2, ex[1][0], ex[1][1], num_txt(r[1]),
                                                           n1 if r[0] > r[1] else n2)


def w_same(s, lv, o, svg=None):
    rows = [['', '카드 1', '카드 2', '비율이 같아요 / 달라요']]
    ans = []
    for k, (a, b) in enumerate(o['pairs']):
        rows.append([str(k + 1), rd(a), rd(b), '같아요 / 달라요'])
        same = val(a) == val(b)
        ans.append('%d) %s' % (k + 1, '같아요' if same else '달라요(%s, %s)' % (num_txt(val(a)), num_txt(val(b)))))
    s.table(rows, col_mm=[12, 44, 44, 80], row_h=3200)
    return ', '.join(ans)


def pairs_of(cards):
    out, used = [], set()
    for i, c in enumerate(cards):
        if i in used:
            continue
        js = [j for j in range(len(cards)) if j != i and val(cards[j]) == val(c)]
        assert len(js) == 1, c
        used.update((i, js[0]))
        out.append((i, js[0]))
    return out


def w_memory(s, lv, o, svg=None):
    cards = DATA['cards']
    order = list(range(len(cards)))
    random.Random(61).shuffle(order)
    s.text('놀이에 쓰는 비와 비율 카드 24장이에요(앱에서 정한 카드). 비율이 같은 카드는 꼭 한 장씩 있어요.')
    cards_fig(s, [cards[i] for i in order], per_row=6, max_mm=165)
    pr = pairs_of(cards)
    pr.sort(key=lambda p: order.index(p[0]))
    rows = [['카드', '비율이 같은 카드', '같은 비율(소수)', '카드', '비율이 같은 카드', '같은 비율(소수)']]
    half = (len(pr) + 1) // 2
    for r in range(half):
        row = []
        for p in (pr[r], pr[r + half] if r + half < len(pr) else None):
            row += ([rd(cards[p[0]]), '', ''] if p else ['', '', ''])
        rows.append(row)
    s.text('카드를 오려 놀이를 하거나, 아래 표에 비율이 같은 카드를 찾아 써 보세요.')
    s.table(rows, col_mm=[26, 32, 32, 26, 32, 32], row_h=3200)
    return ', '.join('%s=%s(%s)' % (flat(cards[a]), flat(cards[b]), num_txt(val(cards[a]))) for a, b in pr)


def high_deck():
    hi = DATA['high']
    rnd = random.Random(4061)
    for _ in range(5000):
        deck = hi[:]
        rnd.shuffle(deck)
        ok = True
        for r in range(6):
            v = [val(c) for c in deck[r * 4:r * 4 + 4]]
            best = max(v) if r < 3 else min(v)
            if v.count(best) > 1:
                ok = False
        if ok:
            return deck
    raise AssertionError('카드 섞기 실패')


def w_high(s, lv, o, svg=None):
    deck = high_deck()
    names = ['나', '친구 1', '친구 2', '친구 3']
    s.text('네 사람이 판마다 카드를 한 장씩 뒤집었어요. 1~3판은 비율이 가장 높은 사람이, 4~6판은 비율이 가장 낮은 사람이 카드 4장을 모두 가져가요. '
           '가져가는 사람을 써 보세요.')
    rows = [['판', '규칙'] + names + ['가져가는 사람']]
    ans, got = [], [0] * 4
    for r in range(6):
        cs = deck[r * 4:r * 4 + 4]
        v = [val(c) for c in cs]
        b = v.index(max(v) if r < 3 else min(v))
        got[b] += 4
        rows.append([str(r + 1), '가장 높은' if r < 3 else '가장 낮은'] + [rd(c) for c in cs] + [''])
        ans.append('%d판 %s(%s)' % (r + 1, names[b], flat(cs[b])))
    s.table(rows, col_mm=[12, 24, 26, 26, 26, 26, 40], row_h=3300)
    if lv == '기본형':
        s.text('도움: 분수·소수·백분율을 모두 소수로 바꾸면 비교하기 쉬워요.')
    s.fill('카드를 가장 많이 가져간 사람:  (                )')
    mx = max(got)
    win = [names[i] for i in range(4) if got[i] == mx]
    return ', '.join(ans) + ' → 가장 많이 가져간 사람 ' + '·'.join(win) + ' (%s)' % ', '.join('%s %d장' % (n, g) for n, g in zip(names, got))


def w_scene(s, lv, o, svg=None):
    if svg:
        app_svg(s, svg, 165)
    s.text('휴양림의 여섯 곳에서 어떤 두 양을 비교할 수 있는지 써 보세요.')
    rows = [['곳', '상황', '비교하는 두 양']]
    ans = []
    for i, sp in enumerate(DATA['spots']):
        sit, cmpq = [x.strip() for x in sp['d'].split('→')]
        give = lv == '기본형' and i == 0
        rows.append([sp['t'], rd(sit), rd(cmpq) if give else ''])
        if not give:
            ans.append('%s: %s' % (sp['t'], re.sub(r'(을|를) 비교해요\.$', '', flat(cmpq))))
    s.table(rows, col_mm=[30, 92, 58], row_h=3300)
    return '; '.join(ans)


def w_error(s, lv, msg, *_):
    raise RuntimeError('앱 원본의 활동을 읽지 못했어요: ' + msg)


WIDGETS = {'quiz': w_quiz, 'blanks': w_blanks, 'sequence': w_sequence, 'writeStep': w_write,
           'ra4Chain': w_chain, 'ra4Seq': w_seq, 'fig': w_fig, 'tbl': w_tbl, 'calc': w_calc,
           'ra4Build': w_build, 'ra4Slots': w_slots, 'ra4Choc': w_choc, 'ra4Comp': w_comp, 'ra4Rect': w_rect,
           'ra4Map': w_map, 'ra4Tape2': w_tape2, 'ra4Grid': w_grid, 'ra4Link': w_link, 'ra4Save': w_save,
           'ra4Make': w_make, 'ra4Same': w_same, 'ra4Memory': w_memory, 'ra4High': w_high, 'ra4Scene': w_scene,
           'error': w_error}
SVG_W = {'ra4Build', 'ra4Slots', 'ra4Choc', 'ra4Comp', 'ra4Rect', 'ra4Map', 'ra4Tape2', 'ra4Grid', 'ra4Link', 'ra4Save',
         'ra4Make', 'ra4Same', 'ra4Memory', 'ra4High', 'ra4Scene'}


def run_calls(s, lv, calls):
    out = []
    for c in calls:
        if c['w'] not in WIDGETS:
            raise RuntimeError('활동지에 아직 없는 부품: %s — gen_u4-ratio61.py의 WIDGETS에 더하세요' % c['w'])
        if c['w'] in SVG_W:
            out.append(WIDGETS[c['w']](s, lv, c['args'][0], c.get('svg')))
        else:
            out.append(WIDGETS[c['w']](s, lv, *c['args']))
    return ' / '.join(a for a in out if a)


# ================================================================ 글로 된 문장제 답 확인(앱의 답 = 따로 계산한 값)
def chain_rows(calls):
    for c in calls:
        if c['w'] == 'ra4Chain':
            yield from c['args'][0]
        elif c['w'] == 'ra4Seq':
            for p in c['args'][0]:
                yield from chain_rows(p['calls'])
        elif c['w'] in SVG_W and (c['args'][0] or {}).get('ask'):
            yield from c['args'][0]['ask']


def row_ans(L, start):
    allc = [c for st_ in L['steps'] for c in st_['calls']] + (L['ch']['calls'] if L.get('ch') else [])
    for r in chain_rows(allc):
        rp = row_parts(r)
        if rp['full'].startswith(start) or (rp['tag'] or '') == start:
            return [a if ':' in a else P(a) for a in rp['ans'] if not re.search(r'[가-힣]', a)]
    raise AssertionError('앱에서 줄을 찾지 못했어요: ' + start)


def check_words(D):
    """글로 된 문제의 답을 파이썬으로 따로 계산해 앱의 답과 견줘요."""
    Ls = {L['id']: L for L in D['lessons']}
    F = Fraction
    pc = lambda a, b: F(a * 100, b)
    exp = [
        ('t2', '모노레일 두 대에', [F(12)]),
        ('t3', '구슬 35개 중', ['22 : 13']),
        ('t4', '전시회 입장객', [F(165, 300), F(165, 300)]),
        ('t5', '하늘시: ', [F(2500000, 1600)]),
        ('t5', '바다시: ', [F(1740000, 1200)]),
        ('t5', '가 자동차는', [F(60, 12), F(90, 15)]),
        ('t5', '곰 인형', [F(63, 150), F(72, 160)]),
        ('t5', '1반은', [F(20, 25), F(15, 20)]),
        ('t5', '가 도시는', [F(150000, 375), F(135000, 270)]),
        ('t6', '자전거 50대 중', [pc(37, 50)]),
        ('t7', '장난감 할인 금액', [F(5500 - 3300)]),
        ('t7', '희망 은행', [pc(6300, 210000)]),
        ('t7', '행복 은행', [pc(4800, 120000)]),
        ('t7', '가 공장은', [pc(9, 450), pc(15, 500)]),
        ('t7', '알뜰 은행은', [pc(2100, 70000), pc(3200, 80000)]),
        ('t7', '티셔츠', [pc(2000, 25000), pc(2940, 42000)]),
        ('t7', '아름 공연장은', [pc(185, 250), pc(165, 220)]),
        ('t7', '두부는', [pc(3680 - 3200, 3200), pc(5310 - 4500, 4500)]),
        ('t8', '줄이려는 전기 사용량: 15', [F(27)]),
        ('t10', '사과잼', [pc(1200, 8000)]),
        ('t10', '까닭: 여학생', [pc(25 - 10, 25)]),
    ]
    for lid, start, want in exp:
        got = row_ans(Ls[lid], start)
        assert got == want, ('답 확인 필요', lid, start, got, want)
        CHECKS[0] += 1



# ================================================================ 차시
WHY = {   # 도전형 '왜' 쓰기(차시 id → 물음, 예시 답)
    't1': ('두 양을 비교할 때 ‘몇 배’로 나타내면 좋은 점을 생활 속 예를 들어 써 보세요.',
           '예) 텔레비전 화면이 커져도 가로가 세로의 몇 배인지는 같아서 모양을 비교할 수 있어요.'),
    't2': ('두 양이 함께 늘어날 때 뺄셈보다 나눗셈으로 비교하는 것이 좋은 까닭을 써 보세요.',
           '예) 반죽이 늘어나면 차이는 2컵, 4컵, 6컵으로 변하지만 밀가루는 언제나 물의 3배라서 관계를 한 수로 나타낼 수 있어요.'),
    't3': ('1 : 4와 4 : 1이 서로 다른 비인 까닭을 기준량을 넣어 써 보세요.',
           '예) 1 : 4는 4가 기준량이고 4 : 1은 1이 기준량이에요. 기준이 다르니 서로 다른 비예요.'),
    't4': ('가로와 세로가 다른 두 메모지의 비율이 같을 수 있는 까닭을 써 보세요.',
           '예) 가로 5 cm·세로 3 cm와 가로 10 cm·세로 6 cm는 세로 ÷ 가로가 모두 0.6이에요. 비율은 길이가 아니라 몇 배인지를 나타내요.'),
    't5': ('지도에서 거리의 비율을 구할 때 단위를 같게 해야 하는 까닭을 써 보세요.',
           '예) 1 cm와 300 m를 그대로 나누면 1 : 300이 되어 틀려요. 300 m = 30000 cm로 바꾸어야 1 : 30000이에요.'),
    't6': ('기준량이 다른 두 비율을 백분율로 나타내면 비교하기 쉬운 까닭을 써 보세요.',
           '예) 백분율은 기준량을 모두 100으로 같게 한 비율이라 35 %와 32 %처럼 수만 보고 바로 비교할 수 있어요.'),
    't7': ('할인 금액의 비율을 구할 때 할인한 뒤의 가격으로 나누면 안 되는 까닭을 써 보세요.',
           '예) 할인 금액의 비율은 판매 금액이 기준량이에요. 할인한 뒤의 가격은 기준량도 비교하는 양도 아니에요.'),
    't8': ('지난달 전기 사용량이 다른 두 집의 절약 계획을 백분율로 비교하는 까닭을 써 보세요.',
           '예) 줄이는 양(kWh)만 보면 사용량이 많은 집이 유리해요. 백분율로 나타내면 지난달에 비해 얼마나 줄였는지 공평하게 비교할 수 있어요.'),
    't9': ('비율이 같은 카드를 찾을 때 같은 표현으로 바꾸어 비교하는 까닭을 써 보세요.',
           '예) 3 : 5와 0.6처럼 모양이 달라도 비율이 같을 수 있어요. 모두 소수로 바꾸면 0.6 = 0.6으로 바로 알 수 있어요.'),
    't10': ('비, 비율, 백분율의 관계를 2 : 5를 예로 들어 써 보세요.',
            '예) 2 : 5는 5에 대한 2의 비이고, 비율은 2 ÷ 5 = 2/5 = 0.4예요. 0.4에 100을 곱한 40 %가 백분율이에요.'),
}

# 앱의 조작 안내를 종이에 맞게 바꾼 글(차시 id, 단계 번호 또는 'ch') → 안내
PAPER_INST = {
    ('t9', 2): '친구와 놀이를 해요. 카드 2장을 뒤집어 두 카드의 비율이 같은지 판단하고, 같으면 카드를 가져와요. 카드를 더 많이 가져간 사람이 이겨요.',
    ('t9', 'ch'): '또 다른 놀이: 네 사람이 비율 카드를 동시에 한 장씩 뒤집고, 비율이 가장 높은 사람이 뒤집은 카드를 모두 가져가요. 4판부터는 규칙을 바꾸어 비율이 가장 낮은 사람이 가져가요. 지도서의 비율 카드 24장으로 6판을 해요.',
}


def show_inst(s, lv, inst, hints, key=None):
    t = PAPER_INST.get(key) or paper(inst)
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
        s.text('※ 식 줄은 분수를 위아래로 썼어요. 글 속에서는 ‘5분의 3’처럼 읽는 말로 썼어요. 네모 칸에는 수를 써요. '
               '‘(예)’가 붙은 답은 조건에 맞으면 다른 답도 맞아요.')
    ans = []
    for i, st_ in enumerate(L['steps']):
        lab = st_['name'] or STEP_NAMES[min(i, len(STEP_NAMES) - 1)]
        s.step('%s %s' % (NUM[i], lab))
        show_inst(s, lv, st_['inst'], st_['hints'], (L['id'], i))
        ans.append('%s %s' % (NUM[i], run_calls(s, lv, st_['calls'])))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('ch'):
            s.step('%s ★ 도전하기' % NUM[n], '앱의 도전 문제')
            show_inst(s, lv, L['ch']['inst'], [], (L['id'], 'ch'))
            ans.append('%s %s' % (NUM[n], run_calls(s, lv, L['ch']['calls'])))
            n += 1
        q, a = WHY[L['id']]
        s.step('%s 생각 쓰기' % NUM[n], '왜 그럴까요?')
        s.ask(rd(q), blank=False)
        s.lines(2)
        ans.append('%s %s' % (NUM[n], a))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


DATA = {}

# 이야기 버전 차시 함수(아직 없음 — 생기면 st1, st2, … 를 넣으세요)
ST = []


def build_file(kind, lv):
    src = SRC_TB if kind == 'tb' else SRC_ST
    D = cap(src)
    DATA.clear()
    DATA.update(D)
    check_words(D)
    label = '교과서 차시' if kind == 'tb' else '이야기 버전'
    s = Sheet(unit_label='6-1 수학 %s(%s)' % (UNIT_NAME, label), level=lv, grade_label='6학년')
    if kind == 'tb':
        lines = [tb_lesson(s, lv, L, i == 0, D.get('story')) for i, L in enumerate(D['lessons'])]
    else:
        lines = [f(s, lv) for f in ST]
    s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT_NAME, label, lv), lines,
              note='※ 이 활동지는 앱 u4-ratio.html과 차시 번호가 같습니다. 정답의 ‘3/5’는 분수 5분의 3을 뜻해요. '
                   '‘(예)’가 붙은 답은 조건에 맞으면 다른 답도 맞아요.')
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
    print('계산 확인 %d곳' % CHECKS[0])
    bad = 0
    for p in out:
        prob = check(p)
        bad += bool(prob)
        print(p, 'OK' if not prob else '\n  ' + '\n  '.join(prob))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
