"""「과학 원리 돋보기」 3학년 33화 — 소리는 무엇을 통해 전달될까? (3-2 3단원 소리의 성질 6~7차시, 화 코드 3-2-3-d)

바탕: grade3/science/sem2/u3-5.html — 도입(새가 지저귀는 소리는 무엇을 통해? 공기),
탐구 1 공기를 빼는 장치(탈지면 위 스피커: 공기가 있을 때 잘 들림 → 공기를 거의 뺐을 때 아주 작게 → 다시 넣으면 잘 들림,
실제 장치로는 공기를 완전히 뺄 수 없어 아주 작게라도 들림), 탐구 2 물속에서 캐스터네츠(물 → 공기 → 귀),
탐구 3 연필로 책상 두드리기(같은 책상: 또렷 / 다른 책상: 거의 안 들림 → 나무(고체)), 다른 탐구 실 전화기(팽팽한 실은
잘 전달, 느슨하면 거의 안 들림), 정리(예를 고체·액체·기체로 분류, '소리는 고체, 액체, 기체 상태인 여러 가지 물질을 통해
전달됩니다'), 더 알아보기 '우주에서는 소리가 들릴까?'.
최종: ./make_final.sh s3ep33
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, PI, Create, FadeIn, FadeOut, Indicate, Line, VGroup, LaggedStart,
                   ValueTracker, Dot, Ellipse, Polygon, Circle, Arc, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
import kit_s3u23 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


def bird(s=1.0):
    body = Ellipse(width=1.2, height=0.75, fill_color="#F2A65A", fill_opacity=1, stroke_color=INK, stroke_width=3)
    head = Circle(radius=0.3, fill_color="#F2A65A", fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([0.55, 0.35, 0])
    beak = Polygon([0.82, 0.4, 0], [1.1, 0.33, 0], [0.82, 0.26, 0], fill_color="#F2C230", fill_opacity=1, stroke_color=INK, stroke_width=2)
    eye = Dot([0.62, 0.42, 0], radius=0.05, color=INK)
    wing = Ellipse(width=0.7, height=0.35, fill_color="#D9853B", fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([-0.1, 0.05, 0]).rotate(-0.3)
    tail = Polygon([-0.55, 0.05, 0], [-0.95, 0.3, 0], [-0.9, -0.1, 0], fill_color="#D9853B", fill_opacity=1, stroke_color=INK, stroke_width=2)
    legs = VGroup(Line([-0.1, -0.35, 0], [-0.15, -0.6, 0], stroke_color=INK, stroke_width=3),
                  Line([0.15, -0.35, 0], [0.15, -0.6, 0], stroke_color=INK, stroke_width=3))
    branch = Line([-1.2, -0.62, 0], [1.0, -0.62, 0], stroke_color=K.WOOD_D, stroke_width=10)
    return VGroup(branch, legs, tail, body, wing, head, beak, eye).scale(s)


def rocket_suit(s=1.0, col=PAPER):
    """우주 비행사(단순한 모양)"""
    helmet = Circle(radius=0.45, fill_color=col, fill_opacity=1, stroke_color=INK, stroke_width=3)
    visor = Ellipse(width=0.6, height=0.4, fill_color="#3B4A6B", fill_opacity=1, stroke_color=INK, stroke_width=2).move_to([0.05, -0.02, 0])
    body = K.R(0.8, 0.9, col, 0, -0.85, sw=3, r=0.2)
    pack = K.R(0.3, 0.7, "#C9CED2", -0.5, -0.8, sw=2, r=0.08)
    ant = VGroup(Line([0.25, 0.4, 0], [0.4, 0.75, 0], stroke_color=INK, stroke_width=3), Dot([0.4, 0.75, 0], radius=0.06, color=RED))
    return VGroup(pack, body, helmet, visor, ant).scale(s)


class S3Ep33(EpisodeScene):
    GRADE, SEM = 3, 2
    EP_NO = 33
    EP_TITLE = "소리는 무엇을 통해 전달될까?"
    OUT_DIR = HERE

    def construct(self):
        self.shakes = []
        self.opening()
        self.intro()
        self.air()
        self.water()
        self.wood()
        self.phone()
        self.summary()
        self.space()
        self.closing(f"소리는 {o('고체')}, {o('액체')}, {o('기체')} 상태인\n여러 가지 {g('물질')}을 통해 전달돼요",
                     next_preview="3학년 34화 · 소음을 줄이려면?")
        self.wait(0.5)

    def shake(self, amp=0.0, speed=7.0, decay=0.0):
        sh = K.Shake(amp).live(self, speed, decay)
        self.shakes.append(sh)
        return sh

    def clear(self):
        for sh in self.shakes:
            sh.stop(self)
        self.shakes = []
        clear_stage(self)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        sh = self.shake(0.3)
        bd = bird(1.5).move_to([-4.2, 0.8, 0])
        er = K.ear(1.4, face=LEFT).move_to([4.6, 0.6, 0])
        rr = K.rings(np.array([-2.6, 1.2, 0]), sh, rmax=6.2, n=6, start=-0.3, span=0.6, ref=0.25, speed=0.12)
        self.say("새가 지저귀는 소리는 무엇을 통해 전달될까요?", "새가 지저귀는 소리는 무엇을 통해 우리 귀까지 전달될까요?")
        self.play(FadeIn(bd), FadeIn(er), run_time=0.5)
        self.add(rr)
        opts = VGroup(tag("공기", BLUE, 38), tag("아무것도 없는 빈 공간", BLUE, 38), tag("햇빛", BLUE, 38)).arrange(RIGHT, buff=0.5)
        opts.move_to([0, -1.6, 0])
        self.play(FadeIn(opts), run_time=0.5)
        self.pause_screen(4, "무엇을 통해 전달될까요?")
        self.say(f"새소리는 {o('공기')}를 통해 우리 귀까지 전달돼요",
                 "새소리는 공기를 통해 우리 귀까지 전달돼요. 다른 물질로도 소리가 전달되는지 알아봐요.")
        self.play(Indicate(opts[0], color=ORANGE, scale_factor=1.15), FadeOut(opts[1]), FadeOut(opts[2]), run_time=0.8)
        self.settle()
        self.clear()

    # ── 탐구 1: 공기를 빼는 장치 ──
    def air(self):
        self.section("공기")
        sh = self.shake(0.0, speed=7)
        air = ValueTracker(1.0)
        jar = K.bell_jar(air, x=-3.0, y=0.25, w=3.4, h=3.0)
        er = K.ear(1.2, face=LEFT).move_to([4.8, 0.4, 0])
        rin = K.rings(jar.spk_pt, sh, rmax=1.6, n=3, start=-0.5, span=1.0, ref=0.3)
        rout = K.rings(np.array([-1.0, 0.4, 0]), sh, rmax=5.2, n=5, start=-0.25, span=0.5, ref=0.3)
        self.say("통 안에 탈지면을 깔고 스피커를 넣은 뒤 뚜껑을 닫아요",
                 "공기를 빼는 장치 안에 탈지면을 깔고 스피커를 넣은 뒤 뚜껑을 닫아요.")
        self.play(FadeIn(jar), FadeIn(er), run_time=0.6)
        st = T("", 40)
        lab = tag("공기 있음 — 잘 들려요", GREEN, 36).move_to([2.6, 2.4, 0])
        self.add(rin, rout)
        self.say(f"스피커를 켜면 소리가 {g('잘 들려요')}", "스피커 소리를 켜요. 공기가 있을 때는 소리가 잘 들려요.")
        self.play(sh.amp.animate.set_value(0.3), FadeIn(lab), run_time=0.5)
        self.settle()
        self.say("손잡이를 당겨 공기를 빼면 어떻게 될까요?", "이제 손잡이를 여러 번 당겨 통 안의 공기를 빼 봐요. 소리가 어떻게 될까요?")
        self.pause_screen(4, "공기를 빼면 소리는?")
        hd = jar.handle
        for k in range(3):
            self.play(hd.animate.shift(UP * 0.35), run_time=0.25)
            self.play(hd.animate.shift(DOWN * 0.35), air.animate.set_value(1 - 0.28 * (k + 1)), sh.amp.animate.set_value(0.3 - 0.088 * (k + 1)),
                      run_time=0.35)
        lab2 = tag("공기를 거의 뺐을 때 — 아주 작게 들려요", RED, 36).move_to([2.2, 2.4, 0])
        self.say(f"공기를 거의 빼면 소리가 {r('아주 작게')} 들려요", "공기를 거의 빼면 소리가 아주 작게 들려요.")
        self.play(FadeOut(lab), FadeIn(lab2), run_time=0.4)
        self.settle()
        lab3 = tag("다시 공기를 넣었을 때 — 다시 잘 들려요", GREEN, 36).move_to([2.2, 2.4, 0])
        self.say(f"공기를 다시 넣으면 {g('다시 잘 들려요')}", "공기를 다시 넣으면 소리가 다시 잘 들려요.")
        self.play(air.animate.set_value(1.0), sh.amp.animate.set_value(0.3), FadeOut(lab2), FadeIn(lab3), run_time=1.0)
        self.settle()
        res = M(f"스피커 소리는 {o('공기(기체)')}를 통해 전달돼요", 44).move_to([1.3, -2.0, 0])
        note = T("※ 실제 장치로는 공기를 완전히 뺄 수 없어 아주 작게라도 들려요", 26, SOFT).move_to([0, -2.55, 0])
        self.say(f"소리는 {o('공기(기체)')}를 통해 전달돼요",
                 "스피커 소리는 공기, 곧 기체를 통해 전달돼요. 실제 장치로는 공기를 완전히 뺄 수 없어서 소리가 아주 작게라도 들려요.")
        self.play(FadeIn(res), FadeIn(note), run_time=0.5)
        self.settle()
        self.clear()

    # ── 탐구 2: 물 ──
    def water(self):
        self.section("물")
        sh = self.shake(0.0, speed=7)
        tk = K.tank(5.0, 2.8, -1.8, -0.6, level=0.78)
        cs = K.castanets(1.0).move_to([-2.4, -1.0, 0])
        hand_ = K.hand(0.5).rotate(PI).move_to([-2.4, -0.45, 0])
        rw = K.rings(np.array([-2.0, -1.0, 0]), sh, rmax=1.8, n=4, start=-0.4, span=1.6, col=K.WATER_D, ref=0.3)
        ra = K.rings(np.array([0.7, -0.2, 0]), sh, rmax=4.6, n=5, start=-0.15, span=0.7, ref=0.3)
        er = K.ear(1.2, face=LEFT).move_to([5.2, 0.1, 0])
        self.say("수조의 물속에서 캐스터네츠를 부딪쳐요", "이번에는 수조의 물속에서 캐스터네츠를 “딱딱” 부딪쳐 봐요. 물 밖에서 소리가 들릴까요?")
        self.play(FadeIn(tk), FadeIn(cs), FadeIn(hand_), FadeIn(er), run_time=0.6)
        self.pause_screen(4, "물 밖에서 들릴까요?")
        self.add(rw, ra)
        word = T("“딱딱”", 44, ORANGE).move_to([2.6, 1.7, 0])
        self.play(cs.animate.scale(1.0), sh.amp.animate.set_value(0.3), FadeIn(word), run_time=0.4)
        self.say(f"물속에서 부딪쳐도 {g('소리가 들려요')}", "물속에서 부딪쳐도 물 밖에서 “딱딱” 소리가 들려요.")
        self.settle()
        path = VGroup(tag("물(액체)", BLUE, 34), T("→", 40, INK), tag("공기", BLUE, 34), T("→", 40, INK), tag("귀", BLUE, 34)).arrange(RIGHT, buff=0.25)
        path.move_to([1.9, 2.55, 0])
        self.say(f"소리가 {o('물(액체)')}을 통해 전달된 뒤 공기를 거쳐 귀까지 와요",
                 "소리가 물, 곧 액체를 통해 전달된 뒤 공기를 거쳐 귀까지 왔어요. 소리는 물을 통해서도 전달돼요.")
        self.play(FadeOut(word), FadeIn(path, shift=UP * 0.2), run_time=0.5)
        self.settle()
        warn = T("캐스터네츠가 수조 벽에 부딪치지 않게, 물이 튀지 않게 조심해요", 28, RED).move_to([0, -2.45, 0])
        self.play(FadeIn(warn), run_time=0.3)
        self.wait(1.5)
        self.clear()

    # ── 탐구 3: 나무(책상) ──
    def wood(self):
        self.section("나무")
        sh = self.shake(0.0, speed=7)
        d1 = K.desk(4.6, -3.6, -0.4)
        d2 = K.desk(4.6, 2.4, -0.4)
        pc = K.pencil(1.3).rotate(-0.9).move_to([-4.6, d1.top_y + 0.65, 0])
        self.say("친구가 연필로 책상을 살짝 두드려요", "친구가 연필로 책상을 살짝 두드려요. 한쪽 귀를 책상에 대고 몇 번 두드렸는지 맞혀 봐요.")
        self.play(FadeIn(d1), FadeIn(d2), FadeIn(pc), run_time=0.6)
        # 다른 책상
        er2 = K.ear(0.9, face=LEFT).move_to([3.6, d2.top_y + 0.55, 0])
        t1 = tag("① 다른 책상에 귀를 댈 때", BLUE, 34).move_to([0, 2.5, 0])
        self.play(FadeIn(t1), FadeIn(er2), run_time=0.4)
        rr = K.rings(np.array([-4.2, d1.top_y + 0.05, 0]), sh, rmax=1.4, n=3, start=0.1, span=1.0, ref=0.3)
        self.add(rr)
        for _ in range(3):
            self.play(pc.animate.shift(DOWN * 0.25 + RIGHT * 0.15), run_time=0.15)
            self.play(pc.animate.shift(UP * 0.25 + LEFT * 0.15), sh.amp.animate.set_value(0.3), run_time=0.2)
        self.say(f"다른 책상에서는 두드리는 소리가 {r('거의 들리지 않아요')}",
                 "다른 책상에 앉았을 때는 두드리는 소리가 거의 들리지 않아서 몇 번인지 알기 어려워요.")
        q2 = T("?", 60, RED).move_to([4.6, d2.top_y + 1.3, 0])
        self.play(FadeIn(q2), run_time=0.3)
        self.settle()
        self.play(FadeOut(VGroup(er2, q2, t1)), sh.amp.animate.set_value(0), run_time=0.4)
        er1 = K.ear(0.9, face=LEFT).move_to([-1.9, d1.top_y + 0.55, 0])
        t2 = tag("② 같은 책상에 귀를 댈 때", ORANGE, 34).move_to([0, 2.5, 0])
        self.say("같은 책상에 귀를 대면 어떨까요?", "이번에는 친구와 같은 책상에 귀를 대 봐요. 어떻게 들릴까요?")
        self.play(FadeIn(t2), FadeIn(er1), run_time=0.4)
        self.pause_screen(4, "같은 책상에서는?")
        rd = K.rings(np.array([-4.3, d1.top_y - 0.05, 0]), sh, rmax=2.4, n=4, start=-0.12, span=0.24, col=K.WOOD_D, ref=0.3, sw=8)
        self.add(rd)
        for _ in range(3):
            self.play(pc.animate.shift(DOWN * 0.25 + RIGHT * 0.15), run_time=0.15)
            self.play(pc.animate.shift(UP * 0.25 + LEFT * 0.15), sh.amp.animate.set_value(0.3), run_time=0.2)
        cnt = T("3번!", 50, GREEN).move_to([-1.6, d1.top_y + 1.5, 0])
        self.say(f"같은 책상에서는 소리가 {g('또렷하게')} 들려요", "같은 책상에서는 두드리는 소리가 또렷하게 들려요. 세 번이에요!")
        self.play(FadeIn(cnt), run_time=0.3)
        self.settle()
        res = M(f"소리는 {o('나무(고체)')}를 통해 전달돼요", 44).move_to([0, -2.2, 0])
        self.say(f"소리는 {o('나무(고체)')}를 통해 전달돼요", "같은 책상에서 더 잘 들렸어요. 소리는 나무, 곧 고체를 통해 전달돼요.")
        self.play(FadeIn(res), run_time=0.4)
        self.settle()
        self.clear()

    # ── 다른 탐구: 실 전화기 ──
    def phone(self):
        self.section("실 전화기")
        sh = self.shake(0.0, speed=10)
        p0 = np.array([-3.1, 0.9, 0])
        p1 = np.array([3.1, 0.9, 0])
        c1 = K.cup(1.0, face=LEFT).move_to(p0 + LEFT * 0.4)
        c2 = K.cup(1.0, face=RIGHT).move_to(p1 + RIGHT * 0.4)
        ln = K.phone_line(p0, p1, sh, taut=True)
        a1 = K.head(0.8).flip().move_to([-5.6, 0.95, 0])
        a2 = K.head(0.8).move_to([5.6, 0.95, 0])
        word = T("“여보세요~”", 40, ORANGE).move_to([-3.3, 2.5, 0])
        self.say("실 전화기로 이야기해요", "같은 주제의 다른 탐구예요. 실로 연결된 컵, 실 전화기로 이야기해 봐요.")
        self.play(FadeIn(a1), FadeIn(a2), FadeIn(c1), FadeIn(c2), FadeIn(ln), run_time=0.6)
        t1 = tag("실을 팽팽하게", GREEN, 36).move_to([0, -1.2, 0])
        self.say(f"실을 팽팽하게 하면 {g('소리가 잘 전달돼요')}", "실을 팽팽하게 하고 “여보세요~” 말해요. 실이 떨리며 소리가 건너편 컵까지 전달돼요.")
        self.play(FadeIn(t1), FadeIn(word), sh.amp.animate.set_value(0.15), run_time=0.5)
        self.settle()
        ln2 = K.phone_line(p0, p1, sh, taut=False)
        t2 = tag("실을 느슨하게", RED, 36).move_to([0, -1.2, 0])
        self.say(f"실이 느슨하면 {r('거의 들리지 않아요')}", "실이 느슨하면 떨림이 잘 전달되지 않아 거의 들리지 않아요.")
        self.play(FadeOut(ln), FadeIn(ln2), FadeOut(t1), FadeIn(t2), sh.amp.animate.set_value(0.0), run_time=0.6)
        self.settle()
        res = M(f"{o('실(고체)')}을 통해서도 소리가 전달돼요", 44).move_to([0, -2.2, 0])
        self.say(f"{o('실(고체)')}을 통해서도 소리가 전달돼요", "팽팽한 실은 소리를 잘 전달해요. 실, 곧 고체를 통해서도 소리가 전달돼요.")
        self.play(FadeIn(res), run_time=0.4)
        self.settle()
        self.clear()

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        rows = [["예", "소리를 전달한 물질"],
                ["선생님의 목소리가 교실 뒤까지 들려요", "기체"],
                ["물속에서 스피커 소리를 들을 수 있어요", "액체"],
                ["철봉에 귀를 대면 두드리는 소리가 들려요", "고체"],
                ["종소리가 들려요", "기체"],
                ["실 전화기로 친구 목소리를 들어요", "고체"]]
        tb = K.table(rows, [8.6, 3.6], h=0.72, size=32, x=0, y=0.55)
        for i in range(1, 6):
            tb.cells[i][1][1].set_opacity(0)
        self.say("여러 가지 예를 고체·액체·기체로 나눠 봐요",
                 "여러 가지 예에서 소리를 전달한 물질을 고체, 액체, 기체 중에서 골라 봐요.")
        self.play(FadeIn(tb), run_time=0.6)
        self.pause_screen(5, "소리를 전달한 물질은?")
        cols = {"기체": BLUE, "액체": "#3B86C0", "고체": ORANGE}
        anims = []
        for i in range(1, 6):
            t_ = tb.cells[i][1][1]
            t_.set_color(cols[rows[i][1]])
            anims.append(t_.animate.set_opacity(1))
        self.say("목소리·종소리는 기체, 물속 스피커는 액체, 철봉·실은 고체",
                 "선생님 목소리와 종소리는 공기, 곧 기체를 통해, 물속 스피커 소리는 액체를 통해, 철봉과 실 전화기는 고체를 통해 전달돼요.")
        self.play(LaggedStart(*anims, lag_ratio=0.3), run_time=1.5)
        self.settle()
        main = M(f"소리는 {o('고체, 액체, 기체')} 상태인 여러 가지 {o('물질')}을 통해 전달돼요", 38).move_to([0, -2.2, 0])
        self.say(f"소리는 여러 가지 {o('물질')}을 통해 전달돼요",
                 "소리는 고체, 액체, 기체 상태인 여러 가지 물질을 통해 전달돼요.")
        self.play(FadeIn(main), run_time=0.5)
        self.settle()
        self.clear()

    # ── 더 알아보기: 우주 ──
    def space(self):
        self.section("더 알아보기")
        sky = K.R(13.0, 4.6, "#1E2440", 0, 0.45, stroke="#1E2440", sw=0, r=0.3)
        stars = VGroup(*[Dot([x, y, 0], radius=0.04, color=PAPER) for x, y in
                         np.c_[np.random.RandomState(2).uniform(-6.2, 6.2, 40), np.random.RandomState(4).uniform(-1.6, 2.5, 40)]])
        a1 = rocket_suit(1.2).move_to([-2.0, 0.3, 0])
        a2 = rocket_suit(1.2).flip().move_to([2.0, 0.3, 0])
        q = T("우주에서는 소리가 들릴까?", 46, PAPER).move_to([0, 2.1, 0])
        self.say("우주에서는 소리가 들릴까요?", "우주에서는 소리가 들릴까요?")
        self.play(FadeIn(sky), FadeIn(stars), FadeIn(a1), FadeIn(a2), FadeIn(q), run_time=0.7)
        self.pause_screen(4, "우주에서는 소리가 들릴까요?")
        t1 = T("공기가 거의 없어요", 40, "#F2C230").move_to([0, -1.2, 0])
        self.say(f"우주에는 소리를 전달할 {o('공기가 거의 없어요')}",
                 "우주에는 소리를 전달할 공기가 거의 없어요. 그래서 우주 비행사들은 가까이 있어도 무선 통신 장치로 이야기해요.")
        self.play(FadeIn(t1), run_time=0.4)
        self.settle()
        self.say("공기를 뺀 장치에서 소리가 작아진 것과 같은 까닭이에요",
                 "공기를 뺀 장치에서 소리가 아주 작아진 것과 같은 까닭이에요.")
        self.settle()
        self.clear()
