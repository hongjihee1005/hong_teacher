"""「과학 낱말 사전」 3학년 1학기 1단원 — 힘과 우리 생활

바탕(앱 문장): grade3/science/sem1/u1-1(무게: '물체가 가볍고 무거운 정도를 무게라고 해요', 카트·책가방, 생각 바로잡기 큰 빈 상자·작은 쇠 아령),
u1-2(수평: '시소처럼 어느 쪽으로도 기울어지지 않은 상태를 수평이라고 해요', 받침점: '받침대와 판이 맞닿는 부분을 받침점이라고 해요', 한눈에 쏙, 양팔저울),
u1-3(저울: 한눈에 쏙, '손으로 들어 본 느낌은 사람마다 다를 수 있어요', 전자저울 재는 차례, g·kg, 생활 속 저울),
u1-4(용수철저울: 고리·표시 자·영점 조절 나사, '고리에 물체를 걸고 표시 자가 가리키는 눈금을 읽어'),
u1-5(지레: '받침대에 올린 판을 이용해 물체를 들어 올리는 도구를 지레라고 해요', 직접 180·지레 45·빗면 40, 한눈에 쏙),
u1-6(도구: '지레나 빗면과 같은 도구를 이용하면 물체의 무게보다 작은 힘으로 물체를 들어 올릴 수 있습니다', 병따개·경사로·구불구불한 산길,
'받침대가 있으면 지레, 비스듬한 판이면 빗면이에요').
앱에 뜻 문장이 없어 새로 쓴 것: '힘'(밀거나 당겨서 움직이려면 힘을 주어야 해요), '빗면'(비스듬한 판).
실제 그림: photos/w3u11/ (WANT.md)
미리보기: MEDIA=media_p/w3u11 ./render.sh w3u11 preview
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, GrowArrow, Indicate, Line, Rectangle, Rotate,
                   Triangle, VGroup)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T, g, o
from scikit import (BROWN, BROWN_DARK, RED, Board, SpringScale, backpack, box, cart, clear_stage, dumbbell, e_scale,
                    force_bar, ground, sq_block)
import firstkit as F
from wordkit import WordScene, PH_Y, PH_H, text_card


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


# 그림 위 자리(원본 1920×1080 픽셀) — 그림이 들어오면 열어 보고 맞춤
P = {
    "cart_handle": (1300, 150), "cart_basket": (800, 560),
    "seesaw_pivot": (960, 580), "seesaw_board": (960, 536),
    "bal_pivot": (960, 196), "bal_panL": (516, 644), "bal_panR": (1406, 644),
    "opener_pivot": (880, 240), "opener_hand": (1680, 160),
    "ramp_slope": (700, 560),
}


class W3U11(WordScene):
    GRADE, SEM, UNIT = 3, 1, 1
    EP_TITLE = "힘과 우리 생활"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.today(["힘", "무게", "수평", "받침점", "저울", "전자저울", "용수철저울", "도구", "지레", "빗면"],
                   "오늘 배울 낱말은 힘, 무게, 수평, 받침점, 저울, 전자저울, 용수철저울, 도구, 지레, 빗면이에요.", cols=5)
        self.w_force()
        self.w_weight()
        self.w_level()
        self.w_scale()
        self.w_escale()
        self.w_spring()
        self.w_tool()
        self.w_lever()
        self.w_slope()
        self.quiz([
            (["물체가 가볍고 무거운 정도"], ["힘", "무게", "수평", "빗면"], 1, "정답은 2번, 무게예요. 물체가 가볍고 무거운 정도를 무게라고 해요."),
            (["시소처럼 어느 쪽으로도 기울어지지 않은 상태"], ["받침점", "지레", "수평", "저울"], 2,
             "정답은 3번, 수평이에요."),
            (["받침대에 올린 판을 이용해 물체를 들어 올리는 도구"], ["빗면", "지레", "저울", "용수철저울"], 1,
             "정답은 2번, 지레예요."),
            (["물체의 무게를 정확하게 비교하기 위해 사용하는 것"], ["저울", "받침점", "도구", "힘"], 0,
             "정답은 1번, 저울이에요. 저울을 사용하면 무게를 정확하게 비교할 수 있어요."),
        ])
        self.closing(f"무게는 {o('저울')}로 정확하게 비교하고\n{o('지레')}·{o('빗면')} 같은 도구로 {g('더 작은 힘')}을 써요",
                     next_preview="과학 낱말 사전 3학년 · 동물의 생활")
        self.wait(0.5)

    # ── 1 힘 ──
    def w_force(self):
        self.word(1, "힘", [f"물체를 {o('밀거나 당겨서')} 움직일 때 {o('힘')}이 들어요",
                            f"무거운 물체일수록 {r('더 큰 힘')}이 들어요"],
                  f"밀거나 당겨서 움직일 때 {o('힘')}이 들어요",
                  "물체를 밀거나 당겨서 움직이려면 힘을 주어야 해요. 무거운 물체를 밀거나 당길 때는 더 큰 힘이 들어요. 힘.")
        self.drop_card()
        ph = F.photo("w3u11/cart", height=PH_H).move_to([0, PH_Y, 0])
        self.say("물건을 가득 담은 카트를 밀어요", "마트에서 물건을 가득 담은 카트를 밀어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["cart_handle"], "미는 힘", to=(-2.6, -0.2))
        self.say(f"빈 카트보다 {r('더 큰 힘')}이 들어요", "물건을 가득 담으면 무거워져서, 빈 카트보다 밀 때 더 큰 힘이 들어요.")
        self.play(GrowArrow(a), FadeIn(t), run_time=0.7)
        self.word_end()

    # ── 2 무게 ──
    def w_weight(self):
        self.word(2, "무게", [f"물체가 가볍고 무거운 정도를 {o('무게')}라고 해요"],
                  f"가볍고 무거운 정도 = {o('무게')}", "물체가 가볍고 무거운 정도를 무게라고 해요. 무게.")
        self.drop_card()
        gnd = ground(-1.6, -6.0, 6.0)
        b1 = backpack(True, 1.5).move_to([-2.6, -1.6, 0], aligned_edge=DOWN)
        b2 = backpack(False, 1.5).move_to([2.6, -1.6, 0], aligned_edge=DOWN)
        c1 = T("교과서가 가득 든 책가방", 34).next_to(b1, DOWN, buff=0.3)
        c2 = T("빈 책가방", 34).next_to(b2, DOWN, buff=0.3)
        self.say(f"교과서가 가득 든 책가방이 {o('더 무거워요')}", "교과서가 가득 들어 있는 책가방은 빈 책가방보다 무거워요.")
        self.play(Create(gnd), FadeIn(b1), FadeIn(b2), FadeIn(c1), FadeIn(c2), run_time=0.8)
        self.play(Indicate(b1, color=ORANGE, scale_factor=1.08), run_time=0.7)
        self.settle()
        clear_stage(self, keep=(self.head,))
        bx = box(3.0, 2.2, "", "#E2C08D").move_to([-2.8, -1.6, 0], aligned_edge=DOWN)
        db = dumbbell(1.3).move_to([2.8, -1.6, 0], aligned_edge=DOWN)
        c1 = T("큰 빈 종이 상자", 34).next_to(bx, DOWN, buff=0.3)
        c2 = T("작은 쇠 아령", 34).next_to(db, DOWN, buff=0.3)
        self.say("크기가 크면 항상 더 무거울까요?", "생각 바로잡기. 크기가 크면 항상 더 무거울까요? 큰 빈 종이 상자와 작은 쇠 아령을 봐요.")
        self.play(FadeIn(bx), FadeIn(db), FadeIn(c1), FadeIn(c2), run_time=0.8)
        self.say(f"아니에요. 작은 쇠 아령이 {o('더 무거울')} 수 있어요",
                 "아니에요. 크기가 작아도 더 무거울 수 있어요. 작은 쇠 아령을 밀 때 더 큰 힘이 들어요.")
        self.play(Indicate(db, color=ORANGE, scale_factor=1.15), run_time=0.8)
        self.word_end()

    # ── 3 수평 · 받침점 ──
    def w_level(self):
        self.word(3, "수평", [f"시소처럼 어느 쪽으로도 {o('기울어지지 않은')} 상태를 {o('수평')}이라고 해요"],
                  f"어느 쪽으로도 기울어지지 않은 상태 = {o('수평')}",
                  "시소처럼 어느 쪽으로도 기울어지지 않은 상태를 수평이라고 해요. 수평.")
        self.drop_card()
        ph = F.photo("w3u11/seesaw", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"시소가 {o('수평')}을 이루었어요", "놀이터의 시소가 어느 쪽으로도 기울어지지 않았어요. 수평을 이루었어요.")
        self.play(FadeIn(ph), run_time=0.7)
        ln = F.arrow(ph.at(140, 470), ph.at(1780, 470), color=GREEN)
        self.play(GrowArrow(ln), run_time=0.6)
        self.settle()
        clear_stage(self, keep=(self.head,))
        # 받침점
        new_head = T("받침점", 64, self.accent).move_to(self.head)
        self.section("낱말 4")
        self.play(FadeOut(self.head), FadeIn(new_head), run_time=0.6)
        self.head = new_head
        self.say(o("받침점"), "받침점.")
        bd = Board(center=[0, -0.9, 0], half=4.6)
        self.add(bd.stand, bd.plank)
        from manim import Circle
        rg = Circle(radius=0.42, stroke_color=ORANGE, stroke_width=8).move_to(bd.pivot + UP * 0.1)
        a = F.arrow(bd.pivot + np.array([1.9, -1.0, 0]), bd.pivot + np.array([0.4, -0.15, 0]))
        t = F.name_tag("받침점", 40, INK, stroke=ORANGE).move_to(bd.pivot + np.array([2.7, -1.1, 0]))
        self.say(f"받침대와 판이 맞닿는 부분 = {o('받침점')}", "받침대와 판이 맞닿는 부분을 받침점이라고 해요. 받침점.")
        self.play(Create(rg), GrowArrow(a), FadeIn(t), run_time=0.8)
        self.settle()
        self.play(FadeOut(VGroup(rg, a, t)), run_time=0.3)
        b1 = bd.put(sq_block(ORANGE), "L", 3)
        b2 = bd.put(sq_block(BLUE), "R", 3)
        self.say(f"같은 거리에서 {o('수평')}이면 두 물체의 무게는 {g('같아요')}",
                 "받침점으로부터 서로 같은 거리에 있는 두 물체가 수평을 이루면, 두 물체의 무게는 같아요.")
        self.play(FadeIn(b1), FadeIn(b2), run_time=0.6)
        self.settle()
        b3 = sq_block(ORANGE)
        bd.put(b3, "L", 3)
        self.say(f"판이 기울어지면 {o('기울어진 쪽')}이 더 무거워요", "물체를 하나 더 올렸더니 판이 기울어졌어요. 판이 기울어진 쪽의 물체가 더 무거워요.")
        self.play(FadeIn(b3), run_time=0.4)
        self.play(bd.tilt_to(-0.16), run_time=1.0)
        self.word_end()

    # ── 5 저울 ──
    def w_scale(self):
        self.word(5, "저울", [f"물체의 무게를 {o('정확하게')} 비교하기 위해 {o('저울')}을 사용해요"],
                  f"무게를 정확하게 비교할 때 {o('저울')}을 써요",
                  "손으로 들어 본 느낌은 사람마다 다를 수 있어요. 물체의 무게를 정확하게 비교하기 위해 저울을 사용해요. 저울.")
        self.drop_card()
        ph = F.photo("w3u11/balance", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"{o('양팔저울')}은 가운데에 받침점이 있어요",
                 "이것은 양팔저울이에요. 긴 막대의 양쪽에 저울접시가 매달려 있고, 가운데에 받침점이 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["bal_pivot"], "받침점", to=(2.8, -0.7))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.say(f"고기·과일을 살 때, 몸무게를 잴 때 {o('저울')}을 써요",
                 "일상생활에서는 고기, 과일 등을 살 때나 몸무게가 얼마나 늘었는지 비교할 때 저울을 사용해요.")
        self.word_end()

    # ── 6 전자저울 ──
    def w_escale(self):
        self.word(6, "전자저울", [f"{o('전자저울')}로 무게를 재어 정확하게 비교해요",
                                  f"무게의 단위: {o('그램(g)')}, {o('킬로그램(kg)')}"],
                  f"화면의 숫자로 무게를 읽는 {o('전자저울')}",
                  "전자저울로 무게를 재어 정확하게 비교할 수 있어요. 무게의 단위로는 그램이나 킬로그램을 사용해요. 전자저울.")
        self.drop_card()
        sc = e_scale("- - -").scale(1.7, about_point=np.zeros(3)).move_to([-2.6, -1.0, 0])
        steps = ["① 평평한 곳에 놓기", "② 전원 단추 누르기", "③ 영점 단추로 0 맞추기", "④ 올리고 숫자 읽기"]
        lst = VGroup(*[T(s, 38) for s in steps]).arrange(DOWN, buff=0.36, aligned_edge=LEFT).move_to([3.3, 0.2, 0])
        self.say("전자저울로 무게를 재는 차례예요",
                 "평평한 곳에 놓고, 전원 단추를 누르고, 영점 단추로 0을 맞춘 다음, 물체를 올리고 화면의 숫자를 읽어요.")
        self.play(FadeIn(sc), FadeIn(lst, lag_ratio=0.25), run_time=1.6)
        new = T("12.7 g", 30 * 1.7, "#7CF2A4").move_to(sc.num)
        self.say(f"화면에 {o('12.7 g')}이 나타나면 무게는 12.7 g", "화면에 12.7 g이 나타났어요. 이 학용품의 무게는 12.7 그램이에요.")
        self.play(FadeOut(sc.num), FadeIn(new), run_time=0.5)
        self.word_end()

    # ── 7 용수철저울 ──
    def w_spring(self):
        self.word(7, "용수철저울", [f"{o('고리')}에 물체를 걸고 {o('표시 자')}가 가리키는 눈금을 읽어",
                                    "물체의 무게를 비교해요"],
                  f"표시 자가 가리키는 눈금을 읽는 {o('용수철저울')}",
                  "용수철저울은 고리에 물체를 걸고, 표시 자가 가리키는 눈금을 읽어 물체의 무게를 비교해요. 용수철저울.")
        self.drop_card()
        ss = SpringScale(x=-0.6, y0=0.7, per_g=0.008, gmax=150)
        grp = ss.group()
        self.play(FadeIn(grp), run_time=0.7)
        tags = []
        for key, txt, to in (("ring", "손잡이", (-2.4, 0.0)), ("knob", "영점 조절 나사", (3.6, -0.3))):
            m = ss.parts[key]
            a = F.arrow(m.get_center() + np.array([to[0] * 0.7, to[1] * 0.7, 0]), m.get_center(), color=ORANGE)
            tg = F.name_tag(txt, 34, INK, stroke=ORANGE).move_to(m.get_center() + np.array([*to, 0]))
            tags += [a, tg]
        self.say(f"{o('영점 조절 나사')}로 표시 자를 0에 맞춰요", "먼저 영점 조절 나사를 돌려 표시 자를 눈금 0에 맞춰요.")
        self.play(*[FadeIn(x) for x in tags], run_time=0.7)
        self.settle()
        self.play(*[FadeOut(x) for x in tags], run_time=0.3)
        obj = box(0.8, 0.55, "", "#E58F65")
        obj.add_updater(lambda m: m.move_to(ss.hook_point() + DOWN * 0.3))
        self.add(obj)
        self.say(f"무거울수록 {o('표시 자')}가 더 아래를 가리켜요", "고리에 물체를 걸고, 표시 자가 멈추면 눈금을 읽어요. 표시 자와 눈높이를 맞추어 읽어요.")
        self.play(ss.w.animate.set_value(80), run_time=1.4)
        obj.clear_updaters()
        self.word_end()

    # ── 8 도구 ──
    def w_tool(self):
        self.word(8, "도구", [f"{o('지레')}나 {o('빗면')}과 같은 {o('도구')}를 이용하면",
                              f"물체의 무게보다 {g('작은 힘')}으로 물체를 들어 올릴 수 있어요"],
                  f"{o('도구')}를 쓰면 {g('더 작은 힘')}으로 들어 올려요",
                  "지레나 빗면과 같은 도구를 이용하면, 물체의 무게보다 작은 힘으로 물체를 들어 올릴 수 있어요. 도구.")
        self.drop_card()
        rows = [("직접 들어 올릴 때", 180, RED), ("지레를 이용할 때", 45, GREEN), ("빗면을 이용할 때", 40, GREEN)]
        grp = VGroup()
        for i, (nm, v, c) in enumerate(rows):
            y = 1.3 - i * 1.25
            lab = T(nm, 38).move_to([-4.3, y, 0])
            bar = force_bar(v, vmax=180, length=6.0, height=0.55, color=c).move_to([-1.9, y, 0], aligned_edge=LEFT)
            num = T(str(v), 40, c).next_to(bar, RIGHT, buff=0.25)
            grp.add(VGroup(lab, bar, num))
        self.say(f"우유를 들 때: 직접 {r('180')}, 지레 {g('45')}, 빗면 {g('40')}",
                 "우유를 직접 들어 올릴 때 드는 힘은 180, 지레를 이용하면 45, 빗면을 이용하면 40이었어요.")
        self.play(FadeIn(grp, lag_ratio=0.3), run_time=1.4)
        self.word_end()

    # ── 9 지레 ──
    def w_lever(self):
        self.word(9, "지레", [f"받침대에 올린 판을 이용해 물체를 들어 올리는 도구를 {o('지레')}라고 해요"],
                  f"받침대 + 판으로 들어 올리는 도구 = {o('지레')}",
                  "받침대에 올린 판을 이용해 물체를 들어 올리는 도구를 지레라고 해요. 지레.")
        self.drop_card()
        piv = np.array([-1.6, -1.2, 0])
        gnd = ground(-1.8, -6.0, 6.0)
        stand = Triangle(fill_color=SOFT, fill_opacity=1, stroke_width=0).scale(0.6)
        stand.stretch_to_fit_height(0.6).next_to(piv, DOWN, buff=0)
        plank = Rectangle(width=7.0, height=0.18, fill_color="#D9B47A", fill_opacity=1, stroke_color=BROWN_DARK, stroke_width=3)
        plank.move_to(piv + RIGHT * 1.9 + UP * 0.09)
        mk = box(0.9, 1.1, "", "#9CC9EC").move_to(piv + LEFT * 1.2 + UP * 0.18, aligned_edge=DOWN)
        lever = VGroup(plank, mk)
        t1 = F.name_tag("가까운 쪽에 물체", 32, INK, stroke=ORANGE).move_to(piv + np.array([-1.4, 2.0, 0]))
        t2 = F.name_tag("먼 쪽을 눌러요", 32, INK, stroke=ORANGE).move_to(piv + np.array([4.6, 2.0, 0]))
        push = F.arrow(piv + np.array([4.9, 1.5, 0]), piv + np.array([4.9, 0.4, 0]), color=RED)
        self.say(f"받침대에서 {o('가까운 쪽')}에 물체, {o('먼 쪽')}을 눌러요",
                 "받침대에서 가까운 쪽에 물체를 올려놓고, 받침대에서 먼 쪽을 눌러 물체를 들어 올려요.")
        self.play(Create(gnd), FadeIn(stand), FadeIn(lever), run_time=0.7)
        self.play(FadeIn(t1), FadeIn(t2), GrowArrow(push), run_time=0.6)
        self.play(Rotate(lever, -0.12, about_point=piv), push.animate.shift(DOWN * 0.5), run_time=1.2)
        self.settle()
        clear_stage(self, keep=(self.head,))
        ph = F.photo("w3u11/bottle_opener", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"{o('병따개')}는 지레를 이용하는 예예요", "병따개는 지레를 이용하는 예예요. 시소, 가위, 손톱깎이, 장도리, 펜치도 지레를 이용해요.")
        self.play(FadeIn(ph), run_time=0.7)
        self.word_end()

    # ── 10 빗면 ──
    def w_slope(self):
        self.word(10, "빗면", [f"나무판을 {o('비스듬히')} 올려 {o('빗면')}을 만들어요",
                               f"빗면을 따라 끌어 올리면 직접 들 때보다 {g('더 작은 힘')}이 들어요"],
                  f"{o('비스듬한 판')}이면 빗면이에요",
                  "받침대가 있으면 지레, 비스듬한 판이면 빗면이에요. 빗면을 따라 물체를 끌어 올리면 직접 들어 올릴 때보다 더 작은 힘이 들어요. 빗면.")
        self.drop_card()
        ph = F.photo("w3u11/ramp", height=PH_H).move_to([0, PH_Y, 0])
        self.say(f"건물 입구의 {o('경사로')}는 빗면을 이용한 예예요",
                 "건물 입구의 경사로는 빗면을 이용하는 예예요. 구불구불한 산길도 빗면을 이용해 더 작은 힘으로 올라갈 수 있어요.")
        self.play(FadeIn(ph), run_time=0.7)
        a, t = F.callout(ph, P["ramp_slope"], "빗면", to=(2.2, 1.2))
        self.play(GrowArrow(a), FadeIn(t), run_time=0.6)
        self.word_end()


class w3u11(W3U11):
    """render.sh가 폴더 이름 그대로 장면을 부름"""
    pass
