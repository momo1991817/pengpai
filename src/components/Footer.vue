<template>
    <div class="footer">
        <a href="">粤ICP备17057244号</a>
       <p>All design and content Copyright © 2019 澎湃旅行有限公司</p>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style scoped lang="scss">
    @import '../assets/style/_variables';
    .footer{
        text-align: center;
        @extend .global_width;
        /*background: #212224;*/
        color: $Title;
        height: $footHeight;

    }
    .footer>a{
        display: block;
        padding-top: 20px;
    }

</style>
