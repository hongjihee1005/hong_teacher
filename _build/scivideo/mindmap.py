"""「과학 마인드맵」 단원 정리 영상 틀

가운데 단원 이름 → 차시마다 가지(색이 다름) → 가지마다 잎(핵심 낱말 1~3개)이 하나씩 붙으며
단원 전체가 한 장의 마인드맵이 됩니다. 마지막에 완성된 마인드맵을 크게 보여 주고(자막 없이),
'생각해 보세요'(마인드맵을 보며 말로 정리) → 마무리.

    class S3Mm01(MindMapScene):
        GRADE, SEM = 3, 1
        EP_NO = 1
        EP_TITLE = "힘과 우리 생활"
        CENTER = "힘과\n우리 생활"
        BRANCHES = [
            ("밀고 당기는 힘", ["무거울수록 큰 힘", ...], "가지 나레이션", ["잎 나레이션", ...]),
            ...
        ]
        SUMMARY = "마무리 핵심 문장(색 표시 가능)"
        NEXT = "3학년 5화 · …"

왼쪽 가운데 원(단원 이름)에서 가지가 오른쪽으로 부채처럼 뻗고(위에서 아래로 차시 차례), 잎은 가지 오른쪽에
한 줄로 붙습니다. 가지 2~6개, 잎은 가지마다 3개까지(한 줄이 넘치면 저절로 줄임) — 잎 글은 짧게.
"""
import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, ORIGIN, Create, CubicBezier, Dot, FadeIn, FadeOut, Indicate, Line,
                   RoundedRectangle, VGroup, Write, GrowFromCenter, LaggedStart)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, plain

PALETTE = ["#E0703A", "#2F6FD6", "#2E9E5B", "#B5408F", "#C99400", "#1F8A8A"]

CENTER_POS = np.array([-5.6, 0.25, 0.0])
CENTER_R = 1.32
NODE_X0 = -3.75        # 가지 상자 왼쪽 끝
LEAF_X0 = -0.85        # 잎 줄이 시작하는 곳
LEAF_X1 = 6.95         # 잎 줄 오른쪽 끝
LEAF_SIZE = 28
Y_TOP, Y_BOT = 2.6, -2.05


def row_ys(n):
    if n == 1:
        return [CENTER_POS[1]]
    return [Y_TOP - i * (Y_TOP - Y_BOT) / (n - 1) for i in range(n)]


def chip(text, col, st, size=LEAF_SIZE):
    import sci_theme
    t = T(text, size, INK).move_to(ORIGIN)
    box = sci_theme.mm_leaf_box(st, t.width + 0.36, t.height + 0.28, col).move_to(ORIGIN)
    return VGroup(box, t)


