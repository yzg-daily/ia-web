import request from '@/utils/request';
const { entries } = Object;
// const user = JSON.parse(sessionStorage.getItem('user'));
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
// 系统管理-权限角色list
export function permRoleList(payload) {
    const body = formData(payload);
    return request(`${enms}/sys/permRoleList`, {
        method: 'POST',
        body,
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
// 菜单权限树查询权限角色——操作权限
export function rolesTree() {
    return request(`${enms}/sys/rolesTree`, {
        method: 'POST',
    });
}
// 菜单权限树查询权限角色——数字权限
export function deptsTree() {
    return request(`${enms}/sys/deptsTree`, {
        method: 'POST',
    });
}
// 获取职位列表信息
export function getPositionMsg() {
    return request(`${enms}/sysPosition/getPositionMsg`, {
        method: 'POST',
    });
}
//获取职务列表信息
export function getPostMsg() {
    return request(`${enms}/sysPost/getPostMsg`, {
        method: 'POST',
    });
}
//默认角色查询
export function defaultRole({ postid, positionid }) {
    const data = new FormData();
    data.append('postid', postid);
    data.append('positionid', positionid);
    return request(`${enms}/sys/defaultRole`, {
        method: 'POST',
        body: data,
    });
}
//根据职务、职位获取本部门或本部门部门以下的数据
export function findDeptIds({ pos, position, mold }) {
    const data = new FormData();
    data.append('pos', pos);
    data.append('position', position);
    data.append('mold', mold);
    return request(`${enms}/sysDept/findDeptIds`, {
        method: 'POST',
        body: data,
    });
}
// 系统管理-权限用户list
export function permUserList(payload) {
    const body = formData(payload);
    return request(`${enms}/sys/permUserList`, {
        method: 'POST',
        body,
    });
}
// 权限用户新增/修改
export function userSave(payload) {
    const body = formData(payload);
    return request(`${enms}/sys/userSave`, {
        method: 'POST',
        body,
    });
}
// 权限用户删除
export function deleteUser({ ywid }) {
    const data = new FormData();
    data.append('ywid', ywid);
    return request(`${enms}/sys/deleteUser`, {
        method: 'POST',
        body: data,
    });
}
// 权限juese删除
export function deleteRole({ roleid }) {
    const data = new FormData();
    data.append('roleid', roleid);
    return request(`${enms}/sys/deleteRole`, {
        method: 'POST',
        body: data,
    });
}
// 初始化密码
export function initPassword({ ywid }) {
    const data = new FormData();
    data.append('ywid', ywid);
    return request(`${enms}/sys/initPassword`, {
        method: 'POST',
        body: data,
    });
}
// 权限角色详情查询
export function roleDetail({ roleid }) {
    const data = new FormData();
    data.append('roleid', roleid);
    return request(`${enms}/sys/roleDetail`, {
        method: 'POST',
        body: data,
    });
}
//权限角色新增/修改
export function roleSave(payload) {
    const body = formData(payload);
    return request(`${enms}/sys/roleSave`, {
        method: 'POST',
        body,
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
