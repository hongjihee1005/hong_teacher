"""5-1 4단원 「우리 몸의 구조와 기능」 전용 그림 부품 (s5ep16~21, s5mm04)

몸속 기관 그림은 차시 앱(grade5/science/_build_tb/src/u4-*.html)의 몸 그림(viewBox 0 0 320 470,
사람이 우리를 바라보는 모습 — 그림의 오른쪽 = 몸의 왼쪽)을 그대로 옮겨 SVG로 만든 뒤 불러옵니다.
그래서 기관의 위치·연결 차례가 앱과 같습니다.

  vb_svg(inner, vb, h)  SVG 조각 → 그림(가장 아래 칸 [0]은 보이지 않는 viewBox 틀) · vpt(mob, x, y) 앱 좌표 → 화면 좌표
  body(parts, h, face)  몸 바탕 + 기관('mouth eso liver gall stomach pancreas small large anus nose trachea bronchi
                        lungL lungR heart vessel kidL kidR ureter bladder' 가운데 고름) · skeleton(h) · muscles(h)
  path_pts(mob, pts)    앱 좌표 꺾은선 → 화면 좌표 꺾은선(점이 따라가는 길)
  arm_model(phi, skin)  뼈와 근육 모형(앱 armDraw 그대로: 위팔뼈·아래팔뼈·안쪽/바깥쪽 근육·손잡이) — 가운데 (0,0)
  leg_model(p)          의자에 앉기(1)·서기(0)의 넓적다리 앞쪽·뒤쪽 근육(앱 그림 그대로)
  giraffe(h)            박물관의 기린 뼈(앱 도입 그림)
  pump_rig(sq)          순환기관 모형실험(수조·호스·펌프, 앱 그림 그대로)
  bag_model(p)          호흡기관 모형(종이봉투 2장 + 주름 빨대 2개, p=부푼 정도)
  kidney_flow()         배설 경로 그림(앱 u4-5) · organ_map()  기관이 함께 일하는 그림(앱 u4-6)
"""
import hashlib
import os
import tempfile

import numpy as np
from manim import (DOWN, LEFT, ORIGIN, RIGHT, UP, PI, TAU,
                   Arc, Circle, Dot, Ellipse, Line, Polygon, Rectangle, RoundedRectangle, SVGMobject,
                   VGroup, VMobject, Arrow)
from manim.constants import CapStyleType

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, T, M
from scikit import RED
from kit_s3u12 import fit, text_card, ox_mark  # noqa: F401

SVG_DIR = os.path.join(tempfile.gettempdir(), "kit_s5u14_svg")
os.makedirs(SVG_DIR, exist_ok=True)

SKIN = '#f6d9c0'
SKL = '#d9a888'
BONE = '#f4efe2'
BONE_S = '#8f8672'
MUS = '#e2573f'
MUS_D = '#8a1f19'
MUS2 = '#f0a04b'
MUS2_D = '#9a5410'
ART = '#d9443a'      # 심장에서 나가는 혈액
VEN = '#3a78c8'      # 심장으로 들어오는 혈액
URINE = '#e0b84e'
WASTE = '#d4a017'
NAVY = '#0f3b5c'


# ══════════════ SVG 불러오기 ══════════════
def vb_svg(inner, vb=(0, 0, 320, 470), h=5.0):
    x0, y0, w, hh = vb
    src = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0} {y0} {w} {hh}" width="{w}" height="{hh}">'
           f'<rect x="{x0}" y="{y0}" width="{w}" height="{hh}" fill="#ffffff" fill-opacity="0.001" stroke="none"/>'
           f'{inner}</svg>')
    key = hashlib.md5(src.encode()).hexdigest()[:16]
    f = os.path.join(SVG_DIR, f"{key}.svg")
    if not os.path.exists(f):
        tmp = f + f".{os.getpid()}.tmp"
        with open(tmp, "w", encoding="utf-8") as fp:
            fp.write(src)
        os.replace(tmp, f)
    mob = SVGMobject(f, height=None, width=None, should_center=False, use_svg_cache=False)
    raw_h = mob[0].height
    mob.scale(h / raw_h)
    mob.move_to(ORIGIN)
    sc = h / hh                                  # 앱 1칸 → 화면 단위
    for m in mob.family_members_with_points():
        w_ = m.get_stroke_width()
        if w_ and w_ > 0:
            m.set_stroke(width=w_ * 100 * sc)
        try:
            m.cap_style = CapStyleType.ROUND
        except Exception:
            pass
    mob[0].set_fill(opacity=0).set_stroke(width=0)
    mob.vb = vb
    return mob


def vpt(mob, x, y):
    """앱 좌표(x, y) → 지금 그림이 놓인 화면 좌표"""
    x0, y0, w, hh = mob.vb
    fr = mob[0]
    l, r_ = fr.get_left()[0], fr.get_right()[0]
    t, b = fr.get_top()[1], fr.get_bottom()[1]
    return np.array([l + (x - x0) / w * (r_ - l), t - (y - y0) / hh * (t - b), 0.0])


def path_pts(mob, pts):
    return [vpt(mob, x, y) for x, y in pts]


def along(pts, f):
    """꺾은선 위 비율 f(0~1)의 점"""
    pts = [np.array(p, dtype=float) for p in pts]
    L = [0.0]
    for i in range(1, len(pts)):
        L.append(L[-1] + np.linalg.norm(pts[i] - pts[i - 1]))
    d = min(max(f, 0), 1) * L[-1]
    for i in range(1, len(pts)):
        if d <= L[i] + 1e-9:
            q = (d - L[i - 1]) / max(L[i] - L[i - 1], 1e-9)
            return pts[i - 1] + (pts[i] - pts[i - 1]) * q
    return pts[-1]


def polyline(pts, col, sw=6):
    m = VMobject(stroke_color=col, stroke_width=sw)
    m.set_points_as_corners([np.array(p, dtype=float) for p in pts])
    return m


