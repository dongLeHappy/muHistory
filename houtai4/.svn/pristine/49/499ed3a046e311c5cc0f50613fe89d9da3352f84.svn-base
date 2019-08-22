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
    <div style="padding: 5px">
        <Card>
            <p slot="title">客服设置</p>
            <Form ref="viewModel" :rules="validateRules" :labelWidth=90 :model="viewModel" >
                <Row>
                    <FormItem prop="qq" label="QQ号码">
                        <Input type="text" v-model="viewModel.qq"></Input>
                    </FormItem>
                    <FormItem prop="telephone" label="电话号码">
                        <Input type="text" v-model="viewModel.telephone"></Input>
                    </FormItem>
                </Row>
                <Row style="width: 300px;text-align: center">
                    <Button style="width: 120px" type="primary" size="large" @click="ok">确定</Button>
                    <Spin fix v-if="spinShow">
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>5s后重新设置</div>
                    </Spin>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                spinShow:false,
                queryUrl:'/custSever/1',
                editUrl:'/custSever/edit',
                validateRules:{
                    qq: [{required: true, message: '不能为空', trigger: 'blur'}],
                    telephone: [{required: true, message: '不能为空', trigger: 'blur'}],
                },
                viewModel:{}
            }
        },
        mounted(){
            this.queryOne();
        },
        methods:{
            queryOne(){
                let self = this;
                self.$axios.get(self.queryUrl).then((res) => {
                    self.viewModel = res;
                });
            },
            ok(){
                let self = this;

                self.$refs.viewModel.validate(e => {
                    if (e){
                        delete self.viewModel.ctime;
                        delete self.viewModel.utime;

                        self.$axios.post(self.editUrl, self.viewModel).then((res) => {
                            self.$Notice.success({title: '客服设置', desc:'修改成功!'});
                            self.spinShow = true;
                            setTimeout(() => {
                                self.spinShow = false;
                                self.queryOne();
                            }, 5000);
                        });
                    }else {
                        self.$Message.error('请输入完整信息!');
                    }
                });
            }
        }
    }
</script>
