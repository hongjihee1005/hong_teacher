"""수학 방탈출 · 잠수함 탈출 (추천 3~4학년 · 도전, 4학년 수학) — 형식은 rooms.py 머리말"""
from fractions import Fraction as Fr
# rooms.py의 도우미와 같음(서로 불러오면 돌고 돌아서 여기에 둠)
def O(id, nm, art, x, y, w, h, p=None, **k):
    d = dict(id=id, nm=nm, art=art, x=x, y=y, w=w, h=h, p=p or {})
    d.update({('in' if a == 'in_' else a): b for a, b in k.items() if b is not None})
    return d

def Lk(t, code, q, hints, sol, chk=None, opts=None):
    d = dict(t=t, code=code, q=q, hints=hints, sol=sol, chk=chk)
    if opts: d['opts'] = opts
    return d

def F(art, fw, fh, **p): return dict(art=art, w=fw, h=fh, p=p)

def segs(path):
    """지도 길(UDLR) → 방향이 바뀌는 차례의 화살표"""
    out = []
    for ch in path:
        a = {'U': '↑', 'D': '↓', 'L': '←', 'R': '→'}[ch]
        if not out or out[-1] != a: out.append(a)
    return out

# 그림에 그린 것과 계산에 쓰는 수를 한곳에
SB_TRI = (48, 67)                         # 삼각형 두 각 → 나머지 ㄷ
SB_QUAD = (95, 80, 110)                   # 사각형 세 각 → 나머지 ㄹ
SB_ANG = ['각도 수리표', '삼각형: 48°, 67°, ㄷ', '사각형: 95°, 80°, 110°, ㄹ']
SB_MAP = dict(n=5, m=6, start=[0, 4], path='RUURRDRRUUU',
              block=[[4, 2], [4, 1], [3, 1], [2, 4], [3, 4], [0, 2], [0, 1], [2, 0], [4, 4]], sl='출발', gl='구조선')
SB_TANK_ROWS, SB_TANK_PER, SB_L = 3, 5, 125   # 산소 탱크 3줄 × 5개, 탱크마다 125 L
SB_TANKS = [[{'k': 'jar', 'c': '하늘', 'n': SB_TANK_PER}] for _ in range(SB_TANK_ROWS)]
SB_O2 = SB_TANK_ROWS * SB_TANK_PER * SB_L     # 1875 L
SB_BOATS = 8                                  # 탈출정 8대
SB_GAUGE = [('빨강', '1과 3/5 + 2/5', Fr(8, 5) + Fr(2, 5)), ('노랑', '2/5 + 4/5', Fr(2, 5) + Fr(4, 5)),
            ('초록', '1과 1/5 + 1과 3/5', Fr(6, 5) + Fr(8, 5)), ('파랑', '3/5 + 1과 4/5', Fr(3, 5) + Fr(9, 5))]
SB_GAUGE_LINES = ['압력 계기판'] + [f'{c}  {e}' for c, e, _ in SB_GAUGE]
SB_SONAR_RULE = ['○', '△', '□']               # ○ △ □ 를 1개씩, 2개씩, 3개씩 …

def sonar(n):
    out, k = [], 1
    while len(out) < n:
        for s in SB_SONAR_RULE: out += [s] * k
        k += 1
    return out[:n]

SB_SONAR = sonar(12) + ['?']
SB_FREQ = (2, 4, 7)                            # 10000이 2개, 1000이 4개, 10이 7개

