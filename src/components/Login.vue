<template>
    <div class="login">
        <Modal v-model="modal1" width="360"   :closable="false"  @on-cancel="closeLogin">
            <div >
                <div class="header" align="center" style="margin-bottom: 10px; font-size: 16px;">
                    登录
                    <div class="icon" v-on:click="closeLogin">
                        <Icon type="ios-close" size="24"/>
                    </div>
                </div>
                <Form ref="formLogin" :model="formLogin" :rules="ruleLogin"  >
                    <FormItem  prop="user">
                        <Input v-model="formLogin.user" type="text" prefix="ios-contact" placeholder="用户名/手机帐号"></Input>
                        <!--<Input v-model="formLogin.user" type="text" prefix="ios-contact" placeholder="手机号码"></Input>-->
                    </FormItem>
                    <FormItem v-if="!Codelogin" prop="password">
                        <Input v-model="formLogin.password" type="password"  prefix="md-lock" placeholder="密码"></Input>
                    </FormItem>

                    <FormItem v-else prop="code">
                        <Row :gutter="16">
                            <Col span="16" >
                                <Input v-model="formLogin.code" type="text" placeholder="验证码"></Input>
                            </Col>

                            <Col span="8" >
                                <Button type="primary" style="width: 100%">获取验证码</Button>
                            </Col>
                        </Row>
                    </FormItem>

                    <FormItem>
                        <Button type="primary" size="large" long  @click="bindSubmit('formLogin')">提交</Button>
                        <div class="bottomTab" align="center" v-if="!Codelogin">


                            <!--用户用手机号码可以登录的话-->
                            <!--<Row>-->
                            <!--<Col span="7" ><div v-on:click="changeTab('code')">动态码登录</div></Col>-->
                            <!--<Col span="1">|</Col>-->
                            <!--<Col span="7"><div v-on:click="changeTab('register')">注册帐号</div></Col>-->
                            <!--<Col span="1">|</Col>-->
                            <!--<Col span="7" v-on:click="changeTab('pwd')">忘记密码</Col>-->
                            <!--</Row>-->
                        </div>

                        <div class="link" align="left"  v-else v-on:click="changeTab('login')">
                            <Icon type="ios-arrow-back" /><span>帐号登录</span>
                        </div>
                    </FormItem>
                    <!--<a href="javascript:void(0)" v-on:click="changeTab('register')"><Icon type="ios-arrow-back" />注册帐号</a>-->
                </Form>

            </div>
            <div slot="footer">

            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "Login",
        inject: ['reload'],
        data() {
            //手机号验证规则
            var  validateuser = function(rule, value, callback){
                if(!value){
                    return callback(new Error("帐号不能为空"));
                }else if(!(/^1[34578]\d{9}$/.test(value))){
                    return callback(new Error("请输入正确是手机号码"))
                }else{
                    callback();
                }
            };

            return {
                modal1: true,

                Codelogin: false,
                screenHeight: 0,//高度适应

                formLogin: {
                    user: '',
                    password: '',
                    code:'',
                },
                //验证登录表单
                ruleLogin: {
                    //用于用户手机帐号登录
                    // user: [
                    //     {validator: validateuser,trigger: 'blur'},
                    // ],
                    user: [{ required: true, message: '帐号不能为空', trigger: 'blur' }],//用于用户用userId登录
                    password: [
                        { required: true, message: '密码不能为空.', trigger: 'blur' },
                        {  min: 6, message: '密码不小于6位数', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '验证码不能为空', trigger: 'blur' }
                    ]
                },

            }
        },
        mounted () {
            this.getScreenHeight();
        },
        methods: {
            //用户点击登录或者注册出现相应的弹出框

            //用户点击登录注册方式切换事件
            changeTab:function(val){
                if(val=='code'){//手机验证码登录
                    this.Codelogin = true;
                }
                else if(val=='register'){//注册
                  this.$router.push('/register');
                }
                else if(val=='login'){//帐号登录
                    this.Codelogin = false;
                }
            },

            bindSubmit(name) {
                var that = this;
                // console.log(this.$refs[name]);
                this.$refs[name].validate((valid) => {
                    // console.log(valid);
                    if (valid) {
                        if(name=="formLogin"){//登录
                            var user = this.$refs[name].model.user;
                            var pwd = this.$refs[name].model.password;var type = '';
                            if(user.length == 11&&(/^[1][3,4,5,7,8][0-9]{9}$/.test(user))){
                                type = 1;
                            }else{type = 0}
                            this.$http({
                                url:this.$comjs.IP+'/user/sign-in-phone',
                                method: 'post',
                                data: {
                                    loginType: type, //0是用户名，1是手机号
                                    phone: user,
                                    password: pwd,
                                },
                            }) .then(response => {
                                var userId = localStorage.getItem('userId');
                               //用户首次使用的话  firstLogin为true,如果用户切换帐号  清楚firstLogin记录

                                if(response.code == 2){
                                    if(userId != response.data){
                                        localStorage.removeItem('firstLogin');
                                    }
                                    else if(localStorage.getItem('firstLogin')==null){
                                        localStorage.setItem('firstLogin',true);
                                    }
                                    localStorage.setItem('userId',response.data);
                                    this.$store.commit('changeUserId',response.data);
                                    // that.modal1 = false;
                                    this.$Notice.success({
                                        desc:  response.msg
                                    });
                                    this.$router.push({name:'home'});
                                    this.$store.commit('changeLoginShow', false);
                                    that.reload();
                                }
                                else if(response.code == -100){
                                    this.$Notice.error({
                                        desc:  response.msg
                                    });
                                }

                            })

                        }

                    } else {
                        this.$Notice.error({
                            desc:  '出错了! '
                        });
                    }
                })
            },

            //关闭登录窗口
            closeLogin:function(){
                // this.modal1 = false;
                // this.$router.go(-1);
                this.$store.commit('changeLoginShow', false);
                this.$router.push({name:'home'});
            },


            //获取屏幕高度
            getScreenHeight: function(){
                var bodyH = (window.innerHeight - 160);
                this.screenHeight = bodyH +'px';

            },
        }
    }
</script>

<style scoped>
  .icon{
      float: right;
      cursor: pointer;
  }
</style>