# ══════════════ 몸 그림(앱 bodyBase·ORG 그대로) ══════════════
def body_base(face=True):
    s = (f'<g fill="none" stroke="{SKIN}" stroke-linecap="round"><path d="M92 146 L66 296" stroke-width="28"/>'
         f'<path d="M228 146 L254 296" stroke-width="28"/><path d="M130 326 L126 462" stroke-width="40"/>'
         f'<path d="M190 326 L194 462" stroke-width="40"/></g>')
    # 팔·다리 끝을 둥글게(캡 대신 원)
    for x, y, r in ((92, 146, 14), (66, 296, 14), (228, 146, 14), (254, 296, 14), (126, 462, 20), (194, 462, 20)):
        s += f'<circle cx="{x}" cy="{y}" r="{r}" fill="{SKIN}"/>'
    s += (f'<path d="M92 132 Q160 116 228 132 Q244 140 240 172 L236 214 Q232 276 222 334 L98 334 Q88 276 84 214 '
          f'L80 172 Q76 140 92 132Z" fill="{SKIN}" stroke="{SKL}" stroke-width="2.5"/>')
    s += f'<rect x="144" y="98" width="32" height="36" fill="{SKIN}"/><path d="M144 98 V128 M176 98 V128" stroke="{SKL}" stroke-width="2.5"/>'
    s += f'<ellipse cx="160" cy="62" rx="40" ry="46" fill="{SKIN}" stroke="{SKL}" stroke-width="2.5"/>'
    s += '<path d="M120 58 Q118 14 160 14 Q204 14 200 58 Q196 34 160 32 Q128 32 120 58Z" fill="#5a4334"/>'
    if face:
        s += ('<circle cx="146" cy="58" r="3.4" fill="#4a3a30"/><circle cx="174" cy="58" r="3.4" fill="#4a3a30"/>'
              '<path d="M150 86 Q160 92 170 86" stroke="#b5654f" stroke-width="2.5" fill="none"/>')
    return s


ORG = {
    'mouth': '<ellipse cx="160" cy="84" rx="12" ry="6.5" fill="#c4544a" stroke="#8a2f28" stroke-width="2"/><path d="M151 84 h18" stroke="#fff" stroke-width="2"/>',
    'eso': '<path d="M160 90 L160 128 Q162 160 176 184" fill="none" stroke="#e48d78" stroke-width="10"/><path d="M160 90 L160 128 Q162 160 176 184" fill="none" stroke="#f6c2b2" stroke-width="3"/>',
    'liver': '<path d="M96 190 Q118 170 180 176 Q190 186 180 196 Q152 214 112 214 Q94 208 96 190Z" fill="#a8473a" stroke="#6e2a20" stroke-width="2"/>',
    'gall': '<ellipse cx="150" cy="216" rx="8" ry="6" fill="#77a94e" stroke="#3f6a26" stroke-width="2"/>',
    'stomach': '<path d="M172 182 Q164 202 178 218 Q196 236 216 222 Q232 206 224 188 Q218 176 206 182 Q198 196 188 192 Q180 188 178 180Z" fill="#f2a27f" stroke="#a85a3c" stroke-width="2"/>',
    'pancreas': '<path d="M164 232 Q190 224 220 230 Q212 240 170 240Z" fill="#f2c66a" stroke="#a8842e" stroke-width="2"/>',
    'large': '<path d="M122 308 L120 256 Q120 247 129 247 L197 247 Q206 247 206 256 L206 300 Q206 314 182 318 L163 320" fill="none" stroke="#c97a4f" stroke-width="15"/><path d="M122 308 L120 256 Q120 247 129 247 L197 247 Q206 247 206 256 L206 300 Q206 314 182 318 L163 320" fill="none" stroke="#e6a77f" stroke-width="5"/>',
    'small': '<path d="M138 262 H186 A6 6 0 0 1 186 274 H138 A6 6 0 0 0 138 286 H186 A6 6 0 0 1 186 298 H140" fill="none" stroke="#e7a08d" stroke-width="8"/>',
    'anus': '<path d="M163 318 L161 334" stroke="#c97a4f" stroke-width="8"/><circle cx="161" cy="338" r="5" fill="#7a3f24"/>',
    'nose': '<path d="M152 70 Q160 50 168 70 Q164 76 160 74 Q156 76 152 70Z" fill="#f0b896" stroke="#b5654f" stroke-width="2"/>',
    'trachea': '<rect x="153" y="92" width="14" height="56" rx="5" fill="#cfe7f2" stroke="#5f9cc0" stroke-width="2"/><path d="M155 102 h10 M155 112 h10 M155 122 h10 M155 132 h10 M155 142 h10" stroke="#5f9cc0" stroke-width="1.6"/>',
    'bronchi': '<path d="M160 148 Q150 156 138 160 M138 160 L126 176 M138 160 L132 190 M160 148 Q170 156 182 160 M182 160 L194 176 M182 160 L188 190" fill="none" stroke="#3f84ad" stroke-width="5"/>',
    'lungL': '<path d="M150 138 Q120 130 106 160 Q98 198 112 220 Q134 226 152 214 Z" fill="#f3a9b2" stroke="#b25c68" stroke-width="2"/>',
    'lungR': '<path d="M170 138 Q200 130 214 160 Q222 198 208 220 Q186 226 168 214 Z" fill="#f3a9b2" stroke="#b25c68" stroke-width="2"/>',
    'heart': '<path d="M168 168 Q170 150 184 150 M178 164 Q182 156 194 158" fill="none" stroke="#d9443a" stroke-width="6"/><path d="M160 170 Q150 192 168 208 Q180 216 192 198 Q200 180 186 166 Q172 158 160 170Z" fill="#d9443a" stroke="#8a1f19" stroke-width="2"/>',
    'kidL': '<path d="M126 228 Q108 232 110 252 Q112 274 130 272 Q140 268 136 258 Q130 250 137 242 Q140 230 126 228Z" fill="#9b3c3c" stroke="#5e1f1f" stroke-width="2"/>',
    'kidR': '<path d="M194 224 Q212 228 210 248 Q208 270 190 268 Q180 264 184 254 Q190 246 183 238 Q180 226 194 224Z" fill="#9b3c3c" stroke="#5e1f1f" stroke-width="2"/>',
    'ureter': '<path d="M134 262 Q146 290 152 312 M186 258 Q174 290 168 312" fill="none" stroke="#e0b84e" stroke-width="5"/>',
    'bladder': '<ellipse cx="160" cy="318" rx="17" ry="13" fill="#f1cf62" stroke="#a8842e" stroke-width="2"/><path d="M160 331 V340" stroke="#e0b84e" stroke-width="4"/>',
}

