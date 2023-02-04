import request from '@/utils/request';

const { publicPath2 } = window;

function formData(data) {
    const da = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (key !== 'model' && key !== 'path' && key !== 'pathName') {
            if (val !== undefined && val !== '') {
                da.append(key, val);
            }
        }
    });
    return da;
}

export async function sendRequest(payload, path) {
    const body = formData(payload);
    return request(`${publicPath2}/${path}`, {
        method: 'POST',
        body,
    });
}
