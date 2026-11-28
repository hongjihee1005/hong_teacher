"""수학 방탈출 · 탐정 사무소 탈출 (추천 5학년 · 약수·시간 계산·어림(반올림·버림)·합동·분수의 덧셈과 뺄셈·다각형의 넓이·소수의 곱셈) — 형식은 rooms.py 머리말"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
CLK_H, CLK_M = 3, 20                                   # 멈춘 벽시계
BEFORE = 95                                            # 1시간 35분 전
OPEN_T = CLK_H * 60 + CLK_M - BEFORE                   # 1시 45분
TNOTE = ['탐정 메모', '자료실 문 비밀번호 =', '벽시계가 멈춘 시각보다', '1시간 35분 전 시각']

NUMS = [7, 9, 12, 15, 25]                              # 서류함 놋쇠판의 수
CODE = [(2, '↑'), (3, '→'), (4, '↓'), (6, '←')]          # 약수의 개수 → 화살표
def ndiv(n): return sum(1 for d in range(1, n + 1) if n % d == 0)
def arrows(): m = dict(CODE); return [m[ndiv(n)] for n in NUMS]

PEOPLE = 2651                                          # 축제 참가자(이야기 속 값)
BOARD = ['마을 축제 소식', '참가자', f'{PEOPLE}명', '트로피 시상']
def rnd(n, u): return (n + u // 2) // u * u           # 반올림
def down(n, u): return n // u * u                      # 버림
DRAW = rnd(PEOPLE, 1000) - down(PEOPLE, 100)           # 3000 − 2600 = 400

# 합동 찾기(모눈 칸 좌표): 트로피 받침과 합동인 도형만 고름
TARGET = [(0, 0), (3, 0), (2, 2), (0, 1)]
CANDS = [('○', [(0, 0), (3, 0), (2, 2), (0, 2)]),          # 다름
         ('△', [(2, 0), (2, 3), (0, 2), (1, 0)]),          # 돌린 것
         ('□', [(0, 0), (3, 0), (2, 1), (0, 1)]),          # 다름
         ('☆', [(3, 0), (0, 0), (1, 2), (3, 1)]),          # 뒤집은 것
         ('◇', [(0, 0), (4, 0), (3, 2), (0, 1)]),          # 다름
         ('♡', [(3, 2), (0, 2), (1, 0), (3, 1)])]          # 반 바퀴 돌린 것
def canon(pts):
    """돌리기·뒤집기·옮기기를 모두 해 본 가장 작은 꼴(같으면 합동)"""
    best = None
    for fl in (1, -1):
        for r in range(4):
            q = [(fl * x, y) for x, y in pts]
            for _ in range(r): q = [(-y, x) for x, y in q]
            mx, my = min(x for x, _ in q), min(y for _, y in q); q = [(x - mx, y - my) for x, y in q]
            for seq in (q, q[::-1]):
                for k in range(len(seq)):
                    t = tuple(seq[k:] + seq[:k]); best = t if best is None or t < best else best
    return best
def congr(): return [s for s, pts in CANDS if canon(pts) == canon(TARGET)]
SHAPES = dict(title='트로피 받침과 모양·크기가 같은 도형은?', target=[list(q) for q in TARGET], items=[{'s': s, 'pts': [list(q) for q in pts]} for s, pts in CANDS])

AM, PM = Fraction(3, 8), Fraction(1, 6)                # 조사한 길(전체를 1로)
LEFT = 1 - AM - PM                                     # 11/24
JOURNAL = ['탐정 일지', '오전: 조사할 길의 3/8', '오후: 조사할 길의 1/6', '나머지는 내일 조사!']

TILES = [('빨강', 'para', 8, 5, '평행사변형'), ('파랑', 'tri', 12, 6, '삼각형'), ('초록', 'rhom', 10, 9, '마름모'), ('노랑', 'rect', 7, 6, '직사각형')]
def area(k, a, b): return a * b if k in ('para', 'rect') else a * b // 2
TILEP = dict(title='금고 문 도형 타일 (단위: cm)', tiles=[{'k': k, 'c': cl, 'a': a, 'b': b, 'nm': nm} for cl, k, a, b, nm in TILES])

STEPS, STEP_M = 24, Fraction(35, 100)                  # 고양이 발자국 24개, 한 걸음 0.35 m(이야기 속 값)
DIST = int(STEPS * STEP_M * 100)                       # 8.4 m = 840 cm

ROOM = dict(
    id='detective', title='탐정 사무소 탈출', ico='🔍', acc='#3D4A7A',
    rec='추천 5학년 · 약수·시간 계산·어림·합동·분수의 덧셈과 뺄셈·다각형의 넓이·소수의 곱셈',
    intro='어린이 탐정 체험을 하러 왔다가 탐정 사무소에 갇혔어요! 탐정 사무실·자료실·암호 금고 방의 단서를 모아 사라진 축제 트로피의 행방을 밝히고 **출구**를 열어요.',
    story=['마을 축제 날 아침, 우승 트로피가 감쪽같이 사라졌어요. 우리는 어린이 탐정이 되어 탐정 사무소에 왔어요.',
           '탐정님이 "단서를 풀면 트로피가 있는 곳을 알 수 있어!" 하고 나가자, 철컥! 사무소 문이 잠겼어요.',
           '탐정님이 남긴 단서를 이어 트로피를 찾고 사무소를 빠져나가요!'],
    outro='출구가 열렸어요! 발자국을 따라가 보니 축제 트로피는 고양이 바구니 속에 있었어요. 반짝이는 트로피를 베고 고양이가 새근새근 자고 있었대요. 사건 해결, 탐정 사무소 탈출 성공!',
    mission=dict(title='사라진 트로피를 찾아라!', goal='탐정 사무소 세 방의 단서를 이어 트로피의 행방을 밝히고 출구를 열어요.', tips=['게시판의 작은 쪽지까지 살펴요', '모눈 점을 세어 도형을 견주어요']),
    dialog=[('nar', '마을 축제 날 아침, 우승 트로피가 감쪽같이 사라졌어요.'), ('tori', '어린이 탐정 출동! 돋보기 준비 완료!'), ('nar', '탐정님이 단서만 남기고 나가자, 철컥! 사무소 문이 잠겼어요.'), ('momo', '단서를 풀면 트로피가 있는 곳을 알 수 있대.'), ('tori', '좋아, 사건도 풀고 사무소도 빠져나가자!'), ('momo', '단서는 하나도 빠짐없이 수첩에 정리하자.')],
    outro_dialog=[('tori', '범인은 고양이였어! 새근새근 자고 있네.'), ('momo', '약수, 넓이, 소수의 곱셈으로 사건 해결!')],
    items={'lens': dict(nm='돋보기', k='lens', c='#8A5A2B', de='아주 작은 글씨도 크게 보이는 탐정 돋보기예요'),
           'tl': dict(nm='찢어진 카드 왼쪽', k='tornL', c='#3D4A7A', de='무언가 적힌 카드의 왼쪽 반이에요. 오른쪽 반은 어디 있을까요?'),
           'tr': dict(nm='찢어진 카드 오른쪽', k='tornR', c='#3D4A7A', de='카드의 오른쪽 반이에요. 왼쪽 반과 맞춰 보면 좋겠어요.'),
           'card': dict(nm='비밀 문 카드', k='card', c='#3D4A7A', de='두 조각을 맞춘 카드예요. \'비밀 책장\'이라고 적혀 있어요.')},
    combine=[dict(a='tl', b='tr', make='card', msg='찢어진 두 조각을 맞춰 붙였더니 **비밀 문 카드**가 되었어요! \'비밀 책장\'이라고 적혀 있어요.')],
    scenes=[
        dict(id='a', nm='탐정 사무실', bg=dict(wall='#EDE6D6', floor='#6B5A4A', deco='stripe'), objs=[
            O('clock', '벽시계', 'clock', 40, 40, 130, 130, dict(h=CLK_H, m=CLK_M), keep=True,
              look='사무실 벽시계가 멈춰 있어요. 짧은바늘과 긴바늘을 잘 보세요.', lookFig=F('clock', 170, 170, h=CLK_H, m=CLK_M),
              guide='벽시계가 몇 시 몇 분에 멈췄는지 보세요.', say=('tori', '시계가 멈췄어. 바늘을 잘 봐 두자!')),
            O('tnote', '탐정 메모', 'poster', 40, 200, 210, 150, dict(lines=TNOTE, fs=16, c='#FFFDF4'), keep=True,
              look='탐정님이 남긴 메모예요.', lookFig=F('poster', 340, 190, lines=TNOTE, fs=22, c='#FFFDF4'),
              guide='탐정 메모를 읽고 수첩에 남겨 두세요.', say=('momo', '메모에 적힌 시각, 시계와 함께 계산해 봐야겠어.')),
            O('board', '사건 게시판', 'dt2Board', 280, 30, 340, 230, dict(lines=BOARD), keep=True,
              look=f'사건 게시판이에요. 마을 축제 참가자가 **{PEOPLE}명**이었대요. 사라진 트로피 사진과 "고양이 털이 떨어져 있었음"이라는 쪽지도 붙어 있어요.',
              lookFig=F('dt2Board', 440, 300, lines=BOARD), guide='사건 게시판을 살펴보세요. 크게 보면 구석에 무언가 꽂혀 있어요.', say=('tori', '고양이 털이 떨어져 있었대! 수상한걸?')),
            O('bscrap', '게시판 구석 쪽지', 'scrap', 272, 178, 50, 36, dict(t='?'), in_='board', keep=True,
              look='게시판 구석에 아주 작은 쪽지가 꽂혀 있어요! "파일 서랍 속 작은 서랍 = **축제 참가자 수를 반올림하여 천의 자리까지 나타낸 수 − 버림하여 백의 자리까지 나타낸 수**"',
              guide='사건 게시판을 크게 보고 오른쪽 아래 구석의 작은 쪽지를 찾아보세요.'),
            O('code', '암호표', 'dt2Code', 650, 30, 190, 200, dict(rows=CODE), keep=True,
              look='수를 화살표로 바꾸는 암호표예요. 수의 약수가 몇 개인지에 따라 화살표가 정해져요.', lookFig=F('dt2Code', 300, 300, rows=CODE),
              guide='암호표를 수첩에 남겨 두세요.', say=('momo', '약수가 몇 개인지 세면 화살표가 정해져.')),
            O('files', '서류함', 'dt2Files', 330, 300, 170, 230, dict(nums=NUMS),
              lock=Lk('dir', arrows(), '서류함 옆 화살표 단추예요. **서류함 위 놋쇠판의 수를 왼쪽부터 하나씩 암호표로 바꾸어** 화살표를 차례로 눌러요.',
                      ['놋쇠판의 수와 암호표를 함께 보세요. 수마다 약수를 모두 써 봐요.', '7의 약수는 1, 7로 2개 → ↑예요. 9의 약수는 1, 3, 9예요.', '12의 약수는 1, 2, 3, 4, 6, 12예요. 15의 약수는 1, 3, 5, 15이고, 25의 약수는 1, 5, 25예요. 화살표는 모두 5개예요.'],
                      '약수의 개수로 바꾸면 7(2개) ↑, 9(3개) →, 12(6개) ←, 15(4개) ↓, 25(3개) →예요. 누를 차례: ↑ → ← ↓ →', chk=lambda: arrows()),
              give=['lens'], after='맨 위 서랍이 열렸어요! 서류 사이에 **돋보기**가 있어요.', guide='서류함의 수를 약수의 개수로 바꾸어 화살표를 눌러 보세요.'),
            O('adoor', '자료실 문', 'door', 840, 170, 110, 210, dict(c='갈색', sign='자료실', keypad=True),
              lock=Lk('num', f'{OPEN_T // 60}{OPEN_T % 60:02d}', '자료실 문 숫자판이에요. 탐정 메모에 적힌 시각을 몇 시 몇 분 → 숫자 세 개로 눌러요. (예: 2시 05분이면 205)',
                      ['벽시계와 탐정 메모를 함께 보세요.', f'{CLK_H}시 {CLK_M}분에서 1시간을 먼저 빼면 {CLK_H - 1}시 {CLK_M}분이에요.', f'{CLK_H - 1}시 {CLK_M}분에서 35분을 빼려면 1시간을 60분으로 바꾸어 빼요.'],
                      f'{CLK_H}시 {CLK_M}분 − 1시간 35분 = {OPEN_T // 60}시 {OPEN_T % 60}분 → {OPEN_T // 60}{OPEN_T % 60:02d}',
                      chk=lambda: int(f'{(CLK_H * 60 + CLK_M - BEFORE) // 60}{(CLK_H * 60 + CLK_M - BEFORE) % 60:02d}')),
              go='b', after='자료실 문이 열렸어요!', guide='벽시계 시각에서 1시간 35분 전 시각을 구해 자료실 문을 열어 보세요.'),
        ]),
        dict(id='b', nm='자료실', bg=dict(wall='#DDE4EC', floor='#5E6B78', deco='tile'), objs=[
            O('shapes', '도형 그림판', 'dt2Shapes', 30, 30, 450, 250, SHAPES, keep=True,
              look='왼쪽의 노란 도형은 트로피 받침 모양이에요. 오른쪽 여섯 도형에는 모양 이름표가 붙어 있어요. 모눈 점을 세어 비교해 보세요.',
              lookFig=F('dt2Shapes', 560, 310, **SHAPES), guide='도형 그림판에서 트로피 받침과 모양·크기가 같은 도형을 찾아보세요.', say=('tori', '받침 모양과 똑같은 도형이 어디 있을까?')),
            O('journal', '탐정 일지', 'poster', 510, 40, 220, 160, dict(lines=JOURNAL, fs=16, c='#FFFDF4'), keep=True,
              look='탐정님이 어제 조사한 길을 적은 일지예요. 조사할 길 전체를 1로 보았대요.', lookFig=F('poster', 340, 190, lines=JOURNAL, fs=22, c='#FFFDF4'),
              guide='탐정 일지를 읽고 수첩에 남겨 두세요.'),
            O('paper', '작은 글씨 신문', 'dt2Paper', 760, 40, 210, 160,
              need='lens', needMsg='신문 귀퉁이에 글씨가 너무 작아서 읽을 수 없어요.', useMsg='돋보기를 대니 작은 글씨가 크게 보여요!',
              after='돋보기로 읽은 작은 글씨: "사진 상자는 **트로피 받침과 합동인 도형**의 이름표를 왼쪽 위부터 차례로 눌러야 열려요."',
              guide='서류함에서 찾은 돋보기를 작은 글씨 신문에 대 보세요.'),
            O('pbox', '사진 상자', 'chest', 60, 390, 180, 140, dict(c='#5E6B9A'),
              lock=Lk('shape', congr(), '사진 상자의 모양 단추예요. **신문의 작은 글씨대로** 눌러요.',
                      ['돋보기로 읽은 신문 글과 도형 그림판을 함께 보세요.', '돌리거나 뒤집어서 완전히 겹치면 합동이에요. 변의 길이와 모양을 모눈으로 비교해요.', '트로피 받침은 위 변이 3칸, 왼쪽 변이 1칸이에요. 이름표 ○·□·◇ 도형은 한 변의 길이가 달라요.'],
                      '△(돌린 것) → ☆(뒤집은 것) → ♡(반 바퀴 돌린 것). ○·□·◇는 변의 길이가 달라 합동이 아니에요.',
                      chk=lambda: congr(), opts=['○', '△', '□', '☆', '◇', '♡']),
              give=['tl'], after='상자가 열렸어요! 사진 사이에 **찢어진 카드 왼쪽** 조각이 있어요.', guide='신문의 작은 글씨를 읽고 합동인 도형으로 사진 상자를 열어 보세요.'),
            O('fdraw', '파일 서랍', 'cabinet', 300, 300, 180, 220, dict(c='#9AA7B8', label='파일'),
              lock=Lk('num', f'{LEFT.numerator}{LEFT.denominator}', '파일 서랍 쪽지: **탐정님이 아직 조사하지 않은 길은 전체의 얼마일까요? 분자 뒤에 분모를 이어 쓰세요.** (기약분수로, 숫자 네 개)',
                      ['탐정 일지를 보세요. 길 전체를 1로 보아요.', '3/8과 1/6을 더하려면 분모를 24로 같게 통분해요. 3/8 = 9/24, 1/6 = 4/24예요.', '1 = 24/24에서 조사한 길을 빼요.'],
                      f'3/8 + 1/6 = 9/24 + 4/24 = 13/24, 1 − 13/24 = {LEFT} → {LEFT.numerator}{LEFT.denominator}',
                      chk=lambda: int(f'{(1 - Fraction(3, 8) - Fraction(1, 6)).numerator}{(1 - Fraction(3, 8) - Fraction(1, 6)).denominator}')),
              after='파일 서랍이 열렸어요! 서류 뒤쪽에 **아주 작은 서랍**이 또 있어요.', guide='탐정 일지의 분수로 아직 조사하지 않은 길을 구해 파일 서랍을 열어 보세요.'),
            O('sdraw', '서랍 속 작은 서랍', 'drawer', 55, 120, 70, 40, dict(c='#5E6B78', lock=True), in_='fdraw',
              lock=Lk('num', str(DRAW), '서랍 안 아주 작은 서랍이에요! 숫자 자물쇠예요. 사건 게시판 구석 쪽지에 적힌 대로 계산해요.',
                      ['탐정 사무실의 사건 게시판을 크게 보면 구석에 작은 쪽지가 있어요.', f'참가자 {PEOPLE}명을 반올림하여 천의 자리까지 나타내려면 백의 자리 숫자를 보아요.', '버림하여 백의 자리까지 나타내면 백의 자리 아래를 모두 0으로 해요.'],
                      f'{PEOPLE} → 반올림하여 천의 자리까지 {rnd(PEOPLE, 1000)}, 버림하여 백의 자리까지 {down(PEOPLE, 100)} → {rnd(PEOPLE, 1000)} − {down(PEOPLE, 100)} = {DRAW}',
                      chk=lambda: (PEOPLE + 500) // 1000 * 1000 - PEOPLE // 100 * 100),
              give=['tr'], after='작은 서랍 안에 **찢어진 카드 오른쪽** 조각이 있어요.', guide='파일 서랍을 연 뒤 서랍 안쪽의 작은 서랍을 눌러 보세요.'),
            O('shelf', '비밀 책장', 'bookshelf', 760, 230, 200, 290, dict(books=[['파랑', '빨강', '초록', '노랑', '파랑'], ['갈색', '보라', '파랑', '빨강'], ['초록', '노랑', '갈색', '보라', '빨강']]),
              need='card', needMsg='책장 옆에 카드를 꽂는 좁은 틈이 있어요.', useMsg='비밀 문 카드를 꽂았더니 책장이 빙그르 돌아갔어요!',
              go='c', after='책장 뒤에 숨은 **암호 금고 방**이 나타났어요!', guide='찢어진 카드 두 조각을 합쳐 비밀 책장에 꽂아 보세요.'),
        ]),
        dict(id='c', nm='암호 금고 방', bg=dict(wall='#3A4157', floor='#4A4F5C', deco='brick'), objs=[
            O('tiles', '도형 타일 판', 'dt2Tiles', 40, 30, 470, 340, TILEP, keep=True,
              look='금고 옆 벽에 색깔 도형 타일 네 개가 붙어 있어요. 길이가 cm로 적혀 있고, 점선은 높이나 대각선이에요.',
              lookFig=F('dt2Tiles', 520, 380, **TILEP), guide='도형 타일마다 넓이를 구해 보세요.'),
            O('csafe', '암호 금고', 'safe', 570, 226, 160, 160, dict(colors=['빨강', '노랑', '초록', '파랑']),
              lock=Lk('color', [cl for cl, k, a, b, _ in sorted(TILES, key=lambda t: -area(t[1], t[2], t[3]))], '금고 문의 쪽지: **도형 타일의 넓이가 넓은 것부터** 그 타일의 색을 차례로 눌러요.',
                      ['도형 타일 판을 크게 보세요. 도형마다 넓이를 구하는 방법이 달라요.', '평행사변형은 밑변 × 높이, 삼각형은 밑변 × 높이 ÷ 2예요.', '마름모는 한 대각선 × 다른 대각선 ÷ 2, 직사각형은 가로 × 세로예요.'],
                      '초록 마름모 10 × 9 ÷ 2 = 45 → 노랑 직사각형 7 × 6 = 42 → 빨강 평행사변형 8 × 5 = 40 → 파랑 삼각형 12 × 6 ÷ 2 = 36 (cm²)',
                      chk=lambda: [cl for cl, k, a, b, _ in sorted(TILES, key=lambda t: -area(t[1], t[2], t[3]))], opts=['빨강', '노랑', '초록', '파랑']),
              after='금고가 열렸어요! 그런데 트로피는 없고 고양이 털과 쪽지만 있어요. "이 고양이의 한 걸음은 0.35 m"(이 이야기에서 정한 값이에요). 그러자 바닥에 **고양이 발자국**이 환하게 드러났어요!',
              guide='도형 타일의 넓이를 비교해 암호 금고를 열어 보세요.'),
            O('prints', '고양이 발자국', 'dt2Prints', 40, 400, 760, 140, dict(n=STEPS), req=['csafe'], keep=True,
              look='금고에서 출구까지 고양이 발자국이 이어져 있어요. 발자국 하나가 한 걸음이에요. 모두 몇 걸음일까요?',
              lookFig=F('dt2Prints', 600, 160, n=STEPS), guide='새로 나타난 고양이 발자국을 세어 보세요.', say=('momo', '발자국 하나가 한 걸음이야. 차근차근 세자.')),
            O('exit', '출구', 'door', 830, 170, 120, 210, dict(c='보라', sign='출구', keypad=True),
              lock=Lk('num', str(DIST), '출구 숫자판 위 글: **비밀번호 = 고양이가 금고에서 출구까지 걸어간 거리(cm)** 숫자 세 개.',
                      ['금고 속 쪽지와 바닥의 고양이 발자국을 함께 보세요.', f'한 걸음이 0.35 m이고 발자국이 {STEPS}개예요. 0.35 × {STEPS}를 계산해요.', '구한 거리(m)를 1 m = 100 cm로 바꾸어요.'],
                      f'0.35 × {STEPS} = {float(STEPS * STEP_M):g} m = {DIST} cm', chk=lambda: int(STEPS * Fraction(35, 100) * 100)),
              go='exit', after='출구가 열렸어요!', guide='고양이 발자국을 세어 한 걸음 거리와 곱한 뒤 cm로 바꾸어 출구를 열어 보세요.'),
        ]),
    ],
    flow=['clock', 'tnote', 'board', 'bscrap', 'code', 'files', 'adoor', 'shapes', 'journal', 'paper', 'pbox', 'fdraw', 'sdraw',
          'tl+tr', 'shelf', 'tiles', 'csafe', 'prints', 'exit'],
)
