"""수학 방탈출 · 농장 탈출 (추천 1학년) — 형식은 rooms.py 머리말"""
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
CLOCK_H = 5                                 # 닭장 시계 5시
TRAYS, LOOSE = 3, 4                         # 달걀: 10개씩 꽉 찬 판 3개 + 그릇에 4개
EGG = 10 * TRAYS + LOOSE                    # 34 (10개씩 묶음 3개와 낱개 4개)
WHITE, BROWN, CHICK = 5, 8, 6               # 흰 닭 5 · 갈색 닭 8 · 병아리 6
COWS = [(12, '빨강'), (7, '노랑'), (18, '초록'), (5, '파랑'), (14, '보라'), (9, '분홍')]   # 젖소 번호표와 목줄 색
COW_P = [{'n': n, 'c': k} for n, k in COWS]
EVEN = [k for n, k in sorted(COWS) if n % 2 == 0]      # 짝수 번호, 작은 수부터: 빨강(12) 보라(14) 초록(18)
PAT = ['△', '□', '○', '□']                 # 외양간 포스터 무늬 규칙
POSTER = [PAT[i % 4] for i in range(9)] + ['?']
PSC = [{'△': '초록', '□': '주황', '○': '파랑'}[k] for k in POSTER[:-1]] + ['#C8402F']
GATE = [PAT[i % 4] for i in range(9, 12)]  # 포스터의 ? 자리부터 세 개
RED, GREEN = 9, 7                           # 사과 바구니: 빨간 사과 9 · 초록 사과 7
MAP = dict(n=4, m=5, start=[0, 0], path='DDRRRUR', block=[[1, 0], [2, 1], [4, 3], [1, 3], [3, 0]], sl='트랙터', gl='건초')

