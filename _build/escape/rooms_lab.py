"""수학 방탈출 2 — 과학실 탈출 (추천 5학년: 최대공약수·배수와 공배수·분수의 크기 비교와 덧셈·평균·반올림·직사각형의 넓이와 둘레)"""
from fractions import Fraction
from math import gcd
def lcm(a, b): return a * b // gcd(a, b)
from rooms import O, Lk, F

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
SHELF = [[{'k': 'flask', 'c': '빨강', 'n': 6}],
         [{'k': 'flask', 'c': '빨강', 'n': 2}, {'k': 'jar', 'c': '파랑', 'n': 4}],
         [{'k': 'jar', 'c': '파랑', 'n': 6}],
         [{'k': 'jar', 'c': '파랑', 'n': 2}, {'k': 'gem', 'c': '초록', 'n': 3}]]
def count(rows, k): return sum(t['n'] for r in rows for t in r if t['k'] == k)
FLASK, JAR = count(SHELF, 'flask'), count(SHELF, 'jar')          # 8, 12

RULE = ['표본장 여는 규칙', '3과 4의 공배수 → ☆', '3의 배수 → △', '4의 배수 → □', '그 밖의 수 → ○']
SLIDES = [8, 15, 12, 7, 18]
def mark(n): return '☆' if n % 12 == 0 else '△' if n % 3 == 0 else '□' if n % 4 == 0 else '○'
SLIDE_FIG = ['슬라이드 번호 (왼쪽부터)', '  '.join(map(str, SLIDES))]

BEAN = [('월', 4), ('화', 7), ('수', 5), ('목', 8), ('금', 6)]          # 강낭콩이 하루에 자란 길이(mm)
BEAN_FIG = ['강낭콩이 하루에 자란 길이 (mm)', '월 4   화 7   수 5', '목 8   금 6']
BEAKER = [('빨강', Fraction(1, 2)), ('파랑', Fraction(3, 4)), ('초록', Fraction(5, 12)), ('노랑', Fraction(1, 3))]
BOTTLES = [{'c': c, 'label': f'{v.numerator}/{v.denominator}'} for c, v in BEAKER]
ROOM_W, ROOM_H = 683, 349                                          # 준비실 바닥(cm)
PLAN = ['준비실 바닥 (직사각형)', f'가로 {ROOM_W} cm', f'세로 {ROOM_H} cm']
SCREEN_ON = ['비상문 비밀번호', '바닥 가로·세로를 반올림해', '백의 자리까지 어림하기!']
def r100(n): return (n + 50) // 100 * 100

