"""「과학 원리 돋보기」 5학년 33화 — 액체와 기체에서 열의 이동(대류) (5-2 3단원 열과 우리 생활 5~6차시, 화 코드 5-2-3-d)

바탕: grade5/science/sem2/u3-4.html(원본 _build_tb/src2/u3-4.html) — 도입(찜기 만두, 주전자 바닥만 가열),
실험 1(사각 통 바닥 한가운데 잉크, 아래에 뜨거운 물 컵 → 잉크가 위로 → 양옆 → 벽 따라 아래로),
실험 2(아크릴 통 안 고온용 열 변색 붙임딱지, 촛불 → 윗부분부터 색깔 변화), 대류 정의(물을 끓일 때 순환),
생각 바로잡기(잉크·붙임딱지는 열이 아니라 열의 이동을 보여 주는 도구), 난방기(바닥 가까이)·냉방기(위쪽), 한눈에 쏙(대류), 안전.
최종: ./make_final.sh s5ep33
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, GrowArrow, Dot,
                   ValueTracker, always_redraw, linear)

from series_style import GREEN, INK, ORANGE, SOFT, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def rr(i, k):
    x = np.sin(i * 127.1 + k * 311.7) * 43758.5453
    return x - np.floor(x)


class S5Ep33(EpisodeScene):
    GRADE, SEM = 5, 2
    EP_NO = 33
    EP_TITLE = "액체와 기체에서 열의 이동(대류)"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.liquid()
        self.gas()
        self.convection()
        self.room_use()
        self.summary()
        self.closing(f"액체나 기체에서 데워진 물질이 위로 올라가고\n차가운 물질이 내려오며 열이 이동해요: {o('대류')}",
                     next_preview="5학년 34화 · 빛에 의한 열의 이동(복사)")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        st = K.steamer().scale(1.3).move_to([-3.0, 0.6, 0])
        ket = VGroup(K.kettle(boil=False).scale(1.2), K.flame(0.9)).arrange(DOWN, buff=0.05).move_to([3.0, 0.5, 0])
        t1 = T("찜기 속 만두", 28).next_to(st, DOWN, buff=0.25)
        t2 = T("바닥만 가열하는 주전자", 28).next_to(ket, DOWN, buff=0.25)
        self.say("주전자 바닥만 가열해도 물 전체가 끓는 까닭은?",
                 "찜기 안의 만두는 여러 층이 모두 골고루 익어요. 주전자는 바닥만 가열해도 물 전체가 끓어요. 왜 그럴까요?")
        self.play(FadeIn(st), FadeIn(ket), FadeIn(t1), FadeIn(t2), run_time=0.8)
        self.pause_screen(4, "물 전체가 끓는 까닭은?")
        self.say(f"{o('물')}과 {o('수증기')}에서도 열이 이동하기 때문이에요",
                 "물에서도 열이 이동하기 때문이에요. 찜기도 아래에서 데워진 수증기가 위로 올라와 전체가 뜨거워져요. 액체와 기체에서 열이 어떻게 이동하는지 알아봐요.")
        self.play(Indicate(t1, color=ORANGE), Indicate(t2, color=ORANGE), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 실험 1: 액체 ──
    def liquid(self):
        self.section("실험 1 · 물")
        cx, y0, W, H = -3.3, -1.2, 4.6, 3.0
        tk = K.tank(W, H, 0.75).move_to([cx, y0 + H / 2 - 0.38, 0])
        tk.shift([cx, y0, 0] - np.array([tk[-1].get_center()[0], tk[-1].get_bottom()[1], 0]))
        bot, top = y0 + 0.14, y0 + H * 0.75 - 0.3
        ink0 = K.E(0.32, 0.16, K.INK_P, cx, bot, stroke=K.INK_P, sw=0)
        self.say("사각 통 바닥 한가운데에 잉크를 조금 넣어요",
                 "물을 4분의 3 정도 넣은 사각 통을 받침대에 올리고, 스포이트로 바닥 한가운데에 잉크를 조금 넣어요.")
        self.play(FadeIn(tk), run_time=0.6)
        self.play(FadeIn(ink0), run_time=0.4)
        opts = K.lines("잉크 바로 아래에 뜨거운 물 컵을 넣으면?\n㉠ 위로   ㉡ 옆으로   ㉢ 아래로(그대로)", 30)
        opts.scale_to_fit_width(min(opts.width, 6.6)).move_to([3.4, 1.6, 0])
        self.play(FadeIn(opts), run_time=0.4)
        safe = K.safety_note("잉크가 눈이나 피부에 튀지 않게 조심해요.\n뜨거운 물(60~70 °C)은 안전 장갑을 끼고 다뤄요.", w=7.0, size=26).move_to([3.4, -0.2, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.pause_screen(5, "잉크는 어느 쪽으로 움직일까요?")
        cup = K.hot_cup(1.1, 0.72).move_to([cx, y0 - 0.38, 0])
        self.say("뜨거운 물이 든 컵을 잉크 바로 아래에 밀어 넣어요",
                 "뜨거운 물이 든 컵을 잉크 바로 아래에 밀어 넣어요. 잉크가 어떻게 움직이는지 잘 보세요.")
        self.play(FadeIn(cup, shift=RIGHT * 1.5), run_time=0.8)
        pl, pr = K.loop_paths(cx, top, bot, cx - W / 2 + 0.35, cx + W / 2 - 0.35)
        vt = ValueTracker(0.0)

        def ink():
            t = vt.get_value()
            gdots = VGroup()
            for i in range(44):
                rel = i * 0.2
                if t < rel:
                    continue
                d = (t - rel) * 0.62
                p = K.along(pr if i % 2 else pl, d)
                j = (rr(i, 1) - 0.5) * 0.18
                q = p + np.array([j if abs(p[0] - cx) > 0.2 else j * 0.4, j if abs(p[1] - bot) > 0.2 else 0, 0])
                gdots.add(Dot(q, radius=0.07 + rr(i, 2) * 0.05, color=K.INK_P, fill_opacity=max(0.3, 0.9 - d / 14)))
            return gdots
        dots = always_redraw(ink)
        self.add(dots)
        self.play(vt.animate.set_value(3.0), run_time=2.5, rate_func=linear)
        self.say(f"잉크가 {o('위로')} 올라가요!",
                 "잉크가 위로 올라가요! 뜨거운 물 위에서 온도가 높아진 물이 위로 올라가기 때문이에요.")
        self.play(vt.animate.set_value(6.5), run_time=3.0, rate_func=linear)
        self.settle()
        self.say("위에서 양옆으로 퍼진 뒤, 벽을 따라 아래로 내려와요",
                 "위로 올라간 잉크가 물 윗부분에서 양옆으로 퍼지고, 통의 벽을 따라 아래로 내려와요.")
        self.play(vt.animate.set_value(13.0), run_time=5.0, rate_func=linear)
        dots.clear_updaters()
        lp = K.loops(cx, top, bot, cx - W / 2 + 0.35, cx + W / 2 - 0.35, col=K.HOT, sw=6)
        self.play(FadeOut(opts), FadeOut(safe), Create(lp), run_time=1.0)
        self.settle()
        card = K.text_card([f"온도가 높아진 물은 {r('위로')} 올라가고,",
                            f"온도가 낮은 물은 {o('아래로')} 밀려 내려오면서",
                            "물 전체로 열이 이동해요"], w=6.6, size=32).move_to([3.4, 0.6, 0])
        self.say(f"데워진 물은 {r('위로')}, 차가운 물은 {o('아래로')} 내려오며 열이 이동해요",
                 "온도가 높아진 물이 위로 올라가고, 온도가 낮은 물이 아래로 밀려 내려오면서 물 전체로 열이 이동해요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 실험 2: 기체 ──
    def gas(self):
        self.section("실험 2 · 공기")
        cx, y0, W, H = -2.4, -2.1, 2.8, 4.0
        box = K.acryl_box(W, H).move_to([cx, y0 + H / 2, 0])
        cd = K.candle(True, 0.9).move_to([cx, y0 + 0.08, 0], aligned_edge=DOWN)
        lx, rx = cx - W / 2 + 0.4, cx + W / 2 - 0.4
        ytop, yleg = y0 + H - 0.5, y0 + H * 0.38
        vt = ValueTracker(0.0)

        def sticker():
            t = vt.get_value()
            ftop = 0 if t < 3 else min(1.0, (t - 3) / 2)
            fleg = 0 if t < 5 else min(0.6, (t - 5) / 8)
            grp = VGroup()
            wbar = rx - lx
            grp.add(K.rect(wbar + 0.14, 0.14, K.ST_COLD, cx, ytop, stroke=K.ST_COLD, sw=0))
            if ftop > 0:
                grp.add(K.rect(wbar * ftop + 0.14 * ftop, 0.14, K.ST_HOT, cx, ytop, stroke=K.ST_HOT, sw=0))
            for x in (lx, rx):
                hl = ytop - yleg
                grp.add(K.rect(0.14, hl, K.ST_COLD, x, (ytop + yleg) / 2, stroke=K.ST_COLD, sw=0))
                if fleg > 0:
                    grp.add(K.rect(0.14, hl * fleg, K.ST_HOT, x, ytop - hl * fleg / 2, stroke=K.ST_HOT, sw=0))
            if t >= 0.5:
                pr = [(cx, y0 + 1.1), (cx, ytop - 0.35), (rx - 0.35, ytop - 0.35), (rx - 0.35, y0 + 0.5), (cx + 0.3, y0 + 0.5)]
                pl = [(2 * cx - x, y) for x, y in pr]
                for i in range(22):
                    rel = 0.5 + i * 0.35
                    if t < rel:
                        continue
                    p = K.along(pr if i % 2 else pl, (t - rel) * 0.75)
                    grp.add(Dot(p, radius=0.06, color="#9AA6B0", fill_opacity=0.75))
            return grp
        st = always_redraw(sticker)
        nm = T("열 변색 붙임딱지", 26, K.ST_COLD).move_to([cx, ytop + 0.75, 0])
        self.say("아크릴 통 안에 붙임딱지를 붙이고 촛불을 켜요",
                 "열 변색 붙임딱지를 접어, 구멍 뚫린 아크릴 통의 안쪽 벽에 닿지 않도록 끝부분만 붙였어요. 통 한가운데에 촛불을 켜요.")
        self.play(FadeIn(box), FadeIn(cd), FadeIn(st), FadeIn(nm), run_time=0.7)
        safe = K.safety_note("실험복·보안경·안전 장갑을 착용해요.\n화재와 화상에 주의하고, 촛불은 반드시 꺼요.", w=5.6, size=24).move_to([3.9, -1.5, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.pause_screen(4, "어느 부분의 색깔이 먼저 변할까요?")
        self.say(f"통 {o('윗부분')}의 붙임딱지 색깔이 먼저 변해요",
                 "촛불 주변의 공기가 데워져 위로 올라가요. 그래서 아크릴 통 윗부분의 붙임딱지 색깔이 먼저 변하고, 점점 아래쪽으로 변해요. 공기는 눈에 보이지 않아 회색 점으로 나타냈어요.")
        self.play(vt.animate.set_value(13.0), run_time=7.0, rate_func=linear)
        st.clear_updaters()
        self.settle()
        card = K.text_card([f"온도가 높아진 공기는 {r('위로')} 올라가고,",
                            f"온도가 낮은 공기는 {o('아래로')} 밀려 내려오면서",
                            "통 안의 공기 전체로 열이 이동해요"], w=6.0, size=28).move_to([3.9, 1.0, 0])
        self.say(f"공기도 데워진 것은 {r('위로')}, 차가운 것은 {o('아래로')} 움직여요",
                 "온도가 높아진 공기가 위로 올라가고, 온도가 낮은 공기가 아래로 밀려 내려오면서 통 안의 공기 전체로 열이 이동해요.")
        self.play(FadeIn(card, shift=LEFT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 대류 ──
    def convection(self):
        self.section("대류")
        card = K.text_card([f"온도가 높아진 물질이 위로 올라가고 온도가 낮은 물질이",
                            f"아래로 내려가면서 열이 이동하는 방식 → {o('대류')}"], w=12.6, size=36).move_to([0, 1.4, 0])
        self.say(f"액체·기체에서 이렇게 열이 이동하는 방식을 {o('대류')}라고 해요",
                 "액체나 기체를 가열할 때, 온도가 높아진 물질이 위로 올라가고 온도가 낮은 물질이 아래로 내려가면서 열이 이동하는 방식을 대류라고 해요. 물을 끓일 때도 대류로 물이 순환하며 물 전체가 뜨거워져요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.7)
        self.settle()
        mis = K.text_card(["잉크의 움직임과 붙임딱지의 색깔이 바로 '열'일까요?",
                           f"→ {g('아니요')}, 열은 눈에 보이지 않아요. 열의 이동을 보여 주는 도구예요"], w=12.6, size=28).move_to([0, -1.1, 0])
        self.say(f"잉크와 붙임딱지는 열의 이동을 {g('보여 주는 도구')}예요",
                 "생각 바로잡기! 열은 눈에 보이지 않아요. 잉크와 열 변색 붙임딱지는 열의 이동을 눈으로 볼 수 있게 도와주는 도구예요.")
        self.play(FadeIn(mis, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 난방기·냉방기 ──
    def room_use(self):
        self.section("생활 속 대류")
        a = K.room(heater="low", tint="warm", W=5.2, H=3.2).move_to([-3.4, -0.1, 0])
        b = K.room(cooler="high", tint="cool", W=5.2, H=3.2).move_to([3.4, -0.1, 0])
        la = T("전기난로: 바닥 가까이", 30, K.HOT).next_to(a, UP, buff=0.2)
        lb = T("냉방기: 위쪽", 30, K.COLD).next_to(b, UP, buff=0.2)
        ca, cb = a[0].get_center(), b[0].get_center()
        x0a, x1a = a.get_left()[0] + 1.3, a.get_right()[0] - 0.5
        x0b, x1b = b.get_left()[0] + 0.5, b.get_right()[0] - 0.5
        y0, y1 = a.get_bottom()[1] + 0.75, a.get_top()[1] - 0.45
        lpa = K.rect_loop(x0a, x1a, y0, y1, col=K.HOT, sw=6)
        lpb = K.rect_loop(x0b, x1b, y0, y1 - 0.45, col=K.COLD, sw=6)
        self.say("난방기와 냉방기는 어디에 두면 좋을까요?",
                 "전기난로와 냉방기는 방의 어디에 두면 좋을까요? 대류를 떠올려 봐요.")
        self.play(FadeIn(a), FadeIn(b), FadeIn(la), FadeIn(lb), run_time=0.7)
        self.settle()
        self.say(f"난로는 {r('바닥 가까이')}: 따뜻해진 공기가 위로 올라가며 순환해요",
                 "전기난로는 바닥 가까이에 둬요. 난로 주위에서 따뜻해진 공기가 위로 올라가고, 차가운 공기는 아래로 내려오며 순환해 방 안 전체가 따뜻해져요.")
        self.play(Create(lpa), run_time=1.2)
        self.settle()
        self.say(f"냉방기는 {o('위쪽')}: 차가워진 공기가 아래로 내려가며 순환해요",
                 "냉방기는 위쪽에 설치해요. 냉방기 주변에서 차가워진 공기는 아래로 내려가고, 따뜻한 공기는 위로 올라가며 방 안 전체가 시원해져요.")
        self.play(Create(lpb), run_time=1.2)
        note = T("그림의 색은 따뜻하고 차가운 정도를 나타낸 어림 그림이에요", 22, SOFT).next_to(VGroup(a, b), DOWN, buff=0.15)
        self.play(FadeIn(note), run_time=0.3)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"액체나 기체에서 열이 이동하는 방식을 {o('대류')}(이)라고 합니다."], w=12.4, size=40).move_to([0, 0.6, 0])
        self.say(f"액체나 기체에서 열이 이동하는 방식: {o('대류')}",
                 "액체나 기체에서 열이 이동하는 방식을 대류라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
