"""수학 방탈출 · 학교 도서관 탈출 (추천 3~4학년 · 쉬움, 3학년 수학) — 형식은 rooms.py 머리말"""
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

# 그림에 그린 것과 계산에 쓰는 수를 한곳에
LB_ROWS, LB_PER = 4, 8                                   # 큰 책장: 4칸, 칸마다 8권
LB_SHELF = [[c] * LB_PER for c in ['빨강', '노랑', '초록', '파랑']]
LB_CLOCK = (2, 40)                                       # 열람실 시계 2시 40분
LB_CLOSE = (4, 10)                                       # 문 닫는 시각 4시 10분
LB_THICK = 25                                            # 그림책 한 권 두께 2 cm 5 mm = 25 mm
LB_MAP = dict(n=5, m=5, start=[0, 4], path='RRRUULUU', block=[[0, 2], [1, 2], [1, 3], [4, 1], [4, 2], [3, 0], [0, 0]], sl='책상', gl='보관실')
LB_REC = [('빨강', '3×6', 3 * 6), ('노랑', '32÷4', 32 // 4), ('초록', '5×3', 5 * 3), ('파랑', '63÷7', 63 // 7)]
LB_REC_LINES = ['이번 주 대출 기록'] + [f'{c} 모둠  {e}권' for c, e, _ in LB_REC]
LB_STK = 12                                              # 별 모양 스티커 12장: 1/2은 ○, 1/3은 △, 나머지는 ☆
LB_STK_N = {'○': LB_STK // 2, '△': LB_STK // 3}
LB_STK_N['☆'] = LB_STK - sum(LB_STK_N.values())
LB_MEMO = ['사서 선생님 메모', '도서관 문 닫는 시각', '4시 10분']

ROOM = dict(
    id='library', title='학교 도서관 탈출', ico='📚', acc='#2EAA6A',
    rec='추천 3학년 · 곱셈·나눗셈·분수·길이(mm·cm)·시간 계산·방향·색깔·모양',
    intro='책 읽기에 푹 빠져 있다가 고개를 들어 보니 도서관에 아무도 없어요! 문도 모두 잠겼어요. 열람실과 책 보관실을 둘러보며 단서를 모아, 도서관 문이 닫히기 전에 빠져나가요.',
    story=['재미있는 책에 푹 빠져 있다가 고개를 들어 보니 도서관에 아무도 없어요.', '딸깍! 불이 반쯤 꺼지고 출구 문에 자물쇠가 걸렸어요.', '책 사이에 숨은 단서를 모아 도서관 문이 닫히기 전에 빠져나가요!'],
    outro='출구 문이 활짝 열렸어요! 복도에서 사서 선생님이 "아직 있었구나!" 하며 웃어 주셨어요. 학교 도서관을 탈출했어요!',
    items={'keyS': dict(nm='작은 열쇠', k='key', c='#C9A24B', de='고리에 \'사서 책상\'이라고 적혀 있어요'),
           'lens': dict(nm='돋보기', k='lens', c='#2E7D5B', de='작은 글씨를 크게 볼 수 있어요'),
           'card': dict(nm='도서 카드', k='card', c='#3B6FD6', de='도서관 기계에 꽂는 카드 같아요'),
           'keyB': dict(nm='큰 열쇠', k='key', c='#E5534B', de='빨간 큰 열쇠예요'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#E5534B', de='큰 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#E5534B', de='큰 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyB', msg='손잡이와 몸통을 딸깍 끼웠더니 **큰 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='열람실', bg=dict(wall='#E4F2E6', floor='#B98552', deco='stripe'), objs=[
            O('clock', '벽시계', 'clock', 40, 30, 110, 110, dict(h=LB_CLOCK[0], m=LB_CLOCK[1]), keep=True,
              look='열람실 벽시계예요. 짧은바늘과 긴바늘을 잘 보고 **지금 몇 시 몇 분인지** 읽어 두세요.',
              lookFig=F('clock', 160, 160, h=LB_CLOCK[0], m=LB_CLOCK[1]), guide='벽시계가 몇 시 몇 분을 가리키는지 읽어 두세요.'),
            O('shelf', '큰 책장', 'bookshelf', 190, 40, 200, 340, dict(books=LB_SHELF), keep=True,
              look='큰 책장이에요. 칸마다 책이 **똑같은 수만큼** 꽂혀 있어요. 책장은 몇 칸이고, 한 칸에 몇 권씩 있을까요?',
              lookFig=F('bookshelf', 220, 300, books=LB_SHELF), guide='큰 책장이 몇 칸인지, 한 칸에 책이 몇 권인지 세어 보세요.'),
            O('poster', '안내 포스터', 'poster', 450, 50, 200, 140, dict(lines=['도서관 안내', '. . . . . .']),
              look='포스터 아래쪽에 깨알 같은 글씨가 적혀 있어요.',
              need='lens', needMsg='글씨가 너무 작아서 읽을 수 없어요. 크게 볼 수 있는 물건이 있으면 좋겠어요.', useMsg='돋보기를 대니 작은 글씨가 크게 보여요!',
              after='작은 글씨: "우리 도서관 그림책은 모두 두께가 **2 cm 5 mm** 예요. 책장에 꽂을 때 참고하세요."',
              guide='돋보기로 안내 포스터의 작은 글씨를 읽어 보세요.'),
            O('globe', '지구본', 'globe', 280, 410, 110, 130,
              look='빙글빙글 돌아가는 지구본이에요. 돌려 보니 재미있지만, 단서는 없는 것 같아요.', guide='지구본은 구경만 해도 돼요.'),
            O('cart', '반납 수레', 'box', 40, 400, 170, 130, dict(c='초록', lock=True, label='?'),
              look='책을 돌려놓는 반납 수레예요. 뚜껑에 숫자 자물쇠가 달려 있어요.',
              lock=Lk('num', str(LB_ROWS * LB_PER), '뚜껑에 붙은 쪽지: **큰 책장에 꽂힌 책은 모두 몇 권일까요?**',
                      ['큰 책장은 몇 칸인가요? 한 칸에는 책이 몇 권씩 있나요?', f'{LB_PER}권씩 {LB_ROWS}칸이에요. 같은 수씩 여러 번이면 곱셈!'],
                      f'{LB_PER}권씩 {LB_ROWS}칸 → {LB_PER} × {LB_ROWS} = {LB_ROWS * LB_PER}(권)', chk=lambda: LB_ROWS * LB_PER),
              give=['keyS'], after='수레 뚜껑이 열렸어요! 안에 **작은 열쇠**가 있어요. 열쇠 고리에 \'사서 책상\'이라고 적혀 있어요.',
              guide='반납 수레의 숫자 자물쇠를 열어 보세요. 큰 책장의 책 수를 곱셈으로 구해요.'),
            O('desk', '사서 책상', 'desk', 580, 300, 220, 230, dict(items=[{'k': 'book', 'c': '보라', 'n': 2}, {'k': 'jar', 'c': '하늘', 'n': 1}]),
              look='사서 선생님 책상이에요. 서랍에 작은 열쇠 구멍이 있어요.',
              need='keyS', needMsg='서랍이 잠겨 있어요. 작은 열쇠 구멍이 보여요.', useMsg='작은 열쇠로 서랍을 열었어요.',
              give=['lens'], after='서랍 안에 **돋보기**와 **도서관 안내도**가 있어요. 안내도에는 책상에서 보관실까지 가는 길이 빨간 점으로 그려져 있어요.',
              afterFig=F('map', 300, 300, **LB_MAP), guide='작은 열쇠로 사서 책상 서랍을 열어 보세요.'),
            O('sdoor', '보관실 문', 'door', 840, 170, 130, 210, dict(c='초록', sign='보관실'),
              look='책 보관실 문이에요. 손잡이 옆에 화살표 단추가 달려 있어요.',
              lock=Lk('dir', segs(LB_MAP['path']), '화살표 단추 위 글: **도서관 안내도의 길을 따라, 가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩의 도서관 안내도를 열어 보세요. \'책상\'에서 출발해 빨간 점을 따라가요.', '처음에는 오른쪽으로 3칸 가요. 그다음은 어느 쪽일까요?'],
                      '오른쪽 3칸 → 위로 2칸 → 왼쪽 1칸 → 위로 2칸이니 → ↑ ← ↑', chk=lambda: segs('RRRUULUU')),
              go='b', after='딸깍! 보관실 문이 열렸어요.', guide='안내도의 길을 보고 보관실 문의 화살표 단추를 눌러 보세요.'),
        ]),
        dict(id='b', nm='책 보관실', bg=dict(wall='#F4E7D0', floor='#9A7B5C', deco='brick'), objs=[
            O('memo', '메모판', 'board', 40, 40, 260, 150, dict(lines=LB_MEMO, fs=22), keep=True,
              look='사서 선생님의 메모판이에요. 도서관 문이 닫히는 시각이 적혀 있어요!',
              lookFig=F('board', 300, 160, lines=LB_MEMO, fs=24), guide='메모판에서 도서관 문이 닫히는 시각을 확인하세요.'),
            O('mscrap', '메모판 구석 쪽지', 'scrap', 200, 108, 46, 34, dict(t='?'), in_='memo', keep=True,
              look='메모판 구석에 아주 작은 쪽지가 꽂혀 있어요! "진열장 속 작은 서랍 = **열람실 큰 책장 한 칸의 책 수 × 대출 기록표 초록 모둠의 책 수**"',
              guide='메모판을 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
            O('record', '대출 기록표', 'poster', 330, 40, 280, 210, dict(lines=LB_REC_LINES, fs=21), keep=True,
              look='이번 주에 모둠마다 빌려 간 책 수가 계산식으로 적혀 있어요. 모둠마다 계산하면 몇 권일까요?',
              lookFig=F('poster', 300, 220, lines=LB_REC_LINES, fs=23), guide='대출 기록표의 계산식을 모둠마다 계산해 보세요.'),
            O('panel', '색깔 단추판', 'panel', 650, 60, 200, 130, dict(colors=['빨강', '노랑', '초록', '파랑'], label='카드를 꽂아요', done='열림'),
              look='벽에 붙은 단추판이에요. 빨강·노랑·초록·파랑 단추와 카드 꽂는 곳이 있어요.',
              need='card', needMsg='화면에 "도서 카드를 꽂아 주세요"라고 떠 있어요.', useMsg='도서 카드를 꽂았더니 색깔 단추에 불이 들어왔어요!',
              lock=Lk('color', [c for c, _, v in sorted(LB_REC, key=lambda r: -r[2])], '화면 글: **이번 주에 책을 많이 빌린 모둠부터** 그 모둠의 색 단추를 차례로 눌러요.',
                      ['대출 기록표의 계산식을 모두 계산해요: 3×6, 32÷4, 5×3, 63÷7', '빨강 18권, 노랑 8권, 초록 15권, 파랑 9권이에요. 많은 것부터 늘어놓아요.'],
                      '빨강 3×6=18 → 초록 5×3=15 → 파랑 63÷7=9 → 노랑 32÷4=8',
                      chk=lambda: [c for _, c in sorted([(-(3 * 6), '빨강'), (-(32 // 4), '노랑'), (-(5 * 3), '초록'), (-(63 // 7), '파랑')])]),
              after='삐리릭! 옆 책장이 스르륵 밀려나더니 그 뒤에 숨어 있던 **비밀 상자**가 보여요.',
              guide='도서 카드를 단추판에 꽂고, 대출 기록표의 책 수가 많은 모둠부터 색을 눌러요.'),
            O('case', '유리 진열장', 'case', 40, 230, 230, 300, dict(items=[{'k': 'book', 'c': '보라', 'n': 2}, {'k': 'book', 'c': '주황', 'n': 2}, {'k': 'book', 'c': '하늘', 'n': 2}], lock=True),
              look='새로 들어온 그림책이 놓인 유리 진열장이에요. 숫자 자물쇠가 잠겨 있어요.',
              lock=Lk('num', str(LB_PER * LB_THICK // 10), '자물쇠 옆 글: **열람실 큰 책장의 한 칸에 꽂힌 그림책을 모두 쌓으면 높이는 몇 cm일까요?**',
                      ['큰 책장 한 칸에는 그림책이 몇 권이었나요? 안내 포스터의 작은 글씨도 떠올려 보세요.', f'2 cm 5 mm = 25 mm예요. 한 칸 {LB_PER}권의 두께는 25 × {LB_PER} = ? mm', f'10 mm = 1 cm예요. {LB_PER * LB_THICK} mm는 몇 cm일까요?'],
                      f'2 cm 5 mm = {LB_THICK} mm, {LB_THICK} × {LB_PER} = {LB_THICK * LB_PER} mm = {LB_THICK * LB_PER // 10} cm',
                      chk=lambda: LB_PER * LB_THICK // 10),
              give=['card'], after=f'진열장 안에 **도서 카드**와 스티커 쪽지가 있어요. 쪽지: "비밀 상자 스티커 {LB_STK}장 중 **1/2은 ○, 1/3은 △, 나머지는 ☆** 이에요."',
              guide='책장 한 칸의 책 수와 포스터의 그림책 두께로 진열장 자물쇠를 열어요.'),
            O('cdraw', '진열장 속 작은 서랍', 'drawer', 140, 220, 70, 40, dict(c='#B98552', lock=True), in_='case',
              lock=Lk('num', str(LB_PER * (5 * 3)), '진열장 아래쪽에 아주 작은 서랍이 숨어 있어요! 숫자 세 개 자물쇠예요. 메모판 구석 쪽지에 적힌 대로 계산해요.',
                      ['책 보관실 메모판을 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'큰 책장 한 칸에는 {LB_PER}권, 대출 기록표의 초록 모둠은 5×3권이에요.', f'5 × 3 = 15, {LB_PER} × 15 = {LB_PER} × 10 + {LB_PER} × 5로 나눠 곱해 보세요.'],
                      f'초록 모둠 5 × 3 = 15권, {LB_PER} × 15 = {LB_PER * 10} + {LB_PER * 5} = {LB_PER * 15}', chk=lambda: LB_PER * dict((c, v) for c, _, v in LB_REC)['초록']),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='유리 진열장을 연 뒤 진열장 아래쪽의 작은 서랍을 눌러 보세요.'),
            O('plant', '화분', 'plant', 320, 400, 100, 130,
              look='잎이 무성한 화분이에요. 화분 밑을 들춰 봤지만 아무것도 없어요.', guide='화분은 구경만 해도 돼요.'),
            O('chest', '비밀 상자', 'chest', 640, 400, 180, 125, dict(c='보라'), req=['panel'],
              look='책장 뒤에 숨어 있던 상자예요. 뚜껑에 모양 단추가 달려 있어요.',
              lock=Lk('shape', [k for k, _ in sorted(LB_STK_N.items(), key=lambda kv: -kv[1])], '뚜껑 글: **스티커 수가 많은 모양부터** 차례로 눌러요.',
                      ['진열장에서 찾은 스티커 쪽지를 보세요. 스티커는 모두 12장이에요.', '12의 1/2은 6, 12의 1/3은 4예요. 나머지 ☆는 몇 장일까요?'],
                      f'○는 12의 1/2 = {LB_STK_N["○"]}장, △는 12의 1/3 = {LB_STK_N["△"]}장, ☆는 12 − 6 − 4 = {LB_STK_N["☆"]}장 → ○ △ ☆',
                      chk=lambda: [k for _, k in sorted([(-(12 // 2), '○'), (-(12 // 3), '△'), (-(12 - 12 // 2 - 12 // 3), '☆')])]),
              give=['kb1'], after='비밀 상자가 열렸어요! 안에 **열쇠 손잡이**가 있어요. 그런데 손잡이만 있고 몸통이 없어요.', guide='스티커 쪽지의 분수로 모양마다 몇 장인지 구해 비밀 상자를 열어요.'),
            O('exit', '출구 문', 'door', 860, 170, 120, 210, dict(c='빨강', sign='출구'),
              look='도서관 출구 문이에요. 큰 열쇠 구멍과 숫자판이 있어요.',
              need='keyB', needMsg='출구 문에 큰 열쇠 구멍이 있어요.', useMsg='큰 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str((LB_CLOSE[0] * 60 + LB_CLOSE[1]) - (LB_CLOCK[0] * 60 + LB_CLOCK[1])),
                      '숫자판 위 글: **열람실 시계의 시각부터 도서관 문이 닫히는 시각까지는 몇 분일까요?**',
                      ['열람실 시계는 2시 40분이었어요. 문 닫는 시각은 메모판에 있어요.', '2시 40분 → 3시까지 20분, 3시 → 4시까지 60분, 4시 → 4시 10분까지 10분'],
                      '2시 40분부터 4시 10분까지: 20분 + 60분 + 10분 = 90분 (1시간 30분)',
                      chk=lambda: (4 * 60 + 10) - (2 * 60 + 40)),
              go='exit', after='출구 문이 열렸어요!', guide='큰 열쇠를 출구 문에 쓰고, 열람실 시계와 메모판의 시각으로 걸리는 시간을 구해요.'),
        ]),
    ],
    flow=['clock', 'shelf', 'cart', 'desk', 'poster', 'sdoor', 'memo', 'mscrap', 'record', 'case', 'cdraw', 'panel', 'chest', 'kb1+kb2', 'exit'],
)
