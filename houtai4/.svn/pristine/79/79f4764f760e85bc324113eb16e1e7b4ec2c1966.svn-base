<style scoped>
    @import '../../styles/common.less';
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
<template>
    <div style="padding: 5px; position: relative">
        <Spin fix v-if="spinShow"></Spin>
        <Card>
            <p slot="title">用户信息</p>
            <Row>
                <Form ref="viewModel" :rules="validateRules" :model="viewModel">
                    <FormItem prop="account" label="用户帐号" style="width: 240px">
                        <Input type="text" v-model="viewModel.account"></Input>
                    </FormItem>
                    <FormItem prop="password" label="用户密码" style="width: 240px">
                        <Input type="password" v-model="viewModel.password"></Input>
                    </FormItem>
                    <FormItem prop="name" label="用户名称" style="width: 240px">
                        <Input type="text" v-model="viewModel.name"></Input>
                    </FormItem>
                    <FormItem prop="mobile" label="用户手机" style="width: 240px">
                        <Input type="text" v-model="viewModel.mobile"></Input>
                    </FormItem>
                    <FormItem  label="渠道商代码" style="width: 240px" v-if="viewModel.refType==5">
                        <Input type="text" v-model="viewModel.userId" disabled></Input>
                    </FormItem>
                    <FormItem>
                        <Button style="width: 100px" type="primary" @click="ok">设置</Button>
                    </FormItem>
                </Form>
            </Row>
        </Card>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>修改成功!</div>
            <div>{{msg}}</div>
        </Spin>
    </div>
</template>
<script>
    import Cookie from 'js-cookie';
    import vjs from  '../../libs/validateRules';
    export default {
        data () {
            return {
                editUrl:'/sysUser/edit',
                viewModel:{

                    name: this.$util.getUserName(),
                    account: Cookie.get('account'),
                    password: Cookie.get('password'),
                    mobile: Cookie.get('mobile'),
                    refType: Cookie.get('refType'),//3.运营 4.服务 5.渠道商

                    userId: 1000+parseInt(Cookie.get('userId')),

                        msg: '',
                    id: this.$util.getUserId()
                },
                validateRules:{
                    account: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '不能为空', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '不能为空', trigger: 'blur'},
                        {validator: vjs.phoneV, trigger: 'blur'}
                    ]
                },
                thisAccount: Cookie.get('account'),
                spinShow:false,
                thisPassword: Cookie.get('password')
            }
        },

        methods:{
            ok(){
                let self = this;
                self.$refs.viewModel.validate(e => {
                    if (e){
                        self.$axios.post(self.editUrl, self.viewModel).then(res => {
                            if (self.viewModel.account !== self.thisAccount || self.viewModel.password !== self.thisPassword){
                                self.spinShow = true;
                                self.msg = '退出登录...';
                                setTimeout(() => {
                                    self.$store.commit('logout', this);
                                    self.$store.commit('clearOpenedSubmenu');
                                    self.$router.push({name: 'login'});
                                }, 1500);
                            }else {
                                self.$Notice.success({title: '用户信息', desc: '修改成功!'});
                                self.spinShow = true;
                                self.msg = '';
                                setTimeout(() => {
                                    self.spinShow = false;
                                }, 1500);
                                Cookie.set('user', self.viewModel.name);
                                Cookie.set('mobile', self.viewModel.mobile);
                            }
                        });
                    }else {
                        self.$Message.error('请输入完整信息');
                    }
                })
            }
        }
    }
</script>
