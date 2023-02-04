/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import Request, { extend } from 'umi-request';
// import fetch from 'dva';
import fetch from 'dva/fetch';
import { router } from 'umi';
import { getCookie, isAntDesignPro, isFn, removeCookie, tips } from './utils';
import { clearOut } from '@/utils/method';

const { CancelToken } = Request;
const { token, cancel } = CancelToken.source();
let msg = '';

export function getMessage() {
    return msg;
}

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = error => {
    if (Request.isCancel(error)) {
        cancel(error.msg);
    } else if (error.msg) {
        // 处理异常
        const errorText = error.msg;
        const { message, url } = error;
        let description = errorText;
        msg = `请求错误 ${message}: ${url}`;
        if (/timeout.of/i.test(error.message)) {
            msg = '网络异常';
            description = '查询超时，暂时无法查询。请稍后再试！';
            tips({ message: msg, description, type: 'error' });
        }
    } else if (error.response) {
        // 请求已发送但服务端返回状态码非 2xx 的响应
        // 令牌不正确，请重新登录
        if (error.response.status === 401) {
            removeCookie();
            sessionStorage.clear();
            router.push('/user/login');
        } else {
            tips({ description: `${error.response.status} ${codeMessage[error.response.status]}`, type: 'error' });
        }
    } else {
        // 请求初始化时出错或者没有响应返回的异常
        tips({ message: '网络异常', description: '您的网络发生异常，无法连接服务器', type: 'error' });
    }
    return {};
};
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param dataType
 * @param isFile
 * @return {object}           An object containing either "data" or "err"
 */
export default async (url, options = { expirys: isAntDesignPro() }, dataType, isFile = false) => {
    /**
     * 配置request请求时的默认参数
     */
    const defaultOptions = {
        errorHandler, // 默认错误处理
        credentials: 'include', // 默认请求是否带上cookie
        method: 'GET', // 默认请求
        // timeout: 5000, // 超时时长
        cancelToken: token,
        // getResponse: true
    };
    const newOptions = { ...defaultOptions, ...options };
    if (!getCookie('token')) {
        sessionStorage.clear();
    }
    if (/pcUserLogin$/i.test(url)) {
        newOptions.headers = {
            Authorization: 'Basic Y2xpZW50OjEyMzQ1Ng==',
            Referer: `${window.location.origin}/?`,
        };
    } else if (getCookie('token')) {
        newOptions.headers = { Authorization: `Bearer ${getCookie('token')}`, token: `Bearer ${getCookie('token')}` };
    }
    if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                ...newOptions.headers,
            };
            newOptions.body = JSON.stringify(newOptions.body);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers,
            };
        }
    }
    /**
     * 配置request请求时的默认参数
     */
    const request = extend(newOptions);
    let DT = dataType;
    let response;
    if (DT === 'blob') {
        response = await fetch(url, newOptions);
        return await response.blob();
    }
    response = await request(url);

    if (isFile) return response;

    if (DT === undefined) {
        DT = 'json';
    }
    let data = null;
    const { code, resultCode } = response;
    const message = response?.msg;

    if ((message === '身份认证失效！' || message === '未登录！') && window?.location?.hash !== '#/user/login') {
        clearOut();
        return null;
    }

    const infoCode = [811, 890, 895];
    const errorCode = [806, 813, 891, 894];
    if (resultCode === 800) {
        return response;
    } else if (resultCode === 801) {
        removeCookie();
        sessionStorage.clear();
        router.push('/user/login');
    } else if (infoCode.includes(resultCode)) {
        return tips({ description: response.resultMsg, type: 'info' });
    } else if (errorCode.includes(resultCode)) {
        return tips({ description: response.resultMsg, type: 'error' });
    }

    if (code === 1) {
        if (DT === 'json') {
            const result = response;
            if (result.code) {
                ({ msg } = result);
                const { ...others } = result;
                delete others.code;
                delete others.msg;
                delete others.dataType;
                delete others.others;
                if (url.search(/doLogin/) > -1) {
                    ({ data } = others);
                } else {
                    data = {
                        ...others,
                    };
                }

                if (result?.others && result?.others?.totalElements) {
                    data.total = result.others.totalElements;
                    data.page = result.others.number;
                    data.size = result.others.size;
                }
            }
        }
        return data;
    }

    if (code === 2) {
        removeCookie();
        sessionStorage.clear();
        router.push('/user/login');
        // window.location.href = '/user/login';
    }
    if (!/doLogout/.test(url) && response && response.msg) {
        tips({ description: response.msg, type: 'error' });
    }
    // 获取 BPMN XML 数据
    if (/^(<\?xml)/i.test(response)) {
        data = response;
    }
    if (response?.pvmExpItems) {
        data = response;
    }
    if (Array.isArray(response)) {
        data = response;
    }

    return data;
};
