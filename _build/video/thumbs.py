"""유튜브 썸네일(미리보기 이미지) 만들기 — 1280×720 PNG

    python thumbs.py            → thumbs/<폴더>.png (분수 준비·분수 특별편·자연수 이야기)
    python thumbs.py gfep03     → 그 편만

모양: 시리즈 바탕색, 왼쪽 위 '시리즈 N화' 이름표, 큰 제목(두 줄까지), 오른쪽에 큰 그림 글자(분수·식),
아래 띠에 「수학 원리 돋보기」와 선생님 로고. 글꼴 Noto Sans CJK KR Bold(리눅스 fonts-noto-cjk).
"""
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "thumbs")
W, H = 1280, 720
INK = "#2B2B33"
ORANGE = "#F08A1C"
BLUE = "#2F6FD6"
GREEN = "#2E9E5B"
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"

SERIES = {
    "gp": ("분수 준비", "#F1F7E9", "#3D6B2A"),
    "gf": ("분수 특별편", "#EAF6F6", "#1D5C63"),
    "gn": ("자연수 이야기", "#F8F2E6", "#7A5A1E"),
    "gd": ("나눗셈 차근차근", "#EEF0FA", "#3B4A8C"),
}
PUR = "#B05FD0"

# 폴더: (제목 줄들, 그림 글자 토큰들)
#  토큰: ("t", 글, 색) 글자 / ("f", 분자, 분모) 분수 / ("m", 자연수, 분자, 분모) 대분수
O, B, G, K = ORANGE, BLUE, GREEN, INK
EP = {
    "gpep01": (["같은 수씩", "묶어 세기"], [("t", "2, 4, 6, 8", B)]),
    "gpep02": (["곱셈은", "'몇씩 몇 묶음'"], [("t", "3", B), ("t", "×", K), ("t", "4", O)]),
    "gpep03": (["줄 맞춰 놓으면", "곱셈이 보여요"], [("t", "5", B), ("t", "×", K), ("t", "3", O)]),
    "gpep04": (["곱셈구구가", "생각나지 않을 때"], [("t", "6×3", B), ("t", "=?", O)]),
    "gpep05": (["나눗셈 ①", "똑같이 나누어 주기"], [("t", "12", B), ("t", "÷", K), ("t", "3", O)]),
    "gpep06": (["나눗셈 ②", "몇 개씩 묶기"], [("t", "12", B), ("t", "÷", K), ("t", "3", O)]),
    "gpep07": (["곱셈으로", "나눗셈 답 찾기"], [("t", "3×", B), ("t", "□", O), ("t", "=12", B)]),
    "gpep08": (["하나를", "똑같이 나누기"], [("bar", 4)]),
    "gpep09": (["조각에 이름 붙이기", "2분의 1, 4분의 1"], [("f", 1, 2), ("t", " ", K), ("f", 1, 4)]),
    "gpep10": (["조각이 많을수록", "한 조각은 작아져요"], [("f", 1, 2), ("t", "＞", K), ("f", 1, 4)]),
    "gpep11": (["12개의 3분의 1은", "몇 개?"], [("t", "12의", K), ("f", 1, 3)]),
    "gpep12": (["12개의 3분의 2는", "몇 개?"], [("t", "12의", K), ("f", 2, 3)]),
    "gfep01": (["분수는 '똑같이'", "나누는 데서 시작해요"], [("bar", 4)]),
    "gfep02": (["부분을 분수로", "나타내는 3단계"], [("f", 2, 5)]),
    "gfep03": (["헷갈리는 그림도", "3단계로"], [("f", "?", 5)]),
    "gfep04": (["칸 크기가 다르면", "어떻게 할까?"], [("f", 1, 4)]),
    "gfep05": (["분수만큼", "색칠하기"], [("f", 3, 4)]),
    "gfep06": (["여러 개 중의 부분도", "분수로"], [("t", "12의", K), ("f", 3, 4)]),
    "gfep07": (["몇 개가 모이면", "1이 될까?"], [("f", 5, 5), ("t", "=1", G)]),
    "gfep08": (["진분수", "1보다 작은 분수"], [("f", 3, 4)]),
    "gfep09": (["가분수", "1과 같거나 큰 분수"], [("f", 7, 4)]),
    "gfep10": (["대분수", "자연수와 진분수를 함께"], [("m", 1, 3, 4)]),
    "gfep11": (["가분수 ↔ 대분수", "바꾸기"], [("f", 7, 4), ("t", "=", K), ("m", 1, 3, 4)]),
    "gfep12": (["분수 이야기 ①", "분수는 어디에서 왔을까?"], [("t", "3500년 전", O)]),
    "gfep13": (["분수 이야기 ②", "분수 쓰는 모양의 역사"], [("f", 3, 4), ("t", "3/4", B)]),
    "gfep14": (["분수 이야기 ③", "이름에 담긴 뜻"], [("t", "眞假帶", K)]),
    "gnep01": (["자연수란", "무엇일까?"], [("t", "1, 2, 3 …", B)]),
    "gnep02": (["사람들은 언제부터", "수를 세었을까?"], [("t", "||||| ||", O)]),
    "gnep03": (["자연수는 끝이 없어요", "그럼 0은?"], [("t", "0", G), ("t", "?", O)]),
    "gdep01": (["나눗셈은", "언제 쓸까?"], [("t", "÷", B)]),
    "gdep02": (["나눗셈 식", "읽고 쓰기"], [("t", "12", B), ("t", "÷", K), ("t", "3", O), ("t", "=", K), ("t", "4", G)]),
    "gdep03": (["몇 명에게? 몇 개씩?", "두 가지 뜻"], [("t", "12", B), ("t", "÷", K), ("t", "3", O)]),
    "gdep04": (["뺄셈으로", "나눗셈하기"], [("t", "12−3−3…", B)]),
    "gdep05": (["곱셈구구로", "몫 찾기"], [("t", "4×", O), ("t", "□", G), ("t", "=28", B)]),
    "gdep06": (["1과 0이 들어간", "나눗셈"], [("t", "5÷0", O), ("t", "?", K)]),
    "gdep07": (["똑같이 나누고 남으면?", "나머지"], [("t", "13÷4=3…", B), ("t", "1", PUR)]),
    "gdep08": (["나머지는 왜", "나누는 수보다 작을까?"], [("t", "나머지", PUR), ("t", "＜", K), ("t", "4", O)]),
    "gdep09": (["나누어떨어진다는 것", ""], [("t", "12÷4=3", B)]),
    "gdep10": (["나눗셈이 맞는지", "확인하기"], [("t", "4×3+1", O), ("t", "=13", B)]),
    "gdep11": (["나머지를 어떻게 할까?", "생활 문제"], [("t", "6…2", B), ("t", "→7", G)]),
    "gdep12": (["몇십을", "나누면?"], [("t", "60", B), ("t", "÷3=", K), ("t", "20", G)]),
    "gdep13": (["나눗셈 세로셈", "어디에 무엇을 쓸까?"], [("t", "4)48", B)]),
    "gdep14": (["십 모형을", "풀어서 나누기"], [("t", "52", B), ("t", "÷4", O)]),
    "gdep15": (["세 자리 수 나누기", "몫은 몇 자리?"], [("t", "612÷3", B), ("t", "=204", G)]),
    "gdep16": (["두 자리 수로 나누기", "몫 어림하기"], [("t", "76÷19", B), ("t", "≈", K), ("t", "4", G)]),
    "gdep17": (["나눗셈 문장제", "3단계"], [("t", "①②③", O)]),
    "gdep18": (["곱셈일까", "나눗셈일까?"], [("t", "×", B), ("t", "?", K), ("t", "÷", O)]),
    "gdep19": (["거꾸로 생각하기", "어떤 수 구하기"], [("t", "□÷4=6", B)]),
    "gdep20": (["나눗셈과 분수는", "친구"], [("t", "3÷4=", B), ("f", 3, 4)]),
}


