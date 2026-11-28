"""수학 방탈출 · 우주선 탈출 (추천 3~4학년 · 보통) — 형식은 rooms.py 머리말"""
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
SP_CLOCK = 4                                              # 우주 시계 4시 → 두 바늘 사이 120°
SP_RULE = ['☆', '○', '○', '△'] * 2 + ['☆', '?']           # 규칙판: ☆ ○ ○ △ 되풀이, 맨 끝 ?
SP_FOOD = [[{'k': 'jar', 'c': '주황', 'n': 3}, {'k': 'gem', 'c': '보라', 'n': 2}],
           [{'k': 'jar', 'c': '주황', 'n': 3}, {'k': 'star', 'c': '노랑', 'n': 1}]]
SP_JARS = sum(it['n'] for r in SP_FOOD for it in r if it['k'] == 'jar')   # 식량 통 6개
SP_PER, SP_CREW = 14, 4                                   # 통마다 우주 식량 14개, 대원 4명
SP_LOG = ['화물 일지', '식량 통 1개 = 우주 식량 14개', '대원 4명이 똑같이 나눠 먹어요']
SP_FUEL = [('빨강', Fraction(5, 8)), ('노랑', Fraction(2, 8)), ('초록', Fraction(7, 8)), ('파랑', Fraction(4, 8))]
SP_FUEL_ITEMS = [{'c': c, 'label': f'{f * 8}/8'} for c, f in SP_FUEL]   # 약분하지 않고 8칸 중 몇 칸
SP_MAP = dict(n=4, m=6, start=[0, 3], path='RRUURRRDD', block=[[3, 2], [3, 3], [4, 2], [4, 3], [1, 1], [0, 0], [1, 0]], sl='로봇', gl='짐 더미')
SP_DIST, SP_DAY = 380000, 20000                           # 달 가까이에서 지구까지 380000 km(실제 평균 약 38만 4천 km를 어림), 캡슐은 하루에 2만 km(이야기 속 값)
SP_MAN = f'{SP_DIST // 10000}만'                            # 큰 수 읽기: 38만
SP_SIGN = ['탈출 캡슐은', '하루에 2만 km씩 날아요']

