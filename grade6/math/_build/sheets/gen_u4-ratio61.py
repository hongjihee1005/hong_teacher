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

    python3 gen_u4-ratio61.py st         # 이야기 버전만

이야기 버전(2026-10-16): ../units/u4-ratio.st.js('우리 반 방송부 여론 조사', 10차시: 1~10)를 같은 방법으로 읽어
sem1-soop/sheets/에 만듭니다(ST = 차시 id 목록 ST_IDS). 이야기 버전에만 있는 것: 기획표 글 상자(ra4sNote)·기획 보드 둘러보기
(ra4sStudio)·막대사탕 나누어 주기(ra4Candy), 엔진의 panes(보여요·생각해요·궁금해요)·thenWhy(활동 뒤 '왜 그럴까요?')·
ruleFirst(활동 앞 '먼저 예상해요')·wonderRecall, writeStep의 쓰기 틀(help)과 모범 답(ans). 문장제 답은 check_words_st가 따로 계산해 견줍니다.
교과서 버전과 같은 부품은 같은 함수를 쓰고, 이야기 버전에서 글이 다른 곳(묶음 표 안내·문제 만들기·종이 안내)만 MODE로 나눕니다.
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
MODE = ['tb']          # 지금 만드는 버전(tb | st) — 이야기 버전에서만 바뀌는 글을 고를 때

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
INTERACT_ST = re.compile(r'눌러|누르|누를|끌어|돌려 보세요|단추|컴퓨터(?! \d)|‘[^’]*’를 ')     # 가전제품 ‘컴퓨터 3 kWh’는 남김
# 이야기 버전에만 쓰는 종이 안내(교과서 버전 글은 그대로 두려고 따로 둠)
PAPER_RULES_ST = [
    (r'세 칸에 써서 붙여요\.', '세 칸에 써 보세요.'),
    (r'다 고르면 저절로 확인해요\.', ''),
    (r'두 활동을 모두 해야 계단을 올라가요\.', ''),
    (r'체험 부스를 두 번 열어 보고, ', '체험 부스를 두 번 연다고 생각하고 '),
    (r'꾸러미를 세 개까지 늘려 보며 ', '꾸러미 수를 늘린다고 생각하고 '),
    (r'음료를 세 병까지 만들어 보고, ', '음료를 세 병까지 만든다고 생각하고 '),
    (r'나누어 준 막대사탕 (\d+)개를 눌러 보고, ', r'나누어 준 막대사탕 \1개에 ×표를 하고, '),
    (r'양 카드를 □에 놓아 문장을 비로 나타내 보세요\.', '양 카드의 수를 ( )에 써서 문장을 비로 나타내 보세요.'),
    (r'하는 차례대로 눌러 보세요\.', '하는 차례대로 기호를 써 보세요.'),
    (r'\(이 앱에서 정한 수\)', ''),
    (r'소식을 모두 눌러, ', '소식을 모두 읽고 '),
    (r'모눈 위의 화면 모서리\(빨간 점\)를 끌어 목표에 맞는 화면을 만들어 보세요\.', '모눈에 목표에 맞는 화면을 그려 보세요.'),
    (r'배우는 차례대로 눌러 ', '배우는 차례대로 기호를 써서 '),
    (r'기획표의 ‘([^’]+)’를 보고', r'기획표의 \1 소식을 보고'),
    (r'이 앱에서 ', ''),
]


def paper(t):
    t = str(t or '')
    for a, b in (PAPER_RULES_ST if MODE[0] == 'st' else []) + PAPER_RULES:
        t = re.sub(a, b, t)
    sents = re.split(r'(?:(?<=[.?!])|(?<=[.?!]”))\s+', t)
    IA = INTERACT_ST if MODE[0] == 'st' else INTERACT
    gone = [x for x in sents if x and IA.search(x)]
    if gone and os.environ.get('SHOW_DROP'):
        print('  [뺀 문장]', ' | '.join(gone))
    return ' '.join(x for x in sents if x and not IA.search(x)).strip()


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
        if it.get('ans'):          # 이야기 버전: 쓰기 틀(help)과 모범 답(ans)
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


def jong_k(word):
    """우리말 낱말 끝 글자에 받침이 있으면 True"""
    c = str(word).strip()[-1:]
    return '가' <= c <= '힣' and (ord(c) - 0xAC00) % 28 > 0


def w_build(s, lv, o, svg=None):
    its, K, u = o['items'], o.get('max') or 4, o['unit']
    if svg:      # 앱 그림의 첫 묶음만(나머지 칸은 '?')
        H = re.search(r'viewBox="0 0 [\d.]+ ([\d.]+)"', svg).group(1)
        app_svg(s, svg, 38, viewbox='0 0 156 %s' % H)
    first = ', '.join('%s %s%s' % (it['name'], it['per'], unit_sp(it['unit'])) for it in its)
    if MODE[0] == 'st' and o.get('head'):
        s.text(rd('%s %s %s:  %s.  %s%s 늘어날 때 두 양을 표에 써 보세요.'
                  % (o['what'], CNT[o['start'] - 1], u, first, o['head'], '이' if jong_k(o['head']) else '가')))
    else:
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
        if MODE[0] == 'st' and len(sols) > 1 and len({Fraction(p[1], p[0]) for p in sols}) > 1:     # 이야기: '1보다 큰' 목표
            note = ('세로가 가로보다 길면 맞아요' if all(p[1] > p[0] for p in sols) else
                    '세로가 가로보다 짧으면 맞아요' if all(p[1] < p[0] for p in sols) else '조건에 맞으면 맞아요')
            ans.append(pre + '(예) ' + ', '.join(f(p) for p in sols[2:4]) + ' (%s)' % note)
            continue
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
    if MODE[0] == 'st':      # 이야기 버전: 이어달리기 기록
        nn = lambda n: n + ('은' if jong_k(n) else '는')
        s.text('보기의 수를 바꾸어 나만의 문제를 만들고 풀어 보세요. 두 사람의 비율이 같아지지 않게 해요.')
        s.text('보기: %s %d m를 달리는 데 %d초, %s %d m를 달리는 데 %d초가 걸렸어요.' % (nn(n1), d1, t1, nn(n2), d2, t2))
        s.fill('%s (        ) m를 달리는 데 (        )초가 걸렸고, %s (        ) m를 달리는 데 (        )초가 걸렸습니다. '
               '걸린 시간에 대한 달린 거리의 비율이 더 높은 사람은 누구인가요?' % (nn(n1), nn(n2)))
        s.fill(['%s의 비율:  (        ) ÷ (        ) = (          )' % n1, '%s의 비율:  (        ) ÷ (        ) = (          )' % n2,
                '비율이 더 높은 사람:  (          )'])
        ex = [(80, 10), (90, 15)]
        r = [Fraction(a, b) for a, b in ex]
        assert r[0] != r[1] and ex != [(d1, t1), (d2, t2)]
        return '(예) %s %d m·%d초 → %s, %s %d m·%d초 → %s → %s (만든 수에 따라 달라요: 비율 = 달린 거리 ÷ 걸린 시간)' % (
            n1, ex[0][0], ex[0][1], num_txt(r[0]), n2, ex[1][0], ex[1][1], num_txt(r[1]), n1 if r[0] > r[1] else n2)
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
    s.text('%s의 여섯 곳에서 어떤 두 양을 비교할 수 있는지 써 보세요.' % ('기획 보드' if MODE[0] == 'st' else '휴양림'))
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


# ---------------------------------------------------------------- 이야기 버전 부품
EMOJI = re.compile('[\U0001F000-\U0001FFFF\u2600-\u27BF\uFE0F\u200D]')


def noemo(t):
    return re.sub(r'\s{2,}', ' ', EMOJI.sub('', str(t))).strip()


def w_note(s, lv, title, lines, *_):
    s.labeled([('기획표', noemo(title) + '\n' + '\n'.join('· ' + rd(noemo(l)) for l in lines))], row_h=1000 * (len(lines) + 1))
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


def w_candy(s, lv, o, svg=None):
    if svg:
        app_svg(s, svg, 100)
    nm = o.get('name') or '막대사탕'
    s.text('나누어 주고 남은 %s의 수를 세어 보세요.   남은 %s:  (        )개' % (nm, nm))
    a = ask_part(s, o)
    return '나누어 준 %d개, 남은 %d개' % (o['eat'], o['total'] - o['eat']) + (' / ' + a if a else '')


def w_error(s, lv, msg, *_):
    raise RuntimeError('앱 원본의 활동을 읽지 못했어요: ' + msg)


WIDGETS = {'quiz': w_quiz, 'blanks': w_blanks, 'sequence': w_sequence, 'writeStep': w_write,
           'ra4Chain': w_chain, 'ra4Seq': w_seq, 'fig': w_fig, 'tbl': w_tbl, 'calc': w_calc,
           'ra4Build': w_build, 'ra4Slots': w_slots, 'ra4Choc': w_choc, 'ra4Comp': w_comp, 'ra4Rect': w_rect,
           'ra4Map': w_map, 'ra4Tape2': w_tape2, 'ra4Grid': w_grid, 'ra4Link': w_link, 'ra4Save': w_save,
           'ra4Make': w_make, 'ra4Same': w_same, 'ra4Memory': w_memory, 'ra4High': w_high, 'ra4Scene': w_scene,
           'error': w_error,
           'note': w_note, 'panes': w_panes, 'thenWhy': w_thenwhy, 'ruleFirst': w_rulefirst, 'wonderRecall': w_wonder,
           'ra4Candy': w_candy, 'ra4sStudio': w_scene}
SVG_W = {'ra4Build', 'ra4Slots', 'ra4Choc', 'ra4Comp', 'ra4Rect', 'ra4Map', 'ra4Tape2', 'ra4Grid', 'ra4Link', 'ra4Save',
         'ra4Make', 'ra4Same', 'ra4Memory', 'ra4High', 'ra4Scene', 'ra4Candy', 'ra4sStudio'}


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



