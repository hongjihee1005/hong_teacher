"""「과학 원리 돋보기」 6학년 33화 — 연소 후의 변화 (6-2 2단원 물질의 연소 5~6차시, 화 코드 6-2-2-d)

바탕: grade6/science/sem2/u2-4.html(원본 _build_tb/src2/u2-4.html) — 도입(줄어든 양초는 어떻게 되었을까? 난로의 굴뚝 → 다른 물질로 변해
공기 중으로), 실험 전(푸른색 염화 코발트 종이는 물에 닿으면 붉은색, 무색투명한 석회수는 이산화 탄소를 만나면 뿌옇게 흐려짐, 안전),
실험 1(종이를 아크릴 통 안쪽 벽면에 붙이고 촛불을 덮음 → 꺼진 뒤 붉은색, 벽면에 작은 물방울 → 물), 실험 2(석회수 병 뚜껑을 열고 촛불과 함께
덮음 → 꺼지면 뚜껑을 닫고 흔듦 → 뿌옇게 → 이산화 탄소), 정리(연소 전과 다른 물질이 생기며 성질이 달라짐), 생각+(더 태우면 물·이산화 탄소가
많아짐, 알코올도 물과 이산화 탄소), 한눈에 쏙·생각이 쑥(양초의 길이가 짧아지는 까닭), 형성 평가(물 ↔ 염화 코발트 종이, 이산화 탄소 ↔ 석회수).
최종: ./make_final.sh s6ep33
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, FadeIn, FadeOut, Indicate, VGroup, Circumscribe, Transform, Dot,
                   Rotate)

from series_style import GREEN, INK, ORANGE, PAPER, SOFT, EpisodeScene, M, T, g, o
from scikit import RED, clear_stage
import kit_s6u22 as K


def r(s):
    return f'<span foreground="{RED}">{s}</span>'


def bl(s):
    return f'<span foreground="#2F6FD6">{s}</span>'


def pk(s):
    return f'<span foreground="{K.COBALT_R}">{s}</span>'


class S6Ep33(EpisodeScene):
    GRADE, SEM = 6, 2
    EP_NO = 33
    EP_TITLE = "연소 후의 변화"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.intro()
        self.tools()
        self.exp_water()
        self.exp_co2()
        self.result()
        self.more()
        self.summary()
        self.closing(f"양초가 연소하면 {bl('물')}과 {g('이산화 탄소')}가 생성되어\n물질의 성질이 달라져요",
                     next_preview="6학년 34화 · 연소 생성물과 생태계")
        self.wait(0.5)

    # ── 궁금해요 ──
    def intro(self):
        self.section("궁금해요")
        c0 = K.candle(2.0, False, w=0.42).shift([-5.0, -2.0, 0])
        c1 = K.candle(2.0, True, w=0.42, melt=1.0, fs=1.2).shift([-3.2, -2.0, 0])
        arr = K.arrow_right(-4.6, -3.7, -0.8, SOFT, 6)
        q = K.text_card(["양초가 연소하면 양이 줄어들어요.", f"줄어든 양초는 {o('어떻게')} 되었을까요?"], size=32).move_to([3.0, 1.3, 0])
        self.say("줄어든 양초는 어떻게 되었을까요?",
                 "양초가 연소하면 시간이 지나면서 양초의 양이 줄어들어요. 줄어든 양초는 어떻게 되었을까요?")
        self.play(FadeIn(c0), FadeIn(c1), FadeIn(arr), FadeIn(q), run_time=0.8)
        self.settle()
        a = K.text_card(["다른 물질로 변해", f"{o('공기 중으로')} 나갔을 것 같아요"], size=30).move_to([3.0, -0.75, 0])
        hint = K.label("난로의 굴뚝: 열과 연기가 빠져나가요", INK, 26).move_to([3.0, -2.15, 0])
        self.say(f"다른 물질로 변해 {o('공기 중으로')} 나갔을 것 같아요",
                 "난로에 굴뚝이 있는 까닭은 열과 연기가 빠져나가게 하기 위해서예요. 양초도 다른 물질로 변해 공기 중으로 나갔을 것 같아요. 무엇이 생기는지 알아봐요.")
        self.play(FadeIn(a), FadeIn(hint), run_time=0.7)
        self.settle()
        clear_stage(self)

    # ── 실험 전: 확인하는 도구 ──
    def tools(self):
        self.section("실험하기 전")
        p = K.cobalt_paper(0.0, w=0.8, h=1.6, drop=True).move_to([-3.6, 0.6, 0])
        n1 = T("푸른색 염화 코발트 종이", 32).move_to([-3.6, -1.1, 0])
        j = K.lime_jar(0.0, cap=False, s=1.6).move_to([3.4, 0.4, 0])
        gas = K.label("이산화 탄소", INK, 26).move_to([5.3, 2.0, 0])
        n2 = T("석회수", 32).move_to([3.4, -1.1, 0])
        self.say("연소 후 생기는 물질을 확인할 도구를 알아봐요",
                 "연소 후 생기는 물질을 확인하는 데 쓸 푸른색 염화 코발트 종이와 석회수의 성질을 먼저 알아봐요.")
        self.play(FadeIn(p), FadeIn(n1), FadeIn(j), FadeIn(n2), run_time=0.8)
        self.settle()
        p2 = K.cobalt_paper(0.0, w=0.8, h=1.6).move_to(p[0])
        spot = K.C(0.3, K.COBALT_R, 0, 0, stroke=None, sw=0).move_to(p[0].get_center() + UP * 0.25)
        r1 = K.label("물에 닿으면 붉은색!", K.COBALT_R, 28).move_to([-3.6, -1.8, 0])
        self.say(f"푸른색 염화 코발트 종이는 물에 닿으면 {pk('붉은색')}으로 변해요",
                 "푸른색 염화 코발트 종이는 물에 닿으면 붉은색으로 변해요.")
        self.play(Transform(p, p2), FadeIn(spot), FadeIn(r1), run_time=0.9)
        self.settle()
        j2 = K.lime_jar(1.0, cap=False, s=1.6).move_to(j)
        ar = K.L((5.0, 1.8), (3.9, 1.0), SOFT, 5)
        r2 = K.label("뿌옇게 흐려져요!", INK, 28).move_to([3.4, -1.8, 0])
        self.say(f"무색투명한 석회수는 이산화 탄소를 만나면 {g('뿌옇게')} 흐려져요",
                 "무색투명한 석회수는 이산화 탄소를 만나면 뿌옇게 흐려져요.")
        self.play(FadeIn(ar), FadeIn(gas), run_time=0.5)
        self.play(Transform(j, j2), FadeIn(r2), run_time=1.0)
        self.settle()
        safe = K.safety_note("염화 코발트 종이는 장갑을 낀 손으로 핀셋을 써서 집고, 석회수가 피부에 닿지 않게 해요", w=10.4, size=26).move_to([0.6, 2.6, 0])
        self.say("안전: 종이는 핀셋으로 집고, 석회수가 피부에 닿지 않게 해요",
                 "푸른색 염화 코발트 종이는 맨손으로 만지지 말고 실험용 장갑을 낀 손으로 핀셋을 써서 집어요. 석회수가 피부에 닿지 않게 조심해요.")
        self.play(FadeOut(VGroup(gas, ar)), FadeIn(safe), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 실험 1: 염화 코발트 종이 ──
    def exp_water(self):
        self.section("실험 1 · 염화 코발트 종이")
        y0 = -2.1
        base = K.table_top(6.5, y0).move_to([-3.3, y0 - 0.16, 0])
        cd = K.candle(1.3, True, w=0.42, fs=1.1).shift([-3.3, y0, 0])
        cv = K.cover(3.0, 3.6, -3.3).shift(UP * y0)
        pp = K.cobalt_paper(0.0, w=0.4, h=1.0).move_to([-4.45, y0 + 2.5, 0])
        steps = K.text_card(["① 종이를 아크릴 통 안쪽 벽면에", "    셀로판테이프로 붙여요", "② 양초에 불을 붙이고", "    아크릴 통으로 덮어요"],
                            w=6.0, size=28).move_to([3.4, 0.6, 0])
        self.say("종이를 아크릴 통 안쪽 벽면에 붙이고 촛불을 덮어요",
                 "핀셋으로 푸른색 염화 코발트 종이를 집어 아크릴 통 안쪽 벽면에 셀로판테이프로 붙여요. 양초에 불을 붙인 다음, 아크릴 통으로 덮어요.")
        self.play(FadeIn(base), FadeIn(cd), FadeIn(steps), run_time=0.7)
        self.play(FadeIn(VGroup(cv, pp), shift=DOWN * 0.4), run_time=0.8)
        self.settle()
        self.pause_screen(5, "촛불이 꺼지면 종이는 어떻게 될까요?")
        sm = K.smoke_curl(0.6).move_to([-3.3, cd.wick_top[1] + y0 + 0.4, 0])
        pp2 = K.cobalt_paper(1.0, w=0.4, h=1.0).move_to(pp)
        drops = VGroup(*[Dot([x, y, 0], radius=0.05, color="#7FB3D5") for x, y in
                         ((-2.3, 1.0), (-2.15, 0.6), (-2.35, 0.2), (-3.6, 1.35), (-2.9, 1.3), (-2.25, -0.2))])
        res = K.text_card([f"푸른색 → {pk('붉은색')}", "벽면에 작은 물방울도 보여요", f"⇒ {bl('물')}이 생겼어요"], w=6.0, size=32).move_to([3.4, 0.6, 0])
        self.say(f"종이가 {pk('붉은색')}으로 변했어요 → {bl('물')}이 생겼어요",
                 "촛불이 꺼진 뒤 푸른색 염화 코발트 종이가 붉은색으로 변했어요. 아크릴 통 안쪽 벽면에 작은 물방울도 보여요. 양초가 연소한 후 물이 생겼어요.")
        self.play(FadeOut(cd.flame), FadeIn(sm), run_time=0.6)
        self.play(Transform(pp, pp2), FadeIn(drops), FadeOut(steps), FadeIn(res), run_time=1.0)
        self.settle()
        clear_stage(self)

    # ── 실험 2: 석회수 ──
    def exp_co2(self):
        self.section("실험 2 · 석회수")
        y0 = -2.1
        base = K.table_top(6.5, y0).move_to([-3.3, y0 - 0.16, 0])
        cd = K.candle(1.3, True, w=0.42, fs=1.1).shift([-4.2, y0, 0])
        jar = K.lime_jar(0.0, cap=False, s=1.1).shift([-2.4, y0, 0])
        cv = K.cover(3.4, 3.4, -3.3).shift(UP * y0)
        steps = K.text_card(["① 석회수 병 뚜껑을 열고", "    촛불과 함께 아크릴 통으로 덮어요", "② 촛불이 꺼지면 뚜껑을 닫고", "    가볍게 흔들어요"],
                            w=6.0, size=28).move_to([3.4, 0.6, 0])
        self.say("석회수 병 뚜껑을 열고 촛불과 함께 덮어요",
                 "실험하기 전 석회수는 무색투명해요. 양초에 불을 붙이고, 뚜껑을 연 석회수 병과 촛불을 아크릴 통으로 함께 덮어요.")
        self.play(FadeIn(base), FadeIn(cd), FadeIn(jar), FadeIn(steps), run_time=0.7)
        self.play(FadeIn(cv, shift=DOWN * 0.4), run_time=0.7)
        self.settle()
        sm = K.smoke_curl(0.6).move_to([-4.2, cd.wick_top[1] + y0 + 0.4, 0])
        jar2 = K.lime_jar(0.0, cap=True, s=1.1).shift([-2.4, y0, 0])
        self.say("촛불이 꺼지면 뚜껑을 닫고 흔들어요",
                 "촛불이 꺼졌어요. 아크릴 통을 들어 올려 유리병의 뚜껑을 닫고 가볍게 흔들어요.")
        self.play(FadeOut(cd.flame), FadeIn(sm), run_time=0.6)
        self.play(FadeOut(cv, shift=UP * 0.4), Transform(jar, jar2), run_time=0.7)
        self.play(Rotate(jar, 0.25), run_time=0.25)
        self.play(Rotate(jar, -0.5), run_time=0.3)
        self.play(Rotate(jar, 0.25), run_time=0.25)
        self.settle()
        self.pause_screen(5, "석회수는 어떻게 될까요?")
        jar3 = K.lime_jar(1.0, cap=True, s=1.1).shift([-2.4, y0, 0])
        res = K.text_card(["무색투명 → 뿌옇게 흐려짐", f"⇒ {g('이산화 탄소')}가 생겼어요"], w=6.0, size=32).move_to([3.4, 0.6, 0])
        self.say(f"석회수가 뿌옇게 흐려졌어요 → {g('이산화 탄소')}가 생겼어요",
                 "무색투명했던 석회수가 뿌옇게 흐려졌어요. 양초가 연소한 후 이산화 탄소가 생겼어요.")
        self.play(Transform(jar, jar3), FadeOut(steps), FadeIn(res), run_time=1.0)
        self.settle()
        safe = K.safety_note("석회수가 피부에 닿으면 바로 흐르는 물로 충분히 씻어요 · 불이 꺼진 뒤에도 아크릴 통이 뜨거울 수 있어요", w=10.4, size=24).move_to([0.6, 2.6, 0])
        self.say("안전: 불이 꺼진 뒤에도 아크릴 통이 뜨거울 수 있어요",
                 "석회수가 피부에 닿으면 바로 흐르는 물로 충분히 씻어요. 불이 꺼진 뒤에도 아크릴 통이 뜨거울 수 있어요.")
        self.play(FadeIn(safe), run_time=0.5)
        self.settle()
        clear_stage(self)

    # ── 정리 ──
    def result(self):
        self.section("정리해요")
        tab = K.result_table(["확인한 것", "변화", "생성된 물질"],
                             [["푸른색 염화 코발트 종이", "푸른색 → 붉은색", "물"],
                              ["석회수", "무색투명 → 뿌옇게 흐려짐", "이산화 탄소"]],
                             [4.2, 4.6, 2.8], row_h=0.95, size=30).move_to([0, 1.0, 0])
        self.say(f"양초가 연소하면 {bl('물')}과 {g('이산화 탄소')}가 생겨요",
                 "양초가 연소한 후에 물과 이산화 탄소가 생성되었어요.")
        self.play(FadeIn(tab), run_time=0.8)
        self.settle()
        card = K.text_card([f"연소 과정에서 연소 전과 {o('다른 물질')}이 생기며", f"물질의 {o('성질이 달라져요')}"], size=32).move_to([0, -1.5, 0])
        self.say(f"연소하면 연소 전과 다른 물질이 생겨 {o('성질이 달라져요')}",
                 "연소 전의 양초와 연소 후 생성된 물과 이산화 탄소를 비교하면, 연소 과정에서 연소 전과 다른 물질이 생기며 물질의 성질이 달라져요.")
        self.play(FadeIn(card, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 생각+ ──
    def more(self):
        self.section("생각+")
        def bars(t):
            rows = [("남은 양초", 1 - 0.8 * t, "#E8D9B5"), ("생성된 물", 0.8 * t, "#7FB3D5"), ("생성된 이산화 탄소", 0.9 * t, "#9BC4A0")]
            gg = VGroup()
            for k, (nm, v, col) in enumerate(rows):
                y = 1.6 - k * 1.05
                lab = T(nm, 28).move_to([-3.6, y, 0])
                frame = K.rr(5.6, 0.55, PAPER, 1.6, y, stroke=SOFT, sw=3, r=0.05)
                bar = K.rr(max(0.02, 5.6 * v), 0.55, col, 1.6 - 2.8 + 2.8 * max(0.004, v), y, stroke=None, sw=0, r=0.05)
                gg.add(VGroup(lab, frame, bar))
            return gg
        b = bars(0.2)
        self.say("양초가 계속 연소하면 생성되는 물질의 양은 어떻게 될까요?", "양초가 계속 연소하면 생성되는 물질의 양은 어떻게 될까요?")
        self.play(FadeIn(b), run_time=0.7)
        self.settle()
        self.say(f"생성되는 물과 이산화 탄소의 양이 {o('많아져요')}",
                 "양초가 더 많이 탈수록 남은 양초는 줄어들고, 생성되는 물과 이산화 탄소의 양이 많아져요.")
        self.play(Transform(b, bars(0.95)), run_time=1.6)
        self.settle()
        alc = K.text_card([f"알코올이 연소할 때도 종이가 붉은색, 석회수가 뿌옇게 → {bl('물')}과 {g('이산화 탄소')}"], size=26).move_to([0, -1.75, 0])
        self.say(f"알코올이 연소해도 {bl('물')}과 {g('이산화 탄소')}가 생겨요",
                 "알코올이 연소할 때도 푸른색 염화 코발트 종이가 붉은색으로 변하고 석회수가 뿌옇게 흐려져요. 알코올이 연소해도 물과 이산화 탄소가 생겨요.")
        self.play(FadeIn(alc, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)

    # ── 한눈에 쏙 ──
    def summary(self):
        self.section("한눈에 쏙")
        cd = K.candle(2.0, True, w=0.42, melt=0.6, fs=1.2).shift([-4.8, -1.9, 0])
        card = K.text_card(["양초가 연소하면", f"{bl('물')}과 {g('이산화 탄소')}가 생성됩니다."], w=7.6, size=36).move_to([2.1, 1.1, 0])
        think = K.text_card([f"확인 방법: 물 → {pk('푸른색 염화 코발트 종이')}", f"이산화 탄소 → {g('석회수')}"], w=7.6, size=28).move_to([2.1, -1.1, 0])
        self.say(f"양초가 연소하면 {bl('물')}과 {g('이산화 탄소')}가 생성돼요",
                 "양초가 연소하면 물과 이산화 탄소가 생성돼요. 양초의 길이가 짧아지는 까닭은 양초가 물과 이산화 탄소로 변하기 때문이에요.")
        self.play(FadeIn(cd), FadeIn(card, shift=LEFT * 0.2), run_time=0.8)
        self.settle()
        self.say(f"물은 염화 코발트 종이로, 이산화 탄소는 {g('석회수')}로 확인해요",
                 "물은 푸른색 염화 코발트 종이로, 이산화 탄소는 석회수로 확인해요.")
        self.play(FadeIn(think, shift=UP * 0.2), run_time=0.6)
        self.settle()
        clear_stage(self)
