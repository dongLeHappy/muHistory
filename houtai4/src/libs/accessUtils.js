let accessUtils = {};

accessUtils.mem_mem = 1;// 用户管理
accessUtils.mem_edit = 22;// 用户修改

accessUtils.clean_clean = 2;// 保洁员管理
accessUtils.clean_onlineMap = 3;// 在线地图状态
accessUtils.clean_reg = 4;// 保洁员登记
accessUtils.clean_edit = 23;// 保洁员修改
accessUtils.clean_audit = 24;// 保洁员审核

accessUtils.ser_ser = 5;// 服务管理
accessUtils.ser_save = 25;// 服务添加
accessUtils.ser_edit = 26;// 服务修改

accessUtils.order_order = 6;// 订单管理
accessUtils.order_delivery = 27;// 订单派送
accessUtils.order_remark = 56;// 订单备注
accessUtils.order_cancel = 63;// 订单备注
accessUtils.order_statistic = 7;// 订单统计
accessUtils.survey = 73; // 数据概况

accessUtils.wal_wal = 8;// 钱包管理
accessUtils.withdraw = 9;// 提现管理
accessUtils.accountRecordPage = 55;// 提现管理
accessUtils.withdraw_audit = 28;// 提现审核

accessUtils.msg_msg = 10;// 消息中心
accessUtils.msg_save = 29;// 消息添加
accessUtils.msg_edit = 30;// 消息修改
accessUtils.msg_delete = 53;// 消息删除
accessUtils.msg_push = 54;// 消息推送

accessUtils.spr_adv = 11;// 广告管理
accessUtils.adv_save = 31;// 广告添加
accessUtils.adv_edit = 32;// 广告修改
accessUtils.adv_delete = 33;// 广告删除

accessUtils.spr_off = 12;// 折扣管理
accessUtils.off_save = 34;// 折扣添加
accessUtils.off_edit = 35;// 折扣修改
accessUtils.off_delete = 36;// 折扣删除

accessUtils.com_com = 13;// 订单评价
accessUtils.com_audit = 37;// 订单审核

accessUtils.com_lv = 14;// 等级字典管理
accessUtils.lv_save = 38;// 等级添加
accessUtils.lv_edit = 39;// 等级修改
accessUtils.lv_delete = 40;// 等级删除

accessUtils.cs_com = 15;// 投诉中心
accessUtils.cs_handle = 41;// 投诉处理

accessUtils.cs_setting = 16;// 客服设置

accessUtils.cs_about = 17;// 关于

accessUtils.cs_version = 18;// 版本管理
accessUtils.ver_save = 42;// 版本添加
accessUtils.ver_edit = 43;// 版本修改
accessUtils.ver_delete = 44;// 版本删除

accessUtils.role_role = 19;// 角色管理
accessUtils.role_save = 45;// 角色添加
accessUtils.role_edit = 46;// 角色修改
accessUtils.role_delete = 47;// 角色删除
accessUtils.role_bind = 48;// 角色权限绑定

accessUtils.user_user = 20;// 员工管理
accessUtils.user_save = 49;// 员工添加
accessUtils.user_edit = 50;// 员工修改
accessUtils.user_delete = 51;// 员工删除
accessUtils.user_bind = 52;// 员工角色绑定

accessUtils.proxy_proxy = 70;// 服务商管理
accessUtils.proxy_save = 71;// 服务商添加
accessUtils.proxy_edit = 72;// 服务商修改
accessUtils.sys_ver = 21;// 系统管理

accessUtils.score = 74;// 积分兑换
accessUtils.score_config = 75;// 积分兑换配置
accessUtils.score_edit = 86;// 积分修改
accessUtils.score_delete = 87;// 积分删除

accessUtils.adv_active = 76;// 活动管理
accessUtils.adv_active_item = 78;// 查看单个元素
accessUtils.adv_active_delete = 82;// 删除活动
accessUtils.adv_active_edit = 83;// 修改活动
accessUtils.adv_active_add = 84;// 添加活动
accessUtils.adv_cou_add = 80;// 添加优惠券
accessUtils.adv_cou_examine = 88;// 优惠劵审核


accessUtils.adv_cou = 77;// 优惠券管理
accessUtils.adv_cou_item = 79;// 查看单个元素
accessUtils.adv_cou_edit = 81;// 修改优惠券
accessUtils.adv_cou_delete = 85;// 删除优惠券

//新加的商品管理
accessUtils.pro_protype = 89;//商品分类
accessUtils.protype_save = 90;// 商品分类添加
accessUtils.protype_edit = 91;// 商品分类修改
accessUtils.protype_delete = 92;// 商品分类删除

accessUtils.pro_regtype = 93;// 区域商品分类
accessUtils.regtype_save = 94;// 区域商品分类添加
accessUtils.regtype_edit = 95;// 区域商品分类修改
accessUtils.regtype_delete = 96;//区域商品分类删除

