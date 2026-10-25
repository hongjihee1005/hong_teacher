"""「과학 원리 돋보기」 5학년 13화 — 물에 녹은 물질은 어떻게 될까? (5-1 3단원 용해와 용액 3차시, 화 코드 5-1-3-b)

바탕: grade5/science/sem1/u3-2.html(원본 _build_tb/src/u3-2.html) — 도입(너구리가 솜사탕을 물에 씻음 → 없어짐, 무게 비교),
예상, 전자저울 실험(유리병 물 절반 + 각설탕 접시 91.6 g → 각설탕 넣어 다 녹음 → 유리병 + 빈 접시 91.6 g, 지도서 예시 값),
녹는 모습(넣기 → 아지랑이 → 작은 조각 → 투명), 정리(무게 같음, 눈에 보이지 않을 정도로 작게 변해 골고루 섞임),
생각 바로잡기, 오차 찾기(4모둠 91.6 g → 91.3 g, 이 자료에서 정한 값), 형성 평가(바이타민 10 g + 물 90 g = 100 g), 한눈에 쏙.
최종: ./make_final.sh s5ep13
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Arrow,
                   SurroundingRectangle, Transform)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep13(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 13
    EP_TITLE = "물에 녹은 물질은 어떻게 될까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.weigh()
        self.dissolve()
        self.why()
        self.error()
        self.summary()
        self.closing(f"각설탕이 용해되기 전과 용해된 후의\n무게는 {o('같아요')}",
                     next_preview="5학년 14화 · 더 많이 녹이려면?")
        self.wait(0.5)

    # ── 궁금해요: 솜사탕 ──
    def intro(self):
        self.section("궁금해요")
        G = K.Glass(1.6, -2.2, 3.6, 2.2, "cup")
        bowl = VGroup(G.liquid(1.8), G.glass())
        cc = K.cotton_candy(1.3).move_to([-3.2, 0.6, 0])
        self.say("솜사탕을 물에 씻으면 어떻게 될까요?",
                 "너구리가 솜사탕을 먹기 전에 물에 깨끗이 씻으려고 해요. 솜사탕을 물에 씻으면 어떻게 될까요?")
        self.play(FadeIn(bowl), FadeIn(cc), run_time=0.7)
        self.settle()
        self.play(cc.animate.move_to([1.6, -0.6, 0]), run_time=1.2)
        self.play(cc[1].animate.set_opacity(0), run_time=1.4)
        oops = T("어? 솜사탕이 없어졌어!", 40, RED).move_to([0, 2.5, 0])
        self.say(f"솜사탕(설탕)이 물에 녹아 {o('보이지 않게')} 되었어요",
                 "어? 솜사탕이 없어졌어요! 솜사탕을 이루는 설탕이 물에 녹아 보이지 않게 되었어요. 정말 사라진 걸까요?")
        self.play(FadeIn(oops, scale=0.9), run_time=0.5)
        self.settle()
        self.say(f"설탕이 녹기 전과 녹은 뒤의 {o('무게')}를 비교해 봐요",
                 "설탕이 사라졌는지, 물속에 그대로 있는지 알아보려면 녹기 전과 녹은 뒤의 무게를 비교해 봐요. 무게는 어떻게 될까요?")
        self.pause_screen(5, "녹은 뒤 무게는 어떻게 될까요?")
        clear_stage(self)

    # ── 실험해요: 전자저울 ──
    def show_num(self, sc, val, run_time=0.9):
        import random
        rnd = random.Random(int(val * 10))
        for k in range(4):
            v = val - 3 + rnd.random() * 6
            self.play(Transform(sc.num, T(f"{v:.1f} g", 30, "#7CF2A4").move_to(sc.scr)), run_time=run_time / 5)
        self.play(Transform(sc.num, T(f"{val:.1f} g", 30, "#7CF2A4").move_to(sc.scr)), run_time=run_time / 5)

    def weigh(self):
        self.section("실험해요")
        sc = K.e_scale("0.0", w=4.6).move_to([-2.6, -2.0, 0])
        top = sc.get_top()[1]
        J = K.Glass(-3.55, top + 0.02, 1.6, 2.0, "jar")
        jar = VGroup(J.glass(lid=True))
        water = J.liquid(1.0)
        dish = K.dish(1.5, cube=True).move_to([-1.35, top + 0.18, 0])
        rec = VGroup(T("용해되기 전", 34), T("? g", 44, SOFT), T("용해된 후", 34), T("? g", 44, SOFT))
        boxes = VGroup()
        for i in (0, 2):
            bx = K.RoundedRectangle(corner_radius=0.2, width=4.2, height=1.6, fill_color=K.PAPER, fill_opacity=1,
                                    stroke_color=SOFT, stroke_width=4)
            boxes.add(bx)
        boxes.arrange(DOWN, buff=0.35).move_to([4.0, 0.5, 0])
        for i, bx in enumerate(boxes):
            rec[2 * i].move_to(bx.get_center() + UP * 0.38)
            rec[2 * i + 1].move_to(bx.get_center() + DOWN * 0.32)
        self.say("① 유리병에 물을 절반 넣고 뚜껑을 닫아요",
                 "유리병에 물을 절반 넣고 물이 새지 않게 뚜껑을 잘 닫아요. 페트리 접시에는 각설탕을 올려요.")
        self.play(FadeIn(sc), FadeIn(jar), FadeIn(water), FadeIn(dish), FadeIn(boxes), FadeIn(rec), run_time=0.9)
        self.say(f"② 유리병과 각설탕 접시를 함께 올려 무게를 재요",
                 "유리병과 각설탕을 올린 접시를 전자저울에 함께 올려 무게를 재요. 숫자가 멈추면 그대로 기록해요.")
        self.show_num(sc, 91.6)
        v1 = T("91.6 g", 44, ORANGE).move_to(rec[1])
        self.play(Transform(rec[1], v1), run_time=0.5)
        note = T("91.6 g은 지도서의 예시 값 (실제 값은 모둠마다 달라요)", 26, SOFT).move_to([0, 2.55, 0])
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        # ③ 각설탕 넣기
        tw = K.tweezers(1.0).move_to([-0.2, 0.6, 0])
        self.say("③ 핀셋으로 각설탕을 넣고 다 녹을 때까지 기다려요",
                 "뚜껑을 열고 핀셋으로 각설탕을 넣은 뒤 뚜껑을 닫아요. 물이 튀지 않게 살살 넣어요. 각설탕이 다 녹을 때까지 기다려요.")
        cube = dish.cube
        lid = jar[0][-1]
        self.play(FadeIn(tw), lid.animate.shift(UP * 0.5 + LEFT * 0.3), run_time=0.5)
        self.play(cube.animate.move_to([J.x, J.y + J.h + 0.4, 0]), tw.animate.move_to([J.x + 0.9, J.y + J.h + 0.45, 0]),
                  run_time=0.8)
        self.play(cube.animate.move_to([J.x, J.y + 0.3, 0]), FadeOut(tw), run_time=0.6)
        self.play(lid.animate.shift(DOWN * 0.5 + RIGHT * 0.3), run_time=0.4)
        self.play(cube.animate.scale(0.01).set_opacity(0), run_time=1.6)
        self.settle()
        self.say("④ 다 녹으면 유리병과 빈 접시의 무게를 재요",
                 "각설탕이 모두 녹아 투명해졌어요. 이제 설탕물이 든 유리병과 빈 접시를 함께 올려 무게를 재요.")
        self.pause_screen(5, "용해된 후의 무게는 몇 g일까요?")
        self.show_num(sc, 91.6)
        v2 = T("91.6 g", 44, ORANGE).move_to(rec[3])
        self.play(Transform(rec[3], v2), run_time=0.5)
        eq = T("=", 64, GREEN).move_to(boxes.get_center())
        self.say(f"용해되기 전과 용해된 후의 무게가 {g('같아요')}",
                 "용해된 후에도 91.6그램이에요. 용해되기 전과 용해된 후의 무게가 같아요.")
        self.play(FadeIn(eq), Indicate(rec[1], color=GREEN), Indicate(rec[3], color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 각설탕이 녹는 모습 ──
    def dissolve(self):
        self.section("녹는 모습")
        J = K.Glass(-2.6, -2.35, 3.4, 4.3, "jar")
        jar = VGroup(J.liquid(3.7), J.glass())
        cube = K.sugar_cube(0.75).move_to([J.x, 1.6, 0])
        steps = VGroup(*[K.word_card(t, 5.6, 0.8, INK, 28) for t in
                         ("① 각설탕을 물에 넣어요", "② 아지랑이 같은 일렁임이 퍼져요", "③ 작은 조각으로 쪼개지며 작아져요",
                          "④ 모두 없어져 투명해져요")]).arrange(DOWN, buff=0.25).move_to([3.6, 0.4, 0])
        for s_ in steps:
            s_.set_opacity(0.25)
        self.add(jar)
        self.play(FadeIn(jar), FadeIn(steps), run_time=0.6)
        self.say("각설탕이 물에 녹는 모습을 자세히 관찰해요",
                 "각설탕이 물에 녹는 모습을 자세히 관찰해 봐요. 물에 넣은 각설탕은 바닥에 가라앉아요.")
        self.play(FadeIn(cube), steps[0].animate.set_opacity(1), run_time=0.5)
        self.play(cube.animate.move_to([J.x, J.y + 0.45, 0]), run_time=1.0)
        sh = K.shimmer(J.x, J.y + 1.0, 1.4, 5, 0.4)
        self.say(f"주변으로 {o('아지랑이')} 같은 일렁임이 퍼져 나가요",
                 "각설탕 주변으로 아지랑이 같은 일렁임이 보이면서 퍼져 나가요.")
        self.play(Create(sh), steps[1].animate.set_opacity(1), run_time=1.2)
        self.settle()
        bt = K.bits(J.x, J.y + 0.12, 2.2, 16, 0.12)
        self.say(f"점점 {o('작은 조각')}으로 쪼개지며 작아져요",
                 "각설탕이 점점 작은 조각으로 쪼개지며 작아져요.")
        self.play(cube.animate.scale(0.45), FadeIn(bt), steps[2].animate.set_opacity(1), run_time=1.2)
        self.settle()
        self.say(f"모두 없어져 {g('투명')}해졌어요",
                 "각설탕이 모두 없어져 투명해졌어요. 설탕은 눈에 보이지 않을 만큼 작아져 물에 골고루 섞였어요.")
        self.play(FadeOut(cube), FadeOut(bt), FadeOut(sh), steps[3].animate.set_opacity(1), run_time=1.4)
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def why(self):
        self.section("정리해요")
        q = T("왜 무게가 같을까요?", 50).move_to([0, 2.3, 0])
        self.say("왜 무게가 같을까요?", "그렇다면 용해되기 전과 후의 무게는 왜 같을까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(5, "왜 무게가 같을까요?")
        card = K.text_card([f"각설탕이 {o('눈에 보이지 않을 정도로 작게')} 변해", f"물속에 {g('골고루 섞여')} 있기 때문이에요."],
                           w=11.0, size=40).move_to([0, 0.6, 0])
        self.say(f"각설탕이 {o('작게')} 변해 물속에 {g('골고루 섞여')} 있어요",
                 "각설탕이 눈에 보이지 않을 정도로 작게 변해 물속에 골고루 섞여 있기 때문이에요. 사라진 것이 아니에요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        mis = K.text_card([f"설탕이 물에 용해되면 가벼워질까요?  →  {r('아니요')}",
                           f"용해 전과 후의 무게는 {g('변하지 않아요')}."], w=11.0, size=34).move_to([0, -1.55, 0])
        self.say("설탕이 물에 용해되면 가벼워질까요?",
                 "설탕이 물에 용해되면 가벼워질까요? 아니요, 설탕이 보이지 않아도 용해 전과 후의 무게는 변하지 않아요.")
        self.play(FadeIn(mis, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 더 생각해요: 오차 ──
    def error(self):
        self.section("더 생각해요")
        t = M(f"4모둠: 용해되기 전 {o('91.6 g')}, 용해된 후 {r('91.3 g')}", 40).move_to([0, 2.35, 0])
        sub = T("(이 자료에서 정한 값)", 26, SOFT).next_to(t, DOWN, buff=0.12)
        self.say("값이 다르게 나온 모둠이 있어요. 까닭은 무엇일까요?",
                 "값이 다르게 나온 모둠이 있어요. 오차가 생길 수 있는 까닭은 무엇일까요?")
        self.play(FadeIn(t), FadeIn(sub), run_time=0.6)
        opts = [("각설탕이 부서져 가루가 유리병 밖으로 떨어졌어요", True), ("각설탕을 넣을 때 물이 유리병 밖으로 튀었어요", True),
                ("설탕이 녹아서 사라졌어요", False), ("용해 후에 페트리 접시를 함께 올렸어요", False)]
        cards = VGroup(*[K.word_card(s_, 9.6, 0.78, INK, 30) for s_, _ in opts]).arrange(DOWN, buff=0.2).move_to([0, -0.3, 0])
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=0.9)
        self.pause_screen(5, "까닭 두 가지를 골라 보세요")
        marks = VGroup(*[K.ox_mark(ok, 0.26).next_to(c, LEFT, buff=0.25) for c, (_, ok) in zip(cards, opts)])
        self.say(f"가루가 {r('떨어지거나')} 물이 {r('튀면')} 오차가 생겨요",
                 "각설탕이 부서져 가루가 떨어지거나, 넣을 때 물이 튀면 오차가 생겨요. 이럴 때는 까닭을 생각해 보고 다시 실험해요.")
        self.play(FadeIn(marks, lag_ratio=0.15), run_time=0.8)
        self.settle()
        clear_stage(self)
        # 용액의 무게
        a = K.word_card("가루 바이타민 10 g", 4.3, 1.0, ORANGE, 34)
        p_ = T("+", 60, INK)
        b_ = K.word_card("물 90 g", 3.0, 1.0, "#2F6FD6", 34)
        e_ = T("=", 60, INK)
        c_ = K.word_card("용액 ? g", 3.2, 1.0, GREEN, 34)
        row = VGroup(a, p_, b_, e_, c_).arrange(RIGHT, buff=0.3).move_to([0, 1.2, 0])
        self.say("가루 바이타민 10 g을 물 90 g에 녹이면 용액은 몇 g일까요?",
                 "가루 바이타민 10그램을 물 90그램에 완전히 녹인 용액의 무게는 몇 그램일까요?")
        self.play(FadeIn(row, lag_ratio=0.15), run_time=0.8)
        self.pause_screen(4, "용액의 무게는 몇 g일까요?")
        c2 = K.word_card("용액 100 g", 3.2, 1.0, GREEN, 34).move_to(c_)
        rule = M(f"용액의 무게 = {o('용질의 무게')} + {b_c('용매의 무게')}", 40).move_to([0, -0.7, 0])
        self.say(f"10 g + 90 g = {g('100 g')}",
                 "용액의 무게는 용질의 무게와 용매의 무게를 더한 것이에요. 10그램 더하기 90그램은 100그램이에요.")
        self.play(Transform(c_, c2), FadeIn(rule, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"각설탕이 물에 용해되기 전과 용해된 후의", f"무게는 {o('같습니다')}."],
                           w=11.5, size=42).move_to([0, 0.9, 0])
        self.say(f"용해되기 전과 용해된 후의 무게는 {o('같아요')}",
                 "각설탕이 물에 용해되기 전과 용해된 후의 무게는 같아요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


def b_c(s):
    return f'<span foreground="#2F6FD6">{s}</span>'
