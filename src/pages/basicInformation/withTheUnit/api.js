import request from '@/utils/request';
import { formData } from '@/utils/utils';

const { publicEnms } = window;
export function getTableData(payload) {
    const body = formData(payload);
    return request(`${publicEnms}/iaBase/selectPageComps`, {
        method: 'POST',
        body,
    });
}
export function save(payload) {
    const body = formData(payload);
    return request(`${publicEnms}/iaBase/saveComp`, {
        method: 'POST',
        body,
    });
}
