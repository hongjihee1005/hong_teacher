"""「과학 원리 돋보기」 5학년 26화 — 날씨를 나타내는 기상 요소와 습도 (5-2 2단원 날씨와 우리 생활 2~3차시, 화 코드 5-2-2-a)

바탕: grade5/science/sem2/u2-1.html(원본 _build_tb/src2/u2-1.html) — 도입(맑은 날 둘: 8 °C 외투 · 31 °C 부채),
날씨 애플리케이션 화면에서 기상 요소 5가지 찾기(23 °C · 비 · 구름 많음 · 강수량 6 mm, 시간별 기온·풍속·풍향·습도 85→70 %),
기상 요소로 알 수 있는 것, 풍향(북동풍은 북동쪽에서 불어오는 바람), 여러 날 자료(9월 3일~10일 최고·최저 기온·습도, 기상청 날씨누리·지도서),
정리(구체적·객관적, 비교 쉬움; 비 오는 날은 기온 변화가 작고 습도가 높음), 한눈에 쏙(기상 요소, 눈도 강수량).
grade5/science/sem2/u2-2.html — 날씨에 따른 생활 모습(맑음·강한 바람·높은 습도·비·눈), 예보 보고 준비(폭염 34 °C), 정리.
(앱에는 건습구 습도계·습도표가 없어 넣지 않음.)
최종: ./make_final.sh s5ep26
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, VGroup,
                   SurroundingRectangle, Transform)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u22 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep26(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 26
    EP_TITLE = "날씨를 나타내는 기상 요소와 습도"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.elements()
        self.wind_dir()
        self.days()
        self.life()
        self.summary()
        self.closing(f"날씨를 표현하는 {o('기상 요소')}에는\n기온, 바람, 습도, 구름의 양, 강수량 등이 있어요",
                     next_preview="5학년 27화 · 이슬, 안개, 구름")
        self.wait(0.5)

    # ── 궁금해요: 맑은 날 둘 ──
    def intro(self):
        self.section("궁금해요")
        two = K.fit(K.two_sunny(), 12.6, 4.6).move_to([0, 0.35, 0])
        self.say("두 날 모두 '맑음'이에요. 두 날의 날씨는 똑같을까요?",
                 "두 날 모두 맑아요. 그런데 한 친구는 외투를 입고, 한 친구는 부채질을 해요. 두 날의 날씨는 똑같을까요?")
        self.play(FadeIn(two[0], shift=RIGHT * 0.3), FadeIn(two[1], shift=LEFT * 0.3), run_time=0.8)
        self.pause_screen(5, "두 날의 날씨는 똑같을까요?")
        self.say(f"맑은 날이라도 {o('기온')}, 바람 등이 같지 않아요",
                 "아니요. 한 날은 8도, 다른 날은 31도예요. 맑은 날이라도 기온이나 바람 등이 같지 않아요.")
        self.play(Indicate(two[0].temp, color=K.COLD, scale_factor=1.4), Indicate(two[1].temp, color=K.HOT, scale_factor=1.4),
                  run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 기상 요소 찾기 ──
    def elements(self):
        self.section("기상 요소")
        app = K.weather_app()
        K.fit(app, 6.9, 5.0).move_to([-3.25, 0.1, 0])
        self.say(f"날씨를 표현할 때 쓰는 것을 {o('기상 요소')}라고 해요",
                 "날씨를 표현할 때 쓰는 것을 기상 요소라고 해요. 날씨 애플리케이션 화면에서 기상 요소를 찾아볼까요?")
        self.play(FadeIn(app, scale=0.95), run_time=0.8)
        self.pause_screen(5, "기상 요소를 찾아보세요")
        specs = [("t", "기온", "따뜻하고 차가운 정도"), ("w", "바람", "풍향(불어오는 방향)·풍속"),
                 ("h", "습도", "공기 중 수증기가 포함된 정도"), ("c", "구름의 양", "맑음·구름 조금·많음·흐림"),
                 ("r", "강수량", "비나 눈 등이 내린 정도")]
        cards = VGroup()
        for k, name, desc in specs:
            box = K.RoundedRectangle(corner_radius=0.16, width=6.0, height=0.92, fill_color=K.PAPER,
                                     fill_opacity=1, stroke_color=ORANGE, stroke_width=4)
            t = M(f"{o(name)}  {desc}", 28)
            if t.width > 5.7:
                t.scale_to_fit_width(5.7)
            t.move_to(box)
            cards.add(VGroup(box, t))
        cards.arrange(DOWN, buff=0.16).move_to([3.75, 0.05, 0])
        lines = [
            (f"{o('기온')}: 공기의 따뜻하고 차가운 정도",
             "23도처럼 공기의 따뜻하고 차가운 정도를 숫자로 나타낸 것이 기온이에요."),
            (f"{o('바람')}: 불어오는 방향(풍향)과 빠르기(풍속)",
             "풍향과 풍속은 둘 다 바람을 나타내요. 바람이 불어오는 방향과 빠르기로 공기의 움직임을 나타내요."),
            (f"{o('습도')}: 공기 중에 수증기가 포함된 정도",
             "습도는 공기 중에 수증기가 포함된 정도로, 퍼센트로 나타내요."),
            (f"{o('구름의 양')}: 하늘에 떠 있는 구름의 양",
             "구름의 양은 맑음, 구름 조금, 구름 많음, 흐림처럼 하늘에 떠 있는 구름의 양을 나타내요."),
            (f"{o('강수량')}: 비나 눈 등이 내린 정도",
             "강수량은 비나 눈 등이 내린 정도를 밀리미터로 나타내요."),
        ]
        prev = None
        for (k, _, _), card, (sub, narr) in zip(specs, cards, lines):
            if k == "t":
                box = VGroup(*[SurroundingRectangle(m_, color=K.YEL, buff=0.06, stroke_width=7) for m_ in app.parts[k]])
            else:
                box = SurroundingRectangle(app.parts[k], color=K.YEL, buff=0.06, stroke_width=7)
            self.say(sub, narr)
            anims = [Create(box), FadeIn(card, shift=LEFT * 0.3)]
            if prev is not None:
                anims.append(FadeOut(prev))
            self.play(*anims, run_time=0.7)
            prev = box
        self.settle()
        self.play(FadeOut(prev), run_time=0.3)
        clear_stage(self)

    # ── 풍향 ──
    def wind_dir(self):
        self.section("바람의 방향")
        cp = K.compass(1.4).move_to([-3.4, 0.8, 0])
        self.say("북동풍은 어느 쪽에서 불어오는 바람일까요?",
                 "풍향은 바람이 불어오는 방향이에요. 그림처럼 부는 바람을 북동풍이라고 해요. 북동풍은 어느 쪽에서 불어오는 바람일까요?")
        self.play(FadeIn(VGroup(*cp[:-1])), run_time=0.6)
        self.play(GrowArrow(cp.arrow), run_time=1.0)
        name = T("북동풍", 44, "#1C6FA8").next_to(cp, DOWN, buff=0.15)
        self.play(FadeIn(name), run_time=0.4)
        self.pause_screen(4, "북동풍은 어디에서 불어올까요?")
        c1 = K.word_card("북동쪽에서 불어오는 바람", 5.6, 0.95, GREEN, 32)
        c2 = K.word_card("북동쪽으로 불어가는 바람", 5.6, 0.95, SOFT, 32)
        VGroup(c1, c2).arrange(DOWN, buff=0.45).move_to([3.3, 0.6, 0])
        m1 = K.ox_mark(True, 0.3).next_to(c1, LEFT, buff=0.25)
        m2 = K.ox_mark(False, 0.3).next_to(c2, LEFT, buff=0.25)
        self.say(f"북동풍은 {g('북동쪽에서 불어오는')} 바람이에요",
                 "북동풍은 북동쪽에서 불어오는 바람이에요. 풍향은 바람이 불어가는 방향이 아니라 불어오는 방향으로 나타내요.")
        self.play(FadeIn(c1), FadeIn(c2), run_time=0.5)
        self.play(FadeIn(m1, scale=0.6), FadeIn(m2, scale=0.6), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 여러 날 자료 ──
    def days(self):
        self.section("자료 살펴보기")
        ch = K.day_chart(12.6, 4.9).move_to([0, 0.15, 0])
        ch.leg.shift(LEFT * 2.6)
        src = T("자료 출처: 기상청 날씨누리, 지도서", 22, SOFT).move_to([2.9, ch.leg.get_y(), 0])
        self.say("여러 날 동안의 기상 자료를 살펴봐요",
                 "9월 3일부터 10일까지의 기상 자료예요. 빨간 선은 최고 기온, 파란 선은 최저 기온, 하늘색 막대는 습도예요.")
        self.play(FadeIn(ch), FadeIn(src), run_time=0.9)
        self.settle()
        self.say(f"비가 온 날은 맑은 날보다 습도가 {o('높은 편')}이에요",
                 "비가 온 9월 3일과 4일은 습도가 78퍼센트, 80퍼센트예요. 맑은 9월 6일부터 9일보다 습도가 높은 편이에요.")
        self.play(Indicate(ch.bars[0], color=K.HUM, scale_factor=1.15), Indicate(ch.bars[1], color=K.HUM, scale_factor=1.15),
                  run_time=1.2)
        self.settle()
        g0, g5 = ch.gap(1), ch.gap(5)
        l0 = T("6 °C", 28, "#7A4F00").next_to(g0, LEFT, buff=0.08)
        l5 = T("11 °C", 28, "#7A4F00").next_to(g5, LEFT, buff=0.08)
        for lb in (l0, l5):
            bg = K.R(lb.width + 0.12, lb.height + 0.1, "#FFFFFF", lb.get_x(), lb.get_y(), rad=0.05, sw=0)
            lb.add_to_back(bg)
        self.say(f"구름이 많은 날은 하루 동안의 기온 변화가 {o('작아요')}",
                 "최고 기온과 최저 기온의 차이가 비가 온 날은 6~7도, 맑은 날은 8~11도예요. 구름이 많은 날은 하루 동안의 기온 변화가 작아요.")
        self.play(Create(g0), FadeIn(l0), Create(g5), FadeIn(l5), run_time=1.0)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"날씨를 기상 요소로 표현하면", f"① {o('구체적이고 객관적인')} 날씨 정보를 알 수 있어요",
                            f"② 지역별·날짜별로 날씨를 {o('비교하기 쉬워요')}"], w=11.0, size=38).move_to([0, 0.4, 0])
        self.section("정리해요")
        self.say(f"기상 요소로 표현하면 {o('구체적')}이고 {o('비교')}하기 쉬워요",
                 "날씨를 기상 요소로 표현하면 구체적이고 객관적인 날씨 정보를 알 수 있고, 지역별이나 날짜별로 날씨를 비교하기 쉬워요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 날씨와 우리 생활 ──
    def life(self):
        self.section("날씨와 생활")
        pics = [(K.sun_hot(0.5), "맑음", "야외 활동"), (K.umbrella(1.0), "비", "우산·비옷"),
                (K.greenhouse(1.0), "강한 바람", "시설물 고정"), (VGroup(K.laundry(), K.dehumidifier().scale(0.7).shift(RIGHT * 1.7)), "높은 습도", "제습기 사용"),
                (K.snowman(0.6), "눈", "눈놀이·제설차")]
        cards = VGroup()
        for p, w_, a_ in pics:
            c = K.pic_card(p, w_, 2.45, 2.5, 30, stroke=SOFT)
            act = T(a_, 26, ORANGE).next_to(c, DOWN, buff=0.15)
            cards.add(VGroup(c, act))
        cards.arrange(RIGHT, buff=0.18).move_to([0, 1.25, 0])
        self.say("날씨는 우리 생활에 어떤 영향을 줄까요?",
                 "날씨는 우리 생활에 어떤 영향을 줄까요? 맑은 날에는 야외 활동을 많이 하고, 비가 오면 우산을 써요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=1.2)
        self.settle()
        self.say(f"습도가 높은 날에는 빨래가 {r('잘 마르지 않아요')}",
                 "습도가 높은 날에는 빨래가 잘 마르지 않아 제습기를 사용해요.")
        self.play(Indicate(cards[3], color=K.HUM, scale_factor=1.08), run_time=1.0)
        self.settle()
        note = K.text_card([f"예보: 맑음, 최고 기온 {r('34 °C')} (폭염)",
                            f"→ {g('모자')}, {g('물병')}, {g('자외선 차단제')}를 챙기고 한낮의 야외 활동은 자제해요"],
                           w=12.4, size=30).move_to([0, -1.45, 0])
        self.say(f"날씨 정보를 미리 알면 {g('편리하고 안전하게')} 생활할 수 있어요",
                 "폭염 예보가 있으면 모자, 물, 자외선 차단제를 챙겨요. 날씨 정보를 미리 알면 편리하고 안전하게 생활할 수 있어요.")
        self.play(FadeIn(note, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"날씨를 표현하는 {o('기상 요소')}에는 기온, 바람, 습도,",
                            "구름의 양, 강수량 등이 있습니다."], w=11.6, size=40).move_to([0, 1.1, 0])
        self.say(f"{o('기상 요소')}: 기온·바람·습도·구름의 양·강수량",
                 "날씨를 표현하는 기상 요소에는 기온, 바람, 습도, 구름의 양, 강수량 등이 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        more = K.text_card([f"겨울에 내린 {o('눈의 양')}도 {g('강수량')}으로 나타내요."], w=10.0, size=34).move_to([0, -1.0, 0])
        self.say(f"눈이 내린 양도 {g('강수량')}으로 나타내요",
                 "강수량은 비나 눈 등이 내린 양이에요. 그래서 겨울에 눈이 내린 양도 강수량으로 나타내요.")
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
