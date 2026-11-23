"""유튜브 썸네일(미리보기 이미지) 만들기 — 1280×720 PNG

    python thumbs.py            → thumbs/<폴더>.png (분수 준비·분수 특별편·자연수 이야기)
    python thumbs.py gfep03     → 그 편만

모양: 시리즈 바탕색, 왼쪽 위 '시리즈 N화' 이름표, 큰 제목(두 줄까지), 오른쪽에 큰 그림 글자(분수·식),
아래 띠에 「수학 원리 돋보기」와 선생님 로고. 글꼴 Noto Sans CJK KR Bold(리눅스 fonts-noto-cjk).
"""
import glob
import os
import re
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
    "gc": ("개념 차근차근", "#FFF6DC", "#2C5D8F"),
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
    "gcep01": (["9까지의 수", "하나·일·첫째"], [("t", "3", B), ("t", "셋째", O)]),
    "gcep02": (["모으기와", "가르기"], [("t", "2", B), ("t", "+", K), ("t", "3", O), ("t", "=5", G)]),
    "gcep03": (["10을 만드는", "짝"], [("t", "7+3", B), ("t", "=10", G)]),
    "gcep04": (["10개씩 묶음과 낱개", "자릿값"], [("t", "2", B), ("t", "3", O)]),
    "gcep05": (["100까지의 수", "뛰어 세기"], [("t", "10씩", G)]),
    "gcep06": (["짝수와 홀수", "피타고라스 학파 이야기"], [("t", "짝", B), ("t", "·", K), ("t", "홀", O)]),
    "gcep07": (["수의 크기 비교와", "부등호 > <"], [("t", "64", G), ("t", ">", K), ("t", "46", B)]),
    "gcep08": (["세 자리 수와", "네 자리 수"], [("t", "2416", B)]),
    "gcep09": (["숫자는 어떻게", "바뀌어 왔을까?"], [("t", "XII", K), ("t", "=12", G)]),
    "gcep10": (["덧셈의 뜻", "+ 기호 이야기"], [("t", "3+2", B), ("t", "=5", G)]),
    "gcep11": (["뺄셈의 뜻", "덜어 내기와 비교하기"], [("t", "5−2", O), ("t", "=3", G)]),
    "gcep12": (["= 는", "'같다'예요"], [("t", "8+4", B), ("t", "=□+5", O)]),
    "gcep13": (["0을 더하고", "빼면?"], [("t", "3+0", B), ("t", "=3", G)]),
    "gcep14": (["10을 만들어 더하기", "8 + 5"], [("t", "8+2", B), ("t", "+3", O)]),
    "gcep15": (["10에서 빼기", "13 − 5"], [("t", "13−5", B), ("t", "=8", G)]),
    "gcep16": (["두 자리 수", "덧셈 세로셈"], [("t", "38+27", B)]),
    "gcep17": (["두 자리 수", "뺄셈 세로셈"], [("t", "52−27", O)]),
    "gcep18": (["덧셈과 뺄셈은 가족", "□ 구하기"], [("t", "□+5", O), ("t", "=8", G)]),
    "gcep19": (["세 자리 수", "덧셈·뺄셈"], [("t", "368+257", B)]),
    "gcep20": (["계산을 도와준", "도구들"], [("t", "산가지", O)]),
    "gcep21": (["곱셈의 뜻", "× 기호 이야기"], [("t", "3×4", B), ("t", "=12", G)]),
    "gcep22": (["2단·5단", "만들기"], [("t", "5×6", O), ("t", "=30", G)]),
    "gcep23": (["3·6단", "4·8단"], [("t", "6단", O), ("t", "=3단×2", B)]),
    "gcep24": (["7·9단", "1단과 0의 곱"], [("t", "9×4", O), ("t", "=36", G)]),
    "gcep25": (["곱셈표의 비밀과", "'구구' 이야기"], [("t", "九九", K)]),
    "gcep26": (["두·세 자리 수", "× 한 자리 수"], [("t", "128×3", B)]),
    "gcep27": (["두·세 자리 수", "× 두 자리 수"], [("t", "24×13", B)]),
    "gcep28": (["옛날 사람들의", "곱셈법"], [("t", "격자", O)]),
    "gcep29": (["÷ 기호 이야기와", "나눗셈 안내"], [("t", "÷", B)]),
    "gcep30": (["만, 십만,", "백만, 천만"], [("t", "10000", B)]),
    "gcep31": (["억과 조", "네 자리씩 끊어 읽기"], [("t", "3845억", O)]),
    "gcep32": (["뛰어 세기와", "큰 수의 크기 비교"], [("t", "10만씩", B)]),
    "gcep33": (["분모가 같은", "분수의 크기 비교"], [("f", 4, 5), ("t", ">", K), ("f", 3, 5)]),
    "gcep34": (["분모가 같은", "분수의 덧셈·뺄셈"], [("f", 2, 7), ("t", "+", K), ("f", 3, 7)]),
    "gcep35": (["소수는 언제", "생겼을까? 0.1"], [("f", 1, 10), ("t", "=0.1", G)]),
    "gcep36": (["소수 두 자리", "세 자리"], [("t", "0.01", O)]),
    "gcep37": (["소수의", "크기 비교"], [("t", "0.5", B), ("t", ">", K), ("t", "0.45", O)]),
    "gcep38": (["소수의", "덧셈"], [("t", "1.6+0.85", B)]),
    "gcep39": (["소수의", "뺄셈"], [("t", "5−1.37", O)]),
    "gcep40": (["자연수의 혼합 계산과", "괄호"], [("t", "( )", O), ("t", "→×÷→+−", B)]),
    "gcep41": (["약수"], [("t", "12의 약수", B)]),
    "gcep42": (["배수"], [("t", "3, 6, 9 …", O)]),
    "gcep43": (["약수와 배수의", "관계"], [("t", "12=3×4", G)]),
    "gcep44": (["공약수와", "최대공약수"], [("t", "12, 18", B), ("t", "→6", G)]),
    "gcep45": (["공배수와", "최소공배수"], [("t", "4, 6", B), ("t", "→12", G)]),
    "gcep46": (["소수(素數)는", "무엇일까?"], [("t", "2 3 5 7", O)]),
    "gcep47": (["크기가 같은", "분수"], [("f", 1, 2), ("t", "=", K), ("f", 2, 4)]),
    "gcep48": (["약분과", "기약분수"], [("f", 12, 18), ("t", "→", K), ("f", 2, 3)]),
    "gcep49": (["통분"], [("f", 1, 2), ("t", ",", K), ("f", 1, 3), ("t", "→6", G)]),
    "gcep50": (["분모가 다른 분수의", "크기 비교"], [("f", 2, 3), ("t", "?", K), ("f", 3, 4)]),
    "gcep51": (["분모가 다른 분수의", "덧셈"], [("f", 1, 2), ("t", "+", K), ("f", 1, 3)]),
    "gcep52": (["분모가 다른 분수의", "뺄셈"], [("f", 5, 6), ("t", "−", K), ("f", 1, 4)]),
    "gcep53": (["분수와 소수의", "관계"], [("f", 3, 4), ("t", "=0.75", G)]),
    "gcep54": (["(분수)", "× (자연수)"], [("f", 2, 5), ("t", "×3", O)]),
    "gcep55": (["(분수)", "× (분수)"], [("f", 1, 2), ("t", "×", K), ("f", 1, 3)]),
    "gcep56": (["(소수)", "× (자연수)"], [("t", "0.3×4", B)]),
    "gcep57": (["(소수) × (소수)", "소수점 위치"], [("t", "0.8×0.6", B)]),
    "gcep58": (["(분수)", "÷ (자연수)"], [("f", 3, 5), ("t", "÷2", O)]),
    "gcep59": (["(분수)", "÷ (분수)"], [("f", 6, 7), ("t", "÷", K), ("f", 2, 7)]),
    "gcep60": (["(소수)", "÷ (자연수)"], [("t", "6.2÷2", B)]),
    "gcep61": (["(소수)", "÷ (소수)"], [("t", "3.6÷0.9", B)]),
    "gcep62": (["몫을 반올림하여", "나타내기"], [("t", "7÷3", B), ("t", "≈2.3", G)]),
    "gcep63": (["이상·이하", "초과·미만"], [("t", "● ○", O)]),
    "gcep64": (["올림·버림", "반올림"], [("t", "243→300", O)]),
    "gcep65": (["무늬에서", "규칙 찾기"], [("t", "○△○△", O)]),
    "gcep66": (["수 배열에서", "규칙 찾기"], [("t", "2, 5, 8 …", B)]),
    "gcep67": (["도형 배열과", "계산식 배열"], [("t", "1+3+5", O), ("t", "=9", G)]),
    "gcep68": (["대응 관계와", "식"], [("t", "△=□×4", B)]),
    "gcep69": (["비"], [("t", "3 : 2", O)]),
    "gcep70": (["비율"], [("t", "2:5", O), ("t", "=0.4", G)]),
    "gcep71": (["백분율", "% 이야기"], [("t", "40 %", G)]),
    "gcep72": (["비례식"], [("t", "2:3=4:6", B)]),
    "gcep73": (["비례배분"], [("t", "10→4, 6", O)]),
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


