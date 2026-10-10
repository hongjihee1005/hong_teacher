# -*- coding: utf-8 -*-
"""4학년 수학 활동지(HWPX, 한글 문서) 만들기 도구

3학년 수학 활동지(grade3/math/sem1/sheets/*_활동지_기본형.hwpx)와 **똑같은 모양**이 나오도록,
그 파일의 header.xml(글자 모양·문단 모양·테두리 번호)을 그대로 쓰고(base/), 본문 XML 조각도
3학년 section0.xml에서 그대로 옮겨 글자·크기만 바꿉니다. 그래서 글꼴(함초롬돋움)·크기·표 테두리·
회색 칸이 3학년 활동지와 같습니다.

쓰는 법
-------
    from hwpxgen import Sheet, svg_to_png

    s = Sheet(unit_label="4-1 수학 2. 각도(교과서 차시)", level="기본형")   # 기본형 | 도전형
    s.lesson(no=3, soop="개념 구축하기(O)", title="각의 크기를 재어 볼까요",
             question="각도기로 각의 크기를 어떻게 잴까요?")                # grade_label 기본 '4학년'
    s.scene("scene.png", "민서는 부채를 펴면서 …")    # 그림·이야기 한 줄(둘 다 없어도 됨)
    s.step("① 만져 보기", "각도기 살펴보기")          # '① 만져 보기  |  각도기 살펴보기'
    s.picture("fig.png", width_mm=120)               # PNG, 가로·세로 비율 유지, 가운데
    s.text("각도기의 중심을 각의 꼭짓점에 맞춰요.")    # 설명·이야기 글(13pt)
    s.ask("각의 크기는 몇 도인가요?")                  # 질문 + '   답: (        )' (14pt)
    s.ask("까닭을 써 보세요.", blank=False)            # 질문만
    s.choices([("각의 크기를 나타내는 단위는?", "( 도 / cm )")])   # 2칸 고르기 표
    s.labeled([("보기", "그림에서 나는 ____ 이 보여요."), ...])     # 왼쪽 회색 이름 칸 표
    s.wordbox(["각도", "1도", "직각"])                # '낱말 상자:  각도   ·   1도   ·   직각'
    s.fill("직각을 똑같이 90으로 나눈 하나를 (      )라고 합니다.")  # 테두리 문장(여러 개면 목록)
    s.table([["", "삼각형", "사각형"], ["각의 합", "(   )°", "(   )°"]])  # 첫 줄 회색
    s.lines(3)                                        # 쓰는 줄 3개
    s.page_break()                                    # 한 차시가 두 쪽일 때
    s.answers("【교사용】 2. 각도(교과서 차시) 활동지 정답 (기본형)", ["3차시  ① 60°  …"],
              note="※ 이 활동지는 앱 …과 차시 번호가 같습니다.")
    s.save("2단원_각도_활동지_기본형.hwpx")           # 문서 제목 = 파일 이름, 만든 이 '초등교사 홍지희'

  - lesson()을 다시 부르면 앞에 쪽 나눔이 저절로 들어가 차시마다 새 쪽에서 시작합니다.
  - 표 칸 글에 '\\n'을 넣으면 칸 안에서 줄이 나뉩니다.
  - 길이 단위: 그림 너비는 mm(본문 너비 180mm가 최대). 한글 단위 1mm = 283.465.

그림 만들기: svg_to_png(svg_문자열, "out.png", width_px=1600)
  Playwright Chromium(/opt/pw-browsers/chromium)으로 SVG를 PNG로 찍습니다(흰 배경).
  글꼴은 font-family에 'Noto Sans KR','WenQuanYi Zen Hei',sans-serif 처럼 적으세요(이 환경에 한글 글꼴은 WenQuanYi).

점검: python3 hwpxgen.py check 파일.hwpx  — zip 구조·XML·id 겹침·그림 목록·python-hwpx 열기/validate·글 뽑기.
본보기: python3 hwpxgen.py demo 출력.hwpx  — 두 차시짜리 본보기 활동지.
"""
import datetime
import io
import json
import os
import random
import re
import shutil
import struct
import subprocess
import sys
import tempfile
import zipfile
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
BASE = os.path.join(HERE, 'base')
MM = 283.465                 # HWPUNIT per mm
TEXT_W = 51024               # 본문 너비(180mm) = 3학년 표 너비

