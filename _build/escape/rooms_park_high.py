"""수학 방탈출 · 관람차 놀이공원 탈출 (추천 6학년) — 형식은 rooms.py 머리말
5~6학년: 원주(3.14)·비율과 백분율·최소공배수·비례배분·약분·평면도형과 원의 넓이·평균·방향"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(모두 이야기 속 값)
WHEEL = ['빨강', '노랑', '파랑', '초록', '노랑', '빨강', '파랑', '노랑', '초록', '빨강', '파랑', '노랑']   # 관람차 곤돌라 12칸
CARS = len(WHEEL)                                    # 12
REDS = WHEEL.count('빨강')                            # 3
DIAM = 40                                            # 관람차 지름 40 m(이야기 속 값)
PI = Fraction(314, 100)                              # 원주율 3.14
def circ(): return DIAM * PI                         # 125.6
RATE = [('빨강', '3/4', Fraction(3, 4)), ('노랑', '0.7', Fraction(7, 10)), ('초록', '68%', Fraction(68, 100)), ('파랑', '18/25', Fraction(18, 25))]
RATE_ITEMS = [{'c': c, 'label': l} for c, l, _ in RATE]
DRUM, HORN = 6, 8                                    # 큰북은 6초마다, 나팔은 8초마다
CANDY = 140                                          # 퍼레이드 사탕
FLAG = [('△', '세모 깃발: 밑변 8 cm, 높이 6 cm', Fraction(8 * 6, 2)),
        ('□', '네모 깃발: 한 변 5 cm인 정사각형', Fraction(5 * 5)),
        ('◇', '마름모 깃발: 두 대각선 8 cm, 7 cm', Fraction(8 * 7, 2)),
        ('○', '동그라미 깃발: 반지름 3 cm', 3 * 3 * PI)]
FLAG_LINES = ['퍼레이드 깃발 크기'] + [t for _, t, _ in FLAG]
MAP = dict(n=5, m=7, start=[0, 4], path='RRRUURRUULL', block=[[1, 3], [2, 3], [4, 3], [4, 1], [2, 1], [2, 0], [6, 2], [6, 4], [0, 1]], sl='입구', gl='출구')
WAIT = [('바이킹', 18), ('회전컵', 25), ('관람차', 32), ('범퍼카', 21), ('유령의 집', 29)]   # 대기 시간(분)
WAIT_LINES = ['오늘의 대기 시간 (분)', '바이킹 18 · 회전컵 25', '관람차 32 · 범퍼카 21', '유령의 집 29']
def avg(): return Fraction(sum(v for _, v in WAIT), len(WAIT))
def red_frac(): return Fraction(WHEEL.count('빨강'), len(WHEEL))

ROOM = dict(
    id='park-high', title='관람차 놀이공원 탈출', ico='🎡', acc='#7E45C8',
    rec='추천 6학년 · 원주·비율과 백분율·최소공배수·비례배분·약분·넓이·평균·방향',
    intro='저녁 퍼레이드를 준비하던 놀이공원에서 관람차가 멈추고 문이 모두 잠겼어요! 관람차 승강장·퍼레이드 창고·유령의 집 앞을 지나 정문을 열어요.',
    story=['해 질 무렵, 관람차에서 내려 퍼레이드를 기다리고 있었어요.', '그때 "지지직―" 소리와 함께 관람차가 멈추고, 놀이공원 정문이 철컥 잠겨 버렸어요.', '퍼레이드 창고와 유령의 집에 숨은 단서를 이어 정문을 열어요!'],
    outro='정문이 열리는 순간, 하늘에서 퍼레이드 불꽃이 펑펑 터졌어요! 관람차에도 다시 불이 들어왔어요. 놀이공원을 탈출했어요!',
    items={'card': dict(nm='창고 출입 카드', k='card', c='#7E45C8', de='퍼레이드 창고 문에 대는 카드예요'),
           'bat': dict(nm='퍼레이드 차 건전지', k='battery', c='#3DA35D', de='퍼레이드 차를 켤 수 있어요'),
           'coin': dict(nm='유령의 집 동전', k='coin', c='#9AA0A8', de='유령의 집 입구 기계에 넣는 동전이에요'),
           'keyb': dict(nm='정문 열쇠', k='key', c='#C9A24B', de='금색 큰 열쇠예요. 정문에 맞을까요?'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#C9A24B', de='금색 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#C9A24B', de='금색 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kh1', b='kh2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **정문 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='관람차 승강장', bg=dict(wall='#D5DDF5', floor='#B3ABC4', deco='stars'), objs=[
            O('wheel', '관람차', 'pkWheel', 20, 10, 340, 370, dict(cars=WHEEL, label=f'지름 {DIAM} m'), keep=True,
              look=f'멈춰 선 관람차예요. 곤돌라는 모두 몇 칸이고, 그중 빨간 곤돌라는 몇 칸일까요? 받침의 안내판에는 **지름 {DIAM} m**라고 적혀 있어요(이야기 속 값).',
              lookFig=F('pkWheel', 330, 360, cars=WHEEL, label=f'지름 {DIAM} m'),
              guide='관람차의 곤돌라 수와 색, 지름을 살펴보세요. 받침 구석도 잘 보세요.'),
            O('wscrap', '관람차 받침 쪽지', 'scrap', 8, 296, 48, 34, dict(t='?'), in_='wheel', keep=True,
              look='관람차 받침 구석에 아주 작은 쪽지가 끼어 있어요! "사탕 상자 속 작은 서랍 = **(빨간 곤돌라 수)/(전체 곤돌라 수)를 기약분수로 나타낸 분자와 분모**, 그 뒤에 **이 비율을 백분율로 나타낸 수**를 이어 쓴 수"',
              guide='관람차를 크게 보고 받침 구석의 작은 쪽지를 찾아보세요.'),
            O('booth', '관람차 매표소', 'pkBooth', 390, 60, 200, 320, dict(sign='관람차 표', a='보라', lines=['원주율 3.14']),
              lock=Lk('num', str(circ() * 10), f'매표소 화면: **관람차가 한 바퀴 돌 때 곤돌라 하나가 움직이는 거리**는 몇 m일까요? (원주율은 3.14) 답에서 소수점을 빼고 숫자 네 개를 맞춰요.',
                      ['곤돌라는 관람차 바퀴의 둘레를 따라 한 바퀴 돌아요. 원의 둘레(원주)를 구해요.', '원주 = 지름 × 원주율이에요. 관람차 받침에 지름이 적혀 있어요.', f'{DIAM} × 3.14 = ?'],
                      f'원주 = {DIAM} × 3.14 = {float(circ())} (m) → 소수점을 빼면 {circ() * 10}', chk=lambda: DIAM * 314 // 10),
              give=['card'], after='삑! 매표소 창구가 열리고 **창고 출입 카드**가 나왔어요. 카드에 \'퍼레이드 창고\'라고 적혀 있어요.',
              guide='관람차의 지름으로 원주를 구해 매표소를 열어 보세요.'),
            O('rates', '탑승률 깃발판', 'pkPennant', 620, 30, 240, 180, dict(items=RATE_ITEMS, title='오늘의 탑승률'), keep=True,
              look='놀이기구 네 곳의 오늘 탑승률이에요. 분수, 소수, 백분율로 섞여 적혀 있어요.',
              lookFig=F('pkPennant', 360, 200, items=RATE_ITEMS, title='오늘의 탑승률'),
              guide='탑승률 깃발판을 수첩에 남겨 두세요. 수의 모양이 서로 달라요.'),
            O('rpanel', '조명 조종판', 'panel', 630, 240, 170, 130, dict(colors=['빨강', '노랑', '초록', '파랑'], label='낮은 것부터', done='불 켜짐'),
              lock=Lk('color', [c for c, _, v in sorted(RATE, key=lambda t: t[2])], '조종판 쪽지: **탑승률이 낮은 놀이기구부터** 그 깃발 색 단추를 차례로 눌러요.',
                      ['분수·소수·백분율을 한 가지 모양으로 바꿔 비교해요. 모두 백분율로 바꿔 볼까요?', '3/4 = 0.75 = 75%, 0.7 = 70%, 18/25 = 72/100 = 72%', '68% < 70% < 72% < 75%'],
                      '빨강 3/4 = 75%, 노랑 0.7 = 70%, 초록 68%, 파랑 18/25 = 72% → 초록 → 노랑 → 파랑 → 빨강',
                      chk=lambda: [c for c, _, v in sorted(RATE, key=lambda t: t[2])], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kh1'], after='승강장 조명이 차례로 켜지더니, 조종판 아래 칸이 열리며 금색 **열쇠 손잡이**가 굴러 나왔어요! 그런데 손잡이만 있고 몸통이 없어요.',
              guide='탑승률을 같은 모양으로 바꿔 낮은 것부터 조명 조종판에 눌러 보세요.'),
            O('bdoor', '퍼레이드 창고 문', 'door', 860, 170, 120, 210, dict(c='보라', sign='창고'),
              need='card', needMsg='퍼레이드 창고 문이 잠겨 있어요. 손잡이 옆에 **카드를 대는 곳**이 있어요.', useMsg='카드를 댔더니 삑! 문이 열렸어요.',
              go='b', after='문 너머에 퍼레이드 창고가 보여요.', guide='창고 출입 카드를 퍼레이드 창고 문에 대 보세요.'),
        ]),
        dict(id='b', nm='퍼레이드 창고', bg=dict(wall='#F4E6D2', floor='#9C8468', deco='brick'), objs=[
            O('drum', '큰북 깃발', 'banner', 40, 30, 110, 170, dict(c='빨강', n=f'{DRUM}초'), keep=True,
              look=f'퍼레이드 연습 깃발이에요. "**큰북**은 {DRUM}초마다 한 번씩 쿵 울려요."',
              guide='큰북 깃발을 읽고 수첩에 남겨 두세요.'),
            O('horn', '나팔 깃발', 'banner', 170, 30, 110, 170, dict(c='파랑', n=f'{HORN}초'), keep=True,
              look=f'퍼레이드 연습 깃발이에요. "**나팔**은 {HORN}초마다 한 번씩 빰 울려요."',
              guide='나팔 깃발을 읽고 수첩에 남겨 두세요.'),
            O('flagsign', '깃발 크기표', 'poster', 310, 30, 330, 200, dict(lines=FLAG_LINES, fs=17), keep=True,
              look='퍼레이드 차에 꽂을 깃발 네 가지의 크기표예요.', lookFig=F('poster', 400, 220, lines=FLAG_LINES, fs=21),
              guide='깃발 크기표를 수첩에 남겨 두세요.'),
            O('music', '음악 상자', 'box', 30, 400, 190, 130, dict(c='빨강', lock=True, label='음악'),
              lock=Lk('num', f'{lcm(DRUM, HORN)}{2 * lcm(DRUM, HORN)}', '음악 상자 쪽지: 큰북과 나팔이 **처음에 함께** 울렸어요. 그 뒤 **두 소리가 다시 함께 울리는 때**를 빠른 것부터 두 번 찾아 몇 초 뒤인지 이어 써요.',
                      ['큰북 깃발과 나팔 깃발에서 몇 초마다 울리는지 찾아요.', f'큰북은 {DRUM}의 배수, 나팔은 {HORN}의 배수인 때에 울려요. 두 수의 공배수를 찾아요.', f'{DRUM}과 {HORN}의 최소공배수를 구하고, 그다음 공배수도 구해요.'],
                      f'{DRUM}과 {HORN}의 최소공배수 {lcm(DRUM, HORN)} → {lcm(DRUM, HORN)}초 뒤, {2 * lcm(DRUM, HORN)}초 뒤 → {lcm(DRUM, HORN)}{2 * lcm(DRUM, HORN)}',
                      chk=lambda: ''.join(str(t) for t in [t for t in range(1, 100) if t % DRUM == 0 and t % HORN == 0][:2])),
              give=['bat'], after='상자가 열리며 퍼레이드 음악이 흘러나와요! 안에 **퍼레이드 차 건전지**가 들어 있어요.',
              guide='큰북과 나팔이 다시 함께 울리는 때로 음악 상자를 열어 보세요.'),
            O('candy', '사탕 상자', 'box', 250, 400, 180, 130, dict(c='분홍', lock=True, label='사탕'),
              lock=Lk('num', ''.join(str(CANDY * k // (DRUM + HORN)) for k in (DRUM, HORN)), f'사탕 상자 쪽지: 사탕 {CANDY}개를 큰북 차와 나팔 차에 **큰북이 울리는 간격 : 나팔이 울리는 간격**의 비로 나누어 실어요. 비밀번호 = (큰북 차의 사탕 수)(나팔 차의 사탕 수)',
                      ['큰북 깃발과 나팔 깃발에서 간격을 찾아 비를 만들어요.', f'{DRUM} : {HORN}은 {DRUM // gcd(DRUM, HORN)} : {HORN // gcd(DRUM, HORN)}와 같아요. 전체를 {DRUM // gcd(DRUM, HORN) + HORN // gcd(DRUM, HORN)}로 보고 비례배분해요.', f'큰북 차 = {CANDY} × {DRUM // gcd(DRUM, HORN)}/{DRUM // gcd(DRUM, HORN) + HORN // gcd(DRUM, HORN)}, 나팔 차 = {CANDY} × {HORN // gcd(DRUM, HORN)}/{DRUM // gcd(DRUM, HORN) + HORN // gcd(DRUM, HORN)}'],
                      f'{DRUM} : {HORN} = 3 : 4 → 큰북 차 {CANDY} × 3/7 = {CANDY * 3 // 7}, 나팔 차 {CANDY} × 4/7 = {CANDY * 4 // 7} → {CANDY * 3 // 7}{CANDY * 4 // 7}',
                      chk=lambda: ''.join(str(Fraction(CANDY * k, DRUM + HORN)) for k in (DRUM, HORN))),
              give=['coin'], after='상자가 열렸어요! 사탕 사이에 은색 **유령의 집 동전**이 섞여 있어요.',
              guide='큰북과 나팔의 간격의 비로 사탕을 나누어 사탕 상자를 열어 보세요.'),
            O('cdraw', '사탕 상자 속 작은 서랍', 'drawer', 120, 96, 56, 30, dict(c='#C9A24B', lock=True), in_='candy',
              lock=Lk('num', f'{red_frac().numerator}{red_frac().denominator}{red_frac() * 100}', '사탕 상자 안쪽에 아주 작은 서랍이 또 있어요! 숫자 자물쇠예요. 관람차 받침 쪽지에 적힌 대로 계산해요.',
                      ['관람차 승강장의 관람차를 크게 보면 받침 구석에 작은 쪽지가 있어요.', f'곤돌라는 모두 {CARS}칸, 빨간 곤돌라는 {REDS}칸이에요. {REDS}/{CARS}를 약분해요.', '기약분수의 분모를 100으로 만들면 백분율을 알 수 있어요.'],
                      f'{REDS}/{CARS} = {red_frac()} = 25/100 = {red_frac() * 100}% → 분자 {red_frac().numerator}, 분모 {red_frac().denominator}, {red_frac() * 100} → {red_frac().numerator}{red_frac().denominator}{red_frac() * 100}',
                      chk=lambda: (lambda f: f'{f.numerator}{f.denominator}{f * 100}')(Fraction(WHEEL.count('빨강'), len(WHEEL)))),
              give=['kh2'], after='작은 서랍 안에 금색 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='사탕 상자를 연 뒤 안쪽의 작은 서랍을 눌러 보세요.'),
            O('float', '퍼레이드 차', 'pkFloat', 460, 260, 370, 240, dict(slots=['?', '?', '?', '?'], label='퍼레이드'),
              need='bat', needMsg='퍼레이드 차가 꺼져 있어요. 건전지 넣는 곳이 비어 있어요.', useMsg='건전지를 넣었더니 퍼레이드 차에 불이 반짝 들어왔어요! 이제 깃발을 꽂을 차례예요.',
              lock=Lk('shape', [s for s, _, a in sorted(FLAG, key=lambda t: t[2])], '퍼레이드 차 쪽지: 깃발 크기표의 깃발 네 개를 **넓이가 작은 것부터** 차례로 꽂아요. 그 깃발의 모양을 눌러요.',
                      ['깃발 크기표를 보고 깃발마다 넓이를 구해요.', '삼각형 = 밑변 × 높이 ÷ 2, 마름모 = 한 대각선 × 다른 대각선 ÷ 2, 원 = 반지름 × 반지름 × 3.14', '△ 24, □ 25, ◇ 28, ○ 28.26 (cm²)'],
                      '△ 8 × 6 ÷ 2 = 24, □ 5 × 5 = 25, ◇ 8 × 7 ÷ 2 = 28, ○ 3 × 3 × 3.14 = 28.26 → △ □ ◇ ○',
                      chk=lambda: [s for s, _, a in sorted(FLAG, key=lambda t: t[2])], opts=['○', '△', '□', '◇']),
              after='깃발을 다 꽂자 퍼레이드 차가 창고 문 쪽으로 천천히 움직이며 **유령의 집 가는 문**을 열어 줬어요. 차 뒤에는 **유령의 집 길 지도**가 붙어 있어요.',
              afterFig=F('map', 340, 250, **MAP), guide='건전지를 퍼레이드 차에 넣고, 깃발 넓이를 구해 작은 것부터 꽂아 보세요.'),
            O('cdoor', '유령의 집 가는 문', 'door', 860, 170, 120, 210, dict(c='회색', sign='유령의 집'), req=['float'], go='c',
              look='퍼레이드 차가 열어 준 문이에요.', after='문 너머로 으스스한 유령의 집이 보여요.', guide='새로 열린 문으로 유령의 집 앞에 가 보세요.'),
        ]),
        dict(id='c', nm='유령의 집 앞', bg=dict(wall='#3E3858', floor='#5E5468', deco='stars'), objs=[
            O('haunt', '유령의 집', 'pkHaunt', 40, 60, 320, 320, dict(sign='유령의 집'),
              need='coin', needMsg='유령의 집 문이 잠겨 있어요. 왼쪽에 **동전 넣는 기계**가 있어요.', useMsg='동전을 넣었더니 "길을 알려 주면 문을 열어 줄게…" 하는 목소리가 들려요.',
              lock=Lk('dir', segs(MAP['path']), '유령의 집 기계예요. 퍼레이드 차에 붙어 있던 **유령의 집 길 지도**를 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩의 유령의 집 길 지도를 열어 보세요. \'입구\'에서 빨간 점을 따라가요.', '처음에는 오른쪽으로 3칸, 그다음은 위로 2칸 가요.', '→ ↑ → ↑ 다음 마지막에는 어느 쪽으로 꺾이나요?'],
                      '오른쪽으로 3칸, 위로 2칸, 오른쪽으로 2칸, 위로 2칸, 왼쪽으로 2칸 가요. 누를 차례: → ↑ → ↑ ←', chk=lambda: segs('RRRUURRUULL')),
              after='끼이익… 유령의 집 문이 열렸어요. 컴컴한 길을 지나 뒷문으로 나오니 **정문**이 바로 앞에 있어요!',
              guide='유령의 집 동전을 넣고, 퍼레이드 차의 지도대로 길을 알려 주세요.'),
            O('screen', '대기 시간 전광판', 'screen', 400, 40, 300, 210, dict(lines=WAIT_LINES, fs=21), keep=True,
              look='놀이기구 다섯 곳의 오늘 대기 시간이 **분** 단위로 나오는 전광판이에요.', lookFig=F('screen', 340, 220, lines=WAIT_LINES, fs=23),
              guide='대기 시간 전광판을 수첩에 남겨 두세요.'),
            O('exit', '정문', 'pkGate', 760, 150, 200, 230, dict(sign='정문', c='보라'), req=['haunt'],
              need='keyb', needMsg='정문 쇠창살에 큰 열쇠 구멍이 있어요.', useMsg='정문 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', f'{avg()}{CARS}', '숫자판 위 글: 비밀번호 네 자리 = (전광판에 나온 놀이기구 다섯 곳의 **대기 시간의 평균**, 분)(관람차의 **곤돌라 수**)',
                      ['평균 = 자료 값을 모두 더한 수 ÷ 자료의 수예요.', '18 + 25 + 32 + 21 + 29 = 125', f'125 ÷ 5 = ?, 관람차의 곤돌라는 {CARS}칸이었어요.'],
                      f'(18 + 25 + 32 + 21 + 29) ÷ 5 = 125 ÷ 5 = {avg()}, 곤돌라 {CARS}칸 → {avg()}{CARS}',
                      chk=lambda: f'{Fraction(sum(v for _, v in WAIT), len(WAIT))}{len(WHEEL)}'),
              go='exit', after='정문이 열렸어요!', guide='정문 열쇠를 정문에 쓰고, 대기 시간의 평균과 곤돌라 수로 비밀번호를 맞춰요.'),
        ]),
    ],
    flow=['wheel', 'wscrap', 'booth', 'rates', 'rpanel', 'bdoor', 'drum', 'horn', 'music', 'candy', 'cdraw', 'flagsign', 'float', 'cdoor',
          'haunt', 'screen', 'kh1+kh2', 'exit'],
)
