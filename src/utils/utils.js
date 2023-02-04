import { useEffect, useRef, useState } from 'react';
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import numeral from 'numeral';
import { notification } from 'antd';
import moment from 'moment';
import request from './request';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const { entries } = Object;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
    if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
        return true;
    }
    return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
    const { NODE_ENV } = process.env;

    if (NODE_ENV === 'development') {
        return true;
    }

    return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);
/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */

export const getAuthorityFromRouter = (router = [], pathname) => {
    const authority = router.find(
        ({ routes, path = '/' }) =>
            (path && pathRegexp(path).exec(pathname)) || (routes && getAuthorityFromRouter(routes, pathname))
    );
    if (authority) return authority;
    return undefined;
};
export const getRouteAuthority = (path, routeData) => {
    let authorities;
    routeData.forEach(route => {
        // match prefix
        if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
            if (route.authority) {
                authorities = route.authority;
            } // exact match

            if (route.path === path) {
                authorities = route.authority || authorities;
            } // get children authority recursively

            if (route.routes) {
                authorities = getRouteAuthority(path, route.routes) || authorities;
            }
        }
    });
    return authorities;
};

// cookie设置
export function setCookie(name, value) {
    const Days = 30;
    const exp = new Date();
    exp.setTime(exp.getTime() + 60 * 1000 * 24 * Days);
    const cookieValue = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
    document.cookie = cookieValue;
}

// cookie获取
export function getCookie(name) {
    const RE = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    const arr = document.cookie.match(RE);
    if (arr && arr.length) return unescape(arr[2]);
    return null;
}

// cookie删除
export function removeCookie() {
    document.cookie = 'currType=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'token=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    sessionStorage.removeItem('user');
}

// 信息提示
export function tips({ message, description, type = 'warning' }) {
    let title = message;
    if (!message) {
        switch (type) {
            case 'error':
                title = '错误信息';
                break;
            case 'success':
                title = '成功信息';
                break;
            case 'info':
                title = '提示信息';
                break;
            default:
                title = '警告信息';
                break;
        }
    }

    return notification[type]({
        message: title,
        description,
    });
}

// 表格宽高计算
export const getWidth = col => {
    let x = 0;
    const viewArea = document.body;
    const y = viewArea.offsetHeight * 0.7 * 0.9;
    if (col) {
        col.forEach(c => {
            x += c.width ? c.width : 100;
        });
    }
    return { x, y };
};
// 表单默认验证规则
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const validator = (rule, value, callback, source, options) => {
    const errors = [];
    if (!value) {
        errors.push(new Error('!'));
    }
    return errors;
};
// 表单自定义验证规则，默认执行validator方法
export const descriptor = {
    userName(rule, value, callback, source, options) {
        return validator(rule, value, callback, source, options);
    },
    companyName(rule, value, callback, source, options) {
        return validator(rule, value, callback, source, options);
    },
    socialCreditCode(rule, value, callback, source, options) {
        return validator(rule, value, callback, source, options);
    },
    head(rule, value, callback, source, options) {
        return validator(rule, value, callback, source, options);
    },
    unitAddress(rule, value, callback, source, options) {
        return validator(rule, value, callback, source, options);
    },
    companyNameAs(rule, value, callback, source, options) {
        return validator(rule, value, callback, source, options);
    },
    phone(rule, value, callback) {
        if (value) {
            const MOBILE = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
            const TEL = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
            let msg;
            if (!/\d/.test(value)) {
                msg = '请输入电话号码必须为数字';
            }
            if (MOBILE.test(value) || TEL.test(value)) {
                if (value.length < 11) {
                    msg = '联系电话不能少于11位';
                }
                if (value.length > 11) {
                    msg = '联系电话不能大于11位';
                }
            } else {
                msg = '电话号码格式错误';
            }
            callback(msg);
        } else {
            callback('!');
        }
    },
};
// 根据class查找特定元素
export const findElement = (current, className) => {
    const element = current.parentNode;
    if (current.tagName.toLowerCase() === 'body') return null;
    if (!current.classList.contains(className)) return findElement(element, className);
    return current;
};

