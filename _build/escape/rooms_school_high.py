"""수학 방탈출 · 옥상 천문대 탈출 (추천 5~6학년 · 보통 · 평균·최소공배수·최대공약수·분수와 소수의 크기·넓이·배수·원주·방향) — 형식은 rooms.py 머리말"""
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
def lcm(a, b): return a * b // gcd(a, b)

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
SIGN = [('1반', 24), ('2반', 27), ('3반', 21), ('4반', 28)]       # 별 보기 신청 인원
AVG = sum(n for _, n in SIGN) // len(SIGN)                         # 평균 25명
SIGN_FIG = ['6학년 별 보기 신청', f'{SIGN[0][0]} {SIGN[0][1]}명 · {SIGN[1][0]} {SIGN[1][1]}명', f'{SIGN[2][0]} {SIGN[2][1]}명 · {SIGN[3][0]} {SIGN[3][1]}명']
CHECK_D, CLEAN_D = 6, 8                                            # 망원경 점검 6일마다, 돔 청소 8일마다
NEXT = lcm(CHECK_D, CLEAN_D)                                       # 24일 뒤
DUTY = ['천문대 일정', f'망원경 점검: {CHECK_D}일마다', f'돔 청소: {CLEAN_D}일마다', '오늘은 둘 다 한 날!']
TAGS = ['과학실', '음악실', '체육관', '방송실', '도서실', '천문대']
FLAGS = [('빨강', '0.6', Fraction(6, 10)), ('파랑', '3/4', Fraction(3, 4)), ('초록', '2/3', Fraction(2, 3)), ('노랑', '0.65', Fraction(65, 100))]
FLAG_ORDER = [c for v, c in sorted(((v, c) for c, _, v in FLAGS), reverse=True)]
BASKET, VOLLEY = 18, 12                                            # 공 수레의 농구공·배구공
GYM_W, GYM_H = 36, 24                                              # 이야기 속 체육관 바닥(m)
DRAW = GYM_W * GYM_H // gcd(BASKET, VOLLEY)                        # 864 ÷ 6 = 144
MAP = dict(n=5, m=5, start=[0, 4], path='RRUULLUURRRR', block=[[1, 3], [1, 1], [2, 1], [3, 2], [3, 4], [4, 2]], sl='체육관', gl='옥상')
STARS = [('○', 7), ('△', 12), ('□', 9), ('☆', 15), ('◇', 8)]       # 별자리 지도: 이름표 모양과 별 수
TELE_ORDER = [s for n, s in sorted((n, s) for s, n in STARS if n % 3 == 0)]
RULE = ['망원경으로 보는 차례', '별의 수가 3의 배수인 별자리만', '별이 적은 별자리부터!']
DOME_R = 3                                                         # 이야기 속 돔 바닥 반지름(m)
PI = Fraction(314, 100)
EXIT = int(2 * DOME_R * PI * 100)                                  # 원주 18.84 m = 1884 cm

