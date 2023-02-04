import Request from 'umi-request';
import moment from 'moment';

import { formData, queryMethod, tips } from '@/utils/utils';
import * as datetime from '@/utils/datetime';
import request from '@/utils/request';

import { Modal } from 'antd';
import { findCompUsedIdNameGgxhs, findCompUsedIdNameHwmcs } from './api';

const { CancelToken } = Request;

const { dispatch } = window.g_app._store;
/**
 *  获取 model 里的 selectedRowKeys 数据
 * */
export const getSelectedRowKeys = (props, key, status = true) => {
    if (!key) return false;
    const selectedRowKeys = props?.editData?.[key]?.selectedRowKeys || props?.editData?.selectedRowKeys;
    if (!selectedRowKeys || !selectedRowKeys.length) {
        status && tips({ description: '请选择要操作的数据', type: 'error' });
        return false;
    }
    return selectedRowKeys && selectedRowKeys.toString();
};

/**
 *  清除 model 里的 selectedRowKeys 数据
 *  @param {Object} props 页面的 props 参数
 *  @param {String} key
 *  @param {String} model  model 的名称 默认是 supplies
 * */
export const ClearSelectedRowKeys = (props, key, model = 'supplies') => {
    if (!key) return false;
    const selectedRowKeys = props?.editData?.[key]?.selectedRowKeys;
    if (selectedRowKeys && selectedRowKeys.length) {
        props.dispatch({ type: `${model}/setSelectedRowKeys`, payload: { key, selectedRowKeys: [] } });
        props.dispatch({ type: `${model}/universalGet`, payload: { key, selectedRowKeys: [] } });
    } // 清空选中的行
};

export const getDwzbData = callback => {
    dispatch({ type: `supplies/getDwzb`, payload: { callback } });
};
export const getDwzbPromise = async () => {
    return new Promise(resolve => {
        getDwzbData(data => {
            resolve(data);
        });
    });
};

/**
 *  获取货物名称的方法
 * */
export const getGoods = callback => {
    dispatch({ type: `supplies/getGoods`, payload: { callback } });
};
export const getGoodsPromise = async () => {
    return new Promise(resolve => {
        getGoods(goods => {
            resolve(goods);
        });
    });
};

/**
 *  根据货货物id查村获取对应的规格参数
 * */

export const getGgxhs = (callback, hwid) => {
    dispatch({ type: `supplies/getGgxhs`, payload: { callback, hwid, query: true } });
};
export const getGgxhsPromise = async hwid => {
    return new Promise(resolve => {
        getGgxhs(goods => {
            resolve(goods);
        }, hwid);
    });
};
/**
 *  @param {Object} FormConfig 页面 form 的 json 数据
 *  @param {document} form 的实例
 *  @param {String|| Number} hwid 货物id
 *
 *  @param{String|| Number}  goodsIndex 数组中 hwid 的 index -> FormConfig[goodsIndex]
 *  @param{String|| Number} GgxhsIndex 数组中 ggid 的 index -> FormConfig[GgxhsIndex]
 *
 *  先用 getGoods 获取货物名称的数据,再赋值给 FormConfig[goodsIndex].data 并且添加 onSelect 事件
 *  货物 select 选则之后清除之前选中的规则参数
 * */
