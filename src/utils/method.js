import Request from 'umi-request';
import { router } from 'umi';
import { handlePaging } from '@/utils/utils';

const { CancelToken } = Request;

import request from '@/utils/request';
import { formData } from '@/utils/utils';
import { tips, removeCookie, queryMethod } from '@/utils/utils';

const { publicPath, publicPath2 } = window;
export const getPath = payload => {
    const body = formData(payload);
    return request(`${publicPath2}/topPermission/getTopPermissionUrl`, {
        method: 'POST',
        body,
    });
};
export const _Post = (url, payload = {}, cancel, urlPublicPath) => {
    if (!url) return false;
    // let cancel;
    const body = formData({
        ...(payload || {}),
        query: true,
    });
    return new Promise(async resolve => {
        const res = await request(`${urlPublicPath || publicPath}/${url}`, {
            method: 'POST',
            body,
            cancelToken: new CancelToken(c => (cancel = c)),
        });
        resolve(handlePaging(res));
        // if (res)
    });
    // return request(`${publicPath}/${url}`, {
    //     method: 'POST',
    //     body,
    //     cancelToken: new CancelToken(c => {
    //         cancel = c;
    //     }),
    // });
};
export const _Post2 = (url, payload = {}, cancel) => {
    if (!url) return false;
    // let cancel;
    const body = formData({
        ...(payload || {}),
        query: true,
    });
    return new Promise(async resolve => {
        const res = await request(`${publicPath2}/${url}`, {
            method: 'POST',
            body,
            cancelToken: new CancelToken(c => (cancel = c)),
        });
        resolve(res);
        // if (res)
    });
    // return request(`${publicPath}/${url}`, {
    //     method: 'POST',
    //     body,
    //     cancelToken: new CancelToken(c => {
    //         cancel = c;
    //     }),
    // });
};
export const Tips = (text = '数据有误,请稍后重试', type = 'error') => {
    tips({ description: text, type });
};

/**
 * 获取对应的路径
 **/
export const RequestPath = async pmsid => {
    return new Promise(async resolve => {
        // 处理请求
        const res = await getPath({ id: pmsid, query: true });
        const path = res?.data;
        if (!path) {
            Tips();
            return false;
        }
        resolve(path);
    });
};
export const redirectPath = path => (window.location.href = path);

/**
 * 请求接口 id 对应的页面路径然后跳转
 * */
export const SkipClick = async (el, refresh = value => value) => {
    if (el.isup === 0) {
        Tips('暂无访问权限');
        return false;
    }
    if (el.id === 'p00014') {
        let url = { pathname: '/home/personnel/service' };
        router.replace(url);
        return;
    } else if (el.id === 'p00040') {
        let pcly = { pathname: '/home/smartPartyBuilding/gatewayHomepage' };
        router.replace(pcly);
        return;
    }
    const url = el?.path;
    if (/(https|http).*?(?="|\"\)|\))/gi.test(url)) {
        redirectPath(url);
        return false;
    }

    const id = el?.id;
    if (!id) {
        Tips('无效id');
        return false; // 无效 id tips
    }
    refresh && refresh({ status: true });
    // 请求 验证 id 获取 path
    const path = await RequestPath(id);
    refresh && refresh({ status: false });
    if (!path) return false;
    const p = path.substr(-1);
    if (p === '#') {
        Tips('暂无页面');
        return false;
    }
    // 跳转
    redirectPath(path);
};

/**
 * 获取用户的权限
 * */
export const getHomePagePermissions = cancel => {
    return new Promise(async resolve => {
        const res = await _Post2('topPermission/getTopPermissionList', {}, cancel);
        resolve(res?.data);
    });
};

export function clearOut() {
    removeCookie();
    sessionStorage.clear();
    router.push('/user/login');
    localStorage.setItem('sj_autoLogin', null);
}

export function VerifyLogin() {
    let userInfo = null;
    try {
        let user = sessionStorage.getItem('user');
        if (!user) {
            clearOut();
            return false;
        }
        userInfo = JSON.parse(user);
    } catch (error) {
        clearOut();
    }

    return userInfo;
}

export function getUserInfo(key) {
    let user = {};
    try {
        user = JSON.parse(sessionStorage.getItem('user'));
    } catch (e) {
        console.log('数据异常');
    }
    if (!user || !key) return false;
    return user?.[key];
}

export const handleFormValues = (queryFilter, reg = /jssj|beginTime|kssj|endTime/) =>
    new Promise((resolve, reject) => {
        const _Reg = new RegExp(reg);

        queryMethod(queryFilter, (error, values) => {
            if (error) {
                reject(error);
                return;
            }
            const payload = {
                query: true,
            };
            Object.entries(values).forEach(([key, val]) => {
                if (val || val === 0) {
                    if (Array.isArray(val)) {
                        if (key === 'cph') {
                            payload[key] = val[0].props.value;
                        } else {
                            const props = val[0]?.props;
                            payload[key] = props?.id || props?.uuid;
                        }
                    } else if (/dwdm/.test(key)) {
                        payload[key] = val[0].key;
                    } else if (_Reg.test(key)) {
                        payload[key] = `${datetime.format(val, 'yyyy-MM-dd')}`;
                    } else {
                        payload[key] = val;
                    }
                }
            });
            resolve(payload);
        });
    });
