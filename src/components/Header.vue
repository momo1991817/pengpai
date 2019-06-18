<template>
    <div class="header clearfix">
        <div class="logo">
            <router-link to="/">
                <img src="../assets/images/logo.png" alt="">
                <span>澎湃旅行</span>
            </router-link>
        </div>
        <!--<div class="content"></div>-->
        <div class="nav">
            <div style="float: right;">
               <Menu mode="horizontal" :theme="theme1" :active-name="menu" ref="menu" @on-select="selectItem">
                <MenuItem name="1">
                  首页
                </MenuItem>

                <MenuItem name="2">
                   降舱
                </MenuItem>

                <MenuItem name="4" v-if="!showLogin">
                    日程管理
                </MenuItem>

                <MenuItem name="5" v-if="!showLogin">
                    订单中心
                </MenuItem>

                 <MenuItem name="6" v-if="!showLogin">
                    <Icon type="ios-notifications-outline" size="24"/>消息<span style="padding-left: 2px;"><Badge :count="infoNum"></Badge></span>
                 </MenuItem>

                <!--<Submenu name="5" v-if="!showLogin">-->
                       <!--<template slot="title">-->
                           <!--<Icon type="ios-stats" />-->
                           <!--订单中心-->
                       <!--</template>-->
                       <!--<MenuItem name="5-1">监控订单</MenuItem>-->
                       <!--<MenuItem name="5-2">完成订单</MenuItem>-->
                 <!--</Submenu>-->

                <Submenu name="3" v-if="!showLogin">
                    <template slot="title">
                        <!--<Icon type="ios-stats" />-->
                        <span class="portrait">
                            <img :src="url" alt="" v-if="url!=''">
                            <img src="../assets/images/head.png" alt="" v-else>
                        </span>
                        我的
                    </template>
                    <!--<MenuItem name="3-1" v-if="showLogin">登录</MenuItem>-->
                    <!--<MenuItem name="3-2"  v-if="showLogin">注册</MenuItem>-->
                    <MenuItem name="3-1">
                        个人中心
                    </MenuItem>
                    <MenuItem name="3-2">
                       航线余票表
                    </MenuItem>
                    <MenuItem name="3-3" v-if="!showLogin">
                       退出
                    </MenuItem>

                </Submenu>


                <MenuItem name="3" v-if="showLogin">
                       登录
                </MenuItem>


            </Menu>
            </div>
        </div>


    </div>
</template>

