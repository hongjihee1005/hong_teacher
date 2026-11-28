"""수학 방탈출 · 공룡 연구소 탈출 (추천 6학년) — 형식은 rooms.py 머리말"""
from fractions import Fraction
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

from math import gcd

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀). 티라노사우루스 몸길이(약 12 m) 말고는 이 이야기에서 정한 값
LAYERS = [dict(c='노랑', t=18, f='leaf'), dict(c='초록', t=25, f='ammo'), dict(c='빨강', t=21, f='bone'), dict(c='파랑', t=30, f='ammo'), dict(c='갈색', t=26, f='')]
AVG = sum(a['t'] for a in LAYERS) // len(LAYERS)           # 120 ÷ 5 = 24 cm
RATIO = [('빨강', Fraction(3, 5), '3/5'), ('파랑', Fraction(65, 100), '0.65'), ('초록', Fraction(62, 100), '62%'), ('노랑', Fraction(16, 25), '16/25')]
SURVEY = ['지층 화석 조사표', '(층에서 화석이 나온 칸의 비율)', '빨강 층 3/5 · 파랑 층 0.65', '초록 층 62% · 노랑 층 16/25']
NECK, TAIL = 24, 36                                        # 목뼈·꼬리뼈 받침대 길이(cm)
GCD = gcd(NECK, TAIL)                                      # 12
LOG = ['조립 일지', f'목뼈 받침대 {NECK} cm', f'꼬리뼈 받침대 {TAIL} cm', '번호 카드 = 두 길이의 공약수']
CARDS = [('○', 12), ('△', 8), ('□', 6), ('☆', 9), ('◇', 4), ('♡', 3)]
CARD_LINES = ['조립 번호 카드', '○ 12 · △ 8 · □ 6', '☆ 9 · ◇ 4 · ♡ 3']
SCALE, MODEL = 40, 30                                      # 모형 : 실제 = 1 : 40, 모형 몸길이 30 cm → 실제 1200 cm = 12 m(실제 티라노사우루스와 같음)
MODEL_PLATE = ['티라노사우루스 모형', f'모형 : 실제 = 1 : {SCALE}', f'모형 몸길이 {MODEL} cm']
MAP = dict(n=5, m=6, start=[0, 4], path='UURRRUURRD', block=[[1, 3], [2, 3], [1, 1], [2, 0], [4, 2], [4, 1], [5, 3], [3, 4]], sl='로봇', gl='문')
DIA = 50                                                   # 둥지 모형 지름 50 cm
PI = Fraction(314, 100)
KIT, OFF = 9000, 20                                        # 화석 키트 9000원, 오늘 20% 할인
GOODS = [dict(k='kit', nm='화석 키트', price=f'{KIT:,}원'), dict(k='doll', nm='공룡 인형', price='12,000원'), dict(k='egg', nm='알 모형', price='6,500원')]
SALE = ['오늘만 할인!', f'모든 물건 {OFF}% 할인']

