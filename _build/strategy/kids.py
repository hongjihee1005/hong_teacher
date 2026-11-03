#!/usr/bin/env python3
"""사고전략 아이용 따로 쓰는 판 → _build/strategy/standalone/ (저장소 hongjihee1005/thinking-tools 가 그대로 가져감)

    python3 _build/strategy/kids.py

자료실 판(thinking/)과 같은 데이터(data_routines.py, data_more.py)·같은 화면(build.py)을 쓰고,
교사용 안내 탭을 빼서 학생용 안내 + 활동지만 남깁니다. 자료실(hong_teacher)로 가는 링크는 넣지 않습니다.
thinking-tools 저장소의 파일은 직접 고치지 말고, 여기(원본)를 고쳐 hong_teacher main에 올리세요.
그 저장소의 .github/workflows/sync.yml(원본 _build/strategy/repo/)이 한 시간마다 standalone/ 을 통째로 가져갑니다.
"""
import re, shutil, pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import build as B
from build import E, R, ST, STAGES, SUBJ, rfile

SITE = 'https://hongjihee1005.github.io/thinking-tools/'
NAME = '생각 도구'
TAIL = ' | 초등교사 홍지희'
DESC = '초등교사 홍지희가 만든 어린이 생각 도구 — 하버드 Project Zero 사고 루틴 23가지를 탐구 단계별로, 학생용 안내와 화면에서 쓰거나 인쇄하는 활동지로 담았어요.'
OUT = HERE / 'standalone'

TEACHER = re.compile(r'<section class="tk-pane" id="teacher" role="tabpanel">.*?</section>', re.S)
TBTN = '<button type="button" role="tab" data-p="teacher">🧑‍🏫 교사용 안내</button>'
FOOT_OLD = '<p>2022 개정 교육과정, 지도서, 교과서를 바탕으로 만든 학습 자료입니다.</p>'
FOOT_NEW = '<p>하버드 대학교 Project Zero의 사고 루틴을 바탕으로 새로 쓴 어린이 생각 도구입니다.</p>'


def head_extra(path, desc=DESC):
    url = SITE + ('' if path == 'index.html' else path)
    return (f'<meta name="description" content="{E(desc)}">\n<meta name="author" content="초등교사 홍지희">\n'
            f'<link rel="canonical" href="{url}">\n<meta property="og:type" content="website"><meta property="og:locale" content="ko_KR">'
            f'<meta property="og:site_name" content="{NAME}"><meta property="og:url" content="{url}">'
            f'<meta property="og:description" content="{E(desc)}">\n')


def kidify(html, path, depth, title):
    """자료실 판 한 쪽 → 아이용 한 쪽."""
    up = '../' * depth
    s = TEACHER.sub('', html, count=1).replace(TBTN, '', 1)
    assert 'id="teacher"' not in s and 'data-p="teacher"' not in s, path
    s = s.replace('🖨️ 교사용 안내 인쇄', '')
    # 맨 아래 '자료 목록으로'·떠 있는 홈 단추 → 이 사이트 첫 화면
    s = s.replace('<a class="tolist" href="index.html">📋 자료 목록으로</a>', f'<a class="tolist" href="{up}index.html">🧰 생각 도구 목록으로</a>', 1)
    s = re.sub(r'(<a id="hj-home" href=")[^"]*(")', lambda m: f'{m.group(1)}{up}index.html{m.group(2)}', s, count=1)
    s = s.replace(FOOT_OLD, FOOT_NEW, 1)
    s = re.sub(r'<title>.*?</title>', lambda m: f'<title>{E(title)}{TAIL}</title>\n' + head_extra(path), s, count=1, flags=re.S)
    return s


def subj_header(j):
    return (f'<header class="tk-hd"><p class="tk-kicker">생각 도구 · 과목별</p>'
            f'<h1><span>{j["ico"]}</span>{E(j["nm"])} 시간의 생각 도구</h1><p class="tk-one">{E(j["kid_intro"])}</p></header>')


