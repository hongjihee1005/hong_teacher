"""「과학 원리 돋보기」 6학년 14화 — 뿌리의 생김새와 하는 일 (6-1 3단원 식물의 구조와 기능 3차시, 화 코드 6-1-3-b)

바탕: grade6/science/sem1/u3-2.html(원본 _build_tb/src/u3-2.html) — 도입(당근은 뿌리, 뿌리에 양분 저장), 파 뿌리 관찰(비슷한 굵기의
뿌리가 수염처럼, 흰색·가늘고 김), 실험 계획(잎과 뿌리를 자른 파 / 잎만 자른 파, 다르게 할 조건·같게 할 조건), 실험(탈지면·같은 양의 물·
물 높이 표시·햇빛·3일 — 앱 영상의 차례), 결과(뿌리를 자르지 않은 쪽 물이 더 많이 줄어듦 → 흡수, 자른 쪽도 단면 흡수·증발로 조금 줄어듦,
결과를 사실대로 기록), 여러 가지 뿌리(백합·강아지풀 / 민들레·사과나무), 뿌리털, 뿌리가 하는 일(흡수·지지·저장), 뿌리 깊은 나무, 한눈에 쏙.
최종: ./make_final.sh s6ep14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Wiggle, Circumscribe, Transform,
                   Rectangle, RoundedRectangle, Line, Circle, Rotate)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def soil_band(y=-0.2, x0=-7.0, x1=7.0, h=2.3):
    return VGroup(Rectangle(width=x1 - x0, height=h, fill_color=K.SOIL, fill_opacity=0.85, stroke_width=0).move_to([(x0 + x1) / 2, y - h / 2, 0]),
                  Line([x0, y, 0], [x1, y, 0], stroke_color=K.SOIL_D, stroke_width=4))


class S6Ep14(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 14
    EP_TITLE = "뿌리의 생김새와 하는 일"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.plan()
        self.experiment()
        self.kinds()
        self.jobs()
        self.summary()
        self.closing(f"뿌리는 물을 {o('흡수')}하고, 식물을 {g('지지')}하며,\n양분을 {g('저장')}하기도 해요",
                     next_preview="6학년 15화 · 줄기의 생김새와 하는 일")
        self.wait(0.5)

    def intro(self):
        self.section("궁금해요")
        soil = soil_band(0.3, -3.0, 3.0, 2.6)
        ca = K.carrot(3.0).move_to([0, -0.2, 0])
        ca.shift([0, 0.3 - ca[2].get_top()[1], 0])
        self.say("우리가 먹는 당근은 식물의 어느 부분일까요?", "우적우적! 우리가 먹는 당근은 식물의 어느 부분일까요?")
        self.play(FadeIn(soil), FadeIn(ca), run_time=0.8)
        opts = VGroup(*[K.word_card(t, 1.7, 0.85, INK, 32) for t in ("뿌리", "줄기", "잎", "꽃")]).arrange(DOWN, buff=0.25).move_to([5.0, 0.4, 0])
        self.play(FadeIn(opts, lag_ratio=0.1), run_time=0.7)
        self.settle()
        self.say(f"흙 속에서 자라는 당근은 {o('뿌리')}예요 — 뿌리에 양분을 저장해요",
                 "흙 속에서 자라는 당근은 식물의 뿌리예요. 당근은 뿌리에 양분을 저장해요.")
        self.play(opts[0][0].animate.set_stroke(GREEN, 7), Indicate(ca[2], color=ORANGE), run_time=0.9)
        self.settle()
        clear_stage(self)

    def observe(self):
        self.section("관찰해요")
        paper = Rectangle(width=5.4, height=4.3, fill_color="#26292E", fill_opacity=1, stroke_width=0).move_to([-2.6, 0.35, 0])
        on = K.green_onion(3.4, n_root=13).move_to([-2.6, 0.5, 0])
        lab = T("검은색 종이 위의 파 뿌리", 28).next_to(paper, DOWN, buff=0.15)
        self.say("파 뿌리를 검은색 종이 위에 놓고 돋보기로 봐요", "파 뿌리를 검은색 종이 위에 놓고 돋보기로 관찰해요.")
        self.play(FadeIn(paper), FadeIn(on), FadeIn(lab), run_time=0.8)
        ring = Circle(radius=0.75, stroke_color=ORANGE, stroke_width=6).move_to(on.roots.get_center())
        self.play(Create(ring), run_time=0.5)
        card = K.text_card([f"비슷한 굵기의 뿌리가", f"{o('수염처럼')} 나 있어요", "흰색이고 가늘고 길어요"], size=34).move_to([3.5, 0.4, 0])
        self.say(f"비슷한 굵기의 뿌리가 {o('수염처럼')} 나 있어요",
                 "비슷한 굵기의 뿌리가 수염처럼 나 있어요. 뿌리는 흰색이고 가늘고 길어요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), Indicate(on.roots, color=ORANGE, scale_factor=1.05), run_time=0.9)
        self.settle()
        clear_stage(self)

    def two_onions(self, xs=(-3.6, 3.6), level=0.62):
        cyls = [K.Cylinder(x, -2.45, 4.6, 1.3, level) for x in xs]
        ons = []
        for i, c in enumerate(cyls):
            o_ = K.green_onion(3.4, root=(i == 1), cut_leaf=True, n_root=11)
            o_.shift([c.x, c.y_of(0.32), 0])
            ons.append(o_)
        cots = [K.cotton(0.9).move_to([c.x, c.top - 0.05, 0]) for c in cyls]
        return cyls, ons, cots

    def plan(self):
        self.section("실험 계획")
        a = K.green_onion(3.6, root=False).move_to([-4.6, 0.8, 0])
        b = K.green_onion(3.6, root=True).move_to([-1.2, 0.6, 0])
        la = T("잎과 뿌리를 자른 파", 30).next_to(a, DOWN, buff=0.25).set_y(-1.6)
        lb = T("잎만 자른 파", 30).next_to(b, DOWN, buff=0.25).set_y(-1.6)
        self.say(f"한 개는 {o('잎과 뿌리')}를, 다른 한 개는 {o('잎만')} 잘라요",
                 "파 한 개는 잎과 뿌리를 자르고, 다른 한 개는 잎만 잘라 각각 물이 든 눈금실린더에 넣어 두어요.")
        self.play(FadeIn(a), FadeIn(b), FadeIn(la), FadeIn(lb), run_time=0.8)
        self.settle()
        diff = K.text_card(["다르게 할 조건", f"· {o('뿌리가 있는지 없는지')}"], w=4.9, size=28, stroke=ORANGE).move_to([4.3, 2.05, 0])
        same = K.text_card(["같게 할 조건", "· 눈금실린더의 크기", "· 처음 물의 양", "· 파의 크기", "· 놓아두는 곳(햇빛)", "· 관찰하는 날짜"],
                           w=4.9, size=27).move_to([4.3, -0.6, 0])
        self.say(f"{o('뿌리')}만 다르게 하고 나머지 조건은 모두 같게 해요",
                 "뿌리가 있는지 없는지만 다르게 하고, 눈금실린더의 크기, 처음 물의 양, 파의 크기, 놓아두는 곳, 관찰하는 날짜는 모두 같게 해요.")
        self.play(FadeIn(diff), run_time=0.5)
        self.play(FadeIn(same, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def experiment(self):
        self.section("실험해요")
        cyls, ons, cots = self.two_onions()
        heads = [T(t, 30).move_to([c.x + (0.6 if c.x < 0 else 0), 2.75, 0]) for t, c in zip(("뿌리를 자른 파", "뿌리를 자르지 않은 파"), cyls)]
        self.say(f"탈지면으로 감싸 {o('같은 양의 물')}에 넣고 물 높이를 표시해요",
                 "파를 탈지면으로 감싸 같은 양의 물이 든 두 눈금실린더에 넣고, 물의 높이를 유성펜으로 표시해요.")
        self.play(*[FadeIn(c.group) for c in cyls], *[FadeIn(o_) for o_ in ons], *[FadeIn(c_) for c_ in cots],
                  *[FadeIn(h) for h in heads], run_time=0.9)
        marks = [c.mark(0.62) for c in cyls]
        self.play(*[Create(m) for m in marks], run_time=0.6)
        self.settle()
        sn = K.sun(0.42).move_to([0, 1.6, 0])
        day = T("3일 뒤", 40, self.accent).move_to([0, 0.4, 0])
        self.say("햇빛이 잘 드는 곳에 3일 동안 놓아두어요", "햇빛이 잘 드는 곳에 놓아두고, 3일 동안 물의 높이가 어떻게 변하는지 봐요.")
        self.play(FadeIn(sn), run_time=0.4)
        self.play(Rotate(sn, 1.2), run_time=0.8)
        self.play(FadeIn(day), run_time=0.4)
        self.pause_screen(5, "어느 쪽 물이 더 많이 줄어들까요?")
        nw = [cyls[0].water_at(0.56), cyls[1].water_at(0.38)]
        self.say(f"{o('뿌리를 자르지 않은')} 파 쪽의 물이 더 많이 줄었어요",
                 "3일 뒤, 뿌리를 자르지 않은 파가 있는 눈금실린더의 물이 더 많이 줄어들었어요.")
        self.play(Transform(cyls[0].water, nw[0]), Transform(cyls[1].water, nw[1]), run_time=1.6)
        self.play(Indicate(heads[1], color=ORANGE), run_time=0.7)
        self.settle()
        card = K.text_card([f"뿌리가 물을 {o('흡수')}해요"], size=38, stroke=ORANGE).move_to([0, -0.9, 0])
        self.say(f"뿌리가 물을 {o('흡수')}한다는 것을 알 수 있어요",
                 "뿌리가 있는 쪽의 물이 더 많이 줄어든 것으로 보아, 뿌리가 물을 흡수한다는 것을 알 수 있어요.")
        self.play(FadeOut(day), FadeIn(card), run_time=0.6)
        self.settle()
        self.say(f"자른 쪽도 조금 줄어든 것은 {o('단면 흡수와 증발')} 때문이에요",
                 "뿌리를 자른 파 쪽의 물도 조금 줄었어요. 자른 단면으로도 물이 조금 흡수되고, 그 물이 공기 중으로 증발하기 때문이에요.")
        self.play(Indicate(cyls[0].water, color=ORANGE), run_time=0.8)
        self.settle()
        self.say(f"예상과 달라도 결과는 {g('사실대로')} 기록해요",
                 "실험 결과가 예상과 달랐다면, 결과를 고쳐 쓰지 말고 사실대로 기록한 뒤 까닭을 생각해 봐요.")
        self.settle()
        clear_stage(self)

    def kinds(self):
        self.section("여러 가지 뿌리")
        b1 = K.bin_box("굵기가 비슷한 가는 뿌리가 수염처럼", 6.4, 4.0, BLUE_ := "#2F6FD6", 28).move_to([-3.35, 0.35, 0])
        b2 = K.bin_box("굵고 곧은 뿌리에 가는 뿌리가 여러 개", 6.4, 4.0, ORANGE, 28).move_to([3.35, 0.35, 0])
        f1 = K.fibrous_root(1.6, 1.6).move_to([-3.35, 0.0, 0])
        f2 = K.tap_root(1.4, 1.8).move_to([3.35, 0.0, 0])
        n1 = T("백합 · 강아지풀", 32).move_to([-3.35, -1.2, 0])
        n2 = T("민들레 · 사과나무", 32).move_to([3.35, -1.2, 0])
        self.say("식물의 뿌리를 생김새에 따라 나누어 봐요", "여러 가지 식물의 뿌리를 생김새에 따라 나누어 봐요.")
        self.play(FadeIn(b1), FadeIn(b2), FadeIn(f1), FadeIn(f2), run_time=0.8)
        self.say(f"백합·강아지풀은 {o('수염처럼')}, 민들레·사과나무는 {o('굵고 곧은 뿌리')}",
                 "백합과 강아지풀은 굵기가 비슷한 가는 뿌리가 수염처럼 나 있고, 민들레와 사과나무는 굵고 곧은 뿌리에 가는 뿌리가 여러 개 나 있어요.")
        self.play(FadeIn(n1), run_time=0.5)
        self.play(FadeIn(n2), run_time=0.5)
        self.settle()
        clear_stage(self)

    def jobs(self):
        self.section("뿌리가 하는 일")
        on = K.green_onion(3.0).move_to([-4.6, 0.4, 0])
        ring = Circle(radius=1.55, fill_color=PAPER, fill_opacity=1, stroke_color=ORANGE, stroke_width=6).move_to([-1.4, 0.6, 0])
        main = Line([-2.9, 0.6, 0], [0.1, 0.6, 0], stroke_color=K.ROOT_D, stroke_width=16)
        hairs = VGroup(*[Line([x, 0.6 + s_ * 0.06, 0], [x + 0.12, 0.6 + s_ * 0.5, 0], stroke_color=K.ROOT_D, stroke_width=3)
                         for x in [-2.4 + 0.18 * i for i in range(13)] for s_ in (1, -1)])
        zoom = VGroup(ring, main, hairs)
        cap = T("뿌리털", 32, ORANGE).next_to(ring, DOWN, buff=0.15)
        self.say(f"뿌리에는 솜털처럼 가는 {o('뿌리털')}이 있어요",
                 "뿌리에는 솜털처럼 가는 뿌리털이 있어요. 뿌리털이 있어 물을 잘 흡수할 수 있어요.")
        self.play(FadeIn(on), FadeIn(zoom), FadeIn(cap), run_time=0.9)
        self.settle()
        rows = [("물을 흡수해요", True), ("식물이 쓰러지지 않도록 지지해요", True), ("양분을 저장하기도 해요(당근·고구마)", True),
                ("빛을 받아 양분을 만들어요", False)]
        cards = VGroup()
        for t_, ok in rows:
            cards.add(K.word_card(t_, 6.0, 0.85, INK, 28))
        cards.arrange(DOWN, buff=0.22).move_to([3.95, 0.4, 0])
        marks = VGroup(*[K.ox_mark(ok, 0.24).next_to(c_, LEFT, buff=0.12) for c_, (_, ok) in zip(cards, rows)])
        self.say("뿌리가 하는 일을 모두 골라 봐요", "뿌리가 하는 일을 모두 골라 봐요.")
        self.play(FadeIn(cards, lag_ratio=0.1), run_time=0.8)
        self.pause_screen(5, "뿌리가 하는 일은 무엇일까요?")
        self.say(f"{o('흡수')} · {o('지지')} · {o('저장')} — 양분을 {r('만들지는')} 않아요",
                 "뿌리는 물을 흡수하고, 식물을 지지하고, 양분을 저장하기도 해요. 양분은 주로 잎에서 만들어요.")
        self.play(FadeIn(marks[:3]), run_time=0.6)
        self.play(FadeIn(marks[3]), cards[3].animate.set_opacity(0.45), run_time=0.6)
        self.settle()
        clear_stage(self)
        soil = soil_band(-0.2, -7.0, 7.0, 2.3)
        t1 = K.tree_rooted(2.6, True).move_to([-3.0, 0.3, 0])
        t1.shift([0, -0.2 - t1.tree.get_bottom()[1], 0])
        t2 = K.tree_rooted(2.6, False)
        t2.shift([3.0, -0.2 - t2.tree.get_bottom()[1], 0])
        wind = K.wind_lines(-6.6, (1.2, 1.9, 2.5), 1.8)
        q = M("‘뿌리 깊은 나무는 바람에 흔들리지 않는다.’", 36).move_to([1.3, 2.75, 0])
        self.say("‘뿌리 깊은 나무는 바람에 흔들리지 않는다’", "뿌리 깊은 나무는 바람에 흔들리지 않는다. 이 말을 뿌리가 하는 일과 연관 지어 볼까요?")
        self.play(FadeIn(soil), FadeIn(t1), FadeIn(t2), FadeIn(q), run_time=0.8)
        self.play(FadeIn(wind, shift=RIGHT), run_time=0.5)
        self.play(Rotate(t2.tree, -0.12, about_point=t2.tree.get_bottom()), Wiggle(t1.tree, scale_value=1.0, rotation_angle=0.02), run_time=1.0)
        self.say(f"뿌리가 땅속 깊이 뻗어 식물을 {g('지지')}하기 때문이에요",
                 "뿌리가 땅속 깊이 뻗어 있으면 식물을 단단히 지지해서, 강한 바람이 불어도 잘 흔들리지 않아요.")
        self.play(Indicate(t1.roots, color=ORANGE, scale_factor=1.05), run_time=0.9)
        self.settle()
        clear_stage(self)

    def summary(self):
        self.section("한눈에 쏙")
        on = K.green_onion(2.6).move_to([-4.4, 1.3, 0])
        ca = K.carrot(2.2).move_to([-0.9, 1.35, 0])
        tr = K.fit(K.tree_rooted(2.4, True), 2.4, 2.9).move_to([3.0, 1.1, 0])
        ic = VGroup(T("흡수", 34, ORANGE).next_to(on, DOWN, buff=0.15), T("저장", 34, ORANGE).next_to(ca, DOWN, buff=0.15),
                    T("지지", 34, ORANGE).next_to(tr, RIGHT, buff=0.3))
        card = K.text_card([f"식물은 뿌리로 물을 {o('흡수')}합니다."], size=38).move_to([0, -1.85, 0])
        self.say(f"식물은 뿌리로 물을 {o('흡수')}해요",
                 "식물의 뿌리는 물을 흡수해요. 뿌리털이 있어 물을 잘 흡수하고, 식물을 지지하며, 양분을 저장하기도 해요.")
        self.play(FadeIn(on), FadeIn(ca), FadeIn(tr), FadeIn(ic), run_time=0.8)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
