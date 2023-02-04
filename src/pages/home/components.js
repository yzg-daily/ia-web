import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Carousel, Tabs, Icon, Row, Col, Badge, Empty, Dropdown, Menu } from 'antd';
import { _Post } from '@/utils/method';
import { IconFont } from '@/pages/home/utils';
import * as datetime from '@/utils/datetime';
import Style from './qyComponents.less';

const CarouselStyle = {
    width: '100%',
    height: '100%',
};
const CarouselStyleImg = {
    width: '100%',
    height: '100%',
};
export const CarouselComponents = React.memo(props => {
    const { autoplay = false, data, publicPath, ...rest } = props;
    return (
        <Carousel style={CarouselStyle} autoplay={autoplay} {...rest}>
            {data &&
                data.map(({ url, uuid, fname }) => (
                    <img key={uuid} style={CarouselStyleImg} src={`${publicPath}${url}`} alt={fname} />
                ))}
        </Carousel>
    );
});
export const UseCarouselComponents = React.memo(props => {
    const { url = 'sysBanner/getStarBanner', payload = {}, ...rest } = props;
    const { publicPath } = window;
    const [data, setData] = useState([]);
    useEffect(() => {
        if (!url) return false;
        let cancel;
        const getData = async () => {
            const res = await _Post(url, payload, cancel);
            setData(res?.data);
        };
        getData();
        return () => cancel && cancel();
    }, []);
    return <CarouselComponents data={data} publicPath={publicPath} {...rest} />;
});

export const UseTabsComponents = React.memo(props => {
    const { data, onChange, size = 'small', mode = 'top', ...rest } = props;
    const { TabPane } = Tabs;
    return (
        <Tabs {...rest} onChange={onChange} size={size} tabPosition={mode}>
            {data &&
                data.length &&
                data.map(el => (
                    <TabPane {...el} tab={el?.title} key={el?.key}>
                        {el?.content}
                    </TabPane>
                ))}
        </Tabs>
    );
});

export const ItemHeader = React.memo(props => {
    // 3部分组成
    // 1 title 文件描述
    // 2 tabs 标签页 有颜色
    // 3 title + 箭头 (点击或者调整)
    const { title, menus = undefined, tabs = [], tabsOnchange = value => value, rightTitle, rightOnclick } = props;
    const handleMenuClick = useCallback(e => {
        const key = e?.key;
        if (key === 'more') {
            rightOnclick && rightOnclick();
        }
    });
    const menu = useMemo(() => (
        <Menu>
            {menus &&
                menus.map((el, index) => (
                    <Menu.Item key={index} onClick={el.onClick}>
                        {el.name}
                    </Menu.Item>
                ))}
            {!menus && (
                <Menu.Item key='more' onClick={rightOnclick}>
                    更多
                </Menu.Item>
            )}
        </Menu>
    ));
    return (
        <>
            <div>
                <Row type='flex' justify='space-between' className={Style.ItemHeader}>
                    <Col className={Style.Item}>
                        <div className={Style.ItemTitle}>{title}</div>
                    </Col>
                    {tabs && (
                        <Col className={`${Style.Item} ${Style.ItemTabs}`}>
                            <UseTabsComponents data={tabs} onChange={tabsOnchange} />
                        </Col>
                    )}
                    <Col className={`${Style.Item} ${Style.ItemRight}`}>
                        {/*onClick={rightOnclick}*/}
                        <div>
                            {rightTitle}
                            {/*<Icon type='right' />*/}
                            <Dropdown.Button overlay={menu} />
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
});

// 自定 icon antd api
const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2581740_mv15gf9see8.js',
});

