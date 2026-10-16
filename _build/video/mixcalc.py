"""혼합 계산(5학년 1학기 1단원) 부품 — 식을 놓고 계산 순서를 선으로 그어 보여 주기

    e = Expr(["42", "−", "(", "17", "+", "8", ")"], center=[0, 1.2, 0])
    S.play(FadeIn(e.g))
    for st in e.steps():          # 계산 순서대로: st.i, st.j(원래 글자 자리), st.val, st.text("17 + 8 = 25")
        S.play(*e.mark(st))        # 그 부분 아래에 ㄷ자 선과 ①·값
기호는 + − × ÷ ( ). 값은 분수(Fraction)로 정확히 계산.
"""
from fractions import Fraction

import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, Line, VGroup, VMobject

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, T

CIRC = "①②③④⑤⑥"
LVCOL = [ORANGE, BLUE, GREEN, "#7A4FB5", INK]


class Step:
    def __init__(self, i, j, val, text, k):
        self.i, self.j, self.val, self.text, self.k = i, j, val, text, k


def fmt(v):
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def op(a, o, b):
    return {"+": a + b, "−": a - b, "×": a * b, "÷": a / b}[o]


def solve(tokens):
    """계산 순서대로 Step 목록. 항목: [값, 시작, 끝, 글]"""
    items = []
    for i, t in enumerate(tokens):
        if t in "+−×÷()":
            items.append([t, i, i, t])
        else:
            items.append([Fraction(int(t)), i, i, t])
    steps = []

    def reduce_flat(seq):
        for ops in (("×", "÷"), ("+", "−")):
            k = 1
            while k < len(seq):
                if seq[k][0] in ops:
                    a, o, b = seq[k - 1], seq[k][0], seq[k + 1]
                    v = op(a[0], o, b[0])
                    steps.append(Step(a[1], b[2], v, f"{fmt(a[0])} {o} {fmt(b[0])} = {fmt(v)}", len(steps)))
                    seq[k - 1:k + 2] = [[v, a[1], b[2], fmt(v)]]
                else:
                    k += 2
        return seq

    while True:
        opens = [n for n, it in enumerate(items) if it[0] == "("]
        if not opens:
            break
        a = opens[-1]
        b = next(n for n in range(a, len(items)) if items[n][0] == ")")
        inner = reduce_flat(items[a + 1:b])
        v = inner[0]
        items[a:b + 1] = [[v[0], items[a][1], items[b][2], v[3]]]
    reduce_flat(items)
    return steps, items[0][0]


class Expr:
    def __init__(self, tokens, center=(0, 1.2, 0), F=64, gap=0.3, colors=None):
        self.tokens = tokens
        colors = colors or {}
        self.t = VGroup(*[T(s, F, colors.get(n, INK)) for n, s in enumerate(tokens)])
        for n in range(1, len(tokens)):
            tight = tokens[n - 1] == "(" or tokens[n] == ")"
            self.t[n].next_to(self.t[n - 1], RIGHT, buff=gap * 0.3 if tight else gap)
            self.t[n].set_y(self.t[0].get_y())
        self.t.move_to(center)
        self.g = self.t
        self._steps, self.value = solve(tokens)
        self.level = {}
        self.base = self.t.get_bottom()[1] - 0.12

    def steps(self):
        return self._steps

    def lv(self, st):
        inside = [self.level[s.k] for s in self._steps[:st.k] if s.i >= st.i and s.j <= st.j]
        return 1 + max(inside, default=0)

    def mark(self, st, dy=0.8, color=None, show_val=True, label=None):
        L = self.lv(st)
        self.level[st.k] = L
        c = color or LVCOL[(L - 1) % len(LVCOL)]
        x0 = self.t[st.i].get_left()[0] + 0.05
        x1 = self.t[st.j].get_right()[0] - 0.05
        y = self.base - dy * L + dy * 0.45
        top = self.base
        v = VMobject(color=c, stroke_width=5)
        v.set_points_as_corners([[x0, top, 0], [x0, y, 0], [x1, y, 0], [x1, top, 0]])
        txt = label if label is not None else (f"{CIRC[st.k]} {fmt(st.val)}" if show_val else CIRC[st.k])
        lab = T(txt, 36, c).move_to([(x0 + x1) / 2, y - 0.27, 0])
        self.last = VGroup(v, lab)
        return [Create(v), FadeIn(lab)]
