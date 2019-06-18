<template>
    <div class="detail">
        <div class="searchBody">
            <Card >
                <div class="tab">
                    <Search @submitInfo="sumbit" :code1Name="code1" :code2Name="code2"  :city1Name="city1" :city2Name="city2"  :Date="startDate" :airlineN="airline" :seat="seat" :flightNum="flightNum" :civilType="civil"></Search>
                </div>
            </Card>
        </div>

        <div class="dataerror"  v-if="!realTime" style="margin-bottom: 20px;">
            <Alert type="error" show-icon>实时数据请求失败，请重新查询！</Alert>
        </div>

        <div class="searchContent">
            <!--标题-->
          <div class="title">
              <Row>
                  <Col span="4">航班信息</Col>
                  <Col span="6">起飞时间</Col>
                  <Col span="6">到达时间</Col>
                  <Col span="4">舱位信息</Col>
                  <Col span="4">操作</Col>
              </Row>
          </div>
            <!--查询结果-->
          <div v-if="!showLoading">
                <div class="list" v-for="item in list">
                    <Row align="middle">
                        <Col span="4" >
                            <div class="airline">
                                <b>{{item.airLineShortName}}</b>
                                <span>{{item.flightNo}}</span>
                            </div>
                        </Col>
                        <Col span="12">
                            <Row>
                                <Col span="4" >
                                    <div class="airlineTime">
                                        <b>{{item.departureTime}}</b>
                                        <span>{{item.depCityName}}</span>
                                    </div>
                                </Col>
                                <Col span="7">
                                    <div class="time">
                                        {{item.flightDate}}
                                    </div>
                                    <img src="../assets/images/arrow.png"  alt="">
                                </Col>
                                <Col span="4" align="center">
                                    <div class="airlineTime">
                                        <b>{{item.arrivalTime}}</b>
                                        <span>{{item.arrCityName}}</span>
                                    </div>
                                </Col>
                            </Row>

                        </Col>
                        <Col span="4" >
                            <div class="seat">
                                <b>{{item.cabLevel}}</b>
                                <span>{{item.description=='票量充足'?item.description:'余票'+item.description+'张'}}</span>
                            </div>
                        </Col>
                        <Col span="4" >
                            <Button type="primary" icon="ios-alarm"  v-on:click="addTicket(item.id,item.code,item.civil)" :disabled="item.hasReserve||(item.id==submitId)">添加监控</Button>
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

          <div v-if="!Resault" style="margin-bottom: 10px;">
              <Alert type="warning">没有搜索到该信息！</Alert>
          </div>
        </div>

        <!--<Modal v-model="modalNum"-->
               <!--@on-ok="selectNumTrue"-->
               <!--@on-cancel="selectNumFalse"-->
               <!--:loading="loading"-->
               <!--title="提交监控票数">-->
            <!--<div>-->
                <!--<span style="font-size: 16px;padding-right: 20px;">票数:</span>-->
                <!--<InputNumber :min="1" v-model="num"></InputNumber>-->
            <!--</div>-->
        <!--</Modal>-->

        <Modal v-model="modalNum" :mask-closable="false" :closable="false" title="提交监控票数">
            <div slot="footer">
                <Button type="text" size="large" @click="selectNumFalse">取消</Button>
                <Button type="primary" size="large" @click="selectNumTrue" :class="{'ivu-btn-loading':submitLoading}">
                    <Icon type="ios-loading demo-loading" v-if="submitLoading"/>
                    确定
                </Button>
            </div>
            <div>
                <span style="font-size: 16px;padding-right: 20px;">票数:</span>
                <InputNumber :min="1" v-model="num"></InputNumber>
            </div>
        </Modal>

    </div>
</template>

