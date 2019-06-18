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
                    <Button type="primary" size="large" v-on:click="search" :disabled="disable">提交</Button>
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
        name: "SearchDropdown",
        props: ['disable'],
        components:{
            Select,
            CitySelect
        },
        data(){
            return {
                city1: '',
                city2: '',
                code1: '',
                code2: '',
                seats: '',  //选择的舱位值
                startDate: '',//开始时间
                civil: 0,       //国内或国际航线
                airline: '',//搜索航司
                airlineCode: '',//航司的英文名
                flightNumber: '',//搜索的航班号

                seatArr: [],    //航司所属舱位数组
                airlineArr: [], //航司数组
                airCompanyCode:[],//字母航司
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
            // this.getAirlineInfo(this.code1,this.code2);
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
                this.airlineCode = this.airCompanyCode[index];
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

            //通过航线查询对应的航司及航班号
            getAirline: function(code1,code2) {
                var that = this;
                // 通过航线寻找航司跟航班号
                this.$http
                    .get(this.$comjs.IP+'/air/getDownCabAirLineByLine?departureAirport='+code1+"&arrivalAirport="+code2)
                    .then(response => {
                        if ( response.code == 200) {

                            if(response.data.length==0){
                                this.$Notice.error({
                                    desc:'没有该航线信息！',
                                    duration: 3,
                                });
                            }
                            else{
                                var arr = response.data[0].airCompanyList;
                                var airCompanyList = [];//航司
                                var airCompanyCode = [];//航司代码
                                var airArr = [];//航司及对应的座位数组 A、F、O、I
                                var airNumArr = []; //航司对应的航班号数组

                                for (var i = 0, l = arr.length; i < l; i++) {
                                    //航司
                                    airCompanyList.push(arr[i].airLineShortName);
                                    airCompanyCode.push(arr[i].airline);

                                    //航司以及对应的座位   一个函数一个舱位数组

                                    var cabs = [],cabsData = arr[i].airFlightList[0].cabs;
                                    for(var a=0,b = cabsData.length;a<b;a++){
                                        cabs.push(cabsData[a].code);
                                    }
                                    airArr.push(cabs);
                                    //航司对应的航班号   一个航司多个航班
                                    var NumArr= [];
                                    for (var n = 0, m = arr[i].airFlightList.length; n < m; n++) {
                                        NumArr.push(arr[i].airFlightList[n].flightNo);
                                    }
                                    airNumArr.push(NumArr);
                                }
                                that.airlineArr = airCompanyList;  //航司
                                that.airCompanyCode =airCompanyCode;
                                that.seatsArr = airArr; //航线包括的航司所在的座位数组
                                // that.seats = SeatNum;//航班号对应的数组

                                that.flightsArr = airNumArr;//航线包括的航司航班号数组
                                // that.flightNumber = flightNum; //选择航班号
                            }

                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
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
                str=this.code1+'/'+this.code2+'/'+this.seats+'/'+this.startDate+'/'+
                    this.civil+'/'+ this.city1 +'/'+this.city2+'/'+this.airlineCode+'/'+this.flightNumber;
                reg0 = this.code1==''||this.code2==''||this.seats==''||this.startDate==''||this.flightNumber==''||this.airline=='';
                if(reg0){
                    this.$Notice.error({
                        desc:'请填写完整的信息！',
                        duration: 3,
                    });

                }else{
                    this.$emit('submitInfo',str);
                }
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
                    }
                },

            }
        },
    }
</script>

<style scoped>

</style>
