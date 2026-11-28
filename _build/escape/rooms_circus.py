"""수학 방탈출 · 서커스 탈출 (추천 4학년 · 각도·분수의 덧셈과 뺄셈·꺾은선그래프·수의 규칙·곱셈구구·나눗셈·들이·방향) — 형식은 rooms.py 머리말"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(각도·관객 수·생선 수·물의 양은 모두 이야기 속 값)
CANNON, SAFE = 55, 80                                    # 대포 각도 55°, 안전하게 쏘는 각도 80°
FLAGS, STARS = 8, 3                                      # 깃발 8개, 깃발마다 별 3개
DEN = 7
BUCKETS = [('빨강', 2, '+', 3), ('파랑', 6, '−', 2), ('노랑', 1, '+', 5), ('초록', 5, '−', 2)]   # 물통 계산식(분모 7, L)
def bval(a, op, b): return Fraction(a + b if op == '+' else a - b, DEN)
BUCKET_ORDER = [c for _, c in sorted(((bval(a, op, b), c) for c, a, op, b in BUCKETS), reverse=True)]
BUCK_P = dict(items=[{'c': c, 'a': a, 'op': op, 'b': b, 'd': DEN} for c, a, op, b in BUCKETS])
BMAP = dict(n=4, m=5, start=[4, 3], path='UULLLUL', block=[[3, 2], [2, 2], [0, 2]], sl='자전거', gl='커튼')
DAYS = ['월', '화', '수', '목', '금']
AUD = [300, 350, 450, 400, 600]                          # 요일별 관객 수(꺾은선그래프)
JUMP = max(b - a for a, b in zip(AUD, AUD[1:]))          # 가장 많이 늘어난 수 200
CHART_P = dict(labels=DAYS, vals=AUD, max=700, step=50, lab=100, title='이번 주 관객 수', unit='명')
CYCLE = ['○', '△', '△', '□', '□', '□']                   # 거울 전구 규칙(6개씩 되풀이)
BULBS = [CYCLE[i % 6] for i in range(12)]                # 거울에 보이는 전구 12개
ASK = [23, 24, 25]
FISH = [2, 5, 11, 23]                                    # 물개 먹이: 앞의 수 × 2 + 1
FISH_NEXT = FISH[-1] * 2 + 1                             # 5일째 47마리
FISHLOG = ['물개 먹이 기록'] + [f'{i + 1}일: 생선 {n}마리' for i, n in enumerate(FISH)] + [f'{len(FISH) + 1}일: ?']
CAP_L, NOW_ML = 10, 4500                                 # 코끼리 물통 10 L, 지금 4 L 500 mL

ROOM = dict(
    id='circus', title='서커스 탈출', ico='🎪', acc='#C8402F',
    rec='추천 4학년 · 각도·분수의 덧셈과 뺄셈·꺾은선그래프·수의 규칙·곱셈구구·나눗셈·들이·방향',
    intro='서커스 공연이 끝난 뒤 무대 뒤를 구경하다 천막 안에 갇혔어요! 큰 천막 무대·분장실·동물 마차를 지나며 단서를 모아 뒷문으로 빠져나가요.',
    story=['서커스 공연이 끝나고, 단장님이 무대 뒤를 구경해도 된다고 하셨어요.',
           '그런데 휘이잉 바람에 천막 문이 쾅 닫히더니 자물쇠가 철컥 걸렸어요.',
           '단서를 모아 동물 마차까지 가서, 뒷문을 열고 빠져나가요!'],
    outro='물통이 가득 차자 코끼리가 물을 마시며 비켜섰고, 뒷문이 활짝 열렸어요! 단장님이 박수를 치며 맞아 주셨어요. 서커스를 탈출했어요!',
    items={'torch': dict(nm='손전등', k='torch', c='#F2C230', de='어두운 곳을 밝힐 수 있어요'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#C8402F', de='빨간 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#C8402F', de='빨간 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.'),
           'key': dict(nm='동물 마차 열쇠', k='key', c='#C8402F', de='빨간 열쇠예요. 열쇠 고리에 \'동물 마차\'라고 적혀 있어요'),
           'gear': dict(nm='펌프 톱니바퀴', k='gear', c='#8A929C', de='물 펌프에서 빠진 톱니바퀴 같아요')},
    combine=[dict(a='kh1', b='kh2', make='key', msg='손잡이와 몸통을 딸깍 끼웠더니 **동물 마차 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='큰 천막 무대', bg=dict(wall='#F6E1D8', floor='#B5654A', deco='stripe'), objs=[
            O('flags', '깃발 줄', 'crFlags', 100, 10, 800, 100, dict(n=FLAGS, s=STARS), keep=True,
              look='천막 꼭대기에 세모 깃발이 줄지어 걸려 있어요. 깃발마다 하얀 별이 있어요.', lookFig=F('crFlags', 520, 190, n=FLAGS, s=STARS),
              guide='깃발 줄에 깃발과 별이 몇 개인지 세어 보세요.'),
            O('cannon', '인간 대포', 'crCannon', 30, 130, 280, 240, dict(a=CANNON), keep=True,
              look='사람을 쏘아 올리는 인간 대포예요. 대포 뒤에 큰 **각도기**가 있어요. 파란 바닥선에서 대포까지의 각을 읽어 보세요.',
              lookFig=F('crCannon', 440, 340, a=CANNON), guide='인간 대포가 몇 도 기울어져 있는지 각도기로 읽어 보세요.'),
            O('cbox', '대포 옆 소품 상자', 'box', 40, 390, 160, 130, dict(c='노랑', lock=True, label='대포'),
              lock=Lk('num', str(SAFE - CANNON), f'상자 뚜껑의 쪽지: **인간 대포는 꼭 {SAFE}°로 쏘아야 안전해요. 지금 각도에서 몇 도를 더 올려야 할까요?** 숫자 두 개를 맞춰요.',
                      ['인간 대포를 크게 보세요. 파란 바닥선에서 대포까지의 각을 각도기 눈금으로 읽어요.',
                       '작은 눈금 한 칸은 5°예요. 대포는 50°와 60° 사이를 가리켜요.',
                       f'{SAFE}°에서 지금 각도를 빼요.'],
                      f'지금 {CANNON}° → {SAFE}° − {CANNON}° = {SAFE - CANNON}°', chk=lambda: SAFE - CANNON),
              after='상자가 열렸어요! 안에 **외바퀴 자전거 길** 그림이 있어요. 빨간 점이 자전거가 갈 길이에요.',
              afterFig=F('map', 300, 240, **BMAP), guide='인간 대포의 각도를 읽어 소품 상자를 열어 보세요.'),
            O('buckets', '광대 물통', 'crBuckets', 330, 140, 300, 170, BUCK_P, keep=True,
              look=f'광대가 물을 합치거나 덜어 낸 물통 네 개예요. 통마다 물의 양(L)을 구하는 식이 붙어 있어요.',
              lookFig=F('crBuckets', 420, 240, **BUCK_P),
              guide='광대 물통마다 붙은 분수 계산식을 살펴보세요.'),
            O('trunk', '소품 트렁크', 'crTrunk', 530, 370, 200, 160, dict(colors=['빨강', '노랑', '초록', '파랑']),
              lock=Lk('color', BUCKET_ORDER, '트렁크 쪽지: **광대 물통의 계산 값이 큰 것부터** 그 통의 색을 차례로 눌러요.',
                      ['광대 물통을 크게 보세요. 통마다 분모가 같은 분수의 덧셈이나 뺄셈이 있어요.',
                       '분모가 같으면 분자끼리 더하거나 빼요. 빨강은 2/7 + 3/7 = 5/7이에요.',
                       '네 통의 값을 모두 구한 뒤 분자가 큰 것부터 늘어놓아요.'],
                      '노랑 6/7 → 빨강 5/7 → 파랑 4/7 → 초록 3/7',
                      chk=lambda: [c for _, c in sorted(((bval(a, op, b), c) for c, a, op, b in BUCKETS), reverse=True)], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kh1'], after='트렁크가 열렸어요! 광대 모자 밑에 빨간 **열쇠 손잡이**가 있어요. 트렁크 안쪽에 **아주 작은 서랍**도 보여요.',
              guide='광대 물통의 분수를 계산해 소품 트렁크를 열어 보세요.'),
            O('tdraw', '트렁크 속 작은 서랍', 'drawer', 65, 100, 70, 40, dict(c='#8A929C', lock=True), in_='trunk',
              lock=Lk('num', str(FLAGS * STARS + CANNON), '트렁크 안 아주 작은 서랍이에요! 숫자 두 개 자물쇠예요. 북에 붙은 쪽지에 적힌 대로 계산해요.',
                      ['큰 북을 크게 보면 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.',
                       f'깃발은 {FLAGS}개, 깃발마다 별이 {STARS}개예요. 곱셈구구로 별을 모두 세어요.',
                       '대포 각도는 소품 상자를 열 때 읽은 각이에요. 별의 수에 더해요.'],
                      f'별 {FLAGS} × {STARS} = {FLAGS * STARS}개, {FLAGS * STARS} + {CANNON} = {FLAGS * STARS + CANNON}',
                      chk=lambda: FLAGS * STARS + CANNON),
              give=['torch'], after='작은 서랍 안에 **손전등**이 들어 있어요.', guide='트렁크를 연 뒤 트렁크 안쪽의 작은 서랍을 눌러 보세요.'),
            O('drum', '큰 북', 'crDrum', 330, 370, 170, 160,
              look='공연 때 둥둥 치는 커다란 북이에요. 잠긴 곳은 없어요.', guide='큰 북을 크게 보면 무언가 붙어 있을지도 몰라요.'),
            O('dscrap', '북에 붙은 쪽지', 'scrap', 60, 92, 50, 34, dict(t='?'), in_='drum', keep=True,
              look='북 옆에 아주 작은 쪽지가 붙어 있어요! "트렁크 속 작은 서랍 = **깃발 줄의 별을 모두 센 수 + 인간 대포의 지금 각도**"',
              guide='큰 북을 크게 보고 북 옆의 작은 쪽지를 찾아보세요.'),
            O('bike', '외바퀴 자전거', 'crBike', 660, 130, 130, 220,
              lock=Lk('dir', segs(BMAP['path']), '자전거 손잡이의 화살표 단추예요. 소품 상자에서 찾은 **외바퀴 자전거 길**을 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩에서 외바퀴 자전거 길 그림을 열어 보세요. \'자전거\'에서 출발해 빨간 점을 따라가요.',
                       '처음에는 위로 가요. 그다음은 어느 쪽으로 꺾이나요?'],
                      '위로 2칸 → 왼쪽 3칸 → 위로 1칸 → 왼쪽 1칸이니 ↑ ← ↑ ←', chk=lambda: segs('UULLLUL')),
              after='외바퀴 자전거가 무대를 한 바퀴 돌아 커튼 줄을 당겼어요! 무대 뒤 **분장실 커튼**이 열렸어요.',
              guide='자전거 길 그림대로 외바퀴 자전거의 화살표를 눌러 보세요.'),
            O('curtain', '분장실 커튼', 'door', 820, 140, 150, 240, dict(c='빨강', sign='분장실'), req=['bike'], go='b',
              look='외바퀴 자전거가 열어 준 커튼이에요.', after='커튼 너머로 분장실이 보여요.', guide='새로 열린 커튼으로 분장실에 가 보세요.'),
        ]),
        dict(id='b', nm='분장실', bg=dict(wall='#F7E3EC', floor='#A98C7A', deco='tile'), objs=[
            O('chart', '관객 수 그래프', 'crChart', 30, 30, 340, 230, CHART_P, keep=True,
              look='이번 주 요일마다 온 관객 수를 나타낸 꺾은선그래프예요. 세로 눈금 한 칸이 몇 명인지 먼저 살펴보세요.',
              lookFig=F('crChart', 420, 300, **CHART_P), guide='꺾은선그래프에서 요일마다 관객 수가 어떻게 바뀌었는지 보세요.'),
            O('mirror', '분장 거울', 'crMirror', 400, 30, 280, 200, dict(pat=BULBS), keep=True,
              look='거울 위에 모양 전구가 규칙대로 달려 있어요. 전구 밑에 번호가 있어요. 13번부터는 전구가 빠져 있어요.',
              lookFig=F('crMirror', 440, 260, pat=BULBS), guide='분장 거울 전구의 모양 규칙을 수첩에 남겨 두세요.'),
            O('makeup', '분장 상자', 'crMakeup', 60, 320, 220, 170,
              lock=Lk('num', str(JUMP), '분장 상자 쪽지: **관객 수가 전날보다 가장 많이 늘어난 날, 몇 명이 늘었을까요?** 숫자 세 개를 맞춰요.',
                      ['관객 수 그래프를 크게 보세요. 세로 눈금 한 칸은 50명이에요.',
                       '선이 오른쪽 위로 가장 가파르게 올라간 곳을 찾아요.',
                       '그날의 관객 수에서 전날의 관객 수를 빼요.'],
                      f'목 {AUD[3]}명 → 금 {AUD[4]}명: {AUD[4]} − {AUD[3]} = {JUMP}명', chk=lambda: max(b - a for a, b in zip(AUD, AUD[1:]))),
              give=['kh2'], after='분장 상자 서랍이 열렸어요! 화장 붓 사이에 빨간 **열쇠 몸통**이 있어요. 손잡이는 없어요.',
              guide='꺾은선그래프에서 가장 많이 늘어난 날을 찾아 분장 상자를 열어 보세요.'),
            O('wardrobe', '의상 옷장', 'crWardrobe', 420, 270, 190, 260,
              need='torch', needMsg='옷장 안이 너무 깜깜해서 모양 단추가 보이지 않아요.', useMsg='손전등으로 비추니 옷장 안쪽에 모양 단추가 보여요!',
              lock=Lk('shape', [CYCLE[(n - 1) % 6] for n in ASK], f'옷장 단추 위 쪽지: **거울 전구를 규칙대로 계속 달면, {ASK[0]}번·{ASK[1]}번·{ASK[2]}번 전구는 무슨 모양일까요?** 차례로 눌러요.',
                      ['분장 거울을 크게 보세요. 전구 모양이 몇 개씩 되풀이되나요?',
                       '○ △ △ □ □ □ 여섯 개가 되풀이돼요. 6번, 12번, 18번 전구는 모두 □예요.',
                       f'{ASK[0]} ÷ 6의 나머지를 구하면 한 묶음에서 몇 번째 모양인지 알 수 있어요.'],
                      f'{ASK[0]} ÷ 6 = 3 … 5 → 다섯째 □, {ASK[1]}번은 여섯째 □, {ASK[2]}번은 새 묶음 첫째 ○',
                      chk=lambda: [CYCLE[(n - 1) % 6] for n in ASK], opts=['○', '△', '□', '☆']),
              give=['gear'], after='옷장이 열렸어요! 반짝이 의상 아래에서 **펌프 톱니바퀴**가 나왔어요.',
              guide='손전등으로 옷장을 비추고, 거울 전구의 규칙으로 모양 단추를 눌러 보세요.'),
            O('wdoor', '동물 마차 가는 문', 'door', 800, 160, 150, 230, dict(c='갈색', sign='동물 마차'),
              need='key', needMsg='동물 마차로 가는 문이 잠겨 있어요. 빨간 열쇠 구멍이 보여요.', useMsg='동물 마차 열쇠로 문을 열었어요!',
              go='c', after='문 너머로 동물 마차가 보여요. 코끼리와 물개가 있어요.', guide='열쇠 손잡이와 몸통을 합쳐 동물 마차 가는 문을 열어 보세요.'),
        ]),
        dict(id='c', nm='동물 마차', bg=dict(wall='#E9D2AE', floor='#C9A86A', deco='brick'), objs=[
            O('fishlog', '물개 먹이 기록', 'poster', 30, 30, 300, 210, dict(lines=FISHLOG, fs=18, c='#FFFDF4'), keep=True,
              look='사육사가 물개에게 준 생선 수를 날마다 적어 둔 기록이에요. 수가 규칙대로 늘어나요.',
              lookFig=F('poster', 360, 260, lines=FISHLOG, fs=21, c='#FFFDF4'), guide='물개 먹이 기록에서 수가 늘어나는 규칙을 찾아보세요.'),
            O('tank', '코끼리 물통', 'crTank', 360, 30, 180, 330, dict(cap=CAP_L, v=NOW_ML, tick=500), keep=True,
              look=f'들이가 **{CAP_L} L**인 코끼리 물통이에요. 옆 눈금을 보고 지금 물이 얼마나 들어 있는지 읽어 보세요. 작은 눈금 한 칸은 500 mL예요.',
              lookFig=F('crTank', 220, 380, cap=CAP_L, v=NOW_ML, tick=500), guide='코끼리 물통에 물이 얼마나 들어 있는지 눈금을 읽어 보세요.'),
            O('feedbox', '물개 먹이 상자', 'box', 40, 370, 200, 150, dict(c='파랑', lock=True, label='먹이'),
              lock=Lk('num', str(FISH_NEXT), f'먹이 상자 쪽지: **먹이 기록의 규칙대로라면 {len(FISH) + 1}일째에는 생선을 몇 마리 줄까요?** 숫자 두 개를 맞춰요.',
                      ['물개 먹이 기록을 크게 보세요. 2, 5, 11, 23 …',
                       '앞의 수를 두 배 한 뒤 무엇을 하면 뒤의 수가 되는지 살펴보세요. 2 × 2 = 4, 4에서 5가 되려면?',
                       '23에도 같은 규칙을 써요.'],
                      f'앞의 수 × 2 + 1 → {FISH[-1]} × 2 + 1 = {FISH_NEXT}마리', chk=lambda: FISH[-1] * 2 + 1),
              after='물개에게 생선을 주었더니 물개가 신나서 박수를 치며 비켜섰어요. 물개 뒤에 숨어 있던 **마차 뒷문**이 보여요!',
              guide='물개 먹이 기록의 규칙을 찾아 먹이 상자를 열어 보세요.'),
            O('seal', '물개', 'crSeal', 270, 390, 190, 150,
              look='공을 코에 올린 물개가 배가 고픈지 끙끙거려요. 물개 뒤에 무언가 숨어 있는 것 같아요.', guide='물개는 먹이를 기다려요. 먹이 상자를 열어 보세요.'),
            O('exit', '마차 뒷문', 'crGate', 650, 150, 320, 300, req=['feedbox'],
              need='gear', needMsg='뒷문 앞을 코끼리가 막고 있어요. 문 옆 물 펌프에 톱니바퀴 하나가 빠져 있어요.', useMsg='톱니바퀴를 끼웠더니 펌프가 움직여요! 몇 mL를 넣을지 숫자판을 맞춰요.',
              lock=Lk('num', str(CAP_L * 1000 - NOW_ML), '펌프 숫자판: **코끼리 물통을 가득 채우려면 물을 몇 mL 더 넣어야 할까요?** 물통이 가득 차면 코끼리가 물을 마시러 비켜 줘요. 숫자 네 개를 맞춰요.',
                      ['코끼리 물통을 크게 보세요. 들이와 지금 들어 있는 물의 양을 읽어요.',
                       f'지금 물은 4 L와 5 L 사이, 작은 눈금 한 칸(500 mL)만큼 올라가 있어요.',
                       '1 L = 1000 mL예요. 들이에서 지금 물의 양을 빼서 mL로 나타내요.'],
                      f'{CAP_L} L − {NOW_ML // 1000} L {NOW_ML % 1000} mL = {(CAP_L * 1000 - NOW_ML) // 1000} L {(CAP_L * 1000 - NOW_ML) % 1000} mL = {CAP_L * 1000 - NOW_ML} mL',
                      chk=lambda: CAP_L * 1000 - NOW_ML),
              go='exit', after='콸콸 물이 차오르자 코끼리가 물을 마시러 비켜섰어요. 뒷문이 열렸어요!', guide='톱니바퀴를 펌프에 끼우고, 물통 눈금으로 더 넣을 물의 양을 계산해요.'),
        ]),
    ],
    flow=['flags', 'cannon', 'cbox', 'buckets', 'trunk', 'drum', 'dscrap', 'tdraw', 'bike', 'curtain',
          'chart', 'makeup', 'kh1+kh2', 'mirror', 'wardrobe', 'wdoor', 'fishlog', 'tank', 'feedbox', 'exit'],
)