ROOM = dict(
    id='submarine', title='잠수함 탈출', ico='🧭', acc='#1C8C7A',
    rec='추천 4학년 · 세 자리×두 자리·나머지 있는 나눗셈·분수 덧셈·삼각형·사각형의 각·큰 수·규칙·방향·색깔',
    intro='깊은 바닷속을 탐사하던 잠수함에 경보가 울려요! 문이 모두 잠겨 버렸어요. 조타실·기관실·탈출실을 오가며 단서를 이어 붙여, 탈출 해치를 열고 바다 위로 올라가요.',
    story=['깊은 바닷속을 탐사하던 잠수함에 갑자기 "삐용삐용!" 경보가 울렸어요.', '쿵! 철컥! 문이 모두 닫히고 탈출 해치에도 자물쇠가 걸렸어요.', '단서를 이어 붙여 해치를 열고 바다 위 구조선까지 올라가요!'],
    outro='탈출 해치가 열렸어요! 탈출정을 타고 올라가니 반짝이는 바다 위에서 구조선이 손을 흔들어요. 잠수함을 탈출했어요!',
    items={'card': dict(nm='승무원 카드', k='card', c='#1C8C7A', de='카드에 \'기관실\'이라고 적혀 있어요'),
           'gear': dict(nm='톱니바퀴', k='gear', c='#8A929C', de='조타 장치에서 빠진 부품 같아요'),
           'key': dict(nm='해치 열쇠', k='key', c='#E5534B', de='빨간 열쇠에 \'탈출 해치\'라고 적혀 있어요'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#E5534B', de='빨간 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#E5534B', de='빨간 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kh1', b='kh2', make='key', msg='손잡이와 몸통을 딸깍 끼웠더니 **해치 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='조타실', bg=dict(wall='#1D5670', floor='#2C4752', deco='bubble'), objs=[
            O('porthole', '관측 창', 'porthole', 30, 30, 150, 150, dict(sea=True, items=[{'k': 'fish', 'c': '주황', 'n': 2}, {'k': 'fish', 'c': '노랑', 'n': 1}]),
              look='둥근 창밖으로 물고기들이 헤엄쳐요. 바깥은 깊고 어두운 바다예요.', guide='관측 창은 구경만 해도 돼요.'),
            O('angles', '각도 수리표', 'poster', 210, 40, 340, 150, dict(lines=SB_ANG, fs=22, c='#EAF6F8'), keep=True,
              look='잠수함 창틀을 고칠 때 쓰는 수리표예요. 삼각형과 사각형의 모르는 각 **ㄷ**과 **ㄹ**이 있어요.',
              lookFig=F('poster', 360, 160, lines=SB_ANG, fs=24, c='#EAF6F8'), guide='각도 수리표의 삼각형과 사각형 각을 수첩에 남겨 두세요.'),
            O('chart', '해저 지도', 'map', 590, 30, 230, 200, dict(SB_MAP), keep=True,
              look='벽에 붙은 해저 지도예요. 갈색 칸은 바위예요. 잠수함이 구조선까지 가는 길이 빨간 점으로 그려져 있어요.',
              lookFig=F('map', 330, 280, **SB_MAP), guide='해저 지도의 빨간 점 길을 수첩에 남겨 두세요.'),
            O('locker', '비상 사물함', 'cabinet', 30, 210, 160, 170, dict(label='비상', c='#C9D6D9'),
              look='비상 사물함이에요. 숫자 자물쇠 네 칸이 있어요.',
              lock=Lk('num', f'{180 - sum(SB_TRI)}{360 - sum(SB_QUAD)}', '자물쇠 옆 글: **각도 수리표의 ㄷ과 ㄹ을 차례로 이어 쓰세요.** (ㄷ이 두 자리, ㄹ이 두 자리)',
                      ['삼각형의 세 각을 모두 더하면 180°, 사각형의 네 각을 모두 더하면 360°예요.', 'ㄷ = 180° − 48° − 67°', 'ㄹ = 360° − 95° − 80° − 110°'],
                      f'ㄷ = 180 − (48 + 67) = {180 - sum(SB_TRI)}, ㄹ = 360 − (95 + 80 + 110) = {360 - sum(SB_QUAD)} → {180 - sum(SB_TRI)}{360 - sum(SB_QUAD)}',
                      chk=lambda: f'{180 - sum(SB_TRI)}{360 - sum(SB_QUAD)}'),
              give=['card'], after='사물함이 열렸어요! 안에 **승무원 카드**와 무전 쪽지가 있어요. 쪽지: "구조 본부 주파수 = **10000이 2개, 1000이 4개, 10이 7개**인 수"',
              guide='각도 수리표의 ㄷ과 ㄹ을 구해 비상 사물함을 열어요.'),
            O('helm', '조타 장치', 'panel', 270, 390, 230, 140, dict(colors=['회색', '회색', '회색'], label='부품 없음', done='출발!'),
              look='잠수함의 방향을 정하는 조타 장치예요.',
              need='gear', needMsg='가운데 톱니바퀴가 빠져 있어서 움직이지 않아요.', useMsg='톱니바퀴를 끼웠더니 조타 장치에 불이 들어왔어요! 화살표로 갈 길을 넣어요.',
              lock=Lk('dir', segs(SB_MAP['path']), '조타 장치 화면: **해저 지도의 길을 따라, 가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩의 해저 지도를 열어 보세요. \'출발\'에서 빨간 점을 따라가요.', '바위를 피해 가느라 방향이 여러 번 바뀌어요. 오른쪽 → 위 → 오른쪽 다음은 한 칸 아래예요. 그다음은?'],
                      '오른쪽으로 1칸, 위로 2칸, 오른쪽으로 2칸, 아래로 1칸, 오른쪽으로 2칸, 위로 3칸 가요. 누를 차례: → ↑ → ↓ → ↑',
                      chk=lambda: segs('RUURRDRRUUU')),
              after='잠수함이 바위 사이를 빠져나와 구조선 바로 아래에 도착했어요! 탈출실 천장의 덮개가 열리며 **탈출 해치**가 나타났어요.',
              guide='기관실에서 찾은 톱니바퀴를 조타 장치에 끼우고, 해저 지도대로 길을 넣어요.'),
            O('door', '기관실 문', 'door', 850, 270, 130, 210, dict(c='초록', sign='기관실'),
              look='기관실로 가는 문이에요. 카드 꽂는 곳이 있어요.',
              need='card', needMsg='"승무원 카드를 대 주세요"라는 글이 깜빡여요.', useMsg='승무원 카드를 대니 삐빅! 문이 열렸어요.',
              go='b', after='문 너머에 기관실이 보여요.', guide='승무원 카드로 기관실 문을 열어 보세요.'),
        ]),
        dict(id='b', nm='기관실', bg=dict(wall='#3E4954', floor='#2A3139', deco='brick'), objs=[
            O('tanks', '산소 탱크 선반', 'shelf', 30, 50, 300, 330, dict(rows=SB_TANKS, c='#8A929C'), keep=True,
              look=f'산소 탱크가 줄지어 놓인 선반이에요. 탱크마다 **산소 {SB_L} L**라고 적혀 있어요. 탱크는 모두 몇 개일까요?',
              lookFig=F('shelf', 300, 300, rows=SB_TANKS, c='#8A929C'), guide='산소 탱크가 몇 줄, 한 줄에 몇 개인지 세어 보세요.'),
            O('gauge', '압력 계기판', 'board', 360, 40, 360, 210, dict(lines=SB_GAUGE_LINES, fs=21), keep=True,
              look='파이프마다 압력이 분수 덧셈으로 적혀 있어요. 계산하면 어느 파이프의 압력이 가장 낮을까요?',
              lookFig=F('board', 380, 210, lines=SB_GAUGE_LINES, fs=23), guide='압력 계기판의 분수 덧셈을 파이프마다 계산해 보세요.'),
            O('gnote', '계기판 구석 쪽지', 'scrap', 302, 160, 46, 36, dict(t='?'), in_='gauge', keep=True,
              look=f'계기판 구석에 아주 작은 쪽지가 끼워져 있어요! "금고 속 작은 서랍 = **산소 탱크 수 × 각도 수리표의 ㄷ**"',
              guide='압력 계기판을 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
            O('valve', '밸브 조종판', 'panel', 740, 60, 230, 140, dict(colors=['빨강', '노랑', '초록', '파랑'], label='밸브 잠김', done='물 빠짐'),
              look='물이 찬 아래층의 물을 빼는 밸브 조종판이에요. 빨강·노랑·초록·파랑 단추가 있어요.',
              lock=Lk('color', [c for c, _, v in sorted(SB_GAUGE, key=lambda r: r[2])], '조종판 글: **압력이 낮은 파이프부터** 그 색 단추를 차례로 눌러요.',
                      ['계기판의 덧셈을 하나씩 계산해요. 분모가 모두 5이니 분자끼리 더해요.', '자연수는 자연수끼리, 분수는 분수끼리 더해요. 1과 3/5 + 2/5 = 1과 5/5 = 2', '계산하면 빨강 2, 노랑 1과 1/5, 초록 2와 4/5, 파랑 2와 2/5예요. 작은 것부터 늘어놓아요.'],
                      '노랑 2/5+4/5=1과 1/5 → 빨강 1과 3/5+2/5=2 → 파랑 3/5+1과 4/5=2와 2/5 → 초록 1과 1/5+1과 3/5=2와 4/5',
                      chk=lambda: [c for _, c in sorted([(Fr(8, 5) + Fr(2, 5), '빨강'), (Fr(2, 5) + Fr(4, 5), '노랑'), (Fr(6, 5) + Fr(8, 5), '초록'), (Fr(3, 5) + Fr(9, 5), '파랑')])]),
              go='c', after='쏴아아! 아래층의 물이 빠지고 **탈출실**로 내려가는 사다리가 보여요.',
              guide='압력 계기판의 분수 덧셈을 계산해 낮은 것부터 밸브 단추를 눌러요.'),
            O('safe', '공구 금고', 'safe', 400, 380, 160, 150, {},
              look='묵직한 공구 금고예요. 숫자 자물쇠 네 칸이 있어요.',
              lock=Lk('num', str(SB_O2), '금고 문 글: **선반의 산소 탱크에 든 산소는 모두 몇 L일까요?**',
                      ['산소 탱크 선반을 보세요. 한 줄에 몇 개, 몇 줄인가요?', f'탱크는 {SB_TANK_PER} × {SB_TANK_ROWS} = 15개예요. 15개 × 125 L는?', '125 × 15 = 125 × 10 + 125 × 5 로 나누어 계산해 보세요.'],
                      f'탱크 {SB_TANK_PER} × {SB_TANK_ROWS} = 15개, 125 × 15 = 1250 + 625 = {SB_O2}(L)',
                      chk=lambda: SB_L * (SB_TANK_ROWS * SB_TANK_PER)),
              give=['gear'], after='금고가 열렸어요! 안에 **톱니바퀴**가 있어요. 조타실의 조타 장치에서 빠진 부품 같아요.',
              guide='산소 탱크 수와 탱크 하나의 산소 양을 곱해 공구 금고를 열어요.'),
            O('sdraw', '금고 속 작은 서랍', 'drawer', 45, 96, 70, 40, dict(c='#8A929C', lock=True), in_='safe',
              lock=Lk('num', str(SB_TANK_ROWS * SB_TANK_PER * (180 - sum(SB_TRI))), '금고 안쪽에 아주 작은 서랍이 또 있어요! 숫자 자물쇠예요. 계기판 구석 쪽지에 적힌 대로 계산해요.',
                      ['압력 계기판을 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'산소 탱크는 {SB_TANK_PER} × {SB_TANK_ROWS} = 15개, 각도 수리표의 ㄷ은 180 − 48 − 67 = 65°예요.', '15 × 65 = 15 × 60 + 15 × 5'],
                      f'탱크 15개 × ㄷ 65 = 900 + 75 = {SB_TANK_ROWS * SB_TANK_PER * (180 - sum(SB_TRI))}', chk=lambda: (SB_TANK_ROWS * SB_TANK_PER) * (180 - sum(SB_TRI))),
              give=['kh2'], after='작은 서랍 안에 빨간 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='공구 금고를 연 뒤 금고 안쪽의 작은 서랍을 눌러 보세요.'),
        ]),
        dict(id='c', nm='탈출실', bg=dict(wall='#245A6E', floor='#1D3540', deco='bubble'), objs=[
            O('sonar', '음파 탐지 기록', 'poster', 30, 40, 440, 150, dict(lines=['음파 탐지 기록'], shapes=SB_SONAR, c='#E6F4F6'), keep=True,
              look='음파 탐지기가 남긴 모양 기록이에요. 모양이 점점 늘어나는 규칙이 있어요. 맨 끝은 **?** 예요.',
              lookFig=F('poster', 460, 150, lines=['음파 탐지 기록'], shapes=SB_SONAR, c='#E6F4F6'), guide='음파 탐지 기록에서 모양이 늘어나는 규칙을 찾아 두세요.'),
            O('radio', '무전기', 'screen', 510, 30, 250, 200, dict(lines=['주파수를', '맞춰 주세요'], open=['구조 본부', '연결됨!']),
              look='구조 본부와 이야기할 수 있는 무전기예요. 주파수 다섯 자리를 맞춰야 해요.',
              lock=Lk('num', ''.join(str(d) for d in (SB_FREQ[0], SB_FREQ[1], 0, SB_FREQ[2], 0)), '무전기 글: **구조 본부 주파수를 다섯 자리 수로 맞춰요.**',
                      ['조타실 비상 사물함에서 찾은 무전 쪽지를 보세요.', '10000이 2개면 20000, 1000이 4개면 4000, 10이 7개면 70이에요.', '20000 + 4000 + 70 = ? 백의 자리와 일의 자리는 0이에요.'],
                      '10000이 2개 → 20000, 1000이 4개 → 4000, 10이 7개 → 70, 모두 24070',
                      chk=lambda: 10000 * 2 + 1000 * 4 + 10 * 7),
              after=f'치직… "구조 본부입니다! 먼저 조타실에서 잠수함을 구조선 아래로 몰아 주세요. 해치 비밀번호는 **산소를 모두 탈출정 {SB_BOATS}대에 똑같이 나누어 실을 때, 한 대에 싣는 양(L) 뒤에 남는 양(L)을 이어 쓴 수**예요."',
              guide='무전 쪽지의 큰 수로 무전기 주파수를 맞춰요.'),
            O('chest', '구명 장비 상자', 'chest', 40, 390, 210, 140, dict(c='주황'),
              look='구명조끼와 장비가 든 상자예요. 뚜껑에 모양 단추 네 칸이 있어요.',
              lock=Lk('shape', sonar(16)[12:], '뚜껑 글: **음파 탐지 기록의 ? 자리부터** 규칙대로 모양 네 개를 차례로 눌러요.',
                      ['수첩의 음파 탐지 기록을 보세요. ○ △ □ 가 한 번씩, 그다음엔…?', '○ △ □ 가 1개씩, ○○ △△ □□ 2개씩, 그다음은 3개씩이에요. ○○○ 다음은?'],
                      '○ △ □ / ○○ △△ □□ / ○○○ △△△ □□□ … 이므로 ? 자리부터 △ △ △ □',
                      chk=lambda: sonar(16)[12:]),
              give=['kh1'], after='상자가 열렸어요! 구명조끼 위에 빨간 **열쇠 손잡이**가 있어요. 그런데 손잡이만 있고 몸통이 없어요.', guide='음파 탐지 기록의 늘어나는 규칙으로 구명 장비 상자를 열어요.'),
            O('hatch', '탈출 해치', 'door', 820, 190, 150, 250, dict(c='빨강', sign='탈출 해치'), req=['helm'],
              look='바다 위로 나가는 탈출 해치예요. 열쇠 구멍과 숫자판이 있어요.',
              need='key', needMsg='해치에 열쇠 구멍이 있어요.', useMsg='해치 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', ''.join(map(str, divmod(SB_O2, SB_BOATS))), '숫자판 위 글: **구조 본부가 알려 준 해치 비밀번호**를 넣어요. (몫 세 자리 뒤에 나머지 한 자리)',
                      ['산소는 모두 몇 L였나요? 기관실 공구 금고의 답을 떠올려 보세요.', f'{SB_O2} ÷ {SB_BOATS}의 몫과 나머지를 구해요. 먼저 8 × 200 = 1600을 빼면 275가 남아요.', '남은 275를 다시 8로 나누어 몫끼리 더해요. 마지막에 8로 더 나눌 수 없이 남는 수가 나머지예요.'],
                      f'산소 {SB_O2} L ÷ {SB_BOATS} = {SB_O2 // SB_BOATS} … {SB_O2 % SB_BOATS} → {SB_O2 // SB_BOATS}{SB_O2 % SB_BOATS}',
                      chk=lambda: ''.join(map(str, divmod(SB_L * SB_TANK_ROWS * SB_TANK_PER, SB_BOATS)))),
              go='exit', after='해치가 열렸어요!', guide='해치 열쇠를 쓰고, 산소 양을 탈출정 수로 나눈 몫과 나머지를 이어 써요.'),
        ]),
    ],
    flow=['angles', 'locker', 'chart', 'door', 'tanks', 'safe', 'gauge', 'gnote', 'sdraw', 'valve', 'sonar', 'chest', 'kh1+kh2', 'radio', 'helm', 'hatch'],
)
