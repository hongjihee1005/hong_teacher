"""「과학 원리 돋보기」 4학년 25화 — 인간 활동은 생태계에 어떤 영향을 줄까? (4-2 2단원 생물과 환경 7차시, 화 코드 4-2-2-d)

바탕: grade4/science/sem2/u2-4.html(원본 _build_tb/src2/u2-4.html) — 도입 영상(기름 유출: 배에서 기름이 새어 나옴 → 기름 막이 햇빛을 막음
→ 바닷속 식물이 잘 자라지 못함 → 바다 생물이 병에 걸리거나 죽을 수 있음·서식지 파괴), 낱말(환경오염·서식지·미세 플라스틱 5 mm 이하),
환경오염의 원인 분류(대기·수질·토양, 앱 sorter 목록 그대로), 소음·조명도 환경오염, 생태계에 주는 영향(앱 s5 목록 그대로),
합성 세제 실험(무씨 20개, 일주일 — 싹 튼 수는 앱의 W·D 예시 값, 화면에 '예시'라고 적음), 생각이 쑥(환경오염을 일으킬 수 있는 행동 5가지),
한눈에 쏙(토양오염). 에피소드 목록의 '개발로 먹이 그물의 한 고리가 사라질 때'는 이 차시 앱에 없어 넣지 않음(환경오염 중심).
최종: ./make_final.sh s4ep25
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Rectangle, Ellipse, Line,
                   ValueTracker, always_redraw, linear, Circumscribe, DashedLine, Transform)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s4u22 as K

AIRC, WATERC, SOILC = "#6E7FA0", "#2F78B8", "#8A5A2B"
W = [0, 4, 12, 16, 18, 18, 19, 19]   # 앱 예시: 물을 준 접시에서 싹 튼 수(0~7일째)
D = [0, 0, 1, 2, 2, 3, 3, 3]         # 앱 예시: 합성 세제 용액 접시


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def chip(text, col, size=26, w=None):
    t = T(text, size)
    bw = w or t.width + 0.36
    if t.width > bw - 0.25:
        t.scale_to_fit_width(bw - 0.25)
    b = K.R(bw, t.height + 0.3, PAPER, rad=0.14, stroke=col, sw=4)
    t.move_to(b)
    return VGroup(b, t)


class S4Ep25(EpisodeScene):
    GRADE, SEM = 4, 2
    EP_NO = 25
    EP_TITLE = "인간 활동은 생태계에 어떤 영향을 줄까?"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.oil()
        self.words()
        self.causes()
        self.effects()
        self.detergent()
        self.life()
        self.summary()
        self.closing(f"인간의 활동으로 생기는 {r('환경오염')}은 생태계에 나쁜 영향을 줘요\n대기오염, 수질오염, 토양오염 등이 있어요",
                     next_preview="4학년 26화 · 생태계를 보전하려면?")
        self.wait(0.5)

    # ── 궁금해요: 기름 유출 ──
    def oil(self):
        self.section("궁금해요")
        SY = 0.9
        dark = ValueTracker(0.0)

        def sea_col(d):
            a = np.array([63, 143, 196]) * (1 - d) + np.array([33, 83, 106]) * d
            return "#%02X%02X%02X" % tuple(int(v) for v in a)
        sea = always_redraw(lambda: Rectangle(width=13.4, height=3.35, fill_color=sea_col(dark.get_value()), fill_opacity=1,
                                              stroke_width=0).move_to([0, SY - 1.675, 0]))
        sun = K.pic("햇빛", 1.1, 1.1).move_to([-5.4, 2.3, 0])
        rays = VGroup(*[DashedLine([-4.9 + k * 1.1, 1.8, 0], [-3.6 + k * 1.6, -1.8, 0], color="#FFF3A0", stroke_width=6, dash_length=0.25)
                        for k in range(4)])
        ship = K.ship().scale(0.9).move_to([3.6, SY + 0.3, 0])
        weeds = VGroup(*[K.weed(1.3 - 0.2 * (k % 2)).move_to([x, -1.85, 0]) for k, x in enumerate((-4.6, -4.2, 1.2, 4.8, 5.2))])
        fish1 = K.pic("고등어", 1.0, 0.5).move_to([-1.2, -0.6, 0])
        fish2 = K.pic("붕어", 0.9, 0.45).move_to([0.9, -1.3, 0])
        bird = K.pic("갈매기", 1.1, 0.75).move_to([-1.5, 2.3, 0])
        self.say("바다에 유출된 기름은 생태계에 어떤 영향을 미칠까요?",
                 "바다에 유출된 기름은 생태계에 어떤 영향을 미칠까요?")
        self.add(sea)
        self.play(FadeIn(sun), FadeIn(rays), FadeIn(ship), FadeIn(weeds), FadeIn(fish1), FadeIn(fish2), FadeIn(bird), run_time=1.0)
        self.say("사고가 난 배에서 기름이 새어 나와요", "사고가 난 배에서 기름이 바다로 새어 나와요.")
        leak = Line(ship.get_bottom() + LEFT * 0.4, ship.get_bottom() + LEFT * 0.4 + DOWN * 0.6, stroke_color="#1B1B1B", stroke_width=14)
        self.play(Create(leak), run_time=0.8)
        film = Ellipse(width=0.8, height=0.18, fill_color="#1B1B1B", fill_opacity=0.9, stroke_width=0).move_to([3.0, SY - 0.05, 0])
        film2 = Ellipse(width=12.8, height=0.32, fill_color="#1B1B1B", fill_opacity=0.9, stroke_width=0).move_to([0.2, SY - 0.05, 0])
        self.say(f"기름이 퍼져 바닷물 표면에 {r('기름 막')}이 생겨요", "기름이 넓게 퍼져 바닷물 표면에 기름 막이 생겨요.")
        self.play(FadeIn(film), run_time=0.3)
        self.play(Transform(film, film2), FadeOut(leak), run_time=1.6)
        self.pause_screen(5, "생물에게 어떤 일이 생길까요?")
        self.say(f"기름 막이 {r('햇빛을 막아')} 바닷속이 어두워져요", "기름 막이 햇빛을 막아 바닷속이 어두워져요.")
        self.play(rays.animate.set_opacity(0.1), dark.animate.set_value(1.0), run_time=1.4)
        self.say("바닷속 식물이 잘 자라지 못해요", "햇빛이 들지 않아 바닷속 식물이 잘 자라지 못해요.")
        self.play(*[w.animate.stretch(0.5, 1, about_edge=DOWN).set_color("#8A7A3A") for w in weeds], run_time=1.2)
        self.say(f"바다 생물이 {r('병에 걸리거나 죽을 수')} 있고, 서식지가 파괴돼요",
                 "기름이 묻은 바닷새와 물고기가 병에 걸리거나 죽을 수 있어요. 바다 생물의 서식지도 파괴돼요.")
        self.play(bird.animate.move_to([-1.5, SY + 0.05, 0]).set_color("#2A2A2A"), fish1.animate.set_color("#9A9A8A").shift(DOWN * 0.6),
                  fish2.animate.set_color("#9A9A8A").shift(DOWN * 0.4), run_time=1.4)
        self.settle()
        sea.clear_updaters()
        clear_stage(self)

    # ── 낱말 ──
    def words(self):
        self.section("낱말 알기")
        rows = [("환경오염", "인간의 활동으로 환경이 더러워지거나 훼손되는 현상", RED),
                ("서식지", "생물이 일정하게 자리 잡고 사는 곳", GREEN),
                ("미세 플라스틱", "크기가 5 mm 이하인 작은 플라스틱", BLUE)]
        grp = VGroup()
        for k, (w, d, col) in enumerate(rows):
            lab = chip(w, col, 32, 3.0)
            dd = T(d, 32)
            if dd.width > 9.0:
                dd.scale_to_fit_width(9.0)
            dd.next_to(lab, RIGHT, buff=0.4)
            grp.add(VGroup(lab, dd).move_to([0, 1.9 - k * 1.45, 0]).align_to([-6.3, 0, 0], LEFT))
        narr = ["인간의 활동으로 환경이 더러워지거나 훼손되는 현상을 환경오염이라고 해요.",
                "서식지는 생물이 일정하게 자리 잡고 사는 곳이에요.",
                "미세 플라스틱은 크기가 5밀리미터 이하인 작은 플라스틱이에요."]
        subs = [f"인간의 활동으로 환경이 더러워지는 것: {r('환경오염')}", f"생물이 자리 잡고 사는 곳: {g('서식지')}",
                "5 mm 이하인 작은 플라스틱: 미세 플라스틱"]
        for k in range(3):
            self.say(subs[k], narr[k])
            self.play(FadeIn(grp[k], shift=RIGHT * 0.3), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 원인 ──
    def bins(self):
        out = {}
        for key, nm, col, x in (("air", "대기오염", AIRC, -4.5), ("water", "수질오염", WATERC, 0.0), ("soil", "토양오염", SOILC, 4.5)):
            out[key] = K.bin_box(nm, 4.3, 4.6, col, 38).move_to([x, 0.22, 0])
        return out

    def causes(self):
        self.section("환경오염의 원인")
        bx = self.bins()
        C = [("자동차 매연", "air"), ("공장 매연", "air"), ("쓰레기를 태울 때 나오는 연기", "air"),
             ("가정의 생활 하수", "water"), ("공장 폐수", "water"), ("축산 폐수", "water"), ("기름 유출", "water"),
             ("지나친 농약 사용", "soil"), ("쓰레기 배출", "soil"), ("플라스틱의 과도한 사용", "soil")]
        cols = {"air": AIRC, "water": WATERC, "soil": SOILC}
        self.say("환경오염의 원인을 대기·수질·토양오염으로 나누어 봐요",
                 "환경오염의 원인을 대기오염, 수질오염, 토양오염으로 나누어 봐요.")
        self.play(FadeIn(VGroup(*bx.values())), run_time=0.6)
        self.pause_screen(5, "공기, 물, 흙 중 무엇이 오염될까요?")
        cnt = {"air": 0, "water": 0, "soil": 0}
        groups = {"air": VGroup(), "water": VGroup(), "soil": VGroup()}
        for txt, key in C:
            c = chip(txt, cols[key], 26, 3.9).move_to(bx[key].box.get_top() + DOWN * (1.15 + cnt[key] * 0.82))
            cnt[key] += 1
            groups[key].add(c)
        subs = {"air": f"매연과 연기는 {o('대기오염')}", "water": f"하수·폐수·기름 유출은 {o('수질오염')}",
                "soil": f"농약·쓰레기·플라스틱은 {o('토양오염')}"}
        narr = {"air": "자동차 매연, 공장 매연, 쓰레기를 태울 때 나오는 연기는 대기오염의 원인이에요.",
                "water": "가정의 생활 하수, 공장 폐수, 축산 폐수, 기름 유출은 수질오염의 원인이에요.",
                "soil": "지나친 농약 사용, 쓰레기 배출, 플라스틱의 과도한 사용은 토양오염의 원인이에요."}
        for key in ("air", "water", "soil"):
            self.say(subs[key], narr[key])
            self.play(FadeIn(groups[key], lag_ratio=0.2, shift=DOWN * 0.2), run_time=0.9)
        note = T("큰 소음, 밤의 밝은 조명도 생활 환경에 나쁜 영향을 주면 환경오염이에요", 26, SOFT).move_to([0, -2.3, 0])
        self.say("큰 소음이나 밝은 조명도 환경오염이 될 수 있어요",
                 "큰 소음이나 밤의 밝은 조명처럼 생활 환경에 나쁜 영향을 주는 것도 환경오염이에요.")
        self.play(FadeIn(note), run_time=0.4)
        self.settle()
        clear_stage(self)

    # ── 영향 ──
    def effects(self):
        self.section("생태계에 주는 영향")
        bx = self.bins()
        E_ = {"air": ["동물이 숨쉬기 어려워지거나\n병에 걸려요", "산성비가 내려 식물이\n잘 자라지 못해요"],
              "water": ["물고기가 병에 걸리거나\n죽을 수 있어요", "물에 사는 생물의\n서식지가 파괴돼요"],
              "soil": ["땅이 오염되어 동물이\n살아갈 곳을 잃어요", "지하수가 오염되어\n사용하기 어려워져요"]}
        cols = {"air": AIRC, "water": WATERC, "soil": SOILC}
        grp = VGroup()
        for key, lst in E_.items():
            for k, t in enumerate(lst):
                lines = VGroup(*[T(s, 26) for s in t.split("\n")]).arrange(DOWN, buff=0.1)
                if lines.width > 3.6:
                    lines.scale_to_fit_width(3.6)
                b = K.R(3.95, lines.height + 0.4, PAPER, rad=0.14, stroke=cols[key], sw=4)
                lines.move_to(b)
                grp.add(VGroup(b, lines).move_to(bx[key].box.get_top() + DOWN * (1.5 + k * 1.55)))
        self.say("환경오염은 생태계에 어떤 영향을 줄까요?", "환경오염은 생태계에 어떤 영향을 줄까요?")
        self.play(FadeIn(VGroup(*bx.values())), run_time=0.5)
        self.play(FadeIn(grp, lag_ratio=0.15), run_time=1.8)
        self.say(f"생물이 병에 걸리고 {r('서식지가 파괴')}돼 생물이 줄어들 수 있어요",
                 "환경이 오염되면 생물이 병에 걸리고 서식지가 파괴되어, 생물의 종류와 수가 줄어들 수 있어요.")
        self.settle()
        clear_stage(self)

    # ── 합성 세제 실험 ──
    def detergent(self):
        self.section("같은 주제 다른 탐구")
        day = ValueTracker(0)
        dl = always_redraw(lambda: K.dish(W[int(round(day.get_value()))], 3.6).move_to([-3.2, 0.5, 0]))
        dr = always_redraw(lambda: K.dish(D[int(round(day.get_value()))], 3.6).move_to([3.2, 0.5, 0]))
        ll = T("물", 34).move_to([-3.2, -1.05, 0])
        lr = T("합성 세제 용액", 34).move_to([3.2, -1.05, 0])
        dt = always_redraw(lambda: M(f"{o(str(int(round(day.get_value()))))}일째", 40).move_to([0, 2.45, 0]))
        self.say("합성 세제가 식물에 미치는 영향을 알아봐요",
                 "합성 세제가 식물에 미치는 영향도 알아봐요. 탈지면을 깐 접시 한쪽에는 합성 세제 용액을, 다른 쪽에는 같은 양의 물을 넣어요.")
        self.add(dl, dr)
        self.play(FadeIn(ll), FadeIn(lr), run_time=0.6)
        self.say(f"같은 수({o('20개')})의 무씨를 놓고 일주일 동안 관찰해요",
                 "같은 수인 무씨 스무 개를 놓고, 일주일 동안 싹 튼 무씨를 세어요.")
        self.add(dt)
        self.pause_screen(5, "어느 접시에서 더 많이 싹 틀까요?")
        self.play(day.animate.set_value(7), run_time=5.0, rate_func=linear)
        for m in (dl, dr, dt):
            m.clear_updaters()
        cl = M(f"싹 {g(str(W[7]))}개", 34).next_to(ll, DOWN, buff=0.2)
        cr = M(f"싹 {r(str(D[7]))}개", 34).next_to(lr, DOWN, buff=0.2)
        note = T("싹 튼 개수는 예시예요. 실제 실험에서는 조금씩 다를 수 있어요.", 26, SOFT).move_to([0, -2.3, 0])
        self.say(f"{g('물을 준 접시')}에서 무씨가 훨씬 많이 싹 텄어요",
                 "일주일 뒤, 물을 준 접시에서 무씨가 훨씬 많이 싹 텄어요.")
        self.play(FadeIn(cl), FadeIn(cr), FadeIn(note), run_time=0.6)
        self.say(f"합성 세제는 씨가 싹 트는 것을 {r('방해해요')}",
                 "합성 세제는 씨가 싹 트는 것을 방해해요. 오염된 물에서는 씨가 싹 트기 어려워요.")
        self.play(Circumscribe(dr, color=RED), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각이 쑥 ──
    def life(self):
        self.section("생각이 쑥")
        L = [("음식물을 남겨요", True), ("플라스틱병이나 비닐을 함부로 버려요", True), ("샴푸 같은 합성 세제를 많이 써요", True),
             ("가까운 거리도 자동차를 타고 가요", True), ("일회용품을 많이 써요", True),
             ("장을 볼 때 장바구니를 써요", False), ("가까운 거리는 걸어서 가요", False)]
        rows = VGroup(*[chip(t, SOFT, 28, 6.1) for t, _ in L])
        rows.arrange_in_grid(cols=2, buff=(0.4, 0.28), flow_order="dr").move_to([0, 0.45, 0])
        self.say("환경오염을 일으킬 수 있는 행동은 무엇일까요?", "일상생활 속에서 환경오염을 일으킬 수 있는 행동을 모두 골라 봐요.")
        self.play(FadeIn(rows, lag_ratio=0.1), run_time=1.2)
        self.pause_screen(5, "환경오염을 일으키는 행동은?")
        self.say(f"음식물 남기기, 함부로 버리기, 일회용품 많이 쓰기 등 {r('5가지')}예요",
                 "빨간 테두리 다섯 가지 행동은 환경오염을 일으킬 수 있어요. 장바구니 쓰기와 걸어가기는 환경을 지키는 행동이에요.")
        self.play(*[row[0].animate.set_stroke(RED, 6) for row, (_, bad) in zip(rows, L) if bad],
                  *[row[0].animate.set_stroke(GREEN, 6) for row, (_, bad) in zip(rows, L) if not bad], run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"환경오염에는 {o('대기오염')}, {o('수질오염')},", f"{r('토양오염')} 등이 있습니다."], size=46).move_to([0, 1.0, 0])
        self.say(f"환경오염에는 대기오염, 수질오염, {r('토양오염')} 등이 있어요",
                 "환경오염에는 대기오염, 수질오염, 토양오염 등이 있어요.")
        self.play(FadeIn(card, scale=0.95), run_time=0.8)
        self.settle()
        clear_stage(self)
