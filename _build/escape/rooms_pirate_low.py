"""수학 방탈출 · 꼬마 해적선 탈출 (추천 1~2학년 · 보통) — 형식은 rooms.py 머리말"""
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
B_ROWS, B_COLS = 3, 4                          # 갑판의 나무통: 4개씩 3줄
KNOTS = 6                                      # 밧줄 매듭
FLAGS = [('빨강', '30+12', 30 + 12), ('노랑', '25+9', 25 + 9), ('초록', '50−13', 50 - 13), ('파랑', '46−8', 46 - 8)]
FLAG_P = [{'c': c, 'label': l} for c, l, _ in FLAGS]
MAP = dict(n=4, m=5, start=[0, 3], path='RRUUURR', block=[[1, 1], [1, 2], [3, 2], [3, 3], [4, 3], [0, 0]], sl='배', gl='섬')
CLOCK_H, CLOCK_M = 4, 35                       # 선장실 시계 4시 35분
GEMS = [('빨강', 6), ('파랑', 5), ('초록', 4)]   # 선장 선반의 보석
GEM_ROWS = [[{'k': 'gem', 'c': c, 'n': n}] for c, n in GEMS]
UNIT = ['☆', '△', '△']                          # 옷장 안 깃발 그림의 규칙
FLAGPIC = [UNIT[i % 3] for i in range(7)] + ['?']

