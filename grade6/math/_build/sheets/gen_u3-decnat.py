# -*- coding: utf-8 -*-
"""6-1 수학 3. 소수의 나눗셈 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u3-decnat.py

앱 원본 ../units/u3-decnat.tb.js('한민족 전통문화 축제 소수의 나눗셈', 11차시)의 LESSONS를 node에서 그대로 실행해
(활동 함수 대신 기록하는 함수를 넣어 render를 부름) 차시 번호·제목·S.O.O.P.·탐구 질문·안내 글·물음·보기·정답·수를 모두 앱에서 읽어 옵니다.
그래서 원본의 수가 바뀌면 활동지도 따라 바뀌고, 모든 답은 이 스크립트가 분수(Fraction)로 다시 계산해 확인합니다(assert).
  - 세로셈 판은 앱 dn3LongBoard와 같은 규칙(나누어지는 수의 소수점·끝에 붙인 흐린 0·계산 메모 줄 수)으로 그립니다.
    기본형은 붙인 0(흐린 0)과 소수점(빨간 점)을 보여 주고, 도전형은 처음 수만 보여 주고 붙일 자리는 빈 점선 칸으로 둡니다.
  - 수 모형 나누어 주기·나무 막대 자르기·소수점 찍기·놀이판(발사! 내 땅)·나눗셈 카드도 앱의 수 그대로 그립니다.
이야기 버전(u3-decnat.st.js, '새봄 스포츠 클럽 기록실', 11차시)도 같은 방법으로 LESSONS를 node에서 실행해 읽습니다(ST_JS).
  이야기 엔진의 thenWhy('왜 그럴까요?')·ruleFirst('먼저 예상해요')·wonderRecall·panes·쪽지(dn3sNote)·기록 표(dn3Record)도 기록해
  기본형은 앱 도움 문장 틀, 도전형은 쓰는 줄로 바꾸고, 모범 답은 앱의 ans를 그대로 씁니다.
  놀이판(콩주머니 땅따먹기)·나눗셈 카드·문제 만들기(DN3MK)는 이야기 앱의 것을 그대로 읽습니다.
그림은 SVG로 그려 임시 폴더에서 PNG로 바꿉니다(저장소에는 남기지 않음).
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
SRC_TB = os.path.join(ROOT, '_build', 'units', 'u3-decnat.tb.js')
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
NAME = '3단원_소수의나눗셈_활동지_%s.hwpx'
LABEL_TB = '6-1 수학 3. 소수의 나눗셈(교과서 차시)'
SRC_ST = os.path.join(ROOT, '_build', 'units', 'u3-decnat.st.js')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
LABEL_ST = '6-1 수학 3. 소수의 나눗셈(이야기 버전)'
ST = ['s%d' % i for i in range(1, 12)]   # 이야기 버전 차시 id(앱 LESSONS 차례)
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
NUM = '①②③④⑤⑥⑦⑧⑨'
KO = '㉠㉡㉢㉣㉤㉥'
WORK = tempfile.mkdtemp(prefix='u3dnat_')
INK = '#1D2A2A'
RED, BLUE, DARK, GREY, ORANGE, GREEN = '#C8472E', '#2B7BD6', '#7A8C86', '#9AABA4', '#E8913A', '#2E8B57'
TC = ['#F6C08A', '#9CC6EC', '#A9D8A2']     # 수 모형 1 · 0.1 · 0.01 (앱 DN3TC)
UNITS = ['1', '0.1', '0.01']
PX_MM = 0.155


# ================================================================ 앱 원본 읽기(node)
EX_JS = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const cut = (a, b) => { const i = src.indexOf(a), j = src.indexOf(b); if (i < 0 || j < 0) throw new Error('원본에서 못 찾음: ' + a); return src.slice(i, j); };
const core = cut('/*dn3-core*/', '/*dn3-core-end*/');
const brd = cut('const DN3BOARD', 'const DN3CELLS');
const deck = cut('const DN3DECK', 'function dn3CardGame(');
const mk = cut('const DN3MK', 'function dn3Make(');
const les = src.slice(src.indexOf('//@@LESSONS'));
let REC = [];
const rec = w => function (b, a, ...args) { REC.push({ w, args }); };
const stubs = `
var dn3Sent=rec('sent'), dn3Blocks=rec('blocks'), dn3Long=rec('long'), dn3Tape=rec('tape'), dn3Point=rec('point'), dn3Pick2=rec('pick2'),
 dn3Clip=rec('clip'), dn3CardGame=rec('cardgame'), dn3Make=rec('make'),
 quiz=rec('quiz'), blanks=rec('blanks'), sequence=rec('sequence'), writeStep=rec('writeStep');
var dn3Talk = lines => ({ talk: lines }), dn3RelFig = (rows, k) => ({ rel: rows, k }), dn3Record = (name, rows) => ({ record: name, rows }),
 dn3WithCalc = fig => () => ({ calc: 1, inner: fig ? fig() : null }), dn3BeeFig = () => ({ bee: 1 }), dn3FestFig = () => ({ fest: 1 }), dn3ClayFig = () => ({ clay: 1 });
`;
const R = eval(core + '\n' + brd + '\n' + deck + '\n' + mk + '\n' + stubs + '\n' + les +
  '\n;({LESSONS, UNIT_STORY, DN3BOARD, DECK: DN3DECK.map(c => ({ e: c.e, a: c.a })), DN3MK, MKT: DN3MK.a.map(a => DN3MK.b.map(b => dn3MakeText(a, b)))})');
const ser = v => JSON.parse(JSON.stringify(v, (k, x) => typeof x === 'bigint' ? String(x) : (typeof x === 'function' ? (x.length === 0 ? x() : undefined) : x)));
const B = { append: x => REC.push({ w: 'fig', args: [ser(x)] }) };
const out = R.LESSONS.map(L => {
  const steps = L.steps.map(S => { REC = []; S.render(B, {}); return { name: S.name || null, inst: S.inst, hints: S.hints || [], calls: ser(REC) }; });
  REC = []; L.challenge.render(B, {});
  return { id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, steps,
    ch: { inst: L.challenge.inst, hints: L.challenge.hints || [], calls: ser(REC) } };
});
process.stdout.write(JSON.stringify({ lessons: out, story: R.UNIT_STORY, board: R.DN3BOARD, deck: R.DECK, mk: R.DN3MK, mkt: R.MKT }));
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

# 종이 활동지에 맞게 바꾸는 안내 글(앱의 '누르기·끌기·단추' 말)
PAPER = [
    ('배우는 차례대로 눌러 학습 계획을 세워 보세요. (교과서의 스티커 활동 대신 이 앱에서 차례 정하기로 바꾸었어요.)',
     '배우는 차례대로 기호를 써서 학습 계획을 세워 보세요.'),
    (' (이 앱이 만든 문제예요.)', ''),
    ('동그라미를 눌러 몫의 소수점을 찍어요.', '몫의 소수점을 찍어요.'),
    ('나무 막대를 눌러 자르는 선을 놓아', '나무 막대 그림에 자르는 선을 그어'),
    (' (이 앱에서는 로봇 친구와 해요.)', ' (2명이 함께 해요. 아래 카드를 오려서 써요.)'),
    ('발사 칸의 클립을 누른 채 원하는 땅 쪽으로 끌었다가 놓으면 클립이 튕겨 나가요(조금씩 빗나갈 수 있어요). 도착한 땅의 몫을 쓰면 친구가 계산기로 확인해요.',
     '발사 칸에 클립을 놓고 원하는 땅 쪽으로 손가락으로 튕겨요. 도착한 땅의 나눗셈과 몫을 기록표에 쓰면 친구가 계산기로 확인해요.'),
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
GLUE = re.compile(r'^[\.\,\)\:]|^(이에요|예요|이므로|므로|이고|이라|으로|이|가|을|를|은|는|과|와|로|의|에|만큼|배|번|칸|개|명|통|봉지|모둠|도막|병|묶음|분|인(?= ))')


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
        rel_fig(s, f['rel'], f['k'])
    elif 'record' in f:
        s.text('%s의 운동 기록' % f['record'])
        s.table([['날짜', '운동', '소모한 열량(킬로칼로리)', '운동 시간(분)']] + [list(r) for r in f['rows']],
                col_mm=[26, 46, 62, 46])
    elif 'calc' in f:
        fig(s, f.get('inner'))
        s.text('(계산기를 써도 돼요.)')
    elif 'bee' in f:
        bee_fig(s)
    elif 'fest' in f:
        fest_fig(s)
    elif 'clay' in f:
        clay_fig(s)
    elif 'note' in f:            # 이야기 버전 쪽지(dn3sNote)
        note_box(s, f['note'])
    elif 'rec2' in f:            # 이야기 버전 기록 표(dn3Record(제목, 머리, 줄))
        r = f['rec2']
        s.text(noemo(K(r['title'])))
        n = len(r['head'])
        s.table([list(r['head'])] + [list(x) for x in r['rows']], col_mm=[int(180 / n)] * n)
    else:
        raise ValueError('모르는 그림', f)


def j_ro(t):
    """'으로/로' (수는 마지막 숫자 읽기: 받침이 있고 ㄹ이 아니면 '으로')"""
    h, r = has_jong(t)
    return t + ('으로' if h and not r else '로')


# ================================================================ 그림들
def bee_fig(s):
    W, H = 640, 190
    out = []
    for x, y in ((90, 70), (210, 60), (330, 74)):
        out.append('<ellipse cx="%d" cy="%d" rx="14" ry="10" fill="#E8F4FF" stroke="#8DB7DE" stroke-width="1.5"/>' % (x - 6, y - 20))
        out.append('<ellipse cx="%d" cy="%d" rx="14" ry="10" fill="#E8F4FF" stroke="#8DB7DE" stroke-width="1.5"/>' % (x + 8, y - 22))
        out.append('<ellipse cx="%d" cy="%d" rx="26" ry="17" fill="#F7C948" stroke="%s" stroke-width="2"/>' % (x, y, INK))
        for sx in (-8, 4):
            out.append(R(x + sx, y - 16, 6, 32, INK, 'none', 0))
        out.append(C(x + 24, y - 2, 9, INK))
        out.append(C(x + 27, y - 5, 2, '#fff'))
    out.append('<path d="M470 60 h90 l-10 90 h-70 z" fill="#FFE7A8" stroke="#C99A57" stroke-width="2.5"/>')
    out.append('<path d="M480 96 h80 l-6 54 h-68 z" fill="#F2B63D"/>')
    out.append(T(515, 40, '꿀 0.42 g', 20, anchor='middle', fill='#8A5A1E'))
    out.append(T(210, 140, '꿀벌 3마리가 똑같은 양을 모았어요', 18, anchor='middle', fill=DARK))
    out.append(T(210, 168, '한 마리가 모은 꿀은 몇 g일까?', 18, anchor='middle', fill=RED))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=110)


def fest_fig(s):
    W, H = 720, 200
    out = []
    for x, lab, sub in ((10, '떡메 치기', '찹쌀밥'), (190, '투호 놀이', '나무 막대'), (370, '시루떡', '나누어 주기'), (550, '식혜', '나누어 주기')):
        out.append(R(x, 30, 160, 150, '#FFFDF6', '#D9C7A3', 2, rx=14))
        out.append('<path d="M%d 30 h160 l-14 -18 h-132 z" fill="#E86A5A"/>' % x)
        out.append(T(x + 80, 92, lab, 22, anchor='middle', fill='#5A3A12', weight='bold'))
        out.append(T(x + 80, 136, sub, 17, anchor='middle', fill=DARK))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=120)


def clay_fig(s, mk=None):
    W, H = 720, 190
    out = [R(30, 120, 300, 16, '#C99A57', 'none', 0, rx=6)]
    for i, x in enumerate((80, 180, 280)):
        out.append(C(x, 70, 22, ['#F6C08A', '#9CC6EC', '#F4A7B9'][i], INK, 2))
        out.append(R(x - 22, 92, 44, 28, ['#E8913A', '#2B7BD6', '#C8472E'][i], 'none', 0, rx=10))
    out.append(T(180, 160, '학생 3명', 17, anchor='middle', fill=DARK))
    out.append(R(370, 100, 90, 14, '#9AABA4', 'none', 0, rx=4))
    out.append(R(392, 70, 46, 30, '#B07A55', 'none', 0, rx=6))
    out.append(T(415, 135, '찰흙 1.62 kg', 16, anchor='middle', fill='#8A5A1E'))
    out.append('<path d="M490 70 q20 -30 40 0 t40 0 t40 0" fill="none" stroke="#7A8C86" stroke-width="4"/>')
    out.append(T(550, 105, '철사 2.88 m', 16, anchor='middle', fill=DARK))
    for i in range(6):
        out.append('<path d="M%d 140 h28 l-4 22 h-20 z" fill="#F7C948" stroke="#B78A45" stroke-width="1.5"/>' % (484 + i * 36))
    out.append(T(590, 178, '바구니 6개', 16, anchor='middle', fill=DARK))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=120)


def rel_fig(s, rows, k):
    """앱 dn3RelFig: 위 줄 a÷b=q, 아래 줄은 a와 q가 [1/k]배, b는 그대로"""
    k = int(k)
    a0, b0, q0 = rows[0]
    assert Q(a0) / Q(b0) == Q(q0), ('관계 그림 확인', rows[0])
    for a, b, q in rows[1:]:
        assert Q(a) == Q(a0) / k and Q(b) == Q(b0), ('관계 그림 확인', a, b)
        if q != '?':
            assert Q(q) == Q(q0) / k
    W, gapY = 600, 104
    H = 50 + (len(rows) - 1) * gapY + 30
    xs = {'a': 130, 'o': 228, 'b': 300, 'e': 372, 'q': 470}
    out = []
    for r, (a, b, q) in enumerate(rows):
        y = 40 + r * gapY
        for key, t in (('a', a), ('o', '÷'), ('b', b), ('e', '='), ('q', q)):
            out.append(T(xs[key], y, t, 30, anchor='middle', fill=GREEN if key == 'q' else INK))
        if r:
            y0, y1 = y - gapY + 24, y - 24
            ym = (y0 + y1) / 2
            for cc in ('a', 'q'):
                x = xs[cc]
                out.append(L(x, y0, x, y1 - 6, RED, 2.5))
                out.append('<path d="M%d %d L%d %d L%d %d z" fill="%s"/>' % (x - 6, y1 - 10, x, y1, x + 6, y1 - 10, RED))
                out.append(T(x + 36, ym - 9, '1', 15, anchor='middle', fill=RED))
                out.append(L(x + 25, ym, x + 47, ym, RED, 2))
                out.append(T(x + 36, ym + 10, str(k), 15, anchor='middle', fill=RED))
                out.append(T(x + 64, ym, '배', 16, anchor='middle', fill=RED))
            out.append(T(xs['b'], ym, '그대로', 15, anchor='middle', fill=DARK))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=85)


def cards_fig(s, cards, fs=40):
    out, x = [], 12
    for c in cards:
        w = max(70, tw(c, fs) + 40)
        out.append(R(x, 10, w, 96, '#FFF8E6', INK, 3, rx=12))
        out.append(T(x + w / 2, 58, c, fs, anchor='middle'))
        x += w + 22
    put_png(s, svg_doc(int(x), 116, ''.join(out)), int(x), 116, max_mm=min(90, x * .16))


# ---------------------------------------------------------------- 수 모형(앱 dn3Blocks)
def blocks_data(o):
    A, K_ = o['a'], int(o['k'])
    q = Q(A) / K_
    qs = dec(q)
    assert qs is not None and ndig(qs) <= 2, ('수 모형으로 나눌 수 없어요', A)
    ai, af = (A.split('.') + [''])[:2]
    T_ = 1 + max(len(af), ndig(qs))
    init = [int(ai), int(af[0]) if len(af) > 0 else 0, int(af[1]) if len(af) > 1 else 0][:T_]
    q100 = int(q * 100)
    goal = [q100 // 100, q100 // 10 % 10, q100 % 10][:T_]
    assert sum(Fraction(g, 10 ** t) for t, g in enumerate(goal)) == q
    return A, K_, qs, T_, init, goal


def piece(t, x, y):
    w, h = [(44, 44), (7, 44), (9, 9)][t]
    o = [R(x, y, w, h, TC[t], '#7A6A55', 1.2)]
    if t == 0:
        for i in range(1, 10):
            o.append(L(x + w * i / 10, y, x + w * i / 10, y + h, '#C9935A', .6))
            o.append(L(x, y + h * i / 10, x + w, y + h * i / 10, '#C9935A', .6))
    if t == 1:
        for i in range(1, 10):
            o.append(L(x, y + h * i / 10, x + w, y + h * i / 10, '#6E9BC4', .6))
    return ''.join(o)


def flow(out, t, n, x, y, maxw):
    if not n:
        return 0
    w, h, gx, gy = [(44, 44, 6, 6), (7, 44, 4, 6), (9, 9, 3, 3)][t]
    per = max(1, int((maxw + gx) // (w + gx)))
    for i in range(n):
        out.append(piece(t, x + (i % per) * (w + gx), y + (i // per) * (h + gy)))
    return math.ceil(n / per) * (h + gy)


def blocks_fig(s, A, K_, T_, init, grp):
    W, x0 = 760, 10
    zw = [420, 310] if T_ == 2 else [290, 230, 200]
    out = [T(x0 + 4, 14, '나누어 줄 수 모형 (%s)' % A, 17, fill=DARK)]
    zx, ph = x0, 0
    tmp = []
    for t in range(T_):
        g = []
        hh = flow(g, t, init[t], zx + 12, 58, zw[t] - 24)
        ph = max(ph, hh)
        tmp.append((zx, g))
        zx += zw[t] + 10
    PH = max(100, ph + 46)
    for t, (zx, g) in enumerate(tmp):
        out.append(R(zx, 26, zw[t], PH, '#FFFDF6', '#C9D4CF', 2, rx=12))
        out.append(T(zx + zw[t] / 2, 42, '%s · %d개' % (UNITS[t], init[t]), 17, anchor='middle', fill='#5A4A35'))
        out.extend(g)
    GY = 26 + PH + 16
    bw_ = (W - 2 * x0 - (K_ - 1) * 12) / K_
    BH = 150
    for k in range(K_):
        bx = x0 + k * (bw_ + 12)
        out.append(R(bx, GY, bw_, BH, '#F7FBFF', '#8DB7DE', 2.5, rx=14, dash='8 5'))
        out.append(T(bx + bw_ / 2, GY + 17, '%s %d' % (grp, k + 1), 17, anchor='middle', fill=BLUE))
    H = GY + BH + 8
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=150)


# ---------------------------------------------------------------- 나무 막대(앱 dn3Tape)
def tape_fig(s, o, pre):
    Lcm = Q(o['m']) * 100
    assert Lcm.denominator == 1
    Lcm = int(Lcm)
    SN, n = int(o.get('snap') or 5), int(o['n'])
    part = Fraction(Lcm, n)
    assert part.denominator == 1 and part % SN == 0, '막대 눈금 오류'
    W, x0, Lp, my, sy, bh, ry, H = 760, 30, 700, 34, 66, 40, 142, 200
    X = lambda c: x0 + Lp * c / Lcm   # noqa: E731
    out = [L(x0, my + 12, x0 + Lp, my + 12, DARK, 1.5)]
    for c in range(0, Lcm + 1, 50):
        out.append(L(X(c), my + 6, X(c), my + 18, INK, 2))
        out.append(T(X(c), my - 6, dec(Fraction(c, 100)), 15, anchor='middle'))
    out.append(T(x0 + Lp, my - 24, o['m'], 15, anchor='middle', fill=RED))
    out.append(T(x0 + Lp + 18, my + 12, 'm', 14, anchor='middle', fill=DARK))
    out.append(R(x0, sy, Lp, bh, '#E8C48E', '#9A6B32', 2.5, rx=6))
    if pre:
        x = X(int(part))
        out.append(L(x, sy - 10, x, sy + bh + 10, RED, 3, '6 4'))
    out.append(R(x0, ry - 14, Lp, 40, '#F3F7F5', '#C9D4CF', 1))
    for c in range(0, Lcm + 1, 5):
        big, mid = c % 50 == 0, c % 10 == 0
        out.append(L(X(c), ry - 14, X(c), ry - 14 + (18 if big else 12 if mid else 6), INK, 2 if big else 1))
        if big:
            out.append(T(X(c), ry + 16, str(c), 14, anchor='middle'))
    out.append(T(x0 + Lp, ry + 34, str(Lcm), 14, anchor='middle', fill=RED))
    out.append(T(x0 + Lp + 20, ry - 2, 'cm', 14, anchor='middle', fill=DARK))
    put_png(s, svg_doc(W + 20, H, ''.join(out)), W + 20, H, max_mm=160)
    return Lcm, int(part), n


# ---------------------------------------------------------------- 세로셈 판(앱 dn3LongBoard와 같은 규칙)
def board_data(pr):
    A, B = pr['a'], pr['b']
    assert re.fullmatch(r'\d+', B), ('나누는 수는 자연수여야 해요', B)
    ai, af = (A.split('.') + [''])[:2]
    q = Q(A) / Q(B)
    qs = dec(q)
    assert qs is not None, ('나누어떨어지지 않아요', A, B)
    qd = ndig(qs)
    tot = max(len(af), qd)
    digits = list(ai + af.ljust(tot, '0'))
    qn = len(qs.replace('.', '').lstrip('0') or '0')
    memo = pr['memo'] if pr.get('memo') is not None else min(8, 2 * max(1, qn))
    notes = ''
    if not af:
        if tot:
            notes = '자연수 %s 뒤에 소수점이 있다고 생각해요(%s = %s.%s).' % (A, A, A, '0' * tot)
    elif tot > len(af):
        notes = '흐린 0은 소수점 아래 끝자리에 붙인 0이에요(%s = %s%s).' % (A, A, '0' * (tot - len(af)))
    return dict(A=A, B=B, ai=ai, af=af, digits=digits, nOrig=len(ai) + len(af), pDot=len(ai) - 1, memo=memo,
                qs=qs, q=q, cap=pr.get('cap') or sp(A + '÷' + B), notes=notes, ans='%s = %s' % (sp(A + '÷' + B), qs))


def board_svg(d, pre, out, ox, oy):
    c, fs, labw = 44, 34, 60
    C_ = len(d['digits'])
    out.append(T(ox, oy + 14, d['cap'], 26, weight='bold'))
    y = oy + 34
    note = d['notes'] if pre else ''
    if note:
        out.append(T(ox, y + 8, note, 16, fill=DARK))
        y += 26
    bw_ = 0.72 * c
    divw = len(d['B']) * bw_ + 22
    xd = ox + labw + divw
    rows_y = y + 4
    out.append(T(ox + labw - 10, rows_y + c / 2, '몫', 17, anchor='end', fill=GREEN))
    for k in range(C_):
        out.append(R(xd + k * c + 4, rows_y + 4, c - 8, c - 8, '#fff', GREY, 1.6, rx=4, dash='4 3'))
    yy = rows_y + c
    cy = yy + c / 2
    out.append(L(xd - 6, yy + 2, xd + C_ * c + 6, yy + 2, INK, 3))
    out.append('<path d="M%.1f %.1f Q%.1f %.1f %.1f %.1f" fill="none" stroke="%s" stroke-width="3"/>' % (xd - 6, yy + 2, xd + 8, yy + c / 2, xd - 8, yy + c + 4, INK))
    for k, ch in enumerate(d['B']):
        out.append(T(ox + labw + k * bw_ + bw_ / 2, cy, ch, fs, anchor='middle'))
    for k in range(C_):
        x = xd + k * c + c / 2
        if pre or k < d['nOrig']:
            out.append(T(x, cy, d['digits'][k], fs, anchor='middle', fill=GREY if k >= d['nOrig'] else INK))
        else:
            out.append(R(x - c / 2 + 6, yy + 6, c - 12, c - 12, '#fff', '#C9D4CF', 1.2, rx=4, dash='3 3'))
        if k == d['pDot'] and d['pDot'] < C_ - 1 and (pre or d['af']):
            out.append(C(x + c / 2 - 2, cy + fs * .42, 5 if pre else 4, RED if pre else INK))
    yy += c
    for r in range(d['memo']):
        for k in range(C_):
            out.append(R(xd + k * c + 3, yy + r * c + 3, c - 6, c - 6, '#fff', '#D5DEDA', 1, rx=3, dash='2 3'))
    yy += d['memo'] * c
    wid = max(xd + C_ * c + 10, ox + tw(d['cap'], 26) + 10, ox + (tw(note, 16) + 10 if note else 0)) - ox
    return wid, yy - oy + 8


def long_fig(s, probs, pre):
    ds = [board_data(p) for p in probs]
    out, x, y, rowh, wmax = [], 10, 6, 0, 0
    for d in ds:
        w, h = board_svg(d, pre, [], 0, 0)
        if x > 10 and x + w > 1150:
            x, y = 10, y + rowh + 24
            rowh = 0
        board_svg(d, pre, out, x, y)
        x += w + 46
        rowh = max(rowh, h)
        wmax = max(wmax, x - 46 + 10)
    W, H = int(wmax), int(y + rowh + 6)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(180, W * PX_MM))
    return [d['ans'] for d in ds]


# ---------------------------------------------------------------- 소수점 찍기 줄(앱 dn3Point)
def point_fig(s, items):
    c, fs = 58, 34
    out, y, wmax = [], 34, 0
    for e, cells in items:
        cap = sp(e) + '의 몫:'
        out.append(T(12, y, cap, 28))
        x = 24 + tw(cap, 28)
        for k, dgt in enumerate(cells):
            out.append(R(x + k * c, y - 23, c - 18, 46, '#FFF8E6', INK, 2, rx=6))
            out.append(T(x + k * c + (c - 18) / 2, y, dgt, fs, anchor='middle'))
            if k < len(cells) - 1:
                out.append(C(x + k * c + c - 9, y + 17, 6, '#fff', DARK, 2))
        wmax = max(wmax, x + len(cells) * c + 12)
        y += c + 26
    W, H = int(wmax), int(y - 26 + c / 2 + 10)
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=min(130, W * PX_MM))


# ---------------------------------------------------------------- 놀이판(앱 DN3BOARD)
SPECIAL = {'GO': '발사', 'REST': '한 번 쉬기', 'PICK': '원하는 땅\n한 칸 색칠하기'}


def board_cells(board):
    cells = []
    for r, row in enumerate(board):
        for c, t in enumerate(row):
            e = t.replace('*', '')
            if e in SPECIAL:
                continue
            q = ev(e)
            a = dec(q)
            assert a is not None, ('놀이판 칸 오류', e)
            cells.append((r, c, e, t.endswith('*'), a))
    return cells


def clip_fig(s, board, go_t='발사', go_sub='(클립을 놓는 곳)'):
    COLS, ROWS = len(board[0]), len(board)
    cw_, ch, gp, x0, y0 = 150, 90, 6, 10, 10
    W, H = x0 * 2 + COLS * cw_ + (COLS - 1) * gp, y0 * 2 + ROWS * ch + (ROWS - 1) * gp
    out = [R(2, 2, W - 4, H - 4, '#F4F8F6', '#F4F8F6', 0, rx=16)]
    gos = [(r, c) for r, row in enumerate(board) for c, t in enumerate(row) if t == 'GO']
    r0, c0 = min(gos)
    r1, c1 = max(gos)
    assert len(gos) == (r1 - r0 + 1) * (c1 - c0 + 1)
    X = lambda c: x0 + c * (cw_ + gp)   # noqa: E731
    Y = lambda r: y0 + r * (ch + gp)    # noqa: E731
    for r, row in enumerate(board):
        for c, t in enumerate(row):
            if t == 'GO':
                continue
            x, y = X(c), Y(r)
            e = t.replace('*', '')
            if e in SPECIAL:
                out.append(R(x, y, cw_, ch, '#FFE7A8', '#C99A57', 2, rx=12))
                ls = SPECIAL[e].split('\n')
                for i, ln in enumerate(ls):
                    out.append(T(x + cw_ / 2, y + ch / 2 + (i - (len(ls) - 1) / 2) * 24, ln, 19, anchor='middle', fill='#8A5A1E'))
            else:
                out.append(R(x, y, cw_, ch, '#fff', '#C9D4CF', 2, rx=12))
                out.append(T(x + cw_ / 2, y + ch / 2 + (6 if t.endswith('*') else 0), sp(e), 24, anchor='middle'))
                if t.endswith('*'):
                    out.append(R(x + 6, y + 6, 58, 22, '#E8F1FB', '#8DB7DE', 1, rx=6))
                    out.append(T(x + 35, y + 17, '계산기', 14, anchor='middle', fill=BLUE))
    gx, gy = X(c0), Y(r0)
    gw, gh = X(c1) + cw_ - gx, Y(r1) + ch - gy
    out.append(R(gx, gy, gw, gh, '#FFD7CF', RED, 2.5, rx=16))
    out.append(T(gx + gw / 2, gy + gh / 2 - 14, go_t, 34, anchor='middle', fill=RED, weight='bold'))
    out.append(T(gx + gw / 2, gy + gh / 2 + 26, go_sub, 17, anchor='middle', fill=RED))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=180)


def deck_fig(s, deck):
    per, cw_, ch, gp = 6, 170, 100, 14
    rows = (len(deck) + per - 1) // per
    W, H = per * cw_ + (per - 1) * gp + 20, rows * ch + (rows - 1) * gp + 20
    out = []
    for i, cd in enumerate(deck):
        x, y = 10 + (i % per) * (cw_ + gp), 10 + (i // per) * (ch + gp)
        out.append(R(x, y, cw_, ch, '#FFF8E6', DARK, 1.5, rx=10, dash='7 5'))
        out.append(T(x + cw_ / 2, y + ch / 2, sp(cd['e']), 26, anchor='middle'))
    put_png(s, svg_doc(W, H, ''.join(out)), W, H, max_mm=175)


# ================================================================ 활동 함수(앱 기록 → 활동지)
def head(s, Ls):
    s.lesson(Ls['no'], Ls['soop'], K(Ls['title']), K(Ls['question']))


def step(s, i, name):
    s.step('%s %s' % (NUM[i], name))


def w_sent(s, lv, a):
    rows, o = a[0], (a[1] if len(a) > 1 else {}) or {}
    fig(s, o.get('fig'))
    return sent(s, rows)


def w_blocks(s, lv, a, cnt_ok=False):
    o = a[0]
    A, K_, qs, T_, init, goal = blocks_data(o)
    grp = o.get('grp') or '묶음'
    blocks_fig(s, A, K_, T_, init, grp)
    s.text('아래 %s 칸에 똑같이 나누어 준 수 모형을 그려 보세요.' % grp)
    if lv == '기본형':
        s.text('도움: 똑같이 나누어 줄 수 없는 모형은 바로 아래 자리 모형 10개로 바꾸어 나누어요(1 → 0.1 10개, 0.1 → 0.01 10개).')
    s.table([['', ] + ['%s의 수' % UNITS[t] for t in range(T_)],
             [('%s 한 명에' if cnt_ok and o.get('cnt') == '명' else '%s 하나에') % grp] + ['(      )개'] * T_], col_mm=[44] + [int(136 / T_)] * T_)
    desc = ', '.join('%s이 %d개' % (UNITS[t], goal[t]) for t in range(T_))
    return ['%s마다 %s → %s' % (grp, desc, qs)] + sent(s, o.get('asks') or [])


def w_tape(s, lv, a):
    o = a[0]
    Lcm, part, n = tape_fig(s, o, lv == '기본형')
    if lv == '기본형':
        s.text('아래 cm 자를 보고 막대를 똑같이 %d도막으로 자르는 선을 그어 보세요. 첫 번째 선은 그어 두었어요.' % n)
    else:
        s.text('아래 cm 자를 보고 막대를 똑같이 %d도막으로 자르는 선을 그어 보세요.' % n)
    out = ['%d cm씩 %d도막(자르는 선 %s cm)' % (part, n, ', '.join(str(part * k) for k in range(1, n)))]
    return out + sent(s, o.get('asks') or [])


def w_long(s, lv, a):
    o = a[0]
    fig(s, o.get('fig'))
    if o.get('talk'):
        fig(s, {'talk': o['talk']})
    if o.get('tip'):
        s.text(paper(o['tip']))
    elif lv == '기본형':
        pad = any(board_data(p)['notes'] for p in o['probs'])
        s.text('자연수의 나눗셈처럼 높은 자리부터 계산해요. 몫을 맨 위 칸에 쓰고, 나누어지는 수의 소수점(빨간 점) 바로 위에 몫의 소수점을 찍어요.'
               + (' 흐린 0까지 내려 끝까지 나누어요.' if pad else ''))
    else:
        s.text('세로셈으로 계산해 몫을 맨 위 칸에 쓰고 몫의 소수점을 찍어요. 나누어떨어지지 않으면 점선 칸에 0을 붙여 써서 계속 나누어요.')
    out = long_fig(s, o['probs'], lv == '기본형')
    return out + sent(s, o.get('rows') or [])


def w_point(s, lv, a):
    o = a[0]
    fig(s, o.get('fig'))
    s.text('먼저 어림셈하여 몫이 약 얼마인지 ○표 하고, 어림셈한 결과와 비슷해지도록 몫의 숫자 사이 동그라미 하나를 색칠해 소수점을 찍어요.')
    items, lines, out = [], [], []
    for it in o['items']:
        q = ev(it['e'])
        qs = dec(q)
        assert qs is not None and not qs.startswith('0.'), it
        cells = list(qs.replace('.', '').lstrip('0'))
        items.append((it['e'], cells))
        est = it.get('est')
        if est:
            lab = ('%s 어림셈하면 약 ' % j_ro(sp(est['lab']))) if est.get('lab') else '어림셈하면 약 '
            if est.get('lab'):
                assert ev(est['lab']) == Q(est['o'][est['a']]), ('어림셈 확인', it)
            lines.append('%s → %s( %s )' % (sp(it['e']), lab, ' / '.join(est['o'])))
            out.append('%s → 약 %s, 몫 %s' % (sp(it['e']), est['o'][est['a']], qs))
        else:
            out.append('%s = %s' % (sp(it['e']), qs))
    if lines:
        s.fill(lines if len(lines) > 1 else lines[0])
    point_fig(s, items)
    return out + sent(s, o.get('asks') or [])


def w_pick2(s, lv, a):
    o = a[0]
    cards = o['cards']
    best, bp = None, None
    for i, j in permutations(range(len(cards)), 2):
        v = Q(cards[i]) / Q(cards[j])
        if best is None or v > best:
            best, bp = v, (i, j)
    cards_fig(s, cards)
    s.text('수 카드 2장을 골라 몫이 가장 큰 (자연수)÷(자연수)를 만들어 보세요.')
    if lv == '기본형':
        s.text('도움: 몫이 가장 크려면 나누어지는 수는 가장 크게, 나누는 수는 가장 작게 골라요.')
    s.fill('(      ) ÷ (      ) = (              )')
    return ['%s ÷ %s = %s' % (cards[bp[0]], cards[bp[1]], show(best))] + sent(s, o.get('asks') or [])


def w_clip(s, lv, a, app):
    cells = board_cells(app['board'])
    clip_fig(s, app['board'], *app.get('go', ('발사', '(클립을 놓는 곳)')))
    s.text('‘한 번 쉬기’ 땅에 도착하면 한 번 쉬고, ‘원하는 땅 한 칸 색칠하기’ 땅에 도착하면 원하는 땅 한 칸을 색칠해요. ‘계산기’ 표시가 있는 땅은 계산기로 계산해도 돼요.')
    s.table([['차례', '도착한 땅의 나눗셈', '몫', '친구 확인(○/×)']] + [[str(i + 1), '', '', ''] for i in range(8)],
            col_mm=[18, 66, 50, 46], row_h=2300)
    seen, keys = set(), []
    for r, c, e, calc, ans in cells:
        if e not in seen:
            seen.add(e)
            keys.append('%s=%s' % (e, ans))
    return ['놀이판 몫: ' + ', '.join(keys)]


def w_cardgame(s, lv, a, app):
    deck = app['deck']
    for cd in deck:
        assert dec(ev(cd['e'])) == cd['a'], cd
    deck_fig(s, deck)
    s.table([['뒤집은 카드', '계산한 몫', '확인(○/×)', '가져간 사람']] + [['', '', '', ''] for _ in range(6)],
            col_mm=[50, 46, 38, 46], row_h=2300)
    return ['카드 몫: ' + ', '.join('%s=%s' % (cd['e'], cd['a']) for cd in deck)]


def w_make(s, lv, a, app):
    mk = app['mk']
    s.choices([('나누어지는 수(소수)', '( ' + ' / '.join('%s %s %s' % (x['n'], x['v'], x['u']) for x in mk['a']) + ' )'),
               ('나누는 수(자연수)', '( ' + ' / '.join(x['n'] for x in mk['b']) + ' )')])
    s.ask('고른 수로 (소수)÷(자연수) 문제를 만들어 써 보세요.', blank=False)
    if lv == '기본형':
        s.fill('(          ) (        )을(를) (            )에게(에) 똑같이 나누어 주면 하나에 몇 (     )일까요?')
    else:
        s.lines(2)
    s.ask('식과 답을 써 보세요.', blank=False)
    s.fill('식: (          ) ÷ (        ) = (            )      답: (            )')
    out = []
    for i, x in enumerate(mk['a']):
        for j, y in enumerate(mk['b']):
            q = Q(x['v']) / Q(y['v'])
            out.append('%s÷%s=%s %s' % (x['v'], y['v'], dec(q), x['u']))
    return ['예) ' + K(app['mkt'][0][0]) + ' → 만들 수 있는 식: ' + ', '.join(out)]


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
    ('t1', '경험'): '저는 ______________에서 ______________을(를) 해 봤어요(해 보고 싶어요).',
    ('t1', '상황'): '______________을(를) ________에게(에) 똑같이 나누어 ______________을(를) 알아볼 때',
    ('t9', '어림셈'): '어림셈을 먼저 하니 ______________________________ 수 있었어요.',
    ('t9', '문제 만들기'): '______________을(를) ______분 동안 하여 ______ 킬로칼로리를 소모했어요. 1분 동안 소모한 열량은?',
    ('t10', '계산'): '______________은(는) ______________________ 해서 몫이 ________예요.',
    ('t10', '배려'): '친구가 ______________ 때 ______________________.',
    ('t11', '정리'): '몫의 소수점은 ______________. 나눌 수 없으면 ______________.',
    ('t11', '자기 평가'): '나는 ______________은(는) 자신 있고, ______________을(를) 다시 공부하고 싶어요.',
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


# 도전형 '왜 그럴까요?' (차시 id → (물음, 예시 답))
WHY = {
    't1': ('꿀벌 한 마리가 모은 꿀의 양이 0.42 g보다 적은 까닭을 써 보세요.',
           '0.42 g을 꿀벌 3마리가 똑같이 나누어 모았으므로 한 마리의 꿀은 전체를 3으로 나눈 것이라 0.42 g보다 적어요.'),
    't2': ('6.2÷2의 몫이 31이 아니라 3.1인 까닭을 써 보세요.',
           '6.2는 0.1이 62개인 수예요. 62÷2=31이므로 몫은 0.1이 31개인 3.1이에요.'),
    't3': ('4.23÷3에서 4를 3으로 나누고 남은 1을 0.1 10개로 바꾸어 계산하는 까닭을 써 보세요.',
           '남은 1은 3으로 똑같이 나눌 수 없어서 0.1 10개로 바꾸면 0.1이 12개가 되고, 12÷3=4로 계속 나눌 수 있기 때문이에요.'),
    't4': ('1.24÷2의 몫을 .62가 아니라 0.62로 써야 하는 까닭을 써 보세요.',
           '1을 2로 나눌 수 없어 몫의 일의 자리가 0이에요. 일의 자리에 0을 써야 몫이 1보다 작은 0.62라는 것을 바르게 나타낼 수 있어요.'),
    't5': ('2.6÷4에서 2가 남았을 때 0을 내려 계속 계산할 수 있는 까닭을 써 보세요.',
           '2.6=2.60처럼 소수의 오른쪽 끝자리에 0을 붙여도 크기가 같으므로 0을 내려 20÷4=5를 계속 계산할 수 있어요.'),
    't6': ('2.14÷2의 몫이 1.7이 아니라 1.07인 까닭을 써 보세요.',
           '1을 내렸을 때 2로 나눌 수 없어 몫의 소수 첫째 자리에 0을 써야 해요. 2.14는 0.01이 214개이고 214÷2=107이므로 몫은 1.07이에요.'),
    't7': ('3÷4를 계산할 때 3을 3.00으로 생각하는 까닭을 써 보세요.',
           '3은 4로 나눌 수 없지만 3=3.0=3.00처럼 자연수 뒤에 소수점과 0이 있다고 생각하면 0을 내려 30÷4, 20÷4를 계속 계산할 수 있어요.'),
    't8': ('21.8÷4의 몫이 54.5가 아니라 5.45인 까닭을 어림셈으로 설명해 보세요.',
           '21.8을 20으로 어림하면 20÷4=5이므로 몫은 약 5예요. 5.45는 5와 비슷하고 54.5는 너무 커요.'),
    't9': ('1분 동안 소모한 열량을 비교할 때 어림셈을 먼저 하면 좋은 까닭을 써 보세요.',
           '나누는 수가 두 자리 수라 계산이 복잡할 때 어림셈으로 빠르게 크기를 비교하고, 계산한 결과가 알맞은지 확인할 수 있어요.'),
    't10': ('친구가 8.12÷4=2.3이라고 했어요. 잘못된 까닭을 써 보세요.',
            '8÷4=2를 쓰고 1을 내렸는데 1을 4로 나눌 수 없으므로 몫의 소수 첫째 자리에 0을 써야 해요. 바른 몫은 2.03이에요.'),
    't11': ('몫의 소수점 위치를 어림셈으로 확인하면 좋은 까닭을 써 보세요.',
            '어림셈한 결과와 몫의 크기가 비슷한지 보면 소수점을 잘못 찍은 실수를 찾을 수 있기 때문이에요.'),
}
assert (ev('6.2÷2') == Q('3.1') and ev('4.23÷3') == Q('1.41') and ev('1.24÷2') == Q('0.62') and ev('2.6÷4') == Q('0.65')
        and ev('214÷2') == 107 and ev('2.14÷2') == Q('1.07') and ev('3÷4') == Q('0.75') and ev('21.8÷4') == Q('5.45')
        and ev('20÷4') == 5 and ev('8.12÷4') == Q('2.03') and ev('8÷4') == 2)


def run_call(s, lv, call, lid, app):
    w, a = call['w'], call['args']
    if w == 'writeStep':
        return w_write(s, lv, a, lid)
    if w == 'fig':
        fig(s, a[0])
        return []
    if w in ('clip', 'cardgame', 'make'):
        return {'clip': w_clip, 'cardgame': w_cardgame, 'make': w_make}[w](s, lv, a, app)
    return {'sent': w_sent, 'blocks': w_blocks, 'tape': w_tape, 'long': w_long, 'point': w_point, 'pick2': w_pick2,
            'quiz': w_quiz, 'blanks': w_blanks, 'sequence': w_sequence}[w](s, lv, a)


def J(xs):
    return ', '.join(str(x) for x in xs if x not in (None, ''))


def lesson(s, lv, Ls, app):
    head(s, Ls)
    if Ls['id'] == 't1':
        s.scene(None, K(app['story']['lines'][0]))
    parts = []
    for i, st in enumerate(Ls['steps']):
        step(s, i, K(st['name'] or STEP_NAMES[i]))
        s.text(paper(st['inst']))
        if lv == '기본형':
            t = tip(st['hints'])
            if t:
                s.text(t)
        a = []
        for call in st['calls']:
            a += run_call(s, lv, call, Ls['id'], app)
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
            a += run_call(s, lv, call, Ls['id'], app)
        parts.append('%s ★ %s' % (NUM[n + 1], J(a)))
    return '%s차시  ' % Ls['no'] + '  '.join(parts)


def build_tb(app, lv):
    s = Sheet(unit_label=LABEL_TB, level=lv, grade_label='6학년')
    lines = [lesson(s, lv, Ls, app) for Ls in app['lessons']]
    s.answers('【교사용】 3. 소수의 나눗셈(교과서 차시) 활동지 정답 (%s)' % lv, lines,
              note='※ 이 활동지는 앱 u3-decnat.html과 차시 번호가 같습니다. 정답의 ‘62/10’은 분수 10분의 62를 뜻해요. '
                   '소수의 끝자리 0은 생략할 수 있어요. 글쓰기 칸의 ‘예)’는 예시 답이에요.')
    os.makedirs(OUT_TB, exist_ok=True)
    path = os.path.join(OUT_TB, NAME % lv)
    s.save(path)
    return path


# ================================================================ 이야기 버전(st) — '새봄 스포츠 클럽 기록실'
ST_JS = r"""
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const cut = (a, b) => { const i = src.indexOf(a), j = src.indexOf(b); if (i < 0 || j < 0) throw new Error('원본에서 못 찾음: ' + a); return src.slice(i, j); };
const core = cut('/*dn3-core*/', '/*dn3-core-end*/');
const brd = cut('const DN3BOARD', 'const DN3CELLS');
const deck = cut('const DN3DECK', 'function dn3CardGame(');
const mk = cut('const DN3MK', 'function dn3Make(');
const les = src.slice(src.indexOf('//@@LESSONS'));
let REC = [];
const rec = w => function (b, a, ...args) { REC.push({ w, args }); };
const stubs = `
var dn3Sent=rec('sent'), dn3Blocks=rec('blocks'), dn3Long=rec('long'), dn3Tape=rec('tape'), dn3Point=rec('point'), dn3Pick2=rec('pick2'),
 dn3Clip=rec('clip'), dn3CardGame=rec('cardgame'), dn3Make=rec('make'),
 quiz=rec('quiz'), blanks=rec('blanks'), sequence=rec('sequence'), writeStep=rec('writeStep'), panes=rec('panes');
var dn3Style = () => {};
var dn3LongStep = opt => (b, a) => dn3Long(b, a, opt);
var thenWhy = (f, o) => function (b, a) { f(b, a); REC.push({ w: 'thenWhy', args: [o] }); };
var ruleFirst = (f, o) => function (b, a) { REC.push({ w: 'ruleFirst', args: [o] }); f(b, a); };
var wonderRecall = f => function (b, a) { REC.push({ w: 'wonder', args: [] }); f(b, a); };
var dn3Talk = lines => ({ talk: lines }), dn3RelFig = (rows, k) => ({ rel: rows, k }),
 dn3Record = (title, head, rows) => ({ rec2: { title, head, rows } }), dn3sNote = (title, lines) => ({ note: { title, lines } }),
 dn3WithCalc = fig => () => ({ calc: 1, inner: fig ? fig() : null });
`;
const B = () => ({ append: (...xs) => xs.forEach(x => REC.push({ w: 'append', args: [x] })) });
const R = eval(core + '\n' + brd + '\n' + deck + '\n' + mk + '\n' + stubs + '\n' + les +
  '\n;({LESSONS, UNIT_STORY, DN3BOARD, DECK: DN3DECK.map(c => ({ e: c.e, a: c.a })), DN3MK, ' +
  'MKT: DN3MK.filter(a => a.dec).map(a => DN3MK.filter(b => !b.dec).map(b => dn3MakeText(a, b)))})');
