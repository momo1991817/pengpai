<template>
    <div class="cityselect">
        <Input v-model="city" placeholder="汉字/三字码" size="large">
            <span slot="prepend">{{Title}}</span>
        </Input>
        <div class="ivu-select-dropdown dropdown" v-show="Dropdown" >
            <ul class="ivu-select-not-found" v-if="!IfData">
                <li>无匹配数据</li>
            </ul>
            <ul class="ivu-select-dropdown-list" >
                <li class="ivu-select-item" v-for="item in list" v-on:click="bindClickgetList(item)" >{{item.shortName}}</li>
            </ul>
            <ul class="ivu-select-loading" style="display: none;">加载中</ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CitySelect",
        props: ['Title','cityName'],
        data(){
            return {
                Dropdown: false,
                list: [],
                city: this.cityName,
                IfData: true
            }
        },
        created(){
           this.getData();
        },

        methods: {
            //获取国内外城市
            getData: function(){
                var that = this;
                this.$http
                    .get(this.$comjs.IP+'/city/pcCity',{
                    })
                    .then(response => {
                        var data = response.data;
                        var inland = [],foreign=[],citys=[],hotCitys=[];
                        inland = data.inlandCity;
                        foreign =data.foreignCity;
                        for(var i=0,l=inland.length;i<l;i++){
                            if(inland[i].letter=='HOT'){
                                hotCitys.push(inland[i]);
                            }else{
                                citys.push(inland[i]);
                            }
                        }
                        for(var j=0,len=foreign.length;j<len;j++){
                            if(foreign[j].letter=='HOT'){
                                hotCitys.push(foreign[j]);
                            }else{
                                citys.push(foreign[j]);
                            }
                        }
                        localStorage.setItem('city',JSON.stringify(citys));
                        localStorage.setItem('HotCity',JSON.stringify(hotCitys));
                        that.list = hotCitys;
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false)
            },

            //用户选择下拉列表指
            bindClickgetList: function(val){
                this.city = val.shortName;
                var obj = {code: val.cityCode,city: val.shortName};
                this.$emit('getCity',obj);
                this.Dropdown = false;
            },


            //模糊搜索
            searchCity:function(val){
                this.Dropdown = true;
               var city = JSON.parse(localStorage.getItem('city'));
               var list = [];
               for(var i=0,l=city.length;i<l;i++){
                   if(city[i].cityCode.indexOf(val)>-1||city[i].shortName.indexOf(val)>-1){
                       if(list.indexOf(city[i].shortName)<0){
                           list.push(city[i]);
                       }
                   }
               }
               if(list.length>0){
                   this.list =list;
                   this.IfData = true;
               }else{
                   this.list = '';
                   this.IfData = false;
               }
            },
            //初始化数据
            startData: function(){
                var data = JSON.parse(localStorage.getItem('HotCity'));
                this.list = data;
            }

        },
        watch:{
            // 监控用户输入指的变化
            city(newVal){
                if(/^[a-zA-Z]{2,}$/.test(newVal)){
                    this.searchCity(newVal.toUpperCase());
                }
                else if(/^[\u4e00-\u9fa5]{1,}$/.test(newVal)){
                    this.searchCity(newVal);
                }
                else if(newVal.length==0){
                    this.Dropdown = false;
                }

            }
        }
    }
</script>


<style scoped>
    .cityselect{
        position: relative;
    }
    .dropdown {
        width: 100%;
        position: absolute;
        margin-right: 10px;
        top: 36px;
        left: 0;
    }

</style>
