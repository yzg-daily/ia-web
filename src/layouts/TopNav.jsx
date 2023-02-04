import React, { useEffect, useRef, useState } from 'react';
import { SkipClick } from '@/utils/method';
import { Spin, Drawer, Icon } from 'antd';
import './TopNav.less';

// 自定 icon antd api
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3247397_919s2i5c2jc.js',
});
const PowerComponents = props => {
    const { Power = {}, placement = 'top', handleOnClose = value => value, visible, setVisible } = props;
    const dom = useRef(undefined);
    useEffect(() => {
        dom.current = document.getElementsByClassName('ant-layout')?.[1];
    }, []);
    const [spinning, setSpinning] = useState(false);

    const { jtxt = [], qygl = [], ysgl = [], ygzxjy = [], cgxt = [], scgl = [], aqjc = [], wzxt = [] } = Power || {};
    const allData = [jtxt, scgl, ygzxjy, cgxt, ysgl, aqjc, qygl, wzxt];
    const textMap = [
        '综合管理',
        '生产管理',
        '阳光在线交易',
        '购销管理',
        '物流管理',
        '安全管理',
        '办公管理',
        '物资系统',
    ];
    const icons = {
        p00018: 'icon-T_cheduiguanlixitong', // 车队管理系统
        p00032: 'icon-T_cangchuxitong', // 仓储系统
        p00020: 'icon-T_caigouguanlixitong', // 采购管理系统
        p00029: 'icon-T_anquanxunjianxitong', // 安全巡检系统
        p00047: 'icon-T_dazongcaigouxitong', // 大宗采购系统
        p00022: 'icon-T_dazongwuliaoxitong', // 大宗物料系统
        p00048: 'icon-T_dazongxiaoshouxitong', // 大宗销售系统
        p00019: 'icon-T_gangkouguanlixitong', // 港口管理系统
        p00016: 'icon-T_gongluwuliuxitong', // 公路物流系统
        p00023: 'icon-T_huayanguanlixitong', // 化验管理系统
        p00026: 'icon-T_tiaoduguanlixitong', // 调度管理系统
        p00009: 'icon-T_jingyingjianguanxitong', // 经营监管系统
        p00011: 'icon-T_jihuaguanlixitong', // 计划管理系统
        p00014: 'icon-T_renliguanlixitong', // 人力管理系统
        p00025: 'icon-T_shengchanguanlixitong', // 生产管理系统
        p00010: 'icon-T_shengchantiaoduanquan', // 生产调度安全
        p00049: 'icon-T_wuzicaigouxitong', // 物资采购系统
        p00031: 'icon-T_wuziguanlixitong', // 物资管理系统
        p00030: 'icon-T_yunyingcaiwuxitong', // 运营财务系统
        p00040: 'icon-T_zhihuidangjianxitong', // 智慧党建系统
        p00017: 'icon-T_zhihuizhantaixitong', // 智慧站台系统
        p00021: 'icon-T_xiaoshouguanlixitong', // 销售管理系统
        p00050: 'icon-crmkehuguanli', // 客户管理系统
        p00051: 'icon-T_cheduiguanlixitong', // 过磅管理系统
        p00038: 'icon-T_chaobiaoshuju', // 能耗抄表系统
    };

    textMap.forEach((text, index) => {
        const cur = allData[index];
        cur.isup = cur.some(item => item.isup === 1);
        cur.title = text;
    });

    const onClose = () => {
        handleOnClose && handleOnClose();
    };
    const handleClick = el => {
        SkipClick(el, ({ status }) => {
            setSpinning(status);
        });
        setVisible(false);
        // if (el.id === 'p00040') {
        //     let pcly = { pathname: '/home/smartPartyBuilding/gateway/gatewayHomepage' };
        //     router.push(pcly);
        // } else {
        //     SkipClick(el, ({ status }) => {
        //         setSpinning(status);
        //     });
        // }
    };

    const liDom = el =>
        el?.isup ? (
            <li key={el.id} onClick={() => handleClick(el)} className={`has-${el?.has}`}>
                <IconFont type={icons[el?.id]} /> {el?.name}
            </li>
        ) : null;

    return (
        <Drawer
            className={'qyDrawer'}
            placement={placement}
            closable={false}
            getContainer={dom.current}
            onClose={onClose}
            visible={visible}
        >
            <Spin spinning={spinning}>
                {allData &&
                    allData.map((el, index) =>
                        el.isup ? (
                            <div className='qyDrawer-item' key={index}>
                                <p className='title'>{el.title}</p>
                                <ul className='wrap'>{el?.map(elm => liDom(elm))}</ul>
                            </div>
                        ) : null
                    )}
            </Spin>
        </Drawer>
    );
};
export default React.memo(PowerComponents);
