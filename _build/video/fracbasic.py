"""분수 특별편(분수 기초 차근차근) 공통 부품

    step_card(1, "전체를 몇으로 똑같이 나누었나요?")   # 왼쪽에 '1단계' 이름표, 오른쪽에 글
    grid(4, 2, filled={0, 3})                          # 4×2 칸, 칠한 칸 번호(왼쪽 위부터 가로로)
    cells_of(grid)                                      # 칸 목록
    count_marks(cells)                                  # 칸 가운데 1, 2, 3 … 번호
    pie_at(d, k, r, pos)                                # fraction.pie를 옮겨 놓기
    bar_at(d, k, width, pos)                            # fraction.frac_bar를 옮겨 놓기
"""
import numpy as np
from manim import DOWN, LEFT, RIGHT, UP, Rectangle, RoundedRectangle, VGroup

from series_style import BLUE, GREEN, INK, ORANGE, PAPER, SOFT, M, T
from fraction import frac_bar, pie

TEAL = "#1D8A93"   # 특별편 '단계' 이름표 색


def step_badge(n, color=TEAL, size=34):
    t = T(f"{n}단계", size, PAPER)
    box = RoundedRectangle(corner_radius=0.18, width=t.width + 0.5, height=t.height + 0.32,
                           fill_color=color, fill_opacity=1, stroke_width=0)
    t.move_to(box)
    return VGroup(box, t)


def step_card(n, text, size=40, color=TEAL):
    """'n단계' 이름표 + 설명 글(M 마크업)"""
    badge = step_badge(n, color)
    body = M(text, size)
    g = VGroup(badge, body).arrange(RIGHT, buff=0.3)
    g.badge, g.body = badge, body
    return g


def grid(cols, rows, filled=(), cw=0.9, ch=0.9, color=ORANGE, stroke=INK):
    """cols×rows 칸, filled에 든 번호(왼쪽 위 0부터 가로로)를 칠함. 반환 VGroup(칸들), .cells"""
    cells = VGroup()
    for r in range(rows):
        for c in range(cols):
            i = r * cols + c
            cells.add(Rectangle(width=cw, height=ch, fill_color=color if i in filled else PAPER, fill_opacity=1,
                                stroke_color=stroke, stroke_width=4).move_to([c * cw, -r * ch, 0]))
    cells.move_to([0, 0, 0])
    return cells


def spot(c):
    """칸 안에 글자를 놓을 자리: 부채꼴이면 반지름 0.62 지점(가운데 각), 아니면 가운데"""
    from manim import Sector
    if isinstance(c, Sector):
        mid = c.start_angle + c.angle / 2
        r = c.outer_radius
        return c.get_arc_center() + np.array([np.cos(mid), np.sin(mid), 0]) * r * 0.62
    return c.get_center()


def count_marks(cells, color=INK, size=34):
    return VGroup(*[T(str(i + 1), size, color).move_to(spot(c)) for i, c in enumerate(cells)])


def pie_at(d, k, r=1.0, pos=(0, 0, 0), color=ORANGE):
    return pie(d, k, r, color=color).move_to(pos)


def bar_at(d, k, width=6.0, pos=(0, 0, 0), height=0.8, color=ORANGE):
    return frac_bar(d, k, width=width, height=height, color=color).move_to(pos)


def frac_slots(size=1.0, pos=(0, 0, 0)):
    """빈 분수 틀: 위 네모(분자 자리), 가로선, 아래 네모(분모 자리). .top .line .bot"""
    from manim import Line, Square
    top = Square(side_length=size, stroke_color=SOFT, stroke_width=4).set_fill(PAPER, 1)
    line = Line(LEFT * size * 0.75, RIGHT * size * 0.75, color=INK, stroke_width=8)
    bot = Square(side_length=size, stroke_color=SOFT, stroke_width=4).set_fill(PAPER, 1)
    top.next_to(line, UP, buff=0.15)
    bot.next_to(line, DOWN, buff=0.15)
    gr = VGroup(top, line, bot).move_to(pos)
    gr.top, gr.line, gr.bot = top, line, bot
    return gr


def slot_num(slot, n, color, size=80):
    return T(str(n), size, color).move_to(slot)


