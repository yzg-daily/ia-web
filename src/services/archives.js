import request from '@/utils/request';
import { stringify } from 'qs';
import { formData } from '@/utils/utils';

// 个人档案
export async function personArchives(payload) {
    const body = formData(payload);
    return request(`${publicPath2}/persInfo/getProfiles`, {
        method: 'POST',
        body,
    });
}
// 签名管理
export async function personAutograph(payload) {
    const body = formData(payload);
    return request(`${publicPath2}/persInfo/updateAutograph`, {
        method: 'POST',
        body,
    });
}
// 修改密码
export async function updatePassWord(payload) {
    const body = formData(payload);
    return request(`${publicPath2}/user/modifyPassword`, {
        method: 'POST',
        body,
    });
}
