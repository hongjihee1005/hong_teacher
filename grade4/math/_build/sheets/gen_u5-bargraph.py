# -*- coding: utf-8 -*-
"""4-1 수학 5. 막대그래프 활동지(HWPX) 4개 만들기

    python3 gen_u5-bargraph.py

교과서 차시 버전(앱 _build/units/u5-bargraph.tb.js, 9개 차시: 1·2·3·4·5~6·7·8·9·10)과
이야기 버전(앱 u5-bargraph.st.js '우리 반 조사 기자단', 10개 차시)의 차시 번호·제목·S.O.O.P.·
탐구 질문·이야기·수를 그대로 따릅니다. 그래프 그림은 모두 아래 자료의 수로 계산해 그립니다.
"""
import hashlib
import math
import os
import random
import sys
import tempfile
from xml.sax.saxutils import escape

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from hwpxgen import Sheet, svg_to_png, check  # noqa: E402

ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))          # grade4/math
OUT_TB = os.path.join(ROOT, 'sem1', 'sheets')
OUT_ST = os.path.join(ROOT, 'sem1-soop', 'sheets')
NAME = '5단원_막대그래프_활동지_%s.hwpx'
TMP = tempfile.mkdtemp(prefix='u5bar_')
FONT = "'Noto Sans KR','WenQuanYi Zen Hei',sans-serif"
INK, SOFT, GRID, GRID2 = '#1D2A2A', '#3B4A47', '#DCE4E0', '#9AA9A3'
BAR, BAR2, BARS = '#F4B183', '#9DC8EC', '#B8743A'

# ================================================================ 자료 (앱과 같은 수)
def G(title, cats, vals, unit, catAxis, valAxis, step, cells, horiz=False, every=None):
    return dict(title=title, cats=cats, vals=vals, unit=unit, catAxis=catAxis, valAxis=valAxis,
                step=step, cells=cells, horiz=horiz, every=every)


TB = dict(
    books=G("학급별 대출한 환경 관련 책의 수", ["1반", "2반", "3반", "4반"], [9, 4, 10, 7], "권", "학급", "책의 수", 1, 10),
    flower=G("좋아하는 꽃별 학생 수", ["국화", "장미", "튤립", "수국"], [12, 26, 20, 24], "명", "꽃", "학생 수", 2, 15, True),
    act=G("실천하고 있는 환경 보호 활동별 학생 수", ["양치 컵 사용하기", "일회용품 사용하지 않기", "분리배출하기", "급식 남기지 않기"], [14, 13, 16, 11], "명", "활동", "학생 수", 1, 18),
    veg=G("기르고 싶어 하는 채소별 학생 수", ["오이", "상추", "가지", "방울토마토", "호박"], [80, 90, 70, 110, 50], "명", "채소", "학생 수", 10, 12, True),
    cake=G("좋아하는 케이크별 학생 수", ["생크림", "고구마", "초코", "치즈"], [5, 7, 8, 4], "명", "케이크", "학생 수", 1, 10),
    gift=G("받고 싶어 하는 선물별 학생 수", ["옷", "간식", "운동용품", "게임기", "장난감"], [60, 40, 90, 100, 70], "명", "선물", "학생 수", 10, 10, True),
    cup=G("일주일 동안 사용한 종류별 일회용품 수", ["종이컵", "빨대", "비닐봉지", "일회용 포크"], [10, 8, 12, 6], "개", "종류", "일회용품 수", 1, 13),
    color=G("좋아하는 색깔별 학생 수", ["빨강", "노랑", "초록", "파랑"], [6, 4, 12, 8], "명", "색깔", "학생 수", 1, 12),
    trash=G("종류별 쓰레기 양", ["캔", "유리", "종이", "플라스틱"], [60, 40, 80, 100], "kg", "종류", "쓰레기 양", 10, 10, True),
    exp=G("하고 싶어 하는 체험 활동별 학생 수", ["소품 만들기", "악기 만들기", "비누 만들기", "장바구니 만들기"], [5, 9, 3, 4], "명", "체험 활동", "학생 수", 1, 20),
    food=G("먹고 싶어 하는 음식별 학생 수", ["떡볶이", "돈가스", "수제비", "비빔밥"], [12, 8, 6, 4], "명", "음식", "학생 수", 1, 13, True),
    car=G("연도별 친환경 자동차 등록 대수", ["2017년", "2018년", "2019년", "2020년"], [35, 45, 60, 80], "만 대", "연도", "등록 대수", 5, 18, every=6),
    co=G("연도별 자동차의 일산화탄소 배출량", ["2017년", "2018년", "2019년", "2020년"], [28, 24, 22, 18], "만 t", "연도", "배출량", 2, 15),
    town=G("지역 문제별 학생 수", ["주차 문제", "안전 문제", "소음 문제", "환경 오염", "쓰레기 문제"], [90, 60, 30, 40, 20], "명", "지역 문제", "학생 수", 10, 10),
    lib=G("요일별 도서관 방문자 수", ["월요일", "화요일", "수요일", "목요일", "금요일"], [60, 40, 90, 60, 80], "명", "요일", "방문자 수", 10, 10),
    cold=G("월별 최저 기온이 0 ℃보다 낮은 날수", ["11월", "12월", "1월", "2월"], [8, 20, 24, 16], "일", "월", "날수", 2, 13),
    warmer=G("월별 손난로 판매량", ["11월", "12월", "1월", "2월"], [30, 70, 90, 60], "개", "월", "판매량", 10, 10),
    place1=G("장소별 수", ["학교", "경찰서", "도서관", "산", "폭포"], [12, 6, 7, 3, 2], "개", "장소", "수", 1, 13),
    place2=G("장소별 수", ["학교", "병원", "해수욕장", "온천", "산"], [11, 8, 5, 2, 4], "개", "장소", "수", 1, 12),
    balloon=G("신체 부위별 풍선을 띄운 횟수", ["머리", "어깨", "무릎", "발"], [15, 10, 18, 23], "회", "신체 부위", "횟수", 1, 25),
    balloon2=G("신체 부위별 풍선을 띄운 횟수", ["머리", "어깨", "무릎", "발"], [12, 14, 20, 17], "회", "신체 부위", "횟수", 1, 25),
    ball=G("종류별 공을 띄운 횟수", ["탁구공", "플로어볼공", "티볼공", "피구공"], [10, 16, 30, 26], "회", "공의 종류", "횟수", 2, 15),
    culture=G("수업별 신청한 학생 수", ["마술", "수영", "공예", "코딩"], [14, 16, 20, 10], "명", "수업", "학생 수", 2, 12),
    museum=G("가고 싶어 하는 박물관별 학생 수", ["역사", "생태", "과학", "곤충", "민속"], [14, 14, 22, 13, 10], "명", "박물관", "학생 수", 1, 24, True),
    folk=G("좋아하는 민속놀이별 학생 수", ["바둑", "씨름", "투호", "고누"], [4, 7, 9, 6], "명", "민속놀이", "학생 수", 1, 10),
)
TB['milkBar'] = G("반별 분리배출한 우유갑 수", ["1반", "2반", "3반", "4반"], [30, 25, 40, 15], "개", "반", "우유갑 수", 5, 9, every=2)
TB_MILK = dict(title="반별 분리배출한 우유갑 수", head="반", cats=["1반", "2반", "3반", "4반"], vals=[30, 25, 40, 15], unit="개")
TB_SEQ = [1, 0, 1, 3, 2, 1, 0, 1, 3, 1, 2, 0, 1, 3, 1, 0, 2, 1, 3, 0, 1]
TB_NAMES = ["민준", "서연", "도윤", "하은", "시우", "지아", "주원", "수아", "하준", "서윤", "지호", "채원", "예준", "지유", "건우", "윤서", "현우", "다은", "우진", "소율", "이서"]