const ser = v => JSON.parse(JSON.stringify(v, (k, x) => typeof x === 'bigint' ? String(x) : (typeof x === 'function' ? (x.length === 0 ? x() : undefined) : x)));
const out = R.LESSONS.map(L => {
  const steps = L.steps.map(S => { REC = []; S.render(B(), {}); return { name: S.name || null, inst: S.inst, hints: S.hints || [], calls: ser(REC) }; });
  REC = []; L.challenge.render(B(), {});
  return { id: L.id, no: L.no, title: L.title, soop: L.soop, question: L.question, steps,
    ch: { inst: L.challenge.inst, hints: L.challenge.hints || [], calls: ser(REC) } };
});
process.stdout.write(JSON.stringify({ lessons: out, story: R.UNIT_STORY, board: R.DN3BOARD, deck: R.DECK, mk: R.DN3MK, mkt: R.MKT }));
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
    ('배우는 차례대로 눌러 학습 계획을 세워 보세요.', '배우는 차례대로 기호를 써서 학습 계획을 세워 보세요.'),
    ('몫의 숫자 사이 동그라미를 눌러 소수점을 찍어 보세요.', '몫의 숫자 사이 동그라미 하나를 색칠해 소수점을 찍어 보세요.'),
    ('콩주머니에서 원하는 땅 쪽으로 끌었다가 놓으면 던져져요.',
     '지우개 조각을 ‘던지는 곳’에 놓고 원하는 땅 쪽으로 손가락으로 튕겨요(운동장에서는 콩주머니를 던져요). 도착한 땅의 나눗셈과 몫을 기록표에 쓰면 친구가 계산기로 확인해요.'),
    ('로봇 친구와 번갈아 나눗셈 카드를 뒤집어요. 로봇 친구가 뒤집은 카드는 내가 계산하고, 내가 뒤집은 카드는 로봇 친구의 답을 계산기로 확인해요.',
     '짝과 번갈아 나눗셈 카드를 뒤집어요(아래 카드를 오려서 엎어 놓아요). 짝이 뒤집은 카드는 내가 계산하고, 내가 뒤집은 카드는 짝이 계산한 답을 계산기로 확인해요.'),
]