# ---------------------------------------------------------------- 3학년 파일에서 옮긴 조각
P_OPEN = '<hp:p id="{id}" paraPrIDRef="{pp}" styleIDRef="0" pageBreak="{pb}" columnBreak="0" merged="0">'
SUBLIST = ('<hp:subList id="" textDirection="HORIZONTAL" lineWrap="BREAK" vertAlign="CENTER" '
           'linkListIDRef="0" linkListNextIDRef="0" textWidth="0" textHeight="0" hasTextRef="0" hasNumRef="0">')
TBL_OPEN = ('<hp:tbl id="{id}" zOrder="0" numberingType="TABLE" textWrap="TOP_AND_BOTTOM" textFlow="BOTH_SIDES" '
            'lock="0" dropcapstyle="None" pageBreak="CELL" repeatHeader="0" rowCnt="{rows}" colCnt="{cols}" '
            'cellSpacing="0" borderFillIDRef="{bf}" noAdjust="0">'
            '<hp:sz width="{w}" widthRelTo="ABSOLUTE" height="{h}" heightRelTo="ABSOLUTE" protect="0"/>'
            '<hp:pos treatAsChar="1" affectLSpacing="0" flowWithText="1" allowOverlap="0" holdAnchorAndSO="0" '
            'vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" vertOffset="0" horzOffset="0"/>'
            '<hp:outMargin left="0" right="0" top="0" bottom="0"/>'
            '<hp:inMargin left="510" right="510" top="141" bottom="141"/>')
TC = ('<hp:tc name="" header="0" hasMargin="0" protect="0" editable="0" dirty="0" borderFillIDRef="{bf}">'
      + SUBLIST + '{paras}</hp:subList><hp:cellAddr colAddr="{c}" rowAddr="{r}"/>'
      '<hp:cellSpan colSpan="{cs}" rowSpan="1"/><hp:cellSz width="{w}" height="{h}"/>'
      '<hp:cellMargin left="510" right="510" top="141" bottom="141"/></hp:tc>')
PIC = ('<hp:pic textWrap="SQUARE" textFlow="BOTH_SIDES" reverse="0" id="{id}" zOrder="0" numberingType="PICTURE" '
       'lock="0" dropcapstyle="None" href="" groupLevel="0" instid="{id}"><hp:offset x="0" y="0"/>'
       '<hp:orgSz width="{w}" height="{h}"/><hp:curSz width="{w}" height="{h}"/><hp:flip horizontal="0" vertical="0"/>'
       '<hp:rotationInfo angle="0" centerX="{cx}" centerY="{cy}" rotateimage="1"/><hp:renderingInfo>'
       '<hc:transMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/><hc:scaMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/>'
       '<hc:rotMatrix e1="1" e2="0" e3="0" e4="0" e5="1" e6="0"/></hp:renderingInfo><hp:imgRect><hc:pt0 x="0" y="0"/>'
       '<hc:pt1 x="{w}" y="0"/><hc:pt2 x="{w}" y="{h}"/><hc:pt3 x="0" y="{h}"/></hp:imgRect>'
       '<hp:imgClip left="0" right="{w}" top="0" bottom="{h}"/><hp:inMargin left="0" right="0" top="0" bottom="0"/>'
       '<hp:imgDim dimwidth="{w}" dimheight="{h}"/><hc:img binaryItemIDRef="{bin}" bright="0" contrast="0" '
       'effect="REAL_PIC" alpha="0"/><hp:effects/><hp:sz width="{w}" height="{h}" widthRelTo="ABSOLUTE" '
       'heightRelTo="ABSOLUTE" protect="0"/><hp:pos treatAsChar="1" affectLSpacing="0" flowWithText="1" '
       'allowOverlap="0" holdAnchorAndSO="0" vertRelTo="PARA" horzRelTo="COLUMN" vertAlign="TOP" horzAlign="LEFT" '
       'vertOffset="0" horzOffset="0"/><hp:outMargin left="0" right="0" top="0" bottom="0"/><hp:shapeComment/></hp:pic>')

