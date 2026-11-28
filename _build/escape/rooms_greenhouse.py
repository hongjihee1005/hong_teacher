"""수학 방탈출 · 식물원 온실 탈출 (추천 5학년 · 수의 범위·평균·막대그래프·규칙과 대응·돌리기·직육면체 전개도와 모서리·올림·최소공배수) — 형식은 rooms.py 머리말"""
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
def lcm(a, b): return a * b // gcd(a, b)

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
TEMP = 28                                                          # 온실 온도계
# 화분(받침대 왼쪽부터): 색, 아래 끝(수, 이상/초과), 위 끝(수, 이하/미만) — 이야기 속 값
POTS = [('노랑', 26, '초과', 30, '이하'), ('파랑', 24, '초과', 28, '미만'), ('보라', 25, '이상', 28, '이하'),
        ('빨강', 20, '이상', 25, '미만'), ('초록', 28, '이상', 32, '이하'), ('주황', 28, '초과', 33, '이하')]
def fits(t, a, ak, b, bk):
    lo = t >= a if ak == '이상' else t > a
    hi = t <= b if bk == '이하' else t < b
    return lo and hi
POTP = [{'c': c, 'a': f'{a} {ak}', 'b': f'{b} {bk}'} for c, a, ak, b, bk in POTS]
WATER = [('월', 14), ('화', 18), ('수', 12), ('목', 20), ('금', 16)]  # 하루 물 사용량(L)
AVG = sum(v for _, v in WATER) // len(WATER)                         # 16
GAP = max(v for _, v in WATER) - min(v for _, v in WATER)            # 8
CHART = dict(data=WATER, max=20, step=2, lab=4, title='온실 물 사용량', unit='L')

