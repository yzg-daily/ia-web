import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { router } from 'umi';
import { SkipClick, _Post, getUserInfo } from '@/utils/method';
import { Col, Row, Drawer } from 'antd';
import HomeCss from './qyHomeCss.less';
import { UseCarouselComponents } from '@/pages/home/components';
import { UseBusinessItem, ShowBusiness } from '@/pages/home/businessModule';
import QuickEntry from '@/pages/home/components/QuickEntry/index';
import PowerComponents from '@/pages/home/components/PowerComponents';

const Home = props => {
    const [gid] = useState(getUserInfo('gid'));
    // const [layPage] = useState({
    //     page: 1,
    //     size: 10,
    // });

    // const [Power, SetPower] = useState({ userPersonalPms: [] }); // 权限
    // const [PoweRefresh, SetPoweRefresh] = useState(false); // 权限刷新
    // const [NewList, SetNewList] = useState([]); // 消息
    // const [PlanList, SetPlanList] = useState([]); // 计划
    // const [warnList, SetWarnList] = useState([]); // 预警中心
    // const [notice, SetNotice] = useState([]); // 企业公告

    // const [ApprovalList, SetApprovalList] = useState([]); // 任务中心
    // const [dbOrYb, SetDbOrYb] = useState(0); // 任务中心 tabs

    const [BusinessConfig, setBusinessConfig] = useState({
        warn: {
            title: '预警中心',
            url: 'warnCenter/pageList',
            config: { warn: true },
            rightOnclick: () => router.push('early-warning/production'),
            handleOnClick: () => router.push('early-warning/production'),
            EmptyProps: {
                image: require('./businessModule/image/xinxi.png'),
                description: '暂无信息',
            },
        },
        notice: {
            title: '企业公告',
            url: 'announcement/noteList',
            config: { notice: true },
            rightOnclick: () => router.push('notice/release'),
            handleOnClick: () => router.push('notice/release'),
            EmptyProps: {
                image: require('./businessModule/image/gonggao.png'),
                description: '暂无公告',
            },
        },
        New: {
            title: '消息中心',
            url: 'noticemsg/msgShow',
            config: { HaveRead: true },
            rightOnclick: () => router.push('message/notice'),
            handleOnClick: () => router.push('message/notice'),
            EmptyProps: {
                image: require('./businessModule/image/xiaoxi.png'),
                description: '暂无消息',
            },
        },
        plan: {
            title: '工作计划',
            url: 'plan/getList',
            tabs: [
                {
                    title: '日计划',
                    key: 1,
                },
                {
                    title: '其他计划',
                    key: 2,
                },
            ],
            tabsKey: 'lx',
            config: { plan: true },
            //
            rightOnclick: () => router.push('InformationPlan/sellPlan/HighwayDaySell'),
            handleOnClick: () => router.push('InformationPlan/sellPlan/HighwayDaySell'),
            EmptyProps: {
                image: require('./businessModule/image/jihua.png'),
                description: '暂无计划',
            },
        },
        task: {
            title: '任务中心',
            url: 'bussinesstask/taskShow',
            tabs: [
                {
                    title: '待办',
                    key: 0,
                    path: 'task-center/wait',
                },
                {
                    title: '已办',
                    key: 1,
                    path: 'task-center/complete',
                },
            ],
            tabsValue: 0,
            tabsKey: 'sts',
            config: { task: true },
            payload: { gid },
            tabsOnchange: val => {
                const { task } = BusinessConfig;
                task.tabsValue = +val;
                setBusinessConfig({ ...BusinessConfig });
            },
            rightOnclick: () => {
                const { tabs, tabsValue } = BusinessConfig.task;
                const path = tabs.find(el => el.key === tabsValue)?.path;
                if (!path) return false;
                router.push(path);
            },
            handleOnClick: () => {
                const { tabs, tabsValue } = BusinessConfig.task;
                const path = tabs.find(el => el.key === tabsValue)?.path;
                if (!path) return false;
                router.push(path);
            },
            EmptyProps: {
                image: require('./businessModule/image/renwu.png'),
                description: '暂无任务',
            },
        },
    });
    const { dispatch } = props;
    /* 权限 */
    // useEffect(() => {
    //
    // }, [PoweRefresh]);
    /* 权限 */

    // const ApprovalListProps = {
    //     task: true,
    //     TimeKey: 'lrsj',
    // };
    // useEffect(() => {
    //     let cancel = c => c;
    //     (async () => {
    //         const res = await _Post('mission/approvalList', { ...layPage, dbOrYb, gid }, cancel);
    //         SetApprovalList(res?.data || []);
    //     })();
    //     return () => cancel && cancel();
    // }, [dbOrYb]);
    // const tabsOnchange = value => {
    //     ApprovalListProps['TimeKey'] = value === '0' ? 'lrsj' : 'wcsj';
    //     SetDbOrYb(+value);
    // };
    /*任务中心*/
    const businessOnClick = (el = {}, callBack) => {
        const { has, id } = el;
        if (!has || !id) return false;
        SkipClick(el, callBack);
    };

    // 快捷入口的操作
    const setUserPersonalPermissions = async props => {
        const { values = {}, callback, type = 'add', el = {} } = props;

        let userPersonalPms = Power?.userPersonalPms?.map(el => {
            const { name, path } = el;
            return { pmsname: name, pmspath: path, ...el };
        });

        if (type === 'add') {
            // 添加数据
            // 会有编辑的数据 要替换
            const id = values?.id;
            const index = values?.index;
            if (id && index !== undefined) {
                userPersonalPms[index] = values;
            } else {
                userPersonalPms.push(values);
            }
        }
        if (type === 'del') {
            // 删除 id 对应的数据
            userPersonalPms = userPersonalPms.filter(elm => elm.id !== el?.id);
        }

        let cancel = c => c;
        const res = await _Post(
            'permission/setUserPersonalPermissions',
            { data: JSON.stringify(userPersonalPms) },
            cancel
        );
        if (res?.data) {
            // SetPoweRefresh(!PoweRefresh);
            dispatch({
                type: 'publicMethod/getPower',
                payload: {},
            });
            callback && callback();
        }
    };

    const Power = props?.publicMethod?.Power || {};

    return (
        <>
            <Row className={HomeCss.headerTop} gutter={[10, 10]}>
                <Col className={HomeCss.Carouse} span={18}>
                    <UseCarouselComponents />
                </Col>
                <Col className={HomeCss.fullH} span={6}>
                    <QuickEntry data={Power?.userPersonalPms} setUserPersonalPermissions={setUserPersonalPermissions} />
                </Col>
            </Row>
            <Row gutter={[10, 10]} className={`${HomeCss.mt10}`}>
                <Col span={8}>
                    <UseBusinessItem {...BusinessConfig.task} />
                    <div className={'mt10'}>
                        <UseBusinessItem {...BusinessConfig.notice} />
                    </div>
                </Col>
                <Col span={16}>
                    <Row gutter={[10, 10]}>
                        {Power?.hp && (
                            <Col span={15}>
                                <ShowBusiness data={Power?.hp} handleOnClick={businessOnClick} />
                            </Col>
                        )}
                        <Col span={9}>
                            <UseBusinessItem {...BusinessConfig.warn} />
                            {/*<div className={HomeCss.itemH}>*/}
                            {/*    <BusinessItem title={'预警中心'} data={warnList}  />*/}
                            {/*</div>*/}
                        </Col>
                        <Col span={15}>
                            <div className={HomeCss.itemH}>
                                <UseBusinessItem {...BusinessConfig.New} />
                            </div>
                        </Col>
                        <Col span={9}>
                            <UseBusinessItem {...BusinessConfig.plan} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

export default connect(({ publicMethod }) => ({
    publicMethod,
}))(Home);
