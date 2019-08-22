<style scoped>
    @import '../../styles/common.less';
    .warn-btn{
        margin: 3px;
    }

</style>
<template>
    <div style="padding: 5px">
        <Card>
            <Row>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入联系号码..." v-model="queryBody.contactNum" style="width: 200px;padding: 3px" clearable/></span>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入联系人姓名..." v-model="queryBody.contactName" style="width: 200px;padding: 3px" clearable/></span>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入订单号..." v-model="queryBody.orderNo" style="width: 200px;padding: 3px" clearable/></span>

                <Select placeholder="处理状态" v-model="queryBody.status" style="width:200px;padding: 3px" clearable>
                    <Option v-for="item in statusSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>

                <span @click="queryMyListClick" style="margin: 0 10px;"><Button type="primary" icon="search">查询</Button></span>
            </Row>
            <Row>
                <span class="warn-btn" @click="queryBody.orderOpinionFlag = 1;queryMyList();"><Button type="warning">订单投诉</Button></span>
                <span class="warn-btn" @click="queryBody.orderOpinionFlag = 0;queryMyList();"><Button type="warning">其他投诉</Button></span>
            </Row>
            <Row class="margin-top-10 searchable-table-con1">
                <Table border :columns="columns" :data="myList" :loading="tableLoading" no-data-text="暂无数据"></Table>
                <Page style="margin-top: 5px" show-total
                      :total="queryBody.pagination.total"
                      :current="queryBody.pagination.page"
                      :page-size="queryBody.pagination.size"
                      @on-change="changePage"
                      show-elevator
                ></Page>
            </Row>
        </Card>


        <!--处理模块-->
        <Modal :width="300" v-model="handleShow" title="投诉处理">
            <Row>
                <p><b>审核人: {{userName}}</b></p>
            </Row>
            <Row>
                <Select placeholder="处理状态" v-model="handleEntity.status" style="margin-top: 5px" clearable>
                    <Option v-for="item in statusSel" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </Row>
            <Row style="margin-top: 10px">
                <Input style="" type="textarea" v-model="handleEntity.handlerResult" :rows="8" placeholder="请输入处理结果..."></Input>
            </Row>
            <div slot="footer">
                <Button type="text" size="large" @click="handleCancel">返回</Button>
                <Button type="primary" size="large" @click="handleOk">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                queryUrl:'/opinion/list',//获取列表
                handleUrl:'/opinion/handle',//获取列表

                queryBody:{//请求体
                    pagination:{
                        page:1,
                        size:10,
                        total:10
                    }
                }
                ,myList:[{}],
                tableLoading:true,

                userName:this.$util.getUserName(),
                userId:this.$util.getUserId(),

                statusSel:[
                    {value:0, label:'未处理'},
                    {value:1, label:'已处理'},
                    {value:2, label:'待处理'}
                ],

                handleShow:false,
                handleEntity:{},

                editShow:false,
                viewModel:{},//编辑单个的实体
                columns: [//字段
                    {title: '联系人', key: 'contactName', align:'center'},
                    {title: '联系号码', key: 'contactNum', align:'center'},
                    {title: '账号', key: 'refId', align:'center'},
                    {title: '投诉时间', key: 'ctime', align:'center'},
                    {title: '投诉内容', key: 'msg', align:'center'},
                    {title: '处理人', key: 'handlerId', align:'center'},
                    {title: '处理状态', key: 'status', align:'center'
                        , render:(h, params) => {
                        let self = this;
                        let type = self.myList[params.index].status;
                        if (type === 0) type = h('div', {attrs: {style:'color:brown'}}, '未处理');
                        else if (type === 1) type = h('div', {attrs: {style:'color:green'}}, '已处理');
                        else if (type === 2) type = h('div', {attrs: {style:'color:red'}}, '待处理');
                        else type = h('div', {attrs: {style:'color:brown'}}, '未知');
                        return type;
                    }},
                    {title: '处理结果', key: 'handlerResult', align:'center'},
                    {title: '操作', key: 'action', align: 'center', fixed:'right', width:130,//操作
                        render: (h, params) => {
                            let arr = [];
                            let access = this.$util.getAccess('cs_handle');
                            if (access)arr.push(h('Button', {props: {type: 'success', size: 'small'}, on: {click: () => {this.handleComplain(params.index)}}}, '处理'));
                            return h('div', arr);
                        }
                    }
                ]


            }
        },
        mounted(){
            let self = this;
            self.queryMyList();
        },
        methods:{
            changePage(val){
                let self = this;
                self.queryBody.pagination.page = val;
                self.queryMyList();
            },
            queryMyListClick(){
                let self = this;
                self.queryBody.pagination = {page:1, total:10, size:10};
                self.queryMyList();
            },
            queryMyList(){
                let self = this;

                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody);

                let tt = {title: '订单号', key: 'orderNo', align:'center'};
                if (self.queryBody.orderOpinionFlag === 1 || self.queryBody.orderOpinionFlag === undefined) {
                    if (self.columns[0].key !== 'orderNo') {
                        self.columns.unshift(tt)
                    }
                }
                else {
                    if (self.columns[0].key === 'orderNo') {
                        self.columns.splice(0, 1)
                    }
                }

                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    self.tableLoading = false;
                })
            },
            handleOk () {
                let self = this;
                self.handleEntity.id = self.viewModel.id;
                self.handleEntity.handlerId = self.userId;

                self.$axios.post(self.handleUrl, self.handleEntity).then((res) => {
                    self.$Notice.success({title:'投诉处理', desc:'处理成功'});
                    self.handleShow = false;
                    self.queryMyList();
                });
            },
            handleCancel () {
                let self = this;
                self.handleShow = false;
            },
            handleComplain(index){
                let self = this;
                self.viewModel = self.myList[index];
                self.handleEntity = {};
                self.handleEntity.status = self.viewModel.status;
                self.handleEntity.handlerResult = self.viewModel.handlerResult;

                self.handleShow= true;
            }
        }
    }
</script>
