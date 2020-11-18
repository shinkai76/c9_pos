<template>
  <div>
    <div class="login-content loginpage" id="main">
      <div class="login-left">
        <img src="../../assets/C8ERP.jpg" />
      </div>
      <div class="login-right">
        <div class="login-box">
          <div class="login-box-header">
            <div class="login-logo">
              <a href="#">
                <img src="../../assets/c8erp1.png" class="png" border="0">
              </a>
            </div>
          </div>
          <div class="login-box-body">
            <form class="login-form" id="loginform" name="loginform">
              <div class="logineditor">
                <span class="login-error" id="error">{{ error }}</span>
              </div>
              <div class="logineditor">
                <input type="text" name="user_name" id="user_name" class="login_user_name"
                       placeholder="请输入ERP用户名/C8YUN账户" v-model.trim="user_name" />
              </div>
              <div class="logineditor">
                <input type="password" name="password" id="password" class="login_password" value="" placeholder="请输入密码"
                       v-model="password" />
              </div>
              <div class="logineditor">
                <input type="text" name="set_of_book" id="enterpriseId" class="login_enterpriseId" placeholder="请输入企业ID"
                       v-model.trim="set_of_book" />
              </div>
              <div class="logineditor">
                <input type="text" name="terminal_code" id="terminal_code" class="terminal_code" placeholder="请输入设备编号"
                       v-model.trim="terminal_code" />
              </div>
              <div class="remenber"></div>
              <div class="logineditor">
                <button type="button" id="login" class="btn login_login" @click="login">
                  登录
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
    <div class="footer" id="footer"> ©2012 杭州威创软件有限公司 版权所有</div>
  </div>
</template>
<script>
    export default {
        data() {
            return {
                user_name: "admin",
                password: "Ssk.7788",
                set_of_book: "c9",
                terminal_code: "03",
                error: "",
                id: ""
            }
        },
        methods: {
            login: function () {
                this.$axios({
                    url: '/api/login',
                    method: 'POST',
                    data: "user_name=" + this.user_name + "&password=" + this.password + "&set_of_book=" + this.set_of_book + "&terminal_code=" + this.terminal_code
                }).then(res => {
                    if ( res.token ) {
                        sessionStorage.setItem('Token', res.token)
                        localStorage.setItem('loginInfo', JSON.stringify(res))
                        this.$store.commit('INIT_USER_INFO', res)
                        this.$router.push('/index')
                    }
                })
            },
            autoFill() {
                let str = localStorage.getItem('loginInfo');
                if ( str ) {
                    let user_data = JSON.parse(str);
                    this.user_name = user_data.name;
                    this.password = '';
                    this.set_of_book = user_data.set_of_book;
                    this.terminal_code = user_data['terminal'].code;
                }
            }
        },
        mounted() {
            this.autoFill()
        }
    }
</script>
<style>
  @import "login.css";
</style>
