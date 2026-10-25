"""「과학 원리 돋보기」 5학년 27화 — 이슬, 안개, 구름 (5-2 2단원 날씨와 우리 생활 4~5차시, 화 코드 5-2-2-b)

바탕: grade5/science/sem2/u2-3.html(원본 _build_tb/src2/u2-3.html) — 도입(차가운 음료 컵 밑 휴지가 젖음, 응결),
이슬 발생 실험(면장갑 → 차가운 캔을 마른 수건 위에 → 표면 닦기 → 관찰: 물방울이 맺히고 커져 흘러내림, 안전),
물방울의 정체(흰 종이: 포도 음료수는 보라색, 캔 물방울은 투명), 안개 발생 실험(미지근한 물 30~40 °C → 향 연기 → 향불 끄기 →
얼음 지퍼 백 → 뿌옇게, 향 연기만 넣은 병과 비교, 향 연기는 응결을 도움), 이슬·안개·구름 높이 비교(물체 표면 · 지표면 가까이 · 높은 곳),
공통점·차이점, 한눈에 쏙(응결, 새벽 안개), 형성 평가 2번(안개는 수증기가 아니라 작은 물방울).
최종: ./make_final.sh s5ep27
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Transform, ValueTracker,
                   always_redraw)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u22 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep27(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 27
    EP_TITLE = "이슬, 안개, 구름"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.dew()
        self.fog()
        self.compare()
        self.summary()
        self.closing(f"이슬, 안개, 구름은 공기 중의 수증기가 {o('응결')}해 생기고\n생기는 {g('위치')}가 달라요",
                     next_preview="5학년 28화 · 고기압과 저기압")
        self.wait(0.5)

    def steps(self, texts, x=3.2, y=0.4, w=6.4):
        cs = VGroup(*[K.word_card(t, w, 0.8, INK, 30) for t in texts]).arrange(DOWN, buff=0.18).move_to([x, y, 0])
        for c in cs:
            c.set_opacity(0.25)
        return cs

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        cup = K.cup_tissue(False).scale(1.75).move_to([0, 0.2, 0])
        self.say("차가운 음료가 든 컵 밑의 휴지가 왜 젖었을까요?",
                 "차가운 음료가 든 컵 밑에 휴지를 놓아두었더니 휴지가 젖었어요. 왜 젖었을까요?")
        self.play(FadeIn(cup), run_time=0.6)
        wet = K.cup_tissue(True).scale(1.75).move_to(cup)
        self.play(Transform(cup, wet), run_time=1.6)
        self.pause_screen(5, "휴지가 왜 젖었을까요?")
        card = K.text_card([f"{o('응결')}: 수증기가 물로 변하는 현상"], size=34).move_to([0, 2.5, 0])
        self.say(f"공기 중의 수증기가 차가운 컵 표면에서 {o('응결')}했어요",
                 "공기 중의 수증기가 차가운 컵 표면에서 응결해 물방울이 되었기 때문이에요. 응결은 수증기가 물로 변하는 현상이에요.")
        self.play(FadeIn(card, shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 이슬 발생 실험 ──
    def dew(self):
        self.section("이슬 실험")
        can = K.can_on_towel(0).scale(1.6).move_to([-3.7, 0.55, 0])
        st = self.steps(["① 면장갑을 껴요", "② 차가운 캔을 마른 수건 위에 놓아요", "③ 마른 수건으로 캔 표면을 닦아요",
                         "④ 캔 표면을 관찰해요"], x=3.0, y=0.75, w=6.6)
        safe = K.safety_note("차가운 캔은 맨손으로 만지지 않고, 바닥에 떨어뜨리지 않아요.", w=12.0, size=28).move_to([0, -2.05, 0])
        self.say("차가운 캔으로 이슬 발생 실험을 해요",
                 "면장갑을 끼고, 냉장고에 넣어 둔 차가운 캔을 마른 수건 위에 놓아요. 캔 표면을 닦은 뒤 관찰해요.")
        self.play(FadeIn(can), FadeIn(st), FadeIn(safe), run_time=0.7)
        for c in st:
            self.play(c.animate.set_opacity(1), run_time=0.45)
            self.wait(0.3)
        self.settle()
        self.pause_screen(5, "캔 표면에 어떤 변화가 생길까요?")
        self.say(f"작은 물방울이 맺히고, 점점 커져 {o('흘러내려요')}",
                 "캔 표면에 작은 물방울이 맺히고, 시간이 지나면서 점점 커져 흘러내렸어요. 수건도 축축해졌어요.")
        for stg in (1, 2, 3):
            self.play(Transform(can, K.can_on_towel(stg).scale(1.6).move_to(can, aligned_edge=DOWN)), run_time=1.0)
        self.settle()
        clear_stage(self)
        # 물방울의 정체
        self.section("물방울의 정체")
        pp = K.paper_test(False).scale(1.2).move_to([0, 1.05, 0])
        self.say("캔 속의 음료수가 새어 나온 걸까요?",
                 "어떤 친구는 캔 속의 음료수가 새어 나온 거라고 말해요. 흰 종이에 포도 음료수와 캔 표면의 물방울을 묻혀 비교해 봐요.")
        self.play(FadeIn(pp), run_time=0.6)
        self.settle()
        pp2 = K.paper_test(True).scale(1.2).move_to(pp)
        self.say(f"물방울은 색깔 없이 투명해요. 음료수가 {r('아니에요')}",
                 "음료수는 보라색인데, 캔 표면의 물방울은 색깔 없이 투명했어요. 물방울은 음료수가 아니에요.")
        self.play(Transform(pp, pp2), run_time=0.8)
        self.settle()
        card = K.text_card([f"캔 주변 공기 중의 {o('수증기')}가 차가운 캔 표면에 닿아 {o('응결')}",
                            f"→ {g('이슬')}이 생기는 모습과 비슷해요"], w=11.6, size=32).move_to([0, -1.7, 0])
        self.say(f"수증기가 차가운 캔 표면에서 응결 → {g('이슬')}과 비슷해요",
                 "캔 주변 공기 중의 수증기가 차가운 캔 표면에 닿아 응결해 물방울로 맺힌 거예요. 이것은 이슬이 생기는 모습과 비슷해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 안개 발생 실험 ──
    def fog(self):
        self.section("안개 실험")
        jx, jy = -3.7, 0.0
        jar = K.fog_jar(0.0, 0.0, False, 0.0).scale(1.2).move_to([jx, jy - 0.3, 0])
        st = self.steps(["① 집기병에 미지근한 물(30~40 °C)을 조금", "② 향 연기를 잠시 넣었다 빼요", "③ 향불은 모래 상자에 넣어 꺼요",
                         "④ 얼음 지퍼 백을 올려요", "⑤ 집기병 안을 관찰해요"], x=3.0, y=0.45, w=6.8)
        self.say("집기병으로 안개 발생 실험을 해요",
                 "보안경과 면장갑을 끼고, 집기병에 김이 나지 않을 정도의 미지근한 물을 조금 넣어요. 30도에서 40도쯤이에요.")
        self.play(FadeIn(jar), FadeIn(st), run_time=0.6)
        self.play(st[0].animate.set_opacity(1), Transform(jar, K.fog_jar(0.15, 0.0, False, 0.0).scale(1.2).move_to(jar, aligned_edge=DOWN)), run_time=0.8)
        self.settle()
        self.say(f"향 연기를 넣고, {o('얼음 지퍼 백')}을 올려요",
                 "향에 불을 붙여 집기병에 잠시 넣었다 빼고, 향불은 모래 상자에 넣어 꼭 꺼요. 향 연기가 빠져나가기 전에 얼음을 넣은 지퍼 백을 올려요.")
        self.play(st[1].animate.set_opacity(1), Transform(jar, K.fog_jar(0.15, 0.8, False, 0.0).scale(1.2).move_to(jar, aligned_edge=DOWN)), run_time=0.8)
        self.play(st[2].animate.set_opacity(1), run_time=0.5)
        self.wait(0.5)
        bagged = K.fog_jar(0.15, 0.8, True, 0.0).scale(1.2)
        bagged.shift(jar.get_bottom() - bagged.get_bottom())
        self.play(st[3].animate.set_opacity(1), Transform(jar, bagged), run_time=0.8)
        self.settle()
        self.play(st[4].animate.set_opacity(1), run_time=0.4)
        self.pause_screen(5, "집기병 안은 어떻게 될까요?")
        fogged = K.fog_jar(0.15, 0.3, True, 1.0).scale(1.2)
        fogged.shift(jar.get_bottom() - fogged.get_bottom())
        self.say(f"집기병 안이 {o('뿌옇게')} 흐려졌어요",
                 "집기병 안이 뿌옇게 흐려졌어요. 그런데 이것이 향 연기 때문일까요?")
        self.play(Transform(jar, fogged), run_time=2.0)
        self.settle()
        clear_stage(self)
        # 향 연기만 넣은 병과 비교
        a = K.fog_jar(0.0, 0.8, False, 0.0)
        b = K.fog_jar(0.15, 0.3, True, 0.4)
        a.move_to([-3.0, 0.4, 0], aligned_edge=DOWN).shift(DOWN * 1.5)
        b.move_to([3.0, 0.4, 0], aligned_edge=DOWN).shift(DOWN * 1.5)
        ta = K.lines("향 연기만 넣고\n입구를 막음", 28).next_to(a, DOWN, buff=0.15)
        tb = K.lines("미지근한 물 + 향 연기\n+ 얼음 지퍼 백", 28).next_to(b, DOWN, buff=0.15)
        VGroup(a, b, ta, tb).shift(UP * 0.3)
        tick = ValueTracker(0)
        clock = always_redraw(lambda: T(f"{int(round(tick.get_value()))}분", 40, ORANGE).move_to([0, 1.2, 0]))
        self.say("향 연기만 넣은 집기병과 비교해 봐요",
                 "향 연기만 넣고 입구를 막은 집기병과 비교해 봐요. 시간이 지나면 어떻게 될까요?")
        self.play(FadeIn(a), FadeIn(b), FadeIn(ta), FadeIn(tb), run_time=0.6)
        self.add(clock)
        a2 = K.fog_jar(0.0, 0.0, False, 0.0).move_to(a, aligned_edge=DOWN)
        b2 = K.fog_jar(0.15, 0.0, True, 1.0)
        b2.shift(b.get_bottom() - b2.get_bottom())
        self.play(tick.animate.set_value(10), Transform(a, a2), Transform(b, b2), run_time=3.0)
        clock.clear_updaters()
        self.settle()
        card = K.text_card([f"공기 중의 수증기가 {o('응결')}해 {o('작은 물방울')}로 떠 있어요 → {g('안개')}와 비슷",
                            f"향 연기는 수증기의 응결이 잘 일어나게 도와줘요"], w=12.2, size=28).move_to([0, 2.15, 0])
        self.say(f"수증기가 응결해 작은 물방울로 떠 있어요 → {g('안개')}와 비슷",
                 "실험한 집기병은 계속 뿌예요. 공기 중의 수증기가 응결해 작은 물방울로 떠 있기 때문이에요. 안개가 생기는 모습과 비슷해요.")
        self.play(FadeOut(clock), VGroup(a, b, ta, tb).animate.scale(0.66).shift(DOWN * 0.75), run_time=0.6)
        self.play(FadeIn(card, shift=DOWN * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)
        mis = K.text_card([f"안개는 눈에 보이지 않는 기체인 수증기일까요?  →  {r('아니요')}",
                           f"안개는 수증기가 응결해 생긴 {g('작은 물방울')}이에요."], w=12.0, size=34).move_to([0, 0.5, 0])
        self.section("생각 바로잡기")
        self.say(f"안개는 수증기가 아니라 {g('작은 물방울')}이에요",
                 "안개는 눈에 보이지 않는 수증기일까요? 아니요. 안개는 수증기가 응결해 생긴 작은 물방울이에요.")
        self.play(FadeIn(mis, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 이슬, 안개, 구름 비교 ──
    def compare(self):
        self.section("비교해요")
        sc = K.sky_heights("dew", 12.8, 4.9).move_to([0, 0.35, 0])
        fog = sc.fog
        clouds = sc.clouds
        self.say(f"{o('이슬')}: 차가워진 물체 표면에 응결해 맺혀요",
                 "이슬은 공기 중의 수증기가 차가워진 물체 표면에 응결해 물방울로 맺힌 거예요.")
        self.play(FadeIn(sc), run_time=0.7)
        l1 = K.label("이슬 (물체의 표면)", "#1C6FA8", 30).move_to([3.4, sc.base + 1.25, 0])
        self.play(Indicate(sc.dew, color=K.WATER_D, scale_factor=1.6), FadeIn(l1), run_time=1.2)
        self.settle()
        l2 = K.label("안개 (지표면 가까이)", "#5B6B78", 30).move_to([-2.2, sc.base + 1.0, 0])
        self.say(f"{o('안개')}: 지표면 가까이에서 응결해 떠 있어요",
                 "안개는 공기 중의 수증기가 지표면 가까이에서 응결해 작은 물방울로 떠 있는 거예요.")
        fog.set_fill(opacity=0.6)
        self.play(FadeIn(fog), FadeIn(l2), run_time=1.0)
        self.bring_to_front(l1, l2)
        self.settle()
        l3 = K.label("구름 (높은 곳)", "#2F6FD6", 30).move_to([-4.3, 1.2, 0])
        self.say(f"{o('구름')}: 높은 곳에서 응결해 떠 있어요",
                 "구름은 공기 중의 수증기가 응결해 지표면으로부터 높은 곳에 작은 물방울로 떠 있는 거예요. 구름에서는 비나 눈이 내릴 수 있어요.")
        self.play(FadeIn(clouds, shift=DOWN * 0.2), FadeIn(l3), run_time=1.0)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"공통점: 모두 공기 중의 수증기가 {o('응결')}해 나타나요",
                            f"차이점: 생기는 {g('위치')}가 달라요",
                            "          이슬은 물체의 표면, 안개는 지표면 가까이, 구름은 높은 곳"],
                           w=12.6, size=32).move_to([0, 0.6, 0])
        self.say(f"공통점은 {o('응결')}, 차이점은 생기는 {g('위치')}예요",
                 "이슬, 안개, 구름은 모두 공기 중의 수증기가 응결해 나타나요. 다른 점은 생기는 위치예요. 안개와 구름은 물방울이 떠 있는 높이로 구분해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"이슬, 안개, 구름은 공기 중의 수증기가 {o('응결')}해 생깁니다."], w=11.8, size=40).move_to([0, 1.2, 0])
        self.say(f"이슬, 안개, 구름은 수증기가 {o('응결')}해 생겨요",
                 "이슬, 안개, 구름은 공기 중의 수증기가 응결해 생겨요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        more = K.text_card([f"새벽에 안개가 잘 생기는 까닭: 기온이 {o('낮아')} 수증기가 잘 응결해요",
                            "(특히 가을과 겨울철)"], w=11.8, size=32).move_to([0, -0.8, 0])
        self.say(f"새벽에는 기온이 {o('낮아')} 안개가 잘 생겨요",
                 "새벽에는 기온이 낮아 공기 중의 수증기가 잘 응결해요. 그래서 특히 가을과 겨울철 새벽에 안개가 잘 생겨요.")
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
