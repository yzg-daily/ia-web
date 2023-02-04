import request from '@/utils/request';
import { formData } from '@/utils/utils';
const { entries } = Object;
const { publicPath, publicPath2 } = window;

// 人员管理
export function personManagement(payload) {
    const body = formData(payload);
    return request(`${publicPath2}/persInfo/${payload.model}`, {
        method: 'POST',
        body,
    });
}
// 下载模板接口
export function infoDownload(payload) {
    return request(`${publicPath2}/persInfo/downLoad`, {}, 'blob');
}

// 人员属性  学历
export function personInfo(payload) {
    const body = formData(payload);
    return request(`${publicPath}/sysDictInfo/getDictByKeyQy`, {
        method: 'POST',
        body,
    });
}
// 人员管理  部门搜索
export function persondept(payload) {
    const body = formData(payload);
    return request(`${publicPath2}/department/${payload.model}`, {
        method: 'POST',
        body,
    });
}
