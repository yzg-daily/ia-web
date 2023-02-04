import request from '@/utils/request';

const { entries } = Object;
const { publicPath, publicPath2 } = window;

// 获取短信验证码
export function getCaptcha(value) {
    const body = new FormData();
    body.append('telno', `${value}`);
    return request(`${publicPath}/vcode/getVcode`, {
        method: 'POST',
        body,
    });
}

// 登录
export function accountLogin(params) {
    const body = new FormData();
    Object.entries({
        ...params,
        grant_type: 'password',
    })?.forEach(([k, v]) => {
        body.append(k, v);
    });
    // body.append('username', params.username);
    // body.append('password', params.password);
    // body.append('usertype', params.type);
    // body.append('grant_type', 'password');
    return request(`${publicPath2}/login/login`, {
        method: 'POST',
        body,
    });
    // return request(`${publicPath}/home/login`, {
    //     method: 'POST',
    //     body,
    // });
}

// 退出登录
export const logout = () => {
    // request(`${publicPath}/doLogout`);
};

// 忘记密码
export async function forgotPasswordForm(payload) {
    const body = new FormData();
    entries(payload).forEach(([key, val]) => {
        body.append(key, val);
    });
    return request(`${publicPath}/resetPasswdByVcode`, {
        method: 'POST',
        body,
    });
}

// 修改密码
export function changePassword({ oldPasswd, newPasswd, uid }) {
    const body = new FormData();
    body.append('oldPasswd', oldPasswd);
    body.append('newPasswd', newPasswd);
    body.append('uid', uid);
    return request(`${publicPath}/userCenter/modifyPasswdByOldPasswd`, {
        method: 'POST',
        body,
    });
}

// 获取菜单权限
export async function getMenuInfo(payload) {
    const body = new FormData();
    body.append('systypeid', payload.systypeId);
    return request(`${publicPath2}/common/getPermissionList`, {
        method: 'POST',
        body,
    });
}

// 获取用户信息
export function getUserInfo(payload) {
    const body = new FormData();
    body.append('token', payload.token);
    return request(`${publicPath2}/login/getUserInfoByToken`, {
        method: 'POST',
        body,
    });
}

// 根据从其他系统传过来token获取用户信息
export function getUserInfoByToken(payload) {
    const body = new FormData();
    body.append('token', payload.token);
    return request(`${publicPath2}/rpc/common/getUserInfoByToken`, {
        method: 'POST',
        body,
    });
}
