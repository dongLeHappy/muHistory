<style scoped>
    @import '../../styles/common.less';
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
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入保洁员id..." v-model="myUserId" style="width: 200px;padding: 3px" clearable/></span>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入保洁员名称..." v-model="queryBody.req.name" style="width: 200px;padding: 3px" clearable/></span>
                <span @keyup.enter="queryMyListClick" ><Input placeholder="请输入手机..." v-model="queryBody.req.mobile" style="width: 200px;padding: 3px" clearable/></span>

                <!--<Select placeholder="类型" v-model="queryBody.req.type" style="width:200px;padding: 3px" clearable>-->
                    <!--<Option v-for="item in typeSelector" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                <!--</Select>-->
				<Row style="padding: 3px">
                    <!--<span style="display: none">{{test}}</span>-->
                    <span>适用地区: </span>
                    <Select placeholder="请选择省份" v-model="cityCode.province" style="width:200px;padding: 3px" clearable @on-change="selProvince">
                        <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                    <Select placeholder="请选择城市" v-model="cityCode.city" style="width:200px;padding: 3px" clearable @on-change="selCity">
                        <Option v-for="item in cityList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                    <Select placeholder="请选择区" v-model="cityCode.town" style="width:200px;padding: 3px" clearable>
                        <Option v-for="item in townList" :value="item.id" :key="item.id">{{item.name}}</Option>
                    </Select>
                </Row>
                <span @click="queryMyListClick" ><Button type="primary" icon="search">查询</Button></span>
                <span style="margin-left: 3px;" @click="exportExcel"><Button type="success">导出excel</Button></span>
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
                queryUrl:'/wallet/list',//获取列表
                queryBody:{//请求体
                    pagination:{
                        currentIndex:0,
                        page:1,
                        size:10
                    },
                    req:{}
                },
                tableLoading:true,
                disableEdit:true,

                myUserId: null,
                typeSelector:[
                    {value:1, label:'保洁员'},
                    {value:2, label:'客户'}
                ],
                selectedType:'',

                editShow:false,
                viewModel:{},//编辑单个的实体

                columns: [//字段
                    {title: 'id', key: 'id', align:'center'},
                    {title: '用户名称', key: 'cleanerName', align:'center'},
                    {title: '帐号', key: 'account', align:'center'},
                    {title: '总收益', key: 'allMoney', align:'center'},
                    {title: '总订单量', key: 'orderCount', align:'center'},
                    {title: '钱包余额', key: 'leftMoney', align:'center'},
//                    {title: '操作', key: 'action', align: 'center', fixed:'right', width:130,//操作
//                        render: (h, params) => {
//                            let arr = [];
//                            arr.push(h('Button', {props: {type: 'primary', size: 'small'}, on: {click: () => {this.show(params.index)}}}, '查看订单'));
//                            return h('div', arr);
//                        }
//                    }
                ],
                myList:[{}],
                imgshow:true,
				provinceList: [],
			    cityList: [],
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

            }
        },
        created(){
            let id = this.$route.params.id;
            if (id !== null && id !== undefined && id !== '')this.myUserId = id;
        },
        mounted(){
            let self = this;
            let cityCode = 100000;
            let levelType = 1;
            let prop = 'provinceList';
            self.$util.cityCodeSelect(self, cityCode, levelType, prop);
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
                let refType = Cookies.get('refType');
                let userId = Cookies.get('userId');
                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody.req);
                self.queryBody.req.refType =refType;

                self.queryBody.req.userId =userId;

                if (!self.$util.isEmpty(self.myUserId)) {
                    self.queryBody.req.userIds = [self.myUserId]
                }else {
                    delete self.queryBody.req.userIds
                }


                self.$axios.post(self.queryUrl, self.queryBody).then((res) => {
                    self.queryBody.pagination=res.pagination;
                    delete self.queryBody.pagination.currentIndex;
                    self.myList = res.list;
                    if (!self.$util.isEmpty(self.queryBody.req.userIds)) {
                        self.myUserId = self.queryBody.req.userIds[0]
                    }
                    self.tableLoading = false;
                })
            },
            exportExcel(){

                let self = this;

                self.tableLoading = true;

                self.$util.deleteBlankProp(self.queryBody.req);

                if (!self.$util.isEmpty(self.myUserId)) {
                    self.queryBody.req.userIds = [self.myUserId]
                }else {
                    delete self.queryBody.req.userIds
                }

                let axios = self.$axios.create({
                    baseURL: self.$axios.defaults.baseURL
                });
                this.imgshow = false;
                axios({ // 用axios发送post请求
                    method: 'post',
                    url: 'wallet/export', // 请求地址
                    data: self.queryBody,  // 参数
                    responseType: 'blob'   // 表明返回服务器返回的数据类型
                }).then((res) => { // 处理返回的文件流
                    let blob = new Blob([res.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
                    // if(blob.size > 114){
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob); //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = '钱包管理信息表.xls'; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载
                        document.body.removeChild(downloadElement); //下载完成移除元素
                        window.URL.revokeObjectURL(href); //释放掉blob对象
                        self.tableLoading = false;
                        this.queryMyList();
                    // }else {
                    //     self.$Message.error({content: '导出错误了(｡･∀･)!'});
                    // }
                    self.imgshow = true;
                });

            }
        }
    }
</script>