PAPER_ST_RE = [   # 원본 글이 조금 바뀌어도 맞도록(자르는 물건 이름·도막 수는 그대로 따라감)
    (r'(\S+?)[을를] 눌러 자르는 선을 놓아 똑같이 (\d+)도막으로 잘라 보세요\.', r'\1 그림에 자르는 선을 그어 똑같이 \2도막으로 나누어 보세요.'),
]


def paper_st(t):
    for a, b in PAPER_ST:
        t = t.replace(a, b)
    for a, b in PAPER_ST_RE:
        t = re.sub(a, b, t)
    return paper(t)


def j_eul(w):
    c = ord(w[-1]) - 0xAC00
    return w + ('을' if 0 <= c < 11172 and c % 28 else '를')


def tape_item(o):
    m = re.match(r'(\S+?)[을를] 눌러', o.get('tip') or '')
    return o.get('item') or (m.group(1) if m else '테이프')


EMO = re.compile('[\U00010000-\U0010FFFF☀-➿️‍]')


def noemo(t):
    return re.sub(r'\s{2,}', ' ', EMO.sub('', str(t))).strip()


def note_box(s, nt):
    """이야기 쪽지: 제목 한 줄 + '이름: 내용' 표"""
    s.text('【%s】' % noemo(nt['title']))
    pairs = []
    for ln in nt['lines']:
        t = noemo(K(ln))
        k, sep, v = t.partition(':')
        pairs.append((k.strip(), v.strip()) if sep and len(k) <= 14 else ('·', t))
    s.labeled(pairs, label_mm=30, row_h=3402)


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


