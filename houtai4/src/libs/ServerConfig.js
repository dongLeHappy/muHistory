let sc = {};

let profile = 'test';

sc.dev = {};
sc.test = {};
sc.pro = {};

// 请求的接口API 路径

// 生产
sc.pro.baseUrl = 'http://backend.kuaijieqingjie.com/';

// 公司测试服务器
//sc.test.baseUrl = 'http://192.168.1.112/backend/';
sc.test.baseUrl = 'http://129.204.122.166/backend/';

// 本地
//sc.dev.baseUrl = 'http://localhost:8082/';

sc.dev.uploadUrl = sc.dev.baseUrl + 'upload';
sc.dev.cityUrl = sc.dev.baseUrl + 'region/public/select';
sc.dev.codeImgUrl = sc.dev.baseUrl + 'captcha';

sc.test.uploadUrl = sc.test.baseUrl + 'upload';
sc.test.cityUrl = sc.test.baseUrl + 'region/public/select';
sc.test.codeImgUrl = sc.test.baseUrl + 'captcha';

sc.pro.uploadUrl = sc.pro.baseUrl + 'upload';
sc.pro.cityUrl = sc.pro.baseUrl + 'region/public/select';
sc.pro.codeImgUrl = sc.pro.baseUrl + 'captcha';

sc.baseUrl = sc[profile].baseUrl;
sc.uploadUrl = sc[profile].uploadUrl;
sc.cityUrl = sc[profile].cityUrl;
sc.codeImgUrl = sc[profile].codeImgUrl;

export default sc;
