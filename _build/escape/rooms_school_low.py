"""수학 방탈출 · 별 보는 밤 교실 탈출 (추천 1~2학년 · 보통 · 수 세기·두 자리 덧셈·곱셈구구·몇 시 몇 분·길이 재기·분류·방향) — 형식은 rooms.py 머리말"""
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
STARS = 9                                            # 창문에 보이는 별
ATTEND = [('가온', 'O'), ('나래', 'O'), ('다온', 'X'), ('라희', 'O'), ('마루', 'O'), ('바다', 'O'), ('사랑', 'X'), ('아라', 'O'), ('자람', 'O')]
CAME = sum(1 for _, m in ATTEND if m == 'O')         # 별 보기에 온 친구 7명
DAYS = ['월', '화', '수', '목', '금']
TT = [['국어', '수학', '국어', '음악', '수학'],
      ['수학', '음악', '수학', '국어', '국어'],
      ['음악', '미술', '체육', '수학', '음악'],
      ['체육', '국어', '음악', '미술', '체육']]
MUSIC = sum(r.count('음악') for r in TT)             # 음악 시간 5번
ART_ITEMS = [{'k': '○', 'c': '빨강', 'n': 5}, {'k': '△', 'c': '노랑', 'n': 3}, {'k': '□', 'c': '파랑', 'n': 6}, {'k': '☆', 'c': '초록', 'n': 2}]
CLOCK_H, CLOCK_M = 7, 45                             # 교실 벽시계 7시 45분(바늘이 겹치지 않게)
MAP = dict(n=4, m=5, start=[0, 0], path='RRDDRRD', block=[[1, 1], [3, 1], [0, 2], [1, 3], [3, 3]], sl='교실', gl='음악실')
XYLO = [('빨강', 16), ('주황', 8), ('노랑', 13), ('초록', 11), ('파랑', 6), ('보라', 9)]   # 실로폰 막대 길이(cm)
XCOLS = [c for c, _ in XYLO]
LONG = max(n for _, n in XYLO)                       # 가장 긴 막대 16 cm
BARS = [{'c': c, 'len': n} for c, n in XYLO]
BOARD = ['운동장 쪽 문 비밀번호', '교실 시계의 몇 분과', '가장 긴 막대 길이를 더해요']
LOCKER_AT = 7