<script>
    import Search from './../views/SearchflightNum';
    export default {
        name: "Main",
        data () {
            return {
                theme1: 'light',  //主题颜色控制
                list: [],
                city1:'',
                city2:'',
                code1:'',
                code2:'',
                startDate:'',
                airline:'',
                seat:'',
                flightNum:'',
                civil: 0,

                showLoading: false,
                Resault: true,

                modalNum: false,//展示添加监控对话框
                submitLoading: false,//确认按钮显示loading

                //提交监控需要的参数
                submitId: '',
                submitCivil: '',
                submitSeat:'',
                num:1,

                realTime: true
            }
        },
        components: {
            Search,
        },
        created() {
            this.getInfo()
        },
        methods: {
            //提交表格
            sumbit:function(val){
                var arr = decodeURIComponent(val).split("/");
                var code1 = arr[0];
                var code2 = arr[1];
                var seats = arr[2];
                var startdate = arr[3];
                var civil = arr[4];
                var airline = arr[7];
                var flightNum = arr[8];
                this.startDate = startdate;
                this.airline = airline;
                this.flightNum = flightNum;
                this.civil = civil;
                this.seat = seats;
                this.code1= code1;
                this.code2 = code2;

                this.showLoading = true;

                this.list = [];
                this.axios(code1,code2,seats,startdate,civil,airline,flightNum);
            },

            //获取url参数
            getInfo:function(){
                var str = this.$route.params.str.split('/');
                var code1 = str[0];
                var code2 = str[1];
                var startdate = str[3];
                var seats = str[2];
                var civil = str[4];
                var city1 = str[5];
                var city2 = str[6];
                var airline = str[7];
                var flightNum = str[8];
                // var code1 = str.code1;
                // var code2 = str.code2;
                // var startdate = str.startdate;
                // var seats = str.seats;
                // var civil = str.civil;
                // var city1 = str.city1;
                // var city2 = str.city2;
                // var airline = str.airline;
                // var flightNum = str.flightNum;

                this.city1 = city1;
                this.city2 = city2;
                this.code1 = code1;
                this.code2 = code2;
                this.seat = seats;
                this.civil = civil;
                this.startDate = startdate;
                this.airline = airline;
                this.flightNum = flightNum;
                this.showLoading = true;

                this.axios(code1,code2,seats,startdate,civil,airline,flightNum);
            },

            //请求后端数据
            axios:function(code1,code2,seats,startdate,civil,airline,flightNumber){
                var that = this;
                // this.list = [];
                this.$http({
                    url: this.$comjs.IP+'/air/querySevenAirInfo',
                    method: 'post',
                    data: {
                        departureAirport: code1,
                        arrivalAirport: code2,

                        single: 1,
                        civil: civil,

                        airline:airline,

                        flightNo: flightNumber,
                        backFlightNo: flightNumber,

                        code: seats,
                        backCode: seats,

                        departureFlightDateStart: startdate,
                        arrivalFlightDateStart: startdate,
                    },
                })
                    .then(response => {
                        that.showLoading = false;

                        if(response.data.goAirLineList.length==0){
                            that.Resault = false;
                        }else{
                            that.Resault = true;
                            that.list = response.data.goAirLineList;
                        }
                        that.realTime = response.data.real;

                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },


            // 刷新子组件
            refreshChild () {
                this.refresh = false;
                setTimeout(() => {
                    this.refresh = true
                },0)
            },


            //添加订单监控
            addTicket(id, seat, civil) {
                this.modalNum = true;
                this.submitId = id;
                this.submitSeat = seat;
                this.submitCivil = civil;
                this.num = 1;
                // console.log(id, seat, civil);
            },

            //提交监控订单
            selectNumTrue: function(){
                var id = this.submitId;
                var civil = this.submitCivil;
                var seat = this.submitSeat;
                var num = this.num;
                this.submitLoading = true;

                this.$http({
                    url: this.$comjs.IP + '/monitor/add',
                    method: 'post',
                    data: {
                        code: seat,
                        id: id,
                        num: num,
                        civil: civil,
                        formId: ''
                    }
                })
                    .then(response => {
                        if(response.code == 200){
                            var code1 = this.code1;
                            var code2 = this.code2;
                            var seats = this.seat;
                            var startdate = this.startDate;
                            var civil = this.civil;
                            var airline = this.airline;
                            var flightNum = this.flightNum;
                            // 刷新页面
                            this.axios(code1, code2, seats, startdate, civil,airline,flightNum);
                            this.submitLoading = false;
                            this.modalNum = false;
                            this.$Notice.success({
                                desc: '提交成功',
                                duration: 3
                            });

                        }
                        else{//提交失败 提交失败，请重新提交
                            this.$Notice.error({
                                desc: '提交失败，请重新提交!',
                                duration: 3
                            });
                        }

                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },

            //取消提交订单  并关闭窗口
            selectNumFalse:function(){
                this.submitId = '';
                this.modalNum = false;
            }
        }
    }
</script>

<style scoped lang="scss">
    @import '../assets/style/_variables';
    @import '../assets/style/_airlines';
    .detail{
        position: relative;
        padding-top: 5px;
    }

    .searchBody{
        width: 100%;
        margin: 10px 0;
    }

    .search{
        position: relative;
    }

    .dropdown {
        width: 100%;
        position: absolute;
        will-change: top, left;
        transform-origin: center bottom 0;
        top: 33px;
        left: 0;
    }


</style>
