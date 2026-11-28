"""수학 방탈출 · 화석 발굴장 탈출 (추천 3~4학년 · 보통) — 형식은 rooms.py 머리말"""
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


# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀). 발굴장 숫자는 모두 이 이야기에서 정한 값
SIEVE_M, SIEVE_S = 1, 25                                   # 모래 한 양동이 거르기 1분 25초
SIEVE = SIEVE_M * 60 + SIEVE_S                             # 85초
BUCKETS = 4                                                # 모래 양동이 4개
SIGN = ['모래 한 양동이를', f'체로 거르는 데 {SIEVE_M}분 {SIEVE_S}초']
ZONES = [('빨강', Fraction(1, 3)), ('파랑', Fraction(1, 5)), ('초록', Fraction(1, 2)), ('노랑', Fraction(1, 4))]   # 구역마다 파낸 정도
PROG = ['발굴 진행판 (파낸 정도)', '빨강 구역 1/3 · 파랑 구역 1/5', '초록 구역 1/2 · 노랑 구역 1/4']
TEETH = 38                                                 # 발굴 구덩이의 이빨 화석 38개
PER_BOX = 4                                                # 상자 하나에 4개씩
CARDS = [('○', 46, 4), ('△', 54, 6), ('□', 63, 7), ('☆', 38, 5), ('◇', 72, 8)]
CARD_LINES = ['화석 번호 카드', '○ 46÷4 · △ 54÷6', '□ 63÷7 · ☆ 38÷5', '◇ 72÷8']
LEG, RIB = (2, 350), (1, 800)                              # 큰 다리뼈 2 kg 350 g, 작은 갈비뼈 1 kg 800 g
WEIGH = ['화석 무게표', f'큰 다리뼈 {LEG[0]} kg {LEG[1]} g', f'작은 갈비뼈 {RIB[0]} kg {RIB[1]} g']
MAP = dict(n=4, m=6, start=[0, 0], path='DDRRRUURR', block=[[1, 0], [1, 1], [2, 0], [2, 1], [4, 2], [5, 3], [0, 3], [4, 1]], sl='로봇', gl='뼈 더미')
DIARY = ['발굴 대장 수첩', '이빨 화석은', f'상자 하나에 {PER_BOX}개씩!', '남은 이빨도 꼭 담기']

