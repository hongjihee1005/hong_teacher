"""수학 방탈출 2 — 방 자료 (2026-11-26 선생님 요청: '문제 몇 개 풀고 끝'이 아니라 진짜 방탈출처럼)

방 = 장면(방 그림) 1~3개 + 물건들. 물건을 눌러 살펴보면 단서가 수첩에 모이고, 얻은 물건은 가방에 들어감.
  O(id, 이름, 그림, x, y, w, h, p=그림 설정, in_=부모 물건 id(크게 볼 때만 보이는 숨은 곳 — x·y는 부모 그림 안 좌표, 부모가 열려야 보임), look=살펴본 글, lookFig=단서 그림, keep=수첩에 남김,
    need=필요한 가방 물건 id, needMsg, useMsg, lock=Lk(...), give=[가방에 넣을 물건 id], after=연 뒤 글, afterFig,
    go=다음 장면 id 또는 'exit', req=[먼저 열려야 보이는 물건 id], guide='어디를 볼까?' 힌트 글)
  Lk(종류 'num'|'dir'|'color'|'shape', 답, 물음, 힌트 [2~3개], 풀이, chk=답을 따로 계산하는 lambda, opts=고를 것)
    num 답은 숫자 글자('15'), 나머지는 목록(['↑','→'] / ['빨강','파랑'] / ['○','△']).
  장면 배경 bg = {wall, floor, deco: 'stripe'|'brick'|'stars'|'bubble'|'tile'}. 방 그림 크기 1000×560, 바닥은 y 381부터.
  story = 처음 이야기 줄 3개쯤, combine = [dict(a, b, make, msg)] 가방 물건 합치기(flow에는 'a+b').
  flow = 풀이 차례(물건 id). build.py가 이 차례대로 따라가 탈출할 수 있는지, 자물쇠 답이 chk와 같은지 점검함.
그림 이름은 art.js의 A: door clock shelf table box chest desk safe poster board frame robot plant rug window screen panel porthole
  cabinet sign lamp pipe statue case counter scale globe microscope banner cage fence bookshelf note conveyor bottles map,
  숨은 곳용 drawer(작은 서랍, p.lock) scrap(작은 쪽지, p.t 글자) brick(빠지는 벽돌) hole(작은 구멍).
가방 물건 모양 k: key battery torch lens card gear coin piece paper gem candy, 합치기용 khead(열쇠 손잡이) kblade(열쇠 몸통) tornL·tornR(찢어진 종이 왼쪽·오른쪽) stick(막대) hook(갈고리).
"""
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

# ───────────── 1~2학년 · 보통 · 장난감 공장 ─────────────
TOY_SHELF = [[{'k': 'block', 'c': '빨강', 'n': 4}, {'k': 'ball', 'c': '노랑', 'n': 2}],
             [{'k': 'block', 'c': '파랑', 'n': 5}],
             [{'k': 'block', 'c': '초록', 'n': 3}, {'k': 'bear', 'c': '갈색', 'n': 2}]]
