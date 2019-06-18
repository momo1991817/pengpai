<template>
    <div class="schedule clearfix">
        <!--日历表-->
        <div class="calender ">
            <Card>
                <Calender @getDetail="getDateDetail" ref="Calender"></Calender>
            </Card>
        </div>
        <!--日程表-->
        <div class="schedule_detail">
            <Card>
                <div class="schedule_detail_head">
                    <div class="title">
                        我的日程
                        <!--<span @click="openModel"><Icon type="md-add-circle" color="#fff" size="20"/></span>-->
                    </div>

                    <div class="addSchedule">
                        <ButtonGroup>
                            <Button :class="{ active:menu == 1}" v-on:click="selectMenu(1)" style="font-weight: bold;"><span>PNR</span><Icon type="ios-add-circle-outline"/></Button>
                            <Button :class="{ active: menu == 2}" v-on:click="selectMenu(2)" disabled style="font-weight: bold;"><span>预定码</span><Icon type="ios-add-circle-outline"/></Button>
                        </ButtonGroup>
                    </div>
                </div>


                <div class="schedule_detail_body" :style="{height: schedule_height}">
                    <Timeline>
                        <TimelineItem>
                            <div class="schedule_date">
                                <span>{{schedule_date}}</span>
                            </div>
                        </TimelineItem>

                        <TimelineItem v-if="showInfo&&!firstLogin">
                            <Alert type="error">您今天没有行程</Alert>
                        </TimelineItem>

                        <TimelineItem v-for="item in schedule_list" v-if="!showInfo">

                            <Card>
                                <Row>
                                    <Col span="24">
                                        <div class="timeline">
                                            <Icon type="ios-alarm-outline" color="#2b85e4" size="14"/><b>{{item.departureTime}}</b>
                                            <div class="timeline-delete" @click="delectSchedule(item.pnrNo,item.flightNo,item.flightDate)">
                                                <Icon type="ios-trash-outline" size="14"/><span>删除</span>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span="18">
                                        <div class="flightNum">{{item.airLineShortName}}{{item.flightNo}}</div>
                                    </Col>
                                    <Col span="6" align="right">
                                        <div class="airlineSeat">{{item.code}}舱</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="8" align="left">
                                        <div class="airlineTime">
                                            <b>{{item.departureTime}}</b>
                                            <span>{{item.depCityName}}</span>
                                        </div>
                                    </Col>
                                    <Col span="8">
                                        <div class="time">{{item.flightDate}}</div>
                                        <img src="../assets/images/arrow.png" width="100%" alt="">
                                    </Col>
                                    <Col span="8" align="right">
                                        <div class="airlineTime">
                                            <b>{{item.arrivalTime}}</b>
                                            <span>{{item.arrCityName}}</span>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <div class="timelinePassenger clearfix">
                                        <span v-for="items in item.passengers"><Icon type="md-person" />{{items}}</span>
                                    </div>
                                </Row>
                            </Card>

                        </TimelineItem>

                        <!--例子-->
                        <div v-if="firstLogin">


                            <TimelineItem>
                                <Alert type="warning">以下为日程管理事例图!</Alert>
                            </TimelineItem>

                            <!--例子-->
                            <TimelineItem>

                                <Card>
                                    <Row>
                                        <Col span="24">
                                            <div class="timeline"><Icon type="ios-alarm-outline" color="#2b85e4" size="14"/><b>12:00</b> </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col span="18">
                                            <div class="flightNum">国航CA887</div>
                                        </Col>
                                        <Col span="6" align="right">
                                            <div class="airlineSeat">公务舱</div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8" align="left">
                                            <div class="airlineTime">
                                                <b> 12:00</b>
                                                <span>北京首都</span>
                                            </div>
                                        </Col>
                                        <Col span="8">
                                            <div class="time">{{nowDate}}</div>
                                            <img src="../assets/images/arrow.png" width="100%" alt="">
                                        </Col>
                                        <Col span="8" align="right">
                                            <div class="airlineTime">
                                                <b>09:00</b>
                                                <span>洛杉矶</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <div class="timelinePassenger clearfix">
                                            <span><Icon type="md-person" />ZHANG/SAN</span>
                                        </div>
                                    </Row>
                                </Card>

                            </TimelineItem>

                            <TimelineItem>
                                <Alert type="warning"> 点击上面添加按钮，可添加新行程！</Alert>
                            </TimelineItem>


                            <!--<TimelineItem>-->

                                <!--<Card>-->
                                    <!--<Row>-->
                                        <!--<Col span="24">-->
                                            <!--<div class="timeline"><Icon type="ios-alarm-outline" color="#2b85e4" size="14"/><b>20:10</b> </div>-->
                                        <!--</Col>-->
                                    <!--</Row>-->

                                    <!--<Row>-->
                                        <!--<Col span="18">-->
                                            <!--<div class="flightNum">美联航UA199</div>-->
                                        <!--</Col>-->
                                        <!--<Col span="6" align="right">-->
                                            <!--<div class="airlineSeat">公务舱</div>-->
                                        <!--</Col>-->
                                    <!--</Row>-->
                                    <!--<Row>-->
                                        <!--<Col span="8" align="left">-->
                                            <!--<div class="airlineTime">-->
                                                <!--<b>20:10</b>-->
                                                <!--<span>上海浦东</span>-->
                                            <!--</div>-->
                                        <!--</Col>-->
                                        <!--<Col span="8">-->
                                            <!--<div class="time">{{nowDate}}</div>-->
                                            <!--<img src="../assets/images/arrow.png" width="100%" alt="">-->
                                        <!--</Col>-->
                                        <!--<Col span="8" align="right">-->
                                            <!--<div class="airlineTime">-->
                                                <!--<b>16:50</b>-->
                                                <!--<span>洛杉矶</span>-->
                                            <!--</div>-->
                                        <!--</Col>-->
                                    <!--</Row>-->
                                    <!--<Row>-->
                                        <!--<div class="timelinePassenger clearfix">-->
                                            <!--<span><Icon type="md-person" />LI/SI</span>-->
                                        <!--</div>-->
                                    <!--</Row>-->
                                <!--</Card>-->

                            <!--</TimelineItem>-->
                        </div>


                    </Timeline>
                </div>


            </Card>
        </div>

        <div class="addSchedule">

            <!--PNR码添加日程-->
            <Modal v-model="modal1" width="80%">
                <div slot="header" style="text-align:center">
                    <span>添加新日程</span>
                </div>

                <div class="modal-content" style="text-align:center">
                    <!--表单-->
                    <div class="form">
                        <div class="text-info">
                            注：请提交完整的PNR，系统智能为您解析。<br>

                            <div style="color: #495060;">
                                例如：<br>
                                1.TIAN/SHIHAO JRPJJZ<br>
                                2.  HU7904 J   SA15JUN  MANPEK HK1   1215 0525+1        E 2 T2<br>
                                3.  HU7903 J   TU17SEP  PEKMAN HK1   0145 0540          E T22<br>
                            </div>

                        </div>
                        <Input v-model="PNR" type="textarea" :autosize="{minRows: 5,maxRows:8}" placeholder="PNR码"></Input>
                        <div class="btn">
                              <Button style="margin-left: 8px" v-on:click="PNRCancle" >取消</Button>
                        </div>

                    </div>
                     <!--PNR码错误-->
                    <div class="airline-info pnrErroe" v-if="pnrError" style="margin-bottom: 10px;">
                        <Alert type="error" show-icon>未解析出，请检查PNR是否完整！</Alert>
                    </div>

                    <div class="airline-info" v-if="showAirlineCard">
                        <div class="airline-travelers">
                           <Tag type="border" color="primary" v-for="item in passenger"><Icon type="md-person" />{{item.name}}</Tag>
                        </div>

                        <div class="airline-list">
                            <div class="airline-info-card" v-for="item in list">
                                <Row>
                                    <Col span="12">
                                        <div class="flightNum">{{item.air_crop}}{{item.flightNo}}</div>
                                    </Col>
                                    <Col span="12" align="right">
                                        <div class="airlineSeat">{{item.Cabin}}舱</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="8" align="left">
                                        <div class="airlineTime">
                                            <b>{{item.departure_time}}</b>
                                            <span>{{item.city1}}({{item.depAirport}})</span>
                                        </div>
                                    </Col>
                                    <Col span="8">
                                        <div class="time">{{item.departure_date}}</div>
                                        <img src="../assets/images/arrow.png"  alt="">
                                    </Col>
                                    <Col span="8" align="right">
                                        <div class="airlineTime">
                                            <b>{{item.arrival_time}}</b>
                                            <span>{{item.city2}}({{item.arrAirport}})</span>
                                        </div>
                                    </Col>
                                </Row>

                            </div>

                        </div>

                        <div class="btn btnSubmit" v-bind:style="{width: btnWith}">
                            <Button type="primary"  v-on:click="PNRSubmit" :disabled="isDisable">提交</Button>
                        </div>

                    </div>
                    <!--显示loading -->
                    <div class="airline-info demo-spin-col" v-if="showLoading">
                        <Spin fix>
                            <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                            <div>加载中···</div>
                        </Spin>
                    </div>


                </div>


                <div slot="footer">

                </div>
            </Modal>

            <Modal v-model="modal2" width="360" :closable="true">
                <div >
                    <div class="header" align="center" style="margin-bottom: 10px; font-size: 16px;">
                        新添加日程
                    </div>
                    <Form :model="addSchedule" label-position="top" ref="addSchedule" :rules="ruleAdd">
                        <FormItem label="预定码" prop="code">
                            <Input v-model="addSchedule.code" placeholder="请输入预定码"></Input>
                        </FormItem>
                        <FormItem label="姓氏" prop="surname">
                            <Input v-model="addSchedule.surname" placeholder="请输入姓氏"></Input>
                        </FormItem>
                        <FormItem label="名字" prop="name">
                            <Input v-model="addSchedule.name" placeholder="请输入名字"></Input>
                        </FormItem>
                        <Button type="primary" long v-on:click="AddSubmit('addSchedule')">提交</Button>
                    </Form>

                </div>
                <div slot="footer">
                </div>
            </Modal>

            <Modal v-model="modal3" width="360" title="确认删除" :closable="true" class="vertical-center-modal">
                <div>
                    删除后数据无法恢复!
                </div>
                <div slot="footer">
                    <Button type="primary"  @click="DoDelect">确定</Button>
                    <Button @click="closeModal">取消</Button>
                </div>
            </Modal>

        </div>

    </div>

