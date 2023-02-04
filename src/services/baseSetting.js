import request from '../utils/request';

const path = '/api/enms';
const { entries } = Object;

function formData(data) {
    const da = new FormData();
    entries(data).forEach(([key, val]) => {
        if (key !== 'model' && key !== 'callback' && key !== 'query' && key !== 'type' && key !== 'turnPage') {
            if (data.query) {
                da.append(key, val);
            } else {
                da.append(key, JSON.stringify(val));
            }
        }
    });
    if (data.query && data.turnPage) {
        if (!data.page) {
            da.append('page', 1);
        }
        if (!data.size) {
            da.append('size', 20);
        }
    }
    return da;
}

// 精确查找
export function exactSearch(payload) {
    // console.log('88888', flag);
    const body = new FormData();
    body.append('keyword', payload);
    return request(`${path}/comua/getComInfo`, {
        method: 'POST',
        body,
    });
}

/**
 *  goodsNameSet  货物名称设置
 * @param {Object} payload
 * @param {number} payload.page    否    页码
 * @param {number} payload.size    否    条数
 * @param {string} payload.model 后端实体类
 * @description model 查询：findCompHwmcs 新增、修改(销售): saveXsRoadHtxx 删除: deleteCompHwmc
 */
export function goodSet(payload) {
    const body = formData(payload);
    return request(`${path}/baseSetting/${payload.model}`, {
        method: 'POST',
        body,
    });
}

/**
 *  UnitSet 单位设置
 * @param {Object} payload
 * @param {number} payload.page    否    页码
 * @param {number} payload.size    否    条数
 * @param {string} payload.keyword    否    名称关键字|N
 * @param {string} payload.uid    否    业务负责人id|N
 * @param {string} payload.model 后端实体类
 * @description model 查询：searchPageHtxxs 新增、修改(销售): saveXsRoadHtxx 删除: deleteHtxx
 */
export function unitSet(payload) {
    const body = formData(payload);
    return request(`${path}/iaBase/selectPageComps`, {
        method: 'POST',
        body,
    });
}

/**
 * 单位设置 仓位编辑
 * @param {Object} payload
 * @param {number} payload.page    否    页码
 * @param {number} payload.size    否    条数
 * @param {string} payload.model 后端实体类
 * @description model 查询：searchListCwxxs  新增、修改(销售): saveCwxx  删除: deleteCwxx
 */
export function unitSetPosition(payload) {
    const body = formData(payload);
    return request(`${path}/logisticsYsxl/${payload.model}`, {
        method: 'POST',
        body,
    });
}

/**
 * 单位设置 仓位编辑
 * @param {Object} payload
 * @param {number} payload.page    否    页码
 * @param {number} payload.size    否    条数
 * @param {string} payload.model 后端实体类
 * @description model 查询：searchListCwxxs  新增、修改(销售): saveCwxx  删除: deleteCwxx
 */
export function unitSetSilo(payload) {
    const body = formData(payload);
    return request(`${path}/logisticsYsxl/${payload.model}`, {
        method: 'POST',
        body,
    });
}

/**
 *  省市区
 * @param {Object} payload
 * @param {number} payload.lvl    否
 */
export function area(payload) {
    const body = formData(payload);
    return request(`${path}/comua/getPCAInfos`, {
        method: 'POST',
        body,
    });
}

// 获取所有货物信息
export function allGoodsName(payload) {
    const body = formData(payload);
    return request(`${path}/comua/getAllGoods`, {
        method: 'POST',
        body,
    });
}

// 基础信息：车队管理主表
export function searchPageCd({ payload }) {
    const body = new FormData();
    entries(payload.payload).forEach(([key, val]) => {
        if (typeof val === 'string') {
            body.append(key, val);
        } else if (typeof val !== 'undefined') {
            body.append(key, JSON.stringify(val));
        }
    });
    return request(
        `${path}/logisticsCd/searchPageCd`,
        {
            method: 'POST',
            body: body,
        },
        undefined,
        false,
        true
    );
}

// 新增修改车队管理
export function saveCd({ payload }) {
    const body = new FormData();
    entries(payload).forEach(([key, val]) => {
        if (typeof val === 'string') {
            body.append(key, val);
        } else if (typeof val !== 'undefined') {
            body.append(key, JSON.stringify(val));
        }
    });
    return request(
        `${path}/logisticsCd/saveCd`,
        {
            method: 'POST',
            body: body,
        },
        undefined,
        false,
        true
    );
}

// 删除车队管理
export function deletecdgl({ id }) {
    let body = new FormData();
    body.append('id', id);
    return request(`${path}/logisticsCd/delCd`, {
        method: 'POST',
        body: body,
    });
}

// 获取所有化验指标名称
export function laboratoryIndicators(payload) {
    const body = formData(payload);
    return request(`${path}/comua/getAnalysisIdName`, {
        method: 'POST',
        body,
    });
}

// 查询单条规格型号的化验指标
export function singleModelTest(payload) {
    const body = formData(payload);
    return request(`${path}/baseSetting/searchCompHyxms`, {
        method: 'POST',
        body,
    });
}

// 向单个规格型号设置化验指标
export function addSingleModelTest(payload) {
    const body = formData(payload);
    return request(`${path}/baseSetting/saveHyxmsToGgxh`, {
        method: 'POST',
        body,
    });
}

