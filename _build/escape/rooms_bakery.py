"""수학 방탈출 · 빵집 탈출 (추천 5학년 · 자연수의 혼합 계산·최대공약수·배수·시간 계산·점대칭·통분·사다리꼴 넓이·분수와 소수의 곱셈) — 형식은 rooms.py 머리말"""
from fractions import Fraction
from math import gcd
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
BEAN, CROI = 24, 36                                   # 진열대의 단팥빵·크루아상
BOXES = gcd(BEAN, CROI)                               # 12상자
PER_BOX = BEAN // BOXES + CROI // BOXES               # 한 상자에 2 + 3 = 5개
PRICE = [('식빵', 2800), ('우유', 1200), ('쿠키', 900)]
BUY = [('식빵', 2), ('우유', 3)]
PAID = 10000
P = dict(PRICE)
CHANGE = PAID - sum(P[k] * n for k, n in BUY)          # 10000 − (2800×2 + 1200×3) = 800
MENU = ['오늘의 빵 값'] + [f'{k} {v}원' for k, v in PRICE]

# 주방 가는 길 지도: 7의 배수 칸만 밟아 출발 → 주방 (None = 출발·도착 칸)
GRID = [[16, 27, 33, 45, None],
        [52, 38, 24, 46, 70],
        [63, 14, 56, 19, 42],
        [28, 31, 35, 49, 21],
        [None, 58, 25, 44, 60]]
START, GOAL = (0, 4), (4, 0)                          # (칸, 줄)
def walk():
    """7의 배수 칸만 따라 출발에서 도착까지 걷기(갈 수 있는 칸이 늘 하나뿐인지도 확인)"""
    x, y = START; seen = {START}; path = ''
    while (x, y) != GOAL:
        nx = [(d, x + dx, y + dy) for d, dx, dy in (('U', 0, -1), ('D', 0, 1), ('L', -1, 0), ('R', 1, 0))
              if 0 <= x + dx < 5 and 0 <= y + dy < 5 and (x + dx, y + dy) not in seen
              and ((x + dx, y + dy) == GOAL or (GRID[y + dy][x + dx] is not None and GRID[y + dy][x + dx] % 7 == 0))]
        assert len(nx) == 1, f'갈림길 {x},{y} {nx}'
        d, x, y = nx[0]; seen.add((x, y)); path += d
    return path
MAPP = dict(grid=GRID, start=list(START), goal=list(GOAL), sl='진열대', gl='주방', title='주방 가는 길')

CLK_H, CLK_M = 2, 35                                  # 반죽을 넣은 시각(시계)
REST, BAKE = 85, 45                                   # 반죽 쉬기 1시간 25분, 굽기 45분
END = CLK_H * 60 + CLK_M + REST + BAKE                # 4시 45분
RECIPE = ['버터 쿠키 만들기', '① 반죽 넣은 시각: 벽시계', '② 반죽 쉬기: 1시간 25분', '③ 오븐에서 굽기: 45분']

TRAY = ['△', '◇', '♡', '○', '☆', '□']                 # 쿠키 틀(왼쪽부터 1~6번)
POINT = {'○', '□', '◇'}                               # 180° 돌려도 처음과 같은 모양(점대칭도형)

JAM = [('빨강', Fraction(3, 4)), ('파랑', Fraction(5, 6)), ('초록', Fraction(2, 3)), ('노랑', Fraction(7, 12))]   # 잼 병에 남은 양(병 하나를 1로)
JARS = [{'c': c, 'label': f'{v.numerator}/{v.denominator}'} for c, v in JAM]

TOP, BOT, HT = 18, 32, 14                             # 사다리꼴 쟁반(cm)
TRAP = (TOP + BOT) * HT // 2                          # 350

SACK_N, SACK_KG = 16, Fraction(3, 4)                  # 밀가루 포대 16개, 한 포대 3/4 kg
CAKE_N, CAKE_KG = 15, Fraction(6, 10)                 # 케이크 15개, 하나에 밀가루 0.6 kg
LEFT_G = int((SACK_N * SACK_KG - CAKE_N * CAKE_KG) * 1000)   # (12 − 9) kg = 3000 g
ORDER_FIG = ['오늘 주문 장부', f'케이크 {CAKE_N}개', '케이크 하나에 밀가루 0.6 kg']

