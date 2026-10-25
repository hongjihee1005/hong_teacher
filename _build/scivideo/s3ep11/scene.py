"""「과학 원리 돋보기」 3학년 11화 — 우리 주변에 사는 식물 (3-1 3단원 식물의 생활 3차시, 화 코드 3-1-3-b)

바탕: grade3/science/sem1/u3-2.html — 어디에서 식물을 볼 수 있나(아파트 화단·학교 정원·길가·공원과 뒷산),
씀바귀와 벚나무 생김새 표(키 작다/크다, 줄기 가늘고 초록색/굵고 갈색, 잎 길쭉한 모양/달걀 모양, 꽃 노란색/분홍색 또는 흰색),
식물도감 카드(둘 다 여러 해를 살고 우리 주변에 삶), 사계절 돌려 보기(겨울: 씀바귀는 씨나 땅속 부분, 벚나무는 잎을 떨어뜨리고 뿌리와 줄기),
풀과 나무 분류(제비꽃·명아주·애기똥풀·씀바귀 / 조팝나무·단풍나무·떡갈나무·벚나무),
한눈에 쏙(씀바귀는 키가 작고 줄기가 가늘지만, 떡갈나무는 키가 크고 줄기가 굵다), 공통점(뿌리·줄기·잎, 꽃·열매).
최종: ./make_final.sh s3ep11
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, RoundedRectangle, VGroup,
                   Circumscribe, Transform, DashedVMobject, Circle)

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage, person, tag
from kit_s3u13 import (DARK_GREEN, LEAF_EDGE, PINK, TRUNK, YELLOW, seed_tuft, small_herb, soil, sseumbagwi, tree)

GROUND_Y = -2.0


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


class S3Ep11(EpisodeScene):
    GRADE, SEM = 3, 1
    EP_NO = 11
    EP_TITLE = "우리 주변에 사는 식물"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.where()
        self.compare()
        self.table()
        self.seasons()
        self.herb_tree()
        self.common()
        self.closing(f"{g('풀')}은 키가 작고 줄기가 가늘고,\n{o('나무')}는 대부분 키가 크고 줄기가 굵어요",
                     next_preview="3학년 12화 · 물에 사는 식물과 부레옥잠")
        self.wait(0.5)

    # ── 어디에서 볼 수 있나 ──
    def where(self):
        self.section("궁금해요")
        places = VGroup(*[tag(s, LEAF_EDGE, 40) for s in ("아파트 화단", "학교 정원", "길가", "공원과 뒷산")]
                        ).arrange_in_grid(2, 2, buff=(0.8, 0.5)).move_to([0, 1.2, 0])
        self.say("우리 주변 어디에서 식물을 볼 수 있나요?", "우리 주변 어디에서 식물을 볼 수 있나요?")
        self.play(FadeIn(places, lag_ratio=0.25), run_time=1.2)
        plants = VGroup(small_herb(0.9, YELLOW, 1), small_herb(1.1, None, 2), tree(2.4, DARK_GREEN), small_herb(0.8, "#8E6CC8", 3),
                        tree(2.0, "#E0703A")).arrange(RIGHT, buff=0.9, aligned_edge=DOWN).move_to([0, -1.25, 0])
        self.say("생김새가 다른 여러 가지 식물이 살아요", "우리 주변에는 명아주, 단풍나무처럼 생김새가 다른 여러 가지 식물이 살고 있어요.")
        self.play(FadeIn(plants, lag_ratio=0.2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 씀바귀와 벚나무 견주기 ──
    def compare(self):
        self.section("관찰해요")
        gr = soil(y=GROUND_Y)
        s = sseumbagwi(0.9).shift([-4.6, GROUND_Y, 0])
        kid = person(1.9, ORANGE).shift([-1.9, GROUND_Y, 0])
        t = tree(4.6, PINK).shift([2.6, GROUND_Y, 0])
        st = tag("씀바귀", ORANGE, 34).move_to([-5.9, -0.5, 0])
        tt = tag("벚나무", RED, 34).move_to([5.3, 1.6, 0])
        self.say("씀바귀와 벚나무를 관찰해 봐요", "주변에서 씀바귀와 벚나무를 본 적이 있나요? 두 식물의 생김새를 관찰해 봐요.")
        self.play(FadeIn(gr), FadeIn(s), FadeIn(t), FadeIn(st), FadeIn(tt), run_time=1.0)
        self.say(f"씀바귀는 {o('어린이 무릎 높이')}, 벚나무는 어린이보다 {o('훨씬 커요')}",
                 "어린이와 키를 견주어 볼까요? 씀바귀는 어린이 무릎 높이 정도로 작고, 벚나무는 어린이보다 훨씬 커요.")
        self.play(FadeIn(kid, shift=UP * 0.2), run_time=0.6)
        note = T("(그림은 실제 크기 비율과 달라요)", 24, SOFT).move_to([-3.3, 2.7, 0])
        self.play(FadeIn(note), run_time=0.3)
        # 줄기 확대
        z1 = Circle(radius=0.62, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=5).move_to([-4.6, 1.5, 0])
        z1s = Line([-4.6, 1.0, 0], [-4.6, 2.0, 0], stroke_color="#4B8A37", stroke_width=6)
        z2 = Circle(radius=0.62, fill_color=PAPER, fill_opacity=1, stroke_color=INK, stroke_width=5).move_to([0.6, 1.0, 0])
        z2s = RoundedRectangle(corner_radius=0.05, width=0.5, height=1.0, fill_color=TRUNK, fill_opacity=1, stroke_width=0).move_to([0.6, 1.0, 0])
        self.say(f"씀바귀 줄기는 {o('가늘고 초록색')}, 벚나무 줄기는 {o('굵고 갈색')}",
                 "줄기를 확대해 보면, 씀바귀의 줄기는 가늘고 초록색이에요. 벚나무의 줄기는 굵고 갈색이에요.")
        l1 = Line(z1.get_bottom(), [-4.6, GROUND_Y + 0.5, 0], stroke_color=SOFT, stroke_width=3)
        l2 = Line(z2.get_right(), [2.45, GROUND_Y + 0.9, 0], stroke_color=SOFT, stroke_width=3)
        self.play(Create(l1), Create(l2), FadeIn(VGroup(z1, z1s)), FadeIn(VGroup(z2, z2s)), FadeOut(note), run_time=0.7)
        self.settle()
        clear_stage(self)

    def table(self):
        rows = [("키", "작다", "크다"), ("줄기", "가늘고 초록색", "굵고 갈색"),
                ("잎 모양", "길쭉한 모양", "달걀 모양"), ("꽃 색깔", "노란색", "분홍색 또는 흰색")]
        xs = [-4.4, -0.6, 3.8]
        head = VGroup(T("구분", 36, SOFT).move_to([xs[0], 2.3, 0]), T("씀바귀", 38, ORANGE).move_to([xs[1], 2.3, 0]),
                      T("벚나무", 38, RED).move_to([xs[2], 2.3, 0]))
        lines = VGroup(*[Line([-6.0, y, 0], [6.0, y, 0], stroke_color=SOFT, stroke_width=2) for y in (1.85, 0.85, -0.15, -1.15)])
        self.say("두 식물의 생김새를 표로 정리해요", "두 식물의 생김새를 표로 정리해 볼게요.")
        self.play(FadeIn(head), Create(lines), run_time=0.7)
        ys = [1.35, 0.35, -0.65, -1.65]
        narr = ["씀바귀는 키가 작고, 벚나무는 키가 커요.", "씀바귀는 줄기가 가늘고 초록색, 벚나무는 줄기가 굵고 갈색이에요.",
                "잎 모양은 씀바귀가 길쭉한 모양, 벚나무가 달걀 모양이에요.", "꽃 색깔은 씀바귀가 노란색, 벚나무가 분홍색 또는 흰색이에요."]
        for (a, b_, c), y, n in zip(rows, ys, narr):
            row = VGroup(T(a, 34, INK).move_to([xs[0], y, 0]), T(b_, 34, INK).move_to([xs[1], y, 0]), T(c, 34, INK).move_to([xs[2], y, 0]))
            self.say(f"{a}: 씀바귀 {b_} · 벚나무 {c}", n)
            self.play(FadeIn(row, shift=RIGHT * 0.2), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 사계절 ──
    def seasons(self):
        self.section("생활 방식")
        cards = VGroup(*[tag(s, LEAF_EDGE, 34) for s in ("사는 기간", "겨울을 나는 방법", "사는 곳")]).arrange(RIGHT, buff=0.5).move_to([0, 2.45, 0])
        self.say(f"식물의 생활 방식: {o('사는 기간 · 겨울나기 · 사는 곳')}",
                 "식물의 생활 방식에는 사는 기간, 겨울을 나는 방법, 사는 곳 등이 있어요.")
        self.play(FadeIn(cards, lag_ratio=0.2), run_time=0.8)
        self.say("씀바귀와 벚나무 모두 여러 해를 살고 우리 주변에 살아요",
                 "식물도감으로 조사해 보면, 씀바귀와 벚나무는 모두 여러 해를 살고 우리 주변에 살아요. 하지만 겨울을 나는 방법이 달라요.")
        gr = soil(y=GROUND_Y)
        sb = sseumbagwi(1.0).shift([-3.2, GROUND_Y, 0])
        tr = tree(3.4, PINK).shift([2.8, GROUND_Y, 0])
        lab = T("봄", 46, RED).move_to([0, 1.2, 0])
        self.play(FadeIn(gr), FadeIn(sb), FadeIn(tr), FadeIn(lab), run_time=0.8)
        self.say("봄: 벚나무에 벚꽃이 많이 피어요", "봄에는 벚나무에 벚꽃이 많이 피고, 씀바귀도 잎이 자라요.")
        tr2 = tree(3.4, "#4FA74A").shift([2.8, GROUND_Y, 0])
        self.say("여름: 벚나무 잎이 무성하고, 씀바귀에 노란 꽃이 피어요", "여름에는 벚나무 잎이 초록색으로 무성하고, 씀바귀에 노란색 꽃이 피어요.")
        self.play(Transform(tr, tr2), Transform(lab, T("여름", 46, GREEN).move_to(lab)), run_time=0.8)
        tr3 = tree(3.4, "#E8872F").shift([2.8, GROUND_Y, 0])
        seeds = VGroup(*[seed_tuft(0.5).move_to([-3.2 + dx, 0.3 + dy, 0]) for dx, dy in ((0.4, 0.1), (1.1, 0.6), (1.8, 0.2))])
        self.say("가을: 벚나무는 잎을 떨어뜨리고, 씀바귀는 씨를 날려 보내요",
                 "가을에는 벚나무가 잎을 떨어뜨려요. 씀바귀는 갓털이 달린 씨를 바람에 날려 보내요.")
        self.play(Transform(tr, tr3), Transform(lab, T("가을", 46, ORANGE).move_to(lab)), FadeIn(seeds, shift=UP * 0.4 + RIGHT * 0.4), run_time=1.0)
        self.pause_screen(5, "겨울에는 어떻게 될까요?")
        bare = tree(3.4, bare=True).shift([2.8, GROUND_Y, 0])
        under = VGroup(*[Line([-3.2 + dx, GROUND_Y - 0.1, 0], [-3.2 + dx * 1.3, GROUND_Y - 0.45, 0], stroke_color="#8B5A2B", stroke_width=4) for dx in (-0.15, 0, 0.15)])
        self.play(Transform(tr, bare), FadeOut(sb), FadeOut(seeds), FadeIn(under), Transform(lab, T("겨울", 46, BLUE).move_to(lab)), run_time=1.0)
        ring1 = DashedVMobject(Circle(radius=0.6, stroke_color="#E0A800", stroke_width=5), num_dashes=18).move_to([-3.2, GROUND_Y - 0.25, 0])
        self.say(f"씀바귀: 땅 위 부분은 시들고 {o('씨')}나 {o('땅속 부분')}으로 겨울을 나요",
                 "겨울이 되면 씀바귀는 땅 위 부분이 시들고, 남긴 씨나 땅속 부분으로 겨울을 나요.")
        self.play(Create(ring1), run_time=0.6)
        ring2 = DashedVMobject(RoundedRectangle(corner_radius=0.3, width=1.4, height=3.6, stroke_color="#E0A800", stroke_width=5),
                               num_dashes=30).move_to([2.8, GROUND_Y + 1.3, 0])
        self.say(f"벚나무: 잎을 떨어뜨리고 {o('뿌리와 줄기')}로 겨울을 나요",
                 "벚나무는 잎이 없이, 뿌리와 줄기가 살아남아 겨울을 나요.")
        self.play(Create(ring2), run_time=0.6)
        self.say(f"우리 주변에서 살기에 {g('알맞은')} 생김새와 생활 방식이에요",
                 "우리 주변 식물은 사계절이 뚜렷하고 추운 겨울이 있는 환경에서 살기에 알맞은 생김새와 생활 방식을 가지고 있어요.")
        self.settle()
        clear_stage(self)

    # ── 풀과 나무 ──
    def herb_tree(self):
        self.section("풀과 나무")
        lb = RoundedRectangle(corner_radius=0.25, width=6.3, height=4.6, fill_color=PAPER, fill_opacity=0.85,
                              stroke_color=GREEN, stroke_width=5).move_to([-3.4, 0.25, 0])
        rb = lb.copy().set_stroke(TRUNK).move_to([3.4, 0.25, 0])
        lt = T("풀: 키가 작고 줄기가 가늘어요", 32, GREEN).next_to(lb.get_top(), DOWN, buff=0.2)
        rt = T("나무: 키가 크고 줄기가 굵어요", 32, TRUNK).next_to(rb.get_top(), DOWN, buff=0.2)
        self.say(f"줄기와 키를 보고 {g('풀')}과 {o('나무')}로 나누어요", "줄기와 키를 보고 풀과 나무로 나누어 볼까요?")
        self.play(FadeIn(lb), FadeIn(rb), FadeIn(lt), FadeIn(rt), run_time=0.7)
        herbs = ["제비꽃", "명아주", "애기똥풀", "씀바귀"]
        trees = ["조팝나무", "단풍나무", "떡갈나무", "벚나무"]
        hcol = ["#8E6CC8", None, YELLOW, YELLOW]
        tcol = ["#FFFFFF", "#E0703A", DARK_GREEN, PINK]
        hg = VGroup()
        for i, (n, c) in enumerate(zip(herbs, hcol)):
            p = small_herb(0.75, c, i) if n != "씀바귀" else sseumbagwi(0.85)
            nm = T(n, 28, INK).next_to(p, DOWN, buff=0.12)
            hg.add(VGroup(p, nm))
        hg.arrange(RIGHT, buff=0.45, aligned_edge=DOWN).move_to([-3.4, -0.8, 0])
        tg_ = VGroup()
        for i, (n, c) in enumerate(zip(trees, tcol)):
            p = tree(2.2 if n != "조팝나무" else 1.6, c if n != "조팝나무" else "#7FBF6A", flowers="#FFFFFF" if n == "조팝나무" else None)
            nm = T(n, 28, INK).next_to(p, DOWN, buff=0.12)
            tg_.add(VGroup(p, nm))
        tg_.arrange(RIGHT, buff=0.2, aligned_edge=DOWN).move_to([3.4, -0.35, 0])
        if tg_.width > 6.0:
            tg_.scale_to_fit_width(6.0)
        self.say(f"제비꽃 · 명아주 · 애기똥풀 · 씀바귀는 {g('풀')}", "제비꽃, 명아주, 애기똥풀, 씀바귀는 키가 작고 줄기가 가는 풀이에요.")
        self.play(FadeIn(hg, lag_ratio=0.2), run_time=1.0)
        self.say(f"조팝나무 · 단풍나무 · 떡갈나무 · 벚나무는 {o('나무')}", "조팝나무, 단풍나무, 떡갈나무, 벚나무는 대부분 키가 크고 줄기가 굵은 나무예요.")
        self.play(FadeIn(tg_, lag_ratio=0.2), run_time=1.0)
        self.say(f"풀은 겨울에 {o('씨나 땅속 부분')}, 나무는 {o('뿌리와 줄기')}로 겨울을 나요",
                 "풀은 겨울이 되면 씨를 남기거나 땅속 부분으로 겨울을 나고, 나무는 대부분 가을에 잎을 떨어뜨리고 뿌리와 줄기가 살아남아 겨울을 나요.")
        self.settle()
        clear_stage(self)

    # ── 공통점 ──
    def common(self):
        self.section("정리해요")
        box = RoundedRectangle(corner_radius=0.3, width=12.6, height=2.0, fill_color=PAPER, fill_opacity=1,
                               stroke_color=GREEN, stroke_width=5).move_to([0, 1.5, 0])
        txt = M(f"씀바귀는 키가 {o('작고')} 줄기가 가늘지만,\n떡갈나무는 키가 {o('크고')} 줄기가 굵어요", 40).move_to(box)
        self.say("한눈에 쏙 정리해요", "한눈에 정리해 볼게요. 씀바귀는 키가 작고 줄기가 가늘지만, 떡갈나무는 키가 크고 줄기가 굵어요.")
        self.play(FadeIn(box), FadeIn(txt), run_time=0.8)
        com = M(f"공통점: 땅에 뿌리를 내리고 {g('뿌리 · 줄기 · 잎')}이 있으며\n꽃을 피우고 열매를 맺어요", 34).move_to([0, -0.9, 0])
        self.say(f"풀과 나무 모두 {g('뿌리 · 줄기 · 잎')}이 있어요",
                 "풀과 나무의 공통점도 있어요. 우리 주변 식물은 대부분 땅에 뿌리를 내리고 뿌리, 줄기, 잎이 있으며, 꽃을 피우고 열매를 맺어요.")
        self.play(FadeIn(com), run_time=0.7)
        self.settle()
        clear_stage(self)
