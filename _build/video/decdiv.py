"""소수가 있는 세로 나눗셈 부품 — 6학년 (소수) ÷ (자연수), (소수) ÷ (소수)

    d = DecDiv(S, "4.23", "3", x_left=-1.0, y0=1.9)
    d.show()                      # 3 )4.23 (나누어지는 수 칸마다 숫자, 소수점은 칸 사이)
    d.quot(0, "1")                # 몫 칸 0(나누어지는 수 첫째 자리 위)에 숫자
    d.qdot()                      # 몫의 소수점(나누어지는 수의 소수점 바로 위)
    d.row("3", 0, 1)              # 1단계 줄: 오른쪽 끝을 칸 0에 맞춤 (중간 줄은 소수점 없이 씀 — 교과서 방식)
    d.line(0, 0, 1)               # 1단계 줄 아래 가로선 (칸 0~0)
    d.append("0")                 # 나누어지는 수 끝에 0을 더 씀 (소수점 아래 0 내리기)
    d.move_point("5.89", 1)       # 나누어지는 수의 소수점을 오른쪽으로 옮김 (소수 ÷ 소수)
"""
from manim import DOWN, LEFT, RIGHT, UP, Arc, Create, Dot, FadeIn, Line, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, T


class DecDiv:
    def __init__(self, S, a, b, x_left=-1.0, y0=1.9, F=64, dx=0.66, dy=0.84):
        self.S, self.a, self.b = S, a, b
        self.xl, self.y0, self.F, self.dx, self.dy = x_left, y0, F, dx, dy
        self.digits = a.replace(".", "")
        self.p = a.index(".") if "." in a else None   # 소수점 앞 숫자 개수
        self.n = len(self.digits)
        self.dot_r = F / 760

    def x(self, col):
        return self.xl + col * self.dx

    def y(self, level):
        return self.y0 - level * self.dy

    def _dot(self, after_col, y, color=INK):
        return Dot([self.x(after_col) + self.dx / 2, y - self.F / 230, 0], radius=self.dot_r, color=color)

    def show(self, run_time=0.8):
        S = self.S
        self.top = VGroup(*[T(ch, self.F).move_to([self.x(i), self.y0, 0]) for i, ch in enumerate(self.digits)])
        self.pt = self._dot(self.p - 1, self.y0) if self.p is not None else VGroup()
        left = self.x(0) - self.dx * 0.75
        self.bar = Line([left, self.y0 + 0.5, 0], [self.x(self.n - 1) + self.dx * 0.9, self.y0 + 0.5, 0], color=INK, stroke_width=6)
        self.hook = Arc(radius=0.55, start_angle=0.6, angle=-1.2, color=INK, stroke_width=6).move_to([left - 0.12, self.y0 + 0.02, 0])
        bdig = self.b.replace(".", "")
        self.dv = VGroup(*[T(ch, self.F) for ch in bdig]).arrange(RIGHT, buff=self.dx - 0.36)
        self.dv.next_to(self.hook, LEFT, buff=0.18)
        self.bpt = VGroup()
        if "." in self.b:
            k = self.b.index(".")
            m = self.dv[k - 1]
            self.bpt = Dot([m.get_right()[0] + 0.08, self.y0 - self.F / 230, 0], radius=self.dot_r, color=INK)
        S.play(FadeIn(self.top), FadeIn(self.pt), Create(self.bar), Create(self.hook), FadeIn(self.dv), FadeIn(self.bpt), run_time=run_time)
        self.extra = VGroup()
        return VGroup(self.top, self.pt, self.bar, self.hook, self.dv, self.bpt)

    def quot(self, col, s, color=GREEN, run_time=0.5):
        g = VGroup(*[T(ch, self.F, color).move_to([self.x(col + i), self.y0 + 1.05, 0]) for i, ch in enumerate(s)])
        self.S.play(FadeIn(g, shift=DOWN * 0.15), run_time=run_time)
        return g

    def qdot(self, color=GREEN, after_col=None, run_time=0.4):
        ac = (self.p - 1) if after_col is None else after_col
        d = self._dot(ac, self.y0 + 1.05, color)
        self.S.play(FadeIn(d, scale=2), run_time=run_time)
        return d

    def row(self, s, right_col, level, color=INK, run_time=0.5):
        n = len(s)
        g = VGroup(*[T(ch, self.F, color).move_to([self.x(right_col - n + 1 + i), self.y(level), 0]) for i, ch in enumerate(s)])
        self.S.play(FadeIn(g), run_time=run_time)
        return g

    def line(self, c0, c1, level, run_time=0.3):
        yy = self.y(level) - self.dy / 2 + 0.04
        ln = Line([self.x(c0) - self.dx * 0.55, yy, 0], [self.x(c1) + self.dx * 0.55, yy, 0], color=INK, stroke_width=4)
        self.S.play(Create(ln), run_time=run_time)
        return ln

    def append(self, ch="0", color=ORANGE, run_time=0.5):
        col = self.n
        m = T(ch, self.F, color).move_to([self.x(col), self.y0, 0])
        self.n += 1
        self.digits += ch
        newbar = Line(self.bar.get_start(), [self.x(self.n - 1) + self.dx * 0.9, self.y0 + 0.5, 0], color=INK, stroke_width=6)
        self.S.play(FadeIn(m), self.bar.animate.become(newbar), run_time=run_time)
        self.top.add(m)
        return m

    def move_point(self, shift_cols, color=ORANGE, run_time=0.8):
        """나누어지는 수·나누는 수의 소수점을 오른쪽으로 shift_cols칸 옮김 (옮긴 자리에 색 점)"""
        S = self.S
        anims = []
        newp = self.p + shift_cols
        nd = self._dot(newp - 1, self.y0, color)
        anims.append(self.pt.animate.set_opacity(0.25))
        anims.append(FadeIn(nd))
        if "." in self.b:
            k = self.b.index(".")
            m = self.dv[min(k - 1 + shift_cols, len(self.dv) - 1)]
            nb = Dot([m.get_right()[0] + 0.08, self.y0 - self.F / 230, 0], radius=self.dot_r, color=color)
            if k - 1 + shift_cols >= len(self.dv) - 1:
                nb.set_opacity(0)
            anims.append(self.bpt.animate.set_opacity(0.25))
            anims.append(FadeIn(nb))
        S.play(*anims, run_time=run_time)
        self.p = newp
        return nd