def fit_size(d, toks, maxw, size):
    while size > 40:
        total = sum(token_w(d, t, size) for t in toks) + size * 0.18 * (len(toks) - 1)
        if total <= maxw:
            break
        size -= 6
    return size


def draw_glyph(d, toks, cx, cy, maxw, size):
    """한 줄에 넣으면 너무 작아지면 = · ↔ 앞에서(없으면 가운데) 두 줄로 나눔"""
    one = fit_size(d, toks, maxw, size)
    if one >= 100 or len(toks) < 3 or any(t[0] == "t" and t[1] == "·" for t in toks):
        return draw_tokens(d, toks, cx, cy, maxw, size)
    cut = [i for i, t in enumerate(toks) if t[0] == "t" and t[1] in ("=", "↔", "≈", "→", "⊃", ">", "<")]
    i = min(cut, key=lambda i: abs(i - len(toks) / 2)) if cut else len(toks) // 2
    a, b = toks[:i], toks[i:]
    sz = min(fit_size(d, a, maxw, size), fit_size(d, b, maxw, size), 130)
    has_f = any(t[0] in "fm" for t in toks)
    if has_f:   # 분수가 있으면 위아래로 쌓지 않음
        return draw_tokens(d, toks, cx, cy, maxw, size)
    dy = sz * 0.62
    draw_tokens(d, a, cx, cy - dy, maxw, sz)
    draw_tokens(d, b, cx, cy + dy, maxw, sz)


