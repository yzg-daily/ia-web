import request from '@/utils/request';
const { entries } = Object;
const user = JSON.parse(sessionStorage.getItem('user'));
const enms = '/api/basel';
function formData(data) {
    const da = new FormData();
    entries(data.payload).forEach(([key, val]) => {
        if (key !== 'model' && key !== 'callback' && key !== 'turnPage' && val !== undefined) {
            da.append(key, val);
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
// 查询已有系统及状态
export function getSysAndSts({ dbOrYb }) {
    const data = new FormData();
    data.append('gid', user.gid);
    data.append('dbOrYb', dbOrYb);
    return request(`${enms}/mission/getSysAndSts`, {
        method: 'POST',
        body: data,
    });
}
// 获得待审核/已审核列表
export function approvalList(payload) {
    const body = formData(payload);
    return request(`${enms}/mission/approvalList`, {
        method: 'POST',
        body,
    });
}
// 新增/修改公告
export function addOrModNotice(payload) {
    const body = formData(payload);
    return request(`${enms}/mission/addOrModNotice`, {
        method: 'POST',
        body,
    });
}
// 查询公告
export function getNotice(payload) {
    const body = formData(payload);
    return request(`${enms}/mission/getNotice`, {
        method: 'POST',
        body,
    });
}
// 预警中心的分页数据
export function warnCenter(payload) {
    const body = formData(payload);
    return request(`${enms}/warnCenter/pageList`, {
        method: 'POST',
        body,
    });
}
// 处理公告(0下架1发布2删除)
export function delNotice({ id, handle }) {
    const data = new FormData();
    data.append('id', id);
    data.append('handle', handle);
    return request(`${enms}/mission/handleNotice`, {
        method: 'POST',
        body: data,
    });
}
// （企业）根据key查找字典信息
export function getDictByKeyQy({ key }) {
    const data = new FormData();
    data.append('key', key);
    return request(`${enms}/sysDictInfo/getDictByKeyQy`, {
        method: 'POST',
        body: data,
    });
}
// （综合管理平台）根据文件uuid获取文件路径 可多条 post
export function getFileByUuids({ uuids }) {
    const data = new FormData();
    data.append('uuids', uuids);
    return request(`${enms}/commonFile/getFileByUuids`, {
        method: 'POST',
        body: data,
    });
}
// （综合管理平台 公告置顶
export function topOrNo({ id, mold }) {
    const data = new FormData();
    data.append('id', id);
    data.append('mold', mold);
    return request(`${enms}/mission/topOrNo`, {
        method: 'POST',
        body: data,
    });
}
