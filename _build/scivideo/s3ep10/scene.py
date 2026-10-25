"""「과학 원리 돋보기」 3학년 10화 — 잎으로 식물을 분류해요 (3-1 3단원 식물의 생활 2차시, 화 코드 3-1-3-a)

바탕: grade3/science/sem1/u3-1.html — 도입(블록을 색깔·모양으로 나누기, '예쁜 것'은 기준이 안 됨),
잎의 부분(잎몸·잎맥·잎자루·잎의 가장자리), 번호 붙임딱지 잎 1~6(단풍나무·감나무·강아지풀·민들레·벚나무·닭의장풀),
분류 기준으로 알맞은 것/알맞지 않은 것, 잎 분류 놀이(잎자루가 있는가? · 잎의 가장자리가 톱니 모양인가?),
기준이 달라지면 결과가 달라짐, 한눈에 쏙(잎은 전체적인 모양, 가장자리 모양 등을 기준으로 분류), 뿌리·줄기·꽃·열매로도 분류.
최종: ./make_final.sh s3ep10
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, RoundedRectangle, VGroup,
                   Circumscribe, Arrow, Cross)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, tag
from kit_s3u13 import LEAVES, LEAF_EDGE, leaf, leaf_card, round_block, star_block

YELLOW_B = "#FFC93C"


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bin_box(title, col, x, w=6.3, h=3.6, y=-0.55):
    box = RoundedRectangle(corner_radius=0.25, width=w, height=h, fill_color=PAPER, fill_opacity=0.9,
                           stroke_color=col, stroke_width=5).move_to([x, y, 0])
    t = T(title, 36, col).next_to(box.get_top(), DOWN, buff=0.2)
    return VGroup(box, t)


class S3Ep10(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 10
    EP_TITLE = "잎으로 식물을 분류해요"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.blocks()
        self.parts()
        self.six_leaves()
        self.criteria()
        self.sort_by("stalk", "잎자루가 있는가?")
        self.sort_by("saw", "잎의 가장자리가 톱니 모양인가?", second=True)
        self.summary()
        self.closing(f"잎은 {o('전체적인 모양')}, {o('가장자리 모양')} 등을\n기준으로 {g('분류')}할 수 있어요",
                     next_preview="3학년 11화 · 우리 주변에 사는 식물")
        self.wait(0.5)

    # ── 블록 나누기 ──
    def blocks(self):
        self.section("궁금해요")
        spec = [("y", "c"), ("b", "s"), ("y", "s"), ("b", "c"), ("y", "c"), ("b", "s"), ("b", "c"), ("y", "s")]
        bl = VGroup()
        for i, (c, s) in enumerate(spec):
            col = YELLOW_B if c == "y" else BLUE
            m = round_block(col) if s == "c" else star_block(col)
            m.kind = (c, s)
            m.move_to([-5.0 + i * 1.43, 0.6 + (0.5 if i % 2 else -0.3), 0])
            bl.add(m)
        self.say("블록을 두 무리로 나누어 볼까요?", "블록들을 두 무리로 나누어 볼까요?")
        self.play(FadeIn(bl, lag_ratio=0.1), run_time=1.0)
        self.pause_screen(5, "어떤 기준으로 나눌 수 있을까요?")
        line = Line([0, 2.6, 0], [0, -1.3, 0], stroke_color=SOFT, stroke_width=4)

        def arrange(key):
            L = [m for m in bl if key(m)]
            R = [m for m in bl if not key(m)]
            anims = []
            for side, arr in ((-1, L), (1, R)):
                for j, m in enumerate(arr):
                    anims.append(m.animate.move_to([side * 3.2 + (j % 2 - 0.5) * 1.3, 1.3 - (j // 2) * 1.1, 0]))
            return anims
        lt, rt = T("노란색 블록", 36, INK).move_to([-3.2, 2.5, 0]), T("파란색 블록", 36, INK).move_to([3.2, 2.5, 0])
        self.say(f"{o('색깔')}로 나누면 노란색 블록과 파란색 블록", "색깔을 기준으로 나누면, 노란색 블록과 파란색 블록으로 나눌 수 있어요.")
        self.play(Create(line), *arrange(lambda m: m.kind[0] == "y"), FadeIn(lt), FadeIn(rt), run_time=1.2)
        lt2, rt2 = T("원 모양 블록", 36, INK).move_to(lt), T("별 모양 블록", 36, INK).move_to(rt)
        self.say(f"{o('모양')}으로 나누면 원 모양 블록과 별 모양 블록", "모양을 기준으로 나누면, 원 모양 블록과 별 모양 블록으로 나눌 수 있어요.")
        self.play(*arrange(lambda m: m.kind[1] == "c"), FadeOut(lt), FadeOut(rt), FadeIn(lt2), FadeIn(rt2), run_time=1.2)
        self.say("분류 기준에 따라 분류 결과가 달라져요", "분류 기준은 여러 가지일 수 있고, 기준에 따라 분류 결과가 달라져요.")
        q = tag("예쁜 것으로 나누기?", RED, 40).move_to([0, -1.9, 0])
        self.say(f"'예쁜 것'은 {r('사람마다 생각이 달라요')}", "예쁜 것으로 나누면 어떨까요? 예쁘다는 생각은 사람마다 달라서 결과가 달라져요.")
        self.play(FadeIn(q, scale=0.8), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 잎의 부분 ──
    def parts(self):
        self.section("관찰해요")
        lf = leaf("ovate", True, 2.0).rotate(-0.5).move_to([-1.2, 0.3, 0])
        self.say("식물의 잎을 자세히 살펴봐요", "먼저 잎의 각 부분 이름을 알아봐요.")
        self.play(FadeIn(lf, scale=0.8), run_time=0.8)
        blade_c = lf.blade.get_center()
        items = [
            ("잎몸", "잎의 넓은 부분", lf.blade.get_center() + LEFT * 0.4 + UP * 0.6, [-5.6, 2.2, 0]),
            ("잎맥", "잎몸에 선처럼 보이는 것", blade_c + RIGHT * 0.15 + UP * 0.15, [4.0, 2.3, 0]),
            ("잎자루", "잎몸과 줄기를 이어 주는 가는 부분", lf.stalk.get_center(), [-5.4, -1.6, 0]),
            ("잎의 가장자리", "잎몸의 둘레", max(lf.blade.get_vertices(), key=lambda p: p[0] - 0.3 * p[1]), [4.4, -0.9, 0]),
        ]
        narr = ["잎의 넓은 부분을 잎몸이라고 해요.", "잎몸에 선처럼 보이는 것을 잎맥이라고 해요.",
                "잎몸과 줄기를 이어 주는 가는 부분을 잎자루라고 해요.", "잎몸의 둘레는 잎의 가장자리예요. 이 잎은 가장자리가 톱니 모양이에요."]
        for (nm, desc, pt, pos), n in zip(items, narr):
            tg = tag(nm, LEAF_EDGE, 38).move_to(pos)
            ar = Arrow(tg.get_center(), pt, buff=0.04, stroke_color=LEAF_EDGE, stroke_width=5, max_tip_length_to_length_ratio=0.12)
            self.say(f"{o(nm)} — {desc}", n)
            self.play(Create(ar), FadeIn(tg, scale=0.8), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 번호 붙임딱지 잎 ──
    def six_leaves(self):
        cards = VGroup(*[leaf_card(L) for L in LEAVES]).arrange(RIGHT, buff=0.22).move_to([0, 0.3, 0])
        self.cards = cards
        self.say("번호 붙임딱지를 붙인 잎 여섯 장이에요", "번호 붙임딱지를 붙인 잎 여섯 장이에요. 이름을 몰라도 번호로 구분하면 돼요.")
        self.play(FadeIn(cards, lag_ratio=0.15), run_time=1.4)
        self.say("모양 · 가장자리 · 잎자루 · 잎맥을 살펴봐요",
                 "잎의 모양, 가장자리, 잎자루, 잎맥을 살펴봐요.")
        self.play(Indicate(cards[0][1], scale_factor=1.15, color=None), Indicate(cards[2][1], scale_factor=1.15, color=None), run_time=1.0)
        self.say("1번 손바닥 모양, 2번 달걀 모양, 3번 좁고 길쭉한 모양…",
                 "1번은 손바닥 모양, 2번은 달걀 모양, 3번은 좁고 길쭉한 모양이에요. 잎마다 생김새가 달라요.")
        names = [c.name_t for c in cards]
        self.say("이름도 알아볼까요?", "이름은 단풍나무, 감나무, 강아지풀, 민들레, 벚나무, 닭의장풀이에요.")
        self.play(*[n.animate.set_opacity(1) for n in names], run_time=0.8)
        self.settle()
        self.play(cards.animate.scale(0.75).move_to([0, 1.95, 0]), run_time=0.7)

    # ── 분류 기준 ──
    def criteria(self):
        self.section("분류 기준")
        good = ["잎자루가 있는가?", "잎의 가장자리가 톱니 모양인가?", "잎맥이 그물 모양인가?"]
        bad = [("잎이 예쁜가?", "사람마다 생각이 달라요"), ("잎이 짧은가?", "무엇과 비교하느냐에 따라 달라요")]
        self.say(f"누가 분류해도 {g('같은 결과')}가 나와야 좋은 분류 기준이에요",
                 "누가 분류해도 같은 결과가 나와야 좋은 분류 기준이에요.")
        gl = VGroup(*[T("○  " + s, 34, GREEN) for s in good]).arrange(DOWN, aligned_edge=LEFT, buff=0.28)
        gl.move_to([-3.4, -0.75, 0])
        bl = VGroup(*[VGroup(T("×  " + s, 34, RED), T(w, 26, SOFT)).arrange(DOWN, aligned_edge=LEFT, buff=0.08) for s, w in bad]
                    ).arrange(DOWN, aligned_edge=LEFT, buff=0.3).move_to([3.6, -0.75, 0])
        self.say(f"잎자루 · 톱니 · 잎맥 → {g('알맞아요')}", "잎자루, 톱니, 잎맥 기준은 누가 보아도 결과가 똑같이 나와요.")
        self.play(FadeIn(gl, lag_ratio=0.3), run_time=1.0)
        self.say(f"예쁘다 · 짧다 → {r('알맞지 않아요')}", "예쁘다는 사람마다 다르고, 짧다는 무엇과 비교하느냐에 따라 달라서 알맞지 않아요.")
        self.play(FadeIn(bl, lag_ratio=0.3), run_time=1.0)
        self.settle()
        self.play(FadeOut(gl), FadeOut(bl), run_time=0.5)

    # ── 분류하기 ──
    def sort_by(self, key, title, second=False):
        self.section("분류해요")
        cards = self.cards
        head = M(f"분류 기준: {o(title)}", 40).move_to([0, 0.55, 0])
        yes = bin_box("그렇다.", GREEN, -3.4, h=2.45, y=-1.3)
        no = bin_box("그렇지 않다.", RED, 3.4, h=2.45, y=-1.3)
        self.say(f"기준 '{title}'로 나누어 봐요", f"{title.replace('?', '')}를 기준으로 나누어 볼게요.")
        self.play(FadeIn(head), FadeIn(yes), FadeIn(no), run_time=0.7)
        self.bring_to_front(cards)
        self.pause_screen(5 if not second else 4, "어느 잎이 어느 쪽에 들어갈까요?")
        ys = [i for i, L in enumerate(LEAVES) if L[key]]
        ns = [i for i, L in enumerate(LEAVES) if not L[key]]
        moves = []
        targets = {}
        for side, arr in ((-3.4, ys), (3.4, ns)):
            for j, i in enumerate(arr):
                targets[i] = [side + (j - 1) * 1.85, -1.55, 0]
        self.originals = getattr(self, "originals", [c.get_center().copy() for c in cards])
        for i, c in enumerate(cards):
            moves.append(c.animate.scale(0.82).move_to(targets[i]))
        ny = ", ".join(LEAVES[i]["name"] for i in ys)
        nn = ", ".join(LEAVES[i]["name"] for i in ns)
        self.say(f"그렇다: {ny}", f"그렇다에는 {ny} 잎이 들어가요.")
        self.play(*moves[:0], *[cards[i].animate.scale(0.82).move_to(targets[i]) for i in ys], run_time=1.0)
        self.say(f"그렇지 않다: {nn}", f"그렇지 않다에는 {nn} 잎이 들어가요.")
        self.play(*[cards[i].animate.scale(0.82).move_to(targets[i]) for i in ns], run_time=1.0)
        if key == "stalk":
            self.say("잎자루가 떨어져 나간 게 아니라 원래 없는 잎이에요",
                     "강아지풀, 민들레, 닭의장풀 잎은 잎자루가 떨어져 나간 게 아니라 원래 없는 잎이에요.")
        if second:
            self.say(f"분류 기준이 달라지면 {o('분류 결과')}도 달라져요",
                     "잎자루로 나눌 때와 결과가 다르지요? 그래서 분류할 때에는 어떤 기준으로 나누었는지 함께 말해요.")
            self.play(Circumscribe(head, color=ORANGE), run_time=1.2)
        self.settle()
        back = [cards[i].animate.scale(1 / 0.82).move_to(self.originals[i]) for i in range(len(cards))]
        self.play(*back, FadeOut(head), FadeOut(yes), FadeOut(no), run_time=0.9)
        if second:
            clear_stage(self)

    # ── 정리 ──
    def summary(self):
        self.section("정리해요")
        box = RoundedRectangle(corner_radius=0.3, width=12.6, height=2.0, fill_color=PAPER, fill_opacity=1,
                               stroke_color=GREEN, stroke_width=5).move_to([0, 1.3, 0])
        txt = M(f"잎은 {o('전체적인 모양, 가장자리 모양')},\n{o('잎자루의 유무, 잎맥 모양')} 등을 기준으로 분류해요", 38).move_to(box)
        self.say("잎의 생김새로 식물을 분류할 수 있어요",
                 "잎은 전체적인 모양, 가장자리 모양, 잎자루의 유무, 잎맥 모양 등을 기준으로 분류할 수 있어요.")
        self.play(FadeIn(box), FadeIn(txt), run_time=0.8)
        parts = VGroup(*[tag(s, LEAF_EDGE, 40) for s in ("뿌리", "줄기", "꽃", "열매")]).arrange(RIGHT, buff=0.5).move_to([0, -1.0, 0])
        self.say(f"잎뿐만 아니라 {o('뿌리 · 줄기 · 꽃 · 열매')}로도 분류해요",
                 "뿌리, 줄기, 꽃, 열매의 특징으로도 식물을 분류할 수 있어요.")
        self.play(FadeIn(parts, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)