def w_tape_st(s, lv, a):
    """결승선 테이프 자르기(dn3Tape) — 그림은 교과서 버전과 같은 m·cm 두 눈금"""
    o = a[0]
    Lcm, part, n = tape_fig(s, o, lv == '기본형')
    it = tape_item(o)
    s.text('아래 cm 자를 보고 %s 똑같이 %d도막으로 자르는 선을 그어 보세요.%s'
           % (j_eul(it), n, ' 첫 번째 선은 그어 두었어요.' if lv == '기본형' else ''))
    out = ['%d cm씩 %d도막(자르는 선 %s cm)' % (part, n, ', '.join(str(part * k) for k in range(1, n)))]
    return out + sent(s, o.get('asks') or [])


def w_make_st(s, lv, app):
    """기록실의 수로 (소수)÷(자연수) 문제 만들기(이야기 앱 DN3MK)"""
    A = [x for x in app['mk'] if x['dec']]
    Bs = [x for x in app['mk'] if not x['dec']]
    s.choices([('나누어지는 수(소수)', '( ' + ' / '.join(x['lab'] for x in A) + ' )'),
               ('나누는 수(자연수)', '( ' + ' / '.join(x['lab'] for x in Bs) + ' )')])
    s.ask('고른 수로 (소수)÷(자연수) 문제를 만들어 써 보세요.', blank=False)
    if lv == '기본형':
        s.fill('(                    )을(를) (                )이(가) 똑같이 나누면 하나에 몇 (     )일까요?')
    else:
        s.lines(2)
    s.ask('식과 답을 써 보세요.', blank=False)
    s.fill('식: (          ) ÷ (        ) = (            )      답: (            )')
    out = []
    for i, x in enumerate(A):
        for j, y in enumerate(Bs):
            q = dec(Q(x['v']) / Q(y['v']))
            assert q is not None, (x, y)
            out.append('%s÷%s=%s %s' % (x['v'], y['v'], q, x['u']))
    return ['예) ' + K(app['mkt'][0][0]) + ' → 만들 수 있는 식: ' + ', '.join(out)]


def run_call_st(s, lv, call, Ls, app):
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
    if w == 'tape':
        return w_tape_st(s, lv, a)
    if w == 'blocks':
        return w_blocks(s, lv, a, cnt_ok=True)
    if w == 'make':
        return w_make_st(s, lv, app)
    return run_call(s, lv, call, Ls['id'], app)


def lesson_st(s, lv, Ls, app):
    head(s, Ls)
    if Ls['id'] == 's1':
        s.scene(None, K(app['story']['lines'][0]))
    parts = []
    for i, st in enumerate(Ls['steps']):
        step(s, i, K(st['name'] or STEP_NAMES[i]))
        s.text(paper_st(st['inst']))
        if lv == '기본형':
            t = tip(st['hints'])
            if t:
                s.text(t)
        a = []
        for call in st['calls']:
            a += run_call_st(s, lv, call, Ls, app)
        parts.append('%s %s' % (NUM[i], J(a)))
    if lv == '도전형':
        n = len(Ls['steps'])
        s.step('%s 도전 계단' % NUM[n], '★ 도전 문제')
        s.text(paper_st(Ls['ch']['inst']))
        a = []
        for call in Ls['ch']['calls']:
            a += run_call_st(s, lv, call, Ls, app)
        parts.append('%s ★ %s' % (NUM[n], J(a)))
    return '%s차시  ' % Ls['no'] + '  '.join(parts)


def build_st(app, lv):
    s = Sheet(unit_label=LABEL_ST, level=lv, grade_label='6학년')
    lines = [lesson_st(s, lv, Ls, app) for Ls in app['lessons']]
    s.answers('【교사용】 3. 소수의 나눗셈(이야기 버전) 활동지 정답 (%s)' % lv, lines,
              note='※ 이 활동지는 앱 u3-decnat.html과 차시 번호가 같습니다. 정답의 ‘69/10’은 분수 10분의 69를 뜻해요. '
                   '소수의 끝자리 0은 생략할 수 있어요. 글쓰기 칸의 ‘예)’는 예시 답이에요.')
    os.makedirs(OUT_ST, exist_ok=True)
    path = os.path.join(OUT_ST, NAME % lv)
    s.save(path)
    return path


# ================================================================ 도전형: ①~⑤(도전하기 앞의 모든 칸)를 새 문제로(2026-10-30)
# 기본형은 앱에서 읽은 그대로 두고, 도전형은 같은 칸 이름·같은 부품(수 모형·세로셈·막대·어림셈 …)에 새 수와 새 물음을 넣은
# 기록(HARD_TB·HARD_ST)으로 바꿉니다. 몫은 아래 hn()이 ev()로 계산해 넣고, 식 줄은 sent()·verify_n()이 다시 확인합니다.
import copy  # noqa: E402


def _c(w, *args):
    return {'w': w, 'args': list(args)}


def hn(e):
    v = dec(ev(e))
    assert v is not None, e
    return {'n': v, 'e': e}


def hk(v):
    return {'n': str(v)}


def ho(o, a=0):
    return {'o': list(o), 'a': a}


def hm(o, a):
    return {'m': list(o), 'a': list(a)}


def hf(n, d):
    return {'f': [str(n), str(d)]}


def frow(a, b):
    """'8.48 ÷ 4 = [848/100] ÷ 4 = [(848÷4)/100] = [212/100] = 2.12' 꼴 한 줄"""
    k = len(a.split('.')[1]) if '.' in a else 0
    A, D = int(a.replace('.', '')), 10 ** k
    q = Fraction(A, int(b))
    assert q.denominator == 1, (a, b)
    return ['%s ÷ %s =' % (a, b), hf(A, D), '÷ %s = [(%d÷%s)/%d] =' % (b, A, b, D), hf(q.numerator, D), '=', hn('%s÷%s' % (a, b))]


def rrow(a, b):
    """'1236 ÷ 6 = 206 → 12.36 ÷ 6 = 2.06' 꼴 한 줄"""
    k = len(a.split('.')[1]) if '.' in a else 0
    A = int(a.replace('.', ''))
    return ['%d ÷ %s =' % (A, b), hn('%d÷%s' % (A, b)), '→ %s ÷ %s =' % (a, b), hn('%s÷%s' % (a, b))]


def LONG(probs, rows=(), talk=None):
    o = {'probs': [{'a': a, 'b': b} if isinstance(a, str) else a for a, b in probs], 'rows': list(rows)}
    if talk:
        o['talk'] = talk
    return _c('long', o)


def BLOCKS(a, k, grp, asks, cnt=None):
    o = {'a': a, 'k': k, 'grp': grp, 'asks': asks}
    if cnt:
        o['cnt'] = cnt
    return _c('blocks', o)


def SENT(rows, fig=None):
    return _c('sent', rows, {'fig': fig} if fig else {})


def QUIZ(*items):
    return _c('quiz', [dict(q=q, o=o, a=a, **({'fig': f} if f else {})) for q, o, a, f in [(it + (None,))[:4] for it in items]], {})


def BLANKS(*parts):
    return _c('blanks', [p if isinstance(p, str) else {'o': p[0], 'a': p[1] if len(p) > 1 else 0} for p in parts])


def WRITE(*items):
    return _c('writeStep', [{'q': q, 'tag': tag, 'ph': ph, 'ans': re.sub(r'^예\)\s*', '', ph)} for q, tag, ph in items])


def POINT(items, asks=()):
    return _c('point', {'items': [{'e': e, 'est': {'lab': lab, 'o': o, 'a': a}} for e, lab, o, a in items], 'asks': list(asks)})


def TWHY(q, ans):
    return _c('thenWhy', {'q': q, 'ans': ans})


def RFIRST(q, ans):
    return _c('ruleFirst', {'q': q, 'ans': ans})


def REC(name, rows):
    return {'record': name, 'rows': rows}


def harden(app, ids):
    """도전형: 차시마다 칸(step)의 안내 글과 활동을 HARD_*의 새 문제로 바꿈(칸 이름은 그대로)"""
    app = copy.deepcopy(app)
    H = HARD_TB if ids == 'tb' else HARD_ST
    for L in app['lessons']:
        new = H[L['id']]
        assert len(new) == len(L['steps']), ('도전형 칸 수가 앱과 달라요', L['id'], len(new), len(L['steps']))
        for st_, (inst, calls) in zip(L['steps'], new):
            st_['inst'], st_['calls'], st_['hints'] = inst, calls, []
    return app


