"""「과학 낱말 사전」 3학년 2학기 2단원 — 지구와 바다 (낱말 9개: 대기, 육지·바다, 바닷물, 지형, 밀물·썰물, 갯벌, 보전)

바탕: grade3/science/sem2/u2-1 ~ u2-6.html
  대기(u2-1 한눈에 쏙 '지구를 둘러싸고 있는 기체를 지구의 대기', 우주에서 본 지구의 푸른 층, 대기가 하는 일: 숨 쉬기·구름과 비·
  열기구·연·돛단배·풍력 발전기), 육지·바다(u2-2 펼친 지구본 '초록색(육지)과 파란색(바다)', 지구 표면의 모습 산·들·강·호수·바다·
  빙하·사막, '지구 표면에서 바다가 육지보다 더 넓습니다', 형성 평가 육지 42장·바다 98장),
  바닷물(u2-3 '육지의 물과 달리 바닷물에는 소금과 같은 여러 가지 물질이 녹아 있습니다', 증발 접시 흰색 가루, 염전,
  육지의 물: 빙하·지하수·강·호수), 지형(u2-4 '지형: 땅의 생김새', 바닷가 지형 6가지),
  밀물·썰물(u2-5 한눈에 쏙, 하루 동안 바닷물 높이 — kit_s3u22.TideShore, 앱 lvl(t)),
  갯벌·보전(u2-6 한눈에 쏙 '밀물일 때 물에 잠기고 썰물일 때 물 밖으로 드러나는 편평한 땅', 서해와 남해,
  '여러 생물이 사는 곳이고, 더러운 물질을 걸러 주며, 철새의 쉼터가 되기 때문에 보전해야 해요').
  '보전'은 앱에 낱말 뜻 문장이 없어 뜻을 따로 쓰지 않고 '보전해야 하는 까닭'으로만 설명함.
실제 그림: photos/w3u22/ (WANT.md), 다시 씀: f3ep07/crab(갯벌의 농게)
미리보기: MEDIA=media_p/w3u22 ./render.sh w3u22 preview
최종: TTS_SPEED=1.0 ./make_voice.sh w3u22
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, Line, RoundedRectangle,
                   ValueTracker, VGroup, always_redraw, linear)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u22 as K
import firstkit as F
from kit_w3u2 import WordScene, text_card

# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "limb": (960, 420),                                   # 지구 가장자리의 푸른 층
    "salt": (900, 700),                                   # 염전의 흰 소금
    "cliff": (420, 420), "cave": (500, 640), "sand": (1400, 860),
    "flat": (900, 780), "sea_far": (960, 300),
    "crab_claw": (650, 650),                              # f3ep07/crab
}


class W3U22(WordScene):
    UNIT = 2
    EP_TITLE = "지구와 바다"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.today(["대기", "육지", "바다", "바닷물", "지형", "밀물", "썰물", "갯벌", "보전"],
                   "오늘은 지구와 바다 단원의 낱말 아홉 개를 배워요. 대기, 육지, 바다, 바닷물, 지형, 밀물, 썰물, 갯벌, 보전이에요.",
                   per_row=5)
        self.w_atmo()
        self.w_land_sea()
        self.w_seawater()
        self.w_landform()
        self.w_tide()
        self.w_flat()
        self.w_keep()
        self.quiz([
            (["지구를 둘러싸고 있는 기체"], "ㄷㄱ", "대기",
             "지구를 둘러싸고 있는 기체를 무엇이라고 할까요?", "정답은 대기예요."),
            (["땅의 생김새"], "ㅈㅎ", "지형", "땅의 생김새를 무엇이라고 할까요?", "정답은 지형이에요."),
            (["바닷물의 높이가 낮아지면서", "바닷물이 바다 쪽으로 빠져나가는 현상"], "ㅆㅁ", "썰물",
             "바닷물의 높이가 낮아지면서 바닷물이 바다 쪽으로 빠져나가는 현상은 무엇일까요?", "정답은 썰물이에요."),
            (["밀물일 때 물에 잠기고", "썰물일 때 물 밖으로 드러나는 편평한 땅"], "ㄱㅂ", "갯벌",
             "밀물일 때 물에 잠기고, 썰물일 때 물 밖으로 드러나는 편평한 땅은 무엇일까요?", "정답은 갯벌이에요."),
        ])
        self.closing(f"지구는 {o('대기')}가 둘러싸고, 표면은 {g('바다')}가 {g('육지')}보다 넓어요\n"
                     f"바닷가에서는 {o('밀물')}과 {o('썰물')}이 되풀이돼요",
                     next_preview="과학 낱말 사전 3학년 · 소리의 성질")
        self.wait(0.5)

    # ── 1. 대기 ──
    def w_atmo(self):
        self.word_intro(1, "대기", ["지구를 둘러싸고 있는 기체"],
                        "첫 번째 낱말은 대기예요. 대기.", "지구를 둘러싸고 있는 기체를 지구의 대기라고 해요.")
        ph = F.photo("w3u22/earth_limb", height=4.5).move_to([0, 0.05, 0])
        self.say("우주에서 본 지구의 가장자리", "우주에서 본 지구의 가장자리예요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["limb"], "대기", to=(1.8, 1.0))
        self.say(f"지구를 얇게 감싼 푸른 층이 {o('대기')}예요", "지구를 얇게 감싼 푸른 층이 대기예요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.settle()
        clear_stage(self, keep=(self.head,))
        e = K.earth(1.25).move_to([-4.3, 0.1, 0])
        items = VGroup(*[T(s, 34) for s in ["생물이 숨을 쉬어요", "구름이 생기고 비나 눈이 와요",
                                            "연과 열기구가 하늘을 날아요", "돛단배가 바람을 받아 움직여요"]])
        items.arrange(DOWN, buff=0.32, aligned_edge=LEFT).move_to([1.6, 0.1, 0])
        self.say(f"{o('대기')}가 있어서", "대기가 있어서 생물이 숨을 쉬고, 구름이 생겨 비나 눈이 와요. 연과 열기구가 날고, 돛단배가 움직여요.")
        self.play(FadeIn(e), FadeIn(items, lag_ratio=0.3), run_time=1.4)
        self.settle()
        self.repeat("대기")

    # ── 2·3. 육지와 바다 ──
    def w_land_sea(self):
        self.word_intro("2 · 3", "육지와 바다", ["지구본의 초록색은 육지, 파란색은 바다"],
                        "두 번째와 세 번째 낱말은 육지와 바다예요. 육지, 바다.",
                        "지구본에서 초록색으로 칠한 곳은 육지, 파란색으로 칠한 곳은 바다예요. 육지에는 산, 들, 강, 호수, 사막, 빙하가 있어요.", head_size=54)
        grid = K.sticker_grid(0.3, filled=True).move_to([-2.6, -0.05, 0])
        land, sea = 42, 98
        bars = VGroup(
            VGroup(T("육지", 36, K.LAND_D), T(f"{land}장", 36)).arrange(RIGHT, buff=0.3),
            VGroup(T("바다", 36, K.SEA_D), T(f"{sea}장", 36)).arrange(RIGHT, buff=0.3),
        ).arrange(DOWN, buff=0.4, aligned_edge=LEFT).move_to([3.7, 0.7, 0])
        res = M(f"육지 {o('＜')} 바다", 52).move_to([3.7, -1.0, 0])
        self.say("지구본에 붙임딱지를 붙여 세어 봐요",
                 "지구본에 같은 크기의 붙임딱지를 붙여 육지와 바다의 개수를 세어 봐요.")
        self.play(FadeIn(grid, lag_ratio=0.01), run_time=1.2)
        self.say(f"육지 {land}장, 바다 {sea}장", f"붙임딱지가 육지 {land}장, 바다 {sea}장이었다면 바다가 훨씬 많아요.")
        self.play(FadeIn(bars, lag_ratio=0.3), run_time=0.8)
        self.say(f"지구 표면에서 {g('바다가 육지보다 더 넓어요')}", "지구 표면에서 바다가 육지보다 더 넓어요.")
        self.play(FadeIn(res, scale=0.9), run_time=0.6)
        self.settle()
        self.repeat("육지와 바다", "다시 한번 말해 봐요. 육지, 바다.")

    # ── 4. 바닷물 ──
    def w_seawater(self):
        self.word_intro(4, "바닷물", ["육지의 물과 달리 소금과 같은", "여러 가지 물질이 녹아 있어요"],
                        "네 번째 낱말은 바닷물이에요. 바닷물.",
                        "육지의 물과 달리 바닷물에는 소금과 같은 여러 가지 물질이 녹아 있어요.",
                        sub_mean=f"바닷물에는 {o('소금')}과 같은 여러 가지 물질이 녹아 있어요")
        d1 = K.evap_dish(2.6, residue=False).move_to([-3.3, 0.3, 0])
        d2 = K.evap_dish(2.6, residue=True).move_to([3.3, 0.3, 0])
        l1 = T("육지의 물", 38).next_to(d1, DOWN, buff=0.45)
        l2 = T("바닷물", 38).next_to(d2, DOWN, buff=0.45)
        r1 = T("아무것도 남지 않아요", 32, SOFT).next_to(l1, DOWN, buff=0.2)
        r2 = M(f"{o('흰색 가루')} 물질이 남아요", 32).next_to(l2, DOWN, buff=0.2)
        self.say("두 물을 증발 접시에 넣고 가열하면?",
                 "육지의 물과 바닷물을 증발 접시에 넣고 가열하면 무엇이 남을까요?")
        self.play(FadeIn(d1), FadeIn(d2), FadeIn(l1), FadeIn(l2), run_time=0.8)
        self.say(f"바닷물 접시에만 {o('흰색 가루')}가 남아요",
                 "육지의 물 접시에는 아무것도 남지 않고, 바닷물 접시에는 흰색 가루 물질이 남아요.")
        self.play(FadeIn(r1), FadeIn(r2), Indicate(d2, color=ORANGE), run_time=1.0)
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("w3u22/salt_pan", height=4.5).move_to([0, 0.05, 0])
        self.say(f"염전에서 바닷물을 증발시키면 {o('소금')}이 남아요",
                 "염전에서 바닷물을 햇볕과 바람으로 증발시키면 흰색 물질, 소금이 남아요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["salt"], "소금", to=(2.2, 1.2))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.settle()
        self.repeat("바닷물")

    # ── 5. 지형 ──
    def w_landform(self):
        self.word_intro(5, "지형", ["땅의 생김새"],
                        "다섯 번째 낱말은 지형이에요. 지형.", "지형은 땅의 생김새예요.")
        ph = F.photo("w3u22/coast", height=4.5).move_to([0, 0.05, 0])
        self.play(FadeIn(ph), run_time=0.7)
        cs = [F.callout(ph, P["cliff"], "가파른 절벽", to=(2.6, 0.9), size=34),
              F.callout(ph, P["cave"], "바닷가 동굴", to=(-0.9, -1.3), size=34),
              F.callout(ph, P["sand"], "모래 해변", to=(0.4, 1.3), size=34)]
        self.say(f"{o('가파른 절벽')}, {o('바닷가 동굴')}, {o('모래 해변')}",
                 "바닷가에서 가파른 절벽, 바닷가 동굴, 넓은 모래 해변을 볼 수 있어요.")
        for a, t in cs:
            self.play(GrowArrow(a), FadeIn(t), run_time=0.5)
        self.settle()
        clear_stage(self, keep=(self.head,))
        names = ["넓은 모래 해변", "가파른 절벽", "바닷가 동굴", "구멍 뚫린 바위", "바위 기둥", "갯벌"]
        cs = VGroup(*[K.landform(n, 3.4, 1.7, 30) for n in names])
        cs[:3].arrange(RIGHT, buff=0.45)
        cs[3:].arrange(RIGHT, buff=0.45)
        VGroup(cs[:3], cs[3:]).arrange(DOWN, buff=0.35).move_to([0, -0.05, 0])
        self.say(f"바닷가 지형 {o('여섯 가지')}",
                 "구멍 뚫린 바위, 바위 기둥, 갯벌도 바닷가 지형이에요.")
        self.play(FadeIn(cs, lag_ratio=0.12), run_time=1.2)
        self.settle()
        self.repeat("지형")

    # ── 6·7. 밀물과 썰물 ──
    def w_tide(self):
        self.section("낱말 6 · 7")
        hd = VGroup(T("밀물", 110, self.accent), T("썰물", 110, BLUE)).arrange(RIGHT, buff=1.4).move_to([0, 1.3, 0])
        c1 = text_card([f"바닷물의 높이가 높아지면서", f"바닷물이 {o('육지 쪽으로 밀려 들어오는')} 현상"], size=34)
        c2 = text_card([f"바닷물의 높이가 낮아지면서", f"바닷물이 {o('바다 쪽으로 빠져나가는')} 현상"], size=34)
        VGroup(c1, c2).arrange(RIGHT, buff=0.3).move_to([0, -1.2, 0])
        self.say(f"{o('밀물')}과 {o('썰물')}", "여섯, 일곱 번째 낱말은 밀물과 썰물이에요. 밀물, 썰물.")
        self.play(FadeIn(hd, scale=0.8), run_time=0.8)
        self.say("밀물: 바닷물이 육지 쪽으로 밀려 들어와요",
                 "바닷물의 높이가 높아지면서 바닷물이 육지 쪽으로 밀려 들어오는 현상을 밀물이라고 해요.")
        self.play(FadeIn(c1, shift=UP * 0.2), run_time=0.6)
        self.say("썰물: 바닷물이 바다 쪽으로 빠져나가요",
                 "바닷물의 높이가 낮아지면서 바닷물이 바다 쪽으로 빠져나가는 현상을 썰물이라고 해요.")
        self.play(FadeIn(c2, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
        lv = ValueTracker(K.tide_level(9.2))
        tm = ValueTracker(9.2)
        shore = K.TideShore(lv)
        pic = shore.group()
        self._tide_dir = 1
        clock = always_redraw(lambda: T(f"{int(tm.get_value()):02d}시", 46, INK).move_to([-4.9, 2.35, 0]))
        state = always_redraw(lambda: M(
            (f"{o('밀물')} — 바닷물이 들어와요" if self._tide_dir > 0 else f"{b_c('썰물')} — 바닷물이 빠져나가요"), 38
        ).move_to([1.3, 2.4, 0]))
        self.say("같은 바닷가를 하루 동안 지켜봐요", "아침 9시쯤 바닷가예요. 바닷물이 낮아 섬으로 가는 바닷길이 드러나 있어요.")
        self.play(FadeIn(pic), FadeIn(clock), run_time=0.8)
        self.settle()
        self.add(state)

        def run(t1, rt):
            self.play(tm.animate.set_value(t1), lv.animate.set_value(K.tide_level(t1)), run_time=rt, rate_func=linear)
        self.say(f"{o('밀물')}: 바닷물이 높아지며 바닷길이 잠겨요", "바닷물이 육지 쪽으로 밀려 들어와 바닷길이 잠기고 배가 떠요. 밀물이에요.")
        run(15.2, 4.0)
        self.settle()
        self._tide_dir = -1
        self.say(f"{b_c('썰물')}: 바닷물이 낮아지며 땅이 드러나요", "이제 바닷물이 바다 쪽으로 빠져나가 잠겼던 땅이 드러나요. 썰물이에요.")
        run(21.4, 4.0)
        self.settle()
        self.say(f"하루 동안 {g('높아졌다 낮아졌다')}를 되풀이해요",
                 "바닷물의 높이는 하루 동안 높아졌다 낮아졌다를 되풀이해요.")
        self.settle()
        shore.stop()
        clock.clear_updaters()
        state.clear_updaters()
        self.say(f"다시 한번, {o('밀물')}, {b_c('썰물')}", "다시 한번 말해 봐요. 밀물, 썰물.")
        self.settle()
        clear_stage(self)

    # ── 8. 갯벌 ──
    def w_flat(self):
        self.word_intro(8, "갯벌", ["밀물일 때 물에 잠기고", "썰물일 때 물 밖으로 드러나는 편평한 땅"],
                        "여덟 번째 낱말은 갯벌이에요. 갯벌.",
                        "밀물일 때 물에 잠기고, 썰물일 때 물 밖으로 드러나는 편평한 땅을 갯벌이라고 해요.",
                        sub_mean=f"밀물 때 잠기고 썰물 때 드러나는 {o('편평한 땅')}")
        ph = F.photo("w3u22/mudflat", height=4.5).move_to([0, 0.05, 0])
        self.say("썰물 때 드러난 갯벌이에요", "썰물 때 드러난 갯벌이에요. 갯벌은 주로 고운 흙인 펄로 되어 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["flat"], "갯벌", to=(2.4, 1.2))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.say(f"우리나라 갯벌은 {o('서해와 남해')}에 많아요", "우리나라의 갯벌은 서해와 남해에 많아요.")
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("f3ep07/crab", height=4.5).move_to([0, 0.05, 0])
        self.say("갯벌 흙 위의 구멍은 생물의 집", "갯벌 흙 위의 작은 구멍은 게 같은 생물이 사는 집이에요. 갯벌에 사는 농게예요.")
        self.play(FadeIn(ph), run_time=0.7)
        nm = VGroup(*[F.name_tag(w, 32, INK, stroke=self.accent) for w in ["농게", "짱뚱어", "갯지렁이", "퉁퉁마디", "저어새"]])
        nm.arrange(RIGHT, buff=0.18).move_to([0, -1.75, 0])
        self.say(f"갯벌에는 {o('여러 생물')}이 살아요",
                 "갯벌에는 농게, 짱뚱어, 갯지렁이, 퉁퉁마디가 살고, 저어새 같은 새가 찾아와요.")
        self.play(FadeIn(nm, lag_ratio=0.15), run_time=1.0)
        self.settle()
        self.repeat("갯벌")

    # ── 9. 보전 ──
    def w_keep(self):
        self.word_intro(9, "보전", ["갯벌은 소중해서 보전해야 해요"],
                        "마지막 아홉 번째 낱말은 보전이에요. 보전.",
                        "갯벌은 소중하기 때문에 보전해야 해요. 왜 그럴까요?")
        rs = [("여러 생물이 사는 곳", "농게, 짱뚱어처럼 여러 생물이 살아가는 집이에요."),
              ("더러운 물질을 걸러 줘요", "더러운 물질을 걸러 바다를 깨끗하게 해요."),
              ("철새의 쉼터", "철새가 먹이를 먹고 쉬어 가는 곳이에요.")]
        cards = VGroup()
        for i, (h, _) in enumerate(rs):
            box = RoundedRectangle(corner_radius=0.22, width=4.1, height=2.4, fill_color=PAPER, fill_opacity=1,
                                   stroke_color=self.accent, stroke_width=4)
            n = T(str(i + 1), 46, self.accent).move_to(box.get_center() + UP * 0.6)
            t = T(h, 32).move_to(box.get_center() + DOWN * 0.35)
            if t.width > 3.7:
                t.scale_to_fit_width(3.7)
            cards.add(VGroup(box, n, t))
        cards.arrange(RIGHT, buff=0.3).move_to([0, 0.1, 0])
        for c, (h, n) in zip(cards, rs):
            self.say(h, n)
            self.play(FadeIn(c, shift=UP * 0.2), run_time=0.6)
        nt = M(f"한번 사라지면 {r_('되돌리기 어려워요')}", 36).move_to([0, -1.9, 0])
        self.say(f"갯벌을 메우면 {r_('되돌리기 어려워요')}",
                 "갯벌을 메우면 생물이 살 곳을 잃고 철새가 떠나요. 한번 사라지면 되돌리기 어려워요.")
        self.play(FadeIn(nt), run_time=0.5)
        self.settle()
        self.repeat("보전", "그래서 갯벌을 보전해야 해요. 다시 한번 말해 봐요. 보전.")


def b_c(s):
    return f'<span foreground="{BLUE}">{s}</span>'


def r_(s):
    return f'<span foreground="{RED}">{s}</span>'


class w3u22(W3U22):
    """render.sh가 폴더 이름을 장면 이름으로 넘기므로 같은 장면을 이 이름으로도 둠"""
    pass
