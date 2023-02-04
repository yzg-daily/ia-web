import request from '@/utils/request';
import { formData } from '@/utils/utils';
const { entries } = Object;
const { publicPath, publicPath2, publicEnms } = window;

// 收货单位
export function receivingUnit(payload) {
    const body = formData(payload);
    return request(`${publicPath}/receive/${payload.model}`, {
        method: 'POST',
        body,
    });
}

// 获取地区数据
export function region() {
    return request(`${publicEnms}/comua/getPCAInfos`);
}

// 风险监测
export function warnCenter(payload) {
    const body = formData(payload);
    return request(`${publicPath}/warnCenter/${payload.model}`, {
        method: 'POST',
        body,
    });
}

// 产品目录 大宗
export function productCatalogue(payload) {
    const body = formData(payload);
    return request(`${publicPath}/goods/${payload.model}`, {
        method: 'POST',
        body,
    });
}

// 用途
export function purpose(payload) {
    const body = formData(payload);
    return request(`${publicPath}/sysDictInfo/getDictByKey`, {
        method: 'POST',
        body,
    });
}

// 物资管理
export function materials(payload) {
    const body = formData(payload);
    return request(`${publicPath}/material/${payload.model}`, {
        method: 'POST',
        body,
    });
}

// 下载模板
export function exportTemplate() {
    return request(`${publicPath}/material/downLoad`, {}, 'blob');
}

// 批量导入模板
export function uploadExcel(payload) {
    const body = formData(payload);
    return request(`${publicPath}/material/uploadExcel`, {
        method: 'POST',
        body,
    });
}

// 获取字典数据
export function getDictInfo(payload) {
    const body = formData(payload);
    return request(`${publicPath}/sysDictInfo/getDictByKey`, {
        method: 'POST',
        body,
    });
}

// 获取化验标准
export function getStandard(payload) {
    const body = formData(payload);
    return request(`${publicPath}/goods/getYsbzList`, {
        method: 'POST',
        body,
    });
}

// 添加化验标准
export function saveStandard(payload) {
    const body = formData(payload);
    return request(`${publicPath}/goods/addBusiYsbz`, {
        method: 'POST',
        body,
    });
}
