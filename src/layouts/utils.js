import { createFromIconfontCN } from '@ant-design/icons';
import request from '@/utils/request';
import { formData } from '@/utils/utils';
import { tips, getCookie } from '@/utils/utils';

export const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2726180_gggormk7drk.js',
});

export const Tips = (text = '数据有误,请稍后重试', type = 'error') => {
    tips({ description: text, type });
};

export const redirectPath = path => (window.location.href = path);

const { publicPath, publicPath2 } = window;
export const getPath = payload => {
    const body = formData(payload);
    return request(`${publicPath}/topPermission/getTopPermissionUrl`, {
        method: 'POST',
        body,
    });
};

export const _Post = (url, payload = {}) => {
    if (!url) return false;
    // let cancel;
    const body = formData({
        ...(payload || {}),
        query: true,
    });
    return new Promise(async resolve => {
        const res = await request(`${publicPath}/${url}`, {
            method: 'POST',
            body,
        });
        resolve(res);
    });
};

/**
 * 获取用户的权限
 * */
export const getHomePagePermissions = () => {
    return new Promise(async resolve => {
        const res = await _Post('topPermission/getTopPermissionList', {});
        resolve(res?.data);
    });
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

// 跳转综合系统连接
export const GoPage = () => {
    const body = new FormData();
    body.append('id', '4');
    return request(`${publicPath2}/topPermission/getNormalUrl`, {
        method: 'POST',
        body,
    });
};

/**
 * 请求接口 id 对应的页面路径然后跳转
 * */
export const SkipClick = async (el, refresh = value => value) => {
    if (el.id === 'p00014' || el.id === 'p00040') {
        let { data: link } = await GoPage();
        if (link) redirectPath(`${link}#/businessPage?token=${getCookie('token')}&el=${el.id}`);
    }

    if (el.isup === 0) {
        Tips('暂无访问权限');
        return false; // 无效 id tips
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
