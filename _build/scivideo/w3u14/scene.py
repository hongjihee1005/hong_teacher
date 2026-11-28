"""「과학 낱말 사전」 3학년 1학기 4단원 — 생물의 한살이

바탕(앱 문장): grade3/science/sem1/u4-1('동물이 태어나고 자라서 자손을 남기는 과정을 동물의 한살이라고 해요', 한눈에 쏙),
u4-2(관찰 일지: 알 '길쭉하고 주름진 옥수수 모양이고, 노란색이며, 크기는 약 1 mm예요. 움직이지 않아요',
애벌레 '긴 원통 모양이고 마디가 있으며, 허물을 네 번 벗으면서 커져요. 기어서 움직이고 잎을 갉아 먹어요',
번데기 '한곳에 붙어 있고 이동하지 않아요', '주변과 비슷한 색깔로 변해요', 어른벌레 '몸이 머리, 가슴, 배로 구분되고 날개 두 쌍과 다리 세 쌍이 있어요',
한눈에 쏙 알-애벌레-번데기-어른벌레), u4-4('식물의 씨가 싹 트고 자라 꽃이 피고 열매를 맺어 다시 씨를 만드는 과정을 식물의 한살이라고 해요',
한눈에 쏙 '씨가 싹 트려면 물과 알맞은 온도가 필요합니다', 생각 바로잡기 빛), u4-5(한눈에 쏙 '적당한 양의 물과 햇빛',
'물이 부족하면 식물이 시들고', '색깔이 연해지며 줄기가 가늘고 약하게 자라요'), u4-6('알을 낳는 동물의 한살이는 알에서 시작해요',
'새끼를 낳는 동물의 한살이는 어미가 낳은 새끼에서 시작해요. 새끼는 어미와 모습이 비슷해요', 돌고래), u4-7(한해살이식물·여러해살이식물 뜻, 한눈에 쏙,
'풀 중에도 여러해살이식물이 있어요', 형성 평가 감나무·비비추).
앱에 뜻 문장이 없어 새로 쓴 것: 없음(낱말 이름표 '싹 트기'·'자라는 조건'은 앱 문장을 줄인 것).
실제 그림: photos/w3u14/ (WANT.md), 다시 씀: f3ep07/frog·duck·dolphin, f3ep05/rabbit
미리보기: MEDIA=media_p/w3u14 ./render.sh w3u14 preview
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, CurvedArrow, FadeIn, FadeOut, GrowArrow, Indicate, Line, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u14 as K
import firstkit as F
from wordkit import WordScene, PH_Y, PH_H


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "egg": (960, 480),
    "larva_body": (650, 520),
    "pupa_body": (960, 430),
    "adult_wing": (640, 370), "adult_ant": (1250, 330),
    "sprout": (960, 500),
}


class W3U14(WordScene):
    GRADE, SEM, UNIT = 3, 1, 4
    EP_TITLE = "생물의 한살이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.today(["한살이", "알", "애벌레", "번데기", "어른벌레", "싹 트기", "자라는 조건",
                    "알을 낳는 동물", "새끼를 낳는 동물", "한해살이식물", "여러해살이식물"],
                   "오늘 배울 낱말은 한살이, 알, 애벌레, 번데기, 어른벌레, 싹 트기, 자라는 조건, 알을 낳는 동물, 새끼를 낳는 동물, 한해살이식물, 여러해살이식물이에요.",
                   cols=4)
        self.w_cycle()
        self.w_stage(2, "알", "bf_egg",
                     [f"배추흰나비알은 길쭉하고 주름진 {o('옥수수 모양')}이에요", "노란색이고, 크기는 약 1 mm예요. 움직이지 않아요"],
                     f"옥수수 모양의 노란 {o('알')}",
                     "배추흰나비알은 길쭉하고 주름진 옥수수 모양이고, 노란색이며, 크기는 약 1 mm예요. 움직이지 않아요. 알.",
                     "egg", "알")
        self.w_stage(3, "애벌레", "bf_larva",
                     [f"긴 원통 모양이고 마디가 있으며, {o('허물')}을 네 번 벗으면서 커져요",
                      "기어서 움직이고 잎을 갉아 먹어요"],
                     f"허물을 벗으며 커지는 {o('애벌레')}",
                     "애벌레는 긴 원통 모양이고 마디가 있으며, 허물을 네 번 벗으면서 커져요. 기어서 움직이고 잎을 갉아 먹어요. 애벌레.",
                     "larva_body", "애벌레")
        self.w_stage(4, "번데기", "bf_pupa",
                     [f"{o('번데기')}는 한곳에 붙어 있고 {o('이동하지 않아요')}",
                      "점차 주변과 비슷한 색깔로 변해요"],
                     f"한곳에 붙어 이동하지 않는 {o('번데기')}",
                     "번데기는 한곳에 붙어 있고 이동하지 않아요. 점차 주변과 비슷한 색깔로 변해요. 번데기.",
                     "pupa_body", "번데기")
        self.w_stage(5, "어른벌레", "bf_adult",
                     [f"몸이 {o('머리, 가슴, 배')}로 구분되고", f"{o('날개 두 쌍')}과 {o('다리 세 쌍')}이 있어요. 날개를 움직여 날아다녀요"],
                     f"날개 두 쌍, 다리 세 쌍의 {o('어른벌레')}",
                     "어른벌레는 몸이 머리, 가슴, 배로 구분되고 날개 두 쌍과 다리 세 쌍이 있어요. 날개를 움직여 날아다녀요. 어른벌레.",
                     "adult_wing", "날개")
        self.w_sprout()
        self.w_grow()
        self.w_egg_baby()
        self.w_annual()
        self.quiz([
            (["동물이 태어나고 자라서 자손을 남기는 과정"], ["번데기", "한살이", "싹 트기", "애벌레"], 1,
             "정답은 2번, 한살이예요."),
            (["허물을 네 번 벗으면서 커지고, 잎을 갉아 먹어요"], ["알", "번데기", "애벌레", "어른벌레"], 2,
             "정답은 3번, 애벌레예요."),
            (["한 해 동안 한살이를 마치고 죽는 식물"], ["여러해살이식물", "한해살이식물", "나무", "씨"], 1,
             "정답은 2번, 한해살이식물이에요. 봉숭아가 한해살이식물이에요."),
            (["한살이가 어미가 낳은 새끼에서 시작하는 동물"], ["알을 낳는 동물", "새끼를 낳는 동물", "번데기", "어른벌레"], 1,
             "정답은 2번, 새끼를 낳는 동물이에요. 토끼, 개, 돌고래가 새끼를 낳아요."),
        ])
        self.closing(f"{o('한살이')}는 태어나고 자라서 자손을 남기는 과정\n생물에 따라 한살이가 {g('다양해요')}",
                     next_preview="과학 낱말 사전 3학년 · 물체와 물질")
        self.wait(0.5)

    # ── 1 한살이 ──
    def w_cycle(self):
        self.word(1, "한살이", [f"동물이 태어나고 자라서 {o('자손을 남기는')} 과정을 동물의 {o('한살이')}라고 해요"],
                  f"태어나고 자라서 자손을 남기는 과정 = {o('한살이')}",
                  "동물이 태어나고 자라서 자손을 남기는 과정을 동물의 한살이라고 해요. 한살이.", size=38)
        self.drop_card()
        pos = [np.array([-4.0, 0.9, 0]), np.array([-1.3, 0.9, 0]), np.array([1.4, 0.9, 0]), np.array([4.1, 0.9, 0])]
        pics = [K.bf_egg(0.9), K.caterpillar(2.0), K.pupa(1.4), K.butterfly(0.75)]
        names = ["알", "애벌레", "번데기", "어른벌레"]
        grp = VGroup()
        for p, pic, nm in zip(pos, pics, names):
            if pic.width > 2.0:
                pic.scale_to_fit_width(2.0)
            if pic.height > 1.6:
                pic.scale_to_fit_height(1.6)
            pic.move_to(p)
            t = F.name_tag(nm, 38, INK, stroke=self.accent).move_to(p + DOWN * 1.35)
            grp.add(VGroup(pic, t))
        arrs = VGroup(*[F.arrow(pos[i] + RIGHT * 0.95 + DOWN * 1.35, pos[i + 1] + LEFT * 0.95 + DOWN * 1.35) for i in range(3)])
        back = CurvedArrow(pos[3] + DOWN * 2.0, pos[0] + DOWN * 2.0, angle=-0.35, color=ORANGE, stroke_width=6)
        self.say(f"배추흰나비: {o('알')} → {o('애벌레')} → {o('번데기')} → {o('어른벌레')}",
                 "배추흰나비의 한살이는 알, 애벌레, 번데기, 어른벌레의 순으로 이루어져요.")
        for i in range(4):
            self.play(FadeIn(grp[i]), *([GrowArrow(arrs[i - 1])] if i else []), run_time=0.5)
        self.say(f"어른벌레가 알을 낳아 한살이가 {g('다시 이어져요')}", "어른벌레는 짝짓기를 한 뒤에 알을 낳아요. 한살이가 다시 이어져요.")
        self.play(Create(back), run_time=0.8)
        self.settle()
        clear_stage(self, keep=(self.head,))
        c = __import__("wordkit").text_card([f"식물의 씨가 싹 트고 자라 꽃이 피고 열매를 맺어",
                                             f"다시 씨를 만드는 과정을 {o('식물의 한살이')}라고 해요"], size=40).move_to([0, 0.3, 0])
        self.say(f"식물에도 {o('한살이')}가 있어요",
                 "식물의 씨가 싹 트고 자라 꽃이 피고 열매를 맺어 다시 씨를 만드는 과정을 식물의 한살이라고 해요.")
        self.play(FadeIn(c), run_time=0.6)
        self.word_end()

    # ── 2~5 알·애벌레·번데기·어른벌레 ──
    def w_stage(self, n, word, key, meaning, sub, narr, pk, label):
        self.word(n, word, meaning, sub, narr, size=40)
        self.drop_card()
        ph = F.photo(f"w3u14/{key}", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"배추흰나비의 {o(word)}", f"배추흰나비의 {word}를 살펴봐요." if word[-1] in "이기레" else f"배추흰나비의 {word}을 살펴봐요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P[pk], label, to=(2.4, 1.0))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.5)
        self.word_end()

    # ── 6 싹 트기 ──
    def w_sprout(self):
        self.word(6, "싹 트기", [f"씨가 싹 트려면 {o('물')}과 {o('알맞은 온도')}가 필요해요"],
                  f"싹 트려면 {o('물')}과 {o('알맞은 온도')}",
                  "씨가 싹 트려면 물과 알맞은 온도가 필요해요. 싹 트기.")
        self.drop_card()
        c1 = K.seed_cup(True, 2, 1.0).move_to([-3.2, -1.9, 0], aligned_edge=DOWN)
        c2 = K.seed_cup(False, 0, 1.0).move_to([0.0, -1.9, 0], aligned_edge=DOWN)
        t1 = T("물을 담은 컵", 32).next_to(c1, UP, buff=0.2)
        t2 = T("물을 담지 않은 컵", 32).next_to(c2, UP, buff=0.2)
        self.say(f"물을 담은 컵의 무씨만 {g('싹이 텄어요')}", "물을 담은 컵의 무씨는 싹이 트고, 물을 담지 않은 컵의 무씨는 싹이 트지 않았어요.")
        self.play(FadeIn(c1), FadeIn(c2), FadeIn(t1), FadeIn(t2), run_time=0.8)
        ph = F.photo("w3u14/radish_sprout", width=4.6).move_to([4.3, 0.0, 0])
        self.say(f"씨가 싹 트려면 빛이 꼭 필요할까요? {r('아니에요')}",
                 "씨가 싹 트려면 빛이 꼭 필요할까요? 아니에요. 보통 씨는 빛이 있든 없든 싹이 터요. 어두운 흙 속에서도 싹이 트지요.")
        self.play(FadeIn(ph), run_time=0.6)
        self.word_end()

    # ── 7 자라는 조건 ──
    def w_grow(self):
        self.word(7, "자라는 조건", [f"식물이 잘 자라려면 {o('적당한 양의 물')}과 {o('햇빛')}이 필요해요"],
                  f"잘 자라려면 {o('적당한 양의 물')}과 {o('햇빛')}",
                  "식물이 잘 자라려면 적당한 양의 물과 햇빛이 필요해요. 자라는 조건.")
        self.drop_card()
        pots = [("good", "물과 햇빛", GREEN), ("wilt", "물이 부족하면", RED), ("pale", "햇빛이 없으면", RED)]
        grp = VGroup()
        for i, (st, nm, col) in enumerate(pots):
            kp = K.kale_pot(st, 1.0).move_to([-4.2 + i * 4.2, -1.35, 0], aligned_edge=DOWN)
            t = F.name_tag(nm, 34, INK, stroke=col).next_to(kp, DOWN, buff=0.15)
            grp.add(VGroup(kp, t))
        self.say(f"물과 햇빛이 있으면 {g('잘 자라요')}", "물과 햇빛이 있으면 잎이 커지고 줄기가 굵게 잘 자라요.")
        self.play(FadeIn(grp[0]), run_time=0.6)
        self.say(f"물이 부족하면 {r('시들고')} 잘 자라지 않아요", "물이 부족하면 식물이 시들고 잘 자라지 않아요.")
        self.play(FadeIn(grp[1]), run_time=0.6)
        self.say(f"햇빛이 없으면 색이 {r('연해지고')} 줄기가 가늘어요",
                 "햇빛이 없으면 색깔이 연해지며 줄기가 가늘고 약하게 자라요.")
        self.play(FadeIn(grp[2]), run_time=0.6)
        self.word_end()

    # ── 8·9 알을 낳는 동물 · 새끼를 낳는 동물 (헷갈리는 짝) ──
    def w_egg_baby(self):
        self.word(8, "알을 낳는 동물", [f"{o('알을 낳는 동물')}의 한살이는 {o('알')}에서 시작해요",
                                        f"{b_('새끼를 낳는 동물')}의 한살이는 어미가 낳은 {b_('새끼')}에서 시작해요"],
                  f"한살이가 {o('알')}에서? {b_('새끼')}에서?",
                  "알을 낳는 동물의 한살이는 알에서 시작해요. 새끼를 낳는 동물의 한살이는 어미가 낳은 새끼에서 시작하고, 새끼는 어미와 모습이 비슷해요.",
                  title_narr="알을 낳는 동물과 새끼를 낳는 동물.", size=38)
        self.section("낱말 8·9")
        self.drop_card()
        self.play(FadeOut(self.head), run_time=0.3)
        h1 = F.name_tag("알을 낳는 동물", 44, INK, stroke=ORANGE).move_to([-3.4, 1.95, 0])
        h2 = F.name_tag("새끼를 낳는 동물", 44, INK, stroke=BLUE).move_to([3.4, 1.95, 0])
        ims = [("f3ep07/frog", "개구리", -4.95), ("f3ep07/duck", "오리", -1.85), ("f3ep05/rabbit", "토끼", 1.85), ("f3ep07/dolphin", "돌고래", 4.95)]
        grp = VGroup()
        phs = []
        for k, nm, x in ims:
            ph = F.photo(k, width=3.0).move_to([x, 0.05, 0])
            cap = F.caption(ph, nm, 34)
            phs.append(ph)
            grp.add(cap)
        self.say(f"개구리·오리는 {o('알')}, 토끼·돌고래는 {b_('새끼')}를 낳아요",
                 "개구리는 물속에 알을 낳고, 다 자란 암컷 오리도 알을 낳아요. 토끼와 돌고래는 새끼를 낳아요.")
        self.play(FadeIn(h1), FadeIn(h2), run_time=0.5)
        self.play(*[FadeIn(p) for p in phs], FadeIn(grp), run_time=0.9)
        self.say(f"돌고래는 물속에 살지만 {b_('새끼')}를 낳아요", "돌고래는 물속에 살지만 새끼를 낳아요. 알을 낳는 동물, 새끼를 낳는 동물.")
        self.play(Indicate(phs[3].frame, color=BLUE, scale_factor=1.05), run_time=0.8)
        self.word_end()

    # ── 10·11 한해살이식물 · 여러해살이식물 (헷갈리는 짝) ──
    def w_annual(self):
        self.word(10, "한해살이식물", [f"한 해 동안 한살이를 마치고 죽는 식물 → {o('한해살이식물')}",
                                       "여러 해 동안 살면서 한살이 과정의 일부를 반복하는 식물",
                                       f"→ {g('여러해살이식물')}"],
                  f"{o('한해살이')}는 한 해, {g('여러해살이')}는 여러 해",
                  "한 해 동안 한살이를 마치고 죽는 식물을 한해살이식물, 여러 해 동안 살면서 한살이 과정의 일부를 반복하는 식물을 여러해살이식물이라고 해요.",
                  title_narr="한해살이식물과 여러해살이식물.", size=40)
        self.section("낱말 10·11")
        self.drop_card()
        self.play(FadeOut(self.head), run_time=0.3)
        gnd = Line([-6.4, -1.7, 0], [6.4, -1.7, 0], stroke_color="#9C8F7E", stroke_width=6)
        b1 = K.balsam("fruit", 1.1).move_to([-4.6, -1.7, 0], aligned_edge=DOWN)
        b2 = K.balsam("dead", 1.1).move_to([-2.0, -1.7, 0], aligned_edge=DOWN)
        a1 = K.apple_tree("fruit", 0.75).move_to([2.0, -1.7, 0], aligned_edge=DOWN)
        a2 = K.apple_tree("bare", 0.75).move_to([4.7, -1.7, 0], aligned_edge=DOWN)
        h1 = F.name_tag("한해살이식물 · 봉숭아", 38, INK, stroke=ORANGE).move_to([-3.3, 2.05, 0])
        h2 = F.name_tag("여러해살이식물 · 사과나무", 38, INK, stroke=GREEN).move_to([3.3, 2.05, 0])
        ar1 = F.arrow([-3.85, -0.6, 0], [-2.75, -0.6, 0])
        ar2 = F.arrow([2.95, -0.2, 0], [3.75, -0.2, 0])
        self.say(f"봉숭아는 씨를 남기고 {o('죽어요')}", "봉숭아는 열매를 맺어 씨를 남기고, 한 해 동안 한살이를 마치고 죽어요. 한해살이식물.")
        self.play(Create(gnd), FadeIn(h1), FadeIn(b1), run_time=0.7)
        self.play(GrowArrow(ar1), FadeIn(b2), run_time=0.6)
        self.say(f"사과나무는 겨울에도 죽지 않고 {g('여러 해')} 살아요",
                 "사과나무는 겨울에도 죽지 않고, 여러 해 동안 꽃이 피고 열매 맺기를 반복해요. 여러해살이식물.")
        self.play(FadeIn(h2), FadeIn(a1), run_time=0.7)
        self.play(GrowArrow(ar2), FadeIn(a2), run_time=0.6)
        self.say(f"풀 중에도 {g('여러해살이식물')}이 있어요", "풀은 모두 한해살이식물일까요? 아니에요. 풀 중에도 여러해살이식물이 있어요.")
        self.word_end()


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


class w3u14(W3U14):
    """render.sh가 폴더 이름 그대로 장면을 부름"""
    pass