# 글자 모양(header.xml charPr) — 3학년 활동지에서 쓰는 뜻
CH_NONE, CH_PIC = 0, 1
CH_SMALL = 6          # 11pt  '3학년 ( )반', 교사용 끝 안내
CH_UNIT = 7           # 12pt 굵게  단원명 칸
CH_LESSON = 8         # 16pt 굵게  'N차시', 교사용 제목
CH_SOOP = 9           # 13pt 굵게
CH_LEVEL = 10         # 14pt 굵게
CH_TITLE = 11         # 19pt 굵게  차시 제목
CH_GAP4 = 12          # 4pt  빈 줄(머리 표 아래)
CH_TABLE = 13         # 15pt  탐구 질문, 표 글
CH_BODY = 14          # 13pt  이야기·설명·고르기 표
CH_GAP5 = 15          # 5pt  빈 줄(묶음 사이)
CH_STEP = 16          # 15pt 굵게  ① 단계 제목
CH_ASK = 17           # 14pt  질문·답 칸·낱말 상자
CH_BREAK = 18         # 6pt  쪽 나눔 줄
CH_KEY = 19           # 12pt  정답 줄
PP_LEFT, PP_CENTER = 0, 20
BF_TABLE, BF_HEAD, BF_GRAY = 3, 4, 5   # 0.12mm 테두리 / 0.4mm 머리 표 / 회색 칸


def _read(name):
    with open(os.path.join(BASE, name), encoding='utf-8') as f:
        return f.read()


def _png_size(path):
    with open(path, 'rb') as f:
        head = f.read(24)
    if head[:8] != b'\x89PNG\r\n\x1a\n':
        raise ValueError('PNG 파일만 넣을 수 있어요: ' + path)
    return struct.unpack('>II', head[16:24])


