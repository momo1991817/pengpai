<template>
    <Card>
        <div class="header">
            <b></b>{{title}}邮箱
        </div>
        <!--<Divider orientation="left">修改邮箱</Divider>-->
        <div class="change">
            <Form :model="formEmail" ref="formEmail" :rules="ruleEmail">
                <FormItem prop="email">
                    <Input v-model="formEmail.email" type="text" prefix="md-mail" placeholder="邮箱"></Input>
                </FormItem>


                <FormItem>
                    <Button type="primary"  @click="bindSubmit('formEmail')">修改</Button>
                </FormItem>
            </Form>
        </div>
    </Card>

</template>

<script>
    export default {
        name: "ChangeEmail",
        data(){
            var  validateEmail = function(rule, value, callback){
                var reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
                if(!value){
                    return callback(new Error("邮箱不能为空"));
                }else if(!(reg).test(value)){
                    return callback(new Error("请输入正确邮箱"))
                }else{
                    callback();
                }
            };
            return {
                title:'绑定',
                type: 0,//绑定0还是修改1
                formEmail:{
                    email: ''
                },
                ruleEmail: {
                    email: [
                        {validator: validateEmail,trigger: 'blur'},
                    ]
                },
            }
        },
        created() {
            this.load();
        },
        methods:{
            //加载页面时
            load:function(){
                var id = this.$route.params.email;
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
                                that.formEmail.email = data.email;
                            }

                        })
                        .catch(error => {
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => this.loading = false);
                }
            },

            //提交表单
            bindSubmit(name) {
                this.$refs[name].validate((valid) => {
                    var email = this.$refs[name].model.email;
                    var type = this.type;
                    if (valid) {
                        var that = this;
                        if(type == 0){//绑定
                            this.$http({
                               url:  this.$comjs.IP+'/user/binding',
                               method: 'post',
                               data: {
                                   email: email
                               }
                            })
                                .then(response => {
                                    if(response.code == 200){
                                        this.$Message.success('绑定邮箱成功!');
                                        setTimeout(function(){
                                           that.$router.push('/center');
                                        },1000);

                                    }
                                    else{
                                        this.$Message.error('绑定邮箱失败，请重新绑定!');
                                    }

                            })
                                .catch(error => {
                                    console.log(error);
                                    this.errored = true
                                })
                                .finally(() => this.loading = false);

                        }else{//修改
                           this.$http({
                               url: this.$comjs.IP+"/user/updateemail",
                               method:'post',
                               data:{email: email}
                           }).then(response => {
                               if(response.code == 200){
                                   this.$Message.success('修改邮箱成功!');
                                   setTimeout(function(){
                                       that.$router.push('/center');
                                   },1000);

                               }
                               else{
                                   this.$Message.error('修改邮箱失败，请重新绑定!');
                               }

                           })
                             .catch(error =>{})
                             .finally()
                        }

                    } else {
                        this.$Message.error('请按要求填写!');
                    }
                })
            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../../assets/style/variables";

    .header{
        @extend .global-title;
    }
    .header>b {
        @extend .global_b_bar;
    }
</style>
