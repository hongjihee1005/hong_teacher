#!/usr/bin/env python3
"""사고전략 설명 동영상 만들기 (학생용·교사용)

    python3 _build/strategy/video/make.py 출력폴더 [사고전략 id …] [--kid|--teacher]

    예) python3 _build/strategy/video/make.py ~/영상 see-think-wonder
        (id를 빼면 23편 모두, --kid / --teacher 로 한쪽만)

만드는 것(사고전략마다): <id>-kid.mp4 · <id>-teacher.mp4, 같은 이름의 .srt(자막)·.md(대본)
대본은 사고전략 데이터(data_routines.py)에서 저절로 만들므로, 내용을 고치면 데이터를 고치고 다시 돌리면 됩니다.

필요한 것: ffmpeg, node + playwright(render.js), 컴퓨터 목소리 edge-tts(pip install edge-tts).
  edge-tts는 마이크로소프트 Edge 읽어 주기 음성을 쓰는 비공식 도구입니다. 영상을 공개하기 전에 쓰임이 괜찮은지 확인하세요.
  edge-tts가 설치된 파이썬이 다르면 TTS_PY=/경로/python 으로 알려 주세요.
mp4는 크기가 커서 저장소에 넣지 않습니다(유튜브 등에 올려 링크로 씁니다).
"""
import hashlib, json, os, re, subprocess, sys, pathlib, shutil
HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent))
from data_routines import R, BY_ID
from data_more import STAGES

ST = {s['n']: s for s in STAGES}
VOICE = {'kid': ('ko-KR-SunHiNeural', '-4%'), 'teacher': ('ko-KR-InJoonNeural', '+0%')}
PAUSE = 0.45
TTS_PY = os.environ.get('TTS_PY', shutil.which('python3.13') or sys.executable)
CA = '/root/.ccr/ca-bundle.crt'   # 이 작업 환경의 프록시 인증서(없으면 기본 인증서)


def soft(c, p=.18):
    c = c.lstrip('#'); r, g, b = (int(c[i:i + 2], 16) for i in (0, 2, 4))
    return '#%02X%02X%02X' % tuple(round(255 - (255 - v) * p) for v in (r, g, b))


def say(t):
    """화면 글 → 읽을 글(물결표·기호를 말로)."""
    t = re.sub(r'[“”"‘’]', '', t)
    for a, b in [('~라면', '무엇이라면'), ('~라고', '무엇이라고'), ('~인 ', '무엇인 '), ('~일', '무엇일'), ('~이 ', '무엇이 '), ('~은 ', '무엇은 '),
                 ('~을 ', '무엇을 '), ('~와 ', '무엇과 '), ('~에 ', '무엇에 '), ('~에서', '어디에서'), ('~하', '무엇을 하'), ('~', '무엇')]:
        t = t.replace(a, b)
    t = t.replace('→', ', 그다음 ').replace(' / ', ', ').replace('/', ', ').replace('·', ', ').replace(' — ', '. ')
    t = re.sub(r'\((\d+)~(\d+)분\)', r'(\1분에서 \2분)', t).replace('(', ', ').replace(')', ', ')
    return re.sub(r'\s*,\s*([,.?!])', r'\1', re.sub(r'\s+', ' ', t)).strip(' ,')


def sents(t):
    return [s for s in re.split(r'(?<=[.?!])\s+', t.strip()) if s]


