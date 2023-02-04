import request from '@/utils/request';
import { formData } from '@/utils/utils';

const { publicEnms } = window;

// 查询可使用的货物名称列表 [编号-名称]
export function findCompUsedIdNameHwmcs(payload) {
    return request(`${publicEnms}/baseCompInfo/findCompUsedIdNameHwmcs`, {
        method: 'POST',
    });
}

// 查询可使用的规格型号列表 [编号-名称]
export function findCompUsedIdNameGgxhs(payload) {
    return request(`${publicEnms}/baseCompInfo/findCompUsedIdNameGgxhs `, {
        method: 'POST',
        body: formData(payload),
    });
}