export function createTreeData(data) {
    const res = [];
    data.forEach(d => {
        if (!d.pid) {
            res.push({
                title: d.label,
                value: d.value,
                key: d.value,
                sts: d.sts,
                lvl: d.lvl,
            });
        } else {
            res.forEach(r => {
                if (r.value === d.pid) {
                    if (!r.children) {
                        // eslint-disable-next-line no-param-reassign
                        r.children = [];
                    }
                    r.children.push({
                        title: d.label,
                        value: d.value,
                        key: d.value,
                        sts: d.sts,
                        lvl: d.lvl,
                    });
                }
            });
        }
    });
    return res;
}

// 类别检测
export function typeOf(obj) {
    const type = {};
    const toStrings = type.toString;
    return toStrings
        .call(obj)
        .split('object ')
        .pop()
        .trim()
        .split(']')
        .shift();
}

export const renderNumber = (num, format = '0,0.00') => (num ? numeral(num).format(format) : 0);
export const queryMethod = (queryFilter, callback) => queryFilter.props.form.validateFieldsAndScroll(callback);
// 按照类型格式化最后提交数据
export const formatTypeData = (rols, val) => {
    const values = { ...val };
    rols.forEach(c => {
        if (c.type === 'cascader-select') {
            const vs = values[c.name];
            if (vs && vs.length) {
                values[c.name] = vs[vs.length - 1];
            } else {
                values[c.name] = null;
            }
        }
        if (c.dataType === 'number') {
            values[c.name] = +values[c.name];
        } else if (c.dataType === 'date' || c.dataType === 'datetime') {
            const date = !values[c.name] ? null : new Date(values[c.name]);
            values[c.name] = !values[c.name]
                ? null
                : new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate(),
                      date.getHours(),
                      date.getMinutes(),
                      date.getSeconds()
                  );
        } else if (/\w*(dm$)/gi.test(c.name)) {
            // 匹配单位信用代码，不全对应缺少名称
            const currentValue = values[c.name][0].props;
            values[c.name] = currentValue.id;
            if (!values[c.name.replace(/dm/, 'mc')]) {
                values[c.name.replace(/dm/, 'mc')] = currentValue.name;
            }
        } else {
            values[c.name] = values[c.name] === undefined ? null : values[c.name];
        }
        if (c.multiple || c.type === 'checkbox-group') {
            values[c.name] = values[c.name].join(',');
        }
    });
    if (values.fkje && typeof values.fkje !== 'number') {
        values.fkje = +values.fkje.replace(',', '');
    }
    if (values.ph && typeof values.ph !== 'string') {
        values.ph = `${values.ph}`;
    }
    return values;
};

export function formData(data) {
    const da = new FormData();
    entries(data).forEach(([key, val]) => {
        if (key !== 'model' && key !== 'callback' && key !== 'query' && key !== 'type' && key !== 'turnPage') {
            if (data.query) {
                if (val || val === 0 || val === '') {
                    da.append(key, val);
                }
            } else {
                da.append(key, JSON.stringify(val));
            }
        }
    });
    if (data.query && data.turnPage) {
        if (!data.page) {
            da.append('page', 1);
        }
        if (!data.size) {
            da.append('size', 20);
        }
    }
    return da;
}

export const compareTime = (a, b, description = '开始时间不能大于结束时间！', showTips = true) => {
    let result = false;
    if (a && b) result = moment(a) - moment(b) > 0;
    if (result && showTips) tips({ description, type: 'error' });
    return result;
};
//  通过出生日期  算年龄
export const ages = str => {
    var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
    if (r == null) return '';
    var d = new Date(r[1], r[3] - 1, r[4]);
    if (d.getFullYear() == r[1] && d.getMonth() + 1 == r[3] && d.getDate() == r[4]) {
        var Y = new Date().getFullYear();
        return Y - r[1];
    }
    return '';
};
// 身份证  提取出生年月日
export const getBirthdatByIdNo = iIdNo => {
    if (iIdNo) {
        var tmpStr = '';
        iIdNo = iIdNo?.replace(/^\s+|\s+$/g, '');

        if (iIdNo?.length == 15) {
            tmpStr = iIdNo.substring(6, 12);
            tmpStr = '19' + tmpStr;
            tmpStr = tmpStr.substring(0, 4) + '-' + tmpStr.substring(4, 6) + '-' + tmpStr.substring(6);
            return tmpStr;
        } else {
            tmpStr = iIdNo.substring(6, 14);
            tmpStr = tmpStr.substring(0, 4) + '-' + tmpStr.substring(4, 6) + '-' + tmpStr.substring(6);
            return tmpStr;
        }
    }
};

