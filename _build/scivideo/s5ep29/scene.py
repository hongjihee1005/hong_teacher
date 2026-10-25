"""「과학 원리 돋보기」 5학년 29화 — 바람은 어느 방향으로 불까? (5-2 2단원 날씨와 우리 생활 7차시, 화 코드 5-2-2-d)

바탕: grade5/science/sem2/u2-5.html(원본 _build_tb/src2/u2-5.html) — 도입(바닷가 바람자루가 육지 쪽 → 바다에서 육지 쪽으로,
차가운 공기가 따뜻한 공기보다 무거움), 바람 발생 모형실험(모래 20 °C · 따뜻한 물 34 °C, 뒷면이 검은 투명 상자, 향 연기 그릇을 가운데,
앱 그림 좌표·연기 움직임 그대로), 결과(향 연기가 모래 쪽 → 따뜻한 물 쪽), 기압과 관련짓기(모래 위 고기압 > 따뜻한 물 위 저기압,
공기는 고기압 → 저기압), 바닷가 낮·밤(육지는 빨리 가열되고 빨리 식음 → 낮 해풍 바다 → 육지, 밤 육풍 육지 → 바다), 한눈에 쏙.
화면은 앱과 같이 바다·모래를 왼쪽, 육지·따뜻한 물을 오른쪽에 둠.
최종: ./make_final.sh s5ep29
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, VGroup, Transform,
                   ValueTracker, always_redraw, linear)

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


class S5Ep29(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 29
    EP_TITLE = "바람은 어느 방향으로 불까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.sea_breeze()
        self.summary()
        self.closing(f"바람은 {hi('고기압')}에서 {lo('저기압')}으로 불어요\n낮에는 해풍(바다 → 육지), 밤에는 육풍(육지 → 바다)",
                     next_preview="5학년 마인드맵 6 · 날씨와 우리 생활")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        bc = K.beach_windsock(12.6, 4.8).move_to([0, 0.4, 0])
        self.say("바람자루를 보면 바람은 어디에서 어디로 불까요?",
                 "바닷가에 바람자루가 날리고 있어요. 바람자루를 보면 바람은 어디에서 어디로 불고 있을까요?")
        self.play(FadeIn(bc), run_time=0.7)
        self.pause_screen(4, "바람은 어디에서 어디로 불까요?")
        arr = K.wind_arrow(-4.6, 1.2, 0.7)
        self.say(f"바람자루가 육지 쪽을 가리켜요 → {o('바다에서 육지 쪽')}으로",
                 "바람자루는 바람이 불어 가는 쪽을 가리켜요. 바람자루가 육지 쪽을 가리키니, 바람은 바다에서 육지 쪽으로 불고 있어요.")
        self.play(Indicate(bc.sock, color=RED, scale_factor=1.15), GrowArrow(arr), run_time=1.2)
        self.settle()
        clear_stage(self)
        cold = VGroup(K.word_card("차가운 공기", 3.4, 0.9, K.COLD, 34), T("→ 무거워요", 34),
                      T("→", 34), K.hl_badge(True, 0.38), M(f"{hi('고기압')}", 34)).arrange(RIGHT, buff=0.25)
        warm = VGroup(K.word_card("따뜻한 공기", 3.4, 0.9, K.HOT, 34), T("→ 가벼워요", 34),
                      T("→", 34), K.hl_badge(False, 0.38), M(f"{lo('저기압')}", 34)).arrange(RIGHT, buff=0.25)
        VGroup(cold, warm).arrange(DOWN, buff=0.45, aligned_edge=LEFT).move_to([0, 1.2, 0])
        self.say("온도에 따라 공기의 무게는 어떻게 다를까요?",
                 "온도에 따라 공기의 무게는 어떻게 다를까요? 차가운 공기는 따뜻한 공기보다 무거워요. 그래서 차가운 공기가 있는 곳은 고기압, 따뜻한 공기가 있는 곳은 저기압이 돼요.")
        self.play(FadeIn(cold, shift=RIGHT * 0.3), run_time=0.7)
        self.play(FadeIn(warm, shift=RIGHT * 0.3), run_time=0.7)
        self.settle()
        card = K.text_card([f"두 지역 사이에 {o('기압 차이')}가 생기면 공기가 이동해요 → {g('바람')}"], w=12.0, size=34).move_to([0, -1.2, 0])
        self.say(f"기압 차이로 공기가 이동하는 것이 {g('바람')}이에요",
                 "두 지역 사이에 기압 차이가 생기면 공기가 이동하는데, 이것을 바람이라고 해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 바람 발생 모형실험 ──
    def experiment(self):
        self.section("실험해요")
        wb = K.WindBox(12.0)
        UPS = UP * 0.3
        box = wb.box().shift(UPS)
        bowls = wb.bowls().shift(UPS)
        inc = wb.incense(lid=True, smoke=True).shift(UPS)
        self.say("바람 발생 모형실험 장치를 만들어요",
                 "그릇 두 개에 모래와 따뜻한 물을 담고 액정 온도계를 붙여요. 모래는 20도, 따뜻한 물은 34도예요. 뒷면이 검은 투명한 상자 아래에 두 그릇을 넣어요.")
        self.play(FadeIn(box), run_time=0.5)
        self.play(FadeIn(bowls), run_time=0.7)
        self.settle()
        safe = K.safety_note("향불은 모래 상자에 넣어 반드시 끄고, 창문을 열어 환기해요.", w=11.0, size=26).move_to([0, 1.25, 0])
        self.say(f"향 연기를 모은 작은 그릇을 {o('두 그릇 사이')}에 넣어요",
                 "고무찰흙에 향을 꽂아 불을 붙이고, 작은 그릇에 연기를 모아요. 향 연기를 모은 작은 그릇을 두 그릇 사이에 넣어요.")
        self.play(FadeIn(inc), FadeIn(safe), run_time=0.7)
        self.settle()
        self.pause_screen(5, "향 연기는 어느 쪽으로 움직일까요?")
        self.play(FadeOut(safe), run_time=0.3)
        t = ValueTracker(0.0)
        smoke = always_redraw(lambda: wb.puffs(t.get_value()).shift(UPS))
        self.say("뚜껑을 열고 향 연기의 움직임을 관찰해요",
                 "작은 그릇의 뚜껑을 열고 향 연기의 움직임을 관찰해요. 모래와 따뜻한 물 바로 위를 살펴봐요.")
        self.play(FadeOut(inc.lid), run_time=0.4)
        self.add(smoke)
        self.play(t.animate.set_value(0.55), run_time=4.0, rate_func=linear)
        arr = wb.flow_arrow().shift(UPS)
        self.say(f"향 연기는 {o('모래 쪽')}에서 {o('따뜻한 물 쪽')}으로 움직였어요",
                 "향 연기는 바닥 가까이에서 모래 쪽에서 따뜻한 물 쪽으로 움직였어요. 향 연기의 움직임은 눈에 보이지 않는 공기의 움직임을 보여 줘요.")
        self.play(t.animate.set_value(0.9), FadeIn(arr), run_time=3.0, rate_func=linear)
        self.settle()
        # 기압과 관련짓기
        b1 = K.hl_badge(True, 0.42).move_to(wb.P(235, 150) + UPS)
        b2 = K.hl_badge(False, 0.42).move_to(wb.P(565, 150) + UPS)
        self.say(f"모래 위는 {hi('고기압')}, 따뜻한 물 위는 {lo('저기압')}이에요",
                 "모래 위쪽은 상대적으로 차가워 공기가 무거우니 고기압, 따뜻한 물 위쪽은 상대적으로 따뜻해 공기가 가벼우니 저기압이에요.")
        self.play(FadeIn(b1, scale=0.6), FadeIn(b2, scale=0.6), run_time=0.7)
        self.settle()
        smoke.clear_updaters()
        rule = K.text_card([f"모래 위쪽의 기압 ＞ 따뜻한 물 위쪽의 기압",
                            f"공기는 {hi('고기압')}에서 {lo('저기압')}으로 이동해요 = {g('바람')}"], w=10.6, size=32)
        rule.move_to([0, 1.15, 0])
        self.say(f"공기는 {hi('고기압')}에서 {lo('저기압')}으로 이동해요",
                 "모래 위쪽의 기압이 따뜻한 물 위쪽의 기압보다 높아요. 공기는 기압이 높은 곳에서 낮은 곳으로 이동해요. 이것이 바람이에요.")
        self.play(FadeOut(arr), FadeIn(rule, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 해풍과 육풍 ──
    def sea_scene(self, night):
        sc = K.sea_land(night, 12.6, 4.7).move_to([0, 0.3, 0])
        top = sc.get_top()[1]
        if night:
            land_t, sea_t = "빨리 식어 온도가 낮아요", "천천히 식어 상대적으로 따뜻해요"
        else:
            land_t, sea_t = "빨리 가열되어 온도가 높아요", "천천히 가열되어 상대적으로 차가워요"
        lc = K.word_card(land_t, 5.0, 0.8, K.COLD if night else K.HOT, 28)
        scc = K.word_card(sea_t, 5.0, 0.8, K.HOT if night else K.COLD, 28)
        lc.move_to([sc.land_x, top - 1.0, 0])
        scc.move_to([sc.sea_x, top - 1.0, 0])
        lb = K.hl_badge(night, 0.4).next_to(lc, DOWN, buff=0.15)
        sb = K.hl_badge(not night, 0.4).next_to(scc, DOWN, buff=0.15)
        y = top - 2.75
        if night:
            arr = K.wind_arrow(2.7, -2.7, y, sw=20)
            name = M(f"{o('육풍')} (육지 → 바다)", 34)
        else:
            arr = K.wind_arrow(-2.7, 2.7, y, sw=20)
            name = M(f"{o('해풍')} (바다 → 육지)", 34)
        name.next_to(arr, DOWN, buff=0.12)
        name_bg = K.R(name.width + 0.3, name.height + 0.2, "#FFFFFF", name.get_x(), name.get_y(), rad=0.1, sw=0, op=0.85)
        return sc, VGroup(lc, scc), VGroup(lb, sb), VGroup(arr, name_bg, name)

    def sea_breeze(self):
        self.section("해풍과 육풍")
        rule = K.text_card([f"육지는 바다보다 {o('빨리 가열')}되고, {o('빨리 식어요')}."], w=10.0, size=36).move_to([0, 1.0, 0])
        self.say(f"육지는 바다보다 빨리 가열되고, 빨리 식어요",
                 "바닷가에서는 낮과 밤에 바람의 방향이 달라요. 육지와 바다는 태양에 의해 똑같이 가열되어도 육지가 바다보다 빨리 가열되고, 빨리 식어요.")
        self.play(FadeIn(rule, scale=0.95), run_time=0.6)
        self.settle()
        self.play(FadeOut(rule), run_time=0.4)
        sc, temps, badges, wind = self.sea_scene(False)
        self.say(f"낮: 육지가 더 따뜻해 {lo('저기압')}, 바다는 {hi('고기압')}",
                 "낮에는 육지가 빨리 가열되어 바다보다 온도가 높아요. 그래서 육지 위는 저기압, 바다 위는 고기압이 돼요.")
        self.play(FadeIn(sc), run_time=0.6)
        self.play(FadeIn(temps), run_time=0.6)
        self.play(FadeIn(badges, scale=0.6), run_time=0.5)
        self.settle()
        self.pause_screen(4, "낮에는 바람이 어느 쪽으로 불까요?")
        self.say(f"낮에는 바다에서 육지로 {o('해풍')}이 불어요",
                 "바람은 고기압에서 저기압으로 불어요. 그래서 낮에는 바다에서 육지 쪽으로 바람이 부는데, 이 바람을 해풍이라고 해요.")
        self.play(GrowArrow(wind[0]), FadeIn(wind[1]), FadeIn(wind[2]), run_time=1.0)
        self.settle()
        clear_stage(self)
        sc, temps, badges, wind = self.sea_scene(True)
        self.say(f"밤: 육지가 빨리 식어 {hi('고기압')}, 바다는 {lo('저기압')}",
                 "밤에는 육지가 빨리 식어 바다보다 온도가 낮아요. 그래서 육지 위는 고기압, 바다 위는 저기압이 돼요.")
        self.play(FadeIn(sc), run_time=0.6)
        self.play(FadeIn(temps), FadeIn(badges, scale=0.6), run_time=0.7)
        self.settle()
        self.say(f"밤에는 육지에서 바다로 {o('육풍')}이 불어요",
                 "그래서 밤에는 육지에서 바다 쪽으로 바람이 불어요. 이 바람을 육풍이라고 해요.")
        self.play(GrowArrow(wind[0]), FadeIn(wind[1]), FadeIn(wind[2]), run_time=1.0)
        self.settle()
        clear_stage(self)
        tb = K.result_table(["구분", "낮", "밤"],
                            [["온도가 높은 곳", "육지 위", "바다 위"],
                             ["기압이 높은 곳", "바다 위", "육지 위"],
                             ["바람이 부는 방향", "바다 → 육지", "육지 → 바다"],
                             ["바람의 이름", o("해풍"), o("육풍")]], [4.0, 3.6, 3.6], row_h=0.78, size=32)
        tb.move_to([0, 0.5, 0])
        self.say(f"낮에는 {o('해풍')}, 밤에는 {o('육풍')}",
                 "정리하면, 낮에는 바다 위가 고기압이 되어 해풍이 불고, 밤에는 육지 위가 고기압이 되어 육풍이 불어요.")
        self.play(FadeIn(tb), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"바람은 {hi('고기압')}에서 {lo('저기압')}으로 붑니다."], w=10.0, size=44).move_to([0, 0.8, 0])
        self.say(f"바람은 {hi('고기압')}에서 {lo('저기압')}으로 불어요",
                 "바람은 고기압에서 저기압으로 불어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)
