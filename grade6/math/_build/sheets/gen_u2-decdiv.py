# -*- coding: utf-8 -*-
"""6-2 수학 2. 소수의 나눗셈 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u2-decdiv.py

앱 원본 ../units/sem2/u2-decdiv.tb.js('과학 기술 체험관', 11차시: 1~7, 8~9, 10, 11)의 LESSONS를 node에서 그대로 실행해
(활동 함수 대신 기록하는 함수를 넣어 render를 부름) 차시 번호·제목·S.O.O.P.·탐구 질문·안내 글·물음·보기·정답·수를 모두 앱에서 읽어 옵니다.
그래서 원본의 수가 바뀌면 활동지도 따라 바뀌고, 모든 답은 이 스크립트가 분수(Fraction)로 다시 계산해 확인합니다(assert).
  - 세로셈 판은 앱 dv2LongBoard와 같은 규칙(옮긴 소수점·흐린 0·지운 앞자리 0·계산 메모 줄 수)으로 그립니다.
    기본형은 소수점을 옮긴 모습(흐린 동그라미 = 처음 소수점, 빨간 점 = 옮긴 소수점)을 보여 주고, 도전형은 처음 수만 보여 줘요.
  - 화면 글에는 '나누어 주고 남는 양'만 씁니다(지도서 유의 사항) — 활동지에 '나머지'라는 낱말이 없는지 확인합니다.
이야기 버전(u2-decdiv.st.js, '우리 반 나눔 축제 부스', 11차시)도 같은 방법으로 LESSONS를 node에서 실행해 읽습니다(ST_JS).
  이야기 엔진의 thenWhy('왜 그럴까요?')·ruleFirst('먼저 예상해요')·wonderRecall·panes·쪽지(dv2sNote)·1 kg의 값(dv2sUnit)도 기록해
  기본형은 앱 도움 문장 틀, 도전형은 쓰는 줄로 바꾸고, 모범 답은 앱의 ans를 그대로 씁니다.
그림(막대·수직선·종이·소수점 옮기기·세로셈·관계 그림·로봇·놀이판·수 카드)은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다.
"""
import json
import math
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
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))      # grade6/math
SRC_TB = os.path.join(ROOT, '_build', 'units', 'sem2', 'u2-decdiv.tb.js')
OUT_TB = os.path.join(ROOT, 'sem2', 'sheets')
NAME = '2단원_소수의나눗셈_활동지_%s.hwpx'
LABEL_TB = '6-2 수학 2. 소수의 나눗셈(교과서 차시)'
SRC_ST = os.path.join(ROOT, '_build', 'units', 'sem2', 'u2-decdiv.st.js')
OUT_ST = os.path.join(ROOT, 'sem2-soop', 'sheets')
LABEL_ST = '6-2 수학 2. 소수의 나눗셈(이야기 버전)'
ST = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11']   # 이야기 버전 차시 id(앱 LESSONS 차례)
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨'
KO = '㉠㉡㉢㉣㉤㉥'
WORK = tempfile.mkdtemp(prefix='u2ddiv_')
INK = '#1D2A2A'
RED, BLUE, DARK, GREY, ORANGE, GREEN = '#C8472E', '#2B7BD6', '#7A8C86', '#9AABA4', '#E8913A', '#2E8B57'
FILLS = ['#F6C08A', '#9CC6EC']
PX_MM = 0.155
PLACE = ['일의 자리', '소수 첫째 자리', '소수 둘째 자리', '소수 셋째 자리', '소수 넷째 자리']