/**
 * formDataMethod请求数据格式化
 * @param {object} data 原始请求数据
 * @param {string} data.model 请求接口
 * @param {number} [data.page] 查询页面
 * @param {number} [data.size] 每页展示多少条
 * @param {function} [data.turnPage] 翻页方法
 * @param {function} [data.callback] 回调方法
 * @param {object} [config]
 * @returns {FormData} 返回标准FormData格式数据
 */
export function formDataMethod(data, config = { filter: [] }) {
    const filter = [
        'isDelay',
        'model',
        'callback',
        'turnPage',
        'method',
        'props',
        'path',
        'directory',
        '$serialNumber',
    ];
    if (config?.filter) {
        filter.concat(config?.filter);
    }
    const formData = new FormData();
    entries(data).forEach(([key, val]) => {
        if (!filter.includes(key) && (val || val === 0) && typeof val !== 'function') {
            const typeRsult = typeOf(val);
            if (/array|object/gi.test(typeRsult)) {
                formData.append(key, JSON.stringify(val));
            } else {
                formData.append(key, val);
            }
        }
    });
    return formData;
}

/**
 * 函数检测 isFn
 * @param {function} fnName
 * @return {boolean}
 * */
export const isFn = fnName => fnName && typeof fnName === 'function';

/**
 * 信息提示
 * @param {object} param 参数集合
 * @param {string} param.description='未知错误' - 消息提示描述内容 description
 * @param {string} [param.title='提示信息'] - 消息提示标题 title
 * @param {'error|success|info|warning'} [param.type='warning'] - 消息类型 type 可选：error、success、info、warning
 * @returns {JSX.Element}
 * @description type-消息类型 可选参数 error、success、info、warning。默认：warning
 */
export function tip({ title = '提示信息', description = '未知错误', type = 'warning' }) {
    let message = title;
    if (!message) {
        switch (type) {
            case 'error':
                message = '错误信息';
                break;
            case 'success':
                message = '成功信息';
                break;
            case 'info':
                message = '提示信息';
                break;
            default:
                message = '警告信息';
                break;
        }
    }

    return notification[type]({
        message,
        description,
    });
}

/**
 *  resultCode = 800  resultMsg 存在得时候 单独处理分页
 * */
export const handlePaging = props => {
    const { resultCode, resultMsg, data } = props || {};
    if (Array.isArray(data)) return props;
    if (resultCode === 800 && resultMsg) {
        if (
            data.hasOwnProperty('records') ||
            data.hasOwnProperty('total') ||
            data.hasOwnProperty('size') ||
            data.hasOwnProperty('current') ||
            data.hasOwnProperty('pages')
        ) {
            const { records = [], pages, current, size, total, ...rest } = data || {};
            return {
                pages,
                current,
                size,
                total,
                records,
                ...rest,
                page: current,
                data: records || data,
            };
        }
        return props;
    }
    return props;
};

export const useUpdate = () => {
    const [, setFlag] = useState();
    return () => {
        setFlag(Date.now());
    };
};
// export const useRequest = (payload = {}, deps = []) => {
//
//
//     const count = useRef(0);
//     const [RequestData, setRequestData] = useState(undefined);
//     const [RequestLoading, setRequestLoading] = useState(false);
//
//     const controller = new AbortController();
//
//
//     const { url, ...rest } = payload;
//
//     async function RequestFun() {
//         setRequestLoading(true);
//         let index = count.current;
//         const { signal } = controller;
//         const res = await request(url, {
//             ...rest,
//             signal
//         });
//         if (index === count.current) {
//             setRequestData(res);
//         }
//
//         setRequestLoading(false);
//     }
//
//     useEffect(() => {
//         RequestFun();
//         return () => {
//             controller?.abort();
//             count.current += 1;
//             console.log(count.current, '123');
//         };
//     }, [...deps, url]);
//
//     return {
//         res: RequestData,
//         loading: RequestLoading
//     };
// };
