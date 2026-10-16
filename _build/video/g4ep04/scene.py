"""「수학 원리 돋보기」 4학년 4화 — 억과 조, 네 자리씩 끊어 읽기 (4-1 1단원 큰 수 5·6차시, 화 코드 4-1-1-d)

1000만이 10개 → 100000000(1억, 억·일억), 1억이 3845개 → 384500000000(3845억, 삼천팔백사십오억)
1000억이 10개 → 1000000000000(1조), 1조가 2893개 → 2893조 / 네 자리마다 만 → 억 → 조
최종: GRADE=4 ./make_final.sh 4
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))

from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform,
                   SurroundingRectangle, Transform, VGroup, Write)

from series_style import GREEN, INK, SOFT, EpisodeScene, M, T, g, o
from division import clear_stage
from bignum import EOK, JO, TENK, chunk_row, read_num, span


class G4Ep04(EpisodeScene):
    GRADE, SEM = 4, 1
    EP_NO = 4
    EP_TITLE = "억과 조, 네 자리씩 끊어 읽기"
    OUT_DIR = HERE

    def construct(self):
        self.opening()
        self.problem()
        self.eok()
        self.split_read("384500000000", "3845억", "1억이 3845개인 수", "4자리씩 끊기")
        self.jo()
        self.mixed()
        self.closing(f"큰 수는 오른쪽부터 {o('네 자리씩')} 끊어\n{span('만', TENK)} → {span('억', EOK)} → {span('조', JO)}를 붙여 읽어요",
                     next_preview="4학년 5화 · 뛰어 세면 어느 자리가 변할까?")
        self.wait(0.5)

    def problem(self):
        self.section("문제")
        q = M("0이 아주 많은 이 수는 어떻게 읽을까요?", 54).move_to([0, 1.9, 0])
        n = T("384500000000", 110).move_to([0, 0.1, 0])
        self.say("0이 아주 많은 수", "0이 아주 많은 이 수는 어떻게 읽을까요? 숫자를 하나하나 세기 어려워요.")
        self.play(Write(q), FadeIn(n, scale=0.9), run_time=1.2)
        self.wait(1.2)
        self.pause_screen(5)
        self.settle()
        clear_stage(self, 0.6)

    def eok(self):
        self.section("억")
        a = M(f"{span('1000만', TENK)}이 {o('10개')}인 수", 56).move_to([0, 2.2, 0])
        self.say(f"1000만이 10개이면?", "1000만이 10개인 수는 얼마일까요?")
        self.play(FadeIn(a), run_time=0.6)
        nums, labs = chunk_row("100000000", 96)
        VGroup(nums, labs).move_to([0, 0.4, 0])
        flat = T("100000000", 96).move_to(nums)
        self.play(FadeIn(flat), run_time=0.6)
        self.say("오른쪽부터 네 자리씩 끊어 봐요", "0이 여덟 개예요. 오른쪽부터 네 자리씩 끊어 봐요.")
        self.play(ReplacementTransform(flat, nums), run_time=1.0)
        self.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in labs[::-1]], lag_ratio=0.3, run_time=1.0))
        self.say(f"만 다음 네 자리는 {span('억', EOK)}", "일, 만 다음의 네 자리 묶음은 억이에요.")
        self.play(Indicate(VGroup(nums[0], labs[0]), color=EOK, scale_factor=1.2), run_time=0.8)
        w = M(f"쓰기  {g('100000000')} 또는 {g('1억')}     읽기  {g('억')} 또는 {g('일억')}", 46).move_to([0, -1.8, 0])
        w.scale_to_fit_width(min(w.width, 12.6))
        self.say(f"{g('1억')}, 억 또는 일억", "100000000은 1억이라고 쓰고, 억 또는 일억이라고 읽어요.")
        self.play(FadeIn(w, shift=UP * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def split_read(self, s, mix, what, sec):
        self.section(sec)
        a = M(what, 56).move_to([0, 2.25, 0])
        self.say(what, f"{what}는 어떻게 읽을까요?" if what.endswith("수") else what)
        self.play(FadeIn(a), run_time=0.5)
        nums, labs = chunk_row(s, 92)
        VGroup(nums, labs).move_to([0, 0.45, 0])
        flat = T(s, 92).move_to(nums)
        self.play(FadeIn(flat), run_time=0.5)
        self.say(f"오른쪽부터 {o('네 자리씩')} 끊어요", "오른쪽 끝에서부터 네 자리씩 끊어요.")
        self.play(ReplacementTransform(flat, nums), run_time=1.0)
        self.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in labs[::-1]], lag_ratio=0.35, run_time=1.2))
        rd = read_num(s)
        self.say(f"앞 묶음을 읽고 이름을 붙여요 → {g(rd)}", f"맨 앞 묶음을 읽고 그 묶음의 이름을 붙여요. {rd}.")
        self.play(Indicate(VGroup(nums[0], labs[0]), scale_factor=1.15), run_time=0.8)
        w = M(f"쓰기  {g(s)} 또는 {g(mix)}     읽기  {g(rd)}", 46).move_to([0, -1.8, 0])
        w.scale_to_fit_width(min(w.width, 12.6))
        self.play(FadeIn(w, shift=UP * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def jo(self):
        self.section("조")
        a = M(f"{span('1000억', EOK)}이 {o('10개')}인 수", 56).move_to([0, 2.25, 0])
        self.say("1000억이 10개이면?", "1000억이 10개인 수는 얼마일까요?")
        self.play(FadeIn(a), run_time=0.5)
        nums, labs = chunk_row("1000000000000", 84)
        VGroup(nums, labs).move_to([0, 0.45, 0])
        flat = T("1000000000000", 84).move_to(nums)
        self.play(FadeIn(flat), run_time=0.5)
        self.play(ReplacementTransform(flat, nums), run_time=1.0)
        self.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in labs[::-1]], lag_ratio=0.3, run_time=1.2))
        self.say(f"억 다음 네 자리는 {span('조', JO)}", "만, 억 다음의 네 자리 묶음은 조예요. 1조, 조 또는 일조라고 읽어요.")
        self.play(Indicate(VGroup(nums[0], labs[0]), color=JO, scale_factor=1.3), run_time=0.8)
        w = M(f"1조가 {o('2893개')} → {g('2893조')} ({g(read_num(2893 * 10 ** 12))})", 48).move_to([0, -1.8, 0])
        w.scale_to_fit_width(min(w.width, 12.6))
        self.say(f"1조가 2893개 → {g('2893조')}", "1조가 2893개인 수는 2893조, 이천팔백구십삼조라고 읽어요.")
        self.play(FadeIn(w, shift=UP * 0.2), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)

    def mixed(self):
        self.section("묶음마다 읽기")
        s = "5273000064000"
        a = M("여러 묶음에 숫자가 있으면?", 52).move_to([0, 2.25, 0])
        self.say("여러 묶음에 숫자가 있으면?", "여러 묶음에 숫자가 있는 수는 어떻게 읽을까요?")
        self.play(FadeIn(a), run_time=0.5)
        nums, labs = chunk_row(s, 88)
        VGroup(nums, labs).move_to([0, 0.45, 0])
        flat = T(s, 88).move_to(nums)
        self.play(FadeIn(flat), run_time=0.5)
        self.play(ReplacementTransform(flat, nums), run_time=1.0)
        self.play(LaggedStart(*[FadeIn(l, shift=UP * 0.2) for l in labs[::-1]], lag_ratio=0.3, run_time=1.2))
        parts = ["오조", "이천칠백삼십억", "", "육만", "사천"]
        reads = [("5", "오조", JO), ("2730", "이천칠백삼십억", EOK), ("0006", "육만", TENK), ("4000", "사천", INK)]
        out = VGroup()
        nar = ["5조는 오조.", "2730억은 이천칠백삼십억.", "0006만은 육만. 앞의 0은 읽지 않아요.", "4000은 사천."]
        for i, (c, r, col) in enumerate(reads):
            t = T(r, 44, col)
            out.add(t)
        out.arrange(RIGHT, buff=0.35).move_to([0, -1.8, 0])
        out.scale_to_fit_width(min(out.width, 12.4))
        for i in range(4):
            self.say(span(reads[i][1], reads[i][2]), nar[i])
            self.play(Indicate(nums[i], color=reads[i][2], scale_factor=1.15), FadeIn(out[i], shift=UP * 0.2), run_time=0.7)
        self.say(f"{g(read_num(s))}", f"이어서 읽으면 {read_num(s)}.")
        self.play(Create(SurroundingRectangle(out, color=GREEN, buff=0.15, stroke_width=5)), run_time=0.6)
        self.wait(1.4)
        self.settle()
        clear_stage(self, 0.6)
        self.hide_chip()
