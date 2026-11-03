"""「과학 원리 돋보기」 6학년 10화 — 같은 거리를 이동한 시간으로 빠르기 비교 (6-1 2단원 물체의 운동 4차시, 화 코드 6-1-2-d)

바탕: grade6/science/sem1/u2-4.html(원본 _build_tb/src/u2-4.html) — 도입(수영 경기 순위: 출발선에서 결승선까지 걸린 시간이 짧은 순서),
실험(태엽 자동차가 같은 거리 100 cm를 이동하는 데 걸린 시간, 한 대씩 출발, 앞부분이 결승선에 닿는 순간 멈춤: 초록색 4.2초, 노란색 5.8초 —
앱 스크립트 CARS), 50 m 달리기(8초 1위·9초 2위·10초 3위), 걸린 시간을 비교하는 운동 종목(조정·쇼트트랙·봅슬레이·100 m 달리기·알파인 스키 /
스포츠 클라이밍 리드·양궁·높이뛰기), 형성 평가(100 m 달리기 ㈎ 17초 ㈏ 20초 ㈐ 18초 ㈑ 19초, '걸린 시간이 길수록 빠르다'는 ×), 한눈에 쏙(짧을수록).
화면에서는 ㈎㈏㈐㈑ 대신 ㉮㉯㉰㉱ 글자를 씀(글꼴).
최종: ./make_final.sh s6ep10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Line, DashedLine,
                   SurroundingRectangle, ValueTracker, always_redraw, Rectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, person
import kit_s6u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def swimmer(cap):
    return VGroup(K.E(0.9, 0.28, "#F1C7A1", 0, 0, sw=2), K.C(0.17, cap, 0.5, 0, sw=2),
                  K.smooth([(-0.15, 0.1), (0.15, 0.32), (0.45, 0.2)], "#F1C7A1", 8))


class S6Ep10(EpisodeScene):
    GRADE, SEM = 6, 1
    EP_NO = 10
    EP_TITLE = "같은 거리를 이동한 시간으로 빠르기 비교"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.run50()
        self.sports()
        self.misc()
        self.summary()
        self.closing(f"같은 거리를 이동한 물체는\n걸린 시간이 {o('짧을수록')} 더 빨라요",
                     next_preview="6학년 11화 · 속력")
        self.wait(0.5)

    # ── 궁금해요: 수영 경기 ──
    def intro(self):
        self.section("궁금해요")
        pool = K.R(12.4, 4.2, "#4FB3E0", 0, 0.45, stroke=None)
        ends = VGroup(K.R(0.5, 4.2, "#E9EEF2", -6.0, 0.45, stroke=None), K.R(0.5, 4.2, "#E9EEF2", 6.0, 0.45, stroke=None))
        lanes = VGroup(*[DashedLine([-5.75, 0.45 - 2.1 + k * 1.05, 0], [5.75, 0.45 - 2.1 + k * 1.05, 0], stroke_color=PAPER,
                                    stroke_width=4, dash_length=0.2) for k in range(1, 4)])
        st = T("출발", 26).move_to([-6.0, 2.85, 0])
        fi = T("결승", 26).move_to([6.0, 2.85, 0])
        caps = ["#E2573F", "#FFD23F", "#2ECC71", "#8E44AD"]
        sws = VGroup(*[swimmer(c).move_to([-5.0, 0.45 + 1.575 - k * 1.05, 0]) for k, c in enumerate(caps)])
        self.say("수영 경기는 순위를 어떻게 정할까요?", "수영 경기는 순위를 어떻게 결정할까요?")
        self.play(FadeIn(VGroup(pool, ends, lanes, st, fi)), FadeIn(sws), run_time=0.8)
        ends_x = [4.9, 5.5, 5.2, 4.6]
        self.play(*[s_.animate.move_to([x, s_.get_y(), 0]) for s_, x in zip(sws, ends_x)], run_time=2.5, rate_func=lambda t: t)
        self.settle()
        card = K.text_card([f"출발선에서 결승선까지 {o('걸린 시간')}이 {g('짧은 순서')}대로 정해요"], size=36).move_to([0, -2.2, 0])
        self.say(f"같은 거리를 헤엄쳐 {o('걸린 시간')}이 {g('짧은 순서')}로 정해요",
                 "선수들은 모두 같은 거리를 헤엄쳐요. 그래서 출발선에서 결승선까지 이동하는 데 걸린 시간이 짧은 순서대로 순위를 정해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 실험해요 ──
    def experiment(self):
        self.section("실험해요")
        x0, pc = -5.2, 0.092
        xf = x0 + 100 * pc
        floor = K.R(13.0, 3.0, "#EFE6D6", 0, 0.0, rad=0.12, stroke=SOFT, sw=3)
        sl = Line([x0, -1.2, 0], [x0, 1.2, 0], stroke_color="#2E86C1", stroke_width=8)
        fl = Line([xf, -1.2, 0], [xf, 1.2, 0], stroke_color=RED, stroke_width=8)
        slt = T("출발선", 26, "#1C6FA8").next_to(sl, UP, buff=0.12)
        flt = T("결승선", 26, RED).next_to(fl, UP, buff=0.12)
        dist = VGroup(K.arrow_lr(x0, xf, -1.85, INK, 5), K.arrow_lr(xf, x0, -1.85, INK, 5),
                      K.label("100 cm", INK, 28).move_to([(x0 + xf) / 2, -1.85, 0]))
        sw = K.stopwatch(0.7).move_to([5.75, 1.85, 0])
        tt = ValueTracker(0.0)
        disp = always_redraw(lambda: T(f"{tt.get_value():.1f}초", 32, INK).move_to(sw.disp))
        self.say(f"같은 거리 {o('100 cm')}를 이동하는 데 걸린 시간을 재요",
                 "이번에는 태엽 자동차가 같은 거리, 100 센티미터를 이동하는 데 걸린 시간을 재요.")
        self.play(FadeIn(VGroup(floor, sl, fl, slt, flt, dist)), FadeIn(sw), FadeIn(disp), run_time=0.8)
        self.settle()
        self.say(f"앞부분이 결승선에 {o('닿는 순간')} 초시계를 멈춰요",
                 "초시계를 든 친구가 출발을 외치며 시작 단추를 누르고, 자동차 앞부분이 결승선에 닿는 순간 멈춤 단추를 눌러요. 정확하게 재려고 자동차를 한 대씩 출발시켜요.")
        self.settle()
        res = {}
        for name, col, T_, y in (("초록색", K.CAR_GREEN, 4.2, 0.0), ("노란색", K.CAR_YEL, 5.8, 0.0)):
            car = K.car_top(col, 1.1).shift([x0, y, 0])
            self.play(FadeIn(car), tt.animate.set_value(0.0), run_time=0.4)
            self.play(car.animate.shift(RIGHT * 100 * pc), tt.animate.set_value(T_), run_time=T_, rate_func=lambda t: t)
            res[name] = K.label(f"{name}: {T_}초", INK, 30)
            self.play(FadeOut(car), run_time=0.4)
            if name == "초록색":
                res[name].move_to([0, 2.55, 0]).shift(LEFT * 2.0)
                self.add(res[name])
                self.say("다음은 노란색 자동차예요", "초록색 자동차를 쟀어요. 다음은 노란색 자동차예요.")
            else:
                res[name].move_to([0, 2.55, 0]).shift(RIGHT * 2.0)
                self.add(res[name])
        self.settle()
        self.pause_screen(5, "어느 자동차가 더 빠를까요?")
        self.remove(disp)
        clear_stage(self)
        tab = K.result_table(["태엽 자동차", "초록색 자동차", "노란색 자동차"],
                             [["100 cm 이동하는 데 걸린 시간(초)", "4.2", "5.8"]], [5.4, 3.0, 3.0], row_h=0.95, size=32).move_to([0, 1.2, 0])
        hl = SurroundingRectangle(tab.cells[1][1], color=ORANGE, buff=0.16, stroke_width=6)
        ans = K.text_card([f"{o('초록색 자동차')}가 더 빨라요.", f"결승선까지 이동하는 데 걸린 시간이 {g('더 짧기')} 때문이에요."],
                          size=36).move_to([0, -1.2, 0])
        self.say(f"초록색 {o('4.2초')}, 노란색 {o('5.8초')} — 어느 것이 빠를까요?",
                 "초록색 자동차는 4.2초, 노란색 자동차는 5.8초 걸렸어요.")
        self.play(FadeIn(tab), run_time=0.6)
        self.settle()
        self.say(f"같은 거리를 {g('더 짧은 시간')}에 간 초록색이 빨라요",
                 "초록색 자동차가 더 빨라요. 같은 거리를 이동하는 데 걸린 시간이 더 짧기 때문이에요.")
        self.play(Create(hl), FadeIn(ans, shift=UP * 0.2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 더 알아보기: 50 m 달리기 ──
    def run50(self):
        self.section("더 알아보기")
        x0, xf = -5.2, 4.0
        track = K.R(12.6, 3.9, "#C86B4A", 0, 0.45, stroke=None)
        ls = VGroup(*[Line([-6.3, 0.45 - 1.95 + k * 1.3, 0], [6.3, 0.45 - 1.95 + k * 1.3, 0], stroke_color=PAPER, stroke_width=4)
                      for k in range(4)])
        sl = Line([x0, -1.5, 0], [x0, 2.4, 0], stroke_color=PAPER, stroke_width=7)
        fl = Line([xf, -1.5, 0], [xf, 2.4, 0], stroke_color=PAPER, stroke_width=7)
        lab = VGroup(T("출발", 26).next_to(sl, UP, buff=0.1), T("도착(50 m)", 26).next_to(fl, UP, buff=0.1))
        R_ = [(10, "#8E44AD"), (8, RED), (9, "#2E86C1")]
        runners = VGroup()
        ys = [1.45, 0.15, -1.15]
        for (t_, c), y in zip(R_, ys):
            p = person(1.0, c).move_to([x0, y, 0])
            runners.add(p)
        self.say(f"친구들이 {o('50 m')}를 달렸어요", "세 친구가 같은 50 미터를 달렸어요. 2배로 빨리 감아 보여 줘요.")
        self.play(FadeIn(VGroup(track, ls, sl, fl, lab)), FadeIn(runners), run_time=0.7)
        anims = []
        tags = VGroup()
        rank = {8: 1, 9: 2, 10: 3}
        for (t_, c), p, y in zip(R_, runners, ys):
            tags.add(K.label(f"{rank[t_]}위 · {t_}초", INK, 26).move_to([5.45, y, 0]))
        # 2배 빨리: 8초 → 4초 …
        tv = ValueTracker(0.0)
        for (t_, c), p, y in zip(R_, runners, ys):
            p.add_updater(lambda m, t_=t_, y=y: m.move_to([x0 + (xf - x0) * min(1.0, 2 * tv.get_value() / t_), y, 0]))
        clk = always_redraw(lambda: T(f"{2 * tv.get_value():.1f}초", 28, INK).move_to([-5.6, -1.85, 0]))
        self.add(clk)
        self.play(tv.animate.set_value(5.0), run_time=5.0, rate_func=lambda t: t)
        for p in runners:
            p.clear_updaters()
        self.play(FadeIn(tags[1]), run_time=0.3)
        self.play(FadeIn(tags[2]), run_time=0.3)
        self.play(FadeIn(tags[0]), run_time=0.3)
        self.settle()
        self.say(f"1위는 50 m를 {g('가장 짧은 시간(8초)')}에 달렸어요",
                 "1위를 한 친구가 가장 빠르다고 말할 수 있는 까닭은 50 미터를 이동하는 데 걸린 시간이 8초로 가장 짧기 때문이에요.")
        self.play(Indicate(tags[1], color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생활 속: 운동 종목 ──
    def sports(self):
        self.section("생활 속에서")
        yes = ["조정", "쇼트트랙", "봅슬레이", "100 m 달리기", "알파인 스키"]
        no = ["스포츠 클라이밍 리드", "양궁", "높이뛰기"]
        b1 = K.bin_box("걸린 시간을 비교해요", 6.2, 4.6, ORANGE).move_to([-3.25, 0.15, 0])
        b2 = K.bin_box("아니에요", 6.2, 4.6, BLUE).move_to([3.25, 0.15, 0])
        c1 = VGroup(*[K.word_card(t, 4.4, 0.62, size=30) for t in yes]).arrange(DOWN, buff=0.14).move_to([-3.25, -0.1, 0])
        c2 = VGroup(*[K.word_card(t, 4.4, 0.62, size=30) for t in no]).arrange(DOWN, buff=0.14).move_to([3.25, 0.3, 0])
        self.say("같은 거리를 이동한 시간을 비교하는 운동 종목은?",
                 "같은 거리를 이동하는 데 걸린 시간을 비교하는 운동 종목을 찾아봐요.")
        self.play(FadeIn(b1), FadeIn(b2), run_time=0.5)
        self.play(FadeIn(c1, lag_ratio=0.2), run_time=1.2)
        self.settle()
        self.say("양궁은 점수, 높이뛰기는 높이로 겨뤄요",
                 "조정, 쇼트트랙, 봅슬레이, 100 미터 달리기, 알파인 스키는 걸린 시간으로 겨뤄요. 양궁은 과녁을 맞힌 점수로, 높이뛰기는 높이로, 스포츠 클라이밍 리드는 정해진 시간 동안 얼마나 높이 오르는지로 겨뤄요.")
        self.play(FadeIn(c2, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)
        tab = K.result_table(["선수", "㉮", "㉯", "㉰", "㉱"], [["100 m 달리기 걸린 시간(초)", "17", "20", "18", "19"]],
                             [5.2, 1.6, 1.6, 1.6, 1.6], row_h=0.95, size=34).move_to([0, 1.3, 0])
        self.say("가장 빠른 선수와 가장 느린 선수는?",
                 "100 미터 달리기에서 선수들이 걸린 시간이에요. 가장 빠른 선수와 가장 느린 선수는 누구일까요?")
        self.play(FadeIn(tab), run_time=0.6)
        self.settle()
        h1 = SurroundingRectangle(VGroup(tab.cells[0][1], tab.cells[1][1]), color=GREEN, buff=0.1, stroke_width=6)
        h2 = SurroundingRectangle(VGroup(tab.cells[0][2], tab.cells[1][2]), color=RED, buff=0.1, stroke_width=6)
        ans = M(f"가장 빠른 선수 {g('㉮(17초)')} · 가장 느린 선수 {r('㉯(20초)')}", 38).move_to([0, -0.8, 0])
        self.say(f"걸린 시간이 가장 짧은 {g('㉮')}가 가장 빨라요",
                 "같은 100 미터를 달리는 데 걸린 시간이 17초로 가장 짧은 가 선수가 가장 빠르고, 20초로 가장 긴 나 선수가 가장 느려요.")
        self.play(Create(h1), Create(h2), FadeIn(ans), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        q = K.text_card(["같은 거리를 이동한 물체는", "걸린 시간이 길수록 더 빠르다?"], size=42).move_to([0, 1.3, 0])
        self.say("같은 거리를 이동한 물체는 걸린 시간이 길수록 빠를까요?",
                 "같은 거리를 이동한 물체는 걸린 시간이 길수록 더 빠를까요?")
        self.play(FadeIn(q), run_time=0.6)
        self.settle()
        xm = K.ox_mark(False, 0.5).next_to(q, RIGHT, buff=0.3)
        a = M(f"아니에요! 걸린 시간이 {g('짧을수록')} 더 빨라요", 42).move_to([0, -1.0, 0])
        self.say(f"아니요, 걸린 시간이 {g('짧을수록')} 빨라요",
                 "아니에요. 같은 거리를 이동한 물체는 걸린 시간이 짧을수록 더 빨라요. 시간이 오래 걸렸다는 것은 느리다는 뜻이에요.")
        self.play(Create(xm), FadeIn(a, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        rows = VGroup(M(f"초록색 자동차  100 cm · {g('4.2초')}", 36), M(f"노란색 자동차  100 cm · {r('5.8초')}", 36)
                      ).arrange(DOWN, buff=0.3, aligned_edge=LEFT).move_to([0, 1.4, 0])
        card = K.text_card([f"같은 거리를 이동한 물체는", f"걸린 시간이 {o('짧을수록')} 더 빠릅니다."], w=10.6, size=40).move_to([0, -1.0, 0])
        self.say(f"같은 거리를 이동한 물체는 걸린 시간이 {o('짧을수록')} 빨라요")
        self.play(FadeIn(rows), run_time=0.5)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
