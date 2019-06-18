import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Main.vue";
import Ticket from "./components/Ticket.vue";
import Detail from "./components/Detail.vue";
import Detail2 from "./components/Detail2.vue";
import Login from "./components/Login";
import Register from "./components/Register";
import Schedule from "./components/Schedule.vue";   //日程表
import AirlineDaily from "./components/ArilineDaily.vue"; //余票推荐表

import Order from "./components/Order.vue";//订单中心

import Center from "./components/Center.vue";
import Info from "./components/center/Infomation.vue";
import Notice from "./components/center/Notice.vue";

import CompleteOrder from "./components/center/CompleteOrder.vue";//完成订单
import MonitOrder from "./components/center/MonitorOrder.vue";
import CenterDetail from "./components/center/Detail.vue"; // 订单详情
import Trade from "./components/center/Trade.vue"; //交易
import Menber from "./components/center/Menber.vue";//会员
import Table from "./components/center/Table.vue";//报表导出
import ChangePhone from "./components/center/ChangePhone.vue";
import ChangeEmail from "./components/center/ChangeEmail.vue";
import ChangeCompany from "./components/center/ChangeCompany.vue";


Vue.use(Router);

export default new Router({
    mode: "history",
    // base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/ticket",
            name: "ticket",
            component: Ticket
        },
        {
            path: "/login",
            name: "login",
            component: Login
        },
        {
            path: "/register",
            name: "register",
            component: Register
        },
        {
            // path:"/detail/:code1/:code2/:seats/:startdate/:civil/:city1/:city2/:airline/:flightNum",
            path: "/detail/:str",
            name: "detail",
            component: Detail
        },
        {
            // path: "/detail2/:code1/:code2/:seats/:startdate/:civil/:city1/:city2",
            path: "/detail2/:str",
            name: "detail2",
            component: Detail2
        },
        {
            path: '/schedule',
            component: Schedule,
            name: 'Schedule'
        },
        {
            path: '/daily',
            component: AirlineDaily,
            name: 'Daily'
        },
        {
            path: '/order',
            component: Order,
            name: 'Order'
        },

        {
            path: '/complete',
            component: CompleteOrder,
            name: 'CompleteOrder'
        },
        {
            path: '/monit',
            component: MonitOrder,
            name: 'MonitOrder'
        },
        {
            path: '/order/detail/:id',
            component: CenterDetail,
            name: 'OrderDetail'
        },

        {
            path: "/center",
            component: Center,
            children: [
                {
                    path: '/',
                    component: Info,
                    name: 'Infomation'
                },
                {
                    path: '/center/notice',
                    component: Notice,
                    name: 'Notice'
                },

                {
                    path: '/center/order/detail/:id',
                    component: CenterDetail,
                    name: 'CenterDetail'
                },
                {
                    path: '/center/trade',
                    component: Trade,
                    name: 'trade'
                },
                {
                    path: '/center/menber',
                    component: Menber,
                    name: 'menber'
                },
                {
                    path: '/center/table',
                    component: Table,
                    name: 'table'
                },
                {
                    path: '/center/changephone/:type',
                    component: ChangePhone,
                    name: 'ChangePhone'
                },
                {
                    path: '/center/changeEmail/:email',
                    component: ChangeEmail,
                    name: "ChangeEmail",
                },
                {
                    path: '/center/changeCompany',
                    component: ChangeCompany,
                    name: "ChangeCompany",
                },
            ]
        },
        {
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: function () {
                return import(/* webpackChunkName: "about" */ "./views/About.vue");
            }
        }
    ]
});