ROOM = dict(
    id='dino-mid', title='화석 발굴장 탈출', ico='🦖', acc='#A3561A',
    rec='추천 3학년 · 시간(초)·곱셈·나머지 있는 나눗셈·단위분수 크기 비교·무게 단위·방향',
    intro='화석 발굴 체험을 하다가 울타리 문이 잠겨 버렸어요! 화석 발굴장과 발굴 연구실을 오가며 단서를 모아 울타리 문을 열어요.',
    story=['화석 발굴 체험 날, 모래를 체로 거르며 공룡 이빨 화석을 찾고 있었어요.', '휘잉! 센 바람에 울타리 문이 쾅 닫히더니 자물쇠가 철컥 걸렸어요.', '발굴장과 연구실을 오가며 단서를 모아 울타리 문을 열어요!'],
    outro='울타리 문이 활짝 열렸어요! 발굴 대장님이 "이빨 화석을 하나도 빠짐없이 챙겼네요!" 하며 엄지를 척 들어요. 화석 발굴장을 탈출했어요!',
    items={'brush': dict(nm='발굴 붓', k='stick', c='#B98552', de='모래를 살살 쓸어 내는 붓이에요'),
           'bat': dict(nm='건전지', k='battery', c='#3DA35D', de='무언가를 움직이게 할 수 있어요'),
           'keyb': dict(nm='울타리 열쇠', k='key', c='#B5651D', de='울타리 문에 맞을 것 같은 큰 열쇠예요'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#B5651D', de='울타리 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#B5651D', de='울타리 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **울타리 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='화석 발굴장', bg=dict(wall='#CFE6EF', floor='#D6B57C', deco=''), objs=[
            O('sign', '발굴장 안내판', 'sign', 40, 40, 260, 110, dict(lines=SIGN, c='#2E7D5B', fs=21), keep=True,
              look=f'발굴장 안내판이에요. 모래 한 양동이를 체로 거르는 데 **{SIEVE_M}분 {SIEVE_S}초**가 걸린대요. (이 발굴장에서 정한 시간이에요.)',
              lookFig=F('sign', 320, 110, lines=SIGN, c='#2E7D5B', fs=23), guide='발굴장 안내판을 읽고 수첩에 남겨 두세요.'),
            O('prog', '발굴 진행판', 'poster', 330, 30, 310, 170, dict(lines=PROG, fs=20), keep=True,
              look='구역마다 **얼마만큼 파냈는지** 분수로 적혀 있어요. 구역은 모두 크기가 같아요.',
              lookFig=F('poster', 360, 180, lines=PROG, fs=22), guide='발굴 진행판의 분수를 수첩에 남겨 두세요.'),
            O('gate', '울타리 문', 'door', 680, 170, 130, 210, dict(c='갈색', sign='울타리 문'),
              look='발굴장 밖으로 나가는 울타리 문이에요. 큰 열쇠 구멍과 숫자판이 있어요.',
              need='keyb', needMsg='울타리 문에 큰 열쇠 구멍이 있어요.', useMsg='울타리 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(-(-TEETH // PER_BOX)), '숫자판 위 글: **발굴 구덩이의 이빨 화석을 모두 상자에 담으려면 상자가 몇 개 있어야 할까요?**',
                      ['발굴 구덩이에서 찾은 이빨 화석 수와 발굴 대장 수첩을 보세요.', f'이빨 화석 {TEETH}개를 {PER_BOX}개씩 나누면 몫과 나머지는?', f'{TEETH} ÷ {PER_BOX} = {TEETH // PER_BOX} … {TEETH % PER_BOX}. 남은 {TEETH % PER_BOX}개도 담으려면 상자가 하나 더 있어야 해요.'],
                      f'{TEETH} ÷ {PER_BOX} = {TEETH // PER_BOX} … {TEETH % PER_BOX} → 남은 {TEETH % PER_BOX}개를 담을 상자 1개 더 → {TEETH // PER_BOX} + 1 = {-(-TEETH // PER_BOX)}',
                      chk=lambda: TEETH // PER_BOX + (1 if TEETH % PER_BOX else 0)),
              go='exit', after='울타리 문이 열렸어요!', guide='울타리 열쇠를 문에 쓰고, 이빨 화석과 수첩으로 필요한 상자 수를 구해요.'),
            O('tent', '연구실 천막 문', 'door', 824, 170, 130, 210, dict(c='초록', sign='연구실', keypad=True),
              look='발굴 연구실 천막으로 들어가는 문이에요. 빨강·노랑·초록·파랑 색 단추가 있어요.',
              lock=Lk('color', [k for k, _ in sorted(ZONES, key=lambda t: -t[1])], '천막 문의 글: **가장 많이 파낸 구역부터** 그 구역의 색 단추를 차례로 눌러요.',
                      ['발굴 진행판의 분수는 모두 분자가 1인 **단위분수**예요.', '분자가 1이면 분모가 작을수록 더 큰 분수예요. 1/2은 반, 1/5은 다섯 조각 중 하나!'],
                      '1/2(초록) > 1/3(빨강) > 1/4(노랑) > 1/5(파랑)',
                      chk=lambda: [k for k, _ in sorted(ZONES, key=lambda t: -t[1])], opts=['빨강', '노랑', '초록', '파랑']),
              go='b', after='삐빅! 천막 문이 열렸어요. 안에 발굴 연구실이 보여요.', guide='발굴 진행판의 분수를 큰 것부터 늘어놓아 천막 문의 색을 눌러요.'),
            O('buckets', '모래 양동이', 'dnBucket', 40, 400, 240, 120, dict(n=BUCKETS, c='파랑'), keep=True,
              look='체로 걸러야 할 모래 양동이들이 놓여 있어요. 몇 개인지 세어 두세요.', lookFig=F('dnBucket', 320, 140, n=BUCKETS, c='파랑'),
              guide='모래 양동이가 몇 개인지 세어 보세요.'),
            O('chest', '발굴 도구 상자', 'chest', 310, 410, 180, 120, dict(c='#B5651D'),
              look='발굴 도구 상자예요. 숫자 자물쇠 세 칸이 있어요.',
              lock=Lk('num', str(SIEVE * BUCKETS), '뚜껑의 글: **양동이의 모래를 모두 체로 거르면 몇 초가 걸릴까요?**',
                      ['발굴장 안내판에 한 양동이를 거르는 시간이 있어요. 양동이 수도 세어 보세요.', f'{SIEVE_M}분 {SIEVE_S}초를 초로 바꾸면? 1분 = 60초예요.', f'{SIEVE}초 × {BUCKETS}개'],
                      f'{SIEVE_M}분 {SIEVE_S}초 = {SIEVE}초, {SIEVE} × {BUCKETS} = {SIEVE * BUCKETS}(초)', chk=lambda: (1 * 60 + 25) * BUCKETS),
              give=['brush'], after='상자가 열렸어요! 안에 **발굴 붓**이 있어요. 손잡이에 \'구덩이\'라고 적혀 있어요.', guide='안내판의 시간과 양동이 수로 발굴 도구 상자를 열어요.'),
            O('dig', '발굴 구덩이', 'dnDig', 520, 395, 300, 155, dict(grid=[4, 2], teeth=TEETH),
              look='줄을 쳐서 칸을 나눈 발굴 구덩이예요. 모래 밑에 무언가 반짝여요.',
              need='brush', needMsg='모래가 단단히 덮여 있어요. 화석이 다치지 않게 살살 쓸어 낼 도구가 있으면 좋겠어요.', useMsg='발굴 붓으로 살살 쓸어 내니 이빨 화석이 줄줄이 나왔어요!',
              give=['kb1'], after=f'모래 밑에서 **이빨 화석**이 나왔어요. 한 줄에 10개씩 놓여 있어요. 모두 몇 개인지 세어 두세요. 구덩이 구석에서 **열쇠 손잡이**도 찾았어요!',
              afterFig=dict(art='dnDig', w=300, h=170, p=dict(grid=[4, 2], teeth=TEETH), open=True),
              guide='발굴 붓으로 발굴 구덩이를 쓸어 보세요.'),
        ]),
        dict(id='b', nm='발굴 연구실', bg=dict(wall='#F3E9D8', floor='#A98C6C', deco='tile'), objs=[
            O('cards', '화석 번호 카드', 'poster', 40, 30, 300, 190, dict(lines=CARD_LINES, fs=22), keep=True,
              look='모양마다 나눗셈이 하나씩 적힌 카드예요. 어떤 카드는 **나누어떨어지고**, 어떤 카드는 나머지가 있어요.',
              lookFig=F('poster', 340, 210, lines=CARD_LINES, fs=25), guide='화석 번호 카드의 나눗셈을 계산해 보세요.'),
            O('cscrap', '카드 구석 쪽지', 'scrap', 248, 146, 46, 34, dict(t='?'), in_='cards', keep=True,
              look='카드 판 구석에 아주 작은 쪽지가 끼어 있어요! "표본장 속 작은 서랍 = **(발굴 구덩이의 이빨 화석 수) × (모래 양동이 수)**"',
              guide='화석 번호 카드를 크게 보고 오른쪽 아래 구석의 작은 쪽지를 찾아보세요.'),
            O('weigh', '화석 무게표', 'board', 370, 30, 300, 150, dict(lines=WEIGH, fs=21), keep=True,
              look='연구실 칠판에 오늘 찾은 화석의 무게가 적혀 있어요.', lookFig=F('board', 340, 160, lines=WEIGH, fs=23),
              guide='화석 무게표를 읽고 수첩에 남겨 두세요.'),
            O('cabinet', '표본장', 'cabinet', 800, 40, 150, 240, dict(label='표본장', c='#D9C4A0'),
              look='화석 표본을 넣어 두는 장이에요. 문에 모양 단추가 있어요.',
              lock=Lk('shape', [k for k, a, b in CARDS if a % b == 0], '표본장 문의 글: 화석 번호 카드 중 **나누어떨어지는 카드**의 모양을 카드 차례대로 눌러요.',
                      ['카드마다 나눗셈을 해서 나머지가 있는지 보세요.', '46÷4는 몫이 11이고 2가 남아요. 나머지가 있으니 나누어떨어지지 않아요. 다른 카드도 같은 방법으로 해 보세요.', '나머지가 0인(남는 것이 없는) 카드는 세 장이에요. 카드에 적힌 차례대로 눌러요.'],
                      '54÷6 = 9(△), 63÷7 = 9(□), 72÷8 = 9(◇) / 46÷4 = 11 … 2, 38÷5 = 7 … 3',
                      chk=lambda: [k for k, a, b in CARDS if a % b == 0], opts=['○', '△', '□', '☆', '◇']),
              after='표본장 안에 **발굴 로봇 길 안내도**가 있어요. 빨간 점을 따라가면 로봇이 뼈 더미에 닿는대요. 안쪽 아래에는 작은 서랍도 보여요.',
              afterFig=F('map', 360, 260, **MAP), guide='나누어떨어지는 카드를 골라 표본장을 열어 보세요.'),
            O('cdraw', '표본장 속 작은 서랍', 'drawer', 40, 175, 70, 40, dict(c='#8A6A4A', lock=True), in_='cabinet',
              lock=Lk('num', str(TEETH * BUCKETS), '표본장 안쪽 아래에 작은 서랍이 있어요! 숫자 자물쇠예요. 카드 구석 쪽지에 적힌 대로 계산해요.',
                      ['화석 번호 카드를 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'이빨 화석은 {TEETH}개, 모래 양동이는 {BUCKETS}개였어요.', f'{TEETH} × {BUCKETS} = 30 × {BUCKETS} + 8 × {BUCKETS}'],
                      f'이빨 화석 {TEETH} × 양동이 {BUCKETS} = {TEETH * BUCKETS}', chk=lambda: TEETH * BUCKETS),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='표본장을 연 뒤 안쪽 아래의 작은 서랍을 눌러 보세요.'),
            O('crate', '화석 운반 상자', 'box', 40, 400, 180, 130, dict(c='#B5651D', lock=True, label='?'),
              look='화석을 옮기는 상자예요. 숫자 자물쇠 네 칸이 있어요.',
              lock=Lk('num', str(LEG[0] * 1000 + LEG[1] + RIB[0] * 1000 + RIB[1]), '뚜껑의 글: **큰 다리뼈와 작은 갈비뼈를 함께 담으면 몇 g일까요?**',
                      ['연구실 칠판의 화석 무게표를 보세요.', f'kg은 kg끼리, g은 g끼리 더해요. {LEG[1]} g + {RIB[1]} g = {LEG[1] + RIB[1]} g은 1 kg보다 커요.', '1 kg = 1000 g이에요. 모두 몇 kg 몇 g인지 구한 뒤 g으로 나타내요.'],
                      f'{LEG[0]} kg {LEG[1]} g + {RIB[0]} kg {RIB[1]} g = 4 kg 150 g = {LEG[0] * 1000 + LEG[1] + RIB[0] * 1000 + RIB[1]} g',
                      chk=lambda: (2 * 1000 + 350) + (1 * 1000 + 800)),
              give=['bat'], after='상자가 열렸어요! 안에 **건전지**가 있어요.', guide='화석 무게표로 두 화석의 무게를 더해 운반 상자를 열어요.'),
            O('robot', '발굴 로봇', 'robot', 300, 380, 110, 150, dict(c='#C9B48E'),
              look='무거운 뼈를 옮기는 발굴 로봇이에요.',
              need='bat', needMsg='로봇이 꺼져 있어요. 배에 건전지 넣는 곳이 비어 있어요.', useMsg='건전지를 넣으니 로봇 눈에 불이 들어왔어요! "어디로 갈까요?"',
              lock=Lk('dir', segs(MAP['path']), '로봇에게 길을 알려 줘요. 표본장에서 찾은 안내도를 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩의 로봇 길 안내도를 열어 보세요. 로봇은 왼쪽 위에서 출발해요.', '처음에는 아래로 2칸 가요. 그다음은 오른쪽, 그다음은? 화살표는 모두 4개예요.'],
                      '아래로 2칸, 오른쪽으로 3칸, 위로 2칸, 오른쪽으로 2칸 가요. 누를 차례: ↓ → ↑ →', chk=lambda: segs('DDRRRUURR')),
              after='로봇이 안내도대로 가서 뼈 더미를 번쩍 옮겼어요! 뼈 더미 밑에서 **발굴 대장 수첩**이 나왔어요.',
              guide='건전지를 로봇에 넣고 안내도대로 길을 알려 주세요.'),
            O('diary', '발굴 대장 수첩', 'poster', 450, 380, 260, 140, dict(lines=DIARY, fs=19, c='#FFF8E6'), req=['robot'], keep=True,
              look=f'발굴 대장님의 수첩이에요. "이빨 화석은 상자 하나에 **{PER_BOX}개씩** 담아요. 남은 이빨도 상자에 꼭 담아 가야 울타리 문이 열려요."',
              lookFig=F('poster', 340, 150, lines=DIARY, fs=21, c='#FFF8E6'), guide='로봇이 찾아 준 발굴 대장 수첩을 읽어 보세요.'),
            O('scope', '현미경', 'microscope', 730, 330, 110, 160,
              look='작은 화석 조각을 크게 보는 현미경이에요. 렌즈 아래에 모래알만 보여요. 여기에는 잠긴 곳이 없네요.',
              guide='현미경은 구경만 해도 돼요.'),
        ]),
    ],
    flow=['sign', 'buckets', 'prog', 'chest', 'dig', 'tent', 'cards', 'cscrap', 'weigh', 'crate', 'cabinet', 'cdraw', 'kb1+kb2', 'robot', 'diary', 'gate'],
)