<script>

    export default {
        name: "Header",
        data() {
            return {
                theme1: 'light',
                showLogin: true,
                menu: "1",
                url:'',
                // infoNum: 0,//消息数量
            }
        },
        computed:{
            infoNum(){
                return this.$store.state.infoNum;
            },

        },
        created(){
           this.showLoginMethod();

            //判断是不是查看订单详情，了其路由长度为33
            if(this.$route.path.length == 33){
                var that = this;
                this.$nextTick(()=>{
                    that.menu = "";
                    that.$refs.menu.updateActiveName();
                });
            }

        },
        methods:{
            //用户点击登录或者注册出现相应的弹出框
            selectItem: function(e){
                if(e== "3"){
                    // this.$router.push('/login');
                    this.$store.commit('changeLoginShow', true);
                }
                // else if(e=="3-2"){
                //     this.$router.push('/register');
                // }

                else if(e=="3-1") {//个人中心
                    this.$router.push('/center');
                }
                else if(e=="3-2") {//推送列表
                    this.$router.push('/daily');
                }
                else if(e=="3-3") {//退出按钮
                    localStorage.removeItem('userId');
                    this.showLoginMethod();
                    this.$router.push('/');
                }
                else if(e == "1"){
                    this.$router.push('/');
                }
                else if(e == "2"){
                    this.$router.push('/ticket');
                }
                else if(e == "4"){
                    this.$router.push('/schedule');
                }
                // else if(e == "5-1"){
                //     this.$router.push('/monit');
                // }
                else if(e == "5"){
                    this.$router.push('/order');
                }
                else if(e == "6"){
                    this.$router.push('/center/notice');
                }
            },

            //判断用户是否登录，展示不一样的用户中心menu
            showLoginMethod: function(){
                var orderId = localStorage.getItem('userId');

                if(orderId){
                    this.showLogin = false;
                    this.getUserInfo();//获取用户消息条数 //获取头像
                }else{
                    this.showLogin = true;
                }
            },


            //获取用户未读消息的条数+头像
            getUserInfo: function(){
                var that = this;

                // 获取用户头像
                this.$http({
                    method: 'get',
                    url: this.$comjs.IP+'/user/getphoneemail',
                })
                    .then(response => {
                        var data = response.data;

                        if(response.code == 200){
                            that.url = data.avatar;
                            this.$store.commit('changeInfoNum', parseInt(data.unRead));
                        }

                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },

        },
        watch:{
            $route(to,from){
                var that = this;
               var path = to.path;
               var fromPath = from.path;
               var paths = to.path.split('/')[1];

               if(path == '/'){
                   this.$nextTick(()=>{
                       that.menu = "1";
                       that.$refs.menu.updateActiveName();
                   });
               }
               else if(path == '/ticket'){
                   this.$nextTick(()=> {
                       that.menu = "2";
                       that.$refs.menu.updateActiveName();
                   });
               }
               else if(path == '/center'||(paths =="center"&&to.path.split('/')[2]!='notice')){
                   this.$nextTick(()=> {
                       that.menu = "3-3";
                       that.$refs.menu.updateActiveName();
                   });
               }
               else if(path == '/schedule'){
                   this.$nextTick(()=> {
                       that.menu = "4";
                       that.$refs.menu.updateActiveName();
                   });
               }
               else if(path == '/order'){
                   this.$nextTick(()=> {
                       that.menu = "5";
                       that.$refs.menu.updateActiveName();
                   });
               }
               else if(path == '/center/notice'){
                   this.$nextTick(()=> {
                       that.menu = "6";
                       that.$refs.menu.updateActiveName();
                   });
               }
               else{
                   this.$nextTick(()=> {
                       that.menu = "";
                       that.$refs.menu.updateActiveName();
                   });
               }
               // if(path == '/'&&fromPath == '/login'){
               //      this.showLoginMethod();
               //  }

            },

        },

    }
</script>
<style>
   .ivu-modal-footer{
       border-top: none!important;
       padding-top: 0!important;
  }
   .ivu-modal-body{padding-bottom: 0!important;}
</style>

<style  scoped lang="scss">
    @import '../assets/style/_variables';
    .header{
        @extend .global_width;
        background: #fff;
        box-shadow: 0 2px 2px rgba(0,0,0,0.2);
    }
    .header>div  {
        float: left;
        /*width: 150px;*/
    }
    .header>div.logo {
        float: left;
        width: 30%;
    }
    .header>div.logo>a{
        display: inline-block;
        width: 150px;
        height: 60px;
        color: $Title;
    }
    .logo img{
        width: 50px;
        height: 50px;
        margin: 5px 10px;
        float: left;
    }
    .logo span {
       font-size: 18px;
       font-weight: bold;
    }

    .header>div.nav{
        float: right;
        width: 70%;
    }

    .header>div.logo{
        height: 60px;
        line-height: 60px;
    }
    .ivu-menu-item a{
        color: $Content;
        display: inline-block;
        width: 100%;
    }
    .ivu-menu-item.ivu-menu-item-active a{
       color: $primaryColor;
    }
    .bottomTab{
        width: 90%;
        margin: 10px auto 0;
        font-size: 14px;
        cursor: pointer;
    }
    .link{
        width: 60px;
        cursor: pointer;
        margin: 5px 0;
        color:$DarkPrimayColor;
    }

    .portrait>img{
        width: 40px;
        border-radius: 50%;
        margin-top: 10px;
        margin-right: 10px;
        float: left;
    }
</style>
