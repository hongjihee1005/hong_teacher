"""수학 방탈출 · 롤러코스터 놀이공원 탈출 (추천 3~4학년 · 보통) — 형식은 rooms.py 머리말
3~4학년: 곱셈(두 자리×두 자리)·나눗셈(나머지)·시간(분·초)·세 자리 덧셈·뺄셈·분모가 같은 분수의 크기 비교·방향"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(모두 이야기 속 값)
CARS, SEAT = 6, 4                                     # 롤러코스터 열차 6칸, 칸마다 의자 4개
CCOL = ['빨강', '주황', '노랑', '초록', '파랑', '보라']
RUNS = 32                                             # 오늘 출발 횟수
SEATS_ALL = CARS * SEAT * RUNS                        # 768
RUNLOG = ['오늘 운행 기록', f'출발 횟수: {RUNS}번', '고장 없이 운행']
LAP = [('빨강', 2, 10), ('노랑', 0, 125), ('초록', 1, 58), ('파랑', 0, 140)]   # 열차마다 한 바퀴 걸린 시간 (분, 초)
def lab(m, s): return f'{m}분 {s}초' if m else f'{s}초'
def sec(m, s): return m * 60 + s
LAP_ITEMS = [{'c': c, 'label': lab(m, s)} for c, m, s in LAP]
BUMP = ['빨강', '노랑', '초록', '파랑', '주황', '보라', '분홍']   # 범퍼카장의 범퍼카 7대
TOK = 95                                              # 토큰 통의 토큰
MAP = dict(n=5, m=6, start=[0, 4], path='UURRRUURRDDD', block=[[1, 3], [2, 3], [1, 1], [2, 0], [4, 2], [4, 1], [3, 4], [4, 4]], sl='출발', gl='충전')
CLAW = [('☆', 3), ('○', 5), ('△', 2), ('□', 7)]       # 인형 뽑기 칸마다 8칸 중 찬 칸
DEN = 8
CLAW_ITEMS = [{'s': s, 'k': k, 'c': c} for (s, k), c in zip(CLAW, ['노랑', '분홍', '초록', '하늘'])]
PRICE = {'곰 인형': 365, '공': 148, '별 핀': 279, '사탕 병': 96}
CARD = 900                                            # 포인트 카드 한 장(세 자리 수 뺄셈이 되게)
PRICE_LINES = ['기념품 값 (포인트)'] + [f'{k} {v}점' for k, v in PRICE.items()] + [f'포인트 카드 1장 = {CARD}점']
BASKET = [{'k': 'bear', 'c': '갈색', 'n': 1}, {'k': 'star', 'c': '노랑', 'n': 1}]   # 바구니: 곰 인형 1, 별 핀 1
BASKET_SUM = PRICE['곰 인형'] + PRICE['별 핀']          # 644

ROOM = dict(
    id='park-mid', title='롤러코스터 놀이공원 탈출', ico='🎡', acc='#C7366E',
    rec='추천 3학년 · 곱셈·나눗셈(나머지)·시간(분과 초)·세 자리 덧셈과 뺄셈·분수의 크기 비교·방향',
    intro='롤러코스터를 타려고 줄을 서 있는데 갑자기 불이 꺼지며 탑승장 문이 잠겼어요! 탑승장·범퍼카장·기념품 가게를 지나 정문으로 빠져나가요.',
    story=['롤러코스터 탑승장에서 차례를 기다리던 중, 갑자기 "정전! 정전!" 하는 방송이 울렸어요.', '쿵! 탑승장 문과 놀이공원 정문이 한꺼번에 잠겨 버렸어요.', '놀이기구마다 숨은 단서를 모아 정문까지 빠져나가요!'],
    outro='정문이 활짝 열리고 놀이공원에 다시 불이 들어왔어요! 롤러코스터가 "덜컹덜컹" 첫 출발을 해요. 놀이공원을 탈출했어요!',
    items={'card': dict(nm='직원 카드', k='card', c='#C7366E', de='롤러코스터 조종판에 대는 직원 카드예요'),
           'bat': dict(nm='충전 건전지', k='battery', c='#3DA35D', de='범퍼카를 움직일 수 있는 건전지예요'),
           'keyb': dict(nm='정문 열쇠', k='key', c='#8A5BC9', de='보라색 큰 열쇠예요. 정문에 맞을까요?'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#8A5BC9', de='큰 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#8A5BC9', de='큰 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kh1', b='kh2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **정문 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='롤러코스터 탑승장', bg=dict(wall='#ECE4F8', floor='#A99EC0', deco='stripe'), objs=[
            O('coaster', '롤러코스터', 'pkCoaster', 20, 20, 560, 260, dict(n=CARS, seat=SEAT, cs=CCOL), keep=True,
              look='멈춰 선 롤러코스터 열차예요. 열차가 몇 칸인지, 한 칸에 의자가 몇 개인지 세어 볼까요?',
              lookFig=F('pkCoaster', 520, 240, n=CARS, seat=SEAT, cs=CCOL),
              guide='롤러코스터 열차의 칸 수와 한 칸의 의자 수를 세어 보세요.'),
            O('runlog', '운행 기록판', 'board', 600, 20, 230, 150, dict(lines=RUNLOG, fs=21), keep=True,
              look='오늘 롤러코스터를 몇 번 출발시켰는지 적은 기록판이에요.', lookFig=F('board', 300, 160, lines=RUNLOG, fs=24),
              guide='운행 기록판을 읽고 수첩에 남겨 두세요.'),
            O('laps', '한 바퀴 시간표', 'pkPennant', 600, 195, 230, 165, dict(items=LAP_ITEMS, title='열차 한 바퀴 시간'), keep=True,
              look='열차 네 대가 한 바퀴를 도는 데 걸린 시간이에요. 어떤 것은 **분과 초**로, 어떤 것은 **초**로만 적혀 있어요.',
              lookFig=F('pkPennant', 380, 200, items=LAP_ITEMS, title='열차 한 바퀴 시간'),
              guide='한 바퀴 시간표를 수첩에 남겨 두세요. 분과 초가 섞여 있어요.'),
            O('locker', '직원 보관함', 'cabinet', 850, 140, 110, 230, dict(label='직원', c='#C9B4E0'),
              lock=Lk('num', str(SEATS_ALL), '보관함 쪽지: **오늘 롤러코스터에 탈 수 있었던 자리는 모두 몇 개일까요?** 숫자 세 개를 맞춰요.',
                      ['롤러코스터 열차의 칸 수와 한 칸의 의자 수, 그리고 운행 기록판의 출발 횟수가 필요해요.', f'열차 한 번에 {CARS} × {SEAT} = {CARS * SEAT}자리예요.', f'{CARS * SEAT}자리씩 {RUNS}번 출발했으니 {CARS * SEAT} × {RUNS}를 계산해요.'],
                      f'한 번에 {CARS} × {SEAT} = {CARS * SEAT}자리, {CARS * SEAT} × {RUNS} = {SEATS_ALL}', chk=lambda: CARS * SEAT * RUNS),
              give=['card'], after='보관함이 열렸어요! 안에 **직원 카드**와 **범퍼카 길 지도**가 있어요. 지도의 빨간 점이 범퍼카가 갈 길이에요.',
              afterFig=F('map', 320, 260, **MAP), guide='롤러코스터와 운행 기록판의 수로 직원 보관함을 열어 보세요.'),
            O('panel', '출발 조종판', 'panel', 40, 400, 200, 140, dict(colors=['빨강', '노랑', '초록', '파랑'], label='빠른 것부터', done='문 열림'),
              need='card', needMsg='출발 조종판이 잠겨 있어요. **카드를 대는 곳**이 있어요.', useMsg='직원 카드를 댔더니 색깔 단추에 불이 들어왔어요!',
              lock=Lk('color', [c for c, m, s in sorted(LAP, key=lambda t: sec(t[1], t[2]))], '조종판 쪽지: **한 바퀴 걸린 시간이 짧은 열차부터** 그 열차의 색 단추를 차례로 눌러요.',
                      ['한 바퀴 시간표에는 \'분과 초\'와 \'초\'가 섞여 있어요. 모두 초로 바꿔 보세요.', '1분 = 60초예요. 2분 10초 = 120초 + 10초, 1분 58초 = 60초 + 58초.', '130초, 125초, 118초, 140초를 짧은 것부터 늘어놓아요.'],
                      '빨강 2분 10초 = 130초, 노랑 125초, 초록 1분 58초 = 118초, 파랑 140초 → 초록 → 노랑 → 빨강 → 파랑',
                      chk=lambda: [c for c, m, s in sorted(LAP, key=lambda t: sec(t[1], t[2]))], opts=['빨강', '노랑', '초록', '파랑']),
              after='조종판에서 "정비 통로 문 열림" 소리가 났어요. 탑승장 바닥 쪽에 **정비 통로 문**이 나타났어요!',
              guide='직원 카드를 조종판에 대고, 한 바퀴 시간을 초로 바꿔 짧은 것부터 눌러 보세요.'),
            O('sdoor', '정비 통로 문', 'door', 300, 310, 130, 220, dict(c='초록', sign='범퍼카장'), req=['panel'], go='b',
              look='조종판이 열어 준 정비 통로 문이에요.', after='통로 끝에 범퍼카장이 보여요.', guide='새로 생긴 정비 통로 문으로 범퍼카장에 가 보세요.'),
        ]),
        dict(id='b', nm='범퍼카장', bg=dict(wall='#FFE9D6', floor='#8B95A3', deco='tile'), objs=[
            O('arena', '범퍼카 경기장', 'pkArena', 20, 30, 460, 330, dict(cars=BUMP), keep=True,
              look='울타리 안에 범퍼카들이 멈춰 있어요. 울타리 안의 범퍼카는 모두 몇 대일까요? (울타리 밖에 나와 있는 범퍼카 1번은 세지 않아요.)', lookFig=F('pkArena', 420, 300, cars=BUMP),
              guide='범퍼카 경기장의 범퍼카를 세어 보세요. 경기장 구석도 잘 보세요.'),
            O('ascrap', '경기장 구석 쪽지', 'scrap', 404, 280, 48, 34, dict(t='?'), in_='arena', keep=True,
              look=f'경기장 구석에 아주 작은 쪽지가 끼어 있어요! "인형 뽑기 기계 속 작은 서랍 = **오늘 롤러코스터에 탈 수 있었던 자리 수 − 토큰 통의 토큰 수**"',
              guide='범퍼카 경기장을 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
            O('toksign', '토큰 통 안내판', 'sign', 540, 60, 220, 100, dict(lines=['토큰 통', f'토큰 {TOK}개'], c='#C7366E'), keep=True,
              look=f'토큰 통 안내판이에요. "토큰 통에 토큰이 **{TOK}개** 들어 있어요."', lookFig=F('sign', 260, 110, lines=['토큰 통', f'토큰 {TOK}개'], c='#C7366E'),
              guide='토큰 통 안내판을 읽고 수첩에 남겨 두세요.'),
            O('tokbox', '토큰 나눔 상자', 'box', 530, 390, 170, 140, dict(c='주황', lock=True, label='토큰'),
              lock=Lk('num', f'{TOK // len(BUMP)}{TOK % len(BUMP)}', f'상자 쪽지: 토큰 통의 토큰을 **경기장의 범퍼카에 똑같이 나누어** 넣어요. 비밀번호 = (한 대에 넣는 토큰 수)(남는 토큰 수)',
                      ['토큰 통 안내판에서 토큰 수를, 경기장 울타리 안에서 범퍼카 수를 찾아요.', f'토큰 {TOK}개를 범퍼카 {len(BUMP)}대에 나누어요: {TOK} ÷ {len(BUMP)}', f'{len(BUMP)} × 13 = {len(BUMP) * 13}이고, {TOK} − {len(BUMP) * 13}은?'],
                      f'{TOK} ÷ {len(BUMP)} = {TOK // len(BUMP)} … {TOK % len(BUMP)} → 한 대에 {TOK // len(BUMP)}개, 남는 것 {TOK % len(BUMP)}개 → {TOK // len(BUMP)}{TOK % len(BUMP)}',
                      chk=lambda: (lambda q, r: f'{q}{r}')(*divmod(TOK, len(BUMP)))),
              give=['bat'], after='상자가 열렸어요! 토큰 사이에 **충전 건전지**가 들어 있어요. 건전지에 \'범퍼카 1번\'이라고 적혀 있어요.',
              guide='토큰 수를 범퍼카 수로 나누어 토큰 나눔 상자를 열어 보세요.'),
            O('bumper', '범퍼카 1번', 'pkBumper', 730, 340, 170, 200, dict(c='빨강', label='1'),
              need='bat', needMsg='범퍼카 1번의 화면이 꺼져 있어요. 건전지 넣는 곳이 비어 있어요.', useMsg='건전지를 넣었더니 화면이 켜졌어요! "갈 길을 알려 주세요."',
              lock=Lk('dir', segs(MAP['path']), '범퍼카 화면이에요. 직원 보관함에서 찾은 **범퍼카 길 지도**를 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩의 범퍼카 길 지도를 열어 보세요. \'출발\'에서 빨간 점을 따라가요.', '처음에는 위로 2칸, 그다음은 오른쪽으로 3칸 가요.', '위 → 오른쪽 → 위 → 오른쪽 → 마지막은? 화살표는 모두 5개예요.'],
                      '위로 2칸, 오른쪽으로 3칸, 위로 2칸, 오른쪽으로 2칸, 아래로 3칸 가요. 누를 차례: ↑ → ↑ → ↓', chk=lambda: segs('UURRRUURRDDD')),
              after='부릉! 범퍼카가 지도대로 달려 충전기에 쿵 닿았어요. 벽이 열리며 **기념품 가게 문**이 나타났어요!',
              guide='충전 건전지를 범퍼카 1번에 넣고, 지도대로 길을 알려 주세요.'),
            O('sdoor2', '기념품 가게 문', 'door', 900, 160, 90, 220, dict(c='노랑', sign='가게'), req=['bumper'], go='c',
              look='범퍼카가 찾아 준 기념품 가게 문이에요.', after='문 너머에 기념품 가게가 보여요.', guide='새로 생긴 문으로 기념품 가게에 가 보세요.'),
        ]),
        dict(id='c', nm='기념품 가게', bg=dict(wall='#FDF1DA', floor='#C9A27A', deco='brick'), objs=[
            O('claw', '인형 뽑기 기계', 'pkClaw', 40, 40, 240, 330, dict(items=CLAW_ITEMS, den=DEN, lock=True),
              lock=Lk('shape', [s for s, k in sorted(CLAW, key=lambda t: -t[1])], f'기계 쪽지: 칸마다 인형이 들어 있는 만큼 색칠되어 있어요. 칸마다 똑같이 {DEN}칸으로 나누어져 있으니, 색칠한 부분을 분수로 나타낼 수 있어요. **들어 있는 양이 많은 칸부터** 그 칸의 모양을 차례로 눌러요.',
                      ['칸마다 색칠된 작은 칸을 세어 분수로 나타내 보세요.', '칸마다 8칸 중 몇 칸이 색칠되었는지 세면 분모가 8인 분수가 돼요.', '분모가 같은 분수는 분자가 클수록 큰 수예요.'],
                      '□ 7/8 > ○ 5/8 > ☆ 3/8 > △ 2/8', chk=lambda: [s for s, k in sorted(CLAW, key=lambda t: -Fraction(t[1], DEN))], opts=['○', '△', '□', '☆']),
              give=['kh1'], after='집게가 내려와 인형 하나를 집어 올렸어요. 인형 품에 보라색 **열쇠 손잡이**가 꼭 안겨 있어요! 그런데 손잡이만 있고 몸통이 없어요. 기계 아래쪽에는 작은 서랍도 보여요.',
              guide='인형 뽑기 기계의 칸마다 색칠된 양을 분수로 비교해 보세요.'),
            O('cdraw', '뽑기 기계 속 작은 서랍', 'drawer', 85, 290, 70, 36, dict(c='#8A5BC9', lock=True), in_='claw',
              lock=Lk('num', str(SEATS_ALL - TOK), '기계 아래쪽에 아주 작은 서랍이 숨어 있어요! 숫자 자물쇠예요. 범퍼카 경기장 구석 쪽지에 적힌 대로 계산해요.',
                      ['범퍼카 경기장을 크게 보면 구석에 작은 쪽지가 있어요.', f'롤러코스터에 탈 수 있었던 자리는 {SEATS_ALL}개, 토큰은 {TOK}개였어요.', f'{SEATS_ALL} − {TOK}를 받아내림에 조심해서 계산해요.'],
                      f'{SEATS_ALL} − {TOK} = {SEATS_ALL - TOK}', chk=lambda: CARS * SEAT * RUNS - TOK),
              give=['kh2'], after='작은 서랍 안에 보라색 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='인형 뽑기 기계를 연 뒤 아래쪽의 작은 서랍을 눌러 보세요.'),
            O('price', '기념품 값표', 'poster', 310, 30, 270, 210, dict(lines=PRICE_LINES, fs=20), keep=True,
              look='기념품마다 몇 포인트인지 적힌 값표예요. 맨 아래에 포인트 카드 이야기도 있어요.', lookFig=F('poster', 320, 240, lines=PRICE_LINES, fs=24),
              guide='기념품 값표를 수첩에 남겨 두세요.'),
            O('basket', '계산대 바구니', 'counter', 320, 350, 280, 190, dict(items=BASKET, c='#F4C6D6'), keep=True,
              look='계산대 위 바구니에 누군가 고른 기념품이 담겨 있어요. **곰 인형**과 **별 핀**이에요.', lookFig=F('counter', 280, 150, items=BASKET, c='#F4C6D6'),
              guide='계산대 바구니에 무엇이 담겨 있는지 보세요.'),
            O('exit', '정문', 'pkGate', 790, 150, 180, 230, dict(sign='정문', c='보라'),
              need='keyb', needMsg='정문 쇠창살에 큰 열쇠 구멍이 있어요.', useMsg='정문 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(CARD - BASKET_SUM), f'숫자판 위 글: **포인트 카드 한 장으로 바구니의 기념품을 모두 사면, 카드에 남는 점수**가 비밀번호예요.',
                      ['값표에서 바구니에 담긴 곰 인형과 별 핀의 값을 찾아요. 포인트 카드 한 장이 몇 점인지도 값표에 있어요.', f'{PRICE["곰 인형"]} + {PRICE["별 핀"]} = {BASKET_SUM}', f'{CARD} − {BASKET_SUM}는? 받아내림에 조심해요.'],
                      f'곰 인형 {PRICE["곰 인형"]} + 별 핀 {PRICE["별 핀"]} = {BASKET_SUM}, {CARD} − {BASKET_SUM} = {CARD - BASKET_SUM}',
                      chk=lambda: CARD - (PRICE['곰 인형'] + PRICE['별 핀'])),
              go='exit', after='정문이 열렸어요!', guide='정문 열쇠를 정문에 쓰고, 값표와 바구니로 남는 점수를 계산해요.'),
        ]),
    ],
    flow=['coaster', 'runlog', 'laps', 'locker', 'panel', 'sdoor', 'arena', 'ascrap', 'toksign', 'tokbox', 'bumper', 'sdoor2',
          'claw', 'cdraw', 'kh1+kh2', 'price', 'basket', 'exit'],
)
