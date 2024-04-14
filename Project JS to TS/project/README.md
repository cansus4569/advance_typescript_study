## 코로나 세계 현황판 만들기

최종 프로젝트 폴더입니다

## 자바스크립트 프로젝트에 타입스크립트 적용하기

0. 자바스크립트 파일에 JSDoc으로 타입 시스템 입히기
1. 타입스크립트의 기본 환경 구성
   - [x] NPM 초기화
   - [x] 타입스크립트 라이브러리 설치
   - [x] 타입스크립트 설정 파일 생성 및 기본 값 추가
   - [x] 자바스크립트 파일을 타입스크립트 파일로 변환
   - [x] `tsc` 명령어로 타입스크립트 컴파일 하기
2. 명식적인 `any` 선언하기
   - `tsconfig.json` 파일에 `noImplicitAny` 값을 `true`로 추가
   - 가능한한 구체적인 타입으로 타입 정의
3. 프로젝트 환경 구성
   - babel, eslint, prettier 등의 환경 설정
4. 외부 라이브러리 모듈화

## 참고 자료

- ~~[존스 홉킨스 코로나 현황](https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6)~~
- ~~[Postman API](https://documenter.getpostman.com/view/10808728/SzS8rjbc?version=latest#27454960-ea1c-4b91-a0b6-0468bb4e6712)~~
- ~~[Type Vue without Typescript](https://blog.usejournal.com/type-vue-without-typescript-b2b49210f0b)~~
- [공공데이터포털](https://www.data.go.kr)

## 프로젝트 이슈

- 강의 제작년도가 2020년이여서, 현재 프로젝트에 적용된 코로나19 Open API 가 지원이 중단됨
- ~~우선, 공공데이터포털에 `보건복지부_코로나19 시도 발생현황` api 신청 및 대기중~~
  - ~~허용되면, api 주소를 바꿔서 적용할 예정~~
- API 신청 완료 및 프로젝트 API 교체 및 구조 변경함
- 수정 내역
  - 국내 17개 도시에 대해서 2021-12-15 날짜 기준으로 누적 확진자 수를 메인화면에 보여준다.
  - 해당 도시 클릭하면, 날짜 상관없이 numOfRow = 7 파라미터 값을 이용하여, 7개의 데이터를 가지고온다.
    - 7개의 데이터에 대한 deathCnt, isolClearCnt 값의 통계를 보여주고
    - 7개의 데이터에 대한 defCnt 값을 Chart 로 표현한다.
