"""「과학 원리 돋보기」 5학년 40화 — 자원과 에너지를 효율적으로 (5-2 4단원 자원과 에너지 6~7차시, 화 코드 5-2-4-d)

바탕: grade5/science/sem2/u4-4.html(원본 _build_tb/src2/u4-4.html) — 도입(일반·센서 수도꼭지, '효율': 같은 밝기에 전기를 적게 쓰는 전등),
자원 조사(물·산림·광물 자원을 효율적으로 이용하는 방법), 에너지 조사(에너지 소비 효율 등급 1~5, 대기 전력, 효율적인 방법),
집 모형 실험(같게 할 조건·다르게 할 조건, 뽁뽁이 한 장 더·우드록·색점토, 손난로로 5분 데운 뒤 1분 간격 5번 — 앱의 지도서 예시 결과
29.8 → 25.5 °C / 29.8 → 27.9 °C, 온도 변화량 4.3 °C · 1.9 °C), 에너지 효율 집(단열재·이중창·삼중창·자동 차양·열 교환기·옥상 정원·
태양 전지판·지열 냉난방), 한눈에 쏙(에너지 효율), 어스아워(매년 3월 마지막 주 토요일 1시간).
최종: ./make_final.sh s5ep40
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, FadeTransform, Indicate, VGroup, Transform,
                   SurroundingRectangle)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u24 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def hot(s):
    return f'<span foreground="{K.HOT}">{s}</span>'


def cold(s):
    return f'<span foreground="{K.COLD}">{s}</span>'


NAVY = "#0F3B5C"


def tagbox(text, size=24):
    t = T(text, size, "#FFFFFF")
    bg = K.R(t.width + 0.3, t.height + 0.22, NAVY, rad=0.1, stroke=None, sw=0)
    t.move_to(bg)
    return VGroup(bg, t)


class S5Ep40(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 40
    EP_TITLE = "자원과 에너지를 효율적으로"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.resources()
        self.energy()
        self.experiment()
        self.eco_house()
        self.summary()
        self.closing(f"자원은 아껴 쓰고 다시 쓰고, 단열이 잘되게 집을 지으면\n{o('에너지 효율')}을 높일 수 있어요",
                     next_preview="5학년 마인드맵 8 · 자원과 에너지")
        self.wait(0.5)

    # ── 궁금해요: 수도꼭지 ──
    def intro(self):
        self.section("궁금해요")
        f1 = K.faucet(True, False, label="일반 수도꼭지").move_to([-3.2, 0.6, 0])
        f2 = K.faucet(True, True, label="센서 수도꼭지").move_to([3.2, 0.6, 0])
        self.say("손을 다 씻은 뒤, 누가 수도꼭지를 잠그는 것을 잊었어요",
                 "두 수도꼭지로 손을 씻었어요. 그런데 손을 다 씻은 뒤에 누가 수도꼭지를 잠그는 것을 잊었어요.")
        self.play(FadeIn(f1), FadeIn(f2), run_time=0.7)
        self.settle()
        self.say("센서 수도꼭지는 물 절약에 어떤 점이 좋을까요?",
                 "움직임을 인식하는 센서 수도꼭지는 물 절약에 어떤 점이 좋을까요?")
        self.pause_screen(4, "센서 수도꼭지의 좋은 점은?")
        f2b = K.faucet(False, True, label="센서 수도꼭지").move_to(f2)
        n1 = T("물이 계속 버려져요", 30, RED).next_to(f1, DOWN, buff=0.2)
        n2 = T("물이 바로 멈췄어요", 30, GREEN).next_to(f2, DOWN, buff=0.2)
        self.say(f"손이 멀어지면 물이 바로 멈춰 {g('낭비되는 물을 줄여요')}",
                 "센서 수도꼭지는 손이 멀어지면 물이 바로 멈춰서 낭비되는 물을 줄여요.")
        self.play(FadeTransform(f2, f2b), FadeIn(n1), FadeIn(n2), run_time=0.9)
        self.settle()
        clear_stage(self)
        l1 = K.icard(K.led_bulb(True), "전기를 적게 쓰는 전등", 4.4, 3.0, stroke=GREEN)
        l2 = K.icard(K.lamp(True), "전기를 많이 쓰는 전등", 4.4, 3.0)
        VGroup(l1, l2).arrange(RIGHT, buff=0.8).move_to([0, 0.9, 0])
        cap = T("같은 밝기", 32, SOFT).next_to(VGroup(l1, l2), UP, buff=0.2)
        self.say(f"같은 밝기라면 전기를 적게 쓰는 전등이 {o('효율')}이 좋아요",
                 "같은 밝기를 내는 두 전등 가운데 전기를 적게 쓰는 전등이 효율이 좋은 전등이에요. 오늘은 자원과 에너지를 효율적으로 이용하는 방법을 알아봐요.")
        self.play(FadeIn(cap), FadeIn(l1), FadeIn(l2), run_time=0.7)
        self.play(Create(SurroundingRectangle(l1, color=GREEN, buff=0.08, stroke_width=8, corner_radius=0.2)), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 자원을 효율적으로 ──
    def resources(self):
        self.section("조사해요")
        cols = [K.WATER_C, K.FOREST_C, K.MINERAL_C]
        heads = ["물 자원", "산림 자원", "광물 자원"]
        pics = [K.rain_barrel(), K.paper_back(), K.recycle_item("can")]
        items = [["설거지·양치할 때 물 받아 쓰기", "절수 장치로 사용량 줄이기", "빗물 저금통으로 다시 쓰기"],
                 ["목재 제품 고쳐 다시 쓰기", "이면지 활용하기", "손수건·다회용 컵 쓰기"],
                 ["재활용을 위한 분리배출", "석탄 대신 재생 에너지", "대체 자원 개발하기"]]
        bins = VGroup(*[K.res_bin(h, 4.4, 4.6, c, p, 32) for h, c, p in zip(heads, cols, pics)]).arrange(RIGHT, buff=0.15)
        bins.move_to([0, 0.5, 0])
        self.say(f"자원은 {o('아껴 쓰고')}, {o('다시 쓰고')}, {o('재활용')}해요",
                 "자원을 효율적으로 이용하는 방법을 조사해 봐요. 물은 받아서 쓰고 빗물을 다시 쓰고, 종이는 이면지로 활용하고 다회용 컵을 쓰고, 광물 자원은 분리배출해 재활용하고 대체 자원을 개발해요.")
        self.play(FadeIn(bins), run_time=0.5)
        for i in range(3):
            cs = VGroup(*[K.chip_card(t, cols[i], 23, w=4.1, h=0.72) for t in items[i]]).arrange(DOWN, buff=0.16)
            cs.next_to(bins[i].head, DOWN, buff=0.35)
            self.play(FadeIn(cs, shift=DOWN * 0.2, lag_ratio=0.2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 에너지를 효율적으로 ──
    def energy(self):
        lab = K.grade_label(1, 3.6).move_to([-3.9, 0.5, 0])
        txt = K.text_card([f"{o('에너지 소비 효율 등급')}: 1~5등급",
                           f"{g('1등급')}에 가까울수록 효율이 높아요",
                           "→ 같은 크기면 1등급 냉장고가 에너지를 더 절약해요"], w=8.4, size=28).move_to([2.6, 0.9, 0])
        self.say(f"{g('1등급')}에 가까울수록 에너지 소비 효율이 높아요",
                 "전기 제품에는 에너지 사용량에 따라 1등급부터 5등급까지 에너지 소비 효율 등급이 표시돼요. 1등급에 가까울수록 효율이 높아서, 크기가 같다면 1등급 냉장고가 에너지를 더 절약해요.")
        self.play(FadeIn(lab), FadeIn(txt, shift=LEFT * 0.2), run_time=0.8)
        self.settle()
        stand = K.text_card([f"{o('대기 전력')}: 전원을 끈 상태에서 플러그를 꽂아 두기만 해도 쓰이는 전기"], w=8.4, size=26)
        stand.move_to([2.6, -1.25, 0])
        self.say(f"전원을 꺼도 플러그를 꽂아 두면 {r('대기 전력')}이 쓰여요",
                 "전원을 끈 상태에서 플러그를 꽂아 두기만 해도 소모되는 전기를 대기 전력이라고 해요.")
        self.play(FadeIn(stand, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 집 모형 실험 ──
    def experiment(self):
        self.section("실험해요")
        h1 = K.model_house(1, name="단열하지 않은 집 모형", temp="--.-").move_to([-3.4, 0.35, 0])
        h2 = K.model_house(1, name="단열을 한 집 모형", temp="--.-").move_to([3.4, 0.35, 0])
        self.say("집 모형 두 개로 단열의 효과를 알아봐요",
                 "크기와 모양이 같은 집 모형 두 개를 만들고, 두 집 모형의 창문에 뽁뽁이를 한 장씩 붙여요.")
        self.play(FadeIn(h1), FadeIn(h2), run_time=0.7)
        self.settle()
        h2b = K.model_house(2, True, True, name="단열을 한 집 모형", temp="--.-").move_to(h2)
        tags = VGroup(K.chip_card("뽁뽁이 한 장 더", K.COLD, 24), K.chip_card("벽·지붕에 우드록", "#A07A2A", 24),
                      K.chip_card("색점토로 틈 막기", K.CLAY, 24)).arrange(DOWN, buff=0.15).move_to([0, 0.6, 0])
        self.say(f"한 집 모형만 {o('단열')}해요 — 다르게 할 조건은 단열한 정도뿐",
                 "한 집 모형에만 뽁뽁이를 한 장 더 붙이고, 우드록과 색점토로 단열을 해요. 단열한 정도만 다르게 하고, 나머지 조건은 모두 같게 해요.")
        self.play(FadeIn(tags, lag_ratio=0.3), FadeTransform(h2, h2b), run_time=1.2)
        self.settle()
        self.play(FadeOut(tags), run_time=0.3)
        w1 = K.model_house(1, warm=True, name="단열하지 않은 집 모형", temp="29.8").move_to(h1)
        w2 = K.model_house(2, True, True, True, "29.8", "단열을 한 집 모형").move_to(h2)
        self.say("손난로를 넣고 5분 동안 데우면 둘 다 29.8 °C",
                 "두 집 모형에 탐침 온도계를 꽂고, 따뜻한 손난로를 넣어 5분 동안 데워요. 두 집 모형 안의 온도가 모두 29.8도가 되었어요.")
        self.play(FadeTransform(h1, w1), FadeTransform(h2b, w2), run_time=1.0)
        self.settle()
        self.pause_screen(5, "어느 쪽이 더 천천히 식을까요?")
        c1 = K.model_house(1, name="단열하지 않은 집 모형").move_to(w1)
        c2 = K.model_house(2, True, True, False, None, "단열을 한 집 모형").move_to(w2)
        t1 = K.temp_text("29.8", c1.disp)
        t2 = K.temp_text("29.8", c2.disp)
        self.remove(w1, w2)
        self.add(c1, c2, t1, t2)
        clock = T("처음", 34, INK).move_to([0, 2.2, 0])
        self.say("손난로를 빼고 1분 간격으로 5번 온도를 재요", "손난로를 빼고, 1분 간격으로 5번 집 모형 안의 온도를 재요.")
        self.play(FadeIn(clock), run_time=0.3)
        for m in range(1, 6):
            n1 = K.temp_text(f"{K.LT[m]:.1f}", c1.disp)
            n2 = K.temp_text(f"{K.RT[m]:.1f}", c2.disp)
            nc = T(f"{m}분 뒤", 34, INK).move_to(clock)
            self.play(Transform(t1, n1), Transform(t2, n2), Transform(clock, nc), run_time=0.5)
            self.wait(0.45)
        self.settle()
        clear_stage(self)
        # 결과: 그래프 + 변화량
        gr = K.temp_lines(6.2, 3.4).move_to([-3.0, 0.45, 0])
        k1 = M(f"{hot('―')} 단열하지 않은 집", 26).move_to([3.9, 2.3, 0])
        k2 = M(f"{cold('―')} 단열을 한 집", 26).next_to(k1, DOWN, buff=0.15, aligned_edge=LEFT)
        note = T("(지도서 예시 결과)", 22, SOFT).next_to(k2, DOWN, buff=0.15, aligned_edge=LEFT)
        self.say(f"단열을 한 집 모형의 온도가 {g('더 천천히')} 낮아졌어요",
                 "결과를 꺾은선으로 나타내 볼까요? 단열을 한 집 모형의 온도가 더 천천히 낮아졌어요.")
        self.play(FadeIn(gr.ax), FadeIn(gr[0]), FadeIn(gr[1]), FadeIn(gr[3]), FadeIn(k1), FadeIn(k2), FadeIn(note), run_time=0.6)
        self.play(Create(gr.l1), Create(gr.l2), FadeIn(gr.d1), FadeIn(gr.d2), run_time=1.6)
        self.settle()
        res = K.text_card([f"{hot('단열하지 않은 집')}: 29.8 − 25.5 = {hot('4.3 °C')}",
                           f"{cold('단열을 한 집')}: 29.8 − 27.9 = {cold('1.9 °C')}"], w=5.6, size=28).move_to([3.95, -0.7, 0])
        self.say(f"온도 변화량: {hot('4.3 °C')} 와 {cold('1.9 °C')}",
                 "온도 변화량은 처음 온도에서 5분 뒤의 온도를 빼서 구해요. 단열하지 않은 집 모형은 4.3도, 단열을 한 집 모형은 1.9도 낮아졌어요.")
        self.play(FadeIn(res, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"단열을 하면 집 안의 온도가 {g('잘 유지')}되어",
                            f"에너지를 더 {o('효율적')}으로 이용할 수 있어요"], w=10.0, size=38).move_to([0, 0.8, 0])
        self.say(f"단열을 하면 온도가 잘 유지되어 에너지를 {o('효율적')}으로 이용해요",
                 "단열을 하면 집 안의 온도가 잘 유지되어 에너지를 더 효율적으로 이용할 수 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 에너지 효율 집 ──
    def eco_house(self):
        self.section("에너지 효율 집")
        h = K.eco_house(8.6).move_to([0, 0.3, 0])
        sp = h.spots
        tg = {
            "ins": tagbox("단열재").next_to(sp["ins"], LEFT, buff=0.12),
            "win": tagbox("이중창·삼중창").next_to(sp["win"], DOWN, buff=0.1),
            "sh": tagbox("자동 차양").move_to(h.P(150, 128) + LEFT * 0.9 + UP * 0.25),
            "gd": tagbox("옥상 정원").move_to(h.P(215, 80)),
            "hx": tagbox("열 교환기").next_to(sp["hx"], UP, buff=0.1),
            "pv": tagbox("태양 전지판").move_to(h.P(430, 52)),
            "geo": tagbox("지열 냉난방").next_to(sp["geo"], RIGHT, buff=0.12),
        }
        self.play(FadeIn(h), run_time=0.6)
        self.say(f"단열재·이중창·차양·열 교환기·옥상 정원 → {g('에너지가 빠져나가지 않게')}",
                 "에너지를 효율적으로 이용하는 집이에요. 단열재, 이중창이나 삼중창, 자동 차양, 열 교환기, 옥상 정원은 에너지가 빠져나가지 않게 막아 줘요.")
        self.play(*[FadeIn(tg[k], shift=DOWN * 0.1) for k in ("ins", "win", "sh", "gd", "hx")], run_time=0.9)
        self.settle()
        self.say(f"태양 전지판·지열 냉난방 → {g('에너지를 직접 만들어요')}",
                 "태양 전지판과 지열 냉난방 설비는 태양 빛과 땅속의 열로 에너지를 직접 만들어 써요.")
        self.play(FadeIn(tg["pv"], shift=DOWN * 0.1), FadeIn(tg["geo"], shift=DOWN * 0.1), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 + 어스아워 + 우리가 할 수 있는 일 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"단열이 잘되게 집을 지으면 {o('에너지 효율')}을 높일 수 있습니다."], w=11.6, size=40).move_to([0, 0.9, 0])
        self.say(f"단열이 잘되게 집을 지으면 {o('에너지 효율')}을 높일 수 있어요",
                 "단열이 잘되게 집을 지으면 에너지 효율을 높일 수 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)
        self.section("우리가 할 수 있는 일")
        a = K.night_city(True, 4.6)
        b = K.night_city(False, 4.6)
        VGroup(a, b).arrange(RIGHT, buff=1.0).move_to([0, 1.2, 0])
        arr = K.arrow_lr(a.get_right()[0] + 0.1, b.get_left()[0] - 0.1, 1.2, SOFT, 8)
        cap = T("매년 3월 마지막 주 토요일, 1시간 동안 불 끄기 (어스아워)", 30, INK).next_to(VGroup(a, b), DOWN, buff=0.3)
        self.say(f"어스아워처럼 함께 {g('실천')}해요",
                 "매년 3월 마지막 주 토요일에는 1시간 동안 전 세계에서 불을 끄는 어스아워 캠페인을 해요. 에너지 절약의 필요성을 알고 함께 실천하기 위해서예요. 우리도 오늘 알게 된 방법을 집과 학교에서 실천해 봐요.")
        self.play(FadeIn(a), run_time=0.5)
        self.play(Create(arr), FadeIn(b), FadeIn(cap), run_time=0.9)
        tips = VGroup(*[K.chip_card(t, GREEN, 26) for t in ("물 받아 쓰기", "이면지 활용", "플러그 뽑기", "1등급 제품 쓰기")]).arrange(RIGHT, buff=0.25)
        tips.next_to(cap, DOWN, buff=0.3)
        self.play(FadeIn(tips, lag_ratio=0.2), run_time=0.8)
        self.settle()
        clear_stage(self)
