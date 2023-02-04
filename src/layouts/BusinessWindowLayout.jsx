import React from 'react';
import { Tabs } from 'antd';
const BusinessWindowLayout = props => {
    const callback = () => {
        console.log(props);
    };

    return (
        <>
            <Tabs defaultActiveKey='1' onChange={callback}>
                <Tabs.TabPane tab='Tab 1' key='1' />
                <Tabs.TabPane tab='Tab 2' key='2' />
                <Tabs.TabPane tab='Tab 3' key='3' />
            </Tabs>

            {props.children}
        </>
    );
};

export default BusinessWindowLayout;
