<template>
    <div class="search">
        <div class="tab1">
            <Row style="margin-bottom:15px;">
                <Col span="5" style="padding-right:10px">
                    <CitySelect :Title="leaveName" @getCity="getCity1" :cityName="city1"  v-if="refresh"></CitySelect>
                </Col>

                <Col span="1" style="text-align: center;">
                    <img src="../assets/images/icon.png" width="32" height="32" v-on:click="exchangeAirline">
                </Col>

                <Col span="5" style="padding-left:10px">
                    <CitySelect :Title="arriveName"  @getCity="getCity2" :cityName="city2"  v-if="refresh"></CitySelect>
                </Col>

                <Col span="5" style="padding-left:10px">
                    <DatePicker type="date" size="large" v-model="startDate" placeholder="出发日期" style="width: 200px" @on-change="getSearchDate" format="yyyy-MM-dd" :options="DatePickerOptions"></DatePicker>
                </Col>

                <Col span="8" align="right">
                    <Button type="primary" v-on:click="search" size="large">搜索</Button>
                </Col>
            </Row>
            <Row style="margin-bottom:15px;">
                <Select :Title="airlineTitle" :selectArr="airlineArr" @selectChange="getAirlineValue" :selectVal="airline" ></Select>
            </Row>

            <Row style="margin-bottom:15px;">
                <Select :Title="flightNumTile" :selectArr="flightArr" @selectChange="getflightNumValue" :selectVal="flightNumber" ></Select>
            </Row>

            <Row style="margin-bottom:8px;">
                <Select :Title="seatName" :selectArr="seatArr" @selectChange="getSeatValue" :selectVal="seats" ></Select>
            </Row>
        </div>
    </div>
</template>