# ================================================================ 앱 원본 읽기(node)
EX_JS = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const core = src.slice(src.indexOf('/*dv2-core*/'), src.indexOf('/*dv2-core-end*/'));
const isl = src.slice(src.indexOf('const DV2ISLAND'), src.indexOf('function dv2Island('));
const les = src.slice(src.indexOf('//@@LESSONS'));
let REC = [];
const rec = w => function (b, a, ...args) { REC.push({ w, args }); };
const stubs = `
var dv2Sent=rec('sent'), dv2Bars=rec('bars'), dv2Shift=rec('shift'), dv2Long=rec('long'), dv2Line=rec('line'), dv2Fold=rec('fold'),
 dv2Round=rec('round'), dv2Cards=rec('cards'), dv2Fuel=rec('fuel'), dv2Island=rec('island'), dv2Bingo=rec('bingo'),
 quiz=rec('quiz'), blanks=rec('blanks'), sequence=rec('sequence'), writeStep=rec('writeStep');
var dv2Talk = lines => ({ talk: lines }), dv2RelFig = (rows, lab) => ({ rel: rows, lab }), dv2RobotFig = () => ({ robot: 1 }), dv2Journal = () => ({ journal: 1 });
`;
const R = eval(core + '\n' + isl + '\n' + stubs + '\n' + les + '\n;({LESSONS, UNIT_STORY, DV2ISLAND})');
const ser = v => JSON.parse(JSON.stringify(v, (k, x) => typeof x === 'bigint' ? String(x) : (typeof x === 'function' ? (x.length === 0 ? x() : undefined) : x)));
const out = R.LESSONS.map(L => {
  const steps = L.steps.map(S => { REC = []; S.render({}, {}); return { name: S.name || null, inst: S.inst, hints: S.hints || [], calls: ser(REC) }; });
  REC = []; L.challenge.render({}, {});
  return { id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, steps,
    ch: { inst: L.challenge.inst, hints: L.challenge.hints || [], calls: ser(REC) } };
});
process.stdout.write(JSON.stringify({ lessons: out, story: R.UNIT_STORY, island: ser(R.DV2ISLAND) }));
"""
STEP_NAMES = ['만져 보기', '그려 보기', '말해 보기', '약속하기', '확인하기']   # 앱 틀(tpl_tb.html)의 STEP_NAMES


def load_app(src):
    js = os.path.join(WORK, 'ex.js')
    with open(js, 'w') as f:
        f.write(EX_JS)
    r = subprocess.run(['node', js, src], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError('앱 원본을 읽지 못했어요\n' + r.stderr)
    return json.loads(r.stdout)


# ================================================================ 정확한 계산
def Q(s):
    if isinstance(s, Fraction):
        return s
    if isinstance(s, int):
        return Fraction(s)
    s = str(s).strip().replace(',', '')
    assert re.fullmatch(r'\d*\.?\d+|\d+\.', s), s
    return Fraction(Decimal(s))


def dec(x):
    """Fraction → 나누어떨어지는 소수 글(끝자리 0 생략), 아니면 None"""
    x = Fraction(x)
    d = x.denominator
    while d % 2 == 0:
        d //= 2
    while d % 5 == 0:
        d //= 5
    if d != 1:
        return None
    t = format(Decimal(x.numerator) / Decimal(x.denominator), 'f')
    if '.' in t:
        t = t.rstrip('0').rstrip('.')
    return t


def trunc(x, k):
    m = 10 ** k
    return Fraction(math.floor(x * m), m)


def rnd(x, k):
    """반올림(앱 dv2RndR과 같음: 5이거나 5보다 크면 올림)"""
    m = 10 ** k
    return Fraction(math.floor(x * m * 2 + 1) // 2, m)


def fix(x, k):
    """소수 k자리 글(끝 0도 그대로)"""
    m = 10 ** k
    v = math.floor(Fraction(x) * m)
    s = str(v).rjust(k + 1, '0')
    return s[:len(s) - k] + ('.' + s[len(s) - k:] if k else '')


def show(x, k=3):
    d = dec(x)
    return d if d is not None else fix(trunc(x, k), k) + '…'


def ndig(s):
    m = re.search(r'\.(\d+)', str(s))
    return len(m.group(1)) if m else 0


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


def try_ev(e):
    try:
        return ev(e)
    except (AssertionError, ZeroDivisionError, IndexError, ValueError):
        return None


def sp(e):
    return str(e).replace('÷', ' ÷ ').replace('×', ' × ').replace('+', ' + ').replace('−', ' − ')


# ================================================================ 글(앱 글 속 [1/10] → '10분의 1')
JO = [('이에요', '예요'), ('으로', '로'), ('은', '는'), ('이', '가'), ('을', '를'), ('과', '와')]
FR_RE = re.compile(r'\[(?:(\d+) )?([^\[\]/ ]+)/([^\[\]]+)\]')
PART = r'(?:(이에요|예요|으로|은|는|을|를|과|와|이|가|로)(?![가-힣]))?'


def has_jong(num):
    c = num[-1]
    return c in '013678', c in '178'


def K(t):
    def rep(m):
        w, n, d, pt = m.group(1), m.group(2), m.group(3), m.group(4) or ''
        r = ('%s %s분의 %s' % (w, d, n)) if w else '%s분의 %s' % (d, n)
        h, rr = has_jong(n)
        for a, b in JO:
            if pt in (a, b):
                pt = ('으로' if h and not rr else '로') if a == '으로' else (a if h else b)
        return r + pt
    return re.sub(FR_RE.pattern + PART, rep, str(t))


def flat(t):
    t = re.sub(r'\{([^}]*)\}', r'\1', str(t))
    return re.sub(r'\[([^\]]+)/([^\]]+)\]', r'\1/\2', t)


# 종이 활동지에 맞게 바꾸는 안내 글(앱의 '누르기·끌기·단추' 말)
PAPER = [
    ('빨간 동그라미를 눌러 두 수의 소수점을', '두 수의 소수점을'),
    ('배우는 차례대로 눌러 학습 계획을 세워 보세요', '배우는 차례대로 기호를 써서 학습 계획을 세워 보세요'),
    ('종이를 눌러 접는 선을 놓아 보세요.', '종이 그림에 접는 선을 그어 보세요.'),
    ('확인할 숫자를 누르고', '확인할 숫자에 ○표 하고'),
    ('확인할 숫자(소수 셋째 자리)를 누르고', '확인할 숫자(소수 셋째 자리)에 ○표 하고'),
    ('남는 양을 주황 칸에 쓴 뒤 소수점을 찍어요', '남는 양을 맨 아래 칸에 쓴 뒤 소수점을 찍어요'),
    ('연료 막대를 끌어 대강 맞추고 ±0.1 L 단추로 할머니 댁에 딱 도착하게 맞추어요.', '연료가 몇 L 있어야 할머니 댁에 딱 도착하는지 구해요.'),
    ('‘주사위 던지기’를 누르면 말이 저절로 움직여요. 도착한 칸의 몫을 쓰면 계산기로 확인해 줘요.',
     '주사위를 던져 말을 옮기고, 도착한 칸의 몫을 아래 기록표에 써요. 짝이 계산기로 확인해요.'),
    ('(3~4명이 하는 놀이를 로봇 친구와 해 봐요)', '(3~4명이 함께 해요)'),
    ('책장을 넘겨 배울 내용을 살펴보고, ', '배울 내용을 살펴보고, '),
    ('이 앱이 만든 도전 문제예요.', '도전 문제예요.'),
]
UI = re.compile(r'누르|눌러|끌어|끌고|단추|주황 칸|로봇 친구|저절로|앱')


def paper(t):
    for a, b in PAPER:
        t = t.replace(a, b)
    assert not UI.search(t), ('종이 활동지에 맞지 않는 말', t)
    return K(t)


def tip(hints):
    for h in hints or []:
        if not UI.search(h) and '흐린 동그라미' not in h:
            return '도움: ' + K(h)
    return None


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
CHARSET = (''.join(chr(c) for c in range(32, 127)) + '−×÷○□▢①②③④⑤⑥⑦⑧㉠㉡㉢㉣㉤·…‘’“”→≥≤가★²⑴⑵')


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


def L(x1, y1, x2, y2, c=INK, w=2, dash=None):
    return ('<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f" stroke="%s" stroke-width="%s"%s/>'
            % (x1, y1, x2, y2, c, w, (' stroke-dasharray="%s"' % dash) if dash else ''))


def R(x, y, w, h, fill='#fff', stroke=INK, sw=2, rx=0, dash=None):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="%s" fill="%s" stroke="%s" stroke-width="%s"%s/>'
            % (x, y, w, h, rx, fill, stroke, sw, (' stroke-dasharray="%s"' % dash) if dash else ''))


def C(x, y, r, fill, stroke='none', sw=0):
    return '<circle cx="%.1f" cy="%.1f" r="%s" fill="%s" stroke="%s" stroke-width="%s"/>' % (x, y, r, fill, stroke, sw)


# ---------------------------------------------------------------- 식(분수를 위아래로) 그리기 — 소수의 곱셈 활동지와 같은 방법
TOK = re.compile(r'\[[^\]]+\]|\{[^}]*\}|[^\[\{]+')


def bw(a, fs):
    n = max(2, len(a or ''))
    return fs * (0.6 * n + 0.55)


def _part(t):
    out = []
    for m in re.finditer(r'\{([^}]*)\}|[^{]+', t):
        g = m.group(0)
        out.append(('b', m.group(1)) if g.startswith('{') else ('t', g.replace('-', '−')))
    return out


def parse_eq(s):
    segs = []
    for m in TOK.finditer(s):
        g = m.group(0)
        if g.startswith('{'):
            segs.append(('b', g[1:-1]))
        elif g.startswith('['):
            left, den = g[1:-1].rsplit('/', 1)
            segs.append(('f', _part(left), _part(den)))
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
            out.append(R(x + fs * .05, cy - fs * .52, w, fs * 1.04, stroke='#555', rx=4))
            x += w + fs * .1
    return x


def seg_w(sg, fs):
    if sg[0] == 't':
        return tw(sg[1], fs)
    if sg[0] == 'b':
        return bw(sg[1], fs) + fs * .2
    sf = fs * .82
    return max(_pw(sg[1], sf), _pw(sg[2], sf)) + fs * .38


def seg_draw(sg, x, cy, fs, out):
    if sg[0] == 't':
        out.append(T(x, cy, sg[1], fs))
    elif sg[0] == 'b':
        out.append(R(x + fs * .1, cy - fs * .58, bw(sg[1], fs), fs * 1.16, stroke='#444', sw=2.4, rx=5))
    else:
        sf = fs * .82
        nw, dw = _pw(sg[1], sf), _pw(sg[2], sf)
        fw = max(nw, dw) + fs * .3
        out.append(L(x + fs * .1, cy, x + fw, cy, INK, 2.4))
        _pdraw(sg[1], x + fs * .04 + (fw - nw) / 2, cy - fs * .66, sf, out)
        _pdraw(sg[2], x + fs * .04 + (fw - dw) / 2, cy + fs * .68, sf, out)


def eq_line(s, x, cy, fs, out):
    for sg in parse_eq(s):
        wdt = seg_w(sg, fs)
        seg_draw(sg, x, cy, fs, out)
        x += wdt
    return x


def eq_w(s, fs):
    return sum(seg_w(sg, fs) for sg in parse_eq(s))


EQW = 1120


def wrap(e, fs=34, maxw=EQW):
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
    out, y, wmax = [], 10, 0
    for e in rows:
        for k, ln in enumerate(wrap(e, fs)):
            h = fs * (2.75 if '[' in ln else 1.6)
            cy = y + h / 2
            x = eq_line(ln, 12 + (fs * 1.2 if k else 0), cy, fs, out)
            wmax = max(wmax, x + 12)
            y += h
    W, H = int(wmax + 4), int(y + 10)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm)


# ================================================================ 앱 줄 문제(dv2Sent의 rows) → 활동지
GLUE = re.compile(r'^[\.\,\)\:]|^(이에요|예요|이므로|므로|이고|이라|으로|이|가|을|를|은|는|과|와|로|의|에|만큼|배|번|칸|개|명|통|봉지|모둠|도막|병|묶음|분)')


def _join(pieces):
    out = ''
    for p in pieces:
        if not p:
            continue
        if not out:
            out = p
        elif GLUE.match(p) or out.endswith('('):
            out += p
        else:
            out += ' ' + p
    return out


def verify_n(pt):
    want = Q(pt['n'])
    if pt.get('e'):
        assert ev(pt['e']) == want, ('답 확인 필요', pt)
    if pt.get('r'):
        e, k = pt['r']
        assert rnd(ev(e), k) == want, ('반올림 답 확인 필요', pt)
    return pt['n']


def is_fig_row(parts):
    return any(isinstance(p, dict) and 'f' in p for p in parts) or any(isinstance(p, str) and '[' in p and '/' in p for p in parts)


def p_ans(p):
    if 'n' in p:
        return verify_n(p)
    if 'f' in p:
        return '%s/%s' % tuple(p['f'])
    if 'o' in p:
        return flat(K(p['o'][p['a']]))
    if 'm' in p:
        return ', '.join(flat(K(p['m'][i])) for i in p['a'])
    return None


def p_txt(p):
    if isinstance(p, str):
        return K(p)
    if 'n' in p:
        return '(' + ' ' * max(8, 3 * len(p['n'])) + ')'
    if 'o' in p:
        return '( ' + ' / '.join(K(o) for o in p['o']) + ' )'
    if 'm' in p:
        return '( ' + ' / '.join(K(o) for o in p['m']) + ' ) ← 모두 골라요'
    return ''


def p_fig(p):
    if isinstance(p, str):
        return p
    if 'n' in p:
        return '{%s}' % p['n']
    if 'f' in p:
        return '[{%s}/{%s}]' % tuple(p['f'])
    if 'o' in p:
        return '( ' + ' / '.join(p['o']) + ' )'
    return ''


def check_eq(e):
    """식 그림 줄 '… = … = …'의 값이 모두 같은지(읽을 수 있는 부분만)"""
    full = flat(e).replace('⑴', '').replace('⑵', '')
    full = re.sub(r'(\d+)/(\d+)', r'[\1/\2]', full)
    if not re.search(r'[가-힣(]', full) and '=' in full:
        vals = [try_ev(t) for t in full.split('=') if t.strip()]
        vals = [v for v in vals if v is not None]
        assert all(v == vals[0] for v in vals), ('식 확인 필요', full)


def sent(s, rows):
    """rows: [parts | {q, p} | {fig, q?, p?} | {g, rows}] → 활동지. 정답 글 목록."""
    ans, txt, eqs = [], [], []

    def flush():
        if txt:
            s.fill(txt[:] if len(txt) > 1 else txt[0])
            del txt[:]
        if eqs:
            eq_fig(s, eqs[:])
            del eqs[:]

    def parts(r):
        ans.extend(a for a in (p_ans(p) for p in r if isinstance(p, dict)) if a is not None)
        if is_fig_row(r):
            if txt:
                flush()
            e = _join([p_fig(p) for p in r])
            check_eq(e)
            eqs.append(e)
        else:
            if eqs:
                flush()
            txt.append(_join([p_txt(p) for p in r]))
    for r in rows:
        if isinstance(r, list):
            parts(r)
            continue
        flush()
        if 'g' in r:
            s.text('▸ ' + K(r['g']))
            ans.extend(sent(s, r['rows']))
            continue
        if 'fig' in r:
            fig(s, r['fig'])
        if r.get('q'):
            s.text(K(r['q']))
        if r.get('p'):
            parts(r['p'])
            flush()
    flush()
    return ans


def fig(s, f):
    if not f:
        return
    if 'talk' in f:
        s.labeled([(w.rstrip(':'), K(t)) for w, t in f['talk']])
    elif 'rel' in f:
        rel_fig(s, f['rel'], f['lab'])
    elif 'robot' in f:
        robot_fig(s)
    elif 'note' in f:            # 이야기 버전 쪽지(dv2sNote)
        note_box(s, f['note'])
    elif 'plane' in f:           # 이야기 버전 종이비행기 그림(dv2sPlaneFig)
        plane_fig(s, f['plane'])
    elif 'journal' in f:
        s.labeled([('10월 2일', '이틀 전보다 잎은 3장 더 생겼고 줄기는 길어졌다. 잎의 수: 5장, 줄기의 길이: 13.5 cm'),
                   ('10월 17일', '15일 전보다 잎은 9장 더 생겼고 줄기의 길이는 □배가 되었다. 잎의 수: 14장, 줄기의 길이: 22.95 cm')])
    else:
        raise ValueError('모르는 그림', f)


# ================================================================ 그림들
def bars_fig(s, n, per, pre):
    """한 칸이 0.1인 막대 n칸(한 줄 10칸 = 1). pre면 첫 묶음을 보여 줌."""
    cwd, x0, bh, gap = 60, 56, 46, 84
    rows = (n + 9) // 10
    out = []
    for i in range(n):
        x, y = x0 + (i % 10) * cwd, 34 + (i // 10) * gap
        out.append(R(x, y, cwd, bh, FILLS[0] if pre and i < per else '#fff', DARK, 1.4))
    for r in range(rows):
        k = min(10, n - r * 10)
        y = 34 + r * gap
        out.append(R(x0, y, cwd * k, bh, 'none', INK, 2.5))
        if k == 10:
            out.append(T(x0 - 26, y + bh / 2, '1', 22, anchor='middle', fill=DARK))
    if pre:
        for r in range(0, (per - 1) // 10 + 1):
            a, b = r * 10, min(per - 1, r * 10 + 9)
            y = 34 + r * gap
            out.append(R(x0 + (a % 10) * cwd + 3, y + 3, (b - a + 1) * cwd - 6, bh - 6, 'none', RED, 3, rx=12))
        out.append(T(x0 + 14, 22, '1', 18, fill=RED))
    W, H = x0 * 2 + cwd * 10, 40 + rows * gap
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=125)


def line_fig(s, o, pre):
    TO, STP, MX, TK = Q(o['to']), Q(o['step']), Q(o['max']), Q(o.get('tick') or '1')
    sub = o.get('sub')
    W, x0, Lw, y, sy = 800, 50, 660, 110, 214
    H = 270 if sub else 175
    X = lambda v: x0 + Lw * float(v / MX)   # noqa: E731
    out = []

    def axis(yy, k, unit, minor):
        out.append(L(x0 - 10, yy, x0 + Lw + 16, yy, INK, 3))
        out.append('<path d="M%d %d l12 7 l-12 7 z" fill="%s"/>' % (x0 + Lw + 16, yy - 7, INK))
        nT = round(MX / TK)
        for i in range(nT + 1):
            v = TK * i
            x = X(v)
            out.append(L(x, yy - 12, x, yy + 12, INK, 2))
            out.append(T(x, yy + 30, dec(v * k), 20, anchor='middle'))
        if minor:
            nm = round(MX * 10)
            if nm <= 120:
                for i in range(1, nm):
                    if i % 10:
                        x = X(Fraction(i, 10))
                        out.append(L(x, yy - 6, x, yy + 6, DARK, 1))
        out.append(T(x0 + Lw + 34, yy + 30, unit, 18, anchor='middle', fill=DARK))
    axis(y, 1, o['unit'], True)
    if sub:
        axis(sy, sub['k'], sub['unit'], False)
    xt = X(TO)
    out.append('<path d="M%.1f %d l18 0 l-9 14 z" fill="%s"/>' % (xt - 9, y - 54, RED))
    out.append(T(xt, y - 68, '%s %s' % (o['to'], o['unit']), 20, anchor='middle', fill=RED))
    if sub:
        out.append(L(xt, y + 44, xt, sy - 14, RED, 1.5, '5 4'))
    if pre:
        a, b = X(0), X(STP)
        m = (a + b) / 2
        out.append('<path d="M%.1f %d Q%.1f %d %.1f %d" fill="none" stroke="%s" stroke-width="3"/>' % (a, y - 4, m, y - 58, b, y - 4, ORANGE))
        out.append('<path d="M%.1f %d l-11 -9 l12 -3 z" fill="%s"/>' % (b, y - 4, ORANGE))
        out.append(T(m, y - 40, '1', 17, anchor='middle', fill=ORANGE))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=150)


def fold_fig(s, o):
    LEN, SN = Q(o['len']), Q(o.get('snap') or '0.5')
    W, x0, Lp, y, bh, ry, H = 760, 30, 700, 30, 70, 136, 196
    out = [R(x0, y, Lp, bh, '#FCE8C8', '#C99A57', 2.5)]
    out.append(T(x0 + Lp / 2, y + bh / 2, '종이 %s %s' % (o['len'], o['unit']), 20, anchor='middle', fill='#8A5A1E'))
    out.append(R(x0, ry - 12, Lp, 44, '#F3F7F5', '#C9D4CF', 1))
    mm = round(LEN * 10)
    for i in range(mm + 1):
        x = x0 + Lp * i / mm
        big, mid = i % 10 == 0, i % 5 == 0
        out.append(L(x, ry - 12, x, ry - 12 + (20 if big else 14 if mid else 8), INK, 2 if big else 1))
        if big:
            out.append(T(x, ry + 20, str(i // 10), 16, anchor='middle'))
    out.append(T(x0 + Lp - 4, ry + 44, o['unit'], 15, anchor='end', fill=DARK))
    assert SN > 0
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=150)


def shift_k(it):
    if it.get('shift') is not None:
        return it['shift']
    return max(ndig(it['b']), ndig(it['a']) if it.get('both') else 0)


def shift_fig(s, items, pre):
    """앱 dv2Shift: 숫자 칸(흐린 0 포함)과 처음 소수점. pre면 옮긴 소수점(빨간 점)과 화살표·'10배'를 보여 줌."""
    c, fs = 46, 38
    out, y0, wmax = [], 40, 0
    for it in items:
        A, B = it['a'], it['b']
        D = max(ndig(A), ndig(B), it.get('shift') or 0)
        k = shift_k(it)
        x = 20

        def strip(sv, x):
            i, f = (sv.split('.') + [''])[:2]
            cells = list(i + f.ljust(D, '0'))
            p0 = len(i) - 1
            for j, d in enumerate(cells):
                cx = x + j * c + c / 2
                out.append(T(cx, y0, d, fs, anchor='middle', fill=GREY if j >= len(i) + len(f) else INK))
            dot = lambda j, col, hollow: out.append(  # noqa: E731
                C(x + (j + 1) * c - 2, y0 + fs * .42, 5, '#fff' if hollow else col, col, 2.2))
            if pre and k:
                dot(p0, GREY, True)
                if p0 + k < len(cells) - 1:
                    dot(p0 + k, RED, False)
                for h in range(k):
                    a, b = x + (p0 + h + 1) * c, x + (p0 + h + 2) * c
                    out.append('<path d="M%.1f %.1f Q%.1f %.1f %.1f %.1f" fill="none" stroke="%s" stroke-width="2.2"/>'
                               % (a, y0 + fs * .55, (a + b) / 2, y0 + fs * 1.15, b - 3, y0 + fs * .6, RED))
                out.append(T(x + len(cells) * c / 2, y0 + fs * 1.55, '%d배' % 10 ** k, 20, anchor='middle', fill=RED))
            elif p0 < len(cells) - 1 and (f or D):
                if f:
                    dot(p0, INK, False)
            return x + len(cells) * c
        x = strip(A, x)
        out.append(T(x + 30, y0, '÷', fs, anchor='middle'))
        x = strip(B, x + 60)
        wmax = max(wmax, x + 20)
        ybot = y0 + (fs * 1.55 + 22 if pre and k else fs * .9)
        y0 += 120 if pre else 80
    W, H = int(wmax), int(ybot)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=110)


def rel_fig(s, rows, lab):
    W, gapY = 560, 92
    H = 50 + (len(rows) - 1) * gapY + 30
    xs = {'a': 140, 'o': 228, 'b': 310, 'e': 392, 'q': 468}
    out = []
    for k, (a, b, q) in enumerate(rows):
        assert Q(a) / Q(b) == Q(q), ('관계 그림 확인', a, b, q)
        y = 40 + k * gapY
        for key, t in (('a', a), ('o', '÷'), ('b', b), ('e', '='), ('q', q)):
            out.append(T(xs[key], y, t, 30, anchor='middle', fill=GREEN if key == 'q' else INK))
        if k:
            y0, y1 = y - gapY + 22, y - 22
            for cc in ('a', 'b'):
                out.append(L(xs[cc], y0, xs[cc], y1 - 6, RED, 2.5))
                out.append('<path d="M%d %d L%d %d L%d %d z" fill="%s"/>' % (xs[cc] - 6, y1 - 10, xs[cc], y1, xs[cc] + 6, y1 - 10, RED))
                out.append(T(xs[cc] + 38, (y0 + y1) / 2, lab, 17, anchor='middle', fill=RED))
            out.append(T(xs['q'] + 44, (y0 + y1) / 2, '같아요', 16, anchor='middle', fill=GREEN))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=80)


def robot_fig(s):
    W, H, x0, sc = 720, 186, 40, 100
    out = [L(x0, 14, x0, 158, INK, 3), T(x0, 176, '출발선', 15, anchor='middle')]
    for d, c, n, y in ((5.89, RED, '빨간색 로봇', 46), (3.1, BLUE, '파란색 로봇', 116)):
        x = x0 + d * sc
        out.append('<line x1="%d" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="6" opacity=".5"/>' % (x0, y, x, y, c))
        out.append(R(x - 30, y - 22, 30, 26, c, c, 1, rx=6))
        out.append(C(x - 20, y - 12, 3, '#fff'))
        out.append(C(x - 9, y - 12, 3, '#fff'))
        out.append(L(x, y - 30, x, y + 26, c, 2, '4 3'))
        out.append(T((x0 + x) / 2, y - 16, '%s %s m' % (n, d), 17, anchor='middle', fill=c))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=120)


def cards_fig(s, cards, fs=40):
    out, x = [], 12
    for c in cards:
        w = max(70, tw(c, fs) + 40)
        out.append(R(x, 10, w, 96, '#FFF8E6', INK, 3, rx=12))
        out.append(T(x + w / 2, 58, c, fs, anchor='middle'))
        x += w + 22
    put_png(s, svg_doc(int(x), 116, ''.join(out)), int(x), 116, max_mm=min(90, x * .16))


def island_fig(s, cells):
    N, COLS, cwd, ch, gx, gy, x0, y0 = len(cells) + 2, 7, 150, 92, 8, 30, 14, 20
    W = x0 * 2 + COLS * (cwd + gx)
    rws = (N + COLS - 1) // COLS
    H = y0 + rws * (ch + gy) + 4

    def pos(i):
        r = i // COLS
        c = COLS - 1 - i % COLS if r % 2 else i % COLS
        return x0 + c * (cwd + gx), y0 + r * (ch + gy)
    out = [R(2, 2, W - 4, H - 4, '#DDF0F8', '#DDF0F8', 0, rx=18)]
    for i in range(N - 1):
        (ax, ay), (bx, by) = pos(i), pos(i + 1)
        out.append(L(ax + cwd / 2, ay + ch / 2, bx + cwd / 2, by + ch / 2, '#B9DCEB', 10))
    for i in range(N):
        x, y = pos(i)
        end = i in (0, N - 1)
        out.append(R(x, y, cwd, ch, '#FFE7A8' if end else '#FFF3D6', '#C99A57', 2, rx=14))
        if i == 0 or i == N - 1:
            out.append(T(x + cwd / 2, y + ch / 2, '출발' if i == 0 else '도착', 26, anchor='middle', fill='#8A5A1E'))
            continue
        c = cells[i - 1]
        out.append(T(x + 14, y + 15, str(i), 15, anchor='middle', fill=DARK))
        out.append(T(x + cwd / 2, y + ch / 2 - (12 if c.get('r') is not None else 0), c['e'], 22 if len(c['e']) > 9 else 24, anchor='middle'))
        if c.get('r') is not None:
            out.append(T(x + cwd / 2, y + ch / 2 + 16, '반올림하여', 15, anchor='middle', fill=RED))
            out.append(T(x + cwd / 2, y + ch / 2 + 34, '%s까지' % PLACE[c['r']], 15, anchor='middle', fill=RED))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=180)


# ---------------------------------------------------------------- 세로셈 판(앱 dv2LongBoard와 같은 규칙)
def board_data(pr):
    A, B, mode = pr['a'], pr['b'], pr.get('mode') or 'q'
    ai, af = (A.split('.') + [''])[:2]
    bi, bf = (B.split('.') + [''])[:2]
    sh = pr['shift'] if pr.get('shift') is not None else len(bf)
    assert len(bf) <= sh, ('나누는 수가 자연수가 되지 않아요', B)
    RA, RB = Q(A), Q(B)
    q = RA / RB
    if mode == 'q':
        qs = dec(q)
        assert qs is not None, ('나누어떨어지지 않아요', A, B)
        qd = ndig(qs)
        ans = '%s = %s' % (sp(A + '÷' + B), qs)
        rem = None
    elif mode == 'rem':
        qw = math.floor(q)
        qs, qd = str(qw), 0
        rem = RA - RB * qw
        assert 0 <= rem < RB
        ans = '%s: %s %s, 남는 양 %s' % (sp(A + '÷' + B), pr.get('what') or '몫', qs, dec(rem))
    else:
        qd = pr['places']
        qs = fix(trunc(q, qd), qd)
        rem = None
        ans = '%s = %s…' % (sp(A + '÷' + B), qs)
    tot = max(len(af), sh + qd)
    digits = list(ai + af.ljust(tot, '0'))
    nOrig, pOrig, pNew = len(ai) + len(af), len(ai) - 1, len(ai) - 1 + sh
    first = next((k for k, d in enumerate(digits) if d != '0'), len(digits))
    qn = len(qs.replace('.', '').lstrip('0') or '0')
    memo = pr['memo'] if pr.get('memo') is not None else min(8, 2 * max(1, qn))
    bdig = list(bi + bf.ljust(sh, '0'))
    bfirst = next((k for k, d in enumerate(bdig) if d != '0'), len(bdig))
    return dict(A=A, B=B, ai=ai, af=af, bi=bi, bf=bf, sh=sh, digits=digits, nOrig=nOrig, pOrig=pOrig, pNew=pNew,
                first=first, memo=memo, bdig=bdig, bfirst=bfirst, mode=mode, qs=qs, rem=rem, ans=ans, q=q)


def board_svg(d, pre, out, ox, oy):
    """한 판을 (ox, oy)에 그리고 (너비, 높이)를 돌려줌"""
    c, fs, labw = 44, 34, 74
    C_ = len(d['digits'])
    cap = sp(d['A'] + '÷' + d['B'])
    out.append(T(ox, oy + 14, cap, 26, weight='bold'))
    y = oy + 34
    if pre:
        out.append(T(ox, y + 8, ('두 수의 소수점을 오른쪽으로 %d자리씩 옮겼어요(각각 %d배).' % (d['sh'], 10 ** d['sh'])) if d['sh'] else '나누는 수가 자연수예요.', 16, fill=DARK))
        y += 26
    bw_ = 0.72 * c
    bcells = d['bdig'] if pre else list(d['bi'] + d['bf'])
    divw = len(bcells) * bw_ + 22
    xd = ox + labw + divw          # 나누어지는 수 첫 칸 왼쪽
    rows_y = y + 4
    # 몫 줄
    out.append(T(ox + labw - 10, rows_y + c / 2, '몫', 17, anchor='end', fill=GREEN))
    for k in range(C_):
        out.append(R(xd + k * c + 4, rows_y + 4, c - 8, c - 8, '#fff', GREY, 1.6, rx=4, dash='4 3'))
    # 나눗셈 줄
    yy = rows_y + c
    cy = yy + c / 2
    out.append(L(xd - 6, yy + 2, xd + C_ * c + 6, yy + 2, INK, 3))
    out.append('<path d="M%.1f %.1f Q%.1f %.1f %.1f %.1f" fill="none" stroke="%s" stroke-width="3"/>' % (xd - 6, yy + 2, xd + 8, yy + c / 2, xd - 8, yy + c + 4, INK))
    for k, ch in enumerate(bcells):
        x = ox + labw + k * bw_ + bw_ / 2
        if pre:
            g = k >= len(d['bi']) + len(d['bf'])
            x_ = k < d['bfirst']
            out.append(T(x, cy, ch, fs, anchor='middle', fill=GREY if g or x_ else INK))
            if x_:
                out.append(L(x - 9, cy + 9, x + 9, cy - 9, GREY, 2))
            if d['sh'] and k == len(d['bi']) - 1:
                out.append(C(x + bw_ / 2 - 1, cy + fs * .42, 4.5, '#fff', GREY, 2))
        else:
            out.append(T(x, cy, ch, fs, anchor='middle'))
            if d['bf'] and k == len(d['bi']) - 1:
                out.append(C(x + bw_ / 2 - 1, cy + fs * .42, 4, INK))
    for k in range(C_):
        x = xd + k * c + c / 2
        if pre:
            ch = d['digits'][k]
            g = k >= d['nOrig']
            x_ = k < d['first'] and k < d['pNew']
            out.append(T(x, cy, ch, fs, anchor='middle', fill=GREY if g or x_ else INK))
            if x_:
                out.append(L(x - 9, cy + 9, x + 9, cy - 9, GREY, 2))
            if d['sh'] and k == d['pOrig'] and d['pOrig'] != d['pNew']:
                out.append(C(x + c / 2 - 2, cy + fs * .42, 4.5, '#fff', GREY, 2))
            if k == d['pNew'] and d['pNew'] < C_ - 1:
                out.append(C(x + c / 2 - 2, cy + fs * .42, 5, RED))
        else:
            orig = d['ai'] + d['af']
            if k < len(orig):
                out.append(T(x, cy, orig[k], fs, anchor='middle'))
                if d['af'] and k == d['pOrig']:
                    out.append(C(x + c / 2 - 2, cy + fs * .42, 4, INK))
            else:
                out.append(R(x - c / 2 + 6, yy + 6, c - 12, c - 12, '#fff', '#C9D4CF', 1.2, rx=4, dash='3 3'))
    # 계산 메모 줄
    yy += c
    for r in range(d['memo']):
        for k in range(C_):
            out.append(R(xd + k * c + 3, yy + r * c + 3, c - 6, c - 6, '#fff', '#D5DEDA', 1, rx=3, dash='2 3'))
    yy += d['memo'] * c
    if d['mode'] == 'rem':
        out.append(T(ox + labw - 10, yy + c / 2, '남는 양', 17, anchor='end', fill=ORANGE))
        for k in range(C_):
            out.append(R(xd + k * c + 4, yy + 4, c - 8, c - 8, '#fff', ORANGE, 1.8, rx=4))
        if pre and d['af']:
            out.append(T(xd + C_ * c + 8, yy + c / 2, '← 처음 소수점에 맞추어요', 15, fill=ORANGE))
        yy += c
    wid = max(xd + C_ * c + (190 if pre and d['mode'] == 'rem' and d['af'] else 10), ox + tw(cap, 26) + 10,
              ox + (tw('두 수의 소수점을 오른쪽으로 1자리씩 옮겼어요(각각 10배).', 16) if pre else 0)) - ox
    return wid, yy - oy + 8


def long_fig(s, probs, pre):
    ds = [board_data(p) for p in probs]
    out, x, y, rowh, wmax = [], 10, 6, 0, 0
    for d in ds:
        tmp = []
        w, h = board_svg(d, pre, tmp, 0, 0)
        if x > 10 and x + w > 1150:
            x, y = 10, y + rowh + 24
            rowh = 0
        board_svg(d, pre, out, x, y)
        x += w + 46
        rowh = max(rowh, h)
        wmax = max(wmax, x - 46 + 10)
    W, H = int(wmax), int(y + rowh + 6)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=180)
    return [d['ans'] for d in ds]


# ================================================================ 활동 함수(앱 기록 → 활동지)
def head(s, Ls):
    s.lesson(Ls['no'], Ls['soop'], K(Ls['title']), K(Ls['question']))


def step(s, i, name):
    s.step('%s %s' % (NUM[i], name))


def w_sent(s, lv, a):
    rows, o = a[0], (a[1] if len(a) > 1 else {}) or {}
    fig(s, o.get('fig'))
    return sent(s, rows)


def w_bars(s, lv, a):
    o = a[0]
    assert Q(o.get('cell') or '0.1') == Fraction(1, 10)
    assert Q(o['step']) == Q(o.get('cell') or '0.1') * o['per']
    bars_fig(s, o['n'], o['per'], lv == '기본형')
    full, left = o['n'] // o['per'], o['n'] % o['per']
    out = ['%s씩 %d묶음' % (o['step'], full) + (' (묶지 않은 칸 %d칸)' % left if left else '')]
    if lv == '기본형':
        s.text('첫 번째 묶음처럼 %s씩(%d칸씩) 묶어 보세요.' % (o['step'], o['per']))
    return out + sent(s, o.get('asks') or [])


def w_line(s, lv, a):
    o = a[0]
    TO, STP = Q(o['to']), Q(o['step'])
    full = math.floor(TO / STP)
    line_fig(s, o, lv == '기본형')
    if lv == '기본형':
        s.text('0에서부터 %s %s씩 뛰어 세어 화살표를 그려 보세요. 첫 번째 화살표는 그려 두었어요.' % (o['step'], o['unit']))
    out = ['%s %s씩 %d번' % (o['step'], o['unit'], full) + (' (%s %s 남음)' % (dec(TO - STP * full), o['unit']) if TO != STP * full else '')]
    return out + sent(s, o.get('asks') or [])


def w_fold(s, lv, a):
    o = a[0]
    LEN, PART = Q(o['len']), Q(o['part'])
    cnt = LEN / PART
    assert cnt.denominator == 1
    fold_fig(s, o)
    if lv == '기본형':
        s.text('자의 눈금을 보고 %s %s마다 접는 선을 그어 보세요.' % (o['part'], o['unit']))
    out = ['접는 선 %s %s' % (', '.join(dec(PART * k) for k in range(1, int(cnt))), o['unit']) + ' → %d칸' % cnt]
    return out + sent(s, o.get('asks') or [])


def w_shift(s, lv, a):
    o = a[0]
    fig(s, o.get('fig'))
    shift_fig(s, o['items'], lv == '기본형')
    out = []
    lines = []
    for it in o['items']:
        k = shift_k(it)
        A2, B2 = Q(it['a']) * 10 ** k, Q(it['b']) * 10 ** k
        assert B2.denominator == 1 and (not it.get('both') or A2.denominator == 1)
        assert A2 / B2 == Q(it['a']) / Q(it['b'])
        lines.append('%s ÷ %s → 소수점을 오른쪽으로 (      )자리씩 옮기면 (          ) ÷ (          )' % (it['a'], it['b']))
        out.append('%s ÷ %s → %d자리씩, %s ÷ %s' % (it['a'], it['b'], k, dec(A2), dec(B2)))
    s.fill(lines if len(lines) > 1 else lines[0])
    return out + sent(s, o.get('asks') or [])


def w_long(s, lv, a):
    o = a[0]
    fig(s, o.get('fig'))
    if lv == '기본형':
        s.text(K(o.get('tip') or '옮긴 소수점(빨간 점)을 보고 자연수의 나눗셈처럼 계산해요. 몫을 맨 위 칸에 쓰고, 몫에 소수점이 있으면 알맞은 자리에 찍어요.'))
    else:
        s.text('두 수의 소수점을 옮기고 세로셈으로 계산해 몫을 맨 위 칸에 써요.' + (' 남는 양은 맨 아래 칸에 써요.' if any(p.get('mode') == 'rem' for p in o['probs']) else ''))
    out = long_fig(s, o['probs'], lv == '기본형')
    return out + sent(s, o.get('rows') or [])


def w_round(s, lv, a):
    o = a[0]
    if lv == '기본형':
        s.text('몫에서 확인할 숫자(나타낼 자리의 바로 아래 자리)에 ○표 하고, 반올림한 몫을 써요.')
    rows = [['나눗셈', '몫', '나타낼 자리', '확인할 숫자', '반올림한 몫']]
    out = []
    for it in o['items']:
        q, to = ev(it['e']), it['to']
        dd = dec(q)
        exact = dd is not None and ndig(dd) <= to + 2
        sh = fix(trunc(q, to + 2), to + 2) + ('' if exact else '…')
        want = fix(rnd(q, to), to)
        digit = fix(trunc(q, to + 1), to + 1)[-1]
        rows.append([sp(it['e']), sh, PLACE[to] + '까지', '(      )', '(          )'])
        out.append('%s = %s → %s 숫자 %s%s 보고 %s' % (sp(it['e']), sh, PLACE[to + 1], digit, '을' if has_jong(digit)[0] else '를', want))
    s.table(rows, col_mm=[34, 40, 38, 32, 36])
    return out + sent(s, o.get('asks') or [])


def w_cards(s, lv, a):
    o = a[0]
    cards = o['cards']
    best, bp = None, None
    for p in permutations(range(len(cards))):
        v = Q('%s.%s' % (cards[p[0]], cards[p[1]])) / Q('%s.%s' % (cards[p[2]], cards[p[3]]))
        if best is None or v > best:
            best, bp = v, p
    cards_fig(s, cards)
    s.text('수 카드를 한 번씩 모두 써서 몫이 가장 큰 (소수 한 자리 수)÷(소수 한 자리 수)를 만들어 보세요.')
    if lv == '기본형':
        s.text('도움: 몫이 가장 크려면 나누어지는 수는 가장 크게, 나누는 수는 가장 작게 만들어요.')
    s.fill('(    ).(    ) ÷ (    ).(    ) = (              )')
    made = '%s.%s ÷ %s.%s' % tuple(cards[i] for i in bp)
    out = ['%s = %s' % (made, show(best))]
    return out + sent(s, o.get('asks') or [])


def w_fuel(s, lv, a):
    o = a[0]
    want = Q(o['dist']) / Q(o['per'])
    assert (want * 10).denominator == 1
    s.text('%s는 연료 1 L로 %s km를 갈 수 있어요. 집에서 %s까지는 %s km예요.' % (o['car'], o['per'], o.get('place') or '할머니 댁', o['dist']))
    if lv == '기본형':
        s.text('도움: 필요한 연료의 양 = (가야 할 거리) ÷ (연료 1 L로 갈 수 있는 거리)')
    return sent(s, o.get('asks') or [])


def w_quiz(s, lv, a):
    items = a[0]
    ans = []
    for it in items:
        fig(s, it.get('fig'))
        q, o, al = K(it['q']), it['o'], it['a']
        multi = isinstance(al, list)
        if all(len(K(x)) <= 16 for x in o):
            s.choices([(q + (' (모두)' if multi else ''), '( ' + ' / '.join(K(x) for x in o) + ' )')])
            ans.append(', '.join(flat(K(o[i])) for i in al) if multi else flat(K(o[al])))
        else:
            s.ask(q + (' 알맞은 것을 모두 골라 기호를 써요.' if multi else ''), blank=False)
            s.fill(['%s %s' % (KO[i], K(x)) for i, x in enumerate(o)])
            s.ask('답: (        )', blank=False)
            ans.append(', '.join(KO[i] for i in al) if multi else KO[al])
    return ans


def w_blanks(s, lv, a):
    parts = a[0]
    txt, ans, words = '', [], []
    for p in parts:
        if isinstance(p, str):
            txt += K(p)
        else:
            ans.append(flat(K(p['o'][p['a']])))
            words += [K(x) for x in p['o']]
            txt += ('( ' + ' / '.join(K(x) for x in p['o']) + ' )') if lv == '기본형' else '(              )'
    if lv == '도전형':
        s.wordbox(sorted(set(words), key=lambda w: (len(w), w)))
    s.fill(txt)
    return ans


def w_sequence(s, lv, a):
    items, order = a[0], a[1]
    s.fill([K(t) for t in items])
    s.ask('배우는 차례대로 기호를 써 보세요.   ' + ' → '.join(['(      )'] * len(order)), blank=False)
    return [' → '.join(items[i][0] for i in order)]


# 글쓰기 칸 쓰기 틀(기본형) — (차시 id, 앱 tag)
FRAMES = {
    ('t1', '체험'): '저는 ______________에서 ______________을(를) 체험해 보고 싶어요.',
    ('t1', '상황'): '______________을(를) ________씩 나누어 ______________을(를) 알아볼 때',
    ('t89', '해결 방법'): '할머니 댁까지의 거리를 ______________________________(으)로 나누었어요.',
    ('t89', '환경'): '연료를 아끼면 ______________. 나는 ______________을(를) 할 수 있어요.',
    ('t10', '계산'): '______________은(는) ______________처럼 계산해서 몫이 ________예요.',
    ('t10', '배려'): '친구가 ______________ 때 ______________________.',
    ('t11', '자기 평가'): '나는 ______________은(는) 잘하지만 ______________은(는) 조심해야 해요.',
    ('t11', '정리'): '______________ → ______________ : ______________________',
}


def w_write(s, lv, a, lid):
    out = []
    for it in a[0]:
        s.ask(K(it['q']), blank=False)
        fr = FRAMES.get((lid, it.get('tag')))
        if lv == '기본형' and fr:
            s.fill(fr)
        else:
            s.lines(2)
        out.append('예) ' + K(re.sub(r'^예\)\s*', '', it.get('ph') or '')))
    return out


def w_island(s, lv, a, isl):
    for c in isl:
        q = ev(c['e'])
        want = dec(q) if c.get('r') is None else fix(rnd(q, c['r']), c['r'])
        assert want is not None and Q(want) == Q(c['ans']), c
    island_fig(s, isl)
    s.text('놀이판의 칸 번호를 보고, 도착한 칸의 몫을 기록표에 써요. 짝이 계산기로 확인하면 ○표 해요.')
    half = (len(isl) + 1) // 2
    rows = [['칸', '나눗셈', '몫', '확인', '칸', '나눗셈', '몫', '확인']]
    for r in range(half):
        row = []
        for j in (r, r + half):
            if j < len(isl):
                c = isl[j]
                row += [str(j + 1), sp(c['e']) + ('' if c.get('r') is None else '\n(%s까지)' % PLACE[c['r']]), '', '']
            else:
                row += ['', '', '', '']
        rows.append(row)
    s.table(rows, col_mm=[10, 38, 26, 16, 10, 38, 26, 16], row_h=2700)
    return ['놀이판 몫: ' + ', '.join('%d) %s' % (i + 1, c['ans']) for i, c in enumerate(isl))]


def w_bingo(s, lv, a, isl):
    pool = [c for c in isl if c.get('r') is None]
    s.text('놀이판의 (소수)÷(소수), (자연수)÷(소수) %d문제예요. 9개를 골라 빙고판 칸마다 나눗셈과 몫을 써요.' % len(pool))
    s.fill('   '.join(sp(c['e']).replace(' ', '') for c in pool))
    s.table([['', '', ''], ['', '', ''], ['', '', '']], header=False, row_h=6800)
    return ['빙고 몫: ' + ', '.join('%s=%s' % (c['e'], c['ans']) for c in pool)]


# 도전형 '왜 그럴까요?' (차시 id → (물음, 예시 답))
WHY = {
    't1': ('70÷60처럼 몫이 간단한 소수로 나오지 않을 때 몫을 어떻게 나타내면 좋을지 써 보세요.', '몫을 반올림하여 약 1.2처럼 나타내요.'),
    't2': ('3.6÷0.9와 36÷9의 몫이 같은 까닭을 써 보세요.', '3.6과 0.9를 각각 10배 하면 36과 9가 되고, 나누어지는 수와 나누는 수를 똑같이 10배 해도 몫은 같기 때문이에요.'),
    't3': ('3.75÷1.25를 계산할 때 두 수의 소수점을 두 자리씩 옮기는 까닭을 써 보세요.', '두 수가 모두 소수 두 자리 수라서 각각 100배 해야 자연수가 되고, 각각 100배 해도 몫은 같기 때문이에요.'),
    't4': ('58.9÷31로 계산할 때 몫의 소수점을 58.9의 소수점 위치에 맞추어 찍는 까닭을 써 보세요.', '5.89÷3.1과 58.9÷31은 몫이 같으므로 58.9÷31을 계산하듯이 58.9의 소수점에 맞추어 찍어요.'),
    't5': ('3÷0.75를 계산할 때 3을 3.00으로 생각하는 까닭을 써 보세요.', '0.75를 100배 해 자연수로 만들려면 3도 똑같이 100배 해야 하는데, 3.00으로 생각하면 소수점을 두 자리 옮겨 300이 되기 때문이에요.'),
    't6': ('몫을 소수 첫째 자리까지 나타낼 때 소수 둘째 자리까지만 계산하면 되는 까닭을 써 보세요.', '반올림할 때는 나타낼 자리의 바로 아래 자리 숫자만 보면 되기 때문이에요.'),
    't7': ('12.4÷1.5에서 남는 양이 4 L가 아니라 0.4 L인 까닭을 써 보세요.', '124÷15에서 남는 4는 0.1이 4개라는 뜻이라서, 12.4의 처음 소수점에 맞추어 0.4로 찍어요. 1.5×8+0.4=12.4로 확인할 수 있어요.'),
    't89': ('연료 1 L로 갈 수 있는 거리가 길수록 필요한 연료의 양이 적은 까닭을 써 보세요.', '같은 거리를 나눌 때 나누는 수(1 L로 갈 수 있는 거리)가 클수록 몫(필요한 연료의 양)이 작아지기 때문이에요.'),
    't10': ('19÷0.6을 반올림하여 소수 첫째 자리까지 나타내려면 몫을 어느 자리까지 구해야 하는지 까닭과 함께 써 보세요.', '소수 둘째 자리까지 구해요. 소수 첫째 자리의 바로 아래 자리인 소수 둘째 자리 숫자를 보고 반올림하기 때문이에요.'),
    't11': ('털실 23.8 m를 4.5 m씩 나누어 줄 때 남는 양이 13 m가 될 수 없는 까닭을 써 보세요.', '남는 양은 나누는 수 4.5 m보다 작아야 하고, 13 m라면 4.5×5+13=35.5가 되어 23.8이 아니기 때문이에요.'),
}
assert ev('1.5×8+0.4') == Q('12.4') and ev('4.5×5+13') == Q('35.5') and rnd(ev('70÷60'), 1) == Q('1.2')


def run_call(s, lv, call, lid, isl):
    w, a = call['w'], call['args']
    if w == 'writeStep':
        return w_write(s, lv, a, lid)
    if w == 'island':
        return w_island(s, lv, a, isl)
    if w == 'bingo':
        return w_bingo(s, lv, a, isl)
    return {'sent': w_sent, 'bars': w_bars, 'line': w_line, 'fold': w_fold, 'shift': w_shift, 'long': w_long,
            'round': w_round, 'cards': w_cards, 'fuel': w_fuel, 'quiz': w_quiz, 'blanks': w_blanks,
            'sequence': w_sequence}[w](s, lv, a)


def J(xs):
    return ', '.join(str(x) for x in xs if x not in (None, ''))


def lesson(s, lv, Ls, app):
    head(s, Ls)
    if Ls['id'] == 't1':
        s.scene(None, K(app['story']['lines'][0]))
    parts = []
    hard = HARD_TB.get(Ls['id']) if lv == '도전형' else None      # 도전형 계단은 새 문제
    assert hard is None or len(hard) == len(Ls['steps']), ('도전형 새 문제 수가 계단 수와 달라요', Ls['id'])
    for i, st in enumerate(Ls['steps']):
        if hard:
            h = hard[i]
            step(s, i, K(h[2] if len(h) > 2 else (st['name'] or STEP_NAMES[i])))
            s.text(paper(h[0]))
            a = []
            for call in h[1]:
                a += run_call(s, lv, call, Ls['id'], app['island'])
            parts.append('%s %s' % (NUM[i], J(a)))
            continue
        step(s, i, K(st['name'] or STEP_NAMES[i]))
        s.text(paper(st['inst']))
        if lv == '기본형':
            t = tip(st['hints'])
            if t:
                s.text(t)
        a = []
        for call in st['calls']:
            a += run_call(s, lv, call, Ls['id'], app['island'])
        parts.append('%s %s' % (NUM[i], J(a)))
    n = len(Ls['steps'])
    if lv == '도전형':
        q, ex = WHY[Ls['id']]
        s.step('%s 왜 그럴까요?' % NUM[n])
        s.ask(K(q), blank=False)
        s.lines(2)
        parts.append('%s 예) %s' % (NUM[n], K(ex)))
        s.step('%s 도전 계단' % NUM[n + 1], '★ 도전 문제')
        s.text(paper(Ls['ch']['inst']))
        a = []
        for call in Ls['ch']['calls']:
            a += run_call(s, lv, call, Ls['id'], app['island'])
        parts.append('%s ★ %s' % (NUM[n + 1], J(a)))
    return '%s차시  ' % Ls['no'] + '  '.join(parts)


def build_tb(app, lv):
    s = Sheet(unit_label=LABEL_TB, level=lv, grade_label='6학년')
    lines = [lesson(s, lv, Ls, app) for Ls in app['lessons']]
    s.answers('【교사용】 2. 소수의 나눗셈(교과서 차시) 활동지 정답 (%s)' % lv, lines,
              note='※ 이 활동지는 앱 u2-decdiv.html과 차시 번호가 같습니다. 정답의 ‘36/10’은 분수 10분의 36을 뜻해요. '
                   '소수의 끝자리 0은 생략할 수 있어요. ‘2.333…’처럼 …가 있는 몫은 끝없이 이어져요. 글쓰기 칸의 ‘예)’는 예시 답이에요.')
    os.makedirs(OUT_TB, exist_ok=True)
    path = os.path.join(OUT_TB, NAME % lv)
    s.save(path)
    return path


# ================================================================ 이야기 버전(st) — '우리 반 나눔 축제 부스'
ST_JS = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const core = src.slice(src.indexOf('/*dv2-core*/'), src.indexOf('/*dv2-core-end*/'));
const cellsFn = src.slice(src.indexOf('function dv2sCells('), src.indexOf('function dv2Island('));
const dv2c = (src.match(/const DV2C = \{[^\n]*\};/) || ['const DV2C = {};'])[0];
const les = src.slice(src.indexOf('//@@LESSONS'));
let REC = [];
const rec = w => function (b, a, ...args) { REC.push({ w, args }); };
const stubs = `
var dv2Sent=rec('sent'), dv2Bars=rec('bars'), dv2Shift=rec('shift'), dv2Long=rec('long'), dv2Line=rec('line'), dv2Fold=rec('fold'),
 dv2Round=rec('round'), dv2Cards=rec('cards'), dv2Island=rec('island'), dv2Bingo=rec('bingo'), dv2sUnit=rec('unit'),
 quiz=rec('quiz'), blanks=rec('blanks'), sequence=rec('sequence'), writeStep=rec('writeStep'), panes=rec('panes');
var dv2Style = () => {};
var dv2LongStep = opt => (b, a) => dv2Long(b, a, opt);
var thenWhy = (f, o) => function (b, a) { f(b, a); REC.push({ w: 'thenWhy', args: [o] }); };
var ruleFirst = (f, o) => function (b, a) { REC.push({ w: 'ruleFirst', args: [o] }); f(b, a); };
var wonderRecall = f => function (b, a) { REC.push({ w: 'wonder', args: [] }); f(b, a); };
var dv2Talk = lines => ({ talk: lines }), dv2RelFig = (rows, lab) => ({ rel: rows, lab }),
 dv2sNote = (title, lines) => ({ note: { title, lines } }), dv2sPlaneFig = rows => ({ plane: rows });
`;
const B = () => ({ append: (...xs) => xs.forEach(x => REC.push({ w: 'append', args: [x] })) });
const R = eval(core + '\n' + dv2c + '\n' + cellsFn + '\n' + stubs + '\n' + les + '\n;({LESSONS, UNIT_STORY})');
const ser = v => JSON.parse(JSON.stringify(v, (k, x) => typeof x === 'bigint' ? String(x) : (typeof x === 'function' ? (x.length === 0 ? x() : undefined) : x)));
const out = R.LESSONS.map(L => {
  const steps = L.steps.map(S => { REC = []; S.render(B(), {}); return { name: S.name || null, inst: S.inst, hints: S.hints || [], calls: ser(REC) }; });
  REC = []; L.challenge.render(B(), {});
  return { id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, steps,
    ch: { inst: L.challenge.inst, hints: L.challenge.hints || [], calls: ser(REC) } };
});
process.stdout.write(JSON.stringify({ lessons: out, story: R.UNIT_STORY }));
"""


