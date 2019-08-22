<style scoped>
    @import '../../styles/common.less';
    .line-chart-con{
        height: 500px;
    }
    .card-title{
        color: #7d818f;
    }
    .rowflex{display: flex;display: -webkit-flex;flex-flow: row nowrap;}
    .tree-left{margin-top:5px;}
</style>
<template>
	<div class="rowflex">
		<div class="tree-left">
			<Card>
				<!--show-checkbox-->
				<Tree :data="baseData"></Tree>
			</Card>
		</div>
	    <div style="padding: 5px;width:100%">
	        <Card>
	            <p slot="title">统计信息</p>
	            <div>
	                <Row :gutter="16">
	                    <Col span="6" style="border: 1px solid #e9eaec;padding-top: 20px;padding-bottom: 20px">
	                    <Row>
	                        <Row>
	                            <Col span="4" >
	                                <div style="width: 74px; height: 74px;">
	                                    <img src="../../images/cal1.png" style="width: 100%; height: 100%" />
	                                </div>
	                            </Col>
	                            <Col offset="3" span="12" style="text-align: center;margin-top: 12px;font-size: 1.4em;">
	                                <Row>每日销售额</Row>
	                                <Row style="color: #f35c42; font-weight: 700">
	                                    <count-up countSize="20px" :decimals=2 id-name="todayOrderMoney" :end-val="count.todayOrderMoney"></count-up>
	                                </Row>
	                            </Col>
	
	                        </Row>
	                        <Row style="">
	                            <Col span="4" >
	                                <div style="width: 74px; height: 74px;">
	                                    <img src="../../images/cal2.png" style="width: 100%; height: 100%" />
	                                </div>
	                            </Col>
	                            <Col offset="3" span="12" style="text-align: center;margin-top: 12px;font-size: 1.4em;">
	                                <Row>每月销售额</Row>
	                                <Row style="color: #f35c42; font-weight: 700">
	                                    <count-up countSize="20px" :decimals=2 id-name="monthOrderMoney" :end-val="count.monthOrderMoney"></count-up>
	                                </Row>
	                            </Col>
	                        </Row>
	                    </Row>
	                    </Col>
	
	                    <Col span="18">
	                    <Row :gutter="5"  style="border: 1px solid #e9eaec;padding: 12px">
	                        <Col span="8" style="font-size: 1.2em; text-align: center;margin-top: 5px">
	                            <div style="color: #f87463; font-weight: 700">今日订单数</div>
	                            <div>
	                                <count-up countSize="20px" id-name="todayOrderNum" :end-val="count.todayOrderNum"></count-up>
	                            </div>
	                        </Col>
	                        <Col span="8" style="font-size: 1.2em; text-align: center;margin-top: 5px">
	                            <div style="color: #2c8df1; font-weight: 700">月订单数量</div>
	                            <div>
	                                <count-up countSize="20px" id-name="monthOrderNum" :end-val="count.monthOrderNum"></count-up>
	                            </div>
	                        </Col>
	
	                        <Col span="8" style="font-size: 1.2em; text-align: center;margin-top: 5px">
	                            <div style="color: #64d572; font-weight: 700">订单总数量</div>
	                            <div>
	                                <count-up countSize="20px" id-name="totalOrderNum" :end-val="count.totalOrderNum"></count-up>
	                            </div>
	                        </Col>
	                    </Row>
	                    <Row :gutter="5"  style="margin-top: 10px">
	                        <Col span="6"><infor-card id-name="todayMem" :end-val="count.incrementMember" iconType="ios-person-outline" color="#2d8cf0" intro-text="今日新增会员"></infor-card></Col>
	                        <Col span="6"><infor-card id-name="totalMem" :end-val="count.totalMember" iconType="ios-person" color="#64d572" intro-text="会员总数量"></infor-card></Col>
	                        <Col span="6"><infor-card id-name="todayCleaner" :end-val="count.incrementCleaner" iconType="social-snapchat-outline" color="#ffd572" intro-text="今日新增保洁员"></infor-card></Col>
	                        <Col span="6"><infor-card id-name="totalCleaner" :end-val="count.totalCleaner" iconType="social-snapchat" color="#f25e43" intro-text="保洁员总数量"></infor-card></Col>
	                    </Row>
	                    </Col>
	                </Row>
	
	                <Row class="margin-top-10">
	                    <Card>
	                        <div class="line-chart-con">
	                            <div style="width: 100%; height: 100%" id="trendMap"></div>
	                        </div>
	                    </Card>
	                </Row>
	            </div>
	
	
	        </Card>
	    </div>
	</div>