# 혈관 고리(앱 u4-3 LOOPS: 붉은 = 심장에서 나감, 푸른 = 심장으로 들어옴)
LOOPS = [
    [[[172, 170], [168, 120], [168, 42]], [[158, 42], [158, 120], [162, 172]]],
    [[[166, 174], [130, 152], [100, 150], [74, 292]], [[62, 292], [90, 164], [126, 166], [162, 186]]],
    [[[186, 168], [212, 150], [224, 150], [250, 292]], [[260, 292], [232, 164], [214, 164], [192, 184]]],
    [[[176, 208], [176, 330], [136, 342], [132, 452]], [[120, 452], [124, 332], [166, 322], [168, 210]]],
    [[[180, 208], [182, 332], [188, 342], [192, 452]], [[204, 452], [200, 332], [174, 322], [172, 210]]],
]


def vessels_svg():
    s = ''
    for r, b in LOOPS:
        s += f'<polyline points="{" ".join(f"{x},{y}" for x, y in r)}" fill="none" stroke="{ART}" stroke-width="5" stroke-linejoin="round"/>'
        s += f'<polyline points="{" ".join(f"{x},{y}" for x, y in b)}" fill="none" stroke="{VEN}" stroke-width="5" stroke-linejoin="round"/>'
        e, f = r[-1], b[0]
        s += f'<path d="M{e[0]} {e[1]} Q{(e[0] + f[0]) / 2} {max(e[1], f[1]) + 12} {f[0]} {f[1]}" fill="none" stroke="#9b59b6" stroke-width="3"/>'
    return s


DIGEST = ['liver', 'gall', 'stomach', 'pancreas', 'large', 'small', 'eso', 'mouth', 'anus']
RESP = ['lungL', 'lungR', 'trachea', 'bronchi', 'nose']
EXCR = ['kidL', 'kidR', 'ureter', 'bladder']


def body(parts=(), h=5.2, face=True, vessels=False, extra=''):
    s = body_base(face=face)
    if vessels:
        s += vessels_svg()
    for k in parts:
        s += ORG[k]
    s += extra
    return vb_svg(s, (-10, 0, 340, 470), h)


def organ_only(parts, vb, h):
    return vb_svg(''.join(ORG[k] for k in parts), vb, h)


# 뼈(앱 u4-1 사람 뼈 그림) — 밝은 뼈를 진한 테두리로 감싸 보이게
def _bone_path(d, w):
    return (f'<path d="{d}" fill="none" stroke="{BONE_S}" stroke-width="{w + 3}"/>'
            f'<path d="{d}" fill="none" stroke="{BONE}" stroke-width="{w}"/>')


BONES = {
    'skull': (f'<path d="M124 58 Q122 16 160 14 Q198 16 196 58 Q196 76 186 82 L184 98 Q160 108 136 98 L134 82 Q124 76 124 58Z" fill="{BONE}" stroke="{BONE_S}" stroke-width="2.5"/>'
              '<ellipse cx="146" cy="56" rx="10" ry="11" fill="#9a907c"/><ellipse cx="174" cy="56" rx="10" ry="11" fill="#9a907c"/>'
              f'<path d="M156 74 L160 66 L164 74Z" fill="#9a907c"/><path d="M144 92 h32" stroke="{BONE_S}" stroke-width="2"/>'),
    'neck': ''.join(f'<rect x="152" y="{104 + i * 8}" width="16" height="7" rx="2" fill="{BONE}" stroke="{BONE_S}" stroke-width="2"/>' for i in range(4)),
    'spine': ''.join(f'<rect x="153" y="{138 + i * 10}" width="14" height="8" rx="2" fill="{BONE}" stroke="{BONE_S}" stroke-width="2"/>' for i in range(17)),
    'rib': ''.join(_bone_path(f'M150 {150 + i * 14} Q{150 - (40 + min(i, 3) * 5)} {144 + i * 14} {154 - (40 + min(i, 3) * 5)} {172 + i * 14}', 5)
                   + _bone_path(f'M170 {150 + i * 14} Q{170 + (40 + min(i, 3) * 5)} {144 + i * 14} {166 + (40 + min(i, 3) * 5)} {172 + i * 14}', 5)
                   for i in range(6)) + _bone_path('M110 140 L150 142', 5) + _bone_path('M210 140 L170 142', 5),
    'hip': f'<path d="M118 300 Q160 286 202 300 Q206 330 178 338 L160 326 L142 338 Q114 330 118 300Z" fill="{BONE}" stroke="{BONE_S}" stroke-width="2"/>',
    'arm': ''.join(_bone_path(d, 8) for d in ('M104 142 L86 222', 'M84 228 L70 300', 'M90 228 L78 302', 'M216 142 L234 222',
                                               'M236 228 L250 300', 'M230 228 L242 302'))
           + f'<circle cx="72" cy="314" r="10" fill="{BONE}" stroke="{BONE_S}" stroke-width="2"/><circle cx="248" cy="314" r="10" fill="{BONE}" stroke="{BONE_S}" stroke-width="2"/>',
    'leg': ''.join(_bone_path(d, 10) for d in ('M138 334 L132 396', 'M128 404 L126 456', 'M136 404 L136 456', 'M182 334 L188 396',
                                                'M192 404 L194 456', 'M184 404 L184 456')),
}
BONE_LABELS = {  # 이름표 자리(앱 lab의 선 시작점)
    'skull': (126, 40), 'neck': (152, 118), 'rib': (214, 170), 'spine': (166, 250), 'arm': (80, 260), 'leg': (190, 420),
}


def skeleton(h=5.2, order=('hip', 'leg', 'arm', 'rib', 'spine', 'neck', 'skull')):
    """뼈 그림 — 부분마다 따로 꺼낼 수 있게 sk.part[이름]"""
    grp = VGroup()
    frame = vb_svg('', (-10, 0, 340, 470), h)
    grp.add(frame)
    grp.vb = frame.vb
    grp.part = {}
    for k in order:
        m = vb_svg(BONES[k], (-10, 0, 340, 470), h)
        grp.part[k] = m
        grp.add(m)
    return grp


