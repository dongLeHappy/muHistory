<style scoped>
    @import '../../styles/common.less';
</style>
<template>
    <div style="padding: 5px;position: relative">
        <Spin fix v-if="spinShow"></Spin>
        <Card>
            <p slot="title"><b>提现规则</b></p>
            <Row>
                <Form>
                    <FormItem>
                        <Input style="width: 401px; resize: none;"  type="textarea" :rows="5" v-model="viewModel.content"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="success" style="width: 100px;" @click="ok(1)">设置</Button>
                    </FormItem>
                </Form>
            </Row>
        </Card>
        <Card>
            <p slot="title"><b>服务计算公式</b></p>
            <Row>
                <Form>
                    <FormItem>
                        <Input style="width: 401px; resize: none;"  type="textarea" :rows="5" v-model="service.content"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="success" style="width: 100px;" @click="ok(2)">设置</Button>
                    </FormItem>
                </Form>
            </Row>
        </Card>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                queryUrl:'/sys/list',
                saveUrl:'/sys/save',
                editUrl:'/sys/edit',
                queryBody:{
                    pagination: {
                        page: 1,
                        size: 11,
                        total: 0
                    }
                },
                spinShow:true,
                viewModel:{},
                service: {}
            }
        },
        mounted(){
            this.queryOne();
        },
        methods:{
            queryOne(){
                let self = this;
                self.spinShow = true;
                self.$axios.post(self.queryUrl, self.queryBody).then(res => {
                    let i = 0;
                    for (i in res){
                        if (res[i].type === 1) self.viewModel = res[i];
                        if (res[i].type === 2) self.service = res[i];
                    }
                    setTimeout(() => {
                        self.spinShow = false;
                    }, 500)
                });
            },
            ok(val){
                let self = this;
                console.log(val);
                if (val === 1){
                    if (self.viewModel.id === undefined || self.viewModel.id === null){
                        self.viewModel.type = 1;
                    self.$axios.post(self.saveUrl, self.viewModel).then(res => {
                        self.$Notice.success({title: '提现规则', desc: '设置成功'});
                        self.queryOne();
                    });
                    }else {
                        self.viewModel.type = 1;
                        self.$axios.post(self.editUrl, self.viewModel).then(res => {
                        self.$Notice.success({title: '提现规则', desc: '设置成功'});
                        self.queryOne();
                    });
                    }
                }
                else if (val === 2){
                    self.service.type = 2;
                    if (self.service.id === undefined || self.service.id === null){
                        self.$axios.post(self.saveUrl, self.service).then(res => {
                            self.$Notice.success({title: '提现规则', desc: '设置成功'});
                            self.queryOne();
                        });
                    }else {
                        self.service.type = 2;
                        self.$axios.post(self.editUrl, self.service).then(res => {
                            self.$Notice.success({title: '提现规则', desc: '设置成功'});
                            self.queryOne();
                        });
                    }
                }
            }
        }
    }
</script>
