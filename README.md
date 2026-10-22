# dididah · 디디다

회원의 출석과 성장, 코치와 센터의 연결을 소개하는 디디다 공식 홈페이지입니다.

- 홈페이지: https://dididah.kr/
- 브랜드 이야기: https://dididah.kr/#story
- 문의: hello@dididah.kr

## 구성

`index.html`에 소개와 모스 부호 브랜드 이야기를, `styles.css`에 반응형 스타일을, `script.js`에 출석 체험·탭·데모 열기·이메일 복사를 담았습니다. `assets/`에는 확정 로고와 브랜드 자료, `demo/`에는 회원·운영자 예시 화면이 있습니다.

출석 체험과 데모는 샘플 데이터입니다. 실제 출석을 서버에 기록하거나 회원 정보를 저장하지 않습니다.

## 배포

GitHub Pages가 `main` 브랜치의 루트 폴더를 게시합니다. `CNAME`으로 `dididah.kr`에 연결되며 HTTPS를 사용합니다. 별도 빌드나 패키지 설치가 필요 없습니다.

로컬 확인:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

`http://127.0.0.1:8765/`를 엽니다.