def skel_pt(sk, x, y):
    return vpt(sk[0], x, y)


def muscles(h=5.2):
    """근육 그림(앱 u4-1: 빨간 부분이 근육) — 몸 바탕 위에"""
    m = ('<g fill="#d9604c" stroke="#9c3324" stroke-width="1.5" opacity=".92">'
         '<path d="M98 140 Q160 128 222 140 Q214 176 160 182 Q106 176 98 140Z"/>'
         '<path d="M110 190 Q160 186 210 190 L204 312 Q160 320 116 312Z" fill-opacity=".75"/>'
         '<ellipse cx="80" cy="190" rx="14" ry="40" transform="rotate(10 80 190)"/><ellipse cx="240" cy="190" rx="14" ry="40" transform="rotate(-10 240 190)"/>'
         '<ellipse cx="70" cy="262" rx="11" ry="34" transform="rotate(10 70 262)"/><ellipse cx="250" cy="262" rx="11" ry="34" transform="rotate(-10 250 262)"/>'
         '<ellipse cx="132" cy="386" rx="17" ry="44"/><ellipse cx="188" cy="386" rx="17" ry="44"/></g>'
         f'<g fill="none" stroke="{BONE}" stroke-width="5"><path d="M86 160 L70 290"/><path d="M234 160 L250 290"/>'
         '<path d="M130 340 L128 450"/><path d="M190 340 L192 450"/></g>')
    return body(h=h, extra=m)


# ══════════════ 이름표 ══════════════
def label(text, col=NAVY, size=28, fill=PAPER, txt=None):
    t = T(text, size, txt or col)
    r = RoundedRectangle(corner_radius=0.1, width=t.width + 0.3, height=t.height + 0.22, fill_color=fill,
                         fill_opacity=1, stroke_color=col, stroke_width=3)
    t.move_to(r)
    return VGroup(r, t)


def pointer(target, at, text, col=NAVY, size=28):
    """target(화면 점)에서 at(화면 점)까지 선을 긋고 그 끝에 이름표 — 선을 먼저, 이름표를 위에"""
    lab = label(text, col, size)
    side = 1 if at[0] >= target[0] else -1
    lab.move_to(np.array(at) + RIGHT * side * lab.width / 2)
    ln = Line(target, at, stroke_color=col, stroke_width=3)
    dot = Dot(target, radius=0.05, color=col)
    return VGroup(ln, dot, lab)


# ══════════════ 뼈와 근육 모형(앱 armDraw) ══════════════
def capsule(a, b, w, col, stroke=None):
    a, b = np.array(a, dtype=float), np.array(b, dtype=float)
    L_ = np.linalg.norm(b - a)
    r = RoundedRectangle(corner_radius=w / 2 * 0.98, width=L_ + w, height=w, fill_color=col, fill_opacity=1,
                         stroke_color=stroke or col, stroke_width=2 if stroke else 0)
    r.rotate(np.arctan2(b[1] - a[1], b[0] - a[0])).move_to((a + b) / 2)
    return r


def arm_model(phi=20, skin=False, lbl=True, h=4.4, part=None):
    """phi: 아래팔뼈가 아래 방향에서 돌아간 각도(20 = 편 팔, 130 = 구부린 팔). 앱 좌표 520×380, 가운데 맞춤."""
    k = h / 380.0

    def P0(x, y):
        return np.array([(x - 260) * k, (190 - y) * k, 0.0])
    P = P0
    AE = (300, 200)
    AL = 150
    r = np.radians(phi)
    u = (-np.sin(r), np.cos(r))
    n = (-np.cos(r), -np.sin(r))

    def Q(b, k1, k2):
        return (b[0] + k1 * u[0] + k2 * n[0], b[1] + k1 * u[1] + k2 * n[1])
    tip = Q(AE, AL, 0)
    A = (276, 50)
    Bp = Q(AE, 50, 16)
    C_ = (324, 50)
    D = Q(AE, -22, -24)
    vis = (lambda kk: part is None or part >= kk)
    g = VGroup()
    g.add(Rectangle(width=520 * k, height=380 * k, stroke_width=0, fill_opacity=0).move_to(ORIGIN))
    if skin:
        g.add(capsule(P(300, 10), P(*AE), 100 * k, SKIN), capsule(P(*AE), P(*tip), 92 * k, SKIN))
        g.add(Circle(radius=40 * k, fill_color=SKIN, fill_opacity=1, stroke_color=SKL, stroke_width=2).move_to(P(*Q(AE, AL + 20, 0))))

    def bone(p1, q):
        a, b_ = P(*p1), P(*q)
        return VGroup(Line(a, b_, stroke_color="#a89a78", stroke_width=30 * k * 100),
                      Line(a, b_, stroke_color="#f7f0dc", stroke_width=24 * k * 100),
                      Circle(radius=15 * k, fill_color="#f7f0dc", fill_opacity=1, stroke_color="#a89a78", stroke_width=3 * k * 100).move_to(a),
                      Circle(radius=15 * k, fill_color="#f7f0dc", fill_opacity=1, stroke_color="#a89a78", stroke_width=3 * k * 100).move_to(b_))

    def band(p1, q, col, stk):
        L_ = np.hypot(q[0] - p1[0], q[1] - p1[1])
        ry = min(30, 3000 / L_)
        e = Ellipse(width=(L_ + 16) * k, height=2 * ry * k, fill_color=col, fill_opacity=0.93, stroke_color=stk,
                    stroke_width=2.5 * k * 100)
        ang = np.arctan2(-(q[1] - p1[1]), q[0] - p1[0])
        e.rotate(ang).move_to((P(*p1) + P(*q)) / 2)
        return e
    if vis(1):
        g.add(bone((300, 40), AE), bone(AE, tip))
    g.bones = VGroup(*g[1:])
    outer = band(D, C_, MUS2, MUS2_D) if vis(4) else VGroup()
    inner = band(A, Bp, MUS, MUS_D) if vis(2) else VGroup()
    g.add(outer, inner)
    g.inner, g.outer = inner, outer
    if not skin and vis(2):
        H = Q(AE, 50, 26)
        hd = RoundedRectangle(corner_radius=6 * k, width=80 * k, height=24 * k, fill_color="#ffd166", fill_opacity=1,
                              stroke_color="#a8842e", stroke_width=2)
        hd.move_to(P(H[0] - 38, H[1]))
        g.add(hd)
        g.handle = hd
    if not skin:
        for p_, kk in ((AE, 1), (A, 3), (Bp, 2), (C_, 4), (D, 4)):
            if vis(kk):
                g.add(Circle(radius=7 * k, fill_color="#7d8a95", fill_opacity=1, stroke_color=PAPER, stroke_width=2).move_to(P(*p_)))
    g.pts = dict(AE=AE, tip=tip, A=A, Bp=Bp, C=C_, D=D)
    g.P = lambda x, y: P0(x, y) + g[0].get_center()
    return g


