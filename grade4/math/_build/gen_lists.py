"""4학년 수학 학기 목록·README·전체 안내·Code.gs 만들기.

python3 gen_lists.py        # 1학기·2학기 모두
python3 gen_lists.py 1      # 1학기만 (sem1/, sem1-soop/)
python3 gen_lists.py 2      # 2학기만 (sem2/, sem2-soop/)

단원 원본(units/*.tb.js·*.st.js, 2학기는 units/sem2/)에서 제목·차시·기록 이름(key)을 읽습니다.
만든 뒤 루트에서 python3 _build/theme/apply_theme.py 를 돌리세요.
"""
import re, os, html, sys
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
UB = R + '/grade4/math/_build/units'

SEMS = {
    1: dict(
        units=UB,
        tb='sem1', st='sem1-soop', code='4-1', label='1학기',
        UNITS=[  # n, slug, 단원명, 붙여쓰기, emoji
            (1, 'bignum', '큰 수', '큰수', '🔢'),
            (2, 'angle', '각도', '각도', '📐'),
            (3, 'muldiv', '곱셈과 나눗셈', '곱셈과나눗셈', '✖️'),
            (4, 'move', '평면도형의 이동', '평면도형의이동', '🔄'),
            (5, 'bargraph', '막대그래프', '막대그래프', '📊'),
            (6, 'pattern', '규칙과 관계', '규칙과관계', '🧩'),
        ],
        TB_DE={
            1: '예준이의 나눔과 기부 — 만, 다섯 자리 수, 십만·백만·천만, 억, 조, 뛰어 세기, 수의 크기 비교까지',
            2: '숲 놀이터 — 각의 크기 비교, 각도기로 재기, 예각과 둔각, 어림, 각도의 합과 차, 삼각형·사각형의 각의 크기의 합까지',
            3: '가정의 달 축제 자원봉사 — (세 자리 수)×(몇십·몇십몇), 몇십·몇십몇으로 나누기, 어림셈까지',
            4: '그림자 연극 「두두의 소원」 — 평면도형 밀기·뒤집기·돌리기, 길 연결과 인형극까지',
            5: '환경 보호 실천 학교 — 막대그래프 알기·읽기·나타내기, 자료를 조사해 나타내기, 생활에 활용하기까지',
            6: '수리수리 수학 나라 — 수·도형·계산식의 배열에서 규칙 찾기, 크기가 같은 두 양을 등호(=)로 나타내기까지',
        },
        TB_SRC={1: '예준이와 함께 나눔과 기부로 세상을 아름답게', 2: '지안이와 친구들의 숲 놀이터', 3: '선우네 가족의 가정의 달 축제 자원봉사',
                4: '그림자 연극 「두두의 소원」', 5: '이서네 환경 보호 실천 학교', 6: '하진이와 친구들의 수리수리 수학 나라'},
        ST_EMO={1: '🚀', 2: '🎡', 3: '🔬', 4: '🎮', 5: '📰', 6: '🧩'},
        ST_DE={
            1: '우주 과학관 견학을 준비하며 견학비·관람객 수·우주 거리 속 큰 수를 읽고 쓰고, 뛰어 세고, 비교해요',
            2: '새 놀이터를 설계하며 각의 크기 비교·각도기로 재기·어림·각도의 합과 차, 로봇 청소기의 회전한 각까지',
            3: '체험 키트를 곱셈으로 세고, 재료를 나눗셈으로 똑같이 나누고, 축제 예산을 어림해요',
            4: '로봇 모모를 밀고, 뒤집고, 돌리며 쉬는 시간에 할 도형 퍼즐 게임을 만들어요',
            5: '궁금한 것을 조사해 표와 막대그래프로 정리하고, 사실과 의견을 나누어 학급 신문 기사를 써요',
            6: '규칙과 관계 이야기 — 수·도형·계산식의 배열에서 규칙을 찾고, 크기가 같은 두 양을 식으로 나타내요',
        },
        st_names='우주 탐험대, 놀이터 설계단, 과학 축제 준비 위원회, 게임 제작소, 조사 기자단',
        group_readme=('지도서에서 두 차시로 묶인 활동(5단원 5~6차시, 6단원 9~10차시)은 한 차시 칸으로 두고 번호를 `5~6`처럼 적었습니다.\n'
                      '4단원은 지도서에서 두 차시로 묶인 3~4차시·5~6차시를 ⑴ ⑵로 나누어 차시 번호를 지도서와 맞췄습니다.'),
        group_hash='(묶인 차시는 `#5`)',
        group_guide='지도서에서 두 차시로 묶인 활동(교과서 5단원 5~6차시, 6단원 9~10차시)은 한 칸으로 두고 번호를 `5~6`처럼 적었습니다.',
        print_units=('- 각도를 재거나 그리는 **2단원 각도**, 모눈 위에서 옮기는 **4단원 평면도형의 이동**, 눈금을 세는 **5단원 막대그래프**는\n'
                     '  실제 크기로 인쇄되는지 확인하세요. 나머지 단원은 조금 줄어도 괜찮습니다.'),
        book='지도서 6권(4-1 1~6단원)',
        scope='4학년 1학기 범위를 벗어난 내용(예: 분수·소수의 덧셈과 뺄셈, 삼각형·사각형의 분류, 꺾은선그래프 — 4학년 2학기)은 넣지 않았습니다.',
    ),
    2: dict(
        units=UB + '/sem2',
        tb='sem2', st='sem2-soop', code='4-2', label='2학기',
        UNITS=[
            (1, 'fracadd', '분수의 덧셈과 뺄셈', '분수의덧셈과뺄셈', '➕'),
            (2, 'triangle', '삼각형', '삼각형', '🔺'),
            (3, 'decimal', '소수의 덧셈과 뺄셈', '소수의덧셈과뺄셈', '🔢'),
            (4, 'quad', '사각형', '사각형', '🔷'),
            (5, 'linegraph', '꺾은선그래프', '꺾은선그래프', '📈'),
            (6, 'polygon', '다각형', '다각형', '🔶'),
        ],
        TB_DE={
            1: '우주 호텔의 시우와 혜지 — 진분수·대분수의 덧셈과 뺄셈, 자연수와 분수의 뺄셈, 음료 만들기와 말 튕기기 놀이까지',
            2: '예나와 길고양이 꾹이 — 이등변삼각형·정삼각형과 그 성질, 예각삼각형과 둔각삼각형, 두 가지 기준으로 분류하기, 구조물 속 삼각형까지',
            3: '할아버지 댁에서 찾은 소수 — 소수 두 자리·세 자리 수, 크기 비교, 소수 사이의 관계, 소수의 덧셈과 뺄셈, 나트륨 권장량 비교까지',
            4: '하율이네 놀이공원 나들이 — 수직과 수선, 평행과 평행선, 평행선 사이의 거리, 사다리꼴·평행사변형·마름모, 여러 가지 사각형까지',
            5: '힘찬시와 소망시의 편지 — 꺾은선그래프 알기·읽기·나타내기, 자료를 조사해 나타내기, 생활에 활용하기, 가격 변화와 감정 그래프까지',
            6: '은하네 가족의 어린이 미술관 — 다각형과 정다각형, 대각선, 모양 조각으로 모양 만들기와 채우기, 공학 도구로 나만의 모양까지',
        },
        TB_SRC={1: '우주 호텔의 시우와 혜지', 2: '예나와 길고양이 꾹이', 3: '할아버지 댁에서 찾은 소수',
                4: '하율이네 놀이공원 나들이', 5: '힘찬시와 소망시의 학급 편지', 6: '은하네 가족의 어린이 미술관 나들이'},
        ST_EMO={1: '🍳', 2: '🔺', 3: '🏅', 4: '🗺️', 5: '🌱', 6: '🎨'},
        ST_DE={
            1: '나눔 파티 요리를 준비하며 주스·반죽·리본·밀가루의 양을 분수로 더하고 빼요',
            2: '운동장 텐트 캠프를 준비하며 텐트 뼈대·깃발·지붕 트러스의 삼각형을 재고, 접고, 그리고, 변과 각으로 나누어요',
            3: '운동회 기록원이 되어 멀리뛰기·이어달리기·공 던지기 기록과 마신 물의 양을 소수로 쓰고, 비교하고, 더하고 빼요',
            4: '학교 지도를 만들며 수직·평행인 복도, 복도 폭, 화단·주차 칸·타일의 사다리꼴·평행사변형·마름모를 찾아요',
            5: '강낭콩의 키와 교실 기온을 재어 꺾은선그래프로 나타내고, 변화를 읽고 앞날을 예상해요',
            6: '창문 스티커·바닥 타일·게시판 작품·현수막을 꾸미며 다각형·정다각형·대각선, 모양 만들기와 채우기를 해요',
        },
        st_names='요리 교실, 텐트 캠프, 운동회 기록원, 학교 지도 만들기, 강낭콩 관찰 연구소, 교실 꾸미기 디자인단',
        group_readme=('지도서에서 두 차시로 묶인 활동(3단원 2~3차시·4~5차시, 5단원 5~6차시, 6단원 2~3차시)은 한 차시 칸으로 두고 번호를 `2~3`처럼 적었습니다.'),
        group_hash='(묶인 차시는 `#2`)',
        group_guide='지도서에서 두 차시로 묶인 활동(교과서 3단원 2~3·4~5차시, 5단원 5~6차시, 6단원 2~3차시)은 한 칸으로 두고 번호를 `2~3`처럼 적었습니다.',
        print_units=('- 길이와 각을 재는 **2단원 삼각형**, 수선·평행선을 긋고 거리를 재는 **4단원 사각형**, 눈금을 세는 **5단원 꺾은선그래프**,\n'
                     '  점 종이에 그리는 **6단원 다각형**은 실제 크기로 인쇄되는지 확인하세요. 나머지 단원은 조금 줄어도 괜찮습니다.'),
        book='지도서(4-2 1~6단원)',
        scope='4학년 2학기 범위를 벗어난 내용(예: 분모가 다른 분수의 덧셈과 뺄셈, 소수의 곱셈과 나눗셈, 다각형의 둘레와 넓이 — 5학년)은 넣지 않았습니다.',
    ),
}


