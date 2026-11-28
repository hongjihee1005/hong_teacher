"""수학 방탈출 · 공룡 전시실 탈출 (추천 1학년) — 형식은 rooms.py 머리말"""
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
EGGS = [('초록', 5), ('파랑', 3), ('노랑', 4)]            # 둥지의 알: 초록 5 · 파랑 3 · 노랑 4
NEST = [{'c': k, 'n': n} for k, n in EGGS]
EGG_ALL = sum(n for _, n in EGGS)                          # 12
GREEN = dict(EGGS)['초록']                                 # 5
CLOCK_H, CLOCK_M = 2, 30                                   # 전시실 시계 2시 30분
TREX = 12                                                  # 티라노사우루스 몸길이 약 12 m(실제 값, 이름표 구경용 — m는 2학년이라 계산에 쓰지 않음)
SKEL_PLATE = ['티라노사우루스', f'몸길이 약 {TREX} m']
PAT = ['△', '△', '○']                                      # 공룡 등 무늬 규칙
POSTER = [PAT[i % 3] for i in range(7)] + ['?']
PSC = [{'△': '초록', '○': '주황'}[k] for k in POSTER[:-1]] + ['#C8402F']
MAP = dict(n=4, m=5, start=[0, 3], path='RRUUURR', block=[[0, 0], [1, 1], [3, 2], [4, 3], [0, 1], [4, 2]], sl='전시실', gl='둥지 방')
BIG, SMALL = 7, 5                                          # 발자국 길: 큰 발자국 7 · 작은 발자국 5
PAINT = [('빨강', '8+7', 8 + 7), ('파랑', '9+4', 9 + 4), ('초록', '6+8', 6 + 8), ('노랑', '7+9', 7 + 9)]
BOTTLES = [{'c': k, 'label': l} for k, l, _ in PAINT]