ROOM = dict(
    id='dino-high', title='공룡 연구소 탈출', ico='🦖', acc='#226464',
    rec='추천 6학년 · 분수·소수·백분율 비교·평균·공약수와 최대공약수·비례식·원주·할인(백분율)·방향',
    intro='공룡 박물관 연구 구역을 견학하다 정전으로 문이 모두 잠겼어요! 지층 전시관, 뼈 조립실, 기념품 가게를 지나며 단서를 모아 출구를 열어요.',
    story=['공룡 박물관의 연구 구역을 견학하던 중, 갑자기 불이 꺼졌어요.', '삐― 비상 잠금 장치가 작동하며 쿵! 문이 모두 잠겨 버렸어요.', '지층 전시관에서 기념품 가게까지 단서를 이어 출구를 열어요!'],
    outro='출구 문이 열리고 불이 다시 환하게 켜졌어요! 연구원님이 "지층부터 계산까지 척척, 진짜 공룡 연구원이네요!" 하며 박수를 쳐요. 공룡 연구소를 탈출했어요!',
    items={'card': dict(nm='조립실 출입 카드', k='card', c='#2E7A7A', de='뼈 조립실 문에 대는 카드예요'),
           'bat': dict(nm='건전지', k='battery', c='#3DA35D', de='무언가를 움직이게 할 수 있어요'),
           'keyb': dict(nm='출구 열쇠', k='key', c='#2E7A7A', de='출구 문에 맞을 것 같은 큰 열쇠예요'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#2E7A7A', de='출구 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#2E7A7A', de='출구 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **출구 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='지층 전시관', bg=dict(wall='#EADFCB', floor='#9C8466', deco='brick'), objs=[
            O('strata', '지층 벽', 'dnStrata', 40, 30, 330, 350, dict(layers=LAYERS), keep=True,
              look='박물관 벽에 실제처럼 만든 지층이 있어요. 층마다 두께가 적혀 있어요. 화석이 든 층도 있어요.',
              lookFig=F('dnStrata', 330, 350, layers=LAYERS), guide='지층 벽의 층 두께를 수첩에 남겨 두세요.'),
            O('sscrap', '지층 벽 구석 쪽지', 'scrap', 8, 6, 46, 34, dict(t='?'), in_='strata', keep=True,
              look='지층 벽 왼쪽 위 구석에 아주 작은 쪽지가 꽂혀 있어요! "금고 속 작은 서랍 = **(지층 다섯 층 두께의 평균) × (조립 일지 두 받침대 길이의 최대공약수)**"',
              guide='지층 벽을 크게 보고 왼쪽 위 구석의 작은 쪽지를 찾아보세요.'),
            O('survey', '지층 화석 조사표', 'poster', 400, 30, 310, 180, dict(lines=SURVEY, fs=18), keep=True,
              look='층마다 **화석이 나온 칸의 비율**이 분수·소수·백분율로 섞여 적혀 있어요.',
              lookFig=F('poster', 380, 190, lines=SURVEY, fs=20), guide='지층 화석 조사표의 비율을 수첩에 남겨 두세요.'),
            O('panel', '지층 불빛 장치', 'panel', 740, 40, 150, 130, dict(colors=['빨강', '노랑', '초록', '파랑'], label='큰 것부터', done='켜졌어요'),
              lock=Lk('color', [k for k, v, _ in sorted(RATIO, key=lambda t: -t[1])], '장치의 글: **화석이 나온 비율이 큰 층부터** 그 층의 색 단추를 차례로 눌러요.',
                      ['분수·소수·백분율을 한 가지로 바꾸어 비교해요. 소수로 바꾸면 쉬워요.', '3/5 = 0.6, 62% = 0.62, 16/25 = 0.64', '0.65 > 0.64 > 0.62 > 0.6'],
                      '파랑 0.65 > 노랑 16/25 = 0.64 > 초록 62% = 0.62 > 빨강 3/5 = 0.6',
                      chk=lambda: [k for k, v, _ in sorted(RATIO, key=lambda t: -t[1])], opts=['빨강', '노랑', '초록', '파랑']),
              give=['card'], after='불빛이 층마다 차례로 켜지더니 장치 아래에서 **조립실 출입 카드**가 나왔어요!',
              guide='조사표의 비율을 같은 꼴로 바꾸어 큰 것부터 눌러 보세요.'),
            O('notice', '지층 안내문', 'sign', 410, 240, 280, 110, dict(lines=['지층은 아래쪽 층일수록', '먼저 쌓였어요'], c='#5E7A3A', fs=21),
              look='지층 안내문이에요. 모래와 진흙이 오랫동안 겹겹이 쌓여 지층이 되고, 아래쪽 층일수록 먼저 쌓였대요. 여기에는 잠긴 곳이 없네요.',
              guide='지층 안내문은 읽어만 봐도 돼요.'),
            O('door', '뼈 조립실 문', 'door', 840, 190, 130, 190, dict(c='회색', sign='뼈 조립실'),
              look='뼈 조립실로 가는 문이에요. 옆에 카드 대는 곳이 있어요.',
              need='card', needMsg='문 옆 화면에 "출입 카드를 대 주세요"라는 글이 깜빡여요.', useMsg='카드를 대니 삐빅! 문이 열렸어요.',
              go='b', after='문 너머에 공룡 뼈를 조립하는 방이 보여요.', guide='출입 카드로 뼈 조립실 문을 열어 보세요.'),
        ]),
        dict(id='b', nm='뼈 조립실', bg=dict(wall='#E2ECEB', floor='#8FA3A3', deco='tile'), objs=[
            O('model', '티라노사우루스 모형', 'dnSkel', 30, 30, 360, 340, dict(plate=MODEL_PLATE), keep=True,
              look=f'실제 티라노사우루스를 줄여 만든 뼈 모형이에요. 이름표에 **모형 : 실제 = 1 : {SCALE}**, **모형 몸길이 {MODEL} cm**라고 적혀 있어요.',
              lookFig=F('dnSkel', 360, 320, plate=MODEL_PLATE), guide='티라노사우루스 모형의 이름표를 수첩에 남겨 두세요.'),
            O('log', '조립 일지', 'board', 420, 30, 300, 160, dict(lines=LOG, fs=18), keep=True,
              look='조립 일지예요. 뼈 받침대 두 개의 길이와 번호 카드 고르는 방법이 적혀 있어요.',
              lookFig=F('board', 360, 170, lines=LOG, fs=20), guide='조립 일지를 읽고 수첩에 남겨 두세요.'),
            O('cards', '조립 번호 카드', 'poster', 420, 200, 300, 104, dict(lines=CARD_LINES, fs=19), keep=True,
              look='모양마다 수가 하나씩 적힌 번호 카드예요.', lookFig=F('poster', 340, 140, lines=CARD_LINES, fs=21),
              guide='조립 번호 카드를 수첩에 남겨 두세요.'),
            O('safe', '뼈 보관 금고', 'safe', 770, 200, 170, 170, dict(),
              look='귀한 뼈를 넣어 두는 금고예요. 모양 단추가 여섯 개 있어요.',
              lock=Lk('shape', [k for k, v in sorted(CARDS, key=lambda t: t[1]) if NECK % v == 0 and TAIL % v == 0], '금고의 글: 조립 일지의 방법대로 고른 번호 카드의 모양을 **수가 작은 카드부터** 차례로 눌러요.',
                      ['조립 일지: 번호 카드 = 24와 36의 공약수. 24와 36을 모두 나누어떨어지게 하는 수를 찾아요.', '24의 약수 1, 2, 3, 4, 6, 8, 12, 24 / 36의 약수 1, 2, 3, 4, 6, 9, 12, 18, 36', '카드 중 공약수는 3, 4, 6, 12예요.'],
                      '24와 36의 공약수 중 카드에 있는 수: 3(♡) → 4(◇) → 6(□) → 12(○) / 8과 9는 한쪽만 나누어떨어져요',
                      chk=lambda: [k for k, v in sorted(CARDS, key=lambda t: t[1]) if NECK % v == 0 and TAIL % v == 0], opts=['○', '△', '□', '☆', '◇', '♡']),
              after='금고 안에 **조립 로봇 길 안내도**가 있어요. 빨간 점을 따라가면 로봇이 문에 닿는대요. 안쪽 아래에는 작은 서랍도 보여요.',
              afterFig=F('map', 360, 300, **MAP), guide='조립 일지대로 번호 카드를 골라 뼈 보관 금고를 열어 보세요.'),
            O('sdraw', '금고 속 작은 서랍', 'drawer', 50, 110, 70, 40, dict(c='#8A929C', lock=True), in_='safe',
              lock=Lk('num', str(AVG * GCD), '금고 안쪽 아래에 작은 서랍이 있어요! 숫자 자물쇠예요. 지층 벽 구석 쪽지에 적힌 대로 계산해요.',
                      ['지층 벽을 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', '평균 = 다섯 층 두께의 합 ÷ 5. 최대공약수는 24와 36의 공약수 중 가장 큰 수예요.', f'(18 + 25 + 21 + 30 + 26) ÷ 5 = {AVG}, 최대공약수 {GCD}'],
                      f'평균 120 ÷ 5 = {AVG}(cm), 24와 36의 최대공약수 {GCD} → {AVG} × {GCD} = {AVG * GCD}',
                      chk=lambda: sum(a['t'] for a in LAYERS) // 5 * gcd(24, 36)),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='뼈 보관 금고를 연 뒤 안쪽 아래의 작은 서랍을 눌러 보세요.'),
            O('mbox', '모형 부품 상자', 'chest', 40, 400, 200, 130, dict(c='#2E7A7A'),
              look='모형 부품을 넣어 두는 상자예요. 숫자 자물쇠 네 칸이 있어요.',
              lock=Lk('num', str(MODEL * SCALE), '뚜껑의 글: **실제 티라노사우루스의 몸길이는 몇 cm일까요?** (모형 이름표로 구해요)',
                      ['티라노사우루스 모형 이름표를 보세요. 모형 : 실제 = 1 : 40이에요.', f'비례식 1 : {SCALE} = {MODEL} : □ 를 세워요.', f'□ = {MODEL} × {SCALE}'],
                      f'1 : {SCALE} = {MODEL} : □ → □ = {MODEL} × {SCALE} = {MODEL * SCALE}(cm) = 12 m (실제 티라노사우루스 몸길이 약 12 m와 같아요)',
                      chk=lambda: 30 * 40),
              give=['bat'], after='상자가 열렸어요! 안에 **건전지**가 있어요. 1200 cm는 12 m예요. 진짜 티라노사우루스도 몸길이가 약 12 m였대요.',
              guide='모형 이름표의 비례식으로 실제 몸길이를 구해 상자를 열어요.'),
            O('robot', '조립 로봇', 'robot', 300, 380, 110, 150, dict(c='#9FC3C3'),
              look='뼈를 들어 옮기는 조립 로봇이에요.',
              need='bat', needMsg='로봇이 꺼져 있어요. 등에 건전지 칸이 비어 있어요.', useMsg='건전지를 넣으니 로봇 눈이 반짝! "어디로 갈까요?"',
              lock=Lk('dir', segs(MAP['path']), '로봇에게 길을 알려 줘요. 금고에서 찾은 안내도를 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩의 로봇 길 안내도를 열어 보세요. 로봇은 왼쪽 아래에서 출발해요.', '위로 2칸, 오른쪽 3칸 … 회색 칸은 지나갈 수 없어요.'],
                      '위로 2칸, 오른쪽으로 3칸, 위로 2칸, 오른쪽으로 2칸, 아래로 1칸 가요. 누를 차례: ↑ → ↑ → ↓', chk=lambda: segs('UURRRUURRD')),
              after='로봇이 안내도대로 가서 커다란 뼈 받침대를 옮겼어요! 받침대 뒤에 **기념품 가게 문**이 나타났어요.',
              guide='건전지를 로봇에 넣고 안내도대로 길을 알려 주세요.'),
            O('gdoor', '기념품 가게 문', 'door', 520, 330, 130, 220, dict(c='주황', sign='기념품 가게'), req=['robot'], go='c',
              look='로봇이 찾아 준 기념품 가게 문이에요.', after='문 너머에 기념품 가게가 보여요. 출구도 그 안에 있대요.',
              guide='새로 나타난 문으로 기념품 가게에 가 보세요.'),
        ]),
        dict(id='c', nm='기념품 가게', bg=dict(wall='#FBE9DA', floor='#B98A6A', deco='stripe'), objs=[
            O('shop', '기념품 선반', 'dnShop', 40, 50, 420, 270, dict(goods=GOODS), keep=True,
              look='공룡 기념품이 놓인 선반이에요. 물건마다 가격표가 붙어 있어요.', lookFig=F('dnShop', 420, 270, goods=GOODS),
              guide='기념품 선반의 가격표를 수첩에 남겨 두세요.'),
            O('sale', '할인 안내판', 'sign', 500, 40, 280, 110, dict(lines=SALE, c='#C8402F', fs=22), keep=True,
              look=f'가게 안내판이에요. 오늘은 **모든 물건을 {OFF}% 할인**해 준대요.', lookFig=F('sign', 320, 110, lines=SALE, c='#C8402F', fs=24),
              guide='할인 안내판을 읽고 수첩에 남겨 두세요.'),
            O('nest', '공룡 알 둥지 모형', 'dnNest', 480, 360, 270, 180, dict(eggs=[{'c': '하양', 'n': 5}], dia=f'지름 {DIA} cm'), keep=True,
              look=f'둥근 공룡 알 둥지 모형이에요. 가로질러 잰 **지름이 {DIA} cm**라고 적혀 있어요.',
              lookFig=F('dnNest', 320, 210, eggs=[{'c': '하양', 'n': 5}], dia=f'지름 {DIA} cm'), guide='둥지 모형의 지름을 수첩에 남겨 두세요.'),
            O('rbox', '둥근 선물 상자', 'dnRound', 60, 360, 200, 180, dict(c='#E07A9A', lock=True, label='지름?'),
              look='뚜껑이 둥근 선물 상자예요. 숫자 자물쇠 세 칸과 리본이 있어요. 옆에 "뚜껑의 지름 = 둥지 모형의 지름"이라고 적혀 있어요.',
              lock=Lk('num', str(int(PI * DIA)), '자물쇠 위 글: **뚜껑 둘레에 리본을 한 바퀴 두르려면 리본이 몇 cm 있어야 할까요?** (원주율 3.14)',
                      ['뚜껑의 지름은 둥지 모형의 지름과 같아요. 둥지 모형을 보세요.', '원의 둘레(원주) = 지름 × 원주율', f'{DIA} × 3.14'],
                      f'원주 = {DIA} × 3.14 = {int(PI * DIA)}(cm)', chk=lambda: PI * DIA),
              give=['kb1'], after='뚜껑이 열렸어요! 상자 안에 **열쇠 손잡이**가 들어 있어요. 몸통은 없어요.',
              guide='둥지 모형의 지름으로 뚜껑 둘레를 구해 둥근 선물 상자를 열어요.'),
            O('exit', '출구 문', 'door', 824, 170, 130, 210, dict(c='빨강', sign='출구', keypad=True),
              look='출구 문이에요. 문 옆 계산기에 "화석 키트 값을 내고 나가세요"라고 적혀 있어요.',
              need='keyb', needMsg='출구 문에 큰 열쇠 구멍이 있어요.', useMsg='출구 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(KIT * (100 - OFF) // 100), '숫자판 위 글: **오늘 화석 키트 하나를 사려면 얼마를 내야 할까요?** (원)',
                      ['기념품 선반의 화석 키트 가격표와 할인 안내판을 보세요.', f'{OFF}% 할인하면 원래 값의 {100 - OFF}%만 내요.', f'{KIT} × {100 - OFF}/100 또는 {KIT} − {KIT} × {OFF / 100}'],
                      f'할인 금액 {KIT} × {OFF}/100 = {KIT * OFF // 100}원, {KIT} − {KIT * OFF // 100} = {KIT * (100 - OFF) // 100}(원)',
                      chk=lambda: Fraction(KIT) * (1 - Fraction(OFF, 100))),
              go='exit', after='출구 문이 열렸어요!', guide='출구 열쇠를 쓰고, 화석 키트 가격과 할인 안내판으로 낼 돈을 구해요.'),
        ]),
    ],
    flow=['strata', 'sscrap', 'survey', 'panel', 'notice', 'door', 'model', 'log', 'cards', 'safe', 'sdraw', 'mbox', 'robot', 'gdoor', 'shop', 'sale', 'nest', 'rbox', 'kb1+kb2', 'exit'],
)