def kid_script(x):
    st = ST[x['stage']]; k = x['kid']
    base = dict(acc=st['acc'], accs=soft(st['acc']), brand='<span class="em">🧰</span> 생각 도구 <b>학생용</b>', chip=f'{st["n"]}단계 {st["name"]}')
    S = []
    def add(slide, *lines, cap=None):
        for ln in lines:
            S.append(dict(slide=dict(base, **slide), say=say(ln), cap=cap if cap is not None else ln))
    title = dict(t='title', ico=x['ico'], ko=x['ko'], en=x['en'], one=k['intro'], who='학생용')
    add(title, f'안녕하세요! 오늘 배울 생각 도구는 {x["ko"]}예요.', k['intro'])
    items = [(n, q) for n, q, _ in k['steps']]
    add(dict(t='cards', h='이렇게 해요', items=items, on=0), f'이 생각 도구는 {len(items)}단계로 해요.')
    for i, (n, q) in enumerate(items, 1):
        add(dict(t='cards', h='이렇게 해요', items=items, on=i), f'{i}단계, {n}. {q}')
    for i, (n, q, stems) in enumerate(k['steps'], 1):
        if not stems:
            continue
        add(dict(t='step', no=i, h=n, q=q, stems=stems, on=0), f'{i}단계 {n}. {q}', '이렇게 말해 볼 수 있어요.')
        for j, sm in enumerate(stems, 1):
            add(dict(t='step', no=i, h=n, q=q, stems=stems, on=j), sm)
    ex = k['ex']; m = re.match(r'\((.*?)\)\s*', ex); label = m.group(1) if m else ''
    parts = [p.split(' — ', 1) if ' — ' in p else ['', p] for p in (ex[m.end():] if m else ex).split(' / ')]
    exs = dict(t='ex', h='이렇게 해 봐요', label=label, items=parts)
    add(dict(exs, on=0), '예를 들어 볼까요?' + (f' {label}.' if label else ''))
    for i, (a, b) in enumerate(parts, 1):
        add(dict(exs, on=i), (f'{a}. ' if a else '') + b, cap=(f'{a} — ' if a else '') + b)
    chk = dict(t='list', ico='✅', h='스스로 점검해요', items=k['check'], check=True)
    add(dict(chk, on=0), '다 했으면 스스로 점검해 봐요.')
    for i, c in enumerate(k['check'], 1):
        add(dict(chk, on=i), c)
    end = dict(t='end', big=f'<span class="em">{x["ico"]}</span> {x["ko"]}<br>생각이 눈에 보이게!',
               src='하버드 대학교 Project Zero의 사고 루틴을 바탕으로 새로 쓴 설명입니다 · 만든 사람: 초등교사 홍지희')
    add(end, '생각 도구를 쓰면 내 생각이 눈에 보여요. 친구들과 함께 해 봐요!',
        '이 영상은 하버드 대학교 프로젝트 제로의 사고 루틴을 바탕으로, 초등교사 홍지희가 만들었어요.')
    return S


def teacher_script(x):
    st = ST[x['stage']]
    base = dict(acc=st['acc'], accs=soft(st['acc']), brand='<span class="em">💡</span> 사고전략 <b>교사용</b>', chip=f'{st["n"]}단계 {st["name"]}')
    S = []
    def add(slide, *lines, cap=None):
        for ln in lines:
            S.append(dict(slide=dict(base, **slide), say=say(ln), cap=cap if cap is not None else ln))
    add(dict(t='title', ico=x['ico'], ko=x['ko'], en=x['en'], one=x['one'], who='교사용 안내'),
        f'사고전략, {x["ko"]}. 영어로는 {x["en"]}입니다.', x['one'] + '입니다.')
    add(dict(t='para', ico='🎯', h='목적', text=x['purpose']), *sents(x['purpose']))
    w = dict(t='list', ico='🕒', h='이럴 때 써요', items=x['when'])
    add(dict(w, on=0), '이럴 때 쓰면 좋습니다.')
    for i, c in enumerate(x['when'], 1):
        add(dict(w, on=i), c)
    for i, (n, q, note) in enumerate(x['steps'], 1):
        sl = dict(t='step', no=i, h=n, q=q, note=note)
        add(sl, f'{i}단계는 {n}입니다. {q}', *sents(note))
    sj = list(x['subj'].items())[:3]
    s = dict(t='list', ico='📚', h='교과별로 이렇게', items=[[a, b] for a, b in sj])
    add(dict(s, on=0), '교과별로는 이렇게 쓸 수 있습니다.')
    for i, (a, b) in enumerate(sj, 1):
        add(dict(s, on=i), f'{a} 시간에는 {b}.', cap=f'{a} — {b}')
    lv = dict(t='list', ico='🪜', h='학년에 맞게', items=[[a, b] for a, b in x['levels'].items()])
    add(dict(lv, on=0), '학년에 맞게 조절해 보세요.')
    for i, (a, b) in enumerate(x['levels'].items(), 1):
        add(dict(lv, on=i), f'{a}은 {b}' if a.endswith('년') else f'{a}: {b}', cap=f'{a} — {b}')
    tp = dict(t='list', ico='👍', h='이렇게 하면 더 좋아요', items=x['tips'])
    for i, c in enumerate(x['tips'], 1):
        add(dict(tp, on=i), *(['이렇게 하면 더 좋습니다.'] if i == 1 else []), c)
    ca = dict(t='list', ico='⚠️', h='주의할 점', items=x['caution'])
    for i, c in enumerate(x['caution'], 1):
        add(dict(ca, on=i), *(['주의할 점도 있습니다.'] if i == 1 else []), c)
    lk = dict(t='list', ico='🔎', h='무엇을 볼까요', items=x['look'], check=True)
    add(dict(lk, on=0), '수업에서는 이런 점을 살펴보세요.')
    for i, c in enumerate(x['look'], 1):
        add(dict(lk, on=i), c)
    end = dict(t='end', big=f'<span class="em">{x["ico"]}</span> {x["ko"]}<br><span style="font-size:52px">학생용 안내 · 활동지는 자료실 사고전략 메뉴에</span>',
               src='Project Zero, Harvard Graduate School of Education — PZ Thinking Routine Toolbox (pz.harvard.edu/thinking-routines)<br>'
                   '원문은 CC BY-NC-ND 4.0이라 번역하지 않고 생각을 바탕으로 새로 쓴 안내입니다 · 만든 사람: 초등교사 홍지희')
    add(end, '이 안내는 하버드 교육대학원 프로젝트 제로의 사고 루틴을 바탕으로 새로 쓴 것입니다.',
        '학생용 안내와 활동지는 초등교사 홍지희 자료실의 사고전략 메뉴에 있습니다.')
    return S


