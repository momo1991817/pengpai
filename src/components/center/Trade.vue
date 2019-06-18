<template>
    <div class="trade">
        <Card >
            <div class="trade-title">
                交易记录
            </div>
            <Table stripe :columns="columns1" :data="list">
                <template slot-scope="{ row }" slot="name">
                    <strong>{{ row.name }}</strong>
                </template>

            </Table>

        </Card>
    </div>


</template>

<script>
    export default {
        name: "Trade",
        data(){
            return {
                columns1: [
                    {
                        title: '订单ID',
                        key: 'id'
                    },
                    {
                        title: '类型',
                        key: 'name'
                    },
                    {
                        title: '时间',
                        key: 'date'
                    },
                    {
                        title: '交易金额/元',
                        key: 'money'
                    }
                ],
                list: [],

            }
        },
        created(){
            this.getTrade();
        },
        methods: {
            //获取交易记录
            getTrade: function(){
                var that = this;
                this.$http({
                    url: this.$comjs.IP+'/user/wxPayLogByUserOpenId',
                    method: 'get',
                    data: {},
                })
                .then(response =>{
                    if(response.code == 200){
                        var data = response.data,list =[];
                        if(data.length!=0){
                            for(var i=0,l=data.length;i<l;i++){
                                list.push({
                                    name: '购买'+data[i].remark,
                                    money: data[i].account,
                                    date: data[i].callbackTime,
                                    id: data[i].id
                                })
                            }
                          that.list = list;
                        }

                    }
                });
            },

            //删除交易记录
            remove:function(e){
                var id = this.list[e].id;

            }

        }
    }
</script>

<style scoped lang="scss">
    @import '../../assets/style/_variables';
    .trade{
        padding-top: $topMenu;
    }
    .trade-title{
        @extend .global-title;
    }
    .trade-title:before{
        @extend .global_b_bar;
    }

</style>
