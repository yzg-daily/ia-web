import React, { memo, useEffect, useMemo, useRef } from 'react';
import SalesModel from '@/components/businessComponent/SelfModal';
import Table from '@/components/businessComponent/Table';

import * as api from './api';
import { tips } from '@/utils/utils';

const columns = [
    {
        title: '合同编号',
        key: 'listno',
        dataIndex: 'listno',
        width: 200,
        display: true,
    },
    {
        title: '采购单位',
        key: 'cgfmc',
        dataIndex: 'cgfmc',
        width: 200,
        display: true,
    },
    {
        title: '销售单位',
        key: 'xsfmc',
        dataIndex: 'xsfmc',
        width: 200,
        display: true,
    },
    {
        title: '货物名称',
        key: 'hwmc',
        dataIndex: 'hwmc',
        width: 200,
        display: true,
    },
    {
        title: '规格型号',
        key: 'ggmc',
        dataIndex: 'ggmc',
        width: 200,
        display: true,
    },
    {
        title: '合同数量',
        key: 'fysl',
        dataIndex: 'fysl',
        width: 200,
        display: true,
    },
    {
        title: '发货数量',
        key: 'fhsl',
        dataIndex: 'fhsl',
        width: 200,
        display: true,
    },
    {
        title: '收货数量',
        key: 'shsl',
        dataIndex: 'shsl',
        width: 200,
        display: true,
    },
    {
        title: '款项类型',
        key: 'fklxName',
        dataIndex: 'fklxName',
        width: 100,
        display: true,
    },

    {
        title: '货物价格',
        key: 'dj',
        dataIndex: 'dj',
        width: 100,
        display: true,
    },
    {
        title: '合同预结金额',
        key: 'fyje',
        dataIndex: 'fyje',
        width: 150,
        display: true,
    },
    {
        title: '预结时间',
        key: 'lrsj',
        dataIndex: 'lrsj',
        width: 180,
        display: true,
    },
    {
        title: '结算数量',
        key: 'jssl',
        dataIndex: 'jssl',
        width: 100,
        display: true,
    },
    {
        title: '扣罚数量',
        key: 'kfsl',
        dataIndex: 'kfsl',
        width: 100,
        display: true,
    },
    {
        title: '结算单价',
        key: 'jsdj',
        dataIndex: 'jsdj',
        width: 100,
        display: true,
    },
    {
        title: '扣罚金额',
        key: 'kfje',
        dataIndex: 'kfje',
        width: 100,
        display: true,
    },
    {
        title: '合同实结金额',
        key: 'jsje',
        dataIndex: 'jsje',
        width: 150,
        display: true,
    },
    {
        title: '结算时间',
        key: 'jiessj',
        dataIndex: 'jiessj',
        width: 180,
        display: true,
    },
];

function Invoice(props) {
    const addRef = useRef();

    const selectedRowKeys = useRef();

    const tableProps = useMemo(
        () => ({
            unique: 'id',
            dataSource: props?.row ? [props?.row] : [],
            columns,
        }),
        [props.row, props.id]
    );

    // 合同款项录入
    const ModelProps = useMemo(
        () => ({
            visible: props.visible,
            width: 1200,
            title: '合同开票',
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
    async function handleModalOk() {
        const res = await api.save({
            id: props.row.id,
            query: true,
        });
        if (res?.data) {
            tips({ message: res?.msg || '操作成功', type: 'success' });
            props?.handleModalCancel(true);
        }
    }

    return (
        <SalesModel {...ModelProps}>
            <Table {...tableProps} />
        </SalesModel>
    );
}

export default memo(Invoice);
