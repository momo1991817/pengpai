<template>
    <div class="menber">
        <!--用户会员以及购买-->
        <div class="menber-payment-title" style="margin: 0 0 8px;">VIP会员</div>
        <Card>

            <div class="menber-payment clearfix">
                <div class="menber-list clearfix" v-for="(item,index) in viplist">
                    <div class="menber-img" :class="'menber-v'+index">
                        <div class="menber-content-title">{{item.memberName}}/月</div>

                        <div class="menber-num">
                            <div class="menber-num-price"><span>￥</span>{{item.preferential}}</div>
                            <div class="menber-num-preprice"><s>原价{{item.price}}</s></div>
                        </div>

                        <div class="btn" @click="payment(item.memberRank)">
                            <span>
                               {{item.submitName}}
                                <!--<script>{{index}}==0?'试用15天，立即开通':'立即开通'</script>-->
                            </span>
                            <Icon type="ios-arrow-forward" />
                        </div>
                    </div>
                </div>

                <!--<div class="menber-list clearfix">-->
                    <!--<div class="menber-img menber-v1">-->
                        <!--&lt;!&ndash;<img src="../../assets/images/v1.png" alt="">&ndash;&gt;-->
                        <!--<div class="menber-content-title"> 入门版</div>-->
                        <!--<div class="menber-num">-->
                            <!--<div class="menber-num-price">100/月</div>-->
                            <!--<div class="menber-num-preprice"><s>原价300/月</s></div>-->
                        <!--</div>-->
                        <!--<div class="btn"  @click="payment(1)">-->
                            <!--<span>立即开通</span>-->
                            <!--<Icon type="ios-arrow-forward" />-->
                        <!--</div>-->
                    <!--</div>-->

                <!--</div>-->

                <!--<div class="menber-list clearfix" >-->
                    <!--<div class="menber-img menber-v2">-->
                        <!--&lt;!&ndash;<img src="../../assets/images/v2.png" alt="">&ndash;&gt;-->
                        <!--<div class="menber-content-title"> 基础版</div>-->
                        <!--<div class="menber-num">-->
                            <!--<div class="menber-num-price">200/月</div>-->
                            <!--<div class="menber-num-preprice"><s>原价600/月</s></div>-->
                        <!--</div>-->
                        <!--<div class="btn" @click="payment(2)">-->
                            <!--<span>立即开通</span>-->
                            <!--<Icon type="ios-arrow-forward" />-->
                        <!--</div>-->
                    <!--</div>-->

                <!--</div>-->

                <!--<div class="menber-list clearfix" >-->
                    <!--<div class="menber-img menber-v3">-->
                        <!--&lt;!&ndash;<img src="../../assets/images/v3.png" alt="">&ndash;&gt;-->
                        <!--<div class="menber-content-title"> 高级版</div>-->
                        <!--<div class="menber-num">-->
                            <!--<div class="menber-num-price">300/月</div>-->
                            <!--<div class="menber-num-preprice"><s>原价800/月</s></div>-->
                        <!--</div>-->
                        <!--<div class="btn" @click="payment(3)">-->
                            <!--<span>立即开通</span>-->
                            <!--<Icon type="ios-arrow-forward" />-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</div>-->
            </div>
        </Card>

        <!--我的会员特权-->
        <div v-if="vipMenber">
            <div class="menber-payment-title">我的会员特权</div>
            <div class="myPower" >
                <div class="myPower-content clearfix">
                    <div class="myPower-list" v-for="item in vipMenberlist">
                        <div class="img">
                            <img :src="item.url" alt="">
                        </div>
                        <div class="myPower-title" v-if="item.query_one">
                            余票查询<br>（单天<span >{{item.info}}</span>）
                        </div>
                        <div class="myPower-title" v-else>
                            {{item.info}}
                        </div>
                    </div>
                </div>
            </div>
        </div>



        <!--会员权限介绍-->
        <div class="menber-payment-title">会员特权对比</div>
        <div class="menber-detail">

            <div class="power">

                <!--会员产品对应特权标题-->
                <div class="vip-power-list clearfix">
                    <div class="vip-header-title">项目</div>
                    <!--<div class="vip-title-list" v-for="(item,idx) in powerTitle">-->
                    <!--<div :class="['menber-title','menber-v'+idx]">{{item}}</div>-->
                    <!--</div>-->
                    <div class="vip-title-list menber-v0">入门版</div>
                    <div class="vip-title-list menber-v1">基础版</div>
                    <div class="vip-title-list menber-v2">高级版</div>
                </div>

                <!--会员产品-->
                <div class="vip-content-list clearfix">
                    <div class="vip-header-title">余票查询</div>
                    <div class="vip-title-list">当天</div>
                    <div class="vip-title-list">当天/前后7天</div>
                    <div class="vip-title-list">当天/前后7天</div>
                </div>
                <div class="vip-content-list clearfix">
                    <div class="vip-header-title">预警监控（条）</div>
                    <div class="vip-title-list">50</div>
                    <div class="vip-title-list">150</div>
                    <div class="vip-title-list">300</div>
                </div>

                <div class="vip-content-list clearfix">
                    <div class="vip-header-title">热门航线查询（天）</div>

                    <div class="vip-title-list">60</div>
                    <div class="vip-title-list">60</div>
                    <div class="vip-title-list">90</div>
                </div>

                <div class="vip-content-list clearfix">
                    <div class="vip-header-title">美联航升舱（前后7天）</div>
                    <div class="vip-title-list"><Icon type="ios-close-circle" color="#ff9900" size="20"/></div>

                    <div class="vip-title-list"><Icon type="ios-close-circle" color="#ff9900" size="20"/></div>

                    <div class="vip-title-list"><Icon type="md-checkmark-circle" color="#2b85e4" size="20"/></div>
                </div>

                <div class="vip-content-list clearfix">
                    <div class="vip-header-title">日程管理</div>

                    <div class="vip-title-list"><Icon type="md-checkmark-circle" color="#2b85e4" size="20"/></div>

                    <div class="vip-title-list"><Icon type="md-checkmark-circle" color="#2b85e4" size="20"/></div>

                    <div class="vip-title-list"><Icon type="md-checkmark-circle" color="#2b85e4" size="20"/></div>
                </div>

            </div>
        </div>



        <!--<div class="menber-detail">-->

            <!--<div class="power powerlist">-->

                <!--&lt;!&ndash;会员产品对应特权标题&ndash;&gt;-->
                <!--<div class="vip-power-list clearfix">-->
                    <!--<div class="vip-header-title">项目</div>-->
                    <!--&lt;!&ndash;<div class="vip-title-list" v-for="(item,idx) in powerTitle">&ndash;&gt;-->
                    <!--&lt;!&ndash;<div :class="['menber-title','menber-v'+idx]">{{item}}</div>&ndash;&gt;-->
                    <!--&lt;!&ndash;</div>&ndash;&gt;-->
                    <!--<div class="vip-title-list">-->
                        <!--<div class="menber-title menber-v1">入门版</div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-list">-->
                        <!--<div class="menber-title menber-v2">基础版</div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-list">-->
                        <!--<div class="menber-title menber-v3">高级版</div>-->
                    <!--</div>-->
                <!--</div>-->

                <!--&lt;!&ndash;会员产品&ndash;&gt;-->
                <!--<div class="vip-content-list clearfix">-->
                    <!--<div class="vip-header-title">余票查询</div>-->

                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">当天</div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">当天/前后7天</div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">当天/前后7天</div>-->
                    <!--</div>-->
                <!--</div>-->
                <!--<div class="vip-content-list clearfix">-->
                    <!--<div class="vip-header-title">预警监控（条）</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">50</div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">150</div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">300</div>-->
                    <!--</div>-->
                <!--</div>-->

                <!--<div class="vip-content-list clearfix">-->
                    <!--<div class="vip-header-title">热门航线查询（天）</div>-->

                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">60</div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">60</div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre">90</div>-->
                    <!--</div>-->
                <!--</div>-->

                <!--<div class="vip-content-list clearfix">-->
                    <!--<div class="vip-header-title">美联航升舱（前后7天）</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre"><Icon type="ios-close-circle" color="#ff9900" size="20"/></div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre"><Icon type="ios-close-circle" color="#ff9900" size="20"/></div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre"><Icon type="md-checkmark-circle" color="#2b85e4" size="20"/></div>-->
                    <!--</div>-->
                <!--</div>-->

                <!--<div class="vip-content-list clearfix">-->
                    <!--<div class="vip-header-title">日程管理</div>-->

                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre"><Icon type="md-checkmark-circle" color="#2b85e4" size="20"/></div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre"><Icon type="md-checkmark-circle" color="#2b85e4" size="20"/></div>-->
                    <!--</div>-->
                    <!--<div class="vip-title-circle">-->
                        <!--<div class="vip-title-squre"><Icon type="md-checkmark-circle" color="#2b85e4" size="20"/></div>-->
                    <!--</div>-->
                <!--</div>-->

            <!--</div>-->
        <!--</div>-->

        <!--会员叠加购买-->
        <!--<Card>-->
            <!--<div class="menber-payment-title">VIP会员叠加包</div>-->
            <!--<div class="menber-payment clearfix">-->
                <!--<div class="menber-list clearfix">-->
                    <!--<div class="menber-img menber-v1">-->
                        <!--<div class="menber-content-title"> 入门版</div>-->
                        <!--<div class="menber-num">-->
                            <!--<div class="menber-num-price">100元/100条</div>-->
                            <!--<div class="menber-num-price">200元/300条</div>-->
                        <!--</div>-->
                    <!--</div>-->

                <!--</div>-->

                <!--<div class="menber-list clearfix" >-->
                    <!--<div class="menber-img menber-v2">-->
                        <!--<div class="menber-content-title"> 基础版</div>-->
                        <!--<div class="menber-num">-->
                            <!--<div class="menber-num-price">100元/100条</div>-->
                            <!--<div class="menber-num-price">200元/300条</div>-->
                        <!--</div>-->

                    <!--</div>-->

                <!--</div>-->

                <!--<div class="menber-list clearfix" >-->
                    <!--<div class="menber-img menber-v3">-->
                        <!--<div class="menber-content-title"> 高级版</div>-->
                        <!--<div class="menber-num">-->
                            <!--<div class="menber-num-price">100元/150条</div>-->
                            <!--<div class="menber-num-price">200元/500条</div>-->
                        <!--</div>-->

                    <!--</div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</Card>-->

        <Modal v-model="modal1" width="360"  :closable="false"  @on-cancel="closeLogin" class-name="weChatPay">
            <div >
                <div class="head">
                    <div class="title clearfix">
                        <div class="img">
                            <img src="../../assets/images/weChat.png" alt="">
                        </div>
                        <!--微信支付-->
                        <div class="headtitle">
                            <b v-if="showPay">微信支付</b>
                            <b v-else>支付成功</b>
                            <br>
                            <span>WechatPay</span>
                        </div>
                    </div>


                    <div class="icon" v-on:click="closeLogin">
                        <Icon type="ios-close" size="28"/>
                    </div>
                </div>
                <div class="QRcode" v-if="!showPayResult">
                    <qriously :value="value" :size="size" :backgroundAlpha="backgroundAlpha"/>
                    <div class="payInfo">
                        用微信扫码付款
                    </div>
                </div>

                <div class="payOver" v-else>
                    <!--<div class="ok" v-if="!error">-->
                        <!--<Icon type="md-checkmark-circle" color="#19be6b" size="50"/>-->
                    <!--</div>-->
                    <!--<div class="error" v-else>-->
                        <!--<Icon type="ios-close-circle" color="#ed4014" size="50"/>-->
                    <!--</div>-->
                    <div class="message">
                        {{message}}
                    </div>
                    <div class="dollor" v-if="!error">
                        ${{money}}
                    </div>
                </div>

            </div>
            <div slot="footer">

            </div>
        </Modal>

    </div>