ROOM = dict(
    id='bakery', title='빵집 탈출', ico='🍞', acc='#B8692E',
    rec='추천 5학년 · 혼합 계산·최대공약수·배수·시간·점대칭·통분·사다리꼴 넓이·분수와 소수의 곱셈',
    intro='빵집 체험을 왔다가 가게 문이 잠겨 버렸어요! 빵 진열대·주방·창고를 살펴 단서를 모으고, 빵 축제가 열리는 골목으로 나가는 **뒷문**을 열어요.',
    story=['오늘은 동네 빵집에서 제빵사 체험을 하는 날이에요. 고소한 빵 냄새가 가득해요.',
           '그때 오븐 타이머가 "띵!" 울리더니, 철컥! 가게 문이 모두 잠겨 버렸어요.',
           '사장님이 남긴 단서를 풀어 빵 축제가 열리는 골목으로 나가는 뒷문을 열어요!'],
    outro='뒷문이 활짝 열렸어요! 골목에서는 빵 축제가 한창이에요. 우리가 구운 버터 쿠키를 들고 빵집을 무사히 탈출했어요!',
    mission=dict(title='빵집 뒷문을 열어라!', goal='빵 진열대·주방·창고의 단서를 모아 빵 축제 골목으로 나가는 뒷문을 열어요.', tips=['빵과 포대 수를 하나하나 세어요', '멈춘 시계의 바늘을 잘 보아요']),
    dialog=[('nar', '오늘은 동네 빵집에서 제빵사 체험을 하는 날이에요.'), ('tori', '음~ 고소한 빵 냄새! 배고파지는걸?'), ('nar', '띵! 오븐 타이머가 울리더니 철컥, 가게 문이 모두 잠겼어요.'), ('momo', '사장님이 단서를 남겨 두셨대. 하나씩 풀어 보자.'), ('tori', '뒷문만 열면 빵 축제 골목이야! 서두르자!'), ('momo', '진열대, 주방, 창고 차례로 살펴보자.')],
    outro_dialog=[('tori', '빵 축제다! 우리가 구운 쿠키도 맛있어!'), ('momo', '혼합 계산부터 사다리꼴 넓이까지 척척 풀었어.')],
    items={'stick': dict(nm='밀대', k='stick', c='#B98552', de='반죽을 미는 긴 나무 밀대예요. 끝에 무언가를 끼울 구멍이 있어요.'),
           'gear': dict(nm='반죽기 톱니바퀴', k='gear', c='#8A929C', de='반죽기에서 빠진 톱니바퀴 같아요'),
           'hook': dict(nm='쇠 갈고리', k='hook', c='#6E7580', de='짧은 쇠 갈고리예요. 손잡이 없이 갈고리 부분만 있어요.'),
           'lhook': dict(nm='긴 갈고리 막대', k='hook', c='#B98552', de='밀대 끝에 갈고리를 끼운 긴 막대예요. 높은 곳에 닿을 것 같아요.')},
    combine=[dict(a='stick', b='hook', make='lhook', msg='밀대 끝 구멍에 쇠 갈고리를 딸깍 끼웠더니 **긴 갈고리 막대**가 되었어요!')],
    scenes=[
        dict(id='a', nm='빵 진열대', bg=dict(wall='#FCE9D0', floor='#C99A6B', deco='tile'), objs=[
            O('menu', '빵 값 안내판', 'board', 40, 40, 250, 170, dict(lines=MENU, fs=22), keep=True,
              look='오늘 파는 빵의 값이 적혀 있어요.', lookFig=F('board', 320, 200, lines=MENU, fs=26),
              guide='빵 값 안내판을 읽고 수첩에 남겨 두세요.', say=('momo', '빵 값을 잘 기억해 둬. 계산할 때 쓸 거야.')),
            O('display', '빵 진열대', 'bkDisplay', 320, 50, 360, 310, dict(a=BEAN, b=CROI, per=12), keep=True,
              look='유리 진열대예요. 위 칸에는 동그란 **단팥빵**, 아래 칸에는 초승달 모양 **크루아상**이 줄지어 있어요. 빵마다 몇 개일까요?',
              lookFig=F('bkDisplay', 460, 380, a=BEAN, b=CROI, per=12),
              guide='빵 진열대의 단팥빵과 크루아상을 따로 세어 보세요. 한 줄에 몇 개씩인지 보면 빨라요.', say=('tori', '단팥빵이랑 크루아상, 몇 개씩인지 세어 보자!')),
            O('register', '금전 등록기', 'bkRegister', 710, 210, 150, 170, dict(screen='???', done=str(CHANGE)),
              lock=Lk('num', str(CHANGE), '등록기 화면에 손님 주문이 떠 있어요: **식빵 2개와 우유 3개를 사고 10000원을 냈어요.** 거스름돈은 얼마일까요? 숫자 세 개.',
                      ['빵 값 안내판에서 식빵과 우유 값을 찾아요. 쿠키는 사지 않았어요.', '산 값부터 구해요: 2800 × 2 + 1200 × 3. 곱셈을 덧셈보다 먼저 해요.', '10000 − (2800 × 2 + 1200 × 3)을 계산해요.'],
                      f'10000 − (2800 × 2 + 1200 × 3) = 10000 − (5600 + 3600) = 10000 − 9200 = {CHANGE}',
                      chk=lambda: PAID - (P['식빵'] * 2 + P['우유'] * 3)),
              after='"딩동!" 돈 서랍이 열리며 **주방 가는 길** 지도가 나왔어요. 칸마다 수가 적혀 있고, 아래에 "7의 배수 칸만 밟아요"라고 쓰여 있어요.',
              afterFig=F('bkMap', 330, 330, **MAPP), guide='빵 값 안내판을 보고 금전 등록기의 거스름돈을 계산해 보세요.'),
            O('pbox', '포장 상자 더미', 'box', 60, 400, 190, 130, dict(c='주황', lock=True, label='포장'),
              lock=Lk('num', f'{BOXES}{PER_BOX}', '상자에 붙은 쪽지: 진열대의 단팥빵과 크루아상을 상자마다 똑같이, 남김없이 나누어 담으려고 해요. **비밀번호는 (가장 많이 만들 수 있는 상자 수) 뒤에 (한 상자에 담는 단팥빵 수 + 크루아상 수)를 이어 쓴 수예요.** 숫자 세 개.',
                      ['진열대를 크게 보고 단팥빵과 크루아상을 따로 세어요. 한 줄에 12개씩이에요.', '두 수를 모두 남김없이 나누는 가장 큰 수, 곧 최대공약수가 상자 수예요.', f'{BEAN}와 {CROI}의 최대공약수로 각각을 나누어 한 상자에 든 빵 수를 더해요.'],
                      f'단팥빵 {BEAN}개, 크루아상 {CROI}개의 최대공약수 {BOXES} → 한 상자에 {BEAN // BOXES} + {CROI // BOXES} = {PER_BOX}개 → {BOXES}{PER_BOX}',
                      chk=lambda: int(f'{gcd(BEAN, CROI)}{BEAN // gcd(BEAN, CROI) + CROI // gcd(BEAN, CROI)}')),
              give=['stick'], after='상자가 열렸어요! 안에 긴 나무 **밀대**가 들어 있어요. 밀대 끝에 작은 구멍이 있어요.',
              guide='빵을 세어 최대공약수로 포장 상자 더미를 열어 보세요.'),
            O('kdoor', '주방 문', 'door', 880, 170, 110, 210, dict(c='갈색', sign='주방'),
              lock=Lk('dir', segs(walk()), '주방 문의 화살표 단추예요. **주방 가는 길** 지도에서 **7의 배수 칸만** 밟아 진열대에서 주방까지 가요. 가는 방향이 바뀌는 차례대로 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['금전 등록기에서 나온 지도를 수첩에서 열어 보세요. 7단 곱셈구구를 떠올려요.', '진열대 칸 바로 위 28이 7의 배수예요. 그다음 7의 배수 칸은 어느 쪽에 있나요?', '7 × 2 = 14, 7 × 5 = 35, 7 × 7 = 49, 7 × 9 = 63, 7 × 10 = 70처럼 7로 나누어떨어지는 수만 밟아요. 화살표는 모두 5개예요.'],
                      '7의 배수 칸만 밟아 위로 2칸(28·63), 오른쪽으로 2칸(14·56), 아래로 1칸(35), 오른쪽으로 2칸(49·21), 위로 3칸(42·70·주방) 가요. 누를 차례: ↑ → ↓ → ↑',
                      chk=lambda: segs(walk())),
              go='b', after='화살표대로 누르자 주방 문이 덜컥 열렸어요!', guide='금전 등록기에서 나온 지도의 7의 배수 칸을 따라 주방 문의 화살표를 눌러 보세요.'),
        ]),
        dict(id='b', nm='주방', bg=dict(wall='#F6E3CC', floor='#8C6A4F', deco='brick'), objs=[
            O('clock', '벽시계', 'clock', 60, 40, 130, 130, dict(h=CLK_H, m=CLK_M), keep=True,
              look='벽시계가 멈춰 있어요. 사장님이 반죽을 넣은 시각에 멈췄대요. 짧은바늘과 긴바늘을 잘 보세요.', lookFig=F('clock', 170, 170, h=CLK_H, m=CLK_M),
              guide='벽시계가 몇 시 몇 분을 가리키는지 보세요.', say=('tori', '시계가 멈췄어! 바늘이 가리키는 시각을 잘 봐.')),
            O('recipe', '레시피 판', 'poster', 205, 40, 300, 175, dict(lines=RECIPE, fs=19, c='#FFFDF4'), keep=True,
              look='버터 쿠키를 만드는 차례가 적힌 레시피 판이에요.', lookFig=F('poster', 440, 230, lines=RECIPE, fs=26, c='#FFFDF4'),
              guide='레시피 판을 읽고 수첩에 남겨 두세요. 크게 보면 구석에 무언가 꽂혀 있어요.', say=('momo', '굽는 시간이 적혀 있네. 시각 계산에 쓰일 것 같아.')),
            O('rscrap', '레시피 구석 쪽지', 'scrap', 244, 137, 50, 36, dict(t='?'), in_='recipe', keep=True,
              look=f'레시피 판 구석에 아주 작은 쪽지가 꽂혀 있어요! "잼 금고 속 작은 서랍 = **창고 케이크 쟁반(사다리꼴)의 넓이(cm²)**"',
              guide='레시피 판을 크게 보고 오른쪽 아래 구석의 작은 쪽지를 찾아보세요.'),
            O('tray', '쿠키 틀 판', 'bkTray', 520, 50, 290, 120, dict(shapes=TRAY), keep=True,
              look='쿠키 틀 여섯 개가 판 위에 놓여 있어요. 왼쪽부터 1번~6번이에요.', lookFig=F('bkTray', 420, 150, shapes=TRAY),
              guide='쿠키 틀 판의 모양 차례를 수첩에 남겨 두세요.', say=('tori', '쿠키 틀을 반 바퀴 돌리면 어떻게 보일까?')),
            O('oven', '큰 오븐', 'bkOven', 60, 230, 230, 270, dict(t='-:--'),
              lock=Lk('num', f'{END // 60}{END % 60:02d}', '오븐 타이머에 쪽지: **쿠키가 다 구워지는 시각을 맞춰요.** (몇 시 몇 분 → 숫자 세 개, 예: 3시 05분이면 305)',
                      ['벽시계와 레시피 판을 함께 보세요. 시계의 시각이 반죽을 넣은 시각이에요.', f'{CLK_H}시 {CLK_M}분에서 반죽 쉬기 1시간 25분이 지나면 몇 시인가요? 60분이 되면 1시간으로 올려요.', '그 시각에서 굽기 45분을 더 더해요.'],
                      f'{CLK_H}시 {CLK_M}분 + 1시간 25분 = 4시 00분, + 45분 = {END // 60}시 {END % 60}분 → {END // 60}{END % 60:02d}',
                      chk=lambda: int(f'{(CLK_H * 60 + CLK_M + REST + BAKE) // 60}{(CLK_H * 60 + CLK_M + REST + BAKE) % 60:02d}')),
              give=['gear'], after='"띵!" 오븐 문이 열리고 노릇한 쿠키가 나왔어요. 쿠키 판 밑에 **반죽기 톱니바퀴**가 떨어져 있어요!',
              guide='벽시계 시각에 레시피 시간을 더해 오븐 타이머를 맞춰 보세요.'),
            O('mixer', '반죽기', 'bkMixer', 340, 250, 180, 240,
              need='gear', needMsg='반죽기가 멈춰 있어요. 옆에 톱니바퀴가 빠진 자리(점선)가 보여요.', useMsg='톱니바퀴를 끼웠더니 반죽기 옆 모양 단추에 불이 켜졌어요!',
              lock=Lk('shape', [s for s in TRAY if s in POINT], '반죽기 모양 단추 위 글: **오늘은 반 바퀴(180°) 돌려도 처음과 똑같은 쿠키 틀만 써요. 쿠키 틀 판에서 그런 틀을 왼쪽부터 차례로 눌러요.**',
                      ['쿠키 틀 판을 수첩에서 열어 보세요. 틀마다 머릿속으로 반 바퀴 돌려 봐요.', '한 점을 중심으로 180° 돌렸을 때 처음 모양과 완전히 겹치는 도형을 점대칭도형이라고 해요.', '△·♡·☆는 반 바퀴 돌리면 뒤집혀 보여요. 나머지 세 틀을 왼쪽부터 눌러요.'],
                      '왼쪽부터 ◇(2번) → ○(4번) → □(6번). △·♡·☆는 180° 돌리면 처음 모양과 겹치지 않아요.',
                      chk=lambda: [s for s in TRAY if s in POINT], opts=['○', '△', '□', '☆', '◇', '♡']),
              after='반죽기가 윙윙 돌아가자 벽 선반이 스르르 밀리며 **창고 문**이 나타났어요!',
              guide='오븐에서 찾은 톱니바퀴를 반죽기에 끼우고, 점대칭인 쿠키 틀을 골라 보세요.'),
            O('sdoor', '창고 문', 'door', 830, 170, 130, 210, dict(c='초록', sign='창고'), req=['mixer'], go='c',
              look='반죽기가 찾아 준 창고 문이에요.', after='문 너머에 밀가루 냄새가 나는 창고가 보여요.', guide='새로 나타난 창고 문으로 가 보세요.'),
        ]),
        dict(id='c', nm='창고', bg=dict(wall='#E6D8C2', floor='#7A6450', deco='stripe'), objs=[
            O('jars', '잼 병 선반', 'bottles', 40, 50, 300, 180, dict(items=JARS), keep=True,
              look='잼 병 네 개에 숫자가 붙어 있어요. 병 하나를 가득 찬 양 1로 볼 때, 지금 남은 잼의 양이래요.', lookFig=F('bottles', 340, 180, items=JARS),
              guide='잼 병에 붙은 분수를 살펴보세요.'),
            O('plan', '케이크 쟁반 도면', 'bkPlan', 370, 40, 240, 180, dict(top=TOP, bot=BOT, ht=HT), keep=True,
              look='사다리꼴 모양 케이크 쟁반의 도면이에요. 빨간 점선이 높이예요.', lookFig=F('bkPlan', 340, 250, top=TOP, bot=BOT, ht=HT),
              guide='케이크 쟁반 도면의 윗변·아랫변·높이를 수첩에 남겨 두세요.'),
            O('cbox', '잼 금고', 'safe', 440, 290, 160, 160, dict(colors=['빨강', '파랑', '초록', '노랑']),
              lock=Lk('color', [c for v, c in sorted((v, c) for c, v in JAM)], '금고 문 쪽지: **잼이 적게 남은 병부터** 그 병의 색을 차례로 눌러요.',
                      ['잼 병 선반을 크게 보세요. 분모가 서로 달라요.', '분모를 12로 같게 통분해 보세요. 3/4 = 9/12예요.', '5/6 = 10/12, 2/3 = 8/12예요. 분자가 작은 것부터 눌러요.'],
                      '노랑 7/12 → 초록 2/3(8/12) → 빨강 3/4(9/12) → 파랑 5/6(10/12)',
                      chk=lambda: [c for v, c in sorted((v, c) for c, v in JAM)], opts=['빨강', '노랑', '초록', '파랑']),
              after='잼 금고가 열렸어요! 안은 비어 있지만, 안쪽 벽에 **아주 작은 서랍**이 또 있어요.',
              guide='잼 병의 분수를 통분해 비교하고 잼 금고를 열어 보세요.'),
            O('sdraw', '금고 속 작은 서랍', 'drawer', 45, 100, 70, 40, dict(c='#8A929C', lock=True), in_='cbox',
              lock=Lk('num', str(TRAP), '금고 안 아주 작은 서랍이에요! 숫자 자물쇠예요. 주방 레시피 판 구석 쪽지에 적힌 대로 계산해요.',
                      ['주방 레시피 판을 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', '케이크 쟁반 도면에서 윗변·아랫변·높이를 찾아요.', '사다리꼴의 넓이 = (윗변 + 아랫변) × 높이 ÷ 2예요.'],
                      f'({TOP} + {BOT}) × {HT} ÷ 2 = {TOP + BOT} × {HT} ÷ 2 = {TRAP}', chk=lambda: (TOP + BOT) * HT // 2),
              give=['hook'], after='작은 서랍 안에 짧은 **쇠 갈고리**가 들어 있어요. 손잡이가 없어서 혼자서는 쓰기 어려워요.',
              guide='잼 금고를 연 뒤 금고 안쪽의 작은 서랍을 눌러 보세요.'),
            O('sacks', '밀가루 포대', 'bkSacks', 40, 290, 310, 230, dict(n=SACK_N, per=8, label='한 포대 3/4 kg'), keep=True,
              look='밀가루 포대가 차곡차곡 쌓여 있어요. 안내판에 "한 포대 3/4 kg"이라고 쓰여 있어요. 포대는 모두 몇 개일까요?',
              lookFig=F('bkSacks', 420, 300, n=SACK_N, per=8, label='한 포대 3/4 kg'),
              guide='밀가루 포대가 모두 몇 개인지 세어 보세요.', say=('momo', '포대가 겹쳐 있어. 빠뜨리지 않게 세어 보자.')),
            O('shelf', '높은 선반', 'bkHigh', 640, 30, 170, 360,
              need='lhook', needMsg='선반 맨 위 칸에 상자가 있어요. 너무 높아서 손이 닿지 않아요.', useMsg='긴 갈고리 막대로 상자를 걸어 살살 내렸어요!',
              after='상자 안에 **오늘 주문 장부**가 있어요. "케이크 15개, 케이크 하나에 밀가루 0.6 kg"이라고 적혀 있어요.',
              afterFig=F('poster', 320, 160, lines=ORDER_FIG, fs=22, c='#FFFDF4'),
              guide='밀대와 쇠 갈고리를 합쳐 높은 선반의 상자를 내려 보세요.'),
            O('exit', '뒷문', 'door', 850, 170, 120, 210, dict(c='빨강', sign='뒷문'),
              lock=Lk('num', str(LEFT_G), '뒷문 숫자판 위 글: **비밀번호 = 창고 밀가루로 오늘 주문 케이크를 모두 만들고 남는 밀가루의 무게(g)** 숫자 네 개.',
                      ['밀가루 포대를 세고, 높은 선반에서 찾은 주문 장부를 함께 보세요.', f'창고 밀가루 = 3/4 × {SACK_N}, 케이크에 쓸 밀가루 = 0.6 × {CAKE_N}이에요.', '남는 밀가루(kg)를 구한 뒤 1 kg = 1000 g으로 바꾸어요.'],
                      f'3/4 × {SACK_N} = {SACK_N * SACK_KG} kg, 0.6 × {CAKE_N} = {CAKE_N * CAKE_KG} kg, {SACK_N * SACK_KG} − {CAKE_N * CAKE_KG} = 3 kg = {LEFT_G} g',
                      chk=lambda: int((SACK_N * Fraction(3, 4) - CAKE_N * Fraction(6, 10)) * 1000)),
              go='exit', after='뒷문이 열렸어요!', guide='밀가루 포대와 주문 장부로 남는 밀가루의 무게를 구해 뒷문을 열어 보세요.'),
        ]),
    ],
    flow=['menu', 'display', 'register', 'pbox', 'kdoor', 'clock', 'recipe', 'rscrap', 'tray', 'oven', 'mixer', 'sdoor',
          'jars', 'plan', 'cbox', 'sdraw', 'stick+hook', 'shelf', 'sacks', 'exit'],
)
