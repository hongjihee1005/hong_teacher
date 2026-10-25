"""「과학 원리 돋보기」 5학년 28화 — 고기압과 저기압 (5-2 2단원 날씨와 우리 생활 6차시, 화 코드 5-2-2-c)

바탕: grade5/science/sem2/u2-4.html(원본 _build_tb/src2/u2-4.html) — 도입(ㄱ 지역 맑음 · ㄴ 지역 비, 다른 기상 요소),
기압(일정한 넓이에 작용하는 공기의 무게), 고기압·저기압(주변보다 상대적으로 높은·낮은 곳; '가' 1012, 주변 1004~1006 / 1018~1020 —
단위 hPa, 이 자료에서 정한 예시 값; 정해진 기준값 없음), 기상 위성 사진(2024년 10월 12일 고기압 · 10월 22일 저기압, 앱 그림 좌표 그대로),
서울 일별 자료(10월 12일: 평균 18.3 °C, 24.7/13.4 °C, 습도 60.6 %, 운량 0, 강수량 0 mm · 10월 22일: 15.5 °C, 16.6/14.9 °C, 90.8 %, 10, 20.6 mm),
정리(고기압 대체로 맑음, 저기압 대체로 구름이 많아 비나 눈·습도 높을 수 있음, 항상은 아님), 한눈에 쏙.
(EPISODES.md에 적힌 '차가운 공기 → 고기압'은 이 차시가 아니라 u2-5에 있어 29화에서 다룸.)
최종: ./make_final.sh s5ep28
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, VGroup, Transform,
                   SurroundingRectangle)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u22 as K

HI = K.HIGH
LO = K.LOW


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def hi(s):
    return f'<span foreground="{HI}">{s}</span>'


def lo(s):
    return f'<span foreground="{LO}">{s}</span>'


class S5Ep28(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 28
    EP_TITLE = "고기압과 저기압"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.pressure()
        self.satellite()
        self.table()
        self.summary()
        self.closing(f"주변보다 기압이 높은 {hi('고기압')}: 대체로 맑아요\n주변보다 기압이 낮은 {lo('저기압')}: 대체로 흐리고 비나 눈",
                     next_preview="5학년 29화 · 바람은 어느 방향으로 불까?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        two = K.fit(K.two_regions(), 12.6, 4.3).move_to([0, 0.75, 0])
        self.say("두 지역의 날씨에서 무엇이 다를까요?",
                 "ㄱ 지역은 맑고, ㄴ 지역은 흐리고 비가 와요. 두 지역의 날씨에서 다른 기상 요소는 무엇일까요?")
        self.play(FadeIn(two[0], shift=RIGHT * 0.3), FadeIn(two[1], shift=LEFT * 0.3), run_time=0.8)
        self.pause_screen(4, "다른 기상 요소를 찾아보세요")
        tags = VGroup(*[K.word_card(t, 2.5, 0.75, ORANGE, 30) for t in ("구름의 양", "강수량", "습도", "기온")]
                      ).arrange(RIGHT, buff=0.25).move_to([0, -2.0, 0])
        self.say(f"{o('구름의 양')}, {o('강수량')}, {o('습도')}, {o('기온')} 등이 달라요",
                 "구름의 양, 강수량, 습도, 기온 등이 달라요. 오늘은 고기압과 저기압이 있을 때 날씨가 어떤지 알아봐요.")
        self.play(FadeIn(tags, lag_ratio=0.2), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 기압 ──
    def pressure(self):
        self.section("기압")
        col = K.air_column(2.8, 3.4).move_to([-4.0, 0.5, 0])
        card = K.text_card([f"일정한 넓이에 작용하는", f"공기의 무게 = {o('기압')}"], w=6.6, size=40).move_to([2.6, 1.3, 0])
        self.say(f"일정한 넓이에 작용하는 공기의 무게를 {o('기압')}이라고 해요",
                 "공기에도 무게가 있어요. 일정한 넓이에 작용하는 공기의 무게를 기압이라고 해요. 기압은 지역이나 시간에 따라 달라져요.")
        self.play(FadeIn(col[0]), FadeIn(col[1]), FadeIn(col[2]), FadeIn(col[3]), run_time=0.7)
        self.play(GrowArrow(col.arrow), FadeIn(card), run_time=0.9)
        self.settle()
        defs = VGroup(
            VGroup(K.hl_badge(True, 0.34), M(f"주변보다 기압이 {hi('높은')} 곳 → {hi('고기압')}", 34)).arrange(RIGHT, buff=0.25),
            VGroup(K.hl_badge(False, 0.34), M(f"주변보다 기압이 {lo('낮은')} 곳 → {lo('저기압')}", 34)).arrange(RIGHT, buff=0.25),
        ).arrange(DOWN, buff=0.35, aligned_edge=LEFT).move_to([2.6, -1.0, 0])
        self.say(f"주변보다 높은 곳은 {hi('고기압')}, 낮은 곳은 {lo('저기압')}",
                 "주변보다 상대적으로 기압이 높은 곳을 고기압, 주변보다 상대적으로 기압이 낮은 곳을 저기압이라고 해요.")
        self.play(FadeIn(defs, lag_ratio=0.3), run_time=0.9)
        self.settle()
        clear_stage(self)
        # 지도 두 개
        A = K.pressure_map([1006, 1004, 1005, 1006]).move_to([-3.4, 0.7, 0])
        B = K.pressure_map([1018, 1020, 1019, 1020]).move_to([3.4, 0.7, 0])
        note = T("단위 hPa(헥토파스칼) · 이 자료에서 정한 예시 값", 24, SOFT).move_to([0, -1.25, 0])
        self.say("두 지도에서 '가'의 기압은 똑같이 1012예요",
                 "두 지도에서 가 지역의 기압은 똑같이 1012예요. 각각 고기압일까요, 저기압일까요?")
        self.play(FadeIn(A), FadeIn(B), FadeIn(note), run_time=0.8)
        self.pause_screen(5, "'가'는 고기압일까요, 저기압일까요?")
        ba = K.hl_badge(True, 0.42).next_to(A, DOWN, buff=0.15).shift(DOWN * 0.45)
        bb = K.hl_badge(False, 0.42).next_to(B, DOWN, buff=0.15).shift(DOWN * 0.45)
        ta = M(f"주변보다 {hi('높아요')} → {hi('고기압')}", 32).next_to(ba, RIGHT, buff=0.2)
        tb = M(f"주변보다 {lo('낮아요')} → {lo('저기압')}", 32).next_to(bb, RIGHT, buff=0.2)
        VGroup(ba, ta).move_to([A.get_x(), -1.85, 0])
        VGroup(bb, tb).move_to([B.get_x(), -1.85, 0])
        self.say(f"왼쪽 '가'는 {hi('고기압')}, 오른쪽 '가'는 {lo('저기압')}이에요",
                 "왼쪽 가는 주변보다 기압이 높으니 고기압, 오른쪽 가는 주변보다 기압이 낮으니 저기압이에요.")
        self.play(FadeOut(note), Indicate(A.center_node, color=HI), Indicate(B.center_node, color=LO), run_time=0.9)
        self.play(FadeIn(VGroup(ba, ta)), FadeIn(VGroup(bb, tb)), run_time=0.6)
        self.settle()
        self.say(f"정해진 기준값은 없어요. {o('주변과 비교')}해서 정해요",
                 "고기압과 저기압을 나누는 정해진 숫자는 없어요. 주변보다 기압이 높은지 낮은지를 비교해서 정해요.")
        self.wait(0.3)
        self.settle()
        clear_stage(self)

    # ── 기상 위성 사진 ──
    def satellite(self):
        self.section("기상 위성 사진")
        s1 = K.satellite("oct12", 5.4).move_to([-3.0, 0.1, 0])
        s2 = K.satellite("oct22", 5.4).move_to([3.0, 0.1, 0])
        t1 = T("2024년 10월 12일 낮 12시", 28).next_to(s1, UP, buff=0.15)
        t2 = T("2024년 10월 22일 낮 12시", 28).next_to(s2, UP, buff=0.15)
        cap = T("기상 위성 사진을 본떠 그린 그림 · 흰색은 구름", 24, SOFT).move_to([0, -2.3, 0])
        self.say("기상 위성 사진에서 흰색은 구름이에요",
                 "우리나라 낮 12시에 찍은 기상 위성 사진을 본떠 그린 그림이에요. 흰색은 구름이에요. 고와 저는 고기압과 저기압이에요.")
        self.play(FadeIn(s1), FadeIn(s2), FadeIn(t1), FadeIn(t2), FadeIn(cap), run_time=0.9)
        self.settle()
        self.say(f"10월 12일: 우리나라에 {hi('고기압')} → 구름이 거의 없어요",
                 "10월 12일에는 우리나라에 고기압이 있어요. 우리나라 위에 구름이 거의 없어요.")
        self.play(Indicate(s1.hi, color=HI, scale_factor=1.6), run_time=1.0)
        self.settle()
        self.say(f"10월 22일: 우리나라에 {lo('저기압')} → 구름이 많아요",
                 "10월 22일에는 우리나라에 저기압이 있어요. 우리나라 위에 구름이 많아요. 기상 위성 사진으로 구름의 양을 알 수 있어요.")
        self.play(Indicate(s2.lo, color=LO, scale_factor=1.6), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 서울 자료 ──
    def table(self):
        self.section("날씨 비교")
        rows = [["평균 기온", "18.3 °C", "15.5 °C"], ["최고 / 최저 기온", "24.7 / 13.4 °C", "16.6 / 14.9 °C"],
                ["습도", "60.6 %", "90.8 %"], ["구름의 양(0~10)", "0", "10"], ["강수량", "0 mm", "20.6 mm"],
                ["기압", "", ""], ["날씨", "", ""]]
        tb = K.result_table(["서울", "2024년 10월 12일", "2024년 10월 22일"], rows, [3.4, 3.7, 3.7], row_h=0.56, size=28)
        tb.move_to([0, 0.25, 0])
        src = T("기상청 날씨누리 · 과거 관측 · 일별 자료", 22, SOFT).next_to(tb, DOWN, buff=0.12)
        self.say("기압이 다른 두 날, 서울의 기상 요소를 비교해요",
                 "기상청 날씨누리에서 찾은 서울의 자료예요. 10월 12일은 구름의 양 0, 강수량 0밀리미터, 10월 22일은 구름의 양 10, 습도 90.8퍼센트, 강수량 20.6밀리미터예요.")
        self.play(FadeIn(tb), FadeIn(src), run_time=0.8)
        self.settle()
        self.pause_screen(5, "두 날의 기압과 날씨는?")
        cells = tb.cells
        fill = [(6, 1, hi("고기압")), (6, 2, lo("저기압")), (7, 1, g("맑다")), (7, 2, "흐리고 비가 온다")]
        news = VGroup()
        for rr, cc, txt in fill:
            m = M(txt, 28)
            ref = cells[rr][0]
            x = cells[0][cc].get_x()
            m.move_to([x, ref.get_y(), 0])
            news.add(m)
        self.say(f"12일은 {hi('고기압')}·맑음, 22일은 {lo('저기압')}·흐리고 비",
                 "고기압이 있던 10월 12일은 구름이 없고 맑았어요. 저기압이 있던 10월 22일은 구름이 많고 습도가 높으며 비가 왔어요.")
        self.play(FadeIn(news, lag_ratio=0.25), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        rowA = VGroup(K.hl_badge(True, 0.45), K.text_card([f"{hi('고기압')}이 있는 지역: 대체로 구름이 없거나 적어 {g('날씨가 맑아요')}"],
                                                           w=11.4, size=32)).arrange(RIGHT, buff=0.3)
        rowB = VGroup(K.hl_badge(False, 0.45), K.text_card([f"{lo('저기압')}이 있는 지역: 대체로 구름이 많아 {o('비나 눈')}이 내릴 수 있어요",
                                                            "습도가 높게 나타날 수 있어요"], w=11.4, size=32)).arrange(RIGHT, buff=0.3)
        VGroup(rowA, rowB).arrange(DOWN, buff=0.35).move_to([0, 1.1, 0])
        self.say(f"{hi('고기압')}은 대체로 맑고, {lo('저기압')}은 대체로 흐리고 비나 눈",
                 "고기압이 있는 지역은 대체로 구름이 없거나 적어 날씨가 맑아요. 저기압이 있는 지역은 대체로 구름이 많아 비나 눈이 내릴 수 있고, 습도가 높을 수 있어요.")
        self.play(FadeIn(rowA, shift=UP * 0.2), run_time=0.6)
        self.play(FadeIn(rowB, shift=UP * 0.2), run_time=0.6)
        self.settle()
        warn = K.text_card([f"고기압이어도 {r('항상')} 맑은 것은 아니고, 저기압이어도 {r('항상')} 비가 오는 것은 아니에요.",
                            f"'{o('대체로')}' 그렇다는 것을 기억해요."], w=12.6, size=28).move_to([0, -1.55, 0])
        self.say(f"항상 그런 것은 아니고, '{o('대체로')}' 그래요",
                 "하지만 고기압이어도 항상 맑은 것은 아니고, 저기압이어도 항상 비가 오는 것은 아니에요. 대체로 그렇다는 것을 기억해요.")
        self.play(FadeIn(warn, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        self.section("한눈에 쏙")
        card = K.text_card([f"주변보다 상대적으로 기압이 높은 곳을 {hi('고기압')},",
                            f"주변보다 상대적으로 기압이 낮은 곳을 {lo('저기압')}이라고 합니다."], w=12.0, size=36).move_to([0, 1.2, 0])
        self.say(f"주변보다 기압이 높은 곳 {hi('고기압')}, 낮은 곳 {lo('저기압')}",
                 "주변보다 상대적으로 기압이 높은 곳을 고기압, 낮은 곳을 저기압이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        more = K.text_card([f"비가 올 수 있는 곳 찾기: {o('구름이 많이 낀 지역')}, {lo('저기압')}인 지역"], w=11.8, size=32).move_to([0, -0.6, 0])
        self.say(f"비가 올 수 있는 곳: 구름이 많은 곳, {lo('저기압')}인 곳",
                 "기상 위성 사진에서 비가 올 수 있는 곳을 찾으려면 구름이 많이 낀 지역이나 주변보다 기압이 낮은 저기압 지역을 살펴봐요.")
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
