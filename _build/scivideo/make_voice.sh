#!/bin/bash
# AI 음성 넣은 최종본: 음성 만들기 → 음성 길이에 맞춰 렌더링(배경음악·장면 사진 포함) → 음성 얹기
#   ./make_voice.sh s6ep26     → s6ep26/s6ep26_final_voice.mp4
set -e
cd "$(dirname "$0")"
EP=$1
/opt/ttsenv/bin/python tts_episode.py prep "$EP"
VOICE=1 ./make_final.sh "$EP"
/opt/ttsenv/bin/python tts_episode.py mix "$EP"
