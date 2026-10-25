"""완성 영상에서 자막이 바뀌기 직전 장면을 뽑아 모아 보기(확인용)
    python frames.py s3ep01 preview [출력폴더]   → 출력폴더/sheetN.png (한 장에 6장면)
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw

ep, mode = sys.argv[1], sys.argv[2] if len(sys.argv) > 2 else "preview"
here = os.path.dirname(os.path.abspath(__file__))
out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(here, "media", "frames", ep)
os.makedirs(out, exist_ok=True)
video = os.path.join(here, ep, f"{ep}_{mode}.mp4")
tl = json.load(open(os.path.join(here, ep, "timeline.json"), encoding="utf-8"))
files = []
for i, x in enumerate(tl):
    t = x["t"] + 0.6 * (x["end"] - x["t"])   # 자막 시간의 60% 지점(지우기 전 장면)
    f = os.path.join(out, f"f{i:02d}.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", video,
                    "-frames:v", "1", f], stdin=subprocess.DEVNULL, check=True)
    files.append((f, f"{i:02d} {x['t']:.0f}s"))
for k in range(0, len(files), 6):
    ims = [(Image.open(f), lab) for f, lab in files[k:k + 6]]
    W, H = ims[0][0].size
    S = Image.new("RGB", (W * 2 + 10, H * 3 + 20), "black")
    for j, (im, lab) in enumerate(ims):
        x, y = (j % 2) * (W + 10), (j // 2) * (H + 10)
        S.paste(im, (x, y))
        ImageDraw.Draw(S).text((x + 6, y + 4), lab, fill="red")
    S.save(os.path.join(out, f"sheet{k // 6}.png"))
print(out, len(files))
