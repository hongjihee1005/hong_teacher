"""수학 방탈출 · 아쿠아리움 탈출 (추천 2학년) — 형식은 rooms.py 머리말"""
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
CLOCK_H, CLOCK_M = 3, 35                    # 터널 시계 3시 35분
PER, GROUPS, TURTLE = 4, 7, 2               # 노란 물고기 4마리씩 7묶음, 거북 2마리(세지 않음)
FISH = PER * GROUPS                         # 28
SEA_FROM, SEA_TO = 2, 19                    # 해마: 자의 2 cm 눈금부터 19 cm 눈금까지
SEA = SEA_TO - SEA_FROM                     # 17 cm
JELLY = [('파랑', 9), ('분홍', 7), ('보라', 5), ('노랑', 3)]      # 해파리 색깔별 수
JELLY_P = [{'c': k, 'n': n} for k, n in JELLY]
JORDER = [k for k, _ in sorted(JELLY, key=lambda x: -x[1])]      # 많은 색부터
OCTO, LEGS = 3, 8                           # 문어 3마리, 다리 8개씩
PAT = ['△', '☆', '☆', '○']                 # 조개 무늬 규칙
POSTER = [PAT[i % 4] for i in range(8)] + ['?']
PSC = [{'△': '주황', '☆': '노랑', '○': '하늘'}[k] for k in POSTER[:-1]] + ['#C8402F']
PGATE = [PAT[i % 4] for i in range(8, 11)]
SARD, GAVE = 72, 38                         # 정어리 처음 72마리, 펭귄에게 38마리
HUND, TEN, ONE = 3, 5, 6                    # 수 모형 백 3 · 십 5 · 일 6 → 356
NUM = 100 * HUND + 10 * TEN + ONE
JUMP, JN = 10, 3                            # 10씩 3번 뛰어 세기
MAP = dict(n=4, m=5, start=[0, 3], path='RUURRDR', block=[[0, 1], [2, 2], [4, 0], [3, 3], [0, 0]], sl='로봇', gl='단추')

