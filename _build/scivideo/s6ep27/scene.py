"""「과학 원리 돋보기」 6학년 27화 — 계절별 남중 고도와 낮의 길이 (6-2 1단원 계절의 변화 5차시, 화 코드 6-2-1-c)

바탕: grade6/science/sem2/u1-3.html(원본 _build_tb/src2/u1-3.html) — 도입(여름 오후 6시는 태양이 떠 있어 밝고 겨울은 져서 어두움),
천문 자료 조사(한국천문연구원 '생활 천문관', 서울특별시 2024년 매월 21일 오후 12시 30분, 겨울은 다음 해 1·2월 — 「실험관찰」 12쪽 예시 답안 값),
표·꺾은선그래프(남중 고도 6월 75.52° 가장 높음, 12월 29.00° 가장 낮음, 낮의 길이 6월 14시간 45분 가장 김, 12월 9시간 33분 가장 짧음),
계절별 태양이 지나는 길(여름 높고 길, 봄·가을 중간, 겨울 낮고 짧음), 남중 고도가 높을수록 낮이 길다, 여름 → 겨울,
계절별 나무 그림자(여름 가장 짧고 겨울 가장 김 — 앱 그림의 '나무 높이의 약 ○배'), 한눈에 쏙.
(태양이 지나는 길 그림은 서울 위도 37.5°로 그린 모양 그림 — 숫자는 앱 표의 값만 씀)
최종: ./make_final.sh s6ep27
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, ORIGIN, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Flash,
                   Rectangle, RoundedRectangle, Line, DashedLine, Ellipse, Circle, Dot, SurroundingRectangle, Polygon)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


MON = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2]
ALT = [52.47, 64.27, 72.42, 75.52, 72.44, 64.23, 52.58, 41.29, 32.22, 29.00, 32.30, 41.48]
DAYM = [(12, 10), (13, 23), (14, 21), (14, 45), (14, 22), (13, 24), (12, 12), (11, 1), (9, 59), (9, 33), (10, 0), (11, 2)]
DAY = [h + m / 60 for h, m in DAYM]


def dtxt(k, nl=False):
    h, m = DAYM[k]
    return f"{h}시간" + (("\n" if nl else " ") + f"{m}분" if m else "")


def tree(A, x, y=-1.3, H=1.1, col="#3F9A3F", bare=False):
    """앱 u1-3 나무 그림: 줄기 + 둥근 잎, 남중 고도 A°일 때 그림자(길이 = 나무 높이 H ÷ tan A)"""
    L = H / math.tan(A * K.RAD)
    g_ = VGroup()
    g_.add(Polygon([x - 0.05, y, 0], [x + L, y + 0.02, 0], [x + L - 0.08, y - 0.12, 0], [x - 0.05, y - 0.1, 0],
                   fill_color="#333333", fill_opacity=0.4, stroke_width=0))
    g_.add(Rectangle(width=0.13, height=0.62, fill_color="#8A5A2A", fill_opacity=1, stroke_width=0).move_to([x, y + 0.31, 0]))
    if bare:
        for dx, dy in ((-0.3, 0.45), (0.28, 0.42), (0.35, 0.25)):
            g_.add(Line([x, y + 0.5, 0], [x + dx, y + 0.5 + dy, 0], stroke_color="#8A5A2A", stroke_width=5))
    else:
        g_.add(Circle(radius=0.38, fill_color=col, fill_opacity=1, stroke_width=0).move_to([x, y + H - 0.3, 0]))
    g_.L = L
    return g_


class S6Ep27(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 27
    EP_TITLE = "계절별 남중 고도와 낮의 길이"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.survey()
        self.graph()
        self.paths()
        self.shadows()
        self.summary()
        self.closing(f"태양의 남중 고도가 높은 {o('여름')}에는 낮이 길고,\n남중 고도가 낮은 {g('겨울')}에는 낮이 짧아요",
                     next_preview="6학년 28화 · 태양 고도와 태양 에너지양")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")

        def panel(x, title, sky, sun):
            bg = RoundedRectangle(corner_radius=0.15, width=5.6, height=3.8, fill_color=sky, fill_opacity=1, stroke_width=0).move_to([x, 0.6, 0])
            gr = Rectangle(width=5.6, height=0.8, fill_color="#9CC77A" if sun else "#2E3B2A", fill_opacity=1, stroke_width=0).move_to([x, -0.95, 0])
            hs = VGroup(*[Rectangle(width=0.7, height=h, fill_color="#E3D3B6" if sun else "#3A3326", fill_opacity=1,
                                    stroke_color="#5A4A33", stroke_width=2).move_to([x - 1.8 + i * 0.9, -0.55 + h / 2, 0])
                          for i, h in enumerate((0.9, 1.3, 0.7, 1.1))])
            cap = K.label(title, INK, 28).move_to([x, 2.15, 0])
            gp = VGroup(bg, gr, hs, cap)
            if sun:
                gp.add(K.sun_icon(0.3).move_to([x + 2.0, 0.1, 0]))
            else:
                for i in range(9):
                    gp.add(Dot([x - 2.4 + K.rnd(i, 1) * 4.8, 0.6 + K.rnd(i, 2) * 1.2, 0], radius=0.035, color=PAPER))
            return gp
        a = panel(-3.2, "여름 오후 6시", K.SKY, True)
        b = panel(3.2, "겨울 오후 6시", "#1D2F52", False)
        self.say(f"여름과 겨울의 {o('오후 6시')}는 어떻게 다를까요?", "여름과 겨울에 오후 여섯 시의 모습은 어떻게 다를까요?")
        self.play(FadeIn(a), FadeIn(b), run_time=0.9)
        self.settle()
        self.say(f"여름은 태양이 떠 있어 {o('밝고')}, 겨울은 태양이 져서 {g('어두워요')}",
                 "여름 오후 여섯 시에는 태양이 떠 있어 밝고, 겨울 오후 여섯 시에는 태양이 져서 어두워요. 여름에는 태양이 더 일찍 뜨고 더 늦게 져요.")
        self.play(Indicate(a[-1], color=ORANGE), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 조사 ──
    def survey(self):
        self.section("천문 자료 조사")
        card = K.text_card([f"한국천문연구원 천문우주지식정보 {o('‘생활 천문관’')}",
                            "서울특별시 · 2024년 · 매월 21일 · 오후 12시 30분"], size=30).move_to([1.0, 2.15, 0])
        self.say(f"달마다 {o('남중 고도')}와 {o('낮의 길이')}를 조사해요",
                 "한국천문연구원의 생활 천문관에서, 매월 이십일 일의 태양의 남중 고도와 낮의 길이를 조사해요.")
        self.play(FadeIn(card), run_time=0.7)
        head = ["달"] + [f"{m}월" for m in MON]
        rows = [["남중 고도(°)"] + [f"{v:.2f}" for v in ALT],
                ["낮의 길이"] + [dtxt(k, True) for k in range(12)]]
        tb = K.result_table(head, rows, [1.9] + [0.92] * 12, row_h=0.95, size=22).move_to([0, 0.0, 0])
        self.tb = tb
        note = T("「실험관찰」 예시 답안 · 지역마다 값이 조금씩 달라요 · 1·2월은 다음 해", 24, SOFT).next_to(tb, DOWN, buff=0.2)
        self.play(FadeIn(tb), FadeIn(note), run_time=0.9)
        self.settle()
        self.pause_screen(5, "남중 고도가 가장 높은 달은?")
        c = tb.cells
        h6 = SurroundingRectangle(VGroup(c[1][4], c[2][4]), color=RED, buff=0.08, stroke_width=6)
        h12 = SurroundingRectangle(VGroup(c[1][10], c[2][10]), color=K.WINTER, buff=0.08, stroke_width=6)
        self.say(f"{r('6월')}은 남중 고도가 가장 높고 낮이 가장 길어요",
                 "6월은 태양의 남중 고도가 칠십오 점 오이 도로 가장 높고, 낮의 길이도 십사 시간 사십오 분으로 가장 길어요.")
        self.play(Create(h6), run_time=0.7)
        self.settle()
        self.say(f"12월은 남중 고도가 {g('가장 낮고')} 낮이 가장 짧아요",
                 "12월은 남중 고도가 이십구 도로 가장 낮고, 낮의 길이도 아홉 시간 삼십삼 분으로 가장 짧아요.")
        self.play(Create(h12), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 그래프 ──
    def graph(self):
        self.section("꺾은선그래프")
        xs = [f"{m}월" for m in MON]
        gr = K.LineGraph(xs, 20, 80, 10, w=9.0, h=3.3, center=(0, 0.6), unit="(°)", col=K.ALT_COL, size=24, xsize=24,
                         r_range=(9, 16, 1), r_unit="(시간)", r_col=K.DAY_COL)
        sea = VGroup()
        for i, (n, c) in enumerate((("봄", "#D6457A"), ("여름", "#3F9A3F"), ("가을", "#E08A00"), ("겨울", "#5A6E86"))):
            x0, x1 = gr.xi(3 * i) - gr.w / 24, gr.xi(3 * i + 2) + gr.w / 24
            sea.add(Line([x0 + 0.05, gr.y1 + 0.2, 0], [x1 - 0.05, gr.y1 + 0.2, 0], stroke_color=c, stroke_width=6))
            sea.add(T(n, 24, c).move_to([(x0 + x1) / 2, gr.y1 + 0.45, 0]))
        la, lb = gr.line(ALT, K.ALT_COL), gr.line(DAY, K.DAY_COL, right=True)
        da, db = gr.dots(ALT, K.ALT_COL), gr.dots(DAY, K.DAY_COL, right=True)
        leg = VGroup(VGroup(Line(ORIGIN, RIGHT * 0.5, stroke_color=K.ALT_COL, stroke_width=6), T("태양의 남중 고도", 24, K.ALT_COL)).arrange(RIGHT, buff=0.15),
                     VGroup(Line(ORIGIN, RIGHT * 0.5, stroke_color=K.DAY_COL, stroke_width=6), T("낮의 길이", 24, K.DAY_COL)).arrange(RIGHT, buff=0.15)
                     ).arrange(RIGHT, buff=0.6).next_to(gr, DOWN, buff=0.55)
        self.say("두 그래프를 한 모눈에 그려요", "조사한 결과를 꺾은선그래프로 나타내요. 두 그래프를 한 모눈에 그려요.")
        self.play(FadeIn(gr), FadeIn(sea), FadeIn(leg), run_time=0.8)
        self.play(FadeIn(da, lag_ratio=0.05), Create(la), run_time=1.4)
        self.play(FadeIn(db, lag_ratio=0.05), Create(lb), run_time=1.4)
        self.settle()
        self.say(f"두 그래프가 {o('함께')} 오르내려요", "두 그래프는 같은 모양으로 함께 오르내려요.")
        self.play(Indicate(VGroup(la, lb), color=ORANGE, scale_factor=1.03), run_time=1.0)
        self.settle()
        card = K.text_card([f"태양의 남중 고도가 {o('높을수록')} 낮의 길이가 {o('길어요')}"], size=30).move_to([0, -2.3, 0])
        self.say(f"남중 고도가 {o('높을수록')} 낮의 길이가 {o('길어요')}",
                 "태양의 남중 고도가 높을수록 낮의 길이가 길어요.")
        self.play(FadeOut(leg), FadeIn(card), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 태양이 지나는 길 ──
    def paths(self):
        self.section("태양이 지나는 길")
        d = K.SkyDome(R=3.6, k=0.3, center=(-2.0, -0.6), labels=False)
        labs = VGroup()
        for az, n, off in ((90, "동", LEFT), (180, "남", DOWN), (270, "서", RIGHT)):
            t = T(n, 30)
            bx = RoundedRectangle(corner_radius=0.08, width=0.6, height=0.52, fill_color=PAPER, fill_opacity=1, stroke_color=K.NAVY, stroke_width=3)
            t.move_to(bx)
            labs.add(VGroup(bx, t).move_to(d.xy(az, 0) + off * 0.45))
        su = d.sun_path(23.44, K.SUMMER, 7)
        sp = d.sun_path(0, K.SPRING, 7)
        wi = d.sun_path(-23.44, K.WINTER, 7)
        suns = VGroup(*[K.sun_icon(0.22).move_to(p.noon) for p in (su, sp, wi)])
        leg = VGroup(*[VGroup(Line(ORIGIN, RIGHT * 0.5, stroke_color=c, stroke_width=7), T(n, 26, c)).arrange(RIGHT, buff=0.15)
                       for n, c in (("여름", K.SUMMER), ("봄·가을", K.SPRING), ("겨울", K.WINTER))]
                     ).arrange(DOWN, buff=0.25, aligned_edge=LEFT).move_to([4.6, 1.6, 0])
        self.say("계절에 따라 태양이 지나는 길은 어떻게 다를까요?", "계절에 따라 태양이 지나는 길은 어떻게 다를까요?")
        self.play(FadeIn(d), FadeIn(labs), FadeIn(leg), run_time=0.7)
        self.play(Create(su), FadeIn(suns[0]), run_time=1.4)
        self.say(f"여름: 남쪽 하늘 {o('높이')}, 지나는 길이 {o('길어요')}",
                 "여름에는 태양이 남쪽 하늘 높이 지나가요. 남중 고도가 높고, 지나는 길이 길어 하늘에 떠 있는 시간이 길어요.")
        self.settle()
        self.play(Create(sp), FadeIn(suns[1]), run_time=1.2)
        self.say("봄·가을: 여름과 겨울의 중간 정도예요", "봄과 가을에는 남중 고도와 낮의 길이가 여름과 겨울의 중간 정도예요.")
        self.settle()
        self.play(Create(wi), FadeIn(suns[2]), run_time=1.0)
        self.say(f"겨울: 남쪽 하늘 {g('낮게')}, 지나는 길이 {g('짧아요')}",
                 "겨울에는 태양이 남쪽 하늘 낮게 지나가요. 남중 고도가 낮고, 지나는 길이 짧아 낮의 길이가 짧아요.")
        self.settle()
        card = K.text_card([f"여름 → 겨울: 남중 고도 {g('낮아지고')}", f"낮의 길이 {g('짧아져요')}"], size=24).move_to([4.3, -0.4, 0])
        self.say(f"여름에서 겨울로 갈수록 남중 고도는 낮아지고 낮은 {g('짧아져요')}",
                 "여름에서 겨울로 갈수록 태양의 남중 고도는 낮아지고, 낮의 길이는 짧아져요.")
        self.play(FadeIn(card), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 계절별 그림자 ──
    def shadows(self):
        self.section("계절별 그림자")
        idx = [(0, "봄", "#F39BB5", False), (3, "여름", "#3F9A3F", False), (6, "가을", "#E08A00", False), (9, "겨울", "#9AA9B4", True)]
        ps = VGroup()
        for j, (k, n, c, bare) in enumerate(idx):
            x = -5.1 + j * 3.4
            bg = RoundedRectangle(corner_radius=0.12, width=3.2, height=3.6, fill_color="#EAF6FD", fill_opacity=1, stroke_width=0).move_to([x, 0.5, 0])
            gr = Rectangle(width=3.2, height=0.5, fill_color="#EEF3F8" if bare else "#B8D98F", fill_opacity=1, stroke_width=0).move_to([x, -1.05, 0])
            tr = tree(ALT[k], x - 1.0, -0.8, col=c, bare=bare)
            cap = T(f"{n} ({MON[k]}월)", 28, INK).move_to([x, 2.0, 0])
            alt = T(f"남중 고도 {ALT[k]:.2f}°", 22, RED).move_to([x, 1.5, 0])
            sh = T(f"그림자: 높이의 약 {tr.L / 1.1:.1f}배", 22, K.SHD_COL).move_to([x, -1.65, 0])
            ps.add(VGroup(bg, gr, tr, cap, alt, sh))
        self.say(f"같은 시각, 계절마다 {o('나무 그림자')} 길이는?", "오후 열두 시 삼십 분 무렵, 계절별로 나무의 그림자 길이를 비교해 봐요.")
        self.play(FadeIn(VGroup(*[VGroup(p[0], p[1], p[3], p[4]) for p in ps])), run_time=0.7)
        self.pause_screen(5, "그림자가 가장 짧은 계절은?")
        self.play(FadeIn(VGroup(*[VGroup(p[2], p[5]) for p in ps]), lag_ratio=0.2), run_time=1.2)
        self.say(f"여름에 {o('가장 짧고')}, 겨울에 {g('가장 길어요')}",
                 "그림자는 남중 고도가 높은 여름에 가장 짧고, 남중 고도가 낮은 겨울에 가장 길어요.")
        self.play(Indicate(ps[1][2], color=ORANGE), Indicate(ps[3][2], color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"태양의 남중 고도가 높은 {o('여름')}에는 낮의 길이가 길고,",
                            f"태양의 남중 고도가 낮은 {g('겨울')}에는 낮의 길이가 짧습니다."], size=34).move_to([0, 0.6, 0])
        self.say(f"남중 고도가 높은 {o('여름')}은 낮이 길고, 낮은 {g('겨울')}은 짧아요",
                 "태양의 남중 고도가 높은 여름에는 낮의 길이가 길고, 태양의 남중 고도가 낮은 겨울에는 낮의 길이가 짧아요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
