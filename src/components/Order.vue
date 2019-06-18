<template>
    <div class="order" >
        <Card>
            <div class="order-title">
                我的订单
            </div>

            <div class="order-select">
                <CompleteOrder></CompleteOrder>
            </div>
        </Card>
    </div>
</template>

<script>
    import CompleteOrder from './center/CompleteOrder';
    // import MonitorOrder from './center/MonitorOrder';
    export default {
        name: "Order",
        components:{
            CompleteOrder,
            // MonitorOrder
        },
        data(){
            return{
            }

        },

        methods: {
        }
    }
</script>
<style>

    .order-select > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab{
        border-radius: 0;
        background: #fff;
    }
    .order-select > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active{
        border-top: 1px solid #3399ff;
    }
    .order-select > .ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active:before{
        content: '';
        display: block;
        width: 100%;
        height: 1px;
        background: #3399ff;
        position: absolute;
        top: 0;
        left: 0;
    }

</style>

<style scoped lang="scss">
    @import '../assets/style/_variables';
    .order{
        padding-top: $topMenu;
    }
    .order-title{
        @extend .global-title;
    }

    .order-title:before {
        @extend .global_b_bar;
    }
</style>
