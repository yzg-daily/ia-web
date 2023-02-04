import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import SalesModel from '@/components/businessComponent/SelfModal';
import Table from '@/components/businessComponent/Table';
import EditFrom from '@/components/EditFrom';
import { Button, Modal } from 'antd';
import { ColumnsConfig, FormConfig } from './config';
import * as api from './api';
import { tips, useUpdate } from '@/utils/utils';
import moment from 'moment';

function Entering(props) {
    const addRef = useRef();
    const tableRef = useRef();
    const selectedRowKeys = useRef();
    const Update = useUpdate();
    const [listid, setListId] = useState();

    useEffect(() => {
        if (props.row.id) {
            setListId(props.row.id);
        }
    }, [props.row.id]);

    const tableProps = useMemo(
        () => ({
            unique: 'id',
            getTableData: listid ? api.getTableData : null,
            columns: ColumnsConfig,
            payload: { listid },
            onSelectChange: keys => {
                selectedRowKeys.current = keys[0];
                Update();
            },
        }),
        [listid]
    );

    // 合同款项录入
    const EnteringProps = useMemo(
        () => ({
            visible: props.visible,
            width: 1000,
            title: '合同款项录入',
            handleModalCancel: () => props?.handleModalCancel(false),
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
                aos: 1,
                listid: props.row.id,
                arvtime: moment(values.arvtime).format('yyyy-MM-DD HH:mm:ss'),
                query: true,
            });
            if (res?.data) {
                tips({ message: res?.msg || '操作成功', type: 'success' });
                handleModalCancel();
                tableRef.current.refresh();
                // PageIndexRef?.current?.getTableData();
            }
        });
    }

    function handleModalCancel() {
        addProps.current.visible = false;
        selectedRowKeys.current = null;
        Update();
    }

    const addProps = useRef({
        visible: false,
        width: 1000,
        title: '新增',
        handleModalCancel,
    });

    function add() {
        addProps.current.visible = true;
        Update();
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
                        tableRef.current.refresh();
                        resolve();
                    } else {
                        reject();
                    }
                });
            },
        });
    }

    return (
        <SalesModel {...EnteringProps}>
            <div>
                <Button disabled={!listid} type={'primary'} onClick={add}>
                    新增
                </Button>
                <Button disabled={!selectedRowKeys.current} type={'danger'} style={{ marginLeft: 10 }} onClick={del}>
                    删除
                </Button>
            </div>
            <Table {...tableProps} ref={tableRef} selectedRowKeys={[selectedRowKeys.current]} />
            <SalesModel {...addProps.current} handleModalOk={handleModalOk}>
                <EditFrom controls={FormConfig} wrappedComponentRef={addRef} />
            </SalesModel>
        </SalesModel>
    );
}

export default memo(Entering);
