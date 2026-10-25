"""「과학 원리 돋보기」 5학년 10화 — 렌즈와 물을 지날 때 (5-1 2단원 빛의 성질 6차시, 화 코드 5-1-2-d)

바탕: grade5/science/sem1/u2-4.html(원본 _build_tb/src/u2-4.html) — 도입(돋보기로 보면 크게 확대되어 보임, 돋보기에는 렌즈),
알아봐요(렌즈: 투명한 유리나 플라스틱으로 빛이 통과할 때 방향이 변하도록 한 기구, 볼록 렌즈: 가운데가 볼록하고 가장자리로 갈수록 얇음,
오목 렌즈: 가운데가 오목하고 가장자리로 갈수록 두꺼움 — 여섯 가지 렌즈 모양 나누기는 길이 때문에 뺌), 실험해요 1(레이저 지시기를 좌우로 움직이며 렌즈에
비추기(위에서 본 모습): 볼록 렌즈 가장자리 → 가운데 쪽으로 꺾임, 오목 렌즈 가장자리 → 바깥쪽으로 꺾임, 가운데 → 거의 꺾이지 않음,
안전: 렌즈가 깨지지 않게·볼록 렌즈로 태양을 보지 않기·레이저 빛을 눈에 비추지 않기), 실험해요 2(우유 4~5방울을 탄 물, 공기에서 물로
비스듬히 → 꺾임, 수직 → 꺾이지 않음, '곧게 갔다면?' 점선, 앞쪽에 물을 뿌려 공기 중의 빛도 봄, 안전: 맛보지 않기·쏟지 않기),
정리해요(빛의 굴절: 빛이 직진하다가 서로 다른 물질의 경계에서 꺾여 나아가는 성질, 직진·반사·굴절), 한눈에 쏙(물에서 공기로
비스듬히 → 경계에서 꺾임).
빛의 길은 굴절 법칙으로 계산(렌즈 1.5, 물 1.33 — 앱과 같음). 앱에 '법선·입사각' 말이 없어 쓰지 않음.
최종: ./make_final.sh s5ep10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Transform, VGroup, Polygon,
                   Rectangle, Line, Circle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u12 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def laser_at(tip, deg, s=1.0):
    lz = K.laser(s)
    lz.rotate(np.radians(deg), about_point=np.array([0.0, 0, 0]))
    off = np.array([np.cos(np.radians(deg)), np.sin(np.radians(deg)), 0]) * 0.07 * s
    lz.shift(np.array([tip[0], tip[1], 0]) - off)
    return lz


BOX = (-6.1, 6.1, -1.75, 2.65)


class S5Ep10(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 10
    EP_TITLE = "렌즈와 물을 지날 때"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.lens_kinds()
        self.lens_lab()
        self.water_lab()
        self.refraction()
        self.summary()
        self.closing(f"빛이 서로 다른 물질의 경계에서 꺾여 나아가는 성질 = {g('빛의 굴절')}",
                     next_preview="5학년 11화 · 생활 속 거울과 렌즈")
        self.wait(0.5)

    # ── 궁금해요: 돋보기 ──
    def intro(self):
        self.section("궁금해요")
        txt = T("작은 글씨도 크게!", 40).move_to([-3.6, 1.6, 0])
        a0 = K.ant(0.8).move_to([-1.0, -0.6, 0])
        leaf = Polygon([1.8, -1.6, 0], [3.4, -0.6, 0], [4.6, -0.9, 0], [3.0, -1.7, 0], fill_color=K.LEAF, fill_opacity=1, stroke_width=0)
        self.say("돋보기로 물체를 관찰한 적이 있나요?", "돋보기로 작은 물체를 관찰한 적이 있나요?")
        self.play(FadeIn(txt), FadeIn(a0), FadeIn(leaf), run_time=0.6)
        mg = K.magnifier(1.05).move_to([4.2, 1.4, 0])
        self.play(FadeIn(mg), run_time=0.4)
        self.settle()
        c = a0.get_center()
        mg2 = K.magnifier(1.05)
        mg2.shift(c - mg2[0].get_center())
        self.play(Transform(mg, mg2), run_time=1.0)
        self.pause_screen(5, "돋보기로 보면 어떻게 보일까요?")
        disk = Circle(radius=1.0, fill_color=PAPER, fill_opacity=1, stroke_width=0).move_to(c)
        big = K.ant(1.6).move_to(c)
        self.play(FadeIn(disk), FadeIn(big, scale=0.5), run_time=0.7)
        self.bring_to_front(mg)
        self.say(f"돋보기로 보면 물체가 {o('크게 확대되어')} 보여요",
                 "돋보기로 보면 개미가 크게 확대되어 보여요. 돋보기에는 렌즈가 들어 있어요.")
        self.settle()
        clear_stage(self)

    # ── 알아봐요: 볼록 렌즈와 오목 렌즈 ──
    def lens_kinds(self):
        self.section("알아봐요")
        d = K.text_card([f"{o('렌즈')}: 투명한 유리나 플라스틱을 이용해", "빛이 통과할 때 빛의 방향이 변하도록 한 기구"],
                        w=10.4, size=34).move_to([0, 2.0, 0])
        cv = K.lens_icon("bi", 1.8)
        cc = K.lens_icon("bc", 1.8)
        c1 = VGroup(cv, T("볼록 렌즈", 34, BLUE), T("가운데가 볼록, 가장자리로 갈수록 얇아요", 25)).arrange(DOWN, buff=0.18)
        c2 = VGroup(cc, T("오목 렌즈", 34, ORANGE), T("가운데가 오목, 가장자리로 갈수록 두꺼워요", 25)).arrange(DOWN, buff=0.18)
        VGroup(c1, c2).arrange(RIGHT, buff=1.4).move_to([0, -0.5, 0])
        self.say(f"{o('렌즈')}는 빛이 지날 때 방향이 변하도록 한 기구예요",
                 "렌즈는 투명한 유리나 플라스틱을 이용해 빛이 통과할 때 빛의 방향이 변하도록 한 기구예요.")
        self.play(FadeIn(d), run_time=0.5)
        self.settle()
        self.play(FadeIn(c1, shift=UP * 0.2), FadeIn(c2, shift=UP * 0.2), run_time=0.7)
        self.say(f"가운데가 두꺼우면 {o('볼록 렌즈')}, 얇으면 {o('오목 렌즈')}예요",
                 "볼록 렌즈는 가운데가 볼록하고 가장자리로 갈수록 얇아요. 오목 렌즈는 가운데가 오목하고 가장자리로 갈수록 두꺼워요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 1: 렌즈에 비추기 ──
    def lens_lab(self):
        self.section("실험해요 1")
        pn = K.panel(12.4, 4.5, "#1B2230", 0, 0.45)
        y0 = 0.45
        axis = K.dashed([-6.0, y0], [6.0, y0], col="#56627A", sw=2, op=1)
        cvx = K.Lens("cv", 0.6, y0, H=1.6, R=3.2)
        lens = cvx.shape(op=0.6)
        name = T("볼록 렌즈", 30, PAPER).move_to([-4.6, 2.3, 0])
        top = T("위에서 본 모습", 24, "#AEB8C6").move_to([4.6, 2.3, 0])
        self.say("교실을 어둡게 하고 레이저 지시기를 볼록 렌즈에 비춰요",
                 "볼록 렌즈를 받침대에 끼우고, 교실을 어둡게 한 뒤 레이저 지시기를 렌즈에 비춰요.")
        self.play(FadeIn(pn), FadeIn(axis), FadeIn(lens), FadeIn(name), FadeIn(top), run_time=0.7)
        self.settle()
        safe = K.safety_note("렌즈가 깨지지 않게 조심해요. 볼록 렌즈로 태양을 바라보지 않아요. 레이저 지시기의 빛을 눈에 비추지 않아요.",
                             w=12.6, size=25).move_to([0, -2.25, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.say(f"{r('볼록 렌즈로 태양을 바라보지 않아요')}",
                 "렌즈가 깨지지 않게 조심하고, 볼록 렌즈로 태양을 바라보지 않아요.")
        self.settle()
        self.play(FadeOut(safe), run_time=0.3)
        x0 = -5.25
        lz = laser_at((x0, y0), 0)
        self.play(FadeIn(lz), run_time=0.3)
        mid = K.ray(cvx.trace(0.0, x0, BOX), col=K.LASER, sw=6)
        K.play_ray(self, mid, 1.0)
        self.say(f"렌즈의 {o('가운데')}를 지난 빛은 거의 꺾이지 않아요",
                 "렌즈의 가운데를 지난 빛은 거의 꺾이지 않아요.")
        self.settle()
        self.play(mid.animate.set_opacity(0.3), Transform(lz, laser_at((x0, y0 + 1.2), 0)), run_time=0.5)
        self.pause_screen(5, "가장자리를 지난 빛은 어떻게 될까요?")
        edge = K.ray(cvx.trace(1.2, x0, BOX), col=K.LASER, sw=6)
        K.play_ray(self, edge, 1.0)
        self.say(f"볼록 렌즈의 {o('가장자리')}를 지난 빛은 {g('가운데 쪽으로')} 꺾여요",
                 "볼록 렌즈의 가장자리를 지난 빛은 렌즈의 가운데 쪽으로 꺾여요.")
        self.settle()
        ghosts = VGroup(mid, edge)
        for h in (-1.2, 0.6):
            self.play(ghosts.animate.set_opacity(0.3), Transform(lz, laser_at((x0, y0 + h), 0)), run_time=0.4)
            rr = K.ray(cvx.trace(h, x0, BOX), col=K.LASER, sw=6)
            K.play_ray(self, rr, 0.6)
            ghosts.add(rr)
        self.settle()
        # 오목 렌즈
        ccv = K.Lens("cc", 0.6, y0, H=1.6, R=3.2)
        lens2 = ccv.shape(op=0.6)
        self.play(*[FadeOut(m) for m in ghosts], Transform(lens, lens2), Transform(name, T("오목 렌즈", 30, PAPER).move_to(name)),
                  Transform(lz, laser_at((x0, y0 + 1.2), 0)), run_time=0.7)
        self.say("이번에는 오목 렌즈의 가장자리에 비춰요", "이번에는 오목 렌즈의 가장자리에 비추어 봐요.")
        self.settle()
        e2 = K.ray(ccv.trace(1.2, x0, BOX), col=K.LASER, sw=6)
        K.play_ray(self, e2, 1.0)
        g2 = VGroup(e2)
        for h in (-1.2, 0.0):
            self.play(g2.animate.set_opacity(0.3), Transform(lz, laser_at((x0, y0 + h), 0)), run_time=0.4)
            rr = K.ray(ccv.trace(h, x0, BOX), col=K.LASER, sw=6)
            K.play_ray(self, rr, 0.6)
            g2.add(rr)
        self.say(f"오목 렌즈의 가장자리를 지난 빛은 {g('바깥쪽으로')} 꺾여요",
                 "오목 렌즈의 가장자리를 지난 빛은 렌즈의 바깥쪽으로 꺾여요. 가운데를 지난 빛은 거의 꺾이지 않아요.")
        self.settle()
        clear_stage(self)

    # ── 실험해요 2: 물에 비추기 ──
    def tank_ray(self, i_deg, show_air, ghost):
        HP = np.array([-1.2, 0.1])
        d, dw = K.water_dir(i_deg)
        dw = K.unit(dw)
        Lp = HP - d * (1.9 if i_deg > 1 else 1.4)
        lz = laser_at(Lp, np.degrees(np.arctan2(d[1], d[0])))
        by = -1.7
        E = HP + dw * ((by - HP[1]) / dw[1])
        grp = VGroup()
        if ghost and i_deg > 1:
            G = HP + d * ((by - HP[1]) / d[1])
            grp.add(K.dashed(HP, G, col=PAPER, sw=4, op=0.8),
                    T("곧게 갔다면", 22, PAPER).next_to([G[0], G[1], 0], RIGHT, buff=0.12).shift(UP * 0.15))
        if show_air:
            grp.add(K.ray([Lp + d * 0.1, HP, E], col=K.LASER, sw=6))
        else:
            grp.add(K.ray([HP, E], col=K.LASER, sw=6))
        grp.add(lz)
        return grp

    def water_lab(self):
        self.section("실험해요 2")
        pn = K.panel(12.4, 4.5, K.NIGHT, 0, 0.45)
        tk = K.tank(-4.6, 4.6, 0.1, -1.7, 1.6)
        self.say("우유를 몇 방울 탄 물에 레이저 지시기의 빛을 비춰요",
                 "물이 든 통에 우유를 4~5방울 떨어뜨리고 저었어요. 옆에서 본 모습이에요.")
        self.play(FadeIn(pn), FadeIn(tk), run_time=0.7)
        self.settle()
        safe = K.safety_note("실험에 사용하는 물질은 맛보지 않아요. 물을 쏟지 않게 조심해요.", w=10.4, size=27).move_to([0, -2.25, 0])
        self.play(FadeIn(safe), run_time=0.4)
        self.say(f"실험에 쓰는 물질은 {r('맛보지 않아요')}", "실험에 사용하는 물질은 맛보지 않아요. 물을 쏟지 않게 조심해요.")
        self.settle()
        self.play(FadeOut(safe), run_time=0.3)
        HP = np.array([-1.2, 0.1])
        d, _ = K.water_dir(40)
        lz0 = laser_at(HP - d * 1.9, np.degrees(np.arctan2(d[1], d[0])))
        self.play(FadeIn(lz0), run_time=0.4)
        self.say("공기에서 물로 비스듬히 비추면 빛은 어떻게 될까요?",
                 "레이저 지시기의 빛이 공기에서 물로 비스듬히 들어가도록 비추면, 빛은 어떻게 나아갈까요?")
        self.settle()
        self.pause_screen(5, "물에 들어간 빛은 어떻게 될까요?")
        self.remove(lz0)
        cur = self.tank_ray(40, False, False)
        self.add(cur[-1])
        K.play_ray(self, cur[0], 0.8)
        self.say("물속의 빛은 보이는데 공기 중의 빛은 잘 안 보여요",
                 "우유를 탄 물속에서는 빛이 보여요. 공기 중의 빛은 레이저 지시기 앞쪽에 물을 뿌리면 보여요.")
        mist = K.mist((-4.2, -0.9, 0.35, 2.3), n=36, seed=7)
        self.play(FadeIn(mist), run_time=0.4)
        full = self.tank_ray(40, True, False)
        self.play(Transform(cur, full), run_time=0.6)
        self.settle()
        self.play(FadeOut(mist), run_time=0.3)
        gh = self.tank_ray(40, True, True)
        self.play(Transform(cur, gh), run_time=0.6)
        self.say(f"빛이 물 표면에서 {g('꺾여')} 나아가요",
                 "곧게 갔다면 점선처럼 나아갔을 거예요. 빛이 물 표면에서 꺾여 나아가요.")
        self.settle()
        self.play(Transform(cur, self.tank_ray(0, True, True)), run_time=0.9)
        self.say(f"물 표면에 {o('수직으로')} 들어간 빛은 꺾이지 않아요",
                 "이번에는 물 표면에 수직으로 비추었어요. 수직으로 들어간 빛은 꺾이지 않아요.")
        self.settle()
        clear_stage(self)

    # ── 정리해요: 빛의 굴절 ──
    def refraction(self):
        self.section("정리해요")
        card = K.text_card([f"빛이 직진하다가 서로 다른 물질의 경계에서", f"꺾여 나아가는 성질 = {g('빛의 굴절')}"],
                           w=11.2, size=36).move_to([0, 2.05, 0])
        self.say(f"이런 성질을 {g('빛의 굴절')}이라고 해요",
                 "빛이 직진하다가 서로 다른 물질의 경계에서 꺾여 나아가는 성질을 빛의 굴절이라고 해요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.6)
        self.settle()

        def mini(kind):
            pn = K.panel(3.7, 2.0, "#1B2230", 0, 0)
            g_ = VGroup(pn)
            if kind == "st":
                g_.add(K.ray([[-1.6, 0], [1.6, 0]], col=K.LASER, sw=5, tip=0.2))
            elif kind == "re":
                g_.add(K.plane_mirror((1.3, -0.8), (1.3, 0.8), back=0.1))
                g_.add(K.ray([[-1.6, 0.65], [1.25, 0.0], [-1.6, -0.65]], col=K.LASER, sw=5, tip=0.2))
            else:
                ln = K.Lens("cv", 0.0, 0.0, H=0.8, R=1.6)
                g_.add(ln.shape(op=0.6))
                g_.add(K.ray(ln.trace(0.55, -1.6, (-1.8, 1.8, -0.95, 0.95)), col=K.LASER, sw=5, tip=0.2))
            return g_
        labs = [("직진", "곧게 나아가요"), ("반사", "거울에서 방향이 바뀌어요"), ("굴절", "경계에서 꺾여요")]
        cards = VGroup(*[VGroup(mini(k), T(a, 32, GREEN), T(b, 24)).arrange(DOWN, buff=0.12)
                         for k, (a, b) in zip(("st", "re", "rf"), labs)]).arrange(RIGHT, buff=0.45).move_to([0, -0.95, 0])
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=0.9)
        self.say(f"빛은 {o('직진')}하고, 거울에서 {o('반사')}하고, 경계에서 {o('굴절')}해요",
                 "빛은 곧게 나아가고, 거울에서 방향이 바뀌고, 서로 다른 물질의 경계에서 꺾여요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙: 물에서 공기로 ──
    def summary(self):
        self.section("한눈에 쏙")
        pn = K.panel(8.6, 4.2, "#1B2230", 0, 0.5)
        water = Rectangle(width=8.5, height=2.1, fill_color="#3A6EA5", fill_opacity=0.55, stroke_width=0).move_to([0, -0.5, 0])
        la = T("공기", 28, "#CFE3F5").move_to([-3.6, 1.0 + 0.4, 0])
        lw = T("물", 28, "#CFE3F5").move_to([-3.6, 0.2, 0])
        P_ = np.array([0.0, 0.55])
        iw = np.radians(30)
        d = np.array([np.sin(iw), np.cos(iw)])
        out = K.refract(d, [0, -1], 1.33, 1.0)
        start = P_ - d * (1.95 / np.cos(iw))
        endp = P_ + K.unit(out) * 2.3
        ghost = K.dashed(P_, P_ + d * 2.2, col=PAPER, sw=3, op=0.7)
        self.say("물에서 공기로 비스듬히 비추면 빛은 어떻게 나아갈까요?",
                 "이번에는 물에서 공기로 나아가도록 수조 아래쪽에서 비스듬히 비추면 어떻게 될까요?")
        self.play(FadeIn(pn), FadeIn(water), FadeIn(la), FadeIn(lw), run_time=0.6)
        first = K.ray([start, P_], col=K.LASER, sw=6)
        K.play_ray(self, first, 0.6)
        self.settle()
        self.pause_screen(5, "물에서 공기로 나아가면?")
        K.play_ray(self, K.ray([P_, endp], col=K.LASER, sw=6), 0.6)
        self.play(Create(ghost), run_time=0.5)
        self.say(f"물과 공기의 {g('경계에서 꺾여')} 나아가요",
                 "물과 공기의 경계에서 꺾여 나아가요. 점선은 꺾이지 않았다면 나아갔을 길이에요. 이것도 빛의 굴절이에요.")
        self.settle()
        clear_stage(self)
