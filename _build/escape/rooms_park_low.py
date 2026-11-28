"""수학 방탈출 · 회전목마 놀이공원 탈출 (추천 1~2학년 · 보통) — 형식은 rooms.py 머리말
1~2학년: 수 세기·두 자리 덧셈·곱셈구구(2학년)·몇 시 30분·모양 규칙·방향·많은 차례"""
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
CLOCK_H, CLOCK_M = 4, 30                                  # 시계탑 4시 30분
BAL = [('빨강', 7), ('노랑', 5), ('파랑', 9)]               # 풍선 수레의 풍선
BAL_ITEMS = [{'c': c, 'n': n} for c, n in BAL]
BAL_ALL = sum(n for _, n in BAL)                          # 21
BLUE = dict(BAL)['파랑']                                   # 9
PAT = ['♡', '☆', '☆', '○']                                # 깃발 모양 규칙
FLAGS = [PAT[i % 4] for i in range(7)] + ['?']
FSC = [{'♡': '분홍', '☆': '노랑', '○': '하늘'}[k] for k in FLAGS[:-1]] + ['#C8402F']
HORSE = [('빨강', 2), ('노랑', 5), ('초록', 3), ('파랑', 4)]  # 회전목마의 말
HORSE_ITEMS = [{'c': c, 'n': n} for c, n in HORSE]
HORSES = sum(n for _, n in HORSE)                         # 14
CARS, SEAT = 6, 4                                         # 꼬마 기차 6칸, 한 칸에 4명(이야기 속 값)
TCOL = ['파랑', '초록', '노랑', '파랑', '초록', '노랑']
MAP = dict(n=4, m=6, start=[0, 3], path='RRUUURRDR', block=[[1, 2], [1, 1], [3, 2], [3, 1], [5, 3], [4, 3]], sl='기차', gl='정문')