HARD_TB = {
    't1': [
        ('꿀벌 4마리가 똑같은 양의 꿀을 모아 0.96 g이 되었어요. 한 마리가 모은 꿀의 양을 생각해 보세요. (답은 뒤에서 배운 뒤에 구해요.)', [QUIZ(
            ('한 마리가 모은 꿀의 양을 구하는 식은 무엇일까요?', ['0.96÷4', '0.96×4', '4÷0.96'], 0),
            ('한 마리가 모은 꿀의 양은 어느 범위에 있을까요?', ['0.1 g과 0.5 g 사이', '1 g보다 많아요', '0.01 g보다 적어요'], 0))]),
        ('축제에서 똑같이 나누는 일을 살펴보고, 소수의 나눗셈이 필요한 상황을 찾아보세요.', [QUIZ(
            ('소수의 나눗셈이 필요한 상황을 모두 골라 보세요.', ['떡 2.4 kg을 접시 6개에 똑같이 나누어 담기', '투호살 5개의 길이를 모두 더하기',
                                               '식혜 4.5 L를 병 3개에 똑같이 나누어 담기', '윷을 던져 나온 모양 세기', '끈 7.2 m를 8도막으로 똑같이 자르기'], [0, 2, 4]),
            ('위에서 고른 나눗셈 가운데 몫이 1보다 작은 것을 모두 골라 보세요.', ['2.4÷6', '4.5÷3', '7.2÷8'], [0, 2]))]),
        ('이 단원에서 배울 나눗셈의 모양을 미리 살펴보고, 알맞은 말을 골라 보세요.', [SENT([
            ['3.48÷4는 몫이', ho(['1보다 작은', '1보다 큰']), '(소수)÷(자연수)예요.'],
            ['7÷4는', ho(['(자연수)÷(자연수)', '(소수)÷(자연수)']), '예요.'],
            ['8.32÷8의 몫은 소수 첫째 자리에', ho(['0이 있어요', '0이 없어요']), '.'],
            ['5.1÷6은 나누어떨어지게 하려면 소수점 아래에', ho(['0을 내려 계산해야 해요', '0을 내리지 않아도 돼요']), '.']])]),
        ('5학년과 6학년 1학기에 배운 분수와 소수의 관계, (소수)×(자연수), (분수)÷(자연수)를 떠올려 보세요.', [SENT([
            ['[9/100]을 소수로 나타내면', hn('[9/100]')], ['[137/100]을 소수로 나타내면', hn('[137/100]')],
            ['0.054를 분수로 나타내면', hf(54, 1000)], ['2.35 × 4 =', hn('2.35×4')], ['[9/10] ÷ 3 = [(9÷3)/10] =', hf(3, 10)]])]),
        ('축제와 관련지어 소수의 나눗셈이 필요한 상황을 만들어 보세요.', [WRITE(
            ('전통 놀이 하나를 골라, 그 놀이에서 소수를 자연수로 나누어야 하는 상황을 만들어 써 보세요.', '상황',
             '예) 제기차기 제기를 만들 때 한지 0.6 m를 3명이 똑같이 나누어 쓰면 한 명이 쓰는 한지의 길이를 알아볼 때'),
            ('만든 상황에서 몫이 1보다 큰지 작은지 어림하고, 그렇게 생각한 까닭을 써 보세요.', '어림',
             '예) 0.6을 3으로 나누면 0.6보다 작아지므로 몫은 1보다 작아요.'))]),
    ],
    't2': [
        ('“송편 반죽 8.4 kg을 네 덩어리로 똑같이 나누었습니다. 한 덩어리의 무게는 몇 kg일까요?” 수 모형 8.4를 네 덩어리에 똑같이 나누어 보세요.', [BLOCKS('8.4', 4, '덩어리', [
            ['반죽 한 덩어리의 무게를 구하는 식은', ho(['8.4÷4', '4÷8.4', '8.4×4'])],
            ['8을 4로 나눈 몫은', hn('8÷4'), '이고, 0.1의 개수인 4를 4로 나눈 몫은', hn('4÷4'), '이에요.'],
            ['반죽 한 덩어리의 무게는', hn('8.4÷4'), 'kg이에요.']])]),
        ('9.6÷3을 세로셈으로 계산하고, 자연수의 나눗셈과 견주어 보세요.', [LONG([('9.6', '3')], [
            ['96 ÷ 3 = 32이므로 9.6 ÷ 3의 몫은 32의', ho(['[1/10]배', '10배']), '인', hn('9.6÷3'), '이에요.']])]),
        ('소수 두 자리 수도 분수의 나눗셈으로 계산해 보세요.', [SENT([
            {'g': '분수의 나눗셈으로 계산하기', 'rows': [frow('8.48', '4'), frow('36.9', '3')]},
            {'q': '6.39÷3을 바르게 계산한 것을 모두 골라 보세요.', 'p': [hm(['6.39÷3 = 2.13', '6.39÷3 = [639/100]÷3 = [213/100]', '6.39÷3 = 21.3'], [0, 1])]}])]),
        ('몫이 1보다 크고 각 자리에서 나누어떨어지는 (소수)÷(자연수)의 계산 방법을 새 예로 정리해 보세요.', [BLANKS(
            '64.8÷2는 소수 한 자리 수이므로 분모가 ', (['10', '100'],), '인 분수로 바꾸어 계산하면 몫은 ', (['32.4', '3.24', '324'],),
            '이고, 몫의 소수점은 ', (['나누어지는 수', '나누는 수'],), '의 소수점에 맞추어 찍어요.')]),
        ('계산해 보세요.', [LONG([('64.8', '2'), ('6.84', '2')], [frow('55.5', '5'), frow('9.36', '3')])]),
    ],
    't3': [
        ('“찹쌀 5.76 kg을 세 모둠에 똑같이 나누어 주었습니다. 한 모둠의 찹쌀은 몇 kg일까요?” 수 모형 5.76을 세 모둠에 똑같이 나누어 보세요.', [BLOCKS('5.76', 3, '모둠', [
            ['한 모둠의 찹쌀의 무게를 구하는 식은', ho(['5.76÷3', '3÷5.76', '5.76×3'])],
            ['5를 3으로 나누면 몫이 1이고, 남은 2를 0.1 20개로 바꾸면 0.1은 모두', hn('20+7'), '개예요.'],
            ['0.1의 개수 27을 3으로 나눈 몫은', hn('27÷3'), ', 0.01의 개수 6을 3으로 나눈 몫은', hn('6÷3'), '이에요.'],
            ['한 모둠의 찹쌀은', hn('5.76÷3'), 'kg이에요.']])]),
        ('7.44÷4를 세로셈으로 계산해 보세요.', [LONG([('7.44', '4')], [['7.44 ÷ 4 =', hn('7.44÷4')]])]),
        ('분수의 나눗셈과 0.01의 개수로 계산해 보세요.', [SENT([
            {'g': '분수의 나눗셈으로 계산하기', 'rows': [frow('8.52', '6')]},
            {'g': '0.01의 개수로 계산하기', 'rows': [['9.45는 0.01이', hk(945), '개 → 945 ÷ 5 =', hn('945÷5'), '→ 0.01이 189개이므로', hk('1.89')]]}])]),
        ('각 자리에서 나누어떨어지지 않는 (소수)÷(자연수)의 계산 방법을 새 예로 정리해 보세요.', [BLANKS(
            '5.76÷3에서 5를 3으로 나누고 남은 2는 0.1 ', (['20개', '2개'],), '로 바꾸어 0.1이 ', (['27개', '7개'],), '가 되게 해요. 이렇게 계속 나누면 몫은 ',
            (['1.92', '19.2', '0.192'],), '예요.')]),
        ('계산해 보세요.', [LONG([('9.12', '8'), ('17.64', '7')], [frow('11.34', '6'), frow('20.16', '9')])]),
    ],
    't4': [
        ('“점토 2.94 kg을 세 덩어리로 똑같이 나누었습니다. 점토 한 덩어리의 무게는 몇 kg일까요?” 수 모형 2.94를 세 덩어리에 똑같이 나누어 보세요.', [BLOCKS('2.94', 3, '덩어리', [
            ['2를 3으로 나눌 수 없으므로 2를 0.1 20개로 바꾸면 0.1은', hn('20+9'), '개예요.'],
            ['0.1 29개를 3으로 나누면 한 덩어리에', hk(9), '개씩이고 0.1이', hk(2), '개 남아요.'],
            ['남은 0.1 2개를 0.01 20개로 바꾸면 0.01은', hn('20+4'), '개 → 24 ÷ 3 =', hn('24÷3')],
            ['점토 한 덩어리의 무게는', hn('2.94÷3'), 'kg이에요. 몫이 1보다', ho(['작아요', '커요'])]])]),
        ('3.15÷5를 세로셈으로 계산해 보세요.', [LONG([('3.15', '5')], [['3.15 ÷ 5 =', hn('3.15÷5'), '이고, 몫의 일의 자리에는', ho(['0을 써요', '3을 써요'])]])]),
        ('분수의 나눗셈으로 계산하고, 친구의 실수를 고쳐 보세요.', [SENT([
            {'g': '분수의 나눗셈으로 계산하기', 'rows': [frow('5.04', '6')]},
            {'q': '어떤 친구가 4.38÷6의 몫을 ‘.73’이라고 썼어요. 바르게 고친 것은?', 'p': [ho(['0.73', '7.3', '73'])]}])]),
        ('몫이 1보다 작은 (소수)÷(자연수)의 계산 방법을 새 예로 정리해 보세요.', [BLANKS(
            '6.72÷8은 6을 8로 나눌 수 없으므로 몫의 일의 자리에 ', (['0', '6'],), '을 쓰고, 0.1의 개수 ', (['67', '6'],), '을 8로 나누어 계산해요. 몫은 ',
            (['0.84', '8.4', '0.084'],), '예요.')]),
        ('계산해 보세요.', [LONG([('5.6', '7'), ('7.38', '9')], [frow('2.16', '4'), frow('6.12', '9')])]),
    ],
    't5': [
        ('“길이가 3.4 m인 대나무를 4개로 똑같이 나누어 투호살을 만들었습니다. 투호살 한 개의 길이는 몇 m일까요?” 대나무 그림에 자르는 선을 그어 똑같이 4도막으로 나누어 보세요. 아래 자는 같은 길이를 cm로 나타낸 것이에요.', [
            _c('tape', {'m': '3.4', 'n': 4, 'snap': 5, 'asks': [
                ['투호살 한 개의 길이를 구하는 식은', ho(['3.4÷4', '4÷3.4', '3.4×4'])],
                ['3.4 m =', hk(340), 'cm이고, 340 ÷ 4 =', hn('340÷4'), '이므로 한 도막은 85 cm예요.'],
                ['85 cm =', hk('0.85'), 'm → 3.4 ÷ 4 =', hn('3.4÷4')]]})]),
        ('4.2÷8을 세로셈으로 계산해 보세요. 나머지가 남으면 0을 내려 끝까지 나누어요.', [LONG([('4.2', '8')], [
            ['4.2 ÷ 8 =', hn('4.2÷8'), '이고, 계산하는 동안 0을', ho(['두 번', '한 번', '세 번']), '내렸어요.']])]),
        ('자연수의 나눗셈을 이용하여 계산해 보세요.', [SENT([rrow('7.3', '2'), rrow('8.7', '6'),
                                         ['7.3 ÷ 2를 계산할 때 7.3을', ho(['7.30', '73']), '으로 생각하고 0을 내려요.']])]),
        ('소수점 아래 0을 내려 계산하는 (소수)÷(자연수)의 계산 방법을 새 예로 정리해 보세요.', [BLANKS(
            '9.4÷4를 계산할 때 나머지 2가 남으면 9.4를 ', (['9.40', '94'],), '으로 생각하고 0을 내려 계산해요. 그래서 몫은 ', (['2.35', '2.3', '23.5'],), '예요.')]),
        ('계산해 보세요.', [LONG([('7.8', '4'), ('1.3', '4')], [rrow('11.5', '2'), rrow('3.9', '6')])]),
    ],
    't6': [
        ('“식혜 4.18 L를 병 2개에 똑같이 나누어 담으려고 합니다. 병 한 개에 담을 수 있는 식혜의 양은 몇 L일까요?” 수 모형 4.18을 병 2개에 똑같이 나누어 보세요.', [BLOCKS('4.18', 2, '병', [
            ['4를 2로 나눈 몫은', hn('4÷2'), '이에요.'],
            ['0.1은 1개뿐이라 병 2개에 똑같이 나눌 수 없어서 병마다 0.1은', hk(0), '개예요.'],
            ['4.18 L는 0.01 L가', hk(418), '개 → 418 ÷ 2 =', hn('418÷2')],
            ['병 한 개에', hn('4.18÷2'), 'L를 담을 수 있어요.']])]),
        ('9.27÷3을 세로셈으로 계산해 보세요.', [LONG([('9.27', '3')], [['9.27 ÷ 3 =', hn('9.27÷3'), '에서 몫의 소수 첫째 자리 숫자는', hk(0), '이에요.']])]),
        ('1015÷5=203을 이용하여 10.15÷5를 계산하고, 친구의 실수를 찾아보세요.', [SENT([
            {'fig': {'rel': [['1015', '5', '203'], ['10.15', '5', '?']], 'k': 100}}, rrow('10.15', '5'),
            {'q': '어떤 친구가 12.24÷4의 몫을 3.6이라고 했어요. 바른 몫은 무엇일까요?', 'p': [ho(['3.06', '30.6', '0.306'])]}])]),
        ('몫의 소수 첫째 자리에 0이 있는 (소수)÷(자연수)의 계산 방법을 새 예로 정리해 보세요.', [BLANKS(
            '8.4÷8에서 8을 8로 나눈 몫 1을 쓰고 4를 내렸더니 8로 나눌 수 없으므로 몫의 소수 첫째 자리에 ', (['0', '4'],),
            '을 쓰고 0을 하나 내려 계산해요. 몫은 ', (['1.05', '1.5', '10.5'],), '이에요.')]),
        ('계산해 보세요.', [LONG([('9.18', '9'), ('15.3', '5')], [rrow('12.36', '6'), rrow('48.4', '8')])]),
    ],
    't7': [
        ('“크기가 같은 한지 7장을 4명이 똑같이 나누어 가지려고 합니다. 한 명이 가질 수 있는 한지의 양은 얼마일까요?” 수 모형 1을 한지 1장이라고 생각하고 4명에게 똑같이 나누어 보세요.', [BLOCKS('7', 4, '사람', [
            ['한 명이 가질 수 있는 한지의 양을 구하는 식은', ho(['7÷4', '4÷7', '7×4'])],
            ['700 ÷ 4 =', hn('700÷4'), '→ 7 ÷ 4 =', hn('7÷4'), '이므로 한 명이 1.75장을 가질 수 있어요.']], cnt='명')]),
        ('9÷8의 몫을 소수로 나타내어 보세요. 9000÷8을 이용하고, 세로셈으로도 계산해 보세요.', [LONG([('9', '8')], [
            ['9000 ÷ 8 =', hn('9000÷8'), '→ 9 ÷ 8 =', hn('9÷8'), '(나누어지는 수가 [1/1000]배)']])]),
        ('몫을 분수로 나타낸 다음 소수로 나타내고, 계산 방법을 따져 보세요.', [SENT([
            {'g': '분수로 나타낸 다음 소수로 나타내기', 'rows': [['7 ÷ 20 =', hf(7, 20), '= [(7×5)/(20×5)] =', hf(35, 100), '=', hn('7÷20')]]},
            {'q': '11÷4를 소수로 나타낼 때 110÷4가 아니라 1100÷4를 이용하는 까닭은 무엇일까요?', 'p': [ho(['110÷4는 나누어떨어지지 않기 때문이에요.', '1100이 가장 큰 수이기 때문이에요.', '4가 짝수이기 때문이에요.'])]}])]),
        ('(자연수)÷(자연수)의 몫을 소수로 나타내는 방법을 새 예로 정리해 보세요.', [BLANKS(
            '5÷8의 몫을 소수로 나타낼 때 5를 ', (['5.000', '50'],), '으로 생각하고 0을 세 번 내려 계산하면 몫은 ', (['0.625', '6.25', '62.5'],), '이에요.')]),
        ('나눗셈의 몫을 소수로 나타내어 보세요.', [LONG([('17', '4'), ('3', '8')], [['900 ÷ 12 =', hn('900÷12'), '→ 9 ÷ 12 =', hn('9÷12')], ['7 ÷ 25 =', hf(7, 25), '=', hf(28, 100), '=', hn('7÷25')]])]),
    ],
    't8': [
        ('“떡 31.2 kg을 바구니 4개에 똑같이 나누어 담으려고 합니다.” 어림셈하고 몫 7 8에 소수점을 찍은 뒤, 계산기로 확인해 보세요.', [POINT(
            [('31.2÷4', '32÷4', ['0.8', '8', '80'], 1)],
            [['어림셈한 결과를 이용하면 옳은 식은', ho(['31.2÷4=78', '31.2÷4=7.8', '31.2÷4=0.78'], 1)], ['계산기로 31.2÷4를 계산하면', hn('31.2÷4')]])]),
        ('어림셈한 결과를 이용하여 몫의 소수점을 찍어 보세요.', [POINT([
            ('27.6÷6', '30÷6', ['0.5', '5', '50'], 1), ('62.4÷8', '64÷8', ['0.8', '8', '80'], 1),
            ('91.8÷9', '90÷9', ['1', '10', '100'], 1), ('47.5÷5', '50÷5', ['1', '10', '100'], 1)])]),
        ('어림셈한 결과를 이용하여 몫의 소수점을 잘못 찍은 사람을 찾고, 바르게 고쳐 보세요.', [QUIZ(
            ('몫의 소수점을 잘못 찍은 사람은 누구일까요?', ['서희', '연우'], 0,
             {'talk': [['서희:', '“5일 동안 우유 9.35 L를 똑같이 나누어 마셨다면” → 9.35÷5를 어림셈하면 하루에 18.7 L를 마신 거야.'],
                       ['연우:', '“쌀 14.4 kg을 6봉지에 똑같이 나누면” → 14.4÷6을 어림셈하면 한 봉지에 2.4 kg이야.']]}),
            ('서희의 답을 바르게 고친 것은?', ['1.87 L', '0.187 L', '187 L'], 0),
            ('25.2÷4의 몫이 6.3인지 어림셈으로 확인하는 방법으로 알맞은 것은?', ['25.2를 24로 어림하면 24÷4=6이므로 몫은 약 6이에요.', '25.2를 250으로 어림해요.', '4를 40으로 어림해요.'], 0))]),
        ('어림셈한 결과를 이용하여 몫의 소수점 위치를 확인하는 방법을 새 예로 정리해 보세요.', [BLANKS(
            '나누어지는 수를 어림하기 쉬운 ', (['자연수', '분수'],), '로 바꾸어 어림셈해요. 예를 들어 44.4÷6을 42÷6으로 어림셈하면 약 7이므로 44.4÷6의 몫은 ',
            (['7.4', '74', '0.74'],), '예요.')]),
        ('어림셈한 결과를 이용하여 몫의 소수점을 찍고, 알맞은 몫을 골라 보세요.', [POINT(
            [('56.7÷7', '56÷7', ['0.8', '8', '80'], 1), ('38.4÷4', '40÷4', ['1', '10', '100'], 1)],
            [['4.32 ÷ 6의 몫은', ho(['720', '72', '7.2', '0.72'], 3)], ['71.4 ÷ 7의 몫은', ho(['1020', '102', '10.2', '1.02'], 2)]])]),
    ],
    't9': [
        ('지호의 운동 기록이에요. 1분 동안 소모한 열량을 어림셈해 보세요. 어림셈만으로 정하기 어려운 운동도 찾아보세요.', [SENT([
            ['배드민턴: 77.7 ÷ 21 → 80 ÷ 20 = 약', hn('80÷20')], ['줄넘기: 98.4 ÷ 12 → 100 ÷ 10 = 약', hn('100÷10')],
            ['걷기: 52.7 ÷ 17 → 51 ÷ 17 = 약', hn('51÷17')], ['수영: 141 ÷ 15 → 150 ÷ 15 = 약', hn('150÷15')],
            {'q': '어림셈으로 보면 1분 동안 소모한 열량이 가장 많을 것 같은 운동은 무엇일까요? 어림한 값이 같은 두 운동을 모두 골라 보세요.', 'p': [hm(['배드민턴', '줄넘기', '걷기', '수영'], [1, 3])]}],
            REC('지호', [['6/3', '배드민턴', '77.7', '21'], ['6/4', '줄넘기', '98.4', '12'], ['6/5', '걷기', '52.7', '17'], ['6/6', '수영', '141', '15']]))]),
        ('계산기로 1분 동안 소모한 열량을 정확하게 구해 어림셈으로 정하지 못한 운동을 가려 보세요.', [SENT([
            ['배드민턴: 77.7 ÷ 21 =', hn('77.7÷21')], ['줄넘기: 98.4 ÷ 12 =', hn('98.4÷12')], ['걷기: 52.7 ÷ 17 =', hn('52.7÷17')], ['수영: 141 ÷ 15 =', hn('141÷15')],
            ['1분 동안 가장 많은 열량을 소모한 운동은', ho(['배드민턴', '줄넘기', '걷기', '수영'], 3), '이에요.']],
            {'calc': 1, 'inner': REC('지호', [['6/3', '배드민턴', '77.7', '21'], ['6/4', '줄넘기', '98.4', '12'], ['6/5', '걷기', '52.7', '17'], ['6/6', '수영', '141', '15']])})]),
        ('서아의 운동 기록이에요. 1분 동안 가장 적은 열량을 소모한 운동을 어림셈으로 찾아보세요.', [SENT([
            ['탁구: 50.4 ÷ 14 → 56 ÷ 14 = 약', hn('56÷14')], ['달리기: 151.2 ÷ 16 → 160 ÷ 16 = 약', hn('160÷16')], ['훌라후프: 39.6 ÷ 9 → 36 ÷ 9 = 약', hn('36÷9')],
            ['어림셈으로 1분 동안 가장 적은 열량을 소모한 운동은', ho(['탁구', '훌라후프', '어림셈만으로는 정하기 어려워요'], 2)]],
            REC('서아', [['6/10', '탁구', '50.4', '14'], ['6/11', '달리기', '151.2', '16'], ['6/12', '훌라후프', '39.6', '9']]))]),
        ('계산기로 서아의 운동별 1분 동안 소모한 열량을 구하고, 가장 적은 운동을 찾아보세요.', [SENT([
            ['탁구: 50.4 ÷ 14 =', hn('50.4÷14')], ['달리기: 151.2 ÷ 16 =', hn('151.2÷16')], ['훌라후프: 39.6 ÷ 9 =', hn('39.6÷9')],
            ['1분 동안 가장 적은 열량을 소모한 운동은', ho(['탁구', '달리기', '훌라후프']), '이고, 두 번째로 적은 운동보다', hn('39.6÷9-50.4÷14'), '킬로칼로리 적어요.']],
            {'calc': 1, 'inner': REC('서아', [['6/10', '탁구', '50.4', '14'], ['6/11', '달리기', '151.2', '16'], ['6/12', '훌라후프', '39.6', '9']])})]),
        ('문제를 해결한 과정을 되돌아보세요.', [WRITE(
            ('어림셈한 값이 같아서 운동을 고르지 못했을 때 어떻게 했는지 써 보세요.', '어림셈',
             '예) 어림셈한 값이 같은 두 운동은 계산기로 정확하게 계산해서 더 큰 값을 골랐어요.'),
            ('1분 동안 소모한 열량이 지호의 수영보다 많아지려면 줄넘기를 12분 동안 몇 킬로칼로리보다 많이 소모해야 하는지 구하고 방법을 써 보세요.', '거꾸로 생각하기',
             '예) 수영은 1분에 9.4 킬로칼로리이므로 9.4×12=112.8, 줄넘기 12분 동안 112.8 킬로칼로리보다 많이 소모해야 해요.'))]),
    ],
    't10': [
        ('놀이 방법을 다시 읽고 답해 보세요(2명, 준비물: 놀이판·색연필·클립·계산기·타이머). 클립을 튕겨 도착한 땅의 나눗셈을 옳게 계산하면 그 땅을 색칠해요.', [QUIZ(
            ('클립이 놀이판 밖으로 나가면 어떻게 하나요?', ['클립을 발사 칸에 놓고 다시 한번 튕겨요.', '상대방이 땅을 하나 색칠해요.', '놀이가 끝나요.'], 0),
            ('상대방은 내 답이 맞는지 어떻게 확인하나요?', ['계산기로 확인해요.', '눈으로 어림만 해요.', '확인하지 않아요.'], 0),
            ('정해진 시간이 끝났을 때 이기는 사람은 누구인가요?', ['더 많은 땅을 색칠한 사람', '먼저 시작한 사람', '마지막에 계산한 사람'], 0))]),
        ('놀이판에 나올 만한 어려운 나눗셈을 미리 계산해 보세요.', [LONG([('10.35', '5'), ('7.2', '5')], [
            ['9 ÷ 8 =', hn('9÷8'), ', 0.9 ÷ 6 =', hn('0.9÷6'), ', 24.6 ÷ 4 =', hn('24.6÷4')]])]),
        ('놀이판의 땅이라고 생각하고 계산해 보세요. 친구의 답이 맞는지도 확인해요.', [SENT([
            ['13.2 ÷ 8 =', hn('13.2÷8')], ['0.78 ÷ 6 =', hn('0.78÷6')], ['20.4 ÷ 5 =', hn('20.4÷5')], ['7 ÷ 28 =', hn('7÷28')],
            {'q': '친구가 20.4÷5 = 4.8이라고 했어요. 친구의 답은 옳은가요?', 'p': [ho(['틀렸어요', '맞아요'])]}])]),
        ('나눗셈 카드 놀이에서 뒤집은 카드라고 생각하고 몫을 구해 보세요.', [SENT([
            ['카드 3.12÷6의 몫은', hn('3.12÷6')], ['카드 14.7÷7의 몫은', hn('14.7÷7')], ['카드 9÷12의 몫은', hn('9÷12')], ['카드 5.04÷9의 몫은', hn('5.04÷9')],
            {'q': '친구가 카드 6.06÷6을 1.1이라고 계산했어요. 바른 몫은 무엇일까요?', 'p': [ho(['1.01', '1.1', '10.1'])]}])]),
        ('놀이를 되돌아보세요.', [WRITE(
            ('놀이에서 몫의 소수 첫째 자리에 0을 써야 했던 나눗셈을 하나 골라 계산 방법을 써 보세요.', '계산',
             '예) 6.06÷6은 6을 6으로 나눈 뒤 0을 내렸는데 6으로 나눌 수 없어서 몫의 소수 첫째 자리에 0을 써요. 몫은 1.01이에요.'),
            ('놀이에서 이기려면 어떤 땅을 먼저 고르면 좋을지 까닭과 함께 써 보세요.', '작전',
             '예) 계산이 쉬운 땅을 먼저 골라 빠르게 색칠하고, 계산기 표시가 있는 땅은 시간이 남을 때 골라요.'))]),
    ],
    't11': [
        ('자연수의 나눗셈과 분수의 나눗셈을 이용하여 계산해 보세요.', [SENT([
            ['72 ÷ 12 =', hn('72÷12'), '→ 0.72 ÷ 12 =', hn('0.72÷12'), '(나누어지는 수와 몫이 모두', ho(['[1/100]배', '[1/10]배']), ')'],
            ['930 ÷ 6 =', hn('930÷6'), '→ 9.3 ÷ 6 =', hn('9.3÷6'), '(나누어지는 수와 몫이 모두', ho(['[1/10]배', '[1/100]배'], 0), ')'],
            {'g': '보기: 9.36 ÷ 4 = [936/100] ÷ 4 = [(936÷4)/100] = [234/100] = 2.34', 'rows': [frow('14.28', '4'), frow('22.75', '7')]}])]),
        ('계산해 보세요.', [LONG([('15.12', '6'), ('0.9', '4')], [['5.28 ÷ 6 =', hn('5.28÷6'), ', 8.4 ÷ 8 =', hn('8.4÷8')]])]),
        ('27.6÷4를 어림셈한 결과를 이용하여 옳은 식을 찾고, 9÷40의 몫을 두 가지 방법으로 소수로 나타내어 보세요.', [LONG(
            [({'a': '9', 'b': '40', 'cap': '세로셈: 9 ÷ 40'}, None)],
            [['27.6÷4를 28÷4로 어림셈하면 약 7 → 옳은 식은', ho(['㉠ 27.6÷4=69', '㉡ 27.6÷4=6.9', '㉢ 27.6÷4=0.69'], 1)],
             {'g': '분수로 나타낸 다음 소수로 나타내기', 'rows': [['9 ÷ 40 =', hf(9, 40), '= [(9×25)/(40×25)] =', hf(225, 1000), '=', hn('9÷40')]]}])]),
        ('생활 속 (소수)÷(자연수) 문제를 풀고, 직접 만들어 보세요.', [
            SENT([{'q': '페인트 4.56 L를 벽 6곳에 똑같이 나누어 칠하려고 해요. 한 곳에 칠할 페인트는 몇 L일까요?', 'p': ['4.56 ÷ 6 =', hn('4.56÷6'), '(L)']},
                  {'q': '길이가 3.75 m인 끈을 5도막으로 똑같이 자르면 한 도막은 몇 m일까요?', 'p': ['3.75 ÷ 5 =', hn('3.75÷5'), '(m)']}]),
            WRITE(('수 3.36과 8을 이용하여 (소수)÷(자연수) 문제를 만들고 식과 답을 써 보세요.', '문제 만들기', '예) 리본 3.36 m를 8명이 똑같이 나누어 가지면 한 명은 몇 m를 가질까요? 3.36÷8=0.42(m)'))]),
        ('3.9÷3으로 소수의 나눗셈을 계산하는 세 가지 방법과 몫의 소수점 위치 확인 방법을 정리해 보세요.', [SENT([
            {'g': '방법 1 · 세로로 나타내어 계산하기', 'rows': [['3을 3으로 나눈 몫을 쓰고, 3.9의 소수점에 맞추어 점을 찍은 뒤 0.1의 개수인 9를 3으로 나눈 몫을 써요. → 3.9 ÷ 3 =', hn('3.9÷3')]]},
            {'g': '방법 2 · 분수의 나눗셈으로 나타내어 계산하기', 'rows': [frow('3.9', '3')]},
            {'g': '방법 3 · 자연수의 나눗셈을 이용하여 계산하기', 'rows': [['39 ÷ 3 = 13 → 나누어지는 수가', ho(['[1/10]배', '10배']), '가 되면 몫도 [1/10]배가 되므로 3.9 ÷ 3 = 1.3']]},
            {'g': '몫의 소수점 위치 확인하기', 'rows': [['47.6 ÷ 4를 48 ÷ 4로 어림셈하면 약', hn('48÷4'), '이므로 몫은', ho(['1.19', '11.9', '119'], 1), '이에요.']]}])]),
    ],
}


