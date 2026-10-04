"""4학년 종이접기 — 8단계 안팎, 선에 맞춰 접기·가위로 자르기"""
import math
from geo import *

# ── 하트 ────────────────────────────────────
T0, R0, B0, L0 = (120, 25), (215, 120), (120, 215), (25, 120)
yA = 72.5                                   # 위 꼭짓점을 가운데에 맞추어 접는 선
hA = [(72.5, yA), (167.5, yA), (120, 120)]
pent = [(72.5, yA), (167.5, yA), R0, B0, L0]
yB = (215 + yA) / 2                          # 아래 꼭짓점을 위 가장자리에 맞추어 접는 선
wB = 215 - yB
hex_ = [(72.5, yA), (167.5, yA), R0, (120 + wB, yB), (120 - wB, yB), L0]
hB = [(120 - wB, yB), (120 + wB, yB), (120, yA)]
c0 = (120, yB)                               # 아래 가운데 점
# 오른쪽 아래 가장자리를 가운데 세로선에 맞추어 접기: c0를 지나는 45도 선
cr_a, cr_b = c0, (c0[0] + 100, c0[1] - 100)
right = [(120, yA), (167.5, yA), R0, (120 + wB, yB), c0]
r_stay, r_move = split(right, cr_a, cr_b)
if any(abs(p[0] - (120 + wB)) < .5 for p in r_stay): r_stay, r_move = r_move, r_stay
r_move = Rs(r_move, cr_a, cr_b)
cc1, cc2 = clip(right, cr_a, cr_b)
heart_o = r_stay + []                          # 오른쪽 반 겉모양(남은 부분)
def heart_side(fill_stay='c', fill_move='c2'):
    return [P(r_stay, fill_stay), P(r_move, fill_move), P(mirror(r_stay), fill_stay), P(mirror(r_move), fill_move)]
# 뒤집은 뒤(뒷면) 겉모양: 접어 올린 부분이 뒤에 깔리고 앞은 모두 색깔 면
back = [P(r_move, 'c'), P(r_stay, 'c'), P(mirror(r_move), 'c'), P(mirror(r_stay), 'c')]
lobe, outer, bot, notch_ = (143.75, 48.75), (179.375, 84.375), c0, (120, yA)
h_out = [bot, mx(outer), mx(lobe), notch_, lobe, outer]           # 하트 겉선(아래 끝부터)
def corner_cut(p, d1, d2, k=13):
    return (lerp(p, d1, k / math.dist(p, d1)), lerp(p, d2, k / math.dist(p, d2)))
knots = [corner_cut(outer, lobe, bot), corner_cut(lobe, notch_, outer, 16)]
final_h = [W(rounded(h_out, [6, 16, 20, 4, 20, 16]), 1.6, '#3A3028', 'c'),
           W('M104 76q8-6 14 2', 2.6, '#FFFFFF')]
heart = dict(id='heart', name='하트', ico='💗', color='#E8506A', level=4, diff=2, paper='색종이 1장', time='7분',
  desc='마음을 전하는 하트예요. 편지에 붙이거나 카드로 만들어요.',
  steps=[
    dict(t='색깔 면이 밑으로 가게 마름모로 놓아요. 대각선 두 개를 접었다 펴서 가운데 점을 찾아요.',
         d=[P(DIA, 'w'), V(T0, B0), V(L0, R0), O((120, 120)), U((60, 150), (150, 60), .3)]),
    dict(t='위 꼭짓점을 가운데 점에 맞추어 접어 내려요.',
         d=[P(DIA, 'w'), L(T0, B0), L(L0, R0), V((72.5, yA), (167.5, yA)), O((120, 120)), A((128, 32), (128, 112), -.45)]),
    dict(t='아래 꼭짓점을 위쪽 가장자리에 맞추어 접어 올려요.',
         d=[P(pent, 'w'), P(hA, 'c'), L((120, 120), B0), V((120 - wB, yB), (120 + wB, yB)), O((120, yA)), A((128, 208), (128, 80), .45)]),
    dict(t='아래 가장자리를 가운데 세로선에 맞추어 비스듬히 접어 올려요. 오른쪽, 왼쪽 모두 해요.',
         d=[P(hex_, 'w'), P(hA, 'c'), P(hB, 'c'), L((120, yA), (120, yB)), V(cc1, cc2), V(mx(cc1), mx(cc2)), O(c0), A((184, yB - 4), (126, yB - 54), .4), A((56, yB - 4), (114, yB - 54), -.4)]),
    dict(t='하트 모양이 나왔어요. 뒤집어요.',
         d=back + [FLIP], fit=True),
    dict(t='양쪽 옆 모서리와 위쪽 모서리들을 뒤로 조금씩 접어 둥글게 다듬어요.',
         d=back + [M(*k) for k in knots] + [M(mx(k[0]), mx(k[1])) for k in knots] + [B((190, 70), (174, 82), -.5), B((50, 70), (66, 82), .5)], fit=True),
    dict(t='하트 완성!',
         d=final_h + [P([mx(outer), mx(lobe), lobe, outer, bot], 'none')], fit=True),
  ],
  tip='뒷면에 짧은 편지를 써서 친구에게 줘 보세요. 마지막 단계에서 모서리를 조금만 접으면 뾰족한 하트, 많이 접으면 동글동글한 하트가 돼요.')

