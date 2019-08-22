import axios from 'axios';
import semver from 'semver';
import packjson from '../../package.json';
import Cookies from 'js-cookie';
import au from './accessUtils.js';
import CryptoJS from 'crypto-js';
import serverConfig from './ServerConfig';

let util = {

};
util.title = function (title) {
    title = title || '快洁帮后台管理';
    window.document.title = title;
};

//上传路径
util.uploadUrl = serverConfig.uploadUrl;
util.cityUrl = serverConfig.cityUrl;
util.codeImgUrl = serverConfig.codeImgUrl;

//地区查询条件, 赋值到queryBody, 通用
util.cityCodeBeforeQuery = function (vm) {
    if (vm.$util.isEmpty(vm.cityCode.town)){
        vm.queryBody.cityCode = vm.cityCode.city;
    }else if (!vm.$util.isEmpty(vm.cityCode.town)){
        vm.queryBody.cityCode = vm.cityCode.town;
    }

    if (!vm.$util.isEmpty(vm.cityCode.province) && (vm.$util.isEmpty(vm.queryBody.cityCode))){
        vm.$Message.error({content: '请选择城市或者区!'});
        throw Promise.reject(vm.viewModel.cityCode);
    }
};

util.strConvertArray = function(cityCodes){
    cityCodes=cityCodes.replace("[","");
    cityCodes=cityCodes.replace("]","");
    var cityList = cityCodes.split(","); //字符分割
    for (let i = 0; i < cityList.length; i++) {
        cityList[i] = cityList[i].replace("\"","");
        cityList[i] = cityList[i].replace("\"","");
    }
    return cityList;
};

util.cityCodeBeforeEdit = function (vm) {
    if (vm.$util.isEmpty(vm.editCityCode.town)){
        vm.viewModel.cityCode = vm.editCityCode.city;
    }else if (!vm.$util.isEmpty(vm.editCityCode.town)){
        vm.viewModel.cityCode = vm.editCityCode.town;
    }
    if (vm.$util.isEmpty(vm.viewModel.cityCode)){
        vm.$Message.error({content: '请选择地区!'});
        throw Promise.reject(vm.viewModel.cityCode);
    }
};

//初始化所有地区
util.getAllArea = function (vm) {
    //省
    vm.$axios.post(util.cityUrl, {levelType: 1}).then(res => {
        res.unshift({id: 0, name: '全国'});
        localStorage.setItem("AllProvinceList", JSON.stringify(res))
    });
    //市
    vm.$axios.post(util.cityUrl, {levelType: 2}).then(res => {
        res.unshift({id: 0, name: '全国', parentId: 0});
        localStorage.setItem("AllCityList", JSON.stringify(res))
    });
    //区
    vm.$axios.post(util.cityUrl, {levelType: 3}).then(res => {
        localStorage.setItem("AllTownList", JSON.stringify(res))
    });
};

//实体类内的cityCode转省份-城市-区
util.getProCityTown = function (obj, value) {
    //全国的
    if (value == 0){
       obj.provinceName = "全国";
       obj.province = 0;
       obj.cityName = '';
       obj.city = 0;
       obj.townName = '';
    }else {
        let provinceList = JSON.parse(localStorage.getItem("AllProvinceList"));
        //cityList
        let cityList = JSON.parse(localStorage.getItem("AllCityList"));
        for (let i = 0; i < cityList.length; i++){
            if (cityList[i].id == value){
                obj.city = cityList[i].id;
                obj.cityName = cityList[i].name;
                obj.townName = '';
                //赋值省份
                obj.province = cityList[i].parentId;
                for (let j = 0; j < provinceList.length; j++){
                    if (obj.province == provinceList[j].id){
                        obj.provinceName = provinceList[j].name;
                        break;
                    }
                }
                break
            }
        }
        //townList
        let townList = JSON.parse(localStorage.getItem("AllTownList"));
        for (let i = 0; i < townList.length; i++){
            if (townList[i].id == value){
                obj.town = townList[i].id;
                obj.townName = townList[i].name;
                //赋值城市
                obj.city = townList[i].parentId;
                for (let i = 0; i < cityList.length; i++){
                    if (cityList[i].id == obj.city){
                        obj.cityName = cityList[i].name;
                        //赋值省份
                        break;
                    }
                }
                //赋值省份
                for (let i = 0; i < cityList.length; i++){
                    if (cityList[i].id == obj.city){
                        obj.province = cityList[i].parentId;
                        for (let j = 0; j < provinceList.length; j++){
                            if (obj.province == provinceList[j].id){
                                obj.provinceName = provinceList[j].name;
                                break;
                            }
                        }
                        break
                    }
                }
            }
        }
    }

    obj.allName = obj.provinceName + obj.cityName + obj.townName ;
};

