import * as api from '@/services/userCenter';
import { tips } from '@/utils/utils';

const { parseInt } = Number;

export default {
    namespace: 'userCenterModels',
    state: {
        page: 1,
        pageSize: 20,
        total: 0,
        keyName: 'uuid',
        selectedRowKeys: [], // 表单选择
        permission: [], // 全部可分配权限
        roles: [], // 全部已有角色
        rolesHasPermissions: [], // 角色已有权限
        rolesHasPermissionsKeys: [], // 角色已有权限ID
        userRoles: [], // 用户的所有角色
    },
    reducers: {
        setSelectedRowKeys(state, { payload: { selectedRowKeys } }) {
            return { ...state, selectedRowKeys };
        },
        setkeyName(state, { payload: { keyName } }) {
            return { ...state, keyName };
        },
        saveUserAccessControl(state, { payload: { userAccessControl } }) {
            return { ...state, userAccessControl };
        },
        savePermission(state, { payload: { permission, total, page, pageSize } }) {
            return { ...state, permission, total, page, pageSize };
        },
        saveRoles(state, { payload: { roles, total, page, pageSize } }) {
            return { ...state, roles, total, page, pageSize };
        },
        saveRolesHasPermissions(state, { payload: { rolesHasPermissions, total, page, pageSize } }) {
            return { ...state, rolesHasPermissions, total, page, pageSize };
        },
        setRolesHasPermissionsKeys(state, { payload: { rolesHasPermissionsKeys } }) {
            return { ...state, rolesHasPermissionsKeys };
        },
        saveUserRole(state, { payload: { userRoles } }) {
            return { ...state, userRoles };
        },
    },
    effects: {
        *getUserAccessControl(payload, { call }) {
            const data = yield call(api.getUserAccessControl, payload);
            if (data) {
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        *roleSeting(payload, { call, put }) {
            const data = yield call(api.roleSeting, payload);
            if (data) {
                const { callback, model } = payload.payload;
                if (model === 'getUserRole') {
                    yield put({
                        type: 'saveUserRole',
                        payload: {
                            userRoles: data.data,
                            total: data.total || 0,
                            page: parseInt(data.page || '1'),
                            pageSize: parseInt(data.size || '20'),
                        },
                    });
                } else {
                    tips({ description: '角色设置完成', type: 'success' });
                }
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        },
        *getAllPermission(payload, { call, put }) {
            const data = yield call(api.getAllPermission, payload);
            if (data) {
                if (payload.payload.model === 'getCompRoles') {
                    yield put({
                        type: 'saveRoles',
                        payload: {
                            roles: data.data,
                            total: data.total || 0,
                            page: parseInt(data.page || '1'),
                            pageSize: parseInt(data.size || '20'),
                        },
                    });
                } else if (payload.payload.model === 'getRolePermission') {
                    yield put({
                        type: 'saveRolesHasPermissions',
                        payload: {
                            rolesHasPermissions: data.data,
                            total: data.total || 0,
                            page: parseInt(data.page || '1'),
                            pageSize: parseInt(data.size || '20'),
                        },
                    });
                } else {
                    yield put({
                        type: 'savePermission',
                        payload: {
                            permission: data.data,
                            total: data.total || 0,
                            page: parseInt(data.page || '1'),
                            pageSize: parseInt(data.size || '20'),
                        },
                    });
                }

                if (payload.payload.callback && typeof payload.payload.callback === 'function') {
                    payload.payload.callback();
                }
            }
        },
    },
};
