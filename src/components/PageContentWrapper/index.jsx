import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';

const Index = props => {
    const [height, setHeight] = useState(0);

    const { loading, tip, children, style = {} } = props;

    useEffect(() => {
        const { offsetHeight } = document.querySelector('.ant-layout-header');
        const { clientHeight } = document.documentElement;
        const height = clientHeight - offsetHeight - 24 * 2;
        setHeight(height);
    }, []);

    return (
        <Spin spinning={!!loading} tip={`${tip || '数据加载中'}...`}>
            <div style={{ padding: '10px 20px 0 20px', minHeight: height + 'px', background: '#fff', ...style }}>
                {children}
            </div>
        </Spin>
    );
};

export default Index;