ROOM = dict(
    id='aquarium', title='아쿠아리움 탈출', ico='🐠', acc='#1F7FB0',
    rec='추천 2학년 · 곱셈구구·받아올림과 받아내림·몇 시 몇 분·cm로 길이 재기·세 자리 수·분류·규칙·방향',
    intro='아쿠아리움 밤 탐험 중에 문이 모두 잠겼어요! 수조 터널, 해파리 방, 사육사 준비실의 단서로 출구 문을 열어요.',
    story=['아쿠아리움 밤 탐험 날, 물고기 떼를 구경하느라 시간 가는 줄 몰랐어요.', '갑자기 불이 깜빡하더니 철컥! 문이 모두 잠겼어요.', '수조 터널, 해파리 방, 준비실의 단서를 모아 출구 문을 열어요!'],
    outro='출구 문이 스르르 열렸어요! 사육사 선생님이 "오늘의 꼬마 사육사예요!" 하며 박수를 쳐 줘요. 아쿠아리움을 탈출했어요!',
    mission=dict(title='아쿠아리움을 탈출하라!', goal='수조 터널, 해파리 방, 준비실의 단서를 모아 출구 문을 열어요.', tips=['묶음으로 헤엄치는 물고기는 곱셈으로 세어 봐요', '자의 시작 눈금을 꼭 봐요']),
    dialog=[('nar', '아쿠아리움 밤 탐험 날이에요.'), ('tori', '우와, 물고기 떼가 반짝반짝!'), ('nar', '갑자기 불이 깜빡했어요.'), ('nar', '철컥! 문이 모두 잠겼어요.'), ('momo', '단서는 수조 곳곳에 있을 거야.'), ('tori', '좋아, 바닷속 탐험 시작!')],
    outro_dialog=[('tori', '꼬마 사육사, 임무 완료!'), ('momo', '곱셈과 세 자리 수로 문을 열었어.')],
    items={'coin': dict(nm='먹이 동전', k='coin', c='#E0A92E', de='물고기 그림이 새겨진 동전이에요. 먹이 자판기에 넣을 수 있어요.'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#1F7FB0', de='파란 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#1F7FB0', de='파란 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.'),
           'keyb': dict(nm='출구 열쇠', k='key', c='#1F7FB0', de='물고기 모양 손잡이가 달린 파란 열쇠예요.'),
           'bat': dict(nm='건전지', k='battery', c='#3DA35D', de='무언가를 움직이게 할 수 있어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **출구 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='큰 수조 터널', bg=dict(wall='#2A6F9C', floor='#3D5A73', deco='bubble'), objs=[
            O('clock', '터널 시계', 'clock', 40, 40, 120, 120, dict(h=CLOCK_H, m=CLOCK_M), keep=True,
              look='터널 벽시계가 멈춰 있어요! **몇 시 몇 분**일까요?', lookFig=F('clock', 150, 150, h=CLOCK_H, m=CLOCK_M),
              guide='터널 시계가 몇 시 몇 분을 가리키는지 보고 수첩에 남겨 두세요.'),
            O('tank', '큰 수조', 'aqTank', 220, 30, 560, 300, dict(groups=GROUPS, per=PER, turtle=TURTLE), keep=True, say=('momo', '몇 마리씩 묶음인지 보자.'),
              look='노란 물고기들이 **몇 마리씩 묶음으로** 모여 헤엄쳐요. 바닥에는 거북도 있어요.',
              lookFig=F('aqTank', 560, 300, groups=GROUPS, per=PER, turtle=TURTLE), guide='큰 수조의 노란 물고기를 묶음으로 세어 보세요.'),
            O('sea', '해마와 자', 'aqRuler', 40, 190, 150, 340, dict(**{'from': SEA_FROM, 'to': SEA_TO, 'max': 20}), keep=True, say=('tori', '꼬리가 0에 있지 않아! 조심!'),
              look='해마 옆에 자가 있어요. 빨간 점선이 닿는 눈금을 보세요. 꼬리 끝은 **0이 아닌 눈금**에 있어요!',
              lookFig=F('aqRuler', 180, 380, **{'from': SEA_FROM, 'to': SEA_TO, 'max': 20}), guide='해마의 키가 몇 cm인지 자로 재어 보세요.'),
            O('kiosk', '기념품 상자', 'box', 230, 405, 170, 125, dict(c='#3B6FD6', lock=True, label='?'),
              look='숫자 자물쇠가 달린 기념품 상자예요.',
              lock=Lk('num', str(FISH), '큰 수조의 **노란 물고기**는 모두 몇 마리일까요? 두 자리 수를 만들어요.',
                      ['큰 수조를 보세요. 점선 동그라미마다 같은 수만큼 모여 있어요.', f'한 묶음에 {PER}마리씩, 묶음이 {GROUPS}개예요.', f'{PER}단 곱셈구구를 떠올려요. {PER} × {GROUPS} = ?'],
                      f'{PER}마리씩 {GROUPS}묶음 → {PER} × {GROUPS} = {FISH}', chk=lambda: PER * GROUPS),
              give=['coin'], after='상자가 열렸어요! 안에 **먹이 동전**이 있어요.',
              guide='기념품 상자를 열어 보세요. 큰 수조의 노란 물고기를 묶음으로 세면 돼요.'),
            O('feeder', '먹이 자판기', 'aqFeeder', 440, 345, 150, 195,
              look='물고기 먹이가 나오는 자판기예요.',
              need='coin', needMsg='자판기에 동전 넣는 구멍이 있어요.', useMsg='먹이 동전을 넣었더니 먹이가 와르르 나왔어요!',
              after='물고기들이 먹이 쪽으로 몰려갔어요. 뒤에 있던 **해파리 방 문**이 보여요!',
              guide='먹이 동전을 먹이 자판기에 넣어 보세요.'),
            O('tdoor', '해파리 방 문', 'door', 824, 200, 130, 210, dict(c='파랑', sign='해파리 방', keypad=True), req=['feeder'],
              look='해파리 방으로 가는 문이에요. 숫자판이 있어요.',
              lock=Lk('num', str(CLOCK_M + SEA), '**터널 시계의 몇 분**과 **해마의 키(cm)**를 더해요. 두 자리 수를 만들어요.',
                      ['수첩에서 터널 시계와 해마와 자를 보세요.', f'시계는 {CLOCK_H}시 {CLOCK_M}분이에요. 해마는 {SEA_FROM} cm 눈금부터 {SEA_TO} cm 눈금까지예요. 1 cm가 몇 번일까요?', f'해마의 키는 {SEA} cm예요. {CLOCK_M} + {SEA}은 받아올림에 조심해요.'],
                      f'시계 {CLOCK_H}시 {CLOCK_M}분 → {CLOCK_M}, 해마 {SEA_TO} − {SEA_FROM} = {SEA} cm → {CLOCK_M} + {SEA} = {CLOCK_M + SEA}', chk=lambda: CLOCK_M + (SEA_TO - SEA_FROM)),
              go='b', after='삐빅! 문이 열렸어요. 어두운 방에서 무언가 반짝반짝 빛나요.', guide='터널 시계와 해마의 키로 해파리 방 문의 비밀번호를 계산해요.'),
        ]),
        dict(id='b', nm='해파리 방', bg=dict(wall='#1B2547', floor='#2C3550', deco='bubble'), objs=[
            O('jelly', '해파리 수조', 'aqJelly', 40, 40, 420, 280, dict(items=JELLY_P), keep=True, say=('tori', '해파리 색깔이 네 가지야!'),
              look='**파랑, 분홍, 보라, 노랑** 해파리가 둥실둥실 떠다녀요. 색깔마다 몇 마리일까요?',
              lookFig=F('aqJelly', 420, 280, items=JELLY_P), guide='해파리 수조의 해파리를 색깔별로 나누어 세어 보세요.'),
            O('octo', '문어 수조', 'aqOcto', 500, 40, 300, 200, dict(n=OCTO), keep=True, say=('momo', '문어마다 다리가 몇 개였지?'),
              look='문어들이 바위 위에서 쉬고 있어요. 문어마다 다리가 몇 개일까요?',
              lookFig=F('aqOcto', 300, 200, n=OCTO), guide='문어 수조의 문어 수와 다리 수를 세어 보세요.'),
            O('oscrap', '문어 수조 구석 쪽지', 'scrap', 240, 150, 50, 36, dict(t='?'), in_='octo', keep=True,
              look='구석에 작은 쪽지가 있어요! "냉장고 속 작은 서랍: **문어 다리는 모두 몇 개?**"',
              guide='문어 수조를 크게 보고 오른쪽 아래 구석의 작은 쪽지를 찾아보세요.'),
            O('poster', '조개 무늬 포스터', 'poster', 500, 270, 300, 110, dict(lines=['조개 무늬'], shapes=POSTER, sc=PSC), keep=True,
              look='조개 무늬가 규칙대로 그려져 있어요. 맨 끝 **?** 는 지워졌어요.',
              lookFig=F('poster', 340, 130, lines=['조개 무늬'], shapes=POSTER, sc=PSC), guide='조개 무늬 포스터의 규칙을 수첩에 남겨 두세요.'),
            O('light', '해파리 조명 장치', 'panel', 830, 40, 140, 150, dict(colors=['분홍', '보라', '파랑', '노랑'], label='많은 것부터', done='열림'),
              lock=Lk('color', JORDER, '**해파리가 많은 색부터** 그 색 단추를 눌러요.',
                      ['해파리 수조를 보세요. 색깔마다 따로 세어요.', '센 해파리에 하나씩 표시하며 세어요. 가장 많은 색은?'],
                      ' → '.join(f'{k} {n}마리' for k, n in sorted(JELLY, key=lambda x: -x[1])),
                      chk=lambda: [k for k, _ in sorted(JELLY, key=lambda x: -x[1])], opts=['분홍', '보라', '파랑', '노랑']),
              give=['kb1'], after='불빛이 차례로 켜지더니 **열쇠 손잡이**가 나왔어요! 몸통은 없어요.',
              guide='해파리를 색깔별로 세어 많은 색부터 조명 장치의 단추를 눌러 보세요.'),
            O('pdoor', '준비실 문', 'door', 834, 225, 120, 200, dict(c='초록', sign='준비실', keypad=True),
              look='사육사 준비실로 가는 문이에요. 모양 단추가 있어요.',
              lock=Lk('shape', PGATE, '조개 무늬의 **? 자리와 그 뒤 두 개**에 올 모양을 차례로 눌러요.',
                      ['수첩에서 조개 무늬 포스터를 보세요.', '△ ☆ ☆ ○ 네 개가 되풀이돼요. ? 바로 앞 모양은 ○ 였어요.', '○ 다음에 무엇이 오나요? 세 개를 이어 가요.'],
                      '△ ☆ ☆ ○ 가 되풀이되므로 ? 자리부터 △ ☆ ☆', chk=lambda: [PAT[i % 4] for i in range(8, 11)], opts=['○', '△', '□', '☆']),
              go='c', after='딸깍! 문이 열렸어요. 비릿한 생선 냄새가 나요.', guide='조개 무늬 포스터의 규칙대로 준비실 문의 모양을 눌러 보세요.'),
        ]),
        dict(id='c', nm='사육사 준비실', bg=dict(wall='#E3F0F2', floor='#9FB3B8', deco='tile'), objs=[
            O('memo', '먹이 기록 칠판', 'board', 40, 40, 300, 170, dict(lines=['오늘의 정어리', f'처음에 {SARD}마리', f'펭귄에게 {GAVE}마리 줌']), keep=True,
              look='오늘 준 먹이가 적혀 있어요.', lookFig=F('board', 300, 170, lines=['오늘의 정어리', f'처음에 {SARD}마리', f'펭귄에게 {GAVE}마리 줌']),
              guide='먹이 기록 칠판을 읽고 수첩에 남겨 두세요.'),
            O('blocks', '수 모형 판', 'aqBlocks', 370, 30, 440, 145, dict(h=HUND, t=TEN, o=ONE), keep=True, say=('momo', '백, 십, 일 모형을 따로 세자.'),
              look='**백 모형**, **십 모형**, **일 모형**이 몇 개씩일까요?',
              lookFig=F('aqBlocks', 440, 145, h=HUND, t=TEN, o=ONE), guide='수 모형 판이 나타내는 세 자리 수를 읽어 보세요.'),
            O('fridge', '먹이 냉장고', 'cabinet', 40, 270, 180, 260, dict(c='#DDE6EA', label='먹이'),
              look='숫자 자물쇠가 달린 먹이 냉장고예요.',
              lock=Lk('num', str(SARD - GAVE), '지금 남은 **정어리**는 몇 마리일까요? 두 자리 수를 만들어요.',
                      ['먹이 기록 칠판을 보세요. 처음 수에서 준 수를 빼요.', f'{SARD} − {GAVE}에서는 일의 자리 2에서 8을 뺄 수 없어요. 십의 자리에서 10을 받아내려요.'],
                      f'{SARD} − {GAVE} = {SARD - GAVE}', chk=lambda: SARD - GAVE),
              give=['bat'], after='냉장고 안에 **건전지**와 **청소 로봇 길 그림**이 있어요. 빨간 점이 로봇이 갈 길이에요.',
              afterFig=F('map', 300, 240, **MAP), guide='먹이 기록 칠판으로 남은 정어리 수를 구해 냉장고를 열어 보세요.'),
            O('cdraw', '냉장고 속 작은 서랍', 'drawer', 30, 160, 70, 40, dict(c='#8A929C', lock=True), in_='fridge',
              lock=Lk('num', str(OCTO * LEGS), '냉장고 속 작은 서랍이에요. **문어 수조 구석 쪽지**대로 계산해요.',
                      ['해파리 방의 문어 수조를 크게 보세요. 구석에 쪽지가 있어요.', f'문어는 {OCTO}마리이고, 문어마다 다리가 {LEGS}개예요.', f'{LEGS}개씩 {OCTO}묶음이에요. {LEGS} × {OCTO} = ?'],
                      f'다리 {LEGS}개씩 문어 {OCTO}마리 → {LEGS} × {OCTO} = {OCTO * LEGS}', chk=lambda: LEGS * OCTO),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 있어요. 손잡이는 없어요.', guide='냉장고를 연 뒤 안쪽의 작은 서랍을 눌러 보세요.'),
            O('robot', '수조 청소 로봇', 'robot', 430, 360, 110, 160, dict(c='#7FC4E8'),
              need='bat', needMsg='로봇이 꺼져 있어요. 건전지 넣는 곳이 비어 있어요.', useMsg='건전지를 넣었더니 로봇 눈이 반짝! "길을 알려 주세요."',
              lock=Lk('dir', segs(MAP['path']), '**청소 로봇 길 그림**을 보고 가는 쪽을 차례로 눌러요. 같은 쪽으로 여러 칸 가도 한 번만 눌러요.',
                      ['수첩에서 청소 로봇 길 그림을 보세요. \'로봇\'에서 빨간 점을 따라가요.', '처음에는 오른쪽으로 1칸, 그다음은 위로 가요. 그다음은? 화살표는 모두 5개예요.'],
                      '오른쪽으로 1칸, 위로 2칸, 오른쪽으로 2칸, 아래로 1칸, 오른쪽으로 1칸 가요. 누를 차례: → ↑ → ↓ →', chk=lambda: segs('RUURRDR')),
              after='로봇이 벽의 단추를 꾹 눌렀어요! 덜컹, **출구 문**이 나타났어요.', guide='건전지를 로봇에 넣고 길 그림대로 길을 알려 주세요.'),
            O('exit', '출구 문', 'door', 830, 215, 140, 200, dict(c='빨강', sign='출구'), req=['robot'],
              look='로봇이 찾아 준 출구 문이에요.',
              need='keyb', needMsg='출구 문에 파란 열쇠 구멍이 있어요.', useMsg='출구 열쇠가 딱 맞아요! 이제 세 자리 숫자판만 남았어요.',
              lock=Lk('num', str(NUM + JUMP * JN), '**수 모형 판의 수**에서 **10씩 3번** 뛰어 세어요. 세 자리 수를 만들어요.',
                      ['수첩에서 수 모형 판을 보세요. 백, 십, 일 모형이 몇 개씩인가요?', f'백 모형 {HUND}개, 십 모형 {TEN}개, 일 모형 {ONE}개는 {NUM}이에요.', '10씩 뛰어 세면 십의 자리 숫자가 1씩 커져요. 세 번 뛰어 세어 봐요.'],
                      f'{NUM} → {NUM + 10} → {NUM + 20} → {NUM + 30}', chk=lambda: 100 * HUND + 10 * TEN + ONE + JUMP * JN),
              go='exit', after='출구 문이 열렸어요!', guide='출구 열쇠를 출구 문에 쓰고, 수 모형 판의 수에서 10씩 뛰어 세어요.'),
        ]),
    ],
    flow=['clock', 'tank', 'sea', 'kiosk', 'feeder', 'tdoor', 'jelly', 'octo', 'oscrap', 'poster', 'light', 'pdoor',
          'memo', 'blocks', 'fridge', 'cdraw', 'kb1+kb2', 'robot', 'exit'],
)
