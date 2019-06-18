<template>
    <div class="search">
        <Row >

            <Col span="5" style="padding-right:10px">
                <div class="offset">
                    <CitySelect :Title="leaveName" @getCity="getCity1" :cityName="cityName1" v-if="refresh"></CitySelect>
                </div>
            </Col>

            <Col span="1" style="text-align: center;" class="searchImg">
                <img src="../assets/images/icon.png" width="32" height="32" v-on:click="exchangeAirline">
            </Col>

            <Col span="5" style="padding-left:10px">
                <div class="offset">
                    <CitySelect :Title="arriveName"  @getCity="getCity2" :cityName="cityName2" v-if="refresh"></CitySelect>
                </div>
            </Col>

            <Col span="5" style="padding-left:10px">
                <Select :Title="airlineTitle" :selectArr="airlineArr" @selectChange="getAirlineValue" :selectVal="airlineN"></Select>
            </Col>

            <Col span="5" style="padding-left:10px">
                <Select :Title="flightNumTile" :selectArr="flightArr" @selectChange="getflightNumValue" :selectVal="flightNum"></Select>
            </Col>


            <Col span="3" align="right">
                <Button type="primary" size="large" v-on:click="search">搜索</Button>
            </Col>
        </Row>

    </div>
</template>

<script>
    import Select from './Select';
    import CitySelect from './CitySelect';
    export default {
        name: "SearchAccrodingAriline",
        props: ['city1Name','city2Name','airlineN','code1Name','code2Name','civilType','flightNum'],
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

                civil: this.civilType,

                cityName1: this.city1Name,
                cityName2: this.city2Name,


                airlineArr: [], //航司数组
                flightsArr: [],//所有航司数组，所一一对应的航班号数组

                airlineCodeArr: [],//航司代码数组
                flightArr:[],  //航司所属航班号数组

                airline: this.airlineN,
                airlineCode: '',
                flightNumber: this.flightNum,//搜索的航班号

                //*****插件传名称*****
                leaveName:'出发',
                arriveName: '到达',
                airlineTitle:'航司',
                flightNumTile:'航班号',

                refresh: true,
            }
        },
        created(){
            this.getAirline(this.code1,this.code2);
        },
        methods: {
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

            //根据航线获取航司、航班号、舱位   -
            getAirline: function(code1,code2) {
                var that = this;

                // 通过航线寻找航司
                this.$http({
                    url:this.$comjs.IP+"/air/getAirInfoByAirline?departureAirport="+
                        code1+"&arrivalAirport="+code2,
                    method: 'get',
                }).then(response =>{
                    if ( response.code == 200) {
                        var arr = response.data.airCompanyList;

                        var airArr = [],airArrCode = [];//航司及对应的code
                        var airNumArr = []; //航司对应的航班号数组
                        var civil = response.data.civil;

                        if(arr.length==0){
                            this.$Notice.error({
                                desc:'没有该航线信息！',
                                duration: 3,
                            });
                        }
                        else{
                            for (var i = 0, l = arr.length; i < l; i++) {
                                //航司以及对应的座位   一个函数一个舱位数组
                                airArr.push(arr[i].airLineShortName);
                                airArrCode.push(arr[i].airline);

                                //航司对应的航班号   一个航司多个航班
                                var NumArr= [];
                                for (var n = 0, m = arr[i].airFlightList.length; n < m; n++) {
                                    NumArr.push(arr[i].airFlightList[n].flightNo);
                                }
                                airNumArr.push(NumArr);
                            }

                            that.airlineArr = airArr;
                            that.airlineCodeArr = airArrCode;
                            that.flightsArr = airNumArr;
                            that.flightArr = airNumArr[0];
                            that.civil = civil;
                        }

                    }
                })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);

            },

            //获取航司的选择值
            getAirlineValue: function(value){
                this.airline = value;
                var n = this.airlineArr.indexOf(value);
                this.airlineCode = this.airlineCodeArr[n];
                this.flightArr = this.flightsArr[n];
            },

            //获取航班号的选择值
            getflightNumValue:function(val){
                this.flightNumber = val;
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
                this.cityName1 = city2;
                this.cityName2 = city1;
                this.refreshChild();
            },

            // 提交表单
            search:function(){
                var str='',reg0='';

                str=this.code1+'/'+this.code2+'/'+this.airline+'/'+
                    this.civil+'/'+ this.city1 +'/'+this.city2+'/'+this.airlineCode+'/'+ this.flightNumber;
                reg0 = this.code1==''||this.code2==''||this.airline=='';

                if(reg0){
                    this.$Notice.error({
                        desc:'请填写完整的信息！',
                        duration: 3,
                    });
                }else{
                    this.$emit('submitInfo',encodeURIComponent(str));
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
                        this.seatValue = "";
                    }
                },
            }
        },
    }
</script>

<style scoped>
    .searchImg img{
        cursor: pointer;
    }
    .offset{
        height: 32px;
    }
</style>
