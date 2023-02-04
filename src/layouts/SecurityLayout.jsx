import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import { router } from 'umi';
import { stringify } from 'querystring';
import { getCookie } from '@/utils/utils';

const SecurityLayout = props => {
    const { children, loading } = props;
    const [isReady, setIsReady] = useState(false);
    const isLogin = getCookie('token');

    useEffect(() => {
        setIsReady(true);
    }, []);

    if ((!isLogin && loading) || !isReady) {
        return <PageLoading />;
    }

    if (!isLogin) {
        return router.push('/user/login');
    }

    return children;
};

export default connect(({ user, loading }) => ({
    currentUser: user.currentUser,
    loading: loading.models.user,
}))(SecurityLayout);
