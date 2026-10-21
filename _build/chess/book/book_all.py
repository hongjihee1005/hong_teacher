# -*- coding: utf-8 -*-
"""체스 학습관 1~6마당 학생용 교재를 한 권으로 — 부크크(BOOKK) A4 출판 틀에 맞춤(한글 HWPX)

    python3 _build/chess/book/book_all.py          # special/chess/book/체스학습관_학생용교재_1-6마당_부크크A4.hwpx
    python3 _build/chess/book/book_all.py check    # 만들지 않고 쪽 수만

틀: bookk_a4_template.hwp(선생님이 올린 부크크 'A4 원고 양식', 2026-10-20). 이 파일을 python-hwpx로 HWPX로 바꿔 읽고,
- 쪽 크기 216×303mm(재단 여백 3mm 포함)·여백·맞쪽·글꼴·글자/문단 모양(header.xml)을 그대로 씀
- 앞부분 4쪽(반표제 → 판권 → 속표지 → CONTENT)은 틀의 문단을 그대로 옮겨 글만 바꿈(틀의 '편집 시 유의사항' 쪽은 뺌)
- 꼬리말 쪽 번호도 틀과 같은 꼴: 짝수 쪽 '번호    책 이름', 홀수 쪽 '장 이름    번호'(머리말부터, 마당마다 장 이름이 바뀜)
본문은 book.py의 2~6마당 책과 같은 차시 짜임(배워요·예시로 보기·풀어 봐요·정리해요)을 본문 너비 155mm에 맞춰 줄이고,
글꼴은 틀에 있는 부크크 고딕 Light/Bold를 씁니다. 마당마다 색이 다릅니다(컬러 인쇄 기준).
판권의 발행일·ISBN은 틀의 자리 표시를 그대로 둡니다(부크크에서 받은 값으로 바꿔 넣을 것).
"""
import json, sys, os, re, json, subprocess, importlib, zipfile, warnings
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import book as B  # noqa: E402
H, MM, mm = B.H, B.MM, B.mm

TEMPLATE = os.path.join(HERE, 'bookk_a4_template.hwp')
OUTNAME = '체스학습관_학생용교재_1-6마당_부크크A4.hwpx'
TITLE = '체스 학습관'
SUB = '1~6마당 학생용 교재'
AUTHOR = '홍지희'
NS = '{http://www.hancom.co.kr/hwpml/2011/paragraph}'


def load_template():
    warnings.simplefilter('ignore')
    from hwpx.hwp5.package import convert
    c = convert(open(TEMPLATE, 'rb').read())
    return c.files['Contents/header.xml'].decode('utf-8'), c.files['Contents/section0.xml'].decode('utf-8')


THEAD, TSEC = load_template()
PG = re.search(r'<hp:pagePr [^>]*>', TSEC).group(0)
MG = re.search(r'<hp:margin [^>]*/>', TSEC).group(0)
g = {k: int(v) for k, v in re.findall(r'(\w+)="(\d+)"', MG)}
B.PAGE_W, B.PAGE_H = int(re.search(r'width="(\d+)"', PG).group(1)), int(re.search(r'height="(\d+)"', PG).group(1))
B.TW = B.PAGE_W - g['left'] - g['right'] - g['gutter']
B.BODY_MM = (B.PAGE_H - g['top'] - g['bottom'] - g['header'] - g['footer']) / MM
B.BUDGET = B.BODY_MM * 0.94
H.TEXT_W = B.TW


def cnt(tag):
    return int(re.search(r'<hh:%s itemCnt="(\d+)"' % tag, THEAD).group(1))


B.CP0, B.PP0, B.TAB0 = cnt('charProperties'), cnt('paraProperties'), cnt('tabProperties')
B.BF0 = cnt('borderFills') + 1
FACES = re.findall(r'face="([^"]+)"', re.search(r'<hh:fontface lang="HANGUL".*?</hh:fontface>', THEAD, re.S).group(0))
B.FONT_N, B.FONT_B = FACES.index('부크크 고딕 Light'), FACES.index('부크크 고딕 Bold')
B.PIC_GRID, B.PIC_SAY, B.PIC_EX = 44, 46, 44
B.ANS_COLS, B.ANS_PIC = 2, 24
TW = B.TW


def tparas():
    """틀 본문의 문단(맨 위 차례대로) — xml 조각과 글"""
    out = []
    for m in re.finditer(r'<hp:p [^>]*>.*?</hp:p>(?=<hp:p |</hs:sec>)', TSEC, re.S):
        x = m.group(0)
        t = ''.join(re.findall(r'<hp:t>([^<]*)</hp:t>', x))
        out.append((x, t))
    return out


