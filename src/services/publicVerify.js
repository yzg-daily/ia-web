import { formData } from '@/utils/utils';
import request from '../utils/request';

const { publicEnms, publicEnms2, publicEnms3 } = window;

/**
 * 模糊查询
 */
export function fuzzySearch(payload, userNames, ghcode, dwcode, dept, deptType, sendPerson) {
    let api = 'baseCompInfo/getDwxydmAndDwjcByGid';
    const body = new FormData();
    if (userNames) {
        body.append('name', payload);
        api = 'sysUserInfo/findAllUser';
        return request(`${publicEnms}/${api}`, {
            method: 'POST',
            body,
        });
    } else if (ghcode) {
        body.append('code', payload);
        api = `${publicEnms3}/getPersInfo`;
        return request(`${api}`, {
            method: 'POST',
            body,
        });
    } else if (dwcode) {
        body.append('keyword', payload);
        api = `${publicEnms3}/getSubsByGid`;
        return request(`${api}`, {
            method: 'POST',
            body,
        });
    } else if (dept && deptType) {
        body.append('searchName', payload);
        body.append('type', deptType);
        api = `${publicEnms2}/common/getCompanyByName`;
        return request(`${api}`, {
            method: 'POST',
            body,
        });
    } else if (sendPerson) {
        body.append('name', payload);
        api = `${publicEnms}/bussinesstask/getSendUser`;
        return request(`${api}`, {
            method: 'POST',
            body,
        });
    } else {
        body.append('keyword', payload);
        return request(`${publicEnms}/${api}`, {
            method: 'POST',
            body,
        });
    }
}

/**
 * 查询公共数据
 */
export function searchPublicData({ payload }) {
    const body = formData(payload);
    return request(`${publicEnms}/baseCompInfo/${payload.model}`, {
        method: 'POST',
        body,
    });
}