</template>

<script>
    import Calender from './Calender';
    import { Base64 } from 'js-base64';
    export default {
        name: "Schedule",
        components: {
            Calender
        },
        data(){
            return {

                modal1: false,  //预定编码添加
                modal2: false, //pnr码添加
                modal3: false,  //确认删除modal
                menu: 3,
                btnWith: '100%',

                PNR: '',
                showAirlineCard: false, //展示解析出来的PNR
                passenger: '',//PNG解析乘客信息
                list: '',  //PNR航程信息
                pnrError: false, //pnr是否错误
                showLoading: false,//PNR是否显示加载中
                isDisable: false,//PNR按钮重新提交 提交过程到成功  均为禁止提交


                // 通过预定号添加日程的表单
                addSchedule: {
                    code: '',
                    surname: '',
                    name: ''
                },
                ruleAdd: {
                    code: [
                        { required: true, message: '预定码不能为空！', trigger: 'blur' }
                    ],
                    surname: [
                        { required: true, message: '姓氏不能为空', trigger: 'blur' },
                    ],
                    name: [
                        { required: true, message: '名字不能为空', trigger: 'blur' },
                    ]
                },

                schedule_height: '',

                // 用户的具体日程
                schedule_list: [],//具体日程列表
                schedule_date: '',//显示日程的日期
                nowDate: '',//当前日期
                showInfo: true, //是否提醒没有日程

                firstLogin: true,

                delectFlightNo: '',//删除的订单航班号
                delectPnr: '', //删除订单的PNR
                delectDate: '',//删除订单的日程

            }
        },

        created(){
            // 固定右边行程详情高度
            var screenH = document.documentElement.clientHeight;
            this.schedule_height = (screenH - 60 -157)+'px';

            this.getDetailAccordingDate(this.getTodayDate());
            this.getScheduleNumChangeFirstLoginType();

            //获取保存的firstLogin 保存boolean变为字符串
            // if(localStorage.getItem('firstLogin') == 'false'){
            //     this.firstLogin = false;
            // }else{
            //     this.firstLogin = true;
            // }
        },

        methods: {

            //添加日程弹出框
            selectMenu: function (e) {

                this.menu = e;
                this.modal1 = false;
                this.modal2 = false;
                if (e == 1) {
                    this.modal1 = true;
                }
                else if (e == 2) {
                    this.modal2 = true;
                }
            },

            //提交表单
            AddSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        //满足条件 提交
                        this.$Notice.success({
                            desc: '成功',
                            duration: 3
                        });
                    } else {
                        this.$Notice.error({
                            desc: '失败',
                            duration: 3
                        });
                    }
                })
            },


            //获取乘客信息，
            getOrder: function (val) {
                var that = this;
                this.isDisable = false;
                this.$http({
                    url: this.$comjs.IP + '/schedule/parsePnr',
                    method: 'post',
                    data: {
                        text: Base64.encode(val),
                        formId: ''
                    }
                }).then(response => {
                    that.showLoading = false;
                    var airline = response.flight_section;
                    var passenger = response.passengers_list, list = [], arr = [];//arr乘客信息
                    if (airline.length == 1) {
                        that.btnWith = '48%';
                    } else {
                        that.btnWith = '100%';
                    }
                    if (airline.length == 0) {
                        that.showAirlineCard = false;
                        that.pnrError = true;
                    } else {
                        that.showAirlineCard = true;
                        that.pnrError = false;
                        for (var i = 0, l = airline.length; i < l; i++) {
                            list.push({
                                flightNo: airline[i].flightNo,
                                arrAirport: airline[i].arrAirport,
                                arrival_time: airline[i].arrival_time,
                                depAirport: airline[i].depAirport,
                                departure_date: airline[i].departure_date,
                                departure_time: airline[i].departure_time,
                                Cabin: airline[i].cabin,
                                miles: airline[i].miles,

                                city1: airline[i].depAirport_CN,
                                city2: airline[i].arrAirport_CN,
                                air_crop: airline[i].air_crop
                            });
                            // that.changeDate(airline[i].departure_date);
                        }
                        for (var j = 0, len = passenger.length; j < len; j++) {
                            arr.push({
                                name: passenger[j].first_name + "/" + passenger[j].last_name,
                                ticketNum: passenger[j].ticket_number,
                                gender: passenger[j].gender,
                            })
                        }
                        that.list = list;
                        that.passenger = arr;
                    }

                })
            },

            //点击取消清空
            PNRCancle: function () {
                this.PNR = '';
                this.pnrError = false;
                this.showAirlineCard = false;
                this.isDisable = false;
            },

            //点击提交表单
            PNRSubmit: function () {
                var that = this;
                var val = this.PNR;
                this.isDisable = true;
                // var that = this;
                this.$http({
                    url: this.$comjs.IP + '/schedule/addAirSchedule',
                    method: 'post',
                    data: {
                        text: Base64.encode(val)
                    }
                })
                    .then(response => {

                        if (response.code == 200) {
                            this.$Notice.success({
                                desc: '日程提交成功！',
                                duration: 3,
                            });
                            that.$refs.Calender.getSchedule();
                        }else{
                            this.isDisable = false;
                        }


                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },

            //获取用户选择日期的日程详情
            getDateDetail: function (val) {
                this.getDetailAccordingDate(val);
            },

            // 通过时间获取日期详情
            getDetailAccordingDate: function (date) {
                this.schedule_date = date;
                var that = this;
                this.$http({
                    url: this.$comjs.IP + '/schedule/list',
                    method: 'post',
                    data: {
                        departureFlightDateStart: date,
                        departureFlightDateEnd: date
                    },
                })
                    .then(response => {

                       if(JSON.stringify(response.data) == "{}"){
                           that.showInfo = true;
                       }
                       else{
                           that.showInfo = false;
                           var obj = response.data;


                           var PNRpassenger = [], list = [],data = {};
                           for(var key in obj){

                               data = obj[key][0];
                               var arr = obj[key];
                               // 同一个订单合并
                               for (var i = 0, l = arr.length; i < l; i++) {
                                   PNRpassenger.push(arr[i].passengerFirstName + '/' + arr[i].passengerLastName);
                               }
                               data['passengers'] =PNRpassenger;
                               list.push(data);
                               data = [];
                               PNRpassenger = [];
                           }

                           that.schedule_list = list;

                       }

                    })
            },

            //获取今天的日期  2019-04-23
            getTodayDate: function () {
                var now = new Date();
                var y = now.getFullYear();
                var m = now.getMonth() + 1;
                var d = now.getDate();
                if (m < 10) {
                    m = '0' + m;
                }
                if (d < 10) {
                    d = '0' + d;
                }
                this.schedule_date = '今天' + y + '-' + m + '-' + d;
                this.nowDate = y + '-' + m + '-' + d;
                return '今天' + y + '-' + m + '-' + d;
            },

            //判断用户是否是首次登录
            //获取用户的日程信息
            getScheduleNumChangeFirstLoginType: function () {
                var that = this;
                this.$http({
                    url: this.$comjs.IP + '/schedule/statistics',
                    method: 'post',
                    data: {}
                }).then(response => {
                    //获取保存的firstLogin 保存boolean变为字符串
                    if(localStorage.getItem('firstLogin') == 'false'){
                        that.firstLogin = false;
                    }else{
                        if (response.code == 200 && response.data.length != 0) {
                            localStorage.setItem('firstLogin', false);
                            that.firstLogin = false;
                        }
                        // that.firstLogin = true;
                    }


                })
            },


            //删除行程
            delectSchedule:function(pnrNo,flightNo,date){
                this.delectFlightNo = flightNo;
                this.delectPnr = pnrNo;
                this.delectDate = date;
                this.modal3 = true;
            },
            //确认删除
            DoDelect: function(){
                var that = this;
                this.$http({
                    url: this.$comjs.IP + '/schedule/delete',
                    method: 'post',
                    data: {
                        flightDate: this.delectDate,
                        flightNo: this.delectFlightNo,
                        pnrNo: this.delectPnr
                    },
                })
                    .then(response => {
                        if(response.code == 200){
                            this.$Message.success('日程删除成功！');
                            that.$refs.Calender.getSchedule();
                            that.getDetailAccordingDate(that.schedule_date);
                        }
                        that.modal3 = false;
                    });
            },

            //取消删除
            closeModal: function(){
                this.modal3 = false;
            },
        },
        watch:{

            PNR(newVal){
                if(newVal != ''){
                    this.showLoading = true;
                    this.getOrder(newVal);
                }else{
                    this.showLoading = false;
                    this.showAirlineCard = false;
                    this.list = [];
                    this.passenger = [];
                }
            },

            modal1(newVal){
                if(!newVal){
                    this.PNR = '';
                    this.menu = 3;

                }

            },
            modal2(newVal){
                if(!newVal){
                    this.menu = 3;
                }

            }


        },
    }
