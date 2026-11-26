"""수학의 성 탈출 (5~6학년 · 도전, 6학년: 백분율·분수와 소수의 나눗셈·비례식·비례배분·직육면체의 겉넓이와 부피·원주와 원의 넓이·미로)"""
from fractions import Fraction
from rooms import O, Lk, F, segs

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
KNIGHT = [('빨강', 25, 18), ('파랑', 20, 15), ('초록', 40, 26), ('노랑', 50, 41)]   # (기사단, 경기 수, 이긴 경기 수)
RECORD = ['기사단 경기 기록'] + [f'{c}: {n}경기 중 {w}승' for c, n, w in KNIGHT]
def rank(): return [c for c, n, w in sorted(KNIGHT, key=lambda t: -Fraction(t[2], t[1]))]
BOX = (12, 8, 5)                                                    # 보물 상자 가로·세로·높이(cm)
PLAN = ['보물 상자 설계도', '(직육면체)', f'가로 {BOX[0]} cm · 세로 {BOX[1]} cm', f'높이 {BOX[2]} cm']
SC_GEM, SC_BALL = 2, 3                                              # 천칭: 보석 2개 = 금구슬 3개
SCALE = dict(left=[{'k': 'gem', 'c': '빨강', 'n': SC_GEM}], right=[{'k': 'ball', 'c': '노랑', 'n': SC_BALL}])
GEMS, SPLIT = 32, (5, 7)                                            # 보석 32개만큼의 금구슬을 형 : 동생 = 5 : 7
MAP = dict(n=5, m=6, start=[0, 4], path='UURRDRRUUUR', show=False, sl='입구', gl='계단',
           block=[[0, 1], [1, 1], [3, 1], [1, 3], [2, 4], [3, 4], [4, 4], [3, 2], [3, 0], [5, 1], [5, 2]])
DIVS = [('①', '3/4 ÷ 2/5', Fraction(3, 4) / Fraction(2, 5)), ('②', '1.8 ÷ 2.4', Fraction('1.8') / Fraction('2.4')),
        ('③', '2/3 ÷ 4/6', Fraction(2, 3) / Fraction(4, 6)), ('④', '4.2 ÷ 0.6', Fraction('4.2') / Fraction('0.6')),
        ('⑤', '5/8 ÷ 5/6', Fraction(5, 8) / Fraction(5, 6))]
GLASS = ['창문에 쓰인 식'] + [f'{a} {s}' for a, s, _ in DIVS]
def mark(v): return '☆' if v > 1 else '□' if v == 1 else '○'
ROUND = '188.4'                                                     # 탑 시계판의 원주(cm), 원주율 3.14

def only_path():
    """막힌 칸을 피해 입구에서 계단까지 가는 길이 하나뿐인지 확인하고 그 길을 돌려줌"""
    B = {tuple(b) for b in MAP['block']}; D = {'U': (0, -1), 'D': (0, 1), 'L': (-1, 0), 'R': (1, 0)}
    x, y = MAP['start']
    for ch in MAP['path']: x, y = x + D[ch][0], y + D[ch][1]
    goal, out = (x, y), []
    def go(c, seen, p):
        if c == goal: out.append(p); return
        for d, (dx, dy) in D.items():
            q = (c[0] + dx, c[1] + dy)
            if 0 <= q[0] < MAP['m'] and 0 <= q[1] < MAP['n'] and q not in B and q not in seen: go(q, seen | {q}, p + d)
    go(tuple(MAP['start']), {tuple(MAP['start'])}, '')
    assert len(out) == 1, out
    return out[0]