def parse(path):
    if not os.path.exists(path):
        return None
    s = open(path, encoding='utf-8').read()
    app = re.search(r'const APP\s*=\s*\{(.*?)\};', s, re.S).group(1)
    g = lambda k: re.search(k + r'\s*:\s*"([^"]*)"', app).group(1)
    L = s[s.find('const LESSONS'):]
    les = [(m.group(1), m.group(2), m.group(3)) for m in re.finditer(
        r'\bno:\s*"?([\d~]+)"?\s*,\s*title:\s*"([^"]*)"\s*,\s*soop:\s*"([^"]*)"', L)]
    return dict(title=g('title'), key=g('key'), lessons=les)


def count(les):
    return int(les[-1][0].split('~')[-1])


E = lambda t: html.escape(t, quote=False)


def lessons_html(fn, les):
    items = ''.join(f'<li><a href="{fn}#{no.split("~")[0]}"><b>{no}</b>{E(t)}</a></li>' for no, t, _ in les)
    return (f'<details class="les"><summary>📋 차시 목록 · {count(les)}차시</summary>'
            f'<ol class="les-l">{items}</ol></details>\n')


SHEET = ('<a class="card" href="sheets/{n}단원_{nb}_활동지_기본형.hwpx"><span class="tag" style="background:#1C8C7A">🖨️ 활동지</span><span class="nm">📄 기본형</span><span class="de">낱말 상자·빈칸 문장·예시로 도와줍니다</span></a>\n'
         '<a class="card" href="sheets/{n}단원_{nb}_활동지_도전형.hwpx"><span class="tag" style="background:#2F74E0">🖨️ 활동지</span><span class="nm">📄 도전형</span><span class="de">도움을 빼고 서술형·심화 문제를 더했습니다</span></a>\n')