ROOM = dict(
    id='school-high', title='옥상 천문대 탈출', ico='🌙', acc='#4B3FA0',
    rec='추천 6학년 · 평균·최소공배수·최대공약수·분수와 소수의 크기·넓이·배수·원주·방향',
    intro='별 보기 행사 도우미가 되어 천문대 열쇠를 가지러 왔다가 교무실에 갇혔어요! 교무실·체육관·옥상 천문대의 단서를 모아 별 보기 행사장으로 나가는 옥상 문을 열어요.',
    story=['별 보기 행사 도우미가 된 우리는 옥상 천문대 열쇠를 가지러 교무실에 들어왔어요.',
           '그때 바람이 휙! 교무실 문이 쾅 닫히며 자물쇠가 철컥 걸렸어요.',
           '단서를 모아 옥상 천문대까지 올라가, 친구들이 기다리는 행사장 문을 열어요!'],
    outro='옥상 문이 활짝 열렸어요! 망원경 앞에 친구들이 줄을 서고, 밤하늘에 별자리가 반짝여요. 옥상 천문대를 탈출해 별 보기 행사를 시작했어요!',
    items={'key': dict(nm='체육관 열쇠', k='key', c='#C9A24B', de='번호표에 \'체육관\'이라고 적혀 있어요'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#4B3FA0', de='보라 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#4B3FA0', de='보라 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.'),
           'tkey': dict(nm='천문대 금고 열쇠', k='key', c='#4B3FA0', de='보라색 열쇠예요. 천문대 금고에 맞을까요?'),
           'lens': dict(nm='망원경 렌즈', k='lens', c='#3B4A8A', de='망원경 눈대는 곳에 끼우는 렌즈예요')},
    combine=[dict(a='kh1', b='kh2', make='tkey', msg='손잡이와 몸통을 딸깍 끼웠더니 **천문대 금고 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='교무실', bg=dict(wall='#283247', floor='#5A5048', deco='stripe'), objs=[
            O('signup', '신청 현황판', 'board', 40, 30, 300, 170, dict(lines=SIGN_FIG, fs=21), keep=True,
              look='반마다 별 보기 행사를 신청한 학생 수가 적혀 있어요.', lookFig=F('board', 380, 180, lines=SIGN_FIG, fs=24),
              guide='신청 현황판의 반별 인원을 수첩에 남겨 두세요.'),
            O('duty', '천문대 일정표', 'poster', 360, 30, 280, 170, dict(lines=DUTY, fs=19, c='#FFFDF4'), keep=True,
              look='천문대 일을 하는 날이 적힌 일정표예요.', lookFig=F('poster', 360, 210, lines=DUTY, fs=23, c='#FFFDF4'),
              guide='천문대 일정표를 읽고 수첩에 남겨 두세요.'),
            O('keybox', '열쇠함', 'scKeybox', 670, 40, 170, 210, dict(tags=TAGS),
              lock=Lk('num', f'{AVG}{NEXT}', '열쇠함 숫자판의 쪽지: **(반별 신청 인원의 평균) 뒤에 (망원경 점검과 돔 청소를 다시 같은 날 하게 되는 것은 며칠 뒤인지)를 이어 쓴 수** 숫자 네 개.',
                      ['신청 현황판과 천문대 일정표를 함께 보세요.', f'평균 = 네 반 인원의 합 ÷ 반 수예요. 합은 {sum(n for _, n in SIGN)}명이에요.', f'{CHECK_D}일마다와 {CLEAN_D}일마다가 다시 겹치는 날은 {CHECK_D}와 {CLEAN_D}의 최소공배수 날 뒤예요.'],
                      f'평균 ({" + ".join(str(n) for _, n in SIGN)}) ÷ {len(SIGN)} = {AVG}, {CHECK_D}와 {CLEAN_D}의 최소공배수 {NEXT} → {AVG}{NEXT}',
                      chk=lambda: int(f'{sum(n for _, n in SIGN) // len(SIGN)}{lcm(CHECK_D, CLEAN_D)}')),
              give=['key'], after='열쇠함이 열렸어요! **체육관 열쇠**가 있어요. 그런데 \'천문대\' 고리는 비어 있어요. 천문대 금고 열쇠는 따로 찾아야 해요.',
              guide='신청 인원의 평균과 일정표의 최소공배수로 열쇠함을 열어 보세요.'),
            O('desk', '교무실 책상', 'desk', 360, 250, 280, 240, dict(items=[{'k': 'book', 'c': '파랑', 'n': 3}, {'k': 'jar', 'c': '노랑', 'n': 1}]),
              look='선생님들이 쓰는 책상이에요. 서랍은 잠겨 있지 않고 비어 있어요.',
              guide='교무실 책상을 크게 보면 책상다리 옆에 무언가 붙어 있을지도 몰라요.'),
            O('dscrap', '책상 옆 쪽지', 'scrap', 168, 120, 52, 36, dict(t='?'), in_='desk', keep=True,
              look='책상다리 옆에 아주 작은 쪽지가 붙어 있어요! "체육 창고 속 작은 서랍 = **체육관 바닥의 넓이(m²) ÷ 농구공 수와 배구공 수의 최대공약수**"',
              guide='교무실 책상을 크게 보고 책상다리 옆의 작은 쪽지를 찾아보세요.'),
            O('gymdoor', '체육관 가는 문', 'door', 870, 170, 115, 210, dict(c='주황', sign='체육관'),
              need='key', needMsg='체육관으로 가는 문이 잠겨 있어요.', useMsg='체육관 열쇠로 문을 열었어요!',
              go='b', after='문 너머로 넓은 체육관이 보여요.', guide='열쇠함에서 찾은 체육관 열쇠로 문을 열어 보세요.'),
        ]),
        dict(id='b', nm='체육관', bg=dict(wall='#2E2A3D', floor='#9A7448', deco='brick'), objs=[
            O('flags', '응원 깃발', 'scFlags', 40, 20, 420, 160, dict(flags=[{'c': c, 't': t} for c, t, _ in FLAGS]), keep=True,
              look='체육 대회 응원 깃발이에요. 깃발마다 반이 이긴 경기의 비율이 분수나 소수로 적혀 있어요.',
              lookFig=F('scFlags', 420, 170, flags=[{'c': c, 't': t} for c, t, _ in FLAGS]),
              guide='응원 깃발에 적힌 분수와 소수를 살펴보세요.'),
            O('plan', '체육관 바닥 도면', 'scPlan', 500, 30, 260, 180, dict(title='체육관 바닥', W=GYM_W, H=GYM_H, a=f'{GYM_W} m', b=f'{GYM_H} m'), keep=True,
              look=f'체육관 바닥 도면이에요. 바닥은 직사각형이에요. (이야기 속 체육관 크기예요)',
              lookFig=F('scPlan', 360, 250, title='체육관 바닥', W=GYM_W, H=GYM_H, a=f'{GYM_W} m', b=f'{GYM_H} m'),
              guide='체육관 바닥 도면의 가로와 세로를 수첩에 남겨 두세요.'),
            O('cart', '공 수레', 'scBallCart', 40, 300, 260, 220, dict(items=[{'k': 'basket', 'n': BASKET}, {'k': 'volley', 'n': VOLLEY}]), keep=True,
              look='공 수레에 주황색 **농구공**과 하얀 바탕에 파랑·노랑 줄무늬가 있는 **배구공**이 섞여 있어요. 공마다 몇 개일까요?',
              lookFig=F('scBallCart', 360, 300, items=[{'k': 'basket', 'n': BASKET}, {'k': 'volley', 'n': VOLLEY}]),
              guide='공 수레의 농구공과 배구공을 따로 세어 보세요.'),
            O('storage', '체육 창고', 'cabinet', 420, 215, 180, 185, dict(c='#8FB0D0', label='체육 창고'),
              lock=Lk('color', FLAG_ORDER, '창고 문의 쪽지: **응원 깃발에 적힌 수가 큰 것부터** 그 깃발의 색을 차례로 눌러요.',
                      ['응원 깃발을 크게 보세요. 분수와 소수가 섞여 있어요.', '분수를 소수로 바꾸면 비교하기 쉬워요. 3/4 = 0.75예요.', '2/3은 0.666…으로 0.65보다 커요.'],
                      '파랑 3/4(0.75) → 초록 2/3(0.666…) → 노랑 0.65 → 빨강 0.6',
                      chk=lambda: [c for v, c in sorted(((v, c) for c, _, v in FLAGS), reverse=True)], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kh1'], after='창고가 열렸어요! 매트 위에 보라색 **열쇠 손잡이**와 **옥상 가는 길** 그림이 있어요. 창고 안쪽에는 **아주 작은 서랍**도 보여요.',
              afterFig=F('map', 300, 300, **MAP), guide='응원 깃발의 수를 비교해 체육 창고를 열어 보세요.'),
            O('sdraw', '창고 속 작은 서랍', 'drawer', 50, 132, 70, 40, dict(c='#5E7A9A', lock=True), in_='storage',
              lock=Lk('num', str(DRAW), '창고 안 아주 작은 서랍이에요! 숫자 세 개 자물쇠예요. 교무실 책상 옆 쪽지에 적힌 대로 계산해요.',
                      ['교무실 책상을 크게 보면 책상다리 옆에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'체육관 바닥 넓이는 {GYM_W} × {GYM_H}예요. 공 수레의 농구공과 배구공 수의 최대공약수도 구해요.', f'농구공 {BASKET}개와 배구공 {VOLLEY}개의 공약수 가운데 가장 큰 수로 넓이를 나누어요.'],
                      f'넓이 {GYM_W} × {GYM_H} = {GYM_W * GYM_H} m², {BASKET}와 {VOLLEY}의 최대공약수 {gcd(BASKET, VOLLEY)} → {GYM_W * GYM_H} ÷ {gcd(BASKET, VOLLEY)} = {DRAW}',
                      chk=lambda: GYM_W * GYM_H // gcd(BASKET, VOLLEY)),
              give=['kh2'], after='작은 서랍 안에 보라색 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='체육 창고를 연 뒤 창고 안쪽의 작은 서랍을 눌러 보세요.'),
            O('stairs', '옥상 계단 문', 'door', 840, 160, 130, 220, dict(c='보라', sign='옥상', keypad=True),
              lock=Lk('dir', segs(MAP['path']), '옥상 계단 문의 화살표 단추예요. **옥상 가는 길** 그림을 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['체육 창고에서 찾은 \'옥상 가는 길\' 그림을 수첩에서 열어 보세요.', '\'체육관\'에서 출발해 빨간 점을 따라가요. 처음에는 오른쪽으로 가요.', '방향이 모두 다섯 번 바뀌어요. 마지막은 오른쪽이에요.'],
                      '오른쪽 2칸 → 위 2칸 → 왼쪽 2칸 → 위 2칸 → 오른쪽 4칸이니 → ↑ ← ↑ →', chk=lambda: segs('RRUULLUURRRR')),
              go='c', after='계단 문이 열렸어요! 계단을 올라 옥상 천문대에 도착했어요.', guide='창고에서 찾은 길 그림대로 옥상 계단 문의 화살표를 눌러 보세요.'),
        ]),
        dict(id='c', nm='옥상 천문대', bg=dict(wall='#121A3A', floor='#3A3F55', deco='stars'), objs=[
            O('starmap', '별자리 지도', 'scStarmap', 30, 30, 340, 230, dict(groups=[{'s': s, 'n': n} for s, n in STARS], title='오늘 밤 별자리'), keep=True,
              look='별자리 다섯 개가 그려진 지도예요. 별자리마다 왼쪽 위에 모양 이름표가 있어요. 별자리마다 별이 몇 개일까요?',
              lookFig=F('scStarmap', 460, 330, groups=[{'s': s, 'n': n} for s, n in STARS], title='오늘 밤 별자리'),
              guide='별자리 지도에서 별자리마다 별의 수를 세어 보세요.'),
            O('rule', '관측 안내문', 'poster', 390, 30, 250, 150, dict(lines=RULE, fs=17, c='#FFFDF4'), keep=True,
              look='망원경으로 별자리를 보는 차례가 적힌 안내문이에요.', lookFig=F('poster', 360, 180, lines=RULE, fs=22, c='#FFFDF4'),
              guide='관측 안내문을 읽고 수첩에 남겨 두세요.'),
            O('tbox', '천문대 금고', 'safe', 120, 380, 140, 130,
              need='tkey', needMsg='천문대 금고예요. 보라색 열쇠 구멍이 있어요.', useMsg='천문대 금고 열쇠로 금고를 열었어요.',
              give=['lens'], after='금고 안에 반짝이는 **망원경 렌즈**가 들어 있어요.', guide='열쇠 손잡이와 몸통을 합쳐 천문대 금고를 열어 보세요.'),
            O('telescope', '천체 망원경', 'scTelescope', 420, 220, 220, 290,
              need='lens', needMsg='망원경의 눈대는 곳에 렌즈가 빠져 있어요.', useMsg='렌즈를 끼웠더니 망원경 옆 모양 단추에 불이 켜졌어요!',
              lock=Lk('shape', TELE_ORDER, '망원경 옆 모양 단추예요. **관측 안내문의 차례대로** 볼 별자리의 이름표 모양을 차례로 눌러요.',
                      ['별자리 지도와 관측 안내문을 함께 보세요. 별자리마다 별을 세어요.', '별의 수가 3의 배수인 별자리를 골라요. 3, 6, 9, 12, 15, …', '3의 배수인 별자리는 세 개예요. 별이 적은 것부터 눌러요.'],
                      '□ 9개 → △ 12개 → ☆ 15개 (○ 7개, ◇ 8개는 3의 배수가 아니에요)',
                      chk=lambda: [s for n, s in sorted((n, s) for s, n in STARS if n % 3 == 0)], opts=['○', '△', '□', '☆', '◇']),
              after='망원경으로 별자리를 차례로 보았어요! 돔 천장이 스르르 열리며, 벽에 숨어 있던 **돔 바닥 도면**에 불이 켜졌어요.',
              guide='렌즈를 망원경에 끼우고, 안내문 차례대로 별자리 모양을 눌러 보세요.'),
            O('dome', '돔 바닥 도면', 'scPlan', 660, 30, 180, 170, dict(kind='circle', title='천문대 돔 바닥', r=f'{DOME_R} m'), req=['telescope'], keep=True,
              look='천문대 돔 바닥은 원 모양이에요. 원의 중심에서 둘레까지 빨간 선이 그어져 있어요. (이야기 속 천문대 크기예요)',
              lookFig=F('scPlan', 300, 260, kind='circle', title='천문대 돔 바닥', r=f'반지름 {DOME_R} m'),
              guide='새로 나타난 돔 바닥 도면을 살펴보세요.'),
            O('exit', '옥상 행사장 문', 'door', 860, 150, 120, 230, dict(c='보라', sign='행사장'),
              lock=Lk('num', str(EXIT), '문의 숫자판: **비밀번호 = 천문대 돔 바닥(원)의 원주를 cm로 나타낸 수** (원주율 3.14) 숫자 네 개.',
                      ['돔 바닥 도면을 보세요. 빨간 선은 반지름이에요.', '원주 = 지름 × 원주율이에요. 지름은 반지름의 2배예요.', '원주를 m로 구한 뒤 1 m = 100 cm로 바꾸어요.'],
                      f'지름 {DOME_R} × 2 = {DOME_R * 2} m, 원주 {DOME_R * 2} × 3.14 = 18.84 m = {EXIT} cm', chk=lambda: int(2 * DOME_R * PI * 100)),
              go='exit', after='옥상 행사장 문이 열렸어요!', guide='돔 바닥 도면의 반지름으로 원주를 구해 문을 열어 보세요.'),
        ]),
    ],
    flow=['signup', 'duty', 'keybox', 'desk', 'dscrap', 'gymdoor', 'flags', 'plan', 'cart', 'storage', 'sdraw', 'stairs',
          'starmap', 'rule', 'kh1+kh2', 'tbox', 'telescope', 'dome', 'exit'],
)
