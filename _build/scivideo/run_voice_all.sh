#!/bin/bash
# 편 목록 파일을 받아 3편씩 동시에 make_voice.sh — 편마다 로그 media/voice_logs/<편>.log, 끝난 편은 media/voice_logs/done.txt
cd "$(dirname "$0")"
mkdir -p media/voice_logs
one() { ep=$1; grep -qx "$ep" media/voice_logs/done.txt 2>/dev/null && exit 0
  if OMP_NUM_THREADS=1 ./make_voice.sh "$ep" > "media/voice_logs/$ep.log" 2>&1; then echo "$ep" >> media/voice_logs/done.txt; else echo "$ep" >> media/voice_logs/fail.txt; fi; }
export -f one
xargs -a "$1" -P 3 -I{} bash -c 'one {}'
echo ALLDONE
