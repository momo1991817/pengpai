<template>
    <div class="register">
        <Modal v-model="modal2" width="360" :closable="false">
            <div>
                <div class="header" align="center" style="margin-bottom: 10px; font-size: 16px;">
                    注册
                    <div class="icon" v-on:click="closeLogin">
                        <Icon type="ios-close" size="24"/>
                    </div>
                </div>
                <Form :model="formRegister" ref="formRegister" :rules="ruleRegister">
                    <FormItem prop="user">
                        <Input v-model="formRegister.user" type="text" prefix="md-phone-portrait" placeholder="手机号码"></Input>
                    </FormItem>
                    <FormItem prop="code">
                        <Row :gutter="16">
                            <Col span="16" >
                                <Input v-model="formRegister.code" placeholder="验证码"></Input>
                            </Col>

                            <Col span="8" >
                                <Button type="primary" style="width: 100%">获取验证码</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem prop="password">
                        <Input v-model="formRegister.password" type="password"  prefix="md-lock" placeholder="设置登录密码"></Input>
                    </FormItem>

                    <FormItem prop="passwdCheck">
                        <Input v-model="formRegister.passwdCheck" type="password"  prefix="md-lock" placeholder="再次输入登录密码"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" long  @click="bindSubmit('formRegister')">注册</Button>
                    </FormItem>
                </Form>
                <a href="javascript:void(0)"  v-on:click="changeTab('login')"><Icon type="ios-arrow-back" />登录</a>
            </div>
            <div slot="footer">
                <!--<Button type="primary" size="large"  long >注册</Button>-->
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: "Register",
        data() {
            //手机号验证规则
            var  validateuser = function(rule, value, callback){
                if(!value){
                    return callback(new Error("帐号不能为空"));
                }else if(!(/^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(value))){
                    return callback(new Error("请输入正确是手机号码"))
                }else{
                    callback();
                }
            };
            //密码验证规则
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('密码不能为空'));
                } else {
                    if (this.formRegister.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formRegister.validateField('passwdCheck');
                    }
                    if(value.length<6){
                        callback(new Error('密码不能小于6位数'));
                    }
                    callback();
                }
            };
            //重新输入密码的验证规则
            var validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入您的密码'));
                } else if (value !== this.formRegister.password) {
                    callback(new Error('两次密码不一致!'));
                } else {
                    callback();
                }
            };

            return {
                modal2: true,
                formRegister:{
                    user: '',
                    password: '',
                    passwdCheck:'',
                    code:''
                },
                //验证注册表单
                ruleRegister: {
                    user: [
                        {validator: validateuser,trigger: 'blur'},
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '验证码不能为空', trigger: 'blur' }
                    ]
                },
            }
        },
        created(){
            // console.log('header');
        },
        methods:{

            //用户点击登录注册方式切换事件
            changeTab:function(val){
                if(val=='login'){
                  this.$router.push('/login');
                }
            },
           //提交表单
            bindSubmit(name) {
                var that = this;
                // console.log(this.$refs[name]);
                this.$refs[name].validate((valid) => {
                    console.log(valid);
                    if (valid) {
                        if(name=="formLogin"){//登录
                            var user = this.$refs[name].model.user;
                            var pwd = this.$refs[name].model.password;
                            this.$http({
                                url:this.$comjs.IP+'/user/sign-in',
                                method: 'post',
                                data: {
                                    userId: user,
                                    password: pwd,
                                },
                            }) .then(response => {
                                localStorage.setItem('userId',response.data);
                                that.modal1 = false;
                            })
                                .catch(error => {
                                    console.log(error);
                                    this.errored = true
                                })
                                .finally(() => this.loading = false);
                        }

                    } else {
                        this.$Notice.error({
                            desc:  '出错了',
                            duration: 3
                        });
                    }
                })
            },

            //关闭登录窗口
            closeLogin:function(){
                console.log('关闭');
                this.modal1 = false;
                this.$router.go(-1);
            },
        },
    }
</script>

<style scoped>
    .icon{
        float: right;
        cursor: pointer;
    }
</style>
