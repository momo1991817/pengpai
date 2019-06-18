
import axios from 'axios';
import router from "./../../router";
import store from "./../../store";
import iView from 'iview';


axios.interceptors.request.use((config) => {
    if(localStorage.getItem('userId')){
        config.headers.Authorization = localStorage.getItem('userId');
    }

    return config
});

axios.interceptors.response.use((response) => {
    const code = response.data.code;

    if(code == -100){
        // router.push({name: 'login'});
        store.commit('changeLoginShow', true);
    }
    else if(code == -101){
        router.push({name: 'register'});
    }
    else if(code == -3){
        iView.Message.error('登录失败!');
    }
    else if(code == -4){
        iView.Notice.error({
            title: '帐号或密码错误!',
            desc:''
        });
    }
    else if(code == -7){
        iView.Notice.info({
            title: '您已经提交过，请误重新提交!',
            desc:'',
            duration: 3,
        });
        // this.Message.error('验证码错误，请重新获取!');
    }
    else if(code == -8){
        iView.Notice.error({
            title: '此手机号已经注册过了!',
            desc:''
        });
        // this.Message.error('验证码错误，请重新获取!');
    }
    else if(code == -11){
        iView.Notice.error({
            title: '验证码过期了!',
            desc:''
        });
        // this.Message.error('验证码过期了!');
    }
    else if(code == -12){
        iView.Notice.error({
            title: '您输入的验证码错误，请重新输入！',
            desc:''
        });
        // this.Message.error('验证码错误！');
    }
    else if(code == -14){
        store.commit('changeModalType', true);
        store.commit('changeModalTitle', '您还不是会员，是否前往购买？');
    }
    else if(code == -15){
        store.commit('changeModalType', true);
        store.commit('changeModalTitle', '您的会员已经过期，是否前往购买？');

    }
    else if(code == -16){
        store.commit('changeModalType', true);
        store.commit('changeModalTitle', '预警监控次数已用完，是否前往会员中心购买？');
    }
    else if(code == -17){
        iView.Notice.error({
            title: '您的权限不够！',
            desc:''
        });
    }
    else if(code == -18){
        iView.Notice.error({
            title: '该套餐已经下架了！',
            desc:''
        });
    }
    else if(code == -19){
        iView.Notice.error({
            title: '您还不是公司会员！',
            desc:''
        });
    }
    else if(code == -1){
        iView.Notice.error({
            title: response.data.msg,
            desc: ''
        });
    }

    return response.data;
    // switch(code){
    //     case '-4':
    //        msg = '帐号或者密码错误';
    //        break;
    //     case '-3':
    //         msg = '登录失败';
    //         break;
    //     case '-1':
    //         msg = '操作失败';
    //         break;
    //     case '-2':
    //         msg = '注销登录失败';
    //         break;
    //     case '-5':
    //         msg = '用户和密码都不能为空';
    //         break;
    //     case '-8':
    //         msg = '验证码错误';
    //         break;
    //     case '-9':
    //         msg = '请输入验证码';
    //         break;
    //     case '-11':
    //         msg = '验证码过期了';
    //         break;
    //     case '-12':
    //         msg = '验证码错误';
    //         break;
    //     case '-100':
    //         msg = '用户未登录或者身份异常';
    //         break
    //     case '-101':
    //         msg = '用户未绑定手机号码';
    //         break
    //     case '':
    //         msg = ;
    //         break
    //     case '':
    //         msg = ;
    //         break
    // }

});

export default axios;
