You are analysing a Korean elementary math teacher's guide (지도서) to produce a precise lesson specification that other agents will use to build interactive lesson apps. Do NOT edit the git repo. Write output files only.

SOURCE: a Google Drive PDF (fileId given). Load the tool with ToolSearch query "select:mcp__Google_Drive__read_file_content" and call read_file_content with the fileId. (Do NOT use download_file_content — base64 would overflow your context.) Save the raw returned text to the raw-file path given. If the returned text is truncated or missing parts, say so under "결손".

OUTPUT (Korean Markdown) with:
1. 단원명, 단원 개관 요약(3~5줄), 관련 성취기준 코드와 문장 exactly as in the guide, 선수/후속 학습, 단원 지도 유의점, 학생 오개념 목록.
2. 단원 전개 계획 표: 차시, 주제(교과서 제목), 교과서·익힘 쪽수, 수업 내용 및 활동, 과정 중심 평가 내용, 준비물.
3. 교과서 단원 도입 이야기/소재(등장인물 이름, 장소, 상황).
4. For EVERY 차시 (one section each): 학습 목표/학습 문제(교과서 문장 그대로), 교과서 활동 순서 with exact situations, numbers, figures described precisely in words (fractions/decimals, shapes with side lengths and angles, graph data and scales, etc.), every question with its correct answer (verify yourself; flag any discrepancy), 핵심 용어와 정의(약속하기 문장 그대로), 확인 문제와 답, 지도 유의점·발문·예상 반응, 익힘책/유사 문제와 답 if visible. For 생각을 더하다/놀이를 더하다 차시 describe the task/game rules completely. For 공부한 내용을 확인해요 list all problems with answers.
5. 평가 기준(상·중·하).
Be complete and faithful; prefer exact numbers. Length 30–80KB fine. Final answer: 3-line summary (단원명, 차시 수, 소재, 결손 여부).
