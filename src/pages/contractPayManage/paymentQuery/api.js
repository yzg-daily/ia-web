import request from '@/utils/request';
import { formData } from '@/utils/utils';

const { publicEnms } = window;
export function getTableData(payload) {
    const body = formData(payload);
    return request(`${publicEnms}/iaBase/selectPageFLog`, {
        method: 'POST',
        body,
    });
}
export function save(payload) {
    const body = formData(payload);
    return request(`${publicEnms}/iaBase/addFLog`, {
        method: 'POST',
        body,
    });
}
export function del(payload) {
    const body = formData(payload);
    return request(`${publicEnms}/iaBase/deleteFLog`, {
        method: 'POST',
        body,
    });
}
