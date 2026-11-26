"""「처음 배우는 과학」 3학년 9화 — 동물의 특징을 본뜬 생활용품 (3-1 2단원 동물의 생활 7차시, 화 코드 3-1-2-e)

바탕: grade3/science/sem1/u2-5.html — 도입(새의 날개·개구리의 물갈퀴·두더지의 앞다리·문어의 빨판), 흡착판(둥글고 오목, 거울에 붙음)과
물놀이용 물갈퀴(손에 착용, 먼저 도착 — 물을 더 많이 밀어 냄) 관찰, 어떤 동물?(문어의 빨판·개구리의 발),
조사 카드(수리 발→집게 차, 도마뱀부치 발→접착테이프, 산양 발굽→등산화), 교과서 속 예(두더지→굴착기, 산천어→고속 열차, 뱀→탐색구조 로봇),
좋은 점(생활을 편리하게, 생김새를 본떠 만듦), 한눈에 쏙(흡착판 = 문어 빨판), 생각+(하늘을 나는 로봇 — 새 날개 예시), 형성 평가 1·3(OX).
(짝 맞추기 놀이·수행 평가·함께 평가·형성 평가 2는 길이 때문에 뺌)
실제 그림: photos/f3ep09/ (WANT.md), 다시 씀: f3ep05/octopus, f3ep05/swallow, f3ep06/mole, f3ep07/frog
최종: TTS_SPEED=1.0 ./make_voice.sh f3ep09
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, Create, FadeIn, FadeOut, GrowArrow, Indicate, Line, Rectangle,
                   RoundedRectangle, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, SKIN, clear_stage
import kit_s3u12 as K
import firstkit as F


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "octo_arm": (780, 880),                       # f3ep05/octopus
    "swallow_wingL": (600, 300),                  # f3ep05/swallow
    "frog_web": (1210, 845),                      # f3ep07/frog
    "mole_paw": (500, 740),                       # f3ep06/mole
    "cup_rim": (650, 495), "cup_center": (930, 480),
    "glove_web": (1170, 380),
    "exc_bucket": (1700, 600),
    "masu_body": (900, 560),
    "train_nose": (330, 600),
}


def hand_side():
    palm = RoundedRectangle(corner_radius=0.18, width=0.9, height=0.7, fill_color=SKIN, fill_opacity=1, stroke_color=INK, stroke_width=3)
    fingers = VGroup(*[RoundedRectangle(corner_radius=0.08, width=0.5, height=0.15, fill_color=SKIN, fill_opacity=1, stroke_color=INK,
                                        stroke_width=3).move_to([0.6, 0.24 - 0.16 * i, 0]) for i in range(4)])
    return VGroup(fingers, palm)


class F3Ep09(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 9
    EP_TITLE = "동물의 특징을 본뜬 생활용품"
    SERIES = "처음 배우는 과학"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.wonder()
        self.observe()
        self.which()
        self.more()
        self.textbook()
        self.good()
        self.summary()
        self.check()
        self.closing(f"사람들은 {o('동물의 특징')}을 이용해 생활용품을 만들어\n우리 생활을 {g('편리하게')} 해요",
                     next_preview="처음 배우는 과학 3학년 10화 · 잎으로 식물을 분류해요")
        self.wait(0.5)

    # ── 궁금해요 ──
    def wonder(self):
        self.section("궁금해요")
        self.say("동물의 특징을 하나 가질 수 있다면?", "동물의 특징을 하나 가질 수 있다면, 어떤 것을 고르고 싶나요?")
        items = [("f3ep05/swallow", "새의 날개"), ("f3ep07/frog", "개구리의 물갈퀴"),
                 ("f3ep06/mole", "두더지의 앞다리"), ("f3ep05/octopus", "문어의 빨판")]
        grp = VGroup()
        phs = []
        for i, (k, n) in enumerate(items):
            ph = F.photo(k, width=4.4).move_to([-2.6 if i % 2 == 0 else 2.6, 1.72 if i < 2 else -0.95, 0])
            cap = F.name_tag(n, 32, INK, stroke=self.accent).move_to(ph.frame.get_bottom() + UP * 0.32)
            phs.append(ph)
            grp.add(cap)
        self.play(*[FadeIn(p) for p in phs], run_time=1.0)
        self.play(FadeIn(grp, lag_ratio=0.15), run_time=0.8)
        self.pause_screen(4, "나라면 어떤 특징을 고를까요?")
        self.say(f"우리는 {o('동물의 특징')}을 이용한 생활용품을 써요",
                 "우리는 일상생활에서 동물의 특징을 이용한 생활용품을 다양하게 사용하고 있어요. 어떤 것이 있는지 알아봐요.")
        self.settle()
        clear_stage(self)

    # ── 관찰: 흡착판·물놀이용 물갈퀴 ──
    def observe(self):
        self.section("새 낱말")
        ph = F.photo("f3ep09/suction_cup", height=5.2).move_to([0, 0.35, 0])
        self.say(f"이것은 {o('흡착판')}이에요", "이것은 흡착판이에요. 흡착판.")
        self.play(FadeIn(ph), run_time=0.7)
        rg = F.ring(ph, P["cup_center"], r=1.4)
        self.say(f"{o('흡착판')}은 둥글고 오목한 모양이에요", "흡착판은 둥글고 오목한 모양이에요.")
        self.play(Create(rg), run_time=0.7)
        self.section("관찰해요")
        self.say("거울에 눌러 붙였다가 잡아당겨 봐요", "흡착판을 거울에 눌러 붙인 다음, 잡아당겨 봐요.")
        self.pause_screen(4, "어떻게 될까요?")
        self.say(f"잡아당겨도 잘 떨어지지 않아요 — {g('거울이나 벽에 잘 붙어요')}",
                 "잡아당겨도 잘 떨어지지 않아요. 흡착판은 거울이나 벽에 잘 붙어요.")
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep09/swim_glove", height=5.2).move_to([0, 0.35, 0])
        self.say(f"손에 끼는 {o('물놀이용 물갈퀴')}예요", "이것은 손에 끼는 물놀이용 물갈퀴예요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["glove_web"], "손가락 사이 막", to=(2.6, 1.0), size=36)
        self.say(f"손가락 사이가 {o('막')}으로 이어져 있어요", "손가락 사이가 막으로 이어져 있어요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.settle()
        clear_stage(self)
        lanes = VGroup(*[Rectangle(width=11.4, height=1.6, fill_color=K.WATER, fill_opacity=0.6, stroke_color=K.WATER_D, stroke_width=3).move_to([0.7, y, 0])
                         for y in (1.4, -0.5)])
        goal = Line([5.6, 2.3, 0], [5.6, -1.4, 0], stroke_color=RED, stroke_width=6)
        h1 = hand_side().move_to([-4.3, 1.4, 0])
        glove = K.fit(K.swim_glove(), 1.0, 1.0).rotate(-np.pi / 2).move_to([-4.3, -0.5, 0])
        t1 = T("맨손", 32).move_to([-6.3, 1.4, 0])
        t2 = T("물갈퀴", 32).move_to([-6.3, -0.5, 0])
        self.say("같은 힘으로 물을 저어 헤엄쳐 봐요", "물갈퀴를 낀 손과 맨손으로, 같은 힘으로 물을 저어 봐요. 어느 쪽이 먼저 도착할까요?")
        self.play(FadeIn(lanes), Create(goal), FadeIn(h1), FadeIn(glove), FadeIn(t1), FadeIn(t2), run_time=0.8)
        self.pause_screen(4, "어느 손이 먼저 도착할까요?")
        self.play(h1.animate.shift(RIGHT * 4.0), glove.animate.shift(RIGHT * 9.3), run_time=2.2)
        self.say(f"물갈퀴를 낀 손이 {g('먼저 도착')}했어요", "물갈퀴를 낀 손이 먼저 도착했어요!")
        self.play(Indicate(glove, color=GREEN, scale_factor=1.3), run_time=0.8)
        self.say(f"물을 {o('더 많이 밀어 내')} 빠르게 헤엄칠 때 써요",
                 "물갈퀴는 손가락 사이가 막으로 이어져 있어 물을 더 많이 밀어 낼 수 있어요. 그래서 물에서 빠르게 헤엄칠 때 사용해요.")
        self.settle()
        clear_stage(self)

    # ── 어떤 동물? ──
    def which(self):
        self.section("생각해요")
        self.say("흡착판과 물갈퀴는 어떤 동물의 특징을 이용했을까요?", "흡착판과 물놀이용 물갈퀴는 어떤 동물의 특징을 이용했을까요?")
        self.pause_screen(5, "어떤 동물의 특징을 이용했을까요?")
        p1 = F.photo("f3ep09/suction_cup", width=5.2).move_to([-3.55, 0.65, 0])
        p2 = F.photo("f3ep05/octopus", width=5.2).move_to([3.55, 0.65, 0])
        ar = T("←", 64, ORANGE).move_to([0, 0.65, 0])
        a, t = F.callout(p2, P["octo_arm"], "빨판", to=(1.4, 0.9))
        self.say(f"흡착판은 {o('문어의 빨판')}을 이용했어요", "흡착판은 다른 물체에 잘 붙는 문어 빨판의 특징을 이용해 만들었어요. 빨판.")
        self.play(FadeIn(p1), FadeIn(p2), FadeIn(ar), run_time=0.8)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.settle()
        clear_stage(self)
        p1 = F.photo("f3ep09/swim_glove", width=5.2).move_to([-3.55, 0.65, 0])
        p2 = F.photo("f3ep07/frog", width=5.2).move_to([3.55, 0.65, 0])
        ar = T("←", 64, ORANGE).move_to([0, 0.65, 0])
        a, t = F.callout(p2, P["frog_web"], "물갈퀴", to=(-1.7, 0.35))
        self.say(f"물놀이용 물갈퀴는 {o('개구리의 발')}을 이용했어요",
                 "물놀이용 물갈퀴는 발가락 사이에 물갈퀴가 있어 헤엄을 잘 치는 개구리 발의 특징을 이용해 만들었어요.")
        self.play(FadeIn(p1), FadeIn(p2), FadeIn(ar), run_time=0.8)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 더 조사 ──
    def pairs(self, rows, narrs):
        grp = VGroup()
        for i, (an, af, it, itf) in enumerate(rows):
            y = 1.85 - i * 1.65
            ap = K.fit(af(), 1.5, 1.1).move_to([-5.4, y, 0])
            at = T(an, 34).move_to([-3.0, y, 0])
            ar = T("→", 48, ORANGE).move_to([-0.6, y, 0])
            ip = K.fit(itf(), 1.5, 1.1).move_to([1.5, y, 0])
            itx = T(it, 34).move_to([4.2, y, 0])
            grp.add(VGroup(ap, at, ar, ip, itx))
        for row, (sub, narr) in zip(grp, narrs):
            self.say(sub, narr)
            self.play(FadeIn(row[:2], shift=RIGHT * 0.2), run_time=0.5)
            self.play(FadeIn(row[2]), FadeIn(row[3:], shift=RIGHT * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    def more(self):
        self.section("조사해요")
        self.say(f"동물의 {o('생김새')}를 이용한 다른 생활용품도 조사해요",
                 "동물의 생김새를 중심으로, 동물의 특징을 이용한 다른 생활용품도 조사해 봐요.")
        self.pairs([("수리 발", K.eagle_foot, "집게 차", K.tongs_truck),
                    ("도마뱀부치 발", K.gecko, "접착테이프", K.tape_roll),
                    ("산양 발굽", K.goat_hoof, "등산화", K.hiking_boot)],
                   [(f"먹이를 놓치지 않는 {o('수리 발')} → {g('집게 차')}",
                     "먹이를 잘 잡고 놓치지 않는 수리 발의 특징을 이용해, 물건을 집어 옮기는 집게 차를 만들었어요."),
                    (f"벽에 잘 붙는 {o('도마뱀부치 발')} → {g('접착테이프')}",
                     "발바닥에 털이 있어 벽에 잘 붙는 도마뱀부치 발의 특징을 이용해, 접착력이 강한 접착테이프를 만들었어요."),
                    (f"미끄러지지 않는 {o('산양 발굽')} → {g('등산화')}",
                     "바위에서 잘 미끄러지지 않는 산양 발굽의 특징을 이용해 등산화를 만들었어요.")])

    def textbook(self):
        self.section("교과서 속 예")
        for (k1, k2, pk1, pk2, lab, sub, narr) in [
            ("f3ep06/mole", "f3ep09/excavator", "mole_paw", "exc_bucket", "땅을 잘 파는 앞다리",
             f"땅을 잘 파는 {o('두더지 앞다리')} → {g('굴착기')}", "땅을 잘 파는 두더지 앞다리의 특징을 이용해 굴착기를 만들었어요."),
            ("f3ep09/masu", "f3ep09/train", "masu_body", "train_nose", "부드러운 곡선 모양",
             f"부드러운 곡선 모양의 {o('산천어')} → {g('고속 열차')}", "부드러운 곡선 모양인 산천어의 생김새를 이용해 고속 열차를 만들었어요. 빠르게 달릴 수 있어요.")]:
            p1 = F.photo(k1, width=5.2).move_to([-3.55, 0.75, 0])
            p2 = F.photo(k2, width=5.2).move_to([3.55, 0.75, 0])
            c1 = F.caption(p1, k1.endswith("mole") and "두더지" or "산천어", 36)
            c2 = F.caption(p2, k2.endswith("excavator") and "굴착기" or "고속 열차", 36)
            ar = T("→", 64, ORANGE).move_to([0, 0.75, 0])
            self.say(sub, narr)
            self.play(FadeIn(p1), FadeIn(c1), run_time=0.6)
            self.play(FadeIn(ar), FadeIn(p2), FadeIn(c2), run_time=0.7)
            self.settle()
            clear_stage(self)
        sn = K.fit(K.snake(), 3.4, 1.6).move_to([-3.4, 0.6, 0])
        rb = K.fit(K.snake_robot(), 3.4, 1.6).move_to([3.4, 0.6, 0])
        c1 = T("뱀", 36).next_to(sn, DOWN, buff=0.3)
        c2 = T("탐색구조 로봇", 36).next_to(rb, DOWN, buff=0.3)
        ar = T("→", 64, ORANGE).move_to([0, 0.6, 0])
        self.say(f"가늘고 긴 {o('뱀')} → {g('탐색구조 로봇')}",
                 "가늘고 긴 뱀의 생김새를 이용한 탐색구조 로봇은 좁은 틈 사이도 자유자재로 움직일 수 있어요. 사람이 들어가기 어려운 좁은 곳에서도 움직여요.")
        self.play(FadeIn(sn), FadeIn(c1), FadeIn(ar), FadeIn(rb), FadeIn(c2), run_time=0.9)
        self.play(rb.animate.shift(RIGHT * 0.5), run_time=0.6)
        self.settle()
        clear_stage(self)

    def good(self):
        self.section("생각해요")
        q = T("동물의 특징을 이용하면 어떤 점이 좋을까요?", 46).move_to([0, 2.1, 0])
        self.say("동물의 특징을 이용하면 어떤 점이 좋을까요?", "동물의 특징을 이용하면 어떤 점이 좋을까요?")
        self.play(FadeIn(q), run_time=0.5)
        y = VGroup(K.ox_mark(True, 0.28), T("우리 생활을 편리하게 해 줘요", 44)).arrange(RIGHT, buff=0.4).move_to([0, 0.5, 0])
        n = VGroup(K.ox_mark(False, 0.28), T("동물을 잡아서 써야 해요", 44, SOFT)).arrange(RIGHT, buff=0.4).move_to([0, -0.9, 0])
        self.play(FadeIn(y), FadeIn(n), run_time=0.6)
        self.pause_screen(4, "알맞은 것은 어느 것일까요?")
        self.say(f"우리 생활을 {g('편리하게')} 해 줘요", "동물의 특징을 이용한 생활용품은 우리 생활을 편리하게 해 줘요.")
        self.play(Indicate(y, color=GREEN, scale_factor=1.06), run_time=0.8)
        self.say(f"동물을 잡는 것이 아니라 {o('생김새를 본떠')} 만들어요", "동물을 잡는 것이 아니라, 동물의 생김새를 본떠 만들어요.")
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        prs = [("문어의 빨판", "흡착판"), ("개구리 발의 물갈퀴", "물놀이용 물갈퀴"), ("땅을 잘 파는 두더지 앞다리", "굴착기"),
               ("부드러운 곡선 모양의 산천어", "고속 열차"), ("가늘고 긴 뱀의 생김새", "탐색구조 로봇"), ("먹이를 놓치지 않는 수리 발", "집게 차"),
               ("벽에 잘 붙는 도마뱀부치 발바닥", "접착테이프"), ("잘 미끄러지지 않는 산양 발굽", "등산화")]
        rows = VGroup()
        for i, (a, b) in enumerate(prs):
            y = 2.55 - i * 0.58
            rows.add(VGroup(T(a, 32, INK).move_to([-2.0, y, 0], aligned_edge=RIGHT).shift(RIGHT * 0.0),
                            T("→", 32, ORANGE).move_to([-1.3, y, 0]),
                            T(b, 32, GREEN).move_to([-0.6, y, 0], aligned_edge=LEFT)))
        for rw in rows:
            rw[0].align_to([-1.75, 0, 0], RIGHT)
        rows.move_to([0.2, 0.2, 0])
        self.say(f"{o('동물의 특징')}과 그 특징을 이용한 {g('생활용품')}을 정리해요",
                 "동물의 특징과, 그 특징을 이용한 생활용품을 한눈에 정리해 볼까요?")
        self.play(FadeIn(rows, lag_ratio=0.15), run_time=2.0)
        self.say("짝을 하나씩 읽어 봐요", "문어의 빨판은 흡착판, 개구리 발의 물갈퀴는 물놀이용 물갈퀴, 두더지 앞다리는 굴착기, 산천어는 고속 열차예요.")
        self.settle()
        clear_stage(self)
        p1 = F.photo("f3ep09/suction_cup", width=5.0).move_to([-3.3, 1.0, 0])
        p2 = F.photo("f3ep05/octopus", width=5.0).move_to([3.3, 1.0, 0])
        eq = T("←", 64, ORANGE).move_to([0, 1.0, 0])
        t = M(f"흡착판은 {o('문어')} 빨판의 특징을 이용해 만든 것이에요", 42).move_to([0, -1.5, 0])
        self.say(f"흡착판은 {o('문어')} 빨판의 특징을 이용했어요", "정리해요. 흡착판은 문어 빨판의 특징을 이용해 만든 것이에요.")
        self.play(FadeIn(p1), FadeIn(p2), FadeIn(eq), FadeIn(t), run_time=0.8)
        self.settle()
        clear_stage(self)
        q = T("하늘을 나는 로봇을 만든다면?", 48).move_to([0, 2.3, 0])
        self.say("하늘을 나는 로봇에는 어떤 동물의 특징을 이용할까요?", "하늘을 나는 로봇을 개발하려면 어떤 동물의 특징을 이용하면 좋을까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(5, "어떤 동물의 특징을 이용할까요?")
        ph = F.photo("f3ep05/swallow", height=3.9).move_to([0, -0.05, 0])
        self.say(f"예) 하늘을 날아다니는 {o('새 날개')}의 특징을 이용해요",
                 "예를 들어 하늘을 날아다니는 새 날개의 특징을 이용할 수 있어요. 여러 가지 생각이 모두 좋아요!")
        self.play(FadeIn(ph, shift=UP * 0.3), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        self.say("문어 빨판의 특징을 이용한 생활용품은?", "문어 빨판의 특징을 이용해 만든 생활용품의 예로 옳은 것은 어느 것일까요?")
        opts = ["① 로봇", "② 흡착판", "③ 등산화", "④ 굴착기", "⑤ 고속 열차"]
        ts = VGroup(*[T(s, 38) for s in opts]).arrange(RIGHT, buff=0.4).move_to([0, 0.6, 0])
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=0.8)
        self.pause_screen(5, "몇 번일까요?")
        self.play(Circumscribe(ts[1], color=GREEN), ts[1].animate.set_color(GREEN), run_time=1.0)
        self.say(f"정답은 ② {g('흡착판')}이에요", "정답은 2번 흡착판이에요. 흡착판은 다른 물체에 잘 붙는 문어 빨판의 특징을 이용했어요.")
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep09/excavator", height=3.6).move_to([0, 1.0, 0])
        self.say("굴착기를 만드는 데 이용한 동물의 이름과 특징은?", "굴착기를 만드는 데 이용한 동물의 이름과 특징을 말해 볼까요?")
        self.play(FadeIn(ph), run_time=0.6)
        self.pause_screen(5, "동물의 이름과 특징을 말해 봐요")
        ans = M(f"{o('두더지')} — {g('땅을 잘 파는 앞다리')}", 44).next_to(ph, DOWN, buff=0.35)
        self.say(f"{o('두더지')}의 {g('땅을 잘 파는 앞다리')}를 이용했어요", "두더지예요. 땅을 잘 파는 두더지 앞다리의 특징을 이용해 굴착기를 만들었어요.")
        self.play(FadeIn(ans), run_time=0.6)
        self.settle()
        clear_stage(self)
        q = K.text_card(["“고속 열차는 뱀의 생김새를 이용해 만들었다.”"], size=44).move_to([0, 1.6, 0])
        self.say("맞으면 ○, 틀리면 ×를 골라요", "맞으면 동그라미, 틀리면 가위표를 골라요. 고속 열차는 뱀의 생김새를 이용해 만들었다.")
        self.play(FadeIn(q), run_time=0.5)
        self.pause_screen(4, "○일까요, ×일까요?")
        x = K.ox_mark(False, 0.55).move_to([0, -0.1, 0])
        self.play(FadeIn(x, scale=1.4), run_time=0.5)
        t = M(f"고속 열차는 {o('산천어')}의 부드러운 곡선 모양을 이용했어요", 40).move_to([0, -1.5, 0])
        self.say(f"× — 고속 열차는 {o('산천어')}의 생김새를 이용했어요",
                 "틀린 말이에요. 고속 열차는 부드러운 곡선 모양인 산천어의 생김새를 이용했어요.")
        self.play(FadeIn(t), run_time=0.5)
        self.settle()
        clear_stage(self)
