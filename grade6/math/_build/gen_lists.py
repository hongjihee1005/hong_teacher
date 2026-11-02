"""6학년 수학 학기 목록·README·전체 안내·Code.gs 만들기.

python3 gen_lists.py        # 1학기·2학기 모두
python3 gen_lists.py 1      # 1학기만 (sem1/, sem1-soop/)
python3 gen_lists.py 2      # 2학기만 (sem2/, sem2-soop/)

단원 원본(units/*.tb.js·*.st.js, 2학기는 units/sem2/)에서 제목·차시·기록 이름(key)을 읽습니다.
만든 뒤 루트에서 python3 _build/theme/apply_theme.py 를 돌리세요.
"""
import re, os, html, sys
TBONLY = os.environ.get('TBONLY') == '1'   # 교과서 버전만 먼저 올릴 때: 공용 문서를 교과서 폴더에 두고 이야기 버전 카드는 '곧 열려요'
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
UB = R + '/grade6/math/_build/units'

SEMS = {
    1: dict(
        units=UB,
        tb='sem1', st='sem1-soop', code='6-1', label='1학기',
        UNITS=[
            (1, 'fracnat', '분수의 나눗셈', '분수의나눗셈', '🍰'),
            (2, 'prism', '각기둥과 각뿔', '각기둥과각뿔', '🔺'),
            (3, 'decnat', '소수의 나눗셈', '소수의나눗셈', '🔢'),
            (4, 'ratio', '비와 비율', '비와비율', '⚖️'),
            (5, 'graph', '여러 가지 그래프', '여러가지그래프', '📊'),
            (6, 'volume', '직육면체의 부피와 겉넓이', '직육면체의부피와겉넓이', '📦'),
        ],
        TB_DE={
            1: '민아의 생태 도시 푸름시 나들이 — (자연수)÷(자연수)의 몫을 분수로, (분수)÷(자연수), 분수의 곱셈으로 나타내기, (대분수)÷(자연수), 1개의 무게 구하기와 기억의 이어달리기 놀이까지',
            2: '연서와 탐험가 삼촌의 보물 찾기 — 각기둥과 그 구성 요소, 각기둥의 전개도, 각뿔과 그 구성 요소, 필요한 재료 수 구하기와 구성 요소 놀이까지',
            3: '한민족 전통문화 축제 준비 — (소수)÷(자연수), 몫의 소수점 아래 0, (자연수)÷(자연수)의 몫을 소수로, 어림셈으로 몫의 소수점 위치 확인하기까지',
            4: '민석이네·주리네 가족의 휴양림 나들이 — 두 수 비교하기, 비와 비율, 비율이 사용되는 경우, 백분율과 그 활용, 비율이 같은 카드 놀이까지',
            5: '또래 상담사 승아의 우리 학교 고민 조사 — 띠그래프·원그래프 알아보기와 그리기, 자료를 조사해 나타내고 해석하기, 여러 가지 그래프 활용과 그래프 빙고까지',
            6: '유찬이의 자원봉사 센터 — 부피 비교, 1 cm³와 직육면체의 부피, 1 m³, 직육면체의 겉넓이, 포장 모양 고르기와 부피 쪽지 놀이까지',
        },
        TB_SRC={1: '민아의 생태 도시 푸름시', 2: '연서와 탐험가 삼촌의 보물 찾기', 3: '한민족 전통문화 축제', 4: '민석이네·주리네 휴양림 나들이',
                5: '또래 상담사 승아의 고민 조사', 6: '유찬이의 자원봉사 센터'},
        ST_EMO={1: '🥐', 2: '⛺', 3: '🏃', 4: '📻', 5: '📰', 6: '🐠'},
        ST_DE={
            1: '나눔 빵 공방을 열어 반죽·우유·딸기잼·설탕·리본을 똑같이 나누고, 빵 한 개의 무게를 분수의 나눗셈으로 구해요',
            2: '학교 꿈의 쉼터 설계 공모전에 도전하며 기둥·텐트·지붕을 각기둥과 각뿔로 알아보고 전개도와 재료 주문서를 만들어요',
            3: '스포츠 클럽 기록실에서 음료·줄넘기 줄·트랙 선·기록을 (소수)÷(자연수)로 나누고, 어림셈으로 소수점 위치를 확인해요',
            4: '방송부가 학교 소식을 취재하며 두 양을 비와 비율로 비교하고, 투표율·할인율 같은 백분율을 알아봐요',
            5: '우리 반 생활 신문 편집부가 되어 조사한 자료를 띠그래프·원그래프로 나타내고, 그래프를 해석해 기사를 써요',
            6: '교실 새 단장을 하며 수납 상자·수조·수납장의 부피를 1 cm³·1 m³로 구하고, 시트지로 감쌀 겉넓이를 구해요',
        },
        st_names='나눔 빵 공방, 꿈의 쉼터 설계 공모전, 스포츠 클럽 기록실, 방송부 여론 조사, 우리 반 생활 신문, 교실 새 단장',
        group_readme=None, group_hash=None, group_guide=None,
        print_units=('- 자로 재고 그리는 **2단원 각기둥과 각뿔**·**6단원 직육면체의 부피와 겉넓이**는 실제 크기로 인쇄되는지 확인하세요.\n'
                     '  나머지 단원은 조금 줄어도 괜찮습니다.'),
        book='지도서(6-1 1~6단원)',
        scope='6학년 1학기 범위를 벗어난 내용(예: (분수)÷(분수), (소수)÷(소수), 비례식 — 6학년 2학기)은 넣지 않았습니다.',
    ),
    2: dict(
        units=UB + '/sem2',
        tb='sem2', st='sem2-soop', code='6-2', label='2학기',
        UNITS=[
            (1, 'fracdiv', '분수의 나눗셈', '분수의나눗셈', '🍰'),
            (2, 'decdiv', '소수의 나눗셈', '소수의나눗셈', '🔢'),
            (3, 'space', '공간과 입체', '공간과입체', '🧊'),
            (4, 'ratio', '비례식과 비례배분', '비례식과비례배분', '⚖️'),
            (5, 'circle', '원의 둘레와 넓이', '원의둘레와넓이', '⭕'),
            (6, 'cylinder', '원기둥, 원뿔, 구', '원기둥원뿔구', '🥫'),
        ],
        TB_DE={
            1: '준혁이와 남극 과학 기지 삼촌의 영상 통화 — 분모가 같은·다른 (분수)÷(분수), (자연수)÷(분수), 분수의 곱셈으로 나타내기, (대분수)÷(분수), 가게 값 비교와 나눗셈 놀이까지',
            2: '지윤이와 은우의 과학 기술 체험관 — (소수)÷(소수), (자연수)÷(소수), 몫을 반올림하여 나타내기, 나누어 주고 남는 양, 연료 절약과 섬나라 여행 놀이까지',
            3: '규진이와 시연이의 영상 촬영 학교 — 어느 방향에서 보았는지, 쌓기나무로 만든 모양과 개수(위·앞·옆에서 본 모양, 층별로 나타낸 모양), 쌓기나무 놀이까지',
            4: '서영이의 새 활용 체험관 — 비의 성질, 간단한 자연수의 비, 비례식과 비례식의 성질, 비례식 활용, 비례배분, 요리 재료 비와 비례식 짝 찾기 놀이까지',
            5: '채안이와 현준이의 수학 체험 마을 — 원주와 원주율, 원주와 지름 구하기, 원의 넓이 어림과 구하는 방법, 피자 메뉴 비교와 땅따먹기 놀이까지',
            6: '예빈이네 마을 체육 대회 — 원기둥과 원기둥의 전개도, 원뿔, 구, 공학 도구로 입체도형 살펴보기와 입체도형 카드 놀이까지',
        },
        TB_SRC={1: '준혁이와 남극 과학 기지', 2: '지윤이와 은우의 과학 기술 체험관', 3: '규진이와 시연이의 영상 촬영 학교',
                4: '서영이의 새 활용 체험관', 5: '채안이와 현준이의 수학 체험 마을', 6: '예빈이네 마을 체육 대회'},
        ST_EMO={1: '🏕️', 2: '🎪', 3: '🏫', 4: '🌱', 5: '⭕', 6: '🏮'},
        ST_DE={
            1: '1박 2일 숲속 수련회를 다녀오며 찰흙·레모네이드·숲길·버스·보리차·쿠키 반죽·간식값을 분수의 나눗셈으로 구해요',
            2: '나눔 축제 부스를 열어 레몬청·리본·종이비행기·초대장·재료값을 소수의 나눗셈으로 구하고, 남는 양과 반올림한 몫을 상황에 맞게 골라요',
            3: '개교 50주년 전시회에 우리 학교 건물을 쌓기나무로 만들며 사진 방향, 위·앞·옆에서 본 모양, 수와 층으로 나타낸 설계 카드를 만들어요',
            4: '학교 텃밭을 가꾸며 흙·영양제·모종·수확물의 양을 비의 성질과 비례식으로 구하고, 수확물을 비례배분으로 나누어요',
            5: '운동장 옆 둥근 쉼터를 설계하며 탁자·바퀴·잔디밭·화단의 원주와 넓이를 구하고, 개장 잔치 피자를 비교해요',
            6: '달빛 등불 축제에서 산책길을 밝힐 둥근 등을 만들며 원기둥·원뿔·구를 알아보고 원기둥의 전개도를 그려요',
        },
        st_names='숲속 수련회, 나눔 축제 부스, 쌓기나무 모형 전시회, 초록 텃밭 프로젝트, 둥근 쉼터 설계단, 달빛 등불 축제',
        group_readme=None, group_hash=None, group_guide=None,
        print_units=('- 모눈·자로 재는 **3단원 공간과 입체**·**5단원 원의 둘레와 넓이**·**6단원 원기둥, 원뿔, 구**는 실제 크기로 인쇄되는지 확인하세요.\n'
                     '  나머지 단원은 조금 줄어도 괜찮습니다.'),
        book='지도서(6-2 1~6단원)',
        scope='6학년 2학기 범위를 벗어난 내용(중학교 내용 등)은 넣지 않았습니다.',
    ),
}
# 단원별로 올릴 때: RELEASE=1,3 처럼 올린 단원만 목록에 열고 나머지는 '곧 열려요'
RELEASE = [int(x) for x in os.environ.get('RELEASE', '').split(',') if x.strip()]
# 이야기 버전을 단원별로 올릴 때: STREL=2,5 처럼 올린 이야기 단원만 열고 나머지 이야기 카드는 '곧 열려요'
STREL = [int(x) for x in os.environ.get('STREL', '').split(',') if x.strip()]


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


