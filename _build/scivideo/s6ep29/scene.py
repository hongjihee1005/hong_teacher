"""「과학 원리 돋보기」 6학년 29화 — 계절이 바뀌는 까닭 (6-2 1단원 계절의 변화 7차시 + 8~9차시 계절 축제, 화 코드 6-2-1-e)

바탕: grade6/science/sem2/u1-5.html(원본 _build_tb/src2/u1-5.html) — 도입(계절에 따라 풍경·옷차림·남중 고도·낮의 길이가 달라짐, 지구의 크기는 아님),
조건(다르게: 자전축 기울기 / 같게: 지구본 크기·거리·전등 높이·측정기), 장치(우리나라 위치에 측정기, 전등 중심 높이 = 지구본 중심 높이, 30 cm, 면장갑,
자전축은 늘 같은 방향), 공전시키며 그림자 길이(「실험관찰」 16~17쪽 예시 답안: 수직 가·나·다·라 모두 1.4 cm, 기울임 1.4·0.8·1.4·3.5 cm →
나 여름, 라 겨울), 무엇이 달라지나(기울어진 채: 모두 변함, 수직인 채: 변하지 않음), 계절 변화의 원인 영상(여름 북반구가 태양 쪽, 겨울 반대쪽),
남반구는 계절이 반대, '여름에 더운 것은 태양과 가까워서'는 옳지 않음, 한눈에 쏙.
생활 속: u1-6 계절 축제 안내(여름 수박 축제 6월 75.52°·14시간 45분, 겨울 눈꽃 축제 12월 29.00°·9시간 33분과 알맞은 안내).
최종: ./make_final.sh s6ep29
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, ORIGIN, Create, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Flash,
                   Rectangle, RoundedRectangle, Line, DashedLine, Circle, Dot, Transform, ReplacementTransform,
                   DashedVMobject, Arrow, SurroundingRectangle)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u21 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


POS = ["가", "나", "다", "라"]
SH_V = [1.4, 1.4, 1.4, 1.4]
SH_T = [1.4, 0.8, 1.4, 3.5]
TAU_T = [0.0, 23.5, 0.0, -23.5]
TOP_C = np.array([-4.35, 0.5, 0])
TOP_R = 1.25


def top_view(tilted=False):
    """위에서 본 공전 모형: 가운데 전등, 시계 반대 방향 공전, 가(위)·나(왼쪽)·다(아래)·라(오른쪽)"""
    g_ = VGroup(RoundedRectangle(corner_radius=0.15, width=4.2, height=3.85, fill_color="#11203E", fill_opacity=1, stroke_width=0).move_to(TOP_C + DOWN * 0.05))
    g_.add(DashedVMobject(Circle(radius=TOP_R, stroke_color="#9FB3C8", stroke_width=3).move_to(TOP_C), num_dashes=36))
    g_.add(K.lamp(0.75, "").move_to(TOP_C))
    g_.add(K.curved_arrow(TOP_R + 0.3, 0.3, 1.0, "#FFE680", 5, center=TOP_C))
    labs = VGroup()
    for k, n in enumerate(POS):
        a = math.pi / 2 + k * math.pi / 2
        p = TOP_C + TOP_R * np.array([math.cos(a), math.sin(a), 0])
        off = np.array([math.cos(a), math.sin(a), 0]) * 0.52
        lab = VGroup(Circle(radius=0.2, fill_color=PAPER, fill_opacity=1, stroke_width=0), T(n, 24, "#11203E")).move_to(p + off)
        labs.add(lab)
    g_.add(labs)
    g_.labs = labs
    cap = T("위에서 본 모습", 24, INK).move_to(TOP_C + np.array([0, -2.2, 0]))
    g_.add(cap)
    return g_


def top_earth(k, tilted):
    a = math.pi / 2 + k * math.pi / 2
    p = TOP_C + TOP_R * np.array([math.cos(a), math.sin(a), 0])
    e = VGroup(Circle(radius=0.2, fill_color="#2F7FC4", fill_opacity=1, stroke_color=PAPER, stroke_width=3).move_to(p))
    if tilted:
        e.add(Arrow(p, p + RIGHT * 0.5, buff=0, stroke_width=5, color=K.SUN_Y, max_tip_length_to_length_ratio=0.4))
    else:
        e.add(Dot(p, radius=0.05, color=K.SUN_Y))
    return e


class S6Ep29(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 29
    EP_TITLE = "계절이 바뀌는 까닭"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.setup_exp()
        self.experiment()
        self.cause()
        self.misc()
        self.festival()
        self.summary()
        self.closing(f"계절이 변하는 까닭은 지구의 {o('자전축이 기울어진 채')}\n태양 주위를 {g('공전')}하기 때문이에요",
                     next_preview="6학년 30화 · 서로 다른 물질을 섞으면?")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        names = [("우리 주변의 풍경", True), ("사람들의 옷차림", True), ("태양의 남중 고도", True), ("낮의 길이", True), ("지구의 크기", False)]
        cards = VGroup(*[K.word_card(n, w=3.8, h=0.95, size=30) for n, _ in names])
        cards[:3].arrange(RIGHT, buff=0.3)
        cards[3:].arrange(RIGHT, buff=0.3)
        VGroup(cards[:3], cards[3:]).arrange(DOWN, buff=0.35).move_to([0, 1.2, 0])
        marks = VGroup(*[K.ox_mark(ok, 0.22).move_to(c.get_corner(UP + RIGHT) + np.array([-0.05, 0.05, 0])) for c, (_, ok) in zip(cards, names)])
        self.say(f"계절에 따라 {o('달라지는 것')}은 무엇일까요?", "계절에 따라 달라지는 것에는 어떤 것이 있을까요?")
        self.play(FadeIn(cards, lag_ratio=0.12), run_time=1.0)
        self.settle()
        self.say(f"풍경·옷차림·{o('남중 고도')}·{o('낮의 길이')}가 달라져요",
                 "풍경, 옷차림, 남중 고도, 낮의 길이가 달라져요. 지구의 크기는 그대로예요.")
        self.play(FadeIn(marks, lag_ratio=0.15), run_time=0.9)
        q = K.text_card([f"계절마다 남중 고도는 {o('왜')} 달라질까요?"], size=34).move_to([0, -1.2, 0])
        self.say(f"남중 고도는 {o('왜')} 달라질까요? 모형실험으로 알아봐요",
                 "계절에 따라 남중 고도가 달라지는 까닭을 모형실험으로 알아봐요.")
        self.play(FadeIn(q), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 실험 준비 ──
    def setup_exp(self):
        self.section("실험 준비")
        same = K.text_card([f"{g('같게')}: 지구본 크기 · 거리 · 전등 높이 · 측정기"], size=26).move_to([-2.6, 2.3, 0])
        diff = K.text_card([f"{r('다르게')}: 자전축 기울기"], size=26).move_to([3.9, 2.3, 0])
        self.say(f"{r('자전축 기울기')}만 다르게 하고, 나머지는 같게 해요",
                 "지구본의 자전축 기울기만 다르게 하고, 나머지 조건은 모두 같게 해요.")
        self.play(FadeIn(same), FadeIn(diff), run_time=0.8)
        self.settle()
        gl = K.globe_lamp(0.0, 1.4, R=1.2, cx=1.8, cy=-0.3, lamp_x=-3.6, show_len=False)
        dist = VGroup(DashedLine([-3.6, -1.85, 0], [1.8, -1.85, 0], stroke_color=INK, stroke_width=3),
                      T("30 cm", 26).move_to([-0.9, -2.15, 0]))
        p1 = K.pointer(gl.kp, (-0.9, 1.3), "우리나라 위치에 측정기", RED, 24)
        self.say(f"우리나라 위치에 측정기를 붙이고, 전등에서 {o('30 cm')} 떨어뜨려요",
                 "우리나라 위치에 측정기를 붙이고, 전등과 지구본의 중심 높이를 맞춰 삼십 센티미터 떨어뜨려요.")
        self.play(FadeIn(gl), Create(dist[0]), FadeIn(dist[1]), run_time=0.9)
        self.play(FadeIn(p1), run_time=0.5)
        self.settle()
        note = K.safety_note("켜진 전등은 맨손으로 만지지 않아요(면장갑)", w=8.6, size=26).move_to([0.6, 2.3, 0])
        self.say(f"켜진 전등은 {r('면장갑')}을 끼고 다뤄요", "불이 켜진 전등은 맨손으로 만지지 않고 면장갑을 껴요.")
        self.play(FadeOut(same), FadeOut(diff), FadeIn(note), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 실험 ──
    def experiment(self):
        self.section("공전시키며 재기")
        tv = top_view()
        e = top_earth(0, False)
        tb = K.result_table(["자전축", "가", "나", "다", "라"],
                            [["수직일 때", "", "", "", ""], ["기울어졌을 때", "", "", "", ""]],
                            [2.6, 1.4, 1.4, 1.4, 1.4], row_h=0.52, size=24).move_to([2.6, -1.85, 0])
        side = K.globe_lamp(0.0, 1.4, R=1.05, cx=4.3, cy=1.1, lamp_x=0.5, k=0.45, show_len=False)
        cap = T("옆에서 본 모습", 24, INK).move_to([2.4, 2.75, 0])
        self.say(f"먼저 자전축을 {o('수직')}으로 세우고 공전시켜요",
                 "자전축을 수직으로 세우고, 시계 반대 방향으로 공전시키며 가, 나, 다, 라에서 그림자 길이를 재요.")
        self.play(FadeIn(tv), FadeIn(e), FadeIn(tb), FadeIn(side), FadeIn(cap), run_time=0.9)
        vals = VGroup()
        for k in range(4):
            if k:
                ne = top_earth(k, False)
                self.play(ReplacementTransform(e, ne), run_time=0.35)
                e = ne
            t = T(f"{SH_V[k]} cm", 22).move_to(self._cell(tb, 1, k + 1))
            vals.add(t)
            self.play(FadeIn(t), run_time=0.25)
        self.settle()
        self.say(f"자전축이 수직이면 네 위치 모두 {o('1.4 cm')}로 같아요",
                 "수직일 때는 네 위치 모두 일 점 사 센티미터로 같아요.")
        self.play(Indicate(vals[0:4], color=ORANGE), run_time=0.9)
        self.settle()
        ne = top_earth(0, True)
        self.say(f"이번에는 자전축을 {o('기울여')} 다시 재요",
                 "이번에는 자전축을 기울여, 늘 같은 방향을 향하게 하고 다시 재요.")
        self.play(ReplacementTransform(e, ne), run_time=0.5)
        e = ne
        self.pause_screen(5, "그림자 길이가 달라질까요?")
        tv2 = []
        for k in range(4):
            if k:
                ne = top_earth(k, True)
                self.play(ReplacementTransform(e, ne), run_time=0.35)
                e = ne
            ns = K.globe_lamp(TAU_T[k], SH_T[k], R=1.05, cx=4.3, cy=1.1, lamp_x=0.5, k=0.45, show_len=False)
            self.play(ReplacementTransform(side, ns), run_time=0.45)
            side = ns
            t = T(f"{SH_T[k]} cm", 22, RED if k == 1 or k == 3 else INK).move_to(self._cell(tb, 2, k + 1))
            tv2.append(t)
            self.play(FadeIn(t), run_time=0.3)
        ex = T("「실험관찰」 예시 답안", 20, SOFT).next_to(tb, UP, buff=0.08).align_to(tb, RIGHT)
        self.add(ex)
        self.say(f"그림자가 가장 짧은 {r('나')}는 여름, 가장 긴 라는 {g('겨울')}이에요",
                 "위치마다 그림자 길이가 달라졌어요. 그림자가 가장 짧은 나는 여름, 가장 긴 라는 겨울이에요.")
        self.play(Indicate(tv2[1], color=RED), Indicate(tv2[3], color=GREEN), run_time=1.0)
        self.settle()
        clear_stage(self)
        rows = [["계절 · 태양의 남중 고도 · 그림자 길이", o("변함"), g("변하지 않음")],
                ["낮의 길이 · 태양 에너지양 · 기온", o("변함"), g("변하지 않음")]]
        tb2 = K.result_table(["", "기울어진 채 공전", "수직인 채 공전"], rows, [6.0, 3.3, 3.3], row_h=0.85, size=28).move_to([0, 0.8, 0])
        self.say(f"자전축이 기울어진 채 공전해야 {o('모두 달라져요')}",
                 "자전축이 기울어진 채 공전하면 남중 고도, 낮의 길이, 기온 등이 모두 달라지고, 수직이면 달라지지 않아요.")
        self.play(FadeIn(tb2), run_time=0.8)
        self.settle()
        clear_stage(self)

    @staticmethod
    def _cell(tb, r_, c_):
        n = len(tb.cells[0])
        idx = r_ * n + c_
        return tb[idx].get_center()

    # ── 원인 ──
    def cause(self):
        self.section("계절 변화의 원인")
        bg = RoundedRectangle(corner_radius=0.2, width=13.0, height=4.95, fill_color="#0B1636", fill_opacity=1, stroke_width=0).move_to([0, 0.05, 0])
        ov = K.orbit_view(tilt=0.0, rx=4.3, ry=1.4, center=(0, 0.0), er=0.36, size=24)
        self.say(f"자전축이 {o('수직')}이라면 어떻게 될까요?", "자전축이 수직인 채 공전한다면 어떻게 될까요?")
        self.play(FadeIn(bg), FadeIn(ov), run_time=0.8)
        note = K.label("수직: 계절 변화가 없어요", RED, 26).move_to([-3.6, 2.05, 0])
        self.say(f"남중 고도가 달라지지 않아 {r('계절 변화가 없어요')}",
                 "자전축이 수직이면 태양의 남중 고도가 달라지지 않아 계절의 변화가 생기지 않아요.")
        self.play(FadeIn(note), run_time=0.5)
        self.settle()
        ov2 = K.orbit_view(tilt=23.5, rx=4.3, ry=1.4, center=(0, 0.0), er=0.36, size=24)
        note2 = K.label("실제 지구: 기울어진 채 공전", "#16804A", 26).move_to([-3.6, 2.05, 0])
        self.say(f"실제 지구는 자전축이 {o('기울어진 채')} 공전해요",
                 "실제 지구는 자전축이 늘 같은 방향으로 기울어진 채 공전해요.")
        self.play(ReplacementTransform(ov, ov2), ReplacementTransform(note, note2), run_time=1.0)
        self.settle()
        su = ov2.earths["여름"]
        wi = ov2.earths["겨울"]
        z1 = K.label("여름: 태양 쪽 → 남중 고도 높음", RED, 24).move_to([-3.6, -1.85, 0])
        self.say(f"여름에는 북반구가 {r('태양 쪽')}으로 기울어 남중 고도가 높아요",
                 "여름에 북반구는 태양 쪽으로 기울어, 우리나라는 남중 고도가 높고 받는 에너지양이 많아요.")
        self.play(Indicate(su, color=ORANGE, scale_factor=1.5), FadeIn(z1), run_time=1.0)
        self.settle()
        z2 = K.label("겨울: 태양 반대쪽 → 남중 고도 낮음", K.WINTER, 24).move_to([3.7, -1.85, 0])
        self.say(f"겨울에는 태양 {g('반대쪽')}으로 기울어 남중 고도가 낮아요",
                 "겨울에는 태양 반대쪽으로 기울어, 남중 고도가 낮고 받는 에너지양이 적어요.")
        self.play(Indicate(wi, color=ORANGE, scale_factor=1.5), FadeIn(z2), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 생각 바로잡기 ──
    def misc(self):
        self.section("생각 바로잡기")
        bg = RoundedRectangle(corner_radius=0.2, width=6.0, height=4.4, fill_color="#0B1636", fill_opacity=1, stroke_width=0).move_to([-3.4, 0.45, 0])
        sun = K.sun_icon(0.45).move_to([-5.7, 0.45, 0])
        rays = VGroup(*[DashedLine([-5.05, 0.45 + j * 0.42, 0], [-3.9, 0.45 + j * 0.42, 0], stroke_color="#FFE680", stroke_width=3, stroke_opacity=0.6)
                        for j in range(-3, 4)])
        er = K.earth_side(R=1.25, tilt=-23.5, labels=False, korea=False).move_to([-2.4, 0.45, 0])
        nk = Dot([-2.4 - 0.75, 0.45 + 0.8, 0], radius=0.09, color="#FF4D4D").set_stroke(PAPER, 2)
        sk = Dot([-2.4 - 0.3, 0.45 - 1.0, 0], radius=0.09, color="#9FD8FF").set_stroke(PAPER, 2)
        l1 = K.label("우리나라(북반구): 여름", RED, 24).move_to([-3.2, 2.35, 0])
        l2 = K.label("남반구의 나라: 겨울", K.WINTER, 24).move_to([-3.0, -1.4, 0])
        self.say(f"우리나라가 여름일 때 {o('남반구')}는 어떤 계절일까요?",
                 "우리나라가 여름일 때, 남반구에 있는 나라는 어떤 계절일까요?")
        self.play(FadeIn(bg), FadeIn(sun), FadeIn(rays), FadeIn(er), FadeIn(nk), FadeIn(sk), run_time=0.8)
        self.say(f"남반구는 남중 고도가 낮아 {g('겨울')}이에요 — 계절이 반대예요",
                 "이때 남반구는 남중 고도가 낮아 겨울이에요. 계절이 반대예요.")
        self.play(FadeIn(l1), FadeIn(l2), run_time=0.6)
        self.settle()
        q = K.text_card(["“여름에 더운 것은", f"지구가 태양과 {r('가까워서')}야.”"], size=32).move_to([3.6, 1.6, 0])
        self.say("이 말은 옳을까요?", "여름에 더운 것은 지구가 태양과 가까워서라는 말, 옳을까요?")
        self.play(FadeIn(q), run_time=0.5)
        self.settle()
        x = K.ox_mark(False, 0.35).next_to(q, LEFT, buff=0.2)
        ans = K.text_card([f"북반구는 여름에 태양과의 거리가", f"오히려 {o('조금 더 멀어요')}",
                           f"까닭은 {g('자전축이 기울어진 채 공전')}"], size=28).move_to([3.6, -0.75, 0])
        self.say(f"옳지 않아요. 여름에 거리는 오히려 {o('조금 더 멀어요')}",
                 "옳지 않아요. 북반구는 오히려 여름에 태양과 조금 더 멀어요. 까닭은 자전축의 기울기예요.")
        self.play(FadeIn(x), FadeIn(ans), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 생활 속: 계절 축제 ──
    def festival(self):
        self.section("생활 속 과학")
        a = K.season_card("여름 · 수박 축제", K.SUMMER,
                          [f"6월 남중 고도 {o('75.52°')}", f"낮의 길이 {o('14시간 45분')}",
                           "자외선 차단제와 모자", "오전 10시~오후 7시 운영"], w=5.6, size=28, head=34).move_to([-3.2, 0.55, 0])
        b = K.season_card("겨울 · 눈꽃 축제", K.WINTER,
                          [f"12월 남중 고도 {g('29.00°')}", f"낮의 길이 {g('9시간 33분')}",
                           "옷을 따뜻하게, 장갑", "일찍 어두워지니 조명 준비"], w=5.6, size=28, head=34).move_to([3.2, 0.55, 0])
        self.say(f"과학 정보로 {o('계절 축제 안내')}를 만들어요",
                 "남중 고도, 낮의 길이, 기온을 이용해 계절 축제 안내를 만들어요.")
        self.play(FadeIn(a), FadeIn(b), run_time=0.8)
        self.say(f"여름은 {o('자외선 차단')}, 겨울은 {g('따뜻한 옷과 조명')}을 안내해요",
                 "여름에는 햇빛이 강하고 낮이 길어 자외선 차단제와 모자를 챙기고 저녁까지 운영해요. 겨울에는 따뜻하게 입고, 일찍 어두워지니 조명을 준비해요.")
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        card = K.text_card([f"계절의 변화가 생기는 까닭은 지구의 자전축이 {o('기울어진')} 채",
                            f"태양 주위를 {g('공전')}하기 때문입니다."], size=34).move_to([0, 0.6, 0])
        self.say(f"자전축이 {o('기울어진 채')} 공전하기 때문에 계절이 변해요",
                 "계절의 변화가 생기는 까닭은 지구의 자전축이 기울어진 채 태양 주위를 공전하기 때문이에요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.7)
        self.settle()
        clear_stage(self)
