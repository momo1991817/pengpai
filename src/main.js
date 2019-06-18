import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import common from './assets/style/_common';

import https from 'axios'
import axios from './assets/style/axios';

import VueQriously from 'vue-qriously';




Vue.config.productionTip = false;

Vue.use(iView);
Vue.use(VueQriously);


//修改原型链
Vue.prototype.$comjs = common;
Vue.prototype.$http = axios;
Vue.prototype.$axios = https;
Vue.prototype.$store = store;


//用来监控locastorage的变化
Vue.prototype.resetSetItem = function (key, newVal) {
    // 刷新消息refreshInfo
    //提示用户是否是会员窗口  globalModal
    if (key == 'refresh') {

        // 创建一个StorageEvent事件
        var newStorageEvent = document.createEvent('StorageEvent');
        const storage = {
            setItem: function (k, val) {
                localStorage.setItem(k, val);

                // 初始化创建的事件
                newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

                // 派发对象
                window.dispatchEvent(newStorageEvent)
            }
        }
        return storage.setItem(key, newVal)
    }

}

new Vue({
  router,
  store,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");
//'154789066500135'
//this.$userId
// this.$Message
