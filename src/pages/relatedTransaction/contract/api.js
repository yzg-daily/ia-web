import request from '@/utils/request';
import { formData } from '@/utils/utils';

const { publicEnms } = window;
export function getTableData(payload) {
    const body = formData(payload);
    return request(`${publicEnms}/iaRoadSearch/roadListSearch`, {
        method: 'POST',
        body,
    });
}
export function save(payload) {
    const body = formData(payload);
    return request(`${publicEnms}/iaRoadSearch/modifyRoadList`, {
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
export function details(payload) {
    return request(`${publicEnms}/iaRoadSearch/roadListDetails`, {
        method: 'POST',
        body: formData(payload),
    });
}
