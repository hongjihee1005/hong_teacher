# -*- coding: utf-8 -*-
"""6-1 수학 3. 소수의 나눗셈 활동지(교과서 차시 버전 × 기본형·도전형) 만들기

    python3 gen_u3-decnat.py

앱 원본 ../units/u3-decnat.tb.js('한민족 전통문화 축제 소수의 나눗셈', 11차시)의 LESSONS를 node에서 그대로 실행해
(활동 함수 대신 기록하는 함수를 넣어 render를 부름) 차시 번호·제목·S.O.O.P.·탐구 질문·안내 글·물음·보기·정답·수를 모두 앱에서 읽어 옵니다.
그래서 원본의 수가 바뀌면 활동지도 따라 바뀌고, 모든 답은 이 스크립트가 분수(Fraction)로 다시 계산해 확인합니다(assert).
  - 세로셈 판은 앱 dn3LongBoard와 같은 규칙(나누어지는 수의 소수점·끝에 붙인 흐린 0·계산 메모 줄 수)으로 그립니다.
    기본형은 붙인 0(흐린 0)과 소수점(빨간 점)을 보여 주고, 도전형은 처음 수만 보여 주고 붙일 자리는 빈 점선 칸으로 둡니다.
  - 수 모형 나누어 주기·나무 막대 자르기·소수점 찍기·놀이판(발사! 내 땅)·나눗셈 카드도 앱의 수 그대로 그립니다.
이야기 버전(u3-decnat.st.js)은 아직 없어서 ST 목록은 비어 있고 건너뜁니다(나중에 더함).
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
ST = []          # 이야기 버전(아직 없음) — 생기면 (함수 목록) 을 넣고 main에서 만듦
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
    c, fs = 46, 34
    out, y, wmax = [], 34, 0
    for e, cells in items:
        cap = sp(e) + '의 몫:'
        out.append(T(12, y, cap, 28))
        x = 24 + tw(cap, 28)
        for k, dgt in enumerate(cells):
            out.append(R(x + k * c, y - c / 2, c - 6, c, '#FFF8E6', INK, 2, rx=6))
            out.append(T(x + k * c + (c - 6) / 2, y, dgt, fs, anchor='middle'))
            if k < len(cells) - 1:
                out.append(C(x + k * c + c - 3, y + c / 2 - 4, 5, '#fff', GREY, 2))
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


def clip_fig(s, board):
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
    out.append(T(gx + gw / 2, gy + gh / 2 - 14, '발사', 34, anchor='middle', fill=RED, weight='bold'))
    out.append(T(gx + gw / 2, gy + gh / 2 + 26, '(클립을 놓는 곳)', 17, anchor='middle', fill=RED))
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


def w_blocks(s, lv, a):
    o = a[0]
    A, K_, qs, T_, init, goal = blocks_data(o)
    grp = o.get('grp') or '묶음'
    blocks_fig(s, A, K_, T_, init, grp)
    s.text('아래 %s 칸에 똑같이 나누어 준 수 모형을 그려 보세요.' % grp)
    if lv == '기본형':
        s.text('도움: 똑같이 나누어 줄 수 없는 모형은 바로 아래 자리 모형 10개로 바꾸어 나누어요(1 → 0.1 10개, 0.1 → 0.01 10개).')
    s.table([['', ] + ['%s의 수' % UNITS[t] for t in range(T_)],
             ['%s 하나에' % grp] + ['(      )개'] * T_], col_mm=[44] + [int(136 / T_)] * T_)
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
        s.text('자연수의 나눗셈처럼 높은 자리부터 계산해요. 몫을 맨 위 칸에 쓰고, 나누어지는 수의 소수점(빨간 점) 바로 위에 몫의 소수점을 찍어요. 흐린 0까지 내려 끝까지 나누어요.')
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
    clip_fig(s, app['board'])
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


def main():
    out = []
    try:
        app = load_app(SRC_TB)
        nos = [str(L['no']) for L in app['lessons']]
        assert nos == [str(i) for i in range(1, 12)], nos
        for lv in ('기본형', '도전형'):
            out.append(build_tb(app, lv))
        # 이야기 버전(ST)은 아직 없어서 건너뜀
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
