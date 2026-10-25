"""「과학 원리 돋보기」 5학년 20화 — 노폐물은 어떻게 나갈까? (5-1 4단원 우리 몸의 구조와 기능 6차시, 화 코드 5-1-4-e)

바탕: grade5/science/sem1/u4-5.html(원본 _build_tb/src/u4-5.html) — 도입(콩팥: 강낭콩 모양, 팥 색깔),
노폐물·배설·배설기관 뜻, O/X(똥을 누는 것은 배설이 아니라 배출), 배설기관(콩팥·오줌관·방광)의 생김새와 하는 일,
배설 경로(콩팥 → 오줌관 → 방광 → 몸 밖, 걸러진 혈액은 다시 온몸을 순환), 체험 더하기(식사·잠·소변 볼 때도 기관이 일함), 한눈에 쏙.
최종: ./make_final.sh s5ep20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker, always_redraw,
                   Dot, Ellipse, Arrow, LaggedStart, linear)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


KID = "#9b3c3c"
URI = "#a8842e"


class S5Ep20(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 20
    EP_TITLE = "노폐물은 어떻게 나갈까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.words()
        self.organs()
        self.route()
        self.together()
        self.summary()
        self.closing(f"{o('콩팥')}은 혈액 속의 노폐물을 걸러 내어 오줌을 만들고,\n오줌은 오줌관을 지나 {g('방광')}에 모였다가 몸 밖으로 나가요",
                     next_preview="5학년 21화 · 운동할 때 몸의 변화")
        self.wait(0.5)

    def acc(self, t):
        return f'<span foreground="{self.accent}">{t}</span>'

    # ── 궁금해요: 콩팥이라는 이름 ──
    def intro(self):
        self.section("궁금해요")
        kd = K.kidney_pic(1.5).move_to([-3.6, 0.4, 0])
        kt = T("콩팥", 36, KID).next_to(kd, DOWN, buff=0.25)
        self.say("우리 몸의 콩팥을 왜 콩팥이라고 부를까요?",
                 "우리 몸에는 콩팥이라는 기관이 있어요. 콩팥을 콩팥이라고 부르는 까닭은 무엇일까요?")
        self.play(FadeIn(kd), FadeIn(kt), run_time=0.7)
        self.pause_screen(5, "콩팥이라는 이름의 까닭은?")
        bn = K.bean("kidney", 1.6).move_to([1.4, 0.9, 0])
        rb = K.bean("red", 1.7).move_to([4.6, 0.9, 0])
        t1 = M(f"{o('강낭콩')}과 모양이 비슷", 32).next_to(bn, DOWN, buff=0.35)
        t2 = M(f"{o('팥')}과 색깔이 비슷", 32).next_to(rb, DOWN, buff=0.35)
        self.say(f"{o('강낭콩')}과 모양이, {o('팥')}과 색깔이 비슷해서예요",
                 "콩팥은 강낭콩처럼 생겼고, 팥처럼 탁한 붉은색이에요. 그래서 콩팥이라고 불러요.")
        self.play(FadeIn(bn), FadeIn(rb), FadeIn(t1), FadeIn(t2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 노폐물과 배설 ──
    def words(self):
        self.section("노폐물과 배설")
        d = K.text_card([f"영양소가 쓰이면서 생긴 몸에 필요 없는 것 → {o('노폐물')}",
                         f"노폐물을 걸러 내어 몸 밖으로 내보내는 과정 → {o('배설')}",
                         f"배설을 담당하는 기관 → {g('배설기관')}"], w=12.6, size=38).move_to([0, 1.3, 0])
        self.say(f"영양소가 쓰이면서 몸에 필요 없는 {o('노폐물')}이 만들어져요",
                 "우리 몸에서 영양소가 쓰이면서 몸에 필요 없는 노폐물이 만들어져요.")
        self.play(FadeIn(d[0]), FadeIn(d[1][0]), run_time=0.6)
        self.say(f"노폐물을 걸러 몸 밖으로 내보내는 것이 {o('배설')}이에요",
                 "노폐물을 걸러 내어 몸 밖으로 내보내는 과정을 배설이라 하고, 이를 담당하는 기관을 배설기관이라고 해요.")
        self.play(FadeIn(d[1][1]), FadeIn(d[1][2]), run_time=0.6)
        q = K.text_card(["똥을 누는 것도 배설이에요."], w=7.2, size=38).move_to([0.4, -1.3, 0])
        self.say("그렇다면 똥을 누는 것도 배설일까요?", "그렇다면 똥을 누는 것도 배설일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(4, "똥을 누는 것도 배설일까요?")
        x1 = K.ox_mark(False, 0.4).next_to(q, LEFT, buff=0.3)
        a = M(f"똥은 소화되고 남은 음식물 찌꺼기 → {o('배출')}이라고 해요", 32).move_to([0.4, -2.35, 0])
        self.say(f"아니에요. 똥을 내보내는 것은 {o('배출')}이라고 해요",
                 "아니에요. 똥은 소화되고 남은 음식물 찌꺼기라서, 똥을 내보내는 것은 배설이 아니라 배출이라고 해요.")
        self.play(Create(x1), FadeIn(a), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 배설기관 ──
    def organs(self):
        self.section("배설기관")
        b = K.body(K.EXCR, h=5.8).move_to([-3.7, 0.1, 0])
        self.say("배설기관에는 무엇이 있을까요?", "배설기관 모형을 관찰해 이름을 붙여 봐요.")
        self.play(FadeIn(b), run_time=0.6)
        P = lambda x, y: K.vpt(b, x, y)
        labs = {
            'kid': VGroup(K.pointer(P(116, 250), P(116, 250) + LEFT * 1.1 + UP * 0.4, "콩팥", KID, 32),
                          K.pointer(P(204, 246), P(204, 246) + RIGHT * 1.4 + UP * 0.4, "콩팥", KID, 32)),
            'ure': K.pointer(P(176, 284), P(176, 284) + RIGHT * 2.0 + DOWN * 0.05, "오줌관", URI, 32),
            'bla': K.pointer(P(170, 322), P(170, 322) + RIGHT * 1.9 + DOWN * 0.5, "방광", URI, 32),
        }
        items = [('kid', [f"{o('콩팥')}  강낭콩 모양, 등허리 좌우에 한 개씩", "혈액 속의 노폐물을 걸러 내어 오줌을 만들어요"],
                  f"{o('콩팥')}: 혈액 속의 노폐물을 걸러 내어 오줌을 만들어요",
                  "콩팥은 강낭콩 모양이고 등허리 좌우에 한 개씩 있어요. 혈액 속의 노폐물을 걸러 내어 오줌을 만들어요."),
                 ('ure', [f"{o('오줌관')}  두 개의 긴 관 모양", "오줌이 이동하는 통로예요"],
                  f"{o('오줌관')}: 오줌이 이동하는 통로예요",
                  "오줌관은 두 개의 긴 관 모양이에요. 오줌이 이동하는 통로예요."),
                 ('bla', [f"{o('방광')}  작은 공 모양, 오줌관에 연결", "오줌을 모아 두었다가 몸 밖으로 내보내요"],
                  f"{o('방광')}: 오줌을 모아 두었다가 몸 밖으로 내보내요",
                  "방광은 오줌관에 연결된 작은 공 모양이에요. 오줌을 모아 두었다가 몸 밖으로 내보내요.")]
        for i, (k, lines, sub, narr) in enumerate(items):
            card = K.text_card(lines, w=6.6, size=30).move_to([3.6, 2.0 - i * 1.65, 0])
            self.say(sub, narr)
            self.play(FadeIn(labs[k]), FadeIn(card, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 배설 경로 ──
    def route(self):
        self.section("배설 경로")
        kf = K.kidney_flow(h=5.0).move_to([-1.6, 0.25, 0])
        t = ValueTracker(0)
        lv = ValueTracker(0)
        run = {"uri": False}
        A = K.path_pts(kf, K.K_ART)
        V = K.path_pts(kf, K.K_VEN)
        U = K.path_pts(kf, K.K_URE)

        def dots():
            grp = VGroup()
            tv = t.get_value()
            for k in range(5):
                f = (tv * 0.25 + k / 5) % 1
                p = K.along(A, f)
                grp.add(Dot(p, radius=0.11, color="#ff6b5e").set_stroke(PAPER, 2),
                        Dot(p + np.array([0.09, 0.09, 0]), radius=0.06, color=K.WASTE))
                grp.add(Dot(K.along(V, f), radius=0.11, color="#6fa3e0").set_stroke(PAPER, 2))
            if run["uri"]:
                for k in range(3):
                    grp.add(Dot(K.along(U, (tv * 0.4 + k / 3) % 1), radius=0.07, color=K.WASTE))
            return grp
        dd = always_redraw(dots)
        fill = always_redraw(lambda: K.bladder_fill(kf, lv.get_value()))
        P = lambda x, y: K.vpt(kf, x, y)
        tx = VGroup(T("콩팥", 32, PAPER).move_to(P(180, 168)),
                    K.label("오줌관", URI, 28).move_to(P(250, 300)),
                    K.label("방광", URI, 28).move_to(P(440, 326)),
                    M(f"<span foreground='{K.ART}'>노폐물이 많은 혈액</span>", 26).move_to(P(380, 92)),
                    M(f"<span foreground='{K.VEN}'>노폐물이 걸러진 혈액</span>", 26).move_to(P(410, 232)))
        leg = VGroup(VGroup(Dot(radius=0.11, color="#ff6b5e"), Dot(radius=0.06, color=K.WASTE)).arrange(RIGHT, buff=0.02),
                     M(f"혈액 (<span foreground='{K.WASTE}'>노란 점</span>: 노폐물)", 26)).arrange(RIGHT, buff=0.15).move_to([3.4, 2.75, 0])
        self.say("혈액 속의 노폐물은 어떻게 몸 밖으로 나갈까요?",
                 "혈액 속의 노폐물은 어떻게 몸 밖으로 나갈까요? 노란 점이 노폐물이에요.")
        self.play(FadeIn(kf), FadeIn(fill), FadeIn(dd), FadeIn(tx), FadeIn(leg), run_time=0.8)
        self.play(t.animate.set_value(2), run_time=2.5, rate_func=linear)
        run["uri"] = True
        steps = VGroup(*[K.label(s, URI if i else KID, 28) for i, s in enumerate(["① 콩팥에서 노폐물을 걸러 오줌", "② 오줌관을 지나요",
                                                                                   "③ 방광에 모여요", "④ 몸 밖으로 나가요"])])
        steps.arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([4.9, 0.6, 0])
        self.say(f"{o('콩팥')}이 노폐물을 걸러 오줌을 만들고, 오줌은 오줌관을 지나요",
                 "혈액 속의 노폐물이 콩팥을 거치면서 걸러져 오줌이 돼요. 오줌은 오줌관을 지나요.")
        self.play(FadeIn(steps[0]), FadeIn(steps[1]), t.animate.set_value(5), lv.animate.set_value(0.5), run_time=3.5, rate_func=linear)
        self.say(f"오줌은 {o('방광')}에 모였다가 몸 밖으로 나가요",
                 "오줌은 방광에 모였다가, 방광이 가득 차면 몸 밖으로 나가요.")
        self.play(FadeIn(steps[2]), t.animate.set_value(7.5), lv.animate.set_value(1.0), run_time=2.5, rate_func=linear)
        run["uri"] = False
        drops = VGroup(*[Ellipse(width=0.08, height=0.16, fill_color="#f1cf62", fill_opacity=1, stroke_width=0).move_to(P(350, 362 + 12 * i))
                         for i in range(3)])
        self.play(FadeIn(steps[3]), lv.animate.set_value(0.0), FadeIn(drops), t.animate.set_value(8.5), run_time=1.4, rate_func=linear)
        self.play(FadeOut(drops), run_time=0.3)
        self.settle()
        q = K.text_card(["콩팥에서 노폐물이 걸러진 혈액은?", f"다시 혈관을 통해 {g('온몸을 순환')}해요"], w=6.6, size=32).move_to([3.4, -1.85, 0])
        self.say(f"노폐물이 걸러진 혈액은 다시 {g('온몸을 순환')}해요",
                 "콩팥에서 노폐물이 걸러진 혈액은 어떻게 될까요? 모두 오줌이 되는 것이 아니라, 깨끗해진 혈액은 콩팥에서 나와 혈관을 통해 다시 온몸을 순환해요.")
        self.play(FadeIn(q), t.animate.set_value(11), run_time=3.0, rate_func=linear)
        self.settle()
        dd.clear_updaters()
        fill.clear_updaters()
        clear_stage(self)

    # ── 체험 더하기 ──
    def together(self):
        self.section("체험 더하기")
        hd = T("여러 상황에서 우리 몸의 기관은?", 40, self.accent).move_to([0, 2.5, 0])
        cards = VGroup(
            K.text_card([self.acc("식사할 때"), "팔뼈와 팔 근육으로", "포크를 움직이고,", "얼굴 근육으로 씹어요"], w=4.2, size=30),
            K.text_card([self.acc("잠을 잘 때"), "잠을 자는 동안에도", "호흡해요.", "활동할 때보다 천천히"], w=4.2, size=30),
            K.text_card([self.acc("소변을 볼 때"), "그동안에도", "소화기관은 전에 먹은", "음식물을 소화해요"], w=4.2, size=30),
        ).arrange(RIGHT, buff=0.3).move_to([0, 0.35, 0])
        self.say("식사할 때, 잠잘 때, 소변을 볼 때 기관들은 무엇을 할까요?",
                 "식사를 할 때, 잠을 잘 때, 소변을 볼 때 우리 몸의 기관들은 무엇을 할까요?")
        self.play(FadeIn(hd), run_time=0.5)
        self.play(LaggedStart(*[FadeIn(c, shift=UP * 0.2) for c in cards], lag_ratio=0.4), run_time=1.6)
        self.say(f"우리 몸의 각 기관은 {g('쉬지 않고')} 일해요",
                 "식사를 하거나 잠을 잘 때도 우리 몸의 각 기관은 쉬지 않고 일해요. 우리 몸의 소중함을 느껴 봐요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        b = K.body(K.EXCR, h=5.4).move_to([-4.3, 0.15, 0])
        card = K.text_card(["배설기관에는 콩팥, 오줌관,", f"{o('방광')} 등이 있습니다.",
                            f"{g('콩팥')}은 혈액 속의 노폐물을", "걸러 내어 오줌을 만듭니다."], w=7.2, size=42).move_to([2.5, 0.4, 0])
        self.say(f"{g('콩팥')}은 혈액 속의 노폐물을 걸러 내어 오줌을 만들어요",
                 "배설기관에는 콩팥, 오줌관, 방광 등이 있어요. 콩팥은 혈액 속의 노폐물을 걸러 내어 오줌을 만들어요. 오줌은 오줌관을 지나 방광에 모였다가 몸 밖으로 나가요.")
        self.play(FadeIn(b), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
