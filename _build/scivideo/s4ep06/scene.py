"""「과학 원리 돋보기」 4학년 6화 — 물의 세 가지 상태와 상태 변화 (4-1 2단원 물의 상태 변화 2차시, 화 코드 4-1-2-a)

바탕: grade4/science/sem1/u2-1.html(원본 _build_tb/src/u2-1.html) — 도입(햇볕 받는 눈사람: 녹아서 점점 작아지고 물이 생김),
세 가지 상태 카드(얼음 고체 '모양이 일정하고 단단해' · 물 액체 '흐를 수 있어, 그릇에 따라 모양이 바뀌어' · 수증기 기체 '눈에 보이지 않지만 공기 중에 있어'),
실험해요 1(페트리 접시의 물 → 소금을 섞은 얼음 속 → 기울여도 흐르지 않음, 안전), 실험해요 2(분무기로 한 번, 5분 간격 관찰 → 물방울이 작아지고 줄며 사라짐, 수증기 보기 안경),
정리(액체→고체, 액체→기체, '물의 상태 변화'), 생활 속 다섯 가지 + 더 찾기(제습기), 생각 바로잡기(주전자 하얀 김), 한눈에 쏙.
최종: ./make_final.sh s4ep06
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Arrow, CurvedArrow,
                   SurroundingRectangle, Rotate, Circumscribe)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def change_ring(scene_scale=1.0, size=34):
    """얼음 ⇄ 물 ⇄ 수증기 (앱의 네 가지 변화: 물→얼음, 얼음→물, 물→수증기, 수증기→물)"""
    ice = K.state_card("ice", 3.0, 2.5, 34).move_to([-4.3, 0.3, 0])
    wat = K.state_card("water", 3.0, 2.5, 34).move_to([0, 0.3, 0])
    vap = K.state_card("vapor", 3.0, 2.5, 34).move_to([4.3, 0.3, 0])
    a1 = Arrow([-1.55, 0.75, 0], [-2.75, 0.75, 0], buff=0, color=BLUE, stroke_width=8)        # 물 → 얼음
    a2 = Arrow([-2.75, -0.15, 0], [-1.55, -0.15, 0], buff=0, color=ORANGE, stroke_width=8)    # 얼음 → 물
    a3 = Arrow([1.55, 0.75, 0], [2.75, 0.75, 0], buff=0, color=ORANGE, stroke_width=8)        # 물 → 수증기
    a4 = Arrow([2.75, -0.15, 0], [1.55, -0.15, 0], buff=0, color=BLUE, stroke_width=8)        # 수증기 → 물
    return VGroup(ice, wat, vap), VGroup(a1, a2, a3, a4)


class S4Ep06(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 6
    EP_TITLE = "물의 세 가지 상태와 상태 변화"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.three_states()
        self.exp1()
        self.exp2()
        self.organize()
        self.daily()
        self.correct()
        self.summary()
        self.closing(f"물은 {o('얼음(고체)')}·{o('물(액체)')}·{o('수증기(기체)')}로 있고\n"
                     f"물은 얼음이나 수증기로, 얼음·수증기는 물로 {g('변할 수 있어요')}",
                     next_preview="4학년 7화 · 물이 얼 때와 얼음이 녹을 때")
        self.wait(0.5)

    # ── 궁금해요: 눈사람 ──
    def intro(self):
        self.section("궁금해요")
        sun = VGroup(K.C(0.55, "#F7B733", 0, 0, stroke="#E0A020"))
        for i in range(8):
            a = i * np.pi / 4
            sun.add(K.L((np.cos(a) * 0.75, np.sin(a) * 0.75), (np.cos(a) * 1.0, np.sin(a) * 1.0), "#F7B733", 6))
        sun.move_to([4.6, 2.0, 0])
        ground = K.L((-6.5, -1.9), (6.5, -1.9), "#9C8F7E", 6)
        man = K.snowman(1.15).move_to([0, -0.15, 0])
        man.shift(UP * (-1.9 - man.get_bottom()[1]))
        clock = T("지금: 아침", 36).move_to([-4.6, 2.3, 0])
        self.say("햇볕이 쨍쨍한 곳에 눈사람이 있어요", "햇볕이 쨍쨍한 곳에 눈사람이 있어요. 눈사람이 햇볕을 계속 받으면 어떻게 될까요?")
        self.play(FadeIn(ground), FadeIn(sun), FadeIn(man), FadeIn(clock), run_time=0.8)
        self.pause_screen(5, "눈사람은 어떻게 될까요?")
        base = man.get_bottom()
        pud = K.puddle(1.0, 0.25).move_to([0, -1.9, 0])
        self.say("시간이 지나게 해 볼까요?", "시간이 지나게 해 볼까요? 아침, 점심, 오후, 저녁.")
        self.add(pud)
        self.bring_to_front(man)
        for name, sx, sy, pw in (("점심", 0.8, 0.72, 1.8), ("오후", 0.55, 0.45, 2.8), ("저녁", 0.3, 0.2, 3.8)):
            nc = T(f"지금: {name}", 36).move_to(clock)
            tgt = K.snowman(1.15).stretch(sx, 0).stretch(sy, 1)
            tgt.shift([0, base[1] - tgt.get_bottom()[1], 0])
            self.play(Transform(man, tgt), Transform(clock, nc),
                      Transform(pud, K.puddle(pw, 0.32).move_to([0, -1.9, 0])), run_time=1.0)
        self.say(f"눈사람은 녹아서 점점 작아지고 {o('물')}이 생겨요",
                 "눈사람은 녹아서 점점 작아지고, 바닥에 물이 생겼어요. 단단한 눈이 흐르는 물로 변했어요.")
        self.play(Indicate(pud, color=BLUE, scale_factor=1.1), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 물은 세 가지 상태로 있어요 ──
    def three_states(self):
        self.section("세 가지 상태")
        cards = VGroup(*[K.state_card(k, 3.7, 3.2, 40) for k in ("ice", "water", "vapor")]).arrange(RIGHT, buff=0.55).move_to([0, 1.0, 0])
        self.say("물은 우리 주변에서 세 가지 상태로 있어요",
                 "물은 우리 주변에서 고체인 얼음, 액체인 물, 기체인 수증기의 세 가지 상태로 있어요.")
        self.play(FadeIn(cards, lag_ratio=0.25), run_time=1.2)
        says = ["모양이 일정하고 단단해", "흐를 수 있어\n그릇에 따라 모양이 바뀌어", "눈에 보이지 않지만\n공기 중에 있어"]
        narr = ["나는 얼음이야. 모양이 일정하고 단단해.",
                "나는 물이야. 난 흐를 수 있어. 그릇에 따라 모양이 바뀌어.",
                "나는 수증기야. 난 눈에 보이지 않지만 공기 중에 있어."]
        subs = [f"얼음(고체): 모양이 일정하고 {o('단단해요')}",
                f"물(액체): {o('흘러요')}, 그릇에 따라 모양이 바뀌어요",
                f"수증기(기체): {o('눈에 보이지 않지만')} 공기 중에 있어요"]
        for i in range(3):
            lines = VGroup(*[T(s, 28, INK, bold=False) for s in says[i].split("\n")]).arrange(DOWN, buff=0.1)
            lines.next_to(cards[i], DOWN, buff=0.3)
            self.say(subs[i], narr[i])
            self.play(Indicate(cards[i], scale_factor=1.05, color=K.STATE_COL[["ice", "water", "vapor"][i]]), FadeIn(lines), run_time=0.8)
        self.say("수증기는 그림에서 점선으로 그려 나타내요",
                 "수증기는 눈에 보이지 않아요. 그래서 이 영상에서는 점선으로 그려서 나타낼게요.")
        self.play(Circumscribe(cards[2].pic, color=ORANGE), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 실험해요 1 ──
    def exp1(self):
        self.section("실험해요 1")
        safe = K.safety_note(f"소금을 섞은 얼음은 아주 차가우니 {r('맨손으로 만지지 말고')} 약숟가락을 써요 · 맛보지 않아요").move_to([0.4, 2.7, 0])
        self.say("페트리 접시에 담긴 물을 관찰해요",
                 "페트리 접시에 물을 조금 넣고 살펴봐요. 소금을 섞은 얼음은 아주 차가우니 맨손으로 만지지 말고 약숟가락을 써요.")
        self.play(FadeIn(safe), run_time=0.5)
        dish = K.petri_top("water", False, 1.1).move_to([-3.8, 0.1, 0])
        lab = T("처음: 물", 34).next_to(dish, DOWN, buff=0.3)
        self.play(FadeIn(dish), FadeIn(lab), run_time=0.6)
        tilt = K.petri_top("water", True, 1.1).move_to(dish)
        self.say(f"기울이면 물이 아래쪽으로 {o('흘러')} 모양이 바뀌어요",
                 "접시를 기울이면 물이 아래쪽으로 흘러서 모양이 바뀌어요. 손으로 만지면 축축하고 차가워요.")
        self.play(Transform(dish, tilt), run_time=0.9)
        self.play(Transform(dish, K.petri_top("water", False, 1.1).move_to(dish)), run_time=0.6)

        tank = VGroup(K.big_beaker(3.4, 2.4), K.salt_ice(3.4, 2.3)).move_to([2.6, -0.6, 0])
        tl = T("소금을 섞은 얼음", 30).next_to(tank, DOWN, buff=0.15)
        self.say("뚜껑을 덮고 소금을 섞은 얼음 속에 깊숙이 넣어요",
                 "뚜껑을 덮고 셀로판테이프로 고정한 다음, 소금을 섞은 얼음이 든 수조 가운데에 깊숙이 넣어요.")
        self.play(FadeIn(tank), FadeIn(tl), run_time=0.6)
        self.play(dish.animate.scale(0.7).move_to([2.6, -0.4, 0]), FadeOut(lab), run_time=1.0)
        front = K.salt_ice(3.4, 2.3, front=True).move_to(tank[1]).shift(DOWN * 0.3)
        self.play(FadeIn(front), run_time=0.4)
        self.say("시간이 지나면 접시의 물은 어떻게 될까요?", "시간이 지나면 페트리 접시에 담긴 물은 어떻게 될까요?")
        self.pause_screen(5, "얼음 속에 넣어 둔 물은?")
        done = K.petri_top("ice", False, 1.1).move_to([-3.8, 0.1, 0])
        self.play(FadeOut(front), dish.animate.move_to([-3.8, 0.1, 0]).scale(1 / 0.7), run_time=1.0)
        self.play(Transform(dish, done), run_time=0.6)
        lab2 = T("나중: 얼음", 34).next_to(done, DOWN, buff=0.3)
        arr = Arrow([-1.9, 1.2, 0], [-1.9, -0.9, 0], color=SOFT, stroke_width=8)
        al = T("기울여요", 30).next_to(arr, RIGHT, buff=0.15)
        self.say(f"꺼내서 기울여도 {r('흐르지 않고')} 모양이 일정해요",
                 "꺼내서 기울여 봐요. 흐르지 않고 모양이 일정해요. 단단해요!")
        self.play(FadeIn(lab2), Create(arr), FadeIn(al), run_time=0.6)
        self.play(Rotate(dish, 0.3), run_time=0.5)
        self.play(Rotate(dish, -0.3), run_time=0.5)
        self.say(f"물이 {o('얼음')}으로 변했어요", "페트리 접시의 물이 얼음으로 변했어요.")
        self.play(Indicate(VGroup(dish, lab2), color=BLUE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 실험해요 2 ──
    def exp2(self):
        self.section("실험해요 2")
        bottle = K.spray_bottle(1.3).move_to([-4.8, 0.6, 0])
        dish = K.spray_dish(0.0, 1.5).move_to([0.0, 0.4, 0])
        dish.set_opacity(1)
        empty = K.spray_dish(1.5, 1.5).move_to(dish)
        self.say("페트리 접시에 분무기로 물을 가볍게 한 번 뿌려요",
                 "이번에는 페트리 접시에 분무기로 물을 뿌려 볼게요. 가볍게 한 번만 뿌려요.")
        self.play(FadeIn(bottle), FadeIn(empty), run_time=0.6)
        self.play(FadeIn(dish), FadeOut(empty), run_time=0.6)
        lab = T("처음", 38).move_to([3.9, 1.6, 0])
        self.say("5분 간격으로 관찰해요. 접시는 만지지 않아요",
                 "5분 간격으로 관찰해요. 실험하는 동안 접시는 만지지 않아요.")
        self.play(FadeIn(lab), run_time=0.4)
        self.pause_screen(5, "뿌린 물방울은 어떻게 될까요?")
        for k, name in ((0.45, "5분 뒤"), (0.95, "10분 뒤")):
            nd = K.spray_dish(k, 1.5).move_to(dish)
            self.say(f"{name}: 물방울이 작아지고 개수도 줄어요",
                     f"{name}에는 물방울이 더 작아지고 개수도 줄었어요.")
            self.play(Transform(dish, nd), Transform(lab, T(name, 38).move_to(lab)), run_time=1.2)
        vp = VGroup(*[K.vapor(0.8, 1, 0).move_to([x, y, 0]) for x, y in ((-0.8, 2.1), (0.0, 2.3), (0.8, 2.1), (1.4, 1.8), (-1.3, 1.8))])
        self.say(f"사라진 물은 눈에 보이지 않는 {o('수증기')}가 되어 공기 중으로",
                 "사라진 물은 어디로 갔을까요? 눈에 보이지 않는 수증기로 변해 공기 중으로 날아갔어요. 점선은 수증기를 그림으로 나타낸 거예요.")
        self.play(FadeIn(vp, shift=UP * 0.3, lag_ratio=0.15), run_time=1.0)
        self.say("날씨가 흐리고 습하면 더 천천히 사라질 수 있어요",
                 "실험하는 날의 날씨에 따라 결과가 다를 수 있어요. 흐리고 습한 날에는 물방울이 더 천천히 사라져요.")
        self.settle()
        clear_stage(self)

    # ── 정리해요 ──
    def organize(self):
        self.section("정리해요")
        row1 = M(f"실험해요 1:  물  →  얼음   {o('액체 → 고체')}", 44).move_to([0, 2.0, 0])
        row2 = M(f"실험해요 2:  물  →  수증기   {o('액체 → 기체')}", 44).move_to([0, 0.9, 0])
        self.say(f"실험해요 1: 액체인 물이 {o('고체')}인 얼음으로", "실험해요 1에서 페트리 접시의 물은 액체 상태에서 고체 상태로 변했어요.")
        self.play(FadeIn(row1), run_time=0.6)
        self.say(f"실험해요 2: 액체인 물이 {o('기체')}인 수증기로", "실험해요 2에서 뿌린 물은 액체 상태에서 기체 상태로 변했어요. 물이 없어진 것이 아니에요.")
        self.play(FadeIn(row2), run_time=0.6)
        self.settle()
        self.play(FadeOut(row1), FadeOut(row2), run_time=0.4)
        cards, arrows = change_ring()
        self.say("물·얼음·수증기는 서로 변할 수 있어요",
                 "물은 얼음으로, 얼음은 물로 변할 수 있어요. 또 물은 수증기로, 수증기는 물로 변할 수 있어요.")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=0.9)
        self.play(*[Create(a) for a in arrows], run_time=1.4)
        title = M(f"이런 현상을 {r('물의 상태 변화')}라고 해요", 44).move_to([0, -1.9, 0])
        self.say(f"이런 현상을 {r('물의 상태 변화')}라고 해요", "이런 현상을 물의 상태 변화라고 해요.")
        self.play(FadeIn(title), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생활 속 상태 변화 ──
    def daily(self):
        self.section("생활 속 상태 변화")
        items = [(K.ice_pop(True), "막대 얼음과자가 녹아요", "얼음 → 물"),
                 (K.ice_tray(), "얼음 틀의 물을 얼려요", "물 → 얼음"),
                 (VGroup(*[K.ice_cube(0.1, "#FFFFFF").move_to([x, y, 0]) for x, y in
                         ((-0.5, 0.4), (0.0, 0.7), (0.5, 0.3), (-0.2, 0.0), (0.3, -0.3), (-0.6, -0.4))]), "물로 인공눈을 만들어요", "물 → 얼음"),
                 (K.pet_frozen(2, 0.7), "얼린 물병의 물을 마셔요", "얼음 → 물"),
                 (K.wet_wipe(), "물휴지가 말라요", "물 → 수증기"),
                 (K.Bottle(0, 0, 0.9, 1.4).outline().add(K.rect(0.7, 0.5, K.WATER, 0, 0.3, sw=0)), "제습기 통에 물이 모여요", "수증기 → 물")]
        cards = VGroup()
        for i, (pic, t, ans) in enumerate(items):
            box = K.rect(4.2, 2.35, PAPER, stroke=SOFT, r=0.2)
            K.fit(pic, 1.3, 1.25).move_to(box.get_center() + LEFT * 1.35 + UP * 0.15)
            tt = T(t, 25).move_to(box.get_center() + RIGHT * 0.65 + UP * 0.45)
            if tt.width > 2.7:
                tt.scale_to_fit_width(2.7)
            a = T(ans, 32, ORANGE).move_to(box.get_center() + RIGHT * 0.65 + DOWN * 0.45)
            c = VGroup(box, pic, tt, a)
            c.move_to([(i % 3 - 1) * 4.45, 1.5 - (i // 3) * 2.6, 0])
            c.ans = a
            cards.add(c)
        self.say("우리 주변에서 물의 상태 변화를 찾아봐요", "우리 주변에서 물의 상태가 어떻게 변하는지 찾아봐요.")
        self.play(*[FadeIn(VGroup(c[0], c[1], c[2])) for c in cards], run_time=1.0)
        self.pause_screen(5, "물의 상태가 어떻게 변했을까요?")
        texts = [("막대 얼음과자가 녹으면 얼음이 물로", "막대 얼음과자가 녹으면, 얼음이 물로 변해요."),
                 ("얼음 틀의 물은 얼음으로", "얼음 틀에 물을 담아 냉동실에 넣으면, 물이 얼음으로 변해요."),
                 ("인공눈: 작은 물방울이 얼어 눈이 돼요", "물을 이용해 인공눈을 만들 수 있어요. 아주 작은 물방울을 뿜으면 땅에 떨어지는 동안 얼어 눈이 돼요."),
                 ("얼린 페트병의 얼음이 물로", "페트병에 얼린 물은 시간이 지나면 녹아서 마실 수 있어요. 얼음이 물로 변했어요."),
                 ("물휴지의 물이 수증기로", "뚜껑을 열어 놓으면 물휴지가 말라요. 물휴지의 물이 수증기로 변했어요."),
                 (f"공기 중의 {o('수증기')}가 물로", "제습기를 켜 두면 통에 물이 모여요. 공기 중의 수증기가 물로 변했어요.")]
        for c, (s, n) in zip(cards, texts):
            self.say(s, n)
            self.play(FadeIn(c.ans, scale=1.3), Indicate(c[0], color=ORANGE, scale_factor=1.03), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기: 하얀 김 ──
    def correct(self):
        self.section("생각 바로잡기")
        kettle = VGroup(K.E(2.2, 1.6, "#C6CED6", 0, 0), K.poly([(0.9, 0.2), (1.7, 0.75), (1.75, 0.6), (1.0, -0.1)], "#C6CED6"),
                        K.rect(0.5, 0.2, INK, 0, 0.85, sw=0, r=0.05)).move_to([-3.6, -0.6, 0])
        spout = kettle[1].get_corner(UP + RIGHT)
        mist = VGroup(*[K.E(0.6 + 0.2 * i, 0.4, PAPER, spout[0] + 0.9 + 0.55 * i, spout[1] + 0.55 + 0.35 * i, stroke="#C6CED6", sw=3, op=0.95)
                        for i in range(4)])
        inv = K.L((spout[0] + 0.05, spout[1] + 0.05), (spout[0] + 0.45, spout[1] + 0.3), "#7FA9C2", 4)
        q = T("주전자에서 나오는 하얀 김은 수증기일까요?", 42).move_to([0, 2.6, 0])
        self.say("주전자에서 나오는 하얀 김은 수증기일까요?", "주전자에서 나오는 하얀 김은 수증기일까요?")
        self.play(FadeIn(q), FadeIn(kettle), FadeIn(mist, lag_ratio=0.2), run_time=0.9)
        self.pause_screen(5, "하얀 김은 수증기일까요?")
        k1 = T("하얀 김", 32).next_to(mist, UP, buff=0.2)
        a1 = M(f"= 수증기가 식어서 생긴 {r('작은 물방울')}", 34).next_to(mist, RIGHT, buff=0.3)
        if a1.get_right()[0] > 6.9:
            a1.shift(LEFT * (a1.get_right()[0] - 6.9))
        a1.shift(DOWN * 0.6)
        self.say(f"하얀 김은 수증기가 식어서 생긴 {r('작은 물방울')}이에요",
                 "아니에요. 수증기는 눈에 보이지 않아요. 눈에 보이는 하얀 김은 수증기가 식어서 생긴 작은 물방울이에요.")
        self.play(FadeIn(k1), FadeIn(a1), Indicate(mist, color=BLUE), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card(["우리 주변에서 물은 세 가지 상태로 있으며,",
                            f"액체인 {r('물')}은 고체인 {r('얼음')}이나,",
                            "기체인 수증기로 변할 수 있습니다."], w=12.4, size=46).move_to([0, 0.7, 0])
        self.say(f"액체인 {r('물')}은 고체인 {r('얼음')}이나 기체인 수증기로 변할 수 있어요",
                 "우리 주변에서 물은 세 가지 상태로 있으며, 액체인 물은 고체인 얼음이나, 기체인 수증기로 변할 수 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
