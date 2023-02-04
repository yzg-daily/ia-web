import { ItemHeader, List } from '@/pages/home/components';
import React, { useEffect, useState } from 'react';
import { Col, Row, Spin } from 'antd';
import { _Post } from '@/utils/method';
import { IconFont } from '@/pages/home/utils';

export const BusinessItem = React.memo(props => {
    const { data = [], config = {}, tabs = [], tabsOnchange = value => value, title = undefined, ...rest } = props;

    return (
        <>
            <ItemHeader title={title} tabs={tabs} tabsOnchange={tabsOnchange} {...rest} />
            <List data={data} {...config} {...rest} />
        </>
    );
});
export const UseBusinessItem = React.memo(props => {
    const { url, tabs, payload = {}, tabsOnchange, deps = [], tabsKey, ...rest } = props;
    const [layPage] = useState({ page: 1, size: 10 });
    const [spinning, setSpinning] = useState(false);
    const [data, setData] = useState([]);
    const [value, setvalue] = useState(tabs?.[0]?.key);
    // tabsKey 父级传入 指定 键值  在提交的时候使用

    const handleTabsOnchange = value => {
        setvalue(value);
        tabsOnchange && tabsOnchange(value);
    };

    useEffect(() => {
        let cancel = c => c;
        (async () => {
            setSpinning(true);
            const res = await _Post(
                url,
                {
                    ...payload,
                    ...layPage,
                    [tabsKey]: value,
                },
                cancel
            );
            setData(res?.data || []);
            setSpinning(false);
        })();
        return () => cancel && cancel();
    }, [value]);
    return (
        <div className={'itemH'}>
            <Spin spinning={spinning}>
                <BusinessItem data={data} tabs={tabs} tabsOnchange={handleTabsOnchange} {...rest} />
            </Spin>
        </div>
    );
});
export const ShowBusiness = React.memo(props => {
    const { data = [], handleOnClick = value => value } = props;
    const [spinning, setSpinning] = useState(false);

    const ShowBusinessOnclick = el => {
        handleOnClick &&
            handleOnClick(el, ({ status }) => {
                setSpinning(status);
            });
    };
    const imgMap = {
        p00001: 'icon-a-zongheguanlixitong-icon_huaban1fuben20',
        p00002: 'icon-a-zongheguanlixitong-icon_huaban1fuben21',
        p00003: 'icon-a-zongheguanlixitong-icon_huaban1fuben22',
        p00004: 'icon-a-zongheguanlixitong-icon_huaban1fuben23',
        p00005: 'icon-a-zongheguanlixitong-icon_huaban1fuben24',
        p00006: 'icon-a-zongheguanlixitong-icon_huaban1fuben25',
        p00007: 'icon-a-zongheguanlixitong-icon_huaban1fuben25',
        p00008: 'icon-a-zongheguanlixitong-icon_huaban1fuben26',
        // p00001: require('./image/scdiaodu.png'), // {name: "生产调度", id: "p00001", has: 1}
        // p00002: require('./image/jihuauanlii.png'), //{name: "计划管理", id: "p00002", has: 1}
        // p00003: require('./image/xiaoshou.png'), //{name: "销售管理", id: "p00003", has: 1}
        // p00004: require('./image/caigou.png'), // {name: "采购管理", id: "p00004", has: 1}
        // p00005: require('./image/dazhong.png'), //{name: "大宗物料", id: "p00005", has: 1}
        // p00006: require('./image/zhantai.png'), //{name: "站台铁路", id: "p00006", has: 1}
        // p00007: require('./image/caiwu.png'), //{name: "财务管理", id: "p00007", has: 1}
        // p00008: require('./image/huanyan.png'), // {name: "化验管理", id: "p00008", has: 1}
    };

    return (
        <>
            <div className='itemH p0 lucency '>
                <Spin spinning={spinning}>
                    <div className={'businessItem'}>
                        <Row gutter={[10, 10]}>
                            {data?.map(el => (
                                <Col
                                    className={'businessItemCol'}
                                    span={6}
                                    key={el.id}
                                    onClick={() => ShowBusinessOnclick(el)}
                                >
                                    <div>
                                        <span className={'IconFont'}>
                                            <IconFont type={imgMap[el.id]} />
                                            {/*<img src={imgMap[el.id]} alt='' />*/}
                                            {/*<Icon type='heart' theme='twoTone' twoToneColor='#eb2f96' />*/}
                                        </span>
                                        <span className={'name'}> {el.name}</span>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Spin>
            </div>
        </>
    );
});
