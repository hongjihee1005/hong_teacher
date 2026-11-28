"""「과학 낱말 사전」 3학년 2학기 1단원 — 물체와 물질 (낱말 7개)

바탕: grade3/science/sem2/u1-1 ~ u1-4.html
  물체·물질(u1-1 '물체는 쓰임새와 모양이 있는 것이고, 물질은 물체를 만드는 재료예요', 캔·주걱·블록·주전자),
  물질의 성질(u1-1 결과 '물질마다 서로 다른 성질을 가지고 있어요', 도입 유리 어항, 물질 도감 금속·나무·플라스틱·유리·고무),
  고체·액체·기체(u1-3 한눈에 쏙 — 볼 수 있는지·잡을 수 있는지, 바닷가 파라솔·바닷물·공기·모래),
  부피(u1-4 '어떤 물질이 차지하는 공간의 크기', 모양이 다른 용기 ㉮㉯㉰, 한눈에 쏙 '모양과 부피가 변하지 않는 … 고체',
  기체: 공간을 차지하고 이동할 수 있음, 풍선). 성질 비교표의 기체 부피 칸은 앱이 '4학년 때 더 배워요'라서 말하지 않음.
실제 그림: photos/w3u21/ (WANT.md, 그림이 들어오면 P를 맞춤)
미리보기: MEDIA=media_p/w3u21 ./render.sh w3u21 preview
최종: TTS_SPEED=1.0 ./make_voice.sh w3u21
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, PI, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, Line, RoundedRectangle,
                   ValueTracker, VGroup, always_redraw)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u21 as K
import firstkit as F
from kit_w3u2 import WordScene, text_card

S_COL = {"고체": "#B9834E", "액체": "#2F7FC1", "기체": "#7A4FB0"}


def st_tag(s, size=34):
    t = T(s, size, PAPER)
    bx = RoundedRectangle(corner_radius=0.15, width=t.width + 0.4, height=t.height + 0.26, fill_color=S_COL[s],
                          fill_opacity=1, stroke_width=0)
    t.move_to(bx)
    return VGroup(bx, t)


# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "spatula": (215, 560), "teapot": (690, 520), "can": (1200, 520), "block": (1640, 560),
    "bowl_glass": (960, 420), "bowl_fish": (980, 520),
    "hammer": (260, 650), "board": (640, 700), "cup": (1000, 560), "toy": (1330, 680), "boots": (1680, 600),
    "sand": (700, 900), "umbrella": (980, 330), "sea": (1500, 600), "sky": (420, 160),
    "balloons": (960, 450),
}


class W3U21(WordScene):
    UNIT = 1
    EP_TITLE = "물체와 물질"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.today(["물체", "물질", "물질의 성질", "고체", "액체", "기체", "부피"],
                   "오늘은 물체와 물질 단원의 낱말 일곱 개를 배워요. 물체, 물질, 물질의 성질, 고체, 액체, 기체, 부피예요.")
        self.w_object()
        self.w_matter()
        self.w_property()
        self.w_solid()
        self.w_liquid()
        self.w_gas()
        self.compare_states()
        self.w_volume()
        self.quiz([
            (["물체를 만드는 재료"], "ㅁㅈ", "물질",
             "물체를 만드는 재료를 무엇이라고 할까요?", "정답은 물질이에요. 물체를 만드는 재료가 물질이에요."),
            (["담는 용기에 관계없이", "모양과 부피가 변하지 않는 물질의 상태"], "ㄱㅊ", "고체",
             "담는 용기에 관계없이 모양과 부피가 변하지 않는 물질의 상태는 무엇일까요?", "정답은 고체예요."),
            (["대부분 눈으로 볼 수 없고,", "손으로 잡을 수도 없는 물질의 상태"], "ㄱㅊ", "기체",
             "대부분 눈으로 볼 수 없고, 손으로 잡을 수도 없는 물질의 상태는 무엇일까요?", "정답은 기체예요. 공기가 기체예요."),
            (["어떤 물질이 차지하는 공간의 크기"], "ㅂㅍ", "부피",
             "어떤 물질이 차지하는 공간의 크기를 무엇이라고 할까요?", "정답은 부피예요."),
        ])
        self.closing(f"{o('물체')}는 {o('물질')}로 만들고,\n물질은 {g('고체 · 액체 · 기체')} 상태로 있어요",
                     next_preview="과학 낱말 사전 3학년 · 지구와 바다")
        self.wait(0.5)

    # ── 1. 물체 ──
    def w_object(self):
        self.word_intro(1, "물체", ["쓰임새와 모양이 있는 것"],
                        "첫 번째 낱말은 물체예요. 물체.", "물체는 쓰임새와 모양이 있는 것이에요.")
        ph = F.photo("w3u21/things", height=4.5).move_to([0, 0.05, 0])
        self.play(FadeIn(ph), run_time=0.7)
        cs = [F.callout(ph, P["spatula"], "주걱", to=(-0.6, 1.3)), F.callout(ph, P["teapot"], "주전자", to=(-0.2, 1.4)),
              F.callout(ph, P["can"], "캔", to=(0.3, 1.4)), F.callout(ph, P["block"], "블록", to=(0.6, 1.3))]
        self.play(*[GrowArrow(a) for a, _ in cs], run_time=0.6)
        self.say(f"주걱, 주전자, 캔, 블록은 모두 {o('물체')}예요",
                 "주걱, 주전자, 캔, 블록은 모두 쓰임새와 모양이 있는 물체예요.")
        self.play(*[FadeIn(t) for _, t in cs], run_time=0.5)
        self.settle()
        self.ph_things = ph
        self.repeat("물체")

    # ── 2. 물질 ──
    def w_matter(self):
        self.word_intro(2, "물질", ["물체를 만드는 재료"],
                        "두 번째 낱말은 물질이에요. 물질.", "물질은 물체를 만드는 재료예요.")
        ph = F.photo("w3u21/things", height=4.5).move_to([0, 0.05, 0])
        self.play(FadeIn(ph), run_time=0.6)
        mats = [("spatula", "나무"), ("teapot", "유리"), ("can", "금속"), ("block", "플라스틱")]
        tags = VGroup()
        for key, m in mats:
            tg = K.mat_tag(m, 30)
            tg.move_to(ph.at(*P[key]) + np.array([0, 1.25, 0]))
            tags.add(tg)
        self.say(f"주걱은 {o('나무')}, 주전자는 {o('유리')}", "주걱은 나무로, 주전자는 유리로 만들었어요.")
        self.play(FadeIn(tags[0], shift=DOWN * 0.2), FadeIn(tags[1], shift=DOWN * 0.2), run_time=0.6)
        self.say(f"캔은 {o('금속')}, 블록은 {o('플라스틱')}", "캔은 금속으로, 블록은 플라스틱으로 만들었어요.")
        self.play(FadeIn(tags[2], shift=DOWN * 0.2), FadeIn(tags[3], shift=DOWN * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self, keep=(self.head,))
        # 물체와 물질 나란히
        hd = VGroup(T("물체", 44, self.accent), T("물질", 44, ORANGE)).arrange(RIGHT, buff=3.6).move_to([0, 1.75, 0])
        rows = VGroup()
        for i, (a, m) in enumerate([("캔", "금속"), ("주걱", "나무"), ("블록", "플라스틱"), ("주전자", "유리")]):
            y = 0.95 - i * 0.78
            rows.add(VGroup(T(a, 40).move_to([hd[0].get_x(), y, 0]),
                            T("→", 40, SOFT).move_to([0, y, 0]),
                            T(m, 40).move_to([hd[1].get_x(), y, 0])))
        line = Line([-4.2, 1.35, 0], [4.2, 1.35, 0], stroke_color=SOFT, stroke_width=3)
        self.play(FadeOut(self.head), run_time=0.3)
        self.say(f"{o('물체')}는 쓰임새와 모양, {o('물질')}은 재료",
                 "캔이라는 물체는 금속이라는 물질로 만들었어요.")
        self.play(FadeIn(hd), Create(line), FadeIn(rows, lag_ratio=0.2), run_time=1.2)
        self.head = None
        self.say(f"다시 한번, {o('물질')}", "다시 한번 말해 봐요. 물질.")
        self.settle()
        clear_stage(self)

    # ── 3. 물질의 성질 ──
    def w_property(self):
        self.word_intro(3, "물질의 성질", ["물질마다 서로 다른 성질을 가지고 있어요"],
                        "세 번째 낱말은 물질의 성질이에요. 물질의 성질.",
                        "물질마다 서로 다른 성질을 가지고 있어요.", head_size=52)
        ph = F.photo("w3u21/fishbowl", height=4.5).move_to([0, 0.05, 0])
        self.say(f"{o('유리')}는 투명해요", "유리로 만든 어항이에요. 유리는 투명해서 안에 있는 물고기가 잘 보여요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["bowl_fish"], "투명한 유리", to=(3.2, 0.9))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.say("어항을 나무로 만들면 안이 보이지 않아요", "어항을 나무로 만들면 안이 보이지 않아요.")
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("w3u21/materials", width=7.4).move_to([-2.85, 0.05, 0])
        self.play(FadeIn(ph), run_time=0.6)
        items = [("hammer", "금속", "단단해요"), ("board", "나무", "대부분 물에 떠요"), ("cup", "유리", "투명해요"),
                 ("toy", "플라스틱", "가볍고 색깔이 다양해요"), ("boots", "고무", "잘 미끄러지지 않아요")]
        rows = VGroup()
        for _, m, d in items:
            rows.add(VGroup(K.mat_tag(m, 30), T(d, 30)).arrange(RIGHT, buff=0.2))
        rows.arrange(DOWN, buff=0.28, aligned_edge=LEFT).move_to([4.15, 0.05, 0])
        if rows.width > 5.6:
            rows.scale_to_fit_width(5.6)
        nar = [("금속은 단단하고, 나무는 대부분 물에 떠요",
                "금속은 단단해서 망치의 머리 부분을 만들어요. 나무는 대부분 물에 떠요.", (0, 1)),
               ("유리는 투명하고, 플라스틱은 가벼워요",
                "유리는 투명하지만 깨지기 쉬워요. 플라스틱은 가볍고 색깔과 모양을 다양하게 만들 수 있어요.", (2, 3)),
               ("고무는 잘 미끄러지지 않아요", "고무는 잘 늘어났다가 원래대로 돌아오고, 잘 미끄러지지 않아요.", (4,))]
        for sub, n, ks in nar:
            self.say(sub, n)
            anims = []
            for k in ks:
                anims += [FadeIn(rows[k], shift=LEFT * 0.2), Create(F.ring(ph, P[items[k][0]], r=0.42))]
            self.play(*anims, run_time=0.7)
        self.settle()
        self.repeat("물질의 성질")

    # ── 4. 고체 ──
    def w_solid(self):
        self.word_intro(4, "고체", ["눈으로 볼 수 있고, 손으로 잡을 수 있어요"],
                        "네 번째 낱말은 고체예요. 고체.", "고체는 눈으로 볼 수 있고, 손으로 잡을 수 있어요.")
        ph = F.photo("w3u21/beach", height=4.5).move_to([0, 0.05, 0])
        self.ph_beach = ph
        self.say("바닷가에서 고체를 찾아봐요", "바닷가에서 고체를 찾아볼까요?")
        self.play(FadeIn(ph), run_time=0.7)
        a1, t1 = F.callout(ph, P["umbrella"], "파라솔", to=(-2.2, 0.3))
        a2, t2 = F.callout(ph, P["sand"], "모래", to=(-2.0, 0.4))
        tg = VGroup(st_tag("고체", 30).next_to(t1, RIGHT, buff=0.12), st_tag("고체", 30).next_to(t2, RIGHT, buff=0.12))
        self.say(f"파라솔과 모래는 {o('고체')}예요",
                 "파라솔과 모래는 고체예요. 모래는 알갱이마다 모양이 정해져 있어서 고체예요.")
        self.play(GrowArrow(a1), GrowArrow(a2), FadeIn(t1), FadeIn(t2), run_time=0.7)
        self.play(FadeIn(tg), run_time=0.4)
        self.say(f"담는 용기가 바뀌어도 {g('모양과 부피가 그대로')}",
                 "고체는 담는 용기에 관계없이 모양과 부피가 변하지 않아요.")
        self.settle()
        self.repeat("고체")

    # ── 5. 액체 ──
    def w_liquid(self):
        self.word_intro(5, "액체", ["눈으로 볼 수 있지만, 손으로 잡을 수 없어요"],
                        "다섯 번째 낱말은 액체예요. 액체.", "액체는 눈으로 볼 수 있지만, 손으로 잡을 수 없어요.")
        ph = F.photo("w3u21/beach", height=4.5).move_to([0, 0.05, 0])
        self.play(FadeIn(ph), run_time=0.6)
        a, t = F.callout(ph, P["sea"], "바닷물", to=(-1.2, -1.1))
        tg = st_tag("액체", 30).next_to(t, RIGHT, buff=0.12)
        self.say(f"바닷물은 {o('액체')}예요", "바닷가에서 바닷물은 액체예요.")
        self.play(GrowArrow(a), FadeIn(t), FadeIn(tg), run_time=0.7)
        self.settle()
        clear_stage(self, keep=(self.head,))
        names = ["물", "주스", "우유", "꿀"]
        pics = [lambda: K.drink_glass(K.WATER, 0.7), lambda: K.drink_glass(K.JUICE, 0.7), K.milk_bottle, K.honey]
        cs = VGroup()
        for n, fn in zip(names, pics):
            box = RoundedRectangle(corner_radius=0.2, width=2.6, height=2.6, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=S_COL["액체"], stroke_width=4)
            p = K.fit(fn(), 1.4, 1.4).move_to(box.get_center() + UP * 0.3)
            cs.add(VGroup(box, p, T(n, 36).move_to(box.get_center() + DOWN * 0.85)))
        cs.arrange(RIGHT, buff=0.4).move_to([0, 0.2, 0])
        self.say(f"물, 주스, 우유, 꿀도 {o('액체')}", "물, 주스, 우유, 꿀도 액체예요. 흐르는 성질이 있어요.")
        self.play(FadeIn(cs, lag_ratio=0.15), run_time=1.0)
        self.say(f"담는 용기에 따라 {o('모양은 변하지만')} {g('부피는 변하지 않아요')}",
                 "액체는 담는 용기에 따라 모양은 변하지만, 부피는 변하지 않아요.")
        self.settle()
        self.repeat("액체")

    # ── 6. 기체 ──
    def w_gas(self):
        self.word_intro(6, "기체", ["대부분 눈으로 볼 수 없고, 손으로 잡을 수도 없어요"],
                        "여섯 번째 낱말은 기체예요. 기체.", "기체는 대부분 눈으로 볼 수 없고, 손으로 잡을 수도 없어요.")
        ph = F.photo("w3u21/beach", height=4.5).move_to([0, 0.05, 0])
        self.play(FadeIn(ph), run_time=0.6)
        dots = K.air_dots(-3.6, 3.6, 0.9, 2.1, n=40, seed=4, r=0.07).set_color(S_COL["기체"])
        t = F.name_tag("공기 (눈에 보이지 않아요)", 32, INK, stroke=S_COL["기체"]).move_to([0, 0.35, 0])
        self.say(f"바닷가의 공기는 {o('기체')}예요", "바닷가에는 눈에 보이지 않는 공기가 있어요. 공기는 기체예요.")
        self.play(FadeIn(dots, lag_ratio=0.02), FadeIn(t), run_time=0.9)
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("w3u21/balloons", height=4.5).move_to([0, 0.05, 0])
        self.say(f"기체는 {o('공간을 차지')}해요",
                 "여러 가지 모양의 풍선이에요. 풍선 안을 공기가 가득 채워 여러 모양을 만들어요. 공기가 공간을 차지하기 때문이에요.")
        self.play(FadeIn(ph), run_time=0.7)
        self.say(f"기체는 공간을 차지하고 {o('이동할 수 있어요')}", "기체는 공간을 차지하고, 이동할 수 있어요.")
        self.settle()
        self.repeat("기체")

    # ── 고체·액체·기체 나란히 ──
    def compare_states(self):
        self.section("견주어 봐요")
        rows = [("눈으로 볼 수 있나요?", ["○", "○", "대부분 ×"]),
                ("손으로 잡을 수 있나요?", ["○", "×", "×"]),
                ("담는 용기에 따라 모양이 변하나요?", ["×", "○", "○"]),
                ("공간을 차지하나요?", ["○", "○", "○"])]
        cw = [6.2, 2.1, 2.1, 2.4]
        x0 = -sum(cw) / 2
        y0, rh = 2.35, 0.95
        grp = VGroup()
        for j, s in enumerate(["고체", "액체", "기체"]):
            grp.add(st_tag(s, 34).move_to([x0 + sum(cw[:j + 1]) + cw[j + 1] / 2, y0, 0]))
        cells = []
        for i, (q, vals) in enumerate(rows):
            y = y0 - (i + 1) * rh
            line = Line([x0, y + rh / 2, 0], [x0 + sum(cw), y + rh / 2, 0], stroke_color=SOFT, stroke_width=3)
            qq = T(q, 32).move_to([x0 + 0.1, y, 0], aligned_edge=LEFT)
            cs = VGroup()
            for j, v in enumerate(vals):
                x = x0 + sum(cw[:j + 1]) + cw[j + 1] / 2
                col = GREEN if v == "○" else RED
                cs.add(T(v, 40 if len(v) == 1 else 30, col).move_to([x, y, 0]))
            grp.add(line, qq)
            cells.append(cs)
        self.say(f"{o('고체 · 액체 · 기체')}를 나란히 견주어요", "고체, 액체, 기체를 나란히 견주어 볼까요?")
        self.play(FadeIn(grp, lag_ratio=0.05), run_time=1.0)
        self.say("볼 수 있는지, 잡을 수 있는지", "고체와 액체는 눈으로 볼 수 있고, 기체는 대부분 볼 수 없어요. 손으로 잡을 수 있는 것은 고체뿐이에요.")
        self.play(FadeIn(cells[0]), FadeIn(cells[1]), run_time=0.6)
        self.say(f"모양은 액체와 기체가 바뀌지만, 셋 모두 {g('공간을 차지해요')}",
                 "담는 용기에 따라 액체와 기체는 모양이 변해요. 그리고 셋 모두 공간을 차지해요.")
        self.play(FadeIn(cells[2]), FadeIn(cells[3]), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 7. 부피 ──
    def w_volume(self):
        self.word_intro(7, "부피", ["어떤 물질이 차지하는 공간의 크기"],
                        "마지막 일곱 번째 낱말은 부피예요. 부피.", "부피는 어떤 물질이 차지하는 공간의 크기예요.")
        V = K.three_vessels(xs=(-4.4, 0.0, 4.4), base=-2.25)
        outs = VGroup(*[v.outline() for v in V])
        labs = VGroup(*[T(n, 36).move_to([v.cx, 1.35, 0]) for n, v in zip(["㉮", "㉯", "㉰"], V)])
        self.play(FadeIn(outs), FadeIn(labs), run_time=0.6)
        vols = [ValueTracker(0.0) for _ in range(3)]
        VOL = 1.95
        liq = always_redraw(lambda: VGroup(*[V[i].liquid(vols[i].get_value(), K.WATER, 0.75) for i in range(3)]))
        self.add(liq)
        self.bring_to_front(outs)
        self.say("물을 ㉮에 담고 높이를 표시해요", "모양이 다른 용기 세 개가 있어요. 물을 용기 가에 담고 높이를 표시해요.")
        self.play(vols[0].animate.set_value(VOL), run_time=1.0)
        hy = V[0].y(V[0].level(VOL))
        mark = VGroup(Line([V[0].cx - 0.75, hy, 0], [V[0].cx + 0.75, hy, 0], stroke_color=INK, stroke_width=6),
                      T("처음 높이", 26).move_to([V[0].cx + 1.35, hy + 0.3, 0]))
        self.play(Create(mark), run_time=0.5)

        def pour(i, j, rt=1.3):
            a = np.array([V[i].cx, V[i].y(V[i].H) + 0.1, 0])
            b2 = np.array([V[j].cx, V[j].y(V[j].H) + 0.1, 0])
            st = K.smooth([tuple(a[:2]), ((a[0] + b2[0]) / 2, max(a[1], b2[1]) + 1.0), tuple(b2[:2])], K.WATER_D, 8)
            self.play(Create(st), run_time=0.3)
            self.play(vols[i].animate.set_value(0.0), vols[j].animate.set_value(VOL), run_time=rt)
            self.play(FadeOut(st), run_time=0.2)
        self.say(f"㉯, ㉰로 옮기면 {o('모양이 바뀌어요')}", "물을 용기 나, 다로 옮기면 물의 모양이 바뀌어요.")
        pour(0, 1)
        pour(1, 2)
        self.say(f"다시 ㉮로 옮기면 {g('처음 높이와 같아요')}",
                 "다시 용기 가로 옮기면 물의 높이가 처음과 같아요. 물이 차지하는 공간의 크기, 부피는 변하지 않았어요.")
        pour(2, 0)
        self.play(Indicate(mark, color=GREEN), run_time=0.9)
        self.settle()
        self.repeat("부피")


class w3u21(W3U21):
    """render.sh가 폴더 이름을 장면 이름으로 넘기므로 같은 장면을 이 이름으로도 둠"""
    pass
