import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
// const RouterConfig = require('../../../config/config').default.routes;

const { publicEnms } = window;
import request from '@/utils/request';
import { Spin, Result, Button } from 'antd';
import { getCookie, setCookie, removeCookie, tips } from '@/utils/utils';
import { getUserAccessControl } from '@/services/userCenter';
import userAccessControl from '@/utils/accessControl';
// import { system } from '@/pages/Welcome';
import { GoPage, redirectPath } from '@/layouts/utils';

// 固定 getTableData 名称  接口不通 获取对应的table数据
export function getUserInfo() {
    return request(`${publicEnms}/home/getUserInfo`);
}

const model = 'supplies';

const type = 1;

function getHrefParam(str, name) {
    String.prototype.getQuery = function(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let r = this.replace(/#|#\/.*($)/gi, '')
            .substr(this.indexOf('?') + 1)
            .match(reg);
        return r ? decodeURIComponent(r[2]) : null;
    };
    return str.getQuery(name);
}

const style = {
    textAlign: 'center',
    width: '100%',
    // height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    height: '58px',
};

//
// const getUserAccessControlFun = (props, user) => {
//     const { dispatch } = props;
//     const payload = {
//         model: 'getUserPermission',
//         uid: user.uid,
//         query: true,
//         callback: res => {
//             sessionStorage.setItem('userPermissions', JSON.stringify(userAccessControl(res.data)));
//         },
//     };
//     dispatch({ type: 'userCenterModels/getUserAccessControl', payload });
// };

const Index = props => {
    const { dispatch } = props;

    const [errorInfo, setErrorInfo] = useState({
        status: 'error',
        title: '登陆失败',
        subTitle: '请确认token是否有效',
    });
    const [tip, setTip] = useState('正在获取用户信息');
    const [status, setStatus] = useState(false);

    const clearInfo = useCallback(() => {
        removeCookie();
        setStatus(true);
    }, []);

    const init = async () => {
        const url = window.location.href.split('#')[1];
        const token = getHrefParam(url, 'token');
        if (!token) {
            clearInfo();
            tips({ type: 'error', message: 'token无效,请确认token' });
            return false;
        }
        setCookie('token', token);
        const res = await getUserInfo();
        const data = res?.data || [];
        if (!data || !data?.uid) {
            //
            clearInfo();

            tips({ type: 'error', message: '获取用户信息失败' });
            return false;
        }
        sessionStorage.clear();
        sessionStorage.setItem('currentType', type === 1 ? 'enterprise' : 'member');
        sessionStorage.setItem('user', JSON.stringify({ ...data, token }));
        setTip('登陆成功,正在获取权限');
        await dispatch({
            type: 'login/changeLoginStatus',
            payload: { ...data, type, token },
        });
        dispatch({
            type: 'userCenterModels/saveNavList',
            payload: { navList: [] },
        });

        // 权限路由
        // const result = await getUserAccessControl({
        //     payload: {
        //         model: 'getUserPermission',
        //         uid: data.uid,
        //     },
        // });
        //
        // const resultData = result?.data;
        //
        // if (!resultData) {
        //     setErrorInfo({ ...resultData, title: '跳转失败', subTitle: '获取用户权限失败' });
        //     clearInfo();
        //
        //     return false;
        // }
        //
        // // 缓存路由
        // const menu = userAccessControl(resultData);
        // sessionStorage.setItem('userPermissions', JSON.stringify(menu));

        // 获取报表菜单 - 在综合系统中添加的报表二级菜单
        // dispatch({
        //     type: `publicVerifyModels/getReportMenu`,
        //     payload: {
        //         uid: data.uid,
        //         page: 1,
        //         size: 1000,
        //         query: true,
        //     },
        // }).then(menu => {
        //     sessionStorage.setItem('menuLoad', '1');
        //     sessionStorage.setItem('menuItems', JSON.stringify(menu));
        // });

        setTip('正在跳转');
        // 获取 path
        const path = getHrefParam(url, 'path');
        //  根据 path 开头中字段匹配已有的数据 可能不够完善  /one/two    matePath = one
        const matePath = path?.split('/').filter(el => el)?.[0];
        // 缓存入口路由的id 根据 matePath 获取 对应的 id， 无论是否有值都缓存  BasicLayout.jsx => menuDataRender 是否有必要判断这个id对应的数据？
        // 这个id如果不存在 页面中不会显示 菜单数据
        // let currentSystemID = system.find(el => el.path.indexOf(matePath) > -1)?.id;
        // sessionStorage.setItem('currentSystemID', currentSystemID);
        sessionStorage.setItem('from', 'zh');
        setTimeout(() => {
            router.push(path || '404');
        }, 1000);
    };

    useEffect(() => {
        (async () => {
            const pageCode = sessionStorage.getItem('pageCode') || '';
            if (pageCode === '404') {
                sessionStorage.setItem('pageCode', '');
                let { data } = await GoPage();
                const path = `${data}?token=${getCookie('token')}`;
                if (data) redirectPath(path);
            } else {
                await init();
            }
        })();
    }, []);

    return (
        <>
            {!status && (
                <div style={style}>
                    <Spin size={'large'} tip={tip} />
                </div>
            )}
            {status && (
                <Result
                    status='error'
                    {...errorInfo}
                    extra={[
                        <Button type='primary' key='console' onClick={() => window.history.go(-1)}>
                            返回
                        </Button>,
                    ]}
                />
            )}
        </>
    );
};
const connectFun = ({ publicVerifyModels, loading, ...rest }) => ({
    editData: rest[model],
    common: publicVerifyModels,
    loading: loading.models[model],
});
export default connect(connectFun)(Index);
