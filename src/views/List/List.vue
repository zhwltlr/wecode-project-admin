<template>
  <div class="section list">
    <h3 class="section-tit">캠페인 목록</h3>
    <div class="search-area">
      <div class="select-box">
        <select v-model="selected">
          <option>전체</option>
          <option :value="{ name: 'campaign_idx' }">idx</option>
          <option :value="{ name: 'company_name' }">회사명</option>
          <option :value="{ name: 'campaign_title' }">캠페인</option>
          <option :value="{ name: 'admin_name' }">담당자</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="검색어 입력"
        class="search-input"
        @change="input"
      />
      <button type="button" class="btn-blue-sm" @click="clickSearch">
        검색
      </button>
    </div>

    <div class="table-wrap">
      <div class="table-info">
        <button type="button" class="btn-blue-sm" @click="moveRegister">
          등록하기
        </button>
      </div>
      <table>
        <colgroup>
          <col width="40px;" />
          <col width="50px;" />
          <col width="100px;" />
          <col width="200px;" />
          <col width="80px;" />
          <col width="90px;" />
          <col width="90px;" />
          <col width="120px;" />
          <col width="70px;" />
          <col width="" />
          <col width="50px;" />
          <col width="50px;" />
          <col width="100px;" />
        </colgroup>
        <thead>
          <tr>
            <th>No.</th>
            <th>idx</th>
            <th>회사명</th>
            <th>캠페인</th>
            <th>타입</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>마지막 수행시간</th>
            <th>담당자</th>
            <th>캡쳐수/<br />동작수</th>
            <th>포스팅</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody v-if="searchFilter.length !== 0">
          <tr v-for="(list, i) in searchFilter" :key="i">
            <td>{{ list.idx }}</td>
            <td>{{ list.campaign_idx }}</td>
            <td>{{ list.company_name }}</td>
            <td @click="detail(i)" class="underline">
              {{ list.campaign_title }}
            </td>
            <td>{{ list.sns_type }}</td>
            <td>{{ changeTime(list.start_day) }}</td>
            <td>{{ changeTime(list.end_day) }}</td>
            <td>
              {{ list.last_run_at?.split("T")[0] }}
              {{ list.last_run_at?.split("T")[1].split("\.")[0] }}
            </td>
            <td>{{ list.admin_name }}</td>
            <td>{{ list.captured_count }} / {{ list.run_count }}</td>
            <td>{{ list.posting_count }}</td>
            <td>{{ campaignState[`${list.state}`] }}</td>
            <td>
              <button @click.stop="modify(i)">수정</button>
              <button @click.stop="deleteIdx(i)">삭제</button>
            </td>
          </tr>
        </tbody>
        <tbody v-else-if="searchResult.length == 0 && searchFilter.length == 0">
          <tr>
            <td colspan="13">검색결과가 없습니다</td>
          </tr>
        </tbody>
        <tbody v-else-if="searchResult.length !== 0">
          <tr v-for="(list, i) in searchResult" :key="i">
            <td>{{ list.idx }}</td>
            <td>{{ list.campaign_idx }}</td>
            <td>{{ list.company_name }}</td>
            <td @click="detail(i)" class="underline">
              {{ list.campaign_title }}
            </td>
            <td>{{ list.sns_type }}</td>
            <td>{{ list.start_day?.split("T")[0] }}</td>
            <td>{{ list.end_day?.split("T")[0] }}</td>
            <td>
              {{ list.last_run_at?.split("T")[0] }}
              {{ list.last_run_at?.split("T")[1].split("\.")[0] }}
            </td>
            <td>{{ list.admin_name }}</td>
            <td>{{ list.captured_count }} / {{ list.run_count }}</td>
            <td>{{ list.posting_count }}</td>
            <td>{{ campaignState[`${list.state}`] }}</td>
            <td>
              <button @click.stop="modify(i)">수정</button>
              <button @click.stop="deleteIdx(i)">삭제</button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr v-for="(list, i) in campaignData" :key="i">
            <td>{{ list.idx }}</td>
            <td>{{ list.campaign_idx }}</td>
            <td>{{ list.company_name }}</td>
            <td @click="detail(i)" class="underline">
              {{ list.campaign_title }}
            </td>
            <td>{{ list.sns_type }}</td>
            <td>{{ list.start_day?.split("T")[0] }}</td>
            <td>{{ list.end_day?.split("T")[0] }}</td>
            <td>
              {{ list.last_run_at?.split("T")[0] }}
              {{ list.last_run_at?.split("T")[1].split("\.")[0] }}
            </td>
            <td>{{ list.admin_name }}</td>
            <td>{{ list.captured_count }} / {{ list.run_count }}</td>
            <td>{{ list.posting_count }}</td>
            <td>{{ campaignState[`${list.state}`] }}</td>
            <td>
              <button @click.stop="modify(i)">수정</button>
              <button @click.stop="deleteIdx(i)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <LoadingSpinner v-if="isLoading" />
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "../../components/common/LoadingSpinner.vue";
import ProcessList from "./ProcessList";

export default {
  data() {
    return {
      campaignData: [],
      selected: "전체",
      search_value: "",
      inputText: "",
      isLoading: false,
      campaignState: ProcessList[0],
      searchResult: [],
    };
  },
  components: {
    LoadingSpinner: LoadingSpinner,
  },

  methods: {
    changeTime(time) {
      const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
      let koreaNow = new Date(
        new Date(time).getTime() + KR_TIME_DIFF
      ).toISOString();
      let koreanTime = String(koreaNow).split("T")[0];
      return koreanTime;
    },
    deleteIdx(i) {
      axios
        .delete(
          `http://3.36.103.222:80/scheduler/${this.campaignData[i].idx}`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res) {
            alert("삭제가 완료되었습니다.");
          }
        });
    },
    detail(i) {
      this.$router.push({
        name: "Detail",
        params: {
          camIdx: this.campaignData[i].idx,
        },
      });
    },
    modify(i) {
      this.$router.push({
        name: "Register",
        params: {
          camIdx: this.campaignData[i].idx,
        },
      });
    },
    moveRegister() {
      this.$router.push({
        name: "Register",
      });
    },
    activeFilter() {
      return searchFilter;
    },
    input(e) {
      return (this.inputText = e.target.value);
    },
    clickSearch() {
      this.isLoading = true;
      this.search_value = this.inputText;
      if (this.selected == "전체") {
        this.searchAll();
      }
    },
    searchAll() {
      this.searchResult = [];
      let parseData = JSON.parse(JSON.stringify(this.campaignData));
      parseData.forEach((element, i) => {
        for (const value of Object.values(element)) {
          if (value == this.search_value) {
            this.isLoading = false;
            this.searchResult.push(this.campaignData[i]);
          }
        }
      });
    },
  },
  created() {
    axios
      .get("http://3.36.103.222:80/scheduler", {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        this.campaignData = res.data;
      });
  },
  computed: {
    searchFilter: function () {
      if (this.search_value) {
        return this.campaignData.filter((data) => {
          this.isLoading = false;
          return data[`${this.selected.name}`] == this.search_value;
        });
      } else {
        this.isLoading = false;
        return this.campaignData;
      }
    },
  },
};
</script>