class Sheet:
    def __init__(self, unit_label, level='기본형', grade_label='4학년', seed=None):
        if level not in ('기본형', '도전형'):
            raise ValueError('level은 기본형 또는 도전형')
        self.unit_label, self.level, self.grade_label = unit_label, level, grade_label
        self.body = []          # 본문 문단 XML
        self.bins = []          # (bin id, png 바이트)
        self.text_log = []      # 미리보기 글
        self._ids = {0}
        self._rng = random.Random(seed if seed is not None else unit_label + level)
        self._lessons = 0
        self._after_scene = False

    # ------------------------------------------------------------ 바탕 조각
    def _id(self):
        while True:
            n = self._rng.randint(1000000, 2147483646)
            if n not in self._ids:
                self._ids.add(n)
                return n

    def _p(self, runs_xml, pp=PP_LEFT, pb=0):
        return P_OPEN.format(id=self._id(), pp=pp, pb=pb) + runs_xml + '</hp:p>'

    @staticmethod
    def _run(text, ch):
        if text:
            return '<hp:run charPrIDRef="%d"><hp:t>%s</hp:t></hp:run>' % (ch, escape(text))
        return '<hp:run charPrIDRef="%d"><hp:t/></hp:run>' % ch

    def _para(self, text, ch, pp=PP_LEFT, pb=0, log=True):
        if log and text:
            self.text_log.append(text)
        return self._p(self._run(text, ch), pp, pb)

    def _add(self, xml):
        self.body.append(xml)
        self._after_scene = False

    def _blank(self, ch=CH_GAP5):
        self._add(self._para('', ch))

    def _table(self, rows, widths, heights, outer_bf=BF_TABLE):
        """rows: [[(text_or_lines, bf, pp, ch, colspan), …], …]"""
        xml_rows = []
        for r, row in enumerate(rows):
            cells, c = [], 0
            for (text, bf, pp, ch, cs) in row:
                lines = text if isinstance(text, (list, tuple)) else str(text).split('\n')
                paras = ''.join(self._para(t, ch, pp) for t in lines)
                w = sum(widths[c:c + cs])
                cells.append(TC.format(bf=bf, paras=paras, c=c, r=r, cs=cs, w=w, h=heights[r]))
                c += cs
            xml_rows.append('<hp:tr>' + ''.join(cells) + '</hp:tr>')
        tbl = (TBL_OPEN.format(id=self._id(), rows=len(rows), cols=len(widths), bf=outer_bf,
                               w=sum(widths), h=sum(heights)) + ''.join(xml_rows) + '</hp:tbl>')
        runs = '<hp:run charPrIDRef="0">' + tbl + '</hp:run>' + self._run('', CH_NONE)
        self._add(self._p(runs, PP_CENTER))

    @staticmethod
    def _split(total, n, first=None):
        if first:
            rest = total - first
            ws = [first] + [rest // (n - 1)] * (n - 1)
        else:
            ws = [total // n] * n
        ws[-1] += total - sum(ws)
        return ws

    # ------------------------------------------------------------ 차시 머리
    def lesson(self, no, soop, title, question, grade_label=None):
        if self._lessons:
            self._add(self._para('', CH_BREAK, pb=1))
        self._lessons += 1
        g = grade_label or self.grade_label
        widths = [11339, 8504, 17575, 13606]
        rows = [
            [(self.unit_label, BF_HEAD, PP_CENTER, CH_UNIT, 1), ('%s차시' % no, BF_HEAD, PP_CENTER, CH_LESSON, 1),
             ('S.O.O.P. ' + soop, BF_HEAD, PP_CENTER, CH_SOOP, 1), (self.level, BF_HEAD, PP_CENTER, CH_LEVEL, 1)],
            [(title, BF_HEAD, PP_LEFT, CH_TITLE, 3),
             (['%s (   )반 (   )번' % g, '이름 (            )'], BF_HEAD, PP_LEFT, CH_SMALL, 1)],
        ]
        self._table(rows, widths, [3600, 3600], outer_bf=BF_HEAD)
        self._add(self._para('', CH_GAP4))
        self._table([[('탐구 질문  ' + question, BF_GRAY, PP_LEFT, CH_TABLE, 1)]], [TEXT_W], [3600])

    def scene(self, png_path=None, text=None, width_mm=None):
        """탐구 질문 아래 그림(왼쪽 맞춤)과 이야기 한 줄, 그리고 빈 줄 둘."""
        if png_path:
            self.picture(png_path, width_mm=width_mm or 110, align='left')
        if text:
            for t in ([text] if isinstance(text, str) else text):
                self._add(self._para(t, CH_BODY))
        self._blank()
        self._blank()
        self._after_scene = True

    # ------------------------------------------------------------ 본문 요소
    def step(self, label, sub=None):
        if not self._after_scene:
            self._blank()
        self._add(self._para(label + ('  |  ' + sub if sub else ''), CH_STEP))

    def text(self, t):
        self._add(self._para(t, CH_BODY))

    def ask(self, q, blank=True, answer_space=8):
        self._add(self._para(q + ('   답: (%s)' % (' ' * answer_space) if blank else ''), CH_ASK))

    def lines(self, n=2, length=50):
        for _ in range(n):
            self._add(self._para('_' * length, CH_ASK))

    def picture(self, png_path, width_mm=120, align='center'):
        pw, ph = _png_size(png_path)
        w = min(int(round(width_mm * MM)), TEXT_W)
        h = int(round(w * ph / pw))
        with open(png_path, 'rb') as f:
            data = f.read()
        bin_id = next((b for b, d in self.bins if d == data), None)   # 같은 그림은 한 번만 담음
        if bin_id is None:
            bin_id = 'BIN%04d' % (len(self.bins) + 1)
            self.bins.append((bin_id, data))
        pid = self._id()
        pic = PIC.format(id=pid, w=w, h=h, cx=w // 2, cy=h // 2, bin=bin_id)
        runs = self._run('', CH_PIC) + '<hp:run charPrIDRef="%d">%s</hp:run>' % (CH_PIC, pic)
        self._add(self._p(runs, PP_CENTER if align == 'center' else PP_LEFT))

    def choices(self, pairs):
        rows = [[(q, BF_TABLE, PP_LEFT, CH_BODY, 1), (a, BF_TABLE, PP_CENTER, CH_BODY, 1)] for q, a in pairs]
        self._table(rows, [32882, 18142], [3402] * len(rows))

    def labeled(self, pairs, label_mm=None, row_h=3969):
        lw = int(round(label_mm * MM)) if label_mm else 8504     # 3학년 표: 30mm
        rows = [[(k, BF_GRAY, PP_CENTER, CH_BODY, 1), (v, BF_TABLE, PP_LEFT, CH_BODY, 1)] for k, v in pairs]
        self._table(rows, [lw, TEXT_W - lw], [row_h] * len(rows))

    def wordbox(self, words):
        t = '낱말 상자:  ' + '   ·   '.join(words)
        self._table([[(t, BF_GRAY, PP_LEFT, CH_ASK, 1)]], [TEXT_W], [3600])

    def fill(self, sentences):
        if isinstance(sentences, str):
            sentences = [sentences]
        self._table([[(list(sentences), BF_TABLE, PP_LEFT, CH_ASK, 1)]], [TEXT_W],
                    [3600 * len(sentences)])

    def table(self, rows, header=True, header_col=False, col_mm=None, row_h=None, head_h=2835):
        """표. 첫 줄(header)은 회색. 첫 칸이 빈 머리 줄이면 첫 열을 50mm로(3학년 '변의 수' 표와 같음)."""
        n = max(len(r) for r in rows)
        if col_mm:
            ws = [int(round(m * MM)) for m in col_mm]
            ws[-1] += TEXT_W - sum(ws)
        elif header and n > 2 and rows[0][0] == '':
            ws = self._split(TEXT_W, n, first=14173)
        else:
            ws = self._split(TEXT_W, n)
        body_h = row_h or 3118
        out, hs = [], []
        for r, row in enumerate(rows):
            cells = []
            for c, v in enumerate(list(row) + [''] * (n - len(row))):
                gray = (header and r == 0) or (header_col and c == 0)
                cells.append((v, BF_GRAY if gray else BF_TABLE, PP_CENTER, CH_TABLE, 1))
            out.append(cells)
            hs.append(head_h if header and r == 0 else body_h)
        self._table(out, ws, hs)

    def page_break(self):
        self._add(self._para('', CH_BREAK, pb=1))

    def answers(self, title, lines, note=None):
        """맨 끝 '【교사용】 … 정답' 쪽."""
        self.page_break()
        self._add(self._para(title, CH_LESSON))
        self._blank()
        for t in lines:
            self._add(self._para(t, CH_KEY))
        if note:
            self._blank()
            self._add(self._para(note, CH_SMALL))

    # ------------------------------------------------------------ 저장
    def section_xml(self):
        head = _read('section0_head.xml')
        return head.replace('</hs:sec>', ''.join(self.body) + '</hs:sec>')

    def header_xml(self):
        h = _read('header.xml')
        if self.bins:
            items = ''.join('<hh:binItem id="%d" Type="Embedding" BinData="%s.png" Format="png"/>' % (i, b)
                            for i, (b, _) in enumerate(self.bins))
            new = '<hh:binDataList itemCnt="%d">%s</hh:binDataList>' % (len(self.bins), items)
        else:
            new = ''
        return re.sub(r'<hh:binDataList .*?</hh:binDataList>', new, h, flags=re.S)

    def content_hpf(self, title, now):
        c = _read('content.hpf')
        iso = now.strftime('%Y-%m-%dT%H:%M:%SZ')
        ampm = '오전' if now.hour < 12 else '오후'
        wd = '월화수목금토일'[now.weekday()]
        kdate = '%d년 %d월 %d일 %s요일 %s %d:%02d:%02d' % (now.year, now.month, now.day, wd, ampm,
                                                       (now.hour % 12) or 12, now.minute, now.second)
        c = re.sub(r'<opf:title>.*?</opf:title>', '<opf:title>%s</opf:title>' % escape(title), c)
        c = re.sub(r'(<opf:meta name="creator" content="text">).*?(</opf:meta>)', r'\g<1>초등교사 홍지희\2', c)
        c = re.sub(r'(<opf:meta name="lastsaveby" content="text">).*?(</opf:meta>)', r'\g<1>초등교사 홍지희\2', c)
        c = re.sub(r'(<opf:meta name="CreatedDate" content="text">).*?(</opf:meta>)', r'\g<1>%s\2' % iso, c)
        c = re.sub(r'(<opf:meta name="ModifiedDate" content="text">).*?(</opf:meta>)', r'\g<1>%s\2' % iso, c)
        c = re.sub(r'(<opf:meta name="date" content="text">).*?(</opf:meta>)', r'\g<1>%s\2' % kdate, c)
        items = ''.join('<opf:item id="%s" href="BinData/%s.png" media-type="image/png" isEmbeded="1"/>' % (b, b)
                        for b, _ in self.bins)
        c = re.sub(r'<opf:item id="BIN\d+"[^>]*/>', '', c)
        c = c.replace('<opf:item id="settings"', items + '<opf:item id="settings"')
        return c

    def save(self, path, title=None, now=None):
        title = title or os.path.splitext(os.path.basename(path))[0]
        now = now or datetime.datetime.now(datetime.timezone.utc).replace(microsecond=0)
        prv = ' '.join(self.text_log)[:1000]
        if self.bins:
            prv_img = self.bins[0][1]          # 3학년 파일처럼 첫 그림을 미리보기로
        else:
            prv_img = _blank_png()
        files = [
            ('mimetype', _read('mimetype').encode('ascii'), zipfile.ZIP_STORED),
            ('settings.xml', _read('settings.xml').encode('utf-8'), zipfile.ZIP_DEFLATED),
            ('version.xml', _read('version.xml').encode('utf-8'), zipfile.ZIP_DEFLATED),
        ]
        for b, data in self.bins:
            files.append(('BinData/%s.png' % b, data, zipfile.ZIP_DEFLATED))
        files += [
            ('Contents/content.hpf', self.content_hpf(title, now).encode('utf-8'), zipfile.ZIP_DEFLATED),
            ('Contents/header.xml', self.header_xml().encode('utf-8'), zipfile.ZIP_DEFLATED),
            ('Contents/section0.xml', self.section_xml().encode('utf-8'), zipfile.ZIP_DEFLATED),
        ]
        for m in ('container.rdf', 'container.xml', 'manifest.xml'):
            files.append(('META-INF/' + m, _read('META-INF/' + m).encode('utf-8'), zipfile.ZIP_DEFLATED))
        files += [('Preview/PrvImage.png', prv_img, zipfile.ZIP_DEFLATED),
                  ('Preview/PrvText.txt', prv.encode('utf-8'), zipfile.ZIP_DEFLATED)]
        stamp = now.timetuple()[:6]
        tmp = path + '.tmp'
        with zipfile.ZipFile(tmp, 'w') as z:
            for name, data, comp in files:
                zi = zipfile.ZipInfo(name, date_time=stamp)
                zi.compress_type = comp
                zi.external_attr = 0o644 << 16
                z.writestr(zi, data)
        os.replace(tmp, path)
        return path


def _blank_png(w=8, h=8):
    import zlib
    raw = b''.join(b'\x00' + b'\xff' * (w * 3) for _ in range(h))

    def chunk(t, d):
        return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b''))


# ---------------------------------------------------------------- SVG → PNG
_NODE_JS = r"""
const path = require('path');
const { chromium } = require(path.join(process.env.NPM_ROOT, 'playwright'));
(async () => {
  const [svgFile, out, width] = process.argv.slice(2);
  const fs = require('fs');
  const svg = fs.readFileSync(svgFile, 'utf8');
  const b = await chromium.launch({ executablePath: process.env.CHROME || '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: +width + 40, height: 800 }, deviceScaleFactor: 1 });
  await p.setContent('<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#fff}' +
    '#w{display:inline-block;width:' + width + 'px;line-height:0}#w>svg{width:100%;height:auto;display:block}</style>' +
    '</head><body><div id="w">' + svg + '</div></body></html>');
  try { await p.evaluate(() => document.fonts.ready); } catch (e) {}
  await p.locator('#w').screenshot({ path: out });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
"""


def svg_to_png(svg, out_png, width_px=1600):
    """SVG 글(문자열)을 너비 width_px의 PNG로 찍습니다. viewBox가 있어야 비율이 맞습니다."""
    if 'viewBox' not in svg:
        raise ValueError('SVG에 viewBox를 넣어 주세요(비율 유지).')
    npm_root = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
    with tempfile.TemporaryDirectory() as d:
        js = os.path.join(d, 'shot.js')
        sf = os.path.join(d, 'in.svg')
        with open(js, 'w') as f:
            f.write(_NODE_JS)
        with open(sf, 'w', encoding='utf-8') as f:
            f.write(svg)
        env = dict(os.environ, NPM_ROOT=npm_root)
        r = subprocess.run(['node', js, sf, os.path.abspath(out_png), str(int(width_px))],
                           capture_output=True, text=True, env=env, timeout=120)
        if r.returncode:
            raise RuntimeError('svg_to_png 실패: ' + r.stderr[-800:])
    return out_png


# ---------------------------------------------------------------- 점검
def check(path, expect=None):
    """문제가 없으면 [] 를 돌려줍니다. expect: 글 조각 목록(이 차례대로 나와야 함)."""
    from lxml import etree
    probs = []
    with zipfile.ZipFile(path) as z:
        infos = z.infolist()
        if infos[0].filename != 'mimetype' or infos[0].compress_type != zipfile.ZIP_STORED:
            probs.append('mimetype이 맨 앞·압축 없음이 아님')
        if z.read('mimetype') != b'application/hwp+zip':
            probs.append('mimetype 글이 다름')
        names = z.namelist()
        for n in names:
            if n.endswith(('.xml', '.hpf', '.rdf')):
                try:
                    etree.fromstring(z.read(n))
                except Exception as e:
                    probs.append('XML 오류 %s: %s' % (n, e))
        bins = sorted(n for n in names if n.startswith('BinData/'))
        hpf = z.read('Contents/content.hpf').decode('utf-8')
        head = z.read('Contents/header.xml').decode('utf-8')
        sec = z.read('Contents/section0.xml').decode('utf-8')
        for b in bins:
            stem = os.path.splitext(os.path.basename(b))[0]
            if 'href="%s"' % b not in hpf:
                probs.append('content.hpf에 없음: ' + b)
            if 'BinData="%s"' % os.path.basename(b) not in head:
                probs.append('header binDataList에 없음: ' + b)
            if 'binaryItemIDRef="%s"' % stem not in sec:
                probs.append('본문에서 안 쓰는 그림: ' + b)
        for ref in set(re.findall(r'binaryItemIDRef="(BIN\d+)"', sec)):
            if 'BinData/%s.png' % ref not in names:
                probs.append('없는 그림을 가리킴: ' + ref)
        if int(re.search(r'binDataList itemCnt="(\d+)"', head).group(1) if bins else 0) != len(bins):
            probs.append('binDataList itemCnt 틀림')
        ids = re.findall(r'<hp:p id="(\d+)"', sec)
        if len(ids) != len(set(ids)):
            probs.append('문단 id 겹침')
        sids = re.findall(r'<hp:(?:tbl|pic) id="(\d+)"', sec)
        if len(sids) != len(set(sids)):
            probs.append('표·그림 id 겹침')
        root = etree.fromstring(z.read('Contents/section0.xml'))
        HP = '{http://www.hancom.co.kr/hwpml/2011/paragraph}'
        for t in root.iter(HP + 'tbl'):
            rc, cc = int(t.get('rowCnt')), int(t.get('colCnt'))
            trs = t.findall(HP + 'tr')
            if len(trs) != rc:
                probs.append('표 줄 수 틀림')
            for tr in trs:
                span = sum(int(tc.find(HP + 'cellSpan').get('colSpan')) for tc in tr.findall(HP + 'tc'))
                if span != cc:
                    probs.append('표 칸 수 틀림')
            w = int(t.find(HP + 'sz').get('width'))
            for tr in trs:
                if sum(int(tc.find(HP + 'cellSz').get('width')) for tc in tr.findall(HP + 'tc')) != w:
                    probs.append('표 칸 너비 합 틀림')
    try:
        from hwpx import HwpxDocument
        doc = HwpxDocument.open(path)
        rep = doc.validate()
        ok = getattr(rep, 'ok', None)
        if ok is False:
            probs.append('python-hwpx validate: %s' % rep)
        txt = doc.text.plain() if hasattr(doc, 'text') else doc.export_text()
        if expect:
            pos = 0
            for e in expect:
                i = txt.find(e, pos)
                if i < 0:
                    probs.append('글 차례/없음: ' + e)
                else:
                    pos = i + len(e)
    except Exception as e:  # noqa
        probs.append('python-hwpx 열기 실패: %r' % e)
    return probs


def _demo(out):
    work = tempfile.mkdtemp()
    fan = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220">
<rect width="400" height="220" fill="#fff"/>
<g stroke="#000" stroke-width="3" fill="none"><line x1="60" y1="190" x2="340" y2="190"/>
<line x1="60" y1="190" x2="260" y2="40"/></g>
<path d="M120 190 A60 60 0 0 0 108 154" stroke="#000" stroke-width="2" fill="none"/>
<g font-family="Noto Sans KR, WenQuanYi Zen Hei, sans-serif" font-size="22">
<text x="40" y="212">ㄴ</text><text x="345" y="196">ㄷ</text><text x="262" y="36">ㄱ</text></g></svg>'''
    pro = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 230">
<rect width="420" height="230" fill="#fff"/>
<path d="M20 210 A190 190 0 0 1 400 210 Z" fill="none" stroke="#000" stroke-width="3"/>
<g stroke="#000" stroke-width="1.5">''' + ''.join(
        '<line x1="%.1f" y1="%.1f" x2="%.1f" y2="%.1f"/>' % (
            210 + 190 * __import__('math').cos(__import__('math').radians(a)),
            210 - 190 * __import__('math').sin(__import__('math').radians(a)),
            210 + (190 - (18 if a % 10 == 0 else 9)) * __import__('math').cos(__import__('math').radians(a)),
            210 - (190 - (18 if a % 10 == 0 else 9)) * __import__('math').sin(__import__('math').radians(a)))
        for a in range(0, 181, 5)) + '''</g>
<circle cx="210" cy="210" r="4"/><g font-family="WenQuanYi Zen Hei, sans-serif" font-size="14" text-anchor="middle">
<text x="210" y="45">90</text><text x="45" y="200">0</text><text x="375" y="200">180</text></g></svg>'''
    f1 = svg_to_png(fan, os.path.join(work, 'angle.png'), 1200)
    f2 = svg_to_png(pro, os.path.join(work, 'protractor.png'), 1200)
    s = Sheet(unit_label='4-1 수학 2. 각도(교과서 차시)', level='기본형')
    s.lesson(no=1, soop='개념 찾기(S)', title='단원 도입 ― 부채를 펼치면',
             question='부채를 더 넓게 펼치면 무엇이 달라질까요?')
    s.scene(f1, '민서는 할머니 댁에서 부채를 펼쳐 보았어요. 펼친 정도가 서로 달라요.', width_mm=70)
    s.step('① 만져 보기', '두 부채의 벌어진 정도 비교하기')
    s.picture(f1, width_mm=90)
    s.ask('더 많이 벌어진 부채는 어느 것인가요?')
    s.choices([('각의 크기는 무엇과 관계있나요?', '( 변의 길이 / 벌어진 정도 )'),
               ('변을 길게 그리면 각이 커지나요?', '( 예 / 아니요 )')])
    s.step('② 말해 보기', '보기 - 생각하기 - 궁금해하기')
    s.labeled([('보기', '부채에서 나는 ______________ 이 보여요.'),
               ('생각하기', '두 변이 ____________ 벌어질수록 각이 커요.'),
               ('궁금해하기', '각의 크기를 ______________ 잴 수 있을지 궁금해요.')])
    s.step('③ 떠올리기', '3학년 때 배운 각')
    s.table([['', '각 ㄱㄴㄷ', '각 ㄹㅁㅂ'], ['꼭짓점', '점 (    )', '점 (    )'], ['변', '(      )', '(      )']])
    s.lines(2)
    s.lesson(no=2, soop='개념 구축하기(O)', title='각의 크기를 재어 볼까요',
             question='각도기로 각의 크기를 어떻게 잴까요?')
    s.scene(None, '하준이는 각도기를 처음 받았어요.')
    s.step('① 만져 보기', '각도기 살펴보기')
    s.picture(f2, width_mm=120)
    s.text('각도기의 중심을 각의 꼭짓점에 맞추고, 밑금을 한 변에 맞춰요.')
    s.ask('각도기의 큰 눈금 한 칸은 몇 도인가요?')
    s.step('② 약속하기', '1도')
    s.wordbox(['각도', '1도', '직각'])
    s.fill(['각의 크기를 (      )라고 합니다.',
            '직각을 똑같이 90으로 나눈 하나를 (      )라고 하고, 1°라고 씁니다.'])
    s.page_break()
    s.step('③ 확인하기')
    s.table([['각', '가', '나', '다'], ['크기', '(   )°', '(   )°', '(   )°']], header_col=True, header=False)
    s.answers('【교사용】 2. 각도(교과서 차시) 활동지 정답 (기본형)',
              ['1차시  ① 오른쪽 부채   ③ 점 ㄴ, 점 ㅁ / 변 ㄴㄱ·ㄴㄷ, 변 ㅁㄹ·ㅁㅂ',
               '2차시  ① 10°   ② 각도, 1도'], note='※ 본보기 활동지입니다.')
    s.save(out)
    shutil.rmtree(work, ignore_errors=True)
    return ['4-1 수학 2. 각도(교과서 차시)', '1차시', '기본형', '단원 도입 ― 부채를 펼치면', '4학년 (   )반 (   )번',
            '이름 (', '탐구 질문  부채를', '민서는 할머니 댁', '① 만져 보기  |  두 부채', '답: (', '벌어진 정도',
            '② 말해 보기', '궁금해하기', '각 ㄱㄴㄷ', '꼭짓점', '______', '2차시', '각의 크기를 재어 볼까요',
            '낱말 상자:  각도   ·   1도   ·   직각', '1°라고 씁니다', '③ 확인하기', '(   )°', '【교사용】', '※ 본보기']


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'demo':
        exp = _demo(sys.argv[2])
        p = check(sys.argv[2], exp)
        print('\n'.join(p) if p else 'OK ' + sys.argv[2])
    elif len(sys.argv) >= 3 and sys.argv[1] == 'check':
        bad = 0
        for f in sys.argv[2:]:
            p = check(f)
            bad += bool(p)
            print(f, 'OK' if not p else '\n  ' + '\n  '.join(p))
        sys.exit(1 if bad else 0)
    else:
        print(__doc__)
