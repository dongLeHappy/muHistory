let validateRules = {

};

validateRules.idV = (rule, value, callback) => {
    if (!isCardNo(value)) {
        return callback(new Error('请输入合法身份证号码!'));
    } else {
        callback();
    }
};

validateRules.phoneV = (rule, value, callback) => {
    let myreg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
    let res = myreg.test(value);
    if (res) {
        callback();
    } else {
        return callback(new Error('请输入正确的手机号码!'));
    }
};

validateRules.urlV = (rule, value, callback) => {
    let reg = /^[http]{4}|[https]{5}$/;
    let res = reg.test(value);
    if (res) {
        callback();
    } else {
        return callback(new Error('请输入正确网址, http开头!'));
    }
};

validateRules.versionCodeV = (rule, value, callback) => {
    let reg = /^\d+[.]\d+[.]\d+$/;
    let res = reg.test(value);
    if (res) {
        callback();
    } else {
        return callback(new Error('请输入正确格式, 比如1.1.0'));
    }
};

function isCardNo (card) {
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) {
        return false;
    } else {
        return true;
    }
}

export default validateRules;