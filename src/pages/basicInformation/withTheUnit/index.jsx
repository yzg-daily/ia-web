import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import PageIndex from '@/components/businessComponent/PageIndex';
import SalesModel from '@/components/businessComponent/SelfModal';
import EditFrom from '@/components/EditFrom';
import { ColumnsConfig, FormConfig, ModalFormConfig } from './config';
import * as api from './api';
import { Alert, Button } from 'antd';
import { area } from '@/services/baseSetting';
import { tips } from '@/utils/utils';
const { publicEnms } = window;
const c = [
    {
        name: 'name',
        label: '单位搜索',
        type: 'NewSearch',
        dataType: 'string',

        placeholder: '请输入单位名称',
        layout: { labelSpan: 8, wrapperSpan: 14 },
        ops: {
            url: `${publicEnms}/comua/getComInfos`,
            callBackObject: true,
            changeBack: true,
        },
        OptionProps: {
            value: 'xydm',
            name: 'name',
        },
        style: {
            width: 200,
            marginRight: 60,
        },
    },
];

const Index = props => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState({});
    const modelPropTitle = useRef('');
    const modelFormRef = useRef('');
    const PageIndexRef = useRef('');
    const selectedRowKeys = useRef(null);

    const unique = 'id';

    function add() {
        modelPropTitle.current = '新增';
        setVisible(true);
    }

    function edit() {
        const id = selectedRowKeys.current;
        if (!id) {
            tips({ message: '请选择要操作的行' });
            return false;
        }
        const { dataSource } = PageIndexRef.current;
        const item = dataSource?.find(r => r[unique] === id);
        if (!item) {
            tips({ message: '数据异常', type: 'error' });
            return false;
        }
        const { pcainfo, ...rest } = item;
        modelPropTitle.current = '修改';
        setRecord({
            ...rest,
            areaid: [pcainfo?.pno, pcainfo?.cno, pcainfo?.ano],
        });
        ModalFormConfig[6].defaultValue = [pcainfo?.pno, pcainfo?.cno, pcainfo?.ano];
        setVisible(true);
    }

    useEffect(() => {
        if (visible) {
            area({}).then(res => {
                ModalFormConfig[6].data = res?.data || [];
            });
        }
    }, [visible]);

    const btnList = [
        <Button key={'add'} type='primary' onClick={add}>
            新增
        </Button>,
        <Button key={'edit'} type='primary' onClick={edit}>
            修改
        </Button>,
    ];

    function onSelectChange(Keys) {
        selectedRowKeys.current = Keys?.[0];
        console.log(selectedRowKeys);
    }

    const prop = {
        ...props,
        api,
        unique,
        ColumnsConfig,
        FormConfig,
        btnList,
        onSelectChange,
    };

    function handleModalCancel() {
        setVisible(false);
        setLoading(false);
        ModalFormConfig[0].disabled = true;
        ModalFormConfig[1].disabled = true;
        ModalFormConfig[3].disabled = true;
        ModalFormConfig[6].defaultValue = [];
        setRecord({});
    }

    const modelProp = {
        title: modelPropTitle.current,
        loading,
        visible,
        width: 900,
        handleModalCancel,
        handleModalOk: () => {
            const form = modelFormRef.current?.props?.form;
            if (form) {
                form.validateFields(async (error, values) => {
                    if (error) return false;
                    setLoading(true);
                    const { areaid, ...rest } = values;
                    const payload = {
                        query: true,
                        areaid: areaid?.slice(-1),
                        ...rest,
                    };
                    if (modelPropTitle.current === '修改') {
                        payload['id'] = selectedRowKeys.current;
                    }
                    const res = await api.save(payload);
                    console.log(res);
                    setLoading(false);
                    if (res?.data) {
                        tips({ message: res?.msg || `${modelPropTitle.current}成功`, type: 'success' });
                        handleModalCancel();
                        PageIndexRef?.current?.getTableData();
                    }
                });
            }
        },
    };

    function changeInput() {
        ModalFormConfig[0].disabled = false;
        ModalFormConfig[1].disabled = false;
        ModalFormConfig[3].disabled = false;
        modelFormRef.current?.props?.form.setFieldsValue();
    }

    function searchChange(ops) {
        if (ops?.xydm) {
            const prop = {
                name: ops?.name,
                sccode: ops.xydm,
                addr: ops?.addr,
            };
            const form = modelFormRef.current?.props?.form;
            if (form) {
                form.setFieldsValue(prop);
            } else {
                setRecord({
                    ...record,
                    ...prop,
                });
            }
        }
    }

    useEffect(() => {
        c[0].onChange = searchChange;
    }, []);

    return (
        <>
            <PageIndex {...prop} ref={PageIndexRef} />
            {visible && (
                <SalesModel {...modelProp}>
                    {modelPropTitle.current === '新增' && (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <EditFrom controls={c} />
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 10 }}>
                                <Button onClick={changeInput} type='primary' ghost>
                                    手工录入
                                </Button>
                                <Alert
                                    style={{ marginLeft: 10 }}
                                    message='如果搜索不到，请输入企业全称(至少三个字)。'
                                    type='info'
                                    showIcon
                                />
                            </div>
                        </div>
                    )}

                    <EditFrom controls={ModalFormConfig} record={record} wrappedComponentRef={modelFormRef} />
                </SalesModel>
            )}
        </>
    );
};
const connectFun = ({ login }) => ({
    userLogin: login,
});
export default connect(connectFun)(Index);
