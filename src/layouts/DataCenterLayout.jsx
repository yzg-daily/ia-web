/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import React, { useState } from 'react';
import { Link } from 'umi';
import router from 'umi/router';
import { connect } from 'dva';
import {
    Result,
    Button,
    Drawer,
    List,
    // Icon
} from 'antd';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
// import style from './DataCenterLayout.less';
import '@/pages/DataCenter/qyDataCenter.less';
import Header from '@/pages/DataCenter/component/header';
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
// const menuDataRender = (menuList, onTitleClick) =>
//     [
//         // {
//         //     // icon: collapsed ? <Icon type="menu-unfold" /> : <Icon type="menu-fold" />,
//         //     icon: <Icon type='menu-unfold' />,
//         //     name: ' ',
//         //     onTitleClick: () => onTitleClick(collapsed => !collapsed) ,
//         // },
//         ...(menuList || []),
//     ].map(item => {
//         const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
//         return Authorized.check(item.authority, localItem, null);
//     });

const DataCenterLayout = props => {
    const [visible, setVisible] = useState(false);
    // const [collapsed, setCollapsed] = useState(false);

    const {
        // dispatch,
        children,
        // settings,
        route,
        location = {
            pathname: '/',
        },
    } = props;

    const routerItemName =
        route?.children?.find(el => el.path === location.pathname)?.name ||
        props?.edidData?.DataCenterTitle ||
        '数据中心';

    function VisibleChange() {
        setVisible(visible => !visible);
    }

    function changeRoute(path) {
        router.push(path);
    }

    const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
        authority: undefined,
    };
    /* 权限 */

    return (
        <div className={'dashRegion'}>
            <Fit>
                <div className={'dataCenter'}>
                    <Header title={routerItemName} route={route} VisibleChange={VisibleChange} />
                    {/*<p className={'collapsedIcon'} onClick={VisibleChange}>*/}
                    {/*    {visible ? <Icon type='menu-fold' /> : <Icon type='menu-unfold' />}*/}
                    {/*</p>*/}
                    <Authorized authority={authorized.authority} noMatch={noMatch}>
                        {children}
                    </Authorized>
                    <Drawer
                        key={'datacenter-Drawer'}
                        placement={'left'}
                        style={{ color: '#cd1d0f' }}
                        className={'dataCenter-Drawer'}
                        visible={visible}
                        closable={false}
                        onClose={VisibleChange}
                    >
                        <List
                            split={false}
                            style={{ color: '#cd1d0f' }}
                            dataSource={route.children.filter(item => !item.hideInMenu)}
                            renderItem={({ name, path }) => (
                                <List.Item
                                    key={path}
                                    onClick={() => changeRoute(path)}
                                    className={`lits-item ${location.pathname === path ? 'active' : ''}`}
                                >
                                    {name}
                                </List.Item>
                            )}
                        />
                    </Drawer>
                </div>
            </Fit>
        </div>
    );
};

// export default DataCenterLayout;
export default connect(({ supplies }) => ({
    edidData: supplies,
}))(DataCenterLayout);