</template>
<script>
    import countUp from '../home/components/countUp.vue';
    import inforCard from '../home/components/inforCard.vue';
    import echarts from 'echarts';
    import Cookies from 'js-cookie';
    export default {
        name: 'statistic',
        components: {
            countUp,
            inforCard,
        },
        data () {
            return {
                queryUrl: '/statistics/info',
                orderMonthUrl: '/order/report/month',
                orderYearUrl: '/order/report/year',
                count: {//这个对象不能变, 由始至终必须同一个对象, 才能watch(setter and getter)
                    todayOrderMoney:0,
                    monthOrderMoney:0,

                    todayOrderNum:0,
                    monthOrderNum:0,
                    totalOrderNum:0,

                    incrementMember: 0,
                    totalMember: 0,
                    incrementCleaner: 0,
                    totalCleaner: 0
                },
                moneys:[],
                nums:[],
                baseData: [{
                    expand: true,
                    title: '全部',
                    id:'11',
                    children: [{
                        name: '东莞',
                        citycode:'22',
                        expand: true,
                        children: [{
                            title: '南城',
                            id:'33'
                        }, {
                            name: '东城',
                            citycode:'33'
                        }]
                    }, {
                        name: '广州市',
                        citycode:'22',
                        expand: true,//是否展示子节点
                        children: [{
                            name: '增城',
                            citycode:'33'
                        },
                        {
                            name: '天河',
                            citycode:'33'
                        },
                        ]
                    }]
                
                },
                {
                    expand: true,
                    name: '浙江',
                    citycode:'11',
                    children: [{
                        name: '杭州',
                        citycode:'22',
                        expand: true,
                        children: [{
                            name: '余杭',
                            citycode:'22',
                        }, {
                            name: '大扫把',
                            citycode:'22',
                        }]
                    }]
                }],
                 
            }
        },
        created(){
            let self = this;
            for(let i = 0; i < 30; i++){
                self.moneys.push(0);
                self.nums.push(0);
            }
        },
        mounted(){
            let self = this;

            let i = 0;
            let now = new Date();

            self.isTimeout = false;

            //订单统计 条件 Start
            self.queryBody = {};
            let userId = Cookies.get('userId');
            let refType = Cookies.get('refType');
            let token = Cookies.get('token');
            let agentStatus = Cookies.get('agentStatus');

            self.queryBody.req = {};
            //数据分割
            let cityCodes = Cookies.get('cityCode');
            if(cityCodes !== undefined) {
                let cityList = self.$util.strConvertArray(cityCodes);
                if (cityList[0] !== 'null' && cityList[0] !== ''){
                    self.queryBody.req.cityCodes = cityList;
                }
            }
            //驗證登錄信息
            self.queryBody.loginSession = {};
            self.queryBody.loginSession.refId = userId;
            self.queryBody.loginSession.refType = refType;
            self.queryBody.loginSession.loginToken = token;
            self.queryBody.req.agentStatus = agentStatus;//订单统计 条件 END

            //清楚多余的空数据
            self.$util.deleteBlankProp(self.queryBody.req);

            self.$axios.post(self.queryUrl, self.queryBody).then(res => {
                self.count.incrementMember = res.incrementMember;
                self.count.totalMember = res.totalMember;
                self.count.incrementCleaner = res.incrementCleaner;
                self.count.totalCleaner = res.totalCleaner;

                self.count.todayOrderMoney = 0;
                self.count.monthOrderMoney = 0;

                self.count.todayOrderNum = 0;
                self.count.monthOrderNum = 0;
                self.count.totalOrderNum = 0;

                let entity = self.$util.getMonthStartToNow();

                self.queryBody.req.startTime = entity.startTime;
                self.queryBody.req.endTime = entity.endTime;

                self.$axios.post(self.orderMonthUrl, self.queryBody).then(ress => {
                    let todayYMD = now.format('yyyy-MM-dd');
                    for (i in ress){
                        if (ress[i].ymd === todayYMD){
                            self.count.todayOrderNum = ress[i].orderCount;//今日订单数量
                            self.count.todayOrderMoney = ress[i].sales;//今日订单数额
                            break;
                        }
                    }

                    let entity = self.$util.getYearStartToNow();

                    self.queryBody.req.startTime = entity.startTime;
                    self.queryBody.req.endTime = entity.endTime;

                    self.$axios.post(self.orderYearUrl, self.queryBody).then(resss => {
                        let monthYM = now.format('yyyy-MM');
                        let totalCount = 0;
                        for (i in resss){
                            if (resss[i].ymd === monthYM) {
                                self.count.monthOrderMoney = resss[i].sales;//月数额
                                self.count.monthOrderNum = resss[i].orderCount;//月数量
                            }
                            totalCount = totalCount + resss[i].orderCount;
                        }
                        self.count.totalOrderNum = totalCount;

                        let daysArr = self.$util.getRecentThirtyDays();
                        self.queryBody.req.startTime = new Date(daysArr[0]);
                        self.queryBody.req.endTime = new Date(daysArr[daysArr.length - 1]);
                        let j = 0;

                        self.$axios.post(self.orderMonthUrl, self.queryBody).then(ressss => {
                            for (i in ressss){
                                for (j in daysArr){
                                    if (ressss[i].ymd === daysArr[j]){
                                        self.moneys[j] = ressss[i].sales === null? 0: ressss[i].sales;
                                        self.nums[j] = ressss[i].orderCount;
                                        break;
                                    }
                                }
                            }
                            const option = {
                                title: {text: '近30天订单趋势'},
                                tooltip: {
                                    trigger: 'axis', axisPointer: {type: 'cross', label: {backgroundColor: '#6a7985'}}
                                },
                                toolbox: {
                                    show: true,
                                    feature: {dataZoom: {yAxisIndex: 'none'}, dataView: {readOnly: false}, restore: {}, saveAsImage: {}}
                                },
                                grid: {top: '10%', left: '2%', right: '3%', bottom: '0%', containLabel: true},
                                xAxis: [{type: 'category', boundaryGap: false,
                                    data: daysArr
                                }],
                                yAxis: [{type: 'value'}],
                                legend: {
                                    data:['日收入','日订单数']
                                },
                                series: [
                                    {name: '日收入', smooth:true, type: 'line' , areaStyle: {normal: {color: '#28b0f0'}},
                                        data: self.moneys
                                    },
                                    {name: '日订单数', smooth:true, type: 'line', areaStyle: {normal: {color: '#0c47bf'}},
                                        data: self.nums
                                    }
                                ]
                            };
                            const serviceRequestCharts = echarts.init(document.getElementById('trendMap'));

                            serviceRequestCharts.setOption(option);

                            window.addEventListener('resize', function () {
                                serviceRequestCharts.resize();
                            });
                        });
                    });
                });
            });

        },

        methods:{
        }
    }
</script>
