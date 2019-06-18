<template>
    <div class="box" :class="{'fade':showBox}">
      <div class="header">
          <div class="img">
              <img src="../assets/images/info.png" alt="">
          </div>
          <div class="close" @click="closeInfo">
              <Icon type="md-close" size="18" color="#80848f"/>
          </div>
          <div class="title">
             {{title}}
          </div>
      </div>

      <div class="message-body">
         {{content}}
      </div>

      <div class="message-foot">
          {{time}}
      </div>
    </div>
</template>

<script>
    export default {
        name: "Message",
        data() {
            return {
                showBox: false,
                userId: '',
                websock: null,
                title: '',
                content: '',
                time: '',

            }
        },
        created() {
            this.getUserId();

        },
        destroyed() {
            this.websock.close() //离开路由之后断开websocket连接
        },
        methods: {

            // websocket
            initWebSocket(){ //初始化weosocket
                const wsuri ="wss://" +this.$comjs.sip+"/webSocket/"+this.userId;
                this.websock = new WebSocket(wsuri);

                this.websock.onopen = this.open;
                this.websock.onmessage = this.getMessage;
                this.websock.onerror = this.onerror;
                this.websock.onclose = this.onclose;
            },
            open(){ //websocket连接成功后的触的函数
                var regsiter = {"windowsType":"pcqt","webSocketListenerType":["airMessage"]};
                this.websock.send(JSON.stringify(regsiter));
                console.log('socket连接成功');
            },
            getMessage(e){ //数据接收 数据接收后触发的函数
                var data = JSON.parse(e.data);

                if(data.type=="airMessage"){
                    if(data.length!=0){
                        this.showBox = true;
                        this.getInfoNum(); //刷新未读消息条数

                    }
                    this.title = data.data.title;
                    this.content = data.data.message;
                    this.time = this.timestampDate(data.data.createTime);
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

            onerror(){//连接建立失败重连
                // this.initWebSocket();
                console.log("连接错误");
            },

           onclose(e){  //关闭
                console.log('websocket关闭',e);
            },

            websocketsend(Data){//数据发送
                this.websock.send(Data);
            },
            closeInfo: function(){
                this.showBox = false;
            },
            // 获取用户ID
            getUserId: function(){
                var that = this;
                this.$http({
                    method: 'get',
                    url: this.$comjs.IP+'/user/getphoneemail',
                })
                    .then(response => {
                        if(response.code == 200){
                            that.userId = response.data.id;
                            that.initWebSocket();
                        }


                    })
            },

            // 时间戳转时间函数 2019-04-01 18:09
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
        },
    }
</script>

<style scoped >
    .box{
        display: none;
        background: #fff;
        width: 25%;
        border: 1px solid #dddee1;
        -webkit-box-shadow: 0 0 10px  rgba(0, 0, 0, 0.19);
        -moz-box-shadow: 0 0 10px  rgba(0, 0, 0, 0.19);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.19);
        border-radius: 5px;
        padding: 10px 10px 20px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        position: fixed;
        right: 0;
        bottom: 0;
    }
    .header>.img{
        position: absolute;
        top: -25px;
        left: calc((100% - 60px)/2);
    }
    .header>.close{
        position: absolute;
        right: 10px;
        top: 4px;
        cursor: pointer;
    }
    .header>.title{
        text-align: center;
        margin: 25px 0 10px;
        font-size: 1.2rem;
        font-weight: bold;
    }

    .message-body{
        text-indent: 20px;
        margin-bottom: 10px;
        font-size: 1rem;
    }
    .fade {
        display: block;
        -webkit-animation: fadeIn  0.5s linear;
        animation: fadeIn  0.5s linear;
    }

    .message-foot{
        text-align: right;
        color: #80848f;
        font-size: 1rem;
    }

    @keyframes fadeIn{
        0%{
            opacity: 0;
            /*display: block;*/
        }
        100%{
            opacity: 1;
            /*display: block;*/
        }
    }

    @keyframes fadeOut{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0;
            display: none;
        }
    }

</style>