LES_CSS = ('\nhtml details.les{margin:12px 0 0;background:var(--paper);border:3px solid var(--line);border-radius:16px;padding:8px 16px}'
           '\nhtml details.les summary{cursor:pointer;font-weight:700;color:var(--soft);font-size:clamp(17px,1.7vw,20px)}'
           '\nhtml .les-l{list-style:none;margin:8px 0 4px;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr));gap:4px 18px}'
           '\nhtml .les-l a{display:flex;gap:10px;align-items:baseline;color:var(--ink);text-decoration:none;font-size:clamp(16px,1.6vw,19px);padding:3px 0;word-break:keep-all}'
           '\nhtml .les-l a:hover{text-decoration:underline}'
           '\nhtml .les-l b{flex:none;min-width:2.4em;color:var(--soft);font-variant-numeric:tabular-nums}\n')


def page(tpl, title, crumb_last_html, body):
    s = open(tpl, encoding='utf-8').read()
    s = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', s, count=1)
    s = s.replace('</style>', LES_CSS + '</style>', 1)
    a, b = s.index('<h1>'), s.index('<footer')
    s = s[:a] + body + s[b:]
    # crumb: 3학년 -> 4학년
    nav = re.search(r'<nav class="crumb".*?</nav>', s, re.S)
    nv = nav.group(0).replace('>3학년<', '>4학년<')
    s = s[:nav.start()] + nv + s[nav.end():]
    return s


