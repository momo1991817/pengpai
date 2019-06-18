<template>
    <div class="daily">
        <div class="select_body">
            <div class="searchCard">
                <Menu mode="horizontal" :theme="theme1" active-name="0" @on-select="menuTab">
                    <MenuItem name="0">
                        <Icon type="ios-people" />
                        推荐
                    </MenuItem>
                    <MenuItem name="1">
                        <Icon type="ios-search" />
                        搜索
                    </MenuItem>

                </Menu>
                <div class="search-body">

                    <div class="search-body-body" v-if="tab==1">
                        <Search @submitInfo="submitAirline"></Search>
                    </div>

                    <div class="search-body-recommend" v-else>
                        <Select v-model="airlineValue" prefix="ios-plane-outline" style="width:210px" @on-change="selectAirlineChange">
                            <!--<Option value="请选择">请选择</Option>-->
                            <Option v-for="item in airlineList" :value="item.value" :key="item.value">{{ item.label }}</Option>

                        </Select>
                    </div>
                </div>
            </div>
        </div>

        <div class="daily_body" v-if="!showLoading">
            <Card v-if="!vipmenber">
                <Alert type="error">主人我还没有权限！</Alert>
            </Card>
            <Card v-else>
                <!--<div class="attention">-->
                    <!--<b>注：</b>“/”指该日无此航班；热门航线余票每日采集2次，非实时数据，或存在少许误差。-->
                    <!--<span v-if="tab==0">系统默认推荐的热门航线。</span>-->
                <!--</div>-->

                <div class="daily_body_header">
                    {{city1}}-{{city2}} {{airline}}  {{flightNum}}
                    <Poptip word-wrap trigger="hover" width="200" content='“/”指该日无此航班；此功能甄选 国内-欧美澳 1200多条热门航线未来90天余票，全局掌握热门航线余票规律。
附：热门航线余票每日采集2次，非实时数据，或存在少许误差。' v-if="tab==1">
                        <span>?</span>
                    </Poptip>

                    <Poptip word-wrap trigger="hover" width="200" content='“/”指该日无此航班；该航线为系统默认推荐的热门航线。附：热门航线余票每日采集2次，非实时数据，或存在少许误差。' v-else>
                        <span>?</span>
                    </Poptip>


                </div>
                <div v-if="showDataList">
                    <div class="daily_list" v-for="flightNum in flightNumArr">
                        <!--<div class="daily_title"><span>{{flightNum}}</span></div>-->

                        <ul class="calender-list clearfix">
                            <li v-for="items in year">
                                <div class="year">
                                    {{items}}
                                </div>
                                <ul class="week clearfix" >
                                    <li :class="{current:item == '周日'||item == '周六'}" v-for="item in week">{{item}}</li>
                                </ul>
                                <ul class="date clearfix">
                                    <li  v-for="(item,index) in flightNumData[flightNum][items]" :class="{notMargin: index == 6|| index == 13 || index ==20 || index == 27 || index == 34 ||index == 41}">
                                        <div class="date_time" :class="{passDate: item.cur}">
                                            {{item.date}}
                                        </div>
                                        <div v-if="!item.cur&&!item.passDate">
                                            <div class="cabin" :class="{cabinHasVal:item.bussinessClass!=0}" v-if="item.bussinessClass!=undefined">
                                                公：{{item.bussinessClass}}
                                            </div>

                                            <div v-if="ShowFirstCabin">
                                                <div class="cabin" :class="{cabinHasVal:item.firstClass!=0}" v-if="item.firstClass!=undefined">
                                                    头：{{item.firstClass}}
                                                </div>

                                                <div class="cabin" v-else style="padding: 8px 0;">/</div>
                                            </div>

                                        </div>


                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>

                <div v-else>
                    <Alert type="warning">该航线非系统热门航线，请重新选择。</Alert>
                </div>
            </Card>
        </div>

        <Card v-else>
            <div class="demo-spin-col" >

                <Spin fix>
                    <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                    <div>加载中···</div>
                </Spin>

            </div>
        </Card>

    </div>

</template>