</template>

<script>
    export default {
        name: "Menber",
        data(){
            return {
                modal1: false,
                // 可以自定义，必填项。
                value: '',
                // 二维码大小 默认 100
                size: 200,
                // 背景透明度，默认透明 0
                backgroundAlpha: 1,

                // orderId: '', //用户支付的ID
                money: 0, //用户支付时的价钱

                showPayResult: false, //是否显示支付结果
                message: '', //支付结果提醒
                error: false, //是否提醒错误
                showPay: true, //显示微信支付标题   false则显示支付成功
                vipMenber: false, //用户是否是会员

                viplist: [],  //会员产品列表
                vipMenberlist: [], //用户会员特权产品,


                powerList: {},
                powerTitle: [],  //vip会员所有的等级  试用版、入门版、基础版
                powerVip: [],   //vip会员对应的产品列表  余票查询、日程管理
            }
        },
        created(){
            this.getVipContent();   //获取会员产品
            this.getUserInfo(); //获取用户的会员特权

        },
        methods: {
            // ****支付
            payment:function(e){
                var num = e;
                this.showPayResult = false;

                var that = this;

                this.$http({
                    url: this.$comjs.IP+'/WXPay/wxQueryPayStatus?memberRank='+num,
                    method: 'get',
                    data: {},
                })
                .then(response =>{
                    var url = response.data.code_url;
                    that.value = url;
                    // that.orderId = response.data.out_trade_no;
                    that.money = response.data.total_fee;
                    that.modal1 = true;
                    that.judgePay(response.data.out_trade_no);

                });

                // var time = setInterval(function(){
                //
                // },1000);
            },

            //******获取会员产品  如试用版、入门版 +价钱
            getVipContent: function(){
                var that = this;
                // 会员产品 用户可以购买
                this.$http({
                    url: this.$comjs.IP+'/user/memberList',
                    method: 'get',
                    data: {},
                })
                .then(response =>{
                    if(response.code == 200){
                        var data = response.data,list=[];
                        for(var i=0,l=data.length;i<l;i++){
                            list.push(
                              {
                                  memberName: data[i].memberName,
                                  memberRank: data[i].memberRank,
                                  preferential: data[i].preferential,
                                  price: data[i].price,
                                  submitName: '立即开通'
                              }
                            )
                        }
                        that.viplist = list;
                    }

                });


                // // 会员对应的权限 列表
                // this.$http({
                //     url: this.$comjs.IP+'/user/mapByMemberId',
                //     method: 'get',
                //     data: {},
                //   })
                //     .then(response =>{
                //         if(response.code == 200){
                //
                //             var data = response.data,
                //                 arr=[],
                //                 powerVip =[], //会员产品数组
                //                 powerTitle=[]; //会员等级数组
                //             for(var index in data){
                //                 arr = data[index];
                //                 powerVip.push(index);
                //             }
                //             for(var i=1,l=arr.length;i<l;i++){
                //                 powerTitle.push(arr[i].name);
                //             }
                //             this.powerTitle = powerTitle;
                //             this.powerVip = powerVip;
                //             that.powerList = data;
                //         }
                //         // console.log(response);
                //     })
            },

            //获取用户的会员特权内容 当前是不是会员 会员特权内容  会员条数
            getMenberInfo:function(){
                var that = this;


                this.$http({
                    url: this.$comjs.IP+'/user/listByUserId',
                    method: 'get',
                    data: {},
                })
                    .then(response =>{
                        if(response.code == 200){
                            var data = response.data.userMemberPermissionsVOS;
                            var arr =[];
                           if(data[0].permissionsSign != 'ticket_query_seven'){
                                arr.push({query_one: true,url:require('../../assets/images/ticket.png'),info:''});
                            }
                            for(var i=0,l=data.length;i<l;i++){
                                // if(data[i].permissionsSign == 'ticket_query_one'){
                                //     arr.push({query_one: true,url:require('../../assets/images/ticket.png'),info:''});
                                // }
                                if(data[i].permissionsSign == 'ticket_query_seven'){
                                    arr.push({query_one: true,url:require('../../assets/images/ticket.png'),info:'&前后7天'});
                                }
                                else if(data[i].permissionsSign == 'monitoring_50'){
                                    arr.push({query_one: false,url:require('../../assets/images/jiankong.png'),info:data[i].name});
                                }
                                else if(data[i].permissionsSign == 'monitoring_150'){
                                    arr.push({query_one: false,url:require('../../assets/images/jiankong.png'),info:data[i].name});
                                }
                                else if(data[i].permissionsSign == 'monitoring_300'){
                                    arr.push({query_one: false,url:require('../../assets/images/jiankong.png'),info:data[i].name});
                                }
                                else if(data[i].permissionsSign == 'monitoring_-1'){
                                    arr.push({query_one: false,url:require('../../assets/images/jiankong.png'),info:data[i].name});
                                }
                                else if(data[i].permissionsSign == 'ua_cabin_3'){
                                    arr.push({query_one: false,url:require('../../assets/images/seat.png'),info:data[i].name});
                                }
                                else if(data[i].permissionsSign == 'day_manage'){
                                    arr.push({query_one: false,url:require('../../assets/images/schedule.png'),info:data[i].name});
                                }
                                else if(data[i].permissionsSign == 'airline_push_30'){
                                    arr.push({query_one: false,url:require('../../assets/images/hotaline.png'),info:data[i].name});
                                }
                                else if(data[i].permissionsSign == 'airline_push_60'){
                                    arr.push({query_one: false,url:require('../../assets/images/hotaline.png'),info:data[i].name});
                                }
                                else if(data[i].permissionsSign == 'airline_push_90'){
                                    arr.push({query_one: false,url:require('../../assets/images/hotaline.png'),info:data[i].name});
                                }
                            }
                            that.vipMenberlist = arr;
                        }
                    })
            },

           //判断用户是否是会员   是再调用其特权
            getUserInfo:function(){
                var that = this;
                this.$http({
                    method: 'get',
                    url: this.$comjs.IP+'/user/getphoneemail',
                })
                    .then(response => {
                        var data = response.data;

                        if(response.code == 200){
                            if(data.flag){
                               that.getMenberInfo();
                                that.vipMenber = true;
                            }else{
                                that.vipMenber = false;
                            }
                        }})
            },



           //关闭支付窗口
            closeLogin: function(){
                this.modal1 = false;
            },

             //调用二维码支付
            judgePay: function(id){
                // var id = this.orderId;
                var that = this;
                this.$http({
                    url: this.$comjs.IP+'/WXPay/wxNativePayPayOrder?out_trade_no='+id,
                    method: 'get',
                })
                    .then(response =>{

                        that.showPayResult = true;
                        if(response.data.aboolean){
                            that.error = false;
                            that.showPay = false;
                            that.message = '澎湃旅行';
                        }else{
                            that.error = true;
                            that.showPay = true;
                            that.message = response.data.message;
                        }
                    })
            },
        }

    }
