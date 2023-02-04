import request from '@/utils/request';
import { formData, formDataMethod } from '@/utils/utils';
const { publicPath, publicPath2, publicEnms } = window;
// 计量单位
export function measureUnit(payload) {
    const body = formDataMethod(payload);
    return request(`${publicPath}/unitgroup/${payload.model}`, {
        method: 'POST',
        body,
    });
}