def arm_labels(g, skin=False, size=26):
    """근육·뼈 이름표(그림 바깥으로 끌어낸 선 + 이름표)"""
    P = g.P
    pts = g.pts
    mi = (np.array(pts['A']) + np.array(pts['Bp'])) / 2
    mo = (np.array(pts['C']) + np.array(pts['D'])) / 2
    a_in = P(*mi)
    a_out = P(*mo)
    inn = "팔 안쪽 근육" if skin else "안쪽 근육"
    out = "팔 바깥쪽 근육" if skin else "바깥쪽 근육"
    grp = VGroup(pointer(a_in, a_in + LEFT * 1.3 + UP * 0.2, inn, MUS_D, size),
                 pointer(a_out, a_out + RIGHT * 1.0 + UP * 0.6, out, MUS2_D, size))
    return grp


# ══════════════ 의자에 앉기·서기(앱 u4-1 다리) ══════════════
def leg_model(p=0.0, h=4.2):
    """p: 0 서 있음 → 1 앉음. 사람은 왼쪽을 봄. 앱 좌표 420×390(y −60~330)."""
    k = h / 390.0

    def P(x, y):
        return np.array([(x - 210) * k, (135 - y) * k, 0.0])

    def lerp(a, b):
        return a + (b - a) * p
    H = (lerp(232, 262), lerp(118, 198))
    K = (lerp(232, 162), lerp(214, 198))
    A = (lerp(232, 162), lerp(306, 302))
    d = np.array([K[0] - H[0], K[1] - H[1]])
    d = d / np.linalg.norm(d)
    n = np.array([-d[1], d[0]])
    g = VGroup()
    g.add(Rectangle(width=420 * k, height=390 * k, stroke_width=0, fill_opacity=0).move_to(ORIGIN))
    g.add(Rectangle(width=420 * k, height=24 * k, fill_color="#e6d3ad", fill_opacity=1, stroke_width=0).move_to(P(210, 318)))
    for x, y, w, hh in ((232, 214, 110, 12), (236, 226, 10, 80), (330, 226, 10, 80), (330, 104, 10, 112)):
        g.add(Rectangle(width=w * k, height=hh * k, fill_color="#a9733f", fill_opacity=1, stroke_width=0).move_to(P(x + w / 2, y + hh / 2)))
    g.add(capsule(P(*H), P(H[0] + 4, H[1] - 100), 58 * k, "#7fb3d5"))
    g.add(Circle(radius=26 * k, fill_color=SKIN, fill_opacity=1, stroke_color=SKL, stroke_width=2).move_to(P(H[0] + 2, H[1] - 148)))
    g.add(capsule(P(*H), P(*K), 54 * k, SKIN), capsule(P(*K), P(*A), 50 * k, SKIN))
    g.add(capsule(P(*A), P(A[0] - 44, A[1]), 18 * k, "#4a4a4a"))
    g.add(capsule(P(*H), P(*K), 10 * k, "#f7f0dc"), capsule(P(*K), P(*A), 9 * k, "#f7f0dc"))

    def seg(o, w, c):
        a = np.array(H) + d * 14 + n * o
        b_ = np.array(K) - d * 14 + n * o
        return capsule(P(*a), P(*b_), w * k, c)
    wF = 9 + 9 * (1 - p)
    wB = 9 + 9 * p
    front = seg(16, wF, MUS)
    back = seg(-16, wB, MUS2)
    g.add(front, back)
    g.front, g.back = front, back
    m = (np.array(H) + np.array(K)) / 2
    fa, ba = P(*(m + n * 16)), P(*(m - n * 16))
    g.front_at = lambda: fa + g[0].get_center()
    g.back_at = lambda: ba + g[0].get_center()
    return g


# ══════════════ 도입: 기린 뼈(앱 u4-1) ══════════════
def giraffe(h=3.6):
    B, S = BONE, BONE_S
    s = '<rect width="760" height="400" rx="20" fill="#2f3e46"/><rect y="350" width="760" height="50" fill="#3d4f58"/><rect x="250" y="340" width="300" height="14" fill="#6b7d86"/>'
    s += f'<g fill="{B}" stroke="{S}" stroke-width="2">'
    for i in range(7):
        x, y = 470 + i * 20, 150 - i * 18
        s += f'<rect x="{x - 9}" y="{y - 8}" width="20" height="16" rx="5" transform="rotate(-40 {x} {y})"/>'
    s += '</g>'
    s += f'<path d="M596 26 Q640 14 690 40 Q694 52 680 56 Q640 56 606 52 Q586 44 596 26Z" fill="{B}" stroke="{S}" stroke-width="2"/><circle cx="626" cy="36" r="6" fill="#2f3e46"/><path d="M606 22 l-4 -14 M616 20 l0 -14" stroke="{S}" stroke-width="5"/>'
    s += f'<path d="M300 170 Q380 140 470 160" fill="none" stroke="{S}" stroke-width="3"/><g fill="{B}" stroke="{S}" stroke-width="2">'
    s += ''.join(f'<rect x="{300 + i * 21}" y="{164 - (i * 4 if i < 5 else 16)}" width="18" height="14" rx="4"/>' for i in range(8)) + '</g>'
    s += f'<g fill="none" stroke="{B}" stroke-width="5">' + ''.join(f'<path d="M{330 + i * 20} {160 - i * 3} q-6 40 6 70"/>' for i in range(6)) + '</g>'
    s += f'<path d="M276 170 Q300 150 330 172 Q320 196 286 196Z" fill="{B}" stroke="{S}" stroke-width="2"/>'
    s += f'<g fill="{B}" stroke="{S}" stroke-width="1.5">' + ''.join(f'<circle cx="{270 - i * 10}" cy="{180 + i * 14}" r="{5 - i * .5}"/>' for i in range(6)) + '</g>'
    s += f'<g stroke="{B}" stroke-width="9" fill="none"><path d="M298 196 L292 270 L296 346"/><path d="M318 196 L322 270 L316 346"/><path d="M450 190 L446 270 L452 346"/><path d="M470 188 L476 270 L470 346"/></g>'
    s += f'<g fill="{B}">' + ''.join(f'<circle cx="{x}" cy="{y}" r="7"/>' for x, y in ((292, 270), (322, 270), (446, 270), (476, 270))) + '</g>'
    return vb_svg(s, (0, 0, 760, 400), h)


