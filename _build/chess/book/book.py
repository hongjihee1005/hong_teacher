# -*- coding: utf-8 -*-
"""체스 학습관 교재를 '책'으로 만들기(한글 HWPX) — 2마당부터

    python3 _build/chess/book/book.py m2        # special/chess/book/체스_2마당_학생용교재.hwpx · 체스_2마당_지도서.hwpx
    python3 _build/chess/book/book.py m2 check  # 만들지 않고 쪽 나눔·그림만 점검

1마당도 2026-10-20부터 이 도구로 만듭니다(선생님 요청: 2~6마당과 같은 꼴). 옛 활동지 꼴 도구 gen_book.py는 그림 찍기 등 조각만 빌려 씁니다.

책 짜임
- 학생용: 표지 → 이 책의 주인·일러두기 → 머리말 → 이 책의 짜임 → 차례 → (단원 여는 쪽 → 차시들 → 단원 마무리) × 단원
          → 마당 확인 평가 → 정답과 풀이 → 용어 풀이 → 뒤표지
- 지도서: 표지 → 머리말 → 학습관과 교재 → 차례 → 차시 한눈에 보기 → 차시별 지도(학생용 교재 쪽수 함께) → 확인 시험·수료증 → 용어 풀이
- 쪽: A4, 맞쪽 제본 여백(안쪽 5mm 더), 짝수 쪽 머리말 왼쪽 '체스 학습관 N마당', 홀수 쪽 오른쪽 '마당 제목', 쪽 번호는 바깥쪽 아래.
  표지·단원 여는 쪽은 머리말과 쪽 번호를 감춥니다. 단원 여는 쪽은 언제나 오른쪽(홀수) 쪽 — 모자라면 앞에 '나의 체스 노트' 쪽을 넣습니다.
- 차례의 쪽 번호는 이 도구가 쪽마다 높이를 어림해 나눈 결과입니다. 쪽마다 '쪽 나눔'을 직접 넣어 두어서,
  한 쪽이 넘치지 않는 한 한글에서 열어도 같은 쪽 번호가 됩니다(어림은 넉넉히 잡음). 고친 뒤 쪽이 밀리면 차례 숫자만 고치면 됩니다.
- 내용: 학습관 원본(m2.js …)에서 export.js로 뽑음, 지도서 글·머리말·단원 소개·용어는 guide_mN.py.
"""
import sys, os, re, json, math, subprocess, importlib, datetime
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, HERE)
sys.path.insert(0, os.path.join(ROOT, 'grade4', 'math', '_build', 'sheets'))
import hwpxgen as H  # noqa: E402
from gen_book import Pics, clean, click_q, IMG, place_marks  # noqa: E402

OUT = os.path.join(ROOT, 'special', 'chess', 'book')
SITE = 'https://hongjihee1005.github.io/hong_teacher/special/chess/'
STAMP = datetime.datetime(2026, 10, 20, 0, 0, 0, tzinfo=datetime.timezone.utc)
NUM = '①②③④⑤⑥⑦⑧⑨⑩'
KIND = {'easy': ('쉬운 조작', '10초 · 10초 · 10초'), 'one': ('한 수 생각', '15초 · 15초 · 15초'), 'deep': ('깊은 생각', '20초 · 20초 · 20초')}
# 마당마다 색(진한 색, 옅은 색)
ACC = {1: ('#7A5230', '#F4EBDF'), 2: ('#2E7D5B', '#E4F2EA'), 3: ('#2B6FB8', '#E3EEF9'), 4: ('#B23A3A', '#F8E6E4'), 5: ('#6A4BA0', '#EEE8F6'), 6: ('#1F6F78', '#E2F1F2')}
RANK = {1: '폰', 2: '나이트', 3: '비숍', 4: '룩', 5: '퀸', 6: '킹'}

MM = H.MM
PAGE_W, PAGE_H = 59528, 84189
M_LR, GUT, M_TB, M_HF = 4252, 1417, 2835, 2835        # 왼오 15mm, 제본 5mm, 위아래 10mm, 머리말·꼬리말 10mm
TW = PAGE_W - 2 * M_LR - GUT                            # 본문 너비 175mm
BODY_MM = (PAGE_H - 2 * M_TB - 2 * M_HF) / MM           # 본문 높이 약 257mm
BUDGET = BODY_MM * 0.94                                 # 어림이 10%쯤 크게 나오므로 실제로는 쪽의 80% 남짓(넘치지 않게)
H.TEXT_W = TW


def mm(x):
    return int(round(x * MM))


