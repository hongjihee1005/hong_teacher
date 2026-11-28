"""수학 방탈출 · 숲속 캠핑장 탈출 (추천 1학년) — 형식은 rooms.py 머리말"""
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
CLOCK_H, CLOCK_M = 7, 30                    # 관리소 시계 7시 30분
BIGP, SMALLP, ACORN = 6, 7, 3               # 바구니: 큰 솔방울 6 · 작은 솔방울 7 · 도토리 3
WHITE, PINK = 5, 4                          # 마시멜로 접시: 흰 5 · 분홍 4
PAT = ['□', '○', '○']                       # 깃발 무늬 규칙
FLAGS = [PAT[i % 3] for i in range(7)] + ['?']
FSC = [{'□': '파랑', '○': '빨강'}[k] for k in FLAGS[:-1]] + ['#C8402F']
STONE = [PAT[i % 3] for i in range(7, 10)]  # 깃발의 ? 자리부터 세 개
RODS = [('빨강', 7), ('노랑', 4), ('초록', 9), ('파랑', 6)]   # 낚싯대 길이(칸 수, 그림에서만 씀 — 단위 없이 길이 비교)
ROD_P = [{'c': k, 'L': n} for k, n in RODS]
LOGS = [5, 4, 3]                            # 장작 더미: 아래 줄부터 5·4·3
LOG = sum(LOGS)                             # 12
SHELF = [[{'k': 'jar', 'c': '빨강', 'n': 3}, {'k': 'book', 'c': '초록', 'n': 2}],
         [{'k': 'ball', 'c': '노랑', 'n': 2}, {'k': 'jar', 'c': '파랑', 'n': 2}]]
JARS = 3 + 2                                # 선반의 병: 빨강 3 · 파랑 2
MAP = dict(n=4, m=5, start=[0, 3], path='URRRUUR', block=[[2, 3], [1, 0], [2, 1], [4, 2], [0, 0]], sl='텐트', gl='개울')

