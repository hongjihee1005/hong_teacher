#!/usr/bin/env bash
# 「과학 원리 돋보기」·「과학 마인드맵」 렌더링 — 화 폴더 이름으로
#   ./render.sh s3ep01 preview   → 저화질 미리보기 (854×480, 15fps) → s3ep01/s3ep01_preview.mp4
#   ./render.sh s3mm01 final     → 최종 (1920×1080, 30fps)          → s3mm01/s3mm01_final.mp4
# 장면 클래스 이름은 폴더 이름의 첫 글자들을 대문자로: s3ep01 → S3Ep01, s3mm01 → S3Mm01
set -e
cd "$(dirname "$0")"
EP=${1:?화 폴더 이름을 적으세요 (예: s3ep01)}
MODE=${2:-preview}
SCENE=$(echo "$EP" | sed -E 's/^s([0-9])(ep|mm)([0-9]+)$/S\1\u\2\3/')
MANIM=${MANIM:-/opt/manimenv/bin/manim}
if [ "$MODE" = "final" ]; then
  Q=(-qh --fps 30); OUT="${EP}_final.mp4"
else
  Q=(-ql --fps 15); OUT="${EP}_preview.mp4"
fi
"$MANIM" "${Q[@]}" --media_dir "${MEDIA:-media}" --disable_caching -o "$OUT" "$EP/scene.py" "$SCENE"
F=$(find "${MEDIA:-media}"/videos -name "$OUT" -newer "$EP/scene.py" | head -1)
cp "$F" "$EP/$OUT"
echo "완성: $EP/$OUT"