TP = tparas()


class BookkDoc(B.Doc):
    def __init__(self, *a, **kw):
        super().__init__(*a, **kw)
        self.feet = {}      # 쪽 번호(0부터) → 꼬리말 ctrl xml

    def put(self, xml):
        """틀에서 옮긴 앞부분 쪽: 높이 어림 없이 지금 쪽에 그대로(틀이 한 쪽에 맞게 짜여 있음)"""
        self.pages[-1].append((xml, 0))

    def foot(self, odd_text, even=True):
        """지금 쪽부터 꼬리말: 홀수 쪽 '장 이름    번호', (even이면) 짝수 쪽 '번호    책 이름'"""
        num = ('<hp:ctrl><hp:autoNum num="1" numType="PAGE"><hp:autoNumFormat type="DIGIT" userChar="" prefixChar="" '
               'suffixChar="" supscript="0"/></hp:autoNum></hp:ctrl>')

        def ft(kind, inner, pp):
            p = ('<hp:p id="%d" paraPrIDRef="%d" styleIDRef="10" pageBreak="0" columnBreak="0" merged="0">%s</hp:p>' % (self._id(), pp, inner))
            return ('<hp:ctrl><hp:footer id="%d" applyPageType="%s"><hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="BOTTOM" '
                    'linkListIDRef="0" linkListNextIDRef="0" textWidth="%d" textHeight="%d" hasTextRef="0" hasNumRef="0">%s</hp:subList></hp:footer></hp:ctrl>'
                    % (self._id(), kind, TW, g['footer'], p))
        x = ''
        if even:
            x += ft('EVEN', '<hp:run charPrIDRef="26">%s<hp:t>    %s</hp:t></hp:run>' % (num, getattr(self, 'book', TITLE)), 1)
        x += ft('ODD', '<hp:run charPrIDRef="1"><hp:t>%s    </hp:t>%s<hp:t/></hp:run>' % (odd_text, num), self.S.P['R'])
        self.feet[len(self.pages) - 1] = '<hp:run charPrIDRef="9">' + x + '</hp:run>'

    def build_body(self):
        super().build_body()
        # 꼬리말을 그 쪽 첫 문단에 넣기(쪽 나눔은 이미 들어감)
        j = 0
        for i, pg in enumerate(self.pages):
            if not pg:
                continue
            if i in self.feet:
                first = self.body[j]
                m = re.match(r'<hp:p [^>]*>', first)
                self.body[j] = first[:m.end()] + self.feet[i] + first[m.end():]
            j += len(pg)

    def section_xml(self):
        head = H._read('section0_head.xml')
        head = re.sub(r'<hp:pagePr [^>]*>', PG, head)
        head = re.sub(r'<hp:margin [^>]*/>', MG, head)
        head = re.sub(r'<hp:linesegarray>.*?</hp:linesegarray>', '', head)
        return head.replace('</hs:sec>', ''.join(self.body) + '</hs:sec>')

    def header_xml(self):
        h = THEAD.replace('breakNonLatinWord="KEEP_WORD"', 'breakNonLatinWord="BREAK_WORD"')  # 한글은 반대: BREAK_WORD가 낱말을 안 끊음
        if self.bins:
            items = ''.join('<hh:binItem id="%d" Type="Embedding" BinData="%s.png" Format="png"/>' % (i, b) for i, (b, _) in enumerate(self.bins))
            h = h.replace('</hh:styles>', '</hh:styles><hh:binDataList itemCnt="%d">%s</hh:binDataList>' % (len(self.bins), items), 1)
        return self.S.header_xml(h)


def retext(x, new):
    """틀 문단 xml의 글을 바꿈(첫 글 칸에 새 글, 나머지 글 칸은 비움), 줄 정보는 빼고 문단 id는 새로"""
    x = re.sub(r'<hp:linesegarray>.*?</hp:linesegarray>', '', x)
    done = [False]

    def rep(m):
        if done[0]:
            return '<hp:t/>'
        done[0] = True
        from xml.sax.saxutils import escape
        return '<hp:t>%s</hp:t>' % escape(new)
    if new is not None:
        x = re.sub(r'<hp:t>[^<]*</hp:t>|<hp:t/>', rep, x)
        if not done[0]:
            x = re.sub(r'(<hp:run charPrIDRef="\d+")\s*/>', lambda m: m.group(1) + '><hp:t>%s</hp:t></hp:run>' % new, x, 1)
    return x


