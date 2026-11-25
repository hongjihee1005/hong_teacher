"""나레이션 음성(마이크로소프트 '선희' ko-KR-SunHiNeural, 보통 빠르기)을 영상에 넣기

    python voice.py prep gcep05   → 원고(narration.txt) 줄마다 음성을 voice_cache/에 만듦
    (장면을 렌더링하면 series_style.read_time이 음성 길이만큼 기다림 → 겹치지 않음)
    python voice.py check gcep05  → 음성이 다음 줄과 겹치는지 점검(겹치면 다시 렌더링)
    python voice.py mix gcep05    → gcep05_final_voice.mp4 (배경 음악 판 + 음성)

- 원고: <폴더>/narration.txt 의 시간 줄(타임라인과 같은 차례), 시작 시각: <폴더>/timeline.json 의 t
- 기호는 읽기 좋게 바꿈(× → 곱하기, 3/4 → 4분의 3, □ → 네모 …)
- 음성 파일은 voice_cache/<원고 키>.mp3 (원고가 같으면 다시 받지 않음, 키는 series_style.voice_key와 같음)
2026-11-25 선생님 요청: '선희' 목소리, 보통 빠르기
"""
import asyncio, json, os, re, subprocess, sys

VOICE = "ko-KR-SunHiNeural"
RATE = "+0%"
HERE = os.path.dirname(os.path.abspath(__file__))


def _batchim(word):
    """마지막 글자에 받침이 있는지(숫자는 읽는 소리로)"""
    w = word.rstrip(" )'\"")
    if not w:
        return False
    c = w[-1]
    if c.isdigit():
        if c == "0":
            return True  # 영·십·백·천
        return c in "136780"  # 일 삼 육 칠 팔 (2 이, 4 사, 5 오, 9 구)
    if "가" <= c <= "힣":
        return (ord(c) - 0xAC00) % 28 != 0
    return False


def _j(word, a, b):
    return word + (a if _batchim(word) else b)


def clean(s):
    s = s.replace("&lt;", "<").replace("&gt;", ">").replace("&amp;", "와")
    s = re.sub(r"「|」|『|』", "", s)
    s = s.replace("= 는", "등호는")
    s = re.sub(r"([^\s,]+)\s*>\s*([^\s,]+)", lambda m: f"{_j(m[1], '은', '는')} {m[2]}보다 크고", s)
    s = re.sub(r"([^\s,]+)\s*<\s*([^\s,]+)", lambda m: f"{_j(m[1], '은', '는')} {m[2]}보다 작고", s)
    s = re.sub(r"(\d+)과\s*(\d+)/(\d+)", lambda m: f"{m[1]}과 {m[3]}분의 {m[2]}", s)
    s = re.sub(r"(\d+)와\s*(\d+)/(\d+)", lambda m: f"{m[1]}와 {m[3]}분의 {m[2]}", s)
    s = re.sub(r"(\d+)\s*/\s*(\d+)", lambda m: f"{m[2]}분의 {m[1]}", s)
    rep = [("km²", "제곱킬로미터"), ("cm²", "제곱센티미터"), ("m²", "제곱미터"), ("cm³", "세제곱센티미터"), ("m³", "세제곱미터"),
           ("km", "킬로미터"), ("cm", "센티미터"), ("mm", "밀리미터"), ("mL", "밀리리터"), ("kg", "킬로그램"),
           ("°", "도"), ("%", "퍼센트"), ("□", "네모"), ("△", "세모"), ("○", "동그라미"), ("×", " 곱하기 "), ("÷", " 나누기 "),
           ("+", " 더하기 "), ("−", " 빼기 "), (" - ", " 빼기 "),
           ("→", ", "), ("·", ", "), ("…", ", "), (" : ", " 대 "), ("⊂", " 안에 "), ("∥", " 평행 "), ("⊥", " 수직 ")]
    for x, y in rep:
        s = s.replace(x, y)
    s = re.sub(r"(\S+)\s*=\s*", lambda m: _j(m[1], "은 ", "는 "), s)
    for x, y in [("L", "리터"), ("g", "그램"), ("t", "톤"), ("m", "미터")]:
        s = re.sub(rf"(?<![A-Za-z]){x}(?![A-Za-z²³])", y, s)
    s = re.sub(r"\s+", " ", s).strip(" ,")
    return s


