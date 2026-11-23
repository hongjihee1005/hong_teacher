"""「수학 원리 돋보기」 개념 차근차근 25화 — 곱셈표의 비밀과 '구구' 이야기

9×9 곱셈표: 바꾸어 곱해도 같음(대각선 접기), 한 줄은 그 단, 대각선 1·4·9·16…
이야기: 옛 중국에서는 '구구 팔십일'부터 거꾸로 외워 '구구'라 불렀다고 함 / 리야 진간(진나라 구구표, 2002년 발견)
백제 구구단 목간(2011년 부여 쌍북리 출토, 2016년 확인, 9단부터 거꾸로) / 출처
최종: GRADE=c ./make_final.sh 25
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
from manim import Rectangle

CW = 0.52


class GcEp25(ConceptScene):
    EP_NO = 25
    EP_TITLE = "곱셈표의 비밀과 '구구' 이야기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.table()
        self.story()
        self.practice()
        show_sources(self, [
            "· '구구'라는 이름과 옛 외우는 차례: 중국 학술 기사 모음(펑파이·환구망), 위키백과 'Chinese multiplication table'",
            "· 리야 진간 구구표(2002년 후난성 출토): 위키백과 'Liye Qin slips', Archaeology 잡지",
            "· 백제 구구단 목간: 이기환, 주간경향 「백제 '구구단 목간'의 수수께끼」, 「백제 시대 곱셈구구단 목간 재음미」(한국교육논총, 2021)",
        ])
        self.closing(f"곱셈표는 {g('대각선')}을 따라 접으면 똑같이 겹쳐요 (3 × 4 = 4 × 3)\n옛날에는 {o('구구 팔십일')}부터 거꾸로 외웠대요",
                     next_preview="개념 차근차근 26화 · (두·세 자리 수) × (한 자리 수)")
        self.wait(0.5)

    def table(self):
        self.section("곱셈표")
        cells, nums = VGroup(), VGroup()
        x0, y0 = -5.6, 2.3
        for r in range(10):
            for c in range(10):
                if r == 0 and c == 0:
                    t = T("×", 26, INK)
                elif r == 0 or c == 0:
                    t = T(str(r or c), 26, BLUE if r == 0 else ORANGE)
                else:
                    t = T(str(r * c), 22, INK)
                box = Rectangle(width=CW, height=CW * 0.8, stroke_color=SOFT, stroke_width=1.5,
                                fill_color="#FFFFFF" if r and c else "#F3EEE4", fill_opacity=1).move_to([x0 + c * CW, y0 - r * CW * 0.8, 0])
                cells.add(box)
                nums.add(t.move_to(box))
        tab = VGroup(cells, nums)
        self.cells = cells
        self.say("1단부터 9단까지 곱셈표", "1단부터 9단까지 한 표에 모은 곱셈표예요.")
        self.play(FadeIn(tab, lag_ratio=0.005), run_time=1.4)
        def cell(r, c):
            return cells[r * 10 + c]
        a, b2 = cell(3, 4), cell(4, 3)
        t1 = M(f"3 × 4 = {g('12')}\n4 × 3 = {g('12')}", 44).move_to([3.6, 1.4, 0])
        self.say("3 × 4와 4 × 3", "3 곱하기 4와 4 곱하기 3을 찾아볼까요? 둘 다 12예요. 곱하는 두 수를 바꾸어도 곱은 같아요.")
        self.play(a.animate.set_fill(GREEN, 0.5), b2.animate.set_fill(GREEN, 0.5), FadeIn(t1), run_time=0.8)
        diag = VGroup(*[cell(k, k).copy().set_fill(ORANGE, 0.45) for k in range(1, 10)])
        t2 = M(f"{o('대각선')}: 1, 4, 9, 16 …\n여기를 따라 접으면\n양쪽이 똑같아요", 38).move_to([3.6, -1.0, 0])
        self.say(f"{o('대각선')}을 따라 접으면 똑같이 겹쳐요", "같은 수끼리 곱한 1, 4, 9, 16이 대각선에 놓여요. 이 대각선을 따라 접으면 양쪽 수가 똑같이 겹쳐요.")
        self.play(FadeIn(diag, lag_ratio=0.1), FadeIn(t2), run_time=1.0)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def story(self):
        self.section("이야기: 왜 '구구'일까?")
        e = M(f"{o('九九八十一')} (구구 팔십일)", 60).move_to([0, 2.2, 0])
        t1 = M("옛 중국에서는 곱셈을 9 × 9 = 81부터 거꾸로 외워서\n맨 처음 나오는 '구구'가 이름이 되었다고 해요", 36).move_to([0, 1.0, 0])
        self.say("옛날에는 9 × 9부터 거꾸로", "옛 중국에서는 곱셈을 구구 팔십일, 9 곱하기 9부터 거꾸로 외웠대요. 그래서 맨 처음 나오는 구구가 이름이 되었다고 해요.")
        self.play(FadeIn(e), FadeIn(t1), run_time=0.7)
        mok = Rectangle(width=0.7, height=2.6, fill_color="#D9C08A", fill_opacity=1, stroke_color="#8C7A55", stroke_width=4).move_to([-4.6, -1.0, 0])
        lines = VGroup(*[Line(mok.get_top() + DOWN * (0.3 + 0.28 * k) + LEFT * 0.2, mok.get_top() + DOWN * (0.3 + 0.28 * k) + RIGHT * 0.2, color="#5A4A2A", stroke_width=4) for k in range(8)])
        t2 = M(f"부여에서 나온 {b('백제 구구단 목간')}\n· 2011년 땅에서 나오고 2016년에 구구단임을 확인\n· 9단부터 2단까지 거꾸로 적혀 있어요", 34).move_to([1.0, -1.0, 0])
        self.say(f"{b('백제 구구단 목간')}", "우리나라 부여에서도 백제 사람이 나무 조각에 적은 구구단이 나왔어요. 2011년에 발견되어 2016년에 구구단임을 확인했는데, 9단부터 2단까지 거꾸로 적혀 있대요.")
        self.play(FadeIn(mok), Create(lines), FadeIn(t2), run_time=0.8)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.5)

    def practice(self):
        self.section("연습해요")
        q = M("곱셈표에서 곱이 24인 칸은 모두 몇 개일까요?", 44).move_to([0, 1.4, 0])
        self.say("곱이 24인 칸은 몇 개?", "연습해 볼까요? 1단부터 9단까지의 곱셈표에서 곱이 24인 칸은 모두 몇 개일까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        a = M(f"3 × 8 · 8 × 3 · 4 × 6 · 6 × 4 → {g('4개')}", 52).move_to([0, -0.2, 0])
        self.say(f"{g('4개')}", "3 곱하기 8, 8 곱하기 3, 4 곱하기 6, 6 곱하기 4. 모두 4개예요.")
        self.play(FadeIn(a), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
