<template>
    <div class="ticket">
        <div class="bg" :style="{height: imgH}">
            <img src="../assets/images/bg2.jpg" alt="">
            <div class="bg_title">
                <p>智能解析 实时监控</p>
                <span>PNR智能解析，及时获取更低价格</span>
            </div>
        </div>

        <div class="PnrSearchBody" :style="{top: searchTop}">
            <Menu mode="horizontal" :theme="theme1" active-name="1"  @on-select="menuTab">
                <MenuItem name="1">
                    <Icon type="ios-cloudy-outline" />
                    智能解析
                </MenuItem>
                <!--<MenuItem name="2">-->
                <!--<Icon type="ios-people" />-->
                <!--PDF-->
                <!--</MenuItem>-->
                <MenuItem name="3">
                    <Icon type="ios-add-circle-outline" />
                    手动添加
                </MenuItem>
            </Menu>
            <div class="tab">
                <div v-if="tab==1">

                    <div class="example-pnr">
                        <span class="text-info">注：请粘贴完整的PNR码，系统智能为您解析。</span>
                        <b>例如</b><Tooltip placement="left">
                        <div class="explain"><Icon type="ios-help-circle" size="16" color="#2d8cf0"/></div>
                        <div slot="content">
                            <p>
                                系统降舱航司包括：'JP', 'A3', 'AC', 'CA',
                            </p>
                            <p>
                                'AI', 'NZ', 'NH', 'OZ', 'OS', 'AV', 'SN',
                            </p>
                            <p>
                                'CM', 'OU', 'MS', 'ET', 'BR', 'LO', 'LH',
                            </p>
                            <p>
                                'SK', 'ZH', 'SQ', 'SA', 'LX', 'TP', 'TG',
                            </p>
                            <p>
                                'TK', 'UA', 'AA', 'BA', 'CX', 'AY', 'IB',
                            </p>
                            <p>
                                'JL', 'LA', 'MH', 'QF', 'QR', 'RJ', 'S7',
                            </p>
                            <p>
                                'UL', 'JJ', 'AM', 'SU', 'AR', 'UX', 'AF',
                            </p>
                            <p>
                                'AZ', 'CI', 'MU', 'CZ',  'OK', 'DL', 'GA',
                            </p>
                            <p>
                                'KQ', 'KL', 'KE', 'ME', 'SV', 'RO', 'VN',
                            </p>
                            <p>
                                'VS', 'EK', 'EY', 'HU', 'HX', 'VA','MF'
                            </p>

                        </div>
                    </Tooltip> <br>
                        2.  HU7904 J   SA15JUN  MANPEK HK1   1215 0525+1        E 2 T2<br>
                        3.  HU7903 J   TU17SEP  PEKMAN HK1   0145 0540          E T22<br>
                    </div>

                    <!--<input type="textarea" v-model="PNR" placeholder="PNR码" style="word-wrap:normal;">-->
                    <div class="clearfix">
                        <div class="inputTextarea" style="float: left;width: 92%;">
                            <Input v-model="PNR" type="textarea" :autosize="{minRows: 3,maxRows:5}" placeholder="PNR码"></Input>
                        </div>
                        <div class="btn" style="float: left;width: 8%;text-align: right;">
                            <Button style="margin-left: 8px" v-on:click="PNRCancle">取消</Button>
                        </div>
                    </div>

                    <div class="analyse tab" v-if="PNR!=''">
                        <!--PNR码错误-->
                        <div class="airline-info pnrErroe" v-if="pnrError" style="margin-bottom: 10px;">
                            <Alert type="error" show-icon>未解析出，请检查PNR是否完整！</Alert>
                        </div>

                        <!--显示loading -->
                        <div class="airline-info demo-spin-col" v-if="showLoading">
                            <Spin fix>
                                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                                <div>加载中···</div>
                            </Spin>
                        </div>

                        <div class="airline-info" v-if="showAirlineCard">
                            <!--<div class="airline-travelers">-->
                            <!--<Tag type="border" color="primary" v-for="item in passenger"><Icon type="md-person" />{{item.name}}</Tag>-->
                            <!--</div>-->

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
                                <Button type="primary"  v-on:click="PNRSubmit" :disabled="submitId">提交</Button>
                            </div>

                            <div class="orderId" v-if="submitSuccess">
                                <Icon type="ios-checkmark-circle" color="#19be6b" size="18"/>
                                订单下单成功，订单号为：
                                <span class="tag-read" :data-clipboard-text="item" @click="CopyOrderId" v-for="item in orderId">
                                 <Tooltip content="复制" placement="top">
                                     【<b>{{item}}</b>】
                                  </Tooltip>

                            </span>
                                （点击订单号即可完成复制）
                            </div>

                        </div>
                    </div>

                </div>
                <!--<div v-if="tab == 2">-->

                <!--</div>-->
                <div v-if="tab == 3">

                    <Select @submitInfo="sumbitAirline" :disable="isDisable"></Select>
                    <Tooltip placement="left">
                        <div class="explain"><Icon type="ios-help-circle" size="16" color="#2d8cf0"/></div>
                        <div slot="content">
                            <p>
                                系统降舱航司包括：'JP', 'A3', 'AC', 'CA',
                            </p>
                            <p>
                                'AI', 'NZ', 'NH', 'OZ', 'OS', 'AV', 'SN',
                            </p>
                            <p>
                                'CM', 'OU', 'MS', 'ET', 'BR', 'LO', 'LH',
                            </p>
                            <p>
                                'SK', 'ZH', 'SQ', 'SA', 'LX', 'TP', 'TG',
                            </p>
                            <p>
                                'TK', 'UA', 'AA', 'BA', 'CX', 'AY', 'IB',
                            </p>
                            <p>
                                'JL', 'LA', 'MH', 'QF', 'QR', 'RJ', 'S7',
                            </p>
                            <p>
                                'UL', 'JJ', 'AM', 'SU', 'AR', 'UX', 'AF',
                            </p>
                            <p>
                                'AZ', 'CI', 'MU', 'CZ',  'OK', 'DL', 'GA',
                            </p>
                            <p>
                                'KQ', 'KL', 'KE', 'ME', 'SV', 'RO', 'VN',
                            </p>
                            <p>
                                'VS', 'EK', 'EY', 'HU', 'HX', 'VA','MF'
                            </p>

                        </div>
                    </Tooltip>
                </div>
            </div>
        </div>




       <!--原来版本-->
        <!--<div class="searchBody" :style="{top: searchTop}">-->
            <!--&lt;!&ndash;手动筛选表格&ndash;&gt;-->
            <!--&lt;!&ndash;<Card >&ndash;&gt;-->
                <!--&lt;!&ndash;<div class="tab">&ndash;&gt;-->
                    <!--&lt;!&ndash;<Select @submitInfo="sumbitAirline" :disable="isDisable"></Select>&ndash;&gt;-->
                <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--&lt;!&ndash;</Card>&ndash;&gt;-->
            <!--<Menu mode="horizontal" :theme="theme1" active-name="1"  @on-select="menuTab">-->
                <!--<MenuItem name="1">-->
                    <!--<Icon type="ios-cloudy-outline" />-->
                   <!--智能解析-->
                <!--</MenuItem>-->
                <!--&lt;!&ndash;<MenuItem name="2">&ndash;&gt;-->
                    <!--&lt;!&ndash;<Icon type="ios-people" />&ndash;&gt;-->
                    <!--&lt;!&ndash;PDF&ndash;&gt;-->
                <!--&lt;!&ndash;</MenuItem>&ndash;&gt;-->
                <!--<MenuItem name="3">-->
                    <!--<Icon type="ios-add-circle-outline" />-->
                    <!--手动添加-->
                <!--</MenuItem>-->
            <!--</Menu>-->
            <!--<div class="tab">-->
                <!--<div v-if="tab==1">-->
                    <!--<div class="form">-->

                        <!--<div class="text-info">注：请粘贴完整的PNR码，系统智能为您解析。</div>-->

                        <!--<div class="example-pnr">-->
                            <!--<b>例如</b><Tooltip placement="left">-->
                                    <!--<div class="explain"><Icon type="ios-help-circle" size="16" color="#2d8cf0"/></div>-->
                                    <!--<div slot="content">-->
                                <!--<p>-->
                                    <!--系统降舱航司包括：'JP', 'A3', 'AC', 'CA',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'AI', 'NZ', 'NH', 'OZ', 'OS', 'AV', 'SN',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'CM', 'OU', 'MS', 'ET', 'BR', 'LO', 'LH',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'SK', 'ZH', 'SQ', 'SA', 'LX', 'TP', 'TG',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'TK', 'UA', 'AA', 'BA', 'CX', 'AY', 'IB',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'JL', 'LA', 'MH', 'QF', 'QR', 'RJ', 'S7',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'UL', 'JJ', 'AM', 'SU', 'AR', 'UX', 'AF',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'AZ', 'CI', 'MU', 'CZ',  'OK', 'DL', 'GA',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'KQ', 'KL', 'KE', 'ME', 'SV', 'RO', 'VN',-->
                                <!--</p>-->
                                <!--<p>-->
                                    <!--'VS', 'EK', 'EY', 'HU', 'HX', 'VA','MF'-->
                                <!--</p>-->

                            <!--</div>-->
                                   <!--</Tooltip> <br>-->
                            <!--2.  HU7904 J   SA15JUN  MANPEK HK1   1215 0525+1        E 2 T2<br>-->
                            <!--3.  HU7903 J   TU17SEP  PEKMAN HK1   0145 0540          E T22<br>-->
                        <!--</div>-->
                        <!--&lt;!&ndash;<input type="textarea" v-model="PNR" placeholder="PNR码" style="word-wrap:normal;">&ndash;&gt;-->
                        <!--<Input v-model="PNR" type="textarea" :autosize="{minRows: 5,maxRows:8}" placeholder="PNR码"></Input>-->
                        <!--<div class="btn">-->
                            <!--<Button style="margin-left: 8px" v-on:click="PNRCancle">取消</Button>-->
                        <!--</div>-->

                    <!--</div>-->

                    <!--&lt;!&ndash;PNR码错误&ndash;&gt;-->
                    <!--<div class="airline-info pnrErroe" v-if="pnrError" style="margin-bottom: 10px;">-->
                        <!--<Alert type="error" show-icon>未解析出，请检查PNR是否完整！</Alert>-->
                    <!--</div>-->

                    <!--&lt;!&ndash;显示loading &ndash;&gt;-->
                    <!--<div class="airline-info demo-spin-col" v-if="showLoading">-->
                        <!--<Spin fix>-->
                            <!--<Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>-->
                            <!--<div>加载中···</div>-->
                        <!--</Spin>-->
                    <!--</div>-->

                    <!--<div class="airline-info" v-if="showAirlineCard">-->
                        <!--&lt;!&ndash;<div class="airline-travelers">&ndash;&gt;-->
                            <!--&lt;!&ndash;<Tag type="border" color="primary" v-for="item in passenger"><Icon type="md-person" />{{item.name}}</Tag>&ndash;&gt;-->
                        <!--&lt;!&ndash;</div>&ndash;&gt;-->

                        <!--<div class="airline-list">-->
                            <!--<div class="airline-info-card" v-for="item in list">-->
                                <!--<Row>-->
                                    <!--<Col span="12">-->
                                        <!--<div class="flightNum">{{item.air_crop}}{{item.flightNo}}</div>-->
                                    <!--</Col>-->
                                    <!--<Col span="12" align="right">-->
                                        <!--<div class="airlineSeat">{{item.Cabin}}舱</div>-->
                                    <!--</Col>-->
                                <!--</Row>-->
                                <!--<Row>-->
                                    <!--<Col span="8" align="left">-->
                                        <!--<div class="airlineTime">-->
                                            <!--<b>{{item.departure_time}}</b>-->
                                            <!--<span>{{item.city1}}({{item.depAirport}})</span>-->
                                        <!--</div>-->
                                    <!--</Col>-->
                                    <!--<Col span="8">-->
                                        <!--<div class="time">{{item.departure_date}}</div>-->
                                        <!--<img src="../assets/images/arrow.png"  alt="">-->
                                    <!--</Col>-->
                                    <!--<Col span="8" align="right">-->
                                        <!--<div class="airlineTime">-->
                                            <!--<b>{{item.arrival_time}}</b>-->
                                            <!--<span>{{item.city2}}({{item.arrAirport}})</span>-->
                                        <!--</div>-->
                                    <!--</Col>-->
                                <!--</Row>-->
                            <!--</div>-->
                        <!--</div>-->


                        <!--<div class="btn btnSubmit" v-bind:style="{width: btnWith}">-->
                            <!--<Button type="primary"  v-on:click="PNRSubmit" :disabled="submitId">提交</Button>-->
                        <!--</div>-->

                        <!--<div class="orderId" v-if="submitSuccess">-->
                            <!--<Icon type="ios-checkmark-circle" color="#19be6b" size="18"/>-->
                            <!--订单下单成功，订单号为：-->
                            <!--<span class="tag-read" :data-clipboard-text="item" @click="CopyOrderId" v-for="item in orderId">-->
                                 <!--<Tooltip content="复制" placement="top">-->
                                     <!--【<b>{{item}}</b>】-->
                                  <!--</Tooltip>-->

                            <!--</span>-->
                            <!--（点击订单号即可完成复制）-->
                        <!--</div>-->

                    <!--</div>-->

                <!--</div>-->
                <!--&lt;!&ndash;<div v-if="tab == 2">&ndash;&gt;-->

                <!--&lt;!&ndash;</div>&ndash;&gt;-->
                <!--<div v-if="tab == 3">-->

                    <!--<Select @submitInfo="sumbitAirline" :disable="isDisable"></Select>-->
                    <!--<Tooltip placement="left">-->
                        <!--<div class="explain"><Icon type="ios-help-circle" size="16" color="#2d8cf0"/></div>-->
                        <!--<div slot="content">-->
                            <!--<p>-->
                                <!--系统降舱航司包括：'JP', 'A3', 'AC', 'CA',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'AI', 'NZ', 'NH', 'OZ', 'OS', 'AV', 'SN',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'CM', 'OU', 'MS', 'ET', 'BR', 'LO', 'LH',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'SK', 'ZH', 'SQ', 'SA', 'LX', 'TP', 'TG',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'TK', 'UA', 'AA', 'BA', 'CX', 'AY', 'IB',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'JL', 'LA', 'MH', 'QF', 'QR', 'RJ', 'S7',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'UL', 'JJ', 'AM', 'SU', 'AR', 'UX', 'AF',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'AZ', 'CI', 'MU', 'CZ',  'OK', 'DL', 'GA',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'KQ', 'KL', 'KE', 'ME', 'SV', 'RO', 'VN',-->
                            <!--</p>-->
                            <!--<p>-->
                                <!--'VS', 'EK', 'EY', 'HU', 'HX', 'VA','MF'-->
                            <!--</p>-->

                        <!--</div>-->
                    <!--</Tooltip>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->

        <div class="introduce" v-if="PNR==''">
            <Product></Product>
        </div>
        <div class="introduce" style="height:480px;" v-else></div>

    </div>
