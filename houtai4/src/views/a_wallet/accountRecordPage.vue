<style scoped>
    @import '../../styles/common.less';
    .ivu-btn-primary {
        margin: 2px 2px;
    }
    .loadbox{position:absolute;width:100%;height:100%;
        background:rgba(0,0,0,.2);
        z-index: 9999999;}
    .loadbox img{width:100px;height:100px;position:absolute;top:50%;left:50%;margin-left:-50px;margin-top:-50px;}
</style>
<template>
    <div style="padding: 5px">
        <div class="loadbox" :hidden="imgshow" >
            <img src="../../images/d161165956e23.gif"  class="loadingimg" />
        </div>
        <Card>
            <Row>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入保洁员id..." v-model="queryBody.cleanerName" style="width: 200px;padding: 3px" clearable/></span>

                <div style="padding: 3px">
                    <DatePicker type="date" placement="bottom-start" v-model="createTime" style="width: 150px;" placeholder="开始日期" clearable></DatePicker>
                    -
                    <DatePicker type="date" placement="bottom-end" v-model="updateTime" style="width: 150px;" placeholder="截止日期" clearable></DatePicker>
                    <span @click="queryMyListClick" ><Button type="primary" icon="search">查询</Button></span>
                    <span style="margin-left: 3px;"><Button type="success" @click="exportExcel">导出excel</Button></span>
                </div>
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

    </div>
</template>
<script>
    import Cookies from 'js-cookie';
    export default {
        data () {
            return {
                queryUrl:'/backend/account/list',//获取列表
                queryUrlIncome:'/backend/account/income',//获取列表
                queryBody:{//请求体
                    pagination:{
                        currentIndex:0,
                        page:1,
                        size:10
                    }
                },
                ruleQueryUrl:'/sys/list',
                ruleQueryBody:{
                    pagination: {
                        page: 1,
                        size: 11,
                        total: 0
                    },
                    type: 1
                },
                provinceList: [],
                cityList: [],
                myListIncome:[],
                townList: [],
                cityCode: {
                    province: null,
                    city: null,
                    town: null
                },
                editCityCode: {
                    province: null,
                    city: null,
                    town: null
                },
                viewingRule:'',
                tableLoading:true,
                disableEdit:true,


                withRule:false,
                editShow:false,
                verifyShow:false,
                createTime:null,
                updateTime:null,

                appendOrderRemark:'',
                viewModel:{},//编辑单个的实体
                userName:this.$util.getUserName(),
                userId:this.$util.getUserId(),

                columns: [//字段
                    {title: 'id', key: 'id', align:'center'},
                    {title: '保洁员姓名', key: 'cleanerName', align:'center'},
                    {title: '保洁收入金额', key: 'amount', align:'center'},
                    {title: '描述信息', key: 'description', align:'center'},
                    {title: '订单号', key: 'orderSn', align:'center'},
                    {title: '创建时间', key: 'createTime', align:'center', minWidth:70},
                    {title: '更新时间', key: 'updateTime', align:'center', minWidth:70}
                ]
                ,myList:[{}],
                imgshow:true
            }
        },

        created () {
            let self = this;
            let cityCode = 100000;
            let levelType = 1;
            let prop = 'provinceList';
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);
        },
        mounted(){
            let self = this;
            self.queryMyList();
        },
        methods:{
            // 省份确定城市
            selProvince (val) {
                let self = this;

                if (self.editShow) {
                    // 非搜索列表情况下
                    self.editCityCode.city = null;
                    self.editCityCode.town = null;
                } else {
                    // 搜索列表情况下
                    self.cityCode.city = null;
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 2, 'cityList');
            },
            selCity (val) {
                let self = this;

                if (self.editShow) {
                    // 非搜索列表情况下
                    self.editCityCode.town = null;
                } else {
                    // 搜索列表情况下
                    self.cityCode.town = null;
                }

                self.$util.cityCodeSelect(self, val, 3, 'townList');
            },


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
                self.queryBody.startTime = self.createTime;
                self.queryBody.endTime = self.updateTime;
                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    if (!self.$util.isEmpty(self.queryBody.createTime)) self.queryBody.createTime = new Date(self.queryBody.createTime);
                    if (!self.$util.isEmpty(self.queryBody.updateTime)) self.queryBody.updateTime = new Date(self.queryBody.updateTime);
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;

                    self.tableLoading = false;
                })
            },
            queryMyListIncome(){
                let self = this;
                self.queryBody.startTime = self.createTime;
                self.queryBody.endTime = self.updateTime;
                self.$axios.post(self.queryUrlIncome, self.queryBody).then((res) => {
                    self.myListIncome = res.recordPage;

                })
            },

            cancel () {
                let self = this;
                self.verifyShow = false;
            },
            showRule(){
                let self = this;

                self.$axios.post(self.ruleQueryUrl, self.ruleQueryBody).then(res => {
                    self.viewingRule = res[0].content;
                    self.withRule = true;
                });
            },
            verify(index){
                let self = this;
                self.viewModel = JSON.parse(JSON.stringify(self.myList[index]));
                self.verifyShow = true;
            },
            exportExcel(){

                let self = this;
                self.$util.deleteBlankProp(self.queryBody.req);
                self.queryBody.startTime = self.createTime;
                self.queryBody.endTime = self.updateTime;
                //    self.$Message.error({content: '还不是服务商!'+self.startWithdrawTime.formatDef()});
                let axios = self.$axios.create({
                    baseURL: self.$axios.defaults.baseURL
                });
                this.imgshow = false;
                //   self.$Message.error({content: '还不是服务商!'});
                axios({ // 用axios发送post请求
                    method: 'post',
                    url: '/backend/account/export', // 请求地址
                    data: self.queryBody,  // 参数
                    responseType: 'blob'   // 表明返回服务器返回的数据类型
                }).then((res) => { // 处理返回的文件流
                    let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
                    // if(blob.size > 114){
                    let downloadElement = document.createElement('a');
                    let href = window.URL.createObjectURL(blob); //创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = '收入管理信息表.xls'; //下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); //点击下载
                    document.body.removeChild(downloadElement); //下载完成移除元素
                    window.URL.revokeObjectURL(href); //释放掉blob对象
                    self.tableLoading = false;
                    this.queryMyList();
                    // }else {
                    //     self.$Message.error({content: '导出错误了(｡･∀･)!'});
                    // }
                    self.imgshow = true
                });


            }
        }
    }
</script>