</script>


<style>
    .ivu-alert{
        margin-bottom: 0!important;
    }
</style>


<style scoped lang="scss">
    @import '../assets/style/variables';
    @import '../assets/style/airlines';

    /*日历部分*/
    .schedule{
        padding-top: $topMenu;
    }
    .schedule>div{
        float: left;
    }
    .schedule>div.calender{
        width: 69%;
    }
    .schedule>div.schedule_detail{
        position: fixed;
        width: 27%;
        right: 5%;
        margin-left: 1%;
        margin-bottom: 10px;
    }

    .schedule_detail_head{
        position: static;
        z-index: 1000;
    }
    .schedule_detail_body{
        margin-top: 10px;
        padding-top: 20px;
        overflow-y: auto;
    }
    /*日程部分*/
    .schedule_date>span{
        display: inline-block;
        padding: 4px 10px;
        background: #f39a08;
        color: #fff;
        /*height: 30px;*/
        /*line-height: 30px;*/
        /*width: 120px;*/
        border-radius: 15px;


    }
   .schedule_detail .timeline{
        font-size: 14px;
       height: 30px;
    }
    .schedule_detail .timeline>b{
        padding-left: 10px;
        vertical-align: middle;
    }
    .timelinePassenger{
        width: 100%;
    }
    .timelinePassenger>span{
        color: $SubColor;
       float: left;
       margin-right: 15px;
    }
    .schedule_detail .content{
        padding-left: 5px;
    }
    .schedule_detail .title{
        text-align: center;
        background: $info;
        color: #fff;
        height: 30px;
        border-radius: 5px;
    }
    .schedule_detail .title span{
        float: right;
        cursor: pointer;
    }


    .addSchedule{
        margin: 20px 0 0;
    }
    .addSchedule .active{
        background: $DarkPrimayColor;
        color: #fff;
    }
    .addSchedule span{
        vertical-align: middle;
        padding-right: 2px;
    }


    .modal-content>div{
        float: left;
    }
    .modal-content>div.form{width: 30%;}
    .modal-content>div.airline-info{width: 66%;margin-left: 4%;}
    .modal-content:after,.airline-list:after{
        content: "";
        display: block;
        clear: both;
    }
    .modal-content .airline-info-card{
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        margin-bottom:20px;
    }
    .airline-list >div{
        float: left;
        width: 48%;
    }
    .modal-content .airline-info-card:nth-child(even){
        margin-left: 4%;
    }
    .modal-content .airline-info-card img{
        width: 100%;
    }
    .flightNum,.airlineSeat{
        font-size: 18px;
    }
    .airline-passenger,.airline-passenger-ticketNum{
        color: $SubColor;
    }
    .airline-travelers{
        margin-bottom: 10px;
        text-align: left;
    }

   .modal-content .btn{
        margin-top: 10px;
        text-align: right;
    }
    .timeline>.timeline-delete{
        float: right;
        padding: 2px 10px;
        background: $warming;
        color: #fff;
        border-radius: 3px;
        font-size: 12px;
        cursor: pointer;
    }
    .timeline>.timeline-delete>span{
        vertical-align: middle;
    }

    .form .text-info{
        margin-bottom: 10px;
        color: $warming;
        text-align: left;
    }

    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;

        .ivu-modal{
            top: 0;
        }
    }
</style>
