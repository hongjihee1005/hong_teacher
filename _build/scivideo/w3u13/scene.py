"""「과학 낱말 사전」 3학년 1학기 3단원 — 식물의 생활

바탕(앱 문장): grade3/science/sem1/u3-1('잎의 넓은 부분을 잎몸이라고 해요', '잎몸에 선처럼 보이는 것을 잎맥이라고 해요',
'잎몸과 줄기를 이어 주는 가는 부분을 잎자루라고 해요', '잎몸의 둘레를 잎의 가장자리라고 해요', 한눈에 쏙),
u3-2(풀: 키가 작고 줄기가 가늘어요 / 나무: 키가 크고 줄기가 굵어요, 겨울나기), u3-3('부레옥잠은 잎자루가 풍선처럼 부풀어 있고',
'이 작은 방들을 공기주머니라고 해요', '잎자루에 공기가 들어 있어 물에 떠서 살 수 있다', 한눈에 쏙 붕어마름·검정말),
u3-4(한눈에 쏙 '사막에 사는 식물은 잎이 두껍거나 줄기가 굵은 특징', 알로에·선인장, '비가 적게 오는 곳을 사막이라고 해요',
높은 산 '기온이 낮고 바람이 세게 불어요', '대부분 키가 작고 낮은 기온을 잘 견뎌요', 눈잣나무),
u3-6(한눈에 쏙 '우엉 열매의 특징을 이용해 찍찍이 테이프를 만들었습니다', 가시 끝이 갈고리 모양).
앱에 뜻 문장이 없어 새로 쓴 것: 없음(낱말 이름표 '물속에 잠겨 사는 식물'·'사막 식물'·'높은 산 식물'은 앱 문장을 줄인 것).
실제 그림: photos/w3u13/ (WANT.md)
미리보기: MEDIA=media_p/w3u13 ./render.sh w3u13 preview
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, Line, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, g, o
from scikit import RED, clear_stage
import kit_s3u13 as K
import firstkit as F
from wordkit import WordScene, PH_Y, PH_H


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "leaf_blade": (1150, 380), "leaf_vein": (1300, 640), "leaf_stalk": (240, 530), "leaf_edge": (1250, 200),
    "wh_stalk": (955, 410), "wh_root": (960, 760),
    "ww_stem": (905, 545),
    "aloe_leaf": (900, 620),
    "cactus_stem": (1180, 560), "cactus_spine": (1075, 330),
    "burr_hook": (1185, 330),
}


class W3U13(WordScene):
    GRADE, SEM, UNIT = 3, 1, 3
    EP_TITLE = "식물의 생활"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.today(["잎몸·잎맥·잎자루", "잎의 가장자리", "풀과 나무", "공기주머니", "물속에 잠겨 사는 식물",
                    "사막 식물", "높은 산 식물", "찍찍이 테이프"],
                   "오늘 배울 낱말은 잎몸, 잎맥, 잎자루, 잎의 가장자리, 풀과 나무, 공기주머니, 물속에 잠겨 사는 식물, 사막 식물, 높은 산 식물, 찍찍이 테이프예요.",
                   cols=3)
        self.w_leaf()
        self.w_edge()
        self.w_grass_tree()
        self.w_air()
        self.w_sunken()
        self.w_desert()
        self.w_mountain()
        self.w_velcro()
        self.quiz([
            (["잎몸과 줄기를 이어 주는 가는 부분"], ["잎맥", "잎자루", "잎몸", "가장자리"], 1,
             "정답은 2번, 잎자루예요."),
            (["부레옥잠 잎자루 속의 작은 방들"], ["공기주머니", "잎맥", "뿌리", "가시"], 0,
             "정답은 1번, 공기주머니예요. 잎자루에 공기가 들어 있어 물에 떠서 살 수 있어요."),
            (["키가 크고 줄기가 굵어요"], ["풀", "나무", "씀바귀", "검정말"], 1,
             "정답은 2번, 나무예요. 풀은 키가 작고 줄기가 가늘어요."),
            (["우엉 열매의 특징을 이용해 만든 것"], ["흡착판", "드론의 날개", "찍찍이 테이프", "고속 열차"], 2,
             "정답은 3번, 찍찍이 테이프예요."),
        ])
        self.closing(f"식물은 {o('사는 곳')}에 따라\n{g('살기에 알맞은')} 생김새와 생활 방식을 가지고 있어요",
                     next_preview="과학 낱말 사전 3학년 · 생물의 한살이")
        self.wait(0.5)

    # ── 1 잎몸·잎맥·잎자루 ──
    def w_leaf(self):
        self.word(1, "잎몸·잎맥·잎자루", [f"잎의 넓은 부분을 {o('잎몸')}이라고 해요",
                                         f"잎몸에 선처럼 보이는 것을 {o('잎맥')}이라고 해요",
                                         f"잎몸과 줄기를 이어 주는 가는 부분을 {o('잎자루')}라고 해요"],
                  f"잎의 세 부분: {o('잎몸')}, {o('잎맥')}, {o('잎자루')}",
                  "잎의 부분마다 이름이 있어요. 잎의 넓은 부분을 잎몸, 잎몸에 선처럼 보이는 것을 잎맥, 잎몸과 줄기를 이어 주는 가는 부분을 잎자루라고 해요.",
                  title_narr="잎몸, 잎맥, 잎자루.", size=38)
        self.drop_card()
        ph = F.photo("w3u13/leaf", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"{o('잎몸')}, {o('잎맥')}, {o('잎자루')}를 찾아봐요", "벚나무 잎에서 찾아볼까요? 잎몸, 잎맥, 잎자루.")
        self.play(FadeIn(ph), run_time=0.7)
        cs = [F.callout(ph, P["leaf_blade"], "잎몸", to=(1.9, 1.1)),
              F.callout(ph, P["leaf_vein"], "잎맥", to=(1.9, -1.0)),
              F.callout(ph, P["leaf_stalk"], "잎자루", to=(0.4, -1.4))]
        for a, t in cs:
            self.play(GrowArrow(a), FadeIn(t), run_time=0.5)
        self.word_end()

    # ── 2 잎의 가장자리 ──
    def w_edge(self):
        self.word(2, "잎의 가장자리", [f"잎몸의 둘레를 {o('잎의 가장자리')}라고 해요",
                                       f"잎은 전체적인 모양, {o('가장자리 모양')} 등을 기준으로 분류할 수 있어요"],
                  f"잎몸의 둘레 = {o('잎의 가장자리')}",
                  "잎몸의 둘레를 잎의 가장자리라고 해요. 잎은 전체적인 모양, 가장자리 모양 등을 기준으로 분류할 수 있어요. 잎의 가장자리.")
        self.drop_card()
        saw = VGroup(*[K.leaf_card(L, show_name=True) for L in K.LEAVES if L["saw"]]).arrange(RIGHT, buff=0.3)
        smooth_ = VGroup(*[K.leaf_card(L, show_name=True) for L in K.LEAVES if not L["saw"]]).arrange(RIGHT, buff=0.3)
        b1 = T("톱니 모양이에요", 36, ORANGE)
        b2 = T("톱니 모양이 아니에요", 36, BLUE)
        left = VGroup(b1, saw).arrange(DOWN, buff=0.25)
        right = VGroup(b2, smooth_).arrange(DOWN, buff=0.25)
        VGroup(left, right).arrange(RIGHT, buff=0.7).move_to([0, -0.1, 0])
        self.say(f"‘잎의 가장자리가 {o('톱니 모양')}인가?’로 나눠요",
                 "잎의 가장자리가 톱니 모양인가를 기준으로 나누어 볼까요? 단풍나무, 민들레, 벚나무는 톱니 모양이고, 감나무, 강아지풀, 닭의장풀은 톱니 모양이 아니에요.")
        self.play(FadeIn(left, lag_ratio=0.15), run_time=0.9)
        self.play(FadeIn(right, lag_ratio=0.15), run_time=0.9)
        self.word_end()

    # ── 3 풀과 나무 ──
    def w_grass_tree(self):
        self.word(3, "풀과 나무", [f"{o('풀')}: 키가 작고 줄기가 가늘어요",
                                   f"{g('나무')}: 키가 크고 줄기가 굵어요"],
                  f"{o('풀')}은 작고 가늘게, {g('나무')}는 크고 굵게",
                  "풀은 키가 작고 줄기가 가늘어요. 나무는 키가 크고 줄기가 굵어요. 풀과 나무.", title_narr="풀과 나무.")
        self.drop_card()
        gnd = Line([-6.0, -2.0, 0], [6.0, -2.0, 0], stroke_color="#9C8F7E", stroke_width=6)
        sb = K.sseumbagwi(1.5).move_to([-3.0, -2.0, 0], aligned_edge=DOWN)
        tr = K.tree(3.9, flowers="#F6C6D6").move_to([3.0, -2.0, 0], aligned_edge=DOWN)
        c1 = F.name_tag("풀 · 씀바귀", 38, INK, stroke=ORANGE).move_to([-3.0, 0.6, 0])
        c2 = F.name_tag("나무 · 벚나무", 38, INK, stroke=GREEN).move_to([0.3, 1.3, 0])
        self.say(f"씀바귀는 {o('풀')}, 벚나무는 {g('나무')}예요", "씀바귀는 풀이고, 벚나무는 나무예요. 키와 줄기를 비교해 봐요.")
        self.play(Create(gnd), FadeIn(sb), FadeIn(tr), run_time=0.8)
        self.play(FadeIn(c1), FadeIn(c2), run_time=0.5)
        self.say(f"겨울에 풀은 {o('씨')}나 땅속 부분, 나무는 {g('뿌리와 줄기')}로 지내요",
                 "겨울이 되면 풀은 씨를 남기거나 땅속 부분으로 겨울을 나고, 나무는 대부분 잎을 떨어뜨리고 뿌리와 줄기로 겨울을 나요.")
        bare = K.tree(3.9, bare=True).move_to(tr, aligned_edge=DOWN)
        self.play(FadeOut(sb), FadeOut(tr), FadeIn(bare), run_time=1.0)
        self.word_end()

    # ── 4 공기주머니 ──
    def w_air(self):
        self.word(4, "공기주머니", [f"부레옥잠은 {o('잎자루')}가 풍선처럼 부풀어 있어요",
                                    f"잎자루 속 작은 방들을 {o('공기주머니')}라고 해요"],
                  f"잎자루 속 작은 방들 = {o('공기주머니')}",
                  "부레옥잠은 잎자루가 풍선처럼 부풀어 있어요. 잘라 보면 작은 방들이 아주 많아요. 이 작은 방들을 공기주머니라고 해요. 공기주머니.")
        self.drop_card()
        ph = F.photo("w3u13/water_hyacinth", width=7.4).move_to([-2.7, -0.05, 0])
        hc = K.honeycomb(1.35).move_to([4.0, 0.1, 0])
        hc_t = T("잘라 본 잎자루", 32).next_to(hc, DOWN, buff=0.25)
        self.say(f"부레옥잠은 {g('물에 떠서')} 살아요",
                 "부레옥잠은 잎자루에 공기가 들어 있어 물에 떠서 살 수 있어요. 공기주머니.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["wh_stalk"], "부푼 잎자루", to=(-1.6, -1.4), size=34)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.5)
        self.play(FadeIn(hc), FadeIn(hc_t), run_time=0.7)
        self.word_end()

    # ── 5 물속에 잠겨 사는 식물 ──
    def w_sunken(self):
        self.word(5, "물속에 잠겨 사는 식물", [f"붕어마름이나 검정말은 줄기가 {o('가늘며 잘 휘어')}",
                                              f"{o('물속에 잠겨서')} 살기에 적당해요"],
                  f"줄기가 가늘고 잘 휘는 {o('붕어마름')}·{o('검정말')}",
                  "붕어마름이나 검정말은 줄기가 가늘며 잘 휘어, 물속에 잠겨서 살기에 적당해요.",
                  title_narr="물속에 잠겨 사는 식물.", size=40)
        self.drop_card()
        ph = F.photo("w3u13/waterweed", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"물의 흐름을 따라 {o('잘 휘어')} 부러지지 않아요",
                 "검정말 줄기는 가늘어서 물의 흐름을 따라 잘 휘어요. 그래서 줄기가 부러지지 않고 물속에서 살 수 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["ww_stem"], "가늘고 잘 휘는 줄기", to=(2.6, 1.3), size=34)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.5)
        self.word_end()

    # ── 6 사막 식물 ──
    def w_desert(self):
        self.word(6, "사막 식물", [f"사막에 사는 식물은 {o('잎이 두껍거나')} {o('줄기가 굵은')} 특징이 있어요",
                                   "비가 적게 오는 곳을 사막이라고 해요"],
                  f"{o('잎이 두껍거나')} {o('줄기가 굵어요')}",
                  "비가 적게 오는 곳을 사막이라고 해요. 사막에 사는 식물은 잎이 두껍거나 줄기가 굵은 특징이 있어요. 사막 식물.")
        self.drop_card()
        p1 = F.photo("w3u13/aloe", width=6.3).move_to([-3.35, 0.0, 0])
        p2 = F.photo("w3u13/cactus", width=6.3).move_to([3.35, 0.0, 0])
        c1 = F.caption(p1, "알로에", 36)
        c2 = F.caption(p2, "선인장", 36)
        self.say(f"알로에: 잎이 두꺼워 {g('물을 저장')}해요", "알로에는 잎이 두꺼워서 물을 저장하기에 좋아요.")
        self.play(FadeIn(p1), FadeIn(c1), run_time=0.7)
        self.say(f"선인장: 줄기가 굵어 {g('물을 저장')}하고, 잎은 {o('가시')} 모양",
                 "선인장은 줄기가 굵어 줄기에 물을 저장할 수 있어요. 잎이 가시 모양이어서 물을 잘 빼앗기지 않아요.")
        self.play(FadeIn(p2), FadeIn(c2), run_time=0.7)
        a, t = F.callout(p2, P["cactus_spine"], "가시", to=(-1.6, 0.7), size=34)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.5)
        self.word_end()

    # ── 7 높은 산 식물 ──
    def w_mountain(self):
        self.word(7, "높은 산 식물", [f"높은 산은 {o('기온이 낮고')} {o('바람이 세게')} 불어요",
                                      f"높은 산에 사는 식물은 대부분 {g('키가 작고')} 낮은 기온을 잘 견뎌요"],
                  f"대부분 {g('키가 작고')} 낮은 기온을 잘 견뎌요",
                  "높은 산은 기온이 낮고 바람이 세게 불어요. 높은 산에 사는 식물은 대부분 키가 작고 낮은 기온을 잘 견뎌요. 높은 산 식물.",
                  size=38)
        self.drop_card()
        mt = K.mountain(6.0, 3.2).move_to([-3.0, -2.0, 0], aligned_edge=DOWN)
        wind = K.wind_lines(x=-6.4, ys=(0.4, 0.9, 1.4), length=1.8)
        nj = K.nunjat(3.6).scale(1.3).move_to([3.2, -1.6, 0], aligned_edge=DOWN)
        gnd = Line([0.8, -1.65, 0], [6.2, -1.65, 0], stroke_color="#9C8F7E", stroke_width=6)
        c = F.name_tag("눈잣나무", 38, INK, stroke=GREEN).move_to([3.4, 0.3, 0])
        self.say(f"눈잣나무는 {o('누워 자라')} 센 바람을 견뎌요",
                 "눈잣나무는 누워 자라서 세게 부는 바람을 견뎌요. 한라솜다리처럼 키가 작은 식물도 바람을 견뎌요.")
        self.play(FadeIn(mt), Create(wind), run_time=0.8)
        self.play(Create(gnd), FadeIn(nj), FadeIn(c), run_time=0.8)
        self.word_end()

    # ── 8 찍찍이 테이프 ──
    def w_velcro(self):
        self.word(8, "찍찍이 테이프", [f"{o('우엉 열매')}의 특징을 이용해 {o('찍찍이 테이프')}를 만들었어요",
                                       f"가시 끝이 {o('갈고리 모양')}이라 천에 붙으면 잘 떨어지지 않아요"],
                  f"우엉 열매의 {o('갈고리')}를 본떠 만들었어요",
                  "우엉 열매는 가시 끝이 갈고리 모양이라 천에 붙으면 잘 떨어지지 않아요. 이 특징을 이용해 찍찍이 테이프를 만들었어요. 찍찍이 테이프.")
        self.drop_card()
        ph = F.photo("w3u13/burdock", width=6.6).move_to([-3.1, 0.0, 0])
        vc = K.velcro(4.4).move_to([3.7, 0.0, 0])
        vt = T("찍찍이 테이프", 34).next_to(vc, DOWN, buff=0.35)
        self.say(f"신발, 가방처럼 {o('붙였다 떼었다')} 하는 곳에 써요",
                 "찍찍이 테이프는 신발, 가방처럼 자주 붙였다 떼었다 하는 곳에 써요.")
        self.play(FadeIn(ph), run_time=0.6)
        a, t = F.callout(ph, P["burr_hook"], "갈고리 모양 가시", to=(-2.3, 0.5), size=32)
        self.play(GrowArrow(a), FadeIn(t), run_time=0.5)
        self.play(FadeIn(vc), FadeIn(vt), run_time=0.7)
        self.word_end()


class w3u13(W3U13):
    """render.sh가 폴더 이름 그대로 장면을 부름"""
    pass
