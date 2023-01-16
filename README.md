# <p align="center">데이터 관리를 위한 admin page

<p align="center"> 📆 2022.12.12~ 2023.01.06

<br>
<br>
  
<img width="1386px" alt="MSGmain" align="center" src="https://user-images.githubusercontent.com/100506719/212614845-f0f2edcd-cd20-4af6-9c20-0bfa9e3b77fc.gif"/>

<br>

## 구현 목적

- 마케팅 결과를 한 눈에 알 수 있게 하는 관리자 페이지 제작
- 만들게 된 계기
  - 매니저 X가 소속된 A회사는 최근 인플루언서에게 일정 수수료를 지급하고 신제품 B의 홍보를 요청하였다.
  - 매니저 X는 프로모션이 잘 진행되는지 확인하기 위해 매일 정각에 naver 검색창에 B를 검색하고 있다.
  - 검색결과 창에 인플루언서의 포스팅이 있을 경우 해당 페이지를 캡쳐하고, 이 데이터를 모아 상부에 보고한다.
  - <b>매니저 X의 수고를 덜어주기 위해 크롤링한 데이터를 볼 수 있게 하는 페이지 제작하였다.</b>

## 📼 DEMO

- <a href="https://drive.google.com/file/d/1sr9AYUvoBWJj7zTqeNw9GhtGR-FTToP4/view?usp=share_link" target="_blank">📎 시연 영상</a>

## 🙎‍♀️ Team

`FE` 2명 <br>
`BE` 2명

<br/>

## 담당 기능

#### <b>1. 데이터 수집을 요하는 캠페인 등록</b>

- 캠페인이 고유하게 갖고 있는 index 번호를 조회하면, 해당하는 회사명과 캠페인명 출력
- 회사명과 캠페인명은 임의로 수정을 할 수 없게 disabled 처리
- 조회 버튼 클릭 후 중복 데이터 요청을 방지하기 위해 loading spinner 처리
- 시작일과 종료일은 각각 startDay와 endDay로 저장하여 서버에 해당 값을 post
- 키워드 입력은 정규표현식을 사용하여 공백 및 특수문자는 기입할 수 없게 처리
- 최대 3개 입력 제한, 이를 초과할 경우 입력란 & 추가 버튼 disabled 처리
- 입력하지 않고 추가 버튼 누를 경우 alert 설정

#### <b>2. 캠페인 수정</b>

- List 페이지에서 수정버튼을 누를 경우 진입
- 캠페인 고유의 index 번호를 endpoint로 하여 등록페이지와 같은 컴포넌트를 사용

```
const campaign_idx = this.$route.params.camIdx;
axios.get(`${process.env.VUE_APP_TEST_SERVER}scheduler?idx=${campaign_idx})
```

- 기존 등록한 데이터 값을 출력, 수정한 값은 다시 저장하여 서버에 저장

#### <b>3. 캠페인의 크롤링 결과 상세페이지</b>

- List 페이지에서 캠페인명을 누를 경우 진입
- 하나의 검색결과에서 2개 이상의 홍보 포스팅이 노출되는 경우도 있기에 불가피하게 중첩 v-for문 사용
- 캡쳐시간, 홍보포스팅의 위치, 검색 키워드, 인플루언서 포스팅 url을 list화 하여 관리하기 용이하게 함
- 이미지 보기 클릭시, 크롤링한 사진을 새창 열림으로 출력

#### <b>4. 회사 AWS EC2 서버에 배포</b>

- 회사에서 제공한 EC2 인스턴스에 배포
- NginX를 사용하여 안정적인 서비스 제공

<br />

## Tools

- `Notion`, `Trello`, `Git`, `Slack`

## Engineering Stack

- 💻 FE:
  - `JavaScript`, `Vue.js`, `AWS`
- 💻 BE:
  - `JavaScript`, `Node.js`, `AWS`, `MySql`

<br />

---

## 회고 및 느낀점

- <a href="https://blog.naver.com/zhwltlr/222978509678" target="_blank">📎기업협업 회고</a>

- S3에 저장된 이미지를 다운로드 하는 기능을 구현하지 못한 것이 아쉽다.

  - 시도한 방법

    ```
    // 권한 문제로 안됨
    s3.getObject(params, (err, data) => {
    if (err) {
        throw err;
    }
    const blob = new Blob([data.Body], {
        type: data.ContentType
    });
    const blobURL = URL.createObjectURL(blob)});
    ```

    ```
    // 이미지가 새창으로 열릴 뿐 다운로드가 되지 않는다.
    <a href="url" download>이미지 다운로드</a>
    ```

  - 시도해보지 않은 방법
    ```
    Content-Disposition: attachment; filename="filename.jpg"
    ```

<br>

---
