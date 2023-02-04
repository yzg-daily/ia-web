import React, { memo, useEffect, useMemo, useRef } from 'react';
import SalesModel from '@/components/businessComponent/SelfModal';
import Table from '@/components/businessComponent/Table';
import EditFrom from '@/components/EditFrom';

import * as api from './api';
import { tips } from '@/utils/utils';
import moment from 'moment';
const FormConfig = [
    {
        name: 'jssl',
        label: '结算数量',
        type: 'text',
        grid: 6 / 24,
        placeholder: '请输入结算数量...',
    },
    {
        name: 'kfsl',
        label: '扣罚数量',
        grid: 6 / 24,
        placeholder: '请输入扣罚数量...',
        required: true,
    },
    {
        name: 'jsdj',
        label: '结算单价',
        grid: 6 / 24,
        placeholder: '请输入结算单价...',
        required: true,
    },
    {
        name: 'kfje',
        label: '扣罚金额',
        grid: 6 / 24,
        placeholder: '请输入扣罚金额...',
        required: true,
    },
];
function Clearing(props) {
    const addRef = useRef();

    const selectedRowKeys = useRef();

    const tableProps = useMemo(
        () => ({
            unique: 'id',
            dataSource: [props?.row],
            columns: props?.columns || [],
        }),
        [props.row, props.id]
    );

    // 合同款项录入
    const ModelProps = useMemo(
        () => ({
            visible: props.visible,
            width: 1200,
            title: '合同结算',
            handleModalCancel: () => props?.handleModalCancel(false),
            handleModalOk,
        }),
        [props.visible]
    );
    useEffect(() => {
        if (!props.visible) {
            selectedRowKeys.current = null;
        }
    }, [props.visible]);

    // 新增
    function handleModalOk() {
        const form = addRef.current.props?.form;
        if (!form) return false;
        form.validateFieldsAndScroll(async (error, values) => {
            if (error) return false;
            const res = await api.save({
                ...values,
                id: props.row.id,
                query: true,
            });
            if (res?.data) {
                tips({ message: res?.msg || '操作成功', type: 'success' });
                props?.handleModalCancel(true);
            }
        });
    }

    return (
        <SalesModel {...ModelProps}>
            <Table {...tableProps} />
            <div style={{ marginBottom: 20 }} />
            <EditFrom controls={FormConfig} wrappedComponentRef={addRef} />
        </SalesModel>
    );
}

export default memo(Clearing);