def tp(i, new=None, d=None):
    x = retext(TP[i][0], new)
    x = re.sub(r'<hp:p id="\d+"', '<hp:p id="%d"' % d._id(), x, 1)
    return re.sub(r'pageBreak="1"', 'pageBreak="0"', x, 1)


def find(t, exact=False):
    return next(i for i, (_, s) in enumerate(TP) if (s.strip() == t if exact else s.strip().startswith(t)))


def front(d, full, toc, pg):
    """틀의 앞 4쪽: 반표제 → 판권 → 속표지 → CONTENT(toc = [(글, 쪽 이름, 수준 0·1)])"""
    # ---- 반표제(1쪽) — 틀 문단 15~19
    i0 = find('어린 왕자(제목')
    for i in range(i0 - 3, i0):
        d.put(tp(i, None, d))
    d.put(tp(i0, full, d))
    # ---- 판권(2쪽) — 틀 문단 20~58
    d.new_page()
    a = find('어린 왕자(제목') + 1
    while TP[a][1].strip() == '':
        d.put(tp(a, None, d))
        a += 1
    rep = {'어린 왕자(제목': full, '발  행': '발  행｜2026년 00월 00일', '저  자': '저  자｜%s' % AUTHOR, 'ⓒ': 'ⓒ %s 2026' % AUTHOR}
    sok = find('어', exact=True)
    while a < sok - 1:
        t = TP[a][1]
        new = next((v for kk, v in rep.items() if t.strip().startswith(kk)), None)
        d.put(tp(a, new, d))
        a += 1
    # ---- 속표지(3쪽): 세로 제목 — 틀의 '어/린/왕/자' 문단 꼴
    d.new_page()
    d.put(tp(sok - 1, None, d))
    for ch in TITLE.replace(' ', ''):
        d.put(tp(sok, ch, d))
    d.put(tp(find('생텍쥐 페리 지음'), '%s 지음' % AUTHOR, d))
    # ---- CONTENT(4쪽~)
    d.new_page()
    c0 = find('CONTENT')
    d.add(tp(c0, 'CONTENT', d), 12)
    d.add(tp(c0 + 1, None, d), 6)
    i1, i2 = find('제1화'), find('제2화')
    for t, key, lv in toc:
        d.add(tp(i2 if lv else i1, '%s  %d' % (t, pg.get(key, 0)), d), 7.8)  # 한글에서 잰 줄 간격 약 7.4mm


