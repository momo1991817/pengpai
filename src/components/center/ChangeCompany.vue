<template>
    <Card>
        <div class="header">
            <b></b>{{title}}公司
        </div>
        <div class="change">
            <Form :model="formCompany" ref="formCompany" :rules="ruleCompany">
                <FormItem prop="company">
                    <!--<Input v-model="formCompany.name" type="text" prefix="md-phone-portrait" placeholder="公司" v-show="false"></Input>-->
                    <Select v-model="formCompany.company" filterable placeholder="请选择或搜索公司">
                        <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>

                <FormItem>
                    <Button type="primary"  @click="bindSubmit('formCompany')">{{title}}</Button>
                </FormItem>
            </Form>
        </div>

        <div class="company-list">
            <div class="title">
                热门公司
            </div>
            <div class="content-list">
                <div class="list" v-for="item in companylist" :data-id="item.id" :data-name="item.companyName" v-on:click="getCompanySubmit">
                    {{item.companyName}}
                </div>
            </div>
        </div>
    </Card>
</template>

<script>
    export default {
        name: "ChangeCompany",
        data(){
            return {
                title:'绑定',

                formCompany:{
                    company: '',
                },
                //验证注册表单
                ruleCompany: {
                    company: [
                        { required: true, message: '公司名称不能为空！', trigger: 'blur' }
                    ]
                },
                companylist: [],
                cityList: [],

            }
        },
        created(){
            this.getData();
        },
        methods: {
            //获取查询信息
            getData:function(){
                var that = this;
                //获取所有公司信息
                this.$http({
                    url: this.$comjs.IP+'/user/getAllCompanyByName',
                    methods: 'get',
                })
                    .then(response => {
                        var data = response.data;
                        var list = [];
                        for(var i=0,l=data.length;i<l;i++){
                            list.push({value:data[i].id,label: data[i].companyName})
                        }
                        that.cityList = list;
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);

                //获取热门的五家公司
                this.$http({
                    url: this.$comjs.IP+'/user/userIfBindingCompany',
                    methods: 'get',
                })
                    .then(response => {
                        that.companylist = response.data;
                        // console.log(data);
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },

            //列表提交
            getCompanySubmit:function(e){
                var id = e.toElement.dataset.id;
                this.submitCompany(id);
            },
            //提交到数据库
            submitCompany:function(id){
                this.$http({
                    url: this.$comjs.IP+'/user/userBindingCompany',
                    method: 'post',
                    data: {
                        id: id
                    }
                }) .then(response => {
                    console.log(response);
                    if(response.code == 200){
                        this.$Message.success('绑定成功!');
                    }
                })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },

            //提交表单
            bindSubmit(name) {
                this.$refs[name].validate((valid) => {
                    var id = this.$refs[name].model.company;
                    if (valid) {
                      this.submitCompany(id);

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
    .company-list{
        margin-top: 10px;
    }
    .content-list>.list {
        float: left;
        width: 19%;
        background: #ccc;
        padding: 10px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        border-radius: 2px;
        text-align: center;
        cursor: pointer;
    }
    .content-list>.list:first-child{
        margin-left: 0.5%;
    }
    .content-list>.list:last-child{
        margin-right: 0.5%;
    }
    .content-list>.list:not(:last-child){
        margin-right:1%;
    }

    .company-list>.content-list:after{
        content:'';
        display: block;
        clear: both;
    }
    .content-list{
        margin-top: 10px;
    }
</style>
