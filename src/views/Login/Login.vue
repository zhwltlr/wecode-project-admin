<template>
  <div class="section login">
    <h3 class="section-tit">로그인</h3>
    <form method="post" class="form-wrap" @submit.prevent="loginSubmit">
      <div class="form-box">
        <input
          type="text"
          placeholder="이메일 주소"
          id="email"
          class="form-input"
          v-model="email"
        />
      </div>
      <div class="form-box">
        <input
          type="password"
          placeholder="비밀번호"
          id="password"
          class="form-input"
          v-model="password"
        />
      </div>
      <div class="btn-area">
        <button type="submit" class="btn-blue">로그인</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    loginSubmit() {
      axios
        .post("https://api.tagby.io/auth/login/adm/", {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          if (res.data.msg == "Success") {
            localStorage.setItem("token", res.data.data.access_token.token);
            axios
              .get("http://3.36.103.222:80/scheduler", {
                headers: {
                  authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
              .then((res) => {
                this.$router.push({
                  name: "List",
                });
              });
          } else {
            throw new Error("에러 발생");
          }
        })
        .catch((error) => {
          alert("정확한 정보를 입력해주세요");
        });
    },
  },
};
</script>