GIR_RING = {'neck': (530, 100, 180, 140), 'leg': (385, 272, 230, 165), 'tail': (248, 216, 68, 104), 'head': (642, 38, 124, 60)}


# ══════════════ 순환기관 모형실험(앱 u4-3 펌프) ══════════════
PUMP_PATH = [(230, 312), (230, 110), (300, 110), (440, 110), (530, 110), (530, 196)]


def pump_rig(sq=0.0, h=3.9, pump=True):
    """수조(붉은 색소 물) + 물에 잠긴 호스(왼쪽) + 펌프 + 물에 잠기지 않은 호스(오른쪽). sq: 쥔 정도(0~1)"""
    ry = 26 - 12 * sq
    s = '<rect y="336" width="760" height="24" fill="#d9c49a"/>'
    s += '<path d="M150 186 V330 H610 V186" fill="#e8f7ff" stroke="#8fb5c9" stroke-width="5"/><rect x="153" y="226" width="454" height="102" fill="#e2573f" fill-opacity=".6"/>'
    s += '<polyline points="230,312 230,110 300,110" fill="none" stroke="#b9d7e6" stroke-width="16" stroke-linejoin="round"/>'
    s += '<polyline points="440,110 530,110 530,196" fill="none" stroke="#b9d7e6" stroke-width="16" stroke-linejoin="round"/>'
    if pump:
        s += f'<ellipse cx="370" cy="110" rx="76" ry="{ry}" fill="#3a3f45" stroke="#20242a" stroke-width="3"/><path d="M340 110 h52 m-12 -10 l12 10 l-12 10" stroke="#fff" stroke-width="4" fill="none"/>'
    if pump and sq > 0.05:
        s += f'<path d="M330 {110 - ry - 6} q40 -30 80 0" fill="{SKIN}" stroke="{SKL}" stroke-width="3"/>'
    return vb_svg(s, (60, 40, 640, 320), h)


# ══════════════ 호흡기관 모형(종이봉투 + 주름 빨대) ══════════════
def bag_model(p=0.0, s=1.0, stickers=True):
    """가운데 (0,0). p: 0 납작 → 1 부풂. 빨대 긴 쪽 두 개를 감아 한 줄(숨관), 짧은 쪽이 봉투 안(숨관가지)."""
    g = VGroup()
    straw = "#f6f1e4"
    st_s = "#b9ab8f"
    top = np.array([0, 2.0, 0])
    joint = np.array([0, 0.75, 0])
    for sx in (-1, 1):
        bx = sx * 1.25
        w = 1.25 + 0.55 * p
        hh = 1.9 + 0.35 * p
        bag = RoundedRectangle(corner_radius=0.18 + 0.35 * p, width=w, height=hh, fill_color="#d9b98a", fill_opacity=1,
                               stroke_color="#8e6d3e", stroke_width=4).move_to([bx, -0.75, 0])
        folds = VGroup(*[Line([bx - w / 2 + 0.12, -0.75 + hh / 2 - 0.25 - j * 0.3, 0], [bx + w / 2 - 0.12, -0.75 + hh / 2 - 0.25 - j * 0.3, 0],
                              stroke_color="#b8955f", stroke_width=2, stroke_opacity=1 - p) for j in range(4)])
        g.add(bag, folds)
        if stickers:
            lung = Ellipse(width=w * 0.7, height=hh * 0.72, fill_color="#f3a9b2", fill_opacity=0.9, stroke_color="#b25c68",
                           stroke_width=3).move_to([bx, -0.8, 0])
            g.add(lung)
        br = VMobject(stroke_color=st_s, stroke_width=16)
        br.set_points_as_corners([joint, [sx * 0.45, 0.45, 0], [bx, 0.05, 0], [bx, -0.35, 0]])
        br2 = br.copy().set_stroke(straw, 10)
        g.add(br, br2)
        if stickers:
            brs = br.copy().set_stroke("#3f84ad", 5)
            g.add(brs)
    tr = Line(top, joint, stroke_color=st_s, stroke_width=18)
    tr2 = Line(top, joint, stroke_color=straw, stroke_width=12)
    tape = Rectangle(width=0.36, height=0.5, fill_color="#e8f4fb", fill_opacity=0.85, stroke_color="#9cc3d8", stroke_width=2).move_to(joint + UP * 0.25)
    g.add(tr, tr2, tape)
    if stickers:
        g.add(Line(top + DOWN * 0.1, joint + UP * 0.55, stroke_color="#5f9cc0", stroke_width=6))
    g.scale(s)
    g.top = top * s
    return g


# ══════════════ 배설 경로(앱 u4-5) ══════════════
K_ART = [(470, 20), (470, 120), (290, 120), (250, 152)]
K_VEN = [(248, 192), (290, 200), (520, 200), (520, 20)]
K_URE = [(262, 236), (300, 300), (322, 316)]


def kidney_flow(h=4.4, lv=0.0):
    s = f'<polyline points="470,20 470,120 290,120 250,152" fill="none" stroke="{ART}" stroke-width="16" stroke-linejoin="round"/>'
    s += f'<polyline points="248,192 290,200 520,200 520,20" fill="none" stroke="{VEN}" stroke-width="16" stroke-linejoin="round"/>'
    s += '<path d="M200 70 Q110 74 112 170 Q116 270 206 262 Q262 254 254 210 Q240 176 262 150 Q280 70 200 70Z" fill="#9b3c3c" stroke="#5e1f1f" stroke-width="4"/>'
    s += '<polyline points="262,236 300,300 322,316" fill="none" stroke="#e0b84e" stroke-width="10"/>'
    s += '<ellipse cx="350" cy="326" rx="44" ry="32" fill="#fff" stroke="#a8842e" stroke-width="3"/>'
    return vb_svg(s, (90, 0, 480, 370), h)


