"""나레이션을 AI 음성(MeloTTS 한국어, MIT)으로 읽어 최종본에 얹습니다.

    /opt/ttsenv/bin/python tts_episode.py s6ep26            → s6ep26/s6ep26_final_voice.mp4
    /opt/ttsenv/bin/python tts_episode.py s6ep26 --speed 1.2

- 줄 차례·시각은 timeline.json, 읽을 글은 narration.txt([시작 ~ 끝] 줄)에서 가져옴(차례가 같음).
- 글은 tts_norm.normalize로 숫자·단위를 한국어 읽기로 바꿈.
- 줄마다 다음 줄 시작 0.15초 전까지 끝나야 함 — 길면 빠르기를 올려(최대 MAXSPEED) 다시 읽고, 그래도 길면 [넘침]을 알림.
- 배경음악이 든 최종본(<편>_final_bgm_piano.mp4) 위에 음성을 얹음(음성 -16 LUFS).
"""
import json, os, re, subprocess, sys, tempfile, wave
import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from tts_norm import normalize

SR = 44100
BASE_SPEED = 1.15
MAXSPEED = 1.3
GAP = 0.15


def lines_of(ep):
    tl = json.load(open(f'{ep}/timeline.json', encoding='utf-8'))
    nar = [re.sub(r'^\[[^\]]*\]\s*', '', l.rstrip('\n'))
           for l in open(f'{ep}/narration.txt', encoding='utf-8') if l.startswith('[')]
    assert len(tl) == len(nar), (len(tl), len(nar))
    return [(d['t'], d['end'], n) for d, n in zip(tl, nar)]


def main():
    ep = sys.argv[1]
    speed = float(sys.argv[sys.argv.index('--speed') + 1]) if '--speed' in sys.argv else BASE_SPEED
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    from melo.api import TTS
    m = TTS(language='KR', device='cpu')
    spk = m.hps.data.spk2id['KR']
    src = f'{ep}/{ep}_final_bgm_piano.mp4'
    dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                         '-of', 'csv=p=0', src]).decode())
    track = np.zeros(int((dur + 1) * SR), dtype=np.float32)
    tmp = tempfile.mkdtemp()
    over = []
    prev_end = 0.0
    for i, (t, end, text) in enumerate(lines_of(ep)):
        say = normalize(text)
        if not re.search('[가-힣]', say):
            continue
        room = max(0.5, end - t - GAP)
        sp = speed
        while True:
            f = os.path.join(tmp, f'{i}.wav')
            m.tts_to_file(say, spk, f, speed=sp, quiet=True)
            a, sr = read_wav(f)
            if len(a) / sr <= room or sp >= MAXSPEED:
                break
            sp = min(MAXSPEED, sp * (len(a) / sr) / room * 1.02)
        if sr != SR:
            a = np.interp(np.arange(0, len(a), sr / SR), np.arange(len(a)), a).astype(np.float32)
        start = max(t, prev_end + 0.12)          # 앞 줄이 길면 조금 늦게 시작(겹치지 않게)
        prev_end = start + len(a) / SR
        if prev_end > end + 0.05:
            over.append((i, round(prev_end - end, 2), text))
        s = int(start * SR)
        track[s:s + len(a)] += a[:len(track) - s]
        print(f'{i:02d} {t:6.2f}+{start - t:3.1f} 빠르기 {sp:.2f} {len(a) / SR:4.1f}/{room:4.1f}s  {say}', flush=True)
    vw = os.path.join(tmp, 'voice.wav')
    write_wav(vw, track)
    out = f'{ep}/{ep}_final_voice.mp4'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', src, '-i', vw, '-filter_complex',
                    '[1:a]loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[v];'
                    '[0:a]aresample=48000[b];[b][v]amix=inputs=2:duration=first:normalize=0[a]',
                    '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', out], check=True)
    print('완성:', out)
    for o in over:
        print('[넘침]', o)


def read_wav(f):
    import soundfile as sf
    a, sr = sf.read(f, dtype='float32')
    if a.ndim > 1:
        a = a.mean(axis=1)
    return a, sr


def write_wav(f, a):
    import soundfile as sf
    sf.write(f, np.clip(a, -1, 1), SR)


if __name__ == '__main__':
    main()
