import request from '@/utils/request';
const { entries } = Object;
const user = JSON.parse(sessionStorage.getItem('user'));
//
const { publicPath3 } = window;
const enms = '';
function formData(data) {
    const da = new FormData();
    entries(data.payload).forEach(([key, val]) => {
        if (key !== 'model' && key !== 'callback' && key !== 'turnPage' && val !== undefined && val !== null) {
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
// 下拉栏目列表
export function findLMColumn({ type }) {
    const data = new FormData();
    data.append('type', type);
    return request(`${publicPath3}/findColumn`, {
        method: 'POST',
        body: data,
    });
}
//党建：支部管理新增
export function addBranch({ orgname, id }) {
    const data = new FormData();
    data.append('orgname', orgname);
    if (id) {
        data.append('id', id);
    }
    return request(`${publicPath3}/addBranch`, {
        method: 'POST',
        body: data,
    });
}
//党建：支部管理删除
export function delBranch({ id }) {
    const data = new FormData();
    data.append('id', id);
    return request(`${publicPath3}/delBranch`, {
        method: 'POST',
        body: data,
    });
}
//党建：支部管理查询
export function findBranch(payload) {
    const body = formData(payload);
    return request(`${publicPath3}/findBranch`, {
        method: 'POST',
        body,
    });
}
//党员管理：党员管理新增
export function addMember(payload) {
    const body = formData(payload);
    return request(`${publicPath3}/addMember`, {
        method: 'POST',
        body,
    });
}
//党员管理：党员管理删除
export function delMember({ id }) {
    const data = new FormData();
    data.append('id', id);
    return request(`${publicPath3}/delMember`, {
        method: 'POST',
        body: data,
    });
}
//党员管理：党员管理查询
export function findMember(payload) {
    const body = formData(payload);
    return request(`${publicPath3}/findMember`, {
        method: 'POST',
        body,
    });
}
//党员管理：查询工号
export function getPersInfo({ code, dwdm }) {
    const data = new FormData();
    data.append('code', code);
    data.append('dwdm', dwdm);
    return request(`${publicPath3}/getPersInfo`, {
        method: 'POST',
        body: data,
    });
}
//党员管理：查询新增界面党组织，党内职务，党员状态
export function addMemberDropBox() {
    return request(`${publicPath3}/addMemberDropBox`, {
        method: 'POST',
    });
}
//党员管理：查询条件界面党组织，党内职务，党员状态，岗位
export function dropBox() {
    return request(`${publicPath3}/dropBox`, {
        method: 'POST',
    });
}
//三会一课和门户：=新增 门户1三会一课2
export function addNews(payload) {
    const body = formData(payload);
    return request(`${publicPath3}/addNews`, {
        method: 'POST',
        body,
    });
}
//三会一课和门户：=删除
export function delNews({ id }) {
    const data = new FormData();
    data.append('id', id);
    return request(`${publicPath3}/delNews`, {
        method: 'POST',
        body: data,
    });
}
//三会一课和门户：=查询
export function findNews(payload) {
    const body = formData(payload);
    return request(`${publicPath3}/findNews`, {
        method: 'POST',
        body,
    });
}
//轮播图：=新增
export function addRotationChart(payload) {
    const body = formData(payload);
    return request(`${publicPath3}/addRotationChart`, {
        method: 'POST',
        body,
    });
}
//轮播图：=删除
export function delRotationChart({ id }) {
    const data = new FormData();
    data.append('id', id);
    return request(`${publicPath3}/delRotationChart`, {
        method: 'POST',
        body: data,
    });
}
//轮播图：=查询
export function findRotationChart(payload) {
    const body = formData(payload);
    return request(`${publicPath3}/findRotationChart`, {
        method: 'POST',
        body,
    });
}
//轮播图：=移动
export function chartMove({ id, next_id }) {
    const data = new FormData();
    data.append('id', id);
    data.append('next_id', next_id);
    return request(`${publicPath3}/chartMove`, {
        method: 'POST',
        body: data,
    });
}
//首页
//三会一课：=查询
export function findShyk() {
    return request(`${publicPath3}/findShyk`, {
        method: 'POST',
    });
}
//党建大数据所有数据
export function bigData() {
    return request(`${publicPath3}/bigData`, {
        method: 'POST',
    });
}