ROOM = dict(
    id='farm', title='농장 탈출', ico='🐄', acc='#B5651D',
    rec='추천 1학년 · 10개씩 묶어 세기·짝수와 홀수·세 수의 덧셈과 뺄셈·몇 시·모양 규칙·방향',
    intro='농장 체험을 하다가 문이 모두 잠겨 버렸어요! 닭장과 외양간, 과수원 창고를 둘러보며 단서를 모아 창고 문을 열어요.',
    story=['농장 체험 날, 닭장에서 달걀을 모으고 있는데 갑자기 "꼬끼오!" 하고 닭들이 날개를 퍼덕였어요.', '닭들이 퍼덕이는 바람에 닭장 문이 쾅! 닫히고 빗장이 철컥 걸렸어요.', '닭장, 외양간, 과수원 창고의 단서를 모아 창고 문으로 나가요!'],
    outro='창고 문이 활짝 열렸어요! 농장 주인 할머니가 "우리 농장 일꾼이 다 됐구나!" 하며 사과 한 알을 건네줘요. 농장을 탈출했어요!',
    items={'key': dict(nm='외양간 열쇠', k='key', c='#9A6A3F', de='소 그림이 새겨진 열쇠예요. 외양간 문에 맞을 것 같아요.'),
           'tl': dict(nm='찢어진 그림 왼쪽', k='tornL', c='#B5651D', de='찢어진 종이의 왼쪽 반이에요. 길이 그려져 있는데 반만 있어요.'),
           'tr': dict(nm='찢어진 그림 오른쪽', k='tornR', c='#B5651D', de='찢어진 종이의 오른쪽 반이에요. 왼쪽 반과 맞춰 볼까요?'),
           'plan': dict(nm='트랙터 길 그림', k='paper', c='#B5651D', de='두 조각을 이어 붙인 그림이에요. 창고 게시판에 붙이면 크게 볼 수 있어요.'),
           'gkey': dict(nm='창고 열쇠', k='key', c='#E5534B', de='빨간 창고 열쇠예요. 창고 문에 맞을까요?')},
    combine=[dict(a='tl', b='tr', make='plan', msg='찢어진 두 조각을 맞춰 테이프로 붙였더니 **트랙터 길 그림**이 되었어요!')],
    scenes=[
        dict(id='a', nm='닭장', bg=dict(wall='#FBE9CF', floor='#D8B46A', deco='stripe'), objs=[
            O('clock', '닭장 시계', 'clock', 40, 30, 120, 120, dict(h=CLOCK_H, m=0), keep=True,
              look='닭장 벽시계가 멈춰 있어요! 짧은바늘과 긴바늘이 가리키는 곳을 잘 보세요. **몇 시**일까요?', lookFig=F('clock', 150, 150, h=CLOCK_H, m=0),
              guide='닭장 시계가 몇 시를 가리키는지 보고 수첩에 남겨 두세요.'),
            O('roost', '닭 횃대', 'fmRoost', 190, 30, 420, 300, dict(white=WHITE, brown=BROWN, chick=CHICK), keep=True,
              look='닭들이 횃대에 앉아 있어요. 위 횃대에는 **흰 닭**, 아래 횃대에는 **갈색 닭**, 바닥에는 노란 **병아리**가 있어요. 몇 마리씩인지 세어 볼까요?',
              lookFig=F('fmRoost', 420, 300, white=WHITE, brown=BROWN, chick=CHICK), guide='닭 횃대의 흰 닭·갈색 닭·병아리를 세어 보세요.'),
            O('rscrap', '횃대 구석 쪽지', 'scrap', 345, 246, 50, 36, dict(t='?'), in_='roost', keep=True,
              look='횃대 아래 구석에 아주 작은 쪽지가 끼워져 있어요! "우유 보관함 속 작은 서랍 = **흰 닭 수 + 갈색 닭 수 + 병아리 수**"',
              guide='닭 횃대를 크게 보고 오른쪽 아래 구석의 작은 쪽지를 찾아보세요.'),
            O('eggs', '달걀 판', 'fmEggs', 650, 50, 320, 150, dict(trays=TRAYS, loose=LOOSE), keep=True,
              look='오늘 모은 달걀이에요. 달걀 판 하나에는 달걀이 **10개씩** 꽉 차 있고, 파란 그릇에도 달걀이 조금 있어요.',
              lookFig=F('fmEggs', 380, 170, trays=TRAYS, loose=LOOSE), guide='달걀 판과 그릇의 달걀을 10개씩 묶어 세어 보세요.'),
            O('hay', '건초 더미', 'fmHay', 30, 390, 230, 150,
              look='폭신폭신한 건초 더미예요. 닭들이 이 위에서 쉬기도 해요. 여기에는 잠긴 곳이 없네요.', guide='건초 더미는 구경만 해도 돼요.'),
            O('feed', '모이 상자', 'box', 380, 400, 170, 130, dict(c='노랑', lock=True, label='?'),
              look='뚜껑에 숫자 자물쇠 두 칸이 달린 모이 상자예요.',
              lock=Lk('num', str(EGG), '뚜껑의 쪽지: **오늘 모은 달걀은 모두 몇 개일까요?** 숫자 두 개를 맞춰요.',
                      ['달걀 판을 다시 보세요. 달걀 판 하나에 10개씩 들어 있어요.', f'꽉 찬 달걀 판이 {TRAYS}개이니 10개씩 묶음이 {TRAYS}개예요. 그릇의 달걀은 낱개예요.', f'10개씩 묶음 {TRAYS}개와 낱개 {LOOSE}개는 모두 몇 개일까요?'],
                      f'10개씩 묶음 {TRAYS}개(30)와 낱개 {LOOSE}개 → {EGG}', chk=lambda: 10 * TRAYS + LOOSE),
              give=['key'], after='모이 상자가 열렸어요! 모이 속에 **외양간 열쇠**가 묻혀 있어요.',
              guide='모이 상자를 열어 보세요. 달걀을 10개씩 묶어 세면 돼요.'),
            O('bdoor', '외양간 문', 'door', 850, 235, 120, 200, dict(c='갈색', sign='외양간'),
              look='외양간으로 가는 문이에요. 커다란 열쇠 구멍이 보여요.',
              need='key', needMsg='외양간 문이 잠겨 있어요. 소 그림이 있는 열쇠 구멍이 보여요.', useMsg='외양간 열쇠로 문을 열었어요!',
              go='b', after='음매~ 문 너머에서 소 울음소리가 들려요.', guide='외양간 열쇠로 외양간 문을 열어 보세요.'),
        ]),
        dict(id='b', nm='외양간', bg=dict(wall='#E7CBA6', floor='#A9805A', deco='brick'), objs=[
            O('cows', '젖소 줄', 'fmCows', 30, 40, 600, 220, dict(cows=COW_P), keep=True,
              look='젖소 여섯 마리가 나란히 있어요. 목줄 색깔이 모두 다르고, 목줄에 **번호표**가 매달려 있어요.',
              lookFig=F('fmCows', 600, 220, cows=COW_P), guide='젖소마다 번호표의 수와 목줄 색을 살펴보세요.'),
            O('poster', '외양간 무늬 포스터', 'poster', 660, 40, 310, 150, dict(lines=['울타리 무늬'], shapes=POSTER, sc=PSC), keep=True,
              look='울타리에 그려 넣을 무늬가 규칙대로 그려져 있어요. 맨 끝은 **?** 로 지워져 있어요.',
              lookFig=F('poster', 360, 140, lines=['울타리 무늬'], shapes=POSTER, sc=PSC), guide='외양간 무늬 포스터의 규칙을 수첩에 남겨 두세요.'),
            O('milk', '우유 보관함', 'cabinet', 60, 290, 170, 240, dict(c='#E8E3D8', label='우유'),
              look='우유 통을 넣어 두는 보관함이에요. 문에 색깔 자물쇠가 달려 있어요.',
              lock=Lk('color', EVEN, '보관함 문의 글: **번호표의 수가 짝수인 젖소**만 골라, **수가 작은 소부터** 그 소의 목줄 색 단추를 차례로 눌러요.',
                      ['젖소 줄을 다시 보세요. 번호표의 수를 하나씩 읽어 봐요.', '둘씩 짝을 지을 수 있는 수가 짝수예요. 12, 7, 18, 5, 14, 9 중에서 짝수는 어느 것일까요?', '짝수 12, 14, 18을 작은 수부터 늘어놓고 그 소의 목줄 색을 찾아요.'],
                      '짝수는 12(빨강), 14(보라), 18(초록) → 빨강 → 보라 → 초록',
                      chk=lambda: [k for n, k in sorted(COWS) if n % 2 == 0], opts=['빨강', '노랑', '초록', '파랑', '보라', '분홍']),
              give=['tl'], after='보관함 문이 열렸어요! 우유 통 옆에 **찢어진 그림 왼쪽** 조각이 끼워져 있어요. 보관함 안쪽 아래에는 **작은 서랍**도 보여요.',
              guide='짝수 번호 젖소를 찾아 작은 수부터 우유 보관함의 색 단추를 눌러 보세요.'),
            O('mdraw', '보관함 속 작은 서랍', 'drawer', 30, 150, 70, 40, dict(c='#9A6A3F', lock=True), in_='milk',
              lock=Lk('num', str(WHITE + BROWN + CHICK), '보관함 안쪽에 아주 작은 서랍이 또 있어요! 숫자 자물쇠예요. 횃대 구석 쪽지에 적힌 대로 계산해요.',
                      ['닭장의 닭 횃대를 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'흰 닭 {WHITE}마리, 갈색 닭 {BROWN}마리, 병아리 {CHICK}마리예요.', f'{BROWN} + {CHICK}을 먼저 하면 10을 넘어요. 거기에 {WHITE}를 더해 봐요.'],
                      f'흰 닭 {WHITE} + 갈색 닭 {BROWN} + 병아리 {CHICK} = {WHITE + BROWN + CHICK}', chk=lambda: WHITE + BROWN + CHICK),
              give=['tr'], after='작은 서랍 안에 **찢어진 그림 오른쪽** 조각이 들어 있어요.', guide='우유 보관함을 연 뒤 안쪽의 작은 서랍을 눌러 보세요.'),
            O('cdoor', '과수원 창고 가는 문', 'door', 834, 220, 120, 200, dict(c='초록', sign='과수원', keypad=True),
              look='과수원 창고로 가는 뒷문이에요. 모양 단추가 달려 있어요.',
              lock=Lk('shape', GATE, '문의 글: **외양간 무늬 포스터의 ? 자리부터** 규칙대로 모양 세 개를 차례로 눌러요.',
                      ['외양간 무늬 포스터를 수첩에서 열어 보세요.', '△ □ ○ □ 네 개가 되풀이돼요. 포스터의 ? 바로 앞 모양은 △ 였어요.', '△ 다음에 무엇이 오는지 세 번 이어 가요.'],
                      '△ □ ○ □ 가 되풀이되므로 ? 자리부터 □ ○ □', chk=lambda: [PAT[i % 4] for i in range(9, 12)], opts=['○', '△', '□', '☆']),
              go='c', after='딸깍! 문이 열렸어요. 달콤한 사과 냄새가 나요.', guide='무늬 포스터의 규칙대로 과수원 창고 가는 문의 모양을 눌러 보세요.'),
        ]),
        dict(id='c', nm='과수원 창고', bg=dict(wall='#F1DFC0', floor='#9C7650', deco='tile'), objs=[
            O('board', '창고 게시판', 'board', 40, 40, 300, 170, dict(lines=['트랙터 길 그림을', '여기에 붙여 주세요']),
              look='창고 게시판이에요. 무언가를 붙이라고 적혀 있어요.',
              need='plan', needMsg='게시판이 비어 있어요. 트랙터 길 그림을 붙여야 해요.', useMsg='트랙터 길 그림을 게시판에 꾹 붙였어요. 이제 크게 잘 보여요!',
              after='게시판에 붙인 **트랙터 길 그림**이에요. 빨간 점이 트랙터가 건초 더미까지 가는 길이에요. 회색 칸으로는 갈 수 없어요.',
              afterFig=F('map', 300, 240, **MAP), guide='찢어진 두 조각을 합친 그림을 창고 게시판에 붙여 보세요.'),
            O('apples', '사과 바구니', 'fmApples', 40, 380, 280, 160, dict(red=RED, green=GREEN), keep=True,
              look='과수원에서 딴 사과가 바구니에 담겨 있어요. 위쪽은 **빨간 사과**, 아래쪽은 **초록 사과**예요.',
              lookFig=F('fmApples', 300, 180, red=RED, green=GREEN), guide='사과 바구니의 빨간 사과와 초록 사과를 세어 보세요.'),
            O('tractor', '트랙터', 'fmTractor', 380, 280, 280, 200, dict(c='빨강'),
              look='빨간 트랙터예요. 운전대 옆에 화살표 단추가 있어요.',
              lock=Lk('dir', segs(MAP['path']), '트랙터를 건초 더미까지 몰고 가요. **창고 게시판의 트랙터 길 그림**을 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['창고 게시판에 붙인 길 그림을 수첩에서 열어 보세요.', '\'트랙터\'에서 출발해 빨간 점을 따라가요. 처음에는 아래로 가요.', '아래 → 오른쪽 → 그다음은 어느 쪽으로 꺾이나요?'],
                      '아래로 2칸, 오른쪽으로 3칸, 위로 1칸, 오른쪽으로 1칸 가요. 누를 차례: ↓ → ↑ →', chk=lambda: segs('DDRRRUR')),
              give=['gkey'], after='부릉부릉! 트랙터가 길대로 가서 건초 더미를 옮겼어요. 건초 더미가 막고 있던 **창고 문**이 보이고, 바닥에 **창고 열쇠**가 떨어져 있어요!',
              guide='창고 게시판의 길 그림대로 트랙터의 화살표를 눌러 보세요.'),
            O('exit', '창고 문', 'door', 820, 170, 140, 210, dict(c='빨강', sign='출구'), req=['tractor'],
              look='트랙터가 건초 더미를 옮기자 나타난 창고 문이에요.',
              need='gkey', needMsg='창고 문에 빨간 열쇠 구멍이 있어요.', useMsg='창고 열쇠가 딱 맞아요! 이제 문의 숫자판만 남았어요.',
              lock=Lk('num', str(RED + GREEN - CLOCK_H), '숫자판 위 글: **비밀번호 = (바구니의 빨간 사과 수) + (초록 사과 수) − (닭장 시계가 가리키는 시각)**',
                      ['사과 바구니를 살펴보세요. 빨간 사과와 초록 사과를 따로 세요.', f'빨간 사과 {RED}개, 초록 사과 {GREEN}개예요. 닭장 시계는 몇 시였나요?', f'{RED} + {GREEN}을 먼저 구한 뒤 시계의 시각만큼 빼요.'],
                      f'빨간 {RED} + 초록 {GREEN} = {RED + GREEN}, 시계 {CLOCK_H}시 → {RED + GREEN} − {CLOCK_H} = {RED + GREEN - CLOCK_H}', chk=lambda: RED + GREEN - CLOCK_H),
              go='exit', after='창고 문이 열렸어요!', guide='창고 열쇠를 창고 문에 쓰고, 사과 바구니와 닭장 시계 단서로 비밀번호를 계산해요.'),
        ]),
    ],
    flow=['clock', 'roost', 'rscrap', 'eggs', 'feed', 'bdoor', 'cows', 'poster', 'milk', 'mdraw', 'tl+tr', 'cdoor',
          'board', 'apples', 'tractor', 'exit'],
)
