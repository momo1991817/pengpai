<template>
    <div class="CompleteOrder">

        <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="selectMenu">
            <MenuItem name="1">
                <Icon type="md-list-box" />
                全部订单
            </MenuItem>
            <MenuItem name="4">
                <Icon type="ios-alarm" />
                监控中
            </MenuItem>
            <!--<MenuItem name="2">-->
                <!--<Icon type="ios-checkmark-circle" />-->
                <!--监控成功-->
            <!--</MenuItem>-->
            <Submenu name="2">
                <template slot="title">
                    <Icon type="ios-checkmark-circle" />
                    监控成功
                </template>
                <MenuItem name="2-1">已处理</MenuItem>
                <MenuItem name="2-2">未处理</MenuItem>
            </Submenu>
            <MenuItem name="3">
                <Icon type="ios-close-circle" />
                监控失败
            </MenuItem>
        </Menu>


        <div class="searchContent" >
            <div class="searchBody" v-if="menu == 1">
                <!--<Select v-model="selectItem" style="width:100px">-->
                    <!--<Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                <!--</Select>-->
                <!--<Input v-model="inputValue" :placeholder="inputPlaceHolder" clearable style="width: 200px;margin-left: 15px;" />-->
                <!--<DatePicker type="date" placeholder="开始时间" style="width: 200px;margin-left: 15px;"></DatePicker>-->
                <!--<span>-</span>-->
                <!--<DatePicker type="date" placeholder="结束时间" style="width: 200px"></DatePicker>-->
                <!--<Button type="info">提交</Button>-->
                <Row>
                    <Col span="2">
                        <Select v-model="selectItem" style="width:100px" @on-change="selectItemChange">
                            <Option v-for="item in selectList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                    <Col span="5" v-if="showInput">
                        <Input v-model="inputValue" :placeholder="inputPlaceHolder" clearable @on-clear="clearInput" style="width: 200px;margin-left: 15px;" @keyup.enter.native="submitSearch"/>
                    </Col>
                    <Col span="10" v-else>
                        <DatePicker type="date" placeholder="开始时间" v-model="startDate" format="yyyy-MM-dd" @on-change="getStartDate"  style="width: 200px;margin-left: 15px;"></DatePicker>
                        <span>-</span>
                        <DatePicker type="date" placeholder="结束时间" v-model="endDate" format="yyyy-MM-dd" @on-change="getEndDate" style="width: 200px"></DatePicker>
                    </Col>
                    <Col span="2">  <Button type="info" @click="submitSearch" >提交</Button></Col>
                    <!--<Col><div class="infoError" v-if="showInfo">{{infoContent}}</div></Col>-->
                </Row>
            </div>

            <div class="title">
                <Row>
                    <Col span="4" align="left">订单号/下单时间</Col>
                    <Col span="2" align="left">订单类型</Col>
                    <Col span="2" align="left">航班信息</Col>
                    <Col span="4" align="left">起飞时间</Col>
                    <Col span="3" align="left">到达时间</Col>
                    <Col span="3" align="left">舱位信息</Col>
                    <Col span="2" align="left">订单状态</Col>
                    <Col span="4" align="left">操作</Col>
                </Row>
            </div>

            <div v-if="!showLoading">
                <div class="list" v-for="item in list">
                    <Row align="middle">
                        <Col span="4" align="left">
                            <div class="order-time">
                                <b>{{item.orderId}}</b><br>
                                <span>{{item.createTime}}</span>
                            </div>
                        </Col>
                        <Col span="2" align="left">
                            <div class="order-type">
                                {{item.type==0?'余票订单':'降舱订单'}}
                            </div>
                        </Col>
                        <Col span="2" align="left">
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
                                <Tooltip :content="item.ticket" placement="top-start" max-width="100%" v-if="item.type">
                                    <span> {{item.ticket}}</span>
                                </Tooltip>
                                <span v-else> {{item.ticket}}</span>
                            </div>
                        </Col>
                        <Col span="2" align="left">
                            <div class="order-status">
                                {{item.status}}
                            </div>
                        </Col>
                        <Col span="4">
                            <div class="airline-btn">
                                <Button type="warning" icon="ios-trash-outline" @click="bindDelect(item.createTimeStamp,item.orderId,item.status)">删除</Button>
                                <Button type="info" icon="ios-search"  v-on:click="bindOrderClick(item.orderId)">查看</Button>
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

        <!--删除弹窗-->
        <Modal v-model="DelectModal" :mask-closable="false" :closable="false" title="确认删除">
            <div>
                删除后数据无法恢复！
            </div>

            <div slot="footer">
                <Button type="primary" size="large" @click="bindDelectOK">确定</Button>
                <Button  size="large" @click="bindDelectCancle">取消</Button>
            </div>

        </Modal>

        <!--备注弹窗-->
        <!--<Modal v-model="EditModal" :mask-closable="false" :closable="false" title="编辑">-->
            <!--<div>-->
                <!--<Input v-model="textarea" type="textarea" :autosize="{minRows: 2}" placeholder="请编辑"></Input>-->
            <!--</div>-->

            <!--<div slot="footer">-->
                <!--<Button  size="large" @click="bindEditCancle">取消</Button>-->

                <!--<Button type="primary" size="large" @click="bindEditOK">确定</Button>-->

            <!--</div>-->

        <!--</Modal>-->

    </div>

