"""소수(4학년 2학기 3단원) 부품 — 100칸 모눈, 소수 자리 표

    g = grid100(k, size=3.0)       # 1을 100칸으로 나눈 모눈, 앞 k칸 칠함(위 줄부터 왼쪽→오른쪽)
"""
from manim import DOWN, RIGHT, Rectangle, Square, VGroup

from series_style import BLUE, INK, ORANGE, PAPER, SOFT, T

GREEN2 = "#1F8A70"
DCOL = {0: INK, -1: ORANGE, -2: BLUE, -3: GREEN2}   # 일의 자리, 소수 첫째·둘째·셋째


def grid100(k=0, size=3.0, color=ORANGE, cols=10):
    s = size / cols
    cells = VGroup(*[Square(side_length=s, fill_color=color if i < k else PAPER, fill_opacity=1,
                            stroke_color=SOFT, stroke_width=1.5) for i in range(cols * cols)])
    cells.arrange_in_grid(rows=cols, cols=cols, buff=0)
    frame = Rectangle(width=size, height=size, stroke_color=INK, stroke_width=4).move_to(cells)
    return VGroup(cells, frame)


def dec_markup(s):
    """'1.76' → 자리마다 색칠한 마크업"""
    if "." not in s:
        return f'<span foreground="{INK}">{s}</span>'
    a, b = s.split(".")
    out = f'<span foreground="{INK}">{a}.</span>'
    for i, ch in enumerate(b):
        out += f'<span foreground="{DCOL[-(i + 1)]}">{ch}</span>'
    return out


def dec_vertical(S, a, b, op="+", x_right=-0.6, y0=1.9, F=72, dx=0.62, narrate=True):
    """소수 세로셈(덧셈·뺄셈). a, b는 문자열. 소수점을 맞추고, 모자란 끝자리는 흐린 0으로 채움.
    오른쪽 자리부터 받아올림·받아내림을 보여 주며 계산. 결과 문자열을 돌려줌."""
    from decimal import Decimal
    from manim import Create, FadeIn, Line, VGroup, Dot, Cross
    from series_style import GREEN, M
    from division import j
    fa = len(a.split(".")[1]) if "." in a else 0
    fb = len(b.split(".")[1]) if "." in b else 0
    f = max(fa, fb)
    A = a + ("0" * (f - fa)) if "." in a else a + "." + "0" * f
    B = b + ("0" * (f - fb)) if "." in b else b + "." + "0" * f
    res = Decimal(a) + Decimal(b) if op == "+" else Decimal(a) - Decimal(b)
    R = f"{res:.{f}f}"
    ai, bi, ri = A.replace(".", ""), B.replace(".", ""), R.replace(".", "")
    W = max(len(ai), len(bi), len(ri))
    ai, bi, ri = ai.rjust(W, " "), bi.rjust(W, " "), ri.rjust(W, " ")
    dot_gap = 0.25

    def xpos(k):  # k: 오른쪽에서 몇째(0부터)
        x = x_right - k * dx
        if k >= f:
            x -= dot_gap
        return x

    def colr(k):
        p = k - f   # 자리: 0=일, -1=소수 첫째...
        return DCOL.get(p, INK) if p <= 0 else (BLUE if p == 1 else INK)

    def row(s, y, faded_from=None, orig=None):
        g = VGroup()
        for i, ch in enumerate(s):
            k = W - 1 - i
            if ch == " ":
                continue
            c = colr(k)
            pad = orig is not None and k < (f - orig)
            g.add(T(ch, F, SOFT if pad else c).set_opacity(0.45 if pad else 1).move_to([xpos(k), y, 0]))
        g.add(T(".", F, INK).move_to([xpos(f) + dx / 2 + dot_gap / 2 - 0.02 + 0.0, y - 0.05, 0]) if f else VGroup())
        return g
    top = row(ai, y0, orig=fa)
    mid = row(bi, y0 - 1.0, orig=fb)
    sign = T(op if op == "+" else "−", F).move_to([xpos(W - 1) - dx, y0 - 1.0, 0])
    bar = Line([xpos(W - 1) - dx - 0.35, y0 - 1.6, 0], [x_right + 0.4, y0 - 1.6, 0], color=INK, stroke_width=6)
    S.play(FadeIn(top), FadeIn(mid), FadeIn(sign), Create(bar), run_time=0.8)
    out = VGroup()
    carry = 0
    names = {0: "일의 자리", 1: "십의 자리"}
    for k in range(W):
        p = k - f
        da = int(ai[W - 1 - k]) if ai[W - 1 - k] != " " else 0
        db = int(bi[W - 1 - k]) if bi[W - 1 - k] != " " else 0
        if ri[W - 1 - k] == " ":
            break
        nm = names.get(p, f"소수 {['첫', '둘', '셋'][-p - 1]}째 자리")
        if op == "+":
            s_ = da + db + carry
            put, nc = s_ % 10, s_ // 10
            txt = f"{nm}: {da} + {db}" + (f" + 1" if carry else "") + f" = {s_}"
            nar = f"{nm}끼리 더하면 {s_}." + (f" {j(put, '을를')} 쓰고 1을 받아올려요." if nc else "")
        else:
            d2 = da - carry
            if d2 < db:
                d2 += 10
                nc = 1
            else:
                nc = 0
            put = d2 - db
            txt = f"{nm}: {d2} − {db} = {put}"
            nar = (f"{nm}는 {da - carry}에서 {j(db, '을를')} 뺄 수 없어요. 윗자리에서 받아내림하면 {d2}, {d2} 빼기 {db}는 {put}." if nc
                   else f"{nm}는 {d2} 빼기 {db}, {put}.")
        if narrate:
            S.say(txt, nar)
        d = T(str(put), F, GREEN).move_to([xpos(k), y0 - 2.25, 0])
        anims = [FadeIn(d, shift=DOWN * 0.15)]
        if nc and op == "+":
            anims.append(FadeIn(T("1", 38, ORANGE).move_to([xpos(k + 1), y0 + 0.75, 0])))
        if nc and op != "+":
            anims.append(FadeIn(T("10", 32, ORANGE).move_to([xpos(k), y0 + 0.75, 0])))
        S.play(*anims, run_time=0.6)
        out.add(d)
        carry = nc
    if f:
        out.add(T(".", F, GREEN).move_to([xpos(f) + dx / 2 + dot_gap / 2 - 0.02, y0 - 2.3, 0]))
        if narrate:
            S.say("소수점을 그대로 내려 찍어요", "마지막으로 소수점을 그대로 내려 찍어요.")
        S.play(FadeIn(out[-1], scale=2), run_time=0.5)
    return R
