"""2학년 종이접기 — 접는 횟수 4~6번, 비스듬히 접기·앞뒤 따로 접기"""
import math
from geo import *

def dirpt(p, deg, r):
    a = math.radians(deg)
    return (p[0] + r * math.cos(a), p[1] + r * math.sin(a))

# ── 튤립 ────────────────────────────────────
tt = [(25, 175), (215, 175), (120, 80)]
tp = (112, 175)
tip_t = dirpt(tp, 240, 112 - 25)                         # 꽃잎 끝: 위·왼쪽으로
tq = X(tp, mid((25, 175), tip_t), (25, 175), (120, 80))   # 접는 선이 왼쪽 변과 만나는 곳
pet_l, pet_r = [tp, tq, tip_t], mirror([tp, tq, tip_t])
t_body1 = [tp, (215, 175), (120, 80), tq]
t_body2 = [tp, mx(tp), mx(tq), (120, 80), tq]
stem = [W('M120 175 C 118 200 121 215 120 232', 6, '#3E9A3E'), W('M120 214 C 98 196 82 200 74 206 C 92 216 108 218 120 214Z', 2, '#2E7D32', '#5DBB63'),
        W('M121 205 C 140 188 156 190 164 196 C 148 208 134 210 121 205Z', 2, '#2E7D32', '#5DBB63')]
tulip = dict(id='tulip', name='튤립', ico='🌷', color='#E8608A', level=2, diff=1, paper='색종이 1장, 초록 색연필', time='4분',
  desc='세모를 접고 양쪽을 올리면 활짝 핀 튤립이 돼요.',
  steps=[
    dict(t='색깔 면이 밑으로 가게 마름모로 놓아요. 아래 꼭짓점을 위 꼭짓점에 맞추어 반으로 접어요.',
         d=[P(DIA, 'w'), V((25, 120), (215, 120)), O((120, 25)), O((120, 215)), A((132, 206), (132, 34), .3)]),
    dict(t='왼쪽 아래 끝을 위로 비스듬히 접어 올려요. 끝이 꼭대기보다 조금 옆으로 나오게 해요.',
         d=[P(tt), V(tp, tq), A((32, 170), tip_t, -.45)]),
    dict(t='오른쪽 아래 끝도 똑같이 접어 올려요. 양쪽이 같은 모양이 되게 해요.',
         d=[P(t_body1), P(pet_l, 'c2'), V(mx(tp), mx(tq)), A((208, 170), mx(tip_t), .45)]),
    dict(t='꽃 완성! 아래에 초록색으로 줄기와 잎을 그리거나, 초록 종이를 길게 잘라 붙여요.',
         d=[P(t_body2), P(pet_l, 'c2'), P(pet_r, 'c2')] + stem),
  ],
  tip='여러 색 튤립을 접어 도화지에 붙이면 꽃밭 작품이 돼요.')

# ── 컵 ──────────────────────────────────────
CL, CR, CA, CY = 14, 226, (120, 76), 182        # 큰 세모: 밑변 y=CY
ct = [(CL, CY), (CR, CY), CA]
h = (CR - CL) / (2 + math.sqrt(2)); y = CY - h
cE, cB = (CR - h, y), (CL + h, y)                       # 오른쪽 변의 접는 점, 왼쪽 변에 닿는 점
cF = X(cE, dirpt(cE, 112.5, 10), (0, CY), (1, CY))     # 접는 선이 밑변과 만나는 곳
fr = [cF, cE, cB]                                        # 오른쪽 끝을 접은 날개
fl = mirror(fr)
cup_top = [cB, cE, CA]
cup_body = [mx(cF), cF, cE, cB]
front = [cB, cE, (120, 2 * y - CA[1])]
cup = dict(id='cup', name='컵', ico='🥤', color='#4C9BE0', level=2, diff=2, paper='색종이 1장', time='5분',
  desc='진짜로 물을 조금 담을 수 있는 종이컵이에요.',
  steps=[
    dict(t='색깔 면이 밑으로 가게 마름모로 놓아요. 아래 꼭짓점을 위 꼭짓점에 맞추어 반으로 접어요.',
         d=[P(DIA, 'w'), V((25, 120), (215, 120)), O((120, 25)), O((120, 215)), A((132, 206), (132, 34), .3)]),
    dict(t='오른쪽 끝을 왼쪽 변에 닿게 접어요. 접은 부분의 윗선이 바닥과 나란하게(수평) 되게 해요.',
         d=[P(ct), V(cE, cF), O(cB), A((CR - 8, CY - 5), cB, .35)]),
    dict(t='왼쪽 끝도 똑같이 오른쪽 변에 닿게 접어요.',
         d=[P([(CL, CY), cF, cE, CA]), P(fr, 'c2'), V(mx(cE), mx(cF)), O(cE), A((CL + 8, CY - 5), cE, -.35)]),
    dict(t='위에 남은 세모 중 앞의 한 장만 앞으로 접어 내려요.',
         d=[P(cup_body), P(cup_top), P(fr, 'c2'), P(fl, 'c2'), V(cB, cE), A((120, 84), (120, 2 * y - CA[1] - 6), -.5)]),
    dict(t='뒤에 남은 세모 한 장은 뒤로 접어 내려요.',
         d=[P(cup_body), P(cup_top, 'c2'), P(fr, 'c2'), P(fl, 'c2'), P(front), M(cB, cE), B((126, 84), (150, y - 4), .5)]),
    dict(t='입구를 살짝 벌리면 컵 완성!',
         d=[P(cup_body), P(fr, 'c2'), P(fl, 'c2'), P(front), W('M%.1f %.1fQ120 %.1f %.1f %.1f' % (cB[0], cB[1], cB[1] - 12, cE[0], cE[1]), 2.4, '#3A3028', '#FFFFFF')]),
  ],
  tip='물을 담을 때는 아주 조금만! 종이가 젖으면 금방 찢어져요.')

