<style scoped>
    @import '../../styles/common.less';
    .ivu-form-item{
        width: 300px;
    }
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
</style>
<template>
    <div style="position: relative">
        <Spin fix v-if="spinShow"></Spin>
        <div style="padding: 5px">
            <Tabs>
                <TabPane label="会员端" icon="person">

                    <Card style="margin: 5px">
                        <p slot="title">Android</p>
                        <Form ref="MA" :rules="validateRules" :labelWidth=90 :model="MA" >
                            <FormItem prop="about" label="关于我们">
                                <Input type="text" v-model="MA.about"></Input>
                            </FormItem>
                            <FormItem prop="protocol" label="注册协议">
                                <Input type="text" v-model="MA.protocol"></Input>
                            </FormItem>
                            <FormItem prop="useTutorial" label="使用教程">
                                <Input type="text" v-model="MA.useTutorial"></Input>
                            </FormItem>
                            <FormItem prop="photoTutorial" label="拍照教程">
                                <Input type="text" v-model="MA.photoTutorial"></Input>
                            </FormItem>
                            <FormItem>
                                <Button style="width:120px" type="success" @click="ok('MA')">设置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                    <Card style="margin: 5px">

                        <p slot="title">IOS</p>
                        <Form ref="MI" :rules="validateRules" :labelWidth=90 :model="MI" >
                            <FormItem prop="about" label="关于我们">
                                <Input type="text" v-model="MI.about"></Input>
                            </FormItem>
                            <FormItem prop="protocol" label="注册协议">
                                <Input type="text" v-model="MI.protocol"></Input>
                            </FormItem>
                            <FormItem prop="useTutorial" label="使用教程">
                                <Input type="text" v-model="MI.useTutorial"></Input>
                            </FormItem>
                            <FormItem prop="photoTutorial" label="拍照教程">
                                <Input type="text" v-model="MI.photoTutorial"></Input>
                            </FormItem>
                            <FormItem>
                                <Button style="width:120px" type="success" @click="ok('MI')">设置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                    <Card style="margin: 5px">

                        <p slot="title">微信小程序</p>
                        <Form ref="MW" :rules="validateRules" :labelWidth=90 :model="MW" >
                            <FormItem prop="about" label="关于我们">
                                <Input type="text" v-model="MW.about"></Input>
                            </FormItem>
                            <FormItem prop="protocol" label="注册协议">
                                <Input type="text" v-model="MW.protocol"></Input>
                            </FormItem>
                            <FormItem prop="useTutorial" label="使用教程">
                                <Input type="text" v-model="MW.useTutorial"></Input>
                            </FormItem>
                            <FormItem prop="photoTutorial" label="拍照教程">
                                <Input type="text" v-model="MW.photoTutorial"></Input>
                            </FormItem>
                            <FormItem>
                                <Button style="width:120px" type="success" @click="ok('MW')">设置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </TabPane>

                <TabPane label="保洁员端" icon="ios-person-outline">

                    <Card style="margin: 5px">
                        <p slot="title">Android</p>
                        <Form ref="CA" :rules="validateRules" :labelWidth=90 :model="CA" >
                            <FormItem prop="about" label="关于我们">
                                <Input type="text" v-model="CA.about"></Input>
                            </FormItem>
                            <FormItem prop="protocol" label="注册协议">
                                <Input type="text" v-model="CA.protocol"></Input>
                            </FormItem>
                            <FormItem prop="useTutorial" label="使用教程">
                                <Input type="text" v-model="CA.useTutorial"></Input>
                            </FormItem>
                            <FormItem prop="photoTutorial" label="拍照教程">
                                <Input type="text" v-model="CA.photoTutorial"></Input>
                            </FormItem>
                            <FormItem>
                                <Button style="width:120px" type="success" @click="ok('CA')">设置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                    <Card style="margin: 5px">

                        <p slot="title">IOS</p>
                        <Form ref="CI" :rules="validateRules" :labelWidth=90 :model="CI" >
                            <FormItem prop="about" label="关于我们">
                                <Input type="text" v-model="CI.about"></Input>
                            </FormItem>
                            <FormItem prop="protocol" label="注册协议">
                                <Input type="text" v-model="CI.protocol"></Input>
                            </FormItem>
                            <FormItem prop="useTutorial" label="使用教程">
                                <Input type="text" v-model="CI.useTutorial"></Input>
                            </FormItem>
                            <FormItem prop="photoTutorial" label="拍照教程">
                                <Input type="text" v-model="CI.photoTutorial"></Input>
                            </FormItem>
                            <FormItem>
                                <Button style="width:120px" type="success" @click="ok('CI')">设置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                    <Card style="margin: 5px">

                        <p slot="title">微信小程序</p>
                        <Form ref="CW" :rules="validateRules" :labelWidth=90 :model="CW" >
                            <FormItem prop="about" label="关于我们">
                                <Input type="text" v-model="CW.about"></Input>
                            </FormItem>
                            <FormItem prop="protocol" label="注册协议">
                                <Input type="text" v-model="CW.protocol"></Input>
                            </FormItem>
                            <FormItem prop="useTutorial" label="使用教程">
                                <Input type="text" v-model="CW.useTutorial"></Input>
                            </FormItem>
                            <FormItem prop="photoTutorial" label="拍照教程">
                                <Input type="text" v-model="CW.photoTutorial"></Input>
                            </FormItem>
                            <FormItem>
                                <Button style="width:120px" type="success" @click="ok('CW')">设置</Button>
                            </FormItem>
                        </Form>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    </div>

