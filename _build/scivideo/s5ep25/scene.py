"""「과학 원리 돋보기」 5학년 25화 — 소금과 모래 분리 (5-2 1단원 혼합물의 분리 5~6차시, 화 코드 5-2-1-d)

바탕: grade5/science/sem2/u1-4.html(원본 _build_tb/src2/u1-4.html) — 도입(모래가 섞인 바닷물에서 소금 얻기, 바닷물에 소금이 녹아 있음),
실험 1(관찰: 소금 모양 일정하지 않고 하얀색·모래 일정하지 않고 갈색, 크기는 비슷한 것도 있음, 소금은 물에 잘 녹고 모래는 녹지 않음 →
물에 녹는 성질의 차이), 거름 장치 꾸미기 4단계(고깔 접기 → 깔때기에 넣고 물 묻혀 고정 → 깔때기 끝의 긴 부분을 비커 옆면에 →
유리 막대를 타고 천천히 붓기), 거르기(거름종이 위 모래, 빠져나간 소금물, '거름'의 뜻),
실험 2(증발: 보안경·면장갑 → 소금물을 증발 접시에 절반 → 가열판 약하게 → 김·물이 줄고 하얀 알갱이가 생겨 튐 → 전원 끄기 → 집게로 옮기기,
가열 전·중·후 관찰 결과), 정리(하얀 알갱이는 소금), 생활 속 거름·증발 6가지, 한눈에 쏙(거름 장치로 모래, 증발 장치로 소금).
최종: ./make_final.sh s5ep25
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, VGroup, Transform, Rotate)

from series_style import GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep25(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 25
    EP_TITLE = "소금과 모래 분리"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.observe()
        self.setup_rig()
        self.filtering()
        self.evaporate()
        self.life()
        self.summary()
        self.closing(f"물에 녹인 뒤 {o('거름')}으로 모래를,\n{g('증발')}로 소금을 분리해요",
                     next_preview="5학년 마인드맵 5 · 혼합물의 분리")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sea = K.sea_pic(5.0, 3.0).move_to([-3.2, 0.6, 0])
        q = K.text_card(["모래가 섞인 바닷물에서", f"{o('소금')}을 어떻게 얻을 수 있을까요?"], size=36).move_to([3.0, 0.6, 0])
        self.say("모래가 섞인 바닷물에서 소금을 어떻게 얻을 수 있을까요?")
        self.play(FadeIn(sea), FadeIn(q), run_time=0.7)
        self.say(f"바닷물에는 {o('소금')}이 녹아 있어요",
                 "바닷물에서 짠맛이 나는 것으로 보아 바닷물에는 소금이 녹아 있어요.")
        self.settle()
        clear_stage(self)

    # ── 관찰해요 ──
    def observe(self):
        self.section("관찰해요")
        A = K.Glass(-3.0, -1.8, 2.0, 2.6, "beaker")
        B = K.Glass(3.0, -1.8, 2.0, 2.6, "beaker")
        wa, wb = A.liquid(1.9, K.WATER, 0.9), B.liquid(1.9, K.WATER, 0.9)
        na = T("소금 + 물", 30).next_to(A.top(), UP, buff=0.2)
        nb = T("모래 + 물", 30).next_to(B.top(), UP, buff=0.2)
        self.say("소금과 모래를 각각 물에 넣고 저어 봐요",
                 "돋보기로 보면 소금은 하얀색, 모래는 갈색이에요. 각각 물에 넣고 저어 볼까요?")
        self.play(FadeIn(VGroup(wa, A.glass(), wb, B.glass(), na, nb)), run_time=0.7)
        salt = VGroup(*[K.Square(side_length=0.09, fill_color="#FFFFFF", fill_opacity=1, stroke_color=K.SALT_E, stroke_width=1.5)
                        .move_to([-3.7 + 1.4 * K.rnd(i, 1), -1.68 + 0.1 * K.rnd(i, 2), 0]) for i in range(16)])
        sand = K.sand_dots(2.3, 3.7, -1.72, -1.6, 50, 4, 0.04)
        self.play(FadeIn(salt, shift=DOWN * 1.5), FadeIn(sand, shift=DOWN * 1.5), run_time=0.8)
        self.pause_screen(5, "어느 것이 물에 녹을까요?")
        self.play(FadeOut(salt), run_time=1.2)
        self.say(f"소금은 {o('물에 녹고')}, 모래는 {r('녹지 않고')} 가라앉아요")
        self.play(Indicate(nb, color=RED), Indicate(na, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)
        tb = K.result_table(["구분", "모양과 색깔", "알갱이의 크기", "물에 녹는 성질"],
                            [["소금", "일정하지 않고 하얀색", "모래와 비슷한 것도 있음", o("물에 잘 녹음")],
                             ["모래", "일정하지 않고 갈색", "소금과 비슷한 것도 있음", r("물에 녹지 않음")]],
                            [1.6, 3.6, 4.0, 3.4], row_h=0.95, size=28).move_to([0, 1.05, 0])
        card = K.text_card([f"→ {o('물에 녹는 성질의 차이')}를 이용해 분리해요.",
                            "혼합물 속 물질은 성질이 변하지 않은 채 섞여 있어요."], w=11.0, size=32).move_to([0, -1.55, 0])
        self.say(f"크기는 비슷해도 {o('물에 녹는 성질')}이 달라요",
                 "소금과 모래는 크기가 비슷한 것도 있어요. 소금은 물에 녹고 모래는 녹지 않는 성질의 차이를 이용해 분리해요.")
        self.play(FadeIn(tb), run_time=0.7)
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 거름 장치 꾸미기 ──
    def setup_rig(self):
        self.section("거름 장치")
        R = K.FilterRig(1.8, 1.55, -2.3)
        self.R = R
        stand, fun = R.stand(), R.funnel()
        self.play(FadeIn(stand), FadeIn(fun), FadeIn(R.bk.glass()), run_time=0.6)
        steps = ["① 거름종이를 고깔 모양으로 접어요",
                 "② 깔때기에 넣고 물을 묻혀 고정해요",
                 "③ 깔때기 끝의 긴 부분을 비커 옆면에 닿게 해요",
                 "④ 유리 막대를 타고 천천히 부어요"]
        lst = VGroup(*[T(s_, 28) for s_ in steps]).arrange(DOWN, buff=0.32, aligned_edge=LEFT)
        for t in lst:
            if t.width > 6.6:
                t.scale_to_fit_width(6.6)
        lst.arrange(DOWN, buff=0.32, aligned_edge=LEFT).move_to([-7.0, 0.3, 0], aligned_edge=LEFT)
        # ①
        p0 = K.cone_paper(0, 0.55).move_to([-1.0, 2.3, 0])
        self.say("거름 장치를 꾸며요: ① 거름종이를 고깔 모양으로 접어요",
                 "거름 장치를 꾸며요. 먼저 거름종이를 고깔 모양으로 접어요.")
        self.play(FadeIn(lst[0]), FadeIn(p0), run_time=0.5)
        for st in (1, 2, 3):
            self.play(Transform(p0, K.cone_paper(st, 0.55).move_to([-1.0, 2.3, 0])), run_time=0.35)
        # ②
        paper = R.paper()
        self.say("② 깔때기에 넣고, 스포이트로 물을 묻혀 고정해요",
                 "거름종이를 깔때기에 넣고 스포이트로 물을 묻혀 고정해요.")
        self.play(FadeIn(lst[1]), Transform(p0, paper), run_time=0.7)
        drop = K.dropper(0.2, K.WATER_D).scale(0.7).move_to([R.cx - 0.4, R.top + 0.8, 0])
        self.play(FadeIn(drop), run_time=0.3)
        self.play(FadeOut(drop), run_time=0.3)
        # ③
        tip = R.tip_pt
        lab = K.label("비커 옆면에 닿게", ORANGE, 26).move_to([tip[0] - 2.0, tip[1] - 0.4, 0])
        ar = Arrow(lab.get_right(), tip + [-0.02, -0.08, 0], color=ORANGE, stroke_width=6, buff=0.05)
        self.say("③ 깔때기 끝의 긴 부분을 비커 옆면에 닿게 해요",
                 "깔때기 끝의 긴 부분을 비커 옆면에 닿게 하면 액체가 튀지 않고 흘러내려요.")
        self.play(FadeIn(lst[2]), Create(ar), FadeIn(lab), run_time=0.6)
        # ④
        rod = R.rod()
        self.say("④ 유리 막대를 타고 흐르도록 천천히 부어요",
                 "혼합물이 유리 막대를 타고 흐르도록 천천히 부어요.")
        self.play(FadeIn(lst[3]), FadeIn(rod), FadeOut(ar), FadeOut(lab), run_time=0.6)
        self.settle()
        self.rig = VGroup(stand, fun, R.bk.glass(), p0, rod)
        self.play(FadeOut(lst), run_time=0.3)

    # ── 거르기 ──
    def filtering(self):
        self.section("거르기")
        R = self.R
        G = K.Glass(-4.2, -2.3, 1.8, 2.2, "beaker")
        w = G.liquid(1.4, K.WATER, 0.9)
        grains = VGroup(K.sand_dots(-4.9, -3.5, -2.2, -2.05, 40, 6, 0.04),
                        *[K.Square(side_length=0.08, fill_color="#FFFFFF", fill_opacity=1, stroke_color=K.SALT_E, stroke_width=1.5)
                          .move_to([-4.85 + 1.3 * K.rnd(i, 3), -2.1 + 0.1 * K.rnd(i, 4), 0]) for i in range(14)])
        self.say("① 혼합물을 물에 넣고 ② 유리 막대로 저어요",
                 "물이 담긴 비커에 소금과 모래의 혼합물을 넣고 유리 막대로 저어요.")
        self.play(FadeIn(G.glass()), FadeIn(w), FadeIn(grains, shift=DOWN), run_time=0.7)
        cloud = G.cloudy(1.4, 40, "#C9A06A")
        self.play(FadeIn(cloud), FadeOut(grains[1]), run_time=0.6)
        self.play(FadeOut(cloud), run_time=0.8)
        self.say("모래는 가라앉고, 소금은 녹아 보이지 않아요",
                 "물이 흐려졌다가 모래는 가라앉고, 소금은 녹아 보이지 않아요.")
        self.settle()
        # 붓기
        pb = R.pour_beaker(0.6)
        self.say("③ 거름 장치로 천천히 부어요")
        self.play(FadeOut(VGroup(G.glass(), w, grains[0])), FadeIn(pb), run_time=0.5)
        st = R.stream()
        self.play(Create(st), FadeIn(R.liquid_in(0.6)), run_time=0.6)
        self.pause_screen(5, "거름종이 위에는 무엇이 남을까요?")
        res = R.residue(45)
        fl = R.filtrate(0.7)
        dr = R.drip(0.7)
        self.play(FadeIn(res), FadeIn(dr), FadeIn(fl), run_time=1.0)
        self.play(FadeOut(pb), FadeOut(st), FadeOut(dr), run_time=0.5)
        l1 = K.label("거름종이 위: 모래", "#8A5A2B", 30).move_to([-3.6, 1.5, 0])
        l2 = K.label("빠져나간 것: 소금물", "#2F6FD6", 30).move_to([-3.6, -1.2, 0])
        a1 = Arrow(l1.get_right(), [R.cx - 0.35, R.top - 0.75, 0], color="#8A5A2B", stroke_width=5, buff=0.08)
        a2 = Arrow(l2.get_right(), [R.bk.x - 0.1, R.bk.y + 0.4, 0], color="#2F6FD6", stroke_width=5, buff=0.08)
        self.say(f"거름종이 위에 {o('모래')}, 빠져나간 것은 {b_('소금물')}",
                 "거름종이 위에는 물에 녹지 않는 모래가 남고, 소금물은 거름종이를 빠져나가요.")
        self.play(Create(a1), Create(a2), run_time=0.4)
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.4)
        self.settle()
        clear_stage(self)
        card = K.text_card([f"물에 녹는 물질과 녹지 않는 물질을 걸러서 분리하는 방법을", f"{o('거름')}이라고 해요."],
                           w=12.4, size=38).move_to([0, 1.2, 0])
        self.say(f"걸러서 분리하는 방법 → {o('거름')}",
                 "물에 녹는 물질과 녹지 않는 물질을 걸러서 분리하는 방법을 거름이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 증발 ──
    def evaporate(self):
        self.section("증발")
        hp = K.hot_plate_on(False, 6.0).move_to([0, -1.85, 0])
        D = K.EvapDish(0, -1.62, 4.4)
        dish = D.body()
        safe = K.safety_note("보안경·면장갑 착용 · 가열판은 약하게 · 너무 가까이에서 보지 않기", w=12.2, size=28).move_to([0.4, 2.25, 0])
        self.say("보안경과 면장갑을 꼭 착용해요",
                 "이제 소금물에서 소금을 분리해요. 가열할 때는 보안경과 면장갑을 꼭 착용해요.")
        self.play(FadeIn(hp), FadeIn(dish), FadeIn(safe), run_time=0.6)
        wat = D.water(1.0)
        self.say("① 소금물을 증발 접시에 절반 정도 붓고 ② 가열판을 약하게 켜요",
                 "소금물을 증발 접시에 절반 정도 붓고, 가열판을 약하게 켜요. 세게 가열하면 끓어 넘쳐 위험해요.")
        self.play(FadeIn(wat), run_time=0.5)
        self.play(Transform(hp, K.hot_plate_on(True, 6.0).move_to([0, -1.85, 0])), run_time=0.4)
        self.pause_screen(5, "가열하면 어떻게 될까요?")
        stm = D.steam()
        self.play(FadeIn(stm), Transform(wat, D.water(0.55)), run_time=1.2)
        s1 = D.salt(20, 3)
        self.say(f"김이 나고 물이 줄면서 {o('하얀색 알갱이')}가 생겨요",
                 "김이 나고 물의 양이 줄면서 하얀색 알갱이가 생겨 사방으로 튀어요.")
        sp = D.spatter()
        self.play(FadeIn(s1), Transform(wat, D.water(0.2)), FadeIn(sp, shift=UP * 0.3), run_time=1.2)
        self.play(FadeOut(sp), run_time=0.3)
        self.say("③ 물이 거의 없어지면 가열판 전원을 꺼요",
                 "물이 거의 없어지면 전원을 꺼요. 남은 열로 물이 마저 증발해요.")
        s2 = D.salt(46, 3)
        self.play(Transform(hp, K.hot_plate_on(False, 6.0).move_to([0, -1.85, 0])), FadeOut(stm), FadeOut(wat),
                  Transform(s1, s2), run_time=1.0)
        tg = K.dish_tongs(1.3).move_to([2.6, -0.4, 0])
        self.say(f"④ 뜨거운 증발 접시는 {r('증발 접시 집게')}로 옮겨요",
                 "증발 접시와 가열판은 매우 뜨거워요. 증발 접시는 집게로 옮기고, 가열판은 식은 뒤 정리해요.")
        self.play(FadeIn(tg), run_time=0.4)
        self.play(VGroup(dish, s1, tg).animate.shift(RIGHT * 2.2 + UP * 0.5), run_time=0.8)
        self.settle()
        clear_stage(self)
        # 관찰 결과
        tb = K.result_table(["가열하기 전", "가열하는 동안", "가열이 끝난 후"],
                            [["아무 변화가 없어요.", "김이 나며 물이 끓고 양이 줄어요.\n하얀색 알갱이가 생겨 튀어요.",
                              "물이 거의 보이지 않고\n하얀색 알갱이가 많아져요."]],
                            [3.2, 5.0, 4.6], row_h=1.35, size=28, head_fill="#EFE8DB").move_to([0, 1.05, 0])
        self.say("가열하면서 나타나는 현상을 정리해요",
                 "가열하기 전에는 변화가 없고, 가열하는 동안 하얀색 알갱이가 생겨, 끝난 후에는 많아져요.")
        self.play(FadeIn(tb), run_time=0.7)
        ans = K.text_card([f"남은 하얀색 알갱이는 {o('소금')}이에요.", "소금물에서 물이 증발했기 때문이에요."], w=10.4, size=34
                          ).move_to([0, -1.55, 0])
        self.say(f"증발 접시에 남은 하얀색 알갱이는 {o('소금')}이에요",
                 "남은 하얀색 알갱이는 소금이에요. 물은 증발하고 소금이 남아요. 실험에서는 맛을 보지 않아요.")
        self.play(FadeIn(ans, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 예 ──
    def life(self):
        self.section("생활 속 예")
        items = [("전통 장: 메주를 건져 낸 혼합물을 천으로 걸러요", 0), ("염전: 햇빛과 바람으로 소금을 얻어요", 1),
                 ("치즈를 만들 때 천으로 걸러요", 0), ("과일을 건조해 말린 과일을 만들어요", 1),
                 ("재생 색지: 틀로 종이와 물을 분리해요", 0), ("떼어 낸 종이를 말려 재생 색지를 완성해요", 1)]
        bins = VGroup(K.bin_box("거름", 6.6, 4.0, "#8A5A2B", 36), K.bin_box("증발", 6.6, 4.0, "#2F6FD6", 36))
        bins.arrange(RIGHT, buff=0.2).move_to([0, 0.2, 0])
        self.say("생활 속에서 거름과 증발을 이용한 예를 찾아봐요")
        self.play(FadeIn(bins), run_time=0.5)
        cnt = [0, 0]
        for t, k in items:
            c = T(t, 26)
            if c.width > 6.2:
                c.scale_to_fit_width(6.2)
            c.move_to(bins[k].box.get_center() + [0, 0.75 - 0.95 * cnt[k], 0])
            cnt[k] += 1
            self.add(c)
            self.play(FadeIn(c, shift=UP * 0.15), run_time=0.35)
        self.say(f"천이나 틀로 걸러 내면 {o('거름')}, 물을 날려 보내면 {b_('증발')}이에요",
                 "천이나 틀로 걸러 내는 것은 거름, 햇빛과 바람으로 말리는 것은 증발이에요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["소금과 모래가 섞인 혼합물은 물에 녹인 뒤",
                            f"{o('거름')} 장치를 이용하여 모래를 분리한 다음,",
                            f"{g('증발')} 장치를 이용하여 소금을 분리합니다."], w=11.8, size=38).move_to([0, 1.0, 0])
        self.say(f"{o('거름')} 장치로 모래를, {g('증발')} 장치로 소금을 분리해요",
                 "소금과 모래가 섞인 혼합물은 물에 녹인 뒤 거름 장치를 이용하여 모래를 분리한 다음, 증발 장치를 이용하여 소금을 분리해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)


def b_(s):
    return f'<span foreground="#2F6FD6">{s}</span>'