def build(Ds, P, Ms, sts, plan=None):
    pg = plan or {}
    st0 = sts[1]
    d = BookkDoc('%s %s' % (TITLE, SUB), st0, '', '')
    k0 = B.Kit(Ds[1], P, Ms[1].G, st0)
    toc = [('머리말', 'pre', 0), ('이 책을 쓰는 방법', 'how', 0), ('이 책의 짜임', 'struct', 0)]
    for no in range(1, 7):
        D = Ds[no]
        toc.append(('%d마당   %s' % (no, D['title']), 'm%d:open' % no, 0))
        for ui, U in enumerate(D['units']):
            toc.append(('        %d단원  %s' % (ui + 1, U['title']), 'm%d:u%d' % (no, ui), 1))
        toc.append(('        %d마당 확인 평가' % no, 'm%d:exam' % no, 1))
    toc += [('정답과 풀이', 'ans', 0), ('용어 풀이', 'terms', 0)]
    front(d, '%s — %s' % (TITLE, SUB), toc, pg)
    # ---- 머리말
    d.new_page()
    d.foot('머리말')
    d.marks['pre'] = len(d.pages)
    d.add(d.P('머리말', 'pt', 'L'), 14)
    k0.gap(d, 'gap2')
    for t in PREFACE:
        k0.para(d, t)
        k0.gap(d)
    d.add(d.P('초등교사 홍지희', 'bodyb', 'R'), 8)
    # ---- 이 책을 쓰는 방법
    d.new_page()
    d.foot('이 책을 쓰는 방법', even=False)
    d.marks['how'] = len(d.pages)
    d.add(d.P('이 책을 쓰는 방법', 'pt', 'L'), 14)
    k0.gap(d, 'gap2')
    for t in ['이 책은 「체스 학습관」 1~6마당(모두 175차시)을 종이로 공부하는 책이에요. 학습관의 마당·차시 번호와 이 책의 마당·차시 번호는 같아요.',
              '1마당 1차시부터 차례대로 공부해요. 차시마다 ‘배워요 → 예시로 보기 → 풀어 봐요 → 정리해요’ 차례예요.',
              '판 그림에 직접 ○표를 하거나 화살표를 그려요. 연필로 그리면 지우고 다시 풀 수 있어요.',
              '모르는 문제는 학습관에서 같은 차시를 열어 힌트를 받아 보세요. 정답과 풀이는 책 뒤쪽에 있어요.',
              '실제 체스판과 말이 있으면 책의 그림을 그대로 놓아 보고 움직여 보세요. 훨씬 잘 기억나요.',
              '단원이 끝나면 ‘단원 마무리’, 마당이 끝나면 ‘마당 확인 평가’로 스스로 확인해요.',
              '모르는 낱말은 책 맨 뒤 ‘용어 풀이’에서 찾아요.']:
        k0.bullet(d, t)
    k0.gap(d, 'gap2')
    k0.callout(d, '학습관 주소', [B.SITE, '(예: 2마당 5차시는 ' + B.SITE + 'm2.html#l5)'], ch='small')
    k0.gap(d, 'gap2')
    d.add(d.P('판 그림 읽는 법', 'h2', 'L'), 10)
    for t in ['판의 아래쪽이 백(흰 말), 위쪽이 흑(검은 말)이에요. 판 둘레의 a~h, 1~8로 칸 이름을 읽어요.',
              '노란 칸은 ‘이 말을 보세요’, 초록 점은 ‘갈 수 있는 칸’, 빨간 칸이나 ✕는 ‘안 되는 칸’이라는 뜻이에요.',
              '★ 별이 있는 문제는 말을 움직여 별을 모으는 문제예요. 별 칸에 멈춰야 별을 모아요.',
              '화살표는 말이 움직이는 길이에요. 내가 둘 수는 판에 연필로 화살표를 그려요.']:
        k0.bullet(d, t)
    # ---- 이 책의 짜임
    d.new_page()
    d.foot('이 책의 짜임', even=False)
    d.marks['struct'] = len(d.pages)
    d.add(d.P('이 책의 짜임', 'pt', 'L'), 14)
    k0.gap(d, 'gap2')
    for a_, b_ in [('마당 여는 쪽', '마당마다 배울 단원과, 마치면 받는 등급을 알려 줘요.'),
                   ('단원 여는 쪽', '단원에서 배울 차시와 단원 이야기를 미리 봐요.'),
                   ('배워요', '오늘 배울 것을 글과 판 그림으로 차근차근 알아봐요.'),
                   ('예시로 보기', '판 위에서 말이 움직이는 장면을 차례로 보며 배운 것을 확인해요.'),
                   ('풀어 봐요', '배운 것을 문제로 풀어요. 앞의 문제는 따라 하기, 뒤의 문제는 혼자 하기예요.'),
                   ('학습관 대결', '인공지능과 겨루는 활동은 학습관(컴퓨터·태블릿)에서 해요.'),
                   ('정리해요 · 생각 톡톡', '꼭 기억할 것을 정리하고, 생각을 넓히는 질문에 답을 써요.'),
                   ('단원 마무리', '단원에서 배운 것을 섞어 풀며 스스로 확인해요.'),
                   ('마당 확인 평가', '마당 전체를 돌아보는 문제예요. 다 맞히면 학습관 확인 시험에 도전해요!'),
                   ('정답과 풀이 · 용어 풀이', '책 뒤에 있어요. 틀린 문제는 왜 틀렸는지 꼭 다시 봐요.')]:
        x = d.tbl([[(d.P(a_, 'acc', 'CT'), st0.F['tint'], 1, 'CENTER', (300, 300, 500, 500)),
                    (d.P(b_, 'body', 'LT'), st0.F['box'], 1, 'CENTER', (800, 500, 500, 500))]], [mm(44), TW - mm(44)])
        d.add(x, 15)
    # ---- 마당마다
    keys = {}
    for no in range(1, 7):
        D, M, st = Ds[no], Ms[no], sts[no]
        d.S = st
        k = B.Kit(D, P, M.G, st)
        d.to_odd(lambda: k.filler(d))
        d.hide.add(len(d.pages) - 1)
        d.foot('%d마당 · %s' % (no, D['title']), even=False)
        d.marks['m%d:open' % no] = len(d.pages)
        x = d.tbl([[(d.P('체스 학습관', 'c0', 'LT') + d.P('%d마당' % no, 'c1', 'LT') + d.P(D['title'], 'c2', 'LT'),
                     st.F['acc'], 1, 'CENTER', (2500, 1500, 4000, 4000))]], [TW])
        d.add(x, 80)
        d.add(d.P(' ', 'gap2'), 8)
        d.add(d.P('이 마당에서 배울 것', 'h2', 'L'), 10)
        for ui, U in enumerate(D['units']):
            n = len(U['lessons'])
            a0 = U['lessons'][0]['no']
            x = d.tbl([[(d.P('%d단원' % (ui + 1), 'accS', 'CT'), st.F['tint'], 1, 'CENTER', (200, 200, 250, 250)),
                        (d.P(U['title'], 'bodyb', 'LT'), st.F['box'], 1, 'CENTER', (600, 300, 250, 250)),
                        (d.P('%d~%d차시' % (a0, a0 + n - 1), 'small', 'CT'), st.F['box'], 1, 'CENTER', (100, 100, 250, 250))]],
                      [mm(22), TW - mm(52), mm(30)])
            d.add(x, 9.6)
        d.add(d.P(' ', 'gap2'), 6)
        k.callout(d, '마당을 마치면', ['%d마당 확인 평가를 풀고, 학습관의 확인 시험(15문제 중 12문제)을 통과하면 ‘%s’ 등급을 받아요.' % (no, B.RANK[no])])
        # 마당 머리말
        d.new_page()
        d.add(d.P('%d마당을 시작하며' % no, 'pt', 'L'), 14)
        k.gap(d, 'gap2')
        for t in M.PREFACE:
            k.para(d, B.clean(t))
            k.gap(d)
        keys[no] = B.part(d, k, D, M.G, M, P, st, mk=lambda s, no=no: 'm%d:%s' % (no, s))
    # ---- 정답과 풀이
    d.S = st0
    d.to_odd(lambda: k0.filler(d))
    d.foot('정답과 풀이', even=False)
    d.marks['ans'] = len(d.pages)
    d.add(d.P('정답과 풀이', 'pt', 'L'), 14)
    for no in range(1, 7):
        D, st = Ds[no], sts[no]
        d.S = st
        k = B.Kit(D, P, Ms[no].G, st)
        k.gap(d)
        d.add(d.tbl([[(d.P('%d마당  %s' % (no, D['title']), 'ban', 'LT'), st.F['acc'], 1, 'CENTER', (900, 600, 300, 300))]], [TW]), 11, keep=True)
        B.answers(d, k, D, keys[no], st, P)
    # ---- 용어 풀이
    d.S = st0
    d.new_page()
    d.foot('용어 풀이', even=False)
    d.marks['terms'] = len(d.pages)
    d.add(d.P('용어 풀이', 'pt', 'L'), 14)
    d.add(d.P('가나다 차례예요. ‘배우는 곳’에서 처음 자세히 배워요.', 'small', 'L'), 7)
    k0.gap(d)
    ws = [mm(32), TW - mm(32 + 32), mm(32)]
    d.add(d.tbl([[(d.P(v, 'accS', 'CT'), st0.F['tint'], 1, 'CENTER', None) for v in ['용어', '뜻', '배우는 곳']]], ws, st0.F['box']), 9)
    seen, rows = set(), []
    for no in range(1, 7):
        lno = {L['id']: L['no'] for U in Ds[no]['units'] for L in U['lessons']}
        for term, mean, lid in Ms[no].TERMS:
            if term in seen:
                continue
            seen.add(term)
            rows.append((term, mean, no, lno.get(lid, 0)))
    for term, mean, no, n in sorted(rows):
        r = [[(d.P(term, 'bodyb', 'CT'), st0.F['box'], 1, 'CENTER', None), (d.P(B.clean(mean), 'q', 'LT'), st0.F['box'], 1, 'CENTER', (700, 400, 250, 250)),
              (d.P('%d마당 %d차시\n(%d쪽)' % (no, n, pg.get('m%d:l%d' % (no, n), 0)), 'small', 'CT'), st0.F['box'], 1, 'CENTER', None)]]
        d.add(d.tbl(r, ws, st0.F['box']), max(B.text_h(mean, st0.C['q'], ws[1] / MM - 4, 135) + 4, 13))
    return d


