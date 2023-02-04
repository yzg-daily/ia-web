import request from '@/utils/request';
import { formData } from '@/utils/utils';

const { publicEnms } = window;
export function save(payload) {
    const body = formData(payload);
    return request(`${publicEnms}/iaRoadSearch/examCalcRoadList`, {
        method: 'POST',
        body,
    });
}
