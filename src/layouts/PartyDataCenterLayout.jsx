/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useState } from 'react';
import { Link } from 'umi';
import router from 'umi/router';
import { Result, Button, Drawer, List, Icon } from 'antd';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import '@/pages/partyDataCenter/qyDataCenter.less';
import PartyBuildHeader from '@/pages/partyDataCenter/component/partyBuildHeader';
import Fit from '@/pages/DataCenter/Fit';

const noMatch = (
    <Result
        status={403}
        title='403'
        subTitle='对不起，您没有权限访问此页.'
        extra={
            <Button type='primary'>
                <Link to='/user/login'>登录</Link>
            </Button>
        }
    />
);
/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList, onTitleClick) =>
    [...(menuList || [])].map(item => {
        const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
        return Authorized.check(item.authority, localItem, null);
    });

const PartyDataCenterLayout = props => {
    const {
        dispatch,
        children,
        settings,
        route,
        location = {
            pathname: '/',
        },
    } = props;
    const routerItemName = route?.children?.find(el => el.path === location.pathname)?.name || '数据中心';

    const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
        authority: undefined,
    };
    /* 权限 */
    return (
        <div className={'dashRegion'}>
            <Fit>
                <div className={'partyDataCenter'}>
                    <PartyBuildHeader />
                    <Authorized authority={authorized.authority} noMatch={noMatch}>
                        {children}
                    </Authorized>
                </div>
            </Fit>
        </div>
    );
};

export default PartyDataCenterLayout;