GUIDE_NAME = '체스학습관_지도서_1-6마당_부크크A4.hwpx'
GUIDE3_NAME = '체스학습관_지도서_%d권_%d-%d마당_부크크A4.hwpx'
TPREFACE = [
    '이 지도서는 「체스 학습관」 1~6마당(175차시)과 학생용 교재를 함께 쓰시는 선생님을 위한 책입니다. 학년 구분 없이 모든 학생이 1마당 1차시부터 차례대로 배우도록 짜여 있으며, 마당을 마칠 때마다 확인 시험으로 폰 → 나이트 → 비숍 → 룩 → 퀸 → 킹 등급을 받습니다.',
    '마당마다 처음에 그 마당 지도의 큰 줄기와 차시 한눈에 보기(학생용 교재 쪽수)를 두었고, 차시마다 지도 흐름(설명·예시·따라 하기와 힌트), 교재 문제 정답, 아이들이 자주 하는 실수, 지도 도움말, 생각을 여는 질문(발문)을 실었습니다. 첫 번째 발문은 학생용 교재의 ‘생각 톡톡’에도 실려 있습니다.',
    '교실에서는 전자칠판으로 학습관의 설명과 예시를 함께 보고, 학생용 교재의 ‘풀어 봐요’를 풀린 뒤 개인 기기로 연습하게 하면 좋습니다. 실물 체스판이 있으면 처음 배치와 기본 메이트는 꼭 판 위에서 직접 해 보게 해 주세요.',
]


