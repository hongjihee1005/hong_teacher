"""입체도형(6학년 각기둥·각뿔·쌓기나무 등) 부품 — 사선 투영 겨냥도, 보이는/안 보이는 모서리 자동 판단

    s = prism(regular(5, 1.2), 2.0, center=(0, 0, 0))   # 오각기둥 (밑면: x-z 평면, 높이: y)
    s = pyramid(regular(4, 1.3), 2.2, center=...)        # 사각뿔
    s.edges(hidden_dashed=True)   # 보이는 모서리 실선, 안 보이는 모서리 점선
    s.face(k, color, op)          # k번째 면 칠하기 (prism: 0 아래 밑면, 1 위 밑면, 2… 옆면 / pyramid: 0 밑면, 1… 옆면)
    s.p[i]                        # 꼭짓점 i의 화면 좌표
깊이 z는 화면 안쪽(오른쪽 위로 비스듬히)으로 들어갑니다. 면의 바깥 법선 n이 보는 방향 v = (−c, −s, 1)과 n·v < 0이면 보이는 면.
"""
import numpy as np
from manim import DashedLine, Line, Polygon, VGroup

from series_style import INK, SOFT

K, ANG = 0.5, np.radians(35)
C, S = K * np.cos(ANG), K * np.sin(ANG)
VIEW = np.array([-C, -S, 1.0])


def regular(n, r, rot=None):
    """x-z 평면의 정n각형 꼭짓점 (반시계, 위에서 볼 때)"""
    if rot is None:
        rot = -np.pi / 2 + (np.pi / n if n % 2 == 0 else 0) + 0.18
    return [(r * np.cos(rot + 2 * np.pi * k / n), r * np.sin(rot + 2 * np.pi * k / n)) for k in range(n)]


class Solid:
    def __init__(self, verts, faces, center=(0, 0, 0), scale=1.0):
        self.v3 = [np.array(v, float) * scale for v in verts]
        self.faces = faces
        pts = [self._proj(v) for v in self.v3]
        lo, hi = np.min(pts, axis=0), np.max(pts, axis=0)
        shift = np.array(center, float) - (lo + hi) / 2
        self.p = [q + shift for q in pts]
        cen = np.mean(self.v3, axis=0)
        self.vis = []
        for f in faces:
            a, b, c = (self.v3[f[0]], self.v3[f[1]], self.v3[f[2]])
            n = np.cross(b - a, c - a)
            fc = np.mean([self.v3[i] for i in f], axis=0)
            if np.dot(n, fc - cen) < 0:
                n = -n
            self.vis.append(np.dot(n, VIEW) < -1e-9)
        ed = {}
        for k, f in enumerate(faces):
            for i in range(len(f)):
                e = tuple(sorted((f[i], f[(i + 1) % len(f)])))
                ed.setdefault(e, []).append(k)
        self.edge_faces = ed

    @staticmethod
    def _proj(v):
        return np.array([v[0] + C * v[2], v[1] + S * v[2], 0.0])

    def edge_visible(self, e):
        return any(self.vis[k] for k in self.edge_faces[tuple(sorted(e))])

    def edges(self, hidden_dashed=True, color=INK, width=5, show_hidden=True, only=None):
        g = VGroup()
        for e in self.edge_faces:
            if only is not None and tuple(sorted(e)) not in {tuple(sorted(x)) for x in only}:
                continue
            if self.edge_visible(e):
                g.add(Line(self.p[e[0]], self.p[e[1]], color=color, stroke_width=width))
            elif show_hidden:
                if hidden_dashed:
                    g.add(DashedLine(self.p[e[0]], self.p[e[1]], color=SOFT, stroke_width=width - 1, dash_length=0.12))
                else:
                    g.add(Line(self.p[e[0]], self.p[e[1]], color=color, stroke_width=width))
        return g

    def edge_list(self):
        return list(self.edge_faces)

    def hidden_edges(self):
        return [e for e in self.edge_faces if not self.edge_visible(e)]

    def face(self, k, color, op=0.45):
        return Polygon(*[self.p[i] for i in self.faces[k]], fill_color=color, fill_opacity=op, stroke_width=0)

    def line(self, i, j, color=INK, width=5):
        return Line(self.p[i], self.p[j], color=color, stroke_width=width)


def prism(base, h, center=(0, 0, 0), scale=1.0):
    """base: x-z 평면 다각형 [(x, z), …] (반시계). 꼭짓점 0..n-1 아래 밑면, n..2n-1 위 밑면"""
    n = len(base)
    verts = [(x, 0, z) for x, z in base] + [(x, h, z) for x, z in base]
    faces = [list(range(n))[::-1], list(range(n, 2 * n))] + [[i, (i + 1) % n, n + (i + 1) % n, n + i] for i in range(n)]
    s = Solid(verts, faces, center, scale)
    s.n = n
    return s


def pyramid(base, h, center=(0, 0, 0), apex=None, scale=1.0):
    """꼭짓점 0..n-1 밑면, n 각뿔의 꼭짓점"""
    n = len(base)
    if apex is None:
        apex = tuple(np.mean(base, axis=0))
    verts = [(x, 0, z) for x, z in base] + [(apex[0], h, apex[1])]
    faces = [list(range(n))[::-1]] + [[i, (i + 1) % n, n] for i in range(n)]
    s = Solid(verts, faces, center, scale)
    s.n = n
    return s
