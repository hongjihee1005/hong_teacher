"""「과학 원리 돋보기」 5학년 16화 — 우리 몸은 어떻게 움직일까? (5-1 4단원 우리 몸의 구조와 기능 2차시, 화 코드 5-1-4-a)

바탕: grade5/science/sem1/u4-1.html(원본 _build_tb/src/u4-1.html) — 도입(박물관 기린 뼈: 목뼈·다리뼈가 길고 꼬리뼈),
우리 몸의 뼈(머리뼈·목뼈·갈비뼈·척추뼈·팔뼈·다리뼈), 뼈가 하는 일(형태·지탱·보호, 스스로 못 움직임), 근육은 뼈에 연결,
뼈와 근육 모형(①~④), 손잡이 당기기·밀기 표, 내 팔 구부리기·펴기, 정리(뼈는 스스로 X), 의자에 앉기·일어서기, 한눈에 쏙.
최종: ./make_final.sh s5ep16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker, always_redraw,
                   Ellipse, SurroundingRectangle, LaggedStart, Transform)

from series_style import GREEN, INK, ORANGE, SOFT, BLUE, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s5u14 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S5Ep16(EpisodeScene):
    GRADE, SEM = 5, 1
    EP_NO = 16
    EP_TITLE = "우리 몸은 어떻게 움직일까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.bones()
        self.jobs()
        self.make()
        self.pull()
        self.my_arm()
        self.chair()
        self.summary()
        self.closing(f"{o('근육')}이 줄어들거나 늘어나면서\n{g('뼈')}를 움직여 몸이 움직여요",
                     next_preview="5학년 17화 · 음식물은 어떻게 될까?")
        self.wait(0.5)

    # ── 궁금해요: 기린 뼈 ──
    def intro(self):
        self.section("궁금해요")
        gir = K.giraffe(4.4).move_to([0, 0.3, 0])
        self.say("박물관에 전시된 동물의 뼈예요. 어떤 동물일까요?",
                 "박물관에 동물의 뼈가 전시되어 있어요. 뼈의 생김새를 살펴보고, 어떤 동물의 뼈인지 맞혀 봐요.")
        self.play(FadeIn(gir), run_time=0.8)
        rings = VGroup()
        for key in ("neck", "leg", "tail"):
            cx, cy, w, h = K.GIR_RING[key]
            c = K.vpt(gir, cx, cy)
            ww = np.linalg.norm(K.vpt(gir, cx + w, cy) - c)
            hh = np.linalg.norm(K.vpt(gir, cx, cy + h) - c)
            rings.add(Ellipse(width=ww, height=hh, stroke_color="#ffc93c", stroke_width=7).move_to(c))
        self.say(f"단서: {o('긴 목뼈')}, 길고 네 개인 {o('다리뼈')}, {o('꼬리뼈')}",
                 "단서를 찾아봐요. 목뼈가 아주 길고, 다리뼈는 네 개이고 아주 길어요. 꼬리뼈도 있어요.")
        self.play(LaggedStart(*[Create(x) for x in rings], lag_ratio=0.6), run_time=1.8)
        prev = rings
        self.settle()
        self.pause_screen(5, "이 뼈는 어떤 동물의 뼈일까요?")
        self.say(f"{g('기린')}의 뼈예요. 뼈의 모습은 동물의 생김새와 비슷해요",
                 "기린의 뼈예요! 목뼈와 다리뼈가 길고 꼬리뼈가 있어요. 뼈의 모습은 그 동물의 생김새와 비슷해요.")
        self.play(FadeOut(prev), run_time=0.3)
        self.settle()
        clear_stage(self)

    # ── 우리 몸의 뼈 ──
    def bones(self):
        self.section("우리 몸의 뼈")
        sk = K.skeleton(5.3).move_to([-0.2, 0.25, 0])
        self.play(FadeIn(sk), run_time=0.6)
        P = lambda x, y: K.skel_pt(sk, x, y)
        labs = {
            'skull': K.pointer(P(126, 40), P(126, 40) + LEFT * 1.6, "머리뼈", K.NAVY, 30),
            'neck': K.pointer(P(152, 118), P(152, 118) + LEFT * 2.0, "목뼈", K.NAVY, 30),
            'arm': K.pointer(P(80, 260), P(80, 260) + LEFT * 1.4, "팔뼈", K.NAVY, 30),
            'rib': K.pointer(P(214, 170), P(214, 170) + RIGHT * 1.6, "갈비뼈", K.NAVY, 30),
            'spine': K.pointer(P(166, 250), P(166, 250) + RIGHT * 2.1, "척추뼈", K.NAVY, 30),
            'leg': K.pointer(P(190, 420), P(190, 420) + RIGHT * 1.9, "다리뼈", K.NAVY, 30),
        }
        steps = [(['skull', 'rib'], f"{o('머리뼈')}는 동그랗고, {o('갈비뼈')}는 둥근 활 모양이에요",
                  "우리 몸에는 생김새와 크기가 다양한 뼈가 있어요. 머리뼈는 동그랗고, 갈비뼈는 둥근 활 모양이에요."),
                 (['neck', 'spine'], f"{o('목뼈')}와 {o('척추뼈')}는 뼈 여러 개가 세로로 이어져 있어요",
                  "목뼈와 척추뼈는 작은 뼈 여러 개가 세로로 이어져 있어요."),
                 (['arm', 'leg'], f"{o('팔뼈')}와 {o('다리뼈')}는 길어요", "팔뼈와 다리뼈는 길어요.")]
        for keys, sub, narr in steps:
            self.say(sub, narr)
            self.play(*[FadeIn(labs[k]) for k in keys], *[Indicate(sk.part[k], color=ORANGE, scale_factor=1.04) for k in keys],
                      run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 뼈와 근육이 하는 일 ──
    def jobs(self):
        self.section("뼈와 근육이 하는 일")
        sk = K.skeleton(5.0).move_to([-4.3, 0.25, 0])
        card = K.text_card([f"① 몸의 {o('형태')}를 만들어요", f"② 몸을 {o('지탱')}해요",
                            f"③ 심장, 폐, 뇌 등 몸속 {o('기관')}을 {o('보호')}해요"], w=8.6, size=38).move_to([2.7, 0.9, 0])
        hd = T("뼈가 하는 일", 38, self.accent).next_to(card, UP, buff=0.2)
        self.say("뼈는 어떤 일을 할까요?", "뼈는 어떤 일을 할까요?")
        self.play(FadeIn(sk), FadeIn(hd), run_time=0.7)
        self.say(f"뼈는 몸의 {o('형태')}를 만들고, 몸을 {o('지탱')}해요",
                 "뼈는 몸의 형태를 만들고, 몸을 지탱해요.")
        self.play(FadeIn(card[0]), FadeIn(card[1][0]), FadeIn(card[1][1]), run_time=0.7)
        self.say(f"갈비뼈는 심장과 폐를, 머리뼈는 뇌를 감싸 {o('보호')}해요",
                 "또 몸속 기관을 보호해요. 갈비뼈는 심장과 폐를, 머리뼈는 뇌를 감싸 보호해요.")
        self.play(FadeIn(card[1][2]), Indicate(sk.part['rib'], color=ORANGE), Indicate(sk.part['skull'], color=ORANGE), run_time=1.0)
        self.settle()
        self.play(FadeOut(VGroup(sk, card, hd)), run_time=0.5)
        mu = K.muscles(5.2).move_to([-3.8, 0.25, 0])
        tg = K.label("빨간 부분: 근육", K.MUS_D, 28).move_to([-1.0, 2.7, 0])
        self.play(FadeIn(mu), FadeIn(tg), run_time=0.8)
        c2 = K.text_card([f"근육은 {o('뼈에 연결')}되어 있어요", "몸의 부위에 따라 근육의", "모양과 크기가 달라요"],
                         w=6.8, size=36).move_to([2.8, 0.9, 0])
        self.say(f"근육은 {o('뼈에 연결')}되어 있고, 부위마다 모양과 크기가 달라요",
                 "빨간 부분이 근육이에요. 근육은 뼈에 연결되어 있고, 몸의 부위에 따라 모양과 크기가 달라요.")
        self.play(FadeIn(c2, shift=LEFT * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 활동해요: 모형 만들기 ──
    def make(self):
        self.section("모형 만들기")
        prep = K.text_card(["준비물", "뼈와 근육 도안", "똑딱단추 6개"], w=3.6, size=32).move_to([4.6, 1.4, 0])
        steps = [(2, "①② 위팔뼈·아래팔뼈를 잇고, 아래팔뼈와 손잡이를 안쪽 근육에",
                  "아래팔뼈 도안을 위팔뼈 도안 사이에 끼워 똑딱단추로 연결하고, 아래팔뼈와 손잡이를 안쪽 근육 도안에 연결해요."),
                 (4, "③④ 위팔뼈를 안쪽 근육에, 바깥쪽 근육을 두 뼈에 연결해요",
                  "위팔뼈도 안쪽 근육 도안에 연결하고, 바깥쪽 근육 도안을 위팔뼈와 아래팔뼈에 연결하면 완성이에요.")]
        self.say("뼈와 근육 모형을 만들어 봐요", "뼈와 근육 모형을 만들어 봐요. 뼈와 근육 도안과 똑딱단추 여섯 개를 준비해요.")
        self.play(FadeIn(prep), run_time=0.5)
        self.settle()
        self.play(FadeOut(prep), run_time=0.3)
        cur = None
        for part, sub, narr in steps:
            m = K.arm_model(20, h=6.0, part=part).move_to([-0.4, 0.0, 0])
            self.say(sub, narr)
            if cur is None:
                self.play(FadeIn(m), run_time=0.7)
            else:
                self.play(FadeOut(cur), FadeIn(m), run_time=0.7)
            cur = m
        labs = K.arm_labels(cur, size=30)
        self.play(FadeIn(labs), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 활동해요: 손잡이 당기기·밀기 ──
    def pull(self):
        self.section("모형 관찰")
        ph = ValueTracker(20)
        pos = np.array([-3.3, 0.0, 0])
        arm = always_redraw(lambda: K.arm_model(ph.get_value(), h=6.0).move_to(pos))
        lab = always_redraw(lambda: K.arm_labels(K.arm_model(ph.get_value(), h=6.0).move_to(pos), size=28))
        self.add(arm)
        self.play(FadeIn(lab), run_time=0.4)
        self.say("손잡이를 잡아당기면 근육과 뼈는 어떻게 될까요?",
                 "모형의 손잡이를 잡아당기면 근육 도안과 아래팔뼈 도안은 어떻게 될까요?")
        self.settle()
        self.pause_screen(6, "손잡이를 당기면 안쪽 근육은?")
        rows = K.text_card([f"{self.accent_b('손잡이를 당기면')}", f"안쪽 근육 {o('줄어든다')} · 바깥쪽 근육 {o('늘어난다')}",
                            f"아래팔뼈 {g('올라간다')}"], w=5.6, size=30, pad=0.25).move_to([3.9, 1.5, 0])
        self.say(f"안쪽 근육이 {o('줄어들고')} 바깥쪽 근육이 {o('늘어나')} 아래팔뼈가 {g('올라가요')}",
                 "손잡이를 잡아당기면 안쪽 근육은 줄어들고, 바깥쪽 근육은 늘어나요. 그러면 아래팔뼈가 따라 올라가요.")
        self.play(ph.animate.set_value(130), run_time=2.0)
        self.play(FadeIn(rows), run_time=0.5)
        rows2 = K.text_card([f"{self.accent_b('손잡이를 밀면')}", f"안쪽 근육 {o('늘어난다')} · 바깥쪽 근육 {o('줄어든다')}",
                             f"아래팔뼈 {g('내려간다')}"], w=5.6, size=30, pad=0.25).move_to([3.9, -1.15, 0])
        self.say(f"밀면 반대로, 아래팔뼈가 {g('내려가요')}",
                 "손잡이를 밀면 반대로 안쪽 근육은 늘어나고 바깥쪽 근육은 줄어들어, 아래팔뼈가 내려가요.")
        self.play(ph.animate.set_value(20), run_time=2.0)
        self.play(FadeIn(rows2), run_time=0.5)
        self.settle()
        arm.clear_updaters()
        lab.clear_updaters()
        clear_stage(self)

    def accent_b(self, txt):
        return f'<span foreground="{self.accent}">{txt}</span>'

    # ── 내 팔 ──
    def my_arm(self):
        self.section("내 팔")
        ph = ValueTracker(20)
        pos = np.array([-3.3, 0.0, 0])
        arm = always_redraw(lambda: K.arm_model(ph.get_value(), skin=True, h=6.0).move_to(pos))
        lab = always_redraw(lambda: K.arm_labels(K.arm_model(ph.get_value(), skin=True, h=6.0).move_to(pos), skin=True, size=28))
        self.add(arm)
        self.play(FadeIn(lab), run_time=0.4)
        c1 = K.text_card([f"{self.accent_b('팔을 구부릴 때')}", f"안쪽 근육 {o('줄어들고')}", f"바깥쪽 근육 {o('늘어나요')}"],
                         w=4.6, size=34).move_to([4.4, 1.25, 0])
        self.say(f"팔을 구부리면 안쪽 근육이 {o('줄어들고')} 바깥쪽 근육이 {o('늘어나요')}",
                 "내 팔도 같아요. 팔을 구부리면 팔 안쪽 근육이 줄어들고 바깥쪽 근육이 늘어나면서, 아래팔뼈가 따라 올라가요.")
        self.play(ph.animate.set_value(130), FadeIn(c1), run_time=1.8)
        c2 = K.text_card([f"{self.accent_b('팔을 펼 때')}", f"바깥쪽 근육 {o('줄어들고')}", f"안쪽 근육 {o('늘어나요')}"],
                         w=4.6, size=34).move_to([4.4, -1.25, 0])
        self.say(f"팔을 펴면 바깥쪽 근육이 {o('줄어들고')} 안쪽 근육이 {o('늘어나요')}",
                 "팔을 펴면 바깥쪽 근육이 줄어들고 안쪽 근육이 늘어나면서, 아래팔뼈가 따라 내려가요. 팔을 굽혔다 펴며 직접 만져 봐요.")
        self.play(ph.animate.set_value(20), FadeIn(c2), run_time=1.8)
        self.settle()
        arm.clear_updaters()
        lab.clear_updaters()
        clear_stage(self)
        # 생각 바로잡기
        self.section("생각 바로잡기")
        s1 = K.text_card(["뼈가 스스로 움직여서 몸이 움직여요."], w=10.0, size=38).move_to([0.5, 1.2, 0])
        s2 = K.text_card(["근육이 줄어들거나 늘어나면서 뼈를 움직여요."], w=10.0, size=38).move_to([0.5, -0.6, 0])
        x1 = K.ox_mark(False, 0.35).next_to(s1, LEFT, buff=0.3)
        o2 = K.ox_mark(True, 0.35).next_to(s2, LEFT, buff=0.3)
        self.say("두 문장 가운데 옳은 것은 무엇일까요?", "두 문장 가운데 옳은 것은 무엇일까요?")
        self.play(FadeIn(s1), FadeIn(s2), run_time=0.6)
        self.pause_screen(5, "뼈는 스스로 움직일까요?")
        self.say(f"뼈는 {r('스스로 움직이지 못해요')}. 근육이 뼈를 움직여요",
                 "뼈는 스스로 움직이지 못해요. 모형에서도 아래팔뼈는 근육이 변할 때만 움직였어요.")
        self.play(Create(x1), Create(o2), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 생활 속: 의자에 앉기·일어서기 ──
    def chair(self):
        self.section("생활 속에서")
        p = ValueTracker(0)
        pos = np.array([-3.4, 0.3, 0])
        leg = always_redraw(lambda: K.leg_model(p.get_value(), h=5.4).move_to(pos))
        self.add(leg)
        tags = VGroup(K.label("넓적다리 앞쪽 근육", K.MUS_D, 28), K.label("넓적다리 뒤쪽 근육", K.MUS2_D, 28)).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        sw = VGroup(K.capsule([0, 0, 0], [0.5, 0, 0], 0.16, K.MUS), K.capsule([0, 0, 0], [0.5, 0, 0], 0.16, K.MUS2)).arrange(DOWN, buff=0.42)
        sw.next_to(tags, LEFT, buff=0.2)
        VGroup(sw, tags).move_to([3.4, 2.2, 0])
        self.play(FadeIn(tags), FadeIn(sw), run_time=0.5)
        c1 = K.text_card([self.accent_b("앉을 때"), f"뒤쪽 근육 {o('줄어들고')}, 앞쪽 근육 {o('늘어나요')}"], w=6.6, size=32).move_to([3.4, 0.45, 0])
        self.say(f"의자에 앉을 때는 뒤쪽 근육이 {o('줄어들어')} 다리가 구부러져요",
                 "의자에 앉을 때는 넓적다리 뒤쪽 근육이 줄어들고 앞쪽 근육이 늘어나, 다리가 구부러져요.")
        self.play(p.animate.set_value(1), FadeIn(c1), run_time=1.6)
        c2 = K.text_card([self.accent_b("일어설 때"), f"앞쪽 근육 {o('줄어들고')}, 뒤쪽 근육 {o('늘어나요')}"], w=6.6, size=32).move_to([3.4, -1.45, 0])
        self.say(f"일어설 때는 앞쪽 근육이 {o('줄어들어')} 다리가 펴져요",
                 "일어설 때는 앞쪽 근육이 줄어들고 뒤쪽 근육이 늘어나, 다리가 펴져요.")
        self.play(p.animate.set_value(0), FadeIn(c2), run_time=1.6)
        self.settle()
        leg.clear_updaters()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        a = K.arm_model(130, h=5.6).move_to([-3.6, 0.0, 0])
        card = K.text_card(["뼈와 근육은 우리 몸을 움직이게 해요.", f"{o('근육')}이 줄어들거나 늘어나면서",
                            f"{g('뼈')}를 움직여 몸이 움직여요."], w=8.4, size=40).move_to([2.6, 0.3, 0])
        self.say(f"{o('근육')}이 줄어들거나 늘어나면서 {g('뼈')}를 움직여 몸이 움직여요",
                 "뼈와 근육은 우리 몸을 움직이게 해요. 근육이 줄어들거나 늘어나면서 뼈를 움직여 몸이 움직여요.")
        self.play(FadeIn(a), FadeIn(card, scale=0.95), run_time=0.9)
        self.settle()
        clear_stage(self)
