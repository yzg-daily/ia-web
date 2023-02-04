/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import React, { useState } from 'react';
import { Link, router } from 'umi';
import { Button, Card, Col, Modal, Row } from 'antd';
import { GoPage, IconFont, redirectPath } from './utils';
import NewAvatar from '@/components/GlobalHeader/NewAvatarDropdown';
import { getCookie } from '@/utils/utils';
import css from './HeaderNew.less';
import { removeCookie } from '@/utils/utils';

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

const HeaderNew = props => {
    const { setPower, dispatch } = props;
    const [relation, setRelation] = useState(false); // 联系我们
    const [app, setApp] = useState(false); // app
    const user = JSON.parse(sessionStorage.getItem('user'));

    async function logoutFun() {
        let { data: path } = await GoPage();
        if (path) {
            // 退出登录时候删除cookie
            removeCookie();
            sessionStorage.clear();
            router.push('/user/login');
        }
    }

    const handleShowPower = () => {
        setPower(v => !v);
    };
    const handleRelation = () => {
        setRelation(v => !v);
    };
    const handleSetApp = () => {
        setApp(v => !v);
    };
    const handleReturn = async () => {
        let { data } = await GoPage();
        const path = `${data}#/businessPage?token=${getCookie('token')}`;
        if (data) redirectPath(path);
    };

    if (user && (user.userId || user.uid)) {
        return (
            <div className={css.login}>
                <div className={css.loginLeft}>
                    <Button className={css.btn} type='link' ghost onClick={handleShowPower}>
                        <IconFont type='icon-a-icon_huaban1fuben1' className={css.IconFont} />
                        切换平台
                    </Button>
                    <Button className={css.btn} type='link' ghost onClick={handleReturn}>
                        <IconFont type='icon-a-icon_huaban1fuben1' className={css.IconFont} />
                        综合管理系统
                    </Button>
                    <Button className={css.btn} type='link' ghost onClick={handleRelation}>
                        <IconFont type='icon-a-icon_huaban1fuben3' className={css.IconFont} onClick={handleShowPower} />
                        联系我们
                    </Button>
                    <Button className={css.btn} type='link' ghost onClick={handleSetApp}>
                        <IconFont type='icon-a-icon_huaban1fuben4' className={css.IconFont} onClick={handleShowPower} />
                        下载APP
                    </Button>
                    {/* <Button
                        className={css.btn}
                        type='link'
                        ghost
                        target='_blank'
                        href='http://39.100.206.2:8090/api/enms/files/temps/czsc.pdf'
                    >
                        <IconFont type='icon-a-icon_huaban1fuben5' className={css.IconFont} onClick={handleShowPower} />
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
                    <NewAvatar currentUser={{ ...user }} logout={() => logoutFun(props)} />
                </div>
                <Modal
                    title={'联系'}
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
                    width={75}
                    title='下载APP请扫二维'
                    visible={app}
                    onCancel={handleSetApp}
                    footer={[
                        <Button type=' primary' ghost onClick={handleSetApp}>
                            关闭
                        </Button>,
                    ]}
                >
                    <Row gutter={[10, 10]}>
                        {appUrl &&
                            appUrl.list.map((el, index) => (
                                <Col span={6}>
                                    <Card title={`扫一扫，下载${el.alt}`}>
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

export default HeaderNew;