//查询下一级地区, 通过传入值, 以及地区级别
util.cityCodeSelect = function (vm, val, levelType, prop) {
    vm[prop].length = 0;
    if (levelType === 1){
        //省
        vm[prop] = JSON.parse(localStorage.getItem("AllProvinceList"));
    }else if (levelType === 2){
        //市
        let AllCityList = JSON.parse(localStorage.getItem("AllCityList"));
        AllCityList.forEach(e => {
            if (e.parentId === val){
                vm[prop].push(e)
            }
        });
    }else if (levelType === 3){
        //区
        let AllTownList = JSON.parse(localStorage.getItem("AllTownList"));
        AllTownList.forEach(e => {
            if (e.parentId === val){
                vm[prop].push(e)
            }
        });
    }
};

//排序
util.sortArr = function (arr, property) {
    let length = arr.length;
    if (length === 0) return;
    for (let i = 0; i < length; i++){
        for (let j = 0; j < length - i - 1; j++){
            if (arr[j][property] < arr[j + 1][property]){
                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
};

util.isEmpty = function (str) {
    return str === null || str === undefined || (typeof str === 'string' && str.trim() === '') || (Array.isArray(str) && str.length === 0)
};

util.objToStr = function (obj) {
    let x = null;
    let str = '';
  for (x in obj){
      str = str + '&' + x + '=' + obj[x];
  }
  return '?'+str.substring(1);
};

util.numToBoolean = function (num) {
    return num !== 0;
};

util.booleanToNum = function (b) {
    if (b) return 1;
    return 0;
};

util.getUserName = function () {
    return Cookies.get('user');
};
util.getUserId = function () {
    return Cookies.get('userId');
};

util.inOf = function (arr, targetArr) {
    let res = true;
    arr.forEach(item => {
        if (targetArr.indexOf(item) < 0) {
            res = false;
        }
    });
    return res;
};

util.getRecentThirtyDays = function () {
    let now = new Date();
    let arr = [];
    arr.push(now.format('yyyy-MM-dd'));
    for(let i = 1; i < 30; i++){
        now = new Date(now.getTime() - 24 * 3600 * 1000);
        arr.unshift(now.format('yyyy-MM-dd'));
    }
    return arr;
};

util.getMonthStartToNow = function () {
    let now = new Date();
    let copyNow = new Date();
    now.setUTCDate(1);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return {"endTime": copyNow, "startTime": now};
};

util.getYearStartToNow = function () {
    let now = new Date();
    let copyNow = new Date();
    now.setUTCMonth(0);
    now.setUTCDate(1);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return {"endTime": copyNow, "startTime": now};
};

const key = CryptoJS.enc.Utf8.parse("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
const iv = CryptoJS.enc.Utf8.parse("1234567812345678");
util.jiami = function (str) {
    let encrypted =CryptoJS.AES.encrypt(str,key, {iv:iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7});
    return encrypted.toString();
};
util.jiemi = function (encrypted) {
    let decrypted =CryptoJS.AES.decrypt(encrypted,key, {iv:iv, mode:CryptoJS.mode.CBC, padding:CryptoJS.pad.Pkcs7});
    return decrypted.toString(CryptoJS.enc.Utf8);
};

const EARTH_RADIUS = 6378137.0;    //单位M
const PI = Math.PI;
function getRad(d){
    return d*PI/180.0;
}
util.figureDistance = function (lat1,lng1,lat2,lng2) {
    lat1 = parseFloat(lat1);
    lng1 = parseFloat(lng1);
    lat2 = parseFloat(lat2);
    lng2 = parseFloat(lng2);

    let f = getRad((lat1 + lat2)/2);
    let g = getRad((lat1 - lat2)/2);
    let l = getRad((lng1 - lng2)/2);

    let sg = Math.sin(g);
    let sl = Math.sin(l);
    let sf = Math.sin(f);

    let s,c,w,r,d,h1,h2;
    let a = EARTH_RADIUS;
    let fl = 1/298.257;

    sg = sg*sg;
    sl = sl*sl;
    sf = sf*sf;

    s = sg*(1-sl) + (1-sf)*sl;
    c = (1-sg)*(1-sl) + sf*sl;

    w = Math.atan(Math.sqrt(s/c));
    r = Math.sqrt(s*c)/w;
    d = 2*w*a;
    h1 = (3*r -1)/2/c;
    h2 = (3*r +1)/2/s;

    return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
};

util.getAccess = function (val) {
    let accessCode = Cookies.get('access');
    if (util.isEmpty(accessCode)) return false;
    accessCode = util.jiemi(accessCode);
    if (accessCode !== null && accessCode !== undefined) {
        accessCode = accessCode.split(",");
        for(let k = 0; k < accessCode.length; k++){
            accessCode[k] = parseInt(accessCode[k]);
        }
    }
  return accessCode[au[val] - 1] === 1;
};

//城市编号匹配
util.matchCity = function (code, cityList) {
    let x = 0;
    for(x in cityList){
        if(code === cityList[x].cityCode){
            return cityList[x].provinceName+cityList[x].cityName
        }
    }
    return '';
};

//字符串转file
util.strToFiles = function (str) {
    let arr = [];
    if (str !== '' && str !== null && str !== undefined){
        if (str.charAt(str.length-1) === ','){
            str = str.substr(0, str.length-1)
        }
        let ss = str.split(',');
        let i = 0;
        for(i in ss){
            arr.push({status:'finished', url:ss[i]});
        }
    }
    return arr;
};

//文件上传转为字符串, ','隔开
util.filesToStr = function (files) {
    let arr = [];
    let i = 0;
    if (files.length !== 0){
        for(i in files){
            arr.push(files[i].url);
        }
    }
    return arr.toString();
};

//去掉对象里空值属性
util.deleteBlankProp = function (obj) {
    let x ='';
  for (x in obj){
      if (obj[x] === '' || obj[x] === undefined || obj[x] === null){
          delete obj[x];
      }
  }
};

//图片字符串转数组
util.strToPicArr = function (str) {
    let arr = [];
    if (str !== undefined && str !== '' && str !== null){
        if (str.indexOf(',') === -1){
            arr.push(str);
        }else {
            if (str.charAt(str.length-1) === ','){
                str = str.substr(0, str.length-1)
            }
            arr = str.split(',');
        }
    }
    return arr;
};

util.oneOf = function (ele, targetArr) {
    if (targetArr.indexOf(ele) >= 0) {
        return true;
    } else {
        return false;
    }
};

util.showThisRoute = function (itAccess, currentAccess) {
    //currentAccess:[1,1,1,0,1] itAccess:路由access可能[1,2,3] 也可能5
    let r = false;
    if (Array.isArray(itAccess)){
        let x = 0;
        if (currentAccess !== undefined && currentAccess !== null){
            for(x in itAccess){
                if (currentAccess[itAccess[x]-1] === 1){
                    r = true;
                }
            }
        }
    }else {
        r =currentAccess[itAccess-1] === 1;
    }
    return r;
};

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.handleTitle = function (vm, item) {
    if (typeof item.title === 'object') {
        return vm.$t(item.title.i18n);
    } else {
        return item.title;
    }
};

util.setCurrentPath = function (vm, name) {
    let title = '';
    let isOtherRouter = false;
    vm.$store.state.app.routers.forEach(item => {
        if (item.children.length === 1) {
            if (item.children[0].name === name) {
                title = util.handleTitle(vm, item);
                if (item.name === 'otherRouter') {
                    isOtherRouter = true;
                }
            }
        } else {
            item.children.forEach(child => {
                if (child.name === name) {
                    title = util.handleTitle(vm, child);
                    if (item.name === 'otherRouter') {
                        isOtherRouter = true;
                    }
                }
            });
        }
    });
    let currentPathArr = [];
    if (name === 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '',
                name: 'home_index'
            }
        ];
    } else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home_index') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'home_index')),
                path: '/home',
                name: 'home_index'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else if ((name.indexOf('statistic') >= 0 || isOtherRouter) && name !== 'statistic') {
        currentPathArr = [
            {
                title: util.handleTitle(vm, util.getRouterObjByName(vm.$store.state.app.routers, 'statistic')),
                path: '/statistic',
                name: 'statistic'
            },
            {
                title: title,
                path: '',
                name: name
            }
        ];
    } else {
        let currentPathObj = vm.$store.state.app.routers.filter(item => {
            if (item.children.length <= 1) {
                return item.children[0].name === name;
            } else {
                let i = 0;
                let childArr = item.children;
                let len = childArr.length;
                while (i < len) {
                    if (childArr[i].name === name) {
                        return true;
                    }
                    i++;
                }
                return false;
            }
        })[0];
        if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '',
                    name: 'home_index'
                }
            ];
        } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: name
                }
            ];
        } else {
            let childObj = currentPathObj.children.filter((child) => {
                return child.name === name;
            })[0];
            currentPathArr = [
                {
                    title: '首页',
                    path: '/home',
                    name: 'home_index'
                },
                {
                    title: currentPathObj.title,
                    path: '',
                    name: currentPathObj.name
                },
                {
                    title: childObj.title,
                    path: currentPathObj.path + '/' + childObj.path,
                    name: name
                }
            ];
        }
    }
    vm.$store.commit('setCurrentPath', currentPathArr);

    return currentPathArr;
};

