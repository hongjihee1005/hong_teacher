"""수학 방탈출 · 정전된 밤 학교 탈출 (추천 3~4학년 · 보통 · 나눗셈과 나머지·곱셈·들이·분수의 크기·각도·시간 계산·방향) — 형식은 rooms.py 머리말"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
HEIGHT = 127                                         # 키 재는 기계의 머리 막대(cm)
VISIT = [('김하늘', ''), ('이도윤', ''), ('박서아', ''), ('최지호', ''), ('정유나', ''), ('강민준', ''), ('조은비', ''), ('윤시우', '')]
KIDS = len(VISIT)                                    # 보건실에 온 친구 8명
BAND = 76                                            # 보건 일지: 밴드 76개
Q, REM = divmod(BAND, KIDS)                          # 9개씩, 4개 남음
LOG = ['보건 일지', f'밴드 {BAND}개를 오늘 보건실에 온', '친구들에게 똑같이 나누어 주고,', '남은 밴드는 구급상자에 넣어요.']
MEDS = [('빨강', 3, 8), ('파랑', 5, 8), ('초록', 2, 8), ('노랑', 7, 8)]   # 약병에 든 약(8칸 중 몇 칸)
MEDB = [{'c': c, 'num': a, 'den': b} for c, a, b in MEDS]
MED_ORDER = [c for _, c in sorted(((Fraction(a, b), c) for c, a, b in MEDS), reverse=True)]
MILK_R, MILK_C, MILK_ML = 4, 6, 200                  # 우유 상자 4줄 × 6갑, 한 갑 200 mL
MENU = ['오늘의 급식', '잡곡밥 · 미역국 · 불고기', f'우유 한 갑 = {MILK_ML} mL']
MAP = dict(n=4, m=5, start=[0, 3], path='UUURRRDR', block=[[1, 2], [2, 1], [3, 3], [4, 3], [2, 3]], sl='급식실', gl='방송실')
KNOBS = [('○', 40), ('△', 120), ('□', 90), ('☆', 150), ('◇', 110)]   # 조정기 손잡이 각도(°)
KNOB_ORDER = [s for a, s in sorted(((a, s) for s, a in KNOBS if 90 < a < 180), reverse=True)]
SHOW = [('교가', 1, 25), ('안내 방송', 0, 50), ('노래', 1, 55)]       # 방송 순서(분, 초)
BYE = 35                                             # 끝인사 35초(조정기 화면)
SHOW_SEC = sum(m * 60 + s for _, m, s in SHOW) + BYE
SHOW_M, SHOW_S = divmod(SHOW_SEC, 60)                # 4분 45초
SCHED = ['오늘 밤 방송 순서'] + [f'{i + 1}. {n}  ' + (f'{m}분 ' if m else '') + f'{s}초' for i, (n, m, s) in enumerate(SHOW)]

ROOM = dict(
    id='school-mid', title='정전된 밤 학교 탈출', ico='🌙', acc='#3559B8',
    rec='추천 3~4학년 · 보통 · 나눗셈과 나머지·곱셈·들이·분수의 크기·각도·시간 계산·방향',
    intro='별 보기 행사 날 밤, 보건실에 들렀다가 정전이 되어 문이 잠겼어요! 보건실·급식실·방송실을 지나 방송으로 선생님께 우리가 있는 곳을 알려요.',
    story=['학교 별 보기 행사 날 밤, 운동장에서 넘어진 친구와 함께 보건실에 밴드를 붙이러 왔어요.',
           '그때 갑자기 불이 툭 꺼지는 정전! 보건실 자동문이 철컥 잠겨 버렸어요.',
           '단서를 모아 방송실까지 가서, 방송으로 선생님께 우리가 여기 있다고 알려요!'],
    outro='"여기는 방송실입니다!" 방송을 들은 선생님이 달려와 문을 열어 주셨어요. 무사히 학교를 탈출해 별 보기 행사에 함께했어요!',
    items={'torch': dict(nm='손전등', k='torch', c='#F2C230', de='깜깜한 곳을 밝힐 수 있어요'),
           'key': dict(nm='급식실 열쇠', k='key', c='#3559B8', de='파란 열쇠예요. 열쇠 고리에 \'급식실\'이라고 적혀 있어요'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#3559B8', de='파란 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#3559B8', de='파란 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.'),
           'card': dict(nm='방송실 출입 카드', k='card', c='#8A5BC9', de='방송실 문에 대는 카드예요'),
           'bat': dict(nm='건전지', k='battery', c='#3DA35D', de='무선 마이크에 넣을 수 있어요')},
    combine=[dict(a='kh1', b='kh2', make='key', msg='손잡이와 몸통을 딸깍 끼웠더니 **급식실 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='보건실', bg=dict(wall='#22354A', floor='#5E6E78', deco='tile'), objs=[
            O('hmeter', '키 재는 기계', 'scHeight', 30, 60, 90, 330, dict(lo=100, hi=150, v=HEIGHT), keep=True,
              look='키 재는 기계예요. 빨간 머리 막대가 멈춘 곳을 읽어 보세요. 작은 눈금 한 칸은 **1 cm**예요.',
              lookFig=F('scHeight', 160, 420, lo=100, hi=150, v=HEIGHT),
              guide='키 재는 기계에서 빨간 막대가 가리키는 키를 읽어 보세요.'),
            O('visitors', '방문 명단', 'scAttend', 140, 30, 160, 210, dict(rows=VISIT, title='오늘 온 친구'), keep=True,
              look='오늘 보건실에 온 친구들의 이름이 적힌 명단이에요. 모두 몇 명일까요?', lookFig=F('scAttend', 240, 330, rows=VISIT, title='오늘 온 친구'),
              guide='방문 명단에 이름이 몇 개 있는지 세어 보세요.'),
            O('log', '보건 일지', 'poster', 320, 30, 280, 150, dict(lines=LOG, fs=17, c='#FFFDF4'), keep=True,
              look='보건 선생님의 일지예요. 밴드를 나누어 준 방법이 적혀 있어요.', lookFig=F('poster', 380, 190, lines=LOG, fs=21, c='#FFFDF4'),
              guide='보건 일지를 읽고 수첩에 남겨 두세요.'),
            O('medb', '약병', 'scMedB', 620, 40, 210, 140, dict(items=MEDB), keep=True,
              look='약병 네 개가 나란히 있어요. 병마다 눈금이 똑같이 8칸이에요. 약이 몇 칸만큼 들어 있는지 보세요.',
              lookFig=F('scMedB', 360, 230, items=MEDB),
              guide='약병마다 약이 얼마나 들어 있는지 분수로 살펴보세요.'),
            O('bed', '침대', 'scBed', 300, 280, 300, 190,
              look='하얀 이불이 덮인 보건실 침대예요. 잠긴 곳은 없어요.',
              guide='침대를 크게 보면 이불 위에 무언가 놓여 있을지도 몰라요.'),
            O('bscrap', '이불 위 쪽지', 'scrap', 170, 82, 50, 36, dict(t='?'), in_='bed', keep=True,
              look='이불 위에 아주 작은 쪽지가 있어요! "약장 속 작은 서랍 = **키 재는 기계에 나온 키(cm) × 약병의 개수**"',
              guide='침대를 크게 보고 이불 위의 작은 쪽지를 찾아보세요.'),
            O('firstaid', '구급상자', 'box', 140, 400, 140, 110, dict(c='하양', lock=True, label='+'),
              lock=Lk('num', f'{Q}{REM}', '구급상자 뚜껑의 쪽지: **보건 일지대로 나누었을 때, 친구 한 명이 받은 밴드 수 뒤에 남은 밴드 수를 이어 쓴 수** 숫자 두 개를 맞춰요.',
                      ['보건 일지와 방문 명단을 함께 보세요. 밴드는 몇 개이고, 친구는 몇 명인가요?', f'밴드 {BAND}개를 {KIDS}명에게 똑같이 나누어요. {BAND} ÷ {KIDS}의 몫과 나머지를 구해요.', f'{KIDS} × 9 = 72예요. {BAND}에서 72를 빼면 남는 수가 나와요.'],
                      f'{BAND} ÷ {KIDS} = {Q} … {REM} → 한 명에 {Q}개, 남은 밴드 {REM}개 → {Q}{REM}', chk=lambda: int(f'{BAND // KIDS}{BAND % KIDS}')),
              give=['torch'], after=f'구급상자가 열렸어요! 남은 밴드 {REM}개 옆에 **손전등**이 있어요.',
              guide='보건 일지와 방문 명단으로 나눗셈을 해서 구급상자를 열어 보세요.'),
            O('medcab', '약장', 'cabinet', 620, 200, 150, 180, dict(c='#E8E3D8', label='약장'),
              lock=Lk('color', MED_ORDER, '약장 문의 쪽지: **약병에 든 약이 많은 것부터** 그 약병의 색을 차례로 눌러요.',
                      ['약병을 크게 보세요. 병마다 8칸 중 몇 칸에 약이 들어 있나요?', '분모가 같은 분수는 분자가 클수록 큰 수예요.', '7/8이 가장 많아요. 그다음은?'],
                      '노랑 7/8 → 파랑 5/8 → 빨강 3/8 → 초록 2/8',
                      chk=lambda: [c for _, c in sorted(((Fraction(a, b), c) for c, a, b in MEDS), reverse=True)], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kh1'], after='약장이 열렸어요! 약 상자 사이에 파란 **열쇠 손잡이**가 있어요. 맨 아래에는 **아주 작은 서랍**도 보여요.',
              guide='약병의 약이 많은 것부터 색을 눌러 약장을 열어 보세요.'),
            O('mdraw', '약장 속 작은 서랍', 'drawer', 40, 128, 70, 40, dict(c='#8A929C', lock=True), in_='medcab',
              lock=Lk('num', str(HEIGHT * len(MEDS)), '약장 안 아주 작은 서랍이에요! 숫자 세 개 자물쇠예요. 이불 위 쪽지에 적힌 대로 계산해요.',
                      ['침대를 크게 보면 이불 위에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'키 재는 기계의 키는 {HEIGHT} cm, 약병은 {len(MEDS)}개예요.', f'{HEIGHT} × {len(MEDS)}을 100, 20, 7로 나누어 곱한 뒤 더해 봐요.'],
                      f'{HEIGHT} × {len(MEDS)} = {HEIGHT * len(MEDS)}', chk=lambda: HEIGHT * len(MEDS)),
              give=['kh2'], after='작은 서랍 안에 파란 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='약장을 연 뒤 약장 안쪽의 작은 서랍을 눌러 보세요.'),
            O('kdoor', '급식실 쪽 문', 'door', 850, 160, 120, 220, dict(c='파랑', sign='급식실'),
              need='key', needMsg='급식실로 가는 문이 잠겨 있어요. 파란 열쇠 구멍이 보여요.', useMsg='급식실 열쇠로 문을 열었어요!',
              go='b', after='문 너머로 급식실이 보여요. 고소한 냄새가 조금 남아 있어요.', guide='열쇠 손잡이와 몸통을 합쳐 급식실 쪽 문을 열어 보세요.'),
        ]),
        dict(id='b', nm='급식실', bg=dict(wall='#3A3024', floor='#7A6B58', deco='tile'), objs=[
            O('menu', '식단표', 'board', 40, 40, 320, 160, dict(lines=MENU, fs=21), keep=True,
              look='오늘의 급식 식단표예요. 맨 아래 줄을 잘 보세요.', lookFig=F('board', 380, 170, lines=MENU, fs=23),
              guide='식단표를 읽고 수첩에 남겨 두세요.'),
            O('window2', '급식실 창문', 'window', 400, 40, 200, 150, dict(night=True),
              look='창밖은 깜깜한 밤이에요. 멀리 운동장에서 별 보기 행사 불빛이 보여요.', guide='창문에는 잠긴 곳이 없어요. 다른 물건을 살펴보세요.'),
            O('milk', '우유 상자', 'scMilk', 60, 330, 260, 180, dict(rows=MILK_R, cols=MILK_C), keep=True,
              look='위에서 내려다본 우유 상자예요. 우유가 줄을 맞추어 꽉 차 있어요. 모두 몇 갑일까요?', lookFig=F('scMilk', 360, 250, rows=MILK_R, cols=MILK_C),
              guide='우유 상자의 우유가 몇 줄, 한 줄에 몇 갑인지 세어 보세요.'),
            O('cupboard', '배식대 아래 찬장', 'cabinet', 420, 220, 220, 180, dict(c='#C9B99A', label='찬장'),
              need='torch', needMsg='배식대 아래가 너무 깜깜해서 찬장의 자물쇠가 보이지 않아요.', useMsg='손전등으로 비추니 숫자 네 개짜리 자물쇠가 보여요!',
              lock=Lk('num', str(MILK_R * MILK_C * MILK_ML), '찬장 자물쇠의 쪽지: **우유 상자에 든 우유는 모두 몇 mL일까요?** 숫자 네 개를 맞춰요.',
                      ['우유 상자의 우유가 몇 갑인지 세고, 식단표에서 우유 한 갑이 몇 mL인지 찾아요.', f'우유는 {MILK_R}줄 × {MILK_C}갑 = {MILK_R * MILK_C}갑이에요.', f'{MILK_R * MILK_C} × {MILK_ML}은 {MILK_R * MILK_C} × 2에 0을 두 개 붙인 것과 같아요.'],
                      f'{MILK_R} × {MILK_C} = {MILK_R * MILK_C}갑, {MILK_R * MILK_C} × {MILK_ML} mL = {MILK_R * MILK_C * MILK_ML} mL (4 L 800 mL)', chk=lambda: MILK_R * MILK_C * MILK_ML),
              give=['card'], after='찬장이 열렸어요! 안에 **방송실 출입 카드**와 **방송실 가는 길** 그림이 있어요. 빨간 점이 가는 길이에요.',
              afterFig=F('map', 300, 240, **MAP), guide='손전등으로 찬장을 비추고, 우유가 모두 몇 mL인지 계산해 보세요.'),
            O('bdoor', '방송실 가는 문', 'door', 820, 150, 130, 230, dict(c='보라', sign='방송실', keypad=True),
              need='card', needMsg='문 옆에 카드를 대는 곳이 있어요.', useMsg='출입 카드를 댔더니 삑! 화살표 단추에 불이 들어왔어요.',
              lock=Lk('dir', segs(MAP['path']), '방송실 가는 문의 화살표 단추예요. **방송실 가는 길** 그림을 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['찬장에서 찾은 \'방송실 가는 길\' 그림을 수첩에서 열어 보세요.', '\'급식실\'에서 출발해 빨간 점을 따라가요. 처음에는 위로 가요.', '위 → 오른쪽 → 그다음은 어느 쪽으로 꺾이나요?'],
                      '위로 3칸 → 오른쪽 3칸 → 아래 1칸 → 오른쪽 1칸이니 ↑ → ↓ →', chk=lambda: segs('UUURRRDR')),
              go='c', after='문이 열렸어요. 복도 끝 방송실에 도착했어요!', guide='출입 카드를 문에 대고, 길 그림대로 화살표를 눌러 보세요.'),
        ]),
        dict(id='c', nm='방송실', bg=dict(wall='#2A2442', floor='#4B4358', deco='stripe'), objs=[
            O('sched', '방송 순서표', 'poster', 40, 40, 300, 190, dict(lines=SCHED, fs=21, c='#FFFDF4'), keep=True,
              look='오늘 밤 방송 순서표예요. 방송마다 걸리는 시간이 적혀 있어요.', lookFig=F('poster', 380, 220, lines=SCHED, fs=24, c='#FFFDF4'),
              guide='방송 순서표를 읽고 수첩에 남겨 두세요.'),
            O('mixer', '방송 조정기', 'scMixer', 360, 250, 420, 200, dict(knobs=[{'s': s, 'a': a} for s, a in KNOBS]),
              look='손잡이 다섯 개에 각도 눈금이 있어요. 손잡이마다 파란 밑선과 빨간 바늘 사이의 각을 읽어 보세요. 작은 눈금 한 칸은 **10°**예요.',
              lookFig=F('scMixer', 460, 330, knobs=[{'s': s, 'a': a} for s, a in KNOBS], cols=3),
              lock=Lk('shape', KNOB_ORDER, '조정기 아래 쪽지: **바늘이 둔각을 가리키는 손잡이만, 각이 큰 것부터** 그 아래 모양을 차례로 눌러요. (각은 파란 밑선에서 빨간 바늘까지)',
                      ['조정기를 크게 보세요. 손잡이마다 파란 밑선과 빨간 바늘 사이의 각을 눈금으로 읽어요.', '둔각은 90°보다 크고 180°보다 작은 각이에요. 90°인 직각은 둔각이 아니에요.', '둔각인 손잡이는 세 개예요. 가장 큰 각은 150°예요.'],
                      '☆ 150° → △ 120° → ◇ 110° (○ 40°는 예각, □ 90°는 직각)',
                      chk=lambda: [s for a, s in sorted(((a, s) for s, a in KNOBS if 90 < a < 180), reverse=True)], opts=['○', '△', '□', '☆', '◇']),
              give=['bat'], after=f'조정기 화면이 켜졌어요: "방송 순서표의 방송을 모두 한 뒤, 마지막에 **끝인사 {BYE}초**를 꼭 넣어요." 조정기 서랍에서 **건전지**가 나왔고, 무대 커튼 뒤에서 **무선 마이크**가 나타났어요.',
              guide='손잡이 바늘의 각도를 읽고, 둔각만 큰 것부터 모양을 눌러 보세요.'),
            O('mic', '무선 마이크', 'scMic', 820, 220, 140, 270, req=['mixer'],
              need='bat', needMsg='무선 마이크가 꺼져 있어요. 건전지 넣는 곳이 비어 있어요.', useMsg='건전지를 넣었더니 마이크에 초록 불이 들어왔어요! 방송 시간을 맞춰야 켜져요.',
              lock=Lk('num', f'{SHOW_M}{SHOW_S:02d}', f'마이크의 숫자판: **방송 순서표의 방송을 모두 하고 끝인사까지 하면 모두 몇 분 몇 초?** \'분\' 숫자 뒤에 \'초\' 숫자 두 개를 이어 써요.',
                      ['방송 순서표와 조정기 화면의 끝인사 시간을 함께 보세요.', '분은 분끼리, 초는 초끼리 더해요. 25초 + 50초 + 55초 + 35초는 몇 초인가요?', '초끼리 더한 값이 60초를 넘으면 60초를 1분으로 바꾸어 올려요.'],
                      f'초: 25 + 50 + 55 + {BYE} = 165초 = 2분 45초, 분: 1 + 1 = 2분 → 모두 {SHOW_M}분 {SHOW_S}초 → {SHOW_M}{SHOW_S:02d}',
                      chk=lambda: int(f'{SHOW_SEC // 60}{SHOW_SEC % 60:02d}')),
              go='exit', after='"여기는 방송실입니다! 우리가 학교 안에 있어요!" 방송이 학교에 울려 퍼졌어요.', guide='건전지를 마이크에 넣고, 방송 시간을 모두 더해 숫자판을 맞춰요.'),
        ]),
    ],
    flow=['hmeter', 'visitors', 'log', 'medb', 'bed', 'bscrap', 'firstaid', 'medcab', 'mdraw', 'kh1+kh2', 'kdoor',
          'menu', 'milk', 'cupboard', 'bdoor', 'sched', 'mixer', 'mic'],
)
