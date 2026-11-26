"""나레이션을 AI 음성(MeloTTS 한국어, MIT)으로 읽어 최종본에 얹습니다. (2026-11-25 선생님 요청 '나')

    /opt/ttsenv/bin/python tts_episode.py prep s6ep26 [s6ep27 …]   → 나레이션 줄마다 음성을 만들어 둠(media/tts_cache)
    VOICE=1 ./make_final.sh s6ep26                                 → 음성 길이에 맞춰 장면을 기다리며 렌더링
    /opt/ttsenv/bin/python tts_episode.py mix s6ep26               → s6ep26/s6ep26_final_voice.mp4
    (한 번에: ./make_voice.sh s6ep26)

- 읽을 글은 narration.txt([시작 ~ 끝] 줄), 넣는 시각은 timeline.json(차례가 같음).
- 글은 tts_norm.normalize로 숫자·단위를 한국어 읽기로 바꿈. 같은 글이면 음성을 다시 만들지 않음(index.json: 글 → 길이).
- 빠르기는 SPEED 하나로 고정(줄마다 바꾸지 않음). 렌더링이 음성 길이만큼 기다리므로 줄이 겹치지 않음 — 겹치면 [겹침]을 알림.
- 배경음악이 든 최종본(<편>_final_bgm_piano.mp4) 위에 음성을 얹음(음성 -16 LUFS).
"""
import hashlib, json, os, re, subprocess, sys, tempfile
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from tts_norm import normalize

SPEED = float(os.environ.get("TTS_SPEED", "1.1"))   # 처음 배우는 과학은 1.0
SR = 44100
CACHE = os.path.join(HERE, 'media', 'tts_cache')
INDEX = os.path.join(CACHE, 'index.json')


def lines_of(ep):
    tl = json.load(open(f'{HERE}/{ep}/timeline.json', encoding='utf-8'))
    nar = [re.sub(r'^\[[^\]]*\]\s*', '', l.rstrip('\n'))
           for l in open(f'{HERE}/{ep}/narration.txt', encoding='utf-8') if l.startswith('[')]
    assert len(tl) == len(nar), (ep, len(tl), len(nar))
    return [(d['t'], d['end'], n) for d, n in zip(tl, nar)]


def key(say):
    """index.json 열쇠 — 기본 빠르기(1.1)는 글 그대로, 다른 빠르기는 '빠르기|글'"""
    return say if SPEED == 1.1 else f'{SPEED}|{say}'


def wav_path(say):
    return os.path.join(CACHE, hashlib.md5(f'{SPEED}|{say}'.encode()).hexdigest() + '.wav')


def load_index():
    return json.load(open(INDEX, encoding='utf-8')) if os.path.exists(INDEX) else {}


def read_wav(f):
    import soundfile as sf
    a, sr = sf.read(f, dtype='float32')
    if a.ndim > 1:
        a = a.mean(axis=1)
    if sr != SR:
        a = np.interp(np.arange(0, len(a), sr / SR), np.arange(len(a)), a).astype(np.float32)
    return a


def trim(a, thr=0.01):
    """앞뒤 무음을 0.05초만 남기고 자름"""
    idx = np.where(np.abs(a) > thr)[0]
    if not len(idx):
        return a
    pad = int(0.05 * SR)
    return a[max(0, idx[0] - pad): idx[-1] + pad]


def prep(eps):
    os.makedirs(CACHE, exist_ok=True)
    idx = load_index()
    todo = []
    for ep in eps:
        for _, _, text in lines_of(ep):
            say = normalize(text)
            if re.search('[가-힣]', say) and (key(say) not in idx or not os.path.exists(wav_path(say))) and say not in todo:
                todo.append(say)
    if not todo:
        print('prep: 새로 만들 음성 없음', eps)
        return
    import soundfile as sf
    from melo.api import TTS
    m = TTS(language='KR', device='cpu')
    spk = m.hps.data.spk2id['KR']
    tmp = tempfile.mkdtemp()
    for i, say in enumerate(todo):
        f = os.path.join(tmp, 'a.wav')
        m.tts_to_file(say, spk, f, speed=SPEED, quiet=True)
        a = trim(read_wav(f))
        sf.write(wav_path(say), a, SR)
        idx[key(say)] = round(len(a) / SR, 3)
        if i % 20 == 19 or i == len(todo) - 1:      # 중간에 멈춰도 만든 것은 남게
            cur = load_index(); cur.update(idx); idx = cur
            json.dump(idx, open(INDEX + '.tmp', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
            os.replace(INDEX + '.tmp', INDEX)
        print(f'prep {i + 1}/{len(todo)} {idx[key(say)]:4.1f}s {say}', flush=True)


def mix(ep):
    prep([ep])
    src = f'{HERE}/{ep}/{ep}_final_bgm_piano.mp4'
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                         '-of', 'csv=p=0', src]).decode())
    track = np.zeros(int((dur + 1) * SR), dtype=np.float32)
    prev_end, warn = 0.0, []
    for i, (t, end, text) in enumerate(lines_of(ep)):
        say = normalize(text)
        if not re.search('[가-힣]', say):
            continue
        a = read_wav(wav_path(say))
        start = max(t + 0.1, prev_end + 0.1)
        if start > t + 0.3:
            warn.append(f'[겹침] {ep} {i}줄 {start - t:.1f}초 늦게 시작: {text}')
        prev_end = start + len(a) / SR
        s = int(start * SR)
        track[s:s + len(a)] += a[:max(0, len(track) - s)]
    if prev_end > dur:
        warn.append(f'[넘침] {ep} 마지막 음성이 영상보다 {prev_end - dur:.1f}초 김')
    import soundfile as sf
    vw = os.path.join(tempfile.mkdtemp(), 'voice.wav')
    sf.write(vw, np.clip(track, -1, 1), SR)
    out = f'{HERE}/{ep}/{ep}_final_voice.mp4'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-i', vw, '-filter_complex',
                    '[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[v];'
                    '[0:a]aresample=48000[b];[b][v]amix=inputs=2:duration=first:normalize=0[a]',
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out], check=True)
    for w in warn:
        print(w)
    print(f'음성 완성: {out} ({dur:.1f}초)')


if __name__ == '__main__':
    cmd, eps = sys.argv[1], sys.argv[2:]
    if cmd == 'prep':
        prep(eps)
    elif cmd == 'mix':
        for e in eps:
            mix(e)
