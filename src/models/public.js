/**
 * 公共接口统一配置model
 * */
import * as api from '@/services/service';
import { tips } from '@/utils/utils';
import { getHomePagePermissions } from '@/utils/method';

const publicModel = {
    namespace: 'publicMethod',
    state: {
        collapsed: false,
        notices: [],
        Power: {},
        permissionList: [],
        buttonList: [],
    },
    effects: {
        *changePassword({ payload }, { call, put }) {
            const changPassWd = yield call(api.changePassword, payload);
            if (changPassWd) {
                tips({ description: '密码修改成功', type: 'success' });
            } else {
                tips({ description: changPassWd.toString(), type: 'error' });
            }
        },
        *getPower({ payload }, { call, put }) {
            const data = yield call(getHomePagePermissions, payload) || [];
            yield put({
                type: 'setPower',
                payload: {
                    Power: data,
                },
            });
            const callBack = payload?.callBack;
            callBack && callBack?.(data);
        },
        *getPermissionList({ payload }, { call, put }) {
            const response = yield call(api.getMenuInfo, payload);
            if (response?.data) {
                yield put({
                    type: 'savePermissionList',
                    payload: response.data,
                });
                return response.data;
            }
            return [];
        },
    },
    reducers: {
        changeLayoutCollapsed(state = { notices: [], collapsed: true }, { payload }) {
            return { ...state, collapsed: payload };
        },
        setPower(state, { payload = {} }) {
            return { ...state, ...(payload || {}) };
        },
        savePermissionList(state, { payload }) {
            return { ...state, permissionList: payload || [] };
        },
        saveButtonList(state, { payload }) {
            return { ...state, buttonList: payload || [] };
        },
    },
    subscriptions: {},
};
export default publicModel;
