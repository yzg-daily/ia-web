import React, { useRef, useState } from 'react';
import { connect } from 'dva';
import PageIndex from '@/components/businessComponent/PageIndex';
import SalesModel from '@/components/businessComponent/SelfModal';
import EditFrom from '@/components/EditFrom';
import { ColumnsConfig, FormConfig, ModalFormConfig } from './config';
import * as api from './api';
import { Button, Modal } from 'antd';

import { tips } from '@/utils/utils';
import * as datetime from '@/utils/datetime';
// import print from 'print-js'

// import 'print-js/dist/print.css';
const format = 'yyyy-MM-dd hh:mm:ss';
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
                        tips({ message: res?.msg || '删除成功', type: 'success' });
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

    function printFun() {
        // print({
        //     printable: 'print-table',
        //     maxWidth: 1920,
        //     type: 'html',
        //     style: "color: green",
        //     header: '打印标题',
        //     targetStyles: ['*'], // 打印内容使用所有HTML样式，没有设置这个属性/值，设置分页打印没有效果
        // })
    }

    // function down() {}

    const btnList = [
        <Button key={'add'} type='primary' onClick={add}>
            新增
        </Button>,
        <Button key={'del'} type='danger' onClick={del}>
            删除
        </Button>,
        // <Button key={'down'} type='primary' onClick={down}>
        //     导出
        // </Button>,
        // <Button key={'print'} type='primary' onClick={printFun}>
        //     打印
        // </Button>,
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
        tableConfig: {
            onSelectChange,
        },
        formProps: {
            handleFormValuesFun(values = {}) {
                const { arvtime = [], addtime = [] } = values;
                return {
                    ...values,
                    arvtime: arvtime?.[0] ? datetime.format(arvtime?.[0], format) : undefined,
                    arvtime2: arvtime?.[1] ? datetime.format(arvtime?.[1], format) : undefined,
                    addtime: addtime?.[0] ? datetime.format(addtime?.[0], format) : undefined,
                    addtime2: addtime?.[1] ? datetime.format(addtime?.[1], format) : undefined,
                };
            },
        },
        format,
    };

    function handleModalCancel() {
        setVisible(false);
        setLoading(false);
        setRecord({});
    }

    const modelProp = {
        title: modelPropTitle.current,
        loading,
        visible,
        width: 800,
        handleModalCancel,
        handleModalOk: () => {
            const form = modelFormRef.current?.props?.form;
            if (form) {
                form.validateFields(async (error, values) => {
                    if (error) return false;
                    setLoading(true);
                    const { arvtime, ...rest } = values;
                    //
                    const res = await api.save({
                        query: true,
                        arvtime: datetime.format(arvtime, format),
                        ...rest,
                    });

                    setLoading(false);
                    if (res?.data) {
                        tips({ message: res?.msg || '添加成功', type: 'success' });
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

    return (
        <>
            <PageIndex {...prop} ref={PageIndexRef} />
            {visible && (
                <SalesModel {...modelProp}>
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