ROOM = dict(
    id='dino-low', title='공룡 전시실 탈출', ico='🦖', acc='#3F7A26',
    rec='추천 1학년 · 수 세기·세 수의 덧셈·받아올림 있는 덧셈·몇 시 30분·모양 규칙·방향·색깔 순서',
    intro='공룡 박물관에서 뼈 화석을 구경하다 보니 전시실 문이 닫혀 버렸어요! 공룡 전시실과 알 둥지 방을 둘러보며 단서를 모아 출구 문을 열어요.',
    story=['공룡 박물관 견학 날, 커다란 티라노사우루스 뼈 앞에서 입을 떡 벌리고 구경했어요.', '그사이 친구들은 모두 나가고, 쿵! 전시실 문이 닫히며 자물쇠가 철컥 걸렸어요.', '공룡 전시실과 알 둥지 방의 단서를 모아 출구 문을 열어요!'],
    outro='출구 문이 활짝 열렸어요! 해설사 선생님이 "공룡 박사가 다 됐네요!" 하며 웃어요. 공룡 전시실을 탈출했어요!',
    items={'key': dict(nm='작은 열쇠', k='key', c='#C9A24B', de='안내 책상 서랍에 맞을 것 같아요'),
           'brush': dict(nm='발굴 붓', k='stick', c='#B98552', de='모래를 살살 쓸어 내는 붓이에요'),
           'keyb': dict(nm='뼈 열쇠', k='key', c='#E8D9B8', de='뼈 모양 큰 열쇠예요. 출구 문에 맞을까요?'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#E8D9B8', de='뼈 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#E8D9B8', de='뼈 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **뼈 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='공룡 전시실', bg=dict(wall='#E4EED6', floor='#B7A27E', deco='brick'), objs=[
            O('clock', '전시실 시계', 'clock', 60, 30, 120, 120, dict(h=CLOCK_H, m=CLOCK_M), keep=True,
              look='전시실 벽시계가 멈춰 있어요! 짧은바늘과 긴바늘을 잘 보세요. **몇 시 몇 분**일까요?', lookFig=F('clock', 150, 150, h=CLOCK_H, m=CLOCK_M),
              guide='전시실 시계가 몇 시 몇 분을 가리키는지 보고 수첩에 남겨 두세요.'),
            O('poster', '공룡 무늬 포스터', 'poster', 40, 170, 190, 150, dict(lines=['공룡 등 무늬'], shapes=POSTER, sc=PSC), keep=True,
              look='공룡 등에 난 무늬가 규칙대로 그려져 있어요. 맨 끝은 **?** 로 지워져 있어요. 어떤 모양이 되풀이될까요?',
              lookFig=F('poster', 320, 130, lines=['공룡 등 무늬'], shapes=POSTER, sc=PSC),
              guide='공룡 무늬 포스터의 규칙을 수첩에 남겨 두세요.'),
            O('skel', '티라노사우루스 뼈', 'dnSkel', 260, 40, 400, 340, dict(plate=SKEL_PLATE),
              look='커다란 티라노사우루스 뼈 화석이에요. 진짜 티라노사우루스는 버스 한 대만큼 길었대요! 입이 떡 벌어지지만, 여기에는 잠긴 곳이 없네요.',
              lookFig=F('dnSkel', 360, 300, plate=SKEL_PLATE), guide='티라노사우루스 뼈는 구경만 해도 돼요.'),
            O('nest', '공룡 알 둥지', 'dnNest', 40, 390, 230, 150, dict(eggs=NEST), keep=True,
              look='공룡 알 모형이 둥지에 놓여 있어요. 초록 알, 파란 알, 노란 알이 있어요. 색깔마다 몇 개인지 세어 볼까요?',
              lookFig=F('dnNest', 320, 200, eggs=NEST), guide='공룡 알 둥지의 알을 색깔마다 세어 보세요.'),
            O('box', '공룡 알 상자', 'box', 300, 400, 170, 130, dict(c='초록', lock=True, label='?'),
              look='뚜껑에 숫자 자물쇠 두 칸이 달린 상자예요.',
              lock=Lk('num', str(EGG_ALL), '뚜껑의 쪽지: **둥지에 있는 공룡 알은 모두 몇 개일까요?** 숫자 두 개를 맞춰요.',
                      ['공룡 알 둥지를 다시 보세요. 색깔마다 따로 세면 쉬워요.', f'초록 알 {GREEN}개, 파란 알 3개, 노란 알 4개예요.', f'{GREEN} + 3 = 8, 8에 4를 더하면?'],
                      f'초록 {GREEN} + 파랑 3 + 노랑 4 = {EGG_ALL}', chk=lambda: sum(n for _, n in EGGS)),
              give=['key'], after='상자가 열렸어요! 알 모형 사이에 **작은 열쇠**가 있어요. 열쇠 고리에 \'안내 책상\'이라고 적혀 있어요.',
              guide='공룡 알 상자를 열어 보세요. 둥지의 알을 모두 세면 돼요.'),
            O('desk', '안내 책상', 'desk', 670, 300, 140, 200, dict(items=[{'k': 'book', 'c': '초록', 'n': 2}]),
              need='key', needMsg='안내 책상 서랍이 잠겨 있어요. 작은 열쇠 구멍이 보여요.', useMsg='작은 열쇠로 서랍을 열었어요.',
              give=['brush'], after='서랍 안에 **발굴 붓**과 **둥지 방 가는 길 그림**이 있어요. 빨간 점이 가는 길이에요.',
              afterFig=F('map', 300, 240, **MAP), guide='작은 열쇠로 안내 책상 서랍을 열어 보세요.'),
            O('door', '둥지 방 문', 'door', 830, 170, 130, 210, dict(c='초록', sign='둥지 방', keypad=True),
              look='알 둥지 방으로 가는 문이에요. 화살표 단추가 달려 있어요.',
              lock=Lk('dir', segs(MAP['path']), '문에 화살표 단추가 있어요. **둥지 방 가는 길 그림**을 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['안내 책상 서랍에서 찾은 길 그림을 수첩에서 열어 보세요.', '\'전시실\'에서 출발해 빨간 점을 따라가요. 처음에는 오른쪽으로 가요.', '오른쪽 → 위 → 그다음은 어느 쪽으로 꺾이나요?'],
                      '오른쪽으로 2칸 → 위로 3칸 → 오른쪽으로 2칸이니 → ↑ →', chk=lambda: segs('RRUUURR')),
              go='b', after='딸깍! 문이 열렸어요. 따뜻한 모래 냄새가 나요.', guide='안내 책상에서 찾은 길 그림대로 둥지 방 문의 화살표를 눌러 보세요.'),
        ]),
        dict(id='b', nm='알 둥지 방', bg=dict(wall='#FBEBD0', floor='#D3AE74', deco='stripe'), objs=[
            O('tracks', '발자국 길', 'dnPrints', 40, 40, 420, 170, dict(big=BIG, small=SMALL), keep=True,
              look='모래 위에 공룡 발자국이 찍혀 있어요. 발가락이 셋 있는 **큰 발자국**과 동글동글한 **작은 발자국**이 있어요. 몇 개씩인지 세어 볼까요?',
              lookFig=F('dnPrints', 420, 170, big=BIG, small=SMALL), guide='발자국 길의 큰 발자국과 작은 발자국을 세어 보세요.'),
            O('tscrap', '발자국 길 구석 쪽지', 'scrap', 362, 8, 46, 34, dict(t='?'), in_='tracks', keep=True,
              look='발자국 길 구석에 아주 작은 쪽지가 꽂혀 있어요! "모래 상자 속 작은 서랍 = **큰 발자국 수 + 작은 발자국 수 + 둥지의 초록 알 수**"',
              guide='발자국 길을 크게 보고 오른쪽 위 구석의 작은 쪽지를 찾아보세요.'),
            O('bottles', '공룡 물감 통', 'bottles', 490, 40, 300, 170, dict(items=BOTTLES), keep=True,
              look='공룡을 칠하는 물감 통 네 개에 계산식이 붙어 있어요. 통마다 계산하면 얼마일까요?', lookFig=F('bottles', 380, 190, items=BOTTLES),
              guide='물감 통에 붙은 계산식을 하나씩 계산해 보세요.'),
            O('panel', '불빛 알 장치', 'panel', 820, 40, 150, 150, dict(colors=['빨강', '노랑', '초록', '파랑'], label='작은 것부터', done='열림'),
              lock=Lk('color', [k for _, k in sorted((v, k) for k, _, v in PAINT)],
                      '장치의 글: **물감 통의 계산 값이 작은 것부터** 그 통의 색 단추를 차례로 눌러요.',
                      ['물감 통마다 계산해요: 8+7, 9+4, 6+8, 7+9.', '값은 15, 13, 14, 16이에요. 가장 작은 수는?', '13 → 14 → 15 → 16 차례로, 그 수가 나오는 통의 색을 눌러요.'],
                      '파랑 9+4=13 → 초록 6+8=14 → 빨강 8+7=15 → 노랑 7+9=16',
                      chk=lambda: [k for _, k in sorted((v, k) for k, _, v in PAINT)], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kb1'], after='불빛이 차례로 켜지더니 장치 아래 칸이 열리며 **열쇠 손잡이**가 굴러 나왔어요! 그런데 손잡이만 있고 몸통이 없어요.',
              guide='물감 통의 값을 작은 것부터 늘어놓아 불빛 알 장치의 색을 눌러 보세요.'),
            O('sand', '모래 상자', 'dnDig', 40, 300, 300, 210, dict(grid=[3, 2], bone=True),
              look='모래가 가득 담긴 상자예요. 모래 밑에 무언가 묻혀 있는 것 같아요.',
              need='brush', needMsg='모래가 너무 많아서 손으로는 파낼 수 없어요. 살살 쓸어 낼 도구가 있으면 좋겠어요.', useMsg='발굴 붓으로 모래를 쓸어 내니 모양 단추가 달린 화석 판이 나왔어요!',
              lock=Lk('shape', [PAT[i % 3] for i in range(7, 10)], '화석 판의 글: **공룡 무늬 포스터의 ? 자리부터** 규칙대로 모양 세 개를 차례로 눌러요.',
                      ['공룡 전시실의 무늬 포스터를 수첩에서 열어 보세요.', '△ △ ○ 가 되풀이돼요. 포스터의 마지막 모양은 △ 였어요.', '△ 다음에 무엇이 오는지 세 번 이어 가요.'],
                      '△ △ ○ 가 되풀이되므로 ? 자리부터 △ ○ △', chk=lambda: [PAT[i % 3] for i in range(7, 10)], opts=['○', '△', '□', '☆']),
              after='화석 판이 덜컹 내려가며 커다란 **뼈 화석**이 드러났어요! 모래 상자 모서리에 **작은 서랍**도 보이고, 방 오른쪽 벽에는 숨어 있던 **출구 문**이 나타났어요.',
              guide='발굴 붓으로 모래 상자를 쓸고, 포스터 규칙대로 모양을 눌러 보세요.'),
            O('sdraw', '모래 상자 속 작은 서랍', 'drawer', 210, 140, 70, 40, dict(c='#8A6A4A', lock=True), in_='sand',
              lock=Lk('num', str(BIG + SMALL + GREEN), '모래 상자 모서리의 작은 서랍에 숫자 두 개 자물쇠가 있어요. 발자국 길 구석 쪽지에 적힌 대로 계산해요.',
                      ['발자국 길을 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'큰 발자국 {BIG}개, 작은 발자국 {SMALL}개, 둥지의 초록 알은 {GREEN}개예요.', f'{BIG} + {SMALL} = {BIG + SMALL}, 거기에 {GREEN}를 더하면?'],
                      f'큰 발자국 {BIG} + 작은 발자국 {SMALL} + 초록 알 {GREEN} = {BIG + SMALL + GREEN}', chk=lambda: BIG + SMALL + GREEN),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='모래 상자를 연 뒤 모서리의 작은 서랍을 눌러 보세요.'),
            O('fern', '고사리 화분', 'plant', 380, 340, 110, 170,
              look='공룡이 살던 때에도 있었던 고사리 무리예요. 잎이 부채처럼 펼쳐져 있어요. 여기에는 잠긴 곳이 없네요.',
              guide='고사리 화분은 구경만 해도 돼요.'),
            O('exit', '출구 문', 'door', 840, 200, 120, 210, dict(c='빨강', sign='출구'), req=['sand'],
              look='화석 판을 맞추자 나타난 출구 문이에요.',
              need='keyb', needMsg='출구 문에 뼈 모양 큰 열쇠 구멍이 있어요.', useMsg='뼈 열쇠가 딱 맞아요! 이제 문의 숫자판만 남았어요.',
              lock=Lk('num', str(CLOCK_M + EGG_ALL), '숫자판 위 글: **비밀번호 = (전시실 시계의 \'몇 분\'의 수) + (둥지에 있던 공룡 알 모두)**',
                      ['전시실 시계와 공룡 알 둥지를 수첩에서 열어 보세요.', f'시계는 {CLOCK_H}시 {CLOCK_M}분이에요. 둥지의 알은 모두 몇 개였나요?', f'{CLOCK_M} + {EGG_ALL}는? 30에 10을 더하고, 또 2를 더해요.'],
                      f'시계 {CLOCK_H}시 {CLOCK_M}분 → {CLOCK_M}, 공룡 알 {EGG_ALL}개 → {CLOCK_M} + {EGG_ALL} = {CLOCK_M + EGG_ALL}', chk=lambda: CLOCK_M + sum(n for _, n in EGGS)),
              go='exit', after='출구 문이 열렸어요!', guide='뼈 열쇠를 출구 문에 쓰고, 시계와 공룡 알 단서로 비밀번호를 계산해요.'),
        ]),
    ],
    flow=['clock', 'poster', 'skel', 'nest', 'box', 'desk', 'door', 'tracks', 'tscrap', 'bottles', 'panel', 'sand', 'sdraw', 'kb1+kb2', 'exit'],
)