util.openNewPage = function (vm, name, argu, query) {
    let pageOpenedList = vm.$store.state.app.pageOpenedList;
    let openedPageLen = pageOpenedList.length;
    let i = 0;
    let tagHasOpened = false;
    while (i < openedPageLen) {
        if (name === pageOpenedList[i].name) { // 页面已经打开
            vm.$store.commit('pageOpenedList', {
                index: i,
                argu: argu,
                query: query
            });
            tagHasOpened = true;
            break;
        }
        i++;
    }
    if (!tagHasOpened) {
        let tag = vm.$store.state.app.tagsList.filter((item) => {
            if (item.children) {
                return name === item.children[0].name;
            } else {
                return name === item.name;
            }
        });
        tag = tag[0];
        if (tag) {
            tag = tag.children ? tag.children[0] : tag;
            if (argu) {
                tag.argu = argu;
            }
            if (query) {
                tag.query = query;
            }
            vm.$store.commit('increateTag', tag);
        }
    }
    vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
    let len = routers.length;

    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
            route.replace({
                name: routers[i].children[0].name
            });
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

util.width = "162px";

util.fullscreenEvent = function (vm) {
    vm.$store.commit('initCachepage');
    // 权限菜单过滤相关
    vm.$store.commit('updateMenulist');
    // 全屏相关
};

util.checkUpdate = function (vm) {
    axios.get('https://api.github.com/repos/iview/iview-admin/releases/latest').then(res => {
        let version = res.data.tag_name;
        vm.$Notice.config({
            duration: 0
        });
        if (semver.lt(packjson.version, version)) {
            vm.$Notice.info({
                title: 'iview-admin更新啦',
                desc: '<p>iView-admin更新到了' + version + '了，去看看有哪些变化吧</p><a style="font-size:13px;" href="https://github.com/iview/iview-admin/releases" target="_blank">前往github查看</a>'
            });
        }
    });
};

export default util;
