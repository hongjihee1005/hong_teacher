"""「과학 원리 돋보기」 5학년 12화 — 물에 녹을까, 녹지 않을까? (5-1 3단원 용해와 용액 2차시, 화 코드 5-1-3-a)

바탕: grade5/science/sem1/u3-1.html(원본 _build_tb/src/u3-1.html) — 도입(어묵탕: 소금은 녹고 후춧가루는 녹지 않음),
실험(설탕·가루 바이타민·탄산 칼슘을 물 2/3 유리병에 한 숟가락씩 → 뚜껑 닫고 흔들기 → 5분 뒤 관찰, 결과 기록표),
용해·용매·용질·용액(앱의 정의 문장 그대로), 생활 속 용액 분류 8장, 생각 바로잡기(공기처럼 기체로 된 용액),
한눈에 쏙(용해) + 흙탕물은 용액이 아님.
최종: ./make_final.sh s5ep12
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Arrow, Rotate,
                   SurroundingRectangle, Transform, Wiggle)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep12(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 12
    EP_TITLE = "물에 녹을까, 녹지 않을까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.experiment()
        self.words()
        self.sort()
        self.misc()
        self.summary()
        self.closing(f"어떤 물질이 다른 물질에 녹아 골고루 섞이는 현상을\n{o('용해')}라고 해요",
                     next_preview="5학년 13화 · 물에 녹은 물질은 어떻게 될까?")
        self.wait(0.5)

    # ── 궁금해요: 소금과 후춧가루 ──
    def intro(self):
        self.section("궁금해요")
        A = K.Glass(-3.0, -2.2, 2.6, 3.0, "cup")
        B = K.Glass(3.0, -2.2, 2.6, 3.0, "cup")
        lv = 2.4
        cups = VGroup(A.liquid(lv), A.glass(), B.liquid(lv), B.glass())
        n1 = T("소금", 34).next_to(A.top(), UP, buff=0.3)
        n2 = T("후춧가루", 34).next_to(B.top(), UP, buff=0.3)
        self.say("물에 소금과 후춧가루를 넣으면 어떻게 될까요?",
                 "어묵탕을 끓일 때 소금과 후춧가루를 넣는 모습을 본 적이 있나요? 물에 소금과 후춧가루를 넣으면 어떻게 될까요?")
        self.play(FadeIn(cups), FadeIn(n1), FadeIn(n2), run_time=0.8)
        salt = A.grains(22, seed=4, r=0.055)
        salt_top = salt.copy().shift(UP * 2.0)
        pep = B.float_dots(lv, 40)
        self.play(FadeIn(salt_top), run_time=0.3)
        self.play(Transform(salt_top, salt), FadeIn(pep, shift=DOWN * 0.3), run_time=1.0)
        self.say("소금은 바닥으로 내려가고, 후춧가루는 물 위에 떠 있어요",
                 "소금은 바닥으로 내려가고, 후춧가루는 물 위에 떠 있어요. 저어 볼까요?")
        self.settle()
        rod1 = K.L((-2.6, 0.9), (-3.4, -1.8), "#9BB7C6", 9)
        rod2 = K.L((3.4, 0.9), (2.6, -1.8), "#9BB7C6", 9)
        self.play(FadeIn(rod1), FadeIn(rod2), run_time=0.3)
        self.play(Rotate(rod1, 0.5, about_point=[-3.0, -1.8, 0]), Rotate(rod2, -0.5, about_point=[3.0, -1.8, 0]),
                  run_time=0.4)
        self.play(Rotate(rod1, -0.5, about_point=[-3.0, -1.8, 0]), Rotate(rod2, 0.5, about_point=[3.0, -1.8, 0]),
                  run_time=0.4)
        self.play(FadeOut(rod1), FadeOut(rod2), run_time=0.3)
        self.pause_screen(5, "저은 뒤 어떻게 되었을까요?")
        bottom = VGroup(*[K.Dot([2.3 + 0.25 * i, -2.05, 0], radius=0.045, color=K.PEPPER) for i in range(5)])
        self.play(FadeOut(salt_top), FadeIn(bottom), run_time=1.0)
        self.say(f"소금은 {o('물에 녹고')}, 후춧가루는 {r('물에 녹지 않아요')}",
                 "저었더니 소금은 보이지 않고, 후춧가루는 여전히 물 위에 떠 있어요. 소금은 물에 녹고, 후춧가루는 물에 녹지 않아요.")
        self.play(Indicate(n1, color=ORANGE), Indicate(n2, color=RED), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 실험해요: 세 가지 가루 ──
    def experiment(self):
        self.section("실험해요")
        names = ["설탕", "가루 바이타민", "탄산 칼슘"]
        cols = [K.SUGAR, K.VIT, K.CAL]
        J = [K.Glass(x, -1.9, 2.3, 2.7, "jar") for x in (-4.3, 0, 4.3)]
        glass = VGroup(*[j.glass() for j in J])
        tags = VGroup(*[T(n, 32).next_to(j.top(0.35), UP, buff=0.15) for n, j in zip(names, J)])
        note = T("탄산 칼슘: 달걀 껍데기·조개껍데기를 주로 이루는 흰색 가루", 28, SOFT).move_to([0, 2.45, 0])
        self.say("설탕, 가루 바이타민, 탄산 칼슘을 물에 넣으면?",
                 "설탕, 가루 바이타민, 탄산 칼슘을 같은 양의 물에 넣고 섞으면 어떻게 될까요? 탄산 칼슘은 달걀 껍데기와 조개껍데기를 주로 이루는 흰색 가루예요.")
        self.play(FadeIn(glass), FadeIn(tags), FadeIn(note), run_time=0.8)
        self.settle()
        self.play(FadeOut(note), run_time=0.3)
        lv = 1.8
        waters = VGroup(*[j.liquid(lv) for j in J])
        self.say("① 유리병에 물을 2/3씩 넣고 ② 한 숟가락씩 넣어요",
                 "유리병에 물을 3분의 2씩 넣고, 약숟가락을 따로 써서 물질을 한 숟가락씩 넣어요.")
        self.play(FadeIn(waters), run_time=0.7)
        sink = VGroup(*[j.grains(14, col=c, stroke="#C9A400" if i == 1 else "#BBBBBB", seed=i + 2, r=0.06, square=False)
                        for i, (j, c) in enumerate(zip(J, cols))])
        self.play(FadeIn(sink, shift=DOWN * 0.6), run_time=0.8)
        safe = K.safety_note("실험복·보안경·실험용 장갑 · 물질은 맛보거나 맨손으로 만지지 않기", w=12.6, size=28).move_to([0, 2.45, 0])
        self.say("③ 뚜껑을 닫고 흔들어요",
                 "실험복, 보안경, 실험용 장갑을 착용하고, 물질은 맛보거나 맨손으로 만지지 않아요. 뚜껑을 잘 닫고 조심히 흔들어요.")
        lids = VGroup(*[j.lid() for j in J])
        self.play(FadeIn(lids, shift=DOWN * 0.2), FadeOut(tags), FadeIn(safe), run_time=0.4)
        jars = VGroup(glass, waters, sink, lids)
        for k in range(3):
            self.play(jars.animate.shift(RIGHT * 0.12), run_time=0.12)
            self.play(jars.animate.shift(LEFT * 0.24), run_time=0.18)
            self.play(jars.animate.shift(RIGHT * 0.12), run_time=0.12)
        w2 = VGroup(J[0].liquid(lv), J[1].liquid(lv, K.VIT, 0.6), J[2].liquid(lv, "#E9EDF0", 0.97))
        cloud = J[2].cloudy(lv, 45)
        self.play(Transform(waters, w2), FadeOut(sink), FadeIn(cloud), FadeOut(safe), FadeIn(tags), run_time=0.8)
        self.say(f"흔든 직후: 바이타민 물은 {o('노란색')}, 탄산 칼슘 물은 {o('뿌옇게')} 흐려졌어요",
                 "흔든 직후에 설탕은 금방 녹아 보이지 않아요. 가루 바이타민은 녹으면서 물이 노란색으로 변해요. 탄산 칼슘을 넣은 물은 뿌옇게 흐려졌어요.")
        self.settle()
        self.say("④ 내려놓고 5분 기다려요", "이제 내려놓고 5분 동안 기다려요.")
        self.pause_screen(6, "5분 뒤 세 유리병은 어떻게 될까요?")
        w3 = VGroup(J[0].liquid(lv), J[1].liquid(lv, K.VIT, 0.55), J[2].liquid(lv))
        pile = J[2].pile(0.22)
        self.play(Transform(waters, w3), FadeOut(cloud), FadeIn(pile), run_time=1.2)
        lab = K.label("바닥에 흰색 물질", RED, 26).next_to(J[2].glass(), DOWN, buff=0.08)
        self.say(f"5분 뒤: 탄산 칼슘은 흰색 물질이 {r('바닥에 가라앉았어요')}",
                 "5분 뒤, 설탕물은 투명하고 바이타민 물은 투명한 노란색이에요. 둘 다 뜨거나 가라앉는 것이 없어요. 탄산 칼슘은 흰색 물질이 바닥에 가라앉았어요.")
        self.play(FadeIn(lab), run_time=0.5)
        self.settle()
        clear_stage(self)
        # 기록표
        tb = K.result_table(["구분", "설탕", "가루 바이타민", "탄산 칼슘"],
                            [["물의 모습", "투명해요", "투명한 노란색이에요", "뿌옇다가 흰색 물질이\n가라앉아요"],
                             ["뜨거나 가라앉는 것", g("없어요"), g("없어요"), r("바닥에 가라앉아요")]],
                            [3.0, 2.5, 3.5, 3.6], row_h=1.05, size=28).move_to([0, 0.95, 0])
        res = K.text_card([f"설탕과 가루 바이타민은 물에 {o('녹고')},", f"탄산 칼슘은 물에 {r('녹지 않아요')}."],
                          w=10.5, size=36).move_to([0, -1.6, 0])
        self.say(f"설탕과 가루 바이타민은 {o('녹고')}, 탄산 칼슘은 {r('녹지 않아요')}",
                 "결과를 표로 정리해 비교하면, 설탕과 가루 바이타민은 물에 녹고, 탄산 칼슘은 물에 녹지 않아요.")
        self.play(FadeIn(tb), run_time=0.8)
        self.play(FadeIn(res, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리해요: 용해·용매·용질·용액 ──
    def words(self):
        self.section("용해와 용액")
        cube = VGroup(*[K.sugar_cube(0.32).move_to([-5.6 + 0.36 * (i % 3), 1.85 + 0.34 * (i // 3), 0]) for i in range(5)])
        sugar_t = T("설탕", 30).next_to(cube, DOWN, buff=0.2)
        plus = T("+", 64, ORANGE).move_to([-3.85, 1.85, 0])
        W = K.Glass(-2.3, 0.95, 1.5, 1.8, "cup")
        water = VGroup(W.liquid(1.5), W.glass())
        water_t = T("물", 30).next_to(water, DOWN, buff=0.2)
        arr = Arrow([-0.9, 1.85, 0], [1.7, 1.85, 0], color=ORANGE, stroke_width=8, buff=0)
        S = K.Glass(3.0, 0.95, 1.6, 1.9, "cup")
        sw = VGroup(S.liquid(1.6, "#DCEFFA"), S.glass())
        sw_t = T("설탕물", 30).next_to(sw, DOWN, buff=0.2)
        pic = VGroup(cube, sugar_t, plus, water, water_t, arr, sw, sw_t)
        self.say("설탕이 물에 녹아 설탕물이 되었어요")
        self.play(FadeIn(pic, lag_ratio=0.15), run_time=1.2)
        lab_jil = K.label("용질", ORANGE, 34).next_to(sugar_t, DOWN, buff=0.15)
        lab_mae = K.label("용매", "#2F6FD6", 34).next_to(water_t, DOWN, buff=0.15)
        lab_hae = K.label("용해", RED, 34).next_to(arr, UP, buff=0.15)
        lab_aek = K.label("용액", GREEN, 34).next_to(sw_t, DOWN, buff=0.15)
        defs = [
            (lab_hae, f"{r('용해')}: 설탕이 물에 녹는 것처럼 어떤 물질이 다른 물질에 녹아 골고루 섞이는 현상",
             f"녹아 골고루 섞이는 현상 → {r('용해')}",
             "설탕이 물에 녹는 것처럼 어떤 물질이 다른 물질에 녹아 골고루 섞이는 현상을 용해라고 해요."),
            (lab_mae, f"{b_('용매')}: 물처럼 다른 물질을 녹이는 물질",
             f"다른 물질을 녹이는 물질 → {b_('용매')}",
             "물처럼 다른 물질을 녹이는 물질을 용매라고 해요."),
            (lab_jil, f"{o('용질')}: 설탕처럼 용매에 녹는 물질",
             f"용매에 녹는 물질 → {o('용질')}",
             "설탕처럼 용매에 녹는 물질을 용질이라고 해요."),
            (lab_aek, f"{g('용액')}: 설탕물처럼 용매와 용질이 골고루 섞여 있는 물질",
             f"용매와 용질이 골고루 섞여 있는 물질 → {g('용액')}",
             "설탕물처럼 용매와 용질이 골고루 섞여 있는 물질을 용액이라고 해요."),
        ]
        cards = VGroup(*[M(d[1], 26) for d in defs])
        cards.arrange(DOWN, buff=0.12, aligned_edge=LEFT)
        if cards.width > 13.2:
            cards.scale_to_fit_width(13.2)
        cards.move_to([0, -1.55, 0])
        for (lab, txt, sub, narr), c in zip(defs, cards):
            self.say(sub, narr)
            self.play(FadeIn(lab, scale=0.8), FadeIn(c, shift=UP * 0.15), run_time=0.6)
        self.settle()
        prop = K.text_card([f"용액은 색깔이나 맛 등의 성질이 {o('일정')}하고,", f"{g('뜨거나 가라앉는 것이 없어요')}."],
                           w=9.6, size=34).move_to([3.0, 0.9, 0])
        self.play(FadeOut(VGroup(cube, sugar_t, plus, water, water_t, arr, lab_jil, lab_mae, lab_hae, cards)),
                  run_time=0.4)
        self.play(VGroup(sw, sw_t, lab_aek).animate.move_to([-4.4, 0.9, 0]), FadeIn(prop.move_to([1.6, 1.0, 0])),
                  run_time=0.8)
        self.say(f"용액은 성질이 {o('일정')}하고, {g('뜨거나 가라앉는 것이 없어요')}",
                 "용액은 색깔이나 맛 등의 성질이 일정하고, 뜨거나 가라앉는 것이 없어요.")
        self.settle()
        clear_stage(self)

    # ── 생활 속 용액: 분류 ──
    def sort(self):
        self.section("생활 속 용액")
        items = [("설탕물", True), ("흙탕물", False), ("소금물", True), ("미숫가루를 탄 물", False),
                 ("바이타민 용액", True), ("탄산 칼슘을 넣은 물", False), ("식초", True), ("후춧가루를 넣은 물", False)]
        cards = VGroup(*[K.word_card(t, 3.0, 0.8, INK, 28) for t, _ in items])
        cards.arrange_in_grid(rows=2, cols=4, buff=(0.2, 0.2)).move_to([0, 1.9, 0])
        self.say("용액인 것과 용액이 아닌 것을 나누어 봐요", "용액인 것과 용액이 아닌 것을 나누어 볼까요?")
        self.play(FadeIn(cards, lag_ratio=0.08), run_time=1.0)
        self.pause_screen(5, "어느 것이 용액일까요?")
        bins = VGroup(K.bin_box("용액이에요", 6.5, 2.9, GREEN, 32), K.bin_box("용액이 아니에요", 6.5, 2.9, RED, 32))
        bins.arrange(RIGHT, buff=0.2).move_to([0, -0.75, 0])
        self.play(FadeIn(bins), run_time=0.5)
        yes = [c for c, (_, ok) in zip(cards, items) if ok]
        no = [c for c, (_, ok) in zip(cards, items) if not ok]
        mv = []
        for grp, bx in ((yes, bins[0]), (no, bins[1])):
            c0 = bx.box.get_center()
            for k, c in enumerate(grp):
                mv.append(c.animate.move_to(c0 + [(-1.58 if k % 2 == 0 else 1.58), -0.1 - 0.9 * (k // 2), 0]))
        self.say(f"설탕물, 소금물, 바이타민 용액, 식초는 {g('용액')}이에요",
                 "설탕물, 소금물, 바이타민 용액, 식초는 뜨거나 가라앉는 것이 없어 용액이에요.")
        self.play(*mv, run_time=1.4)
        self.say(f"흙탕물처럼 {r('뜨거나 가라앉는 것')}이 있으면 용액이 아니에요",
                 "비가 온 뒤 고인 흙탕물은 시간이 지나면 흙이 바닥에 가라앉아요. 미숫가루를 탄 물처럼 뜨거나 가라앉는 것이 있으면 용액이 아니에요.")
        self.play(Indicate(bins[1].title, color=RED), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        q = T("용액은 모두 액체일까요?", 54).move_to([0, 1.9, 0])
        self.say("용액은 모두 액체일까요?", "용액은 모두 액체일까요?")
        self.play(FadeIn(q), run_time=0.5)
        air = VGroup(*[K.Dot([-1.6 + 3.2 * K.rnd(i, 1), -0.9 + 1.7 * K.rnd(i, 2), 0], radius=0.07,
                             color=["#7FC6EF", "#F2A65A", "#9CCB6B"][i % 3]) for i in range(45)])
        frame = K.RoundedRectangle(corner_radius=0.3, width=3.8, height=2.3, stroke_color=SOFT, stroke_width=4)
        frame.move_to([0, -0.05, 0])
        air.move_to(frame)
        at = T("공기", 34).next_to(frame, LEFT, buff=0.3)
        self.say(f"아니요, {o('공기')}처럼 {g('기체')}로 된 용액도 있어요",
                 "아니요. 여러 기체가 고르게 섞여 있는 공기도 용액이에요. 이 단원에서는 물에 가루 물질을 녹인 용액을 주로 다뤄요.")
        self.play(Create(frame), FadeIn(air, lag_ratio=0.02), FadeIn(at), run_time=1.2)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"어떤 물질이 다른 물질에 녹아 골고루 섞이는 현상을", f"{o('용해')}(이)라고 합니다."],
                           w=12.4, size=40).move_to([0, 1.4, 0])
        self.say(f"녹아 골고루 섞이는 현상을 {o('용해')}라고 해요",
                 "어떤 물질이 다른 물질에 녹아 골고루 섞이는 현상을 용해라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="#2F6FD6">{s}</span>'
