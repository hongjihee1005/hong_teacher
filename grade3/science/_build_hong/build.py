#!/usr/bin/env python3
"""3-1 과학 · 홍지희 선생님 버전(SOOP 탐구 수업) 만들기
사용법: python3 build.py            -> lessons_u*.py 의 모든 차시를 ../sem1-hong/ 에 만듦
        python3 build.py u1-l2      -> 그 차시만
- 화면 틀·엔진: 사회 선생님 버전(grade3/social/sem1-hong) 것을 그대로 쓰고(shell_head/tail, engine_social.js),
  과학 단계 3가지(pred 예상하기 · lab 실험하고 기록하기 · pvr 예상과 결과 비교)를 engine_science.js 에 더했습니다.
- 차시 내용은 lessons_u1.py … 의 LESSONS 목록만 고칩니다. photos 값은 위키미디어 공용 파일 이름("File:….jpg")이고,
  빌드할 때 wm.py 로 받아(캐시) base64로 넣습니다.
"""
import json, os, sys, base64, importlib, glob
B = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(B, '..', 'sem1-hong')
sys.path.insert(0, B)
import wm  # noqa

head = open(os.path.join(B, 'shell_head.html'), encoding='utf-8').read()
tail = open(os.path.join(B, 'shell_tail.html'), encoding='utf-8').read()
eng = open(os.path.join(B, 'engine_social.js'), encoding='utf-8').read() + open(os.path.join(B, 'engine_science.js'), encoding='utf-8').read()
css = open(os.path.join(B, 'science.css'), encoding='utf-8').read()


def photo(key, spec):
    if isinstance(spec, str):
        spec = {'f': spec}
    m, fn = wm.fetch(spec['f'])
    return {'name': spec.get('name', key), 'data': 'data:image/jpeg;base64,' + base64.b64encode(open(fn, 'rb').read()).decode(),
            'lic': m['license'], 'artist': spec.get('artist') or m['artist'], 'title': m['title'].replace('File:', ''), 'page': m['page']}


def build(L, topic):
    C = dict(L)
    C['topic'] = topic
    C['photos'] = {k: photo(k, v) for k, v in L.get('photos', {}).items()}
    js = json.dumps(C, ensure_ascii=False).replace('</', '<\\/')
    h = head.replace('__TITLE__', L['title']).replace('</style>', css + '</style>', 1)
    html = h + '<script>\nconst C=' + js + ';\n' + eng + '</script>' + tail
    os.makedirs(OUT, exist_ok=True)
    open(os.path.join(OUT, L['file']), 'w', encoding='utf-8').write(html)
    print('만듦', L['file'], '%.0f KB' % (len(html.encode()) / 1024))


if __name__ == '__main__':
    only = sys.argv[1:]
    for mod in sorted(glob.glob(os.path.join(B, 'lessons_u*.py'))):
        M = importlib.import_module(os.path.basename(mod)[:-3])
        topic = M.TOPIC
        topic['map'] = [{'s': L['soop'], 'f': L['file'], 'n': L['short'], 't': L['title'].split(' ', 1)[-1]} for L in M.LESSONS]
        for L in M.LESSONS:
            if not only or L['lessonKey'] in only:
                build(L, topic)