class MindMapScene(EpisodeScene):
    KIND = "mm"
    SERIES = "과학 마인드맵"
    CENTER = ""
    BRANCHES = []
    SUMMARY = ""
    NEXT = ""
    INTRO = None   # (자막, 나레이션) — 없으면 기본 문장

    def construct(self):
        self.opening()
        self.build_map()
        self.show_whole()
        self.closing(self.SUMMARY, next_preview=self.NEXT)
        self.wait(0.5)

    # ── 가운데 ──
    def center_node(self):
        import sci_theme
        t = VGroup(*[T(line, 38, PAPER) for line in self.CENTER.split("\n")]).arrange(DOWN, buff=0.12)
        if t.width > CENTER_R * 1.55:
            t.scale_to_fit_width(CENTER_R * 1.55)
        c = sci_theme.mm_center(self.st, CENTER_R, INK).move_to(CENTER_POS)
        t.move_to(CENTER_POS)
        return VGroup(c, t)

    def build_map(self):
        self._section = "마인드맵 만들기"   # 이름표는 띄우지 않음(맨 위 가지 자리)
        cn = self.center_node()
        self.cn = cn
        intro = self.INTRO or (f"「{self.EP_TITLE}」 단원에서 배운 것을 마인드맵으로 정리해요",
                               f"{self.EP_TITLE} 단원에서 배운 것을 마인드맵으로 정리해 볼게요. 가운데에 단원 이름을 써요.")
        self.say(*intro)
        self.play(GrowFromCenter(cn), run_time=0.8)
        self.map = VGroup(cn)
        import sci_theme
        ys = row_ys(len(self.BRANCHES))
        for i, (label, leaves, narr, leaf_narr) in enumerate(self.BRANCHES):
            col = PALETTE[i % len(PALETTE)]
            y = ys[i]
            node = self.branch_node(label, col, y)
            ang = np.arctan2(y - CENTER_POS[1], 1.6)
            start = CENTER_POS + CENTER_R * np.array([np.cos(ang), np.sin(ang), 0])
            end = node[0].get_left()
            curve = sci_theme.mm_link(self.st, start, end, col)
            self.say(f"{label}", narr)
            self.play(Create(curve), run_time=0.6)
            self.play(FadeIn(node, scale=0.8), run_time=0.4)
            grp = VGroup(curve, node)
            chips = VGroup(*[chip(lf, col, self.st) for lf in leaves]).arrange(RIGHT, buff=0.28)
            room = LEAF_X1 - LEAF_X0
            if chips.width > room:
                if room / chips.width < 0.85:
                    print(f"[경고] '{label}' 잎이 길어 {room / chips.width:.0%}로 줄었어요 — 잎 글을 짧게 고치세요")
                chips.scale_to_fit_width(room)
            chips.move_to([LEAF_X0, y, 0], aligned_edge=LEFT)
            for j, ch in enumerate(chips):
                a_ = node[0].get_right() if j == 0 else chips[j - 1][0].get_right()
                ln = Line(a_, ch[0].get_left(), stroke_color=col, stroke_width=4)
                sub = leaf_narr[j] if j < len(leaf_narr) else leaves[j]
                if isinstance(sub, tuple):
                    self.say(*sub)
                else:
                    self.say(f"{label} — {leaves[j]}", sub)
                self.play(Create(ln), FadeIn(ch, shift=RIGHT * 0.2), run_time=0.5)
                grp.add(ln, ch)
            self.map.add(grp)
        self.settle()

    def branch_node(self, label, col, y):
        t = T(label, 34, PAPER)
        if t.width > 2.45:
            t.scale_to_fit_width(2.45)
        import sci_theme
        box = sci_theme.mm_branch_node_box(self.st, t.width + 0.4, t.height + 0.34, col)
        box.move_to([NODE_X0, y, 0], aligned_edge=LEFT)
        t.move_to(box)
        return VGroup(box, t)

    # ── 완성 ──
    def show_whole(self):
        self.clear_sub()
        self.hide_chip()
        self._section = "완성"
        self._log.append((self.now(), "완성", "완성된 마인드맵", "마인드맵이 완성되었어요. 가지를 따라가며 배운 내용을 다시 읽어 보세요."))
        head = T("완성!", 48, self.accent).to_edge(DOWN, buff=0.45)
        self.play(self.map.animate.scale(1.0), FadeIn(head), run_time=0.6)
        for g_ in self.map[1:]:
            self.play(Indicate(g_[1], scale_factor=1.12), run_time=0.45)
        self.wait(2.0)
        self.play(FadeOut(head), run_time=0.3)
        self.talk(10)
        self.play(FadeOut(self.map), run_time=0.6)

    def talk(self, seconds=10):
        """마인드맵을 가리지 않고 아래 띠에 '잠시 멈추고 말해 보세요' + 남은 초"""
        from manim import ValueTracker, always_redraw, linear
        from series_style import SUB_Y, SUB_H
        msg = "잠시 멈추고, 마인드맵을 보며 배운 내용을 말해 보세요"
        self._log.append((self.now(), "완성", msg, "잠시 멈추고, 마인드맵을 보며 배운 내용을 친구에게 말해 보세요."))
        band = RoundedRectangle(corner_radius=0.25, width=13.7, height=SUB_H, fill_color=PAPER, fill_opacity=0.97,
                                stroke_color=self.accent, stroke_width=5).move_to([0, SUB_Y, 0])
        txt = T(msg, 38, self.accent).move_to(band).shift(LEFT * 0.55)
        left = ValueTracker(float(seconds))
        num = always_redraw(lambda: T(str(max(1, int(np.ceil(left.get_value() - 1e-6)))), 52, ORANGE)
                            .move_to([6.25, SUB_Y, 0]))
        self.play(FadeIn(band), FadeIn(txt), run_time=0.4)
        self.add(num)
        self.play(left.animate.set_value(0.0), run_time=seconds - 0.8, rate_func=linear)
        num.clear_updaters()
        self.play(FadeOut(VGroup(band, txt, num)), run_time=0.4)
