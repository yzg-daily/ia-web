import { sendRequest, sendRequest2 } from '@/services/send';
import { tips } from '@/utils/utils';

const HomeModel = {
    namespace: 'home',
    state: {
        selectedRowKeys: {},
        bannerData: {},
        taskData: {},
        planData: {},
        noticData: {},
        msgData: {},
        waringData: {},
        sysData: {},
        quickData: {},
    },
    effects: {
        *getBannerData({ payload }, { call, put }) {
            const paths = { banner: 'sysBanner/getStarBanner' };
            const response = yield call(sendRequest, payload, paths[payload.pathName]);
            yield put({
                type: 'bannerData',
                payload: response,
            });
        },
        *getTaskData({ payload }, { call, put }) {
            const paths = { task: 'bussinesstask/taskShow' };
            const response = yield call(sendRequest, payload, paths[payload.pathName]);
            yield put({
                type: 'taskData',
                payload: response,
            });
        },
        *getPlanData({ payload }, { call, put }) {
            const paths = { plan: 'plan/getList' };
            const response = yield call(sendRequest, payload, paths[payload.pathName]);
            yield put({
                type: 'planData',
                payload: response,
            });
        },
        *getNoticData({ payload }, { call, put }) {
            const paths = { notic: 'announcement/noteList' };
            const response = yield call(sendRequest, payload, paths[payload.pathName]);
            yield put({
                type: 'noticData',
                payload: response,
            });
        },
        *getMsgData({ payload }, { call, put }) {
            const paths = { notic: 'noticemsg/msgShow' };
            const response = yield call(sendRequest, payload, paths[payload.pathName]);
            yield put({
                type: 'msgData',
                payload: response,
            });
        },
        *getWaringData({ payload }, { call, put }) {
            const paths = { notic: 'warnCenter/pageList' };
            const response = yield call(sendRequest, payload, paths[payload.pathName]);
            yield put({
                type: 'waringData',
                payload: response,
            });
        },
        *getShowSysData({ payload }, { call, put }) {
            const paths = { index: 'topPermission/getUserTopPermissionList' };
            const response = yield call(sendRequest2, payload, paths[payload.pathName]);
            yield put({
                type: 'sysData',
                payload: response,
            });
        },
        *getShowSysData2({ payload }, { call, put }) {
            const paths = { index: 'topPermission/getUserTopPermissionList' };
            const response = yield call(sendRequest2, payload, paths[payload.pathName]);
            return response?.data || [];
        },
        *getQuickData({ payload }, { call, put }) {
            const paths = { index: 'userUrl/getUserUrl' };
            const response = yield call(sendRequest, payload, paths[payload.pathName]);
            yield put({
                type: 'quickData',
                payload: response,
            });
        },
        *saveSysData({ payload }, { call, put }) {
            const paths = { index: 'topPermission/saveTop' };
            const response = yield call(sendRequest2, payload, paths[payload.pathName]);
            if (response?.data) tips({ description: '保存成功', type: 'success' });
        },
        *saveQuickData({ payload }, { call, put }) {
            const paths = { index: 'userUrl/saveOrUp' };
            const response = yield call(sendRequest, payload, paths[payload.pathName]);
            if (response?.data) tips({ description: '保存成功', type: 'success' });
        },
    },
    reducers: {
        setSelectedRowKeys(state, { payload: { selectedRowKeys } }) {
            return { ...state, selectedRowKeys };
        },
        bannerData(state, { payload }) {
            return { ...state, bannerData: payload || {} };
        },
        taskData(state, { payload }) {
            return { ...state, taskData: payload || {} };
        },
        planData(state, { payload }) {
            return { ...state, planData: payload || {} };
        },
        noticData(state, { payload }) {
            return { ...state, noticData: payload || {} };
        },
        msgData(state, { payload }) {
            return { ...state, msgData: payload || {} };
        },
        waringData(state, { payload }) {
            return { ...state, waringData: payload || {} };
        },
        sysData(state, { payload }) {
            return { ...state, sysData: payload || {} };
        },
        quickData(state, { payload }) {
            return { ...state, quickData: payload || {} };
        },
    },
};
export default HomeModel;