# ── 팔랑개비 ────────────────────────────────
corn = [(40, 40), (200, 40), (200, 200), (40, 200)]
cutp = [lerp(c, (120, 120), .62) for c in corn]
def blade(i):
    """i번째 날개(0=위): 왼쪽 반은 그대로, 오른쪽 끝은 가운데로 둥글게 말려 들어감(흰 뒷면이 보임)"""
    flat = rot([(40, 40), (120, 40), (120, 120)], 90 * i)
    a, c, b = rot([(120, 40), (196, 44), (124, 114)], 90 * i)
    return [P(flat, 'c'), W('M%.1f %.1fQ%.1f %.1f %.1f %.1fL120 120Z' % (a[0], a[1], c[0], c[1], b[0], b[1]), 1.6, '#3A3028', 'w')]
pin = [D((120, 120), 6, '#C8C2BA'), D((120, 120), 2.5, '#5C5047')]
pinwheel = dict(id='pinwheel', name='팔랑개비', ico='🎐', color='#3EA8A0', level=4, diff=1, paper='색종이 1장, 가위, 압정이나 할핀, 빨대(나무젓가락)', time='10분',
  desc='바람이 불면 빙글빙글 돌아가는 팔랑개비예요.',
  steps=[
    dict(t='색깔 면이 위로 오게 놓아요. 대각선 두 개를 접었다 펴요.',
         d=[P(SQ, 'c'), V((40, 40), (200, 200)), V((200, 40), (40, 200)), U((60, 196), (196, 60), .25)]),
    dict(t='네 귀퉁이에서 가운데 쪽으로 대각선을 따라 가위로 잘라요. 가운데까지 다 자르지 말고 조금 남겨요.',
         d=[P(SQ, 'c'), L((40, 40), (200, 200)), L((200, 40), (40, 200))] + [C(c, p) for c, p in zip(corn, cutp)] + [O((120, 120))]),
    dict(t='귀퉁이마다 뾰족한 끝이 두 개씩 생겼어요. 하나씩 건너뛰며 끝 4개를 가운데로 모아요. 꾹 접지 말고 둥글게 휘어 오게 해요.',
         d=[P(SQ, 'c')] + [L(c, p) for c, p in zip(corn, cutp)] + [L(p, (120, 120)) for p in cutp] +
           [A((196, 46), (128, 112), .3), A((194, 196), (128, 128), .3), A((44, 194), (112, 128), .3), A((46, 44), (112, 112), .3)]),
    dict(t='모은 끝 4개와 가운데를 한꺼번에 압정이나 할핀으로 꽂아 빨대나 나무젓가락에 고정하면 완성! 선생님과 함께 해요.',
         d=[b for i in range(4) for b in blade(i)] + pin),
  ],
  tip='압정·할핀은 뾰족하니 꼭 어른과 함께 꽂아요. 입으로 불거나 들고 달리면 돌아가요.')

MODELS = [pinwheel, heart]
