#!/usr/bin/env bash
# 한 편 최종본 만들기: 렌더링 → 같은 길이 피아노 배경음악 → 배경음악 넣은 최종본 → 장면 사진 모음
#   ./make_final.sh s3ep01
set -e
cd "$(dirname "$0")"
EP=${1:?화 폴더 이름 (예: s3ep01)}
PY=${PY:-/opt/manimenv/bin/python}
./render.sh "$EP" final
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$EP/${EP}_final.mp4")
"$PY" music/gen_bgm.py "$DUR" --style piano --seed "$(echo -n "$EP" | cksum | cut -c1-4)"
WAV=$(ls -t music/bgm_piano_*s.wav | head -1)
MID=${WAV%.wav}.mid
ffmpeg -v error -y -i "$WAV" -c:a libmp3lame -b:a 192k "music/bgm_${EP}_piano.mp3"
[ -f "$MID" ] && mv "$MID" "music/bgm_${EP}_piano.mid"
rm -f "$WAV"
"$PY" add_bgm.py "$EP" "music/bgm_${EP}_piano.mp3" --tag piano
"$PY" frames.py "$EP" final "media/frames/$EP"
echo "최종본: $EP/${EP}_final_bgm_piano.mp4  ($DUR 초)"
