"""「수학 원리 돋보기」 분수 특별편 12화 — 분수 이야기 ① 분수는 어디에서 왔을까?

사실 확인(2026-11, 출처는 영상 끝·EPISODES_FR.md):
- fraction ← 라틴어 fractio '깨뜨려 조각냄', frangere '깨뜨리다' (Dictionary.com, Merriam-Webster)
- 린드 수학 파피루스: 기원전 1550년쯤 서기 아흐메스가 베껴 씀, 지금 영국박물관. 분자가 1인 분수(단위분수)를 주로 쓰고 3분의 2는 따로 기호 (British Museum, MAA)
- 바빌로니아: 60을 바탕으로 분수를 나타냄, 1/8 = 7/60 + 30/3600 (MacTutor)
- 『구장산술』: 약 2000년 전 중국 한나라 책, 1장에 약분(12/18 → 2/3)·분수 덧셈 방법, 分母·子 낱말이 나옴 (Britannica, 원문)
최종: GRADE=f ./make_final.sh 12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, Line, VGroup, Write

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from fraction import frac, frac_bar, row
from storykit import book, scroll, show_sources, timeline


class GfEp12(EpisodeScene):
    GRADE, SEM = "F", 1
    LABEL = "분수 특별편 {}화"
    EP_NO = 12
    EP_TITLE = "분수 이야기 ① 분수는 어디에서 왔을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.word()
        self.egypt()
        self.babylon()
        self.china()
        self.line()
        show_sources(self, [
            "· fraction의 뜻: Dictionary.com 'fraction', Merriam-Webster 'fraction'",
            "· 린드 수학 파피루스: 영국박물관(British Museum) 소장품 설명 EA 10057·10058",
            "· 이집트 분수: 미국수학협회(MAA) Convergence, 'Egyptian fractions' 자료",
            "· 바빌로니아 수: MacTutor 수학사(세인트앤드루스 대학) 'Babylonian numerals'",
            "· 『구장산술』: 브리태니커 백과 'The Nine Chapters on the Mathematical Procedures'",
            "  ·『구장산술』 1장 방전(方田)의 약분술·합분술 원문",
        ])
        self.closing(f"분수는 {o('깨뜨린 조각')}이라는 뜻\n이집트·바빌로니아·중국에서도 아주 오래전부터 썼어요",
                     next_preview="분수 특별편 13화 · 분수를 쓰는 모양은 어떻게 바뀌었을까?")
        self.wait(0.5)

    def word(self):
        self.section("'분수'라는 말")
        bar = frac_bar(4, 1, width=6.0, height=1.0).move_to([0, 1.2, 0])
        self.say("빵을 나누면 조각이 생겨요", "빵 하나를 똑같이 나누면 조각이 생겨요. 이 조각을 나타내는 수가 분수예요.")
        self.play(FadeIn(bar), run_time=0.6)
        self.play(bar[0].animate.shift(LEFT * 0.4 + UP * 0.2), run_time=0.6)
        t = M(f"영어 {o('fraction')} ← 라틴어 '{o('깨뜨려 조각냄')}'", 46).move_to([0, -0.4, 0])
        self.say(f"fraction = {o('깨뜨린 조각')}", "영어로 분수는 프랙션이에요. 깨뜨려 조각낸다는 뜻의 라틴어에서 온 말이에요.")
        self.play(FadeIn(t), run_time=0.6)
        k = M(f"우리말 분수(分數) = {b('나눌 분')} + 셀 수", 44).move_to([0, -1.5, 0])
        self.say(f"분수 = {b('나눈')} 수", "우리말 분수의 분은 나눈다는 뜻의 한자예요. 나누어서 생긴 수라는 뜻이지요.")
        self.play(FadeIn(k), run_time=0.6)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def egypt(self):
        self.section("이집트 · 약 3500년 전")
        sc = scroll(3.0, 1.8).move_to([-5.0, 1.3, 0])
        nm = M("린드 수학 파피루스", 34).next_to(sc, DOWN, buff=0.3)
        self.say("이집트의 린드 수학 파피루스", "아주 오래된 분수 기록 가운데 하나는 이집트의 린드 수학 파피루스예요.")
        self.play(FadeIn(sc), FadeIn(nm), run_time=0.7)
        facts = VGroup(
            M(f"· 기원전 {o('1550년쯤')} 서기 {b('아흐메스')}가 베껴 씀", 36),
            M("· 지금은 영국 런던 영국박물관에 있어요", 36),
        ).arrange(DOWN, buff=0.35, aligned_edge=LEFT)
        facts.next_to(sc, RIGHT, buff=0.6)
        self.say(f"기원전 {o('1550년쯤')}, 지금은 영국박물관에", "기원전 1550년쯤 아흐메스라는 서기가 베껴 쓴 것으로, 지금은 영국 런던의 영국박물관에 있어요.")
        self.play(FadeIn(facts, lag_ratio=0.4), run_time=0.9)
        self.settle()
        u = row(frac(1, 2, 50, cn=ORANGE, cd=BLUE), frac(1, 3, 50, cn=ORANGE, cd=BLUE), frac(1, 4, 50, cn=ORANGE, cd=BLUE),
                frac(1, 5, 50, cn=ORANGE, cd=BLUE), size=40, buff=0.6).move_to([0.6, -0.5, 0])
        self.say(f"이집트 사람들은 분자가 {o('1')}인 분수를 주로 썼어요",
                 "이집트 사람들은 2분의 1, 3분의 1처럼 분자가 1인 분수를 주로 썼어요. 이런 분수를 단위분수라고 해요. 3분의 2는 따로 기호가 있었어요.")
        self.play(FadeIn(u, lag_ratio=0.3), run_time=0.8)
        e = row(frac(3, 4, 50, cn=ORANGE, cd=BLUE), "=", frac(1, 2, 50, cn=ORANGE, cd=BLUE), "+", frac(1, 4, 50, cn=ORANGE, cd=BLUE),
                size=48).move_to([0.6, -1.85, 0])
        self.say("다른 분수는 단위분수를 더해서", "그래서 4분의 3 같은 분수는 2분의 1 더하기 4분의 1처럼 단위분수를 더해서 나타냈어요.")
        self.play(FadeIn(e), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def babylon(self):
        self.section("바빌로니아 · 60으로 나누기")
        t1 = M(f"바빌로니아 사람들은 {o('60')}을 바탕으로 수를 썼어요", 46).move_to([0, 1.8, 0])
        self.say(f"바빌로니아는 {o('60')}을 바탕으로", "지금의 이라크 땅에 살던 바빌로니아 사람들은 60을 바탕으로 수를 썼어요.")
        self.play(FadeIn(t1), run_time=0.6)
        t2 = M("그래서 분수도 '60분의 몇'으로 나타냈어요", 44).move_to([0, 0.7, 0])
        self.say("분수도 60분의 몇으로", "그래서 분수도 60분의 몇, 3600분의 몇으로 나타냈어요.")
        self.play(FadeIn(t2), run_time=0.5)
        e = VGroup(row(frac(1, 2, 50, cn=ORANGE, cd=BLUE), "=", frac(30, 60, 50, cn=ORANGE, cd=BLUE), size=48),
                   row(frac(1, 4, 50, cn=ORANGE, cd=BLUE), "=", frac(15, 60, 50, cn=ORANGE, cd=BLUE), size=48)).arrange(RIGHT, buff=1.6).move_to([0, -0.6, 0])
        self.say("2분의 1은 60분의 30", "예를 들어 2분의 1은 60분의 30, 4분의 1은 60분의 15로 생각하는 거예요.")
        self.play(FadeIn(e), run_time=0.6)
        c = M(f"1시간 = {o('60분')}처럼, 60으로 나누는 방법", 40, SOFT).move_to([0, -1.9, 0])
        self.say("1시간을 60분으로 나누는 것과 비슷해요", "우리가 1시간을 60분으로 나누는 것과 비슷한 방법이에요.")
        self.play(FadeIn(c), run_time=0.5)
        self.wait(1.2)
        self.settle()
        clear_stage(self, 0.6)

    def china(self):
        self.section("중국 『구장산술』 · 약 2000년 전")
        bk = book("九章算術").move_to([-4.2, 0.5, 0])
        nm = M("『구장산술』", 36).next_to(bk, DOWN, buff=0.3)
        self.say("중국의 수학책 『구장산술』", "약 2000년 전 중국 한나라 때 만든 수학책 구장산술에도 분수가 나와요.")
        self.play(FadeIn(bk), FadeIn(nm), run_time=0.7)
        a = M(f"분수를 {b('약분')}하는 방법", 40).move_to([1.6, 2.2, 0])
        ex = row(frac(12, 18, 50, cn=ORANGE, cd=BLUE), "→", frac(2, 3, 50, cn=ORANGE, cd=BLUE), size=48).next_to(a, DOWN, buff=0.35)
        self.say(f"분수를 간단히 하는 방법({b('약분')})", "이 책에는 분수를 간단하게 만드는 약분 방법이 있어요. 18분의 12를 3분의 2로 만드는 예도 나와요.")
        self.play(FadeIn(a), FadeIn(ex), run_time=0.7)
        b2 = M("분수끼리 더하는 방법도 있어요", 40).next_to(ex, DOWN, buff=0.4)
        self.play(FadeIn(b2), run_time=0.5)
        self.settle()
        words = VGroup(VGroup(T("分母", 64, BLUE), M("분모 = 어머니", 40)).arrange(RIGHT, buff=0.3),
                       VGroup(T("分子", 64, ORANGE), M("분자 = 아들", 40)).arrange(RIGHT, buff=0.3)).arrange(RIGHT, buff=0.9).move_to([1.6, -1.55, 0])
        self.say(f"{b('分母')}(어머니)와 {o('分子')}(아들)라는 말이 이미 나와요",
                 "그리고 이 책에 벌써 분모와 분자라는 말이 나와요. 분모의 모는 어머니, 분자의 자는 아들이라는 뜻의 한자예요.")
        self.play(FadeIn(words), run_time=0.7)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def line(self):
        self.section("한눈에 보기")
        tl = timeline([("이집트\n약 3500년 전", 0.12), ("중국 『구장산술』\n약 2000년 전", 0.55), ("오늘", 0.95)], y=0.6)
        self.say("분수는 아주 오래전부터 쓰였어요", "분수는 수천 년 전부터 여러 나라에서 쓰여 온 아주 오래된 수예요.")
        self.play(Create(tl.bar), FadeIn(tl.marks, lag_ratio=0.4), run_time=1.2)
        t = M(f"사람들은 오래전부터 {o('나누어 가질 때')} 분수가 필요했어요", 42).move_to([0, -1.9, 0])
        self.say("나누어 가질 때 분수가 필요했어요", "빵이나 땅, 곡식을 나누어 가질 때 분수가 꼭 필요했기 때문이에요.")
        self.play(FadeIn(t), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