export const setData = (FormConfig, form, hwid) =>
    new Promise(async resolve => {
        const formPro = form.current?.props?.form || form?.props?.form;
        if (!formPro) return false;

        let goodsIndex = FormConfig?.findIndex(el => el.name === 'hwid');

        // 如果没有 hwid的下标 退出
        if (goodsIndex === -1 || goodsIndex === undefined) {
            resolve(FormConfig || []);
            return false;
        }
        const goods = await findCompUsedIdNameHwmcs();
        if (goods?.data?.length) {
            FormConfig[goodsIndex] = {
                ...FormConfig[goodsIndex],
                data: goods.data.map(el => {
                    const { id, name } = el;
                    return { ...el, value: id, label: name };
                }),
                onSelect: async hwid => {
                    // 清除 form 中 规格数据 和 缓存的数据
                    formPro.setFieldsValue({
                        ggid: undefined,
                    });
                    let GgxhsIndex = FormConfig?.findIndex(el => el.name === 'ggid');
                    if (GgxhsIndex > -1) {
                        FormConfig[GgxhsIndex].data = [];
                        const ggs = await findCompUsedIdNameGgxhs({ hwid });
                        if (ggs?.data) {
                            FormConfig[GgxhsIndex].data = ggs.data.map((el, index) => {
                                const { id, name } = el;
                                return {
                                    ...el,
                                    value: id,
                                    label: name,
                                    title: name,
                                    key: `0-${index}`,
                                };
                            });
                            formPro.setFieldsValue({
                                ggid: undefined,
                            });
                        }
                    }
                },
            };
            // 更新表单, 显示数据
            formPro.setFieldsValue({
                hwid: undefined,
            });
        }

        // await getGoods(async data => {
        //
        //     FormConfig[goodsIndex] = {
        //         ...FormConfig[goodsIndex],
        //         data,
        //         onSelect: value => {
        //             if (form && form.current) {
        //                 // 清除 form 中 规格数据 和 缓存的数据
        //                 form.current.props.form.setFieldsValue({
        //                     ggid: undefined,
        //                 });
        //                 if (GgxhsIndex > -1) {
        //                     FormConfig[GgxhsIndex].data = [];
        //                 }
        //             }
        //             if (GgxhsIndex > -1) {
        //                 getGgxhs(ggs => {
        //                     FormConfig[GgxhsIndex].data = ggs;
        //                 }, value);
        //             }
        //         },
        //     };
        // });
        //
        // // 如果没有 规格id的下标 和 hwid 退出
        // if (GgxhsIndex === -1 || !hwid) {
        //     resolve(FormConfig);
        //     return;
        // }
        //
        // await getGgxhs(ggs => {
        //     FormConfig[GgxhsIndex].data = ggs;
        // }, hwid);
        //
        // resolve(FormConfig);
    });

