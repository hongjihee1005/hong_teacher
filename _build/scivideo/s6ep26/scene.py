"""「과학 원리 돋보기」 6학년 26화 — 하루 동안 태양 고도·그림자 길이·기온 (6-2 1단원 계절의 변화 3~4차시, 화 코드 6-2-1-b)

바탕: grade6/science/sem2/u1-2.html(원본 _build_tb/src2/u1-2.html) — 도입(오전 8시 30분·오후 12시 30분·오후 4시 30분 무렵 그림:
태양의 위치와 높이, 그림자의 방향과 길이가 달라짐, 기온도 달라짐), 측정 방법(측정기를 평평한 곳에 → 그림자를 자와 나란하게 →
각도기 중심을 그림자 끝에, 같은 때 그림자 길이도 자로, 기온은 그늘진 곳 높이 1.5 m 정도, 태양을 직접 보지 않기),
한 시간 간격 측정(「실험관찰」 9쪽 예시 자료, 막대기 10 cm: 9:30~15:30 태양 고도·그림자 길이·기온),
하루 동안 변화, 남중·태양의 남중 고도(정남쪽), 꺾은선그래프 세 개, 고도와 기온은 모양이 비슷·그림자는 다름,
가장 높은 시각(고도 12시 30분 무렵, 기온 2시 30분 무렵 — 지표면이 데워지고 공기가 데워지는 데 시간이 걸림),
관계 정리, 그림자밟기(12시 30분 무렵이 가장 어려움), 한눈에 쏙.
최종: ./make_final.sh s6ep26
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Flash,
                   Rectangle, RoundedRectangle, Line, Ellipse, Circle, Polygon, SurroundingRectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


TIMES = ['9:30', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30']
ALT = [34.5, 43.5, 49.7, 51.7, 48.3, 42.2, 32.8]
SHD = [14.5, 10.5, 8.5, 7.9, 8.9, 11.0, 15.5]
TMP = [21.1, 23.0, 24.8, 26.1, 26.8, 27.0, 26.9]
XS = ['9:30', '', '11:30', '', '13:30', '', '15:30']


def kid(h=1.0):
    return VGroup(Line([-0.08, 0, 0], [-0.1, 0.35 * h, 0], stroke_color="#3B4A7A", stroke_width=7),
                  Line([0.08, 0, 0], [0.1, 0.35 * h, 0], stroke_color="#3B4A7A", stroke_width=7),
                  Polygon([-0.17, 0.33 * h, 0], [0.17, 0.33 * h, 0], [0.13, 0.78 * h, 0], [-0.13, 0.78 * h, 0],
                          fill_color="#E2573F", fill_opacity=1, stroke_color="#7A2A1F", stroke_width=2),
                  Circle(radius=0.13 * h, fill_color="#FFD9B0", fill_opacity=1, stroke_color="#7A4A20", stroke_width=2).move_to([0, 0.93 * h, 0]))


class S6Ep26(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 26
    EP_TITLE = "하루 동안 태양 고도·그림자 길이·기온"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.method()
        self.data()
        self.noon()
        self.graphs()
        self.peak()
        self.relation()
        self.summary()
        self.closing(f"하루 동안 태양 고도가 높아질수록\n그림자 길이는 {o('짧아지고')}, 기온은 {g('높아져요')}",
                     next_preview="6학년 27화 · 계절별 남중 고도와 낮의 길이")
        self.wait(0.5)

    # ── 궁금해요 ──
    def panel(self, x, t, sx, sy, sh, d):
        bg = RoundedRectangle(corner_radius=0.15, width=4.0, height=3.9, fill_color=K.SKY, fill_opacity=1, stroke_width=0).move_to([x, 0.55, 0])
        gr = Rectangle(width=4.0, height=1.0, fill_color=K.GRASS, fill_opacity=1, stroke_width=0).move_to([x, -0.9, 0])
        cap = K.label(t, "#7A4A00", 24).move_to([x, 2.15, 0])
        sun = K.sun_icon(0.25).move_to([x + sx, sy, 0])
        if d:
            shd = Ellipse(width=sh, height=0.2, fill_color="#3A5A2A", fill_opacity=0.5, stroke_width=0).move_to([x + d * sh / 2, -0.6, 0])
        else:
            shd = Ellipse(width=0.32, height=sh, fill_color="#3A5A2A", fill_opacity=0.5, stroke_width=0).move_to([x, -0.6 - sh / 2 + 0.05, 0])
        k_ = kid(1.0).move_to([x, -0.6, 0], aligned_edge=DOWN)
        labs = VGroup(T("동", 22).move_to([x - 1.75, -0.65, 0]), T("서", 22).move_to([x + 1.75, -0.65, 0]))
        return VGroup(bg, gr, labs, sun, shd, k_, cap)

    def intro(self):
        self.section("궁금해요")
        ps = VGroup(self.panel(-4.4, "오전 8시 30분 무렵", -1.5, 0.3, 1.9, 1),
                    self.panel(0, "오후 12시 30분 무렵", 0, 1.55, 0.55, 0),
                    self.panel(4.4, "오후 4시 30분 무렵", 1.5, 0.3, 1.9, -1))
        self.say("오전과 오후에 무엇이 달라졌을까요?", "오전과 오후, 세 그림에서 달라진 것은 무엇일까요?")
        self.play(FadeIn(ps, lag_ratio=0.3), run_time=1.5)
        self.settle()
        self.say(f"태양의 {o('위치와 높이')}, 그림자의 {o('방향과 길이')}가 달라져요",
                 "태양의 위치와 높이가 달라지면서, 그림자의 방향과 길이도 달라졌어요.")
        self.play(*[Indicate(p[3], color=ORANGE) for p in ps], run_time=0.9)
        self.play(*[Indicate(p[4], color=ORANGE, scale_factor=1.1) for p in ps], run_time=0.9)
        self.settle()
        self.say(f"하루 동안 {o('기온')}도 달라져요",
                 "몇 시간 전에는 태양이 위에 있었는데……. 하루 동안 기온도 달라져요.")
        self.settle()
        clear_stage(self)

    # ── 재는 방법 ──
    def method(self):
        self.section("재는 방법")
        gn = K.gnomon(40, 1.3, x0=-3.9, y0=-1.1, deg_label="태양 고도", size=26, board_w=3.6, sun_d=1.9)
        ln = K.label("그림자 길이: 자로", SOFT, 24).move_to([gn.get_center()[0] + 0.6, -1.62, 0])
        steps = K.text_card(["① 평평한 곳에 측정기를 놓아요",
                             "② 그림자가 자와 나란하게 해요",
                             "③ 각도기 중심을 그림자 끝에 맞춰 각을 읽어요",
                             f"같은 때 {o('그림자 길이')}도 자로 재요"], size=28).move_to([2.6, 1.3, 0])
        self.say("지난 시간에 만든 측정기로 태양 고도를 재요",
                 "지난 시간에 만든 태양 고도 측정기로 태양 고도를 재고, 같은 때 막대기의 그림자 길이도 자로 재요.")
        self.play(FadeIn(gn), FadeIn(steps), run_time=0.8)
        self.play(FadeIn(ln), Indicate(gn.shadow, color=ORANGE), run_time=0.8)
        self.settle()
        tm = K.text_card([f"기온은 {o('그늘진 곳')}, 높이 {o('1.5 m')} 정도에서"], size=30).move_to([3.4, -0.8, 0])
        self.say(f"기온은 {o('그늘진 곳')}의 높이 1.5 m 정도에서 재요",
                 "기온은 햇빛이 드는 땅바닥이 아니라, 그늘진 곳의 높이 일 점 오 미터 정도에서 온도계로 재요.")
        self.play(FadeIn(tm), run_time=0.6)
        self.settle()
        warn = K.safety_note("태양 빛에 눈을 다칠 수 있어요. 태양을 직접 보지 않고, 모자를 써요", w=12.4, size=27).move_to([0, -2.15, 0])
        self.say(f"태양을 {r('직접 보지 않아요')}", "태양 빛에 눈을 다칠 수 있으므로 태양을 직접 보지 않아요. 야외 활동 뒤에는 손을 씻어요.")
        self.play(FadeIn(warn), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 한 시간 간격 측정 ──
    def data(self):
        self.section("측정 결과")
        rows = [["태양 고도(°)"] + [f"{v:.1f}" for v in ALT],
                ["그림자 길이(cm)"] + [f"{v:.1f}" for v in SHD],
                ["기온(°C)"] + [f"{v:.1f}" for v in TMP]]
        tb = K.result_table(["측정 시각"] + TIMES, rows, [2.75] + [1.4] * 7, row_h=0.82, size=28).move_to([0, 0.75, 0])
        self.tb = tb
        note = T("「실험관찰」 예시 자료 · 막대기 길이 10 cm", 26, SOFT).next_to(tb, DOWN, buff=0.25)
        self.say(f"오전 9시 30분부터 {o('한 시간 간격')}으로 쟀어요",
                 "오전 아홉 시 삼십 분부터 오후 세 시 삼십 분까지, 한 시간 간격으로 일곱 번 측정했어요.")
        self.play(FadeIn(tb), FadeIn(note), run_time=0.9)
        self.pause_screen(6, "하루 동안 어떻게 달라졌나요?")
        cells = tb.cells if hasattr(tb, "cells") else None
        self.say(f"태양 고도는 점점 {o('높아졌다가')} 다시 낮아져요",
                 "태양 고도는 점점 높아졌다가 다시 낮아졌어요. 십이 시 삼십 분에 오십일 점 칠 도로 가장 높았어요.")
        if cells:
            self.play(Create(SurroundingRectangle(cells[1][4], color=ORANGE, buff=0.12, stroke_width=6)), run_time=0.8)
        self.settle()
        self.say(f"그림자 길이는 점점 {o('짧아졌다가')} 다시 길어져요",
                 "그림자 길이는 점점 짧아졌다가 다시 길어졌어요. 십이 시 삼십 분에 가장 짧았어요.")
        if cells:
            self.play(Create(SurroundingRectangle(cells[2][4], color=ORANGE, buff=0.12, stroke_width=6)), run_time=0.8)
        self.settle()
        self.say(f"기온은 점점 {o('높아졌다가')} 다시 낮아져요",
                 "기온은 점점 높아졌다가 다시 낮아졌어요.")
        if cells:
            self.play(Create(SurroundingRectangle(cells[3][6], color=ORANGE, buff=0.12, stroke_width=6)), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 남중 ──
    def noon(self):
        self.section("남중")
        sky = Rectangle(width=12.0, height=3.9, fill_color=K.SKY, fill_opacity=1, stroke_width=0).move_to([0, 0.75, 0])
        gr = Rectangle(width=12.0, height=0.8, fill_color=K.GRASS, fill_opacity=1, stroke_width=0).move_to([0, -1.6, 0])
        labs = VGroup(T("동", 30).move_to([-5.0, -1.6, 0]), T("남", 30).move_to([0, -1.6, 0]), T("서", 30).move_to([5.0, -1.6, 0]))
        pts = [np.array([-5.0 + 10 * u, -1.2 + 3.4 * math.sin(math.pi * u), 0]) for u in np.linspace(0, 1, 41)]
        from manim import VMobject, DashedVMobject
        path = DashedVMobject(VMobject().set_points_smoothly(pts).set_stroke("#F0A020", 4), num_dashes=40)
        sun = K.sun_icon(0.34).move_to(pts[20])
        vl = Line(pts[20] + DOWN * 0.45, [0, -1.2, 0], stroke_color=RED, stroke_width=4)
        self.say(f"태양 고도가 가장 높을 때 태양은 {o('정남쪽')}에 있어요",
                 "하루 중 태양 고도가 가장 높을 때, 태양은 어느 쪽에 있을까요? 바로 정남쪽이에요.")
        self.play(FadeIn(sky), FadeIn(gr), FadeIn(labs), Create(path), run_time=0.9)
        self.play(FadeIn(sun, scale=0.5), Create(vl), run_time=0.7)
        self.settle()
        card = K.text_card([f"태양이 {o('남중')}했다: 하루 중 태양 고도가 가장 높을 때",
                            f"이때의 태양 고도 = {g('태양의 남중 고도')}"], size=32).move_to([0, 1.65, 0])
        self.say(f"이때 태양이 {o('남중')}했다고 하고, 그 고도를 {g('남중 고도')}라고 해요",
                 "이때 태양이 남중했다고 하며, 이때의 태양 고도를 태양의 남중 고도라고 해요.")
        self.play(FadeIn(card), Flash(sun, color=ORANGE), run_time=0.8)
        self.settle()
        clear_stage(self)

    # ── 그래프 ──
    def graphs(self):
        self.section("꺾은선그래프")
        ga = K.LineGraph(XS, 30, 55, 5, w=3.5, h=2.6, center=(-4.35, 0.75), title="태양 고도", unit="(°)", size=20, xsize=18, col=K.ALT_COL)
        gs = K.LineGraph(XS, 0, 20, 5, w=3.5, h=2.6, center=(0.15, 0.75), title="그림자 길이", unit="(cm)", size=20, xsize=18, col=K.SHD_COL)
        gt = K.LineGraph(XS, 20, 30, 2, w=3.5, h=2.6, center=(4.65, 0.75), title="기온", unit="(°C)", size=20, xsize=18, col=K.TMP_COL)
        self.ga, self.gt = ga, gt
        la, ls, lt = ga.line(ALT, K.ALT_COL), gs.line(SHD, K.SHD_COL), gt.line(TMP, K.TMP_COL)
        da, ds, dt = ga.dots(ALT, K.ALT_COL), gs.dots(SHD, K.SHD_COL), gt.dots(TMP, K.TMP_COL)
        self.da, self.dt = da, dt
        self.say("측정 결과를 꺾은선그래프로 나타내요", "측정한 결과를 꺾은선그래프로 나타내요. 그래프마다 다른 색으로 그려요.")
        self.play(FadeIn(ga), FadeIn(gs), FadeIn(gt), run_time=0.8)
        self.play(FadeIn(da, lag_ratio=0.1), FadeIn(ds, lag_ratio=0.1), FadeIn(dt, lag_ratio=0.1), run_time=1.0)
        self.play(Create(la), Create(ls), Create(lt), run_time=1.4)
        self.settle()
        self.pause_screen(5, "모양이 비슷한 그래프는?")
        self.say(f"{o('기온')} 그래프는 태양 고도 그래프와 모양이 {o('비슷해요')}",
                 "기온 그래프는 태양 고도 그래프와 모양이 비슷해요. 함께 높아졌다가 낮아져요.")
        self.play(Indicate(VGroup(la, da), color=ORANGE, scale_factor=1.05), Indicate(VGroup(lt, dt), color=ORANGE, scale_factor=1.05), run_time=1.2)
        self.settle()
        self.say(f"{r('그림자 길이')} 그래프는 모양이 달라요 — 거꾸로예요",
                 "그림자 길이 그래프는 모양이 달라요. 태양 고도가 높을 때 그림자는 짧아요.")
        self.play(Indicate(VGroup(ls, ds), color=RED, scale_factor=1.05), run_time=1.0)
        self.settle()
        self.keep = VGroup(ga, gs, gt, la, ls, lt, da, ds, dt)

    def peak(self):
        self.section("가장 높은 시각")
        ga, gt = self.ga, self.gt
        ma = K.pointer(self.da[3].get_center(), (-4.35, -1.3), "오후 12시 30분 무렵", K.ALT_COL, 24)
        mt = K.pointer(self.dt[5].get_center(), (4.65, -1.3), "오후 2시 30분 무렵", K.TMP_COL, 24)
        self.say(f"태양 고도는 {o('12시 30분')}, 기온은 {r('2시 30분')} 무렵에 가장 높아요",
                 "태양 고도가 가장 높은 시각은 오후 열두 시 삼십 분 무렵이고, 기온이 가장 높은 시각은 오후 두 시 삼십 분 무렵이에요.")
        self.play(Flash(self.da[3], color=K.ALT_COL), FadeIn(ma), run_time=0.8)
        self.play(Flash(self.dt[5], color=K.TMP_COL), FadeIn(mt), run_time=0.8)
        self.settle()
        card = K.text_card([f"태양 빛 → {o('지표면')}이 데워지고 → 그 위의 {o('공기')}가 데워져요",
                            f"데워지는 데 {g('시간이 걸려')} 기온은 조금 늦게 가장 높아요"], size=24, pad=0.24)
        card.move_to([0, -1.1, 0], aligned_edge=UP)   # 그래프 아래 시각 글자(아래 끝 약 −0.9)와 겹치지 않게
        self.say(f"지표면과 공기가 데워지는 데 {g('시간이 걸리기')} 때문이에요",
                 "태양 빛을 받은 지표면이 데워지고, 그 위의 공기가 데워지는 데 시간이 걸리기 때문이에요.")
        self.play(FadeOut(ma), FadeOut(mt), FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 관계 ──
    def relation(self):
        self.section("관계 정리")
        hi = K.gnomon(60, 1.3, x0=-1.6, y0=0.1, string=False, arc=False, board_w=2.6, sun_d=1.6)
        lo = K.gnomon(25, 1.3, x0=3.2, y0=0.1, string=False, arc=False, board_w=3.9, sun_d=2.4)
        th = K.text_card([f"태양 고도 {o('높아지면')}", f"그림자 {o('짧아지고')}", f"기온 {o('높아져요')}"], size=26).move_to([-3.0, -1.3, 0])
        tl = K.text_card([f"태양 고도 {r('낮아지면')}", f"그림자 {r('길어지고')}", f"기온 {r('낮아져요')}"], size=26).move_to([3.3, -1.3, 0])
        self.say(f"태양 고도가 높아지면 그림자는 {o('짧아지고')} 기온은 {o('높아져요')}",
                 "태양 고도가 높아지면 그림자 길이는 짧아지고, 기온은 높아져요.")
        self.play(FadeIn(hi), FadeIn(th), run_time=0.8)
        self.settle()
        self.say(f"태양 고도가 낮아지면 그림자는 {r('길어지고')} 기온은 {r('낮아져요')}",
                 "태양 고도가 낮아지면 그림자 길이는 길어지고, 기온은 낮아져요.")
        self.play(FadeIn(lo), FadeIn(tl), run_time=0.8)
        self.settle()
        clear_stage(self)
        q = K.text_card([f"{o('그림자밟기')} 놀이에서 그림자를 밟기 가장 어려운 때는?"], size=34).move_to([0, 1.9, 0])
        opts = VGroup(*[K.word_card(t, w=3.9, h=1.0, size=30) for t in ("오전 9시 30분 무렵", "오후 12시 30분 무렵", "오후 3시 30분 무렵")]).arrange(RIGHT, buff=0.3).move_to([0, 0.3, 0])
        self.say("생활 속 문제예요", "그림자밟기 놀이를 할 때, 그림자를 밟기 가장 어려운 때는 언제일까요?")
        self.play(FadeIn(q), FadeIn(opts, lag_ratio=0.2), run_time=0.9)
        self.pause_screen(4, "언제일까요?")
        ok = K.ox_mark(True, 0.6).move_to(opts[1])
        self.say(f"태양 고도가 가장 높아 그림자가 {g('가장 짧은')} 12시 30분 무렵이에요",
                 "태양 고도가 가장 높아 그림자가 가장 짧은 오후 열두 시 삼십 분 무렵이에요.")
        self.play(Create(ok), Circumscribe(opts[1], color=GREEN), run_time=0.9)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"하루 중 태양 고도가 가장 높을 때 태양이 {o('남중')}했다고 하며,",
                            f"이때의 태양 고도를 {g('태양의 남중 고도')}라고 합니다.",
                            f"하루 동안 태양 고도가 높아질수록 그림자 길이는 짧아지고, 기온은 높아져요."], size=32).move_to([0, 0.6, 0])
        self.say(f"하루 중 가장 높을 때의 태양 고도, {g('태양의 남중 고도')}",
                 "하루 중 태양 고도가 가장 높을 때 태양이 남중했다고 하며, 이때의 태양 고도를 태양의 남중 고도라고 해요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
