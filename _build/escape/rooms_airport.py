"""수학 방탈출 · 공항 탈출 (추천 4학년 · 소수의 덧셈·큰 수·세 자리×두 자리·막대그래프·삼각형과 사각형의 각·시간 계산·나눗셈·방향) — 형식은 rooms.py 머리말"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(편명·시각·무게·손님 수·사람 수는 모두 이야기 속 값)
FLIGHTS = [('HJ 302', '부산', (10, 15), (11, 10), 7), ('HJ 504', '제주', (10, 40), (11, 55), 12), ('HJ 811', '광주', (11, 5), (12, 0), 9)]
def hm(t): return f'{t[0]}:{t[1]:02d}'
FIDS = [[f, d, hm(a), hm(b), f'{g}번'] for f, d, a, b, g in FLIGHTS]
OURS = FLIGHTS[1]                                        # 우리가 탈 HJ 504편
FLY = (OURS[3][0] * 60 + OURS[3][1]) - (OURS[2][0] * 60 + OURS[2][1])   # 75분 = 1시간 15분
BAGS = [1485, 967]                                       # 가방 무게(0.01 kg 단위): 14.85 kg, 9.67 kg
def kg(v): return f'{v // 100}.{v % 100:02d}'
ADS = [('빨강', '하늘 항공', 304500000), ('파랑', '구름 항공', 340500000), ('초록', '바람 항공', 300450000), ('노랑', '무지개 항공', 345000000)]
ADS_ORDER = [c for _, c in sorted(((n, c) for c, _, n in ADS), reverse=True)]
GATES = [7, 9, 12, 15]
WAITERS = [40, 65, 75, 50]                               # 탑승구 앞 기다리는 사람(막대그래프)
LINE = 8                                                 # 한 줄에 8명
MY_WAIT = WAITERS[GATES.index(OURS[4])]                  # 12번 탑승구 75명
ROWS = -(-MY_WAIT // LINE)                               # 남는 사람도 한 줄 → 10줄
CART_R, CART_C, JUICE = 3, 4, 135                        # 기내식 수레 3칸 × 4상자, 한 상자 주스 135병
CONSOLE = [('○', [70, 45, None]), ('△', [40, 40, None]), ('□', [90, 80, 110, None]), ('☆', [55, 35, None])]
def miss(a): return 180 * (len(a) - 2) - sum(x for x in a if x is not None)
CON_ORDER = [s for _, s in sorted(((miss(a), s) for s, a in CONSOLE), reverse=True)]
MAP = dict(n=4, m=6, start=[0, 0], path='DDRRRUURRD', block=[[1, 0], [1, 1], [2, 1], [4, 2], [4, 3]], sl='탑승구', gl='활주로')
ADS_P = dict(items=[{'c': c, 'nm': nm, 'n': str(n)} for c, nm, n in ADS], title='올해 태운 손님 수 (이야기 속 수)')
BARS_P = dict(labels=[f'{g}번' for g in GATES], vals=WAITERS, max=80, step=5, lab=10, title='탑승구 앞에서 기다리는 사람 수', unit='명')

ROOM = dict(
    id='airport', title='공항 탈출', ico='✈️', acc='#2F6FB8',
    rec='추천 4학년 · 소수의 덧셈·큰 수·세 자리×두 자리·막대그래프·삼각형과 사각형의 각·시간 계산·나눗셈·방향',
    intro='제주로 가는 HJ 504편을 기다리다 공항 출국장에 갇혔어요! 출국장·탑승구·관제탑을 지나며 단서를 모아 비행기를 활주로로 안내해요.',
    story=['가족 여행 날, 제주로 가는 HJ 504편을 타려고 공항 출국장에 왔어요.',
           '그런데 쿵! 정전과 함께 출국장 문이 모두 닫히고 자물쇠가 철컥 걸렸어요.',
           '단서를 모아 관제탑까지 가서, 무전으로 우리 비행기를 활주로로 안내해요!'],
    outro='"HJ 504편, 이륙 준비 완료!" 무전이 울리자 관제탑 문이 열리고 직원분이 비행기까지 데려다주셨어요. 무사히 공항을 탈출해 여행을 떠났어요!',
    items={'pass': dict(nm='탑승권', k='card', c='#3B6FD6', de='HJ 504편 탑승권이에요. 보안 검색대를 지날 수 있어요'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#2F6FB8', de='파란 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#2F6FB8', de='파란 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.'),
           'key': dict(nm='관제탑 열쇠', k='key', c='#2F6FB8', de='파란 열쇠예요. 열쇠 고리에 \'관제탑\'이라고 적혀 있어요'),
           'bat': dict(nm='무전기 건전지', k='battery', c='#3DA35D', de='관제탑 무전기에 넣을 수 있어요')},
    combine=[dict(a='kh1', b='kh2', make='key', msg='손잡이와 몸통을 딸깍 끼웠더니 **관제탑 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='출국장', bg=dict(wall='#E6EEF6', floor='#B8B2A6', deco='tile'), objs=[
            O('fids', '출발 안내 전광판', 'apFids', 30, 30, 430, 190, dict(rows=FIDS), keep=True,
              look='오늘 떠나는 비행기가 적힌 전광판이에요. 우리가 탈 비행기는 **HJ 504편**이에요. (시각은 이야기 속 시간표예요.)',
              lookFig=F('apFids', 460, 200, rows=FIDS), guide='전광판에서 HJ 504편의 출발·도착 시각과 탑승구를 찾아보세요.'),
            O('ads', '항공사 광고판', 'apAds', 480, 30, 280, 200, ADS_P, keep=True,
              look='항공사 네 곳이 올해 태운 손님 수를 자랑하는 광고판이에요. 수가 아주 커요!', lookFig=F('apAds', 400, 260, **ADS_P),
              guide='광고판의 큰 수를 자리마다 읽어 보세요.'),
            O('bags', '수하물 저울', 'apScale', 30, 250, 240, 150, dict(bags=[kg(v) for v in BAGS]), keep=True,
              look='우리 가족 가방 두 개를 저울에 하나씩 올렸어요. 저울 화면에 무게가 나와 있어요.', lookFig=F('apScale', 360, 220, bags=[kg(v) for v in BAGS]),
              guide='수하물 저울에 나온 가방 두 개의 무게를 살펴보세요.'),
            O('counter', '탑승 수속 카운터', 'apCounter', 290, 240, 250, 170,
              lock=Lk('num', str(sum(BAGS)), '카운터 화면: **가방 두 개의 무게를 더하면 모두 몇 kg일까요?** 소수점은 빼고 숫자 네 개를 차례로 맞춰요.',
                      ['수하물 저울 화면의 두 무게를 보세요.',
                       f'{kg(BAGS[0])} kg과 {kg(BAGS[1])} kg을 더해요. 소수점의 자리를 맞추어 세로로 쓰면 쉬워요.',
                       '소수 둘째 자리부터 더하고, 10이 넘으면 윗자리로 올려요.'],
                      f'{kg(BAGS[0])} + {kg(BAGS[1])} = {kg(sum(BAGS))} kg → {sum(BAGS)}', chk=lambda: sum(BAGS)),
              give=['pass'], after='삐빅! 수속이 끝나고 **HJ 504편 탑승권**이 나왔어요.', guide='저울의 두 무게를 더해 탑승 수속을 마쳐요.'),
            O('shop', '기념품 진열장', 'case', 570, 250, 190, 190, dict(items=[{'k': 'gem', 'c': '하늘', 'n': 2}, {'k': 'ball', 'c': '노랑', 'n': 1}], lock=True),
              lock=Lk('color', ADS_ORDER, '진열장 쪽지: **광고판에서 손님을 많이 태운 항공사부터** 그 색을 차례로 눌러요.',
                      ['항공사 광고판을 크게 보세요. 네 수는 모두 아홉 자리 수예요.',
                       '억의 자리 숫자가 모두 3이에요. 그다음 천만의 자리, 백만의 자리를 차례로 비교해요.',
                       '345000000은 3억 4500만이라고 읽어요. 나머지 수도 이렇게 읽어 보세요.'],
                      '노랑 3억 4500만 → 파랑 3억 4050만 → 빨강 3억 450만 → 초록 3억 45만',
                      chk=lambda: [c for _, c in sorted(((n, c) for c, _, n in ADS), reverse=True)], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kh1'], after='진열장이 열렸어요! 비행기 모형 옆에 파란 **열쇠 손잡이**가 있어요. 진열장 아래쪽에 **아주 작은 서랍**도 보여요.',
              guide='광고판의 큰 수를 비교해 기념품 진열장을 열어 보세요.'),
            O('sdraw', '진열장 속 작은 서랍', 'drawer', 60, 128, 70, 40, dict(c='#8A929C', lock=True), in_='shop',
              lock=Lk('num', f'{FLY // 60}{FLY % 60:02d}', '진열장 안 아주 작은 서랍이에요! 숫자 세 개 자물쇠예요. 의자 쪽지에 적힌 대로 계산해요.',
                      ['대기 의자를 크게 보면 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.',
                       f'전광판에서 HJ 504편은 {OURS[2][0]}시 {OURS[2][1]}분에 떠나서 {OURS[3][0]}시 {OURS[3][1]}분에 도착해요.',
                       '도착 시각에서 출발 시각을 빼요. 시는 시끼리, 분은 분끼리 빼요.'],
                      f'{hm(OURS[3])} − {hm(OURS[2])} = {FLY // 60}시간 {FLY % 60}분 → {FLY // 60}{FLY % 60:02d}',
                      chk=lambda: int(f'{FLY // 60}{FLY % 60:02d}')),
              give=['kh2'], after='작은 서랍 안에 파란 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='진열장을 연 뒤 진열장 안쪽의 작은 서랍을 눌러 보세요.'),
            O('chairs', '대기 의자', 'apChairs', 30, 420, 260, 120,
              look='파란 대기 의자가 줄지어 있어요. 잠긴 곳은 없어요.', guide='대기 의자를 크게 보면 무언가 끼워져 있을지도 몰라요.'),
            O('cscrap', '의자 위 쪽지', 'scrap', 200, 14, 50, 34, dict(t='?'), in_='chairs', keep=True,
              look='의자 등받이에 아주 작은 쪽지가 붙어 있어요! "진열장 속 작은 서랍 = **HJ 504편이 하늘을 나는 시간**. 몇 시간 뒤에 몇 분(두 자리)을 이어 써요."',
              guide='대기 의자를 크게 보고 등받이의 작은 쪽지를 찾아보세요.'),
            O('security', '보안 검색대', 'apSecurity', 800, 180, 180, 250,
              need='pass', needMsg='보안 검색대에 빨간 불이 켜져 있어요. 탑승권을 대는 곳이 보여요.', useMsg='탑승권을 댔더니 삑! 초록 불이 켜졌어요.',
              go='b', after='검색대를 지나 탑승구 쪽으로 가는 길이 열렸어요.', guide='탑승권으로 보안 검색대를 지나 탑승구로 가요.'),
        ]),
        dict(id='b', nm='탑승구', bg=dict(wall='#DCE8F2', floor='#9AA6B2', deco='stripe'), objs=[
            O('gbars', '대기 인원 그래프', 'apBars', 30, 30, 340, 240, BARS_P, keep=True,
              look='탑승구마다 기다리는 사람 수를 나타낸 막대그래프예요. 세로 눈금 한 칸이 몇 명인지 먼저 살펴보세요.',
              lookFig=F('apBars', 420, 300, **BARS_P), guide='막대그래프에서 우리 탑승구의 막대를 찾아 읽어 보세요.'),
            O('window2', '활주로 창문', 'window', 420, 30, 300, 150, dict(night=True),
              look='창밖에 활주로 불빛이 줄지어 반짝여요. 우리 비행기가 기다리고 있어요.', guide='창문에는 잠긴 곳이 없어요. 다른 물건을 살펴보세요.'),
            O('gatedesk', '탑승구 안내 데스크', 'apDesk', 400, 240, 260, 170,
              lock=Lk('num', str(ROWS), f'데스크 화면: **우리 탑승구 앞에서 기다리는 사람들이 한 줄에 {LINE}명씩 줄을 서요. 남는 사람도 한 줄을 더 만들면 줄은 모두 몇 줄일까요?** 숫자 두 개를 맞춰요.',
                      ['전광판에서 HJ 504편의 탑승구 번호를 찾고, 막대그래프에서 그 탑승구의 사람 수를 읽어요.',
                       f'세로 눈금 한 칸은 5명이에요. 우리 탑승구 막대가 가리키는 수를 {LINE}로 나누어 몫과 나머지를 구해요.',
                       '나머지가 있으면 남은 사람도 한 줄을 서야 하니 몫에 1을 더해요.'],
                      f'{MY_WAIT} ÷ {LINE} = {MY_WAIT // LINE} … {MY_WAIT % LINE} → {MY_WAIT // LINE}줄 + 남은 {MY_WAIT % LINE}명의 한 줄 = {ROWS}줄',
                      chk=lambda: -(-WAITERS[GATES.index(OURS[4])] // LINE)),
              after='"탑승을 시작합니다!" 데스크 옆 직원 문이 열리며 **기내식 수레**가 밀려 나왔어요.',
              guide='전광판의 탑승구 번호와 막대그래프로 줄 수를 계산해 보세요.'),
            O('cart', '기내식 수레', 'apCart', 60, 330, 190, 200, dict(rows=CART_R, cols=CART_C, label=f'한 상자에 주스 {JUICE}병'), req=['gatedesk'],
              look='기내식 수레 칸마다 주스 상자가 실려 있어요.', lookFig=F('apCart', 260, 280, rows=CART_R, cols=CART_C, label=f'한 상자에 주스 {JUICE}병'),
              lock=Lk('num', str(CART_R * CART_C * JUICE), '수레의 숫자 자물쇠: **수레에 실린 주스는 모두 몇 병일까요?** 숫자 네 개를 맞춰요.',
                      ['수레를 크게 보세요. 주스 상자가 모두 몇 개인지 세어요.',
                       f'상자는 {CART_R}칸에 {CART_C}개씩, 모두 {CART_R * CART_C}개예요. 한 상자에 주스가 {JUICE}병이에요.',
                       f'{JUICE} × {CART_R * CART_C}는 {JUICE} × 10과 {JUICE} × {CART_R * CART_C - 10}의 합으로 구할 수 있어요.'],
                      f'상자 {CART_R} × {CART_C} = {CART_R * CART_C}개, {JUICE} × {CART_R * CART_C} = {CART_R * CART_C * JUICE}병',
                      chk=lambda: CART_R * CART_C * JUICE),
              give=['bat'], after='수레 맨 아래 서랍이 열리며 **무전기 건전지**가 나왔어요!', guide='기내식 수레의 상자 수를 세고 주스가 모두 몇 병인지 계산해 보세요.'),
            O('tdoor', '관제탑 계단 문', 'door', 800, 170, 140, 220, dict(c='파랑', sign='관제탑'),
              need='key', needMsg='관제탑으로 가는 계단 문이 잠겨 있어요. 파란 열쇠 구멍이 보여요.', useMsg='관제탑 열쇠로 문을 열었어요!',
              go='c', after='빙글빙글 계단을 올라 관제탑에 도착했어요.', guide='열쇠 손잡이와 몸통을 합쳐 관제탑 계단 문을 열어 보세요.'),
        ]),
        dict(id='c', nm='관제탑', bg=dict(wall='#26324A', floor='#4E5868', deco='stars'), objs=[
            O('radar', '레이더 화면', 'apRadar', 40, 30, 240, 170,
              look='초록 레이더 화면에 하늘의 비행기들이 점으로 보여요. 잠긴 곳은 없어요.', guide='레이더에는 잠긴 곳이 없어요. 다른 물건을 살펴보세요.'),
            O('window3', '관제탑 창문', 'window', 720, 30, 250, 170, dict(night=True),
              look='관제탑 창밖으로 활주로가 한눈에 내려다보여요.', guide='창문에는 잠긴 곳이 없어요. 다른 물건을 살펴보세요.'),
            O('console', '관제 콘솔', 'apConsole', 40, 240, 420, 240, dict(btns=[{'s': s, 'ang': a} for s, a in CONSOLE]),
              lookFig=F('apConsole', 520, 340, btns=[{'s': s, 'ang': a} for s, a in CONSOLE]),
              look='콘솔에 삼각형과 사각형 그림이 있어요. 도형마다 한 각이 **?** 로 지워져 있어요.',
              lock=Lk('shape', CON_ORDER, '콘솔 쪽지: **도형마다 ? 인 각의 크기를 구해, 큰 것부터** 그 아래 모양을 차례로 눌러요.',
                      ['삼각형의 세 각을 더하면 180°, 사각형의 네 각을 더하면 360°예요.',
                       '○ 삼각형의 ? = 180° − 70° − 45°예요. 다른 도형도 이렇게 구해요.',
                       '□는 사각형이라서 360°에서 세 각을 빼야 해요.'],
                      '△ 100° → ☆ 90° → □ 80° → ○ 65°',
                      chk=lambda: [s for _, s in sorted(((miss(a), s) for s, a in CONSOLE), reverse=True)], opts=['○', '△', '□', '☆']),
              after='콘솔 화면이 켜지며 **활주로 가는 길** 그림이 나왔어요. 빨간 점이 우리 비행기가 갈 길이에요.',
              afterFig=F('map', 320, 230, **MAP), guide='삼각형과 사각형의 각의 합으로 ? 를 구해 모양 단추를 눌러 보세요.'),
            O('exit', '관제 무전기', 'apRadio', 520, 250, 260, 230,
              need='bat', needMsg='무전기가 꺼져 있어요. 건전지 넣는 곳이 비어 있어요.', useMsg='건전지를 넣었더니 무전기에 불이 들어왔어요! 비행기에게 길을 알려 줘요.',
              lock=Lk('dir', segs(MAP['path']), '무전기의 화살표 단추예요. 콘솔에 나온 **활주로 가는 길**을 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩에서 활주로 가는 길 그림을 열어 보세요. \'탑승구\'에서 출발해 빨간 점을 따라가요.',
                       '처음에는 아래로 가요. 색칠된 칸은 막힌 곳이라 돌아서 가요.',
                       '아래 → 오른쪽 → 그다음은 어느 쪽으로 꺾이나요?'],
                      '아래로 2칸, 오른쪽 3칸, 위로 2칸, 오른쪽 2칸, 아래로 1칸 가요. 누를 차례: ↓ → ↑ → ↓', chk=lambda: segs('DDRRRUURRD')),
              go='exit', after='"HJ 504편, 활주로로 갑니다!" 비행기가 천천히 움직이기 시작했어요.', guide='건전지를 무전기에 넣고, 길 그림대로 화살표를 눌러 보세요.'),
        ]),
    ],
    flow=['fids', 'ads', 'bags', 'counter', 'shop', 'chairs', 'cscrap', 'sdraw', 'kh1+kh2', 'security',
          'gbars', 'gatedesk', 'cart', 'tdoor', 'console', 'exit'],
)