def load_st(src):
    js = os.path.join(WORK, 'ex_st.js')
    with open(js, 'w') as f:
        f.write(ST_JS)
    r = subprocess.run(['node', js, src], capture_output=True, text=True)
    if r.returncode:
        raise RuntimeError('이야기 버전 앱 원본을 읽지 못했어요\n' + r.stderr)
    return json.loads(r.stdout)


# 종이 활동지에 맞게 바꾸는 이야기 버전 안내 글(앱의 '누르기·끌기·단추' 말)
PAPER_ST = [
    ('세 칸에 써서 붙여요', '세 칸에 써 보세요'),
    ('빨간 동그라미를 눌러 두 수의 소수점을', '두 수의 소수점을'),
    ('종이를 눌러 접는 선을 놓아 보세요', '종이 그림에 접는 선을 그어 보세요'),
    ('몫에서 확인할 숫자를 누르고 답을 써요', '몫에서 확인할 숫자에 ○표 하고 답을 써요'),
    ('확인할 숫자(소수 셋째 자리)를 누르고 답을 써요', '확인할 숫자(소수 셋째 자리)에 ○표 하고 답을 써요'),
    ('남는 양을 주황 칸에 쓴 뒤', '남는 양을 맨 아래 칸에 쓴 뒤'),
    ('단추로 가 가게 설탕 1 kg의 값을 바꾸어 3.5 kg의 값이 8400원과 딱 맞게 해 보세요.',
     '가 가게 설탕 1 kg의 값을 정해 3.5 kg의 값이 8400원과 딱 맞는지 표에 써서 알아보세요.'),
    ('나 가게 설탕 1 kg의 값을 맞추어 보고', '나 가게 설탕 1 kg의 값을 표에 써서 맞추어 보고'),
    ('(3~4명이 하는 놀이를 컴퓨터 친구와 해 봐요)', '(3~4명이 함께 해요)'),
]


