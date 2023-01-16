<template>
  <div class="section register">
    <h3 class="section-tit">캠페인 등록/수정</h3>
    <div class="form-wrap">
      <div class="form-box">
        <input
          type="number"
          v-if="!$route.params.camIdx"
          class="form-input"
          placeholder="캠페인번호"
          @input="inpNum"
          :value="inpData"
        />
        <input
          type="number"
          v-if="$route.params.camIdx"
          class="form-input"
          placeholder="캠페인번호"
          :value="idxData[0][0].campaign_idx"
          disabled
        />
        <button
          type="button"
          v-if="!$route.params.camIdx"
          class="btn-blue-sm"
          @click="registerIdx"
        >
          조회
        </button>
        <button
          type="button"
          v-if="$route.params.camIdx"
          class="btn-blue-sm"
          disabled
        >
          조회
        </button>
      </div>
      <div class="flex-box">
        <div class="form-box">
          <label for="campaign-name" class="label">캠페인명</label>
          <input
            type="text"
            v-if="$route.params.camIdx"
            id="campaign-name"
            class="form-input"
            :value="idxData[0][0].campaign_title"
            disabled
          />
          <input
            type="text"
            v-if="!$route.params.camIdx"
            id="campaign-name"
            class="form-input"
            :value="camTitle"
            disabled
          />
        </div>
        <div class="form-box">
          <label for="company-name" class="label">회사명</label>
          <input
            type="text"
            v-if="$route.params.camIdx"
            id="company-name"
            class="form-input"
            :value="idxData[0][0].company_name"
            disabled
          />
          <input
            type="text"
            v-if="!$route.params.camIdx"
            id="company-name"
            class="form-input"
            :value="comName"
            disabled
          />
        </div>
      </div>
      <div class="flex-box">
        <div class="form-box">
          <p class="label">기간설정</p>
          <input
            type="date"
            v-if="$route.params.camIdx"
            class="form-input"
            :value="idxData[0][0].start_day?.split('T')[0]"
            @input="startDate"
            data-placeholder="시작일"
            required
          />
          <input
            type="date"
            v-if="!$route.params.camIdx"
            class="form-input"
            v-model="startDay"
            data-placeholder="시작일"
            required
          />
        </div>
        <div class="form-box">
          <input
            type="date"
            v-if="$route.params.camIdx"
            class="form-input"
            :value="idxData[0][0].end_day?.split('T')[0]"
            @input="endDate"
            data-placeholder="종료일"
            required
          />
          <input
            type="date"
            v-if="!$route.params.camIdx"
            class="form-input"
            v-model="endDay"
            data-placeholder="종료일"
            required
          />
        </div>
      </div>
      <div class="keyword-area">
        <label for="keyword" class="label"
          >키워드
          <span class="sub-txt">* 한개씩 입력해주세요 (최대 3개)</span></label
        >
        <div class="form-box">
          <input
            type="text"
            class="form-input"
            v-model="keytext"
            :disabled="keyword.length >= 3"
          />
          <button
            type="button"
            class="btn-gray-sm"
            @click="addKeyword"
            :disabled="keyword.length == 3"
          >
            추가
          </button>
        </div>
        <div class="keyword">
          <span v-for="(word, i) in keyword" :key="i"
            >{{ word
            }}<button type="button" class="btn-del" @click="delKeyword(i)">
              삭제
            </button></span
          >
        </div>
      </div>
    </div>
    <div class="btn-area">
      <button
        type="button"
        class="btn-gray"
        @click="$router.push({ name: 'List' })"
      >
        취소
      </button>
      <button
        type="button"
        v-if="!$route.params.camIdx"
        class="btn-blue"
        @click="sendNewJob"
      >
        등록
      </button>
      <button type="button" v-else class="btn-blue" @click="sendModifyJob">
        수정
      </button>
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "../../components/common/LoadingSpinner.vue";
export default {
  data() {
    return {
      idxData: [],
      keytext: "",
      keyword: [],
      inpData: "",
      isLoading: false,
      start_day: "",
      end_day: "",
      camTitle: "",
      comName: "",
    };
  },
  components: {
    LoadingSpinner: LoadingSpinner,
  },
  methods: {
    inpNum(event) {
      this.inpData = event.target.value;
    },
    startDate(event) {
      this.start_day = event.target.value;
    },
    endDate(event) {
      this.end_day = event.target.value;
    },
    registerIdx() {
      this.isLoading = true;
      const inpData = this.inpData;
      axios
        .get(`http://3.36.103.222:80/campaign/${inpData}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.idxData.push(res.data);
          this.isLoading = false;
          this.camTitle = this.idxData[0].title;
          this.comName = this.idxData[0].company;
        });
    },
    addKeyword() {
      if (this.keytext !== "") {
        this.keyword.push(this.keytext);
        this.keytext = "";
      } else {
        alert("키워드를 입력하세요");
      }
    },
    delKeyword(i) {
      this.keyword.splice(i, 1);
    },
    sendNewJob() {
      console.log(this.startDay, this.endDay);
      axios
        .post(
          "http://3.36.103.222:80/scheduler",
          {
            campaign_idx: this.inpData,
            startDay: this.startDay,
            endDay: this.endDay,
            keyword: this.keyword.join(),
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data == "post success!") {
            this.$router.push({
              name: "List",
            });
          } else {
            throw new Error("에러 발생");
          }
        });
    },
    sendModifyJob() {
      console.log(this.start_day, this.end_day);
      axios
        .patch(
          `http://3.36.103.222:80/scheduler/${this.idxData[0][0].idx}`,
          {
            startDay: this.start_day,
            endDay: this.end_day,
            keyword: this.keyword.join(),
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.data.message == "patch success") {
            this.$router.push({
              name: "List",
            });
          } else {
            throw new Error("에러 발생");
          }
        });
    },
  },
  created() {
    if (this.$route.params.camIdx) {
      this.isLoading = true;
      const campaign_idx = this.$route.params.camIdx;
      axios
        .get(`http://3.36.103.222:80/scheduler?idx=${campaign_idx}`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          this.idxData.push(res.data);
          this.keyword = this.idxData[0][0].keyword?.split(",");
          this.isLoading = false;
        });
    }
  },
  watch: {
    keytext: function () {
      return (this.keytext = this.keytext.replace(
        /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\ '\"\\(\=]/gi,
        ""
      ));
    },
  },
};
</script>
