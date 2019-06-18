<template>
    <div class="project">
        <div class="title">
            <h2 class="title-text"><span>我们的优势</span></h2>
        </div>
        <ul class="product-list">
            <li class="list">
                <div class="header">
                    <img src="../assets/images/quick.png" width="60" alt="">
                    <div class="title">数据可靠</div>
                </div>
                <div class="list_content">
                    实时访问航空公司官网，及时反馈舱位最新余票数据。
                </div>
            </li>

            <li class="list"  style="margin: 0 5%;">
                <div class="header">
                    <img src="../assets/images/mark.png" width="60" alt="">
                    <div class="title"> PNR智能解析</div>
                </div>
                <div class="list_content">
                    导入飞行记录，智能呈现用户旅行行程。
                </div>
            </li>

            <li class="list">
                <div class="header">
                    <img src="../assets/images/much.png" width="60" alt="">
                    <div class="title"> 掌握余票规律</div>
                </div>
                <div class="list_content">
                    未来90天热门航线余票查询，全局掌握热门航线余票规律
                </div>
            </li>

        </ul>
    </div>
</template>

<script>
    export default {
        name: "Product"
    }
</script>

<style scoped lang="scss">
    @import './../assets/style/_variables';
    .project{
        height: 380px;
        background:  $bg;
    }

    .title-text span {display: block; /*设置为块级元素会独占一行形成上下居中的效果*/
        position: relative; /*定位横线（当横线的父元素）*/
        color: $DarkPrimayColor; /*居中文字的颜色*/
        text-align: center;
        font-size: 24px;
    }

    .title-text span:before, .title-text span:after {
        content: '';
        position: absolute; /*定位背景横线的位置*/
        top: 50%;
        background: $SubColor; /*背景横线颜色*/
        width: 40%; /*单侧横线的长度*/
        height: 1px;
    }

    .title-text span:before {
        left: 1%; /*调整背景横线的左右距离*/
    }

    .title-text span:after {
        right: 1%;
    }
    .product-list{
        margin-top: 40px;
    }
    .product-list:after{
        content: "";
        display: block;
        clear: both;
    }
    .product-list>li{
        width: 30%;
        float: left;
        list-style: none;
        border-radius: 8px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }

   .product-list .list .header{
        text-align: center;
        background: #fff;
       padding-top: 18px;
    }
    .header .title {
        font-size: 16px;
        font-weight: bold;
    }
    .header .title:after{
        border: 1px solid $error;
        width: 80px;
        margin:  0 auto;
        content: "";
        display: block;
    }
    .list_content{
        background: $bg;
        padding: 30px 50px;
        font-size: 14px;
        height: 118px;
        text-align: center;
    }

</style>
