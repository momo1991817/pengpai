<template>
    <div class="detail" >
        <Card>
            <div class="card">
                <div class="detail-title">
                    <span>订单详情</span>
                    <div class="btn">
                        <!--<Button type="info" v-on:click="goBack">返回</Button>-->
                    </div>
                </div>

                <!--订单步骤-->
                <div class="detail-speed">
                    <Card>
                        <Steps :current="current">
                            <Step title="提交订单" :content="orderDate"></Step>
                            <Step title="监控中" :content="monitDateTime"></Step>
                            <Step title="监控失败" :content="finishDate" v-if="!successOrFail"></Step>
                            <Step title="已经完成" :content="finishDate" v-else></Step>
                        </Steps>
                    </Card>
                </div>

                <!--订单信息-->
                <div class="detail-list">
                    <Card>
                        <div class="header">
                            订单信息
                        </div>
                        <div>
                            <Row>
                                <Col span="6" >
                                    订单编号：{{orderId}}
                                </Col>

                                <Col span="6" >
                                    订单类型：{{orderType}}
                                </Col>

                                <Col span="6" >
                                    订单状态：{{orderStatus}}
                                </Col>

                                <Col span="6" v-if="solution!=''">
                                    备注：{{solution}}
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </div>

                <!--航线信息-->
                <div class="detail-list">
                    <Card>
                        <div class="header">
                            航线信息
                        </div>
                        <div class="searchContent">
                            <div class="title">
                                <Row>
                                    <Col span="4">航班信息</Col>
                                    <Col span="6">起飞时间</Col>
                                    <Col span="6">到达时间</Col>
                                    <Col span="4">舱位信息</Col>
                                    <Col span="4" v-if="!type">监控结果</Col>
                                </Row>
                            </div>

                            <div class="list">
                                <Row align="middle">
                                    <Col span="4" >
                                        <div class="airline">
                                            <b>{{airline}}</b>
                                            <span>{{airlineNum}}</span>
                                        </div>
                                    </Col>
                                    <Col span="12">
                                        <Row>
                                            <Col span="5" >
                                                <div class="airlineTime">
                                                    <b>{{leaveTime}}</b>
                                                    <span>{{city1}}</span>
                                                </div>
                                            </Col>
                                            <Col span="5">
                                                <div class="time">
                                                    {{leaveDate}}
                                                </div>
                                                <img src="../../assets/images/arrow.png"  alt="">
                                            </Col>
                                            <Col span="6" align="center">
                                                <div class="airlineTime">
                                                    <b>{{arrivalTime}}</b>
                                                    <span>{{city2}}</span>
                                                </div>
                                            </Col>
                                        </Row>

                                    </Col>
                                    <Col span="4" >
                                        <div class="seat">
                                            <b>{{space}}</b>
                                            <span v-if="!type">{{orderDone?'完成时余票数':'余票'}}{{ticketNum}}张</span>
                                        </div>
                                    </Col>
                                    <Col span="4" align="left" v-if="!type">
                                        <div class="seat">
                                            <b>实时监控{{monitorNum}}次</b>
                                            <span>{{personNum}}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </Card>
                </div>

                <!--监控结果-->
                <div class="detail-list" v-if="type">
                    <Card>
                        <div class="header">
                            监控结果
                        </div>
                        <div>
                            <Row>
                                <Col span="6">
                                    <div class="seat">
                                        <p>监控完成余票数：<span>{{ticketNum}}</span>张</p>
                                    </div>
                                </Col>
                                <Col span="6" >
                                    实时监控次数：{{monitorNum}}次
                                </Col>

                            </Row>
                            <!--<Row>-->
                                <!--<Col span="24" >-->
                                    <!--<div class="seat">-->
                                         <!--<p>监控完成余票数：<span>{{ticketNum}}</span>张</p>-->
                                    <!--</div>-->
                                <!--</Col>-->
                            <!--</Row>-->
                            <Row>
                                <Col span="24" >
                                    <div class="seat">
                                        <p>监控到降舱情况：<span>{{personNum}}</span></p>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </div>


                <!--备注操作   重新提交订单-->
                <div class="detail-list" v-if="success&&solution==''">
                    <Card>
                        <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="selectItem">
                            <MenuItem name="1">
                                备注
                            </MenuItem>
                            <MenuItem name="2">
                                继续监控
                            </MenuItem>
                        </Menu>
                        <div v-if="name == 1" style="margin-top: 15px;">
                            <Select v-model="editReason" >
                                <Option value="-1">请选择</Option>
                                <Option value="0">舱位报错</Option>
                                <Option value="1">有位置没有运价</Option>
                                <Option value="2">有运价不合适</Option>
                                <Option value="3">其他</Option>
                            </Select>
                            <div v-if="editReason == '3'" style="margin-top: 10px;">
                                <Input v-model="textarea" type="textarea" :autosize="{minRows: 3}" placeholder="请编辑"></Input>
                            </div>

                            <div style="margin-top: 10px;text-align: right;">
                                <Button type="primary" @click="bindEdit">提交</Button>
                            </div>
                        </div>
                        <div v-else style="margin-top: 15px;">

                            <div>
                                <Input v-model="ReSubmitSeat" placeholder="A-Z舱位"></Input>
                            </div>

                            <div style="margin-top: 10px;text-align: right;">
                                <Button type="primary" @click="bindReSubimitSeat">提交</Button>
                            </div>

                        </div>
                        <!--<Tabs value="name1">-->
                            <!--<TabPane label="备注" name="name1">-->
                               <!---->
                            <!--</TabPane>-->
                            <!--<TabPane label="继续监控" name="name2" v-if="type==1">-->

                            <!--</TabPane>-->
                        <!--</Tabs>-->
                        <!--<div class="header">-->
                            <!--备注-->
                        <!--</div>-->
                        <!--<div>-->
                            <!--<div>-->
                              <!--<Input v-model="textarea" type="textarea" :autosize="{minRows: 3}" placeholder="请编辑"></Input>-->
                            <!--</div>-->

                            <!--<div style="margin-top: 10px;text-align: right;">-->

                               <!--<Button type="primary" @click="bindEdit">提交</Button>-->

                            <!--</div>-->
                        <!--</div>-->
                    </Card>
                </div>
            </div>


        </Card>
    </div>

