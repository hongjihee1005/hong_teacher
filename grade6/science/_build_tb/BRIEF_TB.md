# 6학년 과학 교과서 버전 앱 쓰기 안내 (작업자용)

선생님 요청(2026-10-24): 4·5학년에 이어 6학년 1학기 교과서 버전. 3학년 과학 교과서 버전(`grade3/science/sem1/`·`sem2/`, 53개 앱)과 **같은 모양·같은 수준**의 앱을 6학년 1학기 차시마다 하나씩 만듭니다. **5학년 교과서 버전(`grade5/science/_build_tb/src/`·`src2/`, 결과 `grade5/science/sem1/`·`sem2/`)과 4학년(`grade4/science/_build_tb/`)이 이미 완성된 같은 틀의 견본**이니 꼭 함께 보세요.
선생님께 질문할 수 없으니 판단해서 끝까지 해 주세요. 결과 보고는 한국어로.

## 3학년 교과서 버전 앱이란
- 차시마다 HTML 한 장. 교과서·실험관찰 흐름을 그대로 따라가며, 화면에서 **직접 해 보는** 활동으로 바꾼 앱입니다.
  섹션 차례 예: 도입(교과서 첫 물음 + 고르기) → 탐구 활동(준비물·과정을 '영상처럼' 재생하는 SVG 플레이어나 가상 실험실, 결과를 고르고 기록) → 결과 정리(표·고르기) → 생각+ / 더 알아보기(분류하기·숨은 것 찾기·놀이) → 한눈에 쏙(교과서 정리 문장의 빈칸 쓰기) → 형성 평가(고르기 1 + 글쓰기 1) → 스스로 평가(얼굴 3단계).
- 먼저 견본을 꼭 보세요(사진 base64가 커서 아래처럼 줄여서 읽기):
  ```bash
  python3 - <<'P'
  import re,sys
  for f in ['grade3/science/sem2/u2-1.html','grade3/science/sem1/u1-1.html','grade3/science/sem2/u3-3.html']:
      s=open('/home/user/hong_teacher/'+f,encoding='utf-8').read()
      s=re.sub(r'data:[^"\')]{200,}','DATA',s); s=re.sub(r'<!--hj-ctheme-->.*?<!--/hj-ctheme-->','',s,flags=re.S); s=re.sub(r'<!--hj-cicons-->.*?<!--/hj-cicons-->','',s,flags=re.S)
      i=s.index('</main>'); j=s.index('</script>',i)
      open('/tmp/claude-0/-home-user-hong-teacher/23ed6b94-6e4b-561e-99c8-0096d7177c7b/scratchpad/ex_'+f.replace('/','_'),'w').write(s[s.index('<body>'):j])
  P
  ```
  본문(section들)과 앱 script(맨 아래 첫 script)가 여러분이 쓸 부분입니다. 견본의 SVG 플레이어(`.player`, ▶·시간 막대·장면 단추·자막 `.cap`), 가상 실험(누르면 바뀌는 그림), 끌어 놓기·누르기 찾기 활동 같은 **구현 수준**을 맞춰 주세요.
- 화면에서 브라우저로 견본을 열어 '한 화면' 모드(섹션이 한 쪽씩, 아래 ◀ 이전 · 다음 ▶)를 눌러 보면 학생이 보는 모양을 알 수 있습니다.

## 여러분이 쓰는 파일: `grade6/science/_build_tb/src/uN-M.html`
```html
<!--
title: 자석에 붙는 물체와 붙지 않는 물체      ← 교과서 차시 제목 그대로(이모지 없이)
unit: 1
lesson: 2                                     ← 차시 번호, 두 차시면 8~9
total: 9                                      ← 단원 전체 차시 수(1차시 열려라 과학 포함)
goal: 첫 줄<br>둘째 줄                        ← 학습 목표(지도서), 여러 줄은 <br>
pages: 「과학」 18~19쪽 · 「실험관찰」 6~7쪽 · 지도서 000~000쪽
blanks: [{"btn":"blReveal","ans":{"bl1":"철","bl2":"쪽"}}]     ← 한눈에 쏙 빈칸(없으면 줄을 빼요)
-->
<style> 이 앱만 쓰는 CSS (클래스 이름은 짧은 앞글자를 붙여 겹치지 않게) </style>
<section id="s1" data-nav="도입"> … </section>
<section id="s2" data-nav="실험해요"> … </section>
…
<script> 이 앱의 동작 </script>
```
- `build.py`가 머리(제목·'6학년 1학기 과학 · N단원 … · M/T차시'·단원 그림), 위 탭(nav, `data-nav` 글), 학습 목표, 출처, 한 화면 모드·빈칸 쓰기·홈 단추·연락처 줄을 붙입니다. 공통 CSS는 `parts/head_css.html`(견본과 같음: `.stage .pick .fb .row button.main .sel .right .wrong .player .ctl .chapters .cap .blank td.face .photo .gallery .scene .tip .found` 등).
- **이미 있는 도우미(다시 선언하지 마세요):** `$` `$$` `fb(el|'#id', 글, true/false/null)` `doneNav('s3')` `pickOne('#box', 맞을 때, 틀릴 때, 'sN')`(버튼 `data-a="1"`이 정답, `data-m`에 버튼별 풀이 가능; 결과는 상자 바로 다음 `.fb`) `faces('sN', 좋을 때, 어려울 때)`(섹션 안 `td.face[data-r=0..]`와 `.fb`) `keyCheck('#ta','#btn','#fb',[[/정규식/,'이름']…], 필요 수, 'sN', 힌트)`.
- 빈칸(한눈에 쏙): 견본처럼 `<span class="blank"><span id="bl1">?</span><span id="bl2">?</span></span>`과 `<div class="row"><button class="main" id="blReveal">정답 확인</button></div><div class="fb" id="blFb"></div>`, 머리 주석 `blanks`에 답. 공통 스크립트가 빈칸을 입력칸으로 바꾸고 '확인하기'·'정답 보기'를 붙이며, 맞히면 원래 `blReveal.onclick`을 부릅니다(그 안에서 fb·doneNav).
- 섹션마다 끝내면 `doneNav('sN')`(위 탭이 초록이 됨). 섹션은 `id="s1"`부터 차례로.
- 사진: 이 환경은 위키미디어를 받을 수 없어 **직접 그린 SVG**를 씁니다(교과서 사진 자리에 알아볼 수 있는 그림). 이미 받아 둔 사진 `ls /home/user/hong_teacher/_build/wmcache`에 알맞은 것이 있으면 `<figure class="photo"><img src="@wm:File:이름.jpg" alt="…"><figcaption>…</figcaption></figure>`(build.py가 넣고 출처를 붙임). 바깥 주소(CDN 등)는 쓰지 않습니다.
- 한 화면 모드: 섹션이 화면보다 길면 엔진이 여러 쪽으로 자릅니다. **한 활동(물음과 그 보기·단추·결과)이 두 쪽에 갈라지면 할 수 없으니**, 자르면 안 되는 요소에 `data-glue="1"`(앞 요소와 같은 쪽)을 붙이거나 섹션을 짧게 나누세요. 큰 SVG는 `viewBox`를 쓰고 `max-height`를 걸어 1280×800 한 쪽에 들어가게.
- 글: 학생 말투 '~해요', 짧게. 6학년 수준 낱말은 지도서대로. 형성 평가·한눈에 쏙 답은 교과서·지도서와 맞게. 과학 개념 사실은 지도서에서 확인한 것만.

