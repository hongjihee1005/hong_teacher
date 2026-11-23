"""「수학 원리 돋보기」 개념 차근차근 6화 — 짝수와 홀수

둘씩 짝 지으면 남는 것이 없는 수(짝수) / 하나가 남는 수(홀수) / 일의 자리로 알아보기 (0,2,4,6,8 / 1,3,5,7,9)
이야기: 피타고라스 학파(약 2500년 전 그리스)가 수를 홀수·짝수로 나누어 중요하게 여김(아리스토텔레스 『형이상학』),
유클리드 『원론』 7권 '짝수는 똑같은 두 부분으로 나뉘는 수' / 연습: 7, 12, 25, 30 / 출처 화면
최종: GRADE=c ./make_final.sh 6
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, RED
from storykit import scroll, show_sources


def pairs(n, y, r=0.24):
    """n개를 둘씩 위아래로 짝 지은 그림. 반환 (구슬들, 짝 상자들)"""
    ds = VGroup()
    for i in range(n):
        c, rr = divmod(i, 2)
        ds.add(dot(RED, r).move_to([c * 0.75, y + 0.32 - rr * 0.64, 0]))
    boxes = VGroup(*[SurroundingRectangle(VGroup(ds[k], ds[k + 1]), color=BLUE, buff=0.08) for k in range(0, n - 1, 2)])
    return ds, boxes


class GcEp06(ConceptScene):
    EP_NO = 6
    EP_TITLE = "짝수와 홀수"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.pair()
        self.ones()
        self.story()
        self.practice()
        show_sources(self, [
            "· 피타고라스 학파의 홀수·짝수: 아리스토텔레스 『형이상학』 A권 5장, 브리태니커 'Pythagoreanism'·'table of opposites'",
            "· 짝수·홀수의 정의: 유클리드 『원론』 7권 정의 6·7 (D. E. Joyce, Clark 대학교 원론 자료)",
        ])
        self.closing(f"둘씩 짝 지어 남는 것이 없으면 {b('짝수')}, 하나 남으면 {o('홀수')}\n일의 자리가 {b('0·2·4·6·8')}이면 짝수, {o('1·3·5·7·9')}이면 홀수",
                     next_preview="개념 차근차근 7화 · 수의 크기 비교와 부등호")
        self.wait(0.5)

    def pair(self):
        self.section("둘씩 짝 지어 보아요")
        a, ab = pairs(6, 0.8)
        VGroup(a, ab).shift(LEFT * 4.6)
        c, cb = pairs(7, 0.8)
        VGroup(c, cb).shift(RIGHT * 1.6)
        self.say("6명과 7명이 둘씩 짝을 지으면?", "친구 6명과 7명이 각각 둘씩 짝을 지어요. 짝이 없는 친구가 있을까요?")
        self.play(FadeIn(a, lag_ratio=0.1), FadeIn(c, lag_ratio=0.1), run_time=0.8)
        self.play(Create(ab), Create(cb), run_time=0.8)
        left = SurroundingRectangle(c[6], color=ORANGE, buff=0.1)
        la = M(f"6: 남는 것 없음 → {b('짝수')}", 44).move_to([-3.4, -1.3, 0])
        lc = M(f"7: {o('1명')} 남음 → {o('홀수')}", 44).move_to([3.0, -1.3, 0])
        self.say(f"6은 {b('짝수')}, 7은 {o('홀수')}", "6명은 모두 짝이 있어요. 이런 수를 짝수라고 해요. 7명은 한 명이 남아요. 이런 수를 홀수라고 해요.")
        self.play(FadeIn(la), run_time=0.5)
        self.play(Create(left), FadeIn(lc), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def ones(self):
        self.section("일의 자리를 보면 알아요")
        row = VGroup(*[T(str(v), 54, BLUE if v % 2 == 0 else ORANGE) for v in range(1, 21)]).arrange_in_grid(rows=2, buff=(0.45, 0.4)).move_to([0, 1.0, 0])
        self.say("1부터 20까지 짝수와 홀수", "1부터 20까지 짝수는 파란색, 홀수는 주황색으로 칠했어요. 짝수와 홀수가 번갈아 나와요.")
        self.play(LaggedStart(*[FadeIn(r) for r in row], lag_ratio=0.05), run_time=1.4)
        t1 = M(f"일의 자리가 {b('0, 2, 4, 6, 8')} → {b('짝수')}", 44).move_to([0, -0.9, 0])
        t2 = M(f"일의 자리가 {o('1, 3, 5, 7, 9')} → {o('홀수')}", 44).move_to([0, -1.7, 0])
        self.say("일의 자리만 보면 돼요", "큰 수도 일의 자리만 보면 알 수 있어요. 일의 자리가 0, 2, 4, 6, 8이면 짝수, 1, 3, 5, 7, 9이면 홀수예요.")
        self.play(FadeIn(t1), run_time=0.5)
        self.play(FadeIn(t2), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 2500년 전 그리스")
        sc = scroll(5.4, 2.4).move_to([-3.2, 0.6, 0])
        st = M(f"{o('홀')} · {b('짝')}", 70).move_to(sc)
        t1 = M("약 2500년 전 그리스의\n피타고라스 학파는 수를\n홀수와 짝수로 나누어\n아주 중요하게 여겼어요", 36).move_to([2.8, 0.8, 0])
        self.say("피타고라스 학파는 수를 홀수와 짝수로", "약 2500년 전 그리스의 피타고라스 학파 사람들은 수를 홀수와 짝수 두 무리로 나누어 아주 중요하게 여겼다고, 철학자 아리스토텔레스가 기록했어요.")
        self.play(FadeIn(sc), FadeIn(st), FadeIn(t1), run_time=0.8)
        self.wait(0.8)
        t2 = M(f"유클리드 『원론』: \"{b('짝수')}는 {g('똑같은 두 부분')}으로 나뉘는 수\"", 38).move_to([0, -1.7, 0])
        self.say(f"유클리드: 짝수는 {g('똑같은 두 부분')}으로 나뉘는 수", "그 뒤 그리스의 수학자 유클리드는 『원론』이라는 책에, 짝수는 똑같은 두 부분으로 나뉘는 수라고 적었어요. 오늘 우리가 둘씩 짝 지어 본 것과 같은 생각이에요.")
        self.play(FadeIn(t2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        nums = VGroup(*[T(str(v), 80, INK) for v in (7, 12, 25, 30)]).arrange(RIGHT, buff=1.4).move_to([0, 1.0, 0])
        self.say("짝수일까 홀수일까?", "연습해 볼까요? 7, 12, 25, 30은 짝수일까요, 홀수일까요?")
        self.play(FadeIn(nums, lag_ratio=0.2), run_time=0.7)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        labs = VGroup(*[M(o("홀수") if v % 2 else b("짝수"), 44).next_to(n, DOWN, buff=0.5) for n, v in zip(nums, (7, 12, 25, 30))])
        for n, v in zip(nums, (7, 12, 25, 30)):
            n.set_color(ORANGE if v % 2 else BLUE)
        t = M("일의 자리 7·5 → 홀수, 2·0 → 짝수", 40, SOFT).move_to([0, -1.7, 0])
        self.say(f"7·25는 {o('홀수')}, 12·30은 {b('짝수')}", "7과 25는 홀수, 12와 30은 짝수예요. 일의 자리만 보면 알 수 있지요.")
        self.play(LaggedStart(*[FadeIn(l) for l in labs], lag_ratio=0.2), FadeIn(t), run_time=1.0)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
