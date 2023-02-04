/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import { Link, router } from 'umi';
import { connect } from 'dva';
import { Result, Button, Icon, Modal, Card, Row, Col } from 'antd';
import Authorized from '@/utils/Authorized';
import { getAuthorityFromRouter } from '@/utils/utils';
import Avatar from '@/components/GlobalHeader/AvatarDropdown';
import css from './BasicLayout.less';
import defaultSettings from '../../config/defaultSettings';
import HeaderNew from './HeaderNew';
// import PowerComponents from '@/pages/home/components/PowerComponents';
import TopNav from './TopNav';
import { IconFont } from '@/pages/home/utils';
import { getHomePagePermissions } from '@/utils/method';

// const MyIcon = Icon.createFromIconfontCN({
//     scriptUrl: '//at.alicdn.com/t/font_2581740_p843zoa6jbp.js',
// });

const logo =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAABBCAYAAACel4eZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjJFREI2QjcxQ0Y4NTExRTlCMzY2RjVCNTkzNEYyQzM2IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjJFREI2QjcyQ0Y4NTExRTlCMzY2RjVCNTkzNEYyQzM2Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MkVEQjZCNkZDRjg1MTFFOUIzNjZGNUI1OTM0RjJDMzYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MkVEQjZCNzBDRjg1MTFFOUIzNjZGNUI1OTM0RjJDMzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6t9BdhAAAGFUlEQVR42uxa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';
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
const appUrl = {
    url: '/api/enms/home/getAppQrcode',
    list: [
        { alt: '森甲智运App', sid: '9' },
        { alt: '企业管家APP', sid: '11' },
        { alt: '森甲物流APP', sid: '3' },
        { alt: '煤焦化验APP', sid: '10' },
        { alt: '煤焦收发货APP', sid: '12' },
        { alt: '购销APP', sid: '14' },
        { alt: '合同管理APP', sid: '17' },
    ],
};

function compareMenu(retData, localData, result) {
    if (retData && localData) {
        retData.forEach(data => {
            const local = localData.find(menu => menu.id === Number(data.menuId));
            if (local) {
                const obj = { ...local };
                obj.child = obj.child ? obj.child : [];
                result.push(obj);
                compareMenu(data?.children, local?.children, obj.child);
            }
        });
    }
}

function processMenu(menuInfo) {
    return menuInfo.reduce((acc, cur) => {
        const obj = { ...cur };
        obj.children = processMenu(obj.child);
        delete obj.child;
        return [...acc, obj];
    }, []);
}

function processButton(menuInfo) {
    return menuInfo.reduce((acc, cur) => {
        const { id, type, children } = cur;
        if (type === '2') {
            return [...acc, Number(id)];
        } else {
            const arr = processButton(children);
            return [...acc, ...arr];
        }
    }, []);
}

const logout = props => props.dispatch({ type: 'login/logout' });

