"""「처음 배우는 과학」 3학년 6화 — 우리 주변·땅속에 사는 동물 (3-1 2단원 동물의 생활 3~4차시, 화 코드 3-1-2-b)

바탕: grade3/science/sem1/u2-2.html — 도입(본 적 있는 동물), 조사 준비물·옷차림·안전 약속(RULES),
땅에 사는 동물과 하늘을 날아다니는 동물(FLY), 생각 바로잡기(산호·말미잘·따개비), 매미 애벌레 허물 관찰(EXQ),
땅속 동물 조사(SOIL·DIG: 두더지·땅강아지·개미·매미 애벌레·지렁이), 환경과의 관련(envPick), 한눈에 쏙, 생각+(땅강아지), 형성 평가 2.
(학교 탐험 지도·누구일까요 놀이·형성 평가 1·3은 길이 때문에 뺌 — 형성 평가 3은 생각 바로잡기와 같은 내용)
실제 그림: photos/f3ep06/ (WANT.md), 다시 씀: f3ep05/snail, f3ep05/butterfly
최종: TTS_SPEED=1.0 ./make_voice.sh f3ep06
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Circumscribe, Create, FadeIn, FadeOut, GrowArrow, Indicate, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, BROWN_DARK, clear_stage
import kit_s3u12 as K
import firstkit as F


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def b_(s):
    return f'<span foreground="{BLUE}">{s}</span>'


# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "snail_body": (900, 700), "butterfly_wing": (1210, 250),
    # 허물: 위에서 내려다본 모습, 머리가 위쪽
    "exu_body": (960, 560), "exu_ant": (960, 210),
    "exu_leg1": (760, 400), "exu_leg2": (1160, 400), "exu_leg3": (720, 560), "exu_leg4": (1200, 560),
    "exu_leg5": (740, 730), "exu_leg6": (1180, 730),
    # 두더지·땅강아지·개미·지렁이: 옆모습, 머리가 왼쪽
    "mole_paw": (600, 800), "mole_body": (1150, 520),
    "cric_fore": (560, 720), "cric_body": (1100, 520),
    "ant_jaw": (430, 600), "ant_body": (1050, 520),
    "worm_front": (480, 560), "worm_back": (1480, 600),
}


class F3Ep06(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 6
    EP_TITLE = "우리 주변·땅속에 사는 동물"
    SERIES = "처음 배우는 과학"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.wonder()
        self.prepare()
        self.not_moving()
        self.exuvia()
        self.underground()
        self.summary()
        self.check()
        self.closing(f"땅속에 사는 동물은 {o('앞다리')}로 땅을 파는 등\n"
                     f"{g('땅속에서 살기에 알맞은')} 생김새와 생활 방식을 가져요",
                     next_preview="처음 배우는 과학 3학년 7화 · 물에 사는 동물과 물갈퀴")
        self.wait(0.5)

    # ── 궁금해요: 우리 주변 동물 ──
    def wonder(self):
        self.section("궁금해요")
        self.say("학교나 집 주변에서 어떤 동물을 보았나요?", "학교나 집 주변에서 어떤 동물을 본 적이 있나요?")
        self.pause_screen(4, "내가 본 동물을 말해 봐요")
        p1 = F.photo("f3ep05/snail", width=6.3).move_to([-3.45, 0.55, 0])
        p2 = F.photo("f3ep05/butterfly", width=6.3).move_to([3.45, 0.55, 0])
        c1 = F.caption(p1, "땅에 사는 동물", 36, BROWN_DARK)
        c2 = F.caption(p2, "하늘을 날아다니는 동물", 36, BLUE)
        self.say(f"달팽이처럼 {o('땅에 사는 동물')}이 있고", "달팽이, 고양이, 개미, 지렁이처럼 땅에 사는 동물이 있고,")
        self.play(FadeIn(p1), run_time=0.7)
        self.play(FadeIn(c1), run_time=0.4)
        self.say(f"나비처럼 {b_('하늘을 날아다니는 동물')}도 있어요", "나비, 참새, 꿀벌처럼 하늘을 날아다니는 동물도 있어요.")
        self.play(FadeIn(p2), run_time=0.7)
        self.play(FadeIn(c2), run_time=0.4)
        self.say(f"우리 주변에는 {g('다양한 동물')}이 살고 있어요", "우리 주변에는 이렇게 다양한 동물이 살고 있어요.")
        self.settle()
        clear_stage(self)

    # ── 조사 준비 ──
    def prepare(self):
        self.section("조사해요")
        self.say("학교에 사는 동물을 조사하러 가요", "학교에 사는 여러 가지 동물을 조사하러 떠나 볼까요?")
        h1 = T("준비물·옷차림", 40, self.accent).move_to([-3.5, 2.4, 0])
        h2 = T("안전 약속", 40, self.accent).move_to([3.4, 2.4, 0])
        left = VGroup(*[T(t, 36, INK) for t in ("돋보기 · 확대경", "모종삽", "스마트 기기", "동물도감", "긴소매 · 긴바지")])
        left.arrange(DOWN, buff=0.22, aligned_edge=LEFT).move_to([-3.5, 0.0, 0])
        right = VGroup(*[VGroup(K.ox_mark(True, 0.17), T(t, 34, INK)).arrange(RIGHT, buff=0.25) for t in
                         ("동물을 함부로 만지지 않아요", "돌·흙은 관찰한 뒤 원래대로", "관찰이 끝나면 손을 씻어요",
                          "생명을 소중히 여겨요")]).arrange(DOWN, buff=0.32, aligned_edge=LEFT).move_to([3.4, 0.1, 0])
        self.say(f"돋보기, 동물도감을 챙기고 {o('긴소매·긴바지')}를 입어요",
                 "돋보기와 확대경, 모종삽, 스마트 기기, 동물도감을 챙기고, 긴소매와 긴바지를 입어요.")
        self.say(f"동물은 {r('채집하지 않고')} 사진이나 영상으로 기록해요",
                 "관찰한 동물은 함부로 채집하지 않아요. 스마트 기기로 사진이나 영상을 찍어 기록해요.")
        self.play(FadeIn(h1), FadeIn(left, lag_ratio=0.12), run_time=1.0)
        self.say(f"동물을 {r('함부로 만지지 않아요')}", "그리고 약속을 지켜요. 동물을 함부로 만지지 않고, 돌이나 흙을 옮겼다면 관찰한 뒤 원래대로 둬요.")
        self.play(FadeIn(h2), FadeIn(right, lag_ratio=0.2), run_time=1.0)
        self.say(f"{g('생명을 소중히')} 여기는 마음으로 조사해요", "관찰이 끝나면 손을 깨끗이 씻고, 생명을 소중히 여기는 마음으로 조사해요.")
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def not_moving(self):
        self.section("생각 바로잡기")
        q = M(f"“동물은 모두 움직인다?”", 56).move_to([0, 2.2, 0])
        self.say("동물은 모두 움직일까요?", "동물은 모두 움직일까요?")
        self.play(FadeIn(q), run_time=0.5)
        co = K.fit(K.coral(), 1.8, 1.6).move_to([-3.5, 0.1, 0])
        an = K.fit(K.anemone(), 1.8, 1.6).move_to([0, 0.1, 0])
        ba = K.fit(K.barnacle(), 2.2, 1.4).move_to([3.5, 0.0, 0])
        labs = VGroup(T("산호", 36).next_to(co, DOWN, buff=0.2), T("말미잘", 36).next_to(an, DOWN, buff=0.2),
                      T("따개비", 36).next_to(ba, DOWN, buff=0.2))
        x = K.ox_mark(False, 0.35).next_to(q, RIGHT, buff=0.4)
        self.say(f"아니에요. {o('한곳에 붙어서')} 사는 동물도 있어요",
                 "아니에요. 산호, 말미잘, 따개비처럼 한곳에 붙어서 움직이지 않는 동물도 있어요.")
        self.play(FadeIn(x, scale=1.3), FadeIn(VGroup(co, an, ba)), FadeIn(labs), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 새 낱말 '허물' + 관찰 ──
    def exuvia(self):
        self.section("새 낱말")
        self.say("땅에서 동물이 파 놓은 구멍을 볼 때가 있어요",
                 "땅을 자세히 살펴보면, 땅속에 사는 동물이 파 놓은 구멍을 볼 때가 있어요. 땅속 동물은 땅을 어떻게 팔 수 있을까요?")
        ph = F.photo("f3ep06/exuvia", height=5.2).move_to([0, 0.35, 0])
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["exu_body"], "허물", to=(3.0, 0.6))
        self.say(f"매미 애벌레가 벗은 {o('허물')}이에요", "이것은 매미 애벌레의 허물이에요. 허물.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say(f"{o('허물')}: 매미 애벌레 등이 자라면서 벗는 껍질",
                 "허물은 매미 애벌레 등이 자라면서 벗는 껍질이에요. 허물을 관찰하면 매미 애벌레의 모습을 알 수 있어요.")
        self.settle()
        self.play(FadeOut(a), FadeOut(t), run_time=0.4)
        self.section("관찰해요")
        self.say("돋보기로 허물을 자세히 관찰해요", "돋보기로 허물을 자세히 관찰해 볼까요?")
        rg = F.ring(ph, P["exu_ant"], r=0.6)
        self.say(f"머리에는 {o('더듬이')}가 있어요", "먼저 머리를 보세요. 머리에는 더듬이가 있어요.")
        self.play(Create(rg), run_time=0.6)
        self.play(FadeOut(rg), run_time=0.3)
        self.say("다리는 몇 개일까요? 세어 봐요", "다리는 몇 개일까요? 함께 세어 봐요. 하나, 둘, 셋, 넷, 다섯, 여섯.")
        nums = VGroup()
        for i in range(6):
            pt = ph.at(*P[f"exu_leg{i + 1}"])
            c = F.ring(ph, pt, r=0.26, sw=6)
            n = T(str(i + 1), 34, ORANGE).move_to(pt + np.array([-0.5 if i % 2 == 0 else 0.5, 0, 0]))
            nums.add(VGroup(c, n))
            self.play(FadeIn(nums[-1], scale=1.3), run_time=0.35)
        self.say(f"다리는 {o('세 쌍')}, 모두 여섯 개예요", "다리는 두 개씩 세 쌍, 모두 여섯 개예요.")
        self.settle()
        self.play(FadeOut(nums), run_time=0.3)
        self.pause_screen(5, "매미 애벌레는 무엇으로 땅을 팔까요?")
        r1 = F.ring(ph, P["exu_leg1"], r=0.55)
        r2 = F.ring(ph, P["exu_leg2"], r=0.55)
        self.say(f"앞다리가 {o('뾰족해요')}", "앞다리를 보세요. 앞다리가 뾰족해요.")
        self.play(Create(r1), Create(r2), run_time=0.7)
        self.say(f"{g('뾰족한 앞다리')}로 땅을 파요", "매미 애벌레는 이 뾰족한 앞다리로 땅을 파요.")
        self.say(f"허물은 {r('쉽게 부서져요')} — 힘을 주어 만지지 않아요",
                 "허물은 쉽게 부서져요. 힘을 주어 만지지 않고, 관찰한 뒤에는 손을 깨끗이 씻어요.")
        self.settle()
        clear_stage(self)

    # ── 땅속 동물 ──
    def underground(self):
        self.section("조사해요")
        names = VGroup(*[F.name_tag(w, 44, INK, stroke=BROWN_DARK) for w in ("두더지", "땅강아지", "개미", "매미 애벌레", "지렁이")])
        names.arrange(RIGHT, buff=0.35).move_to([0, 0.6, 0])
        self.say("땅속에 사는 동물을 조사해요", "땅속에는 두더지, 땅강아지, 개미, 매미 애벌레, 지렁이 같은 동물이 살아요.")
        self.play(FadeIn(names, lag_ratio=0.15), run_time=1.0)
        self.pause_screen(5, "누가 어떻게 땅을 팔까요?")
        clear_stage(self)
        # 두더지
        ph = F.photo("f3ep06/mole", height=5.2).move_to([0, 0.35, 0])
        self.say("땅속에 사는 두더지예요", "땅속에 사는 두더지예요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["mole_paw"], "삽처럼 넓적한 앞다리", to=(2.6, -0.4), size=36)
        self.say(f"앞다리가 {o('삽처럼 넓적')}하고 두꺼운 발톱이 있어요",
                 "두더지는 앞다리가 삽처럼 넓적하고, 두꺼운 발톱이 있어요. 눈은 거의 보이지 않아요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say(f"이 {o('앞다리')}로 굴을 파서 땅속을 이동해요",
                 "두더지는 이 앞다리로 굴을 파서 땅속을 이동해요. 땅속에 사는 지렁이나 곤충을 잡아먹어요.")
        self.settle()
        clear_stage(self)
        # 땅강아지
        ph = F.photo("f3ep06/mole_cricket", height=5.2).move_to([0, 0.35, 0])
        self.say("땅속에 사는 땅강아지예요", "땅속에 사는 땅강아지예요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["cric_fore"], "넓고 두꺼운 앞다리", to=(2.6, -0.5), size=36)
        self.say(f"앞다리가 {o('삽 모양')}으로 넓고 두꺼워요", "땅강아지는 다리가 세 쌍이고, 앞다리가 삽 모양으로 넓고 두꺼워요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say(f"{o('넓적한 앞다리')}로 땅을 파며 살아요", "땅강아지는 넓적한 앞다리로 땅을 파며 땅속에서 살아요.")
        self.settle()
        clear_stage(self)
        # 개미
        ph = F.photo("f3ep06/ant", height=5.2).move_to([0, 0.35, 0])
        self.say("땅 위를 기어다니는 개미예요", "개미는 땅 위를 기어다니고, 땅속에 집을 지어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["ant_jaw"], "큰턱", to=(1.6, -1.4))
        self.say(f"머리에 {o('큰턱')}이 있어요", "개미는 다리가 세 쌍이고 더듬이가 있어요. 머리에는 큰턱이 있어요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.say(f"{o('큰턱')}으로 땅을 파서 집을 지어요", "개미는 큰턱으로 땅을 파서 땅속에 집을 지어요.")
        self.settle()
        clear_stage(self)
        # 지렁이
        ph = F.photo("f3ep06/earthworm", height=5.2).move_to([0, 0.35, 0])
        self.say(f"지렁이는 몸이 가늘고 길며 {r('다리가 없어요')}", "지렁이는 몸이 가늘고 길며, 다리가 없어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a1 = F.arrow(ph.at(*P["worm_front"]) + RIGHT * 0.1, ph.at(*P["worm_front"]) + LEFT * 1.4)
        a2 = F.arrow(ph.at(*P["worm_back"]) + RIGHT * 1.2, ph.at(*P["worm_back"]) + LEFT * 0.2, color=GREEN)
        self.say(f"몸의 앞부분을 {o('늘여')} 흙을 밀어 내요", "지렁이는 몸의 앞부분을 늘려 흙을 앞으로 밀어 내요.")
        self.play(GrowArrow(a1), run_time=0.6)
        self.say(f"그다음 뒷부분을 {g('끌어당겨')} 이동해요", "그다음 뒷부분을 끌어당기며 땅속을 이동해요.")
        self.play(GrowArrow(a2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        c = K.text_card([f"땅속에 사는 동물은 {o('뾰족한 앞다리')}로 땅을 파는 등",
                         f"{g('땅속에서 살기에 알맞은')} 생김새와 생활 방식을 가지고 있어요"], size=40).move_to([0, 1.5, 0])
        self.say(f"땅속 동물은 {g('땅속에서 살기에 알맞은')} 생김새를 가졌어요",
                 "땅속에 사는 동물은 뾰족한 앞다리로 땅을 파는 등, 땅속에서 살기에 알맞은 생김새와 생활 방식을 가지고 있어요.")
        self.play(FadeIn(c, shift=UP * 0.2), run_time=0.7)
        c2 = K.text_card([f"우리 주변에는 고양이, 지렁이, 참새 등", f"{g('다양한 동물')}이 살고 있어요"], size=40).move_to([0, -0.9, 0])
        self.say(f"우리 주변에는 {g('다양한 동물')}이 살아요", "그리고 우리 주변에는 고양이, 지렁이, 참새 등 다양한 동물이 살고 있어요.")
        self.play(FadeIn(c2), run_time=0.6)
        self.settle()
        clear_stage(self)
        ph = F.photo("f3ep06/mole_cricket", height=4.4).move_to([-2.6, 0.6, 0])
        self.say("땅강아지가 땅속에서 잘 사는 까닭은?", "생각해 봐요. 땅강아지가 땅속에서 잘 살 수 있는 까닭은 무엇일까요?")
        self.play(FadeIn(ph), run_time=0.6)
        self.pause_screen(5, "앞다리 모양을 살펴봐요")
        rg = F.ring(ph, P["cric_fore"], r=0.7)
        t = VGroup(M(f"{o('넓적한 앞다리')}로", 40), M(f"{g('땅을 잘 팔 수 있어요')}", 40)).arrange(DOWN, buff=0.25, aligned_edge=LEFT)
        t.next_to(ph, RIGHT, buff=0.45)
        self.say(f"{o('넓적한 앞다리')}로 땅을 잘 팔 수 있기 때문이에요",
                 "땅강아지는 넓적한 앞다리가 있어서 땅을 잘 팔 수 있기 때문이에요.")
        self.play(Create(rg), FadeIn(t), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 확인 ──
    def check(self):
        self.section("확인해요")
        self.say(f"동물을 관찰할 때 지켜야 할 것으로 {r('옳지 않은')} 것은?",
                 "우리 주변에 사는 동물을 관찰할 때 지켜야 할 것으로 옳지 않은 것은 어느 것일까요?")
        opts = ["① 동물을 함부로 만지지 않는다.", "② 동물이 다치지 않도록 조심한다.", "③ 관찰이 끝난 뒤에는 손을 깨끗이 씻는다.",
                "④ 동물을 관찰한 뒤에 채집해서 집에 가지고 간다.", "⑤ 모둠에서 관찰하기로 정한 장소에서만 관찰한다."]
        ts = VGroup(*[T(x, 38, INK) for x in opts]).arrange(DOWN, buff=0.26, aligned_edge=LEFT).move_to([0, 0.35, 0])
        self.play(FadeIn(ts, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(5, "옳지 않은 것은 몇 번일까요?")
        self.play(Circumscribe(ts[3], color=RED), ts[3].animate.set_color(RED), run_time=1.0)
        self.say(f"정답은 ④ — 동물은 {r('채집하지 않아요')}", "정답은 4번이에요. 관찰한 동물은 함부로 채집하지 않고 사진이나 영상으로 기록해요.")
        self.settle()
        clear_stage(self)
        p1 = F.photo("f3ep06/mole", width=5.6).move_to([-3.2, 0.55, 0])
        p2 = F.photo("f3ep06/mole_cricket", width=5.6).move_to([3.2, 0.55, 0])
        la = T("㈎", 44, INK).next_to(p1, UP, buff=0.1)
        lb = T("㈏", 44, INK).next_to(p2, UP, buff=0.1)
        self.say("땅속에 사는 동물 ㈎와 ㈏의 이름과 공통 특징은?",
                 "땅속에 사는 동물 가와 나예요. 이름은 무엇이고, 공통적인 특징은 무엇일까요?")
        self.play(FadeIn(p1), FadeIn(p2), FadeIn(la), FadeIn(lb), run_time=0.7)
        self.pause_screen(5, "㈎·㈏의 이름과 공통 특징은?")
        na = T("두더지", 38, ORANGE).next_to(p1, DOWN, buff=0.15)
        nb = T("땅강아지", 38, ORANGE).next_to(p2, DOWN, buff=0.15)
        self.say(f"㈎는 {o('두더지')}, ㈏는 {o('땅강아지')}예요", "가는 두더지, 나는 땅강아지예요.")
        self.play(FadeIn(na), FadeIn(nb), run_time=0.5)
        self.say(f"둘 다 {g('앞다리를 이용해 땅을 팔 수 있어요')}", "두 동물 모두 앞다리를 이용해 땅을 팔 수 있어요.")
        self.play(Indicate(na, color=GREEN), Indicate(nb, color=GREEN), run_time=0.8)
        self.settle()
        clear_stage(self)
