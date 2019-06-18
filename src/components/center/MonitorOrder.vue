<template>
    <div class="monitOrder">

        <Card>

            <div class="searchContent">
                <div class="title">
                    <Row>
                        <Col span="4" align="left">下单时间</Col>
                        <Col span="3" align="left">订单类型</Col>
                        <Col span="3" align="left">航班信息</Col>
                        <Col span="4" align="left">起飞时间</Col>
                        <Col span="3" align="left">到达时间</Col>
                        <Col span="3" align="left">舱位信息</Col>
                        <Col span="4" align="left">操作</Col>
                    </Row>
                </div>

                <div v-if="!showLoading">
                    <div class="list" v-for="item in list">
                        <Row align="middle">
                            <Col span="4" align="left">
                                <div class="order-time">
                                  {{item.createTime}}
                                </div>
                            </Col>
                            <Col span="3" align="left">
                                <div class="order-type">
                                    {{item.type==0?'余票订单':'降舱订单'}}
                                </div>
                            </Col>
                            <Col span="3" align="left">
                                <div class="airline">
                                    <b>{{item.airLineShortName}}</b>
                                    <span>{{item.flightNo}}</span>
                                </div>
                            </Col>
                            <Col span="7">
                                <Row>
                                    <Col span="5" align="left">
                                        <div class="airlineTime">
                                            <b>{{item.depTime}}</b>
                                            <span>{{item.depCityName}}</span>
                                        </div>
                                    </Col>
                                    <Col span="9">
                                        <div class="time">
                                            {{item.date}}
                                        </div>
                                        <img src="../../assets/images/arrow.png"  alt="">
                                    </Col>
                                    <Col span="5" align="center">
                                        <div class="airlineTime">
                                            <b>{{item.arrTime}}</b>
                                            <span>{{item.arrCityName}}</span>
                                        </div>
                                    </Col>
                                </Row>

                            </Col>
                            <Col span="3" align="left">
                                <div class="seat">
                                    <b> {{item.seat}}</b>
                                    <span> {{item.ticket}}</span>
                                </div>
                            </Col>
                            <Col span="4">
                                <div class="airline-btn">
                                    <Button type="info" icon="ios-search"  v-on:click="bindOrderClick(item.orderId)">查看</Button>
                                    <Button type="warning" icon="ios-trash-outline"  @click="bindDelect(item.createTimeStamp,item.orderId)">删除</Button>
                                </div>
                            </Col>

                        </Row>
                    </div>
                </div>

                <div class="demo-spin-col list" v-else>
                    <Spin fix>
                        <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                        <div>加载中···</div>
                    </Spin>
                </div>



            </div>

            <div class="page" v-if="total">
                <Page :total="total" show-elevator show-total @on-change="getPage"/>
            </div>

        </Card>

        <!--删除弹窗-->

        <Modal v-model="DelectModal" :mask-closable="false" :closable="false" title="确认删除？">
            <div>
                确定不需要监控该订单？删除后不能恢复！
            </div>

            <div slot="footer">
                <Button type="primary" size="large" @click="bindDelectOK">确定</Button>
                <Button  size="large" @click="bindDelectCancle">取消</Button>
            </div>

        </Modal>

    </div>

</template>

<script>
    export default {
        name: "MonitorOrder",
        data(){
            return {
                list: [],
                total:0,
                showLoading: false,
                screenHeight: 0,//屏幕高度

                DelectModal: false,//显示删除窗口
                delectOrderId: '',//删除的订单ID
            }
        },
        created() {
            this.getDataList(1);
        },

        methods:{

            //获取监控的所有订单
          getDataList:function(page){
              this.showLoading = true;
              var that = this;
              this.$http({
                  url: this.$comjs.IP+'/monitor/list',
                  method: 'post',
                  data: {
                      userId: this.$userId,
                      status: 0,
                      limit: 10,
                      page: page
                  },
              })
                  .then(response => {
                      this.total = parseInt(response.count);
                      if(response.code == 200){
                          var list = [];
                          var data = response.data;

                          for(var i=0,l=data.length;i<l;i++){
                              var d = that.toDate(data[i].departureFlightDate);
                              var t = that.changTime(data[i].departureFlightDate);
                              var createTime = that.timestampDate(data[i].createTime);
                              list.push({
                                  airLineShortName: data[i].airLineShortName,
                                  flightNo:  data[i].flightNo,
                                  depCityName: data[i].depCityName,
                                  arrCityName: data[i].arrCityName,
                                  depTime: t,
                                  arrTime:data[i].arrivalTime,
                                  date: d,
                                  createTime: createTime,
                                  createTimeStamp:data[i].createTime,
                                  ticket: data[i].type==0?'余票'+data[i].remain+'张':'监控中',
                                  seat: data[i].level=='升舱'?data[i].code+data[i].level:data[i].type==0?data[i].level:data[i].code+'舱',
                                  orderId: data[i].id,
                                  type: data[i].type
                              });
                          }
                          that.showLoading = false;
                          that.list = list;

                      }
                  })
                  .catch(error => {
                      console.log(error);
                      this.errored = true
                  })
                  .finally(() => this.loading = false);
          },

         //******start时间函数
            // 时间戳转时间函数  2019-03-29
          toDate: function(timestamp){
                var now = new Date(timestamp);
                var year=now.getFullYear();
                var month=now.getMonth()+1;
                var date=now.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (date >= 0 && date <= 9) {
                    date = "0" + date;
                }
                return year + "-" + month + "-" + date;
            },
          //获取时间  16：19
          changTime: function(time){
                var now = new Date(time);
                var hour=now.getHours();
                var minute=now.getMinutes();

                if (hour >= 0 && hour <= 9) {
                    hour = "0" + hour;
                }
                if (minute >= 0 && minute <= 9) {
                    minute = "0" + minute;
                }

                return hour+':'+minute;
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

            //计算当前时间是否超过下单30分钟
         NowCompareCreate: function(time){
                var nowStamp = new Date().getTime();
                var addTimeStamp = time + 30*60*1000;
                return nowStamp<addTimeStamp;
            },
        //********end

         //切换分页获取不同数据
         getPage: function(e){
              this.getDataList(e);
         },
         //点击订单查看详情
         bindOrderClick:function(id){
             this.$router.push({path:'/order/detail/'+id})
         },
         //用户点击删除
         bindDelect:function(time,id){
            if(!this.NowCompareCreate(time)){
                this.$Notice.error({
                    title: '不能删除！',
                    desc:'订单已提交超过30分钟，不能取消！ '
                });
            }else{
               this.delectOrderId = id;
               this.DelectModal = true;
            }
         },
         //用户确定删除
         bindDelectOK:function(){
             var id = this.delectOrderId;
             var that = this;
             this.$http({
                 url: this.$comjs.IP +"/monitor/cancel/"+id,
                 method: 'get',
             })
                 .then(response => {
                     if(response.code == 200){
                         this.$Notice.info({
                             title: '删除成功！',
                         });
                         that.DelectModal = false;
                         that.getDataList(1);
                     }

                 })
                 .catch(error => {
                     console.log(error);
                     this.errored = true
                 })
                 .finally(() => this.loading = false);
         },

         //用户取消删除
         bindDelectCancle: function(){
             this.delectOrderId = '';
             this.DelectModal = false;
         },


        },
    }
</script>

<style scoped lang="scss">
    @import '../../assets/style/_variables';
    @import '../../assets/style/_airlines';

    .searchContent .list{
        background: $bg;
    }
    .page{
        padding: 5px 0;
    }
    .order-title{
        @extend .global-title;
    }
    .order-title:before {
        @extend .global_b_bar;
    }


</style>