BEDS = [1, 2, 3]                                                   # 그림 속 화단 수 → 울타리 막대 4, 7, 10개
def sticks(n): return 3 * n + 1                                    # 위·아래 n개씩 + 세로 n+1개
BED_Q = 40
FIRST, TURNS = '↑', [90, 180, 270, 90]
def vine():
    d = ['↑', '→', '↓', '←'];  i = d.index(FIRST); out = [FIRST]
    for a in TURNS: i = (i + a // 90) % 4; out.append(d[i])
    return out
CAL = ['물 주기 달력', '고사리: 4일마다', '난초: 6일마다', '오늘은 둘 다 주었어요']
FERN, ORCH = 4, 6

NET = [[1, 0, '○'], [0, 1, '△'], [1, 1, '□'], [2, 1, '☆'], [3, 1, '◇'], [1, 2, '♡']]
ASK = ['○', '△', '□']
def opposite():
    """전개도를 굴려 접어 보기: 바닥에 닿는 면에 그 칸의 모양을 붙이고, 마주 보는 면 짝을 구함"""
    cells = {(x, y): s for x, y, s in NET}
    start = (NET[0][0], NET[0][1]); face = {}; seen = {start: dict(D=0, U=1, N=2, S=3, E=4, W=5)}; stack = [start]
    roll = {(1, 0): lambda o: dict(D=o['E'], E=o['U'], U=o['W'], W=o['D'], N=o['N'], S=o['S']),
            (-1, 0): lambda o: dict(D=o['W'], W=o['U'], U=o['E'], E=o['D'], N=o['N'], S=o['S']),
            (0, 1): lambda o: dict(D=o['S'], S=o['U'], U=o['N'], N=o['D'], E=o['E'], W=o['W']),
            (0, -1): lambda o: dict(D=o['N'], N=o['U'], U=o['S'], S=o['D'], E=o['E'], W=o['W'])}
    while stack:
        q = stack.pop(); face[seen[q]['D']] = cells[q]
        for (dx, dy), f in roll.items():
            nq = (q[0] + dx, q[1] + dy)
            if nq in cells and nq not in seen: seen[nq] = f(seen[q]); stack.append(nq)
    assert len(face) == 6
    opp = {}
    for a, b in ((0, 1), (2, 3), (4, 5)): opp[face[a]] = face[b]; opp[face[b]] = face[a]
    return opp
BOX_A, BOX_B, BOX_C = 12, 8, 5                                      # 씨앗 상자(cm)
EDGES = 4 * (BOX_A + BOX_B + BOX_C)                                 # 100
SEEDS, BAG = 237, 10                                                # 해바라기 씨 237개, 한 봉투에 10개
BAGS = -(-SEEDS // BAG)                                             # 올림 → 24
JAR = ['해바라기 씨 237개', '한 봉투에 10개씩', '나누어 담기']

ROOM = dict(
    id='greenhouse', title='식물원 온실 탈출', ico='🌱', acc='#2F8F4E',
    rec='추천 5학년 · 수의 범위·평균·막대그래프·규칙과 대응·돌리기·전개도·직육면체 모서리·올림·최소공배수',
    intro='식물원 밤 관찰 체험을 왔다가 온실 문이 잠겨 버렸어요! 열대 온실·선인장 방·씨앗 연구실을 살펴 단서를 모으고, 바깥 정원으로 나가는 **출구**를 열어요.',
    story=['밤에만 피는 꽃을 보러 식물원 온실에 들어왔어요. 따뜻하고 촉촉한 공기가 가득해요.',
           '그때 "습도 조절 중" 안내가 뜨더니, 스르륵 철컥! 온실 문이 모두 잠겨 버렸어요.',
           '온실지기 선생님이 남긴 단서를 따라 씨앗 연구실의 출구를 열어요!'],
    outro='출구가 열렸어요! 바깥 정원에서 밤에 피는 꽃이 하얗게 피어났어요. 식물원 온실을 무사히 탈출했어요!',
    items={'card': dict(nm='출입 카드', k='card', c='#2F8F4E', de='\'선인장 방\'이라고 적힌 출입 카드예요'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#2F8F4E', de='초록 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#2F8F4E', de='초록 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.'),
           'gkey': dict(nm='출구 열쇠', k='key', c='#2F8F4E', de='초록색 열쇠예요. 출구 자물쇠에 맞을까요?')},
    combine=[dict(a='kh1', b='kh2', make='gkey', msg='손잡이와 몸통을 딸깍 끼웠더니 **출구 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='열대 온실', bg=dict(wall='#DDF0DE', floor='#7C6A4E', deco='tile'), objs=[
            O('thermo', '온도계', 'ghThermo', 40, 40, 100, 260, dict(t=TEMP), keep=True,
              look=f'온실 벽의 온도계예요. 지금 온실 온도는 **{TEMP} °C**예요.', lookFig=F('ghThermo', 150, 360, t=TEMP),
              guide='온도계로 지금 온실 온도를 확인하세요.'),
            O('chart', '물 사용량 그래프', 'ghChart', 170, 40, 310, 230, CHART, keep=True,
              look='요일마다 온실에서 쓴 물의 양을 나타낸 막대그래프예요. 세로 눈금 한 칸은 2 L예요.', lookFig=F('ghChart', 420, 300, **CHART),
              guide='막대그래프에서 요일마다 쓴 물의 양을 읽어 보세요. 크게 보면 구석에 무언가 있어요.'),
            O('cscrap', '그래프 구석 쪽지', 'scrap', 258, 6, 48, 34, dict(t='?'), in_='chart', keep=True,
              look=f'그래프 구석에 아주 작은 쪽지가 붙어 있어요! "씨앗 상자 속 작은 서랍 = **씨앗 상자(직육면체)의 모든 모서리 길이의 합(cm)**"',
              guide='물 사용량 그래프를 크게 보고 오른쪽 위 구석의 작은 쪽지를 찾아보세요.'),
            O('pots', '화분 받침대', 'ghPots', 30, 310, 530, 220, dict(pots=POTP), keep=True,
              look='화분 여섯 개가 받침대에 놓여 있어요. 꼬리표마다 그 식물이 잘 자라는 온도(°C)가 적혀 있어요.', lookFig=F('ghPots', 540, 250, pots=POTP),
              guide='화분 꼬리표의 온도 범위를 읽어 보세요. 이상·이하·초과·미만을 잘 보세요.'),
            O('waterer', '자동 물 주기 장치', 'ghWater', 600, 50, 190, 300, dict(colors=['빨강', '주황', '노랑', '초록', '파랑', '보라']),
              lock=Lk('color', [c for c, a, ak, b, bk in POTS if fits(TEMP, a, ak, b, bk)], '장치의 안내: **지금 온실 온도가 꼬리표의 온도 범위에 들어가는 화분에만 물을 줘요. 그런 화분의 색을 받침대 왼쪽부터 차례로 눌러요.**',
                      ['온도계로 지금 온도를 보고, 화분 꼬리표를 하나씩 따져 보세요.', '\'이상\'과 \'이하\'는 그 수를 넣고, \'초과\'와 \'미만\'은 그 수를 넣지 않아요.', f'{TEMP}이 경계에 있는 꼬리표가 많아요. \'{TEMP} 미만\'과 \'{TEMP} 초과\'에는 {TEMP}이 들어가지 않아요.'],
                      f'{TEMP} °C가 들어가는 범위: 노랑(26 초과 30 이하) → 보라(25 이상 28 이하) → 초록(28 이상 32 이하). 파랑(28 미만)·주황(28 초과)·빨강은 아니에요.',
                      chk=lambda: [c for c, a, ak, b, bk in POTS if fits(TEMP, a, ak, b, bk)], opts=['빨강', '주황', '노랑', '초록', '파랑', '보라']),
              after='쏴아― 알맞은 화분에 물이 뿌려졌어요. 그러자 커다란 잎이 흔들리며 그 뒤에 숨어 있던 **공구함**이 보여요!',
              guide='온도계와 화분 꼬리표로 물을 줄 화분을 골라 보세요.'),
            O('toolbox', '공구함', 'box', 600, 395, 180, 130, dict(c='초록', lock=True, label='공구'), req=['waterer'],
              lock=Lk('num', f'{AVG}{GAP}', '공구함 숫자판 쪽지: **(하루 물 사용량의 평균) 뒤에 (가장 많이 쓴 날과 가장 적게 쓴 날의 차)를 이어 쓴 수** 숫자 세 개.',
                      ['물 사용량 그래프를 크게 보세요. 세로 눈금 한 칸이 2 L예요.', f'다섯 날의 물 사용량을 모두 더해 날 수 5로 나누면 평균이에요. 합은 {sum(v for _, v in WATER)} L예요.', '가장 긴 막대와 가장 짧은 막대의 차를 구해요.'],
                      f'평균 ({" + ".join(str(v) for _, v in WATER)}) ÷ 5 = {AVG}, 가장 많은 날 20 − 가장 적은 날 12 = {GAP} → {AVG}{GAP}',
                      chk=lambda: int(f'{sum(v for _, v in WATER) // len(WATER)}{max(v for _, v in WATER) - min(v for _, v in WATER)}')),
              give=['card'], after='공구함이 열렸어요! 모종삽 옆에 **출입 카드**가 있어요. 카드에 \'선인장 방\'이라고 적혀 있어요.',
              guide='물 사용량 그래프로 평균과 차를 구해 공구함을 열어 보세요.'),
            O('bdoor', '선인장 방 문', 'door', 840, 170, 130, 210, dict(c='초록', sign='선인장 방'),
              need='card', needMsg='문 옆에 카드를 대는 곳이 있어요.', useMsg='출입 카드를 댔더니 "삑!" 문이 열렸어요.',
              go='b', after='문 너머로 따뜻하고 건조한 선인장 방이 보여요.', guide='공구함에서 찾은 출입 카드를 선인장 방 문에 대 보세요.'),
        ]),
        dict(id='b', nm='선인장 방', bg=dict(wall='#F7E9C8', floor='#C9A06A', deco='stripe'), objs=[
            O('beds', '화단 울타리 그림', 'ghBeds', 40, 40, 380, 190, dict(ns=BEDS, title='화단 울타리 만들기'), keep=True,
              look='정사각형 화단을 한 줄로 붙이고 나무 막대로 울타리를 둘렀어요. 화단 수에 따라 막대가 몇 개 필요할까요?',
              lookFig=F('ghBeds', 480, 230, ns=BEDS, title='화단 울타리 만들기'),
              guide='화단 울타리 그림에서 화단마다 울타리 막대를 세어 보세요.'),
            O('vine', '덩굴 길 표지판', 'ghVine', 450, 40, 230, 190, dict(first=FIRST, turns=TURNS), keep=True,
              look='덩굴 문 단추를 누르는 차례가 적힌 표지판이에요.', lookFig=F('ghVine', 400, 300, first=FIRST, turns=TURNS),
              guide='덩굴 길 표지판의 첫 화살표와 돌리는 각을 수첩에 남겨 두세요.'),
            O('cal', '물 주기 달력', 'poster', 710, 40, 260, 160, dict(lines=CAL, fs=18, c='#FFFDF4'), keep=True,
              look='식물마다 물을 주는 날이 적힌 달력이에요.', lookFig=F('poster', 360, 190, lines=CAL, fs=23, c='#FFFDF4'),
              guide='물 주기 달력을 읽고 수첩에 남겨 두세요.'),
            O('csafe', '선인장 금고', 'safe', 90, 300, 170, 170,
              lock=Lk('num', str(sticks(BED_Q)), f'금고 문 쪽지: **화단 {BED_Q}개를 한 줄로 붙여 울타리를 두르려면 막대가 몇 개 필요할까요?** 숫자 세 개.',
                      ['화단 울타리 그림에서 화단 1개, 2개, 3개일 때 막대 수를 세어 표로 정리해 보세요.', '화단이 1개 늘 때마다 막대는 몇 개씩 늘어나나요?', '(막대 수) = (화단 수) × 3 + 1이라는 대응 관계를 찾아요.'],
                      f'화단 1개 4개, 2개 7개, 3개 10개 → (막대 수) = (화단 수) × 3 + 1 → {BED_Q} × 3 + 1 = {sticks(BED_Q)}',
                      chk=lambda: BED_Q * 3 + 1),
              give=['kh1'], after='금고가 열렸어요! 안에 초록색 **열쇠 손잡이**가 들어 있어요. 몸통은 없어요.',
              guide='화단 수와 울타리 막대 수의 대응 관계를 찾아 선인장 금고를 열어 보세요.'),
            O('gate', '덩굴 문', 'ghGate', 760, 210, 200, 300,
              lock=Lk('dir', vine(), '덩굴 문의 화살표 단추예요. **덩굴 길 표지판에 적힌 차례대로** 화살표 다섯 개를 눌러요.',
                      ['표지판을 수첩에서 열어 보세요. 첫 화살표는 그대로 눌러요.', '두 번째 화살표는 첫 화살표 ↑를 ①에 적힌 90°만큼 시계 방향으로 돌린 것이에요. 그다음도 바로 앞 화살표를 ②, ③, ④만큼 돌려요.', '180°는 반 바퀴, 270°는 세 번 90°(시계 반대 방향으로 90°와 같음)예요. 화살표는 모두 5개예요.'],
                      '첫 화살표는 ↑, 90° 돌리면 →, 180° 돌리면 ←, 270° 돌리면 ↓, 90° 돌리면 ←예요. 누를 차례: ↑ → ← ↓ ←',
                      chk=lambda: vine()),
              go='c', after='덩굴 문살이 스르르 열리고 씨앗 연구실로 가는 길이 보여요!', guide='덩굴 길 표지판대로 화살표를 돌려 가며 눌러 보세요.'),
        ]),
        dict(id='c', nm='씨앗 연구실', bg=dict(wall='#E3EEF5', floor='#6E7C88', deco='tile'), objs=[
            O('net', '주사위 전개도', 'ghNet', 40, 40, 300, 240, dict(cells=NET, title='모양 주사위 전개도'), keep=True,
              look='씨앗 상자 뚜껑에 달린 **정육면체 모양 주사위**의 전개도예요. 면마다 모양이 그려져 있고, 점선을 따라 접어요.', lookFig=F('ghNet', 400, 320, cells=NET, title='모양 주사위 전개도'),
              guide='주사위 전개도를 보고, 접으면 어느 면끼리 마주 보는지 생각해 보세요.'),
            O('jar', '씨앗 유리병', 'ghJar', 370, 50, 170, 220, dict(lines=JAR), keep=True,
              look=f'해바라기 씨가 든 유리병이에요. 꼬리표에 "해바라기 씨 {SEEDS}개, 한 봉투에 {BAG}개씩 나누어 담기"라고 적혀 있어요.', lookFig=F('ghJar', 260, 320, lines=JAR),
              guide='씨앗 유리병의 꼬리표를 읽어 보세요.'),
            O('seedbox', '씨앗 상자', 'ghSeedbox', 380, 320, 230, 180, dict(a=BOX_A, b=BOX_B, c=BOX_C), keep=True,
              look=f'직육면체 모양 씨앗 상자예요. 모서리 길이가 {BOX_A} cm, {BOX_B} cm, {BOX_C} cm로 적혀 있어요.', lookFig=F('ghSeedbox', 300, 230, a=BOX_A, b=BOX_B, c=BOX_C, fs=16),
              lock=Lk('shape', [opposite()[s] for s in ASK], '상자 뚜껑에 정육면체 주사위 자물쇠가 달려 있어요. 쪽지: **주사위 전개도를 접었을 때, ○ 면, △ 면, □ 면과 각각 마주 보는(평행한) 면의 모양을 차례로 눌러요.**',
                      ['주사위 전개도를 수첩에서 열어 보세요. 가운데 줄에 네 면이 이어져 있어요.', '가로로 이어진 네 면 △ □ ☆ ◇는 한 칸 건너 있는 면끼리 마주 봐요.', '□의 위에 붙은 ○와 아래에 붙은 ♡는 서로 마주 봐요.'],
                      '○와 마주 보는 면 ♡ → △와 마주 보는 면 ☆ → □와 마주 보는 면 ◇',
                      chk=lambda: [opposite()[s] for s in ASK], opts=['○', '△', '□', '☆', '◇', '♡']),
              after='뚜껑이 열렸어요! 상자 안은 비어 있고, 앞쪽 안벽에 **아주 작은 서랍**이 붙어 있어요.',
              guide='주사위 전개도를 접었을 때 마주 보는 면을 찾아 씨앗 상자를 열어 보세요.'),
            O('sdraw', '상자 속 작은 서랍', 'drawer', 50, 95, 70, 40, dict(c='#B98552', lock=True), in_='seedbox',
              lock=Lk('num', str(EDGES), '상자 안 아주 작은 서랍이에요! 숫자 자물쇠예요. 열대 온실 그래프 구석 쪽지에 적힌 대로 계산해요.',
                      ['열대 온실의 물 사용량 그래프를 크게 보면 구석에 작은 쪽지가 있어요.', f'씨앗 상자에 적힌 길이는 {BOX_A} cm, {BOX_B} cm, {BOX_C} cm예요. 직육면체의 모서리는 모두 12개예요.', '길이가 같은 모서리가 4개씩 세 묶음 있어요.'],
                      f'({BOX_A} + {BOX_B} + {BOX_C}) × 4 = {BOX_A + BOX_B + BOX_C} × 4 = {EDGES}', chk=lambda: (BOX_A + BOX_B + BOX_C) * 4),
              give=['kh2'], after='작은 서랍 안에 초록색 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='씨앗 상자를 연 뒤 상자 안쪽의 작은 서랍을 눌러 보세요.'),
            O('exit', '출구', 'door', 840, 170, 130, 210, dict(c='초록', sign='출구'),
              need='gkey', needMsg='출구에 초록색 열쇠 구멍이 있어요.', useMsg='출구 열쇠가 딱 맞아요! 이제 문의 숫자판만 남았어요.',
              lock=Lk('num', f'{BAGS}{lcm(FERN, ORCH)}', '숫자판 위 글: **(해바라기 씨를 모두 담는 데 필요한 봉투 수) 뒤에 (고사리와 난초에 다시 같은 날 물을 주는 것은 며칠 뒤인지)를 이어 쓴 수** 숫자 네 개.',
                      ['씨앗 유리병 꼬리표와 선인장 방의 물 주기 달력을 함께 보세요.', f'{SEEDS}개를 {BAG}개씩 담으면 남는 씨앗도 봉투가 하나 더 있어야 해요. 일의 자리에서 올림해요.', f'{FERN}일마다와 {ORCH}일마다가 다시 겹치는 날은 {FERN}와 {ORCH}의 최소공배수만큼 지난 날이에요.'],
                      f'{SEEDS}을 일의 자리에서 올림하면 240 → 봉투 {BAGS}장, {FERN}와 {ORCH}의 최소공배수 {lcm(FERN, ORCH)} → {BAGS}{lcm(FERN, ORCH)}',
                      chk=lambda: int(f'{-(-SEEDS // BAG)}{lcm(FERN, ORCH)}')),
              go='exit', after='출구가 열렸어요!', guide='열쇠 손잡이와 몸통을 합쳐 출구를 열고, 씨앗 봉투 수와 물 주기 날로 비밀번호를 구해요.'),
        ]),
    ],
    flow=['thermo', 'chart', 'cscrap', 'pots', 'waterer', 'toolbox', 'bdoor', 'beds', 'vine', 'cal', 'csafe', 'gate',
          'net', 'jar', 'seedbox', 'sdraw', 'kh1+kh2', 'exit'],
)
