"""「수학 원리 돋보기」 배경음악 — 이 파일이 직접 짓고 합성하는 곡(남의 곡·녹음을 쓰지 않음)

    python music/gen_bgm.py 169            → music/bgm_169s.wav (169초에 맞춰 끝나는 곡)
    python music/gen_bgm.py 169 --seed 2   → 같은 짜임에 다른 가락

- 다장조, 1분에 약 96박(영상 길이에 맞춰 조금 고침), 4/4박자. 화음 진행 C–G–Am–F / C–F–G–C 를 되풀이
- 소리: 마림바(가락), 오르골(가락 겹침, 작게), 부드러운 베이스, 잔잔한 패드(화음), 아주 작은 셰이커
- 같은 길이·같은 seed면 언제나 같은 곡(다시 만들어도 똑같음)
- 끝은 으뜸화음(도·미·솔)으로 울리며 마침
만든 소리는 저작권 걱정 없이 쓸 수 있습니다(이 저장소에서 새로 만든 것).
"""
import math
import os
import sys
import wave

import numpy as np

SR = 44100
BPM = 96
BEAT = 60 / BPM
BAR = BEAT * 4

# 화음(다장조): 이름 → 구성음(미디 번호, 가운데 도 = 60)
CHORDS = {
    "C": [60, 64, 67], "G": [55, 59, 62], "Am": [57, 60, 64], "F": [53, 57, 60],
    "Dm": [62, 65, 69], "Em": [64, 67, 71],
}
PROG_A = ["C", "G", "Am", "F"]
PROG_B = ["C", "F", "G", "C"]
PROG_C = ["Am", "Em", "F", "G"]
PENTA = [0, 2, 4, 7, 9]          # 도 레 미 솔 라 (밝은 5음 음계)


def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.minimum(1.0, t / max(attack, 1e-4))
    return a * np.exp(-t / decay)