</template>
<script>
    export default {
        data () {
            return {
                spinShow:false,
                queryUrl:'/about/list',
                saveUrl:'/about/save',
                editUrl:'/about/edit',
                MA:{},//会员-android
                MI:{},//会员-IOS
                MW:{},//会员-微信
                CA:{},//保洁员-android
                CI:{},//保洁员-IOS
                CW:{},//保洁员-微信
                validateRules:{}
            }
        },
        mounted(){
            this.queryOne();
        },
        methods:{
            queryOne(){
                //客户端类型:1会员端,2保洁员端 clientType
                //平台类型:1安卓,2ios,3小程序 platform
                let self = this;
                self.spinShow = true;

                self.$axios.post(self.queryUrl, {pagination:{page:1, size: 20}}).then((res) => {
                    let list = res;
                    let i = 0;
                    for (i in list){
                        if (list[i].clientType === 1 && list[i].platform === 1) self.MA = list[i];
                        else if (list[i].clientType === 1 && list[i].platform === 2) self.MI = list[i];
                        else if (list[i].clientType === 1 && list[i].platform === 3) self.MW = list[i];
                        else if (list[i].clientType === 2 && list[i].platform === 1) self.CA = list[i];
                        else if (list[i].clientType === 2 && list[i].platform === 2) self.CI = list[i];
                        else if (list[i].clientType === 2 && list[i].platform === 3) self.CW = list[i];
                    }
                    self.spinShow = false;
                });
            },
            ok(val){
                let self = this;
                self.spinShow = true;
                if (val === 'MA') {
                    if (self.MA.id === undefined || self.MA.id === null){
                        //添加
                        self.MA.clientType = 1;
                        self.MA.platform = 1;
                        self.$axios.post(self.saveUrl, self.MA).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }else{
                        //编辑
                        self.$axios.post(self.editUrl, self.MA).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }
                }
                else if (val === 'MI') {
                    if (self.MI.id === undefined || self.MI.id === null){
                        //添加
                        self.MI.clientType = 1;
                        self.MI.platform = 2;
                        self.$axios.post(self.saveUrl, self.MI).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }else{
                        //编辑
                        self.$axios.post(self.editUrl, self.MI).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }
                }
                else if (val === 'MW') {
                    if (self.MW.id === undefined || self.MW.id === null){
                        //添加
                        self.MW.clientType = 1;
                        self.MW.platform = 3;
                        self.$axios.post(self.saveUrl, self.MW).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }else{
                        //编辑
                        self.$axios.post(self.editUrl, self.MW).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }
                }
                else if (val === 'CA') {
                    if (self.CA.id === undefined || self.CA.id === null){
                        //添加
                        self.CA.clientType = 2;
                        self.CA.platform = 1;
                        self.$axios.post(self.saveUrl, self.CA).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }else{
                        //编辑
                        self.$axios.post(self.editUrl, self.CA).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }
                }
                else if (val === 'CI') {
                    if (self.CI.id === undefined || self.CI.id === null){
                        //添加
                        self.CI.clientType = 2;
                        self.CI.platform = 2;
                        self.$axios.post(self.saveUrl, self.CI).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }else{
                        //编辑
                        self.$axios.post(self.editUrl, self.CI).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }
                }
                else if (val === 'CW') {
                    if (self.CW.id === undefined || self.CW.id === null){
                        //添加
                        self.CW.clientType = 2;
                        self.CW.platform = 3;
                        self.$axios.post(self.saveUrl, self.CW).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }else{
                        //编辑
                        self.$axios.post(self.editUrl, self.CW).then(res => {
                            self.$Notice.success({title: '关于设置', desc: '设置成功!'});
                            setTimeout(() => {
                                self.queryOne()
                            }, 750);
                        });
                    }
                }
            }
        }
    }
</script>
