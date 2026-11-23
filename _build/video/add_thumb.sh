#!/usr/bin/env bash
# 썸네일을 영상 맨 앞에 2초 넣고(끝 0.4초는 영상으로 부드럽게 넘어감), 파일 표지 그림으로도 넣기
#   ./add_thumb.sh gfep03        → gfep03/gfep03_final_thumb.mp4
# 썸네일은 thumbs/<폴더>.png (python thumbs.py로 만듦), 원본은 <폴더>_final_bgm_piano.mp4
set -e
cd "$(dirname "$0")"
EP=${1:?폴더 이름(예: gfep03)}
SRC="$EP/${EP}_final_bgm_piano.mp4"
PNG="thumbs/$EP.png"
OUT="$EP/${EP}_final_thumb.mp4"
HOLD=2.0
JPG=$(mktemp --suffix=.jpg)
ffmpeg -v error -y -i "$PNG" -q:v 2 "$JPG"
ffmpeg -v error -y \
  -loop 1 -t "$HOLD" -framerate 30 -i "$PNG" \
  -f lavfi -t "$HOLD" -i anullsrc=r=44100:cl=stereo \
  -i "$SRC" -i "$JPG" \
  -filter_complex "[0:v]scale=1920:1080:flags=lanczos,format=yuv420p,setsar=1,fps=30[t];[2:v]setsar=1,fps=30[m];[t][m]xfade=transition=fade:duration=0.4:offset=$(python3 -c "print($HOLD-0.4)")[v];[1:a][2:a]acrossfade=d=0.4:c1=tri:c2=tri[a]" \
  -map "[v]" -map "[a]" -map 3 \
  -c:v:0 libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -c:v:1 copy -disposition:v:1 attached_pic -movflags +faststart "$OUT"
rm -f "$JPG"
echo "$OUT"
