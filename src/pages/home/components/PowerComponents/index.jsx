import React, { useEffect, useRef, useState } from 'react';
import { SkipClick } from '@/utils/method';
import { Spin, Drawer } from 'antd';
import './qyIndex.less';
import router from 'umi/router';

const PowerComponents = props => {
    const { Power = {}, placement = 'top', handleOnClose = value => value, visible, setVisible } = props;
    const dom = useRef(undefined);
    useEffect(() => {
        dom.current = document.getElementsByClassName('ant-layout')?.[1];
    }, []);
    const [spinning, setSpinning] = useState(false);

    const { jtxt = [], qygl = [], ysgl = [], cgxt = [], scgl = [], aqjc = [], wzxt = [] } = Power || {};
    const allData = [jtxt, scgl, cgxt, ysgl, aqjc, qygl, wzxt];
    const textMap = ['综合管理', '生产管理', '购销管理', '物流管理', '安全管理', '办公管理', '物资系统'];

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
    const spanDom = el => (
        <span key={el.id} onClick={() => handleClick(el)} className={`has-${el?.has}`}>
            {el?.name}
        </span>
    );
    const liDom = el => (
        <li key={el.id} onClick={() => handleClick(el)} className={`has-${el?.has}`}>
            {el?.name}
        </li>
    );
    return (
        <>
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
                        allData.map((el, index) => (
                            <div className='qyDrawer-item' key={index}>
                                <p className='title'>{textMap[index]}</p>
                                <ul
                                    className='wrap'
                                    style={{ width: 150 * Math.ceil((el?.length > 4 ? el?.length : 4) / 4) }}
                                >
                                    {el?.map(elm => liDom(elm))}
                                </ul>
                            </div>
                        ))}
                </Spin>
            </Drawer>
        </>
    );
};
export default React.memo(PowerComponents);
