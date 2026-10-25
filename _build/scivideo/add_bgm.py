"""완성 영상에 배경음악(BGM)을 작게 깔기
    python add_bgm.py s3ep01 음악.mp3            → s3ep01/s3ep01_final_bgm.mp4
    python add_bgm.py s3ep01 음악.mp3 --tag piano → s3ep01/s3ep01_final_bgm_piano.mp4 (여러 곡을 견줘 볼 때)
    python add_bgm.py s3ep01 음악.mp3 -20        → 목표 크기를 -20 LUFS 쪽으로 (기본 -34, 숫자가 작을수록 조용함)

- 음악 크기를 재서 목표 크기(기본 -34 LUFS: 잔잔하게 깔리는 작은 소리, 2026-10-13 선생님 요청으로 -30에서 낮춤)로 맞춤
- 처음 2초 서서히 커지고, 끝 4초 서서히 작아짐. 음악이 짧으면 되풀이, 길면 자름
- '생각해 보세요' 멈춤 화면(timeline.json)에서는 절반 크기로 줄였다가 되돌림
- 소리 없는 원본(epNN_final.mp4)은 그대로 둠 (Vrew 더빙용)
"""
import json, os, re, subprocess, sys

argv = sys.argv[1:]
tag = ""
if "--tag" in argv:
    i = argv.index("--tag")
    tag = argv[i + 1]
    del argv[i:i + 2]
ep, music = argv[0], argv[1]
target = float(argv[2]) if len(argv) > 2 else -34.0
here = os.path.dirname(os.path.abspath(__file__))
video = os.path.join(here, ep, f"{ep}_final.mp4")
out = os.path.join(here, ep, f"{ep}_final_bgm{'_' + tag if tag else ''}.mp4")

def run(args):
    return subprocess.run(args, stdin=subprocess.DEVNULL, capture_output=True, text=True)

dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]).stdout)
meas = run(["ffmpeg", "-hide_banner", "-nostats", "-i", music, "-af", "ebur128=framelog=quiet", "-f", "null", "-"]).stderr
lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", meas)[-1])
gain = target - lufs

tl = json.load(open(os.path.join(here, ep, "timeline.json"), encoding="utf-8"))
duck = 1.0
for x in tl:
    if "멈추" in x["sub"]:
        a, b = x["t"], x["end"]
        # 0.5초에 걸쳐 절반으로 줄었다가 되돌아옴
        duck = f"{duck}*(1-0.5*clip((t-{a - 0.5:.2f})/0.5,0,1)+0.5*clip((t-{b:.2f})/0.5,0,1))"

af = (f"aloop=loop=-1:size=2e9,atrim=0:{dur:.3f},asetpts=PTS-STARTPTS,"
      f"volume={gain:.1f}dB,volume='{duck}':eval=frame,"
      f"afade=t=in:st=0:d=2,afade=t=out:st={dur - 4:.3f}:d=4")
r = run(["ffmpeg", "-y", "-v", "error", "-i", video, "-i", music,
         "-filter_complex", f"[1:a]{af}[a]", "-map", "0:v", "-map", "[a]",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-t", f"{dur:.3f}", "-movflags", "+faststart", out])
if r.returncode:
    sys.exit(r.stderr)
print(f"음악 원래 크기 {lufs:.1f} LUFS → {gain:+.1f}dB 낮춤(목표 {target} LUFS)")
print("완성:", os.path.relpath(out, here))
