<template>
    <Card>
        <div class="header">
            <b></b>{{title}}手机号码
        </div>
        <div class="change">
            <Form :model="formPhone" ref="formPhone" :rules="ruleRegister">
                <FormItem prop="user">
                    <Input v-model="formPhone.user" type="text" prefix="md-phone-portrait" placeholder="手机号码"></Input>
                </FormItem>

                <FormItem prop="code">
                    <Row :gutter="16">
                        <Col span="21" >
                            <Input v-model="formPhone.code" placeholder="验证码"></Input>
                        </Col>

                        <Col span="3" >
                            <Button type="primary" style="width: 100%" v-on:click="getCode">{{codeName}}</Button>
                        </Col>
                    </Row>
                </FormItem>

                <FormItem>
                    <Button type="primary"  @click="bindSubmit('formPhone')">{{title}}</Button>
                </FormItem>
            </Form>
        </div>
    </Card>

</template>

<script>
    export default {
        name: "ChangePhone",
        data(){
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
                title:'绑定',
                type: 0,
                codeName:'获取验证码' ,
                totalTime: 100,

                formPhone:{
                    user: '',
                    code:''
                },
                //验证注册表单
                ruleRegister: {
                    user: [
                        {validator: validateuser,trigger: 'blur'},
                    ],
                    code: [
                        { required: true, message: '验证码不能为空', trigger: 'blur' }
                    ]
                },
            }
        },
        created(){
            this.load();
        },
        methods:{
            //加载页面时
            load:function(){
                var id = this.$route.params.type;
                this.type = id;
                if(id == 0){
                    this.title = '绑定';
                }
                else{
                    this.title = '修改';
                    var that = this;
                    this.$http({
                        method: 'get',
                        url: this.$comjs.IP+'/user/getphoneemail',
                    })
                        .then(response => {
                            var data = response.data;

                            if(response.code == 200){
                                that.formPhone.user = data.telephone;
                            }

                        })
                        .catch(error => {
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => this.loading = false);
                }
            },

            //获取手机验证码
            getCode:function(){
                var phone = this.formPhone.user;
                console.log(phone);
                this.$http({
                    url: this.$comjs.IP +"/user/send/"+phone,
                    method: 'get',
                });
               this.countDown();
            },

            //提交表单
            bindSubmit(name) {
                this.$refs[name].validate((valid) => {
                    var phone = this.$refs[name].model.user;
                    var code = this.$refs[name].model.code;
                    var type = this.type;
                    if (valid) {
                        var that = this;
                        if(type == 0){//绑定
                            this.$http({
                                url:  this.$comjs.IP+"/user/update",
                                method: 'post',
                                data: {
                                    telephone: phone,
                                    code: code,
                                }
                            })
                                .then(response => {
                                    if(response.code == 200){
                                        this.$Message.success('绑定手机号码成功!');
                                        setTimeout(function(){
                                            that.$router.push('/center');
                                        },1000);
                                    }

                                })
                                .catch(error => {
                                    console.log(error);
                                    this.errored = true
                                })
                                .finally(() => this.loading = false);

                        }else{//修改
                            this.$http({
                                url:  this.$comjs.IP+"/user/updatephone",
                                method: 'post',
                                data: {
                                    telephone: phone,
                                    code: code,
                                }
                            })
                                .then(response => {
                                    if(response.code == 200){
                                        this.$Message.success('修改手机号码成功!');
                                        setTimeout(function(){
                                            that.$router.push('/center');
                                        },1000);

                                    }

                                })
                                .catch(error => {
                                    console.log(error);
                                    this.errored = true
                                })
                                .finally(() => this.loading = false);
                        }

                    } else {
                        this.$Message.error('请按要求填写!');
                    }
                })
            },

            // 倒计时函数
            countDown:function(){
                var num = this.totalTime;
                this.codeName = num+'s';
                var that = this;
                var timer = setInterval(function(){
                    num--;
                    that.codeName = num+'s';
                    if(num == 0){
                        clearInterval(timer);
                        that.codeName = '重新获取';
                    }
                },1000);
            },

        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/style/variables";
    .change{
        /*width: 340px;*/
    }
    .header{
        @extend .global-title;
    }
    .header>b {
        @extend .global_b_bar;
    }
</style>
