import request from '@/utils/request';
import { formData } from '@/utils/utils';

const { publicPath } = window;

export function BillBusinessTable(payload) {
    const body = formData(payload);
    return request(`${publicPath}/largeamount/getBillList`, {
        method: 'POST',
        body,
    });
}

export function getSubsByGid() {
    return request(`${publicPath}/baseCompInfo/getSubsByGid`, { method: 'GET' });
}

export function addBill(payload) {
    const body = formData(payload);
    return request(`${publicPath}/largeamount/addBill`, {
        method: 'POST',
        body,
    });
}

export function delBill(payload) {
    const body = formData(payload);
    return request(`${publicPath}/largeamount/delBill`, {
        method: 'POST',
        body,
    });
}
export async function getComposeSelectData(payload) {
    const { path } = payload;
    const body = formData(payload);
    return request(`${publicPath}/${path}`, {
        method: 'POST',
        body,
    });
}
// 查询可使用的货物名称列表 [编号-名称]
export function findCompUsedIdNameHwmcs(payload) {
    return request(`${publicPath}/baseCompInfo/findCompUsedIdNameHwmcs`, {
        method: 'POST',
    });
}

// 查询可使用的规格型号列表 [编号-名称]
export function findCompUsedIdNameGgxhs(payload) {
    const body = formData(payload);
    return request(`${publicPath}/baseCompInfo/findCompUsedIdNameGgxhs `, {
        method: 'POST',
        body,
    });
}

// 合同类型
export function searchPageBmgfs() {
    return request(`${publicPath}/road/searchPageBmgfs `, {
        method: 'POST',
    });
}

export function dwzb() {
    return request(`${publicPath}/finance/dwzb`, { method: 'POST' });
}

export function getCompRolesData() {
    return request(`${publicPath}/userCenter/getCompRoles`, { method: 'POST' });
}
