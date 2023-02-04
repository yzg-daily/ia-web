import request from '@/utils/request';
import { formDataMethod } from '@/utils/utils';

export async function basic(payload, directory, path, dataType = 'json', config, method = 'POST') {
    const api = `/${directory}${path}`;
    const options = { method };
    if (dataType === 'json') {
        options.params = payload;
    } else {
        options.body = formDataMethod(payload, config);
    }

    return request(api, options, dataType);
}
