<style lang="less" scoped>
    @import './login.less';
    .ivu-input-large{
        border: red;
    }
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.userName" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Input style="width: 150px;float: left" size="large" type="text" v-model="form.code" placeholder="请输入验证码"></Input>
                            <span @click="refreshImg" style="display: block;height: 36px;float: left;margin-left: 10px">
                                <img style="height: 100%" :src="imgUrl" alt=""/>
                            </span>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            loginUrl: '/sysUser/public/login',
            imgUrl: this.$util.codeImgUrl,
            menuUrl: '/sysUser/public/listAuthByUserId',
            menuCokUrl: '/sysUser/public/listAuthByToken',
            id:1,
            form: {
                userName: '',
                password: '',
                code: ''
            },
            accessList: [],
            rules: {
                userName: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    created(){
        for(let i = 1; i < 70; i++) {
            this.accessList.push(0);
        }
        Cookies.set('access', this.$util.jiami('0,0'));
    },
    methods: {
        refreshImg() {
            this.id = this.id + 1;
            console.log(this.imgUrl)
            this.imgUrl = this.$util.codeImgUrl+'?id='+(this.id);
        },
        handleSubmit () {
            let self = this;
            self.$refs.loginForm.validate((valid) => {
                if (valid) {
                    if (self.$util.isEmpty(this.form.code)) {
                        self.$Message.error('请输入验证码!');
                        return;
                    }

                    let entity = {};
                    entity.account = self.form.userName;
                    entity.password = self.form.password;

                    entity.captchaKey = Cookies.get('CAPTCHA-KEY');
                    entity.captchaValue = self.form.code;
                    Cookies.set('password', self.form.password);
                    Cookies.set('account', self.form.userName);


                    self.$util.getAllArea(self);
                    self.$axios.post(self.loginUrl, entity).then((res) => {
                    	console.log("登录"+JSON.stringify(res))
                        Cookies.set('userId', res.refId);
                        Cookies.set('refType', res.refType);
                        Cookies.set('user', res.refName);
                        Cookies.set('mobile', res.mobile);
                        Cookies.set('token', res.loginToken);

                        if (res.cityCode != null) {
                            Cookies.set('cityCode', res.cityCode);
                        }
                        Cookies.set('agentStatus', res.agentStatus);

                        if (res.refType == 5) {
                            Cookies.set('userId', res.refId);
                            // 这是渠道商
                            // alert('渠道商登录成功');
                            // return;

                        } else if ( res.refType == 4) {
                            // 这是服务商
                            // alert('服务商登录成功');
                            // return;
                        }

                        if (res.agentStatus == null || res.agentStatus === 1) {
                            // 权限
                            self.$axios.post(self.menuCokUrl).then(res => {
                                for(let i = 0; i < res.length; i++) {
                                    if (res[i] !== null) {
                                        self.accessList[res[i] - 1 ] = 1;
                                    }
                                }
                                if (self.$util.isEmpty(Cookies.get('user'))) {
                                    Cookies.set('user', Cookies.get('user'));
                                }

                                Cookies.remove('access');
                                Cookies.set('access', self.$util.jiami(this.accessList.toString()));
                                // 更新菜单
                                self.$store.commit('updateMenulist');
                                // this.$store.commit('setAvator', 'http://tx.haiqq.com/uploads/allimg/150326/161142L17-4.jpg');
                                let adb = self.$util.getAccess('order_statistic');

                                let adbs = self.$util.getAccess('survey');
                                if (self.$util.getAccess('order_statistic')) {
                                    self.$router.push({name: 'home_index'});
                                } else {
                                    if (self.$util.getAccess('survey')) {
                                        self.$router.push({name: 'statistic'});
                                    }else{
                                        self.$router.push({name: 'usr_center'});
                                    }
                                }
                            });
                        } else {
                            self.$Message.error('你的代理期已过，无法登陆!');
                        }
                    });
                };
            });
        }
    }
};
</script>

<style>

</style>
