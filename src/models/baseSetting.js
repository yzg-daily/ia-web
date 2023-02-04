import * as api from '@/services/baseSetting';
// import * as service from '@/services/service';
// import * as common from '@/utils/common';
import { tips } from '@/utils/utils';

const { parseInt } = Number;
export default {
    namespace: 'BaseModels',
    state: {
        page: 1,
        size: 20,
        total: 0,
        area: [],
        keyName: 'uuid',
        selectedRowKeys: [], // 表单选择
        goodsNameList: [], // 货物名称
        allGoodsNameList: [], // 所有的货物名称
        specificationModelList: [], // 规格型号列表
        unitSetList: [], //  单位设置 列表
        unitSetPositionList: [], // 单位设置 仓位编辑
        unitSetSiloList: [], // 单位设置 筒仓仓位
        laboratoryIndicatorsList: [], // 所有的化验指标
        allUsersList: [], // 本单位下所有用户
        contractTypeList: [], // 合同类型列表
        userList: [], // 操作员设置列表
        accountFundsList: [], // 账户资金列表
        otherInOutAllList: [], // 其他收支项目主表
        otherProjDetailsAllList: [], // 其他收支项目明细主表
        singleModelTestList: [], // 单条规格型号的化验指标
        bankList: [], // 所有银行列表
        customerStarList: [], // 客户等级
        singleOperatingCircuitList: [], // 物流 操作员设置 单条操作员的操作线路
        singpositionSetList: [], // 物流 操作员设置 单条操作员的操作仓位
        rechargeList: [], //物流 操作员设置 充值主表
        ladingData: {}, // 直销提单数据
        searchPageCdList: [], //基础信息：车队管理主表
        carlineSetList: [], //车辆排队设置 主表
        weighControlData: {}, // 过磅控制
    },

    effects: {
        // 同步单位
        *syncJtDwxxs({ payload }, { call, put }) {
            yield call(api.syncJtDwxxs, payload);
            tips({ description: '成功', type: 'success' });
        },
        // 过磅控制
        *getWeighControlData({ payload }, { call, put }) {
            const response = yield call(api.getWeighControl, payload);
            yield put({
                type: 'saveWeighControlData',
                payload: response,
            });
        },
        // 新增过磅控制
        *addWeighControlData({ payload }, { call, put }) {
            const response = yield call(api.addWeighControl, payload);
            if (response?.data) {
                tips({ description: '保存成功', type: 'success' });
                return true;
            }
        },
        // 删除过磅控制
        *delWeighControlData({ payload }, { call, put }) {
            const response = yield call(api.delWeighControl, payload);
            if (response?.data) {
                tips({ description: '删除成功', type: 'success' });
                return true;
            }
        },
        // 车辆排队设置
        *carlineSet({ payload }, { call, put }) {
            const data = yield call(api.carlineSet, payload);
            if (data && data.code) {
                switch (payload.model) {
                    // 查询 pd_configure_list  增加  修改  pd_configure 删除 pd_configure_del
                    case 'pd_configure':
                        tips({ description: data.msg, type: 'success' });
                        break;
                    case 'pd_configure_del':
                        tips({ description: data.msg, type: 'success' });
                        break;
                    default:
                        yield put({
                            type: 'saveCarlineSetList',
                            payload: {
                                carlineSetList: data.data,
                                total: data.total,
                                page: parseInt(data.page),
                                pageSize: parseInt(data.size),
                            },
                        });
                }
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 精确查找
        *exactSearch({ payload }, { call, put }) {
            const data = yield call(api.exactSearch, payload.keyword);
            if (data) {
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback(data.data);
                }
            }
        },
        // 货物名称设置
        *goodNameSet({ payload }, { call, put }) {
            const data = yield call(api.goodSet, payload);
            if (data) {
                switch (payload.model) {
                    // 查询saveCompHwmc  增加  修改 删除deleteCompHwmc
                    // 规格型号查询 findCompUsedGgxhs
                    case 'saveCompHwmc':
                        tips({ description: '添加成功', type: 'success' });
                        break;
                    case 'deleteCompHwmc':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    // 规格型号列表
                    case 'findCompUsedGgxhs':
                        yield put({
                            type: 'saveSpecificationModelList',
                            payload: {
                                specificationModelList: data.data,
                                total: data.total,
                                page: parseInt(data.page),
                                pageSize: parseInt(data.size),
                            },
                        });
                        break;
                    // 保存规格型号
                    case 'saveCompGgxh':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    // 删除单条规格型号
                    case 'deleteCompGgxh':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    default:
                        yield put({
                            type: 'saveGoodsList',
                            payload: {
                                goodsNameList: data.data,
                                total: data.total,
                                page: parseInt(data.page),
                                pageSize: parseInt(data.size),
                            },
                        });
                }
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 单位设置
        *unitNameSet({ payload }, { call, put }) {
            const data = yield call(api.unitSet, payload);
            if (data?.data) {
                switch (payload.model) {
                    // 查询  增加  修改 删除
                    case 'saveCompDwxx':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    case 'deleteCompDwxx':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    default:
                        yield put({
                            type: 'saveUnitSet',
                            payload: {
                                unitSetList: data.data,
                                total: data.total,
                                page: parseInt(data.page),
                                pageSize: parseInt(data.size),
                            },
                        });
                }
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 单位设置 仓位编辑
        *unitSetPosition({ payload }, { call, put }) {
            const data = yield call(api.unitSetPosition, payload);
            if (data) {
                switch (payload.model) {
                    case 'saveCwxx':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    case 'deleteCwxx':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    default:
                        yield put({
                            type: 'saveUnitSetPositionList',
                            payload: {
                                unitSetPositionList: data.data,
                            },
                        });
                }
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 单位设置 筒仓仓位
        *unitSetSilo({ payload }, { call, put }) {
            const data = yield call(api.unitSetSilo, payload);
            if (data?.data) {
                switch (payload.model) {
                    case 'saveTccw':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    case 'deleteTccw':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    default:
                        yield put({
                            type: 'saveUnitSetSiloList',
                            payload: {
                                unitSetSiloList: data.data,
                            },
                        });
                }
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 合同类型
        *contractTypeSet({ payload }, { call, put }) {
            const data = yield call(api.contractType, payload);
            if (data.data) {
                switch (payload.model) {
                    // 查询  增加  修改 删除
                    case 'saveBmgf':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    case 'deleteBmgf':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    default:
                        yield put({
                            type: 'saveContractTypeSet',
                            payload: {
                                contractTypeList: data.data,
                                total: data.total,
                                page: parseInt(data.page),
                                pageSize: parseInt(data.size),
                            },
                        });
                }
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 省市区
        *areaid(payload, { call, put }) {
            const data = yield call(api.area, payload);
            if (data) {
                yield put({
                    type: 'saveArea',
                    payload: {
                        area: data.data,
                    },
                });
            }
        },
        // 所有的货物名称
        *getAllGoodsName(payload, { call, put }) {
            const data = yield call(api.allGoodsName, payload);
            if (data) {
                yield put({
                    type: 'saveAllGoodsName',
                    payload: {
                        allGoodsNameList: data.data,
                    },
                });
            }
        },
        // 基础信息：车队管理主表
        *searchPageCd(payload, { call, put }) {
            const data = yield call(api.searchPageCd, payload);
            if (data) {
                yield put({
                    type: 'savePageCd',
                    payload: {
                        searchPageCdList: data.data,
                    },
                });
            }
        },
        // 删除车队管理
        *deletecdglFetch({ payload: { id, callback } }, { call, put }) {
            const data = yield call(api.deletecdgl, { id });
            if (data) {
                tips({ description: '删除成功！', type: 'success' });
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        },
        // 获取所有化验指标名称
        *getLaboratoryIndicators(payload, { call, put }) {
            const data = yield call(api.laboratoryIndicators, payload);
            if (data) {
                yield put({
                    type: 'saveLaboratoryIndicators',
                    payload: {
                        laboratoryIndicatorsList: data.data,
                    },
                });
            }
        },
        // 单条规格型号的化验指标
        *singleModelTest({ payload }, { call, put }) {
            const data = yield call(api.singleModelTest, payload);
            if (data) {
                yield put({
                    type: 'saveSingleModelTestList',
                    payload: {
                        singleModelTestList: data.data,
                    },
                });
            }
        },
        // 向单个规格型号设置化验指标
        *addSingleModelTest({ payload }, { call, put }) {
            const data = yield call(api.addSingleModelTest, payload);
            if (data) {
                tips({ description: '添加成功', type: 'success' });
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 本单位下所有用户
        *getAllUsers(payload, { call, put }) {
            const data = yield call(api.allUsers, payload);
            if (data) {
                yield put({
                    type: 'saveAllUsersList',
                    payload: {
                        allUsersList: data.data,
                    },
                });
            }
        },
        //物流 单条操作员的操作线路
        *singleOperatingCircuit({ payload }, { call, put }) {
            const data = yield call(api.singleOperatingCircuit, payload);
            if (data) {
                yield put({
                    type: 'saveSingleOperatingCircuit',
                    payload: {
                        singleOperatingCircuitList: data.data,
                    },
                });
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        //物流 单条操作员的操作仓位
        *singpositionSet({ payload }, { call, put }) {
            const data = yield call(api.singpositionSet, payload);
            if (data) {
                yield put({
                    type: 'savesingpositionSet',
                    payload: {
                        singpositionSetList: data.data,
                    },
                });
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },

        // 物流   单条操作员设置操作线路
        *setSingleOperatingCircuit({ payload }, { call, put }) {
            const data = yield call(api.setSingleOperatingCircuit, payload);
            if (data) {
                tips({ description: '添加成功', type: 'success' });
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 物流   单条操作员设置操作仓位
        *enOKpositionSet({ payload }, { call, put }) {
            const data = yield call(api.enOKpositionSet, payload);
            if (data) {
                tips({ description: '添加成功', type: 'success' });
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 操作员设置列表
        *allOperator({ payload, url }, { call, put }) {
            const data = yield call(api.userSet, payload, url);
            if (data.code) {
                switch (payload.model) {
                    // 查询  增加  修改 删除  初始化密码
                    case 'saveUser':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    case 'deleteUser':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    case 'resetPasswd':
                        tips({ description: '初始化密码成功', type: 'success' });
                        break;
                    // 充值 按钮
                    case 'addBalToUser':
                        tips({ description: '充值成功', type: 'success' });
                        break;
                    // 充值主表
                    case 'findListCzycz':
                        yield put({
                            type: 'saveRechargeList',
                            payload: {
                                rechargeList: data.data,
                                total: data.total,
                                page: parseInt(data.page),
                                size: parseInt(data.size),
                            },
                        });
                        break;
                    default:
                        yield put({
                            type: 'saveAllOperator',
                            payload: {
                                userList: data,
                            },
                        });
                }
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 账户资金设置列表
        *accountFundsSet({ payload }, { call, put }) {
            const data = yield call(api.accountFundsSet, payload);
            if (data) {
                switch (payload.model) {
                    case 'insertBankAndAcc':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    case 'delBankAndAcc':
                        if (data && data.data) {
                            tips({ description: '删除成功', type: 'success' });
                        }
                        break;
                    default:
                        yield put({
                            type: 'saveAccountFundsList',
                            payload: {
                                accountFundsList: data.data.content,
                                total: data.total,
                                page: parseInt(data.page),
                                size: parseInt(data.size),
                            },
                        });
                }
                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 所有的银行名称列表
        *bank(payload, { call, put }) {
            const data = yield call(api.bank, payload);
            if (data) {
                yield put({
                    type: 'saveBank',
                    payload: {
                        bankList: data.data,
                    },
                });
            }
        },
        // 客户等级
        *customerStar(payload, { call, put }) {
            const data = yield call(api.customerStar, payload);
            if (data) {
                yield put({
                    type: 'saveCustomerStar',
                    payload: {
                        customerStarList: data.data,
                    },
                });
            }
        },
        // 其他收支项目列表
        *otherInOut({ payload }, { call, put }) {
            const data = yield call(api.otherInOut, payload);
            if (data) {
                switch (payload.model) {
                    case 'insertOtherProj':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    case 'delOtherProj':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    // 明细新增、修改、删除
                    case 'getOtherProjDetails':
                        yield put({
                            type: 'saveOtherProjDetailsList',
                            payload: {
                                otherProjDetailsAllList: data,
                            },
                        });
                        break;
                    case 'insertOtherProjDetail':
                        tips({ description: '保存成功', type: 'success' });
                        break;
                    case 'delOtherProjDetail':
                        tips({ description: '删除成功', type: 'success' });
                        break;
                    default:
                        yield put({
                            type: 'saveOtherInOutList',
                            payload: {
                                otherInOutAllList: data,
                            },
                        });
                }

                if (payload.callback && typeof payload.callback === 'function') {
                    payload.callback();
                }
            }
        },
        // 直销提单权限
        *getLadingData({ payload }, { call, put }) {
            const response = yield call(api.getLadingData, payload);

            yield put({
                type: 'ladingData',
                payload: response,
            });
        },
        // 新增/修改车队信息
        *addsaveCdFetch({ payload }, { call, put }) {
            const data = yield call(api.saveCd, payload);
            if (data.data) {
                tips({ description: '保存成功！', type: 'success' });
                if (payload.payload.callback && typeof payload.payload.callback === 'function') {
                    payload.payload.callback();
                }
            }
        },
        // 设置直销提单权限
        *setLadingData({ payload }, { call, put }) {
            const response = yield call(api.setLadingData, payload);
            if (response.data) {
                tips({ description: '保存成功', type: 'success' });
                return true;
            }
        },
    },
    reducers: {
        setSelectedRowKeys(state, { payload: { selectedRowKeys } }) {
            return { ...state, selectedRowKeys };
        },
        getSelectedRowKeys(state, { payload: { cb } }) {
            cb(state.selectedRowKeys);
            return { ...state };
        },
        setkeyName(state, { payload: { keyName } }) {
            return { ...state, keyName };
        },
        // 操作员设置
        saveAllOperator(state, { payload: { userList } }) {
            return { ...state, userList };
        },
        //物流 操作员设置 充值主表
        saveRechargeList(state, { payload: { rechargeList, total, page, size } }) {
            return { ...state, rechargeList, total, page, size };
        },
        // 合同类型设置
        saveContractTypeSet(state, { payload: { contractTypeList, total, page, pageSize } }) {
            return { ...state, contractTypeList, total, page, pageSize };
        },
        // 本单位下所有用户
        saveAllUsersList(state, { payload: { allUsersList } }) {
            return { ...state, allUsersList };
        },
        //物流 单条操作员的操作线路
        saveSingleOperatingCircuit(state, { payload: { singleOperatingCircuitList } }) {
            return { ...state, singleOperatingCircuitList };
        },
        //物流 单条操作员的操作仓位
        savesingpositionSet(state, { payload: { singpositionSetList } }) {
            return { ...state, singpositionSetList };
        },

        // 所有的化验指标
        saveLaboratoryIndicators(state, { payload: { laboratoryIndicatorsList } }) {
            return { ...state, laboratoryIndicatorsList };
        },
        // 单条规格型号的化验指标
        saveSingleModelTestList(state, { payload: { singleModelTestList } }) {
            return { ...state, singleModelTestList };
        },
        // 所有的货物名称
        saveAllGoodsName(state, { payload: { allGoodsNameList } }) {
            return { ...state, allGoodsNameList };
        },
        //  基础信息：车队管理主表
        savePageCd(state, { payload: { searchPageCdList } }) {
            return { ...state, searchPageCdList };
        },
        // 省市区
        saveArea(state, { payload: { area } }) {
            return { ...state, area };
        },
        // 单位设置
        saveUnitSet(state, { payload: { unitSetList, total, page, pageSize } }) {
            return { ...state, unitSetList, total, page, pageSize };
        },
        // 单位设置 仓位编辑
        saveUnitSetPositionList(state, { payload: { unitSetPositionList } }) {
            return { ...state, unitSetPositionList };
        },
        // 单位设置 筒仓仓位
        saveUnitSetSiloList(state, { payload: { unitSetSiloList } }) {
            return { ...state, unitSetSiloList };
        },
        // 货物名称设置
        saveGoodsList(state, { payload: { goodsNameList, total, page, pageSize } }) {
            return { ...state, goodsNameList, total, page, pageSize };
        },
        // 规格型号列表
        saveSpecificationModelList(state, { payload: { specificationModelList, total, page, pageSize } }) {
            return { ...state, specificationModelList, total, page, pageSize };
        },
        // 账户资金设置列表
        saveAccountFundsList(state, { payload: { accountFundsList, total, page, size } }) {
            return { ...state, accountFundsList, total, page, size };
        },
        // 所有的银行名称列表
        saveBank(state, { payload: { bankList } }) {
            return { ...state, bankList };
        },
        saveCustomerStar(state, { payload: { customerStarList } }) {
            return { ...state, customerStarList };
        },
        // 其他收支项目列表
        saveOtherInOutList(state, { payload: { otherInOutAllList } }) {
            return { ...state, otherInOutAllList };
        },
        // 其他收支项目明细主表
        saveOtherProjDetailsList(state, { payload: { otherProjDetailsAllList } }) {
            return { ...state, otherProjDetailsAllList };
        },
        // 直销提单
        ladingData(state, { payload }) {
            return { ...state, ladingData: payload };
        },
        // 车辆排队设置
        saveCarlineSetList(state, { payload: { carlineSetList, total, page, pageSize } }) {
            return { ...state, carlineSetList, total, page, pageSize };
        },
        // 过磅控制
        saveWeighControlData(state, { payload }) {
            return { ...state, weighControlData: payload || {} };
        },
    },
};