def bladder_fill(mob, lv):
    """방광 속 오줌(lv 0~1) — 타원 안을 아래부터 채움"""
    c = vpt(mob, 350, 326)
    rx = np.linalg.norm(vpt(mob, 392, 326) - c)
    ry = np.linalg.norm(vpt(mob, 350, 356) - c)
    if lv <= 0.01:
        return VGroup()
    ys = np.linspace(-1, -1 + 2 * lv, 30)
    pts = [[c[0] + rx * np.sqrt(max(0, 1 - y * y)), c[1] + ry * y, 0] for y in ys]
    pts += [[c[0] - rx * np.sqrt(max(0, 1 - y * y)), c[1] + ry * y, 0] for y in ys[::-1]]
    return Polygon(*pts, fill_color="#f1cf62", fill_opacity=1, stroke_width=0)


# ══════════════ 여러 기관이 함께 일해요(앱 u4-6) ══════════════
MAP_BOX = {'bone': (120, 80, '뼈와 근육', '#8a5a2b'), 'resp': (580, 80, '호흡기관', '#3f84ad'),
           'circ': (350, 210, '순환기관', '#c2332c'), 'dig': (120, 340, '소화기관', '#b5654f'),
           'exc': (580, 340, '배설기관', '#a8842e')}
MAP_ARR = [((500, 138), (446, 178), '산소', '#3f84ad', (512, 182)),
           ((430, 158), (488, 114), '이산화 탄소', '#48646f', (404, 108)),
           ((204, 296), (256, 252), '영양소', '#b5654f', (190, 256)),
           ((266, 170), (212, 126), '산소·영양소', '#c2332c', (184, 190)),
           ((440, 244), (494, 288), '노폐물', '#a8842e', (506, 250))]


def organ_icon(kind, h=1.2):
    if kind == 'bone':
        a = arm_model(70, h=3.0)
        g = VGroup(*a[1:])
        return fit(g, h * 1.4, h)
    if kind == 'resp':
        return organ_only(['lungL', 'lungR', 'trachea', 'bronchi'], (96, 88, 128, 140), h)
    if kind == 'circ':
        return organ_only(['heart'], (146, 144, 58, 74), h)
    if kind == 'dig':
        return organ_only(['stomach', 'large', 'small'], (110, 172, 128, 156), h)
    if kind == 'exc':
        return organ_only(['kidL', 'kidR', 'ureter', 'bladder'], (100, 218, 120, 126), h)


def organ_map(w=10.0):
    """앱 좌표 700×420 → 화면 가로 w, 가운데 (0,0). 상자 g.box[키], 화살표 g.arr[i]"""
    k = w / 700.0

    def P(x, y):
        return np.array([(x - 350) * k, (210 - y) * k, 0.0])
    g = VGroup()
    g.box = {}
    for key, (x, y, t, col) in MAP_BOX.items():
        bx = RoundedRectangle(corner_radius=16 * k, width=180 * k, height=124 * k, fill_color=PAPER, fill_opacity=1,
                              stroke_color=col, stroke_width=5).move_to(P(x, y))
        tt = T(t, 30, col).move_to(P(x, y + 44))
        ic = organ_icon(key, 70 * k)
        ic.move_to(P(x, y - 14))
        bb = VGroup(bx, ic, tt)
        g.box[key] = bb
        g.add(bb)
    g.arr = []
    for a, b, t, col, tp in MAP_ARR:
        ar = Arrow(P(*a), P(*b), buff=0, color=col, stroke_width=7, max_tip_length_to_length_ratio=0.35)
        tt = T(t, 26, col).move_to(P(*tp))
        grp = VGroup(ar, tt)
        g.arr.append(grp)
        g.add(grp)
    g.P = P
    return g


# ══════════════ 작은 그림들 ══════════════
def bean(kind="kidney", s=1.0):
    """강낭콩(붉은 무늬) · 팥(작고 탁한 붉은색)"""
    if kind == "kidney":
        m = vb_svg('<path d="M200 70 Q110 74 112 170 Q116 270 206 262 Q262 254 254 210 Q240 176 262 150 Q280 70 200 70Z" fill="#B5543E" stroke="#6E2A20" stroke-width="5"/>'
                   '<ellipse cx="160" cy="130" rx="22" ry="10" fill="#E8C7B4" fill-opacity=".8" transform="rotate(-30 160 130)"/>'
                   '<ellipse cx="180" cy="215" rx="20" ry="9" fill="#E8C7B4" fill-opacity=".8" transform="rotate(20 180 215)"/>'
                   '<ellipse cx="215" cy="100" rx="16" ry="7" fill="#E8C7B4" fill-opacity=".8"/>',
                   (105, 65, 165, 205), 1.0)
        return m.rotate(-1.35).scale(s)
    g = VGroup(*[Ellipse(width=0.42, height=0.32, fill_color="#7A2630", fill_opacity=1, stroke_color="#4A1418", stroke_width=3)
                 .move_to([dx, dy, 0]) for dx, dy in ((-0.25, 0), (0.22, 0.05), (0, -0.28))])
    for e in list(g):
        g.add(Line(e.get_center() + LEFT * 0.1, e.get_center() + LEFT * 0.02, stroke_color=PAPER, stroke_width=3))
    return g.scale(s)


def kidney_pic(s=1.0):
    """콩팥 한 개(앱 u4-5 그림 모양)"""
    return vb_svg('<path d="M200 70 Q110 74 112 170 Q116 270 206 262 Q262 254 254 210 Q240 176 262 150 Q280 70 200 70Z" fill="#9b3c3c" stroke="#5e1f1f" stroke-width="4"/>',
                  (105, 65, 165, 205), 1.6 * s)