ROOM = dict(
    id='lab', title='과학실 탈출', ico='🧪', acc='#C8402F', rec='추천 5학년 · 최대공약수·배수·분수·평균·어림·넓이·모양·색깔',
    intro='실험을 마치고 정리하다 보니 과학실 문이 잠겨 버렸어요! 과학실과 준비실을 살펴 단서를 모으고, 숨은 **비상문**을 찾아 열어요.',
    story=['실험을 마치고 과학실을 정리하던 저녁, 창밖이 어둑어둑해졌어요.', '찰칵! 자동 잠금 장치가 켜지며 과학실 문이 모두 잠겨 버렸어요.', '숨은 단서를 모아 비밀 **비상문**을 찾아 빠져나가요!'],
    outro='비상문이 덜컥 열렸어요! 복도로 나오자 저녁 햇살이 비쳐요. 과학실을 무사히 탈출했어요!',
    items={'lens': dict(nm='현미경 렌즈', k='lens', c='#3B6FD6', de='현미경에서 빠진 렌즈 같아요'),
           'card': dict(nm='준비실 출입 카드', k='card', c='#C8402F', de='준비실 문에 대는 카드예요'),
           'key': dict(nm='금고 열쇠', k='key', c='#C9A24B', de='작은 금색 열쇠예요'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#C9A24B', de='금색 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#C9A24B', de='금색 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.'),
           'bat': dict(nm='건전지', k='battery', c='#3DA35D', de='전기 기구를 켤 수 있어요')},
    combine=[dict(a='kh1', b='kh2', make='key', msg='손잡이와 몸통을 딸깍 끼웠더니 **금고 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='과학실', bg=dict(wall='#E2F0EA', floor='#AFC0B8', deco='tile'), objs=[
            O('clock', '벽시계', 'clock', 40, 30, 100, 100, dict(h=4, m=30),
              look='4시 30분이에요. 5시가 되면 학교 불이 모두 꺼진대요. 서둘러요!',
              guide='벽시계를 살펴보세요. 서둘러야 해요!'),
            O('microscope', '현미경', 'microscope', 150, 60, 100, 130,
              need='lens', needMsg='선반 위 현미경이에요. 그런데 눈을 대는 **렌즈**가 빠져 있어요.', useMsg='렌즈를 끼우고 슬라이드를 들여다봤어요.',
              after='슬라이드 다섯 장에 번호가 적혀 있어요: **8, 15, 12, 7, 18**', afterFig=F('poster', 340, 130, lines=SLIDE_FIG),
              guide='찾은 렌즈를 현미경에 끼워 슬라이드를 들여다보세요.'),
            O('shelf', '시약 선반', 'shelf', 30, 190, 300, 320, dict(rows=SHELF), keep=True,
              look='시약 선반이에요. 빨간 **플라스크**와 파란 **시약병**, 초록 광물 표본이 놓여 있어요. 무엇이 몇 개인지 세어 두세요.', lookFig=F('shelf', 300, 320, rows=SHELF),
              guide='시약 선반의 플라스크와 시약병을 세어 보세요.'),
            O('poster', '규칙 포스터', 'poster', 360, 30, 280, 190, dict(lines=RULE, fs=22), keep=True,
              look='벽에 표본장 여는 규칙이 붙어 있어요. **공배수부터 먼저** 따져야 해요.', lookFig=F('poster', 320, 210, lines=RULE, fs=24),
              guide='규칙 포스터를 읽고 수첩에 남겨 두세요.'),
            O('pnote', '포스터 구석 쪽지', 'scrap', 228, 148, 46, 36, dict(t='?'), in_='poster', keep=True,
              look='포스터 구석에 아주 작은 쪽지가 꽂혀 있어요! "표본장 속 작은 서랍 = (선반의 **플라스크 수와 시약병 수의 최소공배수**) 뒤에 (**슬라이드 번호 다섯 개의 합**)을 이어 쓴 수"',
              guide='규칙 포스터를 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
            O('cabinet', '표본장', 'cabinet', 670, 30, 150, 200, dict(label='표본장'),
              lock=Lk('shape', [mark(n) for n in SLIDES], '표본장 문: **현미경 슬라이드 번호**를 왼쪽부터 하나씩, **규칙 포스터**에 맞는 모양으로 바꿔 차례로 눌러요.',
                      ['수첩에서 슬라이드 번호(8, 15, 12, 7, 18)와 규칙 포스터를 함께 보세요.', '12는 3의 배수이면서 4의 배수예요. 그래서 공배수 모양 ☆이에요.', '8 → □, 15 → △, 12 → ☆, 7 → ○, 18 → △'],
                      '8은 4의 배수(□), 15는 3의 배수(△), 12는 3과 4의 공배수(☆), 7은 둘 다 아님(○), 18은 3의 배수(△)',
                      chk=lambda: [mark(n) for n in SLIDES]),
              give=['card'], after='표본장이 열렸어요! 나비 표본 옆에 **준비실 출입 카드**가 꽂혀 있어요.',
              guide='슬라이드 번호를 규칙 포스터에 맞춰 모양으로 바꾸면 표본장이 열려요.'),
            O('cdraw', '표본장 속 작은 서랍', 'drawer', 40, 140, 70, 40, dict(c='#B98552', lock=True), in_='cabinet',
              lock=Lk('num', f'{lcm(FLASK, JAR)}{sum(SLIDES)}', '표본장 안쪽 아래에 아주 작은 서랍이 또 있어요! 숫자 네 개 자물쇠예요. 포스터 구석 쪽지에 적힌 대로 계산해요.',
                      ['규칙 포스터를 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', '플라스크 8개, 시약병 12개의 최소공배수를 구해요. 슬라이드 번호는 8, 15, 12, 7, 18이에요.', '8과 12의 최소공배수 24, 슬라이드 번호의 합 60'],
                      f'8과 12의 최소공배수 {lcm(FLASK, JAR)}, 8 + 15 + 12 + 7 + 18 = {sum(SLIDES)} → {lcm(FLASK, JAR)}{sum(SLIDES)}',
                      chk=lambda: f'{min(n for n in range(1, 97) if n % FLASK == 0 and n % JAR == 0)}{8 + 15 + 12 + 7 + 18}'),
              give=['kh2'], after='작은 서랍 안에 금색 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='표본장을 연 뒤 안쪽 아래의 작은 서랍을 눌러 보세요.'),
            O('door', '준비실 문', 'door', 850, 170, 120, 210, dict(c='초록', sign='준비실'),
              need='card', needMsg='준비실 문이 잠겨 있어요. 손잡이 옆에 **카드를 대는 곳**이 있어요.', useMsg='카드를 댔더니 삑! 문이 열렸어요.',
              go='b', after='문 너머에 실험 준비실이 보여요.', guide='출입 카드를 준비실 문에 대 보세요.'),
            O('box', '준비물 상자', 'box', 420, 390, 180, 130, dict(c='주황', lock=True, label='모둠 준비물'),
              lock=Lk('num', f'{gcd(FLASK, JAR)}{FLASK // gcd(FLASK, JAR)}{JAR // gcd(FLASK, JAR)}',
                      '상자 쪽지: 선반의 **플라스크**와 **시약병**을 남김없이 똑같이 나누어, **될 수 있는 대로 많은 모둠**에 주려고 해요. 비밀번호 세 자리 = (모둠 수)(한 모둠의 플라스크 수)(한 모둠의 시약병 수)',
                      ['선반에서 플라스크와 시약병만 세어요(초록 광물 표본은 빼요). 플라스크 8개, 시약병 12개예요.', '8과 12를 모두 나누어떨어지게 하는 가장 큰 수, 곧 **최대공약수**가 모둠 수예요.', '최대공약수는 4 → 한 모둠에 플라스크 8 ÷ 4, 시약병 12 ÷ 4'],
                      '8과 12의 최대공약수 4 → 4모둠, 플라스크 8 ÷ 4 = 2개, 시약병 12 ÷ 4 = 3개 → 423',
                      chk=lambda: (lambda g: f'{g}{FLASK // g}{JAR // g}')(max(d for d in range(1, 13) if FLASK % d == 0 and JAR % d == 0))),
              give=['lens'], after='상자가 열렸어요! 보안경 사이에 **현미경 렌즈**가 들어 있어요.',
              guide='선반의 플라스크와 시약병 수로 준비물 상자를 열어 보세요.'),
        ]),
        dict(id='b', nm='준비실', bg=dict(wall='#F3EBDD', floor='#A99C88', deco='stripe'), objs=[
            O('bottles', '비커 받침', 'bottles', 30, 30, 290, 160, dict(items=BOTTLES), keep=True,
              look='비커 네 개에 물이 들어 있어요. 라벨에 적힌 양의 단위는 **L**예요.', lookFig=F('bottles', 320, 170, items=BOTTLES),
              guide='비커 라벨에 적힌 물의 양을 살펴보세요.'),
            O('plan', '바닥 안내도', 'poster', 350, 30, 220, 150, dict(lines=PLAN, fs=22), keep=True,
              look='준비실 바닥을 줄자로 잰 안내도예요.', lookFig=F('poster', 300, 170, lines=PLAN, fs=26),
              guide='바닥 안내도의 길이를 수첩에 남겨 두세요.'),
            O('screen', '실험 컴퓨터', 'screen', 600, 20, 220, 170, dict(lines=['전원 꺼짐'], open=SCREEN_ON, fs=19),
              need='bat', needMsg='컴퓨터가 꺼져 있어요. 뒤쪽 **건전지 칸**이 비어 있어요.', useMsg='건전지를 넣자 컴퓨터가 켜졌어요!',
              after='화면에 글이 떴어요: "**비상문 비밀번호** = (어림한 바닥의 넓이)(어림한 바닥의 둘레)". 그러자 오른쪽 벽장이 스르르 밀리며 **비상문**이 나타났어요!',
              afterFig=F('screen', 320, 180, lines=SCREEN_ON, open=SCREEN_ON, fs=22),
              guide='건전지를 실험 컴퓨터에 넣어 보세요.'),
            O('panel', '물 분배기', 'panel', 40, 220, 170, 130, dict(colors=['빨강', '노랑', '초록', '파랑'], label='순서대로', done='물 붓기 끝'),
              lock=Lk('color', [c for c, _ in sorted(BEAKER, key=lambda t: t[1])], '물 분배기: **물이 적게 든 비커부터** 그 비커와 같은 색 단추를 차례로 눌러요.',
                      ['분모가 다르면 크기를 바로 비교하기 어려워요. 분모를 12로 **통분**해 보세요.', '1/2 = 6/12, 3/4 = 9/12, 5/12, 1/3 = 4/12', '4/12(노랑) < 5/12(초록) < 6/12(빨강) < 9/12(파랑)'],
                      '통분하면 노랑 4/12 < 초록 5/12 < 빨강 6/12 < 파랑 9/12',
                      chk=lambda: [c for c, _ in sorted(BEAKER, key=lambda t: t[1])]),
              give=['kh1'], after='분배기가 비커 네 개의 물을 차례로 큰 수조에 모두 부었어요. 물받이 아래에서 금색 **열쇠 손잡이**가 굴러 나왔어요! 그런데 손잡이만 있고 몸통이 없어요.',
              guide='비커의 물을 적은 것부터 물 분배기에 입력해 보세요.'),
            O('plant', '강낭콩 화분', 'plant', 250, 360, 110, 160, keep=True,
              look='강낭콩 화분에 관찰 기록표가 꽂혀 있어요. 닷새 동안 날마다 자란 길이를 재어 적었대요.', lookFig=F('board', 320, 170, lines=BEAN_FIG),
              guide='강낭콩 화분의 관찰 기록표를 살펴보세요.'),
            O('safe', '약품 금고', 'safe', 560, 370, 160, 150,
              need='key', needMsg='약품 금고예요. **열쇠 구멍**과 숫자판이 있어요.', useMsg='열쇠를 돌렸어요. 이제 숫자판만 맞추면 돼요.',
              lock=Lk('num', f'{sum(v for _, v in BEAN) // len(BEAN)}{int(sum(v for _, v in BEAKER))}{gcd(FLASK, JAR)}',
                      '숫자판 위 글: 비밀번호 세 자리 = ① 강낭콩이 하루에 자란 길이의 **평균**(mm) ② 비커 네 개의 물을 **모두 합한 양**(L) ③ 과학실 준비물 상자에서 알아낸 **모둠 수**',
                      ['강낭콩 화분의 관찰 기록표, 준비실의 비커 받침, 과학실 준비물 상자에서 알아낸 수를 함께 보세요.', '평균 = 자료 값을 모두 더한 수 ÷ 자료의 수예요. 물의 양은 분모를 12로 통분해 더해요.', '(4 + 7 + 5 + 8 + 6) ÷ 5, 6/12 + 9/12 + 5/12 + 4/12를 계산하고, 모둠 수는 4예요.'],
                      '평균 30 ÷ 5 = 6, 물 1/2 + 3/4 + 5/12 + 1/3 = 24/12 = 2 (L), 모둠 수 4 → 624',
                      chk=lambda: f'{Fraction(sum(v for _, v in BEAN), len(BEAN))}{sum(v for _, v in BEAKER)}{gcd(FLASK, JAR)}'),
              give=['bat'], after='금고 안에 **건전지**와 쪽지가 있어요. 쪽지: "컴퓨터를 켜면 비상문 여는 법이 나와요."',
              guide='금고 열쇠로 약품 금고를 열고, 평균·물의 양·모둠 수로 비밀번호를 만들어요.'),
            O('exit', '비상문', 'door', 850, 170, 120, 210, dict(c='빨강', sign='비상문'), req=['screen'],
              lock=Lk('num', f'{(r100(ROOM_W) // 100) * (r100(ROOM_H) // 100)}{2 * (r100(ROOM_W) // 100 + r100(ROOM_H) // 100)}',
                      '비상문 숫자판: 준비실 바닥의 가로·세로를 **반올림하여 백의 자리까지** 어림한 뒤 m로 바꿔요. 비밀번호 네 자리 = (어림한 **넓이**, m²)(어림한 **둘레**, m)',
                      ['수첩의 바닥 안내도를 보세요. 683 cm는 십의 자리 숫자가 8이라 올려요.', '349 cm는 십의 자리 숫자가 4라서 버려요 → 300 cm. 가로 7 m, 세로 3 m예요.', '넓이 7 × 3 = 21, 둘레 (7 + 3) × 2 = 20'],
                      '683 → 700 cm = 7 m, 349 → 300 cm = 3 m, 넓이 7 × 3 = 21 (m²), 둘레 (7 + 3) × 2 = 20 (m) → 2120',
                      chk=lambda: (lambda a, b: f'{a * b}{2 * (a + b)}')(round(ROOM_W / 100 + 1e-9), int(ROOM_H / 100 + .5))),
              go='exit', after='비상문이 열렸어요!', guide='바닥 안내도의 길이를 어림해 넓이와 둘레로 비상문을 열어요.'),
        ]),
    ],
    flow=['clock', 'shelf', 'box', 'microscope', 'poster', 'pnote', 'cabinet', 'cdraw', 'door', 'bottles', 'panel', 'kh1+kh2', 'plant', 'safe', 'screen', 'plan', 'exit'],
)
