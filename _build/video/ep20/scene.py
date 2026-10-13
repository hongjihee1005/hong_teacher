"""「수학 원리 돋보기」 20화 — 그림그래프는 어떻게 읽을까? (2학기 6단원 그림그래프 2·3차시, 화 코드 2-6-a)

좋아하는 과일(사과 24, 포도 31, 딸기 15, 참외 22): 큰 그림 10명·작은 그림 1명 → 읽기 → 표와 견주기
→ 붕어빵(그림 세 가지): 그림이 가장 긴 줄이 가장 많은 것은 아니에요
최종: ./make_final.sh 20
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from graph import UNITS2, UNITS3, picture_graph, split

FRUIT = [("사과", 24), ("포도", 31), ("딸기", 15), ("참외", 22)]
BUNG = [("고구마", 120), ("슈크림", 108), ("초코", 114), ("팥", 210)]


class Ep20(EpisodeScene):
    EP_NO = 20
    EP_TITLE = "그림그래프는 어떻게 읽을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.read()
        self.vs_table()
        self.three_units()
        self.closing(f"그림그래프는 먼저 {b('그림 하나가 얼마')}인지 보고 읽어요\n그림이 길다고 수가 가장 큰 것은 아니에요",
                     next_preview="21화 · 그림그래프로 나타내기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        pg = picture_graph("좋아하는 과일별 학생 수", FRUIT, UNITS2, "과일", "명", value_head="학생 수").move_to([0, 0.1, 0])
        self.say("좋아하는 과일을 조사해 그림으로 나타냈어요", "우리 학년 학생들이 좋아하는 과일을 조사해 그림으로 나타냈어요.")
        self.play(FadeIn(pg), run_time=1.0)
        self.say("그림의 크기가 왜 다를까요? 어떻게 읽을까요?", "그림의 크기가 서로 달라요. 이 그래프는 어떻게 읽을까요?")
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def read(self):
        self.section("그림그래프 읽기")
        pg = picture_graph("좋아하는 과일별 학생 수", FRUIT, UNITS2, "과일", "명", value_head="학생 수").move_to([-1.3, 0.1, 0])
        self.play(FadeIn(pg), run_time=0.6)
        self.say(f"먼저 그림 하나가 얼마인지: {b('큰 그림 10명')}, {o('작은 그림 1명')}", "먼저 그림 하나가 몇 명인지 봐요. 큰 그림은 10명, 작은 그림은 1명이에요.")
        self.play(Indicate(pg.legend, scale_factor=1.3), run_time=1.0)
        self.wait(0.6)
        side = VGroup()
        for i, (nm, v) in enumerate(FRUIT):
            big, small = split(v, UNITS2)
            row_y = pg.names[i].get_center()[1]
            lab = M(f"{b(str(big * 10))} + {o(str(small))} = {g(str(v))}명", 34).move_to([5.3, row_y, 0])
            side.add(lab)
            if i < 2:
                self.say(f"{nm}: 큰 그림 {b(str(big))}개, 작은 그림 {o(str(small))}개 → {g(str(v))}명",
                         f"{nm}는 큰 그림 {big}개, 작은 그림 {small}개. {big * 10} 더하기 {small}, {v}명이에요." if nm == "사과" else
                         f"{nm}는 큰 그림 {big}개, 작은 그림 {small}개, {v}명이에요.")
                self.play(Indicate(pg.icons[i], color=GREEN, scale_factor=1.15), FadeIn(lab), run_time=0.9)
                self.wait(0.6)
            else:
                self.play(FadeIn(lab), run_time=0.4)
        self.say(f"딸기 {g('15명')}, 참외 {g('22명')}", "딸기는 15명, 참외는 22명이에요.")
        self.wait(0.6)
        self.say(f"가장 많은 과일은 {g('포도')}", "큰 그림이 가장 많은 포도를 가장 많은 학생이 좋아해요.")
        bx = SurroundingRectangle(VGroup(pg.names[1], pg.icons[1]), color=GREEN, buff=0.08, stroke_width=6)
        self.play(Create(bx), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def vs_table(self):
        self.section("표와 견주기")
        pg = picture_graph("좋아하는 과일별 학생 수", FRUIT, UNITS2, "과일", "명", col2=5.0, size=34, value_head="학생 수").scale(0.8).move_to([-3.4, -0.1, 0])
        names = ["과일"] + [n for n, _ in FRUIT] + ["합계"]
        vals = ["학생 수(명)"] + [str(v) for _, v in FRUIT] + [str(sum(v for _, v in FRUIT))]
        tab = VGroup(*[VGroup(T(a, 28), T(c, 28)).arrange(DOWN, buff=0.3) for a, c in zip(names, vals)]).arrange(RIGHT, buff=0.28)
        tab.scale_to_fit_width(min(tab.width, 6.4)).move_to([3.5, 1.0, 0])
        tl = M("표", 40).next_to(tab, UP, buff=0.35)
        self.say("같은 자료를 표로도 나타냈어요", "같은 자료를 표로도 나타냈어요. 무엇이 같고 무엇이 다를까요?")
        self.play(FadeIn(pg), FadeIn(tab), FadeIn(tl), run_time=0.9)
        t1 = M(f"표: 정확한 수와 {b('합계')}를 알기 좋아요", 34)
        t2 = M(f"그림그래프: 많고 적음이 {o('한눈에')} 보여요", 34)
        for t, y in ((t1, -0.5), (t2, -1.3)):
            t.scale_to_fit_width(min(t.width, 6.4)).move_to([3.5, y, 0])
        self.say(f"표는 {b('정확한 수와 합계')}를 알기 좋아요", "표는 수를 숫자로 나타내서 정확한 수와 합계를 알기 좋아요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.say(f"그림그래프는 많고 적음이 {o('한눈에')}", "그림그래프는 수를 그림으로 나타내서 많고 적음을 한눈에 볼 수 있어요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def three_units(self):
        self.section("그림이 세 가지면?")
        pg = picture_graph("붕어빵 종류별 판매량", BUNG, UNITS3, "붕어빵", "개", value_head="판매량").move_to([-1.0, 0.1, 0])
        self.say(f"그림이 세 가지: {b('100개')}, {o('10개')}, {g('1개')}", "이번에는 붕어빵 가게의 그림그래프예요. 그림이 100개, 10개, 1개 세 가지예요.")
        self.play(FadeIn(pg), run_time=0.8)
        self.play(Indicate(pg.legend, scale_factor=1.3), run_time=0.9)
        self.say("그림이 가장 긴 줄은 슈크림! 가장 많이 팔렸을까요?", "그림이 가장 길게 그려진 줄은 슈크림이에요. 슈크림이 가장 많이 팔렸을까요?")
        bx = SurroundingRectangle(pg.icons[1], color=ORANGE, buff=0.08, stroke_width=6)
        self.play(Create(bx), run_time=0.5)
        self.wait(1.6)
        labs = VGroup(*[M(f"{g(str(v))}개", 36).move_to([5.9, pg.names[i].get_center()[1], 0]) for i, (_, v) in enumerate(BUNG)])
        self.say(f"슈크림은 {g('108개')}, 팥은 {g('210개')}", "읽어 보면 슈크림은 100개짜리 1개와 1개짜리 8개, 108개예요. 팥은 100개짜리 2개와 10개짜리 1개, 210개예요.")
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.2, run_time=1.0))
        bx2 = SurroundingRectangle(VGroup(pg.names[3], pg.icons[3]), color=GREEN, buff=0.08, stroke_width=6)
        self.say(f"가장 많이 팔린 것은 {g('팥붕어빵')}!", "가장 많이 팔린 것은 그림이 3개뿐인 팥붕어빵이에요. 그림의 개수보다 그림의 크기를 먼저 봐야 해요.")
        self.play(Create(bx2), run_time=0.5)
        self.wait(1.8)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
