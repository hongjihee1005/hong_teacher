"""「과학 원리 돋보기」·「과학 마인드맵」 배경음악 (수학 영상 배경음악 생성기를 가져와 과목 색을 더함) — 이 파일이 직접 짓고 합성하는 곡(남의 곡·녹음을 쓰지 않음)

    python music/gen_bgm.py 169            → music/bgm_169s.wav (169초에 맞춰 끝나는 곡)
    python music/gen_bgm.py 169 --seed 2   → 같은 짜임에 다른 가락
    python music/gen_bgm.py 169 --style piano → 발랄하고 경쾌한 피아노 곡(1분에 약 120박, 쿵짝 반주 + 끊어 치는 가락)
      실제 피아노를 녹음한 음원(sf2)으로 연주: FluidSynth + FluidR3_GM(MIT 라이선스) 또는 music/piano.sf2
      (리눅스: apt install fluidsynth fluid-soundfont-gm). 없으면 합성한 소리로 만듦. 악보 .mid도 함께 남김
    python music/gen_bgm.py 169 --style piano --subject science
      → 과학판(선생님 요청 2026-10-25 '음악도 과목별로 약간 다르게, 분위기는 똑같이'): 빠르기·반주·가락 짜임은 수학과 같고,
        조를 사장조로(5도 아래로 옮김), 가락 위에 글로켄슈필(GM 9번, 맑은 종소리)을 한 옥타브 위로 작게 겹침

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


# ── 피아노 (발랄하고 경쾌한 곡) ────────────────────────────────────
def piano(m, hold, vel=1.0, rng=None):
    """피아노 소리: 살짝 어긋난 배음(현의 성질) + 두 줄 현의 맥놀이 + 해머 소리.
    hold초 동안 누르고 있다가 떼면 0.06초 안에 소리가 멎음(짧게 끊어 치기)"""
    f = midi_hz(m)
    tail = 0.12
    n = int(SR * (hold + tail))
    t = np.arange(n) / SR
    s = np.zeros(n)
    bright = 0.45 - 0.2 * min(vel, 1.0)
    base_decay = 1.6 * (261.6 / f) ** 0.45
    k = 1
    while k <= 12 and k * f < 11000:
        fk = k * f * math.sqrt(1 + 0.00035 * k * k)
        amp = (1 / k ** 1.15) * math.exp(-(k - 1) * bright)
        dk = base_decay / (1 + 0.55 * (k - 1))
        for det in (-0.5, 0.5):                       # 두 줄 현(±0.5센트)
            ff = fk * 2 ** (det / 1200)
            s += amp * np.sin(2 * np.pi * ff * t + (0 if det < 0 else 0.7)) * (
                0.7 * np.exp(-t / (dk * 0.25)) + 0.3 * np.exp(-t / dk))
        k += 1
    s *= np.minimum(1, t / 0.002)
    damp = np.where(t > hold, np.exp(-(t - hold) / 0.06), 1.0)
    s *= damp
    if rng is not None:                               # 해머가 줄을 치는 짧은 소리
        h = int(SR * 0.012)
        noise = rng.standard_normal(h) * np.exp(-np.arange(h) / (SR * 0.003))
        noise = np.convolve(noise, np.ones(6) / 6, mode="same")
        s[:h] += 0.08 * noise
    return vel * s / 1.6


# 손으로 지은 가락: (박, 길이(박), 미디). 4마디가 한 프레이즈
PIANO_PHRASES = {
    "A": (["C", "Am", "F", "G"], [
        [(0, .5, 72), (.5, .5, 76), (1, .5, 79), (1.5, .5, 76), (2, .5, 84), (2.5, .5, 79), (3, 1, 76)],
        [(0, .5, 72), (.5, .5, 76), (1, .5, 81), (1.5, .5, 76), (2, 1, 84), (3, .5, 83), (3.5, .5, 81)],
        [(0, .5, 77), (.5, .5, 81), (1, .5, 84), (1.5, .5, 81), (2, .5, 77), (2.5, .5, 81), (3, 1, 84)],
        [(0, .75, 83), (.75, .25, 81), (1, .5, 79), (1.5, .5, 77), (2, 1, 74), (3, .5, 79), (3.5, .5, 71)],
    ]),
    "A2": (["C", "Am", "F", "G"], [
        [(0, .5, 72), (.5, .5, 76), (1, .5, 79), (1.5, .5, 76), (2, .5, 84), (2.5, .5, 79), (3, 1, 76)],
        [(0, .5, 72), (.5, .5, 76), (1, .5, 81), (1.5, .5, 76), (2, 1, 84), (3, .5, 83), (3.5, .5, 81)],
        [(0, .5, 77), (.5, .5, 81), (1, .5, 84), (1.5, .5, 81), (2, .5, 77), (2.5, .5, 81), (3, 1, 84)],
        [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 83), (2, .5, 79), (2.5, .5, 83), (3, 1, 86)],
    ]),
    "B": (["F", "G", "Em", "Am"], [
        [(0, 1, 81), (1, .5, 79), (1.5, .5, 77), (2, 1, 76), (3, 1, 77)],
        [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 83), (2, 1, 79), (3, 1, 83)],
        [(0, 1, 79), (1, .5, 76), (1.5, .5, 79), (2, 1, 83), (3, 1, 79)],
        [(0, .5, 81), (.5, .5, 84), (1, .5, 88), (1.5, .5, 84), (2, 2, 81)],
    ]),
    "B2": (["Dm", "G", "C", "C"], [
        [(0, .5, 77), (.5, .5, 81), (1, .5, 86), (1.5, .5, 81), (2, 1, 77), (3, 1, 74)],
        [(0, .5, 79), (.5, .5, 83), (1, .5, 86), (1.5, .5, 83), (2, .5, 79), (2.5, .5, 77), (3, .5, 74), (3.5, .5, 71)],
        [(0, 1, 72), (1, .5, 76), (1.5, .5, 79), (2, 1, 84), (3, 1, 79)],
        [(0, 2, 84), (2, .5, 79), (2.5, .5, 76), (3, 1, 72)],
    ]),
}
PIANO_FORM = ["A", "A2", "B", "B2"]


def voice(tones, lo=55, hi=67):
    """화음 구성음을 lo~hi 사이로 모아 왼손 화음 자리를 만듦"""
    out = []
    for t in tones:
        while t < lo:
            t += 12
        while t > hi:
            t -= 12
        out.append(t)
    return sorted(out)


SF2_CANDIDATES = [
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "piano.sf2"),   # 직접 넣은 음원이 있으면 먼저
    "/usr/share/sounds/sf2/FluidR3_GM.sf2",                                  # 리눅스 fluid-soundfont-gm (MIT)
    "/usr/share/soundfonts/FluidR3_GM.sf2",
]


def find_sf2():
    for p in SF2_CANDIDATES:
        if os.path.exists(p):
            return p
    return None


def piano_events(seconds, seed=1):
    """피아노 곡의 음표 목록: (시작 초, 누르는 시간 초, 미디 번호, 세기 0~1)"""
    global BEAT, BAR
    rng = np.random.default_rng(seed)
    intro = 2
    q = max(1, int(round((seconds - 2.5) / 2.0 - intro) / 4))   # 프레이즈 수(1마디 약 2초 = 1분에 120박)
    nbars = intro + 4 * q
    BAR = (seconds - 2.8) / nbars
    BEAT = BAR / 4
    phrases = [PIANO_FORM[i % 4] for i in range(q)]
    phrases[-1] = "B2"                                   # 끝은 마침 프레이즈
    bars = [("C", None), ("G", None)]
    for k, name in enumerate(phrases):
        chords, mel = PIANO_PHRASES[name]
        octave = 12 if (k // 4) % 2 == 1 and name in ("A", "A2") else 0   # 두 번째 돌 때는 한 옥타브 위로 밝게
        for c, notes in zip(chords, mel):
            bars.append((c, [(b, l, m + octave) for b, l, m in notes]))
    ev = []

    def hum():
        return rng.normal(0, 0.006)

    for i, (ch, notes) in enumerate(bars):
        t0 = i * BAR
        tones = CHORDS[ch]
        root = tones[0]
        while root > 50:
            root -= 12
        fifth = root + 7 if root + 7 <= 50 else root - 5
        v = voice(tones)
        # 왼손: 쿵(낮은 음) - 짝(화음) - 쿵(5도) - 짝(화음)
        ev.append((t0 + hum(), BEAT * 0.9, root, 0.42))
        ev.append((t0 + 2 * BEAT + hum(), BEAT * 0.9, fifth, 0.38))
        for b in (1, 3):
            for m in v:
                ev.append((t0 + b * BEAT + hum(), BEAT * 0.4, m, 0.3))
        if notes is None:
            continue
        for b, l, m in notes:
            hold = l * BEAT * (0.55 if l <= 0.5 else 0.8)   # 짧은 음은 끊어 쳐서 통통 튀게
            vel = 0.62 if b in (0, 2) else 0.52
            ev.append((t0 + b * BEAT + hum(), hold, m, vel + rng.normal(0, 0.03)))
    # 마무리: 위로 올라가는 도-미-솔-도, 그리고 으뜸화음
    tf = len(bars) * BAR
    for k, m in enumerate([72, 76, 79, 84]):
        ev.append((tf + k * BEAT / 2, 0.3 if k < 3 else 2.2, m, 0.55))
    for m in (48, 60, 64, 67, 72):
        ev.append((tf + 2 * BEAT, 2.0, m, 0.5))
    return [(max(0.0, t), d, m, v) for t, d, m, v in ev]


SUBJECT = "math"


def subject_events(ev):
    """과목별 음색: 과학은 사장조 + 가락에 글로켄슈필(채널 1)을 작게 겹침. (시작, 길이, 음, 세기, 채널)"""
    if SUBJECT != "science":
        return [(t, d, m, v, 0) for t, d, m, v in ev]
    out = []
    for t, d, m, v in ev:
        out.append((t, d, m - 5, v, 0))
        if m >= 62 and v >= 0.45 and d < 1.5:        # 가락 음(반주·마침 화음 제외)
            out.append((t, min(d, 0.6), m - 5 + 12, v * 0.42, 1))
    return out


def write_midi(events, path):
    import mido
    tpb = 480
    tempo = int(round(BEAT * 1e6))
    mid = mido.MidiFile(ticks_per_beat=tpb)
    tr = mido.MidiTrack()
    mid.tracks.append(tr)
    tr.append(mido.MetaMessage("set_tempo", tempo=tempo, time=0))
    tr.append(mido.Message("program_change", program=0, channel=0, time=0))   # 0번 = 어쿠스틱 그랜드 피아노
    tr.append(mido.Message("program_change", program=9, channel=1, time=0))   # 9번 = 글로켄슈필(과학판)
    msgs = []
    for t, d, m, v, ch in events:
        on = int(round(t / BEAT * tpb))
        off = int(round((t + d) / BEAT * tpb))
        vel = int(np.clip(30 + v * 95, 1, 127))
        msgs.append((on, 1, mido.Message("note_on", note=int(m), velocity=vel, channel=ch)))
        msgs.append((off, 0, mido.Message("note_off", note=int(m), velocity=0, channel=ch)))
    msgs.sort(key=lambda x: (x[0], x[1]))
    last = 0
    for tick, _, msg in msgs:
        msg.time = tick - last
        last = tick
        tr.append(msg)
    mid.save(path)


MID_OUT = None   # 악보를 남길 곳(--out과 같은 이름의 .mid)


def compose_piano(seconds, seed=1):
    """실제 피아노를 녹음한 음원(sf2)이 있으면 그 소리로, 없으면 합성한 피아노 소리로.
    반환: (소리, 잔향을 더 넣어야 하는지)"""
    import shutil
    import subprocess
    import tempfile
    events = subject_events(piano_events(seconds, seed))
    sf2 = find_sf2()
    if sf2 and shutil.which("fluidsynth"):
        with tempfile.TemporaryDirectory() as d:
            mpath, wpath = os.path.join(d, "bgm.mid"), os.path.join(d, "bgm.wav")
            write_midi(events, mpath)
            here = os.path.dirname(os.path.abspath(__file__))
            write_midi(events, MID_OUT or os.path.join(here, f"bgm_piano_{int(round(seconds))}s.mid"))   # 악보도 남김
            subprocess.run(["fluidsynth", "-ni", "-q", "-F", wpath, "-r", str(SR), "-g", "0.6",
                            "-o", "synth.reverb.active=1", "-o", "synth.chorus.active=0",
                            "-o", "synth.reverb.room-size=0.45", "-o", "synth.reverb.level=0.6",
                            sf2, mpath], check=True, stdin=subprocess.DEVNULL, capture_output=True)
            with wave.open(wpath) as w:
                x = np.frombuffer(w.readframes(w.getnframes()), "<i2").reshape(-1, w.getnchannels())
            x = x.astype(float) / 32768
        n = int(SR * seconds)
        if len(x) < n:
            x = np.vstack([x, np.zeros((n - len(x), x.shape[1]))])
        print("피아노 음원:", sf2)
        return x[:n], False
    rng = np.random.default_rng(seed)
    buf = np.zeros((int(SR * (seconds + 1)), 2))
    for t, d, m, v, ch in events:
        add(buf, t, piano(m, d, v, rng) if ch == 0 else musicbox(m, d, v), 0.2 if m >= 60 else -0.2)
    print("피아노 음원이 없어 합성한 소리로 만듦(fluidsynth와 sf2 음원을 설치하면 실제 피아노 소리)")
    return buf[: int(SR * seconds)], True


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
    style = sys.argv[sys.argv.index("--style") + 1] if "--style" in sys.argv else "marimba"
    global SUBJECT, MID_OUT
    out_arg = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else None
    if out_arg:
        MID_OUT = os.path.splitext(out_arg)[0] + ".mid"
    SUBJECT = sys.argv[sys.argv.index("--subject") + 1] if "--subject" in sys.argv else "math"
    if style == "piano":
        x, more = compose_piano(secs, seed)
        if more:
            x = reverb(x, mix=0.14)
    else:
        x = reverb(compose(secs, seed))
    # 끝 3초 서서히 줄이기, 크기 맞추기(최대 -3dBFS)
    n = len(x)
    fade = int(SR * 3)
    x[-fade:] *= np.linspace(1, 0, fade)[:, None]
    x *= 10 ** (-3 / 20) / np.abs(x).max()
    here = os.path.dirname(os.path.abspath(__file__))
    out = out_arg or os.path.join(here, f"bgm_{style}_{int(round(secs))}s.wav")
    with wave.open(out, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype("<i2").tobytes())
    print("완성:", os.path.relpath(out, os.path.dirname(here)), f"{n / SR:.1f}초")


if __name__ == "__main__":
    main()
