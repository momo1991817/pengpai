<template>
    <div class="main">
        <div class="bg" :style="{height: imgH}">
            <img src="../assets/images/bg1.jpg" alt="">
            <div class="bg_title">
                <p>实时查询 便捷服务</p>
                <span>整合强大数据资源，实时呈现航班超值信息</span>
            </div>
        </div>

        <div class="searchBody" :style="{top: searchH}">
            <Menu mode="horizontal" :theme="theme1" active-name="1"  @on-select="menuTab">
                <MenuItem name="1">
                    <Icon type="md-analytics" />
                    航线
                </MenuItem>
                <MenuItem name="2">
                    <Icon type="ios-plane" />
                    航班号

                </MenuItem>
            </Menu>
            <div class="tab">

                <div v-if="tab==1">
                    <SearchAirline @submitInfo="sumbitAirline"></SearchAirline>
                </div>
                <div v-if="tab == 2">
                    <SearchFlight @submitInfo="submitFlightNum"></SearchFlight>
                </div>
                <div class="info-explain">
                    <Tooltip placement="left">
                        <div class="explain"><Icon type="ios-help-circle" size="16" color="#2d8cf0"/></div>
                        <div slot="content">
                            <p>
                                系统“免票航司”包括：'CA','MU','CZ',
                            </p>
                            <p>
                                'HU','VS','DL','CX','BA','UA','NH','HX',
                            </p>
                            <p>
                                'EK', 'AF','SQ','KL','OS','LX','ZH','MF'
                            </p>

                        </div>
                    </Tooltip>
                </div>

            </div>
        </div>


        <div class="introduce">
            <Product></Product>
        </div>

    </div>
</template>

<script>
    import SearchAirline from './../views/Searchairline';
    import SearchFlight from './../views/SearchflightNum';
    import Product from './Product';
    export default {
        name: "Main",
        components: {
            SearchAirline,
            SearchFlight,
            Product
        },
        data () {
            return {
                theme1: 'light',  //主题颜色控制
                tab: 1,  //监控 tab 切换，条件一、条件二
                imgH:'',//图片高度
                searchH:'',//搜索框高度
            }
        },

        created(){
            this.getWindowHeight();

        },
        mounted(){
            this.getAirlineData();
        },
        methods: {
            getWindowHeight:function(){
                var windowH = window.innerHeight;
                this.imgH = (windowH - 160)+'px';
                this.searchH = (windowH - 160)*2/3+'px'
            },
            //监控条件搜索切换事件
            menuTab:function(name){
                this.tab = name;
            },
            //获取航线航班号所有信息，并保存在本地
            getAirlineData: function(){
                // // 获取航线信息
                // this.$http.get(this.$comjs.IP+'/air/getAirInfo')
                // .then(response => {
                //     localStorage.setItem('airline',JSON.stringify(response.data));
                //  })
                //  .catch(error => {
                //      console.log(error);
                //      this.errored = true
                // })
                // .finally(() => this.loading = false);

                // //获取座位信息
                this.$http
                    .get(this.$comjs.IP+'/air/getAllAirCompanyExchangeCab')
                    .then(response => {
                       localStorage.setItem('airlineSeats',JSON.stringify(response.data));
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);

                // //获取降舱的舱位
                // // 可兑换舱位
                this.$http
                    .get(this.$comjs.IP+'/air/getAllAirCompanyCab')
                    .then(response => {
                        localStorage.setItem('airlineDownSeats',JSON.stringify(response.data));
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);

            },

            //通过航线搜索
            sumbitAirline:function(val){
                var userId = localStorage.getItem('userId');
                if(userId){
                    this.$router.push('/detail2/'+val);
                }else{
                    // this.$router.push('/login');
                    this.$store.commit('changeLoginShow', true);
                }

                // console.log(val);
            },
            //通过航班号搜索
            submitFlightNum: function(val){
                var userId = localStorage.getItem('userId');
                if(userId){
                    this.$router.push('/detail/'+val);
                }else{
                    this.$router.push('/login');
                }
            },
        },

    }
</script>


<style scoped lang="scss">
    @import '../assets/style/_variables';
    .bg,.bg>img{
        width: 100%;
    }
    .bg{position: relative;}
    .bg>img{height: 100%;}
    .searchBody{
       @extend .searchBody_Style;
        /*position: relative;*/
    }


    .search{
        position: relative;
    }

    .dropdown {
        width: 100%;
        position: relative;
        margin-right: 10px;
    }
    .tab{
        margin-top: 15px;
    }
    .tab .info-explain{
        margin-top: 5px;
    }
    .tab .explain{
        /*float: right;*/
        /*position: absolute;*/
        /*right: 10px;*/
        /*top: 20px;*/
        /*padding: 2px 4px;*/
        /*height: 20px;*/
        /*width: 20px;*/
        /*!*line-height: 20px;*!*/
        /*border-radius: 50%;*/
        /*background: #2d8cf0;*/
        /*color: #fff;*/
        /*z-index: 10000000;*/
        /*margin-top: 8px;*/
        /*text-align: center;*/
    }

    .bg>.bg_title{
        position: absolute;
        top: 30%;
        left: 50%;
        margin-left: -180px;
        color: #fff;
        text-align: center;
    }
    .bg>.bg_title>p{ font-size: 50px;}
    .bg>.bg_title>span{ font-size: 20px;}
    .introduce{
        margin-top: 90px;
    }

</style>
