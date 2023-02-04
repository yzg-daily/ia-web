const controller = new AbortController(); // 创建一个控制器
const count = 0;

// import React, { useEffect, useRef, useState } from 'react';
// import { _Post } from '@/utils/method';
//
//
// /**
//  * @param {String} url 接口请求路径
//  * @param {Object} payload 接口请求邪恶参数
//  * @param {Function} callBack 请求完成之后的回调函数
//  *
//  * */
// function RequestSomething({ url = '', payload = {}, callBack = val => val } = props) {
//
//     const loading = useRef(false);
//     return new Promise(async (resolve, reject) => {
//         if (!url || url === '') {
//             reject({});
//             return;
//         }
//         loading.current = true;
//         const res = await _Post(url, payload);
//         loading.current = false;
//         resolve(res);
//         callBack?.(res);
//     });
// }
//
// /**
//  * 封装一个请求功能, 返回加载状态和最后得请求结果
//  * */
// export function useAayncHandle(props) {
//     const [loading, setLoading] = useState(false);
//     const [data, setData] = useState(undefined);
//     const count = useRef(0);
//     const {deps = [], ...rest} = props || {};
//     useEffect(() => {
//         const currentCount = useRef.current;
//         (async () => {
//             const res = await RequestSomething(rest);
//             setData(res);
//         })();
//         () => {
//             count.current += 1;
//         };
//     }, [...deps]);
//     return { loading, data };
// }
//
// function HandleSomething() {
// }