TTS_CODE = r'''
import asyncio, ssl, sys, os, edge_tts, edge_tts.communicate as C
if os.path.exists(sys.argv[5]): C._SSL_CTX = ssl.create_default_context(cafile=sys.argv[5])
asyncio.run(edge_tts.Communicate(sys.argv[1], sys.argv[3], rate=sys.argv[4]).save(sys.argv[2]))
'''


def tts(text, voice, rate, cache):
    h = hashlib.sha1(f'{voice}|{rate}|{text}'.encode()).hexdigest()[:16]
    f = cache / f'{h}.mp3'
    for _ in range(3):
        if f.exists() and f.stat().st_size > 1000:
            return f
        subprocess.run([TTS_PY, '-c', TTS_CODE, text, str(f), voice, rate, CA], check=False, timeout=120)
    raise SystemExit(f'목소리를 만들지 못함: {text}')


def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(f)]).decode())


def srt_t(s):
    ms = int(round(s * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); sec, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{sec:02},{ms:03}'


def build(x, kind, out):
    segs = (kid_script if kind == 'kid' else teacher_script)(x)
    for i, s in enumerate(segs):
        s['slide']['cap'] = s['cap']; s['slide']['prog'] = (i + 1) / len(segs)
    name = f'{x["id"]}-{kind}'
    work = out / '_work' / name; cache = out / '_work' / 'tts'
    shutil.rmtree(work, ignore_errors=True); work.mkdir(parents=True); cache.mkdir(parents=True, exist_ok=True)
    (work / 'segs.json').write_text(json.dumps(segs, ensure_ascii=False), encoding='utf-8')
    subprocess.run(['node', str(HERE / 'render.js'), str(work / 'segs.json'), str(work / 'img')], check=True)
    voice, rate = VOICE[kind]
    imgs, wavs, srt, t = [], [], [], 0.0
    for i, s in enumerate(segs):
        a = tts(s['say'], voice, rate, cache)
        pad = PAUSE + (0.5 if i == 0 or s['slide']['t'] == 'end' else 0)
        w = work / f'{i:03}.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(a), '-af', f'apad=pad_dur={pad}', '-ar', '24000', '-ac', '1', str(w)], check=True)
        d = dur(w); wavs.append(w); imgs.append((work / 'img' / f'{i:03}.png', d))
        srt.append(f'{i + 1}\n{srt_t(t)} --> {srt_t(t + d - PAUSE / 2)}\n{s["cap"]}\n'); t += d
    (work / 'a.txt').write_text(''.join(f"file '{w}'\n" for w in wavs))
    (work / 'v.txt').write_text(''.join(f"file '{p}'\nduration {d:.3f}\n" for p, d in imgs) + f"file '{imgs[-1][0]}'\n")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(work / 'a.txt'), str(work / 'a.wav')], check=True)
    mp4 = out / f'{name}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(work / 'v.txt'), '-i', str(work / 'a.wav'),
                    '-vf', 'fps=30,format=yuv420p', '-c:v', 'libx264', '-tune', 'stillimage', '-crf', '22', '-preset', 'medium',
                    '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', str(mp4)], check=True)
    (out / f'{name}.srt').write_text('\n'.join(srt), encoding='utf-8')
    who = '학생용' if kind == 'kid' else '교사용'
    (out / f'{name}.md').write_text(f'# {x["ko"]} ({x["en"]}) — {who} 영상 대본\n\n길이 {t:.0f}초 · 목소리 {voice}\n\n'
                                    + ''.join(f'{i + 1}. {s["cap"]}\n' for i, s in enumerate(segs)), encoding='utf-8')
    print(f'{mp4.name}: {t:.0f}초, 장면 {len(segs)}개')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not args:
        raise SystemExit(__doc__)
    out = pathlib.Path(args[0]).expanduser().resolve(); out.mkdir(parents=True, exist_ok=True)
    ids = args[1:] or [x['id'] for x in R]
    kinds = ['kid'] if '--kid' in sys.argv else ['teacher'] if '--teacher' in sys.argv else ['kid', 'teacher']
    for i in ids:
        for k in kinds:
            build(BY_ID[i], k, out)
