"""「과학 원리 돋보기」 5학년 30화 — 온도계로 온도 재기 (5-2 3단원 열과 우리 생활 2차시, 화 코드 5-2-3-a)

바탕: grade5/science/sem2/u3-1.html(원본 _build_tb/src2/u3-1.html) — 도입(펭귄·사막여우, 온도 · 단위 °C),
손으로 만지기(물 약간 따뜻·주스 차가움, 정확히 말할 수 없음), 탐침 온도계(물 30.1 °C · 주스 13.5 °C, 벽면·바닥에 닿지 않게),
온도 읽기(섭씨 삼십 점 일 도), 알코올 온도계(액체 기둥이 멈출 때까지, 눈높이, 과학실 21.5 °C),
적외선 온도계(복도 계단 19.8 °C, 레이저 빛 눈 주의), 알맞은 온도계(화단 흙 20.7 · 과학실 21.5 · 계단 19.8, 지도서 예시 값),
생활 속 온도계 4가지, 생각 바로잡기(여러 종류의 온도계로 잴 수 있음), 한눈에 쏙(온도).
최종: ./make_final.sh s5ep30
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Line,
                   SurroundingRectangle, Transform, Dot)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep30(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 30
    EP_TITLE = "온도계로 온도 재기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.touch()
        self.probe()
        self.alcohol_ir()
        self.choose()
        self.life()
        self.summary()
        self.closing(f"{o('온도')}는 물체의 따뜻하거나 차가운 정도를 나타내고,\n온도계를 사용하여 측정해요",
                     next_preview="5학년 31화 · 온도가 다른 두 물체가 만나면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        pot = K.cup("#F7B2A5", "끓는 물", steam=True).move_to([-2.6, 0.7, 0])
        ice = K.cup("#A9D4F2", "얼음물", ice=True).move_to([2.6, 0.7, 0])
        self.say("끓는 물은 뜨겁고 얼음물은 차가워요",
                 "끓는 물은 뜨겁고 얼음물은 차가워요. 물체의 따뜻하거나 차가운 정도는 무엇으로 나타낼까요?")
        self.play(FadeIn(pot, shift=RIGHT * 0.3), FadeIn(ice, shift=LEFT * 0.3), run_time=0.8)
        self.pause_screen(4, "따뜻하거나 차가운 정도는 무엇으로?")
        card = K.text_card([f"물체의 따뜻하거나 차가운 정도 → {o('온도')}",
                            f"온도의 단위: {o('°C')} (섭씨도)"], size=38).move_to([0, -1.35, 0])
        self.say(f"따뜻하거나 차가운 정도는 {o('온도')}, 단위는 {o('°C(섭씨도)')}",
                 "물체의 따뜻하거나 차가운 정도를 온도로 나타내요. 온도의 단위는 섭씨도를 사용해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 손으로 만지기 ──
    def touch(self):
        self.section("손으로 느끼기")
        w = K.cup(K.WATER, "물").move_to([-2.4, 0.6, 0])
        j = K.cup(K.JUICE, "주스", ice=True).move_to([2.4, 0.6, 0])
        t1 = T("약간 따뜻해요", 32, "#C0392B").next_to(w, UP, buff=0.25)
        t2 = T("차가워요", 32, K.COLD).next_to(j, UP, buff=0.25)
        self.say("물과 주스가 든 컵을 손으로 만져 봐요",
                 "물과 주스가 든 컵을 각각 손으로 만져 봐요. 물이 든 컵은 약간 따뜻하고, 주스가 든 컵은 차가워요.")
        self.play(FadeIn(w), FadeIn(j), run_time=0.6)
        self.play(FadeIn(t1), FadeIn(t2), run_time=0.6)
        self.settle()
        q = T("몇 °C인지 정확하게 말할 수 있을까요?", 36).move_to([0, -1.75, 0])
        self.play(FadeIn(q), run_time=0.4)
        self.say(f"손으로는 따뜻하고 차가운 정도만 {r('어림')}할 수 있어요",
                 "손으로 만지면 따뜻한지 차가운지는 말할 수 있지만, 정확한 온도는 알기 어려워요. 그래서 온도계를 사용해요.")
        self.play(Indicate(q, color=RED, scale_factor=1.08), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 탐침 온도계 ──
    def probe(self):
        self.section("탐침 온도계")
        w = K.cup(K.WATER, "물", w=1.9, h=2.0).move_to([-1.0, -0.8, 0])
        j = K.cup(K.JUICE, "주스", w=1.9, h=2.0).move_to([2.6, -0.8, 0])
        th = K.probe_thermo("", on=True, probe=1.7, s=1.15).move_to([-5.0, 1.0, 0])
        self.say("탐침 온도계로 물과 주스의 온도를 재요",
                 "탐침 온도계의 뚜껑을 열고 전원을 켠 뒤, 탐침을 물에 넣어요. 탐침은 어디까지 넣어야 할까요?")
        self.play(FadeIn(w), FadeIn(j), FadeIn(th), run_time=0.7)
        self.settle()
        tip = VGroup(*[T(s_, 26, c_) for s_, c_ in (("바닥에 닿게 ×", RED), ("벽면에 기대어 ×", RED),
                                                    ("벽면·바닥에 닿지 않게 액체 속에 충분히 ○", GREEN))]
                     ).arrange(DOWN, aligned_edge=LEFT, buff=0.14).move_to([3.2, 2.0, 0])
        self.play(th.animate.move_to([-1.0, 1.0, 0]), run_time=0.8)
        self.say(f"탐침은 {g('벽면이나 바닥에 닿지 않게')} 액체 속에 넣어요",
                 "탐침은 컵 벽면이나 바닥에 닿지 않게, 측정하려는 액체 속에 충분히 넣어요.")
        self.play(FadeIn(tip, shift=LEFT * 0.2), run_time=0.6)
        self.play(Transform(th.txt, K.probe_txt(th, "30.1")), run_time=1.2)
        self.settle()
        self.say(f"물 {o('30.1 °C')}, 주스 {o('13.5 °C')}",
                 "물의 온도는 30.1도, 주스의 온도는 13.5도예요. 물이 주스보다 온도가 높아요.")
        rw = T("30.1 °C", 36, "#C0392B").next_to(w, LEFT, buff=0.3)
        self.play(FadeIn(rw), FadeOut(tip), th.animate.move_to([2.6, 1.0, 0]), run_time=0.8)
        self.play(Transform(th.txt, K.probe_txt(th, "13.5")), run_time=1.0)
        rj = T("13.5 °C", 36, K.COLD).next_to(j, RIGHT, buff=0.3)
        self.play(FadeIn(rj), run_time=0.4)
        self.settle()
        read = K.text_card([f"30.1 °C → '{o('섭씨 삼십 점 일 도')}'"], size=38).move_to([0, 2.3, 0])
        self.say(f"30.1 °C는 '{o('섭씨 삼십 점 일 도')}'라고 읽어요",
                 "온도 표시 창의 숫자 뒤에 섭씨도가 붙어 있어요. 30.1도는 섭씨 삼십 점 일 도라고 읽어요.")
        self.play(FadeOut(th), FadeIn(read), run_time=0.6)
        self.settle()
        safe = K.safety_note("탐침의 뾰족한 부분이 사람을 향하지 않게 해요. 쓴 뒤에는 전원을 끄고 물기를 닦아 뚜껑을 닫아요.",
                             w=12.6, size=26).move_to([0, 1.2, 0])
        self.say("탐침 온도계를 쓸 때는 안전에 주의해요",
                 "탐침 온도계의 뾰족한 부분이 사람을 향하지 않도록 주의해요. 사용한 뒤에는 전원을 끄고 물기를 닦아 말린 뒤 뚜껑을 닫아 보관해요.")
        self.play(FadeIn(safe), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 알코올·적외선 온도계 ──
    def alcohol_ir(self):
        self.section("알코올·적외선 온도계")
        al = K.alcohol_thermo(0.0, h=4.6).move_to([-4.6, 0.3, 0])
        n1 = T("알코올 온도계", 30, INK).next_to(al, RIGHT, buff=0.3).shift(UP * 1.8)
        self.say("알코올 온도계는 액체 기둥이 멈출 때까지 기다려요",
                 "과학실 벽에 걸린 알코올 온도계예요. 빨간색 액체 기둥이 움직이다가 멈출 때까지 기다려요.")
        self.play(FadeIn(al), FadeIn(n1), run_time=0.6)
        self.play(Transform(al.col, al.col_for(21.5)), run_time=1.6)
        self.settle()
        y = al.y_of(21.5)
        x = al.frame.get_center()[0] - 0.15
        eye = VGroup(K.C(0.22, "#FFD9B0", x + 1.9, y, stroke="#D8A77A", sw=3), Dot([x + 1.82, y, 0], radius=0.05, color=INK))
        sight = Line([x + 1.65, y, 0], [x + 0.05, y, 0], stroke_color=GREEN, stroke_width=5)
        self.say(f"액체 기둥 끝에 {g('눈높이를 맞추어')} 읽어요: 21.5 °C",
                 "액체 기둥이 닿은 부분에 눈높이를 맞추어 눈금을 읽어요. 과학실의 온도는 21.5도예요.")
        self.play(FadeIn(eye), Create(sight), run_time=0.6)
        rd = T("21.5 °C", 34, "#C0392B").move_to([x + 2.0, y + 0.55, 0])
        self.play(FadeIn(rd), run_time=0.4)
        self.settle()
        # 적외선
        stairs = VGroup(*[K.rect(2.6 - k * 0.6, 0.45, "#D8C39E" if k % 2 == 0 else "#C9B48F", 4.6 + k * 0.3, -1.6 + k * 0.45,
                                 stroke="#A58C62", sw=2) for k in range(4)])
        sname = T("복도 계단", 26, INK).move_to([4.9, 0.55, 0])
        gun = K.ir_gun("19.8").scale(1.1).move_to([1.6, -0.2, 0])
        n2 = T("적외선 온도계", 30, INK).next_to(gun, UP, buff=0.3)
        hit = [4.8, -0.95, 0]
        laser = Line(gun.muzzle(), hit, stroke_color="#E2241B", stroke_width=4)
        self.say(f"적외선 온도계는 {o('레이저 빛')}을 맞혀 물체 표면의 온도를 재요",
                 "적외선 온도계는 전원을 켜고, 온도 측정 단추를 누른 채로 레이저 빛을 맞혀 물체 표면의 온도를 재요. 복도 계단의 온도는 19.8도예요.")
        self.play(FadeIn(stairs), FadeIn(sname), FadeIn(gun), FadeIn(n2), run_time=0.6)
        self.play(Create(laser), FadeIn(Dot(hit, radius=0.08, color="#E2241B")), run_time=0.6)
        self.settle()
        safe = K.safety_note("레이저 빛이 사람의 눈을 향하지 않게 해요. 오늘 쓰는 적외선 온도계는 체온용이 아니에요.",
                             w=12.6, size=26).move_to([0, 2.55, 0])
        self.say(f"레이저 빛이 {r('사람의 눈')}을 향하지 않게 주의해요",
                 "적외선 온도계의 레이저 빛이 사람의 눈을 향하지 않도록 주의해요. 금속이나 거울처럼 빛을 반사하는 물체는 적외선 온도계로 재기 어려워요.")
        self.play(FadeIn(safe), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 알맞은 온도계 고르기 ──
    def choose(self):
        self.section("알맞은 온도계")
        tb = K.result_table(["장소나 물체", "온도계", "온도(°C)"],
                            [["화단 흙", "", ""], ["과학실(공기)", "", ""], ["복도 계단(표면)", "", ""]],
                            [3.4, 3.6, 2.4], row_h=0.85, size=30).move_to([0, 0.6, 0])
        self.say("재려는 대상에 알맞은 온도계를 골라요",
                 "재려는 대상에 알맞은 온도계를 골라 봐요. 흙 속, 공기, 물체 표면에는 어떤 온도계가 알맞을까요?")
        self.play(FadeIn(tb), run_time=0.6)
        self.pause_screen(4, "어떤 온도계가 알맞을까요?")
        fills = [("탐침 온도계", "20.7"), ("알코올 온도계", "21.5"), ("적외선 온도계", "19.8")]
        # 칸 위치는 표 칸(사각형)에서 직접 계산
        boxes = [m for m in tb if m.__class__.__name__ == "Rectangle"]
        cells = VGroup()
        for i, (a, b) in enumerate(fills):
            row = boxes[(i + 1) * 3:(i + 2) * 3]
            cells.add(T(a, 30, ORANGE).move_to(row[1]), T(b, 30, ORANGE).move_to(row[2]))
        self.say(f"흙 속은 {o('탐침')}, 공기는 {o('알코올')}, 표면은 {o('적외선')} 온도계",
                 "흙에 찔러 넣어 속의 온도를 잴 때는 탐침 온도계, 벽에 걸어 공기의 온도를 잴 때는 알코올 온도계, 레이저 빛을 맞혀 표면의 온도를 잴 때는 적외선 온도계가 알맞아요.")
        self.play(FadeIn(cells, lag_ratio=0.2), run_time=1.2)
        note = T("표의 값은 지도서의 예시 값이에요", 24, SOFT).next_to(tb, DOWN, buff=0.25)
        self.play(FadeIn(note), run_time=0.3)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"손으로 만졌을 때는 정확히 알기 {r('어렵지만')}",
                            f"온도계로 측정하면 {g('정확한 온도')}를 알 수 있어요"], size=40).move_to([0, 0.5, 0])
        self.section("정리해요")
        self.say(f"온도계로 측정하면 {g('정확한 온도')}를 알 수 있어요",
                 "손으로 만졌을 때는 정확한 온도를 알기 어렵지만, 온도계로 측정하면 정확한 온도를 알 수 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 온도계 ──
    def life(self):
        self.section("생활 속 온도계")
        specs = [("음식 조리", "탐침 온도계"), ("온실 속 온도", "알코올 온도계"),
                 ("체온 측정", "체온용 적외선 온도계"), ("색깔과 숫자로", "열화상 사진기")]
        pics = [self.p_cook(), self.p_green(), self.p_body(), self.p_cam()]
        cards = VGroup()
        for p, (a, b) in zip(pics, specs):
            c = K.pic_card(p, a, 3.0, 2.6, 28)
            nm = T(b, 24, ORANGE).next_to(c, DOWN, buff=0.15)
            if nm.width > 3.1:
                nm.scale_to_fit_width(3.1)
            cards.add(VGroup(c, nm))
        cards.arrange(RIGHT, buff=0.3).move_to([0, 0.9, 0])
        self.say("생활 속에서도 여러 가지 온도계를 사용해요",
                 "음식을 조리할 때는 탐침 온도계, 온실 속 온도는 알코올 온도계, 체온은 체온용 적외선 온도계로 재요. 열화상 사진기로는 여러 물체의 온도를 색깔과 숫자로 확인해요.")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=1.2)
        self.settle()
        mis = K.text_card([f"한 물체의 온도는 한 종류의 온도계로만 잴 수 있을까요?",
                           f"→ {g('아니요')}, 체온은 체온용 적외선 온도계로도, 귀 체온계로도 재요"],
                          w=12.8, size=30).move_to([0, -1.5, 0])
        self.say(f"한 물체의 온도도 {g('여러 종류의 온도계')}로 잴 수 있어요",
                 "생각 바로잡기! 한 물체의 온도도 여러 종류의 온도계로 잴 수 있어요. 상황에 맞게 골라 쓰면 생활이 더 편리하고 안전해요.")
        self.play(FadeIn(mis, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def p_cook(self):
        pan = K.E(2.0, 0.5, "#C98B4F", 0, 0, stroke=INK, sw=3)
        th = K.probe_thermo("", on=True, probe=0.8, s=0.6).move_to([0.4, 0.75, 0])
        return VGroup(pan, th)

    def p_green(self):
        house = K.poly([(-1, -0.6), (-1, 0.3), (0, 0.9), (1, 0.3), (1, -0.6)], "#DFF3FF", stroke=K.GLASS, sw=3)
        plant = K.smooth([(-0.3, -0.6), (-0.3, 0), (-0.1, 0.3)], "#2F7D4A", 6)
        th = K.alcohol_thermo(25, h=1.6).scale(0.5).move_to([0.6, -0.1, 0])
        return VGroup(house, plant, th)

    def p_body(self):
        head = K.C(0.55, "#FFD9B0", -0.5, 0, stroke="#D8A77A", sw=3)
        gun = K.ir_gun("36.5").scale(0.6).rotate(3.14159).move_to([0.8, 0.1, 0])
        return VGroup(head, gun)

    def p_cam(self):
        bg = K.R(2.0, 1.3, "#1A1D3A", 0, 0, rad=0.08, stroke=INK, sw=2)
        bands = VGroup(*[K.rect(0.36, 1.0, c, -0.72 + i * 0.36, 0, stroke=c, sw=0)
                         for i, c in enumerate(["#2B3FBF", "#4A8BE0", "#E8E43A", "#F2A23A", "#E2241B"])])
        return VGroup(bg, bands)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"{o('온도')}은/는 물체의 따뜻하거나 차가운 정도를 나타내고,",
                            "온도계를 사용하여 측정합니다."], w=12.0, size=40).move_to([0, 1.0, 0])
        self.say(f"{o('온도')}는 따뜻하거나 차가운 정도, 온도계로 측정해요",
                 "온도는 물체의 따뜻하거나 차가운 정도를 나타내고, 온도계를 사용하여 측정해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        more = K.text_card([f"온도계를 계속 설치해 두면 편리한 곳: {g('목욕탕')}, {g('냉장고')}"], size=34).move_to([0, -1.1, 0])
        self.say(f"목욕탕과 냉장고에 온도계가 있으면 {g('편리해요')}",
                 "목욕탕에 온도계를 설치해 두면 물의 온도를 정확하게 알 수 있고, 냉장고에 설치해 두면 식재료를 알맞은 온도로 보관할 수 있어 편리해요.")
        self.play(FadeIn(more, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