ROOM = dict(
    id='camp', title='숲속 캠핑장 탈출', ico='⛺', acc='#3F7A26',
    rec='추천 1학년 · 수 세기·받아올림 있는 덧셈·세 수의 덧셈·몇 시 30분·길이 비교·모양 규칙·방향',
    intro='숲속 캠핑장에 해가 지자 캠핑장 문이 모두 잠겨 버렸어요! 텐트 앞과 개울가, 숲속 오두막을 둘러보며 단서를 모아 뒷문을 열어요.',
    story=['가족과 숲속 캠핑장에 놀러 온 날, 솔방울을 줍다 보니 어느새 해가 뉘엿뉘엿 졌어요.', '철컥! 관리소 문과 캠핑장 울타리 문에 자물쇠가 모두 걸렸어요.', '텐트 앞, 개울가, 숲속 오두막의 단서를 모아 오두막 뒷문으로 나가요!'],
    outro='오두막 뒷문이 활짝 열렸어요! 손전등을 든 관리인 아저씨가 "숲 탐험가가 따로 없네!" 하며 반겨 줘요. 숲속 캠핑장을 탈출했어요!',
    items={'torch': dict(nm='손전등', k='torch', c='#F2C230', de='어두운 곳을 환하게 비출 수 있어요'),
           'hook': dict(nm='갈고리', k='hook', c='#8A929C', de='끝이 구부러진 쇠갈고리예요. 손잡이가 없어서 쓰기 어려워요.'),
           'stick': dict(nm='긴 막대', k='stick', c='#8B5A2B', de='튼튼하고 긴 나무 막대예요. 끝에 무언가를 달 수 있을 것 같아요.'),
           'pole': dict(nm='갈고리 막대', k='hook', c='#8B5A2B', de='막대 끝에 갈고리를 단 도구예요. 물속 물건을 건질 수 있어요.'),
           'keyb': dict(nm='오두막 열쇠', k='key', c='#C9A24B', de='물에 젖은 금색 열쇠예요. 열쇠 고리에 \'오두막\'이라고 적혀 있어요.')},
    combine=[dict(a='stick', b='hook', make='pole', msg='긴 막대 끝에 갈고리를 꽉 묶었더니 **갈고리 막대**가 되었어요! 멀리 있는 물건도 건질 수 있어요.')],
    scenes=[
        dict(id='a', nm='텐트 앞', bg=dict(wall='#CDE9F7', floor='#8DBE6A'), objs=[
            O('clock', '관리소 시계', 'clock', 40, 30, 120, 120, dict(h=CLOCK_H, m=CLOCK_M), keep=True,
              look='관리소 벽에 걸린 시계가 멈춰 있어요! 짧은바늘과 긴바늘을 잘 보세요. **몇 시 몇 분**일까요?', lookFig=F('clock', 150, 150, h=CLOCK_H, m=CLOCK_M),
              guide='관리소 시계가 몇 시 몇 분을 가리키는지 보고 수첩에 남겨 두세요.'),
            O('flags', '캠핑장 깃발 줄', 'cpFlags', 190, 30, 420, 120, dict(shapes=FLAGS, sc=FSC), keep=True,
              look='나무 두 그루 사이에 깃발 줄이 걸려 있어요. 깃발마다 모양이 규칙대로 그려져 있는데, 맨 끝 깃발은 **?** 로 지워져 있어요.',
              lookFig=F('cpFlags', 420, 130, shapes=FLAGS, sc=FSC), guide='깃발 줄의 모양 규칙을 수첩에 남겨 두세요.'),
            O('fire', '모닥불과 마시멜로 접시', 'cpFire', 260, 180, 270, 190, dict(white=WHITE, pink=PINK), keep=True,
              look='타닥타닥 모닥불 옆 접시에 구워 먹을 마시멜로가 놓여 있어요. **흰 마시멜로**와 **분홍 마시멜로**가 몇 개씩인지 세어 볼까요?',
              lookFig=F('cpFire', 360, 220, white=WHITE, pink=PINK), guide='모닥불 옆 접시의 마시멜로를 색깔마다 세어 보세요.'),
            O('tent', '우리 텐트', 'cpTent', 570, 170, 250, 220, dict(c='#E07B39'),
              look='우리 가족 텐트예요.',
              need='torch', needMsg='텐트 안이 너무 깜깜해서 아무것도 보이지 않아요. 비춰 볼 것이 있으면 좋겠어요.', useMsg='손전등으로 텐트 안을 비췄어요. 침낭 위에 종이 한 장이 보여요!',
              after='침낭 위에 **숲길 그림**이 있어요. 빨간 점이 텐트에서 개울까지 가는 길이에요. 회색 칸은 나무가 우거져서 갈 수 없어요.',
              afterFig=F('map', 300, 240, **MAP), guide='손전등으로 텐트 안을 비춰 보세요.'),
            O('basket', '솔방울 바구니', 'cpBasket', 30, 385, 250, 160, dict(big=BIGP, small=SMALLP, acorn=ACORN), keep=True,
              look='오늘 주운 열매를 담은 바구니예요. 맨 위 줄은 **큰 솔방울**, 가운데 줄은 **작은 솔방울**, 맨 아래 줄은 **도토리**예요.',
              lookFig=F('cpBasket', 320, 200, big=BIGP, small=SMALLP, acorn=ACORN), guide='솔방울 바구니에 무엇이 몇 개 있는지 줄마다 세어 보세요.'),
            O('cooler', '아이스박스', 'box', 320, 405, 170, 125, dict(c='하늘', lock=True, label='?'),
              look='뚜껑에 숫자 자물쇠 두 칸이 달린 아이스박스예요.',
              lock=Lk('num', str(BIGP + SMALLP), '뚜껑에 붙은 쪽지: **바구니에 있는 솔방울은 모두 몇 개일까요?** (도토리는 빼요)',
                      ['솔방울 바구니를 다시 보세요. 위 두 줄이 솔방울이고, 맨 아래 줄은 도토리예요.', f'큰 솔방울 {BIGP}개, 작은 솔방울 {SMALLP}개예요.', f'{BIGP}을 3과 3으로 갈라 봐요. {SMALLP}에 3을 더하면 10, 거기에 남은 3을 더하면?'],
                      f'큰 솔방울 {BIGP} + 작은 솔방울 {SMALLP} = {BIGP + SMALLP}', chk=lambda: BIGP + SMALLP),
              give=['torch'], after='아이스박스가 열렸어요! 시원한 물병 사이에 **손전등**이 있어요.',
              guide='아이스박스를 열어 보세요. 바구니의 솔방울만 세면 돼요.'),
            O('trail', '숲길 입구', 'door', 834, 180, 120, 200, dict(c='초록', sign='개울가', keypad=True),
              look='개울가로 가는 숲길 입구의 나무 문이에요. 화살표 단추가 달려 있어요.',
              lock=Lk('dir', segs(MAP['path']), '문에 화살표 단추가 있어요. **숲길 그림**을 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요. (같은 쪽으로 여러 칸 가도 화살표는 하나)',
                      ['텐트 안에서 찾은 숲길 그림을 수첩에서 열어 보세요.', '\'텐트\'에서 출발해 빨간 점을 따라가요. 처음에는 위로 가요.', '위 → 오른쪽 → 그다음은 어느 쪽으로 꺾이나요? 화살표는 모두 4개예요.'],
                      '위로 1칸, 오른쪽으로 3칸, 위로 2칸, 오른쪽으로 1칸 가요. 누를 차례: ↑ → ↑ →', chk=lambda: segs('URRRUUR')),
              go='b', after='딸깍! 나무 문이 열렸어요. 졸졸 개울물 소리가 들려요.', guide='텐트에서 찾은 숲길 그림대로 숲길 입구의 화살표를 눌러 보세요.'),
        ]),
        dict(id='b', nm='개울가', bg=dict(wall='#D8EEF0', floor='#7FB27A', deco='bubble'), objs=[
            O('rods', '낚싯대 걸이', 'cpRods', 40, 40, 380, 200, dict(rods=ROD_P), keep=True,
              look='낚싯대 네 개가 걸이에 나란히 걸려 있어요. 모두 왼쪽 같은 곳에서 시작해요. 어느 낚싯대가 더 길까요?',
              lookFig=F('cpRods', 380, 200, rods=ROD_P), guide='낚싯대 네 개의 길이를 견주어 보세요. 왼쪽 끝이 맞춰져 있어요.'),
            O('rscrap', '낚싯대 걸이 구석 쪽지', 'scrap', 322, 150, 50, 36, dict(t='?'), in_='rods', keep=True,
              look='걸이 구석에 아주 작은 쪽지가 꽂혀 있어요! "도구 상자 속 작은 서랍 = **흰 마시멜로 수 + 분홍 마시멜로 수 + 도토리 수**"',
              guide='낚싯대 걸이를 크게 보고 오른쪽 아래 구석의 작은 쪽지를 찾아보세요.'),
            O('tree', '개울가 나무', 'cpTree', 460, 60, 150, 210,
              look='키 큰 나무에서 새소리가 들려요. 여기에는 잠긴 곳이 없네요.', guide='개울가 나무는 구경만 해도 돼요.'),
            O('tackle', '낚시 도구 상자', 'chest', 50, 380, 200, 150, dict(c='#3B6FD6'),
              look='튼튼한 낚시 도구 상자예요. 뚜껑에 색깔 단추가 네 개 달려 있어요.',
              lock=Lk('color', [k for k, _ in sorted(RODS, key=lambda r: -r[1])],
                      '뚜껑의 글: **낚싯대 걸이의 낚싯대를 가장 긴 것부터** 그 색 단추를 차례로 눌러요.',
                      ['낚싯대 걸이를 다시 보세요. 왼쪽 끝이 모두 같으니 오른쪽 끝이 어디까지 가는지 보면 돼요.', '오른쪽 끝이 가장 멀리 간 낚싯대가 가장 길어요. 그다음으로 긴 것은?'],
                      '초록이 가장 길고, 빨강 → 파랑 → 노랑 차례로 짧아져요. 누를 차례: 초록 → 빨강 → 파랑 → 노랑',
                      chk=lambda: [k for k, _ in sorted(RODS, key=lambda r: -r[1])], opts=['빨강', '노랑', '초록', '파랑']),
              give=['hook'], after='뚜껑이 열렸어요! 상자 안에 **갈고리**가 있어요. 그런데 손잡이가 없어서 혼자서는 쓰기 어려워요. 상자 안쪽에는 **작은 서랍**도 보여요.',
              guide='낚싯대를 긴 것부터 늘어놓아 낚시 도구 상자의 색 단추를 눌러 보세요.'),
            O('tdraw', '도구 상자 속 작은 서랍', 'drawer', 20, 100, 66, 38, dict(c='#2E5E9E', lock=True), in_='tackle',
              lock=Lk('num', str(WHITE + PINK + ACORN), '도구 상자 안쪽에 아주 작은 서랍이 또 있어요! 숫자 자물쇠예요. 낚싯대 걸이 구석 쪽지에 적힌 대로 계산해요.',
                      ['낚싯대 걸이를 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'흰 마시멜로 {WHITE}개, 분홍 마시멜로 {PINK}개, 도토리 {ACORN}개예요.', f'{WHITE} + {PINK} = {WHITE + PINK}, 거기에 {ACORN}을 더하면?'],
                      f'흰 {WHITE} + 분홍 {PINK} + 도토리 {ACORN} = {WHITE + PINK + ACORN}', chk=lambda: WHITE + PINK + ACORN),
              give=['stick'], after='작은 서랍 안에 접혀 있던 **긴 막대**가 들어 있어요. 펴 보니 꽤 길어요!', guide='낚시 도구 상자를 연 뒤 안쪽의 작은 서랍을 눌러 보세요.'),
            O('pool', '개울 웅덩이', 'cpPool', 290, 390, 330, 150,
              look='물이 맑은 웅덩이 바닥에서 무언가 반짝여요! 그런데 손이 닿지 않을 만큼 멀리 있어요.',
              need='pole', needMsg='반짝이는 것이 너무 멀리 있어서 손이 닿지 않아요. 끝이 구부러진 긴 도구가 있으면 건질 수 있겠어요.', useMsg='갈고리 막대를 살살 넣어 반짝이는 것을 걸어 올렸어요!',
              give=['keyb'], after='건져 올린 것은 **오두막 열쇠**예요! 누가 개울을 건너다 떨어뜨렸나 봐요.', guide='막대와 갈고리를 합쳐 웅덩이의 반짝이는 것을 건져 보세요.'),
            O('stones', '징검다리', 'cpStones', 650, 250, 330, 200, dict(ans=STONE),
              look='개울을 건너 숲속 오두막으로 가는 징검다리예요. 가운데 돌 세 개에 **?** 가 새겨져 있어요.',
              lock=Lk('shape', STONE, '징검다리 앞 팻말: **캠핑장 깃발 줄의 ? 자리부터** 규칙대로 모양 세 개를 차례로 눌러야 돌이 단단히 고정돼요.',
                      ['텐트 앞의 깃발 줄을 수첩에서 열어 보세요.', '□ ○ ○ 가 되풀이돼요. 깃발 줄의 ? 바로 앞 모양은 □ 였어요.', '□ 다음에 무엇이 오는지 세 번 이어 가요.'],
                      '□ ○ ○ 가 되풀이되므로 ? 자리부터 ○ ○ □', chk=lambda: [PAT[i % 3] for i in range(7, 10)], opts=['○', '△', '□', '☆']),
              go='c', after='돌이 단단히 고정되었어요! 폴짝폴짝 건너면 숲속 오두막이에요.', guide='깃발 줄의 모양 규칙대로 징검다리의 모양을 눌러 보세요.'),
        ]),
        dict(id='c', nm='숲속 오두막', bg=dict(wall='#D2AE82', floor='#8A6440', deco='stripe'), objs=[
            O('window', '오두막 창문', 'window', 50, 40, 170, 140, dict(night=True),
              look='창밖으로 별이 반짝여요. 벌써 밤이 되었어요. 여기에는 단서가 없네요.', guide='창문은 구경만 해도 돼요.'),
            O('shelf', '오두막 선반', 'shelf', 260, 40, 300, 220, dict(rows=SHELF), keep=True,
              look='오두막 선반에 병과 책과 공이 놓여 있어요. 무엇이 몇 개 있는지 세어 볼까요?', lookFig=F('shelf', 300, 220, rows=SHELF),
              guide='오두막 선반에 있는 병을 세어 보세요.'),
            O('wood', '장작 더미', 'cpWood', 40, 380, 260, 160, dict(rows=LOGS), keep=True,
              look='난로에 넣을 장작이 차곡차곡 쌓여 있어요. 장작은 모두 몇 개일까요?', lookFig=F('cpWood', 300, 180, rows=LOGS),
              guide='장작 더미의 장작을 줄마다 세어 보세요.'),
            O('cabinet', '나무 찬장', 'cabinet', 600, 60, 170, 230, dict(c='#B98552'),
              look='커다란 나무 찬장이에요. 문에 숫자 자물쇠가 달려 있어요.',
              lock=Lk('num', str(LOG + JARS), '찬장 문의 쪽지: **비밀번호 = 장작 더미의 장작 수 + 선반의 병 수**',
                      ['장작 더미와 오두막 선반을 살펴보세요. 선반에서는 병만 세요(책과 공은 빼요).', f'장작은 아래 줄부터 5개, 4개, 3개예요. 병은 빨간 병 3개, 파란 병 2개예요.', f'장작 {LOG}개에 병 {JARS}개를 더하면?'],
                      f'장작 5 + 4 + 3 = {LOG}, 병 3 + 2 = {JARS} → {LOG} + {JARS} = {LOG + JARS}', chk=lambda: sum(LOGS) + JARS),
              after='찬장 문이 열리더니 찬장 뒤 벽이 스르르 밀려나며 **뒷문**이 나타났어요!', guide='장작과 병을 세어 나무 찬장의 비밀번호를 맞춰 보세요.'),
            O('exit', '오두막 뒷문', 'door', 820, 170, 140, 210, dict(c='빨강', sign='출구'), req=['cabinet'],
              look='찬장 뒤에서 나타난 뒷문이에요. 문밖으로 캠핑장 주차장 불빛이 보여요.',
              need='keyb', needMsg='뒷문에 열쇠 구멍이 있어요. \'오두막\'이라고 적힌 열쇠가 맞을 것 같아요.', useMsg='오두막 열쇠가 딱 맞아요! 이제 문의 숫자판만 남았어요.',
              lock=Lk('num', str(CLOCK_H + WHITE + PINK), '숫자판 위 글: **비밀번호 = (관리소 시계의 \'몇 시\'의 수) + (모닥불 접시의 마시멜로 모두)**',
                      ['관리소 시계는 몇 시 몇 분이었나요? 그중 \'몇 시\'의 수만 써요.', f'시계는 {CLOCK_H}시 {CLOCK_M}분이에요. 마시멜로는 흰 것 {WHITE}개, 분홍 것 {PINK}개예요.', f'{CLOCK_H} + {WHITE} + {PINK}를 차례로 더해 봐요.'],
                      f'시계 {CLOCK_H}시 {CLOCK_M}분 → {CLOCK_H}, 마시멜로 {WHITE} + {PINK} = {WHITE + PINK} → {CLOCK_H} + {WHITE + PINK} = {CLOCK_H + WHITE + PINK}', chk=lambda: CLOCK_H + WHITE + PINK),
              go='exit', after='뒷문이 열렸어요!', guide='오두막 열쇠를 뒷문에 쓰고, 시계와 마시멜로 단서로 비밀번호를 계산해요.'),
        ]),
    ],
    flow=['clock', 'flags', 'fire', 'basket', 'cooler', 'tent', 'trail', 'rods', 'rscrap', 'tackle', 'tdraw', 'stick+hook', 'pool', 'stones',
          'shelf', 'wood', 'cabinet', 'exit'],
)
