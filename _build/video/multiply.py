"""곱셈 영상 공통 부품: 여러 자리 × 한 자리 세로셈(올림 표시), 수모형 줄 늘어놓기

    mul_vertical(S, 128, 3)          # 일 → 십 → 백 차례로 곱하고 올림을 작게 적어 더함
"""
import numpy as np
from manim import (DOWN, LEFT, RIGHT, UP, Create, FadeIn, FadeOut, Indicate, Line, SurroundingRectangle,
                   VGroup, Write)

from series_style import BLUE, GREEN, INK, ORANGE, SOFT, M, T, b, g, o
from base10 import number_blocks

PLACE = ["일", "십", "백", "천"]
HUND = "#7A4FB5"   # 백의 자리(보라)


def pc(k):
    return [ORANGE, BLUE, HUND, INK][k]


def cm(v, k):
    return f'<span foreground="{pc(k)}">{v}</span>'


def mul_vertical(S, a, d, x0=-2.2, y0=1.6, F=78, dx=0.62, side_x=0.6):
    """a × d (d 한 자리) 세로셈. 오른쪽에 자리별 계산을 한 줄씩 적음."""
    digs = [int(c) for c in str(a)][::-1]  # 일부터
    n = len(digs)
    res = a * d
    rdigs = [int(c) for c in str(res)][::-1]
    W = max(n, len(rdigs))
    xs = [x0 - i * dx for i in range(W + 1)]
    top = VGroup(*[T(str(v), F, pc(i)).move_to([xs[i], y0, 0]) for i, v in enumerate(digs)])
    mulr = VGroup(T("×", F).move_to([xs[W], y0 - 1.0, 0]), T(str(d), F).move_to([xs[0], y0 - 1.0, 0]))
    bar = Line([xs[W] - 0.4, y0 - 1.6, 0], [xs[0] + 0.4, y0 - 1.6, 0], color=INK, stroke_width=6)
    S.play(FadeIn(top), FadeIn(mulr), Create(bar), run_time=0.8)
    carry = 0
    log = VGroup()
    out = VGroup()
    cm_marks = VGroup()
    for i in range(W):
        v = digs[i] if i < n else 0
        if i >= n and carry == 0:
            break
        p = v * d + carry
        put, nc = p % 10, p // 10
        if i >= n:
            put, nc = p, 0
        pl = PLACE[i]
        if i < n:
            expr = f"{cm(v, i)} × {d}" + (f" + {cm(carry, i)}(올림)" if carry else "") + f" = {p}"
            nar = f"{pl}의 자리: {v} 곱하기 {d}" + (f"는 {v * d}, 올린 {carry}{'을' if carry in (1, 3, 6, 7, 8) else '를'} 더하면 {p}" if carry else f"는 {p}") + "."
        else:
            expr = f"올린 {cm(carry, i)} 그대로 쓰기"
            nar = f"올린 수를 {pl}의 자리에 그대로 써요."
        hl = SurroundingRectangle(top[i], color=pc(i), buff=0.1, stroke_width=5) if i < n else VGroup()
        S.say(f"{cm(pl + '의 자리', i)}: {expr}", nar)
        if i < n:
            S.play(Create(hl), Indicate(mulr[1], color=pc(i)), run_time=0.6)
        line = M(f"{cm(pl, i)}: {expr}", 38)
        line.scale_to_fit_width(min(line.width, 6.0))
        line.move_to([side_x, y0 + 0.2 - len(log) * 0.68, 0], aligned_edge=LEFT)
        S.play(FadeIn(line, shift=LEFT * 0.2), run_time=0.5)
        log.add(line)
        if nc and i < n:
            dig = T(str(put), F, pc(i)).move_to([xs[i], y0 - 2.3, 0])
            c = T(str(nc), 40, pc(i + 1)).move_to([xs[i + 1], y0 + 0.75, 0])
            from division import j
            S.say(f"{j(put, '을를')} 쓰고 {cm(j(nc, '을를'), i + 1)} {PLACE[i + 1]}의 자리로 올림!",
                  f"{p}에서 {j(put, '을를')} {pl}의 자리에 쓰고, {j(nc, '은는')} {PLACE[i + 1]}의 자리로 올려 작게 적어요.")
            S.play(FadeIn(dig, shift=DOWN * 0.2), FadeIn(c, shift=UP * 0.3, scale=1.4), run_time=0.8)
            cm_marks.add(c)
        else:
            s_ = str(put)
            dig = VGroup(*[T(ch, F, pc(i + (len(s_) - 1 - k))).move_to([xs[i + (len(s_) - 1 - k)], y0 - 2.3, 0]) for k, ch in enumerate(s_)])
            S.play(FadeIn(dig, shift=DOWN * 0.2), run_time=0.6)
        out.add(dig)
        if i < n:
            S.play(FadeOut(hl), run_time=0.2)
        S.wait(0.4)
        carry = nc
    bx = SurroundingRectangle(out, color=GREEN, buff=0.15, stroke_width=6)
    S.say(f"{a} × {d} = {g(str(res))}", f"그래서 {a} 곱하기 {d}는 {res}예요.")
    S.play(Create(bx), run_time=0.6)
    S.wait(1.4)
    return res


def blocks_rows(a, k, size=0.11, buff=0.18):
    rows = VGroup(*[number_blocks(a, size=size, ones_cols=1) for _ in range(k)]).arrange(DOWN, buff=buff, aligned_edge=LEFT)
    return rows