def home():
    stages = ''
    for s in STAGES:
        rs = [x for x in R if x['stage'] == s['n'] or s['n'] in x['also']]
        cards = ''.join(
            f'<a class="kcard" style="text-decoration:none;color:inherit;border-top-color:{s["acc"]}" href="routines/{rfile(x)}#student">'
            f'<span class="no">{E(x["en"])}</span><h3>{x["ico"]} {E(x["ko"])}</h3><p style="margin:0">{E(x["kid"]["intro"])}</p></a>' for x in rs)
        stages += (f'<section class="kstage" style="--acc:{s["acc"]}"><h2>{s["ico"]} {s["n"]}단계 {E(s["name"])}</h2>'
                   f'<p class="kq">“{E(s["q"])}” — {E(s["kid_intro"])}</p>'
                   f'<div class="btns"><a class="btn" href="stage/{s["id"]}.html#student">📒 {s["n"]}단계 안내</a>'
                   f'<a class="btn" href="stage/{s["id"]}.html#sheet">🖨️ {s["n"]}단계 노트(활동지)</a></div>'
                   f'<div class="kcards">{cards}</div></section>')
    subj = ''.join(f'<a class="btn" href="subject/{j["id"]}.html#student">{j["ico"]} {E(j["nm"])}</a>' for j in SUBJ)
    body = (f'<header class="tk-hd"><p class="tk-kicker">초등교사 홍지희 · 어린이 생각 도구</p><h1><span>🧰</span>{NAME}</h1>'
            '<p class="tk-one">생각을 잘하게 도와주는 “질문 틀”이에요. 탐구할 때 지금 하는 일에 맞는 도구를 골라 써 봐요. '
            '도구를 누르면 하는 방법과 활동지가 나와요.</p></header>'
            '<div class="btns"><a class="btn main" href="guide.html#student">💡 생각 도구가 뭐예요?</a>'
            '<a class="btn" href="guide.html#sheet">🖨️ 탐구 노트 한 장</a></div>'
            f'<h2 class="kh">📚 과목에서 찾기</h2><div class="btns">{subj}</div>'
            f'<h2 class="kh">🔍 탐구 단계에서 찾기</h2>{stages}' + B.src(note=B.STAGE_NOTE))
    css = ('.kh{font-size:clamp(22px,2.4vw,28px);margin:28px 0 6px}'
           '.kstage{background:var(--paper);border:1.5px solid var(--line);border-left:8px solid var(--acc);border-radius:20px;padding:16px 20px;margin:16px 0}'
           '.kstage h2{margin:0 0 4px;font-size:clamp(22px,2.4vw,28px)}.kstage .kq{margin:0;color:var(--soft)}'
           '.kstage .kcard{border-top-width:8px}')
    return (f'<!DOCTYPE html>\n<html lang="ko"><head><meta charset="UTF-8">\n'
            f'<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'<title>{NAME} — 탐구할 때 쓰는 생각 도구 23가지{TAIL}</title>\n' + head_extra('index.html')
            + '<link href="https://fonts.googleapis.com/css2?family=Jua&family=Gowun+Dodum&display=swap" rel="stylesheet">\n'
            f'<style>{B.CSS}{css}</style>{B.FOOTCSS}<style>:root{{--acc:#8A63D2}}</style></head><body>\n<main class="tk">\n{body}\n'
            + B.FOOT.replace(FOOT_OLD, FOOT_NEW, 1) + '\n</main>\n</body></html>\n')


def main():
    if OUT.exists():
        shutil.rmtree(OUT)
    for d in ('stage', 'subject', 'routines'):
        (OUT / d).mkdir(parents=True)
    pages = {}
    pages['index.html'] = home()
    pages['guide.html'] = kidify(B.guide_page(), 'guide.html', 0, f'생각 도구가 뭐예요? · {NAME}')
    for s in STAGES:
        pages[f'stage/{s["id"]}.html'] = kidify(B.stage_page(s), f'stage/{s["id"]}.html', 1, f'{s["n"]}단계 {s["name"]} · {NAME}')
    for j in SUBJ:
        h = re.sub(r'<header class="tk-hd">.*?</header>', lambda m: subj_header(j), B.subj_page(j), count=1, flags=re.S)
        pages[f'subject/{j["id"]}.html'] = kidify(h, f'subject/{j["id"]}.html', 1, f'{j["nm"]} 시간의 생각 도구 · {NAME}')
    for x in R:
        pages[f'routines/{rfile(x)}'] = kidify(B.routine_page(x), f'routines/{rfile(x)}', 1, f'{x["ko"]} · {NAME}')
    for p, s in pages.items():
        (OUT / p).write_text(s, encoding='utf-8')
    # 사이트 밖(자료실)으로 가는 링크가 없는지, 이 사이트 안 링크가 모두 있는지
    for p, s in pages.items():
        assert 'hong_teacher' not in s, p
        for h in re.findall(r'href="([^"#:]+\.html)', s):
            assert (OUT / p).parent.joinpath(h).resolve().exists(), (p, h)
    (OUT / '.nojekyll').write_text('', encoding='utf-8')
    (OUT / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                                     + ''.join(f'<url><loc>{SITE}{"" if p == "index.html" else p}</loc></url>\n' for p in pages)
                                     + '</urlset>\n', encoding='utf-8')
    (OUT / 'README.md').write_text(
        f'# {NAME} (thinking-tools)\n\n주소: {SITE}\n\n초등교사 홍지희가 만든 어린이 생각 도구입니다. 하버드 대학교 Project Zero의 사고 루틴 23가지를 '
        '탐구 단계별·과목별로, 학생용 안내와 활동지로 담았습니다.\n\n'
        '**이 저장소의 파일은 직접 고치지 마세요.** 원본은 `hongjihee1005/hong_teacher`의 `_build/strategy/`(`kids.py`)이고, '
        '`.github/workflows/sync.yml`(원본에서 가져오기)이 한 시간마다 `_build/strategy/standalone/`을 가져와 맞춥니다.\n\n'
        '출처: Project Zero, Harvard Graduate School of Education — PZ Thinking Routine Toolbox (https://pz.harvard.edu/thinking-routines). '
        '원문 자료는 CC BY-NC-ND 4.0이라 번역해 싣지 않고, 생각을 바탕으로 새로 쓴 글입니다.\n', encoding='utf-8')
    print(f'생각 도구(아이용 따로 쓰는 판): {len(pages)}쪽 → {OUT.relative_to(HERE.parents[1])}')


if __name__ == '__main__':
    main()
