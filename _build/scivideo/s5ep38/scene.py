"""「과학 원리 돋보기」 5학년 38화 — 재생 에너지가 궁금해! (5-2 4단원 자원과 에너지 3~4차시, 화 코드 5-2-4-b)

바탕: grade5/science/sem2/u4-2.html(원본 _build_tb/src2/u4-2.html) — 도입(에너지는 석탄·석유·태양 빛·바람·물에서 얻음,
석유와 바람 중 계속 이용할 수 있는 것 → 재생 에너지의 뜻), 그림에서 찾기(앱 「재생 에너지 마을」 그림을 본뜸: 태양 에너지·풍력·수력·
해양 에너지·지열 에너지·바이오 에너지와 얻는 방법), 태양 에너지 O/X(열만 이용 × — 태양 전지·태양열 집열판), 주목받는 까닭(석탄·석유의
문제점, 좋은 점·어려운 점, 기술 발전), 한눈에 쏙(재생 에너지), 제주 풍력·지역 특징에 알맞은 재생 에너지(형성 평가 2번).
최종: ./make_final.sh s5ep38
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, VGroup, SurroundingRectangle

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


NAVY = "#0F3B5C"


def tagbox(text, size=28):
    t = T(text, size, "#FFFFFF")
    bg = K.R(t.width + 0.36, t.height + 0.26, NAVY, rad=0.12, stroke=None, sw=0)
    t.move_to(bg)
    return VGroup(bg, t)


class S5Ep38(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 38
    EP_TITLE = "재생 에너지가 궁금해!"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.village()
        self.solar_ox()
        self.why()
        self.region()
        self.closing(f"자연에서 얻고 계속 이용할 수 있는 에너지 = {o('재생 에너지')}\n태양·풍력·수력·해양·지열·바이오 에너지",
                     next_preview="5학년 39화 · 에너지를 지속가능하게 쓰려면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        src = VGroup(K.icard(K.ore_pic(), "석탄", 2.3, 2.3), K.icard(K.fuel_can(), "석유", 2.3, 2.3),
                     K.icard(K.sun_hot(0.5), "태양 빛", 2.3, 2.3), K.icard(K.windmill(1.2, 0.5), "바람", 2.3, 2.3),
                     K.icard(K.water_drop(), "물", 2.3, 2.3)).arrange(RIGHT, buff=0.3).move_to([0, 0.9, 0])
        self.say("에너지는 여러 가지 자원에서 얻어요",
                 "생물이 살아가거나 기계를 움직이려면 에너지가 필요해요. 에너지는 석탄, 석유, 태양 빛, 바람, 물 등 여러 가지 자원에서 얻어요.")
        self.play(FadeIn(src, lag_ratio=0.15), run_time=1.2)
        self.settle()
        self.say("석유와 바람 가운데 계속 이용할 수 있는 것은?",
                 "석유에서 얻는 에너지와 바람에서 얻는 에너지 가운데 계속 이용할 수 있는 것은 무엇일까요?")
        self.play(Indicate(src[1], color=ORANGE), Indicate(src[3], color=ORANGE), run_time=1.0)
        self.pause_screen(4, "계속 이용할 수 있는 것은?")
        ring = SurroundingRectangle(src[3], color=GREEN, stroke_width=8, buff=0.08, corner_radius=0.2)
        self.say(f"{g('바람')}에서 얻는 에너지는 계속 이용할 수 있어요",
                 "바람에서 얻는 에너지예요. 바람은 자연에서 계속 얻을 수 있어요.")
        self.play(Create(ring), run_time=0.6)
        self.settle()
        card = K.text_card([f"태양 빛, 바람, 물과 같은 자연에서 얻을 수 있고",
                            f"계속 이용할 수 있는 에너지 = {o('재생 에너지')}"], w=11.0, size=36).move_to([0, -1.3, 0])
        self.say(f"자연에서 얻고 계속 이용할 수 있는 에너지 = {o('재생 에너지')}",
                 "태양 빛, 바람, 물과 같은 자연에서 얻을 수 있고 계속 이용할 수 있는 에너지를 재생 에너지라고 해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 재생 에너지 마을 ──
    def village(self):
        self.section("조사해요")
        v = K.village(9.4).move_to([0, 0.12, 0])
        self.say("그림에서 재생 에너지를 얻는 곳을 찾아봐요",
                 "재생 에너지 마을 그림이에요. 어디에서 재생 에너지를 얻고 있는지 찾아볼까요?")
        self.play(FadeIn(v), run_time=0.8)
        self.settle()
        P = v.P
        tags = {
            "sun": tagbox("태양 에너지").move_to(v.spots["sun"].get_top() + UP * 0.3),
            "wind": tagbox("풍력").move_to(v.spots["wind"].get_top() + UP * 0.1 + RIGHT * 0.75),
            "water": tagbox("수력").move_to(v.spots["water"].get_top() + UP * 0.25 + RIGHT * 0.3),
            "sea": tagbox("해양 에너지").move_to(v.spots["sea"].get_top() + UP * 0.3 + LEFT * 0.2),
            "geo": tagbox("지열 에너지").move_to(v.spots["geo"].get_bottom() + DOWN * 0.05 + RIGHT * 1.4),
            "bio": tagbox("바이오 에너지").move_to(v.spots["bio"].get_top() + UP * 0.3 + LEFT * 1.0),
        }
        steps = [
            (("sun", "wind"), f"{o('태양 에너지')}: 태양 빛·태양열  /  {o('풍력')}: 바람으로 발전기",
             "태양 에너지는 태양 빛이나 태양열을 이용해요. 풍력은 바람으로 발전기를 돌려 전기를 만들어요."),
            (("water", "sea"), f"{o('수력')}: 떨어지는 물의 흐름  /  {o('해양')}: 밀물·썰물·파도",
             "수력은 높은 곳에서 떨어지는 물의 흐름을 이용해요. 해양 에너지는 밀물과 썰물, 파도, 바닷물의 흐름과 온도 차이를 이용해요."),
            (("geo", "bio"), f"{o('지열')}: 땅속 깊은 곳의 열  /  {o('바이오')}: 식물·가축 분뇨",
             "지열 에너지는 땅속 깊은 곳의 열을 이용해요. 바이오 에너지는 식물이나 가축의 분뇨, 음식물 쓰레기를 이용해요."),
        ]
        for keys, sub, narr in steps:
            self.say(sub, narr)
            anims = []
            for k in keys:
                anims += [Indicate(v.spots[k], color=ORANGE, scale_factor=1.08), FadeIn(tags[k], shift=DOWN * 0.15)]
            self.play(*anims, run_time=1.0)
            self.settle()
        clear_stage(self)

    # ── 생각 바로잡기: 태양 에너지 ──
    def solar_ox(self):
        self.section("생각 바로잡기")
        q = K.chip_card("태양 에너지는 태양의 뜨거운 열만 이용하는 거예요.", INK, 34, w=11.2, h=1.0).move_to([-0.5, 2.2, 0])
        self.say("맞을까요, 틀릴까요?", "태양 에너지는 태양의 뜨거운 열만 이용하는 걸까요? 맞을까요, 틀릴까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(4, "맞을까요, 틀릴까요?")
        x = K.ox_mark(False, 0.32).next_to(q, RIGHT, buff=0.25)
        cards = VGroup(K.icard(K.solar_panel(1.8), "태양 전지\n빛을 받아 전기를 만들어요", 4.6, 3.0),
                       K.icard(K.solar_heater(), "태양열 집열판\n열을 모아 물을 데우거나 난방해요", 4.6, 3.0)).arrange(RIGHT, buff=0.6)
        cards.move_to([0, -0.15, 0])
        self.say(f"{r('틀려요')}! 태양 {o('빛')}으로 전기를, 태양 {o('열')}로 물을 데워요",
                 "틀려요. 태양 전지는 태양 빛을 받아 전기를 만들고, 태양열 집열판은 태양열을 모아 물을 데우거나 난방을 해요.")
        self.play(Create(x), FadeIn(cards, lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 주목받는 까닭 ──
    def why(self):
        self.section("주목받는 까닭")
        fac = K.fit(K.factory(), 2.6, 2.2).move_to([-4.3, 0.9, 0])
        probs = K.text_card([f"사용할수록 양이 줄어들어 {r('계속 쓸 수 없어요')}",
                             f"{r('대기오염')}이 생기고 {r('기후변화')}에 영향을 줘요"], w=8.4, size=32).move_to([1.6, 0.9, 0])
        self.say("석탄, 석유로 에너지를 얻으면 어떤 문제점이 있을까요?",
                 "석탄, 석유와 같은 자원으로 에너지를 얻으면 어떤 문제점이 있을까요? 사용할수록 양이 줄어들어 계속 쓸 수 없고, 대기오염이 생기고 기후변화에 영향을 줘요.")
        self.play(FadeIn(fac), run_time=0.5)
        self.play(FadeIn(probs, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        bins = VGroup(K.res_bin("좋은 점", 6.3, 3.4, GREEN), K.res_bin("어려운 점", 6.3, 3.4, RED)).arrange(RIGHT, buff=0.3)
        bins.move_to([0, 0.8, 0])
        good = VGroup(K.chip_card("자연에서 얻고 계속 이용할 수 있어요", GREEN, 26, w=5.9, h=0.8),
                      K.chip_card("대기오염·기후변화에 영향을 적게 줘요", GREEN, 26, w=5.9, h=0.8)).arrange(DOWN, buff=0.2)
        hard = VGroup(K.chip_card("항상 일정한 양을 얻기 어려워요", RED, 26, w=5.9, h=0.8),
                      K.chip_card("설치 비용이 많이 들어요", RED, 26, w=5.9, h=0.8)).arrange(DOWN, buff=0.2)
        good.next_to(bins[0].head, DOWN, buff=0.35)
        hard.next_to(bins[1].head, DOWN, buff=0.35)
        self.say(f"재생 에너지는 계속 쓸 수 있고 {g('환경에 영향을 적게')} 줘요",
                 "그래서 재생 에너지가 주목받고 있어요. 재생 에너지는 자연에서 얻어 계속 이용할 수 있고, 대기오염이나 기후변화에 영향을 적게 줘요.")
        self.play(FadeIn(bins), run_time=0.5)
        self.play(FadeIn(good, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        self.say(f"하지만 날씨에 따라 {r('얻는 양이 달라지고')}, 설치 비용이 많이 들어요",
                 "하지만 날씨에 따라 햇빛이나 바람의 양이 달라져 항상 일정한 양을 얻기 어렵고, 설치 비용도 많이 들어요.")
        self.play(FadeIn(hard, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        tech = K.text_card([f"어려운 점을 해결하려면 → {g('기술 발전')}이 필요해요"], w=9.6, size=34).move_to([0, -1.55, 0])
        self.say(f"어려운 점을 해결하려면 {g('기술 발전')}이 필요해요",
                 "이런 어려운 점을 해결하려면 기술 발전이 필요해요.")
        self.play(FadeIn(tech, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 지역에 알맞은 재생 에너지 ──
    def region(self):
        self.section("생활 속 재생 에너지")
        jeju = K.fit(K.island_wind(), 5.6, 3.0).move_to([0, 1.0, 0])
        self.say("제주특별자치도에 풍력 발전기가 많은 까닭은?",
                 "제주특별자치도에는 풍력 발전기가 많아요. 그 까닭은 무엇일까요?")
        self.play(FadeIn(jeju), run_time=0.6)
        self.pause_screen(4, "풍력 발전기가 많은 까닭은?")
        self.say(f"{g('바람이 많이 부는')} 지역이기 때문이에요",
                 "바람이 많이 부는 지역이기 때문이에요.")
        self.play(Indicate(jeju[3], color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)
        cards = VGroup(K.icard(K.island_wind(), "바다로 둘러싸이고\n바람이 많이 부는 섬", 4.1, 3.2),
                       K.icard(K.desert_sun(), "햇빛이 강하고\n기온이 매우 높은 사막", 4.1, 3.2),
                       K.icard(K.bio_farm(), "가축 농장이 많아\n배설물 처리가 문제인 곳", 4.1, 3.2)).arrange(RIGHT, buff=0.35)
        cards.move_to([0, 1.0, 0])
        ans = VGroup(*[T(t, 36, GREEN) for t in ("풍력", "태양 에너지", "바이오 에너지")])
        for a, c in zip(ans, cards):
            a.next_to(c, DOWN, buff=0.25)
        self.say("지역의 특징에 알맞은 재생 에너지는 무엇일까요?",
                 "지역의 특징을 보고, 개발하면 좋을 재생 에너지를 생각해 봐요.")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=1.0)
        self.settle()
        self.say(f"섬은 {g('풍력')}, 사막은 {g('태양 에너지')}, 농장은 {g('바이오 에너지')}",
                 "바람이 많이 부는 섬에는 풍력, 햇빛이 강한 사막에는 태양 에너지, 가축 농장이 많은 곳에는 바이오 에너지가 좋아요.")
        self.play(FadeIn(ans, shift=UP * 0.2, lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)
        self.section("우리가 할 수 있는 일")
        card = K.text_card([f"우리 지역의 특징에 알맞은 {o('재생 에너지')}는 무엇일지 생각해 봐요",
                            f"더 궁금한 점은 {g('신뢰할 수 있는 누리집')}에서 찾아봐요"], w=12.4, size=32).move_to([0, 0.8, 0])
        self.say("우리 지역에 알맞은 재생 에너지는 무엇일까요?",
                 "우리 지역의 특징에 알맞은 재생 에너지는 무엇일지 생각해 봐요. 더 궁금한 점이 생기면 신뢰할 수 있는 누리집에서 더 찾아봐요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)