def build(sem):
    C = SEMS[sem]
    UNITS, TB_DE, TB_SRC, ST_EMO, ST_DE = C['UNITS'], C['TB_DE'], C['TB_SRC'], C['ST_EMO'], C['ST_DE']
    TBD, STD, CODE, LB = C['tb'], C['st'], C['code'], C['label']
    GUIDE = f'{CODE}수학_개념계단_전체안내.md'
    D = {}
    for n, slug, nm, nb, emo in UNITS:
        D[n] = dict(tb=parse(f'{C["units"]}/u{n}-{slug}.tb.js'), st=parse(f'{C["units"]}/u{n}-{slug}.st.js'))
    first = UNITS[0][1]

    # ---------- 교과서 버전 ----------
    body = [f'<h1>4학년 {LB} 수학 학습 자료</h1>\n',
            '<p class="sub">2022 개정 교육과정 · 교과서 차시 그대로 만든 자료입니다.<br>\n'
            '모든 차시가 <b>만져 보기 → 그려 보기 → 말해 보기 → 약속하기 → 확인하기</b> 다섯 계단과 ★도전 계단으로 되어 있어요.</p>\n',
            '<p class="gsub">단원을 누르면 그 단원의 <b>💻 웹앱</b>과 <b>🖨️ 활동지(기본형·도전형)</b>가 나와요. <b>📋 차시 목록</b>에서 차시를 누르면 그 차시가 바로 열려요.</p>\n']
    for n, slug, nm, nb, emo in UNITS:
        tb = D[n]['tb']; fn = f'u{n}-{slug}.html'
        body.append(f'<h2>{emo} {n}단원 · {nm}</h2>\n<div class="grid">\n'
                    f'<a class="card" href="{fn}"><span class="tag" style="background:#D9731A">💻 웹앱</span><span class="nm">{emo} {nm}</span>'
                    f'<span class="de">{TB_DE[n]} {count(tb["lessons"])}차시</span></a>\n'
                    + SHEET.format(n=n, nb=nb) + '</div>\n' + lessons_html(fn, tb['lessons']))
    body.append('<h2>📑 함께 쓰는 문서</h2>\n<p class="gsub">반 전체 기록을 구글 시트에 모으거나, 수업 구성을 한눈에 볼 때 씁니다.</p>\n<div class="grid">\n'
                f'<a class="card" href="../{STD}/{GUIDE}"><span class="tag" style="background:#6A4FC9">교사용</span><span class="nm">📖 전체 안내서</span><span class="de">두 버전의 구성·차시 목록·인쇄 안내(글 파일)</span></a>\n'
                f'<a class="card" href="../{STD}/Code.gs"><span class="tag" style="background:#6A4FC9">설치</span><span class="nm">⚙️ Code.gs</span><span class="de">반 전체 기록을 구글 시트에 모으는 앱스 스크립트(두 버전 공용, README 참고)</span></a>\n'
                f'<a class="card" href="../{STD}/index.html"><span class="tag" style="background:#6A4FC9">이야기 버전</span><span class="nm">🧑‍🏫 홍지희 선생님 버전</span><span class="de">같은 내용을 우리 학교·학급 이야기로 다시 짠 수업</span></a>\n'
                '</div>\n')
    body.append('<h2>💡 쓰는 방법</h2>\n'
                '<p class="gsub"><b>💻 웹앱</b> — 전자칠판이나 크롬북에서 바로 씁니다. 앞 계단을 해결해야 다음 계단이 열리고, 막히면 도움이 단서 → 낱말 → 답 따라 쓰기 세 단계로 나옵니다. 주소 끝에 <code>#3</code>처럼 차시 번호를 붙이면 그 차시가 바로 열려요.</p>\n'
                '<p class="gsub"><b>🖨️ 활동지</b> — 흑백 인쇄용 hwpx입니다. <b>기본형</b>은 낱말 상자와 빈칸 문장으로 돕고, <b>도전형</b>은 도움을 빼고 서술형·심화를 더했습니다. 맨 뒤에 교사용 정답이 붙어 있으니 배부 전에 마지막 장을 빼세요.<br>인쇄할 때는 한글 인쇄 창의 <b>「인쇄 방식」을 「자동 인쇄」</b>로 두세요. 그것이 실제 크기입니다(「공급 용지에 맞추어」로 하면 줄어듭니다). 맨 윗줄에 10 cm 눈금자가 있으니, 처음 한 장만 뽑아 자를 대어 10 cm가 나오는지 확인하시면 됩니다.</p>\n')
    open(f'{R}/grade4/math/{TBD}/index.html', 'w', encoding='utf-8').write(
        page(R + '/grade3/math/sem1/index.html', f'4학년 {LB} 수학 · 초등교사 홍지희', None, ''.join(body)))

    # ---------- 이야기 버전 ----------
    body = [f'<h1>4학년 {LB} 수학 · 홍지희 선생님 버전</h1>\n',
            '<p class="sub">2022 개정 교육과정 · <b>우리 학교·학급 상황으로 다시 짠 이야기 수업</b>입니다.<br>교과서 차시 버전과 배우는 것은 같고, 단원마다 이야기 하나로 이어집니다.</p>\n',
            '<p class="gsub">모든 차시가 <b>만져 보기 → 그려 보기 → 말해 보기 → 약속하기 → 확인하기</b> 다섯 계단과 ★도전 계단으로 되어 있어요. <b>📋 차시 목록</b>에서 차시를 누르면 그 차시가 바로 열려요.</p>\n']
    for n, slug, nm, nb, emo in UNITS:
        st = D[n]['st']; fn = f'u{n}-{slug}.html'; em = ST_EMO[n]
        if st:
            name = st['title']; de = f'{ST_DE[n]} {count(st["lessons"])}차시'
        else:
            name = nm; de = ST_DE[n]
        body.append(f'<h2>{em} {n}단원 · {nm}</h2>\n<div class="grid">\n'
                    f'<a class="card" href="{fn}"><span class="tag" style="background:#D9731A">💻 웹앱</span><span class="nm">{em} {name}</span>'
                    f'<span class="de">{de}</span></a>\n' + SHEET.format(n=n, nb=nb) + '</div>\n'
                    + (lessons_html(fn, st['lessons']) if st else ''))
    body.append('<h2>📎 함께 쓰는 자료</h2>\n<div class="grid">\n'
                f'<a class="card" href="{GUIDE}"><span class="tag" style="background:#6A4FC9">📋 교사용</span><span class="nm">📖 전체 안내서</span><span class="de">구성·차시 목록·설치·인쇄 안내(글 파일)</span></a>\n'
                '<a class="card" href="Code.gs"><span class="tag" style="background:#6A4FC9">📋 교사용</span><span class="nm">⚙️ Code.gs</span><span class="de">학생 기록을 구글 시트에 모으는 앱스 스크립트</span></a>\n'
                '</div>\n'
                '<p class="gsub">활동지 맨 뒤 <b>마지막 한 장</b>이 교사용 정답입니다. 학생용으로 뽑을 때는 인쇄 범위에서 그 한 장만 빼면 됩니다.</p>\n')
    open(f'{R}/grade4/math/{STD}/index.html', 'w', encoding='utf-8').write(
        page(R + '/grade3/math/sem1-soop/index.html', f'4학년 {LB} 수학 · 홍지희 선생님 버전 · 초등교사 홍지희', None, ''.join(body)))

    # ---------- README (교과서) ----------
    rows = '\n'.join(f'| {n}. {nm} | `u{n}-{slug}.html` | {count(D[n]["tb"]["lessons"])} | {TB_SRC[n]} |' for n, slug, nm, nb, e in UNITS)
    pages = ', '.join(f'`index_{slug}`' for n, slug, nm, nb, e in UNITS)
    u0, uN = UNITS[0], UNITS[-1]
    unitdir = 'units/sem2/' if sem == 2 else 'units/'
    open(f'{R}/grade4/math/{TBD}/README.md', 'w', encoding='utf-8').write(f'''# 4학년 {LB} 수학 학습 자료 (교과서 차시 버전)

2022 개정 교육과정 초등학교 4학년 {LB} 수학과 수업 자료입니다.
지도서의 **차시 번호와 주제, 소재를 그대로** 따랐습니다.

모든 차시가 같은 다섯 계단으로 되어 있습니다.

**만져 보기 → 그려 보기 → 말해 보기 → 약속하기 → 확인하기**  (+ ★도전 계단)

## 단원 구성

| 단원 | 파일 | 차시 | 교과서 소재 |
|---|---|---|---|
{rows}

{C['group_readme']}

인쇄용 활동지(hwpx)는 `sheets/` 안에 단원마다 **기본형·도전형** 두 벌이 있습니다
(`{u0[0]}단원_{u0[3]}_활동지_기본형.hwpx` … `{uN[0]}단원_{uN[3]}_활동지_도전형.hwpx`).
함께 쓰는 문서(전체 안내서, `Code.gs`)는 이야기 버전 폴더 [`../{STD}/`](../{STD}/)에 있습니다(두 버전 공용).

## 쓰는 방법

`index.html`을 열면 전체 목록이 나옵니다. 앱은 HTML 파일 하나에 모든 것이 들어 있어
인터넷 없이도 열립니다(글꼴만 인터넷이 있을 때 예쁘게 보입니다).

- 앞 계단을 해결해야 다음 계단이 열립니다.
- 막히면 도움이 세 단계로 나옵니다. **2번 틀리면 단서 → 3번 틀리면 낱말 → 4번 틀리면 답을 보고 따라 쓰기**.
  따라 쓰기까지 해도 어려우면 `다음 계단`으로 넘어갈 수 있습니다(△ 표시).
- 주소 끝에 `#3`처럼 차시 번호를 붙이면 그 차시가 바로 열립니다{C['group_hash']}. 목록의 '📋 차시 목록'에서 눌러도 됩니다.
- 오른쪽 위 `선생님` → 비밀번호 → `기록 보기`로 학생 기록(틀린 답 포함)을 볼 수 있습니다.
  기본값은 이 기기에 저장된 기록만 보여 줍니다(기본 비밀번호 1234).
- 맨 아래 `📋 자료 목록으로` 단추로 이 목록에 돌아옵니다.
- 앱의 원본은 `grade4/math/_build/{unitdir}*.tb.js`입니다. 이 폴더의 단원 HTML은 직접 고치지 말고 `_build/README.md`대로 다시 만드세요.

## 반 전체 기록을 모으려면

앱 하나하나는 기기에만 기록을 남깁니다. 반 전체 기록을 한곳에 모으려면
구글 앱스 스크립트를 한 번 배포해야 합니다.

1. 새 구글 시트를 만들고 **[확장 프로그램] → [Apps Script]** 를 엽니다.
2. `../{STD}/Code.gs`를 붙여 넣고 맨 위 `TEACHER_PIN`을 선생님만 아는 숫자로 바꿉니다.
3. **[+] → HTML** 로 {pages} 파일을 만들어 이 폴더의 HTML을 통째로 붙여 넣습니다.
4. **[배포] → [새 배포] → 웹 앱**, 실행: 나, 액세스: 학교 도메인 내 모든 사용자.
5. 나온 주소 뒤에 `?page={first}`처럼 붙여 학생들에게 알려 주면 됩니다.

또는 이 폴더를 GitHub Pages로 그대로 열고, 각 HTML 안의 `endpoint: ""` 에
앱스 스크립트 배포 주소만 넣어도 됩니다.

## 인쇄할 때

- 한글 인쇄 창의 **「인쇄 방식」을 「자동 인쇄」로 두세요.** 그것이 실제 크기입니다.
  「공급 용지에 맞추어」로 하면 종이에 맞춰 줄어듭니다.
- 활동지 맨 윗줄에 **10 cm 눈금자**가 인쇄됩니다. 처음 한 장만 뽑아 자를 대어 10 cm가 나오는지 확인하면 됩니다.
  짧게 나오면 프린터 쪽 설정 문제이니, 인쇄 창의 **「설정」** 버튼에서 '용지에 맞춤'이나 '배율'을 꺼 주세요.
{C['print_units']}
- 각 파일 맨 뒤에 **교사용 정답**이 있습니다. 배부 전에 마지막 장을 빼고 인쇄하세요.

## 교육과정

2022 개정 교육과정 3~4학년군 성취기준과 {C['book']}의 단원 학습 목표·차시 계획을 따랐습니다.
{C['scope']}

---

2022 개정 교육과정 교과서·지도서를 바탕으로 만들었습니다. 만든 사람: 초등교사 홍지희
''')

    # ---------- README (이야기) ----------
    rows = '\n'.join(f'| {n} {nm} | `u{n}-{slug}.html` | {D[n]["st"]["title"] if D[n]["st"] else f"({nm} 이야기, 만드는 중)"} | {count(D[n]["st"]["lessons"]) if D[n]["st"] else ""} |' for n, slug, nm, nb, e in UNITS)
    open(f'{R}/grade4/math/{STD}/README.md', 'w', encoding='utf-8').write(f'''# 4학년 {LB} 수학 · 홍지희 선생님 버전

우리 학교·학급 상황으로 다시 짠 **이야기 수업** 자료입니다. 누구나 열어 볼 수 있습니다.

교과서 차시 버전은 [`../{TBD}/`](../{TBD}/)에 있습니다.
두 버전은 개념 계단 다섯 칸, 도움 3단계, S.O.O.P. 탐구 단계가 같고 차시 순서와 소재만 다릅니다.

| 단원 | 웹앱 | 이야기 | 차시 |
|---|---|---|---|
{rows}

인쇄용 활동지(hwpx)는 `sheets/`에 단원마다 **기본형·도전형** 두 벌이 있습니다.
교사용 자료(전체 안내서 `{GUIDE}`, `Code.gs`)도 이 폴더에 있습니다.

앱의 원본은 `grade4/math/_build/{unitdir}*.st.js`입니다. 이 폴더의 단원 HTML은 직접 고치지 말고 `_build/README.md`대로 다시 만드세요.

활동지 맨 뒤 **마지막 한 장**이 교사용 정답입니다.
학생용으로 뽑을 때는 인쇄 범위에서 그 한 장만 빼면 됩니다.
''')

    # ---------- Code.gs ----------
    cg = open(R + '/grade3/math/sem1-soop/Code.gs', encoding='utf-8').read()
    lines = ''.join(f' *    - {n}단원 {nm}:{" " * max(1, 9 - len(nm))}?page={slug} (index_{slug})\n' for n, slug, nm, nb, e in UNITS)
    cg = re.sub(r' \*    - 1단원 덧셈과 뺄셈.*?\(index_fracdec\)\n', lines, cg, flags=re.S)
    cg = cg.replace('3학년 1학기', f'4학년 {LB}')
    files = ', '.join(f"{slug}: 'index_{slug}'" for n, slug, nm, nb, e in UNITS)
    cg = re.sub(r"const files = \{ hub: 'index_hub', .*?\};", "const files = { hub: 'index_hub', " + files + " };", cg)
    open(f'{R}/grade4/math/{STD}/Code.gs', 'w', encoding='utf-8').write(cg)

    # ---------- 전체 안내 ----------
    def lesson_md(v):
        out = []
        for n, slug, nm, nb, e in UNITS:
            d = D[n][v]
            if not d:
                out.append(f'**{n}. {nm} — ({nm} 이야기, 만드는 중)**\n\n앱이 완성되면 차시 목록을 이 자리에 채웁니다.\n')
                continue
            sub = d['title'] if v == 'st' else TB_SRC[n]
            out.append(f'**{n}. {nm} — {sub}**\n\n' + '\n'.join(f'{no}. {t} · {so}' for no, t, so in d['lessons']) + '\n')
        return '\n'.join(out)

    pre = 's' + CODE.replace('-', '')
    st_rows = '\n'.join(f'| {n}. {nm} | {D[n]["st"]["title"] if D[n]["st"] else "(만드는 중)"} | {count(D[n]["st"]["lessons"]) if D[n]["st"] else ""} | `{n}단원_{nb}_활동지_기본형/도전형` | `u{n}-{slug}.html` | `{D[n]["st"]["key"] if D[n]["st"] else f"{pre}-{slug}-v1"}` |' for n, slug, nm, nb, e in UNITS)
    tb_rows = '\n'.join(f'| {n}. {nm} | {TB_SRC[n]} | {count(D[n]["tb"]["lessons"])} | `{n}단원_{nb}_활동지_기본형/도전형` | `u{n}-{slug}.html` | `{D[n]["tb"]["key"]}` |' for n, slug, nm, nb, e in UNITS)
    open(f'{R}/grade4/math/{STD}/{GUIDE}', 'w', encoding='utf-8').write(f'''# 4학년 {LB} 수학 · 개념 계단 자료 (1~6단원 전체)

두 가지 버전이 있습니다. 내용과 구조(개념 계단 다섯 칸, 도움 3단계, 선생님 확인 화면)는 같고, **차시 순서와 문제 상황(소재)만** 다릅니다.

- **이야기 버전(홍지희 선생님 버전, `{STD}/`)** — 우리 학교·학급 상황으로 새로 구성({C['st_names']}). 단원마다 이야기 하나로 이어지는 수업·복습·학급 프로젝트용.
- **교과서 차시 버전(`{TBD}/`)** — 지도서의 차시 번호·주제·소재를 그대로 따름. 교과서 진도에 맞춘 본 수업용.

두 버전 모두 공개 목록입니다(잠금 없음). 앱 원본은 `grade4/math/_build/{unitdir}`(`*.tb.js` 교과서, `*.st.js` 이야기)이고, 3학년 앱과 같은 엔진을 씁니다.

## 1. 전체 구성

### 이야기 버전

| 단원 | 이야기 | 차시 | 활동지(hwpx, `sheets/`) | 웹앱(html) | 기록 이름(key) |
|---|---|---|---|---|---|
{st_rows}

### 교과서 차시 버전

| 단원 | 교과서 소재 | 차시 | 활동지(hwpx, `sheets/`) | 웹앱(html) | 기록 이름(key) |
|---|---|---|---|---|---|
{tb_rows}

기록 이름(key)은 학생 기록을 기기에 저장하는 이름입니다. 바꾸면 학생 기록이 새로 시작되니 바꾸지 마세요.

### 공통 파일

`Code.gs`(학생 기록을 구글 시트에 모으는 앱스 스크립트, 두 버전 공용), 이 안내서.

**활동지 24개 파일 · 웹앱 12개**입니다.

## 2. 공통 설계 — 개념 계단

모든 차시는 같은 다섯 계단으로 되어 있습니다.

1. **만져 보기** — 구체물·조작으로 직접 해 보기
2. **그려 보기** — 한 것을 그림·표로 나타내기
3. **말해 보기** — 알게 된 것을 내 말(빈칸 문장)로 설명하기
4. **약속하기** — 용어와 기호, 계산 방법으로 정리하기
5. **확인하기** — 자주 하는 실수를 골라내는 문제로 점검하기

웹앱에서는 앞 계단을 해결해야 다음 계단이 열리고, 다섯 계단을 다 오르면 **★도전 계단**이 열립니다. 활동지 도전형에도 같은 자리에 ⑥ 도전하기가 있습니다.
끌어서 하는 조작 활동은 모두 **버튼으로도** 할 수 있습니다. 교과서 버전은 '확인하기' 단추로, 이야기 버전은 단추 없이 저절로 확인합니다.

## 3. S.O.O.P. 탐구 단계 배치

| 단계 | 들어가는 차시 |
|---|---|
| 개념 찾기(S) | 각 단원 1차시(도입) |
| 개념 구축하기(O) | 개념·원리를 쌓는 가운데 차시들 |
| 탐구 정리하기(O) | 생각을 더하다 |
| 발표하기(P) | 놀이를 더하다, 공부한 내용을 확인해요(이야기 버전은 단원 발표회) |

## 4. 도움 3단계

| 단계 | 열리는 때 | 보여 주는 것 |
|---|---|---|
| 1단계 · 단서 | 2번 틀림 | 실마리 한 줄. 더 누르면 다음 단서, 마지막은 그 차시의 개념 정리 |
| 2단계 · 낱말 | 3번 틀림 | 그 계단·단원의 중요한 낱말 |
| 3단계 · 답 | 4번 틀림 | 답을 보여 주고 따라 쓰게 함. 어려우면 [다음 계단]으로 넘어갈 수 있음(△) |

선생님 화면에는 `5/5 △2 (×7)`처럼 나오고, △가 많은 계단이 다시 가르칠 지점입니다. 틀린 답도 모두 기록됩니다.

## 4-1. 이야기 버전의 탐구 도우미

3학년 이야기 버전과 같은 방식입니다.

- **보기·생각하기·궁금해하기**(1차시 만져 보기): 장면을 보고 칸마다 쪽지를 붙입니다. 칸마다 `💡 예시` 단추가 있습니다.
- **왜 그럴까요?**: 고르기 정답 뒤 한 줄로 까닭을 씁니다(다 쓰면 모범 답이 뜸).
- **먼저 예상해요**: 조작하기 전에 '내 규칙'을 먼저 쓰고, 활동을 마치면 "내 예상이 맞았나요?"를 고릅니다.
- **궁금증 다시 보기**: 마지막 차시 첫 계단 위에 1차시에 붙인 '궁금해요' 쪽지가 다시 보입니다(같은 기기·같은 번호일 때).
- **예전 생각, 지금 생각**: 마지막 차시에서 단원을 돌아보고, 원래 단원 도전 문제는 '선택 문제'로 남겼습니다(계단 통과와 상관없음).

## 5. 차시 목록

### 이야기 버전

{lesson_md("st")}
### 교과서 차시 버전

{lesson_md("tb")}
{C['group_guide']}

## 6. 반 전체 기록 모으기 (Code.gs)

1. 새 구글 시트를 만들고 **[확장 프로그램] → [Apps Script]** 를 엽니다.
2. `Code.gs`를 붙여 넣고 맨 위 `TEACHER_PIN`을 선생님만 아는 숫자로 바꿉니다.
3. **[+] → HTML** 로 {pages} 파일을 만들어 쓰려는 버전의 앱 HTML을 통째로 붙여 넣습니다(두 버전을 함께 쓰려면 스크립트를 하나 더 만드세요).
4. **[배포] → [새 배포] → 웹 앱**, 실행: 나, 액세스: 학교 도메인 내 모든 사용자.
5. 나온 주소 뒤에 `?page={first}`처럼 붙여 학생들에게 알려 줍니다.

또는 GitHub Pages 주소를 그대로 쓰고, 각 HTML 안의 `endpoint: ""`에 배포 주소만 넣어도 됩니다.

## 7. 인쇄

한글 인쇄 창의 「인쇄 방식」을 「자동 인쇄」(실제 크기)로 두세요. 활동지 첫 줄의 10 cm 눈금자에 자를 대어 확인합니다.
활동지 맨 뒤 마지막 한 장이 교사용 정답입니다. 학생용으로 뽑을 때는 그 한 장을 빼세요.
''')
    print('ok', sem, {n: (count(D[n]['tb']['lessons']), D[n]['st'] and count(D[n]['st']['lessons'])) for n in D})


if __name__ == '__main__':
    for sem in ([int(a) for a in sys.argv[1:]] or [1, 2]):
        build(sem)
