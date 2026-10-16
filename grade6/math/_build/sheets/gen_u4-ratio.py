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

이야기 버전은 아직 없습니다. 생기면 ST(차시 함수 목록)를 채우고 SRC_ST가 있으면 sem2-soop/sheets/에 만듭니다.
ST가 비어 있거나 원본 파일이 없으면 건너뜁니다.
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
    s.text(rd('%s %d%s를 만드는 재료예요. %s %d%s일 때 필요한 재료의 양을 표에 써 보세요.'
              % (o['what'], o['start'], o['unit'], o['what'], o['target'], o['unit'])).replace('개를', '개를'))
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
    s.text('파란 점선은 가로 %d칸, 세로 %d칸인 액자예요. 왼쪽 아래 모서리를 같게 하여 가로와 세로의 비가 %d : %d와 비율이 같은 더 큰 액자를 그려 보세요.'
           % (bw, bh, bw, bh))
    s.fill('내가 그린 액자: 가로 : 세로 = (      ) : (      )  →  %d : %d의 전항과 후항에 (      )을/를 곱한 비예요.' % (bw, bh))
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


def w_error(s, lv, msg, *_):
    raise RuntimeError('앱 원본의 활동을 읽지 못했어요: ' + msg)


WIDGETS = {'quiz': w_quiz, 'blanks': w_blanks, 'sequence': w_sequence, 'writeStep': w_write, 'recipe': w_recipe,
           'rp4Chain': w_chain, 'rp4Seq': w_seq, 'rp4Build': w_build, 'rp4Machine': w_machine, 'rp4Simp': w_simp,
           'rp4Terms': w_terms, 'rp4Area': w_area, 'rp4Dbl': w_dbl, 'rp4Gear': w_gear, 'rp4Tape': w_tape,
           'rp4Clay': w_clay, 'rp4Dice': w_dice, 'rp4Rect': w_rect, 'rp4Scene': w_scene, 'rp4Hand': w_hand,
           'rp4Meet': w_meet, 'rp4Match': w_match, 'error': w_error}
SVG_W = {'rp4Build', 'rp4Machine', 'rp4Simp', 'rp4Terms', 'rp4Area', 'rp4Dbl', 'rp4Gear', 'rp4Tape', 'rp4Clay', 'rp4Dice',
         'rp4Rect', 'rp4Scene', 'rp4Hand', 'rp4Meet', 'rp4Match'}


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
    for i, st_ in enumerate(L['steps']):
        lab = st_['name'] or STEP_NAMES[min(i, len(STEP_NAMES) - 1)]
        s.step('%s %s' % (NUM[i], lab))
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
