# -*- coding: utf-8 -*-
"""6-2 수학 4. 비례식과 비례배분 활동지(교과서 차시 버전[·이야기 버전] × 기본형·도전형) 만들기

    python3 gen_u4-ratio.py            # 만들 수 있는 것을 모두 만들고 점검
    python3 gen_u4-ratio.py tb         # 교과서 차시 버전만

앱 원본 ../units/sem2/u4-ratio.tb.js('새 활용 체험관 비례식과 비례배분', 10차시: 1·2·3·4·5·6·7·8~9·10·11)의
UNIT·LESSONS를 node에서 그대로 실행해(활동 부품 대신 기록하는 함수를 넣어 render를 부름) 활동마다 넘긴 설정
(물음·보기·정답·빈칸 줄·재료 세트·두 줄 수직선·띠·비 카드)을 모읍니다(CAP_JS). 그래서 차시 번호·제목·S.O.O.P.·
탐구 질문·이야기·수가 앱과 같고, 원본의 수가 바뀌면 다시 돌리기만 하면 활동지도 따라 바뀝니다.
  - 빈칸 줄(rp4Chain)의 '=' 식·비례식·'→' 로 이은 비는 채운 답으로 분수(Fraction)로 다시 계산해 값이 같은지 assert로 확인하고,
    재료 표·톱니바퀴 표·두 줄 수직선·비례배분·비 카드 짝·간단한 자연수의 비는 이 스크립트가 따로 계산해 씁니다.
  - 그림: 체험관·재료 세트·톱니바퀴·다보탑·액자는 앱의 처음 그림(SVG)을 그대로, 직사각형(비의 성질·넓이)·두 줄 수직선·띠·
    모눈·비 카드는 수에 맞는 비율로 이 스크립트가 그립니다. 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
  - 분수: 식 줄은 그림으로 분수를 위아래로 쓰고(빈칸은 네모), 글 속 분수는 '5분의 3'처럼 읽는 말로 씁니다(정답 쪽은 3/5).

    python3 gen_u4-ratio.py st         # 이야기 버전만

이야기 버전(2026-10-16): ../units/sem2/u4-ratio.st.js('우리 반 초록 텃밭 프로젝트', 1~7, 8~9, 10, 11차시)를 같은 방법으로 읽어
sem2-soop/sheets/에 만듭니다(ST = 차시 id 목록 ST_IDS). 이야기 버전에만 있는 것: 계획표 글 상자(rp4sNote)·설계도(rp4sPlan)·
텃밭 둘러보기(rp4sGarden), 엔진의 panes(보여요·생각해요·궁금해요)·thenWhy(활동 뒤 '왜 그럴까요?')·ruleFirst(활동 앞
'먼저 예상해요')·wonderRecall, writeStep의 쓰기 틀(help)과 모범 답(ans). 문장제 답은 check_words_st가 따로 계산해 견줍니다.
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

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade6/math
UNITS = os.path.join(ROOT, '_build', 'units', 'sem2')
SRC_TB = os.path.join(UNITS, 'u4-ratio.tb.js')
SRC_ST = os.path.join(UNITS, 'u4-ratio.st.js')
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
NAME = '4단원_비례식과비례배분_활동지_%s.hwpx'
UNIT_NAME = '4. 비례식과 비례배분'
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨'
KO = '㉠㉡㉢㉣㉤㉥㉦'
WORK = tempfile.mkdtemp(prefix='u4ratio_')
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


def eul(word, a='을', b='를'):
    """우리말 낱말 끝 받침에 맞는 조사(받침 있으면 a)"""
    ch = str(word).strip()[-1:]
    if '가' <= ch <= '힣':
        return a if (ord(ch) - 0xAC00) % 28 else b
    return a if jong(str(word)) else b


def ro(num):
    """수 뒤 '(으)로': 3 → 으로, 2 → 로, 1 → 로"""
    return '으로' if jong(str(num)) == 'o' else '로'


def flat(t):
    """[2 1/4] → 2 1/4 (정답 쪽 표기), 빈칸 {x} → x"""
    t = re.sub(r'\{([^}]*)\}', r'\1', str(t))
    t = re.sub(r'\[(?:(\d+) )?([^\[\]/ ]+)/([^\[\]]+)\]', lambda m: ('%s ' % m.group(1) if m.group(1) else '') + '%s/%s' % (m.group(2), m.group(3)), t)
    return t


PAPER_RULES = [
    (r'배울 차례대로 스티커를 붙이듯 눌러 보세요\.', '배울 차례대로 기호를 써 보세요.'),
    (r'놀이 순서대로 눌러 보세요\.', '놀이 순서대로 기호를 써 보세요.'),
    (r'이 앱이 정한', '앱에서 정한'),
    (r'체험 부스를 모두 눌러 ', '체험 부스를 모두 살펴보며 '),
    (r'만들어 보고,? ', '만든다고 생각하고 '),
    (r'줄여 보고,? ', '줄인다고 생각하고 '),
    (r'(빨간색 톱니바퀴)를 (\d+)바퀴 돌려 보고, ', r'\1가 \2바퀴 회전할 때 '),
    (r'\(교과서 카드와 다를 수 있어요\)', '(교과서 카드와 다를 수 있어요)'),
    (r'배우는 차례대로 눌러 ', '배우는 차례대로 기호를 써서 '),      # 이야기 버전
    (r'‘초록 텃밭 계획표’를 보고, 세 칸에 써서 붙여요\.', '초록 텃밭 계획표를 보고, 세 칸에 써 보세요.'),
    (r'텃밭 곳곳을 모두 눌러 ', '텃밭 곳곳을 모두 살펴보며 '),
    (r'늘려 보고,? ', '늘린다고 생각하고 '),
]
INTERACT = re.compile(r'눌러|누르|누를|끌어|돌려 보세요|‘[^’]*’를 ')


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
const all = fs.readFileSync(process.argv[2], 'utf8');
const unitSrc = all.slice(all.indexOf('//@@UNIT'), all.indexOf('//@@LESSONS'));
eval(unitSrc.replace(/^(const|let) /gm, 'var '));
quiz = rec('quiz'); blanks = rec('blanks');
const api = new Proxy({}, { get: () => () => {} });
const ORIG = {};
const sub = run => { const save = REC; REC = []; try { run(); } catch (e) { REC.push({ w: 'error', args: [String(e && e.stack || e).slice(0, 400)] }); } const r = REC; REC = save; return r; };
['rp4Build', 'rp4Machine', 'rp4Simp', 'rp4Terms', 'rp4Area', 'rp4Dbl', 'rp4Gear', 'rp4Tape', 'rp4Clay', 'rp4Dice', 'rp4Rect', 'rp4Scene', 'rp4Hand', 'rp4Meet', 'rp4Match', 'rp4sGarden'].forEach(name => {
  if (eval('typeof ' + name) !== 'function') return;     // 이야기 버전에는 없는 부품(rp4Scene)·교과서에는 없는 부품(rp4sGarden)
  ORIG[name] = eval(name);
  const w = function (body, ap, opt) {
    opt = Object.assign({}, opt || {});
    let svg = null;
    try { const fb = new El('div'); const s0 = REC; REC = []; ORIG[name](fb, api, opt); REC = s0; const s = findSvg(fb); if (s) svg = String(s); } catch (e) { svg = null; }
    if (typeof opt.ask === 'function') opt.ask = opt.ask();
    if (typeof opt.text === 'function') { const f = opt.text; opt.texts = (opt.cards || []).map(c => f(c)); delete opt.text; }
    REC.push({ w: name, args: [opt], svg });
  };
  eval(name + ' = w');
});
rp4Chain = function (body, ap, lines, opt) { REC.push({ w: 'rp4Chain', args: [lines, opt || {}] }); };
rp4Seq = function (body, ap, parts) {
  REC.push({ w: 'rp4Seq', args: [parts.map(p => ({ title: p.title || null, calls: sub(() => (p.run || p)(new El('div'), api)) }))] });
};
rp4Recipe = function (title, lines) { REC.push({ w: 'recipe', args: [title, lines] }); return new El('div'); };
// 이야기 버전: 글 상자·설계도 그림, 엔진의 탐구 도우미(thenWhy 활동 뒤 '왜?', ruleFirst 활동 앞 '예상', wonderRecall '궁금해요' 다시 보기)·panes
if (typeof rp4sNote === 'function') rp4sNote = function (title, lines) { REC.push({ w: 'note', args: [title, lines] }); return new El('div'); };
if (typeof rp4sPlan === 'function') { const P0 = rp4sPlan; rp4sPlan = function () { REC.push({ w: 'plan', args: [String(P0())] }); return new El('div'); }; }
var panes = rec('panes');
var thenWhy = (f, o) => function (b, a) { const r = f(b, a); REC.push({ w: 'thenWhy', args: [o] }); return r; };
var ruleFirst = (f, o) => function (b, a) { REC.push({ w: 'ruleFirst', args: [o] }); return f(b, a); };
var wonderRecall = f => function (b, a) { REC.push({ w: 'wonderRecall', args: [] }); return f(b, a); };
const lesSrc = all.slice(all.indexOf('//@@LESSONS'));
eval(lesSrc.replace(/^(const|let) /gm, 'var '));
const run = S => sub(() => S.render(new El('div'), api));
const handSrc = all.slice(all.indexOf('function rp4Hand('));
const order = JSON.parse(handSrc.match(/const order = (\[[^\]]*\])/)[1]);
const sceneSrc = all.slice(all.indexOf('function rp4Scene('), all.indexOf('function rp4Scene(') + 6000);
const spots = [...sceneSrc.matchAll(/\{ x: \d+, t: "([^"]+)", ok: (?:true|false), say: "([^"]+)"/g)].map(m => ({ t: m[1], say: m[2] }));
const gi = all.indexOf('function rp4sGarden(');
const gspots = gi < 0 ? [] : [...all.slice(gi, gi + 6000).matchAll(/\{ x: \d+, t: "([^"]+)", say: "([^"]+)"/g)].map(m => ({ t: m[1], say: m[2] }));
const out = { story: UNIT_STORY, cards: RP4_CARDS, handOrder: order, spots, gspots, lessons: LESSONS.map(L => ({
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
        if it.get('ans'):          # 이야기 버전
            s.ask(rd(it['q']), blank=False)
            if lv == '기본형' and len(it.get('help') or []) > 1:
                s.text('도움: ' + rd(it['help'][1]))
                s.lines(2)
            else:
                s.lines(3)
            out.append('(예) ' + flat(it['ans']))
            continue
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


def w_recipe(s, lv, title, lines, *_):
    s.labeled([('조리법', title + '\n' + '\n'.join('%s %s' % (NUM[i], rd(l)) for i, l in enumerate(lines)))], row_h=5600)
    return ''


def w_chain(s, lv, rows, opt=None, *_):
    return render_rows(s, rows)


def w_seq(s, lv, parts, *_):
    out = []
    for p in parts:
        if p.get('title'):
            s.text('▶ ' + rd(p['title']))
        a = run_calls(s, lv, p['calls'])
        if a:
            out.append(a)
    return ' / '.join(out)


def ask_part(s, o):
    return render_rows(s, o['ask']) if o.get('ask') else ''


def w_build(s, lv, o, svg=None):
    its = [it for it in o['items'] if it['name'] != o['what']]
    K = max(o['start'], o['target'])
    if svg:
        app_svg(s, svg, min(150, 30 * o['start'] + 4), viewbox='0 0 %d 210' % (118 * o['start'] - 2))
    s.text(rd('%s %d%s%s 만드는 재료예요. %s %d%s일 때 필요한 재료의 양을 표에 써 보세요.'
              % (o['what'], o['start'], o['unit'], eul(o['unit']), o['what'], o['target'], o['unit'])))
    rows = [['%s 수(%s)' % (o['what'], o['unit'])] + [str(k) for k in range(1, K + 1)]]
    ans = []
    for it in its:
        r = ['%s(%s)' % (it['name'], it['unit'])]
        for k in range(1, K + 1):
            v = it['per'] * k
            if k == o['start'] or (lv == '기본형' and k == 1 and k != o['target']):
                r.append(str(v))
            else:
                r.append('')
                ans.append('%s %d%s일 때 %s %d%s' % (o['what'], k, o['unit'], it['name'], v, unit_sp(it['unit'])))
        rows.append(r)
    s.table(rows, col_mm=[52] + [128 / K] * K)
    a = ask_part(s, o)
    return '표: ' + ', '.join(ans) + (' / ' + a if a else '')


def rect_grid_fig(s, rects, cell=34, gx=None, gy=None, max_mm=170):
    """모눈 위 직사각형들: [(가로, 세로, 이름, 색)]"""
    gx = gx or sum(r[0] for r in rects) + 3 * len(rects) - 1
    gy = gy or max(r[1] for r in rects) + 1
    ox, oy = 20, 20 + gy * cell
    out = ['<g stroke="#DCE4E0" stroke-width="1.5">']
    for i in range(gx + 1):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d"/>' % (ox + i * cell, oy - gy * cell, ox + i * cell, oy))
    for j in range(gy + 1):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d"/>' % (ox, oy - j * cell, ox + gx * cell, oy - j * cell))
    out.append('</g>')
    x = 1
    for w, hh, name, col in rects:
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="%s" fill-opacity=".3" stroke="%s" stroke-width="3.5"/>'
                   % (ox + x * cell, oy - hh * cell, w * cell, hh * cell, col, col))
        out.append(T(ox + (x + w / 2) * cell, oy + 26, name, 24, anchor='middle'))
        x += w + 3
    W, H = ox * 2 + gx * cell, oy + 50
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


def w_machine(s, lv, o, svg=None):
    a0, b0 = o['start']
    g = Fraction(o['goal'][0], a0)
    assert Fraction(o['goal'][1], b0) == g
    k = int(g)
    rows = [('처음', a0, b0), ('× %d' % k, a0 * k, b0 * k), ('+ %d' % k, a0 + k, b0 + k)]
    if lv == '기본형':
        rect_grid_fig(s, [(a, b, n.replace(' ', ''), c)
                          for (n, a, b), c in zip(rows, ['#2B7BD6', '#D9822B', '#7D5BD6'])], cell=40, max_mm=120)
        s.text('모눈의 직사각형은 가로 : 세로가 비를 나타내요. 모양이 같은지 비교해 보세요.')
    tb = [['전항과 후항을 바꾸는 방법', '비', '비율', '처음과 비교한 비율']]
    ans = []
    for i, (n, a, b) in enumerate(rows + [('× 0', 0, 0)]):
        if i == 0:
            tb.append(['처음', '%d : %d' % (a, b), fr_txt(Fraction(a, b)), ''])
            continue
        how = '%s%s %s' % (n[2:], '을' if jong(n[2:]) else '를', '더하기' if n[0] == '+' else '곱하기')
        tb.append(['전항과 후항에 ' + how, '(    ) : (    )', '', '같아요 / 달라요 / 비교할 수 없어요'])
        if b:
            same = Fraction(a, b) == Fraction(a0, b0)
            ans.append('%s → %d : %d, 비율 %s, %s' % (n, a, b, fr_txt(Fraction(a, b)), '같아요' if same else '달라요'))
        else:
            ans.append('× 0 → 0 : 0, 비교할 수 없어요')
    s.table(tb, col_mm=[52, 36, 26, 66])
    a = ask_part(s, o)
    return '표: ' + '; '.join(ans) + (' / ' + a if a else '')


def dec_digits(t):
    m = re.fullmatch(r'\d*\.(\d+)', str(t))
    return len(m.group(1)) if m else 0


def w_simp(s, lv, o, svg=None):
    A, B = P(o['a']), P(o['b'])
    show = lambda t, m: '[%s]' % t if m in ('frac', 'mix') else str(t)
    v = A / B
    best = '%d : %d' % (v.numerator, v.denominator)
    if o.get('ask'):
        eq_fig(s, ['%s : %s' % (show(o['a'], o['ma']), show(o['b'], o['mb']))], fs=40)
        return ask_part(s, o) + ' (가장 간단한 자연수의 비 %s)' % best
    rows = []
    if o.get('need') == 'a2dec':
        ad = num_txt(A)
        k = 10 ** max(dec_digits(ad), dec_digits(o['b']))
        x, y = P(ad) * k, B * k
        rows.append('%s = {%s}' % (show(o['a'], o['ma']), ad))
        mid = '%s : %s' % (ad, o['b'])
    else:
        dg = dec_digits(o['b'])
        bn = int(P(o['b']) * 10 ** dg)
        bf = '%d/%d' % (bn, 10 ** dg)
        k = A.denominator * 10 ** dg // gcd(A.denominator, 10 ** dg)
        x, y = A * k, P(bf) * k
        rows.append('%s = [{%d}/{%d}]' % (o['b'], bn, 10 ** dg))
        mid = '%s : [%s]' % (show(o['a'], o['ma']), bf)
    assert x.denominator == 1 and y.denominator == 1
    x, y = int(x), int(y)
    gg = gcd(x, y)
    assert Fraction(x // gg, y // gg) == v
    if lv == '기본형':
        rows.append('%s →(×%d)→ {%d} : {%d} →(÷%d)→ {%d} : {%d}' % (mid, k, x, y, gg, x // gg, y // gg))
    else:
        rows.append('%s → {%d} : {%d} → {%d} : {%d}' % (mid, x, y, x // gg, y // gg))
    for r in rows:
        check_full(flat(r))
    eq_fig(s, rows)
    return ', '.join(flat(r) for r in rows)


def w_terms(s, lv, o, svg=None):
    ans = []
    s.text('비례식에서 바깥쪽에 있는 두 수(외항)에 ◯, 안쪽에 있는 두 수(내항)에 △를 하고 아래에 써 보세요.')
    for i, (a, b, c, d) in enumerate(o['props']):
        assert Fraction(a, b) == Fraction(c, d), (a, b, c, d)
        lab = '%s ' % KO[i] if len(o['props']) > 1 else ''
        eq_fig(s, ['%s%d  :  %d  =  %d  :  %d' % (lab, a, b, c, d)], fs=44, max_mm=110)
        s.fill('외항: (        ,        )      내항: (        ,        )')
        ans.append('%s외항 %d, %d · 내항 %d, %d' % (lab, a, d, b, c))
    return ' / '.join(ans)


def w_area(s, lv, o, svg=None):
    p = list(o['p'])
    u = p.index(None)
    known = p[1] * p[2] if u in (0, 3) else p[0] * p[3]
    partner = {0: p[3], 3: p[0], 1: p[2], 2: p[1]}[u]
    v = Fraction(known, partner)
    assert v.denominator == 1
    q = list(p)
    q[u] = int(v)
    assert q[0] * q[3] == q[1] * q[2]
    lab = ['□' if i == u else str(x) for i, x in enumerate(p)]
    s.text('비례식 %s : %s=%s : %s' % tuple(lab))
    if lv == '기본형':
        M = max(q)
        sc = 300 / M
        out = []
        x0 = 70
        for nm, w, hh, wl, hl, col in (('외항의 곱', q[0], q[3], lab[0], lab[3], '#D9822B'), ('내항의 곱', q[1], q[2], lab[1], lab[2], '#2B7BD6')):
            W, H = max(w * sc, 14), max(hh * sc, 14)
            out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" fill-opacity=".25" stroke="%s" stroke-width="3"/>'
                       % (x0, 360 - H, W, H, col, col))
            out.append(T(x0 + W / 2, 384, wl, 24, anchor='middle'))
            out.append(T(x0 - 8, 360 - H / 2, hl, 24, anchor='end'))
            out.append(T(x0 + W / 2, 360 - H - 22, nm, 22, anchor='middle', fill=col))
            x0 += max(W, tw(nm, 22)) + 110
        Wd = int(x0)
        put_png(s, svg_doc(Wd, 400, ''.join(out)), Wd, 400, max_mm=120)
        s.text('두 직사각형의 넓이(외항의 곱과 내항의 곱)가 같아지는 □를 찾아요.')
    a = ask_part(s, o)
    return a or '□ = %d' % v


def dbl_fig(s, lv, o):
    gt, gb = o['given']
    at, tmax = o['askAt'], o['tmax']
    tk = o['top']['tick']
    L, x0, yT, yB = 940, 150, 80, 210
    X = lambda val: x0 + val / tmax * L
    out = []
    for y, nm in ((yT, o['top']['name']), (yB, o['bot']['name'])):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3"/>' % (x0, y, x0 + L + 20, y, INK))
        out.append(T(x0 - 18, y, nm, 22, anchor='end', weight='bold'))
    n = int(tmax // tk)
    for i in range(n + 1):
        tv = i * tk
        bv = Fraction(tv * gb, gt)
        x = X(tv)
        for y in (yT, yB):
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2.4"/>' % (x, y - 10, x, y + 10, INK))
        show_top = lv == '기본형' or tv in (0, gt, at)
        if show_top:
            out.append(T(x, yT - 30, num_txt(tv), 21, anchor='middle'))
        if tv == at:
            out.append('<rect x="%.1f" y="%d" width="60" height="38" rx="6" fill="#fff" stroke="#C8472E" stroke-width="3"/>' % (x - 30, yB + 20))
        elif tv in (0, gt):
            out.append(T(x, yB + 38, num_txt(bv), 21, anchor='middle', fill='#2E6B5A' if tv else INK))
    out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#2E6B5A" stroke-width="3" stroke-dasharray="6 5"/>' % (X(gt), yT + 12, X(gt), yB - 12))
    out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#C8472E" stroke-width="3" stroke-dasharray="6 5"/>' % (X(at), yT + 12, X(at), yB - 12))
    out.append(T(x0 + L + 30, yT, '(%s)' % o['top']['unit'], 19, fill='#555'))
    out.append(T(x0 + L + 30, yB, '(%s)' % o['bot']['unit'], 19, fill='#555'))
    W, H = x0 + L + 90, yB + 76
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=175)


def w_dbl(s, lv, o, svg=None):
    gt, gb = o['given']
    at = o['askAt']
    ab = Fraction(at * gb, gt)
    assert ab.denominator == 1
    dbl_fig(s, lv, o)
    s.text(rd('%s %s%s일 때 %s %s%s예요. 두 줄 수직선의 빨간 네모에 %s %s%s의 짝을 써 보세요.'
              % (o['top']['name'], num_txt(gt), unit_sp(o['top']['unit']), o['bot']['name'], num_txt(gb), unit_sp(o['bot']['unit']),
                 o['top']['name'], num_txt(at), unit_sp(o['top']['unit']))).replace('%s예요' % num_txt(gb), num_txt(gb) + ('이에요' if jong(num_txt(gb)) else '예요'), 1))
    a = ask_part(s, o)
    return '수직선 %s%s → %s%s' % (num_txt(at), unit_sp(o['top']['unit']), num_txt(ab), unit_sp(o['bot']['unit'])) + (' / ' + a if a else '')


def w_gear(s, lv, o, svg=None):
    r, b, tg = o['r'], o['b'], o['target']
    if svg:
        app_svg(s, svg, 80, viewbox='70 10 390 280')
    s.text('빨간색 톱니바퀴가 %d바퀴 회전할 때 파란색 톱니바퀴는 %d바퀴 회전해요. 표를 완성해 보세요.' % (r, b))
    ks = list(range(r, tg + 1, r))
    rows = [['빨간색(바퀴)'] + [str(k) for k in ks], ['파란색(바퀴)'] + [str(b) if i == 0 else '' for i, k in enumerate(ks)]]
    ans = []
    for i, k in enumerate(ks):
        v = Fraction(k * b, r)
        assert v.denominator == 1
        if i:
            ans.append(str(v))
    s.table(rows, header=True, header_col=True, col_mm=[34] + [146 / len(ks)] * len(ks))
    a = ask_part(s, o)
    return '표: ' + ', '.join(ans) + (' / ' + a if a else '')


def tape_fig(s, lv, o):
    N, (p, q) = o['N'], o['ratio']
    L, x0, y0, TH = 960, 30, 50, 70
    out = []
    if N <= 20:      # 셀 수 있는 것: 한 개씩 칸
        cwid = L / N
        for i in range(N):
            out.append('<rect x="%.1f" y="%d" width="%.1f" height="%d" rx="8" fill="#FFF8E6" stroke="%s" stroke-width="2.5"/>'
                       % (x0 + i * cwid + 4, y0, cwid - 8, TH, INK))
            out.append(T(x0 + (i + .5) * cwid, y0 + TH / 2, str(i + 1), 22, anchor='middle', fill='#999'))
        if lv == '기본형' and N % (p + q) == 0 and N > p + q:
            g = N // (p + q)
            for j in range(1, p + q):
                x = x0 + j * g * cwid
                out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="#C8472E" stroke-width="3" stroke-dasharray="8 6"/>' % (x, y0 - 14, x, y0 + TH + 14))
        cap_ = '전체 %d%s' % (N, unit_sp(o['unit']))
    else:
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#FFF8E6" stroke="%s" stroke-width="3"/>' % (x0, y0, L, TH, INK))
        if lv == '기본형':
            for j in range(1, p + q):
                x = x0 + j * L / (p + q)
                out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="2" stroke-dasharray="7 6"/>' % (x, y0, x, y0 + TH, INK))
        cap_ = '전체 %s%s' % (N, unit_sp(o['unit']))
    out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.5"/>' % (x0, y0 + TH + 34, x0 + L, y0 + TH + 34, INK))
    for x in (x0, x0 + L):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2.5"/>' % (x, y0 + TH + 24, x, y0 + TH + 44, INK))
    out.append('<rect x="%.1f" y="%d" width="%.1f" height="30" fill="#fff"/>' % (x0 + L / 2 - tw(cap_, 22) / 2 - 10, y0 + TH + 19, tw(cap_, 22) + 20))
    out.append(T(x0 + L / 2, y0 + TH + 34, cap_, 22, anchor='middle'))
    W, H = x0 * 2 + L, y0 + TH + 64
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=170)


def w_tape(s, lv, o, svg=None):
    N, (p, q) = o['N'], o['ratio']
    a1, a2 = Fraction(N * p, p + q), Fraction(N * q, p + q)
    assert a1.denominator == 1 and a2.denominator == 1
    a1, a2 = int(a1), int(a2)
    tape_fig(s, lv, o)
    nm = o['names']
    if N <= 20:
        s.text(rd('%s %d%s를 %d : %d%s 나누어 %s의 몫과 %s의 몫을 서로 다른 색으로 칠해 보세요.'
                  % (o.get('icon') == 'wallet' and '지갑' or '전체', N, o['unit'], p, q, ro(q), nm[0], nm[1]))
               + (' 빨간 점선은 %d개씩 나눈 묶음이에요.' % (N // (p + q)) if lv == '기본형' and N % (p + q) == 0 and N > p + q else ''))
    else:
        s.text('띠를 %d : %d%s 나누어 %s의 몫과 %s의 몫을 서로 다른 색으로 칠해 보세요.' % (p, q, ro(q), nm[0], nm[1])
               + (' 점선은 띠를 %d등분한 선이에요.' % (p + q) if lv == '기본형' else ''))
    if o.get('ask'):
        return ask_part(s, o)
    rows = [['%s: ' % nm[0], {'i': str(a1)}, unit_sp(o['unit'])], ['%s: ' % nm[1], {'i': str(a2)}, unit_sp(o['unit'])]]
    return render_rows(s, rows)


def w_clay(s, lv, o, svg=None):
    cards, tot, nm, u = o['cards'], o['total'], o['names'], o['unit']
    s.text('보기의 비 카드')
    cards_fig(s, cards, max_mm=120)
    t0 = o['texts'][0]
    t0 = re.sub(re.escape(cards[0]) + r'(으로|로)', '(      :      )(으)로', t0, count=1)
    assert '(      :' in t0, t0
    s.fill(rd(t0))
    s.text('비 카드를 %d장 골라 문제를 %d개 완성하고, 답을 구해 보세요.' % (o['need'], o['need']))
    rows = []
    for k in range(o['need']):
        rows.append(('고른 비 (   :   )', '%s: %d × [□/□] = {%s} %s' % (nm[0], tot, '0' * len(str(tot)), u)))
        rows.append(('', '%s: %d × [□/□] = {%s} %s' % (nm[1], tot, '0' * len(str(tot)), u)))
    eq_fig(s, rows)
    ans = []
    for c in cards:
        a, b = (int(x) for x in c.split(':'))
        x, y = Fraction(tot * a, a + b), Fraction(tot * b, a + b)
        assert x.denominator == 1 and y.denominator == 1
        ans.append('%s → %s %s %s, %s %s %s' % (c, nm[0], x, u, nm[1], y, u))
        check_full('%d × [%d/%d] = %s' % (tot, a, a + b, x))
    return '(고른 비에 따라) ' + '; '.join(ans)


def w_dice(s, lv, o, svg=None):
    base = o['base']
    s.text('주사위를 두 번 던져 나온 눈의 수를 차례대로 비로 나타내고, 그 비와 %d : □의 비율이 같도록 □를 구해 보세요.' % base)
    rows = [['회', '나온 눈', '비례식', '□', '외항의 곱 = 내항의 곱']]
    if lv == '기본형':
        a, b = 3, 2
        v = Fraction(base * b, a)
        rows.append(['예', '%d, %d' % (a, b), '%d : %d=%d : □' % (a, b, base), str(v), '%d × %s = %d × %d' % (a, v, b, base)])
        assert a * v == b * base
    for i in range(o.get('need', 2) + (0 if lv == '기본형' else 1)):
        rows.append([str(i + 1), '(   ), (   )', '(   ) : (   )=%d : □' % base, '', ''])
    s.table(rows, col_mm=[14, 30, 52, 22, 62], row_h=3600)
    for a in range(1, 7):
        for b in range(1, 7):
            assert (base * b) % a == 0
    return '학생마다 달라요(예: 3, 2 → 3 : 2=%d : %d, 3×%d = 2×%d = %d)' % (base, base * 2 // 3, base * 2 // 3, base, base * 2)


def w_rect(s, lv, o, svg=None):
    bw, bh = o['base']
    gx, gy, cell = 14, 10, 34
    ox, oy = 20, 20 + gy * cell
    out = ['<g stroke="#C9D3CF" stroke-width="1.5">']
    for i in range(gx + 1):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d"/>' % (ox + i * cell, oy - gy * cell, ox + i * cell, oy))
    for j in range(gy + 1):
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d"/>' % (ox, oy - j * cell, ox + gx * cell, oy - j * cell))
    out.append('</g><rect x="%d" y="%d" width="%d" height="%d" fill="#2B7BD6" fill-opacity=".15" stroke="#2B7BD6" stroke-width="3" stroke-dasharray="7 5"/>'
               % (ox, oy - bh * cell, bw * cell, bh * cell))
    W, H = ox * 2 + gx * cell, oy + 20
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=120)
    what = o.get('what') or '액자'
    s.text('파란 점선은 가로 %d칸, 세로 %d칸인 %s예요. 왼쪽 아래 모서리를 같게 하여 가로와 세로의 비가 %d : %d와 비율이 같은 더 큰 %s%s 그려 보세요.'
           % (bw, bh, what, bw, bh, what, eul(what)))
    s.fill('내가 그린 ' + what + ': 가로 : 세로 = (      ) : (      )  →  %d : %d의 전항과 후항에 (      )을/를 곱한 비예요.' % (bw, bh))
    ex = ['%d : %d' % (bw * k, bh * k) for k in range(2, 10) if bw * k <= gx and bh * k <= gy]
    return '(예) ' + ', '.join(ex)


def w_scene(s, lv, o, svg=None):
    if svg:
        app_svg(s, svg, 170)
    s.text('체험관의 다섯 부스에서 두 양을 비교하거나 주어진 양을 나누는 상황을 찾아 써 보세요.')
    rows = [['체험 부스', '무엇과 무엇을 비교할까요? (또는 무엇을 나눌까요?)']]
    ans = []
    for i, sp in enumerate(DATA['spots']):
        say = sp['say']
        rows.append([sp['t'], rd(say) if lv == '기본형' and i == 0 else ''])
        if not (lv == '기본형' and i == 0):
            ans.append('%s: %s' % (sp['t'], flat(say)))
    s.table(rows, col_mm=[44, 136], row_h=3400)
    return '; '.join(ans)


def hand_example():
    cards, order = DATA['cards'], DATA['handOrder']
    pk = []
    for i in order:
        if len(pk) < 4 and all(ratio_of(cards[i]) != ratio_of(cards[k]) for k in pk):
            pk.append(i)
    return pk


def w_hand(s, lv, o, svg=None):
    cards, order = DATA['cards'], DATA['handOrder']
    cards_fig(s, [cards[i] for i in order], per_row=7)
    ans = []
    if lv == '기본형':
        s.text('카드마다 간단한 자연수의 비로 나타내 보세요. 간단한 자연수의 비가 같으면 비율이 같아요.')
        half = (len(order) + 1) // 2
        rows = [['비 카드', '간단한 자연수의 비', '비 카드', '간단한 자연수의 비']]
        for r in range(half):
            row = []
            for i in (order[r], order[r + half] if r + half < len(order) else None):
                if i is None:
                    row += ['', '']
                else:
                    row += [rd(cards[i]), '(     ) : (     )']
            rows.append(row)
        s.table(rows, col_mm=[40, 50, 40, 50], row_h=3300)
        ans.append('간단한 비: ' + ', '.join('%s → %s' % (flat(cards[i]), simplest(cards[i])) for i in order))
    s.fill('비율이 다른 카드 4장을 골라 써 보세요:  (            ),  (            ),  (            ),  (            )')
    ans.append('(예) ' + ', '.join(flat(cards[i]) for i in hand_example()) + ' — 비율이 같은 카드끼리 함께 고르지 않으면 맞아요')
    return ' / '.join(ans)


def partner(i):
    cards = DATA['cards']
    ps = [j for j in range(len(cards)) if j != i and ratio_of(cards[j]) == ratio_of(cards[i])]
    assert len(ps) == 1, cards[i]
    return ps[0]


def w_meet(s, lv, o, svg=None):
    cards = DATA['cards']
    hand = hand_example()
    others = [i for i in range(len(cards)) if i not in hand and all(ratio_of(cards[i]) != ratio_of(cards[k]) for k in hand)]
    seq = []
    for r in range(o.get('rounds', 6)):
        seq.append(partner(hand[r // 2 % len(hand)]) if r % 2 == 0 else others[(r // 2) % len(others)])
    s.text(rd('내 카드가 %s일 때 친구들이 차례로 카드를 보여 주었어요. 비율이 같은 내 카드를 쓰고, 없으면 ‘없음’을 써 보세요.'
              % ', '.join(cards[i] for i in hand)))
    rows = [['만난 친구', '친구가 보여 준 카드', '비율이 같은 내 카드', '그다음 할 일']]
    ans = []
    for r, f in enumerate(seq):
        rows.append(['%d번째' % (r + 1), rd(cards[f]), '', '가위바위보 / 다른 친구 만나기'])
        m = [k for k in hand if ratio_of(cards[k]) == ratio_of(cards[f])]
        ans.append('%d) %s' % (r + 1, ('%s, 가위바위보' % flat(cards[m[0]])) if m else '없음, 다른 친구 만나기'))
    s.table(rows, col_mm=[24, 46, 46, 64], row_h=3300)
    return ', '.join(ans)


def w_match(s, lv, o, svg=None):
    cards = o['cards']
    need = o.get('need') or len(cards) // 2
    cards_fig(s, cards, per_row=7 if len(cards) > 8 else 4 if len(cards) > 4 else len(cards))
    pairs, used = [], set()
    for i, c in enumerate(cards):
        if i in used:
            continue
        js = [j for j in range(i + 1, len(cards)) if j not in used and ratio_of(cards[j]) == ratio_of(c)]
        if js:
            used.update((i, js[0]))
            pairs.append('%s=%s' % (flat(c), flat(cards[js[0]])))
    assert len(pairs) >= need, (cards, pairs)
    s.text('비율이 같은 두 비를 찾아 비례식을 세워 보세요.' + (' 짝이 없는 카드도 있어요.' if len(pairs) * 2 < len(cards) else ''))
    s.fill(['비례식%s:  (                    ) = (                    )' % (' ' + NUM[k] if need > 1 else '') for k in range(need)])
    if o.get('timer'):
        s.ask('걸린 시간:  (      )분 (      )초', blank=False)
    return ', '.join(pairs[:need] if need == 1 else pairs)


# ---------------------------------------------------------------- 이야기 버전 부품
EMOJI = re.compile('[\U0001F000-\U0001FFFF\u2600-\u27BF\uFE0F\u200D]')


def noemo(t):
    return re.sub(r'\s{2,}', ' ', EMOJI.sub('', str(t))).strip()


def w_note(s, lv, title, lines, *_):
    s.labeled([('계획표', noemo(title) + '\n' + '\n'.join('· ' + rd(noemo(l)) for l in lines))], row_h=1100 * (len(lines) + 1))
    return ''


def w_plan(s, lv, svg, *_):
    app_svg(s, svg, 110)
    return ''


def w_panes(s, lv, items, *_):
    s.labeled([(p['t'], ('(' + p['ph'] + ')') if lv == '기본형' else '') for p in items], row_h=3400)
    return '(자유) ' + ' / '.join('%s: 예) %s' % (p['t'], flat(p['ex'][0])) for p in items if p.get('ex'))


def w_thenwhy(s, lv, o, *_):
    s.ask('왜 그럴까요?  ' + rd(o['q']), blank=False)
    if lv == '기본형' and len(o.get('help') or []) > 1:
        s.text('도움: ' + rd(o['help'][1]))
        s.lines(2)
    else:
        s.lines(3)
    return '왜? (예) ' + flat(o['ans'])


def w_rulefirst(s, lv, o, *_):
    s.ask('먼저 예상해요.  ' + rd(o['q']), blank=False)
    if lv == '기본형' and len(o.get('help') or []) > 1:
        s.text('도움: ' + rd(o['help'][1]))
    s.lines(2)
    s.text('▶ 아래 활동을 마친 뒤, 내 예상이 맞았는지 확인해 보세요.   맞았어요 (   )   고쳐야 해요 (   )')
    return '예상 → 실제 규칙: ' + flat(o['ans'])


def w_wonder(s, lv, *_):
    s.ask('1차시에 내가 쓴 ‘궁금해요’를 다시 써 보세요.', blank=False)
    s.lines(1)
    return ''


def w_garden(s, lv, o, svg=None):
    if svg:
        app_svg(s, svg, 170)
    s.text('텃밭 다섯 곳에서 두 양을 비교하는 상황과 주어진 양을 나누는 상황을 찾아 써 보세요.')
    rows = [['텃밭 곳곳', '무엇과 무엇을 비교할까요? (또는 무엇을 나눌까요?)']]
    ans = []
    for i, sp in enumerate(DATA['gspots']):
        rows.append([sp['t'], rd(sp['say']) if lv == '기본형' and i == 0 else ''])
        if not (lv == '기본형' and i == 0):
            ans.append('%s: %s' % (sp['t'], flat(sp['say'])))
    assert len(rows) == 6, rows
    s.table(rows, col_mm=[44, 136], row_h=3400)
    return '; '.join(ans)


def w_error(s, lv, msg, *_):
    raise RuntimeError('앱 원본의 활동을 읽지 못했어요: ' + msg)


WIDGETS = {'quiz': w_quiz, 'blanks': w_blanks, 'sequence': w_sequence, 'writeStep': w_write, 'recipe': w_recipe,
           'rp4Chain': w_chain, 'rp4Seq': w_seq, 'rp4Build': w_build, 'rp4Machine': w_machine, 'rp4Simp': w_simp,
           'rp4Terms': w_terms, 'rp4Area': w_area, 'rp4Dbl': w_dbl, 'rp4Gear': w_gear, 'rp4Tape': w_tape,
           'rp4Clay': w_clay, 'rp4Dice': w_dice, 'rp4Rect': w_rect, 'rp4Scene': w_scene, 'rp4Hand': w_hand,
           'rp4Meet': w_meet, 'rp4Match': w_match, 'error': w_error,
           'note': w_note, 'plan': w_plan, 'panes': w_panes, 'thenWhy': w_thenwhy, 'ruleFirst': w_rulefirst,
           'wonderRecall': w_wonder, 'rp4sGarden': w_garden}
SVG_W = {'rp4Build', 'rp4Machine', 'rp4Simp', 'rp4Terms', 'rp4Area', 'rp4Dbl', 'rp4Gear', 'rp4Tape', 'rp4Clay', 'rp4Dice',
         'rp4Rect', 'rp4Scene', 'rp4Hand', 'rp4Meet', 'rp4Match', 'rp4sGarden'}


def run_calls(s, lv, calls):
    out = []
    for c in calls:
        if c['w'] not in WIDGETS:
            raise RuntimeError('활동지에 아직 없는 부품: %s — gen_u4-ratio.py의 WIDGETS에 더하세요' % c['w'])
        if c['w'] in SVG_W:
            out.append(WIDGETS[c['w']](s, lv, c['args'][0], c.get('svg')))
        else:
            out.append(WIDGETS[c['w']](s, lv, *c['args']))
    return ' / '.join(a for a in out if a)


# ================================================================ 글로 된 문장제 답 확인(앱의 답 = 따로 계산한 값)
def chain_rows(calls):
    for c in calls:
        if c['w'] == 'rp4Chain':
            yield from c['args'][0]
        elif c['w'] == 'rp4Seq':
            for p in c['args'][0]:
                yield from chain_rows(p['calls'])
        elif c['w'] in SVG_W and (c['args'][0] or {}).get('ask'):
            yield from c['args'][0]['ask']


def row_ans(L, start):
    allc = [c for st_ in L['steps'] for c in st_['calls']] + (L['ch']['calls'] if L.get('ch') else [])
    for r in chain_rows(allc):
        rp = row_parts(r)
        if rp['full'].startswith(start) or (rp['tag'] or '') == start:
            return [P(re.sub(r'^\(예\) ', '', a)) if ':' not in a else a for a in rp['ans']]
    raise AssertionError('앱에서 줄을 찾지 못했어요: ' + start)


def check_words(D):
    Ls = {L['id']: L for L in D['lessons']}
    pr = lambda a, b, c: Fraction(b * c, a)            # a : b = c : □
    dist = lambda n, p, q: [Fraction(n * p, p + q), Fraction(n * q, p + q)]
    exp = [
        ('t6', '밀가루와 물을', [pr(5, 4, 15)]),
        ('t6', '가로와 세로의 비가 5 : 7', [Fraction(5 * 28, 7)]),
        ('t6', '과자 8봉지가', [pr(8, 6800, 12)]),
        ('t6', '6시간에 18분씩', [Fraction(6 * 27, 18)]),
        ('t7', '연필 20자루를', dist(20, 1, 3)),
        ('t7', '14000원짜리', dist(14000, 4, 3)),
        ('t7', '색종이 40장을', dist(40, 3, 5)),
        ('t7', '1시간 동안', dist(60, 2, 3)[1:]),
        ('t5', '비례식 20 : ㉠=4 : ㉡', [Fraction(100, 20), Fraction(100, 4)]),
        ('t5', '4 : 9=㉠ : ㉡', [Fraction(180, 9), Fraction(180, 4)]),
        ('t11', '가로와 세로의 합', [Fraction(210, 2)]),
        ('t89', '파스타 면', [180 * 3, pr(2, 180, 3)]),
        ('t89', '섞은 것', [720 * 3, pr(2, 720, 3)]),
        ('t89', '찬밥', [800 * 3, pr(4, 800, 3)]),
        ('t1', '실제 다보탑의 높이: ', [105 * Fraction('9.8')]),
    ]
    for lid, start, want in exp:
        got = row_ans(Ls[lid], start)
        assert [g for g in got if not isinstance(g, str)] == want, ('답 확인 필요', lid, start, got, want)
        CHECKS[0] += 1


def check_words_st(D):
    """이야기 버전 문장제: 앱의 답 = 이 스크립트가 따로 계산한 값"""
    Ls = {L['id']: L for L in D['lessons']}
    pr = lambda a, b, c: Fraction(b * c, a)            # a : b = c : □
    dist = lambda n, p, q: [Fraction(n * p, p + q), Fraction(n * q, p + q)]
    exp = [
        ('s1', '실제 텃밭의 가로: 8 × 50', [8 * 50, Fraction(8 * 50, 100)]),
        ('s6', '60 × □', [3 * 200, pr(60, 3, 200)]),
        ('s6', '우진 · 비례식의 성질', [10 * 18, pr(4, 10, 18)]),
        ('s6', '민재 · 비율', [pr(4, 10, 18)]),
        ('s6', '소윤 · 비의 성질', [Fraction(18, 4), pr(4, 10, 18)]),
        ('s6', '퇴비와 흙을 2 : 7', [pr(2, 7, 6)]),
        ('s6', '가로와 세로의 비가 3 : 5', [Fraction(40 * 3, 5)]),
        ('s6', '씨앗 5봉지가', [pr(5, 4500, 8)]),
        ('s6', '일정하게 내리는 비에', [Fraction('7.5') * 3 / Fraction('4.5')]),
        ('s7', '씨앗 30개를', dist(30, 2, 3)),
        ('s7', '96을 5 : 3', dist(96, 5, 3)),
        ('s7', '모종값 18000원', dist(18000, 5, 4)),
        ('s7', '화분 흙 45컵', dist(45, 4, 5)),
        ('s7', '2시간 동안', dist(120, 3, 5)[1:]),
        ('s7', '경로당: 12 ×', [Fraction(1, 4), Fraction(12, 4)]),
        ('s7', '1모둠: 800 ×', [Fraction(3, 8), Fraction(800 * 3, 8)]),
        ('s5', '비례식 15 : ㉠=3 : ㉡', [Fraction(120, 15), Fraction(120, 3)]),
        ('s5', '5 : 6=㉠ : ㉡', [Fraction(210, 6), Fraction(210, 5)]),
        ('s89', '상추', [200 * 6, pr(4, 200, 6)]),
        ('s89', '섞은 것', [60 * 6, pr(4, 60, 6)]),
        ('s89', '양파: 90 ×', [Fraction(2, 5), Fraction(90 * 2, 5)]),
        ('s89', '방울토마토', [450 * 5, pr(3, 450, 5)]),
        ('s89', '3 : 240=5', [240 * 5, pr(3, 240, 5)]),
        ('s89', '우유: 400 ×', [Fraction(5, 8), Fraction(400 * 5, 8)]),
        ('s11', '1모둠: 750 ×', [Fraction(2, 5), Fraction(750 * 2, 5)]),
        ('s11', '방법 2 비례식의 성질', [200 * 7, pr(4, 7, 200)]),
        ('s11', '가로와 세로의 합', [Fraction(240, 2)]),
        ('s11', '가로: 120 ×', [Fraction(5, 12), Fraction(120 * 5, 12)]),
    ]
    for lid, start, want in exp:
        got = row_ans(Ls[lid], start)
        assert [g for g in got if not isinstance(g, str)] == want, ('답 확인 필요', lid, start, got, want)
        CHECKS[0] += 1


# ================================================================ 차시
WHY = {   # 도전형 '왜' 쓰기(차시 id → 물음, 예시 답)
    't1': ('생활에서 두 양을 비로 비교하거나 주어진 양을 나누는 상황을 하나 찾아 써 보세요.',
           '예) 친구와 돈을 3 : 2로 내고 산 과자를 낸 돈의 비로 나눌 때예요.'),
    't2': ('비의 전항과 후항에 같은 수를 더하면 비율이 달라지는 까닭을 1 : 2를 예로 들어 써 보세요.',
           '예) 1 : 2에 2를 더하면 3 : 4가 되어 비율이 1/2에서 3/4으로 바뀌어요. 곱하거나 나눌 때만 비율이 같아요.'),
    't3': ('[2/3] : [4/9]에 9 대신 18을 곱해도 되는 까닭을 써 보세요.',
           '예) 18도 두 분모 3과 9의 공배수라서 12 : 8이 되고, 공약수 4로 나누면 똑같이 3 : 2가 돼요.'),
    't4': ('외항과 내항을 전항·후항과 어떻게 구별하는지 써 보세요.',
           '예) 전항·후항은 비 하나에서 앞과 뒤이고, 외항·내항은 비례식 전체에서 바깥쪽 두 수와 안쪽 두 수예요.'),
    't5': ('비례식에서 외항의 곱과 내항의 곱이 언제나 같은 까닭을 써 보세요.',
           '예) 뒤의 비는 앞의 비에 같은 수(■)를 곱한 것이라 두 곱이 모두 (네 수 중 두 수)×■로 같은 수들의 곱이 돼요.'),
    't6': ('비례식을 세울 때 두 비의 차례를 같게 써야 하는 까닭을 써 보세요.',
           '예) 시간 : 거리 = 거리 : 시간처럼 차례가 다르면 비율이 같은 두 비가 아니어서 □를 잘못 구해요.'),
    't7': ('지갑 10개를 2 : 3으로 나눌 때 10을 2등분이나 3등분하지 않고 5등분하는 까닭을 써 보세요.',
           '예) 2 : 3은 전체를 2만큼과 3만큼으로 나누는 것이라 전체를 (2+3)=5만큼 똑같이 나누어야 해요.'),
    't89': ('조리법이 몇 인분 기준인지 먼저 확인해야 하는 까닭을 써 보세요.',
            '예) 기준 인분과 만들 인분으로 비례식을 세우므로, 기준이 4인분인데 2인분으로 보면 재료의 양이 틀려요.'),
    't10': ('3 : 4와 4 : 3으로 비례식을 세울 수 없는 까닭을 써 보세요.',
            '예) 3 : 4의 비율은 3/4, 4 : 3의 비율은 4/3으로 달라요. 비율이 같은 두 비만 비례식이 돼요.'),
    't11': ('비례식과 비례배분 중 생활에서 가장 쓸모 있다고 생각하는 것과 그 까닭을 써 보세요.',
            '예) 비례배분이에요. 친구와 낸 돈의 비로 물건을 공평하게 나눌 수 있어요.'),
}


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


def split_name(n):
    m = re.match(r'^(.*?)\s*([①-⑧])\s*$', n or '')
    return (m.group(1) + ' ' + m.group(2), None) if m else (n, None)


def tb_lesson(s, lv, L, first, story):
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if first and story:
        s.scene(None, rd(story['lines'][0]))
        s.text('※ 식 줄은 분수를 위아래로 썼어요. 글 속에서는 ‘5분의 3’처럼 읽는 말로 썼어요. 네모 칸에는 수를 써요. '
               '‘(예)’가 붙은 답은 비율이 같으면 다른 답도 맞아요.')
    ans = []
    hard = HARD_TB.get(L['id']) if lv == '도전형' else None      # 도전형 ①~⑤는 새 문제
    assert hard is None or len(hard) == len(L['steps']), ('도전형 새 문제 수가 계단 수와 달라요', L['id'])
    for i, st_ in enumerate(L['steps']):
        lab = st_['name'] or STEP_NAMES[min(i, len(STEP_NAMES) - 1)]
        s.step('%s %s' % (NUM[i], lab))
        if hard:
            show_inst(s, lv, hard[i][0], [])
            ans.append('%s %s' % (NUM[i], run_calls(s, lv, hard[i][1])))
            continue
        show_inst(s, lv, st_['inst'], st_['hints'])
        ans.append('%s %s' % (NUM[i], run_calls(s, lv, st_['calls'])))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('ch'):
            s.step('%s ★ 도전하기' % NUM[n], '앱의 도전 문제')
            show_inst(s, lv, L['ch']['inst'], [])
            ans.append('%s %s' % (NUM[n], run_calls(s, lv, L['ch']['calls'])))
            n += 1
        q, a = WHY[L['id']]
        s.step('%s 생각 쓰기' % NUM[n], '왜 그럴까요?')
        s.ask(rd(q), blank=False)
        s.lines(2)
        ans.append('%s %s' % (NUM[n], a))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


WHY_ST = {   # 이야기 버전 도전형 '왜' 쓰기
    's1': ('텃밭이 아닌 생활에서 두 양을 비로 비교하거나 주어진 양을 나누는 상황을 하나 찾아 써 보세요.',
           '예) 미숫가루 2숟가락에 우유 1컵을 섞을 때, 친구와 낸 돈의 비로 과자를 나눌 때예요.'),
    's2': ('상토 3컵에 퇴비 2컵을 섞은 흙과 상토 4컵에 퇴비 3컵을 섞은 흙이 같지 않은 까닭을 비율로 써 보세요.',
           '예) 3 : 2의 비율은 3/2, 4 : 3의 비율은 4/3으로 달라요. 같은 수를 곱하거나 나눌 때만 비율이 같아요.'),
    's3': ('물 1.2 L와 영양제 0.3 L를 4 : 1로 나타내도 섞인 정도가 같은 까닭을 써 보세요.',
           '예) 1.2 : 0.3의 전항과 후항에 10을 곱하고 3으로 나누었으니 비의 성질에 따라 비율이 4로 같아요.'),
    's4': ('4 : 30=8 : 60에서 외항과 내항을 전항·후항과 어떻게 구별하는지 써 보세요.',
           '예) 전항·후항은 비 하나에서 앞과 뒤이고, 외항·내항은 비례식 전체에서 바깥쪽 두 수(4, 60)와 안쪽 두 수(30, 8)예요.'),
    's5': ('비례식 3 : 7=12 : □에서 □를 구할 때 외항의 곱과 내항의 곱을 쓰면 편리한 까닭을 써 보세요.',
           '예) 3 × □ = 7 × 12 = 84처럼 곱셈식 하나로 바꾸어 84 ÷ 3 = 28을 바로 구할 수 있어요.'),
    's6': ('물 펌프 문제에서 4 : 10=□ : 18처럼 세우면 안 되는 까닭을 써 보세요.',
           '예) 앞의 비는 시간 : 물의 양, 뒤의 비는 물의 양 : 시간이라 차례가 달라서 비율이 같은 두 비가 아니에요.'),
    's7': ('상추 12봉지를 1 : 3으로 나눌 때 12를 3등분하지 않고 4등분하는 까닭을 써 보세요.',
           '예) 1 : 3은 1만큼과 3만큼으로 나누는 것이라 전체를 (1+3)=4만큼 똑같이 나누어야 해요.'),
    's89': ('방울토마토 주스 조리법이 몇 인분 기준인지 먼저 확인해야 하는 까닭을 써 보세요.',
            '예) 기준 인분과 만들 인분으로 비례식을 세우므로, 3인분 기준을 4인분으로 보면 재료의 양이 틀려요.'),
    's10': ('5 : 4와 4 : 5로 비례식을 세울 수 없는 까닭을 써 보세요.',
            '예) 5 : 4의 비율은 5/4, 4 : 5의 비율은 4/5로 달라요. 비율이 같은 두 비만 비례식이 돼요.'),
    's11': ('둘레가 240 cm인 꽃밭 틀에서 240을 그대로 5 : 7로 나누면 안 되는 까닭을 써 보세요.',
            '예) 둘레는 가로와 세로를 두 번씩 더한 길이라서, 가로와 세로의 합 120 cm를 5 : 7로 나누어야 해요.'),
}


def st_lesson(s, lv, L, first, story):
    """이야기 버전 한 차시: 앱의 계단 이름 '만져 보기 — 모종 화분 두 개' → ① 만져 보기 | 모종 화분 두 개"""
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if first and story:
        s.scene(None, rd(story['lines'][0] + ' ' + story['lines'][1]))
        s.text('※ 식 줄은 분수를 위아래로 썼어요. 글 속에서는 ‘5분의 3’처럼 읽는 말로 썼어요. 네모 칸에는 수를 써요. '
               '‘(예)’가 붙은 답은 비율이 같으면 다른 답도 맞아요.')
    ans = []
    hard = HARD_ST.get(L['id']) if lv == '도전형' else None      # 도전형 ①~⑤는 새 문제
    assert hard is None or len(hard) == len(L['steps']), ('도전형 새 문제 수가 계단 수와 달라요', L['id'])
    for i, st_ in enumerate(L['steps']):
        nm = st_['name'] or STEP_NAMES[min(i, len(STEP_NAMES) - 1)]
        if hard and len(hard[i]) > 2:           # 계단 이름에 든 수도 새 문제에 맞게
            nm = hard[i][2]
        main, _, sub = nm.partition(' — ')
        s.step('%s %s' % (NUM[i], main.strip()), sub.strip() or None)
        if hard:
            show_inst(s, lv, hard[i][0], [])
            ans.append('%s %s' % (NUM[i], run_calls(s, lv, hard[i][1])))
            continue
        show_inst(s, lv, st_['inst'], st_['hints'])
        ans.append('%s %s' % (NUM[i], run_calls(s, lv, st_['calls'])))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('ch'):
            s.step('%s ★ 도전하기' % NUM[n], '앱의 도전 문제')
            show_inst(s, lv, re.sub(r'^★ 도전 — ', '', L['ch']['inst']), [])
            ans.append('%s %s' % (NUM[n], run_calls(s, lv, L['ch']['calls'])))
            n += 1
        q, a = WHY_ST[L['id']]
        s.step('%s 생각 쓰기' % NUM[n], '왜 그럴까요?')
        s.ask(rd(q), blank=False)
        s.lines(2)
        ans.append('%s %s' % (NUM[n], a))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


DATA = {}

# 이야기 버전 차시(앱 u4-ratio.st.js의 LESSONS id 차례 — 1~7, 8~9, 10, 11차시)
ST_IDS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's89', 's10', 's11']


def _st(lid):
    def f(s, lv):
        Ls = DATA['lessons']
        k = [L['id'] for L in Ls].index(lid)
        return st_lesson(s, lv, Ls[k], k == 0, DATA.get('story'))
    f.__name__ = 'st_' + lid
    return f


ST = [_st(lid) for lid in ST_IDS]



# ================================================================ 도전형 새 문제(2026-10-30)
# 도전형 ①~⑤는 기본형과 다른 수·상황으로 새로 씁니다(_build/sheets_hard/BRIEF.md). 앱 부품과 같은 꼴(rp4Chain 등)로 적어
# 같은 그리기·채점 코드를 쓰므로, 채운 줄의 비례식·식·'→'로 이은 비는 check_full()이 다시 확인합니다.
# 그림이 수를 보여 주는 앱 부품(rp4Build·rp4Dbl·rp4Tape 등)은 그림 없이 식 줄·고르기로 바꾸었습니다.
def _i(x):
    return {'i': str(x)}


def _f(t):
    return {'f': t}


def _r(a, b, any_=False):
    d = {'r': [a, b]}
    if any_:
        d['any'] = True
    return d


def _c(o, a=0):
    return {'c': o, 'a': a}


def _chain(*rows):
    return {'w': 'rp4Chain', 'args': [list(rows), {}]}


def _blanks(*parts):
    return {'w': 'blanks', 'args': [[p if isinstance(p, str) else {'o': p[0], 'a': p[1]} for p in parts], {}]}


def _quiz(*items):
    return {'w': 'quiz', 'args': [[{'q': q, 'o': o, 'a': a} for q, o, a in items], {}]}


def _seqs(*calls):
    return {'w': 'rp4Seq', 'args': [[{'title': t, 'calls': c} for t, c in calls]]}


def _write_tb(*items):
    return {'w': 'writeStep', 'args': [[{'q': q, 'tag': t, 'ph': '예) ' + a} for t, q, a in items]]}


def _write(*items):
    return {'w': 'writeStep', 'args': [[{'q': q, 'tag': t, 'ans': a} for t, q, a in items]]}


def _why(q, a):
    return {'w': 'thenWhy', 'args': [{'q': q, 'ans': a}]}


def _rule(q, a):
    return {'w': 'ruleFirst', 'args': [{'q': q, 'ans': a}]}


def _panes(*items):
    return {'w': 'panes', 'args': [[{'t': t, 'ph': ph, 'ex': [ex]} for t, ph, ex in items]]}


def _note(title, lines):
    return {'w': 'note', 'args': [title, lines]}


def _seqcards(items, order):
    return {'w': 'sequence', 'args': [items, order, {}]}


def _clay(total, cards, names, unit, text0):
    """비례배분 문제 만들기(rp4Clay): 첫 보기 카드로 쓴 문장을 바탕으로"""
    t = [text0.replace('{}', c + ('으로' if c.endswith(('3', '6', '0')) else '로')) for c in cards]
    return {'w': 'rp4Clay', 'args': [{'total': total, 'cards': cards, 'need': 2, 'names': names, 'unit': unit, 'texts': t}]}


def _split(n, a, b):
    """n을 a : b로 비례배분"""
    x, y = Fraction(n * a, a + b), Fraction(n * b, a + b)
    assert x.denominator == 1 and y.denominator == 1, (n, a, b)
    return int(x), int(y)


HARD_TB = {
    't1': [
        ('새 활용 체험관 입구에 종이로 만든 탑 모형이 있어요. 모형의 높이는 80 cm이고, 모형의 높이와 실제 탑의 높이의 비는 1 : 10이에요. 물음에 답해 보세요.',
         [_chain(['실제 탑의 높이는 80 × 10 = ', _i(800), ' cm예요.'], ['실제 탑의 높이에 대한 모형의 높이의 비율은 ', _f('1/10'), '이에요.'])]),
        ('이 단원에서 배울 내용을 예로 들었어요. 배울 차례대로 기호를 써 보세요.',
         [_seqcards(['㉠ 지갑 10개를 2 : 3으로 나누기', '㉡ 1 : 2와 2 : 4의 비율 견주기', '㉢ 6 : 20=12 : 40처럼 나타내기', '㉣ 0.8 : 0.2를 4 : 1로 나타내기',
                     '㉤ 열차가 45분 동안 간 거리 구하기', '㉥ 외항의 곱과 내항의 곱 견주기'], [1, 3, 2, 5, 4, 0])]),
        ('6학년 1학기에 배운 비와 비율을 떠올려요. 노란색 물감 4컵과 초록색 물감 5컵을 섞었어요.',
         [_chain(['노란색 물감 양과 초록색 물감 양의 비: ', _r(4, 5)],
                 ['4 : 5에서 기준량은 ', _i(5), ', 비교하는 양은 ', _i(4), '이에요.'],
                 ['비율을 분수로 ', _f('4/5'), ', 소수로 ', _i('0.8'), ', 백분율로 ', _i(80), ' %'],
                 ['노란색 물감 양에 대한 초록색 물감 양의 비율은 ', _f('5/4'), '이에요.'])]),
        ('두 양을 비교하는 상황과 주어진 양을 나누는 상황을 구별해 보세요.',
         [_quiz(('주어진 양을 비로 나누는 상황을 모두 골라요.', ['구슬 30개를 형과 동생이 2 : 3으로 나누기', '설탕과 물을 1 : 4로 섞은 정도 비교하기',
                                                  '색종이 48장을 두 모둠이 5 : 3으로 나누기', '두 사진의 가로와 세로의 비 비교하기'], [0, 2]))]),
        ('생활에서 비율이 같은 두 비를 떠올려 답해 보세요.',
         [_quiz(('설탕과 물을 2 : 7로 섞어요. 설탕을 6컵 넣으면 물은 몇 컵 넣어야 맛이 같을까요?', ['13컵', '21컵', '11컵'], 1),
                ('사진을 크게 출력했더니 가로가 3배가 되었어요. 모양이 같으려면 세로는 어떻게 되어야 할까요?', ['그대로', '2배', '3배'], 2))]),
    ],
    't2': [
        ('필통 한 개를 만드는 데 단추 2개와 자투리 가죽 3장이 필요해요. 필통 수에 따른 단추 수와 가죽 수의 비와 비율을 비교해 보세요.',
         [_chain({'t': '필통 한 개', 'p': ['단추 수와 가죽 수의 비 ', _r(2, 3), ', 비율 ', _f('2/3')]},
                 {'t': '필통 세 개', 'p': ['단추 수와 가죽 수의 비 ', _r(6, 9), ', 비율 ', _f('6/9')]},
                 ['두 비율은 ', _c(['같아요', '달라요'], 0), '.'])]),
        ('4 : 7의 전항과 후항에 여러 가지 계산을 해 보고 비율을 비교해 보세요.',
         [_chain(['4 : 7의 전항과 후항에 ', _i(3), '을 곱하면 12 : 21이 돼요.'],
                 ['4 : 7의 전항과 후항에 2를 더한 6 : 9는 4 : 7과 비율이 ', _c(['같아요', '달라요'], 1), '.'],
                 ['4 : 7의 전항과 후항에 0을 곱한 0 : 0은 ', _c(['비율을 구할 수 없어요', '비율이 같아요'], 0), '.'])]),
        ('“달걀 9개와 식빵 6장으로 샌드위치를 세 개 만들 수 있어요.” 샌드위치 한 개일 때와 비교해 보세요.',
         [_chain({'t': '샌드위치 세 개', 'p': ['달걀 수와 식빵 수의 비 ', _r(9, 6), ', 비율 ', _f('9/6')]},
                 {'t': '샌드위치 한 개', 'p': ['달걀 수와 식빵 수의 비 ', _r(3, 2), ', 비율 ', _f('3/2')]},
                 ['9 : 6의 전항과 후항을 ', _i(3), '으로 나누면 3 : 2가 돼요.'])]),
        ('12 : 18을 예로 비의 성질을 정리해요.',
         [_blanks('12 : 18에서 12는 ', (['전항', '후항'], 0), ', 18은 ', (['전항', '후항'], 1), '이에요. 12 : 18의 전항과 후항을 6으로 나눈 2 : 3은 12 : 18과 비율이 ',
                  (['같아요', '달라요'], 0), '. 전항과 후항에 같은 수를 ', (['더하면', '곱하면'], 0), ' 비율이 달라질 수 있어요.')]),
        ('비의 성질을 이용하여 빈칸에 알맞은 수를 써 보세요.',
         [_chain(['5 : 8 → 5 × 4 : 8 × 4 → ', _r(20, 32)], ['63 : 45 → 63 ÷ 9 : 45 ÷ 9 → ', _r(7, 5)],
                 ['7 : 13 = 56 : ', _i(104)], ['9 : 72 = ', _i(1), ' : 8'], ['□ : 15 = 12 : 36에서 □ = ', _i(5)])]),
    ],
    't3': [
        ('“빨간색 물감 0.6 L와 노란색 물감 0.9 L를 섞어서 주황색 물감을 만들어야지.” 0.6 : 0.9를 간단한 자연수의 비로 나타내 보세요.',
         [_chain(['0.6 : 0.9 → 전항과 후항에 10을 곱하면 ', _r(6, 9)], ['6 : 9 → 전항과 후항을 3으로 나누면 ', _r(2, 3)])]),
        ('[3/4] : [5/6]을 간단한 자연수의 비로 나타내 보세요.',
         [_chain(['[3/4] : [5/6] → ', _r(9, 10)], ['전항과 후항에 두 분모 4와 6의 ', _c(['최소공배수 12', '최대공약수 2'], 0), '를 곱했어요.'])]),
        ('[3/5] : 0.4를 두 가지 방법으로 간단한 자연수의 비로 나타내 보세요.',
         [_chain({'t': '분수로 바꾸기', 'p': ['[3/5] : [4/10] → ', _r(6, 4), ' → ', _r(3, 2)]},
                 {'t': '소수로 바꾸기', 'p': ['0.6 : 0.4 → ', _r(6, 4), ' → ', _r(3, 2)]})]),
        ('1.2 : [3/4]를 예로 간단한 자연수의 비로 나타내는 방법을 정리해요.',
         [_blanks('1.2 : [3/4]에서 [3/4]을 ', (['0.75', '0.34'], 0), '로 바꾸면 1.2 : 0.75가 되고, 전항과 후항에 ', (['100', '10'], 0),
                  '을 곱하면 120 : 75, 공약수 15로 나누면 ', (['8 : 5', '5 : 8'], 0), '예요.')]),
        ('간단한 자연수의 비로 나타내 보세요. 비율이 같은 자연수의 비라면 정답이에요.',
         [_chain(['0.8 : 1.4 → ', _r(4, 7, True)], ['[5/6] : [2/9] → ', _r(15, 4, True)], ['1.8 : [3/4] → ', _r(12, 5, True)], ['[2 1/4] : [3/8] → ', _r(6, 1, True)])]),
    ],
    't4': [
        ('친환경 신발 한 켤레에 페트병 8개와 나무껍질 30 g이 필요해요. 신발 수에 따른 페트병 수와 나무껍질양의 비와 비율을 비교해 보세요.',
         [_chain({'t': '한 켤레', 'p': ['페트병 수와 나무껍질양의 비 ', _r(8, 30), ', 비율 ', _f('8/30')]},
                 {'t': '세 켤레', 'p': ['페트병 수와 나무껍질양의 비 ', _r(24, 90), ', 비율 ', _f('24/90')]},
                 ['두 비를 비례식으로 나타내면 8 : 30=', _r(24, 90)])]),
        ('비례식 5 : 8=15 : 24에서 외항과 내항을 찾아 써 보세요.',
         [_chain(['5 : 8=15 : 24에서 외항은 ', _i(5), '와 ', _i(24), ', 내항은 ', _i(8), '과 ', _i(15), '이에요.'])]),
        ('여러 가지 비례식에서 외항과 내항을 찾아 써 보세요. 전항·후항과 헷갈리지 않게 비례식 전체에서 바깥쪽과 안쪽을 살펴요.',
         [_chain(['[1/2] : [1/3]=3 : 2에서 외항은 ', _f('1/2'), '과 ', _i(2), '예요.'], ['0.4 : 1.2=1 : 3에서 내항은 ', _i('1.2'), '와 ', _i(1), '이에요.'])]),
        ('9 : 4=27 : 12를 예로 비례식을 정리해요.',
         [_blanks('9 : 4=27 : 12에서 전항은 ', (['9와 27', '9와 4'], 0), '이고, 외항은 ', (['9와 12', '9와 27'], 0), '이에요. 비례식은 ',
                  (['비율이 같은 두 비', '전항이 같은 두 비'], 0), '를 기호 =로 나타낸 식이에요.')]),
        ('비의 성질을 이용하여 비례식을 세우고, 보기에서 5 : 6과 비율이 같은 비를 찾아보세요.',
         [_seqs((None, [_chain(['3 : 7은 전항과 후항에 ', _i(4), '를 곱한 12 : ', _i(28), '과 비율이 같으므로 비례식은 3 : 7=12 : ', _i(28)],
                               ['45 : 25는 전항과 후항을 ', _i(5), '로 나눈 ', _i(9), ' : 5와 비율이 같으므로 비례식은 45 : 25=', _i(9), ' : 5'])]),
                ('보기: [1/5] : [1/6], 1.5 : 1.8, 25 : 36', [_quiz(('5 : 6과 비율이 같은 비를 골라 비례식을 세워요.', ['[1/5] : [1/6]', '1.5 : 1.8', '25 : 36'], 1))]))]),
    ],
    't5': [
        ('“새 크레파스 1개를 만드는 데 헌 크레파스 5 g이 필요해요.” 새 크레파스 7개를 만들 때의 비례식을 세우고 외항의 곱과 내항의 곱을 비교해 보세요.',
         [_chain(['비례식: 1 : 5=', _i(7), ' : ', _i(35)], ['외항의 곱: 1 × 35 = ', _i(35)], ['내항의 곱: 5 × 7 = ', _i(35)])]),
        ('3 : 8의 전항과 후항에 3을 곱하여 비례식 3 : 8=9 : □를 세웠어요. 외항의 곱과 내항의 곱을 이용하여 □를 구해 보세요.',
         [_chain(['3 : 8=9 : □ → 3 × □ = 8 × 9 = ', _i(72), ', □ = ', _i(24)])]),
        ('외항의 곱과 내항의 곱이 왜 같은지 다른 비례식으로 확인해 보세요.',
         [_blanks('5 : 6=5×4 : 6×4이므로 외항의 곱 5×24는 ', (['5×6×4', '5×4×4'], 0), '이고, 내항의 곱 6×20은 ', (['6×5×4', '6×6×4'], 0),
                  '예요. 그래서 두 곱은 ', (['같아요', '달라요'], 0), '.')]),
        ('비례식 2 : 9=□ : 45를 예로 비례식의 성질을 정리해요.',
         [_blanks('2 : 9=□ : 45에서 외항의 곱 2×45와 내항의 곱 9×□는 ', (['같아요', '달라요'], 0), '. 그래서 9×□ = ', (['90', '45'], 0), '이고 □ = ',
                  (['10', '5'], 0), '예요.')]),
        ('비례식의 성질을 이용하여 □ 안에 알맞은 수를 구해 보세요.',
         [_chain(['7 : 4=□ : 36 → □ = ', _i(63)], ['0.6 : 1.5=4 : □ → □ = ', _i(10)], ['[1/3] : [1/4]=□ : 9 → □ = ', _i(12)], ['5 : □=35 : 63 → □ = ', _i(9)])]),
    ],
    't6': [
        ('병뚜껑 120개를 담는 데 상자 3개가 필요해요. 병뚜껑 400개를 담으려면 상자는 몇 개 필요할까요? 비례식을 세워 구해 보세요.',
         [_chain(['120 : 3=400 : □ → 120 × □ = ', _i(1200), ', □ = ', _i(10)], ['필요한 상자는 ', _i(10), '개예요.'])]),
        ('“빨간색 톱니바퀴가 3바퀴 회전할 때 파란색 톱니바퀴는 7바퀴 회전합니다.” 빨간색 톱니바퀴가 15바퀴 회전하면 파란색 톱니바퀴는 몇 바퀴 회전할까요?',
         [_chain(['3 : 7=15 : □ → 3 × □ = ', _i(105), ', □ = ', _i(35)])]),
        ('“일정한 빠르기로 달리는 열차가 12분 동안 40 km를 이동했어요.” 이 열차가 54분 동안 이동한 거리를 비례식의 성질로 구해 보세요.',
         [_chain(['12 : 40=54 : □ → 12 × □ = ', _i(2160), ', □ = ', _i(180)])]),
        ('열차가 54분 동안 이동한 거리를 다른 방법으로도 구해 보세요.',
         [_chain({'t': '비의 성질', 'p': ['12 : 40의 전항과 후항에 ', _f('9/2'), '를 곱하면 54 : ', _i(180)]},
                 {'t': '비율', 'p': ['[12/40] = [54/□]에서 □ = ', _i(180)]},
                 ['열차가 54분 동안 이동한 거리는 ', _i(180), ' km예요.'])]),
        ('비례식을 바르게 세웠는지 살펴보고, 주사위 눈으로 만든 비로 비례식을 풀어 보세요.',
         [_chain(['물 6 L를 4분 동안 넣을 때 10분 동안 넣는 물의 양을 구하는 비례식은 ', _c(['4 : 6=□ : 10', '4 : 6=10 : □', '6 : 4=10 : □'], 1), '이에요.'],
                 ['10분 동안 넣는 물은 ', _i(15), ' L예요.'], ['주사위 눈이 4, 5이면 4 : 5=60 : □ → □ = ', _i(75)])]),
    ],
    't7': [
        ('지갑 12개를 행복 새 활용 센터와 나눔 새 활용 센터에 2 : 1로 나누어 기부하려고 해요. 각 센터에 몇 개씩 기부하면 될까요?',
         [_chain(['행복 새 활용 센터: 12 × ', _f('2/3'), ' = ', _i(8), '(개)'], ['나눔 새 활용 센터: 12 × ', _f('1/3'), ' = ', _i(4), '(개)'])]),
        ('지갑 20개를 두 센터에 3 : 2로 나누려고 해요. 전체의 몇 분의 몇씩인지 알아보고 계산해 보세요.',
         [_chain(['행복 새 활용 센터: 20 × ', _f('3/5'), ' = ', _i(12), '(개)'], ['나눔 새 활용 센터: 20 × ', _f('2/5'), ' = ', _i(8), '(개)'])]),
        ('“하윤이와 승우가 종이띠 840 cm를 3 : 4로 나누어 가지려고 합니다.” 각각 몇 cm씩 가지면 되는지 구해 보세요.',
         [_chain(['하윤: 840 × ', _f('3/7'), ' = ', _i(360), ' (cm)'], ['승우: 840 × ', _f('4/7'), ' = ', _i(480), ' (cm)'])]),
        ('36을 5 : 4로 비례배분하는 방법을 정리해요.',
         [_blanks('36을 5 : 4로 비례배분하려면 전체를 ', (['9', '5', '4'], 0), '만큼 등분하여 전체의 [5/9]와 [4/9]로 나누어요. 그래서 ',
                  (['20과 16', '5와 4', '18과 18'], 0), '으로 나누어져요.')]),
        ('보기에서 비 카드 2장을 골라 문제를 완성하고, 답을 구해 보세요.',
         [_clay(960, ['3 : 1', '5 : 3', '7 : 5', '1 : 2'], ['그릇', '받침'], 'g', '점토 960 g을 {} 나누어 그릇과 받침을 만들었습니다. 그릇과 받침을 만드는 데 사용한 점토의 무게는 각각 몇 g인가요?')]),
    ],
    't89': [
        ('다음은 감자수프 조리법의 일부분이에요. 하람이가 감자수프 5인분을 만들려고 해요. 문제를 이해해 보세요.',
         [{'w': 'recipe', 'args': ['감자수프(3인분)', ['감자 450 g의 껍질을 벗겨 삶습니다.', '양파와 버섯을 2 : 3으로 섞은 것 300 g을 볶아 넣습니다.']]},
          _quiz(('조리법은 몇 인분을 기준으로 쓰여 있나요?', ['5인분', '3인분', '1인분'], 1), ('하람이가 만들려는 양은?', ['5인분', '3인분', '15인분'], 0),
                ('양파와 버섯을 섞는 비는?', ['3 : 2', '2 : 5', '2 : 3'], 2), ('문제를 해결하는 데 필요하지 않은 정보는?', ['감자 450 g', '감자 껍질을 벗긴다는 것', '섞은 것 300 g'], 1))]),
        ('해결 계획을 세워 보세요.',
         [_blanks('감자의 양은 (인분 수) : (감자의 양)으로 ', (['비례식', '비례배분'], 0), '을 세워 구하고, 양파와 버섯의 양은 섞은 것의 양을 2 : 3으로 ',
                  (['비례배분해요', '곱해요'], 0), '.')]),
        ('5인분에 필요한 감자의 양과 섞은 것의 양을 비례식으로 구해 보세요.',
         [_chain({'t': '감자', 'p': ['3 : 450=5 : □ → 3 × □ = ', _i(2250), ', □ = ', _i(750), ' (g)']},
                 {'t': '섞은 것', 'p': ['3 : 300=5 : □ → 3 × □ = ', _i(1500), ', □ = ', _i(500), ' (g)']})]),
        ('섞은 것 500 g을 양파와 버섯 2 : 3으로 나누어 보세요.',
         [_chain(['양파: 500 × ', _f('2/5'), ' = ', _i(200), ' (g)'], ['버섯: 500 × ', _f('3/5'), ' = ', _i(300), ' (g)'])]),
        ('잘 해결했는지 되돌아보고, 다른 방법도 찾아보세요.',
         [_seqs((None, [_chain(['다른 방법: 5인분은 3인분의 ', _f('5/3'), '배이므로 감자는 450 × [5/3] = ', _i(750), ' (g)'],
                               ['3인분 → 1인분 → 5인분: 450 ÷ 3 = ', _i(150), ', 150 × 5 = ', _i(750), ' (g)'])]),
                (None, [_write_tb(('해결 방법', '감자의 양을 구한 방법을 친구에게 설명하듯 써 보세요.', '3인분과 5인분의 비로 비례식 3 : 450=5 : □를 세워 □ = 750 g을 구했어요.'))]))]),
    ],
    't10': [
        ('‘짝을 찾아 비례식을 세워요’ 놀이 방법이에요. 놀이 순서대로 기호를 써 보세요. (문장을 바꾸어 썼어요.)',
         [_seqcards(['㉠ 시간이 끝나면 자리에 앉아 모은 카드로 비례식을 만들어요.', '㉡ 카드의 비율을 구해 보고, 비율이 서로 다른 카드 4장을 골라 가져요.',
                     '㉢ 교실을 다니다 친구를 만나면 카드를 한 장씩 골라 함께 보여 줘요.', '㉣ 만든 비례식을 발표하고 서로 확인해요. 비례식을 가장 많이 만든 사람이 이겨요.',
                     '㉤ 두 카드의 비율이 같으면 가위바위보를 해서 이긴 사람이 카드를 가져가요.'], [1, 2, 4, 0, 3])]),
        ('비 카드를 살펴보며 비율을 구해 보세요.',
         [_quiz(('3 : 4와 비율이 같은 카드를 모두 골라요.', ['6 : 8', '15 : 20', '0.3 : 0.4', '[1/3] : [1/4]', '4 : 3', '9 : 16'], [0, 1, 2]))]),
        ('친구가 5 : 2 카드를 보여 주었어요. 내 카드 가운데 비율이 같은 카드를 찾아보세요.',
         [_quiz(('5 : 2와 비율이 같은 카드를 모두 골라요.', ['10 : 4', '2 : 5', '25 : 10', '1.5 : 0.6'], [0, 2, 3]))]),
        ('모은 카드로 비례식을 세워 보세요.',
         [_chain(['3 : 5=', _i(12), ' : 20'], ['0.4 : 1=', _i(2), ' : 5'], ['[1/2] : [1/5]=', _i(5), ' : 2'], ['8 : ', _i(6), '=4 : 3'])]),
        ('친구들이 발표한 비례식이 맞는지 확인해 보세요.',
         [_quiz(('맞는 비례식을 모두 골라요.', ['3 : 5=6 : 10', '4 : 9=9 : 4', '[1/3] : [1/4]=4 : 3', '0.5 : 0.2=2 : 5', '10 : 15=2 : 3'], [0, 2, 4]),
                ('비례식이 맞는지 확인하는 방법으로 알맞은 것은?', ['외항의 곱과 내항의 곱이 같은지 확인해요.', '전항끼리 더해 봐요.', '후항이 같은지만 봐요.'], 0))]),
    ],
    't11': [
        ('비의 성질을 이용해요.',
         [_seqs((None, [_quiz(('18 : 24와 비율이 같은 비를 모두 골라요.', ['3 : 4', '4 : 3', '9 : 12', '36 : 50', '54 : 72'], [0, 2, 4]))]),
                (None, [_chain(['[1/4] : [3/8]=2 : ', _i(3)], ['21 : 28=', _i(3), ' : 4'])]))]),
        ('간단한 자연수의 비로 나타내 보세요.',
         [_chain(['2.4 : 3.2 → ', _r(3, 4, True)], ['[3/8] : [5/6] → ', _r(9, 20, True)], ['0.6 : [7/10] → ', _r(6, 7, True)], ['[1 1/4] : [2/3] → ', _r(15, 8, True)])]),
        ('비례식의 성질을 이용하여 □ 안에 알맞은 수를 구해 보세요.',
         [_chain(['6 : 11=42 : ', _i(77)], ['15 : 54=', _i(5), ' : 18'], ['', _i(12), ' : 7=36 : 21'], ['45 : ', _i(20), '=9 : 4'])]),
        ('비례배분과 비례식을 활용하는 문제예요.',
         [_chain({'t': '5번', 'p': ['구슬 63개를 4 : 5로 나누면 63 × [4/9] = ', _i(28), ', 63 × [5/9] = ', _i(35)]},
                 {'t': '6번', 'p': ['자동차가 3시간 동안 210 km를 가면 5시간 동안은 3 : 210=5 : □ → □ = ', _i(350), ' (km)']})]),
        ('단원에서 배운 내용을 다른 예로 정리해 보세요.',
         [_blanks('비의 전항과 후항을 0이 아닌 같은 수로 ', (['나누어도', '빼도'], 0), ' 비율은 같습니다. 3 : 8=12 : 32에서 외항은 ', (['3과 32', '8과 12'], 0),
                  '이고, 외항의 곱과 내항의 곱은 ', (['같습니다', '다릅니다'], 0), '. 30을 2 : 3으로 비례배분하면 ', (['12와 18', '2와 3', '15와 15'], 0), '이에요.')]),
    ],
}

HARD_ST = {
    's1': [
        ('텃밭 반장 지안이가 ‘가을 텃밭 계획표’를 새로 만들었어요. 계획표를 보고, 세 칸에 내 생각을 써 보세요.',
         [_note('🌿 가을 텃밭 계획표', ['🪴 화분 흙: 상토 5컵에 모래 2컵씩 섞기', '💧 액비 물 타기: 액비 원액 1컵에 물 8컵', '🥬 배추 고랑: 한 고랑에 모종 6포기, 퇴비 45 g',
                                     '🧺 수확한 무 35개를 1반과 2반이 3 : 4로 나누기']),
          _panes(('보여요', '계획표에 ~이 보여요', '상토 5컵에 모래 2컵처럼 두 양을 비로 나타낸 것이 보여요.'),
                 ('생각해요', '~할 때 비가 필요할 것 같아요', '화분을 여러 개 만들 때 상토와 모래의 비를 지켜야 흙이 같을 것 같아요.'),
                 ('궁금해요', '~은 어떻게 구할까?', '무 35개를 3 : 4로 나누면 각각 몇 개인지 어떻게 구할까?'))]),
        ('가을 텃밭 계획표에서 두 양을 비교하는 상황과 주어진 양을 나누는 상황을 찾아보세요.',
         [_quiz(('주어진 양을 비로 나누는 상황을 모두 골라요.', ['상토 5컵에 모래 2컵씩 섞기', '무 35개를 1반과 2반이 3 : 4로 나누기',
                                                  '액비 원액 1컵에 물 8컵 섞기', '고구마 60개를 두 모둠이 7 : 5로 나누기'], [1, 3])),
          _why('상토 5컵과 모래 2컵을 섞는 상황은 왜 ‘두 양을 비교하는 상황’일까요?', '전체를 나누는 것이 아니라 상토의 양과 모래의 양을 5 : 2로 비교하는 것이기 때문이에요.')]),
        ('6학년 1학기에 배운 비와 비율을 떠올려요. 텃밭 고랑 12개 중 9개에 배추를 심었어요.',
         [_chain(['배추를 심은 고랑 수와 전체 고랑 수의 비: ', _r(9, 12)],
                 ['9 : 12에서 기준량은 ', _i(12), ', 비교하는 양은 ', _i(9), '이에요.'],
                 ['비율을 분수로 ', _f('9/12'), ', 소수로 ', _i('0.75'), ', 백분율로 ', _i(75), ' %'],
                 ['배추를 심지 않은 고랑 수와 전체 고랑 수의 비는 ', _r(3, 12), '예요.'])]),
        ('가을 텃밭 계획표로 이 단원에서 배울 내용을 예로 들었어요. 배우는 차례대로 기호를 써 보세요.',
         [_seqcards(['㉠ 무 35개를 3 : 4로 나누기', '㉡ 5 : 2와 10 : 4의 비율 견주기', '㉢ 6 : 45=12 : 90처럼 나타내기', '㉣ 1.5 : 0.6을 5 : 2로 나타내기',
                     '㉤ 액비 원액 3컵에 넣을 물의 양 구하기', '㉥ 외항의 곱과 내항의 곱 견주기'], [1, 3, 2, 5, 4, 0])]),
        ('가을 텃밭 계획표를 보고 물음에 답해 보세요.',
         [_quiz(('액비 원액 3컵을 쓰면 물은 몇 컵을 넣어야 할까요?', ['11컵', '24컵', '8컵'], 1),
                ('상토와 모래를 같은 비로 섞을 때 모래를 6컵 넣으면 상토는 몇 컵 넣어야 할까요?', ['15컵', '9컵', '13컵'], 0))]),
    ],
    's2': [
        ('예린이네 모둠은 화분 1개에 상토 4컵과 퇴비 3컵을 섞어 넣어요. 먼저 규칙을 예상하고, 화분이 3개일 때와 비와 비율을 비교해 보세요.',
         [_rule('화분이 3개가 되면 상토 컵 수와 퇴비 컵 수의 비와 비율은 어떻게 될까요?', '화분이 3개가 되면 상토와 퇴비가 모두 3배가 되어 비는 12 : 9가 되지만, 비율은 [4/3]으로 같아요.'),
          _chain({'t': '화분 한 개', 'p': ['상토 수와 퇴비 수의 비 ', _r(4, 3), ', 비율 ', _f('4/3')]},
                 {'t': '화분 세 개', 'p': ['상토 수와 퇴비 수의 비 ', _r(12, 9), ', 비율 ', _f('12/9')]})], '만져 보기 — 모종 화분 세 개'),
        ('5 : 3의 전항과 후항에 여러 가지 계산을 해 보세요.',
         [_chain(['5 : 3의 전항과 후항에 ', _i(4), '를 곱하면 20 : 12가 돼요.'], ['5 : 3에서 5는 ', _c(['전항', '후항'], 0), ', 3은 ', _c(['전항', '후항'], 1), '이에요.']),
          _why('5 : 3의 전항과 후항에서 같은 수 1을 뺀 4 : 2는 왜 비율이 달라질까요?', '5 : 3의 비율은 [5/3]이고 4 : 2의 비율은 [4/2]=2라서 달라요. 같은 수를 빼거나 더하면 비율이 같지 않을 수 있어요.')],
         '그려 보기 — 전항과 후항에 같은 수를'),
        ('우진이는 물뿌리개 3통에 액비 원액 3컵과 물 21컵을 넣었어요. 물뿌리개 한 통일 때와 비교해 보세요.',
         [_chain({'t': '물뿌리개 세 통', 'p': ['원액 컵 수와 물 컵 수의 비 ', _r(3, 21), ', 비율 ', _f('3/21')]},
                 {'t': '물뿌리개 한 통', 'p': ['원액 컵 수와 물 컵 수의 비 ', _r(1, 7), ', 비율 ', _f('1/7')]},
                 ['3 : 21의 전항과 후항을 ', _i(3), '으로 나누면 1 : 7이 돼요.'])]),
        ('15 : 25를 예로 비의 성질을 정리해요.',
         [_blanks('15 : 25에서 15는 ', (['전항', '후항'], 0), ', 25는 ', (['전항', '후항'], 1), '이에요. 15 : 25의 전항과 후항을 5로 나눈 3 : 5는 15 : 25와 비율이 ',
                  (['같아요', '달라요'], 0), '. 전항과 후항에 ', (['0', '2'], 0), '을 곱하면 비율을 비교할 수 없어요.')]),
        ('흙과 액비를 여러 양으로 만들려고 해요. 비의 성질을 이용하여 빈칸에 알맞은 수를 써 보세요.',
         [_chain(['6 : 5 → 6 × 7 : 5 × 7 → ', _r(42, 35)], ['56 : 72 → 56 ÷ 8 : 72 ÷ 8 → ', _r(7, 9)],
                 ['8 : 15 = 64 : ', _i(120)], ['11 : 99 = ', _i(1), ' : 9'], ['□ : 21 = 16 : 48에서 □ = ', _i(7)])]),
    ],
    's3': [
        ('도현이는 물 1.5 L에 식물 영양제 0.6 L를 섞으려고 해요. 1.5 : 0.6을 어떻게 바꿀지 예상하고, 간단한 자연수의 비로 나타내 보세요.',
         [_rule('1.5 : 0.6을 자연수의 비로 바꾸고 더 간단하게 하려면 어떻게 할까요?', '전항과 후항에 10을 곱하면 15 : 6이 되고, 공약수 3으로 나누면 5 : 2가 돼요.'),
          _chain(['1.5 : 0.6 → 전항과 후항에 10을 곱하면 ', _r(15, 6)], ['15 : 6 → 전항과 후항을 3으로 나누면 ', _r(5, 2)])], '만져 보기 — 물 1.5 L와 영양제 0.6 L'),
        ('소윤이는 퇴비 [2/3]포대와 상토 [5/8]포대를 섞으려고 해요. [2/3] : [5/8]을 간단한 자연수의 비로 나타내 보세요.',
         [_chain(['[2/3] : [5/8] → ', _r(16, 15)], ['전항과 후항에 두 분모 3과 8의 ', _c(['최소공배수 24', '최대공약수 1'], 0), '를 곱했어요.']),
          _why('[2/3] : [5/8]에 24 대신 48을 곱해도 될까요?', '네, 48도 3과 8의 공배수라서 곱하면 32 : 30이 되고, 공약수 2로 나누면 16 : 15가 돼요.')], '그려 보기 — 분수의 비'),
        ('태민이가 액비 [2/5] L와 물 0.7 L를 섞었어요. [2/5] : 0.7을 두 가지 방법으로 간단한 자연수의 비로 나타내 보세요.',
         [_chain({'t': '분수로 바꾸기', 'p': ['[2/5] : [7/10] → ', _r(4, 7)]}, {'t': '소수로 바꾸기', 'p': ['0.4 : 0.7 → ', _r(4, 7)]}),
          _write(('편리한 방법', '두 방법 중 어느 방법이 더 편리했는지 까닭과 함께 써 보세요.', '소수로 바꾸는 방법이 편리했어요. [2/5] = 0.4로 바꾸면 0.4 : 0.7에 10만 곱하면 되기 때문이에요.'))],
         '말해 보기 — (분수) : (소수) 두 가지 방법'),
        ('2.5 : [5/6]를 예로 간단한 자연수의 비로 나타내는 방법을 정리해요.',
         [_blanks('2.5 : [5/6]에서 2.5를 ', (['[5/2]', '[2/5]'], 0), '로 바꾸면 [5/2] : [5/6]이 되고, 전항과 후항에 ', (['6', '5'], 0), '을 곱하면 15 : 5, 공약수 5로 나누면 ',
                  (['3 : 1', '1 : 3'], 0), '이에요.')]),
        ('간단한 자연수의 비로 나타내 보세요. 비율이 같은 자연수의 비라면 정답이에요.',
         [_chain(['1.6 : 2.4 → ', _r(2, 3, True)], ['[3/10] : [4/5] → ', _r(3, 8, True)], ['3.5 : [7/4] → ', _r(2, 1, True)], ['[1 1/5] : [3/4] → ', _r(8, 5, True)])]),
    ],
    's4': [
        ('하린이네 모둠은 텃밭 한 고랑에 배추 모종 5포기를 심고 퇴비 40 g을 뿌려요. 고랑을 세 개로 늘려 모종 수와 퇴비의 양의 비와 비율을 비교해 보세요.',
         [_chain({'t': '한 고랑', 'p': ['모종 수와 퇴비의 양의 비 ', _r(5, 40), ', 비율 ', _f('5/40')]},
                 {'t': '세 고랑', 'p': ['모종 수와 퇴비의 양의 비 ', _r(15, 120), ', 비율 ', _f('15/120')]}),
          _why('5 : 40과 15 : 120을 기호 =로 이어 쓸 수 있는 까닭은 무엇일까요?', '두 비의 비율이 [1/8]로 같기 때문이에요. 15 : 120은 5 : 40의 전항과 후항에 3을 곱한 비예요.')],
         '만져 보기 — 배추 고랑 세 개'),
        ('비례식 7 : 4=21 : 12에서 외항과 내항을 찾아 써 보세요.',
         [_chain(['7 : 4=21 : 12에서 외항은 ', _i(7), '과 ', _i(12), ', 내항은 ', _i(4), '와 ', _i(21), '이에요.'])]),
        ('여러 가지 비례식에서 외항과 내항을 찾고, 외항과 전항이 어떻게 다른지 말해 보세요.',
         [_chain(['[1/4] : [1/6]=3 : 2에서 외항은 ', _f('1/4'), '과 ', _i(2), '예요.'], ['0.5 : 1.5=2 : 6에서 내항은 ', _i('1.5'), '와 ', _i(2), '예요.']),
          _why('비례식 0.5 : 1.5=2 : 6에서 전항과 외항은 각각 무엇인지 견주어 써 보세요.', '전항은 각 비의 앞에 있는 0.5와 2이고, 외항은 비례식 바깥쪽에 있는 0.5와 6이에요. 0.5는 전항이면서 외항이에요.')]),
        ('6 : 5=18 : 15를 예로 비례식을 정리해요.',
         [_blanks('6 : 5=18 : 15에서 후항은 ', (['5와 15', '6과 18'], 0), '이고, 내항은 ', (['5와 18', '6과 15'], 0), '이에요. 비례식은 ',
                  (['비율이 같은 두 비', '후항이 같은 두 비'], 0), '를 기호 =로 나타낸 식이에요.')]),
        ('비의 성질을 이용하여 비례식을 세우고, 보기에서 4 : 9와 비율이 같은 비를 찾아보세요.',
         [_seqs((None, [_chain(['5 : 6은 전항과 후항에 ', _i(7), '을 곱한 35 : ', _i(42), '와 비율이 같으므로 비례식은 5 : 6=35 : ', _i(42)],
                               ['64 : 24는 전항과 후항을 ', _i(8), '로 나눈 ', _i(8), ' : 3과 비율이 같으므로 비례식은 64 : 24=', _i(8), ' : 3'])]),
                ('보기: [1/4] : [1/9], 1.2 : 2.7, 16 : 81', [_quiz(('4 : 9와 비율이 같은 비를 골라 비례식을 세워요.', ['[1/4] : [1/9]', '16 : 81', '1.2 : 2.7'], 2))]))]),
    ],
    's5': [
        ('민재는 모종판 1판에 배추 모종이 8포기씩 들어 있는 것을 보았어요. 모종판 4판일 때의 비례식을 세우고, 두 곱의 관계를 예상해 보세요.',
         [_rule('비례식 1 : 8=4 : 32에서 바깥쪽 두 수의 곱과 안쪽 두 수의 곱은 어떤 관계일까요?', '외항의 곱 1×32=32와 내항의 곱 8×4=32가 같아요.'),
          _chain(['비례식: 1 : 8=', _i(4), ' : ', _i(32)], ['외항의 곱: 1 × 32 = ', _i(32)], ['내항의 곱: 8 × 4 = ', _i(32)])], '만져 보기 — 모종판 네 판'),
        ('태민이는 4 : 9의 전항과 후항에 5를 곱해 비례식 4 : 9=20 : □를 세웠어요. 외항의 곱과 내항의 곱을 이용하여 □를 구해 보세요.',
         [_chain(['4 : 9=20 : □ → 4 × □ = 9 × 20 = ', _i(180), ', □ = ', _i(45)])]),
        ('외항의 곱과 내항의 곱이 왜 같은지 다른 비례식으로 확인해 보세요.',
         [_blanks('4 : 9=4×5 : 9×5이므로 외항의 곱 4×45는 ', (['4×9×5', '4×5×5'], 0), '이고, 내항의 곱 9×20은 ', (['9×4×5', '9×9×5'], 0), '예요. 그래서 두 곱은 ',
                  (['같아요', '달라요'], 0), '.'),
          _why('비례식 □ : 6=10 : 15에서 □를 외항의 곱과 내항의 곱으로 구하는 과정을 써 보세요.', '외항의 곱 □×15와 내항의 곱 6×10=60이 같으므로 □×15=60, □=4예요.')]),
        ('비례식 3 : 8=□ : 56을 예로 비례식의 성질을 정리해요.',
         [_blanks('3 : 8=□ : 56에서 외항의 곱 3×56과 내항의 곱 8×□는 ', (['같아요', '달라요'], 0), '. 그래서 8×□ = ', (['168', '56'], 0), '이고 □ = ',
                  (['21', '7'], 0), '이에요.')]),
        ('비례식의 성질을 이용하여 □ 안에 알맞은 수를 구해 보세요.',
         [_chain(['6 : 5=□ : 40 → □ = ', _i(48)], ['0.8 : 2=6 : □ → □ = ', _i(15)], ['[1/5] : [1/2]=□ : 10 → □ = ', _i(4)], ['7 : □=28 : 44 → □ = ', _i(11)])]),
    ],
    's6': [
        ('지안이네 모둠은 방울토마토를 크기가 같은 바구니에 똑같은 개수씩 담아요. “방울토마토 75개를 담는 데 바구니 3개가 필요해. 그럼 225개를 담으려면?” 비례식을 세워 구해 보세요.',
         [_chain(['75 : 3=225 : □ → 75 × □ = ', _i(675), ', □ = ', _i(9)], ['필요한 바구니는 ', _i(9), '개예요.']),
          _why('75 : 3=□ : 225처럼 세우면 안 되는 까닭은 무엇일까요?', '앞의 비는 (방울토마토 수) : (바구니 수)인데 뒤의 비는 차례가 바뀌어 비율이 같은 두 비가 아니기 때문이에요.')]),
        ('물 펌프는 일정한 빠르기로 6분 동안 물 15 L를 퍼 올려요. 26분 동안에는 물을 몇 L 퍼 올릴까요? 비례식의 성질로 구해 보세요.',
         [_chain(['6 : 15=26 : □ → 6 × □ = ', _i(390), ', □ = ', _i(65)])]),
        ('물 펌프가 26분 동안 퍼 올리는 물의 양을 다른 방법으로 구하고, 내가 좋아하는 방법을 써 보세요.',
         [_chain({'t': '비의 성질', 'p': ['6 : 15의 전항과 후항에 ', _f('13/3'), '을 곱하면 26 : ', _i(65)]}, {'t': '비율', 'p': ['[6/15] = [26/□]에서 □ = ', _i(65)]}),
          _write(('좋아하는 방법', '세 가지 방법 중 내가 가장 좋아하는 방법과 그 까닭을 써 보세요.', '나는 비례식의 성질이 좋아요. 6 : 15=26 : □에서 6×□=390만 계산하면 바로 □=65를 구할 수 있어요.'))]),
        ('비례식을 활용해 문제를 해결하는 방법을 정리해요.',
         [_blanks('6분에 15 L를 퍼 올릴 때 26분 동안의 양을 구하려면 ', (['6 : 15=26 : □', '6 : 15=□ : 26'], 0), '처럼 두 비의 차례를 ', (['같게', '다르게'], 0),
                  ' 하고, ', (['외항의 곱과 내항의 곱이 같다는 성질', '전항끼리의 합이 같다는 성질'], 0), '을 이용해요.')]),
        ('비례식을 바르게 세웠는지 살펴보고, 주사위 눈으로 만든 비로 비례식을 풀어 보세요.',
         [_chain(['씨앗 8봉지에 2000원일 때 5봉지의 값을 구하는 비례식은 ', _c(['8 : 2000=□ : 5', '2000 : 8=5 : □', '8 : 2000=5 : □'], 2), '이에요.'],
                 ['씨앗 5봉지의 값은 ', _i(1250), '원이에요.'], ['주사위 눈이 3, 4이면 3 : 4=□ : 60 → □ = ', _i(45)])]),
    ],
    's7': [
        ('수확한 배추를 경로당과 아동 센터에 2 : 3으로 나누려고 해요. 먼저 어떻게 나눌지 예상하고, 배추 15포기를 2 : 3으로 나누어 보세요.',
         [_rule('배추 15포기를 2 : 3으로 나누면 각각 몇 포기씩일까요? 어떻게 나눌지 예상해요.', '전체를 2+3=5묶음으로 똑같이 나누면 한 묶음이 3포기라서 경로당 6포기, 아동 센터 9포기예요.'),
          _chain(['경로당: 15 × ', _f('2/5'), ' = ', _i(6), '(포기)'], ['아동 센터: 15 × ', _f('3/5'), ' = ', _i(9), '(포기)'])], '만져 보기 — 배추 나누기'),
        ('배추 35포기를 2 : 5로 나누려고 해요. 두 곳에 드릴 배추는 전체의 몇 분의 몇인지 알아보고 계산해 보세요.',
         [_chain(['경로당: 35 × ', _f('2/7'), ' = ', _i(10), '(포기)'], ['아동 센터: 35 × ', _f('5/7'), ' = ', _i(25), '(포기)']),
          _why('2 : 5로 나눌 때 왜 전체를 7등분할까요?', '2 : 5는 한쪽이 2만큼, 다른 쪽이 5만큼을 받는 것이라 모두 2+5=7만큼이에요. 그래서 전체를 7등분해요.')]),
        ('1모둠과 2모둠이 울타리를 묶을 끈 1080 cm를 4 : 5로 나누어 가지려고 해요. 각각 몇 cm씩 가지면 되는지 구해 보세요.',
         [_chain(['1모둠: 1080 × ', _f('4/9'), ' = ', _i(480), ' (cm)'], ['2모둠: 1080 × ', _f('5/9'), ' = ', _i(600), ' (cm)'])], '말해 보기 — 울타리 끈 나누기'),
        ('48을 7 : 5로 비례배분하는 방법을 정리해요.',
         [_blanks('48을 7 : 5로 비례배분하려면 전체를 ', (['12', '7', '5'], 0), '만큼 등분하여 전체의 [7/12]와 [5/12]로 나누어요. 그래서 ',
                  (['28과 20', '7과 5', '24와 24'], 0), '으로 나누어져요.')]),
        ('보기에서 비 카드 2장을 골라 문제를 완성하고, 답을 구해 보세요.',
         [_clay(1080, ['1 : 3', '4 : 5', '7 : 2', '5 : 7'], ['배추밭', '무밭'], 'g', '퇴비 1080 g을 {} 나누어 배추밭과 무밭에 뿌렸습니다. 배추밭과 무밭에 뿌린 퇴비는 각각 몇 g인가요?')]),
    ],
    's89': [
        ('텃밭에서 딴 배추로 배추전을 만들어요(수학+실과). 하린이네 모둠이 조리법을 보고 배추전 8인분을 만들려고 해요. 문제를 이해해 보세요.',
         [{'w': 'recipe', 'args': ['배추전(6인분)', ['배추 360 g을 씻어서 먹기 좋게 자릅니다.', '밀가루와 물을 3 : 4로 섞은 반죽 420 g을 만듭니다.', '배추에 반죽을 입혀 노릇하게 부칩니다.']]},
          _quiz(('조리법은 몇 인분을 기준으로 쓰여 있나요?', ['8인분', '6인분', '3인분'], 1), ('하린이네 모둠이 만들려는 양은?', ['6인분', '8인분', '48인분'], 1),
                ('밀가루와 물을 섞는 비는?', ['4 : 3', '3 : 7', '3 : 4'], 2), ('문제를 해결하는 데 필요하지 않은 정보는?', ['노릇하게 부친다는 것', '배추 360 g', '반죽 420 g'], 0))],
         '이해해요 — 조리법 살펴보기'),
        ('해결 계획을 세워 보세요.',
         [_blanks('배추의 양은 (인분 수) : (배추의 양)으로 ', (['비례식', '비례배분'], 0), '을 세워 구하고, 반죽의 양도 ', (['비례식', '비례배분'], 0),
                  '을 세워 구해요. 밀가루와 물의 양은 반죽의 양을 3 : 4로 ', (['비례배분해요', '더해요'], 0), '.')]),
        ('8인분에 필요한 배추의 양과 반죽의 양을 비례식으로 구해 보세요.',
         [_chain({'t': '배추', 'p': ['6 : 360=8 : □ → 6 × □ = ', _i(2880), ', □ = ', _i(480), ' (g)']},
                 {'t': '반죽', 'p': ['6 : 420=8 : □ → 6 × □ = ', _i(3360), ', □ = ', _i(560), ' (g)']})]),
        ('반죽 560 g을 밀가루와 물 3 : 4로 나누어 보세요.',
         [_chain(['밀가루: 560 × ', _f('3/7'), ' = ', _i(240), ' (g)'], ['물: 560 × ', _f('4/7'), ' = ', _i(320), ' (g)'])], '해결해요 ② — 비례배분으로'),
        ('잘 해결했는지 되돌아보고, 다른 방법도 찾아보세요.',
         [_seqs((None, [_chain(['다른 방법: 8인분은 6인분의 ', _f('4/3'), '배이므로 배추는 360 × [4/3] = ', _i(480), ' (g)'],
                               ['6인분 → 2인분 → 8인분: 360 ÷ 3 = ', _i(120), ', 120 × 4 = ', _i(480), ' (g)'])]),
                (None, [_write(('해결 방법', '내가 해결한 방법을 친구에게 설명하듯 써 보세요.', '6인분과 8인분의 비로 비례식 6 : 360=8 : □를 세워 배추 480 g을 구하고, 반죽 560 g은 3 : 4로 비례배분했어요.'))]))]),
    ],
    's10': [
        ('텃밭 축제 날 ‘짝을 찾아 비례식을 세워요’ 놀이를 해요. 놀이 순서대로 기호를 써 보세요. (문장을 바꾸어 썼어요.)',
         [_seqcards(['㉠ 시간이 끝나면 자리에 앉아 모은 카드로 비례식을 만들어요.', '㉡ 카드의 비율을 구해 보고, 비율이 서로 다른 카드 4장을 골라 가져요.',
                     '㉢ 축제 마당을 다니다 친구를 만나면 카드를 한 장씩 골라 함께 보여 줘요.', '㉣ 만든 비례식을 발표하고 서로 확인해요. 비례식을 가장 많이 만든 사람이 이겨요.',
                     '㉤ 두 카드의 비율이 같으면 가위바위보를 해서 이긴 사람이 카드를 가져가요.'], [1, 2, 4, 0, 3])]),
        ('텃밭 축제 비 카드를 살펴보며 비율을 구해 보세요.',
         [_quiz(('2 : 5와 비율이 같은 카드를 모두 골라요.', ['4 : 10', '5 : 2', '0.2 : 0.5', '[1/5] : [1/2]', '[1/2] : [1/5]', '12 : 30'], [0, 2, 3, 5]))]),
        ('친구가 4 : 3 카드를 보여 주었어요. 내 카드 가운데 비율이 같은 카드를 찾아보세요.',
         [_quiz(('4 : 3과 비율이 같은 카드를 모두 골라요.', ['3 : 4', '16 : 12', '1.2 : 0.9', '20 : 18'], [1, 2]))]),
        ('모은 카드로 비례식을 세워 보세요.',
         [_chain(['2 : 9=', _i(8), ' : 36'], ['0.6 : 1=', _i(3), ' : 5'], ['[1/3] : [1/7]=', _i(7), ' : 3'], ['10 : ', _i(4), '=5 : 2'])]),
        ('친구들이 발표한 비례식이 맞는지 확인해 보세요.',
         [_quiz(('맞는 비례식을 모두 골라요.', ['2 : 7=6 : 21', '3 : 8=8 : 3', '[1/2] : [1/5]=5 : 2', '0.4 : 1.2=3 : 1', '12 : 16=3 : 4'], [0, 2, 4]),
                ('두 비의 비율이 같은지 알아보는 방법으로 알맞지 않은 것은?', ['간단한 자연수의 비로 나타내어 비교해요.', '외항의 곱과 내항의 곱을 비교해요.', '전항과 후항에 같은 수를 더해 봐요.'], 2))]),
    ],
    's11': [
        ('수확 잔치에서 모둠마다 배운 내용을 발표해요. 먼저 비의 성질 문제를 풀어 보세요.',
         [_seqs((None, [_quiz(('20 : 32와 비율이 같은 비를 모두 골라요.', ['5 : 8', '8 : 5', '10 : 16', '40 : 60', '60 : 96'], [0, 2, 4]))]),
                (None, [_chain(['[1/3] : [5/6]=2 : ', _i(5)], ['24 : 42=', _i(4), ' : 7'])]))]),
        ('간단한 자연수의 비로 나타내 보세요.',
         [_chain(['1.8 : 2.7 → ', _r(2, 3, True)], ['[5/8] : [5/12] → ', _r(3, 2, True)], ['0.45 : [3/5] → ', _r(3, 4, True)], ['[1 1/2] : [4/5] → ', _r(15, 8, True)])]),
        ('비례식의 성질을 이용하여 □ 안에 알맞은 수를 구해 보세요.',
         [_chain(['7 : 6=56 : ', _i(48)], ['18 : 63=', _i(2), ' : 7'], ['', _i(15), ' : 4=45 : 12'], ['42 : ', _i(30), '=7 : 5'])]),
        ('수확 잔치 준비 문제예요.',
         [_chain({'t': '비례배분', 'p': ['배 주스 840 mL를 두 모둠이 3 : 4로 나누면 840 × [3/7] = ', _i(360), ', 840 × [4/7] = ', _i(480), ' (mL)']},
                 {'t': '비례식', 'p': ['주스 2컵을 만드는 데 배 3개가 필요하면 주스 10컵에는 2 : 3=10 : □ → □ = ', _i(15), '(개)']})]),
        ('단원에서 배운 내용을 다른 예로 정리하고, 1차시에 궁금했던 것을 해결했는지 돌아보세요.',
         [_blanks('비의 전항과 후항을 0이 아닌 같은 수로 ', (['나누어도', '빼도'], 0), ' 비율은 같습니다. 5 : 6=20 : 24에서 외항은 ', (['5와 24', '6과 20'], 0),
                  '이고, 외항의 곱과 내항의 곱은 ', (['같습니다', '다릅니다'], 0), '. 35를 3 : 4로 비례배분하면 ', (['15와 20', '3과 4', '17과 18'], 0), '이에요.'),
          _write(('궁금증 해결', '1차시에 궁금했던 것 하나를 골라, 이제 어떻게 해결할 수 있는지 써 보세요.', '무 35개를 3 : 4로 나누는 방법이 궁금했어요. 이제는 35 × [3/7] = 15, 35 × [4/7] = 20으로 구할 수 있어요.'))]),
    ],
}


def build_file(kind, lv):
    src = SRC_TB if kind == 'tb' else SRC_ST
    D = cap(src)
    DATA.clear()
    DATA.update(D)
    if kind == 'tb':
        check_words(D)
    else:
        assert [L['id'] for L in D['lessons']] == ST_IDS, ('이야기 버전 차시가 바뀌었어요', [L['id'] for L in D['lessons']])
        check_words_st(D)
    label = '교과서 차시' if kind == 'tb' else '이야기 버전'
    s = Sheet(unit_label='6-2 수학 %s(%s)' % (UNIT_NAME, label), level=lv, grade_label='6학년')
    if kind == 'tb':
        lines = [tb_lesson(s, lv, L, i == 0, D.get('story')) for i, L in enumerate(D['lessons'])]
    else:
        lines = [f(s, lv) for f in ST]
    s.answers('【교사용】 %s(%s) 활동지 정답 (%s)' % (UNIT_NAME, label, lv), lines,
              note='※ 이 활동지는 앱 u4-ratio.html과 차시 번호가 같습니다. 정답의 ‘3/5’는 분수 5분의 3, ‘1 1/2’은 대분수 1과 2분의 1을 뜻해요. '
                   '‘(예)’가 붙은 간단한 자연수의 비는 비율이 같은 자연수의 비라면 모두 맞아요.')
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