</script>

<style scoped lang="scss">
    @import '../../assets/style/_variables';

    .menber{
        padding-top: $topMenu;
    }
    .menber-payment-title{
        @extend .global-title;
        color: $DarkPrimayColor;
        margin-top: 30px;
        margin-bottom: 0;
        font-weight: bold;
    }

    .menber-payment-title:before {
        @extend .global_b_bar;
    }

    .menber-payment .menber-list{
        width: 220px;
        float: left;
        text-align: center;
        color:#C9963C;
        border: 1px solid $Border;
        border-radius: 5px;
    }
    .menber-payment .menber-list:not(:first-child){
        margin-left: 2.6666666%;
    }
   .menber-img{
       border-radius: 5px;
       padding: 5px;
       -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
       box-sizing: border-box;
   }
    .menber-num-price{
        font-size: 24px;
        font-weight: bold;
    }
    .menber-num-price span{font-size: 18px;}
    .menber-num-preprice{
        font-size: 14px;
    }
    .menber-num>div{
        margin-top: 3px;
    }

    .btn{
        height: 30px;
        line-height: 30px;
        border-radius: 15px;
        /*background: rgba(0,0,0,0.2);*/
        cursor: pointer;
        margin-top: 2px;
        background: rgba(0,0,0,.2);
        color:#fff;
        /*box-shadow:0 0 10px #fddb81*/
    }

    .menber-title{
        height: 40px;
        line-height: 40px;
        width: 50px;
        margin: 0 auto;
        text-align: center;
        color: $Title;
        font-weight: bold;
    }

    .menber-v0{
        background: linear-gradient(to bottom right,#F2D66A,#FAF5D6);
        background:  -moz-linear-gradient(to bottom right,#F2D66A,#FAF5D6);
        background: -webkit-linear-gradient(to bottom right,#F2D66A,#FAF5D6);
    }
    .menber-v1{
        background: linear-gradient(to bottom right,#5C6C8E,#E7E8EA);
        background: -moz-linear-gradient(to bottom right,#5C6C8E,#E7E8EA);
        background: -webkit-linear-gradient(to bottom right,#5C6C8E,#E7E8EA);
    }
    .menber-v2{
        background: linear-gradient(to bottom right,#C2A267,#F5EDC9);
        background: -moz-linear-gradient(to bottom right,#C2A267,#F5EDC9);
        background: -webkit-linear-gradient(to bottom right,#C2A267,#F5EDC9);
    }
    .menber-v3{
        background: linear-gradient(to bottom right,#000000,#E7E8EA);
        background: -moz-linear-gradient(to bottom right,#000000,#E7E8EA);
        background: -webkit-linear-gradient(to bottom right,#000000,#E7E8EA);
    }
    /*.menber-v3{color: #F8D292;}*/


    .menber-content-title{
        color:$Title;

    }

    /****支付窗口样式****/
    .head{
        margin-bottom: 10px;
        font-size: 16px;
        text-align: center;
        position: relative;
    }
    .head .icon{
        position: absolute;
        top: 10px;
        right: 10px;
    }
    .head >div.title{
        width: 150px;
        margin: 0 auto;
    }
    .head >div>div{
        float: left;
    }
    .head img{
        width: 50px;
        height: 50px;
    }
    .head .headtitle{margin-left: 10px;}
    .head .headtitle>b{
        font-size: 20px;
    }
    .head .headtitle>span{
        font-size: 14px;
    }
   .QRcode{
       width: 200px;
       margin: 0 auto;
   }
   .QRcode .payInfo{
       text-align:center;
       font-size: 14px;
   }

    .payOver {
        text-align: center;
        font-size: 18px;
    }
    .payOver .dollor{
        font-weight: bold;
        font-size: 20px;
    }
    /**************************我的特权列表**********************/
    .myPower-content>.myPower-list{
        float: left;
        width: calc((100% - 100px)/5);
        text-align: center;
        background: #fff;
        height: 120px;
        padding: 10px;
        border: 1px solid $Border;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;


    }
    .myPower-content>.myPower-list:not(:last-child){
        margin-right: 25px;
    }
    .myPower-content>.myPower-list>.img{
        width: 50px;
        height: 50px;
        margin: 0 auto 10px;
        background: #E5C185;
        border-radius: 50%;
    }
    .myPower-content>.myPower-list>.img img{
        width: 50px;
        height: 50px;
    }
    .myPower-title{
        padding: 2px 0;
        color: #495060;
    }

    /*********************会员特权产品对比***********************/
    .menber-detail,.myPower{
        margin: 15px 0;
    }

    .vip-header-title, .vip-title-list{
        border-top: 2px solid $bg;
        border-right: 2px solid $bg;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .menber-detail{
        background: #fff;
        border-left: 2px solid $bg;
        border-bottom: 2px solid $bg;
    }
    .vip-content-list>div, .vip-power-list>div{
        float: left;
    }
    .vip-power-list{background: #E9E9E9;}
    .vip-power-list,.vip-content-list{
        height: 50px;
        /*border-bottom: 1px solid #dddee1;*/
        /*border-left: 1px solid #dddee1;*/
        /*border-right: 1px solid #dddee1;*/
    }
    .vip-power-list>div.vip-header-title,
    .vip-power-list>div.vip-title-list{
        font-weight: bold;
    }

    .vip-power-list>div.vip-header-title,
    .vip-power-list>div.vip-title-list,
    .vip-content-list>div.vip-header-title,
    .vip-content-list>div.vip-title-list{
        height: 50px;
        line-height: 50px;
        text-align: center;
    }

  .vip-power-list>div.vip-header-title,
  .vip-content-list>div.vip-header-title{
        width: 34%;
    }
  .vip-power-list>div.vip-title-list,
  .vip-content-list>div.vip-title-list{
        width: 22%;
    }

    .powerlist{
        width: 100%;
    }



</style>