def paper_st(t):
    for a, b in PAPER_ST:
        t = t.replace(a, b)
    return paper(t)


EMO = re.compile('[\U00010000-\U0010FFFF☀-➿️‍]')


def noemo(t):
    return re.sub(r'\s{2,}', ' ', EMO.sub('', str(t))).strip()


def note_box(s, nt):
    """이야기 쪽지: 제목 한 줄 + '이름: 내용' 표"""
    s.text('【%s】' % noemo(nt['title']))
    pairs = []
    for ln in nt['lines']:
        for t in re.split(r'(?<=”)\s+(?=[가-힣]{1,4}:)', noemo(K(ln))):   # 한 줄에 두 사람의 말이면 나눔
            k, sep, v = t.partition(':')
            pairs.append((k.strip(), v.strip()) if sep and len(k) <= 14 else ('·', t))
    s.labeled(pairs, label_mm=30, row_h=3402)


def plane_fig(s, rows):
    """종이비행기가 날아간 거리(앱 dv2sPlaneFig와 같은 눈금: 1 m = 80)"""
    W, x0, sc = 720, 40, 80
    H = 54 + len(rows) * 66
    out = [L(x0, 10, x0, H - 26, INK, 3), T(x0, H - 10, '출발선', 14, anchor='middle')]
    for m in range(1, 9):
        x = x0 + m * sc
        out.append(L(x, H - 32, x, H - 24, DARK, 1.5))
        out.append(T(x, H - 10, '%d m' % m, 12, anchor='middle', fill=DARK))
    for k, (d, n, c) in enumerate(rows):
        y, x = 40 + k * 66, x0 + float(Q(d)) * sc
        out.append(L(x0, y, x - 6, y, c, 3, '7 6'))
        out.append('<path d="M%.1f %d L%.1f %d L%.1f %d L%.1f %d z" fill="#fff" stroke="%s" stroke-width="2.5" stroke-linejoin="round"/>'
                   % (x, y, x - 34, y - 14, x - 24, y, x - 34, y + 14, c))
        out.append(T((x0 + x) / 2, y - 16, '%s의 종이비행기 %s m' % (n, d), 16, anchor='middle', fill=c))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=120)


def frame_st(help1):
    m = re.search(r'‘(.*)’', help1 or '')
    return K(m.group(1) if m else help1).replace('~', '__________')


def write_st(s, lv, q, o, n=2):
    """글쓰기 칸: 기본형은 앱 도움의 문장 틀, 도전형은 쓰는 줄. 정답은 앱 모범 답(ans)."""
    s.ask(q, blank=False)
    hp = o.get('help') or []
    if lv == '기본형' and len(hp) > 1:
        s.fill(frame_st(hp[1]))
    else:
        s.lines(n)
    return '예) ' + flat(K(o.get('ans') or re.sub(r'^예\)\s*', '', o.get('ph') or '')))


