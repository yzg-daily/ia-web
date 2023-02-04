import { router } from 'umi';
import {
    accountLogin,
    logout,
    forgotPasswordForm,
    getMenuInfo,
    getUserInfo,
    getUserInfoByToken,
} from '@/services/service';
import { setAuthority } from '@/utils/authority';
import { setCookie, tips, removeCookie } from '@/utils/utils';

function processButton(menuInfo) {
    return menuInfo.reduce((acc, cur) => {
        const { id, type, children } = cur;
        if (type === '2') {
            return [...acc, Number(id)];
        } else {
            const arr = processButton(children);
            return [...acc, ...arr];
        }
    }, []);
}

const Model = {
    namespace: 'login',
    state: {
        status: undefined,
    },
    effects: {
        *login({ payload }, { call, put }) {
            const { autoLogin, ...rest } = payload;
            const response = yield call(accountLogin, rest);
            if (response) {
                yield put({
                    type: 'changeLoginStatus',
                    payload: response,
                }); // Login successfully
                const succeed = response.data;
                sessionStorage.clear();

                // 自动登录
                if (autoLogin) {
                    const { password, code, ...rest } = payload;
                    const { btoa, encodeURIComponent } = window;
                    try {
                        localStorage.setItem(
                            'sj_autoLogin',
                            JSON.stringify({
                                ...rest,
                                password: btoa(encodeURIComponent('sj_password' + password)),
                            })
                        );
                    } catch (e) {
                        console.warn(e);
                    }
                }

                // 缓存本次用户信息
                sessionStorage.setItem('user', JSON.stringify(succeed));
                // 缓存本次登录用户类别。member为企业会员用户。enterprise为企业用户
                const currentType = payload.type === '1' ? 'enterprise' : 'member';
                sessionStorage.setItem('currentType', currentType);
                setCookie('token', succeed.token);
                yield put({
                    type: 'changeLoginStatus',
                    payload: {
                        ...succeed,
                        type: currentType,
                    },
                });
                // 菜单和按钮
                const menuInfo = yield call(getMenuInfo, { systypeId: '27' });
                yield put({
                    type: 'publicMethod/savePermissionList',
                    payload: menuInfo?.data || [],
                });
                yield put({
                    type: 'publicMethod/saveButtonList',
                    payload: processButton(menuInfo?.data || []),
                });
                router.push('/home/index');
            }
        },
        *logout(_, { call }) {
            yield call(logout);
            // 退出登录时候删除cookie
            removeCookie();
            localStorage.setItem('sj_autoLogin', null);
            sessionStorage.clear();
            sessionStorage.removeItem('user');
            router.push('/user/login');
        },
        *forgotPasswordForm({ payload }, { call }) {
            const data = yield call(forgotPasswordForm, payload);
            if (data) {
                tips({ description: '密码重置成功', type: 'success' });
            }
        },
        *getUserInfo(payload, { call, put }) {
            const response = yield call(getUserInfo, payload);
            if (response) {
                const succeed = response.data;
                sessionStorage.clear();
                // 缓存本次用户信息
                sessionStorage.setItem('user', JSON.stringify(succeed));
                // 缓存本次登录用户类别。member为企业会员用户。enterprise为企业用户
                const currentType = payload.type === '1' ? 'enterprise' : 'member';
                sessionStorage.setItem('currentType', currentType);
                setCookie('token', succeed.token);
                yield put({
                    type: 'changeLoginStatus',
                    payload: {
                        ...succeed,
                        type: currentType,
                    },
                });
                // 菜单和按钮
                const menuInfo = yield call(getMenuInfo, { systypeId: '27' });
                yield put({
                    type: 'publicMethod/savePermissionList',
                    payload: menuInfo?.data || [],
                });
                yield put({
                    type: 'publicMethod/saveButtonList',
                    payload: processButton(menuInfo?.data || []),
                });
            } else {
                return -1;
            }
        },
        *getUserInfoByToken({ payload }, { call, put }) {
            const response = yield call(getUserInfoByToken, payload);
            if (response) {
                const succeed = response.data;
                succeed.uid = succeed.ywid;
                succeed.cname = succeed.gname;
                sessionStorage.clear();
                // 缓存本次用户信息
                sessionStorage.setItem('user', JSON.stringify(succeed));
                // 缓存本次登录用户类别。member为企业会员用户。enterprise为企业用户
                const currentType = 'enterprise';
                sessionStorage.setItem('currentType', currentType);
                setCookie('token', succeed.token);
                yield put({
                    type: 'changeLoginStatus',
                    payload: {
                        ...succeed,
                        type: currentType,
                    },
                });
                // 菜单和按钮
                const menuInfo = yield call(getMenuInfo, { systypeId: '27' });
                yield put({
                    type: 'publicMethod/savePermissionList',
                    payload: menuInfo?.data || [],
                });
                yield put({
                    type: 'publicMethod/saveButtonList',
                    payload: processButton(menuInfo?.data || []),
                });
            } else {
                return -1;
            }
        },
    },
    reducers: {
        changeLoginStatus(state, { payload }) {
            setAuthority(payload.currentAuthority);
            return { ...state, status: payload.status, type: payload.type };
        },
    },
};
export default Model;