# ---------------------------------------------------------------- 글자·문단·테두리 모양(header.xml에 덧붙임)
class Style:
    def __init__(self, acc, tint):
        self.acc, self.tint = acc, tint
        self.cp, self.bf, self.pp = [], [], []
        self.C, self.F, self.P = {}, {}, {}
        ink, soft, gray = '#2B2118', '#4A4038', '#7A6E62'
        for k, (pt, col, b) in {
            'body': (11.5, ink, 0), 'bodyb': (11.5, ink, 1), 'q': (11, ink, 0), 'qb': (11, ink, 1),
            'small': (9.5, soft, 0), 'cap': (9, gray, 0), 'hdr': (8.5, gray, 0),
            'h2': (14, acc, 1), 'h1': (19, ink, 1), 'ban': (13, '#FFFFFF', 1), 'banS': (10, '#FFFFFF', 0),
            'goal': (11, acc, 1), 'acc': (11.5, acc, 1), 'accS': (10, acc, 1),
            'c0': (14, '#FFFFFF', 0), 'c1': (54, '#FFFFFF', 1), 'c2': (26, '#FFFFFF', 1), 'c3': (13, ink, 0), 'c4': (16, ink, 1),
            'u0': (16, acc, 1), 'u1': (40, acc, 1), 'u2': (26, ink, 1),
            'pt': (22, ink, 1), 'toc': (11, ink, 0), 'tocU': (12, acc, 1), 'tocN': (11, gray, 0),
            'key': (9.5, ink, 0), 'keyb': (10, acc, 1), 'gap': (4, ink, 0), 'gap2': (8, ink, 0),
        }.items():
            self.C[k] = self._char(pt, col, b)
        none = 'NONE'
        self.F['none'] = self._fill(None, {})
        self.F['acc'] = self._fill(acc, {})
        self.F['tint'] = self._fill(tint, {})
        self.F['paper'] = self._fill('#FBF7F1', {})
        self.F['box'] = self._fill(None, {s: ('SOLID', '0.12 mm', '#B9AEA2') for s in 'lrtb'})
        self.F['boxT'] = self._fill(tint, {s: ('SOLID', '0.12 mm', acc) for s in 'lrtb'})
        self.F['callout'] = self._fill(tint, {'l': ('SOLID', '1.0 mm', acc)})
        self.F['under'] = self._fill(None, {'b': ('SOLID', '0.5 mm', acc)})
        self.F['wline'] = self._fill(None, {'b': ('DOT', '0.12 mm', '#9C9086')})
        self.F['head'] = self._fill(tint, {'b': ('SOLID', '0.4 mm', acc), 't': ('SOLID', '0.4 mm', acc)})
        self.F['grid'] = self._fill(None, {s: ('SOLID', '0.12 mm', '#D8CFC5') for s in 'lrtb'})
        del none
        self.P['L'] = self._para('LEFT', 160)
        self.P['J'] = self._para('JUSTIFY', 160)
        self.P['C'] = self._para('CENTER', 160)
        self.P['R'] = self._para('RIGHT', 160)
        self.P['LT'] = self._para('LEFT', 135)
        self.P['CT'] = self._para('CENTER', 130)
        self.P['RT'] = self._para('RIGHT', 130)
        self.P['pic'] = self._para('CENTER', 100)
        self.P['picL'] = self._para('LEFT', 100)
        self.P['hang'] = self._para('JUSTIFY', 160, left=mm(4.5), indent=-mm(4.5))
        self.P['hangT'] = self._para('LEFT', 140, left=mm(4.5), indent=-mm(4.5))
        self.P['tab'] = self._para('LEFT', 150, tab=True)

    def _char(self, pt, color, bold):
        i = 20 + len(self.cp)
        x = ('<hh:charPr height="%d" textColor="%s" shadeColor="none" useFontSpace="0" useKerning="0" symMark="NONE" '
             'borderFillIDRef="2" id="%d"><hh:fontRef hangul="0" latin="0" hanja="0" japanese="0" other="0" symbol="0" user="0"/>'
             '<hh:ratio hangul="100" latin="100" hanja="100" japanese="100" other="100" symbol="100" user="100"/>'
             '<hh:spacing hangul="0" latin="0" hanja="0" japanese="0" other="0" symbol="0" user="0"/>'
             '<hh:relSz hangul="100" latin="100" hanja="100" japanese="100" other="100" symbol="100" user="100"/>'
             '<hh:offset hangul="0" latin="0" hanja="0" japanese="0" other="0" symbol="0" user="0"/><hh:outline type="NONE"/>'
             '<hh:shadow type="NONE" color="#C0C0C0" offsetX="10" offsetY="10"/>%s'
             '<hh:underline type="NONE" shape="SOLID" color="#000000"/></hh:charPr>') % (int(round(pt * 100)), color, i, '<hh:bold/>' if bold else '')
        self.cp.append(x)
        return (i, pt)

    def _fill(self, color, sides):
        i = 7 + len(self.bf)

        def side(tag, k):
            t, w, c = sides.get(k, ('NONE', '0.1 mm', '#000000'))
            return '<hh:%s type="%s" width="%s" color="%s"/>' % (tag, t, w, c)
        x = ('<hh:borderFill id="%d" threeD="0" shadow="0" centerLine="NONE" breakCellSeparateLine="0">'
             '<hh:slash type="NONE" Crooked="0" isCounter="0"/><hh:backSlash type="NONE" Crooked="0" isCounter="0"/>'
             '%s%s%s%s<hh:diagonal type="NONE" width="0.1 mm" color="#000000"/>%s</hh:borderFill>') % (
            i, side('leftBorder', 'l'), side('rightBorder', 'r'), side('topBorder', 't'), side('bottomBorder', 'b'),
            '<hc:fillBrush><hc:winBrush faceColor="%s" hatchColor="#FF000000" alpha="0"/></hc:fillBrush>' % color if color else '')
        self.bf.append(x)
        return i

    def _para(self, align, ls, left=0, indent=0, tab=False):
        i = 21 + len(self.pp)
        mg = ('<hh:margin><hc:intent value="%d" unit="HWPUNIT"/><hc:left value="%d" unit="HWPUNIT"/><hc:right value="0" unit="HWPUNIT"/>'
              '<hc:prev value="0" unit="HWPUNIT"/><hc:next value="0" unit="HWPUNIT"/></hh:margin>'
              '<hh:lineSpacing type="PERCENT" value="%d" unit="HWPUNIT"/>') % (indent, left, ls)
        x = ('<hh:paraPr id="%d" tabPrIDRef="%d" condense="0" fontLineHeight="0" snapToGrid="0" suppressLineNumbers="0" checked="0" textDir="LTR">'
             '<hh:align horizontal="%s" vertical="BASELINE"/><hh:heading type="NONE" idRef="0" level="0"/>'
             '<hh:breakSetting breakLatinWord="KEEP_WORD" breakNonLatinWord="KEEP_WORD" widowOrphan="0" keepWithNext="0" keepLines="0" pageBreakBefore="0" lineWrap="BREAK"/>'
             '<hh:autoSpacing eAsianEng="0" eAsianNum="0"/><hp:switch><hp:case hp:required-namespace="http://www.hancom.co.kr/hwpml/2016/HwpUnitChar">%s</hp:case>'
             '<hp:default>%s</hp:default></hp:switch><hh:border borderFillIDRef="2" offsetLeft="0" offsetRight="0" offsetTop="0" offsetBottom="0" connect="0" ignoreMargin="0"/></hh:paraPr>'
             ) % (i, 3 if tab else 0, align, mg, mg)
        self.pp.append(x)
        return i

    def header_xml(self, h):
        tab = ('<hh:tabPr id="3" autoTabLeft="0" autoTabRight="0"><hh:tabItem pos="%d" type="RIGHT" leader="DOT"/></hh:tabPr>' % (TW - 400))
        h = re.sub(r'<hh:tabProperties itemCnt="(\d+)">(.*?)</hh:tabProperties>',
                   lambda m: '<hh:tabProperties itemCnt="%d">%s%s</hh:tabProperties>' % (int(m.group(1)) + 1, m.group(2), tab), h, flags=re.S)
        h = re.sub(r'<hh:borderFills itemCnt="(\d+)">(.*?)</hh:borderFills>',
                   lambda m: '<hh:borderFills itemCnt="%d">%s%s</hh:borderFills>' % (int(m.group(1)) + len(self.bf), m.group(2), ''.join(self.bf)), h, flags=re.S)
        h = re.sub(r'<hh:charProperties itemCnt="(\d+)">(.*?)</hh:charProperties>',
                   lambda m: '<hh:charProperties itemCnt="%d">%s%s</hh:charProperties>' % (int(m.group(1)) + len(self.cp), m.group(2), ''.join(self.cp)), h, flags=re.S)
        h = re.sub(r'<hh:paraProperties itemCnt="(\d+)">(.*?)</hh:paraProperties>',
                   lambda m: '<hh:paraProperties itemCnt="%d">%s%s</hh:paraProperties>' % (int(m.group(1)) + len(self.pp), m.group(2), ''.join(self.pp)), h, flags=re.S)
        return h


# ---------------------------------------------------------------- 높이 어림(mm)
def text_w(t):
    w = 0.0
    for ch in t:
        o = ord(ch)
        if ch == ' ':
            w += 0.34
        elif o >= 0x1100 or ch in '①②③④⑤⑥⑦⑧⑨⑩□■●○★☆▶▸→←·…':
            w += 1.0
        elif ch.isupper() or ch in 'mwMW@%#':
            w += 0.72
        else:
            w += 0.58
    return w


def text_h(t, ch, width_mm, ls=160):
    pt = ch[1]
    em = pt * 0.3528
    per = max(1.0, width_mm * 0.93 / em)
    lines = 0
    for part in (t or ' ').split('\n'):
        lines += max(1, math.ceil(text_w(part) / per))
    return lines * em * ls / 100.0 + 0.6


