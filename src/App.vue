<template>
  <div id="app">

    <div id="nav">
      <Header ref="header"></Header>
    </div>

    <div class="body">
      <router-view ></router-view>
    </div>

    <div class="message">
      <Message></Message>
    </div>

    <div class="foot">
      <Footer></Footer>
    </div>


    <div class="login" v-if="showLogin">
      <Login></Login>
    </div>


    <!--提示用户前往支付的提示框-->
    <Modal v-model="globalModal" width="360" @on-cancel="closeModal">
      <div >
        <div class="globalhead">
          <Icon type="ios-alert" size="24" color="#ff9900"/><div>提示</div>
        </div>
        <div class="modalbody">
          {{globalTitle}}
        </div>
      </div>
      <div slot="footer">
        <Button type="primary"  @click="linkMenber">确定</Button>
        <Button @click="closeModal">取消</Button>
      </div>
    </Modal>


  </div>
</template>
<script>
    import Header from './components/Header';
    import Footer from './components/Footer';
    import Message from './components/Message';
    import Login from './components/Login';
    export default {
        name: "app",
        components: {
            Header,
            Footer,
            Message,
            Login
        },
        data(){
            return {

            }
        },

        computed:{
            // 权限弹窗状态
            globalModal(){
                return this.$store.state.globalModal
            },
            //权限弹窗标题
            globalTitle(){
                return this.$store.state.globalModalTitle
            },
            //登录弹窗
            showLogin(){
                return this.$store.state.showLogin
            }
        },
        provide() { // 注册一个方法 用来刷新页面
            return {
                reload: this.reload
            }
        },
        methods: {
            // 关闭弹窗
            closeModal:function(){
                this.$store.commit('changeModalType', false);
                this.$router.push({name: 'home'});
            },
            //前往会员中心
            linkMenber: function(){
                this.$router.push({name: 'menber'});
                this.$store.commit('changeModalType', false);
            },
             //用户登录成功刷新导航
            reload() {
                var that = this;
                this.$nextTick(function() {
                    that.$refs.header.showLoginMethod();
                })
            }

        },
    }
</script>

<style lang="scss">
  @import 'assets/style/_variables';
  #app {
    font-family: "Microsoft YaHei","Helvetica Neue",Helvetica,"PingFang SC";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /*text-align: center;*/
    color: #2c3e50;
    background: $bg;
  }
  .body {
    padding-bottom: 20px;
    margin-top: 60px;
    @extend .global_width;
    position: relative;
  }
  .foot{
    z-index: 901;
    /*width: 100%;*/
    /*position: fixed;*/
    /*bottom: 0;*/
    /*left: 0;*/
    background: $bg;
  }
  .message{

    z-index: 108;
  }
#nav{
  position: fixed;
  top: 0;
  z-index: 901;
  width: 100%;
  background: $bg;
}

  .ivu-menu-item,.ivu-menu{
    font-size: 16px!important;
  }
  .ivu-input-group-append, .ivu-input-group-prepend{
    font-size: 14px!important;
  }
  .clearfix:after {
    clear: both;
    content: "";
    display: block;
  }
   ul>li{list-style: none;}


  /****弹窗样式****/
  .globalhead{
    margin-bottom: 10px;
    font-size: 16px;
    text-align: center;
    position: relative;
    font-weight: bold;
  }
 .globalhead .icon{
    position: absolute;
    top: 0;
    right: 10px;
  }
 .modalbody{
    text-align: center;
    font-size: 14px;
  }
  .globalhead div{
    display: inline-block;
    vertical-align: middle;
    margin-left: 6px;
  }
</style>