</template>

<script>
    export default {
        name: "Detail",
        data(){
            return {
                airline:'',
                airlineNum:'',
                city1: '',
                city2:'',

                startdate: '',
                orderDate: '', //下单时间 年月日

                orderDateStamp:'',//下单时间时间戳
                finishDate: '', //结束时间
                monitorNum: '',//监控次数
                orderStatus: '',//订单状态
                orderType: '',//订单类型
                orderDone: true,

                orderId: '', //订单号

                space:'', //舱位
                ticketNum:'',//票数
                personNum: '',//人数

                arrivalTime: '',
                leaveDate:'',
                leaveTime:'',
                type: 0, //0为免票 1 为降舱

                successOrFail: true, //是监控成功true还是监控失败false
                current: 0,
                monitDateTime: '',//监控中显示的时间

                solution: '', //用户是否有备注
                textarea: '',//备注信息

                success: false,//订单是否是监测成功订单
                ReSubmitSeat:'',//降舱重新提交舱位
                editReason: '-1',//备注选择情况

                theme1: 'light',
                name: '1'
            }
        },
        created() {
            this.getData();
        },
        methods: {
            //获取订单数据
            getData:function(){
              var id = this.$route.params.id;
              // console.log(id);
              var that = this;
              this.$http({
                  method: 'get',
                  url: this.$comjs.IP+"/monitor/detail/"+id,
              })
                  .then(response => {
                      var data = response.data;
                      var startDate= that.timestampDate(data.departureFlightDate);
                      var orderDate = that.timestampDate(data.createTime);
                      var finishDate = that.timestampDate(data.updateTime);
                      var type='';
                     data.type==0?type='余票订单':type='降舱订单';
                      if(data.status == 0){
                          that.orderStatus = '监控中';
                          that.orderDone = false;
                          that.current = 1;
                          that.monitDateTime = that.timestampDate(new Date().getTime());
                          that.finishDate = '';

                      }
                      else if(data.status == 1){
                          that.orderStatus = '已完成';
                          that.orderDone = true;
                          that.current = 2;
                          that.finishDate = finishDate;
                      }
                      that.airline = data.airLineShortName;
                      that.airlineNum = data.flightNo;
                      that.city1 = data.depCityName;
                      that.city2 = data.arrCityName;
                      that.space = data.level=='升舱'? data.code+data.level:data.type==0?data.level:data.code+'舱';
                      that.ticketNum = data.remain;
                      that.personNum = data.type==0?'需求人数'+data.count+'人':data.remark;
                      that.startdate = startDate;
                      that.orderDate = orderDate;
                      that.orderDateStamp = data.createTime;

                      that.orderId = data.id;
                      that.monitorNum = data.monitorNum;
                      that.arrivalTime = data.arrivalTime;
                      that.leaveDate = startDate.split(' ')[0];
                      that.leaveTime = startDate.split(' ')[1];
                      that.orderType = type;

                      that.type = data.type;
                      that.solution = data.solution;

                      that.success = data.success == 4?true:false;

                      // that.successOrFail
                      if(data.success == '4'&&data.status == 1){
                          that.successOrFail = true;
                      }else if(data.success =="3"&&data.status == 1){
                          that.successOrFail = false;
                      }else if(data.success =="3"&&data.status == 0){
                          that.successOrFail = true;
                      }
                      // console.log(data.startDate.split(' ')[1]);

                  })
                  .catch(error => {
                      console.log(error);
                      this.errored = true
                  })
                  .finally(() => this.loading = false);
            },

            //用户编辑
            bindEdit: function(){
                var that = this;
                var val = this.editReason,text='';
                if(val == '-1'){
                    text = '';
                }
                else if(val == '0'){
                    text = '舱位报错';
                }
                else if(val == '1'){
                    text='有位置没有运价';
                }
                else if(val == '2'){
                  text='有运价不合适';
                }
                else if(val == '3'){
                  text=this.textarea;
                }

                if(text==''){
                    this.$Message.error('请选择备注内容');
                }else{
                    this.$http({
                        url: this.$comjs.IP +"/monitor/handleOrder",
                        method: 'post',
                        data: {
                            id : this.orderId ,
                            solution :text,
                            userId: '1234567890'
                        }
                    })
                        .then(response => {
                            if(response.code == 200){
                                this.$Notice.info({
                                    title: '编辑成功！',
                                });
                                that.getData();
                            }else{
                                this.$Notice.error({
                                    desc: response.msg
                                });
                            }

                        })
                        .catch(error => {
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => this.loading = false);
                }


            },

            //用户重新提交降舱功能
            bindReSubimitSeat: function(){
                var orderId = this.$route.params.id;
                var seat = this.ReSubmitSeat.toUpperCase();
                var that = this;
                this.$http({
                    url: this.$comjs.IP +"/monitor/reMonitorDownCab",
                    method: 'post',
                    data: {
                        id : orderId ,
                        formId :'',
                        code: seat
                    }
                })
                    .then(response => {
                        if(response.code == 200){
                            this.$Notice.info({
                                title: '重新提交成功！',
                            });
                            that.getData();
                        }else{
                            this.$Notice.error({
                                desc: response.msg
                            });
                        }

                    })
            },


            //导航切换
            selectItem:function(val){
               this.name = val;
            },

            // 时间戳转时间函数 2019-04-01 18:09
            timestampDate: function(timestamp){
                var now = new Date(timestamp);
                var year=now.getFullYear();
                var month=now.getMonth()+1;
                var date=now.getDate();
                var hour=now.getHours();
                var minute=now.getMinutes();

                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (date >= 0 && date <= 9) {
                    date = "0" + date;
                }
                if (hour >= 0 && hour <= 9) {
                    hour = "0" + hour;
                }
                if (minute >= 0 && minute <= 9) {
                    minute = "0" + minute;
                }
                return year + "-" + month + "-" + date+" "+hour+":"+minute;
            },

            //
            goBack:function(){
                this.$router.go(-1);
            }

        },

    }
</script>

<style scoped lang="scss">
    @import '../../assets/style/_variables';
    @import '../../assets/style/_airlines';

    .detail{
        padding-top: $topMenu;
    }

    .card{
        margin-bottom: 60px;
    }

    .detail-title {
        height: 32px;
        line-height: 32px;
    }
    .detail-title .btn{
        float: right;
    }
    .detail-speed{
        margin: 20px 0;
    }
    .detail-list{
        margin-top: 20px;
        border-top: 2px solid $DarkPrimayColor;
        background: $SubColor;
    }
    .detail-list .header{
        color: $info;
    }
    .searchContent >  .list{margin: 0;}
    .detail-title span:before{
        @extend .global_b_bar;
        margin-top: 7px;
    }

    .seat p>span{
        color: $error;
        display: inline;
    }
</style>
