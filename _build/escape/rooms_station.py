"""수학 방탈출 · 기차역 탈출 (추천 3학년 · 시간 계산·분수의 크기·원의 지름·나눗셈의 나머지·곱셈·km와 m·방향) — 형식은 rooms.py 머리말"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(역 이름·시각·거리·손님 수는 모두 이야기 속 값)
CLOCK_H, CLOCK_M = 2, 35                                 # 대합실 시계 2시 35분
TRAINS = [('바다호', 2, 50, '바다역', 1), ('별빛호', 3, 20, '달빛역', 2), ('구름호', 4, 5, '은하역', 3)]
DEPART = [[n, f'{h}:{m:02d}', d, f'{pl}번'] for n, h, m, d, pl in TRAINS]
OURS = TRAINS[1]                                         # 우리가 탈 별빛호
WAIT = (OURS[1] * 60 + OURS[2]) - (CLOCK_H * 60 + CLOCK_M)   # 45분
CLEAN = [('빨강', 3), ('파랑', 6), ('노랑', 2), ('초록', 4)]   # 청소 진행표: den칸 중 1칸
CLEAN_ORDER = [c for _, c in sorted((Fraction(1, d), c) for c, d in CLEAN)]
WHEEL_N, WHEEL_R = 4, 25                                 # 옛 바퀴 4개, 반지름 25 cm
PASS = 50                                                # 별빛호 손님 50명
CARS = 6                                                 # 손님 칸 6칸
PASSLINES = ['별빛호 손님 안내', f'오늘 손님 {PASS}명은', '손님 칸마다 똑같이 나누어 타요.', '남은 손님은 승무원과 함께 타요.']
MAP = dict(n=4, m=5, start=[0, 3], path='RRUURRD', block=[[1, 2], [3, 2], [0, 1]], sl='승강장', gl='기관실')
PANEL = [('○', 23, 4), ('△', 18, 5), ('□', 31, 3), ('☆', 16, 6)]   # 모양 단추의 곱셈식
PANEL_ORDER = [s for _, s in sorted((a * b, s) for s, a, b in PANEL)]
ROUTE_ST = ['별빛역', '은하역', '달빛역', '바다역']
ROUTE_M = [1750, 2600, 3400]                             # 역 사이 거리(m): 1 km 750 m, 2 km 600 m, 3 km 400 m
def km(m): return f'{m // 1000} km {m % 1000} m' if m % 1000 else f'{m // 1000} km'
DEST_M = sum(ROUTE_M[:ROUTE_ST.index(OURS[3])])          # 별빛역 → 달빛역 4350 m

ROOM = dict(
    id='station', title='기차역 탈출', ico='🚂', acc='#2E7D5B',
    rec='추천 3학년 · 시간 계산·분수의 크기·원의 지름·나눗셈의 나머지·곱셈·km와 m·방향',
    intro='별빛호를 기다리다 깜빡 잠든 사이 기차역 문이 모두 잠겼어요! 대합실·승강장·기관실을 지나며 단서를 모아 별빛호를 출발시켜요.',
    story=['기차 여행을 떠나는 날, 별빛호를 기다리다 대합실 의자에서 깜빡 잠이 들었어요.',
           '눈을 떠 보니 역에는 아무도 없고, 쿵! 대합실 문이 닫히며 자물쇠가 철컥 걸렸어요.',
           '단서를 모아 기관실까지 가서 별빛호의 출발 장치를 켜요!'],
    outro='"출발!" 소리와 함께 역의 문이 모두 열리고 기관사님이 달려오셨어요. 별빛호를 타고 무사히 기차역을 탈출했어요!',
    items={'ticket': dict(nm='승차권', k='card', c='#F2C230', de='별빛호 승차권이에요. 개찰구에 넣을 수 있어요'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#2E7D5B', de='초록 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#2E7D5B', de='초록 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.'),
           'key': dict(nm='기관실 열쇠', k='key', c='#2E7D5B', de='초록 열쇠예요. 열쇠 고리에 \'기관실\'이라고 적혀 있어요'),
           'handle': dict(nm='출발 손잡이', k='stick', c='#C9A24B', de='출발 장치에 끼우는 손잡이예요')},
    combine=[dict(a='kh1', b='kh2', make='key', msg='손잡이와 몸통을 딸깍 끼웠더니 **기관실 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='대합실', bg=dict(wall='#E3EEF3', floor='#B9A58C', deco='tile'), objs=[
            O('clock', '대합실 시계', 'clock', 40, 30, 120, 120, dict(h=CLOCK_H, m=CLOCK_M), keep=True,
              look='대합실 시계예요. 짧은바늘과 긴바늘이 가리키는 곳을 잘 보세요.', lookFig=F('clock', 160, 160, h=CLOCK_H, m=CLOCK_M),
              guide='대합실 시계가 몇 시 몇 분인지 읽어 보세요.'),
            O('depart', '출발 안내판', 'stDepart', 180, 30, 380, 170, dict(rows=DEPART), keep=True,
              look='오늘 떠나는 기차가 적힌 안내판이에요. 우리가 탈 기차는 **별빛호**예요.', lookFig=F('stDepart', 420, 190, rows=DEPART),
              guide='출발 안내판에서 별빛호가 언제, 어디로 떠나는지 찾아보세요.'),
            O('cleanb', '청소 진행표', 'stFrac', 580, 30, 220, 180, dict(items=[{'c': c, 'den': d} for c, d in CLEAN], title='청소 진행표'), keep=True,
              look='역의 네 구역을 청소한 만큼 색칠한 표예요. 막대마다 **똑같이 나눈 칸 중 한 칸**만 칠해져 있어요.',
              lookFig=F('stFrac', 340, 260, items=[{'c': c, 'den': d} for c, d in CLEAN], title='청소 진행표'),
              guide='청소 진행표의 색칠한 부분이 전체의 얼마인지 분수로 살펴보세요.'),
            O('kiosk', '승차권 발매기', 'stKiosk', 840, 120, 130, 260,
              lock=Lk('num', str(WAIT), '발매기 화면: **별빛호가 떠나기까지 남은 시간은 몇 분일까요?** 숫자 두 개를 맞춰요.',
                      ['대합실 시계와 출발 안내판을 함께 보세요. 우리가 탈 기차는 별빛호예요.',
                       f'시계는 {CLOCK_H}시 {CLOCK_M}분, 별빛호는 {OURS[1]}시 {OURS[2]}분에 떠나요.',
                       f'{CLOCK_H}시 {CLOCK_M}분에서 {OURS[1]}시까지 몇 분인지 먼저 세고, 거기에 {OURS[2]}분을 더해요.'],
                      f'{CLOCK_H}시 {CLOCK_M}분 → {OURS[1]}시: 25분, {OURS[1]}시 → {OURS[1]}시 {OURS[2]}분: {OURS[2]}분 → 25 + {OURS[2]} = {WAIT}분',
                      chk=lambda: (OURS[1] * 60 + OURS[2]) - (CLOCK_H * 60 + CLOCK_M)),
              give=['ticket'], after='발매기에서 **별빛호 승차권**이 나왔어요! 이제 개찰구를 지날 수 있어요.',
              guide='시계와 출발 안내판으로 남은 시간을 계산해 승차권을 받아요.'),
            O('lostbox', '분실물 보관함', 'cabinet', 30, 190, 150, 190, dict(c='#C9B99A', label='분실물'),
              lock=Lk('color', CLEAN_ORDER, '보관함 문의 쪽지: **청소 진행표에서 색칠한 부분이 작은 것부터** 그 막대의 색을 차례로 눌러요.',
                      ['청소 진행표를 크게 보세요. 막대마다 몇 칸으로 똑같이 나누었는지 세어요.',
                       '빨강은 3칸 중 1칸이니 1/3이에요. 나머지 막대도 분수로 나타내요.',
                       '분자가 1인 분수는 분모가 클수록 작은 수예요.'],
                      '파랑 1/6 → 초록 1/4 → 빨강 1/3 → 노랑 1/2',
                      chk=lambda: [c for _, c in sorted((Fraction(1, d), c) for c, d in CLEAN)], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kh1'], after='보관함이 열렸어요! 잃어버린 우산들 사이에 초록 **열쇠 손잡이**가 있어요. 맨 아래에는 **아주 작은 서랍**도 보여요.',
              guide='청소 진행표의 분수 크기를 비교해 분실물 보관함을 열어 보세요.'),
            O('ldraw', '보관함 속 작은 서랍', 'drawer', 40, 130, 70, 40, dict(c='#8A929C', lock=True), in_='lostbox',
              lock=Lk('num', str(WHEEL_R * 2 * WHEEL_N), '보관함 안 아주 작은 서랍이에요! 숫자 자물쇠예요. 의자 위 쪽지에 적힌 대로 계산해요.',
                      ['대기 의자를 크게 보면 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.',
                       f'옛 기차 바퀴의 반지름은 {WHEEL_R} cm예요. 원의 지름은 반지름의 몇 배인가요?',
                       '바퀴가 몇 개 나란히 붙어 있는지 세고, 지름을 그만큼 더해요.'],
                      f'지름 = {WHEEL_R} × 2 = {WHEEL_R * 2} cm, 바퀴 {WHEEL_N}개 → {WHEEL_R * 2} × {WHEEL_N} = {WHEEL_R * 2 * WHEEL_N} cm',
                      chk=lambda: WHEEL_R * 2 * WHEEL_N),
              give=['kh2'], after='작은 서랍 안에 초록 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='보관함을 연 뒤 보관함 안쪽의 작은 서랍을 눌러 보세요.'),
            O('bench', '대기 의자', 'stBench', 300, 290, 260, 120,
              look='우리가 잠들었던 파란 대기 의자예요. 잠긴 곳은 없어요.', guide='대기 의자를 크게 보면 무언가 끼워져 있을지도 몰라요.'),
            O('bscrap', '의자 틈 쪽지', 'scrap', 196, 6, 50, 34, dict(t='?'), in_='bench', keep=True,
              look='의자 틈에 아주 작은 쪽지가 끼워져 있어요! "보관함 속 작은 서랍 = **옛 기차 바퀴를 나란히 붙여 놓은 길이(cm)**"',
              guide='대기 의자를 크게 보고 등받이 틈의 작은 쪽지를 찾아보세요.'),
            O('wheels', '옛 기차 바퀴 전시대', 'stWheels', 30, 400, 250, 140, dict(n=WHEEL_N, r=WHEEL_R), keep=True,
              look='옛날 증기 기관차의 바퀴가 서로 딱 붙어 나란히 놓여 있어요. 첫 바퀴에 빨간 선으로 **반지름**이 표시되어 있어요.',
              lookFig=F('stWheels', 380, 200, n=WHEEL_N, r=WHEEL_R),
              guide='옛 기차 바퀴가 몇 개인지, 반지름이 몇 cm인지 살펴보세요.'),
            O('gate', '개찰구', 'stGate', 600, 240, 200, 170,
              need='ticket', needMsg='개찰구 막대가 닫혀 있어요. 승차권 넣는 곳이 보여요.', useMsg='승차권을 넣었더니 삑! 막대가 올라갔어요.',
              go='b', after='개찰구 너머로 승강장 계단이 보여요.', guide='승차권을 개찰구에 넣고 승강장으로 가요.'),
        ]),
        dict(id='b', nm='승강장', bg=dict(wall='#CFE0EA', floor='#9C9488', deco='stripe'), objs=[
            O('passb', '승강장 안내판', 'poster', 30, 30, 280, 160, dict(lines=PASSLINES, fs=17, c='#FFFDF4'), keep=True,
              look='승강장 안내판이에요. 별빛호 손님이 어떻게 타는지 적혀 있어요.', lookFig=F('poster', 380, 200, lines=PASSLINES, fs=21, c='#FFFDF4'),
              guide='승강장 안내판을 읽고 수첩에 남겨 두세요.'),
            O('train', '별빛호', 'stTrain', 330, 30, 650, 200, dict(cars=CARS), keep=True,
              look='별빛호가 서 있어요. 맨 앞 빨간 기관차 뒤로 파란 **손님 칸**이 이어져 있어요. 손님 칸은 몇 칸일까요?',
              lookFig=F('stTrain', 460, 150, cars=CARS),
              guide='별빛호의 파란 손님 칸이 몇 칸인지 세어 보세요.'),
            O('crewbox', '승무원 상자', 'box', 220, 390, 170, 130, dict(c='파랑', lock=True, label='승무원'),
              lock=Lk('num', f'{PASS // CARS}{PASS % CARS}', '상자 뚜껑의 쪽지: 승강장 안내판대로 탔을 때, **비밀번호 = (손님 칸 한 칸에 탄 손님 수)(남은 손님 수)**예요. 두 수를 이어 써요.',
                      ['승강장 안내판과 별빛호를 함께 보세요. 손님은 몇 명이고, 손님 칸은 몇 칸인가요?',
                       f'손님 {PASS}명을 손님 칸 {CARS}칸에 똑같이 나누어요. {PASS} ÷ {CARS}의 몫과 나머지를 구해요.',
                       f'{CARS}단 곱셈구구에서 {PASS}보다 크지 않은 가장 큰 수를 찾아요.'],
                      f'{PASS} ÷ {CARS} = {PASS // CARS} … {PASS % CARS} → 한 칸에 {PASS // CARS}명, 남은 손님 {PASS % CARS}명 → {PASS // CARS}{PASS % CARS}',
                      chk=lambda: int(f'{PASS // CARS}{PASS % CARS}')),
              after='상자가 열렸어요! 안에 **선로 지도**가 들어 있어요. 빨간 점이 별빛호가 기관실 쪽으로 갈 길이에요.',
              afterFig=F('map', 300, 240, **MAP), guide='안내판과 별빛호의 손님 칸으로 나눗셈을 해서 승무원 상자를 열어 보세요.'),
            O('switch', '선로 전환기', 'stLever', 40, 230, 140, 190,
              lock=Lk('dir', segs(MAP['path']), '선로 전환기의 화살표 단추예요. 승무원 상자에서 찾은 **선로 지도**를 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩에서 선로 지도를 열어 보세요. \'승강장\'에서 출발해 빨간 점을 따라가요.',
                       '처음에는 오른쪽으로 가요. 그다음은 어느 쪽으로 꺾이나요? 화살표는 모두 4개예요.'],
                      '오른쪽으로 2칸, 위로 2칸, 오른쪽으로 2칸, 아래로 1칸 가요. 누를 차례: → ↑ → ↓', chk=lambda: segs('RRUURRD')),
              after='철컥! 선로가 바뀌자 승강장 끝 차단기가 올라가고 **기관실 문**이 나타났어요.',
              guide='선로 지도대로 선로 전환기의 화살표를 눌러 보세요.'),
            O('kdoor', '기관실 문', 'door', 830, 270, 130, 220, dict(c='초록', sign='기관실'), req=['switch'],
              need='key', needMsg='기관실 문이 잠겨 있어요. 초록 열쇠 구멍이 보여요.', useMsg='기관실 열쇠로 문을 열었어요!',
              go='c', after='문 너머로 별빛호의 기관실이 보여요.', guide='열쇠 손잡이와 몸통을 합쳐 기관실 문을 열어 보세요.'),
        ]),
        dict(id='c', nm='기관실', bg=dict(wall='#3A4250', floor='#5E5A55', deco='brick'), objs=[
            O('route', '노선도', 'stRoute', 30, 30, 440, 170, dict(st=ROUTE_ST, d=[km(m) for m in ROUTE_M], title='별빛 노선도'), keep=True,
              look='기관실 벽에 붙은 노선도예요. 역과 역 사이의 거리가 적혀 있어요.',
              lookFig=F('stRoute', 460, 180, st=ROUTE_ST, d=[km(m) for m in ROUTE_M], title='별빛 노선도'),
              guide='노선도를 읽고 수첩에 남겨 두세요.'),
            O('window3', '기관실 창문', 'window', 780, 40, 190, 140, dict(night=True),
              look='창밖으로 깜깜한 선로가 보여요. 잠긴 곳은 없어요.', guide='창문에는 잠긴 곳이 없어요. 다른 물건을 살펴보세요.'),
            O('panel', '모양 단추 판', 'stPanel', 500, 40, 260, 190, dict(btns=[{'s': s, 't': f'{a}×{b}'} for s, a, b in PANEL]),
              lock=Lk('shape', PANEL_ORDER, '단추 판 아래 쪽지: **단추 밑 곱셈의 값이 작은 것부터** 그 모양을 차례로 눌러요.',
                      ['단추 판을 크게 보세요. 모양마다 밑에 곱셈식이 있어요.',
                       '23 × 4는 20 × 4와 3 × 4를 더해서 구할 수 있어요.',
                       '네 곱셈의 값은 모두 90과 100 사이예요. 차근차근 비교해요.'],
                      '△ 18×5=90 → ○ 23×4=92 → □ 31×3=93 → ☆ 16×6=96',
                      chk=lambda: [s for _, s in sorted((a * b, s) for s, a, b in PANEL)], opts=['○', '△', '□', '☆']),
              give=['handle'], after='단추 판 아래 덮개가 열리며 **출발 손잡이**가 나왔어요!', guide='곱셈을 계산해 값이 작은 것부터 모양 단추를 눌러 보세요.'),
            O('exit', '출발 장치', 'stThrottle', 300, 270, 300, 240,
              need='handle', needMsg='출발 장치에 손잡이를 끼우는 구멍이 비어 있어요.', useMsg='출발 손잡이를 끼웠어요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(DEST_M), '출발 장치 숫자판: **별빛호가 별빛역에서 \'가는 곳\'까지 달리는 거리는 모두 몇 m일까요?** 숫자 네 개를 맞춰요.',
                      ['대합실의 출발 안내판에서 별빛호가 가는 곳을 찾고, 노선도에서 거기까지 가는 길을 보세요.',
                       f'별빛역 → 은하역 {km(ROUTE_M[0])}, 은하역 → 달빛역 {km(ROUTE_M[1])}를 더해요. m끼리 더해 1000 m가 넘으면 1 km로 올려요.',
                       '1 km = 1000 m예요. 몇 km 몇 m를 m로만 나타내요.'],
                      f'{km(ROUTE_M[0])} + {km(ROUTE_M[1])} = {km(DEST_M)} = {DEST_M} m',
                      chk=lambda: sum(ROUTE_M[:ROUTE_ST.index(OURS[3])])),
              go='exit', after='출발 장치에 초록 불이 들어왔어요!', guide='손잡이를 끼우고, 출발 안내판과 노선도로 거리를 계산해요.'),
        ]),
    ],
    flow=['clock', 'depart', 'kiosk', 'cleanb', 'lostbox', 'bench', 'bscrap', 'wheels', 'ldraw', 'kh1+kh2', 'gate',
          'passb', 'train', 'crewbox', 'switch', 'kdoor', 'route', 'panel', 'exit'],
)
