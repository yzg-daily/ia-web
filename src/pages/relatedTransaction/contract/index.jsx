import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import PageIndex from '@/components/businessComponent/PageIndex';
import SalesModel from '@/components/businessComponent/SelfModal';
import EditFrom from '@/components/EditFrom';
import { ColumnsConfig, detailsConfig, FormConfig, ModalFormConfig } from './config';
import * as api from './api';
import { Button } from 'antd';
import Entering from './entering';
import Clearing from './Clearing';
import Invoice from './invoice';

import { tips, useUpdate } from '@/utils/utils';
import moment from 'moment';
import Table from '@/components/businessComponent/Table';

const unique = 'id';
const Index = props => {
    const update = useUpdate();

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState({});
    const modelPropTitle = useRef('');
    const modelFormRef = useRef('');
    const PageIndexRef = useRef('');
    const selectedRowKeys = useRef({
        id: undefined,
        row: {},
    });
    const [EnteringVisible, setEnteringVisible] = useState(false);
    const [ClearingVisible, setClearingVisible] = useState(false);
    const [InvoiceVisible, setInvoiceVisible] = useState(false);

    // 发运明细
    const seeData = useRef({
        modelProp: {
            visible: false,
            title: '派车明细',
            width: 1000,
            footerType: 'props',
            handleModalCancel: seeModalCancel,
            footer: [
                {
                    onClick: seeModalCancel,
                    title: '关闭',
                    key: 'handleModalCancel',
                },
            ],
        },
        tableProps: {
            unique: 'uuid',
            columns: detailsConfig,
            getTableData: api.details,
        },
    });

    function seeModalCancel() {
        const { tableProps } = seeData.current;
        seeData.current.modelProp.visible = false;
        seeData.current.tableProps = {
            ...tableProps,
            dataSource: [],
        };
        update();
    }

    // 详情
    function edit() {
        const { id, row = {} } = selectedRowKeys.current;

        if (!id) {
            tips({ message: '请选择要操作的数据' });
            return false;
        }
        const { kssj = null, jssj = null, ...rest } = row;
        setRecord({
            ...rest,
            kssj: null ? moment(kssj) : null,
            jssj: null ? moment(jssj) : null,
        });
        modelPropTitle.current = '修改';
        setVisible(true);
    }

    // 修改
    function details() {
        const { id, row = {} } = selectedRowKeys.current;

        if (!id) {
            tips({ message: '请选择要操作的数据' });
            return false;
        }
        ModalFormConfig[6].disabled = true;
        ModalFormConfig[8].disabled = true;
        ModalFormConfig[9].disabled = true;
        modelPropTitle.current = '详情';

        const { kssj = null, jssj = null, ...rest } = row;
        setRecord({
            ...rest,
            kssj: null ? moment(kssj) : null,
            jssj: null ? moment(jssj) : null,
        });
        setVisible(true);
    }

    // 发运明细
    function forwarding() {
        const id = selectedRowKeys.current.id;
        if (!id) {
            tips({ message: '请选择要操作的行' });
            return false;
        }

        seeData.current.modelProp.visible = true;
        update();
    }

    // 结算
    function ClearingFun() {
        const id = selectedRowKeys.current.id;
        if (!id) {
            tips({ message: '请选择要操作的行' });
            return false;
        }
        const { sts } = selectedRowKeys.current.row;
        if (sts === 2) {
            tips({ message: '合同已结算' });
            return false;
        }

        setClearingVisible(true);
    }

    // 开票
    function InvoiceFun() {
        const id = selectedRowKeys.current.id;
        if (!id) {
            tips({ message: '请选择要操作的行' });
            return false;
        }
        // const { sts } = selectedRowKeys.current.row;
        // if (sts === 2) {
        //     tips({ message: "合同已结算" });
        //     return false;
        // }

        setInvoiceVisible(true);
    }

    function del() {
        const id = selectedRowKeys.current;
        if (!id) {
            tips({ message: '请选择要操作的行' });
            return false;
        }

        Modal.confirm({
            title: '提示',
            content: `确定要删除选中的数据吗?`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                return new Promise(async (resolve, reject) => {
                    const res = await api.del({ id });
                    if (res?.data) {
                        tips({ message: res?.msg || '操作成功', type: 'success' });
                        PageIndexRef?.current?.getTableData();
                        resolve();
                    } else {
                        reject();
                    }
                });
            },
        });

        // const { dataSource } = PageIndexRef.current;
        // const item = dataSource?.find(r => r[unique] === id);
        // if (!item) {
        //     tips({ message: '数据异常', type: 'error' });
        //     return false;
        // }
        // const { pcainfo, ...rest } = item;
        // modelPropTitle.current = '修改';
        // setRecord({
        //     ...rest,
        //     areaid: [pcainfo?.pno, pcainfo?.cno, pcainfo?.ano],
        // });
        // ModalFormConfig[6].defaultValue = [pcainfo?.pno, pcainfo?.cno, pcainfo?.ano];
        // setVisible(true);
    }

    function handleModalCancel() {
        if (modelPropTitle.current === '详情') {
            ModalFormConfig[6].disabled = false;
            ModalFormConfig[8].disabled = false;
            ModalFormConfig[9].disabled = false;
        }
        setVisible(false);
        setLoading(false);
        setRecord({});
    }

    function handleModalOk() {
        const form = modelFormRef.current?.props?.form;
        if (form) {
            form.validateFields(async (error, values) => {
                if (error) return false;
                setLoading(true);
                const { kssj, jssj, ...rest } = values;
                //
                const res = await api.save({
                    query: true,
                    id: selectedRowKeys.current.id,
                    kssj: moment(kssj).format('yyyy-MM-DD HH:mm:ss'),
                    jssj: moment(jssj).format('yyyy-MM-DD HH:mm:ss'),
                    ...rest,
                });

                setLoading(false);
                if (res?.data) {
                    tips({ message: res?.msg || '操作成功', type: 'success' });
                    handleModalCancel();
                    PageIndexRef?.current?.getTableData();
                }
            });
        }
    }

    const modelProp = {
        title: modelPropTitle.current,
        loading,
        visible,
        width: 800,
        handleModalCancel,
        footer: [
            <Button onClick={handleModalCancel}>关闭</Button>,
            <>
                {modelPropTitle.current !== '详情' && (
                    <Button type={'primary'} onClick={handleModalOk}>
                        确认
                    </Button>
                )}
                ,
            </>,
        ],
    };

    function add() {
        const { id } = selectedRowKeys.current;
        if (!id) {
            tips({ message: '请选择要操作的数据' });
            return false;
        }
        setEnteringVisible(true);
    }

    const btnList = [
        <Button key={'add'} type='primary' onClick={add}>
            合同款项录入
        </Button>,
        <Button key={'edit'} type='primary' onClick={edit}>
            合同修改
        </Button>,
        <Button key={'details'} type='primary' onClick={details}>
            合同详情
        </Button>,
        <Button key={'details-1'} type='primary' onClick={forwarding}>
            发运明细
        </Button>,
        <Button key={'closeAccount'} type='primary' onClick={ClearingFun}>
            合同结算
        </Button>,
        <Button key={'invoice'} type='primary' onClick={InvoiceFun}>
            合同开票
        </Button>,
        // <Button key={"del"} type="danger" onClick={del}>
        //     删除
        // </Button>
    ];

    function onSelectChange(Keys, rows) {
        selectedRowKeys.current = {
            id: Keys?.[0],
            row: rows?.[0],
        };
    }

    function EnteringCancel() {
        selectedRowKeys.current = { id: null, row: [] };
        setEnteringVisible(false);
    }

    function ClearingCancel(status) {
        selectedRowKeys.current = { id: null, row: [] };
        if (status) {
            PageIndexRef?.current?.getTableData();
        }
        setClearingVisible(false);
    }

    function InvoiceCancel(status = false) {
        console.log(status, 'status');
        selectedRowKeys.current = { id: null, row: [] };
        if (status) {
            PageIndexRef?.current?.getTableData();
        }
        setInvoiceVisible(false);
    }

    const prop = {
        ...props,
        api,
        unique,
        ColumnsConfig,
        FormConfig,
        btnList,
        tableConfig: {
            onSelectChange,
        },
    };

    return (
        <>
            <PageIndex {...prop} ref={PageIndexRef} />

            <SalesModel {...modelProp}>
                <EditFrom controls={ModalFormConfig} record={record} wrappedComponentRef={modelFormRef} />
            </SalesModel>
            <SalesModel {...seeData.current.modelProp}>
                <Table {...seeData.current.tableProps} payload={{ id: selectedRowKeys.current.id }} />
            </SalesModel>
            <Entering {...selectedRowKeys.current} visible={EnteringVisible} handleModalCancel={EnteringCancel} />
            <Invoice {...selectedRowKeys.current} visible={InvoiceVisible} handleModalCancel={InvoiceCancel} />
            <Clearing
                {...selectedRowKeys.current}
                visible={ClearingVisible}
                handleModalCancel={ClearingCancel}
                columns={ColumnsConfig}
            />
        </>
    );
};
const connectFun = ({ login }) => ({
    userLogin: login,
});
export default connect(connectFun)(Index);
