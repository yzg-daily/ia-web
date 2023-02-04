import request from '@/utils/request';

const { publicPaths } = window;
const publicPath = publicPaths.statistics;

/** 类别检测 */
export function typeOf(obj) {
    const type = {};
    const toStrings = type.toString;
    return toStrings
        .call(obj)
        .split('object ')
        .pop()
        .trim()
        .split(']')
        .shift();
}
/**
 * formDataMethod请求数据格式化
 * @param {any} data 原始请求数据
 * @param {string} data.model 请求接口
 * @param {number} [data.page] 查询页面
 * @param {number} [data.size] 每页展示多少条
 * @param {function} [data.turnPage] 翻页方法
 * @param {function} [data.callback] 回调方法
 * @param {object} config
 * @returns {FormData} 返回标准FormData格式数据
 */
function formDataMethod(data, config = { filter: [] }) {
    const filter = [
        'isDelay',
        'model',
        'callback',
        'turnPage',
        'method',
        'props',
        'path',
        'directory',
        '$serialNumber',
        ...config.filter,
    ];
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => {
        if (!filter.includes(key) && (val || val === 0) && typeof val !== 'function') {
            if (/array|object/gi.test(typeOf(val))) {
                formData.append(key, JSON.stringify(val));
            } else {
                formData.append(key, val);
            }
        }
    });
    return formData;
}

export async function dataInterface(payload, path) {
    const body = formDataMethod(payload);
    return request(`${publicPath}/${path}`, {
        method: 'POST',
        body,
    });
}
