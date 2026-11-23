"""「수학 원리 돋보기」 개념 차근차근 28화 — 옛날 사람들의 곱셈법(격자 곱셈)

격자 곱셈 23 × 45: 2×2 칸, 칸마다 대각선, 한 자리끼리 곱을 십/일로 나누어 씀 → 대각선 따라 더함 → 1035
이야기: 이탈리아 이름 '겔로시아'(창살), 아랍·인도에서도 / 1478년 『트레비소 산술책』에 실림 / 1617년 네이피어 막대
연습: 34 × 12 = 408 / 출처
최종: GRADE=c ./make_final.sh 28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, SurroundingRectangle, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from division import clear_stage
from conceptkit import ConceptScene, dot, dots, ten_frame, RED
from items import check_mark, cross_mark
from storykit import book, scroll, show_sources
from manim import Rectangle, Square

S_ = 1.3


class GcEp28(ConceptScene):
    EP_NO = 28
    EP_TITLE = "옛날 사람들의 곱셈법"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.lattice(23, 45, center=(-1.6, 0.4, 0))
        self.story()
        self.practice()
        show_sources(self, [
            "· 격자 곱셈(겔로시아)의 역사: 위키백과 'Lattice multiplication', 미국수학협회(MAA) 자료",
            "· 『트레비소 산술책』(1478): 위키백과 'Treviso Arithmetic'",
            "· 네이피어 막대: J. Napier, 『Rabdologiae』(1617) — 스미스소니언 도서관 디지털본",
        ])
        self.closing(f"격자 곱셈: 칸마다 {b('한 자리끼리')} 곱하고, {o('대각선')}을 따라 더해요\n방법은 달라도 23 × 45 = {g('1035')}",
                     next_preview="개념 차근차근 29화 · ÷ 기호 이야기와 나눗셈 안내")
        self.wait(0.5)

    def lattice(self, a, c, center, quick=False):
        self.section("격자 곱셈")
        da, dc = [int(x) for x in str(a)], [int(x) for x in str(c)]
        n, m = len(da), len(dc)
        cx, cy = center[0], center[1]
        x0 = cx - n * S_ / 2
        y0 = cy + m * S_ / 2
        cells = VGroup()
        diags = VGroup()
        for i in range(m):
            for j in range(n):
                sq = Square(S_, stroke_color=INK, stroke_width=4).move_to([x0 + (j + 0.5) * S_, y0 - (i + 0.5) * S_, 0])
                cells.add(sq)
                diags.add(Line(sq.get_corner(UP + RIGHT), sq.get_corner(DOWN + LEFT), color=SOFT, stroke_width=3))
        top = VGroup(*[T(str(d), 56, BLUE).move_to([x0 + (j + 0.5) * S_, y0 + 0.45, 0]) for j, d in enumerate(da)])
        right = VGroup(*[T(str(d), 56, ORANGE).move_to([x0 + n * S_ + 0.45, y0 - (i + 0.5) * S_, 0]) for i, d in enumerate(dc)])
        self.say(f"{a} × {c}를 칸에 그려요", f"{a} 곱하기 {c}를 옛날 방법으로 계산해 볼까요? 위에 {a}, 오른쪽에 {c}를 쓰고 칸마다 대각선을 그어요.")
        self.play(Create(cells), FadeIn(top), FadeIn(right), run_time=0.8)
        self.play(Create(diags), run_time=0.6)
        nums = VGroup()
        for i in range(m):
            for j in range(n):
                p = da[j] * dc[i]
                sq = cells[i * n + j]
                tt = T(str(p // 10), 36, INK).move_to(sq.get_center() + LEFT * 0.3 + UP * 0.3)
                uu = T(str(p % 10), 36, INK).move_to(sq.get_center() + RIGHT * 0.3 + DOWN * 0.3)
                nums.add(tt, uu)
        if not quick:
            self.say("칸마다 한 자리끼리 곱해요", f"칸마다 위의 수와 오른쪽 수를 곱해서, 십의 자리는 대각선 위쪽에, 일의 자리는 아래쪽에 써요. 예를 들어 {da[0]} 곱하기 {dc[0]}는 {da[0] * dc[0]}.")
        self.play(LaggedStart(*[FadeIn(x) for x in nums], lag_ratio=0.1), run_time=1.4)
        # 대각선 줄별 합
        sums = {}
        for i in range(m):
            for j in range(n):
                p = da[j] * dc[i]
                k = (n - 1 - j) + (m - 1 - i)
                sums[k] = sums.get(k, 0) + p % 10
                sums[k + 1] = sums.get(k + 1, 0) + p // 10
        res = a * c
        rs = str(res)
        t = M(f"대각선을 따라 오른쪽 아래부터 더해요 (10이 넘으면 다음 줄로 올림) → {g(rs)}", 34).move_to([0, -2.0, 0])
        self.say(f"대각선을 따라 더하면 {g(rs)}", f"이제 대각선을 따라 오른쪽 아래부터 더해요. 10이 넘으면 다음 대각선으로 올려요. 그러면 {res}가 나와요.")
        self.play(FadeIn(t), run_time=0.5)
        out = T(rs, 64, GREEN).next_to(cells, LEFT, buff=0.5).shift(DOWN * 0.5)
        self.play(FadeIn(out), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 창살 모양 곱셈")
        win = VGroup(*[Square(0.7, stroke_color="#8C7A55", stroke_width=5) for _ in range(9)]).arrange_in_grid(3, 3, buff=0).move_to([-4.4, 0.8, 0])
        t1 = M(f"이탈리아에서는 {o('겔로시아')}(창살)라고 불렀어요\n아랍·인도에서도 비슷한 방법을 썼어요", 36).move_to([1.4, 1.4, 0])
        self.say(f"'{o('겔로시아')}', 창살 모양", "칸이 창문 창살 같아서 이탈리아에서는 겔로시아, 창살이라고 불렀어요. 아랍과 인도에서도 비슷한 방법을 썼어요.")
        self.play(Create(win), FadeIn(t1), run_time=0.8)
        t2 = M(f"{o('1478년')} 이탈리아의 『트레비소 산술책』에 실렸어요", 36).move_to([1.4, 0.1, 0])
        t3 = M(f"{o('1617년')} 스코틀랜드의 네이피어는\n이 격자를 막대에 새겨 '곱셈 막대'를 만들었어요", 36).move_to([1.4, -1.2, 0])
        self.say("1478년 책, 1617년 네이피어 막대", "1478년 이탈리아에서 인쇄된 트레비소 산술책에도 실렸고, 1617년 스코틀랜드의 네이피어는 이 격자를 막대에 새겨 곱셈 막대를 만들었어요.")
        self.play(FadeIn(t2), run_time=0.5)
        self.play(FadeIn(t3), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("격자 곱셈으로 34 × 12", 70).move_to([0, 1.2, 0])
        self.say("34 × 12를 격자 곱셈으로", "연습해 볼까요? 34 곱하기 12를 격자 곱셈으로 해 보세요.")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"칸: 3×1=03, 4×1=04, 3×2=06, 4×2=08 → 대각선 합 → {g('408')}", 40).move_to([0, -0.4, 0])
        self.say(f"{g('408')}", "칸마다 03, 04, 06, 08을 쓰고 대각선을 따라 더하면 408이에요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
