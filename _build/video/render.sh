#!/usr/bin/env bash
# 「수학 원리 돋보기」 렌더링
#   ./render.sh 1 preview   → 저화질 미리보기 (854×480, 15fps) → ep01/ep01_preview.mp4
#   ./render.sh 1 final     → 최종 (1920×1080, 30fps)          → ep01/ep01_final.mp4
# manim 명령 위치가 다르면: MANIM=/경로/manim ./render.sh 1 final
set -e
cd "$(dirname "$0")"
N=${1:?화 번호를 적으세요 (예: 1)}
MODE=${2:-preview}
EP=$(printf "ep%02d" "$N")
SCENE=$(printf "Ep%02d" "$N")
MANIM=${MANIM:-manim}
if [ "$MODE" = "final" ]; then
  Q=(-qh --fps 30); OUT="${EP}_final.mp4"
else
  Q=(-ql --fps 15); OUT="${EP}_preview.mp4"
fi
"$MANIM" "${Q[@]}" --media_dir "${MEDIA:-media}" --disable_caching -o "$OUT" "$EP/scene.py" "$SCENE"
F=$(find "${MEDIA:-media}"/videos -name "$OUT" -newer "$EP/scene.py" | head -1)
cp "$F" "$EP/$OUT"
echo "완성: $EP/$OUT"