def NOTE(title, lines):
    return _c('append', {'note': {'title': title, 'lines': lines}})


REC9 = {'rec2': {'title': '클럽 친구들의 새 훈련 기록', 'head': ['이름', '운동', '간 거리(km)', '걸린 시간(분)'],
                 'rows': [['윤서', '달리기', '4.2', '24'], ['태오', '자전거', '7.56', '18'], ['하람', '인라인스케이트', '5.85', '15'], ['민재', '빨리 걷기', '1.8', '24']]}}

HARD_ST = {
    's1': [
        ('기록실 게시판에 새 쪽지가 붙었어요. 쪽지를 보고 세 칸에 써 보세요.', [
            NOTE('새봄 스포츠 클럽 기록실 새 게시판', ['농구 클럽: 이온 음료 9.3 L를 물통 3개에 똑같이 나누어 담기', '배드민턴 클럽: 네트 끈 8.25 m를 똑같은 길이의 끈 3개로 자르기',
                                                '육상 클럽: 페인트 3.48 L를 레인 4개의 선에 똑같이 나누어 쓰기', '피구 클럽: 피구장 선 11 m를 4명이 똑같이 나누어 칠하기']),
            _c('panes', [{'t': '보여요', 'ph': '게시판에 ~이 보여요', 'ex': ['9.3 L, 8.25 m, 3.48 L처럼 소수를 자연수로 나누는 일이 보여요.']},
                         {'t': '생각해요', 'ph': '~은 몫이 1보다 클/작을 것 같아요', 'ex': ['페인트 3.48 L를 4레인에 나누면 한 레인의 몫은 1 L보다 작을 것 같아요.']},
                         {'t': '궁금해요', 'ph': '~은 어떻게 계산할까?', 'ex': ['11÷4처럼 자연수끼리 나누어도 몫을 소수로 나타낼 수 있을까?']}])]),
        ('게시판의 일을 나눗셈식으로 나타내고, 몫이 1보다 큰지 작은지 골라 보세요.', [
            SENT([['물통 한 개에 담을 음료의 양:', ho(['9.3÷3', '3÷9.3', '9.3×3']), '→ 몫이 1보다', ho(['커요', '작아요'])],
                  ['한 레인에 쓸 페인트의 양:', ho(['3.48÷4', '4÷3.48', '3.48−4']), '→ 몫이 1보다', ho(['작아요', '커요'])],
                  ['한 명이 칠할 피구장 선의 길이:', ho(['11÷4', '4÷11', '11×4']), '→', ho(['(자연수)÷(자연수)', '(소수)÷(자연수)'])]]),
            TWHY('한 레인에 쓸 페인트의 양이 1 L보다 적은 까닭을 써 볼까요?', '4레인에 1 L씩 쓰려면 페인트가 4 L 있어야 하는데 3.48 L밖에 없어서 한 레인에 쓰는 양은 1 L보다 적어요.')]),
        ('5학년과 6학년 1학기에 배운 분수와 소수의 관계, (소수)×(자연수), (분수)÷(자연수), (세 자리 수)÷(두 자리 수)를 떠올려 보세요.', [SENT([
            ['[3/100]을 소수로 나타내면', hn('[3/100]')], ['[215/100]를 소수로 나타내면', hn('[215/100]')], ['0.405를 분수로 나타내면', hf(405, 1000)],
            ['0.75 × 6 =', hn('0.75×6')], ['[8/11] ÷ 4 = [(8÷4)/11] =', hf(2, 11)], ['612 ÷ 18 =', hn('612÷18')]])]),
        ('게시판의 나눗셈은 각각 어떤 모양의 나눗셈인지 골라 보세요.', [SENT([
            ['8.25÷3은 각 자리에서 나누어떨어지지', ho(['않아요', '않을 일이 없어요']), '.'],
            ['6.18÷3의 몫은 소수 첫째 자리에', ho(['0이 있어요', '0이 없어요']), '.'],
            ['4.6÷4는 소수점 아래에', ho(['0을 내려 계산해요', '0을 내리지 않아요']), '.']])]),
        ('정확하게 계산하기 전에 어림해 보세요. 게시판의 답은 대략 얼마쯤일까요?', [QUIZ(
            ('네트 끈 8.25 m를 3개로 똑같이 자르면 한 개는 약 몇 m일까요?', ['약 0.3 m', '약 3 m', '약 30 m'], 1),
            ('피구장 선 11 m를 4명이 똑같이 나누어 칠하면 한 명이 약 몇 m를 칠할까요?', ['약 0.3 m', '약 3 m', '약 30 m'], 1),
            ('마라톤 클럽이 일주일 동안 28.42 km를 날마다 똑같이 달렸다면 하루에 약 몇 km를 달렸을까요?', ['약 0.4 km', '약 4 km', '약 40 km'], 1))]),
    ],
    's2': [
        ('농구 클럽이 이온 음료 9.3 L를 물통 3개에 똑같이 나누어 담아요. 먼저 규칙을 예상한 다음, 수 모형 9.3을 물통 3개에 나누어 보세요.', [
            RFIRST('9.3÷3의 몫은 93÷3의 몫과 어떤 관계일지 예상해 써요.', '9.3은 93의 [1/10]배이므로 몫도 31의 [1/10]배인 3.1이에요.'),
            BLOCKS('9.3', 3, '물통', [['9를 3으로 나눈 몫은', hn('9÷3'), '이고, 0.1의 개수인 3을 3으로 나눈 몫은', hn('3÷3'), '이에요.'],
                                     ['물통 한 개에 담을 음료는', hn('9.3÷3'), 'L예요.']])]),
        ('8.48÷4를 세로셈으로 계산해 보세요.', [
            LONG([('8.48', '4')], [['8.48 ÷ 4 =', hn('8.48÷4')]]),
            TWHY('8.48÷4의 몫이 212가 아니라 2.12인 까닭을 써 볼까요?', '8.48은 0.01이 848개인 수이고 848÷4=212이므로 몫은 0.01이 212개인 2.12예요.')]),
        ('분수의 나눗셈으로 계산하고, 계산한 방법을 써 보세요.', [
            SENT([{'g': '분수의 나눗셈으로 계산하기', 'rows': [frow('36.6', '3'), frow('4.84', '2')]}]),
            WRITE(('36.6÷3을 분수의 나눗셈으로 계산하는 방법을 친구에게 설명하듯 써 보세요.', '설명',
                   '예) 36.6을 분모가 10인 분수 366/10으로 바꾸고 분자 366을 3으로 나누면 122/10이므로 몫은 12.2예요.'))]),
        ('몫의 소수점을 찍는 방법을 새 예로 정리해 보세요.', [BLANKS(
            '24.8÷2를 세로셈으로 계산할 때 몫의 소수점은 ', (['나누어지는 수', '나누는 수'],), '의 소수점에 맞추어 찍어요. 그래서 몫은 ', (['12.4', '124', '1.24'],), '예요.')]),
        ('축구 클럽의 음료 준비 문제를 계산해 보세요.', [LONG([('69.3', '3'), ('8.64', '2')], [frow('46.8', '4'), frow('6.39', '3')])]),
    ],
    's3': [
        ('배드민턴 클럽이 네트 끈 8.25 m를 똑같은 길이의 끈 3개로 잘라요. 수 모형 8.25를 3묶음에 똑같이 나누어 보세요.', [BLOCKS('8.25', 3, '묶음', [
            ['8을 3으로 나누면 몫이 2이고, 남은 2를 0.1 20개로 바꾸면 0.1은 모두', hn('20+2'), '개예요.'],
            ['0.1 22개를 3으로 나누면 한 묶음에', hk(7), '개씩이고 0.1이', hk(1), '개 남아요.'],
            ['남은 0.1 1개를 0.01 10개로 바꾸면 0.01은', hn('10+5'), '개 → 15 ÷ 3 =', hn('15÷3')],
            ['끈 한 개의 길이는', hn('8.25÷3'), 'm예요.']])]),
        ('9.36÷4를 세로셈으로 계산해 보세요.', [
            LONG([('9.36', '4')], [['9.36 ÷ 4 =', hn('9.36÷4')]]),
            TWHY('9.36÷4에서 9를 4로 나누고 남은 1을 0.1 10개로 바꾸는 까닭을 써 볼까요?', '남은 1은 4로 똑같이 나눌 수 없어서 0.1 10개로 바꾸면 0.1이 13개가 되고, 13÷4를 계속 계산할 수 있기 때문이에요.')]),
        ('분수의 나눗셈과 0.01의 개수로 계산해 보세요.', [SENT([
            {'g': '분수의 나눗셈으로 계산하기', 'rows': [frow('9.84', '8')]},
            {'g': '0.01의 개수로 계산하기', 'rows': [['13.65는 0.01이', hk(1365), '개 → 1365 ÷ 7 =', hn('1365÷7'), '→ 0.01이 195개이므로', hk('1.95')]]}])]),
        ('남은 수를 아래 자리로 내려 계산하는 방법을 새 예로 정리해 보세요.', [BLANKS(
            '8.25÷3에서 8을 3으로 나누고 남은 2는 0.1 ', (['20개', '2개'],), '로 바꾸고, 0.1을 나누고 남은 1은 0.01 ', (['10개', '1개'],), '로 바꾸어 계속 나누어요. 몫은 ',
            (['2.75', '27.5', '0.275'],), '예요.')]),
        ('줄넘기 클럽 준비물 문제를 계산해 보세요.', [LONG([('11.55', '7'), ('9.52', '4')], [frow('14.04', '6'), frow('22.68', '9')])]),
    ],
    's4': [
        ('육상 클럽이 페인트 3.48 L를 레인 4개의 선에 똑같이 나누어 써요. 먼저 규칙을 예상한 다음, 수 모형 3.48을 레인 4개에 나누어 보세요.', [
            RFIRST('나누어지는 수의 자연수 부분 3이 나누는 수 4보다 작으면 몫의 일의 자리는 어떻게 될지 예상해 써요.', '3을 4로 나눌 수 없으므로 몫의 일의 자리는 0이에요. 3.48÷4=0.87이에요.'),
            BLOCKS('3.48', 4, '레인', [['3을 4로 나눌 수 없으므로 3을 0.1 30개로 바꾸면 0.1은', hn('30+4'), '개예요.'],
                                      ['0.1 34개를 4로 나누면 한 레인에', hk(8), '개씩이고 0.1이', hk(2), '개 남아요.'],
                                      ['남은 0.1 2개를 0.01 20개로 바꾸면 0.01은', hn('20+8'), '개 → 28 ÷ 4 =', hn('28÷4')],
                                      ['한 레인에 쓸 페인트는', hn('3.48÷4'), 'L예요.']])]),
        ('5.58÷6을 세로셈으로 계산해 보세요.', [
            LONG([('5.58', '6')], [['5.58 ÷ 6 =', hn('5.58÷6')]]),
            TWHY('5.58÷6의 몫의 일의 자리에 0을 쓰는 까닭을 써 볼까요?', '5를 6으로 나눌 수 없어서 몫의 일의 자리에 들어갈 수가 없으므로 0을 쓰고 소수점을 찍어요.')]),
        ('분수의 나눗셈으로 계산하고, 친구의 실수를 고쳐 보세요.', [
            SENT([{'g': '분수의 나눗셈으로 계산하기', 'rows': [frow('6.37', '7')]},
                  {'q': '어떤 친구가 2.56÷8의 몫을 ‘3.2’라고 썼어요. 바르게 고친 것은?', 'p': [ho(['0.32', '32', '0.032'])]}]),
            WRITE(('2.56÷8의 몫을 3.2라고 쓴 친구에게 고칠 점을 알려 주는 말을 써 보세요.', '알려 주는 말',
                   '예) 2를 8로 나눌 수 없으니까 몫의 일의 자리에 0을 써야 해. 2.56÷8=0.32야.'))]),
        ('몫이 1보다 작은 (소수)÷(자연수)의 계산 방법을 새 예로 정리해 보세요.', [BLANKS(
            '7.65÷9는 7을 9로 나눌 수 없으므로 몫의 일의 자리에 ', (['0', '7'],), '을 쓰고, 0.1의 개수 ', (['76', '7'],), '을 9로 나누어 계산해요. 몫은 ', (['0.85', '8.5', '0.085'],), '예요.')]),
        ('육상 클럽 운동회 준비 문제를 계산해 보세요.', [LONG([('4.9', '7'), ('5.76', '8')], [frow('3.24', '6'), frow('6.66', '9')])]),
    ],
    's5': [
        ('응원 머리띠 끈 4.6 m를 선수 4명이 똑같이 나누어 써요. 먼저 규칙을 예상한 다음, 끈 그림에 자르는 선을 그어 똑같이 4도막으로 나누어 보세요.', [
            RFIRST('4.6÷4를 계산하다가 나머지가 남으면 어떻게 하면 좋을지 예상해 써요.', '4.6=4.60이라고 생각하고 0을 내려 계속 나누어요. 4.6÷4=1.15예요.'),
            _c('tape', {'m': '4.6', 'n': 4, 'snap': 5, 'item': '머리띠 끈', 'asks': [
                ['4.6 m =', hk(460), 'cm이고, 460 ÷ 4 =', hn('460÷4'), '이므로 한 도막은 115 cm예요.'],
                ['115 cm =', hk('1.15'), 'm → 4.6 ÷ 4 =', hn('4.6÷4')]]})]),
        ('5.4÷8을 세로셈으로 계산해 보세요. 나머지가 남으면 0을 내려 끝까지 나누어요.', [
            LONG([('5.4', '8')], [['5.4 ÷ 8 =', hn('5.4÷8'), '이고, 계산하는 동안 0을', ho(['두 번', '한 번', '세 번']), '내렸어요.']]),
            TWHY('5.4÷8에서 0을 내려도 되는 까닭을 써 볼까요?', '5.4=5.40=5.400처럼 소수의 오른쪽 끝자리에 0을 붙여도 크기가 같기 때문이에요.')]),
        ('자연수의 나눗셈을 이용하여 계산해 보세요.', [SENT([rrow('9.1', '2'), rrow('8.1', '6'),
                                          ['나누는 수가 그대로이고 나누어지는 수가 [1/100]배가 되면 몫은', ho(['[1/100]배', '100배', '그대로']), '가 돼요.']])]),
        ('0을 내려 계산하는 방법을 새 예로 정리해 보세요.', [BLANKS(
            '7.4÷4를 계산할 때 나머지 2가 남으면 7.4를 ', (['7.40', '74'],), '으로 생각하고 0을 내려 계산해요. 그래서 몫은 ', (['1.85', '1.8', '18.5'],), '예요.')]),
        ('출발선 준비 문제를 계산해 보세요.', [LONG([('8.6', '4'), ('2.1', '6')], [rrow('13.5', '2'), rrow('4.5', '6')])]),
    ],
    's6': [
        ('체력 클럽의 똑같은 메디신볼 3개의 무게가 모두 6.18 kg이에요. 수 모형 6.18을 3묶음에 똑같이 나누어 보세요.', [BLOCKS('6.18', 3, '묶음', [
            ['6을 3으로 나눈 몫은', hn('6÷3'), '이에요.'],
            ['0.1은 1개뿐이라 3묶음에 똑같이 나눌 수 없어서 묶음마다 0.1은', hk(0), '개예요.'],
            ['6.18 kg은 0.01 kg이', hk(618), '개 → 618 ÷ 3 =', hn('618÷3')],
            ['메디신볼 한 개의 무게는', hn('6.18÷3'), 'kg이에요.']])]),
        ('10.4÷5를 세로셈으로 계산해 보세요.', [
            LONG([('10.4', '5')], [['10.4 ÷ 5 =', hn('10.4÷5'), '에서 몫의 소수 첫째 자리 숫자는', hk(0), '이에요.']]),
            TWHY('10.4÷5의 몫이 2.8이 아니라 2.08인 까닭을 써 볼까요?', '10을 5로 나눈 뒤 4를 내렸는데 4를 5로 나눌 수 없어서 몫의 소수 첫째 자리에 0을 쓰고 0을 하나 더 내려 계산해야 하기 때문이에요.')]),
        ('0.01의 개수와 자연수의 나눗셈을 이용하여 계산해 보세요.', [SENT([
            {'fig': {'rel': [['2436', '4', '609'], ['24.36', '4', '?']], 'k': 100}}, rrow('24.36', '4'),
            {'q': '어떤 친구가 30.24÷6의 몫을 5.4라고 했어요. 바른 몫은 무엇일까요?', 'p': [ho(['5.04', '50.4', '0.504'])]}])]),
        ('몫의 소수 첫째 자리에 0이 있는 나눗셈의 계산 방법을 새 예로 정리해 보세요.', [BLANKS(
            '12.3÷6에서 12를 6으로 나눈 몫 2를 쓰고 3을 내렸더니 6으로 나눌 수 없으므로 몫의 소수 첫째 자리에 ', (['0', '3'],), '을 쓰고 0을 하나 내려 계산해요. 몫은 ',
            (['2.05', '2.5', '20.5'],), '예요.')]),
        ('체력 클럽 기록 문제를 계산해 보세요.', [LONG([('8.28', '4'), ('21.35', '7')], [rrow('15.18', '3'), rrow('42.4', '8')])]),
    ],
    's7': [
        ('피구장 선 11 m를 4명이 똑같이 나누어 칠해요. 먼저 규칙을 예상한 다음, 수 모형 1을 1 m라고 생각하고 4명에게 똑같이 나누어 보세요.', [
            RFIRST('11÷4처럼 나누어떨어지지 않는 자연수의 나눗셈의 몫을 소수로 나타내는 방법을 예상해 써요.', '11을 11.00이라고 생각하고 0을 내려 계산하면 몫은 2.75예요.'),
            BLOCKS('11', 4, '사람', [['한 명이 칠할 길이를 구하는 식은', ho(['11÷4', '4÷11', '11×4'])],
                                    ['1100 ÷ 4 =', hn('1100÷4'), '→ 11 ÷ 4 =', hn('11÷4'), '이므로 한 명이 2.75 m를 칠해요.']], cnt='명')]),
        ('13÷8을 세로셈으로 계산해 보세요.', [
            LONG([('13', '8')], [['13000 ÷ 8 =', hn('13000÷8'), '→ 13 ÷ 8 =', hn('13÷8')]]),
            TWHY('13÷8을 계산할 때 13 뒤에 소수점과 0이 있다고 생각해도 되는 까닭을 써 볼까요?', '13=13.0=13.000처럼 자연수 뒤에 소수점과 0을 붙여도 크기가 같기 때문이에요.')]),
        ('몫을 분수로 나타낸 다음 소수로 나타내 보세요.', [SENT([
            {'g': '분수로 나타낸 다음 소수로 나타내기', 'rows': [['9 ÷ 20 =', hf(9, 20), '= [(9×5)/(20×5)] =', hf(45, 100), '=', hn('9÷20')],
                                                       ['3 ÷ 8 =', hf(3, 8), '= [(3×125)/(8×125)] =', hf(375, 1000), '=', hn('3÷8')]]}])]),
        ('자연수 뒤의 소수점을 생각하는 방법을 새 예로 정리해 보세요.', [BLANKS(
            '7÷8의 몫을 소수로 나타낼 때 7을 ', (['7.000', '70'],), '으로 생각하고 0을 세 번 내려 계산하면 몫은 ', (['0.875', '8.75', '87.5'],), '이에요.')]),
        ('코트 선 나누기 문제를 계산해 보세요.', [LONG([('21', '4'), ('5', '8')], [['600 ÷ 24 =', hn('600÷24'), '→ 6 ÷ 24 =', hn('6÷24')], ['11 ÷ 25 =', hf(11, 25), '=', hf(44, 100), '=', hn('11÷25')]])]),
    ],
    's8': [
        ('마라톤 클럽 민재가 일주일 동안 달린 거리는 모두 28.42 km예요. 날마다 똑같이 달렸다면 하루에 몇 km를 달렸는지 어림셈하고 계산기로 확인해 보세요.', [SENT([
            ['하루에 달린 거리를 구하는 식은', ho(['28.42÷7', '28.42×7', '7÷28.42'])],
            ['어림셈: 28.42를 28로 어림하여 28÷7을 계산하면', hn('28÷7'), '이므로 약 4 km예요.'],
            ['어림셈한 결과를 이용하여 옳은 식을 골라 보세요:', ho(['28.42÷7=406', '28.42÷7=40.6', '28.42÷7=4.06'], 2)],
            ['계산기로 구한 몫:', hn('28.42÷7')]],
            {'calc': 1, 'inner': {'note': {'title': '마라톤 클럽 기록장', 'lines': ['이번 주에 달린 거리: 모두 28.42 km', '달린 날: 7일(날마다 똑같은 거리)', '하루에 달린 거리: ? km']}}})]),
        ('기록장의 몫에 소수점이 빠졌어요. 먼저 어림셈하여 몫이 약 얼마인지 고르고, 몫의 숫자 사이 동그라미 하나를 색칠해 소수점을 찍어 보세요.', [
            POINT([('59.5÷5', '60÷5', ['1.2', '12', '120'], 1), ('43.2÷8', '40÷8', ['0.5', '5', '50'], 1),
                   ('76.8÷6', '78÷6', ['1.3', '13', '130'], 1), ('18.36÷4', '20÷4', ['0.5', '5', '50'], 1)]),
            TWHY('18.36÷4의 몫을 459가 아니라 4.59로 정할 수 있는 까닭은 무엇일까요?', '18.36을 20으로 어림하면 20÷4=5이므로 몫은 약 5예요. 459나 45.9가 아니라 5와 비슷한 4.59가 되도록 소수점을 찍어요.')]),
        ('기록 담당 두 친구가 쓴 기록이에요. 어림셈하여 몫의 소수점을 잘못 찍은 사람을 찾고, 고칠 점을 알려 주세요.', [
            _c('append', {'talk': [['지후', '“응원 끈 7.56 m를 3명이 똑같이 나누면 한 명이 2.52 m를 가져.”'], ['채원', '“물 38.4 L를 물통 8개에 똑같이 나누면 한 통에 48 L씩 담아.”']]}),
            QUIZ(('몫의 소수점을 잘못 찍은 사람은 누구일까요?', ['지후', '채원', '둘 다 맞아요'], 1), ('채원이의 기록을 바르게 고친 것은?', ['0.48 L', '4.8 L', '480 L'], 1)),
            WRITE(('채원이에게 어림셈으로 소수점을 확인하는 방법을 알려 주는 쪽지를 써 보세요.', '채원이에게',
                   '예) 채원아, 38.4÷8을 40÷8로 어림하면 약 5이니까 48은 너무 커. 5와 비슷하게 소수점을 찍으면 4.8 L야.'))]),
        ('어림셈으로 몫의 소수점을 확인하는 방법을 새 예로 정리해 보세요.', [BLANKS(
            '64.8÷9를 63÷9로 어림셈하면 약 ', (['7', '70', '0.7'],), '이므로 몫은 ', (['7.2', '72', '0.72'],), '예요. 어림셈한 결과와 ', (['비슷한 크기', '아주 다른 크기'],), '가 되도록 소수점을 찍어요.')]),
        ('기록실 점검표의 물음에 답해 보세요. 어림셈을 이용해요.', [SENT([
            {'q': '태오가 “52.5÷5의 몫은 10.5일 것 같아.”라고 말했어요. 태오의 어림셈을 완성해 보세요.', 'p': ['52.5를 50으로 어림하여 50÷5를 계산하면 약', hn('50÷5'), '이므로 몫은', ho(['1.05', '10.5', '105'], 1), '이에요.']},
            ['3.42 ÷ 6의 몫은', ho(['57', '5.7', '0.57'], 2), ', 66.5 ÷ 7의 몫은', ho(['95', '9.5', '0.95'], 1)],
            {'q': '몫이 3보다 작은 나눗셈을 모두 골라 보세요.', 'p': [hm(['㉠ 17.4 ÷ 6', '㉡ 25.2 ÷ 8', '㉢ 8.85 ÷ 3', '㉣ 15.5 ÷ 5'], [0, 2])]}])]),
    ],
    's9': [
        ('기록실에 클럽 친구들의 새 훈련 기록이 모였어요. 1분 동안 가장 먼 거리를 간 운동을 어림셈으로 찾아보세요. 어림셈만으로 정하기 어려운 운동도 찾아보세요.', [SENT([
            ['달리기 4.2÷24 → 4÷20 = 약', hn('4÷20'), 'km'], ['자전거 7.56÷18 → 8÷20 = 약', hn('8÷20'), 'km'],
            ['인라인스케이트 5.85÷15 → 6÷15 = 약', hn('6÷15'), 'km'], ['빨리 걷기 1.8÷24 → 2÷20 = 약', hn('2÷20'), 'km'],
            ['어림셈한 값이 같아서 바로 정하기 어려운 두 운동은', ho(['자전거와 인라인스케이트', '달리기와 빨리 걷기', '달리기와 자전거']), '예요.']], REC9)]),
        ('계산기로 1분 동안 간 거리를 정확하게 구해 보세요.', [SENT([
            ['달리기 4.2 ÷ 24 =', hn('4.2÷24'), 'km'], ['자전거 7.56 ÷ 18 =', hn('7.56÷18'), 'km'],
            ['인라인스케이트 5.85 ÷ 15 =', hn('5.85÷15'), 'km'], ['빨리 걷기 1.8 ÷ 24 =', hn('1.8÷24'), 'km'],
            ['1분 동안 가장 먼 거리를 간 운동은', ho(['달리기', '자전거', '인라인스케이트', '빨리 걷기'], 1), '이에요.']], {'calc': 1, 'inner': REC9})]),
        ('1분 동안 간 거리를 m로 바꾸어 견주고, 생각을 써 보세요.', [
            SENT([['1 km = 1000 m이므로 자전거 0.42 km =', hn('0.42×1000'), 'm, 인라인스케이트 0.39 km =', hn('0.39×1000'), 'm'],
                  ['자전거는 1분 동안 빨리 걷기보다', hn('0.42×1000-0.075×1000'), 'm 더 갔어요.']]),
            WRITE(('어림셈한 값이 같은 두 기록을 견줄 때 어떻게 해야 하는지 써 보세요.', '견주는 방법', '예) 어림셈한 값이 같으면 계산기로 정확하게 계산해서 소수의 크기를 비교해요.'))]),
        ('인라인스케이트 클럽 응원 끈 9.6 m를 4명이 나누어요. 9.6÷4를 이 단원에서 배운 방법으로 계산하고, 34.8÷3의 소수점 위치를 어림셈으로 확인해 보세요.', [LONG(
            [({'a': '9.6', 'b': '4', 'cap': '방법 1 · 세로셈 9.6 ÷ 4'}, None)],
            [{'g': '방법 2 · 분수의 나눗셈', 'rows': [frow('9.6', '4')]},
             {'g': '방법 3 · 자연수의 나눗셈', 'rows': [['96 ÷ 4 =', hn('96÷4'), '→ 나누어지는 수가', ho(['[1/10]배', '[1/100]배']), '→ 9.6 ÷ 4 =', hn('9.6÷4')]]},
             {'g': '몫의 소수점 위치 확인', 'rows': [['34.8 ÷ 3을 36 ÷ 3으로 어림셈하면 약', hn('36÷3'), '이므로 몫은', ho(['1.16', '11.6', '116'], 1), '이에요.']]}])]),
        ('오늘 분석한 새 훈련 기록으로 기록실 보고서를 써 보세요.', [WRITE(
            ('분석 결과: 1분 동안 가장 먼 거리를 간 운동과 두 번째로 먼 운동의 차를 써 보세요.', '분석 결과',
             '예) 1분 동안 가장 먼 거리를 간 운동은 자전거(0.42 km)이고, 두 번째인 인라인스케이트(0.39 km)보다 0.03 km(30 m) 더 갔어요.'),
            ('분석 방법: 어림셈으로 정하지 못한 기록을 어떻게 가렸는지 써 보세요.', '분석 방법',
             '예) 어림셈으로는 둘 다 약 0.4 km라서 계산기로 7.56÷18=0.42, 5.85÷15=0.39를 구해 견주었어요.'))]),
    ],
    's10': [
        ('콩주머니 땅따먹기 놀이 방법을 다시 읽고 답해 보세요.', [QUIZ(
            ('콩주머니가 이미 색칠된 땅에 떨어지면 어떻게 하나요?', ['다시 한번 던져요.', '그 땅을 내 색으로 다시 칠해요.', '놀이가 끝나요.'], 0),
            ('친구는 내 답이 맞는지 어떻게 확인하나요?', ['계산기로 확인해요.', '어림만 해요.', '확인하지 않아요.'], 0),
            ('도착한 땅의 나눗셈을 잘못 계산하면 어떻게 하나요?', ['땅을 색칠하지 않아요.', '친구의 땅을 하나 지워요.', '그래도 색칠해요.'], 0))]),
        ('놀이판의 땅이라고 생각하고 계산해 보세요. 친구의 답이 맞는지도 확인해요.', [SENT([
            ['16.8 ÷ 8 =', hn('16.8÷8')], ['0.63 ÷ 7 =', hn('0.63÷7')], ['30.6 ÷ 6 =', hn('30.6÷6')], ['3 ÷ 12 =', hn('3÷12')],
            {'q': '친구가 30.6÷6 = 5.1이라고 했어요. 친구의 답은 옳은가요?', 'p': [ho(['맞아요', '틀렸어요'])]}])]),
        ('나눗셈 카드 놀이에서 뒤집은 카드라고 생각하고 몫을 구해 보세요.', [SENT([
            ['카드 4.14÷9의 몫은', hn('4.14÷9')], ['카드 25.2÷6의 몫은', hn('25.2÷6')], ['카드 7÷14의 몫은', hn('7÷14')], ['카드 2.45÷7의 몫은', hn('2.45÷7')],
            {'q': '친구가 카드 8.32÷8을 1.4라고 계산했어요. 바른 몫은 무엇일까요?', 'p': [ho(['1.04', '1.4', '10.4'])]}])]),
        ('함께 놀이하는 마음과 이기는 작전을 생각해 보세요.', [WRITE(
            ('친구가 8.32÷8을 1.4라고 했을 때 기분 상하지 않게 알려 주는 말을 써 보세요.', '알려 주는 말',
             '예) 8을 8로 나눈 다음 3을 내리면 8로 나눌 수 없으니까 몫에 0을 써야 해. 다시 계산하면 1.04야.'),
            ('땅따먹기에서 어떤 땅을 먼저 노리면 좋을지 까닭과 함께 써 보세요.', '나의 작전', '예) 내가 자신 있는 나눗셈이 있는 땅을 먼저 노려서 확실하게 색칠해요.'))]),
        ('놀이에서 어려웠던 땅의 나눗셈을 다시 풀어 보세요.', [LONG([('20.12', '4'), ('9', '24')], [
            ['12.6 ÷ 8 =', hn('12.6÷8'), ', 0.84 ÷ 7 =', hn('0.84÷7'), ', 35.4 ÷ 6 =', hn('35.4÷6')]])]),
    ],
    's11': [
        ('기록실에 스포츠 음료 5.25 L, 응원 끈 9.6 m, 선수 5명, 물통 6개가 있어요. 나누어지는 수와 나누는 수를 하나씩 골라 (소수)÷(자연수) 문제를 만들고 답을 구해 보세요.', [
            SENT([{'q': '만들 수 있는 나눗셈의 몫을 구해 보세요.', 'p': ['5.25 ÷ 5 =', hn('5.25÷5'), ', 9.6 ÷ 5 =', hn('9.6÷5'), ', 9.6 ÷ 6 =', hn('9.6÷6')]}]),
            WRITE(('고른 수로 문제를 만들어 써 보세요.', '내 문제', '예) 스포츠 음료 5.25 L를 선수 5명이 똑같이 나누어 마시면 한 명이 몇 L를 마실까요?'))]),
        ('내가 만든 문제를 발표할 쪽지를 써 보세요.', [WRITE(
            ('내가 만든 문제와 식, 답을 써 보세요.', '문제와 답', '예) 문제: 응원 끈 9.6 m를 물통 6개에 똑같이 나누어 묶으면 하나에 몇 m를 묶을까요? / 식: 9.6÷6=1.6 / 답: 1.6 m'),
            ('계산한 방법과 어림셈으로 확인한 방법을 써 보세요.', '계산 방법', '예) 96÷6=16을 이용해 9.6÷6=1.6으로 계산했어요. 9.6을 10으로 어림하면 10÷6은 약 1.7이므로 1.6이 알맞아요.'))]),
        ('발표회에서 친구들이 소개한 여러 가지 계산 방법으로 풀어 보세요.', [SENT([
            ['84 ÷ 14 =', hn('84÷14'), '→', ho(['[1/100]배', '[1/10]배']), '→ 0.84 ÷ 14 =', hn('0.84÷14')],
            ['925 ÷ 5 =', hn('925÷5'), '→', ho(['[1/100]배', '[1/10]배']), '→ 9.25 ÷ 5 =', hn('9.25÷5')],
            frow('17.28', '6'), ['11 ÷ 20 = [11/20] = [(11×5)/(20×5)] =', hf(55, 100), '=', hn('11÷20')]])]),
        ('친구들의 발표에서 틀린 곳을 찾아 고쳐 보세요.', [SENT([
            {'q': '27.3÷6을 어림셈한 결과를 이용하여 옳은 식을 골라 보세요.', 'p': [ho(['27.3÷6=45.5', '27.3÷6=4.55', '27.3÷6=0.455'], 1)]},
            {'q': '채원이는 10.25÷5를 2.5라고 발표했어요. 바르게 고치면?', 'p': ['10.25 ÷ 5 =', hn('10.25÷5')]},
            {'q': '민재는 “9÷12는 9가 12보다 작아서 나눌 수 없어요.”라고 말했어요. 몫을 소수로 나타내면?', 'p': ['9 ÷ 12 =', hn('9÷12')]}])]),
        ('1차시에 붙였던 ‘궁금해요’ 쪽지를 다시 보고, 기록실 활동을 되돌아보세요.', [
            _c('wonder'),
            WRITE(('1차시에 궁금했던 것 하나를 골라, 이제는 어떻게 답할 수 있는지 써 보세요.', '궁금증', '예) 궁금했던 것: 11÷4의 몫을 소수로 나타낼 수 있을까? → 이제는 11=11.00으로 생각하고 0을 내려 2.75라고 답할 수 있어요.'),
                  ('이 단원에서 가장 실수하기 쉬운 나눗셈과 실수하지 않는 방법을 써 보세요.', '실수 막기', '예) 몫의 소수 첫째 자리에 0이 들어가는 6.18÷3 같은 나눗셈이에요. 어림셈으로 몫의 크기를 먼저 확인하면 실수를 줄일 수 있어요.'))]),
    ],
}


def main():
    out = []
    try:
        app = load_app(SRC_TB)
        nos = [str(L['no']) for L in app['lessons']]
        assert nos == [str(i) for i in range(1, 12)], nos
        for lv in ('기본형', '도전형'):
            out.append(build_tb(app if lv == '기본형' else harden(app, 'tb'), lv))
        st = load_st(SRC_ST)
        st['go'] = ('던지는 곳', '(콩주머니를 놓는 곳)')
        ids = [L['id'] for L in st['lessons']]
        assert ids == ST, ids
        assert [str(L['no']) for L in st['lessons']] == [str(i) for i in range(1, 12)]
        for lv in ('기본형', '도전형'):
            out.append(build_st(st if lv == '기본형' else harden(st, 'st'), lv))
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