ROOM = dict(
    id='castle', title='수학의 성 탈출', ico='🗼', acc='#5B4FB0', rec='추천 5~6학년 · 도전 · 백분율·분수와 소수의 나눗셈·비례배분·겉넓이·부피·원의 넓이·미로',
    intro='오래된 수학의 성을 견학하다가 쿵! 성문이 닫혀 버렸어요. 성주가 남긴 수수께끼를 따라 대연회장·보물 창고·탑 꼭대기를 오가며 **성문 열쇠**를 찾아요.',
    outro='성문이 끼이익 열리고 시원한 바람이 불어와요! 탑 꼭대기 시계가 댕댕 울리며 축하해 줘요. 수학의 성을 탈출했어요!',
    items={'key': dict(nm='창고 열쇠', k='key', c='#8A929C', de='은빛 열쇠예요'),
           'torch': dict(nm='손전등', k='torch', c='#F2C230', de='어두운 곳을 밝혀요'),
           'gear': dict(nm='금 톱니바퀴', k='gear', c='#C9A24B', de='시계 같은 기계에서 빠진 부품 같아요'),
           'gem': dict(nm='별 보석', k='gem', c='#6CC3EA', de='별처럼 반짝이는 보석이에요'),
           'keyb': dict(nm='성문 열쇠', k='key', c='#C8402F', de='크고 무거운 빨간 열쇠예요')},
    scenes=[
        dict(id='a', nm='대연회장', bg=dict(wall='#EDE3D1', floor='#8E7558', deco='brick'), objs=[
            O('record', '기사단 기록판', 'board', 30, 30, 330, 200, dict(lines=RECORD), keep=True,
              look='기사단 네 곳의 경기 기록이에요. 경기 수가 서로 달라서 이긴 횟수만으로는 누가 더 잘했는지 알 수 없어요.', lookFig=F('board', 340, 210, lines=RECORD),
              guide='기사단 기록판을 수첩에 남겨 두세요.'),
            O('panel', '깃발 단추판', 'panel', 390, 40, 180, 140, dict(colors=['빨강', '노랑', '초록', '파랑'], label='승률 순서', done='깃발 펄럭!'),
              lock=Lk('color', rank(), '깃발 단추판: **승률(이긴 경기 수 ÷ 전체 경기 수)이 높은 기사단부터** 그 색 단추를 차례로 눌러요.',
                      ['승률을 백분율로 바꿔 비교해요. 이긴 경기 수 ÷ 경기 수 × 100', '빨강 18/25 = 72%, 파랑 15/20 = 75%', '초록 26/40 = 65%, 노랑 41/50 = 82%'],
                      '노랑 82% > 파랑 75% > 빨강 72% > 초록 65%', chk=rank),
              give=['key'], after='단추를 차례로 누르자 천장의 깃발이 펄럭이며 단추판 아래에서 **창고 열쇠**가 떨어졌어요.',
              guide='기사단마다 승률을 백분율로 구해 높은 차례대로 눌러요.'),
            O('store', '보물 창고 문', 'door', 610, 170, 120, 210, dict(c='갈색', sign='보물 창고'),
              need='key', needMsg='보물 창고 문이 잠겨 있어요. 은빛 **열쇠 구멍**이 보여요.', useMsg='창고 열쇠가 딱 맞아요. 철컥!',
              go='b', after='문 너머에 보물 창고가 보여요.', guide='창고 열쇠로 보물 창고 문을 열어 보세요.'),
            O('exit', '성문', 'door', 790, 130, 180, 250, dict(c='#6B4A2E', sign='성문'),
              need='keyb', needMsg='굳게 닫힌 성문이에요. 커다란 **빨간 열쇠 구멍**과 숫자판이 있어요.', useMsg='성문 열쇠를 꽂아 돌렸어요. 이제 숫자판만 남았어요!',
              lock=Lk('num', str(BOX[0] * BOX[1] * BOX[2] * KNIGHT[1][2] // KNIGHT[1][1]),
                      '성문 숫자판: 비밀번호 = 보물 상자의 **부피**(cm³)에 깃발 단추판에서 **두 번째로 누른 기사단의 승률**을 곱한 수',
                      ['보물 상자 설계도: 가로 12 cm, 세로 8 cm, 높이 5 cm. 부피 = 가로 × 세로 × 높이', '부피는 480 cm³. 두 번째로 승률이 높은 기사단은 파랑(75%)이었어요.', '480 × 75% = 480 × 3/4'],
                      '부피 12 × 8 × 5 = 480 (cm³), 두 번째 기사단 파랑 15/20 = 75%, 480 × 0.75 = 360',
                      chk=lambda: Fraction(BOX[0] * BOX[1] * BOX[2]) * Fraction(*next((w, n) for c, n, w in KNIGHT if c == rank()[1]))),
              go='exit', after='성문이 열렸어요!', guide='탑에서 찾은 성문 열쇠를 쓰고, 상자의 부피와 기사단 승률로 비밀번호를 계산해요.'),
            O('rug', '둥근 양탄자', 'rug', 120, 420, 380, 110, dict(c='#8C2F39'),
              look='폭신한 둥근 양탄자예요. 들춰 봐도 아무것도 없어요. 연회 때 춤추던 자리래요.',
              guide='둥근 양탄자는 구경만 해도 돼요.'),
        ]),
        dict(id='b', nm='보물 창고', bg=dict(wall='#E4D8C4', floor='#7E6A52', deco='stripe'), objs=[
            O('plan', '상자 설계도', 'poster', 30, 30, 260, 180, dict(lines=PLAN, fs=21), keep=True,
              look='벽에 보물 상자 설계도가 붙어 있어요.', lookFig=F('poster', 320, 200, lines=PLAN, fs=25),
              guide='상자 설계도를 수첩에 남겨 두세요.'),
            O('box', '직육면체 보물 상자', 'box', 40, 390, 200, 140, dict(c='#C9A24B', lock=True, label='겉넓이?'),
              lock=Lk('num', str(2 * (BOX[0] * BOX[1] + BOX[0] * BOX[2] + BOX[1] * BOX[2])), '상자 뚜껑: 비밀번호 = 이 상자의 **겉넓이**(cm²). 설계도를 보세요.',
                      ['직육면체는 서로 마주 보는 면이 같아요. 서로 다른 세 면의 넓이를 구해요.', '12 × 8 = 96, 12 × 5 = 60, 8 × 5 = 40', '(96 + 60 + 40) × 2'],
                      '(12 × 8 + 12 × 5 + 8 × 5) × 2 = 196 × 2 = 392 (cm²)',
                      chk=lambda: sum(a * b for a, b in [(BOX[0], BOX[1]), (BOX[0], BOX[2]), (BOX[1], BOX[2])]) * 2),
              give=['torch'], after='상자 안에 **손전등**과 낡은 지도가 있어요. "탑 계단은 미로처럼 막힌 곳이 많다. 지도를 보고 길을 찾아라."',
              afterFig=F('map', 360, 300, **MAP), guide='설계도로 보물 상자의 겉넓이를 구해 열어 보세요.'),
            O('scale', '천칭', 'scale', 290, 390, 300, 130, SCALE, keep=True,
              look='천칭이 수평을 이루고 있어요. **보석 2개**와 **금구슬 3개**의 무게가 같아요.', lookFig=F('scale', 300, 130, **SCALE),
              guide='천칭을 살펴보고 수첩에 남겨 두세요.'),
            O('chest', '금구슬 궤짝', 'chest', 630, 380, 180, 140, dict(c='#8E4A2A'),
              lock=Lk('num', str(GEMS * SC_BALL // SC_GEM * SPLIT[1] // sum(SPLIT)),
                      f'궤짝 쪽지: "보석 **{GEMS}개**와 무게가 같은 금구슬을 형과 동생이 **{SPLIT[0]} : {SPLIT[1]}**로 나누어 가졌다." 비밀번호 = **동생**이 가진 금구슬 수',
                      ['천칭에서 보석 2개 = 금구슬 3개예요. 비례식 2 : 3 = 32 : □를 세워요.', '□ = 32 × 3 ÷ 2 = 48. 이제 48을 5 : 7로 **비례배분**해요.', '동생 몫 = 48 × 7/(5 + 7) = 48 × 7/12'],
                      '2 : 3 = 32 : 48 → 금구슬 48개, 동생 48 × 7/12 = 28(개)',
                      chk=lambda: Fraction(GEMS * SC_BALL, SC_GEM) * Fraction(SPLIT[1], sum(SPLIT))),
              give=['gear'], after='궤짝을 열자 금구슬 사이에서 **금 톱니바퀴**가 반짝여요.',
              guide='천칭의 비로 비례식을 세우고, 비례배분으로 궤짝을 열어요.'),
            O('tower', '탑 계단 문', 'door', 840, 150, 130, 230, dict(c='회색', sign='탑 계단'),
              need='torch', needMsg='문 안쪽 계단이 너무 캄캄해서 한 걸음도 갈 수 없어요.', useMsg='손전등을 켰어요. 계단 앞에 방향 단추판이 보여요.',
              lock=Lk('dir', segs(only_path()), '방향 단추판: **낡은 지도**의 미로에서 회색 칸을 피해 입구부터 계단까지 가는 길을 찾아, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요.',
                      ['수첩의 낡은 지도를 열어 보세요. 입구는 왼쪽 아래, 계단은 오른쪽 위예요.', '막다른 길이 세 군데 있어요. 위로 2칸 간 뒤 오른쪽으로 가요.', '↑ → ↓ → ↑ →'],
                      '위로 2칸 → 오른쪽 2칸 → 아래로 1칸 → 오른쪽 2칸 → 위로 3칸 → 오른쪽 1칸: ↑ → ↓ → ↑ →',
                      chk=lambda: segs(only_path())),
              go='c', after='미로 같은 계단을 올라 탑 꼭대기에 닿았어요.', guide='손전등을 켜고 낡은 지도의 미로 길을 방향으로 알려 주세요.'),
        ]),
        dict(id='c', nm='탑 꼭대기', bg=dict(wall='#2F3A5F', floor='#4A4A68', deco='stars'), objs=[
            O('window', '김 서린 창문', 'window', 60, 40, 240, 200, dict(night=True), keep=True,
              look='김 서린 창문 유리에 누군가 손가락으로 나눗셈 다섯 개를 써 놓았어요.', lookFig=F('board', 320, 230, lines=GLASS),
              guide='창문 유리에 쓰인 식을 수첩에 남겨 두세요.'),
            O('clock', '멈춘 탑 시계', 'clock', 380, 40, 190, 190, dict(h=11, m=50),
              need='gear', needMsg='커다란 탑 시계가 11시 50분에 멈춰 있어요. 뒤쪽에 **톱니바퀴 하나**가 빠진 자리가 있어요.', useMsg='금 톱니바퀴를 끼우자 시계가 째깍째깍 움직여요!',
              after=f'시계가 다시 움직이자 아래 벽이 열리며 **성주의 금고**가 나타났어요! 시계 테두리에 글: "나의 둘레(원주)는 **{ROUND} cm**. 원주율은 3.14."',
              guide='금 톱니바퀴를 탑 시계에 끼워 보세요.'),
            O('starbox', '별 상자', 'cabinet', 660, 60, 170, 230, dict(label='별 상자', c='#5B4FB0'),
              lock=Lk('shape', [mark(v) for _, _, v in DIVS], '별 상자 뚜껑: 창문의 나눗셈을 ①부터 차례로 계산해요. 몫이 **1보다 크면 ☆**, **1이면 □**, **1보다 작으면 ○** 를 눌러요.',
                      ['분수의 나눗셈은 나누는 분수의 분모와 분자를 바꾸어 곱해요. 3/4 ÷ 2/5 = 3/4 × 5/2', '소수의 나눗셈은 두 수에 똑같이 10을 곱해도 몫이 같아요. 1.8 ÷ 2.4 = 18 ÷ 24', '① 15/8 ② 0.75 ③ 1 ④ 7 ⑤ 3/4'],
                      '① 15/8 > 1 ☆, ② 0.75 < 1 ○, ③ 1 □, ④ 7 > 1 ☆, ⑤ 3/4 < 1 ○',
                      chk=lambda: [mark(v) for _, _, v in DIVS]),
              give=['gem'], after='상자 안 벨벳 위에 **별 보석**이 반짝여요.',
              guide='창문의 나눗셈을 계산해 몫의 크기에 맞는 모양을 눌러요.'),
            O('safe', '성주의 금고', 'safe', 420, 370, 160, 150, req=['clock'],
              need='gem', needMsg='금고 문 가운데 **별 모양 홈**과 숫자판이 있어요.', useMsg='별 보석을 끼우자 숫자판에 불이 들어왔어요.',
              lock=Lk('num', str(int(Fraction(ROUND) / Fraction('3.14') / 2) ** 2 * 314 // 100),
                      '금고 숫자판: 비밀번호 = **탑 시계판의 넓이**(cm²). 시계 테두리 글을 떠올려요. (원주율 3.14)',
                      ['원주 = 지름 × 원주율이에요. 지름 = 188.4 ÷ 3.14', '지름 60 cm, 반지름 30 cm', '원의 넓이 = 반지름 × 반지름 × 원주율 = 30 × 30 × 3.14'],
                      '지름 188.4 ÷ 3.14 = 60 (cm), 반지름 30 cm, 넓이 30 × 30 × 3.14 = 2826 (cm²)',
                      chk=lambda: (Fraction(ROUND) / Fraction('3.14') / 2) ** 2 * Fraction('3.14')),
              give=['keyb'], after='금고 안에 크고 무거운 **성문 열쇠**가 있어요! 이제 대연회장의 성문으로 돌아가요.',
              guide='별 보석을 금고에 끼우고, 시계판의 원주로 넓이를 구해요.'),
        ]),
    ],
    flow=['record', 'panel', 'store', 'plan', 'box', 'scale', 'chest', 'tower', 'window', 'starbox', 'clock', 'safe', 'exit'],
)
