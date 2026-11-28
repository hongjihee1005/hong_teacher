"""수학 방탈출 2 — 과자 가게 탈출 (추천 1학년: 수 세기·세 수의 덧셈·덧셈과 뺄셈·몇 시·모양 규칙·방향·색깔 순서)"""
from rooms import O, Lk, F, segs

# 그림에 그린 수 = 자물쇠 계산에 쓰는 수(같은 상수를 함께 씀)
RED, YEL, GRN = 4, 3, 5                      # 진열대의 빨간·노란·초록 사탕
STAR, JELLY = 2, 2                           # 별 과자·곰 젤리(세지 않는 것)
SHELF = [[{'k': 'candy', 'c': '빨강', 'n': RED}, {'k': 'star', 'c': '노랑', 'n': STAR}],
         [{'k': 'candy', 'c': '노랑', 'n': YEL}, {'k': 'bear', 'c': '주황', 'n': JELLY}],
         [{'k': 'candy', 'c': '초록', 'n': GRN}]]
CLOCK_H = 4                                  # 가게 벽시계 4시
PAT = ['♡', '○', '○']                        # 쿠키 무늬 규칙
POSTER = [PAT[i % 3] for i in range(7)] + ['?']
PSC = [{'♡': '분홍', '○': '갈색'}[k] for k in POSTER[:-1]] + ['#C8402F']
MAP = dict(n=4, m=5, start=[0, 3], path='URRUURR', block=[[1, 3], [0, 0], [3, 2], [4, 2], [1, 1], [4, 3]], sl='가게', gl='창고')
SYRUP = [('빨강', '3+4', 3 + 4), ('노랑', '9−1', 9 - 1), ('초록', '2+3', 2 + 3), ('파랑', '10−4', 10 - 4)]
BOTTLES = [{'c': c, 'label': l} for c, l, _ in SYRUP]
HEART = 6                                    # 쟁반의 하트 쿠키
BOARD = ['쿠키 진열장 비밀번호', '가게 시계의 몇 시에', '초록 사탕 수를 더해요']
COUNTER = [{'k': 'cookie', 'c': '갈색', 'n': 3}, {'k': 'jar', 'c': '분홍', 'n': 1}]

