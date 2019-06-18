<template>
    <div class="calender">
        <ul class="calender-list clearfix">
            <li v-for="items in year">
                <div class="year">
                    {{items}}
                </div>
                <ul class="week clearfix" >
                    <li :class="{current:item == '周日'||item == '周六'}" v-for="item in week">{{item}}</li>
                </ul>
                <ul class="date clearfix">
                    <li  v-for="(item,index) in datelist[items]" :class="{notMargin: index == 6|| index == 13 || index ==20 || index == 27 || index == 34 ||index == 41}">
                        <div class="date_time" :class="{passDate: item.cur}">
                            <Badge :count="parseInt(item.num)" type="primary" v-if="!item.cur&&item.num!=0&&nowDate<item.fullDay">
                                <a href="javascript:void(0)" class="demo-badge" @click="getDetail(item.fullDay)">{{item.day}}</a>
                            </Badge>
                            <div v-else>{{item.day}}</div>
                        </div>
                    </li>
                </ul>
            </li>

        </ul>
    </div>

</template>

<script>
    export default {
        name: "Calender",
        data(){
            return {
                week: ['周日','周一','周二','周三','周四','周五','周六'],
                year: [],
                datelist:{},
                nowDate: '',
            }
        },
        created(){

            this.getYearMonth();

            this.getSchedule();
        },
        methods: {

            // 构造一年内的数据
            getYearMonth: function () {
                var now = new Date();
                var year = now.getFullYear();
                var Nmonth = now.getMonth() + 1,month,str,json = {},arr=[];
                // var str = year+"年"+month+"月";
                var fullYear = [];
                for(var i=0;i<(13-Nmonth);i++){
                    month = Nmonth+i;
                    str = year+"年"+month+"月";
                    arr = this.calender(year,month);
                    json[`${str}`] = arr;
                    fullYear.push(str);
                }
                year = fullYear.length==12?year:(year+1);
                for(var j = 1;j<Nmonth;j++){
                    month=j;
                    str = year+"年"+month+"月";
                    arr = this.calender(year,month);
                    json[`${str}`] = arr;
                    fullYear.push(str);
                }
                // this.datelist = json;

                this.year = fullYear;
                this.nowDate = new Date().getFullYear()+'-'+(Nmonth<10?'0'+Nmonth:Nmonth)+'-'+(new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate());
                this.datelist = json;
                return json;
            },

            //根据年月  获取当前的日历表
            calender(year,month) {
                var arr = [];

                //new data 有三个参数: 1,年 2.月 3.默认是1 如果是0,表示上个月最后一天 - 前两天 3 后天
                var nowMonthLength = new Date(year, month, 0).getDate();
                var nowMonthFirstWeek = new Date(year, month - 1).getDay();
                var lastMonthLength = new Date(year, month - 1, 0).getDate();

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
                            day: lastMonthLength,
                            cur: true,
                            num: 0,
                            fullDay: pyear+'-'+buling(pmonth)+'-'+buling(lastMonthLength),
                        });
                        lastMonthLength--;
                    }

                }else{
                    // 补充上个月的最后几天
                    while (nowMonthFirstWeek--) {
                        arr.unshift({
                            day: lastMonthLength,
                            cur: true,
                            num: 0,
                            fullDay: pyear+'-'+buling(pmonth)+'-'+buling(lastMonthLength),
                        });
                        lastMonthLength--
                    }
                }



                //本月天数
                var _a = 1;
                while (nowMonthLength--) {
                    arr.push({
                        day: _a,
                        cur: false,
                        num: 0,
                        fullDay: pyear+'-'+buling(month)+'-'+buling(_a)
                    });
                    _a++
                }

                //下个月补全
                var nextLength = arr.length > 35 ? 42 - arr.length : 42 - arr.length;
                _a = 1;
                while (nextLength--) {
                    arr.push({
                        day: _a,
                        cur: true,
                        num: 0,
                        fullDay: nyear+'-'+buling(nmonth)+'-'+buling(_a)
                    });
                    _a++
                }
                return arr;
            },


            //获取用户的日程信息
            getSchedule: function(){
                var that = this;
                this.$http({
                    url: this.$comjs.IP +'/schedule/statistics',
                    method: 'post',
                    data: {

                    }
                }).then(response =>{
                    if(response.code == 200){
                        var json = response.data;
                        var list = that.getYearMonth();
                        // that.datelist = list;
                        // console.log(list);

                        for(var i=0;i<json.length;i++){
                            for(var key in json[i]){
                                var day = key;
                                var str = day.split('-')[0]+"年"+parseInt(day.split('-')[1])+"月";
                                if(list[`${str}`] == ''||list[`${str}`] == null ||list[`${str}`] == undefined){ //返回的日程有些是过去的

                                }
                                else{
                                    for(var j=0,l=list[`${str}`].length;j<l;j++){
                                        if(list[str][j].day == parseInt(day.split('-')[2])){
                                            list[str][j].num = json[i][day];
                                        }
                                    }
                                }

                            }
                        }

                        this.datelist = list;
                    }

                });

            },


            // 用户点击日历事件
            getDetail: function(e){
                this.$emit('getDetail',e);
            },
        }


    }
</script>

<style>
    .ivu-badge-count{
        height: 18px!important;
        border-radius: 9px!important;
        min-width: 18px!important;
        font-size: 10px!important;
        line-height: 16px!important;
        padding: 0 4px!important;
    }
</style>
<style scoped lang="scss">
    @import "../assets/style/_variables.scss";

    .calender-list>li{
        float: left;
        width: 50%;
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
        height: 32px;
        line-height: 32px;
    }
    .date>li>.date_time{
        text-align: center;
        color: $Title;
        font-weight: bold;
    }
    .date>li>.date_time.passDate{
        color: $SubColor;
        font-weight: normal;
    }


    .demo-badge{
        width: 32px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #eee;
        border-radius: 6px;
        display: inline-block;
    }

</style>