def check_words_st(D):
    """이야기 버전 문장제: 앱의 답 = 이 스크립트가 따로 계산한 값"""
    Ls = {L['id']: L for L in D['lessons']}
    F = Fraction
    pc = lambda a, b: F(a * 100, b)
    exp = [
        ('s2', '체험 부스 두 번에', [F(16, 8 // 4)]),
        ('s2', '꾸러미가 열 개일 때', [F(4 * 10, 1 * 10)]),
        ('s2', '응원 현수막', [F(2 * 3), F(6 * 3)]),
        ('s2', '현수막 네 장의', [F(2 * 4), F(6 * 4)]),
        ('s2', '현수막 수에 따른', [F(6, 2)]),
        ('s2', '옳게 고치기', [F(9, 3)]),
        ('s2', '샌드위치', [F(2 * 5, 1 * 5)]),
        ('s3', '인물 사진 수와', ['18 : %d' % (30 - 18)]),
        ('s3', '전체 사진 수에 대한', ['%d : 30' % (30 - 18)]),
        ('s4', '서윤: 분수', [F(1, 5), F(1, 5)]),
        ('s4', '하준: 분수', [F(2, 8), F(2, 8)]),
        ('s4', '국기 게양대', [F(400, 600)]),
        ('s4', '방송부원 키', [F(100, 150)]),
        ('s5', '실제 거리를 cm로', [F(200 * 100), F(500 * 100)]),
        ('s5', '지호: ', [F(12, 16), F(12, 16), F(14, 20), F(14, 20)]),
        ('s5', '걸린 시간에 대한 달린 거리', [F(100, 20), F(60, 10)]),
        ('s5', '해오름구: ', [F(360000, 24)]),
        ('s5', '달빛구: ', [F(420000, 35)]),
        ('s5', '민서: ', [F(20, 100), F(20, 100)]),
        ('s5', '태오: ', [F(30, 200), F(30, 200)]),
        ('s6', '수아: 100', [F(13 * 100, 20)]),
        ('s6', '은재: 100', [F(16 * 100, 25)]),
        ('s7', '6학년 투표율', [pc(136, 160)]),
        ('s7', '5학년은', [pc(132, 150)]),
        ('s7', '① 음악 신청', [pc(84, 200), pc(56, 200)]),
        ('s7', '③ 학교 소식', [pc(36, 200), pc(24, 200)]),
        ('s7', '할인 금액: 스케치북', [F(3000 - 2400), F(10000 - 8500)]),
        ('s7', '판매 금액에 대한', [pc(3000 - 2400, 3000), pc(10000 - 8500, 10000)]),
        ('s7', '가 가게', [pc(12, 400)]),
        ('s7', '나 가게', [pc(10, 250)]),
        ('s7', '방송부 공연', [pc(255, 300), pc(216, 240)]),
        ('s7', '예금한 돈에 대한', [pc(1500, 50000), pc(2400, 60000)]),
        ('s8', '줄이려는 전기 사용량: 6', [F(6 + 9 + 3)]),
        ('s8', '줄이려는 전기 사용량: 12', [F(12 + 8)]),
        ('s8', '비율 [20/250]', [F(20, 250), F(20, 250), pc(20, 250)]),
        ('s10', '세 통', [F(50 * 3)]),
        ('s10', '네 통', [F(20 * 4), F(50 * 4)]),
        ('s10', '다섯 통', [F(50 * 5, 20 * 5)]),
        ('s10', '까닭: 반대한', [pc(25 - 15, 25)]),
        ('s10', '배지 할인', [F(2000 - 1600), pc(2000 - 1600, 2000)]),
        ('s10', '열쇠고리 할인', [F(3000 - 2550), pc(3000 - 2550, 3000)]),
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
    ('s9', 2): '친구와 퀴즈쇼 놀이를 해요. 내 차례에 카드 2장을 뒤집어 두 카드의 비율이 같은지 판단하고, 맞게 판단하면 카드를 가져오고 한 번 더 해요. 카드를 더 많이 가져간 사람이 이겨요.',
    ('s9', 'ch'): '또 다른 놀이: 네 사람이 비율 카드를 동시에 한 장씩 뒤집고, 비율이 가장 높은 사람이 뒤집은 카드를 모두 가져가요. 4판부터는 규칙을 바꾸어 비율이 가장 낮은 사람이 가져가요. 비율 카드 24장으로 6판을 해요.',
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


WHY_ST = {   # 이야기 버전 도전형 '왜' 쓰기(차시 id → 물음, 예시 답)
    's1': ('방송 소식이 아닌 생활에서 두 양을 비교하는 상황을 하나 찾아 써 보세요.',
           '예) 우리 반 남학생 수와 여학생 수를 비교할 때, 줄넘기를 한 횟수와 성공한 횟수를 비교할 때예요.'),
    's2': ('간식 꾸러미가 늘어날 때 뺄셈보다 나눗셈으로 비교하는 것이 좋은 까닭을 써 보세요.',
           '예) 쿠키 수 − 주스 수는 3, 6, 9로 변하지만 쿠키 수 ÷ 주스 수는 언제나 4라서 두 양의 관계를 한 수로 나타낼 수 있어요.'),
    's3': ('4500 : 1500과 1500 : 4500이 서로 다른 비인 까닭을 기준량을 넣어 써 보세요.',
           '예) 4500 : 1500은 어린이 입장료 1500원이 기준량이고, 1500 : 4500은 어른 입장료 4500원이 기준량이에요. 기준이 다르니 서로 다른 비예요.'),
    's4': ('크기가 다른 사진 가(가로 8 cm, 세로 6 cm)와 다(가로 4 cm, 세로 3 cm)의 비율이 같은 까닭을 써 보세요.',
           '예) 가로에 대한 세로의 비율이 가는 6 ÷ 8 = 0.75, 다는 3 ÷ 4 = 0.75로 같아요. 비율은 길이가 아니라 몇 배인지를 나타내서 모양이 같아요.'),
    's5': ('지도에서 실제 거리에 대한 지도에서의 거리의 비를 구할 때 단위를 같게 해야 하는 까닭을 써 보세요.',
           '예) 1 cm와 200 m를 그대로 쓰면 1 : 200이 되어 틀려요. 200 m = 20000 cm로 바꾸어야 1 : 20000이에요.'),
    's6': ('푼 문제 수가 다른 수아와 은재의 성적을 백분율로 나타내면 비교하기 쉬운 까닭을 써 보세요.',
           '예) 백분율은 기준량을 100으로 같게 한 비율이라 수아 65 %, 은재 64 %처럼 수만 보고 바로 비교할 수 있어요.'),
    's7': ('스케치북의 할인율을 구할 때 할인한 뒤의 가격 2400원으로 나누면 안 되는 까닭을 써 보세요.',
           '예) 할인율은 판매 금액 3000원이 기준량이고 할인 금액 600원이 비교하는 양이에요. 2400원은 기준량이 아니에요.'),
    's8': ('지난달 전기 사용량이 다른 두 집의 절약 계획을 백분율로 비교하는 까닭을 써 보세요.',
           '예) 줄이는 양(kWh)만 보면 사용량이 많은 집이 유리해요. 백분율로 나타내면 지난달에 비해 얼마나 줄였는지 공평하게 비교할 수 있어요.'),
    's9': ('비율이 같은 카드를 찾을 때 같은 표현으로 바꾸어 비교하는 까닭을 써 보세요.',
           '예) 2 : 5와 40 %처럼 모양이 달라도 비율이 같을 수 있어요. 모두 소수로 바꾸면 0.4 = 0.4로 바로 알 수 있어요.'),
    's10': ('비, 비율, 백분율의 관계를 여론 조사 결과(25명 중 15명 찬성)를 예로 들어 써 보세요.',
            '예) 찬성한 학생 수와 전체 학생 수의 비는 15 : 25이고, 비율은 15 ÷ 25 = 3/5 = 0.6이에요. 0.6에 100을 곱한 60 %가 백분율이에요.'),
}


def st_lesson(s, lv, L, first, story):
    """이야기 버전 한 차시: 앱의 계단 이름 '만져 보기 — 체험 부스 두 번 열기' → ① 만져 보기 | 체험 부스 두 번 열기"""
    s.lesson(L['no'], L['soop'], L['title'], L['question'])
    if first and story:
        s.scene(None, rd(story['lines'][0] + ' ' + story['lines'][1]))
        s.text('※ 식 줄은 분수를 위아래로 썼어요. 글 속에서는 ‘5분의 3’처럼 읽는 말로 썼어요. 네모 칸에는 수를 써요. '
               '‘(예)’가 붙은 답은 조건에 맞으면 다른 답도 맞아요.')
    ans = []
    for i, st_ in enumerate(L['steps']):
        nm = st_['name'] or STEP_NAMES[min(i, len(STEP_NAMES) - 1)]
        main, _, sub = nm.partition(' — ')
        s.step('%s %s' % (NUM[i], main.strip()), sub.strip() or None)
        show_inst(s, lv, st_['inst'], st_['hints'], (L['id'], i))
        ans.append('%s %s' % (NUM[i], run_calls(s, lv, st_['calls'])))
    if lv == '도전형':
        n = len(L['steps'])
        if L.get('ch'):
            s.step('%s ★ 도전하기' % NUM[n], '앱의 도전 문제')
            show_inst(s, lv, re.sub(r'^★ 도전 — ', '', L['ch']['inst']), [], (L['id'], 'ch'))
            ans.append('%s %s' % (NUM[n], run_calls(s, lv, L['ch']['calls'])))
            n += 1
        q, a = WHY_ST[L['id']]
        s.step('%s 생각 쓰기' % NUM[n], '왜 그럴까요?')
        s.ask(rd(q), blank=False)
        s.lines(2)
        ans.append('%s %s' % (NUM[n], a))
    return '%s차시  %s' % (L['no'], '  '.join(ans))


DATA = {}

# 이야기 버전 차시(앱 u4-ratio.st.js의 LESSONS id 차례 — 1~10차시)
ST_IDS = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10']


def _st(lid):
    def f(s, lv):
        Ls = DATA['lessons']
        k = [L['id'] for L in Ls].index(lid)
        return st_lesson(s, lv, Ls[k], k == 0, DATA.get('story'))
    f.__name__ = 'st_' + lid
    return f


ST = [_st(lid) for lid in ST_IDS]


# ================================================================ 도전형: ①~⑤(도전하기 앞의 모든 칸)를 새 문제로(2026-10-30)
# 기본형은 앱에서 읽은 그대로 두고, 도전형은 같은 칸 이름·같은 부품(묶음 표·양 카드·이중 테이프·모눈·지도 …)에 새 수와 새 상황을
# 넣은 기록(HARD_TB·HARD_ST)으로 바꿉니다. 식 줄의 답은 render_rows의 check_full이 분수로 다시 계산해 확인해요.
import copy  # noqa: E402


def _w(name, *args):
    return {'w': name, 'args': list(args)}


def C(*o, a=0):
    return {'c': list(o), 'a': a}


def I(x):
    return {'i': str(x)}


def Fr(t):
    return {'f': t}


def R(a, b):
    return {'r': [a, b]}


def QZ(q, o, a=0):
    return {'q': q, 'o': list(o), 'a': a}


def QUIZ(*items):
    return _w('quiz', list(items), {})


def CH(*rows):
    return _w('ra4Chain', list(rows), {})


def SEQ(*parts):
    """ra4Seq: parts = (제목 또는 None, [부품…])"""
    return _w('ra4Seq', [{'title': t, 'calls': calls} for t, calls in parts])


def BL(*parts):
    return _w('blanks', [p if isinstance(p, str) else {'o': p[0], 'a': p[1] if len(p) > 1 else 0} for p in parts], {})


def BUILD(what, unit, items, ask, start=1, target=2, mx=4, head=None):
    o = {'what': what, 'unit': unit, 'start': start, 'target': target, 'max': mx,
         'items': [{'name': n, 'per': p, 'unit': u} for n, p, u in items], 'ask': ask}
    if head:
        o['head'] = head
    return _w('ra4Build', o)


def SLOTS(chips, tasks):
    return _w('ra4Slots', {'chips': [{'t': t, 'v': v} for t, v in chips], 'tasks': [{'q': q, 'a': a} for q, a in tasks]})


def TAPE(N, unit, steps, target, whole, part, mode, ask):
    return _w('ra4Tape2', {'N': N, 'unit': unit, 'steps': steps, 'target': target, 'whole': whole, 'part': part, 'mode': mode, 'ask': ask})


def GRID(grids, ask, cell=None):
    o = {'grids': [dict(zip(('name', 'title', 'cols', 'rows', 'target'), g)) for g in grids], 'ask': ask}
    if cell:
        o['cell'] = cell
    return _w('ra4Grid', o)


def RECT(W, H, tasks, nw='가로', nh='세로', unit='cm'):
    return _w('ra4Rect', {'W': W, 'H': H, 'nw': nw, 'nh': nh, 'unit': unit, 'tasks': [{'goal': g, 'sols': s_} for g, s_ in tasks]})


def TBL(head, rows):
    return _w('tbl', {'head': head, 'rows': rows})


def WS(*items):
    return _w('writeStep', [{'q': q, 'ph': '예) ' + ph} for q, ph in items])


def WSA(*items):
    """이야기 버전 쓰기(모범 답)"""
    return _w('writeStep', [{'q': q, 'ans': ans} for q, ans in items])


def TWHY(q, ans):
    return _w('thenWhy', {'q': q, 'ans': ans})


def RFIRST(q, ans):
    return _w('ruleFirst', {'q': q, 'ans': ans})


def harden(D, kind):
    """도전형: 차시마다 칸(step)의 안내 글과 활동을 HARD_*의 새 문제로 바꿈(칸 이름은 그대로)"""
    D = copy.deepcopy(D)
    H = HARD_TB if kind == 'tb' else HARD_ST
    for L in D['lessons']:
        new = H[L['id']]
        assert len(new) == len(L['steps']), ('도전형 칸 수가 앱과 달라요', L['id'], len(new), len(L['steps']))
        for st_, (inst, calls) in zip(L['steps'], new):
            st_['inst'], st_['calls'], st_['hints'] = inst, calls, []
    return D


HARD_TB = {
    't1': [
        ('어떤 박물관 건물을 앞에서 보면 가로가 높이의 [5/3]배래요. 물음에 답한 다음, 모눈에 가로가 높이의 [5/3]배인 직사각형을 그려 보세요.', [SEQ(
            (None, [QUIZ(QZ('가로는 높이의 [5/3]배예요. 가로와 높이 중 더 긴 것은 무엇일까요?', ['가로', '높이']),
                         QZ('높이가 3 m라면 가로는 몇 m일까요?', ['5 m', '3 m', '8 m']))]),
            (None, [RECT(12, 8, [('높이는 6칸이에요. 가로가 높이의 [5/3]배인 직사각형을 그려 보세요.', [[10, 6]])], nh='높이', unit='칸')]))]),
        ('비교하는 말을 살펴보고 알맞은 것을 골라 보세요.', [CH(
            ['“어른 수는 어린이 수의 2배예요.”에서 기준이 되는 양은 ', C('어린이 수', '어른 수')],
            ['“형은 동생보다 3살 많아요.”는 두 양을 ', C('뺄셈', '나눗셈'), '으로 비교한 말이에요.'],
            ['[3/4]배, 0.75배는 모두 ', C('같은 크기', '다른 크기'), '를 나타내요.'])]),
        ('3학년, 5학년에 배운 분수와 소수, 대응 관계를 떠올려요. 빈칸을 채워 보세요.', [CH(
            ['[7/20]을 소수로 나타내면 ', I('0.35')], ['0.125를 분수로 나타내면 ', Fr('1/8')], ['[3/8] ', C('>', '=', '<'), ' 0.35'],
            ['자전거 한 대에 바퀴가 2개씩 있어요. 자전거 수를 □, 바퀴 수를 △라고 할 때 □ = △ ', C('÷ 2', '× 2', '− 2')])]),
        ('휴양림에서 볼 수 있는 일들이에요. 두 양을 비교하는 상황을 찾아보세요.', [QUIZ(
            QZ('두 양을 비교하는 상황을 모두 골라요.', ['집라인을 탄 어른 수와 어린이 수 비교하기', '잡은 물고기 수와 놓아준 물고기 수 비교하기',
                                            '농구공을 던진 횟수와 넣은 횟수 비교하기', '휴양림에 도착한 날짜 말하기'], [0, 1, 2]))]),
        ('비교한 말을 살펴보고 물음에 답해 보세요.', [QUIZ(
            QZ('한 양이 다른 양의 몇 배인지로 비교한 것을 모두 골라요.', ['우리 반 학생 수는 모둠 수의 6배예요.', '형은 동생보다 3살 많아요.',
                                                         '물의 양은 주스 양의 [1/2]배예요.', '오늘은 어제보다 2 °C 더워요.'], [0, 2]))]),
    ],
    't2': [
        ('“보트 한 대에는 어른 5명과 어린이 2명이 탈 수 있습니다.” 보트를 늘려 보고, 어른 수와 어린이 수를 비교해 보세요.', [BUILD(
            '보트', '대', [('어른 수', 5, '명'), ('어린이 수', 2, '명')],
            [['어른 수는 어린이 수의 5 ÷ 2 = ', Fr('5/2'), '배'], ['어린이 수는 어른 수의 2 ÷ 5 = ', Fr('2/5'), '배'],
             ['보트 세 대에 탈 수 있는 어린이가 6명일 때 어른은 5 × 3 = ', I(15), '명까지 탈 수 있어요.']])]),
        ('쌀 2컵과 물 3컵으로 주먹밥 한 판을 만들어요. 주먹밥을 세 판까지 늘려 보고 두 양을 비교해 보세요.', [BUILD(
            '주먹밥', '판', [('쌀의 양', 2, '컵'), ('물의 양', 3, '컵')],
            [['주먹밥 네 판: 쌀 ', I(8), '컵, 물 ', I(12), '컵'], ['물의 양은 쌀의 양의 12 ÷ 8 = ', Fr('3/2'), '배'],
             ['주먹밥 판 수가 늘어나도 물의 양이 쌀의 양의 몇 배인지는 ', C('변하지 않아요', '변해요')]], target=3)]),
        ('사과 450 g과 배 150 g을 한 상자에 담아요. 상자를 두 개로 늘려 보고, 두 양을 차이와 몇 배로 비교해 보세요.', [BUILD(
            '상자', '상자', [('사과의 양', 450, 'g'), ('배의 양', 150, 'g')],
            [['세 상자: 사과 ', I(1350), ' g, 배 ', I(450), ' g'], ['두 양의 차이는 상자 수가 늘어날수록 ', C('커져요', '그대로예요')],
             ['사과의 양은 배의 양의 ', I(3), '배로 늘 같아요.']], head='상자 수')]),
        ('두 양을 비교하는 방법을 새 예로 정리해요.', [BL(
            '두 양의 차이는 ', (['뺄셈', '나눗셈'],), '으로, 한 양이 다른 양의 몇 배인지는 ', (['나눗셈', '뺄셈'],),
            '으로 구해요. 상자 수가 늘어나도 변하지 않는 것은 두 양의 ', (['몇 배', '차이'],), '예요.')]),
        ('연필과 지우개 묶음을 비교해 보세요.', [SEQ(
            (None, [CH(['연필 5자루와 지우개 2개를 한 묶음으로 팔아요. 여섯 묶음의 연필은 ', I(30), '자루, 지우개는 ', I(12), '개'],
                       ['연필 수는 지우개 수의 30 ÷ 12 = ', Fr('5/2'), '배'],
                       ['연필이 45자루 있으면 묶음은 ', I(9), '묶음이고 지우개는 ', I(18), '개 필요해요.'])]),
            (None, [QUIZ(QZ('지우개 수는 연필 수의 몇 배일까요?', ['[2/5]배', '[5/2]배', '3배']))]))]),
    ],
    't3': [
        ('“레몬청 2컵과 물 5컵을 섞으면 맛있는 레몬차가 돼.” 레몬차를 세 병까지 만들어 보고, 두 양을 비교해 보세요.', [BUILD(
            '레몬차', '병', [('레몬청의 양', 2, '컵'), ('물의 양', 5, '컵')],
            [['물의 양은 레몬청의 양의 ', Fr('5/2'), '배예요.'], ['레몬청의 양은 물의 양의 ', Fr('2/5'), '배예요.']], target=3, mx=3, head='레몬차 병 수')]),
        ('기준이 되는 양을 기호 : 의 오른쪽에 놓아요. 양 카드를 골라 비를 만들어 보세요.', [SLOTS(
            [('레몬청 2컵', 2), ('물 5컵', 5), ('레몬차 7컵', 7)],
            [('레몬청의 양에 대한 물의 양의 비', [1, 0]), ('레몬차 전체의 양에 대한 레몬청의 양의 비', [0, 2])])]),
        ('비를 여러 가지 방법으로 읽고, 기준량을 찾아보세요.', [QUIZ(
            QZ('3 : 8을 바르게 읽은 것을 모두 골라요.', ['3 대 8', '8 대 3', '3의 8에 대한 비', '8에 대한 3의 비', '3에 대한 8의 비'], [0, 2, 3]),
            QZ('기준량이 7인 비를 골라요.', ['2 : 7', '7 : 2']))]),
        ('비를 새 예로 정리해요.', [BL(
            '5 : 9에서 기준량은 ', (['9', '5'],), '이고, 비교하는 양은 ', (['5', '9'],), '예요. 9에 대한 5의 비와 5 : 9는 ', (['같은 비', '다른 비'],), '예요.')]),
        ('입장료와 초콜릿을 비로 나타내 보세요.', [SEQ(
            ('박물관 입장료는 어른 3000원, 어린이 1800원이에요.', [SLOTS([('어른 3000원', 3000), ('어린이 1800원', 1800)], [('어른 입장료에 대한 어린이 입장료의 비', [1, 0])]),
                                                     CH(['1800 : 3000에서 기준량은 ', I(3000), ', 비교하는 양은 ', I(1800)])]),
            ('초콜릿 12개 중 5개를 먹었어요.', [_w('ra4Choc', {'total': 12, 'eat': 5, 'ask': [
                ['처음에 있던 초콜릿 수에 대한 남은 초콜릿 수의 비 ', R(7, 12)], ['먹은 초콜릿 수에 대한 남은 초콜릿 수의 비 ', R(7, 5)]]})]))]),
    ],
    't4': [
        ('“낚시 도구 한 세트에는 낚싯대 3개와 미끼통 8개가 들어 있습니다.” 미끼통 막대 전체를 1로 볼 때 낚싯대 막대의 길이를 알아보세요.', [_w('ra4Comp', {
            'base': {'name': '미끼통', 'n': 8}, 'comp': {'name': '낚싯대', 'n': 3},
            'ask': [['미끼통의 수에 대한 낚싯대의 수의 비 ', R(3, 8)], ['낚싯대의 수는 미끼통의 수의 3 ÷ 8 = ', Fr('3/8'), '배, 소수로 ', I('0.375'), '배예요.']]})]),
        ('메모지 가(가로 8 cm, 세로 6 cm), 나(가로 5 cm, 세로 7 cm), 다(가로 12 cm, 세로 9 cm)의 가로에 대한 세로의 비와 비율을 구해 보세요.', [CH(
            {'t': '가', 'p': ['비 ', R(6, 8), ' 분수 ', Fr('6/8'), ' 소수 ', I('0.75')]}, {'t': '나', 'p': ['비 ', R(7, 5), ' 분수 ', Fr('7/5'), ' 소수 ', I('1.4')]},
            {'t': '다', 'p': ['비 ', R(9, 12), ' 분수 ', Fr('9/12'), ' 소수 ', I('0.75')]},
            ['가로에 대한 세로의 비율이 같은 메모지: ', C('가와 다', '가와 나', '나와 다')], ['비율이 1보다 큰 메모지: ', C('가', '나', '다', a=1)])]),
        ('조건에 맞는 메모지를 모눈에 그려 보세요.', [RECT(12, 9, [
            ('가로에 대한 세로의 비율이 1.5인 메모지를 그려 보세요. (가로는 6칸 이하)', [[2, 3], [4, 6], [6, 9]]),
            ('가로에 대한 세로의 비율이 메모지 가(0.75)와 같고 가로가 4 cm인 메모지를 그려 보세요.', [[4, 3]])])]),
        ('비율을 새 예로 정리해요.', [BL(
            '비 7 : 20을 비율로 나타내면 분수로 ', (['[7/20]', '[20/7]'],), ', 소수로 ', (['0.35', '2.85'],), '이에요. 비율이 1보다 크면 비교하는 양이 기준량보다 ', (['커요', '작아요'],), '.')]),
        ('포도 음료를 만들었어요. 서희는 포도즙 3 L를 넣어 포도 음료 12 L를, 연우는 포도즙 2 L를 넣어 포도 음료 5 L를 만들었어요. 포도 음료의 양에 대한 포도즙의 양의 비율을 구하고 비교해 보세요.', [CH(
            {'t': '서희', 'p': ['분수 ', Fr('3/12'), ' 소수 ', I('0.25')]}, {'t': '연우', 'p': ['분수 ', Fr('2/5'), ' 소수 ', I('0.4')]},
            ['포도 맛이 더 진한 음료를 만든 사람: ', C('연우', '서희')])]),
    ],
    't5': [
        ('실제 거리 400 m를 1 cm로 나타낸 지도와 실제 거리 600 m를 1 cm로 나타낸 지도가 있어요. 입구에서 폭포까지의 실제 거리 2400 m를 두 지도에 그려 보세요.', [_w('ra4Map', {
            'real': 2400, 'maps': [{'name': '숲길 지도', 'per': 400}, {'name': '계곡 지도', 'per': 600}],
            'ask': [['400 m = ', I(40000), ' cm, 600 m = ', I(60000), ' cm'], ['숲길 지도의 비 1 : ', I(40000), ', 계곡 지도의 비 1 : ', I(60000)],
                    ['같은 장소를 더 크게 나타내는 지도: ', C('숲길 지도', '계곡 지도')]]})]),
        ('어느 가게에서 하루 동안 복숭아 250개 중 175개, 자두 300개 중 195개를 팔았어요. 판매한 비율을 이중 테이프로 알아보세요.', [SEQ(
            ('복숭아', [TAPE(250, '개', 25, 175, '처음에 있던 복숭아 수', '판매한 복숭아 수', 'ratio', [['복숭아: 비율 ', Fr('175/250'), ' = ', I('0.7')]])]),
            ('자두', [TAPE(300, '개', 20, 195, '처음에 있던 자두 수', '판매한 자두 수', 'ratio', [['자두: 비율 ', Fr('195/300'), ' = ', I('0.65')]])]),
            (None, [CH(['판매한 비율이 더 높은 과일: ', C('복숭아', '자두')])]))]),
        ('푸른시와 맑은시의 인구와 넓이예요. 넓이에 대한 인구의 비율을 구해 비교해 보세요. 수가 크면 계산기를 써도 좋아요.', [
            TBL(['도시', '인구(명)', '넓이(km²)'], [['푸른시', '1350000', '900'], ['맑은시', '1860000', '1500']]), _w('calc'),
            CH(['푸른시: 1350000 ÷ 900 = ', {'i': '1500', 'w': True}], ['맑은시: 1860000 ÷ 1500 = ', {'i': '1240', 'w': True}],
               ['넓이에 대한 인구의 비율이 더 높은 도시: ', C('푸른시', '맑은시')])]),
        ('생활에서 비율을 비교하는 방법을 새 예로 정리해요.', [BL(
            '타율은 친 타수에 대한 안타 수의 비율이에요. 20타수 7안타인 선수의 타율은 ', (['0.35', '0.7', '2.85'],), '이고, 기준량은 ', (['타수', '안타 수'],), '예요.')]),
        ('자전거 기록을 비교해 보세요.', [SEQ(
            ('서희는 자전거로 90 m를 가는 데 36초, 연우는 120 m를 가는 데 40초가 걸렸습니다. 걸린 시간에 대한 간 거리의 비율이 더 높은 사람은 누구인가요?', [
                CH(['서희: 90 ÷ 36 = ', I('2.5')], ['연우: 120 ÷ 40 = ', I(3)], ['비율이 더 높은 사람: ', C('연우', '서희')])]),
            ('같은 비율로 달린다면 연우가 150 m를 가는 데 걸리는 시간을 구해 보세요.', [CH(['150 ÷ 3 = ', I(50), '(초)'])]))]),
    ],
    't6': [
        ('주리는 공을 40번 던져서 18번, 민석이는 공을 50번 던져서 21번 넣었어요. 모눈에 넣은 횟수만큼 색칠해 보세요.', [GRID(
            [('주리', '주리(공을 40번 던짐)', 10, 4, 18), ('민석', '민석(공을 50번 던짐)', 10, 5, 21)],
            [['던진 횟수에 대한 넣은 횟수의 비율: 주리 ', Fr('18/40'), ', 민석 ', Fr('21/50')]], cell=26)]),
        ('두 사람이 공을 100번씩 던졌다면 각각 몇 번 넣었을지 100칸 모눈에 색칠해 보세요.', [GRID(
            [('주리', '주리가 100번 던졌다면', 10, 10, 45), ('민석', '민석이가 100번 던졌다면', 10, 10, 42)],
            [['주리: 100 = 40 × 2.5이므로 18 × 2.5 = ', I(45), '(번)'], ['민석: 100 = 50 × 2이므로 21 × 2 = ', I(42), '(번)'],
             ['비율이 더 높은 사람: ', C('주리', '민석')]], cell=24)]),
        ('수족관 물고기 40마리 중 금붕어가 26마리예요. 금붕어 수는 전체 물고기 수의 몇 %인지 두 가지 방법으로 알아보세요.', [SEQ(
            (None, [TAPE(40, '마리', 40, 26, '전체 물고기 수', '금붕어 수', 'pct', [
                {'t': '방법 1 기준량을 100으로 바꾸기', 'p': ['[26/40] = [65/100]이므로 ', I(65), ' %']},
                {'t': '방법 2 비율에 100 곱하기', 'p': ['[26/40] = ', I('0.65'), ', 0.65 × 100 = ', I(65), ' → 65 %']}])]))]),
        ('백분율을 새 예로 정리해요.', [BL(
            '비율 [3/8]을 백분율로 나타내면 ', (['37.5 %', '3.8 %', '38 %'],), '이고, 120 %는 비율로 ', (['1.2', '0.12', '12'],), '예요. 백분율이 100 %보다 크면 비교하는 양이 기준량보다 ', (['커요', '작아요'],), '.')]),
        ('비율을 백분율로, 백분율을 비율로 나타내 보세요.', [CH(
            ['[9/25] → ', I(36), ' %'], ['[7/40] → ', I('17.5'), ' %'], ['1.3 → ', I(130), ' %'], ['8 % → 소수 ', I('0.08')])]),
    ],
    't7': [
        ('설문에 참여한 250명 가운데 ‘숲 체험’을 고른 사람이 95명, ‘물놀이’를 고른 사람이 80명, ‘캠핑’을 고른 사람이 75명이에요. 각각 백분율로 나타내 보세요.', [SEQ(
            (None, [TAPE(250, '명', 50, 95, '설문에 참여한 사람 수', '‘숲 체험’을 고른 사람 수', 'pct', [['숲 체험: [95/250] × 100 = ', I(38), ' %']])]),
            (None, [CH(['물놀이: [80/250] × 100 = ', I(32), ' %   캠핑: [75/250] × 100 = ', I(30), ' %'], ['세 항목의 백분율의 합: ', I(100), ' %'])]))]),
        ('가 공장은 장난감 800개 중 28개, 나 공장은 장난감 450개 중 18개가 불량품이었어요. 불량품의 비율을 백분율로 나타내 비교해 보세요.', [SEQ(
            (None, [CH(['가 공장: [28/800] × 100 = ', I('3.5'), ' %'], ['나 공장: [18/450] × 100 = ', I(4), ' %'], ['불량품의 비율이 더 낮은 공장: ', C('가 공장', '나 공장')])]))]),
        ('판매 금액이 7500원인 모자를 할인하여 6000원에, 판매 금액이 12000원인 가방을 할인하여 9000원에 팔아요. 판매 금액에 대한 할인 금액의 비율을 백분율로 나타내 보세요.', [SEQ(
            (None, [CH(['모자 할인 금액: 7500 − 6000 = ', I(1500), '(원)'], ['가방 할인 금액: 12000 − 9000 = ', I(3000), '(원)'])]),
            ('모자', [TAPE(7500, '원', 100, 1500, '모자 판매 금액', '할인 금액', 'pct', [['[1500/7500] × 100 = ', I(20), ' %']])]),
            (None, [CH(['가방: [3000/12000] × 100 = ', I(25), ' %'], ['할인 금액의 비율이 더 높은 상품: ', C('가방', '모자')])]))]),
        ('백분율이 쓰이는 경우를 새 예로 정리해요.', [BL(
            '판매 금액 20000원인 물건을 15 % 할인하면 할인 금액은 ', (['3000원', '1500원', '17000원'],), '이고, 할인한 뒤의 가격은 ', (['17000원', '3000원'],), '이에요.')]),
        ('1년 동안 은행에 예금한 돈과 받은 이자예요. 예금한 돈에 대한 이자의 비율을 백분율로 나타내 보세요.', [
            TBL(['은행', '예금한 돈(원)', '이자(원)'], [['하늘 은행', '150000', '4500'], ['바다 은행', '80000', '2800']]),
            CH(['하늘 은행: [4500/150000] × 100 = ', I(3), ' %'], ['바다 은행: [2800/80000] × 100 = ', I('3.5'), ' %'],
               ['예금할 돈이 같다면 더 이익인 은행: ', C('바다 은행', '하늘 은행')], ['바다 은행에 200000원을 1년 동안 예금하면 이자는 ', I(7000), '원'])]),
    ],
    't8': [
        ('지후네 집의 지난달 전기 사용량은 300 kWh였어요. 이번 달에 가전제품 사용을 줄여 전기를 절약하려고 해요.', [QUIZ(
            QZ('지난달 전기 사용량의 5 %를 줄이려면 몇 kWh를 줄여야 할까요?', ['15 kWh', '5 kWh', '30 kWh']),
            QZ('줄이려는 전기 사용량을 백분율로 나타낼 때 기준량은 무엇일까요?', ['지난달 전기 사용량', '줄이려는 전기 사용량']))]),
        ('지후네 가족의 계획: 텔레비전 8 kWh, 전기밥솥 4 kWh, 에어컨 9 kWh를 줄여요. 계획에 있는 가전제품을 모두 골라 보세요.', [_w('ra4Save', {
            'items': [{'name': '텔레비전', 'kwh': 8}, {'name': '냉장고', 'kwh': 5}, {'name': '전기밥솥', 'kwh': 4}, {'name': '세탁기', 'kwh': 3}, {'name': '에어컨', 'kwh': 9}],
            'plan': [0, 2, 4], 'planSum': 21, 'ask': [['줄이려는 전기 사용량: 8 + 4 + 9 = ', I(21), ' (kWh)']]})]),
        ('줄이려는 전기 사용량과 지난달 전기 사용량을 비와 비율로 나타내 보세요.', [CH(
            ['지난달 전기 사용량에 대한 줄이려는 전기 사용량의 비: ', R(21, 300)], ['비율: 분수 ', Fr('21/300'), ', 소수 ', I('0.07')])]),
        ('이중 테이프로 줄이려는 전기 사용량이 지난달 전기 사용량의 몇 %인지 구해 보세요.', [TAPE(
            300, 'kWh', 30, 21, '지난달 전기 사용량', '줄이려는 전기 사용량', 'pct', [['[21/300] × 100 = ', I(7), ' → ', I(7), ' %']])]),
        ('서윤이네 집은 지난달 전기 사용량이 250 kWh였고, 이번 달에 지난달보다 12 % 줄이려고 해요. 이번 달 전기 사용량은 몇 kWh가 되는지 구해 보세요.', [SEQ(
            (None, [CH(['줄이려는 전기 사용량: 250 × [12/100] = ', I(30), ' (kWh)'], ['이번 달 전기 사용량: 250 − 30 = ', I(220), ' (kWh)'],
                       ['지후네(7 %)와 서윤이네(12 %) 중 더 많은 비율로 줄이려는 집: ', C('서윤이네', '지후네')])]))]),
    ],
    't9': [
        ('‘비율이 같은 카드를 찾아요!’ 놀이 규칙을 확인해 보세요.', [QUIZ(
            QZ('카드 2장의 비율이 다르면 어떻게 하나요?', ['다시 뒤집어 원래 자리에 두고 차례가 넘어가요.', '카드를 모두 가져가요.', '한 번 더 뒤집어요.']),
            QZ('놀이가 끝나는 때는 언제인가요?', ['남은 카드가 없을 때', '카드 2장을 뒤집었을 때', '한 사람이 이겼다고 말할 때']))]),
        ('새 카드로 연습해요. 카드 두 장의 비율이 같은지 판단해 보세요.', [_w('ra4Same', {
            'pairs': [['9 : 15', '60 %'], ['3 : 8', '0.38'], ['[7/25]', '28 %'], ['1.5', '15 %'], ['14 : 20', '[7/10]'], ['4 : 5', '0.45']]})]),
        ('친구와 놀이를 하기 전에 카드 짝을 미리 찾아보세요.', [_w('ra4Same', {
            'pairs': [['2 : 8', '0.25'], ['[9/20]', '45 %'], ['6 : 4', '1.6'], ['0.06', '6 %'], ['12 : 15', '80 %'], ['[1/8]', '0.18']]})]),
        ('놀이를 하며 생각한 것을 말해 보세요.', [QUIZ(
            QZ('3 : 20과 비율이 같은 카드를 모두 골라요.', ['15 %', '[3/20]', '0.3', '20 : 3', '0.15'], [0, 1, 4]),
            QZ('비율이 가장 높은 카드는 무엇일까요?', ['7 : 10', '0.65', '[13/20]', '68 %']))]),
        ('비율이 같은 카드를 찾아 확인해 보세요.', [SEQ(
            (None, [QUIZ(QZ('비율이 같은 카드끼리 짝 지은 것이 아닌 것을 골라요.', ['11 : 20 — 55 %', '9 : 4 — 2.25', '[3/40] — 7.5 %', '4 : 25 — 0.4'], 3))]),
            (None, [CH(['0.35를 백분율로 나타내면 ', I(35), ' %, 기약분수로 나타내면 ', Fr('7/20')])]))]),
    ],
    't10': [
        ('노란색 물감 75 g과 빨간색 물감 45 g을 섞어 주황색 물감 한 병을 만들어요. 표를 완성하여 두 양을 비교해 보세요.', [BUILD(
            '주황색 물감', '병', [('노란색 물감의 양', 75, 'g'), ('빨간색 물감의 양', 45, 'g')],
            [['네 병: 노란색 물감 ', I(300), ' g, 빨간색 물감 ', I(180), ' g'], ['노란색 물감의 양은 빨간색 물감의 양의 75 ÷ 45 = ', Fr('5/3'), '배']],
            head='주황색 물감 병 수')]),
        ('비로 나타내고, 비율이 같은 것끼리 이어 보세요.', [SEQ(
            (None, [CH(['배 6개, 귤 15개가 있어요. 배 수와 귤 수의 비 ', R(6, 15)], ['배 수에 대한 귤 수의 비 ', R(15, 6)])]),
            ('비율이 같은 것끼리 이어 보세요.', [_w('ra4Link', {'heads': ['비', '분수', '소수', '백분율'],
                                                     'cols': [['7 : 28', '9 : 15', '18 : 40'], ['[3/5]', '[9/20]', '[1/4]'], ['0.25', '0.45', '0.6'], ['60 %', '25 %', '45 %']]})]))]),
        ('비율을 구하고, 잘못된 설명을 찾아보세요.', [SEQ(
            ('하진이는 물 40 mL에 소금 6 mL를, 지원이는 물 25 mL에 소금 5 mL를 녹였어요. 물의 양에 대한 소금의 양의 비율을 구해 보세요.', [
                CH(['하진: 분수 ', Fr('6/40'), ', 소수 ', I('0.15')], ['지원: 분수 ', Fr('5/25'), ', 소수 ', I('0.2')], ['더 짠 소금물을 만든 사람: ', C('지원', '하진')])]),
            (None, [QUIZ(QZ('서희네 반 학생 28명 중 여학생은 12명이에요. 잘못 설명한 것을 골라요.',
                            ['㉠ 전체 학생 수에 대한 여학생 수의 비율은 [3/7]입니다.', '㉡ 남학생 수에 대한 여학생 수의 비는 12 : 16입니다.', '㉢ 남학생 수는 전체 학생 수의 16 %입니다.'], 2))]))]),
        ('판매 금액이 6000원인 공책을 할인하여 4800원에, 판매 금액이 9000원인 필통을 할인하여 7650원에 팔아요. 할인 금액의 비율이 더 높은 물건을 찾아보세요.', [SEQ(
            (None, [CH(['공책 할인 금액: 6000 − 4800 = ', I(1200), '(원)   필통 할인 금액: 9000 − 7650 = ', I(1350), '(원)'])]),
            ('공책', [TAPE(6000, '원', 100, 1200, '공책 판매 금액', '할인 금액', 'pct', [['공책: [1200/6000] × 100 = ', I(20), ' %']])]),
            (None, [CH(['필통: [1350/9000] × 100 = ', I(15), ' %'], ['할인 금액의 비율이 더 높은 물건: ', C('공책', '필통')])]))]),
        ('단원에서 배운 내용을 새 예로 정리해 보세요.', [BL(
            '3 : 4에서 기준량은 ', (['4', '3'],), '이고, 비율은 [3/4] = ', (['0.75', '1.33'],), '이며, 백분율로 나타내면 ', (['75 %', '7.5 %'],), '예요. 백분율 130 %는 비율로 ', (['1.3', '0.13'],), '예요.')]),
    ],
}


HARD_ST = {
    's1': [
        ('방송부 기획표가 새로 왔어요. 기획표를 읽고 세 칸에 써 보세요.', [
            _w('note', '방송부 새 기획표', ['점심 방송 신청곡 30곡 중 동요가 12곡', '퀴즈 코너 참가자 남학생 14명, 여학생 21명', '방송 장비: 마이크 3개, 스피커 7개',
                                       '여론 조사: 응답한 학생 40명 중 찬성 26명']),
            _w('panes', [{'t': '찾았어요', 'ph': '기획표에서 ~을 찾았어요', 'ex': ['남학생 14명과 여학생 21명처럼 두 양을 비교할 수 있는 수를 찾았어요.']},
                         {'t': '생각해요', 'ph': '~은 ~의 몇 배일 것 같아요', 'ex': ['스피커 수는 마이크 수의 2배보다 많을 것 같아요.']},
                         {'t': '궁금해요', 'ph': '~은 어떻게 나타낼까?', 'ex': ['40명 중 26명이 찬성한 것을 백분율로 어떻게 나타낼까?']}])]),
        ('기획표에서 두 양을 비교하는 방법을 골라 보세요.', [
            CH(['남학생 14명과 여학생 21명을 뺄셈으로 비교하면 여학생이 ', I(7), '명 더 많아요.'],
               ['여학생 수는 남학생 수의 21 ÷ 14 = ', Fr('3/2'), '배예요.'],
               ['스피커 수는 마이크 수의 ', Fr('7/3'), '배예요.']),
            TWHY('남학생과 여학생 수를 ‘몇 배’로 비교하면 좋은 점을 써 볼까요?', '참가자 수가 늘어나도 여학생 수가 남학생 수의 몇 배인지는 같아서 두 양의 관계를 한 수로 나타낼 수 있어요.')]),
        ('3학년, 5학년에 배운 분수와 소수, 대응 관계를 떠올려요.', [CH(
            ['[9/25]를 소수로 나타내면 ', I('0.36')], ['0.375를 분수로 나타내면 ', Fr('3/8')], ['[5/8] ', C('>', '=', '<'), ' 0.6'],
            ['마이크 한 개에 건전지가 2개씩 들어가요. 마이크 수를 □, 건전지 수를 △라고 할 때 △ = □ ', C('× 2', '+ 2', '÷ 2')])]),
        ('비교하는 말을 살펴보고 알맞은 것을 골라 보세요.', [CH(
            ['“찬성한 학생 수는 응답한 학생 수의 [13/20]이에요.”에서 기준이 되는 양은 ', C('응답한 학생 수', '찬성한 학생 수')],
            ['“동요는 다른 곡보다 6곡 적어요.”는 두 양을 ', C('뺄셈', '나눗셈'), '으로 비교한 말이에요.'])]),
        ('기획표에서 찾은 비교를 확인해 보세요.', [QUIZ(
            QZ('한 양이 다른 양의 몇 배인지로 비교한 것을 모두 골라요.', ['동요는 신청곡 전체의 [2/5]예요.', '여학생이 남학생보다 7명 많아요.',
                                                         '스피커 수는 마이크 수의 [7/3]배예요.', '방송은 12시 40분에 시작해요.'], [0, 2]))]),
    ],
    's2': [
        ('체험 부스 한 곳에 리본 6개와 스티커 9장이 필요해요. 부스를 늘려 보고 두 양을 비교해 보세요.', [BUILD(
            '체험 부스', '곳', [('리본 수', 6, '개'), ('스티커 수', 9, '장')],
            [['스티커 수는 리본 수의 9 ÷ 6 = ', Fr('3/2'), '배'], ['체험 부스가 네 곳일 때 스티커는 9 × 4 = ', I(36), '장']], head='체험 부스 수')]),
        ('간식 한 세트에 빵 5개와 우유 2팩을 넣어요. 먼저 규칙을 예상한 다음, 세트를 늘려 보세요.', [
            RFIRST('세트 수가 늘어날 때 빵 수와 우유 수의 차이와 몇 배는 각각 어떻게 될지 예상해 써요.', '차이는 3, 6, 9로 커지지만 빵 수는 언제나 우유 수의 [5/2]배예요.'),
            BUILD('간식', '세트', [('빵 수', 5, '개'), ('우유 수', 2, '팩')],
                  [['간식 여섯 세트일 때 빵은 ', I(30), '개, 우유는 ', I(12), '팩'], ['빵 수는 우유 수의 30 ÷ 12 = ', Fr('5/2'), '배']], target=3, head='간식 세트 수')]),
        ('응원 현수막 한 장에 깃발 3개와 풍선 8개를 달아요. 표를 보고 차이와 몇 배로 비교해 보세요.', [
            TBL(['현수막 수(장)', '1', '2', '3', '4'], [['깃발 수(개)', '3', '6', '9', '12'], ['풍선 수(개)', '8', '16', '24', '32']]),
            CH(['현수막 네 장일 때 풍선 수와 깃발 수의 차이: 32 − 12 = ', I(20)], ['풍선 수는 깃발 수의 32 ÷ 12 = ', Fr('8/3'), '배']),
            WSA(('현수막이 늘어날 때 변하는 것과 변하지 않는 것을 써 보세요.', '풍선 수와 깃발 수의 차이는 5, 10, 15, 20으로 변하지만 풍선 수가 깃발 수의 [8/3]배인 것은 변하지 않아요.'))]),
        ('두 양을 비교하는 방법을 새 예로 정리해요.', [BL(
            '리본 6개와 스티커 9장을 뺄셈으로 비교하면 스티커가 ', (['3장', '1.5장'],), ' 더 많고, 나눗셈으로 비교하면 스티커 수는 리본 수의 ', (['1.5배', '3배'],), '예요.')]),
        ('방송 장비를 비교해 보세요.', [SEQ(
            (None, [CH(['마이크 3개와 스피커 7개를 한 세트로 써요. 다섯 세트의 마이크는 ', I(15), '개, 스피커는 ', I(35), '개'],
                       ['스피커 수는 마이크 수의 35 ÷ 15 = ', Fr('7/3'), '배'], ['스피커가 49개라면 세트는 ', I(7), '세트예요.'])]),
            (None, [QUIZ(QZ('마이크 수는 스피커 수의 몇 배일까요?', ['[3/7]배', '[7/3]배', '4배']))]))]),
    ],
    's3': [
        ('꿀 3스푼과 물 8스푼을 섞어 꿀물 한 통을 만들어요. 꿀물을 세 통까지 만들어 보고 두 양을 비교해 보세요.', [BUILD(
            '꿀물', '통', [('꿀의 양', 3, '스푼'), ('물의 양', 8, '스푼')],
            [['물의 양은 꿀의 양의 ', Fr('8/3'), '배예요.'], ['꿀의 양은 물의 양의 ', Fr('3/8'), '배예요.']], target=3, mx=3, head='꿀물 통 수')]),
        ('기준이 되는 양을 기호 : 의 오른쪽에 놓아요. 양 카드를 골라 비를 만들어 보세요.', [
            SLOTS([('꿀 3스푼', 3), ('물 8스푼', 8), ('꿀물 11스푼', 11)],
                  [('꿀의 양에 대한 물의 양의 비', [1, 0]), ('꿀물 전체의 양에 대한 꿀의 양의 비', [0, 2])]),
            TWHY('3 : 8과 8 : 3이 서로 다른 비인 까닭을 써 볼까요?', '3 : 8은 물의 양 8이 기준량이고, 8 : 3은 꿀의 양 3이 기준량이에요. 기준이 다르니 서로 다른 비예요.')]),
        ('비를 여러 가지 방법으로 읽고 기준량을 찾아보세요.', [SEQ(
            (None, [QUIZ(QZ('5 : 12를 바르게 읽은 것을 모두 골라요.', ['5 대 12', '12 대 5', '5의 12에 대한 비', '12에 대한 5의 비', '5에 대한 12의 비'], [0, 2, 3]))]),
            (None, [CH(['방송부 공연 입장권은 어른 4000원, 어린이 2500원이에요. 어른 입장료에 대한 어린이 입장료의 비 ', R(2500, 4000)],
                       ['이 비에서 기준량은 ', I(4000), ', 비교하는 양은 ', I(2500)])]))]),
        ('비를 새 예로 정리해요.', [BL(
            '7 : 11에서 기준량은 ', (['11', '7'],), '이고, 비교하는 양은 ', (['7', '11'],), '예요. 11에 대한 7의 비와 7 : 11은 ', (['같은 비', '다른 비'],), '예요.')]),
        ('막대사탕 15개 중 6개를 나누어 주었어요. 비로 나타내 보세요.', [_w('ra4Choc', {'total': 15, 'eat': 6, 'ask': [
            ['처음에 있던 개수에 대한 남은 개수의 비 ', R(9, 15)], ['나누어 준 개수에 대한 남은 개수의 비 ', R(9, 6)], ['남은 개수에 대한 나누어 준 개수의 비 ', R(6, 9)]]})]),
    ],
    's4': [
        ('방송실에 마이크 4개와 스피커 10개가 있어요. 마이크 막대 전체를 1로 볼 때 스피커 막대의 길이를 알아보세요.', [_w('ra4Comp', {
            'base': {'name': '마이크', 'n': 4}, 'comp': {'name': '스피커', 'n': 10},
            'ask': [['마이크 수에 대한 스피커 수의 비 ', R(10, 4)], ['스피커 수는 마이크 수의 10 ÷ 4 = ', Fr('10/4'), '배, 소수로 ', I('2.5'), '배예요.']]})]),
        ('사진 가(가로 10 cm, 세로 8 cm), 나(가로 6 cm, 세로 9 cm), 다(가로 15 cm, 세로 12 cm)의 가로에 대한 세로의 비율을 구해 보세요.', [
            CH({'t': '가', 'p': ['비 ', R(8, 10), ' 분수 ', Fr('8/10'), ' 소수 ', I('0.8')]}, {'t': '나', 'p': ['비 ', R(9, 6), ' 분수 ', Fr('9/6'), ' 소수 ', I('1.5')]},
               {'t': '다', 'p': ['비 ', R(12, 15), ' 분수 ', Fr('12/15'), ' 소수 ', I('0.8')]}, ['비율이 같은 사진: ', C('가와 다', '가와 나', '나와 다')]),
            TWHY('크기가 다른 사진 가와 다의 모양이 같아 보이는 까닭을 비율로 써 볼까요?', '가로에 대한 세로의 비율이 가는 8 ÷ 10 = 0.8, 다는 12 ÷ 15 = 0.8로 같아서 모양이 같아 보여요.')]),
        ('방송 화면 모양을 바꾸어 모눈에 그려 보세요.', [
            RECT(12, 9, [('가로에 대한 세로의 비율이 0.8인 화면을 그려 보세요. (가로는 5칸 또는 10칸)', [[5, 4], [10, 8], [5, 4], [10, 8]]),
                         ('가로에 대한 세로의 비율이 1.5이고 세로가 9칸인 화면을 그려 보세요.', [[6, 9]])], unit='칸'),
            WSA(('비율이 1보다 큰 화면과 작은 화면은 모양이 어떻게 다른지 써 보세요.', '비율이 1보다 크면 세로가 가로보다 긴 화면이고, 1보다 작으면 가로가 세로보다 긴 화면이에요.'))]),
        ('비율을 새 예로 정리해요.', [BL(
            '비 9 : 12를 비율로 나타내면 분수로 ', (['[9/12]', '[12/9]'],), ', 소수로 ', (['0.75', '1.33'],), '이에요. (비율) = (비교하는 양) ', (['÷', '×'],), ' (기준량)이에요.')]),
        ('매실 음료의 진하기를 비교해 보세요. 지호는 매실청 60 mL를 넣어 음료 300 mL를, 수아는 매실청 50 mL를 넣어 음료 200 mL를 만들었어요.', [CH(
            {'t': '지호', 'p': ['분수 ', Fr('60/300'), ' 소수 ', I('0.2')]}, {'t': '수아', 'p': ['분수 ', Fr('50/200'), ' 소수 ', I('0.25')]},
            ['매실 맛이 더 진한 음료: ', C('수아', '지호')])]),
    ],
    's5': [
        ('실제 거리 500 m를 1 cm로 나타낸 동네 지도와 실제 거리 1000 m를 1 cm로 나타낸 구 지도가 있어요. 방송국까지의 실제 거리 3000 m를 두 지도에 그려 보세요.', [_w('ra4Map', {
            'real': 3000, 'maps': [{'name': '동네 지도', 'per': 500}, {'name': '구 지도', 'per': 1000}],
            'ask': [['500 m = ', I(50000), ' cm, 1000 m = ', I(100000), ' cm'], ['동네 지도의 비 1 : ', I(50000), ', 구 지도의 비 1 : ', I(100000)],
                    ['같은 장소를 더 자세하게 나타내는 지도: ', C('동네 지도', '구 지도')]]})]),
        ('자유투 성공률과 달리기 빠르기를 비율로 비교해 보세요.', [SEQ(
            ('지호는 자유투 16번 중 12번, 민서는 20번 중 14번을 넣었어요.', [CH(['지호: ', Fr('12/16'), ' = ', I('0.75')], ['민서: ', Fr('14/20'), ' = ', I('0.7')],
                                                                  ['성공률이 더 높은 사람: ', C('지호', '민서')])]),
            ('태오는 120 m를 24초에, 은재는 90 m를 15초에 달렸어요.', [CH(['태오: 120 ÷ 24 = ', I(5)], ['은재: 90 ÷ 15 = ', I(6)], ['더 빠른 사람: ', C('은재', '태오')])]))]),
        ('별빛구와 햇살구의 인구와 넓이예요. 넓이에 대한 인구의 비율을 구해 비교해 보세요.', [
            TBL(['지역', '사는 사람 수(명)', '땅의 넓이(km²)'], [['별빛구', '480000', '32'], ['햇살구', '390000', '30']]), _w('calc'),
            CH(['별빛구: 480000 ÷ 32 = ', {'i': '15000', 'w': True}], ['햇살구: 390000 ÷ 30 = ', {'i': '13000', 'w': True}],
               ['인구가 더 빽빽한 구: ', C('별빛구', '햇살구')]),
            TWHY('넓이에 대한 인구의 비율로 비교하면 좋은 까닭을 써 볼까요?', '두 구의 넓이가 달라서 인구 수만으로는 얼마나 빽빽한지 알 수 없어요. 1 km²에 사는 사람 수로 바꾸면 공평하게 비교할 수 있어요.')]),
        ('생활 속 비율을 새 예로 정리해요.', [BL(
            '소금 30 g을 물에 녹여 소금물 250 g을 만들면 소금물의 양에 대한 소금의 양의 비율은 ', (['0.12', '0.3', '8.3'],), '이고, 기준량은 ', (['소금물의 양', '소금의 양'],), '이에요.')]),
        ('과학실에서 만든 두 소금물의 진하기를 비교해 보세요.', [CH(
            ['가 비커: 소금물 400 g에 소금 36 g → 비율 ', Fr('36/400'), ' = ', I('0.09')], ['나 비커: 소금물 250 g에 소금 25 g → 비율 ', Fr('25/250'), ' = ', I('0.1')],
            ['더 진한 소금물: ', C('나 비커', '가 비커')])]),
    ],
    's6': [
        ('수아는 퀴즈 40문제 중 26문제, 은재는 50문제 중 31문제를 맞혔어요. 모눈에 맞힌 문제 수만큼 색칠해 보세요.', [GRID(
            [('수아', '수아(40문제)', 10, 4, 26), ('은재', '은재(50문제)', 10, 5, 31)],
            [['푼 문제 수에 대한 맞힌 문제 수의 비율: 수아 ', Fr('26/40'), ', 은재 ', Fr('31/50')]], cell=26)]),
        ('두 사람이 100문제씩 풀었다면 각각 몇 문제를 맞혔을지 먼저 예상한 다음, 100칸 모눈에 색칠해 보세요.', [
            RFIRST('40문제 중 26문제를 맞힌 수아가 100문제를 푼다면 몇 문제를 맞힐지 예상해 써요.', '100은 40의 2.5배이므로 26 × 2.5 = 65문제를 맞혀요.'),
            GRID([('수아', '수아가 100문제를 풀었다면', 10, 10, 65), ('은재', '은재가 100문제를 풀었다면', 10, 10, 62)],
                 [['수아: 26 × 2.5 = ', I(65), '(문제)'], ['은재: 31 × 2 = ', I(62), '(문제)'], ['비율이 더 높은 사람: ', C('수아', '은재')]], cell=24)]),
        ('방송부 설문에 응답한 25명 중 18명이 ‘음악 방송’을 골랐어요. 두 가지 방법으로 백분율을 구해 보세요.', [SEQ(
            (None, [TAPE(25, '명', 25, 18, '응답한 학생 수', '‘음악 방송’을 고른 학생 수', 'pct', [
                {'t': '방법 1 기준량을 100으로 바꾸기', 'p': ['[18/25] = [72/100]이므로 ', I(72), ' %']},
                {'t': '방법 2 비율에 100 곱하기', 'p': ['[18/25] = ', I('0.72'), ', 0.72 × 100 = ', I(72), ' → 72 %']}])]))]),
        ('백분율을 새 예로 정리해요.', [BL(
            '비율 [7/8]을 백분율로 나타내면 ', (['87.5 %', '78 %', '8.75 %'],), '이고, 4 %를 소수로 나타내면 ', (['0.04', '0.4'],), '예요.')]),
        ('비율을 백분율로, 백분율을 비율로 나타내 보세요.', [CH(
            ['[11/25] → ', I(44), ' %'], ['[3/40] → ', I('7.5'), ' %'], ['1.25 → ', I(125), ' %'], ['65 % → 소수 ', I('0.65')])]),
    ],
    's7': [
        ('어린이 회장 선거에서 6학년 학생 180명 중 153명, 5학년 학생 160명 중 128명이 투표했어요. 투표율을 백분율로 비교해 보세요.', [SEQ(
            (None, [CH(['6학년 투표율: [153/180] × 100 = ', I(85), ' %'], ['5학년 투표율: [128/160] × 100 = ', I(80), ' %'], ['투표율이 더 높은 학년: ', C('6학년', '5학년')])]))]),
        ('좋아하는 방송 코너를 조사했어요. 각 코너를 고른 학생 수를 백분율로 나타내 보세요.', [
            TBL(['코너 이름', '고른 학생 수(명)'], [['음악 신청', '110'], ['퀴즈', '90'], ['학교 소식', '50'], ['모두', '250']]),
            CH(['음악 신청: [110/250] × 100 = ', I(44), ' %   퀴즈: [90/250] × 100 = ', I(36), ' %   학교 소식: [50/250] × 100 = ', I(20), ' %']),
            TWHY('세 코너의 백분율을 모두 더하면 100 %가 되는 까닭을 써 볼까요?', '세 코너를 고른 학생 수를 모두 더하면 전체 응답 학생 수 250명이 되므로, 백분율도 모두 더하면 기준량 전체인 100 %가 돼요.')]),
        ('문구점에서 판매 금액이 4000원인 색연필을 3200원에, 판매 금액이 15000원인 물감을 12750원에 팔아요. 할인율을 구해 보세요.', [
            CH(['할인 금액: 색연필 4000 − 3200 = ', I(800), '(원), 물감 15000 − 12750 = ', I(2250), '(원)'],
               ['색연필 할인율: [800/4000] × 100 = ', I(20), ' %   물감 할인율: [2250/15000] × 100 = ', I(15), ' %']),
            WSA(('할인 금액이 더 많은 물건과 할인율이 더 높은 물건이 다른 까닭을 써 보세요.', '물감은 판매 금액이 커서 할인 금액이 더 많지만, 판매 금액에 대한 할인 금액의 비율은 색연필이 20 %로 더 높아요.'))]),
        ('백분율이 쓰이는 경우를 새 예로 정리해요.', [BL(
            '50000원을 예금하고 1년 뒤 이자를 2 % 받으면 이자는 ', (['1000원', '100원', '2500원'],), '이에요. 이때 기준량은 ', (['예금한 돈', '이자'],), '이에요.')]),
        ('두 가게에서 건전지를 샀어요. 가 가게는 500개 중 15개, 나 가게는 300개 중 12개가 불량품이었어요. 불량률을 비교해 보세요.', [CH(
            ['가 가게: [15/500] × 100 = ', I(3), ' %'], ['나 가게: [12/300] × 100 = ', I(4), ' %'], ['불량률이 더 낮은 가게: ', C('가 가게', '나 가게')])]),
    ],
    's8': [
        ('하준이네 집의 지난달 전기 사용량은 320 kWh였어요. 청구서를 보고 물음에 답해 보세요.', [QUIZ(
            QZ('지난달 전기 사용량의 10 %를 줄이려면 몇 kWh를 줄여야 할까요?', ['32 kWh', '10 kWh', '3.2 kWh']),
            QZ('전기를 절약한 정도를 백분율로 나타낼 때 기준량은 무엇일까요?', ['지난달 전기 사용량', '줄이려는 전기 사용량']))]),
        ('하준이네 가족의 계획: 게임기 7 kWh, 세탁기 3 kWh, 전기난로 6 kWh를 줄여요. 계획에 있는 가전제품을 모두 골라 보세요.', [_w('ra4Save', {
            'items': [{'name': '게임기', 'kwh': 7}, {'name': '냉장고', 'kwh': 5}, {'name': '세탁기', 'kwh': 3}, {'name': '전자레인지', 'kwh': 2}, {'name': '전기난로', 'kwh': 6}],
            'plan': [0, 2, 4], 'planSum': 16, 'ask': [['줄이려는 전기 사용량: 7 + 3 + 6 = ', I(16), ' (kWh)']]})]),
        ('이중 테이프로 줄이려는 전기 사용량이 지난달 전기 사용량의 몇 %인지 구해 보세요.', [
            TAPE(320, 'kWh', 40, 16, '지난달 전기 사용량', '줄이려는 전기 사용량', 'pct', [['[16/320] × 100 = ', I(5), ' → ', I(5), ' %']]),
            TWHY('줄이려는 양이 같아도 지난달 사용량이 다르면 백분율이 달라지는 까닭을 써 볼까요?', '백분율은 지난달 사용량을 기준량으로 한 비율이라서, 기준량이 크면 같은 양을 줄여도 백분율이 작아져요.')]),
        ('백분율로 나타내는 차례를 정리해 보세요.', [_w('sequence', [
            '㉠ 비율에 100을 곱하고 %를 붙여요.', '㉡ 기준량과 비교하는 양을 찾아요.', '㉢ (비교하는 양) ÷ (기준량)으로 비율을 구해요.'], [1, 2, 0], {})]),
        ('은재네 집은 지난달 전기 사용량이 300 kWh였고, 이번 달에 지난달보다 8 % 줄이려고 해요.', [SEQ(
            (None, [CH(['줄이려는 전기 사용량: 300 × [8/100] = ', I(24), ' (kWh)'], ['이번 달 전기 사용량: 300 − 24 = ', I(276), ' (kWh)'],
                       ['하준이네(5 %)와 은재네(8 %) 중 더 많은 비율로 줄이려는 집: ', C('은재네', '하준이네')])]))]),
    ],
    's9': [
        ('퀴즈쇼 놀이 규칙을 확인해 보세요.', [QUIZ(
            QZ('뒤집은 카드 2장의 비율이 같다고 맞게 판단하면 어떻게 하나요?', ['카드를 가져오고 한 번 더 해요.', '카드를 다시 뒤집어 놓아요.', '놀이가 끝나요.']),
            QZ('카드를 더 많이 가져간 사람이 이기는 때는 언제인가요?', ['남은 카드가 없을 때', '처음 카드를 뒤집었을 때']))]),
        ('리허설: 새 카드 두 장의 비율이 같은지 판단해 보세요.', [QUIZ(
            QZ('12 : 16 과 75 %', ['같아요', '달라요']), QZ('5 : 8 과 0.58', ['같아요', '달라요'], 1), QZ('[9/50]과 18 %', ['같아요', '달라요']),
            QZ('2.4와 24 %', ['같아요', '달라요'], 1), QZ('14 : 35와 [2/5]', ['같아요', '달라요']))]),
        ('녹화를 하기 전에 카드 짝을 미리 찾아보세요.', [QUIZ(
            QZ('3 : 12와 비율이 같은 카드를 골라요.', ['[1/4]', '0.3', '4 %']), QZ('[13/20]과 비율이 같은 카드를 골라요.', ['0.65', '13 %', '0.13']),
            QZ('8 : 5와 비율이 같은 카드를 골라요.', ['1.6', '1.5', '58 %']), QZ('비율이 서로 다른 카드 짝을 골라요.', ['0.09 — 9 %', '16 : 20 — 80 %', '[3/8] — 0.38'], 2))]),
        ('비율이 같은 카드를 찾는 방법을 따져 보세요.', [QUIZ(
            QZ('4 : 25와 비율이 같은 카드를 모두 골라요.', ['16 %', '[4/25]', '0.4', '25 : 4', '0.16'], [0, 1, 4]),
            QZ('비율이 가장 낮은 카드는 무엇일까요?', ['[7/20]', '0.4', '3 : 8', '33 %'], 3))]),
        ('시청자 퀴즈를 만들고 확인해 보세요.', [SEQ(
            (None, [QUIZ(QZ('비율이 같은 카드끼리 짝 지은 것이 아닌 것을 골라요.', ['13 : 25 — 52 %', '7 : 4 — 1.75', '[1/40] — 2.5 %', '6 : 15 — 0.6'], 3))]),
            (None, [CH(['0.45를 백분율로 나타내면 ', I(45), ' %, 기약분수로 나타내면 ', Fr('9/20')])]))]),
    ],
    's10': [
        ('무대 배경을 칠할 물감을 섞어요. 노란색 물감 90 g과 파란색 물감 60 g을 섞어 초록색 물감 한 병을 만들어요. 표를 완성하여 두 양을 비교해 보세요.', [BUILD(
            '초록색 물감', '병', [('노란색 물감의 양', 90, 'g'), ('파란색 물감의 양', 60, 'g')],
            [['네 병: 노란색 물감 ', I(360), ' g, 파란색 물감 ', I(240), ' g'], ['노란색 물감의 양은 파란색 물감의 양의 90 ÷ 60 = ', Fr('3/2'), '배']], head='초록색 물감 병 수')]),
        ('비와 비율이 같은 것끼리 이어 보세요.', [SEQ(
            (None, [CH(['카메라 4대, 조명 10개가 있어요. 카메라 수에 대한 조명 수의 비 ', R(10, 4)])]),
            ('비율이 같은 것끼리 이어 보세요.', [_w('ra4Link', {'heads': ['비', '분수', '소수', '백분율'],
                                                     'cols': [['7 : 20', '11 : 20', '12 : 15'], ['[4/5]', '[7/20]', '[11/20]'], ['0.55', '0.8', '0.35'], ['80 %', '55 %', '35 %']]})]))]),
        ('여론 조사 결과를 살펴보세요. 응답한 학생 32명 중 24명이 ‘아침 방송 시간을 늘리자’에 찬성했어요.', [SEQ(
            (None, [CH(['전체 학생 수에 대한 찬성한 학생 수의 비 ', R(24, 32)], ['비율: 분수 ', Fr('24/32'), ', 소수 ', I('0.75')], ['백분율: ', I(75), ' %'])]),
            (None, [QUIZ(QZ('잘못 설명한 것을 골라요.', ['㉠ 반대한 학생은 8명이에요.', '㉡ 반대한 학생 수는 전체의 25 %예요.', '㉢ 찬성한 학생 수는 반대한 학생 수의 [1/3]배예요.'], 2))]))]),
        ('비, 비율, 백분율을 새 예로 정리해요.', [BL(
            '7 : 20에서 기준량은 ', (['20', '7'],), '이고, 비율은 [7/20] = ', (['0.35', '2.86'],), '이며, 백분율로 나타내면 ', (['35 %', '3.5 %'],), '예요.')]),
        ('1차시에 궁금했던 것을 떠올리며 특집 방송 원고를 써 보세요.', [
            _w('wonderRecall'),
            WSA(('여론 조사 결과(32명 중 24명 찬성)를 비, 비율, 백분율로 소개하는 방송 원고를 써 보세요.',
                 '응답한 학생 32명 중 24명이 찬성했어요. 비로는 24 : 32, 비율로는 0.75, 백분율로는 75 %예요.'),
                ('이 단원에서 새로 알게 된 것을 하나 써 보세요.', '기준량이 달라도 백분율로 나타내면 공평하게 비교할 수 있다는 것을 알았어요.'))]),
    ],
}


def build_file(kind, lv):
    src = SRC_TB if kind == 'tb' else SRC_ST
    D = cap(src)
    DATA.clear()
    DATA.update(D)
    MODE[0] = kind
    if kind == 'tb':
        check_words(D)
    else:
        assert [L['id'] for L in D['lessons']] == ST_IDS, ('이야기 버전 차시가 바뀌었어요', [L['id'] for L in D['lessons']])
        check_words_st(D)
    if lv == '도전형':
        D = harden(D, kind)
        DATA.clear()
        DATA.update(D)
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