ROOM = dict(
    id='school-low', title='별 보는 밤 교실 탈출', ico='🌙', acc='#2F8F5B',
    rec='추천 2학년 · 수 세기·두 자리 덧셈·곱셈구구·몇 시 몇 분·길이 재기·분류·방향',
    intro='별 보기 행사 날 밤, 별자리 카드를 가지러 갔다가 교실에 갇혔어요! 교실과 음악실의 단서로 운동장 쪽 문을 열어요.',
    story=['오늘은 별 보기 행사 날! 두고 온 별자리 카드를 가지러 깜깜한 교실에 들어왔어요.',
           '휘잉― 바람에 앞문이 쾅 닫히고 자물쇠가 걸렸어요.',
           '단서를 모아 운동장 쪽 문을 열고 별 보기 행사에 가요!'],
    outro='운동장 쪽 문이 활짝 열렸어요! 밤하늘에 별이 반짝이고, 친구들이 "어서 와!" 하고 손을 흔들어요. 교실을 탈출했어요!',
    items={'key': dict(nm='작은 열쇠', k='key', c='#C9A24B', de='열쇠 고리에 \'선생님 책상\'이라고 적혀 있어요'),
           'torch': dict(nm='손전등', k='torch', c='#F2C230', de='깜깜한 곳을 밝힐 수 있어요'),
           'keyb': dict(nm='운동장 쪽 문 열쇠', k='key', c='#2F8F5B', de='초록색 큰 열쇠예요'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#2F8F5B', de='초록 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#2F8F5B', de='초록 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **운동장 쪽 문 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='우리 교실', bg=dict(wall='#2C3A5A', floor='#5A4A3A', deco='stripe'), objs=[
            O('clock', '벽시계', 'clock', 40, 30, 110, 110, dict(h=CLOCK_H, m=CLOCK_M), keep=True,
              look='교실 벽시계예요. 지금 **몇 시 몇 분**일까요?', lookFig=F('clock', 160, 160, h=CLOCK_H, m=CLOCK_M),
              guide='벽시계가 몇 시 몇 분을 가리키는지 보고 수첩에 남겨 두세요.'),
            O('window', '창문', 'scWin', 170, 30, 220, 170, dict(n=STARS), keep=True,
              look='달 옆에 **별**이 반짝여요. 별은 모두 몇 개일까요?', lookFig=F('scWin', 340, 260, n=STARS),
              guide='창문으로 보이는 별을 하나씩 세어 보세요.'),
            O('timetable', '시간표', 'scTimetable', 410, 30, 270, 190, dict(days=DAYS, rows=TT, title='우리 반 시간표', foot=40, footText='2학년 3반'), keep=True,
              look='우리 반 시간표예요. **음악** 시간은 모두 몇 번일까요?',
              lookFig=F('scTimetable', 400, 260, days=DAYS, rows=TT, title='우리 반 시간표', foot=30, footText='2학년 3반'),
              guide='시간표에서 음악 시간이 몇 번인지 세어 보세요.'),
            O('tscrap', '시간표 구석 쪽지', 'scrap', 210, 152, 50, 34, dict(t='?'), in_='timetable', keep=True,
              look='구석에 작은 쪽지가 있어요! "악기장 속 작은 서랍: **음악 시간 수 × 창문의 별 수**"',
              guide='시간표를 크게 보고 아래 구석의 작은 쪽지를 찾아보세요.'),
            O('artboard', '모양 게시판', 'scArtboard', 700, 30, 270, 170, dict(items=ART_ITEMS, title='모양 찾기 놀이'), keep=True,
              look='모양 종이가 여기저기 붙어 있어요. **모양끼리 나누어** 세어 볼까요?',
              lookFig=F('scArtboard', 380, 240, items=ART_ITEMS, title='모양 찾기 놀이'),
              guide='모양 게시판의 모양을 종류별로 세어 보세요.'),
            O('attend', '별 보기 출석부', 'scAttend', 40, 160, 130, 200, dict(rows=ATTEND, title='별 보기 출석부', xc='#1E7FE0'), keep=True,
              look='빨간 **○**는 온 친구, 파란 **✕**는 못 온 친구예요.',
              lookFig=F('scAttend', 240, 330, rows=ATTEND, title='별 보기 출석부', xc='#1E7FE0'),
              guide='출석부에서 ○ 표시가 몇 개인지 세어 보세요.'),
            O('locker', '사물함', 'scLocker', 700, 220, 270, 190, dict(cols=4, rows=3, lockAt=LOCKER_AT),
              lock=Lk('num', str(STARS + CAME), '**창문의 별 수**와 **출석부의 ○ 수**를 더해요. 두 자리 수를 만들어요.',
                      ['창문의 별과 출석부의 ○를 따로 세어 보세요.', f'별은 {STARS}개예요. 출석부에서 ○는 몇 개인가요?', f'{STARS} + {CAME}은 10을 넘어요. 10을 만들고 남은 수를 더해 봐요.'],
                      f'별 {STARS}개 + ○ {CAME}개 = {STARS + CAME}', chk=lambda: STARS + CAME),
              give=['key'], after=f'{LOCKER_AT}번 사물함이 열렸어요! 안에 **작은 열쇠**가 있어요. 고리에 \'선생님 책상\'이라고 적혀 있어요.',
              guide='자물쇠가 걸린 사물함을 열어 보세요. 별과 출석부의 ○를 세면 돼요.'),
            O('desk', '선생님 책상', 'desk', 190, 300, 220, 200, dict(items=[{'k': 'book', 'c': '초록', 'n': 2}, {'k': 'jar', 'c': '하늘', 'n': 1}]),
              need='key', needMsg='책상 서랍이 잠겨 있어요. 작은 열쇠 구멍이 보여요.', useMsg='작은 열쇠로 서랍을 열었어요.',
              give=['torch'], after='서랍 안에 **손전등**과 **음악실 가는 길** 그림이 있어요. 빨간 점을 따라가요.',
              afterFig=F('map', 300, 240, **MAP), guide='작은 열쇠로 선생님 책상 서랍을 열어 보세요.'),
            O('backdoor', '교실 뒷문', 'door', 450, 245, 130, 200, dict(c='파랑', sign='뒷문', keypad=True),
              need='torch', needMsg='복도가 너무 깜깜해요. 불빛이 있으면 좋겠어요.', useMsg='손전등을 켰더니 뒷문에 화살표 단추가 보여요!',
              lock=Lk('dir', segs(MAP['path']), '**음악실 가는 길** 그림을 보고 가는 쪽을 차례로 눌러요. 같은 쪽으로 여러 칸 가도 한 번만 눌러요.',
                      ['책상 서랍에서 찾은 길 그림을 수첩에서 보세요.', '\'교실\'에서 빨간 점을 따라가요. 처음에는 오른쪽으로 가요.', '오른쪽, 아래, 그다음은? 화살표는 모두 4개예요.'],
                      '오른쪽으로 2칸, 아래로 2칸, 오른쪽으로 2칸, 아래로 1칸 가요. 누를 차례: → ↓ → ↓', chk=lambda: segs('RRDDRRD')),
              go='b', after='딸깍! 뒷문이 열렸어요. 손전등을 비추며 음악실로 가요.',
              guide='손전등을 뒷문에 비추고, 길 그림대로 화살표를 눌러 보세요.'),
        ]),
        dict(id='b', nm='음악실', bg=dict(wall='#2F2747', floor='#5C4A3B', deco='brick'), objs=[
            O('board', '음악실 칠판', 'board', 40, 30, 340, 160, dict(lines=BOARD, fs=22), keep=True,
              look='운동장 쪽 문을 여는 방법이 적혀 있어요.', lookFig=F('board', 380, 170, lines=BOARD, fs=23),
              guide='음악실 칠판을 읽고 수첩에 남겨 두세요.'),
            O('xylo', '실로폰 막대', 'scXylo', 40, 230, 330, 250, dict(bars=BARS, max=18), keep=True,
              look='실로폰 막대를 자 위에 놓았어요. 왼쪽 끝은 모두 **0**이에요. 막대마다 몇 cm일까요?',
              lookFig=F('scXylo', 440, 320, bars=BARS, max=18),
              guide='실로폰 막대의 길이를 자로 읽어 보세요.'),
            O('cabinet', '악기장', 'cabinet', 410, 170, 170, 210, dict(c='#B98552', label='악기장'),
              lock=Lk('color', [c for n, c in sorted(((n, c) for c, n in XYLO if n > 10), reverse=True)],
                      '**10 cm보다 긴 막대만** 골라, **긴 것부터** 그 막대의 색을 눌러요.',
                      ['막대 오른쪽 끝이 자의 몇에 닿는지 읽어요.', '10 cm보다 긴 막대는 세 개예요.', '세 막대 가운데 가장 긴 것부터 눌러요.'],
                      '빨강 16 cm → 노랑 13 cm → 초록 11 cm (주황 8, 파랑 6, 보라 9 cm는 10 cm보다 짧아요)',
                      chk=lambda: [c for n, c in sorted(((n, c) for c, n in XYLO if n > 10), reverse=True)], opts=XCOLS),
              after='악기장이 열렸어요! 안은 텅 비었는데, 아래에 **작은 서랍**이 보여요.',
              guide='실로폰 막대의 길이를 재어 악기장을 열어 보세요.'),
            O('sdraw', '악기장 속 작은 서랍', 'drawer', 50, 140, 70, 40, dict(c='#8A5A2B', lock=True), in_='cabinet',
              lock=Lk('num', str(MUSIC * STARS), '악기장 속 작은 서랍이에요. **시간표 구석 쪽지**대로 계산해요.',
                      ['교실 시간표를 크게 보세요. 구석에 쪽지가 있어요.', f'시간표의 음악 시간은 {MUSIC}번, 창문의 별은 {STARS}개예요.', f'{MUSIC}의 단 곱셈구구에서 {MUSIC} × {STARS}를 찾아요.'],
                      f'음악 시간 {MUSIC}번 × 별 {STARS}개 = {MUSIC * STARS}', chk=lambda: MUSIC * STARS),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 있어요. 손잡이는 없어요.', guide='악기장을 연 뒤 안쪽 작은 서랍을 눌러 보세요.'),
            O('piano', '피아노', 'scPiano', 600, 190, 250, 200,
              lock=Lk('shape', [s['k'] for s in sorted(ART_ITEMS, key=lambda s: -s['n'])],
                      '모양 게시판에 **많이 붙은 모양부터** 차례로 눌러요.',
                      ['수첩에서 모양 게시판을 보세요. 모양끼리 나누어 세어요.', '○, △, □, ☆을 하나씩 표시하며 세어요.', '가장 많은 모양은 6개예요. 그다음은?'],
                      '□ 6개 → ○ 5개 → △ 3개 → ☆ 2개', chk=lambda: [s['k'] for s in sorted(ART_ITEMS, key=lambda s: -s['n'])], opts=['○', '△', '□', '☆']),
              give=['kb1'], after='"도레미~" 건반 위에 **열쇠 손잡이**가 있어요! 커튼 뒤에서 **운동장 쪽 문**도 나타났어요.',
              guide='모양 게시판의 모양을 세어 많은 것부터 피아노 단추를 눌러 보세요.'),
            O('drum', '작은 북', 'scDrum', 410, 410, 130, 120,
              look='둥둥! 작은 북이에요. 잠긴 곳은 없어요.', guide='작은 북에는 잠긴 곳이 없어요. 다른 물건을 살펴보세요.'),
            O('exit', '운동장 쪽 문', 'door', 870, 150, 110, 230, dict(c='초록', sign='운동장'), req=['piano'],
              need='keyb', needMsg='문에 초록색 열쇠 구멍이 있어요.', useMsg='열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(CLOCK_M + LONG), '**교실 시계의 몇 분**과 **가장 긴 막대 길이(cm)**를 더해요. 두 자리 수를 만들어요.',
                      ['교실 시계는 몇 시 몇 분이었나요? 긴바늘을 보면 몇 분인지 알 수 있어요.', f'시계는 {CLOCK_H}시 {CLOCK_M}분이에요. 가장 긴 막대는 몇 cm였나요?', f'{CLOCK_M} + {LONG}은 받아올림에 조심해요.'],
                      f'{CLOCK_H}시 {CLOCK_M}분의 \'분\' {CLOCK_M} + 가장 긴 막대 {LONG} cm = {CLOCK_M + LONG}', chk=lambda: CLOCK_M + LONG),
              go='exit', after='운동장 쪽 문이 열렸어요!', guide='열쇠를 운동장 쪽 문에 쓰고, 시계의 분과 가장 긴 막대 길이를 더해 비밀번호를 맞춰요.'),
        ]),
    ],
    flow=['clock', 'window', 'attend', 'timetable', 'tscrap', 'artboard', 'locker', 'desk', 'backdoor',
          'board', 'xylo', 'cabinet', 'sdraw', 'piano', 'kb1+kb2', 'exit'],
)