TOY_MAP = dict(n=4, m=5, start=[0, 3], path='UURRDRR', sl='로봇', gl='단추')
TOY_PAINT = [{'c': '빨강', 'label': '9+6'}, {'c': '파랑', 'label': '8+4'}, {'c': '노랑', 'label': '7+7'}, {'c': '초록', 'label': '5+8'}]
TOY_SHAPES = ['○', '△', '□', '○', '△', '□', '○', '?']
TOY = dict(
    id='toy', title='장난감 공장 탈출', ico='🧸', acc='#E0861A', rec='추천 1학년 · 덧셈·뺄셈·규칙·시각·모양·방향',
    intro='공장장 로봇이 고장 나서 장난감 공장 문이 모두 잠겼어요! 조립실과 포장실을 둘러보며 단서를 모아 출구 문을 열어요.',
    story=['장난감 공장 견학을 하던 날, 공장장 로봇이 갑자기 "삐― 고장!" 하고 멈췄어요.', '쿵! 출구 문이 닫히고 큰 자물쇠가 철컥 걸렸어요.', '로봇을 고치고 숨은 단서를 모아 공장을 빠져나가요!'],
    outro='출구 문이 활짝 열렸어요! 고친 로봇이 손을 흔들며 배웅해요. 장난감 공장을 탈출했어요!',
    items={'keys': dict(nm='작은 열쇠', k='key', c='#C9A24B', de='작은 열쇠 구멍에 맞을 것 같아요'),
           'bat': dict(nm='건전지', k='battery', c='#3DA35D', de='무언가를 움직이게 할 수 있어요'),
           'gear': dict(nm='톱니바퀴', k='gear', c='#8A929C', de='기계에서 빠진 부품 같아요'),
           'keyb': dict(nm='큰 열쇠', k='key', c='#E5534B', de='빨간 큰 열쇠예요'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#E5534B', de='큰 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#E5534B', de='큰 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **큰 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='조립실', bg=dict(wall='#FBE7C6', floor='#C9A27A', deco='stripe'), objs=[
            O('clock', '벽시계', 'clock', 70, 40, 120, 120, dict(h=3, m=0), keep=True,
              look='벽시계예요. 그런데 시계가 멈춰 있어요! 짧은바늘과 긴바늘이 가리키는 곳을 잘 보세요.', lookFig=F('clock', 150, 150, h=3, m=0),
              guide='벽시계가 몇 시를 가리키는지 보세요.'),
            O('poster', '모양 포스터', 'poster', 50, 180, 180, 150, dict(lines=['모양 규칙'], shapes=TOY_SHAPES), keep=True,
              look='포스터에 모양이 규칙대로 놓여 있어요. 맨 끝은 **?** 로 지워져 있어요.', lookFig=F('poster', 300, 120, lines=['모양 규칙'], shapes=TOY_SHAPES),
              guide='모양 포스터의 규칙을 수첩에 남겨 두세요.'),
            O('shelf', '장난감 선반', 'shelf', 250, 120, 320, 260, dict(rows=TOY_SHELF), keep=True,
              look='장난감 선반이에요. 블록과 공과 곰 인형이 놓여 있어요. 무엇이 몇 개 있는지 세어 볼까요?', lookFig=F('shelf', 320, 260, rows=TOY_SHELF),
              guide='장난감 선반에 무엇이 몇 개 있는지 세어 보세요.'),
            O('toybox', '장난감 상자', 'box', 60, 400, 170, 130, dict(c='주황', lock=True, label='?'),
              lock=Lk('num', '12', '상자 뚜껑의 쪽지: **선반에 있는 블록은 모두 몇 개일까요?** 숫자 두 개를 맞춰요.',
                      ['선반은 세 칸이에요. 칸마다 블록만 세어요(공과 곰 인형은 빼요).', '빨간 블록 4개, 파란 블록 5개, 초록 블록 3개를 더해요.'],
                      '4 + 5 + 3 = 12', chk=lambda: 4 + 5 + 3),
              give=['keys'], after='상자가 열렸어요! 안에 **작은 열쇠**가 있어요. 열쇠 고리에 \'책상 서랍\'이라고 적혀 있어요.',
              guide='장난감 상자를 열어 보세요. 선반의 블록을 세면 돼요.'),
            O('desk', '책상', 'desk', 790, 230, 190, 200, dict(items=[{'k': 'book', 'c': '파랑', 'n': 3}]),
              need='keys', needMsg='책상 서랍이 잠겨 있어요. 작은 열쇠 구멍이 보여요.', useMsg='작은 열쇠로 서랍을 열었어요.',
              give=['bat'], after='서랍 안에 **건전지**와 **로봇 길 지도**가 있어요. 지도에는 로봇이 갈 길이 빨간 점으로 그려져 있어요.',
              afterFig=F('map', 300, 240, **TOY_MAP), guide='작은 열쇠로 책상 서랍을 열어 보세요.'),
            O('robot', '고장 난 로봇', 'robot', 430, 390, 100, 140, dict(c='#9AA7B8'),
              need='bat', needMsg='로봇이 꺼져 있어요. 배에 건전지 넣는 곳이 비어 있어요.', useMsg='건전지를 넣었더니 로봇 눈에 불이 들어왔어요! "길을 알려 주세요."',
              lock=Lk('dir', segs(TOY_MAP['path']), '로봇에게 길을 알려 줘요. 서랍에서 찾은 지도를 보고, **로봇이 가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['수첩의 로봇 길 지도를 열어 보세요. 로봇에서 출발해 빨간 점을 따라가요.', '처음에는 위로 가요. 그다음 오른쪽, 그다음은?'],
                      '위로 2칸 → 오른쪽으로 2칸 → 아래로 1칸 → 오른쪽으로 2칸이니 ↑ → ↓ →', chk=lambda: segs('UURRDRR')),
              after='로봇이 지도대로 걸어가 벽의 단추를 눌렀어요! 덜컹, 벽에 **작은 문**이 나타났어요.', guide='건전지를 로봇에 넣고 지도대로 길을 알려 주세요.'),
            O('sdoor', '작은 문', 'door', 620, 200, 120, 180, dict(c='초록', sign='포장실'), req=['robot'], go='b',
              look='로봇이 찾아 준 작은 문이에요.', after='문 너머에 포장실이 보여요.', guide='새로 생긴 작은 문으로 포장실에 가 보세요.'),
        ]),
        dict(id='b', nm='포장실', bg=dict(wall='#DDEFF7', floor='#9FB6C7', deco='tile'), objs=[
            O('board', '작업 칠판', 'board', 60, 50, 280, 160, dict(lines=['오늘 포장할 곰 인형:', '조립실 선반의 곰 인형', '+ 16개']), keep=True,
              look='작업 칠판에 오늘 할 일이 적혀 있어요.', lookFig=F('board', 300, 160, lines=['오늘 포장할 곰 인형:', '조립실 선반의 곰 인형', '+ 16개']),
              guide='작업 칠판을 읽고 수첩에 남겨 두세요.'),
            O('tnote', '칠판 구석 쪽지', 'scrap', 222, 112, 46, 34, dict(t='?'), in_='board', keep=True,
              look='칠판 구석에 아주 작은 쪽지가 꽂혀 있어요! "금고 속 작은 서랍 = **조립실 선반의 블록 수 − 선반의 공 수**"',
              guide='작업 칠판을 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
            O('paint', '물감 통', 'bottles', 360, 200, 290, 180, dict(items=TOY_PAINT), keep=True,
              look='물감 통 네 개에 계산식이 붙어 있어요. 통마다 계산하면 얼마일까요?', lookFig=F('bottles', 300, 150, items=TOY_PAINT),
              guide='물감 통에 붙은 계산식을 살펴보세요.'),
            O('safe', '색깔 금고', 'safe', 680, 230, 150, 150, dict(colors=['빨강', '노랑', '초록', '파랑']),
              lock=Lk('color', ['파랑', '초록', '노랑', '빨강'], '금고 문에 쪽지: **물감 통의 계산 값이 작은 것부터** 그 통의 색을 차례로 눌러요.',
                      ['물감 통마다 계산해요: 9+6, 8+4, 7+7, 5+8.', '값이 12, 13, 14, 15인 통은 무슨 색일까요?'],
                      '파랑 8+4=12 → 초록 5+8=13 → 노랑 7+7=14 → 빨강 9+6=15',
                      chk=lambda: [c for _, c in sorted([(9 + 6, '빨강'), (8 + 4, '파랑'), (7 + 7, '노랑'), (5 + 8, '초록')])], opts=['빨강', '노랑', '초록', '파랑']),
              give=['gear'], after='금고 안에 **톱니바퀴**와 쪽지가 있어요. 쪽지: "벨트는 조립실 포스터의 모양 규칙을 따라 움직여요."',
              guide='물감 통의 계산 값을 작은 것부터 정리해 색깔 금고를 열어 보세요.'),
            O('sdraw', '금고 속 작은 서랍', 'drawer', 40, 96, 70, 40, dict(c='#8A929C', lock=True), in_='safe',
              lock=Lk('num', '10', '금고 안쪽에 아주 작은 서랍이 또 있어요! 숫자 두 개 자물쇠예요. 칠판 구석 쪽지에 적힌 대로 계산해요.',
                      ['칠판을 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', '선반의 블록은 4 + 5 + 3 = 12개, 공은 2개예요.'],
                      '블록 12 − 공 2 = 10', chk=lambda: (4 + 5 + 3) - 2),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 들어 있어요. 손잡이는 없어요.', guide='금고를 연 뒤 금고 안쪽의 작은 서랍을 눌러 보세요.'),
            O('belt', '컨베이어 벨트', 'conveyor', 60, 340, 420, 170, dict(shapes=['?', '?', '?']),
              need='gear', needMsg='벨트가 멈춰 있어요. 톱니바퀴 하나가 빠진 자리가 보여요.', useMsg='톱니바퀴를 끼웠더니 벨트가 움찔해요. 모양 단추를 맞게 눌러야 움직여요.',
              lock=Lk('shape', ['△', '□', '○'], '벨트에 놓일 모양을 정해요. **조립실 포스터의 ? 자리부터** 규칙대로 모양 세 개를 차례로 눌러요.',
                      ['수첩의 모양 포스터를 열어 보세요. ○ △ □ 가 되풀이돼요.', '포스터의 마지막 모양은 ○ 였어요. 그다음은?'],
                      '○ △ □ 가 되풀이되므로 ? 자리부터 △ □ ○', chk=lambda: [['○', '△', '□'][i % 3] for i in range(7, 10)], opts=['○', '△', '□', '☆']),
              give=['kb1'], after='벨트가 움직이며 상자 사이로 **열쇠 손잡이**가 굴러 나왔어요! 그런데 손잡이만 있고 몸통이 없어요.', guide='톱니바퀴를 벨트에 끼우고 포스터 규칙대로 모양을 눌러 보세요.'),
            O('exit', '출구 문', 'door', 840, 170, 120, 210, dict(c='빨강', sign='출구'),
              need='keyb', needMsg='출구 문에 큰 열쇠 구멍이 있어요.', useMsg='큰 열쇠가 딱 맞아요! 이제 문의 숫자판만 남았어요.',
              lock=Lk('num', '15', '숫자판 위 글: **비밀번호 = (오늘 포장할 곰 인형 수) − (조립실 시계가 가리키는 시각)**',
                      ['칠판: 포장할 곰 인형 = 조립실 선반의 곰 인형 + 16개. 선반에 곰 인형이 몇 개였지요?', '곰 인형 2 + 16 = 18. 시계는 몇 시였나요? 18에서 빼요.'],
                      '곰 인형 2 + 16 = 18, 시계 3시 → 18 − 3 = 15', chk=lambda: (2 + 16) - 3),
              go='exit', after='출구 문이 열렸어요!', guide='큰 열쇠를 출구 문에 쓰고, 칠판과 시계 단서로 비밀번호를 계산해요.'),
        ]),
    ],
    flow=['clock', 'poster', 'shelf', 'toybox', 'desk', 'robot', 'sdoor', 'board', 'tnote', 'paint', 'safe', 'sdraw', 'belt', 'kb1+kb2', 'exit'],
)

# 방마다 파일 rooms_<id>.py 의 ROOM (없으면 건너뜀). 메뉴·이동 줄 차례 = 이 차례.
import importlib, os
# 결과 코드의 방 번호 = ORDER 안의 자리(바꾸면 예전 결과 코드가 다른 방으로 읽힘 — 새 방은 뒤에 붙일 것). 메뉴 차례는 메뉴 HTML에서 정함.
ORDER = ['candy', 'toy', 'zoo', 'library', 'space', 'submarine', 'lab', 'museum', 'castle',
         'park-low', 'park-mid', 'park-high', 'pirate-low', 'pirate-mid', 'pirate-high',
         'school-low', 'school-mid', 'school-high', 'dino-low', 'dino-mid', 'dino-high',
         'camp', 'farm', 'aquarium', 'station', 'airport', 'circus', 'bakery', 'greenhouse', 'detective']
ONLY = [x for x in os.environ.get('ESC_ONLY', '').split(',') if x]   # 여럿이 함께 만들 때 내 방만 점검·빌드
ROOMS = []
for _id in ORDER:
    if ONLY and _id not in ONLY: continue
    if _id == 'toy': ROOMS.append(TOY); continue
    try: _r = importlib.import_module('rooms_' + _id.replace('-', '_')).ROOM
    except ModuleNotFoundError: continue
    assert _r['id'] == _id, f'rooms_{_id}: id가 {_r["id"]}'
    ROOMS.append(_r)