# ---------------------------------------------------------------- 문서
class Doc(H.Sheet):
    """쪽 단위로 쌓는 책. 블록 = (xml, 높이mm). 새 쪽마다 쪽 나눔을 직접 넣음."""

    def __init__(self, title, st, hdr_even, hdr_odd):
        super().__init__(title, seed=title)
        self.S, self.hdr = st, (hdr_even, hdr_odd)
        self.pages = [[]]           # 쪽마다 [(xml, h)]
        self.hide = set()           # 머리말·쪽 번호를 감출 쪽(0부터)
        self.used = 0.0
        self.marks = {}             # 이름 → 쪽 번호(1부터)
        self._keep = set()

    # 바탕 조각 ----------------------------------------------------
    def P(self, text, ch, pp='L', runs=None):
        c = self.S.C[ch] if isinstance(ch, str) else ch
        if runs is None:
            runs = self._run(text, c[0])
        if text:
            self.text_log.append(text)
        return self._p(runs, self.S.P[pp])

    def R(self, text, ch):
        return self._run(text, self.S.C[ch][0])

    def cell(self, paras, w, bf, c, r, cs=1, h=500, valign='CENTER', mg=(510, 510, 141, 141)):
        sub = H.SUBLIST.replace('vertAlign="CENTER"', 'vertAlign="%s"' % valign)
        return ('<hp:tc name="" header="0" hasMargin="1" protect="0" editable="0" dirty="0" borderFillIDRef="%d">' % bf
                + sub + paras + '</hp:subList><hp:cellAddr colAddr="%d" rowAddr="%d"/>' % (c, r)
                + '<hp:cellSpan colSpan="%d" rowSpan="1"/><hp:cellSz width="%d" height="%d"/>' % (cs, w, h)
                + '<hp:cellMargin left="%d" right="%d" top="%d" bottom="%d"/></hp:tc>' % mg)

    def tbl(self, rows, widths, bf=None, align='C'):
        """rows: [[(paras_xml, bf, colspan, valign, margins|None), …], …] → 표 문단 xml"""
        xr = []
        for r, row in enumerate(rows):
            cs, c = [], 0
            for cell in row:
                paras, cbf, span = cell[0], cell[1], cell[2] if len(cell) > 2 else 1
                va = cell[3] if len(cell) > 3 else 'CENTER'
                mg = cell[4] if len(cell) > 4 and cell[4] else (510, 510, 141, 141)
                cs.append(self.cell(paras, sum(widths[c:c + span]), cbf, c, r, span, 500, va, mg))
                c += span
            xr.append('<hp:tr>' + ''.join(cs) + '</hp:tr>')
        t = H.TBL_OPEN.format(id=self._id(), rows=len(rows), cols=len(widths), bf=bf or self.S.F['none'], w=sum(widths), h=500 * len(rows))
        t = t.replace('<hp:inMargin left="510" right="510" top="141" bottom="141"/>', '<hp:inMargin left="0" right="0" top="0" bottom="0"/>')
        return self._p('<hp:run charPrIDRef="0">' + t + ''.join(xr) + '</hp:tbl></hp:run>' + self._run('', 0), self.S.P['C' if align == 'C' else 'picL'])

    def pic(self, path, w_mm, pp='pic'):
        if os.path.exists(path):
            pw, ph = H._png_size(path)
            with open(path, 'rb') as f:
                data = f.read()
        else:                       # 1차(그림 찍기 전): 크기만 어림
            n = len(re.findall('[wb]', os.path.basename(path)[1:-4])) if os.path.basename(path).startswith('p') else 0
            pw, ph = (134 * n, 132) if n else (572, 572)
            data = path.encode()
        w = mm(w_mm)
        h = int(round(w * ph / pw))
        bid = next((b for b, d in self.bins if d == data), None)
        if bid is None:
            bid = 'BIN%04d' % (len(self.bins) + 1)
            self.bins.append((bid, data))
        x = H.PIC.format(id=self._id(), w=w, h=h, cx=w // 2, cy=h // 2, bin=bid)
        return self._p(self._run('', H.CH_PIC) + '<hp:run charPrIDRef="%d">%s</hp:run>' % (H.CH_PIC, x), self.S.P[pp]), h / MM

    # 쪽 ----------------------------------------------------------
    def add(self, xml, h, keep=False):
        """keep=True: 다음 블록과 같은 쪽에 둠(소제목·문제 머리 등)"""
        if self.used + h > BUDGET and self.pages[-1]:
            carry = []
            while self.pages[-1] and self.pages[-1][-1][0] in self._keep and len(self.pages[-1]) > 1:
                carry.insert(0, self.pages[-1].pop())
            self.new_page()
            for x, hh in carry:
                self.pages[-1].append((x, hh))
                self.used += hh
        self.pages[-1].append((xml, h))
        self.used += h
        if keep:
            self._keep.add(xml)

    def room(self):
        return BUDGET - self.used

    def new_page(self, hide=False):
        if self.pages[-1]:
            self.pages.append([])
            self.used = 0.0
        if hide:
            self.hide.add(len(self.pages) - 1)

    def page_no(self):
        return len(self.pages) if self.pages[-1] else len(self.pages)

    def to_odd(self, filler):
        """다음 블록이 홀수(오른쪽) 쪽에서 시작하게: 지금 쪽이 비었으면 그 쪽 번호로 판단."""
        self.new_page()
        if len(self.pages) % 2 == 0:
            filler()
            self.new_page()

    # 저장 ----------------------------------------------------------
    def build_body(self):
        body = []
        hide = ('<hp:run charPrIDRef="0"><hp:ctrl><hp:pageHiding hideHeader="1" hideFooter="1" hideMasterPage="0" hideBorder="0" '
                'hideFill="0" hidePageNum="1"/></hp:ctrl></hp:run>')
        for i, pg in enumerate(self.pages):
            if not pg:
                continue
            first = pg[0][0]
            if i:
                first = first.replace('pageBreak="0"', 'pageBreak="1"', 1)
            if i in self.hide:
                m = re.match(r'<hp:p [^>]*>', first)
                first = first[:m.end()] + hide + first[m.end():]
            body.append(first)
            body += [x for x, _ in pg[1:]]
        self.body = body

    def section_xml(self):
        head = H._read('section0_head.xml')
        head = re.sub(r'<hp:pagePr [^>]*>', '<hp:pagePr landscape="WIDELY" width="%d" height="%d" gutterType="LEFT_RIGHT">' % (PAGE_W, PAGE_H), head)
        head = re.sub(r'<hp:margin [^>]*/>', '<hp:margin header="%d" footer="%d" gutter="%d" left="%d" right="%d" top="%d" bottom="%d"/>'
                      % (M_HF, M_HF, GUT, M_LR, M_LR, M_TB, M_TB), head)
        head = head.replace('hideFirstHeader="0" hideFirstFooter="0"', 'hideFirstHeader="1" hideFirstFooter="1"').replace('hideFirstPageNum="0"', 'hideFirstPageNum="1"')

        def hd(kind, text, pp):
            p = self._p(self._run(text, self.S.C['hdr'][0]), self.S.P[pp])
            return ('<hp:ctrl><hp:header id="%d" applyPageType="%s"><hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="TOP" '
                    'linkListIDRef="0" linkListNextIDRef="0" textWidth="%d" textHeight="%d" hasTextRef="0" hasNumRef="0">%s</hp:subList></hp:header></hp:ctrl>'
                    % (self._id(), kind, TW, M_HF, p))
        ctrls = (hd('EVEN', self.hdr[0], 'LT') + hd('ODD', self.hdr[1], 'RT')
                 + '<hp:ctrl><hp:pageNum pos="OUTSIDE_BOTTOM" formatType="DIGIT" sideChar=""/></hp:ctrl>')
        head = head.replace('</hp:ctrl></hp:run><hp:run charPrIDRef="0"><hp:t/></hp:run>', '</hp:ctrl>' + ctrls + '</hp:run><hp:run charPrIDRef="0"><hp:t/></hp:run>', 1)
        assert 'hp:pageNum' in head
        # 첫 문단(구역 정의)의 줄 정보는 한글이 다시 계산하도록 뺌
        head = re.sub(r'<hp:linesegarray>.*?</hp:linesegarray>', '', head)
        return head.replace('</hs:sec>', ''.join(self.body) + '</hs:sec>')

    def header_xml(self):
        return self.S.header_xml(super().header_xml())


# ---------------------------------------------------------------- 그림 이름표 붙은 문제 그리기
def name_of(c, names):
    return ('백 ' if c.isupper() else '흑 ') + names[c.upper()]


def ans_marks(t):
    """정답 그림의 표시와 화살표"""
    b = t['board']
    m = dict(b['marks'])
    arrows = []
    if t['type'] == 'click':
        for s in t['ans']:
            m[s] = 'ok'
    elif t['type'] == 'move' and t.get('path'):
        arrows = [[t['path'][i], t['path'][i + 1]] for i in range(len(t['path']) - 1)]
    elif t['type'] == 'play':
        g = t['good'][0]
        m = {g['from']: 'ok', g['to']: 'ok'}
        arrows = [[g['from'], g['to']]]
    elif t['type'] == 'line':
        g = t['seq'][0] if t['seq'] else t['alts'][0]
        m = {g['from']: 'ok', g['to']: 'ok'}
        arrows = [[g['from'], g['to']]]
    return dict(b, marks=m, arrows=arrows)


def book_q(t):
    """학습관 문제 글을 책(종이)에 맞게"""
    q = clean(t['q'])
    if t['type'] == 'click':
        return click_q(q, t['all'])
    q = re.sub(r'\s*내 말을 누르고[^.]*\.', '', q)
    q = re.sub(r'\s*(말을 )?누르고[^.]*눌러요\.', '', q)
    if t['type'] == 'place':
        return '처음 배치에서 그림의 번호 칸에 들어갈 말의 이름을 쓰세요.'
    if t['type'] == 'move':
        return q + ' 말이 가는 길을 판에 화살표로 그려 보세요.'
    if t['type'] == 'play':
        return q + ' 두는 수를 판에 화살표로 그려 보세요.'
    if t['type'] == 'line':
        n = t['moves']
        return q + (' 백의 첫 수를 화살표로 그리고, 흑의 대답에 이어 둘 수도 생각해 보세요.' if n > 1 else ' 두는 수를 판에 화살표로 그려 보세요.')
    return q


def ans_text(t, D, sanmode):
    names = D['pieceNames']
    if t['type'] == 'click':
        many = len(t['ans']) > 1 and not t['all']
        if not t['board']['coords']:
            return '그림에 색칠한 칸'
        return ('다음 가운데 하나: ' if many else '') + ', '.join(t['ans'])
    if t['type'] == 'pick':
        return '%s %s' % (NUM[t['opts'].index(t['ans'])], clean(t['ans']))
    if t['type'] == 'move':
        if t.get('path'):
            return '%d번: %s' % (len(t['path']) - 1, ' → '.join(t['path']))
        return '가장 적게 %d번' % t['par']
    if t['type'] == 'play':
        out = []
        for g in t['good'][:3]:
            out.append(g['ko'] + (' (%s)' % g['san'] if sanmode and g.get('san') else ''))
        more = len(t['good']) - 3
        return ' / '.join(out) + (' 등 %d가지' % len(t['good']) if more > 0 else '') + (' 가운데 하나' if 1 < len(t['good']) <= 3 else '')
    if t['type'] == 'line':
        def lab(x):
            if sanmode:
                return x['san'] or x['ko']
            sx = x.get('san') or ''
            return x['ko'] + (' 체크메이트' if sx.endswith('#') else ' 체크' if sx.endswith('+') else '')
        parts, k = [], 1
        for x in t['seq']:
            if x['side'] == 'w':
                parts.append('%d. %s' % (k, lab(x)))
                k += 1
            else:
                parts.append('(흑 %s)' % lab(x))
        alt = ''
        if len(t['alts']) > 1:
            alt = ' (첫 수는 %s도 돼요)' % ', '.join(lab(a) for a in t['alts'][1:3])
        return '  '.join(parts) + alt
    if t['type'] == 'place':
        order = sorted(t['need'], key=lambda s: (-int(s[1]), s[0]))
        return ' · '.join('%d %s' % (i + 1, name_of(t['need'][s], names)) for i, s in enumerate(order))
    return ''


# ---------------------------------------------------------------- 책 조각
class Kit:
    def __init__(self, D, P, G, st, teacher=False):
        self.D, self.P, self.G, self.S = D, P, G, st
        self.no = D['no']
        self.sanmode = self.no >= 6
        self.teacher = teacher

    # 공통 블록 ----------------------------------------------------
    def para(self, d, text, ch='body', pp='J', w=TW / MM):
        d.add(d.P(text, ch, pp), text_h(text, self.S.C[ch], w))

    def bullet(self, d, text, ch='body', mark='•', w=TW / MM):
        t = mark + ' ' + clean(text)
        d.add(d.P(t, ch, 'hang'), text_h(t, self.S.C[ch], w - 5))

    def gap(self, d, k='gap'):
        d.add(d.P('', k), self.S.C[k][1] * 0.3528 * 1.6)

    def section(self, d, title, sub=''):
        """'배워요' 같은 소제목: 아래에 진한 줄"""
        runs = d.R(title, 'h2') + (d.R('   ' + sub, 'small') if sub else '')
        x = d.tbl([[(d.P(title, 'h2', 'L', runs=runs), self.S.F['under'], 1, 'BOTTOM', (0, 0, 0, 200))]], [TW])
        d.add(x, 13, keep=True)      # 소제목만 쪽 끝에 남지 않게

    def banner(self, d, left, title, goal=None, label='오늘의 목표  '):
        """차시·단원 마무리 머리: 진한 칸(번호) + 옅은 칸(제목)"""
        lw = mm(30)
        x = d.tbl([[(d.P(left, 'ban', 'CT'), self.S.F['acc'], 1, 'CENTER', (300, 300, 400, 400)),
                    (d.P(title, 'h1', 'LT'), self.S.F['tint'], 1, 'CENTER', (900, 600, 400, 400))]], [lw, TW - lw])
        d.add(x, max(17, text_h(title, self.S.C['h1'], 140, 135) + 4))
        if goal:
            t = label + clean(goal)
            d.add(d.P(t, 'goal', 'LT'), text_h(t, self.S.C['goal'], TW / MM, 135) + 1)
        self.gap(d)

    def callout(self, d, title, lines, ch='body', write=0, foot=None, keep=False):
        """옅은 바탕 + 왼쪽 굵은 줄 상자"""
        ps = d.P(title, 'acc', 'LT')
        hh = text_h(title, self.S.C['acc'], 160, 135)
        for t in lines:
            ps += d.P(clean(t), ch, 'J')
            hh += text_h(t, self.S.C[ch], 160)
        cells = [[(ps, self.S.F['callout'], 1, 'CENTER', (1100, 800, 600, 600))]]
        if write:
            wl = ''.join(d.P(' ', 'body', 'L') for _ in range(write))
            cells.append([(wl, self.S.F['paper'], 1, 'TOP', (1100, 800, 300, 300))])
            hh += write * 7.2
        if foot:
            cells.append([(d.P(foot, 'small', 'RT'), self.S.F['none'], 1, 'CENTER', (0, 0, 300, 0))])
            hh += 7
        d.add(d.tbl(cells, [TW]), hh + 6, keep)

    def wrapup(self, d, summ, ask):
        """정리해요 + 생각 톡톡(쓰는 칸) + 스스로 확인 — 한 덩어리"""
        S = self.S
        mg = (1100, 800, 500, 500)
        a = d.P('정리해요', 'acc', 'LT') + d.P(clean(summ), 'body', 'J')
        b = d.P('생각 톡톡', 'acc', 'LT') + d.P(clean(ask), 'body', 'J')
        w = ''.join(d.P(' ', 'body', 'L') for _ in range(2))
        f = d.P('□ 배워요를 읽었어요    □ 문제를 다 풀었어요    □ 학습관에서도 해 봤어요', 'small', 'RT')
        rows = [[(a, S.F['callout'], 1, 'CENTER', mg)], [(b, S.F['callout'], 1, 'CENTER', mg)],
                [(w, S.F['paper'], 1, 'TOP', mg)], [(f, S.F['none'], 1, 'CENTER', (0, 0, 300, 0))]]
        hh = 2 * text_h('x', S.C['acc'], 160, 135) + text_h(summ, S.C['body'], 160) + text_h(ask, S.C['body'], 160) + 15 + 7 + 8
        d.add(d.tbl(rows, [TW]), hh)

    def filler(self, d):
        """단원 여는 쪽을 오른쪽에 두려고 넣는 쪽: 나의 체스 노트"""
        d.add(d.P('나의 체스 노트', 'h2', 'L'), 10)
        t = '배운 것 가운데 기억하고 싶은 것, 친구와 둔 대국에서 알게 된 것을 적어 보세요.'
        d.add(d.P(t, 'small', 'L'), 8)
        rows = [[(d.P(' ', 'body', 'L'), self.S.F['wline'], 1, 'BOTTOM', (200, 200, 600, 100))] for _ in range(22)]
        d.add(d.tbl(rows, [TW]), 22 * 9.5)

    # 문제 칸 -------------------------------------------------------
    def problem_cell(self, d, n, t, w_mm, pic_mm):
        """문제 하나(번호·글·판·보기·답 칸) → (문단 xml, 높이)"""
        q = book_q(t)
        x = d.P('', 'q', 'LT', runs=d.R('%d  ' % n, 'qb') + d.R(q, 'q'))
        h = text_h('%d  ' % n + q, self.S.C['q'], w_mm - 4, 135)
        if t['type'] == 'game':
            return x, h
        if t['board'] and (t['type'] != 'pick' or meaningful(t['board'])):
            bd = dict(t['board'], marks=place_marks(t)) if t['type'] == 'place' else t['board']
            px, ph = d.pic(self.P.board(bd), pic_mm)
            x += px
            h += ph + 1
            if t.get('turn') == 'b':
                x += d.P('흑 차례', 'cap', 'CT')
                h += 5
        if t['type'] == 'pick':
            o = '   '.join('%s %s' % (NUM[i], clean(v)) for i, v in enumerate(t['opts']))
            x += d.P(o, 'q', 'LT')
            h += text_h(o, self.S.C['q'], w_mm - 4, 135)
        elif t['type'] == 'move':
            x += d.P('가장 적게 (      )번', 'q', 'RT')
            h += 6.5
        elif t['type'] == 'line' and t['moves'] > 1:
            x += d.P('백 (          )  흑 (          )  백 (          )', 'small', 'CT')
            h += 6
        elif t['type'] == 'play' and t['board']['coords']:
            x += d.P('답: (        ) → (        )', 'small', 'RT')
            h += 6
        elif t['type'] == 'place':
            o = '   '.join('%d (        )' % (i + 1) for i in range(len(t['need'])))
            x += d.P(o, 'small', 'LT')
            h += text_h(o, self.S.C['small'], w_mm - 4, 135)
        return x, h + 3

    def grid(self, d, items, start=1, cols=3, pic_mm=50):
        """문제 여러 개를 2칸씩 줄지어(한 줄이 한 블록)"""
        cw = TW // cols
        k = 0
        while k < len(items):
            row = items[k:k + cols]
            if any(t['type'] == 'game' for t in row):
                row = items[k:k + 1]
            cells, hs = [], []
            full = len(row) == 1 and (row[0]['type'] == 'game' or not row[0]['board'])
            for j, t in enumerate(row):
                w = TW if full else cw
                x, h = self.problem_cell(d, start + k + j, t, w / MM, pic_mm)
                cells.append((x, self.S.F['grid'], cols if full else 1, 'TOP', (600, 600, 500, 400)))
                hs.append(h)
            if not full and len(row) < cols:
                cells.append((d.P('', 'q', 'L'), self.S.F['none'], cols - len(row), 'TOP', None))
            d.add(d.tbl([cells], [cw] * cols if not full else [TW]), max(hs) + 4)
            k += len(row)


def unit_art(U, D):
    """단원 여는 쪽 그림: 말 이름 단원이면 그 말(백·흑), 아니면 첫 예시의 마지막 장면"""
    names = D['pieceNames']
    for c, nm in names.items():
        if U['title'].strip() == nm:
            return [c, c.lower()]
    for L in U['lessons']:
        for e in L['ex']:
            if e['frames']:
                return e['frames'][-1]['board']
    return None


def meaningful(b):
    return b and (b['marks'] or b['arrows'] or b['swap'] or b['flip'] or b['pos'] != '8/8/8/8/8/8/8/8')


# ---------------------------------------------------------------- 학생용 교재
def lesson_items(L):
    """책에 싣는 문제: 따라 하기 + 연습(대결은 안내만), 모두 6개 안팎"""
    do = [t for t in L['do'] if t]
    pr = [t for t in L['pr'] if t and t['type'] != 'game']
    games = [t for t in L['do'] + L['pr'] if t and t['type'] == 'game']
    items = [t for t in do if t['type'] != 'game'] + pr
    items = items[:max(6, len([t for t in do if t['type'] != 'game']))]
    return items, games[:1]


def student(D, P, G, M, st, plan=None):
    no, title = D['no'], D['title']
    d = Doc('체스 학습관 %d마당 학생용 교재' % no, st, '체스 학습관 %d마당' % no, '%d마당 · %s' % (no, title))
    k = Kit(D, P, G, st)
    pg = plan or {}
    units = D['units']

    # 표지 ---------------------------------------------------------
    d.new_page(hide=True)
    d.hide.add(0)
    cover = [[(d.P('초등 체스 교실 · 체스 학습관 교재', 'c0', 'CT') + d.P(' ', 'gap2', 'CT') + d.P('%d마당' % no, 'c1', 'CT')
               + d.P(title, 'c2', 'CT') + d.P(' ', 'gap2', 'CT'), st.F['acc'], 1, 'CENTER', (1500, 1500, 3500, 3500))]]
    d.add(d.tbl(cover, [TW]), 85)
    d.add(d.P(' ', 'gap2'), 6)
    x, h = d.pic(P.big(['K', 'Q', 'R', 'B', 'N', 'P']), 150)
    d.add(x, h)
    x, h = d.pic(P.big(['k', 'q', 'r', 'b', 'n', 'p']), 150)
    d.add(x, h + 6)
    rows = [[(d.P('학생용 교재', 'c4', 'CT'), st.F['boxT'], 1, 'CENTER', (600, 600, 500, 500))]]
    d.add(d.tbl(rows, [mm(60)]), 14)
    d.add(d.P(' ', 'gap2'), 10)
    d.add(d.P('(      )학년 (      )반 (      )번    이름 (                          )', 'c3', 'CT'), 9)
    d.add(d.P(' ', 'gap2'), 6)
    d.add(d.P('초등교사 홍지희 지음', 'c3', 'CT'), 9)

    # 일러두기 ------------------------------------------------------
    d.new_page()
    d.add(d.P('이 책을 쓰는 방법', 'pt', 'L'), 14)
    k.gap(d, 'gap2')
    for t in ['이 책은 「체스 학습관」 %d마당(%s)을 종이로 공부하는 책이에요. 학습관 %d차시와 이 책의 %d차시는 같은 내용이에요.' % (no, title, 1, 1),
              '차시마다 ‘배워요 → 예시로 보기 → 풀어 봐요 → 정리해요’ 차례로 공부해요.',
              '판 그림에 직접 ○표를 하거나 화살표를 그려요. 연필로 그리면 지우고 다시 풀 수 있어요.',
              '모르는 문제는 학습관에서 같은 차시를 열어 힌트를 받아 보세요. 정답과 풀이는 책 뒤쪽에 있어요.',
              '실제 체스판과 말이 있으면 책의 그림을 그대로 놓아 보고 움직여 보세요. 훨씬 잘 기억나요.',
              '단원이 끝나면 ‘단원 마무리’, 마당이 끝나면 ‘마당 확인 평가’로 스스로 확인해요.',
              '모르는 낱말은 책 맨 뒤 ‘용어 풀이’에서 찾아요.']:
        k.bullet(d, t)
    k.gap(d, 'gap2')
    k.callout(d, '학습관 주소', [SITE + D['id'] + '.html', '(차시 번호를 붙이면 그 차시가 바로 열려요. 예: ' + D['id'] + '.html#l3)'], ch='small')
    k.gap(d, 'gap2')
    d.add(d.P('판 그림 읽는 법', 'h2', 'L'), 10)
    for t in ['판의 아래쪽이 백(흰 말), 위쪽이 흑(검은 말)이에요. 판 둘레의 a~h, 1~8로 칸 이름을 읽어요.',
              '노란 칸은 ‘이 말을 보세요’, 초록 점은 ‘갈 수 있는 칸’, 빨간 칸이나 ✕는 ‘안 되는 칸’이라는 뜻이에요.',
              '★ 별이 있는 문제는 말을 움직여 별을 모으는 문제예요. 별 칸에 멈춰야 별을 모아요.',
              '화살표는 말이 움직이는 길이에요. 내가 둘 수는 판에 연필로 화살표를 그려요.']:
        k.bullet(d, t)

    # 머리말 --------------------------------------------------------
    d.new_page()
    d.add(d.P('머리말', 'pt', 'L'), 14)
    k.gap(d, 'gap2')
    for t in M.PREFACE:
        k.para(d, clean(t))
        k.gap(d)
    d.add(d.P('초등교사 홍지희', 'bodyb', 'R'), 8)

    # 이 책의 짜임 ----------------------------------------------------
    d.new_page()
    d.add(d.P('이 책의 짜임', 'pt', 'L'), 14)
    k.gap(d, 'gap2')
    for a, b in [('단원 여는 쪽', '단원에서 배울 차시와 단원 이야기를 미리 봐요.'),
                 ('배워요', '오늘 배울 것을 글과 판 그림으로 차근차근 알아봐요.'),
                 ('예시로 보기', '판 위에서 말이 움직이는 장면을 차례로 보며 배운 것을 확인해요.'),
                 ('풀어 봐요', '배운 것을 문제로 풀어요. 앞의 문제는 따라 하기, 뒤의 문제는 혼자 하기예요.'),
                 ('학습관 대결', '인공지능과 겨루는 활동은 학습관(컴퓨터·태블릿)에서 해요.'),
                 ('정리해요 · 생각 톡톡', '꼭 기억할 것을 정리하고, 생각을 넓히는 질문에 답을 써요.'),
                 ('단원 마무리', '단원에서 배운 것을 섞어 풀며 스스로 확인해요.'),
                 ('마당 확인 평가', '마당 전체를 돌아보는 문제예요. 다 맞히면 학습관 확인 시험에 도전해요!'),
                 ('정답과 풀이 · 용어 풀이', '책 뒤에 있어요. 틀린 문제는 왜 틀렸는지 꼭 다시 봐요.')]:
        x = d.tbl([[(d.P(a, 'acc', 'CT'), st.F['tint'], 1, 'CENTER', (300, 300, 500, 500)),
                    (d.P(b, 'body', 'LT'), st.F['box'], 1, 'CENTER', (800, 500, 500, 500))]], [mm(48), TW - mm(48)])
        d.add(x, 15)

    # 차례 ---------------------------------------------------------
    d.new_page()
    d.add(d.P('차례', 'pt', 'L'), 14)
    k.gap(d)
    toc = []
    for ui, U in enumerate(units):
        toc.append(('U', '%d단원  %s' % (ui + 1, U['title']), 'u%d' % ui))
        for L in U['lessons']:
            toc.append(('L', '%d차시  %s' % (L['no'], L['title']), 'l%d' % L['no']))
        toc.append(('L', '단원 마무리', 'r%d' % ui))
    toc += [('U', '마당 확인 평가', 'exam'), ('U', '정답과 풀이', 'ans'), ('U', '용어 풀이', 'terms')]
    for kind, t, key in toc:
        n = pg.get(key, 0)
        ch = 'tocU' if kind == 'U' else 'toc'
        runs = d.R(('' if kind == 'U' else '      ') + t, ch) + '<hp:run charPrIDRef="%d"><hp:tab width="0" leader="3" type="2"/><hp:t>%d</hp:t></hp:run>' % (st.C['tocN'][0], n)
        d.add(d.P(t, ch, 'tab', runs=runs), (8.6 if kind == 'U' else 6.6) + (2.4 if kind == 'U' else 0))
        if kind == 'U':
            pass

    # 단원 ---------------------------------------------------------
    keys = []
    for ui, U in enumerate(units):
        d.to_odd(lambda: k.filler(d))
        d.hide.add(len(d.pages) - 1)
        d.marks['u%d' % ui] = len(d.pages)
        x = d.tbl([[(d.P('%d마당' % no, 'u0', 'LT') + d.P('%d단원' % (ui + 1), 'u1', 'LT') + d.P(U['title'], 'u2', 'LT'),
                     st.F['tint'], 1, 'CENTER', (2500, 1500, 3000, 3000))]], [TW])
        d.add(x, 70)
        d.add(d.P(' ', 'gap2'), 8)
        k.para(d, clean(M.UNIT[ui]), 'body')
        art = unit_art(U, D)
        free = d.room() - (math.ceil(len(U['lessons']) / (2 if len(U['lessons']) > 8 else 1)) * 11 + 22)      # 단원 여는 쪽이 한 쪽을 넘지 않게
        if art and free > 30:
            d.add(d.P(' ', 'gap2'), 4)
            if isinstance(art, list):
                x, h = d.pic(P.big(art), min(34 * len(art), (free - 8) * len(art)))
            else:
                x, h = d.pic(P.board(art), min(70, free - 8))
            d.add(x, h + 4)
        d.add(d.P(' ', 'gap2'), 6)
        d.add(d.P('이 단원에서 배울 것', 'h2', 'L'), 10)
        two = len(U['lessons']) > 8
        ls_ = U['lessons']
        per = 2 if two else 1
        for i in range(0, len(ls_), per):
            row, ws = [], []
            for L in ls_[i:i + per]:
                row += [(d.P('%d차시' % L['no'], 'accS', 'CT'), st.F['tint'], 1, 'CENTER', (200, 200, 250, 250)),
                        (d.P(L['title'], 'q' if two else 'bodyb', 'LT'), st.F['box'], 1, 'CENTER', (500, 200, 250, 250)),
                        (d.P('□', 'body', 'CT'), st.F['box'], 1, 'CENTER', (100, 100, 250, 250))]
                cw = TW // per
                ws += [mm(20), cw - mm(30), mm(10)]
            if len(row) < 3 * per:
                row.append((d.P('', 'q', 'L'), st.F['none'], 3, 'CENTER', None))
                ws += [mm(20), TW // 2 - mm(30), mm(10)]
            ws[-1] += TW - sum(ws)
            th = max(text_h(L['title'], st.C['q'], TW / MM / per - 33, 135) for L in ls_[i:i + per])
            d.add(d.tbl([row], ws), max(9.6, th + 3))
        d.add(d.P('다 공부한 차시는 □에 ✓ 표시를 해요.', 'cap', 'R'), 6)

        for L in U['lessons']:
            d.new_page()
            d.marks['l%d' % L['no']] = len(d.pages)
            k.banner(d, '%d차시' % L['no'], L['title'], L['sum'])
            # 배워요
            k.section(d, '배워요')
            pics = 0
            for s in L['say']:
                b = s['board']
                showb = b and pics < 3 and meaningful(b) and not s.get('big')
                if s.get('big'):
                    k.para(d, clean(s['text']))
                    x, h = d.pic(P.big(s['big']), 20 * len(s['big']) + 6)
                    d.add(x, h + 2)
                elif showb:
                    pics += 1
                    pw = 50
                    tx = d.P(clean(s['text']), 'body', 'J')
                    th = text_h(s['text'], st.C['body'], TW / MM - pw - 10)
                    px, ph = d.pic(P.board(b), pw)
                    x = d.tbl([[(tx, st.F['none'], 1, 'CENTER', (0, 900, 200, 200)), (px, st.F['none'], 1, 'CENTER', (0, 0, 200, 200))]],
                              [TW - mm(pw + 2), mm(pw + 2)])
                    d.add(x, max(th, ph) + 3)
                else:
                    k.para(d, clean(s['text']))
                    k.gap(d)
            # 예시로 보기
            if L['ex']:
                k.section(d, '예시로 보기', '장면을 차례로 따라가 보세요.')
                for ei, e in enumerate(L['ex']):
                    fr = e['frames']
                    if len(fr) > 3:
                        pick = [fr[0], fr[len(fr) // 2], fr[-1]] if len(fr) > 4 else [fr[0], fr[-2], fr[-1]]
                    else:
                        pick = fr
                    head = '예시 %d  %s' % (ei + 1, clean(e['text']))
                    hx = d.P('', 'body', 'J', runs=d.R('예시 %d  ' % (ei + 1), 'acc') + d.R(clean(e['text']), 'body'))
                    hh = text_h(head, st.C['body'], TW / MM)
                    cw = TW // 3
                    cells, ph = [], 0
                    for fi, f in enumerate(pick):
                        n = fr.index(f) + 1
                        px, h = d.pic(P.board(f['board']), 47)
                        cap = '장면 %d  %s' % (n, clean(f['cap'])) if f['cap'] else '장면 %d' % n
                        cells.append((px + d.P(cap, 'cap', 'CT'), st.F['none'], 1, 'TOP', (300, 300, 100, 100)))
                        ph = max(ph, h + text_h(cap, st.C['cap'], 52, 130))
                    while len(cells) < 3:
                        cells.append((d.P('', 'cap', 'C'), st.F['none'], 1, 'TOP', None))
                    rest = [(i + 1, clean(f['cap'])) for i, f in enumerate(fr) if f not in pick and f['cap']]
                    rx, rh = '', 0
                    for i, c in rest:
                        t = '장면 %d  %s' % (i, c)
                        rx += d.P(t, 'small', 'LT')
                        rh += text_h(t, st.C['small'], TW / MM, 135)
                    d.add(hx, hh, keep=True)
                    d.add(d.tbl([cells], [cw, cw, TW - 2 * cw]), ph + 4)
                    if rx:
                        d.add(rx, rh)
                    k.gap(d)
            # 풀어 봐요
            items, games = lesson_items(L)
            k.section(d, '풀어 봐요', '1~%d번은 따라 하기, 그다음은 혼자 하기' % len([t for t in L['do'] if t and t['type'] != 'game']) if L['do'] else '')
            k.grid(d, items)
            for t in games:
                k.callout(d, '학습관 대결', [clean(t['q']), '학습관 %s.html#l%d에서 인공지능과 겨뤄 보세요. 이기면 이 칸에 ✓, 걸린 판 수도 적어 봐요.  (     )판 만에 이겼어요.' % (D['id'], L['no'])])
            keys.append((L, items))
            # 정리해요
            g = G.get(L['id'], {})
            k.gap(d)
            k.wrapup(d, L['sum'], g['ask'][0])

        # 단원 마무리
        d.new_page()
        d.marks['r%d' % ui] = len(d.pages)
        k.banner(d, '단원 마무리', '%d단원 %s' % (ui + 1, U['title']), '이 단원에서 배운 것을 섞어 풀어 보세요.', '')
        pool = []
        for L in U['lessons']:
            pool += [(L, t) for t in L['rv'][:1] if t['type'] != 'game']
        if len(pool) > 6:
            step = len(pool) / 6.0
            pool = [pool[int(i * step)] for i in range(6)]
        k.grid(d, [t for _, t in pool])
        keys.append(({'review': ui, 'title': '%d단원 마무리' % (ui + 1)}, [t for _, t in pool]))
        rows = [[(d.P('맞힌 문제', 'accS', 'CT'), st.F['tint'], 1, 'CENTER', None), (d.P('(      ) / %d' % len(pool), 'body', 'CT'), st.F['box'], 1, 'CENTER', None),
                 (d.P('다시 볼 차시', 'accS', 'CT'), st.F['tint'], 1, 'CENTER', None), (d.P(' ', 'body', 'CT'), st.F['box'], 1, 'CENTER', None)]]
        k.gap(d)
        d.add(d.tbl(rows, [mm(28), mm(40), mm(30), TW - mm(98)]), 10)

    # 마당 확인 평가 ---------------------------------------------------
    d.to_odd(lambda: k.filler(d))
    d.marks['exam'] = len(d.pages)
    k.banner(d, '확인 평가', '%d마당 확인 평가' % no, '마당 전체를 돌아봐요. 힌트 없이 혼자 풀어 보세요.', '')
    allL = [L for U in units for L in U['lessons']]
    pool = [(L, L['rv'][1] if len(L['rv']) > 1 else (L['rv'][0] if L['rv'] else None)) for L in allL]
    pool = [(L, t) for L, t in pool if t and t['type'] != 'game']
    if len(pool) > 12:
        step = len(pool) / 12.0
        pool = [pool[int(i * step)] for i in range(12)]
    k.grid(d, [t for _, t in pool])
    keys.append(({'review': -1, 'title': '마당 확인 평가'}, [t for _, t in pool]))
    k.gap(d)
    k.callout(d, '나의 결과', ['맞힌 문제 (      ) / %d     ·  %d개 이상 맞혔다면 학습관의 ‘확인 시험’(15문제 중 12문제 통과)에 도전해 %s 등급을 받아요!' % (len(pool), max(1, len(pool) - 2), RANK[no])])

    # 정답과 풀이 -----------------------------------------------------
    d.new_page()
    d.marks['ans'] = len(d.pages)
    d.add(d.P('정답과 풀이', 'pt', 'L'), 14)
    k.gap(d)
    for L, items in keys:
        nm = ('%d차시  %s' % (L['no'], L['title'])) if 'no' in L else L['title']
        d.add(d.tbl([[(d.P(nm, 'keyb', 'LT'), st.F['under'], 1, 'BOTTOM', (0, 0, 100, 100))]], [TW]), 8, )
        NC = 3
        cw = TW // NC
        cells, hs = [], []

        def flush():
            if not cells:
                return
            if len(cells) < NC:
                cells.append((d.P('', 'key', 'L'), st.F['none'], NC - len(cells), 'TOP', None))
            d.add(d.tbl([list(cells)], [cw] * (NC - 1) + [TW - cw * (NC - 1)]), max(hs) + 2)
            cells.clear()
            hs.clear()
        for i, t in enumerate(items):
            a = ans_text(t, D, k.sanmode)
            body = d.P('', 'key', 'LT', runs=d.R('%d  ' % (i + 1), 'keyb') + d.R(a, 'key'))
            pic = t['type'] in ('click', 'move', 'play', 'line') and t['board'] and not (t['type'] == 'click' and t['board']['coords'] and len(t['ans']) <= 2)
            tw = cw / MM - (26 if pic else 2)
            h = text_h('%d  ' % (i + 1) + a, st.C['key'], tw, 135)
            ok = clean(t.get('ok', ''))
            ok = re.sub(r'^(맞아요|잘했어요|좋아요|정답이에요)[!.]?\s*', '', ok)
            if ok and len(ok) > 4:
                body += d.P(ok, 'cap', 'LT')
                h += text_h(ok, st.C['cap'], tw, 130)
            if pic:
                px, ph = d.pic(P.board(ans_marks(t)), 23, 'picL')
                x = d.tbl([[(body, st.F['none'], 1, 'TOP', (0, 200, 0, 0)), (px, st.F['none'], 1, 'TOP', (0, 0, 0, 0))]], [cw - mm(25), mm(24)])
                h = max(h, ph) + 1
            else:
                x = body
            cells.append((x, st.F['none'], 1, 'TOP', (200, 300, 150, 150)))
            hs.append(h + 1)
            if len(cells) == NC:
                flush()
        flush()
        k.gap(d)

    # 용어 풀이 -------------------------------------------------------
    d.new_page()
    d.marks['terms'] = len(d.pages)
    d.add(d.P('용어 풀이', 'pt', 'L'), 14)
    d.add(d.P('가나다 차례예요. ‘배우는 곳’의 차시에서 처음 자세히 배워요.', 'small', 'L'), 7)
    k.gap(d)
    lno = {L['id']: L['no'] for U in units for L in U['lessons']}
    rows = [[(d.P('용어', 'accS', 'CT'), st.F['tint'], 1, 'CENTER', None), (d.P('뜻', 'accS', 'CT'), st.F['tint'], 1, 'CENTER', None),
             (d.P('배우는 곳', 'accS', 'CT'), st.F['tint'], 1, 'CENTER', None)]]
    d.add(d.tbl(rows, [mm(36), TW - mm(64), mm(28)], st.F['box']), 9)
    for term, mean, lid in sorted(M.TERMS, key=lambda x: x[0]):
        n = lno.get(lid, 0)
        r = [[(d.P(term, 'bodyb', 'CT'), st.F['box'], 1, 'CENTER', None), (d.P(clean(mean), 'q', 'LT'), st.F['box'], 1, 'CENTER', (700, 400, 250, 250)),
              (d.P('%d차시 (%d쪽)' % (n, pg.get('l%d' % n, 0)), 'small', 'CT'), st.F['box'], 1, 'CENTER', None)]]
        d.add(d.tbl(r, [mm(36), TW - mm(64), mm(28)], st.F['box']), text_h(mean, st.C['q'], 105, 135) + 4)
    return d


# ---------------------------------------------------------------- 지도서
def teacher(D, P, G, M, st, plan=None, spg=None):
    no, title = D['no'], D['title']
    d = Doc('체스 학습관 %d마당 지도서' % no, st, '체스 학습관 %d마당 지도서' % no, '%d마당 · %s' % (no, title))
    k = Kit(D, P, G, st, teacher=True)
    pg, spg = plan or {}, spg or {}
    units = D['units']
    d.hide.add(0)
    cover = [[(d.P('초등 체스 교실 · 체스 학습관 교재', 'c0', 'CT') + d.P(' ', 'gap2', 'CT') + d.P('%d마당' % no, 'c1', 'CT')
               + d.P(title, 'c2', 'CT') + d.P(' ', 'gap2', 'CT'), st.F['acc'], 1, 'CENTER', (1500, 1500, 3500, 3500))]]
    d.add(d.tbl(cover, [TW]), 85)
    d.add(d.P(' ', 'gap2'), 8)
    x, h = d.pic(P.big(['K', 'Q', 'R', 'B', 'N', 'P']), 150)
    d.add(x, h + 8)
    d.add(d.tbl([[(d.P('선생님용 지도서', 'c4', 'CT'), st.F['boxT'], 1, 'CENTER', (600, 600, 500, 500))]], [mm(70)]), 14)
    d.add(d.P(' ', 'gap2'), 12)
    d.add(d.P('학생용 교재 · 체스 학습관과 함께 씁니다', 'c3', 'CT'), 9)
    d.add(d.P('초등교사 홍지희 지음', 'c3', 'CT'), 9)

    d.new_page()
    d.add(d.P('선생님께', 'pt', 'L'), 14)
    k.gap(d, 'gap2')
    for t in M.TPREFACE:
        k.para(d, clean(t))
        k.gap(d)
    d.add(d.P('초등교사 홍지희', 'bodyb', 'R'), 8)

    d.new_page()
    d.add(d.P('학습관과 교재', 'pt', 'L'), 14)
    k.gap(d)
    d.add(d.P('1. 체스 학습관의 짜임', 'h2', 'L'), 10)
    for t in ['학년 구분 없이 모든 학생이 1마당 1차시부터 차례대로 배웁니다(6마당 175차시). 마당을 마치면 확인 시험으로 등급(폰 → 나이트 → 비숍 → 룩 → 퀸 → 킹)을 받습니다.',
              '차시 흐름: 설명 → 예시(판 위에서 차례로 움직이는 장면) → 따라 하기 → 연습(할 때마다 새 문제) → 마무리.',
              '맞히면 저절로 넘어가고, 틀리면 처음엔 실마리와 틀린 까닭을, 두 번째엔 정답을 보여 준 뒤 비슷한 문제를 하나 더 냅니다. 연습을 한 번에 맞힌 비율로 별(★1~3)을 받습니다.',
              '기록은 그 기기에만 저장됩니다. 읽어 주기(브라우저 한국어 음성)를 켜고 끌 수 있습니다.']:
        k.bullet(d, t)
    k.gap(d, 'gap2')
    d.add(d.P('2. 저절로 나오는 힌트', 'h2', 'L'), 10)
    rows = [['문제 종류', '1번째 힌트', '2번째 힌트', '3번째(정답)'], ['쉬운 조작', '10초', '+10초', '+10초'], ['한 수 생각', '15초', '+15초', '+15초'], ['깊은 생각', '20초', '+20초', '+20초']]
    for i, r in enumerate(rows):
        d.add(d.tbl([[(d.P(v, 'accS' if i == 0 else 'q', 'CT'), st.F['boxT'] if i == 0 else st.F['box'], 1, 'CENTER', None) for v in r]], [TW // 4] * 3 + [TW - 3 * (TW // 4)]), 8.5)
    for t in ['아무것도 누르지 않을 때 시간을 세고, 화면을 누르면 처음부터 다시 셉니다. 읽어 주기가 꺼져 있으면 글을 읽을 시간(글자 수 ÷ 5초, 최소 3초)이 지난 뒤부터 셉니다.',
              '⚙ 선생님 설정에서 빠르게(절반)·보통·느긋하게(두 배)·끄기, 모든 차시 열기, 기록 지우기를 할 수 있습니다. 확인 시험과 인공지능 대결에는 저절로 힌트가 없습니다.']:
        k.bullet(d, t)
    k.gap(d, 'gap2')
    d.add(d.P('3. 교재와 학습관을 함께 쓰는 방법', 'h2', 'L'), 10)
    for t in ['교실 수업: 전자칠판으로 학습관의 설명·예시를 함께 보고 → 학생용 교재의 ‘풀어 봐요’를 풀고 → 개인 기기로 연습합니다.',
              '가정 학습: 교재의 ‘배워요·예시로 보기’를 읽고 학습관에서 같은 차시를 해 봅니다.',
              '교재의 문제는 학습관 연습 문제에서 고른 것이라 학습관과 같은 꼴입니다. 인공지능 대결은 교재에 ‘학습관 대결’ 상자로만 안내합니다.',
              '이 지도서의 차시마다 학생용 교재 쪽수를 적어 두었습니다. 정답은 학생용 교재 맨 뒤 ‘정답과 풀이’에도 있습니다.']:
        k.bullet(d, t)

    d.new_page()
    d.add(d.P('차례', 'pt', 'L'), 14)
    k.gap(d)
    toc = [('U', '차시 한눈에 보기', 'glance')]
    for ui, U in enumerate(units):
        toc.append(('U', '%d단원  %s' % (ui + 1, U['title']), 'u%d' % ui))
        for L in U['lessons']:
            toc.append(('L', '%d차시  %s' % (L['no'], L['title']), 'l%d' % L['no']))
    toc += [('U', '확인 시험과 수료증', 'exam'), ('U', '용어 풀이', 'terms')]
    for kind, t, key in toc:
        ch = 'tocU' if kind == 'U' else 'toc'
        runs = d.R(('' if kind == 'U' else '      ') + t, ch) + '<hp:run charPrIDRef="%d"><hp:tab width="0" leader="3" type="2"/><hp:t>%d</hp:t></hp:run>' % (st.C['tocN'][0], pg.get(key, 0))
        d.add(d.P(t, ch, 'tab', runs=runs), 8.6 + 2.4 if kind == 'U' else 6.6)

    d.new_page()
    d.marks['glance'] = len(d.pages)
    d.add(d.P('차시 한눈에 보기', 'pt', 'L'), 14)
    k.gap(d)
    ws = [mm(13), mm(34), TW - mm(13 + 34 + 24 + 26), mm(24), mm(26)]
    d.add(d.tbl([[(d.P(v, 'accS', 'CT'), st.F['boxT'], 1, 'CENTER', None) for v in ['차시', '단원', '제목', '문제 종류', '학생용 교재']]], ws), 8.5)
    for ui, U in enumerate(units):
        for L in U['lessons']:
            r = ['%d' % L['no'], U['title'], L['title'], KIND[L['kind']][0], '%d쪽' % spg.get('l%d' % L['no'], 0)]
            d.add(d.tbl([[(d.P(v, 'q', 'CT' if j != 2 else 'LT'), st.F['box'], 1, 'CENTER', None) for j, v in enumerate(r)]], ws), max(7.6, text_h(L['title'], st.C['q'], ws[2] / MM - 3, 135) + 2))

    for ui, U in enumerate(units):
        d.new_page()
        d.marks['u%d' % ui] = len(d.pages)
        x = d.tbl([[(d.P('%d단원' % (ui + 1), 'u1', 'LT') + d.P(U['title'], 'u2', 'LT'), st.F['tint'], 1, 'CENTER', (2500, 1500, 2000, 2000))]], [TW])
        d.add(x, 45)
        k.gap(d, 'gap2')
        k.para(d, clean(M.UNIT[ui]))
        k.gap(d, 'gap2')
        d.add(d.P('단원의 차시', 'h2', 'L'), 10)
        for L in U['lessons']:
            k.bullet(d, '%d차시 %s — %s (학생용 교재 %d쪽)' % (L['no'], L['title'], clean(L['sum']), spg.get('l%d' % L['no'], 0)))
        for L in U['lessons']:
            g = G[L['id']]
            d.new_page()
            d.marks['l%d' % L['no']] = len(d.pages)
            k.banner(d, '%d차시' % L['no'], L['title'], L['sum'])
            kd = KIND[L['kind']]
            info = [('문제 종류', '%s · 저절로 힌트 %s' % kd), ('학습관', SITE + '%s.html#l%d' % (D['id'], L['no'])),
                    ('학생용 교재', '%d쪽부터' % spg.get('l%d' % L['no'], 0))]
            for a, b in info:
                d.add(d.tbl([[(d.P(a, 'accS', 'CT'), st.F['tint'], 1, 'CENTER', None), (d.P(b, 'q', 'LT'), st.F['box'], 1, 'CENTER', (700, 300, 200, 200))]], [mm(30), TW - mm(30)]), 8)
            k.gap(d)
            k.section(d, '지도 흐름')
            d.add(d.P('① 설명', 'acc', 'L'), 7.5)
            for s in L['say']:
                k.bullet(d, s['text'], 'q', '-')
            if L['ex']:
                d.add(d.P('② 예시', 'acc', 'L'), 7.5)
                for e in L['ex']:
                    caps = ' → '.join(clean(f['cap']) for f in e['frames'] if f['cap'])
                    k.bullet(d, clean(e['text']) + (' (' + caps + ')' if caps else ''), 'q', '-')
            d.add(d.P('③ 따라 하기와 힌트', 'acc', 'L'), 7.5)
            for t in L['do']:
                if t:
                    k.bullet(d, clean(t['q']) + (' — 힌트: ' + ' / '.join(clean(h) for h in t['hint']) if t.get('hint') else ''), 'q', '-')
            items, games = lesson_items(L)
            d.add(d.P('④ 교재 문제 정답', 'acc', 'L'), 7.5)
            for i, t in enumerate(items):
                k.bullet(d, '%d. %s' % (i + 1, ans_text(t, D, k.sanmode)), 'q', '')
            for t in games:
                k.bullet(d, '학습관 대결: ' + clean(t['q']), 'q', '-')
            for key, nm, mk in [('mis', '자주 하는 실수', '•'), ('tip', '지도 도움말', '•'), ('ask', '생각을 여는 질문(발문)', 'Q.')]:
                k.section(d, nm)
                for t in g[key]:
                    k.bullet(d, t, 'body', mk)
            k.gap(d)
            d.add(d.P('※ ‘생각 톡톡’(학생용 교재)에는 첫 번째 발문이 실려 있습니다.', 'cap', 'L'), 6)

    d.new_page()
    d.marks['exam'] = len(d.pages)
    d.add(d.P('확인 시험과 수료증', 'pt', 'L'), 14)
    k.gap(d)
    for t in ['학습관 차시 목록 맨 아래 ‘확인 시험’: %d마당의 모든 차시에서 고른 15문제, 12문제 이상 맞히면 통과(%s 등급).' % (no, RANK[no]),
              '확인 시험은 힌트가 없고, 틀리면 정답을 보여 준 뒤 바로 다음 문제로 넘어갑니다. 결과 화면에 ‘다시 보면 좋은 차시’가 나옵니다.',
              '통과하면 학습관에서 이름을 넣어 수료증(A4 가로)을 인쇄할 수 있습니다.',
              '학생용 교재의 ‘마당 확인 평가’(%d쪽)로 종이 평가를 먼저 하고 학습관 확인 시험을 보게 하면 좋습니다.' % spg.get('exam', 0),
              '🔁 다시 보기: 학습관은 배운 차시에서 3문제를 골라 다시 풀게 합니다(자주 틀린 차시 먼저).']:
        k.bullet(d, t)

    d.new_page()
    d.marks['terms'] = len(d.pages)
    d.add(d.P('용어 풀이', 'pt', 'L'), 14)
    k.gap(d)
    lno = {L['id']: L['no'] for U in units for L in U['lessons']}
    for term, mean, lid in sorted(M.TERMS, key=lambda x: x[0]):
        n = lno.get(lid, 0)
        r = [[(d.P(term, 'bodyb', 'CT'), st.F['box'], 1, 'CENTER', None), (d.P(clean(mean), 'q', 'LT'), st.F['box'], 1, 'CENTER', (700, 400, 250, 250)),
              (d.P('%d차시' % n, 'small', 'CT'), st.F['box'], 1, 'CENTER', None)]]
        d.add(d.tbl(r, [mm(36), TW - mm(58), mm(22)], st.F['box']), text_h(mean, st.C['q'], 110, 135) + 4)
    return d


# ---------------------------------------------------------------- 만들기
def main(mid, check=False):
    exp = subprocess.run(['node', os.path.join(HERE, 'export.js'), mid, '5', '2'], capture_output=True, text=True)
    if exp.returncode:
        sys.exit('자료 뽑기 실패\n' + exp.stderr[-2000:])
    D = json.loads(exp.stdout)
    M = importlib.import_module('guide_' + mid)
    G = M.G
    ids = [L['id'] for U in D['units'] for L in U['lessons']]
    miss = [i for i in ids if i not in G]
    if miss or len(M.UNIT) != len(D['units']):
        sys.exit('guide_%s.py에 빠진 것: %s / 단원 소개 %d개(단원 %d개)' % (mid, miss, len(M.UNIT), len(D['units'])))
    acc, tint = ACC[D['no']]
    P = Pics()

    def make(sp=None, tp=None, spg=None):
        st = Style(acc, tint)
        s = student(D, P, G, M, st, sp)
        st2 = Style(acc, tint)
        t = teacher(D, P, G, M, st2, tp, spg)
        return s, t
    s, t = make()                    # 1차: 그림 목록·쪽 번호 어림
    P.shoot()
    s, t = make(s.marks, t.marks, s.marks)
    s2, t2 = make(s.marks, t.marks, s.marks)   # 쪽 번호가 바뀌지 않았는지 한 번 더
    assert s2.marks == s.marks and t2.marks == t.marks, '쪽 번호가 흔들려요'
    print('학생용 %d쪽 · 지도서 %d쪽' % (len(s.pages), len(t.pages)))
    over = [i + 1 for i, p in enumerate(s.pages) if sum(h for _, h in p) > BUDGET + 1]
    if over:
        print('[알림] 어림 높이를 넘는 쪽(한 블록이 큰 쪽):', over[:20])
    with open(os.path.join(IMG, '_est.json'), 'w') as f:
        json.dump([[round(h, 1) for _, h in pg] for pg in s2.pages], f)
    if check:
        return
    os.makedirs(OUT, exist_ok=True)
    for doc, name in [(s2, '체스_%d마당_학생용교재.hwpx' % D['no']), (t2, '체스_%d마당_지도서.hwpx' % D['no'])]:
        doc.build_body()
        p = os.path.join(OUT, name)
        doc.save(p, now=STAMP)
        bad = H.check(p)
        if bad:
            sys.exit('점검 실패 %s: %s' % (name, bad[:5]))
        print('만듦:', name, '%.1fMB' % (os.path.getsize(p) / 1e6))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'm2', 'check' in sys.argv[2:])
