import request from '@/utils/request';
import { formData } from '@/utils/utils';

const { publicEnms } = window;

export function getTableData(payload) {
    return request(`${publicEnms}/iaRoadSearch/roadCollectSearch`, {
        method: 'POST',
        body: formData(payload),
    });
}

export function save(payload) {
    return request(`${publicEnms}/iaRoadSearch/addRoadList`, {
        method: 'POST',
        body: formData(payload),
    });
}

export function del(payload) {
    return request(`${publicEnms}/iaRoadSearch/deleteRoadList`, {
        method: 'POST',
        body: formData(payload),
    });
}

export function details(payload) {
    return request(`${publicEnms}/iaRoadSearch/roadListDetails`, {
        method: 'POST',
        body: formData(payload),
    });
}
