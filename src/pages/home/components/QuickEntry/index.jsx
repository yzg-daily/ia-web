import React, { useState } from 'react';
import { ItemHeader } from '@/pages/home/components';
import { SkipClick } from '@/utils/method';
import { Col, Row, Spin, Button } from 'antd';
import { IconFont } from '@/pages/home/utils';
import SelfModal from '@/pages/home/components/SelfModal';
import SelfModalForm from '@/pages/home/components/SelfModalForm';

const ToDoList = props => {
    const { data = [], onCompile = index => index, onDel = index => index } = props;

    return (
        <>
            <ul>
                {data?.map((el, index) => (
                    <li key={el?.id || index} style={{ lineHeight: '24px' }}>
                        <span style={{ marginRight: '5px' }}> {el?.name || '未定义入口名称'}</span>
                        <span
                            style={{ marginRight: '5px', color: 'blue', cursor: 'pointer' }}
                            onClick={() => onCompile(el, index)}
                        >
                            编辑
                        </span>
                        <span
                            style={{ marginRight: '5px', color: 'blue', cursor: 'pointer' }}
                            onClick={() => onDel(el)}
                        >
                            删除
                        </span>
                    </li>
                ))}
            </ul>
        </>
    );
};

const QuickEntry = props => {
    const { data = [], several = 9, setUserPersonalPermissions } = props;
    const length = data?.length || 0;

    const [spinning, setSpinning] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleAdd, setVisibleAdd] = useState(false);

    const [record, setRecord] = useState(undefined);

    const rightOnclick = () => {
        setVisibleAdd(true);
    };

    const ModalFormConfig = {
        width: 500,
        zIndex: 1001,
        record,
        visible,
        loading: false,
        ModalFormConfig: [
            {
                name: 'pmsname',
                label: '入口名称',
                type: 'text',
                dataType: 'string',
                grid: 1,
                placeholder: '请输入名称...',
                required: true,
                layout: { labelSpan: 4, wrapperSpan: 18 },
                disabled: false,
            },
            {
                name: 'pmspath',
                label: '链接',
                type: 'text',
                dataType: 'string',
                grid: 1,
                placeholder: '支持内外部连接，连接需登录授权后可免登陆使用...',
                required: true,
                layout: { labelSpan: 4, wrapperSpan: 18 },
                disabled: false,
            },
        ],
        callBackValues: values => {
            setUserPersonalPermissions &&
                setUserPersonalPermissions({
                    values: {
                        ...(record || {}),
                        ...values,
                    },
                    type: 'add',
                    callback: () => {
                        record && setRecord(undefined);
                        setVisible(false);
                    },
                });
        },
        handleModalCancel: () => {
            record && setRecord(undefined);
            setVisible(false);
        },
    };

    const handleModalCancel = () => {
        setVisibleAdd(false);
    };
    const handleModalAdd = () => {};

    const SelfModalConfig = {
        width: 500,
        visible: visibleAdd,
        loading: false,
        footerType: 'props',
        footer: [
            {
                onClick: handleModalCancel,
                title: '关闭',
                key: 'handleModalCancel',
                // loading: Modaloading,
            },
            // {
            //     onClick: handleModalAdd,
            //     title: '提交',
            //     type: 'primary',
            //     key: 'handleAdd',
            //     // loading: Modaloading,
            // },
        ],
        handleModalCancel,
    };

    const onCompile = (el, index = undefined) => {
        const { name, path } = el;
        setRecord({ pmsname: name, pmspath: path, ...el, index });
        setVisible(true);
    };
    const onDel = el => {
        setUserPersonalPermissions &&
            setUserPersonalPermissions({
                type: 'del',
                el,
            });
    };
    const handleClick = el => {
        SkipClick(el, ({ status }) => {
            setSpinning(status);
        });
    };

    const defaultMenu = [{ name: '自定义', onClick: rightOnclick }];
    return (
        <>
            <div className='QuickEntry'>
                <ItemHeader title={'快捷入口'} menus={defaultMenu} rightOnclick={rightOnclick} />
                <Row className='QuickEntry-Row'>
                    <Spin spinning={spinning} style={{ height: '100%' }}>
                        {data &&
                            data?.map((el, index) => (
                                <Col span={6} key={el?.id || index} onClick={() => handleClick(el)}>
                                    <span>
                                        <IconFont className={'IconFont'} type='icon-a-11_huaban1' />
                                    </span>
                                    <span>{el?.name || '未定义'}</span>
                                </Col>
                            ))}
                    </Spin>
                </Row>
            </div>
            <SelfModalForm {...ModalFormConfig} />
            <SelfModal {...SelfModalConfig}>
                <ToDoList data={data} onCompile={onCompile} onDel={onDel} />
                {several > length && (
                    <div>
                        <Button type='primary' onClick={() => setVisible(true)}>
                            添加
                        </Button>
                        <span style={{ marginLeft: 10 }}>最多添加{several}个入口</span>
                    </div>
                )}
            </SelfModal>
        </>
    );
};

export default React.memo(QuickEntry);
