"""「과학 원리 돋보기」 5학년 18화 — 혈액은 어떻게 온몸을 돌까? (5-1 4단원 우리 몸의 구조와 기능 4차시, 화 코드 5-1-4-c)

바탕: grade5/science/sem1/u4-3.html(원본 _build_tb/src/u4-3.html) — 도입(자동 심장 충격기의 하트·번개 = 심장),
혈액 순환·순환기관 뜻, 심장(주먹만 한 크기, 가슴 중앙에서 왼쪽으로 약간)·혈관(가늘고 긴 관, 온몸),
순환기관 모형실험(펌프를 쥐면 잠기지 않은 호스로 나가고, 펴면 잠긴 호스 쪽 물이 들어옴 — 한 방향, 빠르게 쥐면 빨리),
모형과 우리 몸(붉은 색소 물 = 혈액, 호스 = 혈관, 펌프 = 심장), 혈액 순환, 붉은·푸른 혈관은 이어져 있음, 심폐 소생술, 한눈에 쏙.
최종: ./make_final.sh s5ep18
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker, always_redraw,
                   Dot, Ellipse, Arrow, Line, LaggedStart, linear)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, PAPER, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def red(s):
    return f'<span foreground="{K.ART}">{s}</span>'


def blue(s):
    return f'<span foreground="{K.VEN}">{s}</span>'


class S5Ep18(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 18
    EP_TITLE = "혈액은 어떻게 온몸을 돌까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.organs()
        self.pump()
        self.match()
        self.flow()
        self.cpr()
        self.summary()
        self.closing(f"{o('심장')}은 펌프 작용으로 혈액을 온몸으로 보내고,\n혈액은 {g('혈관')}을 따라 온몸을 돌아 다시 심장으로 와요",
                     next_preview="5학년 19화 · 숨을 쉴 때")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        ad = K.aed(1.25).move_to([-3.0, 0.5, 0])
        tg = T("응급 상황에 쓰는 도구", 32).next_to(ad, DOWN, buff=0.3)
        self.say("응급 상황에 쓰는 도구의 표시예요. 무엇을 뜻할까요?",
                 "응급 상황에 사용하는 도구에 이런 표시가 있어요. 하트와 번개 모양은 무엇을 뜻할까요?")
        self.play(FadeIn(ad, scale=0.9), FadeIn(tg), run_time=0.7)
        self.pause_screen(5, "하트 모양은 무엇을 뜻할까요?")
        ans = K.text_card([f"하트와 번개 = {r('심장')}", "심장이 멈춘 사람에게 쓰는", f"{o('자동 심장 충격기')}예요"],
                          w=6.0, size=36).move_to([3.0, 0.6, 0])
        self.say(f"하트와 번개 모양은 {r('심장')}을 뜻해요",
                 "하트와 번개 모양은 심장을 뜻해요. 이 도구는 심장이 멈춘 사람에게 쓰는 자동 심장 충격기예요.")
        self.play(FadeIn(ans), run_time=0.6)
        self.settle()
        self.play(FadeOut(VGroup(ad, tg, ans)), run_time=0.5)
        d = K.text_card([f"혈액이 끊임없이 온몸을 도는 것 → {o('혈액 순환')}",
                         f"혈액 순환을 담당하는 기관 → {g('순환기관')}"], w=11.4, size=40).move_to([0, 0.6, 0])
        self.say(f"혈액이 온몸을 도는 것이 {o('혈액 순환')}, 담당 기관이 {g('순환기관')}이에요",
                 "우리가 살아가려면 혈액이 끊임없이 온몸을 돌아야 해요. 이러한 혈액의 이동을 혈액 순환이라 하고, 이를 담당하는 기관을 순환기관이라고 해요.")
        self.play(FadeIn(d), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 순환기관 ──
    def organs(self):
        self.section("순환기관")
        b = K.body(['heart'], h=5.7, vessels=True).move_to([-3.7, 0.15, 0])
        self.say("순환기관에는 무엇이 있을까요?", "순환기관 모형을 관찰해 이름을 붙여 봐요.")
        self.play(FadeIn(b), run_time=0.7)
        hp = K.vpt(b, 180, 186)
        vp = K.vpt(b, 96, 200)
        lh = K.pointer(hp, hp + RIGHT * 2.1, "심장", K.ART, 32)
        lv = K.pointer(vp, vp + LEFT * 1.3, "혈관", K.VEN, 32)
        self.play(FadeIn(lh), FadeIn(lv), run_time=0.6)
        c1 = K.text_card([f"{r('심장')}: 자신의 주먹만 한 크기", "가슴 중앙에서 왼쪽으로", "약간 치우쳐 있어요"],
                         w=5.6, size=34).move_to([4.15, 1.45, 0])
        self.say(f"{r('심장')}은 주먹만 한 크기로, 가슴 중앙에서 왼쪽으로 약간 치우쳐 있어요",
                 "심장은 자신의 주먹만 한 크기로, 가슴 중앙에서 왼쪽으로 약간 치우쳐 있어요. 주먹을 쥐고 왼쪽 가슴에 대어 봐요.")
        self.play(FadeIn(c1), Indicate(lh[2]), run_time=0.7)
        c2 = K.text_card([f"{blue('혈관')}: 가늘고 긴 관 모양", "온몸에 퍼져 있어요"], w=5.6, size=34).move_to([4.15, -1.05, 0])
        self.say(f"{blue('혈관')}은 가늘고 긴 관 모양이고, 온몸에 퍼져 있어요",
                 "혈관은 가늘고 긴 관 모양이고, 손끝과 발끝까지 온몸에 퍼져 있어요.")
        self.play(FadeIn(c2), Indicate(lv[2]), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 실험해요: 펌프 ──
    def pump(self):
        self.section("실험해요")
        rig = K.pump_rig(0, h=5.0, pump=False).move_to([0, 0.35, 0])
        cum = K.pump_len()
        TOT, BS, BE = cum[-1], cum[2], cum[3]
        self.d = [i * TOT / 26 for i in range(26)]
        self.drops = []
        sq = ValueTracker(0)
        st = {"d": list(self.d), "mode": None, "p": 0.0}

        def dots():
            grp = VGroup()
            for x in st["d"]:
                if x <= TOT:
                    grp.add(Dot(K.pump_pt(rig, x), radius=0.075, color="#c62f24"))
                else:
                    end = K.pump_pt(rig, TOT)
                    grp.add(Dot(end + DOWN * (x - TOT) * 0.012, radius=0.075, color="#c62f24"))
            return grp
        bulb = always_redraw(lambda: K.pump_bulb(rig, sq.get_value()))
        dd = always_redraw(dots)
        l1 = T("물에 잠긴 호스", 28, K.NAVY).move_to(K.vpt(rig, 196, 82))
        l2 = T("물에 잠기지 않은 호스", 28, K.NAVY).move_to(K.vpt(rig, 590, 82))
        l3 = T("펌프", 28, K.NAVY).move_to(K.vpt(rig, 370, 162))
        l4 = T("붉은 색소 물", 28, PAPER).move_to(K.vpt(rig, 380, 296))
        self.say("수조의 붉은 색소 물에 펌프 달린 호스를 넣어요",
                 "순환기관 모형실험을 해 봐요. 한쪽 호스는 붉은 색소 물에 넣고, 다른 쪽 호스는 물에 잠기지 않게 잡아요.")
        self.play(FadeIn(rig), FadeIn(bulb), FadeIn(dd), run_time=0.8)
        self.play(FadeIn(VGroup(l1, l2, l3, l4)), run_time=0.5)
        self.say("펌프를 쥐었다 펴면 붉은 색소 물은 어떻게 이동할까요?",
                 "펌프를 쥐었다 폈다 하면 붉은 색소 물은 어떻게 이동할까요?")
        self.settle()
        self.pause_screen(5, "붉은 색소 물은 어느 쪽으로 갈까요?")

        def cycle(t):
            d0 = list(st["d"])
            p = ValueTracker(0)

            def upd(m):
                v = p.get_value()
                st["d"] = [x + 60 * v if x >= BS else x for x in d0]
            dd.add_updater(upd)
            self.play(p.animate.set_value(1), sq.animate.set_value(1), run_time=t)
            dd.remove_updater(upd)
            st["d"] = [x for x in st["d"] if x <= TOT + 30]
            d1 = list(st["d"])
            p2 = ValueTracker(0)

            def upd2(m):
                v = p2.get_value()
                st["d"] = [min(BE, x + 60 * v) if x < BE else (x + 30 * v if x > TOT else x) for x in d1]
            dd.add_updater(upd2)
            self.play(p2.animate.set_value(1), sq.animate.set_value(0), run_time=t)
            dd.remove_updater(upd2)
            st["d"] = [x for x in st["d"] if x <= TOT]
            while len(st["d"]) < 26:
                st["d"].append(len(st["d"]) * 1.5 % 40)
            st["d"].sort()
        self.say(f"쥐면 {o('잠기지 않은 호스')} 쪽으로 물이 나가요",
                 "펌프를 쥐면 물에 잠기지 않은 호스 쪽으로 붉은 색소 물이 나가요.")
        cycle(0.9)
        self.say(f"펴면 {o('잠긴 호스')} 쪽 물이 펌프로 들어와요",
                 "펌프를 펴면 물에 잠긴 호스 쪽의 붉은 색소 물이 펌프로 들어와요.")
        cycle(0.9)
        self.say(f"붉은 색소 물은 {g('한 방향')}으로만 이동해요",
                 "붉은 색소 물은 앞뒤로 왔다 갔다 하지 않고, 한 방향으로만 이동해요.")
        cycle(0.9)
        tag = K.label("빠르게 쥐면", ORANGE, 32).move_to([5.7, 0.5, 0])
        self.say(f"펌프를 {o('빠르게')} 쥐었다 펴면 물이 더 {o('빨리')} 이동해요",
                 "펌프를 빠르게 쥐었다 펴면 붉은 색소 물이 더 빨리 이동하고, 느리게 쥐면 천천히 이동해요.")
        self.play(FadeIn(tag), run_time=0.3)
        for _ in range(4):
            cycle(0.25)
        self.settle()
        dd.clear_updaters()
        bulb.clear_updaters()
        clear_stage(self)

    # ── 모형과 우리 몸 ──
    def match(self):
        self.section("모형과 우리 몸")
        rows = [("붉은 색소 물", "혈액"), ("호스", "혈관"), ("펌프", "심장")]
        grp = VGroup()
        for i, (a, b_) in enumerate(rows):
            y = 1.95 - i * 1.1
            la = K.label(a, BLUE, 38).move_to([-2.2, y, 0])
            lb = K.label(b_, K.ART, 38).move_to([3.6, y, 0])
            ar = Arrow(la.get_right(), lb.get_left(), buff=0.25, color=ORANGE, stroke_width=7)
            grp.add(VGroup(la, ar, lb))
        hd = VGroup(T("모형", 32, BLUE).move_to([-2.2, 2.8, 0]), T("우리 몸", 32, K.ART).move_to([3.6, 2.8, 0]))
        self.say("모형의 각 부분은 우리 몸의 어떤 부분과 같을까요?",
                 "모형의 각 부분은 우리 몸의 어떤 부분과 같은 역할을 할까요?")
        self.play(FadeIn(hd), *[FadeIn(r_[0]) for r_ in grp], run_time=0.6)
        self.say(f"붉은 색소 물은 {red('혈액')}, 호스는 {red('혈관')}, 펌프는 {red('심장')}이에요",
                 "붉은 색소 물은 혈액, 호스는 혈관, 펌프는 심장과 같은 역할을 해요.")
        self.play(LaggedStart(*[AnimationGroupSafe(r_) for r_ in grp], lag_ratio=0.5), run_time=1.8)
        dif = K.text_card([f"우리 몸의 혈관은 {o('온몸')}에 퍼져 있고,", f"심장은 {o('스스로 쉬지 않고')} 뛰어요"], w=9.0, size=34).move_to([0.7, -1.65, 0])
        self.say(f"다른 점: 혈관은 온몸에, 심장은 {o('스스로 쉬지 않고')} 뛰어요",
                 "모형과 다른 점도 있어요. 실제 몸의 혈관은 온몸에 퍼져 있고, 심장은 스스로 쉬지 않고 뛰어요.")
        self.play(FadeIn(dif), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 혈액 순환 ──
    def flow(self):
        self.section("혈액 순환")
        pos = np.array([-3.2, 0.15, 0])
        b = K.body([], h=5.7, vessels=True).move_to(pos)
        heart0 = K.vb_svg(K.ORG['heart'], (-10, 0, 340, 470), 5.7).move_to(pos)
        t = ValueTracker(0)
        loops = []
        for rr, bb in K.LOOPS:
            pts = K.path_pts(b, rr + bb)
            Ls = [0.0]
            for i in range(1, len(pts)):
                Ls.append(Ls[-1] + np.linalg.norm(pts[i] - pts[i - 1]))
            red_len = Ls[len(rr) - 1]
            loops.append((pts, Ls[-1], red_len))

        def dots():
            grp = VGroup()
            tv = t.get_value()
            for j, (pts, L, rl) in enumerate(loops):
                for k in range(6):
                    f = (tv * 0.12 + k / 6 + j * 0.07) % 1
                    p = K.along(pts, f)
                    col = "#ff6b5e" if f * L < rl else "#6fa3e0"
                    grp.add(Dot(p, radius=0.07, color=col).set_stroke(PAPER, 1.5))
            return grp
        hc = K.vpt(b, 176, 188)

        def heart():
            beat = 1 + 0.09 * max(0, np.sin(t.get_value() * 6))
            return heart0.copy().scale(beat, about_point=hc)
        dd = always_redraw(dots)
        hh = always_redraw(heart)
        leg = VGroup(VGroup(Dot(radius=0.1, color="#ff6b5e"), T("심장에서 나가는 혈액", 28)).arrange(RIGHT, buff=0.15),
                     VGroup(Dot(radius=0.1, color="#6fa3e0"), T("심장으로 들어오는 혈액", 28)).arrange(RIGHT, buff=0.15)
                     ).arrange(DOWN, buff=0.2, aligned_edge=LEFT).move_to([3.2, 2.35, 0])
        self.say("혈액은 우리 몸속에서 어떻게 순환할까요?", "혈액은 우리 몸속에서 어떻게 순환할까요? 심장을 뛰게 해 봐요.")
        self.play(FadeIn(b), FadeIn(hh), FadeIn(dd), FadeIn(leg), run_time=0.7)
        self.play(t.animate.set_value(4), run_time=4, rate_func=linear)
        c1 = K.text_card([f"심장에서 나온 혈액은 {o('혈관')}을 따라", f"{o('영양소')}와 {o('산소')}를 온몸에 운반하고,",
                          f"다시 {g('심장')}으로 돌아와요"], w=7.2, size=34).move_to([3.3, 0.0, 0])
        self.say(f"혈액은 {o('영양소')}와 {o('산소')}를 온몸에 운반하고 다시 심장으로 돌아와요",
                 "심장에서 나온 혈액은 혈관을 따라 영양소와 산소를 온몸에 운반하고, 다시 심장으로 돌아와요. 이 순환 과정을 계속 되풀이해요.")
        self.play(FadeIn(c1), t.animate.set_value(10), run_time=6, rate_func=linear)
        self.settle()
        self.play(FadeOut(c1), run_time=0.3)
        q = K.text_card(["붉은 혈관과 푸른 혈관은", "서로 연결되어 있지 않아요."], w=7.2, size=34).move_to([3.3, 0.2, 0])
        self.say("붉은 혈관과 푸른 혈관은 서로 연결되어 있지 않을까요?",
                 "그림의 붉은색 혈관과 푸른색 혈관은 서로 연결되어 있지 않을까요?")
        self.play(FadeIn(q), t.animate.set_value(13), run_time=3, rate_func=linear)
        self.settle()
        x1 = K.ox_mark(False, 0.35).next_to(q, DOWN, buff=0.25)
        ends = VGroup(*[Dot(K.vpt(b, *rr[-1]), radius=0.13, color="#9b59b6").set_fill(opacity=0).set_stroke("#9b59b6", 5)
                        for rr, bb in K.LOOPS])
        self.say(f"아니에요. 두 혈관은 {g('아주 가는 혈관')}으로 이어져 있어요",
                 "아니에요. 붉은색과 푸른색은 심장에서 나가는 혈액과 들어오는 혈액의 혈관을 구분한 것일 뿐, 두 혈관은 아주 가는 혈관으로 이어져 있어요.")
        self.play(Create(x1), FadeIn(ends), t.animate.set_value(18), run_time=5, rate_func=linear)
        self.settle()
        dd.clear_updaters()
        hh.clear_updaters()
        clear_stage(self)

    # ── 심폐 소생술 ──
    def cpr(self):
        self.section("생활 속에서")
        ad = K.aed(0.9).move_to([-5.3, 0.6, 0])
        q = K.text_card(["심장박동이 멈추었을 때", "빠른 시간 안에 심폐 소생술을 해야 하는 까닭은?"], w=9.4, size=38).move_to([1.3, 1.3, 0])
        self.say("심장이 멈추면 왜 빨리 심폐 소생술을 해야 할까요?",
                 "심장박동이 멈추었을 때 빠른 시간 안에 심폐 소생술을 해야 하는 까닭은 무엇일까요?")
        self.play(FadeIn(ad), FadeIn(q), run_time=0.6)
        self.pause_screen(4, "심장이 하는 일을 떠올려 봐요")
        a = K.text_card([f"온몸에 {o('영양소')}와 {o('산소')}를 공급하지 못해", "우리 몸이 제 기능을 할 수 없기 때문이에요"],
                        w=9.4, size=38).move_to([1.3, -0.9, 0])
        self.say(f"온몸에 {o('영양소')}와 {o('산소')}를 공급하지 못하기 때문이에요",
                 "심장이 멈추면 온몸에 영양소와 산소를 공급하지 못해, 우리 몸이 제 기능을 할 수 없기 때문이에요.")
        self.play(FadeIn(a), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        b = K.body(['heart'], h=5.4, vessels=True).move_to([-4.2, 0.15, 0])
        card = K.text_card([f"순환기관은 {g('혈액')}이 온몸을", "순환하도록 합니다.",
                            f"{o('심장')}: 펌프 작용으로 혈액을 온몸으로", f"{o('혈관')}: 혈액이 이동하는 통로"],
                           w=7.4, size=38).move_to([2.5, 0.4, 0])
        self.say(f"순환기관은 {g('혈액')}이 온몸을 순환하도록 해요",
                 "순환기관에는 심장과 혈관이 있어요. 심장은 끊임없이 펌프 작용을 하여 혈액을 온몸으로 보내고, 혈관은 혈액이 이동하는 통로예요. 순환기관은 혈액이 온몸을 순환하도록 해요.")
        self.play(FadeIn(b), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)


def AnimationGroupSafe(row):
    from manim import AnimationGroup, GrowArrow
    return AnimationGroup(GrowArrow(row[1]), FadeIn(row[2], shift=LEFT * 0.2), lag_ratio=0.4)