ROOM = dict(
    id='candy', title='과자 가게 탈출', ico='🛒', acc='#E5534B',
    rec='추천 1학년 · 수 세기·덧셈·뺄셈·몇 시·모양 규칙·방향·색깔 순서',
    intro='과자를 고르다 보니 가게 문이 닫혀 버렸어요! 사탕 가게와 쿠키 창고를 둘러보며 단서를 모아 출구 문을 열어요.',
    story=['과자 가게에서 사탕을 고르던 사이, 주인 아주머니가 잠깐 창고에 가셨어요.', '덜컥! 바람에 가게 문이 닫히고 자물쇠가 철컥 걸렸어요.', '가게 곳곳의 단서를 모아 출구 문을 열고 밖으로 나가요!'],
    outro='출구 문이 활짝 열렸어요! 주인 아주머니가 "수고했어요!" 하며 하트 쿠키 한 개를 손에 쥐여 줬어요. 과자 가게를 탈출했어요!',
    mission=dict(title='과자 가게 문을 열어라!', goal='사탕 가게와 쿠키 창고의 단서를 모아 출구 문을 열어요.', tips=['사탕은 색깔마다 세어 봐요', '반쪽 물건 둘을 합쳐 봐요']),
    dialog=[('nar', '과자 가게에서 사탕을 고르고 있었어요.'), ('tori', '우와, 사탕이 엄청 많다!'), ('nar', '덜컥! 문이 닫히고 자물쇠가 걸렸어요.'), ('momo', '문이 잠겼어. 단서를 찾아보자.'), ('tori', '좋아! 우리 같이 문을 열자!')],
    outro_dialog=[('tori', '우리가 해냈어! 쿠키 냄새 최고!'), ('momo', '사탕이랑 쿠키를 세어서 해냈어.')],
    items={'key': dict(nm='작은 열쇠', k='key', c='#C9A24B', de='작은 서랍에 맞을 것 같아요'),
           'coin': dict(nm='동전', k='coin', c='#E0A92E', de='기계에 넣을 수 있는 동전이에요'),
           'gear': dict(nm='톱니바퀴', k='gear', c='#8A929C', de='쿠키 기계에서 빠진 부품 같아요'),
           'keyb': dict(nm='큰 열쇠', k='key', c='#E5534B', de='빨간 큰 열쇠예요. 출구 문에 맞을까요?'),
           'kb1': dict(nm='열쇠 손잡이', k='khead', c='#E5534B', de='큰 열쇠의 동그란 손잡이만 있어요. 나머지 반쪽은 어디 있을까요?'),
           'kb2': dict(nm='열쇠 몸통', k='kblade', c='#E5534B', de='큰 열쇠의 길쭉한 몸통이에요. 손잡이가 없어요.')},
    combine=[dict(a='kb1', b='kb2', make='keyb', msg='손잡이와 몸통을 딸깍 끼웠더니 **큰 열쇠**가 되었어요!')],
    scenes=[
        dict(id='a', nm='사탕 가게', bg=dict(wall='#FDE3EC', floor='#D9A27A', deco='stripe'), objs=[
            O('clock', '벽시계', 'clock', 60, 30, 120, 120, dict(h=CLOCK_H, m=0), keep=True, say=('momo', '시곗바늘을 잘 봐 두자.'),
              look='가게 벽시계예요. 지금 **몇 시**일까요?', lookFig=F('clock', 150, 150, h=CLOCK_H, m=0),
              guide='벽시계가 몇 시를 가리키는지 보고 수첩에 남겨 두세요.'),
            O('poster', '쿠키 무늬 포스터', 'poster', 40, 170, 190, 150, dict(lines=['쿠키 무늬'], shapes=POSTER, sc=PSC, cookie=1), keep=True, say=('tori', '무늬가 되풀이돼! 잘 봐 둬.'),
              look='쿠키 무늬가 규칙대로 놓여 있어요. 맨 끝 **?** 는 지워졌어요.',
              lookFig=F('poster', 320, 130, lines=['쿠키 무늬'], shapes=POSTER, sc=PSC, cookie=1),
              guide='쿠키 무늬 포스터의 규칙을 수첩에 남겨 두세요.'),
            O('shelf', '사탕 진열대', 'shelf', 260, 90, 320, 290, dict(rows=SHELF, c='#D98E9E'), keep=True, say=('momo', '사탕, 별 과자, 곰 젤리를 따로 세어 두자.'),
              look='**사탕**과 노란 **별 과자**, 주황 **곰 젤리**가 있어요. 사탕은 양쪽이 리본처럼 묶여 있어요.',
              lookFig=F('shelf', 320, 290, rows=SHELF, c='#D98E9E'),
              guide='사탕 진열대에 사탕이 색깔마다 몇 개 있는지 세어 보세요.'),
            O('sdoor', '창고 문', 'door', 620, 170, 130, 210, dict(c='보라', sign='창고', keypad=True),
              lock=Lk('dir', segs(MAP['path']), '**창고 가는 길 그림**을 보고 가는 쪽을 차례로 눌러요. 같은 쪽으로 여러 칸 가도 한 번만 눌러요.',
                      ['서랍장에서 찾은 길 그림을 수첩에서 열어 보세요.', '\'가게\'에서 빨간 점을 따라가요. 처음에는 위로 가요.', '위, 오른쪽, 그다음은? 화살표는 모두 4개예요.'],
                      '위로 1칸, 오른쪽으로 2칸, 위로 2칸, 오른쪽으로 2칸 가요. 누를 차례: ↑ → ↑ →', chk=lambda: segs('URRUURR')),
              go='b', after='딸깍! 창고 문이 열렸어요. 고소한 쿠키 냄새가 나요.',
              guide='서랍장에서 찾은 길 그림대로 창고 문의 화살표를 눌러 보세요.'),
            O('cabinet', '서랍장', 'cabinet', 800, 200, 150, 180, dict(c='#E8C9A0', label='서랍장'),
              need='key', needMsg='서랍장이 잠겨 있어요. 작은 열쇠 구멍이 보여요.', useMsg='작은 열쇠로 서랍장을 열었어요.',
              give=['coin'], after='서랍장 안에 **동전**과 **창고 가는 길 그림**이 있어요. 빨간 점을 따라가요.',
              afterFig=F('map', 300, 240, **MAP), guide='작은 열쇠로 서랍장을 열어 보세요.'),
            O('box', '사탕 상자', 'box', 50, 400, 180, 130, dict(c='분홍', lock=True, label='?'),
              lock=Lk('num', str(RED + YEL + GRN), '진열대의 **사탕**은 모두 몇 개일까요? 별 과자와 곰 젤리는 세지 않아요. 두 자리 수를 만들어요.',
                      ['진열대를 보세요. 양쪽이 리본처럼 묶인 것만 사탕이에요.', '빨간 사탕 4개, 노란 사탕 3개, 초록 사탕 5개예요.', '4 + 3 = 7, 7에 5를 더하면?'],
                      f'{RED} + {YEL} + {GRN} = {RED + YEL + GRN}', chk=lambda: RED + YEL + GRN),
              give=['key'], after='상자가 열렸어요! 사탕 사이에 **작은 열쇠**가 있어요. 고리에 \'서랍장\'이라고 적혀 있어요.',
              guide='사탕 상자를 열어 보세요. 진열대의 사탕을 세면 돼요.'),
            O('counter', '계산대', 'counter', 330, 390, 290, 150, dict(items=COUNTER), say=('tori', '저 구석에 뭐가 끼어 있어!'),
              look='계산대 위에 쿠키 세 개와 분홍 사탕 병이 있어요. 잠긴 곳은 없어요.',
              guide='계산대를 크게 보면 구석에 무언가 끼어 있을지도 몰라요.'),
            O('cscrap', '계산대 구석 쪽지', 'scrap', 232, 104, 46, 34, dict(t='?'), in_='counter', keep=True,
              look='구석에 작은 쪽지가 있어요! "진열장 속 작은 서랍: **빨간 사탕, 초록 사탕, 별 과자**를 모두 더해요."',
              guide='계산대를 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
        ]),
        dict(id='b', nm='쿠키 창고', bg=dict(wall='#FFF1D6', floor='#B98A6A', deco='tile'), objs=[
            O('board', '주문 칠판', 'board', 30, 30, 320, 170, dict(lines=BOARD, fs=21), keep=True,
              look='쿠키 진열장을 여는 방법이 적혀 있어요.', lookFig=F('board', 340, 170, lines=BOARD, fs=21),
              guide='주문 칠판을 읽고 수첩에 남겨 두세요.'),
            O('bottles', '시럽 병', 'bottles', 370, 40, 320, 180, dict(items=BOTTLES), keep=True, say=('momo', '병마다 계산해 보자.'),
              look='시럽 병마다 계산식이 붙어 있어요. 얼마일까요?', lookFig=F('bottles', 400, 190, items=BOTTLES),
              guide='시럽 병에 붙은 계산식을 하나씩 계산해 보세요.'),
            O('panel', '시럽 기계', 'panel', 720, 50, 150, 150, dict(colors=['빨강', '노랑', '초록', '파랑'], label='동전', done='열림'),
              need='coin', needMsg='시럽 기계에 동전 넣는 구멍이 있어요.', useMsg='동전을 넣었더니 색깔 단추에 불이 켜졌어요!',
              lock=Lk('color', [c for _, c in sorted(((v, c) for c, _, v in SYRUP), reverse=True)],
                      '**시럽 병의 값이 큰 것부터** 그 병의 색 단추를 눌러요.',
                      ['시럽 병마다 계산해요: 3+4, 9−1, 2+3, 10−4.', '값은 7, 8, 5, 6이에요. 가장 큰 수는?', '8, 7, 6, 5 차례로 그 병의 색을 눌러요.'],
                      '노랑 9−1=8 → 빨강 3+4=7 → 파랑 10−4=6 → 초록 2+3=5',
                      chk=lambda: [c for _, c in sorted(((v, c) for c, _, v in SYRUP), reverse=True)], opts=['빨강', '노랑', '초록', '파랑']),
              give=['kb1'], after='시럽이 주르륵! 기계 아래에서 **열쇠 손잡이**가 툭 떨어졌어요. 몸통은 없어요.',
              guide='동전을 시럽 기계에 넣고, 시럽 병의 값이 큰 것부터 색을 눌러 보세요.'),
            O('case', '쿠키 진열장', 'case', 30, 230, 240, 210, dict(items=[{'k': 'cookie', 'c': '갈색', 'n': 3}], lock=True),
              lock=Lk('num', str(CLOCK_H + GRN), '**주문 칠판**에 적힌 대로 계산해요.',
                      ['주문 칠판을 보세요. 시계의 몇 시에 초록 사탕 수를 더해요.', '가게 시계는 몇 시였나요? 초록 사탕은 몇 개였나요?', '4시, 초록 사탕 5개예요. 4 + 5는?'],
                      f'시계 {CLOCK_H}시, 초록 사탕 {GRN}개 → {CLOCK_H} + {GRN} = {CLOCK_H + GRN}', chk=lambda: CLOCK_H + GRN),
              give=['gear'], after='진열장이 열렸어요! 쿠키 뒤에 **톱니바퀴**가 있어요. 아래쪽에 **작은 서랍**도 보여요.',
              guide='칠판에 적힌 대로 시계와 초록 사탕을 더해 진열장을 열어 보세요.'),
            O('cdraw', '진열장 속 작은 서랍', 'drawer', 150, 150, 70, 40, dict(c='#B98552', lock=True), in_='case',
              lock=Lk('num', str(RED + GRN + STAR), '진열장 아래 작은 서랍이에요. **계산대 구석 쪽지**대로 계산해요.',
                      ['사탕 가게 계산대를 크게 보세요. 구석에 쪽지가 있어요.', f'진열대의 빨간 사탕은 {RED}개, 초록 사탕은 {GRN}개, 별 과자는 {STAR}개예요.', f'{RED} + {GRN} = {RED + GRN}, 거기에 {STAR}를 더하면?'],
                      f'빨간 사탕 {RED} + 초록 사탕 {GRN} + 별 과자 {STAR} = {RED + GRN + STAR}', chk=lambda: RED + GRN + STAR),
              give=['kb2'], after='작은 서랍 안에 **열쇠 몸통**이 있어요. 손잡이는 없어요.', guide='진열장을 연 뒤 아래쪽 작은 서랍을 눌러 보세요.'),
            O('belt', '쿠키 기계', 'conveyor', 280, 330, 360, 170, dict(shapes=['?', '?', '?'], sc=['#C8402F'] * 3, ans=[PAT[i % 3] for i in range(7, 10)], cookie=1),
              need='gear', needMsg='쿠키 기계가 멈춰 있어요. 톱니바퀴 하나가 빠졌어요.', useMsg='톱니바퀴를 끼웠더니 기계가 위잉! 이제 쿠키 모양을 골라요.',
              lock=Lk('shape', [PAT[i % 3] for i in range(7, 10)], '포스터의 **? 자리와 그 뒤 두 개**에 올 쿠키 모양을 차례로 눌러요.',
                      ['수첩에서 쿠키 무늬 포스터를 보세요.', '♡ ○ ○ 가 되풀이돼요. 마지막 모양은 ♡ 였어요.', '♡ 다음에는 무엇이 오나요?'],
                      '♡ ○ ○ 가 되풀이되므로 ? 자리부터 ○ ○ ♡', chk=lambda: [PAT[i % 3] for i in range(7, 10)], opts=['○', '△', '□', '♡']),
              after='따끈한 쿠키가 나왔어요! 옆에 **쿠키 쟁반**이 생겼어요.',
              guide='톱니바퀴를 쿠키 기계에 끼우고 포스터 규칙대로 모양을 눌러 보세요.'),
            O('tray', '쿠키 쟁반', 'table', 650, 390, 230, 140, dict(items=[{'k': 'hcookie', 'c': '분홍', 'n': HEART}], c='#C9A27A'), req=['belt'], keep=True, say=('tori', '하트 쿠키다! 하나씩 세 보자.'),
              look='갓 구운 **하트 쿠키**예요. 몇 개일까요?', lookFig=F('table', 300, 150, items=[{'k': 'hcookie', 'c': '분홍', 'n': HEART}], c='#C9A27A'),
              guide='쿠키 기계가 만든 쟁반의 하트 쿠키를 세어 보세요.'),
            O('exit', '출구 문', 'door', 890, 150, 100, 230, dict(c='빨강', sign='출구'),
              need='keyb', needMsg='출구 문에 큰 열쇠 구멍이 있어요.', useMsg='큰 열쇠가 딱 맞아요! 이제 문의 숫자판만 남았어요.',
              lock=Lk('num', str(HEART + RED), '**쟁반의 하트 쿠키**와 **진열대의 빨간 사탕**을 더해요. 두 자리 수를 만들어요.',
                      ['쟁반의 하트 쿠키는 몇 개인가요?', '진열대의 빨간 사탕은 몇 개였나요? 수첩을 보세요.', '하트 쿠키 6개, 빨간 사탕 4개예요. 6 + 4는?'],
                      f'하트 쿠키 {HEART}개 + 빨간 사탕 {RED}개 = {HEART + RED}', chk=lambda: HEART + RED),
              go='exit', after='출구 문이 열렸어요!', guide='큰 열쇠를 출구 문에 쓰고, 하트 쿠키와 빨간 사탕을 더해 비밀번호를 맞춰요.'),
        ]),
    ],
    flow=['clock', 'poster', 'shelf', 'box', 'cscrap', 'cabinet', 'sdoor', 'board', 'bottles', 'panel', 'case', 'cdraw', 'kb1+kb2', 'belt', 'tray', 'exit'],
)