def page(tpl, title, crumb_last_html, body, lb='1학기', tbd='sem1'):
    s = open(tpl, encoding='utf-8').read()
    s = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', s, count=1)
    s = s.replace('</style>', LES_CSS + '</style>', 1)
    a, b = s.index('<h1>'), s.index('<footer')
    s = s[:a] + body + s[b:]
    # crumb: 3학년 -> 6학년
    nav = re.search(r'<nav class="crumb".*?</nav>', s, re.S)
    nv = nav.group(0).replace('>3학년<', '>6학년<').replace('>1학기<', f'>{lb}<').replace('>1학기 ', f'>{lb} ').replace('../sem1/', f'../{tbd}/')
    s = s[:nav.start()] + nv + s[nav.end():]
    return s


def build(sem):
    C = SEMS[sem]
    if not C['UNITS']:
        print('건너뜀', sem, '— 단원 원본이 아직 없습니다(SEMS 채우기)')
        return
    UNITS, TB_DE, TB_SRC, ST_EMO, ST_DE = C['UNITS'], C['TB_DE'], C['TB_SRC'], C['ST_EMO'], C['ST_DE']
    ALL = UNITS
    UNITS = [u for u in UNITS if (not RELEASE or u[0] in RELEASE) and os.path.exists(f"{C['units']}/u{u[0]}-{u[1]}.tb.js")]
    WAIT = [u for u in ALL if u not in UNITS]
    TBD, STD, CODE, LB = C['tb'], C['st'], C['code'], C['label']
    GUIDE = f'{CODE}수학_개념계단_전체안내.md'
    D = {}
    for n, slug, nm, nb, emo in UNITS:
        D[n] = dict(tb=parse(f'{C["units"]}/u{n}-{slug}.tb.js'), st=parse(f'{C["units"]}/u{n}-{slug}.st.js'))
        if STREL and n not in STREL:
            D[n]['st'] = None
    first = UNITS[0][1]
    if C.get('group_readme') is None:
        grp = [f"{n}단원 " + '·'.join(no for no, _, _ in D[n]['tb']['lessons'] if '~' in no) for n, *_ in UNITS if any('~' in no for no, _, _ in D[n]['tb']['lessons'])]
        g = ', '.join(grp) if grp else '없음'
        C = dict(C, group_readme=f'지도서에서 두 차시로 묶인 활동({g}차시)은 한 차시 칸으로 두고 번호를 `8~9`처럼 적었습니다.\n이야기 버전은 차시마다 한 칸입니다.',
                 group_hash='(교과서 버전의 묶인 차시는 첫 번호로, 예: `#8`)',
                 group_guide=f'교과서 차시 버전에서 지도서에서 두 차시로 묶인 활동({g}차시)은 한 칸으로 두고 번호를 `8~9`처럼 적었습니다.')

    # ---------- 교과서 버전 ----------
    body = [f'<h1>6학년 {LB} 수학 학습 자료</h1>\n',
            '<p class="sub">2022 개정 교육과정 · 교과서 차시 그대로 만든 자료입니다.<br>\n'
            '모든 차시가 <b>만져 보기 → 그려 보기 → 말해 보기 → 약속하기 → 확인하기</b> 다섯 계단과 ★도전 계단으로 되어 있어요.</p>\n',
            '<p class="gsub">단원을 누르면 그 단원의 <b>💻 웹앱</b>과 <b>🖨️ 활동지(기본형·도전형)</b>가 나와요. <b>📋 차시 목록</b>에서 차시를 누르면 그 차시가 바로 열려요.</p>\n']
    for n, slug, nm, nb, emo in UNITS:
        tb = D[n]['tb']; fn = f'u{n}-{slug}.html'
        body.append(f'<h2>{emo} {n}단원 · {nm}</h2>\n<div class="grid">\n'
                    f'<a class="card" href="{fn}"><span class="tag" style="background:#D9731A">💻 웹앱</span><span class="nm">{emo} {nm}</span>'
                    f'<span class="de">{TB_DE[n]} {count(tb["lessons"])}차시</span></a>\n'
                    + SHEET.format(n=n, nb=nb) + '</div>\n' + lessons_html(fn, tb['lessons']))
    for n, slug, nm, nb, emo in WAIT:
        body.append(f'<h2>{emo} {n}단원 · {nm}</h2>\n<div class="grid">\n<div class="card wait"><span class="tag" style="background:#D9731A">💻 웹앱</span><span class="nm">{emo} {nm}</span><span class="de">곧 열려요 — 만들고 점검하는 중이에요</span></div>\n</div>\n')
    body.sort(key=lambda x: (0,) if not x.startswith('<h2>') else (1, int(re.search(r'(\d)단원', x).group(1))) if re.search(r'^<h2>\S+ (\d)단원', x) else (0,))
    _gp = '' if TBONLY else f'../{STD}/'
    _story = ('<div class="card wait"><span class="tag" style="background:#6A4FC9">이야기 버전</span><span class="nm">🧑‍🏫 홍지희 선생님 버전</span><span class="de">곧 열려요 — 같은 내용을 우리 학교·학급 이야기로 다시 짠 수업</span></div>\n'
              if TBONLY else f'<a class="card" href="../{STD}/index.html"><span class="tag" style="background:#6A4FC9">이야기 버전</span><span class="nm">🧑‍🏫 홍지희 선생님 버전</span><span class="de">같은 내용을 우리 학교·학급 이야기로 다시 짠 수업</span></a>\n')
    body.append('<h2>📑 함께 쓰는 문서</h2>\n<p class="gsub">반 전체 기록을 구글 시트에 모으거나, 수업 구성을 한눈에 볼 때 씁니다.</p>\n<div class="grid">\n'
                f'<a class="card" href="{_gp}{GUIDE}"><span class="tag" style="background:#6A4FC9">교사용</span><span class="nm">📖 전체 안내서</span><span class="de">두 버전의 구성·차시 목록·인쇄 안내(글 파일)</span></a>\n'
                f'<a class="card" href="{_gp}Code.gs"><span class="tag" style="background:#6A4FC9">설치</span><span class="nm">⚙️ Code.gs</span><span class="de">반 전체 기록을 구글 시트에 모으는 앱스 스크립트(두 버전 공용, README 참고)</span></a>\n'
                + _story + '</div>\n')
    body.append('<h2>💡 쓰는 방법</h2>\n'
                '<p class="gsub"><b>💻 웹앱</b> — 전자칠판이나 크롬북에서 바로 씁니다. 앞 계단을 해결해야 다음 계단이 열리고, 막히면 도움이 단서 → 낱말 → 답 따라 쓰기 세 단계로 나옵니다. 주소 끝에 <code>#3</code>처럼 차시 번호를 붙이면 그 차시가 바로 열려요.</p>\n'
                '<p class="gsub"><b>🖨️ 활동지</b> — 흑백 인쇄용 hwpx입니다. <b>기본형</b>은 낱말 상자와 빈칸 문장으로 돕고, <b>도전형</b>은 도움을 빼고 서술형·심화를 더했습니다. 맨 뒤에 교사용 정답이 붙어 있으니 배부 전에 마지막 장을 빼세요.<br>인쇄할 때는 한글 인쇄 창의 <b>「인쇄 방식」을 「자동 인쇄」</b>로 두세요. 그것이 실제 크기입니다(「공급 용지에 맞추어」로 하면 줄어듭니다). 맨 윗줄에 10 cm 눈금자가 있으니, 처음 한 장만 뽑아 자를 대어 10 cm가 나오는지 확인하시면 됩니다.</p>\n')
    open(f'{R}/grade6/math/{TBD}/index.html', 'w', encoding='utf-8').write(
        page(R + '/grade3/math/sem1/index.html', f'6학년 {LB} 수학 · 초등교사 홍지희', None, ''.join(body), LB, TBD))

    # ---------- 이야기 버전 ----------
    body = [f'<h1>6학년 {LB} 수학 · 홍지희 선생님 버전</h1>\n',
            '<p class="sub">2022 개정 교육과정 · <b>우리 학교·학급 상황으로 다시 짠 이야기 수업</b>입니다.<br>교과서 차시 버전과 배우는 것은 같고, 단원마다 이야기 하나로 이어집니다.</p>\n',
            '<p class="gsub">모든 차시가 <b>만져 보기 → 그려 보기 → 말해 보기 → 약속하기 → 확인하기</b> 다섯 계단과 ★도전 계단으로 되어 있어요. <b>📋 차시 목록</b>에서 차시를 누르면 그 차시가 바로 열려요.</p>\n']
    for n, slug, nm, nb, emo in UNITS:
        st = D[n]['st']; fn = f'u{n}-{slug}.html'; em = ST_EMO[n]
        if not st:
            body.append(f'<h2>{em} {n}단원 · {nm}</h2>\n<div class="grid">\n<div class="card wait"><span class="tag" style="background:#D9731A">💻 웹앱</span><span class="nm">{em} {nm}</span><span class="de">곧 열려요 — 만들고 점검하는 중이에요</span></div>\n</div>\n')
            continue
        name = st['title']; de = f'{ST_DE[n]} {count(st["lessons"])}차시'
        body.append(f'<h2>{em} {n}단원 · {nm}</h2>\n<div class="grid">\n'
                    f'<a class="card" href="{fn}"><span class="tag" style="background:#D9731A">💻 웹앱</span><span class="nm">{em} {name}</span>'
                    f'<span class="de">{de}</span></a>\n' + SHEET.format(n=n, nb=nb) + '</div>\n'
                    + (lessons_html(fn, st['lessons']) if st else ''))
    body.append('<h2>📎 함께 쓰는 자료</h2>\n<div class="grid">\n'
                f'<a class="card" href="{GUIDE}"><span class="tag" style="background:#6A4FC9">📋 교사용</span><span class="nm">📖 전체 안내서</span><span class="de">구성·차시 목록·설치·인쇄 안내(글 파일)</span></a>\n'
                '<a class="card" href="Code.gs"><span class="tag" style="background:#6A4FC9">📋 교사용</span><span class="nm">⚙️ Code.gs</span><span class="de">학생 기록을 구글 시트에 모으는 앱스 스크립트</span></a>\n'
                '</div>\n'
                '<p class="gsub">활동지 맨 뒤 <b>마지막 한 장</b>이 교사용 정답입니다. 학생용으로 뽑을 때는 인쇄 범위에서 그 한 장만 빼면 됩니다.</p>\n')
    open(f'{R}/grade6/math/{STD}/index.html', 'w', encoding='utf-8').write(
        page(R + '/grade3/math/sem1-soop/index.html', f'6학년 {LB} 수학 · 홍지희 선생님 버전 · 초등교사 홍지희', None, ''.join(body), LB, TBD))

    # ---------- README (교과서) ----------
    rows = '\n'.join(f'| {n}. {nm} | `u{n}-{slug}.html` | {count(D[n]["tb"]["lessons"])} | {TB_SRC[n]} |' for n, slug, nm, nb, e in UNITS)
    pages = ', '.join(f'`index_{slug}`' for n, slug, nm, nb, e in UNITS)
    u0, uN = UNITS[0], UNITS[-1]
    unitdir = 'units/sem2/' if sem == 2 else 'units/'
    open(f'{R}/grade6/math/{TBD}/README.md', 'w', encoding='utf-8').write(f'''# 6학년 {LB} 수학 학습 자료 (교과서 차시 버전)

2022 개정 교육과정 초등학교 6학년 {LB} 수학과 수업 자료입니다.
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
- 앱의 원본은 `grade6/math/_build/{unitdir}*.tb.js`입니다. 이 폴더의 단원 HTML은 직접 고치지 말고 `_build/README.md`대로 다시 만드세요.

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

2022 개정 교육과정 5~6학년군 성취기준과 {C['book']}의 단원 학습 목표·차시 계획을 따랐습니다.
{C['scope']}

---

2022 개정 교육과정 교과서·지도서를 바탕으로 만들었습니다. 만든 사람: 초등교사 홍지희
''')

    # ---------- README (이야기) ----------
    rows = '\n'.join(f'| {n} {nm} | `u{n}-{slug}.html` | {D[n]["st"]["title"] if D[n]["st"] else f"({nm} 이야기, 만드는 중)"} | {count(D[n]["st"]["lessons"]) if D[n]["st"] else ""} |' for n, slug, nm, nb, e in UNITS)
    open(f'{R}/grade6/math/{STD}/README.md', 'w', encoding='utf-8').write(f'''# 6학년 {LB} 수학 · 홍지희 선생님 버전

우리 학교·학급 상황으로 다시 짠 **이야기 수업** 자료입니다. 누구나 열어 볼 수 있습니다.

교과서 차시 버전은 [`../{TBD}/`](../{TBD}/)에 있습니다.
두 버전은 개념 계단 다섯 칸, 도움 3단계, S.O.O.P. 탐구 단계가 같고 차시 순서와 소재만 다릅니다.

| 단원 | 웹앱 | 이야기 | 차시 |
|---|---|---|---|
{rows}

인쇄용 활동지(hwpx)는 `sheets/`에 단원마다 **기본형·도전형** 두 벌이 있습니다.
교사용 자료(전체 안내서 `{GUIDE}`, `Code.gs`)도 이 폴더에 있습니다.

앱의 원본은 `grade6/math/_build/{unitdir}*.st.js`입니다. 이 폴더의 단원 HTML은 직접 고치지 말고 `_build/README.md`대로 다시 만드세요.

활동지 맨 뒤 **마지막 한 장**이 교사용 정답입니다.
학생용으로 뽑을 때는 인쇄 범위에서 그 한 장만 빼면 됩니다.
''')

    # ---------- Code.gs ----------
    cg = open(R + '/grade3/math/sem1-soop/Code.gs', encoding='utf-8').read()
    lines = ''.join(f' *    - {n}단원 {nm}:{" " * max(1, 9 - len(nm))}?page={slug} (index_{slug})\n' for n, slug, nm, nb, e in UNITS)
    cg = re.sub(r' \*    - 1단원 덧셈과 뺄셈.*?\(index_fracdec\)\n', lines, cg, flags=re.S)
    cg = cg.replace('3학년 1학기', f'6학년 {LB}')
    files = ', '.join(f"{slug}: 'index_{slug}'" for n, slug, nm, nb, e in UNITS)
    cg = re.sub(r"const files = \{ hub: 'index_hub', .*?\};", "const files = { hub: 'index_hub', " + files + " };", cg)
    open(f'{R}/grade6/math/{STD}/Code.gs', 'w', encoding='utf-8').write(cg)
    if TBONLY:
        open(f'{R}/grade6/math/{TBD}/Code.gs', 'w', encoding='utf-8').write(cg)

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
    open(f'{R}/grade6/math/{STD}/{GUIDE}', 'w', encoding='utf-8').write(f'''# 6학년 {LB} 수학 · 개념 계단 자료 (1~6단원 전체)

두 가지 버전이 있습니다. 내용과 구조(개념 계단 다섯 칸, 도움 3단계, 선생님 확인 화면)는 같고, **차시 순서와 문제 상황(소재)만** 다릅니다.

- **이야기 버전(홍지희 선생님 버전, `{STD}/`)** — 우리 학교·학급 상황으로 새로 구성({C['st_names']}). 단원마다 이야기 하나로 이어지는 수업·복습·학급 프로젝트용.
- **교과서 차시 버전(`{TBD}/`)** — 지도서의 차시 번호·주제·소재를 그대로 따름. 교과서 진도에 맞춘 본 수업용.

두 버전 모두 공개 목록입니다(잠금 없음). 앱 원본은 `grade6/math/_build/{unitdir}`(`*.tb.js` 교과서, `*.st.js` 이야기)이고, 3학년 앱과 같은 엔진을 씁니다.

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



def tbonly_copy(sem):
    C = SEMS[sem]
    g = f"{R}/grade6/math/{C['st']}/{C['code']}수학_개념계단_전체안내.md"
    if TBONLY and os.path.exists(g):
        import shutil; shutil.copy(g, f"{R}/grade6/math/{C['tb']}/")

if __name__ == '__main__':
    for sem in ([int(a) for a in sys.argv[1:]] or [1, 2]):
        build(sem)
        tbonly_copy(sem)
