"""「과학 원리 돋보기」 4학년 16화 — 화산 활동과 지진이 일어나면 (4-1 3단원 땅의 변화 10~11차시, 화 코드 4-1-3-g)

바탕: grade4/science/sem1/u3-8.html(원본 _build_tb/src/u3-8.html) — 도입(재난 소식을 전하는 기자: 여러 재난 상황에 철저하게 대비),
상황 정하기(지진·영화관 / 지진·집 안 / 지진·학교 / 화산 활동·집 안, 알맞은 대처와 알맞지 않은 행동 — 앱 문장 그대로),
역할·대본 쓰기와 리허설(위험한 장면은 실제로 하지 않고 말로), 친구 모둠 평가 항목, 마무리(평소에 알고 연습하면 침착하게).
최종: ./make_final.sh s4ep16
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, RoundedRectangle, Polygon)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u13 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


COMBOS = [
    ("지진 · 영화관", ["흔들림이 멈출 때까지 자리에서 가방 등 소지품으로 머리를 보호해요",
                     "안내 방송을 주의 깊게 들어요", "흔들림이 멈추면 안내에 따라 차례로 대피해요"],
     ["출구로 먼저 달려가요", "승강기를 타고 내려가요"]),
    ("지진 · 집 안", ["탁자 아래로 들어가 몸을 보호해요", "흔들림이 멈추면 전기와 가스를 차단해요",
                    "밖으로 나가 운동장이나 공원 같은 넓은 곳으로 대피해요"],
     ["창문 옆에 서서 밖을 봐요", "승강기를 타고 내려가요"]),
    ("지진 · 학교", ["책상 아래로 들어가 책상 다리를 꼭 잡아요", "흔들림이 멈추면 가방으로 머리를 보호하며 나와요",
                   "계단을 이용해 질서를 지키며 운동장으로 대피해요"],
     ["복도로 뛰어나가요", "창가에 모여 밖을 봐요"]),
    ("화산 활동 · 집 안", ["텔레비전을 켜서 어떤 상황인지 알아봐요", "물 묻힌 수건으로 문틈이나 환기구를 막아요",
                        "창문도 테이프로 막아요", "비상 구급상자를 준비해요"],
     ["창문을 활짝 열어요", "화산을 보러 밖으로 나가요"]),
]


def row(text, ok, size=28, w=11.6):
    mk = K.ox_mark(ok, 0.2)
    t = T(text, size, bold=False)
    if t.width > w - 0.8:
        t.scale_to_fit_width(w - 0.8)
    return VGroup(mk, t).arrange(RIGHT, buff=0.3)


class S4Ep16(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 16
    EP_TITLE = "화산 활동과 지진이 일어나면"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.situations()
        self.detail(0, "영화관")
        self.detail(3, "화산 활동")
        self.script()
        self.review()
        self.closing(f"재난 문자와 안내 방송을 듣고, 먼저 {g('머리와 몸을 보호')}해요\n평소에 알고 연습하면 {o('침착하게')} 행동할 수 있어요",
                     next_preview="4학년 마인드맵 3 · 땅의 변화")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        tv = K.tv_news(6.4, 3.6).move_to([-2.6, 0.4, 0])
        ph = K.phone_msg(("긴급 재난 문자", "안내 방송을 듣고", "침착하게 행동하세요"), 3.2, 3.8).move_to([4.2, 0.35, 0])
        beep = M(r("삐, 삐!"), 34).next_to(ph, UP, buff=0.1)
        self.say("재난 현장의 소식을 전하던 기자는 무엇이 필요하다고 말했을까요?",
                 "재난 현장의 소식을 전하던 기자는 무엇이 필요하다고 말했을까요? 휴대 전화에는 긴급 재난 문자가 왔어요.")
        self.play(FadeIn(tv), run_time=0.6)
        self.play(FadeIn(ph, shift=LEFT * 0.3), FadeIn(beep), run_time=0.6)
        self.pause_screen(5, "기자는 무엇이 필요하다고 했을까요?")
        self.say(f"여러 재난 상황에 더욱 {o('철저하게 대비')}하는 것이 필요해요",
                 "기자는 여러 재난 상황에 더욱 철저하게 대비하는 것이 필요하다고 말해요. 재난 현장에 가까이 가서 구경하면 안 돼요. 오늘은 대처 방법을 상황극으로 표현해 봐요.")
        self.play(Indicate(tv[-1], color=ORANGE, scale_factor=1.06), run_time=0.9)
        self.settle()
        clear_stage(self)

    @staticmethod
    def cinema():
        g_ = VGroup(K.rect(2.4, 0.9, "#FFFFFF", y=0.55, stroke="#3A2A4A", sw=6))
        for j in range(2):
            for i in range(5):
                g_.add(K.rect(0.32, 0.26, "#C2332C", x=-0.9 + i * 0.45, y=-0.25 - j * 0.4, sw=0, r=0.06))
        return g_

    @staticmethod
    def house():
        return VGroup(K.P([(-1.0, 0.1), (0, 0.9), (1.0, 0.1)], "#E2573F", "#8A3B1E", 3),
                      K.rect(1.6, 1.0, "#F2EFE6", y=-0.4, stroke="#8A6A3E", sw=3),
                      K.rect(0.38, 0.6, "#C99560", x=0.3, y=-0.6, sw=0))

    # ── 상황 정하기 ──
    def situations(self):
        self.section("상황 정하기")
        cards = VGroup()
        icons = [self.cinema(), self.house(), K.desk(1.4), K.smoky_volcano()]
        for i, (nm, _, _) in enumerate(COMBOS):
            box = RoundedRectangle(corner_radius=0.2, width=3.1, height=3.0, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=self.accent, stroke_width=4)
            ic = K.fit(icons[i], 1.8, 1.2).move_to(box.get_center() + UP * 0.45)
            t = T(nm, 28).next_to(ic, DOWN, buff=0.35)
            cards.add(VGroup(box, ic, t).move_to([(i - 1.5) * 3.35, 0.3, 0]))
        self.say("우리 모둠이 표현할 재난 상황을 하나 골라요",
                 "모둠마다 표현할 재난 상황을 하나 골라요. 지진이 일어났을 때 영화관, 집 안, 학교, 그리고 화산 활동이 일어났을 때 집 안이에요.")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=1.2)
        self.say("그 상황에 알맞은 대처 방법을 골라 대본에 넣어요",
                 "고른 상황에 알맞은 대처 방법을 모두 골라 대본에 넣어요. 두 가지 상황을 함께 살펴봐요.")
        self.play(Indicate(VGroup(cards[0], cards[3]), color=ORANGE, scale_factor=1.04), run_time=1.0)
        self.settle()
        clear_stage(self)

    def detail(self, k, short):
        nm, ok, no = COMBOS[k]
        self.section(nm)
        head = M(f"{o(nm)}에서 알맞은 대처 방법은?", 40).move_to([0, 2.45, 0])
        items = ok + no
        order = [0, len(ok), 1, 2, len(ok) + 1] + list(range(3, len(ok)))
        rows_ = VGroup(*[row(items[i], False if i >= len(ok) else True) for i in range(len(items))])
        plain = VGroup(*[T(items[i], 28, bold=False) for i in range(len(items))])
        for p_ in plain:
            if p_.width > 10.8:
                p_.scale_to_fit_width(10.8)
        plain.arrange(DOWN, buff=0.28, aligned_edge=LEFT).move_to([0.3, -0.05, 0])
        for i, p_ in enumerate(plain):
            rows_[i].move_to(p_, aligned_edge=RIGHT).shift(RIGHT * 0)
            rows_[i][1].move_to(p_)
            rows_[i][0].next_to(p_, LEFT, buff=0.3)
        self.say(f"{nm}에서는 어떻게 대처할까요?",
                 f"{nm}에서는 어떻게 대처해야 할까요? 알맞은 것과 알맞지 않은 것을 골라 봐요.")
        self.play(FadeIn(head), FadeIn(plain, lag_ratio=0.15), run_time=1.2)
        if k == 0:
            self.pause_screen(5, "알맞은 대처 방법을 모두 골라요")
        if k == 0:
            narr_ok = "흔들림이 멈출 때까지 자리에서 가방 등 소지품으로 머리를 보호해요. 안내 방송을 주의 깊게 듣고, 흔들림이 멈추면 안내에 따라 차례로 대피해요."
            narr_no = "출구로 먼저 달려가면 넘어지거나 다칠 수 있어요. 지진이 나면 승강기 대신 계단을 이용해요."
            sub_no = f"먼저 달려가거나 승강기를 타면 {r('위험해요')}"
        else:
            narr_ok = "텔레비전을 켜서 어떤 상황인지 알아보고, 물 묻힌 수건으로 문틈이나 환기구를 막아요. 창문도 테이프로 막고, 비상 구급상자를 준비해요."
            narr_no = "화산재와 화산 가스가 들어오지 않게 창문과 문틈을 막아요. 위험한 곳에 가까이 가지 않아요."
            sub_no = f"창문을 열거나 화산을 보러 나가면 {r('안 돼요')}"
        self.say(f"{g('알맞은 대처')}를 확인해요", narr_ok)
        self.play(*[FadeIn(rows_[i][0], scale=1.4) for i in range(len(ok))], run_time=0.6)
        self.play(*[plain[i].animate.set_color(GREEN) for i in range(len(ok))], run_time=0.4)
        self.say(sub_no, narr_no)
        self.play(*[FadeIn(rows_[i][0], scale=1.4) for i in range(len(ok), len(items))],
                  *[plain[i].animate.set_opacity(0.45) for i in range(len(ok), len(items))], run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 대본과 리허설 ──
    def script(self):
        self.section("대본 쓰고 연습하기")
        stage = VGroup(K.rect(12.6, 4.9, "#3A2A4A", y=0.3, sw=0),
                       Polygon([-6.3, 2.75, 0], [6.3, 2.75, 0], [6.3, 2.1, 0], [3.0, 2.4, 0], [0, 2.05, 0], [-3.0, 2.4, 0],
                               [-6.3, 2.1, 0], fill_color="#C2332C", fill_opacity=1, stroke_width=0),
                       K.rect(12.6, 0.9, "#8A5A2B", y=-1.75, sw=0))
        roles = [("해설", ORANGE), ("엄마", BLUE), ("형", GREEN), ("동생", "#6B3FA0")]
        people = VGroup()
        for i, (nm, c) in enumerate(roles[1:]):
            kd = K.kid(c, 1.1).move_to([(i - 1) * 3.0, -0.7, 0])
            people.add(VGroup(kd, T(nm, 26, "#FFFFFF").next_to(kd, DOWN, buff=0.08)))
        self.say("장면마다 역할을 정하고 대본을 써요",
                 "장면마다 맡을 역할을 정하고, 대사를 우리 모둠 말로 써요. 모둠 친구 모두가 역할을 맡아요.")
        self.play(FadeIn(stage), FadeIn(people, lag_ratio=0.2), run_time=1.0)
        lines = [(None, "삐, 삐! (휴대 전화에 화산 활동을 알리는 긴급 재난 문자가 도착한다.)"),
                 (0, "물 묻힌 수건으로 문틈이나 환기구를 막아요."),
                 (1, "창문도 테이프로 막아요."),
                 (2, "침착하게 대처하니 안심이 돼요. 평소에 연습해 두길 잘했어요.")]
        bub = None
        for who, ln in lines:
            t = T(ln, 26, INK if who is not None else "#3A2A00")
            if t.width > 10.5:
                t.scale_to_fit_width(10.5)
            box = RoundedRectangle(corner_radius=0.2, width=t.width + 0.5, height=t.height + 0.4,
                                   fill_color=PAPER if who is not None else K.LAVA_Y, fill_opacity=1, stroke_width=0)
            nb = VGroup(box, t.move_to(box)).move_to([0, 1.35, 0])
            if who is not None:
                nb.set_x(np.clip(people[who].get_x(), -6.0 + nb.width / 2, 6.0 - nb.width / 2))
            sub = ("해설: 삐, 삐! 긴급 재난 문자가 도착한다" if who is None else f"{roles[who + 1][0]}: {ln}")
            self.say(sub, ("해설이 읽어요. " if who is None else f"{roles[who + 1][0]} 역할이 말해요. ") + ln)
            anims = [FadeIn(nb, scale=0.9)]
            if bub is not None:
                anims.append(FadeOut(bub))
            if who is not None:
                anims.append(people[who].animate.shift(UP * 0.12))
            self.play(*anims, run_time=0.5)
            if who is not None:
                self.play(people[who].animate.shift(DOWN * 0.12), run_time=0.2)
            bub = nb
        self.settle()
        self.play(FadeOut(bub), run_time=0.3)
        clear_stage(self)
        safe = K.text_card([f"뛰어내리기, 넘어지기처럼 {r('위험한 장면은 실제로 하지 않고')} 말로 표현해요.",
                            "책상 아래로 들어갈 때는 천천히 해요.",
                            "대사는 큰 소리로, 동작은 크게 해요."], w=12.0, size=32).move_to([0, 0.5, 0])
        self.say(f"위험한 장면은 {r('실제로 하지 않고')} 말로 표현해요",
                 "상황극을 할 때는 뛰어내리기, 넘어지기처럼 위험한 장면은 실제로 하지 않고 말로 표현해요. 책상 아래로 들어갈 때는 천천히 하고, 대사는 큰 소리로, 동작은 크게 해요.")
        self.play(FadeIn(safe, scale=0.95), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 친구 모둠 평가 ──
    def review(self):
        self.section("친구 모둠 평가하기")
        checks = ["재난 문자·안내 방송을 듣고 따랐어요", "머리와 몸을 먼저 보호했어요",
                  "흔들림이 멈춘 뒤 안전한 곳으로 대피했어요", "(화산) 문틈·창문을 막고 실내에서 대비했어요",
                  "침착하게 서로 도왔어요", "큰 목소리와 큰 동작으로 표현했어요"]
        rows_ = VGroup()
        for c in checks:
            bx = K.rect(0.42, 0.42, PAPER, stroke=self.accent, sw=4, r=0.06)
            rows_.add(VGroup(bx, T(c, 30, bold=False)).arrange(RIGHT, buff=0.3))
        rows_.arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to([0, 0.3, 0])
        self.say("친구 모둠의 상황극을 보고 대처 행동을 확인해요",
                 "친구 모둠의 상황극을 보고, 상황극에서 보인 대처 행동에 표시한 뒤 잘한 점을 말해요.")
        self.play(FadeIn(rows_, lag_ratio=0.12), run_time=1.4)
        ticks = VGroup(*[K.L((-0.12, 0.0), (-0.02, -0.12), GREEN, 7).add(K.L((-0.02, -0.12), (0.18, 0.15), GREEN, 7))
                         for _ in rows_])
        for t_, rw in zip(ticks, rows_):
            t_.move_to(rw[0])
        self.say(f"장소와 상황에 맞게 {g('먼저 머리와 몸을 보호')}했나요?",
                 "재난 문자와 안내 방송을 듣고 따랐나요? 장소와 상황에 맞게 먼저 머리와 몸을 보호하고, 흔들림이 멈춘 뒤 안전한 곳으로 대피했나요?")
        self.play(FadeIn(ticks[:3], lag_ratio=0.3), run_time=1.0)
        self.say(f"평소에 연습해 두면 {o('침착하게')} 행동할 수 있어요",
                 "평소에 올바른 대처 방법을 알고 연습해 두면, 화산 활동이나 지진이 일어났을 때 침착하게 행동할 수 있어요.")
        self.play(FadeIn(ticks[3:], lag_ratio=0.3), run_time=1.0)
        self.settle()
        clear_stage(self)
