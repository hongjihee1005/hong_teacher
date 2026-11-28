"""수학 방탈출 · 해적 항구 탈출 (추천 6학년) — 형식은 rooms.py 머리말"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀) — 모두 이야기 속 값
GOLD, SILVER = 84, 126                          # 화물 장부
LEDGER = ['화물 장부', f'금화 {GOLD}개', f'은화 {SILVER}개', '주머니에 나누어 담기']
CAP, CREW = 3, 4                                # 선장 : 선원 = 3 : 4
RULE = ['신호 규칙', '2의 배수만 → ○', '3의 배수만 → △', '2와 3의 공배수 → ☆', '둘 다 아니면 → □']
NUMS = [14, 15, 18, 25]                         # 신호판의 수
def mark(n): return '☆' if n % 6 == 0 else '○' if n % 2 == 0 else '△' if n % 3 == 0 else '□'
TANKS = [('빨강', '0.68', Fraction(68, 100)), ('노랑', '7/10', Fraction(7, 10)), ('초록', '63%', Fraction(63, 100)), ('파랑', '13/20', Fraction(13, 20))]
TANK_P = [{'c': c, 'label': l} for c, l, _ in TANKS]
MAP = dict(n=5, m=6, start=[0, 4], path='RRRRUULLLUUR', block=[[1, 3], [2, 3], [3, 3], [0, 2], [0, 3], [2, 1], [3, 1], [4, 1], [5, 1], [5, 3]], sl='기중기', gl='짐')
DIA = 150                                       # 등대 렌즈 지름(cm, 이야기 속 값)
BOX = (9, 7, 6)                                 # 망원경 상자 가로·세로·높이(cm)
LOG = ['등대지기 일지', '렌즈 둘레 = 지름 × 3.14', '망원경은 상자에 보관']

ROOM = dict(
    id='pirate-high', title='해적 항구 탈출', ico='⛵', acc='#6B3FA0',
    rec='추천 6학년 · 최대공약수·분수·소수·백분율 비교·배수와 공배수·원주·직육면체 부피·비례배분·방향',
    intro='은퇴한 해적 선장 할아버지의 항구 창고에 놀러 갔다가 폭풍 바람에 창고 문이 잠겼어요! 창고와 등대 꼭대기를 오가며 단서를 모아 창고 문을 열어요.',
    story=['은퇴한 해적 선장 할아버지의 항구 창고를 구경하던 날, 갑자기 폭풍이 몰려와 등대 불빛이 꺼졌어요.',
           '쾅! 바람에 창고 문이 닫히고 자물쇠가 철컥 걸렸어요. 할아버지는 열쇠를 천장 들보 높이 걸어 두셨대요.',
           '등대 불을 다시 켜고, 높이 걸린 열쇠를 꺼내 창고 문을 열어요!'],
    outro='창고 문이 활짝 열렸어요! 다시 켜진 등대 불빛 덕분에 바다의 배들도 무사히 항구로 돌아왔어요. 할아버지가 "멋진 선원들이구나!" 하고 웃으셨어요. 해적 항구를 탈출했어요!',
    mission=dict(title='항구 창고 문을 열어라!', goal='창고와 등대 꼭대기를 오가며 등대 불을 다시 켜고 창고 문을 열어요.', tips=['장부의 금화와 은화 수를 잘 기록해요', '물통의 양은 같은 꼴로 바꿔 견주어요']),
    dialog=[('nar', '은퇴한 해적 선장 할아버지의 항구 창고를 구경하던 날이에요.'), ('tori', '와, 진짜 해적 장부야? 멋지다!'), ('nar', '갑자기 폭풍이 몰려와 등대 불빛이 꺼지고, 쾅! 창고 문이 잠겼어요.'), ('momo', '열쇠는 천장 들보 높이 걸려 있대.'), ('tori', '등대 불도 켜고 열쇠도 꺼내자!'), ('momo', '바다의 배들을 위해서라도 서두르자.')],
    outro_dialog=[('tori', '배들이 돌아왔어! 할아버지가 웃으셔!'), ('momo', '최대공약수랑 비례배분으로 항구를 지켰어.')],
    items={'hook': dict(nm='쇠 갈고리', k='hook', c='#8A929C', de='끝이 휜 쇠 갈고리예요. 손잡이가 짧아서 높은 곳에는 닿지 않아요.'),
           'stick': dict(nm='긴 막대', k='stick', c='#9A6A3F', de='길쭉한 나무 막대예요. 끝에 무언가를 끼울 수 있는 홈이 있어요.'),
           'pole': dict(nm='갈고리 막대', k='hook', c='#6B3FA0', de='긴 막대 끝에 갈고리를 끼웠어요. 높은 곳에 걸린 것을 꺼낼 수 있어요.'),
           'gkey': dict(nm='창고 문 열쇠', k='key', c='#6B3FA0', de='보라색 끈이 달린 큰 열쇠예요')},
    combine=[dict(a='hook', b='stick', make='pole', msg='긴 막대 끝의 홈에 갈고리를 딸깍 끼웠더니 **갈고리 막대**가 되었어요!')],
    scenes=[
        dict(id='a', nm='항구 창고', bg=dict(wall='#D9C8A8', floor='#7A5E44', deco='brick'), objs=[
            O('ledger', '화물 장부', 'board', 30, 30, 290, 170, dict(lines=LEDGER, fs=21), keep=True,
              look='벽에 걸린 화물 장부예요. 할아버지가 보물 주머니를 만들려고 적어 둔 것 같아요.',
              lookFig=F('board', 300, 170, lines=LEDGER, fs=22), guide='화물 장부의 금화·은화 수를 수첩에 남겨 두세요.', say=('momo', '금화와 은화 수를 잘 적어 두자.')),
            O('rule', '신호 규칙 책', 'poster', 340, 30, 205, 170, dict(lines=RULE, fs=16, c='#EAF2FB'), keep=True,
              look='등대 신호를 보내는 규칙이 적힌 쪽이 펼쳐져 있어요. 수에 따라 보내는 모양이 달라요.',
              lookFig=F('poster', 320, 200, lines=RULE, fs=21, c='#EAF2FB'), guide='신호 규칙을 수첩에 남겨 두세요. 등대에서 쓰여요.', say=('tori', '수마다 보내는 모양이 달라진대! 규칙을 기억하자.')),
            O('keys', '들보의 열쇠 꾸러미', 'prBeam', 650, 0, 170, 130,
              look='천장 들보 높이 열쇠 꾸러미가 걸려 있어요. 손이 닿지 않아요.',
              need='pole', needMsg='너무 높아서 손이 닿지 않아요. 길고 끝이 휜 것이 있으면 걸어서 내릴 수 있을 것 같아요.', useMsg='갈고리 막대로 열쇠 꾸러미 고리를 걸어 살살 내렸어요.',
              give=['gkey'], after='열쇠 꾸러미에서 **창고 문 열쇠**를 찾았어요!', guide='갈고리 막대로 들보의 열쇠 꾸러미를 내려 보세요.', say=('tori', '열쇠가 저렇게 높이! 손이 안 닿아.')),
            O('tanks', '물통 네 개', 'bottles', 30, 390, 300, 150, dict(items=TANK_P), keep=True,
              look='물통 네 개에 **물이 통의 얼마만큼 찼는지** 적혀 있어요. 소수, 분수, 백분율로 서로 다르게 적혀 있어요.',
              lookFig=F('bottles', 420, 200, items=TANK_P), guide='물통에 적힌 수를 수첩에 남겨 두세요. 등대에서 쓰여요.', say=('momo', '소수, 분수, 백분율이 섞여 있어. 같은 꼴로 바꿔야 해.')),
            O('cargo', '화물 상자', 'prCrate', 360, 400, 170, 140, dict(lock=True, label='?'),
              look='무거운 화물 상자예요. 숫자 자물쇠가 있어요.',
              lock=Lk('num', str(gcd(GOLD, SILVER)), '뚜껑 글: **장부의 금화와 은화를 남김없이 주머니에 나누어 담아요. 주머니마다 금화 수가 같고, 은화 수도 같게 하려면 주머니는 가장 많이 몇 개일까요?**',
                      ['화물 장부를 보세요. 금화와 은화가 몇 개였나요?', f'주머니 수는 {GOLD}의 약수이면서 {SILVER}의 약수여야 해요. 그런 수(공약수) 가운데 가장 큰 수를 찾아요.', f'{GOLD} = 2 × 2 × 3 × 7, {SILVER} = 2 × 3 × 3 × 7이에요.'],
                      f'{GOLD}와 {SILVER}의 최대공약수 = 2 × 3 × 7 = {gcd(GOLD, SILVER)} → 주머니 {gcd(GOLD, SILVER)}개(금화 2개·은화 3개씩)', chk=lambda: gcd(GOLD, SILVER)),
              give=['hook'], after='상자가 열렸어요! 안에 **쇠 갈고리**와 기중기 조종 지도가 있어요. 지도에는 기중기 갈고리가 짐까지 가는 길이 빨간 점으로 그려져 있어요.',
              afterFig=F('map', 330, 280, **MAP), guide='화물 장부의 금화·은화로 최대공약수를 구해 화물 상자를 열어요.'),
            O('crane', '항구 기중기', 'prCrane', 560, 160, 220, 380,
              look='짐을 들어 올리는 항구 기중기예요. 조종 단추에 화살표가 있어요.',
              lock=Lk('dir', segs(MAP['path']), '조종판 글: 기중기 갈고리를 지도대로 움직여요. **움직이는 방향이 바뀌는 차례대로** 화살표를 눌러요.',
                      ['수첩에서 화물 상자 속 지도를 열어 보세요. \'기중기\'에서 출발해 빨간 점을 따라가요.', '처음에는 오른쪽으로 4칸, 그다음은 위로 가요. 다른 짐(회색 칸)을 피해 왼쪽으로 돌아가요. 화살표는 모두 5개예요.'],
                      '오른쪽으로 4칸, 위로 2칸, 왼쪽으로 3칸, 위로 2칸, 오른쪽으로 1칸 가요. 누를 차례: → ↑ ← ↑ →', chk=lambda: segs('RRRRUULLLUUR')),
              after='기중기가 커다란 짐을 번쩍 들어 올렸어요! 짐이 있던 바닥에 **등대 계단 문**이 나타났어요.',
              guide='화물 상자 속 지도대로 기중기 조종 단추를 눌러요.'),
            O('stairs', '등대 계단 문', 'door', 655, 400, 120, 140, dict(c='회색', sign='등대'), req=['crane'], go='b',
              look='짐 아래 숨어 있던 문이에요. 등대 꼭대기로 올라가는 계단이 보여요.', after='계단 위로 등대 꼭대기가 보여요.',
              guide='새로 나타난 등대 계단 문으로 올라가 보세요.'),
            O('gate', '창고 문', 'door', 850, 170, 130, 210, dict(c='보라', sign='창고 문'),
              look='밖으로 나가는 창고 문이에요. 열쇠 구멍과 숫자판이 있어요.',
              need='gkey', needMsg='문에 큰 열쇠 구멍이 있어요. 창고 문 열쇠가 필요해요.', useMsg='창고 문 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str((GOLD + SILVER) * CREW // (CAP + CREW)), '숫자판 위 글: **장부의 금화와 은화를 모두 합해 선장과 선원이 신호에서 알려 준 비로 나누어요. 비밀번호 = 선원이 받는 수**',
                      ['등대 신호판을 연 뒤 맞은편 배가 보낸 대답을 수첩에서 다시 보세요. 선장 : 선원의 비가 있어요.', f'금화와 은화를 모두 더하면 {GOLD} + {SILVER} = {GOLD + SILVER}개예요.', f'선장 : 선원 = {CAP} : {CREW}이면 선원은 전체의 {CREW}/{CAP + CREW}을 받아요.'],
                      f'{GOLD} + {SILVER} = {GOLD + SILVER}, {GOLD + SILVER} × {CREW}/{CAP + CREW} = {(GOLD + SILVER) * CREW // (CAP + CREW)} (선장은 {(GOLD + SILVER) * CAP // (CAP + CREW)})',
                      chk=lambda: (GOLD + SILVER) * Fraction(CREW, CAP + CREW)),
              go='exit', after='창고 문이 열렸어요!', guide='창고 문 열쇠를 쓰고, 화물 장부와 신호의 대답으로 비례배분을 해요.'),
        ]),
        dict(id='b', nm='등대 꼭대기', bg=dict(wall='#1D2B5A', floor='#4A5160', deco='stars', panes=1, props=[['rugRect', 300, 440, 380, 100, dict(c='#3B4F7A', b='#C9A24B')], ['coil', 60, 452, 150, 86]]), objs=[
            O('log', '등대지기 일지', 'board', 30, 30, 280, 170, dict(lines=LOG, fs=19), keep=True,
              look='등대지기 일지가 펼쳐져 있어요. 렌즈 둘레를 구하는 방법이 적혀 있어요.',
              lookFig=F('board', 320, 170, lines=LOG, fs=21), guide='등대지기 일지를 수첩에 남겨 두세요.', say=('momo', '렌즈 둘레 구하는 방법이 적혀 있어.')),
            O('lscrap', '일지 사이 쪽지', 'scrap', 226, 122, 46, 36, dict(t='?'), in_='log', keep=True,
              look='일지 사이에 작은 쪽지가 끼워져 있어요! "사물함 속 작은 서랍 = **망원경 상자의 부피(cm³)**"',
              guide='등대지기 일지를 크게 보고 아래쪽의 작은 쪽지를 찾아보세요.'),
            O('box', '망원경 상자', 'prCuboid', 30, 230, 280, 180, dict(t='망원경 상자', a=f'{BOX[0]} cm', b=f'{BOX[1]} cm', c=f'{BOX[2]} cm'), keep=True,
              look=f'망원경을 넣어 두는 직육면체 상자예요. 가로 {BOX[0]} cm, 세로 {BOX[1]} cm, 높이 {BOX[2]} cm라고 적혀 있어요.',
              lookFig=F('prCuboid', 300, 190, t='망원경 상자', a=f'{BOX[0]} cm', b=f'{BOX[1]} cm', c=f'{BOX[2]} cm'), guide='망원경 상자의 가로·세로·높이를 수첩에 남겨 두세요.', say=('tori', '가로, 세로, 높이가 다 적혀 있네!')),
            O('lens', '등대 렌즈', 'prLens', 340, 30, 320, 330, dict(d=f'지름 {DIA} cm'),
              look=f'불이 꺼진 등대 렌즈예요. 렌즈 테두리에 숫자 자물쇠가 있어요. 렌즈의 지름은 {DIA} cm예요.',
              lock=Lk('num', str(int(DIA * Fraction(314, 100))), '자물쇠 옆 글: **렌즈 둘레(원주)는 몇 cm일까요?** (원주율은 3.14)',
                      ['등대지기 일지에 렌즈 둘레를 구하는 방법이 적혀 있어요.', f'원주 = 지름 × 원주율이에요. 지름은 {DIA} cm예요.'],
                      f'{DIA} × 3.14 = {int(DIA * Fraction(314, 100))} (cm)', chk=lambda: DIA * Fraction(314, 100)),
              after='등대 불이 다시 환하게 켜졌어요! 불빛에 벽의 **신호판**이 보여요.', guide='등대지기 일지의 방법으로 렌즈 둘레를 구해요.'),
            O('signal', '신호판', 'prSignal', 690, 30, 290, 180, dict(nums=NUMS, title='오늘 보낼 신호'), req=['lens'],
              look='등대 불빛으로 보낼 신호판이에요. 수 카드 아래 칸에 모양을 넣어 신호를 보내요.',
              lock=Lk('shape', [mark(n) for n in NUMS], '신호판 글: **창고의 신호 규칙대로** 수 카드 ' + ', '.join(map(str, NUMS)) + '에 맞는 모양을 차례로 눌러요.',
                      ['창고의 신호 규칙 책을 수첩에서 다시 보세요.', '2와 3의 공배수는 6의 배수예요. 18은 6의 배수예요.', '14는 2의 배수지만 3의 배수가 아니고, 15는 3의 배수지만 2의 배수가 아니에요. 25는?'],
                      '14 → ○(2의 배수만), 15 → △(3의 배수만), 18 → ☆(6의 배수), 25 → □(둘 다 아님)',
                      chk=lambda: ['☆' if n % 2 == 0 and n % 3 == 0 else '○' if n % 2 == 0 else '△' if n % 3 == 0 else '□' for n in (14, 15, 18, 25)]),
              after=f'신호를 보내자 맞은편 배가 불빛으로 대답했어요: "선장과 선원은 보물을 **{CAP} : {CREW}**로 나누어 가져요!"',
              guide='창고의 신호 규칙대로 신호판의 모양을 눌러요.'),
            O('locker', '등대 사물함', 'cabinet', 720, 240, 160, 290, dict(label='사물함', c='#8AA3B5'),
              look='등대지기의 사물함이에요. 문에 빨강·노랑·초록·파랑 색 단추가 있어요.',
              lock=Lk('color', [c for c, _, v in sorted(TANKS, key=lambda r: -r[2])], '사물함 문의 글: **창고의 물통 가운데 물이 많이 찬 통부터** 그 색 단추를 차례로 눌러요.',
                      ['창고의 물통 네 개에 적힌 수를 보세요. 소수, 분수, 백분율이 섞여 있어요.', '모두 백분율(또는 소수)로 바꿔 비교해요. 7/10 = 70%, 13/20 = 65%예요.', '0.68 = 68%예요. 네 수를 큰 것부터 늘어놓아 보세요.'],
                      '노랑 7/10=70% → 빨강 0.68=68% → 파랑 13/20=65% → 초록 63%',
                      chk=lambda: [c for _, c in sorted([(-Fraction(68, 100), '빨강'), (-Fraction(7, 10), '노랑'), (-Fraction(63, 100), '초록'), (-Fraction(13, 20), '파랑')])], opts=['빨강', '노랑', '초록', '파랑']),
              after='사물함이 열렸어요! 비옷과 장화가 걸려 있고, 아래쪽에 작은 서랍이 달려 있어요.',
              guide='창고 물통의 수를 같은 꼴로 바꿔 비교해 사물함을 열어요.'),
            O('ldraw', '사물함 속 작은 서랍', 'drawer', 48, 200, 64, 40, dict(c='#5A6273', lock=True), in_='locker',
              lock=Lk('num', str(BOX[0] * BOX[1] * BOX[2]), '사물함 아래쪽에 작은 서랍이 있어요! 숫자 자물쇠예요. 일지 사이 쪽지에 적힌 대로 계산해요.',
                      ['등대지기 일지를 크게 보면 작은 쪽지가 끼워져 있어요. 거기에 계산 방법이 적혀 있어요.', '직육면체의 부피 = 가로 × 세로 × 높이예요.', f'{BOX[0]} × {BOX[1]} × {BOX[2]}을 계산해요.'],
                      f'{BOX[0]} × {BOX[1]} × {BOX[2]} = {BOX[0] * BOX[1] * BOX[2]} (cm³)', chk=lambda: BOX[0] * BOX[1] * BOX[2]),
              give=['stick'], after='작은 서랍 안에 **긴 막대**가 접혀 들어 있었어요. 막대 끝에 무언가를 끼우는 홈이 있어요.',
              guide='사물함을 연 뒤 사물함 아래쪽의 작은 서랍을 눌러 보세요.'),
        ]),
    ],
    flow=['ledger', 'rule', 'tanks', 'cargo', 'crane', 'stairs',
          'log', 'lscrap', 'box', 'lens', 'signal', 'locker', 'ldraw', 'hook+stick', 'keys', 'gate'],
)
