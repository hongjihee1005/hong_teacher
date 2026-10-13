"""「수학 원리 돋보기」 21화 — 그림그래프로 나타내기 (2학기 6단원 4·5차시, 화 코드 2-6-b)

표(귤 34, 배 21, 감 15, 수박 28) → ① 그림 정하기 ② 단위 정하기(10개, 1개) ③ 그리기(34 = 큰 3 + 작은 4) ④ 제목
→ 작은 그림 10개 = 큰 그림 1개 → 세 자리 수(음료 17, 26, 42, 102)는 단위 세 가지 → 조사 순서
최종: ./make_final.sh 21
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, Transform, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from graph import UNITS2, UNITS3, icon, icons_for, picture_graph, split

FRUIT = [("귤", 34), ("배", 21), ("감", 15), ("수박", 28)]
DRINK = [("아이스티", 17), ("사과주스", 26), ("유자차", 42), ("초코우유", 102)]


def table(rows, head1, head2, size=34):
    cols = VGroup(VGroup(T(head1, size), T(head2, size)).arrange(DOWN, buff=0.3))
    for n, v in rows:
        cols.add(VGroup(T(n, size), T(str(v), size)).arrange(DOWN, buff=0.3))
    tot = sum(v for _, v in rows)
    cols.add(VGroup(T("합계", size), T(str(tot), size)).arrange(DOWN, buff=0.3))
    cols.arrange(RIGHT, buff=0.45)
    return cols


class Ep21(EpisodeScene):
    EP_NO = 21
    EP_TITLE = "그림그래프로 나타내기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.make()
        self.ten_to_one()
        self.three()
        self.survey()
        self.closing(f"① 그림 정하기 → ② 단위 정하기 → ③ 그리기 → ④ 제목 쓰기\n{o('작은 그림 10개')}는 {b('큰 그림 1개')}로 바꿔요",
                     next_preview="22화 · 세 자리 수 × 한 자리 수")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        tb = table(FRUIT, "과일", "개수(개)", 40).move_to([0, 0.6, 0])
        self.say("과수원에서 딴 과일을 표로 정리했어요", "과수원에서 딴 과일의 수를 표로 정리했어요.")
        self.play(FadeIn(tb), run_time=0.8)
        q = M(f"표의 수를 {g('그림')}으로 어떻게 옮길까요?", 52).move_to([0, -1.3, 0])
        self.say("표의 수를 그림으로 어떻게 옮길까요?", "이 표를 한눈에 보이게 그림그래프로 나타내려면 어떻게 해야 할까요?")
        self.play(Write(q), run_time=0.9)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def make(self):
        self.section("그림그래프 만들기")
        pg = picture_graph("", FRUIT, UNITS2, "과일", "개", value_head="과일 수", col2=6.0).move_to([-1.6, -0.35, 0])
        for ic in pg.icons:
            ic.set_opacity(0)
        steps = VGroup(M("① 그림 정하기", 36), M("② 단위 정하기", 36), M("③ 그림 그리기", 36), M("④ 제목 쓰기", 36))
        steps.arrange(DOWN, aligned_edge=LEFT, buff=0.45).move_to([5.0, 0.3, 0])
        self.play(FadeIn(VGroup(pg.frame, pg.lines, pg.heads, pg.names)), FadeIn(steps.set_opacity(0.35)), run_time=0.8)
        self.say("① 어떤 그림으로 나타낼지 정해요: 동그라미", "첫째, 어떤 그림으로 나타낼지 정해요. 여기서는 동그라미로 그릴게요.")
        self.play(steps[0].animate.set_opacity(1), run_time=0.4)
        self.wait(0.6)
        self.say(f"② 단위: {b('큰 그림 10개')}, {o('작은 그림 1개')}", "둘째, 그림 하나가 몇 개를 나타낼지 정해요. 큰 그림은 10개, 작은 그림은 1개로 할게요.")
        self.play(steps[1].animate.set_opacity(1), FadeIn(pg.legend), run_time=0.6)
        self.wait(0.6)
        self.play(steps[2].animate.set_opacity(1), run_time=0.3)
        for i, (nm, v) in enumerate(FRUIT):
            big, small = split(v, UNITS2)
            if i == 0:
                self.say(f"귤 34 = {b('큰 그림 3개')} + {o('작은 그림 4개')}", "셋째, 그림을 그려요. 귤 34개는 십의 자리 3이 큰 그림 3개, 일의 자리 4가 작은 그림 4개예요.")
            elif i == 1:
                self.say(f"배 21 = 큰 그림 {b('2')}개 + 작은 그림 {o('1')}개", "배 21개는 큰 그림 2개와 작은 그림 1개예요.")
            elif i == 2:
                self.say("감과 수박도 같은 방법으로", "감 15개, 수박 28개도 같은 방법으로 그려요.")
            self.play(LaggedStart(*[x.animate.set_opacity(1) for x in pg.icons[i]], lag_ratio=0.15, run_time=0.9))
            self.wait(0.3)
        ttl = M("과수원에서 딴 과일 수", 44).next_to(pg.frame, UP, buff=0.25)
        self.say("④ 알맞은 제목을 써요", "넷째, 알맞은 제목을 써요. 과수원에서 딴 과일 수.")
        self.play(steps[3].animate.set_opacity(1), Write(ttl), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def ten_to_one(self):
        self.section("작은 그림이 10개면?")
        row = VGroup(*[icon(0.15, ORANGE) for _ in range(10)]).arrange(RIGHT, buff=0.12).move_to([-1.2, 0.8, 0])
        self.say("작은 그림이 10개가 되면?", "작은 그림을 하나씩 그리다가 10개가 되면 어떻게 할까요?")
        self.play(LaggedStart(*[FadeIn(x, scale=0.5) for x in row], lag_ratio=0.1, run_time=1.2))
        lab = M(f"{o('작은 그림 10개')} = {b('큰 그림 1개')}", 54).move_to([0, -0.8, 0])
        big = icon(0.27, BLUE).move_to([4.6, 0.8, 0])
        self.say(f"{o('작은 그림 10개')}는 {b('큰 그림 1개')}로 바꿔요", "작은 그림 10개는 큰 그림 1개로 바꾸어 그려요. 그래야 그래프가 간단하고 한눈에 보여요.")
        self.play(Transform(row, big), run_time=1.0)
        self.play(FadeIn(lab), run_time=0.5)
        tip = M("일의 자리 수가 10이 되면 십의 자리로 올리는 것과 같아요", 38).move_to([0, -1.9, 0])
        self.play(FadeIn(tip), run_time=0.5)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)

    def three(self):
        self.section("세 자리 수가 있으면?")
        tb = table(DRINK, "음료", "컵 수", 32).move_to([0, 2.0, 0])
        self.say("초코우유는 102컵! 큰 그림 10개를 그려야 할까요?", "음료 판매량에 초코우유가 102컵이 있어요. 10컵짜리 그림만 쓰면 10개나 그려야 해요.")
        self.play(FadeIn(tb), run_time=0.7)
        self.wait(1.0)
        pg = picture_graph("", DRINK, UNITS3, "음료", "컵", value_head="판매량", col1=2.4, col2=4.6, row_h=0.62, size=32).move_to([-0.3, -0.75, 0])
        pg.legend.arrange(DOWN, aligned_edge=LEFT, buff=0.2).next_to(pg.frame, RIGHT, buff=0.4).align_to(pg.frame, DOWN)
        self.say(f"단위를 세 가지로: {b('100컵')}, {o('10컵')}, {g('1컵')}", "이럴 때는 단위를 100컵, 10컵, 1컵 세 가지로 정하면 간단해요. 102컵은 100컵 그림 1개와 1컵 그림 2개예요.")
        self.play(FadeIn(VGroup(pg.frame, pg.lines, pg.heads, pg.names, pg.legend)), run_time=0.6)
        self.play(LaggedStart(*[FadeIn(ic) for ic in pg.icons], lag_ratio=0.3, run_time=1.6))
        self.play(Indicate(pg.icons[3], color=GREEN, scale_factor=1.3), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def survey(self):
        self.section("직접 조사해 나타내기")
        steps = [
            "① 무엇을 조사할지 정하기 (예: 기르고 싶은 동물)",
            "② 항목 정하기 (강아지·고양이·햄스터·물고기·기타)",
            "③ 자료 모으기 (손 들기, 붙임 쪽지)",
            "④ 표로 정리하기",
            "⑤ 그림그래프로 나타내기",
        ]
        ms = VGroup(*[M(s_, 40) for s_ in steps]).arrange(DOWN, aligned_edge=LEFT, buff=0.38)
        ms.scale_to_fit_width(min(ms.width, 11.8)).move_to([0, 0.3, 0])
        self.say("우리 반도 직접 조사해 볼까요?", "우리 반이 궁금한 것을 직접 조사해 그림그래프로 나타낼 때는 이런 순서로 해요.")
        for m_ in ms:
            self.play(FadeIn(m_, shift=RIGHT * 0.2), run_time=0.5)
            self.wait(0.6)
        self.say(f"‘{o('기타')}’ 항목을 두면 모든 답을 담을 수 있어요", "항목이 너무 많으면 복잡하니 알맞게 정하고, 기타 항목을 두면 모든 친구의 답을 담을 수 있어요.")
        self.play(Indicate(ms[1], color=ORANGE, scale_factor=1.05), run_time=0.9)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.7)
        self.hide_chip()
