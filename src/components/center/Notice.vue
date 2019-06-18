<template>
    <div class="notice">
        <Card>
            <div class="notice-title">
               消息中心
            </div>

            <div class="menu clearfix">
                <div class="">
                    <Checkbox
                            :indeterminate="indeterminate"
                            :value="checkAll"
                            @click.prevent.native="handleCheckAll">全选</Checkbox>
                </div>


               <div class="menu-select">
                   <Dropdown trigger="click" style="margin-left: 20px" @on-click="selectMenu">
                       <a href="javascript:void(0)">
                           <Icon type="ios-funnel-outline" color="#17233d"/>
                          消息类型
                           <Icon type="ios-arrow-down" color="#17233d"></Icon>
                       </a>
                       <DropdownMenu slot="list">
                           <DropdownItem name="3">全部</DropdownItem>
                           <DropdownItem name="1">已读</DropdownItem>
                           <DropdownItem name="0">未读</DropdownItem>
                       </DropdownMenu>
                   </Dropdown>
                   <!--<ButtonGroup>-->
                       <!--<Button :class="{ active:menu == 3}" v-on:click="selectMenu(3)">全部</Button>-->
                       <!--<Button :class="{active: menu == 1}" v-on:click="selectMenu(1)">已读</Button>-->
                       <!--<Button :class="{active: menu == 0}" v-on:click="selectMenu(0)">未读</Button>-->
                   <!--</ButtonGroup>-->
               </div>

                <div class="do-select">
                    <Button size="small" icon="ios-trash-outline" type="warning" v-on:click="btndelect" style="margin-right: 4px;">删除</Button>
                    <Button size="small" icon="ios-mail-open-outline" type="primary" v-on:click="ReadAll">全部标为已读</Button>
                </div>

            </div>


            <CheckboxGroup  v-model="checkAllGroup">

               <Collapse simple @on-change="getPanelName"  accordion v-if="list.length">
                <Panel :name="item.id" v-for="item in list">
                    <b >
                        <Checkbox :label="item.id">
                            <span> {{item.title}}</span>
                        </Checkbox>

                    </b>
                    <Badge status="error" v-if="!(item.status||readId==item.id)" />
                    <!--<span class="delect"  @click="delectOrder(item.orderId)"><Icon type="md-close-circle" color="#ff9900" size="20"/></span>-->
                    <span class="time">{{item.time}}</span>

                    <p slot="content" v-on:click="detail" :data-id="item.orderId">
                       {{item.message}}
                    </p>
                </Panel>
                <!--<Panel name="2">-->
                    <!--<b>监控成功</b> <span class="time">2019-03-08 11:54</span>-->
                    <!--<p slot="content">-->
                        <!--您好，您监控的从上海浦东(PVG)至洛杉矶(LAX)，头等舱于2019年03月14日 21:00:00起飞，系统监控到满足您的需求人数，监控成功！-->
                    <!--</p>-->
                <!--</Panel>-->
                <!--<Panel name="3">-->
                    <!--<b>航班即将起飞预警</b><span class="time">2019-03-08 10:34</span>-->
                    <!--<p slot="content">-->
                        <!--【找到科技深圳有限公司】（即将起飞预警）您好，您监控的从上海浦东(PVG)至洛杉矶(LAX) 公务舱于2019年03月09日 13:20:00即将起飞，若您想继续监控，请您点击继续监控按钮！-->
                    <!--</p>-->
                <!--</Panel>-->
            </Collapse>

            </CheckboxGroup>

            <div class="page" v-if="total">
                <Page :total="total" show-elevator show-total :current="page" @on-change="getPage"/>
            </div>
        </Card>

        <!--提示用户前往支付的提示框-->
        <Modal v-model="modal" width="360" @on-cancel="closeModal">
            <div >
                <div class="globalhead">
                    <Icon type="ios-alert" size="24" color="#ff9900"/><div>确认删除</div>
                </div>
                <div class="modalbody">
                   确定删除这{{delectTotal}}条信息？删除后数据无法恢复！
                </div>
            </div>
            <div slot="footer">
                <Button type="primary"  @click="DelectAll">确定</Button>
                <Button @click="closeModal">取消</Button>
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: "Notice",

        data(){
            return {
             list: [],
             total: 0,
             page: 0,
             menu: "3",
             readId: 0,
            checkAllGroup: [],
            indeterminate: true,
            checkAll: false,

            messageIds: [],//当前消息的全部id组合
            modal: false,
            delectTotal: 0,
          }

        },
        created(){
            this.getMessage(1);
            this.page = 1;
        },
        methods:{
            //获取所有信息
           getMessage:function(page,status){
               var that = this;
               var json = {};
               if(status == 0||status == 1){//0未读 1已读
                  json = {
                      userId: '',
                      limit: 10,
                      page:page,
                      status: status
                  }
               }else{
                 json = {
                     userId: '',
                     limit: 10,
                     page:page
                 }
               }
               this.$http({
                   method: 'post',
                   url: this.$comjs.IP+'/message/list',
                   data: json,
               })
                   .then(response => {
                       var data = response.data,arr=[],orderIds = [];
                       that.total = parseInt(response.count);

                       if(Math.ceil(parseInt(response.count)/10)<that.page){
                           that.page--;
                           that.getMessage(that.page,that.menu);
                       }
                       for(var i=0,l=data.length;i<l;i++){
                           arr.push({
                               title: data[i].title,
                               message: data[i].message,
                               time: that.timestampDate(data[i].createTime),
                               status: data[i].status,
                               id: data[i].id,
                               orderId: data[i].orderId
                           });
                           orderIds.push(data[i].id);
                       }
                       that.list = arr;
                       that.messageIds = orderIds;

                   })
                   .catch(error => {
                       console.log(error);
                       this.errored = true
                   })
                   .finally(() => this.loading = false);
           },

            //跳转
            detail:function(e){
               var id = e.toElement.dataset.id;
                this.$http({
                    method: 'get',
                    url: this.$comjs.IP+"/monitor/detail/"+id,
                })
                    .then(response => {
                        if(response.code == -1){
                            this.Notice.error({
                                title: response.data.msg,
                                desc:''
                            });
                        }
                        else if(response.code == 200){
                            this.$router.push({path:'/center/order/detail/'+id});
                        }


                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);

            },

           //获取分页
            getPage: function(e){
                var menu = this.menu;
                this.getMessage(e, menu);
                this.page = e;
            },

            //用户展开信息
            getPanelName: function(e){
                var that = this;
                if(e[0]){
                    this.readId = e[0];
                    this.$http({
                        method: 'get',
                        url: this.$comjs.IP+ "/message/detail/"+e[0],
                    }) .then(response => {
                        if(response.code == 200){
                            setTimeout(function(){
                                that.getMessage(that.page,that.menu);
                            },3000);
                        }
                        that.getInfoNum();
                    })
                        .catch(error => {
                            console.log(error);
                            this.errored = true
                        })
                        .finally(() => this.loading = false);
                }
            },


            //用户点击全部标记为已读
            ReadAll:function(){
               // console.log(this.checkAllGroup);
               var arr=[],data = this.checkAllGroup;
              for(var i=0,l=data.length;i<l;i++){
                  arr.push(parseInt(data[i]));
              }
              if(arr.length == 0){
                  this.$Message.error('未选中任何消息');
              }else{
                  var that = this;
                  this.$http({
                      method: 'post',
                      url: this.$comjs.IP+ "/message/setRead",
                      data: {
                          ids: arr
                      },
                  }) .then(response => {
                      if(response.code == 200){
                          that.getMessage(that.page,that.menu);
                          that.getInfoNum();
                      }
                  })
                      .catch(error => {
                          console.log(error);
                          this.errored = true
                      })
                      .finally(() => this.loading = false);
              }

            },


            //删除消息
            DelectAll:function(){
                var arr=[],data = this.checkAllGroup;
                for(var i=0,l=data.length;i<l;i++){
                    arr.push(parseInt(data[i]));
                }
                var that = this;
                this.$http({
                    method: 'post',
                    url: this.$comjs.IP+ "/message/delMessge",
                    data: {
                        ids: arr
                    },
                }) .then(response => {
                    if(response.code == 200){
                        that.modal = false;
                        that.getMessage(that.page,that.menu);
                        that.getInfoNum();
                        this.$Message.success('删除成功！');
                        that.checkAllGroup = [];
                    }

                })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },

            //用户点击删除 出现弹窗
            btndelect:function(){
               this.delectTotal = this.checkAllGroup.length;
               if(this.checkAllGroup.length == 0){
                   this.$Message.error('未选中任何消息');
               }else{
                   this.modal = true;
               }
            },

            //关闭弹窗
            closeModal: function(){
              this.modal = false;
            },


            //选择菜单时的事件
            selectMenu:function(e){
                this.menu = e;
                this.page = 1;



                if(e == "3"){
                    this.getMessage(1,3);
                }
                else if( e=="1"){//已读
                    this.getMessage(1,1);
                }
                else if(e=="0"){ //未读
                    this.getMessage(1,0);
                }
            },


            //获取用户未读消息的条数
            getInfoNum: function(){
                // 获取用户消息数量
                this.$http({
                    method: 'post',
                    url: this.$comjs.IP+'/message/list',
                    data: {
                        userId: '',
                        limit: 10,
                        page:1,
                        status: 0
                    },
                })
                    .then(response => {
                        if(response.code == 200){
                            this.$store.commit('changeInfoNum', parseInt(response.count));
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        this.errored = true
                    })
                    .finally(() => this.loading = false);
            },


            //全选筛选事件
            handleCheckAll () {
                if (this.indeterminate) {
                    this.checkAll = false;
                } else {
                    this.checkAll = !this.checkAll;
                }
                this.indeterminate = false;

                if (this.checkAll) {
                    this.checkAllGroup = this.messageIds;
                } else {
                    this.checkAllGroup = [];
                }
            },


            // 时间戳转时间函数
            timestampDate: function(timestamp){
                var now = new Date(timestamp);
                var year=now.getFullYear();
                var month=now.getMonth()+1;
                var date=now.getDate();
                var hour=now.getHours();
                var minute=now.getMinutes();

                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (date >= 0 && date <= 9) {
                    date = "0" + date;
                }
                if (hour >= 0 && hour <= 9) {
                    hour = "0" + hour;
                }
                if (minute >= 0 && minute <= 9) {
                    minute = "0" + minute;
                }
                return year + "-" + month + "-" + date+" "+hour+":"+minute;
            },

        }
    }
</script>

<style scoped lang="scss">
     @import "../../assets/style/_variables";
    .notice{
        text-align: left;
        padding-top: $topMenu;
    }
    .notice span.time{
        float: right;
        margin-right: 10px;
        color: $SubColor;
    }
   /*.notice span.delect{*/
       /*float: right;*/
   /*}*/
    .notice b{padding-right: 10px;}
    .notice p{
        font-size: 14px;
        cursor: pointer;
    }
    .notice-title{
       @extend .global-title;
        border-bottom: none;
    }
    .notice-title:before{
        @extend .global_b_bar;
    }
    .page {
        padding: 5px 0;
    }

    .notice-select{
        margin: 20px 0;
    }
     .menu{
         margin-bottom: 20px;
         background: #ECF0F5;
         color: $Title;
         padding: 8px 10px;
     }
    .menu .active{
        background: $DarkPrimayColor;
        color: #fff;
    }

    .menu>div{
        float: left;
    }
  .menu .menu-select a{
      color: $Title;
  }
     .menu>div.do-select{
         float: right;
     }


</style>