</template>

<script>
import Select from './../views/SearchDropdown';
import Product from './Product';
import { base64 } from 'js-base64';
import Clipboard from 'clipboard';
export default {
       name: "Main",
       components: {
         Select,
         Product
       },
        data () {
            return {
                theme1: 'light',  //主题颜色控制
                imgH:'',
                searchTop:'',//搜索框位置
                isDisable: false,
                tab: 1,
                PNR:'',

                BTNloading: false,
                btnWith: '100%',
                submitId: false,

                list: [], //订单信息
                passenger: [],//乘客信息
                showAirlineCard: false,//展示解析出来的PNR
                pnrError: false, //pnr是否错误
                showLoading: false,//是否显示加载中

                orderId: [''],
                submitSuccess: false,

                parsePNR: {}, //pnr解析结果 ---用来直接传给后台
            }
        },
        created(){
           this.getWindowHeight();
        },

        methods: {
            getWindowHeight:function(){
                var windowH = window.innerHeight;
                this.imgH = (windowH - 160)+'px';
                this.searchTop = (windowH - 160)*2/3+'px'
            },


            //获取舱位选择值
            getSeatValue:function(value){
                this.seat = value;
            },

            //提交通过航线搜索-- 降舱服务
            sumbitAirline:function(val){
                var arr = val.split("/");
                var code1 = arr[0];
                var code2 = arr[1];
                var seats = arr[2];
                var startdate = arr[3];
                var airline = arr[7];
                var flightNum = arr[8];
                this.isDisable = true;
                var that = this;

                this.$http({
                    url: this.$comjs.IP+'/monitor/addDownCab',
                    method: 'post',
                    data: {
                        airLine: airline,
                        flightNo: flightNum,
                        departureAirport: code1,
                        arrivalAirport: code2,
                        code: seats,
                        flightDate: startdate,
                    }
                })
                    .then(response => {
                        if(response.code == 200) {
                            this.$Notice.success({
                                desc: '监控提交成功',
                                duration: 3
                            });
                        }
                        that.isDisable = false;
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);

            },

            //监控条件搜索切换事件
            menuTab:function(name){
                this.tab = name;
            },

            //获取乘客信息，
            getOrder:function(val){
                var that = this;
                this.submitId = false;
                this.submitSuccess = false;
                this.$http({
                    // url:"http://120.76.57.131:808/schedule/parsePnr",
                    url: this.$comjs.IP +'/schedule/parsePnr',
                    method: 'post',
                    data:{
                        text:Base64.encode(val),
                        // formId: ''
                    }
                })
                    .then(response =>{
                    that.showLoading = false;
                    var airline = response.flight_section;
                    var passenger = response.passengers_list,list=[],arr = [];//arr乘客信息
                    if(airline.length == 1){
                          that.btnWith = '48%';
                    }else{
                         that.btnWith = '100%';
                    }
                    if(airline.length == 0){
                        that.showAirlineCard = false;
                        that.pnrError = true;
                    }
                    else{

                        that.showAirlineCard = true;
                        that.pnrError = false;
                        for(var i=0,l=airline.length;i<l;i++){
                            list.push({
                                flightNo: airline[i].flightNo,
                                arrAirport:airline[i].arrAirport,
                                arrival_time:airline[i].arrival_time,
                                depAirport:airline[i].depAirport,
                                departure_date: airline[i].departure_date,
                                departure_time: airline[i].departure_time,
                                Cabin: airline[i].cabin,
                                miles: airline[i].miles,

                                city1: airline[i].depAirport_CN,
                                city2:airline[i].arrAirport_CN,
                                air_crop: airline[i].air_crop
                            });
                            // that.changeDate(airline[i].departure_date);
                        }

                        for(var j=0,len=passenger.length;j<len;j++){
                            arr.push({
                                name: passenger[j].first_name +"/"+passenger[j].last_name,
                                ticketNum: passenger[j].ticket_number,
                                gender:  passenger[j].gender,
                            })
                        }

                        that.list = list;
                        that.passenger = arr;

                        that.parsePNR = response;
                    }


                })
            },
            //点击取消清空
            PNRCancle:function(){
                this.PNR = '';
                this.pnrError = false;
                this.showAirlineCard = false;
            },
            //点击提交表单
            PNRSubmit:function(){
                // var val = this.PNR;
                var val = JSON.stringify(this.parsePNR);
                var that = this;
                this.BTNloading = true;
                this.submitId = true;

                this.$http({
                    url: this.$comjs.IP +'/monitor/addPnrDownCab',
                    method: 'post',
                    data:{
                        text: Base64.encode(val)
                    }
                })
                    .then(response =>{
                        var data;
                        // console.log(response);
                        if(response.code == 200){
                            data=response.data;
                            this.$Notice.success({
                                desc:'订单下单成功',
                                duration: 6,
                            });
                            that.submitSuccess = true;
                            that.orderId = data;

                        }
                        that.BTNloading = false;
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },

            //复制订单Id
            CopyOrderId:function(){
                var clipboard = new Clipboard('.tag-read');
                clipboard.on('success', e => {
                    // 释放内存
                    clipboard.destroy();
                })
                clipboard.on('error', e => {
                    // 不支持复制
                    console.log('该浏览器不支持自动复制');
                    // 释放内存
                    clipboard.destroy()
                })
            },

        },
        watch:{
            PNR(newVal){
                if(newVal != ''){
                    this.showLoading = true;
                    this.getOrder(newVal);
                }
                else{
                    this.showLoading = false;
                    this.showAirlineCard = false;
                    this.list = [];
                    this.passenger = [];
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    @import '../assets/style/_variables';
    @import '../assets/style/_airlines';
    .bg{position: relative;}
    .bg,.bg>img{
        width: 100%;
    }
    .bg>img{height: 100%;}

    .bg>.bg_title{
        position: absolute;
        top: 12%;
        left: 50%;
        margin-left: -180px;
        color: #fff;
        text-align: center;
    }
    .bg>.bg_title>p{ font-size: 50px;}
    .bg>.bg_title>span{ font-size: 20px;}

    .searchBody{
        background: #fff;
        padding: 0 10px 30px 10px;
      // @extend .searchBody_Style;
    }
    .PnrSearchBody{
        @extend .searchBody_Style;
     /*   width: 100%;
        position: absolute;
        top: 240px;
        background: #fff;
        border-radius: 8px;
        padding: 0 10px 30px 10px;
        z-index: 101;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);*/
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
        text-align: left;
    }
    .tab1,.tab2{
        margin-top: 10px;
    }
    .introduce{
        margin-top: 120px;
    }
    .tab{
        margin-top: 10px;
    }
    .btn{
        margin-top: 10px;
        text-align: right;
    }
    .btnSubmit{margin-top: 0;}
    .tab>div>div.airline-info,.tab>div>div.form{
        float: left;
    }
    .tab>div>div.form{width: 30%;}
    .tab>div>div.airline-info{width: 66%;margin-left: 4%;}
    .tab>div:after,.airline-list:after{
        content: "";
        display: block;
        clear: both;
    }
    .tab .airline-info-card,.analyse .airline-info-card{
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        margin-bottom:20px;
        background: #fff;
    }
    .airline-list >div{
        float: left;
        width: 48%;
    }

     .airline-info-card:nth-child(even){
        margin-left: 4%;
    }

    .airline-info-card img{
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
    }

    .form .text-info,.example-pnr .text-info{
        margin-bottom: 10px;
        color: $warming;
    }

    .explain{
        float: right;
        /*position: absolute;*/
        /*right: 10px;*/
        /*top: 20px;*/
        /*padding: 2px 4px;*/
        /*height: 16px;*/
        /*width: 16px;*/
        /*line-height: 16px;*/
        /*border-radius: 50%;*/
        /*background: #2d8cf0;*/
        /*color: #fff;*/
        /*z-index: 10000000;*/
        /*text-align: center;*/
    }

    .airline-info .orderId{
        font-size: 14px;
        margin-top: 10px;
    }

    .airline-info .orderId span b{
        font-weight: normal;
        cursor: pointer;
        padding: 0 4px;
    }
    .airline-info .orderId span b:hover{
        background: #c5c8ce;
        /*color: #fff;*/
    }
    .example-pnr{
        color: #495060;
        margin-bottom: 10px;
    }
    .example-pnr>b{
        /*font-size: 16px;*/
        margin-right: 2px;
    }

    .analyse{
        background: #fff;
        margin-top: 20px;
        padding: 10px;
    }
</style>