</template>

<script>
    export default {
        name: "CompleteOrder",
        data(){
            return {
                theme1: 'light',
                total: 0,
                showLoading: false,
                menu: "1",
                screenHeight: 0,

                DelectModal: false,//显示删除窗口
                editOrderId: '',//删除的订单ID
                orderDateStamp: '',//要删除定的下单时间

                // doneOrder: false, //监控成功的订单
                // EditModal: false,//用户编辑窗口
                textarea: '',//用户编辑的内容

                selectItem: 'orderId', //用户选择搜索的类型
                inputValue: '',//输入框值
                startDate: '', //开始日期
                endDate: '', //结束日期
                inputPlaceHolder: '请输入',//输入框文本
                showInput: true,
                // infoContent: '搜索有误!',//搜索有误
                // showInfo: false, //控制用户搜索有误

                selectList: [
                    {
                        value: 'orderId',
                        label: '订单号'
                    },
                    {
                        value: 'time',
                        label: '下单时间'
                    },
                    {
                        value: 'airline',
                        label: '航司'
                    },
                    {
                        value: 'flightNum',
                        label: '航班号'
                    },
                ]
            }
        },
        created(){
            this.getDataList(1,1);
        },
        mounted () {
            this.getScreenHeight();
        },
        methods: {
            //获取屏幕高度
            getScreenHeight: function(){
                var h = document.getElementsByClassName('CompleteOrder')[0].offsetHeight;
                //407包括  header 60 footer 80
                var bodyH = (window.innerHeight - 407);

                if(h<bodyH){
                    this.screenHeight = bodyH +'px';
                }
                else{
                    this.screenHeight = h +'px';
                }

            },

            //点击订单进行跳转
            bindOrderClick:function(value){
                // console.log(value);
                // this.$router.push({path:'/order/detail/'+value});

                let routeData = this.$router.resolve({
                    name: "OrderDetail",
                    params:{id:value}
                });
                window.open(routeData.href, '_blank');
                //查看详情，另起一页
            },

            //根据导航不一致  请求不一样的数据
            getDataList:function(page,type) {//type 1,全部订单，2监控成功，3监控失败
                var data = {};
                if(type== 1){
                    data = {
                        userId: this.$userId,
                        status: '',
                        limit: 10,
                        page: page
                    }
                }
                else if (type == 2){//成功
                    data = {
                        userId:this.$userId,
                        status: 1,
                        limit: 10,
                        page: page,
                        success: 4
                    }
                }
                else if (type == '2-1'){//已处理
                    data = {
                        userId:this.$userId,
                        status: 1,
                        limit: 10,
                        page: page,
                        success: 4,
                        isSolution: true,
                    }
                }
                else if (type == '2-2'){//未处理
                    data = {
                        userId:this.$userId,
                        status: 1,
                        limit: 10,
                        page: page,
                        success: 4,
                        isSolution: false,
                    }
                }
                else if (type == 3){//失败
                    data = {
                        userId: this.$userId,
                        status: 1,
                        limit: 10,
                        page: page,
                        success: 3
                    }
                }
                else if (type == 4){//监控中
                    data = {
                        userId: this.$userId,
                        status: 0,
                        limit: 10,
                        page: page
                    }
                }

                this.showLoading = true;
                this.axios(data);

            },

            //请求数据
            axios: function(data){
                var that = this;
                this.$http({
                    url: this.$comjs.IP+'/monitor/list',
                    method: 'post',
                    data: data,
                })
                    .then(response => {
                        this.total = parseInt(response.count);
                        if(response.code == 200){
                            var list = [];
                            var data = response.data;
                            // var len = that.data.list.length;
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
                                    createTimeStamp: data[i].createTime,
                                    ticket: data[i].type==0?'需求人数'+data[i].count+'人':data[i].status==0?'':data[i].remark,
                                    seat: data[i].level=='升舱'?data[i].code+data[i].level:data[i].type==0?data[i].level:data[i].code+'舱',
                                    orderId: data[i].id,
                                    type: data[i].type,
                                    status: data[i].status==1?'已完成':data[i].type==1&&data[i].remark!=''?'继续监控':'监控中',
                                    solution: data[i].solution==''?'未处理':'已处理'
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
            //********end


            getPage: function(e){
                var type = this.menu;
                this.getDataList(e,type);

            },

            //选择菜单时的事件
            selectMenu:function(e){
                this.menu = e;
                if(e == "1"){
                    this.getDataList(1,1);
                    // this.doneOrder = false;
                }
                else if( e=="2"){
                    this.getDataList(1,2);
                    // this.doneOrder = true;
                }
                else if(e=="2-1"){
                    this.getDataList(1,'2-1');
                }else if(e=="2-2"){
                    this.getDataList(1,'2-2');
                }
                else if(e=="3"){
                    this.getDataList(1,3);
                    // this.doneOrder = false;
                }
                else if(e=="4"){
                    this.getDataList(1,4,'');
                    // this.doneOrder = false;
                }
            },

            //订单搜索中 下拉选择菜单
            selectItemChange:function(e){
                this.inputValue = '';
                this.showInfo = false;
                if(e == 'time'){
                    this.showInput = false;
                }
                else if(e == 'airline'){
                    this.showInput = true;
                    this.inputPlaceHolder = '请输入航司英文简称';
                }
                else {
                    this.showInput = true;
                    this.inputPlaceHolder = '请输入';
                }
            },

            //用户点击删除
            bindDelect:function(time,id,status){
                this.editOrderId = id;
                this.orderDateStamp = time;
                this.DelectModal = true;
                if(status == '监控中'&&!this.NowCompareCreate()){
                    this.$Notice.error({
                        desc:'订单已提交超过30分钟，不能取消！'
                    });
                    this.DelectModal = false;
                }
            },
            //用户确定删除
            bindDelectOK:function(){
                var id = this.editOrderId;
                var that = this;
                this.$http({
                    url: this.$comjs.IP +"/monitor/delete/"+id,
                    method: 'get',
                })
                    .then(response => {
                        if(response.code == 200){
                            this.$Notice.info({
                                title: '删除成功！',
                            });
                            that.DelectModal = false;
                            that.getDataList(1,that.menu);
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
                this.editOrderId = '';
                this.DelectModal = false;
            },
            //用户要进行订单标注
            bindRemark: function(id){
                this.editOrderId = id;
            },


            //用户取消编辑
            bindEditCancle: function(){
                this.editOrderId = '';
            },

            //计算当前时间是否超过下单30分钟
            NowCompareCreate: function(){
                var nowStamp = new Date().getTime();
                var createStamp = this.orderDateStamp;
                var addTimeStamp = createStamp + 30*60*1000;
                return nowStamp<addTimeStamp;
            },

            //获取开始日期
            getStartDate:function(e){
                this.startDate = e;
            },

            //获取结束日期
            getEndDate:function(e){
                this.endDate = e;
            },

            //清空输入框事件
            clearInput: function(){
                // this.getDataList(1,1);
            },

            //提交搜索内容
            submitSearch:function(){
                var data = {};
                // 验证输入内容的正确性
                var val = (this.inputValue).replace(/(^\s*)|(\s*$)/g, "");
                if(this.selectItem == 'airline'&&(!/^[a-zA-Z]+$/.test(val))){
                    this.$Message.error('航司搜索仅支持航司代码查询！');
                }
                else if(this.selectItem == 'orderId'&&!(/^[0-9]+$/.test(val))){
                    this.$Message.error('请输入正确的订单号！');
                }

                else{
                    this.showInfo = false;
                    if(this.selectItem == 'orderId'){//用户用订单Id搜索
                        data = {
                            userId: this.$userId,
                            // status: '',
                            limit: 10,
                            page: 1,
                            orderId: val
                        }
                    }
                    else if(this.selectItem == 'time'){ //日期搜索
                        data = {
                            userId: this.$userId,
                            // status: '',
                            limit: 10,
                            page: 1,
                            beginTime: this.startDate,
                            endTime: this.endDate
                        }
                    }
                    else if(this.selectItem == 'airline'){ //日期搜索
                        // val = val.toUpperCase();
                        data = {
                            userId: this.$userId,
                            // status: '',
                            limit: 10,
                            page: 1,
                            airline: val.toUpperCase()
                        }
                    }
                    else if(this.selectItem == 'flightNum'){ //日期搜索
                        data = {
                            userId: this.$userId,
                            // status: '',
                            limit: 10,
                            page: 1,
                            flightNo: val.toUpperCase()
                        }
                    }
                    this.axios(data);
                }


            },
        }
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
    .searchContent{
        margin-top: 20px;
    }
    .order-title{
        @extend .global-title;
    }

    .order-title:before {
      @extend .global_b_bar;
    }
    .order-status span{
        height: 50px;
        overflow: hidden;
    }
    .order-time >b{
        font-weight: normal;
    }

    .searchContent .searchBody{
        /*width: 400px;*/
        margin-bottom: 20px;
    }
    .searchBody span{
        margin: 0 15px;
    }
    .infoError{
        color: $error;
        height: 32px;
        line-height: 32px;
    }

</style>