def aed(s=1.0):
    """자동 심장 충격기 표시(하트 + 번개)"""
    box = RoundedRectangle(corner_radius=0.25, width=2.4, height=2.0, fill_color="#2E9E5B", fill_opacity=1, stroke_color="#1D6B3C", stroke_width=5)
    hpts = []
    for t in np.linspace(0, TAU, 60):
        x = 16 * np.sin(t) ** 3
        y = 13 * np.cos(t) - 5 * np.cos(2 * t) - 2 * np.cos(3 * t) - np.cos(4 * t)
        hpts.append([x * 0.045, y * 0.045, 0])
    heart = Polygon(*hpts, fill_color="#E23B32", fill_opacity=1, stroke_color=PAPER, stroke_width=4)
    bolt = Polygon([0.08, 0.5, 0], [-0.2, 0.0, 0], [0.02, 0.0, 0], [-0.1, -0.5, 0], [0.22, 0.08, 0], [0.0, 0.08, 0],
                   fill_color=PAPER, fill_opacity=1, stroke_width=0).move_to(heart.get_center() + DOWN * 0.03)
    return VGroup(box, heart.move_to(box), bolt).scale(s)


def kid(state="before", s=1.0, shirt="#7FB3D5"):
    """달리기 전·후의 친구(앞모습 얼굴 + 몸). after: 빨간 볼, 땀방울, 가쁜 숨"""
    g = VGroup()
    g.add(RoundedRectangle(corner_radius=0.3, width=1.5, height=1.5, fill_color=shirt, fill_opacity=1, stroke_width=0).move_to([0, -1.25, 0]))
    head = Circle(radius=0.78, fill_color=SKIN, fill_opacity=1, stroke_color=SKL, stroke_width=4)
    hair = VMobject(fill_color="#5a4334", fill_opacity=1, stroke_width=0)
    hair.set_points_smoothly([np.array(p) for p in ([-0.78, 0.05, 0], [-0.7, 0.55, 0], [0, 0.82, 0], [0.7, 0.55, 0], [0.78, 0.05, 0],
                                                    [0.4, 0.42, 0], [0, 0.48, 0], [-0.4, 0.42, 0], [-0.78, 0.05, 0])])
    g.add(head, hair)
    g.add(Dot([-0.27, -0.05, 0], radius=0.07, color="#4a3a30"), Dot([0.27, -0.05, 0], radius=0.07, color="#4a3a30"))
    g.cheeks = VGroup()
    g.sweat = VGroup()
    g.breath = VGroup()
    if state == "before":
        g.add(Arc(radius=0.22, start_angle=-PI * 0.85, angle=PI * 0.7, stroke_color="#b5654f", stroke_width=5).move_to([0, -0.38, 0]))
    else:
        g.add(Ellipse(width=0.3, height=0.24, fill_color="#8E2F2F", fill_opacity=1, stroke_width=0).move_to([0, -0.4, 0]))
        g.cheeks = VGroup(*[Ellipse(width=0.36, height=0.22, fill_color="#F07070", fill_opacity=0.75, stroke_width=0).move_to([sx * 0.45, -0.25, 0]) for sx in (-1, 1)])
        drops = []
        for x, y in ((0.85, 0.45), (-0.88, 0.3), (0.95, -0.05)):
            d = VMobject(fill_color="#8CC9EE", fill_opacity=1, stroke_color=BLUE, stroke_width=2)
            d.set_points_smoothly([np.array(p) for p in ([x, y + 0.2, 0], [x + 0.09, y, 0], [x, y - 0.08, 0], [x - 0.09, y, 0], [x, y + 0.2, 0])])
            drops.append(d)
        g.sweat = VGroup(*drops)
        g.breath = VGroup(*[Arc(radius=0.12 + 0.1 * j, start_angle=-0.7, angle=1.4, stroke_color=SOFT, stroke_width=4).move_to([0.45 + 0.17 * j, -0.65, 0]) for j in range(3)])
        g.add(g.cheeks, g.sweat, g.breath)
    return g.scale(s)


def lightning_arrow(a, b, col=ORANGE, sw=7):
    return Arrow(a, b, buff=0, color=col, stroke_width=sw, max_tip_length_to_length_ratio=0.25)


def food_bits(n, size, seed=1, col="#C98B4E", w=1.0, h=0.6):
    rng = np.random.default_rng(seed)
    g = VGroup()
    for i in range(n):
        x, y = rng.uniform(-w / 2, w / 2), rng.uniform(-h / 2, h / 2)
        g.add(Circle(radius=size * rng.uniform(0.75, 1.1), fill_color=col, fill_opacity=1, stroke_color="#8A5A2B",
                     stroke_width=2).move_to([x, y, 0]))
    return g


def pump_bulb(rig, sq=0.0):
    """펌프(검은 고무 주머니) — 쥐면 납작해지고 손이 위에 얹힘. rig 위의 자리에 맞춤"""
    c = vpt(rig, 370, 110)
    k = np.linalg.norm(vpt(rig, 471, 110) - vpt(rig, 371, 110)) / 100
    ry = 26 - 12 * sq
    g = VGroup(Ellipse(width=152 * k, height=2 * ry * k, fill_color="#3a3f45", fill_opacity=1, stroke_color="#20242a",
                       stroke_width=3).move_to(c),
               Arrow(c + LEFT * 30 * k, c + RIGHT * 24 * k, buff=0, color=PAPER, stroke_width=4,
                     max_tip_length_to_length_ratio=0.3))
    if sq > 0.05:
        hand = Ellipse(width=90 * k, height=34 * k, fill_color=SKIN, fill_opacity=1, stroke_color=SKL, stroke_width=3)
        hand.move_to(c + UP * (ry + 12) * k)
        g.add(hand)
    return g


PUMP_L = None


def pump_len():
    P = PUMP_PATH
    cum = [0.0]
    for i in range(1, len(P)):
        cum.append(cum[-1] + np.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]))
    return cum


def pump_pt(rig, d):
    """호스 길(앱 길이 d)의 화면 점"""
    P = PUMP_PATH
    cum = pump_len()
    d = min(max(d, 0), cum[-1])
    for i in range(1, len(P)):
        if d <= cum[i] + 1e-9:
            q = (d - cum[i - 1]) / (cum[i] - cum[i - 1])
            return vpt(rig, P[i - 1][0] + (P[i][0] - P[i - 1][0]) * q, P[i - 1][1] + (P[i][1] - P[i - 1][1]) * q)
    return vpt(rig, *P[-1])
