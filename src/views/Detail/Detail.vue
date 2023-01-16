<template>
  <div class="section detail">
    <h3 class="section-tit">캠페인 상세</h3>
    <div class="top-info">
      <h4 class="company">{{ detailData[0].campaign_title }}</h4>
      <p class="campaign">{{ detailData[0].company_name }}</p>
      <p class="period">
        {{ detailData[0].start_day?.split("T")[0] }} ~
        {{ detailData[0].end_day?.split("T")[0] }}
      </p>
    </div>
    <div class="table-wrap">
      <div class="table-info">
        <div class="total-num">
          총 <span>{{ detailData[0].pictures.length }}</span
          >개
        </div>
        <button type="button" class="btn-blue-sm">일괄 다운로드</button>
      </div>
      <table>
        <colgroup>
          <col width="40px;" />
          <col width="200px" />
          <col width="200px;" />
          <col width="80px" />
          <col width="" />
          <col width="200px" />
          <col width="180px" />
        </colgroup>
        <thead>
          <tr>
            <th>No.</th>
            <th>날짜</th>
            <th>캡쳐시간</th>
            <th>순위</th>
            <th>인플루언서</th>
            <th>키워드</th>
            <th>이미지</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(list, i) in detailData[0].pictures" :key="i">
            <td>{{ detailData[0].pictures.length - i }}</td>
            <td>{{ list.created_at?.split("T")[0] }}</td>
            <td>{{ list.created_at?.split("T")[1].split("\.")[0] }}</td>
            <td>
              <p v-for="(rank, i) in list.rank">{{ rank.rank }}</p>
            </td>
            <td>
              <p v-for="(rank, i) in list.rank">
                <a class="underline" :href="rank.url" target="_blank"
                  >Post로 이동</a
                >
              </p>
            </td>
            <td>{{ list.keyword }}</td>
            <td>
              <p v-for="(rank, i) in list.rank">
                <a
                  target="_blank"
                  :href="`http://3.36.103.222:80/scheduler/image?bucketPath=${list.bucket_path}`"
                  >보기</a
                >
                <button type="button">다운로드</button>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="t-right">
      <button type="button" class="btn-blue-sm" @click="moveList">
        목록보기
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    const index = this.$route.params.camIdx;
    return {
      detailData: [],
      index: index,
      file: null,
      fileList: [],
    };
  },
  methods: {
    moveList() {
      this.$router.push({
        name: "List",
      });
    },
    openUrl(i) {
      axios
        .get(`http://10.58.52.99:3001/scheduler/image?bucketPath=${i}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          this.test =
            "data:image/png;base64," +
            btoa(unescape(encodeURIComponent(res.data)));
        });
    },
    changeTime(time, num) {
      const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
      let koreaNow = new Date(
        new Date(time).getTime() + KR_TIME_DIFF
      ).toISOString();
      if (num == 1) {
        let koreanTime = String(koreaNow).split("T")[num].split(".")[0];
        return koreanTime;
      } else {
        let koreanTime = String(koreaNow).split("T")[num];
        return koreanTime;
      }
    },
  },
  created() {
    const index = this.$route.params.camIdx;
    axios
      .get(`http://3.36.103.222:80/scheduler?idx=${index}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.detailData = res.data;
      });
  },
};
</script>