<script>
    import Search from './../views/SearchAccrodingAriline';
    export default {
        name: "ArilineDaily",
        components:{
            Search
        },
        data(){
            return {
                tab: 0, //菜单栏
                theme1: 'light',

                week: ['周日','周一','周二','周三','周四','周五','周六'],
                year: [],
                datelist:{},

                flightNumData: {},//拥有航班号的数据
                flightNumArr: [], //航班号数组

                // 表单参数
                city1:'北京首都',
                city2:'洛杉矶',
                code1:'PEK',
                code2:'LAX',
                airline: '国航', //航司
                airlineCode: 'CA',//航司代码
                civil: '0',  //国内或者国际航线
                flightNum: 'CA987',

                showLoading: false,
                airlineValue: 0, //航线值

                airlineList: [],  //10条可选航线

                ShowFirstCabin: true,

                vipmenber: true,

                showDataList: true, //请求是热门航线
            }
        },
        created(){
            // this.axios(this.code1, this.code2, this.airlineCode, this.civil,this.flightNum);
            this.getMenberInfo();
        },
        methods: {
            //获取10天航线信息并且默认展示第一条
            getTenAirline: function(){
                var that = this;
                this.$http({
                    url: this.$comjs.IP + '/report/getTop10AirHotLineFlight',
                    method: 'get',
                })
                .then(response => {
                    var airlineList = [];
                    var data = response.data;
                    for(var i=0,l=data.length;i<l;i++){
                        airlineList.push({
                            label:data[i].depCityName+'-'+data[i].arrCityName+" "+data[i].airLineShortName+data[i].flightNo,
                            value:i,
                            code1: data[i].departureAirport,
                            code2: data[i].arrivalAirport,
                            city1: data[i].depCityName,
                            city2: data[i].arrCityName,
                            airline: data[i].airline,
                            airlineName: data[i].airLineShortName,
                            civil: data[i].isCivil,
                            flightNumber: data[i].flightNo
                        });
                    }
                    this.code1= airlineList[0].code1;
                    this.code2= airlineList[0].code2;
                    this.city1 = airlineList[0].city1;
                    this.city2 = airlineList[0].city2;
                    this.airline = airlineList[0].airlineName;
                    this.airlineCode = airlineList[0].airline;
                    this.flightNum = airlineList[0].flightNumber;

                    that.airlineList = airlineList;
                    that.axios(airlineList[0].code1,airlineList[0].code2,airlineList[0].airline,airlineList[0].civil,airlineList[0].flightNumber,"1");
                })
            },

            //当下拉框选择者指发生变化时
            selectAirlineChange:function(e){
                var selectList = this.airlineList[e];
                var code1 = selectList.code1;
                var code2 = selectList.code2;
                var airline = selectList.airline;
                var flightNo = selectList.flightNumber;
                var civil = selectList.civil;
                this.city1 = selectList.city1;
                this.city2 = selectList.city2;
                this.airline = selectList.airlineName;
                this.flightNum = selectList.flightNumber;
                if(airline == 'UA'){
                    this.ShowFirstCabin = false;
                }else{
                    this.ShowFirstCabin = true;
                }
                this.axios(code1,code2,airline,civil,flightNo,"1");
            },

            //监控条件搜索切换事件
            menuTab:function(name){
                this.tab = name;
            },

            //通过航线搜索90天余票推荐表
            submitAirline: function (val) {
                var arr = decodeURIComponent(val).split("/");

                var code1 = arr[0];
                var code2 = arr[1];
                var airline = arr[2];
                var civil = arr[3];

                this.code1 = code1;
                this.code2 = code2;
                this.city1 = arr[4];
                this.city2 = arr[5];
                this.airline = airline;
                this.airlineCode = arr[6];
                this.flightNum = arr[7];
                if(arr[6]=='UA'){
                    this.ShowFirstCabin = false;
                }else{
                    this.ShowFirstCabin = true;
                }

                if(civil == 0){
                    this.axios(code1,code2,arr[6],civil,arr[7],"0");
                }else{
                    this.$Notice.error({
                        title: '余票列表只支持国际航线！',
                        duration: 3
                    });
                }

            },

            //请求后端数据
            axios: function (code1, code2, airline,civil,flightNo,recommend) {
                this.flightNumData = {};
                this.showLoading = true;
                var that = this;
                // this.list = [];

                this.$http({
                    url: this.$comjs.IP + '/report/getAirCalendarReportInSomeTime?departureAirport='+code1+
                    '&arrivalAirport='+code2+'&civil='+civil+'&flightNo='+flightNo+'&airline='+airline+'&isRecommend='+recommend,
                    method: 'get',
                })
                    .then(response => {
                        if(JSON.stringify(response.data)=='{}'){
                            // this.$Notice.warning({
                            //     desc:'该航线非系统热门航线，请重新选择。'
                            // });
                            that.showDataList = false;
                        }
                        else{
                            that.showDataList = true;
                            // json根据返回的年月构造日历表
                            //monthArr 显示在页面上头部的年月
                            var list = response.data,data = {},flightNumber = [],
                                json ={},monthArr=[];

                            // 构造指定的日历
                            for(var flight in list){
                                for(var day in list[flight]){
                                    var year = day.split('年')[0];
                                    var month = day.split('年')[1].split('月')[0];
                                    json[`${day}`]  = that.calender(year,month);
                                    monthArr.push(day);
                                }
                            }

                            for(var flightNum in list){
                                // date_list = JSON.parse(JSON.stringify(that.datelist));
                                flightNumber.push(flightNum);
                                for(var date in list[flightNum]){
                                    var arr = list[flightNum][date];
                                    var date_list_arr = json[date];

                                    for(var i =0,l = arr.length;i<l;i++){
                                        for(var j=0,len = date_list_arr.length;j<len;j++){
                                            if(arr[i].flightDay == date_list_arr[j].date){
                                                json[`${date}`][j]['firstClass'] = arr[i]['firstClass'];
                                                json[`${date}`][j]['bussinessClass'] = arr[i]['bussinessClass'];
                                            }
                                        }
                                    }
                                }
                                data[flightNum] =json;
                            }
                            that.flightNumArr = flightNumber;
                            that.flightNumData = data;
                            that.year = monthArr;
                            that.vipmenber = true;
                        }

                       if(response.code == -17){
                            that.vipmenber = false;
                        }
                        that.showLoading = false;
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },


            //根据年月  获取当前的日历表
            calender(year,month) {
                var arr = [];
                month = parseInt(month);

                //new data 有三个参数: 1,年 2.月 3.默认是1 如果是0,表示上个月最后一天 - 前两天 3 后天
                var nowMonthLength = new Date(year, month, 0).getDate();
                var nowMonthFirstWeek = new Date(year, month - 1).getDay();
                var lastMonthLength = new Date(year, month - 1, 0).getDate();

                var nowDate = new Date().getDate();
                var nowMonth = new Date().getMonth()+1;

                // this.month = parseInt(this.month);
                //每个月的上一个月是哪一年的那一个月
                var pmonth = month == 1 ? 12 :month - 1;
                //上一年
                var pyear = month == 1 ? year - 1 : year;
                //下一月
                var nmonth = month == 12 ? 1 : month + 1;
                //下一月
                var nyear = month == 12 ? year + 1 : year;
                //补零函数
                function buling(n) {
                    return parseInt(n) >=10 ? n : '0' + n;
                }
                //补充上个月日期
                if(nowMonthFirstWeek ==0 ){
                    //添加上个月的日期
                    for(var m=0;m<7;m++){
                        arr.unshift({
                            date: lastMonthLength,
                            cur: true,
                            passDate: false,
                            fullDay: pyear+'-'+buling(pmonth)+'-'+buling(lastMonthLength),
                        });
                        lastMonthLength--;
                    }

                }
                else{
                    // 补充上个月的最后几天
                    while (nowMonthFirstWeek--) {
                        arr.unshift({
                            date: lastMonthLength,
                            cur: true,
                            passDate: false,
                            fullDay: pyear+'-'+buling(pmonth)+'-'+buling(lastMonthLength),
                        });
                        lastMonthLength--
                    }
                }

                //本月天数
                var _a = 1;


                if(month == nowMonth){
                    //过去的日期
                    while (nowMonthLength--&&_a<nowDate) {
                        arr.push({
                            date: _a,
                            cur: false,
                            passDate: true,
                            fullDay: pyear+'-'+buling(month)+'-'+buling(_a)
                        });
                        _a++
                    }
                    nowMonthLength++;

                    while (nowMonthLength--&&_a>=nowDate) {
                        arr.push({
                            date: _a,
                            cur: false,
                            passDate: false,
                            fullDay: pyear+'-'+buling(month)+'-'+buling(_a)
                        });
                        _a++
                    }
                }else{
                    while (nowMonthLength--) {
                        arr.push({
                            date: _a,
                            cur: false,
                            passDate: false,
                            fullDay: pyear+'-'+buling(month)+'-'+buling(_a)
                        });
                        _a++
                    }
                }

                //下个月补全
                var nextLength = arr.length > 35 ? 42 - arr.length : 42 - arr.length;
                _a = 1;
                while (nextLength--) {
                    arr.push({
                        date: _a,
                        cur: true,
                        passDate: false,
                        fullDay: nyear+'-'+buling(nmonth)+'-'+buling(_a)
                    });
                    _a++
                }
                return arr;
            },

            //获取用户信息
            getMenberInfo:function(){
                var that = this;
                this.$http({
                    method: 'get',
                    url: this.$comjs.IP+'/user/getphoneemail',
                })
                    .then(response => {
                        var data = response.data;

                        if(data.flag){ //用户是会员
                            that.vipmenber = true;
                            // 调用热门推荐航线
                            that.getTenAirline();

                        }else{//用户不是会员
                            that.vipmenber = false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);

            },
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/style/_variables.scss";
    .daily{
        padding-top: $topMenu;
    }
    .searchCard{
        border: 1px solid $Divider;
        border-radius: 4px;
        background: #fff;
        padding: 0 10px 10px;
    }
    .search-body {
        margin-top: 15px;
    }

    .search-body-recommend{
        text-align: center;
    }
    .daily_body_header{
        text-align: center;
        margin: 10px 0;
        font-size: 20px;
    }

    .schedule>div{
        float: left;
    }

    .calender-list>li{
        float: left;
        width: 33.3333%;
        padding: 20px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .week>li,.date>li{
        float: left;
        width: 12%;
    }

    .week>li{
        background: #DCEDEA;
        border-radius: 2px;
        text-align: center;
        font-weight: bold;
        font-size: 12px;
    }
    .week>li.current{color: $error;}
    .week>li:not(:last-child),.date>li{
        margin-right: 2.66666%;
    }

    .date>li.notMargin{margin-right: 0;}
    .year{
        margin-bottom: 10px;
        font-size: 20px;
        text-align: center;
        font-weight: bold;
    }

    ul.date{margin-top: 16px;}
    .date>li{
        margin-bottom: 16px;

        height: 54px;
        /*line-height: 32px;*/
    }
    .date>li>.date_time{
        text-align: center;
        color: $Title;
        font-weight: bold;
        font-size: 14px;
    }
    .date>li>.date_time.passDate{
        color: $SubColor;
        font-weight: normal;
    }
    .date .cabin{
        color: $SubColor;
        font-size: 10px;
        text-align: center;
    }
    .date .cabin.cabinHasVal{
        color: $error;
    }
    .daily_title {
        text-align: center;
        font-weight: bold;
        font-size: 24px;
    }
    .daily_title>span{
        padding: 2px 5px;
        background: $primaryColor;
        color: #fff;
        border-radius: 5px;
    }

        /*筛选*/
    .select_body{
        margin-bottom: 10px;
    }

    .daily_select{
        text-align: center;
        /*margin-bottom: 20px;*/
    }
   .attention{
       font-size: 14px;
       padding-left: 20px;
       /*text-align: right;*/
       color: $warming;
   }
    .daily_body_header span{
        display: inline-block;
        width: 20px;
        height: 20px;
        line-height: 20px;
        background: $primaryColor;
        color: #fff;
        border-radius: 50%;
    }


</style>
