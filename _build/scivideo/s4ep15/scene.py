"""「과학 원리 돋보기」 4학년 15화 — 지진은 어떤 영향을 줄까? (4-1 3단원 땅의 변화 9차시, 화 코드 4-1-3-f)

바탕: grade4/science/sem1/u3-7.html(원본 _build_tb/src/u3-7.html) — 도입(지진 대피 훈련), 피해 사례 기록표(2023년 2월 6일,
튀르키예·시리아, 규모 7.8, 건물 무너짐·도로 갈라짐·화재), 지진의 세기 = 규모(규모 2~7 흔들림 흉내: 3 이하 아주 작음,
6 이상 물건이 떨어짐, 규모가 같아도 대비에 따라 피해가 다름), 큰 지진(땅 갈라짐·산사태·지진 해일), 장소별 대처 6곳(앱 문장 그대로),
학교에서 대피 순서 4단계, 한눈에 쏙. 피해는 담담하게, 대처는 앱 문장 그대로.
최종: ./make_final.sh s4ep15
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Arrow, Create, FadeIn, FadeOut, Indicate, VGroup, ValueTracker,
                   SurroundingRectangle, RoundedRectangle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def card(title, body, w=4.2, h=1.9, col=INK, size=24):
    t = T(title, 30, col)
    bt = K.text_card([body], size=size, stroke=PAPER, pad=0.05)[1]
    box = RoundedRectangle(corner_radius=0.18, width=w, height=h, fill_color=PAPER, fill_opacity=1,
                           stroke_color=col, stroke_width=4)
    t.next_to(box.get_top(), DOWN, buff=0.14)
    return VGroup(box, t)


class S4Ep15(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 15
    EP_TITLE = "지진은 어떤 영향을 줄까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.case()
        self.magnitude()
        self.places()
        self.school()
        self.summary()
        self.closing(f"지진의 세기는 {o('규모')}로 나타내요\n먼저 {g('머리와 몸을 보호')}하고, 흔들림이 멈추면 안전한 곳으로 대피해요",
                     next_preview="4학년 16화 · 화산 활동과 지진이 일어나면")
        self.wait(0.5)

    # ── 궁금해요: 대피 훈련 ──
    def intro(self):
        self.section("궁금해요")
        board = VGroup(K.rect(4.2, 1.5, "#2F5D48", stroke="#8A6A3E", sw=6), T("지진 대피 훈련", 34, "#FFFFFF")).move_to([-3.3, 2.0, 0])
        desks = VGroup()
        for i, c in enumerate((BLUE, RED, GREEN)):
            d = K.desk(2.4)
            kd = K.kid(c, 0.9, crouch=True).move_to([0, -0.62, 0])
            desks.add(VGroup(d, kd).move_to([(i - 1) * 3.6, -0.7, 0]))
        floor = K.rect(13.6, 0.5, "#D9C49A", y=-1.95, sw=0)
        self.say("어떤 대피 훈련을 하는 모습일까요?", "친구들이 책상 아래로 들어가 책상 다리를 잡고 있어요. 어떤 대피 훈련을 하는 모습일까요?")
        self.play(FadeIn(floor), FadeIn(board), FadeIn(desks, lag_ratio=0.2), run_time=1.0)
        self.say(f"지진이 났을 때 {g('머리와 몸을 보호')}하는 훈련이에요",
                 "지진이 났을 때 떨어지는 물건으로부터 머리와 몸을 보호하려고 책상 아래로 들어가는 훈련이에요. 미리 연습해 두면 실제로 지진이 나도 침착하게 행동할 수 있어요.")
        self.play(Indicate(desks, color=GREEN, scale_factor=1.03), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 피해 사례 ──
    def case(self):
        self.section("지진 피해 사례")
        news = K.text_card(["2023년 2월 6일, 튀르키예와 시리아 지역에서",
                            f"규모 {o('7.8')}의 지진이 일어났어요."], w=11.8, size=36).move_to([0, 2.0, 0])
        self.say("지진 피해 사례를 조사해요",
                 "지진 피해 사례를 조사해 봐요. 2023년 2월 6일, 튀르키예와 시리아 지역에서 규모 7.8의 지진이 일어났어요.")
        self.play(FadeIn(news), run_time=0.7)
        rows = [("발생 시기", "2023년 2월 6일"), ("발생 지역", "튀르키예, 시리아"), ("규모", "7.8"),
                ("피해 내용", "건물이 무너짐 · 도로가 갈라지고 끊어짐 · 화재")]
        tbl = VGroup()
        for i, (k, v) in enumerate(rows):
            kk = K.rect(2.6, 0.62, "#E7F4F2", stroke=SOFT, sw=3)
            vv = K.rect(9.2, 0.62, PAPER, stroke=SOFT, sw=3)
            row = VGroup(kk, vv).arrange(RIGHT, buff=0)
            row.add(T(k, 28).move_to(kk), T(v, 28).move_to(vv))
            tbl.add(row)
        tbl.arrange(DOWN, buff=0).move_to([0, -0.6, 0])
        self.say("기록표에 정리해요", "조사한 내용을 기록표에 정리해요.")
        self.play(FadeIn(tbl[:3], lag_ratio=0.3), run_time=1.0)
        self.say("많은 건물이 무너지고, 도로가 갈라지고, 화재가 났어요",
                 "많은 건물이 무너지고 다친 사람이 많았어요. 지진으로 화재가 나고, 도로가 갈라지고 끊어졌으며, 역사적인 유적지도 부서졌어요.")
        self.play(FadeIn(tbl[3]), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 규모 ──
    def magnitude(self):
        self.section("지진의 세기")
        self.say(f"지진의 세기는 {o('규모')}로 나타내요",
                 "지진의 세기는 규모로 나타내요. 규모를 바꾸어 방 안의 물건이 얼마나 흔들리는지 봐요. 그림으로 흉내 낸 것이에요.")
        floor = K.rect(13.6, 0.4, "#D9C49A", y=-1.95, sw=0)
        room = K.shelf_room().shift(DOWN * 0.15)
        self.play(FadeIn(floor), FadeIn(room), run_time=0.6)
        amp = ValueTracker(0.0)
        rng = np.random.default_rng(3)
        base = room.get_center().copy()

        def jit(m, dt):
            a = amp.get_value() * 0.012
            m.move_to(base + np.array([rng.uniform(-a, a), rng.uniform(-a, a) * 0.4, 0]))
        room.add_updater(jit)
        meter = VGroup()

        def show(mg, sub, narr, ampv, fall=False):
            nonlocal meter
            new = M(f"규모 {o(str(mg))}", 46).move_to([-4.6, 2.55, 0])
            self.say(sub, narr)
            self.play(FadeOut(meter), FadeIn(new), run_time=0.3)
            meter = new
            amp.set_value(ampv)
            if fall:
                self.wait(0.8)
                bk = room.books
                drops = [bk[0], bk[2], bk[4]]
                room.clear_updaters()
                self.play(*[b.animate.rotate(0.5 + 0.2 * j).move_to([2.0 + j * 1.0, -1.6, 0]) for j, b in enumerate(drops)],
                          run_time=0.7)
                room.add_updater(jit)
                self.wait(0.8)
            else:
                self.wait(1.8)
            amp.set_value(0)
            self.wait(0.2)
        show(2, "규모 2: 흔들림이 아주 작아요",
             "규모 2예요. 흔들림이 아주 작아요. 규모가 작은 지진은 사람이 느끼지 못하는 경우가 많아요.", 0.6)
        show(5, "규모 5: 흔들림을 느낄 수 있어요", "규모 5예요. 흔들림을 느낄 수 있어요. 물건이 흔들려요.", 10)
        self.pause_screen(5, "규모 7이면 어떻게 될까요?")
        show(7, f"규모 7: 크게 흔들려 {r('물건이 떨어졌어요')}",
             "규모 7이에요. 크게 흔들려 물건이 떨어졌어요. 큰 규모의 지진은 큰 피해를 줄 수 있어요.", 24, fall=True)
        room.clear_updaters()
        self.say(f"규모의 숫자가 클수록 {o('지진의 세기가 커요')}",
                 "규모의 숫자가 클수록 지진의 세기가 커요. 하지만 규모가 같아도 대비한 정도에 따라 피해는 다를 수 있어요.")
        self.settle()
        clear_stage(self)
        # 큰 지진이 일어나면
        items = [("땅이 갈라져요", self.crack()), ("산사태가 일어나요", self.slide()), ("바다에서 일어나면 지진 해일이 생기기도 해요", self.wave())]
        grp = VGroup()
        for i, (t, pic) in enumerate(items):
            K.fit(pic, 3.6, 2.0)
            lab = T(t, 26).next_to(pic, DOWN, buff=0.2)
            if lab.width > 4.1:
                lab.scale_to_fit_width(4.1)
            grp.add(VGroup(pic, lab).move_to([(i - 1) * 4.5, 0.3, 0]))
        self.say("큰 규모의 지진이 일어나면 생길 수 있는 일",
                 "큰 규모의 지진이 일어나면 땅이 갈라지거나 산사태가 일어나 땅의 모습이 급격하게 변하기도 해요. 바다에서 지진이 나면 지진 해일이 생기기도 해요.")
        self.play(FadeIn(grp, lag_ratio=0.3), run_time=1.4)
        self.settle()
        clear_stage(self)

    def crack(self):
        g_ = VGroup(K.rect(3.6, 2.0, "#C9A77A", stroke=K.SOIL_D, sw=3))
        g_.add(K.P([(-0.3, 1.0), (0.1, 0.4), (-0.15, 0.0), (0.2, -0.5), (0.0, -1.0), (0.25, -1.0), (0.45, -0.5),
                    (0.1, 0.0), (0.35, 0.4), (0.0, 1.0)], "#4A3524", "#4A3524", 2))
        return g_

    def slide(self):
        g_ = VGroup(K.P([(-1.8, -1.0), (0.2, 1.0), (1.8, -1.0)], "#6F8F55", "#4F6E3C", 3),
                    K.P([(0.2, 0.9), (1.0, -0.1), (1.6, -1.0), (0.6, -1.0), (0.3, -0.2)], "#9C7B5C", "#6E5440", 3))
        for i in range(6):
            g_.add(K.jag_rock(0.12, i).move_to([0.8 + K.rnd(i, 1) * 0.8, -0.85 + K.rnd(i, 2) * 0.4, 0]))
        return g_

    def wave(self):
        g_ = VGroup(K.rect(3.6, 2.0, "#CFE9F7", sw=0), K.P([(-1.8, -1.0), (-1.8, -0.4), (-0.6, -0.4), (-0.3, -1.0)], K.SAND, K.SAND_D, 2),
                    K.S([(-0.4, -1.0), (-0.2, 0.2), (0.4, 0.75), (1.0, 0.6), (0.9, 0.2), (1.8, -0.2), (1.8, -1.0)], K.WATER, K.WATER_D, 3))
        return g_

    # ── 장소별 대처 ──
    def places(self):
        self.section("장소별 대처 방법")
        P_ = [("집 안", "탁자 아래로 들어가 몸을 보호해요.\n흔들림이 멈추면 전기와 가스를 차단하고\n밖으로 나가요."),
              ("학교", "책상 아래에서 책상 다리를 꼭 잡아요.\n흔들림이 멈추면 질서를 지키며\n운동장으로 대피해요."),
              ("건물 안·승강기", "승강기 대신 계단을 이용해요.\n승강기 안이라면 모든 층의 버튼을 눌러\n가장 먼저 열리는 층에서 내려요."),
              ("집 밖", "가방이나 손으로 머리를 보호하고,\n운동장이나 공원 같은 넓은 곳으로\n대피해요."),
              ("바닷가", "지진 해일이 발생하면\n높은 곳으로 이동해요."),
              ("산", "산사태, 절벽이 무너지는 것에 주의하고\n안전한 곳으로 대피해요.")]
        cards = VGroup()
        for i, (nm, body) in enumerate(P_):
            box = RoundedRectangle(corner_radius=0.18, width=4.35, height=2.25, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=self.accent, stroke_width=4)
            t = K.label(nm, self.accent, 28).next_to(box.get_top(), DOWN, buff=0.12)
            bt = VGroup(*[T(l, 21, bold=False) for l in body.split("\n")]).arrange(DOWN, buff=0.08)
            if bt.width > 4.1:
                bt.scale_to_fit_width(4.1)
            bt.next_to(t, DOWN, buff=0.14)
            cards.add(VGroup(box, t, bt).move_to([(i % 3 - 1) * 4.5, 1.35 - (i // 3) * 2.45, 0]))
        self.say("장소에 따라 어떻게 대처해야 할까요?", "지진이 났을 때 장소에 따라 어떻게 대처해야 할까요?")
        subs = ["집 안: 탁자 아래로 들어가 몸을 보호해요", "학교: 책상 아래에서 책상 다리를 꼭 잡아요",
                "건물 안: 승강기 대신 계단을 이용해요", "집 밖: 머리를 보호하고 넓은 곳으로 대피해요",
                "바닷가: 지진 해일이 발생하면 높은 곳으로", "산: 산사태, 절벽이 무너지는 것에 주의해요"]
        for i, (nm, body) in enumerate(P_):
            self.say(subs[i], f"{nm}에서는 " + body.replace("\n", " ") if i != 2 else "건물 안에서는 " + body.replace("\n", " "))
            self.play(FadeIn(cards[i], shift=UP * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 학교에서 대피 순서 ──
    def school(self):
        self.section("학교에서 대피해요")
        steps = ["책상 아래로 들어가\n책상 다리 잡기", "흔들림이 멈출 때까지\n안내 방송 듣기",
                 "가방으로 머리를\n보호하며 나오기", "계단으로 질서 있게\n운동장으로 대피하기"]
        pics = [VGroup(K.desk(1.8), K.kid(BLUE, 0.8, crouch=True).move_to([0, -0.55, 0])),
                VGroup(K.desk(1.8), K.kid(BLUE, 0.8, crouch=True).move_to([0, -0.55, 0]),
                       K.label("안내 방송", INK, 22).move_to([0.6, 0.65, 0])),
                VGroup(K.kid(BLUE, 1.0, bag=True)),
                VGroup(K.P([(-1.2, -0.9), (-1.2, -0.6), (-0.8, -0.6), (-0.8, -0.3), (-0.4, -0.3), (-0.4, 0.0), (0.0, 0.0), (0.0, -0.9)],
                           "#D9C49A", "#8A6A3E", 3), K.kid(GREEN, 0.6).move_to([-0.6, 0.2, 0]),
                       K.rect(1.1, 0.7, "#9CC77A", x=0.85, y=-0.55, sw=0), T("운동장", 20).move_to([0.85, -0.55, 0]))]
        cols = VGroup()
        for i, (s, p) in enumerate(zip(steps, pics)):
            K.fit(p, 2.6, 1.8)
            num = K.Circle(radius=0.28, fill_color=self.accent, fill_opacity=1, stroke_width=0)
            num = VGroup(num, T(str(i + 1), 28, "#FFFFFF").move_to(num))
            txt = VGroup(*[T(l, 24) for l in s.split("\n")]).arrange(DOWN, buff=0.06)
            col = VGroup(num, p, txt).arrange(DOWN, buff=0.22).move_to([(i - 1.5) * 3.4, 0.3, 0])
            cols.add(col)
        arrows = VGroup(*[Arrow(cols[i][1].get_right(), cols[i + 1][1].get_left(), color=SOFT, stroke_width=5, buff=0.15)
                          for i in range(3)])
        narr = ["먼저 책상 아래로 들어가 책상 다리를 꼭 잡아요. 떨어지는 물건으로부터 머리와 몸을 보호해요.",
                "흔들림이 멈출 때까지 기다리며 안내 방송을 주의 깊게 들어요.",
                "흔들림이 멈추면 가방이나 손으로 머리를 보호하며 나와요.",
                "승강기 대신 계단으로, 뛰지 않고 질서 있게 운동장으로 대피해요."]
        self.say("학교에서 지진이 나면 어떤 순서로 행동할까요?", "학교에서 지진이 나면 어떤 순서로 행동할까요?")
        self.pause_screen(5, "무엇부터 할까요?")
        for i in range(4):
            self.say(f"{i + 1}. " + steps[i].replace("\n", " "), narr[i])
            anims = [FadeIn(cols[i], shift=UP * 0.2)]
            if i:
                anims.append(Create(arrows[i - 1]))
            self.play(*anims, run_time=0.6)
        self.say(f"평소에 연습해 두면 {g('침착하게')} 행동할 수 있어요",
                 "먼저 머리와 몸을 보호하고, 흔들림이 멈춘 뒤에 안전한 곳으로 대피해요. 평소에 올바른 대처 방법을 알고 연습해 두면 침착하게 행동할 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        cd = K.text_card([f"지진의 세기는 {o('규모')}로 나타냅니다.",
                          "지진이 발생하면 사람이 다치거나 건물이 무너지는 등",
                          f"크고 작은 {r('피해')}가 발생합니다."], w=12.0, size=44).move_to([0, 0.6, 0])
        self.say(f"지진의 세기는 {o('규모')}로 나타내요",
                 "지진의 세기는 규모로 나타내요. 지진이 발생하면 크고 작은 피해가 발생해요. 그래서 평소에 대처 방법을 알아 두어요.")
        self.play(FadeIn(cd, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
