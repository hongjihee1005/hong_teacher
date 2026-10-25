"""「과학 원리 돋보기」 3학년 1화 — 무거운 물체를 밀 때 힘이 더 들까? (3-1 1단원 힘과 우리 생활 2차시, 화 코드 3-1-1-a)

바탕: grade3/science/sem1/u1-1.html — 그네 도입, 복사용지 묶음 4개·1개 상자를 밀고 당기기, 결과 정리 막대,
무게의 뜻(책가방·카트), 생각 바로잡기(큰 빈 상자 vs 작은 쇠 아령), 한눈에 쏙 '가벼운 물체일수록 더 작은 힘'.
최종: ./make_final.sh s3ep01
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Line, FadeIn, FadeOut, GrowArrow, Indicate, LaggedStart,
                   Rotate, Transform, VGroup, Write, rate_functions)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import (RED, backpack, box, bundle, cart, clear_stage, dumbbell, force_arrow, force_bar, ground,
                    person, place, swing, tag)


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S3Ep01(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 1
    EP_TITLE = "무거운 물체를 밀 때 힘이 더 들까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.swings()
        self.boxes()
        self.result()
        self.weight()
        self.misconception()
        self.closing(f"무거운 물체일수록 밀거나 당길 때 {r('더 큰 힘')}이 들고,\n가벼운 물체일수록 {g('더 작은 힘')}이 들어요",
                     next_preview="3학년 2화 · 수평 잡기로 무게를 비교해요")
        self.wait(0.5)

    # ── 궁금해요: 그네 ──
    def swings(self):
        self.section("궁금해요")
        bar = Line([-6.2, 2.7, 0], [6.2, 2.7, 0], stroke_color=INK, stroke_width=10)
        left = swing(1.55, BLUE, x=-2.6, top=2.7, seat_y=0.0)
        right = swing(0.95, ORANGE, x=2.6, top=2.7, seat_y=0.0)
        la = tag("어른", BLUE).next_to(left, DOWN, buff=0.35)
        ra = tag("어린이", ORANGE).next_to(right, DOWN, buff=0.35)
        self.say("어른이 앉은 그네와 어린이가 앉은 그네", "놀이터에 그네가 두 개 있어요. 하나에는 어른이, 하나에는 어린이가 앉아 있어요.")
        self.play(Create(bar), FadeIn(left), FadeIn(right), run_time=1.0)
        self.play(FadeIn(la), FadeIn(ra), run_time=0.5)
        self.say("두 그네를 밀면 어떤 차이가 있을까?", "두 그네를 밀 때 어떤 차이가 있을까요?")
        self.wait(1.0)
        self.pause_screen(5, "어느 그네를 밀 때 힘이 더 들까요?")
        self.say(f"{r('어른')}이 앉은 그네를 밀 때 더 큰 힘이 들어요", "어른이 앉은 그네를 밀 때 더 큰 힘이 들어요.")
        self.play(Rotate(left, 0.18, about_point=left.pivot), Rotate(right, 0.5, about_point=right.pivot), run_time=0.9,
                  rate_func=rate_functions.there_and_back)
        self.say("그네에 탄 사람이 무거울수록 밀 때 더 큰 힘이 들어요",
                 "같은 힘으로 밀면 어린이 그네는 높이 올라가지만, 어른 그네는 조금만 움직여요. 무거울수록 밀 때 더 큰 힘이 드는 거예요.")
        self.play(Rotate(left, 0.18, about_point=left.pivot), Rotate(right, 0.5, about_point=right.pivot), run_time=0.9,
                  rate_func=rate_functions.there_and_back)
        self.settle()
        clear_stage(self)

    # ── 실험: 상자 밀기·당기기 ──
    def boxes(self):
        self.section("실험해요")
        gnd = ground(-1.9)
        ba = box(2.1, 1.5, "㉮")
        bb = box(2.1, 1.5, "㉯")
        place(ba, -2.6, -1.9)
        place(bb, 2.6, -1.9)
        self.say("상자 두 개에 복사용지 묶음을 넣어요", "상자 두 개를 준비해요. 상자 가에는 복사용지 묶음 네 개, 상자 나에는 한 개를 넣어요.")
        self.play(Create(gnd), FadeIn(ba), FadeIn(bb), run_time=0.8)
        packs = VGroup()
        for i in range(4):
            p = bundle().move_to([-2.6, 2.2, 0])
            self.play(p.animate.move_to([-2.6, -1.9 + 1.65 + 0.27 * i, 0]), run_time=0.35)
            packs.add(p)
        p = bundle().move_to([2.6, 2.2, 0])
        self.play(p.animate.move_to([2.6, -1.9 + 1.65, 0]), run_time=0.35)
        packs.add(p)
        na = T("묶음 4개", 40, INK).move_to([-2.6, 1.9, 0])
        nb = T("묶음 1개", 40, INK).move_to([2.6, 1.9, 0])
        self.play(FadeIn(na), FadeIn(nb), run_time=0.4)
        self.say(f"어느 상자가 더 무거울까요? 상자 ㉮가 더 무거워요", "두 상자를 들어 보면 묶음이 네 개 든 상자 가가 더 무거워요.")
        self.play(Indicate(VGroup(ba, packs[:4]), color=ORANGE, scale_factor=1.05), run_time=0.9)
        self.settle()
        self.play(FadeOut(VGroup(na, nb)), run_time=0.3)

        # 한 상자씩 밀기
        self.say("이제 두 상자를 각각 밀어 봐요", "이제 두 상자를 책상 위에 나란히 놓고, 각각 밀어서 움직여 봐요.")
        self.pause_screen(5, "어느 상자를 밀 때 힘이 더 들까요?")
        A = VGroup(ba, packs[:4])
        B = VGroup(bb, packs[4])
        pa = place(person(2.4, BLUE, "push"), -5.2, -1.9)
        pa.shift(RIGHT * (A.get_left()[0] - pa.hand[0]))
        pa.hand = None
        self.say(f"상자 ㉮(묶음 4개)를 밀면?", "먼저 묶음 네 개가 든 상자 가를 밀어 볼게요.")
        self.play(FadeIn(pa), run_time=0.5)
        fa = force_arrow([A.get_left()[0] + 0.1, -1.55, 0], 1.2)
        self.play(GrowArrow(fa), run_time=0.6)
        self.play(VGroup(A, pa, fa).animate.shift(RIGHT * 0.7), run_time=2.0, rate_func=rate_functions.ease_in_out_sine)
        lab_a = T("큰 힘", 50, RED).move_to([A.get_center()[0], 1.3, 0])
        self.play(FadeIn(lab_a), run_time=0.4)
        self.say(f"무거운 상자는 {r('큰 힘')}을 주어야 움직여요", "무거운 상자 가는 큰 힘을 주어야 겨우 움직여요.")
        self.settle()
        self.play(FadeOut(VGroup(pa, fa, lab_a)), A.animate.shift(LEFT * 0.7), run_time=0.6)

        pb = place(person(2.4, ORANGE, "push"), 0.0, -1.9)
        pb.shift(RIGHT * (B.get_left()[0] - pb.hand[0]))
        pb.hand = None
        self.say(f"상자 ㉯(묶음 1개)를 밀면?", "이번에는 묶음 한 개가 든 상자 나를 밀어 볼게요.")
        self.play(FadeIn(pb), run_time=0.5)
        fb = force_arrow([B.get_left()[0] + 0.1, -1.55, 0], 0.3, color=GREEN)
        self.play(GrowArrow(fb), run_time=0.5)
        self.play(VGroup(B, pb, fb).animate.shift(RIGHT * 1.2), run_time=1.0, rate_func=rate_functions.ease_out_sine)
        lab_b = T("작은 힘", 50, GREEN).move_to([B.get_center()[0], 0.8, 0])
        self.play(FadeIn(lab_b), run_time=0.4)
        self.say(f"가벼운 상자는 {g('작은 힘')}으로도 움직여요", "가벼운 상자 나는 작은 힘으로도 쉽게 움직여요.")
        self.settle()
        self.play(FadeOut(VGroup(pb, fb, lab_b)), B.animate.shift(LEFT * 1.2), run_time=0.6)

        # 당기기
        self.say("당길 때도 똑같을까요?", "그럼 상자를 당겨서 움직일 때는 어떨까요?")
        qa = place(person(2.4, BLUE, "pull", face=LEFT), 0, -1.9)
        qa.shift(RIGHT * (A.get_right()[0] - qa.hand[0]))
        qb = place(person(2.4, ORANGE, "pull", face=LEFT), 0, -1.9)
        qb.shift(RIGHT * (B.get_right()[0] - qb.hand[0]))
        qa.hand = qb.hand = None
        self.play(FadeIn(qa), FadeIn(qb), run_time=0.5)
        ga = force_arrow([A.get_left()[0] + 0.1, -1.55, 0], 1.2)
        gb = force_arrow([B.get_left()[0] + 0.1, -1.55, 0], 0.3, color=GREEN)
        self.play(GrowArrow(ga), GrowArrow(gb), run_time=0.6)
        self.play(VGroup(A, qa, ga).animate.shift(RIGHT * 0.35), VGroup(B, qb, gb).animate.shift(RIGHT * 1.0),
                  run_time=1.6)
        self.say(f"당길 때도 무거운 상자에 {r('더 큰 힘')}이 들어요",
                 "당길 때도 마찬가지예요. 무거운 상자를 당길 때 더 큰 힘이 들어요.")
        self.settle()
        clear_stage(self)

    # ── 결과 정리 ──
    def result(self):
        self.section("결과 정리")
        head = VGroup(T("밀어서 움직일 때", 38, INK), T("당겨서 움직일 때", 38, INK))
        head[0].move_to([-0.3, 2.15, 0])
        head[1].move_to([3.9, 2.15, 0])
        ra = T("㉮ 묶음 4개", 44, INK).move_to([-4.6, 1.0, 0])
        rb = T("㉯ 묶음 1개", 44, INK).move_to([-4.6, -0.6, 0])
        ra2 = T("(무거운 상자)", 32, SOFT).next_to(ra, DOWN, buff=0.1)
        rb2 = T("(가벼운 상자)", 32, SOFT).next_to(rb, DOWN, buff=0.1)
        self.say("막대가 길수록 큰 힘이 든 거예요", "실험 결과를 막대로 정리해 볼게요. 막대가 길수록 큰 힘이 든 거예요.")
        self.play(FadeIn(head), FadeIn(VGroup(ra, rb, ra2, rb2)), run_time=0.8)
        bars = VGroup(
            force_bar(1.0, length=3.0).move_to([-1.8, 1.0, 0], aligned_edge=LEFT),
            force_bar(1.0, length=3.0).move_to([2.4, 1.0, 0], aligned_edge=LEFT),
            force_bar(0.28, length=3.0, color=GREEN).move_to([-1.8, -0.6, 0], aligned_edge=LEFT),
            force_bar(0.28, length=3.0, color=GREEN).move_to([2.4, -0.6, 0], aligned_edge=LEFT),
        )
        for bb_ in bars:
            bb_.stretch(0.01, 0, about_edge=LEFT)
        self.add(bars)
        self.play(*[bb_.animate.stretch(100, 0, about_edge=LEFT) for bb_ in bars], run_time=1.4)
        self.say(f"무거운 물체를 밀거나 당길 때 {r('더 큰 힘')}이 들어요",
                 "무거운 물체를 밀거나 당겨서 움직일 때가, 가벼운 물체를 움직일 때보다 더 큰 힘이 들어요.")
        self.play(Indicate(VGroup(bars[0], bars[1]), color=RED), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 무게 ──
    def weight(self):
        self.section("무게")
        word = M(f"물체가 가볍고 무거운 정도 = {o('무게')}", 60).move_to([0, 2.3, 0])
        self.say(f"물체가 가볍고 무거운 정도를 {o('무게')}라고 해요", "물체가 가볍고 무거운 정도를 무게라고 해요.")
        self.play(Write(word), run_time=1.2)
        gnd = ground(-1.7, -6.5, 6.5)
        e = place(backpack(False, 1.0), -4.9, -1.7)
        f = place(backpack(True, 1.0), -2.6, -1.7)
        el = T("빈 책가방", 34, SOFT).next_to(e, DOWN, buff=0.2)
        fl = T("책이 가득", 34, SOFT).next_to(f, DOWN, buff=0.2)
        c1 = place(cart(False, 0.95), 1.9, -1.7)
        c2 = place(cart(True, 0.95), 4.7, -1.7)
        cl1 = T("빈 카트", 34, SOFT).next_to(c1, DOWN, buff=0.2)
        cl2 = T("가득 찬 카트", 34, SOFT).next_to(c2, DOWN, buff=0.2)
        self.say("책을 넣은 가방, 물건을 담은 카트는 더 무거워요",
                 "교과서를 가득 넣은 책가방은 빈 책가방보다 무겁고, 물건을 가득 담은 카트는 빈 카트보다 무거워요.")
        self.play(Create(gnd), LaggedStart(FadeIn(e), FadeIn(f), FadeIn(c1), FadeIn(c2), lag_ratio=0.3), run_time=1.4)
        self.play(FadeIn(VGroup(el, fl, cl1, cl2)), run_time=0.4)
        self.say(f"가득 찬 카트를 밀 때 {r('더 큰 힘')}이 들어요", "그래서 물건을 가득 담은 카트를 밀 때 더 큰 힘이 들어요.")
        fa = force_arrow([c2.get_center()[0] - 0.9, -0.35, 0], 0.9)
        fa2 = force_arrow([c1.get_center()[0] - 0.6, -0.35, 0], 0.25, color=GREEN)
        self.play(GrowArrow(fa), GrowArrow(fa2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misconception(self):
        self.section("생각 바로잡기")
        q = T("크기가 크면 항상 더 무거울까요?", 56, INK).move_to([0, 2.3, 0])
        gnd = ground(-1.5, -6, 6)
        big = box(3.0, 2.3, "", color="#D9B98C")
        place(big, -2.8, -1.5)
        bl = T("큰 빈 종이 상자", 38, INK).next_to(big, DOWN, buff=0.25)
        db = place(dumbbell(1.5), 2.8, -1.5)
        dl = T("작은 쇠 아령", 38, INK).next_to(db, DOWN, buff=0.25)
        self.say("크기가 크면 항상 더 무거울까요?", "그런데, 크기가 크면 항상 더 무거울까요?")
        self.play(FadeIn(q), Create(gnd), FadeIn(big), FadeIn(db), run_time=0.9)
        self.play(FadeIn(bl), FadeIn(dl), run_time=0.4)
        self.say("밀어서 움직일 때 더 큰 힘이 드는 것은?", "큰 빈 종이 상자와 작은 쇠 아령 중에서, 밀어서 움직일 때 더 큰 힘이 드는 것은 무엇일까요?")
        self.pause_screen(5, "어느 것을 밀 때 힘이 더 들까요?")
        self.say(f"작은 {r('쇠 아령')}이 더 무거워서 더 큰 힘이 들어요",
                 "작은 쇠 아령이에요. 크기는 작아도 더 무거워서 밀 때 더 큰 힘이 들어요.")
        self.play(Indicate(db, color=RED, scale_factor=1.25), run_time=1.0)
        self.say(f"크기가 아니라 {o('무게')}에 따라 드는 힘이 달라요", "크기가 아니라, 무게에 따라 밀거나 당길 때 드는 힘이 달라져요.")
        self.settle()
        clear_stage(self)