def w_unit(s, lv, a):
    """1 kg의 값 맞추기(dv2sUnit) → 표에 1 kg의 값과 봉지 전체의 값을 써서 견주기"""
    o = a[0]
    TOT, QTY, u = Q(o['total']), Q(o['qty']), o.get('unit') or 'kg'
    want = TOT / QTY
    assert want.denominator == 1 and want % int(o.get('step') or 100) == 0, o
    s.text('%s: %s %s = %s원' % (o.get('item') or '봉지', o['qty'], u, o['total']))
    rows = [['1 %s의 값(원)' % u, '%s %s의 값(원)' % (o['qty'], u), '%s원과 견주기' % o['total']]]
    if lv == '기본형':
        g = (want // 1000) * 1000
        if g == want:
            g -= 500
        gt = g * QTY
        assert gt != TOT
        rows.append(['%s' % g, '%s × %s = %s' % (g, o['qty'], dec(gt)), '봉지 값보다 %s' % ('적어요' if gt < TOT else '많아요')])
    rows += [['', '', ''], ['', '', '']]
    s.table(rows, col_mm=[50, 70, 60], row_h=3118)
    out = ['1 %s에 %s원(%s × %s = %s)' % (u, want, want, o['qty'], o['total'])]
    return out + sent(s, o.get('asks') or [])


def w_panes(s, lv, a):
    items = a[0]
    if lv == '기본형':
        s.labeled([(p['t'], K(p['ph']).replace('~', '______________')) for p in items], label_mm=30)
        s.text('예시) ' + K(items[0]['ex'][0]))
    else:
        for p in items:
            s.ask('%s: %s' % (p['t'], K(p['ph']).replace('~', '…')), blank=False)
            s.lines(1)
    return ['(자유) 예) ' + ' / '.join('%s: %s' % (p['t'], K(p['ex'][0])) for p in items)]


def run_call_st(s, lv, call, Ls):
    w, a = call['w'], call['args']
    if w == 'append':
        fig(s, a[0])
        return []
    if w == 'thenWhy':
        return [write_st(s, lv, '왜 그럴까요? ' + K(a[0]['q']), a[0])]
    if w == 'ruleFirst':
        o = a[0]
        r = write_st(s, lv, '먼저 예상해요 · ' + K(o['q']), o, n=1)
        return ['(예상은 자유) 실제 규칙: ' + r[3:]]
    if w == 'wonder':
        s.text('1차시에 쓴 ‘궁금해요’ 칸을 다시 보고 써 보세요.')
        return []
    if w == 'writeStep':
        return [write_st(s, lv, K(it['q']), it) for it in a[0]]
    if w == 'panes':
        return w_panes(s, lv, a)
    if w == 'unit':
        return w_unit(s, lv, a)
    if w in ('island', 'bingo'):
        return run_call(s, lv, call, Ls['id'], a[0]['cells'])
    return run_call(s, lv, call, Ls['id'], None)


def lesson_st(s, lv, Ls, app):
    head(s, Ls)
    if Ls['id'] == 's1':
        s.scene(None, K(app['story']['lines'][0]))
    parts = []
    hard = HARD_ST.get(Ls['id']) if lv == '도전형' else None      # 도전형 계단은 새 문제
    assert hard is None or len(hard) == len(Ls['steps']), ('도전형 새 문제 수가 계단 수와 달라요', Ls['id'])
    for i, st in enumerate(Ls['steps']):
        if hard:
            h = hard[i]
            step(s, i, K(h[2] if len(h) > 2 else (st['name'] or STEP_NAMES[i])))
            s.text(paper_st(h[0]))
            a = []
            for call in h[1]:
                a += run_call_st(s, lv, call, Ls)
            parts.append('%s %s' % (NUM[i], J(a)))
            continue
        step(s, i, K(st['name'] or STEP_NAMES[i]))
        s.text(paper_st(st['inst']))
        if lv == '기본형':
            t = tip(st['hints'])
            if t:
                s.text(t)
        a = []
        for call in st['calls']:
            a += run_call_st(s, lv, call, Ls)
        parts.append('%s %s' % (NUM[i], J(a)))
    if lv == '도전형':
        n = len(Ls['steps'])
        s.step('%s 도전 계단' % NUM[n], '★ 도전 문제')
        s.text(paper_st(Ls['ch']['inst']))
        a = []
        for call in Ls['ch']['calls']:
            a += run_call_st(s, lv, call, Ls)
        parts.append('%s ★ %s' % (NUM[n], J(a)))
    return '%s차시  ' % Ls['no'] + '  '.join(parts)


def build_st(app, lv):
    s = Sheet(unit_label=LABEL_ST, level=lv, grade_label='6학년')
    lines = [lesson_st(s, lv, Ls, app) for Ls in app['lessons']]
    s.answers('【교사용】 2. 소수의 나눗셈(이야기 버전) 활동지 정답 (%s)' % lv, lines,
              note='※ 이 활동지는 앱 u2-decdiv.html과 차시 번호가 같습니다. 정답의 ‘42/10’은 분수 10분의 42를 뜻해요. '
                   '소수의 끝자리 0은 생략할 수 있어요. ‘1.833…’처럼 …가 있는 몫은 끝없이 이어져요. 글쓰기 칸의 ‘예)’는 예시 답이에요.')
    os.makedirs(OUT_ST, exist_ok=True)
    path = os.path.join(OUT_ST, NAME % lv)
    s.save(path)
    return path


def no_namuji(path):
    """활동지 글에 '나머지'라는 낱말이 없는지(지도서 유의 사항: '나누어 주고 남는 양')"""
    import zipfile
    with zipfile.ZipFile(path) as z:
        sec = z.read('Contents/section0.xml').decode('utf-8')
    return ['‘나머지’라는 낱말이 있어요'] if '나머지' in sec else []



# ================================================================ 도전형 새 문제(2026-10-30)
# 도전형의 계단(⑥ 왜 그럴까요?·도전 계단 앞의 모든 칸)은 기본형과 다른 수·상황으로 새로 씁니다(_build/sheets_hard/BRIEF.md).
# 앱 부품과 같은 꼴로 적어 같은 그리기·채점 코드를 쓰므로, 빈칸 답은 ev()·rnd()로 다시 계산해 맞춥니다(verify_n).
def _N(e, s=False):
    """식 e의 값을 답으로(소수, 끝자리 0 생략)"""
    v = dec(ev(e))
    assert v is not None, e
    d = {'n': v, 'e': e}
    if s:
        d['s'] = 1
    return d


def _V(v, s=False):
    d = {'n': str(v)}
    if s:
        d['s'] = 1
    return d


def _R(e, k):
    """식 e의 몫을 반올림하여 k자리까지"""
    return {'n': fix(rnd(ev(e), k), k), 'r': [e, k]}


def _O(o, a=0):
    return {'o': o, 'a': a}


def _F(n, d):
    return {'f': [str(n), str(d)]}


def _sent(rows, fig=None):
    return {'w': 'sent', 'args': [rows, {'fig': fig} if fig else {}]}


def _long(probs, rows=None, **kw):
    o = {'probs': probs, 'rows': rows or []}
    o.update(kw)
    return {'w': 'long', 'args': [o]}


def _shift(a, b, asks, **kw):
    o = {'items': [{'a': a, 'b': b, 'both': True}], 'asks': asks}
    o.update(kw)
    return {'w': 'shift', 'args': [o]}


def _blanks(*parts):
    return {'w': 'blanks', 'args': [[p if isinstance(p, str) else {'o': p[0], 'a': p[1]} for p in parts]]}


def _quiz(*items, fig=None):
    its = [{'q': q, 'o': o, 'a': a} for q, o, a in items]
    if fig:
        its[0]['fig'] = fig
    return {'w': 'quiz', 'args': [its]}


def _write(*items):
    return {'w': 'writeStep', 'args': [[{'q': q, 'tag': t, 'ph': '예) ' + a, 'ans': a} for t, q, a in items]]}


def _why(q, a):
    return {'w': 'thenWhy', 'args': [{'q': q, 'ans': a}]}


def _rule(q, a):
    return {'w': 'ruleFirst', 'args': [{'q': q, 'ans': a}]}


def _panes(*items):
    return {'w': 'panes', 'args': [[{'t': t, 'ph': ph, 'ex': [ex]} for t, ph, ex in items]]}


def _note(title, lines):
    return {'w': 'append', 'args': [{'note': {'title': title, 'lines': lines}}]}


def _board(cells):
    """놀이판 새 칸: [(식, 반올림 자리|None)] → 미리 풀어 보는 줄"""
    rows = []
    for i, (e, k) in enumerate(cells):
        if k is None:
            rows.append(['%s %s =' % (NUM[i], sp(e)), _N(e)])
        else:
            rows.append(['%s %s → %s까지 반올림:' % (NUM[i], sp(e), PLACE[k]), _R(e, k)])
    return _sent(rows)


HARD_TB = {
    't1': [
        ('“치타는 1시간 동안 약 100 km를 달린대.” “같은 빠르기로 1분 동안에는 약 몇 km를 달릴까?” 물음에 답해 보세요.',
         [_sent([['1시간은', _V(60, True), '분이므로 1분 동안 달리는 거리를 구하는 식은', _O(['60÷100', '100÷60', '100×60'], 1), '이에요.'],
                 ['100÷60의 몫은', _O(['1보다 크고 2보다 작아요', '1보다 작아요', '60보다 커요'], 0), '.'],
                 ['같은 빠르기로 30분 동안 달리는 거리는 100÷2 =', _N('100÷2'), 'km예요.']])]),
        ('이 단원에서 배울 나눗셈을 예로 들었어요. 배우는 차례대로 기호를 써 보세요.',
         [{'w': 'sequence', 'args': [['㉠ 6.3 kg을 2 kg씩 담고 남는 양 구하기', '㉡ 4.8÷0.6 계산하기', '㉢ 7÷3의 몫을 반올림하기', '㉣ 12÷0.4 계산하기'], [1, 3, 2, 0]]}]),
        ('반올림, (소수)÷(자연수), (분수)÷(분수)를 조금 더 어려운 수로 떠올려 보세요.',
         [_sent([['5.749를 반올림하여 소수 둘째 자리까지 나타내면', _R('5.749', 2), '이에요.'],
                 ['9.96을 반올림하여 소수 첫째 자리까지 나타내면', _R('9.96', 1), '이에요.'],
                 ['13.5÷6 =', _N('13.5÷6')],
                 ['[7/12]÷[1/12] = 7÷1 =', _N('7÷1')],
                 ['[2/5]÷[1/10] = [4/10]÷[1/10] = 4÷1 =', _N('4÷1')]])]),
        ('체험관의 다른 로봇을 살펴보고 물음에 답해 보세요.',
         [_quiz(('철 가루를 몇 번 옮겨야 하는지 구하는 식은 무엇일까요?', ['1.2÷4.8', '4.8÷1.2', '4.8−1.2'], 1),
                ('소수의 나눗셈이 필요한 상황을 모두 골라 보세요.', ['주스 2.4 L를 0.3 L씩 컵에 따를 때 몇 컵인지 알아보기', '달리기 기록 12.5초와 13.2초의 차 구하기',
                                                   '3.6 m인 끈은 0.9 m인 끈의 몇 배인지 알아보기', '입장권 두 장의 값 더하기'], [0, 2]),
                fig={'talk': [['은우:', '로봇이 철 가루 4.8 kg을 한 번에 1.2 kg씩 옮기고 있어.'], ['지윤:', '몇 번 옮겨야 다 옮길까?']]})]),
        ('체험관 이야기를 떠올리며 소수의 나눗셈이 쓰이는 상황을 직접 만들어 보세요.',
         [_write(('기술', '체험관에서 본 기술 가운데 소수의 나눗셈이 쓰일 것 같은 것을 하나 골라 까닭과 함께 써 보세요.',
                  '모래 로봇: 모래 몇 kg을 한 번에 몇 kg씩 나르는지 알면 나르는 횟수를 나눗셈으로 구할 수 있어요.'),
                 ('상황 만들기', '0.25 L씩, 1.5 m씩처럼 소수만큼씩 나누는 상황을 하나 만들고 나눗셈식으로 써 보세요.', '물 3 L를 0.25 L씩 컵에 따르면 몇 컵인지: 3÷0.25'))]),
    ],
    't2': [
        ('“로봇이 모래 4.8 kg을 한 번에 0.8 kg씩 실어 나르고 있습니다. 몇 번 실어 날라야 할까요?” 한 칸이 0.1인 막대에서 0.8씩 묶어 보세요.',
         [{'w': 'bars', 'args': [{'n': 48, 'per': 8, 'cell': '0.1', 'step': '0.8', 'asks': [
             ['구하는 식은', _O(['0.8÷4.8', '4.8×0.8', '4.8÷0.8'], 2)],
             ['어림셈: 4.8을 5로, 0.8을 1로 어림하면 5÷1 =', _V(5, True), '이므로 5번쯤이에요.'],
             ['4.8은 0.1이', _V(48, True), '개, 0.8은 0.1이', _V(8, True), '개인 수예요.'],
             ['0.8씩', _N('4.8÷0.8', True), '묶음이므로 모래를', _N('48÷8', True), '번 실어 날라야 해요.']]}]}]),
        ('5.6÷0.7을 56÷7로 바꾸어 계산해 봐요. 두 수의 소수점을 오른쪽으로 옮겨 두 수가 자연수가 되게 해 보세요.',
         [_shift('5.6', '0.7', [['56÷7 =', _N('56÷7'), '이므로 5.6÷0.7 =', _N('5.6÷0.7')],
                                ['0.56÷0.07도 두 수를 각각 100배 하면 56÷7이 되므로 0.56÷0.07 =', _N('0.56÷0.07')]])]),
        ('6.3÷0.9를 세로셈으로 계산하고, 분수의 나눗셈으로도 계산해 보세요.',
         [_long([{'a': '6.3', 'b': '0.9'}], [{'g': '분수의 나눗셈으로 계산하기', 'rows': [['6.3÷0.9 =', _F(63, 10), '÷', _F(9, 10), '= 63÷9 =', _N('63÷9')]]}])]),
        ('4.5÷0.5를 예로 (소수 한 자리 수)÷(소수 한 자리 수)의 계산 방법을 정리해 보세요.',
         [_blanks('4.5÷0.5에서 두 수를 각각 ', (['10배', '100배'], 0), ' 하면 45÷5가 되고, 몫은 ', (['9', '0.9'], 0), '예요. 0.1이 45개인 양에서 0.1이 ',
                  (['5개', '50개'], 0), '씩 덜어 내는 것과 같아요.')]),
        ('세로셈으로 계산해 보세요. 몫이 두 자리 수인 것도 있어요.',
         [_long([{'a': '12.6', 'b': '0.6'}, {'a': '17.1', 'b': '1.9'}], [['28.8÷0.9 =', _N('28.8÷0.9')], ['40.6÷2.9 =', _N('40.6÷2.9')]])]),
    ],
    't3': [
        ('“스마트 신호등 1개를 만드는 데 전선 1.64 m가 필요합니다. 전선 4.92 m로 신호등을 몇 개 만들 수 있을까요?” 수직선에서 1.64 m씩 뛰어 세어 보세요.',
         [{'w': 'line', 'args': [{'to': '4.92', 'step': '1.64', 'max': '5', 'tick': '1', 'unit': 'm', 'sub': {'k': 100, 'unit': 'cm'}, 'asks': [
             ['구하는 식은', _O(['1.64÷4.92', '4.92÷1.64', '4.92×1.64'], 1)],
             ['4.92 m =', _V(492), 'cm, 1.64 m =', _V(164), 'cm이므로 4.92÷1.64 = 492÷164 =', _N('492÷164')],
             ['만들 수 있는 신호등은', _N('4.92÷1.64', True), '개예요.']]}]}]),
        ('6.24÷2.08을 624÷208로 바꾸어 계산해 봐요. 두 수의 소수점을 옮겨 두 수가 모두 자연수가 되게 해 보세요.',
         [_shift('6.24', '2.08', [['624÷208 =', _N('624÷208'), '이므로 6.24÷2.08 =', _N('6.24÷2.08')],
                                  ['두 수를 각각', _O(['10배', '100배'], 1), '했어요.']])]),
        ('8.75÷1.25를 세로셈과 분수의 나눗셈으로 계산해 보세요.',
         [_long([{'a': '8.75', 'b': '1.25'}], [{'g': '분수의 나눗셈으로 계산하기', 'rows': [['8.75÷1.25 =', _F(875, 100), '÷', _F(125, 100), '= 875÷125 =', _N('875÷125')]]}])]),
        ('2.16÷0.27을 예로 (소수 두 자리 수)÷(소수 두 자리 수)의 계산 방법을 정리해 보세요.',
         [_blanks('2.16÷0.27은 두 수를 각각 ', (['100배', '10배'], 0), ' 하여 ', (['216÷27', '21.6÷2.7'], 0), '로 계산해요. 소수점을 한 자리씩만 옮기면 ',
                  (['21.6÷2.7', '216÷27'], 0), '처럼 아직 소수가 남아요.')]),
        ('세로셈으로 계산해 보세요.',
         [_long([{'a': '2.16', 'b': '0.27'}, {'a': '15.36', 'b': '0.48'}], [['7.38÷0.82 =', _N('7.38÷0.82')], ['57.96÷2.76 =', _N('57.96÷2.76')]])]),
    ],
    't4': [
        ('“1초 동안 빨간색 로봇은 7.56 m, 파란색 로봇은 2.8 m 이동했습니다. 빨간색 로봇이 이동한 거리는 파란색 로봇의 몇 배일까요?” 두 수의 소수점을 옮겨 두 수가 모두 자연수가 되게 해 보세요.',
         [_shift('7.56', '2.8', [['몇 배인지 구하는 식은', _O(['2.8÷7.56', '7.56−2.8', '7.56÷2.8'], 2)],
                                 ['어림셈: 7.56을 7.5로, 2.8을 2.5로 어림하면 7.5÷2.5 =', _N('7.5÷2.5', True), '이므로 3배쯤이에요.'],
                                 ['두 수를 각각', _V(100, True), '배 하면 756÷280과 몫이 같아요.']])]),
        ('756÷280을 세로셈으로 계산해 보세요. 몫의 소수점과 0을 내리는 자리에 주의해요.',
         [_long([{'a': '7.56', 'b': '2.8', 'shift': 2}], [['빨간색 로봇이 이동한 거리는 파란색 로봇의', _N('7.56÷2.8'), '배예요.']])]),
        ('7.56÷2.8을 나누는 수만 자연수가 되도록 두 수에 각각 10씩 곱해 75.6÷28로 계산해 보세요.',
         [_long([{'a': '7.56', 'b': '2.8', 'shift': 1}], [{'g': '분수의 나눗셈으로 계산하기', 'rows': [['7.56÷2.8 =', _F(756, 100), '÷', _F(280, 100), '= 756÷280 =', _N('756÷280')]]},
                                                         ['75.6÷28의 몫의 소수점은', _O(['처음 7.56의 소수점 위치에 맞추어 찍어요', '옮긴 75.6의 소수점 위치에 맞추어 찍어요'], 1)]])]),
        ('9.12÷2.4를 예로 (소수 두 자리 수)÷(소수 한 자리 수)의 계산 방법을 정리해 보세요.',
         [_blanks('9.12÷2.4는 나누는 수가 자연수가 되도록 두 수를 각각 ', (['10배', '100배'], 0), ' 하여 ', (['91.2÷24', '912÷24'], 0), '로 계산하면 몫은 ',
                  (['3.8', '38'], 0), '이에요.')]),
        ('세로셈으로 계산해 보세요. 몫의 소수점 위치에 조심해요.',
         [_long([{'a': '6.72', 'b': '0.8'}, {'a': '9.18', 'b': '3.4'}], [['4.68÷0.9 =', _N('4.68÷0.9')], ['11.47÷3.7 =', _N('11.47÷3.7')]])]),
    ],
    't5': [
        ('“길이가 12 cm인 종이를 한 칸의 길이가 1.5 cm가 되도록 똑같이 나누어 접으려고 합니다. 몇 칸으로 접을 수 있을까요?” 종이 그림에 접는 선을 그어 보세요.',
         [{'w': 'fold', 'args': [{'len': '12', 'part': '1.5', 'snap': '0.5', 'unit': 'cm', 'asks': [
             ['구하는 식은', _O(['1.5÷12', '12÷1.5', '12×1.5'], 1)],
             ['어림셈: 1.5를 2로 어림하면 12÷2 =', _N('12÷2', True), '이므로 칸의 수는 6칸보다', _O(['많아요', '적어요'], 0)],
             ['12 cm =', _V(120), 'mm, 1.5 cm =', _V(15), 'mm이므로 120÷15 =', _N('120÷15'), '→ 12÷1.5 =', _N('12÷1.5')]]}]}]),
        ('9÷0.36을 계산해 봐요. 나누어지는 수 9는 9.00처럼 생각할 수 있어요. 두 수의 소수점을 옮겨 두 수가 자연수가 되게 해 보세요.',
         [_shift('9', '0.36', [['900÷36 =', _N('900÷36'), '이므로 9÷0.36 =', _N('9÷0.36')], ['두 수를 각각', _O(['10배', '100배'], 1), '했어요.']])]),
        ('27÷0.45를 세로셈과 분수의 나눗셈으로 계산하고, 8÷1.6을 0.1의 개수로도 생각해 보세요.',
         [_long([{'a': '27', 'b': '0.45'}], [{'g': '분수의 나눗셈으로 계산하기', 'rows': [['27÷0.45 =', _F(2700, 100), '÷', _F(45, 100), '= 2700÷45 =', _N('2700÷45')]]},
                                            {'g': '0.1의 개수로 생각하기: 8÷1.6', 'rows': [['8은 0.1이', _V(80, True), '개, 1.6은 0.1이', _V(16, True), '개이므로 8÷1.6 = 80÷16 =', _N('8÷1.6')]]}])]),
        ('27÷0.45를 예로 (자연수)÷(소수)의 계산 방법을 정리해 보세요.',
         [_blanks('27÷0.45는 나누는 수가 자연수가 되도록 두 수를 각각 ', (['100배', '10배'], 0), ' 하여 ', (['2700÷45', '270÷45'], 0), '로 계산해요. 27을 ',
                  (['27.00', '2.700'], 0), '으로 생각하면 소수점을 두 자리 옮길 수 있어요.')]),
        ('세로셈으로 계산해 보세요.',
         [_long([{'a': '42', 'b': '0.6'}, {'a': '46', 'b': '1.84'}], [['91÷2.6 =', _N('91÷2.6')], ['63÷0.28 =', _N('63÷0.28')]])]),
    ],
    't6': [
        ('“가상 현실 체험관에서 우주 탐험은 11분, 바다 탐험은 7분이 걸립니다. 우주 탐험 시간은 바다 탐험 시간의 약 몇 배일까요?” 11÷7을 세로셈으로 소수 셋째 자리까지 계산해 보세요.',
         [_long([{'a': '11', 'b': '7', 'mode': 'tr', 'places': 3}],
                [['11÷7의 몫은', _O(['곧 나누어떨어져요', '나누어떨어지지 않고 계속 이어져요'], 1)],
                 ['이럴 때는 몫을', _O(['끝까지 모두 써서', '반올림하여'], 1), '나타낼 수 있어요.']])]),
        ('11÷7의 몫 1.571…을 반올림하여 나타내 보세요. 확인할 숫자에 ○표 하고 답을 써요.',
         [{'w': 'round', 'args': [{'items': [{'e': '11÷7', 'to': 0}, {'e': '11÷7', 'to': 1}], 'asks': [
             ['우주 탐험 시간은 바다 탐험 시간의 약', _R('11÷7', 0), '배, 소수 첫째 자리까지 나타내면 약', _R('11÷7', 1), '배예요.']]}]}]),
        ('1.9÷0.7을 세로셈으로 계산하고 몫을 반올림하여 여러 자리로 나타내 보세요.',
         [_long([{'a': '1.9', 'b': '0.7', 'mode': 'tr', 'places': 3}],
                [['일의 자리까지:', _R('1.9÷0.7', 0), ', 소수 첫째 자리까지:', _R('1.9÷0.7', 1), ', 소수 둘째 자리까지:', _R('1.9÷0.7', 2)],
                 ['소수 둘째 자리까지 나타낼 때 확인하는 숫자는', _O(['소수 둘째 자리 숫자 1', '소수 셋째 자리 숫자 4'], 1)]])]),
        ('몫 3.846…을 예로 반올림하는 방법을 정리해 보세요.',
         [_blanks('몫 3.846…을 반올림하여 소수 둘째 자리까지 나타내려면 ', (['소수 셋째 자리', '소수 둘째 자리'], 0), ' 숫자 6을 보고 ', (['올려서', '버려서'], 0), ' ',
                  (['3.85', '3.84'], 0), '로 나타내요.')]),
        ('몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 계산기로 몫을 구해도 돼요.',
         [{'w': 'round', 'args': [{'items': [{'e': '5÷7', 'to': 2}, {'e': '9.4÷3', 'to': 2}, {'e': '4.6÷0.7', 'to': 2}, {'e': '2.39÷9.4', 'to': 2}]}]}]),
    ],
    't7': [
        ('“식물 공장의 로봇이 흙 8.6 kg을 한 통에 3 kg씩 나누어 담고 있습니다. 몇 통까지 담을 수 있고, 남는 흙은 몇 kg일까요?” 수직선에서 3 kg씩 묶어 보세요.',
         [{'w': 'line', 'args': [{'to': '8.6', 'step': '3', 'max': '9', 'tick': '1', 'unit': 'kg', 'rem': '남는 흙', 'asks': [
             ['구하는 식은', _O(['3÷8.6', '8.6×3', '8.6÷3'], 2)],
             ['뺄셈식: 8.6 − 3 − 3 =', _N('8.6−3−3')],
             ['담을 수 있는 통의 수:', _V(2, True), '통, 남는 흙의 양:', _V('2.6'), 'kg']]}]}]),
        ('“주스 15.7 L를 한 사람에게 2.4 L씩 나누어 주려고 합니다. 몇 명까지 줄 수 있고, 남는 주스는 몇 L일까요?” 세로셈으로 계산해 보세요. 몫은 자연수 부분까지만 쓰고, 남는 양을 맨 아래 칸에 써요.',
         [_long([{'a': '15.7', 'b': '2.4', 'mode': 'rem', 'what': '사람 수'}],
                [['나누어 줄 수 있는 사람 수:', _V(6, True), '명, 남는 주스의 양:', _V('1.3'), 'L'], ['계산 확인: 2.4 ×', _V(6, True), '+', _V('1.3'), '=', _N('2.4×6+1.3')]])]),
        ('“길이가 31.26 m인 띠종이를 한 도막에 4.5 m씩 자릅니다. 몇 도막까지 자를 수 있고, 남는 띠종이는 몇 m일까요?” 계산이 맞는지 확인해 보세요.',
         [_long([{'a': '31.26', 'b': '4.5', 'mode': 'rem', 'what': '도막 수'}],
                [['자를 수 있는 도막 수:', _V(6, True), '도막, 남는 띠종이의 길이:', _V('4.26'), 'm'], ['확인: 4.5 × 6 + 4.26 =', _N('4.5×6+4.26')]])]),
        ('19.4÷3.2를 예로 나누어 주고 남는 양을 구하는 방법을 정리해 보세요.',
         [_blanks('19.4÷3.2에서 몫을 자연수 부분까지 구하면 ', (['6', '60'], 0), '이고 남는 양은 ', (['0.2', '2'], 0), '예요. 확인하면 3.2×6+0.2 = ',
                  (['19.4', '19.2'], 0), '예요.')]),
        ('설탕 47.5 kg을 한 봉지에 7 kg씩 나누어 담으려고 해요. 세로셈으로 몇 봉지에 담을 수 있고 남는 설탕은 몇 kg인지 구하고, 물음에 답해 보세요.',
         [_long([{'a': '47.5', 'b': '7', 'mode': 'rem', 'what': '봉지 수'}],
                [['곱셈과 뺄셈으로 확인: 47.5 − 7 × 6 =', _N('47.5−7×6')],
                 ['설탕은', _V(6, True), '봉지에 담을 수 있고, 남는 설탕은', _V('5.5'), 'kg이에요.'],
                 {'q': '리본 41.3 m를 한 모둠에 4.6 m씩 나누어 주려고 해요.',
                  'p': ['4.6 × 8 =', _N('4.6×8'), '이므로', _V(8, True), '모둠까지 나누어 줄 수 있고, 남는 리본은', _N('41.3−4.6×8'), 'm예요.']}])]),
    ],
    't89': [
        ('민영이네 가족은 할머니 댁(361.2 km)에 가요. 연료 1 L로 하이브리드 자동차는 21.5 km를, 휘발유 자동차는 8.6 km를 갈 수 있어요. 하이브리드 자동차를 타면 연료를 몇 L 절약할 수 있을까요?',
         [_quiz(('민영이가 알고 싶은 것은 무엇인가요?', ['두 자동차에 필요한 연료의 양의 차', '할머니 댁까지의 거리', '두 자동차의 빠르기'], 0),
                ('연료 1 L로 휘발유 자동차가 갈 수 있는 거리는 얼마인가요?', ['21.5 km', '8.6 km', '361.2 km'], 1))]),
        ('필요한 연료의 양을 어떻게 구할지 계획해 보세요.',
         [_quiz(('휘발유 자동차에 필요한 연료의 양을 구하는 식은?', ['8.6÷361.2', '361.2×8.6', '361.2÷8.6'], 2),
                ('하이브리드 자동차에 연료가 더 적게 드는 까닭은?', ['연료 1 L로 더 먼 거리를 가서', '할머니 댁이 더 가까워서', '더 빨리 달려서'], 0))]),
        ('하이브리드 자동차가 할머니 댁까지 가는 데 필요한 연료의 양을 구해 보세요. 계산기를 써도 돼요.',
         [{'w': 'fuel', 'args': [{'dist': '361.2', 'per': '21.5', 'car': '하이브리드 자동차', 'place': '할머니 댁', 'asks': [['하이브리드 자동차: 361.2÷21.5 =', _N('361.2÷21.5'), '(L)']]}]}]),
        ('휘발유 자동차에 필요한 연료의 양을 구하고, 연료를 몇 L 절약할 수 있는지 구해 보세요.',
         [{'w': 'fuel', 'args': [{'dist': '361.2', 'per': '8.6', 'car': '휘발유 자동차', 'place': '할머니 댁', 'asks': [
             ['휘발유 자동차: 361.2÷8.6 =', _N('361.2÷8.6'), '(L)'], ['절약할 수 있는 연료: 42 − 16.8 =', _N('42−16.8'), '(L)']]}]}]),
        ('민영이네가 수목원(190.4 km)에 가요. 연료 1 L로 하이브리드 자동차는 23.8 km, 휘발유 자동차는 13.6 km를 가요. 왕복하면 연료를 몇 L 절약할까요?',
         [_sent([['하이브리드 자동차(가는 길): 190.4 ÷ 23.8 =', _N('190.4÷23.8'), '(L)'],
                 ['휘발유 자동차(가는 길): 190.4 ÷ 13.6 =', _N('190.4÷13.6'), '(L)'],
                 ['왕복할 때 절약할 수 있는 연료: (14 − 8) × 2 =', _N('(14−8)×2'), 'L']])], '민영이네 수목원 가는 길'),
        ('문제를 해결한 과정을 되돌아보세요.',
         [_write(('왕복', '왕복으로 다녀오면 절약하는 연료가 편도의 몇 배가 되는지 까닭과 함께 써 보세요.', '2배예요. 거리가 2배가 되니 두 자동차에 필요한 연료도 각각 2배가 되어 차도 2배가 돼요.'),
                 ('실천', '연료를 아끼려고 우리 가족이 할 수 있는 일을 두 가지 써 보세요.', '가까운 곳은 걸어가요. 같은 곳에 가는 이웃과 한 차로 함께 가요.'))]),
    ],
    't10': [
        ('섬나라 여행 놀이의 방법을 떠올리며 답해 보세요(2명, 준비물: 주사위·말·계산기).',
         [_quiz(('상대방은 답이 맞는지 무엇으로 확인하나요?', ['자', '계산기', '주사위'], 1),
                ('반올림 칸에서는 몫을 어떻게 써야 하나요?', ['몫을 끝까지 모두 써요', '자연수 부분만 써요', '칸에 적힌 자리까지 반올림하여 써요'], 2),
                ('놀이는 몇 명이 함께 하나요?', ['2명', '4명', '6명'], 0))]),
        ('놀이판에 나올 만한 문제를 미리 계산해 보세요.',
         [_long([{'a': '9.86', 'b': '3.4'}, {'a': '21', 'b': '0.35'}],
                [['16.32÷4.08 =', _N('16.32÷4.08')], ['9.43÷2.6의 몫을 반올림하여 일의 자리까지 나타내면', _R('9.43÷2.6', 0)],
                 ['25÷0.7의 몫을 반올림하여 소수 첫째 자리까지 나타내면', _R('25÷0.7', 1)]])]),
        ('놀이판 칸의 문제가 새로 바뀌었어요. 새 놀이판의 여덟 칸을 미리 풀어 보세요. 반올림 칸은 적힌 자리까지 나타내요.',
         [_board([('4.5÷0.9', None), ('7.2÷0.8', None), ('6÷1.5', None), ('10.5÷3.5', None), ('1.26÷0.42', None), ('52÷1.3', None), ('8.5÷3.1', 0), ('17÷0.9', 1)])]),
        ('놀이를 되돌아보세요.',
         [_write(('소수점', '놀이판의 나눗셈 가운데 몫의 소수점을 찍을 때 가장 조심해야 했던 문제와 그 까닭을 써 보세요.', '9.86÷3.4는 98.6÷34로 옮겨 계산하므로 몫의 소수점을 98.6의 소수점에 맞추어 찍어야 해요.'),
                 ('말하기', '친구의 계산이 틀렸을 때 기분 좋게 알려 주는 말을 써 보세요.', '“소수점 자리를 한 번 더 확인해 볼까? 나도 아까 헷갈렸어.”'))]),
    ],
    't11': [
        ('자연수의 나눗셈과 분수의 나눗셈을 이용하여 계산해 보세요.',
         [_sent([['7.2÷0.6: 각각 10배 → 72÷6 =', _N('72÷6'), '→ 7.2÷0.6 =', _N('7.2÷0.6')],
                 ['3.12÷0.52: 각각 100배 → 312÷52 =', _N('312÷52'), '→ 3.12÷0.52 =', _N('3.12÷0.52')],
                 ['⑴ 27÷4.5 =', _F(270, 10), '÷', _F(45, 10), '= 270÷45 =', _N('27÷4.5')],
                 ['⑵ 18÷0.72 =', _F(1800, 100), '÷', _F(72, 100), '= 1800÷72 =', _N('18÷0.72')]])]),
        ('세로셈으로 계산해 보세요.',
         [_long([{'a': '3.42', 'b': '0.18'}, {'a': '7.98', 'b': '4.2'}], [['40.8÷5.1 =', _N('40.8÷5.1'), ', 42÷1.75 =', _N('42÷1.75')]])]),
        ('몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 세로셈으로 소수 셋째 자리까지 계산해요.',
         [_long([{'a': '11', 'b': '6.3', 'mode': 'tr', 'places': 3}, {'a': '2.37', 'b': '1.9', 'mode': 'tr', 'places': 3}],
                [['11÷6.3 → 약', _R('11÷6.3', 2), ', 2.37÷1.9 → 약', _R('2.37÷1.9', 2)]])]),
        ('은채가 쓴 토마토 관찰 일지예요. 9월 5일: 잎 6장, 줄기 길이 12.5 cm / 9월 20일: 잎 15장, 줄기 길이는 9월 5일의 □배인 20.75 cm. □ 안에 알맞은 수를 구해 보세요.',
         [_sent([['9월 5일 줄기의 길이는', _V('12.5'), 'cm, 9월 20일 줄기의 길이는', _V('20.75'), 'cm예요.'],
                 ['문제를 푸는 데 필요 없는 정보는', _O(['줄기의 길이', '잎의 수'], 1)],
                 ['식: 20.75 ÷ 12.5 =', _N('20.75÷12.5'), '→ □ =', _V('1.66')]])]),
        ('“털실 31.6 m를 한 사람에게 5.2 m씩 나누어 줍니다.” 친구의 계산: 52)316 → 몫 6, 312, 4 → “6명, 남는 털실 4 m” 잘못된 곳을 찾아 옳게 계산해 보세요.',
         [_long([{'a': '31.6', 'b': '5.2', 'mode': 'rem', 'what': '사람 수'}],
                [['잘못된 까닭:', _O(['몫을 자연수 부분까지만 구했어요', '남는 양의 소수점을 31.6의 소수점 위치에 맞추어 찍지 않았어요'], 1)],
                 ['옳게 계산하면: 사람 수', _V(6, True), '명, 남는 털실', _V('0.4'), 'm'], ['확인: 5.2 × 6 + 0.4 =', _N('5.2×6+0.4')]])]),
        ('세로셈으로 계산하고, 빈칸을 채우며 배운 내용을 정리해 보세요.',
         [_long([{'a': '3.15', 'b': '0.45'}, {'a': '8.32', 'b': '2.6'}, {'a': '18', 'b': '2.4'}],
                [['두 수를 똑같이 10배 또는 100배 해도 몫은', _O(['커져요', '작아져요', '같아요'], 2)],
                 ['3.5÷9의 몫을 반올림하여 소수 첫째 자리까지 나타내면', _R('3.5÷9', 1), '이에요.']])]),
        ('이 단원에서 배운 내용을 돌아보며 정리해 보세요.',
         [_write(('자기 평가', '이 단원에서 가장 자신 있는 계산과 아직 헷갈리는 계산을 하나씩 골라 예를 들어 써 보세요.', '자신 있는 것: 4.8÷0.6 = 8 / 헷갈리는 것: 남는 양의 소수점 찍기'),
                 ('정리', '(소수)÷(소수)와 (자연수)÷(소수)의 같은 점을 한 문장으로 정리해 보세요.', '두 수를 똑같이 10배 또는 100배 하여 나누는 수를 자연수로 만들어 계산해요.'))]),
    ],
}

HARD_ST = {
    's1': [
        ('축제 둘째 날 준비 쪽지가 새로 왔어요. 쪽지를 보고, 세 칸에 내 생각을 써 보세요.',
         [_note('🎪 나눔 축제 둘째 날 준비 쪽지', ['🍪 쿠키 가게: 반죽 3.6 kg을 0.45 kg씩 나누어 굽기', '🎈 풍선 가게: 끈 10.5 m를 0.7 m씩 자르기',
                                           '🏃 달리기 부스: 민호 8.4초, 지수 10.5초', '🧃 식혜 18 L를 2.4 L들이 통에 나누어 담기']),
          _panes(('보여요', '쪽지에서 ~ 같은 나눗셈이 보여요', '반죽 3.6 kg을 0.45 kg씩 나누는 것처럼 소수 두 자리 수로 나누는 일이 보여요.'),
                 ('생각해요', '~은 몫이 자연수가 아닐 것 같아요', '식혜 18 L를 2.4 L씩 담으면 통에 딱 맞게 나누어지지 않을 것 같아요.'),
                 ('궁금해요', '~÷~의 몫은 어떻게 구할까?', '18÷2.4처럼 자연수를 소수로 나눈 몫은 어떻게 구할까?'))]),
        ('둘째 날 쪽지의 일을 나눗셈식으로 나타내고, 어떤 꼴의 나눗셈인지 골라 보세요.',
         [_sent([['쿠키 반죽:', _O(['0.45÷3.6', '3.6÷0.45', '3.6×0.45'], 1), '→', _O(['(소수)÷(소수)', '(자연수)÷(소수)'], 0)],
                 ['지수의 기록은 민호 기록의 몇 배인가요?', _O(['8.4÷10.5', '10.5÷8.4', '10.5−8.4'], 1), '→', _O(['(소수)÷(소수)', '(자연수)÷(소수)'], 0)],
                 ['식혜를 담을 통의 수:', _O(['18÷2.4', '2.4÷18', '18×2.4'], 0), '→', _O(['(소수)÷(소수)', '(자연수)÷(소수)'], 1)]]),
          _why('지수의 기록이 민호 기록의 몇 배인지 구할 때 10.5를 나누어지는 수로 하는 까닭은 무엇일까요?',
               '지수의 기록(10.5초)이 민호 기록(8.4초)의 몇 배인지 묻는 것이라서, 견주는 기록 10.5를 기준이 되는 기록 8.4로 나누어요.')]),
        ('반올림, (소수)÷(자연수), (분수)÷(분수)를 조금 더 어려운 수로 떠올려 보세요.',
         [_sent([['6.351을 반올림하여 소수 둘째 자리까지 나타내면', _R('6.351', 2), '이에요.'],
                 ['0.96을 반올림하여 소수 첫째 자리까지 나타내면', _R('0.96', 1), '이에요.'],
                 ['9.6÷4 =', _N('9.6÷4')],
                 ['[12/100]÷[3/100] = 12÷3 =', _N('12÷3')],
                 ['[3/5]÷[1/10] = [6/10]÷[1/10] = 6÷1 =', _N('6÷1')]])]),
        ('둘째 날 쪽지로 만든 나눗셈이에요. 이 단원에서 배우는 차례대로 기호를 써 보세요.',
         [{'w': 'sequence', 'args': [['㉠ 18÷2.4로 식혜 통 수 구하기', '㉡ 3.6÷0.45로 쿠키 수 구하기', '㉢ 식혜 19 L를 2.4 L씩 담고 남는 양 구하기', '㉣ 10÷3.7의 몫을 반올림하기'], [1, 0, 3, 2]]}],
         '약속하기 — 배울 차례 정하기'),
        ('정확하게 계산하기 전에 어림해 보세요. 둘째 날 쪽지의 답은 대략 얼마쯤일까요?',
         [_quiz(('반죽 3.6 kg을 0.45 kg씩 나누어 구우면 쿠키 반죽은 약 몇 덩이일까요?', ['약 0.8덩이', '약 8덩이', '약 80덩이'], 1),
                ('끈 10.5 m를 0.7 m씩 자르면 약 몇 도막일까요?', ['약 150도막', '약 1.5도막', '약 15도막'], 2),
                ('식혜 18 L를 2.4 L씩 담으면 통은 약 몇 개가 필요할까요?', ['약 8통', '약 80통', '약 0.8통'], 0))]),
    ],
    's2': [
        ('도현이는 레몬청 5.4 L를 0.9 L들이 병에 나누어 담으려고 해요. 병은 몇 개 필요할까요? 먼저 규칙을 예상하고, 한 칸이 0.1 L인 막대를 0.9 L씩 묶어 보세요.',
         [_rule('5.4÷0.9를 0.1의 개수로 생각하면 어떤 자연수의 나눗셈이 될까요?', '5.4는 0.1이 54개, 0.9는 0.1이 9개라서 54÷9와 몫이 같아요. 몫은 6이에요.'),
          {'w': 'bars', 'args': [{'n': 54, 'per': 9, 'cell': '0.1', 'step': '0.9', 'asks': [
              ['병의 수를 구하는 식은', _O(['0.9÷5.4', '5.4÷0.9', '5.4×0.9'], 1)],
              ['어림하기: 0.9 L씩 5병이면', _N('0.9×5'), 'L, 10병이면', _N('0.9×10'), 'L이므로 병의 수는', _O(['5병보다 적어요', '5병과 10병 사이예요'], 1)],
              ['5.4는 0.1이', _V(54, True), '개, 0.9는 0.1이', _V(9, True), '개인 수예요.'],
              ['0.9씩', _N('5.4÷0.9', True), '묶음이므로 병이', _N('54÷9', True), '개 필요해요.']]}]}], '만져 보기 — 레몬청 5.4 L'),
        ('7.2÷0.8을 72÷8로 바꾸어 계산해 봐요. 두 수의 소수점을 오른쪽으로 옮겨 두 수가 자연수가 되게 해 보세요.',
         [_shift('7.2', '0.8', [['72÷8 =', _N('72÷8'), '이므로 7.2÷0.8 =', _N('7.2÷0.8')]]),
          _why('7.2÷0.8과 72÷8의 몫이 같은지 곱셈으로 확인해 보세요.', '0.8×9 = 7.2이고 8×9 = 72라서 두 나눗셈의 몫은 모두 9예요.')], '그려 보기 — 소수점을 옮겨 72÷8로'),
        ('9.1÷1.3을 세로셈으로 계산하고, 분수의 나눗셈으로도 계산해 보세요.',
         [_long([{'a': '9.1', 'b': '1.3'}], [{'g': '분수의 나눗셈으로 계산하기', 'rows': [['9.1÷1.3 =', _F(91, 10), '÷', _F(13, 10), '= 91÷13 =', _N('91÷13')]]},
                                            ['몫 7은', _O(['소수 한 자리 수예요', '자연수예요'], 1)]])]),
        ('3.5÷0.7을 예로 (소수 한 자리 수)÷(소수 한 자리 수)의 계산 방법을 정리해 보세요.',
         [_blanks('3.5÷0.7에서 두 수를 각각 ', (['10배', '100배'], 0), ' 하면 ', (['35÷7', '3.5÷7'], 0), '이 되고, 분수로 나타내면 ',
                  (['[35/10]÷[7/10]', '[35/100]÷[7/100]'], 0), '예요.')]),
        ('포도에이드 가게 준비물을 계산해 보세요. 포도 6.4 kg을 0.8 kg씩 봉지에, 사이다 10.8 L를 1.2 L씩 병에 나누어 담아요.',
         [_long([{'a': '6.4', 'b': '0.8', 'cap': '포도 6.4 ÷ 0.8'}, {'a': '10.8', 'b': '1.2', 'cap': '사이다 10.8 ÷ 1.2'}],
                [['얼음 32.4 kg을 0.9 kg씩: 32.4÷0.9 =', _N('32.4÷0.9')], ['설탕 15.3 kg을 1.7 kg씩: 15.3÷1.7 =', _N('15.3÷1.7')]])], '확인하기 — 포도에이드 가게 준비'),
    ],
    's3': [
        ('꽃다발 하나를 묶는 데 리본 끈 1.56 m를 써요. 리본 끈 6.24 m로 꽃다발을 몇 다발 묶을 수 있을까요? 먼저 규칙을 예상하고, 수직선에서 1.56 m씩 뛰어 세어 보세요.',
         [_rule('6.24 m와 1.56 m를 cm로 바꾸어 나누면 몫이 달라질까요?', '6.24 m=624 cm, 1.56 m=156 cm라서 624÷156=4예요. 두 수를 똑같이 100배 한 것이라 몫은 같아요.'),
          {'w': 'line', 'args': [{'to': '6.24', 'step': '1.56', 'max': '7', 'tick': '1', 'unit': 'm', 'sub': {'k': 100, 'unit': 'cm'}, 'asks': [
              ['꽃다발 수를 구하는 식은', _O(['1.56÷6.24', '6.24×1.56', '6.24÷1.56'], 2)],
              ['어림하기: 1.56 m를 1.5 m로 보면 1.5×4 =', _N('1.5×4'), '이므로 4다발쯤 될 것 같아요.'],
              ['6.24 m =', _V(624), 'cm, 1.56 m =', _V(156), 'cm이므로 6.24÷1.56 = 624÷156 =', _N('624÷156')]]}]}], '만져 보기 — 리본 끈 6.24 m'),
        ('5.04÷1.68을 504÷168로 바꾸어 계산해 봐요. 두 수의 소수점을 옮겨 두 수가 모두 자연수가 되게 해 보세요.',
         [_shift('5.04', '1.68', [['504÷168 =', _N('504÷168'), '이므로 5.04÷1.68 =', _N('5.04÷1.68')]]),
          _why('5.04÷1.68을 50.4÷16.8로 바꾸면 자연수의 나눗셈이 될까요? 까닭과 함께 써 보세요.',
               '아니요. 50.4÷16.8은 아직 두 수가 모두 소수라서, 두 자리씩 옮긴 504÷168로 계산해야 자연수의 나눗셈이 돼요.')]),
        ('7.65÷2.55를 세로셈과 분수의 나눗셈으로 계산해 보세요.',
         [_long([{'a': '7.65', 'b': '2.55'}], [{'g': '분수의 나눗셈으로 계산하기', 'rows': [['7.65÷2.55 =', _F(765, 100), '÷', _F(255, 100), '= 765÷255 =', _N('765÷255')]]},
                                              ['몫이 맞는지 확인하는 곱셈은', _O(['7.65×3 = 22.95', '2.55×3 = 7.65'], 1)]])]),
        ('0.96÷0.24를 예로 (소수 두 자리 수)÷(소수 두 자리 수)의 계산 방법을 정리해 보세요.',
         [_blanks('0.96÷0.24는 두 수를 각각 ', (['100배', '10배'], 0), ' 하면 ', (['96÷24', '9.6÷2.4'], 0), '가 되어 몫은 ', (['4', '0.4'], 0), '예요.')]),
        ('꽃다발 가게 준비물을 계산해 보세요. 포장지 3.12 m를 0.52 m씩, 철사 21.84 m를 1.82 m씩 잘라요.',
         [_long([{'a': '3.12', 'b': '0.52', 'cap': '포장지 3.12 ÷ 0.52'}, {'a': '21.84', 'b': '1.82', 'cap': '철사 21.84 ÷ 1.82'}],
                [['8.64÷0.36 =', _N('8.64÷0.36')], ['38.22÷1.47 =', _N('38.22÷1.47')]])]),
    ],
    's4': [
        ('종이비행기 부스에서 건우의 비행기는 8.64 m, 소율이의 비행기는 3.2 m를 날았어요. 건우의 비행기가 난 거리는 소율이 비행기의 몇 배일까요? 먼저 예상하고, 두 수의 소수점을 옮겨 보세요.',
         [_rule('8.64÷3.2를 자연수의 나눗셈으로 바꾸려면 두 수를 각각 몇 배 해야 할까요?', '8.64가 소수 두 자리 수라서 두 수를 각각 100배 하면 864÷320이 되고, 몫은 8.64÷3.2와 같아요.'),
          _shift('8.64', '3.2', [['몇 배인지 구하는 식은', _O(['3.2÷8.64', '8.64÷3.2', '8.64−3.2'], 1)],
                                 ['어림하기: 8.64를 9로, 3.2를 3으로 어림하면 9÷3 =', _N('9÷3', True), '이므로 3배쯤이에요.'],
                                 ['두 수를 각각', _V(100, True), '배 하면 864÷320과 몫이 같아요.']],
                 fig={'plane': [['8.64', '건우', '#C8472E'], ['3.2', '소율', '#2B7BD6']]})]),
        ('864÷320을 세로셈으로 계산해 보세요. 864=864.0이므로 소수점을 찍은 뒤 0을 내려요.',
         [_long([{'a': '8.64', 'b': '3.2', 'shift': 2}], [['건우의 비행기가 난 거리는 소율이 비행기가 난 거리의', _N('8.64÷3.2'), '배예요.'],
                                                       ['어림한 3배와', _O(['많이 달라요', '비슷해요'], 1)]])], '그려 보기 — 864÷320을 세로셈으로'),
        ('이번에는 나누는 수만 자연수가 되도록 두 수에 각각 10씩 곱해 86.4÷32로 계산해 보세요.',
         [_long([{'a': '8.64', 'b': '3.2', 'shift': 1}], [{'g': '분수의 나눗셈으로 계산하기', 'rows': [['8.64÷3.2 =', _F(864, 100), '÷', _F(320, 100), '= 864÷320 =', _N('864÷320')]]}]),
          _why('86.4÷32의 몫 2.7에 32를 곱해 계산이 맞는지 확인해 보세요.', '32×2.7 = 86.4이므로 맞아요. 그래서 8.64÷3.2의 몫도 2.7이에요.')]),
        ('6.48÷1.8을 예로 (소수 두 자리 수)÷(소수 한 자리 수)의 계산 방법을 정리해 보세요.',
         [_blanks('6.48÷1.8은 두 수를 각각 ', (['10배', '100배'], 0), ' 하여 ', (['64.8÷18', '648÷18'], 0), '로 계산하면 몫은 ', (['3.6', '36'], 0), '이에요.')]),
        ('종이비행기 부스에서 나온 나눗셈을 계산해 보세요. 몫의 소수점 위치에 조심해요.',
         [_long([{'a': '9.88', 'b': '2.6'}, {'a': '4.35', 'b': '0.5'}], [['7.98÷2.1 =', _N('7.98÷2.1')], ['5.76÷1.8 =', _N('5.76÷1.8')]])]),
    ],
    's5': [
        ('지아는 길이가 12 cm인 종이를 한 칸이 1.5 cm가 되도록 병풍처럼 접어 초대장을 만들려고 해요. 먼저 예상하고, 종이 그림에 접는 선을 그어 보세요.',
         [_rule('12÷1.5도 두 수를 각각 10배 해서 계산할 수 있을까요?', '12÷1.5에서 두 수를 각각 10배 하면 120÷15가 되고 몫 8은 같아요.'),
          {'w': 'fold', 'args': [{'len': '12', 'part': '1.5', 'snap': '0.5', 'unit': 'cm', 'asks': [
              ['몇 칸으로 접을 수 있는지 구하는 식은', _O(['1.5÷12', '12÷1.5', '12×1.5'], 1)],
              ['어림하기: 한 칸이 1 cm이면 12칸, 2 cm이면', _N('12÷2'), '칸이므로, 1.5 cm이면 칸의 수는', _O(['12칸보다 많아요', '6칸과 12칸 사이예요'], 1)],
              ['12 cm =', _V(120), 'mm, 1.5 cm =', _V(15), 'mm이므로 120÷15 =', _N('120÷15')]]}]}]),
        ('초대장을 묶을 끈 9 m를 0.75 m씩 잘라요. 9를 9.00으로 생각하고 두 수의 소수점을 옮겨 두 수가 자연수가 되게 해 보세요.',
         [_shift('9', '0.75', [['900÷75 =', _N('900÷75'), '이므로 9÷0.75 =', _N('9÷0.75')]]),
          _why('9÷0.75의 몫 12가 9보다 큰 까닭을 써 보세요.', '나누는 수 0.75가 1보다 작아서, 9에서 0.75를 9번보다 많이 덜어 낼 수 있기 때문이에요.')], '그려 보기 — 9를 9.00으로'),
        ('15÷0.6을 세로셈과 분수의 나눗셈으로 계산해 보세요. 그리고 7÷1.4를 0.1의 개수로도 생각해 보세요.',
         [_long([{'a': '15', 'b': '0.6'}], [{'g': '분수의 나눗셈으로 계산하기', 'rows': [['15÷0.6 =', _F(150, 10), '÷', _F(6, 10), '= 150÷6 =', _N('150÷6')]]},
                                           {'g': '0.1의 개수로 생각하기: 7÷1.4', 'rows': [['7은 0.1이', _V(70, True), '개, 1.4는 0.1이', _V(14, True), '개이므로 7÷1.4 = 70÷14 =', _N('7÷1.4')]]}])]),
        ('12÷0.48을 예로 (자연수)÷(소수)의 계산 방법을 정리해 보세요.',
         [_blanks('12÷0.48은 나누는 수가 자연수가 되도록 두 수를 각각 ', (['100배', '10배'], 0), ' 하여 ', (['1200÷48', '120÷48'], 0), '로 계산해요. 몫은 ',
                  (['25', '2.5'], 0), '예요.')]),
        ('초대장 만들기 재료를 계산해 보세요. 색 띠 36 m를 0.9 m씩, 은박 테이프 39 m를 1.56 m씩 잘라요.',
         [_long([{'a': '36', 'b': '0.9', 'cap': '색 띠 36 ÷ 0.9'}, {'a': '39', 'b': '1.56', 'cap': '은박 테이프 39 ÷ 1.56'}],
                [['96÷3.2 =', _N('96÷3.2')], ['81÷0.54 =', _N('81÷0.54')]])]),
    ],
    's6': [
        ('연습에서 레모네이드 한 통을 만드는 데 서윤이네 모둠은 13분, 도현이네 모둠은 7분이 걸렸어요. 서윤이네가 걸린 시간은 도현이네의 약 몇 배일까요? 13÷7을 소수 셋째 자리까지 계산해 보세요.',
         [_long([{'a': '13', 'b': '7', 'mode': 'tr', 'places': 3}],
                [['13÷7의 몫은', _O(['곧 나누어떨어져요', '나누어떨어지지 않고 계속 이어져요'], 1)],
                 ['그래서 몫을', _O(['반올림하여', '버리지 않고 모두 써서'], 0), '나타내요.']])]),
        ('13÷7의 몫 1.857…을 반올림하여 나타내 보세요. 확인할 숫자에 ○표 하고 답을 써요.',
         [{'w': 'round', 'args': [{'items': [{'e': '13÷7', 'to': 0}, {'e': '13÷7', 'to': 1}], 'asks': [
             ['서윤이네가 걸린 시간은 도현이네의 약', _R('13÷7', 0), '배, 소수 첫째 자리까지 나타내면 약', _R('13÷7', 1), '배예요.']]}]},
          _why('13÷7의 몫을 소수 첫째 자리까지 나타낼 때 1.8이 아니라 1.9가 되는 까닭을 써 보세요.', '확인할 소수 둘째 자리 숫자가 5이므로 올려서 1.9가 돼요.')]),
        ('레몬청 3.1 L는 한 번에 쓰는 0.9 L의 약 몇 배일까요? 3.1÷0.9를 세로셈으로 계산하고 몫을 반올림하여 나타내 보세요.',
         [_long([{'a': '3.1', 'b': '0.9', 'mode': 'tr', 'places': 3}],
                [['일의 자리까지:', _R('3.1÷0.9', 0), ', 소수 첫째 자리까지:', _R('3.1÷0.9', 1), ', 소수 둘째 자리까지:', _R('3.1÷0.9', 2)],
                 ['소수 둘째 자리까지 나타낼 때 확인하는 숫자는', _O(['소수 둘째 자리 숫자 4', '소수 셋째 자리 숫자 4'], 1)]])], '말해 보기 — 3.1÷0.9를 여러 자리로'),
        ('몫 2.357…을 예로 반올림하는 방법을 정리해 보세요.',
         [_blanks('몫 2.357…을 반올림하여 소수 첫째 자리까지 나타내려면 ', (['소수 둘째 자리', '소수 첫째 자리'], 0), ' 숫자 5를 보고 ', (['올려서', '버려서'], 0), ' ',
                  (['2.4', '2.3'], 0), '로 나타내요.')]),
        ('몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 계산기로 몫을 구해도 돼요.',
         [{'w': 'round', 'args': [{'items': [{'e': '4÷7', 'to': 2}, {'e': '8.3÷6', 'to': 2}, {'e': '6.2÷0.9', 'to': 2}, {'e': '3.58÷11.4', 'to': 2}]}]}]),
    ],
    's7': [
        ('축제 날 아침, 설탕 9.5 kg을 한 통에 3 kg씩 나누어 담아요. 3 kg씩 몇 통까지 담을 수 있고, 남는 설탕은 몇 kg일까요? 먼저 예상하고, 수직선에서 3 kg씩 뛰어 세어 보세요.',
         [_rule('통의 수를 3.16…통처럼 쓰면 어떤 문제가 생길까요?', '통의 수는 자연수로만 셀 수 있어요. 그래서 3통까지 담고 남는 설탕 0.5 kg을 따로 구해요.'),
          {'w': 'line', 'args': [{'to': '9.5', 'step': '3', 'max': '10', 'tick': '1', 'unit': 'kg', 'rem': '남는 설탕', 'asks': [
              ['구하는 식은', _O(['3÷9.5', '9.5÷3', '9.5×3'], 1)],
              ['뺄셈식: 9.5 − 3 − 3 − 3 =', _N('9.5−3−3−3')],
              ['담을 수 있는 통의 수:', _V(3, True), '통, 남는 설탕의 양:', _V('0.5'), 'kg']]}]}]),
        ('레모네이드 17.8 L를 2.3 L들이 주전자에 가득 나누어 담으려고 해요. 몇 주전자까지 담을 수 있고, 남는 레모네이드는 몇 L일까요? 세로셈으로 계산해 보세요.',
         [_long([{'a': '17.8', 'b': '2.3', 'mode': 'rem', 'what': '주전자 수'}],
                [['담을 수 있는 주전자 수:', _V(7, True), '주전자, 남는 레모네이드의 양:', _V('1.7'), 'L'], ['계산 확인: 2.3 ×', _V(7, True), '+', _V('1.7'), '=', _N('2.3×7+1.7')]]),
          _why('남는 레모네이드 1.7 L가 2.3 L보다 작아야 하는 까닭을 써 보세요.', '남는 양이 2.3 L보다 크거나 같으면 주전자 하나를 더 가득 채울 수 있기 때문이에요.')]),
        ('하준이는 길이가 31.48 m인 장식 띠를 한 도막에 5.2 m씩 잘라요. 몇 도막까지 자를 수 있고, 남는 장식 띠는 몇 m일까요? 계산이 맞는지 확인해 보세요.',
         [_long([{'a': '31.48', 'b': '5.2', 'mode': 'rem', 'what': '도막 수'}],
                [['자를 수 있는 도막 수:', _V(6, True), '도막, 남는 장식 띠의 길이:', _V('0.28'), 'm'], ['확인: 5.2 × 6 + 0.28 =', _N('5.2×6+0.28')]])]),
        ('23.6÷4.5를 예로 나누어 주고 남는 양을 구하는 방법을 정리해 보세요.',
         [_blanks('23.6÷4.5에서 몫을 자연수 부분까지 구하면 ', (['5', '50'], 0), '이고 남는 양은 ', (['1.1', '11'], 0), '이에요. 확인하면 4.5×5+1.1 = ',
                  (['23.6', '24.1'], 0), '이에요.')]),
        ('팝콘용 옥수수 25.4 kg을 한 봉지에 4 kg씩 나누어 담으려고 해요. 세로셈으로 몇 봉지에 담을 수 있고 남는 옥수수는 몇 kg인지 구하고, 물음에 답해 보세요.',
         [_long([{'a': '25.4', 'b': '4', 'mode': 'rem', 'what': '봉지 수'}],
                [['곱셈과 뺄셈으로 확인: 25.4 − 4 × 6 =', _N('25.4−4×6')],
                 ['옥수수는', _V(6, True), '봉지에 담을 수 있고, 남는 옥수수는', _V('1.4'), 'kg이에요.'],
                 {'q': '색 테이프 38.5 m를 한 모둠에 4.2 m씩 나누어 주려고 해요.',
                  'p': ['4.2 × 9 =', _N('4.2×9'), '이므로', _V(9, True), '모둠까지 나누어 줄 수 있고, 남는 색 테이프는', _N('38.5−4.2×9'), 'm예요.']}])]),
    ],
    's8': [
        ('축제에 쓸 설탕과 레몬을 사러 가게 두 곳의 전단지를 다시 모아 왔어요. 쪽지를 읽고 물음에 답해 보세요.',
         [_note('🛒 축제 장보기 쪽지 (둘째 날)', ['가 가게: 설탕 2.5 kg 한 봉지 5750원 · 레몬 1.25 kg 한 상자 5500원',
                                            '나 가게: 설탕 0.8 kg 한 봉지 2000원 · 레몬 0.6 kg 한 봉지 2400원',
                                            '하준: “가 가게 레몬은 한 상자에 5500원이라 더 비싸겠다!” 서윤: “무게가 다르니 1 kg의 값으로 견주어 보자.”']),
          _quiz(('하준이처럼 상자 값만 보고 정하면 안 되는 까닭은?', ['가게가 멀어서요', '상자와 봉지의 무게가 달라서요'], 1),
                ('공평하게 견주려면 무엇을 구할까요?', ['봉지의 수', '가게까지의 거리', '1 kg의 값'], 2))]),
        ('설탕 1 kg의 값을 구하는 식을 세워 보세요.',
         [_sent([['가 가게 설탕 1 kg의 값을 구하는 식은', _O(['2.5÷5750', '5750÷2.5', '5750×2.5'], 1)],
                 ['나 가게 설탕 1 kg의 값을 구하는 식은', _O(['2000÷0.8', '0.8÷2000', '2000−0.8'], 0)]]),
          _why('설탕 0.8 kg이 2000원이면 1 kg의 값은 2000원보다 많을까요, 적을까요? 까닭과 함께 써 보세요.', '많아요. 1 kg은 0.8 kg보다 무거우니 값도 더 비싸요. 2000÷0.8 = 2500(원)이에요.')]),
        ('가 가게 설탕 1 kg의 값을 구하고, 2.5 kg의 값이 5750원과 맞는지 표에 써서 확인해 보세요.',
         [{'w': 'unit', 'args': [{'total': '5750', 'qty': '2.5', 'unit': 'kg', 'item': '가 가게 설탕', 'step': 50, 'asks': [['가 가게 설탕 1 kg의 값: 5750÷2.5 =', _N('5750÷2.5'), '(원)']]}]}]),
        ('나 가게 설탕 1 kg의 값도 구하고, 어느 가게 설탕이 더 알뜰한지 정해 보세요.',
         [{'w': 'unit', 'args': [{'total': '2000', 'qty': '0.8', 'unit': 'kg', 'item': '나 가게 설탕', 'step': 50, 'asks': [
             ['나 가게 설탕 1 kg의 값: 2000÷0.8 =', _N('2000÷0.8'), '(원)'],
             ['1 kg의 값이 더 싼 곳은', _O(['나 가게', '가 가게'], 1), '이고, 1 kg에', _N('2500−2300'), '원 더 싸요.']]}]}], '약속하기 — 나 가게 설탕과 견주기'),
        ('레몬도 견주어 보세요. 가 가게는 1.25 kg에 5500원, 나 가게는 0.6 kg에 2400원이에요. 계산기를 써도 돼요.',
         [_sent([['가 가게 레몬 1 kg: 5500 ÷ 1.25 =', _N('5500÷1.25'), '(원)'], ['나 가게 레몬 1 kg: 2400 ÷ 0.6 =', _N('2400÷0.6'), '(원)'],
                 ['레몬은', _O(['가 가게', '나 가게'], 1), '에서 사는 것이 더 알뜰해요.']])]),
        ('알뜰하게 재료를 산 과정을 되돌아보세요.',
         [_write(('견주기', '설탕과 레몬에서 더 알뜰한 가게가 서로 다른 까닭을 써 보세요.', '1 kg의 값을 견주면 설탕은 가 가게(2300원)가, 레몬은 나 가게(4000원)가 더 싸기 때문이에요. 물건마다 따로 견주어야 해요.'),
                 ('생활', '1 L의 값을 견주어 볼 만한 물건을 하나 골라 견주는 식을 예로 써 보세요.', '1.5 L에 3000원인 주스와 0.5 L에 1200원인 주스: 3000÷1.5 = 2000(원), 1200÷0.5 = 2400(원)으로 견주어요.'))]),
    ],
    's9': [
        ('부스 운영 계획서를 써요. 레모네이드 원액 7.2 L로 한 잔에 0.48 L씩 넣으면 몇 잔을 만들 수 있는지 세로셈으로 계산해 보세요.',
         [_long([{'a': '7.2', 'b': '0.48', 'cap': '원액 7.2 ÷ 0.48'}], [['레모네이드를', _N('7.2÷0.48', True), '잔 만들 수 있어요.']])]),
        ('얼음 11.3 kg을 아이스박스 한 통에 2.4 kg씩 나누어 담으려고 해요. 몇 통까지 담을 수 있고, 남는 얼음은 몇 kg일까요?',
         [_long([{'a': '11.3', 'b': '2.4', 'mode': 'rem', 'what': '통의 수'}],
                [['아이스박스', _V(4, True), '통에 담고, 남는 얼음은', _V('1.7'), 'kg이에요.'], ['확인: 2.4 × 4 + 1.7 =', _N('2.4×4+1.7')]])]),
        ('지난해 레모네이드 부스는 27.5 L를 팔았고, 올해 목표는 40 L예요. 올해 목표는 지난해 판매량의 약 몇 배일까요? 몫을 반올림하여 소수 첫째 자리까지 나타내 보세요.',
         [{'w': 'round', 'args': [{'items': [{'e': '40÷27.5', 'to': 1}], 'asks': [['올해 목표는 지난해 판매량의 약', _R('40÷27.5', 1), '배예요.']]}]},
          _why('약 1.5배를 소수 둘째 자리까지 나타내면 어떻게 달라지나요?', '40÷27.5 = 1.454…이라 소수 둘째 자리까지 나타내면 약 1.45배예요. 나타내는 자리에 따라 반올림한 값이 달라져요.')]),
        ('계획서의 세 가지 계산에서 몫을 어떻게 나타냈는지 정리해 보세요.',
         [_blanks('7.2÷0.48처럼 나누어떨어지면 몫을 ', (['끝까지', '자연수 부분까지만'], 0), ' 구해요. 아이스박스 수처럼 몫이 자연수여야 하면 ',
                  (['남는 양', '몫의 반올림'], 0), '을 함께 써요. 40÷27.5처럼 나누어떨어지지 않으면 ', (['반올림하여', '버리지 않고 끝까지'], 0), ' 나타내요.')]),
        ('모둠 계획서를 반 친구들에게 발표할 글을 써 보세요.',
         [_write(('발표', '얼음 11.3 kg을 2.4 kg씩 담는 계획을 식과 답을 넣어 발표 글로 써 보세요.', '11.3÷2.4에서 아이스박스 수는 자연수라서 4통까지 담고, 남는 얼음 1.7 kg은 컵에 바로 넣어요.'),
                 ('까닭', '아이스박스 수를 4.7통이라고 쓰면 어떤 문제가 생길지 써 보세요.', '아이스박스는 4.7통처럼 셀 수 없어요. 4통에 담고 남는 1.7 kg을 따로 말해야 실제로 준비할 수 있어요.'))]),
    ],
    's10': [
        ('축제 부스 한 바퀴 놀이의 방법을 떠올리며 답해 보세요(2명, 준비물: 주사위·말·계산기).',
         [_quiz(('상대방은 답이 맞는지 무엇으로 확인하나요?', ['계산기', '자', '주사위'], 0),
                ('반올림 칸에서는 몫을 어떻게 써야 하나요?', ['몫을 끝까지 모두 써요', '칸에 적힌 자리까지 반올림하여 써요', '자연수 부분만 써요'], 1),
                ('놀이는 몇 명이 함께 하나요?', ['4명', '6명', '2명'], 2))]),
        ('놀이판에 나올 만한 문제를 미리 계산해 보세요.',
         [_long([{'a': '9.72', 'b': '3.6'}, {'a': '27', 'b': '0.36'}],
                [['6.12÷2.04 =', _N('6.12÷2.04')], ['8.15÷3.4의 몫을 반올림하여 일의 자리까지 나타내면', _R('8.15÷3.4', 0)],
                 ['29÷0.7의 몫을 반올림하여 소수 첫째 자리까지 나타내면', _R('29÷0.7', 1)]])]),
        ('놀이판 칸의 문제가 새로 바뀌었어요. 새 놀이판의 여덟 칸을 미리 풀어 보세요. 반올림 칸은 적힌 자리까지 나타내요.',
         [_board([('4.8÷0.6', None), ('7.2÷0.9', None), ('6÷1.2', None), ('25.2÷2.8', None), ('0.96÷0.32', None), ('54÷1.8', None), ('9.2÷3.7', 0), ('31÷0.6', 1)])]),
        ('놀이를 되돌아보세요.',
         [_write(('검산', '놀이판의 나눗셈 가운데 하나를 골라 곱셈으로 검산한 식과 함께 써 보세요.', '54÷1.8 = 30이고, 검산하면 1.8×30 = 54라서 맞아요.'),
                 ('말하기', '놀이에서 진 친구에게 해 줄 수 있는 말을 써 보세요.', '“다음 판에는 네가 이길 수도 있어. 같이 한 번 더 하자!”'))]),
    ],
    's11': [
        ('결산 발표회 첫 순서예요. 자연수의 나눗셈과 분수의 나눗셈으로 계산해 보세요.',
         [_sent([['6.4÷0.8: 각각 10배 → 64÷8 =', _N('64÷8'), '→ 6.4÷0.8 =', _N('6.4÷0.8')],
                 ['2.76÷0.46: 각각 100배 → 276÷46 =', _N('276÷46'), '→ 2.76÷0.46 =', _N('2.76÷0.46')],
                 ['⑴ 21÷1.4 =', _F(210, 10), '÷', _F(14, 10), '= 210÷14 =', _N('21÷1.4')],
                 ['⑵ 36÷0.48 =', _F(3600, 100), '÷', _F(48, 100), '= 3600÷48 =', _N('36÷0.48')]])]),
        ('결산표의 나눗셈을 세로셈으로 계산해 보세요.',
         [_long([{'a': '4.08', 'b': '0.24'}, {'a': '7.13', 'b': '2.3'}], [['29.4÷4.2 =', _N('29.4÷4.2'), ', 52÷1.25 =', _N('52÷1.25')]])]),
        ('몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요. 세로셈으로 소수 셋째 자리까지 계산해요.',
         [_long([{'a': '17', 'b': '6.4', 'mode': 'tr', 'places': 3}, {'a': '3.29', 'b': '1.6', 'mode': 'tr', 'places': 3}],
                [['17÷6.4 → 약', _R('17÷6.4', 2), ', 3.29÷1.6 → 약', _R('3.29÷1.6', 2)]])]),
        ('꽃다발 가게 결산 기록이에요. □ 안에 알맞은 수를 구해 보세요.',
         [_sent([['첫날 쓴 리본은', _V('14.5'), 'm, 둘째 날 쓴 리본은', _V('26.1'), 'm예요.'],
                 ['문제를 푸는 데 필요 없는 정보는', _O(['쓴 리본의 길이', '팔린 꽃다발 수'], 1)],
                 ['식: 26.1 ÷ 14.5 =', _N('26.1÷14.5'), '→ □ =', _V('1.8')]],
                fig={'note': {'title': '💐 꽃다발 가게 결산 기록 (2)', 'lines': ['첫날: 꽃다발 9다발 팔림, 쓴 리본 14.5 m', '둘째 날: 꽃다발 16다발 팔림, 쓴 리본은 첫날의 □배인 26.1 m']}})]),
        ('남은 레몬청 22.6 L를 4.8 L들이 통에 가득 나누어 담았어요. 도현이는 48)226 → 몫 4, 192, 34로 계산해 “4통, 남는 레몬청 34 L”라고 썼어요. 잘못된 곳을 찾고 옳게 계산해 보세요.',
         [_long([{'a': '22.6', 'b': '4.8', 'mode': 'rem', 'what': '통의 수'}],
                [['잘못된 까닭:', _O(['몫을 자연수 부분까지만 구했어요', '남는 양의 소수점을 22.6의 소수점 위치에 맞추어 찍지 않았어요'], 1)],
                 ['옳게 계산하면:', _V(4, True), '통, 남는 레몬청', _V('3.4'), 'L'], ['확인: 4.8 × 4 + 3.4 =', _N('4.8×4+3.4')]])]),
        ('1차시에 쓴 ‘궁금해요’ 칸을 떠올리며, 축제 준비를 되돌아보세요.',
         [_write(('더 알고 싶은 것', '1차시에 궁금했던 것 가운데 아직 더 알고 싶은 것을 하나 쓰고, 어떻게 알아볼지 써 봐요.', '몫이 끝없이 이어지는 나눗셈은 어떤 수로 나눌 때 생길까? → 여러 나눗셈을 계산기로 해 보고 견주어 볼래요.'),
                 ('반올림', '축제 준비에서 몫을 반올림하여 나타낸 계산을 하나 골라 식과 답을 써 봐요.', '40÷27.5 = 1.454…라서 계획서에 약 1.5배라고 썼어요.'))]),
    ],
}


def main():
    out = []
    try:
        app = load_app(SRC_TB)
        nos = [str(L['no']) for L in app['lessons']]
        assert nos == ['1', '2', '3', '4', '5', '6', '7', '8~9', '10', '11'], nos
        for lv in ('기본형', '도전형'):
            out.append(build_tb(app, lv))
        st = load_st(SRC_ST)
        ids = [L['id'] for L in st['lessons']]
        assert ids == ST, ids
        assert [str(L['no']) for L in st['lessons']] == [str(i) for i in range(1, 12)]
        for lv in ('기본형', '도전형'):
            out.append(build_st(st, lv))
    finally:
        SHOT.close()
        if os.environ.get('KEEP_FIGS'):
            print('그림 폴더:', WORK)
        else:
            shutil.rmtree(WORK, ignore_errors=True)
    bad = 0
    for p in out:
        prob = check(p) + no_namuji(p)
        bad += bool(prob)
        print(p, 'OK' if not prob else '\n  ' + '\n  '.join(prob))
    sys.exit(1 if bad else 0)


if __name__ == '__main__':
    main()
