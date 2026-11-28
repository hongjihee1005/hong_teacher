"""수학 방탈출 · 보물섬 탈출 (추천 3~4학년 · 보통) — 형식은 rooms.py 머리말"""
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

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀) — 모두 이야기 속 값
COCO = 7                                        # 야자나무 한 그루의 코코넛
TREES = 16                                      # 섬의 야자나무 그루 수(병 편지)
LANTERN = 9                                     # 동굴의 등불
MAP = dict(n=4, m=6, start=[0, 3], path='UURRRRUR', block=[[1, 2], [1, 3], [2, 2], [3, 2], [3, 3], [5, 2], [1, 0], [2, 0]], sl='선착장', gl='상자')
JARS = [('빨강', Fraction(1, 3)), ('노랑', Fraction(1, 6)), ('초록', Fraction(1, 2)), ('파랑', Fraction(1, 5))]
JAR_P = [{'c': c, 'label': f'{f.numerator}/{f.denominator}'} for c, f in JARS]
UNIT = ['◇', '○', '○', '□']                     # 동굴 벽화 규칙
WALL = UNIT * 2 + ['◇', '?']
TIDE_H, TIDE_M = 2, 15                          # 선착장 시계 2시 15분
WAIT_H, WAIT_M = 1, 50                          # 밀물은 1시간 50분 뒤
NOTE = ['밀물 안내', '선착장 시계의 시각부터', '1시간 50분 뒤에', '밀물이 들어와요']

def tide():
    m = TIDE_H * 60 + TIDE_M + WAIT_H * 60 + WAIT_M
    return m // 60 * 100 + m % 60                # 4시 5분 → 405