const BasicLayout = props => {
    const [menuData, setMenuData] = useState([]);
    // const [Power, SetPower] = useState({ userPersonalPms: [] }); // 权限
    const [PoweRefresh, SetPoweRefresh] = useState(false); // 权限刷新
    const [visible, setVisible] = useState(false); // 权限刷新
    const [relation, setRelation] = useState(false); // 联系我们
    const [app, setApp] = useState(false); // app
    const [powerVisible, setPowerVisible] = useState(false);

    const user = JSON.parse(sessionStorage.getItem('user'));
    const From = sessionStorage.getItem('from') || 'qy';
    const {
        dispatch,
        children,
        settings,
        route,
        location = {
            pathname: '/',
        },
        publicMethod,
    } = props;
    const { permissionList } = publicMethod;

    const handleMenuCollapse = payload => {
        if (dispatch) {
            dispatch({
                type: 'publicMethod/changeLayoutCollapsed',
                payload,
            });
        }
    }; // get children authority

    const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
        authority: undefined,
    };

    const menuDataRender = menuList => {
        return menuList;
        // const result = [];
        // compareMenu(permissionList, menuList, result);
        // return processMenu(result);
    };

    const menuOnclick = () => {
        setVisible(false);
        const models = [
            'archives',
            'jtmun',
            'lading',
            'log',
            'message',
            'messageConfig',
            'MissionModel',
            'notic',
            'operations',
            'organization',
            'PersonManagement',
            'publicVerifyModels',
            'roleMode',
            'smartPartyBuilding',
            'supplies',
            'task',
            'userCenterModels',
        ];
        models.forEach(model => {
            if (dispatch) {
                dispatch({
                    type: `${model}/setSelectedRowKeys`,
                    payload: { selectedRowKeys: [] },
                });
            }
        });
    };

    useEffect(() => {
        if (!permissionList.length) {
            if (dispatch) {
                dispatch({
                    type: 'publicMethod/getPermissionList',
                    payload: { systypeId: '27' },
                }).then(data => {
                    const buttons = processButton(data);
                    dispatch({
                        type: 'publicMethod/saveButtonList',
                        payload: buttons,
                    });
                });
            }
        }
    }, []);

    /* 权限 */
    useEffect(() => {
        dispatch({
            type: 'publicMethod/getPower',
            payload: {
                callBack: data => {
                    // console.log(data, 'publicMethod/setPower');
                    // SetPoweRefresh(data)
                },
            },
        });
        // let cancel = c => c;
        // (async () => {
        //     const data = await getHomePagePermissions(cancel);
        //     if (dispatch) {
        //         dispatch({
        //             type: 'publicMethod/setPower',
        //             payload: { Power: data },
        //         });
        //     }
        //     // SetPower(data || []);
        // })();
        // return () => cancel && cancel();
    }, []);

    const Power = props?.publicMethod?.Power || {};

    const handlePoweRefresh = () => SetPoweRefresh(!!PoweRefresh);
    const handleOnClose = () => {
        setVisible(false);
    };
    const handleShowPower = () => {
        if (!Power) return false;
        setVisible(v => !v);
    };
    const handleRelation = () => {
        visible && handleShowPower();
        setRelation(v => !v);
    };
    const handleSetApp = () => {
        visible && handleShowPower();
        setApp(v => !v);
    };

    const rightHeaderRender = (props, user) => {
        // const [relation]
        if (user && user.uid) {
            return (
                <div className={css.login}>
                    <div className={css.loginLeft}>
                        {/*<Button className={css.btn} type='link' ghost onClick={handleShowPower}>*/}
                        {/*    <IconFont type='icon-a-icon_huaban1fuben1' className={css.IconFont} />*/}
                        {/*    切换平台*/}
                        {/*</Button>*/}
                        {/*<Button className={css.btn} type='link' ghost onClick={handleRelation}>*/}
                        {/*    <IconFont*/}
                        {/*        type='icon-a-icon_huaban1fuben3'*/}
                        {/*        className={css.IconFont}*/}
                        {/*        onClick={handleShowPower}*/}
                        {/*    />*/}
                        {/*    联系我们*/}
                        {/*</Button>*/}
                        {/*<Button className={css.btn} type='link' ghost onClick={handleSetApp}>*/}
                        {/*    <IconFont*/}
                        {/*        type='icon-a-icon_huaban1fuben4'*/}
                        {/*        className={css.IconFont}*/}
                        {/*        onClick={handleShowPower}*/}
                        {/*    />*/}
                        {/*    下载APP*/}
                        {/*</Button>*/}
                        {/* <Button
                            className={css.btn}
                            type='link'
                            ghost
                            target='_blank'
                            href='http://39.100.206.2:8090/api/enms/files/temps/czsc.pdf'
                        >
                            <IconFont
                                type='icon-a-icon_huaban1fuben5'
                                className={css.IconFont}
                                onClick={handleShowPower}
                            />
                            使用说明
                        </Button> */}
                    </div>
                    {/* <div>
                        <span>{user.name}</span>&minus;
                        <span>{user.cname}</span>
                        <span className={css.logout} onClick={() => logout(props)}>
                            退出登录
                        </span>
                    </div> */}
                    <div>
                        <Avatar currentUser={{ ...user }} logout={() => logout(props)} />
                    </div>
                    <Modal
                        title='联系我们'
                        visible={relation}
                        onCancel={handleRelation}
                        footer={[
                            <Button type='primary' ghost onClick={handleRelation}>
                                关闭
                            </Button>,
                        ]}
                    >
                        <p className={css.tel}>公司名称：山西森甲能源科技有限公司</p>
                        <p className={css.tel}>公司地址：山西省太原市综改示范区五峰国际14层</p>
                        <p className={css.tel}>技术服务(白)：13037017520</p>
                        <p className={css.tel}>财务开票(赵)：15035698194</p>
                    </Modal>
                    <Modal
                        width='75%'
                        title='下载APP请扫二维码'
                        visible={app}
                        onCancel={handleSetApp}
                        footer={[
                            <Button type='primary' ghost onClick={handleSetApp}>
                                关闭
                            </Button>,
                        ]}
                    >
                        <Row gutter={[10, 10]}>
                            {appUrl &&
                                appUrl.list.map((el, index) => (
                                    <Col span={6}>
                                        <Card title={`'扫一扫，下载${el.alt}'`}>
                                            <img
                                                src={`${appUrl.url}?sid=${el.sid}`}
                                                style={{ width: 200, height: 200 }}
                                                alt={el.alt}
                                            />
                                        </Card>
                                    </Col>
                                ))}
                        </Row>
                    </Modal>
                </div>
            );
        }
        return (
            <div className={css.login}>
                <Link to='/user/login'>登录</Link>&nbsp;|&nbsp;
            </div>
        );
    };

    /* 权限 */

    return (
        <ProLayout
            contentStyle={{ margin: '10px', marginBottom: 0 }}
            title={route.name || defaultSettings.title}
            menuHeaderRender={(...arg) => (
                <a href={`${window.location.origin}${window.location.pathname}`}>
                    <img src={logo} alt='logo' />
                    {arg[1]}
                </a>
            )}
            onCollapse={handleMenuCollapse}
            menuItemRender={(menuItemProps, defaultDom) => {
                if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
                    return defaultDom;
                }

                return <Link to={menuItemProps.path}>{defaultDom}</Link>;
            }}
            breadcrumbRender={(routers = []) => [
                {
                    path: '/',
                    breadcrumbName: '首页',
                },
                ...routers,
            ]}
            itemRender={(route, params, routes, paths) => {
                const first = routes.indexOf(route) === 0;
                return first ? (
                    <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
                ) : (
                    <span>{route.breadcrumbName}</span>
                );
            }}
            footerRender={null}
            menuDataRender={menuDataRender}
            menuProps={{
                onClick: menuOnclick,
            }}
            rightContentRender={() => (
                // From === 'zh' ? (
                //     <HeaderNew {...props} setPower={setPowerVisible} />
                // ) : (
                //     rightHeaderRender(props, JSON.parse(sessionStorage.getItem('user')))
                // )
                <HeaderNew {...props} setPower={setPowerVisible} />
            )}
            {...props}
            {...settings}
        >
            <Authorized authority={authorized.authority} noMatch={noMatch}>
                {children}
                {/*<TopNav*/}
                {/*    visible={visible}*/}
                {/*    setVisible={setVisible}*/}
                {/*    Power={Power}*/}
                {/*    handleOnClose={handleOnClose}*/}
                {/*    handlePoweRefresh={handlePoweRefresh}*/}
                {/*/>*/}
            </Authorized>
            {From === 'zh' ? (
                <TopNav
                    visible={powerVisible}
                    Power={Power}
                    handleOnClose={handleOnClose}
                    handlePoweRefresh={handlePoweRefresh}
                />
            ) : null}
        </ProLayout>
    );
};

export default connect(({ publicMethod, settings }) => ({
    publicMethod,
    collapsed: publicMethod.collapsed || false,
    settings,
}))(BasicLayout);
