import Main from '@/views/Main.vue';
import au from '../libs/accessUtils.js';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};


export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/a_order/statistic.vue') },
        { path: 'statistic', title: '订单统计', name: 'statistic', component: () => import('@/views/a_order/survey.vue') },
        { path: 'usr_center',  title: '用户中心', name: 'usr_center', component: () => import('@/views/a_user/userCenter.vue') }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    //主頁擴展頁面 请求的还是 订单 接口
    // {
    //     path: '/order',
    //     icon: 'person',
    //     name: 'mem',
    //     title: '服务商展示',
    //     access:[au.mem_mem],
    //     component: Main,
    //     children:[
    //         { path: 'statistic', title: '服务商展示', access:au.order_statistic, name: 'order_statistic', icon: 'ios-recording-outline', component: () => import('@/views/a_order/statistic.vue') }
    //     ]
    // },
    {
        path: '/mem',
        icon: 'person',
        name: 'mem',
        title: '用户管理',
        access:[au.mem_mem],
        component: Main,
        children:[
            { path: 'mem', access:au.mem_mem, title: '用户管理', name: 'mem_mem', icon: 'person', component: () => import('@/views/a_member/memPage.vue') }
        ]
    },
    {
        path: '/proxy',
        icon: 'person',
        name: 'proxy',
        title: '服务商管理',
        access:[au.proxy_proxy, au.proxy_save, au.proxy_edit],
        component: Main,
        children:[
            { path: 'proxy', title: '服务商管理', access: au.proxy_proxy, name: 'proxy_proxy', icon: 'person', component: () => import('@/views/a_proxy/proxyPage.vue') }
        ]
    }
     ,{
        path: '/clean',
        icon: 'social-snapchat-outline',
        name: 'clean',
        title: '保洁员管理',
        access:[au.clean_clean, au.clean_onlineMap, au.clean_reg],
        component: Main,
        children:[
            { path: 'clean', access:au.clean_clean, title: '保洁员管理', name: 'clean_clean', icon: 'social-snapchat-outline', component: () => import('@/views/a_cleaner/cleanPage.vue') }
            ,{ path: 'onlineMap', access:au.clean_onlineMap, title: '在线地图状态', name: 'clean_onlineMap', icon: 'map', component: () => import('@/views/a_cleaner/onlineMap.vue') }
            ,{ path: 'reg', access:au.clean_reg, title: '保洁员登记', name: 'clean_reg', icon: 'ios-plus-outline', component: () => import('@/views/a_cleaner/cleanerReg.vue') }
        ]
    }
    ,{
        path: '/service',
        icon: 'cloud',
        name: 'service',
        title: '服务商品管理',
        access:[au.ser_ser],
        component: Main,
        children:[
            { path: 'service', access:au.ser_ser, title: '服务管理', name: 'ser_ser', icon: 'cloud', component: () => import('@/views/a_service/servicePage.vue') }
        ]
    }
//  ,{
//      path: '/order',
//      icon: 'ios-recording',
//      name: 'order',
//      title: '订单管理',
//      access:[au.order_order, au.order_statistic,au.survey],
//      component: Main,
//      children:[
//          { path: 'order', title: '订单管理', access:au.order_order, name: 'order_order', icon: 'ios-recording', component: () => import('@/views/a_order/orderPage.vue') }
//          ,{ path: 'statistic', title: '订单概览', access:au.order_statistic, name: 'order_statistic', icon: 'ios-recording-outline', component: () => import('@/views/a_order/statistic.vue') }
//          ,{ path: 'survey', title: '订单统计', access:au.survey, name: 'survey', icon: 'ios-recording-outline', component: () => import('@/views/a_order/survey.vue') }
//      ]
//  }
	,{
        path: '/order',
        icon: 'ios-recording',
        name: 'order',
        title: '库存管理',
        access:[au.order_order, au.order_statistic,au.survey],
        component: Main,
        children:[
            { path: 'order', title: '商品库存', access:au.order_order, name: 'order_order', icon: 'ios-recording', component: () => import('@/views/a_order/productstock.vue') }
            ,{ path: 'statistic', title: '库存记录', access:au.order_statistic, name: 'order_statistic', icon: 'ios-recording-outline', component: () => import('@/views/a_order/productRecord.vue') }
            ,{ path: 'survey', title: '套餐商品关联', access:au.survey, name: 'survey', icon: 'ios-recording-outline', component: () => import('@/views/a_order/productcontact.vue') }
        ]
    }
    ,{// 积分管理
        path: '/score',
        icon: 'ios-recording',
        name: 'score',
        title: '积分管理',
        access:[au.score,au.score_config],
        component: Main,
        children:[
            { path: 'score_config', title: '积分兑换', access:au.score_config, name: 'score_config', icon: 'ios-recording-outline', component: () => import('@/views/a_score/exchange.vue') }
        ]
    }
    ,{
        path: '/wallet',
        icon: 'social-yen',
        name: 'wallet',
        title: '钱包管理',
        access:[au.wal_wal, au.withdraw,au.accountRecordPage],
        component: Main,
        children:[
            { path: 'wallet', title: '钱包管理', access:au.wal_wal, name: 'wal_wal', icon: 'social-yen', component: () => import('@/views/a_wallet/walletPage.vue') }
            ,  { path: 'account', title: '收入管理', access:au.accountRecordPage, name: 'accountRecordPage', icon: 'social-yen-acc', component: () => import('@/views/a_wallet/accountRecordPage.vue') },
            { path: 'statistic', title: '提现管理', access:au.withdraw, name: 'withdraw', icon: 'social-yen-outline', component: () => import('@/views/a_wallet/withdrawPage.vue') }
        ]
    }

    ,{
        path: '/msg',
        icon: 'android-chat',
        name: 'msg',
        title: '消息管理',
        access:[au.msg_msg],
        component: Main,
        children:[
            { path: 'service', title: '消息中心', access:au.msg_msg, name: 'msg_msg', icon: 'android-chat', component: () => import('@/views/a_message/msgPage.vue') }
        ]
    },
    {
        path: '/spr',
        icon: 'group',
        name: 'adv',
        title: '商品管理',
        access:[au.spr_adv, au.spr_off,au.adv_active,au.adv_cou,au.adv_active_list,au.adv_cou_list,au.adv_cou_add,au.adv_cou_edit],
        component: Main,
        children:[
            { path: 'spr', title: '商品分类', access:au.spr_adv, name: 'spr_adv', icon: 'group', component: () => import('@/views/a_product/productType.vue') }
            ,{ path: 'off', title: '区域商品分类', access:au.spr_off, name: 'spr_off', icon: 'social-hackernews-outline', component: () => import('@/views/a_product/regionProduct.vue') }
            ,{ path: 'active', title: '商品套餐', access:au.adv_active_list, name: 'adv_active', icon: 'arrow-expand', component: () => import('@/views/a_product/productPackage.vue') }
            ,{ path: 'cou', title: '商品信息', access:au.adv_cou_list, name: 'adv_cou', icon: 'social-hackernews-outline', component: () => import('@/views/a_product/productInfo.vue') }
        ]
    },