def draw_tokens(d, toks, cx, cy, maxw, size):
    size = fit_size(d, toks, maxw, size)
    gap = size * 0.18
    total = sum(token_w(d, t, size) for t in toks) + gap * (len(toks) - 1)
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


COL = {"b": BLUE, "o": ORANGE, "g": GREEN, "k": INK, "p": PUR}


def parse(spec):
    """thumbs_main.G의 글 → 토큰 (설명은 thumbs_main.py 맨 위)"""
    out = []
    for w in spec.split():
        mm = re.fullmatch(r"m(\d+)_(\d+)/(\d+)", w)
        ff = re.fullmatch(r"f(\d+)/(\d+)", w)
        if mm:
            out.append(("m", int(mm[1]), int(mm[2]), int(mm[3])))
        elif ff:
            out.append(("f", int(ff[1]), int(ff[2])))
        elif w[0] in COL and len(w) > 1:
            out.append(("t", w[1:].replace("_", " ").replace("−", "－"), COL[w[0]]))
        elif w[0] not in COL:
            out.append(("t", w.replace("_", " "), INK))
    return out


def split_title(t):
    """제목을 두 줄로(가운데에 가까운 빈칸에서 나눔)"""
    if len(t) <= 8 or " " not in t:
        return [t, ""]
    sp = [i for i, c in enumerate(t) if c == " " and not t[i - 1].isdigit()] or [i for i, c in enumerate(t) if c == " "]
    i = min(sp, key=lambda i: abs(i - len(t) / 2))
    return [t[:i], t[i + 1:]]


def main_info(folder):
    """3~6학년 본편: (이름표, 바탕, 강조색, 제목 줄, 토큰)"""
    from thumbs_main import G
    src = open(os.path.join(HERE, folder, "scene.py"), encoding="utf-8").read()
    title = re.search(r'EP_TITLE = "([^"]+)"', src)[1]
    no = int(re.search(r"EP_NO = (\d+)", src)[1])
    gs = re.search(r"GRADE, SEM = (\d), (\d)", src)
    grade, sem = (int(gs[1]), int(gs[2])) if gs else (3, 1)
    bg, acc = MAIN_THEME[(grade, sem)]
    return f"{grade}학년 {no}화", bg, acc, split_title(title), parse(G[folder])


MAIN_THEME = {  # series_style.THEMES와 같은 색(3학년 강조색만 진한 살구)
    (3, 1): ("#FFF9EE", "#B4610F"), (3, 2): ("#FFF9EE", "#B4610F"),
    (4, 1): ("#EDF7F0", "#1F5E46"), (4, 2): ("#EDF3FB", "#24427A"),
    (5, 1): ("#F4F0FA", "#4B3577"), (5, 2): ("#FDF1EA", "#8A3B1E"),
    (6, 1): ("#FBF6E1", "#6B5310"), (6, 2): ("#F7EEF1", "#7A2E4A"),
}


def make(folder):
    pre = folder[:2]
    if pre in SERIES:
        name, bg, acc = SERIES[pre]
        lab = f"{name} {int(re.search(r'ep(\d+)$', folder)[1])}화"
        title, toks = EP[folder]
    else:
        lab, bg, acc, title, toks = main_info(folder)
    im = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(im)
    # 오른쪽 흰 판
    d.rounded_rectangle([760, 120, 1230, 560], radius=36, fill="#FFFFFF", outline=acc, width=6)
    draw_glyph(d, toks, 995, 340, 420, 170)
    # 이름표
    f = font(44)
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
    args = sys.argv[1:]
    if args == ["main"]:   # 3~6학년 본편 전체
        names = sorted(os.path.basename(p) for p in glob.glob(os.path.join(HERE, "ep[0-9][0-9]")))
        names += sorted(os.path.basename(p) for p in glob.glob(os.path.join(HERE, "g[456]ep[0-9][0-9]")))
    else:
        names = args or list(EP)
    for n in names:
        print(make(n))
