"""나눗셈 차근차근 공통 부품

    DivScene                         # GRADE "D" · "나눗셈 차근차근 N화"
    deal(S, its, dishes)             # 구슬을 접시에 한 개씩 돌아가며
    slot(d, k)                       # 접시 d 위 k번째 자리
    term_eq(a, d, q, r=None)         # 12 ÷ 3 = 4 (… 1) 글자 묶음, .a .d .q .r
    term_labels(eq)                  # 나누어지는 수·나누는 수·몫(·나머지) 이름표
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Line, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T


class DivScene(EpisodeScene):
    GRADE, SEM = "D", 1
    LABEL = "나눗셈 차근차근 {}화"


def slot(d, k, cols=2, step=0.5):
    c = d.plate.get_center() + UP * 0.55
    r, q = divmod(k, cols)
    return c + np.array([(q - (cols - 1) / 2) * step, r * step, 0])


def deal(S, its, dishes, quick=False, cols=2):
    d = len(dishes)
    for i, m in enumerate(its):
        S.play(m.animate.move_to(slot(dishes[i % d], i // d, cols)), run_time=0.18 if quick else 0.3)


def term_eq(a, d, q, r=None, size=96):
    parts = [T(str(a), size, BLUE), T("÷", size, INK), T(str(d), size, ORANGE), T("=", size, INK), T(str(q), size, GREEN)]
    if r is not None:
        parts += [T("…", size, INK), T(str(r), size, "#B05FD0")]
    g = VGroup(*parts).arrange(RIGHT, buff=size / 260)
    g.a, g.d, g.q = parts[0], parts[2], parts[4]
    g.r = parts[6] if r is not None else None
    return g


def term_labels(eq, size=34):
    labs = VGroup()
    pairs = [(eq.a, "나누어지는 수", BLUE, DOWN), (eq.d, "나누는 수", ORANGE, UP), (eq.q, "몫", GREEN, DOWN)]
    if eq.r is not None:
        pairs.append((eq.r, "나머지", "#B05FD0", UP))
    for obj, name, col, side in pairs:
        t = T(name, size, col).next_to(obj, side, buff=0.45)
        ln = Line(obj.get_edge_center(side), t.get_edge_center(-side), color=col, stroke_width=3)
        labs.add(VGroup(ln, t))
    return labs