ROOM = dict(
    id='pirate-mid', title='보물섬 탈출', ico='⚓', acc='#1F6E8C',
    rec='추천 3학년 · 곱셈·단위분수 크기 비교·시간 계산·규칙·방향·색깔 순서',
    intro='보물섬 탐험 중에 바람이 불어 선착장 문이 잠겨 버렸어요! 해변과 보물 동굴을 오가며 단서를 모아, 밀물 시각에 맞춰 선착장 문을 열어요.',
    story=['보물 지도를 들고 보물섬 해변에 내렸어요. 앵무새가 "보물! 보물!" 하며 앞장섰어요.',
           '그런데 쿵! 세찬 바람에 선착장 문이 닫히고 큰 자물쇠가 철컥 걸렸어요. 타고 온 보트로 돌아갈 수가 없어요!',
           '해변과 보물 동굴의 단서를 모아 선착장 열쇠를 찾고, 밀물 시각에 맞춰 문을 열어요!'],
    outro='선착장 문이 끼익 열렸어요! 마침 밀물이 들어와 모래에 얹혀 있던 보트가 둥실 떠올랐어요. 얼른 보트에 올라탔어요. 동굴에서 찾은 금화는 섬 친구들과 나눠 가졌어요. 보물섬을 탈출했어요!',
    items={'torch': dict(nm='손전등', k='torch', c='#F2C230', de='어두운 곳을 밝힐 수 있어요'),
           'tmap': dict(nm='보물 지도', k='paper', c='#C8402F', de='X 표시가 있는 보물 지도예요'),
           'tm1': dict(nm='지도 왼쪽 조각', k='tornL', c='#C8402F', de='찢어진 보물 지도의 왼쪽이에요. 오른쪽 조각은 어디 있을까요?'),
           'tm2': dict(nm='지도 오른쪽 조각', k='tornR', c='#C8402F', de='찢어진 보물 지도의 오른쪽이에요. 커다란 X 표시 반쪽이 보여요.'),
           'dkey': dict(nm='선착장 열쇠', k='key', c='#1F6E8C', de='바닷물에 젖은 파란 열쇠예요')},
    combine=[dict(a='tm1', b='tm2', make='tmap', msg='찢어진 두 조각을 맞대어 붙였더니 **보물 지도**가 되었어요! 동굴 바닥의 보석 문 앞에 X 표시가 있어요.')],
    scenes=[
        dict(id='a', nm='보물섬 해변', bg=dict(wall='#9ED8F0', floor='#E9D3A0'), objs=[
            O('palm', '야자나무', 'prPalm', 30, 20, 200, 360, dict(n=COCO), keep=True,
              look='커다란 야자나무에 코코넛이 열려 있어요. 한 그루에 코코넛이 몇 개일까요?',
              lookFig=F('prPalm', 220, 300, n=COCO), guide='야자나무 한 그루에 코코넛이 몇 개인지 세어 보세요.'),
            O('clock', '선착장 시계', 'clock', 260, 40, 120, 120, dict(h=TIDE_H, m=TIDE_M, c='#EAF6FB'), keep=True,
              look='선착장 기둥에 달린 시계예요. 시계가 멈춰 있어요! **몇 시 몇 분**일까요?',
              lookFig=F('clock', 160, 160, h=TIDE_H, m=TIDE_M, c='#EAF6FB'), guide='선착장 시계가 몇 시 몇 분인지 수첩에 남겨 두세요.'),
            O('jars', '보석 병', 'bottles', 400, 60, 260, 170, dict(items=JAR_P), keep=True,
              look='해변 선반 위에 색깔 유리로 된 보석 병 네 개가 있어요. 속은 보이지 않지만, 이름표에 **보석이 병의 얼마만큼 찼는지** 분수로 적혀 있어요.',
              lookFig=F('bottles', 420, 210, items=JAR_P), guide='보석 병에 적힌 분수를 수첩에 남겨 두세요. 동굴에서 쓰여요.'),
            O('cave', '동굴 입구', 'prCave', 680, 150, 170, 230, dict(sign='보물 동굴'),
              look='바위 사이로 동굴 입구가 보여요. 안이 깜깜해서 들어갈 수가 없어요.',
              need='torch', needMsg='동굴 안이 너무 깜깜해요. 비출 것이 있으면 좋겠어요.', useMsg='손전등을 켜니 동굴 안이 환해졌어요!',
              go='b', after='손전등 불빛 너머로 동굴 안쪽이 보여요.', guide='손전등으로 동굴 입구를 비춰 보세요.'),
            O('dock', '선착장 문', 'door', 870, 160, 115, 220, dict(c='파랑', sign='선착장'),
              look='선착장으로 나가는 문이에요. 열쇠 구멍과 숫자판이 있어요.',
              need='dkey', needMsg='문에 파란 열쇠 구멍이 있어요. 선착장 열쇠가 필요해요.', useMsg='선착장 열쇠가 딱 맞아요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(tide()), '숫자판 위 글: **비밀번호 = 밀물이 들어오는 시각.** 시와 분을 이어 써요(분은 두 자리, 예: 7시 8분 → 708).',
                      ['해변의 선착장 시계와 동굴의 밀물 안내판을 함께 보세요.', f'{TIDE_H}시 {TIDE_M}분에서 1시간 뒤는 {TIDE_H + 1}시 {TIDE_M}분, 거기서 50분 더 가요.', f'{TIDE_M}분 + 50분 = 65분 = 1시간 5분이에요.'],
                      f'{TIDE_H}시 {TIDE_M}분 + {WAIT_H}시간 {WAIT_M}분 = 3시간 65분 → 4시 5분 → 405', chk=lambda: 405),
              go='exit', after='선착장 문이 열렸어요!', guide='선착장 열쇠를 쓰고, 선착장 시계와 밀물 안내판으로 밀물 시각을 구해요.'),
            O('bottle', '유리병 편지', 'prBottle', 250, 430, 170, 100, keep=True,
              look=f'모래에 유리병이 꽂혀 있어요. 안에 든 편지: "이 섬에는 똑같이 생긴 야자나무가 **{TREES}그루** 있단다. 편지 뒷면에는 내가 선착장에서 나침반 상자까지 걸어간 길을 그려 두었지. — 늙은 해적 선장"',
              lookFig=F('map', 330, 240, **MAP), guide='유리병 속 편지와 뒷면 지도를 수첩에 남겨 두세요.'),
            O('compass', '나침반 상자', 'prCompass', 450, 405, 150, 130,
              look='뚜껑에 나침반 무늬가 있는 상자예요. 방향 단추가 달려 있어요. (지도의 위쪽이 북쪽이에요.)',
              lock=Lk('dir', segs(MAP['path']), '상자 글: 선장이 선착장에서 이 상자까지 걸어간 길대로, **방향이 바뀌는 차례대로** 화살표를 눌러요.',
                      ['수첩에서 유리병 편지 뒷면의 지도를 열어 보세요. \'선착장\'에서 빨간 점을 따라가요.', '처음에는 위(북쪽)로 가요. 바위를 돌아 그다음은?'],
                      '위로 2칸, 오른쪽으로 4칸, 위로 1칸, 오른쪽으로 1칸 가요. 누를 차례: ↑ → ↑ →', chk=lambda: segs('UURRRRUR')),
              give=['tm1'], after='상자가 열렸어요! 안에 찢어진 **지도 왼쪽 조각**이 있어요.', guide='유리병 편지 뒷면의 지도대로 나침반 상자의 방향 단추를 눌러요.'),
            O('boatbox', '보트 사물함', 'prCrate', 650, 400, 170, 130, dict(lock=True, label='?'),
              look='보트 도구를 넣어 두는 나무 사물함이에요. 숫자 자물쇠가 있어요.',
              lock=Lk('num', str(TREES * COCO), '뚜껑 글: **이 섬의 야자나무에 열린 코코넛은 모두 몇 개일까요?**',
                      ['야자나무 한 그루에 코코넛이 몇 개인지 세어 보세요.', '유리병 편지에 섬의 야자나무가 몇 그루인지 적혀 있어요.', f'{TREES} × {COCO}를 계산해요. 10 × {COCO}와 6 × {COCO}로 나누어 생각해도 좋아요.'],
                      f'한 그루에 {COCO}개 × {TREES}그루 → {TREES} × {COCO} = {TREES * COCO}', chk=lambda: 16 * 7),
              give=['torch'], after='사물함이 열렸어요! 구명조끼 아래에 **손전등**이 있어요.', guide='코코넛 수와 유리병 편지로 보트 사물함을 열어요.'),
        ]),
        dict(id='b', nm='보물 동굴', bg=dict(wall='#5A4E44', floor='#7A6B5C', deco='brick'), objs=[
            O('wall', '동굴 벽화', 'poster', 30, 30, 320, 150, dict(lines=['동굴 벽화'], shapes=WALL, c='#E8DCC4'), keep=True,
              look='동굴 벽에 모양이 규칙대로 그려져 있어요. 맨 끝은 **?** 로 지워져 있어요. 어떤 모양 묶음이 되풀이될까요?',
              lookFig=F('poster', 340, 140, lines=['동굴 벽화'], shapes=WALL, c='#E8DCC4'), guide='동굴 벽화에서 되풀이되는 모양 묶음을 찾아 두세요.'),
            O('wscrap', '벽화 구석 쪽지', 'scrap', 266, 8, 48, 34, dict(t='?'), in_='wall', keep=True,
              look='벽화 구석 틈에 작은 쪽지가 끼어 있어요! "보물 상자 속 작은 서랍 = **동굴 등불 수 × 야자나무 한 그루의 코코넛 수**"',
              guide='동굴 벽화를 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
            O('lanterns', '동굴 등불', 'prLanterns', 380, 20, 360, 130, dict(n=LANTERN), keep=True,
              look='동굴 천장에 등불이 줄지어 매달려 있어요. 몇 개일까요?',
              lookFig=F('prLanterns', 380, 130, n=LANTERN), guide='동굴 등불이 몇 개인지 세어 보세요.'),
            O('note', '밀물 안내판', 'board', 770, 30, 210, 160, dict(lines=NOTE, fs=18), keep=True,
              look='늙은 해적 선장이 남긴 안내판이에요. 밀물이 언제 들어오는지 적혀 있어요.',
              lookFig=F('board', 300, 170, lines=NOTE, fs=21), guide='밀물 안내판을 읽고 수첩에 남겨 두세요.'),
            O('gemwall', '보석 문', 'prGemwall', 30, 210, 260, 170, dict(label='보석 순서'),
              look='돌벽에 빨강·노랑·초록·파랑 보석이 박혀 있어요. 보석을 누를 수 있어요.',
              lock=Lk('color', [k for k, f in sorted(JARS, key=lambda r: -r[1])], '돌벽 글: **해변의 보석 병 가운데 보석이 많이 찬 병부터** 그 색 보석을 차례로 눌러요.',
                      ['해변 선반의 보석 병에 적힌 분수를 보세요.', '분자가 1로 같은 분수(단위분수)는 분모가 작을수록 더 커요.', '1/2, 1/3, 1/5, 1/6 차례예요. 각각 무슨 색 병이었나요?'],
                      '초록 1/2 → 빨강 1/3 → 파랑 1/5 → 노랑 1/6 (단위분수는 분모가 작을수록 커요)',
                      chk=lambda: [c for _, c in sorted([(-Fraction(1, 3), '빨강'), (-Fraction(1, 6), '노랑'), (-Fraction(1, 2), '초록'), (-Fraction(1, 5), '파랑')])], opts=['빨강', '노랑', '초록', '파랑']),
              after='보석을 차례로 누르자 드르륵! 돌벽 아래 바닥이 열리며 **X 표시 모래밭**이 나타났어요.',
              guide='해변 보석 병의 분수 크기를 비교해 보석 문을 열어요.'),
            O('tchest', '보물 상자', 'prChest', 320, 400, 200, 140, dict(lock=True),
              look='무거운 보물 상자예요. 뚜껑에 모양 단추가 있어요.',
              lock=Lk('shape', [UNIT[i % 4] for i in range(9, 13)], '뚜껑 글: **동굴 벽화의 ? 자리부터** 규칙대로 모양 네 개를 차례로 눌러요.',
                      ['수첩의 동굴 벽화를 열어 보세요. ◇ ○ ○ □ 가 한 묶음으로 되풀이돼요.', '벽화에서 마지막으로 보이는 모양은 ◇ 였어요. ◇ 다음에는 무엇이 올까요?'],
                      '◇ ○ ○ □ 가 되풀이되므로 ? 자리부터 ○ ○ □ ◇', chk=lambda: [['◇', '○', '○', '□'][i % 4] for i in range(9, 13)], opts=['○', '△', '□', '◇']),
              after='상자가 열렸어요! 금화가 가득해요. 상자 앞쪽에는 작은 서랍이 하나 달려 있어요.',
              guide='동굴 벽화의 규칙대로 보물 상자의 모양 단추를 눌러요.'),
            O('cdraw', '상자 속 작은 서랍', 'drawer', 12, 86, 64, 38, dict(c='#7A4E2A', lock=True), in_='tchest',
              lock=Lk('num', str(LANTERN * COCO), '보물 상자 앞쪽에 작은 서랍이 있어요! 숫자 자물쇠예요. 벽화 구석 쪽지에 적힌 대로 계산해요.',
                      ['동굴 벽화를 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'동굴 등불은 {LANTERN}개, 야자나무 한 그루의 코코넛은 몇 개였나요?'],
                      f'등불 {LANTERN} × 코코넛 {COCO} = {LANTERN * COCO}', chk=lambda: 9 * 7),
              give=['tm2'], after='작은 서랍 안에 찢어진 **지도 오른쪽 조각**이 있어요.', guide='보물 상자를 연 뒤 상자 앞쪽의 작은 서랍을 눌러 보세요.'),
            O('xspot', 'X 표시 모래밭', 'prXspot', 600, 420, 230, 110, req=['gemwall'],
              look='돌벽 아래에 모래밭이 나타났어요. 그런데 모래밭이 넓어서 어디를 파야 할지 모르겠어요.',
              need='tmap', needMsg='어디를 파야 할까요? 완성된 보물 지도가 있으면 알 수 있을 것 같아요.', useMsg='보물 지도의 X 표시와 똑같은 자리를 찾아 모래를 팠어요.',
              give=['dkey'], after='모래 속에서 **선착장 열쇠**가 나왔어요!', guide='두 조각을 합친 보물 지도를 X 표시 모래밭에 써 보세요.'),
        ]),
    ],
    flow=['palm', 'clock', 'jars', 'bottle', 'boatbox', 'compass', 'cave',
          'wall', 'wscrap', 'lanterns', 'note', 'tchest', 'cdraw', 'tm1+tm2', 'gemwall', 'xspot', 'dock'],
)