<script>
    import Select from './Select';
    import CitySelect from './CitySelect';
    export default {
        name: "SearchflightNum",
        props: ['city1Name','city2Name','seat','Date','code1Name','code2Name','civilType','airlineN','flightNum'],
        components:{
            Select,
            CitySelect
        },
        data(){
            return {
                city1: this.city1Name,
                city2: this.city2Name,
                code1: this.code1Name,
                code2: this.code2Name,
                seats: this.seat,  //选择的舱位值
                startDate: this.Date,//开始时间
                civil: 0,       //国内或国际航线
                airline: this.airlineN,//搜索航司
                flightNumber: this.flightNum,//搜索的航班号

                seatArr: [],    //航司所属舱位数组
                airlineArr: [], //航司数组
                flightArr:[],  //航司所属航班号数组

                seatsArr: [],  //所有航司数组，所一一对应的舱位数组
                flightsArr: [],//所有航司数组，所一一对应的航班号数组

                //*****插件传名称*****
                leaveName:'出发',
                arriveName: '到达',
                seatName:'舱位',//舱位表单标题
                airlineTitle:'航司',
                flightNumTile:'航班号',

                refresh: true,

                //日期选择器不能选择的日期
                DatePickerOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
            }
        },
        created() {
            this.getAirline(this.code1,this.code2);
        },
        methods:{

            //获取舱位选择值
            getSeatValue:function(value){
                this.seats = value;
            },
            //获取航司的选择值
            getAirlineValue: function(value){
                this.airline = value;
                var index = this.airlineArr.indexOf(value);
                this.seatArr = this.seatsArr[index];
                this.flightArr = this.flightsArr[index];
            },
            //获取航班号的选择值
            getflightNumValue:function(val){
                this.flightNumber = val;
            },
            //获取日期
            getSearchDate:function(e){
                this.startDate = e;
            },

            // 获取航线信息  航司  座位 航班号
            getAirlineInfo: function(city1,city2){
                const arr = JSON.parse(localStorage.getItem('airline'));

                var airCompanyList = [];//航司

                var airArr = [];//航司及对应的座位数组 公务、头等
                var airNumArr = []; //航司对应的航班号数组

                var flightNum = ''; //航班号
                var SeatNum = ''; //座位号

                var civil = '';//区分国内航线或者国际航线

                for(var i=0,l=arr.length;i<l;i++){
                    // 去程信息
                    if(arr[i].departureAirport === city1 && arr[i].arrivalAirport === city2){
                        civil = arr[i].civil;
                        var NumArr = [];
                        for(var j=0,airl = arr[i].airCompanyList.length;j<airl;j++){
                            //航司
                            airCompanyList.push(arr[i].airCompanyList[j].airLineShortName);

                            //航司以及对应的座位
                            airArr.push(getSeat(arr[i].airCompanyList[j].airLineShortName));

                            //航司以及对应的航班号
                            for(var n=0,m = arr[i].airCompanyList[j].airFlightList.length ;n<m;n++){
                                NumArr.push(arr[i].airCompanyList[j].airFlightList[n].flightNo);
                            }
                            airNumArr.push(NumArr);
                            NumArr = [];
                        }
                    }
                }
                //获取航司可兑换的舱位
                function getSeat(name){
                    var airlineSeat = JSON.parse(localStorage.getItem('airlineSeats'));
                    var arr =[];
                    for(var i=0,len = airlineSeat.length;i<len;i++){
                        if(airlineSeat[i].airLineShortName==name){
                            for(var j=0,l=airlineSeat[i].cabs.length;j<l;j++){
                                arr.push(airlineSeat[i].cabs[j].description);
                            }
                            return arr;
                        }

                    }
                }


                if(airNumArr.length == 0){
                    flightNum = '';
                    SeatNum = '';
                }
                else {
                    flightNum = airNumArr[0];
                    SeatNum = airArr[0];
                }

                this.airlineArr = airCompanyList;//航司
                this.seatArr = SeatNum;//所属航司底下座位号数组
                this.flightArr = flightNum; //航班号
                this.civil = civil;

                this.seatsArr = airArr;
                this.flightsArr = airNumArr;
                // console.log(airCompanyList);
                // console.log(airArr); //所有座位号数组
                // console.log(airNumArr);//所有航班号数组
                // console.log(flightNum);//航班号
                // console.log(SeatNum);//座位号
                // console.log(civil);//国内，还是国际线标志
                //通过航线查询的舱位
            },

            //根据航线获取航司、航班号、舱位   -
            getAirline: function(code1,code2) {
                var that = this;
                //获取航司可兑换的舱位
                function getSeat(name){
                    var airlineSeat = JSON.parse(localStorage.getItem('airlineSeats'));
                    var arr =[];
                    for(var i=0,len = airlineSeat.length;i<len;i++){
                        if(airlineSeat[i].airLineShortName==name){

                            for(var j=0,l=airlineSeat[i].cabs.length;j<l;j++){
                                arr.push(airlineSeat[i].cabs[j].description);
                            }
                            return arr;
                        }

                    }
                }
                if(code1 != ''&&code2 != ''&&code1!=undefined&&code2!=undefined){
                    // 通过航线寻找航司跟航班号 ---去程
                    this.$http({
                        url:this.$comjs.IP+"/air/getAirInfoByAirline?departureAirport="+
                            code1+"&arrivalAirport="+code2,
                        method: 'get',
                    }).then(response =>{
                        if ( response.code == 200) {
                            var arr = response.data.airCompanyList;

                            var airCompanyList = [];//航司

                            var airArr = [];//航司及对应的座位数组 公务、头等
                            var airNumArr = []; //航司对应的航班号数组

                            var flightNum = ''; //航班号
                            var SeatNum = ''; //座位号

                            var civil = response.data.civil;

                            if(arr.length==0){
                                this.$Notice.error({
                                    desc:'请填写完整的信息！',
                                    duration: 3,
                                });
                            }
                            else{
                                for (var i = 0, l = arr.length; i < l; i++) {
                                    //航司
                                    airCompanyList.push(arr[i].airLineShortName);

                                    //航司对应的航班号   一个航司多个航班
                                    var NumArr= [];
                                    for (var n = 0, m = arr[i].airFlightList.length; n < m; n++) {
                                        NumArr.push(arr[i].airFlightList[n].flightNo);
                                    }
                                    airNumArr.push(NumArr);


                                    //航司以及对应的座位   一个函数一个舱位数组
                                    airArr.push(getSeat(arr[i].airLineShortName));
                                }
                                if(airNumArr.length == 0){
                                    flightNum = '';
                                    SeatNum = '';
                                }
                                else {
                                    flightNum = airNumArr[0];
                                    SeatNum = airArr[0];
                                }


                                that.civil = civil;
                                that.airlineArr = airCompanyList;//航司
                                that.seatArr = SeatNum;//所属航司底下座位号数组
                                that.flightArr = flightNum; //航班号


                                that.seatsArr = airArr;
                                that.flightsArr = airNumArr;
                            }

                        }
                    })
                        .catch(error => {
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => this.loading = false);
                }

            },

            //出发城市搜索
            getCity1:function(val){
                this.code1 = val.code;
                this.city1 = val.city;
            },
            //到达城市搜索
            getCity2:function(val){
                this.code2 = val.code;
                this.city2 = val.city;
            },

            //切换往返航线
            exchangeAirline:function(){
                var code1 = this.code1;
                var city1= this.city1;
                var code2 = this.code2;
                var city2 = this.city2;
                this.code1 = code2;
                this.code2 = code1;
                this.city1 = city2;
                this.city2 = city1;
                this.refreshChild();
            },

            // 提交表单
            search:function(){
                var str='',reg0='';
                str=this.code1+'/'+this.code2+'/'+this.seats+'/'+this.ToDateYear(this.startDate)+'/'+
                    this.civil+'/'+ this.city1 +'/'+this.city2+'/'+this.airline+'/'+this.flightNumber;
                reg0 = this.code1==''||this.code2==''||this.seats==''||this.startDate==''||this.flightNumber==''||this.airline=='';
                if(reg0){
                    this.$Notice.error({
                        desc:'请填写完整的信息！',
                        duration: 3,
                    });
                }else{
                    this.$emit('submitInfo',encodeURIComponent(str));
                }

            },

            //******** 时间戳转换为时间（2019-2-01）*******//
            ToDateYear: function(time){
                var now=new Date(time);
                var year=now.getFullYear();
                var month=now.getMonth()+1;
                var date=now.getDate();
                if (month >= 0 && month <= 9) {
                    month = "0" + month;
                }
                if (date >= 0 && date <= 9) {
                    date = "0" + date;
                }
                return year+"-"+month+"-"+date;

            },

            // 刷新子组件
            refreshChild () {
                this.refresh = false;
                setTimeout(() => {
                    this.refresh = true
                },0)
            }

        },
        computed:{
            cityWatch(){
                const { code1, code2 } = this;
                return {
                    code1,
                    code2
                }
            }
        },
        watch:{
            cityWatch:{
                handler:function(newVal){

                    if(newVal.code1!=''&&newVal.code2!=''){
                        this.getAirline(newVal.code1,newVal.code2);
                        this.airline = "";
                        this.seats = "";
                        this.flightNumber = "";
                    }
                },

            }
        },
    }
</script>

<style scoped>

</style>
