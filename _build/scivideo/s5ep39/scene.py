"""「과학 원리 돋보기」 5학년 39화 — 에너지를 지속가능하게 쓰려면? (5-2 4단원 자원과 에너지 5차시, 화 코드 5-2-4-c)

바탕: grade5/science/sem2/u4-3.html(원본 _build_tb/src2/u4-3.html) — 도입(이동 수업으로 빈 교실의 전등·컴퓨터·텔레비전·선풍기 끄기,
불필요한 에너지 사용 줄이기, '지속가능'의 뜻 「과학」 93쪽), 에너지 이용 경험, 에너지 이용 놀이(지속가능하게 이용한 예 → 사다리,
낭비하거나 함부로 이용한 예 → 미끄럼틀; 「실험관찰」 83쪽 칸 글), 토의 ①(문제점·지속가능하게 이용해야 하는 까닭),
토의 ②(재생 에너지 얻기·친환경 기술 개발·생활 속 에너지 절약), 형성 평가 1번(플러그를 항상 꽂아 둔다 ×),
한눈에 쏙(지속가능), 학교에서 실천할 수 있는 방법(예시 답).
최종: ./make_final.sh s5ep39
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, FadeTransform, Indicate, VGroup

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


SLIDE = "#E07A3C"


class S5Ep39(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 39
    EP_TITLE = "에너지를 지속가능하게 쓰려면?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.game()
        self.why()
        self.ways()
        self.fix()
        self.summary()
        self.closing(f"재생 에너지를 쓰고 에너지를 절약하면\n에너지를 {o('지속가능')}하게 이용할 수 있어요",
                     next_preview="5학년 40화 · 자원과 에너지를 효율적으로")
        self.wait(0.5)

    # ── 궁금해요: 빈 교실 ──
    def intro(self):
        self.section("궁금해요")
        room = K.classroom(None, 10.4, 4.4).move_to([0, 0.55, 0])
        self.say("이동 수업을 갔는데 전기 기구가 켜져 있어요",
                 "모두 이동 수업을 가서 교실이 비었어요. 그런데 전등, 컴퓨터, 텔레비전, 선풍기가 켜져 있어요.")
        self.play(FadeIn(room), run_time=0.7)
        self.settle()
        self.say("사람이 없는 교실의 전기 기구를 꺼야 하는 까닭은?",
                 "사람이 없는 교실의 전기 기구를 꺼야 하는 까닭은 무엇일까요?")
        self.pause_screen(4, "전기 기구를 꺼야 하는 까닭은?")
        off = K.classroom(set(), 10.4, 4.4).move_to(room)
        self.say(f"{g('불필요한 에너지 사용')}을 줄여야 하기 때문이에요",
                 "전기 기구를 모두 꺼요. 불필요한 에너지 사용을 줄여야 하기 때문이에요.")
        self.play(FadeTransform(room, off), run_time=1.2)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"{o('지속가능')}: 현재 세대의 필요를 충족하면서도",
                            "미래 세대가 사용할 에너지를 보존하는 것  (「과학」 93쪽)"], w=11.6, size=36).move_to([0, 0.8, 0])
        self.say(f"{o('지속가능')}: 미래 세대가 쓸 에너지도 보존하는 것",
                 "지속가능이란 현재 세대의 필요를 충족하면서도 미래 세대가 사용할 에너지를 보존하는 것을 말해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 에너지 이용 놀이: 사다리 · 미끄럼틀 ──
    def game(self):
        self.section("활동해요")
        bins = VGroup(K.res_bin("지속가능하게 이용", 6.4, 4.2, GREEN, K.ladder(1.0)),
                      K.res_bin("낭비하거나 함부로 이용", 6.4, 4.2, SLIDE, K.slide(1.0))).arrange(RIGHT, buff=0.3).move_to([0, 0.7, 0])
        self.say("에너지 이용 놀이: 칸에 따라 사다리 또는 미끄럼틀",
                 "에너지 이용 놀이를 해요. 도착한 칸이 에너지를 지속가능하게 이용한 예면 사다리를 타고, 낭비하거나 함부로 이용한 예면 미끄럼틀을 타요.")
        self.play(FadeIn(bins), run_time=0.6)
        self.settle()
        good = ["냉난방할 때 적정 온도를 유지해요", "수력·풍력 같은 재생 에너지를 이용해요", "가까운 곳은 걷거나 자전거를 타요",
                "친환경 제품을 이용해요"]
        bad = ["창문을 열고 난방을 해요", "빈방에 조명을 켜 두어요", "가까운 거리도 항상 자동차를 타요",
               "보지 않는 텔레비전을 켜 두어요"]
        gc = VGroup(*[K.chip_card(t, GREEN, 24, w=6.0, h=0.66) for t in good]).arrange(DOWN, buff=0.14)
        bc = VGroup(*[K.chip_card(t, SLIDE, 24, w=6.0, h=0.66) for t in bad]).arrange(DOWN, buff=0.14)
        gc.next_to(bins[0].head, DOWN, buff=0.25)
        bc.next_to(bins[1].head, DOWN, buff=0.25)
        q = VGroup(gc[0].copy(), bc[1].copy()).arrange(RIGHT, buff=0.5).move_to([0, -2.0, 0])
        self.say("이 칸들은 어느 쪽일까요?",
                 "냉난방할 때 적정 온도를 유지하는 칸과 빈방에 조명을 켜 두는 칸은 어느 쪽일까요?")
        self.play(FadeIn(q, shift=UP * 0.2), run_time=0.5)
        self.pause_screen(4, "사다리일까요, 미끄럼틀일까요?")
        self.play(FadeOut(q), run_time=0.3)
        self.say(f"에너지를 아끼거나 재생 에너지를 쓰면 {g('사다리')}",
                 "에너지를 아끼거나 재생 에너지를 쓰는 일은 지속가능하게 이용한 예라 사다리를 타고 올라가요.")
        self.play(FadeIn(gc, shift=DOWN * 0.2, lag_ratio=0.2), run_time=1.0)
        self.settle()
        self.say(f"에너지를 낭비하면 {r('미끄럼틀')}",
                 "쓰지 않는 전기 기구를 켜 두거나 에너지를 낭비하는 일은 미끄럼틀을 타고 내려가요.")
        self.play(FadeIn(bc, shift=DOWN * 0.2, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 토의 ①: 까닭 ──
    def why(self):
        self.section("토의해요")
        prob = K.text_card([f"자원은 {r('한정')}되어 있는데 에너지를 이용하는 곳이 많아요",
                            f"석탄·석유로 얻은 에너지는 {r('환경오염')}과 {r('기후변화')}를 일으켜요"], w=12.4, size=32)
        prob.move_to([0, 1.6, 0])
        self.say("우리가 에너지를 이용하는 모습에는 어떤 문제점이 있을까요?",
                 "우리가 에너지를 이용하는 모습에는 어떤 문제점이 있을까요? 자원은 한정되어 있는데 에너지를 이용하는 곳이 많고, 석탄, 석유로 얻은 에너지는 환경오염과 기후변화를 일으켜요.")
        self.play(FadeIn(prob, shift=DOWN * 0.2), run_time=0.7)
        self.settle()
        reasons = VGroup(K.icard(K.windmill(1.3, 0.55), "재생 에너지는\n고갈될 위험이 적어요", 4.0, 2.6, stroke=GREEN),
                         K.icard(K.forest(4, 1.6, 0.8), "에너지 부족·환경오염\n문제 해결에 도움", 4.0, 2.6, stroke=GREEN),
                         K.icard(K.kid("#2F6FD6"), "미래 세대도\n깨끗한 에너지를 써요", 4.0, 2.6, stroke=GREEN)).arrange(RIGHT, buff=0.3)
        reasons.move_to([0, -1.0, 0])
        self.say(f"그래서 에너지를 {o('지속가능')}하게 이용해야 해요",
                 "그래서 에너지를 지속가능하게 이용해야 해요. 재생 에너지는 고갈될 위험이 적고, 에너지 부족과 환경오염 문제 해결에 도움이 되며, 미래 세대도 깨끗한 에너지를 쓸 수 있어요.")
        self.play(FadeIn(reasons, lag_ratio=0.25), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 토의 ②: 방법 세 가지 ──
    def ways(self):
        cols = [GREEN, "#2F6FD6", ORANGE]
        heads = ["재생 에너지 얻기", "친환경 기술 개발", "생활 속 에너지 절약"]
        pics = [K.solar_panel(1.6), K.h2_car(), K.lamp(False)]
        bins = VGroup(*[K.res_bin(h, 4.4, 4.4, c, p, 30) for h, c, p in zip(heads, cols, pics)]).arrange(RIGHT, buff=0.15)
        bins.move_to([0, 0.55, 0])
        items = [["집 지붕에 태양 전지판", "바람이 많은 곳에서 풍력"],
                 ["수소차, 전기차 개발", "오염 물질을 적게 내는 기술"],
                 ["불필요한 전등 끄기", "냉난방 적정 온도 유지", "안 쓰는 플러그 뽑기"]]
        narr = ["첫째, 재생 에너지를 얻어요. 집 지붕에 태양 전지판을 설치하고, 바람이 많이 부는 곳에서는 풍력으로 에너지를 얻어요.",
                "둘째, 환경을 덜 오염시키고 에너지 사용량을 줄이는 친환경 기술을 개발해요. 수소차, 전기차가 그 예예요.",
                "셋째, 일상생활에서 불필요한 에너지 사용을 줄여요. 전등을 끄고, 적정 온도를 지키고, 쓰지 않는 플러그를 뽑아요."]
        self.say("에너지를 지속가능하게 이용하는 방법은?",
                 "에너지를 지속가능하게 이용할 방법을 세 가지로 나누어 볼까요?")
        self.play(FadeIn(bins), run_time=0.6)
        self.settle()
        for i in range(3):
            cs = VGroup(*[K.chip_card(t, cols[i], 24, w=4.1, h=0.7) for t in items[i]]).arrange(DOWN, buff=0.16)
            cs.next_to(bins[i].head, DOWN, buff=0.3)
            self.say(f"{['①', '②', '③'][i]} {heads[i]}", narr[i])
            self.play(Indicate(bins[i].head, color=cols[i]), FadeIn(cs, shift=DOWN * 0.2, lag_ratio=0.2), run_time=1.0)
            self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def fix(self):
        self.section("생각 바로잡기")
        q = K.chip_card("전기 기구를 쓰지 않을 때는 항상 플러그를 꽂아 둔다.", INK, 32, w=11.0, h=0.95).move_to([-0.5, 2.1, 0])
        pl = K.fit(K.plug(False), 2.6, 1.2).move_to([0, 0.4, 0])
        self.say("지속가능하게 이용하는 방법일까요?",
                 "전기 기구를 사용하지 않을 때는 항상 콘센트에 플러그를 꽂아 둔다. 에너지를 지속가능하게 이용하는 방법일까요?")
        self.play(FadeIn(q), FadeIn(pl), run_time=0.6)
        self.pause_screen(4, "맞을까요, 틀릴까요?")
        x = K.ox_mark(False, 0.32).next_to(q, RIGHT, buff=0.25)
        pl2 = K.fit(K.plug(True), 2.6, 1.2).move_to(pl)
        self.say(f"{r('아니에요')}! 쓰지 않는 전기 기구는 {g('플러그를 뽑아요')}",
                 "아니에요. 쓰지 않는 전기 기구의 플러그를 뽑아야 불필요한 에너지 사용을 줄일 수 있어요.")
        self.play(Create(x), FadeTransform(pl, pl2), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 + 학교에서 실천 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"재생 에너지를 사용하고 에너지를 절약하는 것은",
                            f"에너지를 {o('지속가능')}하게 이용하는 방법입니다."], w=11.0, size=40).move_to([0, 0.8, 0])
        self.say(f"재생 에너지 사용과 에너지 절약 = {o('지속가능')}한 이용",
                 "재생 에너지를 사용하고 에너지를 절약하는 것은 에너지를 지속가능하게 이용하는 방법이에요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)
        self.section("우리가 할 수 있는 일")
        tips = VGroup(K.icard(K.ceiling_light(False), "이동 수업 때\n교실 전등 끄기", 3.9, 3.0),
                      K.icard(K.heater_door(), "겨울철에는\n교실 문 닫기", 3.9, 3.0),
                      K.icard(K.plug(True), "쓰지 않는 전기 기구\n플러그 뽑기", 3.9, 3.0)).arrange(RIGHT, buff=0.35).move_to([0, 0.8, 0])
        self.say(f"학교에서도 {g('오늘부터 실천')}해 봐요",
                 "학교에서도 실천할 수 있어요. 이동 수업을 할 때 교실의 전등을 끄고, 겨울철에는 교실의 열이 빠져나가지 않게 문을 닫고, 쓰지 않는 전기 기구는 플러그를 뽑아 둬요.")
        self.play(FadeIn(tips, lag_ratio=0.25), run_time=1.2)
        self.settle()
        clear_stage(self)