## 내용 기준
- 지도서 텍스트(PDF에서 뽑은 글, `[**Page N**]`이 PDF 쪽): `/tmp/claude-0/-home-user-hong-teacher/23ed6b94-6e4b-561e-99c8-0096d7177c7b/scratchpad/g6/s61N.txt`(N=단원, 모두 읽힘; `\[`처럼 앞에 붙은 `\`는 무시). 지도서 쪽은 꼬리말 "NNN 수업 지도의 실제", 교과서 쪽은 축소본 안 굵은 숫자로 확인. 차시마다 지도서의 학습 목표·교과서 흐름·실험 과정·결과·정리·실험관찰 문항·유의점·안전을 읽고 앱에 옮깁니다.
- 교과서 버전은 **교과서 흐름 그대로**입니다(실험 설계·자료판으로 바꾸지 않음).
- 안전 유의점은 실험 섹션에 `<p class="tip">⚠️ …</p>`로. 화산·지진은 지나친 두려움을 주지 않게.
- 지도서 글을 저장소에 그대로 길게 옮겨 적지 마세요(저작물). 교과서 물음·정리 문장 정도는 괜찮습니다.

## 파일 이름 (지도서 '교과서 차시 구성' — 1차시 열려라 과학·과학이 톡톡 제외, total은 과학이 톡톡 포함)
- 1단원 산과 염기(total 12): u1-1 2 · u1-2 3~4 · u1-3 5 · u1-4 6 · u1-5 7 · u1-6 8 · u1-7 9~10(창의가 팡팡)
- 2단원 물체의 운동(total 12): u2-1 2 · u2-2 3 · u2-3 4 · u2-4 5 · u2-5 6 · u2-6 7~8 · u2-7 9~10(창의가 팡팡)
- 3단원 식물의 구조와 기능(total 12): u3-1 2 · u3-2 3 · u3-3 4 · u3-4 5 · u3-5 6 · u3-6 7 · u3-7 8 · u3-8 9~10(창의가 팡팡)
- 4단원 지구의 운동(total 11): u4-1 2~3 · u4-2 4 · u4-3 5 · u4-4 6 · u4-5 7 · u4-6 8~9(창의가 팡팡)
(쪽수는 지도서 '단원 지도 계획' 표로 확인. '체험 더하기'가 있는 차시는 그 내용도 활동으로 살릴 수 있음.)

## 만들기·점검
```bash
cd /home/user/hong_teacher/grade6/science/_build_tb
python3 build.py check u1-1          # 원본 점검만
python3 build.py u1-1 u1-2           # ../sem1/u1-1.html … 만들기
node check.js ../sem1/u1-1.html --shots /tmp/claude-0/-home-user-hong-teacher/23ed6b94-6e4b-561e-99c8-0096d7177c7b/scratchpad/tb6/u1
```
- JS 오류 0, 가로 넘침 0이어야 합니다. '세로 넘침'(1280×800·1366×768에서 한 쪽이 화면보다 긴 것)은 될 수 있으면 0으로.
- 스크린숏을 Read로 여러 장 직접 보고(그림이 알아볼 만한지, 활동이 한 쪽에 있는지), Playwright로 실제 단추를 눌러 활동이 끝까지 되는지(정답 고르기 → 초록, 빈칸 → 확인) 확인하세요.
- **git 커밋·푸시·stash 금지.** `build.py`·`parts/`·`check.js`·`BRIEF_TB.md`는 고치지 마세요(꼭 필요한 기능은 보고서에). 다른 단원 파일도 건드리지 마세요.

## 최종 보고 (차시마다 3~4줄)
섹션 차례와 주요 활동, 교과서에서 그대로 가져온 것, 그림으로 대신한 것, 지도서에서 확인 못 한 것 + 점검 결과.