/**
 *  处理form的values值 Promise返回数据
 * */
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
                            payload[key] = val?.[0]?.props?.value;
                        }

                        const props = val[0]?.props;

                        if (!props) {
                            // const type =  Object.prototype.toString.call(val);
                            let value = val.toString();
                            payload[key] = value === '[object Object]' ? JSON.stringify(val) : value;
                        } else {
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

/**
 *  是否存在审核流程
 * */
export function IsHasShProcess(payload) {
    const body = formData(payload);
    return request(`${publicPath}/planBaseSh/getSh`, {
        method: 'POST',
        body,
    });
}

export function confirm(callback, ops = {}) {
    const Config = {
        content: `你确认要删除选中的行数据吗？`,
        okText: '删除',
        cancelText: '取消',
        title: '提示',
        ...ops,
    };

    Modal.confirm({
        ...Config,
        maskClosable: true,
        onOk: () => callback && callback(),
    });
}

export function findByKey(payload) {
    const body = formData({ ...payload, query: true });
    return request(`${publicPath}/dictionary/findByKey`, {
        method: 'POST',
        body,
    });
}

const filterFormConfig = ({ form = undefined, config = {}, keys = [] }) => {
    if (!keys || !keys.length) return config;
};

const backData = data => {
    if (!data || !data.length) return [];
    return data;
};

// find index
const FindeIndex = (config, key) => {
    if (!config) return -1;
    return config.findIndex(el => (el.key || el.dataIndex || el.name) === key);
};
const setItemData = ({
    config = {},
    _formProps = {},
    configIndex = -1,
    data = [],
    type = 'form',
    table,
    tableIndex = -1,
}) => {
    if (configIndex > -1) {
        const item = config[configIndex];
        switch (type) {
            case 'form':
                config[configIndex] = {
                    ...item,
                    data,
                    ..._formProps,
                };
                break;
            case 'table':
                config[configIndex].render = value => data.filter(el => el.value === parseInt(value))?.[0]?.name;
                break;
            case 'form&&table':
                config[configIndex] = {
                    ...item,
                    data,
                    ..._formProps,
                };
                if (tableIndex > -1) {
                    table[tableIndex].render = value => data.filter(el => el.value === parseInt(value))?.[0]?.name;
                }
                break;
            default: {
                break;
            }
        }
    }
    return config;
};
/**
 *  @param {Array} data 要处理的数据
 *  @param {{label: 'name', value: 'value'}} Props 返回数据的格式
 * */
const filterSelectData = (data, Props = { label: 'name', value: 'value' }) => {
    if (!data || !data.length) return [];

    return data
        .map(el => {
            const { name } = el;
            let values = {};
            Object.keys(Props)?.forEach(key => {
                if (!key) return false;
                values[key] = el[Props[key]];
            });
            return {
                ...el,
                ...values,
                // label: el[Props.label],
                // value: el[Props.value],
            };
        })
        .filter(el => el);
};

/**
 *  @param {Object} config form config
 *  @param {Object} table  table config
 *  @param {string} type   config 和 table 的类型 [form, table, form&&table] 对数据分别处理
 *  @param {Function} post 请求的接口; 有优先级: keys是array的时候item里的post级别最高 => 然后是函数调用时传入的post => 最后是默认的findByKey方法
 *  @param {Object} formValues  post 请求时需要的其他参数
 *  @param {{label: 'name', value: 'value'}} Props 返回数据的格式 有优先级: keys是array的时候item里的Props级别最高 => 然后是函数调用时传入的 Props => 最后是默认的 {label: 'name', value: 'value'}
 *
 *  @param {Array} keys  2种格式 [xxx, xxxx] 或者 [ {setKey: [xxx, xxxx], post: Function, formValues: {}, Props }]; 第2种格式字段如上注释
 * */

export const setConfig = ({ config, table, type = 'form', keys, post = findByKey, formValues = {}, Props }) =>
    new Promise(async resolve => {
        if (!config || !config.length || !keys || !keys.length) {
            resolve(config || {});
            return false;
        }
        let length = keys.length;
        let Index = 0; //  Index === length 代表循环结束 抛出 resolve

        let key = undefined, // 接口的 key
            _post = undefined, //// 接口请求方法
            _props = undefined, // 接口数据处理的格式
            _formValues = {},
            IndexKey = []; // // index 的关键字
        for (let i in keys) {
            let item = keys[i];
            // let typeName = Object.prototype.toString.call(item);
            // if (typeName === '[object String]') {
            //     key = item; // 字典关键字
            //     IndexKey = [item]; // index 的关键字
            // }
            // // 如果 item 是 object, 考虑到 传入的 key 和 字典key不同的情况 或者 每个 字典返回值不同的情况
            // if (typeName === '[object Object]') {
            //     key = item?.key;
            //     IndexKey = item?.setKey;
            // }
            key = item?.key || item; // 接口的 key
            IndexKey = item?.setKey || (item?.key ? [item?.key] : undefined) || [item] || [key]; // index 的关键字
            _props = item?.Props || Props; // 接口数据处理的格式
            _post = item?.post || post || findByKey; // 接口请求方法
            _formValues = item?.formValues || formValues;
            const _formProps = item?._formProps;
            let res = await _post({ key, ..._formValues }); // 请求
            IndexKey.forEach(el => {
                // 多次执行
                setItemData({
                    config,
                    _formProps,
                    configIndex: FindeIndex(config, el),
                    data: filterSelectData(res?.data, _props),
                    type,
                    table,
                    tableIndex: FindeIndex(table, el),
                });
            });
            Index++;
        }
        if (Index >= length) {
            resolve(config);
        }
    });

export const ClearConfig = (config = [], keyName, value = undefined) => {
    if (!config) return;
    const index = config?.findIndex(el => el.name === keyName);
    if (index === -1) return;
    config[index]['data'] = value;
};

export function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export function getUserInfo(key) {
    let user = {};
    try {
        user = JSON.parse(sessionStorage.getItem('user'));
    } catch (e) {
        console.log('数据异常');
    }
    if (!key) return user;
    return user?.[key];
}

export function callbackStatus(res, callback) {
    if (!res) {
        callback && callback(false);
        return false;
    }
    const status = !!res?.data;
    const description = res?.msg || (status ? '操作成功' : '数据有误,请稍后重试');
    const type = status ? 'success' : 'error';
    tips({ description, type });
    callback && callback(status);
}

export const backMomentValue = (time, dateFormat = 'YYYY/MM/DD') =>
    moment(time ? new Date(time) : new Date(), dateFormat);
export const changeItemDisabled = (config, status, key = 'disabled') => {
    if (!config || !config.length) return config || [];
    return config.map(el => {
        el[key] = Boolean(status);
        return el;
    });
};

export const _Post = (url, payload = {}, cancel) => {
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

const NewTips = (text, status, type = 'info') => {
    const types = status ? 'success' : 'error';
    tips({ description: text, type: types || type });
};

const reg = {
    phone: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
    card: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
};
export { NewTips, reg };