ROOM = dict(
    id='pirate-low', title='꼬마 해적선 탈출', ico='⛵', acc='#B36A1E',
    rec='추천 2학년 · 두 자리 덧셈·뺄셈·곱셈구구·몇 시 몇 분·모양 규칙·방향·색깔 순서',
    intro='장난꾸러기 앵무새 때문에 해적선 문이 모두 잠겼어요! 갑판과 선장실의 단서로 구명보트 문을 열어요.',
    story=['해적선을 구경하던 날, 앵무새 \'삐리\'가 "꽥!" 하고 날아오르다 밧줄을 툭 건드렸어요.',
           '쿵! 문이 모두 닫히고 자물쇠가 걸렸어요. 선장님은 낚시를 나가고 안 계셔요.',
           '갑판과 선장실의 단서를 모아 구명보트 문을 열고 배에서 내려요!'],
    outro='구명보트 문이 활짝 열렸어요! 낚시에서 돌아온 선장님이 "꼬마 선원들, 대단해!" 하며 손을 흔들어요. 앵무새 삐리도 "꽥꽥!" 축하해요. 꼬마 해적선을 탈출했어요!',
    items={'spy': dict(nm='망원경', k='lens', c='#C9A24B', de='멀리 있는 것을 크게 볼 수 있어요'),
           'keyb': dict(nm='보트 열쇠', k='key', c='#3B6FD6', de='파란 큰 열쇠예요. 구명보트 문에 맞을까요?'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#3B6FD6', de='큰 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#3B6FD6', de='큰 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **보트 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='갑판', bg=dict(wall='#BFE3F5', floor='#B98552', deco='stripe'), objs=[
            O('mast', '돛대와 깃발', 'prMast', 30, 36, 230, 344, dict(flags=FLAG_P), keep=True,
              look='깃발 네 개에 계산식이 적혀 있어요. 얼마일까요?',
              lookFig=F('prMast', 260, 330, flags=FLAG_P), guide='돛대의 깃발에 적힌 계산식을 수첩에 남겨 두세요.'),
            O('pscrap', '돛대 아래 쪽지', 'scrap', 150, 290, 50, 36, dict(t='?'), in_='mast', keep=True,
              look='돛대 아래에 작은 쪽지가 있어요! "보물 상자 속 작은 서랍: **나무통 수와 밧줄 매듭 수**를 더해요."',
              guide='돛대를 크게 보고 아래쪽의 작은 쪽지를 찾아보세요.'),
            O('parrot', '앵무새 삐리', 'prParrot', 290, 20, 170, 180, dict(say='꽥! 세어 봐!'),
              look='앵무새 삐리가 "꽥! 세어 봐! 세어 봐!" 하고 외쳐요. 갑판의 물건을 세어 보라는 뜻 같아요.',
              guide='앵무새 삐리의 말을 들어 보세요. 그다음 갑판의 물건을 세어 봐요.'),
            O('rope', '밧줄', 'prRope', 490, 40, 250, 110, dict(n=KNOTS), keep=True,
              look='밧줄에 동그란 **매듭**이 있어요. 몇 개일까요?',
              lookFig=F('prRope', 300, 130, n=KNOTS), guide='밧줄의 매듭이 몇 개인지 세어 보세요.'),
            O('barrels', '나무통 더미', 'prBarrels', 260, 395, 200, 150, dict(rows=B_ROWS, cols=B_COLS), keep=True,
              look='나무통이 한 줄에 몇 개씩, 몇 줄일까요?',
              lookFig=F('prBarrels', 240, 180, rows=B_ROWS, cols=B_COLS), guide='나무통이 한 줄에 몇 개씩 몇 줄 있는지 세어 보세요.'),
            O('chest', '작은 보물 상자', 'prChest', 40, 400, 180, 130, dict(lock=True),
              look='숫자 자물쇠가 달린 보물 상자예요.',
              lock=Lk('num', str(B_COLS * B_ROWS), '갑판의 **나무통**은 모두 몇 개일까요? 두 자리 수를 만들어요.',
                      ['나무통 더미를 보세요. 한 줄에 몇 개씩 있나요?', f'한 줄에 {B_COLS}개씩 {B_ROWS}줄이에요. {B_COLS}씩 {B_ROWS}번 더하거나 곱셈구구로 구해요.'],
                      f'{B_COLS}개씩 {B_ROWS}줄 → {B_COLS} × {B_ROWS} = {B_COLS * B_ROWS}', chk=lambda: B_COLS * B_ROWS),
              give=['spy'], after='금화 사이에 **망원경**이 있어요. 앞쪽에 **작은 서랍**도 보여요.',
              guide='나무통을 세어 작은 보물 상자를 열어요.'),
            O('cdraw', '상자 속 작은 서랍', 'drawer', 10, 80, 60, 36, dict(c='#7A4E2A', lock=True), in_='chest',
              lock=Lk('num', str(B_COLS * B_ROWS + KNOTS), '보물 상자 앞 작은 서랍이에요. **돛대 아래 쪽지**대로 계산해요.',
                      ['돛대를 크게 보세요. 아래쪽에 쪽지가 있어요.', f'나무통은 {B_COLS * B_ROWS}개, 밧줄 매듭은 몇 개였나요? 두 수를 더해요.'],
                      f'나무통 {B_COLS * B_ROWS} + 매듭 {KNOTS} = {B_COLS * B_ROWS + KNOTS}', chk=lambda: B_COLS * B_ROWS + KNOTS),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 있어요. 손잡이는 없어요.',
              guide='보물 상자를 연 뒤 상자 앞쪽의 작은 서랍을 눌러 보세요.'),
            O('scope', '망원경 받침대', 'prScope', 780, 40, 190, 180, dict(empty=True),
              look='망원경 받침대인데 망원경이 없어요.',
              need='spy', needMsg='받침대가 비어 있어요. 망원경을 얹으면 멀리 볼 수 있겠어요.', useMsg='망원경을 얹고 바다를 내다봤어요.',
              after='**섬**과 큰 **바위**들이 보여요. 빨간 점이 바위를 피해 섬까지 가는 길이에요.',
              afterFig=F('map', 300, 240, **MAP), guide='상자에서 찾은 망원경을 받침대에 얹어 보세요.'),
            O('wheel', '배의 키', 'prWheel', 560, 200, 170, 200,
              look='배의 방향을 바꾸는 키예요. 옆에 방향 단추가 있어요.',
              lock=Lk('dir', segs(MAP['path']), '**망원경으로 본 길**을 보고 가는 쪽을 차례로 눌러요. 같은 쪽으로 여러 칸 가도 한 번만 눌러요.',
                      ['수첩에서 망원경으로 본 지도를 보세요. \'배\'에서 빨간 점을 따라가요.', '처음에는 오른쪽으로 가요. 바위를 피해 그다음은 어느 쪽일까요? 화살표는 모두 3개예요.'],
                      '오른쪽으로 2칸, 위로 3칸, 오른쪽으로 2칸 가요. 누를 차례: → ↑ →', chk=lambda: segs('RRUUURR')),
              after='배가 섬 옆에 멈췄어요! 덜컹, **선장실 문**의 빗장이 풀렸어요.',
              guide='망원경으로 본 지도대로 배의 키를 돌려요.'),
            O('cabin', '선장실 문', 'door', 820, 250, 140, 220, dict(c='갈색', sign='선장실'), req=['wheel'], go='b',
              look='빗장이 풀린 선장실 문이에요.', after='문 너머에 선장실이 보여요.', guide='새로 열린 선장실 문으로 들어가 보세요.'),
        ]),
        dict(id='b', nm='선장실', bg=dict(wall='#F3E3C3', floor='#9A6A3F', deco='brick'), objs=[
            O('clock', '선장실 시계', 'clock', 40, 40, 130, 130, dict(h=CLOCK_H, m=CLOCK_M), keep=True,
              look='벽시계가 멈춰 있어요. **몇 시 몇 분**일까요?',
              lookFig=F('clock', 160, 160, h=CLOCK_H, m=CLOCK_M), guide='선장실 시계가 몇 시 몇 분인지 수첩에 남겨 두세요.'),
            O('gems', '보석 선반', 'shelf', 200, 50, 300, 210, dict(rows=GEM_ROWS, c='#8A5A2B'), keep=True,
              look='선장님이 모은 보석이에요. 모두 몇 개일까요?',
              lookFig=F('shelf', 300, 210, rows=GEM_ROWS, c='#8A5A2B'), guide='보석 선반의 보석을 모두 세어 보세요.'),
            O('wardrobe', '선장 옷장', 'cabinet', 540, 60, 170, 300, dict(label='선장 옷장', c='#B98552'),
              look='문에 빨강·노랑·초록·파랑 단추가 있어요.',
              lock=Lk('color', [k for _, k in sorted((v, k) for k, _, v in FLAGS)], '**갑판 깃발의 값이 작은 것부터** 그 깃발의 색 단추를 눌러요.',
                      ['수첩에서 돛대의 깃발 계산식을 보세요.', '빨강 30+12, 노랑 25+9, 초록 50−13, 파랑 46−8. 받아올림·받아내림을 조심해요.', '값은 42, 34, 37, 38이에요. 가장 작은 수부터!'],
                      '노랑 25+9=34 → 초록 50−13=37 → 파랑 46−8=38 → 빨강 30+12=42',
                      chk=lambda: [k for _, k in sorted([(30 + 12, '빨강'), (25 + 9, '노랑'), (50 - 13, '초록'), (46 - 8, '파랑')])], opts=['빨강', '노랑', '초록', '파랑']),
              after='옷장이 열렸어요! 문 안쪽에 붙어 있던 **깃발 그림**이 보여요.',
              guide='갑판 깃발의 계산 값을 작은 것부터 정리해 선장 옷장을 열어요.'),
            O('flagpic', '깃발 그림', 'poster', 780, 40, 190, 150, dict(lines=['선장님 깃발 무늬'], shapes=FLAGPIC, fs=20), req=['wardrobe'], keep=True,
              look='모양이 규칙대로 그려져 있어요. 맨 끝 **?** 는 지워졌어요.',
              lookFig=F('poster', 300, 120, lines=['선장님 깃발 무늬'], shapes=FLAGPIC), guide='깃발 그림에서 되풀이되는 모양을 찾아 두세요.'),
            O('jewel', '보석함', 'box', 230, 400, 180, 130, dict(c='보라', lock=True, label='?'),
              look='뚜껑에 모양 단추가 있어요.',
              lock=Lk('shape', [UNIT[i % 3] for i in range(7, 10)], '깃발 그림의 **? 자리와 그 뒤 두 개**에 올 모양을 차례로 눌러요.',
                      ['수첩에서 깃발 그림을 보세요. 어떤 묶음이 되풀이되나요?', '☆ △ △ 가 한 묶음이에요. 마지막으로 보이는 모양은 ☆ 였어요.'],
                      '☆ △ △ 가 되풀이되므로 ? 자리부터 △ △ ☆', chk=lambda: [['☆', '△', '△'][i % 3] for i in range(7, 10)], opts=['○', '△', '□', '☆']),
              give=['kb1'], after='구슬 사이에 **열쇠 손잡이**가 있어요. 몸통은 없어요.',
              guide='깃발 그림의 규칙대로 보석함의 모양 단추를 눌러요.'),
            O('exit', '구명보트 문', 'door', 820, 250, 140, 220, dict(c='파랑', sign='구명보트'),
              look='큰 열쇠 구멍과 숫자판이 있어요.',
              need='keyb', needMsg='문에 큰 열쇠 구멍이 있어요.', useMsg='보트 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(CLOCK_M + sum(n for _, n in GEMS)), '**시계의 몇 분**과 **보석 수**를 더해요. 두 자리 수를 만들어요.',
                      ['선장실 시계는 몇 시 몇 분이었나요? 긴바늘에서 5분씩 뛰어 세어요.', f'보석은 빨강 {GEMS[0][1]}개, 파랑 {GEMS[1][1]}개, 초록 {GEMS[2][1]}개예요.', f'{CLOCK_M} + {sum(n for _, n in GEMS)}를 계산해요. 일의 자리끼리 더하면 10이 돼요.'],
                      f'시계 {CLOCK_H}시 {CLOCK_M}분 → {CLOCK_M}, 보석 {GEMS[0][1]} + {GEMS[1][1]} + {GEMS[2][1]} = {sum(n for _, n in GEMS)} → {CLOCK_M} + {sum(n for _, n in GEMS)} = {CLOCK_M + sum(n for _, n in GEMS)}',
                      chk=lambda: CLOCK_M + sum(n for _, n in GEMS)),
              go='exit', after='구명보트 문이 열렸어요!', guide='두 조각을 합친 보트 열쇠를 쓰고, 시계와 보석 선반으로 비밀번호를 구해요.'),
        ]),
    ],
    flow=['mast', 'pscrap', 'parrot', 'rope', 'barrels', 'chest', 'cdraw', 'scope', 'wheel', 'cabin',
          'clock', 'gems', 'wardrobe', 'flagpic', 'jewel', 'kb1+kb2', 'exit'],
)
