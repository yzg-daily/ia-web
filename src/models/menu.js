import { sendRequest2 } from '@/services/send';
import { tips } from '@/utils/utils';

const MessageModel = {
    namespace: 'menu',
    state: {
        selectedRowKeys: {},
        mainData: {},
        sysData: {},
        menuData: {},
    },
    effects: {
        *getMainData({ payload }, { call, put }) {
            const response = yield call(sendRequest2, payload, 'role/selectMenuPersonalPage');
            yield put({
                type: 'mainData',
                payload: response.data,
            });
        },
        *getSysData({ payload }, { call, put }) {
            const response = yield call(sendRequest2, payload, 'role/selectSystypeList');
            yield put({
                type: 'sysData',
                payload: response,
            });
        },
        *getMenuData({ payload }, { call, put }) {
            const response = yield call(sendRequest2, payload, 'role/selectLvl1MenuList');
            yield put({
                type: 'menuData',
                payload: response,
            });
        },
        *addData({ payload }, { call }) {
            const response = yield call(sendRequest2, payload, 'role/savePersonalMenu');
            if (response?.data) tips({ description: '保存成功', type: 'success' });
        },
        *deleteData({ payload }, { call }) {
            const response = yield call(sendRequest2, payload, 'role/removePersonalMenu');
            if (response?.data) tips({ description: '删除成功', type: 'success' });
        },
    },
    reducers: {
        setSelectedRowKeys(state, { payload: { selectedRowKeys } }) {
            return { ...state, selectedRowKeys };
        },
        mainData(state, { payload }) {
            return { ...state, mainData: payload || {} };
        },
        sysData(state, { payload }) {
            return { ...state, sysData: payload || {} };
        },
        menuData(state, { payload }) {
            return { ...state, menuData: payload || {} };
        },
    },
};
export default MessageModel;