/**
 * 查询本单位下所有用户名 [编号-名称]
 * @param {Object} payload
 * @param {string} payload.keyword  否
 */
export function allUsers(payload) {
    const body = formData(payload);
    return request(`${path}/baseCompInfo/getUidAndUnameByGid`, {
        method: 'POST',
        body,
    });
}

/**
 *  合同类型设置
 * @param {Object} payload
 * @param {number} payload.page    否    页码
 * @param {number} payload.size    否    条数
 * @param {string} payload.model 后端实体类
 * @description model 查询：searchPageBmgfs 新增、修改(销售): saveBmgf 删除: deleteBmgf
 */
export function contractType(payload) {
    const body = formData(payload);
    return request(`${path}/road/${payload.model}`, {
        method: 'POST',
        body,
    });
}

// 操作员设置
/**
 *  查询本单位下所有用户
 * @param {string} url    否    路径
 * @param {Object} payload
 * @param {number} payload.page    否    页码
 * @param {number} payload.size    否    条数
 * @param {string} payload.model 后端实体类
 * @description model 查询： 新增、修改(销售):  删除:  充值
 */
export function userSet(payload, url = path) {
    const body = formData(payload);
    return request(`${url}/userCenter/${payload.model}`, {
        method: 'POST',
        body,
    });
}

// 物流 操作员设置  查询单条操作员的操作线路
export function singleOperatingCircuit(payload) {
    const body = formData(payload);
    return request(`${path}/logisticsYsxl/searchListYsxlToYgxl`, {
        method: 'POST',
        body,
    });
}

// 物流 操作员设置  查询单条操作员的操作仓位
export function singpositionSet(payload) {
    const body = formData(payload);
    return request(`${path}/logisticsYsxl/searchListCwxx`, {
        method: 'POST',
        body,
    });
}

// 物流 操作员设置  单条操作员设置操作线路
export function setSingleOperatingCircuit(payload) {
    const body = formData(payload);
    return request(`${path}/logisticsYsxl/saveYgxl`, {
        method: 'POST',
        body,
    });
}

// 物流 操作员设置  单条操作员设置操作仓位
export function enOKpositionSet(payload) {
    const body = formData(payload);
    return request(`${path}/logisticsYsxl/saveYgCwxx`, {
        method: 'POST',
        body,
    });
}

// 账户资金设置
/**
 *  基础信息 账户资金设置
 * @param {Object} payload
 * @param {number} payload.page    否    页码
 * @param {number} payload.size    否    条数
 * @param {string} payload.model 后端实体类
 * @description model getBankAndAccs 新增、修改(销售): insertBankAndAcc  删除: delBankAndAcc
 */
export function accountFundsSet(payload) {
    const body = formData(payload);
    return request(`${path}/finance/${payload.model}`, {
        method: 'POST',
        body,
    });
}

// 所有银行名称
export function bank(payload) {
    const body = formData(payload);
    return request(`${path}/baseCompInfo/searchListBanks`, {
        method: 'POST',
        body,
    });
}

// 客户等级
export function customerStar(payload) {
    return request(`${path}/finance/getXingJi`, {
        method: 'POST',
    });
}

// 其他收支项目
/**
 *  基础信息 其他收支项目
 * @param {Object} payload
 * @param {number} payload.page    否    页码
 * @param {number} payload.size    否    条数
 * @param {string} payload.model 后端实体类
 * @description model getOtherProjs 新增、修改(销售): insertOtherProj  删除: delOtherProj
 */
export function otherInOut(payload) {
    const body = formData(payload);
    return request(`${path}/finance/${payload.model}`, {
        method: 'POST' || 'GET',
        body,
    });
}

// 查询直销提单列表，为操作员设置权限用
export function getLadingData(payload) {
    const body = formData(payload);
    return request(`${path}/roadzxtd/searchUserZxth`, {
        method: 'POST',
        body,
    });
}

// 为操作员设置直销提单列
export function setLadingData(payload) {
    const body = formData(payload);
    return request(`${path}/roadzxtd/resetUserZxth`, {
        method: 'POST',
        body,
    });
}

// 大宗   基础信息  车辆排队设置
export function carlineSet(payload) {
    const body = formData(payload);
    return request(`${path}/largeamount/${payload.model}`, {
        method: 'POST',
        body,
    });
}

// 过磅控制
export function getWeighControl(payload) {
    const body = formData(payload);
    return request(`${path}/largeamountBase/searchPageAccInfo`, {
        method: 'POST',
        body,
    });
}

// 新增过磅控制
export function addWeighControl(payload) {
    const body = formData(payload);
    return request(`${path}/largeamountBase/addAccInfo`, {
        method: 'POST',
        body,
    });
}

// 删除过磅控制
export function delWeighControl(payload) {
    const body = formData(payload);
    return request(`${path}/largeamountBase/deleteAccInfo`, {
        method: 'POST',
        body,
    });
}

// 同步单位信息
export function syncJtDwxxs(payload) {
    const body = formData(payload);
    return request(`${path}/baseSetting/syncJtDwxxs`, {
        method: 'POST',
        body,
    });
}
