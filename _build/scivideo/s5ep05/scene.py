"""「과학 원리 돋보기」 5학년 5화 — 화석은 어떻게 만들어질까? (5-1 1단원 지층과 화석 6~7차시, 화 코드 5-1-1-e)

바탕: grade5/science/sem1/u1-5.html(원본 _build_tb/src/u1-5.html) — 도입(기념 손 찍기: 반죽을 눌러 생긴 자국을 굳힘),
화석 모형 만들기(① 비닐봉지에 찰흙 ② 조개껍데기를 눌렀다 떼기 ③ 물 붓기 ④ 석고 가루 ⑤ 굳으면 꺼내기 ⑥ 떼어 관찰: 찰흙 오목한 자국·석고 볼록한 조개 모양,
둘 다 화석 모형), 질문 2개(떼는 까닭·석고 = 운반된 퇴적물), 석고 굳는 데 약 15분, 모형과 실제 비교·잇기,
화석이 만들어지는 과정 ①~⑤, 생각+(화석이 되기 쉬운 경우), 한눈에 쏙(퇴적물이 빠르게 쌓여).
최종: ./make_final.sh s5ep05
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Arrow, Line, Dot, GrowFromEdge)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u11 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep05(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 5
    EP_TITLE = "화석은 어떻게 만들어질까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.model()
        self.compare()
        self.process()
        self.easy()
        self.summary()
        self.closing(f"생물의 몸체나 흔적 위로 {o('퇴적물')}이 빠르게 쌓여\n지층 속 생물은 {g('화석')}이 돼요",
                     next_preview="5학년 6화 · 화석이 알려 주는 비밀")
        self.wait(0.5)

    # ── 궁금해요: 손 찍기 ──
    def intro(self):
        self.section("궁금해요")
        d0 = K.hand_dough(0).scale(1.3).move_to([0, 0.4, 0])
        d1 = K.hand_dough(1).scale(1.3).move_to([0, 0.4, 0])
        self.say("기념 손 찍기는 어떻게 만들까요?", "기념 손 찍기는 어떻게 만들까요?")
        self.play(FadeIn(d0), run_time=0.6)
        self.play(FadeOut(d0), FadeIn(d1), run_time=0.8)
        self.say(f"반죽을 손으로 눌러 생긴 {o('자국')}을 굳혀요",
                 "부드러운 반죽을 손으로 눌러 생긴 자국을 굳혀요. 화석도 이와 비슷하게 만들어질까요?")
        self.settle()
        clear_stage(self)

    # ── 실험해요: 화석 모형 ──
    def model(self):
        self.section("실험해요")
        cx, by = -2.2, -1.2
        bw = K.bowl(5.0, 2.4).move_to([cx, by + 1.2, 0])
        bl = T("투명한 그릇", 26).next_to(bw, DOWN, buff=0.15)
        clay = K.clay_layer(4.2, 0.6).move_to([cx, by + 0.35, 0])
        steps = VGroup(*[T(s, 28) for s in ("① 비닐봉지에 찰흙 넣기", "② 조개껍데기를 눌렀다 떼기", "③ 물 붓기",
                                              "④ 석고 가루 넣기", "⑤ 굳으면 꺼내기", "⑥ 떼어 내어 관찰하기")])
        steps.arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([4.4, 0.4, 0])
        steps.set_opacity(0.35)
        self.say("화석 모형을 만들어 봐요", "화석 모형을 만들어 봐요. 가상 실험으로 차례대로 해 볼게요.")
        self.play(Create(bw), FadeIn(bl), FadeIn(steps), run_time=0.8)

        def on(i):
            return steps[i].animate.set_opacity(1).set_color(self.accent)

        self.say(f"① 비닐봉지를 펴고 {o('찰흙')}을 평평하게 넣어요", "그릇에 비닐봉지를 펴고 찰흙을 넣어 평평하게 펴요.")
        self.play(FadeIn(clay, shift=DOWN * 0.3), on(0), run_time=0.7)
        shell = K._shell("#F2E6CF", 1.0).move_to([cx, by + 1.8, 0])
        self.say(f"② 조개껍데기를 눌렀다가 {o('떼어 내요')}", "조개껍데기를 찰흙에 눌렀다가 떼어 내요.")
        self.play(FadeIn(shell), on(1), run_time=0.5)
        self.play(shell.animate.move_to([cx, by + 0.45, 0]), run_time=0.7)
        mark = K._shell("#7A5638", 0.9).set_stroke(color="#5E4834").stretch(0.45, 1).move_to([cx, by + 0.45, 0])
        self.add(mark)
        self.play(shell.animate.move_to([cx + 1.2, by + 2.0, 0]), run_time=0.7)
        self.play(FadeOut(shell), run_time=0.3)
        self.pause_screen(5, "조개껍데기를 떼어 내는 까닭은?")
        self.say(f"자연에서는 오랜 시간이 지나면 껍데기가 없어지고 {o('흔적')}이 남아요",
                 "자연에서는 오랜 시간이 지나면 조개껍데기가 없어지고 흔적이 남기 때문이에요.")
        self.settle()
        water = K.rect(4.2, 0.55, K.WATER, x=cx, y=by + 0.92, stroke=K.WATER, sw=0, op=0.8)
        self.say(f"③ 자국이 모두 덮이도록 {o('물')}을 부어요", "조개껍데기 자국이 모두 덮이도록 물을 부어요.")
        self.play(GrowFromEdge(water, DOWN), on(2), run_time=0.7)
        plaster = K.rect(4.2, 0.65, K.PLASTER, x=cx, y=by + 0.97, stroke="#AAAAAA", sw=3)
        self.say(f"④ 물 표면이 보이지 않을 정도로 {o('석고 가루')}를 넣어요",
                 "물 표면이 보이지 않을 정도로 석고 가루를 넣어요. 보안경과 실험용 장갑을 껴요.")
        self.play(FadeIn(plaster, shift=DOWN * 0.4), FadeOut(water), on(3), run_time=0.8)
        self.pause_screen(5, "석고 가루는 무엇을 나타낼까요?")
        self.say(f"석고 가루는 물에 의해 운반된 {g('퇴적물')}을 나타내요",
                 "석고 가루는 물에 의해 운반된 퇴적물을 나타내요.")
        self.settle()
        ck = VGroup(K.clock(0.38), T("약 15분", 28)).arrange(RIGHT, buff=0.15).move_to([cx, by + 2.5, 0])
        self.say(f"⑤ 석고가 굳으면 비닐봉지째 들어 올려 {o('꺼내요')}",
                 "석고가 굳는 데는 약 십오 분이 걸려요. 석고가 굳으면 비닐봉지째 들어 올려 꺼내요.")
        self.play(FadeIn(ck), on(4), run_time=0.5)
        self.play(VGroup(clay, mark, plaster).animate.shift(UP * 0.6), FadeOut(bw), FadeOut(bl), run_time=0.8)
        self.play(FadeOut(ck), run_time=0.3)
        # ⑥ 떼어 내어 관찰
        left = VGroup(K.clay_layer(2.8, 0.7), K._shell("#7A5638", 0.9).set_stroke(color="#5E4834").stretch(0.45, 1)).move_to([cx - 2.0, 0.2, 0])
        right = VGroup(K.rect(2.8, 0.55, K.PLASTER, stroke="#AAAAAA", sw=3),
                       K._shell("#FFFFFF", 0.9).set_stroke(color="#8D8D8D")).move_to([cx + 1.9, 0.6, 0])
        right[1].move_to(right[0].get_top() + UP * 0.25)
        self.play(FadeOut(VGroup(clay, mark, plaster)), FadeIn(left), FadeIn(right), on(5), run_time=0.8)
        l1 = T("찰흙: 오목한 자국", 26).move_to([left.get_x(), -0.55, 0])
        l2 = T("석고: 볼록한 조개 모양", 26).move_to([right.get_x(), -0.55, 0])
        self.say(f"⑥ 찰흙에는 {o('오목한 자국')}, 석고는 {o('볼록한 조개 모양')}이에요",
                 "찰흙과 석고를 떼어 내요. 찰흙에는 오목한 자국이, 석고는 볼록한 조개 모양이 생겼어요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.say(f"찰흙의 자국과 석고 조개 모양은 {g('둘 다 화석 모형')}이에요",
                 "찰흙에 찍힌 자국과 석고로 만든 조개껍데기는 둘 다 화석 모형이에요.")
        self.settle()
        clear_stage(self)

    # ── 모형과 실제 ──
    def compare(self):
        self.section("모형 ↔ 실제")
        pairs = [("찰흙에 남은 조개껍데기 자국", "무른 땅에 남은 생물의 흔적"),
                 ("자국 위로 붓는 물과 석고 가루", "생물의 흔적 위로 쌓이는 퇴적물"),
                 ("굳은 석고를 비닐봉지째 꺼내기", "화석이 있는 지층이 발견되는 것"),
                 ("찰흙의 자국과 석고 조개껍데기", "지층 속에 묻힌 생물이 화석이 된 것")]
        hd = VGroup(K.label("화석 모형", BLUE, 32), K.label("실제 자연", "#8A5A14", 32))
        hd[0].move_to([-3.4, 2.5, 0])
        hd[1].move_to([3.4, 2.5, 0])
        rows = VGroup()
        for i, (a, b) in enumerate(pairs):
            y = 1.55 - i * 1.0
            ta = K.text_card([a], w=5.8, size=28).move_to([-3.4, y, 0])
            tb = K.text_card([b], w=5.8, size=28).move_to([3.4, y, 0])
            ar = Arrow([-0.45, y, 0], [0.45, y, 0], color=ORANGE, stroke_width=7, buff=0)
            rows.add(VGroup(ta, ar, tb))
        self.say("화석 모형으로 실제 화석이 만들어지는 과정을 추리해요",
                 "화석 모형을 만드는 과정으로 실제 화석이 만들어지는 과정을 추리해 봐요.")
        self.play(FadeIn(hd), run_time=0.5)
        narr = ["찰흙의 자국은 무른 땅에 남은 생물의 흔적,",
                "물과 석고 가루는 그 위로 쌓이는 퇴적물이에요.",
                "꺼내기는 화석이 있는 지층이 발견되는 것,",
                "자국과 석고 조개껍데기는 화석이 된 것을 나타내요."]
        subs = ["찰흙의 자국 → 생물의 흔적, 물과 석고 가루 → 퇴적물", "꺼내기 → 지층이 발견됨, 자국과 석고 조개 → 화석"]
        for i in range(2):
            self.say(subs[i], narr[2 * i] + " " + narr[2 * i + 1])
            self.play(FadeIn(rows[2 * i], shift=RIGHT * 0.2), run_time=0.5)
            self.play(FadeIn(rows[2 * i + 1], shift=RIGHT * 0.2), run_time=0.5)
        self.settle()
        self.play(FadeOut(rows), run_time=0.4)
        same = K.text_card([f"{g('공통점')}: 생김새(모양과 무늬)가 비슷해요"], w=12, size=32).move_to([0, 1.3, 0])
        diff = K.text_card([f"{r('차이점')}: 색깔이 서로 달라요",
                            "모형은 금방 만들지만, 실제 화석은 오랜 시간이 걸려요",
                            "모형은 실내에서, 실제 화석은 자연환경에서 만들어져요"], w=12, size=30).move_to([0, -0.6, 0])
        self.say(f"모형과 실제 화석은 {g('생김새')}가 비슷해요",
                 "모형과 실제 조개 화석은 모양과 무늬가 비슷해요.")
        self.play(FadeIn(same), run_time=0.5)
        self.say(f"실제 화석은 자연에서 {o('오랜 시간')}에 걸쳐 만들어져요",
                 "하지만 색깔이 달라요. 실제 화석은 자연환경에서 오랜 시간에 걸쳐 만들어져요.")
        self.play(FadeIn(diff), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 화석이 만들어지는 과정 ──
    def process(self):
        self.section("만들어지는 과정")
        steps = [("① 가라앉음", "생물의 몸체나 흔적이 바다나 호수에 가라앉아요",
                  "실제 화석은 이렇게 만들어져요. 먼저 생물의 몸체나 흔적 등이 바다나 호수에 가라앉아요."),
                 ("② 빠르게 쌓임", f"그 위로 {o('퇴적물')}이 빠르게 쌓여요", "그 위로 퇴적물이 빠르게 쌓여요."),
                 ("③ 화석이 됨", f"지층이 만들어지고, 지층 속 생물은 {g('화석')}이 돼요",
                  "오랜 시간에 걸쳐 퇴적물이 계속 쌓여 지층이 만들어지고, 지층 속 생물은 화석이 돼요."),
                 ("④ 깎임", "물 밖으로 드러난 지층이 점점 깎여요", "물 밖으로 드러난 지층이 점점 깎여요."),
                 ("⑤ 발견", "지층이 더 깎이면서 화석이 발견돼요",
                  "지층이 더 많이 깎이면서 지층 속에 있던 화석이 발견돼요.")]
        cur = None
        for i, (tag, sub, narr) in enumerate(steps):
            pic = K.fossil_section(i + 1).scale(1.0).move_to([0, 0.3, 0])
            lab = K.label(tag, self.accent, 32).move_to(pic.get_corner(UP + LEFT) + np.array([1.25, -0.45, 0]))
            extra = VGroup()
            if i == 2:
                extra = VGroup(K.clock(0.38), T("오랜 시간", 28)).arrange(RIGHT, buff=0.15).move_to([2.6, 1.9, 0])
            if i == 4:
                ring = K.Circle(radius=0.75, stroke_color=RED, stroke_width=7).move_to(pic.fish)
                extra = ring
            new = VGroup(pic, lab, extra)
            self.say(sub, narr)
            if cur is None:
                self.play(FadeIn(new), run_time=0.8)
            else:
                self.play(FadeOut(cur), FadeIn(new), run_time=0.9)
            cur = new
        self.say(f"화석이 발견되기까지는 {o('오랜 시간')}이 걸려요",
                 "화석이 만들어져 우리에게 발견되기까지는 오랜 시간이 걸려요.")
        self.settle()
        clear_stage(self)

    # ── 생각+: 화석이 되기 쉬운 경우 ──
    def easy(self):
        self.section("생각+")
        items = [("퇴적물이 빠르게 쌓일 때", True), ("뼈, 이빨, 껍데기처럼 단단한 부분", True),
                 ("줄기, 잎처럼 질긴 부분", True), ("죽은 생물이 오랫동안 땅 위에 드러나 있을 때", False)]
        rows = VGroup()
        for t, ok in items:
            rows.add(VGroup(T(t, 32)).arrange(RIGHT))
        rows.arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to([0.3, 0.4, 0])
        marks = VGroup(*[K.ox_mark(ok, 0.28).next_to(rw, LEFT, buff=0.4) for rw, (t, ok) in zip(rows, items)])
        self.say("어떤 생물이 화석으로 만들어지기 쉬울까요?", "어떤 생물이 화석으로 만들어지기 쉬울까요?")
        self.play(FadeIn(rows, lag_ratio=0.15), run_time=0.9)
        self.pause_screen(5, "화석이 되기 쉬운 경우는?")
        self.say(f"퇴적물이 {o('빠르게')} 쌓이고, {o('단단하거나 질긴')} 부분이 있으면 쉬워요",
                 "퇴적물이 빠르게 쌓이고, 뼈나 껍데기처럼 단단하거나 줄기, 잎처럼 질긴 부분이 있으면 화석이 되기 쉬워요.")
        self.play(FadeIn(marks, lag_ratio=0.2), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        pic = K.fossil_section(3).scale(0.5).move_to([0, 1.55, 0])
        card = K.text_card([f"생물의 몸체나 흔적 위로 {o('퇴적물')}이 빠르게 쌓여 지층이 만들어지고,",
                            f"지층 속 생물은 {g('화석')}이 됩니다."], w=12.8, size=36).move_to([0, -1.0, 0])
        self.say(f"생물 위로 {o('퇴적물')}이 빠르게 쌓여 지층 속 생물은 {g('화석')}이 돼요",
                 "생물의 몸체나 흔적 위로 퇴적물이 빠르게 쌓여 지층이 만들어지고, 지층 속 생물은 화석이 돼요.")
        self.play(FadeIn(pic), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