ROOM = dict(
    id='park-low', title='회전목마 놀이공원 탈출', ico='🎡', acc='#D9443B',
    rec='추천 2학년 · 수 세기·덧셈·곱셈구구·몇 시 30분·모양 규칙·방향·많은 차례',
    intro='놀이공원 정문이 잠겨 버렸어요! 입구 광장과 회전목마 마당에서 단서를 모아 정문을 열어요.',
    story=['신나게 놀던 놀이공원에서 "곧 문을 닫아요!" 하는 안내 방송이 나왔어요.', '철컥! 정문의 쇠창살 문이 내려오고 큰 자물쇠가 걸려 버렸어요.', '놀이공원 곳곳의 단서를 모아 정문을 열고 집으로 돌아가요!'],
    outro='정문 쇠창살이 스르르 올라갔어요! 회전목마 음악이 "잘 가요~" 하고 울려요. 놀이공원을 탈출했어요!',
    mission=dict(title='놀이공원 정문을 열어라!', goal='입구 광장과 회전목마 마당의 단서를 모아 정문을 열어요.', tips=['색깔마다 몇 개인지 세어 봐요', '기차 한 칸에 몇 명씩 타는지 봐요']),
    dialog=[('nar', '놀이공원에서 신나게 놀고 있었어요.'), ('nar', '"곧 문을 닫아요!" 안내 방송이 나왔어요.'), ('tori', '안 돼! 회전목마 한 번 더 타고 싶은데!'), ('nar', '철컥! 정문에 쇠창살이 내려왔어요.'), ('momo', '단서를 모으면 정문을 열 수 있어.'), ('tori', '좋아, 놀이공원 탐험 출발!')],
    outro_dialog=[('tori', '회전목마 음악이 인사해 줘!'), ('momo', '세고 곱하고 견주어서 해냈어.')],
    items={'ticket': dict(nm='입장권', k='card', c='#E5534B', de='회전목마 마당에 들어갈 수 있는 입장권이에요'),
           'coin': dict(nm='놀이 동전', k='coin', c='#E0A92E', de='놀이기구 기계에 넣는 동전이에요'),
           'keyb': dict(nm='정문 열쇠', k='key', c='#3B6FD6', de='파란 큰 열쇠예요. 정문에 맞을까요?'),
           'kh1': dict(nm='열쇠 손잡이', k='khead', c='#3B6FD6', de='큰 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kh2': dict(nm='열쇠 몸통', k='kblade', c='#3B6FD6', de='큰 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kh1', b='kh2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **정문 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='입구 광장', bg=dict(wall='#D6EEF8', floor='#D9C29A', deco='stripe'), objs=[
            O('clock', '시계탑', 'clock', 50, 30, 120, 120, dict(h=CLOCK_H, m=CLOCK_M), keep=True,
              look='광장의 시계탑이에요. 지금 **몇 시 몇 분**일까요?', lookFig=F('clock', 150, 150, h=CLOCK_H, m=CLOCK_M),
              guide='시계탑이 몇 시 몇 분을 가리키는지 보고 수첩에 남겨 두세요.'),
            O('flags', '깃발 포스터', 'poster', 30, 170, 210, 150, dict(lines=['퍼레이드 깃발'], shapes=FLAGS, sc=FSC), keep=True,
              look='깃발 모양이 규칙대로 놓여 있어요. 맨 끝 **?** 는 지워졌어요.',
              lookFig=F('poster', 340, 130, lines=['퍼레이드 깃발'], shapes=FLAGS, sc=FSC),
              guide='깃발 포스터의 규칙을 수첩에 남겨 두세요.'),
            O('booth', '매표소', 'pkBooth', 270, 60, 230, 320, dict(sign='매표소', lines=['어린이 입장권']),
              lock=Lk('num', str(BAL_ALL), '풍선 수레의 **풍선**은 모두 몇 개일까요? 두 자리 수를 만들어요.',
                      ['풍선 수레를 크게 보고 색깔마다 풍선을 세어 보세요.', f'빨간 풍선 {BAL[0][1]}개, 노란 풍선 {BAL[1][1]}개, 파란 풍선 {BAL[2][1]}개예요.', f'{BAL[0][1]} + {BAL[1][1]} = {BAL[0][1] + BAL[1][1]}, 여기에 {BAL[2][1]}를 더해요.'],
                      f'{BAL[0][1]} + {BAL[1][1]} + {BAL[2][1]} = {BAL_ALL}', chk=lambda: sum(n for _, n in BAL)),
              give=['ticket'], after='드르륵! **입장권**이 나왔어요. \'회전목마 마당\'이라고 적혀 있어요.',
              guide='풍선 수레의 풍선을 모두 세어 매표소 창구를 열어 보세요.'),
            O('balloon', '풍선 수레', 'pkBalloons', 530, 50, 220, 330, dict(items=BAL_ITEMS), keep=True, say=('tori', '풍선 색깔이 세 가지야!'),
              look='빨간 풍선, 노란 풍선, 파란 풍선이 있어요. 색깔마다 몇 개일까요?',
              lookFig=F('pkBalloons', 260, 330, items=BAL_ITEMS),
              guide='풍선 수레의 풍선을 색깔마다 세어 보세요.'),
            O('cotton', '솜사탕 수레', 'pkCotton', 60, 390, 210, 150, say=('tori', '어? 수레 틈에 종이가 끼어 있나 봐!'),
              look='달콤한 솜사탕 수레예요. 구석에 무언가 끼어 있는 것 같아요.',
              guide='솜사탕 수레를 크게 보면 구석에 무언가 끼어 있을지도 몰라요.'),
            O('cscrap', '수레 구석 쪽지', 'scrap', 142, 92, 48, 34, dict(t='?'), in_='cotton', keep=True,
              look='작은 쪽지가 있어요! "선물 상자 속 작은 서랍: **파란 풍선 수와 꼬마 기차 칸 수**를 더해요. 빨간 기관차는 세지 않아요."',
              guide='솜사탕 수레를 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
            O('gate', '회전목마 마당 문', 'door', 810, 170, 140, 210, dict(c='보라', sign='회전목마'),
              need='ticket', needMsg='문 옆에 **입장권 넣는 곳**이 있어요.', useMsg='입장권을 넣었더니 삑! 문이 열렸어요.',
              go='b', after='반짝이는 회전목마 마당이 보여요.', guide='입장권을 회전목마 마당 문에 넣어 보세요.'),
        ]),
        dict(id='b', nm='회전목마 마당', bg=dict(wall='#FCE6EF', floor='#C9B08E', deco='stars'), objs=[
            O('carousel', '회전목마', 'pkCarousel', 30, 30, 360, 340, dict(horses=HORSE_ITEMS), keep=True, say=('momo', '말 색깔마다 몇 마리인지 세자.'),
              look='빨강·노랑·초록·파랑 말이 있어요. 색깔마다 몇 마리일까요?',
              lookFig=F('pkCarousel', 360, 320, horses=HORSE_ITEMS),
              guide='회전목마의 말을 색깔마다 세어 보세요.'),
            O('tsign', '꼬마 기차 안내판', 'sign', 420, 40, 200, 90, dict(lines=['꼬마 기차', '한 칸에 4명씩'], c='#2E7D5B'), keep=True, say=('momo', '한 칸에 몇 명씩인지 기억하자.'),
              look='"꼬마 기차는 **한 칸에 4명씩** 타요."', lookFig=F('sign', 260, 110, lines=['꼬마 기차', '한 칸에 4명씩'], c='#2E7D5B'),
              guide='꼬마 기차 안내판을 읽고 수첩에 남겨 두세요.'),
            O('panel', '회전목마 조종기', 'panel', 420, 160, 180, 130, dict(colors=['빨강', '노랑', '초록', '파랑'], label='많은 것부터', done='빙글빙글'),
              need='coin', needMsg='조종기에 동전 넣는 곳이 있어요.', useMsg='놀이 동전을 넣었더니 색깔 단추에 불이 켜졌어요!',
              lock=Lk('color', [c for c, _ in sorted(HORSE, key=lambda t: -t[1])], '**말이 많은 색부터** 그 색 단추를 눌러요.',
                      ['회전목마를 크게 보고 말을 색깔마다 세어 보세요.', '말은 빨강 2마리, 노랑 5마리, 초록 3마리, 파랑 4마리예요.', '5, 4, 3, 2 차례로 그 말의 색을 눌러요.'],
                      '노랑 5마리 → 파랑 4마리 → 초록 3마리 → 빨강 2마리',
                      chk=lambda: [c for c, _ in sorted(HORSE, key=lambda t: -t[1])], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kh1'], after='회전목마가 빙글빙글! 안장 밑에서 **열쇠 손잡이**가 툭 떨어졌어요. 몸통은 없어요.',
              guide='놀이 동전을 회전목마 조종기에 넣고, 말이 많은 색부터 눌러 보세요.'),
            O('gift', '선물 상자', 'box', 650, 170, 150, 120, dict(c='분홍', lock=True),
              lock=Lk('num', str(CARS * SEAT), '꼬마 기차에는 모두 **몇 명**이 탈 수 있을까요? 두 자리 수를 만들어요.',
                      ['꼬마 기차의 칸을 세어 보세요. 빨간 기관차는 세지 않아요.', '안내판에 한 칸에 몇 명씩 탄다고 적혀 있었나요?', f'{CARS}칸에 {SEAT}명씩이니 {SEAT}씩 {CARS}번 뛰어 세거나 {SEAT} × {CARS}을 계산해요.'],
                      f'기차 {CARS}칸, 한 칸에 {SEAT}명 → {SEAT} × {CARS} = {CARS * SEAT}', chk=lambda: SEAT * CARS),
              give=['coin'], after='상자 안에 **놀이 동전**이 있어요. 앞쪽에 **작은 서랍**도 있어요.',
              guide='꼬마 기차의 칸 수와 안내판으로 선물 상자를 열어 보세요.'),
            O('gdraw', '선물 상자 속 작은 서랍', 'drawer', 72, 72, 66, 36, dict(c='#E0A92E', lock=True), in_='gift',
              lock=Lk('num', str(BLUE + CARS), '선물 상자 속 작은 서랍이에요. **솜사탕 수레 구석 쪽지**대로 계산해요.',
                      ['입구 광장의 솜사탕 수레를 크게 보세요. 구석에 쪽지가 있어요.', f'파란 풍선은 {BLUE}개, 꼬마 기차의 칸은 {CARS}칸이에요.', f'{BLUE} + {CARS}은?'],
                      f'파란 풍선 {BLUE} + 기차 칸 {CARS} = {BLUE + CARS}', chk=lambda: BLUE + CARS),
              give=['kh2'], after='작은 서랍 안에 **열쇠 몸통**이 있어요. 손잡이는 없어요.', guide='선물 상자를 연 뒤 작은 서랍을 눌러 보세요.'),
            O('game', '모양 맞히기 가게', 'pkGame', 30, 390, 330, 150, dict(slots=['?', '?', '?']),
              lock=Lk('shape', [PAT[i % 4] for i in range(7, 10)], '깃발 포스터의 **? 자리와 그 뒤 두 개**에 올 모양을 차례로 눌러요.',
                      ['수첩에서 깃발 포스터를 보세요.', '♡ ☆ ☆ ○ 가 되풀이돼요. 포스터의 마지막 모양은 ☆ 였어요.', '♡ ☆ ☆ 다음에는 무엇이 오고, 그다음은?'],
                      '♡ ☆ ☆ ○ 가 되풀이되므로 ? 자리부터 ○ ♡ ☆', chk=lambda: [PAT[i % 4] for i in range(7, 10)], opts=['○', '△', '♡', '☆']),
              after='딩동댕! 상으로 **꼬마 기차 길 지도**를 받았어요. 빨간 점이 기차가 갈 길이에요.',
              afterFig=F('map', 320, 220, **MAP), guide='깃발 포스터의 규칙대로 모양 맞히기 가게의 모양을 눌러 보세요.'),
            O('train', '꼬마 기차', 'pkTrain', 400, 410, 340, 120, dict(n=CARS, cs=TCOL), say=('tori', '칙칙폭폭! 칸이 몇 개지?'),
              lock=Lk('dir', segs(MAP['path']), '**꼬마 기차 길 지도**를 보고 가는 쪽을 차례로 눌러요. 같은 쪽으로 여러 칸 가도 한 번만 눌러요.',
                      ['가게에서 받은 지도를 수첩에서 보세요. \'기차\'에서 빨간 점을 따라가요.', '처음에는 오른쪽으로 2칸 가요. 그다음은 위로!', '오른쪽, 위, 오른쪽, 아래, 마지막은? 화살표는 모두 5개예요.'],
                      '오른쪽으로 2칸, 위로 3칸, 오른쪽으로 2칸, 아래로 1칸, 오른쪽으로 1칸 가요. 누를 차례: → ↑ → ↓ →', chk=lambda: segs('RRUUURRDR')),
              after='칙칙폭폭! 기차가 정문 단추를 눌렀어요. 가림막이 걷히고 **정문**이 보여요!',
              guide='모양 맞히기 가게에서 받은 지도대로 꼬마 기차의 방향을 눌러 보세요.'),
            O('exit', '정문', 'pkGate', 820, 160, 170, 220, dict(sign='정문', c='빨강'), req=['train'],
              need='keyb', needMsg='정문 쇠창살에 큰 열쇠 구멍이 있어요.', useMsg='정문 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(CLOCK_M + HORSES), '**시계탑의 몇 분**과 **회전목마의 말 수**를 더해요. 두 자리 수를 만들어요.',
                      ['시계탑은 몇 시 몇 분이었나요? 분의 수만 써요.', f'회전목마의 말은 모두 몇 마리였나요? {HORSE[0][1]} + {HORSE[1][1]} + {HORSE[2][1]} + {HORSE[3][1]}', f'{CLOCK_M} + {HORSES}는?'],
                      f'시계탑 {CLOCK_H}시 {CLOCK_M}분 → {CLOCK_M}, 말 {HORSE[0][1]} + {HORSE[1][1]} + {HORSE[2][1]} + {HORSE[3][1]} = {HORSES} → {CLOCK_M} + {HORSES} = {CLOCK_M + HORSES}',
                      chk=lambda: CLOCK_M + sum(n for _, n in HORSE)),
              go='exit', after='정문이 열렸어요!', guide='정문 열쇠를 정문에 쓰고, 시계탑의 분과 회전목마의 말 수를 더해요.'),
        ]),
    ],
    flow=['clock', 'flags', 'balloon', 'booth', 'cotton', 'cscrap', 'gate', 'carousel', 'tsign', 'gift', 'gdraw', 'panel', 'kh1+kh2', 'game', 'train', 'exit'],
)
