<script src="../../../../../UserData/Personal/Tencent Files/2269705646/FileRecv/singapore.js"></script>
<template>
    <div class="person-center clearfix" >
        <div class="leftbar">
            <Menu :active-name="menu"  ref="menu">
                <MenuItem name="1">
                    <router-link :to="{name:'Infomation'}">
                        <Icon type="md-person" />
                        我的
                    </router-link>
                </MenuItem>

                <MenuItem name="2">
                    <router-link :to="{name:'Notice'}">
                        <Icon type="md-mail" />
                        消息中心
                        <Badge :count="count" v-if="count"></Badge>
                    </router-link>
                </MenuItem>


                <MenuItem name="3">
                    <router-link :to="{name:'trade'}">
                        <Icon type="ios-card" />
                        交易中心
                    </router-link>
                </MenuItem>

                <MenuItem name="4">
                    <router-link :to="{name:'menber'}">
                        <Icon type="md-cube" />
                        我的会员
                    </router-link>
                </MenuItem>

                <MenuItem name="5">
                    <router-link :to="{name:'table'}">
                        <Icon type="ios-book-outline" />
                        导出报表
                    </router-link>
                </MenuItem>

            </Menu>
        </div>

        <div class="center-body" :style="{'min-height':screenHeight}">
            <router-view ></router-view>
        </div>
    </div>

</template>

<script>
    export default {
        name: "Center",
        data(){
            return{
                screenHeight: 0,
                // count: 0,
                menu: "1",
            }
        },
        mounted () {
            this.getScreenHeight();

            if(this.$route.path == '/center/notice'){
                var that = this;
                this.$nextTick(()=>{
                    that.menu = "2";
                    that.$refs.menu.updateActiveName();
                });
            }
            // console.log(this.$route.path);
        },
        computed:{
            count(){
                return this.$store.state.infoNum
            }
        },
        methods:{
            getScreenHeight: function(){
                var h = document.getElementsByClassName('center-body')[0].offsetHeight;
                var bodyH = (window.innerHeight - 160);
                if(h<bodyH){
                    this.screenHeight = bodyH +'px';
                }
                else{
                    this.screenHeight = h +'px';
                }

            },

        },
    }
</script>

<style scoped lang="scss">
    @import '../assets/style/_variables';
    .person-center{
        margin-top: 10px;
        /*overflow-y: scroll;*/
    }
    .center-body{
        margin: 0 0 10px 260px;
        width: calc(100% - 260px);

    }
    .person-center>div{
        float: left;
    }
    .leftbar{
        position: fixed;
        left: 5%;
        top: 75px;
    }
    .leftbar a{
        color: $Content;
        display: inline-block;
        width: 100%;
    }


</style>
