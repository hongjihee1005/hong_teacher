"""수학 방탈출 2 — 동물원 탈출 (1~2학년 · 도전, 2학년 수준: 곱셈구구·받아올림·받아내림·몇 시 몇 분·m와 cm·긴 규칙·방향)"""
from rooms import O, Lk, F, segs

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
BEAR_ROW, ROWS = 4, 3                        # 기념품 선반: 한 칸에 곰 인형 4개씩 3칸
SOUV = [[{'k': 'bear', 'c': '갈색', 'n': BEAR_ROW}, {'k': 'ball', 'c': b, 'n': 2}] for b in ('빨강', '노랑', '파랑')]
CLOCK = (2, 40)                              # 광장 시계 2시 40분
MAP = dict(n=5, m=6, start=[0, 4], path='UURRRUURRDD', block=[[1, 3], [1, 0], [2, 1], [4, 1], [4, 3], [5, 3], [2, 4]], sl='우리길', gl='사육사')
FEED = [('빨강', '52−17', 52 - 17), ('노랑', '43−9', 43 - 9), ('초록', '61−28', 61 - 28), ('파랑', '80−44', 80 - 44)]
BOTTLES = [{'c': c, 'label': l} for c, l, _ in FEED]
PAT = ['○', '△', '△', '□']                   # 우리길 포스터의 모양 규칙
POSTER = [PAT[i % 4] for i in range(9)] + ['?']
GIR_OLD, GIR_NOW = (1, 57), (1, 95)          # 아기 기린 키: 지난달·오늘 (m, cm)
GIR = ['아기 기린 키', f'지난달 {GIR_OLD[0]} m {GIR_OLD[1]} cm', f'오늘 {GIR_NOW[0]} m {GIR_NOW[1]} cm']
FISH_ROW, FISH_ROWS = 6, 4                   # 먹이 선반: 한 칸에 물고기 6마리씩 4칸
FISH = [[{'k': 'fish', 'c': '하늘', 'n': FISH_ROW}] for _ in range(FISH_ROWS)]
MEMO = ['정문 비밀번호 =', '아기 기린이 자란 길이(cm)', '+ 먹이 선반의 물고기 수']
cm = lambda mcm: mcm[0] * 100 + mcm[1]
GROW = cm(GIR_NOW) - cm(GIR_OLD)             # 38

