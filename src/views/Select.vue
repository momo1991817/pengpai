<template>
    <div class="select"  v-bind:class="{ 'ivu-select-visible': isActive}">
        <div class="ivu-input-group">
            <div class="ivu-input-group-prepend">
                <span>{{Title}}</span>
            </div>
            <div class="ivu-select-selection " v-on:click="bindClick">
                <input type="hidden" name="citycode" v-model="code" >
                <div :data-name="Title">
                    <span v-bind:class="{'ivu-select-placeholder': isPlaceHolder, 'ivu-select-selected-value': !isPlaceHolder}">{{placeHolder}}</span>
                    <i class="ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow"></i>
                </div>
            </div>
        </div>

        <div class="ivu-select-dropdown" v-if="isActive">
            <ul class="ivu-select-dropdown-list">
                <li class="ivu-select-item" v-for="item in selectArr" v-on:click="selectTab(item)">
                    <span >{{item}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Select",
        props: ['Title','selectArr','selectVal'],

        data() {
            return {
                placeHolder: '请选择',
                isActive:false,   //展现下拉框
                code:'',
                title: this.Title,  //展现左边标题
                isPlaceHolder: true, //是否是placeHolder的请输入
                selectedVal: this.selectVal
            }
        },
        mounted () {
            // 点击其他地方消失
            var that = this;
            document.addEventListener('click', function(e){
                var name;
                //用户点击元素外  关闭下拉框
                if(e.target.className=='ivu-select-placeholder'||e.target.className=='ivu-select-selected-value'||e.target.className=='ivu-icon ivu-icon-ios-arrow-down ivu-select-arrow'){
                    name = e.target.parentElement.getAttribute('data-name');
                }else{name='';}
                if(name!=that.Title){
                    that.isActive = false;
                }
            })
        },
        methods:{
            //绑定点击下拉框，并显示隐藏下拉框
            bindClick:function(){
                this.isActive = !this.isActive;
            },
            selectTab: function(e){
                this.code = e;
                this.placeHolder = e;
                this.isPlaceHolder = false;
                this.isActive = false;
                this.$emit('selectChange',this.code);
            }
        },

        watch:{
            selectArr(newVal){
                if(newVal !=''&&this.selectVal!=undefined&&this.selectVal !="") {
                    this.placeHolder = this.selectVal;
                    this.isPlaceHolder = false;
                }else{
                    this.placeHolder = '请选择';
                    this.isPlaceHolder = true;
                }
            },


        }
    }
</script>

<style scoped>
    .ivu-select-selection{
        width: 100%;
        float: left;
        margin-bottom: 0;
        position: relative;
        z-index: 2;
        border-top-left-radius: 0!important;
        border-bottom-left-radius: 0!important;
    }
    .select{
        position: relative;
        /*margin-bottom: 20px;*/
    }
    .ivu-select-placeholder{
        display: block;
        height: 34px;
        line-height: 34px;
        color: #c5c8ce;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 4px;
        padding-right: 22px;
        text-align: left;
    }
    .ivu-select-selected-value{
        display: block;
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-left: 8px;
        padding-right: 24px;
        text-align: left;
    }
    .ivu-select-visible .ivu-select-arrow {
        -webkit-transform: rotate(180deg);
        transform: rotate(180deg);
        display: inline-block;
    }
    .select .ivu-select-dropdown{width: 100%;text-align: left;}
    .ivu-select-visible .ivu-select-arrow{
        top: 25% !important;
    }
</style>