# ── 매미 ────────────────────────────────────
mt = [(20, 120), (220, 120), (120, 20)]
m_dia = [(120, 20), (70, 70), (120, 120), (170, 70)]
m_fl = [(120, 120), (70, 70), (120, 20)]
m_tgt = (100, 174)
m_a, m_b = bisector((120, 20), m_tgt)
m_stay, m_wing = fold(m_fl, m_a, m_b, keep_left=True)
if not any(abs(p[1] - 120) < 1 for p in m_stay): m_stay, m_wing = fold(m_fl, m_a, m_b, keep_left=False)
mc1, mc2 = clip(m_fl, m_a, m_b)
m_wing_r, m_stay_r = mirror(m_wing), mirror(m_stay)
y1, y2 = 48, 38
cic_eyes = [D((106, 47), 4), D((134, 47), 4)]
def cic(top, extra=()):
    sh = [P(m_dia), P(m_stay, 'w'), P(m_stay_r, 'w'), P(m_wing), P(m_wing_r)]
    return sh + list(extra)
top1 = [(120 - (y1 - 20), y1), (120 + (y1 - 20), y1), (120, 2 * y1 - 20)]
top2 = [(120 - (y2 - 20), y2), (120 + (y2 - 20), y2), (120, 2 * y2 - 20)]
band1 = [(120 - (y2 - 20), y2), (120 + (y2 - 20), y2), (120 + (y1 - 20), y1), (120 - (y1 - 20), y1)]
xa, xb = 80, 160
def cut(shs):
    out = []
    for s in shs:
        if s[0] == 'P':
            q = band([tuple(p) for p in s[1]], xa, xb)
            if len(q) > 2: out.append(P(q, s[2]))
        else: out.append(s)
    return out
m5 = [P(m_dia), P(m_stay, 'w'), P(m_stay_r, 'w'), P(m_wing), P(m_wing_r), P([(120 - (y2 - 20), y2), (120 + (y2 - 20), y2), (170, 70), (120, 120), (70, 70)], 'c'), P(band1, 'w'), P(top1, 'w'), P(top2, 'c2')]
cicada = dict(id='cicada', name='매미', ico='🦗', color='#5BA65B', level=2, diff=3, paper='색종이 1장, 사인펜', time='6분',
  desc='날개를 펼친 매미예요. 위쪽을 한 장씩 접는 것이 비법!',
  steps=[
    dict(t='색깔 면이 밑으로 가게 마름모로 놓고, 아래 꼭짓점을 위 꼭짓점에 맞추어 반으로 접어요.',
         d=[P(DIA, 'w'), V((25, 120), (215, 120)), O((120, 25)), O((120, 215)), A((132, 206), (132, 34), .3)]),
    dict(t='양쪽 끝을 위 꼭짓점에 맞추어 접어 올려요. 마름모가 돼요.',
         d=[P(mt), V((120, 120), (70, 70)), V((120, 120), (170, 70)), O((120, 20)), A((26, 114), (112, 26), -.35), A((214, 114), (128, 26), .35)]),
    dict(t='올린 두 장을 비스듬히 접어 내려 날개를 만들어요. 끝이 아래로, 바깥쪽으로 나오게 해요.',
         d=[P(m_dia), P(m_fl, 'w'), P(mirror(m_fl), 'w'), V(mc1, mc2), V(mx(mc1), mx(mc2)), A((114, 28), m_tgt, .35), A((126, 28), mx(m_tgt), -.35)]),
    dict(t='위 꼭짓점의 앞쪽 한 장만 접어 내려요.',
         d=cic(0, [V(top1[0], top1[1]), A((120, 24), (120, 72), -.5)])),
    dict(t='남은 뒤쪽 한 장도 조금 덜 내려서 접어요. 두 줄이 층층이 보여요.',
         d=[P(m_dia), P(m_stay, 'w'), P(m_stay_r, 'w'), P(m_wing), P(m_wing_r), P(top1, 'w'), V(top2[0], top2[1]), A((128, 24), (128, 54), -.5)]),
    dict(t='양옆을 뒤로 조금씩 접어요(산 접기).',
         d=m5 + [M((xa, 40), (xa, 175)), M((xb, 40), (xb, 175)), B((72, 66), (92, 84), -.5), B((168, 66), (148, 84), .5)]),
    dict(t='눈을 그리면 매미 완성!',
         d=cut(m5) + cic_eyes),
  ],
  tip='날개를 접는 각도를 바꾸면 나비, 잠자리처럼 보이기도 해요.')

MODELS = [tulip, cup, cicada]
