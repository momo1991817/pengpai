import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {//唯一数据源，我理解为声明全局变量


   globalModal: false, //控制权限提示弹出框
   globalModalTitle: '您还不是会员！',//权限弹出框标题

   infoNum: 0,  //用户消息条数
   showLogin: false, //是否打开登录窗口


  },
  mutations: {//逻辑处理，但Mutation 必须是同步函数
    //用户ID
      changeUserId(state,value){
          state.userId = value;
      },

    // 弹出框状态函数
     changeModalType(state,value){
        state.globalModal = value;
     },
      // 弹出框标题
      changeModalTitle(state,value){
        state.globalModalTitle = value;
      },
     //用户消息条数更改事件
      changeInfoNum(state,value){
          state.infoNum = value;
      },

      changeLoginShow(state,value){
       state.showLogin = value;
      }


  },
  actions: {//Action 类似于 mutation,Action 提交的是 mutation，而不是直接变更状态;Action 可以包含任意异步操作.
      changeModalType(context,value){
          context.commit('changeModalType',value)
      },
      changeModalTitle(context,value){
          context.commit('changeModalTitle',value)
      }
  }
});
