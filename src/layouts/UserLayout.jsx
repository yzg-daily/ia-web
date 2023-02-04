import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet } from 'react-helmet';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './UserLayout.less';

const UserLayout = props => {
    const [text, setText] = useState('晋ICP备 17008535号');
    const [text2, setText2] = useState('森甲能源科技有限公司版权所有');

    const {
        route = {
            routes: [],
        },
    } = props;
    const { routes = [] } = route;
    const {
        children,
        location = {
            pathname: '',
        },
    } = props;
    const { breadcrumb } = getMenuData(routes);
    const title = getPageTitle({
        pathname: location.pathname,
        breadcrumb,
        formatMessage,
        ...props,
    });

    useEffect(() => {
        const { hostname } = window.location;
        const names = ['121.89.218.83', 'www.zqszwl.com', 'zqszwl.com'];
        if (names.includes(hostname)) {
            setText('晋ICP备 2022006382号-2');
            setText2('左权县数字经济发展有限公司版权所有');
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta name='description' content={title} />
            </Helmet>
            <div className={styles.container}>
                <div className={styles.top}>
                    <span className={styles.logo1} />
                </div>
                <div className={styles.content}>
                    <div className={styles.warp}>
                        <div className={styles.desc}>内部关联交易系统</div>
                        <div className={styles.login}>
                            <div className={styles.header}>
                                <span className={styles.title}>用户登录</span>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <a style={{ color: '#ddd' }} href='https://beian.miit.gov.cn' target='_blank'>
                        {text}
                    </a>
                    &copy;{text2}
                </div>
            </div>
        </>
    );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
