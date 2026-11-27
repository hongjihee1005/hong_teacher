# w3u11 실제 그림 (캔바 AI generate-image, 2026-11-27)

모두 aspectRatio LANDSCAPE_16_9(원본 2720×1536). prompt는 WANT.md 그대로(다시 만든 것은 비고에 더한 말).

받는 법(이번에 바뀜): create-design에 references로 넘기니 캔바가 사진을 '참고'로만 쓰고 사람이 든 스크랩북 디자인을 새로 만들어 버림(DAHcFM4r8p4 1~6쪽, 버림).
그래서 그 디자인을 read-design(open_transaction) → edit-design으로 1920×1080 빈 쪽을 더하고 쪽마다 insert_fill(media id, left 0 · top −2 · 1920×1084, 비율 그대로 꽉 채움) → commit → export-design png 1920(그 쪽만) → JPG 품질 85.

| 이름 | 쓰는 곳 | media id | 비고 |
|---|---|---|---|
| cart.jpg | 낱말 1 '힘' | MAHcFJD5gfg | DAHcFM4r8p4 7쪽. 카트 손잡이는 오른쪽 위(사람은 허리 아래만) |
| seesaw.jpg | 낱말 3 '수평' | MAHcFK_uw-o | |
| balance.jpg | 낱말 5 '저울' | MAHcFAQenKM | |
| bottle_opener.jpg | 낱말 9 '지레'의 예 | MAHcFN-e43A | prompt 끝에 '투명한 빈 음료수 유리병'을 더함 |
| ramp.jpg | 낱말 10 '빗면'의 예 | MAHcFOmseJk | |