ROOM = dict(
    id='zoo', title='동물원 탈출', ico='🐰', acc='#B8860B',
    rec='추천 2학년 · 곱셈구구·받아올림·받아내림·몇 시 몇 분·길이(m·cm)·모양 규칙·방향·색깔 순서',
    intro='동물 구경에 푹 빠진 사이 동물원 문이 닫혔어요! 정문 광장, 동물 우리길, 사육사 방의 단서로 정문을 열어요.',
    story=['동물 구경에 푹 빠져 있는데 "오늘 동물원 문을 닫습니다" 하는 방송이 들렸어요.', '끼익, 쾅! 정문이 닫히고 커다란 자물쇠가 걸려 버렸어요.', '사육사 아저씨가 남긴 단서를 따라 정문 열쇠를 찾아 나가요!'],
    outro='끼이익, 정문이 열렸어요! 곰과 기린이 잘 가라고 인사하는 것 같아요. 동물원을 탈출했어요!',
    items={'card': dict(nm='출입 카드', k='card', c='#3B6FD6', de='\'동물 우리길\'이라고 적힌 카드예요'),
           'key': dict(nm='작은 열쇠', k='key', c='#C9A24B', de='작은 상자에 맞을 것 같아요'),
           'keyb': dict(nm='정문 열쇠', k='key', c='#B8860B', de='크고 무거운 금색 열쇠예요'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#B8860B', de='금색 정문 열쇠의 손잡이만 있어요. 몸통은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#B8860B', de='금색 정문 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **정문 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='정문 광장', bg=dict(wall='#CDE8F6', floor='#A8C686', deco='stripe'), objs=[
            O('clock', '광장 시계', 'clock', 40, 30, 130, 130, dict(h=CLOCK[0], m=CLOCK[1]), keep=True,
              look='광장 시계가 멈춰 있어요. **몇 시 몇 분**일까요?', lookFig=F('clock', 160, 160, h=CLOCK[0], m=CLOCK[1]),
              guide='광장 시계가 몇 시 몇 분인지 읽고 수첩에 남겨 두세요.'),
            O('shelf', '기념품 선반', 'shelf', 200, 70, 320, 300, dict(rows=SOUV), keep=True,
              look='칸마다 **곰 인형**과 공이 있어요. 곰 인형은 한 칸에 몇 개씩, 몇 칸일까요?',
              lookFig=F('shelf', 320, 300, rows=SOUV), guide='기념품 선반의 곰 인형이 한 칸에 몇 개씩 몇 칸인지 보세요.'),
            O('sdoor', '우리길 문', 'door', 560, 160, 140, 220, dict(c='초록', sign='우리길'),
              need='card', needMsg='문 옆에 출입 카드를 대는 곳이 있어요.', useMsg='출입 카드를 댔더니 삑! 문이 열렸어요.',
              go='b', after='동물 우리길로 가는 문이 열렸어요.', guide='출입 카드를 우리길 문에 대 보세요.'),
            O('gate', '정문', 'door', 810, 140, 160, 240, dict(c='#B8860B', sign='정문'),
              need='keyb', needMsg='정문에 큰 열쇠 구멍과 숫자판이 있어요.', useMsg='정문 열쇠를 돌렸어요! 이제 숫자판만 남았어요.',
              lock=Lk('num', str(GROW + FISH_ROW * FISH_ROWS), '**사육사 메모판**에 적힌 대로 계산해요. 두 자리 수를 만들어요.',
                      ['메모판: 기린이 자란 길이(cm)와 물고기 수를 더해요. 수첩에서 기린 키 재기판과 먹이 선반을 보세요.',
                       '기린은 1 m 57 cm에서 1 m 95 cm가 됐어요. cm끼리 빼요. 물고기는 한 칸에 6마리씩 4칸이에요.',
                       '95 − 57 = 38, 6 × 4 = 24. 38 + 24는?'],
                      f'자란 길이 1 m 95 cm − 1 m 57 cm = 38 cm, 물고기 6 × 4 = 24 → 38 + 24 = {GROW + FISH_ROW * FISH_ROWS}',
                      chk=lambda: (cm(GIR_NOW) - cm(GIR_OLD)) + FISH_ROW * FISH_ROWS),
              go='exit', after='정문이 활짝 열렸어요!', guide='정문 열쇠를 쓰고, 사육사 메모대로 기린이 자란 길이와 물고기 수를 더해요.'),
            O('box', '매표소 상자', 'box', 40, 400, 190, 130, dict(c='#E0A92E', lock=True, label='?'),
              lock=Lk('num', str(BEAR_ROW * ROWS + CLOCK[1]), '**곰 인형 수**와 **광장 시계의 몇 분**을 더해요. 두 자리 수를 만들어요.',
                      ['곰 인형은 한 칸에 4개씩 3칸 있어요. 곱셈으로 구해 보세요.', '시계의 긴바늘이 8을 가리키면 몇 분일까요? 5분씩 뛰어 세어요.', '4 × 3 = 12, 긴바늘 8 → 40분. 12 + 40은?'],
                      f'곰 인형 {BEAR_ROW} × {ROWS} = {BEAR_ROW * ROWS}, 시계 {CLOCK[0]}시 {CLOCK[1]}분 → {BEAR_ROW * ROWS} + {CLOCK[1]} = {BEAR_ROW * ROWS + CLOCK[1]}',
                      chk=lambda: BEAR_ROW * ROWS + CLOCK[1]),
              give=['card'], after='상자 안에 **출입 카드**와 **동물원 길 그림**이 있어요. 빨간 점이 우리길에서 사육사 방까지 가는 길이에요.',
              afterFig=F('map', 330, 280, **MAP), guide='매표소 상자를 열어 보세요. 곰 인형 수와 시계의 분을 더해요.'),
        ]),
        dict(id='b', nm='동물 우리길', bg=dict(wall='#E4F2DA', floor='#BFA37C', deco='brick'), objs=[
            O('cage', '곰 우리', 'cage', 30, 230, 240, 280, dict(animal='bear', c='갈색'),
              look='곰이 얌전히 앉아 있어요. 쉿! 조용히 살펴봐요. 우리는 잠겨 있어요.',
              guide='곰 우리는 열지 않아도 돼요. 크게 보면 바닥 구석에 무언가 있을지도 몰라요.'),
            O('cscrap', '곰 우리 바닥 쪽지', 'scrap', 18, 228, 46, 34, dict(t='?'), in_='cage', keep=True,
              look='바닥 구석에 작은 쪽지가 있어요! "사육사 상자 속 작은 서랍: **물고기 수에서 곰 인형 수**를 빼요."',
              guide='곰 우리를 크게 보고 바닥 구석의 작은 쪽지를 찾아보세요.'),
            O('giraffe', '기린 키 재기판', 'poster', 290, 40, 250, 170, dict(lines=GIR, fs=21, c='#FFF3C4'), keep=True,
              look='아기 기린의 키를 지난달과 오늘 재어 적어 두었어요.', lookFig=F('poster', 300, 170, lines=GIR, fs=24, c='#FFF3C4'),
              guide='기린 키 재기판을 읽고 수첩에 남겨 두세요.'),
            O('bottles', '먹이 통', 'bottles', 560, 30, 300, 145, dict(items=BOTTLES), keep=True,
              look='먹이 통마다 뺄셈식이 붙어 있어요. 얼마일까요?', lookFig=F('bottles', 420, 190, items=BOTTLES),
              guide='먹이 통에 붙은 뺄셈식을 하나씩 계산해 보세요.'),
            O('panel', '먹이 기계', 'panel', 870, 40, 120, 140, dict(colors=['빨강', '노랑', '초록', '파랑'], label='잠김', done='열림'),
              lock=Lk('color', [c for _, c in sorted((v, c) for c, _, v in FEED)],
                      '**먹이 통의 값이 작은 것부터** 그 통의 색 단추를 눌러요.',
                      ['먹이 통마다 뺄셈을 해요: 52−17, 43−9, 61−28, 80−44.', '일의 자리끼리 뺄 수 없으면 십의 자리에서 10을 받아내려요. 52 − 17 = 35예요.', '값은 35, 34, 33, 36이에요. 작은 것부터 그 통의 색을 눌러요.'],
                      '초록 61−28=33 → 노랑 43−9=34 → 빨강 52−17=35 → 파랑 80−44=36',
                      chk=lambda: [c for _, c in sorted((v, c) for c, _, v in FEED)], opts=['빨강', '노랑', '초록', '파랑']),
              give=['key'], after='먹이와 함께 **작은 열쇠**가 굴러 나왔어요! 기계 뒤에 숨어 있던 **모양 포스터**도 보여요.',
              guide='먹이 통의 뺄셈 값을 작은 것부터 정리해 먹이 기계를 열어 보세요.'),
            O('poster', '모양 포스터', 'poster', 760, 210, 230, 150, dict(lines=['사육사 상자 모양'], shapes=POSTER, fs=18), req=['panel'], keep=True,
              look='모양이 규칙대로 놓여 있고 맨 끝은 **?** 예요. 몇 개씩 되풀이될까요?',
              lookFig=F('poster', 360, 140, lines=['사육사 상자 모양'], shapes=POSTER, fs=20), guide='먹이 기계 뒤에서 나온 모양 포스터의 규칙을 찾아보세요.'),
            O('ddoor', '사육사 방 문', 'door', 590, 200, 140, 180, dict(c='갈색', sign='사육사 방', keypad=True),
              lock=Lk('dir', segs(MAP['path']), '**동물원 길 그림**을 보고 가는 쪽을 차례로 눌러요. 같은 쪽으로 여러 칸 가도 한 번만 눌러요.',
                      ['수첩에서 매표소 상자의 길 그림을 보세요. \'우리길\'에서 출발해요.', '처음에는 위로 2칸, 그다음 오른쪽으로 3칸 가요.', '↑ → 다음에 위, 오른쪽, 마지막엔 어느 쪽인가요? 화살표는 모두 5개예요.'],
                      '위로 2칸, 오른쪽으로 3칸, 위로 2칸, 오른쪽으로 2칸, 아래로 2칸 가요. 누를 차례: ↑ → ↑ → ↓', chk=lambda: segs('UURRRUURRDD')),
              go='c', after='사육사 방 문이 열렸어요!', guide='정문 광장 매표소 상자에서 찾은 길 그림대로 화살표를 눌러 보세요.'),
        ]),
        dict(id='c', nm='사육사 방', bg=dict(wall='#F5E6CF', floor='#A9845F', deco='tile'), objs=[
            O('memo', '사육사 메모판', 'board', 40, 40, 330, 170, dict(lines=MEMO, fs=21), keep=True,
              look='정문 비밀번호를 구하는 방법이 적혀 있어요!', lookFig=F('board', 360, 170, lines=MEMO, fs=22),
              guide='사육사 메모판을 읽고 수첩에 남겨 두세요.'),
            O('fish', '먹이 선반', 'shelf', 440, 40, 320, 340, dict(rows=FISH), keep=True,
              look='물개와 펭귄에게 줄 물고기예요. 한 칸에 몇 마리씩, 몇 칸일까요?', lookFig=F('shelf', 320, 340, rows=FISH),
              guide='먹이 선반의 물고기가 한 칸에 몇 마리씩 몇 칸인지 보세요.'),
            O('chest', '사육사 상자', 'chest', 100, 370, 240, 160, dict(c='#7A5434'),
              need='key', needMsg='작은 열쇠 구멍과 모양 단추가 있어요.', useMsg='작은 열쇠를 돌렸어요. 이제 모양 단추를 눌러요.',
              lock=Lk('shape', [PAT[i % 4] for i in range(9, 12)], '모양 포스터의 **? 자리와 그 뒤 두 개**에 올 모양을 차례로 눌러요.',
                      ['수첩에서 모양 포스터를 보세요. 몇 개가 한 묶음으로 되풀이될까요?', '○ △ △ □ 네 개가 한 묶음이에요. 아홉째 모양은 ○ 였어요.', '○ 다음에는 묶음의 둘째, 셋째, 넷째 모양이 와요.'],
                      '○ △ △ □ 가 되풀이되므로 ? 자리부터 △ △ □', chk=lambda: [PAT[i % 4] for i in range(9, 12)], opts=['○', '△', '□', '☆']),
              give=['kb1'], after='상자 안에 금색 **열쇠 손잡이**가 있어요. 몸통은 없어요.',
              guide='작은 열쇠를 사육사 상자에 쓰고, 모양 포스터의 규칙대로 모양을 눌러 보세요.'),
            O('cdraw', '상자 속 작은 서랍', 'drawer', 20, 108, 70, 40, dict(c='#B98552', lock=True), in_='chest',
              lock=Lk('num', str(FISH_ROW * FISH_ROWS - BEAR_ROW * ROWS), '상자 안쪽 작은 서랍이에요. **곰 우리 바닥 쪽지**대로 계산해요.',
                      ['곰 우리를 크게 보세요. 바닥 구석에 쪽지가 있어요.', f'물고기는 한 칸에 {FISH_ROW}마리씩 {FISH_ROWS}칸, 곰 인형은 한 칸에 {BEAR_ROW}개씩 {ROWS}칸이에요.', f'{FISH_ROW} × {FISH_ROWS} = {FISH_ROW * FISH_ROWS}, {BEAR_ROW} × {ROWS} = {BEAR_ROW * ROWS}. 큰 수에서 작은 수를 빼요.'],
                      f'물고기 {FISH_ROW} × {FISH_ROWS} = {FISH_ROW * FISH_ROWS}, 곰 인형 {BEAR_ROW} × {ROWS} = {BEAR_ROW * ROWS} → {FISH_ROW * FISH_ROWS} − {BEAR_ROW * ROWS} = {FISH_ROW * FISH_ROWS - BEAR_ROW * ROWS}',
                      chk=lambda: FISH_ROW * FISH_ROWS - BEAR_ROW * ROWS),
              give=['kb2'], after='작은 서랍 안에 금색 **열쇠 몸통**이 있어요. 손잡이는 없어요.', guide='사육사 상자를 연 뒤 안쪽 작은 서랍을 눌러 보세요.'),
        ]),
    ],
    flow=['clock', 'shelf', 'box', 'sdoor', 'cscrap', 'giraffe', 'bottles', 'panel', 'poster', 'ddoor', 'memo', 'fish', 'chest', 'cdraw', 'kb1+kb2', 'gate'],
)