def font(size):
    return ImageFont.truetype(FONT, size, index=1)


def tw(d, s, f):
    x0, y0, x1, y1 = d.textbbox((0, 0), s, font=f)
    return x1 - x0, y1 - y0, x0, y0


def frac_size(d, n, den, size):
    f = font(size)
    a, b = tw(d, str(n), f), tw(d, str(den), f)
    return max(a[0], b[0]) + size * 0.2, a[1] + b[1] + size * 0.45


def draw_frac(d, x, cy, n, den, size):
    f = font(size)
    w, h = frac_size(d, n, den, size)
    a, b = tw(d, str(n), f), tw(d, str(den), f)
    lw = max(6, size // 12)
    d.line([(x, cy), (x + w, cy)], fill=INK, width=lw)
    d.text((x + (w - a[0]) / 2 - a[2], cy - size * 0.15 - a[1] - a[3]), str(n), font=f, fill=ORANGE)
    d.text((x + (w - b[0]) / 2 - b[2], cy + size * 0.15 - b[3]), str(den), font=f, fill=BLUE)
    return w


def token_w(d, t, size):
    if t[0] == "t":
        return tw(d, t[1], font(size))[0]
    if t[0] == "f":
        return frac_size(d, t[1], t[2], size)[0]
    if t[0] == "m":
        return tw(d, str(t[1]), font(int(size * 1.15)))[0] + size * 0.08 + frac_size(d, t[2], t[3], size)[0]
    if t[0] == "bar":
        return size * 4.2
    return 0


def draw_tokens(d, toks, cx, cy, maxw, size):
    gap = size * 0.18
    while size > 40:
        total = sum(token_w(d, t, size) for t in toks) + gap * (len(toks) - 1)
        if total <= maxw:
            break
        size -= 6
        gap = size * 0.18
    x = cx - total / 2
    for t in toks:
        if t[0] == "t":
            f = font(size)
            w, h, ox, oy = tw(d, t[1], f)
            d.text((x - ox, cy - h / 2 - oy), t[1], font=f, fill=t[2])
        elif t[0] == "f":
            draw_frac(d, x, cy, t[1], t[2], size)
        elif t[0] == "m":
            f = font(int(size * 1.15))
            w, h, ox, oy = tw(d, str(t[1]), f)
            d.text((x - ox, cy - h / 2 - oy), str(t[1]), font=f, fill=GREEN)
            draw_frac(d, x + w + size * 0.08, cy, t[2], t[3], size)
        elif t[0] == "bar":
            n = t[1]
            bw, bh = size * 4.2, size * 1.3
            for i in range(n):
                x0 = x + bw * i / n
                d.rectangle([x0, cy - bh / 2, x0 + bw / n, cy + bh / 2], fill=ORANGE if i == 0 else "#FFFFFF",
                            outline=INK, width=6)
        x += token_w(d, t, size) + gap


def make(folder):
    pre = folder[:2]
    name, bg, acc = SERIES[pre]
    no = int(folder[-2:])
    title, toks = EP[folder]
    im = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(im)
    # 오른쪽 흰 판
    d.rounded_rectangle([760, 120, 1230, 560], radius=36, fill="#FFFFFF", outline=acc, width=6)
    draw_tokens(d, toks, 995, 340, 420, 170)
    # 이름표
    f = font(44)
    lab = f"{name} {no}화"
    w, h, ox, oy = tw(d, lab, f)
    d.rounded_rectangle([56, 56, 56 + w + 56, 56 + h + 36], radius=22, fill=acc)
    d.text((56 + 28 - ox, 56 + 18 - oy), lab, font=f, fill="#FFFFFF")
    # 제목
    size = 92
    while size > 50:
        f = font(size)
        if max(tw(d, s, f)[0] for s in title) <= 660:
            break
        size -= 4
    title = [t for t in title if t]
    y = 200 if len(title) == 2 else 260
    for i, s in enumerate(title):
        w, h, ox, oy = tw(d, s, f)
        d.text((60 - ox, y - oy), s, font=f, fill=INK if i == 0 else acc)
        y += size * 1.3
    # 아래 띠
    d.rectangle([0, 620, W, H], fill=acc)
    f = font(40)
    s = "「수학 원리 돋보기」 초등교사 홍지희"
    w, h, ox, oy = tw(d, s, f)
    d.text((60 - ox, 670 - h / 2 - oy), s, font=f, fill="#FFFFFF")
    logo = os.path.join(HERE, "assets", "logo.png")
    if os.path.exists(logo):
        lg = Image.open(logo).convert("RGBA")
        lg.thumbnail((150, 150))
        im.paste(lg, (W - lg.width - 40, H - lg.height - 20), lg)
    os.makedirs(OUT, exist_ok=True)
    p = os.path.join(OUT, f"{folder}.png")
    im.save(p)
    return p


if __name__ == "__main__":
    names = sys.argv[1:] or list(EP)
    for n in names:
        print(make(n))