accessUtils.pro_propackage = 97;// 商品套餐
accessUtils.propackage_save = 98;// 商品套餐添加
accessUtils.propackage_edit = 99;// 商品套餐修改
accessUtils.propackage_delete = 100;// 商品套餐删除

accessUtils.pro_proinfo = 101;// 商品信息
accessUtils.proinfo_save = 102;// 商品信息添加
accessUtils.proinfo_edit = 103;// 商品信息修改
accessUtils.proinfo_delete = 104;// 商品信息删除

accessUtils.pro_stock = 105;// 库存表
accessUtils.stock_save = 106;// 库存添加
accessUtils.stock_edit = 107;// 库存修改
accessUtils.stock_delete = 108;// 库存删除

accessUtils.pro_stockrecord = 109;// 库存记录
accessUtils.stockrecord_save = 110;// 库存记录添加
accessUtils.stockrecord_edit = 111;// 库存记录修改
accessUtils.stockrecord_delete = 112;// 库存记录删除

accessUtils.pro_promeal = 113;// 商品套餐关联
accessUtils.promeal_save = 114;// 商品套餐关联添加
accessUtils.promeal_edit = 115;// 商品套餐关联修改
accessUtils.promeal_delete = 116;// 商品套餐关联删除



accessUtils.baseUrl = '/quickclean/';

accessUtils.getId = function (code) {
    let res = null;
    switch (code) {
        case 1: res = 34; break;
        case 22:res = 36; break;
        case 2:res = 37; break;
        case 23:res = 39; break;
        case 24:res = 40; break;
        case 3:res = 41; break;
        case 4:res = 42; break;
        case 5:res = 43; break;
        case 25:res = 45; break;
        case 26:res = 46; break;
        case 6:res = 47; break;
        case 55:res = 49; break;
        case 56:res = 50; break;
        case 27:res = 51; break;
        case 8:res = 52; break;
        case 9:res = 53; break;
        case 28:res = 54; break;
        case 10:res = 55; break;
        case 30:res = 57; break;
        case 53:res = 58; break;
        case 54:res = 59; break;
        case 29:res = 60; break;
        case 11:res = 61; break;
        case 31:res = 63; break;
        case 32:res = 64; break;
        case 33:res = 65; break;
        case 12:res = 66; break;
        case 35:res = 68; break;
        case 34:res = 69; break;
        case 36:res = 70; break;
        case 37:res = 73; break;
        case 14:res = 74; break;
        case 38:res = 76; break;
        case 39:res = 77; break;
        case 40:res = 78; break;
        case 57:res = 79; break;
        case 15:res = 80; break;
        case 41:res = 82; break;
        case 16:res = 83; break;
        case 58:res = 84; break;
        case 59:res = 85; break;
        case 17:res = 87; break;
        case 60:res = 89; break;
        case 61:res = 90; break;
        case 18:res = 91; break;
        case 42:res = 93; break;
        case 43:res = 94; break;
        case 44:res = 95; break;
        case 20:res = 96; break;
        case 49:res = 98; break;
        case 50:res = 99; break;
        case 51:res = 100; break;
        case 52:res = 101; break;
        case 19:res = 102; break;
        case 45:res = 104; break;
        case 46:res = 105; break;
        case 47:res = 106; break;
        case 48:res = 107; break;
        case 62:res = 108; break;
        case 63:res = 111; break;
        case 21:res = 109; break;
        case 7:res = 110; break;
        case 13:res = 71; break;
        case 70:res = 114; break;
        case 71:res = 115; break;
        case 72:res = 116; break;
        case 73:res = 117; break;
        case 74:res = 119; break;
        case 75:res = 120; break;
        case 76:res = 121; break;
        case 77:res = 122; break;
        case 78:res = 123; break;
        case 79:res = 124; break;
        case 80:res = 125; break;
        case 81:res = 126; break;
        case 82:res = 127; break;
        case 83:res = 128; break;
        case 84:res = 129; break;
        case 85:res = 130; break;
        case 86:res = 131; break;
        case 87:res = 132; break;
        case 88:res = 133; break;
        
        case 89:res = 134; break;
        case 90:res = 135; break;
        case 91:res = 136; break;
        case 92:res = 137; break;
        case 93:res = 138; break;
        case 94:res = 139; break;
        case 95:res = 140; break;
        case 96:res = 141; break;
        case 97:res = 142; break;
        case 98:res = 143; break;
        case 99:res = 144; break;
        case 100:res = 145; break;
        case 101:res = 146; break;
        case 102:res = 147; break;
        case 103:res = 148; break;
        case 104:res = 149; break;
        case 105:res = 150; break;
        case 106:res = 151; break;
        case 107:res = 152; break;
        case 108:res = 153; break;
        case 109:res = 154; break;
        case 110:res = 155; break;
        case 111:res = 156; break;
        case 112:res = 157; break;
        case 113:res = 158; break;
        case 114:res = 159; break;
        case 115:res = 160; break;
        case 116:res = 161; break;
    }
    return res;
};

export default accessUtils;
