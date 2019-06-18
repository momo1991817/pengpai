<template>
    <div class="info" >
        <Card style="width:100%">
            <div class="header">
                <Row>
                    <Col span="2">
                        <div class="icons">
                            <img :src="url" alt="" v-if="url!=''">
                            <img src="../../assets/images/head.png" alt="" v-else>
                        </div>
                    </Col>

                    <Col span="6" align="left" style="margin-left: 10px;">
                        <div class="username">
                            <div v-if="vipmenber">
                                <!--<img src="../../assets/images/menberVip.png" alt="" >-->
                                {{user}}
                                <span class="menberName">{{menberName}}</span>
                            </div>
                            <div v-else>{{user}}</div>

                        </div>
                        <div class="menber">
                            <div v-if="vipmenber">
                               <span>监控预警次数剩余<b style="color:#ed3f14;">{{remainNum}}</b>条</span>
                            </div>
                            <div v-else>
                                <span>您还不是会员</span>
                            </div>
                        </div>

                    </Col>
                </Row>
            </div>
        </Card>

        <div class="infoBody">

            <Card>
                <!--帐号-->
                <Row class="list">
                    <Col span="3" align="left" class="list-title">
                        帐号
                    </Col>
                    <Col span="19" align="left" class="list-content">
                        {{userId}}
                    </Col>
                    <!--<Col span="2" align="right" class="list-operate">绑定</Col>-->
                </Row>

                <!--手机号-->
                <Row class="list">
                    <Col span="3" align="left" class="list-title">
                        手机号
                    </Col>
                    <Col span="19" align="left" class="list-content">
                        {{phone}}
                    </Col>
                    <Col span="2" align="right" class="list-operate">
                        <!--<router-link :to="{name:'ChangePhone',params:{type:phoneType}}">{{phoneName}}</router-link>-->
                    </Col>
                </Row>

                <!--邮箱-->
                <Row class="list">
                    <Col span="3" align="left" class="list-title">
                       邮箱
                    </Col>
                    <Col span="19" align="left" class="list-content">
                        {{email}}
                    </Col>
                    <Col span="2" align="right" class="list-operate">
                        <router-link :to="{name:'ChangeEmail',params:{email:emailType}}"> {{emailName}}</router-link>
                    </Col>
                </Row>



                <!--所属公司-->
                <Row class="list">
                    <Col span="3" align="left" class="list-title">
                       公司名称
                    </Col>
                    <Col span="19" align="left" class="list-content">
                        {{company}}
                    </Col>
                    <Col span="2" align="right" class="list-operate">
                        <router-link to="/center/changeCompany">  {{companyName}}</router-link>
                    </Col>
                </Row>

            </Card>
        </div>

    </div>
</template>

<script>
    export default {
        name: "Infomation",
        data(){
            return {
                phone: '',
                email: '',
                user: '',
                userId: '',
                url: '',
                company: '',

                emailName:'',
                emailType: 0, //1表示已经绑定 0 表示未绑定
                phoneName:'',
                phoneType: 0,//1表示已经绑定 0 表示未绑定
                companyName: '',

                vipmenber: false,  //是否是会员
                remainNum: 0, //会员剩余条数
                menberName: '',//会员名称
            }
        },
        created(){
            this.getData();
        },
        methods: {
            getData:function(){
                var that = this;
                this.$http({
                    method: 'get',
                    url: this.$comjs.IP+'/user/getphoneemail',
                 })
                    .then(response => {
                        var data = response.data,emailName = '',phoneName = '',companyName = '';

                        if(response.code == 200){
                            that.phone = data.telephone;
                            that.email = data.email;
                            that.url = data.avatar;
                            that.company = data.companyName;
                            that.userId  = data.id;
                            if(data.email==''||data.email== null){
                                emailName = '绑定';
                                that.emailType = 0;
                            }else{
                                emailName = '修改';
                                that.emailType = 1;
                            }
                            if(data.phone == ''||data.phone==null){
                                phoneName = '绑定';
                                that.phoneType = 0;
                            }else{
                                phoneName = '修改';
                                that.phoneType = 1;
                            }
                            if(data.companyName == ''||data.companyName == null||data.companyName == '绑定'){
                                companyName = '绑定';

                            }else if(data.companyName == '审核未通过'){
                                companyName = '重新绑定';
                            }
                            else{
                                companyName = '';
                            }
                            // if(data.companyName == ''){
                            //     companyName = '绑定';
                            // }else{
                            //     companyName = '修改';
                            // }
                            that.emailName = emailName;
                            that.phoneName = phoneName;
                            that.companyName = companyName;
                            that.user = data.nickname;
                            that.vipmenber = data.flag;
                            that.menberName = data.memberName;
                            that.remainNum = data.remainValue;
                        }

                })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);

            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/style/_variables';
  .info{
       padding-top: $topMenu;
  }
  .header img,.icons {
      width: 80px;
      height: 80px;
  }
  .menber,.info-title,.username {
      height: 40px;
      line-height: 40px;
  }
    .username img{
        width: 18px;
        height: 18px;
        margin-top: 10px;
        float: left;
    }
    .username .menberName{
        display: inline-block;
        height: 24px;
        line-height: 24px;
        border-radius: 12px;
        background:#FFCD94;
        color:#572100;
        padding: 0 8px;

    }

  .menber>div{
      height: 25px;
      line-height: 25px;
      width: 100%;
      margin-top: 7px;
  }
  .infoBody{
     margin-top: 10px;
  }

  .infoBody .list{
      padding: 8px 0;
  }
    .list-title{
        color: #808695;
    }
    .list-operate>a{
        color: $error;
        width: 100%;
        cursor: pointer;
    }
    .list-content,.list-title,.list-operate{
        height: 21px;
    }

    .username div{
        font-size: 20px;
    }
    .username div span{
        font-size: 14px;
    }
</style>
