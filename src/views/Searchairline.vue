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
                <Select :Title="seatName" :selectArr="airlineSeatArr" :selectVal="seatValue" @selectChange="getAirlineSeatValue"></Select>
            </Col>

            <Col span="5" style="padding-left:10px">
                <DatePicker type="date" size="large" v-model="startDate" placeholder="出发日期" style="width: 200px" @on-change="getSearchDate" format="yyyy-MM-dd" :options="DatePickerOptions"></DatePicker>
            </Col>

            <Col span="3" align="right">
                <Button type="primary" v-on:click="search" size="large">搜索</Button>
            </Col>
        </Row>
    </div>

</template>

<script>
    import Select from './Select';
    import CitySelect from './CitySelect';
    export default {
        name: "Searchairline",
        props: ['city1Name','city2Name','seat','Date','code1Name','code2Name','civilType'],
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
                airlineSeat: this.seat,
                civil: this.civilType,
                startDate: this.Date,

                cityName1: this.city1Name,
                cityName2: this.city2Name,
                seatValue: this.seat,

                airlineSeatArr: [],

                //*****插件传名称*****
                leaveName:'出发',
                arriveName: '到达',
                seatName:'舱位',//舱位表单标题

                refresh: true,

                //日期选择器不能选择的日期
                DatePickerOptions: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
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

            //获取日期
            getSearchDate:function(e){
                this.startDate = e;
            },

            //获取航线舱位选择值
            getAirlineSeatValue:function(value){
                this.airlineSeat = value;
            },

            // 获取航线信息  航司  座位 航班号
            getAirlineInfo: function(city1,city2){
                const arr = JSON.parse(localStorage.getItem('airline'));
                var airArr = [];//航司及对应的座位数组 公务、头等
                var civil = '';//区分国内航线或者国际航线

                for(var i=0,l=arr.length;i<l;i++){
                    if(arr[i].departureAirport === city1 && arr[i].arrivalAirport === city2){
                        civil = arr[i].civil;
                        for(var j=0,airl = arr[i].airCompanyList.length;j<airl;j++){
                            //航司以及对应的座位
                            airArr.push(getSeat(arr[i].airCompanyList[j].airLineShortName));
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
                var data=airArr.join(',').split(','),temp=[];
                for(var ii=0,ll=data.length;ii<ll;ii++){
                    if(temp.indexOf(data[ii])==-1){
                        temp.push(data[ii]);
                    }
                }
                this.airlineSeatArr = temp;
                this.civil = civil;
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
                //获取航线搜索的舱位，将舱位数组合并 并去重
                function resert(airArr){
                    var data=airArr.join(',').split(','),temp=[];
                    for(var ii=0,ll=data.length;ii<ll;ii++){
                        if(temp.indexOf(data[ii])==-1){
                            temp.push(data[ii]);
                        }
                    }
                    return temp;
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

                            var airArr = [];//航司及对应的座位数组
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
                                    airArr.push(getSeat(arr[i].airLineShortName));
                                }

                                that.airlineSeatArr = resert(airArr);
                                that.civil = civil;
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

                str=this.code1+'/'+this.code2+'/'+this.airlineSeat+'/'+this.ToDateYear(this.startDate)+'/'+
                    this.civil+'/'+ this.city1 +'/'+this.city2;
                reg0 = this.code1==''||this.code2==''||this.airlineSeat==''||this.startDate==''||this.airlineSeat == '';

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
                        this.seatValue = "";
                        this.airlineSeat = ""
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
        height: 36px;
    }
</style>