def marimba(m, dur, vel=1.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = midi_hz(m)
    s = (np.sin(2 * np.pi * f * t) * env(n, 0.003, 0.45)
         + 0.35 * np.sin(2 * np.pi * f * 3.93 * t) * env(n, 0.002, 0.08)
         + 0.12 * np.sin(2 * np.pi * f * 9.2 * t) * env(n, 0.001, 0.025))
    return vel * s


def musicbox(m, dur, vel=1.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = midi_hz(m)
    s = (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t / 0.3)
         + 0.2 * np.sin(2 * np.pi * 3.01 * f * t) * np.exp(-t / 0.15))
    return vel * s * env(n, 0.002, 0.9)


def bass(m, dur, vel=1.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    f = midi_hz(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)
    return vel * s * env(n, 0.01, 0.6)


def pad(ms, dur, vel=1.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    s = np.zeros(n)
    for m in ms:
        f = midi_hz(m)
        for det in (-0.12, 0.12):           # 살짝 어긋난 두 음으로 부드럽게
            ff = f * 2 ** (det / 12)
            s += np.sin(2 * np.pi * ff * t) + 0.15 * np.sin(2 * np.pi * 2 * ff * t)
    a = np.minimum(1, t / 0.6) * np.minimum(1, (dur - t) / 0.6).clip(0, 1)
    return vel * s * a / (2 * len(ms))


def shaker(dur, rng, vel=1.0):
    n = int(SR * dur)
    noise = rng.standard_normal(n)
    # 높은 소리만 남기기(간단한 고역 통과)
    hp = np.diff(noise, prepend=0)
    return vel * hp * env(n, 0.004, 0.035)


def add(buf, start, sig, pan=0.0):
    i = int(start * SR)
    j = min(len(buf), i + len(sig))
    if i >= len(buf):
        return
    l, r = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
    buf[i:j, 0] += sig[: j - i] * l
    buf[i:j, 1] += sig[: j - i] * r


def melody_for_bar(chord, rng, phrase_pos):
    """한 마디 가락: (박 위치, 길이(박), 미디) 목록. 강박은 화음 구성음, 나머지는 5음 음계"""
    tones = CHORDS[chord]
    high = [t + 12 for t in tones]       # 가락은 한 옥타브 위
    scale = [72 + p for p in PENTA] + [84 + p for p in PENTA[:3]]
    rhythms = [
        [(0, 1), (1, 0.5), (1.5, 0.5), (2, 1), (3, 1)],
        [(0, 1.5), (1.5, 0.5), (2, 1), (3, 1)],
        [(0, 0.5), (0.5, 0.5), (1, 1), (2, 2)],
        [(0, 1), (1, 1), (2, 0.5), (2.5, 0.5), (3, 1)],
    ]
    if phrase_pos == 3:                   # 프레이즈 끝 마디는 길게 쉬어 감
        rhythm = [(0, 1), (1, 1), (2, 2)]
    else:
        rhythm = rhythms[rng.integers(len(rhythms))]
    out = []
    cur = rng.choice(high)
    for beat, length in rhythm:
        if beat in (0, 2):
            cands = [h for h in high + [h + 12 for h in high] if 70 <= h <= 88]
            cur = min(cands, key=lambda h: abs(h - cur) + rng.random() * 3)
        else:
            near = [s for s in scale if abs(s - cur) <= 4 and s != cur] or scale
            cur = near[rng.integers(len(near))]
        out.append((beat, length, int(cur)))
    if phrase_pos == 3:                   # 끝 음은 화음의 밑음
        out[-1] = (out[-1][0], out[-1][1], min(high, key=lambda h: abs(h - 76)))
    return out


def compose(seconds, seed=1):
    global BEAT, BAR
    rng = np.random.default_rng(seed)
    # 마디 수를 4의 배수로 정하고, 빠르기를 아주 조금 고쳐 영상 길이에 딱 맞춤
    nbars = max(4, int(round((seconds - 1.0) / (60 / BPM * 4) / 4)) * 4)
    BAR = (seconds - 1.0) / nbars
    BEAT = BAR / 4
    sections = []
    order = [PROG_A, PROG_A, PROG_B, PROG_C, PROG_A, PROG_B]
    for k in range(nbars // 4):
        sections += order[k % len(order)]
    sections[-4:] = PROG_B                              # 끝은 C–F–G–C 로 마침
    total = nbars * BAR + 4.0
    buf = np.zeros((int(SR * total) + SR, 2))
    # 앞 두 마디는 가락 없이 반주만(잔잔하게 시작)
    motif = {}
    for b, ch in enumerate(sections):
        t0 = b * BAR
        tones = CHORDS[ch]
        add(buf, t0, pad(tones, BAR + 0.3, 0.16), 0.0)
        add(buf, t0, bass(tones[0] - 12, BEAT * 1.8, 0.33), -0.1)
        add(buf, t0 + 2 * BEAT, bass(tones[0] - 12 + (7 if ch != "G" else 0), BEAT * 1.8, 0.26), -0.1)
        for i in range(8):                               # 8분음표 반주(마림바 낮게, 아주 작게)
            m = tones[[0, 2, 1, 2][i % 4]]
            add(buf, t0 + i * BEAT / 2, marimba(m, 0.6, 0.10), -0.35)
        for i in range(8):
            if i % 2 == 1:
                add(buf, t0 + i * BEAT / 2, shaker(0.08, rng, 0.03), 0.4)
        if b < 2 or b == len(sections) - 1:
            continue
        pos = (b - 2) % 4
        key = (ch, pos)
        if key in motif and rng.random() < 0.6:          # 같은 자리는 비슷한 가락을 되풀이(익숙하게)
            notes = motif[key]
        else:
            notes = melody_for_bar(ch, rng, pos)
            motif[key] = notes
        for beat, length, m in notes:
            add(buf, t0 + beat * BEAT, marimba(m, max(0.5, length * BEAT + 0.3), 0.42), 0.15)
            add(buf, t0 + beat * BEAT + 0.01, musicbox(m + 12, 1.2, 0.07), 0.3)
    # 마지막 으뜸화음
    tf = (len(sections) - 1) * BAR
    for k, m in enumerate([60, 64, 67, 72]):
        add(buf, tf + k * 0.06, marimba(m + 12, 3.5, 0.32), 0.1)
        add(buf, tf + k * 0.06, musicbox(m + 12, 3.5, 0.06), 0.3)
    add(buf, tf, pad([48, 55, 60, 64], 3.8, 0.2), 0.0)
    return buf[: int(SR * min(total, seconds))]


def reverb(x, seed=7, length=1.4, mix=0.18):
    rng = np.random.default_rng(seed)
    n = int(SR * length)
    ir = rng.standard_normal(n) * np.exp(-np.arange(n) / (SR * 0.35))
    ir /= np.sqrt((ir ** 2).sum())
    out = np.empty_like(x)
    L = len(x) + n
    nfft = 1 << (L - 1).bit_length()
    IR = np.fft.rfft(ir, nfft)
    for c in range(2):
        y = np.fft.irfft(np.fft.rfft(x[:, c], nfft) * IR, nfft)[: len(x)]
        out[:, c] = x[:, c] * (1 - mix) + y * mix * 2.5
    return out


def main():
    secs = float(sys.argv[1]) if len(sys.argv) > 1 else 169
    seed = int(sys.argv[sys.argv.index("--seed") + 1]) if "--seed" in sys.argv else 1
    x = reverb(compose(secs, seed))
    # 끝 3초 서서히 줄이기, 크기 맞추기(최대 -3dBFS)
    n = len(x)
    fade = int(SR * 3)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    x *= 10 ** (-3 / 20) / np.abs(x).max()
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, f"bgm_{int(round(secs))}s.wav")
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())
    print("완성:", os.path.relpath(out, os.path.dirname(here)), f"{n / SR:.1f}초")


if __name__ == "__main__":
    main()