def key(narr):
    import hashlib
    return hashlib.sha1(re.sub(r"\s+", " ", narr).strip().encode("utf-8")).hexdigest()[:16]


CACHE = os.path.join(HERE, "voice_cache")


def raw_lines(ep):
    tl = json.load(open(os.path.join(HERE, ep, "timeline.json"), encoding="utf-8"))
    ls = [re.sub(r"^\[[^\]]*\]\s*", "", l).strip() for l in open(os.path.join(HERE, ep, "narration.txt"), encoding="utf-8") if re.match(r"\[\d\d:\d\d", l)]
    assert len(tl) == len(ls), (ep, len(tl), len(ls))
    return [(e["t"], x) for e, x in zip(tl, ls)]


def dur(p):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout)


async def synth(text, out):
    import edge_tts
    px = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    for k in range(5):
        try:
            await edge_tts.Communicate(text, VOICE, rate=RATE, proxy=px).save(out)
            if os.path.getsize(out) > 1000:
                return
        except Exception:
            pass
        await asyncio.sleep(2 + 3 * k)
    raise RuntimeError("음성 받기 실패: " + text[:30])


def ensure(narr):
    """원고 한 줄의 음성을 voice_cache에 (없으면) 만들고 길이를 돌려줌"""
    os.makedirs(CACHE, exist_ok=True)
    k = key(narr)
    f, ln = os.path.join(CACHE, k + ".mp3"), os.path.join(CACHE, k + ".len")
    if not (os.path.exists(f) and os.path.exists(ln)):
        asyncio.run(synth(clean(narr), f))
        open(ln, "w").write(f"{dur(f):.3f}")
    return f, float(open(ln).read())


def prep(ep):
    for _, x in raw_lines(ep):
        ensure(x)


def check(ep):
    """음성이 다음 줄보다 길어 겹치는 곳 수"""
    items = raw_lines(ep)
    total = dur(os.path.join(HERE, ep, f"{ep}_final.mp4"))
    bad = 0
    for i, (t, x) in enumerate(items):
        _, d = ensure(x)
        nxt = items[i + 1][0] if i + 1 < len(items) else total
        if d > nxt - t - 0.1:
            bad += 1
            print(f"[겹침] {ep} {i}: {d:.1f} > {nxt - t:.1f} {x[:30]}")
    return bad


def mix(ep):
    items = raw_lines(ep)
    video = os.path.join(HERE, ep, f"{ep}_final_bgm_piano.mp4")
    inputs, filt = ["-i", video], []
    for k, (t, x) in enumerate(items):
        f, _ = ensure(x)
        inputs += ["-i", f]
        filt.append(f"[{k + 1}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={int(t * 1000)}|{int(t * 1000)}[v{k}]")
    filt.append("".join(f"[v{k}]" for k in range(len(items))) + f"amix=inputs={len(items)}:normalize=0[voice]")
    filt.append("[0:a]aresample=48000,volume=0.8[bg]")
    filt.append("[bg][voice]amix=inputs=2:normalize=0:duration=first,alimiter=limit=0.95[a]")
    out = os.path.join(HERE, ep, f"{ep}_final_voice.mp4")
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", ";".join(filt), "-map", "0:v", "-map", "[a]",
                        "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out], capture_output=True, text=True)
    if r.returncode:
        print(r.stderr[-1500:])
        sys.exit(1)
    print(out)


if __name__ == "__main__":
    cmd, ep = sys.argv[1], sys.argv[2]
    if cmd == "prep":
        prep(ep)
    elif cmd == "check":
        sys.exit(1 if check(ep) else 0)
    elif cmd == "mix":
        mix(ep)