ROOM = dict(
    id='space', title='우주선 탈출', ico='🛸', acc='#3B6FD6',
    rec='추천 4학년 · 곱셈·나눗셈·분수 크기 비교·각도·큰 수·규칙·방향·색깔',
    intro='삐뽀삐뽀! 우주선의 전원이 꺼지고 문이 모두 잠겼어요. 조종실과 화물칸을 둘러보며 단서를 모아, 탈출 캡슐을 타고 지구로 돌아가요.',
    story=['우주선을 타고 달 가까이에서 별을 구경하던 중, 삐뽀삐뽀! 경고등이 번쩍였어요.', '전원이 꺼지더니 쿵! 문이 모두 닫히고 잠겨 버렸어요.', '조종실과 화물칸의 단서를 모아 탈출 캡슐을 타고 지구로 돌아가요!'],
    outro='탈출 캡슐의 문이 열렸어요! 캡슐에 올라타 단추를 누르니 파란 지구가 점점 커져요. 우주선을 탈출했어요!',
    mission=dict(title='지구로 돌아가라!', goal='조종실과 화물칸의 단서를 모아 탈출 캡슐을 타고 지구로 돌아가요.', tips=['시계 바늘 사이의 각을 잘 봐요', '카드 조각은 가방에서 합쳐 봐요']),
    dialog=[('nar', '우주선을 타고 달 가까이에서 별을 구경하던 중, 경고등이 번쩍였어요.'),
            ('tori', '삐뽀삐뽀? 무슨 일이야?'),
            ('nar', '전원이 꺼지더니 쿵! 문이 모두 닫히고 잠겨 버렸어요.'),
            ('momo', '경고등이 켜졌어. 탈출 캡슐로 가야 해.'),
            ('tori', '저 작은 파란 점이 지구지? 꼭 돌아가자!'),
            ('momo', '조종실부터 단서를 정리해 보자.')],
    outro_dialog=[('tori', '파란 지구가 점점 커진다! 집에 가자!'), ('momo', '각도와 큰 수 계산이 길잡이가 됐어.')],
    items={'torch': dict(nm='손전등', k='torch', c='#F2C230', de='어두운 곳을 비출 수 있어요'),
           'card': dict(nm='출입 카드', k='card', c='#3B6FD6', de='카드에 \'화물칸\'이라고 적혀 있어요'),
           'bat': dict(nm='건전지', k='battery', c='#3DA35D', de='무언가를 움직이게 할 수 있어요'),
           'cd1': dict(nm='카드 왼쪽 조각', k='tornL', c='#3B6FD6', de='반으로 찢어진 출입 카드의 왼쪽이에요. 오른쪽 조각은 어디 있을까요?'),
           'cd2': dict(nm='카드 오른쪽 조각', k='tornR', c='#3B6FD6', de='반으로 찢어진 출입 카드의 오른쪽이에요.')},
    combine=[dict(a='cd1', b='cd2', make='card', msg='두 조각을 맞대고 테이프로 붙였더니 **출입 카드**가 되었어요!')],
    scenes=[
        dict(id='a', nm='조종실', bg=dict(wall='#2B3A6B', floor='#5A6273', deco='stars'), objs=[
            O('porthole', '관측 창', 'spWindow', 30, 30, 150, 150,
              say=('tori', '저 작은 파란 점이 우리 지구야!'), look='둥근 창밖으로 별이 반짝여요. 저 멀리 작은 파란 점이 보여요. 우리가 돌아갈 지구예요!', lookFig=F('spWindow', 220, 220), guide='관측 창은 구경만 해도 돼요.'),
            O('clock', '우주 시계', 'clock', 210, 50, 110, 110, dict(h=SP_CLOCK, m=0, c='#EAF2FB'), keep=True,
              say=('momo', '두 바늘 사이의 각을 재 보자.'), look='조종실의 우주 시계예요. 시계가 멈춰 있어요! **긴바늘과 짧은바늘 사이의 각**을 잘 보세요.',
              lookFig=F('clock', 160, 160, h=SP_CLOCK, m=0, c='#EAF2FB'), guide='우주 시계의 두 바늘이 몇 시를 가리키는지, 사이의 각을 살펴보세요.'),
            O('rule', '조종실 규칙판', 'poster', 350, 40, 310, 130, dict(lines=['조종실 규칙판'], shapes=SP_RULE, c='#EAF2FB'), keep=True,
              say=('tori', '모양이 되풀이되는 것 같아!'), look='규칙판에 모양이 규칙대로 놓여 있어요. 맨 끝은 **?** 로 지워져 있어요. 어떤 모양들이 되풀이될까요?',
              lookFig=F('poster', 340, 130, lines=['조종실 규칙판'], shapes=SP_RULE, c='#EAF2FB'), guide='규칙판에서 되풀이되는 모양 묶음을 찾아 두세요.'),
            O('rscrap', '규칙판 구석 쪽지', 'scrap', 258, 6, 46, 34, dict(t='?'), in_='rule', keep=True,
              look='규칙판 구석에 아주 작은 쪽지가 붙어 있어요! "사물함 속 작은 서랍 = **(규칙판의 ○ 수 + △ 수) × (우주 시계가 가리키는 몇 시의 수)**" (? 자리는 세지 않아요)',
              guide='조종실 규칙판을 크게 보고 구석의 작은 쪽지를 찾아보세요.'),
            O('screen', '항해 화면', 'screen', 690, 30, 280, 210, dict(lines=['전원 꺼짐', '색 단추로 켜요'], open=['지구까지 남은 거리', f'{SP_DIST} km', f'({SP_MAN} km)']),
              look='큰 항해 화면이 꺼져 있어요. 아래에 빨강·노랑·초록·파랑 색 단추가 있어요.',
              lock=Lk('color', [c for c, _ in sorted(SP_FUEL, key=lambda r: -r[1])], '화면 아래 글: **연료가 많이 남은 통부터** 그 통의 색 단추를 차례로 눌러 전원을 켜요.',
                      ['화물칸의 연료 통에 적힌 분수를 보세요. 통 하나를 똑같이 8로 나눈 것 중 몇만큼 남았는지 나타내요.', '분모가 8로 같으면 분자가 클수록 큰 분수예요. 네 통의 분자를 견주어 큰 것부터 늘어놓아 보세요.'],
                      '초록 7/8 → 빨강 5/8 → 파랑 4/8 → 노랑 2/8 (분모가 같으면 분자가 큰 것이 더 커요)',
                      chk=lambda: [c for _, c in sorted([(-Fraction(5, 8), '빨강'), (-Fraction(2, 8), '노랑'), (-Fraction(7, 8), '초록'), (-Fraction(4, 8), '파랑')])]),
              after=f'화면이 켜졌어요! **지구까지 남은 거리: {SP_DIST} km({SP_MAN} km)** 라고 떠 있어요. 우주선이 달 가까이에 있어서, 실제 달과 지구 사이 거리(약 38만 km)와 비슷해요.',
              guide='화물칸 연료 통의 분수를 크기 차례로 늘어놓아 항해 화면을 켜요.'),
            O('locker', '우주복 사물함', 'cabinet', 30, 210, 160, 170, dict(label='우주복', c='#C8D3E0'),
              look='우주복이 든 사물함이에요. 문에 숫자 자물쇠 세 칸이 있어요.',
              lock=Lk('num', str(SP_CLOCK * 30), '자물쇠 옆 글: **우주 시계의 두 바늘이 이루는 작은 쪽 각은 몇 도일까요?**',
                      ['시계 한 바퀴는 360°예요. 숫자는 12개 있어요.', '숫자 한 칸 사이는 360° ÷ 12 = 30°예요. 4시에는 두 바늘 사이가 몇 칸일까요?'],
                      f'4시 → 두 바늘 사이 4칸, 한 칸 30° → 30° × 4 = {SP_CLOCK * 30}°', chk=lambda: 360 // 12 * SP_CLOCK),
              give=['torch'], after='사물함이 열렸어요! 우주복 주머니에 **손전등**이 있어요. 사물함 아래쪽에는 작은 서랍도 보여요.', guide='우주 시계의 각도로 우주복 사물함을 열어요.'),
            O('ldraw', '사물함 속 작은 서랍', 'drawer', 75, 118, 70, 40, dict(c='#8A929C', lock=True), in_='locker',
              lock=Lk('num', str((SP_RULE.count('○') + SP_RULE.count('△')) * SP_CLOCK), '사물함 아래쪽 작은 서랍에 숫자 자물쇠가 있어요. 규칙판 구석 쪽지에 적힌 대로 계산해요.',
                      ['조종실 규칙판을 크게 보면 구석에 작은 쪽지가 있어요. 거기에 계산 방법이 적혀 있어요.', f'규칙판에 ○는 {SP_RULE.count("○")}개, △는 {SP_RULE.count("△")}개예요. 우주 시계는 {SP_CLOCK}시예요.', f'{SP_RULE.count("○")} + {SP_RULE.count("△")} = {SP_RULE.count("○") + SP_RULE.count("△")}, 여기에 {SP_CLOCK}를 곱해요.'],
                      f'○ {SP_RULE.count("○")}개 + △ {SP_RULE.count("△")}개 = {SP_RULE.count("○") + SP_RULE.count("△")}, × {SP_CLOCK}시 = {(SP_RULE.count("○") + SP_RULE.count("△")) * SP_CLOCK}',
                      chk=lambda: sum(1 for k in SP_RULE if k in ('○', '△')) * SP_CLOCK),
              give=['cd2'], after='작은 서랍 안에 찢어진 **카드 오른쪽 조각**이 들어 있어요.', guide='우주복 사물함을 연 뒤 사물함 아래쪽의 작은 서랍을 눌러 보세요.'),
            O('crate', '어두운 구석 상자', 'box', 260, 400, 170, 130, dict(c='#3A3F48', lock=True, label='?'),
              look='조종실 구석에 놓인 상자예요.',
              need='torch', needMsg='깜깜해서 상자 뚜껑이 보이지 않아요. 비출 것이 있으면 좋겠어요.', useMsg='손전등을 비추니 뚜껑에 모양 단추 네 칸이 보여요!',
              lock=Lk('shape', ['○', '○', '△', '☆'], '뚜껑 글: **조종실 규칙판의 ? 자리부터** 규칙대로 모양 네 개를 차례로 눌러요.',
                      ['수첩의 규칙판을 열어 보세요. ☆ ○ ○ △ 가 한 묶음으로 되풀이돼요.', '규칙판의 마지막으로 보이는 모양은 ☆였어요. ☆ 다음에는 무엇이 올까요?'],
                      '☆ ○ ○ △ 가 되풀이되므로 ☆ 다음 ? 자리부터 ○ ○ △ ☆',
                      chk=lambda: [['☆', '○', '○', '△'][i % 4] for i in range(9, 13)]),
              give=['cd1'], after='상자 안에 반으로 찢어진 **카드 왼쪽 조각**과 **로봇 길 지도**가 있어요. 카드 조각에는 \'화물\'까지만 보여요. 지도에는 화물칸 로봇이 짐 더미까지 가는 길이 빨간 점으로 그려져 있어요.',
              afterFig=F('map', 330, 240, **SP_MAP), guide='손전등으로 어두운 구석 상자를 비추고, 규칙판의 규칙으로 모양 단추를 눌러요.'),
            O('hatch', '화물칸 문', 'door', 820, 270, 140, 220, dict(c='회색', sign='화물칸', keypad=False),
              look='화물칸으로 가는 문이에요. 옆에 카드 꽂는 곳이 있어요.',
              need='card', needMsg='"출입 카드를 대 주세요"라는 글이 깜빡여요.', useMsg='출입 카드를 대니 삐빅! 문이 열렸어요.',
              go='b', after='문 너머에 화물칸이 보여요.', guide='출입 카드로 화물칸 문을 열어 보세요.'),
        ]),
        dict(id='b', nm='화물칸', bg=dict(wall='#3A4560', floor='#2E3542', deco='tile'), objs=[
            O('food', '식량 선반', 'shelf', 30, 60, 290, 200, dict(rows=SP_FOOD, c='#8A929C'), keep=True,
              say=('momo', '주황색 통만 식량이래. 다른 건 빼고 세자.'), look='우주 식량을 넣어 둔 선반이에요. **주황색 통이 식량 통**이에요. 보석과 별 장식은 식량이 아니에요.',
              lookFig=F('shelf', 300, 200, rows=SP_FOOD, c='#8A929C'), guide='식량 선반의 주황색 식량 통이 몇 개인지 세어 보세요.'),
            O('log', '화물 일지', 'board', 350, 40, 320, 160, dict(lines=SP_LOG, fs=19), keep=True,
              look='화물 일지예요. 식량 통 하나에 우주 식량이 몇 개씩 들었는지 적혀 있어요.',
              lookFig=F('board', 340, 160, lines=SP_LOG, fs=20), guide='화물 일지를 읽고 수첩에 남겨 두세요.'),
            O('fuel', '연료 통', 'bottles', 690, 20, 290, 200, dict(items=SP_FUEL_ITEMS), keep=True,
              say=('momo', '모두 똑같이 나눈 것이니 분자끼리 견주면 돼.'), look='연료 통 네 개예요. 통마다 남은 연료의 양이 분수로 적혀 있어요. 통 하나를 똑같이 8로 나눈 것 중 **몇만큼 남았는지**를 나타내요.',
              lookFig=F('bottles', 480, 230, items=SP_FUEL_ITEMS), guide='연료 통에 적힌 분수를 수첩에 남겨 두세요. 조종실 화면에 쓰여요.'),
            O('notice', '캡슐 안내문', 'sign', 700, 250, 270, 100, dict(lines=SP_SIGN, c='#2E7D5B', fs=24), keep=True,
              say=('tori', '캡슐이 하루에 얼마나 가는지 적혀 있어!'), look='탈출 캡슐 안내문이에요. 캡슐이 하루에 얼마나 날아가는지 적혀 있어요. (캡슐 빠르기는 이 이야기에서 정한 값이에요. 실제 우주선은 이보다 훨씬 빨라요.)',
              lookFig=F('sign', 320, 110, lines=SP_SIGN, c='#2E7D5B', fs=26), guide='캡슐 안내문을 읽어 두세요.'),
            O('tools', '공구 상자', 'box', 30, 400, 180, 130, dict(c='빨강', lock=True, label='?'),
              look='빨간 공구 상자예요. 숫자 자물쇠 두 칸이 있어요.',
              lock=Lk('num', str(SP_JARS * SP_PER // SP_CREW), '뚜껑 글: **식량 통의 우주 식량을 대원 4명이 똑같이 나누면 한 사람에게 몇 개씩일까요?**',
                      ['식량 선반의 주황색 통은 몇 개인가요? 화물 일지도 보세요.', f'식량 통 {SP_JARS}개 × 14개 = 우주 식량 모두 몇 개?', '모두 몇 개인지 구한 뒤 대원 4명으로 나누어요. 80 ÷ 4와 4 ÷ 4로 나누어 생각하면 쉬워요.'],
                      f'식량 통 {SP_JARS}개 × {SP_PER} = {SP_JARS * SP_PER}개, {SP_JARS * SP_PER} ÷ {SP_CREW} = {SP_JARS * SP_PER // SP_CREW}(개)',
                      chk=lambda: SP_JARS * SP_PER // SP_CREW),
              give=['bat'], after='공구 상자가 열렸어요! 안에 **건전지**가 있어요.', guide='식량 통 수와 화물 일지로 공구 상자를 열어요.'),
            O('robot', '화물 로봇', 'robot', 300, 380, 110, 150, dict(c='#B8C4D6'),
              look='짐을 나르는 화물 로봇이에요.',
              need='bat', needMsg='로봇 배에 건전지 넣는 곳이 비어 있어요.', useMsg='건전지를 넣으니 로봇 눈에 불이 들어왔어요! "가야 할 길을 알려 주세요."',
              lock=Lk('dir', segs(SP_MAP['path']), '로봇에게 길을 알려 줘요. 어두운 구석 상자에서 찾은 지도를 보고, **가는 방향이 바뀌는 차례대로** 화살표를 눌러요.',
                      ['수첩의 로봇 길 지도를 열어 보세요. \'로봇\'에서 출발해 빨간 점을 따라가요.', '처음에는 오른쪽으로 가요. 그다음은 위, 그다음은? 화살표는 모두 4개예요.'],
                      '오른쪽으로 2칸, 위로 2칸, 오른쪽으로 3칸, 아래로 2칸 가요. 누를 차례: → ↑ → ↓', chk=lambda: segs('RRUURRRDD')),
              after='로봇이 지도대로 걸어가 짐 더미를 번쩍 들어 옮겼어요! 짐 뒤에 **탈출 캡슐 문**이 숨어 있었어요.',
              guide='건전지를 로봇에 넣고 지도대로 길을 알려 주세요.'),
            O('exit', '탈출 캡슐 문', 'door', 480, 260, 140, 220, dict(c='주황', sign='탈출 캡슐'), req=['robot'],
              look='탈출 캡슐 문이에요. 숫자판이 있어요.',
              lock=Lk('num', str(SP_DIST // SP_DAY), '숫자판 위 글: **지구까지 가려면 탈출 캡슐로 며칠 날아가야 할까요?**',
                      ['조종실 항해 화면에 지구까지 남은 거리가 떠 있어요. 캡슐 안내문도 보세요.', f'{SP_DIST}은 {SP_MAN}이에요. {SP_MAN} 안에 2만이 몇 번 들어갈까요?', '38 ÷ 2를 생각해 봐요.'],
                      f'{SP_DIST} km = {SP_MAN} km, {SP_MAN} ÷ 2만 = 38 ÷ 2 = 19 → 19일', chk=lambda: SP_DIST // SP_DAY),
              go='exit', after='탈출 캡슐 문이 열렸어요!', guide='항해 화면의 거리와 캡슐 안내문으로 며칠 걸리는지 구해요.'),
        ]),
    ],
    flow=['clock', 'locker', 'rule', 'rscrap', 'ldraw', 'crate', 'cd1+cd2', 'hatch', 'fuel', 'food', 'log', 'notice', 'tools', 'robot', 'screen', 'exit'],
)
