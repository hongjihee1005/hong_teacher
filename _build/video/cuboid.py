"""직육면체(5학년 2학기 5단원) 부품 — 겨냥도(사선 투영), 면 칠하기

    cb = Cuboid(w, h, d, center)       # 가로 w, 높이 h, 깊이 d
    cb.edges(hidden_dashed=True)       # 보이는 모서리 실선, 안 보이는 모서리 점선
    cb.face("front"|"back"|"top"|"bottom"|"left"|"right", color, op)
    cb.v[i]                            # 꼭짓점 8개 (0~3 앞면 왼아래부터 반시계, 4~7 뒷면)
"""
import numpy as np
from manim import DashedLine, Line, Polygon, VGroup

from series_style import INK, SOFT

K, ANG = 0.5, np.radians(35)
FACES = {"front": (0, 1, 2, 3), "back": (4, 5, 6, 7), "bottom": (0, 1, 5, 4), "top": (3, 2, 6, 7),
         "left": (0, 3, 7, 4), "right": (1, 2, 6, 5)}
EDGES = [(0, 1), (1, 2), (2, 3), (3, 0), (4, 5), (5, 6), (6, 7), (7, 4), (0, 4), (1, 5), (2, 6), (3, 7)]
HIDDEN_V = 4   # 왼쪽 뒤 아래 꼭짓점이 보이지 않음


class Cuboid:
    def __init__(self, w, h, d, center=(0, 0, 0)):
        c = np.array(center, float)
        dx, dy = K * d * np.cos(ANG), K * d * np.sin(ANG)
        o = c - np.array([(w + dx) / 2, (h + dy) / 2, 0])
        base = [(0, 0), (w, 0), (w, h), (0, h)]
        self.v = [o + np.array([x, y, 0]) for x, y in base] + [o + np.array([x + dx, y + dy, 0]) for x, y in base]

    def edges(self, hidden_dashed=True, color=INK, width=5, show_hidden=True):
        g = VGroup()
        for i, j in EDGES:
            hid = HIDDEN_V in (i, j)
            if hid and not show_hidden:
                continue
            if hid and hidden_dashed:
                g.add(DashedLine(self.v[i], self.v[j], color=SOFT, stroke_width=width - 1, dash_length=0.12))
            else:
                g.add(Line(self.v[i], self.v[j], color=color, stroke_width=width))
        return g

    def hidden(self):
        return [(i, j) for i, j in EDGES if HIDDEN_V in (i, j)]

    def face(self, name, color, op=0.45):
        return Polygon(*[self.v[k] for k in FACES[name]], fill_color=color, fill_opacity=op, stroke_width=0)
