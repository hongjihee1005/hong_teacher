"""「처음 배우는 과학」 3학년 7화 — 물에 사는 동물과 물갈퀴 (3-1 2단원 동물의 생활 5차시, 화 코드 3-1-2-c)

바탕: grade3/science/sem1/u2-3.html — 도입(붕어: 지느러미·부드러운 곡선 모양 몸, 강·호수·갯벌·바다),
가상 실험실(원형 수조·페트병 뚜껑·부챗살·넓은 셀로판테이프·가위, ㈎ 부챗살 → 조금 출렁 / ㈏ 물갈퀴처럼 만든 부챗살 → 많이 출렁·뚜껑이 더 많이 움직임),
결과 정리(물을 더 많이 밀어 내 빠르게, 개구리·오리·수달·바다거북), 동물 조사(DEX: 수달·농게·돌고래),
이동 방법 분류(MOVE), 환경과의 관련(envPick), 한눈에 쏙(개구리·수달 물갈퀴), 생각+(고등어·돌고래), 형성 평가 1(수달).
뚜껑이 움직인 칸 수는 앱에서 젓기마다 달라 영상에서는 수를 말하지 않음. (형성 평가 2·3·수행 평가는 길이 때문에 뺌)
실제 그림: photos/f3ep07/ (WANT.md), 다시 씀: f3ep05/carp
최종: TTS_SPEED=1.0 ./make_voice.sh f3ep07
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, Create, Ellipse, FadeIn, FadeOut, GrowArrow, Indicate, Line,
                   Rectangle, Rotate, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, BROWN_DARK, clear_stage
import kit_s3u12 as K
import firstkit as F


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


X0, UNIT = -0.6, 0.66      # 눈금 0의 자리, 한 칸
SURF = 0.55                # 물 위
PIV = np.array([-3.3, 2.35, 0.0])   # 부챗살 축

# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "carp_fin_d": (940, 280), "carp_fin_t": (1660, 600), "carp_body": (1000, 560),   # f3ep05/carp
    "frog_web": (1380, 880),
    "duck_web": (900, 940),
    "otter_head": (520, 430), "otter_foot": (1250, 760),
    "crab_claw": (640, 600), "crab_leg": (1300, 760),
    "dolphin_body": (960, 560), "dolphin_fin": (1620, 560),
}


def fan(webbed):
    angs = [-0.5, -0.25, 0.0, 0.25, 0.5]
    g_ = VGroup()
    ends = []
    for a in angs:
        d = np.array([np.sin(a), -np.cos(a), 0])
        ends.append((PIV + d * 0.9, PIV + d * 3.0))
    webs = VGroup()
    for i in range(4):
        a1, b1 = ends[i]
        a2, b2 = ends[i + 1]
        webs.add(K.poly([a1[:2], b1[:2], b2[:2], a2[:2]], "#F3E6A0", op=0.95, sw=2))
    ribs = VGroup(*[Line(PIV, e[1], stroke_color=BROWN_DARK, stroke_width=7) for e in ends])
    knob = K.C(0.14, BROWN_DARK, PIV[0], PIV[1], sw=2)
    g_.add(webs, ribs, knob)
    g_.webs = webs
    if not webbed:
        webs.set_opacity(0)
    return g_


class F3Ep07(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 7
    EP_TITLE = "물에 사는 동물과 물갈퀴"
    SERIES = "처음 배우는 과학"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.wonder()
        self.words()
        self.experiment()
        self.result()
        self.survey()
        self.summary()
        self.check()
        self.closing(f"물갈퀴가 있는 발은 물을 {o('더 많이 밀어 내')}\n물속에서 {g('빠르게')} 움직일 수 있어요",
                     next_preview="처음 배우는 과학 3학년 8화 · 극지방과 사막에 사는 동물")
        self.wait(0.5)

    # ── 궁금해요: 붕어 ──
    def wonder(self):
        self.section("궁금해요")
        ph = F.photo("f3ep05/carp", height=5.2).move_to([0, 0.35, 0])
        self.say("물고기는 어떻게 물속에서 빠르게 움직일까요?", "물속을 헤엄치는 붕어예요. 물고기는 어떻게 물속에서 빠르게 움직일 수 있을까요?")
        self.play(FadeIn(ph), run_time=0.8)
        self.pause_screen(5, "붕어의 몸을 살펴봐요")
        a1, t1 = F.callout(ph, P["carp_fin_d"], "지느러미", to=(1.8, 0.9))
        a2, t2 = F.callout(ph, P["carp_fin_t"], "지느러미", to=(0.2, 1.8))
        self.say(f"몸에 {o('지느러미')}가 있어요", "붕어는 몸에 지느러미가 있어요.")
        self.play(GrowArrow(a1), GrowArrow(a2), FadeIn(t1), FadeIn(t2), run_time=0.8)
        rg = F.ring(ph, P["carp_body"], rx=3.0, ry=1.25)
        self.say(f"몸이 {o('부드러운 곡선 모양')}이에요", "그리고 몸이 부드러운 곡선 모양이에요. 그래서 물속에서 빠르게 움직일 수 있어요.")
        self.play(Create(rg), run_time=0.8)
        self.settle()
        clear_stage(self)
        places = VGroup(*[F.name_tag(w, 46, INK, stroke=BLUE) for w in ("강", "호수", "갯벌", "바다")]).arrange(RIGHT, buff=0.6)
        places.move_to([0, 0.5, 0])
        self.say("강, 호수, 갯벌, 바다에서 동물을 본 적이 있나요?", "강, 호수, 갯벌, 바다에서 동물을 본 적이 있나요? 물에 사는 동물을 알아봐요.")
        self.play(FadeIn(places, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 새 낱말: 물갈퀴 ──
    def words(self):
        self.section("새 낱말")
        ph = F.photo("f3ep07/frog", height=5.2).move_to([0, 0.35, 0])
        self.say("땅과 물을 오가며 사는 개구리예요", "땅과 물을 오가며 사는 개구리예요.")
        self.play(FadeIn(ph), run_time=0.7)
        rg = F.ring(ph, P["frog_web"], r=0.8)
        a, t = F.callout(ph, P["frog_web"], "물갈퀴", to=(-2.4, 0.4))
        self.say(f"발가락 사이의 얇은 막이 {o('물갈퀴')}예요", "뒷발을 보세요. 발가락 사이에 있는 얇은 막을 물갈퀴라고 해요. 물갈퀴.")
        self.play(Create(rg), run_time=0.6)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say(f"물속에서는 {o('물갈퀴')}가 있는 발로 헤엄쳐요", "개구리는 물속에서 물갈퀴가 있는 발로 헤엄쳐요.")
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep07/duck", height=5.2).move_to([0, 0.35, 0])
        self.say("오리의 발도 살펴볼까요?", "오리의 발도 살펴볼까요?")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["duck_web"], "물갈퀴", to=(2.4, 0.6))
        self.say(f"발가락 사이에 {o('물갈퀴')}가 있어 헤엄을 잘 쳐요", "오리도 발가락 사이에 물갈퀴가 있어 물에서 헤엄을 잘 쳐요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say("물갈퀴가 있으면 어떤 점이 좋을까요?", "발에 물갈퀴가 있으면 어떤 점이 좋을까요? 실험으로 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def experiment(self):
        self.section("실험해요")
        items = VGroup(*[F.name_tag(w, 38, INK, stroke=self.accent) for w in
                         ("물이 담긴 원형 수조", "페트병 뚜껑", "부챗살", "넓은 셀로판테이프", "가위")])
        items[:3].arrange(RIGHT, buff=0.4)
        items[3:].arrange(RIGHT, buff=0.4)
        VGroup(items[:3], items[3:]).arrange(DOWN, buff=0.45).move_to([0, 0.8, 0])
        warn = M(f"물을 흘리면 {r('미끄러질 수 있어요')} · 물과 가위로 장난치지 않아요", 34).move_to([0, -1.3, 0])
        self.say("준비물을 챙기고 안전 약속을 확인해요",
                 "물이 담긴 원형 수조, 페트병 뚜껑, 부챗살, 넓은 셀로판테이프, 가위를 준비해요. 물을 흘리면 미끄러질 수 있으니 조심해요.")
        self.play(FadeIn(items, lag_ratio=0.12), run_time=1.0)
        self.play(FadeIn(warn), run_time=0.5)
        self.settle()
        clear_stage(self)
        water = Rectangle(width=11.8, height=SURF + 2.0, fill_color=K.WATER, fill_opacity=0.7, stroke_width=0).move_to([0.3, (SURF - 2.0) / 2, 0])
        tank = VGroup(Line([-5.6, SURF + 0.5, 0], [-5.6, -2.0, 0]), Line([-5.6, -2.0, 0], [6.2, -2.0, 0]),
                      Line([6.2, -2.0, 0], [6.2, SURF + 0.5, 0])).set_stroke(INK, 5)
        ticks = VGroup()
        for i in range(11):
            x = X0 + i * UNIT
            ticks.add(Line([x, -1.75, 0], [x, -1.55 if i % 5 else -1.45, 0], stroke_color=INK, stroke_width=3))
        ticks.add(Line([X0, -1.75, 0], [X0 + 10 * UNIT, -1.75, 0], stroke_color=INK, stroke_width=3))
        cap = Rectangle(width=0.5, height=0.22, fill_color=RED, fill_opacity=1, stroke_color=INK, stroke_width=3).move_to([X0, SURF + 0.06, 0])
        self.say("① 수조에 페트병 뚜껑을 띄워요", "물이 담긴 수조에 페트병 뚜껑을 띄워요. 수조 속 눈금으로 뚜껑이 움직인 거리를 읽어요.")
        self.play(FadeIn(water), Create(tank), FadeIn(ticks), run_time=0.8)
        self.play(FadeIn(cap, shift=DOWN * 0.6), run_time=0.6)
        self.cap = cap
        f = fan(False)
        la = T("㈎ 부챗살", 38, INK).move_to([1.5, 2.45, 0])
        self.say(f"② {o('부챗살')}을 펼쳐 물속에서 저어요", "부챗살을 펼친 뒤 물속에서 저으면서 뚜껑을 움직여요. 부챗살 사이에는 빈틈이 있어요.")
        self.play(FadeIn(f), FadeIn(la), run_time=0.6)
        self.stir(f, 2.0, small=True)
        self.say(f"물이 {o('조금')} 출렁이고 뚜껑이 조금 움직여요", "물이 조금 출렁거리고, 뚜껑이 조금 움직였어요.")
        mark_a = Line([X0 + 2.0 * UNIT, -0.95, 0], [X0 + 2.0 * UNIT, -0.55, 0], stroke_color=ORANGE, stroke_width=8)
        ta = T("㈎", 30, ORANGE).next_to(mark_a, UP, buff=0.05)
        self.play(Create(mark_a), FadeIn(ta), run_time=0.4)
        self.play(self.cap.animate.move_to([X0, SURF + 0.06, 0]), run_time=0.5)
        f2 = fan(True)
        lb = T("㈏ 물갈퀴처럼 만든 부챗살", 38, INK).move_to([1.5, 2.45, 0])
        self.say(f"③ 빈틈에 테이프를 붙여 {o('물갈퀴')}처럼 만들어요",
                 "가위로 넓은 셀로판테이프를 잘라 부챗살 사이의 빈틈에 붙여요. 물갈퀴처럼 만든 거예요.")
        self.play(FadeOut(la), FadeIn(lb), run_time=0.3)
        self.remove(f)
        self.add(f2)
        f2.webs.set_opacity(0)
        for w in f2.webs:
            self.play(w.animate.set_fill(opacity=0.95).set_stroke(opacity=1), run_time=0.3)
        self.say("④ 같은 힘으로 저으면 어떻게 될까요?", "이제 물갈퀴처럼 만든 부챗살로 같은 힘으로 저어요. 어떻게 될까요?")
        self.pause_screen(5, "뚜껑이 더 많이 움직이는 것은 ㈎? ㈏?")
        self.stir(f2, 6.0, small=False)
        self.say(f"물이 {o('많이')} 출렁이고 뚜껑이 {g('더 많이')} 움직여요",
                 "물이 더 많이 출렁거리고, 뚜껑이 더 많이 움직였어요.")
        mark_b = Line([X0 + 6.0 * UNIT, -0.95, 0], [X0 + 6.0 * UNIT, -0.55, 0], stroke_color=GREEN, stroke_width=8)
        tb = T("㈏", 30, GREEN).next_to(mark_b, UP, buff=0.05)
        self.play(Create(mark_b), FadeIn(tb), run_time=0.4)
        self.settle()
        clear_stage(self)

    def stir(self, f, dist, small):
        cap = self.cap
        self.play(Rotate(f, angle=-0.35, about_point=PIV), run_time=0.4)
        n = 2 if small else 5
        rings = VGroup(*[Ellipse(width=(0.6 + 0.5 * i) * (1 if small else 1.6), height=(0.2 + 0.12 * i) * (1 if small else 1.6),
                                 stroke_color=K.WATER_D, stroke_width=4 if small else 6).move_to([PIV[0], SURF, 0]) for i in range(n)])
        self.play(Rotate(f, angle=0.7, about_point=PIV), FadeIn(rings, lag_ratio=0.2),
                  cap.animate.move_to([X0 + dist * UNIT, SURF + 0.06, 0]), run_time=1.6)
        self.play(Rotate(f, angle=-0.35, about_point=PIV), FadeOut(rings), run_time=0.5)

    # ── 결과 정리 ──
    def result(self):
        self.section("정리해요")
        rows = VGroup(
            VGroup(T("", 10), T("물의 출렁임", 34, SOFT), T("페트병 뚜껑", 34, SOFT)),
            VGroup(T("㈎ 부챗살", 38), T("조금 출렁여요", 38), T("조금 움직여요", 38)),
            VGroup(T("㈏ 물갈퀴 부챗살", 38), M(o("많이 출렁여요"), 38), M(g("더 많이 움직여요"), 38)),
        )
        xs = [-4.2, 0.4, 4.3]
        for i, row in enumerate(rows):
            for j, c in enumerate(row):
                c.move_to([xs[j], 2.2 - i * 0.85, 0])
        line = Line([-6.6, 1.78, 0], [6.6, 1.78, 0], stroke_color=SOFT, stroke_width=3)
        self.say("실험 결과를 정리해요", "실험 결과를 정리해 볼게요.")
        self.play(FadeIn(line), FadeIn(rows, lag_ratio=0.2), run_time=1.0)
        c = K.text_card([f"발에 {o('물갈퀴')}가 있으면 물을 {o('더 많이 밀어 내')}",
                         f"물속에서 {g('빠르게')} 움직일 수 있어요"], size=42).move_to([0, -1.0, 0])
        self.say(f"물을 {o('더 많이 밀어 내')} {g('빠르게')} 움직일 수 있어요",
                 "발에 물갈퀴가 있으면 물을 더 많이 밀어 내서, 물속에서 빠르게 움직일 수 있어요.")
        self.play(FadeIn(c, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
        names = ["개구리", "오리", "수달", "바다거북"]
        cs = VGroup(*[K.card(n, 2.6, 2.3, 34) for n in names]).arrange(RIGHT, buff=0.4).move_to([0, 0.5, 0])
        self.say("물갈퀴나 지느러미 모양의 발로 헤엄치는 동물",
                 "개구리, 오리, 수달, 바다거북처럼 물갈퀴나 지느러미 모양의 발로 헤엄치는 동물이 있어요.")
        self.play(FadeIn(cs, lag_ratio=0.15), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 조사 ──
    def survey(self):
        self.section("조사해요")
        # 수달
        ph = F.photo("f3ep07/otter", height=5.2).move_to([0, 0.35, 0])
        self.say("강이나 호수에 사는 수달이에요", "강이나 호수에 사는 수달이에요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["otter_foot"], "물갈퀴가 있는 발", to=(2.4, -0.6), size=36)
        self.say(f"머리는 납작하며 둥글고 발에 {o('물갈퀴')}가 있어요", "수달은 머리가 납작하며 둥글고, 발에 물갈퀴가 있어요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say(f"땅과 물을 오가며, {o('물갈퀴 발')}로 헤엄쳐요", "수달은 땅과 물을 오가며 살아요. 물속에서는 물갈퀴가 있는 발로 헤엄쳐 다녀요.")
        self.settle()
        clear_stage(self)
        # 농게
        ph = F.photo("f3ep07/crab", height=5.2).move_to([0, 0.35, 0])
        self.say("갯벌에 사는 농게예요", "갯벌에 사는 농게예요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["crab_claw"], "더 큰 집게발", to=(-1.6, 1.6), size=36)
        self.say(f"딱딱한 껍데기, 수컷은 한쪽 {o('집게발')}이 더 커요",
                 "농게는 몸이 딱딱한 껍데기로 덮여 있고 다리가 있어요. 수컷은 한쪽 집게발이 더 커요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say(f"갯벌에 구멍을 뚫고 살며 {o('다리로 걸어')} 다녀요", "갯벌에 구멍을 뚫고 살며, 다리로 갯벌 위를 걸어 다녀요.")
        self.settle()
        clear_stage(self)
        # 이동 방법 분류
        bins = [("지느러미로 헤엄쳐요", ["붕어", "고등어", "돌고래", "해마"], BLUE),
                ("물갈퀴 발이나 다리로 헤엄쳐요", ["개구리", "수달", "물방개", "꽃게"], GREEN),
                ("기어다니거나 걸어 다녀요", ["다슬기", "조개", "농게"], ORANGE),
                ("한곳에 붙어 살아요", ["따개비", "산호"], SOFT)]
        self.say("물에 사는 동물은 어떻게 이동할까요?", "물에 사는 동물은 어떻게 이동할까요? 이동 방법에 따라 나누어 봐요.")
        boxes = VGroup()
        for i, (title, ns, col) in enumerate(bins):
            x, y = (-3.45 if i % 2 == 0 else 3.45), (1.35 if i < 2 else -1.05)
            bx = K.bin_box(title, 6.6, 2.15, col, size=32).move_to([x, y, 0])
            tags = VGroup(*[F.name_tag(n, 32, INK, stroke=col) for n in ns]).arrange(RIGHT, buff=0.2)
            tags.move_to(bx.box.get_center() + DOWN * 0.2)
            boxes.add(VGroup(bx, tags))
        self.play(FadeIn(VGroup(*[b[0] for b in boxes])), run_time=0.6)
        self.pause_screen(4, "농게와 따개비는 어디에 들어갈까요?")
        narr = ["붕어, 고등어, 돌고래, 해마는 지느러미로 헤엄쳐요.",
                "개구리와 수달은 물갈퀴가 있는 발로, 물방개와 꽃게는 다리로 헤엄쳐요.",
                "다슬기와 조개는 기어다니고, 농게는 걸어 다녀요.",
                "따개비와 산호는 한곳에 붙어서 살아요."]
        subs = [f"{b_c('지느러미')}로 헤엄쳐요", f"{g('물갈퀴 발')}이나 {g('다리')}로 헤엄쳐요",
                f"{o('기어다니거나 걸어')} 다녀요", "한곳에 붙어서 살아요"]
        for b, s, n in zip(boxes, subs, narr):
            self.say(s, n)
            self.play(FadeIn(b[1], lag_ratio=0.15), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        c = K.text_card([f"물에 사는 동물은 {o('지느러미')}, {o('물갈퀴가 있는 발')}, {o('다리')}로 헤엄쳐 다니는 등",
                         f"{g('물에서 살기에 알맞은')} 생김새와 생활 방식을 가지고 있어요"], size=38).move_to([0, 0.6, 0])
        self.say(f"물에 사는 동물은 {g('물에서 살기에 알맞은')} 생김새를 가졌어요",
                 "물에 사는 동물은 지느러미, 물갈퀴가 있는 발, 다리로 헤엄쳐 다니는 등, 물에서 살기에 알맞은 생김새와 생활 방식을 가지고 있어요.")
        self.play(FadeIn(c, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep07/dolphin", height=4.0).move_to([-3.0, 0.6, 0])
        self.say("고등어, 돌고래가 바다에서 살기에 알맞은 특징은?", "생각해 봐요. 고등어와 돌고래가 바다에서 살기에 알맞은 특징은 무엇일까요?")
        self.play(FadeIn(ph), run_time=0.6)
        self.pause_screen(5, "몸 모양과 지느러미를 살펴봐요")
        rg = F.ring(ph, P["dolphin_body"], rx=2.1, ry=0.9)
        t = VGroup(M(f"몸이 {o('부드러운 곡선 모양')}", 36), M(f"몸에 {o('지느러미')}가 있어요", 36)).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
        t.next_to(ph, RIGHT, buff=0.4)
        self.say(f"{o('부드러운 곡선 모양')}의 몸과 {o('지느러미')}가 있어요",
                 "몸이 부드러운 곡선 모양이고, 몸에 지느러미가 있어요.")
        self.play(Create(rg), FadeIn(t, lag_ratio=0.3), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        q = K.text_card(["땅과 물을 오가며 살고, 물속에서는", f"{o('물갈퀴가 있는 발')}로 헤엄쳐 다니는 동물은?"], size=40).move_to([0, 1.7, 0])
        self.say("땅과 물을 오가며, 물갈퀴 발로 헤엄치는 동물은?",
                 "땅과 물을 오가며 살고, 물속에서는 물갈퀴가 있는 발로 헤엄쳐 다니는 동물은 어느 것일까요?")
        self.play(FadeIn(q), run_time=0.5)
        opts = ["① 붕어", "② 상어", "③ 수달", "④ 다슬기", "⑤ 돌고래"]
        ts = VGroup(*[T(s, 42) for s in opts]).arrange(RIGHT, buff=0.6).move_to([0, -0.2, 0])
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=0.8)
        self.pause_screen(5, "어느 동물일까요?")
        self.play(Circumscribe(ts[2], color=GREEN), ts[2].animate.set_color(GREEN), run_time=1.0)
        self.say(f"정답은 ③ {g('수달')}이에요", "정답은 3번 수달이에요.")
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep07/crab", width=4.2).move_to([-4.75, 0.6, 0])
        self.say(f"농게에 관한 설명으로 {g('옳은 것')} 두 가지는?", "사진 속 동물은 농게예요. 농게에 관한 설명으로 옳은 것을 두 가지 골라 볼까요?")
        opts = ["① 갯벌에 사는 동물이다.", "② 기어서 이동하는 동물이다.", "③ 다리로 걸어 다니는 동물이다.",
                "④ 몸이 털로 덮여 있는 동물이다.", "⑤ 지느러미가 있어 헤엄쳐 다니는 동물이다."]
        ts = VGroup(*[T(x, 30, INK) for x in opts]).arrange(DOWN, buff=0.24, aligned_edge=LEFT)
        ts.next_to(ph, RIGHT, buff=0.4)
        self.play(FadeIn(ph), FadeIn(ts, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(5, "옳은 것 두 가지를 골라요")
        self.play(*[ts[i].animate.set_color(GREEN) for i in (0, 2)], *[ts[i].animate.set_opacity(0.35) for i in (1, 3, 4)], run_time=0.8)
        self.say(f"정답은 {g('①, ③')} — 갯벌에 살고 다리로 걸어 다녀요",
                 "정답은 1번과 3번이에요. 농게는 갯벌에 살고, 다리가 있어 걸어 다니는 동물이에요.")
        self.settle()
        clear_stage(self)


def b_c(s):
    return f'<span foreground="{BLUE}">{s}</span>'
