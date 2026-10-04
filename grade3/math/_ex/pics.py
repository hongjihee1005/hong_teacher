#!/usr/bin/env python3
"""수학 2학기 2단원(나눗셈) — 모형으로 나눈 결과 그림 넣기 (2026-10-04)

  python3 pics.py      -> 결과를 확인하는 계단 위에 '묶음마다 십·일 모형' 그림을 넣음(여러 번 실행해도 안전)
  그다음 저장소 루트에서 python3 _build/theme/apply_content_theme.py grade3/math/sem2-soop/u2-div.html

- 앱은 저장소 밖에서 빌드해 들여오므로, 덮은 뒤에는 이 스크립트를 다시 돌리세요(apply.py·help.py와 같이).
- picBlockGroups(묶음 그림)에 opt.title(제목)·opt.r(남은 일 모형)을 더하고, picDivResult(body, 나누어지는 수, 나누는 수)를 씁니다.
- 넣는 곳: TARGETS의 (계단 이름 또는 안내 글, 나누어지는 수, 나누는 수)
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from help import scan  # 괄호 짝 찾기(문자열·주석 건너뜀)

FILE = os.path.join(os.path.dirname(HERE), 'sem2-soop', 'u2-div.html')
TARGETS = [  # 앞 계단에서 수 모형으로 나눈 결과를 다음 계단에서 확인하는 곳
    ('name: "규칙 찾기", inst: "십의 규칙을 찾아보세요."', 60, 3),
    ('name: "자리별로 보기", inst: "나눈 결과를 자리별로 확인해요."', 48, 4),
    ('name: "자리별로 보기", inst: "바꾼 과정을 확인해요."', 70, 5),
    ('name: "묶어 세기와 자리별로 보기"', 52, 4),
    ('name: "식으로 쓰기", inst: "몫과 나머지를 써 보세요."', 53, 4),
]
OLD_TITLE = 'svg.append(txt(W / 2, 28, `${a}이 ${b}묶음 → ${a} × ${b}`, 27));'
NEW_TITLE = 'svg.append(txt(W / 2, 28, opt.title || `${a}이 ${b}묶음 → ${a} × ${b}`, 27)); /*hj-pic*/'
OLD_W = '  const W = LAB + b * (gw + gapG) + 12;\n'
NEW_W = '  const rw = opt.r ? Math.max(76, opt.r * (U + 6)) + padX * 2 : 0; /*hj-pic*/\n  const W = LAB + b * (gw + gapG) + (rw ? rw + gapG : 0) + 12;\n'
OLD_END = '  body.append(h("div", { class: "stage" }, picFit(svg, W)));\n}\n'
NEW_END = ('  if (rw) { const x0 = LAB + b * (gw + gapG); /*hj-pic*/ /* 똑같이 나누고 남은 일 모형 */\n'
           '    svg.append(svgEl("rect", { x: x0, y: boxTop, width: rw, height: boxBot - boxTop, rx: 12, fill: "#FFF4E6", stroke: "#D9731A", "stroke-width": 3, "stroke-dasharray": "4 6" }));\n'
           '    for (let n = 0; n < opt.r; n++) svg.append(svgEl("rect", { x: x0 + padX + n * (U + 6), y: ys[2], width: U, height: U, fill: "#FFD8B0", stroke: INK, "stroke-width": 2 }));\n'
           '    svg.append(txt(x0 + rw / 2, boxBot + 26, "남은 것", 23)); }\n'
           '  body.append(h("div", { class: "stage" }, picFit(svg, W)));\n}\n'
           '/*hj-pic*/ /* 나눗셈 결과 그림: a ÷ b를 b묶음으로 똑같이 나눈 모습(남으면 \'남은 것\' 칸) */\n'
           'function picDivResult(body, a, b) {\n'
           '  const q = Math.floor(a / b), r = a % b, t = Math.floor(q / 10), o = q % 10;\n'
           '  const parts = [t ? `십 모형 ${t}개` : "", o ? `일 모형 ${o}개` : ""].filter(Boolean).join(", ");\n'
           '  picBlockGroups(body, { a: q, b, r, title: `${a} ÷ ${b} → 한 묶음에 ${parts}${r ? `, 남은 일 모형 ${r}개` : ""}` });\n'
           '}\n')


def main():
    s = open(FILE, encoding='utf-8').read()
    if '/*hj-pic*/' not in s:
        a = s.index('function picBlockGroups(body, opt) {'); e = s.index(OLD_END, a)
        seg = s[a:e + len(OLD_END)]
        assert seg.count(OLD_TITLE) == 1 and seg.count(OLD_W) == 1, '그림 함수 모양이 바뀌었어요'
        seg = seg.replace(OLD_TITLE, NEW_TITLE).replace(OLD_W, NEW_W).replace(OLD_END, NEW_END)
        s = s[:a] + seg + s[e + len(OLD_END):]
    n = 0
    for key, x, y in TARGETS:
        assert s.count(key) == 1, ('계단을 찾지 못했어요', key)
        k = s.index(key); r = s.index('render: (b, a) =>', k)
        head = s[r:r + 200]
        if head.startswith(f'render: (b, a) => (picDivResult(b, {x}, {y}),'): n += 1; continue  # 이미 넣음
        assert head.startswith('render: (b, a) => numbers(b, a, ['), ('모양이 달라요', key, head[:60])
        c = r + len('render: (b, a) => numbers(')
        end, _ = scan(s, c)
        s = s[:r] + f'render: (b, a) => (picDivResult(b, {x}, {y}), ' + s[r + len('render: (b, a) => '):end + 1] + ')' + s[end + 1:]
        n += 1
    open(FILE, 'w', encoding='utf-8').write(s)
    print('그림 넣은 계단', n)


if __name__ == '__main__':
    main()
