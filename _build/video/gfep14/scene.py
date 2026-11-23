"""「수학 원리 돋보기」 분수 특별편 14화 — 분수 이야기 ③ 진분수·가분수·대분수, 이름에 담긴 뜻

사실 확인(2026-11, 출처는 영상 끝):
- 진분수 眞分數 · 가분수 假分數 · 대분수 帶分數 — 한자 글자 뜻(眞 참, 假 거짓·임시, 帶 띠·두르다)
- 교과서 뜻: 진분수 = 분자가 분모보다 작은 분수, 가분수 = 분자가 분모와 같거나 분모보다 큰 분수, 대분수 = 자연수와 진분수로 이루어진 분수
- 영어 proper(제대로 된)·improper(제대로 되지 않은) fraction: 옛날에는 '분수 = 1보다 작은 조각'으로 여겨서 1 이상인 분수를 improper라고 불렀다는 설명 (위키백과 Fraction — 확인 출처 1곳이라 '이렇게 설명해요'로 소개)
- numerator = '세는 것', denominator = '이름 붙이는 것' (etymonline, Merriam-Webster)
- 이름의 유래(대분수 = 자연수를 띠처럼 두름)는 확실한 기록을 찾지 못해 '글자 뜻으로 풀어 보면'으로만 말함
최종: GRADE=f ./make_final.sh 14
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, Dot, FadeIn, FadeOut, Indicate, LaggedStart, Line, Rectangle,
                   SurroundingRectangle, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row
from fracbasic import mixed_wide
from storykit import show_sources


def hanja_card(ch, word, meaning, color):
    big = T(ch, 120, color)
    w = M(word, 40)
    m = M(meaning, 32, SOFT)
    g_ = VGroup(big, w, m).arrange(DOWN, buff=0.25)
    box = SurroundingRectangle(g_, color=color, buff=0.3, stroke_width=5, corner_radius=0.2)
    return VGroup(box, g_)


class GfEp14(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 14
    EP_TITLE = "분수 이야기 ③ 진분수·가분수·대분수, 이름에 담긴 뜻"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.parts()
        self.names()
        self.why()
        self.meaning()
        self.numline()
        show_sources(self, [
            "· 진분수·가분수·대분수의 뜻: 초등 수학 교과서(3학년 2학기 분수), 표준국어대사전",
            "· numerator·denominator의 뜻: Online Etymology Dictionary, Merriam-Webster",
            "· proper·improper fraction 이름의 까닭: 위키백과 영어판 'Fraction'",
            "· 한자 뜻(眞·假·帶·母·子): 한자 사전의 글자 뜻",
        ])
        self.closing(f"{b('진분수')} 1보다 작아요 · {o('가분수')} 1과 같거나 커요 · {g('대분수')} 자연수 + 진분수\n이름은 옛날 생각에서 왔지만, 세 분수 모두 똑같이 {g('진짜 수')}예요",
                     next_preview="분수 특별편을 모두 마쳤어요!")
        self.wait(0.5)

    def parts(self):
        self.section("분모와 분자, 이름의 뜻")
        f = frac(3, 4, 130, cn=ORANGE, cd=BLUE).move_to([-4.8, 0.6, 0])
        self.say("분모와 분자에도 뜻이 있어요", "먼저 분모와 분자라는 이름부터 볼까요?")
        self.play(Write(f), run_time=0.7)
        l1 = M(f"{b('분모(分母)')} — 母: 어머니", 40).move_to([1.2, 0.2, 0])
        l2 = M(f"{o('분자(分子)')} — 子: 아들, 자식", 40).move_to([1.2, 1.3, 0])
        self.say("母는 어머니, 子는 아들이라는 한자", "분모의 모는 어머니, 분자의 자는 아들, 자식이라는 뜻의 한자예요. 약 2000년 전 중국 책에도 나오는 이름이에요.")
        self.play(FadeIn(l2), FadeIn(l1), run_time=0.7)
        e1 = M(f"영어 {b('denominator')} = '이름 붙이는 수' (몇 분의)", 34).move_to([1.2, -1.2, 0])
        e2 = M(f"영어 {o('numerator')} = '세는 수' (몇 개인지)", 34).move_to([1.2, -1.9, 0])
        self.say("영어로는 '이름 붙이는 수'와 '세는 수'", "영어 이름은 뜻이 더 쉬워요. 분모는 몇 분의, 하고 이름을 붙이는 수, 분자는 그 조각이 몇 개인지 세는 수라는 뜻이에요.")
        self.play(FadeIn(e1), FadeIn(e2), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def names(self):
        self.section("세 이름의 한자")
        cards = VGroup(hanja_card("眞", "진분수", "참 진", BLUE), hanja_card("假", "가분수", "거짓·임시 가", ORANGE),
                       hanja_card("帶", "대분수", "띠·두를 대", GREEN)).arrange(RIGHT, buff=0.9).move_to([0, 0.3, 0])
        self.say("진·가·대, 앞 글자가 한자예요", "진분수, 가분수, 대분수의 앞 글자는 모두 한자예요.")
        nar = ["진분수의 진은 참 진, 참되다는 뜻이에요.", "가분수의 가는 거짓 가, 또는 임시라는 뜻이에요.",
               "대분수의 대는 띠 대, 두르다 또는 지니다라는 뜻이에요."]
        subs = [f"{b('眞')} 참 진", f"{o('假')} 거짓·임시 가", f"{g('帶')} 띠·두를 대"]
        for c, s, n_ in zip(cards, subs, nar):
            self.say(s, n_)
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def why(self):
        self.section("왜 '참'과 '거짓'일까?")
        piece = frac_bar(4, 3, width=3.2, height=0.7).move_to([-4.6, 1.3, 0])
        t = M(f"옛날 생각: 분수 = {o('깨뜨린 조각')} → {b('1보다 작아야')} 했어요", 42).move_to([0, 2.5, 0])
        self.say("옛날에는 분수를 '1보다 작은 조각'으로 생각했어요", "옛날 사람들은 분수를 전체를 깨뜨린 조각, 곧 1보다 작은 것이라고 생각했어요.")
        self.play(FadeIn(t), FadeIn(piece), run_time=0.7)
        f1 = frac(3, 4, 64, cn=ORANGE, cd=BLUE).next_to(piece, RIGHT, buff=0.5)
        l1 = M(f"제대로 된 분수({b('proper')}) → {b('진(眞)분수')}", 34).next_to(f1, RIGHT, buff=0.4)
        self.say(f"1보다 작은 분수 = {b('제대로 된 분수')}", "그래서 1보다 작은 분수를 영어로 제대로 된 분수, 프로퍼 프랙션이라고 불렀어요. 우리말로는 참된 분수, 진분수예요.")
        self.play(FadeIn(f1), FadeIn(l1), run_time=0.7)
        b1 = VGroup(frac_bar(4, 4, width=1.6, height=0.6), frac_bar(4, 3, width=1.6, height=0.6)).arrange(RIGHT, buff=0.12).move_to([-4.6, -0.2, 0])
        f2 = frac(7, 4, 64, cn=ORANGE, cd=BLUE).next_to(b1, RIGHT, buff=0.5)
        l2 = M(f"제대로 안 된 분수({o('improper')}) → {o('가(假)분수')}", 30).next_to(f2, RIGHT, buff=0.3)
        self.say(f"1과 같거나 큰 분수 = {o('제대로 안 된 분수')}?", "1과 같거나 큰 분수는 조각이 아니니까 제대로 되지 않은 분수, 임프로퍼 프랙션이라고 불렀어요. 우리말로 가분수예요.")
        self.play(FadeIn(b1), FadeIn(f2), FadeIn(l2), run_time=0.7)
        note = M("(영어 이름의 까닭을 이렇게 설명해요)", 30, SOFT).move_to([0, -1.25, 0])
        self.play(FadeIn(note), run_time=0.4)
        good = M(f"하지만 가분수도 {g('틀린 수가 아니에요')}! 이름만 옛날 그대로예요", 38).move_to([0, -2.05, 0])
        self.say(f"가분수도 {g('진짜 수')}예요", "하지만 오늘날 수학에서 가분수는 틀린 수도, 가짜 수도 아니에요. 이름만 옛날 생각을 담고 있을 뿐이에요.")
        self.play(FadeIn(good), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def meaning(self):
        self.section("세 분수의 뜻")
        rows_ = VGroup(
            VGroup(T("진분수", 48, BLUE), M(f"{o('분자')}가 {b('분모')}보다 {g('작은')} 분수", 40),
                   frac(3, 4, 46, cn=ORANGE, cd=BLUE)).arrange(RIGHT, buff=0.6),
            VGroup(T("가분수", 48, ORANGE), M(f"{o('분자')}가 {b('분모')}와 {g('같거나 큰')} 분수", 40),
                   row(frac(4, 4, 46, cn=ORANGE, cd=BLUE), frac(7, 4, 46, cn=ORANGE, cd=BLUE), size=40, buff=0.35)).arrange(RIGHT, buff=0.6),
            VGroup(T("대분수", 48, GREEN), M(f"{g('자연수')}와 {b('진분수')}로 이루어진 분수", 40),
                   mixed_wide(1, 3, 4, 46, cw=GREEN, cn=ORANGE, cd=BLUE)).arrange(RIGHT, buff=0.6),
        ).arrange(DOWN, buff=0.6, aligned_edge=LEFT).move_to([0, 0.3, 0])
        nar = ["진분수는 분자가 분모보다 작은 분수예요. 4분의 3처럼요.",
               "가분수는 분자가 분모와 같거나 분모보다 큰 분수예요. 4분의 4, 4분의 7처럼요.",
               "대분수는 자연수와 진분수로 이루어진 분수예요. 1과 4분의 3처럼요."]
        subs = [f"{b('진분수')}: 분자 &lt; 분모", f"{o('가분수')}: 분자 ≥ 분모", f"{g('대분수')}: 자연수 + 진분수"]
        for r, s, n_ in zip(rows_, subs, nar):
            self.say(s, n_)
            self.play(FadeIn(r, shift=RIGHT * 0.3), run_time=0.7)
        t = M(f"대분수 = 자연수가 진분수를 {g('데리고 있는')} 모양 (帶: 두르다·지니다)", 34, SOFT).move_to([0, -2.2, 0])
        self.say("대(帶)는 '지니다'라는 뜻", "대분수의 대는 지니다라는 뜻도 있어요. 글자 뜻으로 풀어 보면, 자연수가 진분수를 데리고 있는 분수라고 생각할 수 있어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def numline(self):
        self.section("수직선에서 보면")
        L, U, y = -5.0, 4.6, 0.0
        x = lambda v: L + U * v
        ln = Line([L - 0.3, y, 0], [x(2) + 0.4, y, 0], color=INK, stroke_width=5)
        ticks = VGroup(*[Line([x(i / 4), y - (0.25 if i % 4 == 0 else 0.15), 0], [x(i / 4), y + (0.25 if i % 4 == 0 else 0.15), 0],
                              color=INK, stroke_width=5 if i % 4 == 0 else 3) for i in range(9)])
        nums = VGroup(*[T(str(i), 44, GREEN if i else INK).next_to(ticks[4 * i], DOWN, buff=0.25) for i in range(3)])
        self.say("세 분수를 수직선에 놓아 볼까요?", "세 분수를 수직선에 놓아 볼까요?")
        self.play(Create(ln), Create(ticks), FadeIn(nums), run_time=0.8)
        zone = Rectangle(width=U, height=0.5, fill_color=BLUE, fill_opacity=0.12, stroke_width=0).move_to([x(0.5), y, 0])
        p34 = VGroup(Dot([x(0.75), y, 0], radius=0.12, color=BLUE), frac(3, 4, 36, cn=BLUE, cd=BLUE).move_to([x(0.75), 0.95, 0]))
        lz = M(f"{b('진분수')}: 0과 1 사이", 36).move_to([x(0.5), 2.1, 0])
        self.say(f"{b('진분수')}는 0과 1 사이", "진분수는 모두 0과 1 사이에 있어요.")
        self.play(FadeIn(zone), FadeIn(p34), FadeIn(lz), run_time=0.6)
        p74 = VGroup(Dot([x(1.75), y, 0], radius=0.12, color=ORANGE), frac(7, 4, 36, cn=ORANGE, cd=ORANGE).move_to([x(1.75), 0.95, 0]),
                     mixed_wide(1, 3, 4, 36, cw=GREEN, cn=GREEN, cd=GREEN).move_to([x(1.75), -1.4, 0]))
        lt = M(f"{o('가분수')} 4분의 7 = {g('대분수')} 1과 4분의 3 (같은 자리)", 36).move_to([0.6, -2.2, 0])
        self.say("가분수와 대분수는 같은 수를 다르게 쓴 것", "가분수 4분의 7과 대분수 1과 4분의 3은 같은 자리에 있어요. 같은 수를 다르게 쓴 것이에요.")
        self.play(FadeIn(p74), FadeIn(lt), run_time=0.7)
        self.wait(1.6)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