ST = dict(
    milkBar=G("반별 오늘 마신 우유 수", ["1반", "2반", "3반", "4반"], [22, 24, 17, 20], "개", "반", "우유 수", 1, 25),
    sport=G("좋아하는 운동별 학생 수", ["축구", "피구", "줄넘기", "배드민턴"], [7, 9, 3, 5], "명", "운동", "학생 수", 1, 10),
    sport4=G("4학년이 좋아하는 운동별 학생 수", ["축구", "피구", "줄넘기", "배드민턴"], [26, 34, 12, 22], "명", "운동", "학생 수", 2, 18, True),
    meal=G("아침에 먹은 음식별 학생 수", ["밥", "빵", "시리얼", "과일", "먹지 않음"], [34, 26, 18, 10, 12], "명", "음식", "학생 수", 2, 18),
    lib=G("학년별 도서관에서 빌린 책의 수", ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"], [80, 120, 160, 140, 200, 180], "권", "학년", "책의 수", 20, 10, True),
    bike=G("장소별 보관대에 세워진 자전거 수", ["학교 앞", "공원", "도서관", "시장"], [14, 10, 6, 8], "대", "장소", "자전거 수", 1, 15),
    bikeDay=G("요일별 학교 앞 보관대의 자전거 수", ["월요일", "화요일", "수요일", "목요일", "금요일"], [15, 20, 10, 25, 30], "대", "요일", "자전거 수", 5, 6),
    rack=G("장소별 자전거 보관대의 자리 수", ["학교 앞", "공원", "도서관", "시장", "아파트"], [40, 60, 20, 30, 50], "자리", "장소", "자리 수", 10, 6, True),
    book=G("빌리고 싶은 책 종류별 학생 수", ["동화책", "만화책", "과학책", "역사책"], [6, 9, 5, 4], "명", "책 종류", "학생 수", 1, 10),
    book1=G("빌리고 싶은 책 종류별 학생 수", ["동화책", "만화책", "과학책", "역사책"], [7, 7, 6, 5], "명", "책 종류", "학생 수", 1, 10),
    lunch=G("먹고 싶은 급식 메뉴별 학생 수", ["짜장면", "카레", "비빔밥", "잔치국수"], [11, 7, 4, 2], "명", "메뉴", "학생 수", 1, 12, True),
    rain=G("월별 비 온 날수", ["4월", "5월", "6월", "7월"], [5, 7, 10, 14], "일", "월", "날수", 1, 15),
    bikeMon=G("월별 학교 앞 보관대에 세워진 자전거 수", ["4월", "5월", "6월", "7월"], [420, 380, 300, 220], "대", "월", "자전거 수", 20, 25),
    town=G("우리 동네에서 고치고 싶은 것별 학생 수", ["보관대 부족", "낡은 놀이터", "위험한 길", "쓰레기", "어두운 길"], [36, 24, 30, 12, 18], "명", "고치고 싶은 것", "학생 수", 2, 20),
    place=G("장소별 수", ["자전거 보관대", "공원", "병원", "도서관", "학교"], [9, 5, 4, 3, 2], "개", "장소", "수", 1, 10),
    bal=G("신체 부위별 풍선을 띄운 횟수", ["손바닥", "머리", "어깨", "무릎"], [24, 16, 8, 14], "회", "신체 부위", "횟수", 2, 12),
    bal2=G("신체 부위별 풍선을 띄운 횟수", ["손바닥", "머리", "어깨", "무릎"], [18, 20, 6, 12], "회", "신체 부위", "횟수", 2, 12),
    ball=G("종류별 공을 띄운 횟수", ["탁구공", "배구공", "테니스공", "고무공"], [8, 30, 18, 22], "회", "공의 종류", "횟수", 2, 15),
    after=G("방과 후 수업별 신청한 학생 수", ["로봇", "요리", "바둑", "댄스"], [18, 24, 10, 14], "명", "수업", "학생 수", 2, 15),
    corner=G("읽고 싶은 신문 코너별 학생 수", ["운동 소식", "급식 소식", "만화", "퀴즈", "인터뷰"], [5, 4, 7, 6, 2], "명", "코너", "학생 수", 1, 8, True, every=1),
)
ST_MILK = dict(title="반별 오늘 마신 우유 수", head="반", cats=["1반", "2반", "3반", "4반"], vals=[22, 24, 17, 20], unit="개")
ST_SEQ = [1, 0, 2, 1, 3, 0, 1, 2, 1, 0, 3, 1, 2, 0, 1, 3, 2, 1, 0, 1, 3, 2, 0, 1]
ST_NAMES = ["윤서", "도현", "하린", "민재", "지안", "태오", "서아", "준호", "예린", "시후", "다온", "주원", "채아", "건우", "나연", "이준", "소윤", "현서", "라온", "우빈", "가은", "지호", "수빈", "은우"]


def V(g, **o):
    d = dict(g)
    d.update(o)
    return d


def cells_of(g, step=None):
    s = step or g['step']
    for v in g['vals']:
        assert v % s == 0, (g['title'], v, s)
    return [v // s for v in g['vals']]


def rank(g):
    """많은 것부터 이름 차례."""
    return [c for _, c in sorted(zip(g['vals'], g['cats']), key=lambda t: -t[0])]


def val(g, cat):
    return g['vals'][g['cats'].index(cat)]


def fits(g, step, cells):
    return step * cells >= max(g['vals']) and all(v % step == 0 for v in g['vals'])


def counts(seq, n):
    return [seq.count(i) for i in range(n)]


# 자료 점검(앱의 수와 맞는지)
assert counts(TB_SEQ, 4) == TB['exp']['vals'] and len(TB_SEQ) == len(TB_NAMES) == 21
assert counts(ST_SEQ, 4) == ST['book']['vals'] and len(ST_SEQ) == len(ST_NAMES) == 24
for _g in list(TB.values()) + list(ST.values()):
    assert max(_g['vals']) <= _g['step'] * _g['cells'], _g['title']
    cells_of(_g)


# ================================================================ 그림(SVG)
def T(x, y, s, fs=18, anchor='middle', fill=INK, weight='normal'):
    return ('<text x="%.1f" y="%.1f" font-size="%d" text-anchor="%s" dominant-baseline="central" fill="%s" '
            'font-weight="%s" font-family="%s">%s</text>' % (x, y, fs, anchor, fill, weight, FONT, escape(str(s))))


def BOX(x, y, w, h):
    return ('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" rx="4" fill="#fff" stroke="%s" stroke-width="1.6" '
            'stroke-dasharray="5 4"/>' % (x, y, w, h, SOFT))


def lines_of(s, mx=5):
    s = str(s)
    if len(s) <= mx or ' ' not in s:
        return [s]
    best = None
    for i, c in enumerate(s):
        if c == ' ':
            a, b = s[:i], s[i + 1:]
            m = max(len(a), len(b))
            if best is None or m < best[0]:
                best = (m, [a, b])
    return best[1]


def wrap(body, W, H):
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d"><rect width="%d" height="%d" fill="#fff"/>%s</svg>'
            % (W, H, W, H, body), W, H)


def bar_svg(g, bars='vals', title=True, ticks='num', names=None, axes=True, lock=None, every=None, fs=18):
    """막대그래프. bars: 'vals'(값대로) | None(빈 모눈) | [칸 수…].
    title: True(제목) | False(빈 칸 '제목: (    )') | None(제목 줄 없음)
    ticks: 'num'(수 씀) | 'zero'(0만, 나머지는 빈칸) ; names: None(그대로) 또는 [이름|None]
    axes: True | False(축 이름 빈칸) ; lock: 파란 막대로 그릴 번호(나머지 막대는 안 그림)"""
    cats, n, cells = g['cats'], len(g['cats']), g['cells']
    names = names if names is not None else cats
    if bars == 'vals':
        h = cells_of(g)
    elif bars is None:
        h = [0] * n
    else:
        h = bars
    if lock is not None:
        h = [h[i] if i in lock else 0 for i in range(n)]
    if every is None:
        every = g.get('every') or (1 if cells <= 6 else 5)
        if ticks == 'zero':
            every = 1 if cells <= 15 else 5
    nl = max(len(lines_of(c)) for c in cats)
    longest = max(len(l) for c in cats for l in lines_of(c))
    TT = 88 if title is not None else 48
    ph = 250 if (bars == 'vals' and lock is None) else 340
    valName = '%s (%s)' % (g['valAxis'], g['unit'])
    out = []
    if not g['horiz']:
        CH = max(12, min(32, ph // cells))
        SW = max(96, longest * fs + 24)
        L = max(84, len(g['catAxis']) * fs + 30)
        PW, PH = n * SW, cells * CH
        base = TT + PH
        W = L + PW + 24
        H = base + 24 + nl * (fs + 4) + 14
    else:
        CW = max(16, min(42, 500 // cells))
        SH = max(56, nl * (fs + 4) + 24)
        L = max(longest * fs + 40, len(g['catAxis']) * fs + 30, 86)
        PW, PH = cells * CW, n * SH
        W = L + PW + 44
        H = TT + PH + 78
    W = max(W, len(g['title']) * 24 + 40 if title else 0, len(valName) * fs + 60)
    tick = lambda k: str(k * g['step'])
    if title:
        out.append(T(W / 2, 26, g['title'], 23, weight='bold'))
    elif title is False:
        out.append(T(W / 2 - 60, 28, '제목:', 21, anchor='end'))
        out.append(BOX(W / 2 - 52, 10, min(W / 2 + 40, 420), 36))
    if not g['horiz']:
        if axes:
            out.append(T(10, TT - 24, valName, fs, anchor='start', fill=SOFT))
        else:
            out.append(BOX(8, TT - 40, 170, 30))
        for k in range(cells + 1):
            y = base - k * CH
            major = k % every == 0
            out.append('<line x1="%d" y1="%.1f" x2="%d" y2="%.1f" stroke="%s" stroke-width="%s"/>'
                       % (L, y, L + PW, y, GRID2 if major and k else GRID, 1.6 if major else 1))
            if major:
                if ticks == 'num' or k == 0:
                    out.append(T(L - 10, y, tick(k), fs - 1, anchor='end'))
        for i in range(n + 1):
            out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s"/>' % (L + i * SW, TT, L + i * SW, base, GRID))
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>' % (L, TT, L, base, INK))
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>' % (L, base, L + PW, base, INK))
        for i in range(n):
            x = L + i * SW
            hh = h[i] * CH
            if hh:
                out.append('<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="%s" stroke="%s"/>'
                           % (x + SW * .25, base - hh, SW * .5, hh, BAR2 if lock is not None else BAR, BARS))
            if names[i] is None:
                out.append(BOX(x + SW * .12, base + 8, SW * .76, fs + 14))
            else:
                for j, l in enumerate(lines_of(names[i])):
                    out.append(T(x + SW / 2, base + 18 + fs / 2 + j * (fs + 4), l, fs))
        if axes:
            out.append(T(L - 10, base + 18 + fs / 2, g['catAxis'], fs, anchor='end', fill=SOFT))
        else:
            out.append(BOX(4, base + 22, L - 30, fs + 12))
    else:
        if axes:
            out.append(T(L - 12, TT - 18, g['catAxis'], fs, anchor='end', fill=SOFT))
        else:
            out.append(BOX(8, TT - 36, L - 18, 30))
        for k in range(cells + 1):
            x = L + k * CW
            major = k % every == 0
            out.append('<line x1="%.1f" y1="%d" x2="%.1f" y2="%d" stroke="%s" stroke-width="%s"/>'
                       % (x, TT, x, TT + PH, GRID2 if major and k else GRID, 1.6 if major else 1))
            if major and (ticks == 'num' or k == 0):
                out.append(T(x, TT + PH + 18, tick(k), fs - 1))
        for i in range(n + 1):
            out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s"/>' % (L, TT + i * SH, L + PW, TT + i * SH, GRID))
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>' % (L, TT, L, TT + PH, INK))
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="2"/>' % (L, TT + PH, L + PW, TT + PH, INK))
        if axes:
            out.append(T(L + PW, TT + PH + 54, valName, fs, anchor='end', fill=SOFT))
        else:
            out.append(BOX(L + PW - 160, TT + PH + 38, 160, 30))
        for i in range(n):
            y = TT + i * SH
            ww = h[i] * CW
            if ww:
                out.append('<rect x="%d" y="%.1f" width="%.1f" height="%.1f" fill="%s" stroke="%s"/>'
                           % (L, y + SH * .24, ww, SH * .52, BAR2 if lock is not None else BAR, BARS))
            if names[i] is None:
                out.append(BOX(10, y + SH / 2 - (fs + 14) / 2, L - 22, fs + 14))
            else:
                ls = lines_of(names[i])
                for j, l in enumerate(ls):
                    out.append(T(L - 12, y + SH / 2 + (j - (len(ls) - 1) / 2) * (fs + 4), l, fs, anchor='end'))
    return wrap(''.join(out), W, H) + ('read' if (bars == 'vals' and lock is None) else 'draw',)


def pair_svg(parts, gap=36):
    """[(머리글|None, (svg, W, H)), …] 를 옆으로 나란히."""
    lead_h = 34 if any(p[0] for p in parts) else 0
    W = sum(p[1][1] for p in parts) + gap * (len(parts) - 1)
    H = max(p[1][2] for p in parts) + lead_h
    x, out = 0, []
    for lead, (svg, w, h, *_) in parts:
        if lead:
            out.append(T(x + w / 2, 16, lead, 21, weight='bold', fill='#2B6FB8'))
        inner = svg.split('>', 1)[1].rsplit('</svg>', 1)[0]
        out.append('<svg x="%d" y="%d" width="%d" height="%d" viewBox="0 0 %d %d">%s</svg>' % (x, lead_h, w, h, w, h, inner))
        x += w + gap
    return wrap(''.join(out), W, H)


def carton(x, y, s):
    """우유갑 그림(가운데 아래 기준), s=1 큰 그림."""
    w, h = 22 * s, 34 * s
    return ('<path d="M%.1f %.1f h%.1f v-%.1f l-%.1f -%.1f h-%.1f l-%.1f %.1f Z" fill="#fff" stroke="#2B6FB8" stroke-width="%.1f"/>'
            '<rect x="%.1f" y="%.1f" width="%.1f" height="%.1f" fill="#9DC8EC"/>'
            % (x - w / 2, y, w, h * .72, w * .25, h * .28, w * .5, w * .25, h * .28, 1.2 + s,
               x - w / 2 + 1.5, y - h * .45, w - 3, h * .22))


def pict_svg(m, filled=True):
    rows, RH, NW, PW = m['cats'], 74, 110, 560
    top = 50
    W = NW + PW + 20
    H = top + 40 + len(rows) * RH + 64
    out = [T(W / 2, 22, m['title'], 22, weight='bold')]
    out.append('<rect x="10" y="%d" width="%d" height="40" fill="#F2F5F4" stroke="%s"/>' % (top, NW + PW, GRID2))
    out.append(T(10 + NW / 2, top + 20, m['head'], 19))
    out.append(T(10 + NW + PW / 2, top + 20, '%s(%s)' % ('우유갑 수' if '우유갑' in m['title'] else '우유 수', m['unit']), 19))
    out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s"/>' % (10 + NW, top, 10 + NW, top + 40 + len(rows) * RH, GRID2))
    for i, c in enumerate(rows):
        y = top + 40 + i * RH
        out.append('<rect x="10" y="%d" width="%d" height="%d" fill="none" stroke="%s"/>' % (y, NW + PW, RH, GRID2))
        out.append(T(10 + NW / 2, y + RH / 2, c, 19))
        if filled:
            v = m['vals'][i]
            x = 10 + NW + 26
            for _ in range(v // 10):
                out.append(carton(x, y + RH - 12, 1.45))
                x += 40
            x += 6
            for _ in range(v % 10):
                out.append(carton(x, y + RH - 14, .8))
                x += 24
    ly = top + 40 + len(rows) * RH + 34
    out.append(carton(W / 2 - 150, ly + 22, 1.45) + T(W / 2 - 124, ly, '10개', 19, anchor='start'))
    out.append(carton(W / 2 + 40, ly + 14, .8) + T(W / 2 + 60, ly, '1개', 19, anchor='start'))
    return wrap(''.join(out), W, H)


def tally_svg(cats, vals, title):
    RH, LW, W, top = 54, 100, 620, 46
    H = top + len(cats) * RH + 14
    out = [T(W / 2, 22, title, 20, weight='bold')]
    for i, c in enumerate(cats):
        y = top + i * RH
        out.append('<rect x="10" y="%d" width="%d" height="%d" fill="#fff" stroke="%s"/>' % (y, W - 20, RH, GRID2))
        out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s"/>' % (10 + LW, y, 10 + LW, y + RH, GRID2))
        out.append(T(10 + LW / 2, y + RH / 2, c, 19))
        x = 10 + LW + 20
        for k in range(vals[i]):
            gi, r = divmod(k, 5)
            gx = x + gi * 70
            if r < 4:
                out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="%s" stroke-width="3" stroke-linecap="round"/>'
                           % (gx + r * 11, y + 12, gx + r * 11, y + RH - 12, INK))
            else:
                out.append('<line x1="%d" y1="%d" x2="%d" y2="%d" stroke="#D9482B" stroke-width="3" stroke-linecap="round"/>'
                           % (gx - 6, y + RH - 16, gx + 39, y + 16))
    return wrap(''.join(out), W, H)


def sticker_svg(cats, seq, names, title):
    CWID, top = 170, 64
    n = len(cats)
    rows = (max(seq.count(i) for i in range(n)) + 1) // 2
    W = n * CWID + 20
    H = top + 44 + rows * 48 + 20
    cols = ['#F6C6A8', '#B9DCF2', '#C8E6C0', '#F3E1A0']
    out = [T(W / 2, 24, title + ' — 스티커 판', 21, weight='bold')]
    filled = [0] * n
    for i, c in enumerate(cats):
        x = 10 + i * CWID
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="#F2F5F4" stroke="%s"/>' % (x, top, CWID, 44, GRID2))
        out.append(T(x + CWID / 2, top + 22, c, 18))
        out.append('<rect x="%d" y="%d" width="%d" height="%d" fill="none" stroke="%s"/>' % (x, top + 44, CWID, rows * 48 + 12, GRID2))
    for k, ci in enumerate(seq):
        r, c = divmod(filled[ci], 2)
        x = 10 + ci * CWID + CWID / 2 + (c - .5) * 48
        y = top + 44 + 30 + r * 48
        filled[ci] += 1
        out.append('<circle cx="%.1f" cy="%.1f" r="21" fill="%s" stroke="%s"/>' % (x, y, cols[ci % 4], SOFT))
        out.append(T(x, y, names[k], 15))
    return wrap(''.join(out), W, H)


ICON = {
    'school': [("M-14 -2 L0 -14 L14 -2 Z", 'fill="#E2734A"'), ("M-12 -2 h24 v16 h-24 Z", 'fill="#FFD9A8" stroke="#B5552E" stroke-width="1.5"'),
               ("M-3 14 v-8 h6 v8", 'fill="#B5552E"'), ("M0 -14 v-6 l7 2.5 l-7 2.5", 'fill="#D9482B" stroke="#7A4A2A" stroke-width="1"')],
    'police': [("M0 -16 L13 -11 L11 6 Q8 13 0 17 Q-8 13 -11 6 L-13 -11 Z", 'fill="#2F5DA8" stroke="#1C3B70" stroke-width="1.5"'),
               ("M0 -7 L2.4 -1.5 L8 -1 L3.8 2.6 L5 8 L0 5 L-5 8 L-3.8 2.6 L-8 -1 L-2.4 -1.5 Z", 'fill="#F5D04A"')],
    'library': [("M0 -8 Q-8 -14 -16 -11 v20 Q-8 6 0 12 Z", 'fill="#fff" stroke="#2F7D5B" stroke-width="2"'),
                ("M0 -8 Q8 -14 16 -11 v20 Q8 6 0 12 Z", 'fill="#E3F4EA" stroke="#2F7D5B" stroke-width="2"')],
    'mountain': [("M-17 13 L-4 -12 L5 3 L9 -4 L18 13 Z", 'fill="#5FA05A" stroke="#2F6B30" stroke-width="1.5"'), ("M-4 -12 L-8 -4 L-1 -6 Z", 'fill="#fff"')],
    'fall': [("M-14 -15 h28 v6 h-28 Z", 'fill="#8A7660"'), ("M-10 -9 h20 v24 h-20 Z", 'fill="#7CC2F0"'),
             ("M-6 -8 v20 M0 -8 v22 M6 -8 v20", 'stroke="#fff" stroke-width="2" fill="none"')],
    'hospital': [("M-14 -14 h28 v28 h-28 Z", 'fill="#fff" stroke="#C9463B" stroke-width="2"'),
                 ("M-4 -10 h8 v6 h6 v8 h-6 v6 h-8 v-6 h-6 v-8 h6 Z", 'fill="#D9482B"')],
    'beach': [("M-16 -2 Q0 -22 16 -2 Z", 'fill="#F08A6C" stroke="#B5552E" stroke-width="1.5"'), ("M0 -2 v16", 'stroke="#7A4A2A" stroke-width="2.5"'),
              ("M-17 14 Q-8 9 0 14 T17 14", 'stroke="#4E94CF" stroke-width="2.5" fill="none"')],
    'spa': [("M-14 6 Q0 18 14 6 Z", 'fill="#7FB2E5" stroke="#2B6FB8" stroke-width="1.5"'),
            ("M-7 2 q-4 -5 0 -9 t0 -9 M0 2 q-4 -5 0 -9 t0 -9 M7 2 q-4 -5 0 -9 t0 -9", 'stroke="#D9482B" stroke-width="2" fill="none"')],
    'bike': [("M-16 -16 h32 v32 h-32 Z", 'fill="#E8F1FB" stroke="#2B6FB8" stroke-width="1.5"'),
             ("M-13 6 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M2 6 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0", 'fill="none" stroke="#1D2A2A" stroke-width="2"'),
             ("M-7 6 L-2 -4 L6 -4 L8 6 M-2 -4 L1 6 L6 -4 M-4 -8 h5", 'stroke="#D9482B" stroke-width="2" fill="none" stroke-linejoin="round"')],
    'park': [("M-2 4 h4 v12 h-4 Z", 'fill="#8A6A4A"'), ("M-12 -5 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0", 'fill="#7DC59A" stroke="#2F6B30" stroke-width="1.5"'),
             ("M-16 16 h32", 'stroke="#5FA05A" stroke-width="3"')],
}


def icon(kind, x, y, s=36):
    return '<g transform="translate(%.1f %.1f) scale(%.3f)">%s</g>' % (
        x, y, s / 36, ''.join('<path d="%s" %s/>' % (d, a) for d, a in ICON[kind]))


def map_svg(kinds, seed, title):
    W, Hm = 680, 450
    rnd = random.Random(seed)
    out = ['<rect x="0" y="40" width="%d" height="%d" fill="#EEF6E6" stroke="%s"/>' % (W, Hm, GRID2)]
    out.append(T(W / 2, 20, title, 21, weight='bold'))
    out.append('<path d="M0 340 Q170 300 330 340 T680 320" stroke="#9CCBEA" stroke-width="16" fill="none"/>')
    for d, w in (("M0 190 H680", 14), ("M220 40 V490", 14), ("M470 40 Q450 260 500 490", 12)):
        out.append('<path d="%s" stroke="#E2DBCF" stroke-width="%d" fill="none"/>' % (d, w))
    cx, cy = W - 62, 96
    out.append('<circle cx="%d" cy="%d" r="30" fill="#fff" stroke="%s"/>' % (cx, cy, GRID2))
    out.append('<path d="M%d %d L%d %d L%d %d Z" fill="#D9482B"/>' % (cx, cy - 24, cx + 7, cy, cx - 7, cy))
    out.append(T(cx, cy - 40, '북', 15) + T(cx, cy + 41, '남', 15) + T(cx - 41, cy, '서', 15) + T(cx + 41, cy, '동', 15))
    spots = []
    for r in range(6):
        for c in range(10):
            x, y = 44 + c * 64, 86 + r * 70
            if x > 560 and y < 170:
                continue
            spots.append((x + (rnd.random() - .5) * 16, y + (rnd.random() - .5) * 14))
    rnd.shuffle(spots)
    total = sum(k['n'] for k in kinds)
    assert total <= len(spots)
    si = 0
    for k in kinds:
        for _ in range(k['n']):
            out.append(icon(k['kind'], spots[si][0], spots[si][1], 38))
            si += 1
    # 범례
    ly = Hm + 40 + 34
    step = W / len(kinds)
    for i, k in enumerate(kinds):
        x = step * i + 26
        out.append(icon(k['kind'], x, ly, 30) + T(x + 22, ly, k['name'], 17, anchor='start'))
    return wrap(''.join(out), W, Hm + 40 + 64)


_cache = {}


def png(svgtuple, width_px=1500):
    svg = svgtuple[0]
    key = hashlib.sha1(svg.encode('utf-8')).hexdigest()[:16]
    if key not in _cache:
        p = os.path.join(TMP, key + '.png')
        svg_to_png(svg, p, width_px=width_px)
        _cache[key] = p
    return _cache[key]


# ================================================================ 쪽 높이를 어림해 묶음째 넘기기
LIMIT = 258.0      # 본문 높이 273 mm에서 여유


def nlines(t, per):
    return max(1, math.ceil(len(t) / per))


class W:
    def __init__(self, s):
        self.s, self.y, self.buf = s, 0.0, []
        self.after_pic = False      # 단계의 첫 그림 뒤로는 문항마다 따로 넘길 수 있음
        self.hold = False           # 다음 요소와 붙여 둠(질문 + 쓰는 칸)

    def _q(self, h, fn, *a, **k):
        if self.hold:
            self.hold = False
        elif self.after_pic and self.buf:
            # 그림 바로 앞의 안내 글·표는 그림과 함께 둠
            if not (fn == self.s.picture and self.buf[-1][1] in (self.s.text, self.s.table, self.s.fill, self.s.choices)):
                self.flush()
        self.buf.append((h, fn, a, k))

    def flush(self):
        if not self.buf:
            return
        h = sum(b[0] for b in self.buf)
        if self.y + h > LIMIT and self.y > 60:
            self.s.page_break()
            self.y = 0.0
        for _, fn, a, k in self.buf:
            fn(*a, **k)
        self.y += h
        self.buf = []

    # 차시 머리
    def lesson(self, no, soop, title, question, scene):
        self.flush()
        self.after_pic = False
        self.s.lesson(no=no, soop=soop, title=title, question=question)
        self.y = 46 + 4 * (len(question) > 34)
        self._q(sum(nlines(t, 37) * 7.4 for t in ([scene] if isinstance(scene, str) else scene)) + 6,
                self.s.scene, None, scene)
        self.flush()

    def step(self, label, sub=None):
        self.flush()
        self.after_pic = False
        self._q(11.5, self.s.step, label, sub)

    def cut(self):
        self.flush()

    def text(self, t):
        self._q(nlines(t, 37) * 7.4, self.s.text, t)

    def ask(self, q, blank=True):
        self._q(nlines(q + (' 답: (        )' if blank else ''), 34) * 8.1, self.s.ask, q, blank)
        if not blank:
            self.hold = True

    def lines(self, n=2):
        self._q(n * 8.3, self.s.lines, n)

    def why(self, q, n=2):
        q = '왜 그럴까요? ' + q
        self._group([(nlines(q, 34) * 8.1, self.s.ask, (q, False)), (n * 8.3, self.s.lines, (n,))])

    def pic(self, svgt, mm=150, align='center', maxh=None):
        Wd, Hd = svgt[1], svgt[2]
        if maxh is None:
            maxh = {'read': 70, 'draw': 84}.get(svgt[3] if len(svgt) > 3 else '', 80)
        mm = min(mm, 178, maxh * Wd / Hd)
        self._q(mm * Hd / Wd + 2.5, self.s.picture, png(svgt), mm, align)
        self.after_pic = True

    def choices(self, pairs):
        h = sum(max(12.0, nlines(q, 22) * 6.6 + 3, nlines(a, 13) * 6.6 + 3) for q, a in pairs)
        self._q(h, self.s.choices, pairs)

    def labeled(self, pairs, label_mm=None, row_h=3969):
        lw = label_mm or 30
        per = int((180 - lw) / 4.7)
        h = sum(max(row_h / 283.465, nlines(v, per) * 6.6 + 3) for _, v in pairs)
        self._q(h, self.s.labeled, pairs, label_mm, row_h)

    def wordbox(self, words):
        self._q(13.5, self.s.wordbox, words)

    def fill(self, sents):
        sents = [sents] if isinstance(sents, str) else sents
        self._q(sum(max(12.7, nlines(t, 33) * 8.0 + 3) for t in sents) + 1, self.s.fill, sents)

    def table(self, rows, **k):
        self._q(len(rows) * 11.6 + 1, self.s.table, rows, **k)

    def _group(self, items):
        """[(h, fn, a)] 를 한 묶음(쪽에서 갈라지지 않게)으로."""
        def run():
            for _, fn, a in items:
                fn(*a)
        self._q(sum(i[0] for i in items), run)

    def pick(self, q, opts):
        """긴 보기 고르기: 질문 + ①②③ 줄."""
        items = [(nlines(q + ' 답: (        )', 34) * 8.1, self.s.ask, (q,))]
        for i, o in enumerate(opts):
            t = '%s %s' % ('①②③④⑤'[i], o)
            items.append((nlines(t, 37) * 7.4, self.s.text, (t,)))
        self._group(items)


def dtable(cats, vals, head, row, total=True, blanks=()):
    """자료 표: [[head, …cats, 합계], [row, …vals, 합계]] (blanks 칸은 빈칸)."""
    r1 = [head] + list(cats) + (['합계'] if total else [])
    r2 = [row] + ['(     )' if (i in blanks) else str(v) for i, v in enumerate(vals)]
    if total:
        r2.append('(     )' if 'sum' in blanks else str(sum(vals)))
    return [r1, r2]


def OX(xs):
    return [(x, '( ○ / × )') for x in xs]


def write3(w, D, panes):
    """보기·생각하기 칸: [(이름, 기본형 도움말, 도전형 도움말)]"""
    if D:
        w.labeled([(a, '(%s)\n\n' % c) for a, b, c in panes], row_h=7000)
    else:
        w.labeled([(a, b + '\n\n') for a, b, c in panes], row_h=7000)


# ================================================================ 교과서 차시 버전
def tb_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "단원 도입 ― 환경 보호 실천 학교", "조사한 자료를 어떻게 나타내면 한눈에 비교할 수 있을까요?",
             "이서네 학교는 환경 보호 실천 학교예요. 이서와 친구들은 환경을 보호하기 위해 어떤 활동을 했는지 조사했어요.")
    acts = ["양치 컵 사용하기", "일회용품 사용하지 않기", "분리배출하기", "급식 남기지 않기", "쓰지 않는 전등 켜 두기", "일회용 컵 많이 쓰기"]
    w.step("① 그림 살펴보기", "환경 보호 활동 고르기")
    w.text("그림 속 학생들이 실천하고 있는 환경 보호 활동이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(acts))
    w.step("② 곰곰! 그림그래프 그리기", "반별 분리배출한 우유갑 수")
    m = TB_MILK
    w.table(dtable(m['cats'], m['vals'], '반', '우유갑 수(개)', blanks=('sum',) if not D else ('sum',)))
    w.text("표를 보고 그림그래프를 완성해 보세요. 큰 그림은 10개, 작은 그림은 1개를 나타내요.")
    if not D:
        w.fill(["30개 → 큰 그림 (    )개        25개 → 큰 그림 (    )개, 작은 그림 (    )개",
                "40개 → 큰 그림 (    )개        15개 → 큰 그림 (    )개, 작은 그림 (    )개"])
    w.pic(pict_svg(m, filled=False), 150)
    w.step("③ 곰곰! 그림그래프 읽기", "완성한 그림그래프 보기")
    w.choices([("우유갑을 가장 많이 모은 반은?", "( 1반 / 2반 / 3반 / 4반 )"),
               ("우유갑을 가장 적게 모은 반은?", "( 1반 / 2반 / 3반 / 4반 )")])
    w.ask("네 반이 모은 우유갑은 모두 몇 개인가요?")
    w.ask("3반은 2반보다 우유갑을 몇 개 더 모았나요?" + ("  (도움: 40 − 25)" if not D else ""))
    w.step("④ 똑똑! 무엇을 배울까요", "같은 자료를 막대 모양으로")
    w.pic(bar_svg(TB['milkBar']), 105)
    w.choices([("우유갑 수를 나타내는 것은?", "( 막대의 길이 / 막대의 폭 / 막대의 색깔 )"),
               ("우유갑을 가장 많이 모은 반을 한눈에 찾으려면?", "( 가장 긴 막대 / 가장 짧은 막대 / 가장 왼쪽 막대 )")])
    w.step("⑤ 생각 나누기", "내 생각 쓰기")
    if D:
        w.ask("우리나라에는 독도를 포함해서 섬이 3383개나 있대요. 나라별로 섬이 몇 개 있는지 비교하려면 어떻게 나타내면 좋을까요?", blank=False)
        w.lines(2)
        w.ask("막대 모양으로 나타낸 그래프는 표로 나타낸 것과 어떤 점이 다를 것 같나요?", blank=False)
        w.lines(2)
    else:
        w.labeled([("섬의 수", "나라별 섬의 수를 비교하려면 (                         )로 나타내면 좋겠어요."),
                   ("경험", "환경 보호 활동을 해 본 경험:"),
                   ("궁금해요", "막대 모양 그래프는 표보다 (                    )을 한눈에 볼 수 있을 것 같아요.")])
    ans = ("1차시  ① 양치 컵 사용하기·일회용품 사용하지 않기·분리배출하기·급식 남기지 않기 ○, 전등 켜 두기·일회용 컵 많이 쓰기 × "
           "② 합계 110, 1반 큰 3 · 2반 큰 2 작은 5 · 3반 큰 4 · 4반 큰 1 작은 5 ③ 3반, 4반, 110개, 15개 ④ 막대의 길이, 가장 긴 막대 "
           "⑤ (생각 쓰기 — 예: 막대 모양 그래프로 나타내요 / 많고 적음을 한눈에 볼 수 있어요)")
    if D:
        w.step("⑥ 도전하기", "그림그래프 더 읽기")
        w.ask("큰 그림 2개와 작은 그림 5개는 우유갑 몇 개를 나타내나요?")
        w.choices([("2반과 4반이 모은 우유갑을 합하면 어느 반과 같나요?", "( 1반 / 3반 / 같은 반이 없어요 )")])
        w.ask("3반이 우유갑을 5개 더 모으면 큰 그림은 몇 개가 되나요?")
        w.why("그림그래프와 막대 모양 그래프는 각각 어떤 점이 편리할까요?")
        ans += " ⑥ 25개, 3반(25 + 15 = 40), 4개(45개 = 큰 그림 4개 + 작은 그림 5개), (생각 쓰기 — 예: 그림그래프는 그림 수로 어림하기 쉽고, 막대 모양 그래프는 길이로 바로 견줄 수 있어요)"
    return ans


def tb_l2(w, D):
    g = TB['books']
    w.lesson(2, "개념 구축하기(O)", "막대그래프를 알아볼까요", "조사한 자료의 수량을 막대 모양으로 나타내면 무엇이 편리할까요?",
             "이서는 4학년 학생들이 학급별로 대출한 환경 관련 책의 수를 표로 나타냈어요.")
    w.step("① 만져 보기", "막대를 세로로 세우기")
    w.table(dtable(g['cats'], g['vals'], '학급', '책의 수(권)'))
    w.text("세로 눈금 한 칸은 1권이에요. 학급마다 책의 수만큼 막대를 색칠해 보세요.")
    if not D:
        w.fill("1반 9권 → 눈금 (    )칸,  2반 4권 → (    )칸,  3반 10권 → (    )칸,  4반 7권 → (    )칸")
    w.pic(bar_svg(g, bars=None), 105)
    w.step("② 그려 보기", "막대를 가로로 나타내기")
    w.text("가로와 세로를 바꾸어 막대를 가로로 나타내 보세요. 가로 눈금 한 칸도 1권이에요.")
    w.pic(bar_svg(V(g, horiz=True), bars=None), 120)
    w.step("③ 말해 보기", "막대그래프 살펴보기")
    w.pic(bar_svg(g), 95)
    w.choices([("그래프의 가로는 무엇을 나타내나요?", "( 학급 / 책의 수 )"),
               ("그래프의 세로는 무엇을 나타내나요?", "( 학급 / 책의 수 )"),
               ("막대의 길이는 무엇을 나타내나요?", "( 책의 수 / 학급의 수 / 막대의 폭 )")])
    w.ask("세로 눈금 한 칸은 몇 권을 나타내나요?")
    w.pick("세로 막대그래프와 가로 막대그래프의 같은 점은?", ["두 그래프 모두 막대의 길이가 대출한 책의 수를 나타내요.", "두 그래프 모두 학급이 가로에 있어요."])
    if D:
        w.why("가로 막대그래프에서는 무엇이 달라졌나요? 세로 막대그래프와 견주어 써 보세요.")
    w.step("④ 약속하기", "막대그래프")
    if not D:
        w.wordbox(["막대", "막대그래프", "길이", "폭", "그림그래프"])
    w.fill(["조사한 자료의 수량을 (        ) 모양으로 나타낸 그래프를 (              )라고 해요.",
            "막대그래프에서는 막대의 (        )에 따라 수량을 알 수 있어요."])
    w.step("⑤ 확인하기", "표와 막대그래프는 어떤 점이 편리할까요?")
    w.choices([("항목별 수를 정확하게 알 수 있어요.", "( 표 / 막대그래프 )"),
               ("자료의 수량을 한눈에 비교할 수 있어요.", "( 표 / 막대그래프 )"),
               ("전체 합계를 한눈에 알 수 있어요.", "( 표 / 막대그래프 )"),
               ("가장 많은 것과 가장 적은 것을 한눈에 알 수 있어요.", "( 표 / 막대그래프 )")])
    c = cells_of(g)
    ans = ("2차시  ① %d칸, %d칸, %d칸, %d칸만큼 세로 막대 ② 같은 길이의 가로 막대 ③ 학급, 책의 수, 책의 수, 1권, ① "
           "④ 막대, 막대그래프, 길이 ⑤ 표, 막대그래프, 표, 막대그래프" % tuple(c))
    if D:
        f = TB['flower']
        w.step("⑥ 도전하기", "민수네 학교 4학년이 좋아하는 꽃")
        w.pic(bar_svg(f), 120)
        w.choices([("그래프의 가로와 세로는?", "( 가로: 학생 수, 세로: 꽃 / 가로: 꽃, 세로: 학생 수 )")])
        w.ask("가로 눈금 한 칸은 몇 명을 나타내나요?")
        w.ask("장미를 좋아하는 학생은 몇 명인가요?")
        w.why("가로 눈금 한 칸이 그 크기인 까닭을 써 보세요.")
        ans = ans.replace(" ④ ", " / 왜: (예: 막대가 가로로 누워 학급은 세로에, 책의 수는 가로에 있어요) ④ ", 1) + (
                                                " ⑥ 가로: 학생 수, 세로: 꽃 / %d명 / %d명(13칸 × 2) / 왜: 0과 10 사이가 5칸이라 10 ÷ 5 = 2"
                                                % (f['step'], val(f, '장미')))
    return ans


def tb_l3(w, D):
    a, v = TB['act'], TB['veg']
    w.lesson(3, "개념 구축하기(O)", "막대그래프의 내용을 알아볼까요", "막대그래프를 보고 어떤 내용을 알 수 있을까요?",
             "이서네 학교 4학년 학생들이 실천하고 있는 환경 보호 활동을 조사하여 막대그래프로 나타냈어요.")
    w.step("① 만져 보기", "환경 보호 활동 막대그래프")
    w.pic(bar_svg(a), 120)
    w.pick("무엇을 조사하여 나타낸 막대그래프인가요?", ["4학년 학생들이 실천하고 있는 환경 보호 활동", "4학년 학생들이 좋아하는 운동", "반별 학생 수"])
    w.ask("가장 많은 학생이 실천하고 있는 활동은?")
    w.ask("가장 적은 학생이 실천하고 있는 활동은?")
    w.step("② 그려 보기", "같은 그래프에서 수량 알아보기")
    w.ask("세로 눈금 한 칸은 몇 명을 나타내나요?" + ("  (도움: 0과 5 사이가 5칸)" if not D else ""))
    w.ask("‘양치 컵 사용하기’를 실천하는 학생은 몇 명인가요?")
    w.ask("‘일회용품 사용하지 않기’보다 더 많은 학생이 실천하는 활동을 모두 써 보세요.")
    w.step("③ 말해 보기", "도하네 학교 학생들이 기르고 싶어 하는 채소")
    w.pic(bar_svg(v), 125)
    w.ask("가로 눈금 한 칸은 몇 명을 나타내나요?" + ("  (도움: 가로 눈금 5칸이 50명)" if not D else ""))
    w.ask("가지를 기르고 싶어 하는 학생은 몇 명인가요?")
    w.ask("오이를 기르고 싶어 하는 학생은 호박보다 몇 명 더 많나요?")
    if D:
        w.why("‘가지 막대는 7칸이니까 7명’이라고 한 친구에게 무엇이라고 말해 줄까요?")
    w.step("④ 약속하기", "막대그래프 읽기")
    if D:
        w.fill(["막대그래프에서 막대의 길이가 길수록 수량이 (        ).",
                "가장 많은 것은 막대가 가장 (        ) 것이에요.",
                "수량을 알려면 먼저 눈금 한 칸의 (        )를 확인해요."])
    else:
        w.fill(["막대그래프에서 막대의 길이가 길수록 수량이 ( 많아요 / 적어요 ).",
                "가장 많은 것은 막대가 가장 ( 긴 / 짧은 ) 것이에요.",
                "수량을 알려면 먼저 눈금 한 칸의 ( 크기 / 색깔 )를 확인해요."])
    w.step("⑤ 확인하기", "많은 학생이 기르고 싶어 하는 채소부터 차례대로")
    w.fill("(          ) → (          ) → (          ) → (          ) → (          )")
    r = rank(v)
    ans = ("3차시  ① ①(실천하고 있는 환경 보호 활동), 분리배출하기, 급식 남기지 않기 ② 1명, %d명, 양치 컵 사용하기·분리배출하기 "
           "③ %d명, %d명, %d명 ④ 많아요, 긴, 크기 ⑤ %s"
           % (val(a, '양치 컵 사용하기'), v['step'], val(v, '가지'), val(v, '오이') - val(v, '호박'), ' → '.join(r)))
    if D:
        ck, gf = TB['cake'], TB['gift']
        w.step("⑥ 도전하기", "익힘책 문제 ― 두 막대그래프")
        w.pic(pair_svg([(None, bar_svg(ck)), (None, bar_svg(gf))]), 178)
        w.ask("가장 많은 학생이 좋아하는 케이크는?")
        w.ask("초코케이크를 좋아하는 학생 수는 치즈케이크의 몇 배인가요?")
        w.ask("옷을 받고 싶어 하는 학생은 몇 명인가요?")
        w.ask("두 번째로 많은 학생이 받고 싶어 하는 선물은?")
        w.ask("장난감보다 적은 학생이 받고 싶어 하는 선물을 모두 써 보세요.")
        w.why("①의 환경 보호 활동 그래프로 답이 ‘3명’인 질문을 만들어 써 보세요.", 1)
        lt = [c for c in gf['cats'] if val(gf, c) < val(gf, '장난감')]
        ans = ans.replace(" ④ ", " / 왜: (예: 가로 눈금 한 칸은 10명이라 7칸은 70명이에요) ④ ", 1)
        ans += (" ⑥ %s, %d배, %d명, %s, %s, "
                "(예: ‘양치 컵 사용하기’를 실천하는 학생은 ‘급식 남기지 않기’보다 몇 명 더 많나요? 14 − 11 = 3)"
                % (rank(ck)[0], val(ck, '초코') // val(ck, '치즈'), val(gf, '옷'), rank(gf)[1], '·'.join(lt)))
    return ans


def tb_l4(w, D):
    g = TB['cup']
    w.lesson(4, "개념 구축하기(O)", "막대그래프로 나타내는 방법을 알아볼까요", "표를 보고 막대그래프로 나타내려면 어떻게 해야 할까요?",
             "이서네 모둠 학생들이 일주일 동안 사용한 일회용품 수를 조사하여 표로 나타냈어요.")
    w.step("① 만져 보기", "표를 막대그래프로 (세로 눈금 한 칸 1개)")
    w.table(dtable(g['cats'], g['vals'], '종류', '일회용품 수(개)'))
    if not D:
        w.choices([("가로에 나타낼 것은?", "( 종류 / 일회용품 수 )"), ("세로에 나타낼 것은?", "( 종류 / 일회용품 수 )")])
    w.text("빈칸에 축 이름과 제목을 쓰고, 막대를 그려 보세요.")
    w.pic(bar_svg(g, bars=None, title=False, axes=False), 120)
    w.pick("막대그래프의 제목으로 알맞은 것은?", ["좋아하는 일회용품", "일주일 동안 사용한 종류별 일회용품 수", "이서네 모둠 학생 수"])
    w.step("② 그려 보기", "세로 눈금이 8칸뿐이라면")
    g8 = V(g, cells=8, step=2)
    if not D:
        w.fill(["가장 큰 수는 (      )개예요. 한 칸이 1개이면 8칸으로 (      )개까지만 나타낼 수 있어요.",
                "그래서 세로 눈금 한 칸을 ( 1개 / 2개 / 5개 )로 정해요."])
    else:
        w.choices([("세로 눈금 한 칸의 크기는?", "( 1개 / 2개 / 5개 )")])
    w.text("눈금에 수를 쓰고 막대를 다시 그려 보세요.")
    w.pic(bar_svg(g8, bars=None, ticks='zero'), 105)
    if D:
        w.why("눈금 한 칸을 5개로 하면 안 되는 까닭을 써 보세요.", 1)
    w.step("③ 말해 보기", "막대를 가로로")
    w.text("①에서 그린 막대그래프의 가로와 세로를 바꾸어 막대를 가로로 나타내 보세요. (가로 눈금 한 칸 1개)")
    w.pic(bar_svg(V(g, horiz=True), bars=None), 135)
    w.step("④ 약속하기", "막대그래프로 나타내는 방법")
    if not D:
        w.wordbox(["가장 큰 수", "눈금 한 칸의 크기", "막대", "제목"])
    w.fill(["① 표를 보고 가로와 세로에 무엇을 나타낼지 정해요.",
            "② (            )까지 나타낼 수 있도록 (                )를 정해요.",
            "③ 조사한 자료의 수에 맞게 (        )로 나타내요.",
            "④ 막대그래프에 알맞은 (        )을 써요. (먼저 써도 돼요.)"])
    c = TB['color']
    w.step("⑤ 확인하기", "좋아하는 색깔별 학생 수 ― 스스로 정하기")
    w.table(dtable(c['cats'], c['vals'], '색깔', '학생 수(명)'))
    if not D:
        w.fill(["가장 큰 수는 (      )명이에요. 아래 모눈은 12칸이에요.",
                "세로 눈금 한 칸을 ( 1명 / 2명 / 5명 )으로 정하고 눈금에 수를 써요. (칸이 남아도 돼요.)"])
    else:
        w.fill("눈금 한 칸은 (      )명으로 정했어요. 쓰는 눈금은 (      )칸이에요.")
    w.pic(bar_svg(c, bars=None, ticks='zero'), 105)
    ok = [(s, k) for s in (5, 1, 2) for k in (5, 6, 10, 12) if fits(c, s, k)]
    assert ok == [(1, 12), (2, 6), (2, 10), (2, 12)], ok
    ans = ("4차시  ① 가로: 종류, 세로: 일회용품 수(개), 막대 %s칸, 제목 ②(일주일 동안 사용한 종류별 일회용품 수) "
           "② 12개, 8개, 2개 → 막대 %s칸 ③ 가로 막대 %s칸 ④ 가장 큰 수, 눈금 한 칸의 크기, 막대, 제목 "
           "⑤ 12명, 1명이면 %s칸(12칸 모두) 또는 2명이면 %s칸 — 5명은 6·4·12·8을 칸에 꼭 맞게 못 나타내요"
           % ('·'.join(map(str, cells_of(g))), '·'.join(map(str, cells_of(g8))), '·'.join(map(str, cells_of(g))),
              '·'.join(map(str, cells_of(c, 1))), '·'.join(map(str, cells_of(c, 2)))))
    if D:
        t = TB['trash']
        w.step("⑥ 도전하기", "종류별 쓰레기 양 ― 가로 눈금 10칸")
        w.table(dtable(t['cats'], t['vals'], '종류', '쓰레기 양(kg)'))
        w.choices([("가로 눈금 한 칸의 크기는?", "( 1 kg / 10 kg / 20 kg / 50 kg )")])
        w.pic(bar_svg(t, bars=None, ticks='zero'), 130)
        w.why("그 크기로 정한 까닭을 ‘가장 큰 수’를 넣어 써 보세요.")
        ans = ans.replace(" ③ ", " / 왜: 5개로 하면 12·8·6이 칸에 꼭 맞지 않아요 ③ ", 1)
        ans += (" ⑥ 10 kg, 막대 %s칸, 왜: 가장 큰 수 100 kg을 10칸에 나타내야 하므로 100 ÷ 10 = 10"
                % '·'.join(map(str, cells_of(t))))
    return ans


def tb_l56(w, D):
    e = TB['exp']
    w.lesson("5~6", "탐구 정리하기(O)", "자료를 조사하여 막대그래프로 나타내어 볼까요",
             "우리 반 학생들이 하고 싶어 하는 친환경 체험 활동을 조사하여 어떻게 나타낼까요?",
             "선생님께서 환경의 날에 하고 싶은 친환경 체험 활동을 이야기해 보자고 하셨어요.")
    w.step("① 조사 계획 세우기", "어떻게 조사할까요?")
    w.text("조사하는 방법으로 알맞으면 ○, 알맞지 않으면 ×에 표시해 보세요.")
    w.choices(OX(["직접 손 들기", "스티커 붙이기", "공학 도구로 자료 수집하기", "친구들에게 묻지 않고 짐작하기"]))
    w.pick("조사하기에 알맞은 질문은?", ["우리 반 학생들은 어떤 친환경 체험 활동을 하고 싶어 할까?", "나는 어떤 친환경 체험 활동을 하고 싶을까?"])
    w.step("② 스티커로 조사하기", "이서네 반 친구 21명의 스티커 판")
    w.pic(sticker_svg(e['cats'], TB_SEQ, TB_NAMES, '하고 싶은 체험 활동'), 150)
    w.text("스티커를 세어 표를 완성해 보세요.")
    w.table(dtable(e['cats'], e['vals'], '체험 활동', '학생 수(명)', blanks=(0, 1, 2, 3, 'sum')))
    w.step("③ 막대그래프로 나타내기", "가로·세로, 눈금, 제목을 스스로 정하기")
    if not D:
        w.choices([("가로에 나타낼 것은?", "( 체험 활동 / 학생 수 )"), ("세로 눈금 한 칸의 크기는?", "( 5명 / 2명 / 1명 )")])
        w.pick("제목으로 알맞은 것은?", ["우리 반 학생 수", "하고 싶어 하는 체험 활동별 학생 수", "환경의 날"])
    else:
        w.text("가로·세로 축 이름, 눈금의 수, 막대 이름, 제목을 모두 써서 막대그래프를 완성해 보세요.")
    ge = V(e, cells=10)
    w.pic(bar_svg(ge, bars=None, ticks='zero', axes=False, title=False, names=[None] * 4), 120)
    if D:
        w.why("세로 눈금 한 칸을 2명으로 하면 안 되는 까닭을 써 보세요.", 1)
    w.step("④ 공학 도구로 그리기", "표에 수를 넣으면 막대그래프가 바로 그려져요")
    w.fill(["간격(눈금 한 칸의 크기)을 1로 하면 ‘악기 만들기’ 막대는 (      )칸이에요.",
            "‘그래프 형태’를 가로형으로 바꾸면 막대가 ( 가로 / 세로 )로 그려져요.",
            "간격이나 형태를 바꾸어도 나타내는 자료는 ( 같아요 / 달라져요 )."])
    w.step("⑤ 비교하고 이야기하기", "우리 반 막대그래프 보기")
    w.ask("가장 많은 학생이 하고 싶어 하는 활동은?")
    w.ask("가장 적은 학생이 하고 싶어 하는 활동은?")
    w.ask("‘악기 만들기’를 하고 싶어 하는 학생 수는 ‘비누 만들기’의 몇 배인가요?")
    w.pick("체험 활동을 하나만 정한다면? 그래프에 근거한 까닭을 골라 보세요.",
           ["악기 만들기 ― 가장 많은 학생이 하고 싶어 하기 때문이에요.", "소품 만들기 ― 표에서 가장 왼쪽에 있기 때문이에요."])
    r = rank(e)
    ans = ("5~6차시  ① ○, ○, ○, ×, ① ② %s, 합계 %d ③ 가로: 체험 활동, 세로: 학생 수(명), 한 칸 1명(0, 1, 2, …), 막대 %s칸, "
           "제목: 하고 싶어 하는 체험 활동별 학생 수 ④ %d칸, 가로, 같아요 ⑤ %s, %s, %d배, ①"
           % (', '.join('%s %d' % t for t in zip(e['cats'], e['vals'])), sum(e['vals']), '·'.join(map(str, cells_of(e))),
              val(e, '악기 만들기'), r[0], r[-1], val(e, '악기 만들기') // val(e, '비누 만들기')))
    if D:
        f = TB['food']
        order = rank(f)
        w.step("⑥ 도전하기", "많이 먹고 싶어 하는 음식부터 위에서 차례대로")
        w.table(dtable(["수제비", "떡볶이", "돈가스", "비빔밥"], [6, 12, 8, 4], '음식', '학생 수(명)'))
        w.text("막대 이름을 위에서부터 차례대로 쓰고, 가로 눈금 한 칸을 1명으로 하여 막대를 그려 보세요.")
        w.pic(bar_svg(f, bars=None, names=[None] * 4), 130)
        w.why("많은 것부터 차례대로 나타내면 어떤 점이 좋을까요?", 1)
        ans = ans.replace(" ④ ", " / 왜: 9·5·3이 2로 나누어떨어지지 않아 칸에 꼭 맞지 않아요 ④ ", 1)
        ans += (" ⑥ 위에서부터 %s, 왜: 순위를 한눈에 알 수 있어요"
                % ', '.join('%s %d칸' % (c, val(f, c)) for c in order))
    return ans


def tb_l7(w, D):
    car, co, town, lib = TB['car'], TB['co'], TB['town'], TB['lib']
    w.lesson(7, "탐구 정리하기(O)", "막대그래프를 생활에 활용해 볼까요", "생활 속 막대그래프를 보고 무엇을 알고 판단할 수 있을까요?",
             "이서네 반 학생들이 우리나라의 연도별 친환경 자동차 등록 대수와 자동차의 일산화탄소 배출량을 조사하여 막대그래프로 나타냈어요.")
    w.step("① 두 막대그래프 살펴보기")
    w.pic(pair_svg([(None, bar_svg(car)), (None, bar_svg(co))]), 175)
    w.text("(막대의 길이는 교과서 그래프를 바탕으로 어림하여 그렸어요.)")
    w.pick("왼쪽 막대그래프는 무엇을 조사하여 나타냈나요?", ["연도별 친환경 자동차 등록 대수", "연도별 자동차의 일산화탄소 배출량", "연도별 학생 수"])
    w.ask("친환경 자동차 등록 대수가 가장 많은 때는?")
    w.ask("자동차의 일산화탄소 배출량이 가장 적은 때는?")
    w.step("② 두 그래프 견주기")
    w.choices([("2017년부터 2020년까지 친환경 자동차 등록 대수는?", "( 늘어났어요 / 줄어들었어요 / 그대로예요 )"),
               ("같은 때 일산화탄소 배출량은?", "( 늘어났어요 / 줄어들었어요 / 그대로예요 )")])
    w.pick("일산화탄소 배출량이 줄어든 까닭으로 생각할 수 있는 것은?", ["친환경 자동차의 등록 대수가 늘어났기 때문이에요.", "자동차가 모두 없어졌기 때문이에요."])
    w.choices([("2022년 친환경 자동차가 159만 대로 늘었어요. 그해 배출량은?", "( 줄었을 것 같아요 / 크게 늘었을 것 같아요 )")])
    w.step("③ 글로 완성하기", "민우네 학교 4학년 학생들이 생각하는 지역 문제")
    w.pic(bar_svg(town), 120)
    if not D:
        w.fill(["가장 많은 학생이 생각하는 지역 문제는 ( 주차 문제 / 쓰레기 문제 / 환경 오염 )이고,",
                "가장 적은 학생이 생각하는 지역 문제는 ( 안전 문제 / 쓰레기 문제 / 소음 문제 )입니다.",
                "두 번째로 많은 학생이 생각하는 지역 문제는 (              )입니다."])
    else:
        w.fill(["가장 많은 학생이 생각하는 지역 문제는 (            )이고, 가장 적은 학생이 생각하는 지역 문제는 (            )입니다.",
                "또 알 수 있는 내용은 (                                                  )입니다."])
    w.step("④ 사실과 의견 나누기", "지역 문제 막대그래프를 보고 한 말")
    w.choices([("가장 많은 학생이 생각하는 지역 문제는 주차 문제예요.", "( 사실 / 의견 )"),
               ("주차 문제를 해결하는 활동을 하면 좋겠어요.", "( 사실 / 의견 )"),
               ("환경 오염을 생각하는 학생은 40명이에요.", "( 사실 / 의견 )"),
               ("소음 문제와 안전 문제를 생각하는 학생 수를 더하면 주차 문제와 같아요.", "( 사실 / 의견 )"),
               ("우리 지역에 주차장을 더 만들어야 해요.", "( 사실 / 의견 )")])
    assert val(town, '소음 문제') + val(town, '안전 문제') == val(town, '주차 문제') and val(town, '환경 오염') == 40
    w.step("⑤ 생활 속 막대그래프", "어느 도서관의 요일별 방문자 수")
    w.pic(bar_svg(lib), 115)
    w.ask("방문자 수가 같은 요일을 모두 써 보세요.")
    w.ask("수요일의 방문자는 몇 명인가요?")
    w.ask("방문자 수가 화요일의 2배인 요일은?")
    w.pick("주중 하루 운영 시간을 늘린다면 어느 요일이 좋을까요?", ["수요일 ― 방문자 수가 가장 많기 때문이에요.", "화요일 ― 요일 이름이 짧기 때문이에요."])
    rt = rank(town)
    same = [c for c in lib['cats'] if lib['cats'] and [val(lib, x) for x in lib['cats']].count(val(lib, c)) > 1]
    two = [c for c in lib['cats'] if val(lib, c) == 2 * val(lib, '화요일')]
    ans = ("7차시  ① ①, 2020년, 2020년 ② 늘어났어요, 줄어들었어요, ①, 줄었을 것 같아요 ③ %s, %s, (또는) 두 번째로 많은 것은 %s "
           "④ 사실, 의견, 사실, 사실, 의견 ⑤ %s, %d명, %s, ①" % (rt[0], rt[-1], rt[1], '·'.join(same), val(lib, '수요일'), two[0]))
    if D:
        cold, wm = TB['cold'], TB['warmer']
        w.step("⑥ 도전하기", "11월~2월 최저 기온이 0 ℃보다 낮은 날수와 손난로 판매량")
        w.pic(pair_svg([(None, bar_svg(cold)), (None, bar_svg(wm))]), 175)
        w.ask("최저 기온이 0 ℃보다 낮은 날이 가장 많은 달은?")
        w.ask("손난로가 가장 많이 팔린 달은?")
        w.ask("12월의 손난로 판매량은 몇 개인가요?")
        w.why("두 그래프 사이에는 어떤 관계가 있을까요? 그래프의 사실을 근거로 써 보세요.")
        ans += (" ⑥ %s, %s, %d개, 왜: (예: 최저 기온이 0 ℃보다 낮은 날이 많은 달일수록 손난로 판매량이 많아요 — 1월 24일·90개)"
                % (rank(cold)[0], rank(wm)[0], val(wm, '12월')))
    return ans


def tb_l8(w, D):
    p1, p2 = TB['place1'], TB['place2']
    k1 = [dict(kind="school", name="학교", n=12), dict(kind="police", name="경찰서", n=6), dict(kind="library", name="도서관", n=7),
          dict(kind="mountain", name="산", n=3), dict(kind="fall", name="폭포", n=2)]
    k2 = [dict(kind="school", name="학교", n=11), dict(kind="hospital", name="병원", n=8), dict(kind="beach", name="해수욕장", n=5),
          dict(kind="spa", name="온천", n=2), dict(kind="mountain", name="산", n=4)]
    assert [k['n'] for k in k1] == p1['vals'] and [k['n'] for k in k2] == p2['vals']
    w.lesson(8, "탐구 정리하기(O)", "생각을 더하다 ― 우리 지역을 소개해 볼까요",
             "지도 속 자료를 막대그래프로 나타내면 우리 지역을 어떻게 소개할 수 있을까요?",
             "선호와 은진이가 살고 있는 지역의 지도를 보고 장소별 수를 세어 지역을 소개해요.")
    w.step("① 기호 세어 표로", "선호네 지역 지도")
    w.text("한 가지 기호씩 차례로 세고, 센 기호에는 ／ 표시를 해 보세요.")
    w.pic(map_svg(k1, 11, '선호네 지역'), 140)
    w.table(dtable(p1['cats'], p1['vals'], '장소', '수(개)', blanks=(0, 1, 2, 3, 4, 'sum')))
    w.step("② 막대그래프로 나타내기", "세로 눈금 한 칸 1개")
    w.pic(bar_svg(p1, bars=None, title=False), 120)
    w.pick("제목으로 알맞은 것은?", ["선호네 반 학생 수", "장소별 수", "좋아하는 장소"])
    w.step("③ 소개 글 완성하기")
    if not D:
        w.wordbox(["학교", "도서관", "3", "폭포"])
    w.fill(["친구들아, 안녕? 우리 지역에는 학생들이 많아서 (          )이/가 가장 많고, 두 번째로는 (          )이/가 많아.",
            "그리고 산 (      )개가 지역을 둘러싸고 있어서 경관이 아름다워. (          )도 2개가 있어서 사람들이 많이 찾아와."])
    w.step("④ 은진이네 지역 세기", "은진이네 지역 지도")
    w.pic(map_svg(k2, 29, '은진이네 지역'), 140)
    w.table(dtable(p2['cats'], p2['vals'], '장소', '수(개)', blanks=(0, 1, 2, 3, 4, 'sum')))
    w.step("⑤ 은진이네 막대그래프", "세로 눈금 12칸")
    if not D:
        w.fill("가장 큰 수는 (      )개, 세로 눈금은 12칸이에요. 눈금 한 칸을 ( 2개 / 5개 / 1개 )로 정해요.")
    else:
        w.choices([("세로 눈금 한 칸의 크기는?", "( 2개 / 5개 / 1개 )")])
    w.pic(bar_svg(p2, bars=None, ticks='zero'), 120)
    r1 = rank(p1)
    ans = ("8차시  ① %s, 합계 %d ② 막대 %s칸, 장소별 수 ③ %s, %s, %d, 폭포 ④ %s, 합계 %d ⑤ 11개, 1개 → 막대 %s칸"
           % (', '.join('%s %d' % t for t in zip(p1['cats'], p1['vals'])), sum(p1['vals']), '·'.join(map(str, p1['vals'])),
              r1[0], r1[1], val(p1, '산'), ', '.join('%s %d' % t for t in zip(p2['cats'], p2['vals'])), sum(p2['vals']),
              '·'.join(map(str, p2['vals']))))
    if D:
        w.step("⑥ 도전하기", "은진이네 지역 소개 글 쓰기")
        w.ask("가장 많은 장소와 두 번째로 많은 장소는 무엇인가요?", blank=False)
        w.lines(1)
        w.ask("막대그래프에서 알 수 있는 사실을 넣어 은진이네 지역을 소개하는 글을 써 보세요.", blank=False)
        w.lines(3)
        ans += " ⑥ 학교(11개), 병원(8개), (소개 글 — 예: 우리 지역에는 해수욕장이 5개나 있어서 여름에 사람들이 많이 찾아와.)"
    return ans


def tb_l9(w, D):
    b, b2 = TB['balloon'], TB['balloon2']
    w.lesson(9, "발표하기(P)", "놀이를 더하다 ― 몸으로 풍선을 띄워 볼까요", "놀이 기록을 막대그래프로 나타내면 무엇을 알 수 있을까요?",
             "머리, 어깨, 무릎, 발의 순서대로 풍선을 띄우고 횟수를 세는 놀이를 해요.")
    w.step("① 풍선 띄우기 놀이", "우리 모둠 기록")
    w.table([["신체 부위", "머리", "어깨", "무릎", "발", "합계"], ["횟수(회)", "", "", "", "", ""]])
    w.step("② 표로 정리하기", "다섯 개씩 묶어 센 기록")
    w.text("빨간 사선이 있는 묶음 하나가 5회예요. 세어서 표를 완성해 보세요.")
    w.pic(tally_svg(b['cats'], b['vals'], '이서네 모둠의 기록'), 120)
    w.table(dtable(b['cats'], b['vals'], '신체 부위', '횟수(회)', blanks=(0, 1, 2, 3, 'sum')))
    w.step("③ 막대그래프로 나타내기", "세로 눈금 한 칸 1회")
    w.pic(bar_svg(b, bars=None, title=False), 110)
    w.pick("제목으로 알맞은 것은?", ["신체 부위별 풍선을 띄운 횟수", "우리 모둠 친구 이름", "좋아하는 풍선 색깔"])
    w.step("④ 막대그래프 해석하기")
    w.choices([("가로와 세로는?", "( 가로: 신체 부위, 세로: 횟수 / 가로: 횟수, 세로: 신체 부위 )")])
    w.ask("세로 눈금 한 칸은 몇 회를 나타내나요?")
    w.ask("풍선을 가장 많이 띄운 신체 부위는?")
    w.ask("풍선을 가장 적게 띄운 신체 부위는?")
    w.ask("발로 띄운 횟수는 어깨로 띄운 횟수보다 몇 회 더 많나요?")
    w.step("⑤ 다른 모둠과 비교하기", "하준이네 모둠과 견주기")
    w.pic(pair_svg([("이서네 모둠", bar_svg(b)), ("하준이네 모둠", bar_svg(b2))]), 170)
    w.choices([("어깨로 풍선을 더 많이 띄운 모둠은?", "( 이서네 모둠 / 하준이네 모둠 )")])
    w.ask("무릎으로 띄운 횟수는 두 모둠이 몇 회 차이 나나요?")
    w.ask("하준이네 모둠이 가장 많이 띄운 신체 부위는?")
    w.pick("두 막대그래프를 보고 알 수 있는 사실은?", ["두 모둠 모두 머리보다 무릎으로 더 많이 띄웠어요.", "두 모둠 모두 발로 가장 많이 띄웠어요."])
    assert all(val(x, '머리') < val(x, '무릎') for x in (b, b2))
    ans = ("9차시  ① (모둠 기록) ② %s, 합계 %d ③ 막대 %s칸, ① ④ 가로: 신체 부위, 세로: 횟수 / 1회 / %s / %s / %d회 "
           "⑤ %s, %d회, %s, ①"
           % (', '.join('%s %d' % t for t in zip(b['cats'], b['vals'])), sum(b['vals']), '·'.join(map(str, b['vals'])),
              rank(b)[0], rank(b)[-1], val(b, '발') - val(b, '어깨'),
              '하준이네 모둠' if val(b2, '어깨') > val(b, '어깨') else '이서네 모둠', abs(val(b, '무릎') - val(b2, '무릎')), rank(b2)[0]))
    if D:
        bl = TB['ball']
        w.step("⑥ 도전하기", "책으로 공 띄우기 ― 세로 눈금 15칸")
        w.table(dtable(bl['cats'], bl['vals'], '공의 종류', '횟수(회)'))
        w.choices([("세로 눈금 한 칸의 크기는?", "( 1회 / 2회 / 5회 / 10회 )")])
        w.pic(bar_svg(bl, bars=None, ticks='zero'), 115)
        w.why("그 크기로 정한 까닭을 써 보세요.", 1)
        ans += (" ⑥ 2회, 막대 %s칸, 왜: 가장 큰 수 30회를 15칸에 나타내려면 한 칸이 2회여야 하고, 모든 수가 짝수예요"
                % '·'.join(map(str, cells_of(bl))))
    return ans


def tb_l10(w, D):
    cu, mu = TB['culture'], TB['museum']
    w.lesson(10, "발표하기(P)", "공부한 내용을 확인해요", "막대그래프에 대해 배운 것을 모두 확인해 볼까요?",
             "어느 문화 센터의 수업을 신청한 학생 수를 조사하여 막대그래프로 나타냈어요.")
    w.step("① 그래프 살펴보기")
    w.pic(bar_svg(cu), 110)
    w.choices([("가로와 세로는?", "( 가로: 수업의 종류, 세로: 학생 수 / 가로: 학생 수, 세로: 수업의 종류 )")])
    w.ask("세로 눈금 한 칸은 몇 명을 나타내나요?" + ("  (도움: 세로 눈금 5칸이 10명)" if not D else ""))
    w.step("② 옳은 설명 찾기")
    w.choices([("신청한 학생 수가 가장 적은 수업은 코딩 수업입니다.", "( ○ / × )"),
               ("수영 수업을 신청한 학생은 13명입니다.", "( ○ / × )"),
               ("공예 수업을 신청한 학생 수는 코딩 수업의 2배입니다.", "( ○ / × )")])
    assert rank(cu)[-1] == '코딩' and val(cu, '공예') == 2 * val(cu, '코딩') and val(cu, '수영') != 13
    w.step("③ 표와 막대그래프 완성하기", "나은이네 학교 4학년이 가고 싶어 하는 박물관")
    tc, tv = ["생태", "역사", "과학", "곤충", "민속"], [14, 14, 22, 13, 10]
    rows = dtable(tc, tv, '박물관', '학생 수(명)', blanks=(3,))
    w.table(rows)
    w.text("표의 빈칸을 채우고, 그래프의 축 이름과 빈 막대 이름을 쓴 뒤 역사·민속 박물관의 막대를 그려 보세요.")
    w.pic(bar_svg(mu, lock={1, 2, 3}, names=["역사", None, None, "곤충", "민속"], axes=False), 150)
    w.step("④ 알 수 있는 내용")
    w.text("막대그래프를 보고 알 수 있는 내용으로 옳으면 ○, 옳지 않으면 ×에 표시해 보세요.")
    w.choices(OX(["가장 많은 학생이 가고 싶어 하는 박물관은 과학 박물관이에요.", "생태 박물관과 역사 박물관에 가고 싶어 하는 학생 수는 같아요.",
                  "곤충 박물관에 가고 싶어 하는 학생은 15명이에요.", "가장 적은 학생이 가고 싶어 하는 박물관은 민속 박물관이에요."]))
    w.ask("과학 박물관에 가고 싶어 하는 학생은 민속 박물관보다 몇 명 더 많나요?")
    w.step("⑤ 체험 학습 장소 정하기")
    w.labeled([("장소", "체험 학습 장소로 (                ) 박물관이 좋겠어요."),
               ("까닭", "왜냐하면 막대그래프에서 (                                              )이기 때문이에요.")])
    assert 73 - 14 - 14 - 22 - 10 == 13
    ans = ("10차시  ① 가로: 수업의 종류, 세로: 학생 수 / %d명 ② ○, ×(16명), ○ ③ 곤충 13, 합계 73 / 세로: 박물관, 가로: 학생 수(명) / "
           "빈 막대 이름 위에서부터 생태(14칸), 과학(22칸) / 역사 14칸, 민속 10칸 ④ ○, ○, ×(13명), ○ / %d명 "
           "⑤ (생각 쓰기 — 예: 과학, 가장 많은 학생이 가고 싶어 하기 때문)" % (cu['step'], val(mu, '과학') - val(mu, '민속')))
    if D:
        fk = TB['folk']
        st = [("막대그래프의 가로에 나타낸 것은 학생 수입니다.", False), ("세로 눈금 한 칸은 1명을 나타냅니다.", True),
              ("가장 많은 학생이 좋아하는 민속놀이는 투호입니다.", True), ("바둑을 좋아하는 학생은 9명입니다.", False)]
        assert rank(fk)[0] == '투호' and val(fk, '바둑') == 4
        w.step("⑥ 도전하기", "꼭꼭! 확인하고 정리해요 ― 도윤이가 좋아하는 민속놀이 찾기")
        w.pic(bar_svg(fk), 95)
        w.text("설명이 옳으면 ○, 옳지 않으면 ×를 쓴 다음, 아래 표에서 ○× 차례가 같은 줄을 찾아 보세요.")
        w.choices([("%d. %s" % (i + 1, t), "( ○ / × )") for i, (t, _) in enumerate(st)])
        key = ''.join('○' if a else '×' for _, a in st)
        opts = [("○ ○ ○ ×", "바둑"), (' '.join(key), "고누"), ("× × ○ ×", "씨름"), ("× ○ ○ ○", "투호")]
        assert len({o[0] for o in opts}) == 4
        w.table([["○× 차례"] + [o[0] for o in opts], ["도착하는 곳"] + [o[1] for o in opts]])
        w.ask("도윤이가 좋아하는 민속놀이는?")
        w.why("틀린 설명 하나를 골라 바르게 고쳐 써 보세요.", 1)
        ans += " ⑥ ×, ○, ○, × → 고누, 왜: (예: 가로에 나타낸 것은 민속놀이의 종류입니다 / 바둑을 좋아하는 학생은 4명입니다)"
    return ans


# ================================================================ 이야기 버전
def st_l1(w, D):
    mb = ST['milkBar']
    w.lesson(1, "개념 찾기(S)", "우리 반 조사 기자단이 생겼어요", "조사한 자료를 어떻게 나타내면 한눈에 비교할 수 있을까요?",
             "햇살초등학교 4학년 2반 24명은 학급 신문 「햇살 4-2 소식」을 만드는 조사 기자단이 되었어요.")
    w.step("① 만져 보기 — 보기·생각하기·궁금해하기", "기자단이 조사해 볼 것")
    write3(w, D, [("보여요", "(예: 우리 반에서 좋아하는 운동을 조사할 수 있어요)", "기자단이 조사할 수 있는 것"),
                  ("생각해요", "(예: 조사한 수는 표로 나타내면 정확해요)", "조사한 것을 정리했던 경험"),
                  ("궁금해요", "(예: 막대 모양 그래프는 표와 무엇이 다를까?)", "자료를 나타내는 방법에서 궁금한 것")])
    w.step("② 그려 보기 — 그림그래프 떠올리기", "반별 오늘 마신 우유 수")
    w.table(dtable(ST_MILK['cats'], ST_MILK['vals'], '반', '우유 수(개)'))
    if not D:
        w.fill("22개 → 큰 그림 (    )개, 작은 그림 (    )개   ·   17개 → 큰 그림 (    )개, 작은 그림 (    )개")
    w.text("큰 그림은 10개, 작은 그림은 1개를 나타내요. 그림그래프를 완성해 보세요.")
    w.pic(pict_svg(ST_MILK, filled=False), 150)
    w.step("③ 말해 보기 — 막대 모양 그래프 만나기", "도현이가 그린 그래프")
    w.pic(bar_svg(mb), 105)
    w.choices([("우유 수를 나타내는 것은?", "( 막대의 길이 / 막대의 폭 / 막대의 색깔 )"),
               ("우유를 가장 많이 마신 반은?", "( 1반 / 2반 / 3반 / 4반 )")])
    w.ask("2반은 3반보다 우유를 몇 개 더 마셨나요?")
    if D:
        w.why("막대 모양 그래프에서 가장 많이 마신 반을 어떻게 한눈에 찾을 수 있을까요?")
    else:
        w.ask("왜 그럴까요? 가장 많이 마신 반은 어떻게 찾을까요?", blank=False)
        w.fill("막대가 가장 (        ) 반을 찾으면 돼요. 막대가 길수록 우유를 (        ) 마셨기 때문이에요.")
    w.step("④ 약속하기 — 무엇을 배울까요")
    w.pick("조사한 자료를 막대 모양으로 나타내면 무엇이 편리할까요?", ["많고 적음을 한눈에 비교할 수 있어요.", "그림을 그리지 않아도 돼요.", "합계를 꼭 알 수 있어요."])
    w.choices([("막대 모양 그래프를 읽을 때 먼저 확인할 것은?", "( 가로와 세로가 나타내는 것 / 막대의 색깔 )"),
               ("막대 모양 그래프를 그리려면 정해야 할 것은?", "( 눈금 한 칸이 나타내는 수 / 막대의 색깔 수 )")])
    w.step("⑤ 확인하기 — 첫 기사 계획")
    if D:
        w.ask("우리 반에서 조사해 보고 싶은 것과, 그 결과를 신문에 어떻게 보여 주면 좋을지 까닭과 함께 써 보세요.", blank=False)
        w.lines(3)
    else:
        w.labeled([("조사 주제", "우리 반 친구들이 좋아하는 (                  )을/를 조사해 보고 싶어요."),
                   ("보여 주는 방법", "(              )로 보여 주면 좋겠어요. 왜냐하면 (                         ) 때문이에요.")])
    ans = ("1차시  ① (생각 쓰기) ② 합계 83, 1반 큰 2 작은 2 · 2반 큰 2 작은 4 · 3반 큰 1 작은 7 · 4반 큰 2 "
           "③ 막대의 길이, 2반, %d개, 왜: 가장 긴 막대 — 막대가 길수록 많이 마셨기 때문 ④ ①, 가로와 세로가 나타내는 것, 눈금 한 칸이 나타내는 수 "
           "⑤ (예: 좋아하는 운동 / 막대 모양 그래프 — 가장 많은 것이 한눈에 보여서)" % (val(mb, '2반') - val(mb, '3반')))
    if D:
        w.step("⑥ 도전하기", "그림그래프 더 읽기")
        w.ask("큰 그림 1개와 작은 그림 7개는 우유 몇 개를 나타내나요?")
        w.ask("네 반이 오늘 마신 우유는 모두 몇 개인가요?")
        w.ask("3반이 우유를 3개 더 마셨다면 큰 그림은 몇 개가 되나요?")
        w.why("그림그래프보다 막대 모양 그래프로 견주기 쉬운 까닭을 써 보세요.")
        ans += " ⑥ 17개, %d개, 2개(20개), 왜: (예: 막대의 길이만 보면 되어서 큰 그림·작은 그림을 셈하지 않아도 돼요)" % sum(ST_MILK['vals'])
    return ans


def st_l2(w, D):
    g = ST['sport']
    w.lesson(2, "개념 구축하기(O)", "좋아하는 운동 기사 ― 막대그래프를 알아봐요", "조사한 자료의 수량을 막대 모양으로 나타내면 무엇이 편리할까요?",
             "기자단장 윤서가 우리 반 24명에게 좋아하는 운동을 물어 표로 정리했어요.")
    w.step("① 만져 보기 — 막대 세우기", "세로 눈금 한 칸 1명")
    w.table(dtable(g['cats'], g['vals'], '운동', '학생 수(명)'))
    w.ask("먼저 예상해요. 막대의 길이를 어떻게 정하면 좋을까요?", blank=False)
    if D:
        w.lines(1)
    else:
        w.fill("내 규칙: 학생 수가 (      )명이면 눈금 (      )칸만큼 세워요.")
    w.pic(bar_svg(g, bars=None), 100)
    w.step("② 그려 보기 — 막대를 가로로", "신문 칸이 옆으로 길어요")
    w.pic(bar_svg(V(g, horiz=True), bars=None), 115)
    w.step("③ 말해 보기 — 가로와 세로")
    w.pic(bar_svg(g), 95)
    w.choices([("그래프의 가로는?", "( 운동 / 학생 수 )"), ("그래프의 세로는?", "( 운동 / 학생 수 )")])
    w.ask("세로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("축구를 좋아하는 학생은 배드민턴보다 몇 명 더 많나요?")
    if D:
        w.why("세로 막대그래프와 가로 막대그래프는 무엇이 같고 무엇이 다를까요?")
    else:
        w.ask("왜 그럴까요? 두 그래프의 같은 점과 다른 점은?", blank=False)
        w.fill(["같은 점: 두 그래프 모두 막대의 (        )이 학생 수를 나타내요.",
                "다른 점: 운동과 학생 수가 놓인 (        )가 바뀌었어요."])
    w.step("④ 약속하기 — 막대그래프")
    if not D:
        w.wordbox(["막대", "막대그래프", "길이", "가로로도"])
    w.fill(["조사한 자료의 수량을 (        ) 모양으로 나타낸 그래프를 (              )라고 해요.",
            "막대그래프에서는 막대의 (        )에 따라 수량을 알 수 있어요. 막대는 세로로도 (          ) 나타낼 수 있어요."])
    w.step("⑤ 확인하기 — 표와 막대그래프")
    w.choices([("운동별 학생 수를 정확하게 알 수 있어요.", "( 표 / 막대그래프 )"),
               ("어느 운동이 더 인기 있는지 한눈에 비교할 수 있어요.", "( 표 / 막대그래프 )"),
               ("조사한 학생이 모두 몇 명인지 합계로 알 수 있어요.", "( 표 / 막대그래프 )"),
               ("가장 많은 운동과 가장 적은 운동을 한눈에 알 수 있어요.", "( 표 / 막대그래프 )")])
    ans = ("2차시  ① 예상: 학생 수만큼 눈금 칸을 세어 세워요(9명이면 9칸) / 막대 %s칸 ② 같은 길이의 가로 막대 ③ 운동, 학생 수, 1명, %d명, "
           "왜: 길이, 자리 ④ 막대, 막대그래프, 길이, 가로로도 ⑤ 표, 막대그래프, 표, 막대그래프"
           % ('·'.join(map(str, g['vals'])), val(g, '축구') - val(g, '배드민턴')))
    if D:
        s4 = ST['sport4']
        w.step("⑥ 도전하기", "태오가 그린 4학년 전체가 좋아하는 운동")
        w.pic(bar_svg(s4), 120)
        w.choices([("가로와 세로는?", "( 가로: 학생 수, 세로: 운동 / 가로: 운동, 세로: 학생 수 )")])
        w.ask("가로 눈금 한 칸은 몇 명을 나타내나요?")
        w.ask("피구를 좋아하는 학생은 몇 명인가요?")
        w.ask("축구를 좋아하는 학생은 줄넘기보다 몇 명 더 많나요?")
        w.why("‘피구 막대가 17칸이니 17명’이라는 말이 틀린 까닭을 써 보세요.", 1)
        ans += (" ⑥ 가로: 학생 수, 세로: 운동 / %d명 / %d명 / %d명 / 왜: 가로 눈금 한 칸이 2명이라 17칸은 34명"
                % (s4['step'], val(s4, '피구'), val(s4, '축구') - val(s4, '줄넘기')))
    return ans


def st_l3(w, D):
    m, lb = ST['meal'], ST['lib']
    w.lesson(3, "개념 구축하기(O)", "아침 식사 기사 ― 막대그래프를 읽어요", "막대그래프를 보고 어떤 내용을 알 수 있을까요?",
             "하린이가 보건 선생님께 4학년 학생 100명이 오늘 아침에 먹은 음식을 조사한 막대그래프를 받아 왔어요.")
    w.step("① 만져 보기 — 눈금 한 칸이 1이 아니에요")
    w.pic(bar_svg(m), 120)
    w.ask("먼저 예상해요. 눈금 한 칸이 몇 명인지 어떻게 알 수 있을까요?", blank=False)
    if D:
        w.lines(1)
    else:
        w.fill("내 규칙: 0부터 10까지 눈금 칸 수를 세어 (      )을/를 칸 수로 나누어요.")
    w.ask("세로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("아침에 밥을 먹은 학생은 몇 명인가요?" + ("  (도움: 밥 막대는 17칸)" if not D else ""))
    w.ask("아침을 먹지 않은 학생은 몇 명인가요?")
    w.step("② 그려 보기 — 많고 적음", "같은 그래프에서")
    w.ask("가장 많은 학생이 아침에 먹은 음식은?")
    w.ask("밥, 빵, 시리얼, 과일 가운데 먹은 학생이 가장 적은 음식은?")
    w.ask("‘시리얼’보다 더 많은 학생이 먹은 음식을 모두 써 보세요.")
    w.ask("빵을 먹은 학생은 과일을 먹은 학생보다 몇 명 더 많나요?")
    w.step("③ 말해 보기 — 가로 막대그래프 읽기", "민재가 도서관에서 받은 그래프")
    w.pic(bar_svg(lb), 130)
    w.ask("가로 눈금 한 칸은 몇 권을 나타내나요?")
    w.ask("3학년이 빌린 책은 몇 권인가요?")
    w.ask("5학년은 1학년보다 책을 몇 권 더 빌렸나요?")
    if D:
        w.why("가로 눈금 한 칸이 그 크기인 까닭을 써 보세요.", 1)
    else:
        w.ask("왜 그럴까요?", blank=False)
        w.fill("왜냐하면 0부터 100까지 눈금이 (      )칸이고, 100을 (      )로 나누면 (      )이기 때문이에요.")
    w.step("④ 약속하기 — 막대그래프 읽기")
    if D:
        w.fill(["막대그래프를 읽을 때는 먼저 가로와 세로가 무엇을 나타내는지 보고, 눈금 한 칸의 (        )도 확인해요.",
                "눈금 한 칸의 크기는 수가 쓰인 눈금의 수를 그 사이의 (          )로 나누어 구해요. 막대가 길수록 수량이 (        )."])
    else:
        w.fill(["막대그래프를 읽을 때는 가로와 세로를 보고, 눈금 한 칸의 ( 크기 / 색깔 )도 확인해요.",
                "눈금 한 칸의 크기는 수가 쓰인 눈금의 수를 그 사이의 ( 칸 수 / 막대 수 )로 나누어 구해요.",
                "막대가 길수록 수량이 ( 많아요 / 적어요 )."])
    w.step("⑤ 확인하기 — 차례대로", "책을 많이 빌린 학년부터")
    w.fill("(        ) → (        ) → (        ) → (        ) → (        ) → (        )")
    four = m['cats'][:4]
    least4 = min(four, key=lambda c: val(m, c))
    more = [c for c in four if val(m, c) > val(m, '시리얼')]
    ans = ("3차시  ① 예상: 0부터 10까지 5칸이라 10 ÷ 5 / %d명, %d명, %d명 ② %s, %s, %s, %d명 ③ %d권, %d권, %d권, 왜: 5, 5, 20 "
           "④ 크기, 칸 수, 많아요 ⑤ %s"
           % (m['step'], val(m, '밥'), val(m, '먹지 않음'), rank(m)[0], least4, '·'.join(more), val(m, '빵') - val(m, '과일'),
              lb['step'], val(lb, '3학년'), val(lb, '5학년') - val(lb, '1학년'), ' → '.join(rank(lb))))
    if D:
        w.step("⑥ 도전하기", "아침 식사 기사에 넣을 질문")
        w.ask("아침을 먹은 학생은 모두 몇 명인가요?")
        w.ask("아침을 먹지 않은 학생은 과일을 먹은 학생보다 몇 명 더 많나요?")
        w.ask("밥을 먹은 학생은 시리얼을 먹은 학생보다 몇 명 더 많나요?")
        ate = sum(val(m, c) for c in four)
        assert ate + val(m, '먹지 않음') == 100
        ans += (" ⑥ %d명(100 − 12), %d명, %d명"
                % (ate, val(m, '먹지 않음') - val(m, '과일'), val(m, '밥') - val(m, '시리얼')))
    return ans


def st_l4(w, D):
    g = ST['bike']
    w.lesson(4, "개념 구축하기(O)", "자전거 보관대 기사 ― 막대그래프로 나타내요", "표를 보고 막대그래프로 나타내려면 어떻게 해야 할까요?",
             "사진 기자 도현이가 토요일 아침에 우리 동네 보관대마다 세워진 자전거를 세어 표로 정리했어요.")
    w.step("① 만져 보기 — 표를 막대그래프로", "세로 눈금 한 칸 1대")
    w.table(dtable(g['cats'], g['vals'], '장소', '자전거 수(대)'))
    if not D:
        w.choices([("가로에 나타낼 것은?", "( 장소 / 자전거 수 )"), ("세로에 나타낼 것은?", "( 장소 / 자전거 수 )")])
    w.text("빈칸에 축 이름과 제목을 쓰고, 막대를 그려 보세요.")
    w.pic(bar_svg(g, bars=None, title=False, axes=False), 110)
    w.pick("제목으로 알맞은 것은?", ["좋아하는 장소", "장소별 보관대에 세워진 자전거 수", "우리 반 학생 수"])
    w.step("② 그려 보기 — 눈금 한 칸의 크기 정하기", "신문 칸이 좁아 세로 눈금이 8칸뿐이에요")
    g8 = V(g, cells=8, step=2)
    w.ask("먼저 예상해요. 눈금 한 칸을 몇 대로 하면 좋을까요?", blank=False)
    if D:
        w.lines(1)
    else:
        w.fill("내 규칙: 가장 큰 수 (      )대까지 나타내야 하니 한 칸을 ( 1대 / 2대 / 5대 )로 해요.")
    w.text("눈금에 수를 쓰고 막대를 다시 그려 보세요.")
    w.pic(bar_svg(g8, bars=None, ticks='zero'), 100)
    w.step("③ 말해 보기 — 막대를 가로로", "가로 눈금 한 칸 1대")
    w.pic(bar_svg(V(g, horiz=True), bars=None), 125)
    w.step("④ 약속하기 — 막대그래프로 나타내는 방법")
    if not D:
        w.wordbox(["가장 큰 수", "눈금 한 칸의 크기", "막대", "제목"])
    w.fill(["① 표를 보고 가로와 세로에 무엇을 나타낼지 정해요.",
            "② (            )까지 나타낼 수 있도록 (                )를 정해요.",
            "③ 조사한 자료의 수에 맞게 (        ) 모양으로 나타내요.  ④ 알맞은 (        )을 써요."])
    d = ST['bikeDay']
    w.step("⑤ 확인하기 — 스스로 정하기", "요일별 학교 앞 보관대의 자전거 수")
    w.table(dtable(d['cats'], d['vals'], '요일', '자전거 수(대)'))
    if not D:
        w.fill("가장 큰 수는 (      )대예요. 아래 모눈은 6칸이니 한 칸을 ( 2대 / 5대 / 1대 )로 정해요.")
    else:
        w.fill("아래 모눈은 6칸이에요. 눈금 한 칸은 (      )대로 정했어요.")
    w.pic(bar_svg(d, bars=None, ticks='zero'), 125)
    if D:
        w.why("눈금 한 칸을 2대로 정할 수 없는 까닭을 써 보세요.", 1)
    ans = ("4차시  ① 가로: 장소, 세로: 자전거 수(대), 막대 %s칸, 제목 ②(장소별 보관대에 세워진 자전거 수) ② 예상: 가장 큰 수 14대, 2대 → 0·2·4…16, 막대 %s칸 "
           "③ 가로 막대 %s칸 ④ 가장 큰 수, 눈금 한 칸의 크기, 막대, 제목 ⑤ 30대, 5대 → 0·5·10…30, 막대 %s칸"
           % ('·'.join(map(str, g['vals'])), '·'.join(map(str, cells_of(g8))), '·'.join(map(str, g['vals'])),
              '·'.join(map(str, cells_of(d)))))
    if D:
        r = ST['rack']
        w.step("⑥ 도전하기", "보관대마다 자전거를 세울 수 있는 자리 수 ― 가로 눈금 6칸")
        w.table(dtable(r['cats'], r['vals'], '장소', '자리 수(자리)'))
        w.choices([("가로 눈금 한 칸의 크기는?", "( 5자리 / 10자리 / 20자리 )")])
        w.pic(bar_svg(r, bars=None, ticks='zero'), 125)
        ans += (" / 왜: 15·25가 2로 나누어떨어지지 않아 칸에 꼭 맞지 않아요 ⑥ 10자리, 막대 %s칸"
                % '·'.join(map(str, cells_of(r))))
    return ans


def st_l5(w, D):
    b = ST['book']
    w.lesson(5, "개념 구축하기(O)", "무엇을 어떻게 조사할까? ― 조사하여 표로 정리해요",
             "우리 반 친구들이 빌리고 싶은 책을 어떻게 조사하고 정리할까요?",
             "학교 도서관에서 새 책을 사려고 해요. 기자단은 ‘우리 반 친구들은 어떤 종류의 책을 빌리고 싶어 할까?’를 조사하기로 했어요.")
    w.step("① 만져 보기 — 조사 방법 정하기")
    w.text("조사하는 방법으로 알맞으면 ○, 알맞지 않으면 ×에 표시해 보세요.")
    w.choices(OX(["직접 손 들기", "스티커 붙이기", "설문지(종이·태블릿)에 표시하기", "친구들에게 묻지 않고 짐작하기"]))
    w.pick("조사하기에 알맞은 질문은?", ["우리 반 친구들은 어떤 종류의 책을 빌리고 싶어 할까?", "나는 어떤 책을 빌리고 싶을까?"])
    if D:
        w.why("짐작한 것으로 기사를 쓰면 안 되는 까닭은 무엇일까요?", 1)
    else:
        w.ask("왜 그럴까요?", blank=False)
        w.fill("짐작한 것은 친구들에게 (            ) 자료가 아니어서 실제와 (          ) 수 있기 때문이에요.")
    w.step("② 그려 보기 — 조사 항목 정하기")
    w.pick("항목 묶음으로 알맞은 것은?", ["동화책, 만화책, 과학책, 역사책", "동화책, 재미있는 책, 만화책, 두꺼운 책"])
    w.choices([("한 친구는 스티커를 몇 장 붙이기로 정해야 할까요?", "( 한 장 / 붙이고 싶은 만큼 )")])
    w.step("③ 말해 보기 — 스티커로 조사하기", "우리 반 24명의 스티커 판")
    w.pic(sticker_svg(b['cats'], ST_SEQ, ST_NAMES, '빌리고 싶은 책'), 150)
    w.table(dtable(b['cats'], b['vals'], '책 종류', '학생 수(명)', blanks=(0, 1, 2, 3, 'sum')))
    w.step("④ 약속하기 — 조사하는 차례")
    if not D:
        w.wordbox(["겹치지 않는", "직접 물어", "표", "같은지"])
    w.fill(["① 알고 싶은 것을 정해요. ② 서로 (            ) 항목과 조사 방법을 정해요.",
            "③ 친구들에게 (          ) 자료를 모아요. ④ 모은 자료를 (      )에 정리하고, 합계가 조사한 사람 수와 (        ) 확인해요."])
    t3 = [8, 10, 5, 3]
    w.step("⑤ 확인하기 — 다른 반 기록 정리하기", "옆 반(4학년 3반) 손 들기 기록")
    w.text("빨간 사선이 있는 묶음 하나가 5명이에요. 세어서 표를 완성해 보세요.")
    w.pic(tally_svg(b['cats'], t3, '4학년 3반 손 들기 기록'), 115)
    w.table(dtable(b['cats'], t3, '책 종류', '학생 수(명)', blanks=(0, 1, 2, 3, 'sum')))
    ans = ("5차시  ① ○, ○, ○, ×, ①, 왜: 직접 물어본, 다를 ② ①, 한 장 ③ %s, 합계 %d ④ 겹치지 않는, 직접 물어, 표, 같은지 ⑤ %s, 합계 %d"
           % (', '.join('%s %d' % t for t in zip(b['cats'], b['vals'])), sum(b['vals']),
              ', '.join('%s %d' % t for t in zip(b['cats'], t3)), sum(t3)))
    if D:
        w.step("⑥ 도전하기", "4학년 1반의 조사 표 (1반 학생은 모두 25명)")
        w.table([["책 종류", "동화책", "만화책", "과학책", "역사책", "합계"], ["학생 수(명)", "7", "□", "6", "5", "25"]])
        w.ask("만화책을 빌리고 싶은 학생은 몇 명인가요?")
        w.ask("1반에서 가장 적은 학생이 빌리고 싶은 책은?")
        w.ask("우리 반(2반)과 1반 모두에서 가장 적은 학생이 고른 책은?")
        w.why("합계를 이용해 빈칸을 구한 방법을 써 보세요.", 1)
        ans += " ⑥ 7명(25 − 7 − 6 − 5), 역사책, 역사책, 왜: 합계 25에서 나머지 수를 모두 빼요"
    return ans


def st_l6(w, D):
    b, b1 = ST['book'], ST['book1']
    w.lesson(6, "탐구 정리하기(O)", "조사 결과를 막대그래프로 ― 공학 도구도 써 봐요", "조사한 자료를 막대그래프로 나타내면 무엇을 알 수 있을까요?",
             "지난 시간에 우리 반 24명이 빌리고 싶은 책을 조사해 표로 정리했어요.")
    w.step("① 만져 보기 — 우리 반 막대그래프", "가로·세로, 눈금, 제목을 스스로 정하기")
    w.table(dtable(b['cats'], b['vals'], '책 종류', '학생 수(명)'))
    if not D:
        w.choices([("가로에 나타낼 것은?", "( 책 종류 / 학생 수 )"), ("세로 눈금 한 칸의 크기는?", "( 2명 / 1명 / 5명 )")])
        w.pick("제목으로 알맞은 것은?", ["우리 반 학생 수", "빌리고 싶은 책 종류별 학생 수", "도서관에 있는 책"])
    else:
        w.text("축 이름, 눈금의 수, 막대 이름, 제목을 모두 써서 막대그래프를 완성해 보세요.")
    w.pic(bar_svg(b, bars=None, ticks='zero', axes=False, title=False, names=[None] * 4), 110)
    w.step("② 그려 보기 — 공학 도구로", "태오가 가져온 태블릿 그래프 도구")
    w.fill(["표에 넣을 수: 동화책 (    ), 만화책 (    ), 과학책 (    ), 역사책 (    )",
            "간격(눈금 한 칸의 크기)을 1로 하면 만화책 막대는 (      )칸이에요.",
            "가로형으로 바꾸면 막대가 ( 가로 / 세로 )로 그려지고, 나타내는 자료는 ( 같아요 / 달라져요 )."])
    w.step("③ 말해 보기 — 두 반 견주기")
    w.pic(pair_svg([("4학년 2반(우리 반)", bar_svg(b)), ("4학년 1반", bar_svg(b1))]), 165)
    w.ask("우리 반에서 가장 많은 학생이 빌리고 싶은 책은?")
    w.ask("1반에서 빌리고 싶은 학생 수가 같은 책을 모두 써 보세요.")
    w.ask("우리 반에서 만화책을 빌리고 싶은 학생은 역사책보다 몇 명 더 많나요?")
    w.ask("두 반 모두 가장 적은 학생이 빌리고 싶은 책은?")
    if D:
        w.why("같은 질문으로 조사했는데 두 반의 결과가 다른 까닭은 무엇일까요?", 1)
    else:
        w.ask("왜 그럴까요?", blank=False)
        w.fill("조사한 (          )이 달라서 빌리고 싶은 책도 반마다 다르기 때문이에요.")
    w.step("④ 약속하기 — 그래프로 결정하기", "새 책을 한 종류만 부탁한다면")
    if D:
        w.fill(["우리 반에서는 (          )을 빌리고 싶은 학생이 (    )명으로 가장 많아요.",
                "그래서 새 책으로 (          )을 부탁하면 좋겠어요. 결정할 때는 막대그래프에서 알 수 있는 (      )을 근거로 들어요."])
    else:
        w.fill(["우리 반에서는 ( 만화책 / 역사책 / 과학책 )을 빌리고 싶은 학생이 9명으로 가장 많아요.",
                "그래서 새 책으로 ( 만화책 / 역사책 )을 부탁하면 좋겠어요.",
                "결정할 때는 막대그래프에서 알 수 있는 ( 사실 / 짐작 )을 근거로 들어요."])
    w.step("⑤ 확인하기 — 기사 쓰기")
    w.labeled([("기사 제목", ""), ("기사 내용", ("막대그래프에서 알 수 있는 사실 두 가지:" if D else
                                          "(        )을 빌리고 싶은 학생이 (    )명으로 가장 많고, (        )은 (    )명으로 가장 적어요."))],
              row_h=5600)
    same1 = [c for c in b1['cats'] if b1['vals'].count(val(b1, c)) > 1]
    ans = ("6차시  ① 가로: 책 종류, 세로: 학생 수(명), 한 칸 1명, 막대 %s칸, 제목: 빌리고 싶은 책 종류별 학생 수 ② %s, %d칸, 가로, 같아요 "
           "③ %s, %s, %d명, %s, 왜: 친구들 ④ 만화책(9명), 만화책, 사실 ⑤ (예: 우리 반 친구들이 가장 빌리고 싶은 책은 만화책! / 만화책 9명 가장 많고, 역사책 4명 가장 적어요)"
           % ('·'.join(map(str, b['vals'])), ', '.join(map(str, b['vals'])), val(b, '만화책'), rank(b)[0], '·'.join(same1),
              val(b, '만화책') - val(b, '역사책'), rank(b)[-1]))
    assert rank(b1)[-1] == rank(b)[-1] == '역사책'
    if D:
        lu = ST['lunch']
        w.step("⑥ 도전하기", "급식 기사 ― 많이 먹고 싶어 하는 메뉴부터 위에서 차례대로")
        w.table(dtable(["카레", "잔치국수", "짜장면", "비빔밥"], [7, 2, 11, 4], '메뉴', '학생 수(명)'))
        w.text("막대 이름을 위에서부터 차례대로 쓰고, 가로 눈금 한 칸을 1명으로 하여 막대를 그려 보세요.")
        w.pic(bar_svg(lu, bars=None, names=[None] * 4), 125)
        ans += " ⑥ 위에서부터 %s" % ', '.join('%s %d칸' % (c, val(lu, c)) for c in rank(lu))
    return ans


def st_l7(w, D):
    rn, bm, tw = ST['rain'], ST['bikeMon'], ST['town']
    w.lesson(7, "탐구 정리하기(O)", "그래프로 기사를 써요 ― 사실과 의견", "막대그래프에서 찾은 사실로 어떻게 기사를 쓸 수 있을까요?",
             "도현이는 4월부터 7월까지 날마다 아침에 학교 앞 보관대의 자전거를 세어 달마다 모두 더했어요.")
    w.step("① 만져 보기 — 두 막대그래프 견주기", "비 온 날수와 자전거 수")
    w.pic(pair_svg([(None, bar_svg(rn)), (None, bar_svg(bm))]), 178)
    w.ask("비 온 날이 가장 많은 달은?")
    w.ask("보관대에 세워진 자전거가 가장 많은 달은?")
    w.ask("6월에 보관대에 세워진 자전거는 몇 대인가요?" + ("  (도움: 세로 눈금 한 칸은 20대)" if not D else ""))
    w.pick("두 그래프를 보고 알 수 있는 관계는?", ["비 온 날이 많은 달일수록 보관대의 자전거 수가 적어요.", "비 온 날이 많은 달일수록 보관대의 자전거 수가 많아요."])
    if D:
        w.why("비 온 날이 많은 달에 자전거가 적은 까닭을 생각해 써 보세요.", 1)
    else:
        w.ask("왜 그럴까요?", blank=False)
        w.fill("비가 오는 날에는 (                    ) 때문에 자전거를 (              ) 것 같아요.")
    w.step("② 그려 보기 — 기사 글 완성하기", "4학년 120명이 ‘우리 동네에서 고치고 싶은 것’")
    w.pic(bar_svg(tw), 140)
    assert sum(tw['vals']) == 120
    if not D:
        w.fill(["가장 고치고 싶은 것은 ( 보관대 부족 / 쓰레기 / 위험한 길 )이고, 가장 적은 학생이 고른 것은 ( 낡은 놀이터 / 쓰레기 / 어두운 길 )입니다.",
                "두 번째로 많은 학생이 고른 것은 (            )이고 (      )명입니다."])
    else:
        w.fill(["가장 고치고 싶은 것은 (            )이고, 가장 적은 학생이 고른 것은 (            )입니다.",
                "두 번째로 많은 학생이 고른 것은 (            )이고 (      )명입니다."])
    w.step("③ 말해 보기 — 사실과 의견 나누기")
    w.choices([("보관대 부족을 고른 학생이 36명으로 가장 많아요.", "( 사실 / 의견 )"),
               ("동네에 자전거 보관대를 더 만들면 좋겠어요.", "( 사실 / 의견 )"),
               ("낡은 놀이터를 고른 학생 수는 쓰레기의 2배예요.", "( 사실 / 의견 )"),
               ("어두운 길을 고른 학생은 18명이에요.", "( 사실 / 의견 )"),
               ("위험한 길에는 어른들이 함께 다녀야 해요.", "( 사실 / 의견 )")])
    assert val(tw, '낡은 놀이터') == 2 * val(tw, '쓰레기') and val(tw, '어두운 길') == 18 and rank(tw)[0] == '보관대 부족'
    w.step("④ 약속하기 — 사실과 의견")
    if not D:
        w.wordbox(["사실", "의견"])
    w.fill(["막대그래프의 수나 막대의 길이로 확인할 수 있는 것은 (      )이에요.",
            "사실을 보고 ‘~하면 좋겠어요’처럼 든 생각은 (      )이에요. 기사에 의견을 쓸 때는 그래프에서 찾은 (      )을 근거로 들어요."])
    w.step("⑤ 확인하기 — 내 기사 쓰기")
    w.labeled([("사실", "" if D else "(            )을 고른 학생이 (      )명으로 가장 많아요."),
               ("의견", "" if D else "그래서 (                                   )하면 좋겠어요.")], row_h=5600)
    rt = rank(tw)
    ans = ("7차시  ① %s, %s, %d대, ①, 왜: (예: 비가 오면 미끄럽고 위험해서 걸어오거나 차를 타고 오기 때문) ② %s, %s, %s, %d "
           "③ 사실, 의견, 사실, 사실, 의견 ④ 사실, 의견, 사실 ⑤ (예: 보관대 부족 36명 가장 많음 → 자전거 보관대를 더 만들면 좋겠어요)"
           % (rank(rn)[0], rank(bm)[0], val(bm, '6월'), rt[0], rt[-1], rt[1], val(tw, rt[1])))
    if D:
        w.step("⑥ 도전하기", "‘우리 동네에서 고치고 싶은 것’ 더 읽기")
        w.ask("보관대 부족을 고른 학생 수는 쓰레기의 몇 배인가요?")
        w.ask("위험한 길을 고른 학생은 어두운 길보다 몇 명 더 많나요?")
        w.ask("낡은 놀이터와 어두운 길을 고른 학생은 모두 몇 명인가요?")
        ans += (" ⑥ %d배, %d명, %d명"
                % (val(tw, '보관대 부족') // val(tw, '쓰레기'), val(tw, '위험한 길') - val(tw, '어두운 길'),
                   val(tw, '낡은 놀이터') + val(tw, '어두운 길')))
    return ans


def st_l8(w, D):
    p = ST['place']
    k1 = [dict(kind="bike", name="자전거 보관대", n=9), dict(kind="park", name="공원", n=5), dict(kind="hospital", name="병원", n=4),
          dict(kind="library", name="도서관", n=3), dict(kind="school", name="학교", n=2)]
    assert [k['n'] for k in k1] == p['vals']
    w.lesson(8, "탐구 정리하기(O)", "생각을 더하다 ― 우리 동네 지도 기사",
             "지도 속 자료를 막대그래프로 나타내면 우리 동네를 어떻게 소개할 수 있을까요?",
             "기자단이 우리 동네 지도를 만들었어요. 지도 속 장소를 세어 동네 소개 기사를 써요.")
    w.step("① 만져 보기 — 지도 기호 세기")
    w.text("한 가지 기호씩 차례로 세고, 센 기호에는 ／ 표시를 해 보세요.")
    w.pic(map_svg(k1, 17, '우리 동네 지도'), 140)
    w.table(dtable(p['cats'], p['vals'], '장소', '수(개)', blanks=(0, 1, 2, 3, 4, 'sum')))
    w.step("② 그려 보기 — 막대그래프로", "세로 눈금 한 칸 1개")
    w.pic(bar_svg(p, bars=None, title=False), 125)
    w.pick("제목으로 알맞은 것은?", ["우리 반 학생 수", "장소별 수", "좋아하는 장소"])
    w.step("③ 말해 보기 — 표와 그래프 중에서", "기사에 하나만 싣는다면")
    w.choices([("어떤 장소가 많은지 한눈에 보여 주려면?", "( 막대그래프 / 표 )"),
               ("모든 장소의 수를 합한 수를 알려 주려면?", "( 막대그래프 / 표 )")])
    if D:
        w.why("동네 소개 기사에 막대그래프를 고른 까닭을 써 보세요.", 1)
    else:
        w.ask("왜 그럴까요?", blank=False)
        w.fill("막대그래프는 어떤 장소가 많고 적은지 막대의 (        )로 한눈에 볼 수 있기 때문이에요.")
    w.step("④ 약속하기 — 소개 기사 완성하기")
    if not D:
        w.wordbox(["자전거 보관대", "공원", "3", "학교"])
    w.fill(["우리 동네에서 가장 많은 곳은 (              )입니다. 두 번째로 많은 곳은 (          )입니다.",
            "책을 읽을 수 있는 도서관은 (      )개 있습니다. 가장 적은 곳은 (          )입니다."])
    w.step("⑤ 확인하기 — 제안 기사 쓰기")
    w.labeled([("사실", "" if D else "우리 동네에는 (          )이/가 (      )개로 가장 적어요."),
               ("제안", "" if D else "(          )이/가 (      )개뿐이므로 (                    )을/를 더 만들면 좋겠어요.")], row_h=5600)
    r = rank(p)
    ans = ("8차시  ① %s, 합계 %d ② 막대 %s칸, 장소별 수 ③ 막대그래프, 표, 왜: 길이 ④ %s, %s, %d, %s "
           "⑤ (예: 학교가 2개로 가장 적어요 / 도서관이 3개뿐이므로 작은 도서관을 더 만들면 좋겠어요)"
           % (', '.join('%s %d' % t for t in zip(p['cats'], p['vals'])), sum(p['vals']), '·'.join(map(str, p['vals'])),
              r[0], r[1], val(p, '도서관'), r[-1]))
    if D:
        k2 = [dict(kind="bike", name="자전거 보관대", n=3), dict(kind="park", name="공원", n=6), dict(kind="hospital", name="병원", n=2),
              dict(kind="library", name="도서관", n=4), dict(kind="school", name="학교", n=3)]
        w.step("⑥ 도전하기", "옆 동네 지도")
        w.pic(map_svg(k2, 41, '옆 동네 지도'), 135)
        w.table(dtable([k['name'] for k in k2], [k['n'] for k in k2], '장소', '수(개)', blanks=(0, 1, 2, 3, 4, 'sum')))
        w.why("우리 동네와 옆 동네를 견주어 알 수 있는 점을 써 보세요.", 1)
        ans += (" ⑥ %s, 합계 %d, 왜: (예: 우리 동네는 자전거 보관대가, 옆 동네는 공원이 가장 많아요)"
                % (', '.join('%s %d' % (k['name'], k['n']) for k in k2), sum(k['n'] for k in k2)))
    return ans


def st_l9(w, D):
    b, b2 = ST['bal'], ST['bal2']
    w.lesson(9, "발표하기(P)", "놀이를 더하다 ― 체육 시간 풍선 기록 기사", "놀이 기록을 막대그래프로 나타내면 무엇을 알 수 있을까요?",
             "체육 시간에 모둠별로 풍선 띄우기 놀이를 했어요. 손바닥, 머리, 어깨, 무릎의 순서대로 풍선을 띄우고 횟수를 세요.")
    w.step("① 만져 보기 — 풍선 띄우기 놀이", "우리 모둠 기록")
    w.table([["신체 부위", "손바닥", "머리", "어깨", "무릎", "합계"], ["횟수(회)", "", "", "", "", ""]])
    w.step("② 그려 보기 — 표로 정리하기", "태오네 모둠이 다섯 개씩 묶어 센 기록")
    w.text("빨간 사선이 있는 묶음 하나가 5회예요. 세어서 표를 완성해 보세요.")
    w.pic(tally_svg(b['cats'], b['vals'], '태오네 모둠의 기록'), 120)
    w.table(dtable(b['cats'], b['vals'], '신체 부위', '횟수(회)', blanks=(0, 1, 2, 3, 'sum')))
    w.step("③ 말해 보기 — 막대그래프로 나타내기", "세로 눈금 12칸")
    if not D:
        w.fill("가장 큰 수는 (      )회예요. 12칸으로 나타내려면 눈금 한 칸을 ( 1회 / 2회 / 5회 )로 정해요.")
    else:
        w.choices([("세로 눈금 한 칸의 크기는?", "( 1회 / 2회 / 5회 )")])
    w.pic(bar_svg(b, bars=None, ticks='zero', title=False), 105)
    w.pick("제목으로 알맞은 것은?", ["신체 부위별 풍선을 띄운 횟수", "우리 모둠 친구 이름", "좋아하는 풍선 색깔"])
    w.step("④ 약속하기 — 다른 모둠과 견주기", "두 그래프의 눈금 한 칸은 모두 2회")
    w.pic(pair_svg([("태오네 모둠", bar_svg(b)), ("서아네 모둠", bar_svg(b2))]), 165)
    w.choices([("머리로 풍선을 더 많이 띄운 모둠은?", "( 태오네 모둠 / 서아네 모둠 )")])
    w.ask("손바닥으로 띄운 횟수는 두 모둠이 몇 회 차이 나나요?")
    w.ask("서아네 모둠이 가장 많이 띄운 신체 부위는?")
    w.pick("두 막대그래프를 보고 알 수 있는 사실은?", ["두 모둠 모두 어깨로 가장 적게 띄웠어요.", "두 모둠 모두 손바닥으로 가장 많이 띄웠어요."])
    assert rank(b)[-1] == rank(b2)[-1] == '어깨'
    w.step("⑤ 확인하기 — 체육 기사 발표하기")
    w.labeled([("사실", "" if D else "태오네 모둠은 (        )으로 (    )회, 서아네 모둠은 (        )로 (    )회 띄워 가장 많았어요."),
               ("의견", "" if D else "두 모둠 모두 (        )로 가장 적게 띄웠으므로 (                         )하면 좋겠어요.")], row_h=5600)
    ans = ("9차시  ① (모둠 기록) ② %s, 합계 %d ③ 24회, 2회 → 0·2·4…24, 막대 %s칸, ① ④ %s, %d회, %s, ① "
           "⑤ (예: 태오네 손바닥 24회, 서아네 머리 20회 / 어깨로 띄우는 연습을 더 하면 좋겠어요)"
           % (', '.join('%s %d' % t for t in zip(b['cats'], b['vals'])), sum(b['vals']), '·'.join(map(str, cells_of(b))),
              '서아네 모둠' if val(b2, '머리') > val(b, '머리') else '태오네 모둠', abs(val(b, '손바닥') - val(b2, '손바닥')), rank(b2)[0]))
    if D:
        bl = ST['ball']
        w.step("⑥ 도전하기", "책으로 공 띄우기 ― 세로 눈금 15칸")
        w.table(dtable(bl['cats'], bl['vals'], '공의 종류', '횟수(회)'))
        w.choices([("세로 눈금 한 칸의 크기는?", "( 1회 / 2회 / 5회 / 10회 )")])
        w.pic(bar_svg(bl, bars=None, ticks='zero'), 110)
        w.why("그 크기로 정한 까닭을 써 보세요.", 1)
        ans += (" ⑥ 2회, 막대 %s칸, 왜: 가장 큰 수 30회를 15칸에 나타내려면 한 칸이 2회여야 하고, 모든 수가 짝수예요"
                % '·'.join(map(str, cells_of(bl))))
    return ans


def st_l10(w, D):
    af, cn = ST['after'], ST['corner']
    w.lesson(10, "발표하기(P)", "학급 신문을 펴내요 ― 공부한 내용 확인", "막대그래프를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
             "학급 신문 「햇살 4-2 소식」 마지막 호를 만들어요.")
    w.step("① 만져 보기 — 방과 후 수업 기사")
    w.pic(bar_svg(af), 110)
    w.choices([("가로와 세로는?", "( 가로: 수업, 세로: 학생 수 / 가로: 학생 수, 세로: 수업 )")])
    w.ask("세로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("요리 수업을 신청한 학생은 몇 명인가요?")
    w.step("② 그려 보기 — 옳은 설명 찾기")
    w.choices([("신청한 학생 수가 가장 적은 수업은 바둑입니다.", "( ○ / × )"),
               ("댄스 수업을 신청한 학생은 7명입니다.", "( ○ / × )"),
               ("요리 수업을 신청한 학생은 로봇 수업보다 6명 더 많습니다.", "( ○ / × )")])
    assert rank(af)[-1] == '바둑' and val(af, '요리') - val(af, '로봇') == 6
    w.step("③ 말해 보기 — 표와 막대그래프 완성하기", "독자 설문 ‘읽고 싶은 신문 코너’(24명)")
    tc, tv = ["만화", "운동 소식", "급식 소식", "퀴즈", "인터뷰"], [7, 5, 4, 6, 2]
    assert sum(tv) == 24 and 24 - 7 - 5 - 4 - 2 == 6
    w.table(dtable(tc, tv, '코너', '학생 수(명)', blanks=(3,)))
    w.text("표의 빈칸을 채우고, 축 이름과 빈 막대 이름을 쓴 뒤 운동 소식·인터뷰의 막대를 그려 보세요.")
    w.pic(bar_svg(cn, lock={1, 2, 3}, names=["운동 소식", None, None, "퀴즈", "인터뷰"], axes=False), 130)
    w.step("④ 약속하기 — 신문 배달 미로", "옳으면 ‘옳음’ 길, 옳지 않으면 ‘틀림’ 길")
    st = [("막대그래프의 세로에 나타낸 것은 학생 수입니다.", False), ("가로 눈금 한 칸은 1명을 나타냅니다.", True),
          ("가장 많은 학생이 읽고 싶어 하는 코너는 만화입니다.", True), ("인터뷰를 읽고 싶어 하는 학생은 4명입니다.", False)]
    assert rank(cn)[0] == '만화' and val(cn, '인터뷰') == 2
    w.choices([("%d. %s" % (i + 1, t), "( ○ / × )") for i, (t, _) in enumerate(st)])
    key = ' '.join('○' if a else '×' for _, a in st)
    opts = [("○ ○ ○ ×", "보건실"), ("× × ○ ×", "급식실"), (key, "교장실"), ("× ○ ○ ○", "도서관")]
    assert len({o[0] for o in opts}) == 4
    w.table([["○× 차례"] + [o[0] for o in opts], ["배달할 곳"] + [o[1] for o in opts]])
    w.ask("신문을 배달할 곳은?")
    w.step("⑤ 확인하기 — 예전 생각, 지금 생각", "1차시에 궁금했던 것을 떠올리며")
    write3(w, D, [("예전 생각", "예전에는 (                    )라고 생각했어요.", "막대그래프를 배우기 전의 생각"),
                  ("지금 생각", "지금은 (                    )라고 생각해요.", "배운 뒤에 바뀐 생각"),
                  ("왜 바뀌었나", "(                    )을 해 보고 바뀌었어요.", "어떤 활동 때문에 바뀌었나요?")])
    ans = ("10차시  ① 가로: 수업, 세로: 학생 수 / %d명 / %d명 ② ○, ×(14명), ○ ③ 퀴즈 6, 합계 24 / 세로: 코너, 가로: 학생 수(명) / "
           "빈 막대 이름 위에서부터 급식 소식(4칸), 만화(7칸) / 운동 소식 5칸, 인터뷰 2칸 ④ ×, ○, ○, × → 교장실 ⑤ (생각 쓰기 — 예: 예전엔 눈금 한 칸은 언제나 1, 지금은 눈금 한 칸의 크기를 먼저 확인)"
           % (af['step'], val(af, '요리')))
    if D:
        w.step("⑥ 도전하기", "마인드맵 ― ‘막대그래프’를 정리해요")
        w.labeled([("떠오르는 말", "(가로, 세로, 눈금 …)\n"), ("묶어 보기", "(읽을 때 / 그릴 때)\n"),
                   ("이어지는 말", "(가장 큰 수와 눈금 한 칸의 크기 …)\n"), ("덧붙이는 말", "(예를 들면 …)\n")], row_h=5600)
        w.text("★ 선택 문제 — 방과 후 수업 막대그래프로 마지막 기사 질문에 답해 보세요.")
        w.pick("새 방과 후 수업을 한 반 더 연다면?", ["요리 ― 신청한 학생이 24명으로 가장 많기 때문이에요.", "바둑 ― 이름이 가장 짧기 때문이에요."])
        w.ask("요리 수업을 신청한 학생은 바둑 수업보다 몇 명 더 많나요?")
        w.ask("네 수업을 신청한 학생은 모두 몇 명인가요?")
        ans += (" ⑥ (마인드맵 — 예: 읽을 때: 가로·세로·눈금 한 칸의 크기 / 그릴 때: 축 정하기·눈금 정하기·막대·제목) ★ ①, %d명, %d명"
                % (val(af, '요리') - val(af, '바둑'), sum(af['vals'])))
    return ans


# ================================================================ 만들기
TB_LESSONS = [tb_l1, tb_l2, tb_l3, tb_l4, tb_l56, tb_l7, tb_l8, tb_l9, tb_l10]
ST_LESSONS = [st_l1, st_l2, st_l3, st_l4, st_l5, st_l6, st_l7, st_l8, st_l9, st_l10]


# ================================================================ 도전형 (①~⑤를 기본형과 다른 문제로, ⑥ 도전하기는 그대로)
H = dict(
    milk=dict(title="반별 분리배출한 페트병 수", head="반", cats=["1반", "2반", "3반", "4반"], vals=[36, 48, 24, 52], unit="개"),
    milkBar=G("반별 분리배출한 페트병 수", ["1반", "2반", "3반", "4반"], [36, 48, 24, 52], "개", "반", "페트병 수", 4, 14, every=2),
    cloth=G("학급별 모은 헌 옷의 수", ["1반", "2반", "3반", "4반"], [8, 11, 6, 9], "벌", "학급", "헌 옷의 수", 1, 12),
    save=G("실천하고 싶은 에너지 절약 활동별 학생 수", ["전등 끄기", "플러그 뽑기", "계단 이용하기", "냉장고 문 빨리 닫기"], [17, 12, 9, 14], "명", "활동", "학생 수", 1, 18),
    flw=G("기르고 싶어 하는 꽃별 학생 수", ["해바라기", "튤립", "장미", "코스모스", "국화"], [70, 120, 90, 40, 60], "명", "꽃", "학생 수", 10, 13, True),
    bag=G("일주일 동안 버린 종류별 쓰레기 봉투 수", ["종이", "플라스틱", "비닐", "캔"], [14, 10, 8, 4], "개", "종류", "봉투 수", 1, 15),
    season=G("좋아하는 계절별 학생 수", ["봄", "여름", "가을", "겨울"], [10, 6, 8, 4], "명", "계절", "학생 수", 1, 10),
    camp=G("하고 싶어 하는 환경 캠페인별 학생 수", ["포스터 그리기", "줍깅하기", "물건 나눔 장터", "나무 심기"], [4, 7, 6, 4], "명", "캠페인", "학생 수", 1, 10),
    bike=G("연도별 우리 시 공공 자전거 이용자 수", ["2017년", "2018년", "2019년", "2020년"], [20, 35, 45, 60], "만 명", "연도", "이용자 수", 5, 13),
    dust=G("연도별 우리 시 미세 먼지 나쁨 일수", ["2017년", "2018년", "2019년", "2020년"], [48, 42, 36, 30], "일", "연도", "나쁨 일수", 2, 25),
    fac=G("바라는 학교 시설별 학생 수", ["도서관 넓히기", "운동장 그늘막", "화장실 고치기", "놀이 기구", "쉼터"], [70, 50, 80, 30, 40], "명", "시설", "학생 수", 10, 10),
    gym=G("요일별 체육관 이용자 수", ["월요일", "화요일", "수요일", "목요일", "금요일"], [50, 70, 50, 90, 30], "명", "요일", "이용자 수", 10, 10),
    place1=G("장소별 수", ["학교", "경찰서", "도서관", "산", "폭포"], [9, 4, 6, 5, 1], "개", "장소", "수", 1, 10),
    bal=G("신체 부위별 풍선을 띄운 횟수", ["머리", "어깨", "무릎", "발"], [12, 8, 24, 16], "회", "신체 부위", "횟수", 2, 12),
    bal2=G("신체 부위별 풍선을 띄운 횟수", ["머리", "어깨", "무릎", "발"], [16, 14, 20, 18], "회", "신체 부위", "횟수", 2, 12),
    cls=G("수업별 신청한 학생 수", ["미술", "농구", "요리", "바둑"], [18, 12, 24, 8], "명", "수업", "학생 수", 2, 12),
    trip=G("가고 싶어 하는 체험 장소별 학생 수", ["과학관", "수목원", "동물원", "미술관", "천문대"], [16, 11, 20, 9, 16], "명", "체험 장소", "학생 수", 1, 22, True),
    # 이야기 버전
    juice=dict(title="반별 오늘 마신 주스 수", head="반", cats=["1반", "2반", "3반", "4반"], vals=[30, 26, 18, 34], unit="개"),
    juiceBar=G("반별 오늘 마신 주스 수", ["1반", "2반", "3반", "4반"], [30, 26, 18, 34], "개", "반", "주스 수", 2, 18),
    snack=G("좋아하는 간식별 학생 수", ["떡볶이", "과일", "과자", "빵"], [8, 5, 7, 4], "명", "간식", "학생 수", 1, 10),
    way=G("등교할 때 이용하는 방법별 학생 수", ["걸어서", "자전거", "버스", "자동차", "기타"], [42, 16, 20, 14, 8], "명", "방법", "학생 수", 2, 22),
    ground=G("학년별 운동장 이용 횟수", ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"], [60, 100, 140, 120, 180, 220], "회", "학년", "횟수", 20, 11, True),
    kick=G("장소별 세워진 킥보드 수", ["학교 앞", "공원", "시장", "역 앞"], [12, 8, 6, 16], "대", "장소", "킥보드 수", 1, 17),
    kickDay=G("요일별 공원 앞 킥보드 수", ["월요일", "화요일", "수요일", "목요일", "금요일"], [20, 35, 15, 40, 25], "대", "요일", "킥보드 수", 5, 8),
    play=G("체육 시간에 하고 싶은 놀이별 학생 수", ["피구", "술래잡기", "줄다리기", "발야구"], [8, 5, 4, 7], "명", "놀이", "학생 수", 1, 10),
    play1=G("체육 시간에 하고 싶은 놀이별 학생 수", ["피구", "술래잡기", "줄다리기", "발야구"], [6, 6, 5, 8], "명", "놀이", "학생 수", 1, 10),
    dustM=G("월별 미세 먼지 나쁨 일수", ["3월", "4월", "5월", "6월"], [12, 9, 6, 3], "일", "월", "날수", 1, 13),
    parkM=G("월별 공원에 온 사람 수", ["3월", "4월", "5월", "6월"], [240, 300, 360, 420], "명", "월", "사람 수", 20, 22),
    want=G("우리 동네에 생기면 좋겠는 것별 학생 수", ["도서관", "수영장", "놀이터", "자전거 길", "공연장"], [28, 34, 16, 24, 18], "명", "생기면 좋겠는 것", "학생 수", 2, 20),
    place=G("장소별 수", ["자전거 보관대", "공원", "병원", "도서관", "학교"], [6, 8, 2, 4, 3], "개", "장소", "수", 1, 10),
    sbal=G("신체 부위별 풍선을 띄운 횟수", ["손바닥", "머리", "어깨", "무릎"], [20, 14, 6, 18], "회", "신체 부위", "횟수", 2, 12),
    sbal2=G("신체 부위별 풍선을 띄운 횟수", ["손바닥", "머리", "어깨", "무릎"], [16, 22, 10, 12], "회", "신체 부위", "횟수", 2, 12),
    after=G("방과 후 수업별 신청한 학생 수", ["과학", "미술", "축구", "합창"], [16, 12, 22, 8], "명", "수업", "학생 수", 2, 12),
    corner=G("읽고 싶은 신문 코너별 학생 수", ["날씨", "책 소개", "게임", "칭찬 릴레이", "동물"], [3, 6, 5, 8, 2], "명", "코너", "학생 수", 1, 8, True, every=1),
)
H_SEQ = [1, 0, 2, 1, 3, 2, 1, 0, 2, 1, 3, 2, 1, 0, 2, 3, 1, 2, 0, 3, 1]
HS_SEQ = [0, 3, 1, 0, 2, 3, 0, 1, 3, 0, 2, 1, 3, 0, 1, 2, 0, 3, 1, 0, 2, 3, 0, 3]
assert counts(H_SEQ, 4) == H['camp']['vals'] and len(H_SEQ) == 21
assert counts(HS_SEQ, 4) == H['play']['vals'] and len(HS_SEQ) == 24
for _g in H.values():
    if 'step' in _g:
        assert max(_g['vals']) <= _g['step'] * _g['cells'], _g['title']
        cells_of(_g)


def jj(xs):
    return '·'.join(map(str, xs))


def h_tb_l1(w, D):
    w.lesson(1, "개념 찾기(S)", "단원 도입 ― 환경 보호 실천 학교", "조사한 자료를 어떻게 나타내면 한눈에 비교할 수 있을까요?",
             "이서네 학교는 환경 보호 실천 학교예요. 이서와 친구들은 환경을 보호하기 위해 어떤 활동을 했는지 조사했어요.")
    acts = ["장바구니 들고 다니기", "물을 틀어 놓고 양치하기", "이면지 쓰기", "가까운 거리는 걸어가기", "음식 남기기", "플라스틱 빨대 많이 쓰기"]
    w.step("① 그림 살펴보기", "환경을 지키는 활동과 해치는 활동 가르기")
    w.text("환경을 보호하는 활동이면 ○, 아니면 ×에 표시해 보세요.")
    w.choices(OX(acts))
    m = H['milk']
    w.step("② 곰곰! 그림그래프 그리기", "반별 분리배출한 페트병 수")
    w.table(dtable(m['cats'], m['vals'], '반', '페트병 수(개)', blanks=('sum',)))
    w.text("큰 그림은 10개, 작은 그림은 1개를 나타내요. 그림그래프를 완성해 보세요.")
    w.pic(pict_svg(m, filled=False), 150)
    w.step("③ 곰곰! 그림그래프 읽기", "페트병 그림그래프 보기")
    w.ask("페트병을 두 번째로 많이 모은 반은?")
    w.ask("네 반이 모은 페트병은 모두 몇 개인가요?")
    w.ask("4반은 3반보다 페트병을 몇 개 더 모았나요?")
    w.step("④ 똑똑! 무엇을 배울까요", "같은 자료를 막대 모양으로 (눈금 한 칸이 1개가 아니에요)")
    w.pic(bar_svg(H['milkBar']), 105)
    w.ask("세로 눈금 한 칸은 페트병 몇 개를 나타내나요?")
    w.choices([("막대가 1반보다 긴 반을 모두 고르면?", "( 2반, 4반 / 3반 / 2반, 3반 )")])
    w.step("⑤ 생각 나누기", "내 생각 쓰기")
    w.ask("우리나라에는 독도를 포함해서 섬이 3383개나 있대요. 나라별로 섬이 몇 개 있는지 비교하려면 어떻게 나타내면 좋을까요?", blank=False)
    w.lines(2)
    w.ask("막대 모양으로 나타낸 그래프는 표로 나타낸 것과 어떤 점이 다를 것 같나요?", blank=False)
    w.lines(2)
    big = rank(H['milkBar'])
    ans = ("1차시  ① ○, ×, ○, ○, ×, × ② 합계 %d, 1반 큰 3 작은 6 · 2반 큰 4 작은 8 · 3반 큰 2 작은 4 · 4반 큰 5 작은 2 "
           "③ %s, %d개, %d개 ④ 4개, 2반, 4반 ⑤ (생각 쓰기 — 예: 막대 모양 그래프로 나타내요 / 많고 적음을 한눈에 볼 수 있어요)"
           % (sum(m['vals']), big[1], sum(m['vals']), 52 - 24))
    w.step("⑥ 도전하기", "그림그래프 더 읽기")
    w.ask("큰 그림 2개와 작은 그림 5개는 우유갑 몇 개를 나타내나요?")
    w.choices([("2반과 4반이 모은 우유갑을 합하면 어느 반과 같나요?", "( 1반 / 3반 / 같은 반이 없어요 )")])
    w.ask("3반이 우유갑을 5개 더 모으면 큰 그림은 몇 개가 되나요?")
    w.why("그림그래프와 막대 모양 그래프는 각각 어떤 점이 편리할까요?")
    ans += " ⑥ 25개, 3반(25 + 15 = 40), 4개(45개 = 큰 그림 4개 + 작은 그림 5개), (생각 쓰기 — 예: 그림그래프는 그림 수로 어림하기 쉽고, 막대 모양 그래프는 길이로 바로 견줄 수 있어요)"
    return ans


def h_tb_l2(w, D):
    g = H['cloth']
    w.lesson(2, "개념 구축하기(O)", "막대그래프를 알아볼까요", "조사한 자료의 수량을 막대 모양으로 나타내면 무엇이 편리할까요?",
             "이서는 4학년 학생들이 학급별로 대출한 환경 관련 책의 수를 표로 나타냈어요.")
    w.step("① 만져 보기", "학급별 모은 헌 옷의 수를 세로 막대로")
    w.table(dtable(g['cats'], g['vals'], '학급', '헌 옷의 수(벌)'))
    w.text("세로 눈금 한 칸은 1벌이에요. 학급마다 헌 옷의 수만큼 막대를 색칠해 보세요.")
    w.pic(bar_svg(g, bars=None), 105)
    w.step("② 그려 보기", "같은 자료를 가로 막대로")
    w.pic(bar_svg(V(g, horiz=True), bars=None), 120)
    w.step("③ 말해 보기", "헌 옷 막대그래프 살펴보기")
    w.pic(bar_svg(g), 95)
    w.ask("헌 옷을 가장 많이 모은 반과 가장 적게 모은 반은 몇 벌 차이 나나요?")
    w.ask("막대의 길이가 3반의 2배인 반이 있나요? 있다면 써 보세요.")
    w.pick("세로 막대그래프와 가로 막대그래프의 다른 점은?", ["학급과 헌 옷의 수가 놓인 자리가 바뀌었어요.", "학급마다 헌 옷의 수가 달라졌어요."])
    w.why("가로 막대그래프에서는 무엇이 달라졌나요? 세로 막대그래프와 견주어 써 보세요.")
    w.step("④ 약속하기", "막대그래프에서 길이가 뜻하는 것")
    w.fill(["막대그래프에서 두 막대의 길이가 같으면 수량도 (        ).",
            "세로 막대그래프를 가로 막대그래프로 바꾸어도 나타내는 자료는 (          )."])
    w.step("⑤ 확인하기", "이럴 때는 표와 막대그래프 중 무엇이 좋을까요?")
    w.choices([("3반이 모은 헌 옷이 몇 벌인지 정확하게 알고 싶어요.", "( 표 / 막대그래프 )"),
               ("어느 반이 가장 많이 모았는지 한눈에 알고 싶어요.", "( 표 / 막대그래프 )"),
               ("네 반이 모은 헌 옷이 모두 몇 벌인지 알고 싶어요.", "( 표 / 막대그래프 )")])
    ans = ("2차시  ① %s칸만큼 세로 막대 ② 같은 길이의 가로 막대 ③ %d벌, 없어요(3반 6벌의 2배는 12벌), ① / 왜: (예: 막대가 가로로 누워 학급은 세로에, 헌 옷의 수는 가로에 있어요) "
           "④ 같아요, 같아요 ⑤ 표, 막대그래프, 표" % (jj(cells_of(g)), max(g['vals']) - min(g['vals'])))
    f = TB['flower']
    w.step("⑥ 도전하기", "민수네 학교 4학년이 좋아하는 꽃")
    w.pic(bar_svg(f), 120)
    w.choices([("그래프의 가로와 세로는?", "( 가로: 학생 수, 세로: 꽃 / 가로: 꽃, 세로: 학생 수 )")])
    w.ask("가로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("장미를 좋아하는 학생은 몇 명인가요?")
    w.why("가로 눈금 한 칸이 그 크기인 까닭을 써 보세요.")
    ans += (" ⑥ 가로: 학생 수, 세로: 꽃 / %d명 / %d명(13칸 × 2) / 왜: 0과 10 사이가 5칸이라 10 ÷ 5 = 2"
                                            % (f['step'], val(f, '장미')))
    return ans


def h_tb_l3(w, D):
    a, v = H['save'], H['flw']
    w.lesson(3, "개념 구축하기(O)", "막대그래프의 내용을 알아볼까요", "막대그래프를 보고 어떤 내용을 알 수 있을까요?",
             "이서네 학교 4학년 학생들이 실천하고 있는 환경 보호 활동을 조사하여 막대그래프로 나타냈어요.")
    w.step("① 만져 보기", "에너지 절약 활동 막대그래프")
    w.pic(bar_svg(a), 120)
    w.pick("무엇을 조사하여 나타낸 막대그래프인가요?", ["4학년 학생들이 실천하고 싶은 에너지 절약 활동", "4학년 학생들이 좋아하는 놀이", "반별 전기 사용량"])
    w.ask("가장 적은 학생이 실천하고 싶은 활동은?")
    w.ask("두 번째로 많은 학생이 실천하고 싶은 활동은?")
    w.step("② 그려 보기", "같은 그래프에서 수량 알아보기")
    w.ask("‘플러그 뽑기’를 실천하고 싶은 학생은 몇 명인가요?")
    w.ask("‘계단 이용하기’보다 5명 더 많은 학생이 고른 활동은?")
    w.ask("‘전등 끄기’와 ‘계단 이용하기’를 고른 학생은 모두 몇 명인가요?")
    w.step("③ 말해 보기", "기르고 싶어 하는 꽃 (가로 눈금 한 칸이 1명이 아니에요)")
    w.pic(bar_svg(v), 125)
    w.ask("가로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("장미를 기르고 싶어 하는 학생은 몇 명인가요?")
    w.ask("튤립을 기르고 싶어 하는 학생 수는 코스모스의 몇 배인가요?")
    w.why("‘장미 막대는 9칸이니까 9명’이라고 한 친구에게 무엇이라고 말해 줄까요?")
    w.step("④ 약속하기", "막대그래프 읽기 (눈금과 길이)")
    w.fill(["두 막대의 길이를 견주면 수량의 (          )을 알 수 있어요.",
            "가로 눈금 한 칸이 10명일 때 막대가 4칸이면 (        )명이에요."])
    w.step("⑤ 확인하기", "적은 학생이 기르고 싶어 하는 꽃부터 차례대로")
    w.fill("(          ) → (          ) → (          ) → (          ) → (          )")
    r = rank(v)[::-1]
    ans = ("3차시  ① ①(실천하고 싶은 에너지 절약 활동), %s, %s ② %d명, %s, %d명 ③ %d명, %d명, %d배 / 왜: (예: 가로 눈금 한 칸은 10명이라 9칸은 90명이에요) "
           "④ 많고 적음, 40 ⑤ %s"
           % (rank(a)[-1], rank(a)[1], val(a, '플러그 뽑기'), '냉장고 문 빨리 닫기', val(a, '전등 끄기') + val(a, '계단 이용하기'),
              v['step'], val(v, '장미'), val(v, '튤립') // val(v, '코스모스'), ' → '.join(r)))
    assert val(a, '계단 이용하기') + 5 == val(a, '냉장고 문 빨리 닫기') and val(v, '튤립') % val(v, '코스모스') == 0
    ck, gf = TB['cake'], TB['gift']
    w.step("⑥ 도전하기", "익힘책 문제 ― 두 막대그래프")
    w.pic(pair_svg([(None, bar_svg(ck)), (None, bar_svg(gf))]), 178)
    w.ask("가장 많은 학생이 좋아하는 케이크는?")
    w.ask("초코케이크를 좋아하는 학생 수는 치즈케이크의 몇 배인가요?")
    w.ask("옷을 받고 싶어 하는 학생은 몇 명인가요?")
    w.ask("두 번째로 많은 학생이 받고 싶어 하는 선물은?")
    w.ask("장난감보다 적은 학생이 받고 싶어 하는 선물을 모두 써 보세요.")
    w.why("①의 환경 보호 활동 그래프로 답이 ‘3명’인 질문을 만들어 써 보세요.", 1)
    lt = [c for c in gf['cats'] if val(gf, c) < val(gf, '장난감')]
    ans += (" ⑥ %s, %d배, %d명, %s, %s, "
            "(예: ‘양치 컵 사용하기’를 실천하는 학생은 ‘급식 남기지 않기’보다 몇 명 더 많나요? 14 − 11 = 3)"
            % (rank(ck)[0], val(ck, '초코') // val(ck, '치즈'), val(gf, '옷'), rank(gf)[1], '·'.join(lt)))
    return ans


def h_tb_l4(w, D):
    g = H['bag']
    w.lesson(4, "개념 구축하기(O)", "막대그래프로 나타내는 방법을 알아볼까요", "표를 보고 막대그래프로 나타내려면 어떻게 해야 할까요?",
             "이서네 모둠 학생들이 일주일 동안 사용한 일회용품 수를 조사하여 표로 나타냈어요.")
    w.step("① 만져 보기", "쓰레기 봉투 수 표를 막대그래프로 (세로 눈금 한 칸 1개)")
    w.table(dtable(g['cats'], g['vals'], '종류', '봉투 수(개)'))
    w.text("빈칸에 축 이름과 제목을 쓰고, 막대를 그려 보세요.")
    w.pic(bar_svg(g, bars=None, title=False, axes=False), 120)
    w.pick("막대그래프의 제목으로 알맞은 것은?", ["일주일 동안 버린 종류별 쓰레기 봉투 수", "좋아하는 쓰레기통", "이서네 모둠 친구 이름"])
    w.step("② 그려 보기", "세로 눈금이 7칸뿐이라면")
    g7 = V(g, cells=7, step=2)
    w.choices([("세로 눈금 한 칸의 크기는?", "( 1개 / 2개 / 5개 )")])
    w.text("눈금에 수를 쓰고 막대를 다시 그려 보세요.")
    w.pic(bar_svg(g7, bars=None, ticks='zero'), 100)
    w.why("눈금 한 칸을 5개로 하면 안 되는 까닭을 써 보세요.", 1)
    w.step("③ 말해 보기", "막대를 가로로 (가로 눈금 한 칸 1개)")
    w.pic(bar_svg(V(g, horiz=True), bars=None), 135)
    w.step("④ 약속하기", "눈금 한 칸의 크기와 제목 정하기")
    w.fill(["눈금 한 칸의 크기는 (            )와 눈금의 칸 수를 보고 정해요.",
            "막대그래프의 제목은 무엇을 조사했는지 알 수 있게 (                )에 맞게 써요."])
    c = H['season']
    w.step("⑤ 확인하기", "좋아하는 계절별 학생 수 ― 모눈 10칸에 스스로 정하기")
    w.table(dtable(c['cats'], c['vals'], '계절', '학생 수(명)'))
    w.fill("눈금 한 칸은 (      )명으로 정했어요. 쓰는 눈금은 (      )칸이에요.")
    w.pic(bar_svg(c, bars=None, ticks='zero'), 105)
    ans = ("4차시  ① 가로: 종류, 세로: 봉투 수(개), 막대 %s칸, 제목 ① ② 2개 → 막대 %s칸 / 왜: 5개로 하면 14·8·4가 칸에 꼭 맞지 않아요 ③ 가로 막대 %s칸 "
           "④ 가장 큰 수, 조사한 내용 ⑤ 1명이면 10칸(막대 %s칸) 또는 2명이면 5칸(막대 %s칸)"
           % (jj(cells_of(g)), jj(cells_of(g7)), jj(cells_of(g)), jj(cells_of(c, 1)), jj(cells_of(c, 2))))
    t = TB['trash']
    w.step("⑥ 도전하기", "종류별 쓰레기 양 ― 가로 눈금 10칸")
    w.table(dtable(t['cats'], t['vals'], '종류', '쓰레기 양(kg)'))
    w.choices([("가로 눈금 한 칸의 크기는?", "( 1 kg / 10 kg / 20 kg / 50 kg )")])
    w.pic(bar_svg(t, bars=None, ticks='zero'), 130)
    w.why("그 크기로 정한 까닭을 ‘가장 큰 수’를 넣어 써 보세요.")
    ans += (" ⑥ 10 kg, 막대 %s칸, 왜: 가장 큰 수 100 kg을 10칸에 나타내야 하므로 100 ÷ 10 = 10"
            % '·'.join(map(str, cells_of(t))))
    return ans


def h_tb_l56(w, D):
    e = H['camp']
    w.lesson("5~6", "탐구 정리하기(O)", "자료를 조사하여 막대그래프로 나타내어 볼까요",
             "우리 반 학생들이 하고 싶어 하는 친환경 체험 활동을 조사하여 어떻게 나타낼까요?",
             "선생님께서 환경의 날에 하고 싶은 친환경 체험 활동을 이야기해 보자고 하셨어요.")
    w.step("① 조사 계획 세우기", "환경 캠페인 조사 ― 알맞은 방법 고르기")
    w.text("조사하는 방법으로 알맞으면 ○, 알맞지 않으면 ×에 표시해 보세요.")
    w.choices(OX(["한 사람이 여러 번 손 들기", "설문지에 하나씩 표시하기", "한 사람이 스티커 한 장씩 붙이기", "선생님이 대신 정하기"]))
    w.pick("조사하기에 알맞은 질문은?", ["우리 반 학생들은 어떤 환경 캠페인을 하고 싶어 할까?", "이서는 어떤 캠페인을 좋아할까?"])
    w.step("② 스티커로 조사하기", "캠페인 스티커 판 (21명)")
    w.pic(sticker_svg(e['cats'], H_SEQ, TB_NAMES, '하고 싶은 환경 캠페인'), 150)
    w.table(dtable(e['cats'], e['vals'], '캠페인', '학생 수(명)', blanks=(0, 1, 2, 3, 'sum')))
    w.step("③ 막대그래프로 나타내기", "가로·세로, 눈금, 제목을 스스로 정하기")
    w.text("가로·세로 축 이름, 눈금의 수, 막대 이름, 제목을 모두 써서 막대그래프를 완성해 보세요.")
    w.pic(bar_svg(V(e, cells=10), bars=None, ticks='zero', axes=False, title=False, names=[None] * 4), 120)
    w.why("세로 눈금 한 칸을 2명으로 하면 안 되는 까닭을 써 보세요.", 1)
    w.step("④ 공학 도구로 그리기", "간격을 바꾸어 보기")
    w.fill(["간격(눈금 한 칸의 크기)을 1로 하면 ‘줍깅하기’ 막대는 (      )칸이에요.",
            "간격을 2로 바꾸면 ‘포스터 그리기’ 막대는 (      )칸이에요."])
    w.step("⑤ 비교하고 이야기하기", "캠페인 막대그래프 보기")
    w.ask("가장 많은 학생이 하고 싶어 하는 캠페인은?")
    w.ask("‘물건 나눔 장터’를 하고 싶어 하는 학생은 ‘나무 심기’보다 몇 명 더 많나요?")
    w.ask("‘포스터 그리기’와 ‘나무 심기’를 하고 싶어 하는 학생은 모두 몇 명인가요?")
    w.pick("캠페인을 하나만 정한다면? 그래프에 근거한 까닭을 골라 보세요.",
           ["줍깅하기 ― 가장 많은 학생이 하고 싶어 하기 때문이에요.", "나무 심기 ― 막대가 가장 오른쪽에 있기 때문이에요."])
    ans = ("5~6차시  ① ×, ○, ○, ×, ① ② %s, 합계 %d ③ 가로: 캠페인, 세로: 학생 수(명), 한 칸 1명, 막대 %s칸, 제목: 하고 싶어 하는 환경 캠페인별 학생 수 "
           "/ 왜: 7이 2로 나누어떨어지지 않아 칸에 꼭 맞지 않아요 ④ %d칸, %d칸 ⑤ %s, %d명, %d명, ①"
           % (', '.join('%s %d' % t for t in zip(e['cats'], e['vals'])), sum(e['vals']), jj(cells_of(e)), val(e, '줍깅하기'),
              val(e, '포스터 그리기') // 2, rank(e)[0], val(e, '물건 나눔 장터') - val(e, '나무 심기'), val(e, '포스터 그리기') + val(e, '나무 심기')))
    f = TB['food']
    order = rank(f)
    w.step("⑥ 도전하기", "많이 먹고 싶어 하는 음식부터 위에서 차례대로")
    w.table(dtable(["수제비", "떡볶이", "돈가스", "비빔밥"], [6, 12, 8, 4], '음식', '학생 수(명)'))
    w.text("막대 이름을 위에서부터 차례대로 쓰고, 가로 눈금 한 칸을 1명으로 하여 막대를 그려 보세요.")
    w.pic(bar_svg(f, bars=None, names=[None] * 4), 130)
    w.why("많은 것부터 차례대로 나타내면 어떤 점이 좋을까요?", 1)
    ans += (" ⑥ 위에서부터 %s, 왜: 순위를 한눈에 알 수 있어요"
            % ', '.join('%s %d칸' % (c, val(f, c)) for c in order))
    return ans


def h_tb_l7(w, D):
    bk, du, fac, gym = H['bike'], H['dust'], H['fac'], H['gym']
    w.lesson(7, "탐구 정리하기(O)", "막대그래프를 생활에 활용해 볼까요", "생활 속 막대그래프를 보고 무엇을 알고 판단할 수 있을까요?",
             "이서네 반 학생들이 우리나라의 연도별 친환경 자동차 등록 대수와 자동차의 일산화탄소 배출량을 조사하여 막대그래프로 나타냈어요.")
    w.step("① 두 막대그래프 살펴보기", "공공 자전거 이용자 수와 미세 먼지 나쁨 일수 (가상의 자료)")
    w.pic(pair_svg([(None, bar_svg(bk)), (None, bar_svg(du))]), 175)
    w.ask("공공 자전거 이용자 수가 가장 적은 해는?")
    w.ask("미세 먼지 나쁨 일수가 가장 많은 해는?")
    w.ask("2020년 공공 자전거 이용자 수는 2017년의 몇 배인가요?")
    w.step("② 두 그래프 견주기", "늘어난 것과 줄어든 것")
    w.choices([("2017년부터 2020년까지 공공 자전거 이용자 수는?", "( 늘어났어요 / 줄어들었어요 / 그대로예요 )"),
               ("같은 때 미세 먼지 나쁨 일수는?", "( 늘어났어요 / 줄어들었어요 / 그대로예요 )")])
    w.pick("두 그래프를 보고 생각할 수 있는 것은?", ["자전거를 타는 사람이 늘어 자동차 매연이 줄었을 수도 있어요.", "자전거를 타면 날씨가 언제나 맑아져요."])
    w.step("③ 글로 완성하기", "4학년 학생들이 바라는 학교 시설")
    w.pic(bar_svg(fac), 120)
    w.fill(["가장 많은 학생이 바라는 시설은 (            )이고, 가장 적은 학생이 바라는 시설은 (            )입니다.",
            "또 알 수 있는 내용은 (                                                  )입니다."])
    w.step("④ 사실과 의견 나누기", "학교 시설 막대그래프를 보고 한 말")
    w.choices([("화장실 고치기를 바라는 학생이 80명으로 가장 많아요.", "( 사실 / 의견 )"),
               ("운동장에 그늘막을 꼭 만들어야 해요.", "( 사실 / 의견 )"),
               ("놀이 기구와 쉼터를 바라는 학생 수를 더하면 70명이에요.", "( 사실 / 의견 )"),
               ("도서관이 넓어지면 책을 더 많이 읽을 거예요.", "( 사실 / 의견 )"),
               ("쉼터를 바라는 학생은 40명이에요.", "( 사실 / 의견 )")])
    assert rank(fac)[0] == '화장실 고치기' and val(fac, '놀이 기구') + val(fac, '쉼터') == 70 and val(fac, '쉼터') == 40
    w.step("⑤ 생활 속 막대그래프", "어느 체육관의 요일별 이용자 수")
    w.pic(bar_svg(gym), 115)
    w.ask("이용자 수가 같은 요일을 모두 써 보세요.")
    w.ask("목요일의 이용자는 몇 명인가요?")
    w.ask("이용자 수가 금요일의 3배인 요일은?")
    w.pick("하루 문을 일찍 닫는다면 어느 요일이 좋을까요?", ["금요일 ― 이용자가 가장 적기 때문이에요.", "목요일 ― 요일 이름이 마음에 들기 때문이에요."])
    rt = rank(fac)
    same = [c for c in gym['cats'] if gym['vals'].count(val(gym, c)) > 1]
    three = [c for c in gym['cats'] if val(gym, c) == 3 * val(gym, '금요일')]
    ans = ("7차시  ① 2017년, 2017년, %d배 ② 늘어났어요, 줄어들었어요, ① ③ %s, %s, (예: 두 번째로 많은 것은 %s) "
           "④ 사실, 의견, 사실, 의견, 사실 ⑤ %s, %d명, %s, ①"
           % (val(bk, '2020년') // val(bk, '2017년'), rt[0], rt[-1], rt[1], '·'.join(same), val(gym, '목요일'), three[0]))
    cold, wm = TB['cold'], TB['warmer']
    w.step("⑥ 도전하기", "11월~2월 최저 기온이 0 ℃보다 낮은 날수와 손난로 판매량")
    w.pic(pair_svg([(None, bar_svg(cold)), (None, bar_svg(wm))]), 175)
    w.ask("최저 기온이 0 ℃보다 낮은 날이 가장 많은 달은?")
    w.ask("손난로가 가장 많이 팔린 달은?")
    w.ask("12월의 손난로 판매량은 몇 개인가요?")
    w.why("두 그래프 사이에는 어떤 관계가 있을까요? 그래프의 사실을 근거로 써 보세요.")
    ans += (" ⑥ %s, %s, %d개, 왜: (예: 최저 기온이 0 ℃보다 낮은 날이 많은 달일수록 손난로 판매량이 많아요 — 1월 24일·90개)"
            % (rank(cold)[0], rank(wm)[0], val(wm, '12월')))
    return ans


def h_tb_l8(w, D):
    p1 = H['place1']
    k1 = [dict(kind="school", name="학교", n=9), dict(kind="police", name="경찰서", n=4), dict(kind="library", name="도서관", n=6),
          dict(kind="mountain", name="산", n=5), dict(kind="fall", name="폭포", n=1)]
    p2 = TB['place2']
    k2 = [dict(kind="school", name="학교", n=11), dict(kind="hospital", name="병원", n=8), dict(kind="beach", name="해수욕장", n=5),
          dict(kind="spa", name="온천", n=2), dict(kind="mountain", name="산", n=4)]
    assert [k['n'] for k in k1] == p1['vals'] and [k['n'] for k in k2] == p2['vals']
    w.lesson(8, "탐구 정리하기(O)", "생각을 더하다 ― 우리 지역을 소개해 볼까요",
             "지도 속 자료를 막대그래프로 나타내면 우리 지역을 어떻게 소개할 수 있을까요?",
             "선호와 은진이가 살고 있는 지역의 지도를 보고 장소별 수를 세어 지역을 소개해요.")
    w.step("① 기호 세어 표로", "지우네 지역 지도")
    w.text("한 가지 기호씩 차례로 세고, 센 기호에는 ／ 표시를 해 보세요.")
    w.pic(map_svg(k1, 23, '지우네 지역'), 140)
    w.table(dtable(p1['cats'], p1['vals'], '장소', '수(개)', blanks=(0, 1, 2, 3, 4, 'sum')))
    w.step("② 막대그래프로 나타내기", "지우네 지역 (세로 눈금 한 칸 1개)")
    w.pic(bar_svg(p1, bars=None, title=False), 120)
    w.pick("제목으로 알맞은 것은?", ["지우네 지역의 장소별 수", "지우가 좋아하는 장소", "지우네 반 학생 수"])
    w.step("③ 소개 글 완성하기", "지우네 지역 소개")
    w.fill(["우리 지역에는 (          )이/가 (    )개로 가장 많고, 그다음으로 (          )이/가 많아.",
            "산은 (    )개 있고, 폭포는 (    )개뿐이지만 아주 멋져."])
    w.step("④ 은진이네 지역 견주기", "은진이네 지역 지도")
    w.pic(map_svg(k2, 29, '은진이네 지역'), 140)
    w.ask("은진이네 지역에서 산보다 많은 장소를 모두 써 보세요.")
    w.ask("병원은 온천의 몇 배인가요?")
    w.step("⑤ 은진이네 막대그래프", "가로 막대그래프로 (가로 눈금 한 칸 1개)")
    w.pic(bar_svg(V(p2, horiz=True), bars=None), 125)
    r1 = rank(p1)
    more = [c for c in p2['cats'] if val(p2, c) > val(p2, '산')]
    ans = ("8차시  ① %s, 합계 %d ② 막대 %s칸, ① ③ %s, %d, %s, %d, %d ④ %s, %d배 ⑤ 가로 막대 %s칸"
           % (', '.join('%s %d' % t for t in zip(p1['cats'], p1['vals'])), sum(p1['vals']), jj(p1['vals']),
              r1[0], val(p1, r1[0]), r1[1], val(p1, '산'), val(p1, '폭포'), '·'.join(more), val(p2, '병원') // val(p2, '온천'), jj(p2['vals'])))
    w.step("⑥ 도전하기", "은진이네 지역 소개 글 쓰기")
    w.ask("가장 많은 장소와 두 번째로 많은 장소는 무엇인가요?", blank=False)
    w.lines(1)
    w.ask("막대그래프에서 알 수 있는 사실을 넣어 은진이네 지역을 소개하는 글을 써 보세요.", blank=False)
    w.lines(3)
    ans += " ⑥ 학교(11개), 병원(8개), (소개 글 — 예: 우리 지역에는 해수욕장이 5개나 있어서 여름에 사람들이 많이 찾아와.)"
    return ans


def h_tb_l9(w, D):
    b, b2 = H['bal'], H['bal2']
    w.lesson(9, "발표하기(P)", "놀이를 더하다 ― 몸으로 풍선을 띄워 볼까요", "놀이 기록을 막대그래프로 나타내면 무엇을 알 수 있을까요?",
             "머리, 어깨, 무릎, 발의 순서대로 풍선을 띄우고 횟수를 세는 놀이를 해요.")
    w.step("① 풍선 띄우기 놀이", "우리 모둠 기록 (두 번째 판)")
    w.table([["신체 부위", "머리", "어깨", "무릎", "발", "합계"], ["1판(회)", "", "", "", "", ""], ["2판(회)", "", "", "", "", ""]])
    w.step("② 표로 정리하기", "다섯 개씩 묶어 센 기록 (다른 모둠)")
    w.text("빨간 사선이 있는 묶음 하나가 5회예요. 세어서 표를 완성해 보세요.")
    w.pic(tally_svg(b['cats'], b['vals'], '이서네 모둠의 기록'), 120)
    w.table(dtable(b['cats'], b['vals'], '신체 부위', '횟수(회)', blanks=(0, 1, 2, 3, 'sum')))
    w.step("③ 막대그래프로 나타내기", "세로 눈금 12칸 ― 눈금 한 칸의 크기 정하기")
    w.choices([("세로 눈금 한 칸의 크기는?", "( 1회 / 2회 / 5회 )")])
    w.pic(bar_svg(b, bars=None, ticks='zero', title=False), 110)
    w.step("④ 막대그래프 해석하기", "몇 배, 몇 회 더")
    w.ask("풍선을 가장 적게 띄운 신체 부위는?")
    w.ask("발로 띄운 횟수는 머리로 띄운 횟수보다 몇 회 더 많나요?")
    w.ask("무릎으로 띄운 횟수는 어깨로 띄운 횟수의 몇 배인가요?")
    w.step("⑤ 다른 모둠과 비교하기", "하준이네 모둠과 견주기 (두 그래프 모두 한 칸 2회)")
    w.pic(pair_svg([("이서네 모둠", bar_svg(b)), ("하준이네 모둠", bar_svg(b2))]), 170)
    w.choices([("머리로 풍선을 더 많이 띄운 모둠은?", "( 이서네 모둠 / 하준이네 모둠 )")])
    w.ask("발로 띄운 횟수는 두 모둠이 몇 회 차이 나나요?")
    w.ask("두 모둠의 횟수를 더하면 가장 많은 신체 부위는?")
    w.pick("두 막대그래프를 보고 알 수 있는 사실은?", ["두 모둠 모두 무릎으로 가장 많이 띄웠어요.", "두 모둠 모두 어깨로 가장 많이 띄웠어요."])
    assert rank(b)[0] == rank(b2)[0] == '무릎'
    tot = {c: val(b, c) + val(b2, c) for c in b['cats']}
    ans = ("9차시  ① (모둠 기록) ② %s, 합계 %d ③ 2회 → 0·2·4…24, 막대 %s칸 ④ %s, %d회, %d배 ⑤ %s, %d회, %s, ①"
           % (', '.join('%s %d' % t for t in zip(b['cats'], b['vals'])), sum(b['vals']), jj(cells_of(b)),
              rank(b)[-1], val(b, '발') - val(b, '머리'), val(b, '무릎') // val(b, '어깨'),
              '하준이네 모둠' if val(b2, '머리') > val(b, '머리') else '이서네 모둠', abs(val(b, '발') - val(b2, '발')), max(tot, key=tot.get)))
    bl = TB['ball']
    w.step("⑥ 도전하기", "책으로 공 띄우기 ― 세로 눈금 15칸")
    w.table(dtable(bl['cats'], bl['vals'], '공의 종류', '횟수(회)'))
    w.choices([("세로 눈금 한 칸의 크기는?", "( 1회 / 2회 / 5회 / 10회 )")])
    w.pic(bar_svg(bl, bars=None, ticks='zero'), 115)
    w.why("그 크기로 정한 까닭을 써 보세요.", 1)
    ans += (" ⑥ 2회, 막대 %s칸, 왜: 가장 큰 수 30회를 15칸에 나타내려면 한 칸이 2회여야 하고, 모든 수가 짝수예요"
            % '·'.join(map(str, cells_of(bl))))
    return ans


def h_tb_l10(w, D):
    cu, mu = H['cls'], H['trip']
    w.lesson(10, "발표하기(P)", "공부한 내용을 확인해요", "막대그래프에 대해 배운 것을 모두 확인해 볼까요?",
             "어느 문화 센터의 수업을 신청한 학생 수를 조사하여 막대그래프로 나타냈어요.")
    w.step("① 그래프 살펴보기", "다른 수업 그래프 (눈금 한 칸을 먼저 확인)")
    w.pic(bar_svg(cu), 110)
    w.ask("세로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("요리 수업을 신청한 학생은 몇 명인가요?")
    w.step("② 옳은 설명 찾기", "설명이 맞는지 따지기")
    w.choices([("신청한 학생 수가 가장 많은 수업은 요리 수업입니다.", "( ○ / × )"),
               ("농구 수업을 신청한 학생은 6명입니다.", "( ○ / × )"),
               ("요리 수업을 신청한 학생 수는 바둑 수업의 3배입니다.", "( ○ / × )")])
    assert rank(cu)[0] == '요리' and val(cu, '요리') == 3 * val(cu, '바둑') and val(cu, '농구') != 6
    w.step("③ 표와 막대그래프 완성하기", "4학년이 가고 싶어 하는 체험 장소")
    tc, tv = ["수목원", "과학관", "동물원", "미술관", "천문대"], [11, 16, 20, 9, 16]
    w.table(dtable(tc, tv, '체험 장소', '학생 수(명)', blanks=(3,)))
    w.text("표의 빈칸을 채우고, 그래프의 축 이름과 빈 막대 이름을 쓴 뒤 과학관·천문대의 막대를 그려 보세요.")
    w.pic(bar_svg(mu, lock={1, 2, 3}, names=["과학관", None, None, "미술관", "천문대"], axes=False), 150)
    w.step("④ 알 수 있는 내용", "옳으면 ○, 옳지 않으면 ×")
    w.choices(OX(["가장 많은 학생이 가고 싶어 하는 곳은 동물원이에요.", "과학관과 천문대에 가고 싶어 하는 학생 수는 같아요.",
                  "미술관에 가고 싶어 하는 학생은 10명이에요.", "가장 적은 학생이 가고 싶어 하는 곳은 수목원이에요."]))
    w.ask("동물원에 가고 싶어 하는 학생은 미술관보다 몇 명 더 많나요?")
    w.step("⑤ 체험 학습 장소 정하기", "두 곳을 고른다면")
    w.labeled([("두 곳", "체험 학습 장소로 (            )과/와 (            )이/가 좋겠어요."),
               ("까닭", "막대그래프에서 (                                              )이기 때문이에요.")])
    assert sum(tv) == 72
    ans = ("10차시  ① %d명, %d명 ② ○, ×(12명), ○ ③ 미술관 9, 합계 72 / 세로: 체험 장소, 가로: 학생 수(명) / 빈 막대 이름 위에서부터 수목원(11칸), 동물원(20칸) / "
           "과학관 16칸, 천문대 16칸 ④ ○, ○, ×(9명), ×(미술관) / %d명 ⑤ (예: 동물원과 과학관 — 가고 싶어 하는 학생이 가장 많은 두 곳)"
           % (cu['step'], val(cu, '요리'), val(mu, '동물원') - val(mu, '미술관')))
    fk = TB['folk']
    st = [("막대그래프의 가로에 나타낸 것은 학생 수입니다.", False), ("세로 눈금 한 칸은 1명을 나타냅니다.", True),
          ("가장 많은 학생이 좋아하는 민속놀이는 투호입니다.", True), ("바둑을 좋아하는 학생은 9명입니다.", False)]
    assert rank(fk)[0] == '투호' and val(fk, '바둑') == 4
    w.step("⑥ 도전하기", "꼭꼭! 확인하고 정리해요 ― 도윤이가 좋아하는 민속놀이 찾기")
    w.pic(bar_svg(fk), 95)
    w.text("설명이 옳으면 ○, 옳지 않으면 ×를 쓴 다음, 아래 표에서 ○× 차례가 같은 줄을 찾아 보세요.")
    w.choices([("%d. %s" % (i + 1, t), "( ○ / × )") for i, (t, _) in enumerate(st)])
    key = ''.join('○' if a else '×' for _, a in st)
    opts = [("○ ○ ○ ×", "바둑"), (' '.join(key), "고누"), ("× × ○ ×", "씨름"), ("× ○ ○ ○", "투호")]
    assert len({o[0] for o in opts}) == 4
    w.table([["○× 차례"] + [o[0] for o in opts], ["도착하는 곳"] + [o[1] for o in opts]])
    w.ask("도윤이가 좋아하는 민속놀이는?")
    w.why("틀린 설명 하나를 골라 바르게 고쳐 써 보세요.", 1)
    ans += " ⑥ ×, ○, ○, × → 고누, 왜: (예: 가로에 나타낸 것은 민속놀이의 종류입니다 / 바둑을 좋아하는 학생은 4명입니다)"
    return ans


def h_st_l1(w, D):
    m, mb = H['juice'], H['juiceBar']
    w.lesson(1, "개념 찾기(S)", "우리 반 조사 기자단이 생겼어요", "조사한 자료를 어떻게 나타내면 한눈에 비교할 수 있을까요?",
             "햇살초등학교 4학년 2반 24명은 학급 신문 「햇살 4-2 소식」을 만드는 조사 기자단이 되었어요.")
    w.step("① 만져 보기 — 보기·생각하기·궁금해하기", "학교 안에서 조사해 볼 것")
    write3(w, D, [("보여요", "", "학교 안에서 조사할 수 있는 것 두 가지"),
                  ("생각해요", "", "조사한 것을 표와 그림 중 무엇으로 나타내고 싶은지"),
                  ("궁금해요", "", "그래프를 그릴 때 궁금한 것")])
    w.step("② 그려 보기 — 그림그래프 떠올리기", "반별 오늘 마신 주스 수")
    w.table(dtable(m['cats'], m['vals'], '반', '주스 수(개)'))
    w.text("큰 그림은 10개, 작은 그림은 1개를 나타내요. 그림그래프를 완성해 보세요.")
    w.pic(pict_svg(m, filled=False), 150)
    w.step("③ 말해 보기 — 막대 모양 그래프 만나기", "눈금 한 칸이 2개인 그래프")
    w.pic(bar_svg(mb), 105)
    w.ask("세로 눈금 한 칸은 주스 몇 개를 나타내나요?")
    w.ask("4반은 3반보다 주스를 몇 개 더 마셨나요?")
    w.choices([("주스를 두 번째로 적게 마신 반은?", "( 1반 / 2반 / 3반 / 4반 )")])
    w.why("막대 모양 그래프에서 가장 많이 마신 반을 어떻게 한눈에 찾을 수 있을까요?")
    w.step("④ 약속하기 — 무엇을 배울까요", "막대의 칸 수와 수량")
    w.ask("눈금 한 칸이 2개일 때 막대가 13칸이면 몇 개인가요?")
    w.choices([("두 반의 막대 길이가 같다면?", "( 마신 주스 수가 같아요 / 다를 수도 있어요 )")])
    w.step("⑤ 확인하기 — 첫 기사 계획")
    w.ask("우리 반에서 조사해 보고 싶은 것과, 그 결과를 신문에 어떻게 보여 주면 좋을지 까닭과 함께 써 보세요.", blank=False)
    w.lines(3)
    ans = ("1차시  ① (생각 쓰기) ② 합계 %d, 1반 큰 3 · 2반 큰 2 작은 6 · 3반 큰 1 작은 8 · 4반 큰 3 작은 4 "
           "③ 2개, %d개, 2반, 왜: 가장 긴 막대 — 막대가 길수록 많이 마셨기 때문 ④ 26개, 같아요 ⑤ (예: 좋아하는 운동 / 막대 모양 그래프 — 가장 많은 것이 한눈에 보여서)"
           % (sum(m['vals']), val(mb, '4반') - val(mb, '3반')))
    w.step("⑥ 도전하기", "그림그래프 더 읽기")
    w.ask("큰 그림 1개와 작은 그림 7개는 우유 몇 개를 나타내나요?")
    w.ask("네 반이 오늘 마신 우유는 모두 몇 개인가요?")
    w.ask("3반이 우유를 3개 더 마셨다면 큰 그림은 몇 개가 되나요?")
    w.why("그림그래프보다 막대 모양 그래프로 견주기 쉬운 까닭을 써 보세요.")
    ans += " ⑥ 17개, %d개, 2개(20개), 왜: (예: 막대의 길이만 보면 되어서 큰 그림·작은 그림을 셈하지 않아도 돼요)" % sum(ST_MILK['vals'])
    return ans


def h_st_l2(w, D):
    g = H['snack']
    w.lesson(2, "개념 구축하기(O)", "좋아하는 운동 기사 ― 막대그래프를 알아봐요", "조사한 자료의 수량을 막대 모양으로 나타내면 무엇이 편리할까요?",
             "기자단장 윤서가 우리 반 24명에게 좋아하는 운동을 물어 표로 정리했어요.")
    w.step("① 만져 보기 — 막대 세우기", "덤으로 조사한 좋아하는 간식 (세로 눈금 한 칸 1명)")
    w.table(dtable(g['cats'], g['vals'], '간식', '학생 수(명)'))
    w.ask("먼저 예상해요. 학생 수가 가장 많은 간식의 막대는 몇 칸일까요?", blank=False)
    w.lines(1)
    w.pic(bar_svg(g, bars=None), 100)
    w.step("② 그려 보기 — 막대를 가로로", "간식 그래프를 가로로")
    w.pic(bar_svg(V(g, horiz=True), bars=None), 115)
    w.step("③ 말해 보기 — 몇 명 더, 몇 배")
    w.pic(bar_svg(g), 95)
    w.ask("과자를 좋아하는 학생은 빵보다 몇 명 더 많나요?")
    w.ask("떡볶이를 좋아하는 학생 수는 빵의 몇 배인가요?")
    w.why("세로 막대그래프와 가로 막대그래프는 무엇이 같고 무엇이 다를까요?")
    w.step("④ 약속하기 — 막대그래프", "길이가 뜻하는 것")
    w.fill(["막대그래프에서 두 막대의 길이가 같으면 수량도 (        ).",
            "세로 막대그래프를 가로 막대그래프로 바꾸어도 나타내는 자료는 (          )."])
    w.step("⑤ 확인하기 — 표와 막대그래프", "이럴 때는 무엇이 좋을까요?")
    w.choices([("과일을 좋아하는 학생이 몇 명인지 정확하게 알고 싶어요.", "( 표 / 막대그래프 )"),
               ("어느 간식이 가장 인기 있는지 한눈에 알고 싶어요.", "( 표 / 막대그래프 )"),
               ("조사한 학생이 모두 몇 명인지 알고 싶어요.", "( 표 / 막대그래프 )")])
    ans = ("2차시  ① 예상: %d칸 / 막대 %s칸 ② 같은 길이의 가로 막대 ③ %d명, %d배, 왜: 막대의 길이가 학생 수를 나타내는 것은 같고, 간식과 학생 수가 놓인 자리가 바뀌었어요 "
           "④ 같아요, 같아요 ⑤ 표, 막대그래프, 표"
           % (max(g['vals']), jj(g['vals']), val(g, '과자') - val(g, '빵'), val(g, '떡볶이') // val(g, '빵')))
    s4 = ST['sport4']
    w.step("⑥ 도전하기", "태오가 그린 4학년 전체가 좋아하는 운동")
    w.pic(bar_svg(s4), 120)
    w.choices([("가로와 세로는?", "( 가로: 학생 수, 세로: 운동 / 가로: 운동, 세로: 학생 수 )")])
    w.ask("가로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("피구를 좋아하는 학생은 몇 명인가요?")
    w.ask("축구를 좋아하는 학생은 줄넘기보다 몇 명 더 많나요?")
    w.why("‘피구 막대가 17칸이니 17명’이라는 말이 틀린 까닭을 써 보세요.", 1)
    ans += (" ⑥ 가로: 학생 수, 세로: 운동 / %d명 / %d명 / %d명 / 왜: 가로 눈금 한 칸이 2명이라 17칸은 34명"
            % (s4['step'], val(s4, '피구'), val(s4, '축구') - val(s4, '줄넘기')))
    return ans


def h_st_l3(w, D):
    mh, lb = H['way'], H['ground']
    w.lesson(3, "개념 구축하기(O)", "아침 식사 기사 ― 막대그래프를 읽어요", "막대그래프를 보고 어떤 내용을 알 수 있을까요?",
             "하린이가 보건 선생님께 4학년 학생 100명이 오늘 아침에 먹은 음식을 조사한 막대그래프를 받아 왔어요.")
    w.step("① 만져 보기 — 눈금 한 칸이 1이 아니에요", "등교 방법 그래프 (4학년 100명)")
    w.pic(bar_svg(mh), 120)
    w.ask("먼저 예상해요. 눈금 한 칸이 몇 명인지 어떻게 알 수 있을까요?", blank=False)
    w.lines(1)
    w.ask("세로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("버스를 타고 오는 학생은 몇 명인가요?")
    w.ask("‘기타’ 방법으로 오는 학생은 몇 명인가요?")
    w.step("② 그려 보기 — 많고 적음", "같은 그래프에서")
    w.ask("‘자전거’보다 더 많은 학생이 이용하는 방법을 모두 써 보세요.")
    w.ask("걸어서 오는 학생은 자동차로 오는 학생보다 몇 명 더 많나요?")
    w.step("③ 말해 보기 — 가로 막대그래프 읽기", "학년별 운동장 이용 횟수")
    w.pic(bar_svg(lb), 130)
    w.ask("가로 눈금 한 칸은 몇 회를 나타내나요?")
    w.ask("4학년의 운동장 이용 횟수는 몇 회인가요?")
    w.ask("6학년은 1학년보다 운동장을 몇 회 더 이용했나요?")
    w.why("가로 눈금 한 칸이 그 크기인 까닭을 써 보세요.", 1)
    w.step("④ 약속하기 — 막대그래프 읽기")
    w.fill(["막대그래프를 읽을 때는 먼저 가로와 세로가 무엇을 나타내는지 보고, 눈금 한 칸의 (        )도 확인해요.",
            "눈금 한 칸의 크기는 수가 쓰인 눈금의 수를 그 사이의 (          )로 나누어 구해요. 막대가 길수록 수량이 (        )."])
    w.step("⑤ 확인하기 — 차례대로", "운동장을 적게 이용한 학년부터")
    w.fill("(        ) → (        ) → (        ) → (        ) → (        ) → (        )")
    more = [c for c in mh['cats'] if val(mh, c) > val(mh, '자전거')]
    assert sum(mh['vals']) == 100
    ans = ("3차시  ① 예상: 0부터 10까지 칸 수를 세어 10을 나누어요 / %d명, %d명, %d명 ② %s, %d명 ③ %d회, %d회, %d회, 왜: 0부터 100까지 5칸이라 100 ÷ 5 = 20 "
           "④ 크기, 칸 수, 많아요 ⑤ %s"
           % (mh['step'], val(mh, '버스'), val(mh, '기타'), '·'.join(more), val(mh, '걸어서') - val(mh, '자동차'),
              lb['step'], val(lb, '4학년'), val(lb, '6학년') - val(lb, '1학년'), ' → '.join(rank(lb)[::-1])))
    m, four = ST['meal'], ST['meal']['cats'][:4]
    w.step("⑥ 도전하기", "아침 식사 기사에 넣을 질문")
    w.ask("아침을 먹은 학생은 모두 몇 명인가요?")
    w.ask("아침을 먹지 않은 학생은 과일을 먹은 학생보다 몇 명 더 많나요?")
    w.ask("밥을 먹은 학생은 시리얼을 먹은 학생보다 몇 명 더 많나요?")
    ate = sum(val(m, c) for c in four)
    assert ate + val(m, '먹지 않음') == 100
    ans += (" ⑥ %d명(100 − 12), %d명, %d명"
            % (ate, val(m, '먹지 않음') - val(m, '과일'), val(m, '밥') - val(m, '시리얼')))
    return ans


def h_st_l4(w, D):
    g = H['kick']
    w.lesson(4, "개념 구축하기(O)", "자전거 보관대 기사 ― 막대그래프로 나타내요", "표를 보고 막대그래프로 나타내려면 어떻게 해야 할까요?",
             "사진 기자 도현이가 토요일 아침에 우리 동네 보관대마다 세워진 자전거를 세어 표로 정리했어요.")
    w.step("① 만져 보기 — 표를 막대그래프로", "킥보드 수 (세로 눈금 한 칸 1대)")
    w.table(dtable(g['cats'], g['vals'], '장소', '킥보드 수(대)'))
    w.text("빈칸에 축 이름과 제목을 쓰고, 막대를 그려 보세요.")
    w.pic(bar_svg(g, bars=None, title=False, axes=False), 110)
    w.pick("제목으로 알맞은 것은?", ["장소별 세워진 킥보드 수", "킥보드를 타 본 학생 수", "우리 동네 장소 이름"])
    w.step("② 그려 보기 — 눈금 한 칸의 크기 정하기", "세로 눈금이 8칸뿐이에요")
    g8 = V(g, cells=8, step=2)
    w.ask("먼저 예상해요. 눈금 한 칸을 몇 대로 하면 좋을까요?", blank=False)
    w.lines(1)
    w.pic(bar_svg(g8, bars=None, ticks='zero'), 100)
    w.step("③ 말해 보기 — 막대를 가로로", "가로 눈금 한 칸 1대")
    w.pic(bar_svg(V(g, horiz=True), bars=None), 125)
    w.step("④ 약속하기 — 눈금 한 칸의 크기와 제목 정하기")
    w.fill(["눈금 한 칸의 크기는 (            )와 눈금의 칸 수를 보고 정해요.",
            "막대그래프의 제목은 무엇을 조사했는지 알 수 있게 (                )에 맞게 써요."])
    d = H['kickDay']
    w.step("⑤ 확인하기 — 스스로 정하기", "요일별 공원 앞 킥보드 수 (모눈 8칸)")
    w.table(dtable(d['cats'], d['vals'], '요일', '킥보드 수(대)'))
    w.fill("아래 모눈은 8칸이에요. 눈금 한 칸은 (      )대로 정했어요.")
    w.pic(bar_svg(d, bars=None, ticks='zero'), 125)
    w.why("눈금 한 칸을 2대로 정할 수 없는 까닭을 써 보세요.", 1)
    ans = ("4차시  ① 가로: 장소, 세로: 킥보드 수(대), 막대 %s칸, 제목 ① ② 예상: 가장 큰 수 16대, 2대 → 0·2·4…16, 막대 %s칸 "
           "③ 가로 막대 %s칸 ④ 가장 큰 수, 조사한 내용 ⑤ 5대 → 0·5·10…40, 막대 %s칸"
           % (jj(g['vals']), jj(cells_of(g8)), jj(g['vals']), jj(cells_of(d))))
    r = ST['rack']
    w.step("⑥ 도전하기", "보관대마다 자전거를 세울 수 있는 자리 수 ― 가로 눈금 6칸")
    w.table(dtable(r['cats'], r['vals'], '장소', '자리 수(자리)'))
    w.choices([("가로 눈금 한 칸의 크기는?", "( 5자리 / 10자리 / 20자리 )")])
    w.pic(bar_svg(r, bars=None, ticks='zero'), 125)
    ans += (" / 왜: 15·25가 2로 나누어떨어지지 않아 칸에 꼭 맞지 않아요 ⑥ 10자리, 막대 %s칸"
            % '·'.join(map(str, cells_of(r))))
    return ans


def h_st_l5(w, D):
    b = H['play']
    w.lesson(5, "개념 구축하기(O)", "무엇을 어떻게 조사할까? ― 조사하여 표로 정리해요",
             "우리 반 친구들이 빌리고 싶은 책을 어떻게 조사하고 정리할까요?",
             "학교 도서관에서 새 책을 사려고 해요. 기자단은 ‘우리 반 친구들은 어떤 종류의 책을 빌리고 싶어 할까?’를 조사하기로 했어요.")
    w.step("① 만져 보기 — 조사 방법 정하기", "두 번째 조사: 체육 시간에 하고 싶은 놀이")
    w.text("조사하는 방법으로 알맞으면 ○, 알맞지 않으면 ×에 표시해 보세요.")
    w.choices(OX(["한 사람이 여러 번 손 들기", "설문지에 하나씩 표시하기", "한 사람이 스티커 한 장씩 붙이기", "기자단장이 대신 정하기"]))
    w.pick("조사하기에 알맞은 질문은?", ["우리 반 친구들은 체육 시간에 어떤 놀이를 하고 싶어 할까?", "도현이는 어떤 놀이를 잘할까?"])
    w.why("짐작한 것으로 기사를 쓰면 안 되는 까닭은 무엇일까요?", 1)
    w.step("② 그려 보기 — 조사 항목 정하기", "겹치지 않는 항목")
    w.pick("항목 묶음으로 알맞은 것은?", ["피구, 술래잡기, 줄다리기, 발야구", "피구, 재미있는 놀이, 공놀이, 술래잡기"])
    w.choices([("모은 수의 합계가 조사한 사람 수와 다르면?", "( 다시 세어 확인해요 / 그대로 써요 )")])
    w.step("③ 말해 보기 — 스티커로 조사하기", "놀이 스티커 판 (24명)")
    w.pic(sticker_svg(b['cats'], HS_SEQ, ST_NAMES, '하고 싶은 놀이'), 150)
    w.table(dtable(b['cats'], b['vals'], '놀이', '학생 수(명)', blanks=(0, 1, 2, 3, 'sum')))
    w.step("④ 약속하기 — 조사하는 차례", "조사가 바른지 확인하기")
    w.fill(["조사 결과의 합계가 24명이 아니라면 (                                  ) 확인해요.",
            "항목이 서로 겹치면 한 친구가 (      ) 항목에 표시할 수 있어서 결과가 정확하지 않아요."])
    t3 = [9, 6, 3, 7]
    w.step("⑤ 확인하기 — 다른 반 기록 정리하기", "옆 반 놀이 손 들기 기록")
    w.text("빨간 사선이 있는 묶음 하나가 5명이에요. 세어서 표를 완성해 보세요.")
    w.pic(tally_svg(b['cats'], t3, '4학년 3반 손 들기 기록'), 115)
    w.table(dtable(b['cats'], t3, '놀이', '학생 수(명)', blanks=(0, 1, 2, 3, 'sum')))
    ans = ("5차시  ① ×, ○, ○, ×, ①, 왜: (예: 친구들에게 직접 물어본 자료가 아니어서 실제와 다를 수 있어요) ② ①, 다시 세어 확인해요 ③ %s, 합계 %d "
           "④ (예) 빠지거나 두 번 센 친구가 없는지, 두 ⑤ %s, 합계 %d"
           % (', '.join('%s %d' % t for t in zip(b['cats'], b['vals'])), sum(b['vals']),
              ', '.join('%s %d' % t for t in zip(b['cats'], t3)), sum(t3)))
    w.step("⑥ 도전하기", "4학년 1반의 조사 표 (1반 학생은 모두 25명)")
    w.table([["책 종류", "동화책", "만화책", "과학책", "역사책", "합계"], ["학생 수(명)", "7", "□", "6", "5", "25"]])
    w.ask("만화책을 빌리고 싶은 학생은 몇 명인가요?")
    w.ask("1반에서 가장 적은 학생이 빌리고 싶은 책은?")
    w.ask("우리 반(2반)과 1반 모두에서 가장 적은 학생이 고른 책은?")
    w.why("합계를 이용해 빈칸을 구한 방법을 써 보세요.", 1)
    ans += " ⑥ 7명(25 − 7 − 6 − 5), 역사책, 역사책, 왜: 합계 25에서 나머지 수를 모두 빼요"
    return ans


def h_st_l6(w, D):
    b, b1 = H['play'], H['play1']
    w.lesson(6, "탐구 정리하기(O)", "조사 결과를 막대그래프로 ― 공학 도구도 써 봐요", "조사한 자료를 막대그래프로 나타내면 무엇을 알 수 있을까요?",
             "지난 시간에 우리 반 24명이 빌리고 싶은 책을 조사해 표로 정리했어요.")
    w.step("① 만져 보기 — 우리 반 막대그래프", "놀이 조사 결과를 막대그래프로")
    w.table(dtable(b['cats'], b['vals'], '놀이', '학생 수(명)'))
    w.text("축 이름, 눈금의 수, 막대 이름, 제목을 모두 써서 막대그래프를 완성해 보세요.")
    w.pic(bar_svg(b, bars=None, ticks='zero', axes=False, title=False, names=[None] * 4), 110)
    w.step("② 그려 보기 — 공학 도구로", "간격을 바꾸어 보기")
    w.fill(["간격(눈금 한 칸의 크기)을 1로 하면 피구 막대는 (      )칸이에요.",
            "간격을 2로 하면 술래잡기 막대가 몇 칸인지 칸에 꼭 맞게 나타낼 수 ( 있어요 / 없어요 )."])
    w.step("③ 말해 보기 — 두 반 견주기", "4학년 1반의 놀이 조사")
    w.pic(pair_svg([("4학년 2반(우리 반)", bar_svg(b)), ("4학년 1반", bar_svg(b1))]), 165)
    w.ask("우리 반에서 가장 적은 학생이 하고 싶은 놀이는?")
    w.ask("1반에서 하고 싶은 학생 수가 같은 놀이를 모두 써 보세요.")
    w.ask("두 반을 합하여 가장 많은 학생이 하고 싶은 놀이는?")
    w.why("같은 질문으로 조사했는데 두 반의 결과가 다른 까닭은 무엇일까요?", 1)
    w.step("④ 약속하기 — 그래프로 결정하기", "4학년 두 반이 함께 할 놀이를 정한다면")
    w.fill(["두 반을 합하면 (          )을 하고 싶은 학생이 (    )명으로 가장 많아요.",
            "그래서 함께 할 놀이로 (          )을 정하면 좋겠어요. 결정할 때는 막대그래프에서 알 수 있는 (      )을 근거로 들어요."])
    w.step("⑤ 확인하기 — 기사 쓰기")
    w.labeled([("기사 제목", ""), ("기사 내용", "두 막대그래프에서 알 수 있는 사실 두 가지:")], row_h=5600)
    same1 = [c for c in b1['cats'] if b1['vals'].count(val(b1, c)) > 1]
    tot = {c: val(b, c) + val(b1, c) for c in b['cats']}
    best = max(tot, key=tot.get)
    ans = ("6차시  ① 가로: 놀이, 세로: 학생 수(명), 한 칸 1명, 막대 %s칸, 제목: 체육 시간에 하고 싶은 놀이별 학생 수 ② %d칸, 없어요 "
           "③ %s, %s, %s, 왜: 조사한 친구들이 달라서 ④ %s, %d, %s, 사실 ⑤ (예: 두 반이 함께 하고 싶은 놀이는 발야구! / 우리 반은 피구, 1반은 발야구가 가장 많아요)"
           % (jj(b['vals']), val(b, '피구'), rank(b)[-1], '·'.join(same1), best, best, tot[best], best))
    lu = ST['lunch']
    w.step("⑥ 도전하기", "급식 기사 ― 많이 먹고 싶어 하는 메뉴부터 위에서 차례대로")
    w.table(dtable(["카레", "잔치국수", "짜장면", "비빔밥"], [7, 2, 11, 4], '메뉴', '학생 수(명)'))
    w.text("막대 이름을 위에서부터 차례대로 쓰고, 가로 눈금 한 칸을 1명으로 하여 막대를 그려 보세요.")
    w.pic(bar_svg(lu, bars=None, names=[None] * 4), 125)
    ans += " ⑥ 위에서부터 %s" % ', '.join('%s %d칸' % (c, val(lu, c)) for c in rank(lu))
    return ans


def h_st_l7(w, D):
    rn, bm, tw0 = H['dustM'], H['parkM'], H['want']
    w.lesson(7, "탐구 정리하기(O)", "그래프로 기사를 써요 ― 사실과 의견", "막대그래프에서 찾은 사실로 어떻게 기사를 쓸 수 있을까요?",
             "도현이는 4월부터 7월까지 날마다 아침에 학교 앞 보관대의 자전거를 세어 달마다 모두 더했어요.")
    w.step("① 만져 보기 — 두 막대그래프 견주기", "미세 먼지 나쁨 일수와 공원에 온 사람 수 (가상의 자료)")
    w.pic(pair_svg([(None, bar_svg(rn)), (None, bar_svg(bm))]), 178)
    w.ask("미세 먼지 나쁨 일수가 가장 적은 달은?")
    w.ask("5월에 공원에 온 사람은 몇 명인가요?")
    w.pick("두 그래프를 보고 알 수 있는 관계는?", ["미세 먼지 나쁨 일수가 적은 달일수록 공원에 온 사람이 많아요.", "미세 먼지 나쁨 일수가 많은 달일수록 공원에 온 사람이 많아요."])
    w.why("미세 먼지 나쁨 일수가 적은 달에 공원에 온 사람이 많은 까닭을 생각해 써 보세요.", 1)
    w.step("② 그려 보기 — 기사 글 완성하기", "4학년 120명이 ‘우리 동네에 생기면 좋겠는 것’")
    w.pic(bar_svg(tw0), 140)
    assert sum(tw0['vals']) == 120
    w.fill(["가장 많은 학생이 고른 것은 (            )이고, 가장 적은 학생이 고른 것은 (            )입니다.",
            "두 번째로 많은 학생이 고른 것은 (            )이고 (      )명입니다."])
    w.step("③ 말해 보기 — 사실과 의견 나누기")
    w.choices([("수영장을 고른 학생이 34명으로 가장 많아요.", "( 사실 / 의견 )"),
               ("동네에 공연장이 생기면 정말 신날 거예요.", "( 사실 / 의견 )"),
               ("자전거 길을 고른 학생 수는 놀이터보다 8명 더 많아요.", "( 사실 / 의견 )"),
               ("도서관을 고른 학생은 28명이에요.", "( 사실 / 의견 )"),
               ("놀이터는 아이들에게 꼭 필요해요.", "( 사실 / 의견 )")])
    assert rank(tw0)[0] == '수영장' and val(tw0, '자전거 길') - val(tw0, '놀이터') == 8 and val(tw0, '도서관') == 28
    w.step("④ 약속하기 — 사실과 의견")
    w.fill(["막대그래프의 수나 막대의 길이로 확인할 수 있는 것은 (      )이에요.",
            "사실을 보고 ‘~하면 좋겠어요’처럼 든 생각은 (      )이에요. 기사에 의견을 쓸 때는 그래프에서 찾은 (      )을 근거로 들어요."])
    w.step("⑤ 확인하기 — 내 기사 쓰기")
    w.labeled([("사실", ""), ("의견", "")], row_h=5600)
    rt = rank(tw0)
    ans = ("7차시  ① %s, %d명, ①, 왜: (예: 공기가 맑은 날에 밖에서 놀기 좋아서) ② %s, %s, %s, %d "
           "③ 사실, 의견, 사실, 사실, 의견 ④ 사실, 의견, 사실 ⑤ (예: 수영장 34명 가장 많음 → 동네에 수영장을 만들면 좋겠어요)"
           % (rank(rn)[-1], val(bm, '5월'), rt[0], rt[-1], rt[1], val(tw0, rt[1])))
    tw = ST['town']
    w.step("⑥ 도전하기", "‘우리 동네에서 고치고 싶은 것’ 더 읽기")
    w.ask("보관대 부족을 고른 학생 수는 쓰레기의 몇 배인가요?")
    w.ask("위험한 길을 고른 학생은 어두운 길보다 몇 명 더 많나요?")
    w.ask("낡은 놀이터와 어두운 길을 고른 학생은 모두 몇 명인가요?")
    ans += (" ⑥ %d배, %d명, %d명"
            % (val(tw, '보관대 부족') // val(tw, '쓰레기'), val(tw, '위험한 길') - val(tw, '어두운 길'),
               val(tw, '낡은 놀이터') + val(tw, '어두운 길')))
    return ans


def h_st_l8(w, D):
    p = H['place']
    k1 = [dict(kind="bike", name="자전거 보관대", n=6), dict(kind="park", name="공원", n=8), dict(kind="hospital", name="병원", n=2),
          dict(kind="library", name="도서관", n=4), dict(kind="school", name="학교", n=3)]
    assert [k['n'] for k in k1] == p['vals']
    w.lesson(8, "탐구 정리하기(O)", "생각을 더하다 ― 우리 동네 지도 기사",
             "지도 속 자료를 막대그래프로 나타내면 우리 동네를 어떻게 소개할 수 있을까요?",
             "기자단이 우리 동네 지도를 만들었어요. 지도 속 장소를 세어 동네 소개 기사를 써요.")
    w.step("① 만져 보기 — 지도 기호 세기", "강 건너 새 동네 지도")
    w.text("한 가지 기호씩 차례로 세고, 센 기호에는 ／ 표시를 해 보세요.")
    w.pic(map_svg(k1, 53, '강 건너 새 동네 지도'), 140)
    w.table(dtable(p['cats'], p['vals'], '장소', '수(개)', blanks=(0, 1, 2, 3, 4, 'sum')))
    w.step("② 그려 보기 — 막대그래프로", "가로 막대그래프 (가로 눈금 한 칸 1개)")
    w.pic(bar_svg(V(p, horiz=True), bars=None, title=False), 125)
    w.pick("제목으로 알맞은 것은?", ["새 동네의 장소별 수", "새 동네에 사는 사람 수", "좋아하는 장소"])
    w.step("③ 말해 보기 — 표와 그래프 중에서", "이럴 때는 무엇이 좋을까요?")
    w.choices([("장소의 수를 정확하게 적어 두려면?", "( 표 / 막대그래프 )"),
               ("가장 많은 장소를 멀리서도 한눈에 보이게 하려면?", "( 표 / 막대그래프 )")])
    w.why("동네 소개 기사에 막대그래프를 고른 까닭을 써 보세요.", 1)
    w.step("④ 약속하기 — 소개 기사 완성하기", "몇 배인지도 넣어서")
    w.fill(["이 동네에서 가장 많은 곳은 (          )이고, 두 번째로 많은 곳은 (              )입니다.",
            "병원은 (    )개로 가장 적고, 공원은 병원의 (    )배입니다."])
    w.step("⑤ 확인하기 — 제안 기사 쓰기")
    w.labeled([("사실", ""), ("제안", "")], row_h=5600)
    r = rank(p)
    ans = ("8차시  ① %s, 합계 %d ② 가로 막대 %s칸, ① ③ 표, 막대그래프, 왜: (예: 어떤 장소가 많고 적은지 막대의 길이로 한눈에 보여서) ④ %s, %s, %d, %d "
           "⑤ (예: 병원이 2개로 가장 적어요 / 병원을 하나 더 만들면 좋겠어요)"
           % (', '.join('%s %d' % t for t in zip(p['cats'], p['vals'])), sum(p['vals']), jj(p['vals']), r[0], r[1], val(p, '병원'),
              val(p, '공원') // val(p, '병원')))
    k2 = [dict(kind="bike", name="자전거 보관대", n=3), dict(kind="park", name="공원", n=6), dict(kind="hospital", name="병원", n=2),
          dict(kind="library", name="도서관", n=4), dict(kind="school", name="학교", n=3)]
    w.step("⑥ 도전하기", "옆 동네 지도")
    w.pic(map_svg(k2, 41, '옆 동네 지도'), 135)
    w.table(dtable([k['name'] for k in k2], [k['n'] for k in k2], '장소', '수(개)', blanks=(0, 1, 2, 3, 4, 'sum')))
    w.why("우리 동네와 옆 동네를 견주어 알 수 있는 점을 써 보세요.", 1)
    ans += (" ⑥ %s, 합계 %d, 왜: (예: 우리 동네는 자전거 보관대가, 옆 동네는 공원이 가장 많아요)"
            % (', '.join('%s %d' % (k['name'], k['n']) for k in k2), sum(k['n'] for k in k2)))
    return ans


def h_st_l9(w, D):
    b, b2 = H['sbal'], H['sbal2']
    w.lesson(9, "발표하기(P)", "놀이를 더하다 ― 체육 시간 풍선 기록 기사", "놀이 기록을 막대그래프로 나타내면 무엇을 알 수 있을까요?",
             "체육 시간에 모둠별로 풍선 띄우기 놀이를 했어요. 손바닥, 머리, 어깨, 무릎의 순서대로 풍선을 띄우고 횟수를 세요.")
    w.step("① 만져 보기 — 풍선 띄우기 놀이", "우리 모둠 기록 (두 판)")
    w.table([["신체 부위", "손바닥", "머리", "어깨", "무릎", "합계"], ["1판(회)", "", "", "", "", ""], ["2판(회)", "", "", "", "", ""]])
    w.step("② 그려 보기 — 표로 정리하기", "태오네 모둠의 두 번째 기록")
    w.text("빨간 사선이 있는 묶음 하나가 5회예요. 세어서 표를 완성해 보세요.")
    w.pic(tally_svg(b['cats'], b['vals'], '태오네 모둠의 두 번째 기록'), 120)
    w.table(dtable(b['cats'], b['vals'], '신체 부위', '횟수(회)', blanks=(0, 1, 2, 3, 'sum')))
    w.step("③ 말해 보기 — 막대그래프로 나타내기", "세로 눈금 12칸")
    w.choices([("세로 눈금 한 칸의 크기는?", "( 1회 / 2회 / 5회 )")])
    w.pic(bar_svg(b, bars=None, ticks='zero', title=False), 105)
    w.pick("제목으로 알맞은 것은?", ["신체 부위별 풍선을 띄운 횟수(두 번째 기록)", "태오네 모둠 친구 이름", "풍선의 크기"])
    w.step("④ 약속하기 — 다른 모둠과 견주기", "두 그래프의 눈금 한 칸은 모두 2회")
    w.pic(pair_svg([("태오네 모둠", bar_svg(b)), ("서아네 모둠", bar_svg(b2))]), 165)
    w.choices([("어깨로 풍선을 더 많이 띄운 모둠은?", "( 태오네 모둠 / 서아네 모둠 )")])
    w.ask("머리로 띄운 횟수는 두 모둠이 몇 회 차이 나나요?")
    w.ask("태오네 모둠이 두 번째로 많이 띄운 신체 부위는?")
    w.pick("두 막대그래프를 보고 알 수 있는 사실은?", ["두 모둠 모두 어깨로 가장 적게 띄웠어요.", "두 모둠 모두 머리로 가장 많이 띄웠어요."])
    assert rank(b)[-1] == rank(b2)[-1] == '어깨'
    w.step("⑤ 확인하기 — 체육 기사 발표하기")
    w.labeled([("사실", ""), ("의견", "")], row_h=5600)
    ans = ("9차시  ① (모둠 기록) ② %s, 합계 %d ③ 2회 → 0·2·4…24, 막대 %s칸, ① ④ %s, %d회, %s, ① "
           "⑤ (예: 태오네 손바닥 20회, 서아네 머리 22회 / 어깨로 띄우는 연습을 더 하면 좋겠어요)"
           % (', '.join('%s %d' % t for t in zip(b['cats'], b['vals'])), sum(b['vals']), jj(cells_of(b)),
              '서아네 모둠' if val(b2, '어깨') > val(b, '어깨') else '태오네 모둠', abs(val(b, '머리') - val(b2, '머리')), rank(b)[1]))
    bl = ST['ball']
    w.step("⑥ 도전하기", "책으로 공 띄우기 ― 세로 눈금 15칸")
    w.table(dtable(bl['cats'], bl['vals'], '공의 종류', '횟수(회)'))
    w.choices([("세로 눈금 한 칸의 크기는?", "( 1회 / 2회 / 5회 / 10회 )")])
    w.pic(bar_svg(bl, bars=None, ticks='zero'), 110)
    w.why("그 크기로 정한 까닭을 써 보세요.", 1)
    ans += (" ⑥ 2회, 막대 %s칸, 왜: 가장 큰 수 30회를 15칸에 나타내려면 한 칸이 2회여야 하고, 모든 수가 짝수예요"
            % '·'.join(map(str, cells_of(bl))))
    return ans


def h_st_l10(w, D):
    afh, cn = H['after'], H['corner']
    w.lesson(10, "발표하기(P)", "학급 신문을 펴내요 ― 공부한 내용 확인", "막대그래프를 배우기 전과 후, 내 생각은 어떻게 달라졌나요?",
             "학급 신문 「햇살 4-2 소식」 마지막 호를 만들어요.")
    w.step("① 만져 보기 — 방과 후 수업 기사", "새 학기 방과 후 수업")
    w.pic(bar_svg(afh), 110)
    w.ask("세로 눈금 한 칸은 몇 명을 나타내나요?")
    w.ask("미술 수업을 신청한 학생은 몇 명인가요?")
    w.step("② 그려 보기 — 옳은 설명 찾기")
    w.choices([("신청한 학생 수가 가장 많은 수업은 축구입니다.", "( ○ / × )"),
               ("합창 수업을 신청한 학생은 4명입니다.", "( ○ / × )"),
               ("과학 수업을 신청한 학생 수는 합창 수업의 2배입니다.", "( ○ / × )")])
    assert rank(afh)[0] == '축구' and val(afh, '과학') == 2 * val(afh, '합창') and val(afh, '합창') != 4
    w.step("③ 말해 보기 — 표와 막대그래프 완성하기", "독자 설문 2 ‘읽고 싶은 신문 코너’(24명)")
    tc, tv = ["칭찬 릴레이", "날씨", "책 소개", "게임", "동물"], [8, 3, 6, 5, 2]
    assert sum(tv) == 24
    w.table(dtable(tc, tv, '코너', '학생 수(명)', blanks=(3,)))
    w.text("표의 빈칸을 채우고, 축 이름과 빈 막대 이름을 쓴 뒤 날씨·동물의 막대를 그려 보세요.")
    w.pic(bar_svg(cn, lock={1, 2, 3}, names=["날씨", None, None, "칭찬 릴레이", "동물"], axes=False), 130)
    w.step("④ 약속하기 — 신문 배달 미로", "옳으면 ○, 옳지 않으면 × 차례로 배달할 곳 찾기")
    st = [("막대그래프의 가로에 나타낸 것은 학생 수입니다.", True), ("가로 눈금 한 칸은 2명을 나타냅니다.", False),
          ("가장 많은 학생이 읽고 싶어 하는 코너는 칭찬 릴레이입니다.", True), ("동물 코너를 읽고 싶어 하는 학생은 2명입니다.", True)]
    assert rank(cn)[0] == '칭찬 릴레이' and val(cn, '동물') == 2
    w.choices([("%d. %s" % (i + 1, t), "( ○ / × )") for i, (t, _) in enumerate(st)])
    key = ' '.join('○' if a else '×' for _, a in st)
    opts = [("○ ○ ○ ×", "보건실"), (key, "행정실"), ("× × ○ ×", "급식실"), ("○ × × ○", "도서관")]
    assert len({o[0] for o in opts}) == 4
    w.table([["○× 차례"] + [o[0] for o in opts], ["배달할 곳"] + [o[1] for o in opts]])
    w.ask("신문을 배달할 곳은?")
    w.step("⑤ 확인하기 — 예전 생각, 지금 생각", "1차시에 궁금했던 것을 떠올리며")
    write3(w, D, [("예전 생각", "", "막대그래프를 배우기 전의 생각"),
                  ("지금 생각", "", "배운 뒤에 바뀐 생각"),
                  ("왜 바뀌었나", "", "어떤 활동 때문에 바뀌었나요?")])
    ans = ("10차시  ① %d명, %d명 ② ○, ×(8명), ○ ③ 게임 5, 합계 24 / 세로: 코너, 가로: 학생 수(명) / 빈 막대 이름 위에서부터 책 소개(6칸), 게임(5칸) / "
           "날씨 3칸, 동물 2칸 ④ ○, ×, ○, ○ → 행정실 ⑤ (생각 쓰기)" % (afh['step'], val(afh, '미술')))
    af = ST['after']
    w.step("⑥ 도전하기", "마인드맵 ― ‘막대그래프’를 정리해요")
    w.labeled([("떠오르는 말", "(가로, 세로, 눈금 …)\n"), ("묶어 보기", "(읽을 때 / 그릴 때)\n"),
               ("이어지는 말", "(가장 큰 수와 눈금 한 칸의 크기 …)\n"), ("덧붙이는 말", "(예를 들면 …)\n")], row_h=5600)
    w.text("★ 선택 문제 — 방과 후 수업 막대그래프로 마지막 기사 질문에 답해 보세요.")
    w.pick("새 방과 후 수업을 한 반 더 연다면?", ["요리 ― 신청한 학생이 24명으로 가장 많기 때문이에요.", "바둑 ― 이름이 가장 짧기 때문이에요."])
    w.ask("요리 수업을 신청한 학생은 바둑 수업보다 몇 명 더 많나요?")
    w.ask("네 수업을 신청한 학생은 모두 몇 명인가요?")
    ans += (" ⑥ (마인드맵 — 예: 읽을 때: 가로·세로·눈금 한 칸의 크기 / 그릴 때: 축 정하기·눈금 정하기·막대·제목) ★ ①, %d명, %d명"
            % (val(af, '요리') - val(af, '바둑'), sum(af['vals'])))
    return ans


HARD = {f: globals()['h_' + f.__name__] for f in TB_LESSONS + ST_LESSONS}




def build(lessons, unit_label, ver, level, out_dir):
    s = Sheet(unit_label=unit_label, level=level, grade_label='4학년')
    w = W(s)
    D = level == '도전형'
    keys = [(HARD[fn] if D else fn)(w, D) for fn in lessons]
    w.flush()
    s.answers("【교사용】 5. 막대그래프(%s) 활동지 정답 (%s)" % (ver, level), keys,
              note="※ 이 활동지는 앱 u5-bargraph.html과 차시 번호가 같습니다.")
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, NAME % level)
    s.save(path)
    probs = check(path)
    print(('OK  ' if not probs else 'ERR ') + os.path.relpath(path, ROOT), probs or '', '쪽 나눔 %d' % sum('pageBreak="1"' in b for b in s.body))
    return probs


def main():
    bad = []
    for level in ('기본형', '도전형'):
        bad += build(TB_LESSONS, "4-1 수학 5. 막대그래프(교과서 차시)", "교과서 차시", level, OUT_TB)
        bad += build(ST_LESSONS, "4-1 수학 5. 막대그래프(이야기 버전)", "이야기 버전", level, OUT_ST)
    if bad:
        sys.exit(1)


if __name__ == '__main__':
    main()