def build_guide(Ds, P, Ms, sts, plan=None, SP=None, vol=None, prev=None):
    """지도서 한 권: 앞 4쪽 → 선생님께 → 학습관과 교재 → 마당마다(여는 쪽·지도의 줄기·차시 한눈에 보기·단원·차시) → 용어 풀이. SP = 학생용 교재 쪽 표시
    vol = (권, 첫 마당, 끝 마당)이면 그 두 마당만 담은 권(2026-10-21 세 권으로 나눔), prev = {앞 권: 그 지도서 쪽 표시}"""
    pg, SP = plan or {}, SP or {}
    v, a, b = vol or (0, 1, 6)
    nos = range(a, b + 1)
    rng = '%d~%d마당' % (a, b)
    st0 = sts[a]
    d = BookkDoc('%s %s지도서' % (TITLE, '%d권 · %s ' % (v, rng) if v else '1~6마당 '), st0, '', '')
    if v:
        d.book = '%s 지도서 %d권' % (TITLE, v)
    k0 = B.Kit(Ds[a], P, Ms[a].G, st0)
    toc = [('선생님께', 'pre', 0), ('학습관과 교재', 'intro', 0)]
    for no in nos:
        D = Ds[no]
        toc.append(('%d마당   %s' % (no, D['title']), 'm%d:open' % no, 0))
        for ui, U in enumerate(D['units']):
            toc.append(('        %d단원  %s' % (ui + 1, U['title']), 'm%d:u%d' % (no, ui), 1))
        toc.append(('        확인 시험과 수료증', 'm%d:exam' % no, 1))
    toc.append(('용어 풀이', 'terms', 0))
    front(d, '%s %s지도서' % (TITLE, '%d권 — %s ' % (v, rng) if v else '— 1~6마당 '), toc, pg)
    d.new_page()
    d.foot('선생님께')
    d.marks['pre'] = len(d.pages)
    d.add(d.P('선생님께', 'pt', 'L'), 14)
    k0.gap(d, 'gap2')
    for t in TPREFACE:
        k0.para(d, t)
        k0.gap(d)
    if v:
        k0.para(d, '학생용 교재는 마당마다 한 권씩 여섯 권(1권 = 1마당 … 6권 = 6마당), 지도서는 두 마당씩 세 권입니다. 이 책은 지도서 %d권으로 %d마당과 %d마당(학생용 %d·%d권)을 담았고, 학생용 교재 쪽수는 ‘%s쪽’(%d마당 1차시)처럼 권과 쪽을 함께 적었습니다.' % (v, a, b, a, b, SP.get('m%d:l1' % a, '%d권 ?' % a), a))
        k0.gap(d)
    d.add(d.P('초등교사 홍지희', 'bodyb', 'R'), 8)
    d.new_page()
    d.foot('학습관과 교재', even=False)
    d.marks['intro'] = len(d.pages)
    B.intro_page(d, k0, st0)
    for no in nos:
        D, M, st = Ds[no], Ms[no], sts[no]
        d.S = st
        k = B.Kit(D, P, M.G, st, teacher=True)
        sp = (lambda x, no=no: SP.get('m%d:%s' % (no, x), 0))
        d.new_page(hide=True)      # 지도서는 빈 쪽을 두지 않음(마당 여는 쪽이 짝수 쪽이어도 됨)
        d.foot('%d마당 · %s' % (no, D['title']), even=False)
        d.marks['m%d:open' % no] = len(d.pages)
        x = d.tbl([[(d.P('체스 학습관 지도서', 'c0', 'LT') + d.P('%d마당' % no, 'c1', 'LT') + d.P(D['title'], 'c2', 'LT'),
                     st.F['acc'], 1, 'CENTER', (2500, 1500, 4000, 4000))]], [TW])
        d.add(x, 80)
        d.add(d.P(' ', 'gap2'), 8)
        d.add(d.P('%d마당 지도의 줄기' % no, 'h2', 'L'), 10)
        for t in M.TPREFACE:
            k.para(d, B.clean(t))
            k.gap(d)
        # 차시 한눈에 보기
        d.new_page()
        d.add(d.P('%d마당 차시 한눈에 보기' % no, 'pt', 'L'), 14)
        k.gap(d)
        ws = [mm(13), mm(30), TW - mm(13 + 30 + 22 + 22), mm(22), mm(22)]
        d.add(d.tbl([[(d.P(v, 'accS', 'CT'), st.F['boxT'], 1, 'CENTER', None) for v in ['차시', '단원', '제목', '문제 종류', '학생용 교재']]], ws), 8.5)
        for U in D['units']:
            for L in U['lessons']:
                r = ['%d' % L['no'], U['title'], L['title'], B.KIND[L['kind']][0], '%s쪽' % sp('l%d' % L['no'])]
                d.add(d.tbl([[(d.P(v, 'q', 'CT' if j != 2 else 'LT'), st.F['box'], 1, 'CENTER', None) for j, v in enumerate(r)]], ws),
                      max(7.6, B.text_h(L['title'], st.C['q'], ws[2] / MM - 3, 135) + 2))
        B.tpart(d, k, D, M.G, M, P, st, mk=lambda x, no=no: 'm%d:%s' % (no, x), sp=sp)
    d.S = st0
    d.new_page()
    d.foot('용어 풀이', even=False)
    d.marks['terms'] = len(d.pages)
    d.add(d.P('용어 풀이', 'pt', 'L'), 14)
    k0.gap(d)
    ws = [mm(32), TW - mm(32 + 32), mm(32)]
    d.add(d.tbl([[(d.P(v, 'accS', 'CT'), st0.F['tint'], 1, 'CENTER', None) for v in ['용어', '뜻', '배우는 곳']]], ws, st0.F['box']), 9)
    seen, rows = set(), []
    for no in range(1, b + 1):
        lno = {L['id']: L['no'] for U in Ds[no]['units'] for L in U['lessons']}
        for term, mean, lid in Ms[no].TERMS:
            if term not in seen:
                seen.add(term)
                rows.append((term, mean, no, lno.get(lid, 0)))
    for term, mean, no, n in sorted(rows):
        r = [[(d.P(term, 'bodyb', 'CT'), st0.F['box'], 1, 'CENTER', None), (d.P(B.clean(mean), 'q', 'LT'), st0.F['box'], 1, 'CENTER', (700, 400, 250, 250)),
              (d.P('%d마당 %d차시\n(지도서 %s쪽)' % (no, n, ('%d' % pg.get('m%d:l%d' % (no, n), 0)) if no >= a else
                                                     '%d권 %d' % ((no + 1) // 2, prev[(no + 1) // 2].get('m%d:l%d' % (no, n), 0))), 'small', 'CT'), st0.F['box'], 1, 'CENTER', None)]]
        d.add(d.tbl(r, ws, st0.F['box']), max(B.text_h(mean, st0.C['q'], ws[1] / MM - 4, 135) + 4, 13))
    return d


PREFACE = [
    '체스의 세계에 온 것을 환영해요! 이 책은 체스를 처음 만나는 친구가 체스판과 체스말부터 시작해, 말이 움직이는 법, 잡기와 지키기, 체크와 체크메이트, 전술, 그리고 한 판을 끝까지 두는 법까지 차근차근 배우도록 만든 책이에요.',
    '모두 여섯 마당, 175차시예요. 마당 하나를 마칠 때마다 폰 → 나이트 → 비숍 → 룩 → 퀸 → 킹 등급을 받아요. 1마당 1차시부터 차례대로, 하루에 한두 차시씩 천천히 공부해도 괜찮아요.',
    '차시마다 ‘배워요’에서 새로운 것을 알아보고, ‘예시로 보기’에서 판 위의 장면을 따라가 보고, ‘풀어 봐요’에서 직접 문제를 풀어요. 컴퓨터나 태블릿이 있다면 「체스 학습관」에서 같은 차시를 해 보세요. 판 위에서 직접 말을 움직이고, 힌트도 받을 수 있어요.',
    '틀려도 괜찮아요. 왜 틀렸는지 알아보는 것이 체스를 잘하게 되는 가장 빠른 길이에요. 친구와, 가족과 체스를 두며 이 책에서 배운 것을 마음껏 써 보세요.',
]


def main(mode='student'):
    Ds, Ms, sts = {}, {}, {}
    reg = None
    for no in range(1, 7):
        mid = 'm%d' % no
        exp = subprocess.run(['node', os.path.join(HERE, 'export.js'), mid, '5', '2'], capture_output=True, text=True)
        if exp.returncode:
            sys.exit('자료 뽑기 실패 %s\n%s' % (mid, exp.stderr[-2000:]))
        Ds[no] = json.loads(exp.stdout)
        Ms[no] = importlib.import_module('guide_' + mid)
    P = B.Pics()

    def styles():
        out, reg = {}, None
        for no in range(1, 7):
            out[no] = B.Style(*B.ACC[no], reg=reg)
            reg = reg or out[no]
        return out
    if mode == 'guide3':     # 지도서 세 권(학생용 세 권의 쪽: split.py가 남긴 student_marks_N.json)
        prev = {}
        for v, a, b in [(1, 1, 2), (2, 3, 4), (3, 5, 6)]:
            SP = {}     # 학생용은 마당마다 한 권: '2권 38'처럼 권과 쪽
            for no in (a, b):
                mk = json.load(open(os.path.join(HERE, 'student_marks_m%d.json' % no)))
                SP.update({k: '%d권 %d' % (no, x) for k, x in mk.items() if k.startswith('m%d:' % no)})
            kw = dict(SP=SP, vol=(v, a, b), prev=prev)
            d = build_guide(Ds, P, Ms, styles(), None, **kw)
            P.shoot()
            d = build_guide(Ds, P, Ms, styles(), d.marks, **kw)
            d2 = build_guide(Ds, P, Ms, styles(), d.marks, **kw)
            assert d2.marks == d.marks, '쪽 번호가 흔들려요'
            prev[v] = d2.marks
            d2.build_body()
            name = GUIDE3_NAME % (v, a, b)
            p = os.path.join(B.OUT, name)
            d2.save(p, now=B.STAMP)
            bad = H.check(p)
            if bad:
                sys.exit('점검 실패: %s' % bad[:5])
            print('만듦:', name, '%d쪽' % len(d2.pages), '%.1fMB' % (os.path.getsize(p) / 1e6))
        return
    if mode == 'guide':
        import fix_pages
        mp = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'student_marks.json')   # finalize.py가 계산한 학생용 쪽(줄 정보가 없는 파일일 때)
        SP = json.load(open(mp)) if os.path.exists(mp) else fix_pages.marks(os.path.join(B.OUT, OUTNAME))
        d = build_guide(Ds, P, Ms, styles(), None, SP)
        P.shoot()
        d = build_guide(Ds, P, Ms, styles(), d.marks, SP)
        d2 = build_guide(Ds, P, Ms, styles(), d.marks, SP)
        name = GUIDE_NAME
    else:
        d = build(Ds, P, Ms, styles())
        P.shoot()
        d = build(Ds, P, Ms, styles(), d.marks)
        d2 = build(Ds, P, Ms, styles(), d.marks)
        name = OUTNAME
    assert d2.marks == d.marks, '쪽 번호가 흔들려요'
    print('한 권 %d쪽 (본문 %.0fmm × %.0fmm)' % (len(d2.pages), TW / MM, B.BODY_MM))
    if mode == 'check':
        return
    if mode == 'student':
        sys.exit('학생용 한 권은 선생님이 한글에서 직접 고치는 파일이라 다시 만들지 않아요(덮어쓰려면 student-force).')
    d2.build_body()
    p = os.path.join(B.OUT, name)
    d2.save(p, now=B.STAMP)
    bad = H.check(p)
    if bad:
        sys.exit('점검 실패: %s' % bad[:5])
    print('만듦:', name, '%.1fMB' % (os.path.getsize(p) / 1e6))

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'student')
