<template>
    <div class="detail">
        <div class="searchBody">
            <Card >
                <div class="tab" v-if="refresh">
                    <Search @submitInfo="submitAirline" :code1Name="code1" :code2Name="code2" :city1Name="city1" :city2Name="city2" :Date="DateInto" :seat="seat" :civilType="civil"></Search>
                </div>
            </Card>
        </div>

        <div class="calendar">
            <Row align="middle">
                <Col span="1">
                    <div class="border-right arrow-icon" v-bind:class="{disableBtn: disablePrev}" v-on:click="bindPrev">
                        <Icon type="ios-arrow-back" size="20" />
                    </div>

                </Col>
                <Col span="2"  v-for="item in dateList">
                    <div class="border-right" v-bind:class="{'active': item.year==searchDate}" v-on:click="selectTab(item.year)">
                        <div class="date-time" >
                           {{item.date}}
                        </div>
                        <div class="date">
                           {{item.week}}
                        </div>
                    </div>
                </Col>

                <Col span="1">
                    <div class="border-right arrow-icon"  v-on:click="bindNext">
                        <Icon type="ios-arrow-forward" size="20"/>
                    </div>
                </Col>
                <Col span="2">
                    <div class="icon-calendar"  v-on:click="modal = true">
                        <Icon type="md-calendar" size="34" color="#2b85e4"/>
                        <div>日历</div>
                    </div>
                </Col>
            </Row>
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
                                <b>{{item.cabLevel=='升舱'?item.code+item.cabLevel:item.cabLevel}}</b>
                                <span>{{item.description=='票量充足'?item.description:'余票'+item.description+'张'}}</span>
                            </div>
                        </Col>
                        <Col span="4" >
                            <Button type="primary" icon="ios-alarm" v-on:click="addTicket(item.id,item.code,item.civil)" :disabled="item.hasReserve||((item.id==submitId)&&(item.code==submitCode))">添加监控</Button>
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

        <div class="calendar-model">
            <Modal v-model="modal"  :closable="false"  @on-ok="submitDate" width="460">
                <div>
                    <Calendar v-on:choseDay="clickDay"></Calendar>
                </div>

            </Modal>
        </div>

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
   import Calendar from 'vue-calendar-component';
    import Search from './../views/Searchairline';
    export default {
        name: "Main",
        components:{
            Search,
            Calendar
        },
        data () {
            return {
                theme1: 'light',  //主题颜色控制
                list: [],
                city1:'',
                city2:'',
                code1:'',
                code2:'',
                startDate:'',
                seat:'',

                DateInto: '',
                civil: 0,
                num: 1,

                //日历变量
                dateList: [], //日历列表
                endTimeStamp: '',//末尾日期
                disablePrev: false,//监测当前开始日期是不是当天日期，是让pre按钮变色

                //关于搜索结果的字段
                searchDate:'',


                modal: false,//是否弹出日历窗口
                submitLoading: false,
                calendarSelectDate: '',//在日历上选择的日期
                showLoading: true,//用来展示 loading
                refresh: true,//用来刷新子组件
                Resault: true,//用来判断是否有数据，true为搜索有数据
                modalNum: false,//展示添加监控对话框

                //提交监控需要的参数
                submitId: '',
                submitCode: 'A',
                submitCivil: '',
                submitSeat:'',

                realTime: true,
            }
        },
        created() {
            this.getDataFromFlightNum();
            this.getTimeTenTimeStamp(this.searchDate,0);
        },
        methods: {
            //获取搜索结果
            getDataFromFlightNum: function () {
                var str = this.$route.params.str.split('/');

                var code1 = str[0];
                var code2 = str[1];
                var startdate = str[3];
                var seats = str[2];
                var civil = str[4];
                var city1 = str[5];
                var city2 = str[6];

                this.city1 = city1;
                this.city2 = city2;
                this.code1 = code1;
                this.code2 = code2;
                this.seat = seats;
                this.civil = civil;
                this.DateInto = startdate;
                this.searchDate = startdate;

                this.showLoading = true;
                this.list = [];
                this.axios(code1, code2, seats, startdate, civil);
            },

            //请求后端数据
            axios: function (code1, code2, seats, startdate, civil) {
                var that = this;
                // this.list = [];
                this.$http({
                    url: this.$comjs.IP + '/air/queryAirInfo',
                    method: 'post',
                    data: {
                        departureAirport: code1,
                        arrivalAirport: code2,
                        cabLevel: seats,
                        backCabLevel: seats,

                        flightDate: startdate,
                        backFlightDate: startdate,
                        single: 1,
                        civil: civil
                    }
                })
                    .then(response => {
                        if(response.code == 200){
                            if (response.data.goAirLineList.length == 0) {
                                that.Resault = false;
                            } else {
                                that.Resault = true;
                                that.list = response.data.goAirLineList;
                            }
                            that.realTime = response.data.real;
                        }
                        that.showLoading = false;

                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },

            //通过航线搜索
            submitAirline: function (val) {
                var arr = decodeURIComponent(val).split("/");

                var code1 = arr[0];
                var code2 = arr[1];
                var seats = arr[2];
                var startdate = arr[3];
                var civil = arr[4];
                this.showLoading = true;

                this.code1 = code1;
                this.code2 = code2;
                this.city1 = arr[5];
                this.city2 = arr[6];
                this.seat = seats;



                this.axios(code1, code2, seats, startdate, civil);

                this.searchDate = startdate;
                this.getTimeTenTimeStamp(startdate, 0);
            },

            //用户选择日期时
            selectTab: function (date) {
                this.showLoading = true;
                this.list = [];
                this.searchDate = date;
                this.DateInto = date;
                this.realTime = true;

                var code1 = this.code1;
                var code2 = this.code2;
                var seats = this.seat;
                var startdate = date;
                var civil = this.civil;

                this.axios(code1, code2, seats, startdate, civil);
                this.refreshChild();
            },

            //点击日历中向前按钮
            bindPrev: function () {
                this.realTime = true;
                var time = this.startDate - 24 * 60 * 60 * 1000;
                if (time > new Date().getTime()) {
                    this.getTimeTenTimeStamp(time, 1);
                }
            },
            //点击日历中向后按钮
            bindNext: function () {
                this.realTime = true;
                var time = this.endTimeStamp + 24 * 60 * 60 * 1000;
                this.getNextMoreTimeStamp(time);
            },

            // 点击日历事件
            clickDay(data) {
                this.calendarSelectDate = data; //选中某天
            },
            //用户在日历上点击搜索的日期进行提交日期
            submitDate: function () {
                var time = new Date(this.calendarSelectDate).getTime();
                this.getTimeTenTimeStamp(time, 0);
                this.searchDate = this.ToDateYear(time);
                this.showLoading = true;

                var code1 = this.code1;
                var code2 = this.code2;
                var seats = this.seat;
                var startdate = this.ToDateYear(time);
                this.DateInto = this.ToDateYear(time);
                var civil = this.civil;
                this.axios(code1, code2, seats, startdate, civil);
                this.refreshChild();
            },

            //***************************start*************//
            /*********获取搜索日期10天内时间********/
            //time为搜索时间，type分0为首次渲染，1为向前按钮点击渲染
            getTimeTenTimeStamp: function (time, type) {
                var list = [];
                var y = new Date().getFullYear();
                var m = new Date().getMonth() + 1;
                var date = new Date().getDate();
                var now = new Date(y + '-' + m + '-' + date).getTime();
                var search = new Date(time).getTime();

                var limit = type == 0 ? 5 : 10;

                //搜索日期跟当前日期对比
                var d = parseInt((search - now) / (24 * 60 * 60 * 1000));
                d = d == -0 ? 0 : d < 0 ? 0 : d;

                var startDate = '';
                /****添加当前日期到搜索日期的时间段****/
                var stamp;
                if (d >= limit) {
                    for (var i = (limit - 1); i > 0; i--) {
                        stamp = search - 24 * 60 * 60 * 1000 * i;
                        list.push({date: this.ToDate(stamp), week: this.ToWeek(stamp), year: this.ToDateYear(stamp)});
                    }
                    list.sort();
                    startDate = search - 24 * 60 * 60 * 1000 * (limit - 1);
                    this.disablePrev = false;
                }
                else if (d > 0 && d < limit) {
                    for (var ii = 0; ii < d; ii++) {
                        stamp = now + 24 * 60 * 60 * 1000 * ii;
                        list.push({date: this.ToDate(stamp), week: this.ToWeek(stamp), year: this.ToDateYear(stamp)});
                    }
                    startDate = now;
                    this.disablePrev = true;
                }
                else {
                    startDate = now;
                    this.disablePrev = true;
                }
                /****未来10天的日期*****/
                var len = 10 - list.length;
                for (var j = 0; j < len; j++) {
                    stamp = search + 24 * 60 * 60 * 1000 * j;
                    list.push({date: this.ToDate(stamp), week: this.ToWeek(stamp), year: this.ToDateYear(stamp)});
                }
                this.dateList = list;
                this.endTimeStamp = search + 24 * 60 * 60 * 1000 * (len - 1); //结束日期时间戳
                this.startDate = startDate;
            },

            //点击按钮next获取未来10天的日期
            getNextMoreTimeStamp: function (time) {
                var list = [];
                var stamp;
                for (var j = 0; j < 10; j++) {
                    stamp = time + 24 * 60 * 60 * 1000 * j;
                    list.push({date: this.ToDate(stamp), week: this.ToWeek(stamp), year: this.ToDateYear(stamp)});
                }

                this.dateList = list;
                this.endTimeStamp = time + 24 * 60 * 60 * 1000 * 9; //结束日期时间戳
                this.startDate = time;
                this.disablePrev = false;
            },

            //******** 时间戳转换为时间（2019-2-01）*******//
            ToDateYear: function (time) {
                var now = new Date(time);
                var year = now.getFullYear();
                var month = now.getMonth() + 1;
                var date = now.getDate();
                if (month >= 0 && month <= 9) {
                    month = "0" + month;
                }
                if (date >= 0 && date <= 9) {
                    date = "0" + date;
                }
                return year + "-" + month + "-" + date;

            },

            //******** 时间戳转换为时间（2-01）*******//
            ToDate: function (time) {
                var now = new Date(time);
                // var year=now.getFullYear();
                var month = now.getMonth() + 1;
                var date = now.getDate();
                if (date >= 0 && date <= 9) {
                    date = "0" + date;
                }
                // var hour=now.getHours();
                // var minute=now.getMinutes();
                // var second=now.getSeconds();
                return month + "-" + date;
                //2017/7/22 下午6:12:30
            },

            //******** 时间戳转换为星期（周）*******//
            ToWeek: function (time) {
                var now = new Date(time);
                var search = this.ToDateYear(time);
                var nowDate = this.ToDateYear(new Date().getTime());


                var n = now.getDay();
                if (search == nowDate) {
                    n = 7
                }
                switch (n) {
                    case 0:
                        return '周日'
                        break;
                    case 1:
                        return '周一'
                        break;
                    case 2:
                        return '周二'
                        break;
                    case 3:
                        return '周三'
                        break;
                    case 4:
                        return '周四'
                        break;
                    case 5:
                        return '周五'
                        break;
                    case 6:
                        return '周六'
                        break;
                    case 7:
                        return '今天'
                        break;
                }
            },

            //**************************end***************//

            // 刷新子组件
            refreshChild() {
                this.refresh = false;
                setTimeout(() => {
                    this.refresh = true
                }, 0)
            },

            //添加订单监控
            addTicket(id, seat, civil) {
                this.modalNum = true;
                this.submitId = id;
                this.submitCode = seat;
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
                            var startdate = this.searchDate;
                            var civil = this.civil;
                            // 刷新页面
                            this.axios(code1, code2, seats, startdate, civil);
                            this.submitLoading = false;
                            this.modalNum= false;
                            this.$Notice.success({
                                desc: '提交成功',
                                duration: 3
                            });
                        }
                       else if(response.code == -14||response.code == -15){
                            this.modalNum= false;
                        }
                        // else{//提交失败 提交失败，请重新提交
                        //     this.$Notice.error({
                        //         desc: '提交失败，请重新提交!',
                        //         duration: 3
                        //     });
                        // }

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
                this.submitCode = '';
                this.modalNum = false;
            }
        }
    }
</script>
<style>
    .wh_content_all{
        background: #5cadff!important;
    }
    .wh_content_item .wh_isToday{
        background: #c5c8ce!important;
    }
    .wh_content_item .wh_chose_day{
        background: #FFE300!important;
    }
    .wh_content_item:hover{
        background:rgba(255,227,0,0.2);
    }
    .ivu-modal-body{margin-bottom: 10px;}
</style>
<style scoped lang="scss">
    @import '../assets/style/_variables';
    @import '../assets/style/_airlines';
    .detail{
        position: relative;
        padding-top: 5px;

    }
    .searchContent{
        margin-bottom: 20px;
    }

    .calendar{
        text-align: center;
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

    //日历样式
    .calendar{
        margin: 15px auto;
        background: #fff;
        border-bottom: 1px solid $DarkPrimayColor;
        /*padding: 8px 0;*/
    }
    .calendar .ivu-col{
      cursor: pointer;
    }
    .border-right{
        border-right: 1px solid $borderColor;
        padding: 8px 0;
    }
    .border-right.active {
        background: $DarkPrimayColor;
        color: #fff;
    }
    .date-time{
        font-size: 14px;
    }
    .date{
        font-size: 10px;
    }
    .arrow-icon {
        padding: 17px 0;
    }
    .disableBtn .ivu-icon{
        color: #c5c8ce;
    }


</style>