//  {
//      path: '/spr',
//      icon: 'arrow-expand',
//      name: 'adv',
//      title: '推广管理',
//      access:[au.spr_adv, au.spr_off,au.adv_active,au.adv_cou,au.adv_active_list,au.adv_cou_list,au.adv_cou_add,au.adv_cou_edit],
//      component: Main,
//      children:[
//          { path: 'spr', title: '广告管理', access:au.spr_adv, name: 'spr_adv', icon: 'arrow-expand', component: () => import('@/views/a_spread/advPage.vue') }
//          ,{ path: 'off', title: '折扣管理', access:au.spr_off, name: 'spr_off', icon: 'social-hackernews-outline', component: () => import('@/views/a_spread/offPage.vue') }
//          ,{ path: 'active', title: '活动管理', access:au.adv_active_list, name: 'adv_active', icon: 'arrow-expand', component: () => import('@/views/a_spread/activePage.vue') }
//          ,{ path: 'cou', title: '优惠券管理', access:au.adv_cou_list, name: 'adv_cou', icon: 'social-hackernews-outline', component: () => import('@/views/a_spread/couPage.vue') }
//      ]
//  },
    {
        path: '/com',
        icon: 'chatbubbles',
        name: 'com',
        title: '评价管理',
        access:[au.com_com, au.com_lv],
        component: Main,
        children:[
            { path: 'com', title: '订单评价', access:au.com_com, name: 'com_com', icon: 'chatbubbles', component: () => import('@/views/a_comment/commPage.vue') }
            ,{ path: 'lv', title: '等级字典管理', access:au.com_lv, name: 'com_lv', icon: 'levels', component: () => import('@/views/a_comment/levelPage.vue') }
        ]
    },
    {
        path: '/cs',
        icon: 'ios-grid-view',
        name: 'cs',
        title: '客服管理',
        access:[au.cs_com, au.cs_setting, au.cs_about, au.cs_version],
        component: Main,
        children:[
            { path: 'complain', title: '投诉中心', access:au.cs_com, name: 'cs_com', icon: 'chatbubble-working', component: () => import('@/views/a_customer_service/complainPage.vue') }
            ,{ path: 'setting', title: '客服设置', access:au.cs_setting, name: 'cs_setting', icon: 'quote', component: () => import('@/views/a_customer_service/csSettingPage.vue') }
            ,{ path: 'about', title: '关于', access:au.cs_about, name: 'cs_about', icon: 'information', component: () => import('@/views/a_customer_service/aboutPage.vue') }
            ,{ path: 'version', title: '版本管理', access:au.cs_version, name: 'cs_version', icon: 'ios-reverse-camera-outline', component: () => import('@/views/a_customer_service/versionPage.vue') }
        ]
    },
    {
        path: '/sys',
        icon: 'ios-grid-view',
        name: 'sys',
        title: '系统管理',
        access:[au.sys_ver, au.role_role, au.user_user],
        component: Main,
        children:[
            { path: 'role', title: '角色管理', access:au.role_role, name: 'role_role', icon: 'images', component: () => import('@/views/a_role/rolePage.vue') },
            { path: 'user', title: '员工管理', access:au.user_user, name: 'user_user', icon: 'android-people', component: () => import('@/views/a_user/userPage.vue') },
            { path: 'sys', title: '系统管理', access:au.sys_ver, name: 'sys_ver', icon: 'images', component: () => import('@/views/a_system/sysPage.vue') }
            // ,
            // { path: 'score', title: '积分兑换', access:au.score, name: 'score', icon: 'ios-recording-outline', component: () => import('@views/a_score/exchange.vue')}
        ]
    }
];





// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];


