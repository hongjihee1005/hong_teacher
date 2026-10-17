"""「수학 원리 돋보기」 6학년 47화 — 위·앞·옆에서 본 모양 (6-2 3단원 4차시, 화 코드 6-2-3-c)

앞과 뒤, 오른쪽과 왼쪽에서 본 모양은 좌우로 뒤집으면 같으므로 위, 앞, 옆(오른쪽)의 세 방향에서 본 모양만 알면 됨
위에서 본 모양은 바닥에 닿은 면, 앞과 옆에서 본 모양은 각 방향 세로줄의 가장 높은 층의 수만큼 그림
위, 앞, 옆에서 본 모양이 같아도 숨어 있는 부분 때문에 개수가 여러 가지일 수 있음
(예시 모양: 이 영상에서 정한 모양)
최종: GRADE=6 ./make_final.sh 47
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, EpisodeScene, M, T, b, g, o
from division import clear_stage
from cubes import flat, front_view, heights_cells, side_view, stack, top_view

H = {(0, 0): 1, (1, 0): 2, (2, 0): 1, (0, 1): 3, (1, 1): 1}
H2 = {(0, 0): 1, (1, 0): 2, (2, 0): 1, (0, 1): 3, (1, 1): 2}   # 같은 세 모양, 개수 9 (H는 8)
VC = "#7C9CC9"


class G6Ep47(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 47
    EP_TITLE = "위·앞·옆에서 본 모양"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.three()
        self.many()
        self.closing(f"{o('위')}·{b('앞')}·{g('옆')}에서 본 모양으로 쌓은 모양을 나타내요\n앞·옆에서 본 모양은 줄마다 {o('가장 높은 층')}만큼",
                     next_preview="6학년 48화 · 위에서 본 모양에 수 쓰기")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("쌓기나무로 만든 모양을 위, 앞, 옆에서 보면\n어떤 모양일까요?", 42).move_to([0.6, 2.2, 0])
        self.say("세 방향에서 보면?", "쌓기나무로 만든 모양을 위, 앞, 옆에서 보면 각각 어떤 모양일까요?")
        self.play(Write(q), run_time=0.9)
        st = stack(heights_cells(H), s=0.75, center=(0, -0.5, 0))
        self.play(FadeIn(st), run_time=0.6)
        self.wait(0.6)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def three(self):
        self.section("세 방향에서 본 모양")
        st = stack(heights_cells(H), s=0.62, center=(-4.4, 0.4, 0))
        self.play(FadeIn(st), run_time=0.4)
        why = M("앞·뒤, 오른쪽·왼쪽은\n뒤집으면 같은 모양", 26, SOFT).move_to([-4.4, -1.6, 0])
        self.say("세 방향이면 충분해요", "앞과 뒤, 오른쪽과 왼쪽에서 본 모양은 좌우로 뒤집으면 같아요. 그래서 위, 앞, 옆의 세 방향에서 본 모양만 알면 돼요.")
        self.play(FadeIn(why), run_time=0.5)
        tv = flat(top_view(H), s=0.5, center=(-1.2, 0.3, 0), color=VC, frame=(3, 2))
        fv = flat(front_view(H), s=0.5, center=(1.6, 0.6, 0), color=VC)
        sv = flat(side_view(H), s=0.5, center=(4.4, 0.6, 0), color=VC)
        lt = M(o("위"), 32).next_to(tv, UP, buff=0.2)
        lf = M(b("앞"), 32).move_to([1.6, 1.8, 0])
        ls = M(g("옆"), 32).move_to([4.4, 1.8, 0])
        self.say(f"{o('위')}에서 본 모양 = 바닥에 닿은 면", "위에서 본 모양은 바닥에 닿은 면의 모양과 같아요.")
        self.play(FadeIn(tv), FadeIn(lt), run_time=0.6)
        nf = M("줄마다 가장 높은 층\n3 · 2 · 1", 24, SOFT).next_to(fv, DOWN, buff=0.2)
        self.say(f"{b('앞')}에서는 줄마다 가장 높은 층", "앞에서 본 모양은 왼쪽 줄부터 세로줄마다 가장 높은 층의 수만큼 그려요. 3층, 2층, 1층이에요.")
        self.play(FadeIn(fv), FadeIn(lf), FadeIn(nf), run_time=0.6)
        ns = M("왼쪽이 앞줄\n2 · 3", 24, SOFT).next_to(sv, DOWN, buff=0.2)
        self.say(f"{g('옆')}에서는 왼쪽이 앞줄", "오른쪽 옆에서 본 모양은 왼쪽이 앞줄이에요. 앞줄은 가장 높은 층이 2층, 뒷줄은 3층이에요.")
        self.play(FadeIn(sv), FadeIn(ls), FadeIn(ns), run_time=0.6)
        self.wait(1.0)
        self.settle()
        clear_stage(self, 0.6)

    def many(self):
        self.section("개수가 여러 가지일 수 있어요")
        a = stack(heights_cells(H), s=0.62, center=(-3.4, 1.0, 0))
        bb = stack(heights_cells(H2), s=0.62, center=(3.0, 1.0, 0), colors={(1, 1, 1): ORANGE})
        la = M(f"{b('8개')}", 36).move_to([-3.4, -0.6, 0])
        lb = M(f"{o('9개')}", 36).move_to([3.0, -0.6, 0])
        self.say("두 모양을 견주어 보아요", "이번에는 두 모양을 견주어 볼게요. 왼쪽은 8개, 오른쪽은 주황색 쌓기나무를 하나 더 얹어 9개예요.")
        self.play(FadeIn(a), FadeIn(bb), FadeIn(la), FadeIn(lb), run_time=0.7)
        same = M(f"위·앞·옆에서 본 모양은 {o('똑같아요')}", 36).move_to([0, -1.5, 0])
        self.say(f"세 방향 모양이 {o('같아도')} 개수가 다를 수 있어요", "그런데 두 모양을 위, 앞, 옆에서 본 모양은 똑같아요. 주황색 쌓기나무는 더 높은 쌓기나무에 가려 앞과 옆에서는 보이지 않거든요. 그래서 세 방향에서 본 모양만으로는 개수가 여러 가지일 수 있어요.")
        self.play(FadeIn(same), run_time=0.5)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