def three_steps(S, cells, shaded, pos=(3.6, 0.3, 0), what="색칠한 부분", quick=False, card_y=2.45, read_y=-2.0):
    """부분을 분수로 나타내는 3단계를 차례로 보여 줌.
    cells: 똑같이 나눈 칸(VGroup) / shaded: 칠한 칸 번호 목록 / pos: 빈 분수 틀 자리.
    반환: 화면에 더한 것들(VGroup)."""
    from manim import Create, FadeIn, FadeOut, Indicate, LaggedStart, ReplacementTransform, Write
    from series_style import b, g, o
    d, n = len(cells), len(shaded)
    rt = 0.08 if quick else 0.16
    slots = frac_slots(0.95, pos)
    S.play(FadeIn(slots), run_time=0.4)
    added = VGroup(slots)
    # 1단계
    c1 = step_card(1, f"전체를 몇 칸으로 {g('똑같이')} 나누었나요?").move_to([0, card_y, 0])
    S.say(f"1단계: 전체는 몇 칸? → {b('분모')}",
          "1단계. 전체를 몇 칸으로 똑같이 나누었는지 세어요." if not quick else "1단계, 전체는 몇 칸인가요?")
    S.play(FadeIn(c1), run_time=0.4)
    marks = VGroup(*[T(str(i + 1), 34, BLUE).move_to(spot(c)) for i, c in enumerate(cells)])
    S.play(LaggedStart(*[FadeIn(m, scale=1.4) for m in marks], lag_ratio=1.0, run_time=rt * d + 0.3))
    den = slot_num(slots.bot, d, BLUE)
    S.say(f"전체 {d}칸 → 아래(분모)에 {b(str(d))}", f"전체가 {d}칸이니까, 아래 분모 자리에 {d}를 써요.")
    S.play(ReplacementTransform(marks[-1].copy(), den), run_time=0.6)
    S.play(FadeOut(marks), run_time=0.3)
    # 2단계
    c2 = step_card(2, f"{what}은 몇 칸인가요?").move_to([0, card_y, 0])
    S.say(f"2단계: {what}은 몇 칸? → {o('분자')}",
          f"2단계. {what}이 몇 칸인지 세어요." if not quick else f"2단계, {what}은 몇 칸인가요?")
    S.play(FadeOut(c1), FadeIn(c2), run_time=0.4)
    marks2 = VGroup(*[T(str(i + 1), 34, INK).move_to(spot(cells[k])) for i, k in enumerate(shaded)])
    S.play(LaggedStart(*[FadeIn(m, scale=1.4) for m in marks2], lag_ratio=1.0, run_time=rt * n + 0.3))
    num = slot_num(slots.top, n, ORANGE)
    S.say(f"{what} {n}칸 → 위(분자)에 {o(str(n))}", f"{what}이 {n}칸이니까, 위 분자 자리에 {n}을 써요.")
    S.play(ReplacementTransform(marks2[-1].copy(), num), run_time=0.6)
    S.play(FadeOut(marks2), run_time=0.3)
    # 3단계
    c3 = step_card(3, f"분모부터 읽어요: {b(str(d))}분의 {o(str(n))}").move_to([0, card_y, 0])
    S.say(f"3단계: {b(str(d) + '분의')} {o(str(n))}", f"3단계. 아래 분모부터 읽어요. {d}분의 {n}.")
    S.play(FadeOut(c2), FadeIn(c3), FadeOut(slots.top), FadeOut(slots.bot), run_time=0.5)
    S.play(Indicate(VGroup(num, den, slots.line), color=GREEN, scale_factor=1.15), run_time=0.7)
    added.add(c3, num, den)
    return added


def mixed_wide(w, n, d, size=60, cw=INK, cn=INK, cd=INK):
    """대분수(자연수와 분수 사이를 조금 띄움): 1과 4분의 3"""
    from fraction import frac
    whole = T(str(w), size * 1.15, cw)
    f = frac(n, d, size, cn=cn, cd=cd)
    gr = VGroup(whole, f).arrange(RIGHT, buff=size / 260)
    gr.whole, gr.frac = whole, f
    return gr