const WarnList = React.memo(props => {
    const { status, moldName, areaName, grade = 0 } = props;
    const BadgeMap = {
        0: { count: '待', color: 'rgba(255, 169, 33, 1.5)', bg: 'rgba(255, 169, 33, .15)' },
        1: { count: '认', color: '#44BE90', bg: 'rgba(74, 255, 187, .15)' },
        2: { count: '整', color: '#FF4837', bg: 'rgba(255, 72, 55, .15)' },
        3: { count: '评', color: '#2267F8', bg: 'rgba(34, 103, 248, .15)' },
    };
    // const gradeColor =
    //     {
    //         0: '#3EBF4D',
    //         1: '#B7D800',
    //         2: '#FF9B24',
    //         3: '#FF2121',
    //     }[grade] || '#3EBF4D';
    const info = BadgeMap[status] || {};
    return (
        <>
            <div className={'wranList'}>
                <IconFont
                    type='icon-a-22_huaban1'
                    style={{ fontSize: '26px', color: ` ${info.color}`, verticalAlign: 'middle' }}
                />
                <span>
                    <Badge
                        count={info?.count || ''}
                        style={{ backgroundColor: info?.bg || '', color: info?.color, fontWeight: 'bold' }}
                    />
                    <span className={'text'}>
                        {moldName && (
                            <>
                                <span className={'sysname'}>【{moldName}】</span> 异常
                            </>
                        )}
                        {areaName && `,位于【${areaName}】`}
                    </span>
                </span>
            </div>
        </>
    );
});
const TaskList = React.memo(props => {
    const { sysname, title, sendtime, sts, stsdesc, wcsj, lrsj } = props;
    // let timeString = sts ? wcsj : lrsj;
    let lastText = sts ? stsdesc : ',请尽快处理';
    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <span>
                    <span className={'sysname'}>{sysname && `【${sysname}】`}</span>
                    <span className={'taskname'}>{title && `【${title}】`}</span>
                    {/* <span>{Treatment && (<span className={'qy-list-time'}>需要</span>)`【${Treatment}】`}</span> */}
                    <span className={'qy-list-time'}>{lastText}</span>
                </span>
                {<span className='qy-list-time'>{datetime.format(sendtime, 'yyyy-MM-dd')}</span>}
            </div>
        </>
    );
});
const NoticeList = React.memo(props => {
    const { title, lrsj, showsts } = props;
    const showstsMap = {
        2: '置顶',
        1: '最新',
    };
    return (
        <>
            <div className={'NoticeList'}>
                <span className='qy-list-badge-title'>
                    {showsts === 2 && <Badge className={`selfBadge selfBadgeWarn`}>{showstsMap[showsts]}</Badge>}
                    {title}
                </span>
                <span className='qy-list-time'>{datetime.format(lrsj, 'yyyy-MM-dd')}</span>
            </div>
        </>
    );
});
const HaveReadList = React.memo(props => {
    const { sts, sysname, title, sendName, sendtime } = props;

    const HaveReadMap = {
        1: <span className={'no-ready'}>未读</span>,
        2: <span className={'yes-ready'}>已读</span>,
        '1,2': <span className={'yes-ready'}>已读</span>,
    };
    return (
        <>
            <div className='HaveReadList'>
                <Badge className={'selfBadge'} dot={!sts}>
                    <span>{HaveReadMap[sts] || ''}</span>
                </Badge>
                <span className={'sysname'}>{sysname && `【${sysname}】`}</span>
                <span className='qy-list-title'>{title}</span>
                {<span className='qy-list-time'>{datetime.format(sendtime, 'yyyy-MM-dd')}</span>}
            </div>
        </>
    );
});
const PlanList = React.memo(props => {
    const { dwmc, hwmc, sl, ywlx } = props;

    return (
        <>
            <div className='planList'>
                <span className={'sysname'}>{dwmc && `【${dwmc}】`}</span>
                {(ywlx === 1 || ywlx === 2 || ywlx === 3) && (
                    <>
                        {hwmc && `计划发运【${hwmc}】`}
                        {sl && `共【${sl || 0}吨】`}
                    </>
                )}
                {ywlx === 4 && (
                    <>
                        {hwmc && `计划生产${hwmc}`}
                        {sl && `共${sl || 0}吨`}
                    </>
                )}
                {ywlx === 5 && (
                    <>
                        {sl && `计划生产原煤${sl || 0}吨`}
                        {hwmc && `计划掘进进尺${hwmc}`}{' '}
                    </>
                )}
            </div>
        </>
    );
});

/**
 * @param{Object} props  参数
 * */
export const List = React.memo(props => {
    /**
     *
     * @param {Array} data  渲染的数据
     * @param {Boolean} task  任务中心
     * @param {Boolean} HaveRead  显示是否已读
     * @param {Boolean} warn  是否显示预警
     * @param {Boolean} showTime  显示时间
     * @param {String} TimeKey  显示时间的key值 默认 ctime
     * @param {Function} onClick  Li的点击事件
     *
     * */
    const {
        data,
        HaveRead = false,
        warn = false,
        // showTime = false,
        notice = false,
        plan = false,
        TimeKey = 'ctime',
        handleOnClick = value => value,
        task = false,
        EmptyProps = {
            description: '暂无数据',
            image: undefined,
        },
        // children,
    } = props;

    const isEmpty = Boolean(data && data.length);
    return (
        <>
            {!isEmpty && <Empty {...EmptyProps} />}
            {isEmpty && (
                <ul className={`${Style.List} qy-list`}>
                    {data.map((el, index) => {
                        return (
                            <li key={el.id || index} onClick={() => handleOnClick(el)}>
                                {warn && <WarnList key={'warn'} {...el} />}

                                {task && <TaskList {...el} key={'task'} TimeKey={TimeKey} />}

                                {HaveRead && <HaveReadList {...el} key={'HaveRead'} TimeKey={TimeKey} />}

                                {notice && <NoticeList key={'notice'} {...el} />}

                                {plan && <PlanList key={'plan'} {...el} />}
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
});