# ── 소수 모형: 1(큰 정사각형, 0.1 막대 10개), 0.1(막대), 0.01(작은 정사각형) ──
from manim import Rectangle, Square  # noqa: E402

ONE_C, TENTH_C, HUND_C = "#7C9CC9", ORANGE, "#1F8A70"


def one_block(s=0.9):
    sq = Square(side_length=s, fill_color=ONE_C, fill_opacity=0.85, stroke_color=INK, stroke_width=3)
    lines = VGroup(*[Line([-s / 2 + s * k / 10, -s / 2, 0], [-s / 2 + s * k / 10, s / 2, 0], color=INK, stroke_width=1, stroke_opacity=0.5) for k in range(1, 10)])
    return VGroup(sq, lines)


def tenth_block(s=0.9):
    return Rectangle(width=s / 10, height=s, fill_color=TENTH_C, fill_opacity=0.95, stroke_color=INK, stroke_width=1.5)


def hund_block(s=0.9):
    return Square(side_length=s / 10, fill_color=HUND_C, fill_opacity=0.95, stroke_color=INK, stroke_width=1)


def blocks(ones, tenths, hunds=0, s=0.9, gap=0.18):
    """한 묶음: 1 ones개, 0.1 tenths개, 0.01 hunds개를 가로로 (반환: VGroup(1들, 0.1들, 0.01들))"""
    o = VGroup(*[one_block(s) for _ in range(ones)]).arrange(RIGHT, buff=gap) if ones else VGroup()
    t = VGroup(*[tenth_block(s) for _ in range(tenths)]).arrange(RIGHT, buff=0.05) if tenths else VGroup()
    h = VGroup(*[hund_block(s) for _ in range(hunds)]).arrange_in_grid(cols=5, buff=0.04) if hunds else VGroup()
    parts = [p for p in (o, t, h) if len(p)]
    VGroup(*parts).arrange(RIGHT, buff=gap * 1.6, aligned_edge=DOWN)
    return VGroup(o, t, h)
